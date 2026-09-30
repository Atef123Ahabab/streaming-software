const express = require('express');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { authLimiter } = require('../middleware/rateLimit');
const router = express.Router();

// Admin email that bypasses rate limiting
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'ahababatef14@gmail.com').toLowerCase();

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  isAdmin: !!user.isAdmin,
  storageUsed: user.storageUsed,
  storageLimit: user.storageLimit,
});

// Skip rate limit for admin email
const conditionalAuthLimiter = (req, res, next) => {
  const email = (req.body?.email || '').toLowerCase();
  if (email === ADMIN_EMAIL) return next();
  return authLimiter(req, res, next);
};

// POST /api/auth/register
router.post('/register', conditionalAuthLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one letter and one number' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existing) {
      return res.status(409).json({ message: 'Account with that email or username already exists' });
    }

    const user = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });
    await user.save();

    const token = signToken(user._id);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[register]', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', conditionalAuthLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[login]', error.message);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('[me]', error.message);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out' });
});

module.exports = router;