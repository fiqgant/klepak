"use client";

import { useEffect, useRef, useState } from "react";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { formatEnglishDate, formatTimeDigits } from "@/lib/date";
import { NATURE_IMAGES, randomImageIndex } from "@/lib/idleNature";
import { ENTREPRENEUR_QUOTES, randomQuoteIndex } from "@/lib/idleQuotes";
import SplitFlapClock from "./SplitFlapClock";

const NATURE_ROTATE_MS = 30_000;
const QUOTE_ROTATE_MS = 15_000;

const CLOCK_POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;
type ClockPosition = (typeof CLOCK_POSITIONS)[number];

const CLOCK_POSITION_CLASSES: Record<ClockPosition, string> = {
  "top-left": "left-6 top-6 sm:left-10 sm:top-10",
  "top-right": "right-6 top-6 sm:right-10 sm:top-10",
  "bottom-left": "left-6 bottom-6 sm:left-10 sm:bottom-10",
  "bottom-right": "right-6 bottom-6 sm:right-10 sm:bottom-10",
};

// Picks a random clock corner, avoiding an immediate repeat of `exclude`.
function randomClockPosition(exclude?: ClockPosition): ClockPosition {
  const options = exclude
    ? CLOCK_POSITIONS.filter((p) => p !== exclude)
    : CLOCK_POSITIONS;
  return options[Math.floor(Math.random() * options.length)];
}

// Pan + tilt for the 3D Ken Burns background effect — cycled by photo
// index so consecutive photos don't all drift the same way. rx/ry add
// the rotateX/rotateY tilt that (combined with the container's
// `perspective`) makes the pan read as depth instead of a flat slide.
const PARALLAX_OFFSETS = [
  { x: "-4%", y: "-3%", rx: "2deg", ry: "-2.5deg" },
  { x: "4%", y: "-3%", rx: "-2deg", ry: "2.5deg" },
  { x: "-4%", y: "3%", rx: "2deg", ry: "2.5deg" },
  { x: "4%", y: "3%", rx: "-2deg", ry: "-2.5deg" },
];

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
  const [clockPosition, setClockPosition] = useState<ClockPosition>(() =>
    randomClockPosition(),
  );

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
      setClockPosition((p) => randomClockPosition(p));
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

  const { hours, minutes, seconds } = formatTimeDigits(now);
  const quote = ENTREPRENEUR_QUOTES[quoteIndex];

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      style={{ perspective: "1400px" }}
    >
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
          className="idle-nature-bg idle-nature-parallax absolute inset-0 h-full w-full object-cover"
          style={
            {
              "--parallax-x":
                PARALLAX_OFFSETS[natureIndex % PARALLAX_OFFSETS.length].x,
              "--parallax-y":
                PARALLAX_OFFSETS[natureIndex % PARALLAX_OFFSETS.length].y,
              "--parallax-rx":
                PARALLAX_OFFSETS[natureIndex % PARALLAX_OFFSETS.length].rx,
              "--parallax-ry":
                PARALLAX_OFFSETS[natureIndex % PARALLAX_OFFSETS.length].ry,
            } as React.CSSProperties
          }
        />
      )}
      {audioUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} src={audioUrl} loop className="hidden" />
      )}
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-x-0 top-3 z-10 flex justify-center sm:top-4">
        <div className="idle-foreground-float flex items-center gap-3 rounded-base border-4 border-border bg-secondary-background/95 px-4 py-2 shadow-shadow sm:gap-4 sm:px-6 sm:py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/wbi.webp"
            alt="WBI"
            className="h-8 w-auto object-contain sm:h-12"
          />
          {/* Source PNG has large symmetric transparent padding (content is
              only ~45% of the canvas height) — crop it out with object-cover
              on a matching aspect-ratio box so it reads the same visual
              height as the WBI logo instead of looking tiny. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/wbiic.webp"
            alt="WBIIC"
            className="aspect-[974/270] h-8 w-auto object-cover object-center sm:h-12"
          />
        </div>
      </div>

      {youtubeUrl ? (
        <div className="relative flex h-full w-full items-center justify-center px-8">
          <div className="flex flex-col items-center gap-4 rounded-base border-4 border-border bg-secondary-background px-10 py-10 shadow-shadow sm:px-16 sm:py-12">
            <SplitFlapClock now={now} />
            <p className="text-center text-lg font-heading text-foreground/70 sm:text-2xl">
              {formatEnglishDate(now)}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`idle-foreground-float absolute flex flex-col items-center gap-1 rounded-base border-4 border-border bg-secondary-background/95 px-6 py-4 shadow-shadow sm:px-8 sm:py-5 ${CLOCK_POSITION_CLASSES[clockPosition]}`}
          >
            <p className="font-heading text-5xl tabular-nums text-foreground sm:text-6xl">
              {hours}:{minutes}:{seconds}
            </p>
            <p className="text-center text-sm font-heading text-foreground/70 sm:text-lg">
              {formatEnglishDate(now)}
            </p>
          </div>
          <div
            className={`absolute inset-x-0 flex justify-center px-6 ${
              clockPosition.startsWith("bottom")
                ? "top-28 sm:top-32"
                : "bottom-8 sm:bottom-12"
            }`}
          >
            <div
              key={quoteIndex}
              className="idle-nature-bg idle-foreground-float max-w-4xl rounded-base border-4 border-border bg-secondary-background/95 px-8 py-5 text-center shadow-shadow sm:px-12 sm:py-8"
            >
              <p className="font-heading text-2xl text-foreground sm:text-4xl">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="mt-3 text-base font-heading text-foreground/70 sm:text-xl">
                — {quote.author}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
