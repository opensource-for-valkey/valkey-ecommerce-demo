import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_SEARCH_API || "http://localhost:4000/api/search/image";

const ImageSearchSection = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [tagFilter, setTagFilter] = useState(null);
  const [textQuery, setTextQuery] = useState("");
  const inputRef = useRef(null);

  // Tag counts for filter chips
  const tagCounts = results.reduce((acc, r) => {
    if (!r.tag) return acc;
    acc[r.tag] = (acc[r.tag] || 0) + 1;
    return acc;
  }, {});
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  const q = textQuery.trim().toLowerCase();
  const filteredResults = results.filter((r) => {
    if (tagFilter && r.tag !== tagFilter) return false;
    if (q && !`${r.name} ${r.tag}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResults([]);
    setTagFilter(null);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onSearch = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setResults(data.results || []);
      setTagFilter(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResults([]);
    setError(null);
    setTagFilter(null);
  };

  return (
    <section className="py-80">
      <div className="container container-lg">
        <div className="text-center mb-40">
          <h2 className="mb-12">Search by Image</h2>
          <p className="text-gray-600">
            Drop a photo or paste an image — we'll find visually similar products using CLIP + Valkey.
          </p>
        </div>

        {/* Text search bar */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto 36px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #ececec",
            background: "#fafafa",
            borderRadius: 999,
            padding: "8px 16px",
            boxShadow: "0 6px 18px -12px rgba(15, 15, 16, 0.18)",
          }}
        >
          <i className="ph ph-magnifying-glass" style={{ fontSize: 18, color: "#6a6a70" }} />
          <input
            type="search"
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder={
              results.length > 0
                ? "Filter results by product name..."
                : "Type a product name (or upload an image below)"
            }
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: "transparent",
              fontSize: 14,
              padding: "8px 4px",
            }}
          />
          {textQuery && (
            <button
              type="button"
              onClick={() => setTextQuery("")}
              style={{
                border: 0,
                background: "transparent",
                cursor: "pointer",
                color: "#6a6a70",
                fontSize: 18,
                padding: "4px 8px",
              }}
              aria-label="Clear"
            >
              <i className="ph ph-x" />
            </button>
          )}
        </div>

        <div className="row g-4">
          {/* Upload card */}
          <div className="col-lg-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              onPaste={(e) => {
                const item = [...e.clipboardData.items].find((i) =>
                  i.type.startsWith("image/"),
                );
                if (item) handleFile(item.getAsFile());
              }}
              tabIndex={0}
              style={{
                border: `2px dashed ${dragOver ? "#0f0f10" : "#d4d4d8"}`,
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "#f5f5f5" : "#fafafa",
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="query"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 220,
                      borderRadius: 12,
                      objectFit: "contain",
                      marginBottom: 16,
                    }}
                  />
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-main"
                      onClick={(e) => { e.stopPropagation(); onSearch(); }}
                      disabled={loading}
                    >
                      {loading ? "Searching..." : "Find similar"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-main"
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                    >
                      Clear
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <i
                    className="ph ph-image-square"
                    style={{ fontSize: 56, color: "#9ca3af", marginBottom: 12 }}
                  />
                  <h6 className="mb-8">Drop, paste, or click to upload</h6>
                  <p className="text-gray-500 mb-0">
                    JPG, PNG up to 10 MB
                  </p>
                </>
              )}
            </div>
            {error && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 8,
                  background: "#fef2f2",
                  color: "#991b1b",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="col-lg-8">
            {loading && (
              <div className="text-center py-80">
                <div className="spinner-border" role="status" />
                <p className="mt-3 text-gray-600">
                  Embedding image and querying Valkey...
                </p>
              </div>
            )}

            {!loading && results.length === 0 && (
              <div
                style={{
                  border: "1px solid #ececec",
                  borderRadius: 16,
                  padding: 48,
                  textAlign: "center",
                  color: "#6a6a70",
                  minHeight: 360,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <i
                  className="ph ph-magnifying-glass"
                  style={{ fontSize: 48, marginBottom: 12 }}
                />
                <p className="mb-0">
                  Upload an image to see similar products.
                </p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                {(() => {
                  const top = Number(results[0]?.similarity);
                  if (!Number.isFinite(top) || top >= 0.6) return null;
                  return (
                    <div
                      style={{
                        marginBottom: 16,
                        padding: 12,
                        borderRadius: 8,
                        background: "#fffbeb",
                        color: "#92400e",
                        fontSize: 13,
                      }}
                    >
                      Top match is only {Math.round(top * 100)}% similar — your
                      catalog may not have items like this image.
                    </div>
                  );
                })()}

                {/* Category filter chips */}
                {sortedTags.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 16,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#6a6a70", marginRight: 4 }}>
                      Filter:
                    </span>
                    <button
                      type="button"
                      onClick={() => setTagFilter(null)}
                      style={{
                        border: "1px solid",
                        borderColor: tagFilter === null ? "#0f0f10" : "#ececec",
                        background: tagFilter === null ? "#0f0f10" : "white",
                        color: tagFilter === null ? "white" : "#0f0f10",
                        borderRadius: 999,
                        padding: "4px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      All ({results.length})
                    </button>
                    {sortedTags.map(([tag, count]) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setTagFilter(tag)}
                        style={{
                          border: "1px solid",
                          borderColor: tagFilter === tag ? "#0f0f10" : "#ececec",
                          background: tagFilter === tag ? "#0f0f10" : "white",
                          color: tagFilter === tag ? "white" : "#0f0f10",
                          borderRadius: 999,
                          padding: "4px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {tag} ({count})
                      </button>
                    ))}
                  </div>
                )}

                <div className="row g-3">
                  {filteredResults.map((r) => {
                    const sim = Number(r.similarity);
                    const pct = Number.isFinite(sim) ? Math.round(sim * 100) : null;
                    const badgeBg =
                      pct == null ? "#6a6a70"
                        : pct >= 75 ? "#16a34a"
                        : pct >= 50 ? "#ca8a04"
                        : "#dc2626";
                    return (
                      <div className="col-md-4 col-sm-6" key={r.id}>
                        <div
                          style={{
                            border: "1px solid #ececec",
                            borderRadius: 16,
                            padding: 12,
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              background: "#f5f5f5",
                              borderRadius: 12,
                              aspectRatio: "1 / 1",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            {r.image ? (
                              <img
                                src={r.image}
                                alt={r.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <i
                                className="ph ph-image"
                                style={{ fontSize: 36, color: "#9ca3af" }}
                              />
                            )}
                            {pct != null && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  background: badgeBg,
                                  color: "white",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: "3px 8px",
                                  borderRadius: 999,
                                }}
                              >
                                {pct}% match
                              </span>
                            )}
                          </div>
                          <h6 className="mt-12 mb-4">{r.name}</h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-gray-500" style={{ fontSize: 12 }}>
                              {r.tag} · ★ {r.rating}
                            </span>
                            <span className="fw-semibold">{r.price}</span>
                          </div>
                          <Link
                            to="/cart"
                            className="btn btn-main w-100 mt-12"
                            style={{ fontSize: 13 }}
                          >
                            Add to Cart
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSearchSection;
