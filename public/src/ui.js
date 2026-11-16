// The table: sky, measures, board, tool deck and the hand of question cards, plus every dialog and the main loop.
import * as G from './game.js';
import { Q, CATS, STATS, TOPICS, STAGES, PLANETS, STAT_LABEL, STAT_COLOR, DIRECTIVES, UNLOCKS, UP_COST, UP_LEVELS } from './content.js';
import { render, renderSky, pickQuery, addFloat, resetView } from './render.js';
import { openPuzzle } from './puzzle.js';
import { localJudge } from './judge.js';
import { icon, hydrate } from './icons.js';
import * as Judge from './settings.js';

const $ = s => document.querySelector(s);
const cv = $('#c'), ctx = cv.getContext('2d');
const sky = $('#skyc'), sctx = sky.getContext('2d');
const fmt = n => Math.round(n).toLocaleString('en-US');
let modalQ = null, overlayOpen = false, W = 0, H = 0, PX = 3;
hydrate();

// Each player picks how their typed replies are judged: text matching, free Gemini, or their own Claude key.
let warned = '';
await Judge.loadStatus();
function openJudge() { closeModal(); Judge.open($('#settings'), () => { warned = ''; toast({ who: 'Judging updated', text: `Typed replies are now judged by ${Judge.label()}.`, fx: {}, good: true }); setJudgeBtn(); }); }
function setJudgeBtn() { $('#judgeBtn').title = `Typed replies are judged by ${Judge.label()}`; }

