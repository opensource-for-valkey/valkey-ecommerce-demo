import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adsAPI } from '../services/adsAPI';

/**
 * AdInline - Inline ad card that blends with product grid
 * Used between product listings in shop page
 */
const AdInline = () => {
    const [ad, setAd] = useState(null);

    useEffect(() => {
        adsAPI.getAds('shop-inline')
            .then(ads => {
                if (ads.length > 0) {
                    const randomAd = ads[Math.floor(Math.random() * ads.length)];
                    setAd(randomAd);
                    adsAPI.trackImpression(randomAd.id);
                }
            })
            .catch(() => {});
    }, []);

    if (!ad) return null;

    return (
        <div className="product-card h-100 p-16 border border-main-100 hover-border-main-600 rounded-16 position-relative transition-2" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF1E6)' }}>
            <div className="position-relative rounded-8 overflow-hidden" style={{ height: '180px' }}>
                <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-100 h-100 object-fit-cover"
                />
                <span className="position-absolute top-0 start-0 text-xs text-white fw-semibold px-10 py-4 m-8 rounded-pill" style={{ background: 'rgba(250,100,0,0.9)', fontSize: '10px' }}>
                    <i className="ph ph-megaphone me-4" />SPONSORED
                </span>
            </div>
            <div className="mt-16">
                <h6 className="title text-lg fw-semibold mb-8">
                    <Link to={ad.link} className="link text-line-2" onClick={() => adsAPI.trackClick(ad.id)}>
                        {ad.title}
                    </Link>
                </h6>
                <p className="text-gray-500 text-sm mb-16 text-line-2">{ad.description}</p>
                <Link
                    to={ad.link}
                    className="btn btn-main rounded-pill py-8 px-24 text-sm w-100 text-center"
                    onClick={() => adsAPI.trackClick(ad.id)}
                >
                    {ad.cta} <i className="ph ph-arrow-right ms-4" />
                </Link>
            </div>
        </div>
    );
};

export default AdInline;
