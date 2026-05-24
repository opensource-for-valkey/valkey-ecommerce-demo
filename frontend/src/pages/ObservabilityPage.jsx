import React, { useCallback, useEffect, useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import BottomFooter from "../components/BottomFooter";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import HeaderTwo from "../components/HeaderTwo";
import ShippingOne from "../components/ShippingOne";
import ValkeyChallengeNav from "../components/ValkeyChallengeNav";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import {
  getObservabilityErrors,
  getObservabilityHealth,
  getObservabilityLogs,
  getTrace,
  triggerDemoError,
} from "../services/valkeyApi";

const ObservabilityPage = () => {
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [traceId, setTraceId] = useState("");
  const [trace, setTrace] = useState(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [healthData, logsData, errorsData] = await Promise.all([
      getObservabilityHealth(),
      getObservabilityLogs(80),
      getObservabilityErrors(),
    ]);
    setHealth(healthData.health);
    setLogs(logsData.logs || []);
    setErrors(errorsData.errors || []);
    if (!traceId && logsData.logs?.[0]?.traceId) {
      setTraceId(logsData.logs[0].traceId);
    }
  }, [traceId]);

  useEffect(() => {
    let active = true;
    const loadSafely = async () => {
      try {
        await load();
        if (active) setMessage("");
      } catch (error) {
        if (active) setMessage(error.message);
      }
    };
    void loadSafely();
    const timer = setInterval(loadSafely, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [load]);

  async function lookupTrace(event) {
    event.preventDefault();
    if (!traceId) return;
    try {
      setTrace(await getTrace(traceId));
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createError() {
    try {
      await triggerDemoError();
    } catch (error) {
      setMessage(`Demo error captured with trace ${error.traceId || "unknown"}`);
      if (error.traceId) setTraceId(error.traceId);
      await load();
    }
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Observability" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          {message && <div className="alert alert-info rounded-8">{message}</div>}

          <div className="row gy-4 mb-32">
            <div className="col-lg-4">
              <div className="border border-gray-100 rounded-8 p-24 h-100">
                <h6 className="mb-16">Health</h6>
                <div className="flex-between py-8">
                  <span>Trace headers</span>
                  <strong>{health?.traceHeaders ? "enabled" : "unknown"}</strong>
                </div>
                <div className="flex-between py-8">
                  <span>Valkey stream</span>
                  <strong>{health?.stream?.length ?? 0} logs</strong>
                </div>
                <div className="flex-between py-8">
                  <span>OpenSearch</span>
                  <strong>{health?.opensearch?.reachable ? "reachable" : "pending"}</strong>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="border border-gray-100 rounded-8 p-24 h-100">
                <h6 className="mb-16">Trace Lookup</h6>
                <form onSubmit={lookupTrace} className="d-flex gap-12 flex-wrap">
                  <input className="common-input border-gray-100 flex-grow-1" value={traceId} onChange={(event) => setTraceId(event.target.value)} placeholder="Trace ID" />
                  <button className="btn btn-main py-12 px-18 rounded-8 flex-align gap-8" type="submit">
                    <i className="ph ph-magnifying-glass" />
                    Lookup
                  </button>
                  <button className="btn bg-gray-50 text-heading py-12 px-18 rounded-8 hover-bg-main-600 hover-text-white flex-align gap-8" type="button" onClick={createError}>
                    <i className="ph ph-warning-circle" />
                    Trigger error
                  </button>
                </form>
                {trace?.logs?.length > 0 && (
                  <div className="mt-20">
                    {trace.logs.map((log) => (
                      <div className="border-top border-gray-100 py-10" key={log.id}>
                        <span className="text-xs text-main-600 fw-semibold">{log.level}</span>
                        <span className="ms-8 text-sm">{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row gy-4">
            <div className="col-lg-8">
              <div className="border border-gray-100 rounded-8 p-24 h-100">
                <h6 className="mb-16">Recent Logs</h6>
                <div className="overflow-auto" style={{ maxHeight: 480 }}>
                  {logs.map((log) => (
                    <div className="border-bottom border-gray-100 py-12" key={log.id}>
                      <div className="flex-between gap-12 flex-wrap">
                        <span className={`text-sm fw-semibold ${log.level === "error" ? "text-danger-600" : "text-main-600"}`}>{log.level}</span>
                        <span className="text-xs text-gray-500">{log.ts}</span>
                      </div>
                      <div className="text-heading fw-medium">{log.message}</div>
                      <button className="text-sm text-gray-600 hover-text-main-600" type="button" onClick={() => setTraceId(log.traceId)}>
                        {log.traceId}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border border-gray-100 rounded-8 p-24 h-100">
                <h6 className="mb-16">Top Errors</h6>
                {errors.length === 0 && <span className="text-gray-500">No errors yet</span>}
                {errors.map((error) => (
                  <div className="flex-between border-bottom border-gray-100 py-12 gap-12" key={error.message}>
                    <span className="text-sm">{error.message}</span>
                    <strong>{error.count}</strong>
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

export default ObservabilityPage;
