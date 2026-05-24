import React, { useEffect, useMemo, useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import BottomFooter from "../components/BottomFooter";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import HeaderTwo from "../components/HeaderTwo";
import ShippingOne from "../components/ShippingOne";
import ValkeyChallengeNav from "../components/ValkeyChallengeNav";
import { useCart } from "../context/CartContext";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import { getProducts, semanticSearch, similarProducts } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const SemanticSearchPage = () => {
  const { addItem } = useCart();
  const [query, setQuery] = useState("wireless keyboard for typing");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [similar, setSimilar] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products || []))
      .catch((error) => setMessage(error.message));
  }, []);

  const categories = useMemo(() => [...new Set(products.map((product) => product.categoryId))], [products]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    semanticSearch({ query: "wireless keyboard for typing", limit: 8 })
      .then((data) => {
        if (active) setResults(data.results || []);
      })
      .catch((error) => {
        if (active) setMessage(`${error.message}${error.traceId ? ` Trace ${error.traceId}` : ""}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function runSearch(event) {
    event?.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await semanticSearch({ query, categoryId, minPrice, maxPrice, limit: 8 });
      setResults(data.results || []);
    } catch (error) {
      setMessage(`${error.message}${error.traceId ? ` Trace ${error.traceId}` : ""}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadSimilar(productId) {
    try {
      const data = await similarProducts(productId);
      setSimilar((current) => ({ ...current, [productId]: data.results || [] }));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Semantic Search" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          <form onSubmit={runSearch} className="border border-gray-100 rounded-8 p-24 mb-32">
            <div className="row gy-3 align-items-end">
              <div className="col-lg-5">
                <label className="text-sm fw-semibold mb-8">Query</label>
                <input
                  className="common-input border-gray-100"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try audio for music, portable laptop stand, typing keyboard"
                />
              </div>
              <div className="col-lg-3">
                <label className="text-sm fw-semibold mb-8">Category</label>
                <select className="common-input border-gray-100" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-sm-6">
                <label className="text-sm fw-semibold mb-8">Min price</label>
                <input className="common-input border-gray-100" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
              </div>
              <div className="col-lg-2 col-sm-6">
                <label className="text-sm fw-semibold mb-8">Max price</label>
                <input className="common-input border-gray-100" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
              </div>
              <div className="col-12">
                <button className="btn btn-main py-14 px-24 rounded-8 flex-align gap-8" disabled={loading} type="submit">
                  <i className="ph ph-magnifying-glass" />
                  {loading ? "Searching" : "Search"}
                </button>
              </div>
            </div>
          </form>

          {message && <div className="alert alert-warning rounded-8">{message}</div>}

          <div className="row gy-4">
            {results.map(({ product, score }) => (
              <div className="col-xl-3 col-md-6" key={product.id}>
                <div className="border border-gray-100 rounded-8 p-20 h-100">
                  <div className="valkey-product-media mb-16">
                    <img src={product.images?.[0]?.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mechanical_Keyboard.jpg/960px-Mechanical_Keyboard.jpg"} alt={product.name} />
                  </div>
                  <span className="text-xs text-main-600 fw-semibold">Score {Math.round(score * 100)}%</span>
                  <h6 className="text-lg mt-8 mb-8">{product.name}</h6>
                  <p className="text-sm text-gray-600 text-line-2">{product.shortDescription}</p>
                  <div className="flex-between gap-12 mb-16">
                    <span className="fw-bold text-heading">{currency.format(product.price.amount)}</span>
                    <span className="text-sm text-gray-500">{product.inventory.quantity - product.inventory.reserved} available</span>
                  </div>
                  <div className="d-flex gap-8 flex-wrap">
                    <button className="btn btn-main py-10 px-14 rounded-8 flex-align gap-6" onClick={() => addItem(product)} type="button">
                      <i className="ph ph-shopping-cart" />
                      Add
                    </button>
                    <button className="btn bg-gray-50 text-heading py-10 px-14 rounded-8 flex-align gap-6 hover-bg-main-600 hover-text-white" onClick={() => loadSimilar(product.id)} type="button">
                      <i className="ph ph-squares-four" />
                      Similar
                    </button>
                  </div>
                  {similar[product.id]?.length > 0 && (
                    <div className="mt-16 pt-16 border-top border-gray-100">
                      {similar[product.id].map((item) => (
                        <button
                          key={item.product.id}
                          className="d-block w-100 text-start text-sm text-gray-700 hover-text-main-600 mb-8"
                          type="button"
                          onClick={() => addItem(item.product)}
                        >
                          <i className="ph ph-plus-circle me-6" />
                          {item.product.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShippingOne />
      <FooterTwo />
      <BottomFooter />
    </>
  );
};

export default SemanticSearchPage;
