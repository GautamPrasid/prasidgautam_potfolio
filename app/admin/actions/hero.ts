"use server";

import { revalidatePath } from "next/cache";
import { getActionClient, triggerRevalidateAll } from "./_shared";

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
  stats?: { projects: number; certifications: number; technologies: number };
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

  if (error) throw new Error(error.message);

  triggerRevalidateAll();
  return { success: true, data };
}
