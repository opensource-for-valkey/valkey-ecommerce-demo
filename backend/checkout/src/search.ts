import type { Redis } from "ioredis";
import {
  type EmbedText,
  EMBEDDING_DIMENSIONS,
  cosineSimilarity,
  productEmbeddingText,
  toFloat32Buffer,
} from "./embeddings";
import { getProduct, listProducts, productKey } from "./store";
import type { Product, SemanticSearchResult } from "./types";

export const PRODUCT_VECTOR_INDEX = "idx:product_vectors";

export interface ProductSearchFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export async function ensureProductVectorIndex(client: Redis): Promise<boolean> {
  try {
    await client.call("FT.INFO", PRODUCT_VECTOR_INDEX);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const normalizedMessage = message.toLowerCase();
    if (!normalizedMessage.includes("unknown index") && !normalizedMessage.includes("not found")) {
      return false;
    }
  }

  try {
    await client.call(
      "FT.CREATE",
      PRODUCT_VECTOR_INDEX,
      "ON",
      "JSON",
      "PREFIX",
      "1",
      "product:",
      "SCHEMA",
      "$.categoryId",
      "AS",
      "categoryId",
      "TAG",
      "$.price.amount",
      "AS",
      "price",
      "NUMERIC",
      "$.embedding",
      "AS",
      "embedding",
      "VECTOR",
      "HNSW",
      "6",
      "TYPE",
      "FLOAT32",
      "DIM",
      String(EMBEDDING_DIMENSIONS),
      "DISTANCE_METRIC",
      "COSINE"
    );
    return true;
  } catch {
    return false;
  }
}

export async function upsertProductEmbeddings(
  client: Redis,
  products: Product[],
  embedText: EmbedText
): Promise<Product[]> {
  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      if (Array.isArray(product.embedding) && product.embedding.length === EMBEDDING_DIMENSIONS) {
        return product;
      }

      const embedding = await embedText(productEmbeddingText(product));
      const updatedProduct = {
        ...product,
        embedding,
        updatedAt: new Date().toISOString(),
      };

      await client.call("JSON.SET", productKey(product.id), "$", JSON.stringify(updatedProduct));
      return updatedProduct;
    })
  );

  await ensureProductVectorIndex(client);
  return updatedProducts;
}

export async function semanticSearchProducts(
  client: Redis,
  embedText: EmbedText,
  query: string,
  filters: ProductSearchFilters = {}
): Promise<SemanticSearchResult[]> {
  const vector = await embedText(query);
  const limit = filters.limit ?? 8;
  const indexReady = await ensureProductVectorIndex(client);

  if (indexReady) {
    const searchResults = await searchWithValkeyIndex(client, vector, filters, Math.max(limit * 3, limit));
    if (searchResults.length > 0) {
      return searchResults.filter((result) => matchesFilters(result.product, filters)).slice(0, limit);
    }
  }

  return searchInMemory(client, vector, filters, limit);
}

export async function similarProducts(
  client: Redis,
  embedText: EmbedText,
  productId: string,
  limit = 4
): Promise<SemanticSearchResult[]> {
  const product = await getProduct(client, productId);
  if (!product) {
    return [];
  }

  const embedding =
    Array.isArray(product.embedding) && product.embedding.length === EMBEDDING_DIMENSIONS
      ? product.embedding
      : await embedText(productEmbeddingText(product));

  const results = await searchInMemory(client, embedding, {}, limit + 1);
  return results.filter((result) => result.product.id !== product.id).slice(0, limit);
}

export function parseNumericFilter(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

async function searchWithValkeyIndex(
  client: Redis,
  vector: number[],
  filters: ProductSearchFilters,
  limit: number
): Promise<SemanticSearchResult[]> {
  try {
    const raw = (await client.call(
      "FT.SEARCH",
      PRODUCT_VECTOR_INDEX,
      `*=>[KNN ${limit} @embedding $query_vector AS vector_score]`,
      "PARAMS",
      "2",
      "query_vector",
      toFloat32Buffer(vector),
      "SORTBY",
      "vector_score",
      "ASC",
      "RETURN",
      "1",
      "vector_score",
      "DIALECT",
      "2"
    )) as unknown[];

    const rows = parseSearchRows(raw);
    const products = await Promise.all(rows.map((row) => getProduct(client, row.productId)));
    return rows
      .map((row, index) => {
        const product = products[index];
        return product ? { product, score: row.score } : null;
      })
      .filter((result): result is SemanticSearchResult => Boolean(result))
      .filter((row) => matchesFilters(row.product, filters))
      .slice(0, limit);
  } catch {
    return [];
  }
}

function parseSearchRows(raw: unknown[]): Array<{ productId: string; score: number }> {
  const results: Array<{ productId: string; score: number }> = [];
  for (let index = 1; index < raw.length; index += 2) {
    const key = String(raw[index]);
    const fields = raw[index + 1];
    if (!Array.isArray(fields)) {
      continue;
    }

    const productId = key;
    const scoreIndex = fields.findIndex((field) => String(field) === "vector_score");
    const distance = scoreIndex >= 0 ? Number(fields[scoreIndex + 1]) : 1;
    results.push({
      productId,
      score: Number.isFinite(distance) ? 1 - distance : 0,
    });
  }

  return results;
}

async function searchInMemory(
  client: Redis,
  vector: number[],
  filters: ProductSearchFilters,
  limit: number
): Promise<SemanticSearchResult[]> {
  const products = await listProducts(client);
  return products
    .filter((product) => matchesFilters(product, filters))
    .map((product) => ({
      product,
      score:
        Array.isArray(product.embedding) && product.embedding.length === vector.length
          ? cosineSimilarity(vector, product.embedding)
          : 0,
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

function matchesFilters(product: Product, filters: ProductSearchFilters): boolean {
  if (filters.categoryId && product.categoryId !== filters.categoryId) {
    return false;
  }
  if (filters.minPrice !== undefined && product.price.amount < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice !== undefined && product.price.amount > filters.maxPrice) {
    return false;
  }

  return true;
}
