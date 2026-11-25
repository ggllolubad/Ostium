// The Abbey of the Threshold: the cloister garth at dusk, seen from the south walk looking north.
// Full ink pass. One-point perspective with the eye 3 m up: the party stands large and central, the
// far ground sits above their heads so every door stays clear. A last reprieve, not a polished place:
// the arcade has fallen, the garth is mud and graves and sailcloth, every wall is patched.
// Writes grim/hub/garth.svg (all), garth__bg.svg, garth__fg.svg (in front of the party),
// garth.rig.json, and garth_hotspots.json (click polygons + party anchors, in 1600x1000 px).
const { Art, G, INK, smooth, poly, blob } = require('../gr');
const { dressing, mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
fs.mkdirSync('grim/hub', { recursive: true });

const W = 1600, H = 1000, HZ = 300, E = 3.0, FL = 760, CX = 800;
const a = new Art(W, H, 1209), D = dressing(a), R = a.R;
{ const g0 = a.glow.bind(a); a.glow = (...q) => `<g class="glow">${g0(...q)}</g>`; const f0 = D.flame, e0 = D.embers; D.flame = (...q) => `<g class="em">${f0(...q)}</g>`; D.embers = (...q) => `<g class="em">${e0(...q)}</g>`; }
const P = (X, Y, Z) => [CX + FL * X / Z, HZ + FL * (E - Y) / Z];
const K = Z => FL / Z;                          // px per metre at depth Z
const pp = pts => poly(pts.map(p => P(...p)));
const inkAt = Z => Math.min(3.2, 1.0 + K(Z) / 60);
const seg = (p, q, col = INK, w = 1, op = 1) => { const A = P(...p), B = P(...q); return `<path d="M${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])}" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`; };
const HOT = {}, sackLater = [], CROSS = [0, 6.6], BRAZIER = [-1.1, 5.3];
// ---- render passes for the lighting model (see grim/light/README.md). Every face is tagged with its plane, every prop with
// its depth, every light source is emissive and registers a light; painted glows are tagged so the lit render can drop them.
const PLANES = [], PLK = {}, LIGHTS = [];
const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], cross3 = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], dot3 = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
function planeId(p0, p1, p2) {
  let n = cross3(sub3(p1, p0), sub3(p2, p0)); const l = Math.hypot(...n); if (l < 1e-9) return -1; n = n.map(v => v / l);
  if (dot3(n, sub3([0, E, 0], p0)) < 0) n = n.map(v => -v);
  const d = dot3(n, p0), key = n.map(v => v.toFixed(3)).join(',') + '|' + d.toFixed(2);
  if (PLK[key] === undefined) { PLK[key] = PLANES.length; PLANES.push({ n: n.map(v => +v.toFixed(4)), d: +d.toFixed(4) }); }
  return PLK[key];
}
const PLW = (pts3, str) => { const i = planeId(...pts3); return i < 0 ? str : `<g class="pl_${i}">${str}</g>`; };
const EM = str => `<g class="em">${str}</g>`;
const addLight = (X, Y, Z, I, range, col = [1.0, 0.6, 0.28]) => LIGHTS.push({ pos: [+X.toFixed(2), +Y.toFixed(2), +Z.toFixed(2)], I: +I.toFixed(2), range: +range.toFixed(2), col });
// hover outline: thin white lines round the doorway and the part of the building around it, as world-space polylines;
// the overlay renderer depth-tests them against the scene so anything standing in front cuts the line
// an arch's curve from s0 to s1 on a face at(s, t), springing at ts with the given rise
const arcPts = (at, s0, s1, ts, rise, n = 14) => { const sm = (s0 + s1) / 2, rw = (s1 - s0) / 2, o = []; for (let i = 0; i <= n; i++) { const th = Math.PI * (1 - i / n); o.push(at(sm + Math.cos(th) * rw, ts + Math.sin(th) * rise)); } return o; };
// the stonework round an opening: the arch ring's outer edge (extrados) down the jambs, and the threshold step before it;
// square: a flat-headed timber frame instead of an arch
function stoneTrace(at, s0, s1, ts, rise, dep, nrm, base = 0, step = true, square = false) {
  const A = at(s0 - dep, base), B = at(s1 + dep, base);
  const head = square ? [at(s0 - dep, ts + dep), at(s1 + dep, ts + dep)] : arcPts(at, s0 - dep, s1 + dep, ts, rise + dep);
  const out = [[[A, ...head, B]]];
  if (step) { const a = at(s0 - dep - 0.12, base), b = at(s1 + dep + 0.12, base), up = (p, k) => [p[0] + nrm[0] * k, p[1] + 0.14, p[2] + nrm[2] * k];
    out.push([[up(a, 0), up(a, 0.4), up(b, 0.4), up(b, 0)]]); }
  return out;
}
const outline = (id, polys) => { HOT[id].outline = polys.map(([pts, closed]) => ({ closed: !!closed, pts: pts.map(p => p.map(v => +v.toFixed(3))) })); };
const hot = (id, label, pts) => { HOT[id] = { label, poly: pts.map(p => [f(p[0]), f(p[1])]) }; };

// palette: the Grey outside is colourless; warmth only comes from fire and candle
const SKY = '#9c9a94', STONE = '#5f584e', STONE2 = '#6a6256', TIMBER = '#463626', TIMBERD = '#2e241a', SLATE = '#3e3b38',
  MUD = '#3c342a', GRASS = '#4c4a33', FLAG = '#666052', WARM = '#f2b45c', GLOW = '#ff9a3a', CLOTH = '#8f8670', SAIL = '#a29a84';

