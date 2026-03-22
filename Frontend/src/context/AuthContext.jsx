import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm interceptor để tự động thêm token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', token.substring(0, 20) + '...'); // Debug
    }
    return config;
  });

  // Kiểm tra token khi load app
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? token.substring(0, 20) + '...' : 'none'); // Debug
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user profile...'); // Debug
        const response = await api.get('/users/profile');
        console.log('Profile response:', response.data); // Debug
        setUser(response.data);
      } catch (error) {
        console.error('Token invalid:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Login attempt:', { email }); // Debug
      
      const response = await api.post('/auth/login', {
        username: email,
        password
      });

      console.log('Login response:', response.data); // Debug

      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        
        return { success: true };
      }
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        full_name: userData.name
      });
      
      if (response.data.success) {
        return await login(userData.email, userData.password);
      }
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};