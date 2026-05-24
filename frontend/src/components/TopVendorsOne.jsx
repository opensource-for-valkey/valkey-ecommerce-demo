import React from 'react'
import { Link } from 'react-router-dom'

const TopVendorsOne = () => {
    return (
        <section className="top-vendors py-80">
            <div className="container container-lg">
                <div className="section-heading">
                    <div className="flex-between flex-wrap gap-8">
                        <h5 className="mb-0">Weekly Top Vendors</h5>
                        <Link
                            to="/shop"
                            className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                        >
                            All Vendors
                        </Link>
                    </div>
                </div>
                <div className="row gy-4 vendor-card-wrapper">
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo1.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Organic Market</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo2.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Safeway</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo3.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Food Max</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo4.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">HRmart</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo5.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Lucky Supermarket</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo6.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Arico Farmer</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo7.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Farmer Market</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-sm-6">
                        <div className="vendor-card text-center px-16 pb-24">
                            <div className="">
                                <img
                                    src="/assets/images/thumbs/vendor-logo8.png"
                                    alt=""
                                    className="vendor-card__logo m-12"
                                />
                                <h6 className="title mt-32">Foodsco</h6>
                                <span className="text-heading text-sm d-block">
                                    Delivery by 6:15am
                                </span>
                                <Link
                                    to="/shop"
                                    className="btn btn-main-two rounded-pill py-6 px-16 text-12 mt-8"
                                >
                                    $5 off Snack &amp; Candy
                                </Link>
                            </div>
                            <div className="vendor-card__list mt-22 flex-center flex-wrap gap-8">
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img1.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img2.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img3.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img4.png" alt="" />
                                </div>
                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                    <img src="/assets/images/thumbs/vendor-img5.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default TopVendorsOne