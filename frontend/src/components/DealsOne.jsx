import React, { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';


const SampleNextArrow = memo(function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
        <button
            type="button" onClick={onClick}
            className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
        >
            <i className="ph ph-caret-right" />
        </button>
    );
});

const SamplePrevArrow = memo(function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
        >
            <i className="ph ph-caret-left" />
        </button>
    );
});

const DealsOne = () => {
    const [timeLeft, setTimeLeft] = useState(getCountdown());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1599,
                settings: {
                    slidesToShow: 5,

                },
            },
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 3,

                },
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,

                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,

                },
            },

        ],
    };
    return (
        <section className="deals-weeek pt-80">
            <div className="container container-lg">
                <div className="border border-gray-100 p-24 rounded-16">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-8">
                            <h5 className="mb-0">Deal of The Week</h5>
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
                    <div className="deal-week-box rounded-16 overflow-hidden flex-between position-relative z-1 mb-24">
                        <img
                            src="assets/images/bg/week-deal-bg.png"
                            alt=""
                            className="position-absolute inset-block-start-0 inset-block-start-0 w-100 h-100 z-n1 object-fit-cover"
                        />
                        <div className="d-lg-block d-none ps-32 flex-shrink-0">
                            <img src="assets/images/thumbs/week-deal-img1.png" alt="" />
                        </div>
                        <div className="deal-week-box__content px-sm-4 d-block w-100 text-center">
                            <h6 className="mb-20">Apple AirPods Max, Over Ear Headphones</h6>
                            <div className="countdown mt-20" id="countdown4">
                                <ul className="countdown-list style-four flex-center flex-wrap">
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="days" />
                                        {timeLeft.days} <br /> Days
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="hours" />
                                        {timeLeft.hours} <br /> Hour
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="minutes" />
                                        {timeLeft.minutes} <br /> Min
                                    </li>
                                    <li className="countdown-list__item flex-align flex-column text-sm fw-medium text-white rounded-circle bg-neutral-600">
                                        <span className="seconds" />
                                        {timeLeft.seconds} <br /> Sec
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="d-lg-block d-none flex-shrink-0 pe-xl-5">
                            <div className="me-xxl-5">
                                <img src="assets/images/thumbs/week-deal-img2.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="deals-week-slider arrow-style-two">
                        <Slider {...settings}>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-main-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            Sold
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img1/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            Sale 50%{" "}
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img2/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            New
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img3/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            Best seller
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img4/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-main-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            Best Seller{" "}
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img5/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            Best seller
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img6/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                    <Link
                                        to="/product-details-two"
                                        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                    >
                                        <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                            New
                                        </span>
                                        <img
                                            src="https://picsum.photos/seed/product-two-img9/400/400"
                                            alt=""
                                            className="w-auto max-w-unset"
                                        />
                                    </Link>
                                    <div className="product-card__content mt-16">
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-medium text-gray-500">4.8</span>
                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-medium text-gray-500">(17k)</span>
                                        </div>
                                        <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                            <Link
                                                to="/product-details-two"
                                                className="link text-line-2"
                                                tabIndex={0}
                                            >
                                                Taylor Farms Broccoli Florets Vegetables
                                            </Link>
                                        </h6>
                                        <div className="flex-align gap-4">
                                            <span className="text-tertiary-600 text-md d-flex">
                                                <i className="ph-fill ph-storefront" />
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                By Lucky Supermarket
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <div
                                                className="progress w-100 bg-color-three rounded-pill h-4"
                                                role="progressbar"
                                                aria-label="Basic example"
                                                aria-valuenow={35}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="progress-bar bg-tertiary-600 rounded-pill"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-gray-900 text-xs fw-medium mt-8">
                                                Sold: 18/35
                                            </span>
                                        </div>
                                        <div className="product-card__price my-20">
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                            tabIndex={0}
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default DealsOne