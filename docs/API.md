# Kynotra — Backend API Documentation

Complete route documentation for the Express.js backend API.

---

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- 100 requests per 15-minute window per IP on all `/api/` routes.

---

## Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Returns server status |

**Response:**
```json
{ "status": "ok", "timestamp": "2026-03-30T12:00:00.000Z" }
```

---

### Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create new account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Invalidate token |
| GET | `/api/auth/me` | Yes | Get current user |

#### POST `/api/auth/register`
```json
{
  "email": "john@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "fitnessGoal": "muscle-gain",
  "experience": "intermediate"
}
```
**Response:** `201` with user object + JWT token.

#### POST `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```
**Response:** `200` with user object + JWT token.

---

### User Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | Yes | Get user profile |
| PUT | `/api/users/profile` | Yes | Update profile |
| GET | `/api/users/stats` | Yes | Get body stats history |
| POST | `/api/users/body-stats` | Yes | Log body measurement |

#### PUT `/api/users/profile`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "fitnessGoal": "muscle-gain",
  "experience": "advanced",
  "weightLbs": 182,
  "heightInches": 70,
  "age": 28,
  "gender": "male"
}
```

#### POST `/api/users/body-stats`
```json
{
  "date": "2026-03-30",
  "weightLbs": 182,
  "bodyFatPct": 16,
  "chestInches": 42,
  "waistInches": 32,
  "armsInches": 15.5
}
```

---

### Program Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/programs` | No | List all programs (filterable) |
| GET | `/api/programs/:id` | No | Get program with days & exercises |
| POST | `/api/programs/generate` | Yes (Pro+) | AI-generate a program |
| POST | `/api/programs/:id/save` | Yes | Save program to user |
| GET | `/api/programs/saved` | Yes | Get user's saved programs |

#### GET `/api/programs?goal=muscle-gain&location=gym&level=intermediate`
Query parameters: `goal`, `location`, `experience`, `page`, `limit`

#### POST `/api/programs/generate`
```json
{
  "goal": "muscle-gain",
  "location": "gym",
  "experience": "intermediate",
  "daysPerWeek": 5
}
```
**Response:** Generated program with weekly split and exercises.

---

### Exercise Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/exercises` | No | List exercises (filterable) |
| GET | `/api/exercises/:id` | No | Get exercise details |
| GET | `/api/exercises/search?q=bench` | No | Search exercises |

#### GET `/api/exercises?muscle=chest&type=compound&equipment=barbell`
Query parameters: `muscle`, `type`, `equipment`, `difficulty`, `page`, `limit`

---

### Diet / Nutrition Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/diet/plans` | No | List diet plans |
| GET | `/api/diet/plans/:id` | No | Get plan with meals |
| POST | `/api/diet/calculate` | No | Calorie/macro calculator |
| POST | `/api/diet/log` | Yes | Log nutrition entry |
| GET | `/api/diet/log/:date` | Yes | Get day's nutrition log |

#### POST `/api/diet/calculate`
```json
{
  "gender": "male",
  "age": 28,
  "weightLbs": 175,
  "heightInches": 70,
  "activityLevel": 1.55,
  "goal": "gain"
}
```
**Response:**
```json
{
  "bmr": 1789,
  "tdee": 2773,
  "targetCalories": 3073,
  "macros": {
    "protein": { "grams": 175, "calories": 700, "percentage": 23 },
    "carbs": { "grams": 345, "calories": 1380, "percentage": 45 },
    "fats": { "grams": 110, "calories": 993, "percentage": 32 }
  }
}
```

---

### Shop Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/shop/products` | No | List products |
| GET | `/api/shop/products/:id` | No | Get single product |
| POST | `/api/shop/cart` | Yes | Add to server-side cart |
| GET | `/api/shop/cart` | Yes | Get user's cart |
| DELETE | `/api/shop/cart/:itemId` | Yes | Remove cart item |
| POST | `/api/shop/checkout` | Yes | Create order |
| GET | `/api/shop/orders` | Yes | Get user's order history |

#### GET `/api/shop/products?category=equipment&sort=price&order=asc`
Query parameters: `category`, `search`, `sort`, `order`, `page`, `limit`

#### POST `/api/shop/checkout`
```json
{
  "shippingName": "John Doe",
  "shippingAddress": "123 Main St, Austin, TX 78701",
  "paymentMethodId": "pm_stripe_payment_method"
}
```

---

### Workout Log Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/workouts/log` | Yes | Log a completed workout |
| GET | `/api/workouts/log` | Yes | Get workout history |
| GET | `/api/workouts/progress` | Yes | Get strength progress over time |

#### POST `/api/workouts/log`
```json
{
  "programDayId": 5,
  "date": "2026-03-30",
  "durationMin": 62,
  "exercises": [
    { "exerciseId": 1, "sets": [
      { "setNumber": 1, "weightLbs": 185, "reps": 8, "rpe": 7 },
      { "setNumber": 2, "weightLbs": 185, "reps": 8, "rpe": 8 },
      { "setNumber": 3, "weightLbs": 195, "reps": 6, "rpe": 9 }
    ]}
  ]
}
```

---

### Subscription Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/subscriptions/plans` | No | Get available plans |
| POST | `/api/subscriptions/subscribe` | Yes | Subscribe to plan |
| PUT | `/api/subscriptions/cancel` | Yes | Cancel subscription |

---

### Glossary Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/glossary` | No | Get all gym terms |

---

### Blog Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/articles` | No | List published articles |
| GET | `/api/articles/:slug` | No | Get single article |

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "details": []  // Optional validation errors
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Missing/invalid token |
| 403 | Forbidden — Insufficient permissions (e.g., free user accessing Pro feature) |
| 404 | Not Found |
| 429 | Too Many Requests — Rate limited |
| 500 | Internal Server Error |

---

## Database Connection

The backend uses PostgreSQL via the `pg` package. Configure via `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/Kynotra
```

Run `backend/schema.sql` to create all tables.
