import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import { fetchCategories, fetchProducts } from "../lib/api";

/* ── Category-mapped product imagery ──────────────────────────────────── */
const CATEGORY_IMAGES = {
  "fashion":                "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600",
  "gaming":                 "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
  "study-setup":            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  "tech-accessories":       "https://images.unsplash.com/photo-1527443060795-0402a218f96c?w=600",
  "footwear":               "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  "streetwear":             "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
  "gift-ideas":             "https://images.unsplash.com/photo-1543589923-d8253ab36c61?w=600",
  "monochrome-collection":  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
};

const BottleArt = ({ category, label }) => (
  <div style={{ width: "100%", height: "100%", background: "#EFE7D6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    {CATEGORY_IMAGES[category] ? (
      <img
        src={CATEGORY_IMAGES[category]}
        alt={label || category}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loading="lazy"
      />
    ) : null}
  </div>
);

const HeroSprig = () => (
  <svg viewBox="0 0 220 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 60 Q 80 40 110 40 Q 140 40 220 60" stroke="#C5A572" strokeOpacity=".6" strokeWidth="0.6" fill="none"/>
    <g fill="#7A8A5C" fillOpacity=".55">
      <path d="M30 56 C 20 50 14 38 22 32 C 28 38 32 48 30 56 Z"/>
      <path d="M58 50 C 50 44 46 32 54 26 C 60 32 62 42 58 50 Z"/>
      <path d="M168 56 C 178 50 184 38 176 32 C 170 38 166 48 168 56 Z"/>
      <path d="M196 50 C 204 44 208 32 200 26 C 194 32 192 42 196 50 Z"/>
    </g>
    <circle cx="110" cy="40" r="3" fill="#5A1E22"/>
  </svg>
);

const SORTS = [
  { id: "relevance", apiSort: "relevance", label: "Lunar release" },
  { id: "newest",    apiSort: "newest",    label: "Newest first" },
  { id: "price-asc", apiSort: "price-asc", label: "Price · low to high" },
  { id: "price-desc",apiSort: "price-desc",label: "Price · high to low" },
];

const fmtPrice = (p) =>
  typeof p === "number" ? `£${p % 1 === 0 ? p : p.toFixed(2)}` : (p || "");

const productSlug = (p) => p.slugId || p.slug || p.id || p.productId;

