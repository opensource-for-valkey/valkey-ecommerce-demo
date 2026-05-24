import React, { useState } from "react";
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
import { agentSearch } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const AgenticSearchPage = () => {
  const { addItem } = useCart();
  const [message, setMessage] = useState("I need a travel gift under 3000");
  const [sessionId, setSessionId] = useState("");
  const [reply, setReply] = useState(null);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await agentSearch({ sessionId: sessionId || undefined, message });
      setSessionId(data.sessionId);
      setReply(data);
    } catch (nextError) {
      setError(nextError.message);
    }
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Agentic Search" />
      <ValkeyChallengeNav />
      <section className="py-60">
        <div className="container container-lg">
          {error && <div className="alert alert-warning rounded-8">{error}</div>}
          <div className="valkey-demo-panel mb-32">
            <span className="text-sm text-main-600 fw-semibold">Challenge 14</span>
            <h6 className="mb-20 mt-4">Agentic product search with Valkey memory</h6>
            <form onSubmit={submit} className="row gy-3 align-items-end">
              <div className="col-lg-9">
                <label className="text-sm fw-semibold mb-8">Prompt</label>
                <input className="common-input border-gray-100" value={message} onChange={(event) => setMessage(event.target.value)} />
              </div>
              <div className="col-lg-3">
                <button className="btn btn-main py-14 px-20 rounded-8 w-100" type="submit">Ask agent</button>
              </div>
            </form>
          </div>

          {reply && (
            <div className="valkey-demo-panel">
              <p className="text-gray-700 mb-8">{reply.response}</p>
              <span className="text-sm text-main-600 fw-semibold d-block mb-24">{reply.followUp}</span>
              <div className="row gy-4">
                {reply.results.map((result) => (
                  <div className="col-xl-4 col-md-6" key={result.productId}>
                    <div className="border border-gray-100 rounded-8 p-16 h-100">
                      <div className="valkey-product-media mb-12"><img src={result.image} alt={result.name} /></div>
                      <h6 className="text-lg mb-8">{result.name}</h6>
                      <span className="fw-bold d-block mb-8">{currency.format(result.price)}</span>
                      <p className="text-sm text-gray-600">{result.reason}</p>
                      <button className="btn btn-main py-10 px-14 rounded-8" type="button" onClick={() => void addItem({ id: result.productId })}>
                        Add from catalog
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <ShippingOne />
      <FooterTwo />
      <BottomFooter />
    </>
  );
};

export default AgenticSearchPage;
