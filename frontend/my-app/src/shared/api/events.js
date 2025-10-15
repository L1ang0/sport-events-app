import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events';

export const eventsApi = {
  // Получить всех пользователей
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};