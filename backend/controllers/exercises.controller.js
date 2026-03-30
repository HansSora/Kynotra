/* ============================================
   Exercises Controller
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate, paginationMeta } = require('../utils/pagination');

// GET /api/exercises
exports.list = asyncHandler(async (req, res) => {
  const { limit, offset, page } = paginate(req.query, 24);
  const { muscle_group, equipment, difficulty, type } = req.query;

  let where = [];
  let params = [];
  let idx = 1;

  if (muscle_group) { where.push(`muscle_group = $${idx++}`); params.push(muscle_group); }
  if (equipment) { where.push(`equipment = $${idx++}`); params.push(equipment); }
  if (difficulty) { where.push(`difficulty = $${idx++}`); params.push(difficulty); }
  if (type) { where.push(`exercise_type = $${idx++}`); params.push(type); }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRes, dataRes] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM exercises ${whereSQL}`, params),
    db.query(
      `SELECT id, name, muscle_group, target_muscles, exercise_type, equipment, difficulty, image_url
       FROM exercises ${whereSQL}
       ORDER BY name LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    ),
  ]);

  res.json({
    status: 'success',
    exercises: dataRes.rows,
    pagination: paginationMeta(page, limit, parseInt(countRes.rows[0].count)),
  });
});

// GET /api/exercises/search?q=
exports.search = asyncHandler(async (req, res) => {
  const q = req.query.q;
  if (!q || q.trim().length < 2) throw new AppError('Search query must be at least 2 characters', 400);

  const { rows } = await db.query(
    `SELECT id, name, muscle_group, target_muscles, exercise_type, equipment, difficulty, image_url
     FROM exercises
     WHERE name ILIKE $1 OR muscle_group ILIKE $1 OR target_muscles ILIKE $1
     ORDER BY name LIMIT 30`,
    [`%${q.trim()}%`]
  );

  res.json({ status: 'success', exercises: rows, count: rows.length });
});

// GET /api/exercises/:id
exports.getById = asyncHandler(async (req, res) => {
  const { rows } = await db.query('SELECT * FROM exercises WHERE id = $1', [req.params.id]);
  if (rows.length === 0) throw new AppError('Exercise not found', 404);
  res.json({ status: 'success', exercise: rows[0] });
});
