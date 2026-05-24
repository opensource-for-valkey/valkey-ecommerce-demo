import type { Redis } from "ioredis";
import { AD_FIXTURES } from "./fixtures";
import { ApiError } from "./errors";
import { getProduct, listProducts } from "./store";
import type { AdCreative, Product } from "./types";

export const FULL_TEXT_INDEX = "idx:products_fulltext";
export const AUTOCOMPLETE_KEY = "autocomplete:products";

const TRENDING_WINDOWS = {
  "1h": 3600,
  "6h": 21600,
  "24h": 86400,
} as const;

const TRENDING_WEIGHTS = {
  view: 1,
  add_to_cart: 3,
  purchase: 5,
} as const;

const PRICE_BUCKETS = [
  { range: "0-1000", min: 0, max: 1000 },
  { range: "1000-2500", min: 1000, max: 2500 },
  { range: "2500-5000", min: 2500, max: 5000 },
  { range: "5000+", min: 5000, max: Infinity },
];

const STOPWORDS = new Set(["a", "an", "the", "and", "or", "of", "with", "for", "to", "in", "on"]);

type TrendingAction = keyof typeof TRENDING_WEIGHTS;
type TrendingWindow = keyof typeof TRENDING_WINDOWS;

interface FullTextSearchOptions {
  q?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export function trendingGlobalKey(window: string): string {
  return `trending:global:${window}`;
}

export function trendingCategoryKey(categoryId: string, window: string): string {
  return `trending:category:${categoryId}:${window}`;
}

export function adKey(adId: string): string {
  return adId;
}

export function adCategoryKey(categoryId: string): string {
  return `ads:category:${categoryId}`;
}

export function adKeywordKey(keyword: string): string {
  return `ads:keyword:${normalizeKeyword(keyword)}`;
}

export async function seedEngagement(client: Redis): Promise<void> {
  await seedAds(client);
  const products = await listProducts(client);
  await ensureFullTextSearchIndex(client);
  await seedAutocomplete(client, products);

  const pipeline = client.pipeline();
  for (const product of products) {
    const score = 1;
    pipeline.zadd(trendingGlobalKey("24h"), score, product.id);
    pipeline.zadd(trendingGlobalKey("6h"), score, product.id);
    pipeline.zadd(trendingGlobalKey("1h"), score, product.id);
    pipeline.zadd(trendingCategoryKey(product.categoryId, "24h"), score, product.id);
  }
  await pipeline.exec();
}

export async function seedAds(client: Redis): Promise<void> {
  for (const ad of AD_FIXTURES) {
    await saveAd(client, ad);
  }
}

export async function recordTrendingEvent(
  client: Redis,
  input: { productId: string; action: TrendingAction; categoryId?: string }
): Promise<void> {
  const product = await getProduct(client, input.productId);
  if (!product || product.status !== "active") {
    throw new ApiError(404, "product_not_found", "Product was not found.");
  }

  const categoryId = input.categoryId ?? product.categoryId;
  const weight = TRENDING_WEIGHTS[input.action];
  const now = Date.now();
  const date = new Date().toISOString().slice(0, 10);
  const pipeline = client.pipeline();
  for (const [window, ttl] of Object.entries(TRENDING_WINDOWS)) {
    pipeline.zincrby(trendingGlobalKey(window), weight, input.productId);
    pipeline.expire(trendingGlobalKey(window), ttl);
    pipeline.zincrby(trendingCategoryKey(categoryId, window), weight, input.productId);
    pipeline.expire(trendingCategoryKey(categoryId, window), ttl);
  }
  pipeline.zadd(`product_events:${date}`, now, `${now}:${input.action}:${input.productId}`);
  pipeline.expire(`product_events:${date}`, 86400 * 2);
  await pipeline.exec();
}

export async function trendingProducts(
  client: Redis,
  input: { window?: string; categoryId?: string; limit?: number } = {}
) {
  const window = isTrendingWindow(input.window) ? input.window : "1h";
  const limit = Math.min(50, Math.max(1, input.limit ?? 10));
  const key = input.categoryId ? trendingCategoryKey(input.categoryId, window) : trendingGlobalKey(window);
  const rows = await client.zrevrange(key, 0, limit - 1, "WITHSCORES");
  const items = [];
  for (let index = 0; index < rows.length; index += 2) {
    const product = await getProduct(client, rows[index]);
    if (product) {
      items.push({ product, score: Number(rows[index + 1]) });
    }
  }
  return { window, categoryId: input.categoryId, products: items };
}

export async function saveAd(client: Redis, ad: AdCreative): Promise<AdCreative> {
  if (!ad.id || typeof ad.bidAmount !== "number") {
    throw new ApiError(400, "invalid_ad", "Ad id and bidAmount are required.");
  }
  await client.call("JSON.SET", adKey(ad.id), "$", JSON.stringify(ad));
  const pipeline = client.pipeline();
  for (const categoryId of ad.targetCategories) {
    pipeline.zadd(adCategoryKey(categoryId), ad.bidAmount, ad.id);
  }
  for (const keyword of ad.targetKeywords) {
    pipeline.zadd(adKeywordKey(keyword), ad.bidAmount, ad.id);
  }
  await pipeline.exec();
  return ad;
}

export async function getAd(client: Redis, adId: string): Promise<AdCreative | null> {
  const raw = await client.call("JSON.GET", adKey(adId), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as AdCreative[])[0] ?? null;
}

export async function selectAds(
  client: Redis,
  input: { categoryId?: string; keywords?: string[]; userId?: string; limit?: number }
): Promise<AdCreative[]> {
  const candidates = new Map<string, number>();
  const collect = async (key: string) => {
    const rows = await client.zrevrange(key, 0, 49, "WITHSCORES");
    for (let index = 0; index < rows.length; index += 2) {
      candidates.set(rows[index], Math.max(candidates.get(rows[index]) ?? 0, Number(rows[index + 1])));
    }
  };

  if (input.categoryId) {
    await collect(adCategoryKey(input.categoryId));
  }
  for (const keyword of input.keywords ?? []) {
    await collect(adKeywordKey(keyword));
  }
  if (candidates.size === 0) {
    for (const ad of AD_FIXTURES) {
      candidates.set(ad.id, ad.bidAmount);
    }
  }

  const date = today();
  const winners: AdCreative[] = [];
  for (const adId of [...candidates.entries()].sort((left, right) => right[1] - left[1]).map(([id]) => id)) {
    if (winners.length >= Math.min(10, input.limit ?? 3)) break;
    const ad = await getAd(client, adId);
    if (!ad || ad.status !== "active") continue;

    const spend = Number(await client.get(adSpendKey(ad.id, date))) || 0;
    if (ad.dailyBudget > 0 && spend + ad.bidAmount > ad.dailyBudget) continue;

    if (input.userId) {
      const frequency = Number(await client.get(adFrequencyKey(input.userId, ad.id, date))) || 0;
      if (frequency >= 3) continue;
    }
    winners.push(ad);
  }

  return winners;
}

export async function recordAdImpression(client: Redis, adId: string, userId?: string): Promise<void> {
  const ad = await getAd(client, adId);
  if (!ad) {
    throw new ApiError(404, "ad_not_found", "Ad was not found.");
  }
  const date = today();
  const pipeline = client.pipeline();
  pipeline.incr(adImpressionsKey(adId, date));
  pipeline.expire(adImpressionsKey(adId, date), 86400);
  pipeline.incrby(adSpendKey(adId, date), ad.bidAmount);
  pipeline.expire(adSpendKey(adId, date), 86400);
  if (userId) {
    pipeline.incr(adFrequencyKey(userId, adId, date));
    pipeline.expire(adFrequencyKey(userId, adId, date), 86400);
  }
  await pipeline.exec();
}

export async function recordAdClick(client: Redis, adId: string, userId?: string): Promise<void> {
  const ad = await getAd(client, adId);
  if (!ad) {
    throw new ApiError(404, "ad_not_found", "Ad was not found.");
  }
  const date = today();
  const pipeline = client.pipeline();
  pipeline.incr(adClicksKey(adId, date));
  pipeline.expire(adClicksKey(adId, date), 86400);
  if (userId) {
    pipeline.incr(adFrequencyKey(userId, adId, date));
    pipeline.expire(adFrequencyKey(userId, adId, date), 86400);
  }
  await pipeline.exec();
}

export async function adStats(client: Redis, adId: string, date = today()) {
  const [impressions, clicks, spend] = await Promise.all([
    client.get(adImpressionsKey(adId, date)),
    client.get(adClicksKey(adId, date)),
    client.get(adSpendKey(adId, date)),
  ]);
  const impressionCount = Number(impressions) || 0;
  const clickCount = Number(clicks) || 0;
  return {
    adId,
    date,
    impressions: impressionCount,
    clicks: clickCount,
    ctr: impressionCount > 0 ? clickCount / impressionCount : 0,
    spend: Number(spend) || 0,
  };
}

export async function ensureFullTextSearchIndex(client: Redis): Promise<boolean> {
  try {
    await client.call("FT.INFO", FULL_TEXT_INDEX);
    return true;
  } catch {
    // Continue to create below. Valkey bundle versions differ in error wording.
  }

  try {
    await client.call(
      "FT.CREATE",
      FULL_TEXT_INDEX,
      "ON",
      "JSON",
      "PREFIX",
      "1",
      "product:",
      "SCHEMA",
      "$.name",
      "AS",
      "name",
      "TEXT",
      "WEIGHT",
      "5.0",
      "$.description",
      "AS",
      "description",
      "TEXT",
      "$.brand",
      "AS",
      "brand",
      "TAG",
      "$.categoryId",
      "AS",
      "categoryId",
      "TAG",
      "$.price.amount",
      "AS",
      "price",
      "NUMERIC",
      "$.ratings.average",
      "AS",
      "rating",
      "NUMERIC"
    );
    return true;
  } catch {
    return false;
  }
}

export async function fullTextSearch(client: Redis, options: FullTextSearchOptions = {}) {
  const products = await listProducts(client);
  const pageSize = Math.max(1, Math.min(50, options.pageSize ?? 20));
  const page = Math.max(1, options.page ?? 1);
  const tokens = tokenize(options.q ?? "");

  const scored = products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter(({ product, score }) => tokens.length === 0 || score > 0)
    .filter(({ product }) => !options.categoryId || product.categoryId === options.categoryId)
    .filter(({ product }) => !options.brand || product.brand.toLowerCase() === options.brand.toLowerCase())
    .filter(({ product }) => options.minPrice === undefined || product.price.amount >= options.minPrice)
    .filter(({ product }) => options.maxPrice === undefined || product.price.amount <= options.maxPrice);

  const facets = searchFacets(scored.map(({ product }) => product));
  const sorted = scored.sort(sortSearch(options.sort));
  const total = sorted.length;
  const start = (page - 1) * pageSize;

  return {
    query: options.q ?? "",
    total,
    page,
    pageSize,
    results: sorted.slice(start, start + pageSize).map(({ product, score }) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      categoryId: product.categoryId,
      price: product.price,
      ratings: product.ratings,
      image: product.images[0]?.url,
      score,
      product,
    })),
    facets,
    backend: (await ensureFullTextSearchIndex(client)) ? "valkey-search" : "in-memory",
  };
}

