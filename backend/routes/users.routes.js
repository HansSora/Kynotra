/* ============================================
   Users Routes — Profile & Body Stats
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/users.controller');
const { protect } = require('../middleware/auth');
const { updateProfileRules, bodyStatsRules } = require('../middleware/validate');

router.use(protect); // All user routes require auth

router.get('/profile', ctrl.getProfile);
router.put('/profile', updateProfileRules, ctrl.updateProfile);
router.get('/stats', ctrl.getStats);
router.post('/body-stats', bodyStatsRules, ctrl.addBodyStats);
router.get('/body-stats', ctrl.getBodyStatsHistory);

module.exports = router;
