/**
 * Functional + accessibility gate for the Omni-Risk standalone page.
 * Covers the interaction and accessibility checklists directly.
 *
 * Usage: node scripts/functional.mjs [url]
 */
import { chromium } from 'playwright';

const URL_UNDER_TEST = process.argv[2] ?? 'http://localhost:8888/omni-risk-readiness';
const EXPECTED_SECTIONS = 12;
const EXPECTED_ITEMS = 49;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const consoleErrors = [];
const cspViolations = [];
page.on('console', (m) => {
  const t = m.text();
  if (/Content Security Policy/i.test(t)) cspViolations.push(t);
  else if (m.type() === 'error') consoleErrors.push(t);
});
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e)));

await page.goto(URL_UNDER_TEST, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const fail = [];
const ok = [];
const advisory = [];
const check = (cond, label, detail = '') => (cond ? ok : fail).push(label + (detail ? ` (${detail})` : ''));

// ---- the script actually ran ----
const built = await page.evaluate(() => ({
  sections: document.querySelectorAll('.sec').length,
  rows: document.querySelectorAll('.row').length,
  opts: document.querySelectorAll('.opt').length,
  h1: document.querySelectorAll('h1').length,
  headings: [...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName),
  title: document.title,
  lang: document.documentElement.lang,
  canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
  ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
  keyLabels: [...document.querySelectorAll('.key-item b')].map((el) => el.textContent.trim()),
  tallyLabels: [...document.querySelectorAll('.tally-row span')].map((el) => el.textContent.trim()),
  optionLabels: [...document.querySelectorAll('.row .opt')].slice(0, 4).map((el) => el.textContent.trim()),
}));
check(built.sections === EXPECTED_SECTIONS, 'renders 12 sections', `got ${built.sections}`);
check(built.rows === EXPECTED_ITEMS, 'renders 49 data-point rows', `got ${built.rows}`);
check(built.opts === EXPECTED_ITEMS * 4, 'renders 4 answer controls per row', `got ${built.opts}`);
const expectedAnswerLabels = ['System', 'By hand', 'Cannot', 'N/A'];
check(
  JSON.stringify(built.keyLabels) === JSON.stringify(expectedAnswerLabels) &&
    JSON.stringify(built.tallyLabels) === JSON.stringify(expectedAnswerLabels) &&
    JSON.stringify(built.optionLabels) === JSON.stringify(expectedAnswerLabels),
  'key, tally and controls use the approved short labels',
  `${built.keyLabels.join(' / ')} | ${built.tallyLabels.join(' / ')} | ${built.optionLabels.join(' / ')}`
);
check(built.h1 === 1, 'exactly one h1', `got ${built.h1}`);
check(built.title === 'Omni-Risk Return: Data Readiness Check', 'title is the specified value', built.title);
check(built.lang === 'en-ZA', 'lang attribute preserved', built.lang);
check(
  built.canonical === 'https://rulerev.com/omni-risk-readiness',
  'canonical points at the clean URL',
  built.canonical
);
check(
  built.ogImage === 'https://rulerev.com/assets/omni-risk/preview-v2.png',
  'og:image is the versioned absolute URL',
  built.ogImage
);

// no heading level is skipped
let prev = 1;
let skips = 0;
for (const t of built.headings) {
  const lvl = Number(t[1]);
  if (lvl > prev + 1) skips++;
  prev = lvl;
}
check(skips === 0, 'no skipped heading levels', `${skips} skip(s)`);

// ---- masthead wording + nav ----
const masthead = await page.evaluate(() => ({
  privacy: document.querySelector('.privacy')?.textContent?.trim() ?? null,
  privacyVisible: !!document.querySelector('.privacy')?.offsetParent,
  markHref: document.querySelector('.mark')?.getAttribute('href') ?? null,
  mastLinks: [...document.querySelectorAll('.mast-link')].map((a) => a.getAttribute('href')),
  coloLinks: [...document.querySelectorAll('.colo-links a')].map((a) => a.getAttribute('href')),
  blankTargets: document.querySelectorAll('a[target="_blank"]').length,
}));
check(
  masthead.privacy === 'Your answers are processed in this browser · nothing is submitted or stored',
  'masthead privacy wording is the approved sentence',
  masthead.privacy
);
check(masthead.privacyVisible, 'privacy line visible at 1440px');
check(masthead.markHref === 'https://rulerev.com/', '.mark links to the site root', masthead.markHref);
check(masthead.mastLinks.length === 3, 'three masthead sibling links', masthead.mastLinks.join(' '));
check(masthead.coloLinks.length === 4, 'colophon link row present', masthead.coloLinks.join(' '));
check(masthead.blankTargets === 0, 'no target="_blank"');
check(
  [...masthead.mastLinks, ...masthead.coloLinks].every((h) => h.startsWith('https://rulerev.com/')),
  'all site links are absolute rulerev.com URLs'
);

// ---- fonts resolved to the self-hosted files ----
const fonts = await page.evaluate(() =>
  [...document.fonts].map((f) => ({ family: f.family, status: f.status }))
);
check(
  fonts.some((f) => f.family === 'Archivo' && f.status === 'loaded'),
  'Archivo loaded'
);
check(
  fonts.some((f) => f.family === 'JetBrains Mono' && f.status === 'loaded'),
  'JetBrains Mono loaded'
);
const usedFallback = await page.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.hero h1'));
  return cs.fontFamily;
});
check(usedFallback.includes('Archivo'), 'headline resolves to Archivo', usedFallback);

