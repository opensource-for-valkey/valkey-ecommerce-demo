const API_BASE = 'http://localhost:5000/api/auth';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const authAPI = {
  async register(username, email, password) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(response);
  },

  async login(username, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getProfile() {
    const response = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${API_BASE}/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse(response);
  }
};
