/* Photographic assets that shipped at their download resolution. Unlike the
   project cards (see rasterize-work-art.mjs) these are already single rasters,
   so this is a straight re-encode to WebP at the size they are actually shown.

   Usage: node scripts/optimize-photos.mjs */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const JOBS = [
  {
    /* Lossless, deliberately. This is the largest, most looked-at image on the
       site and it is already being upscaled: the source is 1672px wide but the
       element is full-bleed, so a 1440px viewport at 2x DPR paints it across
       ~2880 device px. Upscaling magnifies compression artifacts, and the
       subject is curly hair against black -- the highest-frequency detail
       there is, and the first thing a lossy encoder throws away. At q82 the
       fine strands turned to mush and the dark mass went blotchy. Lossless is
       byte-exact with the PNG and still 42% smaller than it. */
    src: 'src/assets/hero-portrait.png',
    out: 'src/assets/hero-portrait.webp',
    width: null,
    webp: { lossless: true, effort: 6 },
  },
  {
    /* A 100vh backdrop under an 80% black wash, which flattens its contrast
       roughly fivefold and hides artifacts with it, so this one can afford to
       lose resolution. Still kept well clear of the point where banding would
       show through the wash. */
    src: 'src/assets/sharath-kumar-hari-CaQYGwIGC3g-unsplash.jpg',
    out: 'src/assets/xp-backdrop.webp',
    width: 2400,
    webp: { quality: 80, effort: 6 },
  },
];

for (const { src, out, width, webp } of JOBS) {
  let img = sharp(src);
  if (width) img = img.resize({ width, withoutEnlargement: true });
  const info = await img.webp(webp).toFile(out);
  const before = fs.statSync(src).size;
  console.log(
    `${path.basename(src).padEnd(46)} ${(before / 1048576).toFixed(2)}MB -> ` +
      `${(info.size / 1024).toFixed(0)}KB  ${info.width}x${info.height}  ` +
      `(-${(100 - (info.size / before) * 100).toFixed(1)}%)`
  );
}
