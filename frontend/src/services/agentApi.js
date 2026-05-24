const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, '') || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }

  return data;
}

export function searchAgent({ sessionId, userId, message, liveSearch = true }) {
  return request('/api/agent/search', {
    method: 'POST',
    body: JSON.stringify({ sessionId, userId, message, liveSearch })
  });
}

export function getConversation(sessionId) {
  return request(`/api/agent/conversation/${sessionId}`);
}

export function sendFeedback({ sessionId, productId, feedback, reason }) {
  return request('/api/agent/feedback', {
    method: 'POST',
    body: JSON.stringify({ sessionId, productId, feedback, reason })
  });
}

export function checkHealth() {
  return request('/health');
}
