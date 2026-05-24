import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useCart } from '../context/CartContext';
import { trackView, formatINR } from '../helper/trackEvent';

const NextArrow = ({ className, onClick }) => (
  <button type="button" onClick={onClick}
    className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}>
    <i className="ph ph-caret-right" />
  </button>
);
const PrevArrow = ({ className, onClick }) => (
  <button type="button" onClick={onClick}
    className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}>
    <i className="ph ph-caret-left" />
  </button>
);

const sliderSettings = {
  dots: false, arrows: true, infinite: true, speed: 1000,
  slidesToShow: 2, slidesToScroll: 1, autoplay: true,
  nextArrow: <NextArrow />, prevArrow: <PrevArrow />,
  responsive: [{ breakpoint: 991, settings: { slidesToShow: 1 } }],
};

function ProductSlide({ product, onAdd, addingId }) {
  const discount = product.price?.compareAt
    ? Math.round((1 - product.price.amount / product.price.compareAt) * 100) : 0;
  return (
    <div className="product-card p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link to="/shop" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
        style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {discount > 0 && (
          <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
            {discount}% OFF
          </span>
        )}
        {product.images?.[0]?.url
          ? <img src={product.images[0].url} alt={product.name} className="w-auto" style={{ maxHeight: 100, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
          : <i className="ph ph-image text-gray-300" style={{ fontSize: 36 }} />}
      </Link>
      <div className="product-card__content mt-12">
        <h6 className="title text-lg fw-semibold mb-8">
          <Link to="/shop" className="link text-line-2">{product.name}</Link>
        </h6>
        <div className="flex-align gap-4 mb-8">
          <span className="text-xs fw-medium text-gray-500">{product.ratings?.average?.toFixed(1) || '—'}</span>
          <span className="text-15 fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star" /></span>
        </div>
        <div className="product-card__price mb-12">
          {product.price?.compareAt > product.price?.amount && (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-8">{formatINR(product.price.compareAt)}</span>
          )}
          <span className="text-heading text-md fw-semibold">{formatINR(product.price?.amount)}</span>
        </div>
        <button type="button" className="btn btn-main-600 w-100 py-8 text-sm"
          disabled={addingId === product.id} onClick={() => onAdd(product)}>
          {addingId === product.id
            ? <span className="spinner-border spinner-border-sm" role="status" />
            : <><i className="ph ph-shopping-cart me-6" />Add to Cart</>}
        </button>
      </div>
    </div>
  );
}

const FeaturedOne = () => {
  const { addItem } = useCart();
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetch('/api/trending?window=24h&limit=6')
      .then(r => r.ok ? r.json() : { products: [] })
      .then(data => {
        const prods = data.products || [];
        setBestSellers(prods);
        trackView(prods);
      })
      .catch(() => {});

    fetch('/api/products?limit=6')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(data => {
        const prods = data.data || [];
        setNewArrivals(prods);
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
    <section className="featured-products">
      <div className="container container-lg">
        <div className="row g-4 flex-wrap-reverse">
          <div className="col-xxl-8">
            <div className="border border-gray-100 p-24 rounded-16">
              <div className="section-heading mb-24">
                <div className="flex-between flex-wrap gap-8">
                  <h5 className="mb-0">Best Sellers</h5>
                  <Link to="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                    View All
                  </Link>
                </div>
              </div>
              {bestSellers.length === 0 ? (
                <div className="text-center py-32 text-gray-400">
                  <p className="mb-0 text-sm">Browse products to generate trending data.</p>
                </div>
              ) : (
                <Slider {...sliderSettings}>
                  {bestSellers.map(p => (
                    <div key={p.id}><ProductSlide product={p} onAdd={handleAdd} addingId={addingId} /></div>
                  ))}
                </Slider>
              )}
            </div>
          </div>

          <div className="col-xxl-4">
            <div className="border border-gray-100 p-24 rounded-16 h-100">
              <div className="section-heading mb-24">
                <div className="flex-between flex-wrap gap-8">
                  <h5 className="mb-0">New Arrivals</h5>
                  <Link to="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                    View All
                  </Link>
                </div>
              </div>
              {newArrivals.length === 0 ? (
                <div className="text-center py-32 text-gray-400">
                  <p className="mb-0 text-sm">Loading…</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-16">
                  {newArrivals.slice(0, 4).map(product => {
                    const discount = product.price?.compareAt
                      ? Math.round((1 - product.price.amount / product.price.compareAt) * 100) : 0;
                    return (
                      <div key={product.id} className="d-flex gap-12 align-items-center border border-gray-100 rounded-12 p-12 hover-border-main-600 transition-2">
                        <Link to="/shop" className="flex-center rounded-8 bg-gray-50 flex-shrink-0"
                          style={{ width: 64, height: 64 }}>
                          {product.images?.[0]?.url
                            ? <img src={product.images[0].url} alt={product.name} className="w-auto" style={{ maxHeight: 52, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                            : <i className="ph ph-image text-gray-300" style={{ fontSize: 24 }} />}
                        </Link>
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="text-sm fw-semibold mb-4 text-line-1">
                            <Link to="/shop" className="link">{product.name}</Link>
                          </h6>
                          <div className="d-flex gap-6 align-items-center">
                            {product.price?.compareAt > product.price?.amount && (
                              <span className="text-gray-400 text-xs text-decoration-line-through">{formatINR(product.price.compareAt)}</span>
                            )}
                            <span className="text-heading text-sm fw-semibold">{formatINR(product.price?.amount)}</span>
                            {discount > 0 && <span className="text-success-600 text-xs">{discount}% off</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOne;
