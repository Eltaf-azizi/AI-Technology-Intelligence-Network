const express = require("express");
const Trend = require("../models/Trend");
const { authenticate, optionalAuth, requireRole } = require("../middleware/auth");
const { validateTrendQuery, handleValidation } = require("../middleware/validation");
const { paginate } = require("../utils/helpers");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/", optionalAuth, validateTrendQuery, async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.stage) query.stage = req.query.stage;

    const sortField = req.query.sort || "currentGrowth";
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [items, total] = await Promise.all([
      Trend.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Trend.countDocuments(query),
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

router.get("/emerging", optionalAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const items = await Trend.findEmerging(limit);
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
});

router.get("/declining", optionalAuth, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const items = await Trend.findDeclining(limit);
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
});

router.get("/categories", optionalAuth, async (req, res, next) => {
  try {
    const categories = await Trend.distinct("category");
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
});

router.get("/compare", optionalAuth, async (req, res, next) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: "ids query parameter is required" });
    }

    const ids = Array.isArray(idsParam) ? idsParam : idsParam.split(",").map((id) => id.trim());

    if (ids.length === 0) {
      return res.status(400).json({ error: "At least one trend ID is required" });
    }

    if (ids.length > 10) {
      return res.status(400).json({ error: "Cannot compare more than 10 trends at once" });
    }

    const trends = await Trend.find({ _id: { $in: ids } }).lean();

    if (trends.length === 0) {
      return res.status(404).json({ error: "No trends found for the given IDs" });
    }

    res.json({
      data: trends,
      comparison: {
        count: trends.length,
        byGrowth: [...trends].sort((a, b) => b.currentGrowth - a.currentGrowth).map((t) => ({
          id: t._id,
          name: t.name,
          growth: t.currentGrowth,
        })),
        byMomentum: [...trends].sort((a, b) => b.momentum - a.momentum).map((t) => ({
          id: t._id,
          name: t.name,
          momentum: t.momentum,
        })),
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid trend ID format" });
    }
    next(error);
  }
});

router.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const item = await Trend.findOne({ slug: req.params.slug }).lean();
    if (!item) {
      return res.status(404).json({ error: "Trend not found" });
    }
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authenticate, requireRole("admin"), handleValidation, async (req, res, next) => {
  try {
    const allowedFields = [
      "name", "description", "category", "currentGrowth", "momentum",
      "stage", "relatedTechnologies", "marketInsights", "keyPlayers",
      "useCases", "metrics", "forecast",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const item = await Trend.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: "Trend not found" });
    }

    logger.info("Trend updated", { trendId: item._id, adminId: req.user._id });

    res.json({ data: item });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid trend ID" });
    }
    next(error);
  }
});

module.exports = router;
