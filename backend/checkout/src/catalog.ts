import type { Redis } from "ioredis";
import { ApiError } from "./errors";
import { CATEGORY_FIXTURES, PRODUCT_FIXTURES, VENDOR_FIXTURES } from "./fixtures";
import { createId, uuidV7Timestamp } from "./ids";
import { getProduct, listProducts, productKey } from "./store";
import type { Category, CategoryNode, Product, Vendor } from "./types";

export interface CatalogFilters {
  categoryId?: string;
  vendorId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  attributes?: Record<string, string>;
  offset?: number;
  limit?: number;
}

export interface CatalogPage {
  products: Product[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    nextOffset: number | null;
  };
}

export function categoryKey(categoryId: string): string {
  return categoryId;
}

export function vendorKey(vendorId: string): string {
  return vendorId;
}

export function categoryProductsKey(categoryId: string): string {
  return `category_products:${categoryId}`;
}

export function vendorProductsKey(vendorId: string): string {
  return `vendor_products:${vendorId}`;
}

export function brandProductsKey(brand: string): string {
  return `brand_products:${brand.toLowerCase()}`;
}

export async function seedCatalog(client: Redis): Promise<void> {
  for (const category of CATEGORY_FIXTURES) {
    await client.call("JSON.SET", categoryKey(category.id), "$", JSON.stringify(category));
  }

  for (const vendor of VENDOR_FIXTURES) {
    await client.call("JSON.SET", vendorKey(vendor.id), "$", JSON.stringify(vendor));
  }

  for (const product of PRODUCT_FIXTURES) {
    await client.call("JSON.SET", productKey(product.id), "$", JSON.stringify(product));
    await client.set(`sku:${product.sku}`, product.id);
    await indexProduct(client, product);
  }
}

export async function ensureSeedCatalog(client: Redis): Promise<void> {
  const [products, categories, vendors] = await Promise.all([listProducts(client), listCategories(client), listVendors(client)]);
  if (products.length === 0 || categories.length === 0 || vendors.length === 0) {
    await seedCatalog(client);
    return;
  }

  await Promise.all(products.map((product) => indexProduct(client, product)));
}

export async function listCategories(client: Redis): Promise<Category[]> {
  const ids = await scanKeys(client, "category:*");
  const categories = await Promise.all(ids.map((id) => getCategory(client, id)));
  return categories.filter((category): category is Category => Boolean(category)).sort((left, right) => left.name.localeCompare(right.name));
}

export async function listCategoryTree(client: Redis): Promise<CategoryNode[]> {
  const categories = await listCategories(client);
  const byParent = new Map<string | null, Category[]>();
  for (const category of categories) {
    const siblings = byParent.get(category.parentId) ?? [];
    siblings.push(category);
    byParent.set(category.parentId, siblings);
  }

  const build = (parentId: string | null): CategoryNode[] =>
    (byParent.get(parentId) ?? []).map((category) => ({
      ...category,
      childNodes: build(category.id),
    }));

  return build(null);
}

export async function getCategory(client: Redis, categoryId: string): Promise<Category | null> {
  const raw = await client.call("JSON.GET", categoryKey(categoryId), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as Category[])[0] ?? null;
}

export async function listVendors(client: Redis): Promise<Vendor[]> {
  const ids = await scanKeys(client, "vendor:*");
  const vendors = await Promise.all(ids.map((id) => getVendor(client, id)));
  return vendors.filter((vendor): vendor is Vendor => Boolean(vendor)).sort((left, right) => left.name.localeCompare(right.name));
}

export async function getVendor(client: Redis, vendorId: string): Promise<Vendor | null> {
  const raw = await client.call("JSON.GET", vendorKey(vendorId), "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as Vendor[])[0] ?? null;
}

export async function listCatalogProducts(client: Redis, filters: CatalogFilters = {}): Promise<CatalogPage> {
  const offset = Math.max(0, filters.offset ?? 0);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 12));
  const categoryIds = filters.categoryId ? await categoryWithDescendants(client, filters.categoryId) : null;
  const products = (await listProducts(client))
    .filter((product) => !categoryIds || categoryIds.has(product.categoryId))
    .filter((product) => !filters.vendorId || product.vendorId === filters.vendorId)
    .filter((product) => !filters.brand || product.brand.toLowerCase() === filters.brand.toLowerCase())
    .filter((product) => filters.minPrice === undefined || product.price.amount >= filters.minPrice)
    .filter((product) => filters.maxPrice === undefined || product.price.amount <= filters.maxPrice)
    .filter((product) => matchesAttributes(product, filters.attributes ?? {}))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.name.localeCompare(right.name));

  const page = products.slice(offset, offset + limit);
  return {
    products: page,
    pagination: {
      total: products.length,
      offset,
      limit,
      nextOffset: offset + limit < products.length ? offset + limit : null,
    },
  };
}

