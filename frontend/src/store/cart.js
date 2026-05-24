// Cart store. Talks to the backend, mirrors the response, and exposes
// optimistic-feeling action helpers. Each action returns a promise so callers
// can await it (e.g. show a toast on success/failure).
//
// The shape mirrors the backend payload exactly:
//   { items: [{ productId, quantity, status, lineTotal, product, addedAt, updatedAt }],
//     subtotal, currency, count }

import { create } from "zustand";
import api from "../api/client";
import { useAuth } from "./auth";

const EMPTY = { items: [], subtotal: 0, currency: "INR", count: 0 };

export const useCart = create((set, get) => ({
    ...EMPTY,
    loading: false,
    error: null,

    async refresh() {
        if (!useAuth.getState().user) {
            set({ ...EMPTY, loading: false, error: null });
            return EMPTY;
        }
        set({ loading: true, error: null });
        try {
            const data = await api.getCart();
            set({ ...data, loading: false });
            return data;
        } catch (err) {
            if (err.status === 401) {
                set({ ...EMPTY, loading: false });
                return EMPTY;
            }
            set({ loading: false, error: err });
            throw err;
        }
    },

    async addItem(productId, quantity = 1, status = "active") {
        const data = await api.addCartItem({ productId, quantity, status });
        set({ ...data, error: null });
        return data;
    },

    async updateItem(productId, patch) {
        const data = await api.updateCartItem(productId, patch);
        set({ ...data, error: null });
        return data;
    },

    async removeItem(productId) {
        const data = await api.removeCartItem(productId);
        set({ ...data, error: null });
        return data;
    },

    async clear() {
        const data = await api.clearCart();
        set({ ...data, error: null });
        return data;
    },

    reset() {
        set({ ...EMPTY, loading: false, error: null });
    },
}));

// Keep cart in sync with auth: refresh on sign-in, reset on sign-out.
useAuth.subscribe((state, prev) => {
    if (state.user && state.user !== prev.user) {
        useCart.getState().refresh();
    } else if (!state.user && prev.user) {
        useCart.getState().reset();
    }
});
