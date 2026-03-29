import axiosInstance from './axiosInstance.js';

export async function uploadAsset(formData) {
  const { data } = await axiosInstance.post('/api/assets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getAsset(id) {
  const { data } = await axiosInstance.get(`/api/assets/${id}`);
  return data;
}

export async function getMyAssets() {
  const { data } = await axiosInstance.get('/api/assets/mine');
  return data;
}

export async function deleteAsset(id) {
  const { data } = await axiosInstance.delete(`/api/assets/${id}`);
  return data;
}

export async function updateAsset(id, body) {
  const { data } = await axiosInstance.patch(`/api/assets/${id}`, body);
  return data;
}

export async function getOwnershipHistory(id) {
  const { data } = await axiosInstance.get(`/api/assets/${id}/history`);
  return data;
}
