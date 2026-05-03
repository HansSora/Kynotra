// ==========================================
// EXERCISE ANIMATIONS - SVG Stick Figures
// ==========================================

const ExerciseAnimations = {
  
  // Bench Press - lying down, pushing bar up and down
  benchPress: `
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Bench -->
      <rect x="40" y="90" width="120" height="12" rx="3" class="bench"/>
      <rect x="30" y="102" width="15" height="35" rx="2" class="bench"/>
      <rect x="155" y="102" width="15" height="35" rx="2" class="bench"/>
      <!-- Rack -->
      <line x1="25" y1="30" x2="25" y2="100" class="equipment"/>
      <line x1="175" y1="30" x2="175" y2="100" class="equipment"/>
      <line x1="15" y1="30" x2="35" y2="30" class="equipment"/>
      <line x1="165" y1="30" x2="185" y2="30" class="equipment"/>
      <!-- Person lying down -->
      <circle cx="130" cy="80" r="10" class="stick-head"/>
      <line x1="120" y1="85" x2="70" y2="88" class="stick-figure"/>
      <line x1="70" y1="88" x2="45" y2="120" class="stick-figure"/>
      <line x1="70" y1="88" x2="55" y2="130" class="stick-figure"/>
      <!-- Animated arms + bar -->
      <g class="animate-bench">
        <line x1="100" y1="85" x2="100" y2="55" class="stick-figure"/>
        <line x1="115" y1="85" x2="115" y2="55" class="stick-figure"/>
        <line x1="20" y1="50" x2="180" y2="50" class="equipment" stroke-width="5"/>
        <circle cx="15" cy="50" r="12" class="equipment-fill"/>
        <circle cx="185" cy="50" r="12" class="equipment-fill"/>
      </g>
    </svg>`,

  // Incline Press
  inclinePress: `
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Incline Bench -->
      <polygon points="50,130 150,130 150,70 80,50" class="bench"/>
      <rect x="45" y="130" width="10" height="15" class="bench"/>
      <rect x="145" y="130" width="10" height="15" class="bench"/>
      <!-- Person on incline -->
      <circle cx="95" cy="55" r="10" class="stick-head"/>
      <line x1="95" y1="65" x2="110" y2="110" class="stick-figure"/>
      <line x1="110" y1="110" x2="90" y2="140" class="stick-figure"/>
      <line x1="110" y1="110" x2="130" y2="140" class="stick-figure"/>
      <!-- Animated arms + dumbbells -->
      <g class="animate-bench">
        <line x1="95" y1="75" x2="60" y2="60" class="stick-figure"/>
        <line x1="95" y1="75" x2="130" y2="60" class="stick-figure"/>
        <rect x="50" y="55" width="15" height="10" rx="2" class="equipment-fill"/>
        <rect x="125" y="55" width="15" height="10" rx="2" class="equipment-fill"/>
      </g>
    </svg>`,

  // Push-up
  pushUp: `
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="110" x2="200" y2="110" class="ground"/>
      <g class="animate-bench">
        <!-- Head -->
        <circle cx="160" cy="50" r="10" class="stick-head"/>
        <!-- Body (angled for push-up) -->
        <line x1="155" y1="58" x2="60" y2="75" class="stick-figure"/>
        <!-- Arms -->
        <line x1="140" y1="62" x2="140" y2="95" class="stick-figure"/>
        <line x1="120" y1="66" x2="120" y2="95" class="stick-figure"/>
        <!-- Legs -->
        <line x1="60" y1="75" x2="25" y2="95" class="stick-figure"/>
        <!-- Hands and feet -->
        <circle cx="140" cy="100" r="4" class="stick-head"/>
        <circle cx="120" cy="100" r="4" class="stick-head"/>
        <circle cx="25" cy="100" r="4" class="stick-head"/>
      </g>
    </svg>`,

  // Dumbbell Fly
  dumbellFly: `
    <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
      <!-- Bench -->
      <rect x="40" y="80" width="120" height="10" rx="3" class="bench"/>
      <rect x="35" y="90" width="12" height="30" class="bench"/>
      <rect x="153" y="90" width="12" height="30" class="bench"/>
      <!-- Person -->
      <circle cx="100" cy="70" r="10" class="stick-head"/>
      <line x1="100" y1="75" x2="100" y2="78" class="stick-figure"/>
      <line x1="100" y1="78" x2="70" y2="110" class="stick-figure"/>
      <line x1="100" y1="78" x2="130" y2="110" class="stick-figure"/>
      <!-- Left arm -->
      <g class="animate-fly" style="transform-origin: 100px 75px;">
        <line x1="100" y1="75" x2="55" y2="75" class="stick-figure"/>
        <rect x="45" y="70" width="12" height="10" rx="2" class="equipment-fill"/>
      </g>
      <!-- Right arm (mirrored) -->
      <g class="animate-fly" style="transform-origin: 100px 75px; transform: scaleX(-1);">
        <line x1="100" y1="75" x2="55" y2="75" class="stick-figure"/>
        <rect x="45" y="70" width="12" height="10" rx="2" class="equipment-fill"/>
      </g>
    </svg>`,

  // Cable Fly
  cableFly: `
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Cable towers -->
      <rect x="10" y="20" width="15" height="120" class="equipment-fill"/>
      <rect x="175" y="20" width="15" height="120" class="equipment-fill"/>
      <!-- Person -->
      <circle cx="100" cy="55" r="10" class="stick-head"/>
      <line x1="100" y1="65" x2="100" y2="100" class="stick-figure"/>
      <line x1="100" y1="100" x2="85" y2="135" class="stick-figure"/>
      <line x1="100" y1="100" x2="115" y2="135" class="stick-figure"/>
      <!-- Cables and arms -->
      <g class="animate-fly" style="transform-origin: 100px 75px;">
        <line x1="100" y1="75" x2="55" y2="65" class="stick-figure"/>
        <line x1="25" y1="45" x2="55" y2="65" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,2"/>
      </g>
      <g class="animate-fly" style="transform-origin: 100px 75px; transform: scaleX(-1);">
        <line x1="100" y1="75" x2="55" y2="65" class="stick-figure"/>
        <line x1="25" y1="45" x2="55" y2="65" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,2"/>
      </g>
    </svg>`,

  // Chest Dip
  chestDip: `
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Dip bars -->
      <rect x="40" y="50" width="8" height="100" class="equipment-fill"/>
      <rect x="152" y="50" width="8" height="100" class="equipment-fill"/>
      <line x1="30" y1="50" x2="60" y2="50" class="equipment"/>
      <line x1="140" y1="50" x2="170" y2="50" class="equipment"/>
      <!-- Person -->
      <g class="animate-dip">
        <circle cx="100" cy="40" r="10" class="stick-head"/>
        <line x1="100" y1="50" x2="100" y2="90" class="stick-figure"/>
        <line x1="100" y1="90" x2="90" y2="130" class="stick-figure"/>
        <line x1="100" y1="90" x2="110" y2="130" class="stick-figure"/>
        <!-- Arms on bars -->
        <line x1="100" y1="60" x2="48" y2="50" class="stick-figure"/>
        <line x1="100" y1="60" x2="152" y2="50" class="stick-figure"/>
      </g>
    </svg>`,

  // Squat
  squat: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Barbell on shoulders -->
      <g class="animate-squat">
        <!-- Person -->
        <circle cx="100" cy="35" r="10" class="stick-head"/>
        <line x1="100" y1="45" x2="100" y2="90" class="stick-figure"/>
        <line x1="100" y1="90" x2="75" y2="130" class="stick-figure"/>
        <line x1="100" y1="90" x2="125" y2="130" class="stick-figure"/>
        <line x1="75" y1="130" x2="70" y2="150" class="stick-figure"/>
        <line x1="125" y1="130" x2="130" y2="150" class="stick-figure"/>
        <!-- Arms holding bar -->
        <line x1="100" y1="55" x2="65" y2="50" class="stick-figure"/>
        <line x1="100" y1="55" x2="135" y2="50" class="stick-figure"/>
        <!-- Barbell -->
        <line x1="40" y1="48" x2="160" y2="48" class="equipment" stroke-width="5"/>
        <circle cx="35" cy="48" r="10" class="equipment-fill"/>
        <circle cx="165" cy="48" r="10" class="equipment-fill"/>
      </g>
    </svg>`,

  // Deadlift
  deadlift: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Barbell on ground -->
      <line x1="30" y1="145" x2="170" y2="145" class="equipment" stroke-width="5"/>
      <circle cx="25" cy="145" r="12" class="equipment-fill"/>
      <circle cx="175" cy="145" r="12" class="equipment-fill"/>
      <!-- Person -->
      <g class="animate-deadlift" style="transform-origin: 100px 145px;">
        <circle cx="100" cy="50" r="10" class="stick-head"/>
        <line x1="100" y1="60" x2="100" y2="100" class="stick-figure"/>
        <line x1="100" y1="100" x2="80" y2="140" class="stick-figure"/>
        <line x1="100" y1="100" x2="120" y2="140" class="stick-figure"/>
        <!-- Arms down to bar -->
        <line x1="100" y1="70" x2="75" y2="140" class="stick-figure"/>
        <line x1="100" y1="70" x2="125" y2="140" class="stick-figure"/>
      </g>
    </svg>`,

  // Pull-up
  pullUp: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <!-- Bar -->
      <line x1="40" y1="20" x2="160" y2="20" class="equipment" stroke-width="6"/>
      <rect x="35" y="15" width="10" height="145" class="equipment-fill"/>
      <rect x="155" y="15" width="10" height="145" class="equipment-fill"/>
      <!-- Person -->
      <g class="animate-pullup">
        <circle cx="100" cy="50" r="10" class="stick-head"/>
        <line x1="100" y1="60" x2="100" y2="100" class="stick-figure"/>
        <line x1="100" y1="100" x2="90" y2="140" class="stick-figure"/>
        <line x1="100" y1="100" x2="110" y2="140" class="stick-figure"/>
        <!-- Arms to bar -->
        <line x1="100" y1="65" x2="75" y2="20" class="stick-figure"/>
        <line x1="100" y1="65" x2="125" y2="20" class="stick-figure"/>
      </g>
    </svg>`,

  // Barbell Row
  barbellRow: `
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="145" x2="200" y2="145" class="ground"/>
      <!-- Person bent over -->
      <circle cx="130" cy="45" r="10" class="stick-head"/>
      <line x1="125" y1="53" x2="80" y2="80" class="stick-figure"/>
      <line x1="80" y1="80" x2="70" y2="130" class="stick-figure"/>
      <line x1="80" y1="80" x2="100" y2="130" class="stick-figure"/>
      <!-- Arms + barbell animated -->
      <g class="animate-row">
        <line x1="100" y1="70" x2="100" y2="110" class="stick-figure"/>
        <line x1="90" y1="65" x2="90" y2="110" class="stick-figure"/>
        <line x1="50" y1="110" x2="150" y2="110" class="equipment" stroke-width="4"/>
        <circle cx="45" cy="110" r="8" class="equipment-fill"/>
        <circle cx="155" cy="110" r="8" class="equipment-fill"/>
      </g>
    </svg>`,

  // Lat Pulldown
  latPulldown: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <!-- Machine -->
      <rect x="75" y="5" width="50" height="15" class="equipment-fill"/>
      <line x1="100" y1="20" x2="100" y2="45" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- Bar -->
      <line x1="50" y1="45" x2="150" y2="45" class="equipment" stroke-width="4"/>
      <!-- Seat -->
      <rect x="75" y="130" width="50" height="8" class="bench"/>
      <rect x="85" y="138" width="10" height="15" class="bench"/>
      <rect x="105" y="138" width="10" height="15" class="bench"/>
      <!-- Person -->
      <g class="animate-bench">
        <circle cx="100" cy="75" r="10" class="stick-head"/>
        <line x1="100" y1="85" x2="100" y2="125" class="stick-figure"/>
        <line x1="100" y1="125" x2="80" y2="150" class="stick-figure"/>
        <line x1="100" y1="125" x2="120" y2="150" class="stick-figure"/>
        <!-- Arms pulling bar down -->
        <line x1="100" y1="90" x2="60" y2="50" class="stick-figure"/>
        <line x1="100" y1="90" x2="140" y2="50" class="stick-figure"/>
      </g>
    </svg>`,

  // Overhead Press
  overheadPress: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Person standing -->
      <circle cx="100" cy="40" r="10" class="stick-head"/>
      <line x1="100" y1="50" x2="100" y2="100" class="stick-figure"/>
      <line x1="100" y1="100" x2="85" y2="150" class="stick-figure"/>
      <line x1="100" y1="100" x2="115" y2="150" class="stick-figure"/>
      <!-- Arms + bar animated -->
      <g class="animate-press">
        <line x1="100" y1="60" x2="65" y2="25" class="stick-figure"/>
        <line x1="100" y1="60" x2="135" y2="25" class="stick-figure"/>
        <line x1="40" y1="22" x2="160" y2="22" class="equipment" stroke-width="4"/>
        <circle cx="35" cy="22" r="8" class="equipment-fill"/>
        <circle cx="165" cy="22" r="8" class="equipment-fill"/>
      </g>
    </svg>`,

  // Lateral Raise
  lateralRaise: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Person standing -->
      <circle cx="100" cy="40" r="10" class="stick-head"/>
      <line x1="100" y1="50" x2="100" y2="100" class="stick-figure"/>
      <line x1="100" y1="100" x2="85" y2="150" class="stick-figure"/>
      <line x1="100" y1="100" x2="115" y2="150" class="stick-figure"/>
      <!-- Left arm -->
      <g class="animate-lateral">
        <line x1="100" y1="60" x2="55" y2="70" class="stick-figure"/>
        <rect x="45" y="65" width="12" height="10" rx="2" class="equipment-fill"/>
      </g>
      <!-- Right arm (mirrored) -->
      <g class="animate-lateral" style="transform: scaleX(-1); transform-origin: 100px 60px;">
        <line x1="100" y1="60" x2="55" y2="70" class="stick-figure"/>
        <rect x="45" y="65" width="12" height="10" rx="2" class="equipment-fill"/>
      </g>
    </svg>`,

  // Bicep Curl
  bicepCurl: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Person standing -->
      <circle cx="100" cy="35" r="10" class="stick-head"/>
      <line x1="100" y1="45" x2="100" y2="95" class="stick-figure"/>
      <line x1="100" y1="95" x2="85" y2="150" class="stick-figure"/>
      <line x1="100" y1="95" x2="115" y2="150" class="stick-figure"/>
      <!-- Upper arms stationary -->
      <line x1="100" y1="55" x2="70" y2="80" class="stick-figure"/>
      <line x1="100" y1="55" x2="130" y2="80" class="stick-figure"/>
      <!-- Forearms + dumbbells animated -->
      <g class="animate-curl" style="transform-origin: 70px 80px;">
        <line x1="70" y1="80" x2="70" y2="120" class="stick-figure"/>
        <rect x="62" y="115" width="16" height="10" rx="2" class="equipment-fill"/>
      </g>
      <g class="animate-curl" style="transform-origin: 130px 80px;">
        <line x1="130" y1="80" x2="130" y2="120" class="stick-figure"/>
        <rect x="122" y="115" width="16" height="10" rx="2" class="equipment-fill"/>
      </g>
    </svg>`,

  // Tricep Pushdown
  tricepPushdown: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Cable machine -->
      <rect x="90" y="5" width="20" height="20" class="equipment-fill"/>
      <line x1="100" y1="25" x2="100" y2="60" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- Person -->
      <circle cx="100" cy="45" r="10" class="stick-head"/>
      <line x1="100" y1="55" x2="100" y2="100" class="stick-figure"/>
      <line x1="100" y1="100" x2="85" y2="150" class="stick-figure"/>
      <line x1="100" y1="100" x2="115" y2="150" class="stick-figure"/>
      <!-- Upper arms (pinned) -->
      <line x1="100" y1="65" x2="85" y2="85" class="stick-figure"/>
      <line x1="100" y1="65" x2="115" y2="85" class="stick-figure"/>
      <!-- Forearms + rope animated -->
      <g class="animate-curl" style="transform-origin: 100px 85px; animation-direction: reverse;">
        <line x1="85" y1="85" x2="90" y2="120" class="stick-figure"/>
        <line x1="115" y1="85" x2="110" y2="120" class="stick-figure"/>
        <line x1="90" y1="120" x2="100" y2="60" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="110" y1="120" x2="100" y2="60" stroke="var(--text-muted)" stroke-width="1"/>
      </g>
    </svg>`,

  // Leg Extension
  legExtension: `
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Machine seat -->
      <rect x="30" y="60" width="80" height="15" class="bench"/>
      <rect x="25" y="75" width="20" height="60" class="bench"/>
      <rect x="90" y="75" width="20" height="60" class="bench"/>
      <!-- Back support -->
      <rect x="20" y="20" width="15" height="55" class="bench"/>
      <!-- Person sitting -->
      <circle cx="50" cy="30" r="10" class="stick-head"/>
      <line x1="50" y1="40" x2="70" y2="65" class="stick-figure"/>
      <line x1="55" y1="50" x2="30" y2="55" class="stick-figure"/>
      <line x1="55" y1="50" x2="25" y2="70" class="stick-figure"/>
      <!-- Thigh -->
      <line x1="70" y1="65" x2="110" y2="70" class="stick-figure"/>
      <!-- Lower leg animated -->
      <g class="animate-leg-ext" style="transform-origin: 110px 70px;">
        <line x1="110" y1="70" x2="120" y2="120" class="stick-figure"/>
        <rect x="115" y="105" width="20" height="10" rx="2" class="equipment-fill"/>
      </g>
    </svg>`,

  // Leg Curl
  legCurl: `
    <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
      <!-- Bench -->
      <rect x="20" y="50" width="160" height="15" rx="3" class="bench"/>
      <rect x="15" y="65" width="15" height="50" class="bench"/>
      <rect x="170" y="65" width="15" height="50" class="bench"/>
      <!-- Person lying face down -->
      <circle cx="50" cy="40" r="10" class="stick-head"/>
      <line x1="55" y1="48" x2="130" y2="55" class="stick-figure"/>
      <!-- Arms hanging -->
      <line x1="70" y1="50" x2="60" y2="80" class="stick-figure"/>
      <line x1="80" y1="52" x2="75" y2="85" class="stick-figure"/>
      <!-- Thighs -->
      <line x1="130" y1="55" x2="160" y2="52" class="stick-figure"/>
      <!-- Lower legs animated -->
      <g class="animate-curl" style="transform-origin: 160px 52px;">
        <line x1="160" y1="52" x2="180" y2="30" class="stick-figure"/>
        <rect x="172" y="18" width="15" height="8" rx="2" class="equipment-fill"/>
      </g>
    </svg>`,

  // Lunge
  lunge: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <g class="animate-lunge">
        <!-- Head -->
        <circle cx="100" cy="35" r="10" class="stick-head"/>
        <!-- Torso -->
        <line x1="100" y1="45" x2="100" y2="90" class="stick-figure"/>
        <!-- Arms -->
        <line x1="100" y1="55" x2="75" y2="75" class="stick-figure"/>
        <line x1="100" y1="55" x2="125" y2="75" class="stick-figure"/>
        <!-- Front leg (bent) -->
        <line x1="100" y1="90" x2="70" y2="120" class="stick-figure"/>
        <line x1="70" y1="120" x2="60" y2="150" class="stick-figure"/>
        <!-- Back leg (extended) -->
        <line x1="100" y1="90" x2="140" y2="115" class="stick-figure"/>
        <line x1="140" y1="115" x2="160" y2="150" class="stick-figure"/>
      </g>
    </svg>`,

  // Hip Thrust
  hipThrust: `
    <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="125" x2="200" y2="125" class="ground"/>
      <!-- Bench -->
      <rect x="10" y="60" width="60" height="40" rx="3" class="bench"/>
      <!-- Barbell -->
      <line x1="30" y1="50" x2="170" y2="50" class="equipment" stroke-width="5"/>
      <circle cx="25" cy="50" r="10" class="equipment-fill"/>
      <circle cx="175" cy="50" r="10" class="equipment-fill"/>
      <!-- Person -->
      <g class="animate-bench">
        <circle cx="35" cy="45" r="10" class="stick-head"/>
        <line x1="40" y1="52" x2="100" y2="55" class="stick-figure"/>
        <line x1="100" y1="55" x2="130" y2="110" class="stick-figure"/>
        <line x1="100" y1="55" x2="150" y2="110" class="stick-figure"/>
        <line x1="130" y1="110" x2="125" y2="120" class="stick-figure"/>
        <line x1="150" y1="110" x2="145" y2="120" class="stick-figure"/>
      </g>
    </svg>`,

  // Calf Raise
  calfRaise: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <!-- Platform -->
      <rect x="70" y="140" width="60" height="15" class="equipment-fill"/>
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Person -->
      <g class="animate-press" style="animation-duration: 1.5s;">
        <circle cx="100" cy="35" r="10" class="stick-head"/>
        <line x1="100" y1="45" x2="100" y2="95" class="stick-figure"/>
        <line x1="100" y1="95" x2="90" y2="130" class="stick-figure"/>
        <line x1="100" y1="95" x2="110" y2="130" class="stick-figure"/>
        <line x1="90" y1="130" x2="90" y2="140" class="stick-figure"/>
        <line x1="110" y1="130" x2="110" y2="140" class="stick-figure"/>
        <!-- Arms at sides -->
        <line x1="100" y1="55" x2="80" y2="90" class="stick-figure"/>
        <line x1="100" y1="55" x2="120" y2="90" class="stick-figure"/>
      </g>
    </svg>`,

  // Plank
  plank: `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="95" x2="200" y2="95" class="ground"/>
      <g class="animate-plank">
        <!-- Head -->
        <circle cx="160" cy="40" r="10" class="stick-head"/>
        <!-- Body straight -->
        <line x1="155" y1="48" x2="45" y2="60" class="stick-figure"/>
        <!-- Arms (forearms on ground) -->
        <line x1="140" y1="52" x2="140" y2="80" class="stick-figure"/>
        <line x1="120" y1="54" x2="120" y2="80" class="stick-figure"/>
        <!-- Legs -->
        <line x1="45" y1="60" x2="20" y2="80" class="stick-figure"/>
        <!-- Contact points -->
        <circle cx="140" cy="82" r="3" class="stick-head"/>
        <circle cx="120" cy="82" r="3" class="stick-head"/>
        <circle cx="20" cy="82" r="3" class="stick-head"/>
      </g>
    </svg>`,

  // Crunch
  crunch: `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="95" x2="200" y2="95" class="ground"/>
      <g class="animate-crunch" style="transform-origin: 80px 80px;">
        <!-- Head -->
        <circle cx="140" cy="50" r="10" class="stick-head"/>
        <!-- Upper body -->
        <line x1="135" y1="58" x2="80" y2="75" class="stick-figure"/>
        <!-- Arms behind head -->
        <line x1="130" y1="53" x2="150" y2="45" class="stick-figure"/>
        <line x1="138" y1="48" x2="155" y2="55" class="stick-figure"/>
      </g>
      <!-- Lower body (stays still) -->
      <line x1="80" y1="75" x2="50" y2="65" class="stick-figure"/>
      <line x1="50" y1="65" x2="25" y2="80" class="stick-figure"/>
      <line x1="50" y1="65" x2="30" y2="90" class="stick-figure"/>
    </svg>`,

  // Hanging Leg Raise
  hangingLegRaise: `
    <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg">
      <!-- Bar -->
      <line x1="50" y1="10" x2="150" y2="10" class="equipment" stroke-width="6"/>
      <!-- Person hanging -->
      <circle cx="100" cy="35" r="10" class="stick-head"/>
      <line x1="100" y1="45" x2="100" y2="90" class="stick-figure"/>
      <!-- Arms -->
      <line x1="100" y1="50" x2="80" y2="10" class="stick-figure"/>
      <line x1="100" y1="50" x2="120" y2="10" class="stick-figure"/>
      <!-- Legs animated -->
      <g class="animate-crunch" style="transform-origin: 100px 90px; animation-duration: 2.5s;">
        <line x1="100" y1="90" x2="90" y2="140" class="stick-figure"/>
        <line x1="100" y1="90" x2="110" y2="140" class="stick-figure"/>
      </g>
    </svg>`,

  // Russian Twist
  russianTwist: `
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="115" x2="200" y2="115" class="ground"/>
      <!-- Person sitting -->
      <circle cx="100" cy="35" r="10" class="stick-head"/>
      <!-- Torso (leaning back) -->
      <line x1="100" y1="45" x2="80" y2="85" class="stick-figure"/>
      <!-- Legs raised -->
      <line x1="80" y1="85" x2="40" y2="70" class="stick-figure"/>
      <line x1="40" y1="70" x2="25" y2="90" class="stick-figure"/>
      <!-- Arms with weight, rotating -->
      <g style="animation: russianTwistArms 1.5s ease-in-out infinite;">
        <line x1="95" y1="55" x2="130" y2="65" class="stick-figure"/>
        <line x1="95" y1="55" x2="120" y2="75" class="stick-figure"/>
        <circle cx="125" cy="70" r="8" class="equipment-fill"/>
      </g>
      <style>
        @keyframes russianTwistArms {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
        }
      </style>
    </svg>`,

  // Mountain Climber
  mountainClimber: `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="95" x2="200" y2="95" class="ground"/>
      <!-- Head -->
      <circle cx="160" cy="30" r="10" class="stick-head"/>
      <!-- Body -->
      <line x1="155" y1="38" x2="80" y2="55" class="stick-figure"/>
      <!-- Arms -->
      <line x1="145" y1="42" x2="155" y2="80" class="stick-figure"/>
      <line x1="135" y1="44" x2="140" y2="80" class="stick-figure"/>
      <!-- Legs alternating -->
      <g style="animation: mountainClimberLegs 0.8s ease-in-out infinite;">
        <line x1="80" y1="55" x2="120" y2="50" class="stick-figure"/>
        <line x1="80" y1="55" x2="50" y2="80" class="stick-figure"/>
      </g>
      <style>
        @keyframes mountainClimberLegs {
          0%, 100% { 
            d: path("M 80,55 L 120,50 M 80,55 L 50,80"); 
          }
          50% { 
            d: path("M 80,55 L 50,80 M 80,55 L 120,50"); 
          }
        }
      </style>
    </svg>`,

  // Ab Wheel Rollout
  abRollout: `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="95" x2="200" y2="95" class="ground"/>
      <g class="animate-deadlift" style="transform-origin: 60px 85px; animation-duration: 3s;">
        <!-- Wheel -->
        <circle cx="130" cy="85" r="12" class="equipment-fill"/>
        <circle cx="130" cy="85" r="6" fill="var(--bg-card)"/>
        <!-- Arms to wheel -->
        <line x1="80" y1="50" x2="130" y2="82" class="stick-figure"/>
        <!-- Body -->
        <circle cx="65" cy="35" r="10" class="stick-head"/>
        <line x1="70" y1="43" x2="80" y2="55" class="stick-figure"/>
        <line x1="80" y1="55" x2="60" y2="75" class="stick-figure"/>
        <!-- Knees on ground -->
        <line x1="60" y1="75" x2="45" y2="85" class="stick-figure"/>
      </g>
    </svg>`,

  // Face Pull
  facePull: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <!-- Cable machine -->
      <rect x="10" y="20" width="25" height="120" class="equipment-fill"/>
      <circle cx="22" cy="50" r="5" fill="var(--bg-card)"/>
      <!-- Cable -->
      <line x1="22" y1="50" x2="70" y2="55" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,2"/>
      <!-- Person -->
      <circle cx="120" cy="45" r="10" class="stick-head"/>
      <line x1="120" y1="55" x2="120" y2="100" class="stick-figure"/>
      <line x1="120" y1="100" x2="105" y2="150" class="stick-figure"/>
      <line x1="120" y1="100" x2="135" y2="150" class="stick-figure"/>
      <!-- Arms pulling -->
      <g class="animate-row">
        <line x1="120" y1="60" x2="70" y2="55" class="stick-figure"/>
        <line x1="120" y1="60" x2="80" y2="50" class="stick-figure"/>
      </g>
    </svg>`,

  // Shrug
  shrug: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <g class="animate-press" style="animation-duration: 1.2s;">
        <!-- Person -->
        <circle cx="100" cy="35" r="10" class="stick-head"/>
        <!-- Shoulders animated up -->
        <line x1="100" y1="42" x2="100" y2="90" class="stick-figure"/>
        <line x1="100" y1="90" x2="85" y2="150" class="stick-figure"/>
        <line x1="100" y1="90" x2="115" y2="150" class="stick-figure"/>
        <!-- Arms down holding dumbbells -->
        <line x1="100" y1="50" x2="65" y2="110" class="stick-figure"/>
        <line x1="100" y1="50" x2="135" y2="110" class="stick-figure"/>
        <rect x="55" y="105" width="20" height="12" rx="3" class="equipment-fill"/>
        <rect x="125" y="105" width="20" height="12" rx="3" class="equipment-fill"/>
      </g>
    </svg>`,

  // Default/Generic
  generic: `
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="155" x2="200" y2="155" class="ground"/>
      <g class="animate-plank">
        <circle cx="100" cy="40" r="12" class="stick-head"/>
        <line x1="100" y1="52" x2="100" y2="100" class="stick-figure"/>
        <line x1="100" y1="65" x2="70" y2="90" class="stick-figure"/>
        <line x1="100" y1="65" x2="130" y2="90" class="stick-figure"/>
        <line x1="100" y1="100" x2="80" y2="150" class="stick-figure"/>
        <line x1="100" y1="100" x2="120" y2="150" class="stick-figure"/>
      </g>
    </svg>`
};

