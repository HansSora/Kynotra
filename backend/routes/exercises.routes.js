/* ============================================
   Exercises Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/exercises.controller');
const { idParam } = require('../middleware/validate');

router.get('/', ctrl.list);              // Public — browse/filter
router.get('/search', ctrl.search);      // Public — search
router.get('/:id', idParam, ctrl.getById);  // Public — detail

module.exports = router;
