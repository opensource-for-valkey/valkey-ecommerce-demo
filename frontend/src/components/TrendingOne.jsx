import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { trackView } from '../helper/trackEvent';

const WINDOWS = ['1h', '6h', '24h'];
const WINDOW_LABELS = { '1h': 'Last Hour', '6h': 'Last 6h', '24h': 'Last 24h' };

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function StarRating({ value = 0 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex-align gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-15 fw-medium d-flex ${i <= full ? 'text-warning-600' : (i === full + 1 && half ? 'text-warning-400' : 'text-gray-300')}`}>
          <i className="ph-fill ph-star" />
        </span>
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart, disabled }) {
  const discount = product.price?.compareAt
    ? Math.round((1 - product.price.amount / product.price.compareAt) * 100)
    : 0;

  const badgeMap = [
    { label: '🔥 #1 Trending', cls: 'bg-danger-600' },
    { label: '#2 Trending', cls: 'bg-warning-600' },
    { label: '#3 Trending', cls: 'bg-tertiary-600' },
  ];
  const badge = badgeMap[product._rank];

  return (
    <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link
        to="/shop"
        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
        style={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {badge && (
          <span className={`product-card__badge ${badge.cls} px-8 py-4 text-xs text-white position-absolute inset-inline-start-0 inset-block-start-0`}>
            {badge.label}
          </span>
        )}
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-auto"
            style={{ maxHeight: 120, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="text-gray-300 text-center" style={{ padding: '24px 0' }}>
            <i className="ph ph-image" style={{ fontSize: 40 }} />
          </div>
        )}
      </Link>

      <div className="product-card__content mt-16">
        {discount > 0 && (
          <span className="text-success-600 bg-success-50 text-sm fw-medium py-4 px-8">
            {discount}% OFF
          </span>
        )}

        <h6 className="title text-lg fw-semibold my-12">
          <Link to="/shop" className="link text-line-2">
            {product.name}
          </Link>
        </h6>

        <div className="flex-align gap-6 mb-8">
          <StarRating value={product.ratings?.average || 0} />
          <span className="text-xs fw-medium text-gray-500">{product.ratings?.average?.toFixed(1) || '—'}</span>
          {product.ratings?.count > 0 && (
            <span className="text-xs fw-medium text-gray-500">({product.ratings.count.toLocaleString()})</span>
          )}
        </div>

        {product.brand && (
          <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mb-12 d-inline-block">
            {product.brand}
          </span>
        )}

        <div className="product-card__price mt-8 mb-16">
          {product.price?.compareAt > product.price?.amount && (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-8">
              {formatINR(product.price.compareAt)}
            </span>
          )}
          <span className="text-heading text-md fw-semibold">
            {formatINR(product.price?.amount || 0)}
          </span>
        </div>

        {product.trendingScore > 0 && (
          <div className="mb-12">
            <span className="text-xs text-gray-400">
              <i className="ph ph-chart-line-up me-4" />
              Score: {Math.round(product.trendingScore)}
            </span>
          </div>
        )}

        <button
          type="button"
          className="btn btn-main-600 w-100 py-8 text-sm"
          onClick={() => onAddToCart(product)}
          disabled={disabled}
        >
          {disabled ? (
            <span className="spinner-border spinner-border-sm me-6" role="status" />
          ) : (
            <i className="ph ph-shopping-cart me-6" />
          )}
          {disabled ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

const TrendingOne = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeWindow, setActiveWindow] = useState('24h');
  const [activeCategory, setActiveCategory] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const cats = Array.isArray(data) ? data : (data.categories || []);
        setCategories(cats.filter(c => !c.parentId).slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const fetchTrending = useCallback(() => {
    setLoading(true);
    const url = activeCategory
      ? `/api/trending/${encodeURIComponent(activeCategory)}?window=${activeWindow}&limit=12`
      : `/api/trending?window=${activeWindow}&limit=12`;

    fetch(url)
      .then(r => r.ok ? r.json() : { products: [] })
      .then(data => {
        const prods = (data.products || []).map((p, i) => ({ ...p, _rank: i }));
        setProducts(prods);
        trackView(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeWindow, activeCategory]);

  useEffect(() => { fetchTrending(); }, [fetchTrending]);

  async function handleAddToCart(product) {
    setAddingId(product.id);
    const { ok } = await addItem(product.id, 1, product.categoryId || null);
    setAddingId(null);
    setToast(ok ? `${product.name} added to cart!` : 'Could not add to cart. Try again.');
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <section className="trending-productss pt-80">
      <div className="container container-lg">
        <div className="border border-gray-100 p-24 rounded-16">

          {toast && (
            <div className="position-fixed" style={{ bottom: 24, right: 24, zIndex: 9999, minWidth: 280 }}>
              <div className="alert alert-success shadow mb-0 py-12 px-16 rounded-12 d-flex align-items-center gap-8">
                <i className="ph-fill ph-check-circle text-success-600" />
                <span className="text-sm">{toast}</span>
              </div>
            </div>
          )}

          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <div className="d-flex align-items-center gap-12">
                <h5 className="mb-0">
                  <i className="ph-fill ph-chart-line-up text-main-600 me-8" />
                  Trending Products
                </h5>
                <span className="text-xs text-gray-400 bg-gray-50 px-8 py-4 rounded-pill">
                  Powered by Valkey
                </span>
              </div>

              <ul className="nav common-tab style-two nav-pills mb-0" role="tablist">
                {WINDOWS.map(w => (
                  <li key={w} className="nav-item" role="presentation">
                    <button
                      className={`nav-link${activeWindow === w ? ' active' : ''}`}
                      type="button"
                      onClick={() => setActiveWindow(w)}
                    >
                      {WINDOW_LABELS[w]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-16">
              <ul className="nav common-tab nav-pills gap-8 flex-wrap" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link${!activeCategory ? ' active' : ''}`}
                    type="button"
                    onClick={() => setActiveCategory(null)}
                  >
                    All
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id} className="nav-item" role="presentation">
                    <button
                      className={`nav-link${activeCategory === cat.id ? ' active' : ''}`}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-48">
              <div className="spinner-border text-main-600" style={{ width: 36, height: 36 }} role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
              <p className="text-gray-500 mt-12 mb-0">Fetching trending products…</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-48 text-gray-400">
              <i className="ph ph-chart-line-up" style={{ fontSize: 48 }} />
              <p className="mt-12 mb-0">
                No trending data yet for this window.
                <br />
                <span className="text-sm">Browse products to start building the trending list!</span>
              </p>
            </div>
          ) : (
            <div className="row g-12">
              {products.map(product => (
                <div key={product.id} className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    disabled={addingId === product.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingOne;
