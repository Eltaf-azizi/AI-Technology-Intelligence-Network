const express = require("express");
const News = require("../models/News");
const { authenticate, optionalAuth, requireRole } = require("../middleware/auth");
const { validateNewsCreate, handleValidation } = require("../middleware/validation");
const { paginate, buildFilterQuery } = require("../utils/helpers");
const logger = require("../utils/logger");
const sentimentAnalysis = require("../services/sentimentAnalysis");

const router = express.Router();

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);

    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.technology) filters.technology = req.query.technology;
    if (req.query.sentiment) filters.sentiment = req.query.sentiment;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;

    const query = buildFilterQuery(filters);

    const [items, total] = await Promise.all([
      News.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(query),
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

router.get("/trending", optionalAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const items = await News.findTrending(limit);
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
});

router.get("/search", optionalAuth, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: "Search query 'q' is required" });
    }

    const { page, limit } = paginate(req.query.page, req.query.limit);
    const items = await News.searchText(q.trim(), { page, limit });
    const total = await News.countDocuments({ $text: { $search: q.trim() } });

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

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id).lean();
    if (!item) {
      return res.status(404).json({ error: "News article not found" });
    }
    res.json({ data: item });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid news ID" });
    }
    next(error);
  }
});

