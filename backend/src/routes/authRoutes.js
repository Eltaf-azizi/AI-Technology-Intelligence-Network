const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");
const { authLimiter, createAccountLimiter } = require("../middleware/rateLimiter");
const { parseUserAgent } = require("../utils/helpers");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/register", createAccountLimiter, validateRegister, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? "email" : "username";
      return res.status(409).json({ error: `An account with this ${field} already exists` });
    }

    const user = new User({ username, email, password });
    await user.save();

    const accessToken = user.generateAccessToken();
    const { token: refreshToken, expiresAt } = user.generateRefreshToken();
    const userAgent = req.headers["user-agent"] || "";
    await user.addRefreshToken(refreshToken, expiresAt, userAgent);

    logger.info("New user registered", { userId: user._id, email: user.email });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});
