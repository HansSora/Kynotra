/* ============================================
   Kynotra — Database Schema (SQL)
   Suggested: PostgreSQL
   ============================================ */

-- ========================================
-- USERS
-- ========================================
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    fitness_goal    VARCHAR(50),       -- 'weight-loss', 'muscle-gain', 'strength', 'maintenance'
    experience      VARCHAR(50),       -- 'beginner', 'intermediate', 'advanced'
    subscription    VARCHAR(20) DEFAULT 'free',  -- 'free', 'pro', 'elite'
    weight_lbs      DECIMAL(5,1),
    height_inches   DECIMAL(4,1),
    age             INTEGER,
    gender          VARCHAR(10),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ========================================
-- PROGRAMS
-- ========================================
CREATE TABLE programs (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    goal            VARCHAR(50) NOT NULL,
    location        VARCHAR(50) NOT NULL,    -- 'gym', 'home', 'home-equipped'
    experience      VARCHAR(50) NOT NULL,
    duration_weeks  INTEGER NOT NULL,
    days_per_week   INTEGER NOT NULL,
    is_premium      BOOLEAN DEFAULT FALSE,
    image_url       VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE program_days (
    id              SERIAL PRIMARY KEY,
    program_id      INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    day_number      INTEGER NOT NULL,
    day_name        VARCHAR(100) NOT NULL,  -- e.g. 'Push Day', 'Pull Day'
    focus           VARCHAR(200)
);

CREATE TABLE program_exercises (
    id              SERIAL PRIMARY KEY,
    program_day_id  INTEGER REFERENCES program_days(id) ON DELETE CASCADE,
    exercise_id     INTEGER REFERENCES exercises(id),
    order_index     INTEGER NOT NULL,
    sets            INTEGER NOT NULL,
    reps            VARCHAR(20) NOT NULL,   -- e.g. '8-10', '12-15', '30s'
    rest_seconds    INTEGER,
    notes           TEXT
);

-- ========================================
-- EXERCISES
-- ========================================
CREATE TABLE exercises (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    muscle_group    VARCHAR(100) NOT NULL,   -- 'chest', 'back', 'legs', etc.
    target_muscles  VARCHAR(300),            -- 'pectorals, front deltoids, triceps'
    exercise_type   VARCHAR(50),             -- 'compound', 'isolation', 'isometric'
    equipment       VARCHAR(100),            -- 'barbell', 'dumbbell', 'cable', 'bodyweight'
    instructions    TEXT,
    tips            TEXT,
    common_mistakes TEXT,
    image_url       VARCHAR(500),
    video_url       VARCHAR(500),
    difficulty      VARCHAR(50)              -- 'beginner', 'intermediate', 'advanced'
);

CREATE INDEX idx_exercises_muscle ON exercises(muscle_group);

-- ========================================
-- USER PROGRAM TRACKING
-- ========================================
CREATE TABLE user_programs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    program_id      INTEGER REFERENCES programs(id),
    status          VARCHAR(20) DEFAULT 'active',  -- 'active', 'completed', 'paused'
    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP,
    current_week    INTEGER DEFAULT 1
);

CREATE TABLE workout_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    program_day_id  INTEGER REFERENCES program_days(id),
    date            DATE NOT NULL,
    duration_min    INTEGER,
    notes           TEXT,
    completed       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise_logs (
    id              SERIAL PRIMARY KEY,
    workout_log_id  INTEGER REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id     INTEGER REFERENCES exercises(id),
    set_number      INTEGER NOT NULL,
    weight_lbs      DECIMAL(6,1),
    reps_completed  INTEGER,
    rpe             DECIMAL(3,1),           -- Rate of perceived exertion (1-10)
    notes           TEXT
);

