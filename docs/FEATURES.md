# Kynotra — Feature Breakdown

Detailed explanation of every feature built into the platform.

---

## 1. User System

### Registration (`signup.html`)
- Email + password registration with validation (min 8 characters)
- Google social signup button (ready for OAuth integration)
- **Fitness goal selection** during signup: Weight Loss, Muscle Gain, Strength, General Fitness
- **Experience level selection**: Beginner (0-6 months), Intermediate (6-24 months), Advanced (2+ years)
- Terms of Service checkbox (required)
- Redirects to dashboard on success

### Login (`login.html`)
- Email + password authentication
- Google and Apple social login buttons
- "Remember me" checkbox
- "Forgot password" link
- Redirects to dashboard on success

### User Dashboard (`dashboard.html`)
- **Profile card** — Avatar initials, name, plan badge
- **Sidebar navigation** — Overview, Workouts, Nutrition, Progress, Saved Programs, Settings, Logout
- **Welcome banner** — Current program week, quick-action button

---

## 2. Program Generator (`programs.html`)

### AI Program Generation
The generator takes 4 inputs:
1. **Goal**: Weight Loss, Muscle Gain, Strength, Maintenance, Endurance
2. **Experience**: Beginner, Intermediate, Advanced
3. **Location**: Full Gym, Home (Minimal Equipment), Home Gym (Equipped)
4. **Days per week**: 3, 4, 5, or 6

The JavaScript engine (`app.js → generateProgram()`) then:
- Selects a program template based on goal
- Picks the correct weekly split for the chosen number of days
- Loads exercises appropriate for the training location (gym/home/home-equipped)
- Generates a visual card with the full weekly split

### Pre-Built Programs (6 programs)
Each card displays:
- Program image
- Name and description
- Badge (Popular, Best Seller, New, Beginner, Home, Pro)
- Meta info: Location, Duration, Level

| Program | Goal | Location | Duration | Level |
|---------|------|----------|----------|-------|
| Muscle Builder Pro | Hypertrophy | Gym | 12 weeks | Intermediate |
| Shred & Lean | Fat Loss | Home/Gym | 8 weeks | All Levels |
| Strength Foundation | Powerlifting | Gym | 16 weeks | Advanced |
| Beginner Blueprint | Foundation | Gym | 8 weeks | Beginner |
| Home Warrior | Fat Loss + Muscle | Home | 10 weeks | All Levels |
| Athletic Performance | Sports | Gym | 12 weeks | Intermediate |

### Sample 5-Day Workout Split
Full exercise tables for the Muscle Builder Pro program:

- **Day 1 (Push)**: Bench Press, Incline DB Press, OHP, Cable Flyes, Lateral Raises, Tricep Pushdowns, Overhead Extension — 7 exercises
- **Day 2 (Pull)**: Deadlift, Pull-Ups, Barbell Rows, Cable Rows, Face Pulls, Barbell Curls, Hammer Curls — 7 exercises
- **Day 3 (Legs)**: Back Squat, RDL, Leg Press, Walking Lunges, Leg Curls, Calf Raises — 6 exercises
- **Day 4 (Upper)**: DB Bench, T-Bar Rows, Arnold Press, Cable Crossovers, Superset Arms — 5 exercises
- **Day 5 (Lower)**: Front Squats, Hip Thrusts, Bulgarian Split Squats, Leg Extensions, Nordic Curls, Calf Raises — 6 exercises

Each exercise includes: Sets, Reps, Rest Time, and Coaching Notes.

---

## 3. Diet & Nutrition System (`diet.html`)

### Calorie & Macro Calculator
Uses the **Mifflin-St Jeor equation**:
- Male: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
- Female: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161

Then: TDEE = BMR × Activity Multiplier

Goal adjustments:
| Goal | Calorie Adjustment |
|------|--------------------|
| Weight Loss | TDEE − 500 |
| Maintenance | TDEE |
| Muscle Gain | TDEE + 300 |
| Aggressive Bulk | TDEE + 500 |

Macro split:
- Protein: 1g per lb of bodyweight
- Fat: 25% of total calories
- Carbs: Remaining calories

