import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SESSION_FREQ_KEY = 'ad_session_freq';
const SESSION_FREQ_CAP = 3;

function getSessionFreq() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_FREQ_KEY) || '{}'); }
  catch { return {}; }
}

function bumpSessionFreq(adId) {
  const freq = getSessionFreq();
  freq[adId] = (freq[adId] || 0) + 1;
  sessionStorage.setItem(SESSION_FREQ_KEY, JSON.stringify(freq));
  return freq[adId];
}

function AdCard({ ad, token }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    const count = bumpSessionFreq(ad.id);
    if (count > SESSION_FREQ_CAP) return;
    trackedRef.current = true;

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`/api/ads/${encodeURIComponent(ad.id)}/impression`, { method: 'POST', headers }).catch(() => {});
  }, [ad.id, token]);

  function handleClick() {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`/api/ads/${encodeURIComponent(ad.id)}/click`, { method: 'POST', headers }).catch(() => {});
  }

  return (
    <a
      href={ad.targetUrl || '/shop'}
      onClick={handleClick}
      className="ad-card d-flex align-items-center gap-16 p-20 rounded-16 border border-gray-100 hover-border-main-600 bg-white position-relative overflow-hidden transition-2 text-decoration-none"
      style={{ flex: 1, minWidth: 0 }}
    >
      {/* Sponsored badge */}
      <span
        className="position-absolute text-xs fw-medium text-gray-500 bg-gray-100 px-8 py-2 rounded-4"
        style={{ top: 8, right: 10, fontSize: 10, lineHeight: '18px' }}
      >
        Sponsored
      </span>

      {/* Ad image placeholder / icon */}
      <div
        className="flex-shrink-0 flex-center rounded-12 bg-main-50"
        style={{ width: 72, height: 72 }}
      >
        <i className="ph ph-storefront text-main-600" style={{ fontSize: 32 }} />
      </div>

      {/* Ad content */}
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <p className="text-xs text-main-600 fw-semibold mb-4 text-uppercase" style={{ letterSpacing: '0.5px' }}>
          Ad
        </p>
        <h6 className="fw-bold text-heading mb-4 text-line-1" style={{ fontSize: 14 }}>
          {ad.title}
        </h6>
        {ad.description && (
          <p className="text-sm text-gray-500 mb-0 text-line-2" style={{ fontSize: 12 }}>
            {ad.description}
          </p>
        )}
        <span className="text-xs text-main-600 fw-semibold mt-6 d-inline-block">
          Shop Now →
        </span>
      </div>
    </a>
  );
}

const AdBanner = ({ context = 'global', value = null, limit = 2, noContainer = false }) => {
  const { getToken } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ context, limit });
    if (value) params.set('value', value);

    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`/api/ads?${params}`, { headers })
      .then(r => r.ok ? r.json() : { ads: [] })
      .then(data => {
        const sessionFreq = getSessionFreq();
        const visible = (data.ads || []).filter(ad => (sessionFreq[ad.id] || 0) < SESSION_FREQ_CAP);
        setAds(visible);
      })
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  }, [context, value, limit]);

  if (loading || ads.length === 0) return null;

  const token = getToken();
  const inner = (
    <div className="d-flex gap-16 flex-wrap">
      {ads.map(ad => (
        <AdCard key={ad.id} ad={ad} token={token} />
      ))}
    </div>
  );

  if (noContainer) {
    return <div className="mb-24">{inner}</div>;
  }

  return (
    <section className="ad-banner py-24">
      <div className="container container-lg">
        {inner}
      </div>
    </section>
  );
};

export default AdBanner;