export async function searchSuggestions(client: Redis, query: string, limit = 5) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const products = await listProducts(client);
  return products
    .map((product) => ({
      product,
      score: suggestionTokens(product).some((token) => token === normalized)
        ? 100
        : suggestionTokens(product).some((token) => token.startsWith(normalized))
          ? 90
          : product.name.toLowerCase().startsWith(normalized)
            ? 70
            : product.tags.some((tag) => tag === normalized)
              ? 60
              : product.tags.some((tag) => tag.startsWith(normalized) || tag.includes(normalized))
                ? 50
                : product.name.toLowerCase().includes(normalized)
                  ? 30
                  : 0,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.product.name.localeCompare(right.product.name))
    .slice(0, limit)
    .map(({ product }) => ({ name: product.name, productId: product.id }));
}

function suggestionTokens(product: Product): string[] {
  return product.name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && token !== "valkey");
}

export async function seedAutocomplete(client: Redis, products: Product[]): Promise<void> {
  for (const product of products) {
    try {
      await client.call("FT.SUGADD", AUTOCOMPLETE_KEY, product.name, String(product.ratings.count || 1));
    } catch {
      return;
    }
  }
}

function scoreProduct(product: Product, tokens: string[]): number {
  if (tokens.length === 0) return 1;
  const fields = [
    { text: product.name, weight: 5 },
    { text: product.description, weight: 2 },
    { text: product.brand, weight: 3 },
    { text: product.tags.join(" "), weight: 3 },
    { text: Object.values(product.attributes).join(" "), weight: 1 },
  ];
  let score = 0;
  for (const token of tokens) {
    for (const field of fields) {
      for (const candidate of tokenize(field.text)) {
        if (candidate === token) score += field.weight * 2;
        else if (candidate.startsWith(token) || token.startsWith(candidate)) score += field.weight;
        else if (candidate.length >= 4 && editDistance(candidate, token) <= 1) score += field.weight * 0.5;
      }
    }
  }
  return score + product.ratings.average / 10;
}

