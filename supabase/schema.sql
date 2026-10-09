-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Re-runnable: Run top-to-bottom in the Supabase SQL editor.
-- ============================================================
-- 
-- This schema includes:
-- 1. All database tables (hero_about, skills, projects, etc.)
-- 2. Row Level Security (RLS) policies
-- 3. Storage bucket configuration
-- 4. Storage RLS policies (fixed for profile photo upload)
-- 5. Admin verification functions
-- 6. Verification queries
-- 7. Data fixes (icon names to PascalCase)
--
-- To apply: Copy this entire file and run in Supabase SQL Editor
-- Safe to run multiple times (idempotent)
-- ============================================================

-- ============================================================
-- SECTION 1: TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hero_about (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    roles JSONB NOT NULL DEFAULT '[]'::jsonb,
    bio_text TEXT NOT NULL,
    about_text TEXT NOT NULL,
    stats JSONB,
    resume_url TEXT,
    profile_image_url TEXT,
    github_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    location TEXT,
    connect_heading TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    philosophy_quote TEXT,
    response_time_text TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS hero_about_one_row ON public.hero_about ((true));

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    level INT CHECK (level IS NULL OR (level >= 0 AND level <= 100)),
    description TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    credential_url TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    issuer_color TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL DEFAULT 'Web Development',
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    read_time TEXT DEFAULT '5 min read' NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- SECTION 2: INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills (order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills (category);
CREATE INDEX IF NOT EXISTS idx_education_order ON public.education (order_index);
CREATE INDEX IF NOT EXISTS idx_experience_order ON public.experience (order_index);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON public.certifications (order_index);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects (order_index);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured);
CREATE INDEX IF NOT EXISTS idx_blogs_order ON public.blogs (order_index);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs (published);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links (order_index);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages (is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);

-- ============================================================
-- SECTION 3: CHECK CONSTRAINTS
-- ============================================================

-- messages length constraints
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_messages_name_length' AND conrelid = 'public.messages'::regclass) THEN
    ALTER TABLE public.messages ADD CONSTRAINT chk_messages_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_messages_email_length' AND conrelid = 'public.messages'::regclass) THEN
    ALTER TABLE public.messages ADD CONSTRAINT chk_messages_email_length CHECK (char_length(email) >= 3 AND char_length(email) <= 254);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_messages_subject_length' AND conrelid = 'public.messages'::regclass) THEN
    ALTER TABLE public.messages ADD CONSTRAINT chk_messages_subject_length CHECK (char_length(subject) >= 1 AND char_length(subject) <= 150);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_messages_message_length' AND conrelid = 'public.messages'::regclass) THEN
    ALTER TABLE public.messages ADD CONSTRAINT chk_messages_message_length CHECK (char_length(message) >= 1 AND char_length(message) <= 2000);
  END IF;
END $$;

-- skills.category constraint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_skills_category' AND conrelid = 'public.skills'::regclass) THEN
    ALTER TABLE public.skills ADD CONSTRAINT chk_skills_category
      CHECK (category IN ('Languages','Frontend','Backend','Database','Tools/DevOps','Soft Skills'));
  END IF;
END $$;

-- projects.category constraint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_projects_category' AND conrelid = 'public.projects'::regclass) THEN
    ALTER TABLE public.projects ADD CONSTRAINT chk_projects_category
      CHECK (category IN ('Full-Stack','Web Apps','Backend','Mini Projects'));
  END IF;
END $$;

-- education.status constraint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_education_status' AND conrelid = 'public.education'::regclass) THEN
    ALTER TABLE public.education ADD CONSTRAINT chk_education_status
      CHECK (status IN ('Enrolled','Completed'));
  END IF;
END $$;

-- experience.type constraint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_experience_type' AND conrelid = 'public.experience'::regclass) THEN
    ALTER TABLE public.experience ADD CONSTRAINT chk_experience_type
      CHECK (type IN ('Freelance','College Role','Project / Hackathon'));
  END IF;
END $$;

-- ============================================================
-- SECTION 4: UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_hero_about_updated_at ON public.hero_about;
CREATE TRIGGER trg_hero_about_updated_at
    BEFORE UPDATE ON public.hero_about
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_skills_updated_at ON public.skills;
CREATE TRIGGER trg_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_education_updated_at ON public.education;
CREATE TRIGGER trg_education_updated_at
    BEFORE UPDATE ON public.education
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_experience_updated_at ON public.experience;
CREATE TRIGGER trg_experience_updated_at
    BEFORE UPDATE ON public.experience
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_certifications_updated_at ON public.certifications;
CREATE TRIGGER trg_certifications_updated_at
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_blogs_updated_at ON public.blogs;
CREATE TRIGGER trg_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_social_links_updated_at ON public.social_links;
CREATE TRIGGER trg_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- SECTION 5: is_admin() SECURITY FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ============================================================
-- SECTION 6: ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.hero_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Public read policies
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

DROP POLICY IF EXISTS "Public Read Blogs" ON public.blogs;
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Public Read SocialLinks" ON public.social_links;
CREATE POLICY "Public Read SocialLinks" ON public.social_links FOR SELECT TO anon, authenticated USING (true);

-- Admin write policies
DROP POLICY IF EXISTS "Admin Full HeroAbout" ON public.hero_about;
DROP POLICY IF EXISTS "Admin Insert HeroAbout" ON public.hero_about;
DROP POLICY IF EXISTS "Admin Update HeroAbout" ON public.hero_about;
DROP POLICY IF EXISTS "Admin Delete HeroAbout" ON public.hero_about;
CREATE POLICY "Admin Insert HeroAbout" ON public.hero_about FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update HeroAbout" ON public.hero_about FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete HeroAbout" ON public.hero_about FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Skills" ON public.skills;
DROP POLICY IF EXISTS "Admin Insert Skills" ON public.skills;
DROP POLICY IF EXISTS "Admin Update Skills" ON public.skills;
DROP POLICY IF EXISTS "Admin Delete Skills" ON public.skills;
CREATE POLICY "Admin Insert Skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Skills" ON public.skills FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Skills" ON public.skills FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Education" ON public.education;
DROP POLICY IF EXISTS "Admin Insert Education" ON public.education;
DROP POLICY IF EXISTS "Admin Update Education" ON public.education;
DROP POLICY IF EXISTS "Admin Delete Education" ON public.education;
CREATE POLICY "Admin Insert Education" ON public.education FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Education" ON public.education FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Education" ON public.education FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Experience" ON public.experience;
DROP POLICY IF EXISTS "Admin Insert Experience" ON public.experience;
DROP POLICY IF EXISTS "Admin Update Experience" ON public.experience;
DROP POLICY IF EXISTS "Admin Delete Experience" ON public.experience;
CREATE POLICY "Admin Insert Experience" ON public.experience FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Experience" ON public.experience FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Experience" ON public.experience FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin Insert Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin Update Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin Delete Certifications" ON public.certifications;
CREATE POLICY "Admin Insert Certifications" ON public.certifications FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Certifications" ON public.certifications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Certifications" ON public.certifications FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Insert Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Update Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Delete Projects" ON public.projects;
CREATE POLICY "Admin Insert Projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Projects" ON public.projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Projects" ON public.projects FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Insert Blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin Update Blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin Delete Blogs" ON public.blogs;
CREATE POLICY "Admin Insert Blogs" ON public.blogs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update Blogs" ON public.blogs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Blogs" ON public.blogs FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full SocialLinks" ON public.social_links;
DROP POLICY IF EXISTS "Admin Insert SocialLinks" ON public.social_links;
DROP POLICY IF EXISTS "Admin Update SocialLinks" ON public.social_links;
DROP POLICY IF EXISTS "Admin Delete SocialLinks" ON public.social_links;
CREATE POLICY "Admin Insert SocialLinks" ON public.social_links FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update SocialLinks" ON public.social_links FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete SocialLinks" ON public.social_links FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Full Messages" ON public.messages;
DROP POLICY IF EXISTS "Admin Insert Messages" ON public.messages;
DROP POLICY IF EXISTS "Admin Update Messages" ON public.messages;
DROP POLICY IF EXISTS "Admin Delete Messages" ON public.messages;
DROP POLICY IF EXISTS "Admin Read Messages" ON public.messages;
CREATE POLICY "Admin Read Messages" ON public.messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin Update Messages" ON public.messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete Messages" ON public.messages FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Read Admins" ON public.admins;
CREATE POLICY "Admin Read Admins" ON public.admins FOR SELECT TO authenticated USING (public.is_admin());

-- ============================================================
-- SECTION 7: STORAGE
-- ============================================================

-- Portfolio assets bucket configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    10485760,
    ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for portfolio-assets bucket
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
CREATE POLICY "Admin Storage Insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
CREATE POLICY "Admin Storage Update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.is_admin())
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;
CREATE POLICY "Admin Storage Delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- ============================================================
-- SECTION 8: ALTER TABLE STATEMENTS FOR EXISTING DATABASES
-- ============================================================

-- Make stats and connect_heading nullable in hero_about
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'hero_about'
      AND column_name = 'stats' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.hero_about ALTER COLUMN stats DROP NOT NULL;
    ALTER TABLE public.hero_about ALTER COLUMN stats SET DEFAULT NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'hero_about'
      AND column_name = 'connect_heading' AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE public.hero_about ALTER COLUMN connect_heading SET DEFAULT NULL;
  END IF;
END $$;


-- ============================================================
-- SECTION 9: VERIFICATION QUERIES
-- ============================================================
-- Run these queries after applying the schema to verify everything is set up correctly

-- Verify storage policies (should return 4 rows)
SELECT 
    policyname,
    cmd as operation,
    roles::text
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname LIKE '%Storage%'
ORDER BY policyname;
-- Expected: Admin Storage Delete, Admin Storage Insert, Admin Storage Update, Public Storage Read

-- Verify is_admin() function exists
SELECT proname, pronamespace::regnamespace 
FROM pg_proc 
WHERE proname = 'is_admin';
-- Expected: 1 row

-- Verify portfolio-assets bucket exists and is public
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'portfolio-assets';
-- Expected: 1 row with public = true

-- Check if current user is admin (run after adding yourself to admins table)
-- SELECT public.is_admin() as am_i_admin;
-- Expected: true (after adding your user_id to admins table)


-- ============================================================
-- SECTION 10: DATA FIXES
-- ============================================================
-- Fix existing data to match expected formats

-- Fix social link icon names to PascalCase (required by Lucide React)
-- This section fixes both icon_name column AND detects from platform/URL patterns

-- Fix by icon_name (case-insensitive)
UPDATE public.social_links SET icon_name = 'Github' WHERE LOWER(icon_name) = 'github';
UPDATE public.social_links SET icon_name = 'Linkedin' WHERE LOWER(icon_name) = 'linkedin';
UPDATE public.social_links SET icon_name = 'Twitter' WHERE LOWER(icon_name) IN ('twitter', 'x');
UPDATE public.social_links SET icon_name = 'Instagram' WHERE LOWER(icon_name) = 'instagram';
UPDATE public.social_links SET icon_name = 'Facebook' WHERE LOWER(icon_name) = 'facebook';
UPDATE public.social_links SET icon_name = 'Youtube' WHERE LOWER(icon_name) = 'youtube';
UPDATE public.social_links SET icon_name = 'Mail' WHERE LOWER(icon_name) IN ('mail', 'email');
UPDATE public.social_links SET icon_name = 'MessageCircle' WHERE LOWER(icon_name) IN ('messagecircle', 'whatsapp');
UPDATE public.social_links SET icon_name = 'Send' WHERE LOWER(icon_name) IN ('send', 'telegram');
UPDATE public.social_links SET icon_name = 'Phone' WHERE LOWER(icon_name) = 'phone';
UPDATE public.social_links SET icon_name = 'Globe' WHERE LOWER(icon_name) IN ('globe', 'website', 'web');
UPDATE public.social_links SET icon_name = 'Link' WHERE LOWER(icon_name) = 'link';

-- Fix by platform name (case-insensitive)
UPDATE public.social_links SET icon_name = 'Github' WHERE LOWER(platform) LIKE '%github%';
UPDATE public.social_links SET icon_name = 'Linkedin' WHERE LOWER(platform) LIKE '%linkedin%';
UPDATE public.social_links SET icon_name = 'Twitter' WHERE LOWER(platform) LIKE '%twitter%' OR LOWER(platform) LIKE '%x%';
UPDATE public.social_links SET icon_name = 'Instagram' WHERE LOWER(platform) LIKE '%instagram%';
UPDATE public.social_links SET icon_name = 'Facebook' WHERE LOWER(platform) LIKE '%facebook%';
UPDATE public.social_links SET icon_name = 'Youtube' WHERE LOWER(platform) LIKE '%youtube%';
UPDATE public.social_links SET icon_name = 'Mail' WHERE LOWER(platform) LIKE '%mail%' OR LOWER(platform) LIKE '%email%';
UPDATE public.social_links SET icon_name = 'MessageCircle' WHERE LOWER(platform) LIKE '%whatsapp%';
UPDATE public.social_links SET icon_name = 'Send' WHERE LOWER(platform) LIKE '%telegram%';
UPDATE public.social_links SET icon_name = 'Phone' WHERE LOWER(platform) LIKE '%phone%';

-- Fix by URL pattern (most reliable)
UPDATE public.social_links SET icon_name = 'Github' WHERE LOWER(url) LIKE '%github%';
UPDATE public.social_links SET icon_name = 'Linkedin' WHERE LOWER(url) LIKE '%linkedin%';
UPDATE public.social_links SET icon_name = 'Twitter' WHERE LOWER(url) LIKE '%twitter%' OR LOWER(url) LIKE '%x.com%';
UPDATE public.social_links SET icon_name = 'Instagram' WHERE LOWER(url) LIKE '%instagram%';
UPDATE public.social_links SET icon_name = 'Facebook' WHERE LOWER(url) LIKE '%facebook%';
UPDATE public.social_links SET icon_name = 'Youtube' WHERE LOWER(url) LIKE '%youtube%';
UPDATE public.social_links SET icon_name = 'Mail' WHERE LOWER(url) LIKE '%mailto:%' OR url LIKE '%@%';
UPDATE public.social_links SET icon_name = 'MessageCircle' WHERE LOWER(url) LIKE '%whatsapp%';
UPDATE public.social_links SET icon_name = 'Send' WHERE LOWER(url) LIKE '%telegram%' OR LOWER(url) LIKE '%t.me%';
UPDATE public.social_links SET icon_name = 'Phone' WHERE LOWER(url) LIKE '%tel:%';

-- Verification query (uncomment to check results)
-- SELECT platform, icon_name, url,
--   CASE 
--     WHEN icon_name ~ '^[A-Z][a-z]+' THEN '✅ PascalCase'
--     ELSE '❌ Wrong case'
--   END as status
-- FROM public.social_links
-- ORDER BY order_index;
