/**
 * CLIP embedding helper using @xenova/transformers.
 * Same model embeds catalog images (at seed time) and the user's query image
 * (at search time) so vectors live in the same space.
 */
import { AutoProcessor, CLIPVisionModelWithProjection, RawImage } from "@xenova/transformers";

const MODEL_ID = "Xenova/clip-vit-base-patch32";

let processorPromise = null;
let modelPromise = null;

function getProcessor() {
  if (!processorPromise) processorPromise = AutoProcessor.from_pretrained(MODEL_ID);
  return processorPromise;
}

function getModel() {
  if (!modelPromise) modelPromise = CLIPVisionModelWithProjection.from_pretrained(MODEL_ID);
  return modelPromise;
}

export async function warmup() {
  await Promise.all([getProcessor(), getModel()]);
}

/**
 * Returns a normalized 512-dim Float32Array embedding for an image.
 * @param {string|Buffer|Blob} source - URL, file path, Buffer, or Blob.
 */
export async function embedImage(source) {
  const image =
    source instanceof Buffer
      ? await RawImage.fromBlob(new Blob([source]))
      : await RawImage.read(source);

  const processor = await getProcessor();
  const model = await getModel();

  const inputs = await processor(image);
  const { image_embeds } = await model(inputs);

  const vec = image_embeds.data;
  // L2 normalize so cosine distance == 1 - dot(a, b)
  let norm = 0;
  for (let i = 0; i < vec.length; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  const out = new Float32Array(vec.length);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i] / norm;
  return out;
}

/** Serialize a Float32Array as the raw little-endian byte buffer Valkey expects. */
export function vectorToBuffer(float32) {
  return Buffer.from(float32.buffer, float32.byteOffset, float32.byteLength);
}
