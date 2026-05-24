import React from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const FeaturedOne = () => {
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
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,

                },
            },

        ],
    };
    return (
        <section className="featured-products">
            <div className="container container-lg">
                <div className="row g-4 flex-wrap-reverse">
                    <div className="col-xxl-8">
                        <div className="border border-gray-100 p-24 rounded-16">
                            <div className="section-heading mb-24">
                                <div className="flex-between flex-wrap gap-8">
                                    <h5 className="mb-0">Featured Products </h5>
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
                            <div className="row gy-4 featured-product-slider">
                                <Slider {...settings}>
                                    <div className="col-xxl-6">
                                        <div className="featured-products__sliders">
                                            <div className="">
                                                <div className="mt-24 product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                                        tabIndex={0}
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
                                                    <div className="product-card__content my-20 flex-grow-1">
                                                        <h6 className="title text-lg fw-semibold mb-12">
                                                            <Link
                                                                to="/product-details-two"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                iPhone 15 Pro Warp Charge 30W Power Adapter
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-6 mb-12">
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                4.8
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                (17k)
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-main-two-600 text-md d-flex">
                                                                <i className="ph-fill ph-storefront" />
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                By Lucky Supermarket
                                                            </span>
                                                        </div>
                                                        <div className="product-card__price my-20">
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                $28.99
                                                            </span>
                                                            <span className="text-heading text-md fw-semibold ">
                                                                $14.99{" "}
                                                                <span className="text-gray-500 fw-normal">/Qty</span>{" "}
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
                                            <div className="">
                                                <div className="mt-24 product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                                        tabIndex={0}
                                                    >
                                                        <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                            Best seller
                                                        </span>
                                                        <img
                                                            src="https://picsum.photos/seed/product-two-img3/400/400"
                                                            alt=""
                                                            className="w-auto max-w-unset"
                                                        />
                                                    </Link>
                                                    <div className="product-card__content my-20 flex-grow-1">
                                                        <h6 className="title text-lg fw-semibold mb-12">
                                                            <Link
                                                                to="/product-details-two"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                iPhone 15 Pro Warp Charge 30W Power Adapter
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-6 mb-12">
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                4.8
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                (17k)
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-main-two-600 text-md d-flex">
                                                                <i className="ph-fill ph-storefront" />
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                By Lucky Supermarket
                                                            </span>
                                                        </div>
                                                        <div className="product-card__price my-20">
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                $28.99
                                                            </span>
                                                            <span className="text-heading text-md fw-semibold ">
                                                                $14.99{" "}
                                                                <span className="text-gray-500 fw-normal">/Qty</span>{" "}
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
                                        </div>
                                    </div>
                                    <div className="col-xxl-6">
                                        <div className="featured-products__sliders">
                                            <div className="">
                                                <div className="mt-24 product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                                        tabIndex={0}
                                                    >
                                                        <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                            Best Sale
                                                        </span>
                                                        <img
                                                            src="https://picsum.photos/seed/product-two-img4/400/400"
                                                            alt=""
                                                            className="w-auto max-w-unset"
                                                        />
                                                    </Link>
                                                    <div className="product-card__content my-20 flex-grow-1">
                                                        <h6 className="title text-lg fw-semibold mb-12">
                                                            <Link
                                                                to="/product-details-two"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                iPhone 15 Pro Warp Charge 30W Power Adapter
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-6 mb-12">
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                4.8
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                (17k)
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-main-two-600 text-md d-flex">
                                                                <i className="ph-fill ph-storefront" />
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                By Lucky Supermarket
                                                            </span>
                                                        </div>
                                                        <div className="product-card__price my-20">
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                $28.99
                                                            </span>
                                                            <span className="text-heading text-md fw-semibold ">
                                                                $14.99{" "}
                                                                <span className="text-gray-500 fw-normal">/Qty</span>{" "}
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
                                            <div className="">
                                                <div className="mt-24 product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                                        tabIndex={0}
                                                    >
                                                        <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                            New
                                                        </span>
                                                        <img
                                                            src="https://picsum.photos/seed/product-two-img4/400/400"
                                                            alt=""
                                                            className="w-auto max-w-unset"
                                                        />
                                                    </Link>
                                                    <div className="product-card__content my-20 flex-grow-1">
                                                        <h6 className="title text-lg fw-semibold mb-12">
                                                            <Link
                                                                to="/product-details-two"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                iPhone 15 Pro Warp Charge 30W Power Adapter
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-6 mb-12">
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                4.8
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                (17k)
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-main-two-600 text-md d-flex">
                                                                <i className="ph-fill ph-storefront" />
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                By Lucky Supermarket
                                                            </span>
                                                        </div>
                                                        <div className="product-card__price my-20">
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                $28.99
                                                            </span>
                                                            <span className="text-heading text-md fw-semibold ">
                                                                $14.99{" "}
                                                                <span className="text-gray-500 fw-normal">/Qty</span>{" "}
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
                                        </div>
                                    </div>
                                    <div className="col-xxl-6">
                                        <div className="featured-products__sliders">
                                            <div className="">
                                                <div className="mt-24 product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                                        tabIndex={0}
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
                                                    <div className="product-card__content my-20 flex-grow-1">
                                                        <h6 className="title text-lg fw-semibold mb-12">
                                                            <Link
                                                                to="/product-details-two"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                iPhone 15 Pro Warp Charge 30W Power Adapter
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-6 mb-12">
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                4.8
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                (17k)
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-main-two-600 text-md d-flex">
                                                                <i className="ph-fill ph-storefront" />
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                By Lucky Supermarket
                                                            </span>
                                                        </div>
                                                        <div className="product-card__price my-20">
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                $28.99
                                                            </span>
                                                            <span className="text-heading text-md fw-semibold ">
                                                                $14.99{" "}
                                                                <span className="text-gray-500 fw-normal">/Qty</span>{" "}
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
                                            <div className="">
                                                <div className="mt-24 product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                    <Link
                                                        to="/product-details-two"
                                                        className="product-card__thumb flex-center h-unset rounded-8 bg-gray-50 position-relative w-unset flex-shrink-0 p-24"
                                                        tabIndex={0}
                                                    >
                                                        <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                            Best seller
                                                        </span>
                                                        <img
                                                            src="https://picsum.photos/seed/product-two-img3/400/400"
                                                            alt=""
                                                            className="w-auto max-w-unset"
                                                        />
                                                    </Link>
                                                    <div className="product-card__content my-20 flex-grow-1">
                                                        <h6 className="title text-lg fw-semibold mb-12">
                                                            <Link
                                                                to="/product-details-two"
                                                                className="link text-line-2"
                                                                tabIndex={0}
                                                            >
                                                                iPhone 15 Pro Warp Charge 30W Power Adapter
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align gap-6 mb-12">
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                4.8
                                                            </span>
                                                            <span className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                            <span className="text-xs fw-medium text-gray-500">
                                                                (17k)
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-main-two-600 text-md d-flex">
                                                                <i className="ph-fill ph-storefront" />
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                By Lucky Supermarket
                                                            </span>
                                                        </div>
                                                        <div className="product-card__price my-20">
                                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                $28.99
                                                            </span>
                                                            <span className="text-heading text-md fw-semibold ">
                                                                $14.99{" "}
                                                                <span className="text-gray-500 fw-normal">/Qty</span>{" "}
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
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4">
                        <div className="position-relative rounded-16 bg-light-purple overflow-hidden p-28 pb-0 z-1 text-center h-100">
                            <img
                                src="assets/images/bg/featured-product-bg.png"
                                alt=""
                                className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img"
                            />
                            <div className="py-xl-4 text-center">
                                <span className="h6 mb-20 text-white">
                                    iPhone Smart Phone - Red
                                </span>
                                <div className="flex-center gap-12 text-white">
                                    <span className="">FROM</span>
                                    <h4 className="mb-8 text-white">$890</h4>
                                    <span className="badge-style-two position-relative me-8 bg-main-two-600 text-white text-sm py-2 px-8 rounded-4">
                                        20% off
                                    </span>
                                </div>
                                <Link
                                    to="/shop"
                                    className="mt-16 mb-24 btn btn-main-two fw-medium d-inline-flex align-items-center rounded-pill gap-8"
                                    tabIndex={0}
                                >
                                    Shop Now
                                    <span className="icon text-xl d-flex">
                                        <i className="ph ph-arrow-right" />
                                    </span>
                                </Link>
                            </div>
                            <img
                                src="assets/images/thumbs/featured-product-img.png"
                                alt=""
                                className="d-xxl-inline-flex d-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default FeaturedOne