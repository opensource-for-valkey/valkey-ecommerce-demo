import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactSlider from "react-slider";

const VendorsListTwo = () => {
  let [active, setActive] = useState(false);
  let sidebarController = () => {
    setActive(!active);
  };
  return (
    <section className='vendors-list py-80'>
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className='container container-lg'>
        <div className='row gy-4'>
          <div className='col-xxl-2 col-xl-3 col-lg-4'>
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type='button'
                className='shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600'
              >
                <i className='ph ph-x' />
              </button>
              <div className='d-flex flex-column gap-12 px-lg-0 px-16 py-lg-0 py-24'>
                <div className='vendor-card style-two text-center px-16 pb-24 bg-main-50'>
                  <img
                    src='assets/images/thumbs/vendor-logo2.png'
                    alt=''
                    className='vendor-card__logo m-12'
                  />
                  <h6 className='title mt-32'>Safeway</h6>
                  <span className='text-neutral-600 text-sm d-block fw-semibold'>
                    New Street, 520, New York
                  </span>
                  <span className='bg-white text-neutral-900 rounded-pill py-6 px-16 text-12 mt-8'>
                    Since 2009
                  </span>
                  <p className='text-neutral-600 my-24'>
                    It's easy and free to link or sign up for our loyalty
                    program, and it only takes a few seconds.
                  </p>
                  <ul className='flex-center gap-8 flex-wrap'>
                    <li>
                      <Link
                        to='https://www.facebook.com'
                        className='w-36 h-36 flex-center bg-white text-main-600 text-lg rounded-circle hover-bg-main-600 hover-text-white'
                      >
                        <i className='ph-fill ph-facebook-logo' />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='https://www.twitter.com'
                        className='w-36 h-36 flex-center bg-white text-main-600 text-lg rounded-circle hover-bg-main-600 hover-text-white'
                      >
                        <i className='ph-fill ph-twitter-logo' />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='https://www.linkedin.com'
                        className='w-36 h-36 flex-center bg-white text-main-600 text-lg rounded-circle hover-bg-main-600 hover-text-white'
                      >
                        <i className='ph-fill ph-instagram-logo' />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to='https://www.pinterest.com'
                        className='w-36 h-36 flex-center bg-white text-main-600 text-lg rounded-circle hover-bg-main-600 hover-text-white'
                      >
                        <i className='ph-fill ph-linkedin-logo' />
                      </Link>
                    </li>
                  </ul>
                  <Link
                    to='/contact'
                    className='btn btn-main rounded-pill py-16 px-32 mt-28 w-100'
                  >
                    Contact Seller
                  </Link>
                </div>
                <div className='border border-gray-50 rounded-8 p-24'>
                  <h6 className='text-xl border-bottom border-gray-100 pb-24 mb-24'>
                    Product Category
                  </h6>
                  <ul className='max-h-326 overflow-y-auto scroll-sm'>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Mobile &amp; Accessories (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Laptop (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Electronics (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Smart Watch (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Storage (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Portable Devices (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Action Camera (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Smart Gadget (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Monitor (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Smart TV (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Camera (12)
                      </Link>
                    </li>
                    <li className='mb-24'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Monitor Stand (12)
                      </Link>
                    </li>
                    <li className='mb-0'>
                      <Link
                        to='/product-details-two'
                        className='text-gray-900 hover-text-main-600'
                      >
                        Headphone (12)
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className='border border-gray-50 rounded-8 p-24'>
                  <h6 className='text-xl border-bottom border-gray-100 pb-24 mb-24'>
                    Filter by Price
                  </h6>
                  <div className='custom--range'>
                    <ReactSlider
                      className='horizontal-slider'
                      thumbClassName='example-thumb'
                      trackClassName='example-track'
                      defaultValue={[0, 100]}
                      ariaLabel={["Lower thumb", "Upper thumb"]}
                      ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                      renderThumb={(props, state) => {
                        const { key, ...restProps } = props;
                        return (
                          <div {...restProps} key={state.index}>
                            {state.valueNow}
                          </div>
                        );
                      }}
                      pearling
                      minDistance={10}
                    />

                    <br />
                    <br />
                    <div className='flex-between flex-wrap-reverse gap-8 mt-24 '>
                      <button
                        type='button'
                        className='btn btn-main h-40 flex-align'
                      >
                        Filter{" "}
                      </button>
                    </div>
                  </div>
                </div>
                <div className='border border-gray-50 rounded-8 p-24'>
                  <h6 className='text-xl border-bottom border-gray-100 pb-24 mb-24'>
                    Filter by Rating
                  </h6>
                  <div className='flex-align gap-8 position-relative mb-20'>
                    <label
                      className='position-absolute w-100 h-100 cursor-pointer'
                      htmlFor='rating5'
                    >
                      {" "}
                    </label>
                    <div className='common-check common-radio mb-0'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='flexRadioDefault'
                        id='rating5'
                      />
                    </div>
                    <div className='flex-align gap-4'>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-gray-900 flex-shrink-0'>124</span>
                  </div>
                  <div className='flex-align gap-8 position-relative mb-20'>
                    <label
                      className='position-absolute w-100 h-100 cursor-pointer'
                      htmlFor='rating4'
                    >
                      {" "}
                    </label>
                    <div className='common-check common-radio mb-0'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='flexRadioDefault'
                        id='rating4'
                      />
                    </div>
                    <div className='flex-align gap-4'>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-gray-900 flex-shrink-0'>52</span>
                  </div>
                  <div className='flex-align gap-8 position-relative mb-20'>
                    <label
                      className='position-absolute w-100 h-100 cursor-pointer'
                      htmlFor='rating3'
                    >
                      {" "}
                    </label>
                    <div className='common-check common-radio mb-0'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='flexRadioDefault'
                        id='rating3'
                      />
                    </div>
                    <div className='flex-align gap-4'>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-gray-900 flex-shrink-0'>12</span>
                  </div>
                  <div className='flex-align gap-8 position-relative mb-20'>
                    <label
                      className='position-absolute w-100 h-100 cursor-pointer'
                      htmlFor='rating2'
                    >
                      {" "}
                    </label>
                    <div className='common-check common-radio mb-0'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='flexRadioDefault'
                        id='rating2'
                      />
                    </div>
                    <div className='flex-align gap-4'>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-gray-900 flex-shrink-0'>5</span>
                  </div>
                  <div className='flex-align gap-8 position-relative mb-0'>
                    <label
                      className='position-absolute w-100 h-100 cursor-pointer'
                      htmlFor='rating1'
                    >
                      {" "}
                    </label>
                    <div className='common-check common-radio mb-0'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='flexRadioDefault'
                        id='rating1'
                      />
                    </div>
                    <div className='flex-align gap-4'>
                      <span className='text-xs fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-xs fw-medium text-gray-400 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-gray-900 flex-shrink-0'>2</span>
                  </div>
                </div>
                <div className='bg-main-50 rounded-8 p-16 text-center'>
                  <span className='text-2xl text-neutral-600 mb-8'>
                    Fresh Vegetables
                  </span>
                  <h5 className='text-32 text-main-600'>Up to 25% Off</h5>
                  <div className='mt-52'>
                    <img src='assets/images/thumbs/advertiser-img.png' alt='' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xxl-10 col-xl-9 col-lg-8'>
            {/* Top Search */}
            <div className='flex-between flex-wrap gap-8 mb-40'>
              <form
                action='#'
                className='search-form__wrapper position-relative d-block'
              >
                <input
                  type='text'
                  className='search-form__input common-input py-13 ps-16 pe-18 rounded-pill pe-44'
                  placeholder='Search vendors by name or ID...'
                />
                <button
                  type='submit'
                  className='w-32 h-32 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8'
                >
                  <i className='ph ph-magnifying-glass' />
                </button>
              </form>
              <div className='flex-align gap-16'>
                <span className='text-neutral-600 fw-medium px-40 py-12 rounded-pill border border-neutral-100 d-md-block d-none'>
                  Showing 1-20 of 85 results
                </span>
                <div className='flex-align gap-8'>
                  <span className='text-gray-900 flex-shrink-0'>Sort by:</span>
                  <select className='common-input form-select rounded-pill border border-gray-100 d-inline-block ps-20 pe-36 h-48 py-0 fw-medium' defaultValue={1}>
                    <option value={1}>Latest</option>
                    <option value={1}>Old</option>
                  </select>
                </div>
                <button
                  onClick={sidebarController}
                  type='button'
                  className='w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn'
                >
                  <i className='ph-bold ph-funnel' />
                </button>
              </div>
            </div>
            {/* Top Search End */}
            {/* Products Start */}
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-12'>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img7/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img8/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Marcel's Modern Pantry Almond Unsweetened
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img9/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        O Organics Milk, Whole, Vitamin D
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-info-600 px-8 py-4 text-sm text-white'>
                    Best Sale
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img10/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Whole Grains and Seeds Organic Bread
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img11/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Lucerne Yogurt, Lowfat, Strawberry
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img13/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img14/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-warning-600 px-8 py-4 text-sm text-white'>
                    New
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img15/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img16/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Good &amp; Gather Farmed Atlantic Salmon
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img17/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Market Pantry 41/50 Raw Tail-Off Large Raw Shrimp
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img7/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img8/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Marcel's Modern Pantry Almond Unsweetened
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img9/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        O Organics Milk, Whole, Vitamin D
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-info-600 px-8 py-4 text-sm text-white'>
                    Best Sale
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img10/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Whole Grains and Seeds Organic Bread
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img11/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Lucerne Yogurt, Lowfat, Strawberry
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img13/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img14/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-warning-600 px-8 py-4 text-sm text-white'>
                    New
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img15/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        C-500 Antioxidant Protect Dietary Supplement
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img16/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Good &amp; Gather Farmed Atlantic Salmon
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col'>
                <div className='product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                  <span className='product-card__badge bg-danger-600 px-8 py-4 text-sm text-white'>
                    Sale 50%
                  </span>
                  <Link
                    to='/product-details'
                    className='product-card__thumb flex-center'
                  >
                    <img src='https://picsum.photos/seed/product-img17/400/400' alt='' />
                  </Link>
                  <div className='product-card__content p-sm-2 w-100'>
                    <h6 className='title text-lg fw-semibold mt-12 mb-8'>
                      <Link to='/product-details' className='link text-line-2'>
                        Market Pantry 41/50 Raw Tail-Off Large Raw Shrimp
                      </Link>
                    </h6>
                    <div className='flex-align gap-4'>
                      <span className='text-main-600 text-md d-flex'>
                        <i className='ph-fill ph-storefront' />
                      </span>
                      <span className='text-gray-500 text-xs'>
                        By Lucky Supermarket
                      </span>
                    </div>
                    <div className='product-card__content mt-12'>
                      <div className='product-card__price mb-8'>
                        <span className='text-heading text-md fw-semibold '>
                          $14.99{" "}
                          <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                        </span>
                        <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                          $28.99
                        </span>
                      </div>
                      <div className='flex-align gap-6'>
                        <span className='text-xs fw-bold text-gray-600'>
                          4.8
                        </span>
                        <span className='text-15 fw-bold text-warning-600 d-flex'>
                          <i className='ph-fill ph-star' />
                        </span>
                        <span className='text-xs fw-bold text-gray-600'>
                          (17k)
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center'
                      >
                        Add To Cart <i className='ph ph-shopping-cart' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Products End */}
            {/* Pagination Start */}
            <ul className='pagination flex-center flex-wrap gap-16'>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-xxl rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  <i className='ph-bold ph-arrow-left' />
                </Link>
              </li>
              <li className='page-item active'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  01
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  02
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  03
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  04
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  05
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  06
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  07
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-xxl rounded-circle fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  <i className='ph-bold ph-arrow-right' />
                </Link>
              </li>
            </ul>
            {/* Pagination End */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorsListTwo;
