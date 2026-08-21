/**
 * Evidence generator for the Omni-Risk standalone page privacy claim:
 *   "Your answers are processed in this browser - nothing is submitted or stored"
 *
 * Drives the page in a real browser with a cold cache, exercises every control,
 * generates the results block, and records what actually left the browser and
 * what was written to client-side storage.
 *
 * Emits ./evidence/privacy-audit.json and ./evidence/network.har so the result
 * can be attached to a stakeholder or compliance request. Exits non-zero on any
 * violation, so this is a gate and not just a report.
 *
 * Usage: node scripts/privacy-audit.mjs [url]
 *   default url: http://localhost:8888/omni-risk-readiness
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const URL_UNDER_TEST = process.argv[2] ?? 'http://localhost:8888/omni-risk-readiness';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const EVIDENCE = path.join(HERE, '..', 'evidence');
await mkdir(EVIDENCE, { recursive: true });

const origin = new URL(URL_UNDER_TEST).origin;

const requests = [];
const thirdParty = [];
const beacons = [];
const sockets = [];
const cspViolations = [];
const consoleErrors = [];
let mainHeaders = {};

const browser = await chromium.launch();
const context = await browser.newContext({
  recordHar: { path: path.join(EVIDENCE, 'network.har'), content: 'omit' },
  bypassCSP: false,
});

// Cold cache: no service worker, no HTTP cache reuse.
await context.route('**/*', (route) => route.continue());

const page = await context.newPage();

page.on('request', (r) => {
  const entry = { method: r.method(), url: r.url(), type: r.resourceType() };
  requests.push(entry);
  const sameOrigin = r.url().startsWith(origin) || r.url().startsWith('data:') || r.url().startsWith('blob:');
  if (!sameOrigin) thirdParty.push(entry);
  if (r.resourceType() === 'ping' || r.method() === 'POST') beacons.push(entry);
});
page.on('websocket', (ws) => sockets.push(ws.url()));
page.on('console', (m) => {
  const t = m.text();
  if (/Content Security Policy/i.test(t)) cspViolations.push(t);
  else if (m.type() === 'error') consoleErrors.push(t);
});
page.on('pageerror', (e) => consoleErrors.push(String(e)));

const response = await page.goto(URL_UNDER_TEST, { waitUntil: 'networkidle' });
mainHeaders = response ? response.headers() : {};

// --- Exercise the tool: click every answer control, then generate results. ---
const controls = page.locator(
  'button, [role="radio"], [role="button"], input[type="radio"], input[type="checkbox"]'
);
const total = await controls.count();
let clicked = 0;
for (let i = 0; i < total; i++) {
  const c = controls.nth(i);
  try {
    if (await c.isVisible()) {
      await c.click({ timeout: 1500 });
      clicked++;
    }
  } catch {
    /* non-interactive or overlapped; not a privacy concern */
  }
}
await page.waitForTimeout(750);

// --- Exercise the report identification fields with realistic entity data. ---
// These are free-text inputs, so they are the highest-risk surface for the
// "nothing is submitted or stored" claim. The generic control loop above does
// not type into text inputs, so they are driven explicitly here.
const metadata = {
  reportInstitution: 'Privacy Audit Financial Services',
  reportFsp: '999999',
  reportPeriod: '1 January to 31 March 2026',
};
let metadataFilled = 0;
try {
  await page.locator('.row').first().locator('.opt').nth(1).click({ timeout: 1500 });
  await page.locator('#showRes').click({ timeout: 1500 });
  await page.waitForTimeout(400);
  for (const [id, value] of Object.entries(metadata)) {
    await page.locator(`#${id}`).fill(value, { timeout: 1500 });
    metadataFilled++;
  }
  await page.keyboard.press('Tab');
  await page.waitForTimeout(750);
} catch {
  /* recorded below as a shortfall rather than silently ignored */
}

// Print path exercises @media print and any results rendering tied to it.
await page.emulateMedia({ media: 'print' });
await page.waitForTimeout(250);
await page.emulateMedia({ media: 'screen' });
await page.waitForTimeout(500);

