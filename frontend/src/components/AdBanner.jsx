import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function generateSessionId() {
  const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const AdBanner = ({ context, value }) => {
  const [ad, setAd] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const impressionRecorded = useRef(false);

  useEffect(() => {
    let sid = localStorage.getItem('valkey_ad_session');
    if (!sid) {
      sid = generateSessionId();
      localStorage.setItem('valkey_ad_session', sid);
    }
    setSessionId(sid);

    if (context && value) {
      fetch(`http://localhost:5000/api/ads?context=${context}&value=${encodeURIComponent(value)}&sessionId=${sid}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setAd(data);
          }
        })
        .catch(console.error);
    }
  }, [context, value]);

  useEffect(() => {
    if (ad && sessionId && !impressionRecorded.current) {
      // Record impression
      fetch(`http://localhost:5000/api/ads/${ad.id}/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, bidAmount: ad.bidAmount })
      }).catch(console.error);
      impressionRecorded.current = true;
    }
  }, [ad, sessionId]);

  const handleAdClick = (e) => {
    if (ad) {
      fetch(`http://localhost:5000/api/ads/${ad.id}/click`, {
        method: 'POST'
      }).catch(console.error);
    }
  };

  if (!ad) return null;

  return (
    <div className="ad-banner mb-24 rounded-16 overflow-hidden position-relative" style={{ border: '1px solid #e5e7eb' }}>
      <Link to={ad.targetUrl} onClick={handleAdClick} className="d-block">
        <span 
          className="position-absolute bg-white text-gray-500 text-xs px-8 py-4 rounded-end-bottom-8 shadow-sm" 
          style={{ top: 0, left: 0, zIndex: 1, borderBottomRightRadius: '8px' }}>
          Sponsored
        </span>
        <img 
          src={ad.imageUrl} 
          alt={ad.title} 
          className="w-100" 
          style={{ maxHeight: '180px', objectFit: 'cover' }} 
        />
        <div className="p-12 bg-white">
          <h6 className="text-md mb-0 text-heading font-heading">{ad.title}</h6>
        </div>
      </Link>
    </div>
  );
};

export default AdBanner;
