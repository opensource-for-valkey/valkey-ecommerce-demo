from functools import lru_cache
from typing import List

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSIONS = 384

app = FastAPI(title="Valkey E-Commerce Embedding Service")


class EmbedRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


class BatchEmbedRequest(BaseModel):
    texts: List[str] = Field(min_length=1, max_length=128)


@lru_cache(maxsize=1)
def model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME)


def encode(texts: List[str]) -> List[List[float]]:
    vectors = model().encode(texts, normalize_embeddings=True)
    vectors = np.asarray(vectors, dtype=np.float32)
    return vectors.tolist()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model": MODEL_NAME, "dimensions": EMBEDDING_DIMENSIONS}


@app.post("/embed")
def embed(request: EmbedRequest) -> dict:
    return {"embedding": encode([request.text])[0]}


@app.post("/embed/batch")
def embed_batch(request: BatchEmbedRequest) -> dict:
    return {"embeddings": encode(request.texts)}
