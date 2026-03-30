/* ============================================
   Workout Log Routes
   ============================================ */
const router = require('express').Router();
const ctrl = require('../controllers/workouts.controller');
const { protect } = require('../middleware/auth');
const { workoutLogRules, idParam } = require('../middleware/validate');

router.use(protect); // All workout routes require auth

router.post('/log', workoutLogRules, ctrl.logWorkout);
router.get('/log', ctrl.getHistory);
router.get('/log/:id', idParam, ctrl.getWorkoutDetail);
router.delete('/log/:id', idParam, ctrl.deleteWorkout);
router.get('/progress', ctrl.getProgress);

module.exports = router;