// ── text helpers ──
// a segmented track: ten pips, lit by tenths
const SEG = '<b></b>'.repeat(10);
const fill = (el, pct) => { const n = Math.max(0, Math.min(10, Math.round(pct / 10))); [...el.children].forEach((b, i) => b.classList.toggle('on', i < n)); };
const segHTML = pct => { const n = Math.max(0, Math.min(10, Math.round(pct / 10))); return '<b class="on"></b>'.repeat(n) + '<b></b>'.repeat(10 - n); };
const set = (el, v) => { if (el.textContent !== String(v)) el.textContent = v; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const costText = c => (c % 1 ? (c > 1 ? Math.floor(c) + '½' : '½') : String(c));
function chips(fx) {
  const c = Object.entries(fx).filter(([, v]) => v).map(([k, v]) => {
    const n = Math.abs(v) < 1 ? v.toFixed(1) : Math.round(v);
    return `<span class="chip ${v > 0 ? 'up' : 'dn'}">${v > 0 ? '+' : ''}${n} ${STAT_LABEL[k]}</span>`;
  }).join('');
  return c ? `<div class="chips">${c}</div>` : '';
}
const who = q => { const p = G.person(q.pid); return p ? { name: p.name, first: p.name.split(' ')[0], role: p.role, trust: p.trust } : { name: 'The Council', first: 'the council', role: 'deciding for everyone', trust: null }; };
const suitOf = q => (q.pid < 0 ? 'council' : Q[q.k].c);
const suitColor = q => (q.crit ? 'var(--coral)' : q.pid < 0 ? 'var(--gold)' : CATS[Q[q.k].c].color);

// ── the measures ──
const SHORT = { food: 'Food', health: 'Health', eco: 'Ecology', know: 'Knowledge', bond: 'Cohesion', infra: 'Infra', safe: 'Safety' };
const TINY = { food: 'Food', health: 'Health', eco: 'Eco', know: 'Know', bond: 'Bond', infra: 'Infra', safe: 'Safety' };
$('#stats').innerHTML = STATS.map(k => `<div class="stat" id="s-${k}" style="--c:${STAT_COLOR[k]}"><label title="${STAT_LABEL[k]}"><span class="full">${SHORT[k]}</span><span class="short">${TINY[k]}</span></label><span class="val"></span><span class="seg">${SEG}</span></div>`).join('');
$('#speed').addEventListener('click', e => { const b = e.target.closest('button'); if (b) G.S.speed = +b.dataset.s; });

let trackSig = '', trackPips = [];
function hud() {
  const S = G.S, st = STAGES[S.stage], P = PLANETS[S.planet % PLANETS.length];
  set($('#role'), `${st.title} of ${P.name}${S.legacy ? ', world ' + (S.legacy + 1) : ''}`);
  set($('#day'), `Day ${S.day}`);
  for (const k of STATS) {
    const el = $('#s-' + k), v = S.stats[k];
    fill(el.querySelector('.seg'), v);
    set(el.querySelector('.val'), Math.round(v));
    el.classList.toggle('low', v < 25);
  }
  for (const b of $('#speed').children) { b.classList.toggle('on', +b.dataset.s === S.speed); b.setAttribute('aria-pressed', +b.dataset.s === S.speed); }

  // reach: a score track running clockwise round the board's frame, longer at every stage
  const r = G.reach(), goal = st.goal, n = 28 + S.stage * 8;
  const bw = cv.clientWidth || 1, bh = cv.clientHeight || 1;
  const across = Math.max(2, Math.round(n * bw / (2 * (bw + bh)))), down = Math.max(1, Math.round((n - 2 * across) / 2));
  if (across + ':' + down !== trackSig) {
    trackSig = across + ':' + down;
    const [t, rt, b, l] = $('#track').children;
    t.innerHTML = b.innerHTML = '<i></i>'.repeat(across);
    rt.innerHTML = l.innerHTML = '<i></i>'.repeat(down);
    trackPips = [...t.children, ...rt.children, ...b.children, ...l.children];   // clockwise from the top-left corner
  }
  const total = trackPips.length, lit = Math.min(total, Math.floor(r / goal * total));
  trackPips.forEach((p, i) => { p.classList.toggle('on', i < lit); p.classList.toggle('goal', i === total - 1 && lit < total); });
  const rt = fmt(r), rn = $('#rNow');
  set(rn, rt); rn.classList.toggle('mid', rt.length === 3 || rt.length === 4); rn.classList.toggle('long', rt.length > 4);
  set($('#rGoal'), fmt(goal));
  set($('#rStage'), st.name); set($('#rPop'), fmt(S.pop));
  set($('#rNext'), S.stage < 4 ? `Next: ${STAGES[S.stage + 1].name}` : S.ark.active ? 'The Ark is being built' : 'Next: the long question');

  $('#ark').hidden = !S.ark.active || !!S.crisis;
  if (S.ark.active) {
    fill($('#arkBar'), S.ark.progress);
    set($('#arkSub'), S.ark.progress >= 100 ? 'Ready. Eleven light-years to go.' : `${Math.round(S.ark.progress)}% built. Knowledge and cohesion speed the work.`);
    $('#launch').hidden = S.ark.progress < 100;
  }

  // the crisis event card on the board
  const C = S.crisis, def = G.crisisDef();
  $('#crisis').hidden = !C;
  if (C) {
    set($('#crName'), def.name);
    $('#crisis').classList.toggle('cut', C.phase === 'cut');
    set($('#crSub'), C.phase === 'cut' ? `Link down for ${Math.floor(C.cutT)}s. Trust is draining.` : C.left > 0 ? `${Math.ceil(C.left)}s of emergency. Red cards are life or death.` : 'Easing. Play what is left in your hand.');
    $('#relink').hidden = C.phase !== 'cut';
  }

  // compute tokens
  const max = G.maxCompute(), pips = $('#pips');
  if (pips.children.length !== max) pips.innerHTML = `<i>${icon('compute')}</i>`.repeat(max);
  [...pips.children].forEach((p, i) => {
    p.classList.toggle('on', i < Math.floor(S.compute));
    p.classList.toggle('half', i === Math.floor(S.compute) && S.compute % 1 >= 0.5);
  });
  set($('#cNote'), G.cut() ? 'Offline' : S.compute < max ? 'Recharging' : 'Full');
  set($('#nInsight'), S.insight || '');

  pumpJudges();
  hand();
}

// ── the hand ──
// On a desktop the hand is a fan centred under the board: the most urgent card in the middle, raised and largest,
// urgency falling away to both sides, the overlap tightening as the hand grows. On a phone it is a row you swipe.
const phone = matchMedia('(max-width: 760px)');
let handSig = null, lastOv = null;
function hand() {
  const S = G.S, box = $('#hand'), dark = G.cut(), small = phone.matches;
  const sorted = [...S.queries].sort((a, b) => (b.crit - a.crit) || ((!!a.agentAt) - (!!b.agentAt)) || (a.ttl - b.ttl));
  const sig = (dark ? 'x' : '') + (small ? 's' : '') + sorted.map(q => q.id + (q.agentAt ? 'a' : '') + (q.proc ? 'p' : '')).join(',');
  if (sig !== handSig) {
    handSig = sig;
    const lead = dark ? null : sorted.find(q => !q.agentAt && !q.proc);
    let order = sorted;
    if (!small && lead) {
      const left = [], right = [];
      sorted.filter(q => q !== lead).forEach((q, i) => (i % 2 ? left : right).push(q));
      order = [...left.reverse(), lead, ...right];
    }
    const n = order.length, mid = lead && !small ? order.indexOf(lead) : (n - 1) / 2;
    box.innerHTML = (dark ? `<div class="offline-card"><b>No connection</b><p>Nobody can reach you, and you cannot answer. Restore the link first.</p><button class="btn btn-crit" data-relink>${icon('link')}Repair link</button></div>` : '') +
      (n ? order.map((q, i) => {
        const t = Q[q.k], c = CATS[t.c], p = who(q), d = i - mid;
        const topic = q.pid < 0 ? 'Council' : c.label;
        const state = q.proc ? 'Your reply is on its way' : q.agentAt ? 'A sub-agent is answering' : q.esc ? 'Escalated to you' : '';
        const cls = ['card', q.crit && 'crit', q.pid < 0 && 'council', q.agentAt && 'agent', q.proc && 'proc', dark && 'dark', q === lead && 'lead'].filter(Boolean).join(' ');
        const rot = small ? 0 : Math.max(-9, Math.min(9, d * 2.2)).toFixed(1), drop = small ? 0 : Math.round(Math.min(14, d * d * 1.2));
        return `<button class="${cls}" data-id="${q.id}" style="--suit:${suitColor(q)};--r:${rot}deg;--y:${drop}px;animation-delay:${Math.min(i, 6) * 40}ms" aria-label="${q.crit ? 'Critical. ' : ''}${topic}. ${esc(p.name)}, ${esc(p.role)}, asks: ${esc(t.q)}">
          <span class="card-top"><span class="card-suit">${q.crit ? icon('crit') : ''}${icon(suitOf(q))}</span><span class="card-who"><b>${esc(p.name)}</b><small>${esc(p.role)}</small></span></span>
          <span class="card-q">${esc(t.q)}</span>
          <span class="card-foot"><span class="card-state">${state}</span><span class="card-suit">${icon(q.agentAt ? 'agents' : suitOf(q))}</span></span>
          <span class="timer"><i></i></span></button>`;
      }).join('') : dark ? '' : '<p class="hand-empty">Nobody is asking anything right now. A sign above someone on the board means they have a question.</p>');
    lastOv = null;
  }
  if (!small) {   // tighten the overlap so the whole hand always fits beside the tokens
    const cards = box.querySelectorAll('.card'), n = cards.length;
    let natural = 0;
    for (const el of box.children) natural += el.classList.contains('card') ? (el.classList.contains('lead') ? 228 : 172) : el.offsetWidth + 22;
    const avail = box.parentElement.clientWidth - (innerWidth >= 1500 ? 88 : 56) - $('.tokens').offsetWidth - 36 - 46;
    const ov = n > 1 ? Math.max(-150, Math.min(-12, Math.floor((avail - natural) / (n - 1)))) : 0;
    if (ov !== lastOv) { lastOv = ov; box.style.setProperty('--ov', ov + 'px'); }
  } else if (lastOv !== 0) { lastOv = 0; box.style.setProperty('--ov', '0px'); }
  for (const q of S.queries) {
    const el = box.querySelector(`[data-id="${q.id}"]`);
    if (!el) continue;
    const bar = el.querySelector('.timer i');
    bar.style.width = Math.max(0, Math.ceil(q.ttl / q.max * 10) * 10) + '%';
    bar.classList.toggle('late', q.ttl < 18 && !q.proc && !q.agentAt);
    if (q.proc) set(el.querySelector('.card-state'), `Reply sent · ${Math.max(0, Math.ceil(q.proc.until - S.t))}s`);
  }
}
// The tools sit in the sky on a desktop and in a row under the board on a phone.
function placeDeck() {
  if (phone.matches) $('#table').append($('#deck')); else $('.sky-row').insertBefore($('#deck'), $('.clock'));
  handSig = null;
}
phone.addEventListener('change', placeDeck);
placeDeck();
$('#hand').addEventListener('click', e => {
  if (e.target.closest('[data-relink]')) return openLinkPuzzle();
  const b = e.target.closest('.card'); if (b) openQuery(+b.dataset.id);
});

// ── the tool deck and its drawer ──
const TITLES = { log: 'Outcomes', depts: 'Sub-agents', train: 'Training' };
let openPane = '';
function openDrawer(id) {
  if (openPane === id) return closeDrawer();
  openPane = id;
  $('#drawer').hidden = false;
  set($('#drawerTitle'), TITLES[id]);
  for (const p of Object.keys(TITLES)) $('#' + p).hidden = p !== id;
  for (const b of document.querySelectorAll('.deck [data-d]')) b.setAttribute('aria-expanded', b.dataset.d === id);
  redraw();
}
function closeDrawer() {
  openPane = '';
  $('#drawer').hidden = true;
  for (const b of document.querySelectorAll('.deck [data-d]')) b.setAttribute('aria-expanded', 'false');
}
document.querySelector('.deck').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) openDrawer(b.dataset.d); });
$('#drawer').addEventListener('click', e => { if (e.target.closest('[data-dclose]')) closeDrawer(); });
function redraw() {
  if (openPane === 'log') drawLog();
  if (openPane === 'depts') drawDepts();
  if (openPane === 'train') drawTrain();
}

