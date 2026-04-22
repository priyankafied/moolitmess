let aCtx = null, mOn = false, mNodes = [], chordTimer = null;

/*
  Audio architecture:
  oscillators → individual gain (envelope) → chorus detune layer
             → reverb send (convolver) → wet gain
             → master compressor → master gain → destination
  + filtered vinyl noise → master

  This gives warmth, presence and space without harshness or clipping.
*/

function buildMusic() {
  if (!aCtx) aCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (aCtx.state === 'suspended') aCtx.resume();

  /* Clear any previous nodes */
  mNodes.forEach(n => { try { n.stop(); } catch (e) {} });
  mNodes = [];
  if (chordTimer) { clearTimeout(chordTimer); chordTimer = null; }

  /* ── Master dynamics ─────────────────────────────── */
  const comp = aCtx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value      = 12;
  comp.ratio.value     = 3;
  comp.attack.value    = 0.25;
  comp.release.value   = 0.6;
  comp.connect(aCtx.destination);

  const master = aCtx.createGain();
  master.gain.setValueAtTime(0, aCtx.currentTime);
  /* Cinematic fade-in over 4 seconds */
  master.gain.linearRampToValueAtTime(0.72, aCtx.currentTime + 4);
  master.connect(comp);
  mNodes.push(master);

  /* ── Reverb (simple convolution impulse) ─────────── */
  const reverbLen = aCtx.sampleRate * 3.2;
  const revBuf = aCtx.createBuffer(2, reverbLen, aCtx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = revBuf.getChannelData(ch);
    for (let i = 0; i < reverbLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.4);
    }
  }
  const reverb = aCtx.createConvolver();
  reverb.buffer = revBuf;
  const wetGain = aCtx.createGain();
  wetGain.gain.value = 0.38;
  reverb.connect(wetGain);
  wetGain.connect(master);

  /* ── Low-pass for warmth ─────────────────────────── */
  const lp = aCtx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1100;
  lp.Q.value = 0.7;

  /* Dry path: lp → master, also send to reverb */
  lp.connect(master);
  lp.connect(reverb);

  /* ── Chord sequences ─────────────────────────────── */
  /*
    Dm9 → Fmaj7 → Am9 → Gmaj7
    All in low register for body, not brightness.
  */
  const chords = [
    [146.83, 174.61, 220.00, 261.63, 311.13],  /* Dm9  */
    [174.61, 207.65, 261.63, 329.63, 392.00],  /* Fmaj7 */
    [220.00, 261.63, 329.63, 392.00, 440.00],  /* Am9  */
    [195.99, 246.94, 293.66, 369.99, 440.00],  /* Gmaj7 */
  ];
  let ci = 0;

  function playChord() {
    if (!mOn) return;
    const chord = chords[ci++ % chords.length];
    const now = aCtx.currentTime;
    const noteDur = 6.5;
    const gapBetween = 5.2;

    chord.forEach((freq, fi) => {
      /* Slight stagger per note for gentle arpeggiation */
      const stagger = fi * 0.07;

      /* Main oscillator */
      const o = aCtx.createOscillator();
      const g = aCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, now + stagger);
      g.gain.linearRampToValueAtTime(0.22, now + stagger + 1.8);
      g.gain.linearRampToValueAtTime(0.14, now + stagger + 3.5);
      g.gain.linearRampToValueAtTime(0,    now + stagger + noteDur);
      o.connect(g); g.connect(lp);
      o.start(now + stagger);
      o.stop(now + stagger + noteDur + 0.1);
      mNodes.push(o);

      /* Detuned chorus layer (triangle, -7 cents) for warmth */
      const o2 = aCtx.createOscillator();
      const g2 = aCtx.createGain();
      o2.type = 'triangle';
      o2.frequency.value = freq * Math.pow(2, -7/1200);
      g2.gain.setValueAtTime(0, now + stagger);
      g2.gain.linearRampToValueAtTime(0.08, now + stagger + 2.2);
      g2.gain.linearRampToValueAtTime(0,    now + stagger + noteDur);
      o2.connect(g2); g2.connect(lp);
      o2.start(now + stagger);
      o2.stop(now + stagger + noteDur + 0.1);
      mNodes.push(o2);
    });

    chordTimer = setTimeout(playChord, gapBetween * 1000);
  }

  /* ── Vinyl / room noise ──────────────────────────── */
  const noiseDur = aCtx.sampleRate * 3;
  const nBuf = aCtx.createBuffer(1, noiseDur, aCtx.sampleRate);
  const nd = nBuf.getChannelData(0);
  for (let i = 0; i < noiseDur; i++) nd[i] = (Math.random() * 2 - 1) * 0.015;
  const noise = aCtx.createBufferSource();
  noise.buffer = nBuf;
  noise.loop = true;

  const nlp = aCtx.createBiquadFilter();
  nlp.type = 'lowpass';
  nlp.frequency.value = 320;

  const nhp = aCtx.createBiquadFilter();
  nhp.type = 'highpass';
  nhp.frequency.value = 80;

  const ng = aCtx.createGain();
  ng.gain.value = 0.045;

  noise.connect(nlp);
  nlp.connect(nhp);
  nhp.connect(ng);
  ng.connect(master);
  noise.start();
  mNodes.push(noise);

  playChord();
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
    if (chordTimer) { clearTimeout(chordTimer); chordTimer = null; }
    /* Fade out gracefully before stopping */
    if (aCtx) {
      const fadeGain = aCtx.createGain();
      fadeGain.gain.setValueAtTime(1, aCtx.currentTime);
      fadeGain.gain.linearRampToValueAtTime(0, aCtx.currentTime + 1.2);
    }
    setTimeout(() => {
      mNodes.forEach(n => { try { n.stop(); } catch (e) {} });
      mNodes = [];
    }, 1300);
    b.textContent = '♩ off';
    b.style.color = '#5a5238';
    b.style.borderColor = 'rgba(232,217,138,0.12)';
  }
}
