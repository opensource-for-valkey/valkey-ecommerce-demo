import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import ColorInit from "../helper/ColorInit";
import { MOCK_CATEGORIES, mockFilter } from "../helper/mockCatalog";
import ProductImage from "../components/common/ProductImage";
import { CATEGORY_ART } from "../lib/category-art";

const CATALOG_URL =
  process.env.REACT_APP_CATALOG_URL || "http://localhost:4000/api";

const buildMockPreviews = (cats) =>
  Object.fromEntries(
    cats.map((c) => [c.slug, mockFilter({ category: c.slug, limit: 4 }).items])
  );

const CategoriesPage = () => {
  const [cats, setCats] = useState(MOCK_CATEGORIES);
  const [previews, setPreviews] = useState(() => buildMockPreviews(MOCK_CATEGORIES));
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`${CATALOG_URL}/categories`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(async (d) => {
        if (cancelled) return;
        const items = (d.items && d.items.length) ? d.items : MOCK_CATEGORIES;
        setCats(items);

        const entries = await Promise.all(
          items.map(async (c) => {
            try {
              const res = await fetch(
                `${CATALOG_URL}/products?category=${c.slug}&pageSize=4`,
              );
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const j = await res.json();
              const live = j.items || [];
              if (live.length > 0) return [c.slug, live];
            } catch {
              /* fall through to mock */
            }
            return [c.slug, mockFilter({ category: c.slug, limit: 4 }).items];
          }),
        );
        if (!cancelled) {
          setPreviews(Object.fromEntries(entries));
          // Consider it backend-driven if at least one category returned live data
          // matching backend (use a heuristic: presence of non-mock fields).
          const anyLive = entries.some(([, list]) => list.some((p) => p.reviewCount && p.reviewCount > 0 && typeof p.image === "string"));
          setUsingMock(!anyLive);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setCats(MOCK_CATEGORIES);
        setPreviews(buildMockPreviews(MOCK_CATEGORIES));
        setUsingMock(true);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ColorInit color={true} />
      <HeaderTwo category={true} />

      <section className="py-80">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-32">
            <h3 className="mb-0">Shop by category</h3>
            <Link to="/" className="text-main-600">← Home</Link>
          </div>

          {loading && <p>Loading categories…</p>}
          {error && (
            <div className="alert alert-warning">
              Backend unavailable ({error}). Showing demo items.
            </div>
          )}
          {!error && usingMock && !loading && (
            <div className="alert alert-info">
              Showing demo catalog (backend returned no items yet).
            </div>
          )}

          <div className="row gy-32">
            {cats.map((c) => {
              const items = previews[c.slug] || [];
              return (
                <div key={c.slug} className="col-lg-6">
                  <Link
                    to={`/category/${c.slug}`}
                    className="d-block border rounded p-24 text-decoration-none text-dark hover-border-main-600 h-100"
                  >
                    <div className="d-flex align-items-center justify-content-between mb-16">
                      <div className="d-flex align-items-center gap-12">
                        <i className={`ph ${c.icon} text-2xl text-main-600`} />
                        <h5 className="mb-0">{c.label}</h5>
                      </div>
                      <span className="text-sm text-neutral-500">{items.length} shown →</span>
                    </div>

                    <div className="row gx-12">
                      {items.length === 0 && (
                        <div className="col-12">
                          <div className="text-center text-neutral-400 py-24">No products</div>
                        </div>
                      )}
                      {items.map((p) => (
                        <div key={p.productId} className="col-3">
                          <div style={{ borderRadius: 6, overflow: "hidden" }}>
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              ratio="1/1"
                              width={240}
                            />
                          </div>
                          <p className="text-xs text-line-2 mt-8 mb-0">{p.name}</p>
                          <p className="text-xs text-main-600 fw-bold mb-0">${p.price}</p>
                        </div>
                      ))}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterTwo />
    </>
  );
};

export default CategoriesPage;
