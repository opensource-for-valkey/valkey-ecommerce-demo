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

const settings = {
  dots: false, arrows: true, infinite: true, speed: 1000,
  slidesToShow: 4, slidesToScroll: 1, autoplay: true,
  nextArrow: <NextArrow />, prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1399, settings: { slidesToShow: 3 } },
    { breakpoint: 1199, settings: { slidesToShow: 2 } },
    { breakpoint: 575, settings: { slidesToShow: 1 } },
  ],
};

const TopSellingTwo = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetch('/api/products?limit=12')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(data => {
        const prods = data.data || [];
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
    <section className="recommended">
      <div className="container container-lg">
        <div className="row g-12">
          <div className="col-12">
            <div className="border border-gray-100 p-24 rounded-16">
              <div className="section-heading mb-24">
                <div className="flex-between flex-wrap gap-8">
                  <h5 className="mb-0">Recommended Products</h5>
                  <Link to="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                    View All
                  </Link>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-40 text-gray-400">
                  <p className="mb-0 text-sm">Loading products…</p>
                </div>
              ) : (
                <Slider {...settings}>
                  {products.map(product => {
                    const discount = product.price?.compareAt
                      ? Math.round((1 - product.price.amount / product.price.compareAt) * 100) : 0;
                    return (
                      <div key={product.id}>
                        <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                          <Link to="/shop" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                            style={{ minHeight: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {discount > 0 && (
                              <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                {discount}% OFF
                              </span>
                            )}
                            {product.images?.[0]?.url
                              ? <img src={product.images[0].url} alt={product.name} className="w-auto" style={{ maxHeight: 110, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                              : <i className="ph ph-image text-gray-300" style={{ fontSize: 36 }} />}
                          </Link>
                          <div className="product-card__content mt-16">
                            <h6 className="title text-lg fw-semibold mt-8 mb-8">
                              <Link to="/shop" className="link text-line-2">{product.name}</Link>
                            </h6>
                            <div className="flex-align gap-4 mb-8">
                              <span className="text-xs fw-medium text-gray-500">{product.ratings?.average?.toFixed(1) || '—'}</span>
                              <span className="text-15 fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star" /></span>
                              {product.ratings?.count > 0 && <span className="text-xs fw-medium text-gray-500">({product.ratings.count.toLocaleString()})</span>}
                            </div>
                            {product.brand && (
                              <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mb-8 d-inline-block">
                                {product.brand}
                              </span>
                            )}
                            <div className="product-card__price mt-8 mb-12">
                              {product.price?.compareAt > product.price?.amount && (
                                <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-8">{formatINR(product.price.compareAt)}</span>
                              )}
                              <span className="text-heading text-md fw-semibold">{formatINR(product.price?.amount)}</span>
                            </div>
                            <button type="button" className="btn btn-main-600 w-100 py-8 text-sm"
                              disabled={addingId === product.id}
                              onClick={() => handleAdd(product)}>
                              {addingId === product.id
                                ? <span className="spinner-border spinner-border-sm" role="status" />
                                : <><i className="ph ph-shopping-cart me-6" />Add to Cart</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellingTwo;
