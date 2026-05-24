// Decides which tools to call given parsed NLU + previous context.
// Returns an ordered plan: [{ tool, args, reason }, ...]

// A refine intent continues the previous turn. Anything else (product_search,
// gift_search, find_similar) is a fresh query — prior categories/tags must NOT
// leak into it (otherwise "gift for boy into sports" inherits "food" from the
// last search).
const REFINE_INTENTS = new Set(['refine_budget', 'refine_quality', 'refine_focus']);

function mergeWithContext(parsed, prevContext) {
  if (!REFINE_INTENTS.has(parsed.intent)) {
    // Fresh query — keep only soft context (recipient, ageGroup) when the new
    // turn didn't supply its own; drop categories/tags/price entirely.
    return {
      ...parsed,
      recipient: parsed.recipient || prevContext.recipient || null,
      ageGroup: parsed.ageGroup || prevContext.ageGroup || null,
      categories: parsed.categories || [],
      tags: parsed.tags || [],
    };
  }
  const merged = { ...prevContext, ...parsed };
  const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : [];
  const newTags = Array.isArray(parsed.tags) ? parsed.tags : [];
  const prevCats = Array.isArray(prevContext.categories) ? prevContext.categories : [];
  const newCats = Array.isArray(parsed.categories) ? parsed.categories : [];

  // If the user switched categories on a refine (e.g. sports → food), the prior
  // tags ("fitness", "sports") would zero out the new category's results. Reset
  // tags when the category set changes meaningfully.
  const sameCats = newCats.length === 0
    || (newCats.length === prevCats.length && newCats.every((c) => prevCats.includes(c)));
  if (sameCats && (prevTags.length || newTags.length)) {
    merged.tags = Array.from(new Set([...prevTags, ...newTags]));
  } else {
    merged.tags = newTags;
  }

  if (parsed.intent !== 'refine_focus' && (prevCats.length || newCats.length)) {
    // Only carry prev categories forward if the new turn didn't pick a different
    // one. Otherwise (e.g., user said "actually show me headphones") replace.
    merged.categories = newCats.length ? newCats : prevCats;
  } else if (parsed.intent === 'refine_focus') {
    merged.categories = newCats.length ? newCats : prevCats;
  }
  return merged;
}

function applyBudgetHint(merged, prevContext) {
  // Nocturne & Co. catalogue ranges roughly £28..£684. Calibrate thresholds
  // so "cheap" returns the affordable end and "premium" returns the top tier.
  if (merged.budgetHint === 'cheap' && !merged.maxPrice) {
    const prevMax = (prevContext.maxPrice) || 150;
    merged.maxPrice = Math.max(30, Math.floor(prevMax * 0.6));
  }
  if (merged.budgetHint === 'premium' && !merged.minPrice) {
    const prevMin = (prevContext.minPrice) || 200;
    merged.minPrice = Math.max(200, prevMin);
  }
  return merged;
}

