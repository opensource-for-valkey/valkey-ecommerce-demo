import React, { useState } from "react";
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

const HomePageOne = () => {
  // Generate a persistent sessionId on component mount
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(2, 11));

  // Lifted search states to control body content rendering & multi-turn history
  const [searchResults, setSearchResults] = useState(null);
  const [searchMetrics, setSearchMetrics] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Handles session reset (flushes Valkey context history for this specific session)
  const handleResetSession = async () => {
    try {
      await fetch("http://localhost:5005/clear-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
    } catch (err) {
      console.error("Failed to clear session:", err);
    }
    setSearchResults(null);
    setSearchMetrics(null);
    setSearchQuery("");
    setChatHistory([]);
  };

  return (
    <>
      {/* Preloader */}
      <Preloader />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne 
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchMetrics={searchMetrics}
        setSearchMetrics={setSearchMetrics}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        sessionId={sessionId}
      />

      {/* Conditional Rendering: Show premium search results & conversational metrics */}
      {searchResults !== null ? (
        <div className="py-80 bg-neutral-50" style={{ padding: "60px 0", background: "#f8fafc", minHeight: "600px" }}>
          <div className="container container-lg">
            
            {/* Visual Performance Caching Banner */}
            {searchMetrics && (
              <div 
                className="mb-24 p-24 rounded-24 border text-start animate__animated animate__fadeIn"
                style={{
                  marginBottom: '24px',
                  padding: '24px',
                  borderRadius: '20px',
                  background: searchMetrics.source === 'valkey-cache' ? 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)',
                  borderColor: searchMetrics.source === 'valkey-cache' ? '#86efac' : '#fcd34d',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {searchMetrics.source === 'valkey-cache' ? (
                      <span style={{ background: '#16a34a', color: '#fff', padding: '6px 14px', borderRadius: '30px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.05em' }}>
                        ⚡ POWERED BY VALKEY CACHE
                      </span>
                    ) : (
                      <span style={{ background: '#d97706', color: '#fff', padding: '6px 14px', borderRadius: '30px', fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.05em' }}>
                        ❌ UNCACHED DATABASE MISS
                      </span>
                    )}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1f2937' }}>
                      Search Results for "{searchQuery}"
                    </h3>
                  </div>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: searchMetrics.source === 'valkey-cache' ? '#15803d' : '#b45309' }}>
                    Latency: {searchMetrics.responseTime}
                  </span>
                </div>
                
                {searchMetrics.aiIntent && (
                  <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '4px', fontSize: '13px' }}>🤖 AI Intent Extraction:</div>
                    <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
                      {searchMetrics.aiIntent.aiExplanation}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Valkey Search Agent State Board (Active Memory constraints & timeline) */}
            {searchMetrics && searchMetrics.aiIntent && (
              <div 
                className="mb-24 p-24 rounded-24 bg-white border animate__animated animate__fadeIn"
                style={{
                  marginBottom: '24px',
                  padding: '24px',
                  borderRadius: '20px',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  
                  {/* Left Column: Active Search Constraints in Valkey State Memory */}
                  <div style={{ borderRight: window.innerWidth > 768 ? '1px solid #f3f4f6' : 'none', paddingRight: window.innerWidth > 768 ? '24px' : '0' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-cpu" style={{ color: '#299E60', fontSize: '18px' }} /> 
                      Active Agent Memory Constraints (Valkey RAM)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      
                      {/* Category Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="ph ph-tag" /> Active Category
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {searchMetrics.aiIntent.category || 'All Categories'}
                        </span>
                      </div>

                      {/* Search Term Focus Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="ph ph-magnifying-glass" /> Core Search Focus
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', background: '#dbeafe', padding: '4px 12px', borderRadius: '20px' }}>
                          "{searchMetrics.aiIntent.searchTerm}"
                        </span>
                      </div>

                      {/* Price Limit Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="ph ph-currency-inr" /> Price Cap (Max Limit)
                        </span>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          color: searchMetrics.aiIntent.maxPrice ? '#15803d' : '#6b7280', 
                          background: searchMetrics.aiIntent.maxPrice ? '#dcfce7' : '#f1f5f9', 
                          padding: '4px 12px', 
                          borderRadius: '20px' 
                        }}>
                          {searchMetrics.aiIntent.maxPrice ? `₹${searchMetrics.aiIntent.maxPrice.toLocaleString("en-IN")}` : 'No Limit'}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Conversational Refinement Timeline / Steps */}
                  <div style={{ paddingLeft: window.innerWidth > 768 ? '8px' : '0', paddingTop: window.innerWidth > 768 ? '0' : '16px', borderTop: window.innerWidth > 768 ? 'none' : '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="ph ph-git-commit" style={{ color: '#299E60', fontSize: '18px' }} /> 
                      Agentic Query Refinement History
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid #e2e8f0', marginLeft: '10px', minHeight: '60px' }}>
                      
                      {chatHistory && chatHistory.filter(msg => msg.role === 'user').map((msg, index) => (
                        <div key={index} style={{ position: 'relative', textAlign: 'left' }}>
                          {/* Chronological bullet marker */}
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: '-26px', 
                              top: '4px', 
                              width: '10px', 
                              height: '10px', 
                              borderRadius: '50%', 
                              background: '#299E60',
                              border: '2px solid #fff' 
                            }} 
                          />
                          <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                            Step {index + 1}: Refine Search
                          </span>
                          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                            {msg.text}
                          </span>
                        </div>
                      ))}

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Grid Control Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                We found <strong style={{ color: '#1f2937' }}>{searchResults.length} items</strong> matching your search
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleResetSession}
                  style={{
                    border: '1px solid #b91c1c',
                    color: '#b91c1c',
                    background: 'transparent',
                    padding: '8px 20px',
                    borderRadius: '30px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Reset Session Memory
                </button>
                <button 
                  onClick={() => {
                    setSearchResults(null);
                    setSearchMetrics(null);
                    setSearchQuery("");
                  }}
                  style={{
                    border: '1px solid #299E60',
                    color: '#299E60',
                    background: 'transparent',
                    padding: '8px 20px',
                    borderRadius: '30px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Hide Results Grid
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {searchResults.length === 0 ? (
              <div style={{ padding: '60px 0', background: '#fff', borderRadius: '24px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <i className="ph ph-magnifying-glass" style={{ fontSize: '64px', color: '#d1d5db', display: 'block', marginBottom: '16px' }} />
                <h4 style={{ color: '#1f2937', fontWeight: 600, marginBottom: '8px' }}>No results found</h4>
                <p style={{ color: '#6b7280', fontSize: '13px' }}>We couldn't find any products matching your query. Try something else!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                {searchResults.map((product) => (
                  <div 
                    key={product.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #f3f4f6',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.07)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.01)';
                    }}
                  >
                    {/* Image Box */}
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '85%', overflow: 'hidden', background: '#f9fafb' }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <span 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '9px',
                          fontWeight: 700,
                          color: '#4b5563',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          border: '1px solid rgba(0,0,0,0.02)'
                        }}
                      >
                        {product.category}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h4 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#1f2937', 
                          lineHeight: '1.4',
                          margin: '0 0 6px 0',
                          minHeight: '38px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {product.name}
                      </h4>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#eab308', marginBottom: '14px' }}>
                        <i className="ph ph-star-fill" style={{ color: '#eab308' }} />
                        <span style={{ fontWeight: 600, color: '#374151' }}>{product.rating}</span>
                        <span style={{ color: '#9ca3af' }}>({product.reviews} reviews)</span>
                      </div>

                      {/* Pricing Row */}
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#299E60' }}>
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#299E60',
                            color: '#fff',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#1e7546'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#299E60'}
                        >
                          <i className="ph ph-shopping-cart" style={{ fontSize: '15px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Default Amazon E-Commerce Home layouts (only show when search results are NOT active) */}
          <BannerOne />
          <FeatureOne />
          <PromotionalOne />
          <FlashSalesOne />
          <ProductListOne />
          <OfferOne />
          <RecommendedOne />
          <HotDealsOne />
          <TopVendorsOne />
          <BestSellsOne />
          <DeliveryOne />
          <OrganicOne />
          <ShortProductOne />
          <BrandOne />
          <NewArrivalOne />
          <ShippingOne />
          <NewsletterOne />
        </>
      )}

      {/* FooterOne */}
      <FooterOne />

      {/* BottomFooter */}
      <BottomFooter />
    </>
  );
};

export default HomePageOne;