// --- What did the page persist? ---
const storage = await page.evaluate(async () => {
  const dump = (s) => {
    const o = {};
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      o[k] = s.getItem(k);
    }
    return o;
  };
  let idb = [];
  try {
    if (indexedDB.databases) idb = (await indexedDB.databases()).map((d) => d.name);
  } catch {
    idb = ['<enumeration unavailable>'];
  }
  return {
    localStorage: dump(window.localStorage),
    sessionStorage: dump(window.sessionStorage),
    documentCookie: document.cookie,
    indexedDBDatabases: idb,
    serviceWorkers: navigator.serviceWorker
      ? (await navigator.serviceWorker.getRegistrations()).map((r) => r.scope)
      : [],
  };
});
const cookies = await context.cookies();

// --- Confirm the app shell is genuinely absent. ---
const html = await page.content();
const shell = {
  nextRootMarker: html.includes('__next') || html.includes('__NEXT_DATA__'),
  nextRscPayload: html.includes('self.__next_f'),
  tailwindPreflight: /--tw-|tailwind/i.test(html),
  siteHeaderClass: /Header_/.test(html),
  siteFooterClass: /Footer_/.test(html),
  gtmOrGa: /googletagmanager|google-analytics|gtag\(/.test(html),
  consentBanner: /Cookie consent|rulerev:consent/.test(html),
};

const report = {
  urlUnderTest: URL_UNDER_TEST,
  capturedAt: new Date().toISOString(),
  httpStatus: response?.status() ?? null,
  responseHeaders: {
    'content-type': mainHeaders['content-type'],
    'cache-control': mainHeaders['cache-control'],
    'content-security-policy': mainHeaders['content-security-policy'],
    'x-frame-options': mainHeaders['x-frame-options'],
    'referrer-policy': mainHeaders['referrer-policy'],
    'x-content-type-options': mainHeaders['x-content-type-options'],
  },
  interaction: {
    controlsFound: total,
    controlsClicked: clicked,
    reportFieldsFilled: metadataFilled,
    reportFieldValuesEntered: Object.values(metadata),
  },
  network: {
    totalRequests: requests.length,
    requests: requests.map((r) => `${r.method} ${r.url}`),
    thirdPartyRequests: thirdParty,
    postsOrBeacons: beacons,
    webSockets: sockets,
  },
  storage,
  playwrightCookies: cookies,
  appShellLeakage: shell,
  cspViolations,
  consoleErrors,
};

await writeFile(path.join(EVIDENCE, 'privacy-audit.json'), JSON.stringify(report, null, 2));
await context.close();
await browser.close();

const fail = [];
if (thirdParty.length) fail.push(`third-party requests: ${thirdParty.map((t) => t.url).join(', ')}`);
if (beacons.length) fail.push(`outbound POST/beacon: ${beacons.map((b) => b.url).join(', ')}`);
if (sockets.length) fail.push(`websocket: ${sockets.join(', ')}`);
if (Object.keys(storage.localStorage).length) fail.push('localStorage was written');
if (Object.keys(storage.sessionStorage).length) fail.push('sessionStorage was written');
if (storage.documentCookie) fail.push(`document.cookie set: ${storage.documentCookie}`);
if (cookies.length) fail.push(`cookies set: ${cookies.map((c) => c.name).join(', ')}`);
if (storage.indexedDBDatabases.length) fail.push(`indexedDB: ${storage.indexedDBDatabases.join(', ')}`);
if (storage.serviceWorkers.length) fail.push(`service worker: ${storage.serviceWorkers.join(', ')}`);
if (cspViolations.length) fail.push(`CSP violations: ${cspViolations.length}`);
for (const [k, v] of Object.entries(shell)) if (v) fail.push(`app shell leakage: ${k}`);
// A pass is only meaningful if the free-text fields were actually populated.
if (metadataFilled !== Object.keys(metadata).length)
  fail.push(`report identification fields not exercised: ${metadataFilled}/${Object.keys(metadata).length} filled`);
// The entered values must not appear in any request URL.
const leakedValues = Object.values(metadata).filter((v) =>
  requests.some((r) => decodeURIComponent(r.url).includes(v))
);
if (leakedValues.length) fail.push(`entered values appeared in a request URL: ${leakedValues.join(', ')}`);

console.log(JSON.stringify(report, null, 2));
if (fail.length) {
  console.error('\nPRIVACY AUDIT FAILED:\n - ' + fail.join('\n - '));
  process.exit(1);
}
console.log(
  `\nPRIVACY AUDIT PASSED: ${requests.length} request(s), all same-origin; ` +
    `no cookies, no storage writes, no beacons, no sockets, no app-shell leakage.`
);
