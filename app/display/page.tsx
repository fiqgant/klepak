"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { isWithinWindow, todayLocalISODate } from "@/lib/date";
import type {
  Announcement,
  DisplayView,
  EmergencyOverride,
  Poster,
  QrLink,
  ScheduleItem,
  Settings,
  Video,
} from "@/lib/types";
import Slideshow from "@/components/display/Slideshow";
import EmergencyOverlay from "@/components/display/EmergencyOverlay";
import StatusMessage from "@/components/display/StatusMessage";

const PRIORITY_RANK: Record<Announcement["priority"], number> = {
  darurat: 0,
  penting: 1,
  normal: 2,
};

const REFRESH_INTERVAL_MS = 30_000;

export default function DisplayPage() {
  const supabase = useMemo(() => createClient(), []);

  const [now, setNow] = useState(() => new Date());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [qrLinks, setQrLinks] = useState<QrLink[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [emergency, setEmergency] = useState<EmergencyOverride | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const lastFetchedDate = useRef<string>(todayLocalISODate());

  const fetchAll = useCallback(async () => {
    try {
      const today = todayLocalISODate();
      lastFetchedDate.current = today;

      const [
        announcementsRes,
        scheduleRes,
        postersRes,
        qrRes,
        videosRes,
        settingsRes,
        emergencyRes,
      ] = await Promise.all([
        supabase
          .from("announcements")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("schedule_items")
          .select("*")
          .eq("is_active", true)
          .eq("event_date", today)
          .order("sort_order", { ascending: true }),
        supabase
          .from("posters")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("qr_links")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("videos")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
        supabase
          .from("emergency_override")
          .select("*")
          .eq("id", 1)
          .maybeSingle(),
      ]);

      const firstError =
        announcementsRes.error ||
        scheduleRes.error ||
        postersRes.error ||
        qrRes.error ||
        videosRes.error ||
        settingsRes.error ||
        emergencyRes.error;

      if (firstError) throw firstError;

      setAnnouncements(announcementsRes.data ?? []);
      setScheduleItems(scheduleRes.data ?? []);
      setPosters(postersRes.data ?? []);
      setQrLinks(qrRes.data ?? []);
      setVideos(videosRes.data ?? []);
      setSettings(settingsRes.data ?? null);
      setEmergency(emergencyRes.data ?? null);
      setError(null);
      setLoaded(true);
    } catch {
      setError("Tidak dapat memuat konten.");
    }
  }, [supabase]);

  // Initial load + periodic safety-net refetch (also catches midnight
  // rollover for schedule_items, which is filtered by event_date).
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Realtime: any admin edit on these tables refetches immediately.
  useEffect(() => {
    const channel = supabase
      .channel("klepak-display")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posters" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedule_items" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "qr_links" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergency_override" },
        fetchAll
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        fetchAll
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchAll]);

  // Clock tick — also drives the live re-filter below so content
  // disappears the instant it expires, without waiting for a reload.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const liveAnnouncements = useMemo(() => {
    return announcements
      .filter((a) => isWithinWindow(a.starts_at, a.ends_at, now))
      .sort((a, b) => {
        const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        return rank !== 0 ? rank : a.sort_order - b.sort_order;
      });
  }, [announcements, now]);

  const views: DisplayView[] = useMemo(() => {
    const livePosters = posters.filter((p) =>
      isWithinWindow(p.starts_at, p.ends_at, now)
    );
    const liveQr = qrLinks.filter((q) =>
      isWithinWindow(q.starts_at, q.ends_at, now)
    );
    const liveVideos = videos.filter((v) =>
      isWithinWindow(v.starts_at, v.ends_at, now)
    );

    const content: Extract<DisplayView, { kind: "poster" | "qr" | "video" }>[] = [
      ...livePosters.map((data) => ({ kind: "poster" as const, data })),
      ...liveQr.map((data) => ({ kind: "qr" as const, data })),
      ...liveVideos.map((data) => ({ kind: "video" as const, data })),
    ];
    content.sort((a, b) => a.data.sort_order - b.data.sort_order);

    // Clock always anchors the rotation; announcements/schedule get their
    // own full-screen view only when there's something to show. If none of
    // that exists, the clock ends up as the sole view and is shown
    // statically full screen instead of "no content" clutter.
    return [
      { kind: "clock" as const },
      ...(liveAnnouncements.length > 0
        ? [{ kind: "announcements" as const, data: liveAnnouncements }]
        : []),
      ...(scheduleItems.length > 0
        ? [{ kind: "schedule" as const, data: scheduleItems }]
        : []),
      ...content,
    ];
  }, [posters, qrLinks, videos, now, liveAnnouncements, scheduleItems]);

  const emergencyActive = emergency?.is_active === true;

  if (!loaded && !error) {
    return <StatusMessage message="Memuat konten..." />;
  }

  if (error) {
    return <StatusMessage message={error} />;
  }

  if (emergencyActive) {
    return <EmergencyOverlay text={emergency?.text ?? ""} />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <Slideshow
        views={views}
        now={now}
        defaultSeconds={settings?.poster_default_seconds ?? 8}
      />
    </main>
  );
}
