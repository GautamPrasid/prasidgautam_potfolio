# Full-Stack Developer Portfolio — Antigravity Build Prompt
**For: BCA Student @ La Grande International College**
**Stack: Next.js + TypeScript + Tailwind + Framer Motion + Supabase + Cloudflare Pages**

---

## How to use this document
Don't paste the whole thing at once. Antigravity (and any agentic coding tool) works far more reliably when you build in **phases** — it can finish one working slice, you review it, then move to the next. Copy one phase block at a time into Antigravity as a fresh instruction, in order.

**Content architecture note:** This build now includes an admin panel (Phase 8), so all editable content — skills, education, experience, certifications, projects — ends up living in Supabase tables, not hardcoded arrays. To keep phases fast and testable, Phases 3–6 still start from a typed array in `/lib/data.ts` as **seed/fallback data**; Phase 8 migrates that data into Supabase and wires the public sections to fetch from the database, with the static array only used as a fallback if the fetch fails.

---

## 🔧 Phase 0 — Project Setup (do this first)

```
Create a new Next.js 14 project (App Router) with TypeScript and Tailwind CSS pre-configured.

Requirements:
- Use `create-next-app` conventions: /app directory structure
- Install and configure: framer-motion, lucide-react, @supabase/supabase-js, @supabase/ssr
- Set up ESLint + Prettier
- Create a clean folder structure:
  /app
  /components
  /components/ui
  /components/sections
  /lib
  /public/images
  /public/resume
  /types
- Add a `.env.local.example` file with placeholders for:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
- Set up a global design system in tailwind.config.ts: a consistent color palette (primary, accent, background, muted), font family (e.g. Inter or Space Grotesk from next/font), and spacing scale.
- Add dark mode support using Tailwind's `class` strategy with a toggle stored in localStorage.

Do not build any page content yet — just confirm the project runs with `npm run dev` and shows a blank styled homepage with dark mode toggle working.
```

---

## 🎨 Phase 1 — Design System & Layout Shell

```
Build the shared layout shell for the portfolio site.

1. Root layout (app/layout.tsx):
   - Sticky, glassmorphic navbar with smooth-scroll links to: Home, About, Skills, Education, Experience, Projects, Certifications, Contact
   - Mobile: collapse into a hamburger menu with a slide-in drawer (Framer Motion)
   - Dark/light mode toggle icon (Lucide `Sun`/`Moon`) in navbar
   - Active-section highlighting as the user scrolls (use IntersectionObserver)

2. Footer component:
   - Social media icons (GitHub, LinkedIn, Twitter/X, Instagram, Email) using lucide-react, opening in new tabs
   - Small "Built with Next.js & Tailwind" credit line
   - Back-to-top button (appears after scrolling down, smooth scroll to top)

3. Global UX details:
   - Add a subtle page-load animation (fade/slide in) using Framer Motion
   - Add a scroll progress bar at the very top of the page
   - Ensure full responsiveness at 375px, 768px, 1024px, 1440px breakpoints
   - Add proper semantic HTML and ARIA labels for accessibility

Keep sections as empty placeholder components for now (components/sections/*.tsx) — we'll fill them one at a time.
```

---

## 🙋 Phase 2 — Hero / About Me Section

```
Build the Hero section (components/sections/Hero.tsx):

- Large animated intro: "Hi, I'm [Name] 👋" with a typewriter/rotating text effect (Framer Motion or a simple custom hook) cycling through roles: "Full-Stack Developer", "BCA Student", "Problem Solver"
- Short 2-3 line bio paragraph
- Profile photo with a subtle animated gradient/blur ring behind it
- Two primary CTA buttons:
  1. "Hire Me" → smooth-scrolls to the Contact section
  2. "Download Resume" → downloads a PDF from /public/resume/resume.pdf (opens in new tab, triggers download)
- Social icon row (GitHub, LinkedIn, Email) with hover animations
- Entrance animation on scroll into view (Framer Motion `whileInView`)

Then build the About Me section (components/sections/About.tsx):
- A longer narrative: who I am, what I study (BCA at La Grande International College), what I'm passionate about, career goals
- A small stats row: e.g. "X Projects Completed", "Y Certifications", "Z Technologies" — as animated count-up numbers on scroll
- Keep layout as a two-column grid on desktop (text + image or illustration), stacked on mobile
```

---

## 🧠 Phase 3 — Skills & Abilities Section

```
Build the Skills section (components/sections/Skills.tsx):

- Group skills into categories: Languages, Frontend, Backend, Database, Tools/DevOps, Soft Skills
- Each skill as a card or chip with an icon (lucide-react or simple-icons via svg) and either:
  - a proficiency bar/circle with animated fill on scroll-into-view, OR
  - a clean tag/badge grid (simpler, often more elegant — pick this for cleaner UX)
- Store skills data in a typed array in /lib/data.ts so it's easy to edit later:
  interface Skill { name: string; category: string; icon: string; level?: number }
- Hover effect: slight lift + shadow on each skill card
- Responsive grid: 2 cols mobile, 3-4 cols desktop
```