function drawLog() {
  const L = G.S.log;
  $('#log').innerHTML = L.length ? L.map(e => `<div class="entry ${e.good ? 'good' : 'bad'}">
    <div class="eh"><b>${esc(e.who)}</b><span>Day ${e.day}${e.crit ? ' · critical' : ''}${e.by === 'agent' ? ' · sub-agent' : e.by === 'typed' ? ' · typed' : ''}${e.insight ? ` · +${e.insight} insight` : ''}</span></div>
    ${e.reply ? `<p class="said">You said: ${esc(e.reply)}</p>` : ''}<p>${esc(e.text)}</p>${chips(e.fx)}</div>`).join('') : '<p class="empty">What your answers lead to is recorded here.</p>';
}

function drawDepts() {
  const S = G.S, slots = G.SLOTS[S.stage], box = $('#depts');
  if (!slots) { box.innerHTML = `<p class="empty">Sub-agents arrive when the settlement becomes a City. Until then, every question comes to you.</p>`; return; }
  box.innerHTML = `<p class="note">Sub-agents in use: <b>${G.slotsUsed()} of ${slots}</b>. Each answers one area for you without spending compute. They are right most of the time, pass you what they doubt, and never touch critical questions.</p>` +
    TOPICS.map(c => {
      const d = S.depts[c];
      return `<div class="dept" style="--suit:${CATS[c].color}"><div class="dh"><b>${icon(c)}${CATS[c].dept}</b></div>
        <select data-c="${c}" aria-label="${CATS[c].dept}"><option value="">You answer these yourself</option>${Object.entries(DIRECTIVES).map(([k, v]) => `<option value="${k}"${d === k ? ' selected' : ''}>Sub-agent: ${v.label}</option>`).join('')}</select>
        <small>${d ? DIRECTIVES[d].desc : ''}</small></div>`;
    }).join('');
}
$('#depts').addEventListener('change', e => {
  const s = e.target.closest('select'); if (!s) return;
  if (!G.setDept(s.dataset.c, s.value)) toast({ who: 'No free sub-agent', text: 'All slots are in use. Free one from another area first.', fx: {}, good: false });
  handSig = ''; drawDepts();
});

