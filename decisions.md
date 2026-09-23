# Architecture & Design Decisions

## 1. Zero Hardcoded Content
- **Decision:** All portfolio data (Hero/About text, bio, roles, skills, education, work experience, projects, certifications, social links, contact coordinates, metadata) is exclusively stored in and retrieved from Supabase Postgres tables (`hero_about`, `skills`, `education`, `experience`, `certifications`, `projects`, `social_links`, `messages`).
- **Rationale:** Prevents stale information, eliminates the need for code commits or rebuilds to update portfolio details, and ensures full ownership via the authenticated admin dashboard.

## 2. Server Action & Revalidation Pipeline
- **Decision:** All admin mutations (create, edit, delete, reorder) run as atomic Next.js Server Actions with authenticated Supabase client sessions in `app/admin/actions.ts`.
- **Pipeline:** `Admin edits field → Server Action saves to Supabase → triggerRevalidateAll() (revalidatePath("/", "layout"), revalidatePath("/"), revalidatePath("/admin")) → public page server-renders fresh data`.
- **Rationale:** Ensures that layout metadata, openGraph tags, footer social links, and every public page section are immediately revalidated across both Server-Side Rendering (SSR) and client cache without manual rebuilds or redeployments.

## 3. Dynamic Server-Side Rendering with Client Hydration
- **Decision:** `app/page.tsx` and `app/layout.tsx` enforce `export const dynamic = "force-dynamic"` and `export const revalidate = 0`. Server components prefetch data and pass initial props to client interactive sections (`HeroSection`, `AboutSection`, `SkillsSection`, etc.).
- **Rationale:** Guarantees instantaneous delivery of up-to-date HTML directly on the first byte (no layout shifts, no empty skeletons or 0 counters flashing), while preserving interactive client-side animations (Framer Motion, typewriter effects, active nav highlighting).

## 4. Graceful Null & Empty State Handling
- **Decision:** Any optional or empty field (e.g. absent phone number, missing resume link, empty project demo URL, no enrolled education record) is omitted cleanly rather than rendering broken links, empty rows, or placeholder text.
