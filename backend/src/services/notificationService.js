const Notification = require("../models/Notification");
const logger = require("../utils/logger");

let io = null;

function setSocketIO(socketIO) {
  io = socketIO;
}

async function createNotification(userId, type, title, message, data = {}) {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data: {
        entityType: data.entityType || undefined,
        entityId: data.entityId || undefined,
        url: data.url || undefined,
      },
      priority: data.priority || "medium",
      groupKey: data.groupKey || undefined,
      expiresAt: data.expiresAt || undefined,
    });

    await notification.save();

    if (io) {
      io.to(`user:${userId}`).emit("notification", {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: notification.priority,
        createdAt: notification.createdAt,
      });
    }

    logger.info("Notification created", {
      notificationId: notification._id,
      userId,
      type,
    });

    return notification;
  } catch (error) {
    logger.error("Failed to create notification", {
      userId,
      type,
      error: error.message,
    });
    throw error;
  }
}

async function sendBulk(userIds, notificationData) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  const { type, title, message, data = {}, priority, groupKey, expiresAt } = notificationData;

  const notifications = userIds.map((userId) => ({
    userId,
    type,
    title,
    message,
    data: {
      entityType: data.entityType || undefined,
      entityId: data.entityId || undefined,
      url: data.url || undefined,
    },
    priority: priority || "medium",
    groupKey: groupKey || undefined,
    expiresAt: expiresAt || undefined,
  }));

  try {
    const created = await Notification.insertMany(notifications, { ordered: false });

    if (io) {
      for (const userId of userIds) {
        const userNotifications = created.filter(
          (n) => n.userId.toString() === userId.toString()
        );
        if (userNotifications.length > 0) {
          io.to(`user:${userId}`).emit("notifications-batch", userNotifications.map((n) => ({
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            data: n.data,
            priority: n.priority,
            createdAt: n.createdAt,
          })));
        }
      }
    }

    logger.info("Bulk notifications sent", {
      count: created.length,
      type,
      title,
    });

    return created;
  } catch (error) {
    logger.error("Failed to send bulk notifications", {
      count: userIds.length,
      error: error.message,
    });
    throw error;
  }
}

async function getDigest(userId, days = 7) {
  try {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [notifications, summary] = await Promise.all([
      Notification.find({
        userId,
        createdAt: { $gte: cutoffDate },
        isRead: false,
      })
        .sort({ priority: 1, createdAt: -1 })
        .limit(50)
        .lean(),
      Notification.getSummary(userId),
    ]);

    const summaryData = summary[0] || {
      total: 0,
      unread: 0,
      alerts: 0,
      updates: 0,
      urgentCount: 0,
    };

    return {
      period: {
        from: cutoffDate.toISOString(),
        to: new Date().toISOString(),
        days,
      },
      summary: summaryData,
      notifications,
    };
  } catch (error) {
    logger.error("Failed to get notification digest", {
      userId,
      error: error.message,
    });
    throw error;
  }
}

async function cleanupOld(maxAgeDays = 90) {
  try {
    const cutoffDate = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    });

    logger.info("Old notifications cleaned up", {
      deletedCount: result.deletedCount,
      olderThan: cutoffDate.toISOString(),
    });

    return { deletedCount: result.deletedCount };
  } catch (error) {
    logger.error("Failed to cleanup old notifications", {
      error: error.message,
    });
    throw error;
  }
}

module.exports = {
  setSocketIO,
  createNotification,
  sendBulk,
  getDigest,
  cleanupOld,
};
