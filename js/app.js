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
  handleDashboardParams();
  autofillCalculatorFromProfile();
});

// Handle dashboard URL parameters (edit=profile, edit=avatar)
function handleDashboardParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const edit = urlParams.get('edit');
  
  if (edit === 'profile' && typeof openProfileEditor === 'function') {
    setTimeout(() => openProfileEditor(), 100);
  } else if (edit === 'avatar' && typeof openAvatarPicker === 'function') {
    setTimeout(() => openAvatarPicker(), 100);
  }
}

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
  
  // Get text from custom dropdowns
  const goalWrapper = document.getElementById('goalSelectWrapper');
  const levelWrapper = document.getElementById('levelSelectWrapper');
  const locationWrapper = document.getElementById('locationSelectWrapper');
  const daysWrapper = document.getElementById('daysSelectWrapper');

  const weightUnit = progUnit === 'metric' ? 'kg' : 'lbs';
  const heightUnit = progUnit === 'metric' ? 'cm' : 'in';
  
  // Get display text from custom select triggers
  const goalText = goalWrapper?.querySelector('.custom-select-value')?.textContent || 'Not selected';
  const levelText = levelWrapper?.querySelector('.custom-select-value')?.textContent || 'Not selected';
  const locText = locationWrapper?.querySelector('.custom-select-value')?.textContent || 'Not selected';
  const daysText = daysWrapper?.querySelector('.custom-select-value')?.textContent || 'Not selected';

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
        ${getProgramSaveButton()}
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

// Get appropriate save button based on login state
function getProgramSaveButton() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  
  if (user) {
    // User is logged in - show save to dashboard button
    return `<button class="btn btn-primary" onclick="saveProgramToDashboard()">Save to My Programs →</button>`;
  } else {
    // Not logged in - show signup CTA
    return `<a href="${_base}pages/auth/signup.html" class="btn btn-primary">Save This Program — Sign Up Free →</a>`;
  }
}

// Save generated program to user's dashboard
function saveProgramToDashboard() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  if (!user) {
    showToast('Please log in to save programs', 'info');
    setTimeout(() => {
      window.location.href = _base + 'pages/auth/login.html?redirect=programs';
    }, 1000);
    return;
  }
  
  // Get program data from the generated content
  const programContainer = document.getElementById('generatedProgram');
  const programTitle = programContainer?.querySelector('h2')?.textContent || 'Custom Program';
  
  // Initialize saved programs array if not exists
  user.savedPrograms = user.savedPrograms || [];
  
  // Create program object
  const program = {
    id: Date.now(),
    title: programTitle,
    savedAt: new Date().toISOString(),
    html: programContainer?.innerHTML || ''
  };
  
  // Check if already saved
  const alreadySaved = user.savedPrograms.some(p => p.title === programTitle);
  if (alreadySaved) {
    showToast('Program already saved!', 'info');
    return;
  }
  
  // Add to saved programs
  user.savedPrograms.push(program);
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  
  // Update users database
  updateUserInDatabase(user);
  
  showToast('Program saved to your dashboard!', 'success');
  
  // Update the button to show saved state
  const btnContainer = programContainer?.querySelector('div[style*="text-align: center"]');
  if (btnContainer) {
    btnContainer.innerHTML = `
      <button class="btn btn-success" disabled style="pointer-events: none;">✓ Saved to Dashboard</button>
      <a href="${_base}pages/dashboard/dashboard.html" class="btn btn-outline" style="margin-left: var(--space-md);">Go to Dashboard →</a>
    `;
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

// Auto-fill calculator fields from user profile
function autofillCalculatorFromProfile() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  // Only proceed if we have saved fitness data
  if (!user.age && !user.weight && !user.height && !user.gender) return;
  
  // Auto-fill age
  const ageInput = document.getElementById('calcAge');
  if (ageInput && user.age) {
    ageInput.value = user.age;
  }
  
  // Auto-fill weight
  const weightInput = document.getElementById('calcWeight');
  if (weightInput && user.weight) {
    weightInput.value = user.weight;
  }
  
  // Auto-fill height
  const heightInput = document.getElementById('calcHeight');
  if (heightInput && user.height) {
    heightInput.value = user.height;
  }
  
  // Auto-fill gender
  const genderInput = document.getElementById('calcGender');
  const genderWrapper = document.getElementById('calcGenderWrapper');
  if (genderInput && genderWrapper && user.gender) {
    genderInput.value = user.gender;
    const genderOption = genderWrapper.querySelector(`.custom-select-option[data-value="${user.gender}"]`);
    const genderDisplay = genderWrapper.querySelector('.custom-select-value');
    if (genderOption && genderDisplay) {
      genderDisplay.textContent = genderOption.querySelector('.option-text').textContent;
      genderWrapper.classList.add('has-value');
      // Mark selected
      genderWrapper.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
      genderOption.classList.add('selected');
    }
  }
  
  // Auto-fill goal based on fitness goal
  const goalInput = document.getElementById('calcGoal');
  const goalWrapper = document.getElementById('calcGoalWrapper');
  if (goalInput && goalWrapper && user.goal) {
    // Map fitness goal to calculator goal
    const goalMap = {
      'weight-loss': 'lose',
      'muscle-gain': 'gain',
      'strength': 'gain',
      'maintenance': 'maintain',
      'endurance': 'maintain'
    };
    const calcGoal = goalMap[user.goal];
    if (calcGoal) {
      goalInput.value = calcGoal;
      const goalOption = goalWrapper.querySelector(`.custom-select-option[data-value="${calcGoal}"]`);
      const goalDisplay = goalWrapper.querySelector('.custom-select-value');
      if (goalOption && goalDisplay) {
        goalDisplay.textContent = goalOption.querySelector('.option-text').textContent;
        goalWrapper.classList.add('has-value');
        goalWrapper.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
        goalOption.classList.add('selected');
      }
    }
  }
}

