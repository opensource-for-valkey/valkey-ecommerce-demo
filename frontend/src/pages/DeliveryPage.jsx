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
import { checkDeliveryServiceability, getDeliveryEta, getDeliveryTracking, updateDeliveryLocation } from "../services/valkeyApi";

const TRACKING_ID = "DEL-HYD-TEAM-DOD";

const DeliveryPage = () => {
  const [tracking, setTracking] = useState(null);
  const [serviceability, setServiceability] = useState(null);
  const [eta, setEta] = useState(null);
  const [message, setMessage] = useState("");

  async function refresh() {
    try {
      const [trackingData, serviceData, etaData] = await Promise.all([
        getDeliveryTracking(TRACKING_ID),
        checkDeliveryServiceability(17.43, 78.41),
        getDeliveryEta("17.4200,78.4200", "17.4300,78.4100"),
      ]);
      setTracking(trackingData.tracking);
      setServiceability(serviceData);
      setEta(etaData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function moveAgent() {
    try {
      const data = await updateDeliveryLocation(TRACKING_ID, { lat: 17.426, lng: 78.414, status: "in_transit" });
      setTracking(data.tracking);
      setEta(data.eta);
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
      <Breadcrumb title="Delivery" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-warning rounded-8">{message}</div>}
          <div className="row gy-4">
            <div className="col-lg-7">
              <div className="valkey-demo-panel">
                <span className="text-sm text-main-600 fw-semibold">Challenge 11</span>
                <h6 className="mb-20 mt-4">Delivery with Valkey GEO</h6>
                <div className="bg-color-three rounded-8 p-24 mb-24">
                  <div className="flex-between mb-12"><span>Tracking</span><strong>{tracking?.trackingId}</strong></div>
                  <div className="flex-between mb-12"><span>Status</span><strong>{tracking?.status}</strong></div>
                  <div className="flex-between mb-12"><span>Agent</span><strong>{tracking?.agentId}</strong></div>
                  <div className="flex-between"><span>ETA</span><strong>{eta?.etaMinutes || 0} min</strong></div>
                </div>
                <button className="btn btn-main py-12 px-20 rounded-8 flex-align gap-8" type="button" onClick={() => void moveAgent()}>
                  <i className="ph ph-map-pin" />
                  Simulate location update
                </button>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="valkey-demo-panel">
                <h6 className="mb-20">Serviceability</h6>
                <div className="flex-between mb-12"><span>Serviceable</span><strong>{serviceability?.serviceable ? "Yes" : "No"}</strong></div>
                <div className="flex-between mb-12"><span>Radius</span><strong>{serviceability?.radiusKm} km</strong></div>
                <div className="flex-between"><span>Nearest warehouse</span><strong>{serviceability?.nearestWarehouse?.warehouseId || "-"}</strong></div>
                <div className="mt-24">
                  {(tracking?.history || []).slice(-4).map((entry) => (
                    <div className="border-bottom border-gray-100 py-10" key={`${entry.timestamp}-${entry.lat}`}>
                      <strong className="text-sm">{entry.status}</strong>
                      <span className="d-block text-xs text-gray-600">{entry.lat}, {entry.lng}</span>
                    </div>
                  ))}
                </div>
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

export default DeliveryPage;
