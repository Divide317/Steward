// Simulation: world state, people, queries, consequences, crises, training, progression.
import { Q, CATS, STATS, TOPICS, STAGES, NAMES, SURNAMES, ROLES, CRISES, UP_COST } from './content.js';

export const hooks = { outcome() {}, expired() {}, stage() {}, over() {}, crisis() {} };
export let S = null;

const KEY = 'steward-save-v2';
const DAY = 24;                         // seconds of game time per day
const FXM = [1, 0.8, 0.6, 0.45, 0.35];  // one person's question matters less as the world grows
export const SLOTS = [0, 0, 3, 5, 7];   // sub-agent slots per stage
export const PROC = 10;                 // seconds a typed reply takes to process

const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const pick = a => a[(Math.random() * a.length) | 0];

// ── map layout: buildings sit on a golden-angle spiral around the core ──
const BTYPES = ['home', 'farm', 'home', 'clinic', 'grove', 'home', 'school', 'hall', 'works', 'watch', 'home', 'farm', 'home', 'grove'];
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
export const cut = () => !!S.crisis && S.crisis.phase === 'cut';
export const crisisDef = () => (S.crisis ? CRISES.find(c => c.id === S.crisis.id) : null);
export const cost = (q, typed = false) => (q.pid < 0 ? 2 : 1) * (typed ? 0.5 : 1);   // typing is cheaper, and slower
export const processing = () => S.queries.some(q => q.proc);

