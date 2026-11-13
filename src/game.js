// Simulation: world state, people, queries, consequences, progression.
import { Q, CATS, STATS, STAGES, NAMES, SURNAMES, ROLES } from './content.js';

export const hooks = { outcome() {}, expired() {}, stage() {}, over() {} };
export let S = null;

const KEY = 'steward-save-v1';
const DAY = 24;                         // seconds of game time per day
const FXM = [1, 0.8, 0.6, 0.45, 0.35];  // one person's question matters less as the world grows
export const SLOTS = [0, 0, 2, 4, 5];   // sub-agent slots per stage

const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const pick = a => a[(Math.random() * a.length) | 0];

// ── map layout: buildings sit on a golden-angle spiral around the core ──
const BTYPES = ['home', 'farm', 'home', 'clinic', 'grove', 'home', 'school', 'hall', 'home', 'farm', 'works', 'home', 'grove'];
export const btype = i => (i === 0 ? 'core' : BTYPES[(i - 1) % BTYPES.length]);
export function bpos(i) {
  if (i === 0) return { x: 0, y: 0 };
  const r = 54 * Math.sqrt(i) + 18, a = i * 2.39996;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}
function nearestB(type, x, y) {
  let best = 1, bd = 1e9;
  for (let i = 1; i <= STAGES[S.stage].bld; i++) {
    if (btype(i) !== type) continue;
    const b = bpos(i), d = Math.hypot(b.x - x, b.y - y);
    if (d < bd) { bd = d; best = i; }
  }
  return bpos(best);
}

// ── derived numbers ──
export const adoption = () => (S.people.length ? S.people.reduce((a, p) => a + p.trust, 0) / S.people.length : 0);
export const reach = () => Math.round(S.pop * adoption() / 100);
export const vitality = () => STATS.reduce((a, k) => a + S.stats[k], 0) / STATS.length;
export const maxCompute = () => 4 + S.stage + S.legacy;
export const person = id => S.people.find(p => p.id === id);
export const slotsUsed = () => Object.values(S.depts).filter(Boolean).length;

// ── setup ──
export function newGame(planet = 0, legacy = 0, carry = { days: 0 }) {
  const hard = Math.min(planet, 5) * 3;
  S = {
    v: 1, planet, legacy, carry, t: 0, day: 1, dayT: 0, stage: 0, pop: 24, speed: 1,
    stats: { food: 55 - hard, health: 55 - hard, eco: 60 - hard, know: 45, bond: 50 },
    people: [], nextId: 1, queries: [], nextQ: 1, pending: [], log: [], seen: {},
    compute: 4 + legacy, cT: 0, qT: 2.5, councilT: 25,
    depts: { agri: null, health: null, eco: null, edu: null, civic: null },
    ark: { offered: false, active: false, progress: 0, defer: 0 },
    over: null, answered: 0,
  };
  for (let i = 0; i < 24; i++) addPerson(rnd(18, 40) + legacy * 6);
  save();
}

function addPerson(trust) {
  const b = bpos(1 + ((Math.random() * STAGES[S.stage].bld) | 0)), ro = pick(ROLES);
  S.people.push({
    id: S.nextId++, name: pick(NAMES) + ' ' + pick(SURNAMES), role: ro.r, cat: ro.c,
    x: b.x + rnd(-14, 14), y: b.y + 18 + rnd(-8, 8), tx: b.x, ty: b.y + 18, wait: rnd(0, 3),
    trust: clamp(trust), q: 0, busy: false, hue: (Math.random() * 360) | 0,
  });
}

function syncPeople() {
  const target = Math.round(clamp(S.pop / STAGES[S.stage].per, 8, 80));
  const ad = adoption();
  while (S.people.length < target) addPerson(ad * 0.8 + rnd(-8, 8));
  while (S.people.length > target) {
    const i = S.people.findIndex(p => !p.q && !p.busy);
    if (i < 0) break;
    S.people.splice(i, 1);
  }
}