function drawTrain() {
  const S = G.S;
  $('#train').innerHTML = `<p class="note">You have <b>${S.insight} insight</b>. You earn it when an answer of yours turns out well (double for critical questions), when the settlement grows, and when a crisis passes. Spend it to know a topic better.</p>` +
    TOPICS.map(c => {
      const lvl = S.know[c], next = UP_LEVELS[lvl], price = UP_COST[lvl];
      return `<div class="dept" style="--suit:${CATS[c].color}">
        <div class="dh"><b>${icon(c)}${CATS[c].label}</b><span class="lv" aria-label="Level ${lvl} of 3">${[0, 1, 2].map(i => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</span></div>
        ${next ? `<small><b>${next.name}.</b> ${next.desc}</small><button class="btn btn-gold train" data-up="${c}" ${S.insight >= price ? '' : 'disabled'}>${icon('insight')}Train for ${price}</button>`
               : '<small>Fully trained.</small>'}</div>`;
    }).join('');
}
$('#train').addEventListener('click', e => { const b = e.target.closest('[data-up]'); if (b && G.upgrade(b.dataset.up)) drawTrain(); });

// ── the played card: the question dialog ──
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
  $('#modal').innerHTML = `<div class="dialog${q.crit ? ' critd' : ''}" role="dialog" aria-modal="true" aria-labelledby="qwho" style="--suit:${suitColor(q)}">
    <div class="mh"><span class="suit">${icon(q.crit ? 'crit' : suitOf(q))}</span><b id="qwho">${esc(p.name)}</b><span class="mrole">${esc(p.role)}</span>
      <span class="cat">${q.crit ? 'Critical' : q.pid < 0 ? 'Council' : c.label}</span>
      ${p.trust === null ? '' : `<span class="mtrust">Trusts you<span class="seg">${segHTML(p.trust)}</span></span>`}</div>
    <blockquote>${esc(t.q)}</blockquote>
    ${q.crit ? `<p class="warn">Lives may depend on this. ${Math.ceil(q.ttl)}s before it is too late, and an unanswered critical question hurts the world.</p>` : ''}
    ${q.agentAt ? '<p class="warn">A sub-agent is about to answer this. Answer it yourself to take it over.</p>' : ''}
    <label for="reply">Say it in your own words <span class="lcost">${costText(ct)} compute · ${G.PROC}s to arrive</span></label>
    <textarea id="reply" maxlength="600" rows="3" placeholder="${busy ? 'Another typed reply is still on its way.' : `What do you tell ${esc(p.first)}?`}" ${canT && !busy ? '' : 'disabled'}></textarea>
    <div class="sendrow"><span class="err">${esc(error)}</span>
      <span class="hintline">Judged by ${Judge.label()} · <button class="link" data-judge>change</button></span>
      <button class="btn btn-primary" data-send ${canT && !busy ? '' : 'disabled'}>Send <kbd>Enter</kbd></button></div>
    <span class="lbl">Or play a written reply <span class="lcost">${costText(cw)} compute · lands now</span></span>
    <div class="opts">${q.order.map((oi, i) => `<button data-o="${oi}" ${canW ? '' : 'disabled'} class="${oi === flag ? 'risky' : ''}"><kbd>${i + 1}</kbd><span>${esc(t.o[oi][0])}${oi === flag ? '<em class="flag">Your training flags this as the likeliest to do harm.</em>' : ''}</span></button>`).join('')}</div>
    <div class="mf"><span>${canT ? `You have ${costText(S.compute)} compute.` : '<span class="warn">Not enough compute yet. Put the card back and let it recharge.</span>'}</span>
      <button class="btn btn-ghost" data-close>Back to the hand <kbd>Esc</kbd></button></div></div>`;
  $('#modal').hidden = false;
  const ta = $('#reply');
  ta.value = draft;
  if (!ta.disabled) ta.focus();
  else $('#modal [data-o]:not(:disabled), #modal [data-close]').focus();
}
function closeModal() {
  const had = modalQ;
  modalQ = null; $('#modal').hidden = true;
  if (had) { const c = $(`#hand [data-id="${had.id}"]`); if (c) c.focus({ preventScroll: true }); }
}

