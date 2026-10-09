"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

const HERO_DEFAULT_ID = "00000000-0000-0000-0000-000000000001";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 8 * 1024 * 1024;
const ASSETS_BUCKET = "portfolio-assets";

function isValidUuid(id?: string): boolean {
  return !!id && UUID_REGEX.test(id);
}

function revalidateAllPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false as const, message: "Authentication required.", supabase };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return { ok: false as const, message: "Unauthorized access.", supabase };
  }

  const adminClient = createAdminClient();
  return { ok: true as const, user, supabase: adminClient };
}

function getStoragePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${ASSETS_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  try {
    return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
  } catch {
    return null;
  }
}

async function removeStorageFile(
  supabase: ReturnType<typeof createClient>,
  url: string | null | undefined
) {
  const path = getStoragePathFromUrl(url);
  if (!path) return;
  await supabase.storage.from(ASSETS_BUCKET).remove([path]);
}

export async function uploadAssetAction(formData: FormData): Promise<ActionResult<{ publicUrl: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const file = formData.get("file");
  const folder = String(formData.get("folder") || "uploads");
  const previousUrl = String(formData.get("previousUrl") || "");
  const allowedFolders = new Set(["profile", "resume", "projects", "blogs"]);

  if (!(file instanceof File)) {
    return { success: false, message: "No file provided." };
  }
  if (!allowedFolders.has(folder)) {
    return { success: false, message: "Invalid upload destination." };
  }

  if (folder === "resume") {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return { success: false, message: "Resume file must be a PDF." };
    }
    if (file.size > MAX_PDF_BYTES) {
      return { success: false, message: "PDF size must be 8MB or less." };
    }
  } else {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return { success: false, message: "Image must be JPEG, PNG, WebP, or GIF." };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { success: false, message: "Image size must be 5MB or less." };
    }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || (folder === "resume" ? "pdf" : "jpg");
  const filePath = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await auth.supabase.storage
    .from(ASSETS_BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  if (previousUrl) {
    await removeStorageFile(auth.supabase, previousUrl);
  }

  const {
    data: { publicUrl },
  } = auth.supabase.storage.from(ASSETS_BUCKET).getPublicUrl(filePath);

  return { success: true, message: "File uploaded successfully.", data: { publicUrl } };
}

export async function saveHeroAboutAction(payload: {
  id?: string;
  name: string;
  roles: string[];
  bio_text: string;
  about_text: string;
  resume_url?: string | null;
  profile_image_url?: string | null;
  github_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  location?: string | null;
  connect_heading?: string | null;
  highlights?: string[];
  philosophy_quote?: string | null;
  response_time_text?: string | null;
  stats?: {
    projects: number;
    certifications: number;
    technologies: number;
  };
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const row = {
    name: payload.name.trim(),
    roles: payload.roles,
    bio_text: payload.bio_text,
    about_text: payload.about_text,
    resume_url: payload.resume_url || null,
    profile_image_url: payload.profile_image_url || null,
    github_url: payload.github_url || null,
    contact_email: payload.contact_email || null,
    contact_phone: payload.contact_phone || null,
    location: payload.location || null,
    connect_heading: payload.connect_heading || null,
    highlights: payload.highlights || [],
    philosophy_quote: payload.philosophy_quote || null,
    response_time_text: payload.response_time_text || null,
    stats: payload.stats ?? null,
  };

  const { data: existing, error: fetchError } = await auth.supabase
    .from("hero_about")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return { success: false, message: fetchError.message };
  }

  if (existing?.id) {
    const { error } = await auth.supabase.from("hero_about").update(row).eq("id", existing.id);
    if (error) return { success: false, message: error.message };
  } else {
    const { error } = await auth.supabase.from("hero_about").insert({ id: HERO_DEFAULT_ID, ...row });
    if (error) return { success: false, message: error.message };
  }

  revalidateAllPaths();
  return { success: true, message: "Saved successfully." };
}

async function upsertRow(
  table: string,
  id: string | undefined,
  values: Record<string, unknown>,
  insertExtras: Record<string, unknown>
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  if (isValidUuid(id)) {
    const { data, error } = await auth.supabase
      .from(table)
      .update(values)
      .eq("id", id)
      .select("id")
      .single();

    if (error) return { success: false, message: error.message };
    revalidateAllPaths();
    return { success: true, message: "Saved successfully.", data };
  }

  const { data, error } = await auth.supabase
    .from(table)
    .insert([{ ...values, ...insertExtras }])
    .select("id")
    .single();

  if (error) return { success: false, message: error.message };
  revalidateAllPaths();
  return { success: true, message: "Saved successfully.", data };
}

async function deleteRow(table: string, id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const { error } = await auth.supabase.from(table).delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidateAllPaths();
  return { success: true, message: "Deleted successfully." };
}

