/* The project cards in Work.jsx were Figma SVG exports carrying huge embedded
   base64 rasters — a 4032x4032 PNG inside a 641x563 box, displayed in a card no
   wider than 608 CSS px. This flattens each one to a WebP at 2x its design box.

   Chrome does the rasterising rather than sharp/librsvg on purpose: these files
   lean on mix-blend-mode, feGaussianBlur stacks and patterns, and Chrome is the
   engine that actually renders them on the site, so what it produces is what
   visitors already see. sharp only handles the WebP encode.

   Usage: node scripts/rasterize-work-art.mjs [name ...]   (default: all) */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SRC = 'src/assets';
const OUT = 'src/assets/work';
const SCALE = 2; // retina for the largest card, which tops out at 608 CSS px
const QUALITY = 88;

const NAMES = [
  'hawksm', 'One', 'Neuropulse', 'fab', 'stack',
  'chic', 'innocreatives', 'stego', 'banking', 'workhub', 'ReadlyAI',
];

const boxOf = (svg) => {
  const wh = svg.match(/<svg[^>]*?\bwidth="([\d.]+)"[^>]*?\bheight="([\d.]+)"/);
  if (wh) return [Math.round(+wh[1]), Math.round(+wh[2])];
  const vb = svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/);
  if (!vb) throw new Error('no width/height or viewBox');
  return [Math.round(+vb[1]), Math.round(+vb[2])];
};

const targets = process.argv.slice(2).length ? process.argv.slice(2) : NAMES;
fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'work-art-'));
let before = 0;
let after = 0;

for (const name of targets) {
  const src = path.join(SRC, `${name}.svg`);
  const svg = fs.readFileSync(src, 'utf8');
  const [bw, bh] = boxOf(svg);
  const w = bw * SCALE;
  const h = bh * SCALE;

  /* The SVG goes in via file:// rather than inline so no escaping of its own
     markup is needed, and the page is stripped to nothing but the image so the
     screenshot is the artwork and not a scrollbar or a white margin. */
  const page = path.join(tmp, `${name}.html`);
  fs.writeFileSync(
    page,
    `<style>html,body{margin:0;padding:0;background:transparent}` +
      `img{display:block;width:${w}px;height:${h}px}</style>` +
      `<img src="file://${path.resolve(src)}">`
  );

  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--screenshot=${path.join(tmp, `${name}.png`)}`,
    `--window-size=${w},${h}`,
    `--virtual-time-budget=4000`,
    `file://${page}`,
  ], { stdio: 'ignore' });

  const dst = path.join(OUT, `${name}.webp`);
  await sharp(path.join(tmp, `${name}.png`))
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(dst);

  const b = fs.statSync(src).size;
  const a = fs.statSync(dst).size;
  before += b;
  after += a;
  console.log(
    `${name.padEnd(14)} ${bw}x${bh} -> ${w}x${h}  ` +
      `${(b / 1048576).toFixed(2)}MB -> ${(a / 1024).toFixed(0)}KB  ` +
      `(-${(100 - (a / b) * 100).toFixed(1)}%)`
  );
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(
  `\ntotal ${(before / 1048576).toFixed(2)}MB -> ${(after / 1048576).toFixed(2)}MB ` +
    `(-${(100 - (after / before) * 100).toFixed(1)}%)`
);
