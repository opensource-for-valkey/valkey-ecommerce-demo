// Rule-based NLU. Extracts intent + structured search params from raw text.
// Designed to be replaceable with an LLM call without changing callers.

// Category hints aligned with frontend categories (see src/data/categories.js).
// Nocturne & Co. category hints.
const CATEGORY_HINTS = {
  'fashion':               ['fashion', 'blazer', 'shirt', 'cargo pants', 'trousers', 'overshirt', 'linen', 'knit', 'wool tee', 'tailoring'],
  'gaming':                ['gaming', 'keyboard', 'mouse', 'mouse pad', 'mousepad', 'headset', 'monitor arm', 'gamer', 'mechanical keyboard', 'rgb'],
  'study-setup':           ['study', 'study setup', 'desk', 'desk lamp', 'lamp', 'chair', 'monitor stand', 'shelf', 'library shelf', 'blotter', 'workspace'],
  'tech-accessories':      ['tech', 'tech accessories', 'cable', 'cable organizer', 'usb-c', 'usb c', 'hub', 'mousepad', 'stylus', 'screen cloth'],
  'footwear':              ['shoe', 'shoes', 'footwear', 'derby', 'sneaker', 'loafer', 'slipper', 'boot', 'boots', 'oxford'],
  'streetwear':            ['streetwear', 'hoodie', 'tee', 't-shirt', 'track jacket', 'cap', 'five-panel', 'cross-body', 'bag'],
  'gift-ideas':            ['gift', 'gifts', 'gift idea', 'gift ideas', 'present', 'candle', 'candles', 'tea', 'teas', 'incense', 'writing set', 'gift card', 'pen', 'pens', 'fountain pen', 'ballpoint'],
  'monochrome-collection': ['monochrome', 'monochrome collection', 'all black', 'black tee', 'black coat', 'cashmere', 'flannel trouser', 'scarf'],
  'pantry':                ['pantry', 'grocery', 'groceries', 'food', 'edible', 'edibles', 'olive oil', 'oil', 'coffee', 'coffee beans', 'tea', 'oolong', 'honey', 'chocolate', 'spice', 'spices', 'cooking'],
};

// Themes that don't map to a single category but should bias multiple ones.
const THEME_HINTS = {
  gaming:   { kws: ['gaming', 'gamer', 'esports', 'fps', 'console gamer', 'rgb keyboard', 'mechanical keyboard'],
              categories: ['gaming'],
              tags: ['gaming', 'mechanical', 'rgb'] },
  study:    { kws: ['study', 'studying', 'student', 'school', 'college', 'university', 'desk setup', 'workspace', 'reading', 'reading lamp'],
              categories: ['study-setup', 'tech-accessories'],
              tags: ['desk', 'walnut', 'brass', 'lamp', 'organizer'] },
  monochrome: { kws: ['all black', 'monochrome', 'minimal', 'minimalist', 'all in black'],
                categories: ['monochrome-collection', 'fashion'],
                tags: ['black', 'monochrome'] },
  gifting:  { kws: ['gift', 'present', 'birthday', 'anniversary', 'housewarming', 'something nice'],
              categories: ['gift-ideas'],
              tags: ['gift', 'boxed'] },
  fashion:  { kws: ['fashion', 'outfit', 'wardrobe', 'tailoring', 'style', 'menswear', 'clothing'],
              categories: ['fashion', 'monochrome-collection', 'streetwear'],
              tags: ['fashion', 'wool', 'cotton', 'tailoring'] },
  // "Sports" doesn't map cleanly to any one Nocturne category, but running
  // shoes, sneakers, cleats live in Footwear and ergonomic gaming gear is
  // adjacent. Surface both rather than dead-ending the user.
  athletic: { kws: ['sports', 'sport', 'athletic', 'fitness', 'gym', 'workout', 'running', 'runner', 'jogging', 'cycling', 'soccer', 'football', 'basketball', 'tennis', 'training', 'yoga', 'cleats', 'trainers'],
              categories: ['footwear', 'gaming'],
              tags: ['footwear', 'athletic', 'running'] },
  // Office / workspace tech adjacent to study-setup but more functional.
  office:   { kws: ['office', 'wfh', 'work from home', 'work setup', 'productivity'],
              categories: ['tech-accessories', 'study-setup'],
              tags: ['office', 'desk', 'organizer'] },
  // Streetwear synonyms
  casual:   { kws: ['streetwear', 'casual', 'street', 'urban', 'hoodie', 'hoodies', 'tee', 'tees', 'cap', 'caps', 'sneaker', 'sneakers', 'sneakerhead', 'track jacket'],
              categories: ['streetwear', 'footwear'],
              tags: ['streetwear', 'hoodie', 'sneaker'] },
};

const STOPWORDS = new Set(['i','a','an','the','my','for','to','of','and','or','please','find','show','me','need','want','looking','some','any','that','this']);

