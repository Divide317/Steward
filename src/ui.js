// HUD, inbox, reply dialog, training, crises, overlays and the main loop.
import * as G from './game.js';
import { Q, CATS, STATS, TOPICS, STAGES, PLANETS, STAT_LABEL, STAT_COLOR, DIRECTIVES, UNLOCKS, UP_COST, UP_LEVELS } from './content.js';
import { render, pickQuery, addFloat, resetView } from './render.js';
import { openPuzzle } from './puzzle.js';
import { localJudge } from './judge.js';

const $ = s => document.querySelector(s);
const cv = $('#c'), ctx = cv.getContext('2d');
const fmt = n => Math.round(n).toLocaleString('en-US');
let modalQ = null, overlayOpen = false, W = 0, H = 0;

// Typed replies are ruled on by Claude when the server has an API key, and by a simple offline matcher when it doesn't.
let aiOn = false, warned = false;
try { aiOn = !!(await (await fetch('/api/status')).json()).ai; } catch {}

// ── text helpers ──
const set = (el, v) => { if (el.textContent !== String(v)) el.textContent = v; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const costText = c => (c % 1 ? (c > 1 ? Math.floor(c) + '½' : '½') : String(c));
function chips(fx) {
  return Object.entries(fx).filter(([, v]) => v).map(([k, v]) => {
    const n = Math.abs(v) < 1 ? v.toFixed(1) : Math.round(v);
    return `<span class="chip ${v > 0 ? 'up' : 'dn'}">${v > 0 ? '+' : ''}${n} ${STAT_LABEL[k]}</span>`;
  }).join('');
}
const who = q => { const p = G.person(q.pid); return p ? { name: p.name, first: p.name.split(' ')[0], role: p.role, trust: p.trust } : { name: 'The Council', first: 'the council', role: 'decision for everyone', trust: null }; };

// ── top bar ──
$('#stats').innerHTML = STATS.map(k => `<div class="stat" id="s-${k}"><label title="${STAT_LABEL[k]}"><span class="full">${STAT_LABEL[k]}</span><span class="short">${STAT_LABEL[k].slice(0, 5)}</span></label><div class="bar"><i style="background:${STAT_COLOR[k]}"></i></div><span></span></div>`).join('');
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

  // crisis banner
  const C = S.crisis, def = G.crisisDef();
  $('#crisis').hidden = !C;
  if (C) {
    set($('#crName'), def.name);
    $('#crisis').classList.toggle('cut', C.phase === 'cut');
    set($('#crSub'), C.phase === 'cut' ? `Link down for ${Math.floor(C.cutT)}s. Trust is draining.` : C.left > 0 ? `Emergency: ${Math.ceil(C.left)}s. Questions marked ! are life or death.` : 'Easing. Finish what is in the inbox.');
    $('#relink').hidden = C.phase !== 'cut';
  }

  const max = G.maxCompute(), pips = $('#pips');
  if (pips.children.length !== max) pips.innerHTML = '<i></i>'.repeat(max);
  [...pips.children].forEach((p, i) => {
    p.classList.toggle('on', i < Math.floor(S.compute));
    p.classList.toggle('half', i === Math.floor(S.compute) && S.compute % 1 >= 0.5);
  });
  set($('#cNote'), G.cut() ? 'offline' : S.compute < max ? 'regenerating' : 'full');
  set($('#nInsight'), S.insight || '');

  pumpJudges();
  inbox();
}

