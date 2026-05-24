import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const isWished = isInWishlist(product.id);
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/assets/images/thumbs/product-two-img1.png';
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  return (
    <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <div className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
        <Link
          to={`/product-details-two?id=${product.id}`}
        >
          <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
            {product.status && product.status.length > 0 ? product.status[0] : ''}
          </span>
          <img
            src={mainImage}
            alt={product.name}
            className="w-auto max-w-unset"
          />
        </Link>
        <button
          onClick={handleToggleWishlist}
          className={`position-absolute inset-inline-end-0 inset-block-start-0 mt-8 me-8 w-32 h-32 flex-center rounded-circle border border-gray-100 bg-white hover-bg-main-600 hover-text-white transition-2 ${isWished ? 'bg-main-600 text-white' : 'text-gray-500'}`}
          style={{ zIndex: 10 }}
        >
          <i className={isWished ? 'ph-fill ph-heart' : 'ph ph-heart'} />
        </button>
      </div>
      <div className="product-card__content mt-16">
        <h6 className="title text-lg fw-semibold mt-12 mb-8">
          <Link
            to={`/product-details-two?id=${product.id}`}
            className="link text-line-2"
            tabIndex={0}
          >
            {product.name}
          </Link>
        </h6>
        <div className="flex-align mb-20 mt-16 gap-6">
          <span className="text-xs fw-medium text-gray-500">{product.rating || 0}</span>
          <span className="text-15 fw-medium text-warning-600 d-flex">
            <i className="ph-fill ph-star" />
          </span>
          <span className="text-xs fw-medium text-gray-500">({product.reviews || 0})</span>
        </div>
        {product.stock !== undefined && (
          <div className="mt-8">
            <div
              className="progress w-100 bg-color-three rounded-pill h-4"
              role="progressbar"
              aria-label="Basic example"
              aria-valuenow={(product.sold / (product.sold + product.stock)) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar bg-main-two-600 rounded-pill"
                style={{ width: `${(product.sold / (product.sold + product.stock)) * 100}%` }}
              />
            </div>
            <span className="text-gray-900 text-xs fw-medium mt-8">
              Sold: {product.sold}/{product.stock + product.sold}
            </span>
          </div>
        )}
        <div className="product-card__price my-20">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-heading text-md fw-semibold ">
            ${product.price ? product.price.toFixed(2) : '0.00'}{" "}
            <span className="text-gray-500 fw-normal">/Qty</span>{" "}
          </span>
        </div>
        <Link
          to="/cart"
          onClick={handleAddToCart}
          className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
          tabIndex={0}
        >
          Add To Cart <i className="ph ph-shopping-cart" />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
