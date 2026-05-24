const { QdrantClient } = require('@qdrant/js-client-rest');
const valkeyClient = require('./valkeyClient');

let pipeline;
async function getPipeline() {
  if (!pipeline) {
    // Dynamic import to support ES modules in CommonJS
    const { pipeline: transformerPipeline } = await import('@xenova/transformers');
    pipeline = transformerPipeline;
  }
  return pipeline;
}

async function seedVectors() {
  try {
    await valkeyClient.connect();
    
    const client = new QdrantClient({ url: 'http://127.0.0.1:6333' });
    const collectionName = 'products';

    // Check if collection exists
    try {
      await client.getCollection(collectionName);
      console.log(`Collection ${collectionName} already exists. Recreating...`);
      await client.deleteCollection(collectionName);
    } catch (e) {
      // Collection doesn't exist, ignore
    }

    // Create collection (all-MiniLM-L6-v2 outputs 384-dimensional vectors)
    await client.createCollection(collectionName, {
      vectors: {
        size: 384,
        distance: 'Cosine',
      },
    });
    console.log(`Created Qdrant collection: ${collectionName}`);

    // Fetch all products from Valkey
    const productKeys = await valkeyClient.sendCommand(['KEYS', 'product:*']);
    if (!productKeys || productKeys.length === 0) {
      console.log('No products found in Valkey.');
      process.exit(1);
    }

    console.log(`Found ${productKeys.length} products. Generating embeddings...`);
    const extractorFn = await getPipeline();
    // Initialize the feature extraction pipeline
    const embedder = await extractorFn('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const points = [];

    for (let i = 0; i < productKeys.length; i++) {
      const pKey = productKeys[i];
      const productJson = await valkeyClient.sendCommand(['JSON.GET', pKey]);
      if (!productJson) continue;

      const product = JSON.parse(productJson);
      
      // Construct text to embed
      const textToEmbed = `${product.name}. ${product.description || ''} ${product.tags ? product.tags.join(' ') : ''}`;
      
      // Generate embedding
      const output = await embedder(textToEmbed, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data);

      const qdrantId = product.id.replace('product:', '');

      points.push({
        id: qdrantId,
        vector: vector,
        payload: {
          id: product.id,
          name: product.name,
          categoryId: product.categoryId || null,
          price: product.price ? product.price.current : null,
          tags: product.tags || [],
          image: product.images ? product.images[0] : null
        }
      });
      console.log(`Embedded: ${product.name}`);
    }

    if (points.length > 0) {
      // Insert into Qdrant
      await client.upsert(collectionName, {
        wait: true,
        points: points
      });
      console.log(`Successfully seeded ${points.length} vectors into Qdrant.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedVectors();
