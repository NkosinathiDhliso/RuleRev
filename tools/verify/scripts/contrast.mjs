/**
 * Measures WCAG contrast for the artifact's --ink-3 token against both
 * background tokens it is used on, and finds the nearest darker value that
 * reaches AA (4.5:1) for normal-size text on the worse of the two.
 *
 * Diagnostic only. Nothing is changed: --ink-3 is a design token and the brief
 * forbids changing design tokens.
 */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const lum = (h) => {
  const [r, g, b] = hex(h);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const PAPER = '#E6EBE3';
const CARD = '#F6F8F4';
const INK3 = '#75816F';
const INK2 = '#4A564D';
const ACCENT = '#1F3D5C';

const r2 = (n) => n.toFixed(2);

console.log('backgrounds the token sits on:');
console.log(`  --paper ${PAPER}   --card ${CARD}\n`);

console.log('current and in-palette alternatives (AA normal text needs 4.5:1):');
for (const [name, c] of [
  ['--ink-3 (current)', INK3],
  ['--ink-2', INK2],
  ['--accent', ACCENT],
]) {
  const onPaper = ratio(c, PAPER);
  const onCard = ratio(c, CARD);
  const worst = Math.min(onPaper, onCard);
  console.log(
    `  ${name.padEnd(20)} ${c}  on --paper ${r2(onPaper)}:1  on --card ${r2(onCard)}:1  worst ${r2(worst)}:1  ${
      worst >= 4.5 ? 'PASS' : 'FAIL'
    }`
  );
}

// Walk the current hue darker until AA is met on the worse background.
const [r0, g0, b0] = hex(INK3);
let suggestion = null;
for (let step = 0; step <= 60; step++) {
  const c =
    '#' +
    [r0 - step, g0 - step, b0 - step]
      .map((v) => Math.max(0, v).toString(16).padStart(2, '0'))
      .join('');
  if (Math.min(ratio(c, PAPER), ratio(c, CARD)) >= 4.5) {
    suggestion = { c, step, onPaper: ratio(c, PAPER), onCard: ratio(c, CARD) };
    break;
  }
}

console.log('\nnearest darker value on the same hue that reaches AA:');
if (suggestion) {
  console.log(
    `  ${suggestion.c}  (each channel -${suggestion.step})  on --paper ${r2(suggestion.onPaper)}:1  on --card ${r2(
      suggestion.onCard
    )}:1`
  );
} else {
  console.log('  none within 60 steps');
}

console.log('\nNOTE: not applied. --ink-3 is a design token and Phase 4 forbids changing tokens.');
