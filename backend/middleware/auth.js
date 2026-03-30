/* ============================================
   Auth Middleware — JWT verification
   ============================================ */
const { verifyToken } = require('../utils/token');
const { AppError } = require('./errorHandler');
const db = require('../config/db');

/**
 * Protect routes — requires valid Bearer token.
 * Attaches req.user = { id, email, subscription, ... }
 */
const protect = async (req, _res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authenticated. Please log in.', 401));
  }

  try {
    const decoded = verifyToken(token);
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, subscription FROM users WHERE id = $1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

/**
 * Optional auth — attaches req.user if token present, but doesn't block.
 */
const optionalAuth = async (req, _res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, subscription FROM users WHERE id = $1',
      [decoded.id]
    );
    if (rows.length > 0) req.user = rows[0];
  } catch (_) {
    // token invalid — continue without user
  }
  next();
};

/**
 * Restrict to certain subscription tiers.
 * Usage: restrictTo('pro', 'elite')
 */
const restrictTo = (...plans) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    if (!plans.includes(req.user.subscription)) {
      return next(new AppError('Upgrade your plan to access this feature', 403));
    }
    next();
  };
};

module.exports = { protect, optionalAuth, restrictTo };
