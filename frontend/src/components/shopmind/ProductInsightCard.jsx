import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCartSimple, Star } from "@phosphor-icons/react";

export default function ProductInsightCard({ product, score, onAdd }) {
  if (!product) return null;
  return (
    <motion.article className="sm-product" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Link to="/product-details" className="sm-product__image">
        <img src={product.images?.[0]} alt={product.name} />
      </Link>
      <div className="sm-product__body">
        <div className="sm-product__meta">
          <span>{product.brand}</span>
          <span>
            <Star size={14} weight="fill" /> {product.rating}
          </span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.aiDescription || product.description}</p>
        <div className="sm-product__footer">
          <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          {score ? <span>{Math.round(score * 100)}% match</span> : null}
          <button type="button" onClick={() => onAdd?.(product)} aria-label={`Add ${product.name} to cart`}>
            <ShoppingCartSimple size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
