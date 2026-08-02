"use client";

import { createClient } from "@/lib/supabase";
import type { Poster } from "@/lib/types";

export function getPosterPublicUrl(storagePath: string): string {
  const supabase = createClient();
  return supabase.storage.from("signage-images").getPublicUrl(storagePath)
    .data.publicUrl;
}

export default function PosterSlide({ poster }: { poster: Poster }) {
  const url = getPosterPublicUrl(poster.storage_path);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={poster.caption ?? ""}
        className="h-full w-full object-contain"
      />
      {poster.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-3 text-center text-lg text-klepak-cream">
          {poster.caption}
        </div>
      )}
    </div>
  );
}
