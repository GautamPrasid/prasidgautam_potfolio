/**
 * Centralized site URL resolver with production domain safety.
 *
 * Ensures:
 * 1. Accidental "localhost" values in NEXT_PUBLIC_SITE_URL do not leak into canonical
 *    tags, Open Graph URLs, or sitemaps in production.
 * 2. Vercel deployment URLs (VERCEL_URL) are supported as fallback.
 * 3. Default production domain fallback: https://www.prasidgautam.com.np
 */
export const DEFAULT_PRODUCTION_DOMAIN = "https://www.prasidgautam.com.np";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // In production, guard against leftover localhost or 127.0.0.1 settings
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
    return DEFAULT_PRODUCTION_DOMAIN;
  }

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // Fallback to Vercel system preview URL if present
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  return DEFAULT_PRODUCTION_DOMAIN;
}
