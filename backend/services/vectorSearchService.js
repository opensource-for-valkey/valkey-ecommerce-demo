const { client } = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyBeYQq5FWTbpYVPXWNjYILVdyGiXr6hEDY");
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

class VectorSearchService {
  async getEmbedding(text) {
    try {
      const result = await embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch(err) {
      console.error("Gemini Embedding Error:", err.message);
      // Fallback to random if API fails
      return new Array(768).fill(0).map(() => Math.random());
    }
  }

  async getProductEmbedding(product) {
    const cacheKey = `product_embedding:${product.id}`;
    let embedding = await client.json.get(cacheKey);
    
    // If not cached in Valkey, generate via Gemini and store it
    if (!embedding) {
      const textToEmbed = `${product.name || ''}. ${product.description || ''}. Category: ${product.category || ''}. Tags: ${product.tags?.join(', ') || ''}`;
      embedding = await this.getEmbedding(textToEmbed);
      await client.json.set(cacheKey, '$', embedding);
    }
    return embedding;
  }

  async semanticSearch(queryStr, limit = 5) {
    console.log(`[Vector Search] Using Gemini to embed query: "${queryStr}"`);
    
    // 1. Get query embedding
    const queryEmbedding = await this.getEmbedding(queryStr);
    
    // 2. Fetch all products from Valkey
    const allProductIds = await client.zRange('product_index', 0, -1);
    const results = [];
    
    // 3. Compare vectors and score
    for (const pId of allProductIds) {
      const product = await client.json.get(`product:${pId}`);
      if (!product) continue;
      
      const productEmbedding = await this.getProductEmbedding(product);
      
      // Safety check for dimension mismatch
      if (!productEmbedding || productEmbedding.length !== queryEmbedding.length) {
         continue; // skip
      }
      
      const score = cosineSimilarity(queryEmbedding, productEmbedding);
      
      // Keyword boost
      let finalScore = score;
      if (product.name && product.name.toLowerCase().includes(queryStr.toLowerCase())) {
         finalScore += 0.1;
      }

      if (finalScore > 0.3) { // Similarity threshold
        results.push({ ...product, semanticScore: finalScore.toFixed(3) });
      }
    }
    
    // Sort by semantic score descending
    results.sort((a, b) => b.semanticScore - a.semanticScore);
    
    return results.slice(0, limit);
  }
}

module.exports = new VectorSearchService();