// ── setup ──
export function newGame(planet = 0, legacy = 0, carry = { days: 0 }) {
  const hard = Math.min(planet, 5) * 3;
  S = {
    v: 2, planet, legacy, carry, t: 0, day: 1, dayT: 0, stage: 0, pop: 24, speed: 1,
    stats: { food: 55 - hard, health: 55 - hard, eco: 60 - hard, know: 45, bond: 50, infra: 50 - hard, safe: 55 },
    people: [], nextId: 1, queries: [], nextQ: 1, pending: [], log: [], seen: {},
    compute: 4 + legacy, cT: 0, qT: 2.5, councilT: 25, critT: rnd(55, 80),
    depts: Object.fromEntries(TOPICS.map(c => [c, null])),
    know: Object.fromEntries(TOPICS.map(c => [c, 0])), insight: legacy * 2,
    crisis: null, crisisT: rnd(110, 150), lastCrisis: '',
    ark: { offered: false, active: false, progress: 0, defer: 0 },
    over: null, answered: 0, marks: [], scars: [],
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
    if (S.cT >= 6) { S.cT = 0; S.compute = Math.min(maxCompute(), S.compute + 1); }
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

  crisisTick(dt);

  if (!cut()) {
    const surge = S.crisis ? 1.8 : 1;   // in a crisis everyone asks at once
    S.qT -= dt * surge;
    if (S.qT <= 0) {
      spawn('normal');
      S.qT = STAGES[S.stage].qEvery / (0.6 + adoption() / 100 * 0.8) * rnd(0.7, 1.3);
    }
    if (S.stage >= 1 && !S.crisis) {
      S.councilT -= dt;
      if (S.councilT <= 0) { spawnCouncil(); S.councilT = rnd(40, 60); }
    }
    if (!S.crisis) {
      S.critT -= dt;
      if (S.critT <= 0) { spawn('crit'); S.critT = rnd(80, 130); }
    }
    for (const q of [...S.queries]) {
      if (q.proc) {                      // a typed reply is being worked out: the clock stops for them
        if (S.t >= q.proc.until && q.proc.res) answer(q.id, 0, 'typed', { ...q.proc.res, reply: q.proc.reply });
        continue;
      }
      q.ttl -= dt;
      if (q.agentAt && S.t >= q.agentAt) agentAnswer(q);
      else if (q.ttl <= 0) expire(q);
    }
  }
  for (const p of [...S.pending]) if (S.t >= p.at) resolve(p);

  while (S.dayT >= DAY && !S.over) { S.dayT -= DAY; newDay(); }
}

// ── crises ──
function crisisTick(dt) {
  const C = S.crisis;
  if (!C) {
    S.crisisT -= dt;
    if (S.crisisT <= 0) startCrisis();
    return;
  }
  const def = crisisDef(), k = (C.phase === 'cut' ? 1.5 : 1) * dt / DAY;
  for (const s in def.drain) S.stats[s] = clamp(S.stats[s] - def.drain[s] * k);
  if (C.phase === 'cut') {              // every second you are dark, people learn to do without you
    C.cutT += dt;
    for (const p of S.people) p.trust = clamp(p.trust - 0.1 * dt);
    return;
  }
  C.left -= dt; C.qT -= dt;
  if (C.left > 0 && C.qT <= 0) { spawn('x'); C.qT = rnd(5, 9); }
  if (C.left <= 0 && !S.queries.some(q => q.x)) endCrisis();
}

function startCrisis() {
  const options = CRISES.filter(c => c.s <= S.stage && c.id !== S.lastCrisis);
  const def = pick(options);
  S.lastCrisis = def.id;
  S.crisis = { id: def.id, phase: def.cut ? 'cut' : 'surge', puzzle: def.cut, left: 50, qT: 1.5, cutT: 0, used: [] };
  for (const q of S.queries) q.agentAt = 0;
  note(def.text, false);
  hooks.crisis('start', def);
  save();
}

// Called by the interface when the reconnection puzzle is solved.
export function restoreLink() {
  if (!cut()) return;
  S.crisis.phase = 'surge';
  note('The link is back. Everyone is asking at once.');
  hooks.crisis('restored', crisisDef());
  save();
}

function endCrisis() {
  const def = crisisDef();
  S.crisis = null;
  const at = bpos(1 + ((Math.random() * STAGES[S.stage].bld) | 0));   // the crisis leaves a scar on the board
  (S.scars ||= []).push({ x: Math.round(at.x + rnd(-20, 20)), y: Math.round(at.y + rnd(-20, 20)), tint: def.tint });
  if (S.scars.length > 8) S.scars.shift();
  S.crisisT = rnd(130, 200);
  S.insight += 2;
  note(`The ${def.name.toLowerCase()} has passed. +2 insight.`);
  hooks.crisis('end', def);
  save();
}

// ── queries ──
function pickTpl(pred) {
  const active = new Set(S.queries.map(q => q.k));
  const byCat = {};
  Q.forEach((t, i) => {
    if (t.ark || t.s > S.stage || active.has(i) || !pred(t, i)) return;
    const n = (S.seen[i] || 0) + (S.stage - t.s) * 0.3;   // favour unseen, stage-appropriate questions
    const g = (byCat[t.c] ||= { min: 1e9, best: [] });
    if (n < g.min - 1e-9) { g.min = n; g.best = [i]; } else if (Math.abs(n - g.min) < 1e-9) g.best.push(i);
  });
  const cats = Object.values(byCat);                      // every topic comes up about equally often
  return cats.length ? pick(pick(cats).best) : -1;
}
const shuffle3 = () => [0, 1, 2].sort(() => Math.random() - 0.5);

// kind: 'normal', 'crit' (a critical question) or 'x' (one belonging to the current crisis)
function spawn(kind) {
  if (cut()) return;
  if (kind === 'normal' && S.queries.filter(q => q.pid > 0).length >= 6 + S.stage * 2) return;
  const free = S.people.filter(p => !p.q && !p.busy);
  const C = S.crisis;
  const k = pickTpl(kind === 'x' ? (t, i) => t.x === C.id && !C.used.includes(i)
    : kind === 'crit' ? t => t.crit && !t.x
    : t => t.c !== 'council' && !t.crit && !t.x);
  if (!free.length || k < 0) return;
  if (kind === 'x') C.used.push(k);
  const t = Q[k], c = t.c, crit = kind !== 'normal';
  const match = free.filter(p => p.cat === c);
  const p = match.length && Math.random() < 0.6 ? pick(match) : pick(free);
  const ttl = kind === 'x' ? 40 : crit ? 45 : 75;
  const q = { id: S.nextQ++, k, pid: p.id, ttl, max: ttl, order: shuffle3(), agentAt: 0, esc: false, crit, x: kind === 'x', proc: null };
  if (S.depts[c] && !crit) {
    if (Math.random() < 0.2) q.esc = true;       // sub-agents escalate the ones they aren't sure about
    else q.agentAt = S.t + rnd(3, 6);
  }
  p.q = q.id;
  S.queries.push(q);
}

function spawnCouncil(k = pickTpl(t => t.c === 'council')) {
  if (k < 0 || S.queries.some(q => q.pid < 0)) return;
  S.queries.push({ id: S.nextQ++, k, pid: -1, ttl: 120, max: 120, order: shuffle3(), agentAt: 0, esc: false, crit: false, x: false, proc: null });
}

// With Foresight in a topic, the written reply most likely to do harm is flagged. Returns its option index, or -1.
export function flagged(q) {
  const t = Q[q.k];
  if ((S.know[t.c] || 0) < 2) return -1;
  const score = o => STATS.reduce((a, k) => a + (o[2][k] || 0), 0) + (o[2].pop || 0) * 2 + (o[2].trust || 0) * 0.5;
  let w = 0;
  t.o.forEach((o, i) => { if (score(o) < score(t.o[w])) w = i; });
  return w;
}

// Reply with a written option. oi is the real option index. Returns false if you can't.
// custom, for a typed reply, is { reply, outcome, fx, like } as ruled by the judge.
export function answer(qid, oi, by = 'you', custom = null) {
  const q = S.queries.find(x => x.id === qid);
  if (!q || cut() || (q.proc && by !== 'typed')) return false;
  if (by === 'you') {
    if (S.compute < cost(q)) return false;
    S.compute -= cost(q);
  }
  if (by !== 'agent') S.answered++;
  S.queries.splice(S.queries.indexOf(q), 1);
  S.seen[q.k] = (S.seen[q.k] || 0) + 1;
  const t = Q[q.k], p = person(q.pid);
  if (p) {
    p.q = 0; p.busy = true;
    p.trust = clamp(p.trust + (custom ? custom.like : t.o[oi][3]));   // how the reply lands in the moment
    const b = nearestB(CATS[t.c].bld, p.x, p.y);  // then they go and act on it
    p.tx = b.x + rnd(-10, 10); p.ty = b.y + 18;
  }
  S.pending.push({ k: q.k, oi, pid: q.pid, who: p ? p.name : 'The Council', at: S.t + rnd(q.crit ? 4 : 7, q.crit ? 6 : 11), by, custom, crit: q.crit });
  return true;
}

// Send a typed reply. It costs half the compute, but takes PROC seconds to process,
// and only one can be in the works at a time. The interface supplies the ruling via setVerdict.
export function submitTyped(qid, reply) {
  const q = S.queries.find(x => x.id === qid);
  if (!q || cut() || q.proc || processing() || S.compute < cost(q, true)) return false;
  S.compute -= cost(q, true);
  q.agentAt = 0;
  q.proc = { reply, until: S.t + PROC, res: null };
  save();
  return true;
}
export function setVerdict(qid, res) {
  const q = S.queries.find(x => x.id === qid);
  if (q && q.proc) q.proc.res = res;
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
  if (Math.random() < (S.know[t.c] >= 3 ? 0.08 : 0.3)) oi = (Math.random() * 3) | 0;   // sub-agents are good, not perfect
  else t.o.forEach((o, i) => { if (score(o) > score(t.o[oi])) oi = i; });
  answer(q.id, oi, 'agent');
}

function expire(q) {
  S.queries.splice(S.queries.indexOf(q), 1);
  const t = Q[q.k], p = person(q.pid);
  if (t.ark) { S.ark.offered = false; S.ark.defer = S.day + 2; }
  const fx = {};
  let text = 'Went unanswered.';
  if (q.crit) {                         // a critical question nobody answers hurts the world, not just your standing
    const miss = t.m || { [CATS[t.c].stat || 'bond']: -6, pop: -2 };
    for (const k of STATS) if (miss[k]) { S.stats[k] = clamp(S.stats[k] + miss[k]); fx[k] = miss[k]; }
    if (miss.pop) { S.pop = Math.max(1, S.pop * (1 + miss.pop / 100)); fx.pop = miss.pop; }
    text = t.mt || 'No answer came. It went as badly as it could.';
  }
  if (p) {
    const loss = q.crit ? 12 : 8;
    p.q = 0; p.trust = clamp(p.trust - loss); fx.trust = -loss;
    for (const o of S.people) if (o !== p) o.trust = clamp(o.trust - (q.crit ? 1.5 : 0.4));
  } else {
    S.stats.bond = clamp(S.stats.bond - 4); fx.bond = -4; fx.trust = -3;
    for (const o of S.people) o.trust = clamp(o.trust - 3);
  }
  const e = { day: S.day, who: p ? p.name : 'The Council', cat: t.c, q: t.q, text, fx, by: 'none', crit: q.crit, good: false };
  pushLog(e);
  hooks.expired(e, p);
}

function resolve(pd) {
  S.pending.splice(S.pending.indexOf(pd), 1);
  const t = Q[pd.k], p = person(pd.pid);
  const [, text, fx] = pd.custom ? [0, pd.custom.outcome, pd.custom.fx] : t.o[pd.oi];
  const council = t.c === 'council', lvl = S.know[t.c] || 0;
  const m = council ? 1.5 : FXM[S.stage] * (pd.crit ? 1.6 : 1);
  const shown = {};
  let sum = 0;
  for (const k of STATS) if (fx[k]) {
    let d = fx[k] * m;
    if (d > 0 && lvl >= 1) d *= 1.25;             // training: Grounding
    if (d < 0 && lvl >= 3) d *= 0.75;             // training: Mastery
    S.stats[k] = clamp(S.stats[k] + d); shown[k] = d; sum += d;
  }
  if (fx.trust) {
    shown.trust = fx.trust;
    if (p) p.trust = clamp(p.trust + fx.trust);
    const spread = fx.trust * (council ? 0.5 : pd.crit ? 0.2 : 0.12);   // word gets around
    for (const o of S.people) if (o !== p) o.trust = clamp(o.trust + spread);
  }
  if (fx.pop) { S.pop = Math.max(1, S.pop * (1 + fx.pop / 100)); shown.pop = fx.pop; sum += fx.pop * 2; }
  if (fx.ark) { S.ark.active = true; }
  if (fx.defer) { S.ark.offered = false; S.ark.defer = S.day + 4; }
  if (p) { p.busy = false; p.wait = rnd(1, 3); }
  const good = sum + (fx.trust || 0) * 0.5 > 0;
  if (p) {   // the board keeps a mark of every answer, where it was acted on
    (S.marks ||= []).push({ x: Math.round(p.x + rnd(-6, 6)), y: Math.round(p.y + rnd(-4, 4)), good });
    if (S.marks.length > 120) S.marks.shift();
  }
  let insight = 0;
  if (good && pd.by !== 'agent') { insight = pd.crit ? 2 : 1; S.insight += insight; }   // you learn from what goes well
  const e = { day: S.day, who: pd.who, cat: t.c, q: t.q, text, fx: shown, by: pd.by, crit: pd.crit, insight, reply: pd.custom ? pd.custom.reply : '', good };
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
    if (Q[q.k].c !== c || q.pid < 0 || q.crit || q.proc) continue;
    q.agentAt = dir && !q.esc ? S.t + rnd(2, 5) : 0;
  }
  save();
  return true;
}

