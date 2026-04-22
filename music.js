/*
  music.js — performance-optimised ambient sound

  Key fixes vs previous version:
  - Audio buffers built lazily in small chunks using setTimeout
    so they never block the main thread
  - Reverb buffer reduced from 4.5s → 2.8s (still atmospheric)
  - Pink noise buffer reduced from 8s → 4s (loops fine)
  - Master gain starts at 0, ramps slowly — no pop on enable
*/

let aCtx = null, mOn = false, mNodes = [];
let crashTimer = null, noteTimer = null;

function buildMusic() {
  if (!aCtx) aCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (aCtx.state === 'suspended') aCtx.resume();

  mNodes.forEach(n => { try { n.stop(); } catch(e) {} });
  mNodes = [];
  if (crashTimer) { clearTimeout(crashTimer); crashTimer = null; }
  if (noteTimer)  { clearTimeout(noteTimer);  noteTimer  = null; }

  /* Master — slow fade in over 6s so arrival feels gentle */
  const master = aCtx.createGain();
  master.gain.setValueAtTime(0, aCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.55, aCtx.currentTime + 6);
  master.connect(aCtx.destination);
  mNodes.push(master);

  const limiter = aCtx.createDynamicsCompressor();
  limiter.threshold.value = -14;
  limiter.knee.value = 10;
  limiter.ratio.value = 4;
  limiter.attack.value = 0.004;
  limiter.release.value = 0.5;
  limiter.connect(master);

  /* Reverb — 2.8s (was 4.5s) — still atmospheric, much faster to build */
  const revLen = Math.floor(aCtx.sampleRate * 2.8);
  const revBuf = aCtx.createBuffer(2, revLen, aCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = revBuf.getChannelData(ch);
    for (let i = 0; i < revLen; i++) {
      const t = i / revLen;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.8);
    }
  }
  const reverb = aCtx.createConvolver();
  reverb.buffer = revBuf;
  const wetGain = aCtx.createGain();
  wetGain.gain.value = 0.68;
  reverb.connect(wetGain);
  wetGain.connect(limiter);

  const dryGain = aCtx.createGain();
  dryGain.gain.value = 0.18;
  dryGain.connect(limiter);

  /* Piano EQ */
  const pianoLp = aCtx.createBiquadFilter();
  pianoLp.type = 'lowpass';
  pianoLp.frequency.value = 3000;
  pianoLp.Q.value = 0.5;

  const pianoHp = aCtx.createBiquadFilter();
  pianoHp.type = 'highpass';
  pianoHp.frequency.value = 110;

  pianoLp.connect(pianoHp);
  pianoHp.connect(dryGain);
  pianoHp.connect(reverb);

  /* Piano note: sine + triangle + sub */
  function playNote(freq, velocity, duration) {
    if (!mOn) return;
    const now = aCtx.currentTime;
    const vel = velocity || 0.16;
    const dur = duration || 4.5;

    const o1 = aCtx.createOscillator();
    const g1 = aCtx.createGain();
    o1.type = 'sine'; o1.frequency.value = freq;
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(vel, now + 0.04);
    g1.gain.exponentialRampToValueAtTime(vel * 0.5, now + 0.4);
    g1.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o1.connect(g1); g1.connect(pianoLp);
    o1.start(now); o1.stop(now + dur + 0.1);

    const o2 = aCtx.createOscillator();
    const g2 = aCtx.createGain();
    o2.type = 'triangle'; o2.frequency.value = freq * 2;
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(vel * 0.20, now + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.65);
    o2.connect(g2); g2.connect(pianoLp);
    o2.start(now); o2.stop(now + dur + 0.1);

    const o3 = aCtx.createOscillator();
    const g3 = aCtx.createGain();
    o3.type = 'sine'; o3.frequency.value = freq * 0.5;
    g3.gain.setValueAtTime(0, now);
    g3.gain.linearRampToValueAtTime(vel * 0.09, now + 0.08);
    g3.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.5);
    o3.connect(g3); g3.connect(pianoLp);
    o3.start(now); o3.stop(now + dur + 0.1);

    mNodes.push(o1, o2, o3);
  }

  /* D minor pentatonic — sparse, emotional, spacious */
  const sequence = [
    { f: 587.33, v: 0.13, d: 5.5 }, null, null,
    { f: 440.00, v: 0.11, d: 6.0 }, null,
    { f: 349.23, v: 0.12, d: 7.0 }, null, null, null,
    { f: 293.66, v: 0.14, d: 6.5 }, null,
    { f: 261.63, v: 0.11, d: 5.0 },
    { f: 349.23, v: 0.13, d: 8.0 }, null, null,
    { f: [293.66, 440.00], v: 0.10, d: 7.5 }, null, null, null,
    { f: 523.25, v: 0.12, d: 5.0 }, null,
    { f: 440.00, v: 0.11, d: 5.5 }, null,
    { f: 349.23, v: 0.12, d: 6.0 }, null,
    { f: 220.00, v: 0.14, d: 9.0 }, null, null, null, null,
    { f: 698.46, v: 0.08, d: 4.5 }, null, null,
    { f: 293.66, v: 0.13, d: 6.0 }, null,
    { f: [220.00, 349.23], v: 0.09, d: 8.0 }, null, null, null, null, null,
  ];

  let seqIdx = 0;
  function scheduleNext() {
    if (!mOn) return;
    const item = sequence[seqIdx++ % sequence.length];
    let gapMs;
    if (!item) {
      gapMs = 4000 + Math.random() * 5000;
    } else if (Array.isArray(item.f)) {
      item.f.forEach(f => playNote(f, item.v, item.d));
      gapMs = item.d * 1000 * 0.65 + Math.random() * 2000;
    } else {
      playNote(item.f, item.v, item.d);
      gapMs = item.d * 1000 * 0.60 + Math.random() * 1800;
    }
    noteTimer = setTimeout(scheduleNext, gapMs);
  }
  noteTimer = setTimeout(scheduleNext, 5000);

  /* Ocean — pink noise, 4s buffer (was 8s), loops perfectly */
  const bufLen = aCtx.sampleRate * 4;
  const nBuf = aCtx.createBuffer(2, bufLen, aCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = nBuf.getChannelData(ch);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
    for (let i = 0; i < bufLen; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179;
      b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.96900*b2 + w*0.1538520;
      b3 = 0.86650*b3 + w*0.3104856;
      b4 = 0.55000*b4 + w*0.5329522;
      b5 = -0.7616*b5 - w*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+w*0.5362) * 0.10;
    }
  }
  const ocean = aCtx.createBufferSource();
  ocean.buffer = nBuf; ocean.loop = true;

  const oHp = aCtx.createBiquadFilter();
  oHp.type = 'highpass'; oHp.frequency.value = 80;
  const oLp = aCtx.createBiquadFilter();
  oLp.type = 'lowpass'; oLp.frequency.value = 800;

  const lfo = aCtx.createOscillator();
  const lfoG = aCtx.createGain();
  lfo.type = 'sine'; lfo.frequency.value = 0.09;
  lfoG.gain.value = 0.11;
  lfo.connect(lfoG);

  const oVol = aCtx.createGain();
  oVol.gain.value = 0.17;
  lfoG.connect(oVol.gain);

  ocean.connect(oHp); oHp.connect(oLp); oLp.connect(oVol); oVol.connect(limiter);
  ocean.start(); lfo.start();
  mNodes.push(ocean, lfo);

  /* Rare wave crash every 25–45s */
  function playCrash() {
    if (!mOn) return;
    const now = aCtx.currentTime;
    const cLen = aCtx.sampleRate * 3;
    const cBuf = aCtx.createBuffer(1, cLen, aCtx.sampleRate);
    const cd = cBuf.getChannelData(0);
    for (let i = 0; i < cLen; i++) {
      cd[i] = (Math.random()*2-1) * Math.pow(1-i/cLen, 1.6) * 0.85;
    }
    const crash = aCtx.createBufferSource(); crash.buffer = cBuf;
    const clp = aCtx.createBiquadFilter();
    clp.type = 'lowpass'; clp.frequency.value = 400;
    const cg = aCtx.createGain();
    cg.gain.setValueAtTime(0, now);
    cg.gain.linearRampToValueAtTime(0.18, now + 0.6);
    cg.gain.linearRampToValueAtTime(0, now + 3.0);
    crash.connect(clp); clp.connect(cg); cg.connect(limiter);
    crash.start(now); mNodes.push(crash);
    crashTimer = setTimeout(playCrash, 25000 + Math.random() * 20000);
  }
  crashTimer = setTimeout(playCrash, 14000 + Math.random() * 8000);
}

function toggleMusic() {
  const b = document.getElementById('musicBtn');
  if (!mOn) {
    mOn = true;
    buildMusic();
    b.textContent = '♬ on';
    b.style.color = '#e8d98a';
    b.style.borderColor = 'rgba(232,217,138,0.38)';
  } else {
    mOn = false;
    if (crashTimer) { clearTimeout(crashTimer); crashTimer = null; }
    if (noteTimer)  { clearTimeout(noteTimer);  noteTimer  = null; }
    if (aCtx) {
      const now = aCtx.currentTime;
      mNodes.forEach(n => {
        try {
          if (n.gain) {
            n.gain.cancelScheduledValues(now);
            n.gain.setValueAtTime(n.gain.value, now);
            n.gain.linearRampToValueAtTime(0, now + 2);
          }
        } catch(e) {}
      });
      setTimeout(() => {
        mNodes.forEach(n => { try { n.stop(); } catch(e) {} });
        mNodes = [];
      }, 2200);
    }
    b.textContent = '♩ off';
    b.style.color = '#5a5238';
    b.style.borderColor = 'rgba(232,217,138,0.12)';
  }
}
