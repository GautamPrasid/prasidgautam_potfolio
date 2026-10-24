import { cache } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
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

import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";

let serverClient: ReturnType<typeof createSupabaseJsClient> | null = null;

/**
 * Returns a Supabase client appropriately scoped for the execution environment:
 * - Server environment: stateless @supabase/supabase-js client without session/cookie listeners.
 * - Browser environment: @supabase/ssr createBrowserClient with browser storage and cookie support.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  if (typeof window === "undefined") {
    if (!serverClient) {
      serverClient = createSupabaseJsClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
    return serverClient;
  }

  return createBrowserClient(url, key);
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  siteName: "Prasid Gautam | Software Developer Portfolio",
  siteDescription:
    "Explore the portfolio of Prasid Gautam, a BCA student and software developer from Pokhara, Nepal, showcasing projects, skills, and experience in web development.",
  sectionContent: DEFAULT_SECTION_CONTENT,
  sectionVisibility: {},
};

export const getSiteSettingsFromDb = cache(async (): Promise<SiteSettingsData | null> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for site_settings. Using fallback settings.");
      return DEFAULT_SITE_SETTINGS;
    }

    const { data, error } = await client
      .from("site_settings")
      .select("site_name,site_description,logo_url,og_image_url,footer_text,section_content,section_visibility")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      console.warn("[supabase-db] Database query error in getSiteSettingsFromDb:", error.message);
      return DEFAULT_SITE_SETTINGS;
    }
    if (!data) return DEFAULT_SITE_SETTINGS;

    return {
      siteName: data.site_name ?? DEFAULT_SITE_SETTINGS.siteName,
      siteDescription: data.site_description ?? DEFAULT_SITE_SETTINGS.siteDescription,
      logoUrl: data.logo_url ?? undefined,
      ogImageUrl: data.og_image_url ?? undefined,
      footerText: data.footer_text ?? undefined,
      sectionContent: (data.section_content as SectionContentData) ?? undefined,
      sectionVisibility: (data.section_visibility as SectionVisibilityData) ?? {},
    };
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getSiteSettingsFromDb:", err);
    return DEFAULT_SITE_SETTINGS;
  }
});

export const getHeroAboutFromDb = cache(async (): Promise<HeroAboutData | null> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for hero_about.");
      return null;
    }

    const { data, error } = await client.from("hero_about").select("*").limit(1).maybeSingle();
    if (error) {
      console.warn("[supabase-db] Database query error in getHeroAboutFromDb:", error.message);
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
      availabilityText: data.availability_text ?? undefined,
      stats: data.stats ?? undefined,
    };
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getHeroAboutFromDb:", err);
    return null;
  }
});

export const getSocialLinksFromDb = cache(async (): Promise<SocialLinkItem[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for social_links.");
      return [];
    }

    const { data, error } = await client
      .from("social_links")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getSocialLinksFromDb:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((d) => ({
      id: d.id,
      platform: d.platform ?? "",
      url: d.url ?? "",
      iconName: d.icon_name ?? "Share2",
      orderIndex: d.order_index ?? 0,
    }));
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getSocialLinksFromDb:", err);
    return [];
  }
});

export const getSkillsFromDb = cache(async (): Promise<Skill[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for skills.");
      return [];
    }

    const { data, error } = await client
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getSkillsFromDb:", error.message);
      return [];
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getSkillsFromDb:", err);
    return [];
  }
});

export const getEducationFromDb = cache(async (): Promise<EducationItem[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for education.");
      return [];
    }

    const { data, error } = await client
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getEducationFromDb:", error.message);
      return [];
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getEducationFromDb:", err);
    return [];
  }
});

export const getExperienceFromDb = cache(async (): Promise<ExperienceItem[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for experience.");
      return [];
    }

    const { data, error } = await client
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getExperienceFromDb:", error.message);
      return [];
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getExperienceFromDb:", err);
    return [];
  }
});

export const getCertificationsFromDb = cache(async (): Promise<CertificationItem[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for certifications.");
      return [];
    }

    const { data, error } = await client
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getCertificationsFromDb:", error.message);
      return [];
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getCertificationsFromDb:", err);
    return [];
  }
});

export const getProjectsFromDb = cache(async (): Promise<Project[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for projects.");
      return [];
    }

    const { data, error } = await client
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getProjectsFromDb:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      tags: d.tags ?? [],
      image: d.image ?? undefined,
      screenshots: Array.isArray(d.screenshots) ? d.screenshots : [],
      github: d.github ?? undefined,
      demo: d.demo ?? undefined,
      category: d.category,
      featured: d.featured,
    }));
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getProjectsFromDb:", err);
    return [];
  }
});

/**
 * Public query: returns strictly published blog posts.
 * Used by all public-facing pages (home, blog archive, sitemap, layout).
 * Ensures unpublished drafts are filtered at the database level and never leaked in RSC payloads.
 */
export const getPublishedBlogsFromDb = cache(async (): Promise<BlogPost[]> => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for published blogs.");
      return [];
    }

    const { data, error } = await client
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getPublishedBlogsFromDb:", error.message);
      return [];
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getPublishedBlogsFromDb:", err);
    return [];
  }
});

/**
 * Admin query: returns all blog posts (including unpublished drafts).
 * Exclusively for use in the authenticated admin dashboard (/admin/blogs).
 */
export async function getAllBlogsForAdmin(): Promise<BlogPost[]> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for admin blogs.");
      return [];
    }

    const { data, error } = await client
      .from("blogs")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[supabase-db] Database query error in getAllBlogsForAdmin:", error.message);
      return [];
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getAllBlogsForAdmin:", err);
    return [];
  }
}

/**
 * Backward-compatibility alias: defaults to published-only for public safety.
 */
export const getBlogsFromDb = getPublishedBlogsFromDb;

export interface GetBlogBySlugOptions {
  publishedOnly?: boolean;
  client?: SupabaseClient;
}

export async function getBlogBySlug(
  slug: string,
  options: GetBlogBySlugOptions = { publishedOnly: true }
): Promise<BlogPost | null> {
  try {
    const client = options.client || getSupabaseClient();
    if (!client) {
      console.warn("[supabase-db] Missing Supabase configuration for getBlogBySlug.");
      return null;
    }

    const decoded = decodeURIComponent(slug);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(decoded);
    let query = client.from("blogs").select("*");
    if (isUuid) {
      query = query.or(`slug.eq."${decoded}",id.eq."${decoded}"`);
    } else {
      query = query.eq("slug", decoded);
    }

    if (options.publishedOnly !== false) {
      query = query.eq("published", true);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.warn("[supabase-db] Database query error in getBlogBySlug:", error.message);
      return null;
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
  } catch (err) {
    console.warn("[supabase-db] Unexpected error in getBlogBySlug:", err);
    return null;
  }
}
