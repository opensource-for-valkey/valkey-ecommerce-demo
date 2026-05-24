import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMGS = [
  'assets/images/thumbs/product-two-img1.png',
  'assets/images/thumbs/product-two-img2.png',
  'assets/images/thumbs/product-two-img3.png',
  'assets/images/thumbs/product-two-img4.png',
  'assets/images/thumbs/product-two-img5.png',
  'assets/images/thumbs/product-two-img6.png',
];

const formatPrice = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

const CartSection = () => {
  const { cart, loading, updateItem, removeItem, clearCart, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleQtyChange = async (productId, newQty) => {
    if (newQty < 1) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQty);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const { ok, data } = await applyCoupon(couponInput.trim());
    if (!ok) setCouponError(data.message || 'Invalid coupon code');
    else setCouponInput('');
    setCouponLoading(false);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponError('');
  };

  if (loading) {
    return (
      <section className="cart py-80">
        <div className="container container-lg text-center py-80">
          <div className="spinner-border text-main-600" role="status" />
          <p className="mt-16 text-gray-500">Loading cart from Valkey…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">

          {/* Cart table */}
          <div className="col-xl-9 col-lg-8">
            <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
              {cart.items.length === 0 ? (
                <div className="text-center py-40">
                  <i className="ph ph-shopping-cart-simple text-gray-300" style={{ fontSize: 64 }} />
                  <p className="text-gray-500 mt-16 mb-24">Your cart is empty.</p>
                  <Link to="/shop" className="btn btn-main rounded-8">Continue Shopping</Link>
                </div>
              ) : (
                <>
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
                        {cart.items.map((item, idx) => (
                          <tr key={item.productId}>
                            <td>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId)}
                                className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                              >
                                <i className="ph ph-x-circle text-2xl d-flex" />
                                Remove
                              </button>
                            </td>
                            <td>
                              <div className="table-product d-flex align-items-center gap-24">
                                <Link
                                  to="/product-details-two"
                                  className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                                >
                                  <img
                                    src={item.image || PLACEHOLDER_IMGS[idx % PLACEHOLDER_IMGS.length]}
                                    alt={item.name}
                                  />
                                </Link>
                                <div className="table-product__content text-start">
                                  <h6 className="title text-lg fw-semibold mb-8">
                                    <Link to="/product-details-two" className="link text-line-2">
                                      {item.name}
                                    </Link>
                                  </h6>
                                  <span className="text-xs text-gray-500">{item.brand}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-lg h6 mb-0 fw-semibold">{formatPrice(item.price)}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-8">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                                  className="w-32 h-32 flex-center border border-gray-200 rounded-4 hover-bg-main-600 hover-text-white hover-border-main-600 text-lg fw-bold"
                                >
                                  −
                                </button>
                                <span className="text-md fw-semibold" style={{ minWidth: 24, textAlign: 'center' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                                  className="w-32 h-32 flex-center border border-gray-200 rounded-4 hover-bg-main-600 hover-text-white hover-border-main-600 text-lg fw-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <span className="text-lg h6 mb-0 fw-semibold">{formatPrice(item.subtotal)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Coupon + Clear */}
                  <div className="flex-between flex-wrap gap-16 mt-16">
                    {cart.coupon ? (
                      <div className="flex-align gap-16">
                        <span className="text-main-600 text-sm fw-medium">
                          <i className="ph ph-tag me-4" />
                          {cart.coupon.code}: −{formatPrice(cart.coupon.discount)}
                        </span>
                        <span className="text-xs text-gray-500">{cart.coupon.description}</span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-danger-600 text-xs hover-text-danger-700 bg-transparent border-0 p-0"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex-align gap-16 flex-wrap">
                        <div>
                          <input
                            type="text"
                            className={`common-input${couponError ? ' border border-danger-600' : ''}`}
                            placeholder="Coupon Code"
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                          />
                          {couponError && (
                            <p className="text-danger-600 text-xs mt-4 mb-0">{couponError}</p>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={couponLoading}
                          className="btn btn-main py-18 rounded-8"
                        >
                          {couponLoading ? 'Applying…' : 'Apply Coupon'}
                        </button>
                      </form>
                    )}
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-lg text-gray-500 hover-text-danger-600 bg-transparent border-0 p-0"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="col-xl-3 col-lg-4">
            <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
              <h6 className="text-xl mb-32">Cart Totals</h6>
              <div className="bg-color-three rounded-8 p-24">
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Subtotal</span>
                  <span className="text-gray-900 fw-semibold">{formatPrice(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-main-600 font-heading-two">Discount</span>
                    <span className="text-main-600 fw-semibold">−{formatPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="mb-0 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Delivery</span>
                  <span className="text-gray-900 fw-semibold">Free</span>
                </div>
              </div>
              <div className="bg-color-three rounded-8 p-24 mt-24">
                <div className="flex-between gap-8">
                  <span className="text-gray-900 text-xl fw-semibold">Total</span>
                  <span className="text-heading text-xl fw-semibold">{formatPrice(cart.total)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn btn-main mt-40 py-18 w-100 rounded-8">
                Proceed to checkout
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CartSection;
