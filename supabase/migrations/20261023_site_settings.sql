-- Website identity and SEO settings controlled through /admin/website-settings.
-- Run this migration in the Supabase SQL Editor for the project connected to Vercel.

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  site_name text not null default 'Prasid Gautam',
  site_description text not null default 'Explore the portfolio of Prasid Gautam, a BCA student and software developer in Nepal, showcasing web development projects, technical skills, education, and experience.',
  logo_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public can read website settings" on public.site_settings;
create policy "Public can read website settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- Intentionally do not add anon/authenticated INSERT, UPDATE, or DELETE policies.
-- Admin writes are performed by the server action only after verifying the user
-- exists in public.admins; the server uses the Supabase service-role client.

-- Use the existing portfolio-assets bucket for admin-uploaded logos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];
