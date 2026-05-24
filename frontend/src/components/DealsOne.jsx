import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { productService } from '../services/commerceServices';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const DealsOne = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await productService.getDeals();
        setDeals(data);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1699,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 1399,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 425,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="deals-weel py-80">
      <div className="container container-lg">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h5 className="mb-0">Deal of The Week</h5>
              <div className="flex-align mr-point gap-16">
                <Link
                  to="/shop"
                  className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                >
                  View All Deals
                </Link>
              </div>
            </div>
          </div>
          <div className="row gy-4">
            <div className="col-xxl-3 col-lg-4 order-lg-1 order-2">
              <div className="week-deal bg-main-600 rounded-16 p-24 position-relative z-1 overflow-hidden h-100 d-flex flex-column justify-content-between">
                <img
                  src="/assets/images/bg/week-deal-bg.png"
                  alt=""
                  className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 object-fit-cover"
                />
                <div>
                  <h5 className="mb-20 text-white">
                    Apple AirPods Max, Over Ear Headphones
                  </h5>
                  <div className="flex-align gap-8">
                    <div className="flex-align gap-4">
                      <span className="text-sm fw-medium text-warning-600 d-flex">
                        <i className="ph-fill ph-star" />
                      </span>
                      <span className="text-sm fw-medium text-warning-600 d-flex">
                        <i className="ph-fill ph-star" />
                      </span>
                      <span className="text-sm fw-medium text-warning-600 d-flex">
                        <i className="ph-fill ph-star" />
                      </span>
                      <span className="text-sm fw-medium text-warning-600 d-flex">
                        <i className="ph-fill ph-star" />
                      </span>
                      <span className="text-sm fw-medium text-warning-600 d-flex">
                        <i className="ph-fill ph-star" />
                      </span>
                    </div>
                    <span className="text-white text-sm">(17k)</span>
                  </div>
                  <div className="mt-16">
                    <span className="text-white text-lg fw-semibold text-decoration-line-through">
                      $28.99
                    </span>
                    <h4 className="text-white mb-0 mt-2">$14.99</h4>
                  </div>
                </div>
                <div className="text-center mt-24">
                  <img src="/assets/images/thumbs/week-deal-img1.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-xxl-9 col-lg-8 order-lg-2 order-1">
              <div className="arrow-style-two">
                {loading ? (
                  <div className="d-flex gap-16 overflow-hidden">
                    {Array(4).fill().map((_, i) => (
                      <div key={i} style={{ width: '250px' }}>
                        <ProductCardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Slider {...settings}>
                    {deals.map(product => (
                      <div key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsOne;