// Materials v2 (2026-11-24, Cole's polish review): weathered stone and organic trees for every Living Ink scene.
//
//   const MV = require('./materials_v2')(S);      // S: a lik.js scene. Cached per scene, so every kit shares one instance.
//
// STONE (all marks use their own seeded random stream, never S.R, so a room's geometry and prop scatter stay identical)
//   MV.begin(at, Ls, Lt, wx)   -> W        open a weathering pass over a plane at(s,t) (wall, floor or vault: detected)
//     W.stone(ps, Z, fill, q3, o)          marks for one stone: ps screen polygon, q3 its world corners [[X,Y,Z]..]
//                                          o: { lost (mortar washed out), thin (pinning slip), joint (joint colour) }
//     W.end()             -> svg           the accumulated marks plus the plane's own weathering (runs, damp, cracks)
//   MV.stoneMarks(ps, Z, fill, o) -> svg   marks for one screen polygon with no plane (rubble, voussoirs, lumps)
//   MV.weatherWall(at, Ls, Lt, wx)         plane-level only: staining runs under ledges, stepped damp/salt band, through
//                                          cracks across courses, moss along the foot (outdoor worlds), frost line
//   MV.weatherFloor(at, Ls, Lt, wx)        worn polished path where feet go, dirt, cracks, puddles/frost by world
//   MV.hewnRock(at, Ls, Lt, col, o)        NATURAL / HEWN rock face in a plane: bedding strata at a dip, joint fractures,
//                                          rounded weathered blocks, no mortar; o.tool adds pick marks (rock-cut work)
//   MV.rockSkin(pts, Z, col, o)            the same weathering laid inside a screen outline (cliffs, boulders, rock masses)
//   MV.world(name) / MV.setWorld(name)     presets: abbey_in, abbey_out, drowned, mire, baths, pits, foundry, coast,
//                                          fleet, rime, barrow, hive, spire, silence, pyre, garden, sky, sea, ice, neutral.
//                                          Default: guessed from the running script (bg_<world>_*.js, int_*.js, garth*).
//   wx (any call): false = off; a world name; or { world, decay, ...preset overrides }
//
// TREES AND STRANDS (screen space; (x, y) is the ground point; every curve is Catmull-Rom smoothed, widths taper)
//   MV.tree(x, y, h, Z, o)  -> { svg, limbs, trunk, tw, wAt, tips }
//        o.kind: oak | dead | yew | alder | birch | fungal | frozen | pollard | windswept | snag (default oak)
//        o.col, o.lean, o.leaves (true/false), o.leafCol, o.seed, o.ground (false: no ground lip), o.groundCol,
//        o.depth (generations), o.spread, o.tw (trunk width px)
//   MV.strand(pts, w0, w1, Z, o)           a smooth tapering tube along guide points (roots, vines, kelp stipes)
//   MV.vine(A, B, Z, o)                    a sagging vine between two points with leaves and tendrils
//   MV.hangRoots(x0, x1, y, Z, o)          roots hanging from a ceiling or bank at screen y
//   MV.surfaceRoots(x, y, w, Z, o)         roots running over the ground from a foot at (x, y)
//   MV.kelp(x, y, h, Z, o)                 a kelp plant: swaying stipe, ruffled blades, gas bladders
'use strict';
const path = require('path');
const E = require('../engine');
const { mix, rng, smooth } = E;
const f1 = n => Math.round(n * 10) / 10;
const CACHE = new WeakMap();
const SL = [0.6, 0.8];                                // screen direction away from the key light
const lum = h => { const v = parseInt(h.slice(1), 16); return (((v >> 16) & 255) * 0.3 + ((v >> 8) & 255) * 0.59 + (v & 255) * 0.11) / 255; };
const quant = h => '#' + [16, 8, 0].map(sh => (Math.min(255, Math.round(((parseInt(h.slice(1), 16) >> sh) & 255) / 24) * 24)).toString(16).padStart(2, '0')).join('');
const MARK_CAP = 90000;                               // bytes of weathering marks per plane before only tints are added
const SCENE_CAP = 650000;  
const STONE_SHARE = 0.26;                             // a plane's marks stay under this share of its own stones' bytes                           // and per scene (all planes and loose stones together)

// ------------------------------------------------------------------ hashing, noise
function hseed(...a) { let h = 2166136261 >>> 0; for (const v of a) { h ^= (Math.round(v * 131) | 0); h = Math.imul(h, 16777619) >>> 0; h ^= h >>> 15; } return (h >>> 0) || 1; }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, h = (i, j) => (hseed(i, j, s) % 10007) / 10007;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return (h(xi, yi) * (1 - u) + h(xi + 1, yi) * u) * (1 - v) + (h(xi, yi + 1) * (1 - u) + h(xi + 1, yi + 1) * u) * v;
}
const fbm = (x, y, s) => vnoise(x, y, s) * 0.58 + vnoise(x * 2.13, y * 2.13, s + 7) * 0.29 + vnoise(x * 4.37, y * 4.37, s + 13) * 0.13;

// ------------------------------------------------------------------ world presets
const BASE = { decay: 1, pits: 1, spall: 1, chips: 1, crack: 1, wear: 1, damp: 0.7, runsK: 1, dampCol: '#1e1a12', salt: 0, saltCol: '#dcdcd0',
  lichen: 0, lichenCols: ['#9a9a84', '#b0aa80'], moss: 0, mossCol: '#3e4a26', algae: 0, algaeH: 0, algaeCol: '#24382a', frost: 0,
  frostCol: '#e6eef2', soot: 0, sootCol: '#0e0a08', heat: 0, runs: 0.5, runCols: [['#1a1610', 1]], runOp: 0.25, mould: 0, weed: 0 };
const WORLDS = {
  neutral: {},
  abbey_in: { damp: 0.9, salt: 0.2, soot: 0.25, runs: 0.3, mould: 0.15 },
  abbey_out: { lichen: 0.35, lichenCols: ['#a8a68c', '#c2b47a', '#8e927c'], moss: 0.25, damp: 0.6, runs: 0.7, runCols: [['#1c1a12', 1], ['#2a3020', 1]] },
  drowned: { algae: 0.8, algaeH: 3.5, salt: 0.4, runs: 0.8, runCols: [['#14201a', 1], ['#2a3a2a', 1]], damp: 2.5, dampCol: '#0e1a16', moss: 0.1, mossCol: '#2a4430', weed: 0.3 },
  mire: { moss: 0.55, mossCol: '#4a5226', algae: 0.4, algaeH: 1.2, lichen: 0.2, damp: 1.3, runs: 0.7, runCols: [['#1a1a0e', 1], ['#3a3416', 1]] },
  baths: { salt: 0.55, saltCol: '#ece6d6', runs: 1.0, runCols: [['#e4dece', 0.9], ['#4a6a54', 1]], damp: 1.0, algae: 0.3, algaeH: 0.8, algaeCol: '#3a5a3a' },
  pits: { soot: 0.5, runs: 0.9, runCols: [['#6a3a16', 1], ['#1a1410', 1], ['#8a7a20', 0.8]], salt: 0.25, saltCol: '#d8cc70', damp: 1.0 },
  foundry: { soot: 0.85, heat: 0.35, runs: 0.6, runCols: [['#5a2a10', 1], ['#120c08', 1]] },
  coast: { lichen: 0.55, lichenCols: ['#c88a2a', '#d4b040', '#a8a890', '#c07a28'], salt: 0.4, algae: 0.3, algaeH: 1.0, runs: 0.6, moss: 0.05, weed: 0.15 },
  fleet: { frost: 0.75, salt: 0.4, runs: 0.4, runCols: [['#dfe8ea', 0.45]], algae: 0.2, algaeH: 0.8 },
  rime: { frost: 0.9, runs: 0.5, runCols: [['#e4eef0', 0.45], ['#1a1a1a', 1]], lichen: 0.1, soot: 0.15 },
  barrow: { frost: 0.5, lichen: 0.4, lichenCols: ['#9c9e8a', '#b8b494'], moss: 0.3, mossCol: '#4a5030', runs: 0.5 },
  hive: { runs: 0.8, runCols: [['#8a5a16', 1], ['#3a2a10', 1]], mould: 0.3, damp: 0.6 },
  spire: { runs: 0.6, runCols: [['#3a7a6a', 1], ['#1a1a1a', 1]], lichen: 0.1, decay: 0.8 },
  silence: { frost: 1.0, lichen: 0.15, runs: 0.3, runCols: [['#e8eef4', 0.45]], decay: 0.9 },
  pyre: { soot: 0.9, heat: 0.3, runs: 0.6, runCols: [['#0c0806', 1]] },
  garden: { moss: 0.6, mossCol: '#4a5a2a', lichen: 0.5, lichenCols: ['#b0b490', '#c8b878', '#9aa07a'], algae: 0.3, algaeH: 1.2, algaeCol: '#2e4a26', runs: 0.7 },
  sky: { lichen: 0.3, lichenCols: ['#d0d0c0', '#c8c4a8'], runs: 0.4, runCols: [['#2a2a30', 1]], decay: 0.85 },
};
WORLDS.sea = Object.assign({}, WORLDS.coast, { algae: 0.6, algaeH: 1.6, salt: 0.55, weed: 0.3, lichen: 0.35, runCols: [['#1a2a22', 1], ['#e0e4dc', 0.7]] });
WORLDS.ice = WORLDS.rime;
const preset = n => Object.assign({}, BASE, WORLDS[n] || {});
function guessWorld() {
  const b = path.basename(process.argv[1] || '');
  const m = b.match(/^bg_([a-z]+)_/); if (m && WORLDS[m[1]]) return m[1];
  if (/garth|title/.test(b)) return 'abbey_out';
  if (/^int_|hub|panel|interior/.test(b)) return 'abbey_in';
  return 'neutral';
}

