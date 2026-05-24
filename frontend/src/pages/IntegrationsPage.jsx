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
import { getIntegrationsDashboard } from "../services/valkeyApi";

const IntegrationsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getIntegrationsDashboard()
      .then(setDashboard)
      .catch((error) => setMessage(error.message));
  }, []);

  const integrations = dashboard?.integrations || [];
  const evidence = dashboard?.liveEvidence || {};

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Integrations" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-warning rounded-8">{message}</div>}

          <div className="valkey-demo-panel mb-32">
            <div className="flex-between flex-wrap gap-16 mb-24">
              <div>
                <span className="text-sm text-main-600 fw-semibold">Valkey-Integrations.md</span>
                <h6 className="mb-0 mt-4">Integration coverage</h6>
              </div>
              <span className="text-sm text-gray-600">{dashboard?.summary?.total || 0} demo-ready mappings</span>
            </div>
            <div className="row gy-3">
              <Metric label="Products" value={evidence.productCount ?? "-"} />
              <Metric label="Vector index" value={evidence.vectorIndexReady ? "Ready" : "Pending"} />
              <Metric label="Search index" value={evidence.fullTextIndexReady ? "Ready" : "Fallback"} />
              <Metric label="Log stream" value={evidence.logStreamLength ?? "-"} />
              <Metric label="Warehouses" value={evidence.warehouseCount ?? "-"} />
              <Metric label="Rate rules" value={evidence.rateLimitRules ?? "-"} />
            </div>
          </div>

          <div className="row gy-4">
            {integrations.map((integration) => (
              <div className="col-xl-4 col-md-6" key={integration.id}>
                <div className="valkey-integration-card h-100">
                  <div className="flex-between gap-12 mb-16">
                    <span className="text-xs text-main-600 fw-semibold">{integration.specSource}</span>
                    <span className={`valkey-status-pill valkey-status-pill--${integration.status}`}>{integration.status}</span>
                  </div>
                  <h6 className="text-lg mb-8">{integration.project}</h6>
                  <span className="text-sm text-gray-500 d-block mb-12">{integration.track}</span>
                  <p className="text-sm text-gray-700 mb-16">{integration.summary}</p>
                  <div className="d-flex flex-wrap gap-8 mb-16">
                    {integration.valkeyCapabilities.map((capability) => (
                      <span className="valkey-chip" key={capability}>{capability}</span>
                    ))}
                  </div>
                  <div className="border-top border-gray-100 pt-12">
                    <strong className="text-sm d-block mb-8">API surface</strong>
                    {integration.apiRoutes.slice(0, 3).map((route) => (
                      <code className="d-block text-xs text-gray-600 mb-4" key={route}>{route}</code>
                    ))}
                  </div>
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

function Metric({ label, value }) {
  return (
    <div className="col-xl-2 col-md-4 col-6">
      <div className="border border-gray-100 rounded-8 p-16 h-100">
        <span className="text-xs text-gray-500 d-block mb-8">{label}</span>
        <strong className="text-heading">{value}</strong>
      </div>
    </div>
  );
}

export default IntegrationsPage;
