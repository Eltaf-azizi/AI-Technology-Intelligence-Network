const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require("./constants");

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeHtml(html) {
  if (!html) {
    return "";
  }

  const tagWhitelist = ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre", "span"];
  const attributeWhitelist = { a: ["href", "title", "target", "rel"] };

  let result = html;

  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  result = result.replace(/on\w+="[^"]*"/gi, "");
  result = result.replace(/on\w+='[^']*'/gi, "");
  result = result.replace(/javascript:/gi, "");
  result = result.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  result = result.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  result = result.replace(/<embed\b[^>]*>/gi, "");

  return result.trim();
}

function paginate(query, page = 1, limit = DEFAULT_PAGE_SIZE) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  return {
    skip,
    limit: safeLimit,
    page: safePage,
  };
}

function buildFilterQuery(filters = {}) {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.stage) {
    query.stage = filters.stage;
  }

  if (filters.technology) {
    query.technologies = { $in: Array.isArray(filters.technology) ? filters.technology : [filters.technology] };
  }

  if (filters.tags) {
    const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
    query.tags = { $in: tags };
  }

  if (filters.sentiment) {
    query.sentimentLabel = filters.sentiment;
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  if (filters.dateFrom || filters.dateTo) {
    query.publishedAt = {};
    if (filters.dateFrom) {
      query.publishedAt.$gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      query.publishedAt.$lte = new Date(filters.dateTo);
    }
  }

  if (filters.minSentiment !== undefined || filters.maxSentiment !== undefined) {
    query.sentimentScore = {};
    if (filters.minSentiment !== undefined) {
      query.sentimentScore.$gte = parseFloat(filters.minSentiment);
    }
    if (filters.maxSentiment !== undefined) {
      query.sentimentScore.$lte = parseFloat(filters.maxSentiment);
    }
  }

  return query;
}

function parseUserAgent(userAgent) {
  if (!userAgent) {
    return { browser: "Unknown", os: "Unknown", device: "Unknown" };
  }

  let browser = "Unknown";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    browser = "Opera";
  }

  let os = "Unknown";
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "macOS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  }

  let device = "Desktop";
  if (userAgent.includes("Mobile") || userAgent.includes("Android")) {
    device = "Mobile";
  } else if (userAgent.includes("iPad") || userAgent.includes("Tablet")) {
    device = "Tablet";
  }

  return { browser, os, device };
}

module.exports = {
  generateSlug,
  sanitizeHtml,
  paginate,
  buildFilterQuery,
  parseUserAgent,
};
