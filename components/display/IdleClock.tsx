"use client";

import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { formatIndonesianDate } from "@/lib/date";
import SplitFlapClock from "./SplitFlapClock";

// Idle-state background: a looping YouTube video fills the screen (cropped
// to always cover, like CSS background-size:cover) with a dark scrim over
// it, and the clock floats on top in a glass card. Only used when there is
// truly no other active content — see Slideshow.tsx.
//
// Muted autoplay is the only playback mode that reliably starts on its own
// across browsers, including Android WebView, without the visitor having
// to press play. Both an unmuted embed and a "start muted then unmute via
// the IFrame API" trick were tried and made the video need a manual play
// press instead — worse than plain muted autoplay, so this stays muted.
// Getting real autoplay-with-sound requires a browser/OS-level permission
// (e.g. Chrome's per-site Sound: Allow setting, or launching the kiosk
// browser with --autoplay-policy=no-user-gesture-required), not something
// fixable from the page itself.
export default function IdleClock({
  now,
  youtubeUrl,
}: {
  now: Date;
  youtubeUrl: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={toYouTubeEmbedUrl(youtubeUrl)}
          title="Latar video"
          allow="autoplay; encrypted-media"
          frameBorder={0}
        />
      </div>
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative flex h-full w-full items-center justify-center px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/15 bg-white/10 px-10 py-10 shadow-2xl backdrop-blur-2xl sm:px-16 sm:py-12">
          <SplitFlapClock now={now} />
          <p className="text-center text-lg font-heading text-white/80 sm:text-2xl">
            {formatIndonesianDate(now)}
          </p>
        </div>
      </div>
    </div>
  );
}
