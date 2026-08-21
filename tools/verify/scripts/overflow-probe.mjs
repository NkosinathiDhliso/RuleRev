/**
 * Identifies which elements exceed the viewport at a given width.
 * Diagnostic only - not part of the acceptance gate.
 *
 * Usage: node scripts/overflow-probe.mjs <url> [width]
 */
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:8888/omni-risk-readiness';
const width = Number(process.argv[3] ?? 320);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const out = await page.evaluate((vw) => {
  const offenders = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width > vw + 0.5 || r.right > vw + 0.5) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 40),
        width: Math.round(r.width),
        right: Math.round(r.right),
        minContent: el.scrollWidth,
        text: (el.textContent || '').trim().slice(0, 45),
      });
    }
  }
  return {
    scrollWidth: document.documentElement.scrollWidth,
    offenders: offenders.slice(0, 25),
  };
}, width);

await browser.close();

console.log(`viewport ${width}px -> documentElement.scrollWidth = ${out.scrollWidth}px`);
console.log(`\nelements wider than the viewport (outermost first):`);
for (const o of out.offenders) {
  console.log(
    `  <${o.tag} class="${o.cls}"> width=${o.width} right=${o.right} scrollWidth=${o.minContent}  "${o.text}"`
  );
}
if (!out.offenders.length) console.log('  none');
