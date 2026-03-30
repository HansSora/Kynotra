/* ============================================
   Shop Controller — Products, Cart, Orders
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const { paginate, paginationMeta } = require('../utils/pagination');

// GET /api/shop/products
exports.listProducts = asyncHandler(async (req, res) => {
  const { limit, offset, page } = paginate(req.query, 24);
  const { category, sort, min_price, max_price, search } = req.query;

  let where = ['p.is_active = TRUE'];
  let params = [];
  let idx = 1;

  if (category) { where.push(`c.slug = $${idx++}`); params.push(category); }
  if (min_price) { where.push(`COALESCE(p.sale_price, p.price) >= $${idx++}`); params.push(parseFloat(min_price)); }
  if (max_price) { where.push(`COALESCE(p.sale_price, p.price) <= $${idx++}`); params.push(parseFloat(max_price)); }
  if (search) { where.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`); params.push(`%${search}%`); idx++; }

  const whereSQL = `WHERE ${where.join(' AND ')}`;

  let orderSQL = 'ORDER BY p.created_at DESC';
  if (sort === 'price_asc') orderSQL = 'ORDER BY COALESCE(p.sale_price, p.price) ASC';
  if (sort === 'price_desc') orderSQL = 'ORDER BY COALESCE(p.sale_price, p.price) DESC';
  if (sort === 'rating') orderSQL = 'ORDER BY p.rating DESC';
  if (sort === 'name') orderSQL = 'ORDER BY p.name ASC';

  const [countRes, dataRes] = await Promise.all([
    db.query(
      `SELECT COUNT(*) FROM products p LEFT JOIN product_categories c ON c.id = p.category_id ${whereSQL}`,
      params
    ),
    db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       ${whereSQL} ${orderSQL}
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    ),
  ]);

  res.json({
    status: 'success',
    products: dataRes.rows,
    pagination: paginationMeta(page, limit, parseInt(countRes.rows[0].count)),
  });
});

// GET /api/shop/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const { rows: product } = await db.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN product_categories c ON c.id = p.category_id
     WHERE p.id = $1 AND p.is_active = TRUE`,
    [req.params.id]
  );
  if (product.length === 0) throw new AppError('Product not found', 404);

  const { rows: reviews } = await db.query(
    `SELECT pr.*, u.first_name, u.last_name
     FROM product_reviews pr
     LEFT JOIN users u ON u.id = pr.user_id
     WHERE pr.product_id = $1
     ORDER BY pr.created_at DESC LIMIT 20`,
    [req.params.id]
  );

  res.json({ status: 'success', product: { ...product[0], reviews } });
});

// GET /api/shop/categories
exports.listCategories = asyncHandler(async (_req, res) => {
  const { rows } = await db.query(
    `SELECT c.*, COUNT(p.id) as product_count
     FROM product_categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
     GROUP BY c.id ORDER BY c.name`
  );
  res.json({ status: 'success', categories: rows });
});

// POST /api/shop/reviews/:productId
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, title, body } = req.body;
  const productId = req.params.productId;

  // Check if product exists
  const { rows: prod } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (prod.length === 0) throw new AppError('Product not found', 404);

  // One review per user per product
  const { rows: existing } = await db.query(
    'SELECT id FROM product_reviews WHERE product_id = $1 AND user_id = $2',
    [productId, req.user.id]
  );
  if (existing.length > 0) throw new AppError('You already reviewed this product', 409);

  const { rows } = await db.query(
    `INSERT INTO product_reviews (product_id, user_id, rating, title, body)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [productId, req.user.id, rating, title || null, body || null]
  );

  // Update product rating
  await db.query(
    `UPDATE products SET
       rating = (SELECT AVG(rating) FROM product_reviews WHERE product_id = $1),
       review_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = $1)
     WHERE id = $1`,
    [productId]
  );

  res.status(201).json({ status: 'success', review: rows[0] });
});

// POST /api/shop/checkout
exports.checkout = asyncHandler(async (req, res) => {
  const { items, shipping_name, shipping_address } = req.body;

  if (!items || items.length === 0) throw new AppError('Cart is empty', 400);

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { rows: [product] } = await client.query(
        'SELECT id, price, sale_price, stock_qty, name FROM products WHERE id = $1 AND is_active = TRUE',
        [item.product_id]
      );
      if (!product) throw new AppError(`Product ${item.product_id} not found`, 404);
      if (product.stock_qty < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);

      const unitPrice = product.sale_price || product.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({ product_id: product.id, quantity: item.quantity, unit_price: unitPrice, total_price: totalPrice });

      // Decrease stock
      await client.query(
        'UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2',
        [item.quantity, product.id]
      );
    }

    const shipping = subtotal >= 75 ? 0 : 7.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, status, subtotal, shipping, tax, total, shipping_name, shipping_address)
       VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, subtotal, shipping, tax, total, shipping_name, shipping_address]
    );

    for (const oi of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, oi.product_id, oi.quantity, oi.unit_price, oi.total_price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ status: 'success', order });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// GET /api/shop/orders
exports.getOrders = asyncHandler(async (req, res) => {
  const { rows: orders } = await db.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );

  // Attach items to each order
  if (orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { rows: items } = await db.query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ANY($1)`,
      [orderIds]
    );
    orders.forEach((order) => {
      order.items = items.filter((i) => i.order_id === order.id);
    });
  }

  res.json({ status: 'success', orders });
});

// GET /api/shop/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const { rows: order } = await db.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (order.length === 0) throw new AppError('Order not found', 404);

  const { rows: items } = await db.query(
    `SELECT oi.*, p.name as product_name, p.image_url
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [req.params.id]
  );

  res.json({ status: 'success', order: { ...order[0], items } });
});