// ── inbox ──
let inboxSig = '';
function inbox() {
  const S = G.S, box = $('#inbox'), dark = G.cut();
  const sig = (dark ? 'x' : '') + S.queries.map(q => q.id + (q.agentAt ? 'a' : '') + (q.proc ? 'p' : '')).join(',');
  if (sig !== inboxSig) {
    inboxSig = sig;
    const mine = S.queries.filter(q => !q.agentAt && !q.proc).length;
    set($('#nInbox'), dark ? '' : mine || '');
    const sorted = [...S.queries].sort((a, b) => (b.crit - a.crit) || (a.ttl - b.ttl));
    box.innerHTML = (dark ? `<div class="offline"><b>No connection</b><p>Nobody can reach you, and you cannot answer. Restore the link first.</p><button class="primary small" data-relink>Restore the link</button></div>` : '') +
      (sorted.length ? sorted.map(q => {
        const t = Q[q.k], c = CATS[t.c], p = who(q);
        const tag = q.proc ? '<em class="esc">processing your reply… <span class="pt"></span></em>' : q.agentAt ? '<em>sub-agent replying…</em>' : q.esc ? '<em class="esc">escalated to you</em>' : '';
        return `<button class="q${q.agentAt || dark ? ' auto' : ''}${q.pid < 0 ? ' council' : ''}${q.crit ? ' crit' : ''}" data-id="${q.id}" style="--c:${q.crit ? 'var(--bad)' : c.color}">
          <span class="qh"><b>${p.name}</b><span class="cat">${q.crit ? 'Critical · ' : ''}${c.label}</span></span>
          <span class="qt">${t.q}</span>${tag}
          <span class="ttl"><i></i></span></button>`;
      }).join('') : dark ? '' : '<p class="empty">Nobody is asking anything right now.<br>People with a <b>?</b> above them have a question.</p>');
  }
  for (const q of S.queries) {
    const el = box.querySelector(`[data-id="${q.id}"]`);
    if (!el) continue;
    const bar = el.querySelector('.ttl i');
    bar.style.width = Math.max(0, q.ttl / q.max * 100) + '%'; bar.classList.toggle('late', q.ttl < 18);
    const pt = el.querySelector('.pt');
    if (pt && q.proc) set(pt, Math.max(0, Math.ceil(q.proc.until - S.t)) + 's');
  }
}
$('#inbox').addEventListener('click', e => {
  if (e.target.closest('[data-relink]')) return openLinkPuzzle();
  const b = e.target.closest('.q'); if (b) openQuery(+b.dataset.id);
});

// ── tabs ──
const PANES = ['inbox', 'log', 'depts', 'train'];
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  for (const x of $('#tabs').children) x.classList.toggle('on', x === b);
  for (const id of PANES) $('#' + id).hidden = id !== b.dataset.t;
  redraw();
});
function redraw() {
  if (!$('#log').hidden) drawLog();
  if (!$('#depts').hidden) drawDepts();
  if (!$('#train').hidden) drawTrain();
}

function drawLog() {
  const L = G.S.log;
  $('#log').innerHTML = L.length ? L.map(e => `<div class="entry ${e.good ? 'good' : 'bad'}">
    <div class="eh"><b>${e.who}</b><span>Day ${e.day}${e.crit ? ' · critical' : ''}${e.by === 'agent' ? ' · sub-agent' : e.by === 'typed' ? ' · typed' : ''}${e.insight ? ` · +${e.insight} insight` : ''}</span></div>
    ${e.reply ? `<p class="said">You said: ${esc(e.reply)}</p>` : ''}<p>${esc(e.text)}</p><div>${chips(e.fx)}</div></div>`).join('') : '<p class="empty">What your replies lead to will be recorded here.</p>';
}

