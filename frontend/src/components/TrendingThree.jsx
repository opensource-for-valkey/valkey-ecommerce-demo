import React, { useEffect, useState } from "react";
import { getCountdown } from "../helper/Countdown";
import { Link } from "react-router-dom";

const TrendingThree = () => {
  const [timeLeft, setTimeLeft] = useState(getCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className='trending-products-three py-120 overflow-hidden'>
      <div className='container container-lg'>
        <div className='section-heading mb-24'>
          <div className='flex-between flex-wrap gap-8'>
            <h5 className='mb-0 text-uppercase'>Trending Products</h5>
            <ul
              className='nav common-tab style-two nav-pills'
              id='pills-tab'
              role='tablist'
            >
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link active'
                  id='pills-sale-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-sale'
                  type='button'
                  role='tab'
                  aria-controls='pills-sale'
                  aria-selected='true'
                >
                  On Sale
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='pills-featured-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-featured'
                  type='button'
                  role='tab'
                  aria-controls='pills-featured'
                  aria-selected='false'
                >
                  Featured Products
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='pills-rated-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-rated'
                  type='button'
                  role='tab'
                  aria-controls='pills-rated'
                  aria-selected='false'
                >
                  Best Rated
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className='tab-content' id='pills-tabContent'>
          <div
            className='tab-pane fade show active'
            id='pills-sale'
            role='tabpanel'
            aria-labelledby='pills-sale-tab'
            tabIndex={0}
          >
            <div className='row g-12'>
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div className=' group  bg-white p-2 rounded-pill z-1 position-absolute inset-inline-end-0 inset-block-start-0 me-16 mt-16 shadow-sm'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown12'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown13'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown14'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown15'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-featured'
            role='tabpanel'
            aria-labelledby='pills-featured-tab'
            tabIndex={0}
          >
            <div className='row g-12'>
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown16'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown17'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown18'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown19'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-rated'
            role='tabpanel'
            aria-labelledby='pills-rated-tab'
            tabIndex={0}
          >
            <div className='row g-12'>
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown20'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown21'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown22'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
              <div className='col-xl-3 col-lg-4 col-sm-6'>
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
                    <div
                      className='countdown position-absolute start-50 inset-block-end-0 mb-20 translate-middle-x w-100'
                      id='countdown23'
                    >
                      <ul className='countdown-list style-four flex-center flex-wrap gap-8'>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='days text-2xl text-main-two-600 fw-medium' />
                          <span className='days text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.days}
                          </span>
                          Days
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='hours text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.hours}
                          </span>
                          Hour
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='minutes text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.minutes}
                          </span>
                          Min
                        </li>
                        <li className='countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-lg bg-neutral-600'>
                          <span className='seconds text-2xl text-main-two-600 fw-medium'>
                            {timeLeft.seconds}
                          </span>
                          Sec
                        </li>
                      </ul>
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
                      <span className='text-xs fw-medium text-gray-500'>
                        4.8
                      </span>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingThree;