// ── training ──
export function upgrade(c) {
  const lvl = S.know[c];
  if (lvl >= UP_COST.length || S.insight < UP_COST[lvl]) return false;
  S.insight -= UP_COST[lvl];
  S.know[c] = lvl + 1;
  save();
  return true;
}

// ── daily upkeep ──
function newDay() {
  S.day++;
  const st = S.stats, decay = (1.3 + 0.5 * S.stage) * (1 + 0.15 * Math.min(S.planet, 6));
  for (const k of STATS) st[k] = clamp(st[k] - decay * (0.5 + st[k] / 100));   // a new world wears everything down, and the more you have built, the more there is to keep up
  // what a settlement is strong in shores up what it is weakest in
  const weakest = STATS.reduce((a, k) => (st[k] < st[a] ? k : a), STATS[0]);
  let lift = 0;
  for (const k of STATS) if (st[k] > 70) lift += (st[k] - 70) * 0.08;
  if (st[weakest] < 50) st[weakest] = clamp(st[weakest] + Math.min(4, lift));
  if (st.eco < 30) st.food = clamp(st.food - 1.5);          // and trouble spreads
  if (st.food < 30) st.health = clamp(st.health - 1.5);
  if (st.health < 30) st.bond = clamp(st.bond - 1);
  if (st.know < 30) st.food = clamp(st.food - 0.8);
  if (st.infra < 30) st.health = clamp(st.health - 1);
  if (st.safe < 30) st.bond = clamp(st.bond - 1);

  const well = (st.food + st.health) / 2;
  let g = clamp((well - 40) / 60, -1, 1);
  g *= g > 0 ? 0.22 : 0.12;
  for (const k of STATS) if (st[k] <= 0) g -= 0.05;
  const cap = STAGES[S.stage].cap;
  S.pop = Math.max(0, Math.min(cap, S.pop * (1 + g)));

  const failing = STATS.filter(k => st[k] < 20).length;
  const drift = -0.4 + (vitality() - 50) * 0.07 - (st.bond < 30 ? 1 : 0) - failing * 1.5;   // people credit you for a world that works
  for (const p of S.people) p.trust = clamp(p.trust + drift);
  syncPeople();

  for (const k of STATS) if (st[k] < 22 && st[k] + decay >= 22) note(`${CATS[Object.keys(CATS).find(c => CATS[c].stat === k)].label} is failing.`, false);

  if (S.stage < 4 && reach() >= STAGES[S.stage].goal) {
    S.stage++;
    S.compute = maxCompute();
    S.insight += 3;
    note(`The settlement is now a ${STAGES[S.stage].name}. +3 insight.`);
    syncPeople();
    hooks.stage(S.stage);
  }

  const A = S.ark;
  if (S.stage === 4 && !A.active && !A.offered && !S.crisis && S.day >= A.defer && reach() >= STAGES[4].goal) {
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
    if (d && d.v === 2 && !d.over) {
      for (const q of d.queries) if (q.proc) q.proc.res = null;   // a ruling in flight is asked for again
      S = d; return true;
    }
  } catch {}
  return false;
}
