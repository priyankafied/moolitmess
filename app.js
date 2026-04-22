/* ── Message pools ─────────────────────────────────── */
const pool = [
  "you've been carrying this for so long you forgot it wasn't always there. it wasn't always there.",
  "somewhere tonight someone is sitting exactly like you are. same hour. same weight. different room.",
  "you don't have to be interesting tonight. you don't have to be anything tonight.",
  "grief doesn't have a schedule. it arrives whenever it wants. you don't have to entertain it.",
  "you're not behind. there's no version of life you were supposed to have by now.",
  "some things end and nobody did anything wrong. that might be the saddest kind.",
  "the mistake you made — other people have made it too and still had good lives.",
  "your dream doesn't have to happen on anyone else's timeline. or at all. but it's not over yet.",
  "feeling too much is not a flaw. it means you're alive in a way some people never get to be.",
  "the numbness is sometimes the mind being kind. it means you went through something real.",
  "missing somewhere can mean missing a version of yourself that felt safe. that version isn't gone.",
  "having no one to text tonight doesn't mean you're unloved. sometimes love is just sleeping.",
  "getting older means you've survived every hard day so far. that's not nothing.",
  "shame lies. it says you are the worst thing you did. you're not.",
  "letting go doesn't always feel like release. sometimes it just feels like very tired hands slowly opening.",
  "you showed up today. maybe that was harder than anyone knows. it still counts.",
  "you're allowed to feel nothing about things you're supposed to feel something about.",
  "some days are just maintenance days. keeping yourself going is enough.",
  "the version of you from five years ago would be surprised you made it here. in a good way.",
  "maybe today you just make tea. look out a window. that's a whole day. that's allowed.",
  "call someone you haven't called in a while. not to say anything important. just to hear a voice.",
  "go outside for ten minutes. not to fix anything. just to remember the world is bigger than this room.",
  "write something down. even if it's ugly. even if it doesn't make sense. get it outside of you.",
  "forgive yourself quietly, without ceremony. the way you'd forgive someone you really love.",
  "eat something warm tonight. your body has been holding a lot.",
  "sometimes the kindest thing is to do one ordinary thing. wash a cup. fold something. small acts of staying.",
  "you are allowed to need things. you are allowed to say so.",
  "loneliness and being alone are different things. it's not your fault.",
  "something good is still possible. not guaranteed. but possible. that door hasn't closed.",
  "you felt something today. that's evidence you're still here. still capable.",
  "the dream might just be resting. dormant, not dead.",
  "people who are hard on themselves usually care the most. you care. that's not a flaw.",
  "there's a version of tomorrow that surprises you. it exists. you haven't seen it yet.",
  "the chapter you're in is not the whole book.",
  "your body has carried you through every hard day you thought would break you. it's still here.",
  "it's okay to want more from your life. wanting more doesn't mean you're ungrateful.",
  "rest isn't a reward you earn. it's something you're allowed to take.",
  "whoever hurt you — you didn't deserve it. even if part of you still thinks you did.",
  "the things that make you different are usually the most beautiful things about you. give it time.",
  "you've been so patient. with yourself, with others, with life. that patience is not invisible.",
  "some things only make sense later. you're in the not-yet-making-sense part.",
  "the fact that you're still looking for light means the light still matters to you. that's not small.",
  "you're not too sensitive. you're appropriately sensitive to a world that often isn't kind enough.",
  "some relationships survive distance. some don't. both kinds were real.",
  "the 2 a.m. version of the problem is almost never the actual size of the problem.",
  "it's okay to not know what you believe in right now. belief can take a break.",
  "you've survived 100% of your worst nights. this one will end too.",
  "whatever you didn't finish today — it waited before. it can wait again.",
  "the thing you're most ashamed of is probably the thing that makes you most human.",
  "you are not a burden. you are a person who needed something. those are different.",
  "sometimes healing looks like doing nothing. like finally stopping.",
  "the part of you that knows something is wrong is worth listening to.",
  "there will be a day when this particular weight doesn't come with you into the morning.",
  "you don't have to explain your sadness to anyone. not even yourself.",
  "go make something small. a meal. a note. a mark on paper. creation argues with despair.",
  "the loneliest feeling passes. slowly. but it passes.",
  "someone will love the version of you that you're most afraid to show. probably already does.",
  "you are not running out of time. you are in the middle of your time.",
  "it's okay to have wanted something badly and not gotten it. the wanting was still real. still yours.",
  "there's a gentleness in you that the world hasn't seen yet.",
  "tonight you can just exist. no progress required.",
  "whoever left your life — you didn't chase them away just by being yourself.",
  "there are people in the world who would find your specific way of existing very beautiful.",
  "you're not lazy. you might be depleted. they look the same from the outside.",
  "the body remembers kindness. be kind to yours tonight.",
  "you can feel lost and still be going somewhere.",
  "the regret you're carrying — you've held it long enough for it to count. you don't have to hold it forever.",
  "purpose isn't found. it accumulates. slowly. in what you keep returning to.",
  "there is someone somewhere who needs exactly the kind of presence you naturally are.",
  "the night you're having right now has been had by someone before you. they made it to morning.",
  "you can go slowly. slow is not the same as stuck.",
  "you came here tonight. that's a kind of reaching. that matters.",
  "whatever you're carrying — you don't have to solve it tonight. just set it down for a few minutes.",
  "you don't have to perform okayness tonight. not here.",
  "the part of you that still hopes — protect it. it's been through a lot.",
  "there's a softness in you that hasn't been ruined. even now. especially now.",
  "you don't have to be okay. you just have to get to morning.",
  "the quiet you feel right now is not emptiness. it's space.",
  "something in you kept going today even when it didn't want to. notice that.",
  "being misunderstood is exhausting. you don't have to explain yourself here.",
  "the world doesn't always see you clearly. that's the world's limitation, not yours.",
  "you've been kind to people who didn't notice. it still mattered.",
  "whatever broke — you didn't stop. you're still here. that's the whole story tonight.",
  "कुछ रातें बस ऐसी होती हैं। / some nights are just heavy without reason. that's all.",
  "not every silence needs to be filled. some silences are just rest.",
  "the version of you that got it wrong is still worth sitting with kindly.",
  "you are not the worst thing that happened to you.",
  "there's no correct way to feel what you're feeling. all of it is correct.",
  "모든 게 잘 될 거야. / something finds a way. not always how you imagined. but something.",
  "it's okay if you're tired of trying to be okay.",
  "you were never supposed to have it all figured out by now. no one does.",
  "불꽃이 꺼지지 않았어. / the light in you hasn't gone out. even on nights like this.",
  "go toward whatever softens you. that's enough of a direction for tonight.",
  "tu n'es pas seul·e ce soir. / you are not alone tonight.",
  "the life you wanted is still wanting you back. somewhere in it.",
  "you are not behind. you are exactly where a person who has been through what you've been through would be.",
  "सब ठीक होगा। शायद जल्दी नहीं, लेकिन होगा। / it will be okay. maybe not soon. but it will.",
  "the smallest act of care toward yourself tonight counts as a whole thing.",
  "you don't have to earn your place here. you already have one.",
  "whatever this is — it's allowed to be heavy. you don't have to make it lighter than it is tonight."
];

