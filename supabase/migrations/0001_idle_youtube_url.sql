-- Adds the idle-state YouTube background link to settings.
-- Run this once in the Supabase SQL editor if your project already ran
-- the original schema.sql before this column existed.

alter table settings
  add column if not exists idle_youtube_url text;
