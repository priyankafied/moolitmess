const skyCv = document.getElementById('sky');
const sCtx = skyCv.getContext('2d');
let sW, sH, stars = [], shooters = [], fr = 0;

function resizeSky() {
  sW = skyCv.width = window.innerWidth;
  sH = skyCv.height = document.getElementById('app').offsetHeight || window.innerHeight;
  stars = [];
  for (let i = 0; i < 175; i++) {
    stars.push({
      x: Math.random() * sW,
      y: Math.random() * sH * 0.75,
      r: Math.random() * 1.1 + 0.22,
      base: Math.random() * 0.45 + 0.08,
      spd: Math.random() * 0.022 + 0.005,
      ph: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.09
    });
  }
}

resizeSky();
window.addEventListener('resize', resizeSky);

function spawnShooter() {
  const sx = Math.random() * sW * 0.65 + sW * 0.1;
  const sy = Math.random() * sH * 0.28;
  const a  = Math.PI / 5 + Math.random() * Math.PI / 8;
  shooters.push({ x: sx, y: sy, vx: Math.cos(a) * 5, vy: Math.sin(a) * 3.5, life: 1, tail: [] });
}

function drawSky() {
  sCtx.clearRect(0, 0, sW, sH);
  const g = sCtx.createLinearGradient(0, 0, 0, sH);
  g.addColorStop(0,   '#05071a');
  g.addColorStop(0.6, '#06081e');
  g.addColorStop(1,   '#090c24');
  sCtx.fillStyle = g;
  sCtx.fillRect(0, 0, sW, sH);

  stars.forEach(s => {
    const tw = s.base + Math.sin(fr * s.spd + s.ph) * 0.32;
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = s.gold
      ? `rgba(232,217,138,${tw})`
      : `rgba(215,210,195,${tw})`;
    sCtx.fill();
  });

  shooters.forEach((s, i) => {
    s.tail.push({ x: s.x, y: s.y });
    if (s.tail.length > 22) s.tail.shift();
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.018;

    if (s.tail.length > 1) {
      for (let tt = 1; tt < s.tail.length; tt++) {
        const p = tt / s.tail.length;
        sCtx.beginPath();
        sCtx.moveTo(s.tail[tt - 1].x, s.tail[tt - 1].y);
        sCtx.lineTo(s.tail[tt].x, s.tail[tt].y);
        sCtx.strokeStyle = `rgba(240,228,185,${p * s.life * 0.6})`;
        sCtx.lineWidth = p * 1.3;
        sCtx.stroke();
      }
    }

    sCtx.beginPath();
    sCtx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(255,248,220,${s.life * 0.9})`;
    sCtx.fill();

    if (s.life <= 0 || s.x > sW + 20 || s.y > sH) shooters.splice(i, 1);
  });

  fr++;
  if (fr % 300 === 0 && Math.random() < 0.75) spawnShooter();
  requestAnimationFrame(drawSky);
}

drawSky();
setTimeout(spawnShooter, 1800);
