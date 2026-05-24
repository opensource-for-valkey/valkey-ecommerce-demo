import React, { useEffect, useState } from "react";
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
import { getPersonalizedRecommendations, getProducts, getRecentlyViewed, getTrendingForYou, recordRecommendationEvent } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const RecommendationsPage = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [recent, setRecent] = useState([]);
  const [trending, setTrending] = useState([]);
  const [message, setMessage] = useState("");

  async function refresh() {
    try {
      const [productData, personalizedData, recentData, trendingData] = await Promise.all([
        getProducts({ limit: 6 }),
        getPersonalizedRecommendations(),
        getRecentlyViewed(),
        getTrendingForYou(),
      ]);
      setProducts(productData.products || []);
      setPersonalized(personalizedData.results || []);
      setRecent(recentData.results || []);
      setTrending(trendingData.results || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function recordView(product) {
    await recordRecommendationEvent({ type: "view", productId: product.id });
    await refresh();
  }

  async function addRecommended(product) {
    await addItem(product);
    await recordRecommendationEvent({ type: "add_to_cart", productId: product.id });
    await refresh();
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Recommendations" />
      <ValkeyChallengeNav />
      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-warning rounded-8">{message}</div>}
          <div className="valkey-demo-panel mb-32">
            <span className="text-sm text-main-600 fw-semibold">Challenge 13</span>
            <h6 className="mb-20 mt-4">Real-time recommendations</h6>
            <div className="row gy-4">
              {products.map((product) => (
                <div className="col-xl-2 col-md-4 col-6" key={product.id}>
                  <button className="d-block w-100 text-start border border-gray-100 rounded-8 p-12" type="button" onClick={() => void recordView(product)}>
                    <div className="valkey-product-media mb-8"><img src={product.images?.[0]?.url} alt={product.name} /></div>
                    <strong className="text-sm">{product.name}</strong>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <RecommendationGrid title="Personalized feed" products={personalized} onAdd={addRecommended} />
          <RecommendationGrid title="Recently viewed" products={recent} onAdd={addRecommended} />
          <RecommendationGrid title="Trending for you" products={trending} onAdd={addRecommended} />
        </div>
      </section>
      <ShippingOne />
      <FooterTwo />
      <BottomFooter />
    </>
  );
};

function RecommendationGrid({ title, products, onAdd }) {
  return (
    <div className="valkey-demo-panel mb-32">
      <h6 className="mb-20">{title}</h6>
      <div className="row gy-4">
        {products.length === 0 && <span className="text-gray-600">Interact with products above to build this Valkey feed.</span>}
        {products.map((product) => (
          <div className="col-xl-3 col-md-6" key={product.id}>
            <div className="border border-gray-100 rounded-8 p-16 h-100">
              <div className="valkey-product-media mb-12"><img src={product.images?.[0]?.url} alt={product.name} /></div>
              <h6 className="text-lg mb-8">{product.name}</h6>
              <div className="flex-between mb-12">
                <span className="fw-bold">{currency.format(product.price.amount)}</span>
                <span className="text-sm text-gray-500">{product.ratings.average}</span>
              </div>
              <button className="btn btn-main py-10 px-14 rounded-8" type="button" onClick={() => void onAdd(product)}>
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationsPage;
