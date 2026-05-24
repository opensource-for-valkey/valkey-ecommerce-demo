import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../helper/Preloader';
import HeaderTwo from '../components/HeaderTwo';
import Breadcrumb from '../components/Breadcrumb';
import FooterTwo from '../components/FooterTwo';
import ColorInit from '../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import ThemeToggle from '../components/ThemeToggle';
import { getValkeyDashboard, subscribeValkeyStream } from '../services/valkeyApi';
import '../styles/valkey-dashboard.scss';

const EVENT_LABELS = {
  CONVERSATION_GET: 'Read conversation (JSON.GET)',
  CONVERSATION_SET: 'Save conversation (JSON.SET)',
  CACHE_GET_HIT: 'Cache hit (GET)',
  CACHE_GET_MISS: 'Cache miss (GET)',
  CACHE_SET: 'Write search cache (SETEX)',
  SEARCH_LIVE: 'Live product search',
  FEEDBACK_SET: 'Store feedback (JSON.SET)',
  PREFERENCES_GET: 'Read preferences',
  PREFERENCES_SET: 'Write preferences'
};

function StatCard({ label, value, accent }) {
  return (
    <div className={`valkey-stat-card ${accent ? 'valkey-stat-card--accent' : ''}`}>
      <p className='valkey-stat-label'>{label}</p>
      <p className='valkey-stat-value'>{value}</p>
    </div>
  );
}

const ValkeyDashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    getValkeyDashboard()
      .then(setData)
      .catch((e) => setError(e.message));

    const unsubscribe = subscribeValkeyStream(
      (payload) => {
        setData(payload);
        setLive(true);
        setError(null);
      },
      () => setLive(false)
    );

    return unsubscribe;
  }, []);

  const stats = data?.stats || {};
  const events = data?.recentEvents || [];
  const keyCounts = data?.keyCounts || {};

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color='#FA6400' />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title='Valkey Live Monitor' />

      <section className='valkey-dashboard valkey-dashboard--themed py-40'>
        <div className='container container-lg'>
          <div className='valkey-dashboard-header flex-between flex-wrap gap-16 mb-32'>
            <div>
              <h4 className='mb-8 flex-align gap-8'>
                <i className='ph ph-database text-main-600' />
                Valkey utilization
              </h4>
              <p className='text-sm text-gray-600 mb-0'>
                Real-time proof that the agent reads/writes Valkey — not a static
                database. Updates every 2 seconds.
              </p>
            </div>
            <div className='flex-align gap-12 flex-wrap'>
              <ThemeToggle showLabel />
              <span
                className={`valkey-live-pill ${
                  data?.connected ? 'valkey-live-pill--on' : ''
                }`}
              >
                <span className='valkey-live-dot' />
                {data?.connected ? 'Valkey connected' : 'Disconnected'}
              </span>
              <span
                className={`valkey-live-pill ${
                  live ? 'valkey-live-pill--on' : ''
                }`}
              >
                {live ? 'SSE stream active' : 'Polling…'}
              </span>
              <Link to='/' className='btn btn-main rounded-pill text-sm'>
                Back to store
              </Link>
            </div>
          </div>

          {error && (
            <div className='alert alert-danger mb-24'>
              {error} — ensure backend + Valkey are running.
            </div>
          )}

          <div className='valkey-stat-grid mb-32'>
            <StatCard label='Total Valkey ops' value={stats.totalCommands ?? 0} accent />
            <StatCard label='Conversations saved' value={stats.conversationWrites ?? 0} />
            <StatCard label='Conversations loaded' value={stats.conversationReads ?? 0} />
            <StatCard label='Live searches' value={stats.searchRuns ?? 0} />
            <StatCard label='Cache writes' value={stats.cacheWrites ?? 0} />
            <StatCard
              label='Cache hit rate'
              value={`${stats.cacheHitRatePercent ?? 0}%`}
            />
          </div>

          <div className='row g-24 valkey-layout'>
            <div className='col-lg-4'>
              <div className='valkey-sidebar'>
                <div className='valkey-panel valkey-panel--keys'>
                  <h6 className='mb-16'>Keys in Valkey</h6>
                  <ul className='valkey-key-list'>
                    {Object.entries(keyCounts).map(([k, v]) => (
                      <li key={k}>
                        <span>{k}</span>
                        <strong>{v}</strong>
                      </li>
                    ))}
                  </ul>
                  {data?.serverInfo && (
                    <div className='mt-20 pt-16 border-top'>
                      <p className='text-xs text-gray-500 mb-4'>Memory</p>
                      <p className='text-sm mb-0'>
                        Used: {data.serverInfo.usedMemoryHuman}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='col-lg-8'>
              <div className='valkey-panel valkey-panel--log'>
                <h6 className='mb-8'>Live operation log</h6>
                <p className='text-xs text-gray-500 mb-16'>
                  Each chat message triggers CONVERSATION_GET → SEARCH_LIVE →
                  CONVERSATION_SET. Open the assistant and send a query to see
                  new rows appear here.
                </p>
                <div className='valkey-event-log flex-grow-1'>
                  {events.length === 0 && (
                    <p className='text-sm text-gray-500 text-center py-24'>
                      No events yet. Send a message in the AI assistant.
                    </p>
                  )}
                  {events.map((ev) => (
                    <div key={ev.id} className='valkey-event-row'>
                      <span className='valkey-event-time'>
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`valkey-event-type valkey-event-type--${(
                          ev.type || ''
                        ).toLowerCase()}`}
                      >
                        {EVENT_LABELS[ev.type] || ev.type}
                      </span>
                      <span className='valkey-event-key' title={ev.key}>
                        {ev.key}
                      </span>
                      {ev.ms != null && (
                        <span className='valkey-event-ms'>{ev.ms}ms</span>
                      )}
                      {ev.resultCount != null && (
                        <span className='valkey-event-meta'>
                          {ev.resultCount} hits
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='valkey-patterns-section'>
            <div className='valkey-panel valkey-panel--patterns'>
              <h6 className='mb-12'>Key patterns (Challenge 14)</h6>
              <p className='text-xs text-gray-500 mb-16'>
                Valkey data structures used by the agentic search pipeline.
              </p>
              <ul className='valkey-pattern-list text-sm'>
                {data?.keyPatterns &&
                  Object.entries(data.keyPatterns).map(([k, v]) => (
                    <li key={k}>
                      <code>{k}</code>
                      <span>{v}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <p className='text-xs text-gray-500 mt-24 mb-0'>
            Updated:{' '}
            {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}
          </p>
        </div>
      </section>

      <FooterTwo />
    </>
  );
};

export default ValkeyDashboardPage;
