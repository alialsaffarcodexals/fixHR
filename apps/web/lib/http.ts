import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = process.env.DEV_JWT;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
