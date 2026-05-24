import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChartLine, Lightning, ShieldCheck, ShoppingCart, TrendUp, Truck } from "@phosphor-icons/react";
import { api } from "../api";
import { BRAND } from "../config/brand";
import { ProductImage } from "../components/ProductImage";
import { ProductSection } from "../components/ProductSection";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { money } from "../utils/formatters";
import { useSeo } from "../useSeo";

export const HomePage = () => {
  useSeo(BRAND.seoTitle, "Shop a fast ecommerce platform powered by Valkey.");
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [categoryFacets, setCategoryFacets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [featuredResponse, trendingResponse, recentResponse] = await Promise.all([
          api.products({ limit: 8, sort: "featured" }),
          api.trending(4),
          api.recentlyViewed()
        ]);
        setFeatured(featuredResponse.data || []);
        setCategoryFacets(featuredResponse.facets?.categories || []);
        setTrending(trendingResponse.data || []);
        setRecent(recentResponse.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const heroProduct = featured[0];

  return (
    <main>
      <section className="vc-hero">
        <div className="vc-hero__content">
          <span className="vc-eyebrow">
            <Lightning size={16} weight="fill" /> {BRAND.name} commerce
          </span>
          <h1>Premium retail discovery with instant catalog, cart, and inventory signals.</h1>
          <p>
            Explore a modern cross-category storefront with polished product galleries,
            smart recommendations, resilient carts, and Valkey-backed retail analytics.
          </p>
          <div className="vc-hero__actions">
            <Link className="vc-button vc-button--primary" to="/shop">
              Shop collection <ArrowRight size={18} />
            </Link>
            <Link className="vc-button vc-button--ghost" to="/admin">
              View analytics <ChartLine size={18} />
            </Link>
          </div>
          <div className="vc-metric-strip">
            <span>
              <strong>90s</strong>
              <small>catalog cache TTL</small>
            </span>
            <span>
              <strong>30d</strong>
              <small>cart persistence</small>
            </span>
            <span>
              <strong>RBAC</strong>
              <small>admin controls</small>
            </span>
          </div>
        </div>
        <div className="vc-hero__visual">
          {heroProduct ? (
            <article>
              <ProductImage src={heroProduct.image} alt={heroProduct.name} loading="eager" />
              <div>
                <span>{heroProduct.category}</span>
                <h2>{heroProduct.name}</h2>
                <p>{heroProduct.description}</p>
                <strong>{money(heroProduct.price)}</strong>
              </div>
            </article>
          ) : (
            <ProductSkeleton />
          )}
        </div>
      </section>

      <section className="vc-feature-band">
        {[
          [ShieldCheck, "Secure sessions", "JWT sessions stored and revoked through Valkey."],
          [ShoppingCart, "Cached carts", "Anonymous and signed-in carts use shared service logic."],
          [TrendUp, "Hot products", "Sorted-set tracking surfaces trending product demand."],
          [Truck, "Checkout ready", "Orders, invoices, tracking states, and payment placeholders."]
        ].map(([Icon, title, body]) => (
          <article key={title}>
            <Icon size={24} />
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      {categoryFacets.length > 0 && (
        <section className="vc-section vc-category-showcase">
          <div className="vc-section__header">
            <div>
              <span className="vc-eyebrow">Departments</span>
              <h2>Shop by category</h2>
            </div>
            <Link className="vc-link" to="/shop">
              Browse catalog <ArrowRight size={16} />
            </Link>
          </div>
          <div className="vc-category-showcase__grid">
            {categoryFacets.map((category) => (
              <Link to={`/shop?category=${encodeURIComponent(category.name)}`} key={category.name}>
                <span>{category.name}</span>
                <strong>{category.count}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductSection
        title="Featured Products"
        body="Curated launch products with premium galleries, live stock, wishlist, and cart actions."
        products={featured}
        loading={loading}
      />

      <ProductSection
        title="Trending Now"
        body="Ranked by Valkey hot-product signals with sold-count fallback."
        products={trending}
        loading={loading}
        compact
      />

      {recent.length > 0 && (
        <section className="vc-section">
          <div className="vc-section__header">
            <div>
              <span className="vc-eyebrow">Recently viewed</span>
              <h2>Pick up where you left off</h2>
            </div>
          </div>
          <div className="vc-recent-grid">
            {recent.map((item) => (
              <Link to={`/product/${item.id}`} key={item.id}>
                <ProductImage src={item.image} alt="" />
                <span>{item.name}</span>
                <strong>{money(item.price)}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

