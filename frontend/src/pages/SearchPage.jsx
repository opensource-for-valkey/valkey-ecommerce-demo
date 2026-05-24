import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import HeaderTwo from '../components/HeaderTwo';
import FooterTwo from '../components/FooterTwo';
import ColorInit from '../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import { useCart } from '../context/CartContext';
import { formatINR } from '../helper/trackEvent';

const SORTS = [
  { value: 'relevance',  label: 'Most Relevant' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
];

function StarRating({ value = 0 }) {
  return (
    <span className="text-warning-600 text-sm">
      {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
      <span className="text-gray-400 ms-4 text-xs">({value.toFixed(1)})</span>
    </span>
  );
}

function ProductCard({ product, onAddToCart, adding }) {
  const discount = product.price?.compareAt > product.price?.amount
    ? Math.round((1 - product.price.amount / product.price.compareAt) * 100) : 0;

  return (
    <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link to="/shop" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
        style={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {discount > 0 && (
          <span className="product-card__badge bg-danger-600 px-8 py-4 text-xs text-white position-absolute inset-inline-start-0 inset-block-start-0">
            {discount}% OFF
          </span>
        )}
        {product.images?.[0]?.url
          ? <img src={product.images[0].url} alt={product.name} className="w-auto"
              style={{ maxHeight: 120, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }} />
          : <i className="ph ph-image text-gray-300" style={{ fontSize: 40 }} />}
      </Link>
      <div className="product-card__content mt-12">
        {product.brand && (
          <p className="text-xs text-main-600 fw-medium mb-4">{product.brand}</p>
        )}
        <h6 className="title text-md fw-semibold mb-6">
          <Link to="/shop" className="link text-line-2">{product.name}</Link>
        </h6>
        {product.ratings?.average > 0 && (
          <div className="mb-6"><StarRating value={product.ratings.average} /></div>
        )}
        <div className="flex-between flex-wrap gap-8 mb-8">
          <div>
            {product.price?.compareAt > product.price?.amount && (
              <span className="text-gray-400 text-sm text-decoration-line-through me-6">
                {formatINR(product.price.compareAt)}
              </span>
            )}
            <span className="text-heading fw-semibold">{formatINR(product.price?.amount)}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-main-600 w-100 py-8 text-sm"
          disabled={adding === product.id}
          onClick={() => onAddToCart(product)}
        >
          {adding === product.id
            ? <span className="spinner-border spinner-border-sm" role="status" />
            : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const q        = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const brand    = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort     = searchParams.get('sort') || 'relevance';
  const page     = parseInt(searchParams.get('page') || '1', 10);

  const [inputQ, setInputQ] = useState(q);
  const [results, setResults]     = useState([]);
  const [facets, setFacets]       = useState({ brands: [], categories: [], priceRanges: [] });
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(false);
  const [addingId, setAddingId]   = useState(null);

  // keep input in sync when navigating back
  useEffect(() => { setInputQ(q); }, [q]);

  const doSearch = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ q, sort, page, pageSize: 12 });
    if (category) params.set('category', category);
    if (brand)    params.set('brand', brand);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`/api/search?${params}`)
      .then(r => r.ok ? r.json() : { results: [], total: 0, totalPages: 1, facets: {} })
      .then(data => {
        setResults(data.results || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setFacets(data.facets || { brands: [], categories: [], priceRanges: [] });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, category, brand, minPrice, maxPrice, sort, page]);

  useEffect(() => { doSearch(); }, [doSearch]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page'); // reset to page 1 on filter change
    setSearchParams(next);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (inputQ.trim()) next.set('q', inputQ.trim());
    setSearchParams(next);
  }

  async function handleAddToCart(product) {
    setAddingId(product.id);
    await addItem(product.id, 1, product.categoryId || null);
    setAddingId(null);
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <HeaderTwo category={true} />

      <section className="shop py-60">
        <div className="container container-lg">
          {/* Search bar at top */}
          <form onSubmit={handleSearchSubmit} className="mb-40">
            <div className="position-relative">
              <input
                type="text"
                value={inputQ}
                onChange={e => setInputQ(e.target.value)}
                placeholder="Search products, brands…"
                className="common-input py-14 px-24 rounded-pill pe-64 border-main-600"
                style={{ fontSize: 16 }}
              />
              <button type="submit"
                className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8">
                <i className="ph ph-magnifying-glass" />
              </button>
            </div>
          </form>

          <div className="row">
            {/* ── Sidebar ───────────────────────────────────────── */}
            <div className="col-lg-3 mb-40 mb-lg-0">
              {/* Active filters */}
              {(category || brand || minPrice || maxPrice) && (
                <div className="mb-20">
                  <button
                    onClick={() => setSearchParams(q ? { q } : {})}
                    className="btn bg-danger-100 text-danger-600 py-8 px-16 rounded-8 text-sm fw-medium w-100">
                    <i className="ph ph-x me-4" /> Clear filters
                  </button>
                </div>
              )}

              {/* Categories */}
              {facets.categories.length > 0 && (
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-24 mb-24">
                  <h6 className="text-md fw-semibold border-bottom border-gray-100 pb-16 mb-16">Category</h6>
                  <ul>
                    {facets.categories.map(cat => (
                      <li key={cat.id} className="mb-12">
                        <button
                          onClick={() => updateParam('category', category === cat.id ? '' : cat.id)}
                          className={`text-sm bg-transparent border-0 p-0 ${category === cat.id ? 'text-main-600 fw-bold' : 'text-gray-700 hover-text-main-600'}`}>
                          {cat.name}
                          <span className="text-gray-400 ms-4">({cat.count})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Brands */}
              {facets.brands.length > 0 && (
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-24 mb-24">
                  <h6 className="text-md fw-semibold border-bottom border-gray-100 pb-16 mb-16">Brand</h6>
                  <ul>
                    {facets.brands.map(b => (
                      <li key={b.name} className="mb-12">
                        <button
                          onClick={() => updateParam('brand', brand === b.name ? '' : b.name)}
                          className={`text-sm bg-transparent border-0 p-0 ${brand === b.name ? 'text-main-600 fw-bold' : 'text-gray-700 hover-text-main-600'}`}>
                          {b.name}
                          <span className="text-gray-400 ms-4">({b.count})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Ranges */}
              {facets.priceRanges.length > 0 && (
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-24 mb-24">
                  <h6 className="text-md fw-semibold border-bottom border-gray-100 pb-16 mb-16">Price Range</h6>
                  <ul>
                    {facets.priceRanges.map(r => {
                      const active = String(r.min) === minPrice && String(r.max === Infinity ? '' : r.max) === maxPrice;
                      return (
                        <li key={r.label} className="mb-12">
                          <button
                            onClick={() => {
                              if (active) {
                                updateParam('minPrice', '');
                                const next = new URLSearchParams(searchParams);
                                next.delete('minPrice'); next.delete('maxPrice'); next.delete('page');
                                setSearchParams(next);
                              } else {
                                const next = new URLSearchParams(searchParams);
                                next.set('minPrice', r.min);
                                if (r.max !== Infinity) next.set('maxPrice', r.max); else next.delete('maxPrice');
                                next.delete('page');
                                setSearchParams(next);
                              }
                            }}
                            className={`text-sm bg-transparent border-0 p-0 ${active ? 'text-main-600 fw-bold' : 'text-gray-700 hover-text-main-600'}`}>
                            {r.label}
                            <span className="text-gray-400 ms-4">({r.count})</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* ── Results ───────────────────────────────────────── */}
            <div className="col-lg-9">
              {/* Toolbar */}
              <div className="flex-between flex-wrap gap-12 mb-24">
                <span className="text-gray-600 text-sm">
                  {loading ? 'Searching…' : (
                    q
                      ? `${total} result${total !== 1 ? 's' : ''} for "${q}"`
                      : `${total} product${total !== 1 ? 's' : ''}`
                  )}
                </span>
                <select
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                  className="common-input py-8 px-16 rounded-8 text-sm"
                  style={{ width: 'auto' }}>
                  {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="text-center py-80">
                  <div className="spinner-border text-main-600" role="status" />
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-80">
                  <i className="ph ph-magnifying-glass text-gray-300" style={{ fontSize: 48 }} />
                  <p className="text-gray-500 mt-16 mb-0">No products found{q ? ` for "${q}"` : ''}.</p>
                  {q && (
                    <button onClick={() => setSearchParams({})} className="btn btn-outline-main-600 mt-16 px-24 py-8 text-sm rounded-8">
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="row g-24">
                  {results.map(product => (
                    <div key={product.id} className="col-xl-3 col-lg-4 col-sm-6">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        adding={addingId}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex-center gap-8 mt-40 flex-wrap">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParam('page', page - 1)}
                    className="w-40 h-40 flex-center border border-gray-200 rounded-8 text-gray-600 hover-bg-main-600 hover-text-white hover-border-main-600 transition-1 disabled:opacity-40">
                    <i className="ph ph-caret-left" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', p)}
                      className={`w-40 h-40 flex-center border rounded-8 text-sm transition-1 ${
                        p === page
                          ? 'bg-main-600 text-white border-main-600'
                          : 'border-gray-200 text-gray-600 hover-bg-main-600 hover-text-white hover-border-main-600'
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => updateParam('page', page + 1)}
                    className="w-40 h-40 flex-center border border-gray-200 rounded-8 text-gray-600 hover-bg-main-600 hover-text-white hover-border-main-600 transition-1 disabled:opacity-40">
                    <i className="ph ph-caret-right" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FooterTwo />
    </>
  );
};

export default SearchPage;