const CategoryPage = () => {
  const { slug = "" } = useParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchCategories(),
      fetchProducts({ category: slug, sort, pageSize: 60 }),
    ])
      .then(([cats, page]) => {
        if (cancelled) return;
        setCategories(cats);
        setCategory(cats.find((c) => c.slug === slug) || null);
        setProducts(page.items || []);
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, sort]);

  const display = category?.label
    || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    || "Catalogue";
  const tagline = category?.tagline || "Edited in the small hours by hand.";
  const firstWord = display.split(" ")[0];
  const restWords = display.split(" ").slice(1).join(" ");

  const priceRange = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.map((p) => Number(p.price)).filter((n) => !isNaN(n));
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  return (
    <>
      <Preloader />
      <ScrollToTop smooth color="#5A1E22" />
      <ColorInit color={false} />
      <HeaderTwo />

      {/* HERO */}
      <section className="noct-cat-hero">
        <div className="container container-lg">
          <div className="noct-cat-hero__inner">
            <div className="noct-cat-hero__rail">
              <span className="noct-cat-hero__label">Catalogue / Catégorie</span>
              <ul className="noct-cat-hero__breadcrumb">
                <li><Link to="/">Maison</Link></li>
                <li>›</li>
                <li><Link to="/shop">Editions</Link></li>
                <li>›</li>
                <li><b>{display}</b></li>
              </ul>
            </div>
            <h1 className="noct-cat-hero__title">
              <em>{firstWord}</em>{restWords ? " " + restWords : ""}
            </h1>
            <div className="noct-cat-hero__sprig"><HeroSprig /></div>
            <p className="noct-cat-hero__sub">{tagline}</p>
          </div>
        </div>
      </section>

      <section className="noct-cat-body">
        <div className="container container-lg">
          {error && (
            <div className="empty-cart" style={{ borderColor: "#9c2a2a" }}>
              <p>Catalogue unreachable: {error}. Is the API running at <code>http://localhost:4000/api</code>?</p>
            </div>
          )}

          <div className="row gy-4">
            {/* LEFT RAIL */}
            <aside className="col-lg-3">
              <div className="noct-cat-rail">
                <h6 className="noct-cat-rail__title">Categories</h6>
                <ul className="noct-cat-rail__list">
                  {(categories.length ? categories : [{ slug, label: display }]).map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/category/${c.slug}`}
                        className={c.slug === slug ? "is-active" : ""}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="noct-cat-rail">
                <h6 className="noct-cat-rail__title">Price · in £</h6>
                <div className="noct-cat-rail__price">
                  <div className="noct-cat-rail__price-track">
                    <span style={{ width: "62%" }} />
                  </div>
                  <div className="noct-cat-rail__price-marks">
                    <span>£{priceRange.min || 0}</span>
                    <span>£{priceRange.max || 0}</span>
                  </div>
                </div>
              </div>

              <div className="noct-cat-rail">
                <h6 className="noct-cat-rail__title">Filter by</h6>
                <ul className="noct-cat-rail__chips">
                  {["In stock", "Made-to-order", "Last lot", "New", "Boxed"].map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <div className="col-lg-9">
              <div className="noct-cat-toolbar">
                <div className="noct-cat-toolbar__count">
                  <b>{String(products.length).padStart(2, "0")}</b>
                  &nbsp;editions in&nbsp;<em>{display}</em>
                </div>
                <div className="noct-cat-toolbar__sort">
                  <span>Sort</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.apiSort}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="empty-cart"><p>Loading editions…</p></div>
              ) : products.length === 0 ? (
                <div className="empty-cart">
                  <p>No editions found in this category yet.</p>
                  <p style={{ marginTop: 12, fontSize: 14, color: "#8E7042" }}>
                    Try one of the categories on the left, or visit the
                    <Link to="/shop" style={{ color: "#5A1E22", padding: "0 6px" }}>full catalogue</Link>.
                  </p>
                </div>
              ) : (
                <div className="noct-cat-grid">
                  {products.map((p, i) => (
                    <article className="noct-cat-card" key={p.productId || p.id}>
                      <Link to={`/product/${productSlug(p)}`} className="noct-cat-card__image">
                        <span className="noct-cat-card__lot">{`LOT N.0${(i % 8) + 1}—${"ABCDEFGHI"[i % 9]}`}</span>
                        <span className="noct-cat-card__num">{`N° ${i + 1}`}</span>
                        {p.badge && <span className="noct-cat-card__chip">{p.badge}</span>}
                        <BottleArt category={p.category} label={p.name} />
                      </Link>
                      <div className="noct-cat-card__body">
                        <span className="noct-cat-card__latin">{p.subtitle}</span>
                        <Link to={`/product/${productSlug(p)}`} className="noct-cat-card__title-link">
                          <h3 className="noct-cat-card__title">{p.name}</h3>
                        </Link>
                        <p className="noct-cat-card__notes">{p.description}</p>
                        <div className="noct-cat-card__foot">
                          <span className="noct-cat-card__price">
                            {fmtPrice(p.price)}
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="noct-cat-card__crossed">{fmtPrice(p.originalPrice)}</span>
                            )}
                          </span>
                          <button
                            type="button"
                            className="product-card__cart noct-cat-card__acquire"
                            data-product={productSlug(p)}
                            data-product-name={p.name}
                          >
                            Acquire →
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {products.length > 6 && (
                <nav className="noct-cat-pagination" aria-label="Pagination">
                  <button className="is-active">01</button>
                  <button>02</button>
                  <button>Next →</button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>

      <FooterOne />
      <BottomFooter />
    </>
  );
};

export default CategoryPage;
