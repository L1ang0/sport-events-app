import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/current`, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const user = await getCurrentUser(token);
    return user;
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('token');
    return null;
  }
};

export const isAdmin = (user) => {
  return user?.roles?.some(role => role.name === 'ADMIN');
};

export const isCurrentUser = (user, userId) => {
  return user?.id === parseInt(userId);
};

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});