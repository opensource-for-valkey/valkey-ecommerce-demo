// Builds per-product explanations + overall response + follow-up.

function inr(n) {
  return `£${Number(n).toLocaleString('en-GB')}`;
}

function explainProduct(product, ctx) {
  const reasons = [];
  if (ctx.ageGroup && product.ageGroup && product.ageGroup.includes(ctx.ageGroup.split('-')[0])) {
    reasons.push(`age-appropriate (${product.ageGroup})`);
  }
  if (ctx.tags && ctx.tags.length) {
    const overlap = product.tags.filter((t) => ctx.tags.includes(t));
    if (overlap.length) reasons.push(`matches your interests: ${overlap.slice(0, 3).join(', ')}`);
  }
  if (ctx.categories && ctx.categories.length) {
    if (ctx.categories.some((c) => product.category.includes(c) || product.tags.includes(c))) {
      reasons.push(`in the ${product.category.replace('-', ' / ')} category`);
    }
  }
  if (product.rating >= 4.6) reasons.push(`highly rated (${product.rating}★)`);
  if (ctx.maxPrice && product.price <= ctx.maxPrice) reasons.push(`fits your budget (${inr(product.price)})`);
  if (ctx.budgetHint === 'cheap' && product.price < 3000) reasons.push('a budget-friendly pick');
  if (ctx.budgetHint === 'premium' && product.price > 10000) reasons.push('a premium choice');

  if (reasons.length === 0) reasons.push(`relevant to "${ctx.query.slice(0, 40)}"`);
  return reasons.join(' · ');
}

function buildResponse(ctx, products) {
  if (!products.length) {
    const q = (ctx.query || '').trim();
    const focus = Array.isArray(ctx.categories) && ctx.categories.length
      ? ctx.categories.map((c) => c.replace(/-/g, ' ')).join(', ')
      : null;
    const summary = focus
      ? `We don't have any ${focus} pieces matching "${q.slice(0, 60)}" right now.`
      : `Sorry — that isn't in the Nocturne & Co. catalogue right now. We curate fashion, footwear, streetwear, gaming, study setup, tech accessories, gift ideas, and the monochrome collection.`;
    return {
      summary,
      notInCatalog: true,
      followUp: 'Want to try a different category (e.g. sports, stationery, food, headphones) or a broader keyword?',
    };
  }
  const topTags = uniqueTopTags(products);
  let summary;
  if (ctx.intent === 'gift_search') {
    const theme = (ctx.themes && ctx.themes[0]) || null;
    const focus = theme
      ? `${theme} interests`
      : (Array.isArray(ctx.categories) && ctx.categories.length
          ? ctx.categories.slice(0, 2).map((c) => c.replace(/-/g, ' ')).join(' and ')
          : topTags.slice(0, 2).join(', '));
    summary = `Here are gift ideas${ctx.recipient ? ` for your ${ctx.recipient}` : ''}${ctx.ageGroup ? ` (age ${ctx.ageGroup})` : ''}${focus ? `, focused on ${focus}` : ''}.`;
  } else if (ctx.intent === 'refine_budget') {
    summary = `Cheaper options${ctx.maxPrice ? ` under ${inr(ctx.maxPrice)}` : ''} — same vibe, smaller price tag.`;
  } else if (ctx.intent === 'refine_quality') {
    summary = `Top-rated picks (4.5★ and above) matching your last search.`;
  } else if (ctx.intent === 'find_similar') {
    summary = `Products similar to your last pick.`;
  } else {
    summary = `Found ${products.length} matches. Top picks shown by relevance.`;
  }

  const followUp = buildFollowUp(ctx, products);
  return { summary, followUp };
}

function buildFollowUp(ctx, products) {
  const choices = [];
  if (!ctx.maxPrice && !ctx.budgetHint) choices.push('a budget');
  if (products.length > 1 && !ctx.tags?.includes('astronomy') && ctx.intent === 'gift_search') choices.push('a specific area (astronomy, chemistry, robotics)');
  if (!ctx.ageGroup && ctx.intent === 'gift_search') choices.push('the recipient\'s age');
  if (choices.length === 0) {
    return 'Want me to show cheaper alternatives, premium picks, or filter to a specific category?';
  }
  return `Would you like me to filter by ${choices.join(', or ')}?`;
}

function uniqueTopTags(products) {
  const counts = {};
  for (const p of products) for (const t of p.tags) counts[t] = (counts[t] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]);
}

module.exports = { explainProduct, buildResponse };
