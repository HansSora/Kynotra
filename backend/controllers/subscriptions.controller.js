/* ============================================
   Subscriptions Controller
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

const PLANS = {
  pro: { price: 19.99, label: 'Pro' },
  elite: { price: 39.99, label: 'Elite' },
};

// GET /api/subscriptions/plans
exports.getPlans = asyncHandler(async (_req, res) => {
  res.json({
    status: 'success',
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['Basic workout tracking', '3 AI-generated programs', 'Exercise library', 'Community access'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19.99,
        features: ['Unlimited AI programs', 'Advanced analytics', 'Diet plan builder', 'Priority support', 'All Free features'],
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 39.99,
        features: ['1-on-1 coaching chat', 'Custom meal plans', 'Video form checks', 'Shop discounts (15%)', 'All Pro features'],
      },
    ],
  });
});

// POST /api/subscriptions/subscribe
exports.subscribe = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  if (!PLANS[plan]) throw new AppError('Invalid plan. Choose "pro" or "elite"', 400);

  // Check existing active subscription
  const { rows: existing } = await db.query(
    "SELECT id FROM subscriptions WHERE user_id = $1 AND status = 'active'",
    [req.user.id]
  );

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Cancel existing if upgrading
    if (existing.length > 0) {
      await client.query(
        "UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW() WHERE id = $1",
        [existing[0].id]
      );
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await client.query(
      `INSERT INTO subscriptions (user_id, plan, price_monthly, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, plan, PLANS[plan].price, expiresAt]
    );

    await client.query(
      'UPDATE users SET subscription = $1, updated_at = NOW() WHERE id = $2',
      [plan, req.user.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: `Subscribed to ${PLANS[plan].label} plan`,
      subscription: { plan, price: PLANS[plan].price, expires_at: expiresAt },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// PUT /api/subscriptions/cancel
exports.cancel = asyncHandler(async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const { rowCount } = await client.query(
      "UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW() WHERE user_id = $1 AND status = 'active'",
      [req.user.id]
    );
    if (rowCount === 0) throw new AppError('No active subscription to cancel', 404);

    await client.query(
      "UPDATE users SET subscription = 'free', updated_at = NOW() WHERE id = $1",
      [req.user.id]
    );

    await client.query('COMMIT');

    res.json({ status: 'success', message: 'Subscription cancelled. Access remains until billing period ends.' });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// GET /api/subscriptions/current
exports.getCurrent = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM subscriptions WHERE user_id = $1 AND status IN ('active', 'trial') ORDER BY started_at DESC LIMIT 1",
    [req.user.id]
  );

  res.json({
    status: 'success',
    subscription: rows[0] || { plan: 'free', price_monthly: 0 },
  });
});

// POST /api/subscriptions/trial
exports.startTrial = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  if (!PLANS[plan]) throw new AppError('Invalid plan. Choose "pro" or "elite"', 400);

  // Check if user already had a trial or active subscription
  const { rows: existing } = await db.query(
    "SELECT id, is_trial, status FROM subscriptions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 1",
    [req.user.id]
  );

  if (existing.length > 0) {
    if (existing[0].is_trial) {
      throw new AppError('You have already used your free trial', 400);
    }
    if (existing[0].status === 'active') {
      throw new AppError('You already have an active subscription', 400);
    }
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7-day trial

    await client.query(
      `INSERT INTO subscriptions (user_id, plan, status, is_trial, trial_ends_at, price_monthly, expires_at)
       VALUES ($1, $2, 'trial', true, $3, $4, $3)`,
      [req.user.id, plan, trialEndsAt, PLANS[plan].price]
    );

    await client.query(
      'UPDATE users SET subscription = $1, updated_at = NOW() WHERE id = $2',
      [plan, req.user.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: `Started 7-day free trial of ${PLANS[plan].label} plan`,
      subscription: { 
        plan, 
        is_trial: true, 
        trial_ends_at: trialEndsAt,
        price: PLANS[plan].price 
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});