-- ========================================
-- BODY STATS / PROGRESS
-- ========================================
CREATE TABLE body_stats (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    weight_lbs      DECIMAL(5,1),
    body_fat_pct    DECIMAL(4,1),
    chest_inches    DECIMAL(4,1),
    waist_inches    DECIMAL(4,1),
    hips_inches     DECIMAL(4,1),
    arms_inches     DECIMAL(4,1),
    legs_inches     DECIMAL(4,1),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- NUTRITION / DIET PLANS
-- ========================================
CREATE TABLE diet_plans (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    goal            VARCHAR(50) NOT NULL,
    calories_min    INTEGER,
    calories_max    INTEGER,
    protein_pct     INTEGER,
    carbs_pct       INTEGER,
    fats_pct        INTEGER,
    is_premium      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meals (
    id              SERIAL PRIMARY KEY,
    diet_plan_id    INTEGER REFERENCES diet_plans(id) ON DELETE CASCADE,
    meal_number     INTEGER NOT NULL,
    meal_name       VARCHAR(100) NOT NULL,  -- 'Breakfast', 'Snack', 'Lunch', etc.
    meal_time       VARCHAR(20),
    calories        INTEGER,
    protein_g       DECIMAL(5,1),
    carbs_g         DECIMAL(5,1),
    fats_g          DECIMAL(5,1)
);

CREATE TABLE meal_items (
    id              SERIAL PRIMARY KEY,
    meal_id         INTEGER REFERENCES meals(id) ON DELETE CASCADE,
    food_name       VARCHAR(200) NOT NULL,
    quantity        VARCHAR(50),
    calories        INTEGER,
    protein_g       DECIMAL(5,1),
    carbs_g         DECIMAL(5,1),
    fats_g          DECIMAL(5,1)
);

CREATE TABLE nutrition_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    meal_name       VARCHAR(100),
    food_name       VARCHAR(200),
    calories        INTEGER,
    protein_g       DECIMAL(5,1),
    carbs_g         DECIMAL(5,1),
    fats_g          DECIMAL(5,1),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- E-COMMERCE / SHOP
-- ========================================
CREATE TABLE product_categories (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER REFERENCES product_categories(id),
    name            VARCHAR(300) NOT NULL,
    slug            VARCHAR(300) UNIQUE NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL,
    sale_price      DECIMAL(10,2),
    image_url       VARCHAR(500),
    stock_qty       INTEGER DEFAULT 0,
    rating          DECIMAL(2,1) DEFAULT 0,
    review_count    INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE product_reviews (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title           VARCHAR(200),
    body            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status          VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
    subtotal        DECIMAL(10,2) NOT NULL,
    shipping        DECIMAL(10,2) DEFAULT 0,
    tax             DECIMAL(10,2) DEFAULT 0,
    total           DECIMAL(10,2) NOT NULL,
    shipping_name   VARCHAR(200),
    shipping_address TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id              SERIAL PRIMARY KEY,
    order_id        INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id      INTEGER REFERENCES products(id),
    quantity        INTEGER NOT NULL,
    unit_price      DECIMAL(10,2) NOT NULL,
    total_price     DECIMAL(10,2) NOT NULL
);

-- ========================================
-- SUBSCRIPTIONS
-- ========================================
CREATE TABLE subscriptions (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan            VARCHAR(20) NOT NULL,    -- 'pro', 'elite'
    status          VARCHAR(20) DEFAULT 'active',  -- 'active', 'cancelled', 'expired'
    price_monthly   DECIMAL(10,2) NOT NULL,
    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMP,
    cancelled_at    TIMESTAMP
);

-- ========================================
-- BLOG / ARTICLES
-- ========================================
CREATE TABLE articles (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(300) NOT NULL,
    slug            VARCHAR(300) UNIQUE NOT NULL,
    content         TEXT NOT NULL,
    excerpt         VARCHAR(500),
    author_id       INTEGER REFERENCES users(id),
    category        VARCHAR(100),
    image_url       VARCHAR(500),
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- GYM TERMINOLOGY
-- ========================================
CREATE TABLE glossary (
    id              SERIAL PRIMARY KEY,
    term            VARCHAR(200) UNIQUE NOT NULL,
    definition      TEXT NOT NULL,
    category        VARCHAR(100)
);
