import React, { useState, useEffect } from 'react';

const IntroAnimation = ({ children }) => {
    const [show, setShow] = useState(() => !sessionStorage.getItem('intro_seen'));
    const [phase, setPhase] = useState('loading'); // loading → reveal → done

    useEffect(() => {
        if (!show) return;
        const revealTimer = setTimeout(() => setPhase('reveal'), 3500);
        const doneTimer = setTimeout(() => {
            setShow(false);
            sessionStorage.setItem('intro_seen', 'true');
        }, 4500);
        return () => { clearTimeout(revealTimer); clearTimeout(doneTimer); };
    }, [show]);

    if (!show) return children;

    return (
        <>
            <div className={`intro ${phase === 'reveal' ? 'intro--exit' : ''}`}>
                {/* Particle background */}
                <div className="intro__particles">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="intro__particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                        }} />
                    ))}
                </div>

                {/* Glowing orbs */}
                <div className="intro__orb intro__orb--1"></div>
                <div className="intro__orb intro__orb--2"></div>
                <div className="intro__orb intro__orb--3"></div>

                {/* Main content */}
                <div className="intro__center">
                    {/* Hexagon logo */}
                    <div className="intro__hex-wrap">
                        <div className="intro__hex">
                            <svg viewBox="0 0 100 100" className="intro__hex-svg">
                                <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" fill="none" stroke="url(#hexGrad)" strokeWidth="2" className="intro__hex-path" />
                                <defs>
                                    <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FA6400" />
                                        <stop offset="100%" stopColor="#ff9a44" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="intro__hex-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <polyline points="9,22 9,12 15,12 15,22" />
                                </svg>
                            </div>
                        </div>
                        {/* Orbiting dots */}
                        <div className="intro__orbit">
                            <div className="intro__orbit-dot"></div>
                        </div>
                        <div className="intro__orbit intro__orbit--2">
                            <div className="intro__orbit-dot"></div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="intro__text">
                        <h1 className="intro__brand">
                            {'VALKEY'.split('').map((char, i) => (
                                <span key={i} className="intro__char" style={{ animationDelay: `${0.8 + i * 0.08}s` }}>{char}</span>
                            ))}
                            <span className="intro__char intro__char--space" style={{ animationDelay: '1.3s' }}> </span>
                            {'STORE'.split('').map((char, i) => (
                                <span key={`s${i}`} className="intro__char intro__char--accent" style={{ animationDelay: `${1.35 + i * 0.08}s` }}>{char}</span>
                            ))}
                        </h1>
                        <div className="intro__line"></div>
                        <p className="intro__sub">
                            <span className="intro__sub-text">Next-Gen E-Commerce</span>
                            <span className="intro__sub-dot">•</span>
                            <span className="intro__sub-text">Powered by Valkey</span>
                        </p>
                    </div>

                    {/* Team badge */}
                    <div className="intro__badge">
                        <span>Built by</span>
                        <strong>ZenCoders</strong>
                    </div>
                </div>
            </div>
            {children}
        </>
    );
};

export default IntroAnimation;
