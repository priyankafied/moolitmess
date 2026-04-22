*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #06081a;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-x: hidden; /* prevents horizontal jank */
}

#app {
  min-height: 100vh;
  width: 100%;
  max-width: 680px;
  background: #06081a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44px 28px 60px;
  position: relative;
  overflow: hidden;
  font-family: Georgia, 'Times New Roman', serif;

  /* FIX: improves rendering performance */
  transform: translateZ(0);
  will-change: transform;
}

/* 🔥 FIX: canvas layering + performance safety */
canvas#sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* UI always above canvas */
.z {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 440px;

  /* performance boost */
  transform: translateZ(0);
}

.moon-orb {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, #faf5e0, #e8d98a 60%, #c8b76a);
  box-shadow: 0 0 32px rgba(232,217,138,0.22), 0 0 70px rgba(232,217,138,0.08);
  margin-bottom: 16px;
}

.site-name {
  color: #6a6048;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.tagline {
  color: #6a6450;
  font-size: 12px;
  letter-spacing: 0.05em;
  margin-bottom: 34px;
  text-align: center;
  line-height: 1.7;
}

.screen {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hidden {
  display: none !important;
}

.hero-text {
  color: #b8ae8a;
  font-size: 15px;
  text-align: center;
  line-height: 2;
  margin-bottom: 32px;
  max-width: 340px;
}

.hero-text em {
  color: #d8cfa8;
  font-style: normal;
}

.btn-row {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-moon {
  background: transparent;
  border: 0.5px solid rgba(232,217,138,0.3);
  border-radius: 40px;
  color: #ddd098;
  font-family: Georgia, serif;
  font-size: 14px;
  letter-spacing: 0.04em;
  padding: 11px 30px;
  cursor: pointer;
  transition: all 0.2s ease;

  /* FIX: smoother click responsiveness */
  will-change: transform;
}

.btn-moon:hover {
  background: rgba(232,217,138,0.07);
  border-color: rgba(232,217,138,0.6);
  transform: translateY(-1px);
}

.btn-moon.ghost {
  border-color: rgba(140,130,100,0.2);
  color: #7a7258;
}

.btn-moon.ghost:hover {
  background: rgba(140,130,100,0.05);
  border-color: rgba(140,130,100,0.38);
  color: #a89e78;
}

.btn-moon:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

.inter-msg {
  color: #8a8060;
  font-size: 15px;
  text-align: center;
  line-height: 1.9;
  margin-bottom: 24px;
  max-width: 320px;
  font-style: italic;
}

textarea {
  width: 100%;
  background: rgba(255,255,255,0.033);
  border: 0.5px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #ddd8be;
  font-family: Georgia, serif;
  font-size: 15px;
  line-height: 1.85;
  padding: 18px 20px;
  resize: none;
  outline: none;
  min-height: 115px;

  /* FIX: smoother typing performance */
  will-change: border-color;
}

textarea::placeholder {
  color: rgba(175,165,125,0.26);
}

textarea:focus {
  border-color: rgba(232,217,138,0.22);
}

.reflect-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.typed-thought {
  color: rgba(205,195,162,0.52);
  font-size: 14px;
  font-style: italic;
  text-align: center;
  line-height: 1.95;
  margin-bottom: 20px;
  max-width: 380px;
  word-break: break-word;
  min-height: 36px;
}

.reflect-q {
  color: #c0a870;
  font-size: 16px;
  text-align: center;
  line-height: 1.95;
  margin-bottom: 20px;
  max-width: 360px;
  min-height: 26px;
}

/* FIX: reduce layout recalculation issues */
#reflect-response,
#reflect-btns {
  opacity: 0;
  transition: opacity 0.8s ease;
  will-change: opacity;
}

.lantern-stage {
  width: 100%;
  position: relative;
}

#lc {
  display: block;
  width: 100%;
}

.closure-text {
  color: #8a8468;
  font-size: 15px;
  text-align: center;
  line-height: 2.1;
  max-width: 320px;
  margin-bottom: 28px;
  font-style: italic;
}

.light-sub {
  color: #3e4858;
  font-size: 11px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  margin-bottom: 12px;
  text-align: center;
}

.light-msg-box {
  background: rgba(80,105,145,0.07);
  border: 0.5px solid rgba(110,145,185,0.15);
  border-radius: 14px;
  padding: 24px 26px;
  width: 100%;
  color: #b0c4d4;
  font-size: 15px;
  line-height: 2;
  text-align: center;
  font-style: italic;
  margin-bottom: 20px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stay-msg {
  color: #888068;
  font-size: 15px;
  text-align: center;
  line-height: 2;
  max-width: 320px;
  margin-bottom: 26px;
  font-style: italic;
}

.music-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(255,255,255,0.025);
  border: 0.5px solid rgba(232,217,138,0.14);
  border-radius: 20px;
  color: #5a5238;
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 6px 13px;
  cursor: pointer;
  font-family: Georgia, serif;
  transition: all 0.2s ease;
}

.music-btn:hover {
  color: #e8d98a;
  border-color: rgba(232,217,138,0.32);
  transform: scale(1.02);
}

/* animations optimized */
.fade-in {
  animation: fi 0.7s ease-out forwards;
  will-change: opacity, transform;
}

.slow-in {
  animation: fi 1.2s ease-out forwards;
  will-change: opacity, transform;
}

@keyframes fi {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.stillness {
  animation: still 1.5s ease forwards;
}

@keyframes still {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* mobile optimization */
@media (max-width: 480px) {
  #app { padding: 36px 18px 48px; }
  .btn-row { flex-direction: column; align-items: center; }
  .btn-moon { width: 200px; text-align: center; }
}
