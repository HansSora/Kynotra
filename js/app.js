/* ============================================
   Kynotra - Main JavaScript
   ============================================ */

// Resolve base path from the script src (handles pages at any folder depth)
const _base = (function() {
  const s = document.querySelector('script[src$="app.js"]');
  if (!s) return '';
  return s.getAttribute('src').replace(/js\/app\.js$/, '');
})();

// ==========================================
// PAGE TRANSITIONS
// ==========================================
(function initPageTransitions() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');

    // Only handle internal page navigations (not anchors, external, or javascript:)
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')
        || href.startsWith('tel:') || href.startsWith('javascript:') || link.target === '_blank') return;

    // Skip cart icon — handled by cart popup
    if (link.classList.contains('nav-cart')) return;

    e.preventDefault();
    document.body.classList.add('page-exit');

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
})();

// ==========================================
// NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAuth();
  initScrollAnimations();
  initCustomDropdowns();
  disableNumberInputScroll();
  updateCartCount();
});

// Disable mouse wheel scroll on number inputs
function disableNumberInputScroll() {
  document.addEventListener('wheel', (e) => {
    if (document.activeElement.type === 'number') {
      document.activeElement.blur();
    }
  }, { passive: true });
}

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// ==========================================
// CUSTOM DROPDOWNS
// ==========================================
function initCustomDropdowns() {
  document.querySelectorAll('.custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const options = select.querySelectorAll('.custom-select-option');
    const hiddenInput = select.querySelector('input[type="hidden"]');
    const valueDisplay = select.querySelector('.custom-select-value');

    // Toggle dropdown
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other dropdowns
      document.querySelectorAll('.custom-select.open').forEach(s => {
        if (s !== select) s.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    // Select option
    options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.querySelector('.option-text')?.textContent || option.textContent;

        // Update hidden input
        if (hiddenInput) hiddenInput.value = value;

        // Update display
        if (valueDisplay) valueDisplay.textContent = text;

        // Update visual state
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        select.classList.add('has-value');
        select.classList.remove('open');
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
      document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
    }
  });
}

// ==========================================
// PROGRAM GENERATOR
// ==========================================
// ==========================================
// PROGRAM WIZARD — Step-by-step navigation
// ==========================================
let progUnit = 'imperial';

function setProgUnit(unit) {
  progUnit = unit;
  const wl = document.getElementById('progWeightLabel');
  const hl = document.getElementById('progHeightLabel');
  const wi = document.getElementById('progWeight');
  const hi = document.getElementById('progHeight');
  const btnI = document.getElementById('progUnitImperial');
  const btnM = document.getElementById('progUnitMetric');
  if (!wl) return;

  if (unit === 'metric') {
    wl.textContent = 'Weight (kg)';
    hl.textContent = 'Height (cm)';
    wi.placeholder = '80'; wi.min = '30'; wi.max = '250';
    hi.placeholder = '178'; hi.min = '90'; hi.max = '250';
    btnM.classList.add('active'); btnI.classList.remove('active');
  } else {
    wl.textContent = 'Weight (lbs)';
    hl.textContent = 'Height (inches)';
    wi.placeholder = '175'; wi.min = '60'; wi.max = '500';
    hi.placeholder = '70'; hi.min = '36'; hi.max = '96';
    btnI.classList.add('active'); btnM.classList.remove('active');
  }
  wi.value = '';
  hi.value = '';
}

function updateStepIndicator(step) {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('stepDot' + i);
    const num = dot?.querySelector('.step-num');
    if (!dot || !num) continue;
    if (i < step) {
      num.style.background = 'var(--accent)';
      num.style.color = '#0f0f1a';
      num.textContent = '✓';
    } else if (i === step) {
      num.style.background = 'var(--accent)';
      num.style.color = '#0f0f1a';
      num.textContent = i;
    } else {
      num.style.background = 'var(--border-color)';
      num.style.color = 'var(--text-muted)';
      num.textContent = i;
    }
    // Lines between dots
    const line = document.getElementById('stepLine' + i);
    if (line) line.style.background = i < step ? 'var(--accent)' : 'var(--border-color)';
  }
}

