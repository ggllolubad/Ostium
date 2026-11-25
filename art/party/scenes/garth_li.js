// The cloister garth at dusk, in Living Ink. A port of grim/garth.js (geometry, camera, layers, lights, hotspots, rig and
// party anchors unchanged) onto the Living Ink scene kit (scenes/lik.js): rough coursed rubble instead of block walls, slate
// and board cels, folk drawn with the figure engine, the keepers (Brother Fenn at the dole window, the Hosteller in the
// guesthouse door) swapped for the reviewed Living Ink keepers, value graded by zone hatching toward the real lights.
// Lore (2026-11-23): the abbey church has no bell. The bell-frame on the tower stump stands EMPTY: open chamber, the bare
// headstock beam with its two empty iron straps, crows on it. Gold only on the gable cross. Red only for blood and rubric.
// Usage: node scenes/garth_li.js [outDir]   (default out/scenes/hub/garth). Writes garth__{bg,monument,light,fg}.svg,
// garth.svg, garth.rig.json, garth.light.json, garth_hotspots.json (the grim/hub names and formats).
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('../engine');
const PR = require('./props_li');
const MV2 = require('./materials_v2');
const { ell, mix } = E;
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'garth');
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 1000, HZ = 300, EYE = 3.0, FL = 760, CX = 800;
const S = require('./lik')({ W, H, HZ, E: EYE, FL, CX, seed: 1209, keyTint: '#efe6d2', shadowTint: '#1e1c26', wob: { f: 0.07, s: 1.1 }, gritF: 1.1, minInk: 0.8, minHeavy: 1.3, minBand: 1.0, lightGain: 1.0 });
const { P, K, sc, UM, pp, p2, f1, INK, raw, layer, PLW, EM, cel, chip, hatch3, planeShade, normalOf, lam, HOT, PLANES, LIGHTS, addLight, R, figProp, glow, slot, zoneHatch, gradeDk, stain, ashlar, boards, smooth } = S;
const f = n => +(+n).toFixed(1);                       // grim's rounding, for every number in the hotspot file
const E3 = EYE;
const sub3 = S.sub3, cross3 = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const inkAt = Z => Math.min(3.2, 1.0 + K(Z) / 60);
const dark = (c, t = 0.3) => mix(c, '#140d08', t), light = (c, t = 0.3) => mix(c, '#f4ead0', t);
const HOTF = (id, label, pts) => { HOT[id] = { label, poly: pts.map(p => [f(p[0]), f(p[1])]) }; };
const outline = (id, polys) => { HOT[id].outline = polys.map(([pts, closed]) => ({ closed: !!closed, pts: pts.map(p => p.map(v => +v.toFixed(3))) })); };
const CROSS = [0, 6.6], BRAZIER = [-1.1, 5.3], sackLater = [];
const G = { blood: '#6a1410', bloodD: '#4a0e0a', redD: '#5a1612', rust: '#5a2a14', gold: '#a8873e', steelD: '#4a4e52' };

// palette: the Grey outside is colourless; warmth only from fire and candle
const SKY = '#9c9a94', STONE = '#5f584e', STONE2 = '#6a6256', TIMBER = '#463626', TIMBERD = '#2e241a', SLATE = '#3e3b38',
  MUD = '#3c342a', GRASS = '#4c4a33', FLAG = '#666052', GLOWC = '#ff9a3a', CLOTH = '#8f8670', SAIL = '#a29a84';

