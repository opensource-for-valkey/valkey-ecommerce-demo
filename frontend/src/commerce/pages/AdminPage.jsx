import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChartLine, Minus, Package, Plus, ShieldCheck, Star, Storefront } from "@phosphor-icons/react";
import { api } from "../api";
import { useCommerce } from "../CommerceContext";
import { EmptyState } from "../components/EmptyState";
import { ProductImage } from "../components/ProductImage";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { money } from "../utils/formatters";
import { useSeo } from "../useSeo";

export const AdminPage = () => {
  useSeo("Admin Dashboard", "Operational analytics, inventory management, and Valkey signals.");
  const { user, notify } = useCommerce();
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);

  const load = async () => {
    const [analyticsResponse, productResponse] = await Promise.all([
      api.analytics(),
      api.products({ limit: 48 })
    ]);
    setAnalytics(analyticsResponse.data);
    setProducts(productResponse.data || []);
  };

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  const adjust = async (productId, delta) => {
    await api.updateInventory(productId, delta);
    notify("Inventory updated");
    await load();
  };

  if (user?.role !== "admin") {
    return (
      <main className="vc-page vc-page--center">
        <EmptyState
          icon={ShieldCheck}
          title="Admin access required"
          body="Log in with the demo admin account to view operational controls."
          action={<Link className="vc-button vc-button--primary" to="/account">Go to account</Link>}
        />
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="vc-page">
        <div className="vc-kpi-grid">
          {Array.from({ length: 4 }, (_, index) => <ProductSkeleton key={index} />)}
        </div>
      </main>
    );
  }

  return (
    <main className="vc-page">
      <section className="vc-page-heading">
        <div>
          <span className="vc-eyebrow">Admin</span>
          <h1>Operations dashboard</h1>
          <p>Valkey-backed signals and catalog controls for retail operations.</p>
        </div>
      </section>

      <section className="vc-kpi-grid">
        <Kpi icon={Storefront} label="Products" value={analytics.productCount} />
        <Kpi icon={Package} label="Low stock" value={analytics.lowStockCount} />
        <Kpi icon={Star} label="Average rating" value={analytics.averageRating.toFixed(2)} />
        <Kpi icon={ChartLine} label="Revenue signal" value={money(analytics.revenuePotential)} />
      </section>

      <section className="vc-admin-grid">
        <article className="vc-panel">
          <h2>Trending products</h2>
          {analytics.trending.map((product) => (
            <div className="vc-mini-line" key={product.id}>
              <span>{product.name}</span>
              <strong>{product.views?.toLocaleString?.() || product.views}</strong>
            </div>
          ))}
        </article>
        <article className="vc-panel">
          <h2>Category mix</h2>
          {analytics.categoryMix.map((category) => (
            <div className="vc-mini-line" key={category.name}>
              <span>{category.name}</span>
              <strong>{category.count}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="vc-panel">
        <h2>Inventory management</h2>
        <div className="vc-inventory-table">
          {products.map((product) => (
            <div key={product.id}>
              <ProductImage src={product.image} alt="" />
              <span>{product.name}</span>
              <strong>{product.stock}</strong>
              <button className="vc-icon-button" type="button" onClick={() => adjust(product.id, -1)}>
                <Minus size={16} />
              </button>
              <button className="vc-icon-button" type="button" onClick={() => adjust(product.id, 1)}>
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

const Kpi = ({ icon: Icon, label, value }) => (
  <article className="vc-kpi">
    <Icon size={24} />
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
);

