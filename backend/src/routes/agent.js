// Chat agent endpoints. The agent runs server-side; the client sends a single
// user message and observes the rest of the turn over the existing SSE
// channel (chat.message, chat.tool_call, chat.tool_result events).

const express = require("express");
const { z } = require("zod");

const { requireAuth } = require("../lib/auth");
const groq = require("../lib/groq");
const chat = require("../services/chat");

const router = express.Router();
router.use(requireAuth);

const sendSchema = z.object({
    message: z.string().trim().min(1).max(2000),
});

// GET /api/agent/messages   — recent history for the signed-in user
router.get("/messages", (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    res.json({ messages: chat.listMessages(req.user.id, limit) });
});

// DELETE /api/agent/messages — wipe chat history for the signed-in user
router.delete("/messages", async (req, res) => {
    try {
        const result = await chat.clearMessages(req.user.id);
        res.json({ ok: true, deleted: result.deleted });
    } catch (err) {
        console.error("[agent:clear]", err);
        res.status(500).json({
            error: "internal_error",
            message: err.message || "Failed to clear chat history",
        });
    }
});

// POST /api/agent/chat      — send a user message, run the agent loop
router.post("/chat", async (req, res) => {
    if (!groq.isReady()) {
        return res.status(503).json({
            error: "agent_unavailable",
            message:
                "Set GROQ_API_KEY in backend/.env and restart the server to enable the agent.",
        });
    }
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "invalid_request",
            message: "message is required (1-2000 chars)",
        });
    }
    try {
        const result = await chat.runAgent({
            userId: req.user.id,
            userMessage: parsed.data.message,
        });
        res.json(result);
    } catch (err) {
        console.error("[agent]", err);
        res.status(500).json({
            error: err.code || "internal_error",
            message: err.message || "Agent failed",
        });
    }
});

module.exports = router;
