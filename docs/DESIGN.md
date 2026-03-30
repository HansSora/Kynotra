# Kynotra — Design System & UI Decisions

Documentation of the visual design system, component patterns, and UI/UX choices.

---

## Design Philosophy

**Inspiration: Gymshark** — The design follows Gymshark's aesthetic principles:
- Dark, high-contrast color scheme
- Bold uppercase typography for headings
- Clean spacing and minimal decoration
- Accent color used sparingly for CTAs and highlights
- Professional, premium feel

**Layout Strategy: SaaS Conversion** — The homepage is structured like a high-converting SaaS landing page:
1. Hero with bold headline + CTA
2. Social proof (sponsor logos)
3. How it works (3-step)
4. Featured products
5. Feature grid
6. Pricing table
7. Testimonials
8. Final CTA

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1a1a2e` | Card backgrounds, nav |
| `--primary-light` | `#16213e` | Lighter card variant |
| `--accent` | `#39ff14` | CTAs, links, highlights |
| `--accent-hover` | `#6fff56` | Hover states |
| `--bg-dark` | `#0f0f1a` | Page background |
| `--bg-card` | `#1a1a2e` | Card backgrounds |
| `--text-primary` | `#ffffff` | Main text |
| `--text-secondary` | `#a0a0b8` | Body text, descriptions |
| `--text-muted` | `#6b6b80` | Labels, meta text |
| `--border-color` | `#2a2a45` | Borders, dividers |
| `--success` | `#00c853` | Checkmarks, positive changes |
| `--warning` | `#ffd600` | Stars, ratings |
| `--info` | `#00b0ff` | Info tags, carbs color |

### Gradients
- **Primary gradient**: `linear-gradient(135deg, #39ff14 0%, #6fff56 100%)` — Used for buttons, badges, avatars
- **Dark gradient**: `linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)` — Page header backgrounds
- **Card gradient**: `linear-gradient(145deg, #1e1e35 0%, #1a1a2e 100%)` — Subtle card depth

---

## Typography

### Font Stack
- **Headings**: `Oswald` — Bold, uppercase, condensed. Gives an athletic, powerful feel.
- **Body**: `Inter` — Clean, highly readable sans-serif optimized for screens.
- **Monospace**: `JetBrains Mono` — Reserved for code/data displays.

### Type Scale
| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Hero H1 | `clamp(2.8rem, 6vw, 5rem)` | 700 | Uppercase, tight leading |
| Section H2 | `clamp(2rem, 4vw, 3rem)` | 700 | Uppercase, letter-spacing: 2px |
| Card H3 | `1.3rem` | 700 | Uppercase |
| Body text | `0.95rem` | 400 | Normal case, 1.6 line-height |
| Labels | `0.85rem` | 600 | Uppercase, letter-spacing: 1px |
| Meta text | `0.8rem` | 400 | Uppercase, muted color |

### Key Typography Decisions
- All headings use `text-transform: uppercase` for bold, athletic branding
- `letter-spacing` ranges from 1px (small labels) to 3px (logo, large headers)
- `line-height: 1.05` for hero text (tight) vs `1.6` for body text (readable)
- `clamp()` used for responsive heading sizes without media queries

---

## Spacing System

