import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";

export const ProductSection = ({ title, body, products, loading, compact }) => (
  <section className="vc-section">
    <div className="vc-section__header">
      <div>
        <span className="vc-eyebrow">Storefront</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Link className="vc-link" to="/shop">
        View all <ArrowRight size={16} />
      </Link>
    </div>
    <div className={`vc-product-grid ${compact ? "vc-product-grid--compact" : ""}`}>
      {loading
        ? Array.from({ length: compact ? 4 : 8 }, (_, index) => <ProductSkeleton key={index} />)
        : products.map((product) => (
            <ProductCard product={product} key={product.id} compact={compact} />
          ))}
    </div>
  </section>
);

