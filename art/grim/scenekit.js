// Scene kit: the garth's builders bound to any one-point camera, for the abbey interiors and later scenes.
// Same tagging rules as the garth (planes, prop depths, emissive, glow) so the lighting model and hover outlines work unchanged.
const { Art, G, INK, smooth, poly, blob } = require('../gr');
const { dressing, mix, dark, light } = require('./kit');
const f = n => +(+n).toFixed(1);
module.exports = (cfg) => {
const { W = 1600, H = 1000, HZ, E, FL, CX = 800, seed = 7 } = cfg;
const a = new Art(W, H, seed).useGrain(), D = dressing(a), R = a.R;
a.defs.push(`<linearGradient id="bshade" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#fff2dc" stop-opacity="0.16"/><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></linearGradient>`,
  `<linearGradient id="fshade" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="#fff2dc" stop-opacity="0.12"/><stop offset="0.5" stop-color="#000" stop-opacity="0.04"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/></linearGradient>`,
  `<radialGradient id="aoshade" cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>`);
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
        const tone = miss ? dark(col, 0.8) : mix(col, R() < 0.4 ? '#a89a80' : '#120e0a', R() * (o.vary === undefined ? 0.34 : o.vary));
        const jit = () => (R() - 0.5) * 0.07;
        const q = [at(s0 + g + jit(), t + g + jit() * 0.5), at(s1 - g + jit(), t + g * 1.6 + jit() * 0.5), at(s1 - g + jit(), t + h - g + jit() * 0.5), at(s0 + g + jit(), t + h - g + jit() * 0.5)];
        const qs = q.map(p => P(...p)), d = chip(qs), Zb = at(s0, t)[2], kz = K(Zb), bw2 = Math.abs(qs[1][0] - qs[0][0]), bh2 = Math.abs(qs[3][1] - qs[0][1]);
        out += `<path d="${d}" fill="${tone}" stroke="${INK}" stroke-width="${f(inkAt(Zb) * 0.5)}" stroke-linejoin="round"/>`;
        if (!miss) {
          out += `<path d="${d}" fill="url(#bshade)"/>`;
          // the stone's own face: a few pits, a vein or two, a darker bed where it weathered
          if (bw2 > 6 && bh2 > 4) {
            const cx = (qs[0][0] + qs[2][0]) / 2, cy = (qs[0][1] + qs[2][1]) / 2;
            for (let i = 0; i < Math.floor(R() * 3); i++) { const px = cx + (R() - 0.5) * bw2 * 0.8, py = cy + (R() - 0.5) * bh2 * 0.7, r = Math.max(0.4, Math.min(2.2, kz * (0.002 + R() * 0.005))); out += `<path d="${blob(px, py, r, R, 5, 0.6)}" fill="#0a0806" opacity="${f(0.25 + R() * 0.3)}"/>`; }
            if (R() < 0.5) { const px = cx + (R() - 0.5) * bw2 * 0.6, py = cy + (R() - 0.5) * bh2 * 0.5; out += `<path d="M${f(px)} ${f(py)} l${f(bw2 * (0.05 + R() * 0.15))} ${f((R() - 0.5) * bh2 * 0.2)}" stroke="#0a0806" stroke-width="0.5" opacity="0.45"/>`; }
            if (R() < 0.35) out += `<path d="M${f(cx - bw2 * 0.4)} ${f(cy + (R() - 0.5) * bh2 * 0.4)} q${f(bw2 * 0.2)} ${f((R() - 0.5) * bh2 * 0.5)} ${f(bw2 * 0.45)} ${f((R() - 0.5) * bh2 * 0.3)}" stroke="#0a0806" stroke-width="0.6" fill="none" opacity="0.5"/>`;
            if (R() < 0.2) out += `<path d="${blob(cx + (R() - 0.5) * bw2 * 0.5, cy + bh2 * 0.15, Math.min(bw2, bh2) * 0.3, R, 8, 0.3)}" fill="#0a0806" opacity="0.1"/>`;
          }
          if (R() < 0.5) out += seg(at(s0 + g * 3, t + h - g * 3), at(s1 - g * 4, t + h - g * 3), '#f0e0c0', 0.8, 0.14);
          if (R() < 0.55) out += seg(at(s0 + g * 3, t + g * 3), at(s1 - g * 3, t + g * 3), INK, 1.4, 0.35);
          if (R() < 0.1) { const m = s0 + (s1 - s0) * (0.3 + R() * 0.4); out += `<path d="M${P(...at(m, t + h)).map(f).join(' ')} L${P(...at(m + 0.08, t + h * 0.5)).map(f).join(' ')} L${P(...at(m - 0.04, t)).map(f).join(' ')}" stroke="${INK}" stroke-width="0.9" fill="none"/>`; }
          // damp and moss creeping up the lowest courses
          if (o.damp !== false && t < 0.5 && R() < 0.4) out += `<path d="${d}" fill="${R() < 0.5 ? '#1e2416' : '#14100c'}" opacity="${f(0.25 + R() * 0.25)}"/>`;
        }
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
  return a.shape(Object.assign({ d: pp(pts3), fill: 'rgba(0,0,0,0)', depth: 14, hatch: 70, grime: 0.35, hlOp: 0.08, ink: 1.4, wash: 0.3 }, o, { mottle: 0 }));
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
function barrel(X, Z, Y = 0, bo = {}) {
  // an upright barrel: staves each their own tone, a belly, iron hoops with rust, a lid of boards; shaded as a cylinder
  const s = K(Z), [x, y] = P(X, Y, Z), w = s * (bo.w || (0.3 + R() * 0.05)), h = s * (bo.h || (0.8 + R() * 0.1)), b = w * 0.16, ry = s * 0.06;
  const col = ['#5a4430', '#4a3624', '#6a5038', '#3e2e20'][Math.floor(R() * 4)];
  const body = `M${f(x - w)} ${f(y)} C${f(x - w - b * 1.4)} ${f(y - h * 0.4)} ${f(x - w - b * 1.4)} ${f(y - h * 0.6)} ${f(x - w)} ${f(y - h)} L${f(x + w)} ${f(y - h)} C${f(x + w + b * 1.4)} ${f(y - h * 0.6)} ${f(x + w + b * 1.4)} ${f(y - h * 0.4)} ${f(x + w)} ${f(y)} Q${f(x)} ${f(y + ry)} ${f(x - w)} ${f(y)} Z`;
  const cid = a.id('brl'), gid = a.id('brg'), hid = a.id('brh');
  let o = `<clipPath id="${cid}"><path d="${body}"/></clipPath><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="0.35" stop-color="#fff4e0" stop-opacity="0.12"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.65"/></linearGradient>` +
    `<linearGradient id="${hid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1816"/><stop offset="0.35" stop-color="#6a6660"/><stop offset="1" stop-color="#141210"/></linearGradient>`;
  o += `<path d="${body}" fill="${col}"/><g clip-path="url(#${cid})">`;
  const n = 7;
  for (let k = 0; k < n; k++) { const t0 = -1 + 2 * k / n, t1 = -1 + 2 * (k + 1) / n, xa = x + w * 1.1 * Math.sin(t0 * Math.PI / 2), xb = x + w * 1.1 * Math.sin(t1 * Math.PI / 2), tone = mix(col, R() < 0.5 ? '#a88a62' : '#120c08', R() * 0.32);
    o += `<path d="M${f(xa)} ${f(y + ry)} Q${f(xa + (xa - x) * 0.16)} ${f(y - h / 2)} ${f(xa)} ${f(y - h)} L${f(xb)} ${f(y - h)} Q${f(xb + (xb - x) * 0.16)} ${f(y - h / 2)} ${f(xb)} ${f(y + ry)} Z" fill="${tone}" stroke="${INK}" stroke-width="0.9"/>`;
    for (let g = 0; g < 2; g++) { const gx = xa + (xb - xa) * (0.3 + g * 0.4); o += `<path d="M${f(gx)} ${f(y - h * 0.05)} q${f((R() - 0.5) * 3)} ${f(-h * 0.45)} ${f((R() - 0.5) * 2)} ${f(-h * 0.9)}" stroke="${dark(tone, 0.4)}" stroke-width="0.7" fill="none" opacity="0.6"/>`; } }
  o += `<path d="${body}" fill="url(#${gid})"/><path d="${body}" fill="url(#grime)" opacity="0.45"/>` + a.stain(x + (R() - 0.5) * w, y - h * 0.15, w * 0.6, '#0a0604', 0.5);
  for (const t of [0.1, 0.32, 0.68, 0.9]) { const yy = y - h * t, bw = w + b * Math.sin(t * Math.PI) * 1.05; o += `<path d="M${f(x - bw)} ${f(yy - s * 0.02)} Q${f(x)} ${f(yy + ry - s * 0.02)} ${f(x + bw)} ${f(yy - s * 0.02)} L${f(x + bw)} ${f(yy + s * 0.02)} Q${f(x)} ${f(yy + ry + s * 0.02)} ${f(x - bw)} ${f(yy + s * 0.02)} Z" fill="url(#${hid})" stroke="${INK}" stroke-width="1.1"/>`;
    if (R() < 0.6) o += `<ellipse cx="${f(x + (R() - 0.5) * bw * 1.4)}" cy="${f(yy + ry * 0.6)}" rx="${f(s * 0.03)}" ry="${f(s * 0.015)}" fill="#4a2410" opacity="0.45"/>`; }
  o += `</g><path d="${body}" fill="none" stroke="${INK}" stroke-width="${f(inkAt(Z) * 1.2)}"/>`;
  if (bo.open) { o += `<path d="M${f(x - w)} ${f(y - h)} Q${f(x)} ${f(y - h + ry * 2)} ${f(x + w)} ${f(y - h)}" fill="none" stroke="${INK}" stroke-width="${f(inkAt(Z) * 1.4)}"/><path d="M${f(x - w * 0.95)} ${f(y - h + 2)} Q${f(x)} ${f(y - h + ry * 2)} ${f(x + w * 0.95)} ${f(y - h + 2)}" fill="none" stroke="${light(col, 0.2)}" stroke-width="2"/>`; a.raw(o); return; }
  o += `<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w)}" ry="${f(ry)}" fill="${dark(col, 0.2)}" stroke="${INK}" stroke-width="${f(inkAt(Z))}"/>`;
  for (const d of [-0.35, 0.05, 0.4]) o += `<path d="M${f(x + w * d)} ${f(y - h - ry * Math.sqrt(1 - d * d) * 0.95)} L${f(x + w * d)} ${f(y - h + ry * Math.sqrt(1 - d * d) * 0.95)}" stroke="${INK}" stroke-width="0.9" opacity="0.7"/>`;
  a.raw(o);
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
return { a, D, R, P, K, pp, inkAt, seg, HOT, PLANES, LIGHTS, planeId, PLW, EM, addLight, arcPts, stoneTrace, outline, hot, stones, stones0, chip, render, bloom, creeper, shade, shade0, planks, planks0, archPts, archRing, archRing0, litHole, throughAll, through, windowOn, roof, roof0, folk, folkBody, barrel, crate, sack, crow, flying, fireTongues, smoke, lantern, torch, candles, SKY, STONE, STONE2, TIMBER, TIMBERD, SLATE, MUD, GRASS, FLAG, WARM, GLOW, CLOTH, SAIL };
};
