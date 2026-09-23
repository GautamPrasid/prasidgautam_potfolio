# Project Memory — Portfolio Website
**Paste this at the start of every new Antigravity session, before your phase prompt.**
Keep this file updated as you go — after each phase, update the "Progress Log" section yourself (or ask Antigravity to do it) so the next session picks up exactly where you left off.

---

## 🧠 Context for the agent

```
You are continuing work on an existing project. Read this memory file fully before doing anything.
Do not re-scaffold, re-initialize, or restructure the project — build on top of what already exists.
If something described here doesn't match what's actually in the codebase, stop and ask me before changing anything.
```

---

## 📋 Project Identity

- **Project name:** [e.g. yourname-portfolio]
- **Owner:** [Your Name], BCA student at La Grande International College
- **Purpose:** Personal full-stack developer portfolio — showcases projects, skills, education, experience, certifications; includes a working contact form
- **Repo:** [GitHub repo URL once created]
- **Live domain:** [your domain once deployed, or "not yet deployed"]

## 🔧 Confirmed Tech Stack (do not change without asking)

| Part | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Next.js API Routes / Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (not yet used — reserved for future admin panel) |
| Hosting | Cloudflare Pages |
| DNS | Cloudflare DNS |
| Version Control | Git + GitHub |

## 📁 Folder Structure (as established in Phase 0)

```
/app
/components
/components/ui
/components/sections
/lib          ← data.ts lives here (skills, projects, education, etc. as typed arrays)
/types
/public/images
/public/resume
/supabase     ← schema.sql for the messages table
```

## 🎨 Design Decisions Locked In

- Font: [e.g. Inter via next/font]
- Color palette: [e.g. primary #___, accent #___, background #___]
- Dark mode: class-based, toggle stored in localStorage
- Section order: Hero → About → Skills → Education → Experience → Certifications → Projects → Contact → Footer
- Animation style: fade/slide `whileInView` entrance on every section, consistent timing (~0.5-0.6s)

## ✅ Progress Log
*(update after each session — keep entries short)*

- [x] Phase 0 — Project setup, dark mode, folder structure ✅ [date]
- [ ] Phase 1 — Layout shell (navbar, footer)
- [ ] Phase 2 — Hero + About
- [ ] Phase 3 — Skills
- [ ] Phase 4 — Education
- [ ] Phase 5 — Experience + Certifications
- [ ] Phase 6 — Projects
- [ ] Phase 7 — Contact form + Supabase backend
- [ ] Phase 8 — Admin panel (auth, CRUD, Supabase-backed content)
- [ ] Phase 9 — Polish, SEO, deployment

## ⚠️ Known Issues / Things to Revisit

- [Leave notes here for yourself, e.g. "resume PDF placeholder still in use", "GitHub API rate limit not yet handled"]

## 🗒️ Personal Content Reference
*(so the agent never invents facts about you)*

- Real name: [ ]
- GitHub username: [ ]
- LinkedIn: [ ]
- Email: [ ]
- Current degree details: BCA, La Grande International College, [year/semester]
- Key skills to prioritize: [ ]
- 2–3 flagship projects to feature first: [ ]

---

### How to use this
1. Fill in the bracketed fields now, before Phase 0.
2. After finishing each phase, tick it off and add one line under Progress Log.
3. At the start of your next Antigravity session: paste this file first, then paste the next phase prompt from the build document.
4. If Antigravity ever seems confused or starts re-doing earlier work, re-paste this file to re-anchor it.
