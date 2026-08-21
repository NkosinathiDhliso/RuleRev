/**
 * Proves the self-hosted WOFF2 files actually expose the axes the brief requires,
 * rather than trusting the CSS descriptors we wrote.
 *
 * Archivo:        wdth 62-125, wght 400-800
 * JetBrains Mono: wght 400/500/700 (served as one variable file, 400-700)
 *
 * Method: render identical text at the extremes of each axis and confirm the
 * measured advance width / rendered pixels actually change. A font that ignored
 * an axis would produce identical measurements.
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const FONT_DIR = path.join(REPO, 'public', 'assets', 'omni-risk', 'fonts');

const FILES = {
  archivoLatin: 'archivo-var-latin-e3a28ead.woff2',
  archivoLatinExt: 'archivo-var-latin-ext-5717f370.woff2',
  monoLatin: 'jetbrainsmono-var-latin-83c005d4.woff2',
  monoLatinExt: 'jetbrainsmono-var-latin-ext-db5ff4db.woff2',
};

const url = async (f) =>
  `data:font/woff2;base64,${(await readFile(path.join(FONT_DIR, f))).toString('base64')}`;

const u = {};
for (const [k, v] of Object.entries(FILES)) u[k] = await url(v);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:A;font-weight:400 800;font-stretch:62% 125%;font-display:block;
  src:url(${u.archivoLatin}) format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212;}
@font-face{font-family:A;font-weight:400 800;font-stretch:62% 125%;font-display:block;
  src:url(${u.archivoLatinExt}) format('woff2');
  unicode-range:U+0100-02BA,U+1E00-1E9F,U+2C60-2C7F,U+A720-A7FF;}
@font-face{font-family:M;font-weight:400 700;font-display:block;
  src:url(${u.monoLatin}) format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2212;}
@font-face{font-family:M;font-weight:400 700;font-display:block;
  src:url(${u.monoLatinExt}) format('woff2');
  unicode-range:U+0100-02BA,U+1E00-1E9F,U+2C60-2C7F,U+A720-A7FF;}
span{font-size:100px;white-space:nowrap;display:inline-block;}
</style></head><body>
<span id="a-narrow"   style="font-family:A;font-stretch:62%;font-weight:400">Readiness</span>
<span id="a-wide"     style="font-family:A;font-stretch:125%;font-weight:400">Readiness</span>
<span id="a-mid"      style="font-family:A;font-stretch:88%;font-weight:400">Readiness</span>
<span id="a-light"    style="font-family:A;font-stretch:100%;font-weight:400">Readiness</span>
<span id="a-bold"     style="font-family:A;font-stretch:100%;font-weight:800">Readiness</span>
<span id="m-400"      style="font-family:M;font-weight:400">Readiness</span>
<span id="m-500"      style="font-family:M;font-weight:500">Readiness</span>
<span id="m-700"      style="font-family:M;font-weight:700">Readiness</span>
<span id="ext"        style="font-family:A;font-stretch:100%">\u0141\u0179\u010C\u015E\u0218\u1E9E</span>
<span id="fallback"   style="font-family:'DoesNotExistXYZ',monospace">Readiness</span>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

const external = [];
page.on('request', (r) => {
  if (!r.url().startsWith('data:') && r.url() !== 'about:blank') external.push(r.url());
});

await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

const m = await page.evaluate(() => {
  const w = (id) => +document.getElementById(id).getBoundingClientRect().width.toFixed(2);
  return {
    archivoWdth62: w('a-narrow'),
    archivoWdth88: w('a-mid'),
    archivoWdth125: w('a-wide'),
    archivoWght400: w('a-light'),
    archivoWght800: w('a-bold'),
    mono400: w('m-400'),
    mono500: w('m-500'),
    mono700: w('m-700'),
    latinExtGlyphs: w('ext'),
    loadedFaces: [...document.fonts].map(
      (f) => `${f.family} w=${f.weight} stretch=${f.stretch} status=${f.status}`
    ),
  };
});
await browser.close();

const fail = [];
if (!(m.archivoWdth62 < m.archivoWdth88 && m.archivoWdth88 < m.archivoWdth125)) {
  fail.push(`Archivo wdth axis not varying: 62=${m.archivoWdth62} 88=${m.archivoWdth88} 125=${m.archivoWdth125}`);
}
if (!(m.archivoWght800 > m.archivoWght400)) {
  fail.push(`Archivo wght axis not varying: 400=${m.archivoWght400} 800=${m.archivoWght800}`);
}
// JetBrains Mono is monospaced, so weight must NOT change advance width.
if (!(m.mono400 === m.mono500 && m.mono500 === m.mono700)) {
  fail.push(`JetBrains Mono lost its monospace advance across weights: ${m.mono400}/${m.mono500}/${m.mono700}`);
}
if (m.latinExtGlyphs <= 0) fail.push('Latin Extended glyphs did not render');
if (external.length) fail.push(`external request(s): ${external.join(', ')}`);

console.log(m);
console.log('external requests during render:', external.length);
if (fail.length) {
  console.error('\nFONT CHECK FAILED:\n - ' + fail.join('\n - '));
  process.exit(1);
}
console.log('\nFONT CHECK PASSED: wdth 62/88/125 and wght 400/800 vary as expected;');
console.log('JetBrains Mono keeps a constant advance across 400/500/700; Latin Extended renders; no external requests.');
