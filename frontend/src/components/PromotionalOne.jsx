import React from 'react'
import { Link } from 'react-router-dom'

const PromotionalOne = () => {
    // Shared flex container style to prevent overlapping and guarantee a clean dynamic layout
    const cardStyle = {
        minHeight: '320px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    };

    return (
        <section className="promotional-banner pt-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Item 1: Everyday Fresh Meat */}
                    <div className="col-xl-3 col-sm-6 col-xs-6">
                        <div 
                            className="promotional-banner-item position-relative rounded-24 overflow-hidden z-1"
                            style={cardStyle}
                        >
                            <img
                                src="/assets/images/thumbs/promotional-banner-img1.png"
                                alt="Fresh Meat"
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div>
                                <h6 className="promotional-banner-item__title text-32" style={{ lineHeight: '1.2', marginBottom: '0' }}>
                                    Everyday Fresh Meat
                                </h6>
                            </div>
                            <div>
                                <Link
                                    to="/shop"
                                    className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8"
                                >
                                    Shop Now
                                    <span className="icon text-xl d-flex">
                                        <i className="ph ph-arrow-right" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Item 2: Daily Fresh Vegetables */}
                    <div className="col-xl-3 col-sm-6 col-xs-6">
                        <div 
                            className="promotional-banner-item position-relative rounded-24 overflow-hidden z-1"
                            style={cardStyle}
                        >
                            <img
                                src="/assets/images/thumbs/promotional-banner-img2.png"
                                alt="Fresh Vegetables"
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div>
                                <h6 className="promotional-banner-item__title text-32" style={{ lineHeight: '1.2', marginBottom: '0' }}>
                                    Daily Fresh Vegetables
                                </h6>
                            </div>
                            <div>
                                <Link
                                    to="/shop"
                                    className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8"
                                >
                                    Shop Now
                                    <span className="icon text-xl d-flex">
                                        <i className="ph ph-arrow-right" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Item 3: Everyday Fresh Milk */}
                    <div className="col-xl-3 col-sm-6 col-xs-6">
                        <div 
                            className="promotional-banner-item position-relative rounded-24 overflow-hidden z-1"
                            style={cardStyle}
                        >
                            <img
                                src="/assets/images/thumbs/promotional-banner-img3.png"
                                alt="Fresh Milk"
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div>
                                <h6 className="promotional-banner-item__title text-32" style={{ lineHeight: '1.2', marginBottom: '0' }}>
                                    Everyday Fresh Milk
                                </h6>
                            </div>
                            <div>
                                <Link
                                    to="/shop"
                                    className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8"
                                >
                                    Shop Now
                                    <span className="icon text-xl d-flex">
                                        <i className="ph ph-arrow-right" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Item 4: Everyday Fresh Fruits */}
                    <div className="col-xl-3 col-sm-6 col-xs-6">
                        <div 
                            className="promotional-banner-item position-relative rounded-24 overflow-hidden z-1"
                            style={cardStyle}
                        >
                            <img
                                src="/assets/images/thumbs/promotional-banner-img4.png"
                                alt="Fresh Fruits"
                                className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover z-n1"
                            />
                            <div>
                                <h6 className="promotional-banner-item__title text-32" style={{ lineHeight: '1.2', marginBottom: '0' }}>
                                    Everyday Fresh Fruits
                                </h6>
                            </div>
                            <div>
                                <Link
                                    to="/shop"
                                    className="btn btn-main d-inline-flex align-items-center rounded-pill gap-8"
                                >
                                    Shop Now
                                    <span className="icon text-xl d-flex">
                                        <i className="ph ph-arrow-right" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalOne;