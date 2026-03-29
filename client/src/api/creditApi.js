import api from './axiosInstance.js';

export async function claimCredits() {
  const { data } = await api.post('/api/credits/claim');
  return data;
}

export async function getBalance() {
  const { data } = await api.get('/api/credits/balance');
  return data;
}

export async function getCreditHistory() {
  const { data } = await api.get('/api/credits/history');
  return data;
}
