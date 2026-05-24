import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCountdown } from '../helper/Countdown';

const PopularProductsOne = () => {
    const [timeLeft, setTimeLeft] = useState(getCountdown());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <section className="popular-products pt-80">
            <div className="container container-lg">
                <div className="border border-gray-100 p-24 rounded-16">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-8">
                            <h5 className="mb-0">Popular Products</h5>
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
                    <div className="popular-products-box rounded-16 overflow-hidden flex-between position-relative z-1 mb-24">
                        <img
                            src="/assets/images/bg/expensive-offer-bg.png"
                            alt=""
                            className="position-absolute inset-block-start-0 inset-block-start-0 w-100 h-100 z-n1"
                        />
                        <div className="d-lg-block d-none ps-32">
                            <img src="/assets/images/thumbs/expensive-offer1.png" alt="" />
                        </div>
                        <div className="popular-products-box__content px-sm-4 d-block w-100 text-center py-20">
                            <div className="flex-align gap-16 justify-content-center">
                                <h6 className="mb-0">Exclusive Offer</h6>
                                <h4 className="mb-0">45% OFF</h4>
                            </div>
                            <div className="countdown mt-4" id="countdown10">
                                <ul className="countdown-list style-four flex-center flex-wrap">
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600 w-56 h-56">
                                        <span className="days" />
                                        {timeLeft.days} <br /> Days
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600 w-56 h-56">
                                        <span className="hours" />
                                        {timeLeft.hours} <br /> Hour
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600 w-56 h-56">
                                        <span className="minutes" />
                                        {timeLeft.minutes} <br /> Min
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600 w-56 h-56">
                                        <span className="seconds" />
                                        {timeLeft.seconds} <br /> Sec
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="d-lg-block d-none ">
                            <img src="/assets/images/thumbs/expensive-offer2.png" alt="" />
                        </div>
                    </div>
                    <div className="row gy-4">
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img1.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Headphone &amp; Earphone
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img2.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            TV &amp; Smart Home
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img3.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Video Games
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img4.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Computer &amp; Tablets
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img5.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Car &amp; GPS
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img6.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Camera &amp; Video
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img7.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Kitchen Appliance
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-4 col-sm-6 col-xs-6">
                            <div className="product-card h-100 d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                    tabIndex={0}
                                >
                                    <img
                                        src="/assets/images/thumbs/popular-img8.png"
                                        alt=""
                                        className="w-auto max-w-unset"
                                    />
                                </Link>
                                <div className="product-card__content flex-grow-1">
                                    <h6 className="title text-lg fw-semibold mb-12">
                                        <Link
                                            to="/product-details"
                                            className="link text-line-2"
                                            tabIndex={0}
                                        >
                                            Phone &amp; Accessories
                                        </Link>
                                    </h6>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Wired Headphones
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Over-Ear Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-4">
                                        Sports Headphone
                                    </span>
                                    <span className="text-gray-600 text-sm mb-0">
                                        Earbud Headphone
                                    </span>
                                    <Link
                                        to="/shop"
                                        className="text-tertiary-600 flex-align gap-8 mt-24"
                                    >
                                        All Categories
                                        <i className="ph ph-arrow-right d-flex" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default PopularProductsOne