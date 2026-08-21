/**
 * Generates public/assets/omni-risk/preview-v1.png
 *
 * Rendered with Playwright/Chromium rather than satori so that the Archivo
 * variable *width* axis is honoured. satori does not instance the `wdth` axis,
 * which would silently produce a normal-width headline instead of width 88.
 *
 * The font is inlined as a base64 data URL, so this script makes no network
 * request and uses byte-for-byte the same WOFF2 file the published page serves.
 *
 * Palette and content are fixed by spec:
 *   background #E6EBE3 | ink #141C17 | accent #1F3D5C
 *   headline + one horizontal rule + "12 sections · 49 data points"
 *   no imagery, gradients, icons, illustrations or logos.
 */
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const FONT_DIR = path.join(REPO, 'public', 'assets', 'omni-risk', 'fonts');
const OUT = path.join(REPO, 'public', 'assets', 'omni-risk', 'preview-v1.png');

const WIDTH = 1200;
const HEIGHT = 630;

const BG = '#E6EBE3';
const INK = '#141C17';
const ACCENT = '#1F3D5C';

const HEADLINE = 'Omni-Risk Return: Data Readiness Check';
const META = '12 sections \u00B7 49 data points';

const ARCHIVO = 'archivo-var-latin-e3a28ead.woff2';
const MONO = 'jetbrainsmono-var-latin-83c005d4.woff2';

async function dataUrl(file) {
  const buf = await readFile(path.join(FONT_DIR, file));
  return `data:font/woff2;base64,${buf.toString('base64')}`;
}

const html = (archivo, mono) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Archivo';
    font-style: normal;
    font-weight: 400 800;
    font-stretch: 62% 125%;
    font-display: block;
    src: url(${archivo}) format('woff2');
  }
  @font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400 700;
    font-display: block;
    src: url(${mono}) format('woff2');
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    background: ${BG};
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 88px;
    -webkit-font-smoothing: antialiased;
  }
  #headline {
    font-family: 'Archivo';
    font-stretch: 88%;
    font-weight: 700;
    font-size: 92px;
    line-height: 1.04;
    letter-spacing: -0.021em;
    color: ${INK};
    max-width: 1000px;
  }
  #rule {
    height: 3px;
    background: ${ACCENT};
    margin: 44px 0 32px;
    width: 148px;
  }
  #meta {
    font-family: 'JetBrains Mono';
    font-weight: 500;
    font-size: 27px;
    letter-spacing: 0.005em;
    color: ${ACCENT};
  }
</style></head>
<body>
  <h1 id="headline">${HEADLINE}</h1>
  <hr id="rule">
  <p id="meta">${META}</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

const failures = [];
page.on('requestfailed', (r) => failures.push(r.url()));
page.on('request', (r) => {
  if (!r.url().startsWith('data:') && r.url() !== 'about:blank') {
    failures.push(`unexpected network request: ${r.url()}`);
  }
});

await page.setContent(html(await dataUrl(ARCHIVO), await dataUrl(MONO)), {
  waitUntil: 'load',
});
await page.evaluate(() => document.fonts.ready);

// Prove the intended fonts and axes actually applied, and that nothing clips.
const audit = await page.evaluate(() => {
  const el = (id) => document.getElementById(id);
  const box = (id) => {
    const r = el(id).getBoundingClientRect();
    return { top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), right: +r.right.toFixed(2) };
  };
  const cs = getComputedStyle(el('headline'));
  return {
    headlineFamily: cs.fontFamily,
    headlineStretch: cs.fontStretch,
    headlineWeight: cs.fontWeight,
    metaFamily: getComputedStyle(el('meta')).fontFamily,
    headline: box('headline'),
    meta: box('meta'),
    docScrollW: document.documentElement.scrollWidth,
    docScrollH: document.documentElement.scrollHeight,
    headlineClipped: el('headline').scrollWidth > el('headline').clientWidth,
  };
});

const problems = [];
if (audit.docScrollW > WIDTH) problems.push(`horizontal overflow: ${audit.docScrollW}px > ${WIDTH}px`);
if (audit.docScrollH > HEIGHT) problems.push(`vertical overflow: ${audit.docScrollH}px > ${HEIGHT}px`);
if (audit.headlineClipped) problems.push('headline text is clipped');
if (audit.headline.top < 0) problems.push(`headline clipped at top (${audit.headline.top}px)`);
if (audit.meta.bottom > HEIGHT) problems.push(`meta line past bottom edge (${audit.meta.bottom}px)`);
if (!audit.headlineFamily.includes('Archivo')) problems.push('headline is not using Archivo');
if (audit.headlineStretch !== '88%') problems.push(`wdth axis not applied: ${audit.headlineStretch}`);
if (failures.length) problems.push(`network activity: ${failures.join(', ')}`);

await mkdir(path.dirname(OUT), { recursive: true });
const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
await writeFile(OUT, png);
await browser.close();

// Validate the emitted file from its bytes, not from our intent.
const bytes = await readFile(OUT);
const sig = bytes.subarray(0, 8).toString('hex');
const w = bytes.readUInt32BE(16);
const h = bytes.readUInt32BE(20);

console.log('--- render audit ---');
console.log(audit);
console.log('--- file audit ---');
console.log({
  path: path.relative(REPO, OUT),
  bytes: bytes.length,
  pngSignature: sig === '89504e470d0a1a0a' ? 'valid' : `INVALID (${sig})`,
  ihdrWidth: w,
  ihdrHeight: h,
  dimensionsExact: w === WIDTH && h === HEIGHT,
});

if (problems.length) {
  console.error('\nFAILED:\n - ' + problems.join('\n - '));
  process.exit(1);
}
if (!(w === WIDTH && h === HEIGHT && sig === '89504e470d0a1a0a')) {
  console.error('\nFAILED: emitted PNG is not a valid 1200x630 PNG');
  process.exit(1);
}
console.log('\nOK: preview-v1.png is a valid 1200x630 PNG, no clipping, no network requests.');
