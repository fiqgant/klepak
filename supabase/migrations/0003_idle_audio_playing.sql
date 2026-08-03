-- Adds a remote play/pause switch for the idle background music,
-- toggled from /admin and picked up live on /display via Realtime.
-- Run this once in the Supabase SQL editor.

alter table settings
  add column if not exists idle_audio_playing boolean not null default true;
