/* ============================================
   Database Connection Pool
   ============================================ */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

/**
 * Run a single parameterised query.
 * @param {string} text - SQL string with $1, $2, ... placeholders
 * @param {Array}  params - parameter values
 */
const query = (text, params) => pool.query(text, params);

/**
 * Get a client from the pool (for transactions).
 * Remember to call client.release() when done.
 */
const getClient = () => pool.connect();

module.exports = { pool, query, getClient };
