/* ============================================
   Shop Routes — Products, Orders, Reviews
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/shop.controller');
const { protect } = require('../middleware/auth');
const { checkoutRules, reviewRules, idParam } = require('../middleware/validate');

router.get('/products', ctrl.listProducts);                         // Public
router.get('/products/:id', idParam, ctrl.getProduct);              // Public
router.get('/categories', ctrl.listCategories);                     // Public

// Auth-required
router.post('/reviews/:productId', protect, reviewRules, ctrl.addReview);
router.post('/checkout', protect, checkoutRules, ctrl.checkout);
router.get('/orders', protect, ctrl.getOrders);
router.get('/orders/:id', protect, idParam, ctrl.getOrderById);

module.exports = router;
