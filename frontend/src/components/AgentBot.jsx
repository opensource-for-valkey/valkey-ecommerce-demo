import React, { useState, useEffect, useRef } from 'react';

function generateSessionId() {
  const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const AgentBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let sid = localStorage.getItem('valkey_agent_session');
    if (!sid) {
      sid = generateSessionId();
      localStorage.setItem('valkey_agent_session', sid);
    }
    setSessionId(sid);

    // Fetch conversation history
    fetch(`http://localhost:5000/api/agent/conversation/${sid}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.turns) {
          setMessages(data.turns);
        }
      })
      .catch(console.error);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, query: userMsg })
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'agent', content: 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      console.error('Agent chat error:', error);
      setMessages(prev => [...prev, { role: 'agent', content: 'Sorry, connection failed.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="position-fixed flex-center bg-main-600 text-white rounded-circle shadow"
        style={{ bottom: '20px', right: '20px', width: '60px', height: '60px', zIndex: 9999, border: 'none', cursor: 'pointer' }}
      >
        <i className={`text-2xl ${isOpen ? 'ph ph-x' : 'ph ph-chats'}`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="position-fixed bg-white shadow rounded-16 d-flex flex-column"
          style={{ bottom: '90px', right: '20px', width: '350px', height: '500px', zIndex: 9999, overflow: 'hidden', border: '1px solid #eee' }}
        >
          {/* Header */}
          <div className="bg-main-600 text-white p-16 flex-between">
            <h6 className="mb-0 text-white text-md">AI Shopping Assistant</h6>
          </div>

          {/* Messages Area */}
          <div className="flex-grow-1 p-16 overflow-y-auto" style={{ backgroundColor: '#f8f9fa' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-24 text-sm">
                Ask me anything! "Find a laptop under $1000" or "Gift for a 10 year old"
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-16 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div 
                  className={`p-12 rounded-8 max-w-75 ${msg.role === 'user' ? 'bg-main-600 text-white' : 'bg-white border text-gray-800'}`}
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '14px' }}
                  dangerouslySetInnerHTML={{ 
                    __html: msg.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary text-decoration-underline" style="color: inherit;">$1</a>') 
                  }}
                />
              </div>
            ))}
            {loading && (
              <div className="mb-16 d-flex justify-content-start">
                <div className="p-12 rounded-8 bg-white border text-gray-500 text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-16 bg-white border-top">
            <form onSubmit={handleSend} className="d-flex gap-8">
              <input 
                type="text" 
                className="form-control rounded-pill px-16 text-sm" 
                placeholder="Type a message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="btn btn-main rounded-circle p-0 flex-center flex-shrink-0" 
                style={{ width: '40px', height: '40px' }}
                disabled={loading || !input.trim()}
              >
                <i className="ph ph-paper-plane-right text-white"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentBot;
