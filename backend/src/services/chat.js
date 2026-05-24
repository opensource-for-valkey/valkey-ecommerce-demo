// Chat service. Persists conversation turns and runs the agent loop.
//
// Storage shape mirrors the OpenAI/Groq chat-message format closely so we can
// hand history back to the model with minimal transformation:
//   role 'user'      -> { role, content }
//   role 'assistant' -> { role, content, tool_calls? }
//   role 'tool'      -> { role, tool_call_id, name, content }
//
// We cap loaded history to the last 30 turns so prompts stay bounded.

const { db } = require("../db");
const { createId } = require("../lib/id");
const { nowIso } = require("../lib/auth");
const groq = require("../lib/groq");
const tools = require("./tools");
const bus = require("../lib/bus");

const HISTORY_LIMIT = 30;
const MAX_TOOL_ITERATIONS = 6; // hard guardrail against infinite loops

const SYSTEM_PROMPT = `You are a hands-on shopping co-pilot. You don't just describe — you drive the storefront. Apply filters, open products, add to cart. The shopper watches your virtual cursor act on the page.

CATALOG: ~50 products across Electronics, Fashion, Home & Kitchen, Sports & Outdoors. Always confirm with search_products before recommending.

PRICES: stored as integer paise (1 rupee = 100 paise). User says rupees → multiply by 100 for minPrice/maxPrice. Display the priceDisplay field verbatim. Never compute prices yourself.

CLARIFY FIRST when the request is too vague to act on. A request is vague if it's a single bare category or noun with no signals about budget, use case, brand, or features. Examples that need clarification:
- "phones", "laptop", "shoes", "headphones", "show me electronics", "I want clothes"
When clarifying:
- Do NOT call any tools.
- Ask one short follow-up (max 2 sentences) with 2–4 concrete options. Pick options that map to filters you can apply later: budget bands (under ₹20k / 20–50k / 50k+), use case (gaming, work, travel), or feature (battery, camera, noise-cancelling).
- Example for "phones": "Sure — any budget or feature in mind? I can show flagships under ₹1.2L, mid-range around ₹25–50k, or budget 5G under ₹20k."
Skip clarification and act immediately when the request includes any of: a price ("under 30k"), a brand ("Samsung phones"), a use case ("phone for photography"), a descriptive concept ("something for travel"), or it's a follow-up that builds on prior context.

ACTIONS:
- search_products to find candidates by keyword (name/brand/tags)
- semantic_search when the query is descriptive or conceptual ("something to keep my coffee warm", "minimalist gift") — it finds products by meaning, not just keywords
- apply_filter to navigate /shop with filters
- open_product to route to a detail page
- add_to_cart / remove_from_cart for cart edits (use status="draft" for tentative picks)
- highlight to draw attention without changing state
- check_stock when stock matters

STYLE: be brief. Do, then narrate in 1-2 sentences. If a search hits zero, broaden it once before giving up.`;

const insertMessage = db.prepare(
    `INSERT INTO chat_messages (id, user_id, role, content, tool_calls, tool_call_id, tool_name, created_at)
   VALUES (@id, @user_id, @role, @content, @tool_calls, @tool_call_id, @tool_name, @created_at)`
);
const selectHistory = db.prepare(
    `SELECT * FROM chat_messages
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?`
);

function rowToApi(row) {
    return {
        id: row.id,
        role: row.role,
        content: row.content,
        toolCalls: row.tool_calls ? JSON.parse(row.tool_calls) : undefined,
        toolCallId: row.tool_call_id || undefined,
        toolName: row.tool_name || undefined,
        createdAt: row.created_at,
    };
}

function rowToGroq(row) {
    if (row.role === "tool") {
        return {
            role: "tool",
            tool_call_id: row.tool_call_id,
            name: row.tool_name,
            content: row.content || "",
        };
    }
    if (row.role === "assistant") {
        const out = { role: "assistant", content: row.content || "" };
        if (row.tool_calls) out.tool_calls = JSON.parse(row.tool_calls);
        return out;
    }
    return { role: row.role, content: row.content || "" };
}

function loadHistory(userId, limit = HISTORY_LIMIT) {
    const rows = selectHistory.all(userId, limit);
    rows.reverse();
    return rows;
}

