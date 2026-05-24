const Redis = require('ioredis');

let client;

function connectValkey() {
  client = new Redis({
    host: process.env.VALKEY_HOST || 'localhost',
    port: process.env.VALKEY_PORT || 6379,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  client.on('connect', () => {
    console.log('Connected to Valkey');
  });

  client.on('error', (err) => {
    console.error('Valkey connection error:', err.message);
  });

  return client;
}

function getClient() {
  if (!client) {
    throw new Error('Valkey client not initialized. Call connectValkey() first.');
  }
  return client;
}

module.exports = { connectValkey, getClient };
