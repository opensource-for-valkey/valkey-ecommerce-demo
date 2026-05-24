import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Minus, Package, Plus, ShieldCheck, ShoppingCart, Truck } from "@phosphor-icons/react";
import { api } from "../api";
import { useCommerce } from "../CommerceContext";
import { ProductImage } from "../components/ProductImage";
import { ProductSection } from "../components/ProductSection";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { Rating } from "../components/Rating";
import { discountPercent, money } from "../utils/formatters";
import { useSeo } from "../useSeo";

export const ProductDetailsPage = ({ fallbackId = "astra-nova-x1-smartphone" }) => {
  const params = useParams();
  const id = params.id || fallbackId;
  const { addToCart, toggleWishlist, wishlist } = useCommerce();
  const [data, setData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState("");

  useSeo(data?.data?.name || "Product Details", data?.data?.description);

  useEffect(() => {
    const load = async () => {
      const response = await api.product(id);
      setData(response);
      setMainImage(response.data.gallery?.[0] || response.data.image);
      setVariantId(response.data.variants?.[0]?.id || "");
    };
    load();
  }, [id]);

  if (!data) {
    return (
      <main className="vc-page">
        <div className="vc-detail-skeleton">
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </main>
    );
  }

  const product = data.data;
  const saved = wishlist.some((item) => item.id === product.id);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const discount = discountPercent(product);

  return (
    <main className="vc-page">
      <section className="vc-product-detail">
        <div className="vc-gallery">
          <div className="vc-gallery__main">
            <ProductImage
              src={mainImage}
              alt={product.name}
              loading="eager"
              fetchPriority="high"
              className="vc-gallery__image"
            />
          </div>
          <div className="vc-gallery__thumbs">
            {gallery.map((image) => (
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

        <div className="vc-detail-copy">
          <span className="vc-eyebrow">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="vc-detail-meta">
            <Rating value={product.rating} count={product.reviewCount} />
            <span>{product.category}</span>
            <span>{product.subcategory}</span>
            <span>SKU {product.sku}</span>
            <span>{product.inventoryStatus.replaceAll("_", " ")}</span>
            {discount > 0 && <span>{discount}% off</span>}
          </div>
          <p>{product.description}</p>
          <div className="vc-price-line">
            <strong>{money(product.price)}</strong>
            {product.originalPrice > product.price && <span>{money(product.originalPrice)}</span>}
          </div>

          <div className="vc-variant-grid" aria-label="Product variants">
            {product.variants.map((variant) => (
              <button
                type="button"
                key={variant.id}
                className={variantId === variant.id ? "is-active" : ""}
                onClick={() => setVariantId(variant.id)}
              >
                {variant.label}
                <small>{variant.stock} left</small>
              </button>
            ))}
          </div>

          <div className="vc-quantity-row">
            <div className="vc-stepper">
              <button type="button" onClick={() => setQuantity(Math.max(quantity - 1, 1))}>
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)}>
                <Plus size={16} />
              </button>
            </div>
            <button
              className="vc-button vc-button--primary"
              type="button"
              onClick={() => addToCart(product.id, quantity, variantId)}
            >
              <ShoppingCart size={18} /> Add to cart
            </button>
            <button
              className={`vc-icon-button ${saved ? "is-active" : ""}`}
              type="button"
              aria-label="Wishlist"
              title="Wishlist"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={21} weight={saved ? "fill" : "regular"} />
            </button>
          </div>

          <div className="vc-assurance-grid">
            <span>
              <Truck size={20} /> Free returns
            </span>
            <span>
              <ShieldCheck size={20} /> Secure checkout
            </span>
            <span>
              <Package size={20} /> Stock tracked live
            </span>
          </div>
        </div>
      </section>

      <section className="vc-detail-panels">
        <article>
          <h2>Specifications</h2>
          <dl>
            {Object.entries(product.specs).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </article>
        <article>
          <h2>Reviews</h2>
          {data.reviews.length ? (
            data.reviews.map((review) => (
              <div className="vc-review" key={review.id}>
                <Rating value={review.rating} />
                <strong>{review.title}</strong>
                <p>{review.body}</p>
                <small>{review.user}</small>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </article>
      </section>

      <ProductSection
        title="Related Products"
        body="Recommendations use category and tag affinity with catalog signals."
        products={data.related}
        loading={false}
        compact
      />
    </main>
  );
};

