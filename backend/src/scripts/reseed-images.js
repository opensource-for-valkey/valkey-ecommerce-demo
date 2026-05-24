// Re-resolve every product's imagery, ignoring cache. Use after editing
// product-images.js or after the catalog grew.
//
//   npm run reseed:images

const { client, jsonSet, jsonGet } = require('../valkey/client');
const keys = require('../valkey/keys');
const imageService = require('../services/image.service');

async function reseedImages() {
  const ids = await client.smembers(keys.productIndex);
  if (!ids.length) {
    console.log('[reseed:images] no products indexed — run `npm run seed` first');
    process.exit(0);
  }

  let updated = 0;
  for (const pid of ids) {
    const idShort = pid.replace('product:', '');
    const p = await jsonGet(keys.product(idShort));
    if (!p) continue;

    await imageService.invalidate(pid);
    const img = await imageService.resolve(p, { force: true });
    if (img && img.main) {
      p.image = img.main;
      p.images = [img.main, ...img.gallery];
      await jsonSet(keys.product(idShort), p);
      updated++;
      console.log(`[reseed:images] ${pid} ← ${img.source} ${img.main.slice(0, 80)}`);
    }
  }

  console.log(`[reseed:images] done, ${updated}/${ids.length} updated`);
  await client.quit();
}

reseedImages().catch((e) => {
  console.error('[reseed:images] failed:', e);
  process.exit(1);
});
