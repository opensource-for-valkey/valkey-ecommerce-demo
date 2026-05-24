// Semantic search service.
//
// Query path:
//   1. Embed the query string with the same model used at seed time.
//   2. Pull all product vectors from Valkey (cached in-memory after first call).
//   3. Compute cosine similarity (vectors are L2-normalized at embed time, so
//      a plain dot product == cosine similarity).
//   4. Take top K, join with SQLite for the rest of the product data, return
//      shaped results that match the rest of the API.
//
// Cache invalidation: we re-pull from Valkey whenever the meta `count` or
// `builtAt` changes, so re-running `npm run seed:embeddings` refreshes the
// in-memory map without restarting the server.

const { db } = require("../db");
const { serializeProduct } = require("../lib/serializers");
const embeddings = require("../lib/embeddings");
const vectorStore = require("../lib/vectorStore");

let cache = null; // { meta, vectors: Map<productId, Float32Array> }

function dot(a, b) {
    let sum = 0;
    const len = a.length;
    for (let i = 0; i < len; i++) sum += a[i] * b[i];
    return sum;
}

async function ensureCache() {
    const meta = await vectorStore.getMeta();
    if (!meta) {
        return null; // index not built yet
    }
    if (cache && cache.meta.builtAt === meta.builtAt && cache.meta.count === meta.count) {
        return cache;
    }
    const vectors = await vectorStore.loadAllVectors(meta.dim);
    cache = { meta, vectors };
    return cache;
}

function clearCache() {
    cache = null;
}

function loadProducts(ids) {
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(",");
    const rows = db
        .prepare(`SELECT * FROM products WHERE id IN (${placeholders})`)
        .all(...ids);
    return rows.map(serializeProduct);
}

// Optional filters on top of similarity ranking. Same shape as the agent's
// other tools (categoryId, minPrice, maxPrice, status="active").
function passesFilters(product, filters) {
    if (!filters) return true;
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (filters.minPrice != null && (product.price?.amount ?? 0) < filters.minPrice) return false;
    if (filters.maxPrice != null && (product.price?.amount ?? 0) > filters.maxPrice) return false;
    if (filters.minScore != null) return true; // applied after scoring
    return true;
}

// Returns: { query, model, total, results: [{ ...product, score }] }
async function search(query, { k = 6, filters, minScore } = {}) {
    const cached = await ensureCache();
    if (!cached) {
        return {
            query,
            model: null,
            total: 0,
            results: [],
            warning: "Vector index empty. Run `npm run seed:embeddings` to build it.",
        };
    }

    const { meta, vectors } = cached;
    if (vectors.size === 0) {
        return { query, model: meta.model, total: 0, results: [] };
    }

    const queryVec = await embeddings.embed(query);
    if (queryVec.length !== meta.dim) {
        throw new Error(
            `embedding dim mismatch: query=${queryVec.length}, index=${meta.dim}. Re-run seed:embeddings.`
        );
    }

    // Score every vector. With ~30 products this is ~12k float ops — irrelevant.
    const scored = [];
    for (const [productId, vec] of vectors) {
        scored.push({ productId, score: dot(queryVec, vec) });
    }
    scored.sort((a, b) => b.score - a.score);

    // Pull more than k before filtering so post-filter we still hit k results.
    const candidatePool = Math.min(scored.length, Math.max(k * 4, 16));
    const candidateIds = scored.slice(0, candidatePool).map((s) => s.productId);
    const products = loadProducts(candidateIds);
    const productById = Object.fromEntries(products.map((p) => [p.id, p]));
    const scoreById = Object.fromEntries(scored.map((s) => [s.productId, s.score]));

    const results = [];
    for (const id of candidateIds) {
        const product = productById[id];
        if (!product) continue;
        if (product.status !== "active") continue;
        if (minScore != null && scoreById[id] < minScore) continue;
        if (!passesFilters(product, filters)) continue;
        results.push({ ...product, score: scoreById[id] });
        if (results.length >= k) break;
    }

    return {
        query,
        model: meta.model,
        builtAt: meta.builtAt,
        total: results.length,
        results,
    };
}

module.exports = { search, clearCache };
