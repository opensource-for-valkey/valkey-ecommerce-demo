import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/commerceServices';

const Checkout = () => {
  const { cart, clearCart, loading } = useCart();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("payment1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.id);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items || cart.items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // Create order via API (in real app, collect form data here)
      // We will create the orderService method now
      // await orderService.createOrder({ paymentMethod: selectedPayment, billingAddress: {} });
      await clearCart();
      alert("Order placed successfully!");
      navigate('/shop');
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="checkout py-80">
        <div className="container container-lg text-center">
          <h4>Loading Checkout...</h4>
        </div>
      </section>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <section className="checkout py-80">
        <div className="container container-lg text-center">
          <h3>Your cart is empty</h3>
          <Link to="/shop" className="btn btn-main mt-24 py-18 px-32 rounded-8">Return to Shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout py-80">
      <div className="container container-lg">
        <div className="border border-gray-100 rounded-8 px-30 py-20 mb-40">
          <span className="">
            Have a coupon?{" "}
            <Link
              to="/cart"
              className="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
            >
              Click here to enter your code
            </Link>{" "}
          </span>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <form action="#" className="pe-xl-5">
              <div className="row gy-3">
                <div className="col-sm-6 col-xs-6">
                  <input type="text" className="common-input border-gray-100" placeholder="First Name" />
                </div>
                <div className="col-sm-6 col-xs-6">
                  <input type="text" className="common-input border-gray-100" placeholder="Last Name" />
                </div>
                <div className="col-12">
                  <input type="text" className="common-input border-gray-100" placeholder="United states (US)" />
                </div>
                <div className="col-12">
                  <input type="text" className="common-input border-gray-100" placeholder="House number and street name" />
                </div>
                <div className="col-12">
                  <input type="text" className="common-input border-gray-100" placeholder="City" />
                </div>
                <div className="col-12">
                  <input type="text" className="common-input border-gray-100" placeholder="Post Code" />
                </div>
                <div className="col-12">
                  <input type="number" className="common-input border-gray-100" placeholder="Phone" />
                </div>
                <div className="col-12">
                  <input type="email" className="common-input border-gray-100" placeholder="Email Address" />
                </div>
              </div>
            </form>
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
                
                {cart.items.map(item => (
                  <div key={item.productId || item.id} className="flex-between gap-24 mb-32">
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
                      ${(item.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-top border-gray-100 pt-30  mt-30">
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Subtotal
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      ${(cart.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Tax
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      ${(cart.tax || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="mb-0 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Total
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      ${(cart.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
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
                      Direct Bank transfer
                    </label>
                  </div>
                  {selectedPayment === 'payment1' && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Make your payment directly into our bank account. Please use your Order ID as the payment reference.
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
                      Cash on delivery
                    </label>
                  </div>
                  {selectedPayment === 'payment3' && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800">
                        Pay with cash upon delivery.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;