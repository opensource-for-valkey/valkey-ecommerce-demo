import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authAPI.getProfile()
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('auth_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await authAPI.register(username, email, password);
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Even if the API call fails, clear local state
    }
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const data = await authAPI.updateProfile(profileData);
    setUser(data.user);
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const data = await authAPI.changePassword(currentPassword, newPassword);
    return data;
  };

  const value = { user, loading, login, register, logout, updateProfile, changePassword };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
