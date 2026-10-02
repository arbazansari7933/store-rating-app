import client from './client';

export const getStores = (params) => client.get('/stores', { params });

export const rateStore = (storeId, rating) =>
  client.post(`/stores/${storeId}/ratings`, { rating });

export const getOwnerDashboard = (params) =>
  client.get('/stores/owner/dashboard', { params });