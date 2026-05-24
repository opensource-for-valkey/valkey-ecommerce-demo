import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgentProductLink } from '../utils/productNavigation';
import {
  checkHealth,
  getConversation,
  searchAgent,
  sendFeedback
} from '../services/agentApi';
import ThemeToggle from './ThemeToggle';
import '../styles/agent-assistant.scss';

const SESSION_KEY = 'agent_search_session';
const USER_KEY = 'agent_search_user';

/** Challenge 14 document examples — optional hints only, not the primary input path */
const CHALLENGE_EXAMPLES = [
  'I need a birthday gift for my 10-year-old nephew who likes science',
  'Show me cheaper options'
];

function formatPrice(price) {
  if (price == null) return '—';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

const AgentSearchChat = ({ isExpanded, onClose, onToggleExpand }) => {
  const [sessionId, setSessionId] = useState(
    () => sessionStorage.getItem(SESSION_KEY) || null
  );
  const [userId, setUserId] = useState(
    () => sessionStorage.getItem(USER_KEY) || null
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [showExamples, setShowExamples] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [isExpanded]);

  const loadStoredSession = useCallback(async () => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return;

    try {
      const conv = await getConversation(stored);
      const restored = [];
      for (const turn of conv.turns || []) {
        if (turn.role === 'user') {
          restored.push({ role: 'user', content: turn.content });
        } else if (turn.role === 'agent') {
          restored.push({
            role: 'agent',
            content: turn.content,
            results: [],
            followUp: null,
            meta: { resultSource: 'live_search' }
          });
        }
      }
      if (restored.length) setMessages(restored);
      setSessionId(conv.sessionId);
      setUserId(conv.userId);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    loadStoredSession();
  }, [loadStoredSession]);

  const sendMessage = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || loading) return;

    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    try {
      const data = await searchAgent({
        sessionId,
        userId,
        message: trimmed,
        liveSearch: true
      });

      setSessionId(data.sessionId);
      setUserId(data.userId);
      sessionStorage.setItem(SESSION_KEY, data.sessionId);
      sessionStorage.setItem(USER_KEY, data.userId);

      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: data.response,
          results: data.results || [],
          followUp: data.followUp,
          meta: data.meta,
          searchParams: data.searchParams,
          clarification: data.clarification
        }
      ]);
    } catch (err) {
      setError(
        err.message ||
          'Could not reach the agent. Start backend (3001) and Valkey.'
      );
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFeedback = async (productId, feedback) => {
    if (!sessionId) return;
    setFeedbackMap((prev) => ({ ...prev, [productId]: feedback }));
    try {
      await sendFeedback({ sessionId, productId, feedback });
    } catch {
      /* ignore */
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setUserId(null);
    setMessages([]);
    setFeedbackMap({});
    setError(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  return (
    <div className='agent-chat-panel'>
      <div className='agent-chat-header'>
        <div className='flex-between flex-wrap gap-8'>
          <div className='flex-1 min-w-0'>
            <h6 className='mb-2 flex-align gap-6 text-truncate'>
              <i className='ph ph-sparkle text-main-600' />
              AI Shopping Assistant
            </h6>
            <p className='text-xs text-gray-600 mb-0'>
              Type your own question — we analyze it, search live, and reply.
            </p>
          </div>
          <div className='agent-chat-header-actions'>
            <ThemeToggle className='agent-header-icon-btn theme-toggle--compact' />
            <Link
              to='/valkey-dashboard'
              className='agent-header-icon-btn text-decoration-none'
              title='Valkey live monitor'
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className='ph ph-chart-line-up' />
            </Link>
            <span
              className='text-xs text-gray-500 flex-align gap-4 me-2 d-none d-sm-flex'
              title={backendOnline ? 'API online' : 'API offline'}
            >
              <span
                className={`agent-status-dot ${
                  backendOnline
                    ? 'agent-status-dot--online'
                    : 'agent-status-dot--offline'
                }`}
              />
            </span>
            <button
              type='button'
              className='agent-header-icon-btn'
              onClick={startNewChat}
              title='New chat'
              aria-label='New chat'
            >
              <i className='ph ph-arrows-clockwise' />
            </button>
            <button
              type='button'
              className='agent-header-icon-btn'
              onClick={onToggleExpand}
              title={isExpanded ? 'Compact view' : 'Expand chat'}
              aria-label={isExpanded ? 'Compact view' : 'Expand chat'}
            >
              <i
                className={
                  isExpanded ? 'ph ph-arrows-in' : 'ph ph-arrows-out'
                }
              />
            </button>
            <button
              type='button'
              className='agent-header-icon-btn'
              onClick={onClose}
              title='Minimize'
              aria-label='Minimize assistant'
            >
              <i className='ph ph-minus' />
            </button>
          </div>
        </div>
      </div>

      <div className='agent-chat-messages'>
        {messages.length === 0 && !loading && (
          <div className='agent-chat-empty'>
            <i className='ph ph-chat-text text-main-600 text-3xl mb-12 d-block' />
            <h6 className='mb-6 text-sm'>Ask in your own words</h6>
            <p className='text-xs mb-0 text-gray-600'>
              Every message runs a <strong>live search</strong> (not cached
              results). Context is stored in Valkey for follow-ups.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={`${msg.role}-${idx}`}
            className={`agent-message agent-message--${msg.role}`}
          >
            {msg.role === 'agent' && msg.meta && (
              <>
                <span
                  className={`agent-source-badge ${
                    msg.meta.resultSource === 'clarification'
                      ? 'agent-source-badge--cache'
                      : msg.meta.liveSearch
                        ? 'agent-source-badge--live'
                        : 'agent-source-badge--cache'
                  }`}
                >
                  <i
                    className={
                      msg.meta.resultSource === 'clarification'
                        ? 'ph ph-question'
                        : msg.meta.liveSearch
                          ? 'ph ph-lightning'
                          : 'ph ph-database'
                    }
                  />
                  {msg.meta.resultSource === 'clarification'
                    ? 'Clarifying'
                    : msg.meta.liveSearch
                      ? 'Live search'
                      : 'From Valkey cache'}
                  {msg.meta.latencyMs != null && ` · ${msg.meta.latencyMs}ms`}
                  {msg.meta.under3Seconds === false && ' · slow'}
                </span>
                {msg.meta.toolsUsed?.length > 0 && (
                  <p className='agent-analyzed-hint mb-0'>
                    Tools: {msg.meta.toolsUsed.join(', ')}
                  </p>
                )}
                {msg.searchParams && (
                  <p className='agent-analyzed-hint mb-0 text-truncate' title={JSON.stringify(msg.searchParams)}>
                    Parsed: intent={msg.searchParams.intent || '—'}
                    {msg.searchParams.context?.age
                      ? `, age=${msg.searchParams.context.age}`
                      : ''}
                    {msg.searchParams.tags?.length
                      ? `, tags=[${msg.searchParams.tags.slice(0, 3).join(',')}]`
                      : ''}
                  </p>
                )}
              </>
            )}

            <div className='agent-message-bubble'>{msg.content}</div>

            {msg.role === 'agent' && msg.results?.length > 0 && (
              <div className='agent-product-grid'>
                {msg.results.map((product) => (
                  <div key={product.productId} className='agent-product-card'>
                    <Link
                      to={getAgentProductLink(product)}
                      className='agent-product-card__link'
                      onClick={() => onClose?.()}
                    >
                      <div className='flex-between flex-wrap gap-6'>
                        <strong className='text-gray-900 text-sm'>
                          {product.name}
                        </strong>
                        <span className='text-main-600 fw-semibold text-sm'>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      {product.rating != null && (
                        <div className='text-xs text-warning-600 mt-4'>
                          <i className='ph ph-star-fill' /> {product.rating}/5
                        </div>
                      )}
                      {product.reason && (
                        <p className='agent-product-reason mb-0'>
                          {product.reason}
                        </p>
                      )}
                      <span className='agent-product-card__cta'>
                        View product <i className='ph ph-arrow-right' />
                      </span>
                    </Link>
                    <div className='agent-product-card__feedback'>
                      <div className='agent-feedback-btns'>
                        <button
                          type='button'
                          className={`agent-feedback-btn ${
                            feedbackMap[product.productId] === 'helpful'
                              ? 'agent-feedback-btn--active'
                              : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFeedback(product.productId, 'helpful');
                          }}
                        >
                          <i className='ph ph-thumbs-up' />
                        </button>
                        <button
                          type='button'
                          className={`agent-feedback-btn ${
                            feedbackMap[product.productId] === 'not_helpful'
                              ? 'agent-feedback-btn--active'
                              : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFeedback(product.productId, 'not_helpful');
                          }}
                        >
                          <i className='ph ph-thumbs-down' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {msg.role === 'agent' && msg.followUp && (
              <button
                type='button'
                className='agent-suggestion-chip border-0'
                disabled={loading}
                onClick={() => sendMessage(msg.followUp)}
              >
                {msg.followUp}
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className='agent-message agent-message--agent'>
            <span className='agent-source-badge agent-source-badge--live'>
              <i className='ph ph-lightning' /> Analyzing your message…
            </span>
            <div className='agent-typing' aria-label='Agent is thinking'>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <button
        type='button'
        className='agent-examples-toggle'
        onClick={() => setShowExamples((v) => !v)}
      >
        {showExamples ? '▼ Hide' : '▶'} Challenge doc examples (optional)
      </button>

      {showExamples && (
        <div className='agent-suggestions agent-suggestions--expanded'>
          {CHALLENGE_EXAMPLES.map((prompt) => (
            <button
              key={prompt}
              type='button'
              className='agent-suggestion-chip'
              disabled={loading}
              onClick={() => sendMessage(prompt)}
              title={prompt}
            >
              {prompt.length > 40 ? `${prompt.slice(0, 40)}…` : prompt}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className='px-16 pb-8'>
          <div className='alert alert-danger py-8 px-12 mb-0 text-xs rounded-8'>
            <i className='ph ph-warning-circle me-4' />
            {error}
          </div>
        </div>
      )}

      <form className='agent-chat-input-bar' onSubmit={handleSubmit}>
        <div className='position-relative'>
          <input
            ref={inputRef}
            type='text'
            className='form-control py-12 px-20 rounded-pill pe-56 text-sm'
            placeholder='Your message — e.g. gift for nephew who likes science'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type='submit'
            className='w-40 h-40 bg-main-600 rounded-circle flex-center text-lg text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-6 border-0'
            disabled={loading || !input.trim()}
            aria-label='Send'
          >
            <i className='ph ph-paper-plane-tilt' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentSearchChat;
