"use client";

import { useEffect, useRef } from "react";
import { extractYoutubeId } from "@/lib/youtube";
import { formatIndonesianDate } from "@/lib/date";
import SplitFlapClock from "./SplitFlapClock";

interface YTPlayer {
  playVideo: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        config: {
          videoId: string;
          width?: string;
          height?: string;
          playerVars: Record<string, string | number>;
          events: { onReady: (e: { target: YTPlayer }) => void };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Idle-state background: a looping YouTube video fills the screen (cropped
// to always cover, like CSS background-size:cover) with a dark scrim over
// it, and the clock floats on top in a glass card. Only used when there is
// truly no other active content — see Slideshow.tsx.
//
// The video starts muted (the only way autoplay is reliably allowed at
// all) and is unmuted a moment after it starts playing — browsers that
// block autoplay-with-sound from the very first frame generally still
// allow unmuting an already-playing element without a fresh user gesture.
export default function IdleClock({
  now,
  youtubeUrl,
}: {
  now: Date;
  youtubeUrl: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !hostRef.current || !window.YT) return;
      const id = extractYoutubeId(youtubeUrl);
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: id,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: id,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (e) => {
            e.target.playVideo();
            setTimeout(() => {
              try {
                e.target.unMute();
                e.target.setVolume(100);
              } catch {
                // Browser refused — video stays muted, which is fine.
              }
            }, 300);
          },
        },
      });
    }

    if (window.YT) {
      createPlayer();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        createPlayer();
      };
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [youtubeUrl]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 [&>iframe]:h-full [&>iframe]:w-full">
          <div ref={hostRef} />
        </div>
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
