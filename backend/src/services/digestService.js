const News = require('../models/News');
const Trend = require('../models/Trend');
const Sentiment = require('../models/Sentiment');

async function buildDailyDigest() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);


  try {
    const [recentNews, recentTrends, sentimentSummary] = await Promise.all([
      News.find({ publishedAt: { $gte: sevenDaysAgo } })
        .sort({ publishedAt: -1 })
        .limit(6)
        .lean(),
      Trend.find({ updatedAt: { $gte: sevenDaysAgo } })
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),
      Sentiment.aggregate([
        { $match: { analyzedAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$score' },
            total: { $sum: 1 },
            positive: { $sum: { $cond: [{ $eq: ['$label', 'positive'] }, 1, 0] } },
            negative: { $sum: { $cond: [{ $eq: ['$label', 'negative'] }, 1, 0] } },
            neutral: { $sum: { $cond: [{ $eq: ['$label', 'neutral'] }, 1, 0] } },
          },
        },
      ]),
    ]);

  }
}

module.exports = {
  buildDailyDigest,
};
