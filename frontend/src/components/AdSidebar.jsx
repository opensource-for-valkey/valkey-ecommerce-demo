import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adsAPI } from '../services/adsAPI';

/**
 * AdSidebar - Vertical ad card for sidebars
 * Used in shop page sidebar
 */
const AdSidebar = () => {
    const [ad, setAd] = useState(null);

    useEffect(() => {
        adsAPI.getAds('shop-sidebar')
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
        <div className="shop-sidebar__box rounded-8 overflow-hidden position-relative">
            <img
                src={ad.image}
                alt={ad.title}
                className="w-100 object-fit-cover"
                style={{ height: '280px' }}
            />
            <div className="position-absolute bottom-0 start-0 end-0 p-16" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                <span className="text-xs text-white fw-medium px-8 py-2 rounded-pill mb-8 d-inline-block" style={{ background: 'rgba(250,100,0,0.9)', fontSize: '10px' }}>
                    AD
                </span>
                <h6 className="text-white text-sm fw-bold mb-4">{ad.title}</h6>
                <Link
                    to={ad.link}
                    className="text-main-600 text-xs fw-semibold"
                    onClick={() => adsAPI.trackClick(ad.id)}
                >
                    {ad.cta} →
                </Link>
            </div>
        </div>
    );
};

export default AdSidebar;