// ------------------------------------------------------------------ builders
// a stone wall on the plane at(s, t) -> [X, Y, Z]; s along, t up. Every block toned, chipped and inked.
function stones(at, Ls, Lt, col, o = {}) { return PLW([at(0, 0), at(Ls, 0), at(0, Lt)], stones0(at, Ls, Lt, col, o)); }
function stones0(at, Ls, Lt, col, o = {}) {
  let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${dark(col, 0.5)}"/>`;
  const ch = o.course || 0.46, bl = o.block || 0.95, g = 0.025;
  let t = 0, row = 0;
  while (t < Lt - 0.04) {
    const h = Math.min(Lt - t, ch * (0.65 + R() * 0.8));
    let s = -(row % 2) * bl * 0.5 - R() * 0.3;
    while (s < Ls) {
      const w = bl * (0.55 + R() * 0.9), s0 = Math.max(0, s), s1 = Math.min(Ls, s + w);
      if (s1 - s0 > 0.08 && !(o.skip && o.skip(s0, s1, t, t + h))) {
        const miss = o.holes && R() < o.holes;
        const tone = miss ? dark(col, 0.8) : mix(col, R() < 0.45 ? '#d0c3a6' : '#120e0a', R() * 0.38);
        const jit = () => (R() - 0.5) * 0.07;
        const q = [at(s0 + g + jit(), t + g + jit() * 0.5), at(s1 - g + jit(), t + g * 1.6 + jit() * 0.5), at(s1 - g + jit(), t + h - g + jit() * 0.5), at(s0 + g + jit(), t + h - g + jit() * 0.5)];
        out += `<path d="${chip(q.map(p => P(...p)))}" fill="${tone}" stroke="${INK}" stroke-width="${f(inkAt(at(s0, t)[2]) * 0.5)}" stroke-linejoin="round"/>`;
        if (!miss && R() < 0.55) out += seg(at(s0 + g * 3, t + h - g * 3), at(s1 - g * 4, t + h - g * 3), '#fff4dc', 0.9, 0.16);
        if (!miss && R() < 0.5) out += seg(at(s0 + g * 3, t + g * 3), at(s1 - g * 3, t + g * 3), INK, 1.4, 0.3);
        if (!miss && R() < 0.08) { const m = s0 + (s1 - s0) * (0.3 + R() * 0.4); out += `<path d="M${P(...at(m, t + h)).map(f).join(' ')} L${P(...at(m + 0.08, t + h * 0.5)).map(f).join(' ')} L${P(...at(m - 0.04, t)).map(f).join(' ')}" stroke="${INK}" stroke-width="0.8" fill="none"/>`; }
      }
      s += w;
    }
    t += h; row++;
  }
  for (let i = 0; i < (o.rubble || 0); i++) {
    const rs = R() * Ls * 0.85, rt = R() * Lt * 0.8, rw = 0.8 + R() * 1.6, rh = 0.5 + R() * 1.2;
    out += `<path d="${pp([at(rs, rt), at(Math.min(Ls, rs + rw), rt), at(Math.min(Ls, rs + rw), Math.min(Lt, rt + rh)), at(rs, Math.min(Lt, rt + rh))])}" fill="${dark(col, 0.6)}"/>`;
    for (let k = 0; k < 18; k++) { const c = P(...at(rs + R() * rw, rt + R() * rh)), r = K(at(rs, 0)[2]) * (0.07 + R() * 0.08); if (at(rs + rw, 0)[2] && c) out += `<path d="${blob(c[0], c[1], r, R, 6, 0.35)}" fill="${mix(col, R() < 0.5 ? '#c8bca0' : '#120e0a', R() * 0.35)}" stroke="${INK}" stroke-width="0.7"/>`; }
  }
  for (let i = 0; i < (o.streaks || 0); i++) {
    const s = R() * Ls, Z = at(s, 0)[2], top = P(...at(s, Lt)), bot = P(...at(s + (R() - 0.5) * 0.3, Lt * (0.15 + R() * 0.6)));
    out += `<path d="M${f(top[0])} ${f(top[1])} C${f(top[0] + 4)} ${f((top[1] * 2 + bot[1]) / 3)} ${f(bot[0] - 3)} ${f((top[1] + bot[1] * 2) / 3)} ${f(bot[0])} ${f(bot[1])}" stroke="#140e0a" stroke-width="${f(K(Z) * (0.12 + R() * 0.35))}" opacity="${f(0.1 + R() * 0.14)}" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}
// knock the corners off a projected block: some corners chamfered, some rounded off, edges bowed a little
function chip(ps) {
  const n = ps.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = ps[i], a0 = ps[(i + n - 1) % n], b0 = ps[(i + 1) % n];
    if (R() < 0.42) { const u = 0.08 + R() * 0.2, v = 0.08 + R() * 0.2; out.push([p[0] + (a0[0] - p[0]) * u, p[1] + (a0[1] - p[1]) * u], [p[0] + (b0[0] - p[0]) * v, p[1] + (b0[1] - p[1]) * v]); }
    else out.push(p);
    if (R() < 0.3) { const q = ps[(i + 1) % n], m = 0.35 + R() * 0.3; out.push([p[0] + (q[0] - p[0]) * m + (R() - 0.5) * 1.6, p[1] + (q[1] - p[1]) * m + (R() - 0.5) * 1.6]); }
  }
  return poly(out);
}
// lime render surviving in patches over the stone, flaking at the edges
function render(at, Ls, Lt, n, col = '#857d6c') {
  let o = '';
  for (let i = 0; i < n; i++) {
    const s0 = R() * Ls, t0 = R() * Lt * 0.9, w = 0.6 + R() * 2.2, h = 0.4 + R() * 1.4, pts = [];
    for (let k = 0; k < 14; k++) { const th = k / 14 * Math.PI * 2, rr = 0.55 + R() * 0.45; pts.push(P(...at(Math.max(0, Math.min(Ls, s0 + Math.cos(th) * w / 2 * rr)), Math.max(0, Math.min(Lt, t0 + Math.sin(th) * h / 2 * rr))))); }
    o += `<path d="${smooth(pts, true, 0.25)}" fill="${mix(col, R() < 0.5 ? '#c8bea8' : '#2a2218', R() * 0.25)}" stroke="${INK}" stroke-width="0.8" opacity="0.92"/>`;
    o += `<path d="${smooth(pts, true, 0.25)}" fill="url(#grimeF)" opacity="0.6"/>`;
    for (let k = 0; k < 3; k++) { const c = P(...at(Math.min(Ls, s0 + (R() - 0.5) * w * 0.6), Math.min(Lt, t0 + (R() - 0.5) * h * 0.6))); o += `<path d="M${f(c[0])} ${f(c[1])} l${f((R() - 0.5) * 8)} ${f(4 + R() * 6)} l${f((R() - 0.5) * 6)} ${f(3 + R() * 5)}" stroke="${INK}" stroke-width="0.7" fill="none"/>`; }
  }
  return o;
}
// damp and soot: soft blooms (rising soot above an opening, damp spreading from the ground and from broken gutters)
function bloom(x, y, r, col = '#0e0a08', op = 0.4, up = 0) {
  let o = ''; for (let i = 0; i < 4; i++) o += a.stain(x + (R() - 0.5) * r * 0.4, y - up * i * r * 0.5, r * (1 - i * 0.18), col, op * (1 - i * 0.15)); return o;
}
// dead creeper climbing a wall: a wandering stem with side shoots and a few leaves left
function creeper(x, y, len, s, up = -1) {
  let o = '', cx = x, cy = y, d = `M${f(x)} ${f(y)}`;
  for (let i = 0; i < 14; i++) {
    const nx = cx + (R() - 0.5) * s * 0.5, ny = cy + up * len / 14;
    d += ` Q${f(cx + (R() - 0.5) * s * 0.4)} ${f((cy + ny) / 2)} ${f(nx)} ${f(ny)}`;
    if (R() < 0.6) { const bx = nx + (R() - 0.5) * s * 1.2, by = ny + up * R() * s * 0.4; o += `<path d="M${f(nx)} ${f(ny)} Q${f((nx + bx) / 2)} ${f(ny + up * s * 0.2)} ${f(bx)} ${f(by)}" stroke="#2a2418" stroke-width="${f(Math.max(0.6, s * 0.03))}" fill="none"/>`; if (R() < 0.6) o += `<path d="${blob(bx, by, Math.max(1.2, s * 0.07), R, 5, 0.35)}" fill="${R() < 0.5 ? '#3e4626' : '#5a4a2a'}" stroke="${INK}" stroke-width="0.5"/>`; }
    cx = nx; cy = ny;
  }
  return `<path d="${d}" stroke="#221c12" stroke-width="${f(Math.max(1, s * 0.05))}" fill="none" stroke-linecap="round"/>` + o;
}
// shading pass over a face already filled with blocks: wash, hatch, grime, mottle
function shade(pts3, o = {}) {
  const pi = planeId(pts3[0], pts3[1], pts3[pts3.length - 1]); if (pi >= 0) a.raw(`<g class="pl_${pi}">`);
  shade0(pts3, o); if (pi >= 0) a.raw('</g>');
}
function shade0(pts3, o = {}) {
  if (o.dark) a.raw(`<path d="${pp(pts3)}" fill="${a.hatchPat(o.dark, 3.2, 0.55)}" opacity="${o.darkOp || 0.45}"/>`);
  return a.shape(Object.assign({ d: pp(pts3), fill: 'rgba(0,0,0,0)', depth: 14, hatch: 70, mottle: 0.35, grime: 0.35, hlOp: 0.08, ink: 1.4, wash: 0.3 }, o));
}
// a plank surface (door leaves, huts, hoardings) on at(s,t); boards run along t unless o.across
function planks(at, Ls, Lt, col, o = {}) { return PLW([at(0, 0), at(Ls, 0), at(0, Lt)], planks0(at, Ls, Lt, col, o)); }
function planks0(at, Ls, Lt, col, o = {}) {
  const Z = at(Ls / 2, 0)[2], bw = o.board || 0.26;
  let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${dark(col, 0.4)}"/>`;
  if (o.across) {
    for (let t = 0; t < Lt - 0.02; t += bw) { const t1 = Math.min(Lt, t + bw), sh = (R() - 0.5) * 0.06; out += `<path d="${pp([at(0, t + 0.012), at(Ls, t + 0.012 + sh), at(Ls, t1 - 0.012 + sh), at(0, t1 - 0.012)])}" fill="${mix(col, R() < 0.5 ? '#c8b89a' : '#100c08', R() * 0.3)}" stroke="${INK}" stroke-width="${f(inkAt(Z) * 0.55)}"/>`; }
  } else {
    for (let s = 0; s < Ls - 0.02; s += bw) { const s1 = Math.min(Ls, s + bw), rag = o.ragged ? R() * o.ragged : 0; out += `<path d="${pp([at(s + 0.012, 0), at(s1 - 0.012, 0), at(s1 - 0.012, Lt - rag), at(s + 0.012, Lt - rag * 0.6)])}" fill="${mix(col, R() < 0.5 ? '#c8b89a' : '#100c08', R() * 0.3)}" stroke="${INK}" stroke-width="${f(inkAt(Z) * 0.55)}"/>`; }
  }
  if (o.nails) for (let i = 0; i < o.nails; i++) { const q = P(...at(R() * Ls, R() * Lt)); out += `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="${f(Math.max(0.6, K(Z) * 0.018))}" fill="#2a2420"/>`; }
  return out;
}
// round-arched opening on a face, as 3D points
function archPts(at, s0, s1, t0, ts, rise, n = 10) {
  const pts = [at(s0, t0), at(s1, t0), at(s1, ts)];
  for (let i = 1; i < n; i++) { const th = Math.PI * i / n, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2; pts.push(at(sm + Math.cos(th) * rw, ts + Math.sin(th) * rise)); }
  pts.push(at(s0, ts));
  return pts;
}
// the ring of wedge stones round an arch
function archRing(at, s0, s1, ts, rise, dep, col, n = 9) { return PLW([at(0, 0), at(1, 0), at(0, 1)], archRing0(at, s0, s1, ts, rise, dep, col, n)); }
function archRing0(at, s0, s1, ts, rise, dep, col, n = 9) {
  let out = ''; const sm = (s0 + s1) / 2, rw = (s1 - s0) / 2;
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI * i / n, t1 = Math.PI * (i + 1) / n, Q = (t, k) => at(sm + Math.cos(t) * (rw + k), ts + Math.sin(t) * (rise + k));
    out += `<path d="${pp([Q(t0, 0), Q(t1, 0), Q(t1, dep), Q(t0, dep)])}" fill="${mix(col, R() < 0.5 ? '#d8cbb0' : '#1a1410', R() * 0.22 + (i === (n >> 1) ? 0.12 : 0))}" stroke="${INK}" stroke-width="${f(inkAt(at(sm, 0)[2]) * 0.7)}"/>`;
  }
  return out;
}
// a lit opening: warm interior, a light spill onto the ground before it
function litHole(pts3, Z, o = {}) {
  const ps = pts3.map(p => P(...p)), cx = ps.reduce((s, p) => s + p[0], 0) / ps.length, cy = ps.reduce((s, p) => s + p[1], 0) / ps.length;
  const id = a.id('lh');
  a.raw(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.top || '#6a3a18'}"/><stop offset="1" stop-color="${o.bot || '#f0a048'}"/></linearGradient>`);
  a.raw(PLW([pts3[0], pts3[1], pts3[2]], EM(`<path d="${poly(ps)}" fill="url(#${id})" stroke="${INK}" stroke-width="${f(inkAt(Z) * 1.2)}"/>`)));
  { const pi = planeId(pts3[0], pts3[1], pts3[2]), n = pi >= 0 ? PLANES[pi].n : [0, 0, -1], c = pts3.reduce((s, p) => s.map((v, i) => v + p[i] / pts3.length), [0, 0, 0]);
    let area = 0; for (let i = 1; i < pts3.length - 1; i++) area += Math.hypot(...cross3(sub3(pts3[i], pts3[0]), sub3(pts3[i + 1], pts3[0]))) / 2;
    addLight(c[0] - n[0] * 0.5, c[1] - n[1] * 0.5, c[2] - n[2] * 0.5, o.I || Math.min(1.4, Math.max(0.25, area * 0.28)), o.range || Math.min(7, 2.5 + area * 0.8), o.col || [1.0, 0.58, 0.26]); }
  if (o.soot !== false) { const top = Math.min(...ps.map(p => p[1])); a.raw(bloom(cx, top - K(Z) * 0.25, K(Z) * 0.35, '#0e0a08', 0.32, 1)); }
  if (o.glow !== false) a.raw(a.glow(cx, cy, K(Z) * (o.r || 1.6), GLOW, o.op || 0.35));
  return [cx, cy];
}
// Containment rule: anything inside a room, seen through a door, window or hatch, is drawn through the opening's clip.
// Nothing behind an opening may be drawn without it (this is what let the almonry shelves run onto the wall).
function throughAll(list, fn) { const id = a.id('th'); a.raw(`<clipPath id="${id}">${list.map(p => `<path d="${pp(p)}"/>`).join('')}</clipPath><g clip-path="url(#${id})">`); fn(); a.raw('</g>'); }
function through(pts3, fn) { const id = a.id('th'); a.raw(`<clipPath id="${id}"><path d="${pp(pts3)}"/></clipPath><g clip-path="url(#${id})">`); fn(); a.raw('</g>'); }
// a window: lit, dark, shuttered or boarded
function windowOn(at, s0, s1, t0, t1, kind = 'lit') {
  const Z = at((s0 + s1) / 2, 0)[2], pts = archPts(at, s0, s1, t0, t1 - (s1 - s0) * 0.5, (s1 - s0) * 0.5, 6);
  if (kind === 'lit') { litHole(pts, Z, { r: 0.9, op: 0.3, top: '#8a4a1a', bot: '#f6c070' }); a.raw(seg(at((s0 + s1) / 2, t0), at((s0 + s1) / 2, t1 - 0.05), INK, inkAt(Z) * 1.1) + seg(at(s0, (t0 + t1) / 2), at(s1, (t0 + t1) / 2), INK, inkAt(Z) * 0.9)); }
  else a.raw(`<path d="${pp(pts)}" fill="#120e0b" stroke="${INK}" stroke-width="${f(inkAt(Z) * 1.1)}"/>`);
  if (kind === 'boarded') a.raw(planks((s, t) => at(s0 - 0.08 + s, t0 + 0.1 + t), s1 - s0 + 0.16, t1 - t0 - 0.25, '#5a4a38', { across: true, board: 0.2, nails: 4 }));
  if (kind === 'shutter') a.raw(planks((s, t) => at(s1 + s, t0 + t), (s1 - s0) * 0.9, t1 - t0 - 0.1, '#4a3c2c', { board: 0.14 }));
  a.raw(`<path d="${pp([at(s0 - 0.06, t0 - 0.12), at(s1 + 0.06, t0 - 0.12), at(s1 + 0.1, t0), at(s0 - 0.1, t0)])}" fill="${STONE2}" stroke="${INK}" stroke-width="${f(inkAt(Z) * 0.7)}"/>`);
  a.raw(a.drip(P(...at(s0 + 0.05, t0 - 0.12))[0], P(...at(s0, t0 - 0.12))[1], K(Z) * 0.5, 1.2, '#1a1410'));
}
// slate roof between eave e0-e1 and ridge r0-r1 (3D), with courses, missing slates, plank patches, moss
function roof(e0, e1, r1, r0, col, o = {}) { return PLW([e0, e1, r0], roof0(e0, e1, r1, r0, col, o)); }
function roof0(e0, e1, r1, r0, col, o = {}) {
  const n = o.courses || 12, Z = (e0[2] + r1[2]) / 2, sag = o.sag === undefined ? 0.22 : o.sag;
  // a sagging roof: every line along the roof dips toward its middle, more toward the ridge
  const L0 = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);
  const L = (p, q, t) => L0(p, q, t);
  let out = `<path d="${pp([e0, e1, r1, r0])}" fill="${col}"/>`;
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, A = L(e0, r0, t0), B = L(e1, r1, t0), A1 = L(e0, r0, t1), B1 = L(e1, r1, t1);
    const m = Math.max(4, Math.round(Math.hypot(B[0] - A[0], B[2] - A[2]) / 0.45));
    for (let j = 0; j < m; j++) {
      const u0 = (j + (i % 2) * 0.5) / m, u1 = Math.min(1, u0 + 1 / m);
      if (u0 >= 1) continue;
      const dip = (u, tt) => { const p = L(L(A, B, 0), L(A1, B1, 0), 0); return Math.sin(u * Math.PI) * sag * (0.3 + tt); };
      const Q = (AA, BB, u, tt) => { const p = L(AA, BB, u); return [p[0], p[1] - dip(u, tt) + (R() - 0.5) * 0.03, p[2]]; };
      const q = [Q(A, B, u0, t0), Q(A, B, u1, t0), Q(A1, B1, u1, t1), Q(A1, B1, u0, t1)];
      const miss = R() < (o.holes || 0.04) * 0.35;
      out += `<path d="${pp(q)}" fill="${miss ? '#0e0b09' : mix(col, R() < 0.5 ? '#a8a49a' : '#0e0c0a', R() * 0.2)}" stroke="${INK}" stroke-width="${f(inkAt(q[0][2]) * 0.45)}"/>`;
    }
    out += `<path d="${smooth([0, 0.25, 0.5, 0.75, 1].map(u => { const p = L(A, B, u); return P(p[0], p[1] - Math.sin(u * Math.PI) * sag * (0.3 + t0), p[2]); }), false, 0.6)}" stroke="${INK}" stroke-width="${f(inkAt(A[2]) * 1.1)}" fill="none" opacity="0.8"/>`;
  }
  for (let i = 0; i < (o.moss || 4); i++) { const t = R(), u = R(), q = P(...L(L(e0, e1, u), L(r0, r1, u), t)); out += `<path d="${blob(q[0], q[1], K(Z) * (0.3 + R() * 0.5), R, 7, 0.4)}" fill="#4a5232" opacity="0.55"/>`; }
  out += `<path d="${smooth([0, 0.25, 0.5, 0.75, 1].map(u => { const p = L(r0, r1, u); return P(p[0], p[1] - Math.sin(u * Math.PI) * sag * 1.3, p[2]); }), false, 0.6)}" stroke="${INK}" stroke-width="${f(inkAt(r0[2]) * 2)}" fill="none"/>`;
  for (const pt of o.patches || []) { const [u, t, du, dt] = pt; const at = (s, tt) => L(L(e0, e1, u + s), L(r0, r1, u + s), t + tt); out += planks(at, du, dt, '#5a4836', { across: true, board: 0.12, nails: 3 }); }
  return out;
}
// a hooded figure: stand, kneel, sit, lie or bend; facing -1 (left) / 1 (right)
function folk(X, Z, o = {}) {
  const lean = o.lean !== undefined ? o.lean : (R() - 0.5) * 7;
  const [fx, fy] = P(X, 0, Z);
  a.raw(`<g transform="rotate(${f(lean)} ${f(fx)} ${f(fy)})">`);
  folkBody(X, Z, o);
  // a bundle or pack on the back, a blanket roll, a crutch under the arm
  const s = K(Z), face = o.face || 1, th = (o.h || 1.68) * s * (o.pose === 'kneel' ? 0.62 : o.pose === 'sit' ? 0.55 : 1);
  if (o.pack) a.shape({ d: smooth([[fx - face * s * 0.12, fy - th * 0.78], [fx - face * s * 0.42, fy - th * 0.74], [fx - face * s * 0.46, fy - th * 0.45], [fx - face * s * 0.16, fy - th * 0.42]], true, 0.6), fill: o.pack, tex: 'url(#weave)', texOp: 0.5, depth: s * 0.08, ink: inkAt(Z), mottle: 0.5, grime: 0.6, lines: [`M${f(fx - face * s * 0.14)} ${f(fy - th * 0.62)} L${f(fx - face * s * 0.44)} ${f(fy - th * 0.6)}`] });
  if (o.crutch) a.raw(`<path d="M${f(fx + face * s * 0.2)} ${f(fy - th * 0.74)} L${f(fx + face * s * 0.3)} ${f(fy)} M${f(fx + face * s * 0.1)} ${f(fy - th * 0.75)} L${f(fx + face * s * 0.3)} ${f(fy - th * 0.73)}" stroke="${INK}" stroke-width="${f(s * 0.05 + 1.5)}" stroke-linecap="round"/><path d="M${f(fx + face * s * 0.2)} ${f(fy - th * 0.74)} L${f(fx + face * s * 0.3)} ${f(fy)}" stroke="${TIMBER}" stroke-width="${f(s * 0.03)}"/>`);
  a.raw('</g>');
}
function folkBody(X, Z, o = {}) {
  const s = K(Z), [x, y] = P(X, 0, Z), col = o.col || '#4a4038', face = o.face || 1, pose = o.pose || 'stand', hgt = (o.h || 1.68) * s;
  const ink = inkAt(Z) * 1.1, skin = o.skin || '#8e7c64';
  a.raw(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s * (pose === 'lie' ? 1.0 : 0.42))}" ry="${f(s * 0.08)}" fill="#0e0b08" opacity="0.5"/>`);
  if (pose === 'lie') {
    const L = s * 0.9;
    a.shape({ d: smooth([[x - L, y - s * 0.05], [x - L * 0.9, y - s * 0.3], [x - L * 0.2, y - s * 0.36], [x + L * 0.6, y - s * 0.3], [x + L * 0.95, y - s * 0.12], [x + L, y]], true, 0.6), fill: col, depth: s * 0.14, ink, mottle: 0.5, grime: 0.5, hatch: 60,
      decals: o.blood ? a.stain(x + L * 0.1, y - s * 0.22, s * 0.16, G.blood, 0.55) : '' });
    a.shape({ d: blob(x - L * 0.92 * face, y - s * 0.26, s * 0.12, R, 7, 0.15), fill: skin, depth: s * 0.05, ink, hl: false });
    return;
  }
  const kn = pose === 'kneel' ? 0.62 : pose === 'sit' ? 0.55 : 1, bend = pose === 'bend' ? 0.32 : (pose === 'kneel' ? 0.1 : 0), th = hgt * kn;
  const hx = x + face * th * bend, hy = y - th * 0.9 - (pose === 'bend' ? -th * 0.12 : 0), sw = s * (pose === 'sit' ? 0.36 : 0.25), hw = s * (pose === 'kneel' || pose === 'sit' ? 0.44 : 0.36);
  const robe = [[x - hw * (0.9 + R() * 0.2), y + s * 0.01], [x - hw * 0.98, y - th * 0.2], [x - hw * 0.86, y - th * 0.45], [hx - sw, hy + th * 0.16], [hx - sw * 0.5, hy + th * 0.04], [hx + sw * 0.6, hy + th * 0.05], [hx + sw, hy + th * 0.18], [x + hw * 0.84, y - th * 0.48], [x + hw * 0.98, y - th * 0.18], [x + hw * (0.9 + R() * 0.2), y], [x + hw * 0.5, y - s * 0.05], [x + hw * 0.1, y + s * 0.01], [x - hw * 0.4, y - s * 0.04]];
  const hem = Array.from({ length: 6 }, (_, i) => `M${f(x - hw + i * hw * 0.4)} ${f(y)} l${f((R() - 0.5) * s * 0.04)} ${f(-s * (0.05 + R() * 0.08))}`);
  a.shape({ d: smooth(robe, true, 0.45), fill: col, depth: s * 0.12, ink, mottle: 0.5, grime: 0.6, hatch: 60, gap: 2.4,
    lines: [...hem, `M${f(hx + face * sw * 0.2)} ${f(hy + th * 0.2)} C${f(x + face * hw * 0.1)} ${f(y - th * 0.5)} ${f(x + face * hw * 0.3)} ${f(y - th * 0.3)} ${f(x + face * hw * 0.2)} ${f(y)}`],
    decals: a.stain(x, y - th * 0.1, s * 0.2, '#1a140e', 0.5) + (o.blood ? a.stain(x - hw * 0.3, y - th * 0.5, s * 0.1, G.blood, 0.6) : '') });
  // a hanging sleeve down the near side, a rope belt, mud on the hem
  if (pose !== 'sit') a.shape({ d: smooth([[hx + face * sw * 0.3, hy + th * 0.2], [hx + face * sw * 1.0, hy + th * 0.24], [x + face * hw * 0.7, y - th * 0.42], [x + face * hw * 0.35, y - th * 0.36], [x + face * hw * 0.2, y - th * 0.5]], true, 0.5), fill: dark(col, 0.14), depth: s * 0.06, ink: ink * 0.9, hatch: 60, hl: false, mottle: 0.4 });
  a.raw(`<path d="M${f(x - hw * 0.8)} ${f(y - th * 0.52)} Q${f(x)} ${f(y - th * 0.48)} ${f(x + hw * 0.8)} ${f(y - th * 0.53)}" stroke="#8a7a5a" stroke-width="${f(Math.max(1, s * 0.025))}" fill="none"/>` + `<path d="M${f(x - hw)} ${f(y)} L${f(x + hw)} ${f(y)} L${f(x + hw * 0.95)} ${f(y - th * 0.08)} Q${f(x)} ${f(y - th * 0.12)} ${f(x - hw * 0.95)} ${f(y - th * 0.07)} Z" fill="#1e1810" opacity="0.55"/>`);
  // arm: across the body, holding out a bowl, leaning on a staff, or raised to dig
  const arm = o.arm || 'fold';
  if (arm === 'fold' && pose !== 'lie') { const [hx2, hy2] = [x + face * hw * 0.45, y - th * 0.44]; a.raw(`<path d="${blob(hx2, hy2, Math.max(1.4, s * 0.05), R, 6, 0.2)}" fill="${skin}" stroke="${INK}" stroke-width="${f(ink * 0.7)}"/>`); }
  if (arm === 'bowl') { a.shape({ d: smooth([[hx + face * sw * 0.4, hy + th * 0.28], [hx + face * sw * 1.5, hy + th * 0.46], [hx + face * sw * 1.6, hy + th * 0.54], [hx + face * sw * 0.3, hy + th * 0.5]], true, 0.4), fill: dark(col, 0.1), depth: s * 0.05, ink, hl: false }); a.raw(`<path d="${blob(hx + face * sw * 1.55, hy + th * 0.5, Math.max(1.4, s * 0.045), R, 6, 0.2)}" fill="${skin}" stroke="${INK}" stroke-width="${f(ink * 0.7)}"/><path d="M${f(hx + face * sw * 1.4)} ${f(hy + th * 0.46)} q${f(face * s * 0.08)} ${f(s * 0.07)} ${f(face * s * 0.16)} 0 Z" fill="#5a4a38" stroke="${INK}" stroke-width="${f(ink * 0.8)}"/>`); }
  if (arm === 'staff') a.raw(`<path d="M${f(hx + face * sw * 1.2)} ${f(hy - th * 0.05)} L${f(x + face * hw * 1.3)} ${f(y)}" stroke="${INK}" stroke-width="${f(s * 0.05 + 1.5)}" stroke-linecap="round"/><path d="M${f(hx + face * sw * 1.2)} ${f(hy - th * 0.05)} L${f(x + face * hw * 1.3)} ${f(y)}" stroke="${TIMBER}" stroke-width="${f(s * 0.03)}" stroke-linecap="round"/>`);
  if (arm === 'spade') { const sx = x + face * hw * 1.6; a.raw(`<path d="M${f(hx + face * sw)} ${f(hy + th * 0.1)} L${f(sx)} ${f(y - s * 0.1)}" stroke="${INK}" stroke-width="${f(s * 0.05 + 1.5)}" stroke-linecap="round"/><path d="M${f(hx + face * sw)} ${f(hy + th * 0.1)} L${f(sx)} ${f(y - s * 0.1)}" stroke="${TIMBER}" stroke-width="${f(s * 0.03)}"/><path d="M${f(sx - s * 0.1)} ${f(y - s * 0.12)} L${f(sx + s * 0.1)} ${f(y - s * 0.12)} L${f(sx + s * 0.07)} ${f(y + s * 0.06)} L${f(sx - s * 0.07)} ${f(y + s * 0.06)} Z" fill="#4a4640" stroke="${INK}" stroke-width="${f(ink)}"/>`); }
  if (arm === 'pray') { a.shape({ d: smooth([[hx + face * sw * 0.2, hy + th * 0.26], [hx + face * sw * 1.1, hy + th * 0.22], [hx + face * sw * 1.2, hy + th * 0.32], [hx + face * sw * 0.2, hy + th * 0.42]], true, 0.4), fill: dark(col, 0.12), depth: s * 0.05, ink, hl: false }); a.raw(`<path d="${blob(hx + face * sw * 1.2, hy + th * 0.25, Math.max(1.4, s * 0.045), R, 6, 0.2)}" fill="${skin}" stroke="${INK}" stroke-width="${f(ink * 0.7)}"/>`); }
  // head: a hood with a shadowed face, or bare-headed with a pale face
  if (o.bare) {
    a.shape({ d: blob(hx + face * s * 0.03, hy, s * 0.11, R, 8, 0.12), fill: skin, depth: s * 0.06, ink, hatch: 60, mottle: 0.4 });
    a.raw(`<path d="M${f(hx - s * 0.1)} ${f(hy - s * 0.05)} C${f(hx - s * 0.06)} ${f(hy - s * 0.15)} ${f(hx + s * 0.08)} ${f(hy - s * 0.14)} ${f(hx + s * 0.11)} ${f(hy - s * 0.04)}" stroke="${o.hair || '#2a2018'}" stroke-width="${f(s * 0.06)}" fill="none" stroke-linecap="round"/>`);
  } else {
    const hood = [[hx - sw * 1.05, hy + th * 0.19], [hx - s * 0.15, hy + s * 0.05], [hx - s * 0.14, hy - s * 0.09], [hx - face * s * 0.02, hy - s * 0.17], [hx + face * s * 0.12, hy - s * 0.11], [hx + face * s * 0.15, hy + s * 0.04], [hx + sw * 1.05, hy + th * 0.19], [hx, hy + th * 0.24]];
    a.shape({ d: smooth(hood, true, 0.55), fill: dark(col, 0.06), depth: s * 0.08, ink, hatch: 60, mottle: 0.4, grime: 0.4 });
    const fx = hx + face * s * 0.05, fy = hy + s * 0.01;
    a.raw(`<ellipse cx="${f(fx)}" cy="${f(fy)}" rx="${f(s * 0.075)}" ry="${f(s * 0.095)}" fill="#120d0a"/>` +
      `<path d="M${f(fx - s * 0.04)} ${f(fy + s * 0.05)} Q${f(fx + face * s * 0.02)} ${f(fy + s * 0.1)} ${f(fx + face * s * 0.06)} ${f(fy + s * 0.04)} L${f(fx + face * s * 0.05)} ${f(fy + s * 0.01)} Q${f(fx)} ${f(fy + s * 0.04)} ${f(fx - s * 0.03)} ${f(fy + s * 0.02)} Z" fill="${skin}"/>` +
      `<path d="M${f(fx + face * s * 0.04)} ${f(fy - s * 0.02)} l${f(face * s * 0.025)} ${f(s * 0.03)}" stroke="${skin}" stroke-width="${f(Math.max(0.8, s * 0.02))}" opacity="0.85"/>`);
  }
}
// a barrel, a crate and a sack, on the ground at (X, Z)
function barrel(X, Z, Y = 0) {
  const s = K(Z), [x, y] = P(X, Y, Z), w = s * 0.32, h = s * 0.85;
  a.shape({ d: `M${f(x - w)} ${f(y)} C${f(x - w * 1.18)} ${f(y - h * 0.5)} ${f(x - w * 1.18)} ${f(y - h * 0.5)} ${f(x - w)} ${f(y - h)} L${f(x + w)} ${f(y - h)} C${f(x + w * 1.18)} ${f(y - h * 0.5)} ${f(x + w * 1.18)} ${f(y - h * 0.5)} ${f(x + w)} ${f(y)} Z`, fill: '#5a4430', tex: 'url(#grain)', texOp: 0.4, depth: s * 0.12, ink: inkAt(Z) * 1.2, mottle: 0.5, grime: 0.5,
    lines: [0.18, 0.82].map(t => ({ d: `M${f(x - w * 1.12)} ${f(y - h * t)} Q${f(x)} ${f(y - h * t + s * 0.05)} ${f(x + w * 1.12)} ${f(y - h * t)}`, w: s * 0.05, col: '#2a2622' })) });
  a.raw(`<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w)}" ry="${f(s * 0.06)}" fill="#3a2c20" stroke="${INK}" stroke-width="${f(inkAt(Z))}"/>`);
}
function crate(X, Z, sz = 0.6, Y = 0) {
  const s = K(Z), [x, y] = P(X, Y, Z), w = s * sz;
  a.shape({ d: `M${f(x - w / 2)} ${f(y)} L${f(x + w / 2)} ${f(y)} L${f(x + w / 2)} ${f(y - w)} L${f(x - w / 2)} ${f(y - w)} Z`, fill: '#6a5640', tex: 'url(#grain)', texOp: 0.5, depth: s * 0.1, ink: inkAt(Z) * 1.2, mottle: 0.4, grime: 0.6,
    lines: [`M${f(x - w / 2)} ${f(y)} L${f(x + w / 2)} ${f(y - w)}`, `M${f(x - w / 2)} ${f(y - w / 2)} L${f(x + w / 2)} ${f(y - w / 2)}`] });
  a.raw(`<path d="M${f(x - w / 2)} ${f(y - w)} L${f(x - w / 2 + s * 0.12)} ${f(y - w - s * 0.06)} L${f(x + w / 2 + s * 0.12)} ${f(y - w - s * 0.06)} L${f(x + w / 2)} ${f(y - w)} Z" fill="#7a6650" stroke="${INK}" stroke-width="${f(inkAt(Z))}"/>`);
}
function sack(X, Z, Y = 0) {
  const s = K(Z), [x, y] = P(X, Y, Z);
  a.shape({ d: smooth([[x - s * 0.3, y], [x - s * 0.32, y - s * 0.3], [x - s * 0.1, y - s * 0.52], [x + s * 0.06, y - s * 0.6], [x + s * 0.2, y - s * 0.45], [x + s * 0.3, y - s * 0.1], [x + s * 0.28, y]], true, 0.6), fill: '#736548', tex: 'url(#weave)', texOp: 0.5, depth: s * 0.1, ink: inkAt(Z) * 1.1, mottle: 0.5, grime: 0.6,
    lines: [`M${f(x - s * 0.12)} ${f(y - s * 0.4)} q${f(s * 0.05)} ${f(s * 0.15)} ${f(-s * 0.02)} ${f(s * 0.3)}`, `M${f(x + s * 0.12)} ${f(y - s * 0.3)} q${f(-s * 0.06)} ${f(s * 0.12)} ${f(s * 0.03)} ${f(s * 0.26)}`] });
  a.raw(`<path d="M${f(x - s * 0.04)} ${f(y - s * 0.56)} l${f(s * 0.12)} ${f(-s * 0.02)}" stroke="${INK}" stroke-width="${f(s * 0.04 + 1.5)}"/><path d="M${f(x + s * 0.02)} ${f(y - s * 0.58)} q${f(-s * 0.05)} ${f(-s * 0.1)} ${f(s * 0.02)} ${f(-s * 0.14)} q${f(s * 0.05)} ${f(s * 0.06)} ${f(-s * 0.02)} ${f(s * 0.14)}" fill="#8a7a5a" stroke="${INK}" stroke-width="1.4"/>`);
}
function crow(x, y, s, face = 1) {
  return `<path d="M${f(x)} ${f(y)} c${f(face * s * 0.3)} ${f(-s * 0.5)} ${f(face * s * 0.9)} ${f(-s * 0.6)} ${f(face * s * 1.1)} ${f(-s * 0.5)} l${f(face * s * 0.35)} ${f(s * 0.05)} l${f(-face * s * 0.3)} ${f(s * 0.12)} c${f(-face * s * 0.2)} ${f(s * 0.4)} ${f(-face * s * 0.7)} ${f(s * 0.5)} ${f(-face * s * 1.1)} ${f(s * 0.4)} l${f(-face * s * 0.6)} ${f(s * 0.2)} Z" fill="#100c0a"/><path d="M${f(x + face * s * 0.5)} ${f(y + s * 0.4)} l0 ${f(s * 0.35)} M${f(x + face * s * 0.7)} ${f(y + s * 0.38)} l${f(face * s * 0.05)} ${f(s * 0.36)}" stroke="#100c0a" stroke-width="${f(Math.max(0.8, s * 0.07))}"/><circle cx="${f(x + face * s * 1.12)}" cy="${f(y - s * 0.42)}" r="${f(Math.max(0.5, s * 0.06))}" fill="#c8c0b0"/>`;
}
const flying = (x, y, s) => `<path d="M${f(x - s)} ${f(y - s * 0.3)} Q${f(x - s * 0.4)} ${f(y - s * 0.6)} ${f(x)} ${f(y)} Q${f(x + s * 0.4)} ${f(y - s * 0.6)} ${f(x + s)} ${f(y - s * 0.35)} Q${f(x + s * 0.4)} ${f(y - s * 0.2)} ${f(x)} ${f(y + s * 0.15)} Q${f(x - s * 0.4)} ${f(y - s * 0.15)} ${f(x - s)} ${f(y - s * 0.3)} Z" fill="#14100e"/>`;
// a wood fire: many curling tongues of uneven height, dark-red outer, orange body, yellow-white core, sparks above
function fireTongues(x, y, h, w) {
  let o = '';
  const tongue = (bx, hh, ww, col, op) => {
    const st = col === '#7a1e0c' ? ` stroke="${INK}" stroke-width="1.6"` : '';
    const lean = (R() - 0.5) * 0.5, tx = bx + lean * hh, wig = (R() - 0.5) * ww;
    return `<path d="M${f(bx - ww)} ${f(y)} C${f(bx - ww * 1.2)} ${f(y - hh * 0.3)} ${f(bx - ww * 0.2 + wig)} ${f(y - hh * 0.45)} ${f(bx - ww * 0.4 + wig)} ${f(y - hh * 0.68)} C${f(bx - ww * 0.5 + wig)} ${f(y - hh * 0.82)} ${f(tx - ww * 0.15)} ${f(y - hh * 0.9)} ${f(tx)} ${f(y - hh)} C${f(tx + ww * 0.25)} ${f(y - hh * 0.86)} ${f(bx + ww * 0.6 - wig)} ${f(y - hh * 0.7)} ${f(bx + ww * 0.45 - wig)} ${f(y - hh * 0.5)} C${f(bx + ww * 0.35)} ${f(y - hh * 0.3)} ${f(bx + ww * 1.2)} ${f(y - hh * 0.2)} ${f(bx + ww)} ${f(y)} Z" fill="${col}" opacity="${op}"${st}/>`;
  };
  const spots = Array.from({ length: 9 }, (_, i) => [x + (i - 4) / 4 * w * 0.5 + (R() - 0.5) * w * 0.1, h * (0.35 + R() * 0.45) * (1 - Math.abs(i - 4) / 7)]);
  for (const [bx, hh] of spots) o += tongue(bx, hh * 1.12, w * 0.15, '#7a1e0c', 0.95);
  for (const [bx, hh] of spots) o += tongue(bx, hh * 0.92, w * 0.12, '#d8501a', 0.9);
  for (const [bx, hh] of spots) o += tongue(bx, hh * 0.6, w * 0.08, '#ffa83a', 0.95);
  for (const [bx, hh] of spots.slice(2, 7)) o += tongue(bx, hh * 0.34, w * 0.05, '#fff0b0', 0.95);
  // a few torn-off flame licks above the body, sparks
  for (let i = 0; i < 5; i++) { const fx = x + (R() - 0.5) * w * 0.6, fy = y - h * (0.75 + R() * 0.4), r = w * 0.03; o += `<path d="M${f(fx)} ${f(fy)} q${f(r)} ${f(-r * 2)} 0 ${f(-r * 4)} q${f(-r * 1.4)} ${f(r * 2)} 0 ${f(r * 4)} Z" fill="#ffa83a" opacity="0.8"/>`; }
  return `<g class="em">${o}</g>`;
}
function smoke(pts, w, op = 0.22, col = '#3e3a36') {
  const d = 'M' + pts.map(p => p.map(f).join(' ')).join(' L');
  return `<g filter="url(#rough)"><path d="${smooth(pts, false, 0.8)}" stroke="${col}" stroke-width="${f(w)}" fill="none" stroke-linecap="round" opacity="${op}"/><path d="${smooth(pts, false, 0.8)}" stroke="${col}" stroke-width="${f(w * 0.55)}" fill="none" stroke-linecap="round" opacity="${f(op * 0.9)}"/></g>`;
}
const lantern = (x, y, s, w) => (w ? (addLight(w[0], w[1], w[2], w[3] || 0.5, w[4] || 4, [1.0, 0.68, 0.36]), '') : '') + a.glow(x, y, s * 3.2, GLOW, 0.55) + `<path d="M${f(x)} ${f(y - s * 1.6)} L${f(x)} ${f(y - s * 0.9)}" stroke="${INK}" stroke-width="${f(Math.max(1, s * 0.12))}"/><g class="em"><path d="M${f(x - s * 0.45)} ${f(y - s * 0.9)} L${f(x + s * 0.45)} ${f(y - s * 0.9)} L${f(x + s * 0.38)} ${f(y + s * 0.6)} L${f(x - s * 0.38)} ${f(y + s * 0.6)} Z" fill="#ffd486" stroke="${INK}" stroke-width="${f(Math.max(1, s * 0.14))}"/></g><path d="M${f(x)} ${f(y - s * 0.9)} L${f(x)} ${f(y + s * 0.6)}" stroke="${INK}" stroke-width="${f(Math.max(0.8, s * 0.08))}"/><path d="M${f(x - s * 0.55)} ${f(y - s * 0.9)} L${f(x)} ${f(y - s * 1.3)} L${f(x + s * 0.55)} ${f(y - s * 0.9)} Z" fill="#2a2622" stroke="${INK}" stroke-width="${f(Math.max(0.8, s * 0.1))}"/>`;
function torch(X, Y, Z, out) {
  const k = K(Z), [wx, wy] = P(X, Y - 0.25, Z), [tx, ty] = P(X + out[0] * 0.28, Y, Z + out[2] * 0.28);
  addLight(X + out[0] * 0.4, Y + 0.3, Z + out[2] * 0.4, 1.3, 6.5, [1.0, 0.56, 0.24]);
  return `<path d="M${f(wx)} ${f(wy)} L${f(tx)} ${f(ty + k * 0.05)}" stroke="${INK}" stroke-width="${f(k * 0.05 + 2)}"/><path d="M${f(wx)} ${f(wy)} L${f(tx)} ${f(ty + k * 0.05)}" stroke="#3a3632" stroke-width="${f(k * 0.03)}"/>` +
    `<path d="M${f(tx - k * 0.03)} ${f(ty + k * 0.25)} L${f(tx + k * 0.02)} ${f(ty - k * 0.02)}" stroke="${INK}" stroke-width="${f(k * 0.06 + 2)}" stroke-linecap="round"/><path d="M${f(tx - k * 0.03)} ${f(ty + k * 0.25)} L${f(tx + k * 0.02)} ${f(ty - k * 0.02)}" stroke="#4a3626" stroke-width="${f(k * 0.04)}" stroke-linecap="round"/>` +
    `<path d="M${f(tx - k * 0.06)} ${f(ty)} L${f(tx + k * 0.08)} ${f(ty - k * 0.02)} L${f(tx + k * 0.06)} ${f(ty + k * 0.06)} L${f(tx - k * 0.05)} ${f(ty + k * 0.08)} Z" fill="#2a2420" stroke="${INK}" stroke-width="1.2"/>` +
    a.glow(tx, ty - k * 0.2, k * 0.9, GLOW, 0.5) + fireTongues(tx + k * 0.01, ty - k * 0.01, k * 0.42, k * 0.2) + D.embers(tx, ty - k * 0.4, k * 0.4, 5) +
    `<path d="M${f(tx)} ${f(ty - k * 0.45)} C${f(tx - 4)} ${f(ty - k * 0.8)} ${f(tx + 6)} ${f(ty - k * 1.1)} ${f(tx + 2)} ${f(ty - k * 1.5)}" stroke="#14100c" stroke-width="${f(k * 0.12)}" opacity="0.25" fill="none"/>`;
}
const candles = (X, Z, n, Y = 0, spread = 0.5) => { addLight(X, Y + 0.3, Z - 0.15, 0.1 + 0.07 * n, 2.4, [1.0, 0.74, 0.44]); let o = ''; const s = K(Z); for (let i = 0; i < n; i++) { const [x, y] = P(X + (i - (n - 1) / 2) * spread / n + (R() - 0.5) * 0.05, Y, Z + (R() - 0.5) * 0.2), h = s * (0.08 + R() * 0.14), w = Math.max(1.6, s * 0.03); o += `<rect x="${f(x - w)}" y="${f(y - h)}" width="${f(w * 2)}" height="${f(h)}" fill="#d8ccb0" stroke="${INK}" stroke-width="0.7"/>` + a.glow(x, y - h - w * 1.5, s * 0.22, GLOW, 0.5) + `<g class="em"><path d="M${f(x)} ${f(y - h - w * 3.2)} q${f(w * 0.9)} ${f(w * 1.6)} 0 ${f(w * 2.4)} q${f(-w * 0.9)} ${f(-w * 0.8)} 0 ${f(-w * 2.4)} Z" fill="#ffd27a"/></g>`; } return o; };

