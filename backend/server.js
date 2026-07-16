require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { connectDatabase } = require("./src/config/database");
const { createRedisClient, getClient } = require("./src/config/redis");
const logger = require("./src/utils/logger");
const notificationService = require("./src/services/notificationService");

const PORT = parseInt(process.env.PORT, 10) || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on("connection", (socket) => {
  logger.info("Socket.IO client connected", { socketId: socket.id });

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      logger.debug("Socket joined user room", { socketId: socket.id, userId });
    }
  });

  socket.on("leave", (userId) => {
    if (userId) {
      socket.leave(`user:${userId}`);
    }
  });

  socket.on("disconnect", (reason) => {
    logger.debug("Socket.IO client disconnected", { socketId: socket.id, reason });
  });
});

notificationService.setSocketIO(io);

let cronJobs = [];

function startCronJobs() {
  const cron = require("node-cron");

  const cleanupJob = cron.schedule("0 3 * * *", async () => {
    logger.info("Running daily notification cleanup");
    try {
      await notificationService.cleanupOld(90);
    } catch (error) {
      logger.error("Cron job error: cleanup", { error: error.message });
    }
  }, { timezone: "UTC" });

  cronJobs.push(cleanupJob);

  logger.info("Cron jobs started");
}

function stopCronJobs() {
  for (const job of cronJobs) {
    job.stop();
  }
  cronJobs = [];
  logger.info("Cron jobs stopped");
}

async function startServer() {
  try {
    await connectDatabase();

    try {
      const redisClient = createRedisClient();
      await redisClient.connect();
      logger.info("Redis connected");
    } catch (error) {
      logger.warn("Redis connection failed, continuing without cache", { error: error.message });
    }

    startCronJobs();

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        env: process.env.NODE_ENV || "development",
        port: PORT,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown("uncaughtException");
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  gracefulShutdown("SIGTERM");
});

process.on("SIGINT", () => {
  logger.info("SIGINT received");
  gracefulShutdown("SIGINT");
});

async function gracefulShutdown(signal) {
  logger.info(`Graceful shutdown initiated by ${signal}`);

  stopCronJobs();

  io.close(() => {
    logger.info("Socket.IO server closed");
  });

  server.close(() => {
    logger.info("HTTP server closed");
  });

  try {
    const redisClient = getClient();
    if (redisClient) {
      await redisClient.quit();
      logger.info("Redis connection closed");
    }
  } catch (error) {
    logger.warn("Error closing Redis", { error: error.message });
  }

  try {
    const mongoose = require("mongoose");
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.warn("Error closing MongoDB", { error: error.message });
  }

  logger.info("Shutdown complete");
  process.exit(0);
}

startServer();

module.exports = { server, io };
