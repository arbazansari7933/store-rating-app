import client from './client';

export const getStats = () => client.get('/admin/stats');
export const getUsers = (params) => client.get('/admin/users', { params });
export const createUser = (payload) => client.post('/admin/users', payload);
export const getStores = (params) => client.get('/admin/stores', { params });
export const createStore = (payload) => client.post('/admin/stores', payload);

export const getUserDetails = (userId) => client.get(`/admin/users/${userId}`);
