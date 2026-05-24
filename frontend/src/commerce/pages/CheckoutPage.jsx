import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, CreditCard, Receipt, ShoppingCart } from "@phosphor-icons/react";
import { useCommerce } from "../CommerceContext";
import { EmptyState } from "../components/EmptyState";
import { Input, SummaryRows } from "../components/FormControls";
import { money, statusLabel } from "../utils/formatters";
import { useSeo } from "../useSeo";

export const CheckoutPage = () => {
  useSeo("Checkout", "Complete a multi-step checkout with payment placeholder.");
  const { cart, checkout } = useCommerce();
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    paymentProvider: "stripe-placeholder"
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const placeOrder = async () => {
    const next = await checkout({
      paymentProvider: form.paymentProvider,
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone
      },
      shippingAddress: {
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country
      }
    });
    setOrder(next);
  };

  if (order) {
    return (
      <main className="vc-page vc-page--center">
        <EmptyState
          icon={CheckCircle}
          title="Order placed"
          body={`Invoice ${order.invoice.number} is ready. Your order is now ${statusLabel(order.status)}.`}
          action={
            <Link className="vc-button vc-button--primary" to="/account">
              View account
            </Link>
          }
        />
      </main>
    );
  }

  if (!cart?.items?.length) {
    return (
      <main className="vc-page vc-page--center">
        <EmptyState
          icon={ShoppingCart}
          title="Checkout needs a cart"
          body="Add a product first, then come back to complete the order."
          action={<Link className="vc-button vc-button--primary" to="/shop">Shop products</Link>}
        />
      </main>
    );
  }

  return (
    <main className="vc-page">
      <section className="vc-page-heading">
        <div>
          <span className="vc-eyebrow">Checkout</span>
          <h1>Complete your order</h1>
        </div>
      </section>
      <section className="vc-checkout-layout">
        <div className="vc-checkout-main">
          <div className="vc-steps">
            {["Customer", "Delivery", "Payment"].map((label, index) => (
              <button
                type="button"
                key={label}
                className={step === index + 1 ? "is-active" : ""}
                onClick={() => setStep(index + 1)}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="vc-form-grid">
              <Input label="Full name" value={form.name} onChange={(value) => update("name", value)} />
              <Input label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
              <Input label="Phone" value={form.phone} onChange={(value) => update("phone", value)} />
            </div>
          )}
          {step === 2 && (
            <div className="vc-form-grid">
              <Input label="Address line 1" value={form.line1} onChange={(value) => update("line1", value)} />
              <Input label="Address line 2" value={form.line2} onChange={(value) => update("line2", value)} />
              <Input label="City" value={form.city} onChange={(value) => update("city", value)} />
              <Input label="State" value={form.state} onChange={(value) => update("state", value)} />
              <Input label="Postal code" value={form.postalCode} onChange={(value) => update("postalCode", value)} />
              <Input label="Country" value={form.country} onChange={(value) => update("country", value)} />
            </div>
          )}
          {step === 3 && (
            <div className="vc-payment-options">
              {[
                ["stripe-placeholder", CreditCard, "Card authorization placeholder"],
                ["manual-placeholder", Receipt, "Manual invoice placeholder"]
              ].map(([value, Icon, label]) => (
                <label className={form.paymentProvider === value ? "is-active" : ""} key={value}>
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={form.paymentProvider === value}
                    onChange={(event) => update("paymentProvider", event.target.value)}
                  />
                  <Icon size={24} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}

          <div className="vc-form-actions">
            <button
              className="vc-button vc-button--ghost"
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
            {step < 3 ? (
              <button className="vc-button vc-button--primary" type="button" onClick={() => setStep(step + 1)}>
                Continue
              </button>
            ) : (
              <button className="vc-button vc-button--primary" type="button" onClick={placeOrder}>
                Place order
              </button>
            )}
          </div>
        </div>
        <aside className="vc-summary">
          <h2>Your order</h2>
          {cart.items.map((item) => (
            <div className="vc-mini-line" key={item.product.id}>
              <span>{item.product.name} x {item.quantity}</span>
              <strong>{money(item.lineTotal)}</strong>
            </div>
          ))}
          <SummaryRows totals={cart.totals} />
        </aside>
      </section>
    </main>
  );
};