export async function productsForCategory(client: Redis, categoryId: string, filters: CatalogFilters = {}): Promise<CatalogPage> {
  return listCatalogProducts(client, { ...filters, categoryId });
}

export async function productsForVendor(client: Redis, vendorId: string, filters: CatalogFilters = {}): Promise<CatalogPage> {
  return listCatalogProducts(client, { ...filters, vendorId });
}

export async function createCatalogProduct(client: Redis, input: Partial<Product>): Promise<Product> {
  const now = new Date().toISOString();
  const product: Product = {
    id: input.id ?? createId("product"),
    sku: requiredString(input.sku, "sku"),
    name: requiredString(input.name, "name"),
    slug: input.slug ?? requiredString(input.name, "name").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: requiredString(input.description, "description"),
    shortDescription: input.shortDescription ?? requiredString(input.name, "name"),
    categoryId: requiredString(input.categoryId, "categoryId"),
    vendorId: requiredString(input.vendorId, "vendorId"),
    brand: input.brand ?? "Valkey Demo",
    price: input.price ?? { amount: 0, currency: "INR" },
    images: input.images ?? [{ url: "/assets/images/thumbs/product-img1.png", alt: input.name ?? "Product", isPrimary: true }],
    attributes: input.attributes ?? {},
    tags: input.tags ?? ["valkey", "catalog"],
    inventory: input.inventory ?? { quantity: 0, reserved: 0, warehouse: "HYD-WH-01" },
    ratings: input.ratings ?? { average: 0, count: 0 },
    embedding: input.embedding,
    status: input.status ?? "active",
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };

  await client.call("JSON.SET", productKey(product.id), "$", JSON.stringify(product));
  await client.set(`sku:${product.sku}`, product.id);
  await indexProduct(client, product);
  return product;
}

export async function patchCatalogProduct(client: Redis, productId: string, patch: Record<string, unknown>): Promise<Product | null> {
  const existing = await getProduct(client, productId);
  if (!existing) {
    return null;
  }

  const allowedPatch = sanitizeProductPatch(patch);
  const updated = {
    ...existing,
    ...allowedPatch,
    price: { ...existing.price, ...(allowedPatch.price ?? {}) },
    inventory: { ...existing.inventory, ...(allowedPatch.inventory ?? {}) },
    attributes: { ...existing.attributes, ...(allowedPatch.attributes ?? {}) },
    updatedAt: new Date().toISOString(),
  };

  await client.call("JSON.SET", productKey(productId), "$", JSON.stringify(updated));
  await indexProduct(client, updated);
  return updated;
}

export async function indexProduct(client: Redis, product: Product): Promise<void> {
  const score = uuidV7Timestamp(product.id);
  const pipeline = client.pipeline();
  pipeline.zadd(categoryProductsKey(product.categoryId), score, product.id);
  pipeline.zadd(vendorProductsKey(product.vendorId), score, product.id);
  pipeline.sadd(brandProductsKey(product.brand), product.id);
  pipeline.zadd("price_index", product.price.amount, product.id);
  await pipeline.exec();
}

function matchesAttributes(product: Product, attributes: Record<string, string>): boolean {
  return Object.entries(attributes).every(([key, value]) => String(product.attributes[key] ?? "").toLowerCase() === value.toLowerCase());
}

async function categoryWithDescendants(client: Redis, categoryId: string): Promise<Set<string>> {
  const categories = await listCategories(client);
  const descendants = new Set<string>([categoryId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && descendants.has(category.parentId) && !descendants.has(category.id)) {
        descendants.add(category.id);
        changed = true;
      }
    }
  }
  return descendants;
}

function sanitizeProductPatch(patch: Record<string, unknown>): Partial<Product> {
  const allowed = new Set(["name", "description", "shortDescription", "categoryId", "vendorId", "brand", "price", "images", "attributes", "tags", "inventory", "ratings", "status"]);
  return Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.has(key))) as Partial<Product>;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(400, "invalid_request", `${field} is required.`);
  }
  return value.trim();
}

async function scanKeys(client: Redis, pattern: string): Promise<string[]> {
  const ids: string[] = [];
  let cursor = "0";
  do {
    const [nextCursor, keys] = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);
    cursor = nextCursor;
    ids.push(...keys);
  } while (cursor !== "0");
  return ids;
}