// Map exercise names to animations
const exerciseAnimationMap = {
  // Chest
  'barbell bench press': 'benchPress',
  'incline bench press': 'inclinePress',
  'decline bench press': 'benchPress',
  'dumbbell bench press': 'inclinePress',
  'dumbbell flyes': 'dumbellFly',
  'cable flyes': 'cableFly',
  'push-ups': 'pushUp',
  'chest dips': 'chestDip',
  'machine chest press': 'benchPress',
  'pec deck machine': 'cableFly',
  
  // Back
  'conventional deadlift': 'deadlift',
  'pull-ups': 'pullUp',
  'chin-ups': 'pullUp',
  'barbell bent-over row': 'barbellRow',
  'single-arm dumbbell row': 'barbellRow',
  'lat pulldown': 'latPulldown',
  'seated cable row': 'barbellRow',
  't-bar row': 'barbellRow',
  'face pulls': 'facePull',
  'straight-arm pulldown': 'latPulldown',
  'rack pulls': 'deadlift',
  'back extensions (hyperextensions)': 'deadlift',
  
  // Shoulders
  'barbell overhead press': 'overheadPress',
  'dumbbell shoulder press': 'overheadPress',
  'arnold press': 'overheadPress',
  'dumbbell lateral raises': 'lateralRaise',
  'front raises': 'lateralRaise',
  'rear delt flyes': 'lateralRaise',
  'cable lateral raises': 'lateralRaise',
  'upright rows': 'barbellRow',
  'barbell/dumbbell shrugs': 'shrug',
  
  // Legs
  'barbell back squat': 'squat',
  'front squat': 'squat',
  'romanian deadlift': 'deadlift',
  'leg press': 'legExtension',
  'hack squat': 'squat',
  'walking lunges': 'lunge',
  'bulgarian split squat': 'lunge',
  'leg extension': 'legExtension',
  'lying leg curl': 'legCurl',
  'barbell hip thrust': 'hipThrust',
  'standing calf raises': 'calfRaise',
  'seated calf raises': 'calfRaise',
  
  // Arms
  'barbell bicep curl': 'bicepCurl',
  'alternating dumbbell curl': 'bicepCurl',
  'hammer curls': 'bicepCurl',
  'preacher curl': 'bicepCurl',
  'cable bicep curl': 'bicepCurl',
  'incline dumbbell curl': 'bicepCurl',
  'close-grip bench press': 'benchPress',
  'tricep rope pushdowns': 'tricepPushdown',
  'skull crushers (lying tricep ext.)': 'benchPress',
  'overhead tricep extension': 'overheadPress',
  'tricep dips': 'chestDip',
  'wrist curls': 'bicepCurl',
  
  // Core
  'plank': 'plank',
  'crunches': 'crunch',
  'hanging leg raises': 'hangingLegRaise',
  'russian twists': 'russianTwist',
  'cable woodchops': 'russianTwist',
  'dead bug': 'crunch',
  'ab wheel rollout': 'abRollout',
  'mountain climbers': 'mountainClimber',
  'bicycle crunches': 'crunch',
  'pallof press': 'facePull',
  'reverse crunch': 'crunch',
  'side plank': 'plank'
};

// Get animation for an exercise
function getExerciseAnimation(exerciseName) {
  const name = exerciseName.toLowerCase().trim();
  const animKey = exerciseAnimationMap[name] || 'generic';
  return ExerciseAnimations[animKey] || ExerciseAnimations.generic;
}

// Export for use
window.ExerciseAnimations = ExerciseAnimations;
window.getExerciseAnimation = getExerciseAnimation;
