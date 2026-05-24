import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adsAPI } from '../services/adsAPI';

/**
 * AdBanner - Full-width promotional ad banner
 * Used on homepage between sections
 * Props: placement (string) - which placement to fetch ads for
 */
const AdBanner = ({ placement = 'homepage-banner' }) => {
    const [ad, setAd] = useState(null);

    useEffect(() => {
        adsAPI.getAds(placement)
            .then(ads => {
                if (ads.length > 0) {
                    const randomAd = ads[Math.floor(Math.random() * ads.length)];
                    setAd(randomAd);
                    adsAPI.trackImpression(randomAd.id);
                }
            })
            .catch(() => {});
    }, [placement]);

    if (!ad) return null;

    return (
        <section className="py-40">
            <div className="container container-lg">
                <div className="position-relative rounded-16 overflow-hidden" style={{ minHeight: '200px' }}>
                    <img
                        src={ad.image}
                        alt={ad.title}
                        className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 object-fit-cover"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="position-relative p-40 d-flex align-items-center" style={{ minHeight: '200px' }}>
                        <div className="row w-100 align-items-center">
                            <div className="col-lg-8">
                                <span className="text-xs text-white fw-semibold px-12 py-4 rounded-pill mb-12 d-inline-block" style={{ background: 'rgba(250,100,0,0.9)' }}>
                                    <i className="ph ph-megaphone me-4" />Sponsored
                                </span>
                                <h3 className="text-white fw-bold mb-8">{ad.title}</h3>
                                <p className="text-white mb-0" style={{ opacity: 0.85 }}>{ad.description}</p>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-24 mt-lg-0">
                                <Link
                                    to={ad.link}
                                    className="btn bg-white text-main-600 fw-semibold rounded-pill px-32 py-14 hover-bg-main-600 hover-text-white"
                                    onClick={() => adsAPI.trackClick(ad.id)}
                                >
                                    {ad.cta} <i className="ph ph-arrow-right ms-8" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdBanner;