Based on a `rem` scale using CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` (4px) | Minimal gaps |
| `--space-sm` | `0.5rem` (8px) | Tag padding, tight gaps |
| `--space-md` | `1rem` (16px) | Standard gap |
| `--space-lg` | `1.5rem` (24px) | Card padding, form groups |
| `--space-xl` | `2rem` (32px) | Section sub-spacing |
| `--space-2xl` | `3rem` (48px) | Major gaps |
| `--space-3xl` | `4rem` (64px) | Section inner spacing |
| `--space-4xl` | `6rem` (96px) | Section padding |

---

## Component Library

### Buttons
4 variants, 3 sizes:

| Variant | Style | Usage |
|---------|-------|-------|
| `.btn-primary` | Gradient background + accent shadow | Main CTAs |
| `.btn-secondary` | Transparent + border | Secondary actions |
| `.btn-outline` | Transparent + accent border | Tertiary actions |
| `.btn-block` | Full width | Form submits |

Sizes: `.btn-sm` (compact), default, `.btn-lg` (prominent)

All buttons have:
- `translateY(-2px)` hover lift
- Uppercase text with letter-spacing
- Smooth transitions (250ms)

### Cards
Used for programs, products, exercises:
- Dark gradient background
- 1px border (subtle in default, accent on hover)
- `border-radius: 12px`
- Hover: 4px lift + shadow + accent border glow
- Image zoom on hover (1.05 scale)

### Tags / Badges
3 color variants:
- `.tag-primary` — Red/accent (sale, featured)
- `.tag-success` — Green (active, essential)
- `.tag-info` — Blue (recommended, completed)

Pill-shaped (`border-radius: 9999px`), uppercase, small text.

### Forms
- Dark input backgrounds (`--primary`)
- 1px border, accent glow on focus
- Custom select arrows via SVG data URI
- Checkbox with accent color
- Consistent 14px padding

### Progress Bars
- 8px height, full-rounded
- Dark track, gradient fill
- Width transition animation (400ms)

### Tables
- Full-width, collapsed borders
- Dark header row
- Subtle hover effect on rows
- Responsive with `overflow-x: auto` container

### Toast Notifications
- Fixed bottom-right position
- Slide-up animation
- Success (green left border) or Error (red left border)
- Auto-dismiss after 3 seconds
- Uses `textContent` (not innerHTML) for XSS safety

---

## Layout Patterns

### Navigation Bar
- **Fixed** to top with `backdrop-filter: blur(20px)` for glassmorphism effect
- 72px height
- Logo (left) → Links (center) → Actions (right)
- Active link indicator: 2px accent underline animation
- Scroll effect: increased opacity + shadow when scrolled
- Mobile: Full-screen overlay with slide-in animation

### Grid System
CSS Grid utility classes:
- `.grid-2` — 2 columns
- `.grid-3` — 3 columns
- `.grid-4` — 4 columns

Responsive breakpoints:
- `1024px`: 4-col → 2-col, dashboard sidebar collapses
- `768px`: All grids → 1-col, mobile nav activates
- `480px`: Pricing grid → 1-col

### Section Pattern
Every content section follows:
```
.section (96px vertical padding)
  .container (max-width: 1200px, centered)
    .section-header (centered h2 + subtitle)
    [content grid]
```

Alternating background colors (`--bg-dark` / `--primary`) for visual rhythm.

### Page Header Pattern
All inner pages share:
- Top padding accounts for fixed navbar
- Centered title + description
- Breadcrumb navigation
- Radial gradient decorative glow behind text

---

## Responsive Strategy

### Breakpoints
| Breakpoint | Target |
|-----------|--------|
| `> 1024px` | Desktop (full layouts) |
| `768-1024px` | Tablet (2-column, collapsed sidebar) |
| `< 768px` | Mobile (single column, hamburger nav) |
| `< 480px` | Small mobile (reduced section padding) |

### Mobile-First Decisions
- `clamp()` for fluid typography
- Flexbox `flex-wrap` for natural reflow
- Touch targets minimum 44px
- Stacked buttons on mobile
- Simplified grid layouts

---

## Animations

| Animation | Trigger | Duration |
|-----------|---------|----------|
| `fadeInUp` | Scroll into view (IntersectionObserver) | 600ms |
| `translateY(-2px)` | Button/card hover | 250ms |
| `scale(1.05)` | Card image hover | 400ms |
| `width` | Nav link underline | 250ms |
| `translateY(120% → 0)` | Toast notification | 250ms |
| `translateX(100% → 0)` | Mobile nav slide-in | 250ms |
| Staggered delay | Grid children (nth-child) | +100ms each |

All animations use `ease` timing function for natural movement.

---

## Accessibility

- Semantic HTML structure (nav, main, section, footer, article)
- `.sr-only` class for screen-reader-only content
- Proper label/input associations in forms
- Required attributes on form fields
- `alt` text on images
- Keyboard-navigable (Escape closes modals)
- Touch-friendly sizing
- Sufficient color contrast (white on dark)

---

## Security Considerations

- Toast messages use `textContent` instead of `innerHTML` to prevent XSS
- Form inputs have `required`, `type`, and `minlength` validation
- Cart data stored in `localStorage` (client-side only, non-sensitive)
- Backend uses: Helmet.js, CORS, rate limiting, bcrypt for passwords, JWT for auth
- `.env.example` provided — no secrets committed
