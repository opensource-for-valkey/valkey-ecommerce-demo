const { client } = require('../valkey/client');
const keys = require('../valkey/keys');
const config = require('../config');

async function get(rawKey) {
  const raw = await client.get(keys.agentCache(rawKey));
  return raw ? JSON.parse(raw) : null;
}

async function set(rawKey, value) {
  await client.set(keys.agentCache(rawKey), JSON.stringify(value), 'EX', config.agentCacheTtl);
}

async function flush() {
  // Best-effort: SCAN agent_cache:* and delete
  let cursor = '0';
  do {
    const [next, found] = await client.scan(cursor, 'MATCH', 'agent_cache:*', 'COUNT', 100);
    if (found.length) await client.del(...found);
    cursor = next;
  } while (cursor !== '0');
}

module.exports = { get, set, flush };