function calculateCalories() {
  const gender = document.getElementById('calcGender')?.value;
  const age = parseFloat(document.getElementById('calcAge')?.value);
  const weight = parseFloat(document.getElementById('calcWeight')?.value);
  const height = parseFloat(document.getElementById('calcHeight')?.value);
  const activity = parseFloat(document.getElementById('calcActivity')?.value);
  const goal = document.getElementById('calcGoal')?.value;

  if (!age || !weight || !height || !goal) {
    showToast('Please fill in all fields including your goal', 'error');
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

  // Display results in inline section
  document.getElementById('totalCalories').textContent = calories.toLocaleString();
  document.getElementById('macroProtein').textContent = proteinGrams + 'g';
  document.getElementById('macroCarbs').textContent = carbGrams + 'g';
  document.getElementById('macroFats').textContent = fatGrams + 'g';

  const result = document.getElementById('calorieResult');
  if (result) {
    result.style.display = 'block';
  }

  // Generate personalized content
  generatePersonalizedPlan(calories, proteinGrams, carbGrams, fatGrams, goal, gender, weightLbs);

  // Calculate macro percentages
  const proteinCal = proteinGrams * 4;
  const carbsCal = carbGrams * 4;
  const fatsCal = fatGrams * 9;
  const totalMacroCal = proteinCal + carbsCal + fatsCal;
  const proteinPct = Math.round((proteinCal / totalMacroCal) * 100);
  const carbsPct = Math.round((carbsCal / totalMacroCal) * 100);
  const fatsPct = Math.round((fatsCal / totalMacroCal) * 100);

  // Goal labels
  const goalLabels = {
    lose: 'Fat Loss (-500 cal)',
    maintain: 'Maintenance',
    gain: 'Muscle Gain (+300 cal)',
    bulk: 'Lean Bulk (+500 cal)'
  };

  // Update modal with results
  document.getElementById('modalCalories').textContent = calories.toLocaleString();
  document.getElementById('modalProtein').textContent = proteinGrams + 'g';
  document.getElementById('modalCarbs').textContent = carbGrams + 'g';
  document.getElementById('modalFats').textContent = fatGrams + 'g';
  document.getElementById('modalProteinPct').textContent = proteinPct + '%';
  document.getElementById('modalCarbsPct').textContent = carbsPct + '%';
  document.getElementById('modalFatsPct').textContent = fatsPct + '%';
  document.getElementById('modalGoal').textContent = goalLabels[goal] || 'Custom';

  // Show the full-screen results modal
  const modal = document.getElementById('resultsModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

// Close results modal and scroll to personalized content
function closeResultsModal() {
  const modal = document.getElementById('resultsModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  // Scroll to personalized content
  const personalizedContent = document.getElementById('personalizedContent');
  if (personalizedContent) {
    setTimeout(() => {
      personalizedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// Generate personalized diet plan based on user inputs
function generatePersonalizedPlan(calories, protein, carbs, fats, goal, gender, weight) {
  const personalizedContent = document.getElementById('personalizedContent');
  if (!personalizedContent) return;

  // Goal-specific data
  const goalData = {
    lose: {
      planTitle: 'Lean & Shred',
      planDesc: `High-protein, lower-carb plan designed for sustainable fat loss while preserving muscle. ${calories.toLocaleString()} calories with strategic meal timing.`,
      planBadge: 'Fat Loss',
      proteinPct: '40%',
      altPlan1: { title: 'Keto-Flexible', desc: 'Lower carb approach with higher fats for satiety.', cal: Math.round(calories * 0.95), protein: '35%', badge: 'Low Carb' },
      altPlan2: { title: 'Intermittent Fasting', desc: '16:8 fasting window with same daily calories.', cal: calories, protein: '35%', badge: 'IF Compatible' },
      supplements: [
        { name: 'Whey Protein', desc: 'Essential for preserving muscle during a caloric deficit. Take post-workout. 25-30g per serving.', tag: 'Essential', tagClass: 'tag-success' },
        { name: 'Caffeine / Fat Burner', desc: 'Boosts metabolism and energy during calorie restriction. 150-200mg before workouts.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'Omega-3 Fish Oil', desc: 'Supports metabolism and reduces inflammation. 2-3g EPA/DHA daily.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'Multivitamin', desc: 'Fills micronutrient gaps during caloric restriction.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'L-Carnitine', desc: 'May help with fat oxidation during exercise. 2g before training.', tag: 'Optional', tagClass: 'tag-primary' }
      ]
    },
    maintain: {
      planTitle: 'Balanced Performance',
      planDesc: `Maintenance-calorie plan optimized for sustained energy and body composition. ${calories.toLocaleString()} calories with flexible meal timing.`,
      planBadge: 'Maintenance',
      proteinPct: '30%',
      altPlan1: { title: 'Athletic Performance', desc: 'Higher carb timing around workouts for energy.', cal: calories, protein: '30%', badge: 'Performance' },
      altPlan2: { title: 'Flexible Dieting', desc: 'IIFYM approach — hit your macros with food freedom.', cal: calories, protein: '25%', badge: 'Flexible' },
      supplements: [
        { name: 'Whey Protein', desc: 'Convenient protein source to hit daily targets. 25-30g per serving.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'Creatine Monohydrate', desc: 'Supports strength and performance. 5g daily.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'Vitamin D3', desc: 'Supports immune function and bone health. 2,000-5,000 IU daily.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'Omega-3 Fish Oil', desc: 'Heart and joint health. 2-3g EPA/DHA daily.', tag: 'Optional', tagClass: 'tag-primary' }
      ]
    },
    gain: {
      planTitle: 'Lean Mass Builder',
      planDesc: `Controlled calorie surplus for muscle gain with minimal fat. ${calories.toLocaleString()} calories with optimized protein timing.`,
      planBadge: 'Muscle Gain',
      proteinPct: '35%',
      altPlan1: { title: 'High Frequency Meals', desc: '5-6 smaller meals for sustained protein synthesis.', cal: calories, protein: '35%', badge: '5+ Meals' },
      altPlan2: { title: 'Carb Cycling', desc: 'Higher carbs on training days, lower on rest days.', cal: calories, protein: '30%', badge: 'Carb Cycle' },
      supplements: [
        { name: 'Whey Protein', desc: 'Essential for hitting elevated protein targets. Take post-workout and between meals.', tag: 'Essential', tagClass: 'tag-success' },
        { name: 'Creatine Monohydrate', desc: 'Most researched supplement for muscle and strength. 5g daily.', tag: 'Essential', tagClass: 'tag-success' },
        { name: 'Mass Gainer (Optional)', desc: 'If struggling to eat enough calories. 500-800 cal per serving.', tag: 'Situational', tagClass: 'tag-info' },
        { name: 'Vitamin D3', desc: 'Supports testosterone and bone health. 2,000-5,000 IU daily.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'ZMA (Zinc/Magnesium)', desc: 'Supports recovery and sleep quality. Take before bed.', tag: 'Optional', tagClass: 'tag-primary' }
      ]
    },
    bulk: {
      planTitle: 'Maximum Mass',
      planDesc: `Aggressive calorie surplus for rapid muscle gain. ${calories.toLocaleString()} calories with 5-6 meals per day.`,
      planBadge: 'Aggressive Bulk',
      proteinPct: '30%',
      altPlan1: { title: 'Clean Bulk', desc: 'Same calories but from whole food sources only.', cal: calories, protein: '35%', badge: 'Clean' },
      altPlan2: { title: 'GOMAD Style', desc: 'Add liquid calories to hit surplus easier.', cal: Math.round(calories * 1.05), protein: '25%', badge: 'High Cal' },
      supplements: [
        { name: 'Whey Protein', desc: 'Multiple servings daily to hit protein targets. 25-30g per serving.', tag: 'Essential', tagClass: 'tag-success' },
        { name: 'Creatine Monohydrate', desc: 'Maximizes strength and cell volumization. 5g daily.', tag: 'Essential', tagClass: 'tag-success' },
        { name: 'Mass Gainer', desc: 'Easy way to add 500-1000 extra calories. Use between meals.', tag: 'Highly Recommended', tagClass: 'tag-success' },
        { name: 'Dextrose/Fast Carbs', desc: 'Post-workout with protein for insulin spike and recovery.', tag: 'Recommended', tagClass: 'tag-info' },
        { name: 'Digestive Enzymes', desc: 'Helps digest large amounts of food. Take with meals.', tag: 'Recommended', tagClass: 'tag-info' }
      ]
    }
  };

  const data = goalData[goal] || goalData.maintain;

  // Update plan cards
  document.getElementById('recommendedPlanBadge').textContent = data.planBadge;
  document.getElementById('recommendedPlanTitle').textContent = data.planTitle;
  document.getElementById('recommendedPlanDesc').textContent = data.planDesc;
  document.getElementById('planCalorieRange').textContent = `🔥 ${calories.toLocaleString()} cal`;
  document.getElementById('planProteinPct').textContent = `🥩 ${data.proteinPct} Protein`;

  document.getElementById('altPlan1Badge').textContent = data.altPlan1.badge;
  document.getElementById('altPlan1Title').textContent = data.altPlan1.title;
  document.getElementById('altPlan1Desc').textContent = data.altPlan1.desc;
  document.getElementById('altPlan1Cal').textContent = `🔥 ${data.altPlan1.cal.toLocaleString()} cal`;
  document.getElementById('altPlan1Protein').textContent = `🥩 ${data.altPlan1.protein} Protein`;

  document.getElementById('altPlan2Badge').textContent = data.altPlan2.badge;
  document.getElementById('altPlan2Title').textContent = data.altPlan2.title;
  document.getElementById('altPlan2Desc').textContent = data.altPlan2.desc;
  document.getElementById('altPlan2Cal').textContent = `🔥 ${data.altPlan2.cal.toLocaleString()} cal`;
  document.getElementById('altPlan2Protein').textContent = `🥩 ${data.altPlan2.protein} Protein`;

  // Update menu subtitle
  document.getElementById('menuSubtitle').textContent = `Personalized for you — Approx. ${calories.toLocaleString()} calories`;

  // Generate meal plan
  generateMealPlan(calories, protein, carbs, fats, goal);

  // Update daily totals
  document.getElementById('totalDailyCal').textContent = calories.toLocaleString();
  document.getElementById('totalDailyProtein').textContent = protein + 'g';
  document.getElementById('totalDailyCarbs').textContent = carbs + 'g';
  document.getElementById('totalDailyFats').textContent = fats + 'g';

  // Generate supplements
  const supplementsContainer = document.getElementById('supplementsContainer');
  if (supplementsContainer) {
    supplementsContainer.innerHTML = data.supplements.map(supp => `
      <div class="feature-card" style="padding: var(--space-lg);">
        <h3 style="font-size: 1rem;">${supp.name}</h3>
        <p style="font-size: 0.85rem;">${supp.desc}</p>
        <span class="tag ${supp.tagClass}" style="margin-top: var(--space-sm);">${supp.tag}</span>
      </div>
    `).join('');
  }

  // Show personalized content and scroll to it
  personalizedContent.style.display = 'block';
  setTimeout(() => {
    personalizedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Generate meal plan based on macros
function generateMealPlan(totalCal, totalProtein, totalCarbs, totalFats, goal) {
  const mealPlanContainer = document.getElementById('mealPlanContainer');
  if (!mealPlanContainer) return;

  // Determine number of meals based on goal
  const numMeals = (goal === 'bulk' || goal === 'gain') ? 5 : 4;
  
  // Calculate per-meal macros (roughly)
  const calPerMeal = Math.round(totalCal / numMeals);
  const proteinPerMeal = Math.round(totalProtein / numMeals);
  const carbsPerMeal = Math.round(totalCarbs / numMeals);
  const fatsPerMeal = Math.round(totalFats / numMeals);

  // Meal templates based on goal
  const mealTemplates = {
    lose: [
      { time: '7:00 AM', name: 'Breakfast', items: ['3 egg whites + 1 whole egg scrambled', '1 slice whole wheat toast', '1 cup spinach sautéed', '1/2 grapefruit'], pMult: 1.1, cMult: 0.8, fMult: 0.7 },
      { time: '12:00 PM', name: 'Lunch', items: ['6oz grilled chicken breast', '2 cups mixed salad greens', '1/2 cup quinoa', '1 tbsp olive oil dressing'], pMult: 1.3, cMult: 1.0, fMult: 1.1 },
      { time: '4:00 PM', name: 'Snack', items: ['Protein shake (1 scoop)', '1 medium apple', '10 almonds'], pMult: 0.8, cMult: 0.8, fMult: 0.9 },
      { time: '7:00 PM', name: 'Dinner', items: ['6oz salmon or white fish', '1 cup roasted broccoli', '1/2 sweet potato', 'Lemon herb seasoning'], pMult: 1.2, cMult: 1.0, fMult: 1.2 }
    ],
    maintain: [
      { time: '7:30 AM', name: 'Breakfast', items: ['3 whole eggs scrambled', '2 slices whole wheat toast', '1/2 avocado', '1 banana'], pMult: 1.0, cMult: 1.1, fMult: 1.1 },
      { time: '12:30 PM', name: 'Lunch', items: ['6oz chicken breast', '1 cup brown rice', 'Mixed vegetables', '1 tbsp olive oil'], pMult: 1.2, cMult: 1.2, fMult: 1.0 },
      { time: '4:00 PM', name: 'Snack', items: ['Greek yogurt (1 cup)', '1/4 cup granola', 'Handful of berries'], pMult: 0.7, cMult: 0.8, fMult: 0.6 },
      { time: '7:30 PM', name: 'Dinner', items: ['6oz lean beef or fish', 'Large mixed salad', '1 medium potato', '1 tbsp butter'], pMult: 1.1, cMult: 0.9, fMult: 1.3 }
    ],
    gain: [
      { time: '7:00 AM', name: 'Breakfast', items: ['4 whole eggs scrambled', '3 slices whole wheat toast', '1 avocado (half)', '1 banana', '1 glass orange juice'], pMult: 1.0, cMult: 1.2, fMult: 1.1 },
      { time: '10:30 AM', name: 'Mid-Morning', items: ['Protein shake (1 scoop)', '1.5 cups oats with berries', '2 tbsp peanut butter'], pMult: 0.9, cMult: 1.1, fMult: 1.0 },
      { time: '1:00 PM', name: 'Lunch', items: ['8oz chicken breast', '2 cups white rice', 'Mixed vegetables', '1 tbsp olive oil'], pMult: 1.2, cMult: 1.0, fMult: 0.9 },
      { time: '4:30 PM', name: 'Post-Workout', items: ['Protein shake (1 scoop)', '2 rice cakes with honey', '1 banana'], pMult: 0.8, cMult: 1.0, fMult: 0.5 },
      { time: '7:30 PM', name: 'Dinner', items: ['8oz salmon fillet', '1 large sweet potato', 'Asparagus (grilled)', 'Side salad with dressing'], pMult: 1.1, cMult: 0.7, fMult: 1.5 }
    ],
    bulk: [
      { time: '7:00 AM', name: 'Breakfast', items: ['5 whole eggs scrambled', '4 slices toast with butter', '1 avocado', '2 bananas', 'Large glass of milk'], pMult: 1.0, cMult: 1.3, fMult: 1.2 },
      { time: '10:00 AM', name: 'Mid-Morning', items: ['Mass gainer or protein shake', '2 cups oats', '3 tbsp peanut butter', 'Honey drizzle'], pMult: 0.9, cMult: 1.2, fMult: 1.1 },
      { time: '1:00 PM', name: 'Lunch', items: ['10oz chicken or beef', '2.5 cups white rice', 'Vegetables in olive oil', 'Glass of milk'], pMult: 1.2, cMult: 1.0, fMult: 0.8 },
      { time: '4:30 PM', name: 'Post-Workout', items: ['Protein shake (2 scoops)', 'Large banana', 'Rice cakes with jam', 'Dextrose/Gatorade'], pMult: 0.9, cMult: 1.0, fMult: 0.4 },
      { time: '8:00 PM', name: 'Dinner', items: ['10oz salmon or steak', '2 cups pasta or rice', 'Vegetables', 'Olive oil drizzle', 'Bread on the side'], pMult: 1.0, cMult: 0.5, fMult: 1.5 }
    ]
  };

  const meals = mealTemplates[goal] || mealTemplates.maintain;

  mealPlanContainer.innerHTML = meals.map((meal, index) => {
    const mealCal = Math.round(calPerMeal * (meal.pMult + meal.cMult + meal.fMult) / 3);
    const mealP = Math.round(proteinPerMeal * meal.pMult);
    const mealC = Math.round(carbsPerMeal * meal.cMult);
    const mealF = Math.round(fatsPerMeal * meal.fMult);
    
    const isLastMeal = index === meals.length - 1 && meals.length % 2 !== 0;
    const extraStyle = isLastMeal ? 'grid-column: 1 / -1; max-width: 450px; margin: 0 auto;' : '';

    return `
      <div class="meal-card animate-in" style="${extraStyle}">
        <div class="meal-time">${meal.time}</div>
        <h4>Meal ${index + 1} — ${meal.name}</h4>
        <ul style="color: var(--text-secondary); font-size: 0.9rem; padding-left: 0;">
          ${meal.items.map(item => `<li style="padding: 4px 0;">• ${item}</li>`).join('')}
        </ul>
        <div class="macro-row">
          <div class="macro-item"><div class="macro-value">${mealP}g</div><div class="macro-label">Protein</div></div>
          <div class="macro-item"><div class="macro-value">${mealC}g</div><div class="macro-label">Carbs</div></div>
          <div class="macro-item"><div class="macro-value">${mealF}g</div><div class="macro-label">Fats</div></div>
          <div class="macro-item"><div class="macro-value">${mealCal}</div><div class="macro-label">Calories</div></div>
        </div>
      </div>
    `;
  }).join('');
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
  const cards = document.querySelectorAll('.exercise-card');
  const sections = document.querySelectorAll('.muscle-section');
  
  cards.forEach(card => {
    const m = card.getAttribute('data-muscle') || '';
    card.style.display = (muscle === 'all' || m === muscle) ? '' : 'none';
  });
  
  // Show/hide muscle sections based on filter
  sections.forEach(section => {
    const sectionId = section.id.replace('-section', '');
    section.style.display = (muscle === 'all' || sectionId === muscle) ? '' : 'none';
  });
  
  updateFilterButtons(btn);
}

function filterProducts(category, btn) {
  currentProductCategory = category;
  applyProductFilters();
  updateFilterButtons(btn);
}

let currentProductCategory = 'all';

function searchProducts(query) {
  applyProductFilters(query);
}

function applyProductFilters(searchQuery) {
  const cards = document.querySelectorAll('#productsGrid .product-card');
  const query = searchQuery !== undefined ? searchQuery : (document.getElementById('productSearch')?.value || '');
  const q = query.toLowerCase().trim();
  
  cards.forEach(card => {
    const cat = card.getAttribute('data-category') || '';
    const text = card.textContent.toLowerCase();
    
    const matchesCategory = currentProductCategory === 'all' || cat.includes(currentProductCategory);
    const matchesSearch = !q || text.includes(q);
    
    card.style.display = (matchesCategory && matchesSearch) ? '' : 'none';
  });
}

// Initialize product search
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => searchProducts(e.target.value));
  }
});

function updateFilterButtons(activeBtn) {
  if (activeBtn) {
    activeBtn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }
}

function searchExercises(query) {
  const cards = document.querySelectorAll('.exercise-card');
  const sections = document.querySelectorAll('.muscle-section');
  const q = query.toLowerCase();
  
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
  
  // Hide sections with no visible cards
  sections.forEach(section => {
    const visibleCards = section.querySelectorAll('.exercise-card:not([style*="display: none"])');
    section.style.display = visibleCards.length > 0 ? '' : 'none';
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

  // Get SVG animation for this exercise
  const animation = typeof getExerciseAnimation === 'function' 
    ? getExerciseAnimation(name) 
    : '';

  let instructionsHtml = '';
  if (details) {
    // Extract just the instructions, not the video demo
    const instructionsEl = details.querySelector('.exercise-instructions');
    if (instructionsEl) {
      instructionsHtml = instructionsEl.outerHTML;
    } else {
      // Fallback: remove any iframe/video elements and use remaining content
      const clone = details.cloneNode(true);
      const demosToRemove = clone.querySelectorAll('.exercise-demo, iframe');
      demosToRemove.forEach(el => el.remove());
      instructionsHtml = clone.innerHTML;
    }
  } else {
    instructionsHtml = `
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
      <h2 style="font-family: var(--font-heading); font-size: 1.6rem; text-transform: uppercase; margin-bottom: var(--space-sm);">${name}</h2>
      <p style="color: var(--accent); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-lg);">${muscle}</p>
      <div class="exercise-animation">${animation}</div>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-xl);">${description}</p>
      ${instructionsHtml}
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
        <input type="text" id="promoInput" placeholder="Promo code" maxlength="20" onkeydown="if(event.key==='Enter')applyPromo()">
        <button class="btn btn-sm btn-outline" onclick="applyPromo()">Apply</button>
      </div>
      <p id="promoError" style="color: #ff4444; font-size: 0.8rem; margin-top: 4px; display: none;"></p>`;
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
  const errorEl = document.getElementById('promoError');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) {
    input.classList.add('invalid');
    if (errorEl) {
      errorEl.textContent = 'Invalid promo code';
      errorEl.style.display = 'block';
    }
    return;
  }
  appliedPromo = { ...promo, code };
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
    showToast('Please log in to checkout', 'info');
    setTimeout(() => {
      window.location.href = _base + 'pages/auth/login.html?redirect=checkout';
    }, 1000);
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
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  // Check if user has saved address info
  const hasSavedAddress = user.address && user.country && user.city;

  body.innerHTML = renderCheckoutSteps(1) + `
    ${hasSavedAddress ? `
    <button type="button" class="btn btn-sm btn-outline" onclick="autofillShipping()" style="width: 100%; margin-bottom: var(--space-md);">📍 Use Personal Information</button>
    ` : ''}
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
      <label>Country *</label>
      <select id="shipCountry" onchange="updateCityDropdown()">
        <option value="">Select Country</option>
        ${COUNTRIES.map(c => `<option value="${c}" ${(saved?.country || 'United States') === c ? 'selected' : ''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="checkout-form-group">
      <label>City *</label>
      <select id="shipCity">
        <option value="">Select City</option>
      </select>
    </div>
    <div class="checkout-form-group">
      <label>Address *</label>
      <input type="text" id="shipAddress" placeholder="123 Main St, Apt 4" value="${saved?.address || ''}" maxlength="300">
    </div>
    <div class="checkout-form-group">
      <label>ZIP / Postal Code *</label>
      <input type="text" id="shipZip" placeholder="10001" value="${saved?.zip || ''}" maxlength="20">
    </div>
  `;

  // Initialize city dropdown
  setTimeout(() => {
    updateCityDropdown();
    const savedCity = saved?.city;
    if (savedCity) {
      const citySelect = document.getElementById('shipCity');
      if (citySelect) citySelect.value = savedCity;
    }
  }, 0);

  footer.innerHTML = `
    <div class="checkout-nav">
      <button class="btn-back" onclick="backToCart()">← Cart</button>
      <button class="btn btn-primary" style="flex:1;" onclick="goToPayment()">Continue to Payment</button>
    </div>`;
}

// Autofill shipping from saved profile
function autofillShipping() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  const fullName = [user.name, user.lastName].filter(Boolean).join(' ');
  document.getElementById('shipName').value = fullName;
  document.getElementById('shipEmail').value = user.email || '';
  document.getElementById('shipPhone').value = user.phone || '';
  document.getElementById('shipAddress').value = user.address || '';
  document.getElementById('shipZip').value = user.zip || '';
  
  // Set country
  const countrySelect = document.getElementById('shipCountry');
  if (countrySelect && user.country) {
    countrySelect.value = user.country;
    updateCityDropdown();
    // Set city after dropdown updates
    setTimeout(() => {
      const citySelect = document.getElementById('shipCity');
      if (citySelect && user.city) {
        citySelect.value = user.city;
      }
    }, 10);
  }
  
  showToast('Address autofilled from profile', 'success');
}

function clearShippingAutofill() {
  document.getElementById('shipName').value = '';
  document.getElementById('shipEmail').value = '';
  document.getElementById('shipPhone').value = '';
  document.getElementById('shipAddress').value = '';
  document.getElementById('shipZip').value = '';
  document.getElementById('shipCountry').value = '';
  document.getElementById('shipCity').innerHTML = '<option value="">Select City</option>';
  localStorage.removeItem('Kynotra_shipping');
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
    zip: document.getElementById('shipZip'),
    country: document.getElementById('shipCountry'),
  };

  let valid = true;
  Object.values(fields).forEach(f => f.classList.remove('invalid'));

  if (!fields.name.value.trim()) { fields.name.classList.add('invalid'); valid = false; }
  if (!fields.email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) { fields.email.classList.add('invalid'); valid = false; }
  if (!fields.address.value.trim()) { fields.address.classList.add('invalid'); valid = false; }
  if (!fields.city.value) { fields.city.classList.add('invalid'); valid = false; }
  if (!fields.zip.value.trim()) { fields.zip.classList.add('invalid'); valid = false; }
  if (!fields.country.value) { fields.country.classList.add('invalid'); valid = false; }

  if (valid) {
    const data = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: document.getElementById('shipPhone')?.value.trim() || '',
      address: fields.address.value.trim(),
      city: fields.city.value,
      zip: fields.zip.value.trim(),
      country: fields.country.value,
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
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  // Check if user has saved payment info
  const hasSavedPayment = user.cardNumber && user.cardName && user.cardExpiry;

  body.innerHTML = renderCheckoutSteps(2) + `
    ${hasSavedPayment ? `
    <button type="button" class="btn btn-sm btn-outline" onclick="autofillPayment()" style="width: 100%; margin-bottom: var(--space-md);">💳 Use Saved Card</button>
    ` : ''}
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

// Autofill payment from saved profile
function autofillPayment() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  if (user.cardNumber) document.getElementById('payCard').value = user.cardNumber;
  if (user.cardName) document.getElementById('payName').value = user.cardName;
  if (user.cardExpiry) document.getElementById('payExpiry').value = user.cardExpiry;
  // CVC is never saved, user must enter it
  
  // Update card type icons
  const cardType = detectCardType(user.cardNumber || '');
  const icons = document.querySelectorAll('.card-type-icons span');
  icons.forEach(icon => {
    icon.classList.remove('active');
    if (icon.textContent === cardType) icon.classList.add('active');
  });
  
  showToast('Card autofilled from profile (enter CVC)', 'success');
}

function clearPaymentAutofill() {
  document.getElementById('payCard').value = '';
  document.getElementById('payName').value = '';
  document.getElementById('payExpiry').value = '';
  document.getElementById('payCVC').value = '';
  
  // Reset card type icons
  const icons = document.querySelectorAll('.card-type-icons span');
  icons.forEach((icon, i) => {
    icon.classList.toggle('active', i === 0);
  });
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
      <dd>${safeName(shipping.address || '')}, ${safeName(shipping.city || '')} ${safeName(shipping.zip || '')}, ${safeName(shipping.country || '')}</dd>
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

// ---- Countries & Cities (USA + Europe) ----
const COUNTRIES = [
  'Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Cyprus',
  'Czech Republic','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland',
  'Italy','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro',
  'Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia',
  'Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom','United States','Vatican City'
];

const CITIES = {
  'Albania': ['Tirana','Durrës','Vlorë','Elbasan','Shkodër','Fier','Korçë','Berat','Lushnjë','Pogradec'],
  'Andorra': ['Andorra la Vella','Escaldes-Engordany','Encamp','Sant Julià de Lòria','La Massana'],
  'Austria': ['Vienna','Graz','Linz','Salzburg','Innsbruck','Klagenfurt','Villach','Wels','Sankt Pölten','Dornbirn'],
  'Belarus': ['Minsk','Gomel','Mogilev','Vitebsk','Grodno','Brest','Bobruisk','Baranovichi','Borisov','Pinsk'],
  'Belgium': ['Brussels','Antwerp','Ghent','Charleroi','Liège','Bruges','Namur','Leuven','Mons','Mechelen'],
  'Bosnia and Herzegovina': ['Sarajevo','Banja Luka','Tuzla','Zenica','Mostar','Prijedor','Brčko','Bijeljina','Cazin'],
  'Bulgaria': ['Sofia','Plovdiv','Varna','Burgas','Ruse','Stara Zagora','Pleven','Sliven','Dobrich','Shumen'],
  'Croatia': ['Zagreb','Split','Rijeka','Osijek','Zadar','Pula','Slavonski Brod','Karlovac','Varaždin','Šibenik'],
  'Cyprus': ['Nicosia','Limassol','Larnaca','Famagusta','Paphos','Kyrenia','Protaras','Paralimni','Strovolos'],
  'Czech Republic': ['Prague','Brno','Ostrava','Pilsen','Liberec','Olomouc','České Budějovice','Hradec Králové','Ústí nad Labem','Pardubice'],
  'Denmark': ['Copenhagen','Aarhus','Odense','Aalborg','Esbjerg','Randers','Kolding','Horsens','Vejle','Roskilde'],
  'Estonia': ['Tallinn','Tartu','Narva','Pärnu','Kohtla-Järve','Viljandi','Rakvere','Maardu','Sillamäe','Kuressaare'],
  'Finland': ['Helsinki','Espoo','Tampere','Vantaa','Oulu','Turku','Jyväskylä','Lahti','Kuopio','Pori'],
  'France': ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Montpellier','Strasbourg','Bordeaux','Lille'],
  'Germany': ['Berlin','Hamburg','Munich','Cologne','Frankfurt','Stuttgart','Düsseldorf','Leipzig','Dortmund','Essen'],
  'Greece': ['Athens','Thessaloniki','Patras','Heraklion','Larissa','Volos','Ioannina','Chania','Chalcis','Katerini'],
  'Hungary': ['Budapest','Debrecen','Szeged','Miskolc','Pécs','Győr','Nyíregyháza','Kecskemét','Székesfehérvár','Szombathely'],
  'Iceland': ['Reykjavik','Kópavogur','Hafnarfjörður','Akureyri','Reykjanesbær','Garðabær','Mosfellsbær','Selfoss','Akranes'],
  'Ireland': ['Dublin','Cork','Limerick','Galway','Waterford','Drogheda','Swords','Dundalk','Bray','Navan'],
  'Italy': ['Rome','Milan','Naples','Turin','Palermo','Genoa','Bologna','Florence','Bari','Catania'],
  'Kosovo': ['Pristina','Prizren','Ferizaj','Peja','Gjakova','Gjilan','Mitrovica','Podujevo','Vushtrri'],
  'Latvia': ['Riga','Daugavpils','Liepāja','Jelgava','Jūrmala','Ventspils','Rēzekne','Valmiera','Jēkabpils','Ogre'],
  'Liechtenstein': ['Vaduz','Schaan','Balzers','Triesen','Eschen','Mauren','Triesenberg','Ruggell','Gamprin'],
  'Lithuania': ['Vilnius','Kaunas','Klaipėda','Šiauliai','Panevėžys','Alytus','Marijampolė','Mažeikiai','Jonava','Utena'],
  'Luxembourg': ['Luxembourg City','Esch-sur-Alzette','Differdange','Dudelange','Ettelbruck','Diekirch','Wiltz','Echternach'],
  'Malta': ['Valletta','Birkirkara','Mosta','Qormi','Żabbar','Sliema','San Ġwann','Naxxar','Żejtun','Rabat'],
  'Moldova': ['Chișinău','Tiraspol','Bălți','Bender','Rîbnița','Cahul','Ungheni','Soroca','Orhei','Dubăsari'],
  'Monaco': ['Monaco','Monte Carlo','La Condamine','Fontvieille','Moneghetti','Larvotto','Saint-Roman'],
  'Montenegro': ['Podgorica','Nikšić','Herceg Novi','Pljevlja','Bijelo Polje','Cetinje','Bar','Budva','Ulcinj','Kotor'],
  'Netherlands': ['Amsterdam','Rotterdam','The Hague','Utrecht','Eindhoven','Groningen','Tilburg','Almere','Breda','Nijmegen'],
  'North Macedonia': ['Skopje','Bitola','Kumanovo','Prilep','Tetovo','Ohrid','Veles','Štip','Strumica','Gostivar'],
  'Norway': ['Oslo','Bergen','Trondheim','Stavanger','Drammen','Fredrikstad','Kristiansand','Sandnes','Tromsø','Sarpsborg'],
  'Poland': ['Warsaw','Kraków','Łódź','Wrocław','Poznań','Gdańsk','Szczecin','Bydgoszcz','Lublin','Białystok'],
  'Portugal': ['Lisbon','Porto','Vila Nova de Gaia','Amadora','Braga','Coimbra','Funchal','Setúbal','Almada','Agualva-Cacém'],
  'Romania': ['Bucharest','Cluj-Napoca','Timișoara','Iași','Constanța','Craiova','Brașov','Galați','Ploiești','Oradea'],
  'Russia': ['Moscow','Saint Petersburg','Novosibirsk','Yekaterinburg','Kazan','Nizhny Novgorod','Chelyabinsk','Samara','Omsk','Rostov-on-Don'],
  'San Marino': ['San Marino','Serravalle','Borgo Maggiore','Domagnano','Fiorentino','Acquaviva','Faetano','Montegiardino'],
  'Serbia': ['Belgrade','Novi Sad','Niš','Kragujevac','Subotica','Zrenjanin','Pančevo','Čačak','Kraljevo','Smederevo'],
  'Slovakia': ['Bratislava','Košice','Prešov','Žilina','Nitra','Banská Bystrica','Trnava','Martin','Trenčín','Poprad'],
  'Slovenia': ['Ljubljana','Maribor','Celje','Kranj','Velenje','Koper','Novo Mesto','Ptuj','Trbovlje','Kamnik'],
  'Spain': ['Madrid','Barcelona','Valencia','Seville','Zaragoza','Málaga','Murcia','Palma','Las Palmas','Bilbao'],
  'Sweden': ['Stockholm','Gothenburg','Malmö','Uppsala','Västerås','Örebro','Linköping','Helsingborg','Jönköping','Norrköping'],
  'Switzerland': ['Zürich','Geneva','Basel','Lausanne','Bern','Winterthur','Lucerne','St. Gallen','Lugano','Biel'],
  'Ukraine': ['Kyiv','Kharkiv','Odesa','Dnipro','Donetsk','Zaporizhzhia','Lviv','Kryvyi Rih','Mykolaiv','Mariupol'],
  'United Kingdom': ['London','Birmingham','Manchester','Glasgow','Liverpool','Leeds','Sheffield','Edinburgh','Bristol','Leicester'],
  'United States': ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','Indianapolis','Seattle','Denver','Washington','Boston','Nashville','Baltimore','Oklahoma City','Portland','Las Vegas','Milwaukee','Albuquerque','Tucson','Fresno','Sacramento','Atlanta','Miami','Orlando','Tampa','Cleveland','Pittsburgh','Cincinnati','Minneapolis'],
  'Vatican City': ['Vatican City']
};

// Update city dropdown based on selected country
function updateCityDropdown() {
  const countrySelect = document.getElementById('shipCountry');
  const citySelect = document.getElementById('shipCity');
  if (!countrySelect || !citySelect) return;

  const country = countrySelect.value;
  const cities = CITIES[country] || [];

  citySelect.innerHTML = '<option value="">Select City</option>' +
    cities.map(c => `<option value="${c}">${c}</option>`).join('');
}

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
  const password = form.querySelector('input[type="password"]')?.value || '';
  
  // Get existing users from database or create first user
  const users = JSON.parse(localStorage.getItem('Kynotra_users') || '[]');
  let user = users.find(u => u.email === email);
  
  if (!user) {
    showToast('No account found with this email', 'error');
    return;
  }
  
  // In production, this would verify password hash on server
  if (user.password !== password) {
    showToast('Incorrect password', 'error');
    return;
  }
  
  // Set current logged-in user
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  showToast('Logging in...', 'success');
  
  // Handle redirect parameter
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  
  setTimeout(() => {
    if (redirect === 'checkout') {
      window.location.href = _base + 'shop.html';
    } else if (redirect === 'programs') {
      window.location.href = _base + 'programs.html';
    } else if (redirect === 'subscribe') {
      const plan = urlParams.get('plan') || 'pro';
      window.location.href = _base + 'index.html#pricing';
    } else {
      window.location.href = _base + 'pages/dashboard/dashboard.html';
    }
  }, 1000);
}

function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const firstName = form.querySelector('input[name="firstName"]')?.value || form.querySelector('input[type="text"]')?.value || '';
  const lastName = form.querySelector('input[name="lastName"]')?.value || '';
  const email = form.querySelector('input[type="email"]')?.value || '';
  const password = form.querySelector('input[type="password"]')?.value || '';
  
  // Get existing users
  const users = JSON.parse(localStorage.getItem('Kynotra_users') || '[]');
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    showToast('An account with this email already exists', 'error');
    return;
  }
  
  // Create new user with subscription data
  const user = { 
    id: Date.now(),
    name: firstName, 
    lastName: lastName,
    email: email,
    password: password, // In production, hash this on server
    subscription: 'free',
    subscriptionStatus: null,
    trialEndsAt: null,
    createdAt: new Date().toISOString(),
    progress: {
      workoutsCompleted: 0,
      currentStreak: 0,
      totalWeightLifted: 0,
      caloriesBurned: 0
    }
  };
  
  // Add to users database
  users.push(user);
  localStorage.setItem('Kynotra_users', JSON.stringify(users));
  
  // Set as current user
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  showToast('Account created! Redirecting...', 'success');
  
  // Handle plan parameter - auto-start trial if came from pricing
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  
  setTimeout(() => {
    if (plan && plan !== 'free') {
      // Redirect to pricing with trial flag
      window.location.href = _base + 'index.html?plan=' + plan + '&trial=true#pricing';
    } else {
      window.location.href = _base + 'pages/dashboard/dashboard.html';
    }
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
  
  // Update subscription display
  const dashPlanLabel = document.getElementById('dashPlanLabel');
  const dashPlanTag = document.getElementById('dashPlanTag');
  
  if (dashPlanLabel && dashPlanTag) {
    const subscription = user.subscription || 'free';
    const status = user.subscriptionStatus;
    const planNames = { free: 'Free', pro: 'Pro', elite: 'Elite' };
    const planName = planNames[subscription] || 'Free';
    
    dashPlanLabel.textContent = `${planName} Member`;
    
    if (status === 'trial') {
      dashPlanTag.textContent = 'Trial Active';
      dashPlanTag.className = 'tag tag-info';
      dashPlanTag.style.display = 'inline-block';
      
      // Show days remaining
      if (user.trialEndsAt) {
        const trialEnd = new Date(user.trialEndsAt);
        const daysLeft = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
          dashPlanTag.textContent = `Trial: ${daysLeft} days left`;
        } else {
          dashPlanTag.textContent = 'Trial Expired';
          dashPlanTag.className = 'tag tag-error';
        }
      }
    } else if (subscription !== 'free') {
      dashPlanTag.textContent = 'Active Plan';
      dashPlanTag.className = 'tag tag-success';
      dashPlanTag.style.display = 'inline-block';
    } else {
      dashPlanTag.textContent = 'Free Plan';
      dashPlanTag.className = 'tag tag-primary';
      dashPlanTag.style.display = 'inline-block';
    }
  }
}

// ==========================================
// PROFILE EDITOR
// ==========================================

// Profile tab switching
function switchProfileTab(tab) {
  // Hide all tabs
  document.getElementById('profileTabPersonal').style.display = 'none';
  const fitnessTab = document.getElementById('profileTabFitness');
  if (fitnessTab) fitnessTab.style.display = 'none';
  document.getElementById('profileTabAddress').style.display = 'none';
  document.getElementById('profileTabPayment').style.display = 'none';
  
  // Remove active from all buttons
  document.getElementById('tabPersonal').style.background = 'transparent';
  document.getElementById('tabPersonal').style.color = 'var(--text-secondary)';
  const tabFitness = document.getElementById('tabFitness');
  if (tabFitness) {
    tabFitness.style.background = 'transparent';
    tabFitness.style.color = 'var(--text-secondary)';
  }
  document.getElementById('tabAddress').style.background = 'transparent';
  document.getElementById('tabAddress').style.color = 'var(--text-secondary)';
  document.getElementById('tabPayment').style.background = 'transparent';
  document.getElementById('tabPayment').style.color = 'var(--text-secondary)';
  
  // Show selected tab
  if (tab === 'personal') {
    document.getElementById('profileTabPersonal').style.display = 'block';
    document.getElementById('tabPersonal').style.background = 'var(--accent)';
    document.getElementById('tabPersonal').style.color = 'white';
  } else if (tab === 'fitness') {
    if (fitnessTab) fitnessTab.style.display = 'block';
    if (tabFitness) {
      tabFitness.style.background = 'var(--accent)';
      tabFitness.style.color = 'white';
    }
  } else if (tab === 'address') {
    document.getElementById('profileTabAddress').style.display = 'block';
    document.getElementById('tabAddress').style.background = 'var(--accent)';
    document.getElementById('tabAddress').style.color = 'white';
  } else if (tab === 'payment') {
    document.getElementById('profileTabPayment').style.display = 'block';
    document.getElementById('tabPayment').style.background = 'var(--accent)';
    document.getElementById('tabPayment').style.color = 'white';
  }
}

// Profile card formatting
function formatProfileCard(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatProfileExpiry(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 4);
  if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
  input.value = val;
}

// Update city dropdown in profile based on country
function updateProfileCities() {
  const countrySelect = document.getElementById('editCountry');
  const citySelect = document.getElementById('editCity');
  if (!countrySelect || !citySelect) return;
  
  const country = countrySelect.value;
  const cities = CITIES[country] || [];
  
  citySelect.innerHTML = '<option value="">Select City</option>' + 
    cities.map(c => `<option value="${c}">${c}</option>`).join('');
}

function openProfileEditor() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  // Personal Info
  document.getElementById('editFirstName').value = user.name || '';
  document.getElementById('editLastName').value = user.lastName || '';
  document.getElementById('editEmail').value = user.email || '';
  document.getElementById('editAge').value = user.age || '';
  document.getElementById('editWeight').value = user.weight || '';
  document.getElementById('editHeight').value = user.height || '';
  
  // Set gender dropdown
  document.getElementById('editGender').value = user.gender || '';
  const genderWrapper = document.getElementById('editGenderWrapper');
  if (genderWrapper && user.gender) {
    const genderOption = genderWrapper.querySelector(`.custom-select-option[data-value="${user.gender}"]`);
    const genderDisplay = genderWrapper.querySelector('.custom-select-value');
    if (genderOption && genderDisplay) {
      genderDisplay.textContent = genderOption.querySelector('.option-text').textContent;
    }
  } else if (genderWrapper) {
    genderWrapper.querySelector('.custom-select-value').textContent = 'Select...';
  }
  
  // Set goal dropdown
  document.getElementById('editGoal').value = user.goal || '';
  const goalWrapper = document.getElementById('editGoalWrapper');
  if (goalWrapper && user.goal) {
    const goalOption = goalWrapper.querySelector(`.custom-select-option[data-value="${user.goal}"]`);
    const goalDisplay = goalWrapper.querySelector('.custom-select-value');
    if (goalOption && goalDisplay) {
      goalDisplay.textContent = goalOption.querySelector('.option-text').textContent;
    }
  } else if (goalWrapper) {
    goalWrapper.querySelector('.custom-select-value').textContent = 'Select goal...';
  }
  
  // Restore unit preference
  setProfileUnit(user.unit || 'imperial');
  
  // Address Info
  const phoneInput = document.getElementById('editPhone');
  const countrySelect = document.getElementById('editCountry');
  const citySelect = document.getElementById('editCity');
  const addressInput = document.getElementById('editAddress');
  const zipInput = document.getElementById('editZip');
  
  if (phoneInput) phoneInput.value = user.phone || '';
  if (countrySelect) {
    countrySelect.innerHTML = '<option value="">Select Country</option>' + 
      COUNTRIES.map(c => `<option value="${c}" ${c === user.country ? 'selected' : ''}>${c}</option>`).join('');
  }
  if (citySelect && user.country) {
    const cities = CITIES[user.country] || [];
    citySelect.innerHTML = '<option value="">Select City</option>' + 
      cities.map(c => `<option value="${c}" ${c === user.city ? 'selected' : ''}>${c}</option>`).join('');
  }
  if (addressInput) addressInput.value = user.address || '';
  if (zipInput) zipInput.value = user.zip || '';
  
  // Payment Info
  const cardNumberInput = document.getElementById('editCardNumber');
  const cardNameInput = document.getElementById('editCardName');
  const cardExpiryInput = document.getElementById('editCardExpiry');
  const cardCVCInput = document.getElementById('editCardCVC');
  
  if (cardNumberInput) cardNumberInput.value = user.cardNumber || '';
  if (cardNameInput) cardNameInput.value = user.cardName || '';
  if (cardExpiryInput) cardExpiryInput.value = user.cardExpiry || '';
  if (cardCVCInput) cardCVCInput.value = ''; // Don't prefill CVC for security
  
  // Reset to personal tab
  switchProfileTab('personal');
  
  document.getElementById('profileModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProfileEditor() {
  document.getElementById('profileModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Profile unit toggle
let profileUnit = 'imperial'; // default

function setProfileUnit(unit) {
  profileUnit = unit;
  const imperial = document.getElementById('profileUnitImperial');
  const metric = document.getElementById('profileUnitMetric');
  const weightUnit = document.getElementById('profileWeightUnit');
  const heightUnit = document.getElementById('profileHeightUnit');
  const weightInput = document.getElementById('editWeight');
  const heightInput = document.getElementById('editHeight');
  
  if (!imperial || !metric) return; // Elements not on this page
  
  if (unit === 'imperial') {
    imperial.classList.add('active');
    metric.classList.remove('active');
    if (weightUnit) weightUnit.textContent = '(lbs)';
    if (heightUnit) heightUnit.textContent = '(in)';
    if (weightInput) weightInput.placeholder = '175';
    if (heightInput) heightInput.placeholder = '70';
  } else {
    metric.classList.add('active');
    imperial.classList.remove('active');
    if (weightUnit) weightUnit.textContent = '(kg)';
    if (heightUnit) heightUnit.textContent = '(cm)';
    if (weightInput) weightInput.placeholder = '80';
    if (heightInput) heightInput.placeholder = '178';
  }
}

function saveProfile(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || '{}');
  
  // Personal Info
  user.name = document.getElementById('editFirstName').value.trim();
  user.lastName = document.getElementById('editLastName').value.trim();
  user.email = document.getElementById('editEmail').value.trim();
  user.age = document.getElementById('editAge').value;
  user.gender = document.getElementById('editGender').value;
  user.weight = document.getElementById('editWeight').value;
  user.height = document.getElementById('editHeight').value;
  user.goal = document.getElementById('editGoal').value;
  user.unit = profileUnit; // Save unit preference
  
  // Address Info
  const phoneInput = document.getElementById('editPhone');
  const countrySelect = document.getElementById('editCountry');
  const citySelect = document.getElementById('editCity');
  const addressInput = document.getElementById('editAddress');
  const zipInput = document.getElementById('editZip');
  
  if (phoneInput) user.phone = phoneInput.value.trim();
  if (countrySelect) user.country = countrySelect.value;
  if (citySelect) user.city = citySelect.value;
  if (addressInput) user.address = addressInput.value.trim();
  if (zipInput) user.zip = zipInput.value.trim();
  
  // Payment Info (only save if provided)
  const cardNumberInput = document.getElementById('editCardNumber');
  const cardNameInput = document.getElementById('editCardName');
  const cardExpiryInput = document.getElementById('editCardExpiry');
  const cardCVCInput = document.getElementById('editCardCVC');
  
  if (cardNumberInput && cardNumberInput.value.trim()) {
    user.cardNumber = cardNumberInput.value.trim();
  }
  if (cardNameInput && cardNameInput.value.trim()) {
    user.cardName = cardNameInput.value.trim();
  }
  if (cardExpiryInput && cardExpiryInput.value.trim()) {
    user.cardExpiry = cardExpiryInput.value.trim();
  }
  // Don't save CVC for security
  
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  
  // Also update in users database
  updateUserInDatabase(user);
  
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
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  iconSpan.textContent = icons[type] || icons.success;
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

// ==========================================
// SUBSCRIPTION MANAGEMENT
// ==========================================
function startTrial(plan) {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  
  // If not logged in, redirect to signup
  if (!user) {
    showToast('Please create an account first', 'info');
    setTimeout(() => {
      window.location.href = _base + 'pages/auth/signup.html?plan=' + plan + '&trial=true';
    }, 1000);
    return;
  }
  
  // Check if already has subscription or used trial
  if (user.subscription && user.subscription !== 'free') {
    showToast('You already have an active subscription!', 'info');
    return;
  }
  
  if (user.trialUsed) {
    showToast('You have already used your free trial', 'error');
    return;
  }
  
  // Start the trial
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);
  
  user.subscription = plan;
  user.subscriptionStatus = 'trial';
  user.trialEndsAt = trialEndsAt.toISOString();
  user.trialUsed = true;
  
  // Update user in localStorage
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  
  // Update users database
  updateUserInDatabase(user);
  
  showToast(`Started 7-day free trial of ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`, 'success');
  
  // Update pricing display
  updatePricingDisplay();
  
  setTimeout(() => {
    window.location.href = _base + 'pages/dashboard/dashboard.html';
  }, 1500);
}

function subscribe(plan) {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  
  if (!user) {
    showToast('Please log in first', 'info');
    setTimeout(() => {
      window.location.href = _base + 'pages/auth/login.html?redirect=subscribe&plan=' + plan;
    }, 1000);
    return;
  }
  
  // In production, this would open a payment modal/Stripe checkout
  // For now, simulate subscription
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  
  user.subscription = plan;
  user.subscriptionStatus = 'active';
  user.subscriptionExpiresAt = expiresAt.toISOString();
  
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  updateUserInDatabase(user);
  
  showToast(`Subscribed to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`, 'success');
  updatePricingDisplay();
  
  setTimeout(() => {
    window.location.href = _base + 'pages/dashboard/dashboard.html';
  }, 1500);
}

function updateUserInDatabase(user) {
  const users = JSON.parse(localStorage.getItem('Kynotra_users') || '[]');
  const index = users.findIndex(u => u.email === user.email);
  if (index !== -1) {
    users[index] = user;
    localStorage.setItem('Kynotra_users', JSON.stringify(users));
  }
}

function updatePricingDisplay() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  if (!pricingCards.length) return;
  
  pricingCards.forEach(card => {
    const planName = card.dataset.plan || card.querySelector('h3')?.textContent.toLowerCase();
    const btn = card.querySelector('.btn');
    
    if (!btn || !planName) return;
    
    // Reset button state first
    btn.disabled = false;
    btn.style.pointerEvents = '';
    btn.style.opacity = '';
    
    // Get user's current subscription
    const userSub = user?.subscription || 'free';
    const isTrialUser = user?.subscriptionStatus === 'trial';
    
    // If user has this plan (paid or trial)
    if (user && userSub === planName && planName !== 'free') {
      let statusText = 'Current Plan';
      
      if (isTrialUser && user.trialEndsAt) {
        const trialEnd = new Date(user.trialEndsAt);
        const daysLeft = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));
        statusText = daysLeft > 0 ? `Trial: ${daysLeft} days left` : 'Trial Expired';
      }
      
      btn.textContent = statusText;
      btn.classList.remove('btn-primary', 'btn-secondary', 'btn-outline');
      btn.classList.add('btn-success');
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.8';
    }
    // User is logged in with free plan
    else if (user && userSub === 'free') {
      if (planName === 'free') {
        btn.textContent = 'Current Plan';
        btn.classList.remove('btn-primary', 'btn-outline');
        btn.classList.add('btn-success');
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.8';
      } else if (planName === 'pro') {
        btn.textContent = user.trialUsed ? 'Subscribe to Pro' : 'Start 7-Day Free Trial';
      } else if (planName === 'elite') {
        btn.textContent = 'Go Elite';
      }
    }
    // User has Pro (trial or active) - can upgrade to Elite
    else if (user && userSub === 'pro' && planName === 'elite') {
      btn.textContent = 'Upgrade to Elite';
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary');
    }
    // User has Pro - mark free as downgrade option
    else if (user && userSub === 'pro' && planName === 'free') {
      btn.textContent = 'Downgrade';
      btn.classList.remove('btn-success');
      btn.classList.add('btn-secondary');
    }
    // User has Elite - already on best plan
    else if (user && userSub === 'elite') {
      if (planName === 'elite') {
        btn.textContent = 'Current Plan';
        btn.classList.remove('btn-primary', 'btn-outline');
        btn.classList.add('btn-success');
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.8';
      } else {
        btn.textContent = 'Downgrade';
        btn.classList.remove('btn-success', 'btn-primary');
        btn.classList.add('btn-secondary');
      }
    }
  });
}

// Handle generic "Get Started" CTA - redirects logged-in users to dashboard
function handleGetStarted() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  if (user) {
    window.location.href = _base + 'pages/dashboard/dashboard.html';
  } else {
    window.location.href = _base + 'pages/auth/signup.html';
  }
}

// Handle pricing plan action
function handlePlanAction(plan) {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  
  // Not logged in - redirect to signup
  if (!user) {
    window.location.href = _base + 'pages/auth/signup.html?plan=' + plan;
    return;
  }
  
  const userSub = user.subscription || 'free';
  
  // Already on this plan
  if (userSub === plan) {
    showToast('You are already on this plan', 'info');
    return;
  }
  
  // Downgrade request
  if ((userSub === 'elite' && (plan === 'pro' || plan === 'free')) ||
      (userSub === 'pro' && plan === 'free')) {
    showToast('Contact support to downgrade your plan', 'info');
    return;
  }
  
  // Free plan - redirect to dashboard
  if (plan === 'free') {
    window.location.href = _base + 'pages/dashboard/dashboard.html';
    return;
  }
  
  // User is logged in and wants to upgrade/start trial
  if (userSub === 'free' && !user.trialUsed) {
    // Start trial
    startTrial(plan);
  } else if (userSub === 'free' && user.trialUsed) {
    // Already used trial - subscribe directly
    subscribe(plan);
  } else if (userSub === 'pro' && plan === 'elite') {
    // Upgrade from Pro to Elite
    subscribe('elite');
  }
}

// Initialize pricing display on page load
document.addEventListener('DOMContentLoaded', () => {
  updatePricingDisplay();
  updateTrialButtons();
  
  // Handle URL params for signup with plan
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  const isTrial = urlParams.get('trial');
  
  if (plan && isTrial === 'true') {
    // Auto-start trial after signup
    const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
    if (user && (!user.subscription || user.subscription === 'free')) {
      startTrial(plan);
    }
  }
});

// Update hero and CTA trial buttons based on user state
function updateTrialButtons() {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  const heroBtn = document.getElementById('heroTrialBtn');
  const ctaBtn = document.getElementById('ctaTrialBtn');
  
  const buttons = [heroBtn, ctaBtn].filter(Boolean);
  
  buttons.forEach(btn => {
    if (!user) {
      // Not logged in - show trial CTA
      btn.textContent = 'Start Free Trial →';
      btn.onclick = () => handlePlanAction('pro');
    } else {
      const sub = user.subscription || 'free';
      
      if (sub !== 'free') {
        // Has paid subscription or trial
        if (user.subscriptionStatus === 'trial') {
          btn.textContent = 'Go to Dashboard →';
        } else {
          btn.textContent = 'Go to Dashboard →';
        }
        btn.onclick = () => { window.location.href = _base + 'pages/dashboard/dashboard.html'; };
      } else if (user.trialUsed) {
        // Free user who already used trial
        btn.textContent = 'Subscribe Now →';
        btn.onclick = () => handlePlanAction('pro');
      } else {
        // Free user who hasn't used trial
        btn.textContent = 'Start Free Trial →';
        btn.onclick = () => handlePlanAction('pro');
      }
    }
  });
}

// ==========================================
// UPDATE USER PROGRESS
// ==========================================
function updateUserProgress(progressData) {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  if (!user) return;
  
  user.progress = user.progress || {};
  Object.assign(user.progress, progressData);
  
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  updateUserInDatabase(user);
}

function logWorkoutComplete(workoutData) {
  const user = JSON.parse(localStorage.getItem('Kynotra_user') || 'null');
  if (!user) return;
  
  user.progress = user.progress || {
    workoutsCompleted: 0,
    currentStreak: 0,
    totalWeightLifted: 0,
    caloriesBurned: 0,
    workoutHistory: []
  };
  
  user.progress.workoutsCompleted++;
  user.progress.totalWeightLifted += workoutData.weightLifted || 0;
  user.progress.caloriesBurned += workoutData.caloriesBurned || 0;
  
  // Add to history
  user.progress.workoutHistory = user.progress.workoutHistory || [];
  user.progress.workoutHistory.push({
    date: new Date().toISOString(),
    ...workoutData
  });
  
  // Update streak
  const lastWorkout = user.progress.lastWorkoutDate;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (!lastWorkout || new Date(lastWorkout).toDateString() === yesterday) {
    user.progress.currentStreak++;
  } else if (new Date(lastWorkout).toDateString() !== today) {
    user.progress.currentStreak = 1;
  }
  
  user.progress.lastWorkoutDate = new Date().toISOString();
  
  localStorage.setItem('Kynotra_user', JSON.stringify(user));
  updateUserInDatabase(user);
  
  showToast('Workout logged! 💪', 'success');
}