// ================================================================== builders (grim's names and arguments, Living Ink drawing)
const seg = (p, q, col = INK, w = 1, op = 1) => { const A = P(...p), B = P(...q); return `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${col}" stroke-width="${f1(w)}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`; };
// a timber or iron member between two world points: a cel strip wpx wide on screen (lit edge, shadow band, heavy ink)
function beam(p, q, wpx, col, o = {}) {
  const A = P(...p), B = P(...q), dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * wpx / 2, ny = dx / L * wpx / 2;
  const Z = (p[2] + q[2]) / 2;
  return cel([[A[0] + nx, A[1] + ny], [B[0] + nx, B[1] + ny], [B[0] - nx, B[1] - ny], [A[0] - nx, A[1] - ny]], { Z, fill: col, band: Math.max(0.8, wpx * 0.3), tex: o.tex, texOp: 0.4 });
}
// bilinear face from four corners [p0 (0,0), p1 (Ls,0), p2 (Ls,Lt), p3 (0,Lt)]
const quad = q => { const Ls = Math.hypot(...sub3(q[1], q[0])), Lt = Math.hypot(...sub3(q[3], q[0])); return [(s, t) => { const u = s / Ls, v = t / Lt; return [0, 1, 2].map(i => q[0][i] + (q[1][i] - q[0][i]) * u + (q[3][i] - q[0][i]) * v + (q[0][i] - q[1][i] + q[2][i] - q[3][i]) * u * v); }, Ls, Lt]; };
let gid = 0;
// value grading of a face toward the real lights: zone hatching, filled at write time once every light is known.
// The Grey gives a dull ambient, so the light term is gentler than indoors (lw), shadow-side faces carry a bias.
function grade(at, Ls, Lt, pts3, go = {}) {
  const k = `g${gid++}`;
  slot(k, () => PLW(pts3, zoneHatch(at, Ls, Lt, gradeDk(at, Object.assign({ lw: 0.72 }, go)), go.zh || {})));
}
// stone: random rubble laid roughly to course (never regular brick). Every stone its own shape (a rounded, squashed
// superellipse: field stones near round, split stones near square), its own height inside the course, the joints left by
// their misfit packed with mortar and pinning slips; the corners of the wall dressed with long-and-short quoins.
function rubbleWall(at, Ls, Lt, col, o = {}) {
  const course = o.course || 0.46, Zm = at(Ls / 2, 0)[2];
  const WX = MV2(S).begin(at, Ls, Lt, o.wx), jointC = mix(col, INK, 0.62);   // materials v2: weathered stone (own random stream)
  let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, 0.62)}"/><path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="url(#mottle)" opacity="0.4"/>`;
  const stone = (s0, s1, t0, t1, round, tn) => {
    const cs = (s0 + s1) / 2, ct = (t0 + t1) / 2, a = (s1 - s0) / 2, b = (t1 - t0) / 2, n = round, N = 16, ph = R() * 6.28, pts = [];
    for (let k = 0; k < N; k++) {
      const th = k / N * Math.PI * 2 + 0.2, c = Math.cos(th), sn = Math.sin(th), m = 1 + (R() - 0.5) * 0.12 + 0.05 * Math.sin(th * 2 + ph);
      const ss = Math.min(Ls, Math.max(0, cs + a * m * Math.sign(c) * Math.abs(c) ** (2 / n))), tt = Math.min(Lt, Math.max(0, ct + b * m * Math.sign(sn) * Math.abs(sn) ** (2 / n)));
      pts.push(P(...at(ss, tt)));
    }
    const Zb = at(cs, ct)[2];
    out += cel(pts, { Z: Zb, fill: tn, band: Math.max(0.8, Math.min(K(Zb) * 0.05, (P(...at(cs, t1))[1] - P(...at(cs, t0))[1]) * -0.3)), tex: 'url(#mottle)', texOp: 0.35 });
    WX.stone(pts, Zb, tn, [at(s0, t0), at(s1, t0), at(s1, t1), at(s0, t1)], { joint: jointC, thin: (t1 - t0) < course * 0.4 });
    const ps = pts, bw = Math.abs(ps[0][0] - ps[N / 2][0]), bh = Math.abs(ps[N / 4][1] - ps[3 * N / 4][1]);
    if (bw > 7 && bh > 4) { for (let i = 0; i < Math.floor(R() * 3); i++) { const p = P(...at(cs + (R() - 0.5) * a, ct + (R() - 0.5) * b)); out += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(0.5 + R() * Math.min(1.6, bw * 0.02))}" fill="${INK}" opacity="0.45"/>`; }
      if (R() < 0.1) out += S.crack(at, cs, ct + b * 0.6, b * 1.2, -Math.PI / 2 + (R() - 0.5), { w: 0.6, branch: 0 }); }
  };
  let t = 0;
  while (t < Lt - 0.02) {
    const h = Math.min(Lt - t, course * (0.6 + R() * 0.75));
    let s = -R() * course;
    while (s < Ls) {
      const w = h * (0.9 + R() * 1.9) * (o.block || 0.95) / 0.95, g = 0.03 + R() * 0.03;
      const s0 = s + g, s1 = s + w - g;
      if (s1 - s0 > 0.05 && !(o.skip && o.skip(Math.max(0, s), Math.min(Ls, s + w), t, t + h))) {
        const tn = mix(o.holes && R() < o.holes ? dark(col, 0.7) : col, R() < 0.45 ? '#cfc2a4' : '#120e0a', R() * 0.32);
        if (R() < 0.16 && h > course * 0.7) { // two thin stones packed one over the other, a slip wedged at the end
          const m = t + h * (0.4 + R() * 0.2); stone(s0, s1, t + g, m - g * 0.5, 3 + R() * 2, tn); stone(s0 + R() * w * 0.1, s1 - R() * w * 0.15, m + g * 0.5, t + h - g, 3 + R() * 2, mix(tn, '#120e0a', 0.08));
        } else {
          const hh = h * (0.72 + R() * 0.26), t0 = t + (h - hh) * R() * 0.6 + g, round = R() < 0.3 ? 2.2 + R() * 0.8 : 3.2 + R() * 3;
          stone(s0, s1, t0, t0 + hh - g * 2, round, tn);
          if (hh < h * 0.82 && R() < 0.6) { const sp = s0 + (s1 - s0) * (0.2 + R() * 0.5), sw = Math.min(0.22, (s1 - s0) * 0.35); stone(sp, sp + sw, t0 + hh - g, t + h - g * 0.5, 2.5, mix(o.slip || '#4e4a44', '#120e0a', R() * 0.3)); }
        }
      }
      s += w;
    }
    t += h;
  }
  // dressed quoins at the wall's ends: long and short, alternating, squarer and paler than the rubble
  for (const end of o.quoins || []) {
    let tq = 0, k = 0;
    while (tq < Lt - 0.05) { const h = Math.min(Lt - tq, 0.36 + R() * 0.08), w = k % 2 ? 0.45 : 0.75, s0 = end ? Ls - w : 0, s1 = end ? Ls : w;
      const q = [at(s0 + 0.02, tq + 0.02), at(s1 - 0.02, tq + 0.02), at(s1 - 0.02, tq + h - 0.02), at(s0 + 0.02, tq + h - 0.02)];
      out += cel(chip(q.map(p => P(...p)), 0.3), { Z: Zm, fill: mix(light(col, 0.1), R() < 0.5 ? '#cfc2a4' : '#120e0a', R() * 0.2), band: Math.max(0.8, K(Zm) * 0.04), tex: 'url(#mottle)', texOp: 0.35 });
      tq += h; k++; }
  }
  return out + WX.end();
}
function stones(at, Ls, Lt, col, o = {}) {
  const n = normalOf(at(0, 0), at(Ls, 0), at(0, Lt));
  const c = lam(n) < 0.05 ? mix(col, S.SHT, 0.25) : col;
  let s = rubbleWall(at, Ls, Lt, c, o);
  // rubble infill: patches where the wall fell and was packed with field stone
  for (let i = 0; i < (o.rubble || 0); i++) {
    const rs = R() * Ls * 0.85, rt = R() * Lt * 0.8, rw = 0.8 + R() * 1.6, rh = 0.5 + R() * 1.2, Z = at(rs, 0)[2];
    s += `<path d="${pp([at(rs, rt), at(Math.min(Ls, rs + rw), rt), at(Math.min(Ls, rs + rw), Math.min(Lt, rt + rh)), at(rs, Math.min(Lt, rt + rh))])}" fill="${dark(col, 0.6)}"/>`;
    for (let k = 0; k < 16; k++) { const cc = P(...at(rs + R() * rw * 0.95, rt + R() * rh * 0.95)), r = K(Z) * (0.06 + R() * 0.07), pts = ell(cc, r * (1 + R() * 0.4), r * 0.75, R() * 3, 7).map(p => [p[0] + (R() - 0.5) * r * 0.3, p[1] + (R() - 0.5) * r * 0.3]);
      s += cel(pts, { Z, fill: mix(col, R() < 0.5 ? '#c8bca0' : '#120e0a', R() * 0.35), band: Math.max(0.8, r * 0.3) }); }
  }
  // water streaks down from the eaves: narrow runs of hatching laid in the wall
  for (let i = 0; i < (o.streaks || 0); i++) { const s0 = R() * Ls, w = 0.08 + R() * 0.25, t0 = Lt * (0.15 + R() * 0.6); s += hatch3(at, s0, Math.min(Ls, s0 + w), t0, Lt, Math.PI / 2 + 0.05, { op: 0.3 + R() * 0.15, ragged: 0.25 }); }
  s += planeShade(at, Ls, Lt, n, { op: 0.4 });
  return PLW([at(0, 0), at(Ls, 0), at(0, Lt)], s);
}
// lime render surviving in patches over the stone, flaking at the edges
function render(at, Ls, Lt, n, col = '#6e675a') { let o = ''; for (let i = 0; i < n; i++) o += S.patch(at, R() * Ls, 0.4 + R() * (Lt * 0.8), 0.5 + R() * 1.1, 0.3 + R() * 0.7, mix(col, R() < 0.5 ? '#a89e88' : '#2a2218', R() * 0.22), { op: 0.85 }); return o; }
// damp and soot blooms: overlapping irregular stains (no gradients)
function bloom(x, y, r, col = '#0e0a08', op = 0.4, up = 0) { let o = ''; for (let i = 0; i < 3; i++) o += stain(x + (R() - 0.5) * r * 0.4, y - up * i * r * 0.5, r * (1 - i * 0.2), col, op * (1 - i * 0.2)); return o; }
// dead creeper: a wandering stem with side shoots and a few leaves left
function creeper(x, y, len, s, up = -1) {
  let o = '', cx = x, cy = y, d = `M${f1(x)} ${f1(y)}`;
  for (let i = 0; i < 14; i++) {
    const nx = cx + (R() - 0.5) * s * 0.5, ny = cy + up * len / 14;
    d += ` Q${f1(cx + (R() - 0.5) * s * 0.4)} ${f1((cy + ny) / 2)} ${f1(nx)} ${f1(ny)}`;
    if (R() < 0.6) { const bx = nx + (R() - 0.5) * s * 1.2, by = ny + up * R() * s * 0.4; o += `<path d="M${f1(nx)} ${f1(ny)} Q${f1((nx + bx) / 2)} ${f1(ny + up * s * 0.2)} ${f1(bx)} ${f1(by)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.03))}" fill="none"/>`; if (R() < 0.6) o += `<path d="${smooth(ell([bx, by], Math.max(1.4, s * 0.07), Math.max(1, s * 0.05), R() * 3, 6), true, 0.6)}" fill="${R() < 0.5 ? '#3e4626' : '#5a4a2a'}" stroke="${INK}" stroke-width="0.6"/>`; }
    cx = nx; cy = ny;
  }
  return `<path d="${d}" stroke="#1a1610" stroke-width="${f1(Math.max(1, s * 0.05))}" fill="none" stroke-linecap="round"/>` + o;
}
// a face's value grading (grim called this the shading pass; the stones already carry their key-light hatch)
function shade(pts3, o = {}) {
  const q = pts3.length === 4 ? pts3 : [pts3[0], pts3[1], pts3[2], pts3[pts3.length - 1]];
  const [at, Ls, Lt] = quad(q);
  const n = normalOf(q[0], q[1], q[3]);
  grade(at, Ls, Lt, [q[0], q[1], q[3]], { bias: (o.bias || 0) + (lam(n) < 0.05 ? 0.12 : 0), front: o.front });
}
// boards on at(s,t): grim's planks run along t unless o.across (lik's boards run along s, so swap)
function planks(at, Ls, Lt, col, o = {}) {
  const bw = o.board || 0.26;
  const s = o.across ? boards(at, Ls, Lt, col, { bw, segs: 1, knots: 0.25, nails: o.nails ? undefined : false, chipEnds: true })
    : boards((u, v) => at(v, u), Lt, Ls, col, { bw, segs: 1, knots: 0.25, nails: o.nails ? undefined : false, chipEnds: true });
  const n = normalOf(at(0, 0), at(Ls, 0), at(0, Lt));
  return PLW([at(0, 0), at(Ls, 0), at(0, Lt)], s + planeShade(at, Ls, Lt, n, { op: 0.36 }));
}
// round-arched opening on a face, as 3D points (grim's, unchanged)
function archPts(at, s0, s1, t0, ts, rise, n = 10) {
  const pts = [at(s0, t0), at(s1, t0), at(s1, ts)];
  for (let i = 1; i < n; i++) { const th = Math.PI * i / n, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2; pts.push(at(sm + Math.cos(th) * rw, ts + Math.sin(th) * rise)); }
  pts.push(at(s0, ts));
  return pts;
}
const arcPts = (at, s0, s1, ts, rise, n = 14) => { const sm = (s0 + s1) / 2, rw = (s1 - s0) / 2, o = []; for (let i = 0; i <= n; i++) { const th = Math.PI * (1 - i / n); o.push(at(sm + Math.cos(th) * rw, ts + Math.sin(th) * rise)); } return o; };
function stoneTrace(at, s0, s1, ts, rise, dep, nrm, base = 0, step = true, square = false) {
  const A = at(s0 - dep, base), B = at(s1 + dep, base);
  const head = square ? [at(s0 - dep, ts + dep), at(s1 + dep, ts + dep)] : arcPts(at, s0 - dep, s1 + dep, ts, rise + dep);
  const out = [[[A, ...head, B]]];
  if (step) { const a = at(s0 - dep - 0.12, base), b = at(s1 + dep + 0.12, base), up = (p, k) => [p[0] + nrm[0] * k, p[1] + 0.14, p[2] + nrm[2] * k];
    out.push([[up(a, 0), up(a, 0.4), up(b, 0.4), up(b, 0)]]); }
  return out;
}
// the ring of wedge stones round an arch: each voussoir its own cel, the keystone a shade lighter
function archRing(at, s0, s1, ts, rise, dep, col, n = 9) {
  let out = ''; const sm = (s0 + s1) / 2, rw = (s1 - s0) / 2;
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI * i / n, t1 = Math.PI * (i + 1) / n, Q = (t, k) => at(sm + Math.cos(t) * (rw + k), ts + Math.sin(t) * (rise + k));
    const q = [Q(t0, 0), Q(t1, 0), Q(t1, dep), Q(t0, dep)];
    out += cel(chip(q.map(p => P(...p)), 0.3), { Z: q[0][2], fill: mix(col, R() < 0.5 ? '#d8cbb0' : '#1a1410', R() * 0.22 + (i === (n >> 1) ? 0.12 : 0)), band: Math.max(0.8, K(q[0][2]) * 0.03) });
  }
  return PLW([at(0, 0), at(1, 0), at(0, 1)], out);
}
// a lit opening: warm interior in stepped bands (no gradient), a soot plume over it in hatching, its light (grim's formula)
function litHole(pts3, Z, o = {}) {
  const ps = pts3.map(p => P(...p)), cx = ps.reduce((s, p) => s + p[0], 0) / ps.length, cy = ps.reduce((s, p) => s + p[1], 0) / ps.length;
  const ys = ps.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), xs = ps.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const top = o.top || '#6a3a18', bot = o.bot || '#f0a048', cid = S.id('lh');
  let band = `<clipPath id="${cid}"><path d="${p2(ps)}"/></clipPath><path d="${p2(ps)}" fill="${mix(top, bot, 0.5)}"/><g clip-path="url(#${cid})">`;
  const N = 4; for (let i = 0; i < N; i++) { const t = i / N, yy = y0 + (y1 - y0) * t; band += `<rect x="${f1(x0 - 2)}" y="${f1(yy)}" width="${f1(x1 - x0 + 4)}" height="${f1((y1 - y0) / N + 1)}" fill="${mix(top, bot, (i + 0.5) / N)}"/>`; }
  band += `</g><path d="${p2(ps)}" fill="none" stroke="${INK}" stroke-width="${f1(inkAt(Z) * 1.1)}" stroke-linejoin="round"/>`;
  raw(PLW([pts3[0], pts3[1], pts3[2]], EM(band)));
  { const pi = S.planeId(pts3[0], pts3[1], pts3[2]), n = pi >= 0 ? PLANES[pi].n : [0, 0, -1], c = pts3.reduce((s, p) => s.map((v, i) => v + p[i] / pts3.length), [0, 0, 0]);
    let area = 0; for (let i = 1; i < pts3.length - 1; i++) area += Math.hypot(...cross3(sub3(pts3[i], pts3[0]), sub3(pts3[i + 1], pts3[0]))) / 2;
    addLight(c[0] - n[0] * 0.5, c[1] - n[1] * 0.5, c[2] - n[2] * 0.5, o.I || Math.min(1.4, Math.max(0.25, area * 0.28)), o.range || Math.min(7, 2.5 + area * 0.8), o.col || [1.0, 0.58, 0.26]); }
  if (o.soot !== false) { const k = K(Z), w = (x1 - x0); let d = ''; for (let i = 0; i < 9; i++) { const x = x0 + w * (0.1 + 0.8 * R()), l = k * (0.15 + R() * 0.35); d += `M${f1(x)} ${f1(y0 - 2)} l${f1(l * 0.35)} ${f1(-l)} `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, k * 0.012))}" opacity="0.35" fill="none" stroke-linecap="round"/>`); }
  if (o.glow !== false) raw(glow(cx, cy, K(Z) * (o.r || 1.6), K(Z) * (o.r || 1.6) * 0.85, GLOWC, o.op || 0.35));
  return [cx, cy];
}
function through(pts3, fn) { S.through(pts3, fn); }
// a window: lit, dark, shuttered or boarded
function windowOn(at, s0, s1, t0, t1, kind = 'lit') {
  const Z = at((s0 + s1) / 2, 0)[2], pts = archPts(at, s0, s1, t0, t1 - (s1 - s0) * 0.5, (s1 - s0) * 0.5, 6);
  if (kind === 'lit') { litHole(pts, Z, { r: 0.9, op: 0.3, top: '#8a4a1a', bot: '#f6c070' }); raw(seg(at((s0 + s1) / 2, t0), at((s0 + s1) / 2, t1 - 0.05), INK, inkAt(Z) * 1.1) + seg(at(s0, (t0 + t1) / 2), at(s1, (t0 + t1) / 2), INK, inkAt(Z) * 0.9)); }
  else raw(PLW([pts[0], pts[1], pts[2]], `<path d="${pp(pts)}" fill="#120e0b" stroke="${INK}" stroke-width="${f1(inkAt(Z) * 1.1)}"/>` + hatch3(at, s0, s1, t0, t1, 0.8, { op: 0.35 })));
  if (kind === 'boarded') raw(planks((s, t) => at(s0 - 0.08 + s, t0 + 0.1 + t), s1 - s0 + 0.16, t1 - t0 - 0.25, '#5a4a38', { across: true, board: 0.2, nails: 4 }));
  if (kind === 'shutter') raw(planks((s, t) => at(s1 + s, t0 + t), (s1 - s0) * 0.9, t1 - t0 - 0.1, '#4a3c2c', { board: 0.14 }));
  const sill = [at(s0 - 0.06, t0 - 0.12), at(s1 + 0.06, t0 - 0.12), at(s1 + 0.1, t0), at(s0 - 0.1, t0)];
  raw(PLW([sill[0], sill[1], sill[3]], cel(sill.map(p => P(...p)), { Z, fill: STONE2, band: Math.max(0.8, K(Z) * 0.03) })));
  { const A = P(...at(s0 + 0.05, t0 - 0.12)); raw(`<path d="M${f1(A[0])} ${f1(A[1])} l0.5 ${f1(K(Z) * 0.5)}" stroke="#1a1410" stroke-width="${f1(Math.max(1, K(Z) * 0.03))}" opacity="0.45" stroke-linecap="round"/>`); }
}
// slate roof between eave e0-e1 and ridge r1-r0, sagging, each slate its own cel; missing slates, board patches, moss
function roof(e0, e1, r1, r0, col, o = {}) {
  const n = o.courses || 12, sag = o.sag === undefined ? 0.22 : o.sag;
  const L = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);
  let out = `<path d="${pp([e0, e1, r1, r0])}" fill="${mix(col, INK, 0.5)}"/>`;
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, A = L(e0, r0, t0), B = L(e1, r1, t0), A1 = L(e0, r0, t1), B1 = L(e1, r1, t1);
    const m = Math.max(4, Math.round(Math.hypot(B[0] - A[0], B[2] - A[2]) / 0.45));
    for (let j = 0; j < m; j++) {
      const u0 = (j + (i % 2) * 0.5) / m, u1 = Math.min(1, u0 + 1 / m);
      if (u0 >= 1) continue;
      const dip = (u, tt) => Math.sin(u * Math.PI) * sag * (0.3 + tt);
      const Q = (AA, BB, u, tt) => { const p = L(AA, BB, u); return [p[0], p[1] - dip(u, tt) + (R() - 0.5) * 0.03, p[2]]; };
      const q = [Q(A, B, u0, t0), Q(A, B, u1, t0), Q(A1, B1, u1, t1), Q(A1, B1, u0, t1)];
      const miss = R() < (o.holes || 0.04) * 0.35, Zq = (q[0][2] + q[2][2]) / 2;
      // the slate's butt is at the eave side (t0), its head under the course above: draw it lapped, lower edge chipped
      if (miss) out += `<path d="${pp(q)}" fill="#0e0b09" stroke="${INK}" stroke-width="${f1(Math.max(0.6, inkAt(Zq) * 0.4))}"/>`;
      else out += cel(chip(q.map(p => P(...p)), 0.25), { Z: Zq, fill: mix(col, R() < 0.5 ? '#a8a49a' : '#0e0c0a', R() * 0.22), band: Math.max(0.7, K(Zq) * 0.02), hatch: false });
    }
  }
  for (let i = 0; i < (o.moss || 4); i++) { const t = R(), u = R(), q = P(...L(L(e0, e1, u), L(r0, r1, u), t)), Z = L(L(e0, e1, u), L(r0, r1, u), t)[2], r = K(Z) * (0.3 + R() * 0.5);
    out += `<path d="${smooth(ell(q, r, r * 0.55, (R() - 0.5) * 0.4, 9).map(p => [p[0] + (R() - 0.5) * r * 0.3, p[1] + (R() - 0.5) * r * 0.2]), true, 0.6)}" fill="#4a5232" opacity="0.6" stroke="${INK}" stroke-width="0.6" stroke-opacity="0.5"/>`; }
  // ridge line, heavy
  out += `<path d="${smooth([0, 0.25, 0.5, 0.75, 1].map(u => { const p = L(r0, r1, u); return P(p[0], p[1] - Math.sin(u * Math.PI) * sag * 1.3, p[2]); }), false, 0.6)}" stroke="${INK}" stroke-width="${f1(Math.max(1.4, inkAt(r0[2]) * 1.6))}" fill="none"/>`;
  const qd = quad([e0, e1, r1, r0]), nrm = normalOf(e0, e1, r0);
  out += planeShade(qd[0], qd[1], qd[2], nrm, { op: 0.34 });
  for (const pt of o.patches || []) { const [u, t, du, dt] = pt; const at = (s, tt) => L(L(e0, e1, u + s / qd[1]), L(r0, r1, u + s / qd[1]), t + tt / qd[2]); out += planks(at, du * qd[1], dt * qd[2], '#5a4836', { across: true, board: 0.12, nails: 3 }); }
  raw(PLW([e0, e1, r0], out));
  grade(qd[0], qd[1], qd[2], [e0, e1, r0], { bias: -0.05 });
  return '';
}
// figure-engine props with ink kept legible at any depth: k = how much heavier the figure's own ink must be drawn
const inkK = s => Math.max(1, Math.min(9, 0.95 / (1.6 * s)));
function fp(X, Y, Z, build, o = {}) {
  const s = sc(Z) * (o.scale || 1), k = inkK(s);
  figProp(X, Y, Z, (fg, u) => build(fg, u, k), Object.assign({ tag: false, fig: Object.assign({ inkW: 1.6 * k, inkHeavy: 3.6 * k }, o.fig || {}) }, o));
}
const rotd = (p, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return p[2] ? [p[0] * c - p[1] * s, p[0] * s + p[1] * c, 1] : [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
// a hooded figure: stand, kneel, sit, lie or bend; facing -1 (left) / 1 (right); grim's proportions, drawn in figure px
function folk(X, Z, o = {}) {
  const lean = o.lean !== undefined ? o.lean : (R() - 0.5) * 7;
  const rr = [R(), R(), R(), R(), R(), R(), R(), R(), R(), R(), R(), R(), R(), R()];
  fp(X, 0, Z, (fg, s, k) => {
    const T = n => n + fg.o.seed, rp = pts => pts.map(p => rotd(p, lean));
    const part = (pts, op) => fg.part(rp(pts), Object.assign({ shade: 0.42, cast: false, k: 0.5 }, op)), flat = (pts, c, op) => fg.flat(rp(pts), c, op), line = (pts, w, c, op) => fg.line(rp(pts), w * k, c, op);
    const col = o.col || '#4a4038', face = o.face || 1, pose = o.pose || 'stand', hgt = (o.h || 1.68) * s, skin = o.skin || '#8e7c64';
    fg.flat(ell([0, 0], s * (pose === 'lie' ? 1.0 : 0.42), s * 0.07, 0, 14), '#0e0b08', { op: 0.42 });
    if (pose === 'lie') {
      const L = s * 0.9;
      part([[-L, -s * 0.05], [-L * 0.9, -s * 0.3], [-L * 0.2, -s * 0.36], [L * 0.6, -s * 0.3], [L * 0.95, -s * 0.12], [L, 0]], { fill: col, tex: T('weave'), texOp: 0.45 });
      line([[-L * 0.5, -s * 0.3], [-L * 0.45, -s * 0.05]], 1.4, INK, { op: 0.6 }); line([[L * 0.2, -s * 0.33], [L * 0.25, -s * 0.05]], 1.4, INK, { op: 0.6 });
      if (o.blood) flat(ell([L * 0.1, -s * 0.22], s * 0.14, s * 0.06, 0.2, 9), G.blood, { op: 0.7 });
      part(ell([-L * 0.92 * face, -s * 0.26], s * 0.12, s * 0.11, 0, 10), { fill: skin, shade: 0.35 });
      return;
    }
    const kn = pose === 'kneel' ? 0.62 : pose === 'sit' ? 0.55 : 1, bend = pose === 'bend' ? 0.32 : (pose === 'kneel' ? 0.1 : 0), th = hgt * kn;
    const hx = face * th * bend, hy = -th * 0.9 - (pose === 'bend' ? -th * 0.12 : 0), sw = s * (pose === 'sit' ? 0.36 : 0.25), hw = s * (pose === 'kneel' || pose === 'sit' ? 0.44 : 0.36);
    const robe = [[-hw * (0.9 + rr[0] * 0.2), s * 0.01], [-hw * 0.98, -th * 0.2], [-hw * 0.86, -th * 0.45], [hx - sw, hy + th * 0.16], [hx - sw * 0.5, hy + th * 0.04], [hx + sw * 0.6, hy + th * 0.05], [hx + sw, hy + th * 0.18], [hw * 0.84, -th * 0.48], [hw * 0.98, -th * 0.18], [hw * (0.9 + rr[1] * 0.2), 0], [hw * 0.5, -s * 0.05], [hw * 0.1, s * 0.01], [-hw * 0.4, -s * 0.04]];
    if (o.pack) part([[-face * s * 0.12, -th * 0.8], [-face * s * 0.42, -th * 0.76], [-face * s * 0.46, -th * 0.45], [-face * s * 0.16, -th * 0.42]], { fill: o.pack, tex: T('weave'), texOp: 0.5 });
    part(robe, { fill: col, tex: T('weave'), texOp: 0.4 });
    // fold from the shoulder to the hem, hem rags, rope belt, mud on the hem
    line([[hx + face * sw * 0.2, hy + th * 0.2], [face * hw * 0.15, -th * 0.5], [face * hw * 0.3, -th * 0.3], [face * hw * 0.2, -s * 0.02]], 1.5, INK, { op: 0.55 });
    for (let i = 0; i < 5; i++) line([[-hw + i * hw * 0.45, 0], [-hw + i * hw * 0.45 + (rr[2 + i] - 0.5) * s * 0.04, -s * (0.05 + rr[3 + i] * 0.08)]], 1.1, INK, { op: 0.6 });
    flat([[-hw, 0], [hw, 0], [hw * 0.95, -th * 0.08], [0, -th * 0.12], [-hw * 0.95, -th * 0.07]], '#1e1810', { op: 0.5 });
    line([[-hw * 0.8, -th * 0.52], [0, -th * 0.48], [hw * 0.8, -th * 0.53]], 2.2, '#8a7a5a', { op: 0.9 });
    if (pose !== 'sit') part([[hx + face * sw * 0.3, hy + th * 0.2], [hx + face * sw * 1.0, hy + th * 0.24], [face * hw * 0.7, -th * 0.42], [face * hw * 0.35, -th * 0.36], [face * hw * 0.2, -th * 0.5]], { fill: mix(col, '#140d08', 0.14), tex: T('weave'), texOp: 0.35 });
    if (pose === 'sit') { // knees drawn up under the robe, the arms wrapped round them
      part(ell([face * hw * 0.55, -th * 0.3], s * 0.26, s * 0.2, face * 0.2, 12), { fill: mix(col, '#f4ead0', 0.06), tex: T('weave'), texOp: 0.4 });
      line([[face * hw * 0.05, -th * 0.5], [face * hw * 0.6, -th * 0.46], [face * hw * 0.95, -th * 0.34]], 6, mix(col, '#140d08', 0.2));
      part(ell([face * hw * 0.95, -th * 0.36], s * 0.05, s * 0.045, 0, 8), { fill: skin, shade: 0.35, hatch: false }); }
    const arm = o.arm || 'fold';
    if (arm === 'fold') part(ell([face * hw * 0.45, -th * 0.44], s * 0.05, s * 0.045, 0, 8), { fill: skin, shade: 0.35, hatch: false });
    if (arm === 'bowl') { part([[hx + face * sw * 0.4, hy + th * 0.28], [hx + face * sw * 1.5, hy + th * 0.46], [hx + face * sw * 1.6, hy + th * 0.54], [hx + face * sw * 0.3, hy + th * 0.5]], { fill: mix(col, '#140d08', 0.1) });
      part(ell([hx + face * sw * 1.55, hy + th * 0.5], s * 0.045, s * 0.04, 0, 8), { fill: skin, shade: 0.35, hatch: false });
      part([[hx + face * sw * 1.4, hy + th * 0.46], [hx + face * sw * 1.4 + face * s * 0.16, hy + th * 0.46], [hx + face * sw * 1.4 + face * s * 0.08, hy + th * 0.46 + s * 0.06]], { fill: '#5a4a38', shade: 0.3, hatch: false }); }
    if (arm === 'staff') { const a0 = [hx + face * sw * 1.2, hy - th * 0.05], a1 = [face * hw * 1.3, 0]; line([a0, a1], 5.5, INK); line([a0, a1], 3.2, TIMBER); }
    if (arm === 'spade') { const sx = face * hw * 1.6; line([[hx + face * sw, hy + th * 0.1], [sx, -s * 0.1]], 5.5, INK); line([[hx + face * sw, hy + th * 0.1], [sx, -s * 0.1]], 3.2, TIMBER); part([[sx - s * 0.1, -s * 0.12, 1], [sx + s * 0.1, -s * 0.12, 1], [sx + s * 0.07, s * 0.06, 1], [sx - s * 0.07, s * 0.06, 1]], { fill: '#4a4640', shade: 0.35 }); }
    if (arm === 'pray') { part([[hx + face * sw * 0.2, hy + th * 0.26], [hx + face * sw * 1.1, hy + th * 0.22], [hx + face * sw * 1.2, hy + th * 0.32], [hx + face * sw * 0.2, hy + th * 0.42]], { fill: mix(col, '#140d08', 0.12) });
      part(ell([hx + face * sw * 1.2, hy + th * 0.25], s * 0.045, s * 0.05, 0, 8), { fill: skin, shade: 0.35, hatch: false }); }
    if (o.crutch) { const c0 = [face * s * 0.2, -th * 0.74], c1 = [face * s * 0.3, 0]; line([c0, c1], 5, INK); line([c0, c1], 3, TIMBER); line([[face * s * 0.1, -th * 0.75], [face * s * 0.3, -th * 0.73]], 5, INK); }
    if (o.bare) {
      part(ell([hx + face * s * 0.03, hy], s * 0.11, s * 0.12, 0, 10), { fill: skin, shade: 0.4, tex: T('mottle'), texOp: 0.4 });
      line([[hx - s * 0.1, hy - s * 0.05], [hx - s * 0.04, hy - s * 0.14], [hx + s * 0.08, hy - s * 0.13], [hx + s * 0.11, hy - s * 0.04]], s * 0.05 / k, o.hair || '#2a2018');
      line([[hx + face * s * 0.09, hy - s * 0.01], [hx + face * s * 0.12, hy + s * 0.02]], 1.2, INK, { op: 0.6 });
    } else {
      const hood = [[hx - face * sw * 1.05, hy + th * 0.19], [hx - face * s * 0.15, hy + s * 0.05], [hx - face * s * 0.14, hy - s * 0.09], [hx - face * s * 0.02, hy - s * 0.17, 1], [hx + face * s * 0.12, hy - s * 0.11], [hx + face * s * 0.15, hy + s * 0.04], [hx + face * sw * 1.05, hy + th * 0.19], [hx, hy + th * 0.24]];
      part(hood, { fill: mix(col, '#140d08', 0.06), tex: T('weave'), texOp: 0.35, k: 0.55 });
      const fx = hx + face * s * 0.05, fy = hy + s * 0.01;
      flat(ell([fx, fy], s * 0.075, s * 0.095, 0, 12), '#120d0a');
      flat([[fx - s * 0.04, fy + s * 0.05], [fx + face * s * 0.02, fy + s * 0.09], [fx + face * s * 0.06, fy + s * 0.04], [fx + face * s * 0.05, fy + s * 0.01], [fx, fy + s * 0.035], [fx - s * 0.03, fy + s * 0.02]], skin);
    }
  });
}
// barrel, crate and sack on the ground at (X, Z): figure-engine props
function barrel(X, Z, Y = 0) { fp(X, Y, Z, (fg, u) => PR.barrel(fg, 0, 0.32 * u, 0.85 * u)); }
function crate(X, Z, sz = 0.6, Y = 0) {
  fp(X, Y, Z, (fg, u) => {
    const w = sz * u, d = 0.12 * u;
    fg.part([[-w / 2, -w, 1], [-w / 2 + d, -w - d * 0.5, 1], [w / 2 + d, -w - d * 0.5, 1], [w / 2, -w, 1]], { fill: '#7a6650', shade: 0.25, tex: 'wood' + fg.o.seed, texOp: 0.45, cast: false });
    fg.part([[-w / 2, 0, 1], [w / 2, 0, 1], [w / 2, -w, 1], [-w / 2, -w, 1]], { fill: '#6a5640', shade: 0.4, tex: 'wood' + fg.o.seed, texOp: 0.5, cast: false });
    for (const y of [-w * 0.33, -w * 0.66]) fg.line([[-w / 2 + 3, y], [w / 2 - 3, y]], 1.4, INK, { op: 0.6, straight: true });
    fg.line([[-w / 2 + 4, -4], [w / 2 - 4, -w + 4]], 3, '#4a3a28'); fg.line([[-w / 2 + 4, -4], [w / 2 - 4, -w + 4]], 1, INK, { op: 0.6 });
  });
}
function sack(X, Z, Y = 0) { fp(X, Y, Z, (fg, u) => PR.sack(fg, 0, 0.78 * u, { col: '#736548' })); }
// a crow: an ink silhouette, the eye a dull glint (not a motif)
function crow(x, y, s, face = 1) {
  return `<path d="M${f1(x)} ${f1(y)} c${f1(face * s * 0.3)} ${f1(-s * 0.5)} ${f1(face * s * 0.9)} ${f1(-s * 0.6)} ${f1(face * s * 1.1)} ${f1(-s * 0.5)} l${f1(face * s * 0.35)} ${f1(s * 0.05)} l${f1(-face * s * 0.3)} ${f1(s * 0.12)} c${f1(-face * s * 0.2)} ${f1(s * 0.4)} ${f1(-face * s * 0.7)} ${f1(s * 0.5)} ${f1(-face * s * 1.1)} ${f1(s * 0.4)} l${f1(-face * s * 0.6)} ${f1(s * 0.2)} Z" fill="#100c0a" stroke="${INK}" stroke-width="0.8"/><path d="M${f1(x + face * s * 0.2)} ${f1(y - s * 0.1)} q${f1(face * s * 0.3)} ${f1(-s * 0.15)} ${f1(face * s * 0.6)} ${f1(-s * 0.1)}" stroke="#3a3a40" stroke-width="${f1(Math.max(0.6, s * 0.06))}" fill="none"/><path d="M${f1(x + face * s * 0.5)} ${f1(y + s * 0.4)} l0 ${f1(s * 0.35)} M${f1(x + face * s * 0.7)} ${f1(y + s * 0.38)} l${f1(face * s * 0.05)} ${f1(s * 0.36)}" stroke="#100c0a" stroke-width="${f1(Math.max(0.8, s * 0.07))}"/>`;
}
const flying = (x, y, s) => `<path d="M${f1(x - s)} ${f1(y - s * 0.3)} Q${f1(x - s * 0.4)} ${f1(y - s * 0.6)} ${f1(x)} ${f1(y)} Q${f1(x + s * 0.4)} ${f1(y - s * 0.6)} ${f1(x + s)} ${f1(y - s * 0.35)} Q${f1(x + s * 0.4)} ${f1(y - s * 0.2)} ${f1(x)} ${f1(y + s * 0.15)} Q${f1(x - s * 0.4)} ${f1(y - s * 0.15)} ${f1(x - s)} ${f1(y - s * 0.3)} Z" fill="#14100e"/>`;
// fire: the figure engine's joined tongues, tagged emissive; h, w in screen px at depth Z, base at world (X, Y, Z)
function fire(X, Y, Z, hpx, wpx, n = 7, licks = 2) { const s = sc(Z); fp(X, Y, Z, (fg) => PR.fire(fg, wpx / s, hpx / s, { n, licks }), { em: true }); }
const embers = (x, y, sp, n = 10) => EM(Array.from({ length: n }, () => `<circle cx="${f1(x + (R() - 0.5) * sp)}" cy="${f1(y - R() * sp)}" r="${f1(0.8 + R() * 1.6)}" fill="${R() < 0.5 ? '#ffb050' : '#ff7a2a'}" opacity="${f1(0.5 + R() * 0.4)}"/>`).join(''));
const weed = (x, y, h) => { let d = ''; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (R() - 0.5) * 1.2, l = Math.abs(h) * (0.4 + R() * 0.6); d += `M${f1(x + (R() - 0.5) * 6)} ${f1(y)} q${f1(Math.cos(a) * l * 0.3)} ${f1(Math.sin(a) * l * 0.6)} ${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; } return `<path d="${d}" stroke="#2a2a18" stroke-width="1.2" fill="none"/>`; };
// smoke: soft ribbons in two greys, inked on one side only (no filter, the layer's wobble is enough)
function smoke(pts, w, op = 0.22, col = '#3e3a36') {
  const d = smooth(pts, false, 0.8);
  return `<g class="glow"><path d="${d}" stroke="${col}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round" opacity="${f1(op)}"/><path d="${d}" stroke="${col}" stroke-width="${f1(w * 0.5)}" fill="none" stroke-linecap="round" opacity="${f1(op)}"/><path d="${d}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="${f1(op * 1.2)}" transform="translate(${f1(w * 0.45)},${f1(w * 0.2)})" stroke-dasharray="${f1(w * 0.8)} ${f1(w * 0.6)}"/></g>`;
}
// a lantern at screen size s px centred on world (X, Y, Z); w: grim's light spec [X, Y, Z, I, range] (or nothing)
function lantern(X, Y, Z, s, w) {
  if (w) addLight(w[0], w[1], w[2], w[3] || 0.5, w[4] || 4, [1.0, 0.68, 0.36]);
  const k = sc(Z), q = s / k;
  fp(X, Y, Z, (fg, u, ik) => {
    fg.line([[0, -1.6 * q], [0, -0.95 * q]], Math.max(1.2, 0.12 * q), '#1a1816');
    fg.part([[-0.55 * q, -0.9 * q, 1], [0, -1.3 * q, 1], [0.55 * q, -0.9 * q, 1]], { fill: '#2a2622', shade: 0.35, cast: false, hatch: false });
    fg.part([[-0.45 * q, -0.9 * q, 1], [0.45 * q, -0.9 * q, 1], [0.38 * q, 0.6 * q, 1], [-0.38 * q, 0.6 * q, 1]], { fill: '#2a2826', shade: 0.3, cast: false, hatch: false });
    fg.raw('<g class="em">'); fg.flat([[-0.34 * q, -0.78 * q, 1], [0.34 * q, -0.78 * q, 1], [0.29 * q, 0.5 * q, 1], [-0.29 * q, 0.5 * q, 1]], '#ffd486'); fg.flat(ell([0, -0.05 * q], 0.08 * q, 0.2 * q, 0, 8), '#fff4d0'); fg.raw('</g>');
    fg.line([[0, -0.85 * q], [0, 0.55 * q]], Math.max(1, 0.08 * q), '#1a1816', { straight: true });
    fg.part([[-0.48 * q, 0.55 * q, 1], [0.48 * q, 0.55 * q, 1], [0.4 * q, 0.75 * q, 1], [-0.4 * q, 0.75 * q, 1]], { fill: '#2a2622', shade: 0.3, cast: false, hatch: false });
  });
  const [x, y] = P(X, Y, Z);
  raw(glow(x, y, s * 3.2, s * 3, '#ffb060', 0.5));
}
// a wall torch in an iron cresset, its light (grim's formula); out: the wall's outward normal
function torch(X, Y, Z, out) {
  const k = K(Z), [wx, wy] = P(X, Y - 0.25, Z), [tx, ty] = P(X + out[0] * 0.28, Y, Z + out[2] * 0.28);
  addLight(X + out[0] * 0.4, Y + 0.3, Z + out[2] * 0.4, 1.3, 6.5, [1.0, 0.56, 0.24]);
  raw(`<path d="M${f1(wx)} ${f1(wy)} L${f1(tx)} ${f1(ty + k * 0.05)}" stroke="${INK}" stroke-width="${f1(k * 0.05 + 2)}"/><path d="M${f1(wx)} ${f1(wy)} L${f1(tx)} ${f1(ty + k * 0.05)}" stroke="#3a3632" stroke-width="${f1(k * 0.03)}"/>`);
  raw(cel([[tx - k * 0.03, ty + k * 0.25], [tx - k * 0.005, ty + k * 0.25], [tx + k * 0.035, ty - k * 0.02], [tx + k * 0.005, ty - k * 0.02]], { Z, fill: '#4a3626', band: 1 }));
  raw(glow(tx, ty - k * 0.2, k * 0.9, k * 0.85, '#ffa040', 0.5));
  fire(X + out[0] * 0.28, Y + 0.02, Z + out[2] * 0.28, k * 0.42, k * 0.2, 6);
  // the cresset's iron basket drawn after the flame, so the fire rises out of it (2026-11-24 draw-order fix)
  raw(cel([[tx - k * 0.07, ty - k * 0.01], [tx + k * 0.08, ty - k * 0.03], [tx + k * 0.06, ty + k * 0.07], [tx - k * 0.05, ty + k * 0.08]], { Z, fill: '#2a2420', band: 1 }));
  raw(EM(`<path d="M${f1(tx - k * 0.065)} ${f1(ty - k * 0.005)} L${f1(tx + k * 0.075)} ${f1(ty - k * 0.025)}" stroke="#ff9a3a" stroke-width="${f1(Math.max(0.8, k * 0.012))}" opacity="0.8"/>`));
  raw(embers(tx, ty - k * 0.4, k * 0.4, 5) + smoke([[tx, ty - k * 0.45], [tx - 4, ty - k * 0.8], [tx + 6, ty - k * 1.1], [tx + 2, ty - k * 1.5]], k * 0.1, 0.2, '#14100c'));
}
// candles standing at (X, Y, Z): grim's light formula (I 0.1 + 0.07 n), each its own stub, drips and flame
const candles = (X, Z, n, Y = 0, spread = 0.5) => {
  addLight(X, Y + 0.3, Z - 0.15, 0.1 + 0.07 * n, 2.4, [1.0, 0.74, 0.44]);
  const s = K(Z);
  for (let i = 0; i < n; i++) {
    const cx = X + (i - (n - 1) / 2) * spread / n + (R() - 0.5) * 0.05, cz = Z + (R() - 0.5) * 0.2, hm = 0.08 + R() * 0.14;
    const kk = sc(cz), hf = Math.max(hm * UM, 7 / kk), wf = Math.max(0.03 * UM, 1.6 / kk) * 0.55;
    fp(cx, Y, cz, (fg) => PR.candleStub(fg, 0, hf, wf));
    const [x, y] = P(cx, Y, cz); raw(glow(x, y - hf * kk - 3, s * 0.22, s * 0.2, '#ffb060', 0.45));
  }
  return '';
};

// ---- the title screen's sky sits above this frame: everything that rises past the frame's top edge (the near ends of the
// ranges, the huts' roofs, the smithy stack, the bell-frame) is also captured into a 'tops' layer, exported in the same
// camera with the space above the frame (garth__tops.svg, y from -1400), so scenes/title_sky_li.js completes them
const TOPS = []; let capFrom = -1;
const capStart = () => { capFrom = S.LAY[S.curLayer()].length; };
const capEnd = () => { TOPS.push(...S.LAY[S.curLayer()].slice(capFrom)); capFrom = -1; };
// ================================================================== BACKGROUND LAYER
layer('bg');
// ------------------------------------------------------------------ the Grey: a flat sunless sky in stepped bands, low strata, ash
{
  let s = '<g class="em sky">';
  const bands = ['#8c8a85', '#93918b', '#9c9a94', '#a5a39c', '#aeaba4', '#b4b1a9'];
  // one smooth gradient (2026-11-24: smooth fills allowed for skies, fog and glows); the tone at the top is the title sky's
  // bottom tone, so the title screen's seam is invisible
  S.DEFS.push(`<linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">${bands.map((c, i) => `<stop offset="${f1(i / (bands.length - 1))}" stop-color="${c}"/>`).join('')}</linearGradient>`);
  s += `<rect x="0" y="0" width="${W}" height="${HZ + 120}" fill="url(#gsky)"/>`;
  // strata: long ragged cloud shelves, each a flat tone with an inked underside, hatched on its lower edge
  for (let i = 0; i < 11; i++) {
    const y = 14 + (i % 8) * 32 + R() * 14, th = 6 + R() * 12, top = [], bot = [], xa = -60 + R() * 700, xb = xa + 500 + R() * 900;
    for (let k = 0; k <= 16; k++) { const u = k / 16, x = xa + (xb - xa) * u, taper = Math.sin(u * Math.PI) ** 0.6; top.push([x, y - th * 0.5 * taper + Math.sin(k * 0.7 + i) * 3 * taper + (R() - 0.5) * 3]); bot.push([x, y + th * 0.5 * taper + Math.sin(k * 0.9 + i * 2) * 2 * taper]); }
    const c = mix(bands[Math.min(5, Math.floor((y / (HZ + 120)) * 6))], '#5a5854', 0.16 + R() * 0.12);
    const sid = S.id('st'); S.DEFS.push(`<linearGradient id="${sid}" gradientUnits="userSpaceOnUse" x1="${f1(xa)}" y1="0" x2="${f1(xb)}" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="0.25" stop-color="${c}" stop-opacity="0.85"/><stop offset="0.75" stop-color="${c}" stop-opacity="0.85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`);
    s += `<path d="${smooth([...top, ...bot.slice().reverse()], true, 0.5)}" fill="url(#${sid})"/><path d="${smooth(bot.slice(3, -3), false, 0.5)}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.22"/>`;
    let hd = ''; for (let x = xa + 40 + R() * 20; x < xb - 40; x += 7 + R() * 5) { const u = (x - xa) / (xb - xa), yb = y + th * 0.5 * Math.sin(u * Math.PI) ** 0.6, l = 2 + R() * th * 0.45 * Math.sin(u * Math.PI); hd += `M${f1(x)} ${f1(yb)} l${f1(l * 0.6)} ${f1(-l)} `; }
    s += `<path d="${hd}" stroke="${INK}" stroke-width="0.7" opacity="0.08" fill="none"/>`;
  }
  s += '</g>';
  raw(s);
}
// ------------------------------------------------------------------ the ground: mud, dead grass, flag paths, puddles
const GROUND = [[0, 0, 5], [1, 0, 5], [0, 0, 6]];
{
  let s = `<path d="${pp([[-30, 0, 3.0], [30, 0, 3.0], [30, 0, 40], [-30, 0, 40]])}" fill="${MUD}"/><path d="${pp([[-30, 0, 3.0], [30, 0, 3.0], [30, 0, 40], [-30, 0, 40]])}" fill="url(#mottle)" opacity="0.55"/>`;
  // dead grass in the four quarters of the garth, trodden to mud round the edges
  for (const [x0, x1, z0, z1] of [[-6.9, -0.4, 16.8, 28.4], [3.4, 6.9, 16.8, 28.4], [-6.9, -0.4, 8.5, 14.6], [3.4, 6.9, 8.5, 14.6], [-5.8, -0.4, 3.0, 8.0], [3.4, 5.8, 3.0, 8.0]]) {
    const pts = []; for (let i = 0; i <= 8; i++) pts.push(P(x0 + (x1 - x0) * i / 8 + (R() - 0.5) * 0.3, 0, z0 + (R() - 0.5) * 0.4)); for (let i = 0; i <= 8; i++) pts.push(P(x1 - (x1 - x0) * i / 8 + (R() - 0.5) * 0.3, 0, z1 + (R() - 0.5) * 0.4));
    s += `<path d="${smooth(pts, true, 0.3)}" fill="${GRASS}"/><path d="${smooth(pts, true, 0.3)}" fill="url(#mottle)" opacity="0.45"/><path d="${smooth(pts, true, 0.3)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`;
    for (let i = 0; i < 70; i++) { const X = x0 + R() * (x1 - x0), Z = z0 + R() * (z1 - z0), [x, y] = P(X, 0, Z), k = K(Z); let d = ''; const n = 3 + Math.floor(R() * 5); for (let b = 0; b < n; b++) { const bx = x + (R() - 0.5) * k * 0.14, hh = k * (0.06 + R() * 0.14), bend = (R() - 0.5) * k * 0.12; d += `M${f1(bx)} ${f1(y)} Q${f1(bx + bend * 0.3)} ${f1(y - hh * 0.6)} ${f1(bx + bend)} ${f1(y - hh)} `; } s += `<path d="${d}" stroke="${R() < 0.6 ? '#1e1e16' : '#6a6646'}" stroke-width="${f1(Math.max(0.6, k * 0.009))}" fill="none" opacity="0.85"/>`; }
  }
  // flagstone paths: the walks round the edge and the cross through the middle, each flag its own chipped cel
  const flags = (x0, x1, z0, z1, sz, ruin = 0.12) => {
    let o = '';
    for (let z = z0; z < z1 - 0.05;) {
      const dz = sz * (0.7 + R() * 0.5) * (z / 8 + 0.6) ** 0.2; let x = x0 - R() * sz * 0.5;
      while (x < x1) {
        const dx = sz * (0.8 + R() * 0.8), X0 = Math.max(x0, x) + 0.03, X1 = Math.min(x1, x + dx) - 0.03, Z1 = Math.min(z1, z + dz) - 0.03;
        if (X1 - X0 > 0.1 && R() > ruin) {
          const j = () => (R() - 0.5) * 0.06, q = [[X0 + j(), 0, z + 0.03 + j()], [X1 + j(), 0, z + 0.03 + j()], [X1 + j(), 0, Z1 + j()], [X0 + j(), 0, Z1 + j()]].map(p => P(...p));
          const qc = chip(q, 0.4), fl = mix(FLAG, R() < 0.45 ? '#c8bca0' : '#16120e', R() * 0.36);
          o += cel(qc, { Z: z, fill: fl, band: Math.max(0.8, K(z) * 0.03), tex: 'url(#mottle)', texOp: 0.3 }) + MV2(S).stoneMarks(qc, z, fl);   // materials v2: worn flags
          if (R() < 0.3) { const c0 = P(X0 + (X1 - X0) * R(), 0, z + 0.05), c1 = P(X0 + (X1 - X0) * R(), 0, Z1 - 0.05), m = [(c0[0] + c1[0]) / 2 + (R() - 0.5) * 10, (c0[1] + c1[1]) / 2]; o += `<path d="M${f1(c0[0])} ${f1(c0[1])} L${f1(m[0])} ${f1(m[1])} L${f1(c1[0])} ${f1(c1[1])}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, inkAt(z) * 0.45))}" fill="none"/>`; }
          if (R() < 0.35) o += `<path d="M${f1(q[0][0])} ${f1(q[0][1])} L${f1(q[1][0])} ${f1(q[1][1])}" stroke="#3a4424" stroke-width="${f1(K(z) * 0.03 + 0.8)}" opacity="0.7"/>`;
          if (z < 9 && R() < 0.45) o += stain((q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, K(z) * 0.3, '#2a2218', 0.5);
        }
        else if (X1 - X0 > 0.1) o += `<path d="${pp([[X0, 0, z + 0.03], [X1, 0, z + 0.03], [X1, 0, Z1], [X0, 0, Z1]])}" fill="#2e271f" opacity="0.7"/>`;
        x += dx;
      }
      z += dz;
    }
    return o;
  };
  s += flags(-9.5, -7.0, 8.4, 30, 0.8, 0.18) + flags(7.0, 9.5, 8.4, 30, 0.8, 0.18) + flags(-9.5, 9.5, 28.5, 30, 0.8, 0.1);
  s += flags(-1.4, 1.4, 3.0, 28.5, 0.75, 0.16) + flags(-5.8, -1.4, 5.9, 7.4, 0.7, 0.2) + flags(1.4, 5.8, 5.9, 7.4, 0.7, 0.2) + flags(-7.0, 0.1, 14.8, 16.4, 0.75, 0.2) + flags(3.0, 7.0, 14.8, 16.4, 0.75, 0.2);
  // cart ruts curving in from the gate, boot-churned mud, footprints between the gate and the fire
  for (const off of [-0.7, 0.7]) { const pts = [[-4.6 + off * 0.6, 3.0], [-4.4 + off * 0.6, 4.4], [-4.9 + off, 6.0], [-5.4 + off, 7.4]].map(([X, Z]) => P(X, 0, Z)); s += `<path d="${smooth(pts, false, 0.7)}" stroke="#1a140e" stroke-width="12" fill="none" opacity="0.45"/><path d="${smooth(pts, false, 0.7)}" stroke="${INK}" stroke-width="1.2" fill="none" opacity="0.6" transform="translate(0 5)"/><path d="${smooth(pts, false, 0.7)}" stroke="#6a5e4a" stroke-width="2" fill="none" opacity="0.5" transform="translate(0 -6)"/>`; }
  for (let i = 0; i < 160; i++) { const X = -7 + R() * 14, Z = 3.1 + R() * 9, [x, y] = P(X, 0, Z), k = K(Z); s += `<path d="M${f1(x)} ${f1(y)} l${f1(k * (0.05 + R() * 0.1))} ${f1((R() - 0.5) * k * 0.02)}" stroke="${R() < 0.5 ? '#16110c' : '#7a6c54'}" stroke-width="${f1(Math.max(0.6, k * 0.012))}" opacity="0.6"/>`; }
  for (let i = 0; i < 24; i++) { const X = -1.5 + R() * 3.4, Z = 3.2 + R() * 3, [x, y] = P(X, 0, Z), k = K(Z); s += `<path d="${smooth(ell([x, y], k * 0.05, k * 0.018, 0, 8), true, 0.8)}" fill="#1a140e" opacity="0.5"/>`; }
  for (let i = 0; i < 40; i++) { const X = -6 + R() * 12, Z = 3.2 + R() * 22, [x, y] = P(X, 0, Z), k = K(Z); s += `<path d="M${f1(x - k * 0.6)} ${f1(y + k * 0.02)} q${f1(k * 0.6)} ${f1(-k * 0.06)} ${f1(k * 1.2)} ${f1(k * 0.01)}" stroke="#1a150f" stroke-width="${f1(k * 0.07 + 1)}" fill="none" opacity="0.28" stroke-linecap="round"/>`; }
  // puddles holding the grey sky: a pale flat with an inked rim and a lit far edge
  for (const [X, Z, r] of [[-1.2, 12.5, 0.7], [2.4, 19.5, 0.5], [-3.6, 15.6, 0.55], [6.0, 26, 0.6], [-8.2, 19.5, 0.5]]) {
    const pts = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, m = 0.8 + R() * 0.35; pts.push(P(X + Math.cos(a) * r * m, 0, Z + Math.sin(a) * r * 0.8 * m)); }
    s += `<path d="${smooth(pts, true, 0.6)}" fill="#55534e" stroke="${INK}" stroke-width="${f1(Math.max(0.8, inkAt(Z) * 0.7))}"/>`;
    const [x, y] = P(X, 0, Z), k = K(Z); s += `<path d="M${f1(x - k * r * 0.5)} ${f1(y - k * r * 0.03)} L${f1(x + k * r * 0.25)} ${f1(y - k * r * 0.04)}" stroke="#d8d6d0" stroke-width="${f1(Math.max(0.8, k * 0.02))}" opacity="0.45"/>`;
  }
  raw(PLW(GROUND, s));
  // value grading of the ground: dark far off and at the frame's foot, cut back round every light (firelight pools on the mud)
  const atG = (s0, t) => [-11 + s0, 0, 3.0 + t];
  grade(atG, 22, 27.5, GROUND, { lw: 0.7, bias: 0.02, front: [3.0, 4.4, 0.55], zh: { op: 0.85 } });
}

// ------------------------------------------------------------------ the church: aisle wall, clerestory, roof, the fallen tower
{
  const ZA = 30, ZC = 32;
  roof([-16, 10, ZC], [3.6, 10, ZC], [3.6, 14, 35.5], [-16, 14, 35.5], SLATE, { courses: 9, holes: 0.06, moss: 10, patches: [[0.55, 0.3, 0.12, 0.25]] });
  const atC = (s, t) => [-16 + s, 7.2 + t, ZC];
  raw(stones(atC, 19.6, 2.8, STONE, { course: 0.5, block: 1.0, streaks: 8 }));
  shade([atC(0, 0), atC(19.6, 0), atC(19.6, 2.8), atC(0, 2.8)]);
  for (const X of [-9, -6.4, -3.8, -1.2, 1.4]) windowOn((s, t) => [X + s, 7.2 + t, ZC], 0, 1.0, 0.4, 2.5, X === -6.4 ? 'boarded' : (X === -3.8 || X === 1.4) ? 'dark' : 'lit');
  // the crossing tower: fell in the first winter of the Grey; the stump is roofed with a timber bell-frame that stands empty
  const atT = (s, t) => [3.6 + s, t, 31.4];
  raw(stones(atT, 5.2, 11.6, STONE2, { course: 0.55, block: 1.1, streaks: 10, holes: 0.02, quoins: [0, 1] }));
  // broken crown: a ragged top edge, its broken stones cut in cels
  { const crown = [atT(0, 11.6), atT(0.6, 12.1), atT(1.3, 11.2), atT(2.1, 11.9), atT(2.7, 10.6), atT(3.6, 11.3), atT(4.4, 11.0), atT(5.2, 11.7), atT(5.2, 11.6)];
    raw(PLW([atT(0, 0), atT(1, 0), atT(0, 1)], cel(crown.map(p => P(...p)), { Z: 31.4, fill: STONE2, band: 1.2 }) + hatch3(atT, 0, 5.2, 10.6, 12.1, 0.7, { op: 0.3, keep: (s, t) => t < 11.0 + Math.sin(s * 2.3) * 0.4 }))); }
  shade([atT(0, 0), atT(5.2, 0), atT(5.2, 11.6), atT(0, 11.6)]);
  { const [x, y] = P(5, 10, 31.4); raw(stain(x, y, 30, '#140e0a', 0.35)); }
  // the belfry opening on the stump: no louvres left, the chamber behind it hollow, the grey sky through the far opening
  { const at2 = (s, t) => [5.6 + s, t, 31.4], pts = archPts(at2, 0, 1.2, 8.6, 11.2 - 0.6, 0.6, 6);
    raw(PLW([pts[0], pts[1], pts[2]], `<path d="${pp(pts)}" fill="#141210" stroke="${INK}" stroke-width="${f1(inkAt(31.4) * 1.1)}"/>`));
    const far = archPts((s, t) => [6.7 + s, t, 36.2], 0, 0.95, 9.7, 11.5, 0.47, 6);
    through(pts, () => { raw(`<path d="${pp(far)}" fill="#a5a39c"/>` + `<path d="${pp(far)}" fill="none" stroke="${INK}" stroke-width="1"/>` + seg([5.8, 9.4, 33], [6.6, 9.9, 33], '#2a2420', 1.6)); });
    raw(seg([5.6, 8.48, 31.4], [6.8, 8.48, 31.4], STONE2, 2.4) + seg([5.6, 8.48, 31.4], [6.8, 8.48, 31.4], INK, 0.8)); }
  // the timber bell-frame on the stump: three posts, the top rail, braces; between the posts the frame is open to the sky.
  // The headstock beam the bell hung from is still there, bare: two empty iron straps, a crow on it. No bell.
  capStart();
  {
    const z = 31.4, posts = [3.9, 5.9, 8.5], k = K(z);
    for (const X of posts) raw(beam([X, 11.0, z], [X + 0.1, 14.6, z], k * 0.22, TIMBER));
    raw(beam([3.9, 11.6, z], [5.9, 14.0, z], k * 0.1, TIMBERD) + beam([5.9, 11.6, z], [8.5, 14.0, z], k * 0.1, TIMBERD));
    raw(beam([3.7, 14.0, z], [8.8, 14.1, z], k * 0.2, TIMBER));
    // the headstock: a squared beam slung across the bay at 13.2 m, its iron straps hanging open over nothing
    raw(beam([5.95, 13.25, z - 0.05], [8.45, 13.3, z - 0.05], k * 0.26, '#3a2c1e'));
    for (const X of [6.85, 7.55]) {
      const [x, y] = P(X, 13.15, z - 0.06), q = k;
      raw(`<path d="M${f1(x - q * 0.05)} ${f1(y - q * 0.12)} L${f1(x - q * 0.05)} ${f1(y + q * 0.2)} Q${f1(x)} ${f1(y + q * 0.27)} ${f1(x + q * 0.05)} ${f1(y + q * 0.2)} L${f1(x + q * 0.05)} ${f1(y - q * 0.12)}" stroke="${INK}" stroke-width="${f1(q * 0.05 + 1)}" fill="none"/><path d="M${f1(x - q * 0.05)} ${f1(y - q * 0.12)} L${f1(x - q * 0.05)} ${f1(y + q * 0.2)} Q${f1(x)} ${f1(y + q * 0.27)} ${f1(x + q * 0.05)} ${f1(y + q * 0.2)} L${f1(x + q * 0.05)} ${f1(y - q * 0.12)}" stroke="#4a4644" stroke-width="${f1(q * 0.025)}" fill="none"/>`);
      raw(`<circle cx="${f1(x - q * 0.05)}" cy="${f1(y - q * 0.02)}" r="${f1(Math.max(0.8, q * 0.02))}" fill="${INK}"/>`);
    }
    // the plank roof over the frame
    { const rq = [[3.2, 14.3, z - 0.4], [9.2, 14.5, z - 0.4], [8.4, 15.6, z + 0.6], [4.0, 15.4, z + 0.6]];
      raw(PLW([rq[0], rq[1], rq[3]], cel(rq.map(p => P(...p)), { Z: z, fill: '#4a3a2a', band: 1.4 }) + hatch3(quad(rq)[0], 0, quad(rq)[1], 0, quad(rq)[2], 0.5, { op: 0.35 })));
      for (let i = 1; i < 9; i++) { const u = i / 9; raw(seg([3.2 + 6 * u, 14.3 + 0.2 * u, z - 0.4], [4.0 + 4.4 * u, 15.4 + 0.2 * u, z + 0.6], INK, 0.8, 0.6)); } }
    raw(crow(...P(4.4, 15.5, z), 6, 1) + crow(...P(8.0, 15.6, z), 5, -1));
    { const [x, y] = P(7.3, 13.32, z - 0.05); raw(crow(x, y - 5, 5.5, -1)); }
  }
  capEnd();
  // aisle roof (lean-to) and the aisle wall
  roof([-16, 5, ZA], [14, 5, ZA], [14, 7.2, ZC], [-16, 7.2, ZC], '#4a4743', { courses: 5, holes: 0.05, moss: 12, patches: [[0.3, 0.1, 0.05, 0.6]] });
  const atA = (s, t) => [-16 + s, t, ZA];
  raw(stones(atA, 30, 5, STONE, { course: 0.46, block: 0.95, streaks: 14, holes: 0.01, rubble: 4 }));
  raw(PLW([atA(0, 0), atA(1, 0), atA(0, 1)], render(atA, 30, 5, 9)));
  for (const X of [-6.9, -3.0, 2.0]) { const [x, y] = P(X, 0, ZA); raw(bloom(x, y - 6, 26, '#1e2414', 0.3)); }
  shade([atA(0, 0), atA(30, 0), atA(30, 5), atA(0, 5)]);
  // green damp creeping up from the ground: a flat tone and its hatched tide line
  raw(PLW([atA(0, 0), atA(1, 0), atA(0, 1)], `<path d="${pp([atA(0, 0), atA(30, 0), atA(30, 0.8), atA(20, 1.3), atA(12, 0.7), atA(6, 1.5), atA(0, 0.9)])}" fill="#3a4a2e" opacity="0.3"/>` + hatch3(atA, 0, 30, 0, 0.6, 1.1, { op: 0.3, ragged: 0.4 })));
  for (const X of [-6.4, -3.8, -1.2]) windowOn((s, t) => [X + s, t, ZA], 0, 0.9, 1.4, 3.6, X === -1.2 ? 'lit' : 'dark');
  torch(-2.2, 2.9, 29.9, [0, 0, -1]); torch(2.2, 2.9, 29.9, [0, 0, -1]);
  for (const X of [-8, -5.1, -2.5, 4.4]) {    // buttresses
    const z0 = ZA - 0.9, atB = (s, t) => [X + s, t, z0];
    raw(PLW([[X, 0, z0], [X, 1, z0], [X, 0, ZA]], cel([[X, 0, z0], [X, 4.2, z0], [X, 5.0, ZA], [X, 0, ZA]].map(p => P(...p)), { Z: z0, fill: dark(STONE, 0.55), band: 1 })));
    raw(stones(atB, 0.8, 4.2, STONE2, { course: 0.5, block: 0.8 }));
    const tq = [[X, 4.2, z0], [X + 0.8, 4.2, z0], [X + 0.8, 5.0, ZA], [X, 5.0, ZA]];
    raw(PLW([tq[0], tq[1], tq[3]], cel(tq.map(p => P(...p)), { Z: z0, fill: light(STONE2, 0.15), band: 1 })));
    shade([atB(0, 0), atB(0.8, 0), atB(0.8, 4.2), atB(0, 4.2)]);
  }
  // a niche shrine on the westmost buttress: a worn saint, candles, wax running down
  { const [x, y] = P(-7.6, 1.2, 29.05), s = K(29.05);
    raw(`<path d="M${f1(x - s * 0.22)} ${f1(y)} L${f1(x - s * 0.22)} ${f1(y - s * 1.1)} Q${f1(x)} ${f1(y - s * 1.45)} ${f1(x + s * 0.22)} ${f1(y - s * 1.1)} L${f1(x + s * 0.22)} ${f1(y)} Z" fill="#14100c" stroke="${INK}" stroke-width="1.2"/>`);
    raw(cel([[x - s * 0.12, y], [x - s * 0.14, y - s * 0.8], [x - s * 0.08, y - s * 1.05], [x, y - s * 1.12], [x + s * 0.08, y - s * 1.05], [x + s * 0.14, y - s * 0.8], [x + s * 0.12, y]], { Z: 29, fill: '#7a7466', band: 1.2 }));
    candles(-7.6, 29.0, 5, 1.2, 0.6);
    raw(`<path d="M${f1(x - 4)} ${f1(y + 1)} l0 10 M${f1(x + 5)} ${f1(y + 1)} l0 7" stroke="#d8ccb0" stroke-width="1.5" opacity="0.7"/>`); }
  // ------------------------------------------------------------ the porch and the church door (clickable)
  {
    const z0 = 28.2, x0 = -1.5, x1 = 1.5, hW = 3.8, hG = 5.4;
    { const q = [[x1, 0, z0], [x1, 0, ZA], [x1, hW, ZA], [x1, hW, z0]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: z0, fill: dark(STONE2, 0.25), band: 1 }) + hatch3((s, t) => [x1, t, z0 + s], 0, ZA - z0, 0, hW, 0.7, { op: 0.35 }))); }
    { const q = [[x1, hW, z0], [x1, hW, ZA], [(x0 + x1) / 2, hG, ZA], [(x0 + x1) / 2, hG, z0]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: z0, fill: '#3e3a36', band: 1 }))); }
    const atP = (s, t) => [x0 + s, t, z0];
    raw(stones(atP, x1 - x0, hW, STONE2, { course: 0.42, block: 0.8, streaks: 4, quoins: [0, 1] }));
    raw(PLW([atP(0, 0), atP(1, 0), atP(0, 1)], cel([atP(-0.2, hW), atP(1.5, hG + 0.1), atP(3.2, hW), atP(2.9, hW), atP(1.5, hG - 0.25), atP(0.1, hW)].map(p => P(...p)), { Z: z0, fill: STONE2, band: 1.2 }) +
      cel([atP(0.1, hW), atP(1.5, hG - 0.25), atP(2.9, hW)].map(p => P(...p)), { Z: z0, fill: dark(STONE2, 0.2), band: 1 })));
    shade([atP(0, 0), atP(3, 0), atP(3, hW), atP(0, hW)]);
    const door = archPts(atP, 0.6, 2.4, 0, 2.2, 0.9, 10);
    litHole(door, z0, { r: 2.6, op: 0.5, top: '#7a3a14', bot: '#ffd07a' });
    raw(archRing(atP, 0.6, 2.4, 2.2, 0.9, 0.28, STONE2, 9));
    // inside: the nave's candles glimpsed, a column
    through(door, () => { candles(-0.3, z0 + 0.6, 4, 0.9, 0.5); candles(0.5, z0 + 0.6, 3, 1.1, 0.4); raw(beam([0.4, 0, z0 + 1.5], [0.4, 2.6, z0 + 1.5], K(z0) * 0.28, '#3a2010')); });
    // door leaves swung in, iron straps
    through(door, () => { raw(planks((s, t) => [-0.9 + s * 0.4, t, z0 + s * 0.9], 0.85, 2.4, '#3a2c20', { board: 0.2, nails: 5 }));
      raw(seg([-0.88, 0.7, z0 + 0.1], [-0.58, 0.7, z0 + 0.75], '#1e1c1a', 3) + seg([-0.88, 1.8, z0 + 0.1], [-0.58, 1.8, z0 + 0.75], '#1e1c1a', 3)); });
    // the gilt cross on the gable (the holy: the only gold in the garth)
    { const [x, y] = P(0, hG + 0.15, z0), s = K(z0); raw(`<path d="M${f1(x)} ${f1(y)} L${f1(x)} ${f1(y - s * 0.7)} M${f1(x - s * 0.22)} ${f1(y - s * 0.48)} L${f1(x + s * 0.22)} ${f1(y - s * 0.48)}" stroke="${INK}" stroke-width="${f1(s * 0.12 + 2)}"/><path d="M${f1(x)} ${f1(y)} L${f1(x)} ${f1(y - s * 0.7)} M${f1(x - s * 0.22)} ${f1(y - s * 0.48)} L${f1(x + s * 0.22)} ${f1(y - s * 0.48)}" stroke="${G.gold}" stroke-width="${f1(s * 0.08)}"/><path d="M${f1(x - 0.6)} ${f1(y - 1)} L${f1(x - 0.6)} ${f1(y - s * 0.66)}" stroke="#d8b860" stroke-width="${f1(s * 0.025)}" opacity="0.8"/>`); }
    lantern(-1.25, 3.1, z0 - 0.1, K(z0) * 0.2, [-1.25, 3.1, z0 - 0.1]); lantern(1.25, 3.1, z0 - 0.1, K(z0) * 0.2, [1.25, 3.1, z0 - 0.1]);
    // the rubric banner: red cloth (rubric), a bone-thread band, a mended tear
    { const [x0b, y0b] = P(-2.2, 4.6, ZA - 0.05), [x1b, y1b] = P(-1.8, 1.2, ZA - 0.05);
      raw(cel([[x0b, y0b], [x1b, y0b], [x1b, y1b], [(x0b + x1b) / 2, y1b - 6], [x0b, y1b]], { Z: ZA, fill: G.redD, band: 1.2 }) + `<path d="M${f1(x0b + 2)} ${f1(y0b + 10)} L${f1(x1b - 2)} ${f1(y0b + 10)}" stroke="#b8ac8a" stroke-width="1.3" opacity="0.8"/>` + stain(x0b + 4, (y0b + y1b) / 2, 6, '#140a08', 0.5)); }
    candles(-1.1, z0 - 0.4, 6, 0, 0.7); candles(1.1, z0 - 0.4, 5, 0, 0.6);
    const ps = [P(-2.1, 0, z0 - 1.6), P(2.1, 0, z0 - 1.6), P(1.9, hG + 0.9, z0), P(-1.9, hG + 0.9, z0)];
    HOTF('church', 'The abbey church', ps);
    outline('church', [[door, 1], ...stoneTrace(atP, 0.6, 2.4, 2.2, 0.9, 0.28, [0, 0, -1]), [[[x0 - 0.2, hW, z0], [0, hG + 0.1, z0], [x1 + 0.2, hW, z0]]]]);
  }
}
// ------------------------------------------------------------------ the sacristy: a low stone lean-to against the church, north-east (clickable)
{
  const z0 = 27.0, x0 = 5.6, x1 = 9.6, h = 3.4;
  roof([x0 - 0.2, h, z0 - 0.3], [x1, h, z0 - 0.3], [x1, 5.0, 30], [x0 - 0.2, 5.0, 30], '#4a4642', { courses: 4, holes: 0.03, moss: 3 });
  { const q = [[x0, 0, z0], [x0, 0, 30], [x0, 5.0, 30], [x0, h, z0]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: z0, fill: dark(STONE, 0.15), band: 1 }))); }
  raw(stones((s, t) => [x0, t, z0 + s], 3, h, STONE, { course: 0.45, block: 0.8 }));
  shade([[x0, 0, z0], [x0, 0, 30], [x0, h, 30], [x0, h, z0]]);
  const atS = (s, t) => [x0 + s, t, z0];
  raw(stones(atS, x1 - x0, h, STONE2, { course: 0.42, block: 0.8, streaks: 5 }));
  shade([atS(0, 0), atS(4, 0), atS(4, h), atS(0, h)]);
  const door = archPts(atS, 0.9, 2.0, 0, 1.9, 0.55, 8);
  litHole(door, z0, { r: 1.8, op: 0.5, top: '#6a3010', bot: '#f8c070' });
  through(door, () => { candles(x0 + 1.6, z0 + 0.8, 3, 0.9, 0.3); raw(`<path d="${pp([atS(1.5, 1.0), atS(1.7, 1.0), atS(1.7, 1.9), atS(1.5, 1.9)])}" fill="#2a160a"/>`); });
  // the door swung half open: iron-bound leaf, a heavy lock, light down its edge
  raw(planks((s, t) => [x0 + 0.9 + s * 0.55, t, z0 - s * 0.5], 0.95, 2.3, '#3a2a1e', { board: 0.2, nails: 8 }));
  for (const t of [0.5, 1.6]) raw(seg([x0 + 0.9, t, z0], [x0 + 1.42, t, z0 - 0.47], '#1a1816', 3.2));
  raw(archRing(atS, 0.9, 2.0, 1.9, 0.55, 0.24, STONE2, 7));
  windowOn((s, t) => [x0 + 2.6 + s, t, z0], 0, 0.6, 1.4, 2.6, 'lit');
  raw(seg([x0 + 2.65, 1.6, z0], [x0 + 3.15, 1.6, z0], INK, 2) + seg([x0 + 2.75, 1.4, z0], [x0 + 2.75, 2.5, z0], INK, 1.6) + seg([x0 + 3.05, 1.4, z0], [x0 + 3.05, 2.5, z0], INK, 1.6));
  HOTF('sacristy', 'Sacristy', [P(4.9, 0, z0 - 0.6), P(7.25, 0, z0 - 0.6), P(7.25, h + 0.5, z0), P(4.9, h + 0.5, z0)]);
  outline('sacristy', [[door, 1], ...stoneTrace(atS, 0.9, 2.0, 1.9, 0.55, 0.24, [0, 0, -1])]);
}
// ------------------------------------------------------------------ the ranges: two storeys, slate roofs, walls patched and propped
function range(side) {
  capStart();
  const X = 9.5 * side, z0 = 8.0, z1 = 30, h = 7.0, ridgeX = 13.5 * side;
  roof([X, h, z0], [X, h, z1], [ridgeX, 10.5, z1], [ridgeX, 10.5, z0], side > 0 ? '#4c4844' : '#3e3b38', { courses: 8, holes: 0.05, moss: 14, patches: [[0.55, 0.15, 0.12, 0.35], [0.2, 0.4, 0.06, 0.3]] });
  const at = (s, t) => [X, t, z0 + s];
  raw(stones(at, z1 - z0, h, side > 0 ? STONE2 : STONE, { course: side > 0 ? 0.48 : 0.4, block: side > 0 ? 1.0 : 0.8, streaks: 26, holes: 0.012, rubble: 5 }));
  raw(PLW([at(0, 0), at(1, 0), at(0, 1)], render(at, z1 - z0, h, 7)));
  for (const z of [10.5, 13.2, 19.6, 27.4]) { const [x, y] = P(X, 0, z); raw(bloom(x, y - 4, K(z) * 0.7, '#1e2414', 0.3)); }
  for (const z of [11.8, 18.6, 28.8]) { const [x, y] = P(X, 0, z); raw(creeper(x, y, K(z) * (3 + R() * 3), K(z) * 0.6)); }
  // a gutter spout broken off, a black run of water staining down the wall below it (hatched run)
  for (const z of [12.5, 21.0, 26.6]) raw(PLW([at(0, 0), at(1, 0), at(0, 1)], hatch3(at, z - z0 - 0.15, z - z0 + 0.15, 0.4, h, Math.PI / 2, { op: 0.4, ragged: 0.15 })));
  // a string course between the floors and the eaves cornice
  for (const [t, d] of [[3.6, 0.22], [h - 0.25, 0.3]]) { const q = [at(0, t), at(z1 - z0, t), at(z1 - z0, t + d), at(0, t + d)]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: 15, fill: light(STONE2, 0.08), band: 1.2 }) + hatch3(at, 0, z1 - z0, t, t + d * 0.35, 0.9, { op: 0.35 }))); }
  raw(PLW([at(0, 0), at(1, 0), at(0, 1)], `<path d="${pp([at(0, 0), at(z1 - z0, 0), at(z1 - z0, 0.9), at(16, 1.4), at(9, 0.8), at(4, 1.6), at(0, 1.0)])}" fill="#34402a" opacity="0.3"/>`));
  capEnd();
  return at;
}
// east range (lit side: faces west, toward the light)
{
  const at = range(1), s0 = 8.0;
  const Zs = z => z - s0;
  for (const z of [14.6, 16.4, 18.2, 20.0, 22.6, 28.4]) windowOn(at, Zs(z), Zs(z) + 0.8, 4.3, 6.3, { 28.4: 'boarded', 16.4: 'shutter', 18.2: 'dark', 22.6: 'dark' }[z] || 'lit');
  raw(PLW([at(0, 0), at(1, 0), at(0, 1)], S.crack(at, Zs(29.4), 7, 3.2, -Math.PI / 2 - 0.1, { w: 1.6 })));
  for (const z of [27.6, 29.8]) raw(beam([9.2, 0, z], [9.3, 7.6, z], 4, '#6a5a44'));
  for (const t of [3.9, 6.6]) raw(beam([9.25, t, 27.4], [9.25, t, 30], 3.4, '#6a5a44'));
  raw(seg([9.25, 0.2, 27.6], [9.25, 3.9, 29.8], INK, 3) + seg([9.25, 4.0, 27.6], [9.25, 6.6, 29.8], INK, 3));
  // ------------------------------------------------------------ Infirmarium door (nearest), with the sick laid out under a sailcloth awning
  {
    const d = archPts(at, Zs(15.0), Zs(16.4), 0, 2.2, 0.7, 8);
    litHole(d, 15.7, { r: 2.4, op: 0.55, top: '#5a2a0e', bot: '#f6b060' });
    through(d, () => { raw(seg([9.7, 0.7, 15.2], [9.7, 0.7, 16.2], '#2a160a', 4)); candles(9.7, 15.9, 2, 1.0, 0.3); });
    raw(archRing(at, Zs(15.0), Zs(16.4), 2.2, 0.7, 0.25, STONE2, 7));
    // a bundle of drying herbs over the door
    { const [x, y] = P(9.4, 3.3, 15.7), s = K(15.7); raw(seg([9.45, 3.4, 15.7], [9.0, 3.4, 15.7], INK, 3) + `<path d="M${f1(x - s * 0.28)} ${f1(y)} l${f1(-s * 0.05)} ${f1(s * 0.35)} M${f1(x - s * 0.22)} ${f1(y)} l${f1(s * 0.02)} ${f1(s * 0.4)} M${f1(x - s * 0.33)} ${f1(y)} l${f1(-s * 0.1)} ${f1(s * 0.3)}" stroke="#4a5a32" stroke-width="${f1(s * 0.05)}"/>`); }
    // the sailcloth awning on two poles: a flat cel, sagging, its underside hatched, a blood stain where the sick lie under it
    { const aw = [[9.5, 2.9, 13.4], [9.5, 2.9, 16.7], [7.6, 2.3, 16.6], [7.4, 2.2, 13.6]], [atw, Lsw, Ltw] = quad(aw);
      raw(PLW([aw[0], aw[1], aw[3]], cel(aw.map(p => P(...p)), { Z: 15, fill: '#6e685a', band: 2, tex: 'url(#mottle)', texOp: 0.4 }) + hatch3(atw, 0, Lsw, 0, Ltw * 0.55, 0.3, { op: 0.35, ragged: 0.3 }) +
        stain(...P(8.4, 2.6, 15.2), 18, '#3a3022', 0.45) + stain(...P(8.8, 2.7, 16.6), 9, G.blood, 0.35))); }
    for (const z of [13.6, 16.6]) raw(beam([7.5, 0, z], [7.5, 2.3, z], 3, TIMBER));
    HOTF('infirmarium', 'Infirmarium', [P(9.5, 0, 14.9), P(9.5, 0, 16.9), P(9.5, 3.6, 16.9), P(9.5, 3.6, 14.9)].map((p, i) => i < 2 ? [p[0] - 18, p[1] + 14] : p));
    outline('infirmarium', [[d, 1], ...stoneTrace(at, Zs(15.0), Zs(16.4), 2.2, 0.7, 0.25, [-1, 0, 0])]);
  }
  // ------------------------------------------------------------ external stair up to the Scriptorium (clickable)
  {
    const zb = 21.8, zt = 25.2, ZE = 26.7, xi = 7.7, hT = 3.8, n = 11;
    const side = [[xi, 0, zb]]; for (let i = 0; i < n; i++) { const z0 = zb + (zt - zb) * i / n, z1 = zb + (zt - zb) * (i + 1) / n, t = hT * (i + 1) / n; side.push([xi, t, z0], [xi, t, z1]); }
    side.push([xi, hT, ZE], [xi, 0, ZE]);
    raw(PLW([[xi, 0, zb], [xi, 1, zb], [xi, 0, zb + 1]], `<path d="${pp(side)}" fill="${dark(STONE2, 0.1)}"/>`));
    raw(stones((s, t) => [xi, t, zb + s], ZE - zb, hT, STONE2, { course: 0.42, block: 0.7, skip: (s0b, s1b, t0b) => t0b > (s0b) * hT / (zt - zb) + 0.1 && s1b < zt - zb }));
    raw(`<path d="${pp(side)}" fill="none" stroke="${INK}" stroke-width="1.8"/>`);
    for (let i = 0; i < n; i++) { const z0 = zb + (zt - zb) * i / n, z1 = zb + (zt - zb) * (i + 1) / n, t = hT * (i + 1) / n, q = [[xi, t, z0], [9.5, t, z0], [9.5, t, z1], [xi, t, z1]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: z0, fill: light(STONE2, 0.12), band: 0.8 }))); }
    for (let i = 0; i < n; i++) { const z0 = zb + (zt - zb) * i / n, t = hT * (i + 1) / n, q = [[xi, t - hT / n, z0], [9.5, t - hT / n, z0], [9.5, t, z0], [xi, t, z0]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: z0, fill: mix(STONE2, '#120e0a', 0.25 + R() * 0.15), band: 1 }))); }
    { const q = [[xi, hT, zt], [9.5, hT, zt], [9.5, hT, ZE], [xi, hT, ZE]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: zt, fill: light(STONE2, 0.1), band: 1 }))); }
    grade((s, t) => [xi, t, zb + s], ZE - zb, hT, [[xi, 0, zb], [xi, 1, zb], [xi, 0, zb + 1]], { bias: 0.08 });
    // landing door, rope rail on iron stanchions
    const d = archPts(at, Zs(25.6), Zs(26.5), 3.8, 5.6, 0.45, 8);
    litHole(d, 26, { r: 1.4, op: 0.45 });
    raw(archRing(at, Zs(25.6), Zs(26.5), 5.6, 0.45, 0.2, STONE2, 7));
    for (let i = 0; i <= 3; i++) { const z = zb + 0.4 + (zt - zb - 0.4) * i / 3, t = hT * (z - zb) / (zt - zb); raw(seg([xi + 0.05, t, z], [xi + 0.05, t + 1.0, z], '#2a2826', 2.2)); }
    { const pts = Array.from({ length: 8 }, (_, i) => { const z = zb + 0.4 + (zt - zb - 0.4 + 1.2) * i / 7, t = Math.min(hT, hT * (z - zb) / (zt - zb)) + 1.0 - Math.sin(i * 1.1) * 0.08; return P(xi + 0.05, t, Math.min(ZE - 0.1, z)); }).concat([P(9.45, hT + 1.0, ZE - 0.1)]); raw(`<path d="${smooth(pts, false, 0.7)}" stroke="${INK}" stroke-width="3.4" fill="none"/><path d="${smooth(pts, false, 0.7)}" stroke="#8a7a5a" stroke-width="1.8" fill="none"/>`); }
    lantern(9.2, 5.9, 25.3, 7, [9.2, 5.9, 25.3]); candles(8.4, 25.9, 2, hT, 0.3);
    // a lamp on a post at the foot of the stair, so the flight reads from the garth
    raw(beam([7.25, 0, 21.4], [7.25, 1.9, 21.4], 3.2, TIMBER) + seg([7.25, 1.85, 21.4], [7.05, 1.85, 21.4], INK, 4));
    lantern(7.05, 1.72, 21.4, 8, [7.05, 1.72, 21.4]);
    HOTF('scriptorium', 'Scriptorium', [P(xi - 0.3, 0, zb - 0.3), P(xi - 0.3, 0, 26.6), P(9.5, 6.6, 26.6), P(9.5, 6.6, 24.6), P(xi - 0.3, 1.6, zb - 0.3)]);
    outline('scriptorium', [[side.slice(1)], [d, 1], ...stoneTrace(at, Zs(25.6), Zs(26.5), 5.6, 0.45, 0.2, [-1, 0, 0], 3.8, false)]);
  }
  // ------------------------------------------------------------ the Chapter House: a broad arch flanked by two openings (clickable)
  {
    const zA = 18.0, zB = 20.0;
    const d = archPts(at, Zs(zA), Zs(zB), 0, 2.4, 1.0, 12);
    litHole(d, 19.0, { r: 2.4, op: 0.4, top: '#5a2c10', bot: '#e89a48' });
    raw(archRing(at, Zs(zA), Zs(zB), 2.4, 1.0, 0.3, STONE2, 11) + archRing(at, Zs(zA) - 0.3, Zs(zB) + 0.3, 2.4, 1.3, 0.22, STONE, 13));
    for (const z of [16.9, 20.5]) { const w = archPts(at, Zs(z), Zs(z) + 0.6, 0.8, 2.2, 0.3, 6); litHole(w, z, { r: 0.8, op: 0.3 }); raw(seg([9.5, 0.8, z + 0.3], [9.5, 2.5, z + 0.3], INK, 2.4)); }
    through(d, () => raw(seg([9.6, 0.5, zA + 0.2], [9.6, 0.5, zB - 0.2], '#3a2010', 4) + seg([9.7, 0, 19.2], [9.7, 1.3, 19.2], '#2a160a', 4)));
    // two banners of the house, rubric red, frayed (the same judgment as the Chapter House interior: rubric, kept)
    for (const z of [zA - 0.35, zB + 0.35]) { const [x0b, y0b] = P(9.45, 3.4, z), [x1b, y1b] = P(9.45, 1.2, z + 0.25); raw(cel([[x0b - 3, y0b], [x0b + 4, y0b], [x1b + 4, y1b], [x1b, y1b - 5], [x1b - 3, y1b]], { Z: z, fill: G.redD, band: 1 })); }
    HOTF('chapter', 'Chapter House', [P(9.5, 0, 17.3), P(9.5, 0, 20.8), P(9.5, 3.8, 20.8), P(9.5, 3.8, 17.3)].map((p, i) => i < 2 ? [p[0] - 14, p[1] + 10] : p));
    outline('chapter', [[d, 1], ...stoneTrace(at, Zs(zA) - 0.3, Zs(zB) + 0.3, 2.4, 1.3, 0.22, [-1, 0, 0]), ...[16.9, 20.5].map(z => [archPts(at, Zs(z), Zs(z) + 0.6, 0.8, 2.2, 0.3, 6), 1])]);
  }
  torch(9.45, 2.6, 12.9, [-1, 0, 0]); torch(9.45, 2.9, 21.4, [-1, 0, 0]);
  capStart(); shade([at(0, 0), at(22, 0), at(22, 7), at(0, 7)]); capEnd();
}
// west range (shadow side: faces east, away from the light)
{
  const at = range(-1), s0 = 8.0, Zs = z => z - s0;
  for (const z of [14.2, 16.0, 19.6, 23.2, 25.0, 26.8, 28.6]) windowOn(at, Zs(z), Zs(z) + 0.7, 4.3, 6.0, { 14.2: 'boarded', 16.0: 'dark', 19.6: 'shutter', 25.0: 'dark', 28.6: 'shutter' }[z] || 'lit');
  // laundry hung from the dormitory windows on a pole
  { const pts = [[-9.5, 6.0, 26.8], [-8.6, 5.4, 27.6], [-9.5, 6.0, 28.6]]; raw(seg(pts[0], [-8.4, 5.9, 27.7], INK, 2.4) + seg([-8.4, 5.9, 27.7], pts[2], INK, 2.4)); for (const [dz, c] of [[0.2, CLOTH], [0.6, '#6a7074'], [1.1, SAIL]]) { const [x, y] = P(-8.9, 5.85, 26.9 + dz), s = K(27.5); raw(cel([[x - s * 0.15, y], [x + s * 0.12, y], [x + s * 0.14, y + s * 0.5], [x, y + s * 0.42], [x - s * 0.16, y + s * 0.55]], { Z: 27, fill: c, band: 1 })); } }
  // ------------------------------------------------------------ Cellarium: wide cart doors, a hoist beam and pulley above (clickable)
  {
    const zA = 20.2, zB = 23.4;
    const d = archPts(at, Zs(zA), Zs(zB), 0, 2.4, 0.7, 12);
    litHole(d, 21.8, { r: 2.2, op: 0.45, top: '#4a220c', bot: '#e8a050' });
    through(d, () => { for (let i = 0; i < 4; i++) { const [x, y] = P(-9.8, 0.4, 20.6 + i * 0.7), k = K(21.8); raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(k * 0.12)}" ry="${f1(k * 0.3)}" fill="#3a2010" stroke="${INK}" stroke-width="1.2"/><path d="M${f1(x)} ${f1(y - k * 0.3)} L${f1(x)} ${f1(y + k * 0.3)}" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`); } });
    raw(archRing(at, Zs(zA), Zs(zB), 2.4, 0.7, 0.3, STONE, 11));
    raw(planks((s, t) => [-9.5 + s * 0.8, t, zA - s * 0.55], 1.5, 2.4, '#3e3024', { board: 0.22, nails: 6 }) + planks((s, t) => [-9.5 + s * 0.8, t, zB + s * 0.4], 1.5, 2.4, '#463628', { board: 0.22, nails: 6 }));
    windowOn(at, Zs(21.4), Zs(22.2), 4.0, 6.0, 'dark');
    raw(beam([-9.5, 6.6, 21.8], [-7.8, 6.6, 21.8], 8, TIMBER) + beam([-9.5, 5.6, 21.8], [-8.6, 6.55, 21.8], 4, TIMBER));
    { const [px, py] = P(-8.0, 6.35, 21.8); raw(`<circle cx="${f1(px)}" cy="${f1(py)}" r="7" fill="#3a3632" stroke="${INK}" stroke-width="2"/><circle cx="${f1(px)}" cy="${f1(py)}" r="2" fill="${INK}"/>`); }
    raw(seg([-8.0, 6.3, 21.8], [-8.0, 2.6, 21.8], INK, 3.4) + seg([-8.0, 6.3, 21.8], [-8.0, 2.6, 21.8], '#9a8a68', 1.8) + seg([-7.86, 6.3, 21.8], [-8.4, 0.5, 21.0], '#9a8a68', 1.6));
    sackLater.push([-8.0, 21.8, 1.9]);
    HOTF('cellarium', 'Cellarium', [P(-8.6, 0, 19.9), P(-8.6, 0, 23.6), P(-9.5, 6.8, 23.6), P(-9.5, 6.8, 19.9)]);
    outline('cellarium', [[d, 1], ...stoneTrace(at, Zs(zA), Zs(zB), 2.4, 0.7, 0.3, [1, 0, 0])]);
  }
  // ------------------------------------------------------------ Undercroft smithy: steps down through the walk, forge-light rising (clickable)
  {
    const za = 14.6, zb = 18.2, xi = -8.0;
    const hole = [[-9.5, 0, za], [xi, 0, za], [xi, 0, zb], [-9.5, 0, zb]];
    const [hx, hy] = P(-8.75, 0, 16.4);
    raw(PLW(GROUND, `<path d="${pp(hole)}" fill="#1a0e08" stroke="${INK}" stroke-width="1.6"/>`));
    { const dp = archPts((u, t) => [-9.5, t, u], 15.4, 17.4, -1.2, 0.6, 1.0, 10), above = [[-9.5, 0, 15.0], [-9.5, 0, 17.8], [-9.5, 3, 17.8], [-9.5, 3, 15.0]];
      addLight(-8.85, 0.15, 16.4, 3.2, 9, [1.0, 0.45, 0.16]);
      through(above, () => { litHole(dp, 16.4, { r: 3, op: 0.7, top: '#ff8a3a', bot: '#ffe09a', soot: false, I: 0.01, range: 1, col: [1.0, 0.45, 0.16] });
        raw(archRing((u, t) => [-9.5, t, u], 15.4, 17.4, 0.6, 1.0, 0.32, STONE2, 11)); });
      const [ax, ay] = P(-9.5, 0.3, 16.6), k = K(16.6); through(dp, () => raw(`<path d="M${f1(ax - k * 0.2)} ${f1(ay)} l${f1(k * 0.5)} 0 l${f1(-k * 0.1)} ${f1(k * 0.12)} l${f1(-k * 0.1)} 0 l0 ${f1(k * 0.14)} l${f1(k * 0.14)} ${f1(k * 0.06)} l${f1(-k * 0.5)} 0 l${f1(k * 0.14)} ${f1(-k * 0.06)} l0 ${f1(-k * 0.14)} l${f1(-k * 0.16)} ${f1(-k * 0.06)} Z" fill="#0e0a08"/>`)); }
    // the treads going down, lit warmer the deeper they go (stepped, no gradient), seen only through the stairwell
    raw(EM(`<path d="${pp(hole)}" fill="#3a1408"/>`));
    through(hole, () => { for (let i = 0; i < 6; i++) { const z = za + 0.05 + i * 0.16, t = -0.25 * (i + 1), q = [[-9.5, t, z], [xi, t, z], [xi, t + 0.25, z], [-9.5, t + 0.25, z]]; raw(EM(cel(q.map(p => P(...p)), { Z: z, fill: mix('#3a1e10', '#e07a30', i / 6), band: 1.2, hatch: false }))); } });
    raw(glow(...P(-9.5, 2.2, 16.4), K(16.4) * 0.9, K(16.4) * 1.1, '#ff8a3a', 0.35));
    raw(glow(hx, hy - 10, 150, 120, GLOWC, 0.7) + glow(hx, hy, 60, 45, '#ffd27a', 0.55) + smoke([[hx, hy - 10], [hx + 6, hy - 70], [hx + 30, hy - 130], [hx + 80, hy - 190]], 30, 0.18));
    // a broken kerb round the well of the steps, an iron rail bent and rusted
    raw(PLW([[xi, 0, za], [xi, 1, za], [xi, 0, zb]], cel([[xi, 0, za], [xi, 0, zb], [xi, 0.25, zb], [xi, 0.3, 16.2], [xi, 0.22, za]].map(p => P(...p)), { Z: 16, fill: STONE2, band: 1 })));
    for (const z of [za + 0.2, 15.8, 17.0, zb - 0.1]) raw(seg([xi + 0.05, 0.2, z], [xi + 0.05, 1.0, z], INK, 3.4) + seg([xi + 0.05, 0.2, z], [xi + 0.05, 1.0, z], '#5a3a2a', 1.8));
    raw(seg([xi + 0.05, 1.0, za + 0.2], [xi + 0.05, 0.95, 16.6], INK, 3.4) + seg([xi + 0.05, 0.95, 16.6], [xi + 0.05, 0.7, zb - 0.1], INK, 3.4) + seg([xi + 0.05, 1.0, za + 0.2], [xi + 0.05, 0.95, 16.6], '#6a4a38', 1.8));
    // an anvil sign on a bracket
    { const [x, y] = P(-8.4, 3.3, 14.8), s = K(14.8); raw(beam([-9.5, 3.5, 14.8], [-8.0, 3.5, 14.8], 4, '#2a2826') + seg([-9.5, 2.8, 14.8], [-8.6, 3.45, 14.8], INK, 3) + `<path d="M${f1(x - s * 0.1)} ${f1(y)} l0 ${f1(s * 0.1)} M${f1(x + s * 0.4)} ${f1(y)} l0 ${f1(s * 0.1)}" stroke="${INK}" stroke-width="2"/>`);
      raw(cel([[x - s * 0.3, y + s * 0.1], [x + s * 0.6, y + s * 0.1], [x + s * 0.45, y + s * 0.32], [x + s * 0.27, y + s * 0.32], [x + s * 0.27, y + s * 0.48], [x + s * 0.49, y + s * 0.58], [x - s * 0.21, y + s * 0.58], [x + s * 0.01, y + s * 0.48], [x + s * 0.01, y + s * 0.32], [x - s * 0.19, y + s * 0.24]], { Z: 14.8, fill: '#2e2c2a', band: 1.6 }) + `<path d="M${f1(x - s * 0.2)} ${f1(y + s * 0.13)} l${f1(s * 0.6)} 0" stroke="#8a8680" stroke-width="1.4" opacity="0.7"/>`);
      lantern(-9.3, 2.4, 14.6, 8, [-9.3, 2.4, 14.6]); }
    raw(embers(hx, hy - 30, 70, 16));
    HOTF('undercroft', 'Undercroft smithy', [P(-7.6, 0, 14.0), P(-7.9, 0, 18.0), P(-9.5, 4.0, 18.0), P(-9.5, 4.0, 14.0)]);
    outline('undercroft', [[arcPts((u, t) => [-9.5, t, u], 15.4, 17.4, 0.6, 1.0).filter(p => p[1] >= 0)], [arcPts((u, t) => [-9.5, t, u], 15.08, 17.72, 0.6, 1.32).filter(p => p[1] >= 0)], [hole, 1]]);
  }
  // the smithy chimney: a stack through the roof, black smoke and sparks
  { const z = 16.2, x0 = -11.2, x1 = -10.4; capStart(); raw(stones((s, t) => [x0 + s, 8.0 + t, z], 0.8, 4.6, STONE, { course: 0.4, block: 0.4 })); raw(`<path d="${pp([[x0, 8.0, z], [x1, 8.0, z], [x1, 12.6, z], [x0, 12.6, z]])}" fill="none" stroke="${INK}" stroke-width="1.4"/>`); capEnd();
    const [cx, cy] = P(-10.8, 12.6, z); raw(glow(cx, cy, 30, 24, GLOWC, 0.4) + smoke([[cx, cy], [cx + 20, cy - 60], [cx + 90, cy - 120], [cx + 220, cy - 170], [cx + 420, cy - 200]], 40, 0.28, '#2a2624') + embers(cx + 10, cy - 20, 60, 10)); }
  // a plank lean-to along the west walk: refugees' bedding under it
  {
    const lq = [[-9.5, 3.0, 24.0], [-9.5, 3.0, 29.6], [-7.3, 2.2, 29.6], [-7.3, 2.2, 24.0]];
    raw(planks((s, t) => [-9.5 + t * 2.2 / 1.0, 3.0 - t * 0.8, 24.0 + s], 5.6, 1.0, '#4e3e2e', { board: 0.3, nails: 6, across: false }));
    raw(PLW([lq[0], lq[1], lq[3]], hatch3(quad(lq)[0], 0, quad(lq)[1], 0, quad(lq)[2], 0.4, { op: 0.3 })));
    for (const z of [24.1, 26.8, 29.5]) raw(beam([-7.4, 0, z], [-7.4, 2.25, z], 3, TIMBER));
  }
  torch(-9.45, 2.8, 18.95, [1, 0, 0]); torch(-9.45, 2.8, 24.0, [1, 0, 0]);
  capStart(); shade([at(0, 0), at(22, 0), at(22, 7), at(0, 7)], { bias: 0.1 }); capEnd();
}

// ------------------------------------------------------------------ props in the garth, far to near
const props = [];
const add = (Z, fn) => props.push([Z, () => { raw(`<g class="z_${Math.round(Z * 100)}">`); fn(); raw('</g>'); }]);
// a broken column stump (or a standing one with a fragment of arch): drum courses, base block, chipped crown
function column(X, z, hh, side) {
  fp(X, 0, z, (fg, u, k) => {
    const w = 0.2 * u, top = -hh * u;
    fg.part([[-w * 1.5, 0, 1], [-w * 1.5, -0.25 * u, 1], [w * 1.5, -0.25 * u, 1], [w * 1.5, 0, 1]], { fill: STONE2, shade: 0.4, tex: 'mottle' + fg.o.seed, texOp: 0.5 });
    fg.part([[-w, -0.25 * u, 1], [-w, top + w * 0.3, 1], [-w * 0.3, top, 1], [w * 0.4, top + w * 0.5, 1], [w, top + w * 0.1, 1], [w, -0.25 * u, 1]], { fill: STONE2, shade: 0.45, tex: 'mottle' + fg.o.seed, texOp: 0.5 });
    for (let t = -0.25 * u - 0.45 * u; t > top + w; t -= 0.45 * u) fg.line([[-w, t], [0, t + w * 0.12], [w, t]], 1.2 * k, INK, { op: 0.7 });
    fg.flat(ell([0, -0.35 * u], w * 0.9, 0.12 * u, 0, 10), '#3a4a2e', { op: 0.35 });
    if (hh > 3) { const sd = -side; fg.part([[-w, top], [w * 1.2, top - 0.12 * u], [sd * 0.9 * u, top - 0.6 * u], [sd * 1.3 * u, top - 0.2 * u], [sd * 1.2 * u, top + 0.05 * u], [sd * 0.7 * u, top - 0.3 * u], [0, top + 0.1 * u]], { fill: STONE2, shade: 0.4, tex: 'mottle' + fg.o.seed, texOp: 0.5 }); }
  });
}
for (const side of [-1, 1]) for (const z of [12.4, 15.0 + (side > 0 ? 2.2 : 0), 19.2, 22.4, 25.6, 28.4]) {
  if (side < 0 && z < 16) continue;
  if (side > 0 && z < 27) continue;
  add(z, () => {
    const X = 7.1 * side, s = K(z), hh = (side < 0 && z === 22.4) || (side > 0 && z === 25.6) ? 3.1 : 0.5 + R() * 1.8;
    const [x, y] = P(X, 0, z), [, yt] = P(X, hh, z), w = s * 0.2;
    column(X, z, hh, side);
    if (hh > 3) raw(crow(x - w * 0.2, yt - s * 0.2, s * 0.13, -side));
    for (let i = 0; i < 4; i++) { const rx = x + (R() - 0.3) * s * 0.9 * -side, ry = y + R() * s * 0.08, r = s * (0.06 + R() * 0.08); raw(cel(ell([rx, ry - r * 0.6], r, r * 0.7, R(), 7), { Z: z, fill: mix(STONE2, '#1a1410', R() * 0.3), band: Math.max(0.8, r * 0.3) })); }
  });
}
// graves: mounds, wooden crosses, one fresh grave with a digger and a shrouded body on a bier. The candles on the graves are
// the four grim placed (its lights 37-40 in this order), fixed here so the light list matches without grim's random draw.
const GRAVE_CANDLES = new Set(['-2.6,26.9', '-3.6,24.5', '-4.8,24.2', '-1.6,21.8']);
for (const [X, Z, fresh] of [[-6.2, 26.8], [-5.0, 26.8], [-3.8, 26.6], [-2.6, 26.9], [-6.0, 24.4], [-4.8, 24.2], [-3.6, 24.5], [-6.1, 21.8], [-4.4, 21.6, 1], [-2.0, 24.3], [-1.6, 21.8]]) {
  add(Z, () => {
    const s = K(Z), [x, y] = P(X, 0, Z);
    if (fresh) {
      raw(PLW(GROUND, `<path d="${pp([[X - 0.4, 0, Z - 0.9], [X + 0.4, 0, Z - 0.9], [X + 0.4, 0, Z + 0.9], [X - 0.4, 0, Z + 0.9]])}" fill="#0e0b08" stroke="${INK}" stroke-width="1.2"/>`));
      fp(X, 0, Z, (fg, u) => fg.part([[0.45 * u, 0.02 * u], [0.55 * u, -0.22 * u], [1.0 * u, -0.28 * u], [1.3 * u, 0.02 * u]], { fill: '#3a3026', shade: 0.4, tex: 'mottle' + fg.o.seed, texOp: 0.6 }));
      return;
    }
    const tilt = (R() - 0.5) * 0.25, chh = 0.8 + R() * 0.3, cxo = (R() - 0.5) * 0.1;
    fp(X, 0, Z, (fg, u, k) => {
      fg.part([[-0.45 * u, 0.03 * u], [-0.38 * u, -0.1 * u], [0, -0.16 * u], [0.38 * u, -0.1 * u], [0.45 * u, 0.03 * u]], { fill: '#40362a', shade: 0.4, tex: 'mottle' + fg.o.seed, texOp: 0.6 });
      const c0 = [cxo * u, -0.05 * u], top = [cxo * u + Math.sin(tilt) * chh * u, -chh * u], arm = 0.72;
      const ax = [cxo * u + Math.sin(tilt) * chh * arm * u, -chh * arm * u], dx = [Math.cos(tilt) * 0.22 * u, Math.sin(tilt) * 0.22 * u];
      const bw = 0.06 * u;
      fg.part([[c0[0] - bw / 2, c0[1], 1], [c0[0] + bw / 2, c0[1], 1], [top[0] + bw / 2, top[1], 1], [top[0] - bw / 2, top[1], 1]], { fill: '#6a5a44', shade: 0.4, cast: false, hatch: false });
      fg.part([[ax[0] - dx[0], ax[1] - dx[1] - bw / 2, 1], [ax[0] + dx[0], ax[1] + dx[1] - bw / 2, 1], [ax[0] + dx[0], ax[1] + dx[1] + bw / 2, 1], [ax[0] - dx[0], ax[1] - dx[1] + bw / 2, 1]], { fill: '#6a5a44', shade: 0.4, cast: false, hatch: false });
    });
    if (GRAVE_CANDLES.has(`${X},${Z}`)) candles(X + 0.2, Z - 0.3, 1, 0, 0.1);
  });
}
add(21.4, () => { folk(-3.4, 21.4, { pose: 'bend', arm: 'spade', col: '#3a3632', face: -1, bare: true }); });
add(20.6, () => { // the bier with a shrouded body
  const Z = 20.4, X = -2.4;
  fp(X, 0, Z, (fg, u, k) => {
    for (const dx of [-0.7, 0.7]) fg.line([[dx * u, 0], [dx * u, -0.55 * u]], 3 * k, INK, { straight: true });
    fg.part([[-1.0 * u, -0.52 * u, 1], [1.0 * u, -0.52 * u, 1], [1.0 * u, -0.58 * u, 1], [-1.0 * u, -0.58 * u, 1]], { fill: TIMBER, shade: 0.4, cast: false, hatch: false });
    const y = -0.55 * u;
    fg.part([[-0.85 * u, y], [-0.8 * u, y - 0.2 * u], [-0.5 * u, y - 0.26 * u], [0.3 * u, y - 0.22 * u], [0.75 * u, y - 0.16 * u], [0.85 * u, y]], { fill: '#b4ab98', tex: 'weave' + fg.o.seed, texOp: 0.4, shade: 0.42 });
    fg.line([[-0.5 * u, y - 0.24 * u], [-0.5 * u, y]], 1.4 * k, INK, { op: 0.6 }); fg.line([[0.2 * u, y - 0.22 * u], [0.2 * u, y]], 1.4 * k, INK, { op: 0.6 });
    fg.flat(ell([-0.1 * u, y - 0.1 * u], 0.15 * u, 0.06 * u, 0, 9), '#4a2a1a', { op: 0.45 });
  });
  const s = K(Z), [x, y] = P(X, 0.55, Z); raw(crow(x + s * 0.3, y - s * 0.3, s * 0.14, -1));
});
// herb beds behind wattle edging, mostly dead
for (const [X, Z] of [[4.2, 26.6], [5.9, 26.6], [4.2, 23.6], [5.9, 23.6], [4.2, 20.4], [5.9, 20.4]]) add(Z, () => {
  const x0 = X - 0.7, x1 = X + 0.7, z0 = Z - 1.0, z1 = Z + 1.0, h = 0.35;
  raw(PLW([[x0, h, z0], [x1, h, z0], [x0, h, z1]], `<path d="${pp([[x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]])}" fill="#2e261c" stroke="${INK}" stroke-width="1"/>`));
  raw(planks((s, t) => [x0 + s, t, z0], x1 - x0, h, '#5a4a32', { across: true, board: 0.12 }));
  for (let i = 0; i < 9; i++) { const [x, y] = P(x0 + 0.15 + R() * 1.1, h, z0 + 0.2 + R() * 1.6), s = K(Z); raw(`<path d="M${f1(x)} ${f1(y)} l${f1(-s * 0.08)} ${f1(-s * 0.22)} M${f1(x)} ${f1(y)} l${f1(s * 0.02)} ${f1(-s * 0.3)} M${f1(x)} ${f1(y)} l${f1(s * 0.1)} ${f1(-s * 0.18)}" stroke="${R() < 0.3 ? '#4a5a2e' : '#3a3020'}" stroke-width="${f1(Math.max(0.8, s * 0.025))}"/>`); }
});
// pilgrims kneeling at the church porch, an old monk with a staff going in
add(27.4, () => { folk(-1.0, 27.3, { pose: 'kneel', arm: 'pray', col: '#3a3634', face: 1 }); folk(1.2, 27.5, { pose: 'kneel', arm: 'pray', col: '#5a4a38', face: -1, bare: true, hair: '#6a6458' }); });
add(26.0, () => { folk(0.3, 26.0, { arm: 'staff', col: '#1e1a18', face: 1 }); });
add(27.6, () => { folk(-2.4, 27.7, { pose: 'sit', col: '#4a4440', face: 1 }); });
// the refugees' corner: sailcloth tents
add(12.8, () => {
  for (const [X, Z, w, hgt, col] of [[3.6, 12.6, 1.4, 1.3, '#8a8470'], [4.8, 12.0, 1.2, 1.2, '#7a7462']]) {
    fp(X, 0, Z, (fg, u, k) => {
      fg.part([[-w * 0.6 * u, 0, 1], [-0.06 * u, -hgt * u, 1], [w * 0.62 * u, 0, 1]], { fill: col, shade: 0.45, tex: 'weave' + fg.o.seed, texOp: 0.45 });
      fg.flat([[-w * 0.1 * u, 0, 1], [-0.05 * u, -(hgt - 0.3) * u, 1], [w * 0.2 * u, 0, 1]], '#100c0a');
      fg.line([[-0.06 * u, -hgt * u], [-w * 0.1 * u, 0]], 1.3 * k, INK, { op: 0.6, straight: true }); fg.line([[-0.06 * u, -hgt * u], [w * 0.25 * u, 0]], 1.3 * k, INK, { op: 0.6, straight: true });
      fg.flat(ell([0.2 * u, -0.4 * u], 0.25 * u, 0.15 * u, 0.3, 9), '#3a3022', { op: 0.35 });
      fg.line([[-0.06 * u, -hgt * u], [0.14 * u, -(hgt + 0.3) * u]], 3 * k, INK, { straight: true });
    });
  }
});
// the refugees' cooking fire between their tents (east garth), on bare mud, a pot on stones
add(12.6, () => {
  const X = 6.0, Z = 12.6, k = K(Z), [x, y] = P(X, 0, Z);
  folk(5.3, 12.9, { pose: 'sit', col: '#4a4038', face: 1 }); folk(6.8, 12.4, { pose: 'sit', col: '#3a4048', face: -1, bare: true, hair: '#3a2a1e' });
  addLight(X, 0.7, Z, 1.6, 6, [1.0, 0.5, 0.2]);
  // the hearth ring: the far stones, then the fire, then the near stones across its base (2026-11-24 draw-order fix)
  const ring = Array.from({ length: 7 }, (_, i) => { const t = i / 7 * Math.PI * 2, [sx, sy] = P(X + Math.cos(t) * 0.35, 0, Z + Math.sin(t) * 0.3); return [Math.sin(t), cel(ell([sx, sy - 2], k * 0.07, k * 0.049, R(), 7), { Z, fill: mix(STONE, '#1a1410', 0.3), band: 1 })]; });
  for (const [far, c] of ring) if (far > 0) raw(c);
  raw(glow(x, y - k * 0.3, k * 1.6, k * 1.2, GLOWC, 0.5));
  fire(X, 0.03, Z, k * 0.5, k * 0.45, 7);
  for (const [far, c] of ring) if (far <= 0) raw(c);
  raw(embers(x, y - k * 0.5, k * 0.6, 8));
  raw(cel([[x - k * 0.22, y - k * 0.42], [x - k * 0.24, y - k * 0.25], [x - k * 0.12, y - k * 0.15], [x + k * 0.12, y - k * 0.15], [x + k * 0.24, y - k * 0.25], [x + k * 0.22, y - k * 0.42]], { Z, fill: '#221e1c', band: 2 }));
  raw(smoke([[x, y - k * 0.6], [x + 4, y - k * 1.4], [x + 20, y - k * 2.4], [x + 50, y - k * 3.2]], k * 0.35, 0.18));
});
add(15.6, () => { folk(8.1, 14.4, { pose: 'lie', col: '#8a8270', face: 1 }); folk(8.3, 16.1, { pose: 'lie', col: '#6a6458', face: 1, blood: true }); folk(7.3, 15.4, { pose: 'bend', col: '#6a6052', face: 1, arm: 'bowl' }); });
add(22.6, () => { barrel(-8.4, 22.8); barrel(-7.8, 23.4); crate(-8.8, 20.2, 0.7); crate(-8.7, 20.3, 0.55, 0.7); });
// the well: a stone drum, a windlass under a small plank roof, a bucket, votive candles on the rim
const WELL = [-5.0, 17.6];
add(WELL[1], () => {
  const [X, Z] = WELL, r = 1.0, s = K(Z), hR = 0.95;
  const ell2 = (Y, rr) => { const [x, y] = P(X, Y, Z); return [x, y, rr * s, rr * FL * (E3 - Y) / (Z * Z)]; };
  const [x0, y0, rx0, ry0] = ell2(0, r), [x1, y1, rx1, ry1] = ell2(hR, r);
  raw(PLW(GROUND, `<path d="${smooth(ell([x0 + rx0 * 0.2, y0 + ry0 * 0.3], rx0 * 1.4, ry0 * 1.4, 0, 16), true, 0.8)}" fill="#0e0b08" opacity="0.4"/>`));
  // the drum: curved courses of rubble, each stone its own cel, darker away from the light
  let drum = `<path d="M${f1(x0 - rx0)} ${f1(y0)} A${f1(rx0)} ${f1(ry0)} 0 0 0 ${f1(x0 + rx0)} ${f1(y0)} L${f1(x1 + rx1)} ${f1(y1)} A${f1(rx1)} ${f1(ry1)} 0 0 1 ${f1(x1 - rx1)} ${f1(y1)} Z" fill="${mix(STONE2, INK, 0.6)}"/>`;
  const NC = 4;
  for (let c = 0; c < NC; c++) {
    const ta = c / NC, tb = (c + 1) / NC, yA = y0 + (y1 - y0) * ta, yB = y0 + (y1 - y0) * tb, ryA = ry0 + (ry1 - ry0) * ta, ryB = ry0 + (ry1 - ry0) * tb, rxA = rx0 + (rx1 - rx0) * ta, rxB = rx0 + (rx1 - rx0) * tb;
    let u = -1 + (c % 2) * 0.12;
    while (u < 1) {
      const du = 0.18 + R() * 0.16, u1 = Math.min(1, u + du), pts = [];
      for (const [uu, yy, rx, ry] of [[u + 0.012, yA, rxA, ryA], [u1 - 0.012, yA, rxA, ryA]]) pts.push([x0 + uu * rx, yy + Math.sqrt(Math.max(0, 1 - uu * uu)) * ry - 1]);
      for (const [uu, yy, rx, ry] of [[u1 - 0.012, yB, rxB, ryB], [u + 0.012, yB, rxB, ryB]]) pts.push([x0 + uu * rx, yy + Math.sqrt(Math.max(0, 1 - uu * uu)) * ry + 1]);
      const dk = 0.15 + Math.max(0, (u + 0.2)) * 0.25;
      drum += cel(chip(pts, 0.35), { Z, fill: mix(mix(STONE2, R() < 0.45 ? '#c8bca0' : '#120e0a', R() * 0.3), '#120e0a', dk), band: 1.6, tex: 'url(#mottle)', texOp: 0.35 });
      u = u1;
    }
  }
  raw(drum);
  raw(hatch3((u, t) => [X + 0.35 + u, t, Z - 0.5], 0, 0.8, 0, hR, 0.9, { op: 0.4 }) + stain(x0 - rx0 * 0.4, y0 - 10, 22, '#3a4a2e', 0.45));
  raw(cel(ell([x1, y1], rx1, ry1, 0, 24), { Z, fill: light(STONE2, 0.15), band: 2 }) + `<path d="${smooth(ell([x1, y1 + 1], rx1 * 0.78, ry1 * 0.7, 0, 20), true, 0.9)}" fill="#050403" stroke="${INK}" stroke-width="1.2"/>`);
  // posts, windlass, roof
  for (const dx of [-0.92, 0.92]) raw(beam([X + dx, hR, Z], [X + dx, 2.7, Z], s * 0.12, TIMBER));
  raw(beam([X - 1.0, 1.9, Z], [X + 1.0, 1.9, Z], s * 0.1, '#5a4632'));
  { const [cx, cy] = P(X - 0.1, 1.9, Z); raw(`<path d="M${f1(cx - s * 0.25)} ${f1(cy - s * 0.05)} c0 ${f1(s * 0.05)} ${f1(s * 0.5)} ${f1(s * 0.05)} ${f1(s * 0.5)} 0" stroke="#8a7a5a" stroke-width="${f1(s * 0.07)}" fill="none"/><path d="M${f1(cx - s * 0.25)} ${f1(cy - s * 0.05)} c0 ${f1(s * 0.05)} ${f1(s * 0.5)} ${f1(s * 0.05)} ${f1(s * 0.5)} 0" stroke="${INK}" stroke-width="1" fill="none" stroke-dasharray="3 3"/>`);
    const [hx, hy] = P(X + 1.0, 1.9, Z); raw(`<path d="M${f1(hx)} ${f1(hy)} l${f1(s * 0.12)} 0 l0 ${f1(s * 0.3)} l${f1(s * 0.12)} 0" stroke="${INK}" stroke-width="3" fill="none"/>`); }
  raw(planks((s2, t) => [X - 1.25 + s2, 2.55 + t * 0.7 / 0.6, Z - 0.5 + t * 0.5 / 0.6], 2.5, 0.6, '#4e3e2e', { board: 0.22, ragged: 0.1, nails: 4 }));
  raw(`<path d="${pp([[X - 1.25, 2.55, Z - 0.5], [X + 1.25, 2.55, Z - 0.5], [X + 1.1, 3.25, Z], [X - 1.1, 3.25, Z]])}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  // the rope down to a bucket hung on the rim
  { const [rx, ry] = P(X - 0.1, 1.9, Z), [bx, by] = P(X + 0.55, hR + 0.05, Z - 0.6), bs = s * 0.22; raw(`<path d="M${f1(rx)} ${f1(ry)} Q${f1(rx + 10)} ${f1((ry + by) / 2)} ${f1(bx)} ${f1(by - bs)}" stroke="#8a7a5a" stroke-width="2" fill="none"/>`);
    fp(X + 0.55, hR + 0.05, Z - 0.6, (fg, u, k) => { const b = 0.22 * u * s / K(Z - 0.6); fg.part([[-b * 0.8, -b, 1], [b * 0.8, -b, 1], [b * 0.6, b * 0.3, 1], [-b * 0.6, b * 0.3, 1]], { fill: '#5a4632', shade: 0.4, tex: 'wood' + fg.o.seed, texOp: 0.4, cast: false }); fg.line([[-b * 0.75, -b * 0.6], [b * 0.75, -b * 0.6]], 2.4 * k, '#2a2622', { straight: true }); }); }
  candles(X - 0.55, Z - 0.75, 3, hR, 0.4); candles(X + 0.05, Z - 0.9, 2, hR, 0.3);
  lantern(X + 0.6, 2.35, Z - 0.5, 6, [X + 0.6, 2.35, Z - 0.5, 0.3, 3]);
  raw(weed(x0 - rx0 * 0.8, y1 + 6, 22) + weed(x0 - rx0 * 0.6, y1 + 8, 18));
});
// ------------------------------------------------------------------ the near huts: Almonry (left), Guesthouse (right)
const HUTZ = 8.4;
function hut(side, o = {}) {
  capStart();
  const xi = 5.8 * side, xo = 9.6 * side, z0 = 3.0, z1 = o.z1 || HUTZ, hw = o.hw || 3.6, hr = o.hr || 4.8;
  // roof underside and the plank face of the far end wall
  { const q = [[xi - 0.3 * side, hw, z0], [xi - 0.3 * side, hw, z1 + 0.3], [xo, hr, z1 + 0.3], [xo, hr, z0]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: 6, fill: '#2e2620', band: 2 }) + hatch3(quad(q)[0], 0, quad(q)[1], 0, quad(q)[2], 0.6, { op: 0.4 }))); }
  raw(planks((s, t) => [xi + s * side, t, z1], Math.abs(xo - xi), hw, '#4a3a2a', { board: 0.3, nails: 10 }));
  shade([[xi, 0, z1], [xo, 0, z1], [xo, hw, z1], [xi, hw, z1]], { bias: 0.1 });
  // the garth-facing side wall: rubble footing, timber above
  const at = (s, t) => [xi, t, z0 + s];
  raw(stones(at, z1 - z0, 1.0, STONE, { course: 0.33, block: 0.6 }));
  if (!o.daub) raw(planks((s, t) => [xi, 1.0 + t, z0 + s], z1 - z0, hw - 1.0, '#54422e', { board: 0.28, nails: 24, ragged: 0.12 }));
  else {
    // daub panels between the timbers, cracked; two have fallen out to the woven wattle beneath
    const zs = [z0, 4.4, 5.6, 6.4, 7.4, z1], ts = [1.0, 2.3, hw];
    for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < ts.length - 1; j++) {
      const q = [[xi, ts[j], zs[i]], [xi, ts[j], zs[i + 1]], [xi, ts[j + 1], zs[i + 1]], [xi, ts[j + 1], zs[i]]], bare = (i === 1 && j === 1) || (i === 4 && j === 0);
      const [atq, Lsq, Ltq] = quad(q), Zq = (zs[i] + zs[i + 1]) / 2;
      if (bare) { // the wattle: woven rods, over-and-under, in shadow
        let wv = `<path d="${pp(q)}" fill="#2a1e10"/>`; for (let t = 0.04; t < Ltq; t += 0.09) wv += `<path d="${smooth(Array.from({ length: 9 }, (_, m) => P(...atq(Lsq * m / 8, t + Math.sin(m * 1.6 + t * 20) * 0.025))), false, 0.6)}" stroke="#6a5434" stroke-width="${f1(K(Zq) * 0.035)}" fill="none"/><path d="${smooth(Array.from({ length: 9 }, (_, m) => P(...atq(Lsq * m / 8, t + Math.sin(m * 1.6 + t * 20) * 0.025))), false, 0.6)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.6" transform="translate(0 1.2)"/>`;
        for (let s2 = 0.15; s2 < Lsq; s2 += 0.3) wv += seg(atq(s2, 0), atq(s2, Ltq), '#3a2a18', K(Zq) * 0.03);
        raw(PLW([q[0], q[1], q[3]], wv + hatch3(atq, 0, Lsq, 0, Ltq, 0.8, { op: 0.4 }))); continue; }
      let dp = cel(q.map(p => P(...p)), { Z: Zq, fill: mix('#6e6452', R() < 0.5 ? '#a89c80' : '#2a2218', R() * 0.25), band: 1.5, tex: 'url(#mottle)', texOp: 0.5 });
      for (let c = 0; c < 2; c++) dp += S.crack(atq, Lsq * (0.2 + R() * 0.6), Ltq * (0.3 + R() * 0.5), 0.4 + R() * 0.4, R() * 6.28, { w: 0.7, branch: 1 });
      dp += stain(...P(xi, (ts[j] + ts[j + 1]) / 2, Zq), 12, '#2a2014', 0.4);
      raw(PLW([q[0], q[1], q[3]], dp + planeShade(atq, Lsq, Ltq, normalOf(q[0], q[1], q[3]), { op: 0.36 })));
    }
    for (const t of ts) raw(beam([xi, t, z0], [xi, t, z1], 7, TIMBERD));
    raw(beam([xi, 1.0, 4.4], [xi, 2.3, 5.6], 5, TIMBERD) + beam([xi, 2.3, 7.4], [xi, hw, 8.4], 5, TIMBERD));
  }
  // timber frame: posts, sill, top plate
  for (const z of (o.daub ? [z0 + 0.1, 4.4, 5.6, 6.4, 7.4, z1 - 0.1] : [z0 + 0.1, 5.4, z1 - 0.1])) raw(beam([xi, 1.0, z], [xi, hw, z], K(z) * 0.17, TIMBERD, { tex: 'url(#mottle)' }));
  raw(beam([xi, 1.0, z0], [xi, 1.0, z1], 6, TIMBERD) + beam([xi, hw - 0.05, z0], [xi, hw - 0.05, z1], 7, TIMBERD));
  shade([at(0, 0), at(z1 - z0, 0), at(z1 - z0, hw), at(0, hw)], { bias: side < 0 ? 0.12 : 0, front: [3.0, 4.2, 0.5] });
  // mud splashed up the footing
  for (let z = z0 + 0.4; z < z1; z += 0.9) { const [x, y] = P(xi, 0.1, z); raw(bloom(x, y, K(z) * 0.3, '#1a140c', 0.35)); }
  // things hung on the wall: a coil of rope, a string of onions, a sickle
  for (const [z, t, kd] of [[z0 + 2.4, 2.6, 'rope'], [z0 + 3.0, 2.9, 'onions'], [z0 + 4.4, 2.8, 'sickle']]) {
    const [x, y] = P(xi, t, z), q = K(z);
    if (kd === 'rope') raw(`<ellipse cx="${f1(x)}" cy="${f1(y + q * 0.15)}" rx="${f1(q * 0.08)}" ry="${f1(q * 0.18)}" fill="none" stroke="${INK}" stroke-width="${f1(q * 0.05 + 1.5)}"/><ellipse cx="${f1(x)}" cy="${f1(y + q * 0.15)}" rx="${f1(q * 0.08)}" ry="${f1(q * 0.18)}" fill="none" stroke="#8a7a5a" stroke-width="${f1(q * 0.035)}"/>`);
    if (kd === 'onions') { raw(`<path d="M${f1(x)} ${f1(y)} L${f1(x)} ${f1(y + q * 0.5)}" stroke="#6a5a3a" stroke-width="1.6"/>`); for (let i = 0; i < 5; i++) raw(cel(ell([x + (i % 2 ? 3 : -3), y + q * (0.08 + i * 0.09)], q * 0.045, q * 0.042, 0, 8), { Z: z, fill: '#8a6a3a', band: 1.2 })); }
    if (kd === 'sickle') raw(`<path d="M${f1(x)} ${f1(y)} l0 ${f1(q * 0.2)} M${f1(x)} ${f1(y + q * 0.2)} q${f1(q * 0.25 * side)} ${f1(-q * 0.05)} ${f1(q * 0.22 * side)} ${f1(q * 0.25)}" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${f1(x)} ${f1(y + q * 0.2)} q${f1(q * 0.25 * side)} ${f1(-q * 0.05)} ${f1(q * 0.22 * side)} ${f1(q * 0.25)}" stroke="#7a7670" stroke-width="1.4" fill="none"/>`);
  }
  // the roof edge: a fascia board, a drip line
  { const q = [[xi - 0.35 * side, hw, z0], [xi - 0.35 * side, hw, z1 + 0.3], [xi - 0.35 * side, hw + 0.22, z1 + 0.3], [xi - 0.35 * side, hw + 0.22, z0]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: 5, fill: '#3a3632', band: 2 }))); }
  for (let z = z0 + 0.2; z < z1; z += 0.35) { const [x, y] = P(xi - 0.35 * side, hw, z); raw(`<path d="M${f1(x)} ${f1(y)} l0 ${f1(K(z) * (0.05 + R() * 0.2))}" stroke="#1a1612" stroke-width="${f1(Math.max(1, K(z) * 0.02))}" opacity="0.55" stroke-linecap="round"/>`); }
  capEnd();
  return at;
}
// a Living Ink keeper, drawn into the scene from its reviewed render (scenes/figs.js), at its feet (X, Z) in world metres
function keeperAt(file, X, Z, tag) {
  let svg = fs.readFileSync(file, 'utf8');
  const pre = `${tag}_`;
  svg = svg.replace(/id="([^"]+)"/g, `id="${pre}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${pre}$1)`).replace(/href="#([^"]+)"/g, `href="#${pre}$1"`);
  const defs = (svg.match(/<defs>([\s\S]*?)<\/defs>/) || [, ''])[1], body = svg.replace(/^[\s\S]*?<\/defs>/, '').replace(/<\/svg>\s*$/, '');
  S.DEFS.push(defs);
  const [x, y] = P(X, 0, Z), s = sc(Z);
  raw(`<g transform="translate(${f1(x - 300 * s)},${f1(y - 790 * s)}) scale(${s.toFixed(4)})">${body}</g>`);
}
const FIGS = path.join(__dirname, '..', 'out', 'scenes', 'hub', 'figs');
add(9.05, () => {
  // ---------------- the Almonry: the dole window where bread and broth go out, and the queue for it (clickable)
  const at = hut(-1);
  const zw0 = 6.6, zw1 = 7.8;
  const win = [at(zw0 - 3, 1.05), at(zw1 - 3, 1.05), at(zw1 - 3, 2.35), at(zw0 - 3, 2.35)];
  litHole(win, 7.2, { r: 2.2, op: 0.5, top: '#3a1a08', bot: '#d8843a' });
  through(win, () => {
    for (const t of [1.55, 2.0]) raw(seg([-6.3, t, 6.7], [-6.3, t, 7.7], '#2a160a', 3));
    for (let i = 0; i < 6; i++) { const [x, y] = P(-6.3, 2.0, 6.75 + i * 0.16); raw(cel(ell([x, y - 4], 4, 3.4, 0, 7), { Z: 7, fill: i % 2 ? '#8a5a2a' : '#5a4a3a', band: 1 })); }
  });
  // the shutter propped up on a stick
  raw(planks((s, t) => [-5.8 + t * 0.85, 2.35 + t * 0.45, zw0 + s], zw1 - zw0, 0.9, '#4a3a28', { board: 0.2, nails: 4 }));
  // Brother Fenn behind the hatch: the reviewed Living Ink keeper (his oldest ledger, sulphur-stained, under his arm)
  through(win, () => { raw(glow(...P(-6.9, 1.9, 7.6), 60, 55, GLOWC, 0.45)); keeperAt(path.join(FIGS, 'fenn_right.svg'), -6.55, 8.0, 'fenn'); });
  { const q = [[-5.8, 1.05, zw0 - 0.1], [-5.8, 1.05, zw1 + 0.1], [-5.45, 1.05, zw1 + 0.1], [-5.45, 1.05, zw0 - 0.1]]; raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: 7, fill: '#6a5440', band: 2, tex: 'url(#mottle)', texOp: 0.4 }))); }
  for (const z of [6.85, 7.25, 7.6]) fp(-5.62, 1.05, z, (fg, u) => PR.loaf(fg, 0, 0.2 * u, '#9a7040'));
  raw(beam([-5.52, 1.06, 7.5], [-5.08, 2.72, 7.5], 2.6, TIMBER));
  // the dole sign: a bowl and a loaf painted on a board, a chalked tally of the day's mouths
  { const s = K(5.9); const sg = [at(5.5 - 3, 2.5), at(6.3 - 3, 2.5), at(6.3 - 3, 3.2), at(5.5 - 3, 3.2)]; raw(PLW([sg[0], sg[1], sg[3]], cel(sg.map(p => P(...p)), { Z: 5.9, fill: '#7a6a50', band: 2 })));
    const [x, y] = P(-5.8, 2.85, 5.9); raw(`<path d="M${f1(x - s * 0.12)} ${f1(y - s * 0.02)} q${f1(s * 0.12)} ${f1(s * 0.14)} ${f1(s * 0.24)} 0 Z" fill="#3a2a1e" stroke="${INK}" stroke-width="1"/><ellipse cx="${f1(x + s * 0.02)}" cy="${f1(y - s * 0.08)}" rx="${f1(s * 0.07)}" ry="${f1(s * 0.04)}" fill="#9a7040" stroke="${INK}" stroke-width="1"/>`);
    for (let i = 0; i < 4; i++) { const [tx, ty] = P(-5.8, 1.9, 4.2 + i * 0.12); raw(`<path d="M${f1(tx)} ${f1(ty)} l0 ${f1(-K(4.2) * 0.3)}" stroke="#d8d0c0" stroke-width="2" opacity="0.7"/>`); }
    { const [tx, ty] = P(-5.8, 1.85, 4.15), [ux, uy] = P(-5.8, 2.15, 4.75); raw(`<path d="M${f1(tx)} ${f1(ty)} L${f1(ux)} ${f1(uy)}" stroke="#d8d0c0" stroke-width="2" opacity="0.7"/>`); } }
  lantern(-5.35, 3.25, 6.1, 8, [-5.35, 3.25, 6.1]);
  HOTF('almonry', 'Almonry', [P(-5.8, 0, 5.8), P(-5.8, 0, 8.4), P(-5.8, 3.6, 8.4), P(-5.8, 3.6, 5.8)].map((p, i) => i < 2 ? [p[0] + 50, p[1] + 10] : p));
  outline('almonry', [[win, 1], [[at(zw0 - 3.12, 0.95), at(zw0 - 3.12, 2.47), at(zw1 - 2.88, 2.47), at(zw1 - 2.88, 0.95)], 1], [[[-5.8, 1.05, zw0 - 0.1], [-5.45, 1.05, zw0 - 0.1], [-5.45, 1.05, zw1 + 0.1], [-5.8, 1.05, zw1 + 0.1]]]]);
  // ---------------- the Guesthouse: wattle-and-daub lodging, its door open (clickable)
  const gt = hut(1, { hw: 4.3, hr: 5.4, z1: 9.0, daub: true });
  const dz0 = 6.4, dz1 = 7.4;
  const dr = [gt(dz0 - 3, 0), gt(dz1 - 3, 0), gt(dz1 - 3, 2.3), gt(dz0 - 3, 2.3)];
  litHole(dr, 6.9, { r: 1.8, op: 0.3, top: '#1e0e06', bot: '#a8622a', I: 1.4, range: 6 });
  // inside: the hearth low at the back, and the Hosteller (Living Ink keeper) standing in the door with his lantern
  through(dr, () => {
    raw(`<path d="${pp(dr)}" fill="#1a0e06" opacity="0.5"/>`);
    const [x, y] = P(7.3, 0.3, 8.4); raw(glow(x, y, 80, 70, GLOWC, 0.6)); fire(7.3, 0.3, 8.4, 30, 16, 5);
    keeperAt(path.join(FIGS, 'hosteller_left.svg'), 6.25, 7.25, 'host');
  });
  windowOn(gt, 7.95 - 3, 8.55 - 3, 1.3, 2.6, 'lit');
  raw(planks((s, t) => [5.8 - s * 0.35, t, dz1 + s * 0.5], 0.95, 2.3, '#3a2c20', { board: 0.2, nails: 5 }));
  // the sign: a heavy old iron key on a board, hung from a bracket
  { const [bx, by] = P(5.8, 3.0, 5.5), [ex, ey] = P(4.9, 3.0, 5.5), s = K(5.5); raw(`<path d="M${f1(bx)} ${f1(by)} L${f1(ex)} ${f1(ey)}" stroke="${INK}" stroke-width="5"/><path d="M${f1(bx)} ${f1(by)} L${f1(ex)} ${f1(ey)}" stroke="#2a2826" stroke-width="2.6"/>`);
    raw(`<path d="M${f1(ex + s * 0.05)} ${f1(ey)} l0 ${f1(s * 0.12)} M${f1(ex + s * 0.45)} ${f1(ey)} l0 ${f1(s * 0.12)}" stroke="${INK}" stroke-width="1.6"/>` + cel([[ex - s * 0.05, ey + s * 0.12], [ex + s * 0.55, ey + s * 0.12], [ex + s * 0.55, ey + s * 0.5], [ex - s * 0.05, ey + s * 0.5]], { Z: 5.5, fill: '#6a5a44', band: 2.4, tex: 'url(#mottle)', texOp: 0.4 }));
    raw(`<circle cx="${f1(ex + s * 0.12)}" cy="${f1(ey + s * 0.31)}" r="${f1(s * 0.06)}" fill="none" stroke="${INK}" stroke-width="${f1(s * 0.035)}"/><path d="M${f1(ex + s * 0.18)} ${f1(ey + s * 0.31)} L${f1(ex + s * 0.45)} ${f1(ey + s * 0.31)} M${f1(ex + s * 0.4)} ${f1(ey + s * 0.31)} l0 ${f1(s * 0.06)} M${f1(ex + s * 0.34)} ${f1(ey + s * 0.31)} l0 ${f1(s * 0.05)}" stroke="${INK}" stroke-width="${f1(s * 0.035)}"/>` + stain(ex + s * 0.3, ey + s * 0.3, s * 0.15, '#140e0a', 0.35)); }
  lantern(5.35, 3.3, 6.0, 9, [5.35, 3.3, 6.0]);
  HOTF('guesthouse', 'Guesthouse', [P(5.8, 0, 5.8), P(5.8, 0, 9.0), P(5.8, 4.3, 9.0), P(5.8, 4.3, 5.8)].map((p, i) => i === 0 ? [p[0] - 50, p[1] + 10] : p));
  outline('guesthouse', [[dr, 1], ...stoneTrace(gt, dz0 - 3, dz1 - 3, 2.3, 0, 0.12, [-1, 0, 0], 0, true, true)]);
});
// the alms queue: ragged folk waiting at the dole window, one a child
add(7.6, () => { folk(-4.4, 8.3, { col: '#4a4440', face: -1, arm: 'bowl', lean: -4 }); folk(-3.5, 8.9, { col: '#5a4a3a', face: -1, bare: true, hair: '#4a3a2a', pack: '#7a6a4a', lean: -6 }); folk(-3.1, 9.4, { col: '#3a4048', face: -1, h: 1.05, bare: true, hair: '#2a2018', lean: 3 }); folk(-2.5, 10.0, { col: '#6a5a3a', face: -1, arm: 'staff', lean: -9 }); folk(-4.9, 9.8, { col: '#3e3832', face: -1, crutch: true, lean: 6 }); });
add(7.2, () => { folk(-5.0, 7.2, { col: '#3a3634', face: -1, arm: 'bowl', pose: 'stand' }); });
add(7.0, () => { barrel(5.2, 7.6); crate(4.9, 8.2, 0.6); sack(5.3, 7.0); });
add(9.9, () => { const [x, y] = P(WELL[0] + 0.6, 3.25, WELL[1]); raw(crow(x, y - 8, 9, -1)); });
sackLater.forEach(([X, Z, Y]) => add(Z - 0.05, () => sack(X, Z, Y)));
// the brazier's firelight pooled on the mud round the cross (painted, for the unlit preview only)
add(12.0, () => { const [x, y] = P(BRAZIER[0], 0, BRAZIER[1]); raw(glow(x, y + 10, 560, 170, '#ff9a3a', 0.42) + glow(x, y, 240, 80, '#ff9a3a', 0.4)); });
function drawBrazier() {
  raw('<g class="z_530">');
  const [X, Z] = BRAZIER, s = K(Z), [bx, by] = P(X, 1.0, Z);
  raw(glow(bx, by - s * 0.3, s * 3.2, s * 3, GLOWC, 0.4) + glow(bx, by - s * 0.2, s * 1.1, s * 1.0, '#ffd27a', 0.35));
  fp(X, 0, Z, (fg, u, k) => { // three iron legs splayed from the bowl to the mud
    for (const dx of [-0.32, 0.0, 0.32]) { const foot = [dx * 1.3 * u, (dx === 0 ? -0.06 : 0.03) * u], top = [dx * 0.5 * u, -0.95 * u]; fg.line([foot, top], 0.06 * u + 2.4 * k, INK, { straight: true }); fg.line([foot, top], 0.04 * u, '#3a3430', { straight: true }); }
  });
  addLight(X, 1.55, Z, 2.5, 11, [1.0, 0.52, 0.2]);
  // draw order (2026-11-24 fix): the inside of the bowl and its far inner wall glowing, the heaped coals, the flames rising
  // out of the coals, and only then the bowl's front, so the near rim lies across the base of the fire
  const RX = 0.38, RY = 0.065, RIM = -0.1;           // the rim ellipse, figure metres about the anchor (y down)
  const rimPt = (t, u) => [Math.cos(t) * RX * u, (RIM + Math.sin(t) * RY) * u];
  fp(X, 1.0, Z, (fg, u, k) => {
    fg.flat(ell([0, RIM * u], RX * u, RY * u, 0, 24), '#140a06');
    fg.raw('<g class="em">');
    // the far inner wall lit by the coals: a crescent along the back of the rim
    fg.flat([...Array.from({ length: 13 }, (_, i) => rimPt(Math.PI + i / 12 * Math.PI, u)), ...Array.from({ length: 13 }, (_, i) => { const t = 2 * Math.PI - i / 12 * Math.PI; return [Math.cos(t) * RX * 0.9 * u, (RIM + 0.012 + Math.sin(t) * RY * 0.55) * u]; })], '#c8541c', { op: 0.9 });
    // the coals: a low glowing heap with black clinker in it, crowning just over the rim
    fg.flat([[-0.33 * u, RIM * u], [-0.26 * u, (RIM - 0.045) * u], [-0.12 * u, (RIM - 0.075) * u], [0.05 * u, (RIM - 0.085) * u], [0.2 * u, (RIM - 0.065) * u], [0.32 * u, (RIM - 0.02) * u], [0.33 * u, (RIM + 0.03) * u], [-0.32 * u, (RIM + 0.03) * u]], '#e0662a');
    for (let i = 0; i < 16; i++) { const x = (fg.r() - 0.5) * 0.56 * u, y = (RIM - 0.01 - fg.r() * 0.06) * u; fg.flat(ell([x, y], (0.018 + fg.r() * 0.02) * u, (0.012 + fg.r() * 0.012) * u, fg.r() * 3, 7), fg.r() < 0.35 ? '#3a1a0c' : fg.r() < 0.6 ? '#ffb050' : '#ff8a2a'); }
    fg.raw('</g>');
  });
  fire(X, 1.0 + 0.085, Z, s * 0.8, s * 0.6, 9, 1);   // its base sits on the coals, inside the rim
  raw(embers(bx, by - s * 0.8, s * 1.2, 30));
  fp(X, 1.0, Z, (fg, u) => { // the coals at the front of the heap, over the flames' roots, just behind the near rim
    fg.raw('<g class="em">');
    for (let i = 0; i < 14; i++) { const x = (-0.3 + i * 0.045 + (fg.r() - 0.5) * 0.02) * u, y = (RIM + 0.01 - fg.r() * 0.035) * u; fg.flat(ell([x, y], (0.022 + fg.r() * 0.012) * u, (0.014 + fg.r() * 0.008) * u, fg.r() * 3, 7), fg.r() < 0.3 ? '#2a140a' : fg.r() < 0.6 ? '#ffb050' : '#e0662a'); }
    fg.raw('</g>');
  });
  fp(X, 1.0, Z, (fg, u, k) => { // the bowl's front: hammered iron, rivets, rust; its top edge is the near half of the rim
    const front = [...Array.from({ length: 13 }, (_, i) => rimPt(Math.PI - i / 12 * Math.PI, u)), [0.34 * u, 0.12 * u], [0.2 * u, 0.2 * u], [0, 0.2 * u], [-0.2 * u, 0.2 * u], [-0.34 * u, 0.12 * u]];
    fg.part(front, { fill: '#2e2a28', shade: 0.45, tex: 'mottle' + fg.o.seed, texOp: 0.5, cast: false, k: 0.6 });
    for (const kk of [-0.2, 0, 0.2]) fg.line([[kk * u, (RIM + RY * Math.sqrt(1 - (kk / RX) ** 2)) * u], [kk * 0.8 * u, 0.18 * u]], 1.4 * k, INK, { op: 0.7, straight: true });
    fg.flat(ell([0.05 * u, 0.06 * u], 0.12 * u, 0.06 * u, 0, 9), G.rust, { op: 0.55 });
    const lip = Array.from({ length: 13 }, (_, i) => rimPt(Math.PI - i / 12 * Math.PI, u));
    fg.line(lip, 2.4 * k, INK);
    fg.raw('<g class="em">'); fg.line(lip.map(p => [p[0] * 0.97, p[1] - 0.012 * u]), 1.6 * k, '#ff9a3a', { op: 0.85 }); fg.raw('</g>');   // the glow caught on the inner edge of the rim
    fg.line(Array.from({ length: 13 }, (_, i) => rimPt(Math.PI + i / 12 * Math.PI, u)), 1.4 * k, INK, { op: 0.8 });                     // the far rim, thin
  });
  raw(smoke([[bx, by - s * 1.0], [bx + 6, by - s * 1.6], [bx + 30, by - s * 2.3], [bx + 90, by - s * 3.0]], s * 0.35, 0.15));
  raw('</g>');
}
props.sort((p, q) => q[0] - p[0]).forEach(([, fn]) => fn());
// sky birds and roof crows, after the buildings
raw([[620, 70, 7], [660, 50, 5], [700, 84, 6], [980, 40, 5], [1010, 60, 4], [400, 30, 4]].map(([x, y, s]) => flying(x, y, s)).join(''));
{ const [x, y] = P(-9.6, 7.3, 18); raw(crow(x, y - 4, 8, 1)); const [x2, y2] = P(9.6, 7.3, 27); raw(crow(x2, y2 - 3, 5, -1)); }
// the guesthouse chimney, its smoke drifting the same way as the forge smoke
{ const [x, y] = P(8.2, 4.6, 7.0); raw(cel([[x - 6, y], [x - 6, y - 40], [x + 6, y - 40], [x + 6, y]], { Z: 7, fill: '#2a2624', band: 2 }) + smoke([[x, y - 40], [x + 10, y - 120], [x + 60, y - 220], [x + 150, y - 300]], 36, 0.2)); }

// ================================================================== MONUMENT LAYER (between the back and front party slots)
// The garth cross: a stepped plinth, the shaft snapped in the first winter of the Grey and its head lying where it fell.
// The company's dead are chalked on the risers; their weapons stand planted round the steps.
layer('monument');
raw('<g class="z_545">');
{
  const [, CZ] = CROSS, steps = [[1.15, 0, 0.3], [0.85, 0.3, 0.6], [0.55, 0.6, 0.9]];
  // a blade planted behind the plinth goes first, so the steps cover its foot
  const sword = (X, Z, lean, rag) => fp(X, 0, Z, (fg, u, k) => {
    const h = 0.85 * u, r = p => rotd(p, lean);
    fg.part([[-0.02 * u, 0, 1], [0.02 * u, 0, 1], [0.025 * u, -h, 1], [-0.025 * u, -h, 1]].map(r), { fill: '#8a8680', shade: 0.35, cast: false, hatch: false });
    fg.part([[-0.12 * u, -h - 0.02 * u, 1], [0.12 * u, -h - 0.02 * u, 1], [0.12 * u, -h + 0.02 * u, 1], [-0.12 * u, -h + 0.02 * u, 1]].map(r), { fill: '#4a4440', shade: 0.35, cast: false, hatch: false });
    fg.part([[-0.018 * u, -h - 0.02 * u, 1], [0.018 * u, -h - 0.02 * u, 1], [0.018 * u, -h - 0.18 * u, 1], [-0.018 * u, -h - 0.18 * u, 1]].map(r), { fill: '#4a3626', shade: 0.35, cast: false, hatch: false });
    fg.part(ell(r([0, -h - 0.2 * u]), 0.035 * u, 0.035 * u, 0, 8), { fill: '#4a4440', shade: 0.3, cast: false, hatch: false });
    // a strip of linen tied to the hilt, stained with old blood (red only as blood)
    if (rag) { fg.part([[0.01 * u, -h - 0.1 * u], [0.09 * u, -h - 0.06 * u], [0.11 * u, -h + 0.15 * u], [0.06 * u, -h + 0.09 * u], [0.03 * u, -h + 0.17 * u]].map(r), { fill: '#b4ab98', shade: 0.35, cast: false, tex: 'weave' + fg.o.seed, texOp: 0.4 }); fg.flat(ell(r([0.07 * u, -h + 0.04 * u]), 0.035 * u, 0.06 * u, 0.2, 8), G.bloodD, { op: 0.8 }); }
    fg.line([[0.005 * u, -h * 0.6], [0.006 * u, -h * 0.52]].map(r), 1.6 * k, G.rust, { op: 0.7 });
  });
  sword(0.75, 7.85, 3, 0);
  { const s = K(CZ - 1.15), [gx, gy] = P(0, 0, CZ - 1.15); raw(PLW(GROUND, `<path d="${smooth(ell([gx + s * 0.2, gy + 4], s * 1.5, s * 0.18, 0, 18), true, 0.8)}" fill="#0e0b08" opacity="0.45"/>`)); }
  for (const [hw, y0, y1] of steps) {
    const zf = CZ - hw, zb = CZ + hw;
    const top = [[-hw, y1, zf], [hw, y1, zf], [hw, y1, zb], [-hw, y1, zb]];
    raw(PLW([top[0], top[1], top[3]], cel(chip(top.map(p => P(...p)), 0.2), { Z: zf, fill: light(STONE2, 0.12), band: 2, tex: 'url(#mottle)', texOp: 0.4 }) + stain(...P(-hw * 0.4, y1, CZ), K(CZ) * 0.25, '#2a3420', 0.35)));
    const at = (u, t) => [-hw + u, y0 + t, zf];
    raw(PLW([at(0, 0), at(1, 0), at(0, 1)], ashlar(at, hw * 2, y1 - y0, STONE2, { scale: 0.32, wscale: 0.5, vary: 0.22, chip: 0.45, mortar: 0.6, lost: 0.1, spall: 0.2, courses: [1] }) + planeShade(at, hw * 2, y1 - y0, [0, 0, -1], { op: 0.4 })));
    shade([at(0, 0), at(hw * 2, 0), at(hw * 2, y1 - y0), at(0, y1 - y0)], { bias: -0.1 });
    // names of the dead chalked on the riser, a few scored through
    const k = K(zf); let names = '';
    for (let i = 0; i < Math.round(hw * 5); i++) { const [nx, ny] = P(-hw + 0.15 + i * (hw * 2 - 0.3) / Math.round(hw * 5), y0 + (y1 - y0) * 0.5, zf); let d = `M${f1(nx)} ${f1(ny)}`; for (let c = 0; c < 5; c++) d += ` l${f1(k * 0.02)} ${f1((c % 2 ? -1 : 1) * k * 0.035)}`; names += `<path d="${d}" stroke="#d8d0c0" stroke-width="1.3" fill="none" opacity="0.75"/>`; if (R() < 0.3) names += `<path d="M${f1(nx - 2)} ${f1(ny)} l${f1(k * 0.12)} 0" stroke="#d8d0c0" stroke-width="1" opacity="0.6"/>`; }
    raw(names);
  }
  // the shaft: square, carved with a worn knot, snapped off jagged
  { const w = 0.18, zf = CZ - w, at = (u, t) => [-w + u, 0.9 + t, zf], top = [[0, 1.25], [0.1, 1.38], [0.18, 1.2], [0.26, 1.33], [0.36, 1.1]];
    const sh = [at(0, 0), at(0.36, 0), ...top.slice().reverse().map(([u, t]) => at(u, t))];
    raw(PLW([at(0, 0), at(1, 0), at(0, 1)], cel(sh.map(p => P(...p)), { Z: zf, fill: STONE2, band: 4, tex: 'url(#mottle)', texOp: 0.45 }) +
      [0.25, 0.5, 0.75].map(t => { const A = P(...at(0.05, t)), B = P(...at(0.31, t + 0.06)); return `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + B[0]) / 2)} ${f1(A[1] - 6)} ${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="1.6" fill="none" opacity="0.7"/>`; }).join('') +
      hatch3(at, 0.22, 0.36, 0, 1.25, 1.2, { op: 0.4 }) + stain(...P(-0.05, 1.6, zf), 9, '#3a4a2e', 0.5)));
    // the broken top: the snapped face, paler, a few cracks into it
    { const tp = top.map(([u, t]) => P(...at(u, t))); raw(`<path d="M${tp.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L')}" fill="none" stroke="${mix(STONE2, '#f4ead0', 0.4)}" stroke-width="1.4" transform="translate(0 2)" opacity="0.7"/>`); }
    candles(-0.3, CZ - 0.5, 4, 0.9, 0.4); candles(0.3, CZ - 0.45, 3, 0.9, 0.3); candles(-0.6, CZ - 0.78, 3, 0.6, 0.4); candles(0.65, CZ - 0.8, 2, 0.6, 0.3); candles(0.9, CZ - 1.1, 3, 0.3, 0.4);
    // ribbons and a child's token tied round the stump
    const [rx, ry] = P(0, 1.9, zf); raw(`<path d="M${f1(rx - 8)} ${f1(ry)} q8 4 16 0 M${f1(rx + 6)} ${f1(ry + 2)} l3 18 M${f1(rx + 2)} ${f1(ry + 3)} l-2 22" stroke="${INK}" stroke-width="3.6" fill="none"/><path d="M${f1(rx - 8)} ${f1(ry)} q8 4 16 0 M${f1(rx + 6)} ${f1(ry + 2)} l3 18 M${f1(rx + 2)} ${f1(ry + 3)} l-2 22" stroke="#b8ac90" stroke-width="2.2" fill="none"/>`); }
  // the fallen head of the cross, lying where it came down against the bottom step
  { const Y = 0.24, q = (x0, x1, z0, z1) => [[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]], fr = (x0, x1, z) => [[x0, 0, z], [x1, 0, z], [x1, Y, z], [x0, Y, z]];
    for (const [x0, x1, z0, z1] of [[0.9, 1.95, 5.0, 5.3], [1.45, 1.72, 4.66, 5.64]]) { const a = fr(x0, x1, z0), b = q(x0, x1, z0, z1); raw(PLW([a[0], a[1], a[3]], cel(a.map(p => P(...p)), { Z: z0, fill: dark(STONE2, 0.2), band: 3 }) + hatch3((s, t) => [x0 + s, t, z0], 0, x1 - x0, 0, Y, 0.8, { op: 0.4 })) + PLW([b[0], b[1], b[3]], cel(b.map(p => P(...p)), { Z: z0, fill: light(STONE2, 0.08), band: 3, tex: 'url(#mottle)', texOp: 0.4 }))); }
    { const A = P(0.9, Y, 5.0), B = P(0.9, Y, 5.3), C = P(0.9, 0, 5.0); raw(cel([[A[0], A[1]], [A[0] - 5, A[1] + 4], [A[0] - 1, A[1] + 7], [A[0] - 7, A[1] + 12], [C[0] - 2, C[1]], [C[0] + 6, C[1]], [B[0] + 4, B[1]]], { Z: 5, fill: dark(STONE2, 0.35), band: 2 })); }
    const [cx, cy] = P(1.585, Y, 5.15); raw(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="12" ry="4" fill="none" stroke="${INK}" stroke-width="1.4"/>` + stain(...P(1.3, Y, 5.15), 9, '#3a4a2e', 0.45)); }
  // weapons of the dead planted round the steps; one with a blood-stained rag tied to its hilt; a dented helm on the step
  sword(1.25, 6.05, 6, 1); sword(-1.3, 6.3, -5, 0);
  fp(0.6, 0.6, CZ - 0.75, (fg, u, k) => {
    fg.part([[-0.14 * u, 0], [-0.16 * u, -0.12 * u], [-0.08 * u, -0.2 * u], [0.08 * u, -0.2 * u], [0.16 * u, -0.12 * u], [0.14 * u, 0]], { fill: G.steelD, shade: 0.45, tex: 'mottle' + fg.o.seed, texOp: 0.4 });
    fg.line([[-0.1 * u, -0.07 * u], [0, -0.07 * u]], 2.6 * k, INK, { straight: true });
    fg.line([[0.02 * u, -0.17 * u], [0.06 * u, -0.12 * u], [0.03 * u, -0.08 * u]], 1.3 * k, INK, { op: 0.7 });
    fg.flat(ell([0.05 * u, -0.06 * u], 0.03 * u, 0.02 * u, 0, 7), G.rust, { op: 0.7 });
  });
}
drawBrazier();
raw('</g>');
// ================================================================== FIRELIGHT LAYER (over the party; additive in the engine)
layer('light');
{ const [x, y] = P(BRAZIER[0] + 0.4, 1.0, BRAZIER[1] - 1.0); let s = ''; for (const [k, op] of [[1, 0.05], [0.78, 0.06], [0.55, 0.07], [0.34, 0.08]]) s += `<path d="${smooth(ell([x, y], 620 * k, 360 * k, 0, 24).map(p => [p[0] + (R() - 0.5) * 16 * k, p[1] + (R() - 0.5) * 10 * k]), true, 0.8)}" fill="#ff9a3a" opacity="${op}"/>`; raw(s); }

