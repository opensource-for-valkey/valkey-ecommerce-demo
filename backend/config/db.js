const { createClient } = require('redis');

const client = createClient({
  url: process.env.VALKEY_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Valkey Client Error:', err));
client.on('connect', () => console.log('Connecting to Valkey...'));
client.on('ready', () => console.log('Valkey Client Ready & Connected!'));

const connectValkey = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

module.exports = { client, connectValkey };
