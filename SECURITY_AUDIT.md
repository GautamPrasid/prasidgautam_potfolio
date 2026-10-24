# Security and production verification

This checklist distinguishes source review from checks that require access to the deployed site or Supabase project. Do not mark live checks complete without running them against the real environment.

## Source-review observations

- Admin Server Actions in `app/admin/actions.ts` use a shared `requireAdmin()` check that validates the Supabase user and looks up their ID in `public.admins` before using the service-role client. Review every newly added action to ensure it calls this guard before doing work.
- `middleware.ts` redirects unauthenticated and non-admin requests away from `/admin/:path*`. Middleware is only a navigation guard; every mutation must still authorize independently.
- The service-role key is documented as `SUPABASE_SERVICE_ROLE_KEY` (not `NEXT_PUBLIC_*`). Keep it in server-only modules and Vercel server environment variables. Never log it or return it to clients.
- `supabase/schema.sql` enables RLS on the 11 application tables. Public content is readable; admin writes use `public.is_admin()`; blog reads are limited to published posts for non-admins; messages have no public insert policy and are written through the server contact route.
- The `portfolio-assets` Storage bucket is public-read and admin-write. Files uploaded there, including PDFs, are therefore publicly accessible by URL. Do not store private documents in this bucket.
- `app/api/contact/route.ts` includes a 10 KB body cap, field validation, a honeypot, interaction timing check, and rate limiting. Its in-memory IP limiter is per serverless instance; database count-based limits can race under concurrent requests and should not be treated as a strict distributed limiter.

## Required checks before production release

### Security
- [ ] Inspect every exported function in `app/admin/actions.ts` and every other `"use server"` file; verify authorization happens inside each entry point before privileged work.
- [ ] With a non-admin account, request `/admin` and call each Server Action/API directly. Expect redirect/401/403 and no data mutation.
- [ ] Search client bundles and all `NEXT_PUBLIC_*` variables for service-role keys. Rotate immediately if one has ever been exposed.
- [ ] Run `supabase/schema.sql` against a staging project, then inspect actual `pg_policies` and `storage.objects` policies in Supabase. The SQL file alone does not prove the deployed database matches it.
- [ ] Test contact requests with invalid JSON/content type, absent/forged Content-Length, >10 KB bodies, invalid fields, honeypot values, rapid repeats, and concurrent submissions.
- [ ] Consider a durable atomic rate limiter (for example, a database RPC with transaction/locking or an edge rate-limit service) before relying on contact throttling against distributed traffic.

### Build and dependency quality
- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] `npm audit --omit=dev` and review advisories before upgrading dependencies.
- [ ] Review outdated packages separately; do not apply bulk upgrades without regression testing.

### Functional / data
- [ ] Verify admin login, logout, expiry, and denied access using real test accounts.
- [ ] Exercise create/update/publish/delete for each CMS section in staging.
- [ ] Upload profile image, logo, project image, and PDF; verify file-size/type rejection and resulting URLs.
- [ ] Confirm unpublished blogs are inaccessible to anonymous clients and published posts appear on the site and sitemap.
- [ ] Submit a contact message and verify database persistence plus useful error handling when Supabase is unavailable.

### SEO, accessibility, deployment
- [ ] Check title, description, canonical, Open Graph, favicon, `/sitemap.xml`, and `/robots.txt` on the live domain.
- [ ] Test broken links/images, browser console, and failed network requests.
- [ ] Test mobile/tablet layouts, keyboard-only navigation, visible focus, form labels, and contrast.
- [ ] Verify production environment variables and Vercel build/runtime logs without exposing secret values.

## CI

The GitHub Actions workflow in `.github/workflows/quality.yml` runs locked installation, type-checking, lint, production build, and a high-severity production dependency audit. A green CI run does not replace staging authorization, RLS, Storage, or browser testing.