function detectAge(text) {
  const m = text.match(/(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*(?:year|yr|y\.o\.?|years old)/i);
  if (m) return `${m[1]}-${m[2]}`;
  const single = text.match(/(\d{1,2})[\s-]?(?:year|yr|y\.?o\.?|years old)/i);
  if (single) {
    const n = parseInt(single[1], 10);
    return `${Math.max(0, n - 2)}-${n + 2}`;
  }
  if (/\b(kid|child|children|nephew|niece|son|daughter|boy|girl)\b/i.test(text)) return '6-14';
  if (/\bteen|teenager\b/i.test(text)) return '13-17';
  return null;
}

function detectBudget(text) {
  const t = text.toLowerCase();
  let m = t.match(/(?:between|from)\s*(?:rs\.?|inr|\$|₹|£|€)?\s*(\d{2,6})\s*(?:and|to|-)\s*(?:rs\.?|inr|\$|₹|£|€)?\s*(\d{2,6})/);
  if (m) return { minPrice: +m[1], maxPrice: +m[2] };
  m = t.match(/under\s*(?:rs\.?|inr|\$|₹|£|€)?\s*(\d{2,6})/);
  if (m) return { maxPrice: +m[1] };
  m = t.match(/below\s*(?:rs\.?|inr|\$|₹|£|€)?\s*(\d{2,6})/);
  if (m) return { maxPrice: +m[1] };
  m = t.match(/(?:rs\.?|inr|\$|₹|£|€)\s*(\d{2,6})\s*(?:budget|max|or less)/);
  if (m) return { maxPrice: +m[1] };
  m = t.match(/(?:over|above|more than)\s*(?:rs\.?|inr|\$|₹|£|€)?\s*(\d{2,6})/);
  if (m) return { minPrice: +m[1] };
  if (/\b(cheap|cheaper|budget|affordable|inexpensive|less expensive)\b/.test(t)) return { _hint: 'cheap' };
  if (/\b(premium|luxury|high.?end|flagship|expensive|pricier|pricey|more expensive|most expensive)\b/.test(t)) return { _hint: 'premium' };
  return {};
}

function detectIntent(text) {
  const t = text.toLowerCase();
  if (/\b(gift|present|birthday|anniversary)\b/.test(t)) return 'gift_search';
  if (/\bcompare\b/.test(t)) return 'compare';
  if (/\b(cheaper|under|below|budget|less expensive|less than)\b/.test(t)) return 'refine_budget';
  if (/\b(more expensive|pricier|expensive|premium|luxury|high.?end|flagship|best|top|highest rated|most expensive)\b/.test(t)) return 'refine_quality';
  if (/\b(similar|like that one|alternatives)\b/.test(t)) return 'find_similar';
  if (/\b(what about|how about|tell me more about)\b/.test(t)) return 'refine_focus';
  return 'product_search';
}

function detectCategories(text) {
  const t = ' ' + text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ') + ' ';
  const hits = new Set();
  for (const [cat, kws] of Object.entries(CATEGORY_HINTS)) {
    if (kws.some((kw) => t.includes(' ' + kw + ' '))) hits.add(cat);
  }
  // Themes (sports, gaming, music, study, party) add their bias categories.
  for (const theme of Object.values(THEME_HINTS)) {
    if (theme.kws.some((kw) => t.includes(' ' + kw + ' '))) {
      for (const c of theme.categories) hits.add(c);
    }
  }
  return Array.from(hits);
}

function detectThemes(text) {
  const t = ' ' + text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ') + ' ';
  const tags = new Set();
  const themes = [];
  for (const [name, theme] of Object.entries(THEME_HINTS)) {
    if (theme.kws.some((kw) => t.includes(' ' + kw + ' '))) {
      themes.push(name);
      for (const tag of theme.tags) tags.add(tag);
    }
  }
  return { themes, tags: Array.from(tags) };
}

function detectBrand(text) {
  const t = text.toLowerCase();
  const brands = ['apple','samsung','sony','dell','hp','lenovo','microsoft','asus','lg','bose','gopro','anker','jbl','sennheiser','canon','fujifilm','dji','insta360','google','amazon','philips','tcl','ring'];
  for (const b of brands) if (t.includes(b)) return b;
  return null;
}

function detectTags(text) {
  const t = text.toLowerCase();
  const tags = new Set();
  const tagKeywords = [
    'wireless','noise-cancel','premium','budget','gaming','student','office','ultrabook','m3','5g',
    'fitness','tracker','android','ios','oled','qled','4k','5k','retro','mechanical','audiophile',
    'smart-home','assistant','adventure','mirrorless','accessory','charger','magsafe','ssd','nvme',
    'ereader','tablet','headphone','earbuds'
  ];
  for (const kw of tagKeywords) if (t.includes(kw)) tags.add(kw);
  return Array.from(tags);
}

function keywords(text) {
  return text.toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w && !STOPWORDS.has(w));
}

function parse(text, prevContext = {}) {
  const intent = detectIntent(text);
  const budget = detectBudget(text);
  const ageGroup = detectAge(text) || prevContext.ageGroup || null;
  const categories = detectCategories(text);
  const baseTags = detectTags(text);
  const { themes, tags: themeTags } = detectThemes(text);
  const tags = Array.from(new Set([...baseTags, ...themeTags]));
  const kws = keywords(text);
  const brand = detectBrand(text);

  return {
    intent,
    query: text,
    keywords: kws,
    categories,
    tags,
    themes,
    brand,
    ageGroup,
    minPrice: budget.minPrice,
    maxPrice: budget.maxPrice,
    budgetHint: budget._hint || null,
    recipient: detectRecipient(text) || prevContext.recipient || null,
  };
}

function detectRecipient(text) {
  const m = text.match(/\b(nephew|niece|son|daughter|brother|sister|mom|mother|dad|father|wife|husband|friend|boyfriend|girlfriend|colleague|kid|child)\b/i);
  return m ? m[1].toLowerCase() : null;
}

module.exports = { parse };
