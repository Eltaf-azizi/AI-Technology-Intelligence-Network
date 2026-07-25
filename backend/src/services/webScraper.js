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

async function extractRSSFeed(feedUrl) {
  try {
    const response = await fetchWithRetry(feedUrl);
    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("xml") && !contentType.includes("rss") && !contentType.includes("atom")) {
      const $ = cheerio.load(response.data);
      const rssLink = $('link[type="application/rss+xml"], link[type="application/atom+xml"]').first().attr("href");
      if (rssLink) {
        const absoluteUrl = new URL(rssLink, feedUrl).href;
        return extractRSSFeed(absoluteUrl);
      }
    }

    const $ = cheerio.load(response.data, { xmlMode: true });

    const items = [];
    const entries = $("entry, item");

    entries.each((i, el) => {
      const $el = $(el);
      const title = $el.find("title").first().text().trim();
      const link = $el.find("link").first().attr("href") || $el.find("link").first().text().trim();
      const description = $el.find("description, summary, content\\:encoded").first().text().trim();
      const pubDate = $el.find("published, updated, pubDate").first().text().trim();

      if (title && link) {
        items.push({
          title,
          url: link,
          description: description.substring(0, 2000),
          publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        });
      }
    });

    return {
      feedUrl,
      itemCount: items.length,
      items,
    };
  } catch (error) {
    logger.error("RSS feed extraction error", { feedUrl, error: error.message });
    return { feedUrl, itemCount: 0, items: [], error: error.message };
  }
}

async function batchScrape(urls, concurrency = MAX_CONCURRENT) {
  const results = [];
  const queue = [...urls];
  const active = [];

  while (queue.length > 0 || active.length > 0) {
    while (active.length < concurrency && queue.length > 0) {
      const url = queue.shift();
      const promise = scrapeArticle(url)
        .then((result) => {
          active.splice(active.indexOf(promise), 1);
          results.push({ url, success: true, data: result });
        })
        .catch((error) => {
          active.splice(active.indexOf(promise), 1);
          results.push({ url, success: false, error: error.message });
        });
      active.push(promise);
    }

    if (active.length > 0) {
      await Promise.race(active);
    }
  }

  return results;
}

async function fetchWithRetry(url, retryCount = 0) {
  try {
    const response = await axios.get(url, {
      timeout: REQUEST_TIMEOUT,
      maxRedirects: 10,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      responseType: "text",
    });

    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES && isRetryableError(error)) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      logger.warn("Retrying request", { url, attempt: retryCount + 1, delayMs: delay });
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, retryCount + 1);
    }
    throw error;
  }
}

function isRetryableError(error) {
  if (error.response) {
    const status = error.response.status;
    return status === 429 || status === 503 || status === 502 || status === 500;
  }
  return error.code === "ECONNRESET" || error.code === "ETIMEDOUT" || error.code === "ENOTFOUND";
}

module.exports = {
  scrapeArticle,
  validateSource,
  extractRSSFeed,
  batchScrape,
};
