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
