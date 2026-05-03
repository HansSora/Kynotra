/* ============================================
   Subscriptions Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/subscriptions.controller');
const { protect } = require('../middleware/auth');

router.get('/plans', ctrl.getPlans);                    // Public — see plan options
router.post('/subscribe', protect, ctrl.subscribe);     // Auth — subscribe / upgrade
router.post('/trial', protect, ctrl.startTrial);        // Auth — start 7-day trial
router.put('/cancel', protect, ctrl.cancel);            // Auth — cancel
router.get('/current', protect, ctrl.getCurrent);       // Auth — current plan

module.exports = router;
