import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';

const ProductDetailsOne = () => {
    const location = useLocation();
    const agentProduct = location.state?.agentProduct;

    const [timeLeft, setTimeLeft] = useState(getCountdown());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const productImages = [
        "assets/images/thumbs/product-details-thumb1.png",
        "assets/images/thumbs/product-details-thumb2.png",
        "assets/images/thumbs/product-details-thumb3.png",
        "assets/images/thumbs/product-details-thumb2.png",
    ];

    // increment & decrement
    const [quantity, setQuantity] = useState(1);
    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : quantity);


    const [mainImage, setMainImage] = useState(productImages[0]);

    const settingsThumbs = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
    };
    return (
        <section className="product-details py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-lg-9">
                        <div className="row gy-4">
                            <div className="col-xl-6">
                                <div className="product-details__left">
                                    <div className="product-details__thumb-slider border border-gray-100 rounded-16">
                                        <div className="">
                                            <div className="product-details__thumb flex-center h-100">
                                                <img src={mainImage} alt="Main Product" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-24">
                                        <div className="product-details__images-slider">
                                            <Slider {...settingsThumbs}>
                                                {productImages.map((image, index) => (
                                                    <div className="center max-w-120 max-h-120 h-100 flex-center border border-gray-100 rounded-16 p-8" key={index} onClick={() => setMainImage(image)}>
                                                        <img className='thum' src={image} alt={`Thumbnail ${index}`} />
                                                    </div>
                                                ))}
                                            </Slider>



                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="product-details__content">
                                    {agentProduct && (
                                        <div className="alert alert-warning py-8 px-16 mb-16 text-sm rounded-8">
                                            <i className="ph ph-sparkle me-4" />
                                            Recommended by AI assistant
                                            {agentProduct.reason && (
                                                <span className="d-block mt-4 text-gray-700">
                                                    {agentProduct.reason}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <h5 className="mb-12">
                                        {agentProduct?.name || "Lay's Potato Chips Onion Flavored"}
                                    </h5>
                                    <div className="flex-align flex-wrap gap-12">
                                        <div className="flex-align gap-12 flex-wrap">
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
                                            <span className="text-sm fw-medium text-neutral-600">
                                                {agentProduct?.rating
                                                    ? `${agentProduct.rating} Star Rating`
                                                    : '4.7 Star Rating'}
                                            </span>
                                            <span className="text-sm fw-medium text-gray-500">
                                                (21,671)
                                            </span>
                                        </div>
                                        <span className="text-sm fw-medium text-gray-500">|</span>
                                        <span className="text-gray-900">
                                            {" "}
                                            <span className="text-gray-400">SKU:</span>
                                            {agentProduct?.productId
                                                ? agentProduct.productId.slice(-8).toUpperCase()
                                                : 'EB4DRP'}{" "}
                                        </span>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <p className="text-gray-700">
                                        {agentProduct
                                            ? 'Product details from your agentic search session. Add to cart or explore related items below.'
                                            : 'Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent'}
                                    </p>
                                    <div className="mt-32 flex-align flex-wrap gap-32">
                                        <div className="flex-align gap-8">
                                            <h4 className="mb-0">
                                                {agentProduct?.price != null
                                                    ? `₹${Number(agentProduct.price).toLocaleString('en-IN')}`
                                                    : '$25.00'}
                                            </h4>
                                            {!agentProduct && (
                                                <span className="text-md text-gray-500">$38.00</span>
                                            )}
                                        </div>
                                        <Link to="#" className="btn btn-main rounded-pill">
                                            Order on What'sApp
                                        </Link>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <div className="flex-align flex-wrap gap-16 bg-color-one rounded-8 py-16 px-24">
                                        <div className="flex-align gap-16">
                                            <span className="text-main-600 text-sm">Special Offer:</span>
                                        </div>
                                        <div className="countdown" id="countdown11">
                                            <ul className="countdown-list flex-align flex-wrap">
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.days} <span className="days" />
                                                </li>
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.hours}<span className="hours" />
                                                </li>
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.minutes}<span className="minutes" />
                                                </li>
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.seconds}<span className="seconds" />
                                                </li>
                                            </ul>
                                        </div>
                                        <span className="text-gray-900 text-xs">
                                            Remains untill the end of the offer
                                        </span>
                                    </div>
                                    <div className="mb-24">
                                        <div className="mt-32 flex-align gap-12 mb-16">
                                            <span className="w-32 h-32 bg-white flex-center rounded-circle text-main-600 box-shadow-xl">
                                                <i className="ph-fill ph-lightning" />
                                            </span>
                                            <h6 className="text-md mb-0 fw-bold text-gray-900">
                                                Products are almost sold out
                                            </h6>
                                        </div>
                                        <div
                                            className="progress w-100 bg-gray-100 rounded-pill h-8"
                                            role="progressbar"
                                            aria-label="Basic example"
                                            aria-valuenow={32}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        >
                                            <div
                                                className="progress-bar bg-main-two-600 rounded-pill"
                                                style={{ width: "32%" }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-700 mt-8">
                                            Available only:45
                                        </span>
                                    </div>
                                    <span className="text-gray-900 d-block mb-8">Quantity:</span>
                                    <div className="flex-between gap-16 flex-wrap">
                                        <div className="flex-align flex-wrap gap-16">
                                            <div className="border border-gray-100 rounded-pill py-9 px-16 flex-align">
                                                <button onClick={decrementQuantity}
                                                    type="button"
                                                    className="quantity__minus p-4 text-gray-700 hover-text-main-600 flex-center"
                                                >
                                                    <i className="ph ph-minus" />
                                                </button>
                                                <input
                                                    type="number"
                                                    className="quantity__input border-0 text-center w-32"
                                                    value={quantity} readOnly
                                                />
                                                <button onClick={incrementQuantity}
                                                    type="button"
                                                    className="quantity__plus p-4 text-gray-700 hover-text-main-600 flex-center"
                                                >
                                                    <i className="ph ph-plus" />
                                                </button>
                                            </div>
                                            <Link
                                                to="#"
                                                className="btn btn-main rounded-pill flex-align d-inline-flex gap-8 px-48"
                                            >
                                                {" "}
                                                <i className="ph ph-shopping-cart" /> Add To Cart
                                            </Link>
                                        </div>
                                        <div className="flex-align gap-12">
                                            <Link
                                                to="#"
                                                className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                                            >
                                                <i className="ph ph-heart" />
                                            </Link>
                                            <Link
                                                to="#"
                                                className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                                            >
                                                <i className="ph ph-shuffle" />
                                            </Link>
                                            <Link
                                                to="#"
                                                className="w-52 h-52 bg-main-50 text-main-600 text-xl hover-bg-main-600 hover-text-white flex-center rounded-circle"
                                            >
                                                <i className="ph ph-share-network" />
                                            </Link>
                                        </div>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <div className="flex-between gap-16 p-12 border border-main-two-600 border-dashed rounded-8 mb-16">
                                        <div className="flex-align gap-12">
                                            <button
                                                type="button"
                                                className="w-18 h-18 flex-center border border-gray-900 text-xs rounded-circle hover-bg-gray-100"
                                            >
                                                <i className="ph ph-plus" />
                                            </button>
                                            <span className="text-gray-900 fw-medium text-xs">
                                                Mfr. coupon. $3.00 off 5
                                            </span>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="text-xs fw-semibold text-main-two-600 text-decoration-underline hover-text-main-two-700"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                    <ul className="list-inside ms-12">
                                        <li className="text-gray-900 text-sm mb-8">
                                            Buy 1, Get 1 FREE
                                        </li>
                                        <li className="text-gray-900 text-sm mb-0">
                                            Buy 1, Get 1 FREE
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="product-details__sidebar border border-gray-100 rounded-16 overflow-hidden">
                            <div className="p-24">
                                <div className="flex-between bg-main-600 rounded-pill p-8">
                                    <div className="flex-align gap-8">
                                        <span className="w-44 h-44 bg-white rounded-circle flex-center text-2xl">
                                            <i className="ph ph-storefront" />
                                        </span>
                                        <span className="text-white">by Valkey</span>
                                    </div>
                                    <Link
                                        to="/shop"
                                        className="btn btn-white rounded-pill text-uppercase"
                                    >
                                        View Store
                                    </Link>
                                </div>
                            </div>
                            <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                                    <i className="ph-fill ph-truck" />
                                </span>
                                <div className="">
                                    <h6 className="text-sm mb-8">Fast Delivery</h6>
                                    <p className="text-gray-700">
                                        Lightning-fast shipping, guaranteed.
                                    </p>
                                </div>
                            </div>
                            <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                                    <i className="ph-fill ph-arrow-u-up-left" />
                                </span>
                                <div className="">
                                    <h6 className="text-sm mb-8">Free 90-day returns</h6>
                                    <p className="text-gray-700">Shop risk-free with easy returns.</p>
                                </div>
                            </div>
                            <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                                    <i className="ph-fill ph-check-circle" />
                                </span>
                                <div className="">
                                    <h6 className="text-sm mb-8">
                                        Pickup available at Shop location
                                    </h6>
                                    <p className="text-gray-700">Usually ready in 24 hours</p>
                                </div>
                            </div>
                            <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                                    <i className="ph-fill ph-credit-card" />
                                </span>
                                <div className="">
                                    <h6 className="text-sm mb-8">Payment</h6>
                                    <p className="text-gray-700">
                                        Payment upon receipt of goods, Payment by card in the
                                        department, Google Pay, Online card.
                                    </p>
                                </div>
                            </div>
                            <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                                    <i className="ph-fill ph-check-circle" />
                                </span>
                                <div className="">
                                    <h6 className="text-sm mb-8">Warranty</h6>
                                    <p className="text-gray-700">
                                        The Consumer Protection Act does not provide for the return of
                                        this product of proper quality.
                                    </p>
                                </div>
                            </div>
                            <div className="p-24 bg-color-one d-flex align-items-start gap-24 border-bottom border-gray-100">
                                <span className="w-44 h-44 bg-white text-main-600 rounded-circle flex-center text-2xl flex-shrink-0">
                                    <i className="ph-fill ph-package" />
                                </span>
                                <div className="">
                                    <h6 className="text-sm mb-8">Packaging</h6>
                                    <p className="text-gray-700">
                                        Research &amp; development value proposition graphical user
                                        interface investor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-80">
                    <div className="product-dContent border rounded-24">
                        <div className="product-dContent__header border-bottom border-gray-100 flex-between flex-wrap gap-16">
                            <ul
                                className="nav common-tab nav-pills mb-3"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link active"
                                        id="pills-description-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-description"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-description"
                                        aria-selected="true"
                                    >
                                        Description
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link"
                                        id="pills-reviews-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-reviews"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-reviews"
                                        aria-selected="false"
                                    >
                                        Reviews
                                    </button>
                                </li>
                            </ul>
                            <Link
                                to="#"
                                className="btn bg-color-one rounded-16 flex-align gap-8 text-main-600 hover-bg-main-600 hover-text-white"
                            >
                                <img src="assets/images/icon/satisfaction-icon.png" alt="" />
                                100% Satisfaction Guaranteed
                            </Link>
                        </div>
                        <div className="product-dContent__box">
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-description"
                                    role="tabpanel"
                                    aria-labelledby="pills-description-tab"
                                    tabIndex={0}
                                >
                                    <div className="mb-40">
                                        <h6 className="mb-24">Product Description</h6>
                                        <p>
                                            Wherever celebrations and good times happen, the LAY'S brand
                                            will be there just as it has been for more than 75 years. With
                                            flavors almost as rich as our history, we have a chip or crisp
                                            flavor guaranteed to bring a smile on your face.{" "}
                                        </p>
                                        <p>
                                            Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat
                                            auctor, eleifend nunc a, lobortis neque. Praesent aliquam
                                            dignissim viverra. Maecenas lacus odio, feugiat eu nunc sit
                                            amet, maximus sagittis dolor. Vivamus nisi sapien, elementum
                                            sit amet eros sit amet, ultricies cursus ipsum. Sed consequat
                                            luctus ligula. Curabitur laoreet rhoncus blandit. Aenean vel
                                            diam ut arcu pharetra dignissim ut sed leo. Vivamus faucibus,
                                            ipsum in vestibulum vulputate, lorem orci convallis quam, sit
                                            amet consequat nulla felis pharetra lacus. Duis semper erat
                                            mauris, sed egestas purus commodo vel.
                                        </p>
                                        <ul className="list-inside mt-32 ms-16">
                                            <li className="text-gray-400 mb-4">
                                                8.0 oz. bag of LAY'S Classic Potato Chips
                                            </li>
                                            <li className="text-gray-400 mb-4">
                                                Tasty LAY's potato chips are a great snack
                                            </li>
                                            <li className="text-gray-400 mb-4">
                                                Includes three ingredients: potatoes, oil, and salt
                                            </li>
                                            <li className="text-gray-400 mb-4">Gluten free product</li>
                                        </ul>
                                        <ul className="mt-32">
                                            <li className="text-gray-400 mb-4">Made in USA</li>
                                            <li className="text-gray-400 mb-4">Ready To Eat.</li>
                                        </ul>
                                    </div>
                                    <div className="mb-40">
                                        <h6 className="mb-24">Product Specifications</h6>
                                        <ul className="mt-32">
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    Product Type:
                                                    <span className="text-gray-500"> Chips &amp; Dips</span>
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    Product Name:
                                                    <span className="text-gray-500">
                                                        {" "}
                                                        Potato Chips Classic{" "}
                                                    </span>
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    Brand:
                                                    <span className="text-gray-500"> Lay's</span>
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    FSA Eligible:
                                                    <span className="text-gray-500"> No</span>
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    Size/Count:
                                                    <span className="text-gray-500"> 8.0oz</span>
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    Item Code:
                                                    <span className="text-gray-500"> 331539</span>
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    Ingredients:
                                                    <span className="text-gray-500">
                                                        {" "}
                                                        Potatoes, Vegetable Oil, and Salt.
                                                    </span>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mb-40">
                                        <h6 className="mb-24">Nutrition Facts</h6>
                                        <ul className="mt-32">
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    {" "}
                                                    Total Fat 10g 13%
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    {" "}
                                                    Saturated Fat 1.5g 7%
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    {" "}
                                                    Cholesterol 0mg 0%
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    {" "}
                                                    Sodium 170mg 7%
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-heading fw-medium">
                                                    {" "}
                                                    Potassium 350mg 6%
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mb-0">
                                        <h6 className="mb-24">More Details</h6>
                                        <ul className="mt-32">
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-gray-500">
                                                    {" "}
                                                    Lunarlon midsole delivers ultra-plush responsiveness
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-gray-500">
                                                    {" "}
                                                    Encapsulated Air-Sole heel unit for lightweight cushioning
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-gray-500">
                                                    {" "}
                                                    Colour Shown: Ale Brown/Black/Goldtone/Ale Brown
                                                </span>
                                            </li>
                                            <li className="text-gray-400 mb-14 flex-align gap-14">
                                                <span className="w-20 h-20 bg-main-50 text-main-600 text-xs flex-center rounded-circle">
                                                    <i className="ph ph-check" />
                                                </span>
                                                <span className="text-gray-500"> Style: 805899-202</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-reviews"
                                    role="tabpanel"
                                    aria-labelledby="pills-reviews-tab"
                                    tabIndex={0}
                                >
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <h6 className="mb-24">Product Description</h6>
                                            <div className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                                                <img
                                                    src="assets/images/thumbs/comment-img1.png"
                                                    alt=""
                                                    className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="flex-between align-items-start gap-8 ">
                                                        <div className="">
                                                            <h6 className="mb-12 text-md">Nicolas cage</h6>
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
                                                        </div>
                                                        <span className="text-gray-800 text-xs">
                                                            3 Days ago
                                                        </span>
                                                    </div>
                                                    <h6 className="mb-14 text-md mt-24">Greate Product</h6>
                                                    <p className="text-gray-700">
                                                        There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in
                                                        some form, by injected humour
                                                    </p>
                                                    <div className="flex-align gap-20 mt-44">
                                                        <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                                                            <i className="ph-bold ph-thumbs-up" />
                                                            Like
                                                        </button>
                                                        <Link
                                                            to="#comment-form"
                                                            className="flex-align gap-12 text-gray-700 hover-text-main-600"
                                                        >
                                                            <i className="ph-bold ph-arrow-bend-up-left" />
                                                            Replay
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-start gap-24">
                                                <img
                                                    src="assets/images/thumbs/comment-img1.png"
                                                    alt=""
                                                    className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="flex-between align-items-start gap-8 ">
                                                        <div className="">
                                                            <h6 className="mb-12 text-md">Nicolas cage</h6>
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
                                                        </div>
                                                        <span className="text-gray-800 text-xs">
                                                            3 Days ago
                                                        </span>
                                                    </div>
                                                    <h6 className="mb-14 text-md mt-24">Greate Product</h6>
                                                    <p className="text-gray-700">
                                                        There are many variations of passages of Lorem Ipsum
                                                        available, but the majority have suffered alteration in
                                                        some form, by injected humour
                                                    </p>
                                                    <div className="flex-align gap-20 mt-44">
                                                        <button className="flex-align gap-12 text-gray-700 hover-text-main-600">
                                                            <i className="ph-bold ph-thumbs-up" />
                                                            Like
                                                        </button>
                                                        <Link
                                                            to="#comment-form"
                                                            className="flex-align gap-12 text-gray-700 hover-text-main-600"
                                                        >
                                                            <i className="ph-bold ph-arrow-bend-up-left" />
                                                            Replay
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-56">
                                                <div className="">
                                                    <h6 className="mb-24">Write a Review</h6>
                                                    <span className="text-heading mb-8">
                                                        What is it like to Product?
                                                    </span>
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
                                                </div>
                                                <div className="mt-32">
                                                    <form action="#">
                                                        <div className="mb-32">
                                                            <label
                                                                htmlFor="title"
                                                                className="text-neutral-600 mb-8"
                                                            >
                                                                Review Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="common-input rounded-8"
                                                                id="title"
                                                                placeholder="Great Products"
                                                            />
                                                        </div>
                                                        <div className="mb-32">
                                                            <label
                                                                htmlFor="desc"
                                                                className="text-neutral-600 mb-8"
                                                            >
                                                                Review Content
                                                            </label>
                                                            <textarea
                                                                className="common-input rounded-8"
                                                                id="desc"
                                                                defaultValue={
                                                                    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
                                                                }
                                                            />
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-main rounded-pill mt-48"
                                                        >
                                                            Submit Review
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="ms-xxl-5">
                                                <h6 className="mb-24">Customers Feedback</h6>
                                                <div className="d-flex flex-wrap gap-44">
                                                    <div className="border border-gray-100 rounded-8 px-40 py-52 flex-center flex-column flex-shrink-0 text-center">
                                                        <h2 className="mb-6 text-main-600">4.8</h2>
                                                        <div className="flex-center gap-8">
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
                                                        <span className="mt-16 text-gray-500">
                                                            Average Product Rating
                                                        </span>
                                                    </div>
                                                    <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">5</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={70}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "70%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">
                                                                124
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">4</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={50}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "50%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">
                                                                52
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">3</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={35}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "35%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">
                                                                12
                                                            </span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-20">
                                                            <span className="text-gray-900 flex-shrink-0">2</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={20}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "20%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">5</span>
                                                        </div>
                                                        <div className="flex-align gap-8 mb-0">
                                                            <span className="text-gray-900 flex-shrink-0">1</span>
                                                            <div
                                                                className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                role="progressbar"
                                                                aria-label="Basic example"
                                                                aria-valuenow={5}
                                                                aria-valuemin={0}
                                                                aria-valuemax={100}
                                                            >
                                                                <div
                                                                    className="progress-bar bg-main-600 rounded-pill"
                                                                    style={{ width: "5%" }}
                                                                />
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                                <span className="text-xs fw-medium text-warning-600 d-flex">
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-900 flex-shrink-0">2</span>
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
            </div>
        </section>

    )
}

export default ProductDetailsOne