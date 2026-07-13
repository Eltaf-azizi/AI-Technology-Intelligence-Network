require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/atin?authSource=admin';

const USERS = [
  {
    email: 'admin@atin.dev',
    password: 'Admin123!@#',
    name: 'Admin User',
    role: 'admin',
    preferences: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      digestFrequency: 'daily',
    },
  },
  {
    email: 'alice@atin.dev',
    password: 'Alice123!@#',
    name: 'Alice Chen',
    role: 'user',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: false,
      digestFrequency: 'weekly',
    },
  },
  {
    email: 'bob@atin.dev',
    password: 'Bob123!@#',
    name: 'Bob Martinez',
    role: 'user',
    preferences: {
      theme: 'dark',
      emailNotifications: false,
      pushNotifications: true,
      digestFrequency: 'daily',
    },
  },
  {
    email: 'carol@atin.dev',
    password: 'Carol123!@#',
    name: 'Carol Johnson',
    role: 'user',
    preferences: {
      theme: 'auto',
      emailNotifications: true,
      pushNotifications: true,
      digestFrequency: 'realtime',
    },
  },
  {
    email: 'dave@atin.dev',
    password: 'Dave123!@#',
    name: 'Dave Kim',
    role: 'user',
    preferences: {
      theme: 'dark',
      emailNotifications: true,
      pushNotifications: true,
      digestFrequency: 'daily',
    },
  },
];

const TECHNOLOGIES = [
  { name: 'GPT-5', category: 'LLM', description: 'Next-gen large language model from OpenAI', maturity: 'emerging', score: 95 },
  { name: 'Claude 4', category: 'LLM', description: 'Anthropic latest constitutional AI', maturity: 'emerging', score: 92 },
  { name: 'Gemini Ultra 2', category: 'Multimodal', description: 'Google deep multimodal reasoning', maturity: 'growth', score: 90 },
  { name: 'Llama 4', category: 'LLM', description: 'Meta open-source foundation model', maturity: 'growth', score: 88 },
  { name: 'Rust for ML', category: 'Frameworks', description: 'High-performance ML in Rust', maturity: 'emerging', score: 78 },
  { name: 'Edge AI Chips', category: 'Hardware', description: 'On-device AI processing units', maturity: 'growth', score: 85 },
  { name: 'Quantum ML', category: 'Quantum', description: 'Quantum-enhanced machine learning', maturity: 'early', score: 65 },
  { name: 'Federated Learning 2.0', category: 'Privacy', description: 'Advanced privacy-preserving ML', maturity: 'growth', score: 80 },
  { name: 'Neural Architecture Search', category: 'AutoML', description: 'Automated model design', maturity: 'mature', score: 82 },
  { name: 'Synthetic Data Gen', category: 'Data', description: 'AI-generated training datasets', maturity: 'growth', score: 77 },
];

const NEWS_ARTICLES = [
  { title: 'OpenAI Announces GPT-5 Release Date', source: 'TechCrunch', sentiment: 'positive', sentimentScore: 0.92 },
  { title: 'Major Data Breach Affects AI Startup', source: 'Reuters', sentiment: 'negative', sentimentScore: -0.85 },
  { title: 'New Regulation Proposed for AI Systems', source: 'Bloomberg', sentiment: 'neutral', sentimentScore: 0.1 },
  { title: 'Google Achieves Breakthrough in Quantum ML', source: 'Nature', sentiment: 'positive', sentimentScore: 0.88 },
  { title: 'AI Job Market Sees 40% Growth', source: 'Forbes', sentiment: 'positive', sentimentScore: 0.78 },
  { title: 'European Union Bans Facial Recognition', source: 'BBC', sentiment: 'negative', sentimentScore: -0.45 },
  { title: 'Apple Launches On-Device AI Assistant', source: 'Wired', sentiment: 'positive', sentimentScore: 0.82 },
  { title: 'Research Exposes Bias in Hiring AI', source: 'MIT Tech Review', sentiment: 'negative', sentimentScore: -0.72 },
  { title: 'Microsoft Copilot Enterprise Adoption Surges', source: 'ZDNet', sentiment: 'positive', sentimentScore: 0.75 },
  { title: 'AI Ethics Board Resigns Over Concerns', source: 'The Guardian', sentiment: 'negative', sentimentScore: -0.68 },
  { title: 'Open Source AI Models Outperform Proprietary', source: 'ArXiv', sentiment: 'positive', sentimentScore: 0.81 },
  { title: 'Climate AI Helps Predict Extreme Weather', source: 'CNN', sentiment: 'positive', sentimentScore: 0.89 },
  { title: 'AI Healthcare Diagnostic Error Rate Drops', source: 'JAMA', sentiment: 'positive', sentimentScore: 0.91 },
  { title: 'Deepfake Detection Tool Released', source: 'Ars Technica', sentiment: 'neutral', sentimentScore: 0.35 },
  { title: 'AI Chip Shortage Impacts Global Supply', source: 'WSJ', sentiment: 'negative', sentimentScore: -0.62 },
  { title: 'Meta Releases Llama 4 as Open Source', source: 'VentureBeat', sentiment: 'positive', sentimentScore: 0.84 },
  { title: 'New AI Safety Framework Adopted by G7', source: 'Politico', sentiment: 'neutral', sentimentScore: 0.28 },
  { title: 'Autonomous Vehicles Pass Milestone Tests', source: 'The Verge', sentiment: 'positive', sentimentScore: 0.76 },
  { title: 'AI Art Copyright Lawsuit Settled', source: 'NY Times', sentiment: 'neutral', sentimentScore: 0.15 },
  { title: 'Federated Learning Adoption in Healthcare Doubles', source: 'HealthTech', sentiment: 'positive', sentimentScore: 0.79 },
];

const NOTIFICATION_TEMPLATES = [
  { name: 'welcome', subject: 'Welcome to ATIN', body: 'Welcome {{name}}, start exploring AI trends!', type: 'system' },
  { name: 'trend_alert', subject: 'Trend Alert: {{trendName}}', body: '{{trendName}} has {{change}}% change in interest.', type: 'alert' },
  { name: 'weekly_digest', subject: 'Your Weekly AI Digest', body: 'Top trends this week: {{trends}}', type: 'digest' },
  { name: 'security_alert', subject: 'Security Alert', body: 'New login detected from {{location}}.', type: 'security' },
  { name: 'comment_reply', subject: 'New Reply to Your Comment', body: '{{user}} replied: {{excerpt}}', type: 'social' },
  { name: 'article_curated', subject: 'New Article for You', body: '{{title}} matches your interests.', type: 'recommendation' },
];
