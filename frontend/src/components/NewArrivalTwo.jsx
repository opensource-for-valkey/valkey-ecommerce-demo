import React from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const NewArrivalTwo = () => {
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
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
                className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
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
        slidesToShow: 6,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1599,
                settings: {
                    slidesToShow: 6,

                },
            },
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 4,

                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,

                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 2,

                },
            },
            {
                breakpoint: 424,
                settings: {
                    slidesToShow: 1,

                },
            },

        ],
    };
    return (
        <section className="new-arrival pb-80">
            <div className="container container-lg">
                <div className="section-heading">
                    <div className="flex-between flex-wrap gap-8">
                        <h5 className="mb-0">You Might Also Like</h5>
                        <div className="flex-align mr-point gap-16">
                            <Link
                                to="/shop"
                                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                            >
                                All Products
                            </Link>

                        </div>
                    </div>
                </div>
                <div className="new-arrival__slider arrow-style-two">
                    <Slider {...settings}>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img7.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            C-500 Antioxidant Protect Dietary Supplement
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                                    Sale 50%{" "}
                                </span>
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img8.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            Marcel's Modern Pantry Almond Unsweetened
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                                    Sale 50%{" "}
                                </span>
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img9.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            O Organics Milk, Whole, Vitamin D
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <span className="product-card__badge bg-info-600 px-8 py-4 text-sm text-white">
                                    Best Sale{" "}
                                </span>
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img10.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            Whole Grains and Seeds Organic Bread
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img11.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            Lucerne Yogurt, Lowfat, Strawberry
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                                    Sale 50%{" "}
                                </span>
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img12.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            Nature Valley Whole Grain Oats and Honey Protein
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                <span className="product-card__badge bg-info-600 px-8 py-4 text-sm text-white">
                                    Best Sale{" "}
                                </span>
                                <Link
                                    to="/product-details"
                                    className="product-card__thumb flex-center"
                                >
                                    <img src="/assets/images/thumbs/product-img10.png" alt="" />
                                </Link>
                                <div className="product-card__content p-sm-2">
                                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                        <Link to="/product-details" className="link text-line-2">
                                            Whole Grains and Seeds Organic Bread
                                        </Link>
                                    </h6>
                                    <div className="flex-align gap-4">
                                        <span className="text-main-600 text-md d-flex">
                                            <i className="ph-fill ph-storefront" />
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            By Lucky Supermarket
                                        </span>
                                    </div>
                                    <div className="product-card__content mt-12">
                                        <div className="product-card__price mb-8">
                                            <span className="text-heading text-md fw-semibold ">
                                                $14.99 <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                            </span>
                                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                $28.99
                                            </span>
                                        </div>
                                        <div className="flex-align gap-6">
                                            <span className="text-xs fw-bold text-gray-600">4.8</span>
                                            <span className="text-15 fw-bold text-warning-600 d-flex">
                                                <i className="ph-fill ph-star" />
                                            </span>
                                            <span className="text-xs fw-bold text-gray-600">(17k)</span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 mt-24 w-100 justify-content-center"
                                        >
                                            Add To Cart <i className="ph ph-shopping-cart" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </section>

    )
}

export default NewArrivalTwo