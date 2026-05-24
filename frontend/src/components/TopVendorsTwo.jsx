import React from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const TopVendorsTwo = () => {
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={` ${className} slick-next slick-arrow position-absolute top-50 translate-middle-y flex-center rounded-circle bg-neutral-600 hover-bg-main-two-600 w-24 h-24 text-white text-sm z-1 transition-1 inset-inline-end-0`}
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
                className={`${className} slick-prev slick-arrow position-absolute top-50 translate-middle-y flex-center rounded-circle bg-neutral-600 hover-bg-main-two-600 w-24 h-24 text-white text-sm z-1 transition-1 inset-inline-start-0`}
            >
                <i className="ph ph-caret-left" />
            </button>
        );
    }
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,

    };
    return (
        <section className="top-vendor py-80">
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
                    <div className="row gy-4 vendor-card-wrapper">
                        <div className="col-xxl-3 col-lg-4 col-sm-6">
                            <div className="vendor-card text-center px-16 pb-24">
                                <div className="">
                                    <img
                                        src="/assets/images/thumbs/vendor-logo1.png"
                                        alt=""
                                        className="vendor-card__logo m-12"
                                    />
                                    <h6 className="title mt-32 text-lg">Organic Market</h6>
                                    <div className="flex-align gap-6 justify-content-center">
                                        <span className="text-lg fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-md fw-medium text-heading">4.8</span>
                                        <span className="text-md fw-medium text-heading">(12K)</span>
                                    </div>
                                </div>
                                <div className="position-relative slick-arrows-style-three">

                                    <div className="vendor-card__list style-two mt-22">
                                        <Slider {...settings}>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img1.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img2.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img3.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img4.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img5.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img6.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-lg-4 col-sm-6">
                            <div className="vendor-card text-center px-16 pb-24">
                                <div className="">
                                    <img
                                        src="/assets/images/thumbs/vendor-logo1.png"
                                        alt=""
                                        className="vendor-card__logo m-12"
                                    />
                                    <h6 className="title mt-32 text-lg">Best Buy</h6>
                                    <div className="flex-align gap-6 justify-content-center">
                                        <span className="text-lg fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-md fw-medium text-heading">4.8</span>
                                        <span className="text-md fw-medium text-heading">(12K)</span>
                                    </div>
                                </div>
                                <div className="position-relative slick-arrows-style-three">
                                    <div className="vendor-card__list style-two mt-22">
                                        <Slider {...settings}>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img6.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img7.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img8.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img9.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img10.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img11.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-lg-4 col-sm-6">
                            <div className="vendor-card text-center px-16 pb-24">
                                <div className="">
                                    <img
                                        src="/assets/images/thumbs/vendor-logo1.png"
                                        alt=""
                                        className="vendor-card__logo m-12"
                                    />
                                    <h6 className="title mt-32 text-lg">Organic Market</h6>
                                    <div className="flex-align gap-6 justify-content-center">
                                        <span className="text-lg fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-md fw-medium text-heading">4.8</span>
                                        <span className="text-md fw-medium text-heading">(12K)</span>
                                    </div>
                                </div>
                                <div className="position-relative slick-arrows-style-three">
                                    <div className="vendor-card__list style-two mt-22">
                                        <Slider {...settings}>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img1.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img2.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img3.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img4.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img5.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img6.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-lg-4 col-sm-6">
                            <div className="vendor-card text-center px-16 pb-24">
                                <div className="">
                                    <img
                                        src="/assets/images/thumbs/vendor-logo1.png"
                                        alt=""
                                        className="vendor-card__logo m-12"
                                    />
                                    <h6 className="title mt-32 text-lg">Best Buy</h6>
                                    <div className="flex-align gap-6 justify-content-center">
                                        <span className="text-lg fw-medium text-warning-600 d-flex">
                                            <i className="ph-fill ph-star" />
                                        </span>
                                        <span className="text-md fw-medium text-heading">4.8</span>
                                        <span className="text-md fw-medium text-heading">(12K)</span>
                                    </div>
                                </div>
                                <div className="position-relative slick-arrows-style-three">
                                    <div className="vendor-card__list style-two mt-22">
                                        <Slider {...settings}>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img6.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img7.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img8.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img9.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img10.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="vendor-card__item bg-white rounded-circle flex-center">
                                                    <img
                                                        src="/assets/images/thumbs/vendor-two-img11.png"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default TopVendorsTwo