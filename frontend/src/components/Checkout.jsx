import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ValkeyChallengeNav from "./ValkeyChallengeNav";
import { useCart } from "../context/CartContext";
import { authorizePayment, confirmCheckout, getOrders, startCheckout } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const Checkout = () => {
  const { items, totals, coupon, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "Team",
    lastName: "DoD",
    street: "Valkey Hackathon Demo",
    city: "Hyderabad",
    country: "IN",
    postcode: "500081",
    email: "team-dod@example.com",
  });
  const [simulateDecline, setSimulateDecline] = useState(false);
  const [working, setWorking] = useState(false);
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [traceId, setTraceId] = useState("");

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  const checkoutItems = useMemo(
    () => items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    [items]
  );

  function updateAddress(field, value) {
    setShippingAddress((current) => ({ ...current, [field]: value }));
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (items.length === 0) {
      setMessage("Cart is empty. Add products before checkout.");
      return;
    }

    setWorking(true);
    setMessage("");
    setTraceId("");
    try {
      const started = await startCheckout({ items: checkoutItems, shippingAddress });
      setOrder(started.order);
      setTraceId(started.traceId || "");

      const paid = await authorizePayment({
        orderId: started.order.id,
        outcome: simulateDecline ? "decline" : "success",
      });
      setOrder(paid.order);
      setTraceId(paid.traceId || started.traceId || "");

      if (paid.order.status !== "payment_authorized") {
        setMessage("Payment declined. Inventory remains reserved until cancel or reservation expiry.");
        return;
      }

      const confirmed = await confirmCheckout({ orderId: paid.order.id });
      setOrder(confirmed.order);
      setTraceId(confirmed.traceId || paid.traceId || started.traceId || "");
      setMessage("Order confirmed and inventory committed.");
      await clearCart();
      const orderList = await getOrders();
      setOrders(orderList.orders || []);
    } catch (error) {
      setTraceId(error.traceId || "");
      setMessage(error.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <ValkeyChallengeNav />
      <section className="checkout py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-info rounded-8">{message}{traceId ? ` Trace ${traceId}` : ""}</div>}
          <div className="row gy-4">
            <div className="col-xl-8 col-lg-7">
              <form onSubmit={placeOrder} className="border border-gray-100 rounded-8 p-24">
                <div className="flex-between flex-wrap gap-16 mb-24">
                  <div>
                    <span className="text-sm text-main-600 fw-semibold">Challenge 10</span>
                    <h6 className="mb-0 mt-4">Reserve, authorize, confirm</h6>
                  </div>
                  <label className="form-check form-switch d-flex align-items-center gap-8 mb-0">
                    <input className="form-check-input" type="checkbox" checked={simulateDecline} onChange={(event) => setSimulateDecline(event.target.checked)} />
                    <span className="text-sm fw-semibold">Simulate declined payment</span>
                  </label>
                </div>

                <div className="row gy-3">
                  {[
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["street", "Street"],
                    ["city", "City"],
                    ["country", "Country"],
                    ["postcode", "Post Code"],
                    ["email", "Email Address"],
                  ].map(([field, label]) => (
                    <div className={field === "street" || field === "email" ? "col-12" : "col-sm-6"} key={field}>
                      <label className="text-sm fw-semibold mb-8">{label}</label>
                      <input className="common-input border-gray-100" value={shippingAddress[field]} onChange={(event) => updateAddress(field, event.target.value)} />
                    </div>
                  ))}
                </div>

                <button className="btn btn-main mt-32 py-16 px-24 rounded-8 flex-align gap-8" type="submit" disabled={working || items.length === 0}>
                  <i className="ph ph-credit-card" />
                  {working ? "Processing" : "Place Order"}
                </button>
              </form>

              {order && (
                <div className="border border-gray-100 rounded-8 p-24 mt-24">
                  <h6 className="mb-16">Current Order</h6>
                  <div className="row gy-3">
                    <div className="col-md-4">
                      <span className="text-sm text-gray-500 d-block">Order</span>
                      <strong className="text-sm">{order.id}</strong>
                    </div>
                    <div className="col-md-4">
                      <span className="text-sm text-gray-500 d-block">Status</span>
                      <strong>{order.status}</strong>
                    </div>
                    <div className="col-md-4">
                      <span className="text-sm text-gray-500 d-block">Total</span>
                      <strong>{currency.format(order.total)}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-xl-4 col-lg-5">
              <div className="checkout-sidebar">
                <div className="bg-color-three rounded-8 p-24 text-center">
                  <span className="text-gray-900 text-xl fw-semibold">Your Order</span>
                </div>
                <div className="border border-gray-100 rounded-8 px-24 py-32 mt-24">
                  {items.length === 0 ? (
                    <div className="text-center py-24">
                      <span className="d-block text-gray-600 mb-16">No cart items ready for checkout.</span>
                      <Link to="/semantic-search" className="btn btn-main py-12 px-18 rounded-8">
                        Add products
                      </Link>
                    </div>
                  ) : (
                    <>
                      {items.map((item) => (
                        <div className="flex-between gap-24 mb-20" key={item.productId}>
                          <div className="flex-align gap-12">
                            <span className="text-gray-900 fw-normal text-md font-heading-two w-144">{item.product.name}</span>
                            <i className="ph-bold ph-x" />
                            <span className="text-gray-900 fw-semibold text-md font-heading-two">{item.quantity}</span>
                          </div>
                          <span className="text-gray-900 fw-bold text-md font-heading-two">{currency.format(item.product.price.amount * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-top border-gray-100 pt-24 mt-24">
                        <div className="mb-20 flex-between gap-8">
                          <span className="text-gray-900 font-heading-two text-xl fw-semibold">Subtotal</span>
                          <span className="text-gray-900 font-heading-two text-md fw-bold">{currency.format(totals.subtotal)}</span>
                        </div>
                          <div className="mb-20 flex-between gap-8">
                            <span className="text-gray-900 font-heading-two text-xl fw-semibold">Discount</span>
                            <span className="text-gray-900 font-heading-two text-md fw-bold">{currency.format(totals.discount || 0)}</span>
                          </div>
                          {coupon && (
                            <div className="mb-20 flex-between gap-8">
                              <span className="text-gray-900 font-heading-two text-md fw-semibold">Coupon</span>
                              <span className="text-main-600 font-heading-two text-md fw-bold">{coupon.code}</span>
                            </div>
                          )}
                          <div className="mb-0 flex-between gap-8">
                            <span className="text-gray-900 font-heading-two text-xl fw-semibold">Total</span>
                            <span className="text-gray-900 font-heading-two text-md fw-bold">{currency.format(totals.total)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="border border-gray-100 rounded-8 px-24 py-32 mt-24">
                  <h6 className="mb-16">Recent Orders</h6>
                  {orders.length === 0 && <span className="text-gray-500">No orders for this browser user yet.</span>}
                  {orders.slice(0, 4).map((existingOrder) => (
                    <div className="border-bottom border-gray-100 py-12" key={existingOrder.id}>
                      <div className="text-sm fw-semibold text-heading">{existingOrder.status}</div>
                      <div className="text-xs text-gray-600">{existingOrder.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
