/**
 * Does the report identification data (institution, FSP number, reporting period)
 * survive anywhere? Checks storage, cookies, network, reload, history navigation,
 * back/forward cache restore, and the reset button.
 */
import { chromium } from 'playwright';

const URL = process.argv[2] ?? 'http://localhost:8888/omni-risk-readiness/index.html';
const VALUES = {
  reportInstitution: 'Sentinel Canary Institution 8471',
  reportFsp: '8471999',
  reportPeriod: 'Canary period 8471',
};
const canaries = Object.values(VALUES);

const fail = [];
const ok = [];
const check = (cond, label, detail = '') => (cond ? ok : fail).push(label + (detail ? ` (${detail})` : ''));

const browser = await chromium.launch();
const context = await browser.newContext();
const requests = [];
const posts = [];
const page = await context.newPage();
page.on('request', (r) => {
  requests.push(`${r.method()} ${r.url()}`);
  if (r.method() !== 'GET') posts.push(`${r.method()} ${r.url()}`);
  const post = r.postData();
  if (post && canaries.some((c) => post.includes(c))) posts.push(`BODY LEAK ${r.url()}`);
});

await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// --- structural: no form, no name attributes, nothing that could be submitted ---
const structure = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.report-field input')];
  return {
    count: inputs.length,
    withName: inputs.filter((i) => i.getAttribute('name')).length,
    insideForm: inputs.filter((i) => i.closest('form')).length,
    formsOnPage: document.querySelectorAll('form').length,
    autocomplete: inputs.map((i) => i.getAttribute('autocomplete')),
    types: inputs.map((i) => i.type),
  };
});
check(structure.count === 3, 'three report fields present', String(structure.count));
check(structure.formsOnPage === 0, 'page contains no <form> element', `${structure.formsOnPage} forms`);
check(structure.insideForm === 0, 'fields are not inside a form (cannot be submitted)');
check(structure.withName === 0, 'fields have no name attribute (no form-data key)');
check(
  structure.autocomplete.every((a) => a === 'off'),
  'autocomplete disabled on every field',
  structure.autocomplete.join(',')
);

// --- enter the canaries ---
await page.locator('.row').first().locator('.opt').nth(1).click();
await page.locator('#showRes').click();
await page.waitForTimeout(400);
for (const [id, value] of Object.entries(VALUES)) await page.locator(`#${id}`).fill(value);
await page.keyboard.press('Tab');
await page.waitForTimeout(800);

const readValues = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('.report-field input')].map((i) => i.value)
  );
check((await readValues()).filter(Boolean).length === 3, 'values are present in the live DOM after typing');

// --- storage + cookies ---
const stored = await page.evaluate(async () => {
  const dump = (s) => {
    const o = {};
    for (let i = 0; i < s.length; i++) o[s.key(i)] = s.getItem(s.key(i));
    return o;
  };
  let idb = [];
  try {
    if (indexedDB.databases) idb = (await indexedDB.databases()).map((d) => d.name);
  } catch {}
  let cacheKeys = [];
  try {
    if (window.caches) cacheKeys = await caches.keys();
  } catch {}
  return {
    local: JSON.stringify(dump(localStorage)),
    session: JSON.stringify(dump(sessionStorage)),
    cookie: document.cookie,
    idb,
    cacheKeys,
    sw: navigator.serviceWorker ? (await navigator.serviceWorker.getRegistrations()).length : 0,
  };
});
const cookies = await context.cookies();
const blob = [stored.local, stored.session, stored.cookie, JSON.stringify(cookies)].join(' ');
check(!canaries.some((c) => blob.includes(c)), 'entered values absent from storage and cookies');
check(stored.local === '{}', 'localStorage empty', stored.local);
check(stored.session === '{}', 'sessionStorage empty', stored.session);
check(stored.cookie === '', 'no cookies set via document.cookie');
check(cookies.length === 0, 'no cookies in the browser jar', String(cookies.length));
check(stored.idb.length === 0, 'no IndexedDB databases', stored.idb.join(','));
check(stored.cacheKeys.length === 0, 'no CacheStorage entries', stored.cacheKeys.join(','));
check(stored.sw === 0, 'no service worker registered');

// --- network ---
check(posts.length === 0, 'no non-GET request and no value in any request body', posts.join('; '));
check(
  !requests.some((r) => canaries.some((c) => decodeURIComponent(r).includes(c))),
  'entered values absent from every request URL'
);
check(requests.length <= 4, 'no unexpected extra requests', `${requests.length} requests`);

// --- reset button clears them ---
await page.locator('#resetBtn').click();
await page.waitForTimeout(500);
await page.locator('.row').first().locator('.opt').nth(1).click();
await page.locator('#showRes').click();
await page.waitForTimeout(400);
const afterReset = await readValues();
check(afterReset.every((v) => v === ''), 'Start over clears the fields', JSON.stringify(afterReset));

// --- reload: nothing restored ---
for (const [id, value] of Object.entries(VALUES)) await page.locator(`#${id}`).fill(value);
await page.waitForTimeout(300);
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.row').first().locator('.opt').nth(1).click();
await page.locator('#showRes').click();
await page.waitForTimeout(400);
const afterReload = await readValues();
check(afterReload.every((v) => v === ''), 'values do not survive a reload', JSON.stringify(afterReload));

// --- history navigation / back-forward cache ---
for (const [id, value] of Object.entries(VALUES)) await page.locator(`#${id}`).fill(value);
await page.waitForTimeout(300);
await page.goto('about:blank');
await page.goBack({ waitUntil: 'load' });
await page.waitForTimeout(700);
const afterBack = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('.report-field input')];
  return {
    values: inputs.map((i) => i.value),
    resultsVisible: document.getElementById('results')?.classList.contains('on') ?? false,
  };
});
check(
  afterBack.values.every((v) => v === ''),
  'values are not restored by back navigation',
  JSON.stringify(afterBack.values)
);

// --- final sweep of the serialized page ---
const finalHtml = await page.content();
check(!canaries.some((c) => finalHtml.includes(c)), 'values absent from the serialized DOM after navigation');

await browser.close();

console.log(`PASSED (${ok.length}):`);
for (const o of ok) console.log('  + ' + o);
if (fail.length) {
  console.log(`\nFAILED (${fail.length}):`);
  for (const f of fail) console.log('  - ' + f);
  process.exit(1);
}
console.log('\nREPORT FIELD PERSISTENCE: nothing is stored, transmitted or restored.');