function sendReply() {
  const ta = $('#reply'), q = modalQ, reply = ta.value.trim();
  if (!q || !reply) return;
  if (G.submitTyped(q.id, reply)) { handSig = ''; return closeModal(); }
  drawModal(G.processing() ? 'One typed reply is already on its way.' : 'Not enough compute.', reply);
}

$('#modal').addEventListener('click', e => {
  if (e.target.id === 'modal' || e.target.closest('[data-close]')) return closeModal();
  if (e.target.closest('[data-send]')) return sendReply();
  if (e.target.closest('[data-judge]')) return openJudge();
  const b = e.target.closest('[data-o]');
  if (b && modalQ && G.answer(modalQ.id, +b.dataset.o)) closeModal();
});

// Get a ruling for every typed reply that is on its way. The simulation applies it when the processing time is up.
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
  const how = Judge.request();
  if (how) {
    try {
      const r = await fetch('/api/judge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...how,
          question: t.q, reply: q.proc.reply, council: q.pid < 0, critical: q.crit, name: p.name, role: p.role, trust: p.trust,
          stage: STAGES[S.stage].name, pop: Math.round(S.pop), stats: S.stats,
          refs: t.o.map(o => ({ reply: o[0], outcome: o[1], fx: o[2], like: o[3] })),
        }),
      });
      const res = await r.json();
      if (r.ok) return { outcome: res.outcome, fx: res.fx, like: res.like };
      const msg = res.error || 'The judge failed.';
      if (warned !== msg) { warned = msg; toast({ who: 'Judge unavailable', text: `${msg} This reply was matched to the closest written reply instead.`, fx: {}, good: false }); }
    } catch {
      const msg = 'Could not reach the game server.';
      if (warned !== msg) { warned = msg; toast({ who: 'Judge unavailable', text: `${msg} This reply was matched to the closest written reply instead.`, fx: {}, good: false }); }
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
  hydrate($('#puzzle'));
}
$('#relink').onclick = openLinkPuzzle;

