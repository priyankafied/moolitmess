/*
  scene.js — Moonlit Mess background
  Pure CSS + minimal JS. No canvas. No rAF loop. No particles.

  What this does:
  1. Calculates real lunar phase from today's date
  2. Applies phase shadow to moon via SVG data URI (no canvas needed)
  3. Spawns occasional shooting stars as DOM elements + CSS animation
  4. Sets ripple widths and animation timings
  That is all. The rest is CSS.
*/

/* ── Lunar phase ─────────────────────────────── */
function getLunarPhase() {
  const JD    = Date.now() / 86400000 + 2440587.5;
  const CYCLE = 29.53058770576;
  return ((JD - 2451550.1) % CYCLE + CYCLE) % CYCLE / CYCLE;
}

(function init() {
  const phase = getLunarPhase();

  /* Apply phase shadow to moon */
  applyPhaseShadow(phase);

  /* Set ripple sizes (vary per session for organic feel) */
  const rippleSizes = [
    [160 + Math.random()*40, '26%', (7.5+Math.random()*2).toFixed(1)+'s', '0s'],
    [230 + Math.random()*50, '54%', (10+Math.random()*3).toFixed(1)+'s',  '1.8s'],
    [310 + Math.random()*60, '76%', (9+Math.random()*2.5).toFixed(1)+'s', '3.5s'],
  ];
  rippleSizes.forEach(([w, top, dur, delay], i) => {
    const el = document.getElementById('r' + (i+1));
    if (!el) return;
    el.style.width            = w + 'px';
    el.style.top              = top;
    el.style.animationDuration = dur;
    el.style.animationDelay   = delay;
  });

  /* Start shooting star cycle */
  setTimeout(spawnShooter, 6000 + Math.random() * 8000);
})();

/* ── Phase shadow ────────────────────────────── */
function applyPhaseShadow(phase) {
  const moon   = document.getElementById('moon');
  const shadow = document.getElementById('moon-shadow');
  if (!shadow || !moon) return;

  /* Full moon — no shadow */
  if (phase > 0.47 && phase < 0.53) return;
  /* New moon — fully dark */
  if (phase < 0.03 || phase > 0.97) {
    shadow.style.background = 'rgba(4,2,12,0.90)';
    shadow.style.borderRadius = '50%';
    return;
  }

  const R      = moon.offsetWidth / 2 || 39;
  const S      = R * 2;
  const waxing = phase < 0.5;
  const t      = waxing ? phase * 2 : (phase - 0.5) * 2;
  const ex     = Math.max(R * Math.abs(1 - t * 2), 0.5);

  let paths = '';
  if (waxing) {
    /* Dark left half */
    paths = `<rect x="0" y="0" width="${R}" height="${S}" fill="rgba(4,2,12,0.88)"/>`;
    if (t < 0.5) {
      /* New → first quarter: terminator ellipse on right side of shadow */
      paths += `<ellipse cx="${R}" cy="${R}" rx="${ex}" ry="${R}" fill="rgba(4,2,12,0.88)"/>`;
    }
    /* First quarter → full: shadow shrinks, no extra ellipse needed */
  } else {
    /* Dark right half */
    paths = `<rect x="${R}" y="0" width="${R+1}" height="${S}" fill="rgba(4,2,12,0.88)"/>`;
    if (t < 0.5) {
      paths += `<ellipse cx="${R}" cy="${R}" rx="${ex}" ry="${R}" fill="rgba(4,2,12,0.88)"/>`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">` +
    `<clipPath id="mc"><circle cx="${R}" cy="${R}" r="${R}"/></clipPath>` +
    `<g clip-path="url(#mc)">${paths}</g></svg>`;

  shadow.style.backgroundImage  = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
  shadow.style.backgroundSize   = '100% 100%';
  shadow.style.backgroundRepeat = 'no-repeat';
}

/* ── Shooting stars ──────────────────────────── */
let shooterActive = false;

function spawnShooter() {
  if (shooterActive) { setTimeout(spawnShooter, 4000); return; }
  shooterActive = true;

  const el  = document.createElement('div');
  el.className = 'mm-shooter';

  /* Position in upper sky only */
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;
  const sx  = vw  * (0.06 + Math.random() * 0.55);
  const sy  = vh  * (0.04 + Math.random() * 0.36);
  const ang = 12  + Math.random() * 20;
  const len = 62  + Math.random() * 100;
  const dur = (0.82 + Math.random() * 0.65).toFixed(2);

  el.style.left = sx + 'px';
  el.style.top  = sy + 'px';
  el.style.width = len + 'px';
  el.style.setProperty('--a',   ang + 'deg');
  el.style.setProperty('--l',   len + 'px');
  el.style.setProperty('--d',   dur + 's');

  document.getElementById('shooters').appendChild(el);

  const total = (parseFloat(dur) + 0.4) * 1000;
  setTimeout(() => {
    el.remove();
    shooterActive = false;
  }, total);

  /* Next: 15–30 seconds */
  setTimeout(spawnShooter, 15000 + Math.random() * 15000);
}
