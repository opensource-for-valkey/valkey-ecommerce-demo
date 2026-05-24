const Redis = require('ioredis');
const config = require('../config');

const client = new Redis(config.valkeyUrl, {
  lazyConnect: false,
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});

let jsonModuleAvailable = null;

async function detectJsonModule() {
  if (jsonModuleAvailable !== null) return jsonModuleAvailable;
  try {
    const modules = await client.call('MODULE', 'LIST');
    const flat = JSON.stringify(modules).toLowerCase();
    jsonModuleAvailable = flat.includes('json') || flat.includes('rejson');
  } catch (_) {
    jsonModuleAvailable = false;
  }
  return jsonModuleAvailable;
}

async function jsonSet(key, value, ttl) {
  const json = JSON.stringify(value);
  const hasJson = await detectJsonModule();
  if (hasJson) {
    try {
      await client.call('JSON.SET', key, '$', json);
      if (ttl) await client.expire(key, ttl);
      return;
    } catch (_) {
      jsonModuleAvailable = false;
    }
  }
  if (ttl) await client.set(key, json, 'EX', ttl);
  else await client.set(key, json);
}

async function jsonGet(key) {
  const hasJson = await detectJsonModule();
  if (hasJson) {
    try {
      const raw = await client.call('JSON.GET', key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (_) {
      jsonModuleAvailable = false;
    }
  }
  const raw = await client.get(key);
  return raw ? JSON.parse(raw) : null;
}

async function jsonDel(key) {
  await client.del(key);
}

client.on('error', (err) => {
  console.error('[valkey] error:', err.message);
});
client.on('connect', () => {
  console.log('[valkey] connected to', config.valkeyUrl);
});

module.exports = { client, jsonSet, jsonGet, jsonDel, detectJsonModule };
