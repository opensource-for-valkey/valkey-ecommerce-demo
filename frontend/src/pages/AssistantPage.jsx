import { useMutation } from "@tanstack/react-query";
import { PaperPlaneTilt, Sparkle } from "@phosphor-icons/react";
import { useState } from "react";
import { shopmindApi } from "../api/shopmindClient";
import ProductInsightCard from "../components/shopmind/ProductInsightCard";
import ShopMindShell from "../components/shopmind/ShopMindShell";
import { useShopMind } from "../providers/ShopMindProvider";

export default function AssistantPage() {
  const { user } = useShopMind();
  const [message, setMessage] = useState("Compare AI laptops for development and suggest the best coupon.");
  const [thread, setThread] = useState([]);
  const chat = useMutation({
    mutationFn: (text) => shopmindApi.aiChat(text, user?.id),
    onSuccess: (data, text) => setThread((items) => [...items, { role: "user", content: text }, { role: "assistant", content: data.message, products: data.products }])
  });

  return (
    <ShopMindShell>
      <section className="sm-chat-layout">
        <div className="sm-chat">
          <header>
            <span className="sm-kicker">
              <Sparkle size={18} /> Persistent AI Assistant
            </span>
            <h1>Shopping copilot</h1>
          </header>
          <div className="sm-thread">
            {thread.length === 0 ? (
              <div className="sm-empty sm-empty--compact">
                <h2>Start with discovery, comparison, cart advice, or order help.</h2>
              </div>
            ) : null}
            {thread.map((item, index) => (
              <article key={`${item.role}-${index}`} className={`sm-message sm-message--${item.role}`}>
                <p>{item.content}</p>
              </article>
            ))}
            {chat.isPending ? <article className="sm-message sm-message--assistant">Typing...</article> : null}
          </div>
          <form
            className="sm-composer"
            onSubmit={(event) => {
              event.preventDefault();
              if (message.trim()) chat.mutate(message);
            }}
          >
            <input value={message} onChange={(event) => setMessage(event.target.value)} aria-label="Message ShopMind assistant" />
            <button type="submit" disabled={chat.isPending} aria-label="Send message">
              <PaperPlaneTilt size={20} />
            </button>
          </form>
        </div>
        <aside className="sm-side-panel">
          <h2>Recommended now</h2>
          {thread
            .flatMap((item) => item.products || [])
            .slice(-3)
            .map((product) => (
              <ProductInsightCard key={product.id} product={product} />
            ))}
        </aside>
      </section>
    </ShopMindShell>
  );
}
