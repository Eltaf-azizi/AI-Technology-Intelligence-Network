import api from './api';

export async function getNews(params = {}) {
  const { data } = await api.get('/news', { params });
  return data;
}

export async function getNewsById(id) {
  const { data } = await api.get(`/news/${id}`);
  return data;
}

export async function getTrendingNews() {
  const { data } = await api.get('/news/trending');
  return data;
}

export async function searchNews(query) {
  const { data } = await api.get('/news/search', { params: { q: query } });
  return data;
}

export async function createNews(newsData) {
  const { data } = await api.post('/news', newsData);
  return data;
}

export async function deleteNews(id) {
  const { data } = await api.delete(`/news/${id}`);
  return data;
}

export async function analyzeNews(id) {
  const { data } = await api.post(`/news/${id}/analyze`);
  return data;
}
