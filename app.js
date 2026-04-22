const pool = [
  "You are allowed to not be okay right now.",
  "Whatever you're carrying tonight, you have carried heavy things before.",
  "Someone somewhere is also awake at this hour, feeling something they can't name.",
  "You don't have to explain yourself to anyone tonight.",
  "It is enough that you are here. That you reached for something softer.",
  "Not every feeling needs to be solved. Some just need to be felt.",
  "You came here. That was brave in its own quiet way.",
  "There is no rush. Not tonight.",
  "Some nights just need to be held, not fixed.",
  "Whatever you put down here, you didn't have to carry it alone.",
  "You are more than what you're overthinking right now.",
  "The version of you that got through the last hard thing is still in you.",
  "Even the moon disappears sometimes. It always comes back.",
  "You are not too much. You have never been too much."
];

const writePrompts = [
  "This space holds no memory of you.\nWrite what you've been carrying. There is no wrong way.",
  "What you share here vanishes when you let it go.\nYou don't have to hold anything back.",
  "No one will read this. No one will judge it.\nJust let it exist here for a moment."
];

const reflectQs = [
  "Where does this feeling live in your body right now?",
  "What are you most afraid this feeling says about you?",
  "When did you first start carrying this?",
  "What would you say to someone you love who felt exactly this way?",
  "Is this yours to carry — or did someone give it to you?",
  "What does the quietest part of you already know?",
  "If this feeling could speak, what would it most want you to hear?"
];

const closureLines = [
  "It's okay to leave this here.",
  "You don't have to hold onto this anymore.",
  "Something has shifted. Even if it's quiet, it's real.",
  "Whatever just moved through you — it was allowed to."
];

let userLights = [];
let lightIdx = 0;
let shuffled = [...pool].sort(() => Math.random() - 0.5);

/* Focus management — moves keyboard focus to the right element after each transition */
const focusTargets = {
  's0':           () => document.getElementById('btn-leave-it'),
  's-gate':       () => document.querySelector('#s-gate .inter-msg'),
  's-write':      () => document.getElementById('thought-input'),
  's-reflect':    () => document.getElementById('reflect-response'),
  's-lantern':    () => null,
  's-closure':    () => document.getElementById('closure-line'),
  's-stay':       () => document.querySelector('#s-stay .stay-msg'),
  's-leave-light':() => document.getElementById('light-input'),
  's-light-sent': () => document.querySelector('#s-light-sent .inter-msg'),
  's-find':       () => document.getElementById('light-box'),
};

function moveFocus(id) {
  const getter = focusTargets[id];
  if (!getter) return;
  const el = getter();
  if (!el) return;
  /* Small delay so the DOM is visible before focus lands */
  setTimeout(() => {
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
      el.focus();
    } else {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: false });
    }
  }, 120);
}

function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(id);
  el.classList.remove('hidden');

  if (id === 's-write') {
    const p = document.getElementById('write-prompt');
    p.textContent = writePrompts[Math.floor(Math.random() * writePrompts.length)];
    p.classList.remove('slow-in');
    void p.offsetWidth;
    p.classList.add('slow-in');
  }

  if (id === 's-find') {
    showLight();
  }

  if (id === 's-closure') {
    const cl = document.getElementById('closure-line');
    cl.textContent = closureLines[Math.floor(Math.random() * closureLines.length)];
    const br = document.getElementById('closure-btns');
    br.style.opacity = 0;
    setTimeout(() => {
      br.style.transition = 'opacity 1.2s ease';
      br.style.opacity = 1;
    }, 1400);
  }

  moveFocus(id);
}

function showLight() {
  const box = document.getElementById('light-box');
  box.style.opacity = 0;
  setTimeout(() => {
    const all = [...shuffled, ...userLights];
    box.textContent = all[lightIdx % all.length];
    box.style.opacity = 1;
  }, 400);
}

function nextLight() {
  lightIdx++;
  const all = [...shuffled, ...userLights];
  if (lightIdx >= all.length) {
    shuffled = [...pool].sort(() => Math.random() - 0.5);
    lightIdx = 0;
  }
  showLight();
}

function doLeaveLight() {
  const txt = document.getElementById('light-input').value.trim();
  if (!txt) return;
  userLights.push(txt);
  document.getElementById('light-input').value = '';
  goTo('s-light-sent');
}

async function doReflect() {
  const txt = document.getElementById('thought-input').value.trim();
  if (!txt) return;
  document.getElementById('btn-continue').disabled = true;
  goTo('s-reflect');

  const tEl = document.getElementById('typed-thought');
  const qEl = document.getElementById('reflect-q');
  const rEl = document.getElementById('reflect-response');
  const bEl = document.getElementById('reflect-btns');

  tEl.textContent = '';
  qEl.textContent = '';
  rEl.style.opacity = 0;
  bEl.style.opacity = 0;

  const preview = txt.length > 160 ? txt.slice(0, 160) + '…' : txt;

  /* Start API fetch immediately — runs in parallel while text types */
  let q = reflectQs[Math.floor(Math.random() * reflectQs.length)];
  const fetchQ = fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 80,
      system: "You are a quiet, gentle presence. Someone shares something heavy. Ask ONE soft, somatic question under 18 words. Poetic, not clinical. Help them feel, not fix. No preamble. Just the question.",
      messages: [{ role: "user", content: txt }]
    })
  }).then(r => r.json()).then(d => {
    if (d.content?.[0]?.text) q = d.content[0].text.replace(/^["']+|["']+$/g, '').trim();
  }).catch(() => {});

  /* Type the user's thought while fetch runs in background */
  await typeText(tEl, preview, 38);
  await sleep(600);

  /* Wait for fetch to finish (usually already done by now) */
  await fetchQ;

  await typeText(qEl, q, 42);
  await sleep(500);
  rEl.style.transition = 'opacity 1.4s ease';
  rEl.style.opacity = 1;
  await sleep(1500);
  bEl.style.transition = 'opacity 1.2s ease';
  bEl.style.opacity = 1;

  /* Move focus to the response textarea once it's visible */
  setTimeout(() => { rEl.focus(); }, 200);
  document.getElementById('btn-continue').disabled = false;
}

function doLetGo() {
  goTo('s-lantern');
  runLantern();
}

function doStay() {
  goTo('s-stay');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function typeText(el, text, delay = 40) {
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    if (text[i] !== ' ') await sleep(delay + Math.random() * 22);
  }
}
