import api from './axiosInstance.js';

export async function createListing(body) {
  const { data } = await api.post('/api/listings', body);
  return data;
}

export async function getListings(params) {
  const { data } = await api.get('/api/listings', { params });
  return data;
}

export async function getMyListings() {
  const { data } = await api.get('/api/listings/mine');
  return data;
}

export async function getListing(id) {
  const { data } = await api.get(`/api/listings/${id}`);
  return data;
}

export async function buyListing(id) {
  const { data } = await api.post(`/api/listings/${id}/buy`);
  return data;
}

export async function cancelListing(id) {
  const { data } = await api.post(`/api/listings/${id}/cancel`);
  return data;
}