// ------------------------------------------------------------------ small geometry helpers (screen)
const ellD = (x, y, rx, ry) => `M${f1(x - rx)} ${f1(y)}a${f1(rx)} ${f1(ry)} 0 1 0 ${f1(rx * 2)} 0a${f1(rx)} ${f1(ry)} 0 1 0 ${f1(-rx * 2)} 0Z`;
const polyD = ps => 'M' + ps.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
const lineD = ps => 'M' + ps.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L');
function inPoly(x, y, ps) { let c = false; for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) { const [xi, yi] = ps[i], [xj, yj] = ps[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
const areaOf = ps => { let a = 0; for (let i = 0; i < ps.length; i++) { const p = ps[i], q = ps[(i + 1) % ps.length]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a) / 2; };
function lobed(cx, cy, rx, ry, r, n = 13, jag = 0.35) {
  const p1 = r() * 6.28, p2 = r() * 6.28, h1 = 2 + Math.floor(r() * 3), h2 = 5 + Math.floor(r() * 3), o = [];
  for (let k = 0; k < n; k++) { const a = k / n * 6.2832, m = 1 + 0.18 * Math.sin(h1 * a + p1) + 0.1 * Math.sin(h2 * a + p2) + (r() - 0.5) * jag; o.push([cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m]); }
  return o;
}
// Catmull-Rom resample of an open guide so a tube built on it has no kinks
function crSample(pts, per = 6, spacing = 0) {
  if (pts.length < 3) { const o = []; const a = pts[0], b = pts[pts.length - 1]; for (let i = 0; i <= per; i++) o.push([a[0] + (b[0] - a[0]) * i / per, a[1] + (b[1] - a[1]) * i / per]); return o; }
  const n = pts.length, P = i => pts[Math.max(0, Math.min(n - 1, i))], out = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), m = spacing ? Math.max(1, Math.min(per * 3, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / spacing))) : per;
    for (let k = 0; k < m; k++) { const t = k / m, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(j => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  out.push(pts[n - 1].slice(0, 2)); return out;
}

module.exports = function MV2(S) {
  if (CACHE.has(S)) return CACHE.get(S);
  const { P, K, INK, KEY, inkW } = S;
  const SHT = S.SHT || '#2a1f2a';
  const LIT = mix(S.KEY || '#fff3d8', '#b8ac94', 0.35);   // one lit colour for every lip, so marks merge across stones
  const hatchA = Z => S.hatchA(Z), hatchB = Z => S.hatchB(Z);
  let WORLD = guessWorld();
  const resolve = wx => { if (wx === false || process.env.MV2_OFF === '1') return null; if (typeof wx === 'string') return Object.assign(preset(wx), { name: wx }); const w = Object.assign(preset((wx && wx.world) || WORLD), wx || {}); w.name = (wx && wx.world) || WORLD; return w; };
  let serial = 0;

  // ---------------------------------------------------------------- accumulator: one path per style, layered
  function Acc() {
    const B = new Map();
    let size = 0;
    const put = (layer, key, attrs, d) => { const k = layer + '|' + key; let e = B.get(k); if (!e) { e = { layer, attrs, d: '' }; B.set(k, e); } e.d += d; size += d.length; };
    return {
      size: () => size,
      fill: (layer, col, op, d) => put(layer, 'f' + col + op, `fill="${col}" opacity="${f1(op * 100) / 100}"`, d),
      stroke: (layer, col, w, op, d, extra = '') => { const ww = Math.max(0.35, Math.round(w * 4) / 4); put(layer, 's' + col + ww + op + extra, `fill="none" stroke="${col}" stroke-width="${ww}" opacity="${f1(op * 100) / 100}" stroke-linecap="round" stroke-linejoin="round"${extra}`, d); },
      raw: (layer, s) => put(layer, 'r' + (serial++), null, s),
      reset: () => { B.clear(); size = 0; },
      svg: () => [...B.values()].sort((a, b) => a.layer - b.layer).map(e => e.attrs ? `<path d="${e.d}" ${e.attrs}/>` : e.d).join(''),
    };
  }

  // ---------------------------------------------------------------- marks for one stone (screen polygon)
  // o: { wx (resolved), face: wall|floor|vault|rock, wy0, wy1 (world heights), sx (world position for noise), sq (vertical
  // squash, floors), joint (joint colour), lost, thin, decay }
  function marks(A, ps, Z, fill, o) {
    const wx = o.wx; if (!wx || ps.length < 3) return;
    const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const bw = x1 - x0, bh = y1 - y0, mpx = Math.min(bw, bh), cx = ps.reduce((a, p) => a + p[0], 0) / ps.length, cy = ps.reduce((a, p) => a + p[1], 0) / ps.length;
    if (mpx < 2.2) return;
    const k = K(Z), r = rng(hseed(cx, cy, Z * 7, x1, y1)), face = o.face || 'wall', sq = o.sq || 1, aPx = areaOf(ps), am2 = aPx / (k * k * sq);
    const wy0 = o.wy0 ?? 1, wy1 = o.wy1 ?? wy0 + 0.4, sxn = o.sx ?? cx / k;
    let dd = wx.decay * (o.decay ?? 1) * (0.4 + 1.0 * fbm(sxn * 0.8, wy0 * 0.8, 31)) * (face === 'floor' ? 0.8 : 1);
    if (r() < 0.12) dd *= 0.35;                               // a replaced stone, still fresh
    const lod = Math.min(1, Math.max(0, (mpx - 3) / 18));     // detail falls away with distance (stone size on screen)
    // a big single shape (a pier, a newel, a whole rock outline) is not one stone: no whole-shape washes, local marks only
    const whole = o.whole || (!o.inPlane && mpx > 110), Lb = lum(fill.startsWith('#') && fill.length === 7 ? fill : '#777777');
    // lit lips stay relative to the base tone (a dark stone gets a dim lip, never a white one); quantized so marks still merge
    const lw = Math.max(0.4, inkW(Z) * 0.42), shadowFill = SHT, litCol = fill.length === 7 ? quant(mix(fill, KEY, Lb < 0.25 ? 0.28 : 0.45)) : LIT;
    // budget: past ~MARK_CAP bytes of marks on one plane only the cheap tints are added (keeps layers small)
    const rich = !o.veryHeavy && A.size() + (o.flushed ? o.flushed() : 0) < (o.cap ?? MARK_CAP) && BUDGET.used + A.size() < SCENE_CAP && mpx >= 4;
    const inside = (u = 0.35) => { for (let t = 0; t < 8; t++) { const x = cx + (r() - 0.5) * bw * u * 2, y = cy + (r() - 0.5) * bh * u * 2; if (inPoly(x, y, ps)) return [x, y]; } return [cx, cy]; };
    const edges = []; for (let i = 0; i < ps.length; i++) { const a = ps[i], b = ps[(i + 1) % ps.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1.5) continue; let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L; const mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy; if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; } edges.push({ a, b, L, nx, ny, sh: nx * SL[0] + ny * SL[1] }); }
    const topE = edges.slice().sort((p, q) => p.ny - q.ny)[0], botE = edges.slice().sort((p, q) => q.ny - p.ny)[0];

    // within-stone tone: a lobed patina patch (lighter wash-out or darker grime), so no face is a flat fill
    if (!o.inPlane && mpx > 5) A.fill(0, 'url(#speck)', 0.55, polyD(ps));     // a plane pass lays the grain once over the whole plane
    // v2.1: every stone its own tone and hue: some clearly darker, warmer (iron), cooler (blue-grey) or paler (bleached)
    const zn = fbm(sxn * 0.45 + 3.1, wy0 * 0.6, 77), zoned = face !== 'floor' && (zn > 0.6 || zn < 0.33), small = mpx < (o.heavy ? 9 : 6);
    if (!small && !whole && !zoned) { const t = r(), hi = r() < 0.45 ? 1 : 0; const pk = Lb < 0.3 ? (t < 0.16 ? ['#0a0604', 0.25, 0.4] : t < 0.32 ? ['#b07a48', 0.22, 0.34] : t < 0.46 ? ['#7a8a9a', 0.2, 0.3] : t < 0.62 ? ['#c8b898', 0.2, 0.3] : null)
      : (t < 0.2 ? ['#120c08', 0.2, 0.32] : t < 0.33 ? ['#7a4a26', 0.11, 0.17] : t < 0.45 ? ['#46586c', 0.12, 0.18] : t < 0.58 ? ['#f0e4c8', 0.1, 0.15] : null); if (pk) A.fill(0, pk[0], pk[1 + hi], polyD(ps)); }
    // weathering zones: neighbouring stones darken, warm or bleach together (correlated in the wall), which breaks the reading
    // of a regular grid of courses; and now and then a stone has fallen out, leaving a dark socket
    if (!whole && !small && face !== 'floor') {
      if (zn > 0.6) A.fill(0, '#100a06', Math.min(0.34, (zn - 0.6) * 1.6 + 0.1), polyD(ps)); else if (zn < 0.33) A.fill(0, Lb > 0.22 ? '#e8dcc0' : '#b8a888', Math.min(Lb > 0.22 ? 0.2 : 0.3, (0.33 - zn) * 1.5 + 0.08), polyD(ps));
      if (Lb < 0.3 && topE && mpx > 10 && r() < 0.4) A.stroke(5, quant(mix(fill, KEY, 0.55)), Math.max(0.8, k * 0.012), 0.55, lineD([[topE.a[0], topE.a[1] + 1.2], [topE.b[0], topE.b[1] + 1.2]]));
      const zw = fbm(sxn * 0.6 + 9.7, wy0 * 0.5, 91); if (zw > 0.7 && !zoned) A.fill(0, '#6a3a1a', 0.14, polyD(ps)); }
    if (!whole && face === 'wall' && mpx > 12 && r() < 0.022 * dd) { A.fill(3, o.joint || '#0a0806', 1, polyD(ps)); A.fill(3, '#000000', 0.45, polyD(ps.map(([x, y]) => [x + (cx - x) * 0.25 + bw * 0.06, y + (cy - y) * 0.25 + bh * 0.08]))); if (botE) A.stroke(5, litCol, Math.max(0.8, k * 0.012), 0.55, lineD([botE.a, botE.b])); return; }
    // grime settled along the bottom bed of every stone; dirt in every floor joint
    if (botE && !small && !whole) { if (face === 'floor') A.stroke(4, INK, Math.max(0.7, k * 0.014), 0.32, polyD(ps)); else A.stroke(4, INK, Math.max(0.8, k * 0.02), 0.5, lineD([botE.a, botE.b])); }
    if (!rich) return;
    if (mpx > 9) for (let j = 0, nP = 1 + Math.floor(r() * 2.2 * Math.min(1, dd + 0.3)); j < nP; j++) { const [px, py] = inside(0.3), rr = Math.min(mpx * (0.16 + r() * 0.16), k * 0.18), light = r() < 0.5 && Lb > 0.22, ax = rr * (bw / mpx) * 0.7, ay = rr * (bh / mpx) * 0.7; A.fill(0, light ? '#e8dcc4' : INK, light ? 0.11 : 0.09, ellD(px, py, ax, ay) + ellD(px + ax * (r() - 0.5), py + ay * (r() - 0.5), ax * 0.6, ay * 0.7)); }
    // eroded arrises: ragged bites into the shadow edges, a broken polished lip on the lit edges (no perfect bevel)
    if (lod > 0.08) for (const e of edges) { if (e.L < 5) continue; const nb = Math.round(e.L / Math.max(3.5, k * 0.055) * (0.4 + dd * 0.6));
      for (let j = 0; j < nb; j++) { if (r() > 0.55) continue; const u = r(), x = e.a[0] + (e.b[0] - e.a[0]) * u, y = e.a[1] + (e.b[1] - e.a[1]) * u, rr = Math.min(3, k * (0.006 + 0.016 * r())); if (rr < 0.75) continue;
        if (e.sh > 0.2) A.fill(3, INK, 0.45, ellD(x - e.nx * rr * 0.4, y - e.ny * rr * 0.4, rr * 1.3, rr * 0.8 * sq)); else if (e.sh < -0.3) A.fill(3, '#2a2420', 0.3, ellD(x - e.nx * rr * 0.3, y - e.ny * rr * 0.3, rr * 1.1, rr * 0.7 * sq)); }
      if (e.sh < -0.3) { const seg = []; for (let j = 0; j <= 6; j++) { const u = j / 6; seg.push([e.a[0] + (e.b[0] - e.a[0]) * u - e.nx * 1.4, e.a[1] + (e.b[1] - e.a[1]) * u - e.ny * 1.4]); } A.stroke(5, litCol, Math.max(0.6, k * 0.008), 0.45, lineD(seg), ` stroke-dasharray="${f1(4 + r() * 8)} ${f1(1.5 + r() * 4)}"`); } }
    // damp from the ground (stepped), soot near the top, algae film low, heat reddening, frost bloom
    if (!o.inPlane && !whole && face !== 'floor' && wx.damp && wy0 < wx.damp) { const lev = Math.min(3, Math.ceil((1 - wy0 / wx.damp) * 3)); A.fill(0, wx.dampCol, [0, 0.07, 0.13, 0.2][lev], polyD(ps)); }
    if (wx.soot && !whole && face !== 'floor' && wy1 > 1.6) { const lev = Math.min(3, Math.ceil(wx.soot * (wy1 - 1.6) / 1.2 * (0.5 + fbm(sxn * 1.3, wy1, 5)))); if (lev > 0) A.fill(0, wx.sootCol, [0, 0.08, 0.15, 0.24][lev], polyD(ps)); }
    if (wx.algae && !whole && wy0 < wx.algaeH && face !== 'floor') { A.fill(1, wx.algaeCol, (0.12 + r() * 0.22) * wx.algae, polyD(ps)); if (lod > 0.2 && topE) A.stroke(5, mix(wx.algaeCol, '#d8f0d0', 0.6), lw * 1.2, 0.3, lineD([[topE.a[0] + 1, topE.a[1] + 1.5], [(topE.a[0] + topE.b[0]) / 2, (topE.a[1] + topE.b[1]) / 2 + 2]])); }
    if (wx.heat && !whole && r() < wx.heat * dd) A.fill(0, '#8a3a18', 0.1 + r() * 0.1, polyD(ps));
    if (!o.inPlane && !whole && wx.frost && face !== 'floor' && wy1 > 0.3) A.fill(0, wx.frostCol, 0.08 * wx.frost, polyD(ps));
    if (wx.mould && wy0 < 1.0 && r() < wx.mould * dd && lod > 0.2) for (let i = 0; i < 6 + r() * 10; i++) { const [px, py] = inside(0.45); A.fill(2, '#4a5236', 0.5, ellD(px, py, 0.5 + r() * 1.1, (0.5 + r()) * sq)); }

    // pitting: clustered, each pit a recess shaded at its top left with a lit lip below
    const rp0 = k * 0.009;
    if (rp0 > 0.75 && lod > 0) {
      const n = whole ? Math.min(6, Math.round(2 + r() * 4 * dd)) : Math.min(10, Math.round(am2 * 40 * wx.pits * dd * (0.6 + r())));
      const cl = [inside(0.3), inside(0.3)];
      for (let i = 0; i < n; i++) { const c = cl[i % 2], sp = mpx * (r() < 0.7 ? 0.18 : 0.4), x = c[0] + (r() - 0.5) * sp * 2, y = c[1] + (r() - 0.5) * sp * 1.4 * sq; if (!inPoly(x, y, ps)) continue;
        const rr = Math.min(3.2, k * (0.01 + 0.018 * r() * r())); if (rr < 1) continue;
        A.stroke(3, litCol, Math.max(0.5, rr * 0.35), whole ? 0.22 : 0.35, `M${f1(x - rr * 0.6)} ${f1(y + rr * 0.45 * sq)}Q${f1(x + rr * 0.2)} ${f1(y + rr * 1.0 * sq)} ${f1(x + rr * 0.9)} ${f1(y + rr * 0.2 * sq)}`); A.fill(4, INK, 0.5, ellD(x, y, rr * 0.85, rr * 0.7 * sq)); }
    }
    // pocks: mid-size weathered hollows, a dark recess with a lit lower lip (reads at 1x, unlike pin pits)
    if (mpx > 9) for (let j = 0, nk = Math.floor(r() * 2.4 * dd * Math.min(4, Math.max(1, mpx / 60))); j < nk; j++) { const [px, py] = inside(0.35), rr = Math.min(mpx * 0.2, k * (0.025 + 0.035 * r())); if (rr < 1.6) continue; const pk = lobed(px, py, rr, rr * 0.7 * sq, r, 9, 0.4); A.fill(3, INK, 0.38, smooth(pk, true, 0.8)); A.stroke(5, litCol, Math.max(0.7, rr * 0.22), 0.55, smooth(pk.slice(0, 5).map(([x, y]) => [x - rr * 0.05, y - rr * 0.08]), false, 0.6)); }
    // floor slabs: a worn dip, and a crack right across the slab
    if (face === 'floor' && mpx > 6) { if (r() < 0.4 * dd) { const [px, py] = inside(0.2), rx = bw * (0.22 + r() * 0.15), ry = bh * (0.22 + r() * 0.15); A.fill(0, INK, 0.16, ellD(px, py, rx, ry)); A.stroke(5, litCol, Math.max(0.7, k * 0.008), 0.5, `M${f1(px - rx * 0.8)} ${f1(py + ry * 0.5)}Q${f1(px)} ${f1(py + ry * 1.15)} ${f1(px + rx * 0.85)} ${f1(py + ry * 0.35)}`); }
      if (r() < 0.38 * wx.crack * dd && edges.length > 2) { const e1 = edges[0], e2 = edges[Math.floor(edges.length / 2)], a = [e1.a[0] + (e1.b[0] - e1.a[0]) * (0.2 + r() * 0.6), e1.a[1] + (e1.b[1] - e1.a[1]) * (0.2 + r() * 0.6)], b = [e2.a[0] + (e2.b[0] - e2.a[0]) * (0.2 + r() * 0.6), e2.a[1] + (e2.b[1] - e2.a[1]) * (0.2 + r() * 0.6)], pts = [a]; for (let j = 1; j < 5; j++) pts.push([a[0] + (b[0] - a[0]) * j / 5 + (r() - 0.5) * bw * 0.08, a[1] + (b[1] - a[1]) * j / 5 + (r() - 0.5) * bh * 0.08]); pts.push(b);
        A.stroke(4, INK, Math.max(0.8, k * 0.009), 0.75, lineD(pts)); A.stroke(5, litCol, Math.max(0.5, k * 0.005), 0.4, lineD(pts.map(([x, y]) => [x + 0.8, y + 0.8]))); } }
    // spall: a shallow shell of the face lost from an edge
    if (!whole && mpx > 11 && r() < 0.4 * wx.spall * dd) {
      const e = edges[Math.floor(r() * edges.length)], u = 0.2 + r() * 0.6, ex = e.a[0] + (e.b[0] - e.a[0]) * u - e.nx * mpx * 0.18, ey = e.a[1] + (e.b[1] - e.a[1]) * u - e.ny * mpx * 0.18;
      const sp = lobed(ex, ey, Math.min(bw * (0.12 + r() * 0.12), k * 0.16), Math.min(bh * (0.14 + r() * 0.14), k * 0.12), r, 12, 0.3);
      A.fill(2, INK, 0.2, smooth(sp, true, 0.7)); A.fill(2, shadowFill, 0.35, smooth(sp, true, 0.7));
      const dark = [], lit = []; for (let i = 0; i < sp.length; i++) { const p = sp[i], dx = p[0] - ex, dy = p[1] - ey; (dx * SL[0] + dy * SL[1] < 0 ? dark : lit).push(p); }
      const ord = a => a.sort((p, q) => Math.atan2(p[1] - ey, p[0] - ex) - Math.atan2(q[1] - ey, q[0] - ex));
      if (dark.length > 1) A.stroke(4, INK, lw * 1.5, 0.7, smooth(ord(dark), false, 0.6));
      if (lit.length > 1) A.stroke(5, litCol, lw * 1.2, 0.5, smooth(ord(lit).map(([x, y]) => [x + 0.5, y + 0.6]), false, 0.6));
    }
    // chipped arrises along the edges, and the odd broken corner
    if (lod > 0.05) for (const e of edges) {
      if (e.L < 6 || r() > 0.6 * wx.chips * dd) continue;
      const u = 0.12 + r() * 0.76, w = Math.min(e.L * 0.38, k * (0.04 + 0.08 * r())), dpt = w * (0.4 + 0.4 * r()); if (w < 2) continue;
      const ax = e.a[0] + (e.b[0] - e.a[0]) * u, ay = e.a[1] + (e.b[1] - e.a[1]) * u, tx = (e.b[0] - e.a[0]) / e.L, ty = (e.b[1] - e.a[1]) / e.L;
      const A1 = [ax - tx * w / 2, ay - ty * w / 2], B1 = [ax + tx * w / 2, ay + ty * w / 2], C1 = [ax - e.nx * dpt + tx * (r() - 0.5) * w * 0.4, ay - e.ny * dpt + ty * (r() - 0.5) * w * 0.4];
      A.fill(3, INK, e.sh > 0.2 ? 0.6 : 0.45, polyD([A1, C1, B1]));
      const litIn = (A1[0] + C1[0]) * 0.6 + (A1[1] + C1[1]) * 0.8 > (B1[0] + C1[0]) * 0.6 + (B1[1] + C1[1]) * 0.8 ? [A1, C1] : [C1, B1];
      A.stroke(5, litCol, Math.max(0.8, w * 0.18), 0.7, lineD(litIn)); A.stroke(4, INK, lw * 1.2, 0.75, lineD([A1, C1, B1]));
    }
    if (mpx > 10 && r() < (face === 'floor' ? 0.35 : 0.4) * wx.chips * dd) {
      const i = Math.floor(r() * ps.length), p = ps[i], a0 = ps[(i + ps.length - 1) % ps.length], b0 = ps[(i + 1) % ps.length], ua = 0.15 + r() * 0.22, ub = 0.15 + r() * 0.22;
      const qa = [p[0] + (a0[0] - p[0]) * ua, p[1] + (a0[1] - p[1]) * ua], qb = [p[0] + (b0[0] - p[0]) * ub, p[1] + (b0[1] - p[1]) * ub], qm = [(qa[0] + qb[0]) / 2 + (cx - p[0]) * 0.06, (qa[1] + qb[1]) / 2 + (cy - p[1]) * 0.06];
      A.fill(3, o.joint || mix(fill, INK, 0.7), 1, polyD([p, qa, qm, qb])); A.stroke(4, INK, lw * 1.5, 0.85, lineD([qa, qm, qb]));
      A.stroke(5, litCol, Math.max(0.8, k * 0.01), 0.6, lineD([qa, qm, qb].map(([x, y]) => [x + (cx - x) * 0.08, y + (cy - y) * 0.08])));
    }
    // hairline cracks, wandering from an edge, sometimes branching
    if (mpx > 12 && r() < 0.4 * wx.crack * dd) {
      const e = edges[Math.floor(r() * edges.length)], u = 0.2 + r() * 0.6; let x = e.a[0] + (e.b[0] - e.a[0]) * u, y = e.a[1] + (e.b[1] - e.a[1]) * u, a = Math.atan2(-e.ny, -e.nx);
      const L = Math.hypot(bw, bh) * (0.35 + r() * 0.5), pts = [[x, y]]; let br = null;
      for (let i = 0; i < 6; i++) { a += (r() - 0.5) * 0.7; x += Math.cos(a) * L / 6; y += Math.sin(a) * L / 6 * sq; if (!inPoly(x, y, ps)) break; pts.push([x, y]); if (!br && i > 1 && r() < 0.35) br = [x, y, a + (r() < 0.5 ? -0.8 : 0.8)]; }
      if (pts.length > 2) { A.stroke(4, INK, lw * 1.1, 0.62, smooth(pts, false, 0.5)); A.stroke(5, litCol, lw * 0.8, 0.3, smooth(pts.map(([px, py]) => [px + 0.7, py + 0.8]), false, 0.5)); }
      if (br) { const bp = [[br[0], br[1]]]; let bx = br[0], by = br[1], ba = br[2]; for (let i = 0; i < 3; i++) { ba += (r() - 0.5) * 0.6; bx += Math.cos(ba) * L / 8; by += Math.sin(ba) * L / 8; if (!inPoly(bx, by, ps)) break; bp.push([bx, by]); } if (bp.length > 1) A.stroke(4, INK, lw * 0.8, 0.5, smooth(bp, false, 0.5)); }
    }
    // mortar lost: the joint below and to the right reads dark and deep
    if (!whole && (o.lost || r() < 0.3 * dd)) { for (const e of edges) if (e.sh > 0.25) A.stroke(4, INK, Math.max(0.9, k * 0.024), 0.72, lineD([e.a, e.b])); else if (e.ny < -0.5) A.stroke(4, INK, Math.max(0.7, k * 0.016), 0.55, lineD([e.a, e.b])); }
    if (!whole && face !== 'floor' && botE && wy0 < (wx.moss > 0.1 ? 1.4 : 0.9) && r() < 0.55 * dd) { const gc = wx.moss > 0.1 ? wx.mossCol : wx.algae > 0.2 ? wx.algaeCol : '#2c3022'; A.stroke(4, gc, Math.max(0.9, k * 0.022), 0.75, lineD([botE.a, botE.b]), ` stroke-dasharray="${f1(2 + r() * 5)} ${f1(1 + r() * 3)}"`); }
    if (face === 'floor' && wx.moss > 0.1 && r() < 0.4 * dd) { const e = edges[Math.floor(r() * edges.length)]; A.stroke(4, wx.mossCol, Math.max(0.8, k * 0.016), 0.7, lineD([e.a, e.b]), ' stroke-dasharray="3 2"'); }
    // short runs from under a projecting stone or ledge
    if (!whole && face === 'wall' && botE && wy0 > 0.7 && r() < 0.14 * dd) { const u = 0.2 + r() * 0.6, x = botE.a[0] + (botE.b[0] - botE.a[0]) * u, y = botE.a[1] + (botE.b[1] - botE.a[1]) * u, L = k * (0.15 + 0.4 * r()), w = Math.max(1, k * (0.015 + 0.02 * r())); const [rc] = wx.runCols[0]; A.fill(0, rc, 0.3, `M${f1(x - w)} ${f1(y)}Q${f1(x - w * 0.6)} ${f1(y + L * 0.6)} ${f1(x + (r() - 0.5) * w)} ${f1(y + L)}Q${f1(x + w * 0.5)} ${f1(y + L * 0.5)} ${f1(x + w)} ${f1(y)}Z`); }
    // worn arrises where hands go (walls below 1.4 m): the lit edges rounded and polished
    if (!whole && face === 'wall' && wy0 < 1.4 && lod > 0.1) for (const e of edges) if (e.sh < -0.3) A.stroke(5, litCol, Math.max(0.6, k * 0.012), 0.35 * wx.wear, lineD([[e.a[0] - e.nx * 1.2, e.a[1] - e.ny * 1.2], [e.b[0] - e.nx * 1.2, e.b[1] - e.ny * 1.2]]));
    // lichen: crustose rosettes with satellites, never a circle; upper half of the stone, where it dries
    for (let li = 0, nL = whole ? Math.round(3 * wx.lichen * dd) : 1; li < nL; li++) if (wx.lichen && r() < (whole ? 1 : wx.lichen * dd * (face === 'floor' ? 0.35 : wy0 < 0.3 ? 0.6 : 1))) {
      const Rl = Math.min(whole ? 7 : 14, k * (0.035 + 0.1 * r() * r())); if (Rl > 1.6) {
        const col = wx.lichenCols[Math.floor(r() * wx.lichenCols.length)], [lx, ly0] = inside(0.4), ly = Math.min(ly0, cy + bh * 0.05);
        const ro = lobed(lx, ly, Rl, Rl * 0.85 * sq, r, 10, 0.4); A.fill(1, col, 0.55, smooth(ro, true, 0.8)); if (Rl > 3) A.stroke(1, mix(col, '#ffffff', 0.3), lw * 0.8, 0.4, smooth(ro, true, 0.8));
        if (Rl > 3) A.fill(1, mix(col, INK, 0.3), 0.35, smooth(lobed(lx + Rl * 0.1, ly + Rl * 0.1, Rl * 0.45, Rl * 0.38 * sq, r, 10, 0.5), true, 0.8));
        for (let i = 0; i < 2 + r() * 3; i++) { const a = r() * 6.28, d = Rl * (1.15 + r() * 0.8), rr = Rl * (0.12 + r() * 0.3); A.fill(1, col, 0.5, rr < 2.5 ? ellD(lx + Math.cos(a) * d, ly + Math.sin(a) * d * sq, rr, rr * 0.8 * sq) : smooth(lobed(lx + Math.cos(a) * d, ly + Math.sin(a) * d * sq, rr, rr * 0.8 * sq, r, 7, 0.5), true, 0.8)); }
      }
    }
    // moss: a cushion straddling the top bed (and the joint above it), denser low down
    if (!whole && wx.moss && topE && r() < wx.moss * dd * (wy0 < 0.8 ? 1.6 : 0.6) && lod > 0.1) {
      const e = face === 'floor' ? edges[Math.floor(r() * edges.length)] : topE, u0 = r() * 0.4, u1 = u0 + 0.3 + r() * 0.5, hh = Math.max(1.2, k * (0.012 + 0.025 * r())), top = [], bot = [];
      for (let i = 0; i <= 6; i++) { const u = u0 + (Math.min(1, u1) - u0) * i / 6, x = e.a[0] + (e.b[0] - e.a[0]) * u, y = e.a[1] + (e.b[1] - e.a[1]) * u, env = Math.sin(Math.PI * i / 6); top.push([x, y - hh * env * (0.6 + r() * 0.6)]); bot.push([x, y + hh * env * 0.5]); }
      const d = smooth([...top, ...bot.reverse()], true, 0.6); A.fill(2, wx.mossCol, 0.85, d); A.fill(2, INK, 0.25, smooth([...bot, ...top.map(([x, y], i) => [x, (y + bot[bot.length - 1 - i][1]) / 2]).reverse()], true, 0.6));
      if (hh > 2) for (let i = 1; i < 6; i += 2) A.fill(5, mix(wx.mossCol, '#e8f0a0', 0.4), 0.6, ellD(top[i][0] - 0.5, top[i][1] + 0.6, 0.6, 0.5));
    }
    // salt efflorescence near the damp line
    if (wx.salt && whole && lod > 0.2) for (let j = 0; j < 14 * wx.salt; j++) { const [sx, sy] = inside(0.45); A.fill(6, wx.saltCol, 0.22, ellD(sx, sy, Math.max(0.6, k * 0.006), Math.max(0.5, k * 0.004))); }
    if (!whole && wx.salt && face !== 'floor' && wy0 < (wx.damp || 1) * 1.25 && r() < wx.salt * dd) { const [sx, sy] = inside(0.4), rr = Math.max(1.5, Math.min(mpx * 0.35, k * (0.05 + 0.08 * r()))), b = smooth(lobed(sx, sy - bh * 0.15, rr * 1.3, rr * 0.7, r, 14, 0.5), true, 0.8); A.fill(6, wx.saltCol, 0.18, b); }
    // frost: a rime rind on the top bed and on the lit arrises
    if (wx.frost && botE && face !== 'floor' && lod > 0.15 && r() < 0.3 * wx.frost) for (let j = 0; j < 1 + r() * 3; j++) { const u = 0.1 + r() * 0.8, x = botE.a[0] + (botE.b[0] - botE.a[0]) * u, y = botE.a[1] + (botE.b[1] - botE.a[1]) * u, l = k * (0.03 + 0.09 * r() * r()), w = Math.max(0.8, l * 0.16); A.fill(6, wx.frostCol, 0.9, `M${f1(x - w)} ${f1(y - 0.5)}Q${f1(x - w * 0.3)} ${f1(y + l * 0.5)} ${f1(x + (r() - 0.5) * w * 0.4)} ${f1(y + l)}Q${f1(x + w * 0.3)} ${f1(y + l * 0.5)} ${f1(x + w)} ${f1(y - 0.5)}Z`); A.stroke(6, INK, lw * 0.8, 0.55, `M${f1(x + w)} ${f1(y - 0.5)}Q${f1(x + w * 0.3)} ${f1(y + l * 0.5)} ${f1(x)} ${f1(y + l)}`); }
    if (!whole && wx.frost && lod > 0.2 && r() < 0.35 * wx.frost) { const [hx, hy] = inside(0.4), rr = mpx * (0.15 + r() * 0.2); A.fill(6, wx.frostCol, 0.22, smooth(lobed(hx, hy, rr * 1.4, rr * 0.8 * sq, r, 14, 0.5), true, 0.8)); }
    if (wx.frost && topE) { const t = Math.max(0.8, k * (0.01 + 0.018 * r()) * wx.frost), pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([topE.a[0] + (topE.b[0] - topE.a[0]) * u, topE.a[1] + (topE.b[1] - topE.a[1]) * u + t * (0.4 + r() * 0.7)]); }
      A.stroke(6, wx.frostCol, t, 0.8, smooth(pts, false, 0.5)); if (face !== 'floor' && lod > 0.3) for (let i = 1; i < 8; i += 2) A.stroke(6, wx.frostCol, lw * 0.7, 0.6, lineD([pts[i], [pts[i][0] + (r() - 0.5) * t * 2, pts[i][1] + t * (1 + r() * 2)]])); }
    // weed hanging from the joint (sea worlds)
    if (wx.weed && botE && wy0 < (wx.algaeH || 1) && r() < wx.weed * dd && lod > 0.2) for (let i = 0; i < 2 + r() * 3; i++) { const u = r(), x = botE.a[0] + (botE.b[0] - botE.a[0]) * u, y = botE.a[1] + (botE.b[1] - botE.a[1]) * u, L = k * (0.05 + 0.12 * r()); A.stroke(6, mix(wx.algaeCol, '#5a7a3a', 0.4), Math.max(0.6, k * 0.006), 0.85, smooth([[x, y], [x + (r() - 0.5) * L * 0.3, y + L * 0.5], [x + (r() - 0.5) * L * 0.4, y + L]], false, 0.6)); }
  }

  // ---------------------------------------------------------------- plane passes
  const BUDGET = { used: 0 };
  const layerSize = () => { const L = S.LAY && S.curLayer ? S.LAY[S.curLayer()] : null; if (!L) return 0; let n = 0; for (const e of L) if (typeof e === 'string') n += e.length; return n; };
  const P2q = (at, Ls, Lt) => polyD([P(...at(0, 0)), P(...at(Ls, 0)), P(...at(Ls, Lt)), P(...at(0, Lt))]);
  const orient = (at, Ls, Lt) => { const a = at(Ls * 0.5, Lt * 0.5), b = at(Ls * 0.5, Lt * 0.5 + 0.1); const up = (b[1] - a[1]) / 0.1; const pa = P(...a), pb = P(...b), pc = P(...at(Ls * 0.5 + 0.1, Lt * 0.5)); const sq = Math.min(1, Math.max(0.12, Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / (Math.hypot(pc[0] - pa[0], pc[1] - pa[1]) || 1)));
    return { face: up > 0.6 || up < -0.6 ? 'wall' : Math.abs(up) < 0.25 ? 'floor' : 'vault', up, sq: Math.abs(up) > 0.6 ? 1 : sq }; };
  function begin(at, Ls, Lt, wxIn) {
    const wx = resolve(wxIn); const A = Acc(); if (!wx) return { stone() {}, stoneNow: () => '', flush: () => '', end: () => '', wx: null };
    const or = orient(at, Ls, Lt); let flushed = 0, stoneBytes = 0, fsum = [0, 0, 0], fn = 0;
    // near planes get more detail; a layer that is already heavy gets less (rooms differ: keep every layer under ~5 MB)
    const LS0 = layerSize(), shareNow = LS0 < 2.5e6 ? 0.55 : LS0 < 3.6e6 ? 0.38 : STONE_SHARE;
    const planeCap = MARK_CAP * Math.max(0.25, Math.min(1.6, K(at(Ls / 2, Lt / 2)[2]) / 110)) * Math.max(0.12, Math.min(1, (4.6e6 - layerSize()) / 1.6e6));
    return { wx, face: or.face,
      flush() { const s = A.svg(); A.reset(); BUDGET.used += s.length; flushed += s.length; return s; },
      stoneNow(ps, Z, fill, q3, o = {}) { this.stone(ps, Z, fill, q3, o); return o.now ? this.flush() : ''; },
      stone(ps, Z, fill, q3, o = {}) { const ys = q3.map(p => p[1]); stoneBytes += 260 + 26 * ps.length; if (fill.length === 7 && fn < 400) { const v = parseInt(fill.slice(1), 16); fsum[0] += (v >> 16) & 255; fsum[1] += (v >> 8) & 255; fsum[2] += v & 255; fn++; } marks(A, ps, Z, fill, { wx, face: or.face, sq: or.face === 'floor' ? Math.min(1, Math.max(0.15, S.EYE / Z)) : 1, wy0: Math.min(...ys), wy1: Math.max(...ys), sx: q3[0][0] + q3[0][2] * 0.7, joint: o.joint, lost: o.lost, thin: o.thin, decay: o.decay, inPlane: true, heavy: LS0 > 3.4e6, veryHeavy: LS0 > 4.2e6, flushed: () => flushed, cap: Math.min(planeCap, 12000 + stoneBytes * shareNow) }); },
      end(o = {}) { const quad = P2q(at, Ls, Lt); let s = `<path d="${quad}" fill="url(#speck)" opacity="0.5"/>`;
        if (wx.frost && or.face !== 'floor') s += `<path d="${quad}" fill="${wx.frostCol}" opacity="${f1(0.08 * wx.frost * 100) / 100}"/>`;
        s += A.svg(); const wb = fn ? Object.assign({}, wx, { baseCol: '#' + fsum.map(v => Math.round(v / fn).toString(16).padStart(2, '0')).join('') }) : wx; if (o.plane !== false && Ls * Lt > 1.2) s += or.face === 'floor' ? weatherFloor(at, Ls, Lt, wb) : or.face === 'wall' ? weatherWall(at, Ls, Lt, wb, or) : '';
        BUDGET.used += s.length; if (process.env.MV2_DEBUG) console.error('mv2 plane', or.face, Math.round(s.length / 1024) + 'KB', 'scene', Math.round(BUDGET.used / 1024) + 'KB'); return s; } };
  }
  let lsCache = 0, lsN = 0;
  function stoneMarks(ps, Z, fill, o = {}) { const wx = resolve(o.wx); if (!wx) return ''; if (lsN++ % 40 === 0) lsCache = layerSize(); const A = Acc(); marks(A, ps, Z, fill, Object.assign({ wx, face: 'wall', wy0: o.wy0 ?? 0.5, heavy: lsCache > 3.4e6, veryHeavy: lsCache > 4.2e6 }, o, { wx })); const s = A.svg(); BUDGET.used += s.length; return s; }

  const DEFER = {};
  function sootPlumes(at, Ls, Lt, wx, or) {
    let out = ''; const S2 = (s, t) => P(...at(Math.max(-0.5, Math.min(Ls + 0.5, s)), Math.max(0, Math.min(Lt, t))));
    { const o0 = at(0, 0), es = at(1, 0).map((v, i) => v - o0[i]), et = at(0, 1).map((v, i) => v - o0[i]), nn = [es[1] * et[2] - es[2] * et[1], es[2] * et[0] - es[0] * et[2], es[0] * et[1] - es[1] * et[0]], nl = Math.hypot(...nn) || 1;
      for (const Lg of (S.LIGHTS || [])) { const d = Lg.pos.map((v, i) => v - o0[i]), dist = Math.abs(d[0] * nn[0] + d[1] * nn[1] + d[2] * nn[2]) / nl; if (dist > 2.6) continue;
        const sL = (d[0] * es[0] + d[1] * es[1] + d[2] * es[2]) / (es[0] ** 2 + es[1] ** 2 + es[2] ** 2), tL = (d[0] * et[0] + d[1] * et[1] + d[2] * et[2]) / (et[0] ** 2 + et[1] ** 2 + et[2] ** 2); if (sL < -0.5 || sL > Ls + 0.5 || tL < -0.5 || tL > Lt) continue;
        const kk = 1 - dist / 2.6, hgt = Math.min(Math.abs(Lt - tL), 1.2 + 2 * kk * Math.min(1.5, Lg.I || 1)), up = or.up > 0 ? 1 : -1;
        for (const [k2, op] of [[1, 0.1], [0.7, 0.12], [0.42, 0.14]]) { const pts = []; for (let j = 0; j <= 12; j++) { const u = j / 12, w = (0.18 + 0.55 * u) * k2 * (0.8 + 0.4 * fbm(u * 3, k2, 61)) * (0.6 + kk); pts.push([sL - w, tL + up * hgt * k2 * u * 1.1]); } const L2 = pts.map(([ss, tt]) => S2(ss, tt)), R2 = pts.map(([ss, tt]) => S2(2 * sL - ss, tt)).reverse();
          out += `<path d="${smooth([...L2, ...R2], true, 0.6)}" fill="${wx.sootCol || '#0e0a08'}" opacity="${f1(op * (0.6 + kk * 0.6) * 100) / 100}"/>`; } } }
    return out;
  }
  const DONE = {}; const deferred = id => DONE[id] ?? (DONE[id] = DEFER[id] ? DEFER[id]() : '');
  // the plane's own weathering on a wall: staining runs under ledges and from joints, the damp band, through cracks
  function weatherWall(at, Ls, Lt, wxIn, or0) {
    const wx = wxIn && wxIn.decay !== undefined ? wxIn : resolve(wxIn); if (!wx) return '';
    const or = or0 || orient(at, Ls, Lt); if (or.face !== 'wall') return '';
    if (BUDGET.used > SCENE_CAP) return '';
    const r = rng(hseed(...at(0, 0), Ls, Lt, 3)), A = Acc(), dn = or.up > 0 ? -1 : 1, tTop = or.up > 0 ? Lt : 0, Zc = at(Ls / 2, Lt / 2)[2];
    const S2 = (s, t) => P(...at(Math.max(0, Math.min(Ls, s)), Math.max(0, Math.min(Lt, t))));
    // runs
    const heavy = layerSize() > 4.2e6, nRuns = heavy || Lt < 1.2 ? 0 : Math.min(30, Math.round(Ls * (wx.runs + 0.5) * 1.1 * wx.decay * (0.7 + r() * 0.6)));
    for (let i = 0; i < nRuns; i++) {
      const s0 = r() * Ls, fromTop = r() < 0.6, t0 = fromTop ? tTop : Lt * (0.25 + r() * 0.7), L = Math.min(Lt * 0.9, (0.25 + 1.2 * r() * r()) * Math.min(3, Lt)), w0 = 0.02 + r() * 0.055;
      const [col0, cop] = wx.runCols[Math.floor(r() * wx.runCols.length)], col = wx.baseCol ? mix(mix(wx.baseCol, INK, 0.55), col0, 0.3) : col0, op = wx.runOp * cop * (0.6 + r() * 0.8), ph = r() * 6, fingers = r() < 0.3 ? 2 : 1;
      for (let f = 0; f < fingers; f++) { const off = (f - (fingers - 1) / 2) * w0 * 1.2, Lf = L * (f ? 0.5 + r() * 0.4 : 1), le = [], ri = [];
        for (let j = 0; j <= 6; j++) { const u = j / 6, t = t0 + dn * Lf * u, sc = s0 + off + Math.sin(u * 5 + ph) * 0.025 + u * u * (r() - 0.5) * 0.05, w = w0 * (0.6 + 0.6 * Math.sin(u * 7 + ph) ** 2) * Math.pow(1 - u, 0.9) * (f ? 0.6 : 1) + 0.003; le.push(S2(sc - w, t)); ri.push(S2(sc + w, t)); }
        A.fill(0, col, op, smooth([...le, ...ri.reverse()], true, 0.6)); }
    }
    // damp band from the ground: two ragged steps, a tide line, salts along it
    const yb = Math.min(at(0, 0)[1], at(0, Lt)[1]), ytop = Math.max(at(0, 0)[1], at(0, Lt)[1]);
    // v2.1: grime and damp climb the bottom third of every wall that stands on the floor (at least the world's damp height)
    const dampH = Math.max(wx.damp || 0, Math.min(1.6, (ytop - yb) / 3));
    if (yb < 0.3 && dampH > 0.2) {
      const top = k2 => { const o = []; const N = Math.max(8, Math.min(60, Math.round(Ls * 2.5))); for (let j = 0; j <= N; j++) { const s = Ls * j / N, h = dampH * k2 * (0.75 + 0.35 * fbm(s * 1.3 + at(0, 0)[0], 3, 17)); o.push([s, (h - yb) * (or.up > 0 ? 1 : -1) + (or.up > 0 ? 0 : Lt)]); } return o; };
      for (const [k2, op] of [[1, 0.16], [0.6, 0.17], [0.25, 0.18]]) { const tp = top(k2); A.fill(0, wx.dampCol, op, smooth([S2(0, or.up > 0 ? 0 : Lt), ...tp.map(([s, t]) => S2(s, t)), S2(Ls, or.up > 0 ? 0 : Lt)], true, 0.5)); if (k2 === 1) { A.stroke(5, mix(wx.dampCol, INK, 0.4), Math.max(0.6, inkW(Zc) * 0.5), 0.4, smooth(tp.map(([s, t]) => S2(s, t)), false, 0.5)); if (wx.salt) A.stroke(6, wx.saltCol, Math.max(0.6, inkW(Zc) * 0.7), 0.45, smooth(tp.map(([s, t]) => { const p = S2(s, t); return [p[0], p[1] + 1.5]; }), false, 0.5), ' stroke-dasharray="3 2 1 3"'); } }
      // moss and grass along the foot outdoors
      if (wx.moss > 0.2 && yb < 0.1) for (let j = 0; j < Ls * 3 * wx.moss; j++) { const s = r() * Ls, w = 0.1 + r() * 0.3, p0 = S2(s - w, or.up > 0 ? 0 : Lt), p1 = S2(s + w, or.up > 0 ? 0 : Lt), kk = K(at(s, 0)[2]), hh = kk * (0.02 + r() * 0.05); A.fill(2, wx.mossCol, 0.85, smooth([p0, [(p0[0] * 2 + p1[0]) / 3, p0[1] - hh], [(p0[0] + p1[0] * 2) / 3, p1[1] - hh * (0.6 + r() * 0.5)], p1], true, 0.7)); }
    }
    // soot climbing the wall above each of the room's lights near it (lamps, candles, braziers): stepped, ragged plumes. The
    // lights are usually added after the walls, so this is filled in when the layer is written (lik.js svgLayer)
    { const did = 'd' + (serial++); DEFER[did] = () => sootPlumes(at, Ls, Lt, wx, or); A.raw(0, `<!--mv2:${did}-->`); }
    // through cracks: across several courses, stepping, branching, with a lit lower lip
    const nC = Math.min(3, Math.floor(Ls * Lt * 0.025 * wx.crack * wx.decay + r() * 0.8));
    for (let i = 0; i < nC; i++) {
      let s = Ls * (0.1 + r() * 0.8), t = or.up > 0 ? Lt * (0.55 + r() * 0.45) : Lt * r() * 0.45; const pts = [], L = Math.min(Lt * 0.8, 1 + r() * 2.2);
      for (let j = 0; j <= 9; j++) { pts.push(S2(s, t)); s += (r() - 0.5) * 0.22 + (j % 3 === 2 ? (r() - 0.5) * 0.25 : 0); t += dn * L / 9; }
      const w = Math.max(0.6, inkW(Zc) * 0.85); A.stroke(4, INK, w, 0.75, smooth(pts, false, 0.4)); A.stroke(5, mix('#e8dcc0', KEY, 0.3), w * 0.6, 0.3, smooth(pts.map(([x, y]) => [x + 0.9, y + 1]), false, 0.4));
      const bj = 2 + Math.floor(r() * 5), bp = [pts[bj]]; let bx = bp[0][0], by = bp[0][1]; const ba = (r() < 0.5 ? -1 : 1) * (0.6 + r() * 0.6); for (let j = 0; j < 4; j++) { bx += Math.sin(ba) * K(Zc) * 0.08; by += Math.cos(ba) * K(Zc) * 0.08 * (or.up > 0 ? 1 : -1) * (r() + 0.3); bp.push([bx, by]); } A.stroke(4, INK, w * 0.7, 0.6, smooth(bp, false, 0.5));
    }
    return A.svg();
  }
  // a floor: the path worn polished by feet, dirt, cracks running back, puddles or frost by world
  function weatherFloor(at, Ls, Lt, wxIn, o = {}) {
    const wx = wxIn && wxIn.decay !== undefined ? wxIn : resolve(wxIn); if (!wx || BUDGET.used > SCENE_CAP) return '';
    const r = rng(hseed(...at(0, 0), Ls, Lt, 9)), A = Acc(), S2 = (s, t) => P(...at(Math.max(0, Math.min(Ls, s)), Math.max(0, Math.min(Lt, t))));
    const sc = o.pathS ?? Ls * (0.4 + r() * 0.2), pw = o.pathW ?? Math.min(Ls * 0.35, 1.6);
    for (const [k2, op] of [[1, 0.05], [0.55, 0.05]]) { const L = [], Rr = []; const N = 12; for (let j = 0; j <= N; j++) { const t = Lt * j / N, wob = 0.3 * Math.sin(t * 0.7 + 1) + (fbm(t * 0.8, k2, 23) - 0.5) * 0.5; L.push(S2(sc - pw * k2 + wob, t)); Rr.push(S2(sc + pw * k2 + wob * 0.8, t)); } A.fill(0, mix(KEY, '#ffffff', 0.2), op * (wx.wear ?? 1), smooth([...L, ...Rr.reverse()], true, 0.5)); }
    for (let i = 0; i < Math.min(8, Math.round(Ls * Lt * 0.02 * wx.crack)); i++) { let s = r() * Ls, t = r() * Lt * 0.6; const pts = []; for (let j = 0; j < 8; j++) { pts.push(S2(s, t)); s += (r() - 0.5) * 0.3; t += 0.2 + r() * 0.4; } const Zc = at(s, t)[2]; A.stroke(4, INK, Math.max(0.45, inkW(Zc) * 0.6), 0.55, smooth(pts, false, 0.5)); }
    if (wx.damp > 0.9 || wx.algae > 0.3) for (let i = 0; i < Math.round(1 + r() * 2); i++) { const s = r() * Ls, t = r() * Lt * 0.5, Zc = at(s, t)[2], kk = K(Zc), c = S2(s, t), rx = kk * (0.2 + r() * 0.4), ry = rx * Math.min(1, S.EYE / Zc); A.fill(1, '#0a0c0e', 0.35, smooth(lobed(c[0], c[1], rx, ry, r, 14, 0.4), true, 0.8)); A.stroke(5, mix(KEY, '#ffffff', 0.3), Math.max(0.5, kk * 0.006), 0.35, `M${f1(c[0] - rx * 0.4)} ${f1(c[1] - ry * 0.1)}l${f1(rx * 0.5)} 0`); }
    if (wx.frost) for (let i = 0; i < Math.round(Ls * Lt * 0.03 * wx.frost); i++) { const s = r() * Ls, t = r() * Lt, Zc = at(s, t)[2], kk = K(Zc), c = S2(s, t), rx = kk * (0.1 + r() * 0.3); A.fill(6, wx.frostCol, 0.35, smooth(lobed(c[0], c[1], rx, rx * Math.min(1, S.EYE / Zc), r, 12, 0.5), true, 0.8)); }
    return A.svg();
  }

  // ---------------------------------------------------------------- hewn / natural rock in a plane
  // o: { bed (m, bedding thickness), dip (dt per ds), joint (m, fracture spacing), tool (pick marks), wx, vary, recess }
  function hewnRock(at, Ls, Lt, col, o = {}) {
    const r = rng(hseed(...at(0, 0), Ls, Lt, o.seed || 1)), wx = resolve(o.wx), A = Acc();
    const bed = o.bed || 0.5, dip = o.dip ?? 0.06, jsp = o.joint || 0.9, S2 = (s, t) => P(...at(s, t));
    const face = polyD([S2(0, 0), S2(Ls, 0), S2(Ls, Lt), S2(0, Lt)]), fcid = S.id('hf');
    let out = `<clipPath id="${fcid}"><path d="${face}"/></clipPath><g clip-path="url(#${fcid})"><path d="${face}" fill="${mix(col, INK, 0.55)}"/>`;
    // bedding planes: boundaries t_i(s), undulating, dipping, of very uneven thickness (thin partings between thick beds)
    const bounds = [() => -0.5]; let tb = -bed * r();
    while (tb < Lt + bed) { tb += bed * (r() < 0.3 ? 0.25 + r() * 0.3 : 0.7 + r() * 1.3); const t0 = tb, p = r() * 6, a = bed * 0.1; bounds.push(s => t0 + dip * s + Math.sin(s * 0.7 + p) * a + (fbm(s * 0.5, t0, 41) - 0.5) * bed * 0.4); }
    const blocks = [];
    for (let b = 0; b < bounds.length - 1; b++) {
      const lo = bounds[b], hi = bounds[b + 1], recess = r() < (o.recess ?? 0.3), bandTone = mix(col, recess ? INK : '#e0d4b8', recess ? 0.18 : 0.04 + 0.2 * r());
      let s = -r() * jsp * 2;
      while (s < Ls) {
        // fractures are sparse and slanted, so a bed runs on as one long mass, broken here and there
        const w = jsp * (1.2 + r() * 2.8), s0 = s, s1 = Math.min(Ls + 0.4, s + w), sl0 = (r() - 0.5) * 0.5, sl1 = (r() - 0.5) * 0.5, gap = 0.006 + r() * 0.01;
        const pa = S2(s0, lo(s0)), pb = S2(s1, lo(s1)), pts = [], N = Math.max(3, Math.min(40, Math.round(Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 7)));
        const tl = s2 => lo(s2) + gap, th = s2 => hi(s2) - gap;
        for (let j = 0; j <= N; j++) { const ss = s0 + gap + (s1 - s0 - 2 * gap) * j / N; pts.push([ss, tl(ss) + (r() - 0.5) * 0.012]); }
        const iTop0 = pts.length + 3;
        for (let j = 1; j < 4; j++) { const u = j / 4, tt = tl(s1) + (th(s1) - tl(s1)) * u; pts.push([s1 - gap + sl1 * (u - 0.5) * (th(s1) - tl(s1)) + (r() - 0.5) * 0.015, tt]); }
        for (let j = N; j >= 0; j--) { const ss = s0 + gap + (s1 - s0 - 2 * gap) * j / N; pts.push([ss, th(ss) + (r() - 0.5) * 0.015]); }
        const iTop1 = pts.length;
        for (let j = 3; j > 0; j--) { const u = j / 4, tt = tl(s0) + (th(s0) - tl(s0)) * u; pts.push([s0 + gap + sl0 * (u - 0.5) * (th(s0) - tl(s0)) + (r() - 0.5) * 0.015, tt]); }
        const pl = pts;   // not clamped to the plane (clamping inked the plane's own border); the face is clipped instead
        if (Math.min(...pl.map(p => p[1])) < Lt && Math.max(...pl.map(p => p[1])) > 0 && Math.min(...pl.map(p => p[0])) < Ls && Math.max(...pl.map(p => p[1])) - Math.min(...pl.map(p => p[1])) > 0.03 && Math.max(...pl.map(p => p[0])) - Math.min(...pl.map(p => p[0])) > 0.03) blocks.push({ pl, tone: mix(bandTone, r() < 0.5 ? '#d8ccb0' : r() < 0.6 ? INK : '#8a5a30', r() * (o.vary ?? 0.24)), recess, top: [iTop0 - 1, iTop1] });
        s = s1;
      }
    }
    for (const bk of blocks) {
      const ps = bk.pl.map(([s, t]) => S2(s, t)), q3 = bk.pl.map(([s, t]) => at(s, t)), Z = q3.reduce((a, p) => a + p[2], 0) / q3.length, kk = K(Z);
      const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
      if (bw < 1 || bh < 0.8) continue;
      const d = smooth(ps, true, 0.9), sh = mix(bk.tone, SHT, 0.5), b = Math.max(0.8, Math.min(bh * 0.3, kk * 0.035)), cid = S.id('hr'), pid = cid + 'p', U = `href="#${pid}"`;
      // rounded weathering: the face lit, its lower and right shoulders rolling into shadow (offset fill, clipped). The outline
      // is written once (inline defs) and reused, so a long bed costs one path.
      out += `<defs><path id="${pid}" d="${d}"/></defs><clipPath id="${cid}"><use ${U}/></clipPath><g clip-path="url(#${cid})"><use ${U} fill="${sh}"/><use ${U} transform="translate(${f1(-b * 0.55)},${f1(-b * 0.75)})" fill="${bk.tone}"/>` + (bw > 30 ? `<use ${U} fill="url(#mottle)" opacity="0.35"/>` : '') + `<use ${U} transform="translate(${f1(b * 0.6)},${f1(b * 0.8)})" fill="none" stroke="${hatchA(Z)}" stroke-width="${f1(b * 1.4)}" opacity="0.5"/>`;
      if (bk.recess) out += `<path d="${smooth(ps.slice(bk.top[0], bk.top[1]).concat(ps.slice(bk.top[0], bk.top[1]).reverse().map(([x, y]) => [x, y + Math.min(bh * 0.4, kk * 0.12)])), true, 0.6)}" fill="${INK}" opacity="0.3"/>`;
      out += `</g>`;
      const top = ps.slice(bk.top[0], bk.top[1]);
      if (top.length > 2 && !bk.recess) out += `<path d="${smooth(top.map(([x, y]) => [x, y + b * 0.45]), false, 0.6)}" fill="none" stroke="${mix(bk.tone, KEY, 0.5)}" stroke-width="${f1(Math.max(0.6, b * 0.45))}" opacity="0.4" stroke-linecap="round" stroke-dasharray="${f1(8 + r() * 14)} ${f1(2 + r() * 5)}"/>`;
      out += `<use ${U} fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.45, inkW(Z) * 0.6))}" stroke-linejoin="round"/>`;
      const bot = ps.slice(0, bk.top[0] - 3);
      if (bot.length > 2) out += `<path d="${smooth(bot, false, 0.6)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.7, S.inkH(Z) * 0.45))}" opacity="0.8" stroke-linecap="round"/>`;
      if (o.tool && bw > 14) for (let g = 0; g < Math.ceil(bw / (kk * 0.9)); g++) { if (r() > 0.55) continue; let tm = ''; const a = 1.0 + (r() - 0.5) * 0.3, l = Math.min(bh * 0.45, kk * 0.1), gx = Math.min(...xs) + r() * bw, gy = Math.min(...ys) + bh * (0.25 + r() * 0.4); for (let j = 0; j < 3 + r() * 4; j++) { const x = gx + j * kk * 0.035 + (r() - 0.5) * 2, y = gy + (r() - 0.5) * 3; if (!inPoly(x, y, ps)) continue; tm += `M${f1(x)} ${f1(y)}q${f1(Math.cos(a) * l * 0.5 + 1)} ${f1(Math.sin(a) * l * 0.5)} ${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}`; } if (tm) out += `<path d="${tm}" stroke="${INK}" stroke-width="${f1(Math.max(0.45, kk * 0.006))}" fill="none" opacity="0.5"/><path d="${tm}" transform="translate(0.7,0.8)" stroke="${mix(bk.tone, KEY, 0.5)}" stroke-width="${f1(Math.max(0.35, kk * 0.004))}" fill="none" opacity="0.35"/>`; }
      if (wx) marks(A, ps, Z, bk.tone, { wx: Object.assign({}, wx, { chips: wx.chips * 0.3 }), face: 'rock', wy0: Math.min(...q3.map(p => p[1])), wy1: Math.max(...q3.map(p => p[1])), sx: q3[0][0] + q3[0][2] * 0.7, inPlane: true });
    }
    // fractures that cut across beds (a joint set), dark with a lit lip
    const Zm = at(Ls / 2, Lt / 2)[2];
    for (let i = 0; i < Math.round(Ls / (jsp * 2.5)) + 1; i++) { let s = r() * Ls, t = Lt; const pts = [], L = Lt * (0.3 + r() * 0.6); for (let j = 0; j <= 8; j++) { pts.push(S2(Math.max(0, Math.min(Ls, s)), Math.max(0, t))); s += (r() - 0.5) * 0.08 + 0.03; t -= L / 8; }
      out += `<path d="${smooth(pts, false, 0.5)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.6, inkW(Zm) * 0.9))}" opacity="0.7"/><path d="${smooth(pts.map(([x, y]) => [x + 0.9, y]), false, 0.5)}" fill="none" stroke="${mix(col, KEY, 0.5)}" stroke-width="${f1(Math.max(0.4, inkW(Zm) * 0.5))}" opacity="0.3"/>`; }
    out += `<path d="${face}" fill="url(#speck)" opacity="0.45"/>` + A.svg();
    if (wx) out += weatherWall(at, Ls, Lt, Object.assign({}, wx, { crack: wx.crack * 0.3 }));
    BUDGET.used += out.length;
    return out + '</g>';
  }
  // natural rock weathering inside a screen outline: bedding lines at a dip, cross fractures, tafoni pits, lichen, runs.
  // o: { cell (px bedding spacing), dip (radians), noClip, wx, wy0 (world height of the outline's foot) }
  function rockSkin(pts, Z, col, o = {}) {
    const wx = resolve(o.wx); if (!wx) return '';
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
    if (w < 6 || h < 4) return '';
    const r = rng(hseed(x0, y0, x1, y1, Z)), k = K(Z), sp = o.cell || Math.max(6, Math.min(h / 3, k * 0.45)), dip = o.dip ?? (r() - 0.5) * 0.3, tn = Math.tan(dip), A = Acc();
    const Lc = lum(col.length === 7 ? col : '#777777'), lw = Math.max(0.45, inkW(Z) * 0.6), lit = mix(col, KEY, Lc < 0.25 ? 0.22 : 0.4);
    if (o.strata !== false) for (let y = y0 + sp * (0.5 + r() * 0.5); y < y1 + Math.abs(tn) * w; y += sp * (0.6 + r() * 0.8)) {
      const seg = []; const segs = [];
      for (let x = x0 - 4; x <= x1 + 4; x += Math.max(3, w / 30)) { const yy = y + (x - x0) * tn + (fbm(x * 0.03, y * 0.05, 3) - 0.5) * sp * 0.6; if (fbm(x * 0.02 + y, y * 0.01, 9) > 0.38) seg.push([x, yy]); else if (seg.length) { segs.push(seg.splice(0)); } }
      if (seg.length) segs.push(seg);
      for (const sgm of segs) if (sgm.length > 2) { A.stroke(4, INK, lw, 0.55, smooth(sgm, false, 0.5)); A.stroke(5, lit, Math.max(0.6, sp * 0.1), Lc < 0.25 ? 0.14 : 0.25, smooth(sgm.map(([x, yy]) => [x, yy + sp * 0.12 + 0.8]), false, 0.5)); A.fill(0, INK, 0.1, smooth([...sgm, ...sgm.slice().reverse().map(([x, yy]) => [x, yy - sp * 0.3])], true, 0.5)); }
    }
    if (o.strata !== false) for (let i = 0; i < Math.round(w * h / (sp * sp * 6)) + 1 && i < 14; i++) { let x = x0 + r() * w, y = y0 + r() * h; const p = [[x, y]]; for (let j = 0; j < 3; j++) { x += (r() - 0.4) * sp * 0.25; y += sp * (0.25 + r() * 0.3); p.push([x, y]); } A.stroke(4, INK, lw * 1.1, 0.6, smooth(p, false, 0.5)); A.stroke(5, lit, lw * 0.7, 0.28, smooth(p.map(([a, b]) => [a - 0.8, b]), false, 0.5)); }
    // tafoni: honeycomb hollows in clusters, each a recess shaded top-left with a lit lip below
    if (k > 20) for (let c = 0; c < 1 + r() * 2; c++) { const cx = x0 + w * (0.15 + r() * 0.7), cy = y0 + h * (0.2 + r() * 0.6); for (let i = 0; i < 4 + r() * 8; i++) { const x = cx + (r() - 0.5) * sp * 1.4, y = cy + (r() - 0.5) * sp, rr = Math.min(3, Math.max(0.6, sp * (0.06 + 0.12 * r()))); if (!inPoly(x, y, pts)) continue; A.fill(4, INK, 0.42, ellD(x, y, rr * 0.9, rr * 0.65)); A.stroke(5, lit, Math.max(0.5, rr * 0.3), Lc < 0.25 ? 0.15 : 0.25, `M${f1(x - rr * 0.7)} ${f1(y + rr * 0.4)}Q${f1(x + rr * 0.1)} ${f1(y + rr * 0.95)} ${f1(x + rr * 0.85)} ${f1(y + rr * 0.15)}`); } }
    // pits and lichen over the whole outline, damp at its foot, runs from the top
    marks(A, pts, Z, col, { whole: true, wx: Object.assign({}, wx, { chips: 0, spall: wx.spall * 0.6 }), face: 'rock', wy0: o.wy0 ?? 0.6, wy1: (o.wy0 ?? 0.6) + h / k, sx: x0 / k });
    if (k > 12) for (let i = 0; i < Math.min(10, Math.round(w / (k * 0.6) * wx.runs)); i++) { const x = x0 + r() * w, top = y0 + h * r() * 0.4, L = h * (0.2 + r() * 0.5), w0 = Math.min(5, Math.max(1, k * (0.02 + r() * 0.04))), [rc0, rop] = wx.runCols[Math.floor(r() * wx.runCols.length)], rc = mix(mix(col, INK, 0.5), rc0, 0.3), le = [], ri = []; for (let j = 0; j <= 8; j++) { const u = j / 8, ww = w0 * Math.pow(1 - u, 0.7) + 0.3; le.push([x - ww + Math.sin(u * 3 + i) * 1.2, top + L * u]); ri.push([x + ww + Math.sin(u * 3 + i) * 1.2, top + L * u]); } A.fill(0, rc, wx.runOp * rop, smooth([...le, ...ri.reverse()], true, 0.6)); }
    const body = A.svg(); if (o.noClip) return body;
    const cid = S.id('mvr'); return `<clipPath id="${cid}"><path d="${smooth(pts, true, o.round ?? 0.35)}"/></clipPath><g clip-path="url(#${cid})">${body}</g>`;
  }

  // ================================================================ organic trees, roots, vines, kelp
  // a smooth tapering tube on a guide (screen). widths: number pair or a function of u. Returns { d, L, R, c }
  function tubeOf(guide, w0, w1, per = 5) {
    const wf = typeof w0 === 'function' ? w0 : u => w0 + (w1 - w0) * Math.pow(u, 0.85);
    const c = crSample(guide, guide.length > 2 ? per : per * 2, Math.min(8, 4.5 + wf(0) * 0.1)), n = c.length, L = [], Rr = [];
    let acc = [0]; for (let i = 1; i < n; i++) acc.push(acc[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1])); const tot = acc[n - 1] || 1;
    for (let i = 0; i < n; i++) { const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ww = Math.max(0.25, wf(acc[i] / tot) / 2); L.push([c[i][0] - dy / l * ww, c[i][1] + dx / l * ww]); Rr.push([c[i][0] + dy / l * ww, c[i][1] - dx / l * ww]); }
    const e = c[n - 1], pe = c[Math.max(0, n - 2)], el = Math.hypot(e[0] - pe[0], e[1] - pe[1]) || 1, tipW = Math.max(0.25, wf(1) / 2);
    const tip = [e[0] + (e[0] - pe[0]) / el * tipW * 0.6, e[1] + (e[1] - pe[1]) / el * tipW * 0.6];
    return { d: lineD([...L, tip, ...Rr.slice().reverse()]) + 'Z', L, R: Rr, c, acc, tot, wf };
  }
  // shade a tube: shadow band on the side away from the key light (hatched when wide), lit stripe on the other
  function shadeTube(T, col, Z, o = {}) {
    const n = T.c.length; if (n < 3) return '';
    const band = [], inner = [], litE = [];
    for (let i = 0; i < n; i++) { const c = T.c[i], l = T.L[i], rr = T.R[i], nl = [l[0] - c[0], l[1] - c[1]], useL = nl[0] * SL[0] + nl[1] * SL[1] > 0, sE = useL ? l : rr, lE = useL ? rr : l;
      band.push(sE); inner.push([sE[0] + (c[0] - sE[0]) * (o.band ?? 0.75), sE[1] + (c[1] - sE[1]) * (o.band ?? 0.75)]); litE.push([lE[0] + (c[0] - lE[0]) * 0.3, lE[1] + (c[1] - lE[1]) * 0.3]); }
    const wmax = T.wf(0), bd = lineD([...band, ...inner.slice().reverse()]) + 'Z'; let s = `<path d="${bd}" fill="${o.shadow || mix(col, SHT, 0.55)}" opacity="0.85"/>`;
    if (wmax > 5) s += `<path d="${bd}" fill="${hatchA(Z)}" opacity="0.4"/>`;
    if (wmax > 2.5 && o.lit !== false) s += `<path d="${lineD(litE.slice(0, Math.ceil(n * 0.92)))}" fill="none" stroke="${o.litCol || mix(col, KEY, 0.4)}" stroke-width="${f1(Math.max(0.5, wmax * 0.1))}" opacity="0.5" stroke-linecap="round"/>`;
    return s;
  }
  // bark lines that follow the form: furrows (oak), fluting twist (yew), lenticels (birch), smooth (alder), cracks (dead)
  function bark(T, col, Z, kind, r) {
    const n = T.c.length, wm = T.wf(0); if (wm < 6 || n < 3 || kind === 'none') return '';
    const dk = kind === 'yew' ? mix(col, '#2a0c06', 0.6) : mix(col, INK, 0.55), lw = Math.max(0.45, Math.min(1.2, wm * 0.045)) * (kind === 'yew' ? 1.4 : 1); let d = '', d2 = '';
    const across = (i, u) => [T.L[i][0] + (T.R[i][0] - T.L[i][0]) * u, T.L[i][1] + (T.R[i][1] - T.L[i][1]) * u];
    if (kind === 'birch') {
      for (let i = 1; i < n - 1; i += 1 + Math.floor(r() * 2)) { if (r() < 0.5) continue; const u0 = 0.1 + r() * 0.5, u1 = Math.min(0.92, u0 + 0.1 + r() * 0.25), a = across(i, u0), b = across(i, u1); d += `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`; }
      let s = `<path d="${d}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, wm * 0.05))}" opacity="0.75" stroke-linecap="round"/>`;
      for (let j = 0; j < 3 + r() * 3; j++) { const i = Math.floor(r() * n * 0.9), c = T.c[i], rr = wm * (0.12 + r() * 0.15); s += `<path d="${smooth(lobed(c[0] + (r() - 0.3) * wm * 0.3, c[1], rr, rr * 0.5, r, 9, 0.5), true, 0.8)}" fill="${INK}" opacity="0.6"/>`; }
      return s;
    }
    const lines = kind === 'alder' ? 2 : kind === 'yew' ? 5 : Math.max(2, Math.min(5, Math.round(wm / 6)));
    for (let j = 0; j < lines; j++) {
      const base = (j + 0.5) / lines, tw = kind === 'yew' ? 0.35 : 0, ph = r() * 6; let run = [];
      const flush = () => { if (run.length > 2) d += lineD(run); run = []; };
      for (let i = 0; i < n; i++) { if (kind === 'yew' && T.acc[i] / T.tot > 0.45) { flush(); continue; } const u = (T.acc[i] / T.tot), uu = ((base + tw * u + 0.04 * Math.sin(u * 14 + ph)) % 1 + 1) % 1; if (kind !== 'yew' && r() < (kind === 'dead' ? 0.05 : 0.08)) { flush(); continue; } if (uu < 0.06 || uu > 0.94) { flush(); continue; } run.push(across(i, uu)); }
      flush();
    }
    if (kind === 'oak' || kind === 'dead' || kind === 'fungal' || kind === 'pollard' || kind === 'windswept' || kind === 'snag') for (let i = 2; i < n - 2; i += 2 + Math.floor(r() * 3)) { const u = 0.15 + r() * 0.7, a = across(i, u), b = across(Math.min(n - 1, i + 1), u + (r() - 0.5) * 0.25); d2 += `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`; }
    return `<path d="${d}" fill="none" stroke="${dk}" stroke-width="${f1(lw)}" opacity="${kind === 'alder' ? 0.35 : 0.6}" stroke-linecap="round"/>` + (d2 ? `<path d="${d2}" stroke="${dk}" stroke-width="${f1(lw * 0.8)}" opacity="0.45"/>` : '');
  }
  const KINDS = {
    oak: { col: '#4a4038', trunkH: 0.34, tw: 0.14, depth: 4, kids: [2, 4], ang: [0.5, 1.05], lenK: [0.55, 0.8], wK: [0.58, 0.78], bendVar: 0.09, trop: 0.012, droop: 0.0, flare: 1.0, leaves: false, leafCol: '#3a4a2a', spread: 1.15, gnarl: 1 },
    dead: { col: '#7a746c', trunkH: 0.42, tw: 0.11, depth: 3, kids: [2, 3], ang: [0.45, 1.0], lenK: [0.45, 0.75], wK: [0.55, 0.72], bendVar: 0.1, trop: 0.01, droop: 0.0, flare: 0.9, broken: 0.3, spread: 1.0, gnarl: 1.2, hollow: 0.5 },
    yew: { col: '#6a3a26', trunkH: 0.3, tw: 0.16, depth: 3, kids: [2, 3], ang: [0.35, 0.8], lenK: [0.4, 0.6], wK: [0.55, 0.75], bendVar: 0.07, trop: 0.02, droop: 0, flare: 1.2, leaves: true, leafCol: '#1e2a1c', stems: 3, spread: 1.4, gnarl: 0.8 },
    alder: { col: '#3e3c3a', trunkH: 0.85, tw: 0.075, depth: 3, kids: [3, 5], ang: [0.6, 0.95], lenK: [0.3, 0.5], wK: [0.4, 0.55], bendVar: 0.04, trop: 0.02, droop: 0.0, flare: 0.6, leaves: false, leafCol: '#34442a', excurrent: true, spread: 0.6, gnarl: 0.4 },
    birch: { col: '#d8d4c8', trunkH: 0.7, tw: 0.06, depth: 3, kids: [3, 4], ang: [0.4, 0.8], lenK: [0.4, 0.6], wK: [0.4, 0.55], bendVar: 0.05, trop: 0.012, droop: 0.03, flare: 0.5, leaves: false, leafCol: '#6a7a3a', excurrent: true, spread: 0.7, gnarl: 0.3 },
    fungal: { col: '#6a5a5c', trunkH: 0.4, tw: 0.12, depth: 3, kids: [2, 3], ang: [0.5, 1.2], lenK: [0.45, 0.75], wK: [0.55, 0.72], bendVar: 0.12, trop: -0.004, droop: 0.02, flare: 1.1, broken: 0.2, spread: 1.0, gnarl: 1.3, brackets: true, mould: true },
    frozen: { col: '#4a4a50', trunkH: 0.42, tw: 0.095, depth: 3, kids: [2, 3], ang: [0.45, 0.95], lenK: [0.45, 0.7], wK: [0.45, 0.62], bendVar: 0.07, trop: 0.012, droop: 0.008, flare: 0.8, broken: 0.15, spread: 0.9, gnarl: 0.8, rime: true },
    pollard: { col: '#4a4034', trunkH: 0.45, tw: 0.17, depth: 2, kids: [6, 9], ang: [0.3, 1.0], lenK: [0.7, 1.1], wK: [0.2, 0.3], topSlots: true, bendVar: 0.05, trop: 0.03, droop: 0.0, flare: 1.0, spread: 0.6, gnarl: 1.2, knuckle: true, hollow: 0.6 },
    windswept: { col: '#4a4440', trunkH: 0.5, tw: 0.1, depth: 3, kids: [2, 3], ang: [0.4, 0.9], lenK: [0.5, 0.75], wK: [0.45, 0.6], bendVar: 0.06, trop: 0.004, droop: 0.0, flare: 0.9, spread: 1.0, gnarl: 0.9, wind: 0.035, lean: 0.25 },
    snag: { col: '#6a645c', trunkH: 1.0, tw: 0.12, depth: 1, kids: [1, 2], ang: [0.6, 1.1], lenK: [0.12, 0.25], wK: [0.3, 0.5], bendVar: 0.06, trop: 0.01, droop: 0, flare: 1.1, broken: 1, spread: 1, gnarl: 1, snag: true, hollow: 0.7 },
  };
  // the tree. (x, y): the ground point (screen); h: total height (px); Z: depth (ink weight)
  function tree(x, y, h, Z, o = {}) {
    const kn = KINDS[o.kind] || KINDS.oak, kind = KINDS[o.kind] ? o.kind : 'oak', K2 = Object.assign({}, kn, o);
    const r = rng(o.seed || hseed(x, y, h, Z)), col = o.col || kn.col, tw = o.tw || h * kn.tw, segs = [], tips = [];
    const minW = Math.max(0.5, inkW(Z) * 0.45), stepL = Math.max(3, h / 40);
    // grow one axis: a smooth heading that wanders a little per step (curvature with memory), pulled up toward the light
    // (or down when weeping), children leaving along it at natural angles and thinning by generation
    function grow(x0, y0, a, len, w, gen, isTrunk) {
      const n = Math.max(5, Math.round(len / stepL)), pts = [[x0, y0]], ws = [];
      let px = x0, py = y0, aa = a, curv = (r() - 0.5) * K2.bendVar * (isTrunk ? 0.6 : 1);
      const wEnd = isTrunk && K2.excurrent ? Math.max(minW, w * 0.14) : Math.max(minW, w * (isTrunk ? 0.62 : gen >= K2.depth ? 0.25 : 0.45));
      for (let i = 1; i <= n; i++) {
        curv = curv * 0.85 + (r() - 0.5) * K2.bendVar * 0.5 * (K2.gnarl || 1);
        // heading as a vector: wander, then pulled toward the light (up, leaning), down by weight (droop), aside by wind
        aa += curv; const up = -Math.PI / 2 + (K2.lean || o.lean || 0), tr = K2.trop * (isTrunk ? 3 : 1), dr = gen > 0 ? K2.droop * (1 + gen * 0.4) : 0, wd = (K2.wind || 0) * (gen > 0 ? 1 : 0.3);
        let vx = Math.cos(aa) + Math.cos(up) * tr + wd, vy = Math.sin(aa) + Math.sin(up) * tr + dr; aa = Math.atan2(vy, vx);
        px += Math.cos(aa) * len / n; py += Math.sin(aa) * len / n; pts.push([px, py]);
      }
      const broken = !isTrunk && r() < (K2.broken || 0) * (gen >= 2 ? 1 : 0.5);
      let L = pts; if (broken) L = pts.slice(0, Math.max(3, Math.round(pts.length * (0.4 + r() * 0.35))));
      const wAt = u => w + (wEnd - w) * Math.pow(u, 0.85);
      segs.push({ pts: L, w0: w, w1: broken ? wAt((L.length - 1) / n) : wEnd, gen, isTrunk, broken });
      if (broken) { const e = L[L.length - 1]; tips.push([e[0], e[1], aa, true]); return { pts: L, wAt }; }
      if (gen >= K2.depth || w < minW * 2.4) { tips.push([px, py, aa, false]); return { pts: L, wAt }; }
      const nk = K2.kids[0] + Math.floor(r() * (K2.kids[1] - K2.kids[0] + 1));
      const slots = []; for (let k = 0; k < nk; k++) slots.push(isTrunk ? (K2.topSlots ? 0.9 + 0.1 * r() : K2.excurrent ? 0.18 + 0.78 * (k + r() * 0.8) / nk : 0.55 + 0.42 * (k + r() * 0.6) / nk) : 0.3 + 0.65 * (k + r() * 0.7) / nk);
      let side = r() < 0.5 ? -1 : 1;
      for (const u of slots) {
        const i = Math.min(L.length - 2, Math.max(1, Math.round(u * n))), p = L[i], q = L[Math.min(L.length - 1, i + 1)], ha = Math.atan2(q[1] - p[1], q[0] - p[0]);
        const ang = ha + side * (K2.ang[0] + r() * (K2.ang[1] - K2.ang[0])) * (K2.spread || 1) ** 0.5; side = -side * (r() < 0.85 ? 1 : -1);
        const remain = len * (1 - u), cl = (isTrunk ? h * (1 - K2.trunkH) * (0.45 + r() * 0.5) * (K2.excurrent ? (1 - u) * 1.2 + 0.2 : 1) : remain * 0.6 + len * 0.3) * (K2.lenK[0] + r() * (K2.lenK[1] - K2.lenK[0])) * (isTrunk ? 1 : 1.15);
        const cw = Math.max(minW, wAt(u) * (K2.wK[0] + r() * (K2.wK[1] - K2.wK[0])));
        grow(p[0], p[1], ang, Math.max(stepL * 3, cl), cw, gen + 1, false);
      }
      // the leader continues past the crown for non-excurrent kinds (a crown of two or three main limbs, no Y fork)
      if (isTrunk && !K2.excurrent && !K2.snag && !K2.topSlots) { const e = L[L.length - 1]; grow(e[0], e[1], aa + (r() < 0.5 ? -1 : 1) * (0.2 + r() * 0.35), h * (1 - K2.trunkH) * (0.5 + r() * 0.3), wEnd * 0.8, gen + 1, false); }
      return { pts: L, wAt };
    }
    // trunk(s)
    const stems = K2.stems || 1, trunks = [];
    for (let sI = 0; sI < stems; sI++) {
      const off = (sI - (stems - 1) / 2) * tw * 0.45, a0 = -Math.PI / 2 + (K2.lean || 0) + (sI - (stems - 1) / 2) * 0.18 + (r() - 0.5) * 0.08;
      const tH = h * (K2.snag ? 0.85 + r() * 0.15 : K2.trunkH * (0.85 + r() * 0.3)) * (stems > 1 ? 0.8 + r() * 0.3 : 1);
      trunks.push(grow(x + off, y, a0, K2.excurrent ? h * 0.92 : tH, stems > 1 ? tw * 0.6 : tw, 0, true));
    }
    return drawTree(segs, tips, { x, y, h, Z, o, K2, kind, col, tw, r, minW });
  }
  // draw grown or given axes: segs [{ pts, w0, w1, gen, isTrunk, broken }], tips [[x, y, angle, broken]]
  function drawTree(segs, tips, c) {
    const { x, y, h, Z, o, K2, kind, col, tw, r, minW } = c;
    const trunk0 = segs.find(s => s.isTrunk);
    // render: inks (underlay) for every axis, then fills, so joins merge into one smooth form; then shading and bark
    const ik = Math.max(0.9, inkW(Z) * 1.3);
    const order = segs.slice().sort((a, b) => a.w0 - b.w0);   // thin first, trunk last on top
    const tubes = order.map(sg => { const flare = sg.isTrunk ? K2.flare : 0, w0 = sg.w0, w1 = sg.w1; return { sg, T: tubeOf(sg.pts, u => (w0 + (w1 - w0) * Math.pow(u, 0.85)) * (1 + flare * 0.9 * Math.exp(-u * 14)), null, sg.isTrunk ? 4 : 3) }; });
    let roots = '';
    // root flare: roots spreading out from the foot and sinking into the ground (behind ones shorter and higher)
    if (o.roots !== false) {
      const nr = 3 + Math.floor(r() * 3) + (K2.flare > 1 ? 1 : 0);
      for (let i = 0; i < nr; i++) { const sd = i % 2 ? 1 : -1, back = i >= 4, l = tw * (0.9 + r() * 1.1) * Math.min(1.1, K2.flare) * (back ? 0.6 : 1), sx = x + sd * tw * (0.25 + r() * 0.15), sy = y - tw * (0.35 + r() * 0.35);
        const g = [[sx, sy], [x + sd * (tw * 0.5 + l * 0.35), y - tw * 0.1 - (back ? tw * 0.08 : 0)], [x + sd * (tw * 0.5 + l * 0.75), y + (back ? -tw * 0.05 : 1)], [x + sd * (tw * 0.5 + l), y + (back ? -tw * 0.02 : 2.5)]];
        const T = tubeOf(g, tw * (0.42 + r() * 0.15) * (back ? 0.7 : 1), Math.max(minW, tw * 0.06), 4);
        roots += `<path d="${T.d}" fill="${INK}" stroke="${INK}" stroke-width="${f1(ik)}" stroke-linejoin="round"/><path d="${T.d}" fill="${back ? mix(col, INK, 0.25) : col}"/>` + shadeTube(T, col, Z, { lit: !back }); }
    }
    let s = '';
    // ground contact under the roots: a dark shadow and a lip of earth over the root ends, so the tree sits in the ground
    if (o.ground !== false) s += `<path d="${smooth(lobed(x + tw * 0.4, y + 1.5, tw * 2.6, Math.max(2, tw * 0.35), r, 14, 0.3), true, 0.8)}" fill="${INK}" opacity="0.35"/>`;
    s += `<path d="${tubes.map(t => t.T.d).join('')}" fill="${INK}" stroke="${INK}" stroke-width="${f1(ik)}" stroke-linejoin="round"/>`;
    s += roots;
    // thin axes in one path each for fill and shade (they are many); thick ones one by one so each covers its children's joins
    const thin = tubes.filter(t => t.sg.w0 <= 5 && !t.sg.isTrunk), thick = tubes.filter(t => t.sg.w0 > 5 || t.sg.isTrunk);
    if (thin.length) { s += `<path d="${thin.map(t => t.T.d).join('')}" fill="${col}"/>`; s += `<g fill="${mix(col, SHT, 0.55)}" opacity="0.85">${thin.map(t => { const sh = shadeTube(t.T, col, Z, { lit: false }); const m = sh.match(/d="([^"]+)"/); return m ? `<path d="${m[1]}"/>` : ''; }).join('')}</g>`; }
    for (const { T, sg } of thick) { s += `<path d="${T.d}" fill="${col}"/>`; if (sg.isTrunk) s += `<path d="${T.d}" fill="url(#mottle)" opacity="0.35"/>`; s += shadeTube(T, col, Z); s += bark(T, col, Z, kind === 'yew' && !sg.isTrunk ? 'none' : kind, r);
      if (sg.broken && sg.w1 > 1.5) { const e = sg.pts[sg.pts.length - 1], pe = sg.pts[sg.pts.length - 2], a = Math.atan2(e[1] - pe[1], e[0] - pe[0]), ww = sg.w1 * 0.55, nx = -Math.sin(a), ny = Math.cos(a); s += `<path d="M${f1(e[0] + nx * ww)} ${f1(e[1] + ny * ww)}L${f1(e[0] + Math.cos(a) * ww * 1.2)} ${f1(e[1] + Math.sin(a) * ww * 1.2)}L${f1(e[0] + Math.cos(a) * ww * 0.3)} ${f1(e[1] + Math.sin(a) * ww * 0.3)}L${f1(e[0] + Math.cos(a) * ww * 0.9 - nx * ww * 0.3)} ${f1(e[1] + Math.sin(a) * ww * 0.9 - ny * ww * 0.3)}L${f1(e[0] - nx * ww)} ${f1(e[1] - ny * ww)}Z" fill="${mix(col, '#e8dcc0', 0.45)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, ik * 0.6))}" stroke-linejoin="round"/>`; } }
    // twigs: fine smooth flicks off the last generation (none on snags)
    if (!K2.snag) { let tw2 = ''; for (const [tx, ty, a, br] of tips) { if (br) continue; for (let j = 0; j < 2 + r() * 2; j++) { const aa = a + (r() - 0.5) * 1.3 + (K2.droop ? 0.4 : -0.1), l = h * (0.02 + r() * 0.035); const m = [tx + Math.cos(aa) * l * 0.5, ty + Math.sin(aa) * l * 0.5 + (K2.droop ? l * 0.2 : 0)]; tw2 += `M${f1(tx)} ${f1(ty)}Q${f1(m[0])} ${f1(m[1])} ${f1(tx + Math.cos(aa + (r() - 0.5) * 0.3) * l)} ${f1(ty + Math.sin(aa) * l + (K2.droop ? l * 0.5 : 0))}`; } }
      s += `<path d="${tw2}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.5, minW))}" stroke-linecap="round" opacity="0.9"/>`; }
    // ground lip: earth and grass over the root ends
    if (o.ground !== false) { const gc = o.groundCol || mix(col, '#1a1810', 0.65), pts = []; const gw = tw * 2.2 * Math.min(1.1, K2.flare); for (let j = 0; j <= 12; j++) { const u = j / 12; pts.push([x - gw + gw * 2 * u, y + 2.5 - Math.sin(u * Math.PI) * tw * 0.18 * (0.6 + r() * 0.6)]); }
      s += `<path d="${smooth([[x - gw - 3, y + 4], ...pts, [x + gw + 3, y + 4]], true, 0.6)}" fill="${gc}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.6))}" stroke-linejoin="round"/>`;
      let gr = ''; for (let j = 0; j < 8 + r() * 8; j++) { const gx = x - gw + r() * gw * 2, gy = y + 2.5, l = tw * (0.12 + r() * 0.25); gr += `M${f1(gx)} ${f1(gy)}q${f1((r() - 0.5) * l)} ${f1(-l * 0.6)} ${f1((r() - 0.5) * l * 0.8)} ${f1(-l)}`; } s += `<path d="${gr}" stroke="${mix(gc, KEY, 0.25)}" stroke-width="${f1(Math.max(0.45, minW * 0.8))}" fill="none" opacity="0.7"/>`; }
    // kind extras
    const tT = tubes.find(t => t.sg.isTrunk).T;
    if (r() < (K2.hollow || 0) && tw > 8) { const i = Math.floor(tT.c.length * (0.12 + r() * 0.2)), c = tT.c[i], hl = lobed(c[0] + tw * 0.05, c[1], tw * 0.2, tw * 0.45, r, 11, 0.3); s += `<path d="${smooth(hl, true, 0.8)}" fill="#07060a" stroke="${INK}" stroke-width="${f1(ik)}"/><path d="${smooth(hl.slice(7, 12).map(([a, b]) => [a + 1, b + 1]), false, 0.6)}" stroke="${mix(col, KEY, 0.45)}" stroke-width="${f1(Math.max(0.6, tw * 0.05))}" fill="none" opacity="0.6"/>`; }
    if (K2.knuckle) { const e = trunk0.pts[trunk0.pts.length - 1]; s += `<path d="${smooth(lobed(e[0], e[1], tw * 0.75, tw * 0.5, r, 12, 0.3), true, 0.8)}" fill="${col}" stroke="${INK}" stroke-width="${f1(ik)}"/><path d="${smooth(lobed(e[0] + tw * 0.15, e[1] + tw * 0.15, tw * 0.5, tw * 0.3, r, 10, 0.3), true, 0.8)}" fill="${hatchA(Z)}" opacity="0.5"/>`; }
    if (K2.snag) { const e = trunk0.pts[trunk0.pts.length - 1], w = trunk0.w1 * 0.55; let jag = `M${f1(e[0] - w)} ${f1(e[1] + w * 0.5)}`; for (let j = 1; j <= 6; j++) jag += `L${f1(e[0] - w + 2 * w * j / 6)} ${f1(e[1] + (j % 2 ? -w * (0.6 + r() * 1.4) : w * 0.2 * r()))}`; jag += `L${f1(e[0] + w)} ${f1(e[1] + w * 0.5)}Z`; s += `<path d="${jag}" fill="${mix(col, '#e8dcc0', 0.35)}" stroke="${INK}" stroke-width="${f1(ik * 0.8)}" stroke-linejoin="round"/>`; }
    if (K2.brackets) for (let j = 0; j < 3 + r() * 3; j++) { const i = Math.floor(tT.c.length * (0.15 + r() * 0.7)), side = r() < 0.5 ? tT.L[i] : tT.R[i], ww = tw * (0.35 + r() * 0.3), hh = ww * 0.35, bc = o.bracketCol || '#b8a878'; s += `<path d="M${f1(side[0] - ww)} ${f1(side[1])}Q${f1(side[0])} ${f1(side[1] - hh * 2)} ${f1(side[0] + ww)} ${f1(side[1])}Q${f1(side[0])} ${f1(side[1] + hh * 0.7)} ${f1(side[0] - ww)} ${f1(side[1])}Z" fill="${bc}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, ik * 0.7))}"/><path d="M${f1(side[0] - ww * 0.7)} ${f1(side[1] - hh * 0.35)}Q${f1(side[0])} ${f1(side[1] - hh * 1.4)} ${f1(side[0] + ww * 0.7)} ${f1(side[1] - hh * 0.35)}" stroke="${mix(bc, INK, 0.4)}" stroke-width="0.6" fill="none"/>`; }
    if (K2.mould) for (let j = 0; j < 6; j++) { const t = tubes[Math.floor(r() * tubes.length)].T, i = Math.floor(r() * t.c.length), c = t.c[i], rr = Math.max(1.2, t.wf(0) * (0.2 + r() * 0.3)); s += `<path d="${smooth(lobed(c[0], c[1], rr, rr * 0.7, r, 11, 0.5), true, 0.8)}" fill="${o.mouldCol || '#c8d0b0'}" opacity="0.45"/>`; }
    if (K2.rime) for (const { T, sg } of tubes) { if (sg.w0 < 1.6) continue; const up = []; const runs = []; for (let i = 0; i < T.c.length; i++) { const l = T.L[i], rr = T.R[i], c = T.c[i]; const e = (l[1] - c[1]) < (rr[1] - c[1]) ? l : rr; if ((c[1] - e[1]) / (Math.hypot(e[0] - c[0], e[1] - c[1]) || 1) > 0.7) up.push(e); else if (up.length) runs.push(up.splice(0)); } if (up.length) runs.push(up); for (const u of runs) if (u.length > 2) s += `<path d="${smooth(u.map(([a, b]) => [a, b + 0.3]), false, 0.5)}" stroke="${o.rimeCol || '#eef4f6'}" stroke-width="${f1(Math.max(0.7, Math.min(4, sg.w0 * 0.16)))}" fill="none" opacity="0.8" stroke-linecap="round"/>`;
      if (sg.w0 > 4 && !sg.isTrunk) for (let j = 0; j < 3; j++) { const i = Math.floor(T.c.length * (0.2 + r() * 0.6)), lo = T.L[i][1] > T.R[i][1] ? T.L[i] : T.R[i], l = sg.w0 * (0.6 + r() * 1.8); s += `<path d="M${f1(lo[0] - 1)} ${f1(lo[1])}L${f1(lo[0] + 0.2)} ${f1(lo[1] + l)}L${f1(lo[0] + 1.1)} ${f1(lo[1])}Z" fill="#dfe8ec" stroke="${INK}" stroke-width="0.5"/>`; } }
    // foliage (yew, and alive kinds on request): clustered lobed masses at the tips, lit upper left, dark beneath
    // yew: dense dark evergreen masses that merge into one ragged crown, hiding most of the trunk (only its foot shows)
    if (kind === 'yew' && (o.leaves ?? true)) {
      const R0 = h * 0.085, cell = R0 * 1.4, anchors = [];
      for (const [tx, ty] of tips) anchors.push([tx, ty]);
      for (const sg of segs) { if (sg.isTrunk) { const n2 = sg.pts.length; sg.pts.forEach((p, i) => { if (i / (n2 - 1) > 0.35) anchors.push(p); }); } else sg.pts.forEach((p, i) => { if (i % 3 === 1) anchors.push(p); }); }
      const cells = new Map(); for (const [ax, ay] of anchors) { const key = Math.floor(ax / cell) + ',' + Math.floor(ay / cell); const c = cells.get(key) || [0, 0, 0]; c[0] += ax; c[1] += ay; c[2]++; cells.set(key, c); }
      const yMax = y - h * 0.2, cxT = anchors.reduce((a, p) => a + p[0], 0) / anchors.length, cyT = anchors.reduce((a, p) => a + p[1], 0) / anchors.length;
      const masses = [...cells.values()].map(([sx, sy, n]) => { const rr = R0 * (0.85 + r() * 0.45) * Math.pow(n, 0.15); return [sx / n, Math.min(sy / n, yMax - rr * 0.78), rr]; }).sort((a, b) => a[1] - b[1]);
      const rag = (mx, my, rr, ry) => { const pts = lobed(mx, my, rr, ry, r, 24, 0.45); return pts.map(([px, py], i) => { const f = i % 2 ? 1.12 : 0.93; return [mx + (px - mx) * f, my + (py - my) * f]; }); };
      let inkM = '', base = '', belly = '', lit = '', needles = '';
      for (const [mx, my, rr] of masses) { const out = rag(mx, my, rr, rr * 0.78); inkM += `<path d="${smooth(out, true, 0.35)}"/>`; base += `<path d="${smooth(out, true, 0.35)}"/>`;
        belly += `<path d="${smooth(rag(mx + rr * 0.12, my + rr * 0.18, rr * 0.62, rr * 0.42), true, 0.35)}"/>`;
        const litN = (mx - cxT) * 0.6 + (my - cyT) * 0.8 < 0 ? (r() < 0.7 ? 1 : 2) : (r() < 0.3 ? 1 : 0);
        for (let j = 0; j < litN; j++) { const lx = mx - rr * (0.2 + r() * 0.35), ly = my - rr * (0.25 + r() * 0.3), lr = rr * (0.2 + r() * 0.25); lit += `<path d="${smooth(rag(lx, ly, lr, lr * 0.65), true, 0.35)}"/>`;
          for (let q = 0; q < 5; q++) { const nx = lx + (r() - 0.5) * lr * 1.6, ny = ly + (r() - 0.5) * lr, a = -0.6 + (r() - 0.5) * 0.8, l = Math.max(2, rr * 0.12); needles += `M${f1(nx)} ${f1(ny)}l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}`; } } }
      const lc = o.leafCol || '#16201a';
      s += `<g fill="${INK}" stroke="${INK}" stroke-width="${f1(ik * 2.2)}" stroke-linejoin="round">${inkM}</g><g fill="${lc}">${base}</g><g fill="#0a100c" opacity="0.7">${belly}</g><g fill="${hatchA(Z)}" opacity="0.35">${belly}</g><g fill="${mix(lc, '#5a7048', 0.4)}" opacity="0.6">${lit}</g><path d="${needles}" stroke="${mix(lc, '#9aae78', 0.45)}" stroke-width="${f1(Math.max(0.6, minW))}" opacity="0.6" stroke-linecap="round"/>`;
    } else if (o.leaves ?? K2.leaves) { const lc = o.leafCol || K2.leafCol, R0 = h * (kind === 'yew' ? 0.055 : 0.045); let base = '', inkL = '', litL = '', dkL = '';
      const pick = tips.filter(() => r() < 0.45);
      for (const [tx, ty] of pick) { const rr = R0 * (0.6 + r() * 0.7), b = smooth(lobed(tx, ty - rr * 0.2, rr * 1.2, rr * 0.8, r, 14, 0.45), true, 0.8); inkL += `<path d="${b}"/>`; base += `<path d="${b}"/>`; dkL += `<path d="${smooth(lobed(tx + rr * 0.25, ty + rr * 0.15, rr * 0.9, rr * 0.5, r, 12, 0.4), true, 0.8)}"/>`; litL += `<path d="${smooth(lobed(tx - rr * 0.35, ty - rr * 0.45, rr * 0.6, rr * 0.4, r, 11, 0.5), true, 0.8)}"/>`; }
      s += `<g stroke="${INK}" stroke-width="${f1(ik * 1.6)}" fill="${INK}">${inkL}</g><g fill="${lc}">${base}</g><g fill="${mix(lc, SHT, 0.5)}">${dkL}</g><g fill="${hatchA(Z)}" opacity="0.45">${dkL}</g><g fill="${mix(lc, KEY, 0.22)}" opacity="0.55">${litL}</g>`; }
    const tc = trunk0.pts, tT2 = tubeOf(tc, trunk0.w0, trunk0.w1);
    return { svg: s, limbs: segs.map(sg => [sg.pts, sg.w0]), trunk: tc, tw, wAt: i => tT2.wf(Math.min(1, i / Math.max(1, tc.length - 1))), tips, segs };
  }
  // render a skeleton made elsewhere (a kit's own tree, so a room's composition, decorations and random stream stay as they
  // were) through the organic renderer: every polyline Catmull-Rom smoothed, tapered tubes, shading, bark, root flare, ground.
  // skel: { trunk: [[x,y]...] base first, trunkW: [w0, w1] px, limbs: [[pts, w0, w1?]...] }; o: tree options (kind, col, ...)
  function renderTree(skel, Z, o = {}) {
    const kn = KINDS[o.kind] || KINDS.dead, kind = KINDS[o.kind] ? o.kind : 'dead', K2 = Object.assign({}, kn, o), col = o.col || kn.col;
    const tr = skel.trunk, x = tr[0][0], y = tr[0][1], h = Math.max(10, (y - Math.min(...tr.map(p => p[1]))) / 0.6), r = rng(o.seed || hseed(x, y, h, Z));
    const minW = Math.max(0.5, inkW(Z) * 0.45), tw = skel.trunkW[0];
    const segs = [{ pts: tr, w0: skel.trunkW[0], w1: skel.trunkW[1], gen: 0, isTrunk: true }], tips = [];
    for (const [pts, w0, w1] of skel.limbs) { if (pts.length < 2) continue; const wa = Math.max(minW, w0), wb = Math.max(minW * 0.8, w1 ?? wa * 0.4); segs.push({ pts, w0: wa, w1: wb, gen: 1, isTrunk: false, broken: false }); const e = pts[pts.length - 1], pe = pts[pts.length - 2]; if (wb < 3) tips.push([e[0], e[1], Math.atan2(e[1] - pe[1], e[0] - pe[0]), false]); }
    return drawTree(segs, tips, { x, y, h, Z, o, K2, kind, col, tw, r, minW });
  }
  // a tapering organic strand along guide points: roots, vines, kelp stipes, hanging moss
  function strand(pts, w0, w1, Z, o = {}) {
    const col = o.col || '#4a3c2c', T = tubeOf(pts, w0, w1, o.per || 5), ik = o.ink ?? Math.max(0.6, inkW(Z) * 0.9);
    return `<path d="${T.d}" fill="${col}" stroke="${INK}" stroke-width="${f1(ik)}" stroke-linejoin="round"/>` + (o.shade !== false && w0 > 2 ? shadeTube(T, col, Z, { band: 0.7 }) : '') + (o.bark && w0 > 4.5 ? bark(T, col, Z, o.bark, rng(hseed(pts[0][0], pts[0][1], 5))) : '');
  }
  // roots hanging from screen y between x0 and x1: smooth sway, rootlets branching and thinning
  function hangRoots(x0, x1, y, Z, o = {}) {
    const r = rng(o.seed || hseed(x0, x1, y, Z)), col = o.col || '#4a3c2c'; let s = '';
    const root = (x, yy, L, w, a, d) => { const g = [[x, yy]]; let cx = x, cy = yy, aa = a, cv = 0; for (let k = 0; k < 6; k++) { cv = cv * 0.7 + (r() - 0.5) * 0.25; aa += cv + (Math.PI / 2 - aa) * 0.15; cx += Math.cos(aa) * L / 6; cy += Math.sin(aa) * L / 6; g.push([cx, cy]); }
      s += strand(g, w, Math.max(0.4, w * 0.15), Z, { col: mix(col, INK, r() * 0.25) });
      if (d > 0) for (let k = 0; k < 1 + r() * 2; k++) { const i = 2 + Math.floor(r() * 3); root(g[i][0], g[i][1], L * (0.3 + r() * 0.3), w * 0.45, aa + (r() < 0.5 ? -1 : 1) * (0.4 + r() * 0.5), d - 1); } };
    for (let i = 0; i < (o.n || 10); i++) root(x0 + r() * (x1 - x0), y - 1, (o.len || 60) * (0.35 + r() * 0.9), (o.w || 4) * (0.5 + r() * 0.8), Math.PI / 2 + (r() - 0.5) * 0.5, o.depth ?? 2);
    return s;
  }
  // roots over the ground from a foot at (x, y), spreading w px to each side, sinking at their ends
  function surfaceRoots(x, y, w, Z, o = {}) {
    const r = rng(o.seed || hseed(x, y, w, Z)), col = o.col || '#4a3c2c'; let s = '';
    for (let i = 0; i < (o.n || 5); i++) { const sd = i % 2 ? 1 : -1, l = w * (0.5 + r() * 0.6), g = [[x + sd * 2, y - (o.w || 6) * 0.4], [x + sd * l * 0.3, y - (o.w || 6) * 0.15 + (r() - 0.5) * 2], [x + sd * l * 0.7, y + (r() - 0.5) * 3], [x + sd * l, y + 2]]; s += strand(g, (o.w || 6) * (0.5 + r() * 0.5), 0.6, Z, { col }); }
    return s;
  }
  // a vine between A and B (screen): a sagging smooth stem, leaves along it on short stalks, a tendril or two
  function vine(A, B, Z, o = {}) {
    const r = rng(o.seed || hseed(...A, ...B)), col = o.col || '#3a4224', lc = o.leafCol || '#4a5a2a', sag = o.sag ?? Math.hypot(B[0] - A[0], B[1] - A[1]) * 0.18, g = [];
    for (let i = 0; i <= 8; i++) { const u = i / 8; g.push([A[0] + (B[0] - A[0]) * u + Math.sin(u * 9 + r() * 2) * 1.5, A[1] + (B[1] - A[1]) * u + Math.sin(u * Math.PI) * sag + (r() - 0.5) * 2]); }
    let s = strand(g, o.w || 2, (o.w || 2) * 0.6, Z, { col, shade: false });
    const c = crSample(g, 4), lr = o.leaf || Math.max(4, (o.w || 2) * 2.6);
    for (let i = 2; i < c.length - 1; i += 2 + Math.floor(r() * 2)) { const p = c[i], a = (r() < 0.5 ? -1 : 1) * (0.8 + r() * 0.8) + Math.PI / 2, tip = [p[0] + Math.cos(a) * lr * 2, p[1] + Math.sin(a) * lr * 2]; const lf = [p, [(p[0] + tip[0]) / 2 + Math.sin(a) * lr * 0.7, (p[1] + tip[1]) / 2 - Math.cos(a) * lr * 0.7], tip, [(p[0] + tip[0]) / 2 - Math.sin(a) * lr * 0.7, (p[1] + tip[1]) / 2 + Math.cos(a) * lr * 0.7]];
      s += `<path d="${smooth(lf, true, 0.8)}" fill="${mix(lc, r() < 0.5 ? KEY : SHT, 0.2 * r())}" stroke="${INK}" stroke-width="${f1(Math.max(0.45, inkW(Z) * 0.5))}"/>`; }
    for (let j = 0; j < (o.tendrils ?? 2); j++) { const p = c[Math.floor(c.length * (0.2 + r() * 0.6))], tp = []; for (let k = 0; k < 10; k++) { const a = k * 0.8, rr = lr * (1.6 - k * 0.12); tp.push([p[0] + Math.cos(a) * rr, p[1] + lr + Math.sin(a) * rr + k * 0.6]); } s += `<path d="${smooth(tp, false, 0.6)}" stroke="${col}" stroke-width="0.7" fill="none"/>`; }
    return s;
  }
  // a kelp plant rooted at (x, y): a swaying stipe, ruffled blades streaming, gas bladders at the blade bases
  function kelp(x, y, h, Z, o = {}) {
    const r = rng(o.seed || hseed(x, y, h, Z)), col = o.col || '#4a5a2a', dk = mix(col, INK, 0.4), sway = o.sway ?? 0.18, g = [];
    for (let i = 0; i <= 8; i++) { const u = i / 8; g.push([x + Math.sin(u * 3 + r()) * h * sway * u, y - h * u]); }
    let s = strand(g, o.w || 3, (o.w || 3) * 0.5, Z, { col: dk, shade: false });
    // holdfast
    s += `<path d="${smooth(lobed(x, y, (o.w || 3) * 2, (o.w || 3) * 0.7, r, 10, 0.6), true, 0.8)}" fill="${dk}" stroke="${INK}" stroke-width="0.7"/>`;
    const c = crSample(g, 4);
    for (let i = Math.floor(c.length * 0.25); i < c.length; i += 3 + Math.floor(r() * 3)) { const p = c[i], sd = r() < 0.5 ? -1 : 1, L = h * (0.18 + r() * 0.22), bw = Math.max(1.5, (o.w || 3) * (1.2 + r())), bl = []; const br = []; for (let k = 0; k <= 8; k++) { const u = k / 8, cxp = p[0] + sd * L * u * 0.8 + Math.sin(u * 4 + i) * L * 0.08, cyp = p[1] - L * u * 0.55 + u * u * L * 0.2, ww = bw * Math.sin(Math.PI * Math.min(0.95, u + 0.05)) * (0.7 + 0.3 * Math.sin(k * 2.1)); bl.push([cxp, cyp - ww]); br.push([cxp, cyp + ww]); }
      s += `<path d="${smooth([...bl, ...br.reverse()], true, 0.6)}" fill="${mix(col, r() < 0.5 ? KEY : SHT, 0.15)}" stroke="${INK}" stroke-width="${f1(Math.max(0.45, inkW(Z) * 0.55))}"/><path d="${smooth(bl.map(([a, b], k) => [a, (b + br[br.length - 1 - k][1]) / 2]), false, 0.5)}" stroke="${dk}" stroke-width="0.6" fill="none" opacity="0.7"/>`;
      s += `<ellipse cx="${f1(p[0] + sd * 1.5)}" cy="${f1(p[1])}" rx="${f1(bw * 0.55)}" ry="${f1(bw * 0.7)}" fill="${mix(col, '#c8b860', 0.35)}" stroke="${INK}" stroke-width="0.6"/>`; }
    return s;
  }

  const api = { deferred, begin, stoneMarks, weatherWall, weatherFloor, hewnRock, rockSkin, tree, renderTree, strand, vine, hangRoots, surfaceRoots, kelp, tubeOf, crSample,
    KINDS, WORLDS, world: n => resolve(n), setWorld: n => { WORLD = n; }, getWorld: () => WORLD };
  CACHE.set(S, api);
  return api;
};
module.exports.WORLDS = WORLDS;
module.exports.crSample = crSample;
