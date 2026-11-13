// HUD, inbox, reply dialog, overlays and the main loop.
import * as G from './game.js';
import { Q, CATS, STATS, STAGES, PLANETS, STAT_LABEL, STAT_COLOR, DIRECTIVES, UNLOCKS } from './content.js';
import { render, pickQuery, addFloat, resetView } from './render.js';

const $ = s => document.querySelector(s);
const cv = $('#c'), ctx = cv.getContext('2d');
const fmt = n => Math.round(n).toLocaleString('en-US');
let modalQ = null, overlayOpen = false, W = 0, H = 0;

// ── text helpers ──
const set = (el, v) => { if (el.textContent !== String(v)) el.textContent = v; };
function chips(fx) {
  return Object.entries(fx).filter(([, v]) => v).map(([k, v]) => {
    const n = Math.abs(v) < 1 ? v.toFixed(1) : Math.round(v);
    return `<span class="chip ${v > 0 ? 'up' : 'dn'}">${v > 0 ? '+' : ''}${n} ${STAT_LABEL[k]}</span>`;
  }).join('');
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const who = q => { const p = G.person(q.pid); return p ? { name: p.name, role: p.role, trust: p.trust } : { name: 'The Council', role: 'decision for everyone', trust: null }; };

// ── top bar ──
$('#stats').innerHTML = STATS.map(k => `<div class="stat" id="s-${k}"><label>${STAT_LABEL[k]}</label><div class="bar"><i style="background:${STAT_COLOR[k]}"></i></div><span></span></div>`).join('');
$('#speed').addEventListener('click', e => { const b = e.target.closest('button'); if (b) G.S.speed = +b.dataset.s; });

function hud() {
  const S = G.S, st = STAGES[S.stage], P = PLANETS[S.planet % PLANETS.length];
  set($('#role'), `${st.title} · ${P.name}${S.legacy ? ' · world ' + (S.legacy + 1) : ''}`);
  set($('#day'), `Day ${S.day}`);
  for (const k of STATS) {
    const el = $('#s-' + k), v = S.stats[k];
    el.querySelector('i').style.width = v + '%';
    set(el.querySelector('span'), Math.round(v));
    el.classList.toggle('low', v < 25);
  }
  for (const b of $('#speed').children) b.classList.toggle('on', +b.dataset.s === S.speed);

  const r = G.reach(), goal = st.goal;
  set($('#rStage'), st.name);
  set($('#rNow'), fmt(r)); set($('#rGoal'), fmt(goal));
  $('#rBar').style.width = Math.min(100, r / goal * 100) + '%';
  set($('#rPop'), fmt(S.pop)); set($('#rAd'), Math.round(G.adoption()));
  set($('#rNext'), S.stage < 4 ? `Next: ${STAGES[S.stage + 1].name}` : S.ark.active ? 'The Ark is under construction' : 'Next: the long question');

  $('#ark').hidden = !S.ark.active;
  if (S.ark.active) {
    $('#arkBar').style.width = S.ark.progress + '%';
    set($('#arkSub'), S.ark.progress >= 100 ? 'Ready. Eleven light-years to go.' : `${Math.round(S.ark.progress)}% built. Knowledge and cohesion speed the work.`);
    $('#launch').hidden = S.ark.progress < 100;
  }

  const max = G.maxCompute(), pips = $('#pips');
  if (pips.children.length !== max) pips.innerHTML = '<i></i>'.repeat(max);
  [...pips.children].forEach((p, i) => p.classList.toggle('on', i < S.compute));
  set($('#cNote'), S.compute < max ? 'regenerating' : 'full');

  inbox();
}

// ── inbox ──
let inboxSig = '';
function inbox() {
  const S = G.S, box = $('#inbox');
  const sig = S.queries.map(q => q.id + (q.agentAt ? 'a' : '')).join(',');
  if (sig !== inboxSig) {
    inboxSig = sig;
    const mine = S.queries.filter(q => !q.agentAt).length;
    set($('#nInbox'), mine || '');
    box.innerHTML = S.queries.length ? S.queries.map(q => {
      const t = Q[q.k], c = CATS[t.c], p = who(q);
      const tag = q.agentAt ? '<em>sub-agent replying…</em>' : q.esc ? '<em class="esc">escalated to you</em>' : '';
      return `<button class="q${q.agentAt ? ' auto' : ''}${q.pid < 0 ? ' council' : ''}" data-id="${q.id}" style="--c:${c.color}">
        <span class="qh"><b>${p.name}</b><span class="cat">${c.label}</span></span>
        <span class="qt">${t.q}</span>${tag}
        <span class="ttl"><i></i></span></button>`;
    }).join('') : '<p class="empty">Nobody is asking anything right now.<br>People with a <b>?</b> above them have a question.</p>';
  }
  for (const q of S.queries) {
    const bar = box.querySelector(`[data-id="${q.id}"] .ttl i`);
    if (bar) { bar.style.width = Math.max(0, q.ttl / q.max * 100) + '%'; bar.classList.toggle('late', q.ttl < 18); }
  }
}
$('#inbox').addEventListener('click', e => { const b = e.target.closest('.q'); if (b) openQuery(+b.dataset.id); });

// ── tabs ──
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  for (const x of $('#tabs').children) x.classList.toggle('on', x === b);
  for (const id of ['inbox', 'log', 'depts']) $('#' + id).hidden = id !== b.dataset.t;
  if (b.dataset.t === 'log') drawLog();
  if (b.dataset.t === 'depts') drawDepts();
});

