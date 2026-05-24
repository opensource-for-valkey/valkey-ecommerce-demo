const express = require('express');
const { ChatOpenAI } = require('@langchain/openai');
const { DynamicStructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
const valkeyClient = require('../valkeyClient');
const { QdrantClient } = require('@qdrant/js-client-rest');

const router = express.Router();

let pipeline;
async function getPipeline() {
  if (!pipeline) {
    const { pipeline: transformerPipeline } = await import('@xenova/transformers');
    pipeline = transformerPipeline;
  }
  return pipeline;
}

const llm = new ChatOpenAI({
  modelName: 'Meta-Llama-3.3-70B-Instruct',
  apiKey: '7cbd094e-81bd-472b-8e43-6191170a2d71',
  configuration: {
    baseURL: 'https://api.sambanova.ai/v1',
  },
  temperature: 0,
});

// Tools
const semanticSearchTool = new DynamicStructuredTool({
  name: 'semantic_search',
  description: 'Find products by meaning using vector similarity. Use this for descriptive, subjective, or fuzzy queries (e.g. "gifts for a 10 year old", "gaming laptop").',
  schema: z.object({
    naturalLanguageQuery: z.string(),
    limit: z.number().default(5)
  }),
  func: async ({ naturalLanguageQuery, limit }) => {
    try {
      const extractorFn = await getPipeline();
      const embedder = await extractorFn('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      const output = await embedder(naturalLanguageQuery, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data);

      const client = new QdrantClient({ url: 'http://127.0.0.1:6333' });
      const results = await client.search('products', {
        vector: vector,
        limit: limit
      });

      const filtered = results.filter(r => r.score > 0.25);
      if (filtered.length === 0) return 'No relevant products found. Tell the user we currently do not have what they are looking for.';
      
      const mapped = filtered.map(r => ({
        id: r.id,
        name: r.payload.name,
        price: r.payload.price,
        tags: r.payload.tags,
        score: r.score
      }));
      return JSON.stringify(mapped);
    } catch (e) {
      console.error(e);
      return 'Error searching products by semantic meaning.';
    }
  }
});

const searchProductsTool = new DynamicStructuredTool({
  name: 'search_products',
  description: 'Search products by keywords, tags, or exact matches using full-text search.',
  schema: z.object({
    query: z.string().describe('Search query keyword')
  }),
  func: async ({ query }) => {
    try {
      const results = await valkeyClient.sendCommand(['FT.SEARCH', 'idx:products', query, 'LIMIT', '0', '5']);
      if (!results || results[0] === 0) return 'No products found.';
      
      const parsed = [];
      // Valkey FT.SEARCH returns [count, key1, [fields], key2, [fields], ...]
      for (let i = 1; i < results.length; i += 2) {
        const fields = results[i + 1];
        if (fields && fields[1]) {
          try {
            const product = JSON.parse(fields[1]);
            parsed.push({
              id: product.id,
              name: product.name,
              price: product.price ? product.price.current : null,
              description: product.description
            });
          } catch(e){}
        }
      }
      return JSON.stringify(parsed);
    } catch (e) {
      return 'Error searching products by keyword.';
    }
  }
});

const tools = [semanticSearchTool, searchProductsTool];

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful e-commerce AI shopping assistant. You help users find products, recommend gifts, and answer questions about the store. Use tools to search for products when needed. When you recommend a product, give a brief explanation of why.'],
  new MessagesPlaceholder('chat_history'),
  ['user', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
]);

const llmWithTools = llm.bindTools(tools);

router.post('/search', async (req, res) => {
  try {
    const { sessionId, query, userId } = req.body;
    if (!sessionId || !query) return res.status(400).json({ error: 'sessionId and query required' });

    const key = `conversation:${sessionId}`;
    const rawContext = await valkeyClient.sendCommand(['JSON.GET', key]);
    
    let context = {
      sessionId,
      userId: userId || 'anonymous',
      turns: []
    };

    if (rawContext) {
      context = JSON.parse(rawContext);
    }

    const systemPrompt = `You are a helpful e-commerce AI shopping assistant.
You help users find products, recommend gifts, and answer questions about the store.
CRITICAL INSTRUCTIONS:
1. You MUST use tools to search for products. DO NOT invent or assume any products exist unless they are returned by a tool.
2. If a user asks a general question (e.g. "what laptops do you have?"), use the search tools to find available laptops in the database and only recommend those.
3. Whenever you recommend a product, you MUST provide a link to it formatted EXACTLY as a markdown link: [Product Name](/product-details?id=PRODUCT_ID), using the "id" field from the tool's result.
4. Give a brief explanation of why you recommend each product based on its description, tags, or name.`;

    const messages = [
      new HumanMessage({ content: systemPrompt }),
      ...context.turns.map(t => t.role === 'user' ? new HumanMessage({ content: t.content }) : new AIMessage({ content: t.content })),
      new HumanMessage({ content: query })
    ];

    let aiMsg = await llmWithTools.invoke(messages);
    messages.push(aiMsg);

    // If the model called tools, execute them
    let iterations = 0;
    while (aiMsg.tool_calls && aiMsg.tool_calls.length > 0 && iterations < 5) {
      for (const toolCall of aiMsg.tool_calls) {
        const tool = tools.find(t => t.name === toolCall.name);
        if (tool) {
          const toolResult = await tool.invoke(toolCall.args);
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolResult
          });
        }
      }
      aiMsg = await llmWithTools.invoke(messages);
      messages.push(aiMsg);
      iterations++;
    }

    // Save turn
    context.turns.push({ role: 'user', content: query, timestamp: new Date().toISOString() });
    context.turns.push({ role: 'agent', content: aiMsg.content, timestamp: new Date().toISOString() });

    await valkeyClient.sendCommand(['JSON.SET', key, '$', JSON.stringify(context)]);
    await valkeyClient.sendCommand(['EXPIRE', key, '1800']);

    res.json({ reply: aiMsg.content });
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const key = `conversation:${req.params.sessionId}`;
    const rawContext = await valkeyClient.sendCommand(['JSON.GET', key]);
    if (!rawContext) return res.json({ turns: [] });
    res.json(JSON.parse(rawContext));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

module.exports = router;