### Diet Plans (3 plans)
| Plan | Calories | Target |
|------|----------|--------|
| Lean & Clean | 1,800-2,200 | Weight Loss |
| Mass Builder | 2,800-3,400 | Muscle Gain |
| Balanced Living | 2,200-2,600 | Maintenance |

### Sample Daily Menu (Muscle Gain — 2,780 cal)
5 meals with full macro breakdown:

| Meal | Time | Calories | Protein | Carbs | Fats |
|------|------|----------|---------|-------|------|
| Breakfast | 7:00 AM | 650 | 42g | 58g | 28g |
| Snack | 10:00 AM | 480 | 38g | 52g | 14g |
| Lunch | 1:00 PM | 660 | 52g | 70g | 18g |
| Post-Workout | 4:00 PM | 420 | 30g | 65g | 4g |
| Dinner | 7:30 PM | 570 | 48g | 45g | 22g |
| **Total** | | **2,780** | **210g** | **290g** | **86g** |

### Food Alternatives Table
7 swap options (e.g., Chicken → Turkey/Lean Beef/Tofu).

### Supplement Guide
5 supplements ranked by importance:
1. Whey Protein (Essential)
2. Creatine Monohydrate (Highly Recommended)
3. Vitamin D3 (Recommended)
4. Omega-3 Fish Oil (Recommended)
5. Caffeine/Pre-Workout (Optional)

---

## 4. Exercise Library (`exercises.html`)

### Exercise Database (12 exercises)
Each exercise card displays:
- Emoji icon
- Exercise name
- Target muscle groups
- Description
- Tags (Compound/Isolation, Equipment type)

Exercises included:
1. Barbell Bench Press (Chest)
2. Barbell Back Squat (Legs)
3. Conventional Deadlift (Back)
4. Pull-Ups (Back)
5. Overhead Press (Shoulders)
6. Dumbbell Lateral Raises (Shoulders)
7. Barbell Bicep Curls (Arms)
8. Tricep Rope Pushdowns (Arms)
9. Plank (Core)
10. Romanian Deadlift (Legs)
11. Cable Flyes (Chest)
12. Hanging Leg Raises (Core)

Top 3 exercises include full detail modals with:
- Step-by-step instructions (6 steps each)
- Tips (4 tips each)
- Common mistakes (4 mistakes each)

### Filter System
- Filter by muscle group: All, Chest, Back, Shoulders, Legs, Arms, Core
- Search by name/description

### Gym Terminology Glossary (12 terms)
| Term | Short Definition |
|------|-----------------|
| Reps | One complete movement |
| Sets | Group of consecutive reps |
| Progressive Overload | Gradually increasing stimulus |
| Hypertrophy | Muscle size increase |
| Compound Exercise | Multi-muscle movement |
| Isolation Exercise | Single-muscle movement |
| Superset | Two exercises back-to-back |
| Drop Set | Reduce weight and continue |
| 1RM | Maximum weight for 1 rep |
| Time Under Tension | Duration of muscle strain |
| RPE | Rate of Perceived Exertion scale |
| DOMS | Delayed Onset Muscle Soreness |

---

## 5. Gym Shop / E-Commerce (`shop.html`)

### Products (12 items)

