import type { Request } from "express";
import type { Redis } from "ioredis";
import { COUPON_FIXTURES } from "./fixtures";
import { ApiError } from "./errors";
import { authenticateRequest } from "./auth";
import type { CheckoutConfig } from "./config";
import { getProduct } from "./store";
import type { CartLine, CartSummary, Coupon } from "./types";

const CART_TTL_SECONDS = 604800;

export interface CartPrincipal {
  id: string;
  isGuest: boolean;
}

export function cartKey(principalId: string): string {
  return `cart:${principalId}`;
}

export function cartCouponKey(principalId: string): string {
  return `cart_coupon:${principalId}`;
}

export function couponKey(code: string): string {
  return `coupon:${normalizeCouponCode(code)}`;
}

export function couponUsedKey(code: string): string {
  return `coupon_used:${normalizeCouponCode(code)}`;
}

export async function seedCoupons(client: Redis): Promise<void> {
  for (const coupon of COUPON_FIXTURES) {
    await client.call("JSON.SET", couponKey(coupon.code), "$", JSON.stringify(coupon));
  }
}

export async function resolveCartPrincipal(
  client: Redis,
  config: CheckoutConfig,
  request: Request
): Promise<CartPrincipal> {
  try {
    const session = await authenticateRequest(client, config, request);
    return { id: session.userId, isGuest: false };
  } catch {
    const guestSessionId = request.header("X-Guest-Session-Id");
    if (!guestSessionId || !guestSessionId.startsWith("guest:")) {
      throw new ApiError(400, "guest_session_required", "X-Guest-Session-Id is required for guest carts.");
    }
    return { id: guestSessionId, isGuest: true };
  }
}

export async function getCartSummary(client: Redis, principal: CartPrincipal): Promise<CartSummary> {
  const rawItems = await client.hgetall(cartKey(principal.id));
  const lines = await cartLinesFromHash(client, rawItems);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const couponCode = await client.get(cartCouponKey(principal.id));
  const coupon = couponCode ? await getCoupon(client, couponCode) : null;
  const couponValidation = coupon
    ? await validateCoupon(client, principal, coupon, lines, subtotal, { allowAlreadyUsed: true })
    : { discount: 0 };

  return {
    principalId: principal.id,
    isGuest: principal.isGuest,
    items: lines,
    coupon: couponValidation.error ? null : coupon,
    couponError: couponValidation.error,
    totals: {
      subtotal,
      discount: couponValidation.discount,
      total: Math.max(0, subtotal - couponValidation.discount),
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
    },
  };
}

export async function addCartItem(
  client: Redis,
  principal: CartPrincipal,
  productId: string,
  quantity: number
): Promise<CartSummary> {
  validateQuantity(quantity);
  const product = await requireCartProduct(client, productId);
  const currentQuantity = Number(await client.hget(cartKey(principal.id), productId)) || 0;
  const nextQuantity = currentQuantity + quantity;
  const available = product.inventory.quantity - product.inventory.reserved;
  if (nextQuantity > available) {
    throw new ApiError(409, "insufficient_stock", "Requested quantity exceeds available inventory.");
  }

  await client.hset(cartKey(principal.id), productId, nextQuantity);
  await client.expire(cartKey(principal.id), CART_TTL_SECONDS);
  return getCartSummary(client, principal);
}

export async function updateCartItem(
  client: Redis,
  principal: CartPrincipal,
  productId: string,
  quantity: number
): Promise<CartSummary> {
  validateQuantity(quantity);
  const product = await requireCartProduct(client, productId);
  const available = product.inventory.quantity - product.inventory.reserved;
  if (quantity > available) {
    throw new ApiError(409, "insufficient_stock", "Requested quantity exceeds available inventory.");
  }

  await client.hset(cartKey(principal.id), productId, quantity);
  await client.expire(cartKey(principal.id), CART_TTL_SECONDS);
  return getCartSummary(client, principal);
}

export async function removeCartItem(client: Redis, principal: CartPrincipal, productId: string): Promise<CartSummary> {
  await client.hdel(cartKey(principal.id), productId);
  await client.expire(cartKey(principal.id), CART_TTL_SECONDS);
  return getCartSummary(client, principal);
}

export async function clearCart(client: Redis, principal: CartPrincipal): Promise<CartSummary> {
  await client.del(cartKey(principal.id), cartCouponKey(principal.id));
  return getCartSummary(client, principal);
}

