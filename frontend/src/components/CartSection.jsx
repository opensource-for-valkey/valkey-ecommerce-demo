import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CartSection = () => {
    const {
        cartItems,
        cartTotals,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    if (cartItems.length === 0) {
        return (
            <section className="cart py-80">
                <div className="container container-lg text-center">
                    <div className="empty-cart-box border border-gray-100 rounded-16 p-80 bg-white shadow-sm">
                        <div className="icon-box mb-24 d-inline-flex align-items-center justify-content-center bg-gray-50 rounded-circle w-100 h-100 p-24" style={{ maxWidth: '120px', maxHeight: '120px' }}>
                            <i className="ph ph-shopping-cart text-6xl text-gray-300" style={{ fontSize: '64px' }} />
                        </div>
                        <h4 className="mb-16 fw-bold">Your Cart is Empty</h4>
                        <p className="text-gray-500 mb-32" style={{ maxWidth: '480px', margin: '0 auto' }}>
                            Add items to your cart from our shop to see them stored instantly in your Valkey database!
                        </p>
                        <Link to="/shop" className="btn btn-main py-18 px-40 rounded-8 fw-semibold">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="cart py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-xl-9 col-lg-8">
                        <div className="cart-table border border-gray-100 rounded-8 px-40 py-48 bg-white shadow-sm">
                            <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                                <table className="table style-three">
                                    <thead>
                                        <tr>
                                            <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Price</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.productId}>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="remove-tr-btn flex-align gap-12 hover-text-danger-600 border-0 bg-transparent"
                                                    >
                                                        <i className="ph ph-x-circle text-2xl d-flex" />
                                                        Remove
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="table-product d-flex align-items-center gap-24">
                                                        <Link
                                                            to="/shop"
                                                            className="table-product__thumb border border-gray-100 rounded-8 flex-center p-8 bg-gray-50"
                                                        >
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                                            />
                                                        </Link>
                                                        <div className="table-product__content text-start">
                                                            <h6 className="title text-lg fw-semibold mb-8">
                                                                <Link
                                                                    to="/shop"
                                                                    className="link text-line-2"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            </h6>
                                                            <div className="flex-align gap-16 mb-16">
                                                                <div className="flex-align gap-6">
                                                                    <span className="text-md fw-medium text-warning-600 d-flex">
                                                                        <i className="ph-fill ph-star" />
                                                                    </span>
                                                                    <span className="text-md fw-semibold text-gray-900">
                                                                        4.8
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm fw-medium text-gray-200">
                                                                    |
                                                                </span>
                                                                <span className="text-neutral-600 text-sm">
                                                                    Valkey Tracked
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">${parseFloat(item.price).toFixed(2)}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2" style={{ maxWidth: '120px' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                            className="btn border border-gray-200 bg-gray-50 hover-bg-gray-100 flex-center p-0 rounded-circle"
                                                            style={{ width: '32px', height: '32px', fontSize: '16px', fontWeight: 'bold' }}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-8 text-md fw-semibold" style={{ minWidth: '24px', display: 'inline-block', textAlign: 'center' }}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="btn border border-gray-200 bg-gray-50 hover-bg-gray-100 flex-center p-0 rounded-circle"
                                                            style={{ width: '32px', height: '32px', fontSize: '16px', fontWeight: 'bold' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">
                                                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex-between flex-wrap gap-16 mt-32">
                                <div className="flex-align gap-16">
                                    <input
                                        type="text"
                                        className="common-input"
                                        placeholder="Coupon Code"
                                        disabled
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-main py-18 px-32 rounded-8"
                                        disabled
                                    >
                                        Apply Coupon
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="text-lg text-danger-600 hover-text-danger-700 fw-semibold border-0 bg-transparent"
                                >
                                    Clear Valkey Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40 bg-white shadow-sm">
                            <h6 className="text-xl mb-32 fw-bold">Cart Totals</h6>
                            <div className="bg-color-three rounded-8 p-24 bg-gray-50">
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Subtotal</span>
                                    <span className="text-gray-900 fw-semibold">${cartTotals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Estimated Delivery
                                    </span>
                                    <span className="text-success-600 fw-semibold">Free</span>
                                </div>
                                <div className="mb-0 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Estimated Tax (8%)
                                    </span>
                                    <span className="text-gray-900 fw-semibold">${cartTotals.estTax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="bg-color-three rounded-8 p-24 mt-24 bg-gray-50">
                                <div className="flex-between gap-8">
                                    <span className="text-gray-900 text-xl fw-bold">Total</span>
                                    <span className="text-gray-900 text-xl fw-bold">${cartTotals.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-main mt-40 py-18 w-100 rounded-8 fw-semibold"
                            >
                                Proceed to checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartSection