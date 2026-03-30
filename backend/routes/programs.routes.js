/* ============================================
   Programs Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/programs.controller');
const { protect, optionalAuth } = require('../middleware/auth');
const { generateProgramRules, idParam } = require('../middleware/validate');

router.get('/', ctrl.list);                                         // Public — browse programs
router.get('/saved', protect, ctrl.getSaved);                       // Auth — user's saved
router.get('/:id', idParam, ctrl.getById);                          // Public — single program
router.post('/generate', optionalAuth, generateProgramRules, ctrl.generate);  // Generates + optionally saves
router.post('/:id/save', protect, idParam, ctrl.save);              // Auth — save to profile
router.delete('/:id/unsave', protect, idParam, ctrl.unsave);        // Auth — remove

module.exports = router;
