/* ============================================
   Glossary Controller
   ============================================ */
const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/glossary
exports.list = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM glossary';
  const params = [];

  if (category) {
    sql += ' WHERE category = $1';
    params.push(category);
  }
  sql += ' ORDER BY term';

  const { rows } = await db.query(sql, params);
  res.json({ status: 'success', terms: rows, count: rows.length });
});