function sortSearch(sort?: string) {
  return (left: { product: Product; score: number }, right: { product: Product; score: number }) => {
    if (sort === "price_asc") return left.product.price.amount - right.product.price.amount;
    if (sort === "price_desc") return right.product.price.amount - left.product.price.amount;
    if (sort === "rating") return right.product.ratings.average - left.product.ratings.average;
    if (sort === "newest") return right.product.createdAt.localeCompare(left.product.createdAt);
    return right.score - left.score;
  };
}

function searchFacets(products: Product[]) {
  const brands = countBy(products, (product) => product.brand);
  const categories = countBy(products, (product) => product.categoryId);
  const priceRanges = new Map<string, number>();
  for (const product of products) {
    const bucket = PRICE_BUCKETS.find((candidate) => product.price.amount >= candidate.min && product.price.amount < candidate.max);
    if (bucket) priceRanges.set(bucket.range, (priceRanges.get(bucket.range) ?? 0) + 1);
  }
  return {
    brands: [...brands.entries()].map(([name, count]) => ({ name, count })),
    categories: [...categories.entries()].map(([id, count]) => ({ id, count })),
    priceRanges: PRICE_BUCKETS.map((bucket) => ({ range: bucket.range, count: priceRanges.get(bucket.range) ?? 0 })),
  };
}

function countBy<T>(items: T[], getKey: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));
}

function editDistance(left: string, right: string): number {
  const dp = Array.from({ length: left.length + 1 }, (_, row) => Array.from({ length: right.length + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)));
  for (let row = 1; row <= left.length; row += 1) {
    for (let col = 1; col <= right.length; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      dp[row][col] = Math.min(dp[row - 1][col] + 1, dp[row][col - 1] + 1, dp[row - 1][col - 1] + cost);
    }
  }
  return dp[left.length][right.length];
}

function isTrendingWindow(window: unknown): window is TrendingWindow {
  return typeof window === "string" && Object.prototype.hasOwnProperty.call(TRENDING_WINDOWS, window);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().trim();
}

function adImpressionsKey(adId: string, date: string): string {
  return `ad_impressions:${adId}:${date}`;
}

function adClicksKey(adId: string, date: string): string {
  return `ad_clicks:${adId}:${date}`;
}

function adSpendKey(adId: string, date: string): string {
  return `ad_spend:${adId}:${date}`;
}

function adFrequencyKey(userId: string, adId: string, date: string): string {
  return `ad_freq:${userId}:${adId}:${date}`;
}
