import React from 'react'
import { Link } from 'react-router-dom'

const RecentlyViewedOne = () => {
    return (
        <section className="recently-viewed pt-80">
            <div className="container container-lg">
                <div className="border border-gray-100 p-24 rounded-16">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-8">
                            <h5 className="mb-0">Recently Viewed Products</h5>
                            <div className="flex-align gap-16">
                                <Link
                                    to="/shop"
                                    className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                >
                                    View All Products
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row g-12">
                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details-two"
                                    className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                >
                                    <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                        Best Seller{" "}
                                    </span>
                                    <img
                                        src="/assets/images/thumbs/product-two-img1.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content mt-16">
                                    <span className="text-main-600 bg-main-50 text-sm fw-medium py-4 px-8">
                                        19%OFF
                                    </span>
                                    <h6 className="title text-lg fw-semibold my-16">
                                        <Link
                                            to="/product-details-two"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Instax Mini 12 Instant Film Camera - Green
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-6">
                                        <div className="flex-align gap-8">
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                        </div>
                                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                                    </div>
                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                        Fulfilled by Valkey
                                    </span>
                                    <div className="product-card__price mt-16 mb-30">
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99
                                        </span>
                                        <span className="text-heading text-md fw-semibold ">
                                            $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600">
                                        Delivered by <span className="text-main-600">Aug 02</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details-two"
                                    className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                >
                                    <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                        New
                                    </span>
                                    <img
                                        src="/assets/images/thumbs/product-two-img2.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content mt-16">
                                    <span className="text-main-600 bg-main-50 text-sm fw-medium py-4 px-8">
                                        19%OFF
                                    </span>
                                    <h6 className="title text-lg fw-semibold my-16">
                                        <Link
                                            to="/product-details-two"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Instax Mini 12 Instant Film Camera - Green
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-6">
                                        <div className="flex-align gap-8">
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                        </div>
                                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                                    </div>
                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                        Fulfilled by Valkey
                                    </span>
                                    <div className="product-card__price mt-16 mb-30">
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99
                                        </span>
                                        <span className="text-heading text-md fw-semibold ">
                                            $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600">
                                        Delivered by <span className="text-main-600">Aug 02</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details-two"
                                    className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                >
                                    <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                        Sale 50%
                                    </span>
                                    <img
                                        src="/assets/images/thumbs/product-two-img3.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content mt-16">
                                    <span className="text-main-600 bg-main-50 text-sm fw-medium py-4 px-8">
                                        19%OFF
                                    </span>
                                    <h6 className="title text-lg fw-semibold my-16">
                                        <Link
                                            to="/product-details-two"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Instax Mini 12 Instant Film Camera - Green
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-6">
                                        <div className="flex-align gap-8">
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                        </div>
                                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                                    </div>
                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                        Fulfilled by Valkey
                                    </span>
                                    <div className="product-card__price mt-16 mb-30">
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99
                                        </span>
                                        <span className="text-heading text-md fw-semibold ">
                                            $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600">
                                        Delivered by <span className="text-main-600">Aug 02</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details-two"
                                    className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                >
                                    <span className="product-card__badge bg-success-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                        Sold
                                    </span>
                                    <img
                                        src="/assets/images/thumbs/product-two-img4.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content mt-16">
                                    <span className="text-main-600 bg-main-50 text-sm fw-medium py-4 px-8">
                                        19%OFF
                                    </span>
                                    <h6 className="title text-lg fw-semibold my-16">
                                        <Link
                                            to="/product-details-two"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Instax Mini 12 Instant Film Camera - Green
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-6">
                                        <div className="flex-align gap-8">
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                        </div>
                                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                                    </div>
                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                        Fulfilled by Valkey
                                    </span>
                                    <div className="product-card__price mt-16 mb-30">
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99
                                        </span>
                                        <span className="text-heading text-md fw-semibold ">
                                            $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600">
                                        Delivered by <span className="text-main-600">Aug 02</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details-two"
                                    className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                >
                                    <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                        Best Seller{" "}
                                    </span>
                                    <img
                                        src="/assets/images/thumbs/product-two-img5.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content mt-16">
                                    <span className="text-main-600 bg-main-50 text-sm fw-medium py-4 px-8">
                                        19%OFF
                                    </span>
                                    <h6 className="title text-lg fw-semibold my-16">
                                        <Link
                                            to="/product-details-two"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Instax Mini 12 Instant Film Camera - Green
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-6">
                                        <div className="flex-align gap-8">
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                        </div>
                                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                                    </div>
                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                        Fulfilled by Valkey
                                    </span>
                                    <div className="product-card__price mt-16 mb-30">
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99
                                        </span>
                                        <span className="text-heading text-md fw-semibold ">
                                            $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600">
                                        Delivered by <span className="text-main-600">Aug 02</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6">
                            <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details-two"
                                    className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                >
                                    <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                        New
                                    </span>
                                    <img
                                        src="/assets/images/thumbs/product-two-img6.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content mt-16">
                                    <span className="text-main-600 bg-main-50 text-sm fw-medium py-4 px-8">
                                        19%OFF
                                    </span>
                                    <h6 className="title text-lg fw-semibold my-16">
                                        <Link
                                            to="/product-details-two"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Instax Mini 12 Instant Film Camera - Green
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-6">
                                        <div className="flex-align gap-8">
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                        </div>
                                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                                    </div>
                                    <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                        Fulfilled by Valkey
                                    </span>
                                    <div className="product-card__price mt-16 mb-30">
                                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                            $28.99
                                        </span>
                                        <span className="text-heading text-md fw-semibold ">
                                            $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                        </span>
                                    </div>
                                    <span className="text-neutral-600">
                                        Delivered by <span className="text-main-600">Aug 02</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default RecentlyViewedOne