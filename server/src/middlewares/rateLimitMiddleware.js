const rateLimit = require('express-rate-limit');
const env = require('../config/environment');

/**
 * Standard API rate limiter (100 req per 15 min)
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.isTest ? 10000 : env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    error: {
      code: 'TOO_MANY_REQUESTS',
      details: [],
    },
  },
});

/**
 * Sensitive Auth Rate Limiter (Brute-force protection: 10 attempts per 15 min)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isTest ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP address. Account temporarily throttled for security.',
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      details: [],
    },
  },
});

/**
 * Password Reset / Verification Limiter (5 requests per hour)
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.isTest ? 1000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please check your inbox or try again in an hour.',
    error: {
      code: 'PASSWORD_RESET_THROTTLED',
      details: [],
    },
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
};
