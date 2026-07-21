const express = require("express");
const News = require("../models/News");
const Trend = require("../models/Trend");
const Sentiment = require("../models/Sentiment");
const { authenticate } = require("../middleware/auth");
const { paginate } = require("../utils/helpers");
const logger = require("../utils/logger");

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalNews,
      totalTrends,
      newsLast7Days,
      sentimentAgg,
      categoryBreakdown,
      recentNews,
      recentTrends,
      topSentiments,
    ] = await Promise.all([
      News.countDocuments(),
      Trend.countDocuments(),
      News.countDocuments({ publishedAt: { $gte: sevenDaysAgo } }),
      Sentiment.aggregate([
        {
          $match: { analyzedAt: { $gte: thirtyDaysAgo } },
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: "$score" },
            total: { $sum: 1 },
            positive: { $sum: { $cond: [{ $eq: ["$label", "positive"] }, 1, 0] } },
            negative: { $sum: { $cond: [{ $eq: ["$label", "negative"] }, 1, 0] } },
            neutral: { $sum: { $cond: [{ $eq: ["$label", "neutral"] }, 1, 0] } },
          },
        },
      ]),
      News.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      News.find().sort({ publishedAt: -1 }).limit(5).lean(),
      Trend.find().sort({ updatedAt: -1 }).limit(5).lean(),
      Sentiment.getTopTrending(5, 7),
    ]);

    const sentimentSummary = sentimentAgg[0] || {
      avgScore: 0,
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    res.json({
      data: {
        totals: {
          news: totalNews,
          trends: totalTrends,
          newsLast7Days,
        },
        sentiment: {
          averageScore: parseFloat(sentimentSummary.avgScore.toFixed(4)) || 0,
          totalEntries: sentimentSummary.total,
          distribution: {
            positive: sentimentSummary.positive,
            negative: sentimentSummary.negative,
            neutral: sentimentSummary.neutral,
          },
        },
        topCategories: categoryBreakdown.map((c) => ({
          category: c._id,
          count: c.count,
        })),
        recentActivity: {
          news: recentNews,
          trends: recentTrends,
        },
        topSentiments,
      },
    });
  } catch (error) {
    next(error);
  }
});
