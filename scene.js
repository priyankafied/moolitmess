/*
  scene.js — the image is the scene.
  This file only handles one thing:
  optional rare shooting stars as DOM elements.
  No lunar phase. No ripples. No layers.
*/
(function(){
  // First shooting star: 20–40s after load (rare, unhurried)
  setTimeout(spawnShooter, 20000 + Math.random() * 20000);
})();

let active = false;
function spawnShooter() {
  if (active) { setTimeout(spawnShooter, 5000); return; }
  active = true;
  const el  = document.createElement('div');
  el.className = 'mm-shooter';
  const vw = window.innerWidth, vh = window.innerHeight;
  // Constrain to upper-sky area only (top 35%)
  const sx  = vw * (0.08 + Math.random() * 0.50);
  const sy  = vh * (0.04 + Math.random() * 0.28);
  const ang = 14 + Math.random() * 18;
  const len = 52 + Math.random() * 78;
  const dur = (0.70 + Math.random() * 0.50).toFixed(2);
  el.style.left  = sx  + 'px';
  el.style.top   = sy  + 'px';
  el.style.width = len + 'px';
  el.style.setProperty('--a', ang + 'deg');
  el.style.setProperty('--l', len + 'px');
  el.style.setProperty('--d', dur + 's');
  const c = document.getElementById('shooters');
  if (c) c.appendChild(el);
  else document.body.appendChild(el);
  setTimeout(() => { el.remove(); active = false; }, (parseFloat(dur) + 0.5) * 1000);
  // Next: 18–36 seconds
  setTimeout(spawnShooter, 18000 + Math.random() * 18000);
}
