-- Adds the idle-state background music link to settings.
-- Run this once in the Supabase SQL editor.

alter table settings
  add column if not exists idle_audio_url text;
