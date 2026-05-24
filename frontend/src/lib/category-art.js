// Hero image per Nocturne category.

const flickr = (q) => `https://loremflickr.com/640/360/${encodeURIComponent(q)}`;

export const CATEGORY_ART = {
  "fashion":                flickr("wool blazer flatlay"),
  "gaming":                 flickr("gaming keyboard rgb desk"),
  "study-setup":            flickr("walnut desk lamp study"),
  "tech-accessories":       flickr("leather desk accessory minimal"),
  "footwear":               flickr("leather dress shoes"),
  "streetwear":             flickr("hoodie streetwear urban"),
  "gift-ideas":             flickr("candle gift box minimal"),
  "monochrome-collection":  flickr("all black wardrobe minimal"),
};

export function artFor(slug) {
  return CATEGORY_ART[slug] || flickr("nocturne minimal");
}
