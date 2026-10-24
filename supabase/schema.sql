-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run top-to-bottom in the Supabase SQL editor. Safe to re-run.
-- Contains structure only: no seed data, no data fixes.
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hero_about (
    id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name               TEXT NOT NULL,
    roles              JSONB NOT NULL DEFAULT '[]'::jsonb,
    bio_text           TEXT NOT NULL,
    about_text         TEXT NOT NULL,
    stats              JSONB,
    resume_url         TEXT,
    profile_image_url  TEXT,
    github_url         TEXT,
    contact_email      TEXT,
    contact_phone      TEXT,
    location           TEXT,
    connect_heading    TEXT,
    highlights         JSONB DEFAULT '[]'::jsonb,
    philosophy_quote   TEXT,
    response_time_text TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Only one hero_about row allowed
CREATE UNIQUE INDEX IF NOT EXISTS hero_about_one_row ON public.hero_about ((true));

CREATE TABLE IF NOT EXISTS public.skills (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL,
    icon_name   TEXT NOT NULL,
    level       INT CHECK (level IS NULL OR (level BETWEEN 0 AND 100)),
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.education (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    degree      TEXT NOT NULL,
    institution TEXT NOT NULL,
    location    TEXT NOT NULL,
    duration    TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'Completed',
    description TEXT NOT NULL,
    courses     JSONB DEFAULT '[]'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.experience (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role         TEXT NOT NULL,
    company      TEXT NOT NULL,
    location     TEXT NOT NULL,
    duration     TEXT NOT NULL,
    type         TEXT NOT NULL DEFAULT 'Freelance',
    bullets      JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index  INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.certifications (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title          TEXT NOT NULL,
    issuer         TEXT NOT NULL,
    date           TEXT NOT NULL,
    credential_url TEXT NOT NULL,
    skills         JSONB NOT NULL DEFAULT '[]'::jsonb,
    issuer_color   TEXT,
    order_index    INT NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.projects (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    tags        JSONB NOT NULL DEFAULT '[]'::jsonb,
    image       TEXT,
    -- screenshots: array of public storage URLs for the case-study image gallery
    screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
    github      TEXT,
    demo        TEXT,
    category    TEXT NOT NULL,
    featured    BOOLEAN NOT NULL DEFAULT false,
    order_index INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    excerpt      TEXT NOT NULL,
    content      TEXT NOT NULL,
    cover_image  TEXT,
    category     TEXT NOT NULL DEFAULT 'Web Development',
    tags         JSONB NOT NULL DEFAULT '[]'::jsonb,
    read_time    TEXT NOT NULL DEFAULT '5 min read',
    published    BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    order_index  INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.social_links (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform    TEXT NOT NULL,
    url         TEXT NOT NULL,
    icon_name   TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.messages (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT NOT NULL,
    message    TEXT NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.admins (
    user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Single-row settings table (id is always true)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id               BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
    site_name        TEXT NOT NULL DEFAULT 'My Portfolio',
    site_description TEXT NOT NULL DEFAULT 'Personal portfolio website.',
    logo_url         TEXT,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Admin-editable text that used to be hardcoded in the app.
-- Empty / null values mean "don't render it".
ALTER TABLE public.site_settings
    ADD COLUMN IF NOT EXISTS footer_text         TEXT,
    ADD COLUMN IF NOT EXISTS section_content     JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS section_visibility  JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS og_image_url        TEXT;
    -- section_content shape: { "<section>": { "badge": "", "heading": "", "subtext": "" } }
    -- section_visibility shape: { "about": true, "skills": true, "projects": true, "resume": true, "blog": true, "contact": true }
    -- sections: about, skills, projects, resume, blog, contact

ALTER TABLE public.hero_about
    ADD COLUMN IF NOT EXISTS availability_text TEXT;

-- screenshots: array of public storage URLs for the project case-study image gallery.
-- Add to existing databases that were created before this column was in CREATE TABLE.
ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS screenshots JSONB NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO public.site_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_skills_order         ON public.skills (order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category      ON public.skills (category);
CREATE INDEX IF NOT EXISTS idx_education_order      ON public.education (order_index);
CREATE INDEX IF NOT EXISTS idx_experience_order     ON public.experience (order_index);
CREATE INDEX IF NOT EXISTS idx_certifications_order ON public.certifications (order_index);
CREATE INDEX IF NOT EXISTS idx_projects_order       ON public.projects (order_index);
CREATE INDEX IF NOT EXISTS idx_projects_category    ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_featured    ON public.projects (featured);
CREATE INDEX IF NOT EXISTS idx_blogs_order          ON public.blogs (order_index);
CREATE INDEX IF NOT EXISTS idx_blogs_published      ON public.blogs (published);
CREATE INDEX IF NOT EXISTS idx_social_links_order   ON public.social_links (order_index);
CREATE INDEX IF NOT EXISTS idx_messages_is_read     ON public.messages (is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at  ON public.messages (created_at DESC);

-- ============================================================
-- 3. CHECK CONSTRAINTS
-- ============================================================

ALTER TABLE public.messages
    DROP CONSTRAINT IF EXISTS chk_messages_name_length,
    DROP CONSTRAINT IF EXISTS chk_messages_email_length,
    DROP CONSTRAINT IF EXISTS chk_messages_subject_length,
    DROP CONSTRAINT IF EXISTS chk_messages_message_length,
    ADD CONSTRAINT chk_messages_name_length    CHECK (char_length(name)    BETWEEN 1 AND 100),
    ADD CONSTRAINT chk_messages_email_length   CHECK (char_length(email)   BETWEEN 3 AND 254),
    ADD CONSTRAINT chk_messages_subject_length CHECK (char_length(subject) BETWEEN 1 AND 150),
    ADD CONSTRAINT chk_messages_message_length CHECK (char_length(message) BETWEEN 1 AND 2000);

ALTER TABLE public.skills
    DROP CONSTRAINT IF EXISTS chk_skills_category,
    ADD CONSTRAINT chk_skills_category
        CHECK (category IN ('Languages','Frontend','Backend','Database','Tools/DevOps','Soft Skills'));

ALTER TABLE public.projects
    DROP CONSTRAINT IF EXISTS chk_projects_category,
    ADD CONSTRAINT chk_projects_category
        CHECK (category IN ('Full-Stack','Web Apps','Backend','Mini Projects'));

ALTER TABLE public.education
    DROP CONSTRAINT IF EXISTS chk_education_status,
    ADD CONSTRAINT chk_education_status
        CHECK (status IN ('Enrolled','Completed'));

ALTER TABLE public.experience
    DROP CONSTRAINT IF EXISTS chk_experience_type,
    ADD CONSTRAINT chk_experience_type
        CHECK (type IN ('Freelance','College Role','Project / Hackathon'));

-- ============================================================
-- 4. updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$;

DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'hero_about','skills','education','experience','certifications',
        'projects','blogs','social_links','site_settings'
    ] LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$I', t);
        EXECUTE format(
            'CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON public.%1$I
             FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
    END LOOP;
END $$;

-- ============================================================
-- 5. is_admin()
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.hero_about     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings  ENABLE ROW LEVEL SECURITY;

-- Remove every existing policy on these tables (including old differently-named
-- ones from earlier versions of this file) so only the policies below remain.
DO $$
DECLARE p RECORD;
BEGIN
    FOR p IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN (
              'hero_about','skills','education','experience','certifications',
              'projects','blogs','social_links','messages','admins','site_settings'
          )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
    END LOOP;
END $$;

-- Content tables: public read, admin insert/update/delete
DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'hero_about','skills','education','experience','certifications',
        'projects','social_links'
    ] LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Read %1$s" ON public.%1$I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin Insert %1$s" ON public.%1$I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin Update %1$s" ON public.%1$I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin Delete %1$s" ON public.%1$I', t);

        EXECUTE format('CREATE POLICY "Public Read %1$s" ON public.%1$I
                        FOR SELECT TO anon, authenticated USING (true)', t);
        EXECUTE format('CREATE POLICY "Admin Insert %1$s" ON public.%1$I
                        FOR INSERT TO authenticated WITH CHECK (public.is_admin())', t);
        EXECUTE format('CREATE POLICY "Admin Update %1$s" ON public.%1$I
                        FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
        EXECUTE format('CREATE POLICY "Admin Delete %1$s" ON public.%1$I
                        FOR DELETE TO authenticated USING (public.is_admin())', t);
    END LOOP;
END $$;

-- Blogs: public sees published only, admin sees everything
DROP POLICY IF EXISTS "Public Read blogs"  ON public.blogs;
DROP POLICY IF EXISTS "Admin Insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin Update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin Delete blogs" ON public.blogs;
CREATE POLICY "Public Read blogs"  ON public.blogs FOR SELECT TO anon, authenticated
    USING (published = true OR public.is_admin());
CREATE POLICY "Admin Insert blogs" ON public.blogs FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());
CREATE POLICY "Admin Update blogs" ON public.blogs FOR UPDATE TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete blogs" ON public.blogs FOR DELETE TO authenticated
    USING (public.is_admin());

-- Site settings: public read, admin full access
DROP POLICY IF EXISTS "Public Read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Full site_settings"  ON public.site_settings;
CREATE POLICY "Public Read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated
    USING (true);
CREATE POLICY "Admin Full site_settings"  ON public.site_settings FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Messages: no public INSERT policy on purpose. The contact form inserts through
-- api/contact/route.ts using the service-role key, which keeps validation and
-- spam protection server-side. Only admins can read/manage messages.
DROP POLICY IF EXISTS "Admin Read messages"   ON public.messages;
DROP POLICY IF EXISTS "Admin Update messages" ON public.messages;
DROP POLICY IF EXISTS "Admin Delete messages" ON public.messages;
CREATE POLICY "Admin Read messages"   ON public.messages FOR SELECT TO authenticated
    USING (public.is_admin());
CREATE POLICY "Admin Update messages" ON public.messages FOR UPDATE TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin Delete messages" ON public.messages FOR DELETE TO authenticated
    USING (public.is_admin());

-- Admins: admins can read the list
DROP POLICY IF EXISTS "Admin Read admins" ON public.admins;
CREATE POLICY "Admin Read admins" ON public.admins FOR SELECT TO authenticated
    USING (public.is_admin());

-- ============================================================
-- 7. STORAGE
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    10485760, -- 10 MB
    ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit    = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public Storage Read"  ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Delete" ON storage.objects;

CREATE POLICY "Public Storage Read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin Storage Insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin Storage Update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.is_admin())
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin Storage Delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- ============================================================
-- 8. CHECK: every expected table exists and has RLS on
-- Expect 11 rows, all with exists = true and rls_enabled = true
-- ============================================================

SELECT t.name AS table_name,
       c.oid IS NOT NULL AS exists,
       COALESCE(c.relrowsecurity, false) AS rls_enabled
FROM unnest(ARRAY[
    'hero_about','skills','education','experience','certifications','projects',
    'blogs','social_links','messages','admins','site_settings'
]) AS t(name)
LEFT JOIN pg_class c
       ON c.relname = t.name
      AND c.relnamespace = 'public'::regnamespace
ORDER BY t.name;


-- ============================================================
-- AFTER RUNNING: make yourself an admin (needed to add/edit data)
-- INSERT INTO public.admins (user_id) VALUES ('<your-auth-user-uuid>');
-- ============================================================