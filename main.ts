// Monday 23 November 2026 in one image: hands in entry.png, the front page rendered from page/front.html.
// Locally, MAKEFUN_OUTPUT_DIR stands in for /output: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const target = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');

// Check the gate's rules here so a bad render fails loudly: a whole PNG, at most 1 MiB and 1024 x 1024.
const png = readFileSync(source);
const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (!signature.every((byte, i) => png[i] === byte)) throw new Error('entry.png is not a PNG');
if (png.length > 1048576) throw new Error(`entry.png is ${png.length} bytes, over 1 MiB`);
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over 1024x1024`);
if (png.subarray(-8, -4).toString('latin1') !== 'IEND') throw new Error('entry.png is cut short');

writeFileSync(target, png);