const writePrompts = [
  "this space holds no memory of you.\nwrite what you've been carrying.",
  "what you write here vanishes when you let it go.\nyou don't have to hold anything back.",
  "no one will read this. no one will judge it.\njust let it exist here for a moment."
];

const reflectQs = [
  "where does this feeling live in your body right now?",
  "what are you most afraid this feeling says about you?",
  "when did you first start carrying this?",
  "what would you say to someone you love who felt exactly this way?",
  "is this yours to carry — or did someone give it to you?",
  "what does the quietest part of you already know?",
  "if this feeling could speak, what would it most want you to hear?"
];

const closureLines = [
  "it's okay to leave this here.",
  "you don't have to hold onto this anymore.",
  "something has shifted. even if it's quiet, it's real.",
  "whatever just moved through you — it was allowed to."
];

let userLights = [];
let lightIdx = 0;
let shuffled = [...pool].sort(() => Math.random() - 0.5);
let currentThought = '';

/* ── Focus management ─────────────────────────────── */
const focusMap = {
  's-home':        () => document.querySelector('#s-home .btn-primary'),
  's-write':       () => document.getElementById('thought-input'),
  's-reflect':     () => document.getElementById('reflect-response'),
  's-closure':     () => document.getElementById('closure-line'),
  's-stay':        () => document.querySelector('#s-stay .stay-msg'),
  's-find':        () => document.getElementById('light-msg'),
  's-leave-light': () => document.getElementById('light-input'),
  's-light-sent':  () => document.querySelector('#s-light-sent .stay-msg'),
};

