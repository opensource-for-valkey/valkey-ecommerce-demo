import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingCart, Tag, Trash } from "@phosphor-icons/react";
import { useCommerce } from "../CommerceContext";
import { EmptyState } from "../components/EmptyState";
import { ProductImage } from "../components/ProductImage";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { SummaryRows } from "../components/FormControls";
import { money } from "../utils/formatters";
import { useSeo } from "../useSeo";

export const CartPage = () => {
  useSeo("Cart", "Review cart items and apply coupons.");
  const { cart, updateCartItem, removeCartItem, applyCoupon } = useCommerce();
  const [coupon, setCoupon] = useState("");

  if (!cart) {
    return (
      <main className="vc-page">
        <ProductSkeleton />
      </main>
    );
  }

  if (!cart.items.length) {
    return (
      <main className="vc-page vc-page--center">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is ready when you are"
          body="Add products from the catalog and Valkey will keep the cart available across sessions."
          action={
            <Link className="vc-button vc-button--primary" to="/shop">
              Shop products
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="vc-page">
      <section className="vc-page-heading">
        <div>
          <span className="vc-eyebrow">Cart</span>
          <h1>Review your cart</h1>
        </div>
      </section>
      <section className="vc-cart-layout">
        <div className="vc-cart-items">
          {cart.items.map((item) => (
            <article className="vc-cart-item" key={`${item.product.id}-${item.variant?.id || "default"}`}>
              <ProductImage src={item.product.image} alt={item.product.name} />
              <div>
                <h2>{item.product.name}</h2>
                <p>{item.product.category}{item.variant ? ` / ${item.variant.label}` : ""}</p>
                <strong>{money(item.product.price)}</strong>
              </div>
              <div className="vc-stepper">
                <button
                  type="button"
                  onClick={() => updateCartItem(item.product.id, Math.max(item.quantity - 1, 0), item.variant?.id)}
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateCartItem(item.product.id, item.quantity + 1, item.variant?.id)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <strong>{money(item.lineTotal)}</strong>
              <button
                className="vc-icon-button"
                type="button"
                aria-label="Remove item"
                title="Remove item"
                onClick={() => removeCartItem(item.product.id, item.variant?.id)}
              >
                <Trash size={19} />
              </button>
            </article>
          ))}
        </div>
        <aside className="vc-summary">
          <h2>Order summary</h2>
          <div className="vc-coupon">
            <input
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              placeholder="Coupon code"
            />
            <button
              className="vc-button vc-button--ghost"
              type="button"
              onClick={() => applyCoupon(coupon)}
            >
              Apply
            </button>
          </div>
          {cart.coupon && <p className="vc-success-line"><Tag size={16} /> {cart.coupon.description}</p>}
          <SummaryRows totals={cart.totals} />
          <Link className="vc-button vc-button--primary vc-button--full" to="/checkout">
            Checkout <ArrowRight size={18} />
          </Link>
        </aside>
      </section>
    </main>
  );
};

