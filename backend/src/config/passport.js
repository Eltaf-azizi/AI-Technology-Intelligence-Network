const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/User");
const logger = require("../utils/logger");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "atin_jwt_secret",
  algorithms: ["HS256"],
};

async function verifyCallback(payload, done) {
  try {
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    if (!user.isActive) {
      return done(null, false, { message: "Account is deactivated" });
    }

    return done(null, user);
  } catch (error) {
    logger.error("Passport JWT verification error", { error: error.message });
    return done(error, false);
  }
}

const strategy = new JwtStrategy(options, verifyCallback);

module.exports = (passport) => {
  passport.use(strategy);
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select("-password");
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
