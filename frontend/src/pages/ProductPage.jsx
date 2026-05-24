import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import { fetchProduct, fetchProducts, fetchCategories, fetchSimilar } from "../lib/api";

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

const fmtPrice = (p) =>
  typeof p === "number" ? `£${p % 1 === 0 ? p : p.toFixed(2)}` : (p || "");
const productSlug = (p) => p.slugId || p.slug || p.id || p.productId;

const ProductPage = () => {
  const { id = "" } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setRelated([]);

    (async () => {
      try {
        const p = await fetchProduct(id);
        if (cancelled) return;
        if (!p) {
          setProduct(null);
          return;
        }
        setProduct(p);

        // Category meta + related — best-effort, don't block render.
        Promise.all([
          fetchCategories().then((cats) => cats.find((c) => c.slug === p.category) || null),
          // Prefer similar API; fall back to a category list.
          fetchSimilar(p.productId, 4).catch(() => null).then(async (sim) => {
            if (sim && sim.length) return sim;
            const page = await fetchProducts({ category: p.category, pageSize: 8 });
            return (page.items || []).filter((q) => q.productId !== p.productId).slice(0, 4);
          }),
        ]).then(([cat, rel]) => {
          if (cancelled) return;
          setCategory(cat);
          setRelated(rel || []);
        }).catch(() => { /* non-fatal */ });
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Preloader />
        <ColorInit color={false} />
        <HeaderTwo />
        <section className="noct-cat-body">
          <div className="container container-lg">
            <div className="empty-cart"><p>Loading edition…</p></div>
          </div>
        </section>
        <FooterOne />
        <BottomFooter />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Preloader />
        <ColorInit color={false} />
        <HeaderTwo />
        <section className="noct-cat-body">
          <div className="container container-lg">
            <div className="empty-cart">
              <p>{error ? `Catalogue error: ${error}` : "That edition isn't in the catalogue."}</p>
              <Link to="/shop" style={{ color: "#5A1E22", padding: "12px 0", display: "inline-block" }}>
                ← Return to the catalogue
              </Link>
            </div>
          </div>
        </section>
        <FooterOne />
        <BottomFooter />
      </>
    );
  }

  const lotId = (product.productId || "").slice(-3).toUpperCase() || "07A";

  return (
    <>
      <Preloader />
      <ScrollToTop smooth color="#5A1E22" />
      <ColorInit color={false} />
      <HeaderTwo />

      <section className="noct-product">
        <div className="container container-lg">
          {/* Breadcrumb */}
          <ul className="noct-product__breadcrumb">
            <li><Link to="/">Maison</Link></li>
            <li>›</li>
            <li><Link to="/shop">Editions</Link></li>
            <li>›</li>
            <li><Link to={`/category/${product.category}`}>{category?.label || product.category}</Link></li>
            <li>›</li>
            <li><b>{product.name}</b></li>
          </ul>

          <div className="row gy-5">
            {/* GALLERY */}
            <div className="col-lg-7">
              <div className="noct-product__gallery">
                <div className="noct-product__gallery-main">
                  <span className="noct-product__lot">{`LOT N.07 — ${lotId}`}</span>
                  <BottleArt category={product.category} label={product.name} />
                </div>
                <div className="noct-product__gallery-thumbs">
                  {[0, 1, 2].map((i) => (
                    <button key={i} className={`noct-product__gallery-thumb ${i === 0 ? "is-active" : ""}`}>
                      <BottleArt category={product.category} label={product.name} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="col-lg-5">
              <div className="noct-product__info">
                <span className="noct-product__category">
                  <Link to={`/category/${product.category}`}>{category?.label || product.category}</Link>
                  &nbsp;·&nbsp;Édition iv
                </span>
                <h1 className="noct-product__title">{product.name}</h1>
                <p className="noct-product__sub">{product.subtitle}</p>

                <div className="noct-product__rating">
                  <span aria-hidden="true">✦ ✦ ✦ ✦ ✦</span>
                  <small>{product.rating ?? 4.8} · {product.reviewCount ?? 124} letters of correspondence</small>
                </div>

                <div className="noct-product__price">
                  <span className="noct-product__price-main">{fmtPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="noct-product__price-old">{fmtPrice(product.originalPrice)}</span>
                  )}
                  {product.badge && <span className="noct-product__price-chip">{product.badge}</span>}
                </div>

                <p className="noct-product__desc">{product.description}</p>

                <ul className="noct-product__facts">
                  <li><span>Hand-numbered</span><b>Yes</b></li>
                  <li><span>Atelier</span><b>Hackney Wick · E15</b></li>
                  <li><span>Lot</span><b>{`N.${lotId}`}</b></li>
                  <li><span>In stock</span><b>{product.inStock ? `${product.stock} on shelf` : "Out of stock"}</b></li>
                  <li><span>Ships within</span><b>3–5 working days</b></li>
                </ul>

                <div className="noct-product__qty">
                  <span className="noct-product__qty-label">Quantity</span>
                  <div className="noct-product__qty-control">
                    <button type="button" aria-label="decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                    <input type="text" value={qty} readOnly aria-label="quantity" />
                    <button type="button" aria-label="increase" onClick={() => setQty((q) => q + 1)}>+</button>
                  </div>
                </div>

                <div className="noct-product__actions">
                  <button
                    type="button"
                    className="product-card__cart noct-product__acquire"
                    data-product={productSlug(product)}
                    data-product-name={product.name}
                  >
                    Acquire — {fmtPrice(product.price)}
                  </button>
                  <button
                    type="button"
                    className="noct-product__wishlist"
                    aria-label="Add to wishlist"
                  >
                    <i className="ph ph-heart" aria-hidden="true" /> Save
                  </button>
                </div>

                <p className="noct-product__post">
                  Free post within the British Isles on orders over £140 · returns within 30 days
                </p>
              </div>
            </div>
          </div>

          {/* RELATED */}
          {related.length > 0 && (
            <section className="noct-product__related">
              <div className="noct-product__related-head">
                <h2>You may also <em>regard</em></h2>
                <Link to={`/category/${product.category}`} className="noct-product__related-link">
                  All of {category?.label || product.category} →
                </Link>
              </div>
              <div className="noct-cat-grid">
                {related.map((p, i) => (
                  <article className="noct-cat-card" key={p.productId || p.id}>
                    <Link to={`/product/${productSlug(p)}`} className="noct-cat-card__image">
                      <span className="noct-cat-card__lot">{`LOT N.0${(i % 8) + 1}`}</span>
                      <span className="noct-cat-card__num">{`N° ${i + 1}`}</span>
                      {p.badge && <span className="noct-cat-card__chip">{p.badge}</span>}
                      <BottleArt category={p.category} label={p.name} />
                    </Link>
                    <div className="noct-cat-card__body">
                      <span className="noct-cat-card__latin">{p.subtitle}</span>
                      <Link to={`/product/${productSlug(p)}`} className="noct-cat-card__title-link">
                        <h3 className="noct-cat-card__title">{p.name}</h3>
                      </Link>
                      <div className="noct-cat-card__foot">
                        <span className="noct-cat-card__price">{fmtPrice(p.price)}</span>
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
            </section>
          )}
        </div>
      </section>

      <FooterOne />
      <BottomFooter />
    </>
  );
};

export default ProductPage;
