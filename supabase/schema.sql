-- ===================================================
-- Portfolio — Complete Supabase Schema + Admin Sync Fix
-- Execute in Supabase SQL Editor: https://app.supabase.com
-- Safe to re-run in full: every CREATE/ALTER is guarded (IF NOT EXISTS,
-- DROP POLICY IF EXISTS, ON CONFLICT, CREATE OR REPLACE).
--
-- This is the single source-of-truth schema file — it includes both the
-- full table/RLS/storage setup AND the fix for the "admin uploads/edits
-- silently fail" issue (empty public.admins table).
-- ===================================================

-- ===================================================
-- 1. TABLES
-- ===================================================

-- Hero & About (single-row configuration table)
CREATE TABLE IF NOT EXISTS public.hero_about (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    roles JSONB NOT NULL DEFAULT '["Full-Stack Developer", "BCA Student", "Problem Solver"]'::jsonb,
    bio_text TEXT NOT NULL,
    about_text TEXT NOT NULL,
    stats JSONB NOT NULL DEFAULT '{"projects": 0, "certifications": 0, "technologies": 0}'::jsonb,
    resume_url TEXT,
    profile_image_url TEXT,
    github_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    location TEXT,
    connect_heading TEXT DEFAULT 'Connect With Me',
    highlights JSONB DEFAULT '[]'::jsonb,
    philosophy_quote TEXT,
    response_time_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    level INT CHECK (level IS NULL OR (level >= 0 AND level <= 100)),
    description TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Education
CREATE TABLE IF NOT EXISTS public.education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed',
    description TEXT NOT NULL,
    courses JSONB DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Experience
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Freelance',
    bullets JSONB DEFAULT '[]'::jsonb NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    credential_url TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    issuer_color TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects
-- github and image are nullable: admin form allows empty values for both
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    image TEXT,
    github TEXT,
    demo TEXT,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Social Links (footer & contact section social links)
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contact messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admin authorization table
-- Only rows in this table grant write access to protected resources.
-- ⚠️ This table starts EMPTY on a fresh database. Section 7 below fixes
-- that if it's still empty on your existing project.
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE
        DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 1b. LIVE-UPGRADE COLUMN ALTERATIONS
-- Safe to run against an existing database created from an older version
-- of this schema. All statements are idempotent in Postgres 12+.
-- ===================================================

ALTER TABLE public.projects ALTER COLUMN github DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN image DROP NOT NULL;

ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS connect_heading TEXT DEFAULT 'Connect With Me';
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS philosophy_quote TEXT;
ALTER TABLE public.hero_about ADD COLUMN IF NOT EXISTS response_time_text TEXT;

-- ===================================================
-- 2. INDEXES
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_skills_order         ON public.skills (order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category      ON public.skills (category);

CREATE INDEX IF NOT EXISTS idx_education_order      ON public.education (order_index);

CREATE INDEX IF NOT EXISTS idx_experience_order     ON public.experience (order_index);

CREATE INDEX IF NOT EXISTS idx_certifications_order ON public.certifications (order_index);

CREATE INDEX IF NOT EXISTS idx_projects_order       ON public.projects (order_index);
CREATE INDEX IF NOT EXISTS idx_projects_category    ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_featured    ON public.projects (featured);

CREATE INDEX IF NOT EXISTS idx_social_links_order   ON public.social_links (order_index);

CREATE INDEX IF NOT EXISTS idx_messages_is_read     ON public.messages (is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at  ON public.messages (created_at DESC);

-- ===================================================
-- 3. AUTO-UPDATE updated_at ON EVERY EDIT
-- ===================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hero_about_updated_at     ON public.hero_about;
CREATE TRIGGER trg_hero_about_updated_at
    BEFORE UPDATE ON public.hero_about
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_skills_updated_at         ON public.skills;
CREATE TRIGGER trg_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_education_updated_at      ON public.education;
CREATE TRIGGER trg_education_updated_at
    BEFORE UPDATE ON public.education
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_experience_updated_at     ON public.experience;
CREATE TRIGGER trg_experience_updated_at
    BEFORE UPDATE ON public.experience
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_certifications_updated_at ON public.certifications;
CREATE TRIGGER trg_certifications_updated_at
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at       ON public.projects;
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_social_links_updated_at   ON public.social_links;
CREATE TRIGGER trg_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===================================================
-- 4. ADMIN AUTHORIZATION HELPER FUNCTION
-- ===================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admins
        WHERE user_id = auth.uid()
    );
$$;

-- ===================================================
-- 5. ROW LEVEL SECURITY
-- ===================================================

ALTER TABLE public.hero_about     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins         ENABLE ROW LEVEL SECURITY;

-- Public SELECT on content tables
DROP POLICY IF EXISTS "Public Read HeroAbout" ON public.hero_about;
CREATE POLICY "Public Read HeroAbout" ON public.hero_about FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Education" ON public.education;
CREATE POLICY "Public Read Education" ON public.education FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Experience" ON public.experience;
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Certifications" ON public.certifications;
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read SocialLinks" ON public.social_links;
CREATE POLICY "Public Read SocialLinks" ON public.social_links FOR SELECT TO anon, authenticated USING (true);

-- Public INSERT for contact messages only
DROP POLICY IF EXISTS "Public Insert Messages" ON public.messages;
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin full access (requires public.is_admin() = true, i.e. a row in public.admins)
DROP POLICY IF EXISTS "Admin Full HeroAbout" ON public.hero_about;
CREATE POLICY "Admin Full HeroAbout" ON public.hero_about FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Skills" ON public.skills;
CREATE POLICY "Admin Full Skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Education" ON public.education;
CREATE POLICY "Admin Full Education" ON public.education FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Experience" ON public.experience;
CREATE POLICY "Admin Full Experience" ON public.experience FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Certifications" ON public.certifications;
CREATE POLICY "Admin Full Certifications" ON public.certifications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Projects" ON public.projects;
CREATE POLICY "Admin Full Projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full SocialLinks" ON public.social_links;
CREATE POLICY "Admin Full SocialLinks" ON public.social_links FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Messages" ON public.messages;
CREATE POLICY "Admin Full Messages" ON public.messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin Read Admins" ON public.admins;
CREATE POLICY "Admin Read Admins" ON public.admins FOR SELECT TO authenticated USING (public.is_admin());

-- ===================================================
-- 6. STORAGE BUCKET FOR UPLOADS
-- ===================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
CREATE POLICY "Admin Storage Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
CREATE POLICY "Admin Storage Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;
CREATE POLICY "Admin Storage Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- ===================================================
-- 7. ADMIN SYNC FIX
-- Run this section whenever admin uploads/edits stop working. Root cause:
-- public.admins is empty, so is_admin() returns false for everyone,
-- silently blocking every write and Storage upload.
-- ===================================================

-- 7a. Find your user ID — copy the "id" for your login email
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at ASC;

-- 7b. Check whether you're already registered as admin (0 rows = the bug)
SELECT * FROM public.admins;

-- 7c. Insert yourself as admin.
-- ⚠️  DO NOT run this as part of the full file — run 7a first, copy your
--     UUID, then run ONLY the INSERT below with your real UUID substituted.
--
-- INSERT INTO public.admins (user_id)
-- VALUES ('PASTE-YOUR-UUID-HERE')
-- ON CONFLICT (user_id) DO NOTHING;

-- 7d. Confirm the insert worked
SELECT a.user_id, u.email, a.created_at
FROM public.admins a
JOIN auth.users u ON u.id = a.user_id;

-- 7e. Diagnostic — check whether hero_about/projects have real URLs yet.
-- If still null after 7c, that's expected until you re-upload through /admin.
SELECT name, resume_url, profile_image_url FROM public.hero_about;
SELECT title, image FROM public.projects ORDER BY order_index;

-- 7f. Diagnostic — confirm what actually exists in Storage right now
SELECT name, bucket_id, created_at, metadata->>'size' AS size_bytes
FROM storage.objects
WHERE bucket_id = 'portfolio-assets'
ORDER BY created_at DESC;

-- ===================================================
-- AFTER RUNNING SECTION 7:
-- 1. Log out of /admin and back in (refresh your session token).
-- 2. Re-upload your real profile photo, resume PDF, and project images
--    through the admin panel — do NOT paste URLs manually.
-- 3. Re-run 7e and 7f to confirm real values now appear.
-- 4. Only then reload the public site and confirm visually.
-- ===================================================