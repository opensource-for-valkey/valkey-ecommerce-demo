import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/commerceServices';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import socket from '../services/socket';

const TrendingOne = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { limit: 12, sort: 'popular' };
        if (activeTab !== 'all') {
          params.category = activeTab;
        }
        const data = await productService.getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load trending products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Listen to real-time trend updates
    const handleTrendUpdate = () => {
      // Re-fetch popular products to reflect real-time shifts
      if (activeTab === 'all') fetchProducts();
    };
    
    socket.on('trends_update', handleTrendUpdate);
    return () => socket.off('trends_update', handleTrendUpdate);
  }, [activeTab]);

  return (
    <section className="trending-products py-80">
      <div className="container container-lg">
        <div className="section-heading mb-24">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">Trending Products</h5>
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
          <div className="col-xl-3 col-lg-4 d-lg-block d-none">
            <div className="trending-products__bg rounded-16 overflow-hidden position-relative h-100 z-1 d-flex flex-column justify-content-between p-24">
              <img
                src="/assets/images/bg/trending-products-bg.png"
                alt=""
                className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 object-fit-cover"
              />
              <div className="mt-32">
                <h3 className="text-white mb-24">
                  Laptop Pro 20% off All Time On Order Now $980
                </h3>
                <Link
                  to="/shop"
                  className="btn btn-outline-white w-100 py-12 px-24 rounded-pill"
                >
                  Shop Now
                </Link>
              </div>
              <div className="text-center mt-32">
                <img
                  src="/assets/images/thumbs/trending-products-img1.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-8">
            <ul
              className="nav nav-pills style-two nav-pills-text mb-40"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                  type="button"
                >
                  All
                </button>
              </li>
              {categories.slice(0, 6).map(cat => (
                <li className="nav-item" role="presentation" key={cat.slug}>
                  <button
                    className={`nav-link ${activeTab === cat.slug ? 'active' : ''}`}
                    onClick={() => setActiveTab(cat.slug)}
                    type="button"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div className="tab-pane fade show active" role="tabpanel">
                <div className="row gy-4">
                  {loading ? (
                    Array(6).fill().map((_, i) => (
                      <div className="col-xxl-4 col-sm-6" key={i}>
                        <ProductCardSkeleton />
                      </div>
                    ))
                  ) : products.length > 0 ? (
                    products.map(product => (
                      <div className="col-xxl-4 col-sm-6" key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-40">
                      <h4>No products found in this category.</h4>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingOne;