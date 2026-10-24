import type { MetadataRoute } from "next";
import { getSupabaseClient } from "@/lib/supabase-db";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let lastModified = new Date();

  try {
    const client = getSupabaseClient();
    if (client) {
      const { data } = await client
        .from("site_settings")
        .select("updated_at")
        .eq("id", true)
        .maybeSingle();

      if (data?.updated_at) {
        const parsed = new Date(data.updated_at);
        if (!isNaN(parsed.getTime())) {
          lastModified = parsed;
        }
      }
    }
  } catch {
    // Keep the current timestamp if site settings are unavailable.
  }

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const client = getSupabaseClient();
    if (client) {
      const { data: blogs } = await client
        .from("blogs")
        .select("slug, updated_at, published_at")
        .eq("published", true);

      if (Array.isArray(blogs)) {
        for (const blog of blogs) {
          if (!blog.slug) continue;
          let blogLastMod = lastModified;
          const ts = blog.updated_at || blog.published_at;
          if (ts) {
            const parsed = new Date(ts);
            if (!isNaN(parsed.getTime())) blogLastMod = parsed;
          }
          entries.push({
            url: `${siteUrl}/blog/${blog.slug}`,
            lastModified: blogLastMod,
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // If blogs cannot be queried, return root and /blog entries
  }

  return entries;
}