async function reorderRows(
  table: string,
  updates: { id: string; order_index: number }[]
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const results = await Promise.all(
    updates.map((item) =>
      auth.supabase.from(table).update({ order_index: item.order_index }).eq("id", item.id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, message: failed.error.message };

  revalidateAllPaths();
  return { success: true, message: "Reordered successfully." };
}

export async function saveSocialLinkAction(payload: {
  id?: string;
  platform: string;
  url: string;
  icon_name: string;
  order_index?: number;
}) {
  return upsertRow(
    "social_links",
    payload.id,
    {
      platform: payload.platform,
      url: payload.url,
      icon_name: payload.icon_name,
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteSocialLinkAction(id: string) {
  return deleteRow("social_links", id);
}

export async function reorderSocialLinksAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("social_links", updates);
}

export async function saveSkillAction(payload: {
  id?: string;
  name: string;
  category: string;
  icon_name: string;
  level?: number;
  description?: string;
  order_index?: number;
}) {
  return upsertRow(
    "skills",
    payload.id,
    {
      name: payload.name,
      category: payload.category,
      icon_name: payload.icon_name,
      level: payload.level,
      description: payload.description,
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteSkillAction(id: string) {
  return deleteRow("skills", id);
}

export async function reorderSkillsAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("skills", updates);
}

export async function saveEducationAction(payload: {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  status: string;
  description: string;
  courses?: string[];
  order_index?: number;
}) {
  return upsertRow(
    "education",
    payload.id,
    {
      degree: payload.degree,
      institution: payload.institution,
      location: payload.location,
      duration: payload.duration,
      status: payload.status,
      description: payload.description,
      courses: payload.courses ?? [],
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteEducationAction(id: string) {
  return deleteRow("education", id);
}

export async function reorderEducationAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("education", updates);
}

export async function saveExperienceAction(payload: {
  id?: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  bullets: string[];
  technologies: string[];
  order_index?: number;
}) {
  return upsertRow(
    "experience",
    payload.id,
    {
      role: payload.role,
      company: payload.company,
      location: payload.location,
      duration: payload.duration,
      type: payload.type,
      bullets: payload.bullets,
      technologies: payload.technologies,
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteExperienceAction(id: string) {
  return deleteRow("experience", id);
}

export async function reorderExperienceAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("experience", updates);
}

export async function saveCertificationAction(payload: {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credential_url: string;
  skills: string[];
  issuer_color?: string;
  order_index?: number;
}) {
  return upsertRow(
    "certifications",
    payload.id,
    {
      title: payload.title,
      issuer: payload.issuer,
      date: payload.date,
      credential_url: payload.credential_url,
      skills: payload.skills,
      issuer_color: payload.issuer_color,
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteCertificationAction(id: string) {
  return deleteRow("certifications", id);
}

export async function reorderCertificationsAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("certifications", updates);
}

export async function saveProjectAction(payload: {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  image?: string | null;
  github?: string | null;
  demo?: string | null;
  category: string;
  featured: boolean;
  order_index?: number;
}) {
  return upsertRow(
    "projects",
    payload.id,
    {
      title: payload.title,
      description: payload.description,
      tags: payload.tags,
      image: payload.image || null,
      github: payload.github || null,
      demo: payload.demo || null,
      category: payload.category,
      featured: payload.featured,
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const { data, error: fetchError } = await auth.supabase
    .from("projects")
    .select("image")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { success: false, message: fetchError.message };

  const { error } = await auth.supabase.from("projects").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  await removeStorageFile(auth.supabase, data?.image);
  revalidateAllPaths();
  return { success: true, message: "Deleted successfully." };
}

export async function reorderProjectsAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("projects", updates);
}

export async function toggleMessageReadAction(id: string, is_read: boolean): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const { error } = await auth.supabase.from("messages").update({ is_read }).eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/messages");
  return { success: true, message: "Message status updated." };
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const { error } = await auth.supabase.from("messages").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/messages");
  return { success: true, message: "Message deleted." };
}

export async function saveBlogAction(payload: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  category: string;
  tags: string[];
  read_time: string;
  published: boolean;
  order_index?: number;
}) {
  return upsertRow(
    "blogs",
    payload.id,
    {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      cover_image: payload.cover_image || null,
      category: payload.category,
      tags: payload.tags,
      read_time: payload.read_time,
      published: payload.published,
    },
    { order_index: payload.order_index ?? 0 }
  );
}

export async function deleteBlogAction(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, message: auth.message };

  const { data, error: fetchError } = await auth.supabase
    .from("blogs")
    .select("cover_image")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { success: false, message: fetchError.message };

  const { error } = await auth.supabase.from("blogs").delete().eq("id", id);
  if (error) return { success: false, message: error.message };

  await removeStorageFile(auth.supabase, data?.cover_image);
  revalidateAllPaths();
  return { success: true, message: "Deleted successfully." };
}

export async function reorderBlogsAction(updates: { id: string; order_index: number }[]) {
  return reorderRows("blogs", updates);
}