---

## 🎓 Phase 4 — Education Section

```
Build the Education section (components/sections/Education.tsx):

- Vertical timeline layout (animated line that draws in on scroll)
- Each entry: institution name, degree/program, duration, short description
- Include: current BCA at La Grande International College, plus +School/earlier education
- Data-driven from /lib/data.ts (typed array), not hardcoded in JSX
- Timeline dots animate/pulse when scrolled into view
- Mobile: collapse to a single-column stacked card layout instead of a side timeline
```

---

## 💼 Phase 5 — Experience & Certifications

```
Build Experience section (components/sections/Experience.tsx):
- Similar timeline or card-based layout to Education
- Each entry: role, company/organization, duration, 2-3 bullet points of responsibilities/impact
- If no formal work experience yet, include: internships, freelance work, college club roles, hackathons

Build Certifications section (components/sections/Certifications.tsx):
- Card grid, each card: certificate title, issuing platform (e.g. Coursera, freeCodeCamp, Google, etc.), date, and a "View Certificate" link/button (opens PDF or credential URL in new tab)
- Optional: small badge/logo of the issuing platform
- Data-driven from /lib/data.ts

Both should use the same entrance animation pattern as previous sections for visual consistency.
```

---

## 💻 Phase 6 — Projects Section (GitHub-linked)

```
Build the Projects section (components/sections/Projects.tsx) — this is the most important section, give it extra polish:

- Fetch pinned/featured repos dynamically from the GitHub REST API (https://api.github.com/users/USERNAME/repos) via a Next.js Server Component or API route, OR use a static curated array if you prefer manual control over which projects show (recommend: manual array for a clean portfolio, with a live GitHub API "All Repos" link elsewhere)
- Each project card shows:
  - Project thumbnail/screenshot
  - Title + short description
  - Tech stack badges (small tags)
  - Two icon buttons: "GitHub" (repo link) and "Live Demo" (deployed link, if available)
  - Hover animation: image zoom or card lift
- Add a filter/tab bar above the grid: "All", "Web Apps", "Backend", "Mini Projects" etc.
- Add a "View All on GitHub" button linking to the full GitHub profile
- Data-driven from /lib/data.ts, typed as:
  interface Project { title: string; description: string; tags: string[]; image: string; github: string; demo?: string; category: string }
```

---

## ✉️ Phase 7 — Contact / Hire Me Section (Backend + Supabase)

```
Build the Contact section (components/sections/Contact.tsx) with a real working backend:

1. Frontend form: Name, Email, Subject, Message — with client-side validation (required fields, valid email format) and clear inline error states
2. On submit, call a Next.js Server Action (or API route at /app/api/contact/route.ts) that:
   - Validates input server-side too
   - Inserts the message into a Supabase table `messages` (id, name, email, subject, message, created_at)
   - Returns a success/error response
3. UX: show a loading spinner on the submit button while sending, a success toast/message on success, an error toast on failure — never let the button submit twice
4. Add a Supabase SQL snippet (as a comment or separate file /supabase/schema.sql) to create the `messages` table with Row Level Security enabled (insert-only from anon, no public read)
5. Also show direct contact options next to the form: email (mailto link), LinkedIn, phone/WhatsApp if desired
```

---

## 🔐 Phase 8 — Admin Panel (full CRUD for all content)

