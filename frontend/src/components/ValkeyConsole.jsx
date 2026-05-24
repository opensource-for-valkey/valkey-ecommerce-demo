import React, { useState, useEffect, useRef } from 'react';
const ValkeyConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' or 'subsystems'
  
  // Database Telemetry State
  const [isConnected, setIsConnected] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const [memoryUsed, setMemoryUsed] = useState('0B');
  const [connections, setConnections] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const terminalEndRef = useRef(null);
  const API_URL = 'http://localhost:5000/api/auth/valkey-stats';

  // Fetch stats from Valkey backend
  const fetchStats = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setKeyCount(data.dbSize);
        setMemoryUsed(data.usedMemory);
        setConnections(data.connectedClients);
        setLogs(data.liveLogs);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  // Poll database stats every 2 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal to top (newest commands appear at the top in authController, but we can display chronologically by reversing or standard list)
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Checklist of Hackathon challenges
  const challenges = [
    { name: 'User Authentication', desc: 'JSON user profiles & session TTL', status: 'complete', code: '🟢 ACTIVE' },
    { name: 'Product Catalog', desc: 'JSON catalog index & fast lookups', status: 'mocked', code: '🟡 MOCKED' },
    { name: 'Shopping Cart', desc: 'Persistent user cart with Hashmaps', status: 'mocked', code: '🟡 MOCKED' },
    { name: 'Trending Products', desc: 'Weighted scoring via Sorted Sets', status: 'mocked', code: '🟡 MOCKED' },
    { name: 'Faceted & Fuzzy Search', desc: 'Valkey full-text index query', status: 'mocked', code: '🟡 MOCKED' },
    { name: 'Vector Semantic Search', desc: 'KNN search via Valkey HNSW', status: 'mocked', code: '🟡 MOCKED' },
  ];

  return (
    <>
      {/* Scope CSS Rules inside a self-contained Style Tag */}
      <style>{`
        /* Launcher Floating Action Button */
        .valkey-hud-launcher {
          position: fixed;
          bottom: 30px;
          left: 30px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e1e2f 0%, #0d0d13 100%);
          border: 2px solid rgba(229, 46, 45, 0.4);
          box-shadow: 0 0 20px rgba(229, 46, 45, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.05);
          cursor: pointer;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .valkey-hud-launcher:hover {
          transform: scale(1.1) rotate(5deg);
          border-color: #e52e2d;
          box-shadow: 0 0 30px rgba(229, 46, 45, 0.6);
        }
        .valkey-hud-launcher-active {
          transform: scale(0.9) rotate(-10deg) !important;
          border-color: #39e660 !important;
          box-shadow: 0 0 30px rgba(57, 230, 96, 0.6) !important;
        }

        /* Launcher glowing rings */
        .valkey-hud-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #1e1e2f;
          box-shadow: 0 0 8px rgba(0,0,0,0.5);
        }
        .valkey-indicator-connected {
          background-color: #39e660;
          box-shadow: 0 0 10px #39e660;
        }
        .valkey-indicator-disconnected {
          background-color: #ff9f1a;
          box-shadow: 0 0 10px #ff9f1a;
          animation: valkeyPulse 1.5s infinite alternate;
        }

        /* Database disk graphic */
        .valkey-db-icon {
          font-size: 26px;
          color: #e52e2d;
          transition: color 0.3s ease;
        }
        .valkey-hud-launcher-active .valkey-db-icon {
          color: #39e660;
        }

        /* Expanded HUD Glassmorphic Console Dashboard Panel */
        .valkey-hud-panel {
          position: fixed;
          bottom: 110px;
          left: 30px;
          width: 440px;
          height: 520px;
          border-radius: 20px;
          background: rgba(13, 13, 22, 0.75);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.02);
          z-index: 99998;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          transform: translateY(30px) scale(0.95);
          opacity: 0;
          pointer-events: none;
          color: #e0e0e6;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .valkey-hud-panel-open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: auto;
        }

        /* Header Console */
        .valkey-hud-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .valkey-hud-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #e52e2d, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Close panel button */
        .valkey-hud-close {
          background: transparent;
          border: none;
          color: #8c8c9e;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .valkey-hud-close:hover {
          color: #ffffff;
        }

        /* Metrics grid */
        .valkey-hud-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.15);
        }
        .valkey-metric-card {
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          text-align: center;
        }
        .valkey-metric-label {
          font-size: 10px;
          color: #8c8c9e;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .valkey-metric-value {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          font-family: monospace;
        }

        /* Navigation Tab bars */
        .valkey-hud-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .valkey-hud-tab {
          flex: 1;
          padding: 10px 0;
          background: transparent;
          border: none;
          color: #8c8c9e;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .valkey-hud-tab-active {
          color: #e52e2d;
          border-bottom-color: #e52e2d;
          background: rgba(255, 255, 255, 0.01);
        }

        /* Content panels */
        .valkey-hud-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        /* Terminal Logs List */
        .valkey-terminal {
          flex: 1;
          padding: 14px 20px;
          background: rgba(5, 5, 8, 0.95);
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.5;
          overflow-y: auto;
          display: flex;
          flex-direction: column-reverse;
          gap: 6px;
        }
        .valkey-terminal::-webkit-scrollbar {
          width: 5px;
        }
        .valkey-terminal::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .valkey-terminal::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .valkey-log-row {
          word-break: break-all;
        }
        .valkey-log-time {
          color: #58a6ff;
          margin-right: 8px;
        }
        .valkey-log-cmd {
          color: #39e660;
        }

        /* Subsystem checklist */
        .valkey-subsystems {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .valkey-subsystem-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .valkey-subsystem-info {
          display: flex;
          flex-direction: column;
        }
        .valkey-subsystem-name {
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
        }
        .valkey-subsystem-desc {
          font-size: 10px;
          color: #8c8c9e;
        }
        .valkey-subsystem-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 30px;
          letter-spacing: 0.5px;
          background: rgba(255, 255, 255, 0.05);
        }
        .valkey-badge-complete {
          background: rgba(57, 230, 96, 0.1) !important;
          color: #39e660 !important;
          border: 1px solid rgba(57, 230, 96, 0.2);
        }
        .valkey-badge-mocked {
          background: rgba(255, 159, 26, 0.1) !important;
          color: #ff9f1a !important;
          border: 1px solid rgba(255, 159, 26, 0.2);
        }

        /* Keyframes */
        @keyframes valkeyPulse {
          0% {
            transform: scale(0.9);
            box-shadow: 0 0 5px #ff9f1a;
          }
          100% {
            transform: scale(1.1);
            box-shadow: 0 0 15px #ff9f1a;
          }
        }
      `}</style>

      {/* Floating DB Launcher Button */}
      <div 
        className={`valkey-hud-launcher ${isOpen ? 'valkey-hud-launcher-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Open Valkey Database Telemetry HUD"
      >
        <span className={`valkey-hud-indicator ${isConnected ? 'valkey-indicator-connected' : 'valkey-indicator-disconnected'}`} />
        <img 
          src="/assets/images/logo/valkey-logo.png" 
          alt="Valkey Logo" 
          className="valkey-db-icon" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
        />
      </div>

      {/* Futuristic Glassmorphic Panel HUD */}
      <div className={`valkey-hud-panel ${isOpen ? 'valkey-hud-panel-open' : ''}`}>
        
        {/* Panel Header */}
        <div className="valkey-hud-header">
          <div className="valkey-hud-title">
            <img 
              src="/assets/images/logo/valkey-logo.png" 
              alt="Valkey Logo" 
              style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
            />
            Valkey Database Telemetry
          </div>
          <button className="valkey-hud-close" onClick={() => setIsOpen(false)}>
            <i className="ph ph-x" />
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="valkey-hud-metrics">
          <div className="valkey-metric-card">
            <div className="valkey-metric-label">DB Size</div>
            <div className="valkey-metric-value">{isConnected ? `${keyCount} keys` : 'offline'}</div>
          </div>
          <div className="valkey-metric-card">
            <div className="valkey-metric-label">Memory</div>
            <div className="valkey-metric-value">{isConnected ? memoryUsed : 'offline'}</div>
          </div>
          <div className="valkey-metric-card">
            <div className="valkey-metric-label">Clients</div>
            <div className="valkey-metric-value">{isConnected ? connections : 'offline'}</div>
          </div>
        </div>

        {/* Console Navigation Tab Bar */}
        <div className="valkey-hud-tabs">
          <button 
            className={`valkey-hud-tab ${activeTab === 'telemetry' ? 'valkey-hud-tab-active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            Live Command logs
          </button>
          <button 
            className={`valkey-hud-tab ${activeTab === 'subsystems' ? 'valkey-hud-tab-active' : ''}`}
            onClick={() => setActiveTab('subsystems')}
          >
            Challenge Tracker
          </button>
        </div>

        {/* Dynamic Panels */}
        <div className="valkey-hud-content">
          
          {/* Tab 1: Live Command logs terminal */}
          {activeTab === 'telemetry' && (
            <div className="valkey-terminal">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div className="valkey-log-row" key={index}>
                    <span className="valkey-log-time">[{log.timestamp}]</span>
                    <span className="valkey-log-cmd">&gt; {log.command}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#8c8c9e', textAlign: 'center', marginTop: '100px' }}>
                  No database command logs recorded yet.<br />
                  <span style={{ fontSize: '10px', color: '#58a6ff' }}>Perform registrations or logins to stream logs!</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          )}

          {/* Tab 2: Challenge tracker checklists */}
          {activeTab === 'subsystems' && (
            <div className="valkey-subsystems">
              {challenges.map((c, i) => (
                <div className="valkey-subsystem-row" key={i}>
                  <div className="valkey-subsystem-info">
                    <div className="valkey-subsystem-name">{c.name}</div>
                    <div className="valkey-subsystem-desc">{c.desc}</div>
                  </div>
                  <div className={`valkey-subsystem-badge valkey-badge-${c.status}`}>
                    {c.code}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default ValkeyConsole;
