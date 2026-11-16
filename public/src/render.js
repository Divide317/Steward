// Pixel renderer: the colony board, its pieces and markers, and the sky band above the table.
// Both canvases are drawn at low resolution and scaled up with hard edges, so every shape is pixel art.
import { S, bpos, btype, adoption, person, cut, crisisDef } from './game.js';
import { Q, CATS, STAGES, PLANETS, STAT_COLOR } from './content.js';

const cam = { s: 1, R: 300 };
let shown = 0;
const floats = [];

function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const flora = [];
{
  const r = mulberry(11);
  for (let i = 0; i < 700; i++) {
    const a = r() * 6.283, d = Math.sqrt(r()) * 1000;
    flora.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, t: r(), s: 2 + ((r() * 3) | 0) * 2 });
  }
}

// A 3 by 5 bitmap font for the floating numbers, and the 5 by 7 marks above settlers.
const GLYPH = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001',
  '5': '111100111001111', '6': '111100111101111', '7': '111001001001001', '8': '111101111101111', '9': '111101111001111',
  '+': '000010111010000', '-': '000000111000000',
};
const MARK = {
  '?': ['01110', '10001', '00001', '00110', '00100', '00000', '00100'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
};
function glyphs(ctx, text, x, y, px) {
  let cx = x;
  for (const ch of text) {
    const g = GLYPH[ch];
    if (g) for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(cx + (i % 3) * px, y + ((i / 3) | 0) * px, px, px);
    cx += 4 * px;
  }
  return cx - x;
}
function mark(ctx, ch, x, y, px) {
  MARK[ch].forEach((row, j) => { for (let i = 0; i < 5; i++) if (row[i] === '1') ctx.fillRect(x + i * px, y + j * px, px, px); });
}

export function addFloat(x, y, value, stat) { floats.push({ x, y, value: Math.round(value), stat, life: 2.4 }); }
export function resetView() { shown = 0; cam.R = 300; }

// Where a query's marker is anchored, in world coordinates.
function anchor(q) {
  if (q.pid < 0) { const b = bpos(8); return { x: b.x, y: b.y - 6 }; }
  const p = person(q.pid);
  return p ? { x: p.x, y: p.y } : null;
}

// mx, my, w, h are in canvas pixels.
export function pickQuery(mx, my, w, h) {
  const wx = (mx - w / 2) / cam.s, wy = (my - h / 2) / cam.s;
  let best = null, bd = 9 / cam.s;
  for (const q of S.queries) {
    const a = anchor(q);
    if (!a) continue;
    const d = Math.hypot(a.x - wx, a.y - 9 / cam.s - wy);
    if (d < bd) { bd = d; best = q; }
  }
  return best;
}

// Everything is drawn in world units, snapped to whole canvas pixels so edges stay hard.
let U = 1;
const snap = v => Math.round(v * cam.s) / cam.s;
function box(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(snap(x), snap(y), Math.max(U, snap(w)), Math.max(U, snap(h))); }

function building(ctx, type, z, hue) {
  const st = S.stats, I = '#050a14';
  box(ctx, -z * 1.1 + 3 * U, -z * 0.6 + 3 * U, z * 2.2, z * 1.6, 'rgba(5,10,20,.35)');   // the piece's shadow on the board
  switch (type) {
    case 'home': {
      const tall = S.stage >= 2;
      const h = tall ? 2.1 : 1.5, top = tall ? -1.3 : -0.8;
      box(ctx, -z, top * z, z * 2, h * z, I);
      box(ctx, -z + U, top * z + U, z * 2 - 2 * U, h * z - 2 * U, tall ? '#9aa3b2' : '#c7b396');
      box(ctx, -z + U, top * z + U, z * 2 - 2 * U, z * 0.4, tall ? '#6b7486' : '#9c6f4f');
      box(ctx, -z * 0.3, (top + h) * z - z * 0.6, z * 0.6, z * 0.6 - U, '#ffd98a');
      if (tall) for (let i = 0; i < 2; i++) box(ctx, -z * 0.6 + i * z * 0.8, top * z + z * 0.7, z * 0.4, z * 0.3, '#ffd98a');
      break;
    }
    case 'farm': {
      const g = st.food;
      box(ctx, -z * 1.4, -z, z * 2.8, z * 2, I);
      box(ctx, -z * 1.4 + U, -z + U, z * 2.8 - 2 * U, z * 2 - 2 * U, `hsl(${55 + g * 0.45},${30 + g * 0.3}%,${22 + g * 0.14}%)`);
      for (let i = 1; i < 5; i++) box(ctx, -z * 1.4 + i * z * 0.56, -z + U, U, z * 2 - 2 * U, 'rgba(5,10,20,.3)');
      break;
    }
    case 'clinic': {
      box(ctx, -z, -z, z * 2, z * 2, I);
      box(ctx, -z + U, -z + U, z * 2 - 2 * U, z * 2 - 2 * U, '#eef0ee');
      box(ctx, -z * 0.2, -z * 0.6, z * 0.4, z * 1.2, CATS.health.color);
      box(ctx, -z * 0.6, -z * 0.2, z * 1.2, z * 0.4, CATS.health.color);
      break;
    }
    case 'school': {
      box(ctx, -z * 1.1, -z * 0.7, z * 2.2, z * 1.5, I);
      box(ctx, -z * 1.1 + U, -z * 0.7 + U, z * 2.2 - 2 * U, z * 1.5 - 2 * U, '#5a7fc0');
      box(ctx, -z * 0.5, -z * 0.2, z, z * 0.5, '#dfe8f8');
      box(ctx, -U, -z * 0.2, 2 * U, z * 0.5, '#5a7fc0');
      break;
    }
    case 'grove': {
      const l = 20 + st.eco * 0.2, sat = 15 + st.eco * 0.45;
      [[-0.8, -0.5, 0.8], [0.3, -0.8, 0.7], [-0.2, 0.1, 0.9], [0.6, 0.0, 0.7], [-0.9, 0.4, 0.6]].forEach(([x, y, r], i) => {
        box(ctx, x * z - U, y * z - U, r * z * 1.6 + 2 * U, r * z * 1.6 + 2 * U, I);
        box(ctx, x * z, y * z, r * z * 1.6, r * z * 1.6, `hsl(${hue + i * 7},${sat}%,${l + i * 3}%)`);
      });
      break;
    }
    case 'hall': {
      box(ctx, -z * 1.3, -z * 1.1, z * 2.6, z * 2.2, I);
      box(ctx, -z * 1.3 + U, -z * 1.1 + U, z * 2.6 - 2 * U, z * 2.2 - 2 * U, '#d9a441');
      box(ctx, -z * 1.3 + U, -z * 1.1 + U, z * 2.6 - 2 * U, z * 0.5, '#a8772a');
      box(ctx, -z * 0.35, z * 0.2, z * 0.7, z * 0.9 - U, '#f6dc9c');
      break;
    }
    case 'watch': {
      box(ctx, -z * 0.5, -z * 1.3, z, z * 2.1, I);
      box(ctx, -z * 0.5 + U, -z * 1.3 + U, z - 2 * U, z * 2.1 - 2 * U, '#8a5a3a');
      box(ctx, -z * 0.85, -z * 1.6, z * 1.7, z * 0.6, I);
      box(ctx, -z * 0.85 + U, -z * 1.6 + U, z * 1.7 - 2 * U, z * 0.6 - 2 * U, CATS.safety.color);
      break;
    }
    case 'works': {
      box(ctx, -z * 1.1, -z * 0.6, z * 2.2, z * 1.4, I);
      box(ctx, -z * 1.1 + U, -z * 0.6 + U, z * 2.2 - 2 * U, z * 1.4 - 2 * U, '#6f7480');
      box(ctx, z * 0.4, -z * 1.4, z * 0.45, z * 0.85, I);
      box(ctx, z * 0.4 + U, -z * 1.4 + U, z * 0.45 - 2 * U, z * 0.85, '#4c505a');
      break;
    }
  }
}

export function render(ctx, w, h, dt, now) {
  const st = STAGES[S.stage], P = PLANETS[S.planet % PLANETS.length];
  const eco = S.stats.eco / 100, ad = adoption() / 100;
  ctx.imageSmoothingEnabled = false;

  shown += (st.bld - shown) * Math.min(1, dt * 1.1);
  if (Math.abs(st.bld - shown) < 0.03 || !(shown >= 0)) shown = st.bld;
  const R = 54 * Math.sqrt(Math.max(shown, 6)) + 64;
  cam.R += (R - cam.R) * Math.min(1, dt * 2);
  cam.s = Math.min(w, h) / (2 * cam.R) * (w > h * 1.4 ? 1.15 : 1);
  U = 1 / cam.s;

  // the board: a checkerboard of tiles, lush when the ecology thrives, dust when it fails
  const hue = 30 + (P.hue - 30) * eco, sat = 14 + eco * 26, lum = 15 + eco * 8;
  ctx.fillStyle = `hsl(${hue},${sat}%,${lum}%)`;
  ctx.fillRect(0, 0, w, h);
  const dark = cut(), crisis = crisisDef();
  ctx.save();
  ctx.translate(Math.round(w / 2), Math.round(h / 2));
  if (crisis && crisis.id === 'quake') ctx.translate(Math.round(Math.sin(now / 37) * 2), Math.round(Math.cos(now / 53) * 1.5));   // the ground is still moving
  ctx.scale(cam.s, cam.s);
  const vx = w / 2 / cam.s + 40, vy = h / 2 / cam.s + 40;

  const T = 40;   // tile size in world units
  ctx.fillStyle = `hsl(${hue},${sat}%,${lum + 2.5}%)`;
  for (let tx = Math.floor(-vx / T); tx * T < vx; tx++) for (let ty = Math.floor(-vy / T); ty * T < vy; ty++) {
    if ((tx + ty) & 1) ctx.fillRect(tx * T, ty * T, T, T);
  }

  for (const f of flora) {
    if (Math.abs(f.x) > vx || Math.abs(f.y) > vy) continue;
    const alive = f.t < eco;
    box(ctx, f.x, f.y, f.s, f.s, alive ? `hsl(${P.hue + f.t * 40},${35 + eco * 25}%,${24 + f.t * 16}%)` : 'hsl(28,12%,26%)');
  }

  // crisis scars: what each crisis that has passed left behind
  for (const sc of S.scars || []) {
    ctx.fillStyle = `rgba(${sc.tint},.35)`;
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if ((i + j) & 1 && i * i + j * j < 10) ctx.fillRect(sc.x + i * 6, sc.y + j * 6, 6, 6);
  }

  // your reach: a dashed signal ring around the mast
  const setR = 54 * Math.sqrt(shown) + 40;
  if (!dark) {
    const rr = setR * (0.3 + ad), segs = 48;
    ctx.fillStyle = 'rgba(77,227,255,.45)';
    for (let i = 0; i < segs; i += 2) {
      const a = i / segs * 6.283;
      ctx.fillRect(snap(Math.cos(a) * rr), snap(Math.sin(a) * rr), 3 * U, 3 * U);
    }
  }

  // paths between pieces
  const n = Math.ceil(shown);
  ctx.strokeStyle = 'rgba(232,241,255,.10)'; ctx.lineWidth = 5; ctx.lineCap = 'square';
  for (let i = 1; i <= n; i++) {
    const a = bpos(i), b = bpos(i > 8 ? i - 8 : 0);
    ctx.beginPath(); ctx.moveTo(a.x, a.y + 14); ctx.lineTo(b.x, b.y + (i > 8 ? 14 : 0)); ctx.stroke();
  }

  // tile marks: every answer leaves one where it was acted on
  for (const m of S.marks || []) {
    box(ctx, m.x - U, m.y - U, 4 * U, 4 * U, '#050a14');
    box(ctx, m.x, m.y, 2 * U, 2 * U, m.good ? '#8fe0a8' : '#ff5d8f');
  }

  // buildings, popping in step by step as the settlement grows
  const z = 19 * (1 + 0.08 * S.stage);
  for (let i = 1; i <= n; i++) {
    const b = bpos(i), k = Math.max(0, Math.min(1, shown - (i - 1)));
    if (k < 0.5) continue;
    ctx.save(); ctx.translate(snap(b.x), snap(b.y));
    building(ctx, btype(i), z, P.hue);
    ctx.restore();
  }

  // the mast: you
  box(ctx, -7 * U, -7 * U, 14 * U, 14 * U, '#050a14');
  box(ctx, -5 * U, -5 * U, 10 * U, 10 * U, '#101d33');
  const lit = dark ? (Math.sin(now / 150) > 0.4 ? '#ff5d8f' : '#2a3b55') : '#4de3ff';
  box(ctx, -2 * U, -2 * U, 4 * U, 4 * U, lit);
  if (!dark) {
    const p = Math.floor((now / 1000) % 1.5 * 4);   // a stepped pulse, four frames
    const r = 9 + p * 6;
    ctx.fillStyle = `rgba(77,227,255,${0.6 - p * 0.14})`;
    for (let i = -r; i <= r; i += 3) { ctx.fillRect(snap(i) , snap(-r), U * 2, U * 2); ctx.fillRect(snap(i), snap(r), U * 2, U * 2); ctx.fillRect(snap(-r), snap(i), U * 2, U * 2); ctx.fillRect(snap(r), snap(i), U * 2, U * 2); }
  }

  // people: two-tone pixel figures; those who rely on you carry a cyan spark
  for (const p of S.people) {
    const x = snap(p.x), y = snap(p.y);
    box(ctx, x - 2 * U, y - 4 * U, 4 * U, 7 * U, '#050a14');
    box(ctx, x - U, y - 3 * U, 2 * U, 2 * U, '#f3d9b8');
    box(ctx, x - U, y - U, 2 * U, 3 * U, `hsl(${p.hue},45%,${p.busy ? 72 : 58}%)`);
    if (p.trust > 45) box(ctx, x + 2 * U, y - 5 * U, U, U, p.trust > 70 ? '#4de3ff' : 'rgba(77,227,255,.6)');
  }

  // question markers: a pixel sign above anyone who is asking
  for (const q of S.queries) {
    const a = anchor(q);
    if (!a) continue;
    const c = CATS[Q[q.k].c];
    const bob = Math.floor(now / 400 + q.id) % 2 ? U : 0;
    const x = snap(a.x) - 4 * U, y = snap(a.y) - 18 * U + bob;
    let fill = q.crit ? '#ff5d8f' : q.pid < 0 ? '#ffd166' : c.color, ink = '#050a14';
    if (q.agentAt || dark) { fill = dark ? '#2a3b55' : '#1f3657'; ink = '#8197bb'; }
    if (q.proc) { fill = '#101d33'; ink = '#4de3ff'; }
    box(ctx, x - U, y - U, 9 * U, 11 * U, '#050a14');
    box(ctx, x, y, 7 * U, 9 * U, fill);
    box(ctx, x + 3 * U, y + 9 * U, U, 2 * U, '#050a14');
    if (q.proc) { if (Math.floor(now / 250) % 2) box(ctx, x + 2 * U, y + 3 * U, 3 * U, 3 * U, ink); }
    else { ctx.fillStyle = ink; mark(ctx, q.pid < 0 || q.crit ? '!' : '?', x + U, y + U, U); }
    if (q.ttl < 18 && !q.agentAt && !q.proc && !dark && Math.floor(now / 200) % 2) {
      ctx.fillStyle = '#ff5d8f';
      ctx.fillRect(x - 3 * U, y - 3 * U, 13 * U, U); ctx.fillRect(x - 3 * U, y + 11 * U, 13 * U, U);
    }
  }

  // floating results: a number in the bitmap font beside a chip of the measure's colour
  for (let i = floats.length - 1; i >= 0; i--) {
    const f = floats[i];
    f.life -= dt; f.y -= 10 * U * dt * 3;
    if (f.life <= 0) { floats.splice(i, 1); continue; }
    if (f.life < 0.6 && Math.floor(f.life * 10) % 2) continue;   // blink out
    const text = (f.value > 0 ? '+' : '') + f.value;
    const px = U * 1, wd = text.length * 4 * px + 6 * px, x = snap(f.x) - wd / 2, y = snap(f.y);
    box(ctx, x - px, y - px, wd + 2 * px, 7 * px, '#050a14');
    box(ctx, x, y, 3 * px, 5 * px, STAT_COLOR[f.stat] || '#e8f1ff');
    ctx.fillStyle = f.value > 0 ? '#8fe0a8' : '#ff5d8f';
    glyphs(ctx, text, x + 5 * px, y, px);
  }
  ctx.restore();

  // the rim of the board falls away into the table: a dithered edge, denser toward the frame
  ctx.fillStyle = 'rgba(5,10,20,.5)';
  for (let d = 0; d < 6; d++) {
    const step = d < 2 ? 2 : d < 4 ? 3 : 5;
    for (let x = d % step; x < w; x += step) { ctx.fillRect(x, d, 1, 1); ctx.fillRect(x, h - 1 - d, 1, 1); }
    for (let y = d % step; y < h; y += step) { ctx.fillRect(d, y, 1, 1); ctx.fillRect(w - 1 - d, y, 1, 1); }
  }

  // a crisis tints the board
  if (crisis) {
    const flick = crisis.id === 'fire' && Math.floor(now / 180) % 2 ? 0.04 : 0;
    ctx.fillStyle = `rgba(${crisis.tint},${0.12 + flick})`; ctx.fillRect(0, 0, w, h);
  }

  // night falls on the board too
  const night = Math.max(0, -Math.sin(S.dayT / 24 * 6.283));
  if (night > 0) { ctx.fillStyle = `rgba(5,10,30,${Math.round(night * 4) / 4 * 0.34})`; ctx.fillRect(0, 0, w, h); }

  // static, only while the link is cut
  if (dark) {
    const seed = Math.floor(now / 80);
    const r = mulberry(seed);
    for (let i = 0; i < (w * h) / 40; i++) {
      ctx.fillStyle = r() > 0.5 ? 'rgba(232,241,255,.10)' : 'rgba(5,10,20,.22)';
      ctx.fillRect((r() * w) | 0, (r() * h) | 0, 1, 1);
    }
    const band = (Math.floor(now / 30) % (h + 20)) - 10;
    ctx.fillStyle = 'rgba(232,241,255,.06)'; ctx.fillRect(0, band, w, 3);
    for (let y = 0; y < h; y += 2) { ctx.fillStyle = 'rgba(5,10,20,.12)'; ctx.fillRect(0, y, w, 1); }
  }
}

// ── the sky band ──
const clouds = [];
{
  const r = mulberry(7);
  for (let i = 0; i < 9; i++) {
    const parts = [];
    const n = 3 + ((r() * 3) | 0);
    for (let j = 0; j < n; j++) parts.push({ x: j * 6 + ((r() * 4) | 0), y: -((r() * 5) | 0), w: 8 + ((r() * 8) | 0), h: 4 + ((r() * 3) | 0) });
    clouds.push({ x: r(), y: 0.12 + r() * 0.5, v: 0.004 + r() * 0.006, parts });
  }
}
const stars = [];
{ const r = mulberry(3); for (let i = 0; i < 70; i++) stars.push({ x: r(), y: r() * 0.9, t: r() }); }

function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }
const rgb = a => `rgb(${a[0]},${a[1]},${a[2]})`;

