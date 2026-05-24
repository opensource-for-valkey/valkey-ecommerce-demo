import { coupons } from "../data/catalog.js";
import { productService } from "./product.service.js";
import { valkey } from "./valkey.service.js";
import { HttpError, notFound } from "../utils/httpError.js";

const CART_TTL_SECONDS = 60 * 60 * 24 * 30;
const TAX_RATE = 0.0825;
const STANDARD_SHIPPING = 7.99;

const cartKey = (identity) => `cart:${identity}`;

const emptyCart = (identity) => ({
  identity,
  items: [],
  couponCode: null,
  updatedAt: new Date().toISOString()
});

const findCoupon = (code) =>
  coupons.find((coupon) => coupon.code === String(code || "").toUpperCase());

export class CartService {
  async get(identity) {
    const cart = (await valkey.getJson(cartKey(identity))) || emptyCart(identity);
    return this.enrich(cart);
  }

  async save(cart) {
    const next = { ...cart, updatedAt: new Date().toISOString() };
    await valkey.setJson(cartKey(cart.identity), next, CART_TTL_SECONDS);
    return this.enrich(next);
  }

  async add(identity, productId, quantity = 1, variantId) {
    const product = productService.findById(productId);
    if (!product) throw notFound("Product not found");
    if (product.stock < quantity) throw new HttpError(409, "Insufficient inventory");

    const cart = (await valkey.getJson(cartKey(identity))) || emptyCart(identity);
    const existing = cart.items.find(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (existing) existing.quantity += quantity;
    else cart.items.push({ productId, quantity, variantId: variantId || null });

    return this.save(cart);
  }

  async update(identity, productId, quantity, variantId) {
    const product = productService.findById(productId);
    if (!product) throw notFound("Product not found");
    if (product.stock < quantity) throw new HttpError(409, "Insufficient inventory");

    const cart = (await valkey.getJson(cartKey(identity))) || emptyCart(identity);
    cart.items = cart.items
      .map((item) =>
        item.productId === productId && item.variantId === (variantId || null)
          ? { ...item, quantity }
          : item
      )
      .filter((item) => item.quantity > 0);

    return this.save(cart);
  }

  async remove(identity, productId, variantId) {
    const cart = (await valkey.getJson(cartKey(identity))) || emptyCart(identity);
    cart.items = cart.items.filter(
      (item) =>
        !(item.productId === productId && item.variantId === (variantId || null))
    );
    return this.save(cart);
  }

  async applyCoupon(identity, code) {
    const coupon = findCoupon(code);
    if (!coupon) throw new HttpError(400, "Coupon code is not valid");

    const cart = (await valkey.getJson(cartKey(identity))) || emptyCart(identity);
    const enriched = await this.enrich(cart);
    if (enriched.totals.subtotal < coupon.minimumSubtotal) {
      throw new HttpError(
        400,
        `Coupon requires a subtotal of at least $${coupon.minimumSubtotal.toFixed(2)}`
      );
    }

    cart.couponCode = coupon.code;
    return this.save(cart);
  }

  async clear(identity) {
    await valkey.del(cartKey(identity));
    return this.enrich(emptyCart(identity));
  }

  async enrich(cart) {
    const items = cart.items
      .map((item) => {
        const product = productService.findById(item.productId);
        if (!product) return null;
        const variant = product.variants.find((entry) => entry.id === item.variantId);
        return {
          ...item,
          product: {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            category: product.category,
            stock: product.stock
          },
          variant: variant || null,
          lineTotal: Number((product.price * item.quantity).toFixed(2))
        };
      })
      .filter(Boolean);

    const subtotal = Number(
      items.reduce((total, item) => total + item.lineTotal, 0).toFixed(2)
    );
    const coupon = cart.couponCode ? findCoupon(cart.couponCode) : null;
    let discount = 0;
    let shipping = items.length ? STANDARD_SHIPPING : 0;

    if (coupon && subtotal >= coupon.minimumSubtotal) {
      if (coupon.type === "percent") discount = subtotal * (coupon.value / 100);
      if (coupon.type === "shipping") shipping = 0;
    }

    const tax = Number(Math.max((subtotal - discount) * TAX_RATE, 0).toFixed(2));
    const total = Number(Math.max(subtotal - discount + shipping + tax, 0).toFixed(2));

    return {
      identity: cart.identity,
      items,
      coupon,
      updatedAt: cart.updatedAt,
      totals: {
        subtotal,
        discount: Number(discount.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        tax,
        total
      },
      cache: { mode: valkey.mode }
    };
  }
}

export const cartService = new CartService();

