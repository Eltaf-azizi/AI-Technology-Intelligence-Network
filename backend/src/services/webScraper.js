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
