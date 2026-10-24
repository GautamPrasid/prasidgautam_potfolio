-- ============================================================
-- SEED: Project & Blog Images
-- Portfolio: Prasid Gautam | https://www.prasidgautam.com.np
-- Supabase Project: gewnvpecylddcaqkhwrw
-- ============================================================
-- Run this AFTER uploading your images to Supabase Storage.
-- Safe to re-run: uses ON CONFLICT / WHERE clauses where possible.
--
-- HOW TO UPLOAD FILES
-- ─────────────────────────────────────────────────────────────
-- Option A – Supabase Dashboard (easiest)
--   1. Go to Storage → portfolio-assets in your project dashboard.
--   2. Create sub-folders: projects/, blog/, profile/, og/
--   3. Upload images into the appropriate sub-folder.
--   4. Click on the uploaded file → "Get URL" → copy the public URL.
--
-- Option B – Supabase CLI
--   supabase storage cp ./public/images/projects/study-buddy.png \
--     ss:///portfolio-assets/projects/study-buddy.png
--
-- PUBLIC URL PATTERN
--   https://gewnvpecylddcaqkhwrw.supabase.co/storage/v1/object/public/portfolio-assets/<path>
-- ============================================================

DO $$
DECLARE
  base_url TEXT := 'https://gewnvpecylddcaqkhwrw.supabase.co/storage/v1/object/public/portfolio-assets';
BEGIN

  -- ==========================================================
  -- 1. PROJECTS — image (card thumbnail) + screenshots (gallery)
  -- ==========================================================
  -- Files to upload into projects/ folder:
  --   study-buddy.png, study-buddy-login.png, study-buddy-notes.png, study-buddy-tasks.png
  --   portfolio.png, portfolio-admin.png
  --   voting-system.png
  --   student-management.png
  --   pacman-game.png
  --   bank-management.png
  --   qr-code-generator.png
  --   photography-portfolio.png
  --   personal-blog.png

  -- StudyBuddy
  UPDATE public.projects
  SET
    image       = base_url || '/projects/study-buddy.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/study-buddy.png',
                    base_url || '/projects/study-buddy-login.png',
                    base_url || '/projects/study-buddy-notes.png',
                    base_url || '/projects/study-buddy-tasks.png'
                  )
  WHERE LOWER(title) LIKE '%studybuddy%'
     OR LOWER(title) LIKE '%study buddy%'
     OR LOWER(title) LIKE '%student companion%';

  -- Portfolio
  UPDATE public.projects
  SET
    image       = base_url || '/projects/portfolio.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/portfolio.png',
                    base_url || '/projects/portfolio-admin.png'
                  )
  WHERE LOWER(title) LIKE '%portfolio%';

  -- Voting System
  UPDATE public.projects
  SET
    image       = base_url || '/projects/voting-system.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/voting-system.png'
                  )
  WHERE LOWER(title) LIKE '%voting%';

  -- Student Management
  UPDATE public.projects
  SET
    image       = base_url || '/projects/student-management.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/student-management.png'
                  )
  WHERE LOWER(title) LIKE '%student management%';

  -- Pac-Man
  UPDATE public.projects
  SET
    image       = base_url || '/projects/pacman-game.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/pacman-game.png'
                  )
  WHERE LOWER(title) LIKE '%pac%man%'
     OR LOWER(title) LIKE '%pacman%';

  -- Bank Management
  UPDATE public.projects
  SET
    image       = base_url || '/projects/bank-management.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/bank-management.png'
                  )
  WHERE LOWER(title) LIKE '%bank%';

  -- QR Code Generator
  UPDATE public.projects
  SET
    image       = base_url || '/projects/qr-code-generator.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/qr-code-generator.png'
                  )
  WHERE LOWER(title) LIKE '%qr%';

  -- Photography Portfolio
  UPDATE public.projects
  SET
    image       = base_url || '/projects/photography-portfolio.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/photography-portfolio.png'
                  )
  WHERE LOWER(title) LIKE '%photo%';

  -- Personal Blog
  UPDATE public.projects
  SET
    image       = base_url || '/projects/personal-blog.png',
    screenshots = jsonb_build_array(
                    base_url || '/projects/personal-blog.png'
                  )
  WHERE LOWER(title) LIKE '%personal blog%';

  -- ==========================================================
  -- 2. BLOG COVER IMAGES
  -- ==========================================================
  -- Upload blog/<slug>.png for each article, then run statements like:
  --
  -- UPDATE public.blogs
  -- SET cover_image = base_url || '/blog/your-article-slug.png'
  -- WHERE slug = 'your-article-slug';

  -- ==========================================================
  -- 3. HERO PROFILE PHOTO
  -- ==========================================================
  -- Upload: profile/prasid-gautam.jpg  (recommended: 400×400 px)
  UPDATE public.hero_about
  SET profile_image_url = base_url || '/profile/prasid-gautam.jpg'
  WHERE profile_image_url IS NULL OR profile_image_url = '';

  -- ==========================================================
  -- 4. OG / SOCIAL PREVIEW IMAGE
  -- ==========================================================
  -- Upload: og/og-image.png  (recommended: 1200×630 px)
  UPDATE public.site_settings
  SET og_image_url = base_url || '/og/og-image.png'
  WHERE id = true
    AND (og_image_url IS NULL OR og_image_url = '');

END $$;


-- ============================================================
-- 5. VERIFICATION
-- ============================================================

SELECT title, category, image,
       jsonb_array_length(screenshots) AS screenshot_count
FROM public.projects ORDER BY order_index;

SELECT title, slug, cover_image, published
FROM public.blogs ORDER BY order_index;

SELECT name, profile_image_url FROM public.hero_about;

SELECT site_name, og_image_url FROM public.site_settings;


-- ============================================================
-- QUICK REFERENCE: All expected public URLs
-- ============================================================
-- Profile:   .../portfolio-assets/profile/prasid-gautam.jpg
-- OG image:  .../portfolio-assets/og/og-image.png
-- Projects:
--   .../portfolio-assets/projects/study-buddy.png
--   .../portfolio-assets/projects/study-buddy-login.png
--   .../portfolio-assets/projects/study-buddy-notes.png
--   .../portfolio-assets/projects/study-buddy-tasks.png
--   .../portfolio-assets/projects/portfolio.png
--   .../portfolio-assets/projects/portfolio-admin.png
--   .../portfolio-assets/projects/voting-system.png
--   .../portfolio-assets/projects/student-management.png
--   .../portfolio-assets/projects/pacman-game.png
--   .../portfolio-assets/projects/bank-management.png
--   .../portfolio-assets/projects/qr-code-generator.png
--   .../portfolio-assets/projects/photography-portfolio.png
--   .../portfolio-assets/projects/personal-blog.png
-- Blog covers:
--   .../portfolio-assets/blog/<slug>.png  (one per article)
-- ============================================================
