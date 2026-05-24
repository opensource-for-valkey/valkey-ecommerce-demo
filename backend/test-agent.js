/**
 * Test file to demonstrate the Agentic Search system
 * Run with: node test-agent.js
 */

const { v4: uuidv4 } = require('uuid');
const agentService = require('./services/agent');
const valkeyService = require('./services/valkey');

async function runTests() {
  try {
    console.log('🚀 Starting Agent Tests\n');

    await valkeyService.connect();
    console.log('✅ Connected to Valkey\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 1: Natural Language Query Parsing');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const testQueries = [
      'I need a birthday gift for my 10-year-old nephew who likes science',
      'Show me robotics kits under $50',
      "What's a good telescope for a beginner astronomer?",
      'Chemistry sets for kids, highly rated only'
    ];

    for (const query of testQueries) {
      console.log(`📝 Query: "${query}"`);
      const parsed = agentService.parseQuery(query);
      console.log(`📋 Parsed:`, JSON.stringify(parsed, null, 2));
      console.log();
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 2: Agent Multi-Step Reasoning');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const mainQuery =
      'I need a birthday gift for my 10-year-old nephew who likes science';
    console.log(`📝 Main Query: "${mainQuery}"`);

    const result = await agentService.reason(mainQuery);
    console.log(`\n🔧 Tools Used: ${result.toolsUsed.join(', ')}`);
    console.log(
      `🎯 Search Parameters:`,
      JSON.stringify(result.searchParams, null, 2)
    );
    console.log(`\n📦 Results Found: ${result.products.length} products`);

    if (result.products.length > 0) {
      console.log('\nTop 3 Products:');
      result.products.slice(0, 3).forEach((product, i) => {
        console.log(`  ${i + 1}. ${product.name}`);
        console.log(`     💰 Price: ₹${product.price}`);
        console.log(`     ⭐ Rating: ${product.rating}/5`);
        console.log(`     ✨ Reason: ${product.reason}`);
      });
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 3: Conversational Response Generation');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const response = await agentService.generateResponse(mainQuery, result, []);

    console.log('💬 Agent Response:\n');
    console.log(response.response);
    console.log(`\n❓ Follow-up Question: ${response.followUp}`);
    console.log(`\n📊 Context:`, JSON.stringify(response.context, null, 2));

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 4: Search Refinement ("cheaper options")');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const refinementQuery = 'Show me cheaper options';
    console.log(`📝 Refinement Query: "${refinementQuery}"`);

    const conversationContext = {
      lastSearchParams: result.searchParams,
      lastMaxResultPrice: Math.max(...result.products.map((p) => p.price))
    };

    const refinedResult = await agentService.reason(
      refinementQuery,
      conversationContext,
      [
        { role: 'user', content: mainQuery },
        {
          role: 'agent',
          content: response.response,
          searchParams: result.searchParams
        }
      ]
    );

    console.log(`\n🔧 Tools Used: ${refinedResult.toolsUsed.join(', ')}`);
    console.log(
      `💰 Max price filter: ₹${refinedResult.searchParams.maxPrice ?? 'none'}`
    );
    console.log(`📦 Results Found: ${refinedResult.products.length} products`);

    if (refinedResult.products.length > 0) {
      console.log('\nCheaper Options:');
      refinedResult.products.slice(0, 3).forEach((product, i) => {
        console.log(`  ${i + 1}. ${product.name} - ₹${product.price}`);
      });
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 5: Conversation Memory & Context');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const testSessionId = `sess_${uuidv4()}`;

    const conversation = {
      sessionId: testSessionId,
      userId: `user_${uuidv4()}`,
      turns: [
        {
          role: 'user',
          content: mainQuery,
          timestamp: new Date().toISOString()
        },
        {
          role: 'agent',
          content: response.response,
          searchParams: result.searchParams,
          results: response.results.map((r) => r.productId),
          timestamp: new Date().toISOString()
        }
      ],
      context: {
        intent: 'gift_search',
        refinements_available: true,
        lastSearchParams: result.searchParams,
        lastMaxResultPrice: Math.max(...result.products.map((p) => p.price))
      },
      createdAt: new Date().toISOString()
    };

    await valkeyService.setConversation(testSessionId, conversation);
    console.log(`✅ Stored conversation: ${testSessionId}`);

    const retrievedConversation =
      await valkeyService.getConversation(testSessionId);
    console.log(`\n📊 Conversation Stats:`);
    console.log(`   • Session ID: ${retrievedConversation.sessionId}`);
    console.log(`   • User ID: ${retrievedConversation.userId}`);
    console.log(`   • Total Turns: ${retrievedConversation.turns.length}`);
    console.log(`   • Intent: ${retrievedConversation.context.intent}`);

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 6: Tool Performance (<3s target)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const pipelineStart = Date.now();
    const searchResults = await agentService.searchProducts(result.searchParams);
    const searchMs = Date.now() - pipelineStart;

    console.log(`   ✅ search_products: ${searchResults.length} products (${searchMs}ms)`);

    if (searchResults.length > 0) {
      const t0 = Date.now();
      const availability = await agentService.checkAvailability(
        result.searchParams
      );
      console.log(
        `   ✅ check_availability: ${availability.length} products (${Date.now() - t0}ms)`
      );

      const t1 = Date.now();
      const similar = await agentService.findSimilarProducts(result.searchParams);
      console.log(
        `   ✅ find_similar: ${similar.length} products (${Date.now() - t1}ms)`
      );
    }

    const fullPipeline = await agentService.reason(mainQuery);
    const fullMs = Date.now() - pipelineStart;
    console.log(
      `\n   ⏱️  Full agent pipeline: ${fullMs}ms (${fullPipeline.products.length} products)`
    );
    if (fullMs > 3000) {
      console.log('   ⚠️  Pipeline exceeded 3s target');
    } else {
      console.log('   ✅ Pipeline within 3s target');
    }

    console.log('\n✅ All tests completed successfully!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exitCode = 1;
  } finally {
    await valkeyService.disconnect();
    process.exit(process.exitCode || 0);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
