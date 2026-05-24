// Local sentence-transformer pipeline. Lazy-loads the model on first use so
// the API doesn't pay the cold-start cost during boot.
//
// Model: Xenova/all-MiniLM-L6-v2 — 384-dim, ~22 MB quantized, runs on CPU in
// Node via @huggingface/transformers. First call downloads weights (cached
// in ~/.cache/huggingface).

const MODEL_ID = process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
const DIM = 384;

let pipelinePromise = null;

async function getPipeline() {
    if (!pipelinePromise) {
        pipelinePromise = (async () => {
            const { pipeline, env } = await import("@huggingface/transformers");
            // Make sure we use the local model cache, not a remote URL.
            env.allowLocalModels = true;
            env.allowRemoteModels = true;
            console.log(`[embeddings] loading ${MODEL_ID}…`);
            const t = Date.now();
            const pipe = await pipeline("feature-extraction", MODEL_ID, {
                quantized: true,
            });
            console.log(`[embeddings] ready (${Date.now() - t}ms)`);
            return pipe;
        })();
    }
    return pipelinePromise;
}

// Returns a Float32Array of length DIM, mean-pooled and L2-normalized.
async function embed(text) {
    if (!text || typeof text !== "string") {
        throw new Error("embed(text): text must be a non-empty string");
    }
    const pipe = await getPipeline();
    const output = await pipe(text, { pooling: "mean", normalize: true });
    // output.data is a Float32Array of length DIM
    return output.data;
}

// Batch helper.
async function embedAll(texts) {
    const out = new Array(texts.length);
    // Run sequentially; @huggingface/transformers in Node isn't great at
    // batching tiny inputs, and we have <100 products to embed.
    for (let i = 0; i < texts.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        out[i] = await embed(texts[i]);
    }
    return out;
}

module.exports = { embed, embedAll, MODEL_ID, DIM };
