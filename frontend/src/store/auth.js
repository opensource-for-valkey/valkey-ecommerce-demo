// Auth store. Holds the current user (or null when signed out) and a `ready`
// flag that's true once the initial /me probe finishes.
//
// `init()` is called from index.js so every page knows the auth state on
// first paint.

import { create } from "zustand";
import api from "../api/client";

export const useAuth = create((set, get) => ({
    user: null,
    ready: false,
    error: null,

    async init() {
        try {
            const { user } = await api.me();
            set({ user, ready: true, error: null });
        } catch (err) {
            // 401 just means signed out; anything else is logged.
            if (err.status !== 401) console.warn("auth.init failed:", err);
            set({ user: null, ready: true, error: null });
        }
    },

    async login({ email, password }) {
        set({ error: null });
        const { user } = await api.login({ email, password });
        set({ user });
        return user;
    },

    async register({ email, password, firstName }) {
        set({ error: null });
        const { user } = await api.register({ email, password, firstName });
        set({ user });
        return user;
    },

    async logout() {
        try {
            await api.logout();
        } finally {
            set({ user: null });
        }
    },

    isSignedIn: () => !!get().user,
}));
