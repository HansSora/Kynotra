/* ============================================
   Diet / Nutrition Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/diet.controller');
const { protect } = require('../middleware/auth');
const { calcDietRules, nutritionLogRules, idParam } = require('../middleware/validate');

router.get('/plans', ctrl.listPlans);                     // Public — browse plans
router.get('/plans/:id', idParam, ctrl.getPlanById);      // Public — plan detail
router.post('/calculate', calcDietRules, ctrl.calculate); // Public — calorie calc

// Auth-required routes
router.post('/log', protect, nutritionLogRules, ctrl.logNutrition);
router.get('/log/:date', protect, ctrl.getLogByDate);
router.delete('/log/:id', protect, idParam, ctrl.deleteLogEntry);

module.exports = router;