function drawLog() {
  const L = G.S.log;
  $('#log').innerHTML = L.length ? L.map(e => `<div class="entry ${e.good ? 'good' : 'bad'}">
    <div class="eh"><b>${e.who}</b><span>Day ${e.day}${e.by === 'agent' ? ' · sub-agent' : ''}</span></div>
    ${e.reply ? `<p class="said">You said: ${esc(e.reply)}</p>` : ''}<p>${esc(e.text)}</p><div>${chips(e.fx)}</div></div>`).join('') : '<p class="empty">What your replies lead to will be recorded here.</p>';
}

function drawDepts() {
  const S = G.S, slots = G.SLOTS[S.stage], box = $('#depts');
  if (!slots) { box.innerHTML = `<p class="empty">Sub-agents unlock when the settlement becomes a <b>City</b>.<br>Until then, every question comes to you.</p>`; return; }
  box.innerHTML = `<p class="note">Sub-agents in use: <b>${G.slotsUsed()} / ${slots}</b>. Each answers its area for you, without spending your compute. They are right most of the time, and escalate what they doubt.</p>` +
    Object.keys(S.depts).map(c => {
      const d = S.depts[c];
      return `<div class="dept" style="--c:${CATS[c].color}"><div class="dh"><b>${CATS[c].dept}</b></div>
        <select data-c="${c}"><option value="">You answer these yourself</option>${Object.entries(DIRECTIVES).map(([k, v]) => `<option value="${k}"${d === k ? ' selected' : ''}>Sub-agent: ${v.label}</option>`).join('')}</select>
        <small>${d ? DIRECTIVES[d].desc : ''}</small></div>`;
    }).join('');
}
$('#depts').addEventListener('change', e => {
  const s = e.target.closest('select'); if (!s) return;
  if (!G.setDept(s.dataset.c, s.value)) toast({ who: 'No free sub-agent', text: 'All slots are in use. Free one from another department first.', fx: {}, good: false });
  inboxSig = ''; drawDepts();
});

// ── reply dialog ──
// With an API key on the server you type your reply and a model judges it;
// without one (or if you prefer) you pick from three written replies.
let aiOn = false, useChoices = false, judging = false;
try { aiOn = !!(await (await fetch('/api/status')).json()).ai; } catch {}

