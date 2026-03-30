/* ============================================
   Programs Controller
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate, paginationMeta } = require('../utils/pagination');
const { generateProgram } = require('../utils/programGenerator');

// GET /api/programs
exports.list = asyncHandler(async (req, res) => {
  const { limit, offset, page } = paginate(req.query);
  const { goal, experience, location } = req.query;

  let where = [];
  let params = [];
  let idx = 1;

  if (goal) { where.push(`goal = $${idx++}`); params.push(goal); }
  if (experience) { where.push(`experience = $${idx++}`); params.push(experience); }
  if (location) { where.push(`location = $${idx++}`); params.push(location); }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRes, dataRes] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM programs ${whereSQL}`, params),
    db.query(
      `SELECT * FROM programs ${whereSQL} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    ),
  ]);

  res.json({
    status: 'success',
    programs: dataRes.rows,
    pagination: paginationMeta(page, limit, parseInt(countRes.rows[0].count)),
  });
});

// GET /api/programs/:id
exports.getById = asyncHandler(async (req, res) => {
  const { rows: program } = await db.query('SELECT * FROM programs WHERE id = $1', [req.params.id]);
  if (program.length === 0) throw new AppError('Program not found', 404);

  const { rows: days } = await db.query(
    'SELECT * FROM program_days WHERE program_id = $1 ORDER BY day_number',
    [req.params.id]
  );

  const dayIds = days.map((d) => d.id);
  let exercises = [];
  if (dayIds.length > 0) {
    const { rows } = await db.query(
      `SELECT pe.*, e.name as exercise_name, e.muscle_group, e.equipment
       FROM program_exercises pe
       JOIN exercises e ON e.id = pe.exercise_id
       WHERE pe.program_day_id = ANY($1)
       ORDER BY pe.order_index`,
      [dayIds]
    );
    exercises = rows;
  }

  // Nest exercises under their day
  const daysWithExercises = days.map((day) => ({
    ...day,
    exercises: exercises.filter((e) => e.program_day_id === day.id),
  }));

  res.json({ status: 'success', program: { ...program[0], days: daysWithExercises } });
});

// POST /api/programs/generate
exports.generate = asyncHandler(async (req, res) => {
  const { goal, experience, location, days_per_week } = req.body;
  const generated = generateProgram({ goal, experience, location, days_per_week });

  // Optionally persist to DB if user is logged in
  if (req.user) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const { rows: [prog] } = await client.query(
        `INSERT INTO programs (name, description, goal, location, experience, duration_weeks, days_per_week)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [generated.name, generated.description, goal, location, experience, generated.duration_weeks, days_per_week]
      );

      for (const day of generated.days) {
        const { rows: [d] } = await client.query(
          `INSERT INTO program_days (program_id, day_number, day_name, focus)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [prog.id, day.day_number, day.day_name, day.focus]
        );

        for (const ex of day.exercises) {
          await client.query(
            `INSERT INTO program_exercises (program_day_id, order_index, sets, reps, rest_seconds, notes)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [d.id, ex.order_index, ex.sets, ex.reps, ex.rest_seconds, ex.notes]
          );
        }
      }

      // Auto-save for user
      await client.query(
        'INSERT INTO user_programs (user_id, program_id) VALUES ($1, $2)',
        [req.user.id, prog.id]
      );

      await client.query('COMMIT');
      generated.id = prog.id;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  res.status(201).json({ status: 'success', program: generated });
});

// POST /api/programs/:id/save
exports.save = asyncHandler(async (req, res) => {
  const programId = req.params.id;

  // Verify program exists
  const { rows } = await db.query('SELECT id FROM programs WHERE id = $1', [programId]);
  if (rows.length === 0) throw new AppError('Program not found', 404);

  // Check if already saved
  const { rows: existing } = await db.query(
    'SELECT id FROM user_programs WHERE user_id = $1 AND program_id = $2',
    [req.user.id, programId]
  );
  if (existing.length > 0) throw new AppError('Program already saved', 409);

  await db.query(
    'INSERT INTO user_programs (user_id, program_id) VALUES ($1, $2)',
    [req.user.id, programId]
  );

  res.status(201).json({ status: 'success', message: 'Program saved' });
});

// GET /api/programs/saved
exports.getSaved = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT up.id as user_program_id, up.status, up.started_at, up.current_week,
            p.*
     FROM user_programs up
     JOIN programs p ON p.id = up.program_id
     WHERE up.user_id = $1
     ORDER BY up.started_at DESC`,
    [req.user.id]
  );

  res.json({ status: 'success', programs: rows });
});

// DELETE /api/programs/:id/unsave
exports.unsave = asyncHandler(async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM user_programs WHERE user_id = $1 AND program_id = $2',
    [req.user.id, req.params.id]
  );
  if (rowCount === 0) throw new AppError('Program not in your saved list', 404);
  res.json({ status: 'success', message: 'Program removed' });
});
