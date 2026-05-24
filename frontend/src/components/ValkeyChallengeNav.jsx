import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/account", icon: "ph-user-circle", label: "Auth" },
  { to: "/catalog", icon: "ph-storefront", label: "Catalog" },
  { to: "/growth", icon: "ph-trend-up", label: "Growth" },
  { to: "/semantic-search", icon: "ph-magnifying-glass", label: "Semantic Search" },
  { to: "/cart", icon: "ph-shopping-cart", label: "Cart" },
  { to: "/analytics", icon: "ph-chart-line-up", label: "Analytics" },
  { to: "/observability", icon: "ph-waveform", label: "Observability" },
  { to: "/delivery", icon: "ph-map-pin", label: "Delivery" },
  { to: "/ratelimit", icon: "ph-shield-check", label: "Rate Limit" },
  { to: "/recommendations", icon: "ph-sparkle", label: "Recs" },
  { to: "/agentic-search", icon: "ph-robot", label: "Agent" },
  { to: "/integrations", icon: "ph-plugs-connected", label: "Integrations" },
];

const ValkeyChallengeNav = () => (
  <div className="container container-lg pt-32">
    <div className="d-flex flex-wrap gap-12 align-items-center justify-content-between border border-gray-100 rounded-8 px-20 py-16">
      <div>
        <span className="text-sm text-main-600 fw-semibold">Challenges 1-14</span>
        <h6 className="mb-0 mt-4">Valkey E-Commerce Demo</h6>
      </div>
      <div className="d-flex flex-wrap gap-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `btn py-10 px-16 rounded-8 flex-align gap-8 ${
                isActive ? "btn-main" : "bg-gray-50 text-heading hover-bg-main-600 hover-text-white"
              }`
            }
          >
            <i className={`ph ${link.icon}`} />
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  </div>
);

export default ValkeyChallengeNav;
