// One-shot Playwright verifier for the search flow.
const { chromium } = require('C:\\Users\\katep\\AppData\\Local\\Temp\\verify\\node_modules\\playwright');

(async () => {
  const log = (s) => console.log(`[verify] ${s}`);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();

  const apiCalls = [];
  page.on('request', (req) => {
    if (req.url().includes('/api/')) apiCalls.push({ url: req.url(), method: req.method() });
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[browser-error]', msg.text());
  });

  log('navigating to home');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.screenshot({ path: 'C:/Users/katep/AppData/Local/Temp/verify/shot-1-home.png', fullPage: false });

  // Header search input — find the visible (desktop) one in the location form.
  log('locating header search input');
  const inputs = await page.locator('input.search-form__input').all();
  log(`found ${inputs.length} search-form inputs`);
  let used = null;
  for (const i of inputs) {
    if (await i.isVisible()) { used = i; break; }
  }
  if (!used) {
    // Fallback: click search icon to open overlay
    log('no visible inline input — opening overlay');
    const trigger = page.locator('.search-icon').first();
    await trigger.click();
    await page.waitForTimeout(400);
    used = page.locator('.search-box.active input').first();
  }

  log('typing query');
  await used.fill('wireless headphones under 300');
  await page.screenshot({ path: 'C:/Users/katep/AppData/Local/Temp/verify/shot-2-typed.png' });

  log('submitting via Enter');
  await used.press('Enter');

  log('waiting for /search route + results');
  await page.waitForURL(/\/search\?q=/, { timeout: 8000 });
  // Wait for the agent response or fallback message.
  await page.waitForFunction(
    () => /Agent:|No products matched|Backend error/.test(document.body.innerText),
    { timeout: 15000 },
  );

  const url = page.url();
  const text = await page.locator('body').innerText();
  log(`URL: ${url}`);
  await page.screenshot({ path: 'C:/Users/katep/AppData/Local/Temp/verify/shot-3-results.png', fullPage: true });

  const expected = ['AirPods', 'Sennheiser', 'JBL'];
  const found = expected.filter((n) => text.includes(n));
  log(`expected hits found: ${found.join(', ') || '(none)'}`);

  log('API calls captured:');
  for (const c of apiCalls) log(`  ${c.method} ${c.url}`);

  await browser.close();

  // Print short excerpt of page text
  const excerpt = text.split('\n').filter(Boolean).slice(0, 30).join('\n');
  console.log('\n[verify] --- page text excerpt ---');
  console.log(excerpt);
  console.log('[verify] --- end excerpt ---');

  if (found.length === 0) {
    console.error('[verify] FAIL: none of expected products rendered');
    process.exit(2);
  }
  console.log(`[verify] PASS: rendered ${found.length}/${expected.length} expected products`);
})();
