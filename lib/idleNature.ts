// Curated nature photos shown as a rotating background on the idle
// screen when no idle YouTube video is configured. Direct Unsplash CDN
// links (images.unsplash.com/photo-<id>) — stable, hotlink-safe, no
// API key needed.
const NATURE_PHOTO_IDS = [
  "1506905925346-21bda4d32df4", // mountain peak
  "1441974231531-c6227db76b6e", // forest road
  "1470071459604-3b5ec3a7fe05", // mountain lake
  "1447752875215-b2761acb3c5d", // sun rays through forest
  "1501854140801-50d01698950b", // mountain range
  "1470252649378-9c29740c9fa8", // mountain sunset
  "1519681393784-d120267933ba", // mountains and clouds
  "1476611317561-60117649dd94", // misty forest
  "1500534623283-312aade485b7", // green landscape
  "1441716844725-09cedc13a4e7", // forest waterfall
  "1465146344425-f00d5f5c8f07", // ocean cliff
  "1500375592092-40eb2168fd21", // green hills
  "1426604966848-d7adac402bff", // foggy forest
  "1495616811223-4d98c6e9c869", // forest path
  "1502082553048-f009c37129b9", // mountain lake reflection
];

export const NATURE_IMAGES: string[] = NATURE_PHOTO_IDS.map(
  (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=80`
);

// Picks a random index, avoiding an immediate repeat of `exclude`.
export function randomImageIndex(exclude?: number): number {
  if (NATURE_IMAGES.length <= 1) return 0;
  let next = Math.floor(Math.random() * NATURE_IMAGES.length);
  if (next === exclude) next = (next + 1) % NATURE_IMAGES.length;
  return next;
}
