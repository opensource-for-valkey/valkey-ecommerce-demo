const API_BASE = 'http://localhost:5000/api/ai';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const aiAPI = {
  async chat(message, sessionId) {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, sessionId })
    });
    return response.json();
  },

  async getInsights() {
    const response = await fetch(`${API_BASE}/insights`, {
      method: 'GET',
      headers: getHeaders()
    });
    return response.json();
  }
};
