const Redis = require('ioredis');

const valkey = new Redis(process.env.VALKEY_URL || 'redis://localhost:6379', {
  lazyConnect: false,
  maxRetriesPerRequest: 3,
});

valkey.on('connect', () => console.log('[Valkey] Connected'));
valkey.on('error', (err) => console.error('[Valkey] Error:', err.message));

module.exports = valkey;
