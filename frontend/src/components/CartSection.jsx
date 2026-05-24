import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CartSection = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const subtotal = getCartTotal();
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    if (!cart.length) {
        return (
            <section className="cart py-80">
                <div className="container container-lg">
                    <div className="text-center py-64">
                        <i className="ph ph-shopping-cart text-gray-300" style={{ fontSize: '64px' }} />
                        <h6 className="text-lg text-gray-600 mt-24 mb-8">Your cart is empty</h6>
                        <p className="text-gray-500 text-md mb-24">Browse our products and add items to your cart.</p>
                        <Link to="/shop" className="btn btn-main py-12 px-32">
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
                        <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
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
                                        {cart.map((item) => (
                                            <tr key={item.productId}>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                        onClick={() => removeFromCart(item.productId)}
                                                    >
                                                        <i className="ph ph-x-circle text-2xl d-flex" />
                                                        Remove
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="table-product d-flex align-items-center gap-24">
                                                        {item.image && (
                                                            <Link
                                                                to="/product-details"
                                                                className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                                                            >
                                                                <img src={item.image} alt={item.name} />
                                                            </Link>
                                                        )}
                                                        <div className="table-product__content text-start">
                                                            <h6 className="title text-lg fw-semibold mb-8">
                                                                <Link to="/product-details" className="link text-line-2">
                                                                    {item.name}
                                                                </Link>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">${item.price.toFixed(2)}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-8">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-gray w-32 h-32 flex-center rounded-8 p-0"
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-lg fw-semibold w-32 text-center">{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-gray w-32 h-32 flex-center rounded-8 p-0"
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-lg h6 mb-0 fw-semibold">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
                            <h6 className="text-xl mb-32">Cart Totals</h6>
                            <div className="bg-color-three rounded-8 p-24">
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Subtotal</span>
                                    <span className="text-gray-900 fw-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Shipping</span>
                                    <span className="text-gray-900 fw-semibold">
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="mb-0 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Tax (10%)</span>
                                    <span className="text-gray-900 fw-semibold">${tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="bg-color-three rounded-8 p-24 mt-24">
                                <div className="flex-between gap-8">
                                    <span className="text-gray-900 text-xl fw-semibold">Total</span>
                                    <span className="text-gray-900 text-xl fw-semibold">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-main mt-40 py-18 w-100 rounded-8"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartSection
