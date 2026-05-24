import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingCart, X } from "@phosphor-icons/react";
import { useCommerce } from "../CommerceContext";
import { ProductImage } from "./ProductImage";
import { Rating } from "./Rating";
import { discountPercent, money } from "../utils/formatters";

export const QuickView = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, wishlist } = useCommerce();
  const saved = wishlist.some((item) => item.id === product.id);
  const [mainImage, setMainImage] = useState(product.gallery?.[0] || product.image);
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id || "");
  const discount = discountPercent(product);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="vc-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="vc-quick-view"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="vc-icon-button vc-modal-close"
          type="button"
          aria-label="Close quick view"
          title="Close quick view"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="vc-quick-view__gallery">
          <ProductImage src={mainImage} alt={product.name} loading="eager" />
          <div>
            {product.gallery?.map((image) => (
              <button
                type="button"
                key={image}
                className={mainImage === image ? "is-active" : ""}
                onClick={() => setMainImage(image)}
              >
                <ProductImage src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="vc-quick-view__copy">
          <span className="vc-eyebrow">{product.brand}</span>
          <h2>{product.name}</h2>
          <div className="vc-detail-meta">
            <Rating value={product.rating} count={product.reviewCount} />
            <span>{product.subcategory}</span>
            {discount > 0 && <span>{discount}% off</span>}
          </div>
          <p>{product.description}</p>
          <div className="vc-price-line">
            <strong>{money(product.price)}</strong>
            {product.originalPrice > product.price && <span>{money(product.originalPrice)}</span>}
          </div>
          <div className="vc-variant-grid">
            {product.variants?.map((variant) => (
              <button
                type="button"
                key={variant.id}
                className={variantId === variant.id ? "is-active" : ""}
                onClick={() => setVariantId(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </div>
          <div className="vc-quick-view__actions">
            <button
              className="vc-button vc-button--primary"
              type="button"
              onClick={() => addToCart(product.id, 1, variantId)}
            >
              <ShoppingCart size={18} /> Add to cart
            </button>
            <button
              className={`vc-icon-button ${saved ? "is-active" : ""}`}
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              title={saved ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={20} weight={saved ? "fill" : "regular"} />
            </button>
            <Link className="vc-button vc-button--ghost" to={`/product/${product.id}`} onClick={onClose}>
              Details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

