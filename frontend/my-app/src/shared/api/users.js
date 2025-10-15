import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const userApi = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getByEmail: async (email) => {
    const response = await axios.get(`${API_URL}/email/${email}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await axios.post(API_URL, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    try {
      const config = {};
      if (userData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }
      
      const response = await axios.put(`${API_URL}/${id}`, userData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  assignRole: async (userId, roleId) => {
    const response = await axios.post(`${API_URL}/${userId}/roles/${roleId}`);
    return response.data;
  },

  removeRole: async (userId, roleId) => {
    const response = await axios.delete(`${API_URL}/${userId}/roles/${roleId}`);
    return response.data;
  }
};