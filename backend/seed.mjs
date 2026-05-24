/**
 * One-time seeding script:
 *   1. Loads product catalog from products.json
 *   2. Embeds each product image with CLIP
 *   3. Stores hashes + vectors in Valkey
 *   4. Creates the vector index if missing
 *
 * Run with:  npm run seed
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { embedImage, vectorToBuffer, warmup } from "./lib/embed.mjs";
import { ensureIndex, upsertProduct, disconnect } from "./lib/valkey.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("[seed] warming up CLIP model (first run downloads ~150MB)...");
  await warmup();

  console.log("[seed] ensuring vector index...");
  const { created } = await ensureIndex();
  console.log(`[seed] index ${created ? "created" : "already exists"}`);

  const raw = await fs.readFile(path.join(__dirname, "products.json"), "utf8");
  const products = JSON.parse(raw);

  for (const p of products) {
    process.stdout.write(`[seed] embedding ${p.id} (${p.name})... `);
    try {
      const vec = await embedImage(p.image);
      await upsertProduct(p, vectorToBuffer(vec));
      console.log("ok");
    } catch (err) {
      console.log(`failed: ${err.message}`);
    }
  }

  console.log(`[seed] done. ${products.length} products indexed.`);
  await disconnect();
}

main().catch((err) => {
  console.error("[seed] fatal:", err);
  process.exit(1);
});
