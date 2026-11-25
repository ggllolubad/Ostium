// Living Ink battle-room kit for worlds IV, V, VI (group g2, round 2). Opt-in, built on lik.js and battle_li.js; neither is
// edited. G2(S, BK, { murk, air }) wraps a lik.js scene S (the shared battle camera) and adds:
//   stoneCells   a natural or hewn rock face laid in a plane: Voronoi cells stretched along the strata, every cell its own
//                broken outline (subdivided, jittered edges, never a clean facet), its own tone, a cast shadow under the
//                proud ones, cracks, pick marks; the joints are dark. Replaces round 1's low-poly triangle facets.
//   rockMass     a screen-outline rock mass (cliff, pillar, boulder) built the same way inside its outline, with strata
//                lines at a dip and a shadow flank in crosshatch.
//   timber       a rough-hewn timber member between two world points (props, sets, beams), charred and split on request.
//   oilLamp, flame, sparks, cage, keg, lantern: props drawn in screen space at a given size.
//   cloudMass    a storm cloud built from overlapping lobes of different sizes, lit on the upper left, banded underneath.
//   veil         atmospheric recession: a ragged translucent band of the air colour laid between depth planes.
//   floorCracks, puddle: perspective cues on floor planes (converging cracks and joints, reflections).
//   sea          a sea plane with wave rows that converge with the camera, foam and crest lines.
'use strict';
const { ell } = require('../engine');
const PR = require('./props_li');
const FS = require('fs'), PTH = require('path');
// materials_v2 (shared weathered stone): used once the materials agent marks it ready (or G2_MV=1 forces it for a test)
const MV_ON = FS.existsSync(PTH.join(__dirname, 'materials_v2.READY')) || process.env.G2_MV === '1';