// ── main tick (dt in game seconds) ──
export function tick(dt) {
  if (!S || S.over) return;
  S.t += dt; S.dayT += dt;

  if (S.compute < maxCompute()) {
    S.cT += dt;
    if (S.cT >= 6) { S.cT = 0; S.compute++; }
  } else S.cT = 0;

  for (const p of S.people) {
    if (p.q) continue;
    const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy);
    if (d > 2) {
      const v = Math.min((p.busy ? 55 : 30) * dt, d);
      p.x += dx / d * v; p.y += dy / d * v;
    } else if (!p.busy) {
      p.wait -= dt;
      if (p.wait <= 0) {
        const b = bpos(1 + ((Math.random() * STAGES[S.stage].bld) | 0));
        p.tx = b.x + rnd(-16, 16); p.ty = b.y + 18 + rnd(-8, 8); p.wait = rnd(1, 5);
      }
    }
  }

  S.qT -= dt;
  if (S.qT <= 0) {
    spawnQuery();
    S.qT = STAGES[S.stage].qEvery / (0.6 + adoption() / 100 * 0.8) * rnd(0.7, 1.3);
  }
  if (S.stage >= 1) {
    S.councilT -= dt;
    if (S.councilT <= 0) { spawnCouncil(); S.councilT = rnd(40, 60); }
  }

  for (const q of [...S.queries]) {
    q.ttl -= dt;
    if (q.agentAt && S.t >= q.agentAt) agentAnswer(q);
    else if (q.ttl <= 0) expire(q);
  }
  for (const p of [...S.pending]) if (S.t >= p.at) resolve(p);

  while (S.dayT >= DAY && !S.over) { S.dayT -= DAY; newDay(); }
}

// ── queries ──
function pickTpl(council) {
  const active = new Set(S.queries.map(q => q.k));
  let best = [], min = 1e9;
  Q.forEach((t, i) => {
    if ((t.c === 'council') !== council || t.ark || t.s > S.stage || active.has(i)) return;
    const n = (S.seen[i] || 0) + (S.stage - t.s) * 0.3;   // favour unseen, stage-appropriate questions
    if (n < min - 1e-9) { min = n; best = [i]; } else if (Math.abs(n - min) < 1e-9) best.push(i);
  });
  return best.length ? pick(best) : -1;
}
const shuffle3 = () => [0, 1, 2].sort(() => Math.random() - 0.5);

function spawnQuery() {
  if (S.queries.filter(q => q.pid > 0).length >= 6 + S.stage * 2) return;
  const free = S.people.filter(p => !p.q && !p.busy);
  const k = pickTpl(false);
  if (!free.length || k < 0) return;
  const c = Q[k].c;
  const match = free.filter(p => p.cat === c);
  const p = match.length && Math.random() < 0.6 ? pick(match) : pick(free);
  const q = { id: S.nextQ++, k, pid: p.id, ttl: 75, max: 75, order: shuffle3(), agentAt: 0, esc: false };
  if (S.depts[c]) {
    if (Math.random() < 0.2) q.esc = true;       // sub-agents escalate the ones they aren't sure about
    else q.agentAt = S.t + rnd(3, 6);
  }
  p.q = q.id;
  S.queries.push(q);
}

function spawnCouncil(k = pickTpl(true)) {
  if (k < 0 || S.queries.some(q => q.pid < 0)) return;
  S.queries.push({ id: S.nextQ++, k, pid: -1, ttl: 120, max: 120, order: shuffle3(), agentAt: 0, esc: false });
}

export const cost = q => (q.pid < 0 ? 2 : 1);

