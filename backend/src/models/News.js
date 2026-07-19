const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [500, "Title cannot exceed 500 characters"],
    },
    source: {
      url: {
        type: String,
        required: [true, "Source URL is required"],
        trim: true,
      },
      name: {
        type: String,
        required: [true, "Source name is required"],
        trim: true,
      },
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      maxlength: [2000, "Summary cannot exceed 2000 characters"],
    },
    content: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "artificial-intelligence",
          "machine-learning",
          "deep-learning",
          "nlp",
          "computer-vision",
          "robotics",
          "data-science",
          "cloud-computing",
          "cybersecurity",
          "blockchain",
          "quantum-computing",
          "iot",
          "ar-vr",
          "biotech",
          "fintech",
          "general",
        ],
        message: "Invalid category",
      },
    },
    technologies: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    sentimentScore: {
      type: Number,
      min: [-1, "Sentiment score must be between -1 and 1"],
      max: [1, "Sentiment score must be between -1 and 1"],
      default: 0,
    },
    sentimentLabel: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    publishedAt: {
      type: Date,
      required: [true, "Published date is required"],
      default: Date.now,
    },
    author: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

newsSchema.index({ title: "text", summary: "text", content: "text", tags: "text" });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ technologies: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ sentimentScore: 1 });
newsSchema.index({ tags: 1 });

newsSchema.virtual("age").get(function () {
  const now = new Date();
  const diffMs = now - this.publishedAt;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return "just now";
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return this.publishedAt.toISOString().split("T")[0];
});

newsSchema.virtual("engagementScore").get(function () {
  const recencyBoost = Math.max(0, 1 - (Date.now() - this.publishedAt) / (7 * 24 * 60 * 60 * 1000));
  const sentimentWeight = Math.abs(this.sentimentScore) * 0.3;
  const tagWeight = Math.min(this.tags.length * 0.1, 0.3);
  return parseFloat((recencyBoost * 0.4 + sentimentWeight + tagWeight + 0.1).toFixed(4));
});

newsSchema.statics.findByCategory = function (category, options = {}) {
  const { page = 1, limit = 20, sort = { publishedAt: -1 } } = options;
  return this.find({ category })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

newsSchema.statics.findByTechnology = function (technology, options = {}) {
  const { page = 1, limit = 20, sort = { publishedAt: -1 } } = options;
  return this.find({ technologies: technology.toLowerCase() })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

newsSchema.statics.findBySentiment = function (label, options = {}) {
  const { page = 1, limit = 20, sort = { publishedAt: -1 } } = options;
  return this.find({ sentimentLabel: label })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

newsSchema.statics.findTrending = function (limit = 10) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.aggregate([
    { $match: { publishedAt: { $gte: sevenDaysAgo } } },
    {
      $addFields: {
        recencyScore: {
          $subtract: [1, { $divide: [{ $subtract: ["$$NOW", "$publishedAt"] }, 7 * 24 * 60 * 60 * 1000] }],
        },
        absSentiment: { $abs: "$sentimentScore" },
      },
    },
    {
      $addFields: {
        trendingScore: {
          $add: [{ $multiply: ["$recencyScore", 0.4] }, { $multiply: ["$absSentiment", 0.3] }],
        },
      },
    },
    { $sort: { trendingScore: -1 } },
    { $limit: limit },
  ]);
};

newsSchema.statics.searchText = function (query, options = {}) {
  const { page = 1, limit = 20 } = options;
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = mongoose.model("News", newsSchema);
