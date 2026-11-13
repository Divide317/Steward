// Canvas renderer: terrain, buildings, people, query bubbles.
import { S, bpos, btype, adoption, person } from './game.js';
import { Q, CATS, STAGES, PLANETS } from './content.js';

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
    flora.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, t: r(), s: 2 + r() * 5 });
  }
}

export function addFloat(x, y, text, color) { floats.push({ x, y, text, color, life: 2.4 }); }
export function resetView() { shown = 0; cam.R = 300; }

// Where a query's bubble is anchored, in world coordinates.
function anchor(q) {
  if (q.pid < 0) { const b = bpos(8); return { x: b.x, y: b.y - 6 }; }
  const p = person(q.pid);
  return p ? { x: p.x, y: p.y } : null;
}

export function pickQuery(mx, my, w, h) {
  const wx = (mx - w / 2) / cam.s, wy = (my - h / 2) / cam.s;
  let best = null, bd = 18 / cam.s;
  for (const q of S.queries) {
    const a = anchor(q);
    if (!a) continue;
    const d = Math.hypot(a.x - wx, a.y - 20 / cam.s - wy);
    if (d < bd) { bd = d; best = q; }
  }
  return best;
}

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

function building(ctx, type, z, hue) {
  const st = S.stats;
  switch (type) {
    case 'home': {
      const tall = S.stage >= 2;
      ctx.fillStyle = tall ? '#9aa3b2' : '#c7b396';
      rr(ctx, -z, -z * (tall ? 1.3 : 0.8), z * 2, z * (tall ? 2.1 : 1.6), 3); ctx.fill();
      ctx.fillStyle = tall ? '#7b8494' : '#9c7f5f';
      rr(ctx, -z, -z * (tall ? 1.3 : 0.8), z * 2, z * 0.45, 3); ctx.fill();
      ctx.fillStyle = '#ffd98a';
      if (tall) for (let i = 0; i < 4; i++) ctx.fillRect(-z * 0.6 + (i % 2) * z * 0.75, -z * 0.55 + ((i / 2) | 0) * z * 0.6, z * 0.4, z * 0.3);
      else ctx.fillRect(-z * 0.25, -z * 0.05, z * 0.5, z * 0.45);
      break;
    }
    case 'farm': {
      ctx.fillStyle = `hsl(${60 + st.food * 0.45},${25 + st.food * 0.3}%,${20 + st.food * 0.13}%)`;
      rr(ctx, -z * 1.4, -z, z * 2.8, z * 2, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = 1.5;
      for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-z * 1.4 + i * z * 0.56, -z); ctx.lineTo(-z * 1.4 + i * z * 0.56, z); ctx.stroke(); }
      break;
    }
    case 'clinic': {
      ctx.fillStyle = '#eef0ee'; ctx.beginPath(); ctx.arc(0, 0, z, 0, 6.283); ctx.fill();
      ctx.fillStyle = CATS.health.color;
      ctx.fillRect(-z * 0.18, -z * 0.55, z * 0.36, z * 1.1); ctx.fillRect(-z * 0.55, -z * 0.18, z * 1.1, z * 0.36);
      break;
    }
    case 'school': {
      ctx.fillStyle = '#5a7fc0'; rr(ctx, -z * 1.1, -z * 0.7, z * 2.2, z * 1.5, 3); ctx.fill();
      ctx.fillStyle = '#dfe8f8';
      ctx.beginPath(); ctx.moveTo(-z * 0.5, z * 0.2); ctx.lineTo(0, -z * 0.35); ctx.lineTo(z * 0.5, z * 0.2); ctx.closePath(); ctx.fill();
      break;
    }
    case 'grove': {
      const l = 22 + st.eco * 0.2, sat = 15 + st.eco * 0.4;
      [[-0.7, -0.3, 0.75], [0.6, -0.5, 0.65], [0, 0.3, 0.9], [-0.9, 0.6, 0.55], [0.9, 0.5, 0.6]].forEach(([x, y, r], i) => {
        ctx.fillStyle = `hsl(${hue + i * 6},${sat}%,${l + i * 2}%)`;
        ctx.beginPath(); ctx.arc(x * z, y * z, r * z, 0, 6.283); ctx.fill();
      });
      break;
    }
    case 'hall': {
      ctx.fillStyle = '#d9a441'; ctx.beginPath();
      for (let i = 0; i < 6; i++) ctx.lineTo(Math.cos(i * 1.047) * z * 1.3, Math.sin(i * 1.047) * z * 1.3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f6dc9c'; ctx.beginPath(); ctx.arc(0, 0, z * 0.45, 0, 6.283); ctx.fill();
      break;
    }
    case 'works': {
      ctx.fillStyle = '#6f7480'; rr(ctx, -z * 1.1, -z * 0.6, z * 2.2, z * 1.4, 2); ctx.fill();
      ctx.fillStyle = '#4c505a'; ctx.fillRect(z * 0.4, -z * 1.4, z * 0.4, z * 0.9);
      break;
    }
  }
}

