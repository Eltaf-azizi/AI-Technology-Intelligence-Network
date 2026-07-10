import {
  LayoutDashboard,
  TrendingUp,
  Newspaper,
  User,
  Shield,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';

export const CATEGORIES = [
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Robotics',
  'Edge Computing',
  'Quantum Computing',
  'Blockchain',
  'IoT',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'Data Science',
  'Augmented Reality',
  'Virtual Reality',
  'BioTech',
  'CleanTech',
  'FinTech',
  'HealthTech',
];

export const STAGES = [
  { value: 'emerging', label: 'Emerging', color: 'var(--stage-emerging)' },
  { value: 'growth', label: 'Growth', color: 'var(--stage-growth)' },
  { value: 'maturity', label: 'Maturity', color: 'var(--stage-maturity)' },
  { value: 'decline', label: 'Decline', color: 'var(--stage-decline)' },
];

export const SENTIMENT_LABELS = {
  positive: { label: 'Positive', color: 'var(--sentiment-positive)', icon: 'trending-up' },
  neutral: { label: 'Neutral', color: 'var(--sentiment-neutral)', icon: 'minus' },
  negative: { label: 'Negative', color: 'var(--sentiment-negative)', icon: 'trending-down' },
};

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard, requireAuth: false },
  { path: '/dashboard', label: 'Dashboard', icon: TrendingUp, requireAuth: true },
  { path: '/profile', label: 'Profile', icon: User, requireAuth: true },
];

export const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Overview', icon: Shield, requireAuth: true, requireAdmin: true },
  { path: '/admin/users', label: 'Users', icon: Users, requireAuth: true, requireAdmin: true },
  { path: '/admin/content', label: 'Content', icon: Newspaper, requireAuth: true, requireAdmin: true },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, requireAuth: true, requireAdmin: true },
  { path: '/admin/settings', label: 'Settings', icon: Settings, requireAuth: true, requireAdmin: true },
];

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  news: {
    base: '/news',
    trending: '/news/trending',
    search: '/news/search',
    analyze: (id) => `/news/${id}/analyze`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    sentimentTrends: '/analytics/sentiment-trends',
    techDistribution: '/analytics/tech-distribution',
    growthComparison: '/analytics/growth-comparison',
    report: '/analytics/report',
  },
  notifications: {
    base: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
  },
  admin: {
    users: '/admin/users',
    content: '/admin/content',
    stats: '/admin/stats',
  },
};
