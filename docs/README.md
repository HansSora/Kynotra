# Kynotra — AI-Powered Fitness Platform

> A modern, full-stack fitness website where users can find personalized workout programs, access diet/nutrition plans, learn gym terminology, purchase fitness equipment, and subscribe to premium plans.

**Design Inspiration:** Gymshark — clean, bold, dark, high-contrast, minimalistic.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Pages & Features](#pages--features)
5. [How to Run](#how-to-run)
6. [Backend Setup](#backend-setup)
7. [Database Schema](#database-schema)
8. [Future Improvements](#future-improvements)

---

## Project Overview

Kynotra is a startup-ready fitness SaaS platform that combines:

- **AI-powered program generation** — Users select their goal, experience level, training location, and available days; the system generates a complete weekly workout split with exercises, sets, reps, and rest times.
- **Nutrition planning** — Calorie and macronutrient calculator (using the Mifflin-St Jeor equation), sample meal plans with food alternatives and supplement guides.
- **Exercise library** — A database of exercises with step-by-step instructions, tips, common mistakes, and target muscle breakdowns.
- **E-commerce shop** — Fitness equipment, supplements, and apparel with a full shopping cart system.
- **Subscription model** — Free, Pro ($19/mo), and Elite ($39/mo) tiers with a conversion-focused pricing table.
- **User dashboard** — Progress tracking, workout logging, body stats, workout timer, and saved programs.

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript |
| Backend     | Node.js, Express.js                              |
| Database    | PostgreSQL                                       |
| Auth        | JWT (jsonwebtoken) + bcryptjs                    |
| Security    | Helmet.js, express-rate-limit, CORS, input validation |
| Payments    | Stripe (integration point configured)            |
| Fonts       | Google Fonts (Inter + Oswald)                    |

### Why Vanilla JS (No React)?

The frontend is built with plain HTML/CSS/JS for:
- Zero build step — open `index.html` and it works
- Maximum performance — no framework overhead
- Easy to understand and extend
- Can be migrated to React/Next.js later if needed

---

## Project Structure

```
Kynotra/
├── index.html              # Homepage (hero, pricing, features, testimonials)
├── programs.html           # Workout programs + AI generator
├── diet.html               # Nutrition plans + calorie calculator
├── exercises.html          # Exercise library + gym glossary
├── shop.html               # E-commerce shop (12 products)
├── about.html              # Company story, values, team
├── contact.html            # Contact form + info
├── dashboard.html          # User dashboard (stats, progress, timer)
├── login.html              # Login page
├── signup.html             # Registration page
├── css/
│   └── styles.css          # Global stylesheet (~1100 lines)
├── js/
│   └── app.js              # All interactive functionality (~500 lines)
├── backend/
│   ├── server.js           # Express.js API server
│   ├── schema.sql          # PostgreSQL database schema
│   ├── package.json        # Node.js dependencies
│   └── .env.example        # Environment variable template
└── docs/
    ├── README.md           # This file
    ├── FEATURES.md         # Detailed feature breakdown
    ├── DESIGN.md           # Design system & UI decisions
    ├── API.md              # Backend API route documentation
    └── SAMPLE-DATA.md      # Sample workout, diet, and shop data
```

---

## Pages & Features

| Page | Purpose | Key Features |
|------|---------|-------------|
| **Homepage** | Conversion-focused landing | Hero + CTA, sponsor logos, 3-step how-it-works, featured programs, feature grid, pricing table, testimonials |
| **Programs** | Workout programs | AI program generator, 6 pre-built programs with filters, full 5-day PPL sample workout with exercise tables |
| **Diet** | Nutrition planning | Calorie/macro calculator, 3 diet plan cards, full daily meal plan (5 meals, macros per meal), food alternatives table, supplement guide |
| **Exercises** | Exercise database | 12 exercise cards with muscle group filters and search, click-to-expand exercise details, 12-term gym glossary |
| **Shop** | E-commerce | 12 products across 4 categories, shopping cart sidebar with qty controls, free shipping threshold, filter/search |
| **About** | Company info | Story, statistics, 3 core values, 4 team members, partner logos |
| **Contact** | Communication | Form with subject selector, contact info cards, FAQ links |
| **Dashboard** | User hub | Welcome banner, 4 stat cards, weekly progress tracker, today's workout preview, workout timer with rest countdowns, strength progress table, nutrition tracker, saved programs |
| **Login** | Authentication | Email/password + Google/Apple social login, remember me, forgot password |
| **Signup** | Registration | Email signup + Google, goal/experience selection, terms acceptance |

---

## How to Run

### Frontend Only (No Backend Needed)

Simply open `index.html` in any modern browser:

```
# Windows
start index.html

# macOS
open index.html

# Or just double-click index.html in File Explorer
```

All JavaScript functionality (cart, calculator, program generator, timer) works client-side.

### With Backend

```bash
cd backend
npm install
cp .env.example .env    # Edit with your database credentials
npm run dev             # Starts on http://localhost:3000
```

---

## Backend Setup

1. Install PostgreSQL
2. Create a database: `CREATE DATABASE Kynotra;`
3. Run the schema: `psql -d Kynotra -f schema.sql`
4. Configure `.env` with your database URL and JWT secret
5. Run `npm run dev`

---

## Database Schema

15+ tables covering all platform features:

- **users** — Accounts, profiles, fitness goals
- **programs / program_days / program_exercises** — Workout program structure
- **exercises** — Exercise database with instructions
- **user_programs / workout_logs / exercise_logs** — User tracking
- **body_stats** — Weight, body fat, measurements over time
- **diet_plans / meals / meal_items / nutrition_logs** — Nutrition system
- **products / product_categories / product_reviews** — Shop products
- **orders / order_items** — E-commerce orders
- **subscriptions** — Subscription management
- **articles** — Blog/content system
- **glossary** — Gym terminology

See [backend/schema.sql](../backend/schema.sql) for the full SQL.

---

## Future Improvements

- **React/Next.js Migration** — Component-based architecture for scalability
- **Real AI Integration** — OpenAI API for truly dynamic program generation
- **Mobile App** — React Native companion app
- **Social Features** — Community forum, workout sharing, challenges
- **Video Library** — Exercise demonstration videos
- **Wearable Integration** — Apple Watch, Fitbit, Garmin sync
- **Advanced Analytics** — Charts.js or D3.js for progress visualization
- **Multi-language** — i18n support for global audience
- **PWA** — Offline support and installable web app
- **A/B Testing** — Conversion optimization on pricing page