// ================================================================== FOREGROUND LAYER (in front of the party)
layer('fg');
raw('<g class="z_340">');
{
  // near mud: straw, a broken pot, a gnawed bone; nothing tall enough to hide the party
  for (const [X, Z] of [[-2.6, 3.4], [1.6, 3.2], [3.2, 4.2], [-3.9, 4.6]]) { const [x, y] = P(X, 0, Z), k = K(Z); let d = ''; for (let i = 0; i < 14; i++) { const a0 = (R() - 0.5) * 0.6, l = k * (0.1 + R() * 0.25); d += `M${f1(x + (R() - 0.5) * k * 0.3)} ${f1(y + (R() - 0.5) * k * 0.04)} l${f1(Math.cos(a0) * l * (R() < 0.5 ? -1 : 1))} ${f1(Math.sin(a0) * l * 0.3)} `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="${f1(k * 0.016 + 1)}" opacity="0.7"/><path d="${d}" stroke="#b8a46a" stroke-width="${f1(k * 0.01)}" opacity="0.8"/>`); }
  fp(1.3, 0, 3.6, (fg, u) => { fg.part([[-0.14 * u, 0], [-0.15 * u, -0.12 * u], [0, -0.13 * u], [0.04 * u, -0.05 * u, 1], [0.12 * u, -0.06 * u, 1], [0.1 * u, 0]], { fill: '#7a5a3a', shade: 0.45, tex: 'mottle' + fg.o.seed, texOp: 0.4 }); fg.part([[0.18 * u, -0.01 * u], [0.26 * u, -0.04 * u, 1], [0.28 * u, 0.01 * u]], { fill: '#6a4a2e', shade: 0.4, cast: false }); });
  fp(-1.9, 0, 3.3, (fg, u) => { fg.part([[0, -0.02 * u], [0.3 * u, -0.05 * u], [0.31 * u, -0.01 * u], [0.01 * u, 0.025 * u]], { fill: '#c8bca0', shade: 0.35, cast: false }); fg.part(ell([0.31 * u, -0.03 * u], 0.035 * u, 0.03 * u, 0, 8), { fill: '#c8bca0', shade: 0.35, cast: false }); fg.part(ell([0, 0], 0.035 * u, 0.03 * u, 0, 8), { fill: '#c8bca0', shade: 0.35, cast: false }); });
  // left: a heap of fallen arcade masonry, a column drum on its side, rubble and weeds; a lantern left on it
  { const Z = 3.35, s = K(Z);
    fp(-3.3, 0.32, Z, (fg, u, k) => {
      const L = 0.6 * u, Rr = 0.32 * u, ex = 0.35 * u;
      fg.part([[-L, -Rr, 1], [ex, -0.34 * u, 1], [ex, 0.32 * u, 1], [-L, Rr, 1]], { fill: STONE2, shade: 0.5, tex: 'mottle' + fg.o.seed, texOp: 0.55 });
      for (const kk of [-0.5, -0.38, -0.26, -0.14, -0.02, 0.1, 0.22]) fg.line([[-0.62 * u, kk * u], [-0.2 * u, kk * u + 2], [0.1 * u, kk * u - 2], [0.33 * u, kk * u * 1.02]], 1.4 * k, INK, { op: 0.55 });
      fg.line([[-0.2 * u, -0.34 * u], [-0.14 * u, -0.22 * u], [-0.22 * u, -0.12 * u]], 2.2 * k, INK);
      fg.part(ell([ex, 0], 0.14 * u, 0.33 * u, 0, 18), { fill: light(STONE2, 0.1), shade: 0.35, tex: 'mottle' + fg.o.seed, texOp: 0.4, cast: false });
      fg.line(ell([ex, 0], 0.07 * u, 0.18 * u, 0, 14).concat([[ex + 0.07 * u, 0]]), 1.2 * k, INK, { op: 0.6 });
    });
    for (let i = 0; i < 9; i++) { const X = -4.4 + R() * 1.8, ZZ = 3.15 + R() * 0.4, rr = 0.07 + R() * 0.1, tone = mix(STONE2, '#1a1410', R() * 0.4); fp(X, 0, ZZ, (fg, u) => fg.part(ell([0, -0.06 * u], rr * u, rr * 0.75 * u, R() * 3, 7).map(p => [p[0] + (R() - 0.5) * rr * u * 0.3, p[1] + (R() - 0.5) * rr * u * 0.3]), { fill: tone, shade: 0.45, tex: 'mottle' + fg.o.seed, texOp: 0.5 })); }
    lantern(-3.2, 0.66 + 15 / s, 3.35, 24, [-3.2, 0.75, 3.3, 0.22, 2.6]);
    const [dx, dy] = P(-3.3, 0.32, Z); raw(weed(dx - s * 0.5, dy + s * 0.3, -s * 0.3) + weed(dx - s * 0.2, dy + s * 0.32, -s * 0.22));
  }
  // right: a handcart tipped on its legs, sacks, cut by the frame
  { const Z = 3.3, s = K(Z), [cx0, cy0] = P(2.5, 0.6, Z), [cx1] = P(3.85, 0.6, Z);
    raw(cel([[cx0, cy0], [cx1, cy0 - s * 0.05], [cx1, cy0 - s * 0.5], [cx0 + s * 0.05, cy0 - s * 0.42]], { Z, fill: '#4e3c2a', band: 6 }) + `<path d="M${f1(cx0)} ${f1(cy0 - s * 0.2)} L${f1(cx1)} ${f1(cy0 - s * 0.24)}" stroke="${INK}" stroke-width="2"/>` + hatch3((u, t) => [2.5 + u, 0.6 + t, Z], 0, 1.35, 0, 0.45, 0.7, { op: 0.35 }));
    const [wx, wy] = P(2.95, 0.38, Z); raw(`<circle cx="${f1(wx)}" cy="${f1(wy)}" r="${f1(s * 0.38)}" fill="none" stroke="${INK}" stroke-width="${f1(s * 0.07 + 3)}"/><circle cx="${f1(wx)}" cy="${f1(wy)}" r="${f1(s * 0.38)}" fill="none" stroke="#5a4632" stroke-width="${f1(s * 0.06)}"/><circle cx="${f1(wx)}" cy="${f1(wy)}" r="${f1(s * 0.38)}" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="${f1(s * 0.06)} ${f1(s * 0.1)}" opacity="0.5"/>` +
      [0, 1, 2].map(i => `<path d="M${f1(wx + Math.cos(i * 1.05) * s * 0.36)} ${f1(wy + Math.sin(i * 1.05) * s * 0.36)} L${f1(wx - Math.cos(i * 1.05) * s * 0.36)} ${f1(wy - Math.sin(i * 1.05) * s * 0.36)}" stroke="${INK}" stroke-width="${f1(s * 0.045 + 2)}"/><path d="M${f1(wx + Math.cos(i * 1.05) * s * 0.36)} ${f1(wy + Math.sin(i * 1.05) * s * 0.36)} L${f1(wx - Math.cos(i * 1.05) * s * 0.36)} ${f1(wy - Math.sin(i * 1.05) * s * 0.36)}" stroke="#5a4632" stroke-width="${f1(s * 0.035)}"/>`).join('') + `<circle cx="${f1(wx)}" cy="${f1(wy)}" r="${f1(s * 0.06)}" fill="#3a2c20" stroke="${INK}" stroke-width="2"/>`);
    sack(3.05, Z + 0.1, 0.62); sack(3.55, Z + 0.05, 0.62);
    raw(beam([2.45, 0.62, Z], [2.45, 1.5, Z], s * 0.05, TIMBER) + beam([2.45, 1.46, Z], [2.25, 1.46, Z], s * 0.04, TIMBER));
    lantern(2.25, 1.3, Z - 0.05, 26, [2.25, 1.3, Z - 0.05, 0.25, 2.8]);
    raw(beam([2.5, 0.62, Z], [2.05, 0.0, Z - 0.05], s * 0.05, TIMBER));
  }
  for (let i = 0; i < 26; i++) { const X = -5.5 + R() * 11, Z = 3.1 + R() * 2.2, [x, y] = P(X, 0, Z), k = K(Z), ang = R() * 3.14; raw(`<path d="M${f1(x)} ${f1(y)} l${f1(Math.cos(ang) * k * 0.25)} ${f1(Math.sin(ang) * k * 0.05)}" stroke="#b8a46a" stroke-width="${f1(Math.max(1, k * 0.012))}" opacity="0.7"/>`); }
  // a bucket on its side
  fp(-3.6, 0, 3.5, (fg, u, k) => { fg.part([[-0.2 * u, -0.3 * u, 1], [0.2 * u, -0.34 * u, 1], [0.24 * u, 0, 1], [-0.18 * u, 0.02 * u, 1]], { fill: '#5a4632', shade: 0.45, tex: 'wood' + fg.o.seed, texOp: 0.5 }); for (const t of [0.08, 0.22]) fg.line([[-0.19 * u, -t * u], [0.23 * u, -t * u - 0.02 * u]], 2.4 * k, '#2a2622', { straight: true }); });
  // a dead crow, a little blood under it
  { const Z = 3.4, X = 3.9, s = K(Z), [x, y] = P(X, 0, Z); raw(`<path d="${smooth(ell([x + s * 0.1, y + 1], s * 0.16, s * 0.03, 0, 10), true, 0.8)}" fill="${G.blood}" opacity="0.7"/><path d="M${f1(x - s * 0.2)} ${f1(y - 2)} c${f1(s * 0.1)} ${f1(-s * 0.12)} ${f1(s * 0.3)} ${f1(-s * 0.12)} ${f1(s * 0.4)} ${f1(-s * 0.02)} l${f1(s * 0.12)} ${f1(-s * 0.02)} l${f1(-s * 0.08)} ${f1(s * 0.06)} c${f1(-s * 0.1)} ${f1(s * 0.06)} ${f1(-s * 0.3)} ${f1(s * 0.06)} ${f1(-s * 0.44)} ${f1(s * 0.02)} Z" fill="#100c0a" stroke="${INK}" stroke-width="1.2"/><path d="M${f1(x)} ${f1(y - s * 0.07)} l${f1(s * 0.05)} ${f1(-s * 0.08)} M${f1(x + s * 0.05)} ${f1(y - s * 0.07)} l${f1(s * 0.03)} ${f1(-s * 0.09)}" stroke="#100c0a" stroke-width="2"/>`); }
  // stray stones at the very front
  for (const [X, Z] of [[-1.6, 3.3], [2.2, 3.6], [-4.8, 4.4], [5.2, 4.0]]) { const tone = mix(STONE, '#1a1410', R() * 0.3), rr = 0.09; fp(X, 0, Z, (fg, u) => fg.part(ell([0, -0.04 * u], rr * u, rr * 0.7 * u, R(), 7).map(p => [p[0] + (R() - 0.5) * rr * u * 0.3, p[1] + (R() - 0.5) * rr * u * 0.2]), { fill: tone, shade: 0.45, tex: 'mottle' + fg.o.seed, texOp: 0.5 })); }
  // falling ash, and the value veil for the unlit preview: screen effects outside the lighting (class glow keeps them out)
  raw('<g class="glow">' + Array.from({ length: 220 }, () => { const x = R() * W, y = R() * H, r = 0.6 + R() * 1.6; return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#d8d4ca" opacity="${f1(0.15 + R() * 0.35)}"/>`; }).join('') + '</g>');
}
raw('</g>');

