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
import { getRateLimitConfig, hitRateLimitDemo } from "../services/valkeyApi";

const RateLimitPage = () => {
  const [config, setConfig] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRateLimitConfig().then((data) => setConfig(data.config || {})).catch((error) => setMessage(error.message));
  }, []);

  async function hit() {
    try {
      const data = await hitRateLimitDemo();
      setAttempts((current) => [{ status: 200, remaining: data.traceId ? "ok" : "ok" }, ...current].slice(0, 6));
    } catch (error) {
      setAttempts((current) => [{ status: error.status, remaining: error.code }, ...current].slice(0, 6));
      setMessage(error.message);
    }
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Rate Limiting" />
      <ValkeyChallengeNav />
      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-info rounded-8">{message}</div>}
          <div className="row gy-4">
            <div className="col-lg-5">
              <div className="valkey-demo-panel">
                <span className="text-sm text-main-600 fw-semibold">Challenge 12</span>
                <h6 className="mb-20 mt-4">Sliding-window rate limiting</h6>
                <button className="btn btn-main py-12 px-20 rounded-8" type="button" onClick={() => void hit()}>
                  Hit protected endpoint
                </button>
                <div className="mt-24">
                  {attempts.map((attempt, index) => (
                    <div className="flex-between border-bottom border-gray-100 py-10" key={`${attempt.status}-${index}`}>
                      <span>Attempt {attempts.length - index}</span>
                      <strong>{attempt.status}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="valkey-demo-panel">
                <h6 className="mb-20">Endpoint policies</h6>
                {Object.entries(config).map(([path, policy]) => (
                  <div className="border-bottom border-gray-100 py-12" key={path}>
                    <strong>{path}</strong>
                    <span className="d-block text-sm text-gray-600">Anonymous {policy.anonymous}/window, authenticated {policy.authenticated}/window, {policy.window}s</span>
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

export default RateLimitPage;
