const passport = require("passport");
const logger = require("../utils/logger");

function authenticate(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      logger.error("Auth middleware error", { error: err.message });
      return res.status(500).json({ error: "Authentication service unavailable" });
    }

    if (!user) {
      const message = info && info.message ? info.message : "Authentication required";
      return res.status(401).json({ error: message });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

function optionalAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      logger.debug("Optional auth error", { error: err.message });
    }

    if (user) {
      req.user = user;
    }

    return next();
  })(req, res, next);
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    return next();
  };
}

function requireVerified(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!req.user.isActive) {
    return res.status(403).json({ error: "Account is deactivated" });
  }

  return next();
}

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requireVerified,
};
