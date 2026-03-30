/* ============================================
   Auth Controller
   ============================================ */
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, fitness_goal, experience } = req.body;

  // Check if user exists
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  const salt = await bcrypt.genSalt(12);
  const password_hash = await bcrypt.hash(password, salt);

  const { rows } = await db.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, fitness_goal, experience)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, first_name, last_name, subscription, fitness_goal, experience, created_at`,
    [email, password_hash, first_name, last_name, fitness_goal || null, experience || null]
  );

  const user = rows[0];
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    status: 'success',
    token,
    refreshToken,
    user,
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await db.query(
    'SELECT id, email, password_hash, first_name, last_name, subscription, fitness_goal, experience FROM users WHERE email = $1',
    [email]
  );

  if (rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  delete user.password_hash;
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({ status: 'success', token, refreshToken, user });
});

// POST /api/auth/refresh
exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 400);

  const decoded = verifyRefreshToken(refreshToken);
  const { rows } = await db.query(
    'SELECT id, email, first_name, last_name, subscription FROM users WHERE id = $1',
    [decoded.id]
  );
  if (rows.length === 0) throw new AppError('User not found', 401);

  const token = generateToken(rows[0].id);
  res.json({ status: 'success', token });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, email, first_name, last_name, avatar_url, fitness_goal, experience,
            subscription, weight_lbs, height_inches, age, gender, created_at
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  res.json({ status: 'success', user: rows[0] });
});

// PUT /api/auth/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const { rows } = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!isMatch) throw new AppError('Current password is incorrect', 401);

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(newPassword, salt);
  await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.id]);

  res.json({ status: 'success', message: 'Password updated' });
});
