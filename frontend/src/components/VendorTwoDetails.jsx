import React, { useState } from "react";
import { Link } from "react-router-dom";

const VendorTwoDetails = () => {
  let [grid, setGrid] = useState(false);

  let [active, setActive] = useState(false);
  let sidebarController = () => {
    setActive(!active);
  };

  return (
    <section className='vendor-two-details py-80'>
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className='container container-lg'>
        <div className='vendor-two-details-wrapper d-flex flex-wrap align-items-start gap-24'>
          {/* Shop Sidebar Start */}
          <div className={`shop-sidebar ${active && "active"}`}>
            <button
              onClick={sidebarController}
              type='button'
              className='shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 text-white border-main-600'
            >
              <i className='ph ph-x' />
            </button>
            <div className='d-flex flex-column gap-12 px-lg-0 px-3 py-lg-0 py-4'>
              <div className='bg-neutral-600 rounded-8 p-24'>
                <div className='d-flex align-items-center justify-content-between'>
                  <span className='w-80 h-80 flex-center bg-white rounded-8 flex-shrink-0'>
                    <img
                      src='/assets/images/thumbs/vendors-two-icon1.png'
                      alt=''
                    />
                  </span>
                  <div className='d-flex flex-column gap-24'>
                    <button
                      type='button'
                      className='text-uppercase group border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2 flex-center gap-8 w-100'
                    >
                      FOLLOW
                      <span className='text-xl d-flex text-main-two-600 group-item-white transition-2'>
                        {" "}
                        <i className='ph ph-storefront' />
                      </span>
                    </button>
                    <button
                      type='button'
                      className='text-uppercase group border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2 flex-center gap-8 w-100'
                    >
                      Chat Now
                      <span className='text-xl d-flex text-main-two-600 group-item-white transition-2'>
                        {" "}
                        <i className='ph ph-storefront' />
                      </span>
                    </button>
                  </div>
                </div>
                <div className='mt-32'>
                  <h6 className='text-white fw-semibold mb-12'>
                    <Link to='/vendor-two-details' className=''>
                      Baishakhi Plus
                    </Link>
                  </h6>
                  <span className='text-xs text-white mb-12'>
                    480589 Followers
                  </span>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-white'>4.8</span>
                    <span className='text-xs fw-medium text-white'>(12K)</span>
                  </div>
                </div>
                <div className='mt-32 d-flex flex-column gap-8'>
                  <Link
                    to='#'
                    className='px-16 py-12 border text-white border-neutral-500 w-100 rounded-4 hover-bg-main-600 hover-border-main-600'
                  >
                    About Store
                  </Link>
                  <Link
                    to='#'
                    className='px-16 py-12 border text-white border-neutral-500 w-100 rounded-4 hover-bg-main-600 hover-border-main-600'
                  >
                    Products
                  </Link>
                  <Link
                    to='#'
                    className='px-16 py-12 border text-white border-neutral-500 w-100 rounded-4 hover-bg-main-600 hover-border-main-600'
                  >
                    Return Policy
                  </Link>
                  <Link
                    to='#'
                    className='px-16 py-12 border text-white border-neutral-500 w-100 rounded-4 hover-bg-main-600 hover-border-main-600'
                  >
                    Shipping Policy
                  </Link>
                  <Link
                    to='#'
                    className='px-16 py-12 border text-white border-neutral-500 w-100 rounded-4 hover-bg-main-600 hover-border-main-600'
                  >
                    Contact Seller
                  </Link>
                </div>
              </div>
              <div className='border border-gray-50 rounded-8 p-24'>
                <h6 className='text-xl border-bottom border-gray-100 pb-24 mb-24'>
                  Product Category
                </h6>
                <ul className='max-h-540 overflow-y-auto scroll-sm'>
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
              <div className='blog-sidebar border border-gray-100 rounded-8 p-32 mb-40'>
                <h6 className='text-xl mb-32 pb-32 border-bottom border-gray-100'>
                  Best Sell Products
                </h6>
                <div className='d-flex flex-column gap-24'>
                  <div className='d-flex align-items-center flex-sm-nowrap flex-wrap gap-16'>
                    <Link
                      to='/blog-details'
                      className='w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center'
                    >
                      <img
                        src='/assets/images/thumbs/best-selling-img1.png'
                        alt=''
                        className=''
                      />
                    </Link>
                    <div className='flex-grow-1'>
                      <h6 className='text-lg mb-8 fw-medium'>
                        <Link to='/product-details-two' className='text-line-3'>
                          Man Fashion Shoe
                        </Link>
                      </h6>
                      <div className='flex-align gap-6'>
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
                        <span className='text-xs fw-medium text-neutral-500'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-neutral-500'>
                          (12K)
                        </span>
                      </div>
                      <h6 className='text-md mb-0 mt-4'>$25</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center flex-sm-nowrap flex-wrap gap-16'>
                    <Link
                      to='/blog-details'
                      className='w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center'
                    >
                      <img
                        src='/assets/images/thumbs/best-selling-img2.png'
                        alt=''
                        className=''
                      />
                    </Link>
                    <div className='flex-grow-1'>
                      <h6 className='text-lg mb-8 fw-medium'>
                        <Link to='/product-details-two' className='text-line-3'>
                          Woman Fashion Bag
                        </Link>
                      </h6>
                      <div className='flex-align gap-6'>
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
                        <span className='text-xs fw-medium text-neutral-500'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-neutral-500'>
                          (12K)
                        </span>
                      </div>
                      <h6 className='text-md mb-0 mt-4'>$25</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center flex-sm-nowrap flex-wrap gap-16'>
                    <Link
                      to='/blog-details'
                      className='w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center'
                    >
                      <img
                        src='/assets/images/thumbs/best-selling-img3.png'
                        alt=''
                        className=''
                      />
                    </Link>
                    <div className='flex-grow-1'>
                      <h6 className='text-lg mb-8 fw-medium'>
                        <Link to='/product-details-two' className='text-line-3'>
                          Woman Fashion Tops
                        </Link>
                      </h6>
                      <div className='flex-align gap-6'>
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
                        <span className='text-xs fw-medium text-neutral-500'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-neutral-500'>
                          (12K)
                        </span>
                      </div>
                      <h6 className='text-md mb-0 mt-4'>$25</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center flex-sm-nowrap flex-wrap gap-16'>
                    <Link
                      to='/blog-details'
                      className='w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center'
                    >
                      <img
                        src='/assets/images/thumbs/best-selling-img4.png'
                        alt=''
                        className=''
                      />
                    </Link>
                    <div className='flex-grow-1'>
                      <h6 className='text-lg mb-8 fw-medium'>
                        <Link to='/product-details-two' className='text-line-3'>
                          Woman Fashion Hat
                        </Link>
                      </h6>
                      <div className='flex-align gap-6'>
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
                        <span className='text-xs fw-medium text-neutral-500'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-neutral-500'>
                          (12K)
                        </span>
                      </div>
                      <h6 className='text-md mb-0 mt-4'>$25</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center flex-sm-nowrap flex-wrap gap-16'>
                    <Link
                      to='/blog-details'
                      className='w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center'
                    >
                      <img
                        src='/assets/images/thumbs/best-selling-img5.png'
                        alt=''
                        className=''
                      />
                    </Link>
                    <div className='flex-grow-1'>
                      <h6 className='text-lg mb-8 fw-medium'>
                        <Link to='/product-details-two' className='text-line-3'>
                          Woman Fashion
                        </Link>
                      </h6>
                      <div className='flex-align gap-6'>
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
                        <span className='text-xs fw-medium text-neutral-500'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-neutral-500'>
                          (12K)
                        </span>
                      </div>
                      <h6 className='text-md mb-0 mt-4'>$25</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center flex-sm-nowrap flex-wrap gap-16'>
                    <Link
                      to='/blog-details'
                      className='w-100 h-100 rounded-4 overflow-hidden w-76 h-76 flex-shrink-0 bg-color-three flex-center'
                    >
                      <img
                        src='/assets/images/thumbs/best-selling-img6.png'
                        alt=''
                        className=''
                      />
                    </Link>
                    <div className='flex-grow-1'>
                      <h6 className='text-lg mb-8 fw-medium'>
                        <Link to='/product-details-two' className='text-line-3'>
                          Woman Fashion Bag
                        </Link>
                      </h6>
                      <div className='flex-align gap-6'>
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
                        <span className='text-xs fw-medium text-neutral-500'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-neutral-500'>
                          (12K)
                        </span>
                      </div>
                      <h6 className='text-md mb-0 mt-4'>$25</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Shop Sidebar End */}
          <div className='vendor-two-details__contents'>
            {/* Inner Banner Start */}
            <div
              className='inner-banner-two bg-img rounded-16 overflow-hidden'
              style={{
                backgroundImage: `url('/assets/images/thumbs/inner-banner-two-bg.png')`,
              }}
            >
              <div className='row'>
                <div className='col-6 d-xl-block d-none' />
                <div className='col-xl-6 d-xl-flex'>
                  <div className='text-center py-32'>
                    <h6 className='text-white'>Daily Offer</h6>
                    <h3 className='my-32 text-white'>SALE 48% OFF</h3>
                    <Link
                      to='/shop'
                      className='btn btn-main d-inline-flex align-items-center rounded-8 gap-8'
                    >
                      Shop Now
                      <span className='icon text-xl d-flex'>
                        <i className='ph ph-shopping-cart' />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Inner Banner End */}
            {/* Search Filter Start */}
            <div className='d-flex align-items-center justify-content-between flex-wrap mt-40 mb-32 gap-16'>
              <form action='#' className='input-group w-100 max-w-418'>
                <input
                  type='text'
                  className='form-control common-input rounded-start-3'
                  placeholder='Searching...'
                />
                <button
                  type='submit'
                  className='input-group-text border-0 bg-main-two-600 rounded-end-3 text-white text-2xl hover-bg-main-two-700 px-24'
                >
                  <i className='ph ph-magnifying-glass' />
                </button>
              </form>
              <div className='d-flex align-items-center justify-content-between justify-content-sm-end gap-16 flex-grow-1'>
                <span className='text-gray-900'>Showing 1-20 of 85 result</span>
                <div className='d-flex align-items-center gap-8 d-sm-flex d-none'>
                  <button
                    onClick={() => setGrid(true)}
                    type='button'
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                      grid === true && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className='ph-bold ph-list-dashes' />
                  </button>
                  <button
                    onClick={() => setGrid(false)}
                    type='button'
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                      grid === false && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className='ph ph-squares-four' />
                  </button>
                </div>
                <div className='flex-align gap-8'>
                  <span className='text-gray-900 flex-shrink-0 d-sm-block d-none'>
                    Sort by:
                  </span>
                  <select
                    className='common-input form-select rounded-pill border border-gray-100 d-inline-block ps-20 pe-36 h-48 py-0 fw-medium'
                    defaultValue={1}
                  >
                    <option value={1}>Latest</option>
                    <option value={1}>Old</option>
                  </select>
                </div>
                <button
                  onClick={sidebarController}
                  type='button'
                  className='w-48 h-48 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn'
                >
                  <i className='ph-bold ph-funnel' />
                </button>
              </div>
            </div>
            {/* Search Filter End */}
            {/* Products Start */}
            <div
              className={`list-grid-wrapper grid-cols-4 ${grid && "list-view"}`}
            >
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img1.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Instax Mini 12 Instant Film Camera - Green
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img2.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Midnight Noir Leather Jacket
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img3.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Urban Rebel Combat Boots
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img4.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Velvet Blossom Dress
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img1.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Instax Mini 12 Instant Film Camera - Green
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img2.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Midnight Noir Leather Jacket
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img3.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Urban Rebel Combat Boots
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img4.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Velvet Blossom Dress
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img1.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Instax Mini 12 Instant Film Camera - Green
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img2.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Midnight Noir Leather Jacket
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img3.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Urban Rebel Combat Boots
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
              <div className='product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2'>
                <div className='product-card__thumb rounded-8 bg-gray-50 position-relative'>
                  <Link
                    to='/product-details-two'
                    className='w-100 h-100 flex-center'
                  >
                    <img
                      src='/assets/images/thumbs/trending-three-img4.png'
                      alt=''
                      className='w-auto max-w-unset'
                    />
                  </Link>
                  <div className='position-absolute inset-block-start-0 inset-inline-start-0 mt-16 ms-16 z-1 d-flex flex-column gap-8'>
                    <span className='text-main-two-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      -29%
                    </span>
                    <span className='text-neutral-600 w-40 h-40 d-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm text-xs fw-semibold'>
                      HOT
                    </span>
                  </div>
                  <div className='group bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
                    <button
                      type='button'
                      className='expand-btn w-40 h-40 text-md d-flex justify-content-center align-items-center rounded-circle hover-bg-main-two-600 hover-text-white'
                    >
                      <i className='ph ph-plus' />
                    </button>
                    <div className='expand-icons gap-20 my-20'>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600 wishlist-btn'
                      >
                        <i className='ph ph-heart' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-eye' />
                      </button>
                      <button
                        type='button'
                        className='text-neutral-600 text-xl flex-center hover-text-main-two-600'
                      >
                        <i className='ph ph-shuffle' />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='product-card__content mt-16 w-100'>
                  <h6 className='title text-lg fw-semibold my-16'>
                    <Link
                      to='/product-details-two'
                      className='link text-line-2'
                      tabIndex={0}
                    >
                      Velvet Blossom Dress
                    </Link>
                  </h6>
                  <div className='flex-align gap-6'>
                    <div className='flex-align gap-8'>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                      <span className='text-15 fw-medium text-warning-600 d-flex'>
                        <i className='ph-fill ph-star' />
                      </span>
                    </div>
                    <span className='text-xs fw-medium text-gray-500'>4.8</span>
                    <span className='text-xs fw-medium text-gray-500'>
                      (12K)
                    </span>
                  </div>
                  <span className='py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16'>
                    Fulfilled by Valkey
                  </span>
                  <div className='product-card__price mt-16 mb-30'>
                    <span className='text-gray-400 text-md fw-semibold text-decoration-line-through'>
                      $28.99
                    </span>
                    <span className='text-heading text-md fw-semibold '>
                      $14.99{" "}
                      <span className='text-gray-500 fw-normal'>/Qty</span>{" "}
                    </span>
                  </div>
                  <Link
                    to='/cart'
                    className='product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium'
                    tabIndex={0}
                  >
                    Add To Cart <i className='ph ph-shopping-cart' />
                  </Link>
                </div>
              </div>
            </div>
            {/* Products End */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorTwoDetails;
