/**
 * Challenge 14 acceptance criteria verification
 * Run: node test-acceptance.js
 */
const agentService = require('./services/agent');
const valkeyService = require('./services/valkey');

const SPEC_QUERY =
  'I need a birthday gift for my 10-year-old nephew who likes science';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed += 1;
  } else {
    console.log(`  ❌ ${label}`);
    failed += 1;
  }
}

async function run() {
  console.log('🎯 Challenge 14 — Acceptance Criteria\n');
  await valkeyService.connect();

  // AC1: NLU → structured search parameters
  console.log('1. Natural language → structured search parameters');
  const parsed = agentService.parseQuery(SPEC_QUERY);
  assert(parsed.intent === 'gift_search', 'intent = gift_search');
  assert(parsed.context.age === 10, 'age = 10');
  assert(parsed.context.ageGroup === '8-12', 'ageGroup = 8-12');
  assert(parsed.context.recipient === 'nephew', 'recipient = nephew');
  assert(parsed.tags.includes('science'), 'tags include science');
  assert(parsed.categories.includes('science'), 'categories include science');
  console.log('     ', JSON.stringify(parsed, null, 2).split('\n').join('\n      '));

  // AC2 + AC3: Conversation memory + cheaper options
  console.log('\n2. Conversation memory & "Show me cheaper options"');
  const sessionId = `sess_acceptance_${Date.now()}`;
  const t0 = Date.now();

  const first = await agentService.reason(SPEC_QUERY, null, []);
  assert(first.products.length > 0, 'first search returns products');
  assert(first.toolsUsed.includes('search_products'), 'uses search_products');
  assert(first.products.every((p) => p.reason?.length > 10), 'each product has explanation');

  const conversationContext = {
    lastSearchParams: first.searchParams,
    lastMaxResultPrice: Math.max(...first.products.map((p) => p.price))
  };

  const history = [
    { role: 'user', content: SPEC_QUERY },
    { role: 'agent', content: 'results', searchParams: first.searchParams }
  ];

  const cheaper = await agentService.reason(
    'Show me cheaper options',
    conversationContext,
    history
  );

  assert(
    cheaper.searchParams.maxPrice != null,
    'cheaper refinement sets maxPrice from context'
  );
  assert(
    cheaper.searchParams.tags.includes('science') ||
      cheaper.searchParams.categories.includes('science'),
    'cheaper search keeps previous science context'
  );
  assert(
    cheaper.toolsUsed.includes('search_products'),
    'cheaper flow runs search_products'
  );
  assert(
    cheaper.toolsUsed.includes('filter_by_price'),
    'cheaper flow runs filter_by_price'
  );
  assert(cheaper.products.length > 0, 'cheaper refinement returns products');
  if (cheaper.products.length && first.products.length) {
    const cheapestNew = Math.min(...cheaper.products.map((p) => p.price));
    const prevMax = conversationContext.lastMaxResultPrice;
    assert(cheapestNew <= prevMax, 'cheaper results are lower than previous max');
  }

  await valkeyService.setConversation(sessionId, {
    sessionId,
    userId: 'user_test',
    turns: history,
    context: conversationContext
  });
  const loaded = await valkeyService.getConversation(sessionId);
  assert(loaded?.sessionId === sessionId, 'Valkey stores conversation JSON');

  // AC4: Multiple tools in sequence
  console.log('\n3. Multi-step tool use');
  const multi = await agentService.reason(
    'Show me highly rated science kits with reviews and check availability',
    null,
    []
  );
  assert(multi.toolsUsed.length >= 2, 'uses 2+ tools in one turn');
  assert(
    multi.toolsUsed.includes('search_products') || multi.toolsUsed.includes('semantic_search'),
    'includes search'
  );
  assert(multi.toolsUsed.includes('get_reviews'), 'includes get_reviews');
  assert(multi.toolsUsed.includes('check_availability'), 'includes check_availability');

  const clarify = await agentService.reason('help me find something', null, []);
  assert(clarify.toolsUsed.includes('ask_clarification'), 'vague query triggers ask_clarification');

  // AC5: Explanations
  console.log('\n4. Result explanations');
  assert(
    first.products[0].reason.includes('nephew') ||
      first.products[0].reason.includes('birthday') ||
      first.products[0].reason.includes('science') ||
      first.products[0].reason.includes('8-12'),
    'reason references user context'
  );

  // AC6: Under 3 seconds
  console.log('\n5. Response time < 3s');
  const t1 = Date.now();
  const perf = await agentService.reason(SPEC_QUERY, null, []);
  const ms = Date.now() - t1;
  assert(ms < 3000, `pipeline completed in ${ms}ms (< 3000ms)`);
  assert(
    (perf.latencyMs || ms) < 3000,
    `agent reports latencyMs ${perf.latencyMs || ms}`
  );

  await valkeyService.disconnect();

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
