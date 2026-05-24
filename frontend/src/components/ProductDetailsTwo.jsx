import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import { getCountdown } from '../helper/Countdown';
import ReviewSummarizer from './AI/ReviewSummarizer';
import { useCart } from '../context/CartContext';
import { productService } from '../services/commerceServices';

const ProductDetailsTwo = () => {
    const { addToCart } = useCart();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get('id') || 'prod_chromebook';

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [timeLeft, setTimeLeft] = useState(getCountdown());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProduct(productId);
                setProduct(data);
                const reviewData = await productService.getProductReviews(productId);
                setReviews(reviewData);
            } catch (err) {
                console.error("Failed to load product details", err);
            }
        };
        fetchProduct();
    }, [productId]);

    const productImages = product?.images && product.images.length > 0 ? product.images : [
        "/assets/images/thumbs/product-details-two-thumb1.png",
        "/assets/images/thumbs/product-details-two-thumb2.png",
        "/assets/images/thumbs/product-details-two-thumb3.png",
        "/assets/images/thumbs/product-details-two-thumb1.png",
        "/assets/images/thumbs/product-details-two-thumb2.png",
    ];

    // increment & decrement
    const [quantity, setQuantity] = useState(1);
    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : quantity);

    // Compute ratings and counts dynamically based on actual Valkey reviews list
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
      : (product?.rating || 0.0);

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.round(r.rating);
      if (starCounts[star] !== undefined) {
        starCounts[star]++;
      }
    });
    const totalReviews = reviews.length || 1;

    const [mainImage, setMainImage] = useState(productImages[0]);

    useEffect(() => {
        if (productImages && productImages.length > 0) {
            setMainImage(productImages[0]);
        }
    }, [product]);

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
                    <div className="col-xl-9">
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
                                    <div className="flex-center mb-24 flex-wrap gap-16 bg-color-one rounded-8 py-16 px-24 position-relative z-1">
                                        <img
                                            src="/assets/images/bg/details-offer-bg.png"
                                            alt=""
                                            className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1"
                                        />
                                        <div className="flex-align gap-16">
                                            <span className="text-white text-sm">Special Offer:</span>
                                        </div>
                                        <div className="countdown" id="countdown11">
                                            <ul className="countdown-list flex-align flex-wrap">
                                                <li className="countdown-list__item text-heading flex-align gap-4 text-xs fw-medium w-28 h-28 rounded-4 border border-main-600 p-0 flex-center">
                                                    {timeLeft.days}<span className="days" />
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
                                        <span className="text-white text-xs">
                                            Remains untill the end of the offer
                                        </span>
                                    </div>
                                    <h5 className="mb-12">
                                        {product?.name || "HP Chromebook With Intel Celeron, 4GB Memory & 64GB eMMC - Modern Gray"}
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
                                                {product?.rating || 4.7} Star Rating
                                            </span>
                                            <span className="text-sm fw-medium text-gray-500">
                                                ({product?.reviews !== undefined ? product.reviews.toLocaleString() : "21,671"})
                                            </span>
                                        </div>
                                        <span className="text-sm fw-medium text-gray-500">|</span>
                                        <span className="text-gray-900">
                                            {" "}
                                            <span className="text-gray-400">SKU:</span>{product?.id ? product.id.slice(0, 6).toUpperCase() : "EB4DRP"}{" "}
                                        </span>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <p className="text-gray-700">
                                        {product?.description || "Geared up and ready to roll: Get the responsive performance you're looking for with an Intel processor and 64 GB eMMC storage. Stay productive with compatible apps like Microsoft Office, Google Workspace, and more. The Chrome OS gives you a fast, simple, and secure online experience with built-in virus protection."}
                                    </p>
                                    <div className="my-32 flex-align gap-16 flex-wrap">
                                        <div className="flex-align gap-8">
                                            <div className="flex-align gap-8 text-main-two-600">
                                                <i className="ph-fill ph-seal-percent text-xl" />
                                                {product?.originalPrice && product?.price ? `-${Math.round((1 - product.price/product.originalPrice) * 100)}%` : "-10%"}
                                            </div>
                                            <h6 className="mb-0">USD {product?.price !== undefined ? product.price.toFixed(2) : "320.99"}</h6>
                                        </div>
                                        <div className="flex-align gap-8">
                                            <span className="text-gray-700">Regular Price</span>
                                            <h6 className="text-xl text-gray-400 mb-0 fw-medium">
                                                USD {product?.originalPrice !== undefined ? product.originalPrice.toFixed(2) : "452.99"}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="my-32 flex-align flex-wrap gap-12">
                                        <Link
                                            to="#"
                                            className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                        >
                                            Monthyly EMI USD 15.00
                                            <i className="ph ph-caret-right" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                        >
                                            Shipping Charge
                                            <i className="ph ph-caret-right" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="px-12 py-8 text-sm rounded-8 flex-align gap-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                        >
                                            Security &amp; Privacy
                                            <i className="ph ph-caret-right" />
                                        </Link>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <div className="mt-32">
                                        <h6 className="mb-16">Quick Overview</h6>
                                        <div className="flex-between align-items-start flex-wrap gap-16">
                                            <div>
                                                <span className="text-gray-900 d-block mb-12">
                                                    Color:
                                                    <span className="fw-medium">Mineral Silver</span>
                                                </span>
                                                <div className="color-list flex-align gap-8">
                                                    <button
                                                        type="button"
                                                        className="color-list__button w-20 h-20 border border-2 border-gray-50 rounded-circle bg-info-600"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="color-list__button w-20 h-20 border border-2 border-gray-50 rounded-circle bg-warning-600"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="color-list__button w-20 h-20 border border-2 border-gray-50 rounded-circle bg-tertiary-600"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="color-list__button w-20 h-20 border border-2 border-gray-50 rounded-circle bg-main-600"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="color-list__button w-20 h-20 border border-2 border-gray-50 rounded-circle bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-900 d-block mb-12">
                                                    Pattern Name:
                                                    <span className="fw-medium">with offer</span>
                                                </span>
                                                <div className="flex-align gap-8 flex-wrap">
                                                    <Link
                                                        to="#"
                                                        className="px-12 py-8 text-sm rounded-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                                    >
                                                        with offer{" "}
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="px-12 py-8 text-sm rounded-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                                    >
                                                        12th Gen Laptop
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="px-12 py-8 text-sm rounded-8 text-gray-900 border border-gray-200 hover-border-main-600 hover-text-main-600"
                                                    >
                                                        without offer
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="mt-32 pt-32 text-gray-700 border-top border-gray-100 d-block" />
                                    <Link
                                        to="/https://www.whatsapp.com"
                                        className="btn btn-black flex-center gap-8 rounded-8 py-16"
                                    >
                                        <i className="ph ph-whatsapp-logo text-lg" />
                                        Request More Information
                                    </Link>
                                    <div className="mt-32">
                                        <span className="fw-medium text-gray-900">
                                            100% Guarantee Safe Checkout
                                        </span>
                                        <div className="mt-10">
                                            <img src="/assets/images/thumbs/gateway-img.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3">
                        <div className="product-details__sidebar py-40 px-32 border border-gray-100 rounded-16">
                            <div className="mb-32">
                                <label
                                    htmlFor="delivery"
                                    className="h6 activePage mb-8 text-heading fw-semibold d-block"
                                >
                                    Delivery
                                </label>
                                <div className="flex-align border border-gray-100 rounded-4 px-16">
                                    <span className="text-xl d-flex text-main-600">
                                        <i className="ph ph-map-pin" />
                                    </span>
                                    <select defaultValue={1}
                                        className="common-input border-0 px-8 rounded-4"
                                        id="delivery"
                                    >
                                        <option value={1}>Maymansign</option>
                                        <option value={1}>Khulna</option>
                                        <option value={1}>Rajshahi</option>
                                        <option value={1}>Rangpur</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-32">
                                <label
                                    htmlFor="stock"
                                    className="text-lg mb-8 text-heading fw-semibold d-block"
                                >
                                    Total Stock: 21
                                </label>
                                <span className="text-xl d-flex">
                                    <i className="ph ph-location" />
                                </span>
                                <div className="d-flex rounded-4 overflow-hidden">
                                    <button onClick={decrementQuantity}
                                        type="button"
                                        className="quantity__minus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                                    >
                                        <i className="ph ph-minus" />
                                    </button>
                                    <input
                                        type="number"
                                        className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-16"
                                        id="stock"
                                        value={
                                            quantity
                                        } readOnly

                                    />
                                    <button onClick={incrementQuantity}
                                        type="button"
                                        className="quantity__plus flex-shrink-0 h-48 w-48 text-neutral-600 bg-gray-50 flex-center hover-bg-main-600 hover-text-white"
                                    >
                                        <i className="ph ph-plus" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-32">
                                <div className="flex-between flex-wrap gap-8 border-bottom border-gray-100 pb-16 mb-16">
                                    <span className="text-gray-500">Price</span>
                                    <h6 className="text-lg mb-0">${(product?.price !== undefined ? product.price * quantity : 320.99 * quantity).toFixed(2)}</h6>
                                </div>
                                <div className="flex-between flex-wrap gap-8">
                                    <span className="text-gray-500">Shipping</span>
                                    <h6 className="text-lg mb-0">From $10.00</h6>
                                </div>
                            </div>
                            <button
                                onClick={() => addToCart(productId, quantity)}
                                className="btn btn-main flex-center gap-8 rounded-8 py-16 fw-normal mt-48 w-100 border-0"
                            >
                                <i className="ph ph-shopping-cart-simple text-lg" />
                                Add To Cart
                            </button>
                            <Link
                                to="/checkout"
                                className="btn btn-outline-main rounded-8 py-16 fw-normal mt-16 w-100"
                            >
                                Buy Now
                            </Link>
                            <div className="mt-32">
                                <div className="px-16 py-8 bg-main-50 rounded-8 flex-between gap-24 mb-14">
                                    <span className="w-32 h-32 bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0">
                                        <i className="ph-fill ph-truck" />
                                    </span>
                                    <span className="text-sm text-neutral-600">
                                        Ship from <span className="fw-semibold">Valkey</span>{" "}
                                    </span>
                                </div>
                                <div className="px-16 py-8 bg-main-50 rounded-8 flex-between gap-24 mb-0">
                                    <span className="w-32 h-32 bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0">
                                        <i className="ph-fill ph-storefront" />
                                    </span>
                                    <span className="text-sm text-neutral-600">
                                        Sold by:{" "}
                                        <span className="fw-semibold">MR Distribution LLC</span>{" "}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-32">
                                <div className="px-32 py-16 rounded-8 border border-gray-100 flex-between gap-8">
                                    <Link to="#" className="d-flex text-main-600 text-28">
                                        <i className="ph-fill ph-chats-teardrop" />
                                    </Link>
                                    <span className="h-26 border border-gray-100" />
                                    <div className="dropdown on-hover-item">
                                        <button className="d-flex text-main-600 text-28" type="button">
                                            <i className="ph-fill ph-share-network" />
                                        </button>
                                        <div className="on-hover-dropdown common-dropdown border-0 inset-inline-start-auto inset-inline-end-0">
                                            <ul className="flex-align gap-16">
                                                <li>
                                                    <Link
                                                        to="/https://www.facebook.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-facebook-logo" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/https://www.twitter.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-twitter-logo" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/https://www.linkedin.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-instagram-logo" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/https://www.pinterest.com"
                                                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                                                    >
                                                        <i className="ph-fill ph-linkedin-logo" />
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
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
                                <img src="/assets/images/icon/satisfaction-icon.png" alt="" />
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
                                    <ReviewSummarizer productId={productId} />
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <h6 className="mb-24">Customer Reviews</h6>
                                            {reviews && reviews.length > 0 ? (
                                                reviews.map((rev, idx) => (
                                                    <div key={idx} className="d-flex align-items-start gap-24 pb-44 border-bottom border-gray-100 mb-44">
                                                        <img
                                                            src={`/assets/images/thumbs/comment-img1.png`}
                                                            alt=""
                                                            className="w-52 h-52 object-fit-cover rounded-circle flex-shrink-0"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <div className="flex-between align-items-start gap-8 ">
                                                                <div className="">
                                                                    <h6 className="mb-12 text-md">{rev.author}</h6>
                                                                    <div className="flex-align gap-8">
                                                                        {Array.from({ length: 5 }).map((_, starIdx) => (
                                                                            <span key={starIdx} className={`text-15 fw-medium d-flex ${starIdx < rev.rating ? 'text-warning-600' : 'text-gray-200'}`}>
                                                                                <i className="ph-fill ph-star" />
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <span className="text-gray-800 text-xs">
                                                                    {rev.date || "3 Days ago"}
                                                                </span>
                                                            </div>
                                                            <h6 className="mb-14 text-md mt-24">{rev.rating >= 4 ? "Great Product" : "Feedback"}</h6>
                                                            <p className="text-gray-700">
                                                                {rev.comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 mb-32">No customer reviews yet. Be the first to write a review!</p>
                                            )}
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
                                                        <h2 className="mb-6 text-main-600">{averageRating}</h2>
                                                        <div className="flex-center gap-8">
                                                            {Array.from({ length: 5 }).map((_, starIdx) => (
                                                                <span key={starIdx} className={`text-15 fw-medium d-flex ${starIdx < Math.round(averageRating) ? 'text-warning-600' : 'text-gray-200'}`}>
                                                                    <i className="ph-fill ph-star" />
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className="mt-16 text-gray-500">
                                                            Average Product Rating
                                                        </span>
                                                    </div>
                                                    <div className="border border-gray-100 rounded-8 px-24 py-40 flex-grow-1">
                                                        {[5, 4, 3, 2, 1].map((stars) => {
                                                            const count = starCounts[stars] || 0;
                                                            const percentage = Math.round((count / totalReviews) * 100);
                                                            return (
                                                                <div key={stars} className="flex-align gap-8 mb-20">
                                                                    <span className="text-gray-900 flex-shrink-0" style={{ width: '12px' }}>{stars}</span>
                                                                    <div
                                                                        className="progress w-100 bg-gray-100 rounded-pill h-8"
                                                                        role="progressbar"
                                                                        aria-valuenow={percentage}
                                                                        aria-valuemin={0}
                                                                        aria-valuemax={100}
                                                                    >
                                                                        <div
                                                                            className="progress-bar bg-main-600 rounded-pill"
                                                                            style={{ width: `${percentage}%` }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-align gap-4" style={{ width: '80px' }}>
                                                                        {Array.from({ length: 5 }).map((_, starIdx) => (
                                                                            <span key={starIdx} className={`text-xs fw-medium d-flex ${starIdx < stars ? 'text-warning-600' : 'text-gray-300'}`}>
                                                                                <i className="ph-fill ph-star" />
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-gray-900 flex-shrink-0" style={{ minWidth: '24px', textAlign: 'right' }}>
                                                                        {count}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
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

export default ProductDetailsTwo