// Reconnection puzzles. When a crisis cuts the mast off, you solve one of these to get the link back.
//   power / drain : rotate the sections until every tile is joined to the source
//   relay         : each switch flips itself and its neighbours; get every relay on
import { icon } from './icons.js';

const INFO = {
  power: { title: 'Restore the power lines', src: icon('infra'), text: 'The storm cut the lines to the mast. Click a cable section to turn it. Join every junction to the generator.' },
  drain: { title: 'Clear the drains', src: icon('drop'), text: 'The relay hut is underwater. Click a pipe section to turn it. Connect every channel to the pump so the water can drain.' },
  relay: { title: 'Re-phase the relays', src: '', text: 'The quake knocked the relay chain out of phase. Each switch flips itself and its neighbours. Get every relay lit.' },
};

// bit, dx, dy, opposite bit: north, east, south, west
const DIRS = [[1, 0, -1, 4], [2, 1, 0, 8], [4, 0, 1, 1], [8, -1, 0, 2]];
const rot = b => ((b << 1) & 15) | (b >> 3);
const rand = n => (Math.random() * n) | 0;

function makeNet(n) {
  const cells = new Array(n * n).fill(0), src = rand(n * n);
  const seen = new Set([src]), stack = [src];
  while (stack.length) {                              // a random spanning tree: every tile ends up joined
    const i = stack[stack.length - 1], x = i % n, y = (i / n) | 0;
    const open = DIRS.filter(([, dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx >= 0 && ny >= 0 && nx < n && ny < n && !seen.has(ny * n + nx);
    });
    if (!open.length) { stack.pop(); continue; }
    const [bit, dx, dy, opp] = open[rand(open.length)], j = (y + dy) * n + x + dx;
    cells[i] |= bit; cells[j] |= opp;
    seen.add(j); stack.push(j);
  }
  do { for (let i = 0; i < cells.length; i++) for (let r = rand(4); r > 0; r--) cells[i] = rot(cells[i]); }
  while (joined(cells, n, src).size === n * n);
  return { cells, src };
}

function joined(cells, n, src) {
  const lit = new Set([src]), queue = [src];
  while (queue.length) {
    const i = queue.pop(), x = i % n, y = (i / n) | 0;
    for (const [bit, dx, dy, opp] of DIRS) {
      const nx = x + dx, ny = y + dy, j = ny * n + nx;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || lit.has(j)) continue;
      if ((cells[i] & bit) && (cells[j] & opp)) { lit.add(j); queue.push(j); }
    }
  }
  return lit;
}

function makeRelay(n) {
  const on = new Array(n * n).fill(true);
  const press = i => {
    const x = i % n, y = (i / n) | 0;
    on[i] = !on[i];
    for (const [, dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < n && ny < n) on[ny * n + nx] = !on[ny * n + nx];
    }
  };
  const picks = new Set();
  while (picks.size < n + 1) picks.add(rand(n * n));   // built backwards from the solved state, so it can always be solved
  picks.forEach(press);
  if (on.every(Boolean)) press(rand(n * n));
  return { on, press };
}

// Draws the puzzle into `host`. Calls onSolved once when it is solved, and onClose if the player steps away.
export function openPuzzle(host, type, hard, onSolved, onClose) {
  const info = INFO[type], n = type === 'relay' ? (hard ? 4 : 3) : (hard ? 5 : 4);
  const net = type === 'relay' ? null : makeNet(n), relay = type === 'relay' ? makeRelay(n) : null;
  let done = false, moves = 0;

  host.innerHTML = `<div class="dialog puzzle p-${type}">
    <div class="mh"><span class="cat">No connection</span><b>${info.title}</b></div>
    <p class="ptext">${info.text}</p>
    <div class="grid" style="--n:${n}"></div>
    <div class="mf"><span class="pstat"></span><button class="btn btn-ghost" data-pclose>Step away</button></div></div>`;
  host.hidden = false;
  const grid = host.querySelector('.grid'), stat = host.querySelector('.pstat');

  function draw() {
    let left;
    if (net) {
      const lit = joined(net.cells, n, net.src);
      left = n * n - lit.size;
      grid.innerHTML = net.cells.map((b, i) => `<button class="tile${lit.has(i) ? ' lit' : ''}${i === net.src ? ' src' : ''}" data-i="${i}">
        ${DIRS.map(([bit], d) => (b & bit ? `<i class="arm a${d}"></i>` : '')).join('')}<i class="hub">${i === net.src ? info.src : ''}</i></button>`).join('');
      stat.textContent = left ? `${left} ${type === 'power' ? 'junctions dark' : 'channels blocked'} · ${moves} turns` : 'Connected.';
    } else {
      left = relay.on.filter(v => !v).length;
      grid.innerHTML = relay.on.map((v, i) => `<button class="tile relay${v ? ' lit' : ''}" data-i="${i}"><i class="hub"></i></button>`).join('');
      stat.textContent = left ? `${left} relays out of phase · ${moves} presses` : 'In phase.';
    }
    if (!left && !done) {
      done = true;
      host.querySelector('.puzzle').classList.add('solved');
      setTimeout(() => { host.hidden = true; onSolved(); }, 700);
    }
  }

  host.onclick = e => {
    if (e.target.closest('[data-pclose]') || e.target === host) { host.hidden = true; return onClose && onClose(); }
    const t = e.target.closest('.tile');
    if (!t || done) return;
    const i = +t.dataset.i;
    if (net) net.cells[i] = rot(net.cells[i]); else relay.press(i);
    moves++;
    draw();
  };
  draw();
}
