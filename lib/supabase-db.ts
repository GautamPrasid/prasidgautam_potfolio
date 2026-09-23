import { createBrowserClient } from "@supabase/ssr";
import {
  Skill,
  EducationItem,
  ExperienceItem,
  CertificationItem,
  Project,
  SocialLinkItem,
} from "./data";

export interface HeroAboutData {
  id?: string;
  name: string;
  roles: string[];
  bioText: string;
  aboutText: string;
  resumeUrl?: string;
  profileImageUrl?: string;
  githubUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  connectHeading?: string;
  highlights?: string[];
  philosophyQuote?: string;
  responseTimeText?: string;
  stats: {
    projects: number;
    certifications: number;
    technologies: number;
  };
}

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project-ref") || key.includes("your-anon-key")) {
    return null;
  }
  return createBrowserClient(url, key, {
    global: {
      fetch: (input, init) => {
        return fetch(input, {
          ...init,
          cache: "no-store",
        });
      },
    },
  });
}

export async function getHeroAboutFromDb(): Promise<HeroAboutData | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("hero_about")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[supabase-db] getHeroAboutFromDb error:", error.message, error.code, error.details);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      name: data.name ?? "",
      roles: Array.isArray(data.roles) ? data.roles : [],
      bioText: data.bio_text ?? "",
      aboutText: data.about_text ?? "",
      resumeUrl: data.resume_url ?? undefined,
      profileImageUrl: data.profile_image_url ?? undefined,
      githubUrl: data.github_url ?? undefined,
      contactEmail: data.contact_email ?? undefined,
      contactPhone: data.contact_phone ?? undefined,
      location: data.location ?? undefined,
      connectHeading: data.connect_heading ?? undefined,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      philosophyQuote: data.philosophy_quote ?? undefined,
      responseTimeText: data.response_time_text ?? undefined,
      stats: data.stats ?? { projects: 0, certifications: 0, technologies: 0 },
    };
  } catch (e) {
    console.error("[supabase-db] getHeroAboutFromDb threw:", e);
    return null;
  }
}

export async function getSocialLinksFromDb(): Promise<SocialLinkItem[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("social_links")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      platform: d.platform ?? "",
      url: d.url ?? "",
      iconName: d.icon_name ?? "Share2",
      orderIndex: d.order_index ?? 0,
    }));
  } catch {
    return [];
  }
}


export async function getSkillsFromDb(): Promise<Skill[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data) return [];

    const skills = data ?? [];
    return skills.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      iconName: d.icon_name,
      level: d.level,
      description: d.description,
    }));
  } catch {
    return [];
  }
}

export async function getEducationFromDb(): Promise<EducationItem[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data) return [];

    const education = data ?? [];
    return education.map((d) => ({
      id: d.id,
      degree: d.degree,
      institution: d.institution,
      location: d.location,
      duration: d.duration,
      status: d.status,
      description: d.description,
      courses: d.courses ?? [],
    }));
  } catch {
    return [];
  }
}

export async function getExperienceFromDb(): Promise<ExperienceItem[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data) return [];

    const experience = data ?? [];
    return experience.map((d) => ({
      id: d.id,
      role: d.role,
      company: d.company,
      location: d.location,
      duration: d.duration,
      type: d.type,
      bullets: d.bullets ?? [],
      technologies: d.technologies ?? [],
    }));
  } catch {
    return [];
  }
}

export async function getCertificationsFromDb(): Promise<CertificationItem[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data) return [];

    const certs = data ?? [];
    return certs.map((d) => ({
      id: d.id,
      title: d.title,
      issuer: d.issuer,
      date: d.date,
      credentialUrl: d.credential_url,
      skills: d.skills ?? [],
      issuerColor: d.issuer_color,
    }));
  } catch {
    return [];
  }
}

export async function getProjectsFromDb(): Promise<Project[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data) return [];

    const projects = data ?? [];
    return projects.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      tags: d.tags ?? [],
      image: d.image ?? undefined,
      github: d.github ?? undefined,
      demo: d.demo ?? undefined,
      category: d.category,
      featured: d.featured,
    }));
  } catch {
    return [];
  }
}
