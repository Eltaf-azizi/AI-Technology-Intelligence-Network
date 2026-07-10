import { formatDistanceToNow, format as dateFormat, parseISO } from 'date-fns';

export function formatDate(dateInput, formatStr = 'PP') {
  if (!dateInput) return 'N/A';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return dateFormat(date, formatStr);
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeDate(dateInput) {
  if (!dateInput) return 'N/A';
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '0%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function truncateText(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function formatSentiment(score) {
  if (score === null || score === undefined) {
    return { label: 'Neutral', color: 'var(--sentiment-neutral)', className: 'badge-neutral' };
  }
  if (score >= 0.3) {
    return { label: 'Positive', color: 'var(--sentiment-positive)', className: 'badge-positive' };
  }
  if (score <= -0.3) {
    return { label: 'Negative', color: 'var(--sentiment-negative)', className: 'badge-negative' };
  }
  return { label: 'Neutral', color: 'var(--sentiment-neutral)', className: 'badge-neutral' };
}

export function formatGrowthRate(rate, compact = false) {
  if (rate === null || rate === undefined) return 'N/A';
  const sign = rate >= 0 ? '+' : '';
  const formatted = compact
    ? `${sign}${rate.toFixed(0)}%`
    : `${sign}${rate.toFixed(1)}%`;
  return formatted;
}
