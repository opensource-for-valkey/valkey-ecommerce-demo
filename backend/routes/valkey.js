const express = require('express');
const router = express.Router();
const valkeyService = require('../services/valkey');

/**
 * GET /api/valkey/dashboard
 * Real-time Valkey utilization snapshot
 */
router.get('/dashboard', async (req, res) => {
  try {
    const data = await valkeyService.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load Valkey dashboard',
      message: error.message
    });
  }
});

/**
 * GET /api/valkey/stream
 * Server-Sent Events — pushes dashboard updates every 2s
 */
router.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = async () => {
    try {
      const data = await valkeyService.getDashboardData();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      res.write(
        `data: ${JSON.stringify({ error: err.message, connected: false })}\n\n`
      );
    }
  };

  await send();
  const interval = setInterval(send, 2000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

module.exports = router;
