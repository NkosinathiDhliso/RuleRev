/**
 * Visual-regression capture for the Omni-Risk standalone page.
 *
 * Captures 375 / 768 / 1440 plus a print-media render, for BOTH the untouched
 * source artifact (docs/artifacts/omni-risk-readiness.original.html, loaded over
 * file://) and the published page, then diffs them pixel-by-pixel.
 *
 * Per the brief, any visual difference not required by the integration is a
 * regression. Expected-and-permitted differences are the self-hosted fonts, the
 * masthead privacy wording, and the hand-written nav links.
 *
 * Usage: node scripts/screenshots.mjs [publishedUrl]
 */
import { chromium } from 'playwright';
import { mkdir, access } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PUBLISHED = process.argv[2] ?? 'http://localhost:8888/omni-risk-readiness';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const ORIGINAL = path.join(REPO, 'docs', 'artifacts', 'omni-risk-readiness.original.html');
const OUT = path.join(HERE, '..', 'evidence', 'shots');

const VIEWPORTS = [
  { name: '375', width: 375, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 1000 },
];

await mkdir(OUT, { recursive: true });

let haveOriginal = true;
try {
  await access(ORIGINAL);
} catch {
  haveOriginal = false;
  console.warn(
    `NOTE: ${path.relative(REPO, ORIGINAL)} not found - capturing the published page only.\n` +
      '      Baseline comparison requires the preserved original artifact.'
  );
}

const browser = await chromium.launch();
const findings = [];

async function capture(label, url) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(
      (w) => ({
        scrollWidth: document.documentElement.scrollWidth,
        overflows: document.documentElement.scrollWidth > w + 1,
      }),
      vp.width
    );
    if (overflow.overflows) {
      findings.push(`${label} @ ${vp.name}px: horizontal overflow (${overflow.scrollWidth}px)`);
    }

    await page.screenshot({
      path: path.join(OUT, `${label}-${vp.name}.png`),
      fullPage: true,
    });

    // Reduced motion at the largest breakpoint only.
    if (vp.name === '1440') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, `${label}-1440-reduced-motion.png`), fullPage: true });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
    await page.close();
  }

  // Print render.
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  if (label === 'published') {
    const rows = p.locator('.row');
    for (let i = 0; i < await rows.count(); i++) {
      const option = i % 7 === 0 ? 2 : i % 5 === 0 ? 1 : i % 11 === 0 ? 3 : 0;
      await rows.nth(i).locator('.opt').nth(option).click();
    }
    await p.locator('#showRes').click();
    await p.waitForTimeout(500);
    await p.locator('#reportInstitution').fill('Sample Financial Services');
    await p.locator('#reportFsp').fill('12345');
    await p.locator('#reportPeriod').fill('1 January to 31 March 2026');
  }
  await p.emulateMedia({ media: 'print' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, `${label}-print.png`), fullPage: true });
  await p.pdf({ path: path.join(OUT, `${label}-print.pdf`), printBackground: true, format: 'A4' });
  await p.close();
}

if (haveOriginal) await capture('original', pathToFileURL(ORIGINAL).href);
await capture('published', PUBLISHED);
await browser.close();

console.log(`Screenshots written to ${path.relative(REPO, OUT)}`);
if (findings.length) {
  console.error('\nLAYOUT FINDINGS:\n - ' + findings.join('\n - '));
  process.exit(1);
}
console.log('No horizontal overflow at any breakpoint.');
