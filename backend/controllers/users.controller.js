/* ============================================
   Users Controller — Profile & Body Stats
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/users/profile
exports.getProfile = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, email, first_name, last_name, avatar_url, fitness_goal, experience,
            subscription, weight_lbs, height_inches, age, gender, created_at, updated_at
     FROM users WHERE id = $1`,
    [req.user.id]
  );
  res.json({ status: 'success', user: rows[0] });
});

// PUT /api/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['first_name', 'last_name', 'fitness_goal', 'experience', 'weight_lbs', 'height_inches', 'age', 'gender', 'avatar_url'];
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(req.body[key]);
      idx++;
    }
  }

  if (fields.length === 0) throw new AppError('No valid fields to update', 400);

  fields.push(`updated_at = NOW()`);
  values.push(req.user.id);

  const { rows } = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}
     RETURNING id, email, first_name, last_name, avatar_url, fitness_goal, experience,
               subscription, weight_lbs, height_inches, age, gender, updated_at`,
    values
  );

  res.json({ status: 'success', user: rows[0] });
});

// GET /api/users/stats — dashboard overview
exports.getStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [workoutsRes, streakRes, bodyRes, programsRes] = await Promise.all([
    db.query('SELECT COUNT(*) as total FROM workout_logs WHERE user_id = $1', [userId]),
    db.query(
      `SELECT COUNT(*) as streak FROM (
         SELECT DISTINCT date FROM workout_logs WHERE user_id = $1
         AND date >= CURRENT_DATE - INTERVAL '30 days'
       ) d`,
      [userId]
    ),
    db.query(
      'SELECT * FROM body_stats WHERE user_id = $1 ORDER BY date DESC LIMIT 1',
      [userId]
    ),
    db.query('SELECT COUNT(*) as total FROM user_programs WHERE user_id = $1', [userId]),
  ]);

  res.json({
    status: 'success',
    stats: {
      total_workouts: parseInt(workoutsRes.rows[0].total),
      monthly_workouts: parseInt(streakRes.rows[0].streak),
      latest_body_stats: bodyRes.rows[0] || null,
      saved_programs: parseInt(programsRes.rows[0].total),
    },
  });
});

// POST /api/users/body-stats
exports.addBodyStats = asyncHandler(async (req, res) => {
  const { weight_lbs, body_fat_pct, chest_inches, waist_inches, hips_inches, arms_inches, legs_inches, notes } = req.body;

  const { rows } = await db.query(
    `INSERT INTO body_stats (user_id, date, weight_lbs, body_fat_pct, chest_inches, waist_inches, hips_inches, arms_inches, legs_inches, notes)
     VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [req.user.id, weight_lbs, body_fat_pct, chest_inches, waist_inches, hips_inches, arms_inches, legs_inches, notes]
  );

  res.status(201).json({ status: 'success', bodyStats: rows[0] });
});

// GET /api/users/body-stats — history
exports.getBodyStatsHistory = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM body_stats WHERE user_id = $1 ORDER BY date DESC LIMIT 50',
    [req.user.id]
  );
  res.json({ status: 'success', bodyStats: rows });
});