function drawDepts() {
  const S = G.S, slots = G.SLOTS[S.stage], box = $('#depts');
  if (!slots) { box.innerHTML = `<p class="empty">Sub-agents unlock when the settlement becomes a <b>City</b>.<br>Until then, every question comes to you.</p>`; return; }
  box.innerHTML = `<p class="note">Sub-agents in use: <b>${G.slotsUsed()} / ${slots}</b>. Each answers its area for you, without spending your compute. They are right most of the time, escalate what they doubt, and never touch critical questions.</p>` +
    TOPICS.map(c => {
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

// ── training ──
function drawTrain() {
  const S = G.S;
  $('#train').innerHTML = `<p class="note">Insight: <b class="ins">${S.insight}</b>. You earn it when a reply of yours turns out well (double for critical questions), when the settlement grows, and when a crisis is survived. Spend it to know a topic better.</p>` +
    TOPICS.map(c => {
      const lvl = S.know[c], next = UP_LEVELS[lvl], price = UP_COST[lvl];
      return `<div class="dept" style="--c:${CATS[c].color}">
        <div class="dh"><b>${CATS[c].label}</b><span class="lv">${[0, 1, 2].map(i => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</span></div>
        ${next ? `<small><b>${next.name}.</b> ${next.desc}</small><button class="train" data-up="${c}" ${S.insight >= price ? '' : 'disabled'}>Train · ${price} insight</button>`
               : '<small>Fully trained.</small>'}</div>`;
    }).join('');
}
$('#train').addEventListener('click', e => { const b = e.target.closest('[data-up]'); if (b && G.upgrade(b.dataset.up)) drawTrain(); });

// ── reply dialog ──
function openQuery(id) {
  const q = G.S.queries.find(x => x.id === id);
  if (!q || overlayOpen) return;
  if (G.cut()) return openLinkPuzzle();
  if (q.proc) return;
  modalQ = q;
  drawModal();
}
function drawModal(error = '', draft = '') {
  const S = G.S, q = modalQ;
  const t = Q[q.k], c = CATS[t.c], p = who(q), cw = G.cost(q), ct = G.cost(q, true);
  const canW = S.compute >= cw, canT = S.compute >= ct, busy = G.processing(), flag = G.flagged(q);
  $('#modal').innerHTML = `<div class="dialog${q.crit ? ' critd' : ''}" style="--c:${q.crit ? 'var(--bad)' : c.color}">
    <div class="mh"><span class="cat">${q.crit ? 'Critical · ' : ''}${c.label}</span><b>${p.name}</b><span class="mrole">${p.role}</span>
      ${p.trust === null ? '' : `<span class="mtrust">trusts you ${Math.round(p.trust)}%</span>`}</div>
    <blockquote>${t.q}</blockquote>
    ${q.crit ? `<p class="warn">Lives may depend on this. ${Math.ceil(q.ttl)}s before it is too late, and an unanswered critical question hurts the world.</p>` : ''}
    ${q.agentAt ? '<p class="warn">A sub-agent is about to answer this. Reply yourself to take it over.</p>' : ''}
    <label>Type your own reply <span class="lcost">${costText(ct)} compute · takes ${G.PROC}s to process</span></label>
    <textarea id="reply" maxlength="600" rows="3" placeholder="${busy ? 'Another typed reply is still being processed.' : `Say it to ${p.first} in your own words…`}" ${canT && !busy ? '' : 'disabled'}></textarea>
    <div class="sendrow"><span class="err">${error}</span>
      ${aiOn ? '' : '<span class="hintline">No API key: your words are matched to the closest written reply.</span>'}
      <button class="primary small" data-send ${canT && !busy ? '' : 'disabled'}>Send <kbd>Enter</kbd></button></div>
    <label>Or pick a written reply <span class="lcost">${costText(cw)} compute · immediate</span></label>
    <div class="opts">${q.order.map((oi, i) => `<button data-o="${oi}" ${canW ? '' : 'disabled'} class="${oi === flag ? 'risky' : ''}"><kbd>${i + 1}</kbd><span>${t.o[oi][0]}${oi === flag ? '<em class="flag">Your training flags this as the likeliest to do harm.</em>' : ''}</span></button>`).join('')}</div>
    <div class="mf">${canT ? `You have ${costText(S.compute)} compute.` : `<span class="warn">Not enough compute. Close this and let it regenerate.</span>`}
      <button class="ghost" data-close>Decide later (Esc)</button></div></div>`;
  $('#modal').hidden = false;
  const ta = $('#reply');
  ta.value = draft;
  if (!ta.disabled) ta.focus();
}
function closeModal() { modalQ = null; $('#modal').hidden = true; }

function sendReply() {
  const ta = $('#reply'), q = modalQ, reply = ta.value.trim();
  if (!q || !reply) return;
  if (G.submitTyped(q.id, reply)) { inboxSig = ''; return closeModal(); }
  drawModal(G.processing() ? 'One typed reply is already being processed.' : 'Not enough compute.', reply);
}

$('#modal').addEventListener('click', e => {
  if (e.target.id === 'modal' || e.target.closest('[data-close]')) return closeModal();
  if (e.target.closest('[data-send]')) return sendReply();
  const b = e.target.closest('[data-o]');
  if (b && modalQ && G.answer(modalQ.id, +b.dataset.o)) closeModal();
});

// Get a ruling for every typed reply that is being processed. The simulation applies it when the processing time is up.
const inflight = new Set();
function pumpJudges() {
  for (const q of G.S.queries) {
    if (!q.proc || q.proc.res || inflight.has(q.id)) continue;
    inflight.add(q.id);
    judge(q).then(res => { G.setVerdict(q.id, res); inflight.delete(q.id); });
  }
}
async function judge(q) {
  const S = G.S, t = Q[q.k], p = who(q);
  if (aiOn) {
    try {
      const r = await fetch('/api/judge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: t.q, reply: q.proc.reply, council: q.pid < 0, critical: q.crit, name: p.name, role: p.role, trust: p.trust,
          stage: STAGES[S.stage].name, pop: Math.round(S.pop), stats: S.stats,
          refs: t.o.map(o => ({ reply: o[0], outcome: o[1], fx: o[2], like: o[3] })),
        }),
      });
      const res = await r.json();
      if (r.ok) return { outcome: res.outcome, fx: res.fx, like: res.like };
      if (!warned) { warned = true; toast({ who: 'Judge unavailable', text: `${res.error || 'The judge failed.'} Typed replies are being matched offline for now.`, fx: {}, good: false }); }
    } catch {
      if (!warned) { warned = true; toast({ who: 'Judge unavailable', text: 'Could not reach the game server. Typed replies are being matched offline for now.', fx: {}, good: false }); }
    }
  }
  return localJudge(t, q.proc.reply);
}

