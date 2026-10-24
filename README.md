# Developer Portfolio

A full-stack personal portfolio with a built-in CMS admin dashboard. Every piece of content — hero text, bio, skills, education, experience, certifications, projects, social links, and contact messages — is stored in Supabase and editable through a protected `/admin` panel. No content is hardcoded.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + custom CSS animations |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (profile photo, resume PDF, project images) |
| Icons | Lucide React |
| Deployment | Vercel |

## Features

- **Zero hardcoded content** — everything is pulled from Supabase at request time
- **Admin CMS** at `/admin` — CRUD for all portfolio sections
- **Row-Level Security** — only rows belonging to the authenticated admin are writable
- **Dynamic SEO** — `<title>`, `<meta description>`, and OpenGraph tags are generated from live DB data
- **Dark / Light mode** — persisted in `localStorage`, no flash on load
- **Contact form** — messages stored in Supabase `messages` table with email fallback
- **Scroll-triggered animations** — Framer Motion `whileInView` with SSR hydration handled correctly
- **Projects repository pagination** — starts with 4 projects and reveals up to 4 more per click using the **Load More Repos** button, with a live counter, progress bar, and animated cards
- **Skills pagination** — starts with 8 skills per category; **See More** reveals the remaining skills with a progress indicator, and **Show less** collapses the list
- **Category-aware pagination** — changing project or skill categories resets the visible list to its initial limit

## Project Structure

```
app/
  (public)         → Public portfolio pages
  admin/           → Protected CMS (layout, server actions, per-section pages)
  api/contact/     → Contact form API route
components/
  sections/        → HeroSection, AboutSection, SkillsSection, …
  ui/              → Shared UI primitives (AnimatedCounter, DynamicIcon, …)
  navbar, footer, page-wrapper, scroll-progress
lib/
  supabase-db.ts   → All read helpers (getHeroAboutFromDb, getSkillsFromDb, …)
  data.ts          → Shared TypeScript types
utils/supabase/    → Supabase SSR client helpers (server, client, middleware)
supabase/
  schema.sql       → Full schema + RLS policies (idempotent, safe to re-run)
```

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/GautamPrasid/prasidgautam_potfolio.git
cd prasidgautam_potfolio
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Run `supabase/schema.sql` in the **SQL Editor** (sets up all tables, RLS policies, and the `is_admin()` function)
3. After running the schema, follow the instructions at the top of `schema.sql` to insert your user ID into the `admins` table

### 3. Environment variables

Create `.env.local` in the project root:

```env
# Required for public data fetching and Supabase client
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for Admin CMS mutations and asset uploads (server-only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site domain (defaults to production domain if omitted in production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — contact form notification fallback
CONTACT_EMAIL=your@email.com
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) and log in with your Supabase account to edit content.

## Admin Panel

| Page | What it controls |
|------|-----------------|
| `/admin/hero` | Name, bio, roles, profile photo, resume PDF, GitHub/email |
| `/admin/social-links` | Social link entries with icons and ordering |
| `/admin/skills` | Skill cards with icons, categories, and proficiency levels |
| `/admin/education` | Education history timeline |
| `/admin/experience` | Work experience timeline |
| `/admin/certifications` | Certificates with issuer, date, credential URL |
| `/admin/projects` | Project showcase with uploads, links, tags, and category filters |
| `/admin/blogs` | Blog articles, Markdown editor, cover uploads, and draft/published toggle |
| `/admin/website-settings` | Site title, description, logo, social preview image, and section visibility |
| `/admin/messages` | Contact form inbox with read status management |

## Validation & Quality Checks

Run the following commands to verify code quality before deploying:

```bash
# Type check TypeScript definitions
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle with SSG / ISR verification
npm run build
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo into [Vercel](https://vercel.com)
3. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://www.prasidgautam.com.np`
4. Deploy — Next.js App Router with ISR (1-hour revalidation) and on-demand cache revalidation is supported out of the box.

## Documentation (Mintlify)

Project setup, content management, and deployment guides are available in the Mintlify docs. The docs configuration is at the repository root in `docs.json`; connect the repository in Mintlify with the repository root as the docs directory.

Preview the documentation locally from the repository root with:

```bash
npx mint dev
```

## License

MIT — feel free to fork and adapt for your own portfolio.
