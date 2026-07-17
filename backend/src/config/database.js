const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectDatabase(retryCount = 0) {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/atin";

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info("Connected to MongoDB", { uri: uri.replace(/\/\/.*@/, "//***@") });
    setupEventHandlers();
    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection error", {
      attempt: retryCount + 1,
      maxRetries: MAX_RETRIES,
      error: error.message,
    });

    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying connection in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDatabase(retryCount + 1);
    }

    logger.error("Max MongoDB connection retries reached. Exiting.");
    process.exit(1);
  }
}

function setupEventHandlers() {
  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error event", { error: err.message });
  });

  process.on("SIGINT", async () => {
    logger.info("SIGINT received. Closing MongoDB connection...");
    await mongoose.connection.close();
    logger.info("MongoDB connection closed due to application termination");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received. Closing MongoDB connection...");
    await mongoose.connection.close();
    logger.info("MongoDB connection closed due to application termination");
    process.exit(0);
  });
}

module.exports = { connectDatabase };