// ── crisis: restoring the link ──
function openLinkPuzzle() {
  const S = G.S;
  if (!G.cut() || overlayOpen) return;
  closeModal();
  openPuzzle($('#puzzle'), S.crisis.puzzle, S.stage >= 2, () => G.restoreLink());
}
$('#relink').onclick = openLinkPuzzle;

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
  overlayOpen = true; closeModal(); $('#puzzle').hidden = true;
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
    <p>People will bring you questions. What you say changes what they do, and what they do changes the world. Help them well and more of them will rely on you, the town will grow, and you will be trusted with more of it. Fail them and the world dies.</p>
    <ul><li>Click a <b>?</b> on the map, or a question in the inbox, to reply.</li>
    <li>A written reply costs 1 <b>compute</b> and lands at once. Typing your own costs half, and takes ${G.PROC} seconds to process.</li>
    <li>A red <b>!</b> is critical. Leave it unanswered and the world pays.</li>
    <li>Storms, floods and worse will come. Some will cut you off until you repair the link.</li>
    <li>The pleasing answer and the good answer are not always the same one.</li></ul>`, 'Begin');
}

G.hooks.outcome = (e, p) => {
  const fx = Object.entries(e.fx), world = fx.filter(([k]) => k !== 'trust');
  const main = (world.length ? world : fx).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (p && main) addFloat(p.x, p.y - 20, `${main[1] > 0 ? '+' : ''}${Math.round(main[1])} ${STAT_LABEL[main[0]]}`, main[1] > 0 ? '#8fe0a8' : '#ff8a80');
  if (e.by !== 'agent') toast(e);
  redraw();
};
G.hooks.expired = e => { if (modalQ && !G.S.queries.includes(modalQ)) closeModal(); toast(e.crit ? e : { ...e, text: 'Asked, waited, and gave up on you.' }); redraw(); };
G.hooks.stage = s => {
  inboxSig = '';
  overlay(`<small>Reach ${fmt(G.reach())}</small><h1>${STAGES[s].name}</h1><p>You are now <b>${STAGES[s].title}</b>.</p><p>${UNLOCKS[s]}</p>`, 'Continue', redraw);
};
G.hooks.crisis = (what, def) => {
  inboxSig = '';
  if (what === 'start') {
    overlay(`<small class="alarm">Crisis</small><h1>${def.name}</h1><p>${def.text}</p>
      <p>${def.cut ? 'Until the link is repaired you can hear nobody, the world keeps taking damage, and trust drains with every second you stay dark. When it comes back, they will all ask at once.'
                   : 'Questions marked <b>!</b> are life or death, and they will not wait long. You will not have the compute to answer everything well. Choose.'}</p>`,
      def.cut ? 'Repair the link' : 'Answer them', () => { if (def.cut) openLinkPuzzle(); });
  } else if (what === 'restored') toast({ who: 'Link restored', text: 'The mast is live again. The inbox is about to fill.', fx: {}, good: true });
  else toast({ who: def.name, text: 'It has passed. The town is counting what it kept.', fx: {}, good: true });
  redraw();
};
G.hooks.over = o => {
  const S = G.S;
  overlay(`<small>Day ${S.day} · ${PLANETS[S.planet % PLANETS.length].name}</small><h1>${o.title}</h1><p>${o.text}</p>
    <p class="dim">You answered ${S.answered} questions and reached a ${STAGES[S.stage].name} of ${fmt(S.pop)}.</p>`, 'Start over', fresh);
};

function fresh() { G.newGame(); resetView(); inboxSig = ''; $('#toasts').innerHTML = ''; redraw(); intro(); }
$('#newgame').onclick = () => overlay('<h1>Start over?</h1><p>The current world will be lost.</p>', 'Yes, start over', fresh);
$('#launch').onclick = () => {
  if (G.launchArk()) { resetView(); inboxSig = ''; $('#toasts').innerHTML = ''; redraw(); intro(); }
};

// ── input ──
cv.addEventListener('click', e => { const q = pickQuery(e.offsetX, e.offsetY, W, H); if (q) openQuery(q.id); });
cv.addEventListener('mousemove', e => { cv.style.cursor = pickQuery(e.offsetX, e.offsetY, W, H) ? 'pointer' : 'default'; });
addEventListener('keydown', e => {
  if (overlayOpen) { if (e.key === 'Enter') $('#overlay .primary').click(); return; }
  if (!$('#puzzle').hidden) { if (e.key === 'Escape') $('#puzzle').hidden = true; return; }
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
  // Reading a question or an announcement pauses the world. Repairing the link does not.
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
