import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantityControl from '../helper/QuantityControl';
import api from '../services/api';
import { Sparkles } from 'lucide-react';

const CartSection = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const [coupon, setCoupon] = useState('');
  const [insights, setInsights] = useState([]);

  React.useEffect(() => {
    if (cart?.items?.length > 0) {
      const fetchInsights = async () => {
        try {
           const res = await api.get('/ai/cart-insights');
           setInsights(res.data.insights || []);
        } catch(e) {
           console.error("Failed to load cart insights", e);
        }
      }
      fetchInsights();
    }
  }, [cart?.items?.length]);

  if (loading) {
    return (
      <section className="cart py-80">
        <div className="container container-lg text-center">
          <h4>Loading Cart...</h4>
        </div>
      </section>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <section className="cart py-80">
        <div className="container container-lg text-center">
          <div className="py-40">
            <h3>Your cart is empty</h3>
            <Link to="/shop" className="btn btn-main mt-24 py-18 px-32 rounded-8">
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
              {insights.length > 0 && (
                <div className="mb-24 p-16 rounded-8 bg-warning-50 border border-warning-200 d-flex flex-column gap-8">
                  <div className="flex-align gap-8 text-warning-600 fw-bold">
                    <Sparkles size={18} /> AI Smart Cart Insights
                  </div>
                  {insights.map((insight, idx) => (
                    <div key={idx} className="text-warning-800 text-sm" style={{ lineHeight: 1.5 }}>
                      • {insight}
                    </div>
                  ))}
                </div>
              )}
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
                    {cart.items.map((item) => (
                      <tr key={item.productId || item.id}>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId || item.id)}
                            className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                          >
                            <i className="ph ph-x-circle text-2xl d-flex" />
                            Remove
                          </button>
                        </td>
                        <td>
                          <div className="table-product d-flex align-items-center gap-24">
                            <Link
                              to={`/product-details-two?id=${item.productId || item.id}`}
                              className="table-product__thumb border border-gray-100 rounded-8 flex-center "
                            >
                              <img
                                src={item.images && item.images[0] ? item.images[0] : "/assets/images/thumbs/product-two-img1.png"}
                                alt={item.name}
                                style={{ width: '80px', height: 'auto' }}
                              />
                            </Link>
                            <div className="table-product__content text-start">
                              <h6 className="title text-lg fw-semibold mb-8">
                                <Link
                                  to={`/product-details-two?id=${item.productId || item.id}`}
                                  className="link text-line-2"
                                  tabIndex={0}
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
                                    {item.rating || 0}
                                  </span>
                                </div>
                                <span className="text-sm fw-medium text-gray-200">|</span>
                                <span className="text-neutral-600 text-sm">
                                  {item.reviews || 0} Reviews
                                </span>
                              </div>
                              {item.category && (
                                <div className="flex-align gap-16">
                                  <Link
                                    to={`/shop?category=${item.category}`}
                                    className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium"
                                  >
                                    <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-lg h6 mb-0 fw-semibold">${(item.price || 0).toFixed(2)}</span>
                        </td>
                        <td>
                          <QuantityControl 
                            initialQuantity={item.quantity} 
                            onChange={(newQty) => updateQuantity(item.productId || item.id, newQty)}
                          />
                        </td>
                        <td>
                          <span className="text-lg h6 mb-0 fw-semibold">${(item.subtotal || 0).toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex-between flex-wrap gap-16 mt-16">
                <div className="flex-align gap-16">
                  <input
                    type="text"
                    className="common-input"
                    placeholder="Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => alert('Coupon functionality to be implemented')}
                    className="btn btn-main py-18 px-32 rounded-8"
                  >
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
              <h6 className="text-xl mb-32">Cart Totals</h6>
              <div className="bg-color-three rounded-8 p-24">
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Subtotal</span>
                  <span className="text-gray-900 fw-semibold">${(cart.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="mb-32 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Estimated Delivery</span>
                  <span className="text-gray-900 fw-semibold">${(cart.delivery || 0).toFixed(2)}</span>
                </div>
                <div className="mb-0 flex-between gap-8">
                  <span className="text-gray-900 font-heading-two">Estimated Taxes</span>
                  <span className="text-gray-900 fw-semibold">${(cart.tax || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-color-three rounded-8 p-24 mt-24">
                <div className="flex-between gap-8">
                  <span className="text-gray-900 text-xl fw-semibold">Total</span>
                  <span className="text-gray-900 text-xl fw-semibold">${(cart.total || 0).toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="btn btn-main mt-40 py-18 w-100 rounded-8"
              >
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