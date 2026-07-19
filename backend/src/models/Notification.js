const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: ["alert", "update", "recommendation", "system", "trend", "sentiment"],
        message: "Invalid notification type",
      },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    data: {
      entityType: {
        type: String,
        enum: ["news", "trend", "sentiment", "user", "system"],
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      url: {
        type: String,
        trim: true,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Invalid priority",
      },
      default: "medium",
    },
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 },
    },
    groupKey: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, priority: 1, createdAt: -1 });

notificationSchema.statics.findUnread = function (userId, options = {}) {
  const { page = 1, limit = 50 } = options;
  return this.find({ userId, isRead: false })
    .sort({ priority: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.getSummary = function (userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: ["$isRead", 0, 1] } },
        byType: {
          $push: {
            $cond: ["$isRead", null, "$type"],
          },
        },
        byPriority: {
          $push: {
            $cond: ["$isRead", null, "$priority"],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        unread: 1,
        alerts: {
          $size: {
            $filter: {
              input: "$byType",
              as: "t",
              cond: { $eq: ["$$t", "alert"] },
            },
          },
        },
        updates: {
          $size: {
            $filter: {
              input: "$byType",
              as: "t",
              cond: { $eq: ["$$t", "update"] },
            },
          },
        },
        urgentCount: {
          $size: {
            $filter: {
              input: "$byPriority",
              as: "p",
              cond: { $eq: ["$$p", "urgent"] },
            },
          },
        },
      },
    },
  ]);
};

module.exports = mongoose.model("Notification", notificationSchema);
