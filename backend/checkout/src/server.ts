import express, { type NextFunction, type Request, type Response } from "express";
import type { Redis } from "ioredis";
import {
  authenticateRequest,
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
  sessionTokenFromRequest,
} from "./auth";
import {
  addCartItem,
  applyCoupon,
  clearCart,
  getCartSummary,
  mergeGuestCartIntoUser,
  removeCartItem,
  removeCoupon,
  resolveCartPrincipal,
  updateCartItem,
} from "./cart";
import {
  createCatalogProduct,
  getCategory,
  getVendor,
  listCatalogProducts,
  listCategoryTree,
  listVendors,
  patchCatalogProduct,
  productsForCategory,
  productsForVendor,
} from "./catalog";
import type { CheckoutConfig } from "./config";
import {
  checkServiceability,
  deliveryChannel,
  estimateDelivery,
  getTracking,
  parseGeoPair,
  updateDeliveryLocation,
  validateGeoPoint,
} from "./delivery";
import type { EmbedText } from "./embeddings";
import {
  adStats,
  fullTextSearch,
  recordAdClick,
  recordAdImpression,
  recordTrendingEvent,
  saveAd,
  searchSuggestions,
  selectAds,
  trendingProducts,
} from "./engagement";
import { ApiError, errorBody, toApiError } from "./errors";
import { withIdempotency } from "./idempotency";
import type { InventoryScripts } from "./inventoryScripts";
import { integrationDashboard } from "./integrations";
import {
  analyticsDashboard,
  metricsMiddleware,
  prometheusMetrics,
  recordCheckoutFailure,
  recordOrderMetric,
} from "./metrics";
import {
  listRecentLogs,
  observabilityHealth,
  recordLog,
  topErrors,
  traceEvents,
  traceMiddleware,
  type TraceRequest,
} from "./observability";
import {
  type CheckoutQueues,
  type CheckoutQueueEvents,
  releaseReservations,
  reserveJobOptions,
} from "./queues";
import { RATE_LIMIT_CONFIG, rateLimitMiddleware } from "./rateLimit";
import {
  personalizedRecommendations,
  recentlyViewed,
  recommendationPrincipal,
  recordRecommendationEvent,
  similarRecommendations,
  trendingForUser,
} from "./recommendations";
import { agentSearch, getExistingConversation, recordAgentFeedback } from "./agent";
import {
  ORDER_STREAM_KEY,
  createOrder,
  getOrder,
  getProduct,
  listOrdersForUser,
  requireOwnedOrder,
  transitionOrder,
} from "./store";
import { parseNumericFilter, semanticSearchProducts, similarProducts } from "./search";
import type { AdCreative, ApiEnvelope, CartItemInput, DeliveryStatus, Order, Product, PublicUser } from "./types";

export interface CheckoutAppContext {
  client: Redis;
  scripts: InventoryScripts;
  queues: CheckoutQueues;
  events: CheckoutQueueEvents;
  config: CheckoutConfig;
  embedText: EmbedText;
}

interface AuthedRequest extends TraceRequest {
  userId?: string;
  authUser?: PublicUser;
}

function idempotencyKeyFrom(request: Request): string {
  const key = request.header("Idempotency-Key");
  if (!key) {
    throw new ApiError(400, "missing_idempotency_key", "Idempotency-Key header is required.");
  }
  return key;
}

function demoUserId(request: Request): string | undefined {
  return request.header("X-User-Id") ?? request.header("X-Guest-Session-Id") ?? undefined;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseCatalogFilters(request: Request) {
  const attributes: Record<string, string> = {};
  for (const [key, value] of Object.entries(request.query)) {
    if (key.startsWith("attribute.") && typeof value === "string" && value.trim()) {
      attributes[key.slice("attribute.".length)] = value.trim();
    }
  }

  return {
    categoryId: optionalString(request.query.categoryId),
    vendorId: optionalString(request.query.vendorId),
    brand: optionalString(request.query.brand),
    minPrice: parseNumericFilter(request.query.minPrice),
    maxPrice: parseNumericFilter(request.query.maxPrice),
    offset: parseNumericFilter(request.query.offset),
    limit: parseNumericFilter(request.query.limit),
    attributes,
  };
}

function validateCartItems(value: unknown): CartItemInput[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ApiError(400, "invalid_request", "items must be a non-empty array.");
  }

  return value.map((item) => {
    if (!item || typeof item !== "object") {
      throw new ApiError(400, "invalid_request", "Each item must be an object.");
    }

    const candidate = item as Record<string, unknown>;
    if (typeof candidate.productId !== "string" || !Number.isInteger(candidate.quantity)) {
      throw new ApiError(400, "invalid_request", "Each item requires productId and integer quantity.");
    }

    return {
      productId: candidate.productId,
      quantity: Number(candidate.quantity),
    };
  });
}

