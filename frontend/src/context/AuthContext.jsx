import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(() => {
    const isAuth = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();
    setIsAuthenticated(isAuth);
    setUser(currentUser);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleSessionExpired = () => {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('aura:session-expired', handleSessionExpired);
    return () => window.removeEventListener('aura:session-expired', handleSessionExpired);
  }, [checkAuth]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName, role) => {
    setLoading(true);
    try {
      const res = await authService.register(email, password, displayName, role);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
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