function wizardNext(current) {
  // Validate current step
  if (current === 1) {
    const g = document.getElementById('progGender')?.value;
    const a = document.getElementById('progAge')?.value;
    const w = document.getElementById('progWeight')?.value;
    const h = document.getElementById('progHeight')?.value;
    if (!g || !a || !w || !h) { showToast('Please fill in all body details', 'error'); return; }
  }
  if (current === 2) {
    const goal = document.getElementById('goalSelect')?.value;
    const level = document.getElementById('levelSelect')?.value;
    if (!goal || !level) { showToast('Please select your goal and experience level', 'error'); return; }
  }
  if (current === 3) {
    const loc = document.getElementById('locationSelect')?.value;
    const days = document.getElementById('daysSelect')?.value;
    if (!loc || !days) { showToast('Please select location and training days', 'error'); return; }
  }

  const next = current + 1;
  document.getElementById('wizardStep' + current).style.display = 'none';
  document.getElementById('wizardStep' + next).style.display = 'block';
  updateStepIndicator(next);

  // If going to summary, build it
  if (next === 4) buildWizardSummary();

  // Scroll to top of form
  document.getElementById('programGenerator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function wizardPrev(current) {
  const prev = current - 1;
  document.getElementById('wizardStep' + current).style.display = 'none';
  document.getElementById('wizardStep' + prev).style.display = 'block';
  updateStepIndicator(prev);
  document.getElementById('programGenerator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildWizardSummary() {
  const gender = document.getElementById('progGender')?.value;
  const age = document.getElementById('progAge')?.value;
  const weight = document.getElementById('progWeight')?.value;
  const height = document.getElementById('progHeight')?.value;
  const goal = document.getElementById('goalSelect');
  const level = document.getElementById('levelSelect');
  const location = document.getElementById('locationSelect');
  const days = document.getElementById('daysSelect');

  const weightUnit = progUnit === 'metric' ? 'kg' : 'lbs';
  const heightUnit = progUnit === 'metric' ? 'cm' : 'in';
  const goalText = goal?.options[goal.selectedIndex]?.text || '';
  const levelText = level?.options[level.selectedIndex]?.text || '';
  const locText = location?.options[location.selectedIndex]?.text || '';
  const daysText = days?.options[days.selectedIndex]?.text || '';

  const el = document.getElementById('wizardSummary');
  if (!el) return;

  el.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Gender</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${gender === 'male' ? '♂ Male' : '♀ Female'}</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Age</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${age} years</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Weight</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${weight} ${weightUnit}</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Height</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${height} ${heightUnit}</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Goal</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px; color: var(--accent);">${goalText}</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Level</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${levelText}</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Location</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${locText}</div>
      </div>
      <div style="padding: var(--space-md); background: var(--bg-card); border-radius: var(--radius-md);">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Schedule</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 4px;">${daysText}</div>
      </div>
    </div>
  `;
}

function generateProgram() {
  const goal = document.getElementById('goalSelect')?.value;
  const level = document.getElementById('levelSelect')?.value;
  const location = document.getElementById('locationSelect')?.value;
  const days = document.getElementById('daysSelect')?.value;

  if (!goal || !level || !location || !days) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  const programs = {
    'weight-loss': {
      name: 'Fat Burn Accelerator',
      focus: 'Calorie deficit + High-intensity training',
      style: 'Full Body + HIIT',
      splits: {
        '3': ['Full Body A', 'HIIT Cardio', 'Full Body B'],
        '4': ['Upper Body', 'HIIT Cardio', 'Lower Body', 'Metabolic Conditioning'],
        '5': ['Push + HIIT', 'Pull', 'Legs + Core', 'Upper HIIT', 'Lower + Cardio'],
        '6': ['Push', 'Pull + HIIT', 'Legs', 'Upper Body', 'HIIT + Core', 'Lower Body']
      }
    },
    'muscle-gain': {
      name: 'Muscle Builder AI',
      focus: 'Calorie surplus + Hypertrophy training',
      style: 'Push/Pull/Legs',
      splits: {
        '3': ['Push (Chest/Shoulders/Tri)', 'Pull (Back/Biceps)', 'Legs (Quads/Hams/Glutes)'],
        '4': ['Upper Strength', 'Lower Strength', 'Upper Hypertrophy', 'Lower Hypertrophy'],
        '5': ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body'],
        '6': ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']
      }
    },
    'strength': {
      name: 'Strength Protocol',
      focus: 'Progressive overload + Compound lifts',
      style: 'Powerlifting / Strength',
      splits: {
        '3': ['Squat Day', 'Bench Day', 'Deadlift Day'],
        '4': ['Squat + Accessories', 'Bench + Accessories', 'Deadlift + Accessories', 'Overhead Press + Volume'],
        '5': ['Heavy Squat', 'Heavy Bench', 'Deadlift', 'Volume Upper', 'Volume Lower'],
        '6': ['Squat', 'Bench', 'Deadlift', 'OHP', 'Squat Volume', 'Bench Volume']
      }
    },
    'maintenance': {
      name: 'Balanced Fitness',
      focus: 'Maintenance calories + General fitness',
      style: 'Full Body / Upper-Lower',
      splits: {
        '3': ['Full Body A', 'Full Body B', 'Full Body C'],
        '4': ['Upper Body', 'Lower Body', 'Upper Body', 'Lower Body'],
        '5': ['Push', 'Pull', 'Legs', 'Full Body', 'Active Recovery'],
        '6': ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Cardio + Core']
      }
    },
    'endurance': {
      name: 'Endurance Engine',
      focus: 'Cardiovascular + Muscular endurance',
      style: 'Circuit Training + Cardio',
      splits: {
        '3': ['Circuit Training A', 'Cardio + Core', 'Circuit Training B'],
        '4': ['Upper Circuit', 'Cardio Intervals', 'Lower Circuit', 'Endurance Mix'],
        '5': ['Push Circuit', 'Running/Cardio', 'Pull Circuit', 'HIIT', 'Legs + Core'],
        '6': ['Upper Circuit', 'Cardio A', 'Lower Circuit', 'HIIT', 'Full Body', 'Long Cardio']
      }
    }
  };

  const exercises = {
    gym: {
      push: ['Barbell Bench Press 4×6-8', 'Incline DB Press 3×8-10', 'Overhead Press 3×8-10', 'Cable Flyes 3×12-15', 'Lateral Raises 4×12-15', 'Tricep Pushdowns 3×12-15'],
      pull: ['Barbell Deadlift 4×5-6', 'Weighted Pull-Ups 4×6-8', 'Barbell Rows 3×8-10', 'Face Pulls 3×15-20', 'Barbell Curls 3×10-12', 'Hammer Curls 3×10-12'],
      legs: ['Barbell Back Squat 4×6-8', 'Romanian Deadlift 3×8-10', 'Leg Press 3×10-12', 'Walking Lunges 3×12 each', 'Leg Curls 3×12-15', 'Calf Raises 4×15-20']
    },
    home: {
      push: ['Push-Ups 4×15-20', 'Diamond Push-Ups 3×12-15', 'Pike Push-Ups 3×10-12', 'Dips (chair) 3×12-15', 'Incline Push-Ups 3×15', 'Plank to Push-Up 3×10'],
      pull: ['Pull-Ups/Doorframe Rows 4×8-12', 'Towel Rows 3×12', 'Superman Hold 3×30s', 'Resistance Band Rows 3×12-15', 'Chin-Ups 3×8-10', 'Band Curls 3×15'],
      legs: ['Goblet Squat 4×12-15', 'Bulgarian Split Squats 3×10 each', 'Glute Bridge 3×15', 'Jump Squats 3×12', 'Single-Leg RDL 3×10 each', 'Wall Sits 3×45s']
    },
    'home-equipped': {
      push: ['DB Bench Press 4×8-10', 'DB Incline Press 3×10-12', 'DB Overhead Press 3×8-10', 'DB Flyes 3×12-15', 'DB Lateral Raises 4×12-15', 'DB Tricep Extension 3×12'],
      pull: ['DB Rows 4×8-10', 'Pull-Ups 4×8-12', 'DB Shrugs 3×12', 'Band Face Pulls 3×15-20', 'DB Curls 3×10-12', 'DB Hammer Curls 3×10-12'],
      legs: ['DB Goblet Squat 4×10-12', 'DB Romanian Deadlift 3×10-12', 'DB Lunges 3×10 each', 'DB Step-Ups 3×10 each', 'DB Calf Raises 4×15-20', 'DB Sumo Squat 3×12']
    }
  };

  const program = programs[goal];
  const split = program.splits[days];
  const locationExercises = exercises[location] || exercises.gym;

  let html = `
    <div style="background: var(--gradient-card); border: 1px solid var(--accent); border-radius: var(--radius-xl); padding: var(--space-2xl);">
      <div style="text-align: center; margin-bottom: var(--space-2xl);">
        <span class="tag tag-success" style="margin-bottom: var(--space-md); display: inline-block;">AI-Generated</span>
        <h2 style="font-family: var(--font-heading); font-size: 2rem; text-transform: uppercase; margin-bottom: var(--space-sm);">${program.name}</h2>
        <p style="color: var(--text-secondary);">${program.focus}</p>
        <div style="display: flex; gap: var(--space-lg); justify-content: center; margin-top: var(--space-lg);">
          <span class="tag tag-primary">${days} Days/Week</span>
          <span class="tag tag-info">${level.charAt(0).toUpperCase() + level.slice(1)}</span>
          <span class="tag tag-success">${location === 'gym' ? 'Full Gym' : location === 'home' ? 'Home' : 'Home Gym'}</span>
        </div>
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; text-transform: uppercase; margin-bottom: var(--space-lg);">Weekly Split:</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-md);">
  `;

  split.forEach((day, i) => {
    const dayExercises = day.toLowerCase().includes('push') || day.toLowerCase().includes('upper') || day.toLowerCase().includes('chest') || day.toLowerCase().includes('bench')
      ? locationExercises.push
      : day.toLowerCase().includes('pull') || day.toLowerCase().includes('back') || day.toLowerCase().includes('deadlift')
        ? locationExercises.pull
        : day.toLowerCase().includes('leg') || day.toLowerCase().includes('lower') || day.toLowerCase().includes('squat')
          ? locationExercises.legs
          : locationExercises.push.slice(0, 3).concat(locationExercises.legs.slice(0, 3));

    html += `
      <div style="background: var(--primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-lg);">
        <div style="font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-sm);">Day ${i + 1}</div>
        <h4 style="font-size: 1rem; margin-bottom: var(--space-md);">${day}</h4>
        <ul style="font-size: 0.85rem; color: var(--text-secondary);">
          ${dayExercises.map(ex => `<li style="padding: 3px 0;">• ${ex}</li>`).join('')}
        </ul>
      </div>
    `;
  });

  html += `
      </div>
      <div style="margin-top: var(--space-2xl); text-align: center;">
        <a href="${_base}pages/auth/signup.html" class="btn btn-primary">Save This Program — Sign Up Free →</a>
      </div>
    </div>
  `;

  const container = document.getElementById('generatedProgram');
  if (container) {
    container.innerHTML = html;
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================
// WORKOUT DAY TABS
// ==========================================
function showDay(dayId, btn) {
  document.querySelectorAll('.workout-day').forEach(d => d.style.display = 'none');
  const target = document.getElementById(dayId);
  if (target) target.style.display = 'block';

  if (btn) {
    btn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// ==========================================
// CALORIE & MACRO CALCULATOR
// ==========================================
// ==========================================
// UNIT TOGGLE (Imperial ↔ Metric)
// ==========================================
let currentUnit = 'imperial';
let dashUnit = 'imperial';

function setUnit(unit) {
  currentUnit = unit;
  const weightLabel = document.getElementById('weightLabel');
  const heightLabel = document.getElementById('heightLabel');
  const weightInput = document.getElementById('calcWeight');
  const heightInput = document.getElementById('calcHeight');
  const btnImp = document.getElementById('unitImperial');
  const btnMet = document.getElementById('unitMetric');

  if (!weightLabel || !heightLabel) return;

  if (unit === 'metric') {
    weightLabel.textContent = 'Weight (kg)';
    heightLabel.textContent = 'Height (cm)';
    weightInput.placeholder = '80';
    weightInput.min = '30';
    weightInput.max = '250';
    heightInput.placeholder = '178';
    heightInput.min = '90';
    heightInput.max = '250';
    btnMet.classList.add('active');
    btnImp.classList.remove('active');
  } else {
    weightLabel.textContent = 'Weight (lbs)';
    heightLabel.textContent = 'Height (inches)';
    weightInput.placeholder = '175';
    weightInput.min = '60';
    weightInput.max = '500';
    heightInput.placeholder = '70';
    heightInput.min = '36';
    heightInput.max = '96';
    btnImp.classList.add('active');
    btnMet.classList.remove('active');
  }

  // Clear values so user re-enters in correct unit
  weightInput.value = '';
  heightInput.value = '';
}

// ==========================================
// DASHBOARD UNIT TOGGLE
// ==========================================
function setDashUnit(unit) {
  dashUnit = unit;
  const btnImp = document.getElementById('dashUnitImperial');
  const btnMet = document.getElementById('dashUnitMetric');

  if (btnImp && btnMet) {
    btnImp.classList.toggle('active', unit === 'imperial');
    btnMet.classList.toggle('active', unit === 'metric');
  }

  // Convert all .wt spans
  document.querySelectorAll('.wt').forEach((el) => {
    const lbs = parseFloat(el.dataset.lbs);
    if (isNaN(lbs)) return;
    const text = el.textContent;
    const hasPlus = text.trim().startsWith('+');

    if (unit === 'metric') {
      const kg = Math.round(lbs * 0.453592 * 10) / 10;
      el.textContent = (hasPlus ? '+' : '') + kg + ' kg';
    } else {
      el.textContent = (hasPlus ? '+' : '') + lbs + ' lbs';
    }
  });
}

function calculateCalories() {
  const gender = document.getElementById('calcGender')?.value;
  const age = parseFloat(document.getElementById('calcAge')?.value);
  const weight = parseFloat(document.getElementById('calcWeight')?.value);
  const height = parseFloat(document.getElementById('calcHeight')?.value);
  const activity = parseFloat(document.getElementById('calcActivity')?.value);
  const goal = document.getElementById('calcGoal')?.value;

  if (!age || !weight || !height) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Convert to metric for Mifflin-St Jeor
  let weightKg, heightCm, weightLbs;
  if (currentUnit === 'metric') {
    weightKg = weight;
    heightCm = height;
    weightLbs = weight / 0.453592;
  } else {
    weightKg = weight * 0.453592;
    heightCm = height * 2.54;
    weightLbs = weight;
  }

  let bmr;
  if (gender === 'male') {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }

  let tdee = Math.round(bmr * activity);

  // Adjust for goal
  let calories;
  switch (goal) {
    case 'lose': calories = tdee - 500; break;
    case 'gain': calories = tdee + 300; break;
    case 'bulk': calories = tdee + 500; break;
    default: calories = tdee;
  }

  // Calculate macros
  const proteinGrams = Math.round(weightLbs * 1.0); // 1g per lb bodyweight
  const fatGrams = Math.round((calories * 0.25) / 9); // 25% of calories from fat
  const carbGrams = Math.round((calories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

  // Display results
  document.getElementById('totalCalories').textContent = calories.toLocaleString();
  document.getElementById('macroProtein').textContent = proteinGrams + 'g';
  document.getElementById('macroCarbs').textContent = carbGrams + 'g';
  document.getElementById('macroFats').textContent = fatGrams + 'g';

  const result = document.getElementById('calorieResult');
  if (result) {
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ==========================================
// FILTER FUNCTIONS
// ==========================================
function filterPrograms(category, btn) {
  const cards = document.querySelectorAll('#programsGrid .card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category') || '';
    card.style.display = (category === 'all' || cat.includes(category)) ? '' : 'none';
  });
  updateFilterButtons(btn);
}

function filterExercises(muscle, btn) {
  const cards = document.querySelectorAll('#exerciseGrid .exercise-card');
  cards.forEach(card => {
    const m = card.getAttribute('data-muscle') || '';
    card.style.display = (muscle === 'all' || m === muscle) ? '' : 'none';
  });
  updateFilterButtons(btn);
}

function filterProducts(category, btn) {
  const cards = document.querySelectorAll('#productsGrid .product-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category') || '';
    card.style.display = (category === 'all' || cat.includes(category)) ? '' : 'none';
  });
  updateFilterButtons(btn);
}

function updateFilterButtons(activeBtn) {
  if (activeBtn) {
    activeBtn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }
}

function searchExercises(query) {
  const cards = document.querySelectorAll('#exerciseGrid .exercise-card');
  const q = query.toLowerCase();
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
}

// ==========================================
// EXERCISE MODAL
// ==========================================
function openExercise(card) {
  const name = card.querySelector('h3')?.textContent || '';
  const muscle = card.querySelector('.muscle-group')?.textContent || '';
  const description = card.querySelector('p:not(.muscle-group)')?.textContent || '';
  const details = card.querySelector('.exercise-details');

  let detailsHtml = '';
  if (details) {
    detailsHtml = details.innerHTML;
  } else {
    detailsHtml = `
      <div class="exercise-instructions">
        <h4>Step-by-Step Instructions:</h4>
        <ol>
          <li>Set up with proper form and positioning</li>
          <li>Engage the target muscles before initiating the movement</li>
          <li>Perform the concentric (lifting) phase with controlled speed</li>
          <li>Pause briefly at the point of peak contraction</li>
          <li>Lower the weight slowly during the eccentric phase</li>
          <li>Return to starting position and repeat</li>
        </ol>
        <h4>Tips:</h4>
        <ul>
          <li>Focus on mind-muscle connection</li>
          <li>Control the tempo — don't use momentum</li>
          <li>Breathe out on exertion, in on the return</li>
          <li>Start light and master form before adding weight</li>
        </ul>
      </div>
    `;
  }

  const modal = document.getElementById('exerciseModal');
  const content = document.getElementById('modalContent');
  if (modal && content) {
    content.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: var(--space-md);">🏋️</div>
      <h2 style="font-family: var(--font-heading); font-size: 1.6rem; text-transform: uppercase; margin-bottom: var(--space-sm);">${name}</h2>
      <p style="color: var(--accent); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-lg);">${muscle}</p>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-xl);">${description}</p>
      ${detailsHtml}
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeExercise() {
  const modal = document.getElementById('exerciseModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('exerciseModal');
  if (modal && e.target === modal) {
    closeExercise();
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeExercise();
    closeTimer();
  }
});

// ==========================================
// SHOPPING CART & CHECKOUT
// ==========================================
let cart = JSON.parse(localStorage.getItem('Kynotra_cart') || '[]');
let checkoutStep = 0; // 0=cart, 1=shipping, 2=payment, 3=confirmation
let appliedPromo = null;

const PROMO_CODES = {
  'KYNOTRA20': { type: 'percent', value: 20, label: '20% off' },
  'FIT10':    { type: 'percent', value: 10, label: '10% off' },
  'SHIP0':    { type: 'shipping', value: 0,  label: 'Free shipping' },
  'SAVE5':    { type: 'flat',    value: 5,   label: '$5 off' },
};

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 7.99;

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  showToast(`${name} added to cart!`, 'success');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartView();
}

function updateCartQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCartView();
}

function saveCart() {
  localStorage.setItem('Kynotra_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countEls = document.querySelectorAll('#cartCount');
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  countEls.forEach(el => el.textContent = total);
}

function getCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  let discount = 0;
  let shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (appliedPromo) {
    if (appliedPromo.type === 'percent') discount = subtotal * (appliedPromo.value / 100);
    else if (appliedPromo.type === 'flat') discount = Math.min(appliedPromo.value, subtotal);
    else if (appliedPromo.type === 'shipping') shippingFree = true;
  }

  const afterDiscount = Math.max(subtotal - discount, 0);
  const shipping = shippingFree ? 0 : SHIPPING_COST;
  const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100;
  const total = Math.round((afterDiscount + shipping + tax) * 100) / 100;

  return { subtotal, discount, afterDiscount, shipping, shippingFree, tax, total };
}

// ---- Popup injection ----
function ensureCartPopup() {
  if (document.getElementById('cartSidebar')) return;
  const popup = document.createElement('div');
  popup.id = 'cartSidebar';
  popup.className = 'cart-popup';
  popup.innerHTML = `
    <div class="cart-popup-header">
      <h3 id="cartPopupTitle">Your Cart</h3>
      <button onclick="closeCart()" class="cart-popup-close">✕</button>
    </div>
    <div class="cart-popup-body" id="cartPopupBody"></div>
    <div class="cart-popup-footer" id="cartPopupFooter"></div>
  `;
  const overlay = document.createElement('div');
  overlay.id = 'cartOverlay';
  overlay.className = 'cart-overlay';
  overlay.onclick = closeCart;
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

function toggleCart() {
  ensureCartPopup();
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');

  const isOpen = sidebar.style.display === 'flex';
  if (isOpen) {
    closeCart();
  } else {
    checkoutStep = 0;
    sidebar.classList.remove('checkout-mode');
    sidebar.style.display = 'flex';
    overlay.style.display = 'block';
    renderCartView();
  }
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) {
    sidebar.style.display = 'none';
    sidebar.classList.remove('checkout-mode');
  }
  if (overlay) overlay.style.display = 'none';
  checkoutStep = 0;
}

// ---- Step 0: Cart View ----
function renderCartView() {
  const body = document.getElementById('cartPopupBody');
  const footer = document.getElementById('cartPopupFooter');
  const title = document.getElementById('cartPopupTitle');
  if (!body || !footer) return;

  title.textContent = 'Your Cart';
  document.getElementById('cartSidebar').classList.remove('checkout-mode');

  if (cart.length === 0) {
    body.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: var(--space-2xl) 0;">Your cart is empty</p>';
    footer.innerHTML = '';
    return;
  }

  const safeName = (name) => typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(name) : name.replace(/</g, '&lt;');

  let itemsHTML = '<div class="cart-popup-items">';
  cart.forEach((item, i) => {
    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${safeName(item.name)}</h4>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="cart-qty-btn" onclick="updateCartQty(${i}, -1)">−</button>
          <span style="font-size: 0.88rem; min-width: 20px; text-align: center;">${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCartQty(${i}, 1)">+</button>
          <button class="cart-remove-btn" onclick="removeFromCart(${i})">✕</button>
        </div>
      </div>`;
  });
  itemsHTML += '</div>';

  const t = getCartTotals();

  let promoHTML = '';
  if (appliedPromo) {
    promoHTML = `
      <div class="promo-applied">
        <span>✓ ${appliedPromo.code} — ${appliedPromo.label}</span>
        <button onclick="removePromo()">✕</button>
      </div>`;
  } else {
    promoHTML = `
      <div class="promo-row">
        <input type="text" id="promoInput" placeholder="Promo code" maxlength="20">
        <button class="btn btn-sm btn-outline" onclick="applyPromo()">Apply</button>
      </div>`;
  }

  let summaryHTML = `
    <div class="cart-popup-total">
      <div class="checkout-summary-row"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
      ${t.discount > 0 ? `<div class="checkout-summary-row" style="color: var(--success);"><span>Discount</span><span>−$${t.discount.toFixed(2)}</span></div>` : ''}
      <div class="checkout-summary-row"><span>Shipping</span><span>${t.shippingFree ? '<span style="color: var(--success);">Free</span>' : '$' + t.shipping.toFixed(2)}</span></div>
      <div class="checkout-summary-row"><span>Tax (8%)</span><span>$${t.tax.toFixed(2)}</span></div>
      <div class="checkout-summary-row total-row"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
      ${!t.shippingFree && !appliedPromo ? `<p style="color: var(--text-muted); font-size: 0.78rem; margin-top: 4px;">Add $${(FREE_SHIPPING_THRESHOLD - t.subtotal).toFixed(2)} more for free shipping</p>` : ''}
    </div>`;

  body.innerHTML = itemsHTML + promoHTML + summaryHTML;
  footer.innerHTML = `<button class="btn btn-primary btn-block" onclick="startCheckout()">Proceed to Checkout</button>`;
}

