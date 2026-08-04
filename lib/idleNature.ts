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
  "1440342359743-84fcb8c21f21", // forest canopy from below
  "1477414348463-c0eb7f1359b6", // autumn leaves garland
  "1493246507139-91e8fad9978e", // mountain lake at dusk
  "1439853949127-fa647821eba0", // sunburst through tree
  "1518495973542-4542c06a5843", // misty forest sunbeams
  "1425913397330-cf8af2ff40a1", // mountain peak at dusk
  "1483728642387-6c3bdd6c93e5", // milky way night sky
  "1465101162946-4377e57745c3", // sunset over ocean waves
  "1414609245224-afa02bfb3fda", // sunset over farm field
  "1500382017468-9049fed747ef", // dramatic red mountain peak
  "1508739773434-c26b3d09e071", // forest canopy
  "1470240731273-7821a6eeb6bd", // wildflower meadow
  "1472214103451-9374bd1c798e", // green valley ruins at sunset
  "1519046904884-53103b34b206", // tropical beach with palms
  "1470770841072-f978cf4d019e", // mountain lake cabin at dusk
  "1511884642898-4c92249e20b6", // underwater ocean light rays
  "1504280390367-361c6d9f38f4", // misty forest river
  "1490750967868-88aa4486c946", // tent view over snowy forest
  "1454496522488-7a8e488e8606", // orange wildflowers, blue sky
  "1441260038675-7329ab4cc264", // snowy mountain range and clouds
  "1516214104703-d870798883c5", // sunlit forest path
  "1445307806294-bff7f67ff225", // hammock over forest lake
  "1500462918059-b1a0cb512f1d", // mountain lake reflection at sunrise
  "1502786129293-79981df4e689", // turquoise glacier lake
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
