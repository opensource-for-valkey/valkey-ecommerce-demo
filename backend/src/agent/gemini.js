// Optional Gemini-backed NLU. Falls back silently if no key or on error.
const config = require('../config');

const ENDPOINT = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

const SYSTEM_PROMPT = `You are an e-commerce search query parser.
Return STRICT JSON only (no prose) with this exact shape:
{
  "intent": "product_search" | "gift_search" | "refine_budget" | "refine_quality" | "refine_focus" | "find_similar" | "compare",
  "categories": string[],
  "tags": string[],
  "ageGroup": string|null,
  "minPrice": number|null,
  "maxPrice": number|null,
  "recipient": string|null,
  "budgetHint": "cheap" | "premium" | null
}
Use lowercase tags. Categories MUST be from this exact set: fashion, gaming, study-setup, tech-accessories, footwear, streetwear, gift-ideas, monochrome-collection.
This is the Nocturne & Co. catalogue: curated fashion (blazers, shirts, trousers, knits), gaming (keyboards, mice, headsets, monitor arms), study setup (desk lamps, chairs, monitor stands, shelves), tech accessories (cable organisers, USB-C hubs, leather mousepads), footwear (derbys, sneakers, loafers, boots), streetwear (hoodies, tees, track jackets, caps), gift ideas (candles, tea, writing sets), and a monochrome collection (all-black tees, coats, scarves).
Rules:
- If the user mentions gaming, set categories to ["gaming"] and add tag "gaming".
- If the user mentions a study / desk / workspace setup, use ["study-setup","tech-accessories"].
- For "all black" / monochrome / minimalist, use ["monochrome-collection","fashion"].
- For a gift / present, use ["gift-ideas"].
- For shoes/boots/sneakers/loafers, use ["footwear"].
- Do NOT inherit categories from "Previous context" if the new topic differs. Carry only price/age when the user says "cheaper" or "under £X".
- If the request is for an item type the catalogue clearly doesn't carry (e.g., food, beverages, electronics like phones/laptops/TVs, jewelry, cars, pets), return categories: [] and tags: [] — leave it to the explainer to say so.
Prices are GBP (typical range £28–£684).`;

async function geminiParse(message, prevContext = {}) {
  if (!config.geminiKey) return null;
  try {
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            { text: `Previous context: ${JSON.stringify(prevContext)}` },
            { text: `User message: ${message}` },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
    };
    const res = await fetch(ENDPOINT(config.geminiModel, config.geminiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`gemini ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    return { ...parsed, query: message };
  } catch (e) {
    console.warn('[gemini] fallback to rule-based:', e.message);
    return null;
  }
}

module.exports = { geminiParse };
