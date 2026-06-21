import { Router } from "express";
import { z } from "zod";
import type { Cart, Coupon, Inventory, Product } from "../../types/domain";
import { EventBus } from "../../valkey/events";
import { JsonRepository } from "../../valkey/jsonRepository";
import { keys } from "../../valkey/keys";
import { SearchRepository } from "../../valkey/searchRepository";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";
import { id } from "../../utils/ids";

const router = Router();
const carts = new JsonRepository<Cart>();
const products = new JsonRepository<Product>();
const coupons = new JsonRepository<Coupon>();
const inventory = new JsonRepository<Inventory>();
const search = new SearchRepository();
const events = new EventBus();

const cartKey = (userId?: string, guestId?: string) => (userId ? keys.cartUser(userId) : keys.cartGuest(guestId ?? "anonymous"));

const recalc = async (cart: Cart) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (cart.couponCode) {
    const coupon = await coupons.get(keys.coupon(cart.couponCode));
    if (coupon?.status === "active" && subtotal >= coupon.minCartValue) {
      discount = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
    }
  }
  const tax = Math.round((subtotal - discount) * 0.18);
  return { ...cart, subtotal, discount, tax, total: Math.max(0, subtotal - discount + tax), updatedAt: new Date().toISOString() };
};

const getCart = async (userId?: string, guestId?: string) => {
  const existing = await carts.get(cartKey(userId, guestId));
  if (existing) return existing;
  const cart: Cart = {
    id: id("cart"),
    userId,
    guestId,
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    updatedAt: new Date().toISOString()
  };
  await carts.set(cartKey(userId, guestId), cart, userId ? undefined : 60 * 60 * 24 * 14);
  return cart;
};

router.get(
  "/cart",
  asyncHandler(async (req, res) => {
    const cart = await getCart(req.query.userId?.toString(), req.query.guestId?.toString());
    res.json({ data: cart });
  })
);

router.post(
  "/cart/items",
  asyncHandler(async (req, res) => {
    const body = z.object({ productId: z.string(), quantity: z.number().min(1).max(20), userId: z.string().optional(), guestId: z.string().optional() }).parse(req.body);
    const product = await products.get(keys.product(body.productId));
    if (!product) throw new AppError(404, "Product not found");
    const stock = await inventory.get(keys.inventory(product.id));
    if (!stock || stock.available < body.quantity) throw new AppError(409, "Not enough stock available");
    const cart = await getCart(body.userId, body.guestId);
    const existing = cart.items.find((item) => item.productId === product.id);
    if (existing) existing.quantity += body.quantity;
    else cart.items.push({ productId: product.id, quantity: body.quantity, price: product.price, name: product.name, image: product.images[0] });
    const updated = await recalc(cart);
    await carts.set(cartKey(body.userId, body.guestId), updated, body.userId ? undefined : 60 * 60 * 24 * 14);
    await events.recordProductEvent("carts", product.id, body.userId);
    res.status(201).json({ data: updated });
  })
);

router.patch(
  "/cart/items/:productId",
  asyncHandler(async (req, res) => {
    const body = z.object({ quantity: z.number().min(0).max(20), userId: z.string().optional(), guestId: z.string().optional() }).parse(req.body);
    const cart = await getCart(body.userId, body.guestId);
    cart.items = body.quantity === 0 ? cart.items.filter((item) => item.productId !== req.params.productId) : cart.items.map((item) => (item.productId === req.params.productId ? { ...item, quantity: body.quantity } : item));
    const updated = await recalc(cart);
    await carts.set(cartKey(body.userId, body.guestId), updated, body.userId ? undefined : 60 * 60 * 24 * 14);
    res.json({ data: updated });
  })
);

router.delete(
  "/cart/items/:productId",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId?.toString();
    const guestId = req.query.guestId?.toString();
    const cart = await getCart(userId, guestId);
    cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
    const updated = await recalc(cart);
    await carts.set(cartKey(userId, guestId), updated, userId ? undefined : 60 * 60 * 24 * 14);
    res.json({ data: updated });
  })
);

router.post(
  "/cart/apply-coupon",
  asyncHandler(async (req, res) => {
    const body = z.object({ code: z.string(), userId: z.string().optional(), guestId: z.string().optional() }).parse(req.body);
    const cart = await getCart(body.userId, body.guestId);
    const coupon = await coupons.get(keys.coupon(body.code));
    if (!coupon || coupon.status !== "active") throw new AppError(404, "Coupon not available");
    cart.couponCode = coupon.code;
    const updated = await recalc(cart);
    await carts.set(cartKey(body.userId, body.guestId), updated, body.userId ? undefined : 60 * 60 * 24 * 14);
    res.json({ data: updated });
  })
);

router.get(
  "/cart/recommendations",
  asyncHandler(async (req, res) => {
    const cart = await getCart(req.query.userId?.toString(), req.query.guestId?.toString());
    const query = cart.items.map((item) => item.name).join(" ") || "popular accessories";
    res.json({ data: await search.semanticSearch(`${query} complementary bundle`, 6) });
  })
);

export default router;
