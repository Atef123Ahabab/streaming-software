const rateLimit = require('express-rate-limit');

// In development, allow many attempts for testing.
// In production, keep it strict.
const isDev = process.env.NODE_ENV !== 'production';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 100,
  message: { message: 'Too many requests. Please slow down.' },
});

module.exports = { authLimiter, apiLimiter };