// ================================================================== BACKGROUND LAYER
a.layer('bg');
// ------------------------------------------------------------------ the Grey: a flat, sunless sky with low strata and falling ash
{
  a.raw('<g class="em sky">');
  a.raw(`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e8c87"/><stop offset="0.7" stop-color="${SKY}"/><stop offset="1" stop-color="#b6b3ab"/></linearGradient><rect width="${W}" height="${HZ + 120}" fill="url(#sky)"/><radialGradient id="fireGround"><stop offset="0" stop-color="#ff9a3a" stop-opacity="0.55"/><stop offset="0.5" stop-color="#e07a2a" stop-opacity="0.22"/><stop offset="1" stop-color="#e07a2a" stop-opacity="0"/></radialGradient>`);
  for (let i = 0; i < 9; i++) { const y = 20 + i * 30 + R() * 16; a.raw(`<path d="M-20 ${f(y)} C400 ${f(y - 8 + R() * 16)} 900 ${f(y + R() * 14)} 1620 ${f(y - 6)}" stroke="#7a7873" stroke-width="${f(6 + R() * 14)}" fill="none" opacity="${f(0.12 + R() * 0.12)}" filter="url(#rough)"/>`); }
  a.raw('</g>');
}
// ------------------------------------------------------------------ the ground: mud, dead grass, flag paths, puddles
{
  a.raw(`<g class="pl_${planeId([0, 0, 5], [1, 0, 5], [0, 0, 6])}">`);
  a.raw(`<path d="${pp([[-30, 0, 3.0], [30, 0, 3.0], [30, 0, 40], [-30, 0, 40]])}" fill="${MUD}"/>`);
  // mottled mud tone
  a.shape({ d: pp([[-30, 0, 3.0], [30, 0, 3.0], [30, 0, 40], [-30, 0, 40]]), fill: 'rgba(0,0,0,0)', noShade: true, mottle: 0.75, grime: 0.6, ink: 0 });
  // dead grass in the four quarters of the garth, trodden to mud round the edges
  for (const [x0, x1, z0, z1] of [[-6.9, -0.4, 16.8, 28.4], [3.4, 6.9, 16.8, 28.4], [-6.9, -0.4, 8.5, 14.6], [3.4, 6.9, 8.5, 14.6], [-5.8, -0.4, 3.0, 8.0], [3.4, 5.8, 3.0, 8.0]]) {
    const pts = []; for (let i = 0; i <= 8; i++) pts.push(P(x0 + (x1 - x0) * i / 8 + (R() - 0.5) * 0.3, 0, z0 + (R() - 0.5) * 0.4)); for (let i = 0; i <= 8; i++) pts.push(P(x1 - (x1 - x0) * i / 8 + (R() - 0.5) * 0.3, 0, z1 + (R() - 0.5) * 0.4));
    a.shape({ d: smooth(pts, true, 0.3), fill: GRASS, depth: 0, noShade: true, mottle: 0.6, grime: 0.55, ink: 0.8 });
    for (let i = 0; i < 70; i++) { const X = x0 + R() * (x1 - x0), Z = z0 + R() * (z1 - z0), [x, y] = P(X, 0, Z), s = K(Z); { let d = ''; const n = 3 + Math.floor(R() * 5); for (let b = 0; b < n; b++) { const bx = x + (R() - 0.5) * s * 0.14, hh = s * (0.06 + R() * 0.14), bend = (R() - 0.5) * s * 0.12; d += `M${f(bx)} ${f(y)} Q${f(bx + bend * 0.3)} ${f(y - hh * 0.6)} ${f(bx + bend)} ${f(y - hh)} `; } a.raw(`<path d="${d}" stroke="${R() < 0.6 ? '#22221a' : '#6a6646'}" stroke-width="${f(Math.max(0.5, s * 0.009))}" fill="none" opacity="0.85"/>`); } }
  }
  // flagstone paths: the walks round the edge and the cross through the middle
  const flags = (x0, x1, z0, z1, sz, ruin = 0.12) => {
    let o = '';
    for (let z = z0; z < z1 - 0.05;) {
      const dz = sz * (0.7 + R() * 0.5) * (z / 8 + 0.6) ** 0.2; let x = x0 - R() * sz * 0.5;
      while (x < x1) {
        const dx = sz * (0.8 + R() * 0.8), X0 = Math.max(x0, x) + 0.03, X1 = Math.min(x1, x + dx) - 0.03, Z1 = Math.min(z1, z + dz) - 0.03;
        if (X1 - X0 > 0.1 && R() > ruin) {
          const j = () => (R() - 0.5) * 0.06, q = [[X0 + j(), 0, z + 0.03 + j()], [X1 + j(), 0, z + 0.03 + j()], [X1 + j(), 0, Z1 + j()], [X0 + j(), 0, Z1 + j()]].map(p => P(...p));
          o += `<path d="${chip(q)}" fill="${mix(FLAG, R() < 0.45 ? '#c8bca0' : '#16120e', R() * 0.38)}" stroke="${INK}" stroke-width="${f(inkAt(z) * 0.6)}"/>`;
          if (R() < 0.3) { const c0 = P(X0 + (X1 - X0) * R(), 0, z + 0.05), c1 = P(X0 + (X1 - X0) * R(), 0, Z1 - 0.05), m = [(c0[0] + c1[0]) / 2 + (R() - 0.5) * 10, (c0[1] + c1[1]) / 2]; o += `<path d="M${f(c0[0])} ${f(c0[1])} L${f(m[0])} ${f(m[1])} L${f(c1[0])} ${f(c1[1])}" stroke="${INK}" stroke-width="${f(inkAt(z) * 0.5)}" fill="none"/>`; }
          if (R() < 0.35) o += `<path d="M${f(q[0][0])} ${f(q[0][1])} L${f(q[1][0])} ${f(q[1][1])}" stroke="#3a4424" stroke-width="${f(K(z) * 0.03 + 0.8)}" opacity="0.7"/>`;
          if (z < 9 && R() < 0.45) o += a.stain((q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, K(z) * 0.3, '#2a2218', 0.6);
        }
        else if (X1 - X0 > 0.1) o += `<path d="${pp([[X0, 0, z + 0.03], [X1, 0, z + 0.03], [X1, 0, Z1], [X0, 0, Z1]])}" fill="#2e271f" opacity="0.7"/>`;
        x += dx;
      }
      z += dz;
    }
    return o;
  };
  a.raw(flags(-9.5, -7.0, 8.4, 30, 0.8, 0.18) + flags(7.0, 9.5, 8.4, 30, 0.8, 0.18) + flags(-9.5, 9.5, 28.5, 30, 0.8, 0.1));
  a.raw(flags(-1.4, 1.4, 3.0, 28.5, 0.75, 0.16) + flags(-5.8, -1.4, 5.9, 7.4, 0.7, 0.2) + flags(1.4, 5.8, 5.9, 7.4, 0.7, 0.2) + flags(-7.0, 0.1, 14.8, 16.4, 0.75, 0.2) + flags(3.0, 7.0, 14.8, 16.4, 0.75, 0.2));
  for (let Z = 3.1; Z < 30; Z *= 1.045) { const y = P(0, 0, Z)[1]; a.raw(`<path d="M0 ${f(y)} C400 ${f(y + (R() - 0.5) * 3)} 1200 ${f(y + (R() - 0.5) * 3)} 1600 ${f(y)}" stroke="${INK}" stroke-width="${f(Math.max(0.5, K(Z) * 0.006))}" opacity="0.18" stroke-dasharray="${f(K(Z) * 0.4)} ${f(K(Z) * 0.25)}"/>`); }
  // near ground: engraved cross-hatch darkening toward the bottom edge, cart ruts curving in from the gate
  a.raw(`<linearGradient id="nearDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0b08" stop-opacity="0"/><stop offset="1" stop-color="#0e0b08" stop-opacity="0.5"/></linearGradient><rect x="0" y="640" width="${W}" height="${H - 640}" fill="url(#nearDark)"/>`);
  a.raw(`<rect x="0" y="660" width="${W}" height="${H - 660}" fill="${a.hatchPat(165, 4.2, 0.6)}" opacity="0.3"/><rect x="0" y="760" width="${W}" height="${H - 760}" fill="${a.hatchPat(20, 5, 0.55)}" opacity="0.22"/>`);
  for (const off of [-0.7, 0.7]) { const pts = [[-4.6 + off * 0.6, 3.0], [-4.4 + off * 0.6, 4.4], [-4.9 + off, 6.0], [-5.4 + off, 7.4]].map(([X, Z]) => P(X, 0, Z)); a.raw(`<path d="${smooth(pts, false, 0.7)}" stroke="#1a140e" stroke-width="14" fill="none" opacity="0.4"/><path d="${smooth(pts, false, 0.7)}" stroke="#6a5e4a" stroke-width="2" fill="none" opacity="0.5" transform="translate(0 -6)"/>`); }
  for (let i = 0; i < 160; i++) { const X = -7 + R() * 14, Z = 3.1 + R() * 9, [x, y] = P(X, 0, Z), sc = K(Z); a.raw(`<path d="M${f(x)} ${f(y)} l${f(sc * (0.05 + R() * 0.1))} ${f((R() - 0.5) * sc * 0.02)}" stroke="${R() < 0.5 ? '#16110c' : '#7a6c54'}" stroke-width="${f(Math.max(0.6, sc * 0.012))}" opacity="0.6"/>`); }
  // footprints in the mud between the gate and the fire
  for (let i = 0; i < 24; i++) { const X = -1.5 + R() * 3.4, Z = 3.2 + R() * 3, [x, y] = P(X, 0, Z), sc = K(Z); a.raw(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sc * 0.05)}" ry="${f(sc * 0.018)}" fill="#1a140e" opacity="0.5"/>`); }
  // ruts and boot-churned mud along the paths, puddles holding the grey sky
  for (let i = 0; i < 40; i++) { const X = -6 + R() * 12, Z = 3.2 + R() * 22, [x, y] = P(X, 0, Z), s = K(Z); a.raw(`<path d="M${f(x - s * 0.6)} ${f(y + s * 0.02)} q${f(s * 0.6)} ${f(-s * 0.06)} ${f(s * 1.2)} ${f(s * 0.01)}" stroke="#1a150f" stroke-width="${f(s * 0.08 + 1)}" fill="none" opacity="0.28" stroke-linecap="round"/>`); }
  for (const [X, Z, r] of [[-1.2, 12.5, 0.7], [2.4, 19.5, 0.5], [-3.6, 15.6, 0.55], [6.0, 26, 0.6], [-8.2, 19.5, 0.5]]) {
    const [x, y] = P(X, 0, Z), rx = K(Z) * r, ry = K(Z) * r * E / Z;
    a.raw(`<path d="${blob(x, y, 1, R, 9, 0.25)}" transform="translate(${f(x)} ${f(y)}) scale(${f(rx)} ${f(ry)}) translate(${f(-x)} ${f(-y)})" fill="#4e4c48" stroke="${INK}" stroke-width="${f(1.6 / Math.max(1, ry))}"/>` +
      `<path d="M${f(x - rx * 0.6)} ${f(y - ry * 0.2)} L${f(x + rx * 0.3)} ${f(y - ry * 0.3)}" stroke="#d8d6d0" stroke-width="${f(Math.max(0.8, ry * 0.12))}" opacity="0.45"/><path d="M${f(x - rx * 0.4)} ${f(y + ry * 0.3)} L${f(x + rx * 0.5)} ${f(y + ry * 0.25)}" stroke="#6a665e" stroke-width="${f(Math.max(0.8, ry * 0.1))}" opacity="0.6"/>`);
  }
  a.raw('</g>');
}

// ------------------------------------------------------------------ the church: aisle wall, clerestory, roof, the fallen tower
{
  const ZA = 30, ZC = 32;
  // main roof and clerestory (west of the tower)
  a.raw(roof([-16, 10, ZC], [3.6, 10, ZC], [3.6, 14, 35.5], [-16, 14, 35.5], SLATE, { courses: 9, holes: 0.06, moss: 10, patches: [[0.55, 0.3, 0.12, 0.25]] }));
  const atC = (s, t) => [-16 + s, 7.2 + t, ZC];
  a.raw(stones(atC, 19.6, 2.8, STONE, { course: 0.5, block: 1.0, streaks: 8 }));
  shade([atC(0, 0), atC(19.6, 0), atC(19.6, 2.8), atC(0, 2.8)], { depth: 6, hatch: 75 });
  for (const X of [-9, -6.4, -3.8, -1.2, 1.4]) windowOn((s, t) => [X + s, 7.2 + t, ZC], 0, 1.0, 0.4, 2.5, X === -6.4 ? 'boarded' : (X === -3.8 || X === 1.4) ? 'dark' : 'lit');
  // the crossing tower: fell in the first winter of the Grey; the stump is roofed with a timber bell-frame
  const atT = (s, t) => [3.6 + s, t, 31.4];
  a.raw(stones(atT, 5.2, 11.6, STONE2, { course: 0.55, block: 1.1, streaks: 10, holes: 0.02 }));
  // broken crown: ragged top edge cut by a dark notch
  a.raw(`<path d="${pp([atT(0, 11.6), atT(0.6, 12.1), atT(1.3, 11.2), atT(2.1, 11.9), atT(2.7, 10.6), atT(3.6, 11.3), atT(4.4, 11.0), atT(5.2, 11.7), atT(5.2, 11.6)])}" fill="${STONE2}" stroke="${INK}" stroke-width="1.6"/>`);
  shade([atT(0, 0), atT(5.2, 0), atT(5.2, 11.6), atT(0, 11.6)], { depth: 12, hatch: 80, mottle: 0.4, grime: 0.45,
    decals: a.stain(...P(5, 10, 31.4), 40, '#140e0a', 0.4) });
  windowOn((s, t) => [5.6 + s, t, 31.4], 0, 1.2, 8.6, 11.2, 'dark');
  // timber bell-frame on the stump, a bell, a plank roof
  {
    const z = 31.4, posts = [3.9, 5.9, 8.5];
    for (const X of posts) a.raw(seg([X, 11.0, z], [X + 0.1, 14.6, z], INK, K(z) * 0.24 + 2) + seg([X, 11.0, z], [X + 0.1, 14.6, z], TIMBER, K(z) * 0.2));
    a.raw(seg([3.7, 14.0, z], [8.8, 14.1, z], INK, K(z) * 0.22 + 2) + seg([3.7, 14.0, z], [8.8, 14.1, z], TIMBER, K(z) * 0.18) + seg([3.9, 11.6, z], [5.9, 14.0, z], INK, 3) + seg([5.9, 11.6, z], [8.5, 14.0, z], INK, 3));
    const [bx, by] = P(7.2, 13.9, z), bs = K(z);
    a.shape({ d: `M${f(bx - bs * 0.15)} ${f(by)} C${f(bx - bs * 0.2)} ${f(by + bs * 0.4)} ${f(bx - bs * 0.45)} ${f(by + bs * 0.75)} ${f(bx - bs * 0.55)} ${f(by + bs * 0.9)} L${f(bx + bs * 0.55)} ${f(by + bs * 0.9)} C${f(bx + bs * 0.45)} ${f(by + bs * 0.75)} ${f(bx + bs * 0.2)} ${f(by + bs * 0.4)} ${f(bx + bs * 0.15)} ${f(by)} Z`, fill: '#5a5a44', depth: 6, ink: 1.2, mottle: 0.6, decals: a.stain(bx, by + bs * 0.6, bs * 0.3, '#3a6a5a', 0.5) });
    a.raw(`<path d="${pp([[3.2, 14.3, z - 0.4], [9.2, 14.5, z - 0.4], [8.4, 15.6, z + 0.6], [4.0, 15.4, z + 0.6]])}" fill="#4a3a2a" stroke="${INK}" stroke-width="1.4"/>`);
    a.raw(crow(...P(4.4, 15.5, z), 6, 1) + crow(...P(8.0, 15.6, z), 5, -1));
  }
  // aisle roof (lean-to) and the aisle wall
  a.raw(roof([-16, 5, ZA], [14, 5, ZA], [14, 7.2, ZC], [-16, 7.2, ZC], '#4a4743', { courses: 5, holes: 0.05, moss: 12, patches: [[0.3, 0.1, 0.05, 0.6]] }));
  const atA = (s, t) => [-16 + s, t, ZA];
  a.raw(stones(atA, 30, 5, STONE, { course: 0.46, block: 0.95, streaks: 14, holes: 0.01, rubble: 4 }) + render(atA, 30, 5, 9));
  for (const X of [-6.9, -3.0, 2.0]) { const [x, y] = P(X, 0, ZA); a.raw(bloom(x, y - 6, 26, '#1e2414', 0.35)); }
  shade([atA(0, 0), atA(30, 0), atA(30, 5), atA(0, 5)], { depth: 8, hatch: 70, mottle: 0.45, grime: 0.45 });
  // green damp creeping up from the ground
  a.raw(`<path d="${pp([atA(0, 0), atA(30, 0), atA(30, 0.8), atA(20, 1.3), atA(12, 0.7), atA(6, 1.5), atA(0, 0.9)])}" fill="#3a4a2e" opacity="0.35"/>`);
  for (const X of [-6.4, -3.8, -1.2]) windowOn((s, t) => [X + s, t, ZA], 0, 0.9, 1.4, 3.6, X === -1.2 ? 'lit' : 'dark');
  a.raw(torch(-2.2, 2.9, 29.9, [0, 0, -1]) + torch(2.2, 2.9, 29.9, [0, 0, -1]));
  for (const X of [-8, -5.1, -2.5, 4.4]) {    // buttresses
    const z0 = ZA - 0.9, atB = (s, t) => [X + s, t, z0];
    a.raw(`<path d="${pp([[X, 0, z0], [X, 4.2, z0], [X, 5.0, ZA], [X, 0, ZA]])}" fill="${dark(STONE, 0.55)}" stroke="${INK}" stroke-width="1"/>`);
    a.raw(stones(atB, 0.8, 4.2, STONE2, { course: 0.5, block: 0.8 }));
    a.raw(`<path d="${pp([[X, 4.2, z0], [X + 0.8, 4.2, z0], [X + 0.8, 5.0, ZA], [X, 5.0, ZA]])}" fill="${light(STONE2, 0.15)}" stroke="${INK}" stroke-width="1.1"/>`);
    shade([atB(0, 0), atB(0.8, 0), atB(0.8, 4.2), atB(0, 4.2)], { depth: 4, hatch: 70 });
  }
  // a niche shrine on the westmost buttress: a worn saint, candles, wax running down
  { const [x, y] = P(-7.6, 1.2, 29.05), s = K(29.05); a.raw(`<path d="M${f(x - s * 0.22)} ${f(y)} L${f(x - s * 0.22)} ${f(y - s * 1.1)} Q${f(x)} ${f(y - s * 1.45)} ${f(x + s * 0.22)} ${f(y - s * 1.1)} L${f(x + s * 0.22)} ${f(y)} Z" fill="#14100c" stroke="${INK}" stroke-width="1.2"/>`);
    a.raw(`<path d="M${f(x - s * 0.12)} ${f(y)} L${f(x - s * 0.14)} ${f(y - s * 0.8)} Q${f(x)} ${f(y - s * 1.2)} ${f(x + s * 0.14)} ${f(y - s * 0.8)} L${f(x + s * 0.12)} ${f(y)} Z" fill="#7a7466" stroke="${INK}" stroke-width="1"/>` + candles(-7.6, 29.0, 5, 1.2, 0.6) + a.drip(x - 4, y + 1, 10, 1.6, '#d8ccb0') + a.drip(x + 5, y + 1, 7, 1.4, '#d8ccb0')); }
  // ------------------------------------------------------------ the porch and the church door (clickable)
  {
    const z0 = 28.2, x0 = -1.5, x1 = 1.5, hW = 3.8, hG = 5.4;
    // side wall (east side shows, since it is right of centre)
    a.raw(`<path d="${pp([[x1, 0, z0], [x1, 0, ZA], [x1, hW, ZA], [x1, hW, z0]])}" fill="${dark(STONE2, 0.25)}" stroke="${INK}" stroke-width="1.2"/>`);
    a.raw(`<path d="${pp([[x1, hW, z0], [x1, hW, ZA], [(x0 + x1) / 2, hG, ZA], [(x0 + x1) / 2, hG, z0]])}" fill="#3e3a36" stroke="${INK}" stroke-width="1.2"/>`);
    const atP = (s, t) => [x0 + s, t, z0];
    a.raw(stones(atP, x1 - x0, hW, STONE2, { course: 0.42, block: 0.8, streaks: 4 }));
    a.raw(`<path d="${pp([atP(-0.2, hW), atP(1.5, hG + 0.1), atP(3.2, hW), atP(2.9, hW), atP(1.5, hG - 0.25), atP(0.1, hW)])}" fill="${STONE2}" stroke="${INK}" stroke-width="1.3"/>`);
    a.raw(`<path d="${pp([atP(0.1, hW), atP(1.5, hG - 0.25), atP(2.9, hW)])}" fill="${dark(STONE2, 0.2)}" stroke="${INK}" stroke-width="1"/>`);
    shade([atP(0, 0), atP(3, 0), atP(3, hW), atP(1.5, hG), atP(0, hW)], { depth: 7, hatch: 70, mottle: 0.4 });
    const door = archPts(atP, 0.6, 2.4, 0, 2.2, 0.9, 10);
    const [dcx] = litHole(door, z0, { r: 2.6, op: 0.5, top: '#7a3a14', bot: '#ffd07a' });
    a.raw(archRing(atP, 0.6, 2.4, 2.2, 0.9, 0.28, STONE2, 9));
    // inside: the nave's candles glimpsed, a column
    through(door, () => a.raw(candles(-0.3, z0 + 0.6, 4, 0.9, 0.5) + candles(0.5, z0 + 0.6, 3, 1.1, 0.4) + seg([0.4, 0, z0 + 1.5], [0.4, 2.6, z0 + 1.5], '#3a2010', K(z0) * 0.28)));
    // door leaves swung in, iron straps
    through(door, () => { a.raw(planks((s, t) => [-0.9 + s * 0.4, t, z0 + s * 0.9], 0.85, 2.4, '#3a2c20', { board: 0.2, nails: 5 }));
      a.raw(seg([-0.88, 0.7, z0 + 0.1], [-0.58, 0.7, z0 + 0.75], '#1e1c1a', 3) + seg([-0.88, 1.8, z0 + 0.1], [-0.58, 1.8, z0 + 0.75], '#1e1c1a', 3)); });
    // a gilt cross on the gable (the holy: gold), lanterns, a rubric banner, threshold candles, offerings
    { const [x, y] = P(0, hG + 0.15, z0), s = K(z0); a.raw(`<path d="M${f(x)} ${f(y)} L${f(x)} ${f(y - s * 0.7)} M${f(x - s * 0.22)} ${f(y - s * 0.48)} L${f(x + s * 0.22)} ${f(y - s * 0.48)}" stroke="${INK}" stroke-width="${f(s * 0.12 + 2)}"/><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y - s * 0.7)} M${f(x - s * 0.22)} ${f(y - s * 0.48)} L${f(x + s * 0.22)} ${f(y - s * 0.48)}" stroke="${G.gold}" stroke-width="${f(s * 0.08)}"/>`); }
    a.raw(lantern(...P(-1.25, 3.1, z0 - 0.1), K(z0) * 0.2, [-1.25, 3.1, z0 - 0.1]) + lantern(...P(1.25, 3.1, z0 - 0.1), K(z0) * 0.2, [1.25, 3.1, z0 - 0.1]));
    { const [x0b, y0b] = P(-2.2, 4.6, ZA - 0.05), [x1b, y1b] = P(-1.8, 1.2, ZA - 0.05); a.raw(`<path d="M${f(x0b)} ${f(y0b)} L${f(x1b)} ${f(y0b)} L${f(x1b)} ${f(y1b)} L${f((x0b + x1b) / 2)} ${f(y1b - 6)} L${f(x0b)} ${f(y1b)} Z" fill="${G.redD}" stroke="${INK}" stroke-width="1.2"/><path d="M${f(x0b + 2)} ${f(y0b + 10)} L${f(x1b - 2)} ${f(y0b + 10)}" stroke="${G.gold}" stroke-width="1.4" opacity="0.8"/>` + a.stain(x0b + 4, (y0b + y1b) / 2, 6, '#140a08', 0.5)); }
    a.raw(candles(-1.1, z0 - 0.4, 6, 0, 0.7) + candles(1.1, z0 - 0.4, 5, 0, 0.6));
    const ps = [P(-2.1, 0, z0 - 1.6), P(2.1, 0, z0 - 1.6), P(1.9, hG + 0.9, z0), P(-1.9, hG + 0.9, z0)];
    hot('church', 'The abbey church', ps);
    outline('church', [[door, 1], ...stoneTrace(atP, 0.6, 2.4, 2.2, 0.9, 0.28, [0, 0, -1]), [[[x0 - 0.2, hW, z0], [0, hG + 0.1, z0], [x1 + 0.2, hW, z0]]]]);
  }
}
// ------------------------------------------------------------------ the sacristy: a low stone lean-to against the church, north-east (clickable)
{
  const z0 = 27.0, x0 = 5.6, x1 = 9.6, h = 3.4;
  a.raw(roof([x0 - 0.2, h, z0 - 0.3], [x1, h, z0 - 0.3], [x1, 5.0, 30], [x0 - 0.2, 5.0, 30], '#4a4642', { courses: 4, holes: 0.03, moss: 3 }));
  a.raw(`<path d="${pp([[x0, 0, z0], [x0, 0, 30], [x0, 5.0, 30], [x0, h, z0]])}" fill="${dark(STONE, 0.15)}" stroke="${INK}" stroke-width="1.2"/>`);
  a.raw(stones((s, t) => [x0, t, z0 + s], 3, h, STONE, { course: 0.45, block: 0.8 }));
  shade([[x0, 0, z0], [x0, 0, 30], [x0, h, 30], [x0, h, z0]], { depth: 6, hatch: 60, wash: 0.2 });
  const atS = (s, t) => [x0 + s, t, z0];
  a.raw(stones(atS, x1 - x0, h, STONE2, { course: 0.42, block: 0.8, streaks: 5 }));
  shade([atS(0, 0), atS(4, 0), atS(4, h), atS(0, h)], { depth: 7, hatch: 70 });
  const door = archPts(atS, 0.9, 2.0, 0, 1.9, 0.55, 8);
  litHole(door, z0, { r: 1.8, op: 0.5, top: '#6a3010', bot: '#f8c070' });
  through(door, () => a.raw(candles(x0 + 1.6, z0 + 0.8, 3, 0.9, 0.3) + `<path d="${pp([atS(1.5, 1.0), atS(1.7, 1.0), atS(1.7, 1.9), atS(1.5, 1.9)])}" fill="#2a160a"/>`));
  // the door swung half open: iron-bound leaf, a heavy lock, light down its edge
  a.raw(planks((s, t) => [x0 + 0.9 + s * 0.55, t, z0 - s * 0.5], 0.95, 2.3, '#3a2a1e', { board: 0.2, nails: 8 }));
  for (const t of [0.5, 1.6]) a.raw(seg([x0 + 0.9, t, z0], [x0 + 1.42, t, z0 - 0.47], '#1a1816', 3.2));
  a.raw(archRing(atS, 0.9, 2.0, 1.9, 0.55, 0.24, STONE2, 7));
  windowOn((s, t) => [x0 + 2.6 + s, t, z0], 0, 0.6, 1.4, 2.6, 'lit');
  a.raw(seg([x0 + 2.65, 1.6, z0], [x0 + 3.15, 1.6, z0], INK, 2) + seg([x0 + 2.75, 1.4, z0], [x0 + 2.75, 2.5, z0], INK, 1.6) + seg([x0 + 3.05, 1.4, z0], [x0 + 3.05, 2.5, z0], INK, 1.6));
  hot('sacristy', 'Sacristy', [P(4.9, 0, z0 - 0.6), P(7.25, 0, z0 - 0.6), P(7.25, h + 0.5, z0), P(4.9, h + 0.5, z0)]);
  outline('sacristy', [[door, 1], ...stoneTrace(atS, 0.9, 2.0, 1.9, 0.55, 0.24, [0, 0, -1])]);
}
// ------------------------------------------------------------------ the ranges: two storeys, slate roofs, walls patched and propped
function range(side) {
  const X = 9.5 * side, z0 = 8.0, z1 = 30, h = 7.0, ridgeX = 13.5 * side;
  // roof first (it is behind the wall's top edge from here)
  a.raw(roof([X, h, z0], [X, h, z1], [ridgeX, 10.5, z1], [ridgeX, 10.5, z0], side > 0 ? '#4c4844' : '#3e3b38', { courses: 8, holes: 0.05, moss: 14, patches: [[0.55, 0.15, 0.12, 0.35], [0.2, 0.4, 0.06, 0.3]] }));
  const at = (s, t) => [X, t, z0 + s];
  a.raw(stones(at, z1 - z0, h, side > 0 ? STONE2 : STONE, { course: side > 0 ? 0.48 : 0.4, block: side > 0 ? 1.0 : 0.8, streaks: 26, holes: 0.012, rubble: 5 }) + render(at, z1 - z0, h, 7));
  for (const z of [10.5, 13.2, 19.6, 27.4]) { const [x, y] = P(X, 0, z); a.raw(bloom(x, y - 4, K(z) * 0.7, '#1e2414', 0.32)); }
  for (const z of [11.8, 18.6, 28.8]) { const [x, y] = P(X, 0, z); a.raw(creeper(x, y, K(z) * (3 + R() * 3), K(z) * 0.6)); }
  // a gutter spout broken off, a black run of water staining down the wall below it
  for (const z of [12.5, 21.0, 26.6]) { const [x, y] = P(X, h, z), [, yb] = P(X, 0.4, z); a.raw(`<path d="M${f(x - 3)} ${f(y)} C${f(x + 4)} ${f((y + yb) / 2)} ${f(x - 4)} ${f((y * 0.3 + yb * 0.7))} ${f(x + 1)} ${f(yb)}" stroke="#0e0b08" stroke-width="${f(K(z) * 0.3)}" opacity="0.22" fill="none" stroke-linecap="round"/>`); }
  // a string course between the floors and the eaves cornice
  for (const [t, d] of [[3.6, 0.22], [h - 0.25, 0.3]]) a.raw(`<path d="${pp([at(0, t), at(z1 - z0, t), at(z1 - z0, t + d), at(0, t + d)])}" fill="${light(STONE2, 0.08)}" stroke="${INK}" stroke-width="1.2"/>`);
  a.raw(`<path d="${pp([at(0, 0), at(z1 - z0, 0), at(z1 - z0, 0.9), at(16, 1.4), at(9, 0.8), at(4, 1.6), at(0, 1.0)])}" fill="#34402a" opacity="0.32"/>`);
  return at;
}
// east range (lit side: faces west, toward the light)
{
  const at = range(1), s0 = 8.0;
  const Zs = z => z - s0;
  // upper floor: the scriptorium's windows, warm; one shuttered, one boarded where the wall cracked
  for (const z of [14.6, 16.4, 18.2, 20.0, 22.6, 28.4]) windowOn(at, Zs(z), Zs(z) + 0.8, 4.3, 6.3, { 28.4: 'boarded', 16.4: 'shutter', 18.2: 'dark', 22.6: 'dark' }[z] || 'lit');
  // the long crack and the scaffold propping it
  { const c = [at(Zs(29.4), 7), at(Zs(29.1), 5.9), at(Zs(29.6), 5.0), at(Zs(29.2), 4.0)]; a.raw(`<path d="M${c.map(p => P(...p).map(f).join(' ')).join(' L')}" stroke="${INK}" stroke-width="2.4" fill="none"/>`); }
  for (const z of [27.6, 29.8]) a.raw(seg([9.2, 0, z], [9.3, 7.6, z], INK, 5) + seg([9.2, 0, z], [9.3, 7.6, z], '#6a5a44', 3));
  for (const t of [3.9, 6.6]) a.raw(seg([9.25, t, 27.4], [9.25, t, 30], INK, 4.4) + seg([9.25, t, 27.4], [9.25, t, 30], '#6a5a44', 2.6));
  a.raw(seg([9.25, 0.2, 27.6], [9.25, 3.9, 29.8], INK, 3) + seg([9.25, 4.0, 27.6], [9.25, 6.6, 29.8], INK, 3));
  // ------------------------------------------------------------ Infirmarium door (nearest), with the sick laid out under a sailcloth awning
  {
    const d = archPts(at, Zs(15.0), Zs(16.4), 0, 2.2, 0.7, 8);
    litHole(d, 15.7, { r: 2.4, op: 0.55, top: '#5a2a0e', bot: '#f6b060' });
    through(d, () => a.raw(seg([9.7, 0.7, 15.2], [9.7, 0.7, 16.2], '#2a160a', 4) + candles(9.7, 15.9, 2, 1.0, 0.3)));
    a.raw(archRing(at, Zs(15.0), Zs(16.4), 2.2, 0.7, 0.25, STONE2, 7));
    // a bundle of drying herbs and a bowl sign over the door; bandages on a line
    { const [x, y] = P(9.4, 3.3, 15.7), s = K(15.7); a.raw(seg([9.45, 3.4, 15.7], [9.0, 3.4, 15.7], INK, 3) + `<path d="M${f(x - s * 0.28)} ${f(y)} l${f(-s * 0.05)} ${f(s * 0.35)} M${f(x - s * 0.22)} ${f(y)} l${f(s * 0.02)} ${f(s * 0.4)} M${f(x - s * 0.33)} ${f(y)} l${f(-s * 0.1)} ${f(s * 0.3)}" stroke="#4a5a32" stroke-width="${f(s * 0.05)}"/>`); }
    // awning on two poles
    a.raw(`<path d="${pp([[9.5, 2.9, 13.4], [9.5, 2.9, 16.7], [7.6, 2.3, 16.6], [7.4, 2.2, 13.6]])}" fill="#6e685a" stroke="${INK}" stroke-width="1.4"/>`);
    a.shape({ d: pp([[9.5, 2.9, 13.4], [9.5, 2.9, 17.6], [7.6, 2.3, 17.4], [7.4, 2.2, 13.6]]), fill: 'rgba(0,0,0,0)', depth: 10, hatch: 20, mottle: 0.5, grime: 0.7, ink: 1.2, decals: a.stain(...P(8.4, 2.6, 15.2), 18, '#3a3022', 0.5) + a.stain(...P(8.8, 2.7, 16.6), 10, G.blood, 0.35) });
    for (const z of [13.6, 16.6]) a.raw(seg([7.5, 0, z], [7.5, 2.3, z], INK, 4) + seg([7.5, 0, z], [7.5, 2.3, z], TIMBER, 2.4));
    hot('infirmarium', 'Infirmarium', [P(9.5, 0, 14.9), P(9.5, 0, 16.9), P(9.5, 3.6, 16.9), P(9.5, 3.6, 14.9)].map((p, i) => i < 2 ? [p[0] - 18, p[1] + 14] : p));
    outline('infirmarium', [[d, 1], ...stoneTrace(at, Zs(15.0), Zs(16.4), 2.2, 0.7, 0.25, [-1, 0, 0])]);
  }
  // ------------------------------------------------------------ external stair up to the Scriptorium (clickable)
  {
    const zb = 21.8, zt = 25.2, ZE = 26.7, xi = 7.7, hT = 3.8, n = 11;
    const prof = [[xi, 0, zb]]; for (let i = 0; i < n; i++) { const z = zb + (zt - zb) * i / n, t = hT * (i + 1) / n; prof.push([xi, t - hT / n, z], [xi, t, z]); }
    prof.push([xi, hT, zt], [xi, hT, ZE], [xi, 0, ZE]);
    a.raw(`<path d="${pp([...prof.slice(0, 1), ...prof.slice(1).filter((_, i) => i % 2 === 1), [xi, hT, ZE], [xi, 0, ZE]])}" fill="none"/>`);
    // stair mass: side face, then treads
    const side = [[xi, 0, zb]]; for (let i = 0; i < n; i++) { const z0 = zb + (zt - zb) * i / n, z1 = zb + (zt - zb) * (i + 1) / n, t = hT * (i + 1) / n; side.push([xi, t, z0], [xi, t, z1]); }
    side.push([xi, hT, ZE], [xi, 0, ZE]);
    a.raw(`<path d="${pp(side)}" fill="${dark(STONE2, 0.1)}"/>`);
    a.raw(stones((s, t) => [xi, t, zb + s], ZE - zb, hT, STONE2, { course: 0.42, block: 0.7, skip: (s0b, s1b, t0b) => t0b > (s0b) * hT / (zt - zb) + 0.1 && s1b < zt - zb }));
    a.raw(`<path d="${pp(side)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`);
    for (let i = 0; i < n; i++) { const z0 = zb + (zt - zb) * i / n, z1 = zb + (zt - zb) * (i + 1) / n, t = hT * (i + 1) / n; a.raw(`<path d="${pp([[xi, t, z0], [9.5, t, z0], [9.5, t, z1], [xi, t, z1]])}" fill="${light(STONE2, 0.12)}" stroke="${INK}" stroke-width="1"/>`); }
    for (let i = 0; i < n; i++) { const z0 = zb + (zt - zb) * i / n, t = hT * (i + 1) / n; a.raw(`<path d="${pp([[xi, t - hT / n, z0], [9.5, t - hT / n, z0], [9.5, t, z0], [xi, t, z0]])}" fill="${mix(STONE2, '#120e0a', 0.25 + R() * 0.15)}" stroke="${INK}" stroke-width="1.6"/>`); }
    a.raw(`<path d="${pp([[xi, hT, zt], [9.5, hT, zt], [9.5, hT, ZE], [xi, hT, ZE]])}" fill="${light(STONE2, 0.1)}" stroke="${INK}" stroke-width="1.6"/>`);
    shade(side, { depth: 8, hatch: 60, wash: 0.25, dark: 120, darkOp: 0.4 });
    // landing door, rope rail on iron stanchions
    const d = archPts(at, Zs(25.6), Zs(26.5), 3.8, 5.6, 0.45, 8);
    litHole(d, 26, { r: 1.4, op: 0.45 });
    a.raw(archRing(at, Zs(25.6), Zs(26.5), 5.6, 0.45, 0.2, STONE2, 7));
    for (let i = 0; i <= 3; i++) { const z = zb + 0.4 + (zt - zb - 0.4) * i / 3, t = hT * (z - zb) / (zt - zb); a.raw(seg([xi + 0.05, t, z], [xi + 0.05, t + 1.0, z], '#2a2826', 2.2)); }
    { const pts = Array.from({ length: 8 }, (_, i) => { const z = zb + 0.4 + (zt - zb - 0.4 + 1.2) * i / 7, t = Math.min(hT, hT * (z - zb) / (zt - zb)) + 1.0 - Math.sin(i * 1.1) * 0.08; return P(xi + 0.05, t, Math.min(ZE - 0.1, z)); }).concat([P(9.45, hT + 1.0, ZE - 0.1)]); a.raw(`<path d="${smooth(pts, false, 0.7)}" stroke="${INK}" stroke-width="3.6" fill="none"/><path d="${smooth(pts, false, 0.7)}" stroke="#8a7a5a" stroke-width="2" fill="none"/>`); }
    a.raw(lantern(...P(9.2, 5.9, 25.3), 7, [9.2, 5.9, 25.3]) + candles(8.4, 25.9, 2, hT, 0.3));
    // a lamp on a post at the foot of the stair, so the flight reads from the garth
    a.raw(seg([7.25, 0, 21.4], [7.25, 1.9, 21.4], INK, 4.4) + seg([7.25, 0, 21.4], [7.25, 1.9, 21.4], TIMBER, 2.6) + seg([7.25, 1.85, 21.4], [7.05, 1.85, 21.4], INK, 5) + seg([7.25, 1.85, 21.4], [7.05, 1.85, 21.4], INK, 2.4) + lantern(...P(7.05, 1.72, 21.4), 8, [7.05, 1.72, 21.4]));
    hot('scriptorium', 'Scriptorium', [P(xi - 0.3, 0, zb - 0.3), P(xi - 0.3, 0, 26.6), P(9.5, 6.6, 26.6), P(9.5, 6.6, 24.6), P(xi - 0.3, 1.6, zb - 0.3)]);
    outline('scriptorium', [[side.slice(1)], [d, 1], ...stoneTrace(at, Zs(25.6), Zs(26.5), 5.6, 0.45, 0.2, [-1, 0, 0], 3.8, false)]);
  }
  // ------------------------------------------------------------ the Chapter House: a broad arch flanked by two openings (clickable)
  {
    const zA = 18.0, zB = 20.0;
    const d = archPts(at, Zs(zA), Zs(zB), 0, 2.4, 1.0, 12);
    litHole(d, 19.0, { r: 2.4, op: 0.4, top: '#5a2c10', bot: '#e89a48' });
    a.raw(archRing(at, Zs(zA), Zs(zB), 2.4, 1.0, 0.3, STONE2, 11) + archRing(at, Zs(zA) - 0.3, Zs(zB) + 0.3, 2.4, 1.3, 0.22, STONE, 13));
    for (const z of [16.9, 20.5]) { const w = archPts(at, Zs(z), Zs(z) + 0.6, 0.8, 2.2, 0.3, 6); litHole(w, z, { r: 0.8, op: 0.3 }); a.raw(seg([9.5, 0.8, z + 0.3], [9.5, 2.5, z + 0.3], INK, 2.4)); }
    // inside: the stone bench round the wall, a lectern in silhouette
    through(d, () => a.raw(seg([9.6, 0.5, zA + 0.2], [9.6, 0.5, zB - 0.2], '#3a2010', 4) + seg([9.7, 0, 19.2], [9.7, 1.3, 19.2], '#2a160a', 4)));
    // two red banners of the house, rubric-stitched, frayed
    for (const z of [zA - 0.35, zB + 0.35]) { const [x0b, y0b] = P(9.45, 3.4, z), [x1b, y1b] = P(9.45, 1.2, z + 0.25); a.raw(`<path d="M${f(x0b - 3)} ${f(y0b)} L${f(x0b + 4)} ${f(y0b)} L${f(x1b + 4)} ${f(y1b)} L${f(x1b)} ${f(y1b - 5)} L${f(x1b - 3)} ${f(y1b)} Z" fill="${G.redD}" stroke="${INK}" stroke-width="1.1"/>`); }
    hot('chapter', 'Chapter House', [P(9.5, 0, 17.3), P(9.5, 0, 20.8), P(9.5, 3.8, 20.8), P(9.5, 3.8, 17.3)].map((p, i) => i < 2 ? [p[0] - 14, p[1] + 10] : p));
    outline('chapter', [[d, 1], ...stoneTrace(at, Zs(zA) - 0.3, Zs(zB) + 0.3, 2.4, 1.3, 0.22, [-1, 0, 0]), ...[16.9, 20.5].map(z => [archPts(at, Zs(z), Zs(z) + 0.6, 0.8, 2.2, 0.3, 6), 1])]);
  }
  a.raw(torch(9.45, 2.6, 12.9, [-1, 0, 0]) + torch(9.45, 2.9, 21.4, [-1, 0, 0]));
  shade([at(0, 0), at(22, 0), at(22, 7), at(0, 7)], { depth: 10, hatch: 80, mottle: 0.35, grime: 0.4, wash: 0.18, hlOp: 0.12 });
}
// west range (shadow side: faces east, away from the light)
{
  const at = range(-1), s0 = 8.0, Zs = z => z - s0;
  for (const z of [14.2, 16.0, 19.6, 23.2, 25.0, 26.8, 28.6]) windowOn(at, Zs(z), Zs(z) + 0.7, 4.3, 6.0, { 14.2: 'boarded', 16.0: 'dark', 19.6: 'shutter', 25.0: 'dark', 28.6: 'shutter' }[z] || 'lit');
  // laundry hung from the dormitory windows on a pole
  { const pts = [[-9.5, 6.0, 26.8], [-8.6, 5.4, 27.6], [-9.5, 6.0, 28.6]]; a.raw(seg(pts[0], [-8.4, 5.9, 27.7], INK, 2.4) + seg([-8.4, 5.9, 27.7], pts[2], INK, 2.4)); for (const [dz, c] of [[0.2, CLOTH], [0.6, '#6a7074'], [1.1, SAIL]]) { const [x, y] = P(-8.9, 5.85, 26.9 + dz), s = K(27.5); a.raw(`<path d="M${f(x - s * 0.15)} ${f(y)} L${f(x + s * 0.12)} ${f(y)} L${f(x + s * 0.14)} ${f(y + s * 0.5)} L${f(x)} ${f(y + s * 0.42)} L${f(x - s * 0.16)} ${f(y + s * 0.55)} Z" fill="${c}" stroke="${INK}" stroke-width="1"/>`); } }
  // ------------------------------------------------------------ Cellarium: wide cart doors, a hoist beam and pulley above (clickable)
  {
    const zA = 20.2, zB = 23.4;
    const d = archPts(at, Zs(zA), Zs(zB), 0, 2.4, 0.7, 12);
    litHole(d, 21.8, { r: 2.2, op: 0.45, top: '#4a220c', bot: '#e8a050' });
    // inside: casks on their racks, a lamp
    through(d, () => { for (let i = 0; i < 4; i++) { const [x, y] = P(-9.8, 0.4, 20.6 + i * 0.7), k = K(21.8); a.raw(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(k * 0.12)}" ry="${f(k * 0.3)}" fill="#3a2010" stroke="#1a0c04" stroke-width="1.4"/>`); } });
    a.raw(archRing(at, Zs(zA), Zs(zB), 2.4, 0.7, 0.3, STONE, 11));
    a.raw(planks((s, t) => [-9.5 + s * 0.8, t, zA - s * 0.55], 1.5, 2.4, '#3e3024', { board: 0.22, nails: 6 }) + planks((s, t) => [-9.5 + s * 0.8, t, zB + s * 0.4], 1.5, 2.4, '#463628', { board: 0.22, nails: 6 }));
    // loft door and hoist
    windowOn(at, Zs(21.4), Zs(22.2), 4.0, 6.0, 'dark');
    a.raw(seg([-9.5, 6.6, 21.8], [-7.8, 6.6, 21.8], INK, 11) + seg([-9.5, 6.6, 21.8], [-7.8, 6.6, 21.8], TIMBER, 7) + seg([-9.5, 5.6, 21.8], [-8.6, 6.55, 21.8], INK, 6) + seg([-9.5, 5.6, 21.8], [-8.6, 6.55, 21.8], TIMBER, 3.6));
    { const [px, py] = P(-8.0, 6.35, 21.8); a.raw(`<circle cx="${f(px)}" cy="${f(py)}" r="7" fill="#3a3632" stroke="${INK}" stroke-width="2"/><circle cx="${f(px)}" cy="${f(py)}" r="2" fill="${INK}"/>`); }
    a.raw(seg([-8.0, 6.3, 21.8], [-8.0, 2.6, 21.8], INK, 3.4) + seg([-8.0, 6.3, 21.8], [-8.0, 2.6, 21.8], '#9a8a68', 1.8) + seg([-7.86, 6.3, 21.8], [-8.4, 0.5, 21.0], '#9a8a68', 1.6));
    sackLater.push([-8.0, 21.8, 1.9]);
    hot('cellarium', 'Cellarium', [P(-8.6, 0, 19.9), P(-8.6, 0, 23.6), P(-9.5, 6.8, 23.6), P(-9.5, 6.8, 19.9)]);
    outline('cellarium', [[d, 1], ...stoneTrace(at, Zs(zA), Zs(zB), 2.4, 0.7, 0.3, [1, 0, 0])]);
  }
  // ------------------------------------------------------------ Undercroft smithy: steps down through the walk, forge-light rising (clickable)
  {
    const za = 14.6, zb = 18.2, xi = -8.0;
    // the stairwell opening in the walk floor: dark, lit from below
    const hole = [[-9.5, 0, za], [xi, 0, za], [xi, 0, zb], [-9.5, 0, zb]];
    const [hx, hy] = P(-8.75, 0, 16.4);
    a.raw(`<path d="${pp(hole)}" fill="#1a0e08" stroke="${INK}" stroke-width="1.6"/>`);
    // the forge door in the facade, its sill a storey down: the arch head shows above the walk, roaring orange
    { const dp = archPts((u, t) => [-9.5, t, u], 15.4, 17.4, -1.2, 0.6, 1.0, 10), above = [[-9.5, 0, 15.0], [-9.5, 0, 17.8], [-9.5, 3, 17.8], [-9.5, 3, 15.0]];
      addLight(-8.85, 0.15, 16.4, 3.2, 9, [1.0, 0.45, 0.16]);
      through(above, () => { litHole(dp, 16.4, { r: 3, op: 0.7, top: '#ff8a3a', bot: '#ffe09a', soot: false, I: 0.01, range: 1, col: [1.0, 0.45, 0.16] });
        a.raw(archRing((u, t) => [-9.5, t, u], 15.4, 17.4, 0.6, 1.0, 0.32, STONE2, 11)); });
      const [ax, ay] = P(-9.5, 0.3, 16.6), k = K(16.6); through(dp, () => a.raw(`<path d="M${f(ax - k * 0.2)} ${f(ay)} l${f(k * 0.5)} 0 l${f(-k * 0.1)} ${f(k * 0.12)} l${f(-k * 0.1)} 0 l0 ${f(k * 0.14)} l${f(k * 0.14)} ${f(k * 0.06)} l${f(-k * 0.5)} 0 l${f(k * 0.14)} ${f(-k * 0.06)} l0 ${f(-k * 0.14)} l${f(-k * 0.16)} ${f(-k * 0.06)} Z" fill="#0e0a08"/>`)); }
    // the treads going down, lit warmer the deeper they go, seen only through the stairwell
    { const id = a.id('hw'); a.raw(EM(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8501a"/><stop offset="0.5" stop-color="#3a1408"/><stop offset="1" stop-color="#0e0604"/></linearGradient><path d="${pp(hole)}" fill="url(#${id})"/>`)); }
    through(hole, () => { for (let i = 0; i < 6; i++) { const z = za + 0.05 + i * 0.16, t = -0.25 * (i + 1); a.raw(`<path d="${pp([[-9.5, t, z], [xi, t, z], [xi, t + 0.25, z], [-9.5, t + 0.25, z]])}" fill="${mix('#3a1e10', '#e07a30', i / 6)}" stroke="${INK}" stroke-width="1.6"/>`); } });
    a.raw(`<g class="glow">${bloom(...P(-9.5, 2.2, 16.4), K(16.4) * 0.9, '#ff8a3a', 0.35, 1)}</g>`);
    a.raw(a.glow(hx, hy - 10, 150, GLOW, 0.75) + a.glow(hx, hy, 60, '#ffd27a', 0.6) + smoke([[hx, hy - 10], [hx + 6, hy - 70], [hx + 30, hy - 130], [hx + 80, hy - 190]], 34, 0.2));
    // low parapet round the stairwell
    // a broken kerb round the well of the steps, an iron rail bent and rusted
    a.raw(`<path d="${pp([[xi, 0, za], [xi, 0, zb], [xi, 0.25, zb], [xi, 0.3, 16.2], [xi, 0.22, za]])}" fill="${STONE2}" stroke="${INK}" stroke-width="1.6"/>`);
    for (const z of [za + 0.2, 15.8, 17.0, zb - 0.1]) a.raw(seg([xi + 0.05, 0.2, z], [xi + 0.05, 1.0, z], INK, 3.4) + seg([xi + 0.05, 0.2, z], [xi + 0.05, 1.0, z], '#5a3a2a', 1.8));
    a.raw(seg([xi + 0.05, 1.0, za + 0.2], [xi + 0.05, 0.95, 16.6], INK, 3.4) + seg([xi + 0.05, 0.95, 16.6], [xi + 0.05, 0.7, zb - 0.1], INK, 3.4) + seg([xi + 0.05, 1.0, za + 0.2], [xi + 0.05, 0.95, 16.6], '#6a4a38', 1.8));
    // an anvil sign on a bracket, scrap iron, a quench barrel
    { const [x, y] = P(-8.4, 3.3, 14.8), s = K(14.8); a.raw(seg([-9.5, 3.5, 14.8], [-8.0, 3.5, 14.8], INK, 6) + seg([-9.5, 3.5, 14.8], [-8.0, 3.5, 14.8], '#2a2826', 3) + seg([-9.5, 2.8, 14.8], [-8.6, 3.45, 14.8], INK, 3) + `<path d="M${f(x - s * 0.1)} ${f(y)} l0 ${f(s * 0.1)} M${f(x + s * 0.4)} ${f(y)} l0 ${f(s * 0.1)}" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M${f(x - s * 0.3)} ${f(y + s * 0.1)} l${f(s * 0.9)} 0 l${f(-s * 0.15)} ${f(s * 0.22)} l${f(-s * 0.18)} 0 l0 ${f(s * 0.16)} l${f(s * 0.22)} ${f(s * 0.1)} l${f(-s * 0.7)} 0 l${f(s * 0.22)} ${f(-s * 0.1)} l0 ${f(-s * 0.16)} l${f(-s * 0.2)} ${f(-s * 0.08)} Z" fill="#2e2c2a" stroke="${INK}" stroke-width="2"/><path d="M${f(x - s * 0.2)} ${f(y + s * 0.13)} l${f(s * 0.6)} 0" stroke="#8a8680" stroke-width="1.4" opacity="0.7"/>`); a.raw(lantern(...P(-9.3, 2.4, 14.6), 8, [-9.3, 2.4, 14.6])); }
    a.raw(D.embers(hx, hy - 30, 70, 16));
    hot('undercroft', 'Undercroft smithy', [P(-7.6, 0, 14.0), P(-7.9, 0, 18.0), P(-9.5, 4.0, 18.0), P(-9.5, 4.0, 14.0)]);
    outline('undercroft', [[arcPts((u, t) => [-9.5, t, u], 15.4, 17.4, 0.6, 1.0).filter(p => p[1] >= 0)], [arcPts((u, t) => [-9.5, t, u], 15.08, 17.72, 0.6, 1.32).filter(p => p[1] >= 0)], [hole, 1]]);
  }
  // the smithy chimney: a stack through the roof, black smoke and sparks
  { const z = 16.2, x0 = -11.2, x1 = -10.4; a.raw(`<path d="${pp([[x0, 8.0, z], [x1, 8.0, z], [x1, 12.6, z], [x0, 12.6, z]])}" fill="${STONE}" stroke="${INK}" stroke-width="1.4"/>`); a.raw(stones((s, t) => [x0 + s, 8.0 + t, z], 0.8, 4.6, STONE, { course: 0.4, block: 0.4 })); shade([[x0, 8, z], [x1, 8, z], [x1, 12.6, z], [x0, 12.6, z]], { depth: 6, hatch: 70 });
    const [cx, cy] = P(-10.8, 12.6, z); a.raw(a.glow(cx, cy, 30, GLOW, 0.4) + smoke([[cx, cy], [cx + 20, cy - 60], [cx + 90, cy - 120], [cx + 220, cy - 170], [cx + 420, cy - 200]], 46, 0.3, '#2a2624') + D.embers(cx + 10, cy - 20, 60, 10)); }
  // a plank lean-to along the west walk: refugees' bedding under it
  {
    a.raw(`<path d="${pp([[-9.5, 3.0, 24.0], [-9.5, 3.0, 29.6], [-7.3, 2.2, 29.6], [-7.3, 2.2, 24.0]])}" fill="#4a3a2a"/>`);
    a.raw(planks((s, t) => [-9.5 + t * 2.2 / 1.0, 3.0 - t * 0.8, 24.0 + s], 5.6, 1.0, '#4e3e2e', { board: 0.3, nails: 6 }));
    a.shape({ d: pp([[-9.5, 3.0, 24.0], [-9.5, 3.0, 29.6], [-7.3, 2.2, 29.6], [-7.3, 2.2, 24.0]]), fill: 'rgba(0,0,0,0)', depth: 8, hatch: 30, mottle: 0.4, grime: 0.6, ink: 1.2 });
    for (const z of [24.1, 26.8, 29.5]) a.raw(seg([-7.4, 0, z], [-7.4, 2.25, z], INK, 4) + seg([-7.4, 0, z], [-7.4, 2.25, z], TIMBER, 2.4));
  }
  a.raw(torch(-9.45, 2.8, 18.95, [1, 0, 0]) + torch(-9.45, 2.8, 24.0, [1, 0, 0]));
  shade([at(0, 0), at(22, 0), at(22, 7), at(0, 7)], { depth: 12, hatch: 110, mottle: 0.4, grime: 0.45, wash: 0.45, hl: false, dark: 115, darkOp: 0.5 });
  a.raw(`<path d="${pp([at(0, 0), at(22, 0), at(22, 7), at(0, 7)])}" fill="#1a1612" opacity="0.18"/>`);
}

// ------------------------------------------------------------------ props in the garth, far to near
const props = [];
const add = (Z, fn) => props.push([Z, () => { a.raw(`<g class="z_${Math.round(Z * 100)}">`); fn(); a.raw('</g>'); }]);
// the fallen arcade: column stumps along both walks, rubble, one standing with a fragment of arch
for (const side of [-1, 1]) for (const z of [12.4, 15.0 + (side > 0 ? 2.2 : 0), 19.2, 22.4, 25.6, 28.4]) {
  if (side < 0 && z < 16) continue;
  if (side > 0 && z < 27) continue;
  add(z, () => {
    const X = 7.1 * side, s = K(z), hh = (side < 0 && z === 22.4) || (side > 0 && z === 25.6) ? 3.1 : 0.5 + R() * 1.8;
    const [x, y] = P(X, 0, z), [, yt] = P(X, hh, z), w = s * 0.2;
    a.shape({ d: `M${f(x - w * 1.5)} ${f(y)} L${f(x - w * 1.5)} ${f(y - s * 0.25)} L${f(x - w)} ${f(y - s * 0.3)} L${f(x - w)} ${f(yt + w * 0.3)} L${f(x - w * 0.3)} ${f(yt)} L${f(x + w * 0.4)} ${f(yt + w * 0.5)} L${f(x + w)} ${f(yt + w * 0.1)} L${f(x + w)} ${f(y - s * 0.3)} L${f(x + w * 1.5)} ${f(y - s * 0.25)} L${f(x + w * 1.5)} ${f(y)} Z`, fill: STONE2, depth: w * 0.9, hatch: 80, mottle: 0.5, grime: 0.5, ink: inkAt(z) * 1.3,
      lines: [`M${f(x - w * 0.5)} ${f(yt + 4)} L${f(x - w * 0.4)} ${f(y - s * 0.32)}`, `M${f(x + w * 0.5)} ${f(yt + 4)} L${f(x + w * 0.55)} ${f(y - s * 0.32)}`], decals: a.stain(x, y - s * 0.3, s * 0.25, '#3a4a2e', 0.5) });
    if (hh > 3) { a.raw(`<path d="M${f(x - w)} ${f(yt)} L${f(x + w * 1.2)} ${f(yt - s * 0.12)} Q${f(x + s * 0.9 * -side)} ${f(yt - s * 0.6)} ${f(x + s * 1.3 * -side)} ${f(yt - s * 0.2)} L${f(x + s * 1.2 * -side)} ${f(yt + s * 0.05)} Q${f(x + s * 0.7 * -side)} ${f(yt - s * 0.3)} ${f(x)} ${f(yt + s * 0.1)} Z" fill="${STONE2}" stroke="${INK}" stroke-width="1.4"/>`); a.raw(crow(x - w * 0.2, yt - s * 0.2, s * 0.13, -side)); }
    for (let i = 0; i < 4; i++) { const rx = x + (R() - 0.3) * s * 0.9 * -side, ry = y + R() * s * 0.08; a.raw(`<path d="${blob(rx, ry - s * 0.06, s * (0.06 + R() * 0.08), R, 6, 0.3)}" fill="${mix(STONE2, '#1a1410', R() * 0.3)}" stroke="${INK}" stroke-width="1"/>`); }
  });
}
// graves: mounds, wooden crosses, one fresh grave with a digger and a shrouded body on a bier
for (const [X, Z, fresh] of [[-6.2, 26.8], [-5.0, 26.8], [-3.8, 26.6], [-2.6, 26.9], [-6.0, 24.4], [-4.8, 24.2], [-3.6, 24.5], [-6.1, 21.8], [-4.4, 21.6, 1], [-2.0, 24.3], [-1.6, 21.8]]) {
  add(Z, () => {
    const s = K(Z), [x, y] = P(X, 0, Z);
    if (fresh) {
      a.raw(`<path d="${pp([[X - 0.4, 0, Z - 0.9], [X + 0.4, 0, Z - 0.9], [X + 0.4, 0, Z + 0.9], [X - 0.4, 0, Z + 0.9]])}" fill="#0e0b08" stroke="${INK}" stroke-width="1.2"/>`);
      a.shape({ d: smooth([[x + s * 0.45, y + s * 0.02], [x + s * 0.55, y - s * 0.22], [x + s * 1.0, y - s * 0.28], [x + s * 1.3, y + s * 0.02]], true, 0.6), fill: '#3a3026', depth: 4, hatch: 60, mottle: 0.6, ink: 1 });
      return;
    }
    a.shape({ d: smooth([[x - s * 0.45, y + s * 0.03], [x - s * 0.38, y - s * 0.1], [x, y - s * 0.16], [x + s * 0.38, y - s * 0.1], [x + s * 0.45, y + s * 0.03]], true, 0.6), fill: '#40362a', depth: 3, hatch: 60, mottle: 0.5, ink: 1 });
    const cx = x + (R() - 0.5) * s * 0.1, tilt = (R() - 0.5) * 0.25, ch = s * (0.8 + R() * 0.3);
    a.raw(`<g transform="rotate(${f(tilt * 57)} ${f(cx)} ${f(y - s * 0.1)})"><path d="M${f(cx)} ${f(y - s * 0.05)} L${f(cx)} ${f(y - ch)} M${f(cx - s * 0.22)} ${f(y - ch * 0.72)} L${f(cx + s * 0.22)} ${f(y - ch * 0.72)}" stroke="${INK}" stroke-width="${f(s * 0.08 + 1.8)}" stroke-linecap="round"/><path d="M${f(cx)} ${f(y - s * 0.05)} L${f(cx)} ${f(y - ch)} M${f(cx - s * 0.22)} ${f(y - ch * 0.72)} L${f(cx + s * 0.22)} ${f(y - ch * 0.72)}" stroke="#6a5a44" stroke-width="${f(s * 0.06)}" stroke-linecap="round"/></g>`);
    if (R() < 0.4) a.raw(candles(X + 0.2, Z - 0.3, 1, 0, 0.1));
  });
}
add(21.4, () => { folk(-3.4, 21.4, { pose: 'bend', arm: 'spade', col: '#3a3632', face: -1, bare: true }); });
add(20.6, () => { // the bier with a shrouded body
  const Z = 20.4, X = -2.4, s = K(Z), [x, y] = P(X, 0.55, Z);
  for (const dx of [-0.7, 0.7]) a.raw(seg([X + dx, 0, Z], [X + dx, 0.55, Z], INK, 3));
  a.raw(seg([X - 1.0, 0.55, Z], [X + 1.0, 0.55, Z], INK, s * 0.08 + 2) + seg([X - 1.0, 0.55, Z], [X + 1.0, 0.55, Z], TIMBER, s * 0.06));
  a.shape({ d: smooth([[x - s * 0.85, y], [x - s * 0.8, y - s * 0.2], [x - s * 0.5, y - s * 0.26], [x + s * 0.3, y - s * 0.22], [x + s * 0.75, y - s * 0.16], [x + s * 0.85, y]], true, 0.6), fill: '#b4ab98', tex: 'url(#weave)', texOp: 0.4, depth: s * 0.1, ink: 1.4, mottle: 0.5, grime: 0.6,
    lines: [`M${f(x - s * 0.5)} ${f(y - s * 0.24)} L${f(x - s * 0.5)} ${f(y)}`, `M${f(x + s * 0.2)} ${f(y - s * 0.22)} L${f(x + s * 0.2)} ${f(y)}`], decals: a.stain(x - s * 0.1, y - s * 0.1, s * 0.15, '#4a2a1a', 0.45) });
  a.raw(crow(x + s * 0.3, y - s * 0.3, s * 0.14, -1));
});
// herb beds behind wattle edging, mostly dead; a scarecrow in a monk's old habit
for (const [X, Z] of [[4.2, 26.6], [5.9, 26.6], [4.2, 23.6], [5.9, 23.6], [4.2, 20.4], [5.9, 20.4]]) add(Z, () => {
  const x0 = X - 0.7, x1 = X + 0.7, z0 = Z - 1.0, z1 = Z + 1.0, h = 0.35;
  a.raw(`<path d="${pp([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]])}" fill="#2e261c" stroke="${INK}" stroke-width="1"/>`);
  a.raw(planks((s, t) => [x0 + s, t, z0], x1 - x0, h, '#5a4a32', { across: true, board: 0.12 }));
  for (let i = 0; i < 9; i++) { const [x, y] = P(x0 + 0.15 + R() * 1.1, h, z0 + 0.2 + R() * 1.6), s = K(Z); a.raw(`<path d="M${f(x)} ${f(y)} l${f(-s * 0.08)} ${f(-s * 0.22)} M${f(x)} ${f(y)} l${f(s * 0.02)} ${f(-s * 0.3)} M${f(x)} ${f(y)} l${f(s * 0.1)} ${f(-s * 0.18)}" stroke="${R() < 0.3 ? '#4a5a2e' : '#3a3020'}" stroke-width="${f(Math.max(0.8, s * 0.025))}"/>`); }
});

// pilgrims kneeling at the church porch, an old monk with a staff going in
add(27.4, () => { folk(-1.0, 27.3, { pose: 'kneel', arm: 'pray', col: '#3a3634', face: 1 }); folk(1.2, 27.5, { pose: 'kneel', arm: 'pray', col: '#5a4a38', face: -1, bare: true, hair: '#6a6458' }); });
add(26.0, () => { folk(0.3, 26.0, { arm: 'staff', col: '#1e1a18', face: 1 }); });
add(27.6, () => { folk(-2.4, 27.7, { pose: 'sit', col: '#4a4440', face: 1 }); });
// the refugees' corner: sailcloth tents, a fire pit with a pot, a laundry line, bedding
add(12.8, () => { // tents
  for (const [X, Z, w, hgt, col] of [[3.6, 12.6, 1.4, 1.3, '#8a8470'], [4.8, 12.0, 1.2, 1.2, '#7a7462']]) {
    const s = K(Z), [x, y] = P(X, 0, Z), [, yt] = P(X, hgt, Z);
    a.shape({ d: `M${f(x - s * w * 0.6)} ${f(y)} L${f(x - s * 0.06)} ${f(yt)} L${f(x + s * w * 0.62)} ${f(y)} Z`, fill: col, depth: s * 0.25, hatch: 30, mottle: 0.6, grime: 0.7, ink: inkAt(Z) * 1.3,
      lines: [`M${f(x - s * 0.06)} ${f(yt)} L${f(x - s * w * 0.1)} ${f(y)}`, `M${f(x - s * 0.06)} ${f(yt)} L${f(x + s * w * 0.25)} ${f(y)}`], decals: a.stain(x + s * 0.2, y - s * 0.4, s * 0.3, '#3a3022', 0.5) + a.stain(x - s * 0.3, y - s * 0.2, s * 0.25, '#2a3a24', 0.35) });
    a.raw(`<path d="M${f(x - s * w * 0.1)} ${f(y)} L${f(x - s * 0.05)} ${f(yt + s * 0.3)} L${f(x + s * w * 0.2)} ${f(y)} Z" fill="#100c0a"/>`);
    a.raw(seg([X, hgt, Z], [X + 0.2, hgt + 0.3, Z], INK, 3));
  }
});
// the refugees' cooking fire between their tents (east garth), on bare mud, a pot on stones
add(12.6, () => {
  const X = 6.0, Z = 12.6, k = K(Z), [x, y] = P(X, 0, Z);
  folk(5.3, 12.9, { pose: 'sit', col: '#4a4038', face: 1 }); folk(6.8, 12.4, { pose: 'sit', col: '#3a4048', face: -1, bare: true, hair: '#3a2a1e' });
  addLight(X, 0.7, Z, 1.6, 6, [1.0, 0.5, 0.2]);
  for (let i = 0; i < 7; i++) { const t = i / 7 * Math.PI * 2, [sx, sy] = P(X + Math.cos(t) * 0.35, 0, Z + Math.sin(t) * 0.3); a.raw(`<path d="${blob(sx, sy - 2, k * 0.07, R, 6, 0.3)}" fill="${mix(STONE, '#1a1410', 0.3)}" stroke="${INK}" stroke-width="1"/>`); }
  a.raw(a.glow(x, y - k * 0.3, k * 1.6, GLOW, 0.5) + fireTongues(x, y - 2, k * 0.5, k * 0.45) + D.embers(x, y - k * 0.5, k * 0.6, 8));
  a.raw(`<path d="M${f(x - k * 0.22)} ${f(y - k * 0.42)} C${f(x - k * 0.25)} ${f(y - k * 0.12)} ${f(x + k * 0.25)} ${f(y - k * 0.12)} ${f(x + k * 0.22)} ${f(y - k * 0.42)} Z" fill="#221e1c" stroke="${INK}" stroke-width="1.6"/>`);
  a.raw(smoke([[x, y - k * 0.6], [x + 4, y - k * 1.4], [x + 20, y - k * 2.4], [x + 50, y - k * 3.2]], k * 0.4, 0.18));
});
add(15.6, () => { folk(8.1, 14.4, { pose: 'lie', col: '#8a8270', face: 1 }); folk(8.3, 16.1, { pose: 'lie', col: '#6a6458', face: 1, blood: true }); folk(7.3, 15.4, { pose: 'bend', col: '#6a6052', face: 1, arm: 'bowl' }); });
// barrels, crates and sacks before the cellarium; firewood stacked against the west range
add(22.6, () => { barrel(-8.4, 22.8); barrel(-7.8, 23.4); crate(-8.8, 20.2, 0.7); crate(-8.7, 20.3, 0.55, 0.7); });
// the well: a stone drum, a windlass under a small plank roof, a bucket, votive candles on the rim
const WELL = [-5.0, 17.6];
add(WELL[1], () => {
  const [X, Z] = WELL, r = 1.0, s = K(Z), hR = 0.95;
  const ell = (Y, rr) => { const [x, y] = P(X, Y, Z); return [x, y, rr * s, rr * FL * (E - Y) / (Z * Z)]; };
  const [x0, y0, rx0, ry0] = ell(0, r), [x1, y1, rx1, ry1] = ell(hR, r);
  a.raw(`<ellipse cx="${f(x0)}" cy="${f(y0)}" rx="${f(rx0 * 1.4)}" ry="${f(ry0 * 1.6)}" fill="#0e0b08" opacity="0.45"/>`);
  // drum: courses of curved stones
  let drum = `<path d="M${f(x0 - rx0)} ${f(y0)} A${f(rx0)} ${f(ry0)} 0 0 0 ${f(x0 + rx0)} ${f(y0)} L${f(x1 + rx1)} ${f(y1)} A${f(rx1)} ${f(ry1)} 0 0 1 ${f(x1 - rx1)} ${f(y1)} Z" fill="${STONE2}" stroke="${INK}" stroke-width="1.6"/>`;
  for (let c = 0; c < 3; c++) { const t = (c + 1) / 3, cy = y0 + (y1 - y0) * t, ry = ry0 + (ry1 - ry0) * t, rx = rx0 + (rx1 - rx0) * t; drum += `<path d="M${f(x0 - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 0 ${f(x0 + rx)} ${f(cy)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`;
    for (let i = 0; i < 6; i++) { const u = -0.85 + (i + (c % 2) * 0.5) * 0.3; if (u > 0.95) continue; const xx = x0 + u * rx, yb = cy - (y1 - y0) / 3 + Math.sqrt(1 - u * u) * ry, yy = cy + Math.sqrt(1 - u * u) * ry; drum += `<path d="M${f(xx)} ${f(yb)} L${f(xx)} ${f(yy)}" stroke="${INK}" stroke-width="1"/>`; } }
  a.raw(drum);
  a.shape({ d: `M${f(x0 - rx0)} ${f(y0)} A${f(rx0)} ${f(ry0)} 0 0 0 ${f(x0 + rx0)} ${f(y0)} L${f(x1 + rx1)} ${f(y1)} A${f(rx1)} ${f(ry1)} 0 0 1 ${f(x1 - rx1)} ${f(y1)} Z`, fill: 'rgba(0,0,0,0)', depth: 20, hatch: 80, mottle: 0.5, grime: 0.5, ink: 1.6,
    decals: a.stain(x0 - rx0 * 0.4, y0 - 10, 24, '#3a4a2e', 0.5) + a.stain(x0 + rx0 * 0.5, y0 - 16, 18, '#140e0a', 0.4) });
  a.raw(`<ellipse cx="${f(x1)}" cy="${f(y1)}" rx="${f(rx1)}" ry="${f(ry1)}" fill="${light(STONE2, 0.15)}" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${f(x1)}" cy="${f(y1 + 1)}" rx="${f(rx1 * 0.78)}" ry="${f(ry1 * 0.7)}" fill="#050403" stroke="${INK}" stroke-width="1.2"/>`);
  // posts, windlass, roof
  for (const dx of [-0.92, 0.92]) a.raw(seg([X + dx, hR, Z], [X + dx, 2.7, Z], INK, s * 0.14 + 2.4) + seg([X + dx, hR, Z], [X + dx, 2.7, Z], TIMBER, s * 0.11));
  a.raw(seg([X - 1.0, 1.9, Z], [X + 1.0, 1.9, Z], INK, s * 0.12 + 2) + seg([X - 1.0, 1.9, Z], [X + 1.0, 1.9, Z], '#5a4632', s * 0.09));
  { const [cx, cy] = P(X - 0.1, 1.9, Z); a.raw(`<path d="M${f(cx - s * 0.25)} ${f(cy - s * 0.05)} c0 ${f(s * 0.05)} ${f(s * 0.5)} ${f(s * 0.05)} ${f(s * 0.5)} 0" stroke="#8a7a5a" stroke-width="${f(s * 0.07)}" fill="none"/>`);
    const [hx, hy] = P(X + 1.0, 1.9, Z); a.raw(`<path d="M${f(hx)} ${f(hy)} l${f(s * 0.12)} 0 l0 ${f(s * 0.3)} l${f(s * 0.12)} 0" stroke="${INK}" stroke-width="3" fill="none"/>`); }
  a.raw(`<path d="${pp([[X - 1.25, 2.55, Z - 0.5], [X + 1.25, 2.55, Z - 0.5], [X + 1.1, 3.25, Z], [X - 1.1, 3.25, Z]])}" fill="#4e3e2e"/>`);
  a.raw(planks((s2, t) => [X - 1.25 + s2, 2.55 + t * 0.7 / 0.6, Z - 0.5 + t * 0.5 / 0.6], 2.5, 0.6, '#4e3e2e', { board: 0.22, ragged: 0.1, nails: 4 }));
  a.raw(`<path d="${pp([[X - 1.25, 2.55, Z - 0.5], [X + 1.25, 2.55, Z - 0.5], [X + 1.1, 3.25, Z], [X - 1.1, 3.25, Z]])}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  // the rope down to a bucket hung on the rim
  { const [rx, ry] = P(X - 0.1, 1.9, Z), [bx, by] = P(X + 0.55, hR + 0.05, Z - 0.6), bs = s * 0.22; a.raw(`<path d="M${f(rx)} ${f(ry)} Q${f(rx + 10)} ${f((ry + by) / 2)} ${f(bx)} ${f(by - bs)}" stroke="#8a7a5a" stroke-width="2" fill="none"/>`);
    a.shape({ d: `M${f(bx - bs * 0.8)} ${f(by - bs)} L${f(bx + bs * 0.8)} ${f(by - bs)} L${f(bx + bs * 0.6)} ${f(by + bs * 0.3)} L${f(bx - bs * 0.6)} ${f(by + bs * 0.3)} Z`, fill: '#5a4632', tex: 'url(#grain)', texOp: 0.4, depth: 4, ink: 1.4, lines: [{ d: `M${f(bx - bs * 0.75)} ${f(by - bs * 0.6)} L${f(bx + bs * 0.75)} ${f(by - bs * 0.6)}`, w: 2, col: '#2a2622' }] }); }
  // votive candles and a scatter of offerings on the rim: tokens, a child's shoe
  a.raw(candles(X - 0.55, Z - 0.75, 3, hR, 0.4) + candles(X + 0.05, Z - 0.9, 2, hR, 0.3) + lantern(...P(X + 0.6, 2.35, Z - 0.5), 6, [X + 0.6, 2.35, Z - 0.5, 0.3, 3]));
  a.raw(D.weed(x0 - rx0 * 0.8, y1 + 6, 22) + D.weed(x0 - rx0 * 0.6, y1 + 8, 18));
});
// ------------------------------------------------------------------ the near huts: Almonry (left), Guesthouse (right)
const HUTZ = 8.4;
function hut(side, o = {}) {
  const xi = 5.8 * side, xo = 9.6 * side, z0 = 3.0, z1 = o.z1 || HUTZ, hw = o.hw || 3.6, hr = o.hr || 4.8;
  // roof: a lean-to rising toward the outer wall; we see its underside edge and the plank face
  a.raw(`<path d="${pp([[xi - 0.3 * side, hw, z0], [xi - 0.3 * side, hw, z1 + 0.3], [xo, hr, z1 + 0.3], [xo, hr, z0]])}" fill="#2e2620" stroke="${INK}" stroke-width="1.6"/>`);
  // the far end wall (facing the camera, at z1): visible strip
  a.raw(`<path d="${pp([[xi, 0, z1], [xo, 0, z1], [xo, hr, z1], [xi, hw, z1]])}" fill="${TIMBERD}" stroke="${INK}" stroke-width="1.4"/>`);
  a.raw(planks((s, t) => [xi + s * side, t, z1], Math.abs(xo - xi), hw, '#4a3a2a', { board: 0.3, nails: 10 }));
  shade([[xi, 0, z1], [xo, 0, z1], [xo, hw, z1], [xi, hw, z1]], { depth: 10, hatch: 70, wash: 0.45, grime: 0.6 });
  // the garth-facing side wall: stone footing, timber above
  const at = (s, t) => [xi, t, z0 + s];
  a.raw(stones(at, z1 - z0, 1.0, STONE, { course: 0.33, block: 0.6 }));
  if (!o.daub) a.raw(planks((s, t) => [xi, 1.0 + t, z0 + s], z1 - z0, hw - 1.0, '#54422e', { board: 0.28, nails: 24, ragged: 0.12 }));
  else {
    // daub panels between the timbers, cracked; two have fallen out to the woven wattle beneath
    const zs = [z0, 4.4, 5.6, 6.4, 7.4, z1], ts = [1.0, 2.3, hw];
    for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < ts.length - 1; j++) {
      const q = [[xi, ts[j], zs[i]], [xi, ts[j], zs[i + 1]], [xi, ts[j + 1], zs[i + 1]], [xi, ts[j + 1], zs[i]]], bare = (i === 1 && j === 1) || (i === 4 && j === 0);
      if (bare) { a.raw(`<path d="${pp(q)}" fill="#4a3a24" stroke="${INK}" stroke-width="1.2"/><path d="${pp(q)}" fill="${a.hatchPat(35, 5, 1.6, '#2a1e10')}"/><path d="${pp(q)}" fill="${a.hatchPat(-35, 5, 1.6, '#6a5434')}" opacity="0.8"/>`); continue; }
      a.shape({ d: pp(q), fill: mix('#6e6452', R() < 0.5 ? '#a89c80' : '#2a2218', R() * 0.25), depth: 10, hatch: 70, mottle: 0.7, grime: 0.7, ink: 1.2, decals: a.stain(...P(xi, (ts[j] + ts[j + 1]) / 2, (zs[i] + zs[i + 1]) / 2), 12, '#2a2014', 0.5),
        lines: Array.from({ length: 3 }, () => { const c = P(xi, ts[j] + R() * (ts[j + 1] - ts[j]), zs[i] + R() * (zs[i + 1] - zs[i])); return `M${f(c[0])} ${f(c[1])} l${f((R() - 0.5) * 10)} ${f(4 + R() * 8)} l${f((R() - 0.5) * 8)} ${f(3 + R() * 6)}`; }) });
    }
    for (const t of ts) a.raw(seg([xi, t, z0], [xi, t, z1], INK, 9) + seg([xi, t, z0], [xi, t, z1], TIMBERD, 5.6));
    a.raw(seg([xi, 1.0, 4.4], [xi, 2.3, 5.6], INK, 7) + seg([xi, 1.0, 4.4], [xi, 2.3, 5.6], TIMBERD, 4) + seg([xi, 2.3, 7.4], [xi, hw, 8.4], INK, 7) + seg([xi, 2.3, 7.4], [xi, hw, 8.4], TIMBERD, 4));
  }
  // timber frame: sill, posts, top plate, a brace
  for (const z of (o.daub ? [z0 + 0.1, 4.4, 5.6, 6.4, 7.4, z1 - 0.1] : [z0 + 0.1, 5.4, z1 - 0.1])) a.raw(seg([xi, 1.0, z], [xi, hw, z], INK, K(z) * 0.2 + 2) + seg([xi, 1.0, z], [xi, hw, z], TIMBERD, K(z) * 0.16));
  a.raw(seg([xi, 1.0, z0], [xi, 1.0, z1], INK, 7) + seg([xi, 1.0, z0], [xi, 1.0, z1], TIMBERD, 4.6) + seg([xi, hw - 0.05, z0], [xi, hw - 0.05, z1], INK, 8) + seg([xi, hw - 0.05, z0], [xi, hw - 0.05, z1], TIMBERD, 5.4));
  shade([at(0, 0), at(z1 - z0, 0), at(z1 - z0, hw), at(0, hw)], { depth: 16, hatch: side < 0 ? 110 : 70, wash: side < 0 ? 0.45 : 0.25, grime: 0.6, mottle: 0.5, dark: side < 0 ? 115 : 0, darkOp: 0.3 });
  // mud splashed up the footing, damp creeping into the planks, a broken board showing the dark inside
  for (let z = z0 + 0.4; z < z1; z += 0.9) { const [x, y] = P(xi, 0.1, z); a.raw(bloom(x, y, K(z) * 0.35, '#1a140c', 0.4)); }
  // things hung on the wall: a sickle, a ladle, a string of onions, a coil of rope
  for (const [z, t, k] of [[z0 + 2.4, 2.6, 'rope'], [z0 + 3.0, 2.9, 'onions'], [z0 + 4.4, 2.8, 'sickle']]) {
    const [x, y] = P(xi, t, z), q = K(z);
    if (k === 'rope') a.raw(`<ellipse cx="${f(x)}" cy="${f(y + q * 0.15)}" rx="${f(q * 0.08)}" ry="${f(q * 0.18)}" fill="none" stroke="${INK}" stroke-width="${f(q * 0.05 + 1.5)}"/><ellipse cx="${f(x)}" cy="${f(y + q * 0.15)}" rx="${f(q * 0.08)}" ry="${f(q * 0.18)}" fill="none" stroke="#8a7a5a" stroke-width="${f(q * 0.035)}"/>`);
    if (k === 'onions') { a.raw(`<path d="M${f(x)} ${f(y)} L${f(x)} ${f(y + q * 0.5)}" stroke="#6a5a3a" stroke-width="1.6"/>`); for (let i = 0; i < 5; i++) a.raw(`<circle cx="${f(x + (i % 2 ? 3 : -3))}" cy="${f(y + q * (0.08 + i * 0.09))}" r="${f(q * 0.045)}" fill="#8a6a3a" stroke="${INK}" stroke-width="0.9"/>`); }
    if (k === 'sickle') a.raw(`<path d="M${f(x)} ${f(y)} l0 ${f(q * 0.2)} M${f(x)} ${f(y + q * 0.2)} q${f(q * 0.25 * side)} ${f(-q * 0.05)} ${f(q * 0.22 * side)} ${f(q * 0.25)}" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${f(x)} ${f(y + q * 0.2)} q${f(q * 0.25 * side)} ${f(-q * 0.05)} ${f(q * 0.22 * side)} ${f(q * 0.25)}" stroke="#7a7670" stroke-width="1.4" fill="none"/>`);
  }
  // roof edge: slates and planks overhanging, a broken gutter, a drip line
  a.raw(`<path d="${pp([[xi - 0.35 * side, hw, z0], [xi - 0.35 * side, hw, z1 + 0.3], [xi - 0.35 * side, hw + 0.22, z1 + 0.3], [xi - 0.35 * side, hw + 0.22, z0]])}" fill="#3a3632" stroke="${INK}" stroke-width="1.4"/>`);
  for (let z = z0 + 0.2; z < z1; z += 0.35) { const [x, y] = P(xi - 0.35 * side, hw, z); a.raw(a.drip(x, y, K(z) * (0.05 + R() * 0.2), Math.max(1, K(z) * 0.02), '#1a1612')); }
  return at;
}
add(9.05, () => {
  // ---------------- the Almonry: the dole window where bread and broth go out, and the queue for it (clickable)
  const at = hut(-1);
  const zw0 = 6.6, zw1 = 7.8;
  const win = [at(zw0 - 3, 1.05), at(zw1 - 3, 1.05), at(zw1 - 3, 2.35), at(zw0 - 3, 2.35)];
  litHole(win, 7.2, { r: 2.2, op: 0.5, top: '#3a1a08', bot: '#d8843a' });
  // shelves of loaves and jars inside, a hanging ham, steam off a pot
  through(win, () => {
  for (const t of [1.55, 2.0]) a.raw(seg([-6.3, t, 6.7], [-6.3, t, 7.7], '#2a160a', 3));
  for (let i = 0; i < 6; i++) { const [x, y] = P(-6.3, 2.0, 6.75 + i * 0.16); a.raw(`<path d="${blob(x, y - 4, 4, R, 6, 0.2)}" fill="${i % 2 ? '#8a5a2a' : '#5a4a3a'}" stroke="${INK}" stroke-width="0.8"/>`); }
  });
  // the shutter propped up on a stick, a counter with loaves and bowls
  a.raw(planks((s, t) => [-5.8 + t * 0.85, 2.35 + t * 0.45, zw0 + s], zw1 - zw0, 0.9, '#4a3a28', { board: 0.2, nails: 4 }));
  // the almoner's hands and face in the window, lit from inside
  // Brother Fenn behind the hatch, hooded, his face caught by the lamp inside
  through(win, () => { a.raw(a.glow(...P(-6.9, 1.9, 7.6), 60, GLOW, 0.5)); folk(-6.55, 8.0, { col: '#2e2620', face: 1, arm: 'bowl', lean: 0, skin: '#c8a070' }); });
  a.raw(`<path d="${pp([[-5.8, 1.05, zw0 - 0.1], [-5.8, 1.05, zw1 + 0.1], [-5.45, 1.05, zw1 + 0.1], [-5.45, 1.05, zw0 - 0.1]])}" fill="#6a5440" stroke="${INK}" stroke-width="1.4"/>`);
  for (const z of [6.85, 7.25, 7.6]) { const [x, y] = P(-5.62, 1.05, z), s = K(z); a.raw(`<path d="${blob(x, y - s * 0.06, s * 0.09, R, 7, 0.2)}" fill="#a8783e" stroke="${INK}" stroke-width="1.2"/>`); }
  a.raw(seg([-5.52, 1.06, 7.5], [-5.08, 2.72, 7.5], INK, 3.4) + seg([-5.52, 1.06, 7.5], [-5.08, 2.72, 7.5], TIMBER, 2));
  // the dole sign: a bowl and loaf painted on a board, a chalked tally of the day's mouths
  { const s = K(5.9); const sg = [at(5.5 - 3, 2.5), at(6.3 - 3, 2.5), at(6.3 - 3, 3.2), at(5.5 - 3, 3.2)]; a.raw(`<path d="${pp(sg)}" fill="#7a6a50" stroke="${INK}" stroke-width="1.6"/>`); const [x, y] = P(-5.8, 2.85, 5.9); a.raw(`<path d="M${f(x - s * 0.12)} ${f(y - s * 0.02)} q${f(s * 0.12)} ${f(s * 0.14)} ${f(s * 0.24)} 0 Z" fill="#3a2a1e"/><ellipse cx="${f(x + s * 0.02)}" cy="${f(y - s * 0.08)}" rx="${f(s * 0.07)}" ry="${f(s * 0.04)}" fill="#a8783e" stroke="${INK}" stroke-width="1"/>`);
    for (let i = 0; i < 4; i++) { const [tx, ty] = P(-5.8, 1.9, 4.2 + i * 0.12); a.raw(`<path d="M${f(tx)} ${f(ty)} l0 ${f(-K(4.2) * 0.3)}" stroke="#d8d0c0" stroke-width="2" opacity="0.7"/>`); }
    { const [tx, ty] = P(-5.8, 1.85, 4.15), [ux, uy] = P(-5.8, 2.15, 4.75); a.raw(`<path d="M${f(tx)} ${f(ty)} L${f(ux)} ${f(uy)}" stroke="#d8d0c0" stroke-width="2" opacity="0.7"/>`); } }
  a.raw(lantern(...P(-5.35, 3.25, 6.1), 8, [-5.35, 3.25, 6.1]));
  hot('almonry', 'Almonry', [P(-5.8, 0, 5.8), P(-5.8, 0, 8.4), P(-5.8, 3.6, 8.4), P(-5.8, 3.6, 5.8)].map((p, i) => i < 2 ? [p[0] + 50, p[1] + 10] : p));
  outline('almonry', [[win, 1], [[at(zw0 - 3.12, 0.95), at(zw0 - 3.12, 2.47), at(zw1 - 2.88, 2.47), at(zw1 - 2.88, 0.95)], 1], [[[-5.8, 1.05, zw0 - 0.1], [-5.45, 1.05, zw0 - 0.1], [-5.45, 1.05, zw1 + 0.1], [-5.8, 1.05, zw1 + 0.1]]]]);
  // ---------------- the Guesthouse: wattle-and-daub lodging, its door open, a bench outside (clickable)
  const gt = hut(1, { hw: 4.3, hr: 5.4, z1: 9.0, daub: true });
  const dz0 = 6.4, dz1 = 7.4;
  const dr = [gt(dz0 - 3, 0), gt(dz1 - 3, 0), gt(dz1 - 3, 2.3), gt(dz0 - 3, 2.3)];
  litHole(dr, 6.9, { r: 1.8, op: 0.3, top: '#1e0e06', bot: '#a8622a', I: 1.4, range: 6 });
  // inside: the hearth low at the back, the hosteller standing against its glow, a settle and a hanging pot
  { const cid = a.id('gd'); a.raw(`<clipPath id="${cid}"><path d="${pp(dr)}"/></clipPath><g clip-path="url(#${cid})">`);
    a.raw(`<path d="${pp(dr)}" fill="#1a0e06" opacity="0.5"/>`); const [x, y] = P(7.3, 0.3, 8.4); a.raw(a.glow(x, y, 80, GLOW, 0.7) + D.flame(x, y + 8, 30, 16, 0));
    folk(6.25, 7.25, { col: '#1e1a16', face: -1, lean: 2, bare: true, hair: '#4a4238', skin: '#8a7058' });
    a.raw('</g>'); }
  // a window with a cracked horn pane, past the door
  windowOn(gt, 7.95 - 3, 8.55 - 3, 1.3, 2.6, 'lit');
  a.raw(planks((s, t) => [5.8 - s * 0.35, t, dz1 + s * 0.5], 0.95, 2.3, '#3a2c20', { board: 0.2, nails: 5 }));
  // the sign: a key on a board, hung from a bracket
  { const [bx, by] = P(5.8, 3.0, 5.5), [ex, ey] = P(4.9, 3.0, 5.5), s = K(5.5); a.raw(`<path d="M${f(bx)} ${f(by)} L${f(ex)} ${f(ey)}" stroke="${INK}" stroke-width="5"/><path d="M${f(bx)} ${f(by)} L${f(ex)} ${f(ey)}" stroke="#2a2826" stroke-width="2.6"/>`);
    a.raw(`<path d="M${f(ex + s * 0.05)} ${f(ey)} l0 ${f(s * 0.12)} M${f(ex + s * 0.45)} ${f(ey)} l0 ${f(s * 0.12)}" stroke="${INK}" stroke-width="1.6"/><path d="M${f(ex - s * 0.05)} ${f(ey + s * 0.12)} L${f(ex + s * 0.55)} ${f(ey + s * 0.12)} L${f(ex + s * 0.55)} ${f(ey + s * 0.5)} L${f(ex - s * 0.05)} ${f(ey + s * 0.5)} Z" fill="#6a5a44" stroke="${INK}" stroke-width="1.8"/>` +
      `<circle cx="${f(ex + s * 0.12)}" cy="${f(ey + s * 0.31)}" r="${f(s * 0.06)}" fill="none" stroke="#2a2826" stroke-width="${f(s * 0.03)}"/><path d="M${f(ex + s * 0.18)} ${f(ey + s * 0.31)} L${f(ex + s * 0.45)} ${f(ey + s * 0.31)} M${f(ex + s * 0.4)} ${f(ey + s * 0.31)} l0 ${f(s * 0.06)} M${f(ex + s * 0.34)} ${f(ey + s * 0.31)} l0 ${f(s * 0.05)}" stroke="#2a2826" stroke-width="${f(s * 0.03)}"/>` + a.stain(ex + s * 0.3, ey + s * 0.3, s * 0.15, '#140e0a', 0.4)); }
  a.raw(lantern(...P(5.35, 3.3, 6.0), 9, [5.35, 3.3, 6.0]));
  // bench with a pilgrim asleep on it, a pack, a staff
  hot('guesthouse', 'Guesthouse', [P(5.8, 0, 5.8), P(5.8, 0, 9.0), P(5.8, 4.3, 9.0), P(5.8, 4.3, 5.8)].map((p, i) => i === 0 ? [p[0] - 50, p[1] + 10] : p));
  outline('guesthouse', [[dr, 1], ...stoneTrace(gt, dz0 - 3, dz1 - 3, 2.3, 0, 0.12, [-1, 0, 0], 0, true, true)]);
});
// the alms queue: ragged folk waiting at the dole window, one with a child
add(7.6, () => { folk(-4.4, 8.3, { col: '#4a4440', face: -1, arm: 'bowl', lean: -4 }); folk(-3.5, 8.9, { col: '#5a4a3a', face: -1, bare: true, hair: '#4a3a2a', pack: '#7a6a4a', lean: -6 }); folk(-3.1, 9.4, { col: '#3a4048', face: -1, h: 1.05, bare: true, hair: '#2a2018', lean: 3 }); folk(-2.5, 10.0, { col: '#6a5a3a', face: -1, arm: 'staff', lean: -9 }); folk(-4.9, 9.8, { col: '#3e3832', face: -1, crutch: true, lean: 6 }); });
add(7.2, () => { folk(-5.0, 7.2, { col: '#3a3634', face: -1, arm: 'bowl', pose: 'stand' }); });
add(7.0, () => { barrel(5.2, 7.6); crate(4.9, 8.2, 0.6); sack(5.3, 7.0); });
// crows on the wellroof, the graves, the roofs; birds wheeling in the Grey
add(9.9, () => { const [x, y] = P(WELL[0] + 0.6, 3.25, WELL[1]); a.raw(crow(x, y - 8, 9, -1)); });

sackLater.forEach(([X, Z, Y]) => add(Z - 0.05, () => sack(X, Z, Y)));
// the brazier the company warms itself at: firelight pooled on the mud round the cross
add(12.0, () => { const [x, y] = P(BRAZIER[0], 0, BRAZIER[1]); a.raw(`<ellipse cx="${f(x)}" cy="${f(y + 10)}" rx="560" ry="170" fill="url(#fireGround)"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="240" ry="80" fill="url(#fireGround)"/>`.replace(/^/, '<g class="glow">') + '</g>'); });
function drawBrazier() {
  a.raw('<g class="z_530">');
  const [X, Z] = BRAZIER, s = K(Z), [x, y] = P(X, 0, Z), [bx, by] = P(X, 1.0, Z);
  a.raw(a.glow(bx, by - s * 0.3, s * 3.2, GLOW, 0.45) + a.glow(bx, by - s * 0.2, s * 1.1, '#ffd27a', 0.4));
  for (const dx of [-0.32, 0.0, 0.32]) { const [lx, ly] = P(X + dx * 1.3, 0, Z + (dx === 0 ? 0.3 : -0.15)); a.raw(`<path d="M${f(lx)} ${f(ly)} L${f(bx + dx * s * 0.5)} ${f(by + s * 0.05)}" stroke="${INK}" stroke-width="${f(s * 0.06 + 2.4)}" stroke-linecap="round"/><path d="M${f(lx)} ${f(ly)} L${f(bx + dx * s * 0.5)} ${f(by + s * 0.05)}" stroke="#3a3430" stroke-width="${f(s * 0.04)}"/>`); }
  addLight(X, 1.55, Z, 2.5, 11, [1.0, 0.52, 0.2]);
  a.raw(fireTongues(bx, by - s * 0.08, s * 0.85, s * 0.62) + D.embers(bx, by - s * 0.8, s * 1.2, 30));
  a.shape({ d: `M${f(bx - s * 0.38)} ${f(by - s * 0.1)} L${f(bx + s * 0.38)} ${f(by - s * 0.1)} C${f(bx + s * 0.34)} ${f(by + s * 0.12)} ${f(bx + s * 0.2)} ${f(by + s * 0.2)} ${f(bx)} ${f(by + s * 0.2)} C${f(bx - s * 0.2)} ${f(by + s * 0.2)} ${f(bx - s * 0.34)} ${f(by + s * 0.12)} ${f(bx - s * 0.38)} ${f(by - s * 0.1)} Z`, fill: '#2e2a28', depth: s * 0.1, ink: 2, mottle: 0.5, grime: 0.6, hatch: 70, hlCol: '#ffb060', hlOp: 0.35,
    lines: [-0.2, 0, 0.2].map(k => ({ d: `M${f(bx + s * k)} ${f(by - s * 0.1)} L${f(bx + s * k * 0.8)} ${f(by + s * 0.18)}`, w: 1.4 })), decals: a.stain(bx, by, s * 0.2, G.rust, 0.6) });
  a.raw(`<ellipse cx="${f(bx)}" cy="${f(by - s * 0.1)}" rx="${f(s * 0.38)}" ry="${f(s * 0.06)}" fill="#ff8a2a" stroke="${INK}" stroke-width="2"/>`);
  a.raw(smoke([[bx, by - s * 1.0], [bx + 6, by - s * 1.6], [bx + 30, by - s * 2.3], [bx + 90, by - s * 3.0]], s * 0.4, 0.16));
  a.raw('</g>');
}
props.sort((p, q) => q[0] - p[0]).forEach(([, fn]) => fn());

// sky birds and roof crows, after the buildings
a.raw([[620, 70, 7], [660, 50, 5], [700, 84, 6], [980, 40, 5], [1010, 60, 4], [400, 30, 4]].map(([x, y, s]) => flying(x, y, s)).join(''));
{ const [x, y] = P(-9.6, 7.3, 18); a.raw(crow(x, y - 4, 8, 1)); const [x2, y2] = P(9.6, 7.3, 27); a.raw(crow(x2, y2 - 3, 5, -1)); }
// chimney smoke from the huts and the guesthouse hearth, drifting the same way as the forge smoke
{ const [x, y] = P(8.2, 4.6, 7.0); a.raw(`<path d="M${f(x - 6)} ${f(y)} L${f(x - 6)} ${f(y - 40)} L${f(x + 6)} ${f(y - 40)} L${f(x + 6)} ${f(y)} Z" fill="#2a2624" stroke="${INK}" stroke-width="1.6"/>` + smoke([[x, y - 40], [x + 10, y - 120], [x + 60, y - 220], [x + 150, y - 300]], 40, 0.22)); }

// ================================================================== MONUMENT LAYER (between the back and front party slots)
// The garth cross at the crossing of the paths: a stepped plinth, the shaft snapped in the first winter of the Grey and its
// head lying where it fell. The company's dead are chalked on the risers; their weapons stand planted round the steps.
a.layer('monument');
a.raw('<g class="z_545">');
{
  const [CXw, CZ] = CROSS, steps = [[1.15, 0, 0.3], [0.85, 0.3, 0.6], [0.55, 0.6, 0.9]];
  // the blade planted behind the plinth goes first, so the steps cover its foot
  { const [x, y] = P(0.75, 0, 7.85), k = K(7.85), h = k * 0.85; a.raw(`<g transform="rotate(3 ${f(x)} ${f(y)})"><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y - h)}" stroke="${INK}" stroke-width="${f(k * 0.06 + 3)}"/><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y - h)}" stroke="#8a8680" stroke-width="${f(k * 0.04)}"/><path d="M${f(x - k * 0.12)} ${f(y - h)} L${f(x + k * 0.12)} ${f(y - h)}" stroke="${INK}" stroke-width="${f(k * 0.05 + 3)}" stroke-linecap="round"/><path d="M${f(x - k * 0.12)} ${f(y - h)} L${f(x + k * 0.12)} ${f(y - h)}" stroke="#4a4440" stroke-width="${f(k * 0.035)}"/><path d="M${f(x)} ${f(y - h)} L${f(x)} ${f(y - h - k * 0.18)}" stroke="${INK}" stroke-width="${f(k * 0.045 + 2.4)}"/></g>`); }
  const s = K(CZ - 1.15), [gx, gy] = P(0, 0, CZ - 1.15);
  a.raw(`<ellipse cx="${f(gx)}" cy="${f(gy + 4)}" rx="${f(s * 1.5)}" ry="${f(s * 0.18)}" fill="#0e0b08" opacity="0.5"/>`);
  for (const [hw, y0, y1] of steps) {
    const zf = CZ - hw, zb = CZ + hw;
    // top face, then the riser facing us
    a.raw(PLW([[-hw, y1, zf], [hw, y1, zf], [-hw, y1, zb]], `<path d="${pp([[-hw, y1, zf], [hw, y1, zf], [hw, y1, zb], [-hw, y1, zb]])}" fill="${light(STONE2, 0.12)}" stroke="${INK}" stroke-width="1.8"/>`));
    a.shape({ d: pp([[-hw, y1, zf], [hw, y1, zf], [hw, y1, zb], [-hw, y1, zb]]), fill: 'rgba(0,0,0,0)', noShade: true, mottle: 0.5, grime: 0.6, ink: 0, decals: a.stain(...P(-hw * 0.4, y1, CZ), K(CZ) * 0.3, '#2a3420', 0.4) });
    const at = (u, t) => [-hw + u, y0 + t, zf];
    a.raw(stones(at, hw * 2, y1 - y0, STONE2, { course: 0.3, block: 0.55 }));
    shade([at(0, 0), at(hw * 2, 0), at(hw * 2, y1 - y0), at(0, y1 - y0)], { depth: 6, hatch: 70, wash: 0.3 });
    // names of the dead chalked on the riser, a few scored through
    const k = K(zf); let names = '';
    for (let i = 0; i < Math.round(hw * 5); i++) { const [nx, ny] = P(-hw + 0.15 + i * (hw * 2 - 0.3) / Math.round(hw * 5), y0 + (y1 - y0) * 0.5, zf); let d = `M${f(nx)} ${f(ny)}`; for (let c = 0; c < 5; c++) d += ` l${f(k * 0.02)} ${f((c % 2 ? -1 : 1) * k * 0.035)}`; names += `<path d="${d}" stroke="#d8d0c0" stroke-width="1.3" fill="none" opacity="0.75"/>`; if (R() < 0.3) names += `<path d="M${f(nx - 2)} ${f(ny)} l${f(k * 0.12)} 0" stroke="#d8d0c0" stroke-width="1" opacity="0.6"/>`; }
    a.raw(names);
  }
  // the shaft: square, carved with a worn knot, snapped off jagged
  { const w = 0.18, zf = CZ - w, at = (u, t) => [-w + u, 0.9 + t, zf], top = [[0, 1.25], [0.1, 1.38], [0.18, 1.2], [0.26, 1.33], [0.36, 1.1]];
    a.raw(`<path d="${pp([at(0, 0), at(0.36, 0), ...top.slice().reverse().map(([u, t]) => at(u, t))])}" fill="${STONE2}" stroke="${INK}" stroke-width="2"/>`);
    a.shape({ d: pp([at(0, 0), at(0.36, 0), ...top.slice().reverse().map(([u, t]) => at(u, t))]), fill: 'rgba(0,0,0,0)', depth: 8, hatch: 70, mottle: 0.5, grime: 0.5, ink: 2,
      lines: [0.25, 0.5, 0.75].map(t => { const A = P(...at(0.05, t)), B = P(...at(0.31, t + 0.06)); return `M${f(A[0])} ${f(A[1])} Q${f((A[0] + B[0]) / 2)} ${f(A[1] - 6)} ${f(B[0])} ${f(B[1])}`; }), decals: a.stain(...P(-0.05, 1.6, zf), 10, '#3a4a2e', 0.6) });
    a.raw(candles(-0.3, CZ - 0.5, 4, 0.9, 0.4) + candles(0.3, CZ - 0.45, 3, 0.9, 0.3) + candles(-0.6, CZ - 0.78, 3, 0.6, 0.4) + candles(0.65, CZ - 0.8, 2, 0.6, 0.3) + candles(0.9, CZ - 1.1, 3, 0.3, 0.4));
    // ribbons and a child's token tied round the stump
    const [rx, ry] = P(0, 1.9, zf); a.raw(`<path d="M${f(rx - 8)} ${f(ry)} q8 4 16 0 M${f(rx + 6)} ${f(ry + 2)} l3 18 M${f(rx + 2)} ${f(ry + 3)} l-2 22" stroke="#b8ac90" stroke-width="2.4" fill="none"/>`); }
  // the fallen head of the cross, lying where it came down against the bottom step
  { const Y = 0.24, q = (x0, x1, z0, z1) => [[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]], fr = (x0, x1, z) => [[x0, 0, z], [x1, 0, z], [x1, Y, z], [x0, Y, z]];
    for (const [x0, x1, z0, z1] of [[0.9, 1.95, 5.0, 5.3], [1.45, 1.72, 4.66, 5.64]]) { a.raw(`<path d="${pp(fr(x0, x1, z0))}" fill="${dark(STONE2, 0.2)}" stroke="${INK}" stroke-width="2"/><path d="${pp(q(x0, x1, z0, z1))}" fill="${light(STONE2, 0.08)}" stroke="${INK}" stroke-width="2"/>`); }
    a.shape({ d: pp(q(0.9, 1.95, 5.0, 5.3)), fill: 'rgba(0,0,0,0)', depth: 4, hatch: 70, mottle: 0.5, grime: 0.6, ink: 0, decals: a.stain(...P(1.3, Y, 5.15), 10, '#3a4a2e', 0.5) });
    { const A = P(0.9, Y, 5.0), B = P(0.9, Y, 5.3), C = P(0.9, 0, 5.0); a.raw(`<path d="M${f(A[0])} ${f(A[1])} l-5 4 l4 3 l-6 5 L${f(C[0] - 2)} ${f(C[1])} L${f(C[0] + 6)} ${f(C[1])} L${f(B[0] + 4)} ${f(B[1])} Z" fill="${dark(STONE2, 0.35)}" stroke="${INK}" stroke-width="1.6"/>`); }
    const [cx, cy] = P(1.585, Y, 5.15); a.raw(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="12" ry="4" fill="none" stroke="${INK}" stroke-width="1.4"/>`); }
  // weapons of the dead planted round the steps; one with a rag tied to its hilt, a dented helm on the step
  for (const [X, Z, lean, rag] of [[1.25, 6.05, 6, 1], [-1.3, 6.3, -5, 0]]) {
    const [x, y] = P(X, 0, Z), k = K(Z), h = k * 0.85;
    a.raw(`<g transform="rotate(${lean} ${f(x)} ${f(y)})"><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y - h)}" stroke="${INK}" stroke-width="${f(k * 0.06 + 3)}"/><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y - h)}" stroke="#8a8680" stroke-width="${f(k * 0.04)}"/><path d="M${f(x - k * 0.12)} ${f(y - h)} L${f(x + k * 0.12)} ${f(y - h)}" stroke="${INK}" stroke-width="${f(k * 0.05 + 3)}" stroke-linecap="round"/><path d="M${f(x - k * 0.12)} ${f(y - h)} L${f(x + k * 0.12)} ${f(y - h)}" stroke="#4a4440" stroke-width="${f(k * 0.035)}" stroke-linecap="round"/><path d="M${f(x)} ${f(y - h)} L${f(x)} ${f(y - h - k * 0.18)}" stroke="${INK}" stroke-width="${f(k * 0.045 + 2.4)}"/><path d="M${f(x)} ${f(y - h)} L${f(x)} ${f(y - h - k * 0.18)}" stroke="#4a3626" stroke-width="${f(k * 0.03)}"/><circle cx="${f(x)}" cy="${f(y - h - k * 0.2)}" r="${f(k * 0.035)}" fill="#4a4440" stroke="${INK}" stroke-width="1.4"/>` +
      (rag ? `<path d="M${f(x + 2)} ${f(y - h - k * 0.1)} l${f(k * 0.08)} ${f(k * 0.04)} l${f(k * 0.02)} ${f(k * 0.25)} l${f(-k * 0.05)} ${f(-k * 0.06)} l${f(-k * 0.03)} ${f(k * 0.08)} Z" fill="${G.redD}" stroke="${INK}" stroke-width="1.2"/>` : '') + `</g>` + a.drip(x + 1, y - h * 0.6, k * 0.08, 1.6, G.rust));
  }
  { const [hx, hy] = P(0.6, 0.6, CZ - 0.75), k = K(CZ - 0.75); a.shape({ d: `M${f(hx - k * 0.14)} ${f(hy)} C${f(hx - k * 0.16)} ${f(hy - k * 0.2)} ${f(hx + k * 0.16)} ${f(hy - k * 0.2)} ${f(hx + k * 0.14)} ${f(hy)} Z`, fill: G.steelD, depth: 6, ink: 1.8, mottle: 0.5, grime: 0.6, hatch: 60, decals: a.stain(hx + 3, hy - 6, 6, G.rust, 0.7), after: `<path d="M${f(hx - k * 0.1)} ${f(hy - k * 0.07)} l${f(k * 0.1)} 0" stroke="${INK}" stroke-width="2.6"/>` }); }
}

drawBrazier();
a.raw('</g>');
// ================================================================== FIRELIGHT LAYER (over the party; additive in the engine)
a.layer('light');
{ const [x, y] = P(BRAZIER[0] + 0.4, 1.0, BRAZIER[1] - 1.0); a.raw(`<radialGradient id="fl"><stop offset="0" stop-color="#ff9a3a" stop-opacity="0.32"/><stop offset="0.55" stop-color="#ff8a2a" stop-opacity="0.12"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></radialGradient><ellipse cx="${f(x)}" cy="${f(y)}" rx="620" ry="360" fill="url(#fl)"/>`); }

// ================================================================== FOREGROUND LAYER (in front of the party)
a.layer('fg');
a.raw('<g class="z_340">');
{
  // near mud: churned ruts, straw, a dropped bucket, a dead crow, a broken cartwheel spoke; nothing tall enough to hide the party
  // straw clumps, a broken pot, a gnawed bone
  for (const [X, Z] of [[-2.6, 3.4], [1.6, 3.2], [3.2, 4.2], [-3.9, 4.6]]) { const [x, y] = P(X, 0, Z), sc = K(Z); let d = ''; for (let i = 0; i < 14; i++) { const a0 = (R() - 0.5) * 0.6, l = sc * (0.1 + R() * 0.25); d += `M${f(x + (R() - 0.5) * sc * 0.3)} ${f(y + (R() - 0.5) * sc * 0.04)} l${f(Math.cos(a0) * l * (R() < 0.5 ? -1 : 1))} ${f(Math.sin(a0) * l * 0.3)} `; } a.raw(`<path d="${d}" stroke="${INK}" stroke-width="3" opacity="0.6"/><path d="${d}" stroke="#b8a46a" stroke-width="1.6"/>`); }
  { const [x, y] = P(1.3, 0, 3.6), sc = K(3.6); a.raw(`<path d="M${f(x - sc * 0.14)} ${f(y)} Q${f(x - sc * 0.15)} ${f(y - sc * 0.12)} ${f(x)} ${f(y - sc * 0.13)} L${f(x + sc * 0.04)} ${f(y - sc * 0.05)} L${f(x + sc * 0.12)} ${f(y - sc * 0.06)} L${f(x + sc * 0.1)} ${f(y)} Z" fill="#7a5a3a" stroke="${INK}" stroke-width="2"/><path d="M${f(x + sc * 0.18)} ${f(y - 2)} l${f(sc * 0.08)} ${f(-sc * 0.02)} l${f(sc * 0.02)} ${f(sc * 0.04)} Z" fill="#7a5a3a" stroke="${INK}" stroke-width="1.6"/>`);
    const [bx, by] = P(-1.9, 0, 3.3); a.raw(`<path d="M${f(bx)} ${f(by)} l${f(sc * 0.3)} ${f(-sc * 0.03)}" stroke="${INK}" stroke-width="${f(sc * 0.05 + 3)}" stroke-linecap="round"/><path d="M${f(bx)} ${f(by)} l${f(sc * 0.3)} ${f(-sc * 0.03)}" stroke="#c8bca0" stroke-width="${f(sc * 0.05)}" stroke-linecap="round"/>`); }
  // left: a heap of fallen arcade masonry, a column drum on its side, a voussoir, rubble and weeds
  { const Z = 3.35, s = K(Z);
    const [dx, dy] = P(-3.3, 0.32, Z);
    a.shape({ d: `M${f(dx - s * 0.6)} ${f(dy - s * 0.32)} L${f(dx + s * 0.35)} ${f(dy - s * 0.34)} A${f(s * 0.14)} ${f(s * 0.33)} 0 0 1 ${f(dx + s * 0.35)} ${f(dy + s * 0.32)} L${f(dx - s * 0.6)} ${f(dy + s * 0.32)} Z`, fill: STONE2, depth: s * 0.2, ink: 2.2, mottle: 0.6, grime: 0.6, hatch: 80, dark: 0,
      lines: [-0.5, -0.38, -0.26, -0.14, -0.02, 0.1, 0.22].map(k => ({ d: `M${f(dx - s * 0.62)} ${f(dy + s * k)} C${f(dx - s * 0.2)} ${f(dy + s * k + 2)} ${f(dx + s * 0.1)} ${f(dy + s * k - 2)} ${f(dx + s * 0.33)} ${f(dy + s * k * 1.02)}`, w: 1.6, op: 0.7 })).concat([{ d: `M${f(dx - s * 0.2)} ${f(dy - s * 0.34)} l${f(s * 0.06)} ${f(s * 0.12)} l${f(-s * 0.08)} ${f(s * 0.1)}`, w: 2.4 }]), decals: a.stain(dx - s * 0.2, dy, s * 0.3, '#2a3420', 0.5) + a.stain(dx + s * 0.1, dy + s * 0.1, s * 0.2, '#140e0a', 0.5) });
    a.raw(`<ellipse cx="${f(dx + s * 0.35)}" cy="${f(dy)}" rx="${f(s * 0.14)}" ry="${f(s * 0.33)}" fill="${light(STONE2, 0.1)}" stroke="${INK}" stroke-width="2.2"/><ellipse cx="${f(dx + s * 0.35)}" cy="${f(dy)}" rx="${f(s * 0.07)}" ry="${f(s * 0.18)}" fill="none" stroke="${INK}" stroke-width="1" opacity="0.6"/>`);
    for (let i = 0; i < 9; i++) { const X = -4.4 + R() * 1.8, ZZ = 3.15 + R() * 0.4, [rx, ry] = P(X, 0, ZZ); a.shape({ d: blob(rx, ry - s * 0.06, s * (0.07 + R() * 0.1), R, 6, 0.35), fill: mix(STONE2, '#1a1410', R() * 0.4), depth: 6, ink: 1.8, hatch: 70, mottle: 0.5 }); }
    { const [lx, ly] = P(-3.2, 0.66, 3.35); a.raw(lantern(lx, ly - 15, 24, [-3.2, 0.75, 3.3, 0.22, 2.6])); }
    a.raw(D.weed(dx - s * 0.5, dy + s * 0.3, -s * 0.3) + D.weed(dx - s * 0.2, dy + s * 0.32, -s * 0.22));
  }
  // right: a handcart tipped on its legs, sacks and a basket of turnips, cut by the frame
  { const Z = 3.3, s = K(Z), [cx0, cy0] = P(2.5, 0.6, Z), [cx1] = P(3.85, 0.6, Z);
    a.shape({ d: `M${f(cx0)} ${f(cy0)} L${f(cx1)} ${f(cy0 - s * 0.05)} L${f(cx1)} ${f(cy0 - s * 0.5)} L${f(cx0 + s * 0.05)} ${f(cy0 - s * 0.42)} Z`, fill: '#4e3c2a', tex: 'url(#grain)', texOp: 0.6, depth: s * 0.1, ink: 2.2, mottle: 0.4, grime: 0.7, hatch: 70, lines: [`M${f(cx0)} ${f(cy0 - s * 0.2)} L${f(cx1)} ${f(cy0 - s * 0.24)}`] });
    const [wx, wy] = P(2.95, 0.38, Z); a.raw(`<circle cx="${f(wx)}" cy="${f(wy)}" r="${f(s * 0.38)}" fill="none" stroke="${INK}" stroke-width="${f(s * 0.07 + 3)}"/><circle cx="${f(wx)}" cy="${f(wy)}" r="${f(s * 0.38)}" fill="none" stroke="#5a4632" stroke-width="${f(s * 0.06)}"/>` + [0, 1, 2].map(i => `<path d="M${f(wx + Math.cos(i * 1.05) * s * 0.36)} ${f(wy + Math.sin(i * 1.05) * s * 0.36)} L${f(wx - Math.cos(i * 1.05) * s * 0.36)} ${f(wy - Math.sin(i * 1.05) * s * 0.36)}" stroke="${INK}" stroke-width="4"/>`).join('') + `<circle cx="${f(wx)}" cy="${f(wy)}" r="${f(s * 0.07)}" fill="#3a2a1a" stroke="${INK}" stroke-width="2"/>`);
    sack(3.05, Z + 0.1, 0.62); sack(3.55, Z + 0.05, 0.62);
    a.raw(seg([2.45, 0.62, Z], [2.45, 1.5, Z], INK, 5) + seg([2.45, 0.62, Z], [2.45, 1.5, Z], TIMBER, 3) + seg([2.45, 1.46, Z], [2.25, 1.46, Z], INK, 5) + seg([2.45, 1.46, Z], [2.25, 1.46, Z], TIMBER, 3) + lantern(...P(2.25, 1.3, Z - 0.05), 26, [2.25, 1.3, Z - 0.05, 0.25, 2.8]));
    a.raw(seg([2.5, 0.62, Z], [2.05, 0.0, Z - 0.05], INK, s * 0.07 + 2) + seg([2.5, 0.62, Z], [2.05, 0.0, Z - 0.05], TIMBER, s * 0.05));
  }
  for (let i = 0; i < 26; i++) { const X = -5.5 + R() * 11, Z = 3.1 + R() * 2.2, [x, y] = P(X, 0, Z), s = K(Z), ang = R() * 3.14; a.raw(`<path d="M${f(x)} ${f(y)} l${f(Math.cos(ang) * s * 0.25)} ${f(Math.sin(ang) * s * 0.05)}" stroke="#b8a46a" stroke-width="${f(Math.max(1, s * 0.012))}" opacity="0.7"/>`); }
  { const Z = 3.5, X = -3.6, s = K(Z), [x, y] = P(X, 0, Z); a.raw(`<ellipse cx="${f(x + s * 0.05)}" cy="${f(y)}" rx="${f(s * 0.3)}" ry="${f(s * 0.05)}" fill="#0e0b08" opacity="0.5"/>`); a.shape({ d: `M${f(x - s * 0.2)} ${f(y - s * 0.3)} L${f(x + s * 0.2)} ${f(y - s * 0.34)} L${f(x + s * 0.24)} ${f(y)} L${f(x - s * 0.18)} ${f(y + s * 0.02)} Z`, fill: '#5a4632', tex: 'url(#grain)', texOp: 0.5, depth: 8, ink: 1.6, transform: '', lines: [{ d: `M${f(x - s * 0.19)} ${f(y - s * 0.22)} L${f(x + s * 0.21)} ${f(y - s * 0.25)}`, w: 3, col: '#2a2622' }, { d: `M${f(x - s * 0.18)} ${f(y - s * 0.06)} L${f(x + s * 0.23)} ${f(y - s * 0.07)}`, w: 3, col: '#2a2622' }], mottle: 0.4, grime: 0.6 }); a.raw(`<ellipse cx="${f(x)}" cy="${f(y - s * 0.32)}" rx="${f(s * 0.2)}" ry="${f(s * 0.04)}" fill="#1a140e" stroke="${INK}" stroke-width="1.4"/>`); }
  { const Z = 3.4, X = 3.9, s = K(Z), [x, y] = P(X, 0, Z); a.raw(`<path d="M${f(x - s * 0.2)} ${f(y - 2)} c${f(s * 0.1)} ${f(-s * 0.12)} ${f(s * 0.3)} ${f(-s * 0.12)} ${f(s * 0.4)} ${f(-s * 0.02)} l${f(s * 0.12)} ${f(-s * 0.02)} l${f(-s * 0.08)} ${f(s * 0.06)} c${f(-s * 0.1)} ${f(s * 0.06)} ${f(-s * 0.3)} ${f(s * 0.06)} ${f(-s * 0.44)} ${f(s * 0.02)} Z" fill="#100c0a"/><path d="M${f(x)} ${f(y - s * 0.05)} l${f(-s * 0.04)} ${f(-s * 0.12)} l${f(-s * 0.03)} ${f(s * 0.02)} M${f(x + s * 0.06)} ${f(y - s * 0.05)} l${f(s * 0.01)} ${f(-s * 0.13)}" stroke="#100c0a" stroke-width="2"/>` + a.stain(x, y, s * 0.08, G.blood, 0.4)); }
  // stray stones and a puddle at the very front
  for (const [X, Z] of [[-1.6, 3.3], [2.2, 3.6], [-4.8, 4.4], [5.2, 4.0]]) { const [x, y] = P(X, 0, Z), s = K(Z); a.raw(`<path d="${blob(x, y - s * 0.04, s * 0.09, R, 7, 0.3)}" fill="${mix(STONE, '#1a1410', R() * 0.3)}" stroke="${INK}" stroke-width="1.4"/>`); }
  // falling ash, vignette and dusk grade: screen effects, outside the lighting (class glow keeps them out of the lit passes)
  a.raw('<g class="glow">');
  a.raw(Array.from({ length: 220 }, () => { const x = R() * W, y = R() * H, r = 0.6 + R() * 1.6; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#d8d4ca" opacity="${f(0.15 + R() * 0.35)}"/>`; }).join(''));
  // vignette: darken the corners and the top, keep the centre warm
  a.raw(`<radialGradient id="vg" cx="0.5" cy="0.58" r="0.78"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0806" stop-opacity="0.7"/></radialGradient><rect width="${W}" height="${H}" fill="url(#vg)"/>`);
  a.raw(`<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1820" stop-opacity="0.3"/><stop offset="0.45" stop-color="#1a1820" stop-opacity="0"/></linearGradient><rect width="${W}" height="${H}" fill="url(#dusk)"/>`);
  a.raw('</g>');
}

a.raw('</g>');
// ------------------------------------------------------------------ party anchors: feet positions and scale for 1.85 m heroes, nearest drawn last
const PARTY = [[-2.0, 4.7], [2.2, 4.8], [1.75, 7.5], [-2.45, 7.35]].map(([X, Z], i) => ({ slot: i, feet: P(X, 0, Z).map(f), height_px: f(K(Z) * 1.85), z: Z }));
// clicking any of the company opens the company screen: roster, selection, loadout (one hotspot per slot plus the fire ring)
PARTY.forEach(p => { const [x, y] = p.feet, h = p.height_px, w = h * 0.36; HOT['company_' + p.slot] = { label: 'The company', action: 'company', slot: p.slot, poly: [[x - w, y + 8], [x + w, y + 8], [x + w * 0.8, y - h * 1.02], [x - w * 0.8, y - h * 1.02]].map(q => q.map(f)) }; });
{ const [x, y] = P(CROSS[0], 0, CROSS[1] - 1.15), s = K(CROSS[1] - 1.15); HOT.company_cross = { label: 'The company', action: 'company', poly: [[x - s * 1.2, y + s * 0.1], [x + s * 1.2, y + s * 0.1], [x + s * 0.6, y - s * 2.3], [x - s * 0.6, y - s * 2.3]].map(q => q.map(f)) }; }
fs.writeFileSync('grim/hub/garth_hotspots.json', JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: E, focal_px: FL }, hotspots: HOT, party: PARTY, monument: { feet: P(CROSS[0], 0, CROSS[1] - 1.15).map(f), z: CROSS[1] - 1.15, layer: 'monument' }, brazier: P(BRAZIER[0], 1.0, BRAZIER[1]).map(f),
  draw_order: 'bg, party slots with z > monument.z, monument, party slots with z < monument.z, light (additive), fg' }, null, 1));
a.writeRig('grim/hub/garth', {});
fs.writeFileSync('grim/hub/garth.light.json', JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: E, focal_px: FL, cx: CX }, planes: PLANES, lights: LIGHTS }));
console.log('ok', Object.keys(HOT).join(','));