// Returns how bright the sky is, 0 at night to 1 at noon, so the interface can keep its text legible.
export function renderSky(ctx, w, h, now) {
  ctx.imageSmoothingEnabled = false;
  const crisis = crisisDef(), dark = cut();
  const phase = S.dayT / 24;                      // 0 dawn … 0.5 dusk … 1 next dawn
  const sun = Math.sin(phase * 6.283);            // above the horizon when positive
  const light = Math.max(0, Math.min(1, sun * 1.6 + 0.15));
  const dusk = Math.max(0, 1 - Math.abs(sun) * 3.5);

  let top = mix([12, 20, 44], [64, 100, 160], light), bot = mix([24, 34, 66], [138, 176, 218], light);
  bot = mix(bot, [236, 150, 120], dusk * 0.55);
  if (crisis) {
    const map = { storm: [[40, 46, 70], [70, 78, 104]], flood: [[46, 64, 92], [86, 108, 136]], quake: [[96, 78, 60], [150, 122, 92]], fever: [[70, 96, 64], [132, 156, 104]], fire: [[96, 40, 30], [230, 120, 60]] };
    const [ct, cb] = map[crisis.id] || [top, bot];
    top = mix(top, ct, 0.75); bot = mix(bot, cb, 0.75);
  }

  const bands = 7;                                // stepped, never smooth: a pixel sky
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = rgb(mix(top, bot, i / (bands - 1)));
    ctx.fillRect(0, Math.floor(i * h / bands), w, Math.ceil(h / bands) + 1);
  }

  if (light < 0.5) for (const s of stars) {
    if ((Math.floor(now / 600 + s.t * 10) % 7) === 0) continue;
    ctx.fillStyle = `rgba(232,241,255,${(0.5 - light) * 1.6})`;
    ctx.fillRect((s.x * w) | 0, (s.y * h) | 0, 1, 1);
  }

  // the sun by day, the moon by night, crossing the band
  const x = Math.round(((phase + 0.25) % 0.5) * 2 * (w + 20) - 10);
  const arc = Math.abs(Math.sin((phase % 0.5) * 6.283));
  const y = Math.round(h * 0.75 - arc * h * 0.55);
  const isSun = sun >= 0, r = isSun ? 5 : 4;
  for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) {
    if (i * i + j * j > r * r) continue;
    ctx.fillStyle = isSun ? (i * i + j * j > (r - 1) * (r - 1) ? '#ffe39a' : '#ffd166') : '#e8f1ff';
    ctx.fillRect(x + i, y + j, 1, 1);
  }
  if (!isSun) { ctx.fillStyle = rgb(mix(top, bot, 0.4)); for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) if ((i - 2) * (i - 2) + (j + 1) * (j + 1) <= r * r - 3) ctx.fillRect(x + i, y + j, 1, 1); }

  // clouds, darker in a storm
  const cl = crisis && crisis.id === 'storm' ? '#4a5272' : crisis && (crisis.id === 'fire' || crisis.id === 'quake') ? '#5a4a44' : light > 0.4 ? '#f4f8ff' : '#5a6a8e';
  const shade = crisis && crisis.id === 'storm' ? '#353c58' : light > 0.4 ? '#cfdcf0' : '#46557a';
  for (const c of clouds) {
    const cx = Math.round(((c.x + now / 1000 * c.v) % 1.3) * w - 0.15 * w), cy = Math.round(c.y * h);
    for (const p of c.parts) { ctx.fillStyle = shade; ctx.fillRect(cx + p.x, cy + p.y + 1, p.w, p.h); ctx.fillStyle = cl; ctx.fillRect(cx + p.x, cy + p.y, p.w, p.h - 1); }
  }

  if (crisis) {
    if (crisis.id === 'storm' && Math.sin(now / 470) > 0.97) { ctx.fillStyle = 'rgba(232,241,255,.55)'; ctx.fillRect(0, 0, w, h); }
    if (crisis.id === 'flood' || crisis.id === 'storm') {
      ctx.fillStyle = 'rgba(200,220,255,.45)';
      const off = Math.floor(now / 40);
      for (let i = 0; i < w; i += 5) for (let j = 0; j < h; j += 7) { const yy = (j + off + i * 3) % h; ctx.fillRect(i + ((yy / 3) | 0) % 3, yy, 1, 2); }
    }
    if (crisis.id === 'fire') {
      ctx.fillStyle = 'rgba(40,20,20,.35)';
      const off = now / 90;
      for (let i = 0; i < w; i += 9) { const hh = 4 + ((Math.sin(i * 0.7 + off / 10) + 1) * 4) | 0; ctx.fillRect(i, h - hh, 7, hh); }
    }
  }
  if (dark) {
    for (let yy = 0; yy < h; yy += 2) { ctx.fillStyle = 'rgba(5,10,20,.18)'; ctx.fillRect(0, yy, w, 1); }
  }

  // the horizon: the far edge of the planet
  ctx.fillStyle = rgb(mix([20, 34, 40], [60, 92, 76], light));
  ctx.fillRect(0, h - 3, w, 3);
  ctx.fillStyle = '#050a14';
  ctx.fillRect(0, h - 1, w, 1);
  return light;
}
