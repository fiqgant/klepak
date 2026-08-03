export type Priority = "normal" | "penting" | "darurat";

export interface Announcement {
  id: string;
  text: string;
  priority: Priority;
  starts_at: string;
  ends_at: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Poster {
  id: string;
  storage_path: string;
  caption: string | null;
  starts_at: string;
  ends_at: string | null;
  display_seconds: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ScheduleItem {
  id: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string | null;
  title: string;
  location: string | null;
  pic: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface QrLink {
  id: string;
  title: string;
  url: string;
  starts_at: string;
  ends_at: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type VideoSourceType = "upload" | "youtube";

export interface Video {
  id: string;
  source_type: VideoSourceType;
  source_value: string;
  caption: string | null;
  starts_at: string;
  ends_at: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface EmergencyOverride {
  id: number;
  is_active: boolean;
  text: string;
  updated_at: string;
}

export interface Settings {
  id: number;
  poster_default_seconds: number;
  idle_youtube_url: string | null;
  idle_audio_url: string | null;
  idle_audio_playing: boolean;
  updated_at: string;
}

// One full-screen view in the /display rotation. "clock" and
// "announcements"/"schedule" are aggregate views (no single row); the rest
// are one view per active row.
export type DisplayView =
  | { kind: "clock" }
  | { kind: "announcements"; data: Announcement[] }
  | { kind: "schedule"; data: ScheduleItem[] }
  | { kind: "poster"; data: Poster }
  | { kind: "qr"; data: QrLink }
  | { kind: "video"; data: Video };