/* ── Screen transitions ───────────────────────────── */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');

  if (id === 's-write') {
    const p = document.getElementById('write-prompt');
    p.textContent = writePrompts[Math.floor(Math.random() * writePrompts.length)];
  }

  if (id === 's-find') showLight();

  if (id === 's-closure') {
    const cl = document.getElementById('closure-line');
    cl.textContent = closureLines[Math.floor(Math.random() * closureLines.length)];
    const br = document.getElementById('closure-btns');
    br.style.opacity = 0;
    setTimeout(() => {
      br.style.transition = 'opacity 1.4s ease';
      br.style.opacity = 1;
    }, 1600);
  }

  const getter = focusMap[id];
  if (getter) setTimeout(() => {
    const el = getter();
    if (!el) return;
    if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: false });
  }, 160);
}

/* ── Lights ───────────────────────────────────────── */
function showLight() {
  const box = document.getElementById('light-msg');
  box.style.opacity = 0;
  setTimeout(() => {
    const all = [...shuffled, ...userLights];
    box.textContent = all[lightIdx % all.length];
    box.style.opacity = 1;
  }, 400);
}

function doLeaveLight() {
  const txt = document.getElementById('light-input').value.trim();
  if (!txt) return;
  userLights.push(txt);
  document.getElementById('light-input').value = '';
  goTo('s-light-sent');
}

/* ── Reflect flow ─────────────────────────────────── */
async function doReflect() {
  const txt = document.getElementById('thought-input').value.trim();
  if (!txt) return;
  currentThought = txt;
  document.getElementById('btn-continue').disabled = true;
  goTo('s-reflect');

  const tEl = document.getElementById('typed-thought');
  const qEl = document.getElementById('reflect-q');
  const rEl = document.getElementById('reflect-response');
  const bEl = document.getElementById('reflect-btns');

  tEl.textContent = ''; qEl.textContent = '';
  rEl.style.opacity = 0; bEl.style.opacity = 0;

  const preview = txt.length > 160 ? txt.slice(0, 160) + '…' : txt;
  await typeText(tEl, preview, 36);
  await sleep(700);

  let q = reflectQs[Math.floor(Math.random() * reflectQs.length)];
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a quiet, gentle presence. Someone shares something heavy. Ask ONE soft, somatic question under 18 words. Poetic, not clinical. Help them feel, not fix. No preamble. Just the question.",
        messages: [{ role: "user", content: txt }]
      })
    });
    const d = await r.json();
    if (d.content?.[0]?.text) q = d.content[0].text.replace(/^["']+|["']+$/g, '').trim();
  } catch(e) {}

  await typeText(qEl, q, 40);
  await sleep(500);
  rEl.style.transition = 'opacity 1.4s ease'; rEl.style.opacity = 1;
  await sleep(1500);
  bEl.style.transition = 'opacity 1.2s ease'; bEl.style.opacity = 1;
  setTimeout(() => rEl.focus(), 200);
  document.getElementById('btn-continue').disabled = false;
}

/* ── Release — message drifts into sea ───────────── */
function doRelease() {
  const txt = currentThought;
  /* Show release screen (transparent — world canvas shows through) */
  goTo('s-release');
  /* Trigger world.js animation */
  if (typeof releaseMessage === 'function') releaseMessage(txt);
  /* goTo('s-closure') is called by world.js after dissolve completes */
}

function doStay() { goTo('s-stay'); }

/* ── Utilities ────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeText(el, text, delay = 38) {
  el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    if (text[i] !== ' ') await sleep(delay + Math.random() * 20);
  }
}
