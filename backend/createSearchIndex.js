require('dotenv').config();
const { SCHEMA_FIELD_TYPE } = require('redis');
const valkeyClient = require('./valkeyClient');

async function createSearchIndex() {
  try {
    await valkeyClient.connect();

    // Drop the index if it exists
    try {
      await valkeyClient.ft.dropIndex('idx:products');
      console.log('Dropped existing index: idx:products');
    } catch (err) {
      if (!err.message.includes('Unknown Index name')) {
        console.log('Note on dropping index:', err.message);
      }
    }

    try {
      await valkeyClient.sendCommand([
        'FT.CREATE', 'idx:products',
        'ON', 'JSON',
        'PREFIX', '1', 'product:',
        'SCHEMA',
        '$.name', 'AS', 'name', 'TEXT', 'WEIGHT', '5.0'
      ]);
      console.log('Successfully created search index: idx:products');
    } catch(err) {
      console.log('Attempt 1 failed:', err.message);
      try {
        await valkeyClient.sendCommand([
          'FT.CREATE', 'idx:products',
          'ON', 'JSON',
          'PREFIX', '1', 'product:',
          'SCHEMA',
          '$.name', 'TEXT', 'WEIGHT', '5.0', 'AS', 'name'
        ]);
        console.log('Successfully created search index on attempt 2');
      } catch(err2) {
        console.log('Attempt 2 failed:', err2.message);
      }
    }

    console.log('Populating autocomplete suggestions...');
    const result = await valkeyClient.keys('product:*');
    let count = 0;
    
    for (const key of result) {
      const productJsonStr = await valkeyClient.sendCommand(['JSON.GET', key]);
      if (productJsonStr) {
        const product = JSON.parse(productJsonStr);
        if (product && product.name) {
          try {
            await valkeyClient.sendCommand(['FT.SUGADD', 'autocomplete', product.name, '100']);
            count++;
          } catch(e) {
            console.error('Failed to add to autocomplete:', e.message);
          }
        }
      }
    }
    
    console.log(`Successfully added ${count} products to autocomplete dictionary.`);

  } catch (error) {
    console.error('Error creating search index:', error);
  } finally {
    process.exit(0);
  }
}

createSearchIndex();