// ------------------------------------------------------------------ party anchors: feet positions and scale for 1.85 m heroes (grim's, unchanged)
const PARTY = [[-2.0, 4.7], [2.2, 4.8], [1.75, 7.5], [-2.45, 7.35]].map(([X, Z], i) => ({ slot: i, feet: P(X, 0, Z).map(f), height_px: f(K(Z) * 1.85), z: Z }));
PARTY.forEach(p => { const [x, y] = p.feet, h = p.height_px, w = h * 0.36; HOT['company_' + p.slot] = { label: 'The company', action: 'company', slot: p.slot, poly: [[x - w, y + 8], [x + w, y + 8], [x + w * 0.8, y - h * 1.02], [x - w * 0.8, y - h * 1.02]].map(q => q.map(f)) }; });
{ const [x, y] = P(CROSS[0], 0, CROSS[1] - 1.15), s = K(CROSS[1] - 1.15); HOT.company_cross = { label: 'The company', action: 'company', poly: [[x - s * 1.2, y + s * 0.1], [x + s * 1.2, y + s * 0.1], [x + s * 0.6, y - s * 2.3], [x - s * 0.6, y - s * 2.3]].map(q => q.map(f)) }; }

// ================================================================== write
S.runDeferred();
// the unlit preview's value grading: a stepped veil cut back round every light, heavier in the corners and the top (fg, class glow)
S.LAY.fg.push(S.veil({ top: 130, bottom: 120, corners: [[0, 0, 460], [W, 0, 460], [0, H, 400], [W, H, 400]], op: 0.58, base: 0.66, reach: 0.6, cut: 0.16, steps: [1.0, 0.88, 0.76, 0.64, 0.52, 0.42, 0.32, 0.22] }));
S.LAY.tops = TOPS;
const layers = ['bg', 'monument', 'light', 'fg'];
const svgs = {};
// each layer carries only the defs its own body uses (the keepers' and props' defs are large)
const ALLDEFS = S.DEFS.splice(0), idsOf = d => [...d.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
for (const l of [...layers, 'tops']) {
  const body = (S.LAY[l] || []).map(e => typeof e === 'string' ? e : (S.SLOTS[e.slot] || '')).join('\n');
  const used = new Set([...body.matchAll(/(?:url\(#|href="#)([^)"]+)/g)].map(m => m[1]));
  // defs reference other defs (masks, patterns, filters): close over them
  let keep = new Set(), grew = true;
  while (grew) { grew = false; ALLDEFS.forEach((d, i) => { if (keep.has(i)) return; if (idsOf(d).some(x => used.has(x))) { keep.add(i); grew = true; for (const m of d.matchAll(/(?:url\(#|href="#)([^)"]+)/g)) used.add(m[1]); } }); }
  S.DEFS.splice(0, S.DEFS.length, ...ALLDEFS.filter((_, i) => keep.has(i)));
  svgs[l] = S.svgLayer(l, l === 'light' ? { plain: true } : {});
  // the tops layer is not part of the rig: the frame's own camera, looking at the 1400 px of space above the frame's top
  if (l === 'tops') svgs[l] = svgs[l].replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="1400" viewBox="0 -1400 ${W} 1400">`).replace(/filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000"/g, 'filterUnits="userSpaceOnUse" x="0" y="-1400" width="1600" height="2400"');
  fs.writeFileSync(path.join(OUT, `garth__${l}.svg`), svgs[l]);
}
fs.writeFileSync(path.join(OUT, 'garth.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${layers.map(l => svgs[l].replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')).join('')}</svg>`);
fs.writeFileSync(path.join(OUT, 'garth_hotspots.json'), JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: EYE, focal_px: FL }, hotspots: HOT, party: PARTY, monument: { feet: P(CROSS[0], 0, CROSS[1] - 1.15).map(f), z: CROSS[1] - 1.15, layer: 'monument' }, brazier: P(BRAZIER[0], 1.0, BRAZIER[1]).map(f),
  draw_order: 'bg, party slots with z > monument.z, monument, party slots with z < monument.z, light (additive), fg' }, null, 1));
fs.writeFileSync(path.join(OUT, 'garth.rig.json'), JSON.stringify({ w: W, h: H, layers: layers.map(name => ({ name })), anim: {} }));
fs.writeFileSync(path.join(OUT, 'garth.light.json'), JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: EYE, focal_px: FL, cx: CX }, planes: PLANES, lights: LIGHTS }));
console.log('garth', PLANES.length, 'planes', LIGHTS.length, 'lights', Object.keys(HOT).join(','));
