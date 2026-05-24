import type { Request } from "express";
import type { Redis } from "ioredis";
import { ApiError } from "./errors";
import { authenticateRequest } from "./auth";
import type { CheckoutConfig } from "./config";
import { getProduct, listProducts } from "./store";
import { recordTrendingEvent } from "./engagement";
import type { Product } from "./types";

const WEIGHTS = {
  view: 1,
  add_to_cart: 3,
  purchase: 5,
} as const;

const HISTORY_LIMIT = 50;

type RecommendationEvent = keyof typeof WEIGHTS;

export async function recommendationPrincipal(client: Redis, config: CheckoutConfig, request: Request): Promise<string> {
  try {
    return (await authenticateRequest(client, config, request, { allowUserIdHeader: true })).userId;
  } catch {
    return request.header("X-Guest-Session-Id") ?? "guest:demo";
  }
}

export async function recordRecommendationEvent(
  client: Redis,
  userId: string,
  input: { type: RecommendationEvent; productId?: string; productIds?: string[]; categoryId?: string }
): Promise<void> {
  if (!Object.prototype.hasOwnProperty.call(WEIGHTS, input.type)) {
    throw new ApiError(400, "invalid_event", `type must be one of: ${Object.keys(WEIGHTS).join(", ")}`);
  }

  const productIds = Array.isArray(input.productIds) && input.productIds.length > 0 ? input.productIds : input.productId ? [input.productId] : [];
  if (productIds.length === 0) {
    throw new ApiError(400, "missing_product", "productId or productIds is required.");
  }

  for (const productId of productIds) {
    const product = await getProduct(client, productId);
    if (!product) {
      continue;
    }
    const categoryId = input.categoryId ?? product.categoryId;
    await client.zincrby(`user_affinity:${userId}`, WEIGHTS[input.type], categoryId);
    await recordTrendingEvent(client, { productId, categoryId, action: input.type });

    if (input.type === "view") {
      await client.lpush(`user_history:${userId}`, productId);
      await client.ltrim(`user_history:${userId}`, 0, HISTORY_LIMIT - 1);
      await client.expire(`user_history:${userId}`, 1800);
    }

    if (input.type === "purchase") {
      await client.sadd(`user_purchased:${userId}`, productId);
    }
  }

  if (input.type === "purchase" && productIds.length > 1) {
    const pipeline = client.pipeline();
    for (const productId of productIds) {
      for (const relatedProductId of productIds) {
        if (productId !== relatedProductId) {
          pipeline.zincrby(`copurchase:${productId}`, 1, relatedProductId);
        }
      }
    }
    await pipeline.exec();
  }
}

export async function recentlyViewed(client: Redis, userId: string): Promise<Product[]> {
  return enrichMany(client, await client.lrange(`user_history:${userId}`, 0, HISTORY_LIMIT - 1));
}

export async function similarRecommendations(client: Redis, productId: string): Promise<Product[]> {
  return enrichMany(client, await client.zrevrange(`copurchase:${productId}`, 0, 9));
}

export async function trendingForUser(client: Redis, userId: string): Promise<Product[]> {
  const topCategories = new Set(await client.zrevrange(`user_affinity:${userId}`, 0, 2));
  const trending = await client.zrevrange("trending:global:24h", 0, 30);
  const products = await enrichMany(client, trending);
  const filtered = topCategories.size > 0 ? products.filter((product) => topCategories.has(product.categoryId)) : products;
  return (filtered.length > 0 ? filtered : products).slice(0, 10);
}

export async function personalizedRecommendations(client: Redis, userId: string): Promise<Product[]> {
  const [history, topCategories, purchased] = await Promise.all([
    client.lrange(`user_history:${userId}`, 0, 9),
    client.zrevrange(`user_affinity:${userId}`, 0, 2),
    client.smembers(`user_purchased:${userId}`),
  ]);
  const purchasedSet = new Set(purchased);
  const seen = new Set(history);
  const scores = new Map<string, number>();
  const bump = (productId: string, score: number) => scores.set(productId, (scores.get(productId) ?? 0) + score);

  for (const productId of history) {
    const coPurchased = await client.zrevrange(`copurchase:${productId}`, 0, 4, "WITHSCORES");
    for (let index = 0; index < coPurchased.length; index += 2) {
      bump(coPurchased[index], Number(coPurchased[index + 1]) * 2);
    }
  }

  for (const categoryId of topCategories) {
    const categoryProducts = await client.zrevrange(`category_products:${categoryId}`, 0, 9);
    for (const productId of categoryProducts) {
      bump(productId, 1);
    }
  }

  const ranked = [...scores.entries()]
    .filter(([productId]) => !purchasedSet.has(productId) && !seen.has(productId))
    .sort((left, right) => right[1] - left[1])
    .map(([productId]) => productId);

  if (ranked.length < 6) {
    for (const productId of await client.zrevrange("trending:global:24h", 0, 20)) {
      if (ranked.length >= 10) break;
      if (!ranked.includes(productId) && !purchasedSet.has(productId) && !seen.has(productId)) {
        ranked.push(productId);
      }
    }
  }

  if (ranked.length === 0) {
    return (await listProducts(client)).slice(0, 6);
  }

  return enrichMany(client, ranked.slice(0, 10));
}

async function enrichMany(client: Redis, ids: string[]): Promise<Product[]> {
  const products = await Promise.all([...new Set(ids)].map((productId) => getProduct(client, productId)));
  return products.filter((product): product is Product => Boolean(product));
}
