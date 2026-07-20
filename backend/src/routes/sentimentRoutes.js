const express = require("express");
const Sentiment = require("../models/Sentiment");
const { authenticate, requireRole } = require("../middleware/auth");
const { paginate } = require("../utils/helpers");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);

    const query = {};
    if (req.query.technology) {
      query.technology = req.query.technology.toLowerCase();
    }
    if (req.query.label) {
      query.label = req.query.label;
    }
    if (req.query.source) {
      query.source = req.query.source;
    }
    if (req.query.dateFrom || req.query.dateTo) {
      query.analyzedAt = {};
      if (req.query.dateFrom) {
        query.analyzedAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        query.analyzedAt.$lte = new Date(req.query.dateTo);
      }
    }

    const [items, total] = await Promise.all([
      Sentiment.find(query)
        .sort({ analyzedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Sentiment.countDocuments(query),
    ]);

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/summary", authenticate, async (req, res, next) => {
  try {
    const { technology } = req.query;

    if (!technology) {
      return res.status(400).json({ error: "Technology query parameter is required" });
    }

    const startDate = req.query.startDate || undefined;
    const endDate = req.query.endDate || undefined;

    const [summaryData, trendData] = await Promise.all([
      Sentiment.getAverageScore(technology, startDate, endDate),
      Sentiment.getSentimentTrend(technology, parseInt(req.query.days, 10) || 30),
    ]);

    const summary = summaryData[0] || {
      averageScore: 0,
      totalEntries: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      avgConfidence: 0.5,
    };

    res.json({
      data: {
        technology,
        averageScore: parseFloat((summary.averageScore || 0).toFixed(4)),
        totalEntries: summary.totalEntries,
        distribution: {
          positive: summary.positiveCount,
          negative: summary.negativeCount,
          neutral: summary.neutralCount,
        },
        averageConfidence: parseFloat((summary.avgConfidence || 0.5).toFixed(4)),
        trend: trendData,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/trends", authenticate, async (req, res, next) => {
  try {
    const { technology } = req.query;
    const days = parseInt(req.query.days, 10) || 30;

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

router.post("/", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    const { technology, source, score, label, text, metadata } = req.body;

    if (!technology) {
      return res.status(400).json({ error: "Technology is required" });
    }
    if (!source) {
      return res.status(400).json({ error: "Source is required" });
    }
    if (score === undefined || score === null) {
      return res.status(400).json({ error: "Score is required" });
    }
    if (typeof score !== "number" || score < -1 || score > 1) {
      return res.status(400).json({ error: "Score must be a number between -1 and 1" });
    }
    if (!label || !["positive", "negative", "neutral"].includes(label)) {
      return res.status(400).json({ error: "Label must be positive, negative, or neutral" });
    }
    if (!text) {
      return res.status(400).json({ error: "Analyzed text is required" });
    }

    const sentiment = new Sentiment({
      technology: technology.toLowerCase(),
      source,
      score,
      label,
      text,
      metadata: {
        model: (metadata && metadata.model) || "default",
        version: (metadata && metadata.version) || "1.0",
        confidence: (metadata && metadata.confidence) || 0.5,
        sourceType: (metadata && metadata.sourceType) || "other",
      },
    });

    await sentiment.save();

    logger.info("Sentiment entry created", { sentimentId: sentiment._id, technology, adminId: req.user._id });

    res.status(201).json({ data: sentiment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
