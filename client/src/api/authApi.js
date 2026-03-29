import axios from 'axios';
import api from './axiosInstance.js';

const baseURL = import.meta.env.VITE_API_URL || '';

export async function register(body) {
  const { data } = await api.post('/api/auth/register', body);
  return data;
}

export async function login(body) {
  const { data } = await api.post('/api/auth/login', body);
  return data;
}

export async function logout() {
  const { data } = await api.post('/api/auth/logout');
  return data;
}

export async function refreshAccessToken() {
  const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });
  return data;
}