// ---- all four states selectable, and clicking an active state clears it ----
const firstRow = page.locator('.row').first();
const firstOpts = firstRow.locator('.opt');
for (const [i, cls] of [
  [0, 's-system'],
  [1, 's-manual'],
  [2, 's-gap'],
  [3, 's-na'],
]) {
  await firstOpts.nth(i).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(220);
  const visualState = await firstRow.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { background: cs.backgroundColor, opacity: cs.opacity, borderWidth: cs.borderLeftWidth };
  });
  check(
    ['rgb(247, 248, 248)', 'rgb(239, 241, 241)'].includes(visualState.background) && visualState.opacity === '1',
    `${cls} keeps the neutral row ground at full opacity`,
    JSON.stringify(visualState)
  );
  check(
    visualState.borderWidth === ['1px', '2px', '3px', '1px'][i],
    `${cls} uses the documented rule weight`,
    visualState.borderWidth
  );
  // WCAG 1.4.11: the pressed indicator is a graphical state marker, so it needs
  // 3:1 against whatever sits next to it. The light state greys used on the row
  // hairlines are deliberately NOT reused here, because they measured 1.19:1.
  const indicator = await firstOpts.nth(i).evaluate((el) => {
    const cs = getComputedStyle(el);
    const rgb = (v) => (v.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const lin = (c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4));
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const ratio = (a, b) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    const ground = rgb(getComputedStyle(el.closest('.opts')).backgroundColor);
    const marker =
      cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
        ? rgb(cs.outlineColor)
        : rgb(cs.backgroundColor)[0] !== undefined && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
          ? rgb(cs.backgroundColor)
          : rgb(cs.borderBottomColor);
    return { ratio: ratio(marker, ground), text: ratio(rgb(cs.color), rgb(cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : getComputedStyle(el.closest('.opts')).backgroundColor)) };
  });
  check(
    indicator.ratio >= 3,
    `${cls} pressed indicator meets 3:1 non-text contrast`,
    `${indicator.ratio.toFixed(2)}:1`
  );
  check(
    indicator.text >= 4.5,
    `${cls} pressed label meets 4.5:1 text contrast`,
    `${indicator.text.toFixed(2)}:1`
  );

  const state = await firstRow.evaluate((el) => el.className);
  check(state.includes(cls), `state ${cls} selectable`, state);
  const pressed = await firstOpts.nth(i).getAttribute('aria-pressed');
  check(pressed === 'true', `aria-pressed exposed for ${cls}`);
  const others = await firstOpts.evaluateAll((els, idx) =>
    els.filter((_, j) => j !== idx).every((e) => e.getAttribute('aria-pressed') === 'false'),
  i);
  check(others, `only ${cls} is active`);
}
// clicking the active state again clears it
await firstOpts.nth(3).click();
const cleared = await firstRow.evaluate((el) => el.className.trim());
check(cleared === 'row', 'clicking the active state clears it', cleared);

