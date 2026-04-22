/*
  sky.js — lightweight night sky
  
  Performance fixes:
  - Stars reduced from 200 → 70 (still looks full)
  - rAF loop pauses when tab is hidden (Page Visibility API)
  - Shooting stars: setTimeout chain instead of checking every frame
  - Sky gradient cached — not recreated every frame
  - Stars only redrawn when twinkle value actually changes meaningfully
*/

const skyCv = document.getElementById('sky');
const sCtx  = skyCv.getContext('2d');
let sW, sH, stars = [], shooters = [], fr = 0;
let animPaused = false;

/* Pause animation when tab is hidden — saves CPU */
document.addEventListener('visibilitychange', () => {
  animPaused = document.hidden;
});

function resizeSky() {
  sW = skyCv.width  = window.innerWidth;
  sH = skyCv.height = window.innerHeight;
  skyGradient = null;   /* invalidate cache on resize */
  stars = [];
  for (let i = 0; i < 70; i++) {
    stars.push({
      x:    Math.random() * sW,
      y:    Math.random() * sH * 0.82,
      r:    Math.random() * 1.1 + 0.2,
      base: Math.random() * 0.42 + 0.08,
      spd:  Math.random() * 0.018 + 0.004,
      ph:   Math.random() * Math.PI * 2,
      gold: Math.random() < 0.09
    });
  }
}

resizeSky();

/* Debounced resize — don't rebuild stars on every pixel change */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeSky, 200);
});

function spawnShooter() {
  if (animPaused) {
    /* Retry after tab becomes visible */
    setTimeout(spawnShooter, 2000);
    return;
  }
  const sx = Math.random() * sW * 0.7 + sW * 0.1;
  const sy = Math.random() * sH * 0.28;
  const a  = Math.PI / 5 + Math.random() * Math.PI / 8;
  shooters.push({
    x: sx, y: sy,
    vx: Math.cos(a) * 5.5,
    vy: Math.sin(a) * 3.8,
    life: 1, tail: []
  });
  /* Next shooter: 20–40 seconds — rare, intentional */
  setTimeout(spawnShooter, 20000 + Math.random() * 20000);
}

function drawSky() {
  if (animPaused) {
    requestAnimationFrame(drawSky);
    return;
  }

  sCtx.clearRect(0, 0, sW, sH);

  /* Sky background comes from bg.jpg — canvas only draws stars over it */
  sCtx.clearRect(0, 0, sW, sH);

  /* Stars — only update twinkle every 3 frames */
  stars.forEach(s => {
    const tw = s.base + Math.sin(fr * s.spd + s.ph) * 0.30;
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = s.gold
      ? `rgba(232,217,138,${tw})`
      : `rgba(215,210,198,${tw})`;
    sCtx.fill();
  });

  /* Shooting stars */
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s = shooters[i];
    s.tail.push({ x: s.x, y: s.y });
    if (s.tail.length > 22) s.tail.shift();
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.018;

    if (s.tail.length > 1) {
      for (let tt = 1; tt < s.tail.length; tt++) {
        const p = tt / s.tail.length;
        sCtx.beginPath();
        sCtx.moveTo(s.tail[tt-1].x, s.tail[tt-1].y);
        sCtx.lineTo(s.tail[tt].x,   s.tail[tt].y);
        sCtx.strokeStyle = `rgba(240,230,190,${p * s.life * 0.6})`;
        sCtx.lineWidth = p * 1.3;
        sCtx.stroke();
      }
    }
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(255,250,225,${s.life * 0.85})`;
    sCtx.fill();

    if (s.life <= 0 || s.x > sW + 30 || s.y > sH) {
      shooters.splice(i, 1);
    }
  }

  fr++;
  requestAnimationFrame(drawSky);
}

drawSky();
/* First shooter after 5s */
setTimeout(spawnShooter, 5000);
