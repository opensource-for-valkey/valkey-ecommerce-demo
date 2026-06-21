import { Link, NavLink } from "react-router-dom";
import { Brain, ChartLineUp, Moon, ShoppingCartSimple, Sparkle, Sun } from "@phosphor-icons/react";
import { useShopMind } from "../../providers/ShopMindProvider";

const links = [
  ["/ai-search", "AI Search", Brain],
  ["/assistant", "Assistant", Sparkle],
  ["/orders", "Orders", ShoppingCartSimple],
  ["/admin", "Admin", ChartLineUp]
];

export default function ShopMindShell({ children }) {
  const { darkMode, setDarkMode } = useShopMind();
  return (
    <div className="shopmind-app">
      <aside className="shopmind-rail" aria-label="ShopMind navigation">
        <Link to="/" className="shopmind-brand" aria-label="ShopMind AI home">
          <span>SM</span>
        </Link>
        <nav>
          {links.map(([href, label, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `shopmind-nav ${isActive ? "is-active" : ""}`}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="shopmind-icon-btn" type="button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </aside>
      <main className="shopmind-main">{children}</main>
    </div>
  );
}
