/*
  scene.js — Moonlit Mess
  Pure CSS scene rendered at infinite resolution.
  No photos. No canvas. No pixelation possible.

  Responsibilities:
  1. Calculate real lunar phase
  2. Apply phase shadow to moon via inline SVG clip
  3. Randomise water ripple timings
  4. Spawn rare shooting stars
*/

function getLunarPhase() {
  const JD    = Date.now() / 86400000 + 2440587.5;
  const CYCLE = 29.53058770576;
  return ((JD - 2451550.1) % CYCLE + CYCLE) % CYCLE / CYCLE;
}

(function init() {
  const phase = getLunarPhase();
  applyPhaseShadow(phase);

  /* Randomise ripple timings so water feels organic */
  [
    ['r1', 130 + Math.random()*40,  '24%', (7.5 + Math.random()*3).toFixed(1)+'s', '0s'   ],
    ['r2', 200 + Math.random()*55,  '50%', (11  + Math.random()*3).toFixed(1)+'s', '2.1s' ],
    ['r3', 290 + Math.random()*65,  '74%', (9   + Math.random()*3).toFixed(1)+'s', '4.0s' ],
  ].forEach(([id, w, top, dur, delay]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.width             = w + 'px';
    el.style.top               = top;
    el.style.animationDuration = dur;
    el.style.animationDelay    = delay;
  });

  setTimeout(spawnShooter, 9000 + Math.random() * 9000);
})();

function applyPhaseShadow(phase) {
  const moon   = document.getElementById('moon-body');
  const shadow = document.getElementById('moon-shadow');
  if (!moon || !shadow) return;

  if (phase > 0.46 && phase < 0.54) return; /* full moon */

  if (phase < 0.03 || phase > 0.97) {
    shadow.style.cssText = 'position:absolute;inset:0;border-radius:50%;background:rgba(3,2,8,0.90);';
    return;
  }

  const R      = (moon.offsetWidth  || 80) / 2;
  const S      = R * 2;
  const waxing = phase < 0.5;
  const t      = waxing ? phase * 2 : (phase - 0.5) * 2;
  const ex     = Math.max(R * Math.abs(1 - t * 2), 1);
  const A      = 'rgba(3,2,8,0.86)';
  let inner    = '';

  if (waxing) {
    inner = `<rect x="0" y="0" width="${R}" height="${S}" fill="${A}"/>`;
    if (t < 0.5) inner += `<ellipse cx="${R}" cy="${R}" rx="${ex}" ry="${R}" fill="${A}"/>`;
    else         inner += `<ellipse cx="${R}" cy="${R}" rx="${ex}" ry="${R}" fill="black" style="mix-blend-mode:destination-out"/>`;
  } else {
    inner = `<rect x="${R}" y="0" width="${R+1}" height="${S}" fill="${A}"/>`;
    if (t < 0.5) inner += `<ellipse cx="${R}" cy="${R}" rx="${ex}" ry="${R}" fill="${A}"/>`;
    else         inner += `<ellipse cx="${R}" cy="${R}" rx="${ex}" ry="${R}" fill="black" style="mix-blend-mode:destination-out"/>`;
  }

  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">` +
    `<clipPath id="mc"><circle cx="${R}" cy="${R}" r="${R}"/></clipPath>` +
    `<g clip-path="url(#mc)">${inner}</g></svg>`
  );

  shadow.style.cssText = `
    position:absolute;inset:0;border-radius:50%;
    background-image:url("data:image/svg+xml;charset=utf-8,${svg}");
    background-size:100% 100%;background-repeat:no-repeat;
  `;
}

let shooterActive = false;
function spawnShooter() {
  if (shooterActive) { setTimeout(spawnShooter, 5000); return; }
  shooterActive = true;
  const el  = document.createElement('div');
  el.className = 'mm-shooter';
  const vw = window.innerWidth, vh = window.innerHeight;
  const sx = vw * (0.06 + Math.random() * 0.55);
  const sy = vh * (0.04 + Math.random() * 0.30);
  const ang = 14 + Math.random() * 20;
  const len = 55 + Math.random() * 90;
  const dur = (0.75 + Math.random() * 0.60).toFixed(2);
  el.style.left  = sx  + 'px';
  el.style.top   = sy  + 'px';
  el.style.width = len + 'px';
  el.style.setProperty('--a', ang + 'deg');
  el.style.setProperty('--l', len + 'px');
  el.style.setProperty('--d', dur + 's');
  const c = document.getElementById('shooters');
  if (c) c.appendChild(el);
  setTimeout(() => { el.remove(); shooterActive = false; }, (parseFloat(dur) + 0.5) * 1000);
  setTimeout(spawnShooter, 15000 + Math.random() * 15000);
}
