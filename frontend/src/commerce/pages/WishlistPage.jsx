import { Link } from "react-router-dom";
import { Heart } from "@phosphor-icons/react";
import { useCommerce } from "../CommerceContext";
import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { useSeo } from "../useSeo";

export const WishlistPage = () => {
  useSeo("Wishlist", "Saved products and quick cart actions.");
  const { wishlist } = useCommerce();

  return (
    <main className="vc-page">
      <section className="vc-page-heading">
        <div>
          <span className="vc-eyebrow">Wishlist</span>
          <h1>Saved products</h1>
        </div>
      </section>
      {wishlist.length ? (
        <div className="vc-product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved products yet"
          body="Tap the heart on products to keep them close."
          action={<Link className="vc-button vc-button--primary" to="/shop">Browse products</Link>}
        />
      )}
    </main>
  );
};

