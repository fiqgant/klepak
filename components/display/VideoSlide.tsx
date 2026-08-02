"use client";

import type { Video } from "@/lib/types";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

export default function VideoSlide({
  video,
  onEnded,
}: {
  video: Video;
  onEnded: () => void;
}) {
  if (video.source_type === "youtube") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black">
        <iframe
          className="h-full w-full"
          src={toYouTubeEmbedUrl(video.source_value)}
          title={video.caption ?? "video"}
          allow="autoplay; encrypted-media"
          frameBorder={0}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <video
        className="h-full w-full object-contain"
        src={video.source_value}
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
      />
    </div>
  );
}
