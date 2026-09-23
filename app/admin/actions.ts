"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

async function getActionClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

function triggerRevalidateAll() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin");
  } catch (err) {
    console.error("Revalidation error:", err);
  }
}

/**
 * Server Action to revalidate public routes and admin dashboard cache
 */
export async function revalidatePublicPath(path: string = "/") {
  try {
    revalidatePath(path, "layout");
    revalidatePath(path);
    revalidatePath("/admin");
  } catch (err) {
    console.error("Revalidation error:", err);
  }
  return { success: true };
}

/**
 * Hero & About Server Actions
 */
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
}) {
  const supabase = await getActionClient();
  const { data, error } = await supabase.from("hero_about").upsert({
    id: payload.id || "a0000000-0000-0000-0000-000000000001",
    name: payload.name,
    roles: payload.roles,
    bio_text: payload.bio_text,
    about_text: payload.about_text,
    resume_url: payload.resume_url || null,
    profile_image_url: payload.profile_image_url || null,
    github_url: payload.github_url || null,
    contact_email: payload.contact_email || null,
    contact_phone: payload.contact_phone || null,
    location: payload.location || null,
    connect_heading: payload.connect_heading || "Connect With Me",
    highlights: payload.highlights || [],
    philosophy_quote: payload.philosophy_quote || null,
    response_time_text: payload.response_time_text || null,
    stats: payload.stats,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  triggerRevalidateAll();
  return { success: true, data };
}

/**
 * Social Links Server Actions
 */
export async function saveSocialLinkAction(payload: {
  id?: string;
  platform: string;
  url: string;
  icon_name: string;
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("social-")) {
    result = await supabase
      .from("social_links")
      .update({
        platform: payload.platform,
        url: payload.url,
        icon_name: payload.icon_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("social_links")
      .insert([
        {
          platform: payload.platform,
          url: payload.url,
          icon_name: payload.icon_name,
          order_index: payload.order_index ?? 0,
        },
      ])
      .select()
      .single();
  }

  if (result.error) {
    throw new Error(result.error.message);
  }

  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteSocialLinkAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true };
}

export async function reorderSocialLinksAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(
    updates.map((u) =>
      supabase.from("social_links").update({ order_index: u.order_index }).eq("id", u.id)
    )
  );

  triggerRevalidateAll();
  return { success: true };
}

/**
 * Skills Server Actions
 */
export async function saveSkillAction(payload: {
  id?: string;
  name: string;
  category: string;
  icon_name: string;
  level?: number;
  description?: string;
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("skill-")) {
    result = await supabase
      .from("skills")
      .update({
        name: payload.name,
        category: payload.category,
        icon_name: payload.icon_name,
        level: payload.level,
        description: payload.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("skills")
      .insert([
        {
          name: payload.name,
          category: payload.category,
          icon_name: payload.icon_name,
          level: payload.level,
          description: payload.description,
          order_index: payload.order_index ?? 0,
        },
      ])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);

  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteSkillAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true };
}

export async function reorderSkillsAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(
    updates.map((u) =>
      supabase.from("skills").update({ order_index: u.order_index }).eq("id", u.id)
    )
  );

  triggerRevalidateAll();
  return { success: true };
}

/**
 * Education Server Actions
 */
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
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("edu-")) {
    result = await supabase
      .from("education")
      .update({
        degree: payload.degree,
        institution: payload.institution,
        location: payload.location,
        duration: payload.duration,
        status: payload.status,
        description: payload.description,
        courses: payload.courses ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("education")
      .insert([
        {
          degree: payload.degree,
          institution: payload.institution,
          location: payload.location,
          duration: payload.duration,
          status: payload.status,
          description: payload.description,
          courses: payload.courses ?? [],
          order_index: payload.order_index ?? 0,
        },
      ])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);

  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteEducationAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true };
}

export async function reorderEducationAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(
    updates.map((u) =>
      supabase.from("education").update({ order_index: u.order_index }).eq("id", u.id)
    )
  );

  triggerRevalidateAll();
  return { success: true };
}

/**
 * Experience Server Actions
 */
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
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("exp-")) {
    result = await supabase
      .from("experience")
      .update({
        role: payload.role,
        company: payload.company,
        location: payload.location,
        duration: payload.duration,
        type: payload.type,
        bullets: payload.bullets,
        technologies: payload.technologies,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("experience")
      .insert([
        {
          role: payload.role,
          company: payload.company,
          location: payload.location,
          duration: payload.duration,
          type: payload.type,
          bullets: payload.bullets,
          technologies: payload.technologies,
          order_index: payload.order_index ?? 0,
        },
      ])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);

  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteExperienceAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true };
}

export async function reorderExperienceAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(
    updates.map((u) =>
      supabase.from("experience").update({ order_index: u.order_index }).eq("id", u.id)
    )
  );

  triggerRevalidateAll();
  return { success: true };
}

/**
 * Certifications Server Actions
 */
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
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("cert-")) {
    result = await supabase
      .from("certifications")
      .update({
        title: payload.title,
        issuer: payload.issuer,
        date: payload.date,
        credential_url: payload.credential_url,
        skills: payload.skills,
        issuer_color: payload.issuer_color,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("certifications")
      .insert([
        {
          title: payload.title,
          issuer: payload.issuer,
          date: payload.date,
          credential_url: payload.credential_url,
          skills: payload.skills,
          issuer_color: payload.issuer_color,
          order_index: payload.order_index ?? 0,
        },
      ])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);

  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteCertificationAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true };
}

export async function reorderCertificationsAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(
    updates.map((u) =>
      supabase.from("certifications").update({ order_index: u.order_index }).eq("id", u.id)
    )
  );

  triggerRevalidateAll();
  return { success: true };
}

/**
 * Projects Server Actions
 */
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
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("proj-")) {
    result = await supabase
      .from("projects")
      .update({
        title: payload.title,
        description: payload.description,
        tags: payload.tags,
        image: payload.image || null,
        github: payload.github || null,
        demo: payload.demo || null,
        category: payload.category,
        featured: payload.featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("projects")
      .insert([
        {
          title: payload.title,
          description: payload.description,
          tags: payload.tags,
          image: payload.image || null,
          github: payload.github || null,
          demo: payload.demo || null,
          category: payload.category,
          featured: payload.featured,
          order_index: payload.order_index ?? 0,
        },
      ])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);

  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteProjectAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true };
}

export async function reorderProjectsAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(
    updates.map((u) =>
      supabase.from("projects").update({ order_index: u.order_index }).eq("id", u.id)
    )
  );

  triggerRevalidateAll();
  return { success: true };
}

/**
 * Message Server Actions
 */
export async function toggleMessageReadAction(id: string, is_read: boolean) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("messages").update({ is_read }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
  return { success: true };
}
