const CATEGORIES = [
  "artificial-intelligence",
  "machine-learning",
  "deep-learning",
  "nlp",
  "computer-vision",
  "robotics",
  "data-science",
  "cloud-computing",
  "cybersecurity",
  "blockchain",
  "quantum-computing",
  "iot",
  "ar-vr",
  "biotech",
  "fintech",
  "general",
];

const STAGES = ["Emerging", "Growing", "Mature", "Declining"];

const SENTIMENT_LABELS = ["positive", "negative", "neutral"];

const NOTIFICATION_TYPES = [
  "alert",
  "update",
  "recommendation",
  "system",
  "trend",
  "sentiment",
];

const PRIORITIES = ["low", "medium", "high", "urgent"];

const ROLES = ["user", "admin"];

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
  DAY: 86400,
};

module.exports = {
  CATEGORIES,
  STAGES,
  SENTIMENT_LABELS,
  NOTIFICATION_TYPES,
  PRIORITIES,
  ROLES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  CACHE_TTL,
};
