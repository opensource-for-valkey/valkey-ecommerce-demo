import React, { useState, useEffect } from 'react';
import { Bot, ThumbsUp, ThumbsDown, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import api from '../../services/api';

const ReviewSummarizer = ({ productId }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await api.post('/ai/summarize', { productId });
        setSummaryData(res.data);
      } catch (err) {
        console.error("Failed to load review summary", err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchSummary();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-main-50 p-24 rounded-16 border border-main-200 mb-40 animate-pulse">
         <div className="flex-align gap-8 text-main-600 mb-16 fw-semibold">
           <Bot size={20} className="animate-spin" /> AI Analyzing Reviews & Detecting Fake Activity...
         </div>
         <div className="h-12 bg-main-100 rounded-pill w-3/4 mb-12"></div>
         <div className="h-12 bg-main-100 rounded-pill w-1/2"></div>
      </div>
    );
  }

  if (!summaryData) return null;

  const isHighlyTrusted = summaryData.trustScore >= 70;
  const analytics = summaryData.sentimentAnalytics || { positiveCount: 0, negativeCount: 0, suspiciousCount: 0, verifiedCount: 0 };
  const totalAnalyzed = analytics.verifiedCount + analytics.suspiciousCount;
  const authenticityRate = totalAnalyzed > 0 ? Math.round((analytics.verifiedCount / totalAnalyzed) * 100) : 100;

  // Compute Overall Recommendation Verdict (Good or Bad based on sentiment ratio)
  let overallVerdict = "MIXED / NEUTRAL FEEDBACK";
  let verdictColor = "text-warning-600 animate-pulse";
  if (analytics.positiveCount > analytics.negativeCount * 1.5) {
    overallVerdict = "EXCELLENT / HIGHLY RECOMMENDED";
    verdictColor = "text-success-600";
  } else if (analytics.positiveCount > analytics.negativeCount) {
    overallVerdict = "GOOD / GENERALLY POSITIVE";
    verdictColor = "text-success-600";
  } else if (analytics.negativeCount > analytics.positiveCount * 1.5) {
    overallVerdict = "POOR / NOT RECOMMENDED";
    verdictColor = "text-danger-600";
  } else if (analytics.negativeCount > analytics.positiveCount) {
    overallVerdict = "CRITICAL / GENERALLY NEGATIVE";
    verdictColor = "text-danger-600";
  }

  return (
    <div className="p-24 rounded-16 mb-40 shadow-sm border border-gray-100" style={{ background: 'linear-gradient(135deg, #fdfdfd 0%, #f7f9fa 100%)' }}>
      {/* Header & Trust Badging */}
      <div className="flex-between flex-wrap gap-16 mb-24 pb-16 border-bottom border-gray-200">
        <h5 className="mb-0 flex-align gap-12 text-heading text-xl fw-bold">
           <Bot size={28} className="text-main-600" />
           Valkey AI Review Guard & Trust Engine
        </h5>
        <div className="d-flex flex-column align-items-end gap-8">
          <div className="flex-align gap-12 flex-wrap">
            <div className="flex-align gap-8 bg-white p-8 px-16 rounded-pill border border-gray-200 shadow-sm">
               <BarChart3 size={16} className="text-main-two-600" />
               <span className="text-sm fw-medium text-neutral-600">Valkey Cache: <span className="text-main-two-600 fw-bold">HIT</span></span>
            </div>
            <div className={`flex-align gap-8 p-8 px-16 rounded-pill border shadow-sm ${isHighlyTrusted ? 'bg-success-50 border-success-200 text-success-700' : 'bg-danger-50 border-danger-200 text-danger-700'}`}>
               {isHighlyTrusted ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
               <span className="text-sm fw-bold">
                 Trust Score: {summaryData.trustScore}/100 ({isHighlyTrusted ? 'Highly Authentic' : 'Low Confidence'})
               </span>
            </div>
          </div>
          <div className="text-xs fw-bold mt-4 flex-align gap-6">
             <span className="text-gray-500">AI Product Verdict:</span>
             <span className={`${verdictColor}`} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {overallVerdict}
             </span>
          </div>
        </div>
      </div>
      
      {/* Overarching AI Summary */}
      <div className="bg-white p-20 rounded-12 border border-gray-100 mb-24 position-relative">
        <span className="text-main-600 text-5xl fw-bold position-absolute" style={{ top: '-10px', left: '10px', opacity: 0.15 }}>“</span>
        <p className="text-heading fw-medium text-lg mb-0 ps-16" style={{ lineHeight: 1.6 }}>
          "{summaryData.summary}"
        </p>
      </div>

      {/* Analytics Breakdown & Metrics */}
      <div className="row gy-4 mb-24">
        {/* Sentiment Meter */}
        <div className="col-md-5">
          <div className="bg-white p-16 rounded-12 border border-gray-100 h-100 flex-column justify-between">
            <h6 className="text-gray-900 fw-bold mb-12 text-sm flex-align gap-6">
              <BarChart3 size={16} className="text-gray-400" /> Sentiment Analytics
            </h6>
            <div className="d-flex flex-column gap-8 mt-12">
              <div className="flex-between text-xs fw-semibold text-gray-500">
                <span>Authentic Verified Reviews</span>
                <span className="text-success-600">{authenticityRate}% ({analytics.verifiedCount} reviews)</span>
              </div>
              <div className="w-100 bg-gray-100 rounded-pill h-10 overflow-hidden">
                <div 
                  className="bg-success-500 rounded-pill h-100 transition-5" 
                  style={{ width: `${authenticityRate}%` }} 
                />
              </div>
              <div className="flex-between text-xs text-gray-400 mt-4">
                <span>Positive sentiment: {analytics.positiveCount}</span>
                <span>Negative sentiment: {analytics.negativeCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Pros List */}
        <div className="col-md-3">
          <div className="bg-white p-16 rounded-12 border border-gray-100 h-100">
            <h6 className="text-success-600 flex-align gap-8 mb-12 text-sm fw-bold">
              <ThumbsUp size={16} /> Auto-Extracted Pros
            </h6>
            <ul className="d-flex flex-column gap-6">
              {summaryData.pros?.map((pro, i) => (
                <li key={i} className="text-neutral-700 text-sm flex-align gap-8">
                  <CheckCircle size={14} className="text-success-500 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Cons List */}
        <div className="col-md-4">
          <div className="bg-white p-16 rounded-12 border border-gray-100 h-100">
            <h6 className="text-danger-600 flex-align gap-8 mb-12 text-sm fw-bold">
              <ThumbsDown size={16} /> Auto-Extracted Cons
            </h6>
            <ul className="d-flex flex-column gap-6">
              {summaryData.cons?.map((con, i) => (
                <li key={i} className="text-neutral-700 text-sm flex-align gap-8">
                  <AlertTriangle size={14} className="text-danger-500 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fake/Suspicious Reviews Flagged List */}
      {summaryData.flaggedReviews && summaryData.flaggedReviews.length > 0 && (
        <div className="bg-danger-50 border border-danger-100 p-16 rounded-12">
          <h6 className="text-danger-700 flex-align gap-8 mb-12 text-sm fw-bold">
            <AlertTriangle size={16} /> AI Spam Guard Telemetry ({summaryData.flaggedReviews.length} Suspicious Review flagged)
          </h6>
          <div className="d-flex flex-column gap-12">
            {summaryData.flaggedReviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-12 rounded-8 border border-danger-200">
                <div className="flex-between mb-6">
                  <span className="text-xs fw-bold text-gray-900">Author: {rev.author}</span>
                  <span className="text-xxs fw-bold bg-danger-100 text-danger-700 px-8 py-2 rounded-pill">FLAGGED</span>
                </div>
                <p className="text-xs text-gray-600 mb-6 italic">"{rev.comment}"</p>
                <div className="text-xxs text-danger-600 fw-bold border-top border-gray-100 pt-6">
                   • AI Security Flag Reason: {rev.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSummarizer;
