const express = require("express");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");
const { validateNotificationSettings } = require("../middleware/validation");
const { paginate } = require("../utils/helpers");
const logger = require("../utils/logger");

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);

    const query = { userId: req.user._id };

    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === "true";
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    const [items, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
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

router.get("/unread-count", async (req, res, next) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    res.json({ data: { count } });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ data: notification });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid notification ID" });
    }
    next(error);
  }
});

router.post("/read-all", async (req, res, next) => {
  try {
    const result = await Notification.markAllAsRead(req.user._id);

    logger.info("All notifications marked as read", { userId: req.user._id, count: result.modifiedCount });

    res.json({
      message: "All notifications marked as read",
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    logger.info("Notification deleted", { notificationId: req.params.id, userId: req.user._id });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid notification ID" });
    }
    next(error);
  }
});

router.post("/settings", validateNotificationSettings, async (req, res, next) => {
  try {
    const updates = {};
    const { email, push, trends, sentiment } = req.body;

    if (email !== undefined) updates["preferences.notifications.email"] = email;
    if (push !== undefined) updates["preferences.notifications.push"] = push;
    if (trends !== undefined) updates["preferences.notifications.trends"] = trends;
    if (sentiment !== undefined) updates["preferences.notifications.sentiment"] = sentiment;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid notification settings provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -refreshTokens");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info("Notification settings updated", { userId: req.user._id });

    res.json({
      message: "Notification settings updated",
      data: { notifications: user.preferences.notifications },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