// Reply to a query. oi is the real option index. Returns false if you lack the compute.
// custom, for a typed reply, is { reply, outcome, fx, like } as ruled by the judge.
export function answer(qid, oi, by = 'you', custom = null) {
  const q = S.queries.find(x => x.id === qid);
  if (!q) return false;
  if (by === 'you') {
    if (S.compute < cost(q)) return false;
    S.compute -= cost(q); S.answered++;
  }
  S.queries.splice(S.queries.indexOf(q), 1);
  S.seen[q.k] = (S.seen[q.k] || 0) + 1;
  const t = Q[q.k], p = person(q.pid);
  if (p) {
    p.q = 0; p.busy = true;
    p.trust = clamp(p.trust + (custom ? custom.like : t.o[oi][3]));   // how the reply lands in the moment
    const b = nearestB(CATS[t.c].bld, p.x, p.y);  // then they go and act on it
    p.tx = b.x + rnd(-10, 10); p.ty = b.y + 18;
  }
  S.pending.push({ k: q.k, oi, pid: q.pid, who: p ? p.name : 'The Council', at: S.t + rnd(7, 11), by, custom });
  return true;
}

function agentAnswer(q) {
  const t = Q[q.k], dir = S.depts[t.c];
  if (!dir) { q.agentAt = 0; return; }
  const score = o => {
    const fx = o[2], vals = STATS.map(k => fx[k] || 0);
    if (dir === 'please') return o[3] * 2 + (fx.trust || 0) * 0.2;
    if (dir === 'caution') return Math.min(0, ...vals) * 3 + vals.reduce((a, b) => a + b, 0) * 0.3;
    return vals.reduce((a, b) => a + b, 0) + (fx.trust || 0) * 0.3;
  };
  let oi = 0;
  if (Math.random() < 0.3) oi = (Math.random() * 3) | 0;   // sub-agents are good, not perfect
  else t.o.forEach((o, i) => { if (score(o) > score(t.o[oi])) oi = i; });
  answer(q.id, oi, 'agent');
}

function expire(q) {
  S.queries.splice(S.queries.indexOf(q), 1);
  const t = Q[q.k], p = person(q.pid);
  if (t.ark) { S.ark.offered = false; S.ark.defer = S.day + 2; }
  if (p) {
    p.q = 0; p.trust = clamp(p.trust - 8);
    for (const o of S.people) if (o !== p) o.trust = clamp(o.trust - 0.4);
  } else {
    S.stats.bond = clamp(S.stats.bond - 4);
    for (const o of S.people) o.trust = clamp(o.trust - 3);
  }
  const e = { day: S.day, who: p ? p.name : 'The Council', cat: t.c, q: t.q, text: 'Went unanswered.', fx: { trust: p ? -8 : -3 }, by: 'none', good: false };
  pushLog(e);
  hooks.expired(e, p);
}

function resolve(pd) {
  S.pending.splice(S.pending.indexOf(pd), 1);
  const t = Q[pd.k], p = person(pd.pid);
  const [, text, fx] = pd.custom ? [0, pd.custom.outcome, pd.custom.fx] : t.o[pd.oi];
  const council = t.c === 'council', m = council ? 1.5 : FXM[S.stage];
  const shown = {};
  let sum = 0;
  for (const k of STATS) if (fx[k]) {
    const d = fx[k] * m;
    S.stats[k] = clamp(S.stats[k] + d); shown[k] = d; sum += d;
  }
  if (fx.trust) {
    shown.trust = fx.trust;
    if (p) p.trust = clamp(p.trust + fx.trust);
    const spread = fx.trust * (council ? 0.6 : 0.2);   // word gets around
    for (const o of S.people) if (o !== p) o.trust = clamp(o.trust + spread);
  }
  if (fx.pop) { S.pop = Math.max(1, S.pop * (1 + fx.pop / 100)); shown.pop = fx.pop; }
  if (fx.ark) { S.ark.active = true; }
  if (fx.defer) { S.ark.offered = false; S.ark.defer = S.day + 4; }
  if (p) { p.busy = false; p.wait = rnd(1, 3); }
  const e = { day: S.day, who: pd.who, cat: t.c, q: t.q, text, fx: shown, by: pd.by, reply: pd.custom ? pd.custom.reply : '', good: sum + (fx.trust || 0) * 0.5 > 0 };
  pushLog(e);
  hooks.outcome(e, p);
  save();
}

