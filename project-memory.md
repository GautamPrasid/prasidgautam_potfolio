# Project Memory: Prasid Gautam Portfolio

## Project Status: Feature-Complete
- **Status:** Fully admin-driven, zero hardcoded content.
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Supabase.
- **Build Status:** Verified passing `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## Schema & Data Sources
- `public.hero_about`: Hero headline, rotating roles, bio, about narrative, highlights, philosophy quote, contact email, contact phone, location, connect heading, response time text, social links, resume URL, profile image URL, and github URL.
- `public.skills`: Skill name, category, icon name (lucide-react), proficiency level, description, order index.
- `public.education`: Degree, institution, location, duration, status (Enrolled vs Completed), description, courses, order index.
- `public.experience`: Job title / role, company / organization, location, duration, type, bullet accomplishments, tech tags, order index.
- `public.certifications`: Certificate title, issuer, issue date, credential URL, skills covered, gradient color, order index.
- `public.projects`: Project title, description, tags, category, featured status, image URL, repository URL, live demo URL, order index.
- `public.social_links`: Social platform name, destination URL, lucide-react icon name, order index.
- `public.messages`: Contact inquiries sent through `/api/contact`, manageable from `/admin/messages`.

## Admin Pipeline
- All admin mutations execute via Server Actions in `app/admin/actions.ts`:
  - `saveHeroAboutAction`
  - `saveSkillAction`, `deleteSkillAction`, `reorderSkillsAction`
  - `saveEducationAction`, `deleteEducationAction`, `reorderEducationAction`
  - `saveExperienceAction`, `deleteExperienceAction`, `reorderExperienceAction`
  - `saveCertificationAction`, `deleteCertificationAction`, `reorderCertificationsAction`
  - `saveProjectAction`, `deleteProjectAction`, `reorderProjectsAction`
  - `saveSocialLinkAction`, `deleteSocialLinkAction`, `reorderSocialLinksAction`
  - `toggleMessageReadAction`, `deleteMessageAction`
- Every mutation automatically fires `triggerRevalidateAll()`, purging Next.js route cache and layout cache.
- Public page `/` is configured with `force-dynamic` and immediately renders fresh database content upon next request.
