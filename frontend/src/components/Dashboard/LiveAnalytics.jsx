import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import socket from '../../services/socket';
import api from '../../services/api';

const LiveAnalytics = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCartAdds: 0,
    topTrending: []
  });
  const [liveTraffic, setLiveTraffic] = useState(
    Array(20).fill(0).map((_, i) => ({ time: i, users: Math.floor(Math.random() * 50) + 10 }))
  );

  useEffect(() => {
    // Fetch initial data
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      }
    };
    fetchDashboard();

    // Socket.io Listeners
    socket.on('analytics_active_users', (data) => {
      setActiveUsers(data.count);
      setLiveTraffic(prev => {
        const newArr = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, users: data.count + Math.floor(Math.random() * 10) }];
        return newArr;
      });
    });

    socket.on('analytics_cart_add', () => {
      setDashboardData(prev => ({ ...prev, totalCartAdds: Number(prev.totalCartAdds) + 1 }));
    });

    socket.on('trends_update', (data) => {
       // Refresh trending list when views update
       fetchDashboard();
    });

    return () => {
      socket.off('analytics_active_users');
      socket.off('analytics_cart_add');
      socket.off('trends_update');
    };
  }, []);

  return (
    <div className="live-analytics-dashboard py-80 bg-gray-900 text-white min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container container-lg">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-between mb-48"
        >
          <div>
            <h2 className="text-white mb-8">Valkey Live Intelligence</h2>
            <p className="text-gray-400">Real-time platform analytics powered by Valkey Streams & Pub/Sub</p>
          </div>
          <div className="flex-align gap-16 bg-gray-800 p-16 rounded-16 border border-gray-700">
            <span className="position-relative flex-center">
               <span className="w-12 h-12 bg-success-600 rounded-circle absolute" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
               <span className="w-12 h-12 bg-success-600 rounded-circle relative z-10"></span>
            </span>
            <span className="text-xl fw-semibold">{activeUsers} <span className="text-gray-400 text-md fw-normal">Live Users</span></span>
          </div>
        </motion.div>

        <div className="row gy-4 mb-48">
          {[
            { title: "Total Revenue", value: `$${dashboardData.totalRevenue}`, icon: <DollarSign size={24} className="text-primary-500" /> },
            { title: "Active Carts", value: dashboardData.totalCartAdds, icon: <ShoppingCart size={24} className="text-warning-500" /> },
            { title: "Total Orders", value: dashboardData.totalOrders, icon: <Activity size={24} className="text-success-500" /> },
            { title: "Live Visitors", value: activeUsers, icon: <Users size={24} className="text-danger-500" /> },
          ].map((stat, i) => (
            <div className="col-xl-3 col-sm-6" key={i}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 p-24 rounded-16 border border-gray-700 hover-border-main-600 transition-2"
              >
                <div className="flex-between mb-16">
                  <span className="text-gray-400 text-md">{stat.title}</span>
                  <div className="w-48 h-48 flex-center rounded-circle bg-gray-900 border border-gray-700">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-white mb-0">{stat.value}</h3>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="row gy-4">
          <div className="col-lg-8">
             <div className="bg-gray-800 p-24 rounded-16 border border-gray-700 h-100">
                <h5 className="text-white mb-24 flex-align gap-8"><Activity size={20} className="text-main-500"/> Live Traffic (Socket.io)</h5>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart data={liveTraffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis stroke="#4b5563" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                      <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
          <div className="col-lg-4">
             <div className="bg-gray-800 p-24 rounded-16 border border-gray-700 h-100">
                <h5 className="text-white mb-24 flex-align gap-8"><TrendingUp size={20} className="text-warning-500"/> Trending Now (Valkey ZSet)</h5>
                <div className="d-flex flex-column gap-16">
                   {dashboardData.topTrending && dashboardData.topTrending.map((prod, i) => (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={prod.id} 
                        className="flex-align gap-16 p-12 bg-gray-900 rounded-8 border border-gray-700"
                      >
                         <img src={prod.images?.[0] || '/assets/images/thumbs/product-two-img1.png'} className="w-48 h-48 rounded-4 object-fit-cover" alt="product" />
                         <div className="flex-grow-1">
                           <h6 className="text-white text-md mb-4 text-line-1">{prod.name}</h6>
                           <span className="text-main-500 fw-semibold">${prod.price}</span>
                         </div>
                         <div className="flex-align flex-column gap-4 text-end">
                           <span className="text-warning-500 text-xs flex-align gap-4"><TrendingUp size={14}/> {prod.views} views</span>
                         </div>
                      </motion.div>
                   ))}
                   {(!dashboardData.topTrending || dashboardData.topTrending.length === 0) && (
                     <p className="text-gray-400">No trending data yet.</p>
                   )}
                </div>
             </div>
          </div>
        </div>

      </div>
      
      {/* Global ping animation for online dot */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveAnalytics;
