// Vector store backed by Valkey.
//
// Storage layout — matches HACKATHON.md naming conventions:
//   embeddings:vectors   HASH    field = productId, value = base64(Float32Array bytes)
//   embeddings:meta      HASH    fields: model, dim, count, builtAt
//
// We store raw Float32 bytes (4 * dim bytes per vector) base64-encoded so the
// hash value is a clean text blob. Loading rehydrates into Float32Array.
//
// When we eventually flip on the Valkey Search module, this whole module gets
// replaced by FT.CREATE ... VECTOR HNSW + FT.SEARCH KNN, with no changes to
// callers (semanticSearch.js consumes findSimilar()).

const { cmd, isReady } = require("./valkey");

const VECTORS_KEY = "embeddings:vectors";
const META_KEY = "embeddings:meta";

function vecToBase64(vec) {
    // Float32Array -> Buffer -> base64
    return Buffer.from(vec.buffer, vec.byteOffset, vec.byteLength).toString("base64");
}

function base64ToVec(b64, dim) {
    const buf = Buffer.from(b64, "base64");
    if (buf.byteLength !== dim * 4) {
        throw new Error(
            `vector size mismatch: got ${buf.byteLength} bytes, expected ${dim * 4}`
        );
    }
    // Copy into a fresh ArrayBuffer so the typed-array view is correctly aligned.
    const ab = new ArrayBuffer(buf.byteLength);
    new Uint8Array(ab).set(buf);
    return new Float32Array(ab);
}

async function ensureReady() {
    const ok = await isReady();
    if (!ok) {
        throw new Error(
            "Valkey not reachable. Set VALKEY_URL and make sure the server is up."
        );
    }
}

async function clearAll() {
    await ensureReady();
    await cmd.del(VECTORS_KEY);
    await cmd.del(META_KEY);
}

async function setMeta({ model, dim, count }) {
    await ensureReady();
    await cmd.hset(META_KEY, {
        model,
        dim: String(dim),
        count: String(count),
        builtAt: new Date().toISOString(),
    });
}

async function getMeta() {
    await ensureReady();
    const raw = await cmd.hgetall(META_KEY);
    if (!raw || !raw.model) return null;
    return {
        model: raw.model,
        dim: Number(raw.dim),
        count: Number(raw.count),
        builtAt: raw.builtAt,
    };
}

async function putVector(productId, vector) {
    await ensureReady();
    await cmd.hset(VECTORS_KEY, productId, vecToBase64(vector));
}

async function putVectors(entries) {
    if (entries.length === 0) return;
    await ensureReady();
    // Build the flat HSET payload: key, field, value, field, value, …
    const args = [];
    for (const [productId, vector] of entries) {
        args.push(productId, vecToBase64(vector));
    }
    await cmd.hset(VECTORS_KEY, ...args);
}

// Loads every vector into memory. Fine for ~100s of products. When this gets
// big we'll either keep an in-memory cache (sub-ms cosine over 10k items is
// still cheap) or move to FT.SEARCH HNSW.
async function loadAllVectors(dim) {
    await ensureReady();
    const raw = await cmd.hgetall(VECTORS_KEY);
    const out = new Map();
    for (const [productId, b64] of Object.entries(raw || {})) {
        try {
            out.set(productId, base64ToVec(b64, dim));
        } catch (err) {
            console.warn(`[vectorStore] skipping ${productId}: ${err.message}`);
        }
    }
    return out;
}

async function count() {
    await ensureReady();
    return await cmd.hlen(VECTORS_KEY);
}

module.exports = {
    clearAll,
    setMeta,
    getMeta,
    putVector,
    putVectors,
    loadAllVectors,
    count,
    VECTORS_KEY,
    META_KEY,
};
