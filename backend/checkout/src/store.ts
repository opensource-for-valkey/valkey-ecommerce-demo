import type { Redis } from "ioredis";
import { createId, uuidV7Timestamp } from "./ids";
import { PRODUCT_FIXTURES } from "./fixtures";
import { ApiError } from "./errors";
import type { CartItemInput, Order, OrderEvent, OrderItem, OrderStatus, Product } from "./types";

export const ORDER_STREAM_KEY = "stream:orders";

export function orderKey(orderId: string): string {
  return orderId;
}

export function productKey(productId: string): string {
  return productId;
}

export function userOrdersKey(userId: string): string {
  return `user_orders:{${userId}}`;
}

export function reservationKey(orderId: string, productId: string): string {
  return `reservation:${orderId}:${productId}`;
}

export function idempotencyKey(userId: string, key: string): string {
  return `idempotency:{${userId}}:${key}`;
}

export function idempotencyLockKey(userId: string, key: string): string {
  return `idempotency_lock:{${userId}}:${key}`;
}

export async function seedProducts(client: Redis): Promise<Product[]> {
  for (const product of PRODUCT_FIXTURES) {
    await client.call("JSON.SET", productKey(product.id), "$", JSON.stringify(product));
    await client.set(`sku:${product.sku}`, product.id);
  }

  return PRODUCT_FIXTURES;
}

export async function ensureSeedProducts(client: Redis): Promise<Product[]> {
  const existingProducts = await listProducts(client);
  if (existingProducts.length > 0) {
    return existingProducts;
  }

  return seedProducts(client);
}

export async function listProducts(client: Redis): Promise<Product[]> {
  const ids: string[] = [];
  let cursor = "0";
  do {
    const [nextCursor, keys] = await client.scan(cursor, "MATCH", "product:*", "COUNT", 100);
    cursor = nextCursor;
    ids.push(...keys);
  } while (cursor !== "0");

  const products = await Promise.all(ids.map((id) => getProduct(client, id)));
  return products
    .filter((product): product is Product => Boolean(product))
    .filter((product) => product.status === "active")
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function getProduct(client: Redis, id: string): Promise<Product | null> {
  const raw = await client.call("JSON.GET", productKey(id), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const parsed = JSON.parse(raw) as Product[];
  return parsed[0] ?? null;
}

export async function getOrder(client: Redis, id: string): Promise<Order | null> {
  const raw = await client.call("JSON.GET", orderKey(id), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const parsed = JSON.parse(raw) as Order[];
  return parsed[0] ?? null;
}

export async function requireOwnedOrder(client: Redis, orderId: string, userId: string): Promise<Order> {
  const order = await getOrder(client, orderId);
  if (!order || order.userId !== userId) {
    throw new ApiError(404, "order_not_found", "Order was not found.");
  }

  return order;
}

export async function saveOrder(client: Redis, order: Order): Promise<void> {
  await client.call("JSON.SET", orderKey(order.id), "$", JSON.stringify(order));
}

export async function createOrder(
  client: Redis,
  userId: string,
  items: CartItemInput[],
  shippingAddress: Record<string, unknown>,
  discount = 0,
  couponCode?: string
): Promise<Order> {
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = await getProduct(client, item.productId);
    if (!product || product.status !== "active") {
      throw new ApiError(400, "invalid_request", `Product ${item.productId} is not available.`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new ApiError(400, "invalid_request", "Item quantity must be a positive integer.");
    }

    orderItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: item.quantity,
      price: product.price.amount,
      vendorId: product.vendorId,
    });
  }

  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const safeDiscount = Math.min(Math.max(0, discount), subtotal);
  const now = new Date().toISOString();
  const order: Order = {
    id: createId("order"),
    userId,
    status: "pending_reservation",
    items: orderItems,
    subtotal,
    discount: safeDiscount,
    couponCode,
    tax: 0,
    shipping: 0,
    total: subtotal - safeDiscount,
    shippingAddress,
    payment: {
      method: "stub",
      transactionId: null,
      status: "pending",
    },
    createdAt: now,
    updatedAt: now,
  };

  await saveOrder(client, order);
  await client.zadd(userOrdersKey(userId), uuidV7Timestamp(order.id), order.id);
  await emitOrderEvent(client, order.id, userId, null, "pending_reservation");
  return order;
}

export async function transitionOrder(
  client: Redis,
  order: Order,
  status: OrderStatus
): Promise<Order> {
  if (order.status === status) {
    return order;
  }

  const previousStatus = order.status;
  const nextOrder = {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(client, nextOrder);
  await emitOrderEvent(client, order.id, order.userId, previousStatus, status);
  return nextOrder;
}

export async function listOrdersForUser(client: Redis, userId: string): Promise<Order[]> {
  const ids = await client.zrevrange(userOrdersKey(userId), 0, -1);
  const orders = await Promise.all(ids.map((id) => getOrder(client, id)));
  return orders.filter((order): order is Order => Boolean(order));
}

export async function emitOrderEvent(
  client: Redis,
  orderId: string,
  userId: string,
  from: OrderStatus | null,
  to: OrderStatus
): Promise<void> {
  const event: OrderEvent = {
    orderId,
    userId,
    from: from ?? "",
    to,
    at: new Date().toISOString(),
  };

  await client.xadd(
    ORDER_STREAM_KEY,
    "MAXLEN",
    "~",
    "100000",
    "*",
    "orderId",
    event.orderId,
    "userId",
    event.userId,
    "from",
    event.from,
    "to",
    event.to,
    "at",
    event.at
  );
}

export async function scanDelete(client: Redis, patterns: string[]): Promise<void> {
  for (const pattern of patterns) {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } while (cursor !== "0");
  }
}
