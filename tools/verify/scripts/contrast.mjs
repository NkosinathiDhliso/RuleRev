/**
 * Measures WCAG contrast for the Omni-Risk colour tokens.
 *
 * Reads the tokens out of the published HTML rather than hardcoding hex values,
 * because a check with the palette baked into it silently goes stale the moment
 * the palette changes (which is exactly what happened to the first version).
 *
 * Gate: every foreground token must clear 4.5:1 against every ground it is used
 * on. Exits non-zero on failure.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const HTML = path.join(REPO, 'public', 'omni-risk-readiness', 'index.html');

const html = readFileSync(HTML, 'utf8');
const token = (name) => {
  const m = html.match(new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{6})`));
  return m ? m[1].toUpperCase() : null;
};

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
const r2 = (n) => n.toFixed(2);

const grounds = ['paper', 'card', 'card-2'].map((n) => ({ name: n, hex: token(n) })).filter((g) => g.hex);

// Foreground tokens, each against the grounds where it carries readable text.
// State greys are structural rules only and are intentionally excluded. The
// filled Cannot control uses white on the accent, which is checked explicitly.
const foregrounds = [
  { name: 'ink', on: grounds },
  { name: 'ink-2', on: grounds },
  { name: 'ink-3', on: grounds },
  { name: 'accent', on: grounds },
  { name: 'white', hex: '#FFFFFF', on: [{ name: 'accent', hex: token('accent') }] },
];

const AA = 4.5;
const failures = [];

console.log('grounds: ' + grounds.map((g) => `--${g.name} ${g.hex}`).join('   '));
console.log(`\nAA for normal-size text is ${AA}:1\n`);

for (const fg of foregrounds) {
  const fgHex = fg.hex ?? token(fg.name);
  if (!fgHex) continue;
  const results = fg.on
    .filter((g) => g.hex)
    .map((g) => ({ g: g.name, v: ratio(fgHex, g.hex) }));
  const worst = Math.min(...results.map((x) => x.v));
  const pass = worst >= AA;
  if (!pass) failures.push(`--${fg.name} ${fgHex} worst ${r2(worst)}:1`);
  console.log(
    `  --${fg.name.padEnd(8)} ${fgHex}  ` +
      results.map((x) => `${x.g} ${r2(x.v)}:1`).join('  ') +
      `   worst ${r2(worst)}:1  ${pass ? 'PASS' : 'FAIL'}`
  );
}

if (failures.length) {
  console.error('\nCONTRAST CHECK FAILED:\n - ' + failures.join('\n - '));
  process.exit(1);
}
console.log('\nCONTRAST CHECK PASSED: every token clears AA on every ground it is used on.');
