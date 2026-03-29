import api from './axiosInstance.js';

export async function getMyTransactions(params) {
  const { data } = await api.get('/api/transactions', { params });
  return data;
}
