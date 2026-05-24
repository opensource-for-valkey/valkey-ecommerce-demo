import crypto from "node:crypto";
import type { Redis } from "ioredis";
import { fullTextSearch } from "./engagement";
import { ApiError } from "./errors";
import type { Product } from "./types";

const CONVERSATION_TTL_SECONDS = 1800;

interface AgentSearchParams {
  keywords: string[];
  categoryIds: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
}

interface AgentTurn {
  role: "user" | "agent";
  content: string;
  timestamp: string;
  searchParams?: AgentSearchParams;
  results?: string[];
}

interface AgentConversation {
  sessionId: string;
  turns: AgentTurn[];
}

export function conversationKey(sessionId: string): string {
  return `conversation:${sessionId}`;
}

export async function agentSearch(client: Redis, input: { sessionId?: string; message?: unknown }) {
  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (!message) {
    throw new ApiError(400, "missing_message", "message is required.");
  }
  const sessionId = input.sessionId || `sess_${crypto.randomUUID()}`;
  const conversation = await getConversation(client, sessionId);
  const previous = [...conversation.turns].reverse().find((turn) => turn.role === "agent" && turn.searchParams)?.searchParams;
  const searchParams = interpretMessage(message, previous);
  const query = searchParams.keywords.join(" ");
  const search = await fullTextSearch(client, {
    q: query,
    categoryId: searchParams.categoryIds[0],
    minPrice: searchParams.minPrice ?? undefined,
    maxPrice: searchParams.maxPrice ?? undefined,
    sort: searchParams.maxPrice ? "price_asc" : "relevance",
    pageSize: 6,
  });
  const results = search.results.map((result: { product: Product }) => ({
    productId: result.product.id,
    name: result.product.name,
    price: result.product.price.amount,
    currency: result.product.price.currency,
    image: result.product.images[0]?.url,
    reason: reasonFor(result.product, searchParams),
  }));
  const response = responseFor(message, results.length);
  const followUp = results.length > 0 ? "Want me to narrow this by budget, category, or delivery availability?" : "Try a broader product type or remove the price filter.";
  const now = new Date().toISOString();

  conversation.turns.push({ role: "user", content: message, timestamp: now });
  conversation.turns.push({
    role: "agent",
    content: response,
    timestamp: now,
    searchParams,
    results: results.map((result) => result.productId),
  });
  await client.call("JSON.SET", conversationKey(sessionId), "$", JSON.stringify(conversation));
  await client.expire(conversationKey(sessionId), CONVERSATION_TTL_SECONDS);

  return {
    sessionId,
    response,
    intent: "product_search",
    followUp,
    searchParams,
    results,
    context: { intent: "product_search", refinements_available: true, turns: conversation.turns.length },
  };
}

export async function getConversation(client: Redis, sessionId: string): Promise<AgentConversation> {
  const raw = await client.call("JSON.GET", conversationKey(sessionId), "$");
  if (!raw || typeof raw !== "string") {
    return { sessionId, turns: [] };
  }
  return (JSON.parse(raw) as AgentConversation[])[0] ?? { sessionId, turns: [] };
}

export async function getExistingConversation(client: Redis, sessionId: string): Promise<AgentConversation | null> {
  const raw = await client.call("JSON.GET", conversationKey(sessionId), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as AgentConversation[])[0] ?? null;
}

export async function recordAgentFeedback(
  client: Redis,
  input: { sessionId?: unknown; productId?: unknown; vote?: unknown }
): Promise<void> {
  if (typeof input.sessionId !== "string" || typeof input.productId !== "string" || !["up", "down"].includes(String(input.vote))) {
    throw new ApiError(400, "invalid_feedback", "sessionId, productId and vote (up|down) are required.");
  }
  await client.hincrby(`agent_feedback:${input.productId}`, String(input.vote), 1);
}

function interpretMessage(message: string, previous?: AgentSearchParams): AgentSearchParams {
  const lower = message.toLowerCase();
  const params: AgentSearchParams = previous && /cheaper|less|lower|show more|more options/.test(lower)
    ? { ...previous, keywords: [...previous.keywords] }
    : { keywords: [], categoryIds: [], minPrice: null, maxPrice: null, minRating: null };

  const price = lower.match(/(?:under|below|less than|within)\s*(?:rs\.?|₹|inr)?\s*([0-9,]+)/);
  if (price) {
    params.maxPrice = Number(price[1].replaceAll(",", ""));
  } else if (/cheaper|less|lower/.test(lower) && previous?.maxPrice) {
    params.maxPrice = Math.max(500, Math.floor(previous.maxPrice * 0.75));
  }

  if (/audio|music|headphone|sound/.test(lower)) params.keywords.push("audio", "headphones");
  if (/keyboard|typing|keys/.test(lower)) params.keywords.push("keyboard", "typing");
  if (/mouse|cursor/.test(lower)) params.keywords.push("mouse");
  if (/travel|bag|backpack|charger|bottle/.test(lower)) params.keywords.push("travel");
  if (/desk|office|work|workspace|lamp|stand/.test(lower)) params.keywords.push("desk", "workspace");
  if (/gift|nephew|science|kid/.test(lower)) params.keywords.push("notebook", "smart", "lamp");

  if (params.keywords.length === 0) {
    params.keywords = lower.split(/[^a-z0-9]+/).filter((token) => token.length > 2).slice(0, 6);
  }
  return params;
}

function reasonFor(product: Product, params: AgentSearchParams): string {
  const reasons = [];
  const haystack = `${product.name} ${product.tags.join(" ")} ${product.description}`.toLowerCase();
  const matchingKeyword = params.keywords.find((keyword) => haystack.includes(keyword));
  if (matchingKeyword) reasons.push(`matches "${matchingKeyword}"`);
  if (params.maxPrice && product.price.amount <= params.maxPrice) reasons.push("within your budget");
  if (product.ratings.average >= 4.5) reasons.push(`highly rated at ${product.ratings.average}`);
  if (product.inventory.quantity - product.inventory.reserved > 0) reasons.push("available now");
  return reasons.length > 0 ? `Recommended because it is ${reasons.join(", ")}.` : "Recommended from the Valkey catalog ranking.";
}

function responseFor(message: string, count: number): string {
  if (count === 0) return "I could not find a strong match with those filters.";
  if (/gift|nephew|kid/.test(message.toLowerCase())) {
    return "I found giftable products with practical utility and strong ratings.";
  }
  return "Here are the best matching products from the Valkey-powered catalog.";
}
