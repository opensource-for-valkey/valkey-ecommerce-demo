// Main agent loop: parse → plan → run tools → fuse → explain → persist
const crypto = require('crypto');
const nlu = require('./nlu');
const { geminiParse } = require('./gemini');
const planner = require('./planner');
const explainer = require('./explainer');
const { runTool } = require('../tools');
const conversation = require('../services/conversation.service');
const cache = require('../services/cache.service');
const preference = require('../services/preference.service');
const trending = require('../services/trending.service');

function hashArgs(obj) {
  return crypto.createHash('sha1').update(JSON.stringify(obj)).digest('hex').slice(0, 16);
}

function stripNulls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

function fuseResults(toolResults) {
  // Combine results from multiple search tools by productId, sum scores.
  const map = new Map();
  for (const tr of toolResults) {
    const list = Array.isArray(tr.result) ? tr.result : [];
    for (const p of list) {
      if (!p || !p.productId) continue;
      const prev = map.get(p.productId);
      const score = (p._score || 0) + (prev?._score || 0);
      map.set(p.productId, { ...(prev || p), _score: score });
    }
  }
  return Array.from(map.values()).sort((a, b) => b._score - a._score);
}

async function handleMessage({ sessionId, userId = null, message }) {
  const t0 = Date.now();

  // 1. Load prior conversation context
  const convo = await conversation.getOrCreate(sessionId, userId);
  const prevContext = convo.context || {};

  // 2. Load user preferences (optional personalization)
  const userPrefs = userId ? await preference.get(userId) : null;

  // 3. Parse query — try Gemini, fall back to rule-based
  const ruleParsed = nlu.parse(message, prevContext);
  const llmParsed = await geminiParse(message, prevContext);
  const parsed = llmParsed
    ? { ...ruleParsed, ...stripNulls(llmParsed), keywords: ruleParsed.keywords }
    : ruleParsed;

  // 4. Plan tools
  const { steps, merged } = planner.plan(parsed, prevContext, userPrefs);

  // 5. Execute tools (with per-tool result cache)
  const toolResults = [];
  for (const step of steps) {
    const key = `${step.tool}:${hashArgs(step.args)}`;
    let result = await cache.get(key);
    let cached = !!result;
    if (!result) {
      const tr = await runTool(step.tool, step.args);
      result = tr.result;
      await cache.set(key, result);
    }
    toolResults.push({ tool: step.tool, args: step.args, reason: step.reason, result, cached });
  }

  // 6. Fuse + cap to top N
  const fused = fuseResults(toolResults).slice(0, 6);

  // 7. Explain results
  const enrichedResults = fused.map((p) => ({
    productId: p.productId,
    name: p.name,
    price: p.price,
    rating: p.rating,
    category: p.category,
    tags: p.tags,
    description: p.description,
    image: p.image,
    images: p.images,
    brand: p.brand,
    reason: explainer.explainProduct(p, merged),
  }));
  const { summary, followUp, notInCatalog } = explainer.buildResponse(merged, enrichedResults);

  // 8. Update conversation context + persist
  const nextContext = {
    intent: merged.intent,
    recipient: merged.recipient,
    ageGroup: merged.ageGroup,
    categories: merged.categories || [],
    tags: merged.tags || [],
    maxPrice: merged.maxPrice || null,
    minPrice: merged.minPrice || null,
    budgetHint: merged.budgetHint || null,
    lastProductIds: enrichedResults.map((r) => r.productId),
    refinements_available: enrichedResults.length > 0,
  };

  await conversation.appendTurn(sessionId, {
    user: { role: 'user', content: message, ts: new Date().toISOString() },
    agent: {
      role: 'agent',
      content: summary,
      searchParams: {
        categories: merged.categories,
        tags: merged.tags,
        priceRange: [merged.minPrice || null, merged.maxPrice || null],
        ageGroup: merged.ageGroup,
      },
      results: enrichedResults.map((r) => r.productId),
      ts: new Date().toISOString(),
    },
    context: nextContext,
  });

  // 9. Bump trending counters for surfaced products
  await Promise.all(enrichedResults.map((r) => trending.bump(r.productId)));

  return {
    sessionId,
    response: summary,
    results: enrichedResults,
    followUp,
    notInCatalog: !!notInCatalog,
    context: nextContext,
    debug: {
      ms: Date.now() - t0,
      parsed,
      toolPlan: steps.map((s) => ({ tool: s.tool, reason: s.reason })),
      cacheHits: toolResults.filter((t) => t.cached).length,
    },
  };
}

module.exports = { handleMessage };
