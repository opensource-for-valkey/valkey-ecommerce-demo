import { Link } from "react-router-dom";
import { Lightning } from "@phosphor-icons/react";
import { BRAND } from "../config/brand";

export const Footer = () => (
  <footer className="vc-footer">
    <div>
      <Link className="vc-brand" to="/">
        <span className="vc-brand__mark">
          <Lightning size={22} weight="fill" />
        </span>
        <span>
          <strong>{BRAND.name}</strong>
          <small>{BRAND.tagline}</small>
        </span>
      </Link>
      <p>
        A production-grade ecommerce demo using Valkey for cache, carts, sessions,
        rate limiting, recommendations, and analytics.
      </p>
    </div>
    <div>
      <strong>Platform</strong>
      <Link to="/shop">Catalog</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/checkout">Checkout</Link>
    </div>
    <div>
      <strong>Operations</strong>
      <Link to="/admin">Admin</Link>
      <Link to="/account">Profile</Link>
      <Link to="/contact">Support</Link>
    </div>
  </footer>
);

