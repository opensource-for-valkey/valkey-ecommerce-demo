/**
 * Valkey client + vector index management.
 * Uses iovalkey (compatible with the Valkey Search module shipped in valkey-bundle).
 */
import Valkey from "iovalkey";

const URL = process.env.VALKEY_URL || "redis://localhost:6379";
const INDEX = process.env.VECTOR_INDEX || "products_idx";
const DIM = Number(process.env.VECTOR_DIM || 512);
const KEY_PREFIX = "product:";

export const client = new Valkey(URL);

export function productKey(id) {
  return `${KEY_PREFIX}${id}`;
}

/** Create the HNSW vector index if it does not exist. Idempotent. */
export async function ensureIndex() {
  try {
    await client.call("FT.INFO", INDEX);
    return { created: false };
  } catch {
    await client.call(
      "FT.CREATE",
      INDEX,
      "ON", "HASH",
      "PREFIX", "1", KEY_PREFIX,
      "SCHEMA",
      "tag", "TAG",
      "embedding", "VECTOR", "HNSW", "6",
      "TYPE", "FLOAT32",
      "DIM", String(DIM),
      "DISTANCE_METRIC", "COSINE",
    );
    return { created: true };
  }
}

/** Upsert a single product hash including its embedding bytes. */
export async function upsertProduct(p, embeddingBuffer) {
  await client.hset(productKey(p.id), {
    id: p.id,
    name: p.name,
    tag: p.tag,
    price: p.price,
    rating: String(p.rating),
    reviews: p.reviews,
    image: p.image,
    embedding: embeddingBuffer,
  });
}

/** KNN search: returns up to topK nearest products to the given query vector.
 *  Also returns cosine similarity (0..1) per hit so the UI can show confidence. */
export async function knnSearch(queryBuffer, topK = 12) {
  const result = await client.callBuffer(
    "FT.SEARCH",
    INDEX,
    `*=>[KNN ${topK} @embedding $vec AS score]`,
    "PARAMS", "2", "vec", queryBuffer,
    "DIALECT", "2",
    "LIMIT", "0", String(topK),
  );

  // Reply shape: [ total, key1, [field, val, ...], key2, [...], ... ]
  const items = [];
  for (let i = 1; i < result.length; i += 2) {
    const key = result[i].toString();
    const fields = result[i + 1];

    let distance = null;
    for (let j = 0; j < fields.length; j += 2) {
      if (fields[j].toString() === "score") {
        distance = parseFloat(fields[j + 1].toString());
      }
    }

    const hash = await client.hgetall(key);
    delete hash.embedding;
    if (distance !== null && !Number.isNaN(distance)) {
      hash.distance = distance;
      // COSINE distance in [0, 2] -> similarity in [-1, 1] mapped to [0, 1]
      hash.similarity = Math.max(0, Math.min(1, 1 - distance));
    }
    items.push(hash);
  }
  return items;
}

/** Count of indexed products — used for diagnostics. */
export async function countProducts() {
  const keys = await client.keys(`${KEY_PREFIX}*`);
  return keys.length;
}

/** FT.INFO output (raw array). */
export async function indexInfo() {
  try {
    return await client.call("FT.INFO", INDEX);
  } catch (err) {
    return { error: err.message };
  }
}

export async function disconnect() {
  await client.quit();
}
