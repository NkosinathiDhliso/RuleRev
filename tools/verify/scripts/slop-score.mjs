/**
 * Scores a page against the published design-slop taxonomy so an overhaul can be
 * measured rather than argued about.
 *
 * Sources (content paraphrased, not reproduced):
 *   github.com/febbhav/signs-of-ai-design        - field guide + design-rules.md (CC BY-SA 4.0)
 *   github.com/sovit79/human-craft               - design-slop taxonomy, D-A..D-H, S1/S2/S3
 *   github.com/JCarterJohnson/vibecoded-design-tells - Reddit-mined ranking
 *
 * Banding from the taxonomy: 5+ patterns = heavy, 2-4 = mild, 0-1 = clean.
 * S1 = a single hit can out the page. S2 = matters in clusters. S3 = only if piled up.
 *
 * Every check reports EVIDENCE, and several deliberately distinguish sanctioned
 * uses from reflexive ones (e.g. a coloured left border is a tell on an ordinary
 * card, but is the correct treatment for semantic state).
 *
 * Usage: node scripts/slop-score.mjs <url> [--json]
 */
import { chromium } from 'playwright';

const url = process.argv[2];
if (!url) {
  console.error('usage: node scripts/slop-score.mjs <url>');
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const data = await page.evaluate(() => {
  const vis = (el) => {
    const b = el.getBoundingClientRect();
    return b.width > 0 && b.height > 0 && getComputedStyle(el).display !== 'none';
  };
  const all = [...document.querySelectorAll('body *')].filter(vis);
  const ownText = (el) =>
    [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
  const textEls = all.filter((el) => ownText(el).length > 0);
  const cs = (el) => getComputedStyle(el);

  const parseRGB = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const isPurpleish = (s) => {
    const [r, g, b] = parseRGB(s);
    if ([r, g, b].some((v) => Number.isNaN(v))) return false;
    return b > 120 && b - g > 30 && r > 60 && r < 200 && b >= r;
  };
  const warmCream = (s) => {
    const [r, g, b] = parseRGB(s);
    if ([r, g, b].some((v) => Number.isNaN(v))) return false;
    return r > 215 && g > 215 && b > 200 && Math.abs(r - b) <= 40 && !(r === 255 && g === 255 && b === 255);
  };

  // left-border colour strips, split by whether the element looks semantic
  const leftBorders = all
    .filter((el) => {
      const c = cs(el);
      const w = parseFloat(c.borderLeftWidth) || 0;
      if (w < 2) return false;
      const lc = c.borderLeftColor;
      return lc !== 'rgba(0, 0, 0, 0)' && lc !== 'transparent' && lc !== c.borderTopColor;
    })
    .map((el) => ({
      cls: (el.className || '').toString().slice(0, 40),
      width: cs(el).borderLeftWidth,
      color: cs(el).borderLeftColor,
      // Semantic (and therefore sanctioned) if the element encodes state, or if
      // it is a blockquote. A left rule on a quotation is a long-standing
      // typographic convention, not an AI tell: the taxonomy scopes this
      // pattern to ordinary *cards*.
      semantic:
        el.tagName === 'BLOCKQUOTE' ||
        /alert|warn|error|success|state|verdict|empty|s-(system|manual|gap|na)|flag|quote/i.test(
          (el.className || '').toString()
        ) ||
        !!el.getAttribute('role'),
    }));

  const mono = textEls.filter((el) => /mono|JetBrains|ui-monospace|Courier|Menlo|Consolas/i.test(cs(el).fontFamily));
  const upper = textEls.filter((el) => cs(el).textTransform === 'uppercase');
  const trackedUpper = upper.filter((el) => {
    const ls = cs(el).letterSpacing;
    return ls !== 'normal' && parseFloat(ls) > 0.5;
  });

  const chars = (els) => els.reduce((a, el) => a + ownText(el).length, 0);
  const totalChars = Math.max(1, chars(textEls));

  const families = [...new Set(textEls.map((el) => cs(el).fontFamily.split(',')[0].replace(/["']/g, '').trim()))];
  const weights = [...new Set(textEls.map((el) => cs(el).fontWeight))].sort();
  const sizes = [...new Set(textEls.map((el) => Math.round(parseFloat(cs(el).fontSize))))].sort((a, b) => a - b);

  const gradientEls = all.filter((el) => /gradient/.test(cs(el).backgroundImage));
  const gradientText = all.filter((el) => {
    const c = cs(el);
    return /gradient/.test(c.backgroundImage) && (c.webkitBackgroundClip === 'text' || c.backgroundClip === 'text');
  });
  const shadowEls = all.filter((el) => cs(el).boxShadow !== 'none');
  const glowShadows = shadowEls.filter((el) => {
    const s = cs(el).boxShadow;
    return /rgb/.test(s) && !/rgba?\(0, 0, 0/.test(s);
  });
  const hairline = all.filter((el) =>
    ['borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth'].some(
      (p) => cs(el)[p] === '1px'
    )
  );
  const bothEdgeTreatments = hairline.filter((el) => cs(el).boxShadow !== 'none');
  const radii = [...new Set(all.map((el) => cs(el).borderRadius))].filter((r) => r && r !== '0px');

  const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
  const emojiIcons = textEls.filter((el) => emojiRe.test(ownText(el)));

  const buzz = /\b(seamless|robust|cutting-edge|future-ready|best-in-class|unlock|unleash|empower|supercharge|streamline|world-class|enterprise-grade|elevate your)\b/i;
  const bodyText = document.body.innerText;
  const buzzHits = (bodyText.match(new RegExp(buzz.source, 'gi')) || []).map((m) => m.toLowerCase());
  const emDashes = (bodyText.match(/\u2014/g) || []).length;
  const notJustX = (bodyText.match(/not just .{1,40}?,? (it'?s|but) /gi) || []).length;

  // canonical hero: centered eyebrow + oversized headline + two CTAs
  const h1 = document.querySelector('h1');
  const heroCentered = h1 ? cs(h1).textAlign === 'center' : null;
  const h1Size = h1 ? Math.round(parseFloat(cs(h1).fontSize)) : null;
  // An eyebrow is a chip/label sitting immediately above the page headline.
  // Matching any element whose class merely contains "pill" or "badge" also
  // catches things like a pill-shaped nav bar, which is a different pattern and
  // not what this check is about. Scope it to what precedes the h1.
  const eyebrow = (() => {
    if (!h1) return false;
    const candidates = [...document.querySelectorAll('[class*=eyebrow],[class*=badge],[class*=chip],[class*=pill]')];
    return candidates.some((el) => {
      if (!vis(el) || el.contains(h1)) return false;
      const pos = el.compareDocumentPosition(h1);
      const precedesH1 = !!(pos & Node.DOCUMENT_POSITION_FOLLOWING);
      if (!precedesH1) return false;
      const gap = h1.getBoundingClientRect().top - el.getBoundingClientRect().bottom;
      return gap >= -8 && gap < 120;
    });
  })();

  // three-equal-cards
  const cardRows = all
    .filter((el) => cs(el).display === 'grid' || cs(el).display === 'flex')
    .map((el) => [...el.children].filter(vis))
    .filter((kids) => kids.length === 3)
    .filter((kids) => {
      const ws = kids.map((k) => Math.round(k.getBoundingClientRect().width));
      return ws.length === 3 && Math.max(...ws) - Math.min(...ws) <= 2 && ws[0] > 120;
    }).length;

  // invented metrics
  const inventedMetrics = (bodyText.match(/\b(\d{1,3}(?:,\d{3})*\+|\d+(?:\.\d+)?[x×]|99\.\d+%)\s/gi) || []);

  return {
    background: cs(document.body).backgroundColor,
    purpleish: all.filter((el) => isPurpleish(cs(el).backgroundColor) || isPurpleish(cs(el).color)).length,
    creamBackground: warmCream(cs(document.body).backgroundColor),
    gradientCount: gradientEls.length,
    gradientTextCount: gradientText.length,
    shadowCount: shadowEls.length,
    glowShadowCount: glowShadows.length,
    hairlineCount: hairline.length,
    bothEdgeTreatments: bothEdgeTreatments.length,
    radii,
    leftBorders,
    textElements: textEls.length,
    monoElements: mono.length,
    monoCharShare: +((chars(mono) / totalChars) * 100).toFixed(1),
    upperCount: upper.length,
    trackedUpperCount: trackedUpper.length,
    families,
    weights,
    sizeSteps: sizes.length,
    emojiIcons: emojiIcons.length,
    buzzHits,
    emDashes,
    notJustX,
    distinctInkColours: [...new Set(textEls.map((el) => cs(el).color))].length,
    accentCharShare: +(
      (chars(textEls.filter((el) => /31,\s*61,\s*92/.test(cs(el).color))) / totalChars) *
      100
    ).toFixed(1),
    heroCentered,
    h1Size,
    eyebrow,
    threeEqualCardRows: cardRows,
    inventedMetrics,
  };
});
await browser.close();

const findings = [];
const add = (id, severity, note, evidence, fix) => findings.push({ id, severity, note, evidence, fix });

// ---- D-A colour ----
if (data.purpleish > 6)
  add('D-A', 'S1', 'indigo/violet reflex present', `${data.purpleish} elements in the purple band`, 'commit to a brand palette');
if (data.creamBackground)
  add('D-A', 'S2', 'cream/beige second-wave default', `body background ${data.background}`, 'cream is now a default too; pick a ground on purpose');
if (data.gradientTextCount > 0)
  add('D-A', 'S2', 'gradient fill on text as decoration', `${data.gradientTextCount} element(s) with background-clip:text`, 'solid colour; keep gradients out of type');
// D-A is a COLOUR item in the taxonomy: several muted colours at equal weight
// with no dominant hue. An earlier version of this script used font-family count
// as a proxy, which was wrong on two counts: it measured the wrong thing, and it
// penalised a deliberate two-family system (which is what our own spec
// prescribes). Measure the colour spread instead.
if (data.distinctInkColours >= 5 && data.accentCharShare < 1)
  add(
    'D-A',
    'S2',
    'timid palette: several tones at equal weight, no dominant colour',
    `${data.distinctInkColours} distinct text colours, accent carries ${data.accentCharShare}% of characters`,
    'one dominant colour plus a sharp accent'
  );

// D-D flat hierarchy: genuinely one weight and no size ramp, not merely a small
// deliberate scale.
if (data.weights.length <= 1 || data.sizeSteps <= 3)
  add(
    'D-D',
    'S2',
    'flat type hierarchy',
    `${data.weights.length} weight(s), ${data.sizeSteps} size step(s)`,
    'build a real scale with clear steps and weight contrast'
  );

// ---- D-B layout ----
if (data.heroCentered && data.h1Size && data.h1Size >= 56 && data.eyebrow)
  add('D-B', 'S1', 'canonical AI hero shape', `centered h1 at ${data.h1Size}px beneath an eyebrow/badge`, 'break symmetry; left-align or vary');
else if (data.eyebrow)
  add('D-B', 'S3', 'eyebrow/chip label above headline', 'eyebrow element present', 'keep only if it carries real information');
if (data.threeEqualCardRows > 0)
  add('D-B', 'S2', 'three equal cards', `${data.threeEqualCardRows} row(s) of exactly 3 equal-width children`, 'let the content decide the count');

// ---- D-C components/surfaces ----
const decorativeLeft = data.leftBorders.filter((b) => !b.semantic);
const semanticLeft = data.leftBorders.filter((b) => b.semantic);
if (decorativeLeft.length > 0)
  add('D-C', 'S1', 'coloured left-border strip on ordinary cards', `${decorativeLeft.length} non-semantic: ${decorativeLeft.slice(0, 4).map((b) => b.cls).join(', ')}`, 'reserve that treatment for semantic state');
if (data.bothEdgeTreatments > 3)
  add('D-C', 'S2', 'hairline border and shadow on the same elements', `${data.bothEdgeTreatments} elements with both`, 'commit to one edge treatment');
if (data.radii.length === 1)
  add('D-C', 'S2', 'one uniform border radius everywhere', `only ${data.radii[0]}`, 'vary radius by element meaning');
if (data.glowShadowCount > 2)
  add('D-C', 'S2', 'coloured glow shadows', `${data.glowShadowCount} elements`, 'drop the glow unless the product is dark-developer');

// ---- D-D typography ----
if (data.monoCharShare > 15 || data.monoElements / Math.max(1, data.textElements) > 0.4)
  add('D-D', 'S2', 'monospace used as decoration, not for data', `${data.monoElements}/${data.textElements} elements, ${data.monoCharShare}% of characters`, 'mono for codes and figures only');
if (data.trackedUpperCount > 12)
  add('D-D', 'S2', 'tracked-out all-caps labels sprayed widely', `${data.trackedUpperCount} uppercase + letter-spaced elements`, 'pick a case convention and apply it with intent');
if (data.families.length === 1)
  add('D-D', 'S1', 'single typeface, unchosen', data.families.join(', '), 'pair a display face with a text face on purpose');
if (data.families.some((f) => /^(Inter|Geist|Space Grotesk)$/i.test(f)))
  add('D-D', 'S2', 'default-tier typeface', data.families.filter((f) => /^(Inter|Geist|Space Grotesk)$/i.test(f)).join(', '), 'fine if chosen; make it a decision');
if (data.families.some((f) => /Instrument Serif/i.test(f)))
  add('D-D', 'S2', 'Instrument Serif, the current display reflex', 'Instrument Serif in use', 'keep only if the register is genuinely editorial');

// ---- D-E icons ----
if (data.emojiIcons > 0)
  add('D-E', 'S1', 'emoji used as icons', `${data.emojiIcons} element(s)`, 'use a real icon set or none');

// ---- D-G copy ----
if (data.buzzHits.length > 0)
  add('D-G', 'S2', 'buzzword layer', [...new Set(data.buzzHits)].join(', '), 'replace with concrete claims');
if (data.emDashes > 3)
  add('D-G', 'S2', 'em-dash density', `${data.emDashes} on the rendered page`, 'density is the tell, not the character');
if (data.notJustX > 0)
  add('D-G', 'S2', '"not just X, it\'s Y" construction', `${data.notJustX} occurrence(s)`, 'rewrite the pivot');
if (data.inventedMetrics.length > 0)
  add('D-G', 'S3', 'unsourced precision figures', data.inventedMetrics.slice(0, 5).join(' '), 'cite or cut');

const s1 = findings.filter((f) => f.severity === 'S1');
const score = findings.length;
const band = score >= 5 ? 'heavy' : score >= 2 ? 'mild' : 'clean';

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ url, findings, slop_score: score, s1_count: s1.length, band }, null, 2));
} else {
  console.log(`=== ${url} ===\n`);
  for (const f of findings) {
    console.log(`[${f.severity}] ${f.id}  ${f.note}`);
    console.log(`        evidence : ${f.evidence}`);
    console.log(`        fix      : ${f.fix}`);
  }
  if (!findings.length) console.log('  no patterns flagged');
  console.log(`\nslop_score ${score}   S1 hits ${s1.length}   band: ${band.toUpperCase()}`);
  console.log('(taxonomy banding: 5+ heavy, 2-4 mild, 0-1 clean)');
  if (semanticLeft.length) {
    console.log(
      `\nnote: ${semanticLeft.length} coloured left-border element(s) judged SEMANTIC and not counted ` +
        `(${semanticLeft.slice(0, 5).map((b) => b.cls).join(', ')}). That is the sanctioned use of the treatment.`
    );
  }
}
