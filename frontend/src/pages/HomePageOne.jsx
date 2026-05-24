import React, { useState, useEffect } from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BannerOne from "../components/BannerOne";
import FeatureOne from "../components/FeatureOne";
import PromotionalOne from "../components/PromotionalOne";
import FlashSalesOne from "../components/FlashSalesOne";
import ProductListOne from "../components/ProductListOne";
import OfferOne from "../components/OfferOne";
import RecommendedOne from "../components/RecommendedOne";
import HotDealsOne from "../components/HotDealsOne";
import TopVendorsOne from "../components/TopVendorsOne";
import BestSellsOne from "../components/BestSellsOne";
import DeliveryOne from "../components/DeliveryOne";
import OrganicOne from "../components/OrganicOne";
import ShortProductOne from "../components/ShortProductOne";
import BrandOne from "../components/BrandOne";
import NewArrivalOne from "../components/NewArrivalOne";
import ShippingOne from "../components/ShippingOne";
import NewsletterOne from "../components/NewsletterOne";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import { getTrending } from "../services/api";

const HomePageOne = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending();
        setTrendingProducts(data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };
    fetchTrending();
  }, []);

  return (

    <>

      {/* Preloader */}
      <Preloader />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* 🔥 Live Trending Leaderboard */}
      <div className="trending-leaderboard py-24 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container container-lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl fw-bold text-gray-900 mb-8">
              🔥 Live Trending Leaderboard
            </h2>
            <p className="text-gray-600">Top products ranked by popularity</p>
          </div>
          <div className="row justify-content-center">
            {trendingProducts.length > 0 ? (
              trendingProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="col-md-2 col-sm-4 col-6 mb-16">
                  <div className="bg-white rounded-16 p-16 shadow-sm hover-shadow-md transition-2 text-center">
                    <div className="text-4xl fw-bold text-orange-500 mb-8">#{index + 1}</div>
                    <h6 className="text-lg fw-semibold text-gray-900 mb-4 text-line-2">
                      {product.name}
                    </h6>
                    <div className="flex align-center justify-content-center gap-4">
                      <span className="text-orange-600 fw-bold">
                        {product.trendingScore || 0}
                      </span>
                      <span className="text-gray-500 text-sm">views</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-gray-500">Loading trending products...</div>
            )}
          </div>
        </div>
      </div>

      {/* FeatureOne */}
      <FeatureOne />

      {/* PromotionalOne */}
      <PromotionalOne />

      {/* FlashSalesOne */}
      <FlashSalesOne />

      {/* ProductListOne */}
      <ProductListOne />

      {/* OfferOne */}
      <OfferOne />

      {/* RecommendedOne */}
      <RecommendedOne />

      {/* HotDealsOne */}
      <HotDealsOne />

      {/* TopVendorsOne */}
      <TopVendorsOne />

      {/* BestSellsOne */}
      <BestSellsOne />

      {/* DeliveryOne */}
      <DeliveryOne />

      {/* OrganicOne */}
      <OrganicOne />

      {/* ShortProductOne */}
      <ShortProductOne />

      {/* BrandOne */}
      <BrandOne />

      {/* NewArrivalOne */}
      <NewArrivalOne />

      {/* ShippingOne */}
      <ShippingOne />

      {/* NewsletterOne */}
      <NewsletterOne />

      {/* FooterOne */}
      <FooterOne />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default HomePageOne;
