import React from "react";
import { Link } from "react-router-dom";

const NewArrivalThree = () => {
  return (
    <section className='new-arrival-three py-120 overflow-hidden'>
      <div className='container container-lg'>
        <div className='section-heading text-center '>
          <h5 className='mb-0 text-uppercase '>New Arrivals</h5>
        </div>
        <ul
          className='nav common-tab style-two nav-pills justify-content-center mb-40 '
          id='pills-tabThree'
          role='tablist'
        >
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link active'
              id='pills-all-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-all'
              type='button'
              role='tab'
              aria-controls='pills-all'
              aria-selected='true'
            >
              All
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-Jacket-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-Jacket'
              type='button'
              role='tab'
              aria-controls='pills-Jacket'
              aria-selected='false'
            >
              Jacket
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-Shoes-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-Shoes'
              type='button'
              role='tab'
              aria-controls='pills-Shoes'
              aria-selected='false'
            >
              Shoes
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-Hats-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-Hats'
              type='button'
              role='tab'
              aria-controls='pills-Hats'
              aria-selected='false'
            >
              Hats
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-Goggles-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-Goggles'
              type='button'
              role='tab'
              aria-controls='pills-Goggles'
              aria-selected='false'
            >
              Goggles
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-Bags-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-Bags'
              type='button'
              role='tab'
              aria-controls='pills-Bags'
              aria-selected='false'
            >
              Bags
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-Jeans-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-Jeans'
              type='button'
              role='tab'
              aria-controls='pills-Jeans'
              aria-selected='false'
            >
              Jeans
            </button>
          </li>
        </ul>
        <div className='tab-content' id='pills-tabContentThree'>
          <div
            className='tab-pane fade show active'
            id='pills-all'
            role='tabpanel'
            aria-labelledby='pills-all-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link
                          to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-Jacket'
            role='tabpanel'
            aria-labelledby='pills-Jacket-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-Shoes'
            role='tabpanel'
            aria-labelledby='pills-Shoes-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-Hats'
            role='tabpanel'
            aria-labelledby='pills-Hats-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-Goggles'
            role='tabpanel'
            aria-labelledby='pills-Goggles-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-Bags'
            role='tabpanel'
            aria-labelledby='pills-Bags-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className='tab-pane fade'
            id='pills-Jeans'
            role='tabpanel'
            aria-labelledby='pills-Jeans-tab'
            tabIndex={0}
          >
            <div className='new-arrival-three-wrapper'>
              <div className='row gy-4'>
                <div className='col-xl-4'>
                  <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                    <div
                      className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                      style={{
                        backgroundImage:
                          "url(/assets/images/thumbs/new-arrival-promo-img1.png)",
                      }}
                    >
                      <div className='py-32 pe-32 text-end'>
                        <span className='text-uppercase fw-semibold text-neutral-600 text-md'>
                          Summer offer
                        </span>
                        <h5 className='mb-0'>Get 85% Off</h5>
                        <Link to='/shop'
                          className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                          tabIndex={0}
                        >
                          Shop Now
                          <span className='text-xl d-flex'>
                            <i className='ph ph-shopping-cart-simple' />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-8'>
                  <div className='row gy-4'>
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
                    <div className='col-lg-4 col-sm-6'>
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
                              <span className='text-gray-500 fw-normal'>
                                /Qty
                              </span>{" "}
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
              <div className='mt-24'>
                <div className='row gy-4'>
                  <div className='col-xl-8'>
                    <div className='row gy-4'>
                      <div className='col-lg-4 col-sm-6'>
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
                                Oasis Linen Jumpsuit
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Velvet Rose Clutch
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                      <div className='col-lg-4 col-sm-6'>
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
                                Echoes of Elegance Trench Coat
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
                                <span className='text-gray-500 fw-normal'>
                                  /Qty
                                </span>{" "}
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
                  <div className='col-xl-4'>
                    <div className='rounded-24 overflow-hidden border border-main-two-600 p-16 bg-color-three h-100'>
                      <div
                        className='bg-img w-100 h-100 min-h-485 rounded-24 overflow-hidden'
                        style={{
                          backgroundImage:
                            "url(/assets/images/thumbs/new-arrival-promo-img2.png)",
                        }}
                      >
                        <div className='py-32 pe-32 text-end'>
                          <span className='text-uppercase fw-semibold text-neutral-600 text-sm'>
                            Get extra discount on first order
                          </span>
                          <h5 className='mb-0 text-white fw-medium'>
                            Spring Collection
                          </h5>
                          <Link
                            to='/shop'
                            className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                            tabIndex={0}
                          >
                            Shop Now
                            <span className='text-xl d-flex'>
                              <i className='ph ph-shopping-cart-simple' />
                            </span>
                          </Link>
                        </div>
                        <div className='bg-neutral-600 rounded-circle p-lg-5 p-md-4 p--24 max-w-260 max-h-260 w-100 h-100 ms-auto'>
                          <div className='bg-white bg-opacity-10 w-100 h-100 rounded-circle d-flex justify-content-center align-items-center'>
                            <h3 className='text-white mb-0 fw-medium'>
                              45% <br /> Off
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default NewArrivalThree;
