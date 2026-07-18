const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: "Too many requests, please try again later" });
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again in 1 minute" },
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: "Too many authentication attempts, please try again in 1 minute" });
  },
  skipSuccessfulRequests: false,
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many accounts created from this IP, please try again in 1 hour" },
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: "Too many accounts created from this IP, please try again in 1 hour" });
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  createAccountLimiter,
};
