import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/ordersAPI';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedPayment, setSelectedPayment] = useState("payment3");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        company: '',
        country: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zip: '',
        phone: user?.phone || '',
        email: user?.email || '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.id);
    };

    const subtotal = getCartTotal();
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    const paymentLabels = {
        payment1: 'Direct Bank Transfer',
        payment2: 'Check Payment',
        payment3: 'Cash on Delivery'
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('Please login to place an order');
            return;
        }

        if (!cart.length) {
            setError('Your cart is empty');
            return;
        }

        if (!formData.street || !formData.city || !formData.firstName) {
            setError('Please fill in the required shipping details');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    street: formData.street,
                    apartment: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                    phone: formData.phone
                },
                paymentMethod: paymentLabels[selectedPayment],
                notes: formData.notes
            };

            await ordersAPI.placeOrder(orderData);
            clearCart();
            navigate('/account?tab=orders');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!cart.length) {
        return (
            <section className="checkout py-80">
                <div className="container container-lg">
                    <div className="text-center py-64">
                        <i className="ph ph-shopping-cart text-gray-300" style={{ fontSize: '64px' }} />
                        <h6 className="text-lg text-gray-600 mt-24 mb-8">Your cart is empty</h6>
                        <p className="text-gray-500 text-md mb-24">Add some products before checking out.</p>
                        <Link to="/shop" className="btn btn-main py-12 px-32">
                            Go to Shop
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout py-80">
            <div className="container container-lg">
                {!user && (
                    <div className="border border-gray-100 rounded-8 px-30 py-20 mb-40">
                        <span>
                            Please{" "}
                            <Link
                                to="/account"
                                className="fw-semibold text-main-600 hover-text-decoration-underline"
                            >
                                login to your account
                            </Link>{" "}
                            to place an order.
                        </span>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger mb-24">{error}</div>
                )}
                <form onSubmit={handlePlaceOrder}>
                    <div className="row">
                        <div className="col-xl-9 col-lg-8">
                            <div className="pe-xl-5">
                                <div className="row gy-3">
                                    <div className="col-sm-6 col-xs-6">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="First Name *"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-6">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="Last Name *"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="Business Name (Optional)"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="Country *"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="House number and street name *"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="Apartment, suite, unit, etc. (Optional)"
                                            name="apartment"
                                            value={formData.apartment}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="City *"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="State / Province"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="common-input border-gray-100"
                                            placeholder="Post Code *"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type="tel"
                                            className="common-input border-gray-100"
                                            placeholder="Phone *"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type="email"
                                            className="common-input border-gray-100"
                                            placeholder="Email Address *"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="my-40">
                                            <h6 className="text-lg mb-24">Additional Information</h6>
                                            <input
                                                type="text"
                                                className="common-input border-gray-100"
                                                placeholder="Notes about your order, e.g. special notes for delivery."
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4">
                            <div className="checkout-sidebar">
                                <div className="bg-color-three rounded-8 p-24 text-center">
                                    <span className="text-gray-900 text-xl fw-semibold">
                                        Your Order
                                    </span>
                                </div>
                                <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                                    <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                                        <span className="text-gray-900 fw-medium text-xl font-heading-two">
                                            Product
                                        </span>
                                        <span className="text-gray-900 fw-medium text-xl font-heading-two">
                                            Subtotal
                                        </span>
                                    </div>
                                    {cart.map((item) => (
                                        <div key={item.productId} className="flex-between gap-24 mb-16">
                                            <div className="flex-align gap-12">
                                                <span className="text-gray-900 fw-normal text-md font-heading-two w-144 text-line-2">
                                                    {item.name}
                                                </span>
                                                <span className="text-gray-900 fw-normal text-md font-heading-two">
                                                    <i className="ph-bold ph-x" />
                                                </span>
                                                <span className="text-gray-900 fw-semibold text-md font-heading-two">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <span className="text-gray-900 fw-bold text-md font-heading-two">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-top border-gray-100 pt-30 mt-30">
                                        <div className="mb-16 flex-between gap-8">
                                            <span className="text-gray-900 font-heading-two text-md">
                                                Subtotal
                                            </span>
                                            <span className="text-gray-900 font-heading-two text-md fw-semibold">
                                                ${subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="mb-16 flex-between gap-8">
                                            <span className="text-gray-900 font-heading-two text-md">
                                                Tax (10%)
                                            </span>
                                            <span className="text-gray-900 font-heading-two text-md fw-semibold">
                                                ${tax.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="mb-16 flex-between gap-8">
                                            <span className="text-gray-900 font-heading-two text-md">
                                                Shipping
                                            </span>
                                            <span className="text-gray-900 font-heading-two text-md fw-semibold">
                                                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="mb-0 flex-between gap-8 pt-16 border-top border-gray-100">
                                            <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                                                Total
                                            </span>
                                            <span className="text-gray-900 font-heading-two text-xl fw-bold">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Payment Methods */}
                                <div className="mt-32">
                                    <div className="payment-item">
                                        <div className="form-check common-check common-radio py-16 mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                id="payment1"
                                                checked={selectedPayment === 'payment1'}
                                                onChange={handlePaymentChange}
                                            />
                                            <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment1">
                                                Direct Bank Transfer
                                            </label>
                                        </div>
                                        {selectedPayment === 'payment1' && (
                                            <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                                <p className="text-gray-800">
                                                    Make your payment directly into our bank account. Your order will be processed once funds are confirmed.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="payment-item">
                                        <div className="form-check common-check common-radio py-16 mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                id="payment2"
                                                checked={selectedPayment === 'payment2'}
                                                onChange={handlePaymentChange}
                                            />
                                            <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment2">
                                                Check Payment
                                            </label>
                                        </div>
                                        {selectedPayment === 'payment2' && (
                                            <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                                <p className="text-gray-800">
                                                    Please send a check to our store. Your order will ship once the check clears.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="payment-item">
                                        <div className="form-check common-check common-radio py-16 mb-0">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="payment"
                                                id="payment3"
                                                checked={selectedPayment === 'payment3'}
                                                onChange={handlePaymentChange}
                                            />
                                            <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment3">
                                                Cash on Delivery
                                            </label>
                                        </div>
                                        {selectedPayment === 'payment3' && (
                                            <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                                                <p className="text-gray-800">
                                                    Pay with cash upon delivery. Please have the exact amount ready.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-32 pt-32 border-top border-gray-100">
                                    <p className="text-gray-500">
                                        Your personal data will be used to process your order, support
                                        your experience throughout this website, and for other purposes
                                        described in our{" "}
                                        <Link to="#" className="text-main-600 text-decoration-underline">
                                            privacy policy
                                        </Link>.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-main mt-40 py-18 w-100 rounded-8"
                                    disabled={loading || !user}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Checkout
