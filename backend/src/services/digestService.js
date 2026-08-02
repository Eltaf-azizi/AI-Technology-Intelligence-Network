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

    const sentiment = sentimentSummary[0] || {
      avgScore: 0,
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    const topNews = recentNews.slice(0, 3);
    const topTrends = recentTrends.slice(0, 3);

    const insightBits = [];
    if (topNews.length > 0) {
      insightBits.push(`${topNews.length} recent news items captured this week`);
    }
    if (topTrends.length > 0) {
      insightBits.push(`${topTrends.length} trend updates refreshed recently`);
    }
    if (sentiment.total > 0) {
      const sentimentLabel = sentiment.avgScore >= 0.1 ? 'positive' : sentiment.avgScore <= -0.1 ? 'negative' : 'neutral';
      insightBits.push(`Overall sentiment is ${sentimentLabel} with an average score of ${parseFloat(sentiment.avgScore.toFixed(2))}`);
    }

    return {
      generatedAt: now.toISOString(),
      summary: insightBits.join(' • '),
      highlights: {
        newsCount: recentNews.length,
        trendCount: recentTrends.length,
        sentimentScore: parseFloat(sentiment.avgScore.toFixed(2)) || 0,
        positiveCount: sentiment.positive,
        negativeCount: sentiment.negative,
        neutralCount: sentiment.neutral,
      },
      news: topNews.map((item) => ({
        id: item._id,
        title: item.title,
        source: item.source,
        sentimentLabel: item.sentimentLabel || 'neutral',
      })),
      trends: topTrends.map((item) => ({
        id: item._id,
        name: item.name,
        stage: item.stage,
        growthRate: item.growthRate,
      })),
    };
  } catch (error) {
    return {
      generatedAt: now.toISOString(),
      summary: 'Live data is currently unavailable. The digest will refresh once the data sources are reachable.',
      highlights: {
        newsCount: 0,
        trendCount: 0,
        sentimentScore: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
      },
      news: [],
      trends: [],
    };
  }
}

module.exports = {
  buildDailyDigest,
};