// ---- Promo Codes ----
function applyPromo() {
  const input = document.getElementById('promoInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) {
    showToast('Invalid promo code', 'error');
    input.classList.add('invalid');
    return;
  }
  appliedPromo = { ...promo, code };
  showToast(`Code ${code} applied!`, 'success');
  renderCartView();
}

function removePromo() {
  appliedPromo = null;
  renderCartView();
}

// ---- Step 1: Shipping ----
function startCheckout() {
  if (cart.length === 0) return;
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  if (!user) {
    showToast('Please log in to checkout', 'error');
    return;
  }
  checkoutStep = 1;
  renderShippingStep();
}

function renderCheckoutSteps(active) {
  const steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Confirm' },
  ];
  return `<div class="checkout-steps">${steps.map((s, i) => {
    let cls = '';
    if (s.num < active) cls = 'completed';
    else if (s.num === active) cls = 'active';
    return `<div class="checkout-step ${cls}">
      <span class="step-num">${s.num < active ? '✓' : s.num}</span>${s.label}
    </div>${i < steps.length - 1 ? '<span class="checkout-step-sep">›</span>' : ''}`;
  }).join('')}</div>`;
}

function renderShippingStep() {
  const sidebar = document.getElementById('cartSidebar');
  const body = document.getElementById('cartPopupBody');
  const footer = document.getElementById('cartPopupFooter');
  const title = document.getElementById('cartPopupTitle');
  if (!body) return;

  sidebar.classList.add('checkout-mode');
  title.textContent = 'Checkout';

  const saved = JSON.parse(localStorage.getItem('Kynotra_shipping') || 'null');

  body.innerHTML = renderCheckoutSteps(1) + `
    <div class="checkout-form-group">
      <label>Full Name *</label>
      <input type="text" id="shipName" placeholder="John Doe" value="${saved?.name || ''}" maxlength="100">
    </div>
    <div class="checkout-form-group">
      <label>Email *</label>
      <input type="email" id="shipEmail" placeholder="john@example.com" value="${saved?.email || ''}" maxlength="200">
    </div>
    <div class="checkout-form-group">
      <label>Phone</label>
      <input type="tel" id="shipPhone" placeholder="(555) 123-4567" value="${saved?.phone || ''}" maxlength="20">
    </div>
    <div class="checkout-form-group">
      <label>Address *</label>
      <input type="text" id="shipAddress" placeholder="123 Main St, Apt 4" value="${saved?.address || ''}" maxlength="300">
    </div>
    <div class="checkout-form-row">
      <div class="checkout-form-group">
        <label>City *</label>
        <input type="text" id="shipCity" placeholder="New York" value="${saved?.city || ''}" maxlength="100">
      </div>
      <div class="checkout-form-group">
        <label>State *</label>
        <select id="shipState">
          <option value="">Select</option>
          ${US_STATES.map(s => `<option value="${s}" ${saved?.state === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="checkout-form-row">
      <div class="checkout-form-group">
        <label>ZIP Code *</label>
        <input type="text" id="shipZip" placeholder="10001" value="${saved?.zip || ''}" maxlength="10">
      </div>
      <div class="checkout-form-group">
        <label>Country</label>
        <input type="text" id="shipCountry" value="United States" disabled>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <div class="checkout-nav">
      <button class="btn-back" onclick="backToCart()">← Cart</button>
      <button class="btn btn-primary" style="flex:1;" onclick="goToPayment()">Continue to Payment</button>
    </div>`;
}

function backToCart() {
  checkoutStep = 0;
  renderCartView();
}

function validateShipping() {
  const fields = {
    name: document.getElementById('shipName'),
    email: document.getElementById('shipEmail'),
    address: document.getElementById('shipAddress'),
    city: document.getElementById('shipCity'),
    state: document.getElementById('shipState'),
    zip: document.getElementById('shipZip'),
  };

  let valid = true;
  Object.values(fields).forEach(f => f.classList.remove('invalid'));

  if (!fields.name.value.trim()) { fields.name.classList.add('invalid'); valid = false; }
  if (!fields.email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) { fields.email.classList.add('invalid'); valid = false; }
  if (!fields.address.value.trim()) { fields.address.classList.add('invalid'); valid = false; }
  if (!fields.city.value.trim()) { fields.city.classList.add('invalid'); valid = false; }
  if (!fields.state.value) { fields.state.classList.add('invalid'); valid = false; }
  if (!fields.zip.value.trim() || !/^\d{5}(-\d{4})?$/.test(fields.zip.value.trim())) { fields.zip.classList.add('invalid'); valid = false; }

  if (valid) {
    const data = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: document.getElementById('shipPhone')?.value.trim() || '',
      address: fields.address.value.trim(),
      city: fields.city.value.trim(),
      state: fields.state.value,
      zip: fields.zip.value.trim(),
    };
    localStorage.setItem('Kynotra_shipping', JSON.stringify(data));
    return data;
  }
  return null;
}

function goToPayment() {
  const shipping = validateShipping();
  if (!shipping) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  checkoutStep = 2;
  renderPaymentStep();
}

// ---- Step 2: Payment ----
function renderPaymentStep() {
  const body = document.getElementById('cartPopupBody');
  const footer = document.getElementById('cartPopupFooter');
  if (!body) return;

  const t = getCartTotals();

  body.innerHTML = renderCheckoutSteps(2) + `
    <div class="card-type-icons">
      <span class="active">VISA</span>
      <span>MasterCard</span>
      <span>AMEX</span>
    </div>
    <div class="checkout-form-group">
      <label>Card Number *</label>
      <input type="text" id="payCard" placeholder="4242 4242 4242 4242" maxlength="19" oninput="formatCardNumber(this)">
    </div>
    <div class="checkout-form-group">
      <label>Cardholder Name *</label>
      <input type="text" id="payName" placeholder="Name on card" maxlength="100">
    </div>
    <div class="checkout-form-row-3">
      <div class="checkout-form-group">
        <label>Expiry *</label>
        <input type="text" id="payExpiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)">
      </div>
      <div class="checkout-form-group">
        <label>CVC *</label>
        <input type="text" id="payCVC" placeholder="123" maxlength="4">
      </div>
      <div></div>
    </div>

    <div style="margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid var(--border-color);">
      <div class="checkout-summary-row"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
      ${t.discount > 0 ? `<div class="checkout-summary-row" style="color:var(--success);"><span>Discount</span><span>−$${t.discount.toFixed(2)}</span></div>` : ''}
      <div class="checkout-summary-row"><span>Shipping</span><span>${t.shippingFree ? '<span style="color:var(--success);">Free</span>' : '$' + t.shipping.toFixed(2)}</span></div>
      <div class="checkout-summary-row"><span>Tax</span><span>$${t.tax.toFixed(2)}</span></div>
      <div class="checkout-summary-row total-row"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
    </div>

    <div class="secure-badge">🔒 Secure SSL encrypted payment</div>
  `;

  footer.innerHTML = `
    <div class="checkout-nav">
      <button class="btn-back" onclick="checkoutStep=1; renderShippingStep();">← Shipping</button>
      <button class="btn btn-primary" style="flex:1;" onclick="goToReview()">Review Order</button>
    </div>`;
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 4);
  if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
  input.value = val;
}

function detectCardType(number) {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'VISA';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'MasterCard';
  if (/^3[47]/.test(n)) return 'AMEX';
  return null;
}

function validatePayment() {
  const card = document.getElementById('payCard');
  const name = document.getElementById('payName');
  const expiry = document.getElementById('payExpiry');
  const cvc = document.getElementById('payCVC');

  [card, name, expiry, cvc].forEach(f => f.classList.remove('invalid'));
  let valid = true;

  const cardNum = card.value.replace(/\s/g, '');
  if (cardNum.length < 13 || cardNum.length > 16 || !/^\d+$/.test(cardNum)) { card.classList.add('invalid'); valid = false; }
  if (!name.value.trim()) { name.classList.add('invalid'); valid = false; }
  if (!/^\d{2}\/\d{2}$/.test(expiry.value)) {
    expiry.classList.add('invalid'); valid = false;
  } else {
    const [mm, yy] = expiry.value.split('/').map(Number);
    if (mm < 1 || mm > 12) { expiry.classList.add('invalid'); valid = false; }
    const now = new Date();
    const expDate = new Date(2000 + yy, mm);
    if (expDate <= now) { expiry.classList.add('invalid'); valid = false; }
  }
  if (!/^\d{3,4}$/.test(cvc.value)) { cvc.classList.add('invalid'); valid = false; }

  return valid;
}

function goToReview() {
  if (!validatePayment()) {
    showToast('Please check your payment details', 'error');
    return;
  }
  checkoutStep = 3;
  renderReviewStep();
}

// ---- Step 3: Review & Confirm ----
function renderReviewStep() {
  const body = document.getElementById('cartPopupBody');
  const footer = document.getElementById('cartPopupFooter');
  if (!body) return;

  const t = getCartTotals();
  const shipping = JSON.parse(localStorage.getItem('Kynotra_shipping') || '{}');
  const cardNum = (document.getElementById('payCard')?.value || '').replace(/\s/g, '');
  const lastFour = cardNum.slice(-4);
  const cardType = detectCardType(cardNum) || 'Card';

  const safeName = (name) => typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(name) : name.replace(/</g, '&lt;');

  let itemsHTML = cart.map(item => `
    <div class="checkout-summary-row">
      <span>${safeName(item.name)} × ${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    </div>`).join('');

  body.innerHTML = renderCheckoutSteps(3) + `
    <div style="margin-bottom: var(--space-md);">
      <h4 style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: var(--space-sm);">Items</h4>
      ${itemsHTML}
    </div>

    <div style="margin-bottom: var(--space-md);">
      ${t.discount > 0 ? `<div class="checkout-summary-row" style="color:var(--success);"><span>Discount (${appliedPromo?.code})</span><span>−$${t.discount.toFixed(2)}</span></div>` : ''}
      <div class="checkout-summary-row"><span>Shipping</span><span>${t.shippingFree ? '<span style="color:var(--success);">Free</span>' : '$' + t.shipping.toFixed(2)}</span></div>
      <div class="checkout-summary-row"><span>Tax</span><span>$${t.tax.toFixed(2)}</span></div>
      <div class="checkout-summary-row total-row"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
    </div>

    <div class="order-detail-grid">
      <dt>Ship To</dt>
      <dd>${safeName(shipping.name || '')}</dd>
      <dt>Address</dt>
      <dd>${safeName(shipping.address || '')}, ${safeName(shipping.city || '')} ${safeName(shipping.state || '')} ${safeName(shipping.zip || '')}</dd>
      <dt>Email</dt>
      <dd>${safeName(shipping.email || '')}</dd>
      <dt>Payment</dt>
      <dd>${cardType} ···· ${lastFour}</dd>
    </div>

    <div class="secure-badge">🔒 Your order is secure</div>
  `;

  footer.innerHTML = `
    <div class="checkout-nav">
      <button class="btn-back" onclick="checkoutStep=2; renderPaymentStep();">← Payment</button>
      <button class="btn btn-primary" style="flex:1;" id="placeOrderBtn" onclick="placeOrder()">Place Order — $${t.total.toFixed(2)}</button>
    </div>`;
}

// ---- Place Order ----
function placeOrder() {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

  const t = getCartTotals();
  const shipping = JSON.parse(localStorage.getItem('Kynotra_shipping') || '{}');

  // Simulate order processing
  setTimeout(() => {
    const orderNum = 'KYN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Save order to history
    const orders = JSON.parse(localStorage.getItem('Kynotra_orders') || '[]');
    orders.unshift({
      id: orderNum,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: t.subtotal,
      discount: t.discount,
      shipping: t.shipping,
      tax: t.tax,
      total: t.total,
      promo: appliedPromo?.code || null,
      shippingInfo: shipping,
      status: 'Processing',
    });
    localStorage.setItem('Kynotra_orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    appliedPromo = null;
    saveCart();

    renderConfirmation(orderNum, orderDate, t, shipping);
  }, 1500);
}

function renderConfirmation(orderNum, orderDate, totals, shipping) {
  const body = document.getElementById('cartPopupBody');
  const footer = document.getElementById('cartPopupFooter');
  const title = document.getElementById('cartPopupTitle');
  if (!body) return;

  title.textContent = 'Order Placed!';

  body.innerHTML = `
    <div class="order-confirmed">
      <div class="order-confirmed-icon">✓</div>
      <h3>Thank You!</h3>
      <p>Your order has been placed successfully.</p>
      <div class="order-number">${orderNum}</div>
      <div class="order-detail-grid">
        <dt>Date</dt><dd>${orderDate}</dd>
        <dt>Total</dt><dd>$${totals.total.toFixed(2)}</dd>
        <dt>Ship To</dt><dd>${shipping.name || ''}</dd>
        <dt>Status</dt><dd style="color: var(--accent);">Processing</dd>
      </div>
      <p style="margin-top: var(--space-md); font-size: 0.82rem;">A confirmation email will be sent to <strong>${shipping.email || ''}</strong></p>
    </div>
  `;

  footer.innerHTML = `
    <div class="checkout-nav">
      <button class="btn btn-outline" style="flex:1;" onclick="viewOrderHistory()">Order History</button>
      <button class="btn btn-primary" style="flex:1;" onclick="closeCart()">Continue Shopping</button>
    </div>`;
}

// ---- Order History ----
function viewOrderHistory() {
  const body = document.getElementById('cartPopupBody');
  const footer = document.getElementById('cartPopupFooter');
  const title = document.getElementById('cartPopupTitle');
  const sidebar = document.getElementById('cartSidebar');
  if (!body) return;

  sidebar.classList.add('checkout-mode');
  title.textContent = 'Order History';

  const orders = JSON.parse(localStorage.getItem('Kynotra_orders') || '[]');

  if (orders.length === 0) {
    body.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: var(--space-2xl) 0;">No orders yet</p>';
    footer.innerHTML = `<button class="btn btn-primary btn-block" onclick="backToCart()">Back to Cart</button>`;
    return;
  }

  const safeName = (name) => typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(name) : name.replace(/</g, '&lt;');

  let html = '';
  orders.forEach(order => {
    const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const itemNames = order.items.map(it => safeName(it.name)).join(', ');
    html += `
      <div style="padding: var(--space-md); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent);">${order.id}</span>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${date}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${itemNames}</p>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; font-size:0.9rem;">$${order.total.toFixed(2)}</span>
          <span style="font-size: 0.78rem; padding: 2px 10px; border-radius: var(--radius-full); background: rgba(0,230,10,0.1); color: var(--accent);">${order.status}</span>
        </div>
      </div>`;
  });

  body.innerHTML = html;
  footer.innerHTML = `<button class="btn btn-primary btn-block" onclick="backToCart()">Back to Cart</button>`;
}

// ---- US States ----
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

// Open cart from nav
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-cart').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCart();
    });
  });
});

// ==========================================
// WORKOUT TIMER
// ==========================================
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let countdownMode = false;

function startWorkoutTimer() {
  const modal = document.getElementById('timerModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeTimer() {
  const modal = document.getElementById('timerModal');
  if (modal) {
    modal.style.display = 'none';
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRunning = false;
  timerSeconds = 0;
  countdownMode = false;
  updateTimerDisplay();
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  } else {
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (countdownMode) {
        timerSeconds--;
        if (timerSeconds <= 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          timerSeconds = 0;
          countdownMode = false;
          showToast('Rest timer complete! 💪', 'success');
        }
      } else {
        timerSeconds++;
      }
      updateTimerDisplay();
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 0;
  countdownMode = false;
  updateTimerDisplay();
}

function startCountdown(seconds) {
  clearInterval(timerInterval);
  timerSeconds = seconds;
  countdownMode = true;
  timerRunning = true;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      countdownMode = false;
      showToast('Rest timer complete! 💪', 'success');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (!display) return;
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ==========================================
// FORM HANDLERS
// ==========================================
function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]')?.value || '';
  const user = { name: email.split('@')[0], email: email };
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  showToast('Logging in...', 'success');
  setTimeout(() => {
    window.location.href = _base + 'pages/dashboard/dashboard.html';
  }, 1000);
}

function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const firstName = form.querySelector('input[type="text"]')?.value || '';
  const email = form.querySelector('input[type="email"]')?.value || '';
  const user = { name: firstName, email: email };
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  showToast('Account created! Redirecting...', 'success');
  setTimeout(() => {
    window.location.href = _base + 'pages/dashboard/dashboard.html';
  }, 1000);
}

function handleLogout() {
  localStorage.removeItem('Kynotra_user');
  showToast('Logged out', 'success');
  setTimeout(() => {
    window.location.href = _base + 'index.html';
  }, 500);
}

function initAuth() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  const navActions = document.querySelector('.nav-actions');
  if (!user || !navActions) return;

  // Remove Log In / Start Free buttons
  const loginBtn = navActions.querySelector('a[href$="login.html"]');
  const signupBtn = navActions.querySelector('a[href$="signup.html"]');
  if (loginBtn) loginBtn.remove();
  if (signupBtn) signupBtn.remove();

  // Build initials from name
  const fullName = [user.name, user.lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || '?';
  const initials = fullName
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Avatar HTML
  let avatarHTML;
  if (user.avatar) {
    avatarHTML = `<img src="${encodeURI(user.avatar)}" alt="Avatar" class="nav-user-avatar" style="object-fit: cover;">`;
  } else {
    avatarHTML = `<span class="nav-user-avatar">${initials}</span>`;
  }

  // Insert logged-in user UI before the nav toggle
  const navToggle = navActions.querySelector('.nav-toggle');

  const userBtn = document.createElement('div');
  userBtn.className = 'nav-user-menu';
  userBtn.innerHTML = `
    <button class="nav-user-btn" onclick="this.parentElement.classList.toggle('open')">
      ${avatarHTML}
      <span class="nav-user-name">${fullName}</span>
    </button>
    <div class="nav-user-dropdown">
      <a href="${_base}pages/dashboard/dashboard.html">Dashboard</a>
      <a href="#" onclick="handleLogout(); return false;">Log Out</a>
    </div>
  `;

  if (navToggle) {
    navActions.insertBefore(userBtn, navToggle);
  } else {
    navActions.appendChild(userBtn);
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!userBtn.contains(e.target)) userBtn.classList.remove('open');
  });

  // Update dashboard sidebar if on dashboard page
  initDashboardProfile(user, fullName, initials);
}

function initDashboardProfile(user, fullName, initials) {
  const dashAvatar = document.getElementById('dashAvatar');
  const dashName = document.getElementById('dashName');
  const dashEmail = document.getElementById('dashEmail');
  if (!dashAvatar) return;

  dashName.textContent = fullName;
  if (user.email) dashEmail.textContent = user.email;

  if (user.avatar) {
    dashAvatar.innerHTML = '';
    dashAvatar.style.backgroundImage = `url('${encodeURI(user.avatar)}')`;
    dashAvatar.style.backgroundSize = 'cover';
    dashAvatar.style.backgroundPosition = 'center';
  } else {
    dashAvatar.textContent = initials;
    dashAvatar.style.backgroundImage = '';
  }

  // Update welcome banner
  const welcomeH1 = document.querySelector('.dashboard main h1');
  if (welcomeH1) {
    welcomeH1.textContent = `Welcome back, ${user.name || 'there'}!`;
  }
}

// ==========================================
// PROFILE EDITOR
// ==========================================
function openProfileEditor() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  document.getElementById('editFirstName').value = user.name || '';
  document.getElementById('editLastName').value = user.lastName || '';
  document.getElementById('editEmail').value = user.email || '';
  document.getElementById('editAge').value = user.age || '';
  document.getElementById('editGender').value = user.gender || '';
  document.getElementById('editWeight').value = user.weight || '';
  document.getElementById('editHeight').value = user.height || '';
  document.getElementById('editGoal').value = user.goal || '';
  document.getElementById('profileModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProfileEditor() {
  document.getElementById('profileModal').classList.remove('open');
  document.body.style.overflow = '';
}

function saveProfile(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  user.name = document.getElementById('editFirstName').value.trim();
  user.lastName = document.getElementById('editLastName').value.trim();
  user.email = document.getElementById('editEmail').value.trim();
  user.age = document.getElementById('editAge').value;
  user.gender = document.getElementById('editGender').value;
  user.weight = document.getElementById('editWeight').value;
  user.height = document.getElementById('editHeight').value;
  user.goal = document.getElementById('editGoal').value;
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  showToast('Profile updated!', 'success');
  closeProfileEditor();

  // Refresh display
  const fullName = [user.name, user.lastName].filter(Boolean).join(' ');
  const initials = fullName.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  initDashboardProfile(user, fullName, initials);

  // Update nav
  const navName = document.querySelector('.nav-user-name');
  if (navName) navName.textContent = fullName;
  const navAvatar = document.querySelector('.nav-user-avatar');
  if (navAvatar && !user.avatar) navAvatar.textContent = initials;
}

// ==========================================
// AVATAR PICKER
// ==========================================
function openAvatarPicker() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  // Highlight current selection
  document.querySelectorAll('.avatar-option').forEach(btn => {
    const img = btn.querySelector('img');
    btn.classList.toggle('selected', img && user.avatar && img.getAttribute('src') === user.avatar);
  });
  document.getElementById('avatarModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAvatarPicker() {
  document.getElementById('avatarModal').classList.remove('open');
  document.body.style.overflow = '';
}

function selectAvatar(src) {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  user.avatar = src;
  localStorage.setItem('Kynotra_user', JSON.stringify(user));

  // Update dashboard avatar
  const dashAvatar = document.getElementById('dashAvatar');
  if (dashAvatar) {
    dashAvatar.innerHTML = '';
    dashAvatar.textContent = '';
    dashAvatar.style.backgroundImage = `url('${encodeURI(src)}')`;
    dashAvatar.style.backgroundSize = 'cover';
    dashAvatar.style.backgroundPosition = 'center';
  }

  // Update nav avatar
  const navAvatar = document.querySelector('.nav-user-avatar');
  if (navAvatar) {
    if (navAvatar.tagName === 'SPAN') {
      const img = document.createElement('img');
      img.src = encodeURI(src);
      img.alt = 'Avatar';
      img.className = 'nav-user-avatar';
      img.style.objectFit = 'cover';
      navAvatar.replaceWith(img);
    } else {
      navAvatar.src = encodeURI(src);
    }
  }

  // Mark selected
  document.querySelectorAll('.avatar-option').forEach(btn => {
    const bImg = btn.querySelector('img');
    btn.classList.toggle('selected', bImg && bImg.getAttribute('src') === src);
  });

  showToast('Avatar updated!', 'success');
  closeAvatarPicker();
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate size (2 MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast('Image must be under 2 MB', 'error');
    return;
  }

  // Validate type
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    showToast('Only JPG, PNG, or GIF allowed', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(ev) {
    const dataUrl = ev.target.result;
    const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
    user.avatar = dataUrl;
    localStorage.setItem('Kynotra_user', JSON.stringify(user));

    // Update displays
    const dashAvatar = document.getElementById('dashAvatar');
    if (dashAvatar) {
      dashAvatar.innerHTML = '';
      dashAvatar.textContent = '';
      dashAvatar.style.backgroundImage = `url('${dataUrl}')`;
      dashAvatar.style.backgroundSize = 'cover';
      dashAvatar.style.backgroundPosition = 'center';
    }
    const navAvatar = document.querySelector('.nav-user-avatar');
    if (navAvatar) {
      if (navAvatar.tagName === 'SPAN') {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'Avatar';
        img.className = 'nav-user-avatar';
        img.style.objectFit = 'cover';
        navAvatar.replaceWith(img);
      } else {
        navAvatar.src = dataUrl;
      }
    }

    showToast('Custom avatar set!', 'success');
    closeAvatarPicker();
  };
  reader.readAsDataURL(file);
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
  e.target.reset();
}

// ==========================================
// BMI CALCULATOR (used in dashboard)
// ==========================================
function calculateBMI(weightLbs, heightInches) {
  const bmi = (weightLbs / (heightInches * heightInches)) * 703;
  return Math.round(bmi * 10) / 10;
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  // Use textContent to prevent XSS
  const iconSpan = document.createElement('span');
  iconSpan.textContent = type === 'success' ? '✓' : '✕';
  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
