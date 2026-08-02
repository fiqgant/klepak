// Accepts either a bare YouTube video ID or a full URL and normalizes to an
// embeddable, autoplaying, looping URL, captions off. Muted by default
// since autoplay-with-sound is blocked by most browsers without it — pass
// { muted: false } for contexts (like a controlled kiosk box) where sound
// is wanted and the target device allows it.
export function toYouTubeEmbedUrl(
  idOrUrl: string,
  options: { muted?: boolean } = {}
): string {
  const { muted = true } = options;
  let id = idOrUrl.trim();
  const match = id.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  if (match) id = match[1];
  const params = new URLSearchParams({
    autoplay: "1",
    mute: muted ? "1" : "0",
    controls: "0",
    loop: "1",
    playlist: id,
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    cc_load_policy: "0",
    disablekb: "1",
    fs: "0",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
