/* ============================================
   Articles / Blog Controller
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate, paginationMeta } = require('../utils/pagination');

// GET /api/articles
exports.list = asyncHandler(async (req, res) => {
  const { limit, offset, page } = paginate(req.query, 12);
  const { category } = req.query;

  let where = ['a.is_published = TRUE'];
  let params = [];
  let idx = 1;

  if (category) { where.push(`a.category = $${idx++}`); params.push(category); }

  const whereSQL = `WHERE ${where.join(' AND ')}`;

  const [countRes, dataRes] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM articles a ${whereSQL}`, params),
    db.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.category, a.image_url, a.published_at,
              u.first_name as author_first, u.last_name as author_last
       FROM articles a
       LEFT JOIN users u ON u.id = a.author_id
       ${whereSQL}
       ORDER BY a.published_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    ),
  ]);

  res.json({
    status: 'success',
    articles: dataRes.rows,
    pagination: paginationMeta(page, limit, parseInt(countRes.rows[0].count)),
  });
});

// GET /api/articles/:slug
exports.getBySlug = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT a.*, u.first_name as author_first, u.last_name as author_last
     FROM articles a
     LEFT JOIN users u ON u.id = a.author_id
     WHERE a.slug = $1 AND a.is_published = TRUE`,
    [req.params.slug]
  );
  if (rows.length === 0) throw new AppError('Article not found', 404);
  res.json({ status: 'success', article: rows[0] });
});
