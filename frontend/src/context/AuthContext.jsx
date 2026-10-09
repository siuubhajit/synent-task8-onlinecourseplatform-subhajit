import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('learnpulse_token'));
  const [loading, setLoading] = useState(true);

  // Sync token to API client and load user profile
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        api.setAuthToken(token);
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[Auth] Session check failed, clearing token');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('learnpulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
      api.setAuthToken(res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.success && res.token) {
      localStorage.setItem('learnpulse_token', res.token);
      setToken(res.token);
      setUser(res.user);
      api.setAuthToken(res.token);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('learnpulse_token');
    setToken(null);
    setUser(null);
    api.setAuthToken(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const isEnrolledInCourse = (courseId) => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.some(item => {
      const id = typeof item === 'object' ? item._id : item;
      return id && id.toString() === courseId.toString();
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser,
        isEnrolledInCourse
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
