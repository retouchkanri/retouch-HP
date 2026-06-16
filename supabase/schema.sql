-- Run this in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/kwytnjcghauwbqzgwnxo/sql

create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  category text not null,
  title text not null,
  img text,
  body text,
  link_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migration: add columns if table already exists
alter table public.news_items add column if not exists img text;
alter table public.news_items add column if not exists body text;
alter table public.news_items add column if not exists link_url text;

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  outlet text not null,
  date text not null,
  title text not null,
  img text not null,
  url text,
  img_alt text,
  media_type text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists news_items_updated_at on public.news_items;
create trigger news_items_updated_at
  before update on public.news_items
  for each row execute function public.set_updated_at();

drop trigger if exists media_items_updated_at on public.media_items;
create trigger media_items_updated_at
  before update on public.media_items
  for each row execute function public.set_updated_at();

alter table public.news_items enable row level security;
alter table public.media_items enable row level security;

drop policy if exists "Public read news" on public.news_items;
create policy "Public read news"
  on public.news_items for select
  using (true);

drop policy if exists "Public read media" on public.media_items;
create policy "Public read media"
  on public.media_items for select
  using (true);

drop policy if exists "Authenticated manage news" on public.news_items;
create policy "Authenticated manage news"
  on public.news_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated manage media" on public.media_items;
create policy "Authenticated manage media"
  on public.media_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for news item images
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read news-images" on storage.objects;
create policy "Public read news-images"
  on storage.objects for select
  using (bucket_id = 'news-images');

drop policy if exists "Authenticated upload news-images" on storage.objects;
create policy "Authenticated upload news-images"
  on storage.objects for insert
  with check (bucket_id = 'news-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated update news-images" on storage.objects;
create policy "Authenticated update news-images"
  on storage.objects for update
  using (bucket_id = 'news-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated delete news-images" on storage.objects;
create policy "Authenticated delete news-images"
  on storage.objects for delete
  using (bucket_id = 'news-images' and auth.role() = 'authenticated');

-- ============================================================================
-- Horses
-- ============================================================================

create table if not exists public.horses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sex text,
  age text,
  age_years int,
  status text not null default 'protected',
  status_label text not null default '現在の保護馬',
  order_num int,
  personality text not null default '',
  story text not null default '',
  before_story text,
  photo text,
  owner_story text,
  sort_order int not null default 0,
  goal int not null default 0,
  raised int not null default 0,
  supporters int not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists horses_updated_at on public.horses;
create trigger horses_updated_at
  before update on public.horses
  for each row execute function public.set_updated_at();

alter table public.horses enable row level security;

drop policy if exists "Public read horses" on public.horses;
create policy "Public read horses"
  on public.horses for select
  using (true);

drop policy if exists "Authenticated manage horses" on public.horses;
create policy "Authenticated manage horses"
  on public.horses for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for horse images
insert into storage.buckets (id, name, public)
values ('horse-images', 'horse-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read horse-images" on storage.objects;
create policy "Public read horse-images"
  on storage.objects for select
  using (bucket_id = 'horse-images');

drop policy if exists "Authenticated upload horse-images" on storage.objects;
create policy "Authenticated upload horse-images"
  on storage.objects for insert
  with check (bucket_id = 'horse-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated update horse-images" on storage.objects;
create policy "Authenticated update horse-images"
  on storage.objects for update
  using (bucket_id = 'horse-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated delete horse-images" on storage.objects;
create policy "Authenticated delete horse-images"
  on storage.objects for delete
  using (bucket_id = 'horse-images' and auth.role() = 'authenticated');

-- Storage bucket for general media coverage images
insert into storage.buckets (id, name, public)
values ('media-image', 'media-image', true)
on conflict (id) do nothing;

drop policy if exists "Public read media-image" on storage.objects;
create policy "Public read media-image"
  on storage.objects for select
  using (bucket_id = 'media-image');

drop policy if exists "Authenticated upload media-image" on storage.objects;
create policy "Authenticated upload media-image"
  on storage.objects for insert
  with check (bucket_id = 'media-image' and auth.role() = 'authenticated');

drop policy if exists "Authenticated update media-image" on storage.objects;
create policy "Authenticated update media-image"
  on storage.objects for update
  using (bucket_id = 'media-image' and auth.role() = 'authenticated');

drop policy if exists "Authenticated delete media-image" on storage.objects;
create policy "Authenticated delete media-image"
  on storage.objects for delete
  using (bucket_id = 'media-image' and auth.role() = 'authenticated');

-- ============================================================================
-- FAQ
-- ============================================================================

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists faq_items_updated_at on public.faq_items;
create trigger faq_items_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

alter table public.faq_items enable row level security;

drop policy if exists "Public read faq" on public.faq_items;
create policy "Public read faq"
  on public.faq_items for select
  using (true);

drop policy if exists "Authenticated manage faq" on public.faq_items;
create policy "Authenticated manage faq"
  on public.faq_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
