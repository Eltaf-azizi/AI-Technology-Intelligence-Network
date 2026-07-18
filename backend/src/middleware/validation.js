const { body, query, param, validationResult } = require("express-validator");
const { CATEGORIES, SENTIMENT_LABELS, STAGES } = require("../utils/constants");

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  handleValidation,
];

const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidation,
];

const validateNewsCreate = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Title is required and must not exceed 500 characters"),
  body("source.url")
    .trim()
    .isURL()
    .withMessage("A valid source URL is required"),
  body("source.name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Source name is required"),
  body("summary")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Summary is required and must not exceed 2000 characters"),
  body("category")
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}`),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),
  body("technologies.*")
    .optional()
    .isString()
    .trim()
    .toLowerCase(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isString()
    .trim()
    .toLowerCase(),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("Published date must be a valid ISO 8601 date"),
  body("author")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Author must not exceed 200 characters"),
  handleValidation,
];

const validateTrendQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("category")
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}`),
  query("stage")
    .optional()
    .isIn(STAGES)
    .withMessage(`Stage must be one of: ${STAGES.join(", ")}`),
  query("sort")
    .optional()
    .isIn(["currentGrowth", "momentum", "name", "createdAt", "updatedAt"])
    .withMessage("Invalid sort field"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  handleValidation,
];

const validateNotificationSettings = [
  body("email")
    .optional()
    .isBoolean()
    .withMessage("Email notification setting must be a boolean"),
  body("push")
    .optional()
    .isBoolean()
    .withMessage("Push notification setting must be a boolean"),
  body("trends")
    .optional()
    .isBoolean()
    .withMessage("Trends notification setting must be a boolean"),
  body("sentiment")
    .optional()
    .isBoolean()
    .withMessage("Sentiment notification setting must be a boolean"),
  handleValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateNewsCreate,
  validateTrendQuery,
  validateNotificationSettings,
  handleValidation,
};
