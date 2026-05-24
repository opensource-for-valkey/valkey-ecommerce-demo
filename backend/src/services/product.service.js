const { client, jsonGet } = require('../valkey/client');
const keys = require('../valkey/keys');

let memoryCache = null;
let memoryCacheTs = 0;
const MEM_TTL_MS = 30 * 1000;

async function getAllProducts() {
  const now = Date.now();
  if (memoryCache && now - memoryCacheTs < MEM_TTL_MS) return memoryCache;

  const ids = await client.smembers(keys.productIndex);
  if (!ids || ids.length === 0) return [];

  const products = await Promise.all(
    ids.map((id) => jsonGet(keys.product(id.replace('product:', ''))))
  );

  memoryCache = products.filter(Boolean);
  memoryCacheTs = now;
  return memoryCache;
}

async function getProductById(productId) {
  const id = productId.replace(/^product:/, '');
  return jsonGet(keys.product(id));
}

async function getEmbedding(productId) {
  const raw = await client.hget(keys.embeddingsIndex, productId);
  return raw ? JSON.parse(raw) : null;
}

async function getAllEmbeddings() {
  const all = await client.hgetall(keys.embeddingsIndex);
  const out = {};
  for (const [k, v] of Object.entries(all || {})) out[k] = JSON.parse(v);
  return out;
}

function invalidateMemoryCache() {
  memoryCache = null;
  memoryCacheTs = 0;
}

module.exports = { getAllProducts, getProductById, getEmbedding, getAllEmbeddings, invalidateMemoryCache };
