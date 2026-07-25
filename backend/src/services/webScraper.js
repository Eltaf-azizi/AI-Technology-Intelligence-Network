const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("../utils/logger");

const MAX_CONCURRENT = 5;
const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const USER_AGENT = "ATIN-WebScraper/2.0 (AI Technology Intelligence Network)";

async function scrapeArticle(url) {
  const response = await fetchWithRetry(url);
  const $ = cheerio.load(response.data);

  const title = extractTitle($);
  const content = extractContent($);
  const metadata = extractMetadata($, url);
  const author = extractAuthor($);
  const publishedAt = extractPublishedDate($);

  return {
    url,
    title,
    content,
    summary: content.substring(0, 500),
    metadata,
    author,
    publishedAt,
    scrapedAt: new Date().toISOString(),
  };
}

function extractTitle($) {
  const selectors = [
    'meta[property="og:title"]',
    "title",
    "h1",
    'meta[name="twitter:title"]',
    ".article-title",
    ".post-title",
    ".entry-title",
  ];

  for (const selector of selectors) {
    const element = $(selector);
    if (element.length) {
      const content = element.attr("content") || element.text();
      if (content && content.trim().length > 0) {
        return content.trim().substring(0, 500);
      }
    }
  }

  return "Untitled";
}

function extractContent($) {
  const selectors = [
    "article",
    '[role="main"]',
    ".article-content",
    ".post-content",
    ".entry-content",
    ".story-body",
    "#article-body",
    ".content-body",
    "main",
  ];

  for (const selector of selectors) {
    const element = $(selector);
    if (element.length) {
      element.find("script, style, nav, header, footer, aside, .ad, .advertisement, .social-share").remove();
      const text = element.text().replace(/\s+/g, " ").trim();
      if (text.length > 100) {
        return text.substring(0, 50000);
      }
    }
  }

  $("script, style, nav, header, footer, aside, .ad, .advertisement").remove();
  return $("body").text().replace(/\s+/g, " ").trim().substring(0, 50000);
}

function extractMetadata($, url) {
  const getMeta = (selectors) => {
    for (const selector of selectors) {
      const el = $(selector);
      if (el.length) {
        return (el.attr("content") || el.text()).trim();
      }
    }
    return "";
  };

  return {
    description: getMeta([
      'meta[property="og:description"]',
      'meta[name="description"]',
      'meta[name="twitter:description"]',
    ]),
    imageUrl: getMeta([
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]),
    siteName: getMeta([
      'meta[property="og:site_name"]',
      'meta[name="application-name"]',
    ]),
    type: getMeta(['meta[property="og:type"]']),
    language: $("html").attr("lang") || "",
    keywords: getMeta(['meta[name="keywords"]']),
  };
}

function extractAuthor($) {
  const selectors = [
    'meta[name="author"]',
    'meta[property="article:author"]',
    ".author-name",
    ".byline",
    '[rel="author"]',
    ".article-author",
    '[class*="author"]',
  ];

  for (const selector of selectors) {
    const el = $(selector);
    if (el.length) {
      const content = el.attr("content") || el.text();
      if (content && content.trim().length > 0 && content.trim().length < 200) {
        return content.trim();
      }
    }
  }

  return "Unknown";
}

function extractPublishedDate($) {
  const selectors = [
    'meta[property="article:published_time"]',
    'meta[name="date"]',
    'meta[name="publish-date"]',
    'meta[name="article:published_time"]',
    "time[datetime]",
    ".published-date",
    ".post-date",
    ".article-date",
  ];

  for (const selector of selectors) {
    const el = $(selector);
    if (el.length) {
      const dateStr = el.attr("content") || el.attr("datetime") || el.text();
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  }

  return new Date().toISOString();
}

async function validateSource(url) {
  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS URLs are supported" };
    }

    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 5,
      headers: { "User-Agent": USER_AGENT },
    });

    return {
      valid: response.status >= 200 && response.status < 400,
      status: response.status,
      contentType: response.headers["content-type"] || "",
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}
