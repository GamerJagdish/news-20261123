// Renders page/front.html to entry.png at exactly 1024 x 1024 with headless Edge (or Chrome).
// Run from the repository root: node page/render.mjs
// The grader never runs this: main.ts only copies the committed entry.png.
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const page = pathToFileURL(join(here, 'front.html')).href;
const out = join(here, '..', 'entry.png');

const browser = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
].filter(Boolean).find((p) => existsSync(p));
if (!browser) throw new Error('no headless browser found; set BROWSER');

// --force-device-scale-factor=1 keeps Windows display scaling from shrinking the frame.
execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1024,1024',
  '--virtual-time-budget=2000',
  `--screenshot=${out}`,
  page,
], { stdio: 'inherit' });

console.log(`wrote ${out} (${statSync(out).size} bytes)`);
