/* ============================================
   Pagination Helper
   ============================================ */

/**
 * Parse pagination query params and return SQL LIMIT/OFFSET + meta.
 * @param {object} query - Express req.query
 * @param {number} defaultLimit - default items per page (max 100)
 * @returns {{ limit: number, offset: number, page: number }}
 */
const paginate = (query, defaultLimit = 20) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = defaultLimit;
  if (limit > 100) limit = 100;

  const offset = (page - 1) * limit;
  return { limit, offset, page };
};

/**
 * Build pagination meta for API response.
 */
const paginationMeta = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = { paginate, paginationMeta };