| Product | Category | Price | Rating |
|---------|----------|-------|--------|
| Adjustable Dumbbells (5-52.5 lbs) | Equipment | $349.99 | ★★★★★ (428) |
| Resistance Bands Set (5 Levels) | Equipment | $29.99 ~~$44.99~~ | ★★★★★ (1,247) |
| Adjustable Weight Bench | Equipment | $189.99 | ★★★★☆ (312) |
| Gold Standard Whey Protein (5 lbs) | Supplements | $62.99 | ★★★★★ (28,400) |
| Creatine Monohydrate (500g) | Supplements | $24.99 | ★★★★★ (8,200) |
| Kynotra Pre-Workout (30 servings) | Supplements | $39.99 | ★★★★☆ (156) |
| Kynotra Performance Tee | Apparel | $34.99 | ★★★★★ (523) |
| Kynotra Training Shorts | Apparel | $29.99 | ★★★★☆ (389) |
| Kynotra Gym Duffle Bag | Accessories | $49.99 | ★★★★★ (278) |
| Leather Lifting Belt (10mm) | Accessories | $79.99 | ★★★★★ (612) |
| Kynotra Shaker Bottle (28oz) | Accessories | $12.99 ~~$17.99~~ | ★★★★☆ (1,890) |
| Wrist Wraps (18" Pair) | Accessories | $19.99 | ★★★★★ (945) |

### Shopping Cart System
- **Add to cart** — Click any "Add to Cart" button
- **Cart sidebar** — Slides in from the right with overlay
- **Quantity controls** — Increment/decrement buttons per item
- **Remove items** — X button per item
- **Persistent** — Cart saved to `localStorage`, survives page refreshes
- **Cart count** — Badge on nav cart icon updates in real-time
- **Free shipping** — Threshold at $75 with dynamic progress message
- **Checkout button** — Ready for Stripe integration

### Product Filters
- All Products, Equipment, Supplements, Apparel, Accessories
- Search bar

---

## 6. Subscription System

### Pricing Tiers (displayed on homepage)

| Feature | Free ($0) | Pro ($19/mo) | Elite ($39/mo) |
|---------|-----------|-------------|----------------|
| Basic workout templates | ✅ | ✅ | ✅ |
| Exercise library | ✅ | ✅ | ✅ |
| BMI calculator | ✅ | ✅ | ✅ |
| Community forum | ✅ | ✅ | ✅ |
| AI workout programs | ❌ | ✅ | ✅ |
| Custom nutrition plans | ❌ | ✅ | ✅ |
| Progress analytics | ❌ | ✅ | ✅ |
| Workout timer | ❌ | ✅ | ✅ |
| Program saving | ❌ | ✅ | ✅ |
| 1-on-1 coaching | ❌ | ❌ | ✅ |
| Weekly check-ins | ❌ | ❌ | ✅ |
| 10% shop discount | ❌ | ❌ | ✅ |
| Priority 24/7 support | ❌ | ❌ | ✅ |

Pro plan is marked as "Most Popular" with accent styling.

---

## 7. Dashboard Features (`dashboard.html`)

### Stat Cards (4)
- Workouts this week: 4/5
- Current weight: 182 lbs (+3 this month)
- Calories today: 1,850 / 2,800
- Bench Press PR: 225 lbs (+10 this month)

### Weekly Progress Tracker
Visual progress bars for each day of the week with status tags (Done, Rest, Today, Upcoming).

### Today's Workout Preview
Lists current day's exercises with sets × reps.

### Workout Timer
- **Stopwatch mode** — Count up for total workout duration
- **Rest countdown mode** — Quick buttons: 60s, 90s, 2 min, 3 min
- **Toast notification** when timer completes

### Strength Progress Table
Tracks 5 compound lifts over 12 weeks:
| Exercise | Start | Current | Gain |
|----------|-------|---------|------|
| Bench | 185 | 225 | +40 lbs |
| Squat | 225 | 285 | +60 lbs |
| Deadlift | 275 | 335 | +60 lbs |
| OHP | 115 | 140 | +25 lbs |
| Row | 155 | 195 | +40 lbs |

### Nutrition Tracker
Progress bars showing calories, protein, carbs, and fats consumed vs. targets.

### Saved Programs
List of user's saved/completed programs with status tags.

---

## 8. Sponsors / Brand Partners

Displayed on homepage and about page:
- Gymshark
- Nike
- Adidas
- MyProtein
- Optimum Nutrition
- Under Armour

---

## 9. Additional Features

### Toast Notification System
- Success (green) and error (red) toasts
- Slide-in animation from bottom-right
- Auto-dismiss after 3 seconds
- Used for: cart additions, form submissions, timer completion

### Mobile Responsive
- Hamburger menu for mobile navigation
- Single-column grid layouts on small screens
- Touch-friendly button sizes
- Responsive typography (clamp() for headings)

### Scroll Animations
- IntersectionObserver-based fade-in-up animations
- Staggered delays for grid items

### BMI Calculator
- BMI = (weight_lbs / height_inches²) × 703
- Categories: Underweight, Normal, Overweight, Obese
