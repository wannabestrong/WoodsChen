-- OPEN content admin migration. Run once in Supabase SQL Editor.

alter table public.articles add column if not exists cover_url text default '';
alter table public.articles add column if not exists status text default 'published';
alter table public.articles add column if not exists updated_at timestamptz default now();

drop policy if exists "公开可读文章" on public.articles;
drop policy if exists "public can read articles" on public.articles;
drop policy if exists "public can read published articles" on public.articles;
create policy "public can read published articles"
on public.articles for select
using (status = 'published');

drop policy if exists "authenticated users can read all articles" on public.articles;
create policy "authenticated users can read all articles"
on public.articles for select to authenticated
using (true);

create table if not exists public.photo_stories (
  id text primary key,
  title text not null,
  place text default '',
  date text default '',
  summary text default '',
  description text default '',
  cover_url text default '',
  images jsonb default '[]'::jsonb,
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.photo_stories enable row level security;

drop policy if exists "public can read published photo stories" on public.photo_stories;
create policy "public can read published photo stories"
on public.photo_stories for select
using (status = 'published');

drop policy if exists "authenticated users can read all photo stories" on public.photo_stories;
create policy "authenticated users can read all photo stories"
on public.photo_stories for select to authenticated
using (true);

drop policy if exists "authenticated users can insert photo stories" on public.photo_stories;
create policy "authenticated users can insert photo stories"
on public.photo_stories for insert to authenticated
with check (true);

drop policy if exists "authenticated users can update photo stories" on public.photo_stories;
create policy "authenticated users can update photo stories"
on public.photo_stories for update to authenticated
using (true) with check (true);

drop policy if exists "authenticated users can delete photo stories" on public.photo_stories;
create policy "authenticated users can delete photo stories"
on public.photo_stories for delete to authenticated
using (true);

drop policy if exists "authenticated users can update articles" on public.articles;
create policy "authenticated users can update articles"
on public.articles for update to authenticated
using (true) with check (true);

drop policy if exists "authenticated users can insert articles" on public.articles;
create policy "authenticated users can insert articles"
on public.articles for insert to authenticated
with check (true);

drop policy if exists "authenticated users can delete articles" on public.articles;
create policy "authenticated users can delete articles"
on public.articles for delete to authenticated
using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'open-media',
  'open-media',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read open media" on storage.objects;
create policy "public can read open media"
on storage.objects for select
using (bucket_id = 'open-media');

drop policy if exists "authenticated users can upload open media" on storage.objects;
create policy "authenticated users can upload open media"
on storage.objects for insert to authenticated
with check (bucket_id = 'open-media');

drop policy if exists "authenticated users can update open media" on storage.objects;
create policy "authenticated users can update open media"
on storage.objects for update to authenticated
using (bucket_id = 'open-media')
with check (bucket_id = 'open-media');

drop policy if exists "authenticated users can delete open media" on storage.objects;
create policy "authenticated users can delete open media"
on storage.objects for delete to authenticated
using (bucket_id = 'open-media');
