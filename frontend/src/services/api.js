import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        const refreshToken = localStorage.getItem('atin_refresh_token');
        if (refreshToken && !error.config._retry) {
          error.config._retry = true;
          try {
            const { data: refreshData } = await axios.post(
              `${api.defaults.baseURL}/auth/refresh`,
              { refreshToken }
            );
            localStorage.setItem('atin_token', refreshData.token);
            error.config.headers.Authorization = `Bearer ${refreshData.token}`;
            return api(error.config);
          } catch {
            localStorage.removeItem('atin_token');
            localStorage.removeItem('atin_refresh_token');
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject({
        message: data?.message || data?.error || 'An error occurred',
        status,
        data,
      });
    }
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      status: 0,
    });
  }
);

export default api;
