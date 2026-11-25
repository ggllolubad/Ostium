// Living Ink scene kit. The grim scene kit's camera, tagging and output formats, drawn in the locked Living Ink style.
//
// Kept from grim/scenekit.js (so the game's lighting passes, hover outlines and room loader work unchanged):
//   one-point camera P(X,Y,Z), px per metre K(Z), plane tags (class pl_<i>), prop depth tags (class z_<Z*100>),
//   emissive tags (class em), painted-glow tags (class glow), addLight, hot, outline, through (containment clip).
// New (the Living Ink look, matched to the figures):
//   - ink weight and hatch spacing follow the figures' own scale at each depth: a 1.0 human is 640 figure px and
//     1.75 m, so at depth Z one figure px is sc(Z) = K(Z) / 365.7 screen px. Ink 1.6 and heavy 3.6, hatch 6.5 apart,
//     exactly as kit.base, times sc(Z) (with floors so far walls stay drawn).
//   - one key light from the upper left at 45 degrees behind the viewer's left shoulder: the same vector the game's
//     lighting uses (grim/light/look.json key_dir). Planes facing it are lit, planes facing away take crosshatch.
//   - every flat polygon is a "cel": base colour, its own shadow band on the edges that face away from the light
//     (shadow tint + hatch), a worn-bright lit edge, thin ink all round and heavy ink on the shadow edges.
//   - big shadow areas are hatched with lines laid in the plane itself (projected), so the hatch follows the form.
//   - props are drawn with the figure engine itself (engine.js Fig) at figure scale and placed with scale sc(Z), so a
//     jug or a blanket is shaded exactly like a figure standing at the same depth.
'use strict';
const E = require('../engine');
const KIT = require('../kit');
const { mix, rng, smooth, Fig } = E;
const INK = KIT.INK;
const MV2 = require('./materials_v2');
const f1 = n => Math.round(n * 10) / 10;
const norm3 = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const add3 = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
const mul3 = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
const cross3 = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const dot3 = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
// the key light, toward the light (world: x right, y up, z away from the viewer). Same vector as look.json key_dir.
const LW = norm3([-0.55, 0.62, -0.56]);
const SL = [0.6, 0.8]; // screen direction AWAY from the key light (shadow side), as Fig's light [-0.6,-0.8]

