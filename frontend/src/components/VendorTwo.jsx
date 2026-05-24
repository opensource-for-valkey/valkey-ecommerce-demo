import React, { useState } from "react";
import { Link } from "react-router-dom";

const VendorTwo = () => {
  let [grid, setGrid] = useState(false);

  let [active, setActive] = useState(false);
  let sidebarController = () => {
    setActive(!active);
  };
  return (
    <section className='vendor-two py-80'>
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className='container container-lg'>
        {/* Top Search */}
        <div className='d-flex align-items-center justify-content-between flex-wrap mb-48 gap-16'>
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
            <div className='text-gray-600 text-md flex-shrink-0'>
              {" "}
              <span className='text-neutral-900 fw-semibold'>52</span> Results
              Found
            </div>
            <div className='d-flex align-items-center gap-8 d-sm-flex d-none'>
              <button
                onClick={() => setGrid(false)}
                type='button'
                className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                  grid === false && "border-main-600 text-white bg-main-600"
                }`}
              >
                <i className='ph ph-squares-four' />
              </button>
              <button
                onClick={() => setGrid(true)}
                type='button'
                className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                  grid === true && "border-main-600 text-white bg-main-600"
                }`}
              >
                <i className='ph-bold ph-list-dashes' />
              </button>
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
        {/* Top Search End */}
        <div className='row'>
          <div className='col-xl-3 col-lg-4'>
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type='button'
                className='shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600'
              >
                <i className='ph ph-x' />
              </button>
              <div className='d-flex flex-column gap-12 px-lg-0 px-3 py-lg-0 py-4'>
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
                <div className='shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32'>
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
                    <div
                      className='progress w-100 bg-gray-100 rounded-pill h-8'
                      role='progressbar'
                      aria-label='Basic example'
                      aria-valuenow={70}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className='progress-bar bg-main-600 rounded-pill'
                        style={{ width: "70%" }}
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
                    <div
                      className='progress w-100 bg-gray-100 rounded-pill h-8'
                      role='progressbar'
                      aria-label='Basic example'
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className='progress-bar bg-main-600 rounded-pill'
                        style={{ width: "50%" }}
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
                    <div
                      className='progress w-100 bg-gray-100 rounded-pill h-8'
                      role='progressbar'
                      aria-label='Basic example'
                      aria-valuenow={35}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className='progress-bar bg-main-600 rounded-pill'
                        style={{ width: "35%" }}
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
                    <div
                      className='progress w-100 bg-gray-100 rounded-pill h-8'
                      role='progressbar'
                      aria-label='Basic example'
                      aria-valuenow={20}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className='progress-bar bg-main-600 rounded-pill'
                        style={{ width: "20%" }}
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
                    <div
                      className='progress w-100 bg-gray-100 rounded-pill h-8'
                      role='progressbar'
                      aria-label='Basic example'
                      aria-valuenow={5}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className='progress-bar bg-main-600 rounded-pill'
                        style={{ width: "5%" }}
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
                <div className='border border-gray-50 rounded-8 p-24'>
                  <h6 className='text-xl border-bottom border-gray-100 pb-24 mb-24'>
                    Filter by Location
                  </h6>
                  <div className='d-flex flex-column gap-8'>
                    <select
                      className='common-input form-select'
                      defaultValue={1}
                    >
                      <option value={1}>Country</option>
                      <option value={2}>Bangladesh</option>
                      <option value={3}>Pakistan</option>
                      <option value={3}>Vutan</option>
                      <option value={4}>Nepal</option>
                    </select>
                    <select
                      className='common-input form-select'
                      defaultValue={1}
                    >
                      <option value={1} disabled>
                        State
                      </option>
                      <option value={2}>California</option>
                      <option value={3}>Washington</option>
                      <option value={4}>Florida</option>
                      <option value={5}>Texas</option>
                    </select>
                    <select
                      className='common-input form-select'
                      defaultValue={1}
                    >
                      <option value={1}>City</option>
                      <option value={2}>New York</option>
                      <option value={3}>San Francisco</option>
                      <option value={4}> Oklahoma City</option>
                      <option value={5}>Chicago</option>
                    </select>
                    <input
                      type='text'
                      className='common-input'
                      placeholder='Zip'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-xl-9 col-lg-8'>
            {/* Vendors Start */}
            <div
              className={`list-grid-wrapper vendors-two-item-wrapper grid-cols-3 ${
                grid && "list-view"
              }`}
            >
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img1.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon1.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          e-Mart Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img2.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon2.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          Baishakhi
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img3.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon3.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          e-zone Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img4.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon1.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          Cloth &amp; Fashion Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img5.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon5.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          New Market Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img6.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon6.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          Zeilla Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img7.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon7.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          Ever Green Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img8.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon8.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          Maple Shop
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
              <div className='vendors-two-item rounded-12 overflow-hidden bg-color-three border border-neutral-50 hover-border-main-two-600 transition-2'>
                <div className='vendors-two-item__top bg-overlay style-two position-relative'>
                  <div className='vendors-two-item__thumbs h-210'>
                    <img
                      src='/assets/images/thumbs/vendors-two-img9.png'
                      alt=''
                      className='cover-img'
                    />
                  </div>
                  <div className='position-absolute top-0 inset-inline-start-0 w-100 h-100 p-24 z-1 d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <span className='w-80 h-80 flex-center bg-white rounded-circle flex-shrink-0'>
                        <img
                          src='/assets/images/thumbs/vendors-two-icon2.png'
                          alt=''
                        />
                      </span>
                      <button
                        type='button'
                        className='text-uppercase border border-white px-16 py-8 rounded-pill text-white text-sm hover-bg-main-two-600 hover-text-white hover-border-main-two-600 transition-2'
                      >
                        FOLLOW
                      </button>
                    </div>
                    <div className='mt-16'>
                      <h6 className='text-white fw-semibold mb-12'>
                        <Link to='/vendor-two-details' className=''>
                          New Mart
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
                        <span className='text-xs fw-medium text-white'>
                          4.8
                        </span>
                        <span className='text-xs fw-medium text-white'>
                          (12K)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='vendors-two-item__content p-24 flex-grow-1'>
                  <div className='d-flex flex-column gap-14'>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-map-pin-line' />
                      </span>
                      <p className='text-md text-gray-900'>
                        6391 Elgin St. Celina, Delaware 10299
                      </p>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-envelope-simple' />
                      </span>
                      <a
                        href='mailto:info@watch.com'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        info@watch.com
                      </a>
                    </div>
                    <div className='flex-align gap-8'>
                      <span className='flex-center text-main-two-600 text-2xl flex-shrink-0'>
                        <i className='ph ph-phone' />
                      </span>
                      <a
                        href='tel:0833081888'
                        className='text-md text-gray-900 hover-text-main-60'
                      >
                        083 308 1888
                      </a>
                    </div>
                  </div>
                  <Link
                    to='/vendor-two-details'
                    className='btn bg-neutral-600 hover-bg-neutral-700 text-white py-12 px-24 rounded-8 flex-center gap-8 fw-medium mt-24'
                  >
                    Visit Store
                    <span className='text-xl d-flex text-main-two-600'>
                      {" "}
                      <i className='ph ph-storefront' />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {/* Vendors End */}
            {/* Pagination Start */}
            <ul className='pagination flex-center flex-wrap gap-16'>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  <i className='ph-bold ph-arrow-left' />
                </Link>
              </li>
              <li className='page-item active'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  01
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  02
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  03
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  04
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  05
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  06
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100'
                  to='#'
                >
                  07
                </Link>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100'
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

export default VendorTwo;
