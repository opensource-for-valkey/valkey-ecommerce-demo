import crypto from "node:crypto";

export const EMBEDDING_DIMENSIONS = 384;

export type EmbedText = (text: string) => Promise<number[]>;

export function productEmbeddingText(product: {
  name: string;
  description: string;
  shortDescription: string;
  brand: string;
  tags: string[];
  attributes: Record<string, string | number | boolean>;
}): string {
  return [
    product.name,
    product.description,
    product.shortDescription,
    product.brand,
    product.tags.join(" "),
    Object.values(product.attributes).join(" "),
  ].join(" ");
}

export function deterministicEmbedding(text: string, dimensions = EMBEDDING_DIMENSIONS): number[] {
  const vector = Array.from({ length: dimensions }, () => 0);
  const tokens = expandSemanticTokens(tokenize(text));

  for (const token of tokens) {
    for (let index = 0; index < 4; index += 1) {
      const digest = crypto.createHash("sha256").update(`${token}:${index}`).digest();
      const position = digest.readUInt32BE(0) % dimensions;
      const sign = digest[4] % 2 === 0 ? 1 : -1;
      const weight = token.length > 5 ? 1.25 : 1;
      vector[position] += sign * weight;
    }
  }

  return normalize(vector);
}

export function toFloat32Buffer(vector: number[]): Buffer {
  const buffer = Buffer.allocUnsafe(vector.length * Float32Array.BYTES_PER_ELEMENT);
  vector.forEach((value, index) => buffer.writeFloatLE(value, index * Float32Array.BYTES_PER_ELEMENT));
  return buffer;
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || left.length === 0) {
    return 0;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export function createEmbeddingClient(serviceUrl: string): { embedText: EmbedText } {
  if (serviceUrl.startsWith("local://")) {
    return {
      async embedText(text: string): Promise<number[]> {
        return deterministicEmbedding(text);
      },
    };
  }

  const normalizedUrl = serviceUrl.replace(/\/$/, "");

  return {
    async embedText(text: string): Promise<number[]> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);

      try {
        const response = await fetch(`${normalizedUrl}/embed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`embedding_service_${response.status}`);
        }

        const body = (await response.json()) as { embedding?: unknown };
        if (!Array.isArray(body.embedding) || body.embedding.length !== EMBEDDING_DIMENSIONS) {
          throw new Error("embedding_service_invalid_payload");
        }

        return normalize(body.embedding.map((value) => Number(value)));
      } catch {
        return deterministicEmbedding(text);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 1);
}

function expandSemanticTokens(tokens: string[]): string[] {
  const synonyms: Record<string, string[]> = {
    audio: ["headphones", "studio", "sound", "music"],
    backpack: ["bag", "travel", "carry", "laptop"],
    bottle: ["hydration", "water", "smart"],
    charger: ["power", "travel", "usb", "adapter"],
    desk: ["lamp", "stand", "workstation", "office"],
    headphones: ["audio", "sound", "music", "studio"],
    hub: ["adapter", "usb", "ports", "dock"],
    keyboard: ["typing", "keys", "wireless", "desk"],
    lamp: ["lighting", "desk", "reading"],
    laptop: ["stand", "ergonomic", "desk", "portable"],
    mouse: ["cursor", "ergonomic", "wireless", "desk"],
    notebook: ["paper", "notes", "writing", "office"],
    typing: ["keyboard", "keys", "wireless"],
    wireless: ["keyboard", "mouse", "portable"],
  };

  const expanded = [...tokens];
  for (const token of tokens) {
    expanded.push(...(synonyms[token] ?? []));
  }

  return expanded;
}

function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
}
