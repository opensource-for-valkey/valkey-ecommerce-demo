import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_KEY = 'guestCartId';
const EMPTY_CART = { items: [], itemCount: 0, subtotal: 0, discount: 0, total: 0, coupon: null };

function getOrCreateGuestId() {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}

export function CartProvider({ children }) {
  const { user, getToken } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const prevUserRef = useRef(null);

  function buildHeaders() {
    const token = getToken();
    if (token) {
      return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    }
    return { 'Content-Type': 'application/json', 'X-Guest-Id': getOrCreateGuestId() };
  }

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', { headers: buildHeaders() });
      if (res.ok) setCart(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const wasGuest = !prevUserRef.current;
    const isNowUser = !!user;

    if (isNowUser && wasGuest) {
      const guestId = localStorage.getItem(GUEST_KEY);
      const token = getToken();
      if (guestId && token) {
        fetch('/api/cart/merge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ guestId }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data) setCart(data); else fetchCart(); })
          .catch(() => fetchCart());
      } else {
        fetchCart();
      }
    } else {
      fetchCart();
    }

    prevUserRef.current = user;
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function addItem(productId, quantity = 1, categoryId = null) {
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    if (res.ok) {
      setCart(data);
      fetch('/api/events/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, categoryId }),
      }).catch(() => {});
    }
    return { ok: res.ok, data };
  }

  async function updateItem(productId, quantity) {
    const encoded = encodeURIComponent(productId);
    const res = await fetch(`/api/cart/items/${encoded}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (res.ok) setCart(data);
    return { ok: res.ok, data };
  }

  async function removeItem(productId) {
    const encoded = encodeURIComponent(productId);
    const res = await fetch(`/api/cart/items/${encoded}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });
    const data = await res.json();
    if (res.ok) setCart(data);
    return { ok: res.ok, data };
  }

  async function clearCart() {
    const res = await fetch('/api/cart', { method: 'DELETE', headers: buildHeaders() });
    const data = await res.json();
    if (res.ok) setCart(data);
    return { ok: res.ok, data };
  }

  async function applyCoupon(code) {
    const res = await fetch('/api/cart/coupon', {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (res.ok) setCart(data);
    return { ok: res.ok, data };
  }

  async function removeCoupon() {
    const res = await fetch('/api/cart/coupon', { method: 'DELETE', headers: buildHeaders() });
    const data = await res.json();
    if (res.ok) setCart(data);
    return { ok: res.ok, data };
  }

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart,
      addItem, updateItem, removeItem, clearCart,
      applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