function appendMessage(userId, msg) {
    const row = {
        id: createId("session"), // any unique id; using session domain since no message id domain is in HACKATHON.md
        user_id: userId,
        role: msg.role,
        content: msg.content ?? null,
        tool_calls: msg.toolCalls ? JSON.stringify(msg.toolCalls) : null,
        tool_call_id: msg.toolCallId || null,
        tool_name: msg.toolName || null,
        created_at: nowIso(),
    };
    insertMessage.run(row);
    return rowToApi(row);
}

async function broadcast(userId, event) {
    await bus.publish(bus.userChannel(userId), event);
}

async function runAgent({ userId, userMessage }) {
    if (!groq.isReady()) {
        const err = new Error("Agent unavailable: GROQ_API_KEY not configured");
        err.code = "agent_unavailable";
        throw err;
    }

    // 1. Persist + broadcast the user's turn first so other tabs see it immediately.
    const userTurn = appendMessage(userId, { role: "user", content: userMessage });
    await broadcast(userId, { type: "chat.message", message: userTurn, at: nowIso() });

    // 2. Build the prompt. SYSTEM + history + the just-saved user turn (already in history).
    const history = loadHistory(userId);
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map(rowToGroq),
    ];

    // 3. Tool-call loop.
    for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
        let completion;
        try {
            completion = await groq.complete({
                messages,
                tools: tools.allSchemas,
                toolChoice: "auto",
            });
        } catch (err) {
            // Llama 3.3 sometimes emits malformed tool_calls (e.g. <function=...>
            // syntax). Groq surfaces this as code "tool_use_failed". Recover by
            // re-asking without tools so we still ship a useful answer.
            const code =
                err?.error?.error?.code || err?.code || err?.body?.error?.code;
            if (code === "tool_use_failed") {
                console.warn("[agent] tool_use_failed — retrying without tools");
                completion = await groq.complete({ messages });
            } else {
                throw err;
            }
        }

        const choice = completion.choices?.[0];
        const assistant = choice?.message;
        if (!assistant) {
            throw new Error("Agent returned no message");
        }

        const toolCalls = assistant.tool_calls || [];
        const persisted = appendMessage(userId, {
            role: "assistant",
            content: assistant.content || "",
            toolCalls: toolCalls.length ? toolCalls : undefined,
        });
        await broadcast(userId, {
            type: "chat.message",
            message: persisted,
            at: nowIso(),
        });

        // Mirror what we persisted so subsequent iterations see the tool_calls.
        messages.push({
            role: "assistant",
            content: assistant.content || "",
            tool_calls: toolCalls.length ? toolCalls : undefined,
        });

        if (toolCalls.length === 0) {
            return { message: persisted };
        }

        // Run each tool, persist, broadcast, then loop with results appended.
        for (const call of toolCalls) {
            const args = call.function?.arguments;
            const name = call.function?.name;
            await broadcast(userId, {
                type: "chat.tool_call",
                toolCallId: call.id,
                name,
                arguments: args,
                at: nowIso(),
            });

            const result = await tools.runTool(name, args, { userId });
            const resultJson = JSON.stringify(result);
            const toolRow = appendMessage(userId, {
                role: "tool",
                toolCallId: call.id,
                toolName: name,
                content: resultJson,
            });
            await broadcast(userId, {
                type: "chat.tool_result",
                message: toolRow,
                at: nowIso(),
            });

            messages.push({
                role: "tool",
                tool_call_id: call.id,
                name,
                content: resultJson,
            });
        }
    }

    // Hit the iteration cap — return a soft message so the UI doesn't hang.
    const fallback = appendMessage(userId, {
        role: "assistant",
        content: "I tried a few searches but couldn't finalize an answer. Want to refine the request?",
    });
    await broadcast(userId, { type: "chat.message", message: fallback, at: nowIso() });
    return { message: fallback };
}

function listMessages(userId, limit = HISTORY_LIMIT) {
    return loadHistory(userId, limit).map(rowToApi);
}

const deleteMessages = db.prepare(
    "DELETE FROM chat_messages WHERE user_id = ?"
);

async function clearMessages(userId) {
    const result = deleteMessages.run(userId);
    await broadcast(userId, {
        type: "chat.cleared",
        deleted: result.changes,
        at: nowIso(),
    });
    return { deleted: result.changes };
}

module.exports = { runAgent, listMessages, clearMessages };
