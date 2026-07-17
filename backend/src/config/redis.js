const Redis = require("ioredis");
const logger = require("../utils/logger");

let client = null;

function createRedisClient() {
  const uri = process.env.REDIS_URI || "redis://localhost:6379";

  client = new Redis(uri, {
    retryStrategy(times) {
      const delay = Math.min(times * 200, 5000);
      logger.warn(`Redis reconnecting in ${delay}ms`, { attempt: times });
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on("connect", () => {
    logger.info("Redis client connecting...");
  });

  client.on("ready", () => {
    logger.info("Redis client ready");
  });

  client.on("error", (err) => {
    logger.error("Redis client error", { error: err.message });
  });

  client.on("close", () => {
    logger.warn("Redis client connection closed");
  });

  client.on("reconnecting", (delay) => {
    logger.info("Redis client reconnecting", { delayMs: delay });
  });

  return client;
}

function getClient() {
  if (!client) {
    client = createRedisClient();
  }
  return client;
}

async function cacheGet(key) {
  try {
    const data = await getClient().get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error("Redis cacheGet error", { key, error: error.message });
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds = 3600) {
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await getClient().setex(key, ttlSeconds, serialized);
    } else {
      await getClient().set(key, serialized);
    }
    return true;
  } catch (error) {
    logger.error("Redis cacheSet error", { key, error: error.message });
    return false;
  }
}

async function cacheDel(key) {
  try {
    const result = await getClient().del(key);
    return result > 0;
  } catch (error) {
    logger.error("Redis cacheDel error", { key, error: error.message });
    return false;
  }
}

async function cacheFlush(pattern = "*") {
  try {
    if (pattern === "*") {
      await getClient().flushdb();
      logger.info("Redis cache flushed");
      return true;
    }
    const keys = await getClient().keys(pattern);
    if (keys.length > 0) {
      await getClient().del(...keys);
      logger.info("Redis cache flushed by pattern", { pattern, count: keys.length });
    }
    return true;
  } catch (error) {
    logger.error("Redis cacheFlush error", { pattern, error: error.message });
    return false;
  }
}

module.exports = {
  createRedisClient,
  getClient,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheFlush,
};
