/* ============================================
   Auth Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validate');

router.post('/register', registerRules, ctrl.register);
router.post('/login', loginRules, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.get('/me', protect, ctrl.getMe);
router.put('/password', protect, ctrl.changePassword);

module.exports = router;
