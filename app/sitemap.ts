import type { MetadataRoute } from "next";
import { getSupabaseClient } from "@/lib/supabase-db";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

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

  // This portfolio is currently a single-page site. About, Skills, Projects,
  // Resume, Blog, and Contact are sections on "/", not separate page routes.
  // Do not add /admin, /admin/login, or API routes to the public sitemap.
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
