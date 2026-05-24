import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER_IMGS = [
  'assets/images/thumbs/product-two-img1.png',
  'assets/images/thumbs/product-two-img2.png',
  'assets/images/thumbs/product-two-img3.png',
  'assets/images/thumbs/product-two-img4.png',
  'assets/images/thumbs/product-two-img5.png',
  'assets/images/thumbs/product-two-img6.png',
];

const formatPrice = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

function flattenTree(nodes, depth = 0) {
  const result = [];
  nodes.forEach((node) => {
    result.push({ ...node, depth });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, depth + 1));
    }
  });
  return result;
}

const LIMIT = 6;

const ShopSection = () => {
  const [grid, setGrid] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (appliedMinPrice) params.set('minPrice', appliedMinPrice);
    if (appliedMaxPrice) params.set('maxPrice', appliedMaxPrice);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.data || []);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, selectedCategory, selectedBrand, appliedMinPrice, appliedMaxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryClick = (id) => {
    setSelectedCategory(id === selectedCategory ? '' : id);
    setPage(1);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand === selectedBrand ? '' : brand);
    setPage(1);
  };

  const handleApplyPrice = () => {
    setAppliedMinPrice(priceMinInput);
    setAppliedMaxPrice(priceMaxInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceMinInput('');
    setPriceMaxInput('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const flatCategories = flattenTree(categories);
  const BRANDS = ['Samsung', 'Apple', 'Dell', 'Sony', 'Nike', 'H&M', 'Instant Pot', 'Lodge', 'Nivia'];

  const activeFilters = selectedCategory || selectedBrand || appliedMinPrice || appliedMaxPrice;

  return (
    <section className="shop py-80">
      <div className={`side-overlay ${sidebarActive && 'show'}`} />
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${sidebarActive && 'active'}`}>
              <button
                onClick={() => setSidebarActive(false)}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x" />
              </button>

              {/* Active filter pill */}
              {activeFilters && (
                <div className="mb-16">
                  <button
                    onClick={handleClearFilters}
                    className="btn bg-danger-100 text-danger-600 py-8 px-16 rounded-8 text-sm fw-medium w-100"
                  >
                    <i className="ph ph-x me-4" /> Clear all filters
                  </button>
                </div>
              )}

              {/* Categories */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  <li className="mb-16">
                    <button
                      onClick={() => handleCategoryClick('')}
                      className={`text-gray-900 hover-text-main-600 fw-medium bg-transparent border-0 p-0 ${!selectedCategory ? 'text-main-600 fw-bold' : ''}`}
                    >
                      All Products ({total})
                    </button>
                  </li>
                  {flatCategories.map((cat) => (
                    <li
                      key={cat.id}
                      className="mb-16"
                      style={{ paddingLeft: cat.depth * 16 }}
                    >
                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`text-gray-900 hover-text-main-600 bg-transparent border-0 p-0 text-start ${selectedCategory === cat.id ? 'text-main-600 fw-bold' : ''}`}
                      >
                        {cat.depth > 0 && <span className="text-gray-400 me-4">›</span>}
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price filter */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Filter by Price (₹)
                </h6>
                <div className="row g-8 mb-16">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control common-input text-sm"
                      placeholder="Min"
                      value={priceMinInput}
                      onChange={(e) => setPriceMinInput(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control common-input text-sm"
                      placeholder="Max"
                      value={priceMaxInput}
                      onChange={(e) => setPriceMaxInput(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleApplyPrice}
                  className="btn btn-main h-40 flex-align w-100"
                >
                  Apply Price Filter
                </button>
                {(appliedMinPrice || appliedMaxPrice) && (
                  <p className="text-xs text-main-600 mt-8 mb-0">
                    Active: {appliedMinPrice ? `₹${Number(appliedMinPrice).toLocaleString('en-IN')}` : '0'} –{' '}
                    {appliedMaxPrice ? `₹${Number(appliedMaxPrice).toLocaleString('en-IN')}` : '∞'}
                  </p>
                )}
              </div>

              {/* Brand filter */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Filter by Brand
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {BRANDS.map((brand) => (
                    <li key={brand} className="mb-16">
                      <div className="form-check common-check common-radio">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="brand"
                          id={`brand-${brand}`}
                          checked={selectedBrand === brand}
                          onChange={() => handleBrandClick(brand)}
                        />
                        <label className="form-check-label" htmlFor={`brand-${brand}`}>
                          {brand}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Sidebar End */}

          {/* Content */}
          <div className="col-lg-9">
            {/* Top bar */}
            <div className="flex-between gap-16 flex-wrap mb-40">
              <span className="text-gray-900">
                {loading
                  ? 'Loading…'
                  : `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total} result${total !== 1 ? 's' : ''}`}
              </span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                <div className="list-grid-btns flex-align gap-16">
                  <button
                    onClick={() => setGrid(true)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${grid && 'border-main-600 text-white bg-main-600'}`}
                  >
                    <i className="ph-bold ph-list-dashes" />
                  </button>
                  <button
                    onClick={() => setGrid(false)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${!grid && 'border-main-600 text-white bg-main-600'}`}
                  >
                    <i className="ph ph-squares-four" />
                  </button>
                </div>
                <button
                  onClick={() => setSidebarActive(true)}
                  type="button"
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel" />
                </button>
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="text-center py-80">
                <div className="spinner-border text-main-600" role="status" />
                <p className="mt-16 text-gray-500">Loading products from Valkey…</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-80">
                <i className="ph ph-magnifying-glass text-gray-300" style={{ fontSize: 64 }} />
                <p className="text-gray-500 mt-16">No products found for the selected filters.</p>
                {activeFilters && (
                  <button onClick={handleClearFilters} className="btn btn-main mt-16">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`list-grid-wrapper ${grid && 'list-view'}`}>
                {products.map((product, idx) => {
                  const imgSrc = product.images?.[0]?.url || PLACEHOLDER_IMGS[idx % PLACEHOLDER_IMGS.length];
                  const hasDiscount = product.price?.compareAt && product.price.compareAt > product.price.amount;
                  return (
                    <div
                      key={product.id}
                      className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
                    >
                      <Link
                        to="/product-details-two"
                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                      >
                        <img
                          src={PLACEHOLDER_IMGS[idx % PLACEHOLDER_IMGS.length]}
                          alt={product.name}
                          className="w-auto max-w-unset"
                        />
                        {hasDiscount && (
                          <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                            Sale
                          </span>
                        )}
                        <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-end-0 inset-block-start-0">
                          {product.brand}
                        </span>
                      </Link>
                      <div className="product-card__content mt-16">
                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                          <Link to="/product-details-two" className="link text-line-2" tabIndex={0}>
                            {product.name}
                          </Link>
                        </h6>
                        <div className="flex-align mb-12 mt-8 gap-6">
                          <span className="text-xs fw-medium text-gray-500">
                            {product.ratings?.average?.toFixed(1)}
                          </span>
                          <span className="text-15 fw-medium text-warning-600 d-flex">
                            <i className="ph-fill ph-star" />
                          </span>
                          <span className="text-xs fw-medium text-gray-500">
                            ({product.ratings?.count?.toLocaleString()})
                          </span>
                        </div>
                        <div className="product-card__price my-16">
                          {hasDiscount && (
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-8">
                              {formatPrice(product.price.compareAt)}
                            </span>
                          )}
                          <span className="text-heading text-md fw-semibold">
                            {formatPrice(product.price.amount)}
                          </span>
                        </div>
                        <div className="flex-align gap-4 mb-12">
                          <span className="text-main-600 text-xs d-flex">
                            <i className="ph-fill ph-package" />
                          </span>
                          <span className="text-gray-500 text-xs">
                            In stock: {product.inventory?.quantity - (product.inventory?.reserved || 0)}
                          </span>
                        </div>
                        <Link
                          to="/cart"
                          className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                          tabIndex={0}
                        >
                          Add To Cart <i className="ph ph-shopping-cart" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <ul className="pagination flex-center flex-wrap gap-16 mt-40">
                <li className="page-item">
                  <button
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <i className="ph-bold ph-arrow-left" />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button
                      className={`page-link h-64 w-64 flex-center text-md rounded-8 fw-medium border ${p === page ? 'bg-main-600 text-white border-main-600' : 'text-neutral-600 border-gray-100'}`}
                      onClick={() => setPage(p)}
                    >
                      {String(p).padStart(2, '0')}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <i className="ph-bold ph-arrow-right" />
                  </button>
                </li>
              </ul>
            )}
          </div>
          {/* Content End */}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
