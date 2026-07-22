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

router.post("/login", authLimiter, validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    if (user.isLocked()) {
      const remainingMs = user.lockUntil.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return res.status(423).json({
        error: `Account is locked. Try again in ${remainingMin} minute(s)`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.loginAttempts > 0) {
      await user.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });
    }

    const accessToken = user.generateAccessToken();
    const { token: refreshToken, expiresAt } = user.generateRefreshToken();
    const userAgent = req.headers["user-agent"] || "";
    await user.addRefreshToken(refreshToken, expiresAt, userAgent);

    logger.info("User logged in", { userId: user._id });

    res.json({
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

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const jwt = require("jsonwebtoken");
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "atin_jwt_refresh_secret", {
        algorithms: ["HS256"],
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Refresh token expired" });
      }
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    if (decoded.type !== "refresh") {
      return res.status(401).json({ error: "Invalid token type" });
    }

    const user = await User.findById(decoded.sub).select("+password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const storedToken = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!storedToken) {
      logger.warn("Refresh token reuse detected", { userId: user._id });
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ error: "Refresh token has been revoked" });
    }

    if (new Date() > storedToken.expiresAt) {
      await user.removeRefreshToken(refreshToken);
      return res.status(401).json({ error: "Refresh token expired" });
    }

    await user.removeRefreshToken(refreshToken);

    const newAccessToken = user.generateAccessToken();
    const { token: newRefreshToken, expiresAt } = user.generateRefreshToken();
    const userAgent = req.headers["user-agent"] || "";
    await user.addRefreshToken(newRefreshToken, expiresAt, userAgent);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
});
