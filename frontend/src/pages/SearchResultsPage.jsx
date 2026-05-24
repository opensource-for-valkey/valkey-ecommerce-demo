import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import ColorInit from "../helper/ColorInit";
import { mockFilter, parseNL } from "../helper/mockCatalog";
import ProductImage from "../components/common/ProductImage";
import { fetchCategories } from "../lib/api";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api/agent";

const buildMockResults = (q) => {
  const filters = parseNL(q);
  const { items, total } = mockFilter({ ...filters, q, limit: 12 });
  const summaryParts = [];
  if (filters.category) summaryParts.push(filters.category.replace(/-/g, " "));
  if (typeof filters.maxPrice === "number") summaryParts.push(`under $${filters.maxPrice}`);
  if (typeof filters.minPrice === "number") summaryParts.push(`over $${filters.minPrice}`);
  const summary = items.length
    ? `Showing ${items.length}${total > items.length ? ` of ${total}` : ""} ${summaryParts.join(" ") || "matches"} (demo).`
    : `No demo items matched "${q}".`;
  return {
    response: summary,
    results: items.map((p) => ({
      productId: p.productId,
      name: p.name,
      price: p.price,
      rating: p.rating,
      category: p.category,
      tags: p.tags || [],
      description: p.description,
      image: p.image,
      reason: filters.category
        ? `Matches ${filters.category}${typeof filters.maxPrice === "number" ? ` under $${filters.maxPrice}` : ""}`
        : `Matches "${q}"`,
    })),
    debug: { mock: true, parsedFromQuery: filters },
  };
};

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchCategories().then((cats) => { if (!cancelled) setAllCategories(cats); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!q) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);
    setUsingMock(false);

    let sid = localStorage.getItem("agent_sid");
    if (!sid) {
      sid = `web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem("agent_sid", sid);
    }

    fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, message: q }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        // Backend told us the query is outside the catalog — respect it, don't
        // paper over with demo items.
        if (json.notInCatalog) {
          setData({ ...json, results: [] });
          return;
        }
        if (Array.isArray(json.results) && json.results.length > 0) {
          // Apply client-side NL filter to enforce user spec (e.g., "under $50") in
          // case the backend's NLU missed it.
          const nl = parseNL(q);
          let results = json.results.slice();
          if (nl.category) {
            const filtered = results.filter((p) => p.category === nl.category);
            if (filtered.length) results = filtered;
          }
          if (typeof nl.maxPrice === "number") {
            results = results.filter((p) => Number(p.price) <= nl.maxPrice);
          }
          if (typeof nl.minPrice === "number") {
            results = results.filter((p) => Number(p.price) >= nl.minPrice);
          }
          setData({ ...json, results });
        } else {
          // Backend returned no results. Try mock to see if we have anything
          // local; if the mock also returns nothing, surface "not in catalog".
          const mock = buildMockResults(q);
          if (mock.results.length === 0) {
            setData({
              response: `Sorry — "${q}" isn't in our catalog right now. We carry electronics, food & groceries, sports & fitness, and stationery.`,
              results: [],
              followUp: ["Try sports, stationery, food, or headphones."],
              notInCatalog: true,
              debug: { mock: true, parsedFromQuery: parseNL(q) },
            });
          } else {
            setData(mock);
            setUsingMock(true);
          }
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setData(buildMockResults(q));
        setUsingMock(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <>
      <ColorInit color={true} />
      <HeaderTwo category={true} />

      <section className="py-80">
        <div className="container">
          <h4 className="mb-16">Search results for: <span className="text-main-600">{q}</span></h4>

          {loading && <p>Searching...</p>}
          {error && (
            <div className="alert alert-warning">
              Backend unavailable ({error}) — showing demo results below.
            </div>
          )}
          {!error && usingMock && !loading && (
            <div className="alert alert-info">Demo results (backend returned nothing or your query needed a stricter filter).</div>
          )}

          {data && data.notInCatalog && (
            <div className="alert alert-warning">
              <strong>Not in our catalogue right now.</strong> "{q}" doesn't match any product or category we carry.
              <div className="mt-8 text-sm">Try one of these instead:</div>
              <div className="d-flex gap-8 flex-wrap mt-8">
                {(allCategories.length ? allCategories : [
                  { slug: "fashion", label: "Fashion" },
                  { slug: "footwear", label: "Footwear" },
                  { slug: "gaming", label: "Gaming" },
                  { slug: "study-setup", label: "Study Setup" },
                  { slug: "gift-ideas", label: "Gift Ideas" },
                ]).map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`} className="btn btn-sm btn-outline-main">{c.label}</Link>
                ))}
                <Link to="/categories" className="btn btn-sm btn-outline-main">All categories</Link>
              </div>
            </div>
          )}

          {data && !data.notInCatalog && (
            <>
              {data.response && (
                <div className="bg-neutral-50 p-16 rounded mb-24">
                  <strong>Agent:</strong> {data.response}
                </div>
              )}

              {Array.isArray(data.results) && data.results.length > 0 ? (
                <div className="row gy-24">
                  {data.results.map((p, idx) => (
                    <div key={p.productId} className="col-lg-3 col-md-4 col-sm-6">
                      <Link
                        to={`/category/${p.category}`}
                        className="d-block border rounded p-16 h-100 text-decoration-none text-dark hover-border-main-600"
                      >
                        <div className="mb-12" style={{ borderRadius: 8, overflow: "hidden" }}>
                          <ProductImage
                            src={p.image}
                            alt={p.name}
                            ratio="1/1"
                            width={400}
                            priority={idx < 4}
                          />
                        </div>
                        <h6 className="mb-8">{p.name}</h6>
                        <p className="text-sm text-neutral-600 mb-8">
                          {p.category}{p.tags ? ` · ${p.tags.slice(0, 3).join(", ")}` : ""}
                        </p>
                        <p className="text-sm mb-8 text-line-2">{p.description}</p>
                        <div className="d-flex justify-content-between">
                          <strong className="text-main-600">${p.price}</strong>
                          <span>★ {p.rating}</span>
                        </div>
                        {p.reason && (
                          <p className="text-xs text-neutral-500 mt-8">
                            <em>{p.reason}</em>
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No products matched.</p>
              )}

              {Array.isArray(data.followUp) && data.followUp.length > 0 && (
                <div className="mt-24">
                  <strong>Follow up:</strong>
                  <ul>
                    {data.followUp.map((f, i) => (
                      <li key={i}>{typeof f === "string" ? f : f.text || JSON.stringify(f)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <details className="mt-24">
                <summary>Debug</summary>
                <pre className="text-xs">{JSON.stringify(data.debug, null, 2)}</pre>
              </details>
            </>
          )}

          <p className="mt-24">
            <Link to="/">← Back home</Link>
          </p>
        </div>
      </section>

      <FooterTwo />
    </>
  );
};

export default SearchResultsPage;
