"use client";

import { useEffect, useRef, useState } from "react";
import type { DisplayView } from "@/lib/types";
import { formatIndonesianDate } from "@/lib/date";
import SplitFlapClock from "./SplitFlapClock";
import IdleClock from "./IdleClock";
import AnnouncementsList from "./AnnouncementsList";
import ScheduleTable from "./ScheduleTable";
import PosterSlide from "./PosterSlide";
import QrSlide from "./QrSlide";
import VideoSlide from "./VideoSlide";
import StatusMessage from "./StatusMessage";

function viewSeconds(view: DisplayView, defaultSeconds: number): number {
  if (view.kind === "poster") {
    return view.data.display_seconds ?? defaultSeconds;
  }
  return defaultSeconds;
}

export default function Slideshow({
  views,
  now,
  defaultSeconds,
  idleYoutubeUrl,
}: {
  views: DisplayView[];
  now: Date;
  defaultSeconds: number;
  idleYoutubeUrl?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Keep index in range whenever the live-filtered view list shrinks.
  useEffect(() => {
    if (index >= views.length && views.length > 0) {
      setIndex(0);
    }
  }, [views.length, index]);

  // Only the clock (no other active content): render it statically full
  // screen instead of running a pointless one-item rotation.
  const isStatic = views.length <= 1;

  // A stable identity for the current view set. `views` itself is a new
  // array reference on every parent render (it's rebuilt each clock tick),
  // so using it directly as an effect dependency below would reset the
  // advance timer every second before it ever fires. This string only
  // changes when the actual set of content changes.
  const viewsKey = views
    .map((v) => {
      if (v.kind === "clock") return "clock";
      if (v.kind === "announcements")
        return `announcements:${v.data.map((a) => a.id).join(".")}`;
      if (v.kind === "schedule")
        return `schedule:${v.data.map((s) => s.id).join(".")}`;
      return `${v.kind}:${v.data.id}`;
    })
    .join(",");

  useEffect(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (isStatic) return;

    const current = views[index];
    const seconds = viewSeconds(current, defaultSeconds);
    const fadeMs = prefersReducedMotion ? 0 : 600;

    advanceTimer.current = setTimeout(() => {
      setVisible(false);
      fadeTimer.current = setTimeout(() => {
        setIndex((i) => (views.length === 0 ? 0 : (i + 1) % views.length));
        setVisible(true);
      }, fadeMs);
    }, seconds * 1000);

    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, viewsKey, defaultSeconds, isStatic]);

  function advanceNow() {
    if (isStatic) return;
    setVisible(false);
    setTimeout(
      () => {
        setIndex((i) => (views.length === 0 ? 0 : (i + 1) % views.length));
        setVisible(true);
      },
      prefersReducedMotion ? 0 : 600
    );
  }

  if (views.length === 0) {
    return <StatusMessage message="Belum ada konten untuk ditampilkan." />;
  }

  const current = views[Math.min(index, views.length - 1)];

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <div
        className={`slide-fade h-full w-full ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {current.kind === "clock" &&
          (isStatic && idleYoutubeUrl ? (
            <IdleClock now={now} youtubeUrl={idleYoutubeUrl} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-background px-8">
              <SplitFlapClock now={now} />
              <p className="text-center text-lg font-heading text-foreground/70 sm:text-2xl">
                {formatIndonesianDate(now)}
              </p>
            </div>
          ))}
        {current.kind === "announcements" && (
          <AnnouncementsList announcements={current.data} />
        )}
        {current.kind === "schedule" && <ScheduleTable items={current.data} />}
        {current.kind === "poster" && <PosterSlide poster={current.data} />}
        {current.kind === "qr" && <QrSlide link={current.data} />}
        {current.kind === "video" && (
          <VideoSlide video={current.data} onEnded={advanceNow} />
        )}
      </div>
    </div>
  );
}
