import api from './api';

export async function getDashboard() {
  const { data } = await api.get('/analytics/dashboard');
  return data;
}

export async function getSentimentTrends(params = {}) {
  const { data } = await api.get('/analytics/sentiment-trends', { params });
  return data;
}

export async function getTechDistribution() {
  const { data } = await api.get('/analytics/tech-distribution');
  return data;
}

export async function getGrowthComparison(technologies = []) {
  const { data } = await api.get('/analytics/growth-comparison', {
    params: { technologies: technologies.join(',') },
  });
  return data;
}

export async function getReport(params = {}) {
  const { data } = await api.get('/analytics/report', { params });
  return data;
}
