const skyCv = document.getElementById('sky');
const sCtx = skyCv.getContext('2d');
let sW, sH, stars = [], shooters = [], fr = 0;

function resizeSky() {
  sW = skyCv.width  = window.innerWidth;
  sH = skyCv.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:    Math.random() * sW,
      y:    Math.random() * sH * 0.85,
      r:    Math.random() * 1.2 + 0.2,
      base: Math.random() * 0.45 + 0.08,
      spd:  Math.random() * 0.02  + 0.004,
      ph:   Math.random() * Math.PI * 2,
      gold: Math.random() < 0.09
    });
  }
}

resizeSky();
window.addEventListener('resize', resizeSky);

function spawnShooter() {
  const sx = Math.random() * sW * 0.7 + sW * 0.1;
  const sy = Math.random() * sH * 0.3;
  const a  = Math.PI / 5 + Math.random() * Math.PI / 8;
  shooters.push({
    x: sx, y: sy,
    vx: Math.cos(a) * 5.5,
    vy: Math.sin(a) * 3.8,
    life: 1, tail: []
  });
}

function drawSky() {
  sCtx.clearRect(0, 0, sW, sH);

  /* Sky gradient */
  const g = sCtx.createLinearGradient(0, 0, 0, sH);
  g.addColorStop(0,   '#04061a');
  g.addColorStop(0.5, '#05071e');
  g.addColorStop(1,   '#080b26');
  sCtx.fillStyle = g;
  sCtx.fillRect(0, 0, sW, sH);

  /* Stars */
  stars.forEach(s => {
    const tw = s.base + Math.sin(fr * s.spd + s.ph) * 0.32;
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = s.gold
      ? `rgba(232,217,138,${tw})`
      : `rgba(215,210,198,${tw})`;
    sCtx.fill();
  });

  /* Shooting stars */
  shooters.forEach((s, i) => {
    s.tail.push({ x: s.x, y: s.y });
    if (s.tail.length > 26) s.tail.shift();
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.016;

    if (s.tail.length > 1) {
      for (let tt = 1; tt < s.tail.length; tt++) {
        const p = tt / s.tail.length;
        sCtx.beginPath();
        sCtx.moveTo(s.tail[tt - 1].x, s.tail[tt - 1].y);
        sCtx.lineTo(s.tail[tt].x, s.tail[tt].y);
        sCtx.strokeStyle = `rgba(240,230,190,${p * s.life * 0.65})`;
        sCtx.lineWidth = p * 1.4;
        sCtx.stroke();
      }
    }

    sCtx.beginPath();
    sCtx.arc(s.x, s.y, 1.3, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(255,250,225,${s.life * 0.9})`;
    sCtx.fill();

    if (s.life <= 0 || s.x > sW + 30 || s.y > sH) {
      shooters.splice(i, 1);
    }
  });

  fr++;
  if (fr % 280 === 0 && Math.random() < 0.78) spawnShooter();
  requestAnimationFrame(drawSky);
}

drawSky();
setTimeout(spawnShooter, 1600);
