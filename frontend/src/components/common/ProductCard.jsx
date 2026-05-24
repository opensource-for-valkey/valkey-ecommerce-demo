// Shared product card. Two layouts:
//   variant="compact"  — used by the home page rail (ProductListOne).
//   variant="shop"     — used by the /shop grid + list view (ShopSection).
//
// The class names mirror the original theme markup so SCSS continues to apply.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, productThumbnail, ratingLabel } from "../../api/format";
import { useAuth } from "../../store/auth";
import { useCart } from "../../store/cart";

function detailsLink(product) {
  // Pass the product id via query so ProductDetailsPageOne can resolve it.
  return `/product-details?id=${encodeURIComponent(product.id)}`;
}

function StarRow({ rating }) {
  const filled = Math.round(rating?.average ?? 0);
  return (
    <div className="flex-align gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            i <= filled
              ? "text-15 fw-medium text-warning-600 d-flex"
              : "text-15 fw-medium text-gray-400 d-flex"
          }
        >
          <i className="ph-fill ph-star" />
        </span>
      ))}
    </div>
  );
}

function useAddToCart(productId) {
  const navigate = useNavigate();
  const isSignedIn = useAuth((s) => !!s.user);
  const addItem = useCart((s) => s.addItem);
  const [busy, setBusy] = useState(false);

  return {
    busy,
    onClick: async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isSignedIn) {
        navigate("/account");
        return;
      }
      setBusy(true);
      try {
        await addItem(productId, 1);
      } catch (err) {
        // Token could have expired between paint and click — bounce to login.
        if (err.status === 401) navigate("/account");
        else console.error("addItem failed:", err);
      } finally {
        setBusy(false);
      }
    },
  };
}

function CompactCard({ product, index }) {
  const { avg, count } = ratingLabel(product.ratings);
  const { busy, onClick } = useAddToCart(product.id);
  return (
    <div className="col-xxl-2 col-lg-3 col-sm-4 col-6">
      <div
        className="product-card px-8 py-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
        data-ai-target={`product-card:${product.id}`}
      >
        <button
          type="button"
          onClick={onClick}
          disabled={busy}
          data-ai-target={`product-card-add:${product.id}`}
          className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 position-absolute inset-block-start-0 inset-inline-end-0 me-16 mt-16"
        >
          {busy ? "Adding…" : "Add"} <i className="ph ph-shopping-cart" />
        </button>
        <Link to={detailsLink(product)} className="product-card__thumb flex-center">
          <img src={productThumbnail(product, index + 1)} alt={product.name} />
        </Link>
        <div className="product-card__content mt-12">
          <div className="product-card__price mb-16">
            {product.price?.compareAt && (
              <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                {formatPrice(product.price.compareAt, product.price.currency)}
              </span>
            )}
            <span className="text-heading text-md fw-semibold ">
              {formatPrice(product.price?.amount, product.price?.currency)}{" "}
              <span className="text-gray-500 fw-normal">/Qty</span>
            </span>
          </div>
          <div className="flex-align gap-6">
            <span className="text-xs fw-bold text-gray-600">{avg}</span>
            <span className="text-15 fw-bold text-warning-600 d-flex">
              <i className="ph-fill ph-star" />
            </span>
            <span className="text-xs fw-bold text-gray-600">({count})</span>
          </div>
          <h6 className="title text-lg fw-semibold mt-12 mb-8">
            <Link to={detailsLink(product)} className="link text-line-2">
              {product.name}
            </Link>
          </h6>
          <div className="flex-align gap-4">
            <span className="text-main-600 text-md d-flex">
              <i className="ph-fill ph-storefront" />
            </span>
            <span className="text-gray-500 text-xs">By {product.brand || "Vendor"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopCard({ product, index }) {
  const { avg, count } = ratingLabel(product.ratings);
  const { busy, onClick } = useAddToCart(product.id);
  return (
    <div
      className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2"
      data-ai-target={`product-card:${product.id}`}
    >
      <Link
        to={detailsLink(product)}
        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
      >
        <img
          src={productThumbnail(product, index + 1)}
          alt={product.name}
          className="w-auto max-w-unset"
        />
        {product.price?.compareAt && (
          <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
            Sale
          </span>
        )}
      </Link>
      <div className="product-card__content mt-16">
        <h6 className="title text-lg fw-semibold mt-12 mb-8">
          <Link to={detailsLink(product)} className="link text-line-2">
            {product.name}
          </Link>
        </h6>
        <div className="flex-align mb-20 mt-16 gap-6">
          <StarRow rating={product.ratings} />
          <span className="text-xs fw-medium text-gray-500">{avg}</span>
          <span className="text-xs fw-medium text-gray-500">({count})</span>
        </div>
        <div className="product-card__price my-20">
          {product.price?.compareAt && (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
              {formatPrice(product.price.compareAt, product.price.currency)}
            </span>
          )}
          <span className="text-heading text-md fw-semibold ">
            {formatPrice(product.price?.amount, product.price?.currency)}{" "}
            <span className="text-gray-500 fw-normal">/Qty</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={busy}
          data-ai-target={`product-card-add:${product.id}`}
          className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
        >
          {busy ? "Adding…" : "Add To Cart"} <i className="ph ph-shopping-cart" />
        </button>
      </div>
    </div>
  );
}

const ProductCard = ({ product, index = 0, variant = "compact" }) => {
  if (!product) return null;
  return variant === "shop" ? (
    <ShopCard product={product} index={index} />
  ) : (
    <CompactCard product={product} index={index} />
  );
};

export default ProductCard;