function openQuery(id) {
  const q = G.S.queries.find(x => x.id === id);
  if (!q || overlayOpen) return;
  modalQ = q; useChoices = false;
  drawModal();
}
function drawModal(error = '', draft = '') {
  const S = G.S, q = modalQ;
  const t = Q[q.k], c = CATS[t.c], p = who(q), cost = G.cost(q), can = S.compute >= cost;
  const typed = aiOn && !useChoices;
  const body = typed
    ? `<textarea id="reply" maxlength="600" rows="4" placeholder="Type what you say to ${p.name.split(' ')[0] === 'The' ? 'the council' : p.name.split(' ')[0]}…" ${can ? '' : 'disabled'}></textarea>
       <div class="sendrow"><span class="err">${error}</span>
         <button class="link" data-toggle>Pick a written reply instead</button>
         <button class="primary small" data-send ${can ? '' : 'disabled'}>Send <kbd>Enter</kbd></button></div>`
    : `<div class="opts">${q.order.map((oi, i) => `<button data-o="${oi}" ${can ? '' : 'disabled'}><kbd>${i + 1}</kbd><span>${t.o[oi][0]}</span></button>`).join('')}</div>
       ${aiOn ? '<div class="sendrow"><span></span><button class="link" data-toggle>Type my own reply instead</button></div>'
              : '<p class="hintline">Typed replies are off because the server has no API key. Add one to <code>.env</code> and restart to write your own.</p>'}`;
  $('#modal').innerHTML = `<div class="dialog" style="--c:${c.color}">
    <div class="mh"><span class="cat">${c.label}</span><b>${p.name}</b><span class="mrole">${p.role}</span>
      ${p.trust === null ? '' : `<span class="mtrust">trusts you ${Math.round(p.trust)}%</span>`}</div>
    <blockquote>${t.q}</blockquote>
    ${q.agentAt ? '<p class="warn">A sub-agent is about to answer this. Reply yourself to take it over.</p>' : ''}
    <label>Your reply</label>
    ${body}
    <div class="mf">${can ? `Costs ${cost} compute.` : `<span class="warn">Needs ${cost} compute and you have ${S.compute}. Close this and let it regenerate.</span>`}
      <button class="ghost" data-close>Decide later (Esc)</button></div></div>`;
  $('#modal').hidden = false;
  const ta = $('#reply');
  if (ta) { ta.value = draft; ta.focus(); }
}
function closeModal() { if (judging) return; modalQ = null; $('#modal').hidden = true; }

// Send a typed reply to the judge, then hand its ruling to the simulation.
async function sendReply() {
  const ta = $('#reply'), q = modalQ;
  const reply = ta ? ta.value.trim() : '';
  if (!q || judging || !reply) return;
  const S = G.S, t = Q[q.k], p = who(q);
  judging = true;
  ta.disabled = true;
  const btn = $('#modal [data-send]');
  btn.disabled = true; btn.textContent = `${p.name.split(' ')[0] === 'The' ? 'The council is' : p.name.split(' ')[0] + ' is'} thinking it over…`;
  let res, error = '';
  try {
    const r = await fetch('/api/judge', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: t.q, reply, council: q.pid < 0, name: p.name, role: p.role, trust: p.trust,
        stage: STAGES[S.stage].name, pop: Math.round(S.pop), stats: S.stats,
        refs: t.o.map(o => ({ reply: o[0], outcome: o[1], fx: o[2], like: o[3] })),
      }),
    });
    res = await r.json();
    if (!r.ok) { error = res.error || 'The judge failed.'; res = null; }
  } catch { error = 'Could not reach the game server.'; }
  judging = false;
  if (modalQ !== q) return;
  if (res && G.answer(q.id, 0, 'you', { reply, outcome: res.outcome, fx: res.fx, like: res.like })) return closeModal();
  drawModal(error || 'Not enough compute.', reply);
}

$('#modal').addEventListener('click', e => {
  if (judging) return;
  if (e.target.id === 'modal' || e.target.closest('[data-close]')) return closeModal();
  if (e.target.closest('[data-toggle]')) { useChoices = !useChoices; return drawModal(); }
  if (e.target.closest('[data-send]')) return sendReply();
  const b = e.target.closest('[data-o]');
  if (b && modalQ && G.answer(modalQ.id, +b.dataset.o)) closeModal();
});

// ── toasts ──
function toast(e) {
  const el = document.createElement('div');
  el.className = 'toast ' + (e.good ? 'good' : 'bad');
  el.innerHTML = `<b>${e.who}</b><p>${esc(e.text)}</p><div>${chips(e.fx)}</div>`;
  const box = $('#toasts');
  box.prepend(el);
  while (box.children.length > 3) box.lastChild.remove();
  setTimeout(() => el.remove(), 11000);
}

// ── overlays ──
function overlay(html, label, cb) {
  overlayOpen = true; closeModal();
  $('#overlay').innerHTML = `<div class="sheet">${html}<button class="primary">${label}</button></div>`;
  $('#overlay').hidden = false;
  $('#overlay').querySelector('.primary').onclick = () => { $('#overlay').hidden = true; overlayOpen = false; cb && cb(); };
}
function intro() {
  const S = G.S, P = PLANETS[S.planet % PLANETS.length];
  if (S.legacy) return overlay(`<small>World ${S.legacy + 1}</small><h1>${P.name}</h1>
    <p>Eleven light-years later, twenty-four people wake under a new sky. They remember you, and they start out trusting you a little more than the last ones did.</p>
    <p>This world is harsher, and there is nothing here yet. Begin again.</p>`, 'Wake the town');
  overlay(`<small>Planet ${P.name} · population 24</small><h1>Steward</h1>
    <p>You are the colony ship's assistant, rehoused in a mast at the centre of the only town on a new world.</p>
    <p>People will bring you questions. What you say changes what they do, and what they do changes the world. Help them well and more of them will rely on you, the town will grow, and you will be trusted with more of it.</p>
    <p>Fail them and the world dies.</p>
    <ul><li>Click a <b>?</b> on the map, or a question in the inbox, and ${aiOn ? 'type your reply in your own words' : 'choose your reply'}.</li>
    <li>Each reply spends <b>compute</b>, which regenerates.</li>
    <li>The pleasing answer and the good answer are not always the same one.</li></ul>`, 'Begin');
}

