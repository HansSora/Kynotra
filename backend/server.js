/* ============================================
   Kynotra Backend — Express.js Server
   ============================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const programsRoutes = require('./routes/programs.routes');
const exercisesRoutes = require('./routes/exercises.routes');
const dietRoutes = require('./routes/diet.routes');
const shopRoutes = require('./routes/shop.routes');
const workoutsRoutes = require('./routes/workouts.routes');
const subscriptionsRoutes = require('./routes/subscriptions.routes');
const glossaryRoutes = require('./routes/glossary.routes');
const articlesRoutes = require('./routes/articles.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// Rate limiting — general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later' },
});
app.use('/api/', apiLimiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: 'error', message: 'Too many auth attempts, please try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require('./package.json').version,
  });
});

// ==========================================
// API ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/glossary', glossaryRoutes);
app.use('/api/articles', articlesRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 — unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ status: 'error', message: 'API route not found' });
});

// Serve frontend for all non-API routes (SPA fallback)
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Global error handler
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`\n  Kynotra API running on http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

module.exports = app;
