/* ============================================
   Kynotra Database Seed Script
   Run: node seed.js
   Populates tables with sample data.
   ============================================ */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, query } = require('./config/db');

const seed = async () => {
  console.log('Seeding Kynotra database...\n');

  try {
    // ── Demo User ──────────────────────────────
    const hash = await bcrypt.hash('Kynotra2024!', 12);
    const { rows: [user] } = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, fitness_goal, experience, subscription, weight_lbs, height_inches, age, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ['demo@Kynotra.com', hash, 'Alex', 'Johnson', 'muscle-gain', 'intermediate', 'pro', 185, 71, 28, 'male']
    );
    const userId = user ? user.id : 1;
    console.log('✓ Demo user created (demo@Kynotra.com / Kynotra2024!)');

    // ── Exercises ──────────────────────────────
    const exercises = [
      ['Barbell Bench Press', 'chest', 'pectorals, front deltoids, triceps', 'compound', 'barbell', 'Lie flat on bench. Grip slightly wider than shoulders. Lower bar to mid-chest, press up explosively.', 'Keep feet flat, arch upper back slightly, squeeze shoulder blades together.', 'Bouncing bar off chest, flaring elbows too wide, lifting hips off bench.', 'intermediate'],
      ['Incline Dumbbell Press', 'chest', 'upper pectorals, front deltoids, triceps', 'compound', 'dumbbell', 'Set bench to 30-degree incline. Press dumbbells from shoulder level to full extension.', 'Control the descent, full range of motion, dont let dumbbells drift forward.', 'Angle too steep (uses shoulders), slamming weights together at top.', 'intermediate'],
      ['Cable Flyes', 'chest', 'pectorals, front deltoids', 'isolation', 'cable', 'Stand between cable towers. Bring handles together in an arc at chest level.', 'Maintain slight elbow bend, squeeze at peak contraction, control negative.', 'Using too much weight and turning it into a press.', 'beginner'],
      ['Barbell Deadlift', 'back', 'erector spinae, glutes, hamstrings, traps', 'compound', 'barbell', 'Stand with feet hip-width. Grip bar at shoulder width. Drive through heels, keep back flat, lock out at top.', 'Brace core before each rep, keep bar close to body, initiate with leg drive.', 'Rounding lower back, jerking the bar, hyperextending at lockout.', 'advanced'],
      ['Weighted Pull-Ups', 'back', 'latissimus dorsi, biceps, rear deltoids', 'compound', 'bodyweight', 'Hang from bar, pull until chin clears bar. Add weight via belt or dumbbell between legs.', 'Full dead hang at bottom, squeeze lats at top, controlled descent.', 'Kipping, not going to full extension, half reps.', 'advanced'],
      ['Barbell Rows', 'back', 'latissimus dorsi, rhomboids, rear deltoids, biceps', 'compound', 'barbell', 'Hinge at hips ~45 degrees. Pull bar to lower chest, squeeze shoulder blades.', 'Keep core tight, dont use momentum, pull elbows back not up.', 'Standing too upright, rounding back, excessive body English.', 'intermediate'],
      ['Barbell Back Squat', 'legs', 'quadriceps, glutes, hamstrings, core', 'compound', 'barbell', 'Bar on upper traps. Feet shoulder-width. Squat to at least parallel, drive up through heels.', 'Brace core, keep knees tracking over toes, chest up throughout.', 'Knees caving in, leaning too far forward, not hitting depth.', 'intermediate'],
      ['Romanian Deadlift', 'legs', 'hamstrings, glutes, erector spinae', 'compound', 'barbell', 'Hold bar at hip level. Hinge at hips, slide bar down legs until hamstring stretch, return to start.', 'Slight knee bend, keep bar touching legs, feel the stretch in hamstrings.', 'Rounding back, bending knees too much, going too fast.', 'intermediate'],
      ['Leg Press', 'legs', 'quadriceps, glutes, hamstrings', 'compound', 'machine', 'Sit in leg press. Place feet shoulder-width on platform. Lower until 90-degree knee bend, press up.', 'Dont lock out knees at top, adjust foot placement for different emphasis.', 'Going too heavy with partial range, letting knees cave in.', 'beginner'],
      ['Overhead Press', 'shoulders', 'front deltoids, lateral deltoids, triceps, core', 'compound', 'barbell', 'Stand with bar at shoulder level. Press overhead to full lockout. Lower back to shoulders.', 'Squeeze glutes, brace core, dont lean back excessively.', 'Excessive back arch, pressing in front of face instead of overhead.', 'intermediate'],
      ['Lateral Raises', 'shoulders', 'lateral deltoids', 'isolation', 'dumbbell', 'Stand with dumbbells at sides. Raise arms to shoulder level, slight bend in elbows. Lower slowly.', 'Lead with elbows, slight forward lean, dont swing. Use controlled tempo.', 'Using momentum, raising too high, shrugging traps.', 'beginner'],
      ['Face Pulls', 'shoulders', 'rear deltoids, rotator cuff, traps', 'isolation', 'cable', 'Set cable high. Pull rope to face, externally rotating at end. Squeeze shoulder blades.', 'Keep elbows high, light weight focus on contraction, great warmup exercise.', 'Going too heavy, pulling to chest instead of face.', 'beginner'],
      ['Barbell Curls', 'arms', 'biceps brachii, brachialis', 'isolation', 'barbell', 'Stand with barbell, underhand grip. Curl to shoulders keeping elbows pinned. Lower slowly.', 'Keep elbows still, full range of motion, squeeze biceps at top.', 'Swinging body, moving elbows forward, half reps.', 'beginner'],
      ['Tricep Rope Pushdowns', 'arms', 'triceps (all 3 heads)', 'isolation', 'cable', 'Stand at cable machine. Push rope down, flaring ends apart at bottom. Squeeze triceps.', 'Keep elbows pinned to sides, full extension, controlled negative.', 'Leaning over the weight, using momentum, elbows drifting.', 'beginner'],
      ['Hanging Leg Raises', 'core', 'rectus abdominis, hip flexors, obliques', 'isolation', 'bodyweight', 'Hang from bar. Raise legs to parallel or higher. Lower with control.', 'Avoid swinging, focus on curling pelvis up, keep core engaged throughout.', 'Using momentum to swing, not controlling the descent.', 'intermediate'],
      ['Walking Lunges', 'legs', 'quadriceps, glutes, hamstrings', 'compound', 'dumbbell', 'Step forward into lunge, both knees at 90 degrees. Push off front foot, step into next lunge.', 'Keep torso upright, full stride length, front knee over ankle.', 'Short strides, leaning forward, knee passing over toes.', 'beginner'],
      ['Arnold Press', 'shoulders', 'all 3 deltoid heads, triceps', 'compound', 'dumbbell', 'Start with palms facing you at shoulder height. Press up while rotating to palms facing forward.', 'Smooth rotation, full range of motion, controlled descent back to start.', 'Going too heavy, rushing the rotation, partial range of motion.', 'intermediate'],
      ['Hip Thrusts', 'legs', 'glutes, hamstrings', 'compound', 'barbell', 'Upper back on bench, bar over hips. Drive hips up to full extension. Squeeze glutes at top.', 'Chin tucked, drive through heels, pause at top for 1-2 seconds.', 'Hyperextending lower back, not reaching full hip extension.', 'intermediate'],
      ['Preacher Curls', 'arms', 'biceps brachii, brachialis', 'isolation', 'barbell', 'Sit at preacher bench. Curl bar from full extension to shoulder level. Lower slowly.', 'Dont swing, keep upper arms pressed against pad throughout.', 'Not going to full extension, lifting elbows off pad.', 'beginner'],
      ['Ab Wheel Rollouts', 'core', 'rectus abdominis, obliques, serratus', 'compound', 'bodyweight', 'Kneel with ab wheel. Roll out as far as possible keeping core tight. Pull back to start.', 'Start with short range, progress distance over time, squeeze abs on return.', 'Letting hips sag, not engaging core, going too far too fast.', 'advanced'],
    ];

    for (const ex of exercises) {
      await query(
        `INSERT INTO exercises (name, muscle_group, target_muscles, exercise_type, equipment, instructions, tips, common_mistakes, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING`,
        ex
      );
    }
    console.log(`✓ ${exercises.length} exercises seeded`);

    // ── Programs ───────────────────────────────
    const programs = [
      ['Muscle Builder Pro', 'Complete hypertrophy program for intermediate lifters looking to maximize muscle growth.', 'muscle-gain', 'gym', 'intermediate', 12, 5, false],
      ['Fat Burner HIIT', 'High-intensity program designed for maximum calorie burn and fat loss.', 'weight-loss', 'gym', 'beginner', 8, 4, false],
      ['Strength Foundation', 'Build raw strength with a focus on the big three: squat, bench, deadlift.', 'strength', 'gym', 'intermediate', 16, 4, false],
      ['Home Warrior', 'Full-body home workout program — no equipment needed.', 'muscle-gain', 'home', 'beginner', 8, 3, false],
      ['Elite Powerbuilding', 'Combine strength and hypertrophy for the best of both worlds.', 'strength', 'gym', 'advanced', 16, 6, true],
      ['Lean & Mean', 'Body recomposition program — lose fat and gain muscle simultaneously.', 'weight-loss', 'gym', 'intermediate', 12, 5, true],
    ];

    for (const prog of programs) {
      await query(
        `INSERT INTO programs (name, description, goal, location, experience, duration_weeks, days_per_week, is_premium)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
        prog
      );
    }
    console.log(`✓ ${programs.length} programs seeded`);

    // ── Product Categories ─────────────────────
    const categories = [
      ['Equipment', 'equipment'],
      ['Supplements', 'supplements'],
      ['Apparel', 'apparel'],
      ['Accessories', 'accessories'],
    ];
    for (const cat of categories) {
      await query(
        'INSERT INTO product_categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING',
        cat
      );
    }
    console.log('✓ Product categories seeded');

    // ── Products ───────────────────────────────
    const { rows: cats } = await query('SELECT id, slug FROM product_categories');
    const catMap = {};
    cats.forEach((c) => (catMap[c.slug] = c.id));

    const products = [
      [catMap.equipment, 'Adjustable Dumbbells (5-52.5 lbs)', 'adjustable-dumbbells', 'Space-saving quick-change dial system. Replaces 15 pairs of dumbbells.', 349.99, null, 50, 4.9, 428],
      [catMap.equipment, 'Resistance Bands Set (5 Levels)', 'resistance-bands-set', '10-50 lbs range. Includes door anchor, ankle straps, and carry bag.', 44.99, 29.99, 200, 4.7, 1247],
      [catMap.equipment, 'Adjustable Weight Bench', 'adjustable-weight-bench', '7 back + 3 seat positions. 800 lb capacity. Foldable design.', 189.99, null, 35, 4.6, 312],
      [catMap.supplements, 'Gold Standard Whey Protein (5 lbs)', 'whey-protein-5lb', '24g protein per serving, 73 servings. Double Rich Chocolate. By Optimum Nutrition.', 62.99, null, 150, 4.8, 28400],
      [catMap.supplements, 'Creatine Monohydrate (500g)', 'creatine-monohydrate', '100 servings pure micronized. Unflavored. Third-party tested.', 24.99, null, 300, 4.9, 8200],
      [catMap.supplements, 'Kynotra Pre-Workout (30 servings)', 'Kynotra-pre-workout', '200mg caffeine, 6g citrulline, 3.2g beta-alanine. Fruit punch flavor.', 39.99, null, 80, 4.5, 156],
      [catMap.apparel, 'Kynotra Performance Tee', 'Kynotra-performance-tee', 'Moisture-wicking, 4-way stretch, anti-odor. Slim athletic fit.', 34.99, null, 250, 4.8, 523],
      [catMap.apparel, 'Kynotra Training Shorts', 'Kynotra-training-shorts', 'Lightweight, breathable, 7-inch inseam. Zippered pocket.', 29.99, null, 180, 4.6, 389],
      [catMap.accessories, 'Kynotra Gym Duffle Bag', 'Kynotra-gym-duffle', '40L capacity. Shoe compartment, wet pocket, water bottle holder.', 49.99, null, 100, 4.8, 278],
      [catMap.accessories, 'Leather Lifting Belt (10mm)', 'leather-lifting-belt', 'Full grain leather, single prong. 4-inch width. IPF approved.', 79.99, null, 60, 4.9, 612],
      [catMap.accessories, 'Kynotra Shaker Bottle (28oz)', 'Kynotra-shaker-bottle', 'BPA-free, leak-proof. Built-in mixing ball. Dishwasher safe.', 17.99, 12.99, 500, 4.4, 1890],
      [catMap.accessories, 'Wrist Wraps (18-inch Pair)', 'wrist-wraps', 'Heavy-duty support. Thumb loop, adjustable tension.', 19.99, null, 400, 4.7, 945],
    ];

    for (const prod of products) {
      await query(
        `INSERT INTO products (category_id, name, slug, description, price, sale_price, stock_qty, rating, review_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (slug) DO NOTHING`,
        prod
      );
    }
    console.log(`✓ ${products.length} products seeded`);

    // ── Diet Plans ─────────────────────────────
    const dietPlans = [
      ['Muscle Gain Plan', 'High protein, calorie-surplus diet optimized for muscle growth.', 'muscle-gain', 2600, 3200, 30, 42, 28, false],
      ['Clean Cut', 'Calorie-deficit plan with high protein to preserve lean mass while losing fat.', 'weight-loss', 1800, 2200, 35, 35, 30, false],
      ['Balanced Maintenance', 'Sustain your current physique with balanced macros.', 'maintenance', 2200, 2600, 30, 40, 30, false],
      ['Keto Shred', 'Very low carb, high fat diet for rapid fat loss.', 'weight-loss', 1600, 2000, 30, 5, 65, true],
      ['Plant Power', 'High-protein vegan meal plan for muscle building.', 'muscle-gain', 2400, 3000, 25, 50, 25, true],
    ];

    for (const plan of dietPlans) {
      await query(
        `INSERT INTO diet_plans (name, description, goal, calories_min, calories_max, protein_pct, carbs_pct, fats_pct, is_premium)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING`,
        plan
      );
    }
    console.log(`✓ ${dietPlans.length} diet plans seeded`);

    // ── Glossary ───────────────────────────────
    const glossaryTerms = [
      ['Reps', 'One complete movement of an exercise from start to finish.', 'basics'],
      ['Sets', 'A group of consecutive repetitions performed without rest.', 'basics'],
      ['Progressive Overload', 'Gradually increasing weight, reps, or volume over time to build strength and muscle.', 'training'],
      ['Hypertrophy', 'Muscle size increase, typically achieved in the 8-12 rep range.', 'training'],
      ['Compound Exercise', 'An exercise that works multiple muscle groups simultaneously (e.g., squat, bench press, deadlift).', 'exercises'],
      ['Isolation Exercise', 'An exercise that targets a single muscle group (e.g., bicep curl, lateral raise).', 'exercises'],
      ['Superset', 'Two exercises performed back-to-back with no rest between them.', 'training'],
      ['Drop Set', 'Performing an exercise to failure, reducing the weight, and continuing for more reps.', 'training'],
      ['1RM', 'One-Rep Max — the maximum weight you can lift for a single repetition with proper form.', 'training'],
      ['TUT', 'Time Under Tension — the total duration muscles are under strain during a set.', 'training'],
      ['RPE', 'Rate of Perceived Exertion — a 1-10 scale measuring how hard a set feels.', 'training'],
      ['DOMS', 'Delayed Onset Muscle Soreness — muscle pain appearing 24-72 hours after exercise.', 'recovery'],
      ['TDEE', 'Total Daily Energy Expenditure — total calories burned in a day including activity.', 'nutrition'],
      ['BMR', 'Basal Metabolic Rate — calories burned at rest to maintain basic body functions.', 'nutrition'],
      ['Macros', 'Macronutrients — protein, carbohydrates, and fats. The three main energy sources.', 'nutrition'],
      ['Deload', 'A planned reduction in training intensity or volume to allow recovery.', 'training'],
      ['Failure', 'The point at which you cannot complete another rep with proper form.', 'training'],
      ['Mind-Muscle Connection', 'Consciously focusing on the target muscle during an exercise for better activation.', 'training'],
    ];

    for (const term of glossaryTerms) {
      await query(
        'INSERT INTO glossary (term, definition, category) VALUES ($1, $2, $3) ON CONFLICT (term) DO NOTHING',
        term
      );
    }
    console.log(`✓ ${glossaryTerms.length} glossary terms seeded`);

    // ── Sample Body Stats (for demo user) ──────
    const bodyStats = [
      [-90, 195, 18, 42, 36, 36, 14.5, 24],
      [-60, 192, 17, 42, 35, 36, 14.8, 24.2],
      [-30, 189, 16, 41.5, 34.5, 35.5, 15, 24.5],
      [0, 185, 15, 41, 34, 35, 15.2, 24.8],
    ];

    for (const stat of bodyStats) {
      await query(
        `INSERT INTO body_stats (user_id, date, weight_lbs, body_fat_pct, chest_inches, waist_inches, hips_inches, arms_inches, legs_inches)
         VALUES ($1, CURRENT_DATE + $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING`,
        [userId, stat[0], stat[1], stat[2], stat[3], stat[4], stat[5], stat[6], stat[7]]
      );
    }
    console.log('✓ Sample body stats seeded');

    // ── Sample Articles ────────────────────────
    const articles = [
      ['5 Compound Exercises Every Beginner Should Master', 'compound-exercises-beginners', 'Learn the fundamental compound movements that build the foundation for any strength program.', 'Master these five essential compound exercises to build full-body strength efficiently.', 'training'],
      ['The Complete Guide to Progressive Overload', 'guide-progressive-overload', 'Progressive overload is the single most important principle for muscle and strength gains. Learn how to apply it correctly.', 'Understand the key principle behind all muscle and strength gains.', 'training'],
      ['How to Calculate Your Macros for Any Goal', 'calculate-macros-guide', 'Step-by-step guide to calculating your protein, carb, and fat targets based on your fitness goal.', 'A practical guide to setting up your nutrition for weight loss, muscle gain, or maintenance.', 'nutrition'],
      ['Pre-Workout Nutrition: What to Eat Before Training', 'pre-workout-nutrition', 'Optimize your performance with the right pre-workout meal timing and composition.', 'Fuel your training sessions properly with these evidence-based nutrition strategies.', 'nutrition'],
      ['Rest & Recovery: The Missing Piece of Your Program', 'rest-recovery-guide', 'Sleep, deload weeks, and active recovery — everything you need to know about recovery.', 'Recovery is where growth happens. Learn how to optimize it.', 'recovery'],
    ];

    for (const art of articles) {
      await query(
        `INSERT INTO articles (title, slug, content, excerpt, category, author_id, is_published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW() - INTERVAL '7 days' * RANDOM()) ON CONFLICT (slug) DO NOTHING`,
        [...art, userId]
      );
    }
    console.log(`✓ ${articles.length} articles seeded`);

    console.log('\n✅ Database seeded successfully!\n');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seed();
