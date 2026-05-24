import { categories, products, reviews } from "../data/catalog.js";
import { valkey } from "./valkey.service.js";
import { notFound } from "../utils/httpError.js";

const CATALOG_CACHE_VERSION = "v5";
const CATALOG_CACHE_SECONDS = 90;
const PRODUCT_CACHE_SECONDS = 180;

const normalize = (value) => String(value || "").toLowerCase().trim();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const publicProduct = (product) => ({
  ...product,
  inventoryStatus:
    product.stock <= 0 ? "out_of_stock" : product.stock <= 20 ? "low_stock" : "in_stock"
});

const applyFilters = (catalog, query = {}) => {
  const search = normalize(query.search || query.q);
  const category = normalize(query.category);
  const brand = normalize(query.brand);
  const subcategory = normalize(query.subcategory);
  const tag = normalize(query.tag);
  const minPrice = toNumber(query.minPrice, 0);
  const maxPrice = toNumber(query.maxPrice, Number.MAX_SAFE_INTEGER);
  const rating = toNumber(query.rating, 0);

  return catalog.filter((product) => {
    const searchable = normalize(
      [
        product.name,
        product.category,
        product.subcategory,
        product.brand,
        product.vendor,
        product.description,
        product.badges.join(" "),
        product.tags.join(" "),
        Object.values(product.specs || {}).join(" ")
      ].join(" ")
    );

    return (
      (!search || searchable.includes(search)) &&
      (!category || normalize(product.category) === category) &&
      (!brand || normalize(product.brand) === brand) &&
      (!subcategory || normalize(product.subcategory) === subcategory) &&
      (!tag || product.tags.some((item) => normalize(item) === tag)) &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= rating
    );
  });
};

const applySort = (catalog, sort = "featured") => {
  const sorted = [...catalog];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.reverse();
    case "trending":
      return sorted.sort((a, b) => b.sold - a.sold);
    default:
      return sorted.sort((a, b) => {
        const aFeatured = a.badges.some((badge) => normalize(badge) === "featured") ? 1 : 0;
        const bFeatured = b.badges.some((badge) => normalize(badge) === "featured") ? 1 : 0;
        return bFeatured - aFeatured || b.sold - a.sold;
      });
  }
};

const uniqueFacet = (catalog, field) =>
  [...new Set(catalog.map((product) => product[field]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      count: catalog.filter((product) => product[field] === name).length
    }));

const buildFacets = (catalog) => ({
  categories: categories.map((category) => ({
    name: category,
    count: catalog.filter((product) => product.category === category).length
  })),
  brands: uniqueFacet(catalog, "brand"),
  subcategories: uniqueFacet(catalog, "subcategory"),
  price: {
    min: Math.min(...products.map((product) => product.price)),
    max: Math.max(...products.map((product) => product.price))
  },
  ratings: [5, 4, 3].map((rating) => ({
    rating,
    count: catalog.filter((product) => Math.floor(product.rating) >= rating).length
  }))
});

export class ProductService {
  constructor() {
    this.catalog = products.map(publicProduct);
  }

  async list(query = {}) {
    const page = Math.max(toNumber(query.page, 1), 1);
    const limit = Math.min(Math.max(toNumber(query.limit, 12), 1), 48);
    const sort = query.sort || "featured";
    const cacheKey = `cache:${CATALOG_CACHE_VERSION}:products:${JSON.stringify({ ...query, page, limit, sort })}`;
    const cached = await valkey.getJson(cacheKey);
    if (cached) return { ...cached, cache: { hit: true, mode: valkey.mode } };

    const filtered = applySort(applyFilters(this.catalog, query), sort);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    const response = {
      data,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.max(Math.ceil(filtered.length / limit), 1)
      },
      facets: buildFacets(this.catalog),
      cache: { hit: false, mode: valkey.mode }
    };

