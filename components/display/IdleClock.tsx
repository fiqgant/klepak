"use client";

import { useEffect, useRef, useState } from "react";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { formatIndonesianDate, formatTimeDigits } from "@/lib/date";
import { NATURE_IMAGES, randomImageIndex } from "@/lib/idleNature";
import { ENTREPRENEUR_QUOTES, randomQuoteIndex } from "@/lib/idleQuotes";
import SplitFlapClock from "./SplitFlapClock";

const NATURE_ROTATE_MS = 30_000;
const QUOTE_ROTATE_MS = 15_000;

// Idle-state background: only used when there is truly no other active
// content — see Slideshow.tsx. Two independent, optional layers:
//   - youtubeUrl: a looping muted video fills the screen (cropped to
//     always cover, like CSS background-size:cover). When set, this
//     takes over the whole screen with just the big clock overlay.
//   - audioUrl: a plain <audio> file looping in the background, remote
//     controllable (play/pause) from /admin via audioPlaying — kept as a
//     native element (not inside the YouTube iframe) because native
//     same-page media is generally given more autoplay leeway by
//     browsers than third-party embedded iframes — YouTube's own embed
//     wouldn't reliably autoplay even muted on some kiosk setups.
// When no video is configured, the background instead rotates through
// curated nature photos with a small clock and rotating entrepreneur
// quotes overlaid, so the idle screen isn't just a static clock.
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
  const [natureIndex, setNatureIndex] = useState(() => randomImageIndex());
  const [quoteIndex, setQuoteIndex] = useState(() => randomQuoteIndex());

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

  useEffect(() => {
    if (youtubeUrl) return;
    const id = setInterval(() => {
      setNatureIndex((i) => randomImageIndex(i));
    }, NATURE_ROTATE_MS);
    return () => clearInterval(id);
  }, [youtubeUrl]);

  useEffect(() => {
    if (youtubeUrl) return;
    const id = setInterval(() => {
      setQuoteIndex((i) => randomQuoteIndex(i));
    }, QUOTE_ROTATE_MS);
    return () => clearInterval(id);
  }, [youtubeUrl]);

  const { hours, minutes } = formatTimeDigits(now);
  const quote = ENTREPRENEUR_QUOTES[quoteIndex];

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={natureIndex}
          src={NATURE_IMAGES[natureIndex]}
          alt=""
          className="idle-nature-bg absolute inset-0 h-full w-full object-cover"
        />
      )}
      {audioUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} src={audioUrl} loop className="hidden" />
      )}
      <div className="absolute inset-0 bg-black/45" />

      {youtubeUrl ? (
        <div className="relative flex h-full w-full items-center justify-center px-8">
          <div className="flex flex-col items-center gap-4 rounded-base border-4 border-border bg-secondary-background px-10 py-10 shadow-shadow sm:px-16 sm:py-12">
            <SplitFlapClock now={now} />
            <p className="text-center text-lg font-heading text-foreground/70 sm:text-2xl">
              {formatIndonesianDate(now)}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute right-6 top-6 flex flex-col items-center gap-1 rounded-base border-4 border-border bg-secondary-background/95 px-5 py-3 shadow-shadow sm:right-10 sm:top-10 sm:px-6 sm:py-4">
            <p className="font-heading text-3xl tabular-nums text-foreground sm:text-4xl">
              {hours}:{minutes}
            </p>
            <p className="text-center text-xs font-heading text-foreground/70 sm:text-sm">
              {formatIndonesianDate(now)}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-8 flex justify-center px-6 sm:bottom-12">
            <div
              key={quoteIndex}
              className="idle-nature-bg max-w-3xl rounded-base border-4 border-border bg-secondary-background/95 px-6 py-4 text-center shadow-shadow sm:px-10 sm:py-6"
            >
              <p className="font-heading text-lg text-foreground sm:text-2xl">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="mt-2 text-sm font-heading text-foreground/70 sm:text-base">
                — {quote.author}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