module.exports = (S, BK, cfg = {}) => {
  const { P, K, R, f1, INK, KEY, p2, pp, cel, chip, mix, smooth, glow, EM, hatchA, hatchB, stain, inkW, tone } = S;
  const W = S.W, H = S.H, MURK = cfg.murk || '#100e0c', AIR = cfg.air || MURK;
  const line = BK.line, polyS = BK.polyS;
  const MV = MV_ON ? require('./materials_v2')(S) : null;
  const dim = (col, Z, k = 1) => mix(col, AIR, Math.max(0, Math.min(cfg.airMax ?? 0.65, (Z - (cfg.air0 ?? 6)) / (cfg.airD ?? 22))) * k);
  // ---------------------------------------------------------------- Voronoi (half-plane clipping; seeds [[s,t]])
  function voronoi(seeds, s0, s1, t0, t1, reach = 8) {
    const clip = (poly, a, b, c) => { const out = []; for (let i = 0; i < poly.length; i++) { const P1 = poly[i], P2 = poly[(i + 1) % poly.length], d1 = a * P1[0] + b * P1[1] - c, d2 = a * P2[0] + b * P2[1] - c; if (d1 <= 0) out.push(P1); if ((d1 <= 0) !== (d2 <= 0)) { const t = d1 / (d1 - d2); out.push([P1[0] + (P2[0] - P1[0]) * t, P1[1] + (P2[1] - P1[1]) * t]); } } return out; };
    return seeds.map((p, i) => { let poly = [[s0, t0], [s1, t0], [s1, t1], [s0, t1]]; for (let j = 0; j < seeds.length; j++) { if (j === i) continue; const q = seeds[j]; if (Math.abs(q[0] - p[0]) > reach || Math.abs(q[1] - p[1]) > reach) continue; const a = q[0] - p[0], b = q[1] - p[1], c = (q[0] * q[0] + q[1] * q[1] - p[0] * p[0] - p[1] * p[1]) / 2; poly = clip(poly, a, b, c); if (poly.length < 3) break; } return { seed: p, poly }; }).filter(c => c.poly.length >= 3);
  }
  // strata seeds: rows of uneven height, stones of uneven length; o.dip tilts the rows
  function strataSeeds(s0, s1, t0, t1, cw, rh, o = {}) {
    const out = []; let t = t0;
    while (t < t1 + rh) { const h = rh * (0.55 + R() * 0.9); let s = s0 - R() * cw; const lenK = 0.5 + R() * 1.0;
      while (s < s1 + cw) { const w = cw * lenK * (0.5 + R() * 1.1); out.push([s + w / 2 + (R() - 0.5) * w * 0.3, t + h / 2 + (R() - 0.5) * h * 0.5 + (o.dip || 0) * (s - s0) + Math.sin(s * 0.4 + t) * (o.wave || 0)]); s += w; }
      t += h; }
    return out;
  }
  // inset a polygon toward its centroid by d (plane units), then subdivide each edge with a jittered, broken run
  function breakEdge(poly, d, jit, sub = 3) {
    const n = poly.length, c = poly.reduce((m, p) => [m[0] + p[0] / n, m[1] + p[1] / n], [0, 0]);
    const ins = poly.map(p => { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dx / l * Math.min(d, l * 0.4), p[1] - dy / l * Math.min(d, l * 0.4)]; });
    const out = [];
    for (let i = 0; i < ins.length; i++) { const A = ins[i], B = ins[(i + 1) % ins.length], L = Math.hypot(B[0] - A[0], B[1] - A[1]); out.push(A);
      const m = Math.max(1, Math.round(sub * Math.min(2, L / (jit * 8 + 1e-6))));
      for (let k = 1; k < m; k++) { const u = k / m + (R() - 0.5) * 0.15, nx = -(B[1] - A[1]) / (L || 1), ny = (B[0] - A[0]) / (L || 1), j = (R() - 0.5) * jit * 2; out.push([A[0] + (B[0] - A[0]) * u + nx * j, A[1] + (B[1] - A[1]) * u + ny * j]); } }
    return out;
  }
  // ---------------------------------------------------------------- a rock face in a plane
  // at(s,t) -> [X,Y,Z]; o.cw stone length (m), o.rh course height (m), o.joint (m), o.col, o.dip, o.proud (0..1 share with a
  // cast shadow), o.lit (lit tint), o.cracks, o.pick (pick marks share), o.tint(s,t) -> extra colour mix [col, k]
  function stoneCells(at, Ls, Lt, col, o = {}) {
    const cw = o.cw || 1.2, rh = o.rh || 0.6, cells = voronoi(strataSeeds(0, Ls, 0, Lt, cw, rh, o), 0, Ls, 0, Lt, Math.max(cw, rh) * 4);
    let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, o.mortar ?? 0.72)}"/>`;
    const lit = o.lit || mix(col, '#f0e0b0', 0.16), dk = mix(col, INK, 0.28);
    let shadows = '', faces = '';
    const WX = require('./materials_v2')(S).begin(at, Ls, Lt, o.wx);   // materials v2: weathering per stone, runs/damp/cracks per plane
    for (const { seed, poly } of cells) {
      const pl = breakEdge(poly, o.joint ?? 0.035, Math.min(cw, rh) * 0.06), ps = pl.map(q => P(...at(q[0], q[1]))), Zc = at(seed[0], seed[1])[2];
      const bw = Math.abs(Math.max(...ps.map(p => p[0])) - Math.min(...ps.map(p => p[0]))); if (bw < 0.8) continue;
      const tilt = R(); let fill = tone(tilt > 0.72 ? lit : tilt < 0.25 ? dk : col, o.vary ?? 0.16);
      if (o.dimZ !== false) fill = dim(fill, Zc);
      if (o.tint) { const tt = o.tint(at(seed[0], seed[1]), seed[0], seed[1]); if (tt) fill = mix(fill, tt[0], Math.min(0.85, tt[1])); }
      const k = K(Zc);
      if (R() < (o.proud ?? 0.3)) { const off = Math.max(0.8, k * 0.035); shadows += `<path d="${p2(ps.map(([x, y]) => [x + off * 0.7, y + off]))}" fill="${INK}" opacity="0.55"/>`; }
      faces += cel(ps, { Z: Zc, fill, tex: 'url(#mottle)', texOp: 0.38, band: Math.max(S.minBand || 0.8, k * (o.band ?? 0.045)), inkW: Math.max(0.4, inkW(Zc) * 0.6), heavy: Math.max(0.6, S.inkH(Zc) * 0.45), ink: o.inkOp === undefined });
      if (o.inkOp !== undefined) faces += `<path d="${p2(ps)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Zc) * 0.6))}" stroke-opacity="${o.inkOp}" stroke-linejoin="round"/>`;
      if (tilt < 0.25) faces += `<path d="${p2(ps)}" fill="${hatchA(Zc)}" opacity="0.32"/>`;
      faces += WX.stoneNow(ps, Zc, fill, pl.map(q => at(q[0], q[1])), { joint: mix(col, INK, o.mortar ?? 0.72) });
      // cracks and pick marks inside the stone
      if (R() < (o.cracks ?? 0.22)) { const c0 = ps[Math.floor(R() * ps.length)], cx = ps.reduce((m, p) => m + p[0], 0) / ps.length, cy = ps.reduce((m, p) => m + p[1], 0) / ps.length; faces += `<path d="M${f1(c0[0])} ${f1(c0[1])} L${f1((c0[0] + cx) / 2 + (R() - 0.5) * 3)} ${f1((c0[1] + cy) / 2 + (R() - 0.5) * 3)} L${f1(cx + (R() - 0.5) * 4)} ${f1(cy + (R() - 0.5) * 4)}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Zc) * 0.5))}" fill="none" opacity="0.75"/>`; }
      if (R() < (o.pick ?? 0)) { const cx = ps.reduce((m, p) => m + p[0], 0) / ps.length, cy = ps.reduce((m, p) => m + p[1], 0) / ps.length; let pm = ''; for (let j = 0; j < 3; j++) pm += `M${f1(cx + (j - 1) * k * 0.05)} ${f1(cy - k * 0.04)} l${f1(k * 0.04)} ${f1(k * 0.08)} `; faces += `<path d="${pm}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, k * 0.008))}" opacity="0.5"/>`; }
    }
    return out + shadows + faces + WX.end();
  }
  // ---------------------------------------------------------------- a rock mass inside a screen outline
  // pts: outline (screen); Z for line weights; o.cell (px), o.dip (radians of strata), o.col, o.air (0..1 recession),
  // o.flank (0..1: share of the right side in shadow crosshatch), o.wet (sheen colour on lit tops)
  function rockMass(pts, Z, col, o = {}) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const c0 = o.air ? mix(col, AIR, o.air) : col, cid = S.id('rm'), outline = o.smooth ? smooth(pts, true, o.smooth) : p2(pts);
    let s = `<path d="${outline}" fill="${mix(c0, INK, 0.55)}"/><clipPath id="${cid}"><path d="${outline}"/></clipPath><g clip-path="url(#${cid})">`;
    const cell = o.cell || 40, dip = o.dip || 0, ca = Math.cos(dip), sa = Math.sin(dip);
    // seeds in a rotated frame: long along the strata
    const seeds = strataSeeds(-(x1 - x0) * 0.3, (x1 - x0) * 1.3, -(y1 - y0) * 0.3, (y1 - y0) * 1.3, cell, cell * (o.aspect ?? 0.55));
    const toS = ([u, v]) => [x0 + u * ca - v * sa, y0 + u * sa + v * ca];
    const cells = voronoi(seeds, -(x1 - x0) * 0.3, (x1 - x0) * 1.3, -(y1 - y0) * 0.3, (y1 - y0) * 1.3, cell * 4);
    const lit = o.lit || mix(c0, '#e8e4d8', 0.18), dk = mix(c0, INK, 0.3);
    let sh = '', fc = '';
    for (const { seed, poly } of cells) {
      const ps = breakEdge(poly, o.joint ?? cell * 0.04, cell * 0.05).map(toS), cx = ps.reduce((m, p) => m + p[0], 0) / ps.length, cy = ps.reduce((m, p) => m + p[1], 0) / ps.length;
      if (cx < x0 - cell || cx > x1 + cell || cy < y0 - cell || cy > y1 + cell) continue;
      const side = (cx - x0) / (x1 - x0 || 1), tilt = R() - (side > 1 - (o.flank ?? 0.35) ? 0.35 : 0) + (cy < y0 + (y1 - y0) * 0.2 ? 0.15 : 0);
      const fill = tone(tilt > 0.68 ? lit : tilt < 0.25 ? dk : c0, o.vary ?? 0.14);
      if (R() < (o.proud ?? 0.35)) sh += `<path d="${p2(ps.map(([x, y]) => [x + cell * 0.05, y + cell * 0.07]))}" fill="${INK}" opacity="0.5"/>`;
      fc += cel(ps, { Z, fill, tex: 'url(#mottle)', texOp: 0.4, band: Math.max(0.9, cell * 0.09), inkW: Math.max(0.45, inkW(Z) * 0.7) });
      if (tilt < 0.25) fc += `<path d="${p2(ps)}" fill="${hatchA(Z)}" opacity="0.35"/>`;
      if (o.wet && tilt > 0.6) fc += line(ps.slice(0, 3).map(([x, y]) => [x + 1, y + 1]), 0.8, o.wet, 0.45);
      if (R() < (o.cracks ?? 0.25)) { const a = ps[Math.floor(R() * ps.length)]; fc += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1((a[0] + cx) / 2 + (R() - 0.5) * cell * 0.1)} ${f1((a[1] + cy) / 2)} L${f1(cx)} ${f1(cy + cell * 0.1)}" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.7"/>`; }
    }
    s += sh + fc;
    s += require('./materials_v2')(S).rockSkin(pts, Z, c0, { noClip: true, cell: cell * (o.aspect ?? 0.55) * 1.4, dip, wx: o.wx });   // materials v2
    // the shadow flank: crosshatch on the side away from the light
    if (o.flank !== 0) s += `<path d="${p2([[x0 + (x1 - x0) * (1 - (o.flank ?? 0.35)), y0], [x1 + 5, y0], [x1 + 5, y1 + 5], [x0 + (x1 - x0) * (1 - (o.flank ?? 0.35) * 1.4), y1 + 5]])}" fill="${hatchB(Z)}" opacity="${o.flankOp ?? 0.4}"/>`;
    if (o.foot) s += `<rect x="${f1(x0)}" y="${f1(y1 - (y1 - y0) * o.foot)}" width="${f1(x1 - x0)}" height="${f1((y1 - y0) * o.foot + 4)}" fill="${o.footCol || INK}" opacity="${o.footOp ?? 0.35}"/>`;
    if (o.airOp) s += `<path d="${outline}" fill="${AIR}" opacity="${o.airOp}"/>`;
    s += `</g><path d="${outline}" fill="none" stroke="${INK}" stroke-width="${f1(o.ink ?? Math.max(0.9, S.inkH(Z) * 0.7))}" stroke-linejoin="round"/>`;
    // lit rim along the upper-left edges
    let rim = ''; for (let i = 0; i < pts.length; i++) { const A = pts[i], B = pts[(i + 1) % pts.length], nx = B[1] - A[1], ny = -(B[0] - A[0]), l = Math.hypot(nx, ny) || 1; if ((-nx / l) * 0.6 + (-ny / l) * 0.8 > 0.4) rim += `M${f1(A[0] + 1.2)} ${f1(A[1] + 1.4)} L${f1(B[0] + 1.2)} ${f1(B[1] + 1.4)} `; }
    if (rim && o.rim !== false) s += `<path d="${rim}" stroke="${o.rimCol || mix(c0, '#fff4d8', 0.45)}" stroke-width="${f1(o.rimW || 1)}" fill="none" opacity="${o.rimOp ?? 0.5}" stroke-linecap="round"/>`;
    return s;
  }
  // ---------------------------------------------------------------- smooth rock (flowstone, sea-worn rock)
  // a soft-edged rock form from a screen outline: no cells; ribbons of tone run along o.dir ('v' flowstone, 'h' sea-worn
  // strata), lighter on the lit (left/upper) side and darker toward the shadow side, ridges inked, the shadow third in
  // crosshatch, a lit rim; o.under: a lit band along the bottom (light from below), o.ring: flow ledges across
  function smoothRock(pts, Z, col, o = {}) {
    const d = smooth(pts, true, o.k ?? 0.4), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), cid = S.id('sm');
    const lit = o.lit || mix(col, '#f0e0c0', 0.2), dk = mix(col, INK, 0.35), vert = (o.dir || 'v') === 'v';
    let s = `<path d="${d}" fill="${col}"/><clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})"><path d="${d}" fill="url(#mottle)" opacity="0.45"/>`;
    const L0 = vert ? x0 : y0, L1 = vert ? x1 : y1, M0 = vert ? y0 : x0, M1 = vert ? y1 : x1;
    for (let u = L0 - 4; u < L1 + 4;) { const w = (o.rib || 8) * (0.5 + R() * 1.1), f = (u - L0) / (L1 - L0 || 1), ph = R() * 6;
      const tn = f < 0.3 ? lit : f > 0.62 ? dk : col, c = tone(mix(col, tn, 0.3 + R() * 0.5), 0.08), a = [], b = [];
      for (let m = M0 - 4; m <= M1 + 8; m += 8) { const wob = Math.sin(m * 0.04 + ph) * (o.wave ?? 2.2); a.push(vert ? [u + wob, m] : [m, u + wob]); b.push(vert ? [u + w + wob * 0.8, m] : [m, u + w + wob * 0.8]); }
      s += `<path d="${smooth([...a, ...b.reverse()], true, 0.5)}" fill="${c}" opacity="0.75"/>`;
      if (R() < 0.6) s += line(a.slice(0, a.length), Math.max(0.5, inkW(Z) * 0.6), INK, 0.4);
      if (f < 0.4 && R() < 0.5) s += line(a.map(([x, y]) => vert ? [x + 1.2, y] : [x, y + 1.2]), 0.7, lit, 0.35);
      u += w; }
    for (let i = 0; i < (o.ring || 0); i++) { const yy = y0 + (y1 - y0) * (0.15 + R() * 0.8), pts2 = []; for (let x = x0 - 4; x <= x1 + 4; x += 6) pts2.push([x, yy + Math.sin(x * 0.08 + i) * 2 + ((x - x0) / (x1 - x0 || 1) - 0.5) * 6]); s += line(pts2, 1, INK, 0.5) + line(pts2.map(([x, y]) => [x, y + 1.3]), 0.7, lit, 0.4); }
    s += require('./materials_v2')(S).rockSkin(pts, Z, col, { noClip: true, strata: false, wx: o.wx });   // materials v2 (v2.1: large outlines handled at the source, no size guard needed): pits, tafoni, lichen, runs (no strata on flowstone)
    s += `<path d="${p2([[x0 + (x1 - x0) * (1 - (o.flank ?? 0.35)), y0 - 5], [x1 + 5, y0 - 5], [x1 + 5, y1 + 5], [x0 + (x1 - x0) * (1 - (o.flank ?? 0.35) * 1.3), y1 + 5]])}" fill="${hatchB(Z)}" opacity="${o.flankOp ?? 0.45}"/>`;
    if (o.under) s += `<path d="${p2([[x0 - 5, y1 - (y1 - y0) * o.under], [x1 + 5, y1 - (y1 - y0) * o.under * 0.7], [x1 + 5, y1 + 5], [x0 - 5, y1 + 5]])}" fill="${o.underCol || '#e8902a'}" opacity="${o.underOp ?? 0.25}"/>`;
    if (o.airOp) s += `<path d="${d}" fill="${o.airCol || AIR}" opacity="${o.airOp}"/>`;
    s += `</g><path d="${d}" fill="none" stroke="${INK}" stroke-width="${f1(o.ink ?? Math.max(0.9, S.inkH(Z) * 0.7))}" stroke-linejoin="round"/>`;
    let rim = ''; for (let i = 0; i < pts.length; i++) { const A = pts[i], B = pts[(i + 1) % pts.length], nx = B[1] - A[1], ny = -(B[0] - A[0]), l = Math.hypot(nx, ny) || 1; if ((-nx / l) * 0.6 + (-ny / l) * 0.8 > 0.4) rim += `M${f1(A[0] + 1.2)} ${f1(A[1] + 1.4)} L${f1(B[0] + 1.2)} ${f1(B[1] + 1.4)} `; }
    if (rim && o.rim !== false) s += `<path d="${rim}" stroke="${o.rimCol || lit}" stroke-width="${f1(o.rimW || 1.1)}" fill="none" opacity="${o.rimOp ?? 0.5}" stroke-linecap="round"/>`;
    return s;
  }
  // ---------------------------------------------------------------- timber
  function timber(A, B, w, o = {}) {
    const a = P(...A), b = P(...B), Z = (A[2] + B[2]) / 2, k = K(Z) * w / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * k, ny = dx / l * k;
    const pts = [[a[0] + nx, a[1] + ny], [b[0] + nx * 0.92, b[1] + ny * 0.92], [b[0] - nx * 0.92, b[1] - ny * 0.92], [a[0] - nx, a[1] - ny]];
    const col = o.noDim ? (o.col || '#4e3e28') : dim(o.col || '#4e3e28', Z);
    let s = cel(pts, { Z, fill: tone(col, 0.12), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(1, k * 0.6) });
    for (let j = 0; j < 3; j++) { const u = 0.25 + j * 0.25 + (R() - 0.5) * 0.1; s += `<path d="M${f1(a[0] + nx * (1 - 2 * u))} ${f1(a[1] + ny * (1 - 2 * u))} L${f1(b[0] + nx * (1 - 2 * u) * 0.9)} ${f1(b[1] + ny * (1 - 2 * u) * 0.9)}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, k * 0.06))}" opacity="0.45" stroke-dasharray="${f1(6 + R() * 10)} ${f1(2 + R() * 3)}"/>`; }
    if (o.char !== undefined) { const u0 = o.char, c0 = [a[0] + dx * u0, a[1] + dy * u0], cp = [[c0[0] + nx * 1.05, c0[1] + ny * 1.05], [b[0] + nx * 1.05, b[1] + ny * 1.05], [b[0] - nx * 1.05, b[1] - ny * 1.05], [c0[0] - nx * 1.05, c0[1] - ny * 1.05]];
      s += `<path d="${polyS(cp)}" fill="#14100a" opacity="0.88"/><path d="${polyS(cp)}" fill="${hatchB(Z)}" opacity="0.35"/>`;
      let u = u0 + 0.02, chk = '', hot = '';
      while (u < 0.98) { const st = k * (0.5 + R() * 0.7) / l, x = a[0] + dx * u, y = a[1] + dy * u, j1 = (R() - 0.5) * 0.3, j2 = (R() - 0.5) * 0.3;
        const p1 = [x + nx * 0.95 + dx / l * k * j1, y + ny * 0.95 + dy / l * k * j1], q2 = [x - nx * 0.95 + dx / l * k * j2, y - ny * 0.95 + dy / l * k * j2];
        chk += `M${f1(p1[0])} ${f1(p1[1])} L${f1((p1[0] + q2[0]) / 2 + (R() - 0.5) * k * 0.2)} ${f1((p1[1] + q2[1]) / 2)} L${f1(q2[0])} ${f1(q2[1])} `;
        if (R() < (o.hotP ?? 0.25)) hot += `M${f1(p1[0] - nx * 0.3)} ${f1(p1[1] - ny * 0.3)} L${f1(x)} ${f1(y)} `;
        u += st; }
      s += `<path d="${chk}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, k * 0.12))}" fill="none"/>` + (hot && o.hot !== false ? EM(`<path d="${hot}" stroke="${o.hotCol || '#ff8a2a'}" stroke-width="${f1(Math.max(0.5, k * 0.07))}" fill="none" opacity="0.85"/>`) : ''); }
    if (o.bloom) { const u = o.bloom, x = a[0] + dx * u, y = a[1] + dy * u; s += stain(x, y, k * 1.3, dim('#a89030', Z, 0.4), 0.55) + BK.sulphur(x, y, k * 0.8, 3, { size: Math.max(1, k * 0.25), col: dim('#c8b040', Z, 0.4) }); }
    if (o.wet) s += `<path d="M${f1(a[0] + nx * 0.6)} ${f1(a[1] + ny * 0.6)} L${f1(b[0] + nx * 0.6)} ${f1(b[1] + ny * 0.6)}" stroke="${o.wet}" stroke-width="${f1(Math.max(0.5, k * 0.12))}" opacity="0.4"/>`;
    return s;
  }
  // ---------------------------------------------------------------- props in screen space
  function oilLamp(x, y, s, lit, o = {}) {
    let out = `<path d="M${f1(x)} ${f1(y - s * 1.1)} q${f1(s * 0.5)} ${f1(-s * 0.3)} ${f1(s * 0.3)} ${f1(s * 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.12))}" fill="none"/>`;
    out += cel([[x - s * 0.6, y - s * 0.3], [x + s * 0.5, y - s * 0.3], [x + s * 0.9, y - s * 0.45], [x + s * 0.4, y + s * 0.15], [x - s * 0.45, y + s * 0.15]], { Z: 12, fill: '#3a3430', band: 0.8, inkW: 0.6 });
    if (lit) out += EM(`<path d="M${f1(x + s * 0.85)} ${f1(y - s * 0.45)} q${f1(-s * 0.25)} ${f1(-s * 0.4)} ${f1(s * 0.05)} ${f1(-s * 0.95)} q${f1(s * 0.3)} ${f1(s * 0.5)} ${f1(-s * 0.05)} ${f1(s * 0.95)} Z" fill="${o.col || '#e8902a'}" stroke="${INK}" stroke-width="0.4"/><path d="M${f1(x + s * 0.83)} ${f1(y - s * 0.6)} l${f1(s * 0.02)} ${f1(-s * 0.4)}" stroke="#ffe0a0" stroke-width="${f1(Math.max(0.4, s * 0.12))}"/>`) + glow(x + s * 0.8, y - s * 0.8, s * (o.gr || 3.5), s * (o.gr || 3.5) * 0.85, o.col || '#e8902a', o.gop ?? 0.22);
    return out;
  }
  // a flame of several tongues: ink-edged outer tongue, a hotter inner tongue, a pale core; leans with o.lean
  function flame(x, y, h, w, o = {}) {
    const cols = o.cols || ['#c8541a', '#f09a30', '#ffe6a8'], lean = o.lean || 0; let s = '';
    const tongue = (cx, hh, ww, col, ink) => { const tip = [cx + lean * hh + (R() - 0.5) * ww * 0.4, y - hh]; const pts = [[cx - ww / 2, y], [cx - ww * 0.55, y - hh * 0.3], [cx - ww * 0.25 + lean * hh * 0.4, y - hh * 0.62], tip, [cx + ww * 0.3 + lean * hh * 0.5, y - hh * 0.55], [cx + ww * 0.5, y - hh * 0.25], [cx + ww / 2, y]];
      return `<path d="${smooth(pts, true, 0.55)}" fill="${col}"${ink ? ` stroke="${INK}" stroke-width="${f1(Math.max(0.4, ww * 0.04))}"` : ''}/>`; };
    const n = o.n || 3;
    for (let i = 0; i < n; i++) { const cx = x + (i - (n - 1) / 2) * w * 0.28 + (R() - 0.5) * w * 0.1, hh = h * (i === Math.floor(n / 2) ? 1 : 0.55 + R() * 0.35); s += tongue(cx, hh, w * 0.55, cols[0], true); }
    s += tongue(x, h * 0.72, w * 0.55, cols[1], false) + tongue(x, h * 0.4, w * 0.3, cols[2], false);
    return EM(s) + (o.glow === false ? '' : glow(x, y - h * 0.4, w * (o.gr || 3), h * (o.gr || 3) * 0.6, o.gcol || cols[1], o.gop ?? 0.28));
  }
  // a real fire (props_li.fire, the figure engine's joined curling tongues) standing at a world point, w x h metres; written
  // straight into the current layer (emissive), plus a painted glow. o.blue: the storm's blue coal fire
  function fireAt(X, Y, Z, w, h, o = {}) {
    S.figProp(X, Y, Z, (f, u) => { if (o.recol) { const of = f.flat.bind(f); f.flat = (pts, c, oo) => of(pts, o.recol[c] || c, oo); PR.fire(f, w * u, h * u, { n: o.n || 7, licks: o.licks }); f.flat = of; } else PR.fire(f, w * u, h * u, { n: o.n || 7, licks: o.licks }); }, { em: true });
    if (o.glow !== false) { const [x, y] = P(X, Y + h * 0.4, Z), k = K(Z); S.raw(glow(x, y, k * w * (o.gr || 3), k * h * (o.gr || 3) * 0.8, o.gcol || '#f09a30', o.gop ?? 0.3)); }
  }
  // sparks: short hot streaks rising (never arcs)
  function sparks(n, x0, x1, y0, y1, cols = ['#ffe6a8', '#ff9a3a'], o = {}) { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0), l = (o.len || 5) * (0.5 + R()), a = (o.ang ?? -1.4) + (R() - 0.5) * 0.8; s += `<path d="M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}" stroke="${cols[i % cols.length]}" stroke-width="${f1((o.w || 0.8) * (0.6 + R() * 0.6))}" stroke-linecap="round" opacity="${f1(0.6 + R() * 0.4)}"/>`; } return EM(s); }
  // a canary cage: domed wire cage on a hook, a bird inside (dead: on its back, or alive: on the perch)
  function cage(x, y, s, o = {}) {
    let out = `<path d="M${f1(x)} ${f1(y - s * 1.5)} L${f1(x)} ${f1(y - s * 1.05)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.06))}"/><circle cx="${f1(x)}" cy="${f1(y - s * 1.05)}" r="${f1(s * 0.08)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.4, s * 0.04))}"/>`;
    const col = o.col || '#6a5a3a', bars = 7;
    out += `<path d="M${f1(x - s * 0.5)} ${f1(y)} L${f1(x - s * 0.5)} ${f1(y - s * 0.55)} Q${f1(x)} ${f1(y - s * 1.15)} ${f1(x + s * 0.5)} ${f1(y - s * 0.55)} L${f1(x + s * 0.5)} ${f1(y)} Z" fill="${INK}" opacity="0.25"/>`;
    for (let i = 1; i < bars; i++) { const u = i / bars, bx = x - s * 0.5 + s * u; const top = y - s * 0.55 - Math.sin(u * Math.PI) * s * 0.42; out += `<path d="M${f1(bx)} ${f1(y)} L${f1(bx)} ${f1(top)}" stroke="${col}" stroke-width="${f1(Math.max(0.35, s * 0.035))}"/>`; }
    out += `<path d="M${f1(x - s * 0.5)} ${f1(y)} L${f1(x - s * 0.5)} ${f1(y - s * 0.55)} Q${f1(x)} ${f1(y - s * 1.15)} ${f1(x + s * 0.5)} ${f1(y - s * 0.55)} L${f1(x + s * 0.5)} ${f1(y)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.06))}"/><path d="M${f1(x - s * 0.55)} ${f1(y)} L${f1(x + s * 0.55)} ${f1(y)}" stroke="${INK}" stroke-width="${f1(Math.max(0.8, s * 0.12))}"/><path d="M${f1(x - s * 0.5)} ${f1(y - s * 0.3)} L${f1(x + s * 0.5)} ${f1(y - s * 0.3)}" stroke="${col}" stroke-width="${f1(Math.max(0.35, s * 0.04))}"/>`;
    const bird = o.bird || '#d8c040';
    if (o.dead !== false) out += `<ellipse cx="${f1(x + s * 0.05)}" cy="${f1(y - s * 0.09)}" rx="${f1(s * 0.2)}" ry="${f1(s * 0.09)}" fill="${bird}" stroke="${INK}" stroke-width="${f1(Math.max(0.3, s * 0.03))}"/><path d="M${f1(x)} ${f1(y - s * 0.16)} l${f1(-s * 0.03)} ${f1(-s * 0.08)} M${f1(x + s * 0.08)} ${f1(y - s * 0.16)} l${f1(s * 0.02)} ${f1(-s * 0.08)}" stroke="${INK}" stroke-width="${f1(Math.max(0.3, s * 0.025))}"/>`;
    else out += `<ellipse cx="${f1(x)}" cy="${f1(y - s * 0.42)}" rx="${f1(s * 0.11)}" ry="${f1(s * 0.15)}" fill="${bird}" stroke="${INK}" stroke-width="${f1(Math.max(0.3, s * 0.03))}"/>`;
    return out;
  }
  // a powder keg standing (screen centre-bottom x,y, height h px): staves, iron hoops, a chalked mark
  function keg(x, y, h, o = {}) {
    const w = h * 0.72, bul = w * 0.08, col = o.col || '#5a4228';
    const pts = [[x - w / 2, y], [x - w / 2 - bul, y - h * 0.5], [x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2 + bul, y - h * 0.5], [x + w / 2, y]];
    let s = cel(pts, { Z: o.Z || 8, fill: tone(col, 0.15), tex: 'url(#mottle)', texOp: 0.5, band: w * 0.22 });
    for (let j = 1; j < 5; j++) { const u = j / 5; s += `<path d="M${f1(x - w / 2 + w * u)} ${f1(y - h + 1)} Q${f1(x - w / 2 + w * u + (u - 0.5) * bul * 2)} ${f1(y - h / 2)} ${f1(x - w / 2 + w * u)} ${f1(y - 1)}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.6"/>`; }
    for (const v of [0.12, 0.3, 0.7, 0.88]) { const yy = y - h * v, ww = w / 2 + bul * Math.sin(v * Math.PI); s += `<path d="M${f1(x - ww)} ${f1(yy)} Q${f1(x)} ${f1(yy + h * 0.04)} ${f1(x + ww)} ${f1(yy)}" stroke="${INK}" stroke-width="${f1(Math.max(1, h * 0.06))}" fill="none"/><path d="M${f1(x - ww)} ${f1(yy - 0.6)} Q${f1(x)} ${f1(yy + h * 0.04 - 0.6)} ${f1(x)} ${f1(yy + h * 0.02 - 0.6)}" stroke="#7a7068" stroke-width="${f1(Math.max(0.4, h * 0.02))}" fill="none" opacity="0.6"/>`; }
    if (o.mark) s += `<path d="M${f1(x - w * 0.15)} ${f1(y - h * 0.58)} l${f1(w * 0.3)} ${f1(-h * 0.1)} M${f1(x - w * 0.05)} ${f1(y - h * 0.62)} l${f1(w * 0.05)} ${f1(h * 0.12)}" stroke="#d8d0b8" stroke-width="${f1(Math.max(0.5, h * 0.03))}" opacity="0.7"/>`;
    if (o.top) s += `<ellipse cx="${f1(x)}" cy="${f1(y - h)}" rx="${f1(w / 2)}" ry="${f1(h * 0.08)}" fill="${mix(col, '#c8b090', 0.2)}" stroke="${INK}" stroke-width="0.8"/>`;
    return s;
  }
  // a horn-paned iron storm lantern on its ring (screen)
  function lantern(x, y, s, o = {}) {
    const LY = o.col || '#e8c860';
    let out = `<path d="M${f1(x)} ${f1(y - s * 1.2)} L${f1(x)} ${f1(y - s * 0.6)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.1))}"/>`;
    out += `<path d="M${f1(x - s * 0.4)} ${f1(y - s * 0.6)} L${f1(x + s * 0.4)} ${f1(y - s * 0.6)} L${f1(x)} ${f1(y - s * 0.95)} Z" fill="#2a2a2c" stroke="${INK}" stroke-width="0.6"/>`;
    out += EM(`<rect x="${f1(x - s * 0.33)}" y="${f1(y - s * 0.6)}" width="${f1(s * 0.66)}" height="${f1(s * 0.9)}" fill="${o.lit === false ? '#3a3a30' : LY}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.08))}"/>` + (o.lit === false ? '' : `<path d="M${f1(x - s * 0.15)} ${f1(y - s * 0.5)} l0 ${f1(s * 0.7)}" stroke="#fff4c8" stroke-width="${f1(Math.max(0.5, s * 0.1))}" opacity="0.8"/>`));
    out += `<path d="M${f1(x)} ${f1(y - s * 0.6)} L${f1(x)} ${f1(y + s * 0.3)} M${f1(x - s * 0.4)} ${f1(y + s * 0.3)} L${f1(x + s * 0.4)} ${f1(y + s * 0.3)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.08))}"/>`;
    if (o.lit !== false) out += glow(x, y - s * 0.15, s * (o.r || 5), s * (o.r || 5) * 0.8, LY, o.gop ?? 0.25);
    return out;
  }
  // ---------------------------------------------------------------- sky
  // a storm cloud from overlapping lobes (sizes vary, never a stripe): base tone, a lit crown upper left, a banded dark belly
  // with hatch, a broken ink contour on the shadow side. o.lit (rim colour), o.dark (belly colour), o.flat (belly flatness)
  function cloudMass(cx, cy, w, h, col, o = {}) {
    const n = o.n || Math.max(4, Math.round(w / (h * 0.7))), lobes = [];
    for (let i = 0; i < n; i++) { const u = n === 1 ? 0.5 : i / (n - 1), r = h * (0.35 + R() * 0.45) * (1 - Math.abs(u - (o.peak ?? 0.4)) * 0.6); lobes.push([cx - w / 2 + w * u + (R() - 0.5) * w * 0.08, cy - r * 0.55 + (R() - 0.5) * h * 0.15, r]); }
    // outline: sample the union's top edge, flat-ish belly
    const top = []; for (let x = cx - w / 2 - h * 0.2; x <= cx + w / 2 + h * 0.2; x += Math.max(3, w / 60)) { let y = cy; for (const [lx, ly, r] of lobes) { const d = x - lx; if (Math.abs(d) < r) y = Math.min(y, ly - Math.sqrt(r * r - d * d)); } top.push([x, y + (R() - 0.5) * 1.2]); }
    const bellyY = cy + h * (o.belly ?? 0.18), bot = []; for (let x = cx + w / 2 + h * 0.2; x >= cx - w / 2 - h * 0.2; x -= w / 10) bot.push([x, bellyY + Math.sin(x * 0.05) * h * 0.05 + (R() - 0.5) * h * 0.06]);
    const outl = [...top.filter(p => p[1] < cy + 0.1), ...bot], cid = S.id('cl');
    let s = `<path d="${smooth(outl, true, 0.5)}" fill="${col}" opacity="${o.op ?? 1}"/><clipPath id="${cid}"><path d="${smooth(outl, true, 0.5)}"/></clipPath><g clip-path="url(#${cid})">`;
    // inner lobes: each lobe's lower-right crescent shaded, upper-left crescent lit (turning the billows)
    for (const [lx, ly, r] of lobes) {
      s += `<ellipse cx="${f1(lx + r * 0.22)}" cy="${f1(ly + r * 0.3)}" rx="${f1(r * 0.95)}" ry="${f1(r * 0.8)}" fill="${o.dark || mix(col, INK, 0.35)}" opacity="0.55"/>`;
      s += `<ellipse cx="${f1(lx - r * 0.08)}" cy="${f1(ly - r * 0.05)}" rx="${f1(r * 0.78)}" ry="${f1(r * 0.68)}" fill="${col}" opacity="0.92"/>`;
      s += `<path d="M${f1(lx - r * 0.85)} ${f1(ly + r * 0.05)} A${f1(r * 0.85)} ${f1(r * 0.8)} 0 0 1 ${f1(lx + r * 0.25)} ${f1(ly - r * 0.75)}" stroke="${o.lit || mix(col, '#f0f0e8', 0.4)}" stroke-width="${f1(Math.max(0.6, r * 0.035))}" fill="none" opacity="${o.litOp ?? 0.35}" stroke-dasharray="${f1(r * 0.5)} ${f1(r * 0.2)}"/>`;
      s += `<path d="M${f1(lx + r * 0.2)} ${f1(ly + r * 0.72)} A${f1(r * 0.9)} ${f1(r * 0.8)} 0 0 0 ${f1(lx + r * 0.9)} ${f1(ly)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, r * 0.025))}" fill="none" opacity="0.45" stroke-dasharray="${f1(r * 0.3)} ${f1(r * 0.12)}"/>`;
    }
    s += `<rect x="${f1(cx - w)}" y="${f1(bellyY - h * 0.25)}" width="${f1(w * 2)}" height="${f1(h)}" fill="${o.dark || mix(col, INK, 0.4)}" opacity="0.5"/><rect x="${f1(cx - w)}" y="${f1(bellyY - h * 0.2)}" width="${f1(w * 2)}" height="${f1(h)}" fill="${hatchA(30)}" opacity="0.3"/>`;
    s += `</g>`;
    s += `<path d="${smooth(top, false, 0.5)}" stroke="${INK}" stroke-width="${f1(o.ink || 0.8)}" fill="none" opacity="0.5" stroke-dasharray="${f1(18 + R() * 20)} ${f1(4 + R() * 8)}"/>`;
    return s;
  }
  // ---------------------------------------------------------------- air and recession
  // a ragged translucent band of the air colour over everything drawn so far between y0 and y1 (screen)
  function veil(y0, y1, op, col = AIR, o = {}) {
    const top = [], bot = []; for (let x = -10; x <= W + 20; x += 30 + R() * 30) { top.push([x, y0 + Math.sin(x * 0.01 + (o.ph || 0)) * (o.amp ?? 6) + (R() - 0.5) * 4]); bot.push([x, y1 + Math.sin(x * 0.013 + 2) * (o.amp ?? 6)]); }
    return `<path d="${smooth([...top, ...bot.reverse()], true, 0.5)}" fill="${col}" opacity="${op}"/>`;
  }
  // the value plan's dark frame: stepped ragged vignettes of the murk round a light focus (cx, cy) with radii rx, ry; each
  // step a full-frame shape with a ragged elliptical hole, the holes growing smaller and the tone building toward the edges
  function frameDark(cx, cy, rx, ry, steps = [[1.0, 0.22], [0.8, 0.2], [0.62, 0.18]], col = MURK) {
    // polish round: a smooth radial vignette (the stepped elliptical holes left hard pale ovals). Each step [m, op] adds op of
    // darkness outside m x the radii; the gradient ramps through them smoothly.
    const g = S.id('fd'), st = steps.slice().sort((a, b) => a[0] - b[0]); let acc = 0; const stops = [[0, 0]];
    for (const [m, op] of st) { stops.push([Math.min(0.98, m * 0.7), acc]); acc = 1 - (1 - acc) * (1 - op); stops.push([Math.min(0.99, m * 0.98), acc]); }
    stops.push([1, Math.min(0.92, acc * 1.15)]);
    S.DEFS.push(`<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rx)}" gradientTransform="translate(${f1(cx)} ${f1(cy)}) scale(1 ${(ry / rx).toFixed(3)}) translate(${f1(-cx)} ${f1(-cy)})">${stops.map(([t, a]) => `<stop offset="${t.toFixed(3)}" stop-color="${col}" stop-opacity="${a.toFixed(3)}"/>`).join('')}</radialGradient>`);
    return `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="url(#${g})"/>`;
  }
  // ---------------------------------------------------------------- floors
  // cracks running in a floor plane toward the horizon (perspective lines), splitting and wandering; at(s,t) with t into depth
  function floorCracks(at, s0, s1, t0, t1, n, o = {}) {
    let s = '';
    for (let i = 0; i < n; i++) { let ss = s0 + R() * (s1 - s0), tt = t0 + R() * (t1 - t0) * 0.3; const pts = [], dir = (o.toward ?? 0) - ss, L = (t1 - t0) * (0.25 + R() * 0.5);
      for (let k = 0; k <= 8; k++) { pts.push(P(...at(ss, tt))); tt += L / 8; ss += dir * 0.02 + (R() - 0.5) * 0.18; }
      const Z = at(ss, tt)[2]; s += line(pts, Math.max(0.5, inkW(Z) * 1.2), INK, 0.8) + line(pts.map(([x, y]) => [x, y + 1]), 0.6, o.lip || '#8a8070', 0.35);
      if (R() < 0.5) { const j = 2 + Math.floor(R() * 4); const br = [pts[j]]; let bx = pts[j][0], by = pts[j][1]; for (let k = 0; k < 4; k++) { bx += (R() - 0.3) * 14; by += 1 + R() * 3; br.push([bx, by]); } s += line(br, 0.6, INK, 0.65); } }
    return s;
  }
  // a puddle on a floor plane: dark, an inked rim, broken reflection strokes of o.refl colours, a rain ring or two
  function puddle(at, s, t, ws, wt, o = {}) {
    const ring = []; for (let k = 0; k < 14; k++) { const a = k / 14 * 6.28, m = 0.75 + R() * 0.35; ring.push(P(...at(s + Math.cos(a) * ws / 2 * m, t + Math.sin(a) * wt / 2 * m))); }
    const [x, y] = P(...at(s, t)), w = Math.max(...ring.map(p => p[0])) - Math.min(...ring.map(p => p[0]));
    let out = `<path d="${smooth(ring, true, 0.6)}" fill="${o.col || '#0a0c10'}" opacity="${o.op ?? 0.75}"/><path d="${smooth(ring, true, 0.6)}" fill="none" stroke="${INK}" stroke-width="0.6" opacity="0.6"/>`;
    for (const c of o.refl || ['#c8d0d8']) for (let j = 0; j < 3; j++) out += `<path d="M${f1(x - w * 0.35 + R() * w * 0.4)} ${f1(y + (R() - 0.5) * 2)} l${f1(w * (0.1 + R() * 0.25))} 0" stroke="${c}" stroke-width="${f1(0.7 + R() * 0.6)}" opacity="${f1(0.3 + R() * 0.3)}"/>`;
    if (o.rings !== false) out += BK.ripples(x + (R() - 0.5) * w * 0.3, y, w * 0.12, 2, o.ringCol || '#c8d0d8', 0.4);
    return out;
  }
  // ---------------------------------------------------------------- sea
  // a sea plane (Y = 0 + o.y) from Z z0 to z1 across X x0..x1: base, wave rows that converge with the camera (each row a run
  // of crest strokes: dark trough under, lit lip on top), foam streaks, o.refl glare columns
  function sea(x0, x1, z0, z1, col, o = {}) {
    const Y = o.y || 0; let s = `<path d="${pp([[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]])}" fill="${col}"/><path d="${pp([[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]])}" fill="url(#mottle)" opacity="0.4"/>`;
    for (let Z = z1; Z > z0; Z /= 1 + (o.step || 0.07)) {
      const k = K(Z), amp = Math.max(0.4, k * (o.amp || 0.12)); let X = x0 - R() * 3;
      while (X < x1) { const L = (2 + R() * 5) * (Z / 20 + 0.6), a = P(X, Y, Z), b = P(X + L, Y, Z); if (b[0] > -30 && a[0] < W + 30) {
          const mid = [(a[0] + b[0]) / 2, a[1] - amp];
          s += `<path d="M${f1(a[0])} ${f1(a[1])} Q${f1(mid[0])} ${f1(mid[1] - amp * 0.5)} ${f1(b[0])} ${f1(b[1])}" stroke="${mix(col, INK, 0.5)}" stroke-width="${f1(Math.max(0.5, amp * 0.6))}" fill="none" opacity="0.6"/>`;
          if (R() < (o.lip ?? 0.55)) s += `<path d="M${f1(a[0] + (b[0] - a[0]) * 0.2)} ${f1(a[1] - amp * 0.7)} Q${f1(mid[0])} ${f1(mid[1] - amp * 0.9)} ${f1(b[0] - (b[0] - a[0]) * 0.25)} ${f1(b[1] - amp * 0.6)}" stroke="${o.lit || mix(col, '#e8ecea', 0.45)}" stroke-width="${f1(Math.max(0.4, amp * 0.35))}" fill="none" opacity="${f1(0.4 + R() * 0.3)}"/>`;
          if (R() < (o.foam ?? 0.12)) s += `<path d="M${f1(a[0])} ${f1(a[1] - amp * 0.4)} l${f1((b[0] - a[0]) * 0.6)} ${f1(-amp * 0.2)}" stroke="#e8ecea" stroke-width="${f1(Math.max(0.6, amp * 0.6))}" opacity="0.6" stroke-linecap="round"/>`; }
        X += L * (1 + R() * 0.8); }
    }
    return s;
  }
  // light tint: lights [{p:[X,Y,Z], col, r (m), k (0..1)}] -> fn([X,Y,Z]) -> [col, k] (the strongest, falling off with distance;
  // stepped in 3 values so it reads as cel light, not a gradient)
  function lightTint(lights) {
    return q => { let best = null, bk = 0; for (const L of lights) { const d = Math.hypot(q[0] - L.p[0], (q[1] - L.p[1]) * (L.yk ?? 1), (q[2] - L.p[2]) * (L.zk ?? 1)); let k = L.k * Math.max(0, 1 - d / L.r); k = Math.round(k * 4) / 4; if (k > bk) { bk = k; best = L.col; } } return best ? [best, bk] : null; };
  }

  // ================================================================ polish round (Cole's review): atmosphere, skies, stone
  // soft atmosphere: lobed masses blurred (gradient falloff is allowed for steam, smoke, cloud, fog and glows); one blur
  // filter per radius, defined once
  const BLUR = {};
  const blurId = r => { const k = Math.round(r); if (!BLUR[k]) { BLUR[k] = S.id('bl'); S.DEFS.push(`<filter id="${BLUR[k]}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${k}"/></filter>`); } return BLUR[k]; };
  const blob = (cx, cy, rx, ry, n = 11, jag = 0.35) => { const o = []; const ph = R() * 6; for (let k = 0; k < n; k++) { const a = k / n * 6.283, m = 1 - jag / 2 + R() * jag + 0.12 * Math.sin(a * 2 + ph); o.push([cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m]); } return o; };
  // a soft cloud or smoke mass: lobes of different sizes blurred together, a lit crown on the key side, a darker belly;
  // wisps tearing off the edge. o.lit, o.dark, o.op, o.blur, o.wisps
  function softMass(cx, cy, w, h, col, o = {}) {
    const n = o.n || Math.max(3, Math.round(w / (h * 0.8))), b = o.blur ?? Math.max(2, h * 0.12), op = o.op ?? 0.8; let s = '';
    const lobes = []; for (let i = 0; i < n; i++) { const u = n === 1 ? 0.5 : i / (n - 1), r = h * (0.3 + R() * 0.5) * (1 - Math.abs(u - (o.peak ?? 0.45)) * 0.7); lobes.push([cx - w / 2 + w * u + (R() - 0.5) * w * 0.1, cy - r * 0.3 + (R() - 0.5) * h * 0.2, r * (1.2 + R() * 0.6), r]); }
    let body = '', belly = '', crown = '';
    for (const [x, y, rx, ry] of lobes) { body += `<path d="${smooth(blob(x, y, rx, ry), true, 0.8)}"/>`; belly += `<path d="${smooth(blob(x + rx * 0.15, y + ry * 0.35, rx * 0.85, ry * 0.6), true, 0.8)}"/>`; crown += `<path d="${smooth(blob(x - rx * 0.2, y - ry * 0.35, rx * 0.6, ry * 0.45), true, 0.8)}"/>`; }
    s += `<g filter="url(#${blurId(b)})" opacity="${op}"><g fill="${col}">${body}</g><g fill="${o.dark || mix(col, INK, 0.35)}" opacity="0.7">${belly}</g><g fill="${o.lit || mix(col, '#f4f0e8', 0.35)}" opacity="${o.litOp ?? 0.55}">${crown}</g></g>`;
    for (let i = 0; i < (o.wisps ?? 3); i++) { const [x, y, rx, ry] = lobes[Math.floor(R() * lobes.length)], dir = o.drift ?? (R() < 0.5 ? -1 : 1), L = rx * (0.8 + R()); const pts = [[x + dir * rx * 0.6, y - ry * 0.2], [x + dir * (rx * 0.6 + L * 0.5), y - ry * 0.4 - R() * ry * 0.3], [x + dir * (rx * 0.6 + L), y - ry * 0.3 + (R() - 0.5) * ry * 0.4]];
      s += `<path d="${smooth(pts, false, 0.6)}" stroke="${o.lit || mix(col, '#f4f0e8', 0.3)}" stroke-width="${f1(ry * 0.25)}" fill="none" stroke-linecap="round" opacity="${f1(op * 0.35)}" filter="url(#${blurId(Math.max(1.5, b * 0.6))})"/>`; }
    return s;
  }
  // soft steam / smoke column: same signature as battle_li's steam (x, y base; h height; w width)
  function steam(x, y, h, w, o = {}) {
    let s = ''; const n = o.n || 6, col = o.col || '#e8e4dc';
    for (let i = 0; i < n; i++) { const u = i / (n - 1 || 1), cx = x + Math.sin(u * 3 + R()) * w * 0.25 + (o.drift || 0) * u * h, cy = y - u * h, r = w * (0.3 + u * 0.55) * (0.8 + R() * 0.4);
      s += `<path d="${smooth(blob(cx, cy, r, r * 0.65), true, 0.8)}" fill="${col}" opacity="${f1((o.op ?? 0.2) * (1.1 - u * 0.7))}" filter="url(#${blurId(Math.max(1.5, r * 0.35))})"/>`; }
    for (let i = 0; i < 2; i++) { const pts = []; let cx = x; for (let j = 0; j <= 6; j++) { pts.push([cx, y - j / 6 * h * 1.1]); cx += (R() - 0.4) * w * 0.25 + (o.drift || 0) * h / 6; } s += `<path d="${smooth(pts, false, 0.6)}" stroke="${col}" stroke-width="${f1(Math.max(1, w * 0.08))}" fill="none" opacity="${f1((o.op ?? 0.2) * 0.7)}" filter="url(#${blurId(2)})"/>`; }
    return s;
  }
  // soft bank of haze/smoke lying across the frame between x0 and x1 at screen y (top edge lobed), same signature as bank
  function bank(x0, x1, y, h, o = {}) {
    let s = ''; const col = o.col || '#c8ccc0', op = o.op ?? 0.18;
    for (let x = x0; x < x1; x += h * (1.2 + R() * 1.6)) { const rx = h * (1.2 + R() * 1.4), ry = h * (0.35 + R() * 0.35); s += `<path d="${smooth(blob(x, y - ry * 0.3 + Math.sin(x * 0.01 + (o.ph || 0)) * h * 0.2, rx, ry), true, 0.8)}" fill="${col}" opacity="${f1(op * (0.8 + R() * 0.5))}" filter="url(#${blurId(Math.max(2, h * 0.3))})"/>`; }
    return s;
  }
  // skies: a smooth vertical gradient (stops [[offset 0..1, colour]]) between screen y0 and y1, full width
  function skyGrad(y0, y1, stops, o = {}) { const g = S.id('sk'); S.DEFS.push(`<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}">${stops.map(([t, c, a]) => `<stop offset="${t}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`).join('')}</linearGradient>`); return `<rect x="${o.x ?? -20}" y="${f1(y0)}" width="${o.w ?? W + 40}" height="${f1(y1 - y0)}" fill="url(#${g})"/>`; }
  // a smooth radial light (glare, glow) with stops; elliptical via a transform
  function radial(cx, cy, rx, ry, stops, o = {}) { const g = S.id('rg'); S.DEFS.push(`<radialGradient id="${g}">${stops.map(([t, c, a]) => `<stop offset="${t}" stop-color="${c}" stop-opacity="${a ?? 1}"/>`).join('')}</radialGradient>`); return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#${g})"${o.rot ? ` transform="rotate(${o.rot} ${f1(cx)} ${f1(cy)})"` : ''}/>`; }
  // ---------------------------------------------------------------- HEWN ROCK (worked living rock; never cells)
  // bedding planes of uneven thickness running along s with wavy boundaries; each bed broken by joints into long blocks of
  // its own tone; the lower edge of every bed undercut in shadow, the upper lip lit; spalls; pick-mark scars in sets;
  // weathering streaks running down. o.tint(q) -> [col,k]; o.pick share; o.stain(q) -> [col,k]
  function hewnRock(at, Ls, Lt, col, o = {}) {
    if (MV) { let out = MV.hewnRock(at, Ls, Lt, dim(col, at(Ls / 2, Lt / 2)[2]), { bed: o.bed, joint: (o.block || 2.4) * 0.45, tool: (o.pick ?? 0.4) > 0.2, vary: o.vary });
      // the room's light laid over the rock in soft patches (lamps, daylight, vents), as the cell version tinted its blocks
      if (o.tint) { let pt = ''; for (let s = 0.5; s < Ls; s += 1.2) for (let t = 0.3; t < Lt; t += 0.8) { const q = at(s, t), tt = o.tint(q); if (!tt) continue; const c = P(...q), k = K(q[2]); pt += `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 0.9)}" ry="${f1(k * 0.6)}" fill="${tt[0]}" opacity="${f1(Math.min(0.5, tt[1] * 0.55))}"/>`; } if (pt) out += `<g filter="url(#${blurId(6)})">${pt}</g>`; }
      return out; }
    let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, 0.3)}"/>`;
    const beds = []; let t = -R() * 0.3; while (t < Lt) { const h = (o.bed || 0.55) * (0.4 + R() * 1.3); beds.push([t, h, R() * 6, (R() - 0.5) * 0.06]); t += h; }
    const bd = (b, s) => b[0] + Math.sin(s * 0.23 + b[2]) * 0.12 + Math.sin(s * 0.9 + b[2] * 2) * 0.04 + b[3] * s;
    const ds = Math.max(0.2, Ls / 120);
    for (let j = 0; j < beds.length; j++) {
      const B0 = beds[j], B1 = beds[j + 1] || [Lt + 0.5, 0, 0, 0];
      let s0 = -R() * 2;
      while (s0 < Ls) { const s1 = Math.min(Ls + 0.1, s0 + (o.block || 2.4) * (0.4 + R() * 1.4)), top = [], bot = [];
        for (let s = Math.max(0, s0); s <= Math.min(Ls, s1) + 1e-6; s += ds) { top.push(P(...at(s, Math.min(Lt, bd(B1, s))))); bot.push(P(...at(s, Math.max(0, bd(B0, s))))); }
        if (top.length > 1) { const sm = (Math.max(0, s0) + Math.min(Ls, s1)) / 2, q = at(sm, B0[0] + B0[1] / 2), Zq = q[2];
          let fill = tone(dim(col, Zq), o.vary ?? 0.16); if (o.tint) { const tt = o.tint(q); if (tt) fill = mix(fill, tt[0], Math.min(0.8, tt[1])); }
          if (o.stain) { const tt = o.stain(q); if (tt) fill = mix(fill, tt[0], tt[1]); }
          const poly = [...bot, ...top.reverse()];
          out += `<path d="${p2(poly)}" fill="${fill}"/><path d="${p2(poly)}" fill="url(#mottle)" opacity="0.55"/><path d="${p2(poly)}" fill="url(#speck)" opacity="${o.speck ?? 0.35}"/>`;
          // weathering inside the block: a hairline crack or two, pitting, a darker seep patch
          for (let c2 = 0; c2 < 1 + Math.floor(R() * 2); c2++) { const a1 = P(...at(Math.max(0, s0) + R() * (Math.min(Ls, s1) - Math.max(0, s0)), B0[0] + B0[1] * R())), L2 = K(Zq) * (0.1 + R() * 0.3); const pts2 = [a1]; for (let j = 0; j < 4; j++) { const l = pts2[pts2.length - 1]; pts2.push([l[0] + (R() - 0.5) * L2 * 0.5, l[1] + L2 * 0.25]); } out += `<path d="${smooth(pts2, false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, inkW(Zq) * 0.5))}" fill="none" opacity="0.55"/>`; }
          if (R() < 0.35) { const c = P(...at(sm + (R() - 0.5), B0[0] + B0[1] * 0.5)), r = K(Zq) * B0[1] * 0.4; out += `<path d="${smooth(blob(c[0], c[1], r * 1.8, r, 9, 0.5), true, 0.7)}" fill="${INK}" opacity="0.14"/>`; }
          // the joint at the block's end: a fracture across the bed, slightly wandering, sometimes open and dark
          const a = P(...at(Math.min(Ls, s1), bd(B0, s1))), b = P(...at(Math.min(Ls, s1) + (R() - 0.5) * 0.15, bd(B1, s1))), m = [(a[0] + b[0]) / 2 + (R() - 0.5) * 3, (a[1] + b[1]) / 2];
          out += `<path d="${smooth([a, m, b], false, 0.5)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, inkW(Zq) * (R() < 0.3 ? 1.6 : 0.8)))}" fill="none" opacity="0.8"/>`;
          if (R() < (o.spall ?? 0.18)) { const c = P(...at(sm + (R() - 0.5), B0[0] + B0[1] * (0.3 + R() * 0.4))), k = K(Zq), r = k * B0[1] * (0.2 + R() * 0.25); const pts = blob(c[0], c[1], r * 1.6, r, 9, 0.4); out += `<path d="${smooth(pts, true, 0.6)}" fill="${mix(fill, INK, 0.35)}"/><path d="${smooth(pts.slice(5, 10), false, 0.6)}" stroke="${mix(fill, '#f0e4c8', 0.4)}" stroke-width="0.9" fill="none" opacity="0.6"/><path d="${smooth(pts.slice(0, 5), false, 0.6)}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.7"/>`; }
          for (let pk = 0; pk < 3; pk++) if (R() < (o.pick ?? 0.4)) { const c = P(...at(sm + (R() - 0.5) * 2.0, B0[0] + B0[1] * (0.25 + R() * 0.5))), k = K(Zq), L = k * (0.08 + R() * 0.08), ang = 1.0 + (R() - 0.5) * 0.5; let d = ''; const nn = 3 + Math.floor(R() * 4); for (let i = 0; i < nn; i++) { const x = c[0] + i * L * 0.35 + (R() - 0.5), y = c[1] + i * L * 0.05; d += `M${f1(x)} ${f1(y)} l${f1(Math.cos(ang) * L)} ${f1(Math.sin(ang) * L)} `; } out += `<path d="${d}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, k * 0.008))}" opacity="0.55"/><path d="${d}" stroke="${mix(col, '#f0e4c8', 0.4)}" stroke-width="${f1(Math.max(0.3, k * 0.004))}" opacity="0.35" transform="translate(0.8 0.6)"/>`; }
        }
        s0 = s1; }
      // the bed's lower edge: an undercut shadow under the bed above, and its lit lip
      const lip = [], und = []; for (let s = 0; s <= Ls + 1e-6; s += ds) { const tb = bd(B1, s); if (tb > Lt) continue; lip.push(P(...at(s, tb))); und.push(P(...at(s, Math.max(0, tb - (0.04 + Math.abs(Math.sin(s * 0.5 + B1[2])) * 0.09))))); }
      if (lip.length > 1) { const Zm = at(Ls / 2, B1[0])[2]; out += `<path d="${p2([...lip, ...und.slice().reverse()])}" fill="${INK}" opacity="0.45"/><path d="${p2([...lip, ...und.slice().reverse()])}" fill="${hatchB(Zm)}" opacity="0.4"/>` + line(lip, Math.max(0.6, inkW(Zm) * 1.1), INK, 0.85) + line(lip.map(([x, y]) => [x, y - 1]), 0.8, o.lipCol || mix(col, '#f0e4c8', 0.45), 0.4); }
    }
    // weathering: streaks running down from ledges (rain, seep, soot), irregular
    for (let i = 0; i < (o.streaks ?? Ls * 0.4); i++) { const s = R() * Ls, t0 = R() * Lt, A = P(...at(s, t0)), B = P(...at(s + (R() - 0.5) * 0.1, Math.max(0, t0 - 0.5 - R() * 2))); out += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1(A[0] + (R() - 0.5) * 3)} ${f1((A[1] + B[1]) / 2)} ${f1(B[0])} ${f1(B[1])}" stroke="${o.streakCol || INK}" stroke-width="${f1(Math.max(0.8, K(at(s, t0)[2]) * 0.03))}" opacity="${f1(0.12 + R() * 0.12)}" fill="none" stroke-linecap="round"/>`; }
    return out;
  }
  // ---------------------------------------------------------------- BUILT WALL (coursed masonry; weathered)
  // until materials_v2 lands: lik's ashlar in rough coursed rubble with pinning slips, plus weathering (damp at the foot,
  // run streaks, soot over openings, salt or lime bloom); o.ashlar: options passed through; o.soot(q)->k
  function builtWall(at, Ls, Lt, col, o = {}) {
    let out = S.ashlar(at, Ls, Lt, col, Object.assign({ rough: true, roughP: 0.55, scale: 1.0, vary: 0.24, chip: 0.55, mortar: 0.62, lost: 0.2, spall: 0.25 }, o.ashlar || {}));
    out += `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Math.min(Lt, o.damp ?? 0.9), ), at(0, Math.min(Lt, o.damp ?? 0.9))])}" fill="${o.dampCol || '#141210'}" opacity="0.3"/>`;
    for (let i = 0; i < Ls * 0.8; i++) { const s = R() * Ls, t0 = Lt * (0.3 + R() * 0.7), A = P(...at(s, t0)), B = P(...at(s, Math.max(0, t0 - 0.6 - R() * 2.5))); out += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1(A[0] + (R() - 0.5) * 2)} ${f1((A[1] + B[1]) / 2)} ${f1(B[0])} ${f1(B[1])}" stroke="${o.streakCol || INK}" stroke-width="${f1(Math.max(0.8, K(at(s, t0)[2]) * 0.035))}" opacity="${f1(0.12 + R() * 0.14)}" fill="none" stroke-linecap="round"/>`; }
    for (let i = 0; i < Ls * 0.15; i++) { const s = R() * Ls, t0 = R() * Lt, c = P(...at(s, t0)), r = K(at(s, t0)[2]) * (0.3 + R() * 0.6); out += `<path d="${smooth(blob(c[0], c[1], r * 1.4, r, 9, 0.5), true, 0.7)}" fill="${o.bloom || '#0e0c0a'}" opacity="${f1(0.12 + R() * 0.12)}"/>`; }
    if (MV) out += MV.weatherWall(at, Ls, Lt);
    return out;
  }
  const cloudSoft = (cx, cy, w, h, col, o = {}) => softMass(cx, cy, w, h, col, { lit: o.lit, dark: o.dark, op: o.op ?? 0.92, n: o.n, litOp: o.litOp, wisps: o.wisps ?? 2 });
  return { blurId, cloudSoft, softMass, steam, bank, skyGrad, radial, hewnRock, builtWall, blob, frameDark, smoothRock, fireAt, lightTint, voronoi, strataSeeds, breakEdge, stoneCells, rockMass, timber, oilLamp, flame, sparks, cage, keg, lantern, cloudMass: cloudSoft, veil, floorCracks, puddle, sea, dim, line, polyS };
};
