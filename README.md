# Prasid Gautam — Developer Portfolio

A full-stack developer portfolio built to present my background, skills, experience, projects, certifications, and writing in one place. The public website is powered by Supabase, while a protected admin dashboard lets me manage portfolio content without editing source code.

**Live website:** [prasidgautam.com.np](https://www.prasidgautam.com.np)

## Highlights

- **Database-driven content:** Portfolio sections are loaded from Supabase rather than maintained as static page content.
- **Admin content management:** Protected dashboard for managing profile details, skills, education, experience, certifications, projects, blog posts, social links, website settings, and contact messages.
- **Authentication and access control:** Supabase Auth with admin authorization and Row Level Security policies.
- **Project showcase:** Project descriptions, technologies, categories, featured items, repository/demo links, and image galleries.
- **Responsive interface:** Designed for desktop, tablet, and mobile screens.
- **Dark and light themes:** Theme preference is retained between visits.
- **Motion and interaction:** Framer Motion animations and interactive portfolio sections.
- **Contact form:** Receives visitor messages and stores them in Supabase.
- **SEO support:** Metadata, Open Graph information, canonical site URL, and sitemap support.
- **Deployable on Vercel:** Configured for a Next.js production deployment.

## Technology

| Area | Tools |
|---|---|
| Framework | Next.js 14 — App Router |
| Language | TypeScript |
| UI | React 18, Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend and database | Supabase, PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Hosting | Vercel |

## Project structure

```
app/
  (public)/       Public portfolio routes
  admin/          Protected admin dashboard and server actions
  api/contact/    Contact form endpoint
components/
  sections/       Portfolio page sections
  ui/             Reusable interface components
lib/              Database helpers and shared types
utils/supabase/   Supabase server, browser, and middleware clients
supabase/
  schema.sql      Database tables, indexes, and security policies
public/           Static assets
```

## Run locally

### 1. Requirements

- Node.js (LTS recommended)
- npm
- A Supabase project

### 2. Clone and install

```bash
git clone https://github.com/GautamPrasid/prasidgautam_potfolio.git
cd prasidgautam_potfolio
npm install
```

### 3. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. Create or configure your admin account according to the instructions in the SQL schema.
4. Configure the required environment variables below.

### 4. Environment variables

Create a `.env.local` file in the project root. Use `.env.local.example` as the template.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Keep `SUPABASE_SERVICE_ROLE_KEY` private. It must only be used in trusted server-side code and must never be exposed through a `NEXT_PUBLIC_` variable or committed to Git.

### 5. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The admin dashboard is available at [http://localhost:3000/admin](http://localhost:3000/admin) after signing in with an authorized admin account.

## Admin dashboard

The admin area provides content management for:

- Profile, introduction, biography, and resume
- Skills and categories
- Education and experience
- Certifications
- Projects, project images, tags, and links
- Blog posts and publication status
- Social links and their display order
- Website title, description, logo, social preview, and section visibility
- Contact form messages

Access is intended for authorized administrators only. Review the Supabase Row Level Security policies and server-side authorization before deploying.

## Quality checks

Run these commands before deployment:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Deployment

1. Import this repository into [Vercel](https://vercel.com).
2. Add the Supabase environment variables in the Vercel project settings.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://www.prasidgautam.com.np` (or your own production domain).
4. Deploy the project.

## Documentation

The repository includes a Mintlify configuration in `docs.json`. To preview the documentation locally, run:

```bash
npx mint dev
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) if present.
