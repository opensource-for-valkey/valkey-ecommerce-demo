import { env } from "../config/env";
import { JsonRepository } from "../valkey/jsonRepository";
import { keys } from "../valkey/keys";
import { SearchRepository } from "../valkey/searchRepository";
import type { Category, Coupon, Inventory, Product, User } from "../types/domain";
import { categories, coupons, makeInventory, makeProducts, makeUsers } from "./demoData";
import { getValkey } from "../valkey/client";

export class SeedService {
  private products = new JsonRepository<Product>();
  private categories = new JsonRepository<Category>();
  private inventory = new JsonRepository<Inventory>();
  private coupons = new JsonRepository<Coupon>();
  private users = new JsonRepository<User>();
  private search = new SearchRepository();

  async ensureSeeded() {
    await this.search.createIndexes();
    const client = await getValkey();
    const marker = await client.get("shopmind:seeded");
    if (marker) return;

    const products = makeProducts(env.DEMO_SEED_COUNT);
    const inventory = makeInventory(products);
    const users = await makeUsers();

    await Promise.all(categories.map((category) => this.categories.set(keys.category(category.id), category)));
    await Promise.all(products.map((product) => this.products.set(keys.product(product.id), product)));
    await Promise.all(inventory.map((item) => this.inventory.set(keys.inventory(item.productId), item)));
    await Promise.all(coupons.map((coupon) => this.coupons.set(keys.coupon(coupon.code), coupon)));
    await Promise.all(
      users.map(async (user) => {
        await this.users.set(keys.user(user.id), user);
        await client.set(keys.userEmail(user.email), user.id);
      })
    );

    for (const product of products.slice(0, 120)) {
      await client.zAdd(keys.trend("views"), { score: Math.floor(Math.random() * 500), value: product.id });
      await client.zAdd(keys.trend("clicks"), { score: Math.floor(Math.random() * 250), value: product.id });
      await client.zAdd(keys.trend("carts"), { score: Math.floor(Math.random() * 120), value: product.id });
      await client.zAdd(keys.trend("purchases"), { score: Math.floor(Math.random() * 80), value: product.id });
    }

    await client.geoAdd(keys.geoDrivers, [
      { longitude: 77.5946, latitude: 12.9716, member: "driver_1" },
      { longitude: 77.6413, latitude: 12.9141, member: "driver_2" }
    ]);
    await client.set("shopmind:seeded", new Date().toISOString());
    console.log(`[seed] ShopMind AI seeded with ${products.length} products.`);
  }
}
