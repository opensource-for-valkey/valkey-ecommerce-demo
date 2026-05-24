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
import { fullTextSearch, getAds, getTrending, recordAdClick, recordAdImpression, recordProductEvent } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const GrowthPage = () => {
  const { addItem } = useCart();
  const [query, setQuery] = useState("wireless desk");
  const [search, setSearch] = useState({ results: [], facets: { brands: [], categories: [], priceRanges: [] } });
  const [trending, setTrending] = useState([]);
  const [ads, setAds] = useState([]);
  const [message, setMessage] = useState("");

  async function refresh() {
    try {
      const [searchData, trendingData, adsData] = await Promise.all([
        fullTextSearch({ q: query, pageSize: 6 }),
        getTrending({ window: "24h", limit: 6 }),
        getAds({ keywords: query, limit: 3 }),
      ]);
      setSearch(searchData);
      setTrending(trendingData.products || []);
      setAds(adsData.ads || []);
      await Promise.all((adsData.ads || []).map((ad) => recordAdImpression(ad.id).catch(() => undefined)));
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(event) {
    event.preventDefault();
    await refresh();
  }

  async function addProduct(product) {
    await addItem(product);
    await recordProductEvent("add_to_cart", product.id, product.categoryId);
    const data = await getTrending({ window: "24h", limit: 6 });
    setTrending(data.products || []);
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Growth" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-warning rounded-8">{message}</div>}
          <div className="row gy-4">
            <div className="col-xl-8">
              <div className="valkey-demo-panel">
                <span className="text-sm text-main-600 fw-semibold">Challenges 4 and 6</span>
                <h6 className="mb-20 mt-4">Trending and full-text search</h6>
                <form className="d-flex gap-12 flex-wrap mb-24" onSubmit={submit}>
                  <input className="common-input border-gray-100 flex-grow-1" value={query} onChange={(event) => setQuery(event.target.value)} />
                  <button className="btn btn-main py-12 px-20 rounded-8" type="submit">Search</button>
                </form>
                <div className="row gy-4">
                  {(search.results || []).map((result) => (
                    <div className="col-md-6" key={result.id}>
                      <div className="border border-gray-100 rounded-8 p-16 h-100">
                        <div className="valkey-product-media mb-12">
                          <img src={result.image || result.product?.images?.[0]?.url} alt={result.name} />
                        </div>
                        <h6 className="text-lg mb-6">{result.name}</h6>
                        <div className="flex-between gap-8 mb-12">
                          <span className="fw-bold">{currency.format(result.price.amount)}</span>
                          <span className="text-sm text-gray-500">Score {Math.round(result.score)}</span>
                        </div>
                        <button className="btn btn-main py-10 px-14 rounded-8" type="button" onClick={() => void addProduct(result.product)}>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="valkey-demo-panel mb-24">
                <span className="text-sm text-main-600 fw-semibold">Challenge 5</span>
                <h6 className="mb-16 mt-4">Targeted ads</h6>
                {ads.map((ad) => (
                  <button className="d-block w-100 text-start border border-gray-100 rounded-8 p-16 mb-12" type="button" key={ad.id} onClick={() => void recordAdClick(ad.id)}>
                    <div className="valkey-product-media mb-12">
                      <img src={ad.imageUrl} alt={ad.title} />
                    </div>
                    <strong>{ad.title}</strong>
                    <span className="d-block text-sm text-gray-600">Bid {currency.format(ad.bidAmount)}</span>
                  </button>
                ))}
              </div>
              <div className="valkey-demo-panel">
                <h6 className="mb-16">Top trending</h6>
                {trending.map(({ product, score }) => (
                  <div className="flex-between gap-12 border-bottom border-gray-100 py-10" key={product.id}>
                    <span className="text-sm fw-semibold">{product.name}</span>
                    <span className="text-sm text-main-600">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ShippingOne />
      <FooterTwo />
      <BottomFooter />
    </>
  );
};

export default GrowthPage;
