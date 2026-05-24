import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import api from '../../services/api';

const ShoppingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Valkey AI Shopping Assistant. How can I help you today?", isBot: true }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Valkey-powered conversational memory
      const response = await api.post('/ai/chat', { 
         message: userMessage.text,
         sessionId: 'valkey_user_123' 
      });
      
      const botMessage = { id: Date.now() + 1, text: response.data.reply, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to my AI brain.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`position-fixed flex-center rounded-circle bg-main-600 text-white shadow-lg transition-2 hover-bg-main-700 z-3 ${isOpen ? 'd-none' : 'd-flex'}`}
        style={{ bottom: '30px', right: '30px', width: '60px', height: '60px', border: 'none', cursor: 'pointer' }}
      >
        <MessageSquare size={28} />
        <span className="position-absolute bg-danger-600 rounded-circle w-12 h-12" style={{ top: 0, right: 0, border: '2px solid white' }}></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="position-fixed bg-white rounded-16 shadow-lg z-3 overflow-hidden d-flex flex-column"
            style={{ bottom: '30px', right: '30px', width: '380px', height: '600px', border: '1px solid #e5e7eb' }}
          >
            {/* Header */}
            <div className="bg-main-600 p-20 flex-between text-white">
              <div className="flex-align gap-12">
                <div className="bg-white text-main-600 p-8 rounded-circle flex-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h6 className="text-white mb-0 text-md">Valkey AI Assistant</h6>
                  <span className="text-xs text-white opacity-75">Online • Real-time memory</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover-text-gray-200" style={{ background: 'transparent', border: 'none' }}>
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-grow-1 p-20 overflow-y-auto bg-gray-50" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`d-flex ${msg.isBot ? 'justify-content-start' : 'justify-content-end'}`}>
                  <div className={`p-16 rounded-16 max-w-80 ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800' : 'bg-main-600 text-white'}`} style={{ borderBottomLeftRadius: msg.isBot ? 0 : 16, borderBottomRightRadius: msg.isBot ? 16 : 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <p className="mb-0 text-sm" style={{ lineHeight: 1.5 }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="d-flex justify-content-start">
                  <div className="bg-white border border-gray-100 p-16 rounded-16 text-gray-500 flex-align gap-8" style={{ borderBottomLeftRadius: 0 }}>
                    <div className="spinner-grow spinner-grow-sm text-main-600" role="status"><span className="visually-hidden">Loading...</span></div>
                    <div className="spinner-grow spinner-grow-sm text-main-600 animation-delay-1" role="status"></div>
                    <div className="spinner-grow spinner-grow-sm text-main-600 animation-delay-2" role="status"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-16 border-top border-gray-100 bg-white">
              <div className="position-relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-100 bg-gray-50 border border-gray-200 rounded-pill py-12 ps-20 pe-48 text-sm focus-border-main-600 outline-none"
                  placeholder="Ask me anything..."
                />
                <button type="submit" className="position-absolute inset-block-start-0 inset-inline-end-0 h-100 px-16 flex-center text-main-600 hover-text-main-700" style={{ background: 'transparent', border: 'none' }}>
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShoppingAssistant;
