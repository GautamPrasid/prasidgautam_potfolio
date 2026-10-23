import { NextResponse } from "next/server";
import { getSiteSettingsFromDb } from "@/lib/supabase-db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteSettings = await getSiteSettingsFromDb();
    const logoUrl = siteSettings?.logoUrl?.trim();

    if (logoUrl && (logoUrl.startsWith("http://") || logoUrl.startsWith("https://"))) {
      const res = await fetch(logoUrl, { cache: "no-store" });
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "image/png";
        const buffer = await res.arrayBuffer();

        // Serve the logo directly from this domain without Supabase's `x-robots-tag: none`
        // so that Googlebot-Image and browsers can use it as the search favicon.
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch custom favicon from logoUrl:", err);
  }

  // Fallback to local icon.svg if DB logo is not set or unreachable
  try {
    const localIconPath = path.join(process.cwd(), "app", "icon.svg");
    if (fs.existsSync(localIconPath)) {
      const svgBuffer = fs.readFileSync(localIconPath);
      return new NextResponse(svgBuffer, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }
  } catch {
    // Ignore fallback errors
  }

  return new NextResponse(null, { status: 404 });
}
