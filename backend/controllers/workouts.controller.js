/* ============================================
   Workouts Controller — Logging & Progress
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate, paginationMeta } = require('../utils/pagination');

// POST /api/workouts/log
exports.logWorkout = asyncHandler(async (req, res) => {
  const { program_day_id, duration_min, notes, exercises } = req.body;

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const { rows: [log] } = await client.query(
      `INSERT INTO workout_logs (user_id, program_day_id, date, duration_min, notes)
       VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *`,
      [req.user.id, program_day_id || null, duration_min || null, notes || null]
    );

    const exerciseLogs = [];
    for (const ex of exercises) {
      for (const set of ex.sets) {
        const { rows: [entry] } = await client.query(
          `INSERT INTO exercise_logs (workout_log_id, exercise_id, set_number, weight_lbs, reps_completed, rpe, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [log.id, ex.exercise_id, set.set_number, set.weight_lbs || null, set.reps_completed, set.rpe || null, set.notes || null]
        );
        exerciseLogs.push(entry);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      workout: { ...log, exercises: exerciseLogs },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// GET /api/workouts/log
exports.getHistory = asyncHandler(async (req, res) => {
  const { limit, offset, page } = paginate(req.query, 20);

  const [countRes, dataRes] = await Promise.all([
    db.query('SELECT COUNT(*) FROM workout_logs WHERE user_id = $1', [req.user.id]),
    db.query(
      `SELECT wl.*, pd.day_name, p.name as program_name
       FROM workout_logs wl
       LEFT JOIN program_days pd ON pd.id = wl.program_day_id
       LEFT JOIN programs p ON p.id = pd.program_id
       WHERE wl.user_id = $1
       ORDER BY wl.date DESC, wl.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    ),
  ]);

  res.json({
    status: 'success',
    workouts: dataRes.rows,
    pagination: paginationMeta(page, limit, parseInt(countRes.rows[0].count)),
  });
});

// GET /api/workouts/log/:id
exports.getWorkoutDetail = asyncHandler(async (req, res) => {
  const { rows: workout } = await db.query(
    'SELECT * FROM workout_logs WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (workout.length === 0) throw new AppError('Workout not found', 404);

  const { rows: exercises } = await db.query(
    `SELECT el.*, e.name as exercise_name, e.muscle_group
     FROM exercise_logs el
     JOIN exercises e ON e.id = el.exercise_id
     WHERE el.workout_log_id = $1
     ORDER BY el.exercise_id, el.set_number`,
    [req.params.id]
  );

  res.json({
    status: 'success',
    workout: { ...workout[0], exercises },
  });
});

// GET /api/workouts/progress — strength PRs and trends
exports.getProgress = asyncHandler(async (req, res) => {
  // Personal records per exercise
  const { rows: prs } = await db.query(
    `SELECT DISTINCT ON (e.id)
       e.id as exercise_id, e.name as exercise_name,
       el.weight_lbs as pr_weight, el.reps_completed as pr_reps
     FROM exercise_logs el
     JOIN exercises e ON e.id = el.exercise_id
     JOIN workout_logs wl ON wl.id = el.workout_log_id
     WHERE wl.user_id = $1
     ORDER BY e.id, el.weight_lbs DESC NULLS LAST`,
    [req.user.id]
  );

  // Weekly volume (last 12 weeks)
  const { rows: weeklyVolume } = await db.query(
    `SELECT date_trunc('week', wl.date) as week,
            COUNT(DISTINCT wl.id) as workouts,
            COALESCE(SUM(el.weight_lbs * el.reps_completed), 0) as total_volume
     FROM workout_logs wl
     LEFT JOIN exercise_logs el ON el.workout_log_id = wl.id
     WHERE wl.user_id = $1 AND wl.date >= CURRENT_DATE - INTERVAL '12 weeks'
     GROUP BY date_trunc('week', wl.date)
     ORDER BY week`,
    [req.user.id]
  );

  res.json({
    status: 'success',
    personalRecords: prs,
    weeklyVolume,
  });
});

// DELETE /api/workouts/log/:id
exports.deleteWorkout = asyncHandler(async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM workout_logs WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (rowCount === 0) throw new AppError('Workout not found', 404);
  res.json({ status: 'success', message: 'Workout deleted' });
});