function hull(pts) {
  const p = pts.map(q => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

module.exports = function Scene(cfg) {
  const { W, H, HZ, E: EYE, FL, CX, seed = 7 } = cfg;
  const UM = cfg.UM || 640 / 1.75;                 // figure px per metre
  const KEY = cfg.keyTint || '#fff3d8', SHT = cfg.shadowTint || '#2a1f2a';
  const R = rng(seed);
  const P = (X, Y, Z) => [CX + FL * X / Z, HZ + FL * (EYE - Y) / Z];
  const K = Z => FL / Z;
  const sc = Z => K(Z) / UM;
  const p2 = (pts, close = true) => 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L') + (close ? ' Z' : '');
  const pp = pts => p2(pts.map(p => P(...p)));
  const inkW = Z => Math.max(cfg.minInk || 0.85, 1.6 * sc(Z));
  const inkH = Z => Math.max(cfg.minHeavy || 1.5, 3.6 * sc(Z));
  const GAPS = cfg.gaps || [2.6, 3.2, 4, 5, 6.5, 8], MINGAP = GAPS[0];
  const gapFor = Z => { const g = Math.max(MINGAP, 6.5 * sc(Z)); return GAPS.reduce((a, b) => Math.abs(b - g) < Math.abs(a - g) ? b : a); };
  const hatchA = Z => `url(#hA${Math.round(gapFor(Z) * 10)})`, hatchB = Z => `url(#hB${Math.round(gapFor(Z) * 10)})`;
  let nid = 0;
  const id = p => `S${p}${seed}_${nid++}`;

  // ---------------------------------------------------------------- layers
  const LAY = {}, DEFS = [], SLOTS = {}, DEFER = [];
  let cur = null;
  const layer = n => { cur = n; LAY[n] = LAY[n] || []; };
  const raw = s => { LAY[cur].push(s); };
  const common = () => {
    let d = '';
    for (const g of GAPS) {
      const w = Math.max(cfg.minHatchW || 0.7, 1.5 * g / 6.5), w2 = Math.max(cfg.minHatchW || 0.65, 1.4 * g / 6.5);
      d += `<pattern id="hA${Math.round(g * 10)}" patternUnits="userSpaceOnUse" width="${g}" height="${g + 0.5}" patternTransform="rotate(-38)"><line x1="0.5" y1="0" x2="0.5" y2="${g + 0.5}" stroke="${INK}" stroke-width="${f1(w)}"/></pattern>`;
      d += `<pattern id="hB${Math.round(g * 10)}" patternUnits="userSpaceOnUse" width="${g}" height="${g + 0.5}" patternTransform="rotate(42)"><line x1="0.5" y1="0" x2="0.5" y2="${g + 0.5}" stroke="${INK}" stroke-width="${f1(w2)}"/></pattern>`;
    }
    const wb = cfg.wob || { f: 0.08, s: 1.1 }, gf = cfg.gritF || 1.0;
    d += `<filter id="wob" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="turbulence" baseFrequency="${wb.f}" numOctaves="2" seed="${seed % 97 + 3}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="${wb.s}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    d += `<filter id="grit" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="fractalNoise" baseFrequency="${gf}" numOctaves="3" seed="${seed % 89 + 1}" result="n"/><feColorMatrix in="n" values="0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 -0.75 0.42" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gi"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge></filter>`;
    d += `<filter id="mottlef" filterUnits="userSpaceOnUse" x="0" y="0" width="420" height="420"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="${seed % 53 + 9}"/><feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 -1.7 1.0"/></filter><pattern id="mottle" patternUnits="userSpaceOnUse" width="420" height="420"><rect width="420" height="420" filter="url(#mottlef)"/></pattern>`;
    d += `<filter id="speckf" filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="300"><feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="2" seed="${seed % 41 + 5}"/><feColorMatrix values="0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 -3.2 1.55"/></filter><pattern id="speck" patternUnits="userSpaceOnUse" width="300" height="300"><rect width="300" height="300" filter="url(#speckf)"/></pattern>`;
    d += `<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>`;
    return d;
  };
  // a layer as a standalone SVG. o.plain: no wobble/grit (the fx layer); o.scale: output size multiplier
  const svgLayer = (n, o = {}) => {
    const body = (LAY[n] || []).map(e => typeof e === 'string' ? e : (SLOTS[e.slot] || '')).join('\n').replace(/<!--mv2:(\w+)-->/g, (m, k) => mv2().deferred(k)), s = o.scale || 1;   // materials v2: soot over lights, filled once every light is known
    const inner = o.plain ? body : `<g filter="url(#wob)"><g filter="url(#grit)">${body}</g></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * s}" height="${H * s}" viewBox="0 0 ${W} ${H}"><defs>${common()}${DEFS.join('\n')}</defs>${inner}</svg>`;
  };

  // ---------------------------------------------------------------- tags (ported from grim/scenekit.js, same rules)
  const PLANES = [], PLK = {}, LIGHTS = [], HOT = {};
  function planeId(p0, p1, p2_) {
    let n = cross3(sub3(p1, p0), sub3(p2_, p0)); const l = Math.hypot(...n); if (l < 1e-9) return -1; n = n.map(v => v / l);
    if (dot3(n, sub3([0, EYE, 0], p0)) < 0) n = n.map(v => -v);
    const d = dot3(n, p0), key = n.map(v => v.toFixed(3)).join(',') + '|' + d.toFixed(2);
    if (PLK[key] === undefined) { PLK[key] = PLANES.length; PLANES.push({ n: n.map(v => +v.toFixed(4)), d: +d.toFixed(4) }); }
    return PLK[key];
  }
  const normalOf = (p0, p1, p2_) => { let n = norm3(cross3(sub3(p1, p0), sub3(p2_, p0))); if (dot3(n, sub3([0, EYE, 0], p0)) < 0) n = n.map(v => -v); return n; };
  const PLW = (pts3, str) => { const i = planeId(...pts3); return i < 0 ? str : `<g class="pl_${i}">${str}</g>`; };
  const EM = str => `<g class="em">${str}</g>`;
  const GLOW = str => `<g class="glow">${str}</g>`;
  const addLight = (X, Y, Z, I, range, col = [1.0, 0.6, 0.28]) => LIGHTS.push({ pos: [+X.toFixed(2), +Y.toFixed(2), +Z.toFixed(2)], I: +I.toFixed(2), range: +range.toFixed(2), col });
  const hot = (k, label, pts) => { HOT[k] = { label, poly: pts.map(p => [f1(p[0]), f1(p[1])]) }; };
  const outline = (k, polys) => { HOT[k].outline = polys.map(([pts, closed]) => ({ closed: !!closed, pts: pts.map(p => p.map(v => +v.toFixed(3))) })); };
  const through = (pts3, fn) => { const c = id('th'); raw(`<clipPath id="${c}"><path d="${pp(pts3)}"/></clipPath><g clip-path="url(#${c})">`); fn(); raw('</g>'); };
  const clip2 = (pts2, fn) => { const c = id('cl'); raw(`<clipPath id="${c}"><path d="${p2(pts2)}"/></clipPath><g clip-path="url(#${c})">`); fn(); raw('</g>'); };
  const prop = (Z, fn) => { raw(`<g class="z_${Math.round(Z * 100)}">`); fn(); raw('</g>'); };
  const lam = n => dot3(n, LW);

  // ---------------------------------------------------------------- the cel: one flat polygon in Living Ink
  // ps: screen points (convex-ish). o: { Z, fill, band (px), shadow, hatch, hi, tex, texOp, inkW, heavy, ink }
  function cel(ps, o = {}) {
    const Z = o.Z || 5, base = o.fill || '#777', n = ps.length;
    const c = ps.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0]);
    const one = o.collect && o.ink !== false;   // walls of stones: fill and thin outline in one element (the heavy edge still goes on top)
    let s = one ? `<path d="${p2(ps)}" fill="${base}" stroke="${INK}" stroke-width="${f1(o.inkW ?? inkW(Z) * 0.75)}" stroke-linejoin="round"/>` : `<path d="${p2(ps)}" fill="${base}"/>`;
    // o.collect: { tex, h: {} } gathers the texture and hatch paths so a wall of stones writes each once (materials v2)
    if (o.tex) { if (o.collect) o.collect.tex += p2(ps); else s += `<path d="${p2(ps)}" fill="${o.tex}" opacity="${o.texOp ?? 0.45}"/>`; }
    const bw = o.band ?? Math.max(cfg.minBand ?? 1.5, 0.035 * K(Z)), shC = o.shadow || mix(base, SHT, 0.6), hiC = mix(base, KEY, 0.35);
    let bands = '', heavy = '', hi = '';
    for (let i = 0; i < n; i++) {
      const a = ps[i], b = ps[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
      if (L < 0.8) continue;
      let nx = -dy / L, ny = dx / L; const mx = (a[0] + b[0]) / 2 - c[0], my = (a[1] + b[1]) / 2 - c[1];
      if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
      const sh = nx * SL[0] + ny * SL[1];
      if (sh > 0.2 && bw > 0) {
        const k = bw * Math.min(1, (sh - 0.1) * 1.4);
        bands += `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} L${f1(b[0] - nx * k)} ${f1(b[1] - ny * k)} L${f1(a[0] - nx * k)} ${f1(a[1] - ny * k)} Z `;
        heavy += `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} `;
      } else if (sh < -0.35 && o.hi !== false) {
        const k = Math.max(0.8, bw * 0.35);
        hi += `M${f1(a[0] - nx * k)} ${f1(a[1] - ny * k)} L${f1(b[0] - nx * k)} ${f1(b[1] - ny * k)} `;
      }
    }
    if (bands) { s += `<path d="${bands}" fill="${shC}"/>`; if (o.hatch !== false) { if (o.collect) { const hk = hatchA(Z); o.collect.h[hk] = (o.collect.h[hk] || '') + bands; } else s += `<path d="${bands}" fill="${hatchA(Z)}" opacity="0.5"/>`; } }
    if (hi) s += `<path d="${hi}" stroke="${hiC}" stroke-width="${f1(Math.max(0.7, inkW(Z) * 0.8))}" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    if (o.ink !== false) {
      if (!one) s += `<path d="${p2(ps)}" fill="none" stroke="${INK}" stroke-width="${f1(o.inkW ?? inkW(Z) * 0.75)}" stroke-linejoin="round"/>`;
      if (heavy) { const hw = f1(o.heavy ?? inkH(Z) * 0.6); if (o.collect) { o.collect.hv = o.collect.hv || {}; o.collect.hv[hw] = (o.collect.hv[hw] || '') + heavy; } else s += `<path d="${heavy}" fill="none" stroke="${INK}" stroke-width="${hw}" stroke-linecap="round"/>`; }
    }
    return s;
  }
  // knock the corners off a polygon (chipped stone, worn board ends)
  function chip(ps, amt = 0.42) {
    const n = ps.length, out = [];
    for (let i = 0; i < n; i++) {
      const p = ps[i], a0 = ps[(i + n - 1) % n], b0 = ps[(i + 1) % n];
      if (R() < amt) { const u = 0.06 + R() * 0.16, v = 0.06 + R() * 0.16; out.push([p[0] + (a0[0] - p[0]) * u, p[1] + (a0[1] - p[1]) * u], [p[0] + (b0[0] - p[0]) * v, p[1] + (b0[1] - p[1]) * v]); }
      else out.push(p);
      if (R() < 0.3) { const q = ps[(i + 1) % n], m = 0.35 + R() * 0.3; out.push([p[0] + (q[0] - p[0]) * m + (R() - 0.5) * 1.4, p[1] + (q[1] - p[1]) * m + (R() - 0.5) * 1.4]); }
    }
    return out;
  }

  // ---------------------------------------------------------------- hatching laid in a plane (follows the form)
  // at(s,t) -> [X,Y,Z]; region s0..s1 x t0..t1; ang: line angle in the plane (radians, from +s); gapPx: screen spacing.
  function hatch3(at, s0, s1, t0, t1, ang, o = {}) {
    const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca;
    const cs = (s0 + s1) / 2, ct = (t0 + t1) / 2, rad = Math.hypot(s1 - s0, t1 - t0) / 2;
    const buckets = {};
    let u = -rad;
    while (u < rad) {
      const px = cs + nx * u, py = ct + ny * u;
      // Liang-Barsky clip of the line px,py + (ca,sa)*l to the rect
      let l0 = -1e9, l1 = 1e9, ok = true;
      for (const [p, d, lo, hi] of [[px, ca, s0, s1], [py, sa, t0, t1]]) {
        if (Math.abs(d) < 1e-9) { if (p < lo || p > hi) ok = false; continue; }
        let a = (lo - p) / d, b = (hi - p) / d; if (a > b) [a, b] = [b, a]; l0 = Math.max(l0, a); l1 = Math.min(l1, b);
      }
      const mid = at(px + ca * (l0 + l1) / 2, py + sa * (l0 + l1) / 2), Zm = Math.max(0.5, mid[2]);
      const gap = (o.gap || 1) * Math.max(MINGAP, 6.5 * sc(Zm)) * (o.dense ? 0.75 : 1);
      if (ok && l1 > l0) {
        const len = l1 - l0, j0 = o.ragged ? R() * len * o.ragged : 0, j1 = o.ragged ? R() * len * o.ragged : 0;
        if (!o.keep || o.keep(px + ca * (l0 + l1) / 2, py + sa * (l0 + l1) / 2)) {
          const A = P(...at(px + ca * (l0 + j0), py + sa * (l0 + j0))), B = P(...at(px + ca * (l1 - j1), py + sa * (l1 - j1)));
          const bk = Math.max(cfg.minHatchW || 0.6, Math.round(Math.max(cfg.minHatchW || 0.65, 1.45 * sc(Zm)) * 8) / 8);
          buckets[bk] = (buckets[bk] || '') + `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} `;
        }
      }
      u += gap / K(Zm);
    }
    return Object.entries(buckets).map(([w, d]) => `<path d="${d}" stroke="${o.col || INK}" stroke-width="${w}" fill="none" opacity="${o.op ?? 0.5}" stroke-linecap="round"/>`).join('');
  }
  // the plane's own key-light shading as hatch: lit planes none, mid planes a single hatch, shadow planes crosshatch.
  function planeShade(at, Ls, Lt, n, o = {}) {
    const l = lam(n) + (o.bias || 0);
    let s = '';
    if (l < 0.05) s += hatch3(at, 0, Ls, 0, Lt, o.angA ?? 0.7, { op: o.op ?? 0.42, ragged: 0.04 }) + hatch3(at, 0, Ls, 0, Lt, o.angB ?? -0.8, { op: (o.op ?? 0.42) * 0.85, ragged: 0.04, gap: 1.1 });
    else if (l < 0.3) s += hatch3(at, 0, Ls, 0, Lt, o.angA ?? 0.7, { op: (o.op ?? 0.42) * 0.7, ragged: 0.05, gap: 1.2 });
    return s;
  }
  // a band of hatching along an edge of a plane (occlusion where two surfaces meet): at(s,t), band from t=0 to t=w
  const occBand = (at, Ls, w, o = {}) => hatch3(at, 0, Ls, 0, w, o.ang ?? 0.9, { op: o.op ?? 0.45, ragged: 0.5, gap: o.gap || 1 }) + (o.cross ? hatch3(at, 0, Ls, 0, w * 0.55, -0.7, { op: (o.op ?? 0.45) * 0.8, ragged: 0.5 }) : '');

  // ---------------------------------------------------------------- materials on a plane at(s,t)
  const tone = (col, v = 0.3) => mix(col, R() < 0.45 ? '#c8b89a' : '#120c08', R() * v);
  // stone: coursed blocks, every block its own tone, chipped, with its own bevel shadow, pits and the odd crack
  function masonry(at, Ls, Lt, col, o = {}) {
    let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, o.mortar ?? 0.62)}"/>`;
    const ch = o.course || 0.42, bl = o.block || 0.8, g = o.joint || 0.022;
    const WX = mv2().begin(at, Ls, Lt, o.wx), jointC = mix(col, INK, o.mortar ?? 0.62), COL = { tex: '', h: {} };   // materials v2: weathering (own random stream)
    let t = 0, row = 0;
    while (t < Lt - 0.03) {
      const h = Math.min(Lt - t, ch * (0.7 + R() * 0.6));
      let s = -(row % 2) * bl * 0.5 - R() * 0.25;
      while (s < Ls) {
        const w = bl * (0.6 + R() * 0.8), a0 = Math.max(0, s), a1 = Math.min(Ls, s + w);
        if (a1 - a0 > 0.06 && !(o.skip && o.skip(a0, a1, t, t + h))) {
          const jit = () => (R() - 0.5) * 0.04;
          const q = [at(a0 + g + jit(), t + g + jit() * 0.5), at(a1 - g + jit(), t + g * 1.4), at(a1 - g + jit(), t + h - g + jit() * 0.5), at(a0 + g + jit(), t + h - g)];
          const qs = chip(q.map(p => P(...p)), o.chip ?? 0.42), Zb = (q[0][2] + q[2][2]) / 2;
          let fill = tone(col, o.vary ?? 0.3);
          if (o.damp && t < o.damp * (0.6 + R() * 0.6)) fill = mix(fill, o.dampCol || '#2a2a1a', 0.25 + R() * 0.2);
          out += cel(qs, { Z: Zb, fill, tex: 'url(#mottle)', texOp: 0.35, collect: o.weather ? undefined : COL });
          out += WX.stoneNow(qs, Zb, fill, q, { joint: jointC, now: !!o.weather });   // sea weathering is drawn per stone, so ours goes under it
          const bw2 = Math.abs(qs[1][0] - qs[0][0]), bh2 = Math.abs(qs[3][1] - qs[0][1]), cx = (qs[0][0] + qs[2][0]) / 2, cy = (qs[0][1] + qs[2][1]) / 2;
          if (bw2 > 8 && bh2 > 5) {
            for (let i = 0; i < Math.floor(R() * 3); i++) out += `<circle cx="${f1(cx + (R() - 0.5) * bw2 * 0.7)}" cy="${f1(cy + (R() - 0.5) * bh2 * 0.6)}" r="${f1(0.5 + R() * Math.min(2, bw2 * 0.02))}" fill="${INK}" opacity="0.45"/>`;
            if (R() < 0.18) out += `<path d="M${f1(cx - bw2 * 0.2)} ${f1(qs[0][1] + 1)} l${f1(bw2 * 0.08)} ${f1(bh2 * 0.4)} l${f1(-bw2 * 0.05)} ${f1(bh2 * 0.35)}" stroke="${INK}" stroke-width="${f1(inkW(Zb) * 0.7)}" fill="none"/>`;
            if (o.marks && R() < o.marks) out += mark(cx, cy, Math.min(bw2, bh2) * 0.28, Zb);
            // weathering (sea worlds): algae bloom on the face, salt crust along the top bed, a few barnacles low down
            const wz = o.weather;
            if (wz) {
              if (R() < (wz.algae ?? 0.25)) out += `<path d="${p2(qs)}" fill="${wz.algaeCol || '#2e4a32'}" opacity="${f1(0.15 + R() * 0.2)}"/>`;
              if (R() < (wz.salt ?? 0.22)) { const a = qs[3], b = qs[2], pts = []; for (let k = 0; k <= 6; k++) { const u = k / 6; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + 1 + R() * Math.min(3, bh2 * 0.15)]); } out += `<path d="${smooth(pts, false, 0.6)}" stroke="${wz.saltCol || '#d8dcd0'}" stroke-width="${f1(Math.max(0.6, inkW(Zb) * 0.9))}" fill="none" opacity="0.5" stroke-dasharray="${f1(3 + R() * 4)} ${f1(1 + R() * 2)}"/>`; }
              if (R() < (wz.barn ?? 0.1)) for (let k = 0; k < 2 + Math.floor(R() * 3); k++) { const x = qs[0][0] + R() * bw2, y = qs[0][1] - R() * bh2 * 0.4, r = Math.max(0.7, Math.min(2.4, bw2 * 0.04)); out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#b4b0a0" stroke="${INK}" stroke-width="0.4"/><circle cx="${f1(x + r * 0.1)}" cy="${f1(y + r * 0.1)}" r="${f1(r * 0.4)}" fill="${INK}"/>`; }
            }
          }
        }
        s += w;
      }
      t += h; row++;
    }
    return out + collected(COL, 0.35) + WX.end({ plane: o.weatherPlane });
  }
  const collected = (C, op) => (C.tex ? `<path d="${C.tex}" fill="url(#mottle)" opacity="${op}"/>` : '') + Object.entries(C.h).map(([k, d]) => `<path d="${d}" fill="${k}" opacity="0.5"/>`).join('') + Object.entries(C.hv || {}).map(([w, d]) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>`).join('');
  // a mason's banker mark cut into a stone face: a small incised sign (only the old stones carry them)
  function mark(x, y, r, Z) {
    const k = R(), w = f1(Math.max(0.7, inkW(Z) * 0.8)), lt = mix('#c8b89a', KEY, 0.4);
    const d = k < 0.33 ? `M${f1(x - r)} ${f1(y + r)} L${f1(x)} ${f1(y - r)} L${f1(x + r)} ${f1(y + r)} M${f1(x - r * 0.5)} ${f1(y + r * 0.1)} L${f1(x + r * 0.5)} ${f1(y + r * 0.1)}`
      : k < 0.66 ? `M${f1(x)} ${f1(y - r)} L${f1(x)} ${f1(y + r)} M${f1(x - r)} ${f1(y - r * 0.3)} L${f1(x + r)} ${f1(y - r * 0.3)} M${f1(x - r * 0.6)} ${f1(y + r)} L${f1(x)} ${f1(y + r * 0.4)}`
        : `M${f1(x - r)} ${f1(y - r)} L${f1(x + r)} ${f1(y + r)} M${f1(x + r)} ${f1(y - r)} L${f1(x - r)} ${f1(y + r)} M${f1(x - r)} ${f1(y)} L${f1(x - r * 0.4)} ${f1(y)}`;
    return `<path d="${d}" stroke="${INK}" stroke-width="${w}" fill="none" opacity="0.8"/><path d="${d}" transform="translate(-0.7,-0.7)" stroke="${lt}" stroke-width="${f1(w * 0.6)}" fill="none" opacity="0.35"/>`;
  }
  // boards: planks along s, stacked along t (bw wide). grain that wanders, knots, nails, splits, worn bright edges, stains
  function boards(at, Ls, Lt, col, o = {}) {
    const n = o.boards || Math.max(1, Math.round(Lt / (o.bw || 0.22)));
    let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, 0.7)}"/>`;
    const segs = o.segs || (Ls > 3 ? Math.ceil(Ls / (2.2 + R())) : 1);
    for (let i = 0; i < n; i++) {
      const v0 = Lt * i / n + 0.006, v1 = Lt * (i + 1) / n - 0.006;
      // boards butt-jointed along their length, joints staggered
      const cuts = [0]; for (let k = 1; k < segs; k++) cuts.push(Ls * (k + (R() - 0.5) * 0.5) / segs); cuts.push(Ls);
      for (let k = 0; k < cuts.length - 1; k++) {
        const u0 = cuts[k] + (k ? 0.008 : 0), u1 = cuts[k + 1] - (k < cuts.length - 2 ? 0.008 : 0), tn = tone(col, o.vary ?? 0.34), sag = (R() - 0.5) * 0.012;
        const q = [at(u0, v0), at(u1, v0 + sag), at(u1, v1 + sag), at(u0, v1)], qs = q.map(p => P(...p)), Zb = (q[0][2] + q[2][2]) / 2;
        out += cel(o.chipEnds ? chip(qs, 0.25) : qs, { Z: Zb, fill: tn, band: Math.max(1, 0.018 * K(Zb)) });
        // grain: long wavy lines along the board
        const gl = 2 + Math.floor(R() * 3);
        for (let j = 0; j < gl; j++) {
          const vv = v0 + (v1 - v0) * (0.15 + 0.7 * (j + R() * 0.6) / gl), amp = (v1 - v0) * (0.05 + R() * 0.1), ph = R() * 6, fr = 2 + R() * 4, pts = [];
          for (let m = 0; m <= 12; m++) { const u = u0 + (u1 - u0) * m / 12; pts.push(P(...at(u, Math.min(v1, Math.max(v0, vv + Math.sin(m / 12 * fr + ph) * amp))))); }
          out += `<path d="${smooth(pts, false, 0.5)}" stroke="${mix(tn, INK, 0.55)}" stroke-width="${f1(Math.max(0.5, inkW(Zb) * 0.45))}" fill="none" opacity="${f1(0.45 + R() * 0.3)}"/>`;
        }
        const Kb = K(Zb), bwpx = Math.abs(qs[3][1] - qs[0][1]) + Math.abs(qs[3][0] - qs[0][0]) * 0.3;
        if (R() < (o.knots ?? 0.4) && bwpx > 4) { const c = P(...at(u0 + (u1 - u0) * (0.1 + R() * 0.8), (v0 + v1) / 2)), rr = Math.max(1.2, Math.min(bwpx * 0.22, Kb * 0.012));
          out += `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rr * 1.7)}" ry="${f1(rr)}" fill="${mix(tn, INK, 0.5)}" stroke="${INK}" stroke-width="0.7"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rr * 3)}" ry="${f1(rr * 1.6)}" fill="none" stroke="${mix(tn, INK, 0.4)}" stroke-width="0.6" opacity="0.7"/>`; }
        if (o.nails !== false && bwpx > 3) for (const u of [u0 + 0.05, u1 - 0.05]) { if (u1 - u0 < 0.3) break; const c = P(...at(u, (v0 + v1) / 2)), r = Math.max(0.8, Kb * 0.007); out += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="#24201c" stroke="${INK}" stroke-width="0.5"/>` + (R() < 0.4 ? `<path d="M${f1(c[0])} ${f1(c[1] + r)} l${f1((R() - 0.5) * 2)} ${f1(Kb * 0.03)}" stroke="#5a2a14" stroke-width="${f1(r)}" opacity="0.35"/>` : ''); }
        if (R() < 0.3) { const e = R() < 0.5 ? u0 : u1, dd = e === u0 ? 0.12 : -0.12, pa = P(...at(e, (v0 + v1) / 2)), pb = P(...at(e + dd, (v0 + v1) / 2 + (R() - 0.5) * (v1 - v0) * 0.3)); out += `<path d="M${f1(pa[0])} ${f1(pa[1])} L${f1(pb[0])} ${f1(pb[1])}" stroke="${INK}" stroke-width="${f1(inkW(Zb) * 0.7)}"/>`; }
        if (R() < (o.stains ?? 0.15)) { const c = P(...at(u0 + (u1 - u0) * R(), (v0 + v1) / 2)); out += stain(c[0], c[1], Kb * (0.06 + R() * 0.1), '#140c06', 0.3); }
      }
    }
    return out;
  }
  // a soft-edged stain made of a few irregular overlapping blobs (no gradient)
  function stain(x, y, r, col, op) {
    let s = ''; for (let i = 0; i < 3; i++) { const pts = []; const rr = r * (1 - i * 0.25), ox = (R() - 0.5) * r * 0.5, oy = (R() - 0.5) * r * 0.3; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, m = 0.6 + R() * 0.5; pts.push([x + ox + Math.cos(a) * rr * m, y + oy + Math.sin(a) * rr * m * 0.55]); } s += `<path d="${smooth(pts, true, 0.8)}" fill="${col}" opacity="${f1(op * (0.5 + i * 0.25))}"/>`; }
    return s;
  }
  // limewash over stone: brushed, stained by damp from the floor, sooted where smoke rises, flaked to the stone
  function limewash(at, Ls, Lt, col, o = {}) {
    const q = [at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)];
    let out = `<path d="${pp(q)}" fill="${col}"/><path d="${pp(q)}" fill="url(#mottle)" opacity="0.22"/><path d="${pp(q)}" fill="url(#speck)" opacity="0.15"/>`;
    // brush marks: short, crossing strokes of slightly lighter and darker wash
    for (let i = 0; i < (o.brush ?? Ls * Lt * 7); i++) {
      const s = R() * Ls, t = R() * Lt, a = (R() - 0.5) * 1.2 + (R() < 0.5 ? 0 : Math.PI / 2), l = 0.1 + R() * 0.22, A = P(...at(s, t)), B = P(...at(Math.min(Ls, Math.max(0, s + Math.cos(a) * l)), Math.min(Lt, Math.max(0, t + Math.sin(a) * l))));
      out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(col, R() < 0.5 ? '#efe6d0' : '#5a4e3a', 0.35)}" stroke-width="${f1(Math.max(1, K(at(s, t)[2]) * 0.03))}" opacity="0.2" stroke-linecap="round"/>`;
    }
    // flakes: the wash gone, the stone showing, the wash's broken lip inked and caught by the light
    for (let i = 0; i < (o.flakes || 0); i++) {
      const s0 = 0.3 + R() * (Ls - 0.6), t0 = (o.flakeT ? o.flakeT[0] + R() * (o.flakeT[1] - o.flakeT[0]) : R() * Lt * 0.9), w = 0.3 + R() * 0.35, h = 0.18 + R() * 0.2, pts3 = [];
      for (let k = 0; k < 17; k++) { const th = k / 17 * Math.PI * 2, m = o.flakeStone === 'ashlar' ? 0.62 + R() * 0.38 + 0.12 * Math.sin(k * 1.3 + i) : (k % 2 ? 0.55 : 0.8) + R() * 0.35; pts3.push(at(Math.max(0, Math.min(Ls, s0 + Math.cos(th) * w / 2 * m)), Math.max(0, Math.min(Lt, t0 + Math.sin(th) * h / 2 * m)))); }
      const ps = pts3.map(p => P(...p)), cid = id('fk');
      out += `<clipPath id="${cid}"><path d="${p2(ps)}"/></clipPath><g clip-path="url(#${cid})">${o.flakeStone === 'ashlar' ? ashlar((s, t) => at(s0 - w + s, t0 - h + t), w * 2, h * 2, o.stone || '#6a5e4e', { scale: 0.32, wscale: 0.4, chip: 0.6, mortar: 0.6, spall: 0.1, courses: [0.9, 0.5, 1.1, 0.35, 0.75, 1.0, 0.45] }) : masonry((s, t) => at(s0 - w + s, t0 - h + t), w * 2, h * 2, o.stone || '#6a5e4e', { course: 0.3, block: 0.5, chip: 0.6 })}</g>`;
      out += `<path d="${p2(ps)}" fill="none" stroke="${INK}" stroke-width="${f1(inkW(pts3[0][2]) * 0.8)}"/><path d="${p2(ps)}" fill="none" stroke="${mix(col, KEY, 0.6)}" stroke-width="${f1(inkW(pts3[0][2]) * 0.8)}" transform="translate(-1,-1)" opacity="0.5"/>`;
    }
    // rising damp: an irregular tide mark from the floor, darker at its edge, salts bloomed along the line
    if (o.damp) {
      const top = [];
      const N2 = Math.round(Ls * 9); for (let k = 0; k <= N2; k++) { const s = Ls * k / N2; top.push(at(s, o.damp * (0.75 + 0.1 * Math.sin(k * 0.45) + 0.07 * Math.sin(k * 1.7 + 1) + (R() - 0.5) * 0.08))); }
      const poly = [at(0, 0), ...top, at(Ls, 0)].map(p => P(...p));
      out += `<path d="${smooth(poly, true, 0.4)}" fill="${o.dampCol || '#4a3a24'}" opacity="0.2"/>`;
      out += `<path d="${smooth(top.map(p => P(...p)), false, 0.5)}" stroke="${mix(o.dampCol || '#3a3424', INK, 0.4)}" stroke-width="${f1(Math.max(1, K(top[0][2]) * 0.012))}" fill="none" opacity="0.6"/>`;
      out += `<path d="${smooth(top.map(p => { const q = P(...p); return [q[0], q[1] + 2]; }), false, 0.5)}" stroke="#e0d8c4" stroke-width="${f1(Math.max(0.8, K(top[0][2]) * 0.006))}" fill="none" opacity="0.3"/>`;
      out += hatch3((s, t) => at(s, t), 0, Ls, 0, o.damp * 0.55, 1.1, { op: 0.28, ragged: 0.4 });
    }
    // streaks running down from the top (water through the roof, rust from nails)
    for (let i = 0; i < (o.streaks || 0); i++) {
      const s = R() * Ls, l = Lt * (0.2 + R() * 0.5), A = P(...at(s, Lt)), B = P(...at(s + (R() - 0.5) * 0.1, Lt - l)), w = Math.max(1, K(at(s, 0)[2]) * (0.03 + R() * 0.06));
      out += `<path d="M${f1(A[0])} ${f1(A[1])} C${f1(A[0] + 2)} ${f1((A[1] * 2 + B[1]) / 3)} ${f1(B[0] - 2)} ${f1((A[1] + B[1] * 2) / 3)} ${f1(B[0])} ${f1(B[1])}" stroke="${R() < 0.3 ? '#5a3418' : '#2a2216'}" stroke-width="${f1(w)}" opacity="${f1(0.12 + R() * 0.12)}" fill="none" stroke-linecap="round"/>`;
    }
    return out;
  }
  // soot climbing a wall from a source: built from hatching (dense near the source, ragged at its edge) over a dark wash
  function soot(at, s0, s1, t0, t1, o = {}) {
    const pts = [], N = 16;
    for (let k = 0; k <= N; k++) { const u = k / N, s = s0 + (s1 - s0) * u, bulge = Math.sin(u * Math.PI); pts.push(at(s, t0 + (t1 - t0) * (0.35 + 0.65 * bulge) * (0.8 + R() * 0.3))); }
    const poly = [at(s0, t0), ...pts, at(s1, t0)].map(p => P(...p));
    let out = `<path d="${smooth(poly, true, 0.6)}" fill="#1a120c" opacity="${o.op ?? 0.3}"/>`;
    const keep = (s, t) => { const u = (s - s0) / (s1 - s0); return u > 0 && u < 1 && t < t0 + (t1 - t0) * (0.25 + 0.6 * Math.sin(u * Math.PI)) * (0.7 + R() * 0.4); };
    out += hatch3(at, s0, s1, t0, t1, 1.2, { op: 0.5, keep, ragged: 0.3 }) + hatch3(at, s0, s1, t0, t0 + (t1 - t0) * 0.55, -0.4, { op: 0.45, keep, ragged: 0.3 });
    return out;
  }

  // ---------------------------------------------------------------- shadows cast by the key light
  // project points along the key light onto a plane (n, d with n.p = d); returns screen hull
  function castOn(pts3, n, d) {
    const L = LW, out = [];
    for (const p of pts3) { const den = dot3(n, L); if (Math.abs(den) < 1e-6) continue; const t = (dot3(n, p) - d) / den; out.push(P(...sub3(p, mul3(L, t)))); }
    return hull(out);
  }
  const boxPts = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
  // a cast shadow: a cel shadow (ink-tinted, hatched), never a gradient. clip: optional screen polygon
  function shadowPoly(ps, Z, o = {}) {
    const d = smooth(ps, true, o.k ?? 0.25);
    return `<path d="${d}" fill="${o.col || '#1a120c'}" opacity="${o.op ?? 0.34}"/><path d="${d}" fill="${hatchA(Z)}" opacity="${o.hop ?? 0.4}"/>` + (o.cross ? `<path d="${d}" fill="${hatchB(Z)}" opacity="${o.hop ?? 0.35}"/>` : '');
  }
  function castBox(x0, x1, y0, y1, z0, z1, o = {}) {
    const floor = castOn(boxPts(x0, x1, y0, y1, z0, z1), [0, 1, 0], 0);
    raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(floor, (z0 + z1) / 2, o)));
  }

  // ---------------------------------------------------------------- props drawn with the figure engine
  // build(f, u) draws in figure px with the origin at the anchor (X,Y,Z), x right, y down; u = figure px per metre.
  // o.fig: Fig option overrides; o.em: emissive; o.tag: false to skip the z tag (caller tags)
  let pseed = (seed % 1000) * 100 + 7000;
  function figProp(X, Y, Z, build, o = {}) {
    const s = sc(Z) * (o.scale || 1), fs = pseed++;
    const base = cfg.figBase ? cfg.figBase(fs) : KIT.base(fs);
    const fig = new Fig(Object.assign(base, { grimeY: null, groundY: 0, wobble: 1.6 }, o.fig || {}));
    build(fig, UM, s);
    const sv = fig.svg(); DEFS.push(sv.defs);
    const [x, y] = P(X, Y, Z), g = `<g transform="translate(${f1(x)},${f1(y)}) scale(${s.toFixed(4)})">${sv.body}</g>`;
    raw(o.tag === false ? (o.em ? EM(g) : g) : `<g class="z_${Math.round(Z * 100)}">${o.em ? EM(g) : g}</g>`);
  }
  // a mapped-to-screen helper for figProps: metres (dx right, dy up) -> figure px
  const M = (dx, dy) => [dx * UM, -dy * UM];
  // a painted warm glow for the unlit preview (tagged glow: the lit passes drop it)
  function glow(x, y, rx, ry, col, op) {
    const g = id('gl'); DEFS.push(`<radialGradient id="${g}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="0.45" stop-color="${col}" stop-opacity="${op * 0.45}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`);
    return GLOW(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#${g})"/>`);
  }

  // ================================================================ v2 (2026-11-24): value grading, wear, ashlar, void bites
  // ---- deferred slots: a place in a layer filled at write time (grading needs every light the room adds)
  const slot =(name, fn) => { LAY[cur].push({ slot: name }); DEFER.push([name, fn]); };
  const runDeferred = () => { for (const [n, fn] of DEFER.splice(0)) SLOTS[n] = fn(); };
  // ---- how much light reaches a world point from the room's lights (no occlusion): 0 dark .. 1 lit
  function lightAt(p, extra = []) {
    let s = 0;
    for (const L of LIGHTS.concat(extra)) { const d = Math.hypot(p[0] - L.pos[0], p[1] - L.pos[1], p[2] - L.pos[2]); if (d < L.range) s += L.I * Math.pow(1 - d / L.range, 2.0); }
    return Math.min(1, s * (cfg.lightGain || 1.1));
  }
  // ---- zone hatching: hatch laid in a plane at(s,t) only where dk(s,t) passes a threshold; the runs end raggedly, so value
  // steps read as ink density (the Living Ink way to grade a wall), never as a gradient. levels: [threshold, angle, gapMul, opacity]
  function zoneHatch(at, Ls, Lt, dk, o = {}) {
    const levels = o.levels || [[0.4, 0.75, 1.15, 0.36], [0.62, -0.8, 1.2, 0.34], [0.82, 0.12, 0.9, 0.32]];
    let out = '';
    levels.forEach(([th, ang, gm, op], li) => {
      const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca, cs = Ls / 2, ct = Lt / 2, rad = Math.hypot(Ls, Lt) / 2;
      const buckets = {}; let u = -rad, line = 0;
      while (u < rad) {
        const px = cs + nx * u, py = ct + ny * u;
        let l0 = -1e9, l1 = 1e9, ok = true;
        for (const [p, d, lo, hi] of [[px, ca, 0, Ls], [py, sa, 0, Lt]]) { if (Math.abs(d) < 1e-9) { if (p < lo || p > hi) ok = false; continue; } let a = (lo - p) / d, b = (hi - p) / d; if (a > b) [a, b] = [b, a]; l0 = Math.max(l0, a); l1 = Math.min(l1, b); }
        const mid = at(cs + nx * u + ca * (l0 + l1) / 2, ct + ny * u + sa * (l0 + l1) / 2), Zm = Math.max(0.5, mid[2]);
        const gap = gm * Math.max(MINGAP, 6.5 * sc(Zm));
        if (ok && l1 > l0) {
          const step = Math.max(0.04, (l1 - l0) / 60), ph = R() * 6.28, ph2 = R() * 6.28, jit = (R() - 0.5) * 0.06;
          let run = null;
          const emit = (a, b) => { if (b - a < step * 1.5) return; const A = P(...at(px + ca * a, py + sa * a)), B = P(...at(px + ca * b, py + sa * b)); const bk = Math.max(cfg.minHatchW || 0.6, Math.round(Math.max(cfg.minHatchW || 0.65, 1.35 * sc(Zm)) * 8) / 8); buckets[bk] = (buckets[bk] || '') + `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} `; };
          for (let l = l0; l <= l1 + 1e-6; l += step) {
            const s = px + ca * l, t = py + sa * l, v = dk(s, t) + jit + 0.05 * Math.sin(l * 2.3 + ph) + 0.035 * Math.sin(l * 7.1 + ph2);
            if (v > th) { if (run === null) run = l; } else if (run !== null) { emit(run, l); run = null; }
          }
          if (run !== null) emit(run, l1);
        }
        u += gap / K(Zm); line++;
      }
      out += Object.entries(buckets).map(([w, d]) => `<path d="${d}" stroke="${o.col || INK}" stroke-width="${w}" fill="none" opacity="${op * (o.op ?? 1)}" stroke-linecap="round"/>`).join('');
    });
    return out;
  }
  // darkness of a plane point for grading: light falloff from the room's lights, plus occlusion into the plane's edges.
  // ao: [[edge distance fn (s,t)->m, reach m, strength]], bias: plane offset (ceilings darker), lw: weight of the light term
  const gradeDk = (at, o = {}) => (s, t) => {
    const p = at(s, t); let d = (1 - lightAt(p)) * (o.lw ?? 0.85) + (o.bias || 0);
    for (const [fn, reach, k] of o.ao || []) { const e = fn(s, t); if (e < reach) d = Math.max(d, k * (1 - e / reach) + (o.bias || 0) * 0.5); }
    if (o.front) { const z = p[2]; if (z < o.front[1]) d = Math.max(d, o.front[2] * (o.front[1] - z) / (o.front[1] - o.front[0])); }
    return d;
  };
  // the preview's value grading (fx layer, class glow: the game's lit passes drop it, its own lights do this there).
  // A dark veil, cut back in steps round each light (ragged-edged discs), heavier in the frame's corners and at the top.
  function veil(o = {}) {
    const m = id('vm'), wf = id('vw'), steps = o.steps || [0.95, 0.72, 0.5, 0.32];
    let discs = '';
    for (const L of LIGHTS) {
      if (L.pos[2] < 0.5) continue;
      const [x, y] = P(...L.pos), r0 = K(L.pos[2]) * L.range * (o.reach || 0.55) * Math.sqrt(L.I);
      steps.forEach((k, i) => { discs += `<ellipse cx="${f1(x)}" cy="${f1(y + r0 * k * 0.15)}" rx="${f1(r0 * k)}" ry="${f1(r0 * k * 0.8)}" fill="#000" opacity="${f1((o.cut || 0.3) * (0.6 + 0.4 * L.I / 1.5))}"/>`; });
    }
    let corners = '';
    if (o.top) corners += `<path d="M0 0 L${W} 0 L${W} ${o.top * 0.6} Q${W / 2} ${o.top * 1.15} 0 ${o.top * 0.6} Z" fill="#fff" opacity="0.35"/><path d="M0 0 L${W} 0 L${W} ${o.top * 0.3} Q${W / 2} ${o.top * 0.6} 0 ${o.top * 0.3} Z" fill="#fff" opacity="0.4"/>`;
    if (o.bottom) corners += `<path d="M0 ${H} L${W} ${H} L${W} ${H - o.bottom} Q${W / 2} ${H - o.bottom * 0.7} 0 ${H - o.bottom} Z" fill="#fff" opacity="0.35"/><path d="M0 ${H} L${W} ${H} L${W} ${H - o.bottom * 0.45} Q${W / 2} ${H - o.bottom * 0.3} 0 ${H - o.bottom * 0.45} Z" fill="#fff" opacity="0.35"/>`;
    for (const [cx, cy, r] of o.corners || []) corners += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.9}" fill="#fff" opacity="0.3"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.6}" ry="${r * 0.55}" fill="#fff" opacity="0.3"/>`;
    DEFS.push(`<filter id="${wf}" x="0" y="0" width="${W}" height="${H}" filterUnits="userSpaceOnUse"><feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="2" seed="${seed % 31 + 2}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter>`);
    DEFS.push(`<mask id="${m}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><g filter="url(#${wf})"><rect width="${W}" height="${H}" fill="#fff" opacity="${o.base ?? 0.7}"/>${corners}${discs}</g></mask>`);
    return GLOW(`<rect width="${W}" height="${H}" fill="${o.col || '#0c0705'}" opacity="${o.op ?? 0.55}" mask="url(#${m})"/>`);
  }

  // ---- wear on walls
  // a crack: a wandering, branching ink line in the plane, with the light catching its lower lip
  function crack(at, s0, t0, len, ang, o = {}) {
    let out = '';
    const go = (s, t, a, l, w, depth) => {
      const pts = [[s, t]]; let cs = s, ct = t;
      const n = 5 + Math.floor(R() * 4);
      for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.9; cs += Math.cos(a) * l / n; ct += Math.sin(a) * l / n; pts.push([cs, ct]); if (depth > 0 && R() < 0.28) go(cs, ct, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), l * (0.3 + R() * 0.3), w * 0.6, depth - 1); }
      const ps = pts.map(q => P(...at(q[0], q[1]))), Z = at(s, t)[2], ww = Math.max(0.6, inkW(Z) * w);
      out += `<path d="${'M' + ps.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L')}" stroke="${INK}" stroke-width="${f1(ww)}" fill="none" stroke-linejoin="round" stroke-linecap="round" opacity="${o.op ?? 0.85}"/>`;
      out += `<path d="${'M' + ps.map(q => f1(q[0] + 0.9) + ' ' + f1(q[1] + 0.9)).join(' L')}" stroke="${o.lip || '#e8dcc0'}" stroke-width="${f1(ww * 0.55)}" fill="none" opacity="0.35"/>`;
    };
    go(s0, t0, ang, len, o.w || 0.9, o.branch ?? 2);
    return out;
  }
  // an irregular blob outline in plane coords (for patches, blooms, flakes)
  const blobST = (s0, t0, w, h, n = 14, jag = 0.35) => { const o = []; for (let k = 0; k < n; k++) { const th = k / n * Math.PI * 2, m = 1 - jag / 2 + R() * jag; o.push([s0 + Math.cos(th) * w / 2 * m, t0 + Math.sin(th) * h / 2 * m]); } return o; };
  // a patch of newer limewash or plaster over the old: its own tone, brush marks to its edge, a thin raised lip
  function patch(at, s0, t0, w, h, col, o = {}) {
    const pts = o.square ? [[s0 - w / 2, t0 - h / 2], [s0 + w / 2 + (R() - 0.5) * 0.08, t0 - h / 2], [s0 + w / 2, t0 + h / 2 + (R() - 0.5) * 0.08], [s0 - w / 2 + (R() - 0.5) * 0.08, t0 + h / 2]] : blobST(s0, t0, w, h, 16, 0.3);
    const ps = pts.map(q => P(...at(q[0], q[1]))), Z = at(s0, t0)[2];
    let out = `<path d="${o.square ? p2(ps) : smooth(ps, true, 0.5)}" fill="${col}" opacity="${o.op ?? 0.9}"/><path d="${o.square ? p2(ps) : smooth(ps, true, 0.5)}" fill="url(#mottle)" opacity="0.25"/>`;
    for (let i = 0; i < w * h * 30 + 4; i++) { const s = s0 + (R() - 0.5) * w * 0.9, t = t0 + (R() - 0.5) * h * 0.9, a = (R() - 0.5) * 1.2, l = 0.08 + R() * 0.15, A = P(...at(s, t)), B = P(...at(s + Math.cos(a) * l, t + Math.sin(a) * l)); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(col, R() < 0.5 ? '#f4ecd8' : '#4a3e2e', 0.35)}" stroke-width="${f1(Math.max(1, K(Z) * 0.025))}" opacity="0.25" stroke-linecap="round"/>`; }
    out += `<path d="${o.square ? p2(ps) : smooth(ps, true, 0.5)}" fill="none" stroke="${o.edge || mix(col, INK, 0.5)}" stroke-width="${f1(Math.max(0.6, inkW(Z) * 0.55))}" opacity="${o.edgeOp ?? 0.6}"/>`;
    out += `<path d="${o.square ? p2(ps) : smooth(ps, true, 0.5)}" fill="none" stroke="${mix(col, KEY, 0.6)}" stroke-width="${f1(Math.max(0.5, inkW(Z) * 0.4))}" opacity="0.35" transform="translate(-0.8,-0.8)"/>`;
    return out;
  }
  // damp bloom: mould spotting in a loose cloud (grey-green), denser at its heart, salts at its edge
  function bloomDamp(at, s0, t0, w, h, o = {}) {
    let out = '';
    const col = o.col || '#4a5236';
    out += `<path d="${smooth(blobST(s0, t0, w, h, 16, 0.5).map(q => P(...at(q[0], q[1]))), true, 0.6)}" fill="${col}" opacity="0.2"/>`;
    out += `<path d="${smooth(blobST(s0, t0, w * 0.6, h * 0.6, 14, 0.5).map(q => P(...at(q[0], q[1]))), true, 0.6)}" fill="${mix(col, INK, 0.3)}" opacity="0.2"/>`;
    for (let i = 0; i < (o.n || Math.round(w * h * 380)); i++) {
      const r = Math.sqrt(R()), th = R() * 6.283, s = s0 + Math.cos(th) * r * w / 2, t = t0 + Math.sin(th) * r * h / 2, [x, y] = P(...at(s, t)), k = K(at(s, t)[2]);
      const rr = Math.max(0.6, k * (0.005 + R() * 0.012) * (1.5 - r));
      out += R() < 0.8 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${mix(col, INK, 0.2 + R() * 0.3)}" opacity="${f1(0.45 + R() * 0.4)}"/>` : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr * 0.7)}" fill="#e0dcc8" opacity="0.55"/>`;
    }
    // salts crystallised along the bloom's edge
    { const e = blobST(s0, t0, w * 1.05, h * 1.05, 18, 0.4).map(q => P(...at(q[0], q[1]))); out += `<path d="${smooth(e, true, 0.6)}" fill="none" stroke="#ddd8c4" stroke-width="${f1(Math.max(0.7, K(at(s0, t0)[2]) * 0.01))}" stroke-dasharray="2 3 1 4" opacity="0.4"/>`; }
    return out;
  }
  // a nail or a wooden peg driven into a wall (normal n toward the room), with its little shadow down-right
  function peg(X, Y, Z, o = {}) {
    const [x, y] = P(X, Y, Z), k = K(Z), r = Math.max(1.2, k * (o.r || 0.012)), L = o.len ?? (o.wood ? 0.07 : 0.025), d = [(o.dir || [1, 0])[0] * k * L, -k * L * 0.15];
    let s = `<path d="M${f1(x + 1.5)} ${f1(y + 1.5)} l${f1(d[0] + 2)} ${f1(d[1] + 3)}" stroke="#1a120c" stroke-width="${f1(r * 1.6)}" opacity="0.3" stroke-linecap="round"/>`;
    if (o.wood) s += `<path d="M${f1(x)} ${f1(y)} l${f1(d[0])} ${f1(d[1])}" stroke="${INK}" stroke-width="${f1(r * 2 + 1.4)}" stroke-linecap="round"/><path d="M${f1(x)} ${f1(y)} l${f1(d[0])} ${f1(d[1])}" stroke="${o.col || '#5a4028'}" stroke-width="${f1(r * 2)}" stroke-linecap="round"/><circle cx="${f1(x + d[0])}" cy="${f1(y + d[1])}" r="${f1(r)}" fill="${mix(o.col || '#5a4028', KEY, 0.3)}" stroke="${INK}" stroke-width="0.7"/>`;
    else s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#2a2622" stroke="${INK}" stroke-width="0.7"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.35)}" fill="#6a6660"/>` + (R() < 0.6 ? `<path d="M${f1(x)} ${f1(y + r)} q${f1((R() - 0.5) * 2)} ${f1(k * 0.04)} ${f1((R() - 0.5) * 2)} ${f1(k * (0.06 + R() * 0.08))}" stroke="#5a2a14" stroke-width="${f1(r * 0.9)}" opacity="0.4" fill="none"/>` : '');
    return s;
  }
  // things lying flat on the floor in a region: rushes, straw, ash, shavings. at3(s,t) on the floor plane.
  function strew(at, s0, s1, t0, t1, n, o = {}) {
    const cols = o.cols || ['#8a7a42', '#6e6232', '#9a8a52', '#5a5030', '#a89a62'];
    let out = '';
    const dens = o.dens || (() => 1);
    for (let i = 0; i < n; i++) {
      const s = s0 + R() * (s1 - s0), t = t0 + R() * (t1 - t0);
      if (R() > dens(s, t)) continue;
      const a = (o.ang ?? R() * Math.PI) + (R() - 0.5) * (o.spread ?? 3.2), l = (o.len || 0.3) * (0.4 + R() * 0.8), w = (o.w || 0.008) * (0.7 + R() * 0.6), cw = Math.cos(a), sw = Math.sin(a);
      const bend = (R() - 0.5) * l * 0.25, m0 = [s + cw * l / 2 - sw * bend, t + sw * l / 2 + cw * bend];
      const q = [[s - cw * l / 2 - sw * w, t - sw * l / 2 + cw * w], [m0[0] - sw * w, m0[1] + cw * w], [s + cw * l - sw * w * 0.3, t + sw * l + cw * w * 0.3], [m0[0] + sw * w, m0[1] - cw * w], [s - cw * l / 2 + sw * w, t - sw * l / 2 - cw * w]];
      const ps = q.map(p => P(...at(p[0], p[1]))), Z = at(s, t)[2], col = cols[Math.floor(R() * cols.length)];
      out += `<path d="${p2(ps)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Z) * 0.32))}" stroke-linejoin="round"/>`;
      if (R() < 0.5) { const A = P(...at(s - cw * l * 0.3, t - sw * l * 0.3)), B = P(...at(s + cw * l * 0.4, t + sw * l * 0.4)); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(col, KEY, 0.5)}" stroke-width="${f1(Math.max(0.4, inkW(Z) * 0.25))}" opacity="0.6"/>`; }
    }
    return out;
  }

  // ---- ashlar: dressed stone of uneven sizes, mixed courses (thick, thin, bands of slips), spalled faces, mortar lost from
  // the joints, salt crust along the beds and barnacle bands at the old tide levels. A wall built and rebuilt, then drowned.
  function ashlar(at, Ls, Lt, col, o = {}) {
    const g = o.joint || 0.03;
    let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, o.mortar ?? 0.7)}"/>`;
    const WX = mv2().begin(at, Ls, Lt, o.wx), jointC = mix(col, INK, o.mortar ?? 0.7), COL = { tex: '', h: {} };   // materials v2: weathering (own random stream)
    const rows = []; let t = 0, k = 0;
    const plan = o.courses || [0.9, 0.55, 0.3, 0.6, 1.05, 0.5, 0.28, 0.28, 0.7, 0.55, 0.95, 0.45, 0.32, 0.6];
    while (t < Lt) { const h = Math.min(Lt - t, plan[k % plan.length] * (0.85 + R() * 0.3) * (o.scale || 1)); rows.push([t, h]); t += h; k++; }
    const spalls = [];
    rows.forEach(([t0, h], ri) => {
      let s = -R() * 1.2; const thin0 = h < 0.36 * (o.scale || 1), cw = o.rough ? 0.55 + R() * 1.3 : 1;
      while (s < Ls) {
        const w = cw * (thin0 ? 0.35 + R() * 0.7 : (0.6 + R() * 1.7) * (h > 0.8 ? 1.2 : 1)) * (o.wscale ?? o.scale ?? 1), a0 = Math.max(0, s), a1 = Math.min(Ls, s + w);
        // o.rough: coursed rubble rather than ashlar: stones of their own height in a course, the gap over a low stone packed
        // with thin pinning slips, every course its own stone length
        const stone = (a0, a1, t0, h, thin) => {
          const lost = R() < (o.lost ?? 0.18), gg = lost ? g * 2.6 : g;           // mortar washed out: wider, black joints, rounded arrises
          const drift = (R() - 0.5) * 0.05;
          const q = [at(a0 + gg, t0 + gg + drift * 0.3), at(a1 - gg, t0 + gg), at(a1 - gg + drift, t0 + h - gg), at(a0 + gg, t0 + h - gg + drift * 0.3)];
          const qs = chip(q.map(p => P(...p)), lost ? 0.85 : (o.chip ?? 0.45)), Zb = (q[0][2] + q[2][2]) / 2;
          let fill = tone(col, o.vary ?? 0.28);
          if (thin) fill = mix(fill, o.slipCol || '#5a5a50', 0.25);
          if (o.damp && t0 < o.damp * (0.6 + R() * 0.6)) fill = mix(fill, o.dampCol || '#2a2a1a', 0.22 + R() * 0.2);
          out += cel(qs, { Z: Zb, fill, tex: 'url(#mottle)', texOp: 0.4, band: Math.max(cfg.minBand ?? 1, 0.05 * K(Zb)), collect: COL });
          WX.stone(qs, Zb, fill, q, { joint: jointC, lost, thin });
          const bw = Math.abs(qs[1][0] - qs[0][0]), bh = Math.abs(qs[3][1] - qs[0][1]), cx = (qs[0][0] + qs[2][0]) / 2, cy = (qs[0][1] + qs[2][1]) / 2;
          if (bw > 6 && bh > 4) {
            // tooling marks: faint diagonal drag lines from the mason's claw chisel
            if (R() < 0.5) { let tl = ''; for (let i = 0; i < 4; i++) { const x = qs[0][0] + bw * (0.15 + i * 0.2 + R() * 0.05); tl += `M${f1(x)} ${f1(qs[0][1] + bh * 0.2)} l${f1(bw * 0.08)} ${f1(bh * 0.55)} `; } out += `<path d="${tl}" stroke="${mix(fill, INK, 0.4)}" stroke-width="${f1(Math.max(0.4, inkW(Zb) * 0.3))}" opacity="0.35"/>`; }
            for (let i = 0; i < Math.floor(R() * 4); i++) out += `<circle cx="${f1(cx + (R() - 0.5) * bw * 0.8)}" cy="${f1(cy + (R() - 0.5) * bh * 0.7)}" r="${f1(0.45 + R() * Math.min(1.8, bw * 0.02))}" fill="${INK}" opacity="0.5"/>`;
            // spalled face: a shell of the face fallen away from a corner or edge, the recess shaded at its top-left, lit lip below
            if (R() < (o.spall ?? 0.22)) spalls.push([qs, fill, Zb]);
            if (R() < 0.12) out += `<path d="M${f1(cx - bw * 0.25)} ${f1(qs[0][1] + 1)} l${f1(bw * 0.07)} ${f1(bh * 0.35)} l${f1(-bw * 0.04)} ${f1(bh * 0.4)}" stroke="${INK}" stroke-width="${f1(inkW(Zb) * 0.7)}" fill="none"/>`;
            const wz = o.weather;
            if (wz) {
              if (R() < (wz.algae ?? 0.2)) out += `<path d="${p2(qs)}" fill="${wz.algaeCol || '#2e4a32'}" opacity="${f1(0.12 + R() * 0.18)}"/>`;
              if (R() < (wz.salt ?? 0.3)) { // salt crust: a crusty pale rind along the top bed, with flecks below it
                const a = qs[0], b = qs[1], top = [], bot = [];
                for (let i = 0; i <= 8; i++) { const u = i / 8, x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u; top.push([x, y + 0.3]); bot.push([x, y + 1 + R() * Math.min(5, bh * 0.25)]); }
                out += `<path d="${smooth([...top, ...bot.reverse()], true, 0.4)}" fill="${wz.saltCol || '#c8ccc0'}" opacity="${f1(0.25 + R() * 0.25)}"/>`;
                for (let i = 0; i < 6; i++) out += `<circle cx="${f1(a[0] + R() * bw)}" cy="${f1(a[1] + 2 + R() * bh * 0.5)}" r="${f1(0.4 + R() * 0.8)}" fill="${wz.saltCol || '#d8dcd0'}" opacity="0.5"/>`;
              }
            }
          }
        };
        if (a1 - a0 > 0.08 && !(o.skip && o.skip(a0, a1, t0, t0 + h))) {
          if (o.rough && !thin0 && h > 0.2 * (o.scale || 1) && R() < (o.roughP ?? 0.5)) {
            const hs = h * (0.55 + R() * 0.3); stone(a0, a1, t0, hs, false);
            const n = 1 + Math.floor(R() * 3); let q0 = a0; for (let k = 0; k < n; k++) { const q1 = k === n - 1 ? a1 : q0 + (a1 - a0) * (0.25 + R() * 0.5) / n * 1.6; if (q1 - q0 > 0.05) stone(q0, Math.min(a1, q1), t0 + hs, h - hs, true); q0 = Math.min(a1, q1); }
          } else stone(a0, a1, t0, h, thin0);
        }
        s += w;
      }
    });
    out += collected(COL, 0.4) + WX.flush();   // materials v2 marks under the spalls, salt and barnacle bands
    // spalls drawn after the field so they sit over the neighbours' bands
    for (const [qs, fill, Zb] of spalls) {
      const bw = Math.abs(qs[1][0] - qs[0][0]), bh = Math.abs(qs[3][1] - qs[0][1]), c = R() < 0.5 ? qs[0] : qs[1], cx = (qs[0][0] + qs[2][0]) / 2, cy = (qs[0][1] + qs[2][1]) / 2;
      const ex = c[0] + (cx - c[0]) * (0.6 + R() * 0.5), ey = c[1] + (cy - c[1]) * (0.8 + R() * 0.6), pts = [];
      for (let i = 0; i < 9; i++) { const th = i / 9 * Math.PI * 2, m = 0.65 + R() * 0.45; pts.push([ex + Math.cos(th) * bw * 0.26 * m, ey + Math.sin(th) * bh * 0.3 * m]); }
      const d = smooth(pts, true, 0.3), cid = id('sp');
      out += `<path d="${d}" fill="${mix(fill, INK, 0.28)}"/><clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})"><path d="${d}" transform="translate(${f1(bw * 0.05 + 1.5)},${f1(bh * 0.08 + 1.5)})" fill="${mix(fill, KEY, 0.12)}"/><path d="${d}" fill="${hatchA(Zb)}" opacity="0.45"/></g>`;
      out += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Zb) * 0.75))}"/>`;
    }
    // barnacle bands at the old water levels: dense along a band, thinning out above and below, with a tide-line stain
    for (const [y0, y1, n] of o.barnBands || []) {
      const pts = []; for (let i = 0; i <= 24; i++) pts.push([Ls * i / 24, y1 + Math.sin(i * 0.9) * 0.05]);
      const band = [...pts.map(q => P(...at(q[0], q[1]))), ...pts.slice().reverse().map(q => P(...at(q[0], y0 + Math.sin(q[0] * 1.3) * 0.06)))];
      out += `<path d="${smooth(band, true, 0.4)}" fill="${o.bandCol || '#3a4a3a'}" opacity="0.28"/>`;
      out += `<path d="${smooth(pts.map(q => P(...at(q[0], q[1] + 0.04))), false, 0.4)}" stroke="#c8ccc0" stroke-width="${f1(Math.max(0.6, K(at(0, 0)[2]) * 0.012))}" fill="none" opacity="0.4" stroke-dasharray="6 3 2 3"/>`;
      for (let i = 0; i < n; i++) { const s = R() * Ls, u = R(), t = y0 + (y1 - y0) * (u < 0.7 ? 0.2 + R() * 0.6 : R()), [x, y] = P(...at(s, t)), Z = at(s, t)[2], b = Math.max(0.7, K(Z) * (0.015 + R() * 0.025));
        out += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(b)}" ry="${f1(b * 0.85)}" fill="${o.barnCol || '#a8a698'}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, b * 0.25))}"/><ellipse cx="${f1(x + b * 0.1)}" cy="${f1(y + b * 0.12)}" rx="${f1(b * 0.42)}" ry="${f1(b * 0.32)}" fill="${INK}"/><path d="M${f1(x - b * 0.7)} ${f1(y - b * 0.2)} A${f1(b)} ${f1(b * 0.85)} 0 0 1 ${f1(x + b * 0.1)} ${f1(y - b * 0.8)}" stroke="#efe8d8" stroke-width="${f1(Math.max(0.3, b * 0.18))}" fill="none" opacity="0.55"/>`; }
    }
    return out + WX.end({ plane: o.weatherPlane });
  }

  // ---- the void's bite: a hole eaten into a wall by overlapping round bites, clean-rimmed where the void took the stone. The
  // cut runs through the wall's thickness (the soffit of the cut is seen, in shadow, with the coursing continued on it); the
  // stone round it is cracked from the cusps where two bites meet and shaded into the rim. Never one floating disc.
  // at(s,t) on the wall plane; bites: [[s,t,r],...] in metres; o.depth: wall thickness (m) along +Z; o.cut: cut-face colour
  function voidBite(at, bites, o = {}) {
    // the union's outline, traced as a star from the weighted centre: along each ray, the farthest exit from any bite whose
    // circle the ray enters while still inside the union (exact arcs, so the rims stay clean)
    const cs = bites.reduce((a, b) => a + b[0] * b[2], 0) / bites.reduce((a, b) => a + b[2], 0), ct = bites.reduce((a, b) => a + b[1] * b[2], 0) / bites.reduce((a, b) => a + b[2], 0);
    const N = 220, pts = [];
    for (let i = 0; i < N; i++) {
      const th = i / N * Math.PI * 2, dx = Math.cos(th), dy = Math.sin(th);
      const segs = bites.map(([bx, by, br]) => { const ox = cs - bx, oy = ct - by, B = ox * dx + oy * dy, C = ox * ox + oy * oy - br * br, D = B * B - C; if (D < 0) return null; const r0 = -B - Math.sqrt(D), r1 = -B + Math.sqrt(D); return r1 > 0 ? [Math.max(0, r0), r1] : null; }).filter(Boolean).sort((p, q) => p[0] - q[0]);
      let reach = 0; for (const [r0, r1] of segs) { if (r0 <= reach + 1e-4) reach = Math.max(reach, r1); }
      pts.push([cs + dx * reach, ct + dy * reach, th]);
    }
    // cusps: where the boundary jumps from one circle to the next
    const owner = q => bites.findIndex(b => Math.abs(Math.hypot(q[0] - b[0], q[1] - b[1]) - b[2]) < 1e-3);
    const cusps = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if (owner(a) !== owner(b)) cusps.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); }
    const front = pts.map(q => at(q[0], q[1])), dz = o.depth || 1.0, dir = o.dir || [0, 0, 1];
    const Fs = front.map(p => P(...p)), Bs = front.map(p => P(p[0] + dir[0] * dz, p[1] + dir[1] * dz, p[2] + dir[2] * dz));
    const Z = front[0][2], fd = p2(Fs), bd = p2(Bs);
    let out = '';
    // stone round the bite, shaded in toward the rim: ragged rings of ink hatch (denser near the rim), no wash
    const ringPts = k => pts.map(q => { const dx = q[0] - cs, dy = q[1] - ct, l = Math.hypot(dx, dy) || 1, j = 0.75 + R() * 0.5; return P(...at(q[0] + dx / l * k * j, q[1] + dy / l * k * j)); });
    { const H0 = o.halo || 0.55, outer = ringPts(H0), inner = ringPts(H0 * 0.45), c1 = id('vb'), c2 = id('vb');
      out += `<clipPath id="${c1}"><path d="${smooth(outer, true, 0.5)}"/></clipPath><g clip-path="url(#${c1})"><path d="${smooth(outer, true, 0.5)}" fill="${hatchA(Z)}" opacity="0.55"/></g>`;
      out += `<clipPath id="${c2}"><path d="${smooth(inner, true, 0.5)}"/></clipPath><g clip-path="url(#${c2})"><path d="${smooth(inner, true, 0.5)}" fill="${o.shadeCol || '#0a0e12'}" opacity="0.18"/><path d="${smooth(inner, true, 0.5)}" fill="${hatchB(Z)}" opacity="0.5"/></g>`; }
    // cracks out of the stone from every cusp, and a few from the rim
    for (const c of cusps) { const a = Math.atan2(c[1] - ct, c[0] - cs); out += crack(at, c[0], c[1], (o.crackLen || 1.1) * (0.7 + R() * 0.6), a + (R() - 0.5) * 0.5, { w: 1.1, branch: 2, lip: o.lip }); }
    for (let i = 0; i < (o.rimCracks ?? 3); i++) { const q = pts[Math.floor(R() * pts.length)], a = Math.atan2(q[1] - ct, q[0] - cs); out += crack(at, q[0], q[1], (o.crackLen || 1.1) * (0.3 + R() * 0.4), a + (R() - 0.5) * 0.8, { w: 0.8, branch: 1, lip: o.lip }); }
    // the cut through the wall: its faces in shadow (seen from below, they face down), coursing continued on them, clean
    const cid2 = id('vc');
    // the fresh cut face is paler than the weathered face (the void took the stone, nothing has grown on it yet)
    out += `<path d="${fd}" fill="${o.cut || '#5a6666'}"/>`;
    out += `<clipPath id="${cid2}"><path d="${fd}"/></clipPath><g clip-path="url(#${cid2})">`;
    for (let i = 0; i < pts.length; i += 2) { const A = Fs[i], B = Bs[i]; if (i % 8 === 0) out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.7" opacity="0.6"/>`; }
    out += `<path d="${fd}" fill="${hatchA(Z)}" opacity="0.35"/>`;
    out += `<path d="${bd}" fill="${o.voidCol || '#040507'}"/></g>`;
    // the clean rim: one firm ink line, a faint violet edge where the void touches the stone, a thin lit lip at the lower arcs
    out += `<path d="${fd}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(1.1, inkW(Z) * 1.3))}" stroke-linejoin="round"/>`;
    if (o.violet !== false) out += `<path d="${bd}" fill="none" stroke="#6a4a8a" stroke-width="${f1(Math.max(0.8, inkW(Z)))}" opacity="0.45"/>`;
    { let lip = ''; for (let i = 0; i < pts.length; i++) { const q = pts[i]; if (q[1] < ct - 0.1 * Math.abs(ct)) { const A = Fs[i], B = Fs[(i + 1) % Fs.length]; if (Math.hypot(A[0] - B[0], A[1] - B[1]) < 20) lip += `M${f1(A[0])} ${f1(A[1] + 1)} L${f1(B[0])} ${f1(B[1] + 1)} `; } }
      out += `<path d="${lip}" stroke="${o.lip || '#c8d0c8'}" stroke-width="${f1(Math.max(0.6, inkW(Z) * 0.6))}" fill="none" opacity="0.45"/>`; }
    return { svg: out, outline: Fs, center: [cs, ct], cusps };
  }

  // materials v2 (scenes/materials_v2.js): weathered stone. Bound lazily to this scene's own API object.
  function mv2() { return MV2(SELF); }
  const SELF = { W, H, HZ, EYE, FL, CX, R, P, K, sc, UM, pp, p2, f1, INK, KEY, SHT, LW, inkW, inkH, gapFor, hatchA, hatchB, id, layer, raw, DEFS, LAY, svgLayer,
    PLANES, LIGHTS, HOT, planeId, normalOf, PLW, EM, GLOW, addLight, hot, outline, through, clip2, prop, lam, cel, chip, hatch3, planeShade, occBand, tone,
    masonry, mark, boards, stain, limewash, soot, castOn, boxPts, shadowPoly, castBox, figProp, M, glow, hull, mix, smooth, add3, sub3, dot3, norm3,
    slot, runDeferred, SLOTS, lightAt, zoneHatch, gradeDk, veil, crack, blobST, patch, bloomDamp, peg, strew, ashlar, voidBite,
    curLayer: () => cur };
  return SELF;
};
