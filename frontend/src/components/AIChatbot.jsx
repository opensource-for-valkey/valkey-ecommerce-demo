import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/aiAPI';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hey! 👋 I'm your shopping buddy. I can help you find deals, track prices, check stock, navigate the store, or recommend products. What's on your mind?", products: [] }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const data = await aiAPI.chat(userMsg, sessionId);
            if (data.sessionId) setSessionId(data.sessionId);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response.text,
                products: data.response.products || []
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting. Please try again!",
                products: []
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        "What's on sale?",
        "Show bestsellers",
        "Bundle deals",
        "Low stock alerts",
        "Help me navigate",
        "Track my order"
    ];

    return (
        <>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="chatbot-toggle"
                    aria-label="Open AI Assistant"
                >
                    <i className="ph-fill ph-robot" />
                    <span className="chatbot-toggle__pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot">
                    {/* Header */}
                    <div className="chatbot__header">
                        <div className="d-flex align-items-center gap-12">
                            <div className="chatbot__avatar">
                                <i className="ph-fill ph-robot" />
                            </div>
                            <div>
                                <h6 className="text-white text-sm fw-bold mb-0">Shopping Buddy</h6>
                                <span className="text-xs" style={{ color: '#4ade80' }}>● Always here to help</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="chatbot__close">
                            <i className="ph ph-x" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot__messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chatbot__msg chatbot__msg--${msg.role}`}>
                                {msg.role === 'assistant' && (
                                    <div className="chatbot__msg-avatar">
                                        <i className="ph-fill ph-robot" />
                                    </div>
                                )}
                                <div className="chatbot__msg-bubble">
                                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="chatbot__products">
                                            {msg.products.map((product, j) => (
                                                <Link key={j} to="/product-details" className="chatbot__product-card">
                                                    <span className="chatbot__product-name">{product.name}</span>
                                                    <span className="chatbot__product-price">${product.price}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="chatbot__msg chatbot__msg--assistant">
                                <div className="chatbot__msg-avatar"><i className="ph-fill ph-robot" /></div>
                                <div className="chatbot__msg-bubble chatbot__typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 2 && (
                        <div className="chatbot__quick">
                            {quickActions.map((action, i) => (
                                <button key={i} onClick={() => { setInput(action); }} className="chatbot__quick-btn">
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSend} className="chatbot__input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !input.trim()}>
                            <i className="ph-fill ph-paper-plane-tilt" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
