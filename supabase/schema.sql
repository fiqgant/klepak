-- ============================================================================
-- Klepak digital signage — schema
-- Run this whole file once in the Supabase SQL editor (Project > SQL Editor).
-- Safe to re-run: uses `if not exists` / `on conflict` where practical.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Text/priority announcements ("Info Hari Ini")
create table if not exists announcements (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  priority    text not null default 'normal' check (priority in ('normal', 'penting', 'darurat')),
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Poster images shown in the main slideshow
create table if not exists posters (
  id               uuid primary key default gen_random_uuid(),
  storage_path     text not null,
  caption          text,
  starts_at        timestamptz not null default now(),
  ends_at          timestamptz,
  display_seconds  integer,
  sort_order       integer not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- Real agenda table, e.g. exam/assessment schedule ("Jadwal Hari Ini")
create table if not exists schedule_items (
  id          uuid primary key default gen_random_uuid(),
  event_date  date not null,
  start_time  time not null,
  end_time    time,
  title       text not null,
  location    text,
  pic         text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- QR-code link slides (QR generated client-side, url stored here)
create table if not exists qr_links (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text not null,
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Experimental: video slides (upload or YouTube)
create table if not exists videos (
  id           uuid primary key default gen_random_uuid(),
  source_type  text not null check (source_type in ('upload', 'youtube')),
  source_value text not null,
  caption      text,
  starts_at    timestamptz not null default now(),
  ends_at      timestamptz,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Single-row emergency takeover switch
create table if not exists emergency_override (
  id          integer primary key default 1,
  is_active   boolean not null default false,
  text        text not null default '',
  updated_at  timestamptz not null default now(),
  constraint emergency_override_singleton check (id = 1)
);
insert into emergency_override (id, is_active, text)
values (1, false, '')
on conflict (id) do nothing;

-- Single-row global settings
create table if not exists settings (
  id                       integer primary key default 1,
  poster_default_seconds  integer not null default 8,
  idle_youtube_url         text,
  idle_audio_url           text,
  idle_audio_playing       boolean not null default true,
  updated_at               timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
insert into settings (id, poster_default_seconds)
values (1, 8)
on conflict (id) do nothing;

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- Pattern for the six content tables: anon (public) can only SELECT rows
-- that are is_active = true and currently inside [starts_at, ends_at]
-- (ends_at null = open-ended). The authenticated role (the one logged-in
-- admin account) gets full read/write on every row, active or not, so the
-- admin panel can edit drafts and future/expired content.
-- ============================================================================

alter table announcements     enable row level security;
alter table posters           enable row level security;
alter table schedule_items    enable row level security;
alter table qr_links          enable row level security;
alter table videos            enable row level security;
alter table emergency_override enable row level security;
alter table settings          enable row level security;

-- announcements
create policy "announcements_public_read_live" on announcements
  for select to anon
  using (is_active = true and starts_at <= now() and (ends_at is null or ends_at >= now()));
create policy "announcements_admin_select" on announcements
  for select to authenticated using (true);
create policy "announcements_admin_insert" on announcements
  for insert to authenticated with check (true);
create policy "announcements_admin_update" on announcements
  for update to authenticated using (true) with check (true);
create policy "announcements_admin_delete" on announcements
  for delete to authenticated using (true);

-- posters
create policy "posters_public_read_live" on posters
  for select to anon
  using (is_active = true and starts_at <= now() and (ends_at is null or ends_at >= now()));
create policy "posters_admin_select" on posters
  for select to authenticated using (true);
create policy "posters_admin_insert" on posters
  for insert to authenticated with check (true);
create policy "posters_admin_update" on posters
  for update to authenticated using (true) with check (true);
create policy "posters_admin_delete" on posters
  for delete to authenticated using (true);

-- schedule_items
create policy "schedule_items_public_read_live" on schedule_items
  for select to anon
  using (is_active = true);
create policy "schedule_items_admin_select" on schedule_items
  for select to authenticated using (true);
create policy "schedule_items_admin_insert" on schedule_items
  for insert to authenticated with check (true);
create policy "schedule_items_admin_update" on schedule_items
  for update to authenticated using (true) with check (true);
create policy "schedule_items_admin_delete" on schedule_items
  for delete to authenticated using (true);

-- qr_links
create policy "qr_links_public_read_live" on qr_links
  for select to anon
  using (is_active = true and starts_at <= now() and (ends_at is null or ends_at >= now()));
create policy "qr_links_admin_select" on qr_links
  for select to authenticated using (true);
create policy "qr_links_admin_insert" on qr_links
  for insert to authenticated with check (true);
create policy "qr_links_admin_update" on qr_links
  for update to authenticated using (true) with check (true);
create policy "qr_links_admin_delete" on qr_links
  for delete to authenticated using (true);

-- videos
create policy "videos_public_read_live" on videos
  for select to anon
  using (is_active = true and starts_at <= now() and (ends_at is null or ends_at >= now()));
create policy "videos_admin_select" on videos
  for select to authenticated using (true);
create policy "videos_admin_insert" on videos
  for insert to authenticated with check (true);
create policy "videos_admin_update" on videos
  for update to authenticated using (true) with check (true);
create policy "videos_admin_delete" on videos
  for delete to authenticated using (true);

-- emergency_override (single row, always publicly readable, admin-writable)
create policy "emergency_override_public_read" on emergency_override
  for select to anon using (true);
create policy "emergency_override_admin_select" on emergency_override
  for select to authenticated using (true);
create policy "emergency_override_admin_update" on emergency_override
  for update to authenticated using (true) with check (true);

-- settings (single row, always publicly readable, admin-writable)
create policy "settings_public_read" on settings
  for select to anon using (true);
create policy "settings_admin_select" on settings
  for select to authenticated using (true);
create policy "settings_admin_update" on settings
  for update to authenticated using (true) with check (true);

-- ============================================================================
-- REALTIME
-- Enable Realtime change broadcasts on the six content/live tables so admin
-- edits show up on /display without a reload.
-- ============================================================================

alter publication supabase_realtime add table announcements;
alter publication supabase_realtime add table posters;
alter publication supabase_realtime add table schedule_items;
alter publication supabase_realtime add table qr_links;
alter publication supabase_realtime add table videos;
alter publication supabase_realtime add table emergency_override;

-- ============================================================================
-- STORAGE
-- Creates the public "signage-images" bucket used for poster (and uploaded
-- video) files, plus RLS-equivalent storage policies: public read, admin
-- (authenticated) write. You can instead create the bucket via the Storage
-- tab in the dashboard — see README — this block is provided so the whole
-- schema can be applied in one shot.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('signage-images', 'signage-images', true)
on conflict (id) do nothing;

create policy "signage_images_public_read" on storage.objects
  for select to anon
  using (bucket_id = 'signage-images');

create policy "signage_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'signage-images');

create policy "signage_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'signage-images')
  with check (bucket_id = 'signage-images');

create policy "signage_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'signage-images');
