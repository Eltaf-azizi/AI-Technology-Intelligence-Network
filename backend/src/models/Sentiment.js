const mongoose = require("mongoose");

const sentimentSchema = new mongoose.Schema(
  {
    technology: {
      type: String,
      required: [true, "Technology name is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [-1, "Score must be between -1 and 1"],
      max: [1, "Score must be between -1 and 1"],
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      enum: {
        values: ["positive", "negative", "neutral"],
        message: "Label must be positive, negative, or neutral",
      },
    },
    text: {
      type: String,
      required: [true, "Analyzed text is required"],
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      model: { type: String, default: "default" },
      version: { type: String, default: "1.0" },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
      },
      sourceType: {
        type: String,
        enum: ["news", "social", "review", "forum", "other"],
        default: "other",
      },
    },
  },
  {
    timestamps: true,
  }
);

sentimentSchema.index({ technology: 1, analyzedAt: -1 });
sentimentSchema.index({ label: 1, analyzedAt: -1 });

sentimentSchema.statics.getAverageScore = function (technology, startDate, endDate) {
  const matchStage = { technology: technology.toLowerCase() };

  if (startDate || endDate) {
    matchStage.analyzedAt = {};
    if (startDate) {
      matchStage.analyzedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      matchStage.analyzedAt.$lte = new Date(endDate);
    }
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$technology",
        averageScore: { $avg: "$score" },
        totalEntries: { $sum: 1 },
        positiveCount: { $sum: { $cond: [{ $eq: ["$label", "positive"] }, 1, 0] } },
        negativeCount: { $sum: { $cond: [{ $eq: ["$label", "negative"] }, 1, 0] } },
        neutralCount: { $sum: { $cond: [{ $eq: ["$label", "neutral"] }, 1, 0] } },
        avgConfidence: { $avg: "$metadata.confidence" },
      },
    },
  ]);
};

sentimentSchema.statics.getSentimentTrend = function (technology, days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return this.aggregate([
    {
      $match: {
        technology: technology.toLowerCase(),
        analyzedAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$analyzedAt" },
        },
        averageScore: { $avg: "$score" },
        count: { $sum: 1 },
        positiveCount: { $sum: { $cond: [{ $eq: ["$label", "positive"] }, 1, 0] } },
        negativeCount: { $sum: { $cond: [{ $eq: ["$label", "negative"] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        averageScore: { $round: ["$averageScore", 4] },
        count: 1,
        positiveCount: 1,
        negativeCount: 1,
        _id: 0,
      },
    },
  ]);
};

sentimentSchema.statics.getSentimentBySource = function (technology, options = {}) {
  const { startDate, endDate, minEntries = 5 } = options;

  const matchStage = { technology: technology.toLowerCase() };
  if (startDate || endDate) {
    matchStage.analyzedAt = {};
    if (startDate) {
      matchStage.analyzedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      matchStage.analyzedAt.$lte = new Date(endDate);
    }
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$source",
        averageScore: { $avg: "$score" },
        totalEntries: { $sum: 1 },
        lastAnalyzed: { $max: "$analyzedAt" },
      },
    },
    { $match: { totalEntries: { $gte: minEntries } } },
    { $sort: { averageScore: -1 } },
  ]);
};

sentimentSchema.statics.getTopTrending = function (limit = 10, days = 7) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return this.aggregate([
    { $match: { analyzedAt: { $gte: startDate } } },
    {
      $group: {
        _id: "$technology",
        averageScore: { $avg: "$score" },
        totalEntries: { $sum: 1 },
        latestScore: { $last: "$score" },
      },
    },
    { $match: { totalEntries: { $gte: 3 } } },
    { $sort: { totalEntries: -1, averageScore: -1 } },
    { $limit: limit },
    {
      $project: {
        technology: "$_id",
        averageScore: { $round: ["$averageScore", 4] },
        totalEntries: 1,
        latestScore: 1,
        _id: 0,
      },
    },
  ]);
};

module.exports = mongoose.model("Sentiment", sentimentSchema);
