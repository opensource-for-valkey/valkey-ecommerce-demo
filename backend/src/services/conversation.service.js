const { jsonGet, jsonSet, client } = require('../valkey/client');
const keys = require('../valkey/keys');
const config = require('../config');

async function getOrCreate(sessionId, userId = null) {
  const existing = await jsonGet(keys.conversation(sessionId));
  if (existing) return existing;
  const fresh = {
    sessionId,
    userId,
    turns: [],
    context: {},
    createdAt: new Date().toISOString(),
  };
  await jsonSet(keys.conversation(sessionId), fresh, config.conversationTtl);
  return fresh;
}

async function get(sessionId) {
  return jsonGet(keys.conversation(sessionId));
}

async function appendTurn(sessionId, { user, agent, context }) {
  const convo = (await jsonGet(keys.conversation(sessionId))) || {
    sessionId, userId: null, turns: [], context: {}, createdAt: new Date().toISOString(),
  };
  convo.turns.push(user, agent);
  // Cap to last 20 turns to bound size
  if (convo.turns.length > 20) convo.turns = convo.turns.slice(-20);
  convo.context = context;
  convo.updatedAt = new Date().toISOString();
  await jsonSet(keys.conversation(sessionId), convo, config.conversationTtl);
  // Refresh TTL
  await client.expire(keys.conversation(sessionId), config.conversationTtl);
  return convo;
}

async function clear(sessionId) {
  await client.del(keys.conversation(sessionId));
}

module.exports = { getOrCreate, get, appendTurn, clear };
