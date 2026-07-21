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


router.get("/sentiment-trends", async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const technology = req.query.technology;

    if (!technology) {
      return res.status(400).json({ error: "Technology query parameter is required" });
    }

    const trendData = await Sentiment.getSentimentTrend(technology, days);

    res.json({
      data: {
        technology,
        days,
        trend: trendData,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/technology-distribution", async (req, res, next) => {
  try {
    const distribution = await News.aggregate([
      { $unwind: "$technologies" },
      { $group: { _id: "$technologies", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);

    const categoryDistribution = await News.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      data: {
        byTechnology: distribution.map((d) => ({ technology: d._id, count: d.count })),
        byCategory: categoryDistribution.map((c) => ({ category: c._id, count: c.count })),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/growth-comparison", async (req, res, next) => {
  try {
    const techsParam = req.query.techs;
    if (!techsParam) {
      return res.status(400).json({ error: "techs query parameter is required" });
    }

    const techs = Array.isArray(techsParam) ? techsParam : techsParam.split(",").map((t) => t.trim().toLowerCase());

    if (techs.length === 0) {
      return res.status(400).json({ error: "At least one technology is required" });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const comparisons = await Promise.all(
      techs.map(async (tech) => {
        const [recentCount, previousCount] = await Promise.all([
          News.countDocuments({ technologies: tech, publishedAt: { $gte: thirtyDaysAgo } }),
          News.countDocuments({ technologies: tech, publishedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
        ]);

        const growthRate = previousCount > 0
          ? ((recentCount - previousCount) / previousCount) * 100
          : recentCount > 0
            ? 100
            : 0;

        return {
          technology: tech,
          recentCount,
          previousCount,
          growthRate: parseFloat(growthRate.toFixed(2)),
        };
      })
    );

    comparisons.sort((a, b) => b.growthRate - a.growthRate);

    res.json({ data: comparisons });
  } catch (error) {
    next(error);
  }
});
