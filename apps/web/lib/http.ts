import axios from 'axios';
const base = process.env.API_BASE_URL || 'http://localhost:4000';
const devToken = process.env.DEV_JWT;
export const api = axios.create({
  baseURL: base,
  headers: devToken ? { Authorization: `Bearer ${devToken}` } : undefined,
});
