import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9);
}

const VoiceChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your VoiceCart AI assistant. Ask me about products, your cart, or orders. You can type or click the mic to speak!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, session_id: sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response || 'No response received.', timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not connect to the server. Please make sure the backend is running.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Google Chrome.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const quickActions = [
    'Show trending products',
    "What's in my cart?",
    'Find health supplements',
    'Recommend something',
    'Place my order',
  ];

  return (
    <section className="voice-chat py-80">
      <div className="container container-lg">
        <div className="row justify-content-center">
          <div className="col-xl-10">

            {/* Chat Window */}
            <div
              className="border border-gray-100 rounded-16 overflow-hidden"
              style={{ height: '68vh', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              {/* Header */}
              <div
                className="px-24 py-16 d-flex align-items-center gap-12"
                style={{ background: '#FA6400' }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-white"
                  style={{ width: 40, height: 40, flexShrink: 0 }}
                >
                  <i className="ph ph-robot" style={{ fontSize: 22, color: '#FA6400' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-white mb-0" style={{ fontSize: 16 }}>VoiceCart AI Assistant</h6>
                  <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                    Products · Cart · Orders
                  </p>
                </div>
                {listening && (
                  <div
                    className="d-flex align-items-center gap-6 px-12 py-6 rounded-pill"
                    style={{ background: '#dc3545', fontSize: 12, color: 'white', fontWeight: 600 }}
                  >
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: '50%', background: 'white',
                        display: 'inline-block', animation: 'vcPulse 1s infinite',
                      }}
                    />
                    Listening...
                  </div>
                )}
                <Link
                  to="/voice-auth"
                  className="d-flex align-items-center gap-6 px-12 py-6 rounded-pill text-white"
                  style={{ background: 'rgba(255,255,255,0.2)', fontSize: 12, textDecoration: 'none' }}
                >
                  <i className="ph ph-shield-check" style={{ fontSize: 14 }} />
                  Voice Auth
                </Link>
              </div>

              {/* Messages */}
              <div
                className="flex-grow-1 overflow-auto px-24 py-20"
                style={{ background: '#f8f9fa' }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`d-flex mb-16 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle me-10"
                        style={{ width: 32, height: 32, background: '#FA6400', flexShrink: 0, marginTop: 2 }}
                      >
                        <i className="ph ph-robot" style={{ fontSize: 16, color: 'white' }} />
                      </div>
                    )}
                    <div style={{ maxWidth: '72%' }}>
                      <div
                        className="px-16 py-12 rounded-16"
                        style={{
                          background: msg.role === 'user' ? '#FA6400' : 'white',
                          color: msg.role === 'user' ? 'white' : '#1a1a1a',
                          border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.6,
                          fontSize: 14,
                          borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        }}
                      >
                        {msg.content}
                      </div>
                      <p
                        className={`mb-0 mt-4 ${msg.role === 'user' ? 'text-end' : ''}`}
                        style={{ color: '#9ca3af', fontSize: 11 }}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle ms-10"
                        style={{ width: 32, height: 32, background: '#FA6400', flexShrink: 0, marginTop: 2 }}
                      >
                        <i className="ph ph-user" style={{ fontSize: 16, color: 'white' }} />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="d-flex mb-16 justify-content-start">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-10"
                      style={{ width: 32, height: 32, background: '#FA6400', flexShrink: 0 }}
                    >
                      <i className="ph ph-robot" style={{ fontSize: 16, color: 'white' }} />
                    </div>
                    <div
                      className="px-16 py-12 rounded-16"
                      style={{ background: 'white', border: '1px solid #e5e7eb' }}
                    >
                      <div className="d-flex gap-6 align-items-center" style={{ height: 20 }}>
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            style={{
                              width: 8, height: 8, borderRadius: '50%', background: '#FA6400',
                              display: 'inline-block',
                              animation: `vcBounce 1.2s ${i * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div
                className="px-20 py-14"
                style={{ background: 'white', borderTop: '1px solid #e5e7eb' }}
              >
                <div className="d-flex gap-10 align-items-end">
                  <textarea
                    ref={textareaRef}
                    className="flex-grow-1"
                    rows={1}
                    placeholder={listening ? 'Listening... speak now' : 'Type a message or click mic to speak...'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading || listening}
                    style={{
                      resize: 'none',
                      border: '1px solid #e5e7eb',
                      borderRadius: 12,
                      padding: '10px 14px',
                      fontSize: 14,
                      outline: 'none',
                      minHeight: 44,
                      lineHeight: 1.5,
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#FA6400')}
                    onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                  />

                  {/* Mic button */}
                  <button
                    onClick={toggleMic}
                    disabled={loading}
                    title={listening ? 'Stop listening' : 'Click to speak'}
                    style={{
                      width: 44, height: 44, borderRadius: 12, border: 'none',
                      background: listening ? '#dc3545' : '#fff3e8',
                      color: listening ? 'white' : '#FA6400',
                      fontSize: 20, flexShrink: 0, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: listening ? '0 0 0 4px rgba(220,53,69,0.2)' : 'none',
                    }}
                  >
                    <i className={`ph ph-${listening ? 'stop-circle' : 'microphone'}`} />
                  </button>

                  {/* Send button */}
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    style={{
                      width: 44, height: 44, borderRadius: 12, border: 'none',
                      background: input.trim() && !loading ? '#FA6400' : '#e5e7eb',
                      color: input.trim() && !loading ? 'white' : '#9ca3af',
                      fontSize: 20, flexShrink: 0, cursor: input.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <i className="ph ph-paper-plane-tilt" />
                  </button>
                </div>
                <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 6, marginBottom: 0 }}>
                  Enter to send &middot; Shift+Enter for new line &middot; Mic for voice input
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-20">
              <p className="fw-medium mb-10" style={{ color: '#6b7280', fontSize: 13 }}>Try asking:</p>
              <div className="d-flex flex-wrap gap-8">
                {quickActions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 20,
                      padding: '6px 16px',
                      fontSize: 13,
                      background: 'white',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#FA6400';
                      e.target.style.color = '#FA6400';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.color = '#374151';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vcPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes vcBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
    </section>
  );
};

export default VoiceChat;
