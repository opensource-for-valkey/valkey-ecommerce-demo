import React from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const TopSellingTwo = () => {
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-right" />
            </button>
        );
    }
    function SamplePrevArrow(props) {
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
    }
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
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
        <section className="recommended">
            <div className="container container-lg">
                <div className="row g-12">
                    <div className="col-xxl-4">
                        <div className="position-relative rounded-16 bg-light-purple overflow-hidden p-28 z-1 text-center h-100">
                            <img
                                src="assets/images/bg/recommended-bg.png"
                                alt=""
                                className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img"
                            />
                            <div className="py-xl-4 text-center">
                                <span className="h6 mb-20 text-white">
                                    Insta360 GO 3S Action Camera - White
                                </span>
                                <div className="flex-center gap-12 text-white">
                                    <span className="">FROM</span>
                                    <h4 className="mb-8 text-white">$430</h4>
                                    <span className="badge-style-two position-relative me-8 bg-main-two-600 text-white text-sm py-2 px-8 rounded-4">
                                        20% off
                                    </span>
                                </div>
                            </div>
                            <img
                                src="assets/images/thumbs/recommended-img.png"
                                alt=""
                                className="mt-48 d-xxl-block d-none"
                            />
                        </div>
                    </div>
                    <div className="col-xxl-8">
                        <div className="border border-gray-100 p-24 rounded-16">
                            <div className="section-heading mb-24">
                                <div className="flex-between flex-wrap gap-8">
                                    <h5 className="mb-0">Recommended For You</h5>
                                    <div className="flex-align mr-point gap-16">
                                        <Link
                                            to="/shop"
                                            className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                                        >
                                            View All
                                        </Link>

                                    </div>
                                </div>
                            </div>
                            <div className="recommended-slider">
                                <Slider {...settings}>
                                    <div>
                                        <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                            <Link
                                                to="/product-details-two"
                                                className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                            >
                                                <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                    Best Seller{" "}
                                                </span>
                                                <img
                                                    src="https://picsum.photos/seed/product-two-img1/400/400"
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
                                                    <span className="text-xs fw-medium text-gray-500">
                                                        (12K)
                                                    </span>
                                                </div>
                                                <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                                    Fulfilled by Valkey
                                                </span>
                                                <div className="product-card__price mt-16 mb-30">
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                        $28.99
                                                    </span>
                                                    <span className="text-heading text-md fw-semibold ">
                                                        $14.99{" "}
                                                        <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-600">
                                                    Delivered by <span className="text-main-600">Aug 02</span>
                                                </span>
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
                                                    src="https://picsum.photos/seed/product-two-img2/400/400"
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
                                                    <span className="text-xs fw-medium text-gray-500">
                                                        (12K)
                                                    </span>
                                                </div>
                                                <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                                    Fulfilled by Valkey
                                                </span>
                                                <div className="product-card__price mt-16 mb-30">
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                        $28.99
                                                    </span>
                                                    <span className="text-heading text-md fw-semibold ">
                                                        $14.99{" "}
                                                        <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-600">
                                                    Delivered by <span className="text-main-600">Aug 02</span>
                                                </span>
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
                                                    Sale 50%
                                                </span>
                                                <img
                                                    src="https://picsum.photos/seed/product-two-img3/400/400"
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
                                                    <span className="text-xs fw-medium text-gray-500">
                                                        (12K)
                                                    </span>
                                                </div>
                                                <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                                    Fulfilled by Valkey
                                                </span>
                                                <div className="product-card__price mt-16 mb-30">
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                        $28.99
                                                    </span>
                                                    <span className="text-heading text-md fw-semibold ">
                                                        $14.99{" "}
                                                        <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-600">
                                                    Delivered by <span className="text-main-600">Aug 02</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                            <Link
                                                to="/product-details-two"
                                                className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                            >
                                                <span className="product-card__badge bg-success-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                    Sold
                                                </span>
                                                <img
                                                    src="https://picsum.photos/seed/product-two-img4/400/400"
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
                                                    <span className="text-xs fw-medium text-gray-500">
                                                        (12K)
                                                    </span>
                                                </div>
                                                <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                                    Fulfilled by Valkey
                                                </span>
                                                <div className="product-card__price mt-16 mb-30">
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                        $28.99
                                                    </span>
                                                    <span className="text-heading text-md fw-semibold ">
                                                        $14.99{" "}
                                                        <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-600">
                                                    Delivered by <span className="text-main-600">Aug 02</span>
                                                </span>
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
                                                    src="https://picsum.photos/seed/product-two-img2/400/400"
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
                                                    <span className="text-xs fw-medium text-gray-500">
                                                        (12K)
                                                    </span>
                                                </div>
                                                <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16">
                                                    Fulfilled by Valkey
                                                </span>
                                                <div className="product-card__price mt-16 mb-30">
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                        $28.99
                                                    </span>
                                                    <span className="text-heading text-md fw-semibold ">
                                                        $14.99{" "}
                                                        <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                    </span>
                                                </div>
                                                <span className="text-neutral-600">
                                                    Delivered by <span className="text-main-600">Aug 02</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default TopSellingTwo