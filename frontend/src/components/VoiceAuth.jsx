import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

const VoiceAuth = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState('enroll');
  const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null | 'enrolled' | 'not_enrolled' | 'error'
  const [statusLoading, setStatusLoading] = useState(false);

  // Enroll state
  const [enrollRecording, setEnrollRecording] = useState(false);
  const [enrollAudio, setEnrollAudio] = useState(null);
  const [enrollAudioUrl, setEnrollAudioUrl] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollResult, setEnrollResult] = useState(null);

  // Verify state
  const [verifyRecording, setVerifyRecording] = useState(false);
  const [verifyAudio, setVerifyAudio] = useState(null);
  const [verifyAudioUrl, setVerifyAudioUrl] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const enrollRecorderRef = useRef(null);
  const verifyRecorderRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const checkStatus = async () => {
    if (!userId.trim()) return;
    setStatusLoading(true);
    setEnrollmentStatus(null);
    try {
      const res = await fetch(`${API_BASE}/api/voice/status?user_id=${encodeURIComponent(userId.trim())}`);
      const data = await res.json();
      setEnrollmentStatus(data.enrolled ? 'enrolled' : 'not_enrolled');
    } catch {
      setEnrollmentStatus('error');
    } finally {
      setStatusLoading(false);
    }
  };

  const startRecording = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        if (type === 'enroll') {
          setEnrollAudio(blob);
          setEnrollAudioUrl(url);
          setEnrollResult(null);
          setEnrollRecording(false);
        } else {
          setVerifyAudio(blob);
          setVerifyAudioUrl(url);
          setVerifyResult(null);
          setVerifyRecording(false);
        }
        stream.getTracks().forEach((t) => t.stop());
      };

      if (type === 'enroll') {
        enrollRecorderRef.current = recorder;
        setEnrollRecording(true);
      } else {
        verifyRecorderRef.current = recorder;
        setVerifyRecording(true);
      }

      recorder.start();
    } catch {
      alert('Microphone access denied. Please allow microphone permissions and try again.');
    }
  };

  const stopRecording = (type) => {
    if (type === 'enroll') {
      enrollRecorderRef.current?.stop();
    } else {
      verifyRecorderRef.current?.stop();
    }
  };

  const handleEnroll = async () => {
    if (!userId.trim() || !enrollAudio) return;
    setEnrollLoading(true);
    setEnrollResult(null);
    try {
      const form = new FormData();
      form.append('audio_file', enrollAudio, 'voice.webm');
      form.append('user_id', userId.trim());
      const res = await fetch(`${API_BASE}/api/voice/enroll`, { method: 'POST', body: form });
      const data = await res.json();
      const success = data.status === 'enrolled' || data.status === 'success';
      setEnrollResult({ success, message: data.message || (success ? 'Voice enrolled successfully!' : 'Enrollment failed.') });
      if (success) setEnrollmentStatus('enrolled');
    } catch {
      setEnrollResult({ success: false, message: 'Network error. Is the backend running?' });
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!userId.trim() || !verifyAudio) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const form = new FormData();
      form.append('audio_file', verifyAudio, 'voice.webm');
      form.append('user_id', userId.trim());
      const res = await fetch(`${API_BASE}/api/voice/verify`, { method: 'POST', body: form });
      const data = await res.json();
      setVerifyResult({ verified: data.verified, score: data.score, message: data.message });
      if (data.verified) {
        showToast(`Welcome back, ${userId}! Voice verified ✓`);
        setTimeout(() => navigate('/voice-chat'), 1800);
      }
    } catch {
      setVerifyResult({ verified: false, score: 0, message: 'Network error. Is the backend running?' });
    } finally {
      setVerifyLoading(false);
    }
  };

  const MicButton = ({ type, recording, audio }) => {
    const isEnroll = type === 'enroll';
    return (
      <div className="d-flex flex-column align-items-center gap-16">
        <button
          onClick={() => recording ? stopRecording(type) : startRecording(type)}
          style={{
            width: 90, height: 90, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: recording ? '#dc3545' : '#FA6400',
            color: 'white', fontSize: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: recording
              ? '0 0 0 8px rgba(220,53,69,0.2), 0 4px 20px rgba(220,53,69,0.4)'
              : '0 0 0 8px rgba(250,100,0,0.1), 0 4px 20px rgba(250,100,0,0.3)',
            transition: 'all 0.3s',
            animation: recording ? 'vaPulseRing 1.5s infinite' : 'none',
          }}
        >
          <i className={`ph ph-${recording ? 'stop' : 'microphone'}`} />
        </button>

        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 0, textAlign: 'center' }}>
          {recording ? (
            <span style={{ color: '#dc3545', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc3545', display: 'inline-block', animation: 'vcPulse 1s infinite' }} />
              Recording... click to stop (min 3 sec)
            </span>
          ) : audio ? (
            <span style={{ color: '#16a34a', fontWeight: 600 }}>
              <i className="ph ph-check-circle" style={{ marginRight: 4 }} />
              Recording ready
            </span>
          ) : (
            'Click the mic to start recording'
          )}
        </p>

        {audio && !recording && (
          <audio
            controls
            src={isEnroll ? enrollAudioUrl : verifyAudioUrl}
            style={{ width: '100%', maxWidth: 280, borderRadius: 8 }}
          />
        )}
      </div>
    );
  };

  const statusColors = {
    enrolled: { bg: '#f0fdf4', border: '#86efac', icon: 'check-circle', iconColor: '#16a34a', text: `Voice enrolled for "${userId}"` },
    not_enrolled: { bg: '#fffbeb', border: '#fcd34d', icon: 'warning', iconColor: '#d97706', text: 'No voice enrolled — please enroll first' },
    error: { bg: '#fef2f2', border: '#fca5a5', icon: 'x-circle', iconColor: '#dc2626', text: 'Could not check enrollment status' },
  };

  return (
    <section className="voice-auth py-80">
      <div className="container container-lg">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">

            {/* Header */}
            <div className="text-center mb-40">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-16"
                style={{ width: 72, height: 72, background: '#fff3e8' }}
              >
                <i className="ph ph-shield-check" style={{ fontSize: 36, color: '#FA6400' }} />
              </div>
              <h4 className="mb-8">Voice Authentication</h4>
              <p style={{ color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
                Enroll your voice to secure your account, or verify your identity using voice biometrics.
              </p>
            </div>

            {/* User ID Card */}
            <div
              className="rounded-16 px-24 py-28 mb-24"
              style={{ border: '1px solid #e5e7eb', background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
            >
              <label className="fw-semibold mb-8 d-block" style={{ color: '#374151', fontSize: 14 }}>
                User ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="d-flex gap-12">
                <input
                  type="text"
                  className="common-input flex-grow-1"
                  placeholder="Enter your user ID (e.g. user_123)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkStatus()}
                />
                <button
                  onClick={checkStatus}
                  disabled={!userId.trim() || statusLoading}
                  style={{
                    padding: '0 20px', borderRadius: 10,
                    border: '2px solid #FA6400', background: 'white', color: '#FA6400',
                    fontWeight: 600, fontSize: 14, cursor: userId.trim() ? 'pointer' : 'default',
                    flexShrink: 0, transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (userId.trim()) { e.target.style.background = '#FA6400'; e.target.style.color = 'white'; } }}
                  onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#FA6400'; }}
                >
                  {statusLoading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'Check Status'
                  )}
                </button>
              </div>

              {enrollmentStatus && statusColors[enrollmentStatus] && (
                <div
                  className="d-flex align-items-center gap-10 mt-14 px-16 py-12 rounded-12"
                  style={{
                    background: statusColors[enrollmentStatus].bg,
                    border: `1px solid ${statusColors[enrollmentStatus].border}`,
                  }}
                >
                  <i
                    className={`ph ph-${statusColors[enrollmentStatus].icon}`}
                    style={{ fontSize: 18, color: statusColors[enrollmentStatus].iconColor, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                    {statusColors[enrollmentStatus].text}
                  </span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div
              className="rounded-16 overflow-hidden"
              style={{ border: '1px solid #e5e7eb', background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
            >
              {/* Tab Headers */}
              <div className="d-flex" style={{ borderBottom: '1px solid #e5e7eb' }}>
                {['enroll', 'verify'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1, padding: '16px 24px', border: 'none', cursor: 'pointer',
                      fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                      background: activeTab === tab ? '#FA6400' : 'white',
                      color: activeTab === tab ? 'white' : '#6b7280',
                    }}
                  >
                    <i className={`ph ph-${tab === 'enroll' ? 'user-plus' : 'shield-check'} me-8`} />
                    {tab === 'enroll' ? 'Enroll Voice' : 'Verify Voice'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="px-32 py-40">
                {activeTab === 'enroll' ? (
                  <div className="text-center">
                    <h6 style={{ fontSize: 18, marginBottom: 8 }}>Record Your Voice</h6>
                    <p style={{ color: '#6b7280', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                      Speak clearly for at least 3 seconds. Say your name, count to 10, or read a sentence.
                    </p>

                    <MicButton type="enroll" recording={enrollRecording} audio={enrollAudio} />

                    {enrollAudio && !enrollRecording && (
                      <div className="mt-28 d-flex flex-column align-items-center gap-12">
                        <button
                          onClick={handleEnroll}
                          disabled={enrollLoading || !userId.trim()}
                          style={{
                            padding: '13px 36px', borderRadius: 12, border: 'none',
                            background: enrollLoading || !userId.trim() ? '#e5e7eb' : '#FA6400',
                            color: enrollLoading || !userId.trim() ? '#9ca3af' : 'white',
                            fontWeight: 700, fontSize: 15, cursor: userId.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', gap: 8,
                          }}
                        >
                          {enrollLoading ? (
                            <><span className="spinner-border spinner-border-sm" /> Processing...</>
                          ) : (
                            <><i className="ph ph-floppy-disk" style={{ fontSize: 18 }} /> Save Voice Profile</>
                          )}
                        </button>
                        <button
                          onClick={() => { setEnrollAudio(null); setEnrollAudioUrl(null); setEnrollResult(null); }}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}
                        >
                          Re-record
                        </button>
                      </div>
                    )}

                    {enrollResult && (
                      <div
                        className="mt-20 px-20 py-14 rounded-12 d-flex align-items-center gap-10"
                        style={{
                          background: enrollResult.success ? '#f0fdf4' : '#fef2f2',
                          border: `1px solid ${enrollResult.success ? '#86efac' : '#fca5a5'}`,
                          maxWidth: 400, margin: '20px auto 0',
                        }}
                      >
                        <i
                          className={`ph ph-${enrollResult.success ? 'check-circle' : 'x-circle'}`}
                          style={{ fontSize: 22, color: enrollResult.success ? '#16a34a' : '#dc2626', flexShrink: 0 }}
                        />
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>
                          {enrollResult.message}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <h6 style={{ fontSize: 18, marginBottom: 8 }}>Verify Your Identity</h6>
                    <p style={{ color: '#6b7280', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                      Record your voice and we'll compare it against your enrolled voice profile.
                    </p>

                    <MicButton type="verify" recording={verifyRecording} audio={verifyAudio} />

                    {verifyAudio && !verifyRecording && (
                      <div className="mt-28 d-flex flex-column align-items-center gap-12">
                        <button
                          onClick={handleVerify}
                          disabled={verifyLoading || !userId.trim()}
                          style={{
                            padding: '13px 36px', borderRadius: 12, border: 'none',
                            background: verifyLoading || !userId.trim() ? '#e5e7eb' : '#FA6400',
                            color: verifyLoading || !userId.trim() ? '#9ca3af' : 'white',
                            fontWeight: 700, fontSize: 15, cursor: userId.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', gap: 8,
                          }}
                        >
                          {verifyLoading ? (
                            <><span className="spinner-border spinner-border-sm" /> Verifying...</>
                          ) : (
                            <><i className="ph ph-shield-check" style={{ fontSize: 18 }} /> Verify Identity</>
                          )}
                        </button>
                        <button
                          onClick={() => { setVerifyAudio(null); setVerifyAudioUrl(null); setVerifyResult(null); }}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}
                        >
                          Re-record
                        </button>
                      </div>
                    )}

                    {verifyResult && (
                      <div
                        className="mt-20 px-24 py-20 rounded-16"
                        style={{
                          background: verifyResult.verified ? '#f0fdf4' : '#fef2f2',
                          border: `1px solid ${verifyResult.verified ? '#86efac' : '#fca5a5'}`,
                          maxWidth: 400, margin: '20px auto 0',
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-10 mb-10">
                          <i
                            className={`ph ph-${verifyResult.verified ? 'shield-check' : 'shield-slash'}`}
                            style={{ fontSize: 36, color: verifyResult.verified ? '#16a34a' : '#dc2626' }}
                          />
                          <span style={{ fontWeight: 700, fontSize: 22, color: verifyResult.verified ? '#16a34a' : '#dc2626' }}>
                            {verifyResult.verified ? 'Identity Verified' : 'Not Verified'}
                          </span>
                        </div>
                        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: verifyResult.score !== undefined ? 12 : 0 }}>
                          {verifyResult.message}
                        </p>
                        {verifyResult.score !== undefined && (
                          <div>
                            <div className="d-flex justify-content-between mb-4" style={{ fontSize: 12, color: '#6b7280' }}>
                              <span>Similarity Score</span>
                              <span style={{ fontWeight: 600 }}>{(verifyResult.score * 100).toFixed(1)}%</span>
                            </div>
                            <div style={{ height: 8, borderRadius: 4, background: '#e5e7eb', overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.min(verifyResult.score * 100, 100)}%`,
                                  background: verifyResult.verified ? '#16a34a' : '#dc2626',
                                  borderRadius: 4,
                                  transition: 'width 0.6s ease',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer link */}
            <div className="mt-24 text-center">
              <Link
                to="/voice-chat"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', borderRadius: 12,
                  border: '2px solid #FA6400', color: '#FA6400', background: 'white',
                  fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FA6400'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#FA6400'; }}
              >
                <i className="ph ph-chat-circle-dots" style={{ fontSize: 18 }} />
                Go to Voice Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'success' ? '#16a34a' : '#dc2626',
          color: 'white', padding: '14px 28px', borderRadius: 14,
          fontWeight: 600, fontSize: 15, zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          animation: 'toastIn 0.3s ease',
          whiteSpace: 'nowrap',
        }}>
          <i className={`ph ph-${toast.type === 'success' ? 'check-circle' : 'x-circle'}`} style={{ fontSize: 20 }} />
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes vcPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes vaPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(220,53,69,0.4); }
          70% { box-shadow: 0 0 0 16px rgba(220,53,69,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,53,69,0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default VoiceAuth;
