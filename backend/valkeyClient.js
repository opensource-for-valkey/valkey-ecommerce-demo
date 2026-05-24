const { createClient } = require('redis');

const client = createClient({
  url: process.env.VALKEY_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Valkey Client Error', err));
client.on('connect', () => console.log('Connected to Valkey'));

module.exports = client;