// ---- section counters increment and decrement ----
const counterAfterOne = async () =>
  (await page.locator('.sec-count').first().textContent())?.trim();
await firstOpts.nth(0).click();
check((await counterAfterOne()) === '1/3', 'section counter increments', await counterAfterOne());
await firstOpts.nth(0).click();
check((await counterAfterOne()) === '0/3', 'section counter decrements on clear', await counterAfterOne());

// ---- complete a section -> documented completion state ----
const sec0 = page.locator('.sec').first();
const sec0rows = sec0.locator('.row');
const n0 = await sec0rows.count();
for (let i = 0; i < n0; i++) await sec0rows.nth(i).locator('.opt').nth(0).click();
const doneClass = await page.locator('.sec-count').first().evaluate((el) => el.className);
check(doneClass.includes('done'), 'completed section gets the done state', doneClass);

// ---- tally + bar ----
const tally = await page.evaluate(() => ({
  system: document.getElementById('cSystem').textContent,
  note: document.getElementById('railNote').textContent,
  barWidth: document.getElementById('barSystem').style.width,
}));
check(tally.system === String(n0), 'tally counts match', `${tally.system} vs ${n0}`);
check(/of 49 answered/.test(tally.note), 'progress note updates', tally.note);
check(tally.barWidth !== '0' && tally.barWidth !== '', 'bar width updates', tally.barWidth);

// ---- flagged items + results ----
// mark two rows as manual/gap so the flag list must render
const r2 = page.locator('.row').nth(3);
await r2.locator('.opt').nth(1).click();
const r3 = page.locator('.row').nth(4);
await r3.locator('.opt').nth(2).click();

await page.locator('#showRes').click();
await page.waitForTimeout(600);
const results = await page.evaluate(() => ({
  visible: document.getElementById('results').classList.contains('on'),
  verdict: document.getElementById('verdict').textContent,
  decl: document.getElementById('declText').textContent,
  flags: document.querySelectorAll('.flag').length,
  flagGroups: document.querySelectorAll('.flag-section').length,
  flagHeadings: [...document.querySelectorAll('.flag-section h4')].map((h) => h.textContent.trim()),
  findingsHeading: document.querySelector('.flags h3')?.textContent?.trim(),
  flagBadges: [...document.querySelectorAll('.flag u')].map((u) => u.textContent),
  reportFields: [...document.querySelectorAll('.report-field input')].map((input) => ({
    id: input.id,
    type: input.type,
    autocomplete: input.autocomplete,
    height: Math.round(input.getBoundingClientRect().height),
    labelled: input.closest('label') !== null,
  })),
  date: document.getElementById('resDate').textContent,
}));
check(results.visible, 'See the declaration reveals the results block');
check(results.flags === 2, 'flagged items listed correctly', `${results.flags} flag rows`);
check(results.flagGroups === 1, 'flagged items are grouped by assessment section', results.flagHeadings.join(' / '));
check(results.findingsHeading === 'Readiness findings', 'findings use the board-pack heading', results.findingsHeading);
check(
  results.reportFields.length === 3 &&
    results.reportFields.every((field) => field.type === 'text' && field.autocomplete === 'off'),
  'report identification fields are local text inputs with autocomplete disabled',
  JSON.stringify(results.reportFields.map((f) => f.id))
);
check(
  results.reportFields.every((field) => field.height >= 44),
  'report identification fields meet the 44px touch target',
  results.reportFields.map((f) => `${f.id} ${f.height}px`).join(' / ')
);
check(
  results.reportFields.every((field) => field.labelled),
  'report identification fields have a programmatic label'
);
check(
  results.flagBadges.includes('By hand') && results.flagBadges.includes('Cannot'),
  'flag badges carry a text label, not colour alone',
  results.flagBadges.join(' / ')
);
check(/apply to you/.test(results.verdict), 'verdict renders', results.verdict.slice(0, 80));
check(!/all\.\d/.test(results.verdict), 'verdict has no run-on sentence defect', results.verdict.slice(-60));
check(results.decl.length > 0 && !/undefined/.test(results.decl), 'declaration text renders');
check(results.date.length > 0, 'result date renders', results.date);

