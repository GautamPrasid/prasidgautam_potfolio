-- ===================================================
-- Supabase Table Creation DDL & RLS Policies
-- Execute in Supabase SQL Editor: https://app.supabase.com
-- ===================================================

-- 1. Hero & About Table (Single row configuration)
CREATE TABLE IF NOT EXISTS public.hero_about (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    roles JSONB NOT NULL DEFAULT '["Full-Stack Developer", "BCA Student", "Problem Solver"]'::jsonb,
    bio_text TEXT NOT NULL,
    about_text TEXT NOT NULL,
    stats JSONB NOT NULL DEFAULT '{"projects": 15, "certifications": 8, "technologies": 12}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    level INT,
    description TEXT,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Education Table
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

-- 4. Experience Table
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

-- 5. Certifications Table
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

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    image TEXT NOT NULL,
    github TEXT NOT NULL,
    demo TEXT,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    order_index INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

ALTER TABLE public.hero_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies for content tables
CREATE POLICY "Public Read HeroAbout" ON public.hero_about FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Education" ON public.education FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);

-- Public INSERT policy for contact messages
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin Full Access Policies (Authenticated role)
CREATE POLICY "Admin Full HeroAbout" ON public.hero_about FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ===================================================
-- STORAGE BUCKET CONFIGURATION
-- Run to create public storage bucket for project thumbnails & certification badges
-- ===================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Storage Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Storage Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Storage Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');
