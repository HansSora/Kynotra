/* ============================================
   Validation Middleware — express-validator rules
   ============================================ */
const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Check validation result and throw if errors.
 */
const handleValidationErrors = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(messages.join('. '), 400));
  }
  next();
};

// ---- Auth ----
const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('first_name').trim().notEmpty().withMessage('First name required'),
  body('last_name').trim().notEmpty().withMessage('Last name required'),
  handleValidationErrors,
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors,
];

// ---- Profile ----
const updateProfileRules = [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('fitness_goal').optional().isIn(['weight-loss', 'muscle-gain', 'strength', 'maintenance']),
  body('experience').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('weight_lbs').optional().isFloat({ min: 50, max: 600 }),
  body('height_inches').optional().isFloat({ min: 36, max: 96 }),
  body('age').optional().isInt({ min: 13, max: 120 }),
  body('gender').optional().isIn(['male', 'female']),
  handleValidationErrors,
];

// ---- Body Stats ----
const bodyStatsRules = [
  body('weight_lbs').optional().isFloat({ min: 50, max: 600 }),
  body('body_fat_pct').optional().isFloat({ min: 1, max: 60 }),
  body('chest_inches').optional().isFloat({ min: 20, max: 80 }),
  body('waist_inches').optional().isFloat({ min: 15, max: 80 }),
  body('hips_inches').optional().isFloat({ min: 20, max: 80 }),
  body('arms_inches').optional().isFloat({ min: 5, max: 30 }),
  body('legs_inches').optional().isFloat({ min: 10, max: 50 }),
  handleValidationErrors,
];

// ---- Programs ----
const generateProgramRules = [
  body('goal').isIn(['muscle-gain', 'weight-loss', 'strength', 'endurance', 'maintenance']).withMessage('Invalid goal'),
  body('experience').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid experience level'),
  body('location').isIn(['gym', 'home', 'home-equipped']).withMessage('Invalid location'),
  body('days_per_week').isInt({ min: 3, max: 6 }).withMessage('Days must be 3-6'),
  handleValidationErrors,
];

// ---- Diet Calculator ----
const calcDietRules = [
  body('weight_lbs').isFloat({ min: 50, max: 600 }).withMessage('Valid weight required'),
  body('height_inches').isFloat({ min: 36, max: 96 }).withMessage('Valid height required'),
  body('age').isInt({ min: 13, max: 120 }).withMessage('Valid age required'),
  body('gender').isIn(['male', 'female']).withMessage('Gender required'),
  body('activity').isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']).withMessage('Activity level required'),
  body('goal').isIn(['weight-loss', 'aggressive-loss', 'maintenance', 'muscle-gain', 'lean-bulk']).withMessage('Goal required'),
  handleValidationErrors,
];

// ---- Nutrition Log ----
const nutritionLogRules = [
  body('meal_name').trim().notEmpty().withMessage('Meal name required'),
  body('food_name').trim().notEmpty().withMessage('Food name required'),
  body('calories').isInt({ min: 0, max: 5000 }),
  body('protein_g').optional().isFloat({ min: 0 }),
  body('carbs_g').optional().isFloat({ min: 0 }),
  body('fats_g').optional().isFloat({ min: 0 }),
  handleValidationErrors,
];

// ---- Workout Log ----
const workoutLogRules = [
  body('program_day_id').optional().isInt(),
  body('duration_min').optional().isInt({ min: 1, max: 600 }),
  body('exercises').isArray({ min: 1 }).withMessage('At least one exercise required'),
  body('exercises.*.exercise_id').isInt().withMessage('Exercise ID required'),
  body('exercises.*.sets').isArray({ min: 1 }),
  body('exercises.*.sets.*.weight_lbs').optional().isFloat({ min: 0 }),
  body('exercises.*.sets.*.reps_completed').isInt({ min: 0 }),
  handleValidationErrors,
];

// ---- Shop ----
const addToCartRules = [
  body('product_id').isInt().withMessage('Product ID required'),
  body('quantity').isInt({ min: 1, max: 20 }).withMessage('Quantity must be 1-20'),
  handleValidationErrors,
];

const checkoutRules = [
  body('shipping_name').trim().notEmpty().withMessage('Shipping name required'),
  body('shipping_address').trim().notEmpty().withMessage('Shipping address required'),
  handleValidationErrors,
];

// ---- Reviews ----
const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('title').optional().trim().isLength({ max: 200 }),
  body('body').optional().trim().isLength({ max: 2000 }),
  handleValidationErrors,
];

// ---- Generic ID param ----
const idParam = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID required'),
  handleValidationErrors,
];

module.exports = {
  registerRules,
  loginRules,
  updateProfileRules,
  bodyStatsRules,
  generateProgramRules,
  calcDietRules,
  nutritionLogRules,
  workoutLogRules,
  addToCartRules,
  checkoutRules,
  reviewRules,
  idParam,
};
