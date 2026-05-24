// Local vector similarity over toy 8-dim embeddings stored in Valkey hash.
// Axes (kept stable across catalogs):
//   [science, electronics, kids, educational, audio, fashion, home, premium]
const productService = require('../services/product.service');

const AXES = ['science', 'electronics', 'kids', 'educational', 'audio', 'fashion', 'home', 'premium'];

function embedQuery(text = '') {
  const t = text.toLowerCase();
  const v = AXES.map((axis) => {
    if (axis === 'science' && /\b(science|stem|chemistry|physics|astronomy|experiment|telescope|microscope)\b/.test(t)) return 1.0;
    if (axis === 'electronics' && /\b(electronic|gadget|tech|tablet|phone|iphone|galaxy|laptop|macbook|camera|charger|wireless|smart|router|monitor|tv|ssd|drone|gopro|airpods)\b/.test(t)) return 1.0;
    if (axis === 'kids' && /\b(kid|kids|child|children|nephew|niece|son|daughter|boy|girl|teen|young|10-year|10 year)\b/.test(t)) return 1.0;
    if (axis === 'educational' && /\b(educational|learn|learning|study|school|student|teach)\b/.test(t)) return 1.0;
    if (axis === 'audio' && /\b(headphone|earbud|speaker|audio|music|sound|noise.?cancel|airpods)\b/.test(t)) return 1.0;
    if (axis === 'fashion' && /\b(fashion|watch|sunglass|style|outfit|accessory|wearable)\b/.test(t)) return 1.0;
    if (axis === 'home' && /\b(home|kitchen|cook|decor|smart.?home|hue|nest|tv|router|doorbell|wellness|fitness|yoga)\b/.test(t)) return 1.0;
    if (axis === 'premium' && /\b(premium|luxury|best|top|flagship|high.?end|gift|pro|ultra)\b/.test(t)) return 0.7;
    return 0;
  });
  return v;
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function semanticSearch({ naturalLanguageQuery, limit = 8 }) {
  const qv = embedQuery(naturalLanguageQuery || '');
  // Zero embedding = query didn't touch any axis the embedder knows about
  // (e.g., "leather sofa"). Returning the top-N by ties is just noise — bail.
  if (qv.every((v) => v === 0)) return [];

  const embeddings = await productService.getAllEmbeddings();
  const all = await productService.getAllProducts();
  const byId = new Map(all.map((p) => [p.productId, p]));

  const scored = [];
  for (const [pid, vec] of Object.entries(embeddings)) {
    const p = byId.get(pid);
    if (!p) continue;
    const sim = cosine(qv, vec);
    if (sim <= 0) continue; // skip products with no axis overlap
    scored.push({ product: p, sim });
  }
  scored.sort((a, b) => b.sim - a.sim);
  return scored.slice(0, limit).map((s) => ({ ...s.product, _score: s.sim }));
}

module.exports = { semanticSearch, embedQuery, cosine };
