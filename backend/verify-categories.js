// Verify /categories landing + /category/:slug detail render with pictures.
const { chromium } = require('C:\\Users\\katep\\AppData\\Local\\Temp\\verify\\node_modules\\playwright');

(async () => {
  const log = (s) => console.log(`[verify] ${s}`);
  const SHOT = (n) => `C:/Users/katep/AppData/Local/Temp/verify/cats-${n}.png`;
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();

  const apiCalls = [];
  page.on('request', (r) => { if (r.url().includes('/api/')) apiCalls.push(`${r.method()} ${r.url()}`); });
  const imgFailures = [];
  page.on('response', (r) => {
    if (r.url().includes('/assets/images/thumbs/') && r.status() >= 400) imgFailures.push(`${r.status()} ${r.url()}`);
  });

  // 1. /categories landing
  log('GET /categories');
  await page.goto('http://localhost:3000/categories', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => /Shop by category/.test(document.body.innerText), { timeout: 10000 });
  // Wait for at least one image to be loaded
  await page.waitForFunction(() => {
    const imgs = Array.from(document.images);
    return imgs.some((i) => i.src.includes('/assets/images/thumbs/product-img') && i.complete && i.naturalWidth > 0);
  }, { timeout: 15000 });
  await page.screenshot({ path: SHOT('landing'), fullPage: true });

  const bodyText = await page.locator('body').innerText();
  const allCats = ['Mobile & Accessories','Laptop','Electronics','Smart Watch','Storage','Portable Devices','Action Camera','Smart Gadget','Monitor','Smart TV','Camera','Monitor Stand','Headphone'];
  const found = allCats.filter((c) => bodyText.includes(c));
  log(`categories visible: ${found.length}/${allCats.length}`);

  const imgsOk = await page.evaluate(() => {
    const imgs = Array.from(document.images).filter((i) => i.src.includes('/assets/images/thumbs/product-img'));
    return { total: imgs.length, loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length };
  });
  log(`product thumbs: ${imgsOk.loaded}/${imgsOk.total} loaded`);

  // 2. Click into "Headphone"
  log('click into Headphone category');
  await page.locator('a[href="/category/headphone"]').first().click();
  await page.waitForURL(/\/category\/headphone/, { timeout: 8000 });
  await page.waitForFunction(() => /in stock|Out of stock/.test(document.body.innerText), { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: SHOT('detail'), fullPage: true });

  const detailText = await page.locator('body').innerText();
  const expectedDetail = ['Sony WH-1000XM5', 'AirPods', 'JBL', 'Sennheiser', 'Bose'];
  const detailFound = expectedDetail.filter((n) => detailText.includes(n));
  log(`headphone products visible: ${detailFound.join(', ')}`);

  // 3. Sort change
  log('switch sort → price-asc');
  await page.locator('select.form-select').selectOption('price-asc');
  await page.waitForTimeout(800);
  const firstPriceText = await page.locator('.text-main-600').first().textContent().catch(() => '');
  log(`first card price after sort: ${firstPriceText}`);

  log('image failures:'); for (const f of imgFailures) log('  ' + f);
  log('api calls:'); for (const c of apiCalls.slice(-20)) log('  ' + c);

  await browser.close();

  if (found.length < 13 || imgsOk.loaded < 10 || detailFound.length < 4) {
    console.error('[verify] FAIL'); process.exit(2);
  }
  console.log('[verify] PASS');
})();
