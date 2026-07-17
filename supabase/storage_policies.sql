-- Supabase Storage Buckets & RLS Policy Setup
-- Run this SQL in your Supabase Dashboard -> SQL Editor if buckets or upload permissions are needed.

-- 1. Create buckets if they do not exist
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('skill-logos', 'skill-logos', true)
on conflict (id) do nothing;

-- 2. RLS Policies for 'portfolio' bucket
create policy "Public Access Portfolio Images"
on storage.objects for select
using (bucket_id = 'portfolio');

create policy "Authenticated Users Can Upload Portfolio Images"
on storage.objects for insert
with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Authenticated Users Can Update Portfolio Images"
on storage.objects for update
using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

create policy "Authenticated Users Can Delete Portfolio Images"
on storage.objects for delete
using (bucket_id = 'portfolio' and auth.role() = 'authenticated');

-- 3. RLS Policies for 'skill-logos' bucket (Keputusan 6 & Phase 3.4)
create policy "Public Access Skill Logos"
on storage.objects for select
using (bucket_id = 'skill-logos');

create policy "Authenticated Users Can Upload Skill Logos"
on storage.objects for insert
with check (bucket_id = 'skill-logos' and auth.role() = 'authenticated');

create policy "Authenticated Users Can Update Skill Logos"
on storage.objects for update
using (bucket_id = 'skill-logos' and auth.role() = 'authenticated');

create policy "Authenticated Users Can Delete Skill Logos"
on storage.objects for delete
using (bucket_id = 'skill-logos' and auth.role() = 'authenticated');