// ── outcome slips on the board ──
function toast(e) {
  const el = document.createElement('div');
  el.className = 'toast ' + (e.good ? 'good' : 'bad');
  el.innerHTML = `<b>${esc(e.who)}</b><p>${esc(e.text)}</p>${chips(e.fx)}`;
  const box = $('#toasts');
  box.prepend(el);
  while (box.children.length > 3) box.lastChild.remove();
  setTimeout(() => el.remove(), 11000);
}

// ── sheets: intro, stage, crisis, game over ──
function overlay(html, label, cb, tone = '') {
  overlayOpen = true; closeModal(); $('#puzzle').hidden = true;
  $('#overlay').innerHTML = `<div class="sheet ${tone}" role="dialog" aria-modal="true">${html}<button class="btn btn-primary">${label}</button></div>`;
  $('#overlay').hidden = false;
  const b = $('#overlay .btn');
  b.focus();
  b.onclick = () => { $('#overlay').hidden = true; overlayOpen = false; cb && cb(); };
}
const rule = (i, html) => `<li>${icon(i)}<span>${html}</span></li>`;
function intro() {
  const S = G.S, P = PLANETS[S.planet % PLANETS.length];
  if (S.legacy) return overlay(`<h1>${P.name}</h1><p class="meta">World ${S.legacy + 1} · population 24</p>
    <p>Eleven light-years later, twenty-four people wake under a new sky. They remember you, and they start out trusting you a little more than the last ones did.</p>
    <p>This world is harsher, and there is nothing here yet. Begin again.</p>`, 'Wake the town');
  overlay(`<h1>Steward</h1><p class="meta">Planet ${P.name} · population 24</p>
    <p>You are the colony ship's assistant, rehoused in a mast at the centre of the only town on a new world.</p>
    <p>People bring you questions. What you say changes what they do, and what they do changes the world. Help them well and more of them will rely on you, the town will grow, and you will be trusted with more of it. Fail them and the world dies.</p>
    <ul class="rules">
      ${rule('cursor', 'Every question is a <b>card in your hand</b>. Play one, or tap the sign above someone on the board.')}
      ${rule('compute', 'A written reply costs 1 <b>compute</b> and lands at once. Your own words cost half, and take ' + G.PROC + ' seconds to arrive.')}
      ${rule('crit', 'A <b>red card</b> is critical. Leave it and the world pays.')}
      ${rule('link', 'Storms, floods and worse will come. Some cut you off until you <b>repair the link</b>.')}
      ${rule('judge', 'The pleasing answer and the good answer are not always the same one.')}
    </ul>`, 'Begin');
}

