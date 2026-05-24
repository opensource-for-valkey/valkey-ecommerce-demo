import React, { useEffect, useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import BottomFooter from "../components/BottomFooter";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import HeaderTwo from "../components/HeaderTwo";
import ShippingOne from "../components/ShippingOne";
import ValkeyChallengeNav from "../components/ValkeyChallengeNav";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import { apiBaseUrl, getAnalyticsDashboard, getPrometheusMetrics } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const AnalyticsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [metrics, setMetrics] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [dashboardData, metricsText] = await Promise.all([getAnalyticsDashboard(), getPrometheusMetrics()]);
        if (active) {
          setDashboard(dashboardData.dashboard);
          setMetrics(metricsText);
          setMessage("");
        }
      } catch (error) {
        if (active) setMessage(error.message);
      }
    };
    void load();
    const timer = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const cards = dashboard
    ? [
        ["Orders", dashboard.orders, "ph-package"],
        ["Revenue", currency.format(dashboard.revenue), "ph-currency-inr"],
        ["Active users", dashboard.activeUsers, "ph-users-three"],
        ["p95 latency", `${dashboard.api.p95Ms} ms`, "ph-gauge"],
        ["HTTP errors", dashboard.api.errors, "ph-warning"],
        ["Reserved inventory", dashboard.inventory.reserved, "ph-lock-key"],
      ]
    : [];

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Analytics" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-warning rounded-8">{message}</div>}
          <div className="flex-between flex-wrap gap-16 mb-24">
            <div>
              <span className="text-sm text-main-600 fw-semibold">Prometheus endpoint</span>
              <h6 className="mb-0 mt-4">{apiBaseUrl()}/metrics</h6>
            </div>
            <a className="btn bg-gray-50 text-heading rounded-8 py-12 px-16 hover-bg-main-600 hover-text-white" href={`${apiBaseUrl()}/metrics`} target="_blank" rel="noreferrer">
              <i className="ph ph-arrow-square-out me-8" />
              Open metrics
            </a>
          </div>

          <div className="row gy-4 mb-32">
            {cards.map(([label, value, icon]) => (
              <div className="col-xl-2 col-md-4 col-sm-6" key={label}>
                <div className="border border-gray-100 rounded-8 p-20 h-100">
                  <i className={`ph ${icon} text-main-600 text-2xl`} />
                  <span className="d-block text-sm text-gray-500 mt-12">{label}</span>
                  <strong className="d-block text-xl text-heading mt-4">{value}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="row gy-4">
            <div className="col-lg-6">
              <div className="border border-gray-100 rounded-8 p-24 h-100">
                <h6 className="mb-20">Status Counts</h6>
                {Object.entries(dashboard?.api.statusCounts || {}).map(([status, count]) => (
                  <div className="flex-between border-bottom border-gray-100 py-10" key={status}>
                    <span>HTTP {status}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="border border-gray-100 rounded-8 p-24 h-100">
                <h6 className="mb-20">Prometheus Preview</h6>
                <pre className="bg-gray-50 rounded-8 p-16 text-sm overflow-auto mb-0" style={{ maxHeight: 320 }}>
                  {metrics.split("\n").slice(0, 24).join("\n")}
                </pre>
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

export default AnalyticsPage;
