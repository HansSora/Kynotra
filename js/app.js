/* ============================================
   Kynotra - Main JavaScript
   ============================================ */

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
  updateCartCount();
});

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
        <a href="signup.html" class="btn btn-primary">Save This Program — Sign Up Free →</a>
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
// SHOPPING CART
// ==========================================
let cart = JSON.parse(localStorage.getItem('Kynotra_cart') || '[]');

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
  renderCart();
}

function updateCartQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
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

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar || !overlay) return;

  const isOpen = sidebar.style.display === 'block';
  sidebar.style.display = isOpen ? 'none' : 'block';
  overlay.style.display = isOpen ? 'none' : 'block';

  if (!isOpen) renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!itemsEl || !totalEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: var(--space-2xl) 0;">Your cart is empty</p>';
    totalEl.innerHTML = '';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, i) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) 0; border-bottom: 1px solid var(--border-color);">
        <div>
          <h4 style="font-size: 0.9rem; margin-bottom: var(--space-xs);">${DOMPurify ? DOMPurify.sanitize(item.name) : item.name}</h4>
          <p style="color: var(--accent); font-size: 0.85rem;">$${item.price.toFixed(2)}</p>
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-sm);">
          <button onclick="updateCartQty(${i}, -1)" style="width: 28px; height: 28px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); cursor: pointer; background: none;">−</button>
          <span style="font-size: 0.9rem; min-width: 20px; text-align: center;">${item.qty}</span>
          <button onclick="updateCartQty(${i}, 1)" style="width: 28px; height: 28px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-secondary); cursor: pointer; background: none;">+</button>
          <button onclick="removeFromCart(${i})" style="color: var(--text-muted); cursor: pointer; margin-left: var(--space-sm); background: none; border: none;">✕</button>
        </div>
      </div>
    `;
  });

  itemsEl.innerHTML = html;
  totalEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 1rem; font-weight: 600;">Total</span>
      <span style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent);">$${total.toFixed(2)}</span>
    </div>
    ${total >= 75 ? '<p style="color: var(--success); font-size: 0.8rem; margin-top: var(--space-sm);">✓ Free shipping!</p>' : `<p style="color: var(--text-muted); font-size: 0.8rem; margin-top: var(--space-sm);">Add $${(75 - total).toFixed(2)} more for free shipping</p>`}
  `;
}

// Open cart from nav
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-cart').forEach(el => {
    el.addEventListener('click', (e) => {
      if (document.getElementById('cartSidebar')) {
        e.preventDefault();
        toggleCart();
      }
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
    window.location.href = 'dashboard.html';
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
    window.location.href = 'dashboard.html';
  }, 1000);
}

function handleLogout() {
  localStorage.removeItem('Kynotra_user');
  showToast('Logged out', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

function initAuth() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  const navActions = document.querySelector('.nav-actions');
  if (!user || !navActions) return;

  // Remove Log In / Start Free buttons
  const loginBtn = navActions.querySelector('a[href="login.html"]');
  const signupBtn = navActions.querySelector('a[href="signup.html"]');
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
      <a href="dashboard.html">Dashboard</a>
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
}

function closeProfileEditor() {
  document.getElementById('profileModal').classList.remove('open');
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
}

function closeAvatarPicker() {
  document.getElementById('avatarModal').classList.remove('open');
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
