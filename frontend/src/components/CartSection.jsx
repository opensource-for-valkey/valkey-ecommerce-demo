import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../store/auth";
import { useCart } from "../store/cart";
import { formatPrice, productThumbnail } from "../api/format";

const CartSection = () => {
    const navigate = useNavigate();
    const user = useAuth((s) => s.user);
    const ready = useAuth((s) => s.ready);
    const { items, subtotal, currency, loading } = useCart();
    const refresh = useCart((s) => s.refresh);
    const updateItem = useCart((s) => s.updateItem);
    const removeItem = useCart((s) => s.removeItem);
    const clear = useCart((s) => s.clear);

    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        if (user) refresh();
    }, [user, refresh]);

    if (!ready) {
        return (
            <section className="cart py-80">
                <div className="container container-lg text-center text-gray-500">Loading…</div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="cart py-80">
                <div className="container container-lg">
                    <div className="border border-gray-100 rounded-16 px-24 py-40 text-center mx-auto" style={{ maxWidth: 560 }}>
                        <h6 className="text-xl mb-16">Sign in to view your cart</h6>
                        <p className="text-gray-700 mb-32">Your cart and your shopping conversations follow you across devices once you sign in.</p>
                        <Link to="/account" className="btn btn-main py-14 px-32">Sign in or register</Link>
                    </div>
                </div>
            </section>
        );
    }

    const handleQuantityChange = async (productId, nextQty) => {
        if (nextQty < 1) return;
        setBusyId(productId);
        try {
            await updateItem(productId, { quantity: nextQty });
        } finally {
            setBusyId(null);
        }
    };

    const handleRemove = async (productId) => {
        setBusyId(productId);
        try {
            await removeItem(productId);
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className="cart py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-xl-9 col-lg-8">
                        <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
                            {items.length === 0 ? (
                                <div className="py-40 text-center text-gray-500">
                                    Your cart is empty.{" "}
                                    <Link to="/shop" className="text-main-600 fw-semibold">Browse the shop</Link>.
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                                        <table className="table style-three">
                                            <thead>
                                                <tr>
                                                    <th className="h6 mb-0 text-lg fw-bold">Remove</th>
                                                    <th className="h6 mb-0 text-lg fw-bold">Product</th>
                                                    <th className="h6 mb-0 text-lg fw-bold">Price</th>
                                                    <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                                                    <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, idx) => {
                                                    const product = item.product;
                                                    const detailsHref = `/product-details?id=${encodeURIComponent(product.id)}`;
                                                    const isBusy = busyId === product.id || loading;
                                                    return (
                                                        <tr key={product.id}>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemove(product.id)}
                                                                    disabled={isBusy}
                                                                    data-ai-target={`cart-remove:${product.id}`}
                                                                    className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                                >
                                                                    <i className="ph ph-x-circle text-2xl d-flex" />
                                                                    Remove
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <div className="table-product d-flex align-items-center gap-24">
                                                                    <Link
                                                                        to={detailsHref}
                                                                        className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                                                                    >
                                                                        <img src={productThumbnail(product, idx + 1)} alt={product.name} />
                                                                    </Link>
                                                                    <div className="table-product__content text-start">
                                                                        <h6 className="title text-lg fw-semibold mb-8">
                                                                            <Link to={detailsHref} className="link text-line-2">
                                                                                {product.name}
                                                                            </Link>
                                                                        </h6>
                                                                        <div className="flex-align gap-16 mb-8">
                                                                            <div className="flex-align gap-6">
                                                                                <span className="text-md fw-medium text-warning-600 d-flex">
                                                                                    <i className="ph-fill ph-star" />
                                                                                </span>
                                                                                <span className="text-md fw-semibold text-gray-900">
                                                                                    {(product.ratings?.average ?? 0).toFixed(1)}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-sm fw-medium text-gray-200">|</span>
                                                                            <span className="text-neutral-600 text-sm">
                                                                                {product.brand || "Vendor"}
                                                                            </span>
                                                                        </div>
                                                                        {item.status === "draft" && (
                                                                            <span className="text-xs fw-semibold text-warning-600">
                                                                                Draft pick
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="text-lg h6 mb-0 fw-semibold">
                                                                    {formatPrice(product.price?.amount, product.price?.currency)}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="border border-gray-100 rounded-pill py-9 px-16 flex-align d-inline-flex">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleQuantityChange(product.id, item.quantity - 1)}
                                                                        disabled={isBusy || item.quantity <= 1}
                                                                        className="quantity__minus p-4 text-gray-700 hover-text-main-600 flex-center"
                                                                    >
                                                                        <i className="ph ph-minus" />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        readOnly
                                                                        value={item.quantity}
                                                                        className="quantity__input border-0 text-center w-32"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleQuantityChange(product.id, item.quantity + 1)}
                                                                        disabled={isBusy}
                                                                        className="quantity__plus p-4 text-gray-700 hover-text-main-600 flex-center"
                                                                    >
                                                                        <i className="ph ph-plus" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="text-lg h6 mb-0 fw-semibold">
                                                                    {formatPrice(item.lineTotal, currency)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex-between flex-wrap gap-16 mt-16">
                                        <Link to="/shop" className="text-lg text-gray-500 hover-text-main-600">
                                            ← Continue shopping
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => clear()}
                                            className="text-lg text-gray-500 hover-text-danger-600"
                                        >
                                            Clear cart
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
                            <h6 className="text-xl mb-32">Cart Totals</h6>
                            <div className="bg-color-three rounded-8 p-24">
                                <div className="mb-24 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Items</span>
                                    <span className="text-gray-900 fw-semibold">
                                        {items.filter((i) => i.status === "active").reduce((acc, i) => acc + i.quantity, 0)}
                                    </span>
                                </div>
                                <div className="mb-0 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Subtotal</span>
                                    <span className="text-gray-900 fw-semibold">
                                        {formatPrice(subtotal, currency)}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-color-three rounded-8 p-24 mt-24">
                                <div className="flex-between gap-8">
                                    <span className="text-gray-900 text-xl fw-semibold">Total</span>
                                    <span className="text-gray-900 text-xl fw-semibold">
                                        {formatPrice(subtotal, currency)}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={items.length === 0}
                                onClick={() => navigate("/checkout")}
                                className="btn btn-main mt-40 py-18 w-100 rounded-8"
                            >
                                Proceed to checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartSection;