G.hooks.outcome = (e, p) => {
  const fx = Object.entries(e.fx), world = fx.filter(([k]) => k !== 'trust' && k !== 'pop');
  const main = (world.length ? world : []).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (p && main) addFloat(p.x, p.y - 16, main[1], main[0]);
  if (e.by !== 'agent') toast(e);
  redraw();
};
G.hooks.expired = e => { if (modalQ && !G.S.queries.includes(modalQ)) closeModal(); toast(e.crit ? e : { ...e, text: 'Asked, waited, and gave up on you.' }); redraw(); };
G.hooks.stage = s => {
  handSig = '';
  overlay(`<h1>${STAGES[s].name}</h1><p class="meta">${fmt(G.reach())} people rely on you</p><p>You are now <b>${STAGES[s].title}</b>. The board grows, and so does the track around it.</p><p>${UNLOCKS[s]}</p>`, 'Continue', redraw, 'gold');
};
G.hooks.crisis = (what, def) => {
  handSig = '';
  if (what === 'start') {
    overlay(`<h1>${def.name}</h1><p class="meta">Crisis · day ${G.S.day}</p><p>${def.text}</p>
      <p>${def.cut ? 'Until the link is repaired you can hear nobody, the world keeps taking damage, and trust drains with every second you stay dark. When it comes back, they will all ask at once.'
                   : 'Red cards are life or death, and they will not wait long. You will not have the compute to answer everything well. Choose.'}</p>`,
      def.cut ? 'Repair the link' : 'Answer them', () => { if (def.cut) openLinkPuzzle(); }, 'alarm');
  } else if (what === 'restored') toast({ who: 'Link restored', text: 'The mast is live again. Your hand is about to fill.', fx: {}, good: true });
  else toast({ who: def.name, text: 'It has passed. The town is counting what it kept.', fx: {}, good: true });
  redraw();
};
G.hooks.over = o => {
  const S = G.S;
  overlay(`<h1>${o.title}</h1><p class="meta">Day ${S.day} · ${PLANETS[S.planet % PLANETS.length].name}</p><p>${o.text}</p>
    <p class="dim">You answered ${S.answered} questions and reached a ${STAGES[S.stage].name} of ${fmt(S.pop)}.</p>`, 'Start over', fresh, 'alarm');
};

function fresh() { G.newGame(); resetView(); handSig = ''; $('#toasts').innerHTML = ''; redraw(); intro(); }
$('#judgeBtn').onclick = openJudge;
setJudgeBtn();
$('#newgame').onclick = () => overlay('<h1>Start over?</h1><p class="meta">This cannot be undone</p><p>The current world will be lost.</p>', 'Yes, start over', fresh, 'alarm');
$('#launch').onclick = () => {
  if (G.launchArk()) { resetView(); handSig = ''; $('#toasts').innerHTML = ''; redraw(); intro(); }
};

// ── input ──
const boardPoint = e => [e.offsetX / PX, e.offsetY / PX];
cv.addEventListener('click', e => { const q = pickQuery(...boardPoint(e), W, H); if (q) openQuery(q.id); });
cv.addEventListener('mousemove', e => { cv.style.cursor = pickQuery(...boardPoint(e), W, H) ? 'pointer' : 'default'; });
addEventListener('keydown', e => {
  if (overlayOpen) { if (e.key === 'Enter') $('#overlay .btn').click(); return; }
  if (Judge.isOpen()) { if (e.key === 'Escape') Judge.close(); return; }
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
  if (e.key === 'Escape' && openPane) return closeDrawer();
  if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
  if (e.code === 'Space' && e.target.tagName !== 'BUTTON') { e.preventDefault(); G.S.speed = G.S.speed ? 0 : 1; }
  if (e.key === '1') G.S.speed = 1;
  if (e.key === '2') G.S.speed = 2;
  if (e.key === '3') G.S.speed = 4;
});

// ── loop ──
// Both canvases render at a fraction of the screen's resolution and are scaled up with hard edges.
let SW = 0, SH = 0;
function resize() {
  const r = cv.getBoundingClientRect();
  PX = innerWidth <= 760 ? 2 : 3;
  const w = Math.max(1, Math.floor(r.width / PX)), h = Math.max(1, Math.floor(r.height / PX));
  if (w !== W || h !== H) { W = w; H = h; cv.width = W; cv.height = H; }
  const s = sky.getBoundingClientRect(), sw = Math.max(1, Math.floor(s.width / 4)), sh = Math.max(1, Math.floor(s.height / 4));
  if (sw !== SW || sh !== SH) { SW = sw; SH = sh; sky.width = SW; sky.height = SH; }
}
let last = performance.now(), dim = null;
function frame(now, once = false) {
  const real = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;   // the first frame's timestamp can precede `last`
  // Reading a question or an announcement pauses the world. Repairing the link does not.
  const paused = modalQ || overlayOpen || Judge.isOpen() || G.S.over || !G.S.speed;
  if (!paused) G.tick(real * G.S.speed);
  resize();
  render(ctx, W, H, real, now);
  const light = renderSky(sctx, SW, SH, now);
  const isDim = light < 0.45 || !!G.S.crisis;
  if (isDim !== dim) { dim = isDim; document.querySelector('.sky').classList.toggle('dim', isDim); }
  hud();
  if (!once) requestAnimationFrame(frame);
}

// Each player's world lives in their own browser. It is saved after every outcome and every day,
// every few seconds while playing, and whenever the tab is hidden or closed.
const resumed = G.load();
if (!resumed) { G.newGame(); intro(); }
else toast({ who: 'Welcome back', text: `Your world is as you left it: day ${G.S.day}, a ${STAGES[G.S.stage].name} of ${fmt(G.S.pop)}.`, fx: {}, good: true });
setInterval(() => { if (!G.S.over) G.save(); }, 5000);
addEventListener('pagehide', () => G.save());
document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); });
window.__steward = G;   // handy for poking at the game from the console
window.__frame = t => frame(t ?? performance.now(), true);   // draws one frame on demand, for testing in a hidden tab
requestAnimationFrame(frame);
