let aCtx = null, mOn = false, mNodes = [];

function buildMusic() {
  if (!aCtx) aCtx = new (window.AudioContext || window.webkitAudioContext)();
  mNodes.forEach(n => { try { n.stop(); } catch (e) {} });
  mNodes = [];

  const master = aCtx.createGain();
  master.gain.value = 0.11;
  master.connect(aCtx.destination);
  mNodes.push(master);

  const lp = aCtx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 780;
  lp.connect(master);

  const chords = [
    [130.81, 164.81, 196,    246.94],
    [146.83, 185,    220,    277.18],
    [110,    138.59, 164.81, 207.65],
    [123.47, 155.56, 185,    233.08]
  ];
  let ci = 0;

  function playChord() {
    if (!mOn) return;
    chords[ci++ % chords.length].forEach(f => {
      const o = aCtx.createOscillator();
      const g = aCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, aCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.15, aCtx.currentTime + 1.5);
      g.gain.linearRampToValueAtTime(0.09, aCtx.currentTime + 3.5);
      g.gain.linearRampToValueAtTime(0,    aCtx.currentTime + 5.5);
      o.connect(g);
      g.connect(lp);
      o.start();
      o.stop(aCtx.currentTime + 6);
      mNodes.push(o);
    });
    setTimeout(playChord, 4800);
  }

  const buf = aCtx.createBuffer(1, aCtx.sampleRate * 2, aCtx.sampleRate);
  const bd  = buf.getChannelData(0);
  for (let i = 0; i < bd.length; i++) bd[i] = (Math.random() * 2 - 1) * 0.01;
  const noise = aCtx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const ng = aCtx.createGain();
  ng.gain.value = 0.05;
  noise.connect(ng);
  ng.connect(lp);
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
    b.style.borderColor = 'rgba(232,217,138,0.36)';
  } else {
    mOn = false;
    mNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    mNodes = [];
    b.textContent = '♩ off';
    b.style.color = '#5a5238';
    b.style.borderColor = 'rgba(232,217,138,0.12)';
  }
}