export function render(ctx, w, h, dt, now) {
  const st = STAGES[S.stage], P = PLANETS[S.planet % PLANETS.length];
  const eco = S.stats.eco / 100, ad = adoption() / 100;

  shown += (st.bld - shown) * Math.min(1, dt * 1.1);
  if (Math.abs(st.bld - shown) < 0.03 || !(shown >= 0)) shown = st.bld;
  const R = 54 * Math.sqrt(Math.max(shown, 6)) + 120;
  cam.R += (R - cam.R) * Math.min(1, dt * 2);
  cam.s = Math.min(w, h) / (2 * cam.R);

  // ground: dusty when the ecology fails, alive when it thrives
  const hue = 30 + (P.hue - 30) * eco;
  ctx.fillStyle = `hsl(${hue},${10 + eco * 24}%,${9 + eco * 7}%)`;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h / 2); ctx.scale(cam.s, cam.s);
  const vx = w / 2 / cam.s + 10, vy = h / 2 / cam.s + 10;

  for (const f of flora) {
    if (Math.abs(f.x) > vx || Math.abs(f.y) > vy) continue;
    const alive = f.t < eco;
    ctx.fillStyle = alive ? `hsla(${P.hue + f.t * 40},${35 + eco * 25}%,${22 + f.t * 18}%,.75)` : 'hsla(28,12%,24%,.5)';
    ctx.beginPath(); ctx.arc(f.x, f.y, alive ? f.s : f.s * 0.5, 0, 6.283); ctx.fill();
  }

  // your reach, as light spreading from the mast
  const setR = 54 * Math.sqrt(shown) + 40;
  const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, setR * (0.3 + ad));
  gr.addColorStop(0, 'rgba(95,212,196,.20)'); gr.addColorStop(1, 'rgba(95,212,196,0)');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, setR * (0.3 + ad), 0, 6.283); ctx.fill();

  // paths
  const n = Math.ceil(shown);
  ctx.strokeStyle = 'rgba(233,222,200,.11)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let i = 1; i <= n; i++) {
    const a = bpos(i), b = bpos(i > 8 ? i - 8 : 0);
    ctx.beginPath(); ctx.moveTo(a.x, a.y + 14); ctx.lineTo(b.x, b.y + (i > 8 ? 14 : 0)); ctx.stroke();
  }

  // buildings
  const z = 13 * (1 + 0.1 * S.stage);
  for (let i = 1; i <= n; i++) {
    const b = bpos(i), k = Math.max(0, Math.min(1, shown - (i - 1)));
    ctx.save(); ctx.translate(b.x, b.y); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(2, z * 0.9, z * 1.2, z * 0.4, 0, 0, 6.283); ctx.fill();
    building(ctx, btype(i), z, P.hue);
    ctx.restore();
  }

  // the mast (you)
  const pulse = (now / 1000) % 3 / 3;
  ctx.strokeStyle = `rgba(95,212,196,${0.5 * (1 - pulse)})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 10 + pulse * 46, 0, 6.283); ctx.stroke();
  ctx.fillStyle = '#10161d'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#5fd4c4'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 6.283); ctx.fill();

  // people
  const pr = Math.max(3.2, Math.min(6, 4.4 * cam.s)) / cam.s;
  for (const p of S.people) {
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(p.x, p.y + pr * 0.9, pr, pr * 0.4, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = `hsl(${p.hue},42%,${p.busy ? 78 : 66}%)`;
    ctx.beginPath(); ctx.arc(p.x, p.y, pr, 0, 6.283); ctx.fill();
    if (p.trust > 45) {   // people who rely on you carry a little of your light
      ctx.fillStyle = `rgba(95,212,196,${Math.min(1, (p.trust - 45) / 40)})`;
      ctx.beginPath(); ctx.arc(p.x + pr * 0.7, p.y - pr * 0.8, pr * 0.42, 0, 6.283); ctx.fill();
    }
  }

  // query bubbles
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const q of S.queries) {
    const a = anchor(q);
    if (!a) continue;
    const c = CATS[Q[q.k].c], u = 1 / cam.s;
    const bob = Math.sin(now / 320 + q.id) * 2 * u;
    const x = a.x, y = a.y - 20 * u + bob, r = (q.pid < 0 ? 12 : 10) * u;
    if (q.agentAt) {
      ctx.strokeStyle = c.color; ctx.lineWidth = 2 * u; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
      continue;
    }
    ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 4 * u, y + r * 0.8); ctx.lineTo(x, y + r + 5 * u); ctx.lineTo(x + 4 * u, y + r * 0.8); ctx.fill();
    if (q.ttl < 18) {
      ctx.strokeStyle = `rgba(255,90,80,${0.5 + 0.5 * Math.sin(now / 120)})`; ctx.lineWidth = 2.5 * u;
      ctx.beginPath(); ctx.arc(x, y, r + 3 * u, 0, 6.283); ctx.stroke();
    }
    ctx.fillStyle = '#10161d'; ctx.font = `700 ${13 * u}px system-ui`;
    ctx.fillText(q.pid < 0 ? '!' : '?', x, y + 0.5 * u);
  }

  // floating outcome text
  for (let i = floats.length - 1; i >= 0; i--) {
    const f = floats[i], u = 1 / cam.s;
    f.life -= dt; f.y -= 14 * u * dt;
    if (f.life <= 0) { floats.splice(i, 1); continue; }
    ctx.globalAlpha = Math.min(1, f.life);
    ctx.font = `700 ${12 * u}px system-ui`;
    ctx.lineWidth = 3 * u; ctx.strokeStyle = 'rgba(10,14,20,.8)'; ctx.strokeText(f.text, f.x, f.y);
    ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // dusk and night
  const night = Math.max(0, -Math.sin(S.dayT / 24 * 6.283));
  if (night > 0) { ctx.fillStyle = `rgba(8,12,34,${night * 0.32})`; ctx.fillRect(0, 0, w, h); }
}
