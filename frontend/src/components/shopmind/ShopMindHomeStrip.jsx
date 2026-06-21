import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Brain, Fire, Sparkle } from "@phosphor-icons/react";
import { shopmindApi } from "../../api/shopmindClient";

export default function ShopMindHomeStrip() {
  const trending = useQuery({ queryKey: ["home-trending"], queryFn: shopmindApi.trending });
  const items = (trending.data || []).slice(0, 4);

  return (
    <section className="shopmind-home-strip">
      <div className="container container-lg">
        <div className="shopmind-home-strip__inner">
          <div>
            <span>
              <Sparkle size={18} /> ShopMind AI
            </span>
            <h2>Next Generation AI Commerce Powered by Valkey</h2>
          </div>
          <div className="shopmind-home-strip__actions">
            <Link to="/ai-search">
              <Brain size={18} /> Ask AI
            </Link>
            <Link to="/admin">
              <Fire size={18} /> Live Dashboard
            </Link>
          </div>
        </div>
        <div className="shopmind-trending-row" aria-label="Trending products">
          {items.length === 0
            ? [1, 2, 3, 4].map((item) => <div className="shopmind-mini-skeleton" key={item} />)
            : items.map(({ product, score }) => (
                <article key={product.id}>
                  <img src={product.images?.[0]} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{Math.round(score)} live signals</span>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