function cartMatchesCheckoutItems(cartItems: CartItemInput[], checkoutItems: CartItemInput[]): boolean {
  if (cartItems.length !== checkoutItems.length) {
    return false;
  }

  const cartByProduct = new Map(cartItems.map((item) => [item.productId, item.quantity]));
  return checkoutItems.every((item) => cartByProduct.get(item.productId) === item.quantity);
}

function sendEnvelope(response: Response, envelope: ApiEnvelope): void {
  response.status(envelope.status).json(envelope.body);
}

async function waitForOrderJob(
  orderId: string,
  jobPromise: Promise<unknown>,
  client: Redis
): Promise<Order> {
  await jobPromise;
  const order = await getOrder(client, orderId);
  if (!order) {
    throw new ApiError(404, "order_not_found", "Order was not found.");
  }
  return order;
}

export function createCheckoutApp(context: CheckoutAppContext) {
  const app = express();
  app.use(traceMiddleware(context.client));
  app.use(corsMiddleware(context.config.corsOrigin));
  app.use(express.json());
  app.use(metricsMiddleware(context.client));
  if (context.config.rateLimitEnabled) {
    app.use(rateLimitMiddleware(context.client));
  }

  app.post("/api/auth/register", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const result = await registerUser(context.client, context.config, {
        email: String(body.email ?? ""),
        password: String(body.password ?? ""),
        firstName: String(body.firstName ?? ""),
        lastName: String(body.lastName ?? ""),
        phone: optionalString(body.phone),
      });
      await mergeGuestCartIntoUser(context.client, optionalString(body.guestSessionId), result.user.id);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const result = await loginUser(context.client, context.config, {
        email: String(body.email ?? ""),
        password: String(body.password ?? ""),
      });
      await mergeGuestCartIntoUser(context.client, optionalString(body.guestSessionId), result.user.id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", async (request, response, next) => {
    try {
      const token = sessionTokenFromRequest(request);
      if (!token) {
        throw new ApiError(401, "unauthorized", "A valid session token is required.");
      }
      await logoutSession(context.client, token);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/auth/me", async (request, response, next) => {
    try {
      const session = await authenticateRequest(context.client, context.config, request);
      response.json({ user: session.user });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/refresh", async (request, response, next) => {
    try {
      const token = sessionTokenFromRequest(request);
      if (!token) {
        throw new ApiError(401, "unauthorized", "A valid session token is required.");
      }
      response.json({ expiresIn: await refreshSession(context.client, context.config, token) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products", async (request, response, next) => {
    try {
      const page = await listCatalogProducts(context.client, parseCatalogFilters(request));
      response.json(page);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (request, response, next) => {
    try {
      const product = await getProduct(context.client, request.params.id);
      if (!product || product.status !== "active") {
        throw new ApiError(404, "product_not_found", "Product was not found.");
      }
      response.json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/categories", async (_request, response, next) => {
    try {
      response.json({ categories: await listCategoryTree(context.client) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/categories/:id/products", async (request, response, next) => {
    try {
      const category = await getCategory(context.client, request.params.id);
      if (!category) {
        throw new ApiError(404, "category_not_found", "Category was not found.");
      }
      const page = await productsForCategory(context.client, request.params.id, parseCatalogFilters(request));
      response.json({ category, ...page });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/vendors", async (_request, response, next) => {
    try {
      response.json({ vendors: await listVendors(context.client) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/vendors/:id/products", async (request, response, next) => {
    try {
      const vendor = await getVendor(context.client, request.params.id);
      if (!vendor) {
        throw new ApiError(404, "vendor_not_found", "Vendor was not found.");
      }
      const page = await productsForVendor(context.client, request.params.id, parseCatalogFilters(request));
      response.json({ vendor, ...page });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/cart", async (request, response, next) => {
    try {
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      response.json({ cart: await getCartSummary(context.client, principal) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart/items", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const productId = optionalString(body.productId);
      const quantity = Number(body.quantity ?? 1);
      if (!productId) {
        throw new ApiError(400, "invalid_request", "productId is required.");
      }
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      const cart = await addCartItem(context.client, principal, productId, quantity);
      await recordRecommendationEvent(context.client, principal.id, { type: "add_to_cart", productId });
      response.status(201).json({ cart });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/cart/items/:productId", async (request, response, next) => {
    try {
      const quantity = Number((request.body as Record<string, unknown>).quantity);
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      response.json({ cart: await updateCartItem(context.client, principal, request.params.productId, quantity) });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart/items/:productId", async (request, response, next) => {
    try {
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      response.json({ cart: await removeCartItem(context.client, principal, request.params.productId) });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart", async (request, response, next) => {
    try {
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      response.json({ cart: await clearCart(context.client, principal) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart/coupon", async (request, response, next) => {
    try {
      const code = optionalString((request.body as Record<string, unknown>).code);
      if (!code) {
        throw new ApiError(400, "invalid_request", "Coupon code is required.");
      }
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      response.json({ cart: await applyCoupon(context.client, principal, code) });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart/coupon", async (request, response, next) => {
    try {
      const principal = await resolveCartPrincipal(context.client, context.config, request);
      response.json({ cart: await removeCoupon(context.client, principal) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/search/semantic", async (request, response, next) => {
    try {
      const query = typeof request.query.q === "string" ? request.query.q.trim() : "";
      if (!query) {
        throw new ApiError(400, "invalid_request", "q query parameter is required.");
      }

      const results = await semanticSearchProducts(context.client, context.embedText, query, {
        categoryId: typeof request.query.categoryId === "string" ? request.query.categoryId : undefined,
        minPrice: parseNumericFilter(request.query.minPrice),
        maxPrice: parseNumericFilter(request.query.maxPrice),
        limit: parseNumericFilter(request.query.limit) ?? 8,
      });
      response.json({ query, results });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id/similar", async (request, response, next) => {
    try {
      const product = await getProduct(context.client, request.params.id);
      if (!product || product.status !== "active") {
        throw new ApiError(404, "product_not_found", "Product was not found.");
      }

      const results = await similarProducts(
        context.client,
        context.embedText,
        request.params.id,
        parseNumericFilter(request.query.limit) ?? 4
      );
      response.json({ productId: request.params.id, results });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/search/by-image", async (_request, response) => {
    response.status(501).json(
      errorBody("not_implemented", "Image embeddings are outside this demo scope; use semantic text search.")
    );
  });

  app.get("/api/search", async (request, response, next) => {
    try {
      response.json(
        await fullTextSearch(context.client, {
          q: optionalString(request.query.q),
          categoryId: optionalString(request.query.category ?? request.query.categoryId),
          brand: optionalString(request.query.brand),
          minPrice: parseNumericFilter(request.query.minPrice),
          maxPrice: parseNumericFilter(request.query.maxPrice),
          sort: optionalString(request.query.sort),
          page: parseNumericFilter(request.query.page),
          pageSize: parseNumericFilter(request.query.pageSize),
        })
      );
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/search/suggest", async (request, response, next) => {
    try {
      response.json({
        suggestions: await searchSuggestions(
          context.client,
          optionalString(request.query.q) ?? "",
          parseNumericFilter(request.query.max) ?? 5
        ),
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/search/facets", async (request, response, next) => {
    try {
      const result = await fullTextSearch(context.client, {
        q: optionalString(request.query.q),
        categoryId: optionalString(request.query.category ?? request.query.categoryId),
        brand: optionalString(request.query.brand),
        minPrice: parseNumericFilter(request.query.minPrice),
        maxPrice: parseNumericFilter(request.query.maxPrice),
        pageSize: 1,
      });
      response.json({ facets: result.facets, total: result.total });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/trending", async (request, response, next) => {
    try {
      response.json(
        await trendingProducts(context.client, {
          window: optionalString(request.query.window),
          limit: parseNumericFilter(request.query.limit),
        })
      );
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/trending/:categoryId", async (request, response, next) => {
    try {
      response.json(
        await trendingProducts(context.client, {
          categoryId: request.params.categoryId,
          window: optionalString(request.query.window),
          limit: parseNumericFilter(request.query.limit),
        })
      );
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events/view", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const productId = optionalString(body.productId);
      if (!productId) throw new ApiError(400, "invalid_request", "productId is required.");
      await recordTrendingEvent(context.client, { productId, action: "view", categoryId: optionalString(body.categoryId) });
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events/add-to-cart", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const productId = optionalString(body.productId);
      if (!productId) throw new ApiError(400, "invalid_request", "productId is required.");
      await recordTrendingEvent(context.client, { productId, action: "add_to_cart", categoryId: optionalString(body.categoryId) });
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/events/purchase", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const productId = optionalString(body.productId);
      if (!productId) throw new ApiError(400, "invalid_request", "productId is required.");
      await recordTrendingEvent(context.client, { productId, action: "purchase", categoryId: optionalString(body.categoryId) });
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ads", async (request, response, next) => {
    try {
      const keywords = optionalString(request.query.keywords)?.split(",").map((keyword) => keyword.trim()).filter(Boolean);
      response.json({
        ads: await selectAds(context.client, {
          categoryId: optionalString(request.query.categoryId ?? (request.query.context === "category" ? request.query.value : undefined)),
          keywords,
          userId: optionalString(request.query.userId) ?? demoUserId(request),
          limit: parseNumericFilter(request.query.limit),
        }),
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ads", async (request, response, next) => {
    try {
      response.status(201).json({ ad: await saveAd(context.client, request.body as AdCreative) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ads/:adId/stats", async (request, response, next) => {
    try {
      response.json(await adStats(context.client, request.params.adId, optionalString(request.query.date)));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ads/:adId/impression", async (request, response, next) => {
    try {
      await recordAdImpression(context.client, request.params.adId, optionalString((request.body as Record<string, unknown>).userId) ?? demoUserId(request));
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ads/:adId/click", async (request, response, next) => {
    try {
      await recordAdClick(context.client, request.params.adId, optionalString((request.body as Record<string, unknown>).userId) ?? demoUserId(request));
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/delivery/check-serviceability", async (request, response, next) => {
    try {
      const point = validateGeoPoint(request.query.lat, request.query.lng);
      if (!point) throw new ApiError(400, "invalid_coordinates", "lat and lng are required and must be valid.");
      response.json(await checkServiceability(context.client, point));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/delivery/eta", async (request, response, next) => {
    try {
      const from = parseGeoPair(request.query.from);
      const to = parseGeoPair(request.query.to);
      if (!from || !to) throw new ApiError(400, "invalid_coordinates", "from and to are required as lat,lng pairs.");
      response.json(estimateDelivery(from, to));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/delivery/:trackingId/track", async (request, response, next) => {
    try {
      const tracking = await getTracking(context.client, request.params.trackingId);
      if (!tracking) throw new ApiError(404, "tracking_not_found", `No delivery found for ${request.params.trackingId}.`);
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.flushHeaders?.();
      response.write(`event: snapshot\ndata: ${JSON.stringify(tracking)}\n\n`);

      const subscriber = context.client.duplicate();
      const channel = deliveryChannel(request.params.trackingId);
      await subscriber.subscribe(channel);
      subscriber.on("message", (incoming, message) => {
        if (incoming === channel) response.write(`event: location\ndata: ${message}\n\n`);
      });
      const heartbeat = setInterval(() => response.write(": ping\n\n"), 25000);
      request.on("close", () => {
        clearInterval(heartbeat);
        subscriber.unsubscribe(channel).finally(() => subscriber.quit());
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/delivery/:trackingId/location", async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const point = validateGeoPoint(body.lat, body.lng);
      if (!point) throw new ApiError(400, "invalid_coordinates", "lat and lng are required and must be valid.");
      response.json({
        ok: true,
        ...(await updateDeliveryLocation(context.client, request.params.trackingId, {
          point,
          status: optionalString(body.status) as DeliveryStatus | undefined,
          agentId: optionalString(body.agentId),
        })),
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/delivery/:trackingId", async (request, response, next) => {
    try {
      const tracking = await getTracking(context.client, request.params.trackingId);
      if (!tracking) throw new ApiError(404, "tracking_not_found", `No delivery found for ${request.params.trackingId}.`);
      response.json({ tracking });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ratelimit/config", (_request, response) => {
    response.json({ config: RATE_LIMIT_CONFIG });
  });

  app.get("/api/ratelimit/test", (_request, response) => {
    response.json({ ok: true, message: "within rate limit" });
  });

  app.post("/api/recommendations/events", async (request, response, next) => {
    try {
      const userId = await recommendationPrincipal(context.client, context.config, request);
      const body = request.body as Record<string, unknown>;
      await recordRecommendationEvent(context.client, userId, {
        type: String(body.type) as "view" | "add_to_cart" | "purchase",
        productId: optionalString(body.productId),
        productIds: Array.isArray(body.productIds) ? body.productIds.filter((id): id is string => typeof id === "string") : undefined,
        categoryId: optionalString(body.categoryId),
      });
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recommendations/recently-viewed", async (request, response, next) => {
    try {
      const userId = await recommendationPrincipal(context.client, context.config, request);
      response.json({ results: await recentlyViewed(context.client, userId) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recommendations/similar/:productId", async (request, response, next) => {
    try {
      response.json({ productId: request.params.productId, results: await similarRecommendations(context.client, request.params.productId) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recommendations/trending-for-you", async (request, response, next) => {
    try {
      const userId = await recommendationPrincipal(context.client, context.config, request);
      response.json({ results: await trendingForUser(context.client, userId) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recommendations/personalized", async (request, response, next) => {
    try {
      const userId = await recommendationPrincipal(context.client, context.config, request);
      response.json({ user: userId, results: await personalizedRecommendations(context.client, userId) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/agent/search", async (request, response, next) => {
    try {
      response.json(await agentSearch(context.client, request.body as { sessionId?: string; message?: unknown }));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/agent/conversation/:sessionId", async (request, response, next) => {
    try {
      const conversation = await getExistingConversation(context.client, request.params.sessionId);
      if (!conversation) throw new ApiError(404, "conversation_not_found", "No such conversation.");
      response.json(conversation);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/agent/feedback", async (request, response, next) => {
    try {
      await recordAgentFeedback(context.client, request.body as Record<string, unknown>);
      response.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/metrics", async (_request, response, next) => {
    try {
      response.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
      response.send(await prometheusMetrics(context.client));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/dashboard", async (_request, response, next) => {
    try {
      response.json({ dashboard: await analyticsDashboard(context.client) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/observability/logs", async (request, response, next) => {
    try {
      response.json({ logs: await listRecentLogs(context.client, parseNumericFilter(request.query.limit) ?? 100) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/observability/traces/:traceId", async (request, response, next) => {
    try {
      response.json(await traceEvents(context.client, request.params.traceId));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/observability/errors", async (_request, response, next) => {
    try {
      response.json({ errors: await topErrors(context.client) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/observability/health", async (_request, response, next) => {
    try {
      response.json({ health: await observabilityHealth(context.client, context.config) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/integrations", async (_request, response, next) => {
    try {
      response.json(await integrationDashboard(context.client, context.config, context.queues));
    } catch (error) {
      next(error);
    }
  });

  app.use(async (request: AuthedRequest, _response, next) => {
    try {
      const session = await authenticateRequest(context.client, context.config, request, { allowUserIdHeader: true });
      request.userId = session.userId;
      request.authUser = session.user;
      next();
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", async (request: AuthedRequest, response, next) => {
    try {
      const product = await createCatalogProduct(context.client, request.body as Partial<Product>);
      response.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/products/:id", async (request: AuthedRequest, response, next) => {
    try {
      const product = await patchCatalogProduct(context.client, request.params.id, request.body as Record<string, unknown>);
      if (!product) {
        throw new ApiError(404, "product_not_found", "Product was not found.");
      }
      response.json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/start", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const key = idempotencyKeyFrom(request);

      const envelope = await withIdempotency(context.client, userId, key, async () => {
        const body = request.body as Record<string, unknown>;
        const items = validateCartItems(body.items);
        const shippingAddress =
          body.shippingAddress && typeof body.shippingAddress === "object"
            ? (body.shippingAddress as Record<string, unknown>)
            : {};
        const cart = await getCartSummary(context.client, { id: userId, isGuest: false });
        const cartItems = cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity }));
        const cartDiscount = cartMatchesCheckoutItems(cartItems, items) ? cart.totals.discount : 0;

        const order = await createOrder(
          context.client,
          userId,
          items,
          shippingAddress,
          cartDiscount,
          cartDiscount > 0 ? cart.coupon?.code : undefined
        );
        const job = await context.queues.inventoryReserve.add(
          `reserve:${order.id}`,
          { orderId: order.id },
          reserveJobOptions()
        );

        const updatedOrder = await waitForOrderJob(
          order.id,
          job.waitUntilFinished(context.events.inventoryReserve, 5000),
          context.client
        );

        if (updatedOrder.status === "inventory_reserve_failed") {
          await recordCheckoutFailure(context.client, {
            reason: "insufficient_stock",
            orderId: updatedOrder.id,
          });
          await recordLog(context.client, {
            level: "warn",
            event: "checkout_inventory_failed",
            traceId: request.traceId!,
            message: "Inventory reservation failed.",
            orderId: updatedOrder.id,
            userId,
          });
          return {
            status: 409,
            body: errorBody("insufficient_stock", "One or more products do not have enough available stock.", {
              orderId: updatedOrder.id,
            }),
          };
        }

        return {
          status: 201,
          body: { order: updatedOrder },
        };
      });

      sendEnvelope(response, envelope);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/payment", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const key = idempotencyKeyFrom(request);

      const envelope = await withIdempotency(context.client, userId, key, async () => {
        const { orderId, paymentInput } = request.body as {
          orderId?: unknown;
          paymentInput?: Record<string, unknown>;
        };
        if (typeof orderId !== "string") {
          throw new ApiError(400, "invalid_request", "orderId is required.");
        }

        const order = await requireOwnedOrder(context.client, orderId, userId);
        if (order.status !== "pending_payment") {
          throw new ApiError(409, "invalid_order_state", "Order is not pending payment.");
        }
        const job = await context.queues.paymentProcess.add(
          `payment:${orderId}`,
          { orderId, paymentInput },
          { attempts: 2, backoff: { type: "exponential", delay: 200 }, removeOnComplete: true }
        );
        const updatedOrder = await waitForOrderJob(
          orderId,
          job.waitUntilFinished(context.events.paymentProcess, 5000),
          context.client
        );

        if (updatedOrder.status === "payment_failed") {
          await recordCheckoutFailure(context.client, { reason: "payment_declined", orderId: updatedOrder.id });
          await recordLog(context.client, {
            level: "warn",
            event: "checkout_payment_failed",
            traceId: request.traceId!,
            message: "Payment was declined.",
            orderId: updatedOrder.id,
            userId,
          });
        }

        return {
          status: updatedOrder.status === "payment_failed" ? 402 : 200,
          body: { order: updatedOrder },
        };
      });

      sendEnvelope(response, envelope);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/confirm", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const key = idempotencyKeyFrom(request);

      const envelope = await withIdempotency(context.client, userId, key, async () => {
        const { orderId } = request.body as { orderId?: unknown };
        if (typeof orderId !== "string") {
          throw new ApiError(400, "invalid_request", "orderId is required.");
        }

        const order = await requireOwnedOrder(context.client, orderId, userId);
        if (order.status !== "payment_authorized") {
          throw new ApiError(409, "invalid_order_state", "Order must be payment_authorized before confirmation.");
        }
        const job = await context.queues.orderConfirm.add(
          `confirm:${orderId}`,
          { orderId },
          { attempts: 3, backoff: { type: "exponential", delay: 200 }, removeOnComplete: true }
        );
        const updatedOrder = await waitForOrderJob(
          orderId,
          job.waitUntilFinished(context.events.orderConfirm, 5000),
          context.client
        );
        await recordRecommendationEvent(context.client, userId, {
          type: "purchase",
          productIds: updatedOrder.items.map((item) => item.productId),
        });
        await recordOrderMetric(context.client, updatedOrder.total);
        await recordLog(context.client, {
          level: "info",
          event: "checkout_order_confirmed",
          traceId: request.traceId!,
          message: "Order confirmed.",
          orderId: updatedOrder.id,
          userId,
          details: { total: updatedOrder.total },
        });

        return {
          status: 200,
          body: { order: updatedOrder },
        };
      });

      sendEnvelope(response, envelope);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checkout/cancel", async (request: AuthedRequest, response, next) => {
    try {
      const userId = request.userId!;
      const { orderId } = request.body as { orderId?: unknown };
      if (typeof orderId !== "string") {
        throw new ApiError(400, "invalid_request", "orderId is required.");
      }

      const order = await requireOwnedOrder(context.client, orderId, userId);
      if (["confirmed", "cancelled", "released", "inventory_reserve_failed"].includes(order.status)) {
        throw new ApiError(409, "invalid_order_state", "Order is already terminal.");
      }

      await releaseReservations(context.client, context.scripts, order);
      const cancelled = await transitionOrder(context.client, order, "cancelled");
      response.json({ order: cancelled });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders", async (request: AuthedRequest, response, next) => {
    try {
      const orders = await listOrdersForUser(context.client, request.userId!);
      response.json({ orders });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", async (request: AuthedRequest, response, next) => {
    try {
      const order = await requireOwnedOrder(context.client, request.params.id, request.userId!);
      response.json({ order });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id/events", async (request: AuthedRequest, response, next) => {
    try {
      await requireOwnedOrder(context.client, request.params.id, request.userId!);

      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.flushHeaders?.();

      let active = true;
      let lastId = "$";
      request.on("close", () => {
        active = false;
      });

      while (active) {
        const rows = (await context.client.xread(
          "BLOCK",
          1000,
          "STREAMS",
          ORDER_STREAM_KEY,
          lastId
        )) as Array<[string, Array<[string, string[]]>]> | null;

        if (!rows) {
          continue;
        }

        for (const [, entries] of rows) {
          for (const [entryId, fields] of entries) {
            lastId = entryId;
            const event = Object.fromEntries(
              Array.from({ length: fields.length / 2 }, (_, index) => [
                fields[index * 2],
                fields[index * 2 + 1],
              ])
            );
            if (event.orderId === request.params.id) {
              response.write(`id: ${entryId}\n`);
              response.write(`event: order\n`);
              response.write(`data: ${JSON.stringify(event)}\n\n`);
            }
          }
        }
      }

      response.end();
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, request: TraceRequest, response: Response, _next: express.NextFunction) => {
    const apiError = toApiError(error);
    void recordLog(context.client, {
      level: apiError.status >= 500 ? "error" : "warn",
      event: "api_error",
      traceId: request.traceId ?? "missing-trace",
      message: apiError.message,
      route: request.path,
      method: request.method,
      status: apiError.status,
      error: apiError.error,
      details: apiError.details,
    });
    response.status(apiError.status).json(errorBody(apiError.error, apiError.message, apiError.details));
  });

  return app;
}

function corsMiddleware(corsOrigin: string) {
  const configuredOrigins = corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);
  return (request: Request, response: Response, next: NextFunction) => {
    const requestOrigin = request.header("Origin");
    const allowOrigin =
      configuredOrigins.includes("*") || configuredOrigins.length === 0
        ? "*"
        : requestOrigin && configuredOrigins.includes(requestOrigin)
          ? requestOrigin
          : configuredOrigins[0];

    response.setHeader("Access-Control-Allow-Origin", allowOrigin);
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization,Content-Type,X-User-Id,X-Session-Token,X-Guest-Session-Id,Idempotency-Key,X-Trace-Id"
    );
    response.setHeader("Access-Control-Expose-Headers", "X-Trace-Id,X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset,Retry-After");

    if (request.method === "OPTIONS") {
      response.status(204).end();
      return;
    }

    next();
  };
}
