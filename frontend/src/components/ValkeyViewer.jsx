import React, { useState, useEffect } from 'react';

const ValkeyViewer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dbData, setDbData] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchValkeyData = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/api/valkey/keys');
            if (res.ok) {
                const data = await res.json();
                setDbData(data);
                if (data.keys && Object.keys(data.keys).length > 0 && !selectedKey) {
                    setSelectedKey(Object.keys(data.keys)[0]);
                }
            }
        } catch (err) {
            console.error("Valkey Viewer: Failed to query database keys:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchValkeyData();

        // Listen for internal state changes to refresh instantly
        window.addEventListener('valkey-db-updated', fetchValkeyData);
        
        // Polling fallback to keep it live
        const interval = setInterval(fetchValkeyData, 4000);

        return () => {
            window.removeEventListener('valkey-db-updated', fetchValkeyData);
            clearInterval(interval);
        };
    }, []);

    const handleClearValkey = async () => {
        if (window.confirm("Are you sure you want to flush all carts from the database?")) {
            try {
                // Fetch the guest cart key to clear it specifically
                const guestId = localStorage.getItem('valkey_guest_user_id');
                if (guestId) {
                    await fetch(`http://localhost:8000/api/cart?userId=${encodeURIComponent(guestId)}`, {
                        method: 'DELETE'
                    });
                    setSelectedKey(null);
                    fetchValkeyData();
                    window.location.reload(); // Refresh the page to sync front-end state
                }
            } catch (err) {
                console.error("Failed to flush Valkey:", err);
            }
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            fontFamily: "'Courier New', Courier, monospace",
            userSelect: 'none'
        }}>
            {/* Pulsing Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn border-0 shadow-lg flex-align gap-8"
                    style={{
                        background: 'linear-gradient(135deg, #FF4500 0%, #FF1493 100%)',
                        color: 'white',
                        padding: '14px 24px',
                        borderRadius: '30px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        boxShadow: '0 8px 32px rgba(255, 20, 147, 0.4)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 20, 147, 0.6)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 20, 147, 0.4)';
                    }}
                >
                    <i className="ph ph-database" style={{ fontSize: '18px' }} />
                    VALKEY LIVE DB ({dbData?.active_keys || 0})
                </button>
            )}

            {/* Expended Panel */}
            {isOpen && (
                <div style={{
                    width: '600px',
                    height: '420px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    color: '#38BDF8' // Beautiful sky blue terminal text
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#10B981',
                                boxShadow: '0 0 10px #10B981'
                            }} />
                            <span style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.5px', color: '#F8FAFC' }}>
                                VALKEY CONSOLE MONITOR
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={fetchValkeyData}
                                className="border-0 bg-transparent"
                                style={{ color: '#94A3B8', cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseOver={(e) => e.target.style.color = '#38BDF8'}
                                onMouseOut={(e) => e.target.style.color = '#94A3B8'}
                                title="Sync Database"
                            >
                                <i className="ph ph-arrows-counter-clockwise" style={{ fontSize: '18px' }} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="border-0 bg-transparent"
                                style={{ color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}
                                title="Close Panel"
                            >
                                <i className="ph ph-x" style={{ fontSize: '18px' }} />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        {/* Sidebar: Keys List */}
                        <div style={{
                            width: '240px',
                            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                            padding: '12px',
                            background: 'rgba(15, 23, 42, 0.4)'
                        }}>
                            <div style={{
                                fontSize: '11px',
                                color: '#64748B',
                                marginBottom: '10px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Active Keys ({dbData?.active_keys || 0})
                            </div>
                            
                            {(!dbData || Object.keys(dbData.keys).length === 0) ? (
                                <div style={{ color: '#64748B', fontSize: '12px', padding: '10px 4px' }}>
                                    No active keys in Valkey. Add items to your cart!
                                </div>
                            ) : (
                                Object.keys(dbData.keys).map((k) => {
                                    const details = dbData.keys[k];
                                    const isSelected = selectedKey === k;
                                    return (
                                        <div
                                            key={k}
                                            onClick={() => setSelectedKey(k)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                marginBottom: '6px',
                                                background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                                color: isSelected ? '#38BDF8' : '#94A3B8',
                                                border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isSelected) e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <i className="ph ph-file-code" style={{ marginRight: '6px' }} />
                                            {k}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Detail Panel: Value Viewer */}
                        <div style={{
                            flex: 1,
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            background: '#0B0F19'
                        }}>
                            {selectedKey && dbData?.keys[selectedKey] ? (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {/* Key Details */}
                                    <div style={{ marginBottom: '12px', fontSize: '11px', color: '#94A3B8' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span><strong>Type:</strong> <span style={{ color: '#E2E8F0', textTransform: 'uppercase' }}>{dbData.keys[selectedKey].type}</span></span>
                                            <span><strong>TTL:</strong> <span style={{ color: '#E2E8F0' }}>{dbData.keys[selectedKey].ttl}s</span></span>
                                        </div>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#38BDF8', fontWeight: 'bold' }}>
                                            {selectedKey}
                                        </div>
                                    </div>
                                    {/* Pretty JSON viewer */}
                                    <pre style={{
                                        flex: 1,
                                        overflow: 'auto',
                                        background: 'rgba(15, 23, 42, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.03)',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        margin: 0,
                                        fontSize: '11px',
                                        lineHeight: '1.5',
                                        color: '#34D399', // Emerald terminal content
                                    }}>
                                        {JSON.stringify(dbData.keys[selectedKey].data, null, 2)}
                                    </pre>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: '#64748B',
                                    textAlign: 'center',
                                    padding: '20px'
                                }}>
                                    <i className="ph ph-cpu text-4xl mb-12" style={{ fontSize: '32px', color: '#334155' }} />
                                    <span style={{ fontSize: '12px' }}>
                                        Select a key from the database tree to inspect stored data in Valkey in real-time.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{
                        padding: '12px 20px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '10px', color: '#64748B' }}>
                            Status: CONNECTED TO VALKEY
                        </span>
                        <button
                            type="button"
                            onClick={handleClearValkey}
                            className="btn border-0 py-4 px-12 text-xs text-white rounded-4"
                            style={{
                                background: '#EF4444',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                letterSpacing: '0.5px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                        >
                            Flush Valkey DB
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValkeyViewer;