function plan(parsed, prevContext = {}, userPrefs = null) {
  const merged = applyBudgetHint(mergeWithContext(parsed, prevContext), prevContext);
  const steps = [];

  // Inject user preference biasing
  if (userPrefs && (!merged.categories || merged.categories.length === 0) && userPrefs.favoriteCategories?.length) {
    merged.categories = [...userPrefs.favoriteCategories];
    merged._preferenceApplied = true;
  }

  switch (parsed.intent) {
    case 'find_similar': {
      const baseId = prevContext.lastProductIds?.[0];
      if (baseId) steps.push({ tool: 'find_similar', args: { productId: baseId, limit: 6 }, reason: 'User asked for similar to last product' });
      else steps.push({ tool: 'semantic_search', args: { naturalLanguageQuery: parsed.query, limit: 6 }, reason: 'No prior anchor — fallback to semantic search' });
      break;
    }
    case 'refine_budget':
    case 'refine_quality':
    case 'refine_focus': {
      // Refines are price/quality directives, not product descriptions. If the
      // user typed "more expensive" alone, the word "expensive" shouldn't filter
      // product hay — drop the free-text so only the structured filters apply.
      // Keep query iff the user *also* mentioned a real noun beyond refine
      // keywords (heuristic: any kept tag survives).
      const refineWords = /\b(cheaper|under|below|budget|less|expensive|pricier|pricey|premium|luxury|flagship|best|top|highest|most|more|rated)\b/g;
      const queryStripped = String(merged.query || '').replace(refineWords, ' ').replace(/\s+/g, ' ').trim();
      const keepQuery = queryStripped.split(/\s+/).filter((w) => w.length >= 3).length > 0
        && (merged.categories || []).length === 0;
      const sortHint = parsed.intent === 'refine_budget'
        ? 'price-asc'
        : parsed.intent === 'refine_quality'
          ? 'price-desc'
          : 'relevance';
      steps.push({
        tool: 'search_products',
        args: stripUndefined({
          query: keepQuery ? queryStripped : '',
          categories: merged.categories,
          tags: merged.tags,
          minPrice: merged.minPrice,
          maxPrice: merged.maxPrice,
          minRating: parsed.intent === 'refine_quality' ? 4.5 : undefined,
          ageGroup: merged.ageGroup,
          sort: sortHint,
          limit: 8,
        }),
        reason: `Refining previous search (${parsed.intent})`,
      });
      break;
    }
    case 'gift_search':
    case 'product_search':
    default: {
      // If the user's whole query was a theme keyword ("sports", "running
      // shoes"), the literal tokens don't appear in any product hay and the
      // qToken filter zeroes the result. We strip the theme/synonym words
      // from the query when a theme was detected — categories+tags already
      // encode the intent.
      // Strip BOTH theme keywords AND category-hint keywords. Without this,
      // "groceries" (which maps to pantry via CATEGORY_HINTS) leaves the literal
      // token "groceries" in the qToken filter — and no product hay contains
      // that word, so the filter zeroes the results.
      const themeWords = /\b(sports?|athletic|fitness|gym|workout|running|runner|jogging|cycling|soccer|football|basketball|tennis|training|yoga|cleats|trainers|gaming|gamer|esports|fps|study|studying|student|school|college|university|workspace|reading|monochrome|minimal|minimalist|gift|gifts|present|birthday|fashion|outfit|wardrobe|tailoring|style|menswear|clothing|office|wfh|productivity|streetwear|casual|street|urban|hoodie|hoodies|tee|tees|cap|caps|sneaker|sneakers|sneakerhead|track|jacket|shoes|shoe|grocery|groceries|food|edible|edibles|pantry|cooking)\b/gi;
      const hasTheme = Array.isArray(merged.themes) && merged.themes.length > 0;
      const hasCategoryMatch = Array.isArray(merged.categories) && merged.categories.length > 0;
      const shouldStrip = hasTheme || hasCategoryMatch;
      const queryStripped = shouldStrip
        ? String(merged.query || '').replace(themeWords, ' ').replace(/\s+/g, ' ').trim()
        : String(merged.query || '');
      const hasMeaningfulRemainder = queryStripped.split(/\s+/).filter((w) => w.length >= 3).length > 0;

      steps.push({
        tool: 'search_products',
        args: stripUndefined({
          query: hasMeaningfulRemainder ? queryStripped : '',
          categories: merged.categories,
          tags: merged.tags,
          minPrice: merged.minPrice,
          maxPrice: merged.maxPrice,
          ageGroup: merged.ageGroup,
          limit: 8,
        }),
        reason: 'Primary structured search using extracted filters',
      });
      // Semantic search uses a tiny fixed embedding space (kids/premium/etc).
      // For theme-driven queries ("sports", "gaming", "study") that don't have
      // a matching axis, semantic recall pulls in unrelated premium products —
      // skip it and rely on the structured filter.
      if (!hasTheme) {
        steps.push({
          tool: 'semantic_search',
          args: { naturalLanguageQuery: merged.query, limit: 8 },
          reason: 'Semantic recall to catch intent the filters missed',
        });
      }
      break;
    }
  }

  return { steps, merged };
}

function stripUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

module.exports = { plan, mergeWithContext };
