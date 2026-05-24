import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Lightning, List, MagnifyingGlass, ShoppingCart, User, X } from "@phosphor-icons/react";
import { api } from "../api";
import { useCommerce } from "../CommerceContext";
import { BRAND } from "../config/brand";
import { ProductImage } from "../components/ProductImage";

export const Header = () => {
  const { cart, user, wishlist, apiStatus } = useCommerce();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const timeout = window.setTimeout(async () => {
      try {
        const response = await api.suggestions(query);
        setSuggestions(response.data || []);
      } catch (_error) {
        setSuggestions([]);
      }
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setOpen(false);
    setMobileOpen(false);
  };

  const nav = (
    <>
      <NavLink to="/" onClick={() => setMobileOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/shop" onClick={() => setMobileOpen(false)}>
        Shop
      </NavLink>
      <NavLink to="/wishlist" onClick={() => setMobileOpen(false)}>
        Wishlist
      </NavLink>
      <NavLink to="/account" onClick={() => setMobileOpen(false)}>
        Account
      </NavLink>
      {user?.role === "admin" && (
        <NavLink to="/admin" onClick={() => setMobileOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header className="vc-header">
      <div className="vc-header__bar">
        <Link className="vc-brand" to="/">
          <span className="vc-brand__mark">
            <Lightning size={22} weight="fill" />
          </span>
          <span>
            <strong>{BRAND.name}</strong>
            <small>{BRAND.tagline}</small>
          </span>
        </Link>

        <form className="vc-search" onSubmit={submitSearch} role="search">
          <MagnifyingGlass size={19} />
          <input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            placeholder="Search products, categories, brands"
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              className="vc-search__clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
            >
              <X size={16} />
            </button>
          )}
          {open && suggestions.length > 0 && (
            <div className="vc-suggestions">
              {suggestions.map((item) => (
                <Link
                  to={`/product/${item.id}`}
                  key={item.id}
                  onClick={() => setOpen(false)}
                >
                  <ProductImage src={item.image} alt="" />
                  <span>{item.name}</span>
                  <small>{item.category}</small>
                </Link>
              ))}
            </div>
          )}
        </form>

        <nav className="vc-nav">{nav}</nav>

        <div className="vc-header__actions">
          <span className={`vc-status vc-status--${apiStatus}`}>
            {apiStatus === "valkey" ? "Valkey live" : apiStatus}
          </span>
          <Link className="vc-icon-button" to="/wishlist" aria-label="Wishlist" title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </Link>
          <Link className="vc-icon-button" to="/account" aria-label="Account" title="Account">
            <User size={20} />
          </Link>
          <Link className="vc-cart-button" to="/cart">
            <ShoppingCart size={20} />
            <span>{cartCount}</span>
          </Link>
          <button
            className="vc-icon-button vc-mobile-toggle"
            type="button"
            aria-label="Open navigation"
            title="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <List size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="vc-mobile-panel">
          <button
            className="vc-icon-button"
            type="button"
            aria-label="Close navigation"
            title="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
          <nav>{nav}</nav>
        </div>
      )}
    </header>
  );
};

