const API_BASE = 'http://localhost:5000/api/orders';

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

export const ordersAPI = {
  async placeOrder(orderData) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  async getOrders() {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  async getOrder(orderId) {
    const response = await fetch(`${API_BASE}/${orderId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};
