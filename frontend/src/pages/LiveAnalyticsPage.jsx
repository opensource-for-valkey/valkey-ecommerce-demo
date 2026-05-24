import React from 'react';
import HeaderTwo from '../components/HeaderTwo';
import FooterTwo from '../components/FooterTwo';
import LiveAnalytics from '../components/Dashboard/LiveAnalytics';

const LiveAnalyticsPage = () => {
    return (
        <>
            <HeaderTwo />
            <LiveAnalytics />
            <FooterTwo />
        </>
    );
};

export default LiveAnalyticsPage;
