import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import ShopSection from "../components/ShopSection";
import ShippingTwo from "../components/ShippingTwo";
import FooterTwo from "../components/FooterTwo";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";

const ShopPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search/image?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#0f0f10" />
      <Preloader />
      <HeaderTwo category={true} />

      {/* Prominent search bar — top, centered */}
      <section style={{ padding: "32px 0 0" }}>
        <div className="container container-lg">
          <form
            onSubmit={onSubmit}
            style={{
              maxWidth: 820,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 999,
              padding: "8px 8px 8px 22px",
              boxShadow: "0 12px 32px -18px rgba(15, 15, 16, 0.18)",
            }}
          >
            <i
              className="ph ph-magnifying-glass"
              style={{ fontSize: 20, color: "#6a6a70" }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name, brand, or category…"
              style={{
                flex: 1,
                border: 0,
                outline: 0,
                background: "transparent",
                fontSize: 15,
                padding: "10px 4px",
              }}
            />
            <Link
              to="/search/image"
              title="Search by image"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f3f3f3",
                color: "#0f0f10",
                padding: "10px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <i className="ph ph-camera" />
              Image
            </Link>
            <button
              type="submit"
              style={{
                background: "#0f0f10",
                color: "#fff",
                border: 0,
                padding: "10px 22px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <Breadcrumb title={"Shop"} />
      <ShopSection />
      <ShippingTwo />
      <FooterTwo />
    </>
  );
};

export default ShopPage;
