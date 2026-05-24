import { productService } from "./product.service.js";
import { valkey } from "./valkey.service.js";
import { notFound } from "../utils/httpError.js";

const wishlistKey = (identity) => `wishlist:${identity}`;

class WishlistService {
  async list(identity) {
    const ids = (await valkey.getJson(wishlistKey(identity))) || [];
    return ids.map((id) => productService.findById(id)).filter(Boolean);
  }

  async add(identity, productId) {
    const product = productService.findById(productId);
    if (!product) throw notFound("Product not found");
    const ids = (await valkey.getJson(wishlistKey(identity))) || [];
    const next = ids.includes(productId) ? ids : [...ids, productId];
    await valkey.setJson(wishlistKey(identity), next, 60 * 60 * 24 * 365);
    return this.list(identity);
  }

  async remove(identity, productId) {
    const ids = (await valkey.getJson(wishlistKey(identity))) || [];
    await valkey.setJson(
      wishlistKey(identity),
      ids.filter((id) => id !== productId),
      60 * 60 * 24 * 365
    );
    return this.list(identity);
  }
}

export const wishlistService = new WishlistService();

