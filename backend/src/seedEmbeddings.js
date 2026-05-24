// One-shot script to (re)build the Valkey vector index from the SQLite
// catalog. Each product's "embedding source text" is name + brand + tags +
// shortDescription + description — enough signal for semantic similarity
// without overweighting a single field.
//
// Run with: npm run seed:embeddings

require("dotenv").config();

const { db } = require("./db");
const { safeJson } = require("./lib/serializers");
const valkey = require("./lib/valkey");
const embeddings = require("./lib/embeddings");
const vectorStore = require("./lib/vectorStore");

function buildSourceText(row) {
    const tags = safeJson(row.tags, []).join(" ");
    return [
        row.name,
        row.brand,
        tags,
        row.short_description,
        row.description,
    ]
        .filter(Boolean)
        .join(". ");
}

async function main() {
    console.log("[seed:embeddings] starting…");
    await valkey.connect();
    const ready = await valkey.isReady();
    if (!ready) {
        console.error(
            `[seed:embeddings] Valkey not reachable at ${valkey.VALKEY_URL}. Start it and re-run.`
        );
        process.exit(1);
    }

    const rows = db
        .prepare("SELECT * FROM products WHERE status = 'active'")
        .all();
    if (rows.length === 0) {
        console.error("[seed:embeddings] No products found. Run `npm run seed` first.");
        process.exit(1);
    }
    console.log(`[seed:embeddings] embedding ${rows.length} products with ${embeddings.MODEL_ID}`);

    const t0 = Date.now();
    const entries = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const text = buildSourceText(row);
        // eslint-disable-next-line no-await-in-loop
        const vec = await embeddings.embed(text);
        entries.push([row.id, vec]);
        if ((i + 1) % 5 === 0 || i === rows.length - 1) {
            process.stdout.write(`  ${i + 1}/${rows.length}\r`);
        }
    }
    process.stdout.write("\n");

    await vectorStore.clearAll();
    await vectorStore.putVectors(entries);
    await vectorStore.setMeta({
        model: embeddings.MODEL_ID,
        dim: embeddings.DIM,
        count: entries.length,
    });

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(
        `[seed:embeddings] done — ${entries.length} vectors stored in Valkey ` +
        `(key=embeddings:vectors, dim=${embeddings.DIM}, ${elapsed}s)`
    );
    process.exit(0);
}

main().catch((err) => {
    console.error("[seed:embeddings] failed:", err);
    process.exit(1);
});
