import api from './axiosInstance.js';

export async function getMe() {
  const { data } = await api.get('/api/users/me');
  return data;
}

export async function updateMe(body) {
  const { data } = await api.patch('/api/users/me', body);
  return data;
}

export async function getPublicProfile(username) {
  const { data } = await api.get(`/api/users/profile/${encodeURIComponent(username)}`);
  return data;
}
