import { useQuery } from "@tanstack/react-query";
import { Activity, ChartLineUp, CurrencyInr, Database, Robot, ShoppingBag } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { shopmindApi } from "../api/shopmindClient";
import ShopMindShell from "../components/shopmind/ShopMindShell";
import { useShopMind } from "../providers/ShopMindProvider";

const cards = [
  ["Revenue", "revenue", CurrencyInr],
  ["Orders", "orders", ShoppingBag],
  ["Searches", "searches", Database],
  ["AI Usage", "aiUsage", Robot],
  ["Conversion", "conversionRate", ChartLineUp]
];

export default function AdminDashboardPage() {
  const { setUser } = useShopMind();
  const [ready, setReady] = useState(Boolean(localStorage.getItem("shopmind_token")));
  useEffect(() => {
    if (!localStorage.getItem("shopmind_token")) {
      shopmindApi.login({ email: "admin@shopmind.ai", password: "ShopMind@123" }).then(({ token, user }) => {
        localStorage.setItem("shopmind_token", token);
        localStorage.setItem("shopmind_user", JSON.stringify(user));
        setUser(user);
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, [setUser]);

  const overview = useQuery({ queryKey: ["admin-overview", ready], queryFn: shopmindApi.adminOverview, retry: false, enabled: ready });
  const insights = useQuery({ queryKey: ["ai-insights"], queryFn: shopmindApi.insights });
  const data = overview.data || { revenue: 0, orders: 0, searches: 0, aiUsage: 0, conversionRate: 0 };

  return (
    <ShopMindShell>
      <section className="sm-section-head">
        <h1>Observability Command Center</h1>
        <p>Revenue, orders, inventory, search, AI usage, conversion, and Valkey workload signals.</p>
      </section>
      <section className="sm-metrics">
        {cards.map(([label, key, Icon]) => (
          <article key={key}>
            <Icon size={24} />
            <span>{label}</span>
            <strong>{key === "revenue" ? `₹${Number(data[key]).toLocaleString("en-IN")}` : key === "conversionRate" ? `${data[key]}%` : data[key]}</strong>
          </article>
        ))}
      </section>
      <section className="sm-admin-grid">
        <article className="sm-panel">
          <h2>
            <Activity size={20} /> AI Analytics
          </h2>
          <p>{insights.data?.summary}</p>
          {insights.data?.insights?.map((item) => (
            <div className="sm-insight" key={item}>{item}</div>
          ))}
        </article>
        <article className="sm-panel">
          <h2>Valkey capabilities demonstrated</h2>
          <div className="sm-chip-cloud">
            {["Search", "JSON", "Vector", "Pub/Sub", "Streams", "Sorted Sets", "GEO", "Caching", "Sessions", "Rate Limiting"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="sm-link-button" href="http://localhost:3001" target="_blank" rel="noreferrer">
            Open Grafana
          </a>
        </article>
      </section>
    </ShopMindShell>
  );
}
