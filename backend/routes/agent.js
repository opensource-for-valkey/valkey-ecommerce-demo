const express = require('express');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const router = express.Router();

const valkeyService = require('../services/valkey');
const agentService = require('../services/agent');

async function processAgentSearch({ sessionId, userId, message, liveSearch = true }, res) {
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const started = Date.now();
  const currentSessionId = sessionId || `sess_${uuidv4()}`;
  const currentUserId = userId || `user_${uuidv4()}`;

  console.log(`\n🔍 User message → agent (${currentSessionId})`);
  console.log(`📝 "${message}"`);

  let conversation = await valkeyService.getConversation(currentSessionId);

  if (!conversation) {
    conversation = {
      sessionId: currentSessionId,
      userId: currentUserId,
      turns: [],
      context: {
        intent: null,
        refinements_available: false
      },
      createdAt: new Date().toISOString()
    };
  }

  const userTurn = {
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  };
  conversation.turns.push(userTurn);

  const conversationHistory = conversation.turns.map((t) => ({
    role: t.role,
    content: t.content,
    searchParams: t.searchParams
  }));

  const agentResult = await agentService.reason(
    message,
    conversation.context,
    conversationHistory,
    { liveSearch: liveSearch !== false }
  );

  if (agentResult.latencyMs > 3000) {
    console.warn(`⚠️ Agent pipeline ${agentResult.latencyMs}ms exceeds 3s target`);
  }

  const response = await agentService.generateResponse(
    message,
    agentResult,
    conversationHistory
  );

  const agentTurn = {
    role: 'agent',
    content: response.response,
    searchParams: agentResult.searchParams,
    results: response.results.map((r) => r.productId),
    timestamp: new Date().toISOString(),
    toolsUsed: agentResult.toolsUsed
  };
  conversation.turns.push(agentTurn);

  const lastMaxPrice = response.results.reduce(
    (max, r) => Math.max(max, r.price || 0),
    0
  );

  conversation.context = {
    ...conversation.context,
    ...response.context,
    lastSearchParams: agentResult.searchParams,
    lastMaxResultPrice: lastMaxPrice || conversation.context.lastMaxResultPrice
  };

  await valkeyService.setConversation(currentSessionId, conversation);

  // Background cache write for dashboard visibility only — never read during live chat
  if (agentResult.queryHash && agentResult.resultSource === 'live_search') {
    valkeyService
      .setCacheResult(
        agentResult.queryHash,
        { results: response.results, message, cachedAt: new Date().toISOString() },
        300
      )
      .catch(() => {});
  }

  const latencyMs = Date.now() - started;
  const resultSource = agentResult.resultSource || 'live_search';

  console.log(
    `✅ ${resultSource} → ${response.results.length} products (${latencyMs}ms)`
  );

  return res.json({
    sessionId: currentSessionId,
    userId: currentUserId,
    response: response.response,
    results: response.results,
    followUp: response.followUp,
    clarification: response.clarification || null,
    context: response.context,
    turnCount: conversation.turns.length,
    searchParams: agentResult.searchParams,
    meta: {
      resultSource,
      liveSearch: resultSource === 'live_search',
      valkeyUsed: true,
      analyzedUserInput: message,
      searchParams: agentResult.searchParams,
      toolsUsed: agentResult.toolsUsed,
      latencyMs: agentResult.latencyMs || latencyMs,
      under3Seconds: (agentResult.latencyMs || latencyMs) < 3000,
      valkeyKeys: {
        conversation: `conversation:${currentSessionId}`,
        cache: agentResult.queryHash
          ? `agent_cache:${agentResult.queryHash}`
          : null
      }
    }
  });
}

/**
 * POST /api/agent/search
 * Send natural language query to agent
 */
router.post('/search', async (req, res) => {
  try {
    await processAgentSearch(req.body, res);
  } catch (error) {
    console.error('Error in agent search:', error);
    res.status(500).json({
      error: 'Failed to process search query',
      message: error.message
    });
  }
});

/**
 * GET /api/agent/conversation/:sessionId
 * Get conversation history
 */
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await valkeyService.getConversation(sessionId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.json({
      sessionId: conversation.sessionId,
      userId: conversation.userId,
      turns: conversation.turns,
      context: conversation.context,
      createdAt: conversation.createdAt,
      turnCount: conversation.turns.length
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      error: 'Failed to retrieve conversation',
      message: error.message
    });
  }
});

/**
 * POST /api/agent/feedback
 * User feedback on results (thumbs up/down)
 */
router.post('/feedback', async (req, res) => {
  try {
    const { sessionId, productId, feedback, reason } = req.body;

    if (!sessionId || !productId || !feedback) {
      return res.status(400).json({
        error: 'sessionId, productId, and feedback are required'
      });
    }

    const feedbackKey = `feedback:${sessionId}:${productId}`;
    const feedbackData = {
      sessionId,
      productId,
      feedback,
      reason: reason || null,
      timestamp: new Date().toISOString()
    };

    await valkeyService.client.json.set(feedbackKey, '$', feedbackData);
    await valkeyService.client.expire(feedbackKey, 2592000);
    await valkeyService.track('FEEDBACK_SET', feedbackKey, { success: true });

    console.log(`📊 Feedback recorded: ${productId} - ${feedback}`);

    return res.json({
      success: true,
      message: 'Feedback recorded',
      feedback: feedbackData
    });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({
      error: 'Failed to record feedback',
      message: error.message
    });
  }
});

/**
 * POST /api/agent/refine
 * Refine previous search with new criteria (alias for search with session)
 */
router.post('/refine', async (req, res) => {
  try {
    const { sessionId, refinement, userId } = req.body;

    if (!sessionId || !refinement) {
      return res.status(400).json({
        error: 'sessionId and refinement are required'
      });
    }

    const conversation = await valkeyService.getConversation(sessionId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    await processAgentSearch(
      { sessionId, userId: userId || conversation.userId, message: refinement },
      res
    );
  } catch (error) {
    console.error('Error refining search:', error);
    res.status(500).json({
      error: 'Failed to refine search',
      message: error.message
    });
  }
});

/**
 * GET /api/agent/debug/:sessionId
 * Debug endpoint to see agent reasoning
 */
router.get('/debug/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await valkeyService.getConversation(sessionId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const debugInfo = {
      sessionId: conversation.sessionId,
      turns: conversation.turns.map((turn) => ({
        role: turn.role,
        content: turn.content,
        ...(turn.searchParams && {
          parsedParams: turn.searchParams,
          toolsUsed: turn.toolsUsed
        }),
        timestamp: turn.timestamp
      })),
      context: conversation.context,
      stats: {
        totalTurns: conversation.turns.length,
        userTurns: conversation.turns.filter((t) => t.role === 'user').length,
        agentTurns: conversation.turns.filter((t) => t.role === 'agent').length
      }
    };

    return res.json(debugInfo);
  } catch (error) {
    console.error('Error getting debug info:', error);
    res.status(500).json({
      error: 'Failed to retrieve debug info',
      message: error.message
    });
  }
});

module.exports = router;
