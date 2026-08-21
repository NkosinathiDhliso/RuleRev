/**
 * Static audit of an Omni-Risk HTML document.
 *
 * Extracts the inline <script>, checks it parses, and reports every external
 * request, storage API, network API and CSP-relevant capability the document
 * actually uses. Run against the original artifact and again against the
 * published file to confirm nothing was introduced.
 *
 * Usage: node scripts/audit-artifact.mjs <path-to-html> [--fix-probe]
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const target = process.argv[2];
if (!target) {
  console.error('usage: node scripts/audit-artifact.mjs <path-to-html>');
  process.exit(2);
}

const html = readFileSync(target, 'utf8');
const rel = path.basename(target);

// ---- inline blocks -------------------------------------------------------
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
const scriptSrcs = [...html.matchAll(/<script\b[^>]*\ssrc=["']([^"']+)["']/gi)].map((m) => m[1]);

// ---- syntax check each inline script ------------------------------------
const dir = mkdtempSync(path.join(tmpdir(), 'omni-audit-'));
const syntax = scripts.map((s, i) => {
  const f = path.join(dir, `inline-${i}.js`);
  writeFileSync(f, s);
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
    return { index: i, chars: s.length, parses: true, error: null };
  } catch (e) {
    const msg = (e.stderr?.toString() || e.message).split('\n').slice(0, 4).join(' | ');
    return { index: i, chars: s.length, parses: false, error: msg };
  }
});

// ---- CSP hashes (only meaningful once the script parses) ----------------
const sha256 = (s) => `'sha256-${crypto.createHash('sha256').update(s, 'utf8').digest('base64')}'`;

// ---- external references ------------------------------------------------
const urls = [...html.matchAll(/https?:\/\/[^\s"'<>()]+/g)].map((m) => m[0]);
const externalHosts = [
  ...new Set(
    urls
      .map((u) => {
        try {
          return new URL(u).host;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
  ),
].sort();

// Only sub-resource loads matter for CSP/privacy, not href text or meta URLs.
const subresource = [
  ...html.matchAll(/<link\b[^>]*\shref=["'](https?:\/\/[^"']+)["']/gi),
  ...html.matchAll(/<(?:img|script|iframe|source|video|audio|embed|object)\b[^>]*(?:src|data)=["'](https?:\/\/[^"']+)["']/gi),
].map((m) => m[1]);

// ---- capability probes --------------------------------------------------
const body = scripts.join('\n');
const probe = (label, re) => ({ label, hits: (body.match(re) || []).length });
const capabilities = [
  probe('fetch(', /\bfetch\s*\(/g),
  probe('XMLHttpRequest', /XMLHttpRequest/g),
  probe('sendBeacon', /sendBeacon/g),
  probe('WebSocket', /WebSocket/g),
  probe('EventSource', /EventSource/g),
  probe('localStorage', /localStorage/g),
  probe('sessionStorage', /sessionStorage/g),
  probe('indexedDB', /indexedDB/g),
  probe('document.cookie', /document\.cookie/g),
  probe('Worker', /new\s+Worker|SharedWorker/g),
  probe('serviceWorker', /serviceWorker/g),
  probe('createObjectURL / blob:', /createObjectURL|blob:/g),
  probe('data: URL', /data:[a-z]+\//g),
  probe('window.print', /window\.print/g),
  probe('eval / new Function', /\beval\s*\(|new\s+Function\s*\(/g),
  probe('innerHTML assignment', /\.innerHTML\s*=/g),
];

const htmlProbe = (label, re) => ({ label, hits: (html.match(re) || []).length });
const markup = [
  htmlProbe('<form>', /<form\b/gi),
  htmlProbe('<img>', /<img\b/gi),
  htmlProbe('<iframe>', /<iframe\b/gi),
  htmlProbe('<base>', /<base\b/gi),
  htmlProbe('inline style="" attribute', /\sstyle=["'][^"']*["']/gi),
  htmlProbe('inline on* handler attribute', /\son(?:click|load|error|change|input|submit|focus|blur)=/gi),
  htmlProbe('download attribute', /\sdownload[=\s>]/gi),
  htmlProbe('target="_blank"', /target=["']_blank["']/gi),
  htmlProbe('@media print block', /@media\s+print/gi),
  htmlProbe('prefers-reduced-motion', /prefers-reduced-motion/gi),
  htmlProbe('aria-pressed', /aria-pressed/gi),
  htmlProbe('aria-live', /aria-live/gi),
  htmlProbe(':focus-visible', /:focus-visible/gi),
  htmlProbe('font-variation-settings', /font-variation-settings/gi),
];

// ---- css custom properties + breakpoints -------------------------------
const cssVars = [...new Set([...styles.join('\n').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]))].sort();
const breakpoints = [...new Set([...styles.join('\n').matchAll(/@media\s*\(([^)]+)\)/gi)].map((m) => m[1].trim()))];

console.log(`\n=== ${rel} ===`);
console.log(`bytes: ${Buffer.byteLength(html, 'utf8')}`);
console.log(`inline <script> blocks: ${scripts.length}   inline <style> blocks: ${styles.length}`);
console.log(`external <script src>: ${scriptSrcs.length ? scriptSrcs.join(', ') : 'none'}`);

console.log('\n--- inline script syntax ---');
for (const s of syntax) {
  console.log(`  [${s.index}] ${s.chars} chars  parses=${s.parses}`);
  if (!s.parses) console.log(`        ${s.error}`);
}

console.log('\n--- external hosts referenced anywhere in the document ---');
console.log(externalHosts.length ? '  ' + externalHosts.join('\n  ') : '  none');

console.log('\n--- actual sub-resource loads (these are what CSP + privacy care about) ---');
console.log(subresource.length ? '  ' + subresource.join('\n  ') : '  none');

console.log('\n--- script capabilities ---');
for (const c of capabilities) if (c.hits) console.log(`  ${c.label.padEnd(26)} ${c.hits}`);
const zero = capabilities.filter((c) => !c.hits).map((c) => c.label);
console.log(`  absent: ${zero.join(', ')}`);

console.log('\n--- markup / css features ---');
for (const m of markup) console.log(`  ${m.label.padEnd(32)} ${m.hits}`);

console.log('\n--- css custom properties ---');
console.log('  ' + cssVars.join(', '));

console.log('\n--- media query conditions ---');
console.log('  ' + breakpoints.join(' | '));

if (syntax.every((s) => s.parses)) {
  console.log('\n--- CSP hashes (valid because every inline script parses) ---');
  scripts.forEach((s, i) => console.log(`  script[${i}] ${sha256(s)}`));
  styles.forEach((s, i) => console.log(`  style[${i}]  ${sha256(s)}`));
} else {
  console.log('\n--- CSP hashes withheld: an inline script does not parse ---');
}
