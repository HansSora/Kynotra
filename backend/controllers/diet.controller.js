/* ============================================
   Diet / Nutrition Controller
   ============================================ */
const db = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const { calcTDEE, calcMacros } = require('../utils/calcMacros');

// GET /api/diet/plans
exports.listPlans = asyncHandler(async (req, res) => {
  const { goal } = req.query;
  let sql = 'SELECT * FROM diet_plans';
  const params = [];

  if (goal) {
    sql += ' WHERE goal = $1';
    params.push(goal);
  }
  sql += ' ORDER BY created_at DESC';

  const { rows } = await db.query(sql, params);
  res.json({ status: 'success', plans: rows });
});

// GET /api/diet/plans/:id
exports.getPlanById = asyncHandler(async (req, res) => {
  const { rows: plan } = await db.query('SELECT * FROM diet_plans WHERE id = $1', [req.params.id]);
  if (plan.length === 0) throw new AppError('Diet plan not found', 404);

  const { rows: meals } = await db.query(
    'SELECT * FROM meals WHERE diet_plan_id = $1 ORDER BY meal_number',
    [req.params.id]
  );

  const mealIds = meals.map((m) => m.id);
  let items = [];
  if (mealIds.length > 0) {
    const { rows } = await db.query(
      'SELECT * FROM meal_items WHERE meal_id = ANY($1) ORDER BY id',
      [mealIds]
    );
    items = rows;
  }

  const mealsWithItems = meals.map((meal) => ({
    ...meal,
    items: items.filter((i) => i.meal_id === meal.id),
  }));

  res.json({ status: 'success', plan: { ...plan[0], meals: mealsWithItems } });
});

// POST /api/diet/calculate
exports.calculate = asyncHandler(async (req, res) => {
  const { weight_lbs, height_inches, age, gender, activity, goal } = req.body;

  const { bmr, tdee, targetCalories } = calcTDEE({
    weight_lbs, height_inches, age, gender, activity, goal,
  });

  const macros = calcMacros(targetCalories);

  res.json({
    status: 'success',
    result: { bmr, tdee, targetCalories, goal, ...macros },
  });
});

// POST /api/diet/log
exports.logNutrition = asyncHandler(async (req, res) => {
  const { meal_name, food_name, calories, protein_g, carbs_g, fats_g } = req.body;

  const { rows } = await db.query(
    `INSERT INTO nutrition_logs (user_id, date, meal_name, food_name, calories, protein_g, carbs_g, fats_g)
     VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [req.user.id, meal_name, food_name, calories, protein_g || 0, carbs_g || 0, fats_g || 0]
  );

  res.status(201).json({ status: 'success', entry: rows[0] });
});

// GET /api/diet/log/:date
exports.getLogByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const { rows } = await db.query(
    'SELECT * FROM nutrition_logs WHERE user_id = $1 AND date = $2 ORDER BY created_at',
    [req.user.id, date]
  );

  // Calculate daily totals
  const totals = rows.reduce(
    (acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      protein_g: acc.protein_g + parseFloat(entry.protein_g || 0),
      carbs_g: acc.carbs_g + parseFloat(entry.carbs_g || 0),
      fats_g: acc.fats_g + parseFloat(entry.fats_g || 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0 }
  );

  res.json({ status: 'success', entries: rows, totals });
});

// DELETE /api/diet/log/:id
exports.deleteLogEntry = asyncHandler(async (req, res) => {
  const { rowCount } = await db.query(
    'DELETE FROM nutrition_logs WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (rowCount === 0) throw new AppError('Log entry not found', 404);
  res.json({ status: 'success', message: 'Entry deleted' });
});
