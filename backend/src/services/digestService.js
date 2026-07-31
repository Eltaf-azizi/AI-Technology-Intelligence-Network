const News = require('../models/News');
const Trend = require('../models/Trend');
const Sentiment = require('../models/Sentiment');

async function buildDailyDigest() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  
}

module.exports = {
  buildDailyDigest,
};
