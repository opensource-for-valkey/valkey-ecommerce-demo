import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';
import { useCart } from '../context/CartContext';
import { trackView, formatINR } from '../helper/trackEvent';

const NextArrow = memo(({ className, onClick }) => (
  <button type="button" onClick={onClick}
    className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}>
    <i className="ph ph-caret-right" />
  </button>
));
const PrevArrow = memo(({ className, onClick }) => (
  <button type="button" onClick={onClick}
    className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}>
    <i className="ph ph-caret-left" />
  </button>
));

const settings = {
  dots: false, arrows: true, infinite: true, speed: 1000,
  slidesToShow: 6, slidesToScroll: 1, autoplay: true,
  nextArrow: <NextArrow />, prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1599, settings: { slidesToShow: 5 } },
    { breakpoint: 1399, settings: { slidesToShow: 3 } },
    { breakpoint: 1199, settings: { slidesToShow: 2 } },
    { breakpoint: 575, settings: { slidesToShow: 1 } },
  ],
};

const DealsOne = () => {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [products, setProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/products?limit=12')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(data => {
        const prods = (data.data || []).filter(p => p.price?.compareAt > p.price?.amount);
        setProducts(prods.length > 0 ? prods : (data.data || []).slice(0, 10));
        trackView(data.data || []);
      })
      .catch(() => {});
  }, []);

  async function handleAdd(product) {
    setAddingId(product.id);
    await addItem(product.id, 1, product.categoryId || null);
    setAddingId(null);
  }

  return (
    <section className="deals-weeek pt-80">
      <div className="container container-lg">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h5 className="mb-0">Deal of The Week</h5>
              <Link to="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                View All Deals
              </Link>
            </div>
          </div>

          <div className="deal-week-box rounded-16 overflow-hidden flex-between position-relative z-1 mb-24">
            <img src="assets/images/bg/week-deal-bg.png" alt=""
              className="position-absolute inset-block-start-0 inset-block-start-0 w-100 h-100 z-n1 object-fit-cover" />
            <div className="d-lg-block d-none ps-32 flex-shrink-0">
              <img src="assets/images/thumbs/deal-img.png" alt="" />
            </div>
            <div className="deal-week-box__content py-32 px-16 text-center flex-grow-1">
              <h6 className="mb-4 fw-semibold">Best Deals This Week</h6>
              <h5 className="mb-16 fw-semibold text-main-600">Up to 30% OFF</h5>
              <div className="countdown">
                <ul className="countdown-list d-flex align-items-center justify-content-center gap-8 flex-wrap list-unstyled mb-0">
                  {[['days', 'Days'], ['hours', 'Hr'], ['minutes', 'Min'], ['seconds', 'Sec']].map(([k, label]) => (
                    <li key={k} className="flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600 w-56 h-56">
                      {timeLeft[k]}<br />{label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="d-lg-block d-none pe-32 flex-shrink-0">
              <img src="assets/images/thumbs/deal-img.png" alt="" />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-32 text-gray-400">
              <p className="mb-0 text-sm">Loading deals…</p>
            </div>
          ) : (
            <div className="deals-slider arrow-style-two">
              <Slider {...settings}>
                {products.map(product => {
                  const discount = product.price?.compareAt
                    ? Math.round((1 - product.price.amount / product.price.compareAt) * 100) : 0;
                  return (
                    <div key={product.id}>
                      <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <Link to="/shop" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                          style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {discount > 0 && (
                            <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                              {discount}% OFF
                            </span>
                          )}
                          {product.images?.[0]?.url
                            ? <img src={product.images[0].url} alt={product.name} className="w-auto" style={{ maxHeight: 100, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                            : <i className="ph ph-image text-gray-300" style={{ fontSize: 32 }} />}
                        </Link>
                        <div className="product-card__content mt-12">
                          <h6 className="title text-md fw-semibold mb-8">
                            <Link to="/shop" className="link text-line-2">{product.name}</Link>
                          </h6>
                          <div className="product-card__price mb-8">
                            {product.price?.compareAt > product.price?.amount && (
                              <span className="text-gray-400 text-sm fw-semibold text-decoration-line-through me-4">{formatINR(product.price.compareAt)}</span>
                            )}
                            <span className="text-heading text-sm fw-semibold">{formatINR(product.price?.amount)}</span>
                          </div>
                          <button type="button" className="btn btn-main-600 w-100 py-6 text-xs"
                            disabled={addingId === product.id}
                            onClick={() => handleAdd(product)}>
                            {addingId === product.id
                              ? <span className="spinner-border spinner-border-sm" role="status" />
                              : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsOne;
