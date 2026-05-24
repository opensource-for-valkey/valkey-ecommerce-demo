require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '4000', 10),
  valkeyUrl: process.env.VALKEY_URL || 'redis://localhost:6379',
  conversationTtl: parseInt(process.env.CONVERSATION_TTL || '1800', 10),
  agentCacheTtl: parseInt(process.env.AGENT_CACHE_TTL || '300', 10),
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  preferenceTtl: 60 * 60 * 24 * 30,
  trendingTtl: 60 * 60,
};
