import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, Lightning, MagnifyingGlass, Sparkle } from "@phosphor-icons/react";
import { shopmindApi } from "../api/shopmindClient";
import ProductInsightCard from "../components/shopmind/ProductInsightCard";
import RealtimeDock from "../components/shopmind/RealtimeDock";
import ShopMindShell from "../components/shopmind/ShopMindShell";
import { useShopMind } from "../providers/ShopMindProvider";

const prompts = ["I need a laptop for AI development under ₹80,000", "Suggest marathon gear", "Build a gaming setup under ₹1 lakh"];

export default function AiSearchPage() {
  const { user } = useShopMind();
  const [query, setQuery] = useState(prompts[0]);
  const search = useMutation({ mutationFn: () => shopmindApi.aiSearch(query, user?.id) });

  return (
    <ShopMindShell>
      <section className="sm-hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <span className="sm-kicker">
            <Brain size={18} /> Agentic AI Search
          </span>
          <h1>ShopMind AI</h1>
          <p>Next Generation AI Commerce Powered by Valkey</p>
          <form
            className="sm-searchbox"
            onSubmit={(event) => {
              event.preventDefault();
              search.mutate();
            }}
          >
            <MagnifyingGlass size={22} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Ask ShopMind AI" />
            <button type="submit" disabled={search.isPending}>
              {search.isPending ? "Thinking" : "Ask AI"}
            </button>
          </form>
          <div className="sm-prompt-row">
            {prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => setQuery(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>
        <RealtimeDock />
      </section>

      {search.isPending ? (
        <section className="sm-grid sm-grid--three">
          {[1, 2, 3].map((item) => (
            <div className="sm-skeleton" key={item} />
          ))}
        </section>
      ) : null}

      {search.data ? (
        <>
          <section className="sm-analysis">
            <article>
              <span>
                <Sparkle size={18} /> Intent
              </span>
              <strong>{search.data.intent?.type}</strong>
              <p>{search.data.constraints?.useCase}</p>
            </article>
            <article>
              <span>
                <Lightning size={18} /> Confidence
              </span>
              <strong>{Math.round(search.data.confidence * 100)}%</strong>
              <p>Vector similarity + product search + trend signals</p>
            </article>
            <article className="sm-analysis__wide">
              <span>Reasoning</span>
              <p>{search.data.reasoning}</p>
            </article>
          </section>

          <section className="sm-section-head">
            <h2>Recommendations</h2>
            <p>Semantic discovery, budget constraints, and bundle logic in one Valkey-powered result set.</p>
          </section>
          <section className="sm-grid sm-grid--three">
            {search.data.recommendations?.map((product) => (
              <ProductInsightCard key={product.id} product={product} />
            ))}
          </section>

          <section className="sm-section-head">
            <h2>Suggested Bundles</h2>
          </section>
          {search.data.bundles?.map((bundle) => (
            <article className="sm-bundle" key={bundle.title}>
              <div>
                <h3>{bundle.title}</h3>
                <p>{bundle.rationale}</p>
              </div>
              <strong>₹{bundle.total.toLocaleString("en-IN")}</strong>
            </article>
          ))}
        </>
      ) : (
        <section className="sm-empty">
          <Sparkle size={30} />
          <h2>Ask for a product, purpose, or budget.</h2>
          <p>ShopMind will extract intent, run semantic search, compare products, and explain the result.</p>
        </section>
      )}
    </ShopMindShell>
  );
}