    await valkey.setJson(cacheKey, response, CATALOG_CACHE_SECONDS);
    return response;
  }

  async getById(id) {
    const cacheKey = `cache:${CATALOG_CACHE_VERSION}:product:${id}`;
    const cached = await valkey.getJson(cacheKey);
    if (cached) return { ...cached, cache: { hit: true, mode: valkey.mode } };

    const product = this.catalog.find((item) => item.id === id);
    if (!product) throw notFound("Product not found");

    const directRelated = this.catalog
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category === product.category ||
            item.tags.some((tag) => product.tags.includes(tag)))
      )
      .slice(0, 4);
    const related = [
      ...directRelated,
      ...this.recommendations(product.id, 4).filter(
        (item) => !directRelated.some((directItem) => directItem.id === item.id)
      )
    ].slice(0, 4);

    const response = {
      data: product,
      related,
      reviews: reviews.filter((review) => review.productId === product.id),
      cache: { hit: false, mode: valkey.mode }
    };

    await valkey.setJson(cacheKey, response, PRODUCT_CACHE_SECONDS);
    return response;
  }

  findById(id) {
    return this.catalog.find((product) => product.id === id);
  }

  async trackProductView(productId, identity = "anonymous") {
    const product = this.findById(productId);
    if (!product) return;

    await valkey.zIncrBy("analytics:hot-products", 1, productId);
    const key = `recently-viewed:${identity}`;
    const existing = (await valkey.getJson(key)) || [];
    const next = [
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        viewedAt: new Date().toISOString()
      },
      ...existing.filter((item) => item.id !== product.id)
    ].slice(0, 8);
    await valkey.setJson(key, next, 60 * 60 * 24 * 30);
  }

  async recentlyViewed(identity = "anonymous") {
    const existing = (await valkey.getJson(`recently-viewed:${identity}`)) || [];
    return existing
      .map((item) => {
        const product = this.findById(item.id);
        if (!product) return null;
        return {
          ...item,
          name: product.name,
          image: product.image,
          price: product.price
        };
      })
      .filter(Boolean);
  }

  async trending(limit = 6) {
    const hot = await valkey.zTop("analytics:hot-products", limit);
    const hotProducts = hot
      .map(({ value, score }) => ({
        ...this.findById(value),
        views: score
      }))
      .filter((product) => product.id);

    if (hotProducts.length) return hotProducts;

    return [...this.catalog]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, limit)
      .map((product) => ({ ...product, views: product.sold }));
  }

  recommendations(productId, limit = 4) {
    const base = this.findById(productId) || this.catalog[0];
    return this.catalog
      .filter((product) => product.id !== base.id)
      .map((product) => {
        const tagScore = product.tags.filter((tag) => base.tags.includes(tag)).length;
        const categoryScore = product.category === base.category ? 2 : 0;
        return { product, score: tagScore + categoryScore + product.rating / 10 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ product }) => product);
  }

  suggestions(query = "") {
    const search = normalize(query);
    if (!search) return [];
    return this.catalog
      .filter((product) => normalize(product.name).includes(search))
      .slice(0, 6)
      .map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        image: product.image
      }));
  }

  async adjustInventory(productId, delta) {
    const product = this.findById(productId);
    if (!product) throw notFound("Product not found");

    product.stock = Math.max(product.stock + delta, 0);
    await valkey.delPattern(`cache:${CATALOG_CACHE_VERSION}:products:*`);
    await valkey.del(`cache:${CATALOG_CACHE_VERSION}:product:${productId}`);
    return product;
  }

  analyticsSnapshot() {
    const revenuePotential = this.catalog.reduce(
      (total, product) => total + product.price * product.sold,
      0
    );

    return {
      productCount: this.catalog.length,
      lowStockCount: this.catalog.filter((product) => product.stock <= 20).length,
      averageRating:
        this.catalog.reduce((total, product) => total + product.rating, 0) /
        this.catalog.length,
      revenuePotential,
      categoryMix: buildFacets(this.catalog).categories
    };
  }
}

export const productService = new ProductService();