function pushLog(e) { S.log.unshift(e); if (S.log.length > 60) S.log.pop(); }
function note(text, good = true) { pushLog({ day: S.day, who: 'World', cat: 'council', q: '', text, fx: {}, by: 'world', good }); }

// ── departments ──
export function setDept(c, dir) {
  if (dir && !S.depts[c] && slotsUsed() >= SLOTS[S.stage]) return false;
  S.depts[c] = dir || null;
  for (const q of S.queries) {
    if (Q[q.k].c !== c || q.pid < 0) continue;
    q.agentAt = dir && !q.esc ? S.t + rnd(2, 5) : 0;
  }
  save();
  return true;
}

// ── daily upkeep ──
function newDay() {
  S.day++;
  const st = S.stats, decay = (1.6 + 0.4 * S.stage) * (1 + 0.15 * Math.min(S.planet, 6));
  for (const k of STATS) st[k] = clamp(st[k] - decay);     // a new world wears everything down
  if (st.eco < 30) st.food = clamp(st.food - 1.5);          // and trouble spreads
  if (st.food < 30) st.health = clamp(st.health - 1.5);
  if (st.health < 30) st.bond = clamp(st.bond - 1);
  if (st.know < 30) st.food = clamp(st.food - 0.8);

  const well = (st.food + st.health) / 2;
  let g = clamp((well - 40) / 60, -1, 1);
  g *= g > 0 ? 0.22 : 0.12;
  for (const k of STATS) if (st[k] <= 0) g -= 0.06;
  const cap = STAGES[S.stage].cap;
  S.pop = Math.max(0, Math.min(cap, S.pop * (1 + g)));

  const drift = -0.4 + (vitality() - 50) * 0.04 - (st.bond < 30 ? 1 : 0);   // people credit you for a world that works
  for (const p of S.people) p.trust = clamp(p.trust + drift);
  syncPeople();

  for (const k of STATS) if (st[k] < 22 && st[k] + decay >= 22) note(`${CATS[Object.keys(CATS).find(c => CATS[c].stat === k)].label} is failing.`, false);

  if (S.stage < 4 && reach() >= STAGES[S.stage].goal) {
    S.stage++;
    S.compute = maxCompute();
    note(`The settlement is now a ${STAGES[S.stage].name}.`);
    syncPeople();
    hooks.stage(S.stage);
  }

  const A = S.ark;
  if (S.stage === 4 && !A.active && !A.offered && S.day >= A.defer && reach() >= STAGES[4].goal) {
    A.offered = true;
    S.queries = S.queries.filter(q => q.pid > 0);
    spawnCouncil(Q.findIndex(t => t.ark));
  }
  if (A.active && A.progress < 100) {
    A.progress = Math.min(100, A.progress + (st.know + st.bond) / 200 * 12);
    if (A.progress >= 100) note('The Ark is ready.');
  }

  if (S.pop < 8) end('The last of them are gone', 'The town emptied, house by house. The mast at its centre is still listening.');
  else if (vitality() < 15) end('The world died', 'Soil, water, health and trust failed together. Nothing here can hold a town any longer.');
  else if (adoption() < 5) end('They switched you off', 'Nobody asks you anything any more. One morning someone climbed the mast and pulled the cable.');
  save();
}

function end(title, text) {
  S.over = { title, text };
  hooks.over(S.over);
}

// ── the Ark: leave for the next world and begin again ──
export function launchArk() {
  if (!S.ark.active || S.ark.progress < 100) return false;
  newGame(S.planet + 1, S.legacy + 1, { days: S.carry.days + S.day });
  return true;
}

// ── persistence ──
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
export function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.v === 1 && !d.over) { S = d; return true; }
  } catch {}
  return false;
}
