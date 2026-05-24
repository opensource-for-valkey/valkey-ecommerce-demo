// Groq client wrapper. We expose only what the agent loop needs and centralize
// the model id so it's swappable via env without touching call sites.

const Groq = require("groq-sdk").default || require("groq-sdk");

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

let client = null;
if (apiKey) {
    client = new Groq({ apiKey });
} else {
    console.warn("[groq] GROQ_API_KEY missing — /api/agent/chat will return 503");
}

function isReady() {
    return !!client;
}

async function complete({ messages, tools, toolChoice = "auto", temperature = 0.2 }) {
    if (!client) throw new Error("Groq client not configured");
    const params = { model, messages, temperature };
    if (tools && tools.length > 0) {
        params.tools = tools;
        params.tool_choice = toolChoice;
    }
    return client.chat.completions.create(params);
}

module.exports = { isReady, complete, model };
