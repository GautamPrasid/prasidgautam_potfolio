import { cache } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Skill,
  EducationItem,
  ExperienceItem,
  CertificationItem,
  Project,
  SocialLinkItem,
  BlogPost,
} from "./data";

export interface SectionHeadingItem {
  badge?: string;
  heading?: string;
  subtext?: string;
}

export interface SectionContentData {
  about?: SectionHeadingItem;
  skills?: SectionHeadingItem;
  projects?: SectionHeadingItem;
  resume?: SectionHeadingItem;
  blog?: SectionHeadingItem;
  contact?: SectionHeadingItem & {
    connectHeading?: string;
    ctaHeading?: string;
    ctaSubtext?: string;
  };
}

export const DEFAULT_SECTION_CONTENT: SectionContentData = {};

export type SectionVisibilityKey = "about" | "skills" | "projects" | "resume" | "blog" | "contact";
export type SectionVisibilityData = Partial<Record<SectionVisibilityKey, boolean>>;

export interface SiteSettingsData {
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  ogImageUrl?: string;
  footerText?: string;
  sectionContent?: SectionContentData;
  sectionVisibility?: SectionVisibilityData;
}

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
  availabilityText?: string;
  stats?: {
    projects: number;
    certifications: number;
    technologies: number;
  };
}

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const getSiteSettingsFromDb = cache(async (): Promise<SiteSettingsData | null> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for site_settings.");
  }

  const { data, error } = await client
    .from("site_settings")
    .select("site_name,site_description,logo_url,og_image_url,footer_text,section_content,section_visibility")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    console.error("[supabase-db] Database error in getSiteSettingsFromDb:", error);
    throw new Error(error.message || "Failed to load site settings.");
  }
  if (!data) return null;

  return {
    siteName: data.site_name ?? "",
    siteDescription: data.site_description ?? "",
    logoUrl: data.logo_url ?? undefined,
    ogImageUrl: data.og_image_url ?? undefined,
    footerText: data.footer_text ?? undefined,
    sectionContent: (data.section_content as SectionContentData) ?? undefined,
    sectionVisibility: (data.section_visibility as SectionVisibilityData) ?? {},
  };
});

export const getHeroAboutFromDb = cache(async (): Promise<HeroAboutData | null> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for hero_about.");
  }

  const { data, error } = await client.from("hero_about").select("*").limit(1).maybeSingle();
  if (error) {
    console.error("[supabase-db] Database error in getHeroAboutFromDb:", error);
    throw new Error(error.message || "Failed to load hero about data.");
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
    availabilityText: data.availability_text ?? undefined,
    stats: data.stats ?? undefined,
  };
});

export const getSocialLinksFromDb = cache(async (): Promise<SocialLinkItem[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for social_links.");
  }

  const { data, error } = await client
    .from("social_links")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getSocialLinksFromDb:", error);
    throw new Error(error.message || "Failed to load social links.");
  }
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    platform: d.platform ?? "",
    url: d.url ?? "",
    iconName: d.icon_name ?? "Share2",
    orderIndex: d.order_index ?? 0,
  }));
});

export const getSkillsFromDb = cache(async (): Promise<Skill[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for skills.");
  }

  const { data, error } = await client
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getSkillsFromDb:", error);
    throw new Error(error.message || "Failed to load skills.");
  }
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    iconName: d.icon_name,
    level: d.level,
    description: d.description,
  }));
});

export const getEducationFromDb = cache(async (): Promise<EducationItem[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for education.");
  }

  const { data, error } = await client
    .from("education")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getEducationFromDb:", error);
    throw new Error(error.message || "Failed to load education.");
  }
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    degree: d.degree,
    institution: d.institution,
    location: d.location,
    duration: d.duration,
    status: d.status,
    description: d.description,
    courses: d.courses ?? [],
  }));
});

export const getExperienceFromDb = cache(async (): Promise<ExperienceItem[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for experience.");
  }

  const { data, error } = await client
    .from("experience")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getExperienceFromDb:", error);
    throw new Error(error.message || "Failed to load experience.");
  }
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    role: d.role,
    company: d.company,
    location: d.location,
    duration: d.duration,
    type: d.type,
    bullets: d.bullets ?? [],
    technologies: d.technologies ?? [],
  }));
});

export const getCertificationsFromDb = cache(async (): Promise<CertificationItem[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for certifications.");
  }

  const { data, error } = await client
    .from("certifications")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getCertificationsFromDb:", error);
    throw new Error(error.message || "Failed to load certifications.");
  }
  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    title: d.title,
    issuer: d.issuer,
    date: d.date,
    credentialUrl: d.credential_url,
    skills: d.skills ?? [],
    issuerColor: d.issuer_color,
  }));
});

export const getProjectsFromDb = cache(async (): Promise<Project[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for projects.");
  }

  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getProjectsFromDb:", error);
    throw new Error(error.message || "Failed to load projects.");
  }
  if (!data) return [];

  return data.map((d) => ({
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
});

export const getBlogsFromDb = cache(async (): Promise<BlogPost[]> => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for blogs.");
  }

  const { data, error } = await client
    .from("blogs")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[supabase-db] Database error in getBlogsFromDb:", error);
    throw new Error(error.message || "Failed to load blogs.");
  }

  if (!data) return [];

  return data.map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.cover_image ?? undefined,
    category: d.category,
    tags: d.tags ?? [],
    readTime: d.read_time ?? "5 min read",
    published: d.published ?? true,
    publishedAt: d.published_at ?? undefined,
  }));
});

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("[supabase-db] Supabase client not initialized for getBlogBySlug.");
  }

  const decoded = decodeURIComponent(slug);
  const { data, error } = await client
    .from("blogs")
    .select("*")
    .or(`slug.eq."${decoded}",id.eq."${decoded}"`)
    .maybeSingle();

  if (error) {
    console.error("[supabase-db] Database error in getBlogBySlug:", error);
    throw new Error(error.message || "Failed to load blog by slug.");
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.cover_image ?? undefined,
    category: data.category,
    tags: data.tags ?? [],
    readTime: data.read_time ?? "5 min read",
    published: data.published ?? true,
    publishedAt: data.published_at ?? undefined,
  };
}
