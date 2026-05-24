/**
 * Express server exposing visual search endpoints.
 *
 *   POST /api/search/image   multipart/form-data  field: "image"
 *   GET  /api/health
 *
 * Flow: upload -> CLIP embed -> Valkey KNN -> JSON product list.
 */
import express from "express";
import cors from "cors";
import multer from "multer";
import { embedImage, vectorToBuffer, warmup } from "./lib/embed.mjs";
import { ensureIndex, knnSearch, countProducts, indexInfo } from "./lib/valkey.mjs";

const PORT = Number(process.env.PORT || 4000);
const TOP_K = Number(process.env.TOP_K || 24);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/debug", async (_req, res) => {
  const count = await countProducts();
  const info = await indexInfo();
  res.json({ productCount: count, index: info });
});

app.post("/api/search/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "image file required" });
  try {
    console.log(`[search] received image ${req.file.mimetype} ${req.file.size}b`);
    const vec = await embedImage(req.file.buffer);
    console.log(`[search] embedded -> ${vec.length} dim vector`);
    const results = await knnSearch(vectorToBuffer(vec), TOP_K);
    console.log(`[search] valkey returned ${results.length} hits`);
    res.json({ count: results.length, results });
  } catch (err) {
    console.error("[search] error name :", err?.name);
    console.error("[search] error msg  :", err?.message);
    console.error("[search] error stack:", err?.stack);
    res.status(500).json({ error: err?.message || String(err), name: err?.name });
  }
});

async function start() {
  console.log("[server] warming model + ensuring vector index...");
  await Promise.all([warmup(), ensureIndex()]);
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("[server] fatal:", err);
  process.exit(1);
});
