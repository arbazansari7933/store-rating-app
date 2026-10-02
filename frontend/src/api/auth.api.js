import client from './client';

export const login = (payload) => client.post('/auth/login', payload);
export const signup = (payload) => client.post('/auth/signup', payload);
export const changePassword = (payload) => client.post('/auth/change-password', payload);
export const getMe = () => client.get('/users/me');
