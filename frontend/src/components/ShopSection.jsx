import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactSlider from 'react-slider';
import { productService, categoryService } from '../services/commerceServices';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const ShopSection = () => {
  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const sidebarController = () => {
    setActive(!active);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsData, prodsData] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ category: selectedCategory, sort: sortOption })
        ]);
        setCategories(catsData);
        setProducts(prodsData);
      } catch (err) {
        console.error("Failed to load shop data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCategory, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryClick = (e, slug) => {
    e.preventDefault();
    setSelectedCategory(slug === selectedCategory ? '' : slug);
  };

  return (
    <section className="shop py-80">
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar Start */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x" />
              </button>
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  <li className="mb-24">
                    <a
                      href="#"
                      onClick={(e) => handleCategoryClick(e, '')}
                      className={`text-gray-900 hover-text-main-600 ${selectedCategory === '' ? 'fw-bold text-main-600' : ''}`}
                    >
                      All Categories
                    </a>
                  </li>
                  {categories.map((cat, idx) => (
                    <li key={cat.slug} className={idx === categories.length - 1 ? 'mb-0' : 'mb-24'}>
                      <a
                        href="#"
                        onClick={(e) => handleCategoryClick(e, cat.slug)}
                        className={`text-gray-900 hover-text-main-600 ${selectedCategory === cat.slug ? 'fw-bold text-main-600' : ''}`}
                      >
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                  <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                      Filter by Price
                  </h6>
                  <div className="custom--range">
                      <ReactSlider
                          className="horizontal-slider"
                          thumbClassName="example-thumb"
                          trackClassName="example-track"
                          defaultValue={[0, 1000]}
                          max={1000}
                          ariaLabel={['Lower thumb', 'Upper thumb']}
                          ariaValuetext={state => `Thumb value ${state.valueNow}`}
                          renderThumb={(props, state) => {
                              const { key, ...restProps } = props;
                              return <div {...restProps} key={state.index}>{state.valueNow}</div>;
                          }}
                          pearling
                          minDistance={10}
                          onChange={(val) => setPriceRange(val)}
                      />

                      <br />
                      <br />
                      <div className="flex-between flex-wrap-reverse gap-8 mt-24 ">
                          <button type="button" className="btn btn-main h-40 flex-align">
                              Filter{" "}
                          </button>
                      </div>
                  </div>
              </div>

              <div className="shop-sidebar__box rounded-8">
                <img src="/assets/images/thumbs/advertise-img1.png" alt="" />
              </div>
            </div>
          </div>
          {/* Sidebar End */}
          
          {/* Content Start */}
          <div className="col-lg-9">
            {/* Top Start */}
            <div className="flex-between gap-16 flex-wrap mb-40 ">
              <span className="text-gray-900">Showing {products.length} results</span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                <div className="list-grid-btns flex-align gap-16">
                  <button onClick={() => setGrid(true)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${grid === true && "border-main-600 text-white bg-main-600"}`}
                  >
                    <i className="ph-bold ph-list-dashes" />
                  </button>
                  <button onClick={() => setGrid(false)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${grid === false && "border-main-600 text-white bg-main-600"}`}
                  >
                    <i className="ph ph-squares-four" />
                  </button>
                </div>
                <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                  <label htmlFor="sorting" className="text-inherit flex-shrink-0">
                    Sort by:{" "}
                  </label>
                  <select 
                    value={sortOption}
                    onChange={handleSortChange}
                    className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
                    id="sorting"
                  >
                    <option value="popular">Popular</option>
                    <option value="latest">Latest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
                <button onClick={sidebarController}
                  type="button"
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel" />
                </button>
              </div>
            </div>
            {/* Top End */}
            
            <div className={`list-grid-wrapper ${grid && "list-view"}`}>
              {loading ? (
                Array(6).fill().map((_, i) => <ProductCardSkeleton key={i} />)
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-12 text-center py-40">
                  <h4>No products found in this category.</h4>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {products.length > 0 && (
              <ul className="pagination flex-center flex-wrap gap-16">
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    <i className="ph-bold ph-arrow-left" />
                  </Link>
                </li>
                <li className="page-item active">
                  <Link
                    className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    01
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    to="#"
                  >
                    <i className="ph-bold ph-arrow-right" />
                  </Link>
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