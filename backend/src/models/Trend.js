const mongoose = require("mongoose");

const trendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trend name is required"],
      unique: true,
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [5000, "Description cannot exceed 5000 characters"],
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
    currentGrowth: {
      type: Number,
      default: 0,
    },
    momentum: {
      type: Number,
      min: [0, "Momentum must be at least 0"],
      max: [100, "Momentum cannot exceed 100"],
      default: 0,
    },
    stage: {
      type: String,
      enum: {
        values: ["Emerging", "Growing", "Mature", "Declining"],
        message: "Invalid stage",
      },
      default: "Emerging",
    },
    historicalData: [
      {
        date: { type: Date, required: true },
        growth: { type: Number, required: true },
        momentum: { type: Number, required: true },
      },
    ],
    relatedTechnologies: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    marketInsights: {
      type: String,
      default: "",
    },
    keyPlayers: [
      {
        name: { type: String, required: true },
        role: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
    useCases: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
      },
    ],
    metrics: {
      polarity: {
        type: Number,
        min: -1,
        max: 1,
        default: 0,
      },
    },
    forecast: {
      shortTerm: { type: String, default: "" },
      mediumTerm: { type: String, default: "" },
      longTerm: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

trendSchema.index({ category: 1, currentGrowth: -1 });
trendSchema.index({ stage: 1 });
trendSchema.index({ name: "text", description: "text" });

trendSchema.virtual("healthScore").get(function () {
  const momentumWeight = this.momentum * 0.4;
  const growthNormalized = Math.min(Math.max(this.currentGrowth, -100), 100) / 100;
  const growthWeight = growthNormalized * 30;
  const stageWeight = { Emerging: 20, Growing: 30, Mature: 15, Declining: 5 }[this.stage] || 0;
  const polarityWeight = this.metrics.polarity * 5;
  return parseFloat((momentumWeight + growthWeight + stageWeight + polarityWeight).toFixed(2));
});

trendSchema.virtual("trendDirection").get(function () {
  if (this.historicalData.length < 2) {
    return "insufficient-data";
  }
  const recent = this.historicalData.slice(-3);
  const avgRecent = recent.reduce((sum, d) => sum + d.growth, 0) / recent.length;
  const older = this.historicalData.slice(0, Math.max(1, this.historicalData.length - 3));
  const avgOlder = older.reduce((sum, d) => sum + d.growth, 0) / older.length;

  const diff = avgRecent - avgOlder;
  if (diff > 1) {
    return "accelerating";
  }
  if (diff < -1) {
    return "decelerating";
  }
  return "stable";
});

trendSchema.virtual("growthVelocity").get(function () {
  if (this.historicalData.length < 2) {
    return 0;
  }
  const latest = this.historicalData[this.historicalData.length - 1];
  const previous = this.historicalData[this.historicalData.length - 2];
  const timeDiff = (latest.date - previous.date) / (1000 * 60 * 60 * 24);
  if (timeDiff === 0) {
    return 0;
  }
  return parseFloat(((latest.growth - previous.growth) / timeDiff).toFixed(4));
});

trendSchema.statics.findByCategory = function (category, options = {}) {
  const { page = 1, limit = 20, sort = { currentGrowth: -1 } } = options;
  return this.find({ category })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

trendSchema.statics.findByStage = function (stage, options = {}) {
  const { page = 1, limit = 20, sort = { currentGrowth: -1 } } = options;
  return this.find({ stage })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

trendSchema.statics.findTopTrending = function (limit = 10) {
  return this.find()
    .sort({ momentum: -1, currentGrowth: -1 })
    .limit(limit);
};

trendSchema.statics.findEmerging = function (limit = 10) {
  return this.find({ stage: "Emerging" })
    .sort({ currentGrowth: -1 })
    .limit(limit);
};

trendSchema.statics.findDeclining = function (limit = 10) {
  return this.find({ stage: "Declining" })
    .sort({ currentGrowth: 1 })
    .limit(limit);
};

trendSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

module.exports = mongoose.model("Trend", trendSchema);
