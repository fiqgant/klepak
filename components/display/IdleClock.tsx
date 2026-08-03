"use client";

import { useEffect, useRef } from "react";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { formatIndonesianDate } from "@/lib/date";
import SplitFlapClock from "./SplitFlapClock";

// Idle-state background: only used when there is truly no other active
// content — see Slideshow.tsx. Two independent, optional layers:
//   - youtubeUrl: a looping muted video fills the screen (cropped to
//     always cover, like CSS background-size:cover).
//   - audioUrl: a plain <audio> file looping in the background, remote
//     controllable (play/pause) from /admin via audioPlaying — kept as a
//     native element (not inside the YouTube iframe) because native
//     same-page media is generally given more autoplay leeway by
//     browsers than third-party embedded iframes — YouTube's own embed
//     wouldn't reliably autoplay even muted on some kiosk setups.
// Either, both, or neither can be configured; the clock is always shown.
export default function IdleClock({
  now,
  youtubeUrl,
  audioUrl,
  audioPlaying,
}: {
  now: Date;
  youtubeUrl: string | null;
  audioUrl: string | null;
  audioPlaying: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (audioPlaying) {
      el.play().catch(() => {
        // Autoplay refused by the browser — nothing more we can do here.
      });
    } else {
      el.pause();
    }
  }, [audioPlaying, audioUrl]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {youtubeUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src={toYouTubeEmbedUrl(youtubeUrl)}
            title="Latar video"
            allow="autoplay; encrypted-media"
            frameBorder={0}
          />
        </div>
      ) : (
        <div className="idle-shapes" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      {audioUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} src={audioUrl} loop className="hidden" />
      )}
      {youtubeUrl && <div className="absolute inset-0 bg-black/45" />}
      <div className="relative flex h-full w-full items-center justify-center px-8">
        <div className="flex flex-col items-center gap-4 rounded-base border-4 border-border bg-secondary-background px-10 py-10 shadow-shadow sm:px-16 sm:py-12">
          <SplitFlapClock now={now} />
          <p className="text-center text-lg font-heading text-foreground/70 sm:text-2xl">
            {formatIndonesianDate(now)}
          </p>
        </div>
      </div>
    </div>
  );
}
