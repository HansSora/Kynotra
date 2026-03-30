/* ============================================
   Program Generator Logic
   ============================================ */

// Templates keyed by goal → location
const EXERCISE_POOL = {
  gym: {
    chest: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Dumbbell Bench Press', 'Machine Chest Press'],
    back: ['Barbell Deadlift', 'Weighted Pull-Ups', 'Barbell Rows', 'Seated Cable Rows', 'Lat Pulldowns', 'T-Bar Rows'],
    legs: ['Barbell Back Squat', 'Romanian Deadlift', 'Leg Press', 'Walking Lunges', 'Leg Curls', 'Leg Extensions', 'Calf Raises'],
    shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls', 'Arnold Press', 'Rear Delt Flyes'],
    arms: ['Barbell Curls', 'Hammer Curls', 'Tricep Rope Pushdowns', 'Overhead Tricep Extension', 'Preacher Curls'],
    core: ['Hanging Leg Raises', 'Cable Crunches', 'Ab Wheel Rollouts', 'Planks'],
  },
  home: {
    chest: ['Push-Ups', 'Diamond Push-Ups', 'Wide Push-Ups', 'Decline Push-Ups', 'Plyometric Push-Ups'],
    back: ['Pull-Ups', 'Inverted Rows', 'Superman Holds', 'Doorway Rows'],
    legs: ['Bodyweight Squats', 'Lunges', 'Bulgarian Split Squats', 'Glute Bridges', 'Wall Sits', 'Calf Raises'],
    shoulders: ['Pike Push-Ups', 'Arm Circles', 'Handstand Hold'],
    arms: ['Chin-Ups', 'Tricep Dips (chair)', 'Towel Curls'],
    core: ['Planks', 'Mountain Climbers', 'Bicycle Crunches', 'Leg Raises', 'Flutter Kicks'],
  },
};
EXERCISE_POOL['home-equipped'] = {
  ...EXERCISE_POOL.gym,
  chest: ['Dumbbell Bench Press', 'Incline Dumbbell Press', 'Dumbbell Flyes', 'Push-Ups', 'Floor Press'],
  back: ['Dumbbell Rows', 'Pull-Ups', 'Resistance Band Rows', 'Dumbbell Deadlift'],
};

const SPLITS = {
  3: [
    { name: 'Full Body A', groups: ['chest', 'back', 'legs', 'core'] },
    { name: 'Full Body B', groups: ['shoulders', 'legs', 'back', 'arms'] },
    { name: 'Full Body C', groups: ['chest', 'legs', 'shoulders', 'core'] },
  ],
  4: [
    { name: 'Upper Body', groups: ['chest', 'back', 'shoulders', 'arms'] },
    { name: 'Lower Body', groups: ['legs', 'core'] },
    { name: 'Push', groups: ['chest', 'shoulders', 'arms'] },
    { name: 'Pull + Legs', groups: ['back', 'legs', 'core'] },
  ],
  5: [
    { name: 'Push', groups: ['chest', 'shoulders', 'arms'] },
    { name: 'Pull', groups: ['back', 'arms'] },
    { name: 'Legs', groups: ['legs', 'core'] },
    { name: 'Upper', groups: ['chest', 'back', 'shoulders', 'arms'] },
    { name: 'Lower', groups: ['legs', 'core'] },
  ],
  6: [
    { name: 'Push', groups: ['chest', 'shoulders', 'arms'] },
    { name: 'Pull', groups: ['back', 'arms'] },
    { name: 'Legs', groups: ['legs', 'core'] },
    { name: 'Push (Volume)', groups: ['chest', 'shoulders', 'arms'] },
    { name: 'Pull (Volume)', groups: ['back', 'arms'] },
    { name: 'Legs (Volume)', groups: ['legs', 'core'] },
  ],
};

const REP_SCHEMES = {
  strength: { sets: 5, reps: '3-5', rest: 180 },
  'muscle-gain': { sets: 4, reps: '8-12', rest: 120 },
  'weight-loss': { sets: 3, reps: '12-15', rest: 60 },
  endurance: { sets: 3, reps: '15-20', rest: 45 },
  maintenance: { sets: 3, reps: '8-12', rest: 90 },
};

/**
 * Generate a workout program from user preferences.
 * @param {{ goal, experience, location, days_per_week }} opts
 * @returns {{ name, days: Array<{ day_name, focus, exercises }> }}
 */
const generateProgram = ({ goal, experience, location, days_per_week }) => {
  const days = parseInt(days_per_week, 10) || 4;
  const split = SPLITS[Math.min(Math.max(days, 3), 6)] || SPLITS[4];
  const pool = EXERCISE_POOL[location] || EXERCISE_POOL.gym;
  const scheme = REP_SCHEMES[goal] || REP_SCHEMES['muscle-gain'];

  const exercisesPerGroup = experience === 'beginner' ? 2 : experience === 'advanced' ? 4 : 3;
  const durationWeeks = experience === 'beginner' ? 8 : experience === 'advanced' ? 16 : 12;

  const programDays = split.slice(0, days).map((day, i) => {
    const exercises = [];
    day.groups.forEach((group) => {
      const available = pool[group] || [];
      const picked = available.slice(0, exercisesPerGroup);
      picked.forEach((name, j) => {
        exercises.push({
          order_index: exercises.length + 1,
          exercise_name: name,
          sets: scheme.sets,
          reps: scheme.reps,
          rest_seconds: scheme.rest,
          notes: j === 0 ? 'Main lift — focus on progressive overload' : '',
        });
      });
    });
    return {
      day_number: i + 1,
      day_name: day.name,
      focus: day.groups.join(', '),
      exercises,
    };
  });

  const goalLabels = {
    'muscle-gain': 'Muscle Builder',
    'weight-loss': 'Fat Burner',
    strength: 'Strength Program',
    endurance: 'Endurance Plan',
    maintenance: 'Maintenance Plan',
  };

  return {
    name: `${goalLabels[goal] || 'Custom Program'} — ${days} Day ${location === 'gym' ? 'Gym' : 'Home'} Split`,
    description: `AI-generated ${days}-day ${goal} program for ${experience} level at ${location}.`,
    goal,
    location,
    experience,
    duration_weeks: durationWeeks,
    days_per_week: days,
    days: programDays,
  };
};

module.exports = { generateProgram };