// ---- results stay correct after changing an answer ----
await r2.locator('.opt').nth(0).click(); // manual -> system
await page.locator('#showRes').click();
await page.waitForTimeout(400);
const after = await page.evaluate(() => document.querySelectorAll('.flag').length);
check(after === 1, 'results recomputed after an answer change', `${after} flag row(s)`);

// ---- print path ----
await page.emulateMedia({ media: 'print' });
await page.waitForTimeout(300);
const print = await page.evaluate(() => {
  const vis = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).display !== 'none' : null;
  };
  return {
    masthead: vis('.masthead'),
    hero: vis('.hero'),
    questionnaire: vis('.body-grid'),
    results: vis('.results'),
    coloLinks: vis('.colo-links'),
    signatureColumns: getComputedStyle(document.querySelector('.sigline')).gridTemplateColumns.split(' ').length,
    identificationColumns: getComputedStyle(document.querySelector('.report-ident')).gridTemplateColumns.split(' ').length,
    ligatures: getComputedStyle(document.querySelector('.results')).fontVariantLigatures,
    pagedCss: [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).map((rule) => rule.cssText).join(' '),
  };
});
await page.emulateMedia({ media: 'screen' });
check(print.masthead === false, 'print hides the masthead');
check(print.hero === false, 'print hides the hero');
check(print.questionnaire === false, 'print hides the questionnaire');
check(print.results === true, 'print shows the results');
check(print.coloLinks === false, 'print hides the nav link row');
check(print.signatureColumns === 3, 'print keeps the signature strip in three columns', `${print.signatureColumns} columns`);
check(print.identificationColumns === 3, 'print keeps report identification in three columns', `${print.identificationColumns} columns`);
check(print.ligatures === 'none', 'print disables ligatures', print.ligatures);
check(
  print.pagedCss.includes('counter(page)') && print.pagedCss.includes('counter(pages)') && print.pagedCss.includes('@top-left'),
  'print defines running document furniture and page numbering'
);

// ---- keyboard operability + visible focus ----
await page.keyboard.press('Tab');
const firstFocus = await page.evaluate(() => document.activeElement?.className || document.activeElement?.tagName);
check(!!firstFocus, 'tab moves focus into the page', String(firstFocus));

const focusRing = await page.evaluate(() => {
  const b = document.querySelector('.opt');
  b.focus();
  const cs = getComputedStyle(b);
  return { outlineWidth: cs.outlineWidth, outlineStyle: cs.outlineStyle, outlineColor: cs.outlineColor };
});
check(
  focusRing.outlineStyle !== 'none' && parseFloat(focusRing.outlineWidth) > 0,
  'answer controls show a visible focus ring',
  JSON.stringify(focusRing)
);

const names = await page.evaluate(() => {
  const groups = [...document.querySelectorAll('.opts')];
  return {
    groupsWithLabel: groups.filter((g) => g.getAttribute('aria-label')).length,
    totalGroups: groups.length,
    optsWithText: [...document.querySelectorAll('.opt')].filter((b) => b.textContent.trim()).length,
    liveRegion: document.getElementById('results')?.getAttribute('aria-live'),
  };
});
check(names.groupsWithLabel === names.totalGroups, 'every answer group has an accessible name');
check(names.optsWithText === EXPECTED_ITEMS * 4, 'every control has a text accessible name');
check(names.liveRegion === 'polite', 'results are announced via aria-live', String(names.liveRegion));

// ---- reduced motion ----
await page.emulateMedia({ reducedMotion: 'reduce' });
const rm = await page.evaluate(() => getComputedStyle(document.querySelector('.row')).transitionDuration);
await page.emulateMedia({ reducedMotion: 'no-preference' });
check(rm === '0s', 'prefers-reduced-motion disables transitions', rm);

// ---- 375px: no horizontal overflow, sticky rail usable ----
await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(400);
const narrow = await page.evaluate(() => {
  const rail = document.querySelector('.rail');
  const rb = rail.getBoundingClientRect();
  return {
    scrollWidth: document.documentElement.scrollWidth,
    railSticky: getComputedStyle(rail).position,
    railHeight: Math.round(rb.height),
    privacyVisible: !!document.querySelector('.privacy')?.offsetParent,
  };
});
check(narrow.scrollWidth <= 376, 'no horizontal overflow at 375px', `${narrow.scrollWidth}px`);
check(narrow.railSticky === 'sticky', 'tally bar stays sticky at 375px', narrow.railSticky);
check(narrow.railHeight < 220, 'sticky bar does not dominate the viewport', `${narrow.railHeight}px`);
check(narrow.privacyVisible === false, 'privacy line hidden below 920px as specified');

// controls still clickable under the sticky bar at 375px
const midRow = page.locator('.row').nth(20);
await midRow.scrollIntoViewIfNeeded();
await midRow.locator('.opt').nth(1).click();
const midState = await midRow.evaluate((el) => el.className);
check(midState.includes('s-manual'), 'controls remain clickable under the sticky bar', midState);

// ---- browser zoom ----
// Real browser zoom shrinks the CSS viewport; it does not scale layout inside a
// fixed viewport. So 200% zoom at 1440px is emulated as a 720px CSS viewport,
// and WCAG 1.4.10 reflow (400% at 1280px) as a 320px CSS viewport.
await page.setViewportSize({ width: 720, height: 900 });
await page.waitForTimeout(350);
const zoom200 = await page.evaluate(() => document.documentElement.scrollWidth);
check(zoom200 <= 721, 'no horizontal overflow at 200% zoom (720px CSS viewport)', `${zoom200}px`);

// Now a gated check rather than an advisory. This used to fail at 374px because
// `.opt { white-space: nowrap }` gave the answer-control row a 317px min-content
// width. Letting the labels wrap (part of the mono/caps reduction) closed it, so
// WCAG 1.4.10 reflow is now enforced instead of merely reported.
await page.setViewportSize({ width: 320, height: 900 });
await page.waitForTimeout(350);
const reflow320 = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  tallyWidths: [...document.querySelectorAll('.tally-row')].map((row) => row.getBoundingClientRect().width),
  optionHeights: [...document.querySelectorAll('.opt')].slice(0, 4).map((opt) => opt.getBoundingClientRect().height),
}));
check(
  reflow320.scrollWidth <= 321,
  'no horizontal overflow at 320px (WCAG 1.4.10 reflow)',
  `${reflow320.scrollWidth}px`
);
check(
  Math.max(...reflow320.tallyWidths) - Math.min(...reflow320.tallyWidths) <= 1,
  'mobile tally uses four equal columns at 320px',
  reflow320.tallyWidths.map((w) => w.toFixed(1)).join(' / ')
);
check(
  reflow320.optionHeights.every((height) => height >= 44),
  'answer controls retain 44px touch targets at 320px',
  reflow320.optionHeights.map((h) => h.toFixed(1)).join(' / ')
);
await page.setViewportSize({ width: 1440, height: 1000 });

await browser.close();

console.log(`\nPASSED (${ok.length}):`);
for (const o of ok) console.log('  + ' + o);
if (advisory.length) {
  console.log(`\nADVISORY (${advisory.length}) — reported, not gated:`);
  for (const a of advisory) console.log('  ~ ' + a);
}
console.log(`\nCSP violations: ${cspViolations.length}`);
for (const v of cspViolations) console.log('  ! ' + v);
console.log(`Console errors: ${consoleErrors.length}`);
for (const e of consoleErrors) console.log('  ! ' + e);

if (cspViolations.length) fail.push(`${cspViolations.length} CSP violation(s)`);
if (consoleErrors.length) fail.push(`${consoleErrors.length} console error(s)`);

if (fail.length) {
  console.error(`\nFAILED (${fail.length}):`);
  for (const f of fail) console.error('  - ' + f);
  process.exit(1);
}
console.log('\nALL FUNCTIONAL + ACCESSIBILITY CHECKS PASSED');
