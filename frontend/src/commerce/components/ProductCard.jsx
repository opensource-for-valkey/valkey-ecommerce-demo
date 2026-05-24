import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingCart } from "@phosphor-icons/react";
import { useCommerce } from "../CommerceContext";
import { ProductImage } from "./ProductImage";
import { QuickView } from "./QuickView";
import { Rating } from "./Rating";
import { discountPercent, money } from "../utils/formatters";

export const ProductCard = ({ product, compact = false }) => {
  const { addToCart, toggleWishlist, wishlist } = useCommerce();
  const saved = wishlist.some((item) => item.id === product.id);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const hoverImage =
    product.hoverImage || product.gallery?.find((image) => image !== product.image);
  const discount = discountPercent(product);

  return (
    <article className={`vc-product-card ${compact ? "vc-product-card--compact" : ""}`}>
      <div className="vc-product-card__media">
        <Link className="vc-product-card__image-link" to={`/product/${product.id}`}>
          <ProductImage
            src={product.image}
            alt={product.name}
            className="vc-product-card__image vc-product-card__image--primary"
          />
          {hoverImage && (
            <ProductImage
              src={hoverImage}
              alt=""
              className="vc-product-card__image vc-product-card__image--secondary"
            />
          )}
        </Link>
        <div className="vc-product-card__badges">
          {discount > 0 && <span className="vc-sale-pill">-{discount}%</span>}
          {product.badges?.slice(0, 2).map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
        <button
          className="vc-icon-button vc-product-card__quick"
          type="button"
          aria-label={`Quick view ${product.name}`}
          title="Quick view"
          onClick={() => setQuickViewOpen(true)}
        >
          <Eye size={19} />
        </button>
      </div>
      <div className="vc-product-card__body">
        <div className="vc-product-card__meta">
          <span>{product.brand}</span>
          <Rating value={product.rating} />
        </div>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p>{product.description}</p>
        <div className="vc-product-card__footer">
          <div>
            <strong>{money(product.price)}</strong>
            {product.originalPrice > product.price && (
              <span>{money(product.originalPrice)}</span>
            )}
          </div>
          <div className="vc-icon-row">
            <button
              className={`vc-icon-button ${saved ? "is-active" : ""}`}
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              title={saved ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={20} weight={saved ? "fill" : "regular"} />
            </button>
            <button
              className="vc-icon-button vc-icon-button--primary"
              type="button"
              aria-label="Add to cart"
              title="Add to cart"
              onClick={() => addToCart(product.id, 1)}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
      {quickViewOpen && <QuickView product={product} onClose={() => setQuickViewOpen(false)} />}
    </article>
  );
};

