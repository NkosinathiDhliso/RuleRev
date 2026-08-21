/**
 * Counts the visual "AI-built" tells that are actually measurable from the DOM,
 * scoped to what is visible in the first viewport and across the page.
 *
 * Tells drawn from the two field guides:
 *   github.com/febbhav/signs-of-ai-design  (CC BY-SA 4.0)
 *   github.com/JCarterJohnson/vibecoded-design-tells (Reddit-mined ranking)
 *
 * Their own interpretation rule: one match is noise, ten is a signature. This
 * script reports density, not a verdict.
 *
 * Usage: node scripts/ai-tells.mjs <url>
 */
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'https://rulerev.com/omni-risk-readiness';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const r = await page.evaluate(() => {
  const all = [...document.querySelectorAll('body *')];
  const visible = (el) => {
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0 && getComputedStyle(el).display !== 'none';
  };
  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();

  const textEls = all.filter((el) => visible(el) && ownText(el).length > 0);

  const isMono = (el) => /mono|JetBrains|ui-monospace/i.test(getComputedStyle(el).fontFamily);
  const isUpper = (el) => getComputedStyle(el).textTransform === 'uppercase';
  const tracked = (el) => {
    const ls = getComputedStyle(el).letterSpacing;
    return ls !== 'normal' && parseFloat(ls) > 0.5;
  };

  const inFirstFold = (el) => el.getBoundingClientRect().top < 900;

  const monoEls = textEls.filter(isMono);
  const upperEls = textEls.filter(isUpper);
  const upperMonoTracked = textEls.filter((el) => isUpper(el) && isMono(el) && tracked(el));

  // distinct font families actually rendered
  const families = new Set(textEls.map((el) => getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '')));

  // distinct font weights actually rendered
  const weights = new Set(textEls.map((el) => getComputedStyle(el).fontWeight));

  // 1px hairline borders
  const hairlines = all.filter((el) => {
    if (!visible(el)) return false;
    const cs = getComputedStyle(el);
    return ['borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth'].some(
      (p) => cs[p] === '1px'
    );
  });

  // body text vs mono share, by rendered character count
  const chars = (els) => els.reduce((a, el) => a + ownText(el).length, 0);

  return {
    totalTextElements: textEls.length,
    monoElements: monoEls.length,
    monoCharShare: +((chars(monoEls) / Math.max(1, chars(textEls))) * 100).toFixed(1),
    uppercaseElements: upperEls.length,
    uppercaseTrackedMono: upperMonoTracked.length,
    uppercaseInFirstFold: upperEls.filter(inFirstFold).length,
    uppercaseLabelsFirstFold: upperEls.filter(inFirstFold).map((el) => ownText(el).slice(0, 28)),
    distinctFontFamilies: [...families],
    distinctFontWeights: [...weights].sort(),
    hairlineBorderElements: hairlines.length,
    pageBackground: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    // metric row: big numerals with tiny caps captions underneath
    metricRow: [...document.querySelectorAll('.fact')].map((f) => ({
      value: f.querySelector('b')?.textContent,
      label: f.querySelector('span')?.textContent,
      valueSize: getComputedStyle(f.querySelector('b')).fontSize,
      labelSize: getComputedStyle(f.querySelector('span')).fontSize,
    })),
    gradients: all.filter((el) => {
      const cs = getComputedStyle(el);
      return /gradient/.test(cs.backgroundImage);
    }).length,
    boxShadows: all.filter((el) => getComputedStyle(el).boxShadow !== 'none').length,
    borderRadiusValues: [...new Set(all.filter(visible).map((el) => getComputedStyle(el).borderRadius))],
  };
});

await browser.close();

console.log(`=== ${url} ===\n`);
console.log('--- typography density ---');
console.log(`  text-bearing elements        ${r.totalTextElements}`);
console.log(`  set in monospace             ${r.monoElements}  (${r.monoCharShare}% of rendered characters)`);
console.log(`  uppercase elements           ${r.uppercaseElements}`);
console.log(`  uppercase + mono + tracked   ${r.uppercaseTrackedMono}`);
console.log(`  uppercase in first fold      ${r.uppercaseInFirstFold}`);
console.log(`  distinct font families       ${r.distinctFontFamilies.join(', ')}`);
console.log(`  distinct font weights        ${r.distinctFontWeights.join(', ')}`);

console.log('\n--- first-fold all-caps labels ---');
for (const l of r.uppercaseLabelsFirstFold) console.log(`  "${l}"`);

console.log('\n--- surface treatment ---');
console.log(`  page background             ${r.pageBackground}`);
console.log(`  1px hairline borders        ${r.hairlineBorderElements}`);
console.log(`  gradient backgrounds        ${r.gradients}`);
console.log(`  box-shadows                 ${r.boxShadows}`);
console.log(`  border-radius values        ${r.borderRadiusValues.join(' | ')}`);

console.log('\n--- metric row ---');
for (const m of r.metricRow) console.log(`  ${String(m.value).padEnd(5)} ${m.valueSize.padEnd(6)} / ${String(m.label).padEnd(16)} ${m.labelSize}`);
