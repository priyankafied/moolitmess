function runLantern() {
  const cv = document.getElementById('lc');
  const c = cv.getContext('2d');
  cv.width = cv.offsetWidth || 420;
  cv.height = 340;
  const W = cv.width, H = cv.height, cx = W / 2;
  let t = 0, done = false;
  const dur = 380;

  const sparks = [];
  for (let i = 0; i < 55; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 1.1 + 0.3;
    sparks.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: H * 0.72,
      vx: Math.cos(angle) * spd * 0.9,
      vy: -(Math.random() * 2.2 + 0.8),
      life: 1,
      maxLife: Math.random() * 0.5 + 0.5,
      r: Math.random() * 2.8 + 0.6,
      gold: Math.random() < 0.65,
      delay: Math.floor(Math.random() * 80),
      drift: Math.random() * 0.04 - 0.02
    });
  }

  const glowRings = [];
  for (let i = 0; i < 4; i++) {
    glowRings.push({ r: 10 + i * 22, opacity: 0, phase: i * 0.4 });
  }

  function drawFrame() {
    c.clearRect(0, 0, W, H);
    const progress = Math.min(t / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 2.2);

    const lanternY = H * 0.72 - eased * (H * 0.82);
    const lanternOpacity = Math.max(0, 1 - Math.pow(progress, 1.2) * 1.1);
    const lanternScale = 1 + progress * 0.5;
    const aura = Math.max(0, 0.85 - progress * 0.9);

    if (aura > 0) {
      const grd = c.createRadialGradient(cx, lanternY, 0, cx, lanternY, 80 + progress * 60);
      grd.addColorStop(0, `rgba(255,230,120,${aura * 0.18})`);
      grd.addColorStop(0.4, `rgba(255,210,80,${aura * 0.08})`);
      grd.addColorStop(1, 'rgba(255,200,60,0)');
      c.beginPath();
      c.arc(cx, lanternY, 80 + progress * 60, 0, Math.PI * 2);
      c.fillStyle = grd;
      c.fill();
    }

    glowRings.forEach((ring, ri) => {
      ring.opacity = Math.max(0, aura * (0.4 - ri * 0.06) * Math.sin(t * 0.04 + ring.phase));
      c.beginPath();
      c.arc(cx, lanternY, ring.r + t * 0.18, 0, Math.PI * 2);
      c.strokeStyle = `rgba(255,220,100,${ring.opacity})`;
      c.lineWidth = 0.7;
      c.stroke();
    });

    if (lanternOpacity > 0.01) {
      c.save();
      c.globalAlpha = lanternOpacity;
      c.translate(cx, lanternY);
      c.scale(lanternScale, lanternScale);

      const bodyGrad = c.createRadialGradient(0, -4, 2, 0, 0, 18);
      bodyGrad.addColorStop(0, 'rgba(255,248,190,0.98)');
      bodyGrad.addColorStop(0.5, 'rgba(255,215,90,0.92)');
      bodyGrad.addColorStop(1, 'rgba(220,160,40,0.7)');
      c.beginPath();
      c.ellipse(0, 0, 15, 22, 0, 0, Math.PI * 2);
      c.fillStyle = bodyGrad;
      c.fill();

      const innerGlow = c.createRadialGradient(0, -3, 1, 0, -3, 10);
      innerGlow.addColorStop(0, 'rgba(255,255,220,0.9)');
      innerGlow.addColorStop(1, 'rgba(255,230,120,0)');
      c.beginPath();
      c.ellipse(0, -3, 9, 13, 0, 0, Math.PI * 2);
      c.fillStyle = innerGlow;
      c.fill();

      c.beginPath();
      c.moveTo(-8, 20); c.lineTo(-5, 30);
      c.moveTo(0, 22);  c.lineTo(0, 32);
      c.moveTo(8, 20);  c.lineTo(5, 30);
      c.strokeStyle = 'rgba(200,155,50,0.45)';
      c.lineWidth = 1.2;
      c.stroke();

      c.beginPath();
      c.moveTo(-15, -22); c.lineTo(15, -22);
      c.strokeStyle = 'rgba(200,155,50,0.4)';
      c.lineWidth = 1;
      c.stroke();

      c.beginPath();
      c.moveTo(-6, -22); c.lineTo(-6, -30);
      c.moveTo(6, -22);  c.lineTo(6, -30);
      c.moveTo(-6, -30); c.lineTo(6, -30);
      c.strokeStyle = 'rgba(200,155,50,0.35)';
      c.lineWidth = 1;
      c.stroke();

      c.restore();
    }

    sparks.forEach(sp => {
      if (t < sp.delay) return;
      const age = t - sp.delay;
      sp.x += sp.vx + Math.sin(age * 0.05 + sp.drift * 100) * 0.3;
      sp.y += sp.vy - progress * 0.5;
      sp.vx *= 0.992;
      sp.vy *= 0.994;
      sp.life -= (0.008 + progress * 0.004) / sp.maxLife;
      if (sp.life <= 0) return;
      const alpha = sp.life * (sp.life > 0.3 ? 1 : sp.life / 0.3);
      c.beginPath();
      c.arc(sp.x, sp.y, sp.r * Math.min(sp.life * 2, 1), 0, Math.PI * 2);
      c.fillStyle = sp.gold
        ? `rgba(255,218,100,${alpha * 0.8})`
        : `rgba(235,225,190,${alpha * 0.5})`;
      c.fill();
      if (sp.r > 1.4 && sp.life > 0.4) {
        c.beginPath();
        c.arc(sp.x, sp.y, sp.r * 2.2 * Math.min(sp.life * 2, 1), 0, Math.PI * 2);
        c.fillStyle = sp.gold
          ? `rgba(255,200,80,${alpha * 0.12})`
          : `rgba(220,210,180,${alpha * 0.08})`;
        c.fill();
      }
    });

    if (progress > 0.55) {
      const fadeIn = Math.min((progress - 0.55) / 0.35, 1);
      const starBurst = Math.floor(fadeIn * 28);
      for (let i = 0; i < starBurst; i++) {
        const ang = (i / 28) * Math.PI * 2 + t * 0.003;
        const dist = 40 + fadeIn * 90 + Math.sin(t * 0.02 + i) * 0.8;
        const sx = cx + Math.cos(ang) * dist;
        const sy = H * 0.18 + Math.sin(ang) * dist * 0.38;
        c.beginPath();
        c.arc(sx, sy, Math.random() * 0.9 + 0.2, 0, Math.PI * 2);
        c.fillStyle = `rgba(240,228,170,${fadeIn * 0.45 * Math.random()})`;
        c.fill();
      }

      const cosmicGrad = c.createRadialGradient(cx, H * 0.18, 0, cx, H * 0.18, 100 + fadeIn * 80);
      cosmicGrad.addColorStop(0, `rgba(220,200,120,${fadeIn * 0.07})`);
      cosmicGrad.addColorStop(0.6, `rgba(180,160,220,${fadeIn * 0.04})`);
      cosmicGrad.addColorStop(1, 'rgba(100,80,180,0)');
      c.beginPath();
      c.arc(cx, H * 0.18, 100 + fadeIn * 80, 0, Math.PI * 2);
      c.fillStyle = cosmicGrad;
      c.fill();
    }

    t++;
    if (t < dur + 40 && !done) {
      requestAnimationFrame(drawFrame);
    } else if (!done) {
      done = true;
      setTimeout(() => goTo('s-closure'), 900);
    }
  }

  drawFrame();
}
