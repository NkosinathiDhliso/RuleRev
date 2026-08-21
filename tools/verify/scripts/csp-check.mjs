/**
 * Guards against CSP hash drift.
 *
 * The Omni-Risk CSP pins the inline <script> by SHA-256 instead of allowing
 * 'unsafe-inline'. That is the stronger policy, but it has a failure mode: edit
 * the HTML without updating netlify.toml and the browser silently refuses to
 * run the script, leaving a page that renders but does nothing.
 *
 * This recomputes the hash from the file on disk and fails if it does not match
 * every occurrence in netlify.toml, so drift is caught here rather than in
 * production.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const HTML = path.join(REPO, 'public', 'omni-risk-readiness', 'index.html');
const TOML = path.join(REPO, 'netlify.toml');

const html = readFileSync(HTML, 'utf8');
const toml = readFileSync(TOML, 'utf8');

const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
if (scripts.length !== 1) {
  console.error(`FAILED: expected exactly 1 inline <script>, found ${scripts.length}.`);
  console.error('The CSP pins a single script hash; more than one needs more hashes.');
  process.exit(1);
}

const expected = `'sha256-${crypto.createHash('sha256').update(scripts[0], 'utf8').digest('base64')}'`;

const cspLines = toml.split('\n').filter((l) => l.includes('Content-Security-Policy'));
const omniCsp = cspLines.filter((l) => l.includes("default-src 'none'"));

const problems = [];
if (omniCsp.length === 0) problems.push('no Omni-Risk CSP line found in netlify.toml');
for (const line of omniCsp) {
  if (!line.includes(expected)) {
    const found = line.match(/'sha256-[A-Za-z0-9+/=]+'/)?.[0] ?? '(no hash present)';
    problems.push(`hash mismatch\n      netlify.toml : ${found}\n      computed     : ${expected}`);
  }
}

// Sanity-check the directives the brief mandates.
for (const directive of [
  "connect-src 'none'",
  "form-action 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "font-src 'self'",
  "default-src 'none'",
]) {
  for (const line of omniCsp) {
    if (!line.includes(directive)) problems.push(`missing required directive: ${directive}`);
  }
}

// The script must not need 'unsafe-inline' now that it is hashed.
for (const line of omniCsp) {
  const scriptSrc = line.match(/script-src ([^;]+)/)?.[1] ?? '';
  if (scriptSrc.includes('unsafe-inline')) problems.push("script-src still allows 'unsafe-inline'");
  if (scriptSrc.includes('unsafe-eval')) problems.push("script-src allows 'unsafe-eval'");
}

console.log(`inline script    : ${scripts[0].length} chars`);
console.log(`computed hash    : ${expected}`);
console.log(`CSP lines found  : ${omniCsp.length}`);

if (problems.length) {
  console.error('\nCSP CHECK FAILED:\n - ' + problems.join('\n - '));
  process.exit(1);
}
console.log('\nCSP CHECK PASSED: hash matches every Omni-Risk CSP line; required directives present.');