```
Build a password-protected admin panel that lets me add, edit, and delete content in every section without touching code.

1. AUTH
   - Use Supabase Auth (email + password), with only one allowed admin account (my own email — I will create it manually in the Supabase dashboard, do not build a public sign-up form)
   - Create /app/admin/login/page.tsx — a clean, minimal login form (email + password, error state for wrong credentials)
   - Protect every route under /app/admin/* with middleware.ts: check for a valid Supabase session server-side; redirect unauthenticated users to /admin/login
   - Add a "Logout" button in the admin layout

2. DATABASE SCHEMA (add to /supabase/schema.sql)
   Create one Supabase table per content type, each with an `order_index` column (integer) so items can be manually reordered, plus `created_at` / `updated_at`:
   - `hero_about`     — single row: name, tagline/roles (array), bio text, about_text, stats (jsonb: projects/certs/tech counts)
   - `skills`         — name, category, icon, level (nullable), order_index
   - `education`      — institution, degree, duration, description, order_index
   - `experience`     — role, organization, duration, bullets (jsonb array), order_index
   - `certifications` — title, issuer, date, credential_url, badge_image, order_index
   - `projects`       — title, description, tags (jsonb array), image_url, github_url, demo_url, category, featured (boolean), order_index
   - `messages`        — already exists from Phase 7 (contact form submissions) — admin will read these here too

   Enable Row Level Security on all tables:
   - Public (anon) role: SELECT only, on everything except `messages`
   - `messages`: anon can INSERT only, never SELECT
   - Authenticated admin: full SELECT/INSERT/UPDATE/DELETE on everything

3. ADMIN DASHBOARD (/app/admin/page.tsx)
   - Overview cards: total projects, skills, certifications, unread messages count
   - Sidebar or tab navigation to each content manager: Hero/About, Skills, Education, Experience, Certifications, Projects, Messages

4. GENERIC CRUD PATTERN — build one reusable pattern and apply it to every content type (Skills, Education, Experience, Certifications, Projects):
   - A table/list view of existing items (respecting order_index), each row with Edit and Delete icon buttons
   - An "Add New" button opening a modal or side panel with a form matching that content type's fields
   - Edit opens the same form pre-filled
   - Delete asks for confirmation (modal, not browser confirm()) before removing
   - Drag-and-drop or up/down arrow buttons to reorder items (updates order_index)
   - Image fields (project thumbnails, certification badges) upload directly to Supabase Storage — show a preview after upload, store the returned public URL
   - Show a success toast after every create/update/delete; show inline errors if a required field is missing
   - Use optimistic UI updates or at least a loading state on save/delete so it never feels frozen

5. HERO/ABOUT MANAGER — special case since it's a single row, not a list:
   - A simple form to edit: name, rotating role texts (add/remove tags), bio, about paragraph, and the three stat numbers
   - Live preview panel alongside the form showing roughly how it will look on the public site

6. MESSAGES INBOX (/app/admin/messages)
   - List of contact form submissions, newest first, with name/email/subject/date and a "mark as read" state (add an `is_read` boolean column)
   - Click to expand and read the full message
   - Delete button per message

7. WIRE THE PUBLIC SITE TO THE DATABASE
   - Update Hero, About, Skills, Education, Experience, Certifications, and Projects sections (built in Phases 2–6) to fetch their data server-side from the matching Supabase table (ordered by order_index) instead of the static array in /lib/data.ts
   - Keep the static array in /lib/data.ts as a fallback: if the Supabase fetch returns empty or errors, fall back to it so the site never shows a broken/empty section
   - Write a one-time seed script (/supabase/seed.ts or a SQL insert file) that pushes the current /lib/data.ts content into the new tables, so I don't have to retype everything by hand through the admin UI

8. UX DETAILS FOR THE ADMIN PANEL SPECIFICALLY
   - Keep the admin panel visually distinct from the public site (simpler, denser, no scroll animations) so it's fast and utilitarian to use
   - Fully responsive — I may need to fix a typo from my phone
   - Autosave is NOT required — explicit Save buttons are fine and safer for this use case
   - Add a "View Live Site" link in the admin nav that opens the public site in a new tab
```

---

## 🚀 Phase 9 — Polish, Performance & Deployment

```
Final polish pass:

1. SEO: add proper metadata (title, description, Open Graph image) in app/layout.tsx and per-section anchors
2. Performance: use next/image for all images with proper sizing, lazy-load below-the-fold sections, run a Lighthouse audit and fix anything scoring under 90
3. Accessibility: keyboard navigation works for the whole site, color contrast passes WCAG AA, all interactive elements have visible focus states
4. Add a simple loading skeleton for the Projects section while GitHub data fetches (if using the API approach)
5. Error boundaries + a custom 404 page matching the site's design

Deployment:
1. Push the project to GitHub (init repo, .gitignore for node_modules/.env.local)
2. Connect the GitHub repo to Cloudflare Pages, set build command `npm run build` and output directory as required by Next.js on Cloudflare (use @cloudflare/next-on-pages adapter if needed)
3. Add environment variables (Supabase URL/keys) in Cloudflare Pages project settings
4. Set up custom domain in Cloudflare DNS pointing to the Pages deployment
5. Confirm HTTPS is enforced and the site loads correctly on the custom domain

Give me the exact terminal commands and Cloudflare dashboard steps for this deployment phase.
```

---

## 📌 Tips for working with Antigravity efficiently
- **One phase per prompt.** Let it finish and run `npm run dev` to check before moving on — catching a bug in Phase 2 is much cheaper than in Phase 9.
- **Reuse the data files.** Everything content-based (skills, projects, education, certifications) starts in `/lib/data.ts` and migrates into Supabase in Phase 8 — ask Antigravity to keep it typed and centralized so the migration is a clean copy, not a rewrite.
- **Ask for a design review** after Phase 1: "Show me the layout shell and suggest 2-3 visual improvements" before you build content on top of it.
- **Keep a running `/docs/decisions.md`** — ask the agent to log any architectural choices it makes (e.g., why it picked manual project array over live GitHub API, or how it structured the admin schema) so you can explain your own project later in a viva/interview.
- **Test on mobile early**, not just at the end — resize the browser after every phase.
- **Before Phase 8**, create your one admin user manually in the Supabase dashboard (Authentication → Users → Add User) — do not let the agent build a public sign-up flow; a single hardcoded/pre-created admin account is both simpler and safer for a solo portfolio.
- **Rotate your Supabase keys** if you ever paste `.env.local` contents into a chat or public repo by mistake — the service role key in particular grants full database access.
