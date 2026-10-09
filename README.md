# Prasid Gautam — Portfolio

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
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional — contact form email fallback
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
| `/admin/social-links` | Social link entries with icons |
| `/admin/skills` | Skill cards with icons and proficiency levels |
| `/admin/education` | Education history timeline |
| `/admin/experience` | Work experience timeline |
| `/admin/certifications` | Certificates with issuer, date, credential URL |
| `/admin/projects` | Project showcase with images, links, tags |
| `/admin/messages` | Contact form inbox |

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo into [Vercel](https://vercel.com)
3. Add the same environment variables from `.env.local` in **Project Settings → Environment Variables**
4. Deploy — Next.js is auto-detected, no extra config needed

## Documentation (Mintlify)

Project setup, content management, and deployment guides are available in the Mintlify docs. The docs configuration is at the repository root in `docs.json`; connect the repository in Mintlify with the repository root as the docs directory.

Preview the documentation locally from the repository root with:

```bash
npx mint dev
```

## License

MIT — feel free to fork and adapt for your own portfolio.