export async function applyCoupon(client: Redis, principal: CartPrincipal, code: string): Promise<CartSummary> {
  const coupon = await getCoupon(client, code);
  if (!coupon) {
    throw new ApiError(404, "coupon_not_found", "Coupon code was not found.");
  }

  const summary = await getCartSummary(client, principal);
  const validation = await validateCoupon(client, principal, coupon, summary.items, summary.totals.subtotal, {
    allowAlreadyUsed: false,
  });
  if (validation.error) {
    throw new ApiError(409, "coupon_not_applicable", validation.error);
  }

  await client.set(cartCouponKey(principal.id), normalizeCouponCode(code), "EX", CART_TTL_SECONDS);
  if (!principal.isGuest) {
    await client.sadd(couponUsedKey(code), principal.id);
    await client.call("JSON.NUMINCRBY", couponKey(code), "$.usedCount", 1);
  }
  return getCartSummary(client, principal);
}

export async function removeCoupon(client: Redis, principal: CartPrincipal): Promise<CartSummary> {
  await client.del(cartCouponKey(principal.id));
  return getCartSummary(client, principal);
}

export async function mergeGuestCartIntoUser(client: Redis, guestSessionId: string | undefined, userId: string): Promise<void> {
  if (!guestSessionId?.startsWith("guest:")) {
    return;
  }

  const guestItems = await client.hgetall(cartKey(guestSessionId));
  const userCartKey = cartKey(userId);
  for (const [productId, quantity] of Object.entries(guestItems)) {
    const product = await getProduct(client, productId);
    if (!product || product.status !== "active") {
      continue;
    }

    const currentQuantity = Number(await client.hget(userCartKey, productId)) || 0;
    const available = product.inventory.quantity - product.inventory.reserved;
    const nextQuantity = Math.min(currentQuantity + Number(quantity), available);
    if (nextQuantity > 0) {
      await client.hset(userCartKey, productId, nextQuantity);
    }
  }

  const [guestCoupon, userCoupon] = await Promise.all([client.get(cartCouponKey(guestSessionId)), client.get(cartCouponKey(userId))]);
  if (guestCoupon && !userCoupon) {
    await client.set(cartCouponKey(userId), guestCoupon, "EX", CART_TTL_SECONDS);
  }

  await client.expire(userCartKey, CART_TTL_SECONDS);
  await client.del(cartKey(guestSessionId), cartCouponKey(guestSessionId));
}

async function cartLinesFromHash(client: Redis, rawItems: Record<string, string>): Promise<CartLine[]> {
  const lines = await Promise.all(
    Object.entries(rawItems).map(async ([productId, quantity]) => {
      const product = await getProduct(client, productId);
      if (!product || product.status !== "active") {
        return null;
      }

      const numericQuantity = Number(quantity);
      return {
        productId,
        quantity: numericQuantity,
        product,
        lineTotal: numericQuantity * product.price.amount,
      };
    })
  );

  return lines.filter((line): line is CartLine => Boolean(line)).sort((left, right) => left.product.name.localeCompare(right.product.name));
}

async function getCoupon(client: Redis, code: string): Promise<Coupon | null> {
  const raw = await client.call("JSON.GET", couponKey(code), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as Coupon[])[0] ?? null;
}

async function validateCoupon(
  client: Redis,
  principal: CartPrincipal,
  coupon: Coupon,
  lines: CartLine[],
  subtotal: number,
  options: { allowAlreadyUsed: boolean }
): Promise<{ discount: number; error?: string }> {
  const now = Date.now();
  if (!coupon.active) return { discount: 0, error: "Coupon is not active." };
  if (Date.parse(coupon.validFrom) > now) return { discount: 0, error: "Coupon is not active yet." };
  if (Date.parse(coupon.validUntil) < now) return { discount: 0, error: "Coupon has expired." };
  if (coupon.usedCount >= coupon.usageLimit) return { discount: 0, error: "Coupon usage limit has been reached." };
  if (subtotal < coupon.minOrderAmount) return { discount: 0, error: `Minimum order amount is ${coupon.minOrderAmount}.` };
  if (!principal.isGuest && !options.allowAlreadyUsed && (await client.sismember(couponUsedKey(coupon.code), principal.id))) {
    return { discount: 0, error: "This user has already used this coupon." };
  }

  const applicableLines =
    coupon.applicableCategories.length === 0
      ? lines
      : lines.filter((line) => coupon.applicableCategories.includes(line.product.categoryId));
  if (applicableLines.length === 0) {
    return { discount: 0, error: "Coupon does not apply to the products in this cart." };
  }

  const applicableSubtotal = applicableLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const discount =
    coupon.type === "percentage" ? Math.round((applicableSubtotal * coupon.value) / 100) : Math.min(coupon.value, applicableSubtotal);
  return { discount: Math.min(discount, coupon.maxDiscount ?? discount) };
}

async function requireCartProduct(client: Redis, productId: string) {
  const product = await getProduct(client, productId);
  if (!product || product.status !== "active") {
    throw new ApiError(404, "product_not_found", "Product was not found.");
  }
  return product;
}

function validateQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new ApiError(400, "invalid_quantity", "Quantity must be a positive integer.");
  }
}

function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}
