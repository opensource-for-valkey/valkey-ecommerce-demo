import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCountdown } from '../helper/Countdown';
import { useCart } from '../context/CartContext';
import { trackView, formatINR } from '../helper/trackEvent';

const PopularProductsOne = () => {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/trending?window=6h&limit=8')
      .then(r => r.ok ? r.json() : { products: [] })
      .then(data => {
        const prods = data.products || [];
        setProducts(prods);
        trackView(prods);
      })
      .catch(() => {});
  }, []);

  async function handleAdd(product) {
    setAddingId(product.id);
    await addItem(product.id, 1, product.categoryId || null);
    setAddingId(null);
  }

  return (
    <section className="popular-products pt-80">
      <div className="container container-lg">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h5 className="mb-0">Popular Products</h5>
              <Link to="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                View All Products
              </Link>
            </div>
          </div>

          <div className="popular-products-box rounded-16 overflow-hidden flex-between position-relative z-1 mb-24">
            <img src="assets/images/bg/expensive-offer-bg.png" alt=""
              className="position-absolute inset-block-start-0 inset-block-start-0 w-100 h-100 z-n1" />
            <div className="d-lg-block d-none ps-32">
              <img src="assets/images/thumbs/expensive-offer1.png" alt="" />
            </div>
            <div className="popular-products-box__content px-sm-4 d-block w-100 text-center py-20">
              <div className="flex-align gap-16 justify-content-center">
                <h6 className="mb-0">Trending Now</h6>
                <h4 className="mb-0 text-main-600">Last 6 Hours</h4>
              </div>
              <div className="countdown mt-4">
                <ul className="countdown-list style-four flex-center flex-wrap list-unstyled mb-0 gap-8">
                  {[['days', 'Days'], ['hours', 'Hour'], ['minutes', 'Min'], ['seconds', 'Sec']].map(([k, label]) => (
                    <li key={k} className="flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600 w-56 h-56">
                      {timeLeft[k]}<br />{label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="d-lg-block d-none">
              <img src="assets/images/thumbs/expensive-offer2.png" alt="" />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-32 text-gray-400">
              <i className="ph ph-chart-line-up" style={{ fontSize: 40 }} />
              <p className="mt-8 mb-0 text-sm">No popular products yet. Browse to generate trending data.</p>
            </div>
          ) : (
            <div className="row gy-4">
              {products.map(product => {
                const discount = product.price?.compareAt
                  ? Math.round((1 - product.price.amount / product.price.compareAt) * 100) : 0;
                return (
                  <div key={product.id} className="col-xxl-3 col-xl-4 col-sm-6">
                    <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                      <Link to="/shop"
                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-16"
                        style={{ width: 80, height: 80 }}>
                        {product.images?.[0]?.url
                          ? <img src={product.images[0].url} alt={product.name} className="w-auto" style={{ maxHeight: 64, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                          : <i className="ph ph-image text-gray-300" style={{ fontSize: 28 }} />}
                      </Link>
                      <div className="product-card__content flex-grow-1">
                        <h6 className="title text-md fw-semibold mb-8">
                          <Link to="/shop" className="link text-line-2">{product.name}</Link>
                        </h6>
                        {product.brand && (
                          <span className="text-xs text-gray-400 mb-6 d-block">{product.brand}</span>
                        )}
                        <div className="flex-align gap-4 mb-8">
                          <span className="text-xs fw-medium text-gray-500">{product.ratings?.average?.toFixed(1) || '—'}</span>
                          <span className="text-sm fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star" /></span>
                          {product.ratings?.count > 0 && <span className="text-xs text-gray-400">({product.ratings.count.toLocaleString()})</span>}
                        </div>
                        <div className="mb-8">
                          {product.price?.compareAt > product.price?.amount && (
                            <span className="text-gray-400 text-sm text-decoration-line-through me-6">{formatINR(product.price.compareAt)}</span>
                          )}
                          <span className="text-heading text-sm fw-semibold">{formatINR(product.price?.amount)}</span>
                          {discount > 0 && <span className="text-success-600 text-xs ms-6">{discount}% off</span>}
                        </div>
                        {product.trendingScore > 0 && (
                          <span className="text-xs text-gray-400 d-block mb-8">
                            <i className="ph ph-chart-line-up me-4" />Score: {Math.round(product.trendingScore)}
                          </span>
                        )}
                        <button type="button" className="btn btn-main-600 w-100 py-6 text-xs"
                          disabled={addingId === product.id} onClick={() => handleAdd(product)}>
                          {addingId === product.id
                            ? <span className="spinner-border spinner-border-sm" role="status" />
                            : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularProductsOne;
