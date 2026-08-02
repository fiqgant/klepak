"use client";

import type { Video } from "@/lib/types";

function toYouTubeEmbedUrl(idOrUrl: string): string {
  // Accepts either a bare video ID or a full URL and normalizes to an
  // embeddable, autoplaying, muted URL (autoplay requires muted on most
  // browsers, including old Android WebViews).
  let id = idOrUrl.trim();
  const match = id.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  if (match) id = match[1];
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`;
}

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
