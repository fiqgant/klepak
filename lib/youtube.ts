// Accepts either a bare YouTube video ID or a full URL and normalizes to an
// embeddable, autoplaying, muted, looping URL (autoplay requires muted on
// most browsers, including old Android WebViews).
export function toYouTubeEmbedUrl(idOrUrl: string): string {
  let id = idOrUrl.trim();
  const match = id.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  if (match) id = match[1];
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id,
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
