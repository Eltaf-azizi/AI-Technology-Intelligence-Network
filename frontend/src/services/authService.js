import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(username, email, password) {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
}

export async function refreshToken(refreshToken) {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
}

export async function logout() {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/auth/profile');
  return data;
}

export async function updateProfile(updates) {
  const { data } = await api.put('/auth/profile', updates);
  return data;
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await api.post('/auth/reset-password', { token, password });
  return data;
}
