import crypto from "crypto";
import { getValkey } from "./client";
import { keys } from "./keys";
import type { Product } from "../types/domain";
import { JsonRepository } from "./jsonRepository";

const productRepo = new JsonRepository<Product>();

export const embeddingFor = (text: string, dims = 64) => {
  const vector = new Array(dims).fill(0);
  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  tokens.forEach((token) => {
    const hash = crypto.createHash("sha256").update(token).digest();
    for (let i = 0; i < dims; i += 1) {
      vector[i] += (hash[i % hash.length] - 128) / 128;
    }
  });
  const norm = Math.sqrt(vector.reduce((sum, n) => sum + n * n, 0)) || 1;
  return vector.map((n) => Number((n / norm).toFixed(6)));
};

const cosine = (a: number[], b: number[]) => {
  let dot = 0;
  let aa = 0;
  let bb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(aa) || 1) * (Math.sqrt(bb) || 1));
};

export class SearchRepository {
  async createIndexes() {
    const client = await getValkey();
    const commands = [
      [
        "FT.CREATE",
        "idx:products",
        "ON",
        "JSON",
        "PREFIX",
        "1",
        "shopmind:product:",
        "SCHEMA",
        "$.name",
        "AS",
        "name",
        "TEXT",
        "$.brand",
        "AS",
        "brand",
        "TAG",
        "$.categoryId",
        "AS",
        "categoryId",
        "TAG",
        "$.tags[*]",
        "AS",
        "tags",
        "TAG",
        "$.price",
        "AS",
        "price",
        "NUMERIC",
        "$.rating",
        "AS",
        "rating",
        "NUMERIC",
        "$.status",
        "AS",
        "status",
        "TAG"
      ],
      [
        "FT.CREATE",
        "idx:orders",
        "ON",
        "JSON",
        "PREFIX",
        "1",
        "shopmind:order:",
        "SCHEMA",
        "$.userId",
        "AS",
        "userId",
        "TAG",
        "$.orderStatus",
        "AS",
        "orderStatus",
        "TAG",
        "$.createdAt",
        "AS",
        "createdAt",
        "TEXT"
      ]
    ];
    for (const command of commands) {
      try {
        await client.sendCommand(command);
      } catch (error) {
        if (!String((error as Error).message).includes("Index already exists")) {
          console.warn(`[search] index skipped: ${(error as Error).message}`);
        }
      }
    }
  }

  async searchProducts(options: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    limit?: number;
  }) {
    const limit = options.limit ?? 24;
    const all = await productRepo.scan("shopmind:product:", 2000);
    const q = options.q?.trim().toLowerCase();
    let products = all.filter((product) => product.status === "active");
    if (q) {
      products = products.filter((product) => {
        const haystack = [product.name, product.brand, product.description, ...product.tags, ...product.keywords].join(" ").toLowerCase();
        return haystack.includes(q) || q.split(/\s+/).some((token) => haystack.includes(token));
      });
    }
    if (options.category) products = products.filter((product) => product.categoryId === options.category);
    if (options.brand) products = products.filter((product) => product.brand.toLowerCase() === options.brand?.toLowerCase());
    if (options.minPrice) products = products.filter((product) => product.price >= Number(options.minPrice));
    if (options.maxPrice) products = products.filter((product) => product.price <= Number(options.maxPrice));
    if (options.sort === "price_asc") products.sort((a, b) => a.price - b.price);
    else if (options.sort === "price_desc") products.sort((a, b) => b.price - a.price);
    else if (options.sort === "rating") products.sort((a, b) => b.rating - a.rating);
    return products.slice(0, limit);
  }

  async semanticSearch(query: string, limit = 8) {
    const vector = embeddingFor(query);
    const products = await productRepo.scan("shopmind:product:", 2000);
    return products
      .map((product) => ({ product, score: cosine(vector, product.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async similarProducts(productId: string, limit = 8) {
    const product = await productRepo.get(keys.product(productId));
    if (!product) return [];
    const products = await productRepo.scan("shopmind:product:", 2000);
    return products
      .filter((candidate) => candidate.id !== productId)
      .map((candidate) => ({ product: candidate, score: cosine(product.embedding, candidate.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async autocomplete(q: string) {
    const products = await this.searchProducts({ q, limit: 8 });
    return products.map((product) => ({
      id: product.id,
      label: product.name,
      brand: product.brand,
      categoryId: product.categoryId
    }));
  }
}
