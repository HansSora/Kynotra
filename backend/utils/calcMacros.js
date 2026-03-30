/* ============================================
   Macro / Calorie Calculator Utilities
   ============================================ */

/**
 * Mifflin-St Jeor BMR calculation.
 * @param {{ weight_lbs, height_inches, age, gender }} data
 * @returns {number} BMR in kcal/day
 */
const calcBMR = ({ weight_lbs, height_inches, age, gender }) => {
  const weightKg = weight_lbs * 0.453592;
  const heightCm = height_inches * 2.54;

  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  'weight-loss': -500,
  'aggressive-loss': -750,
  maintenance: 0,
  'muscle-gain': 300,
  'lean-bulk': 200,
};

/**
 * Calculate TDEE and adjusted calories.
 */
const calcTDEE = ({ weight_lbs, height_inches, age, gender, activity, goal }) => {
  const bmr = calcBMR({ weight_lbs, height_inches, age, gender });
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.55;
  const tdee = Math.round(bmr * multiplier);
  const adjustment = GOAL_ADJUSTMENTS[goal] || 0;
  const targetCalories = tdee + adjustment;

  return { bmr: Math.round(bmr), tdee, targetCalories };
};

/**
 * Split calories into macro grams.
 * @param {number} calories
 * @param {{ protein_pct, carbs_pct, fats_pct }} split - each 0-100
 */
const calcMacros = (calories, { protein_pct = 30, carbs_pct = 40, fats_pct = 30 } = {}) => {
  return {
    protein_g: Math.round((calories * (protein_pct / 100)) / 4),
    carbs_g: Math.round((calories * (carbs_pct / 100)) / 4),
    fats_g: Math.round((calories * (fats_pct / 100)) / 9),
  };
};

module.exports = { calcBMR, calcTDEE, calcMacros, ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS };
