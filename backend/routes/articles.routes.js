/* ============================================
   Articles / Blog Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/articles.controller');

router.get('/', ctrl.list);            // Public — article listing
router.get('/:slug', ctrl.getBySlug);  // Public — single article

module.exports = router;
