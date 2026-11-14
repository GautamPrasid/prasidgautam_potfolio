import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSiteSettingsFromDb } from "@/lib/supabase-db";

export const dynamic = "force-dynamic";

const MAX_LOGO_BYTES = 512 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

async function readImageLimited(response: Response): Promise<Uint8Array | null> {
  const declaredLength = response.headers.get("content-length");
  if (declaredLength && /^\d+$/.test(declaredLength) && Number(declaredLength) > MAX_LOGO_BYTES) {
    return null;
  }
  if (!response.body) return null;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_LOGO_BYTES) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function GET() {
  try {
    const [siteSettings, configuredSupabaseUrl] = await Promise.all([
      getSiteSettingsFromDb(),
      Promise.resolve(process.env.NEXT_PUBLIC_SUPABASE_URL),
    ]);
    const logoUrl = siteSettings?.logoUrl?.trim();

    if (logoUrl && configuredSupabaseUrl) {
      const configuredOrigin = new URL(configuredSupabaseUrl);
      const target = new URL(logoUrl);

      // Only fetch public Storage objects from this project's configured Supabase origin.
      // No redirects are followed, preventing an allowed URL from redirecting to internal hosts.
      const isAllowed =
        configuredOrigin.protocol === "https:" &&
        target.protocol === "https:" &&
        target.origin === configuredOrigin.origin &&
        target.pathname.startsWith("/storage/v1/object/public/") &&
        !target.username &&
        !target.password;

      if (isAllowed) {
        const response = await fetch(target.toString(), {
          cache: "no-store",
          redirect: "error",
          signal: AbortSignal.timeout(5000),
        });

        const contentType = (response.headers.get("content-type") || "")
          .split(";")[0]
          .trim()
          .toLowerCase();

        if (response.ok && ALLOWED_IMAGE_TYPES.has(contentType)) {
          const bytes = await readImageLimited(response);
          if (bytes) {
            // Copy into a concrete ArrayBuffer so NextResponse receives a valid BodyInit.
            const responseBody = new ArrayBuffer(bytes.byteLength);
            new Uint8Array(responseBody).set(bytes);
            return new NextResponse(responseBody, {
              headers: {
                "Content-Type": contentType,
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
              },
            });
          }
        }
      }
    }
  } catch {
    // Fall back to the local icon if the database or configured image is unavailable.
  }

  try {
    const localIconPath = path.join(process.cwd(), "app", "icon.svg");
    if (fs.existsSync(localIconPath)) {
      const svgBuffer = fs.readFileSync(localIconPath);
      return new NextResponse(svgBuffer, {
        headers: {
          "Content-Type": "image/svg+xml",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }
  } catch {
    // Ignore fallback errors.
  }

  return new NextResponse(null, { status: 404 });
}