G.hooks.outcome = (e, p) => {
  const fx = Object.entries(e.fx), world = fx.filter(([k]) => k !== 'trust');
  const main = (world.length ? world : fx).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (p && main) addFloat(p.x, p.y - 20, `${main[1] > 0 ? '+' : ''}${Math.round(main[1])} ${STAT_LABEL[main[0]]}`, main[1] > 0 ? '#8fe0a8' : '#ff8a80');
  if (e.by !== 'agent') toast(e);
  if (!$('#log').hidden) drawLog();
};
G.hooks.expired = e => { if (modalQ && !G.S.queries.includes(modalQ)) closeModal(); toast({ ...e, text: 'Asked, waited, and gave up on you.' }); };
G.hooks.stage = s => {
  inboxSig = '';
  overlay(`<small>Reach ${fmt(G.reach())}</small><h1>${STAGES[s].name}</h1><p>You are now <b>${STAGES[s].title}</b>.</p><p>${UNLOCKS[s]}</p>`, 'Continue', () => { if (!$('#depts').hidden) drawDepts(); });
};
G.hooks.over = o => {
  const S = G.S;
  overlay(`<small>Day ${S.day} · ${PLANETS[S.planet % PLANETS.length].name}</small><h1>${o.title}</h1><p>${o.text}</p>
    <p class="dim">You answered ${S.answered} questions and reached a ${STAGES[S.stage].name} of ${fmt(S.pop)}.</p>`, 'Start over', fresh);
};

function fresh() { G.newGame(); resetView(); inboxSig = ''; $('#toasts').innerHTML = ''; intro(); }
$('#newgame').onclick = () => overlay('<h1>Start over?</h1><p>The current world will be lost.</p>', 'Yes, start over', fresh);
$('#launch').onclick = () => {
  if (G.launchArk()) { resetView(); inboxSig = ''; $('#toasts').innerHTML = ''; intro(); }
};

// ── input ──
cv.addEventListener('click', e => { const q = pickQuery(e.offsetX, e.offsetY, W, H); if (q) openQuery(q.id); });
cv.addEventListener('mousemove', e => { cv.style.cursor = pickQuery(e.offsetX, e.offsetY, W, H) ? 'pointer' : 'default'; });
addEventListener('keydown', e => {
  if (overlayOpen) { if (e.key === 'Enter') $('#overlay .primary').click(); return; }
  if (modalQ) {
    if (e.key === 'Escape') return closeModal();
    if (e.target.id === 'reply') {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); }
      return;
    }
    const i = +e.key - 1, opts = $('#modal').querySelectorAll('[data-o]');
    if (i >= 0 && i < opts.length) opts[i].click();
    return;
  }
  if (e.target.tagName === 'SELECT') return;
  if (e.code === 'Space') { e.preventDefault(); G.S.speed = G.S.speed ? 0 : 1; }
  if (e.key === '1') G.S.speed = 1;
  if (e.key === '2') G.S.speed = 2;
  if (e.key === '3') G.S.speed = 4;
});

// ── loop ──
function resize() {
  const r = cv.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
  if (r.width === W && r.height === H) return;
  W = r.width; H = r.height;
  cv.width = W * d; cv.height = H * d;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
}
let last = performance.now();
function frame(now) {
  const real = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;   // the first frame's timestamp can precede `last`
  const paused = modalQ || overlayOpen || G.S.over || !G.S.speed;
  if (!paused) G.tick(real * G.S.speed);
  resize();
  ctx.setTransform(devicePixelRatio || 1, 0, 0, devicePixelRatio || 1, 0, 0);
  render(ctx, W, H, real, now);
  hud();
  requestAnimationFrame(frame);
}

const resumed = G.load();
if (!resumed) G.newGame();
if (!resumed) intro();
window.__steward = G;   // handy for poking at the game from the console
requestAnimationFrame(frame);
