import { describe, expect, test } from "vitest";
import { EMBEDDING_DIMENSIONS, cosineSimilarity, deterministicEmbedding } from "../../src/embeddings";

describe("deterministic embeddings", () => {
  test("returns normalized 384-dimension vectors", () => {
    const embedding = deterministicEmbedding("wireless keyboard for typing");
    const magnitude = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0));

    expect(embedding).toHaveLength(EMBEDDING_DIMENSIONS);
    expect(magnitude).toBeCloseTo(1, 5);
  });

  test("keeps related product language closer than unrelated language", () => {
    const query = deterministicEmbedding("typing keyboard");
    const keyboard = deterministicEmbedding("wireless keyboard keys desk");
    const bottle = deterministicEmbedding("hydration water bottle travel");

    expect(cosineSimilarity(query, keyboard)).toBeGreaterThan(cosineSimilarity(query, bottle));
  });
});
