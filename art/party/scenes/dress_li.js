// Living Ink room dressing (v2, 2026-11-24): the lived-in layer the pilot lacked. Floor clutter laid in the floor plane
// (rushes, straw, a rag rug with real fold depth), things dropped (a cloak), pegs and nails with things hung on them.
// Usage: const DR = require('./dress_li')(S)   (S: the scene kit from lik.js, or the interior I that extends it)
'use strict';
const E = require('../engine');
const PR = require('./props_li');
const { ell, lerp, mix } = E;

module.exports = S => {
  const { P, K, p2, f1, INK, raw, PLW, cel, R, figProp, smooth, lam, shadowPoly } = S;
  const FLOOR = [[0, 0, 1], [1, 0, 1], [0, 0, 2]];
  const D = {};

  // ---- a rag rug: strips of old cloth hooked through sacking, in bands of colour. It lies on the floor with real relief: rucks
  // where feet have shoved it (each ruck a ridge, lit on its near side, shaded beyond), and one corner kicked over to show
  // the sacking underneath, the flap lifted off the floor with its own thickness and shadow.
  // c: [X, Z] centre, w across, d along, ang: rotation in the floor plane; o.rucks: [[v (0..1), height m, width m]]
  D.ragRug = (c, w, d, ang, o = {}) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), rucks = o.rucks || [[0.28, 0.05, 0.1], [0.6, 0.075, 0.12]];
    const hgt = v => rucks.reduce((s, [vc, h, sg]) => s + h * Math.exp(-Math.pow((v - vc * d) / sg, 2)), 0);
    const at = (u, v, lift = 0) => [c[0] + u * ca - (v - d / 2) * sa, hgt(v) + 0.004 + lift, c[1] + u * sa + (v - d / 2) * ca];
    const cols = o.cols || ['#6a2e24', '#6a6044', '#3e4638', '#7a6a4a', '#4a4040', '#8a5a34', '#3a3a30', '#5a4a3a', '#6e5a40'];
    // the fold-over corner: fold line from (u=w/2 - fu, v=d) to (u=w/2, v=d - fv)
    const fu = o.foldU ?? w * 0.45, fv = o.foldV ?? d * 0.32;
    const inFlap = (u, v) => (u - (w / 2 - fu)) / fu + (v - (d - fv)) / fv > 1;
    let out = shadowPoly([at(-w / 2, 0), at(w / 2, 0), at(w / 2, d), at(-w / 2, d)].map(p => P(p[0], 0, p[2] + 0.04)), c[1], { op: 0.18, hop: 0.2 });
    const dv = 0.035, n = Math.ceil(d / dv);
    let stripe = 0, next = 0;
    for (let i = 0; i < n; i++) {
      const v0 = i * dv, v1 = Math.min(d, v0 + dv);
      if (v0 >= next) { stripe++; next = v0 + 0.06 + R() * 0.12; }
      const col = cols[(stripe * 3 + (stripe % 2)) % cols.length];
      const slope = (hgt(v1) - hgt(v0)) / dv, nrm = S.norm3([slope * sa, 1, -slope * ca]);
      const lit = (lam(nrm) - lam([0, 1, 0])) * 2.2;
      const fill = lit < -0.08 ? mix(col, S.SHT, Math.min(0.55, -lit * 1.6)) : lit > 0.05 ? mix(col, S.KEY, Math.min(0.3, lit * 1.2)) : col;
      // skip the part under the flap (it is folded away: bare floor shows there)
      const q = [at(-w / 2, v0), at(w / 2, v0), at(w / 2, v1), at(-w / 2, v1)];
      const qs = q.map(p => P(...p));
      out += `<path d="${p2(qs)}" fill="${fill}"/>`;
      // the hooked loops: short dashes across the strip, rows of them
      if (i % 1 === 0) { const vv = (v0 + v1) / 2, A = P(...at(-w / 2 + 0.02, vv)), B = P(...at(w / 2 - 0.02, vv)); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(fill, INK, 0.45)}" stroke-width="${f1(Math.max(0.6, K(c[1]) * 0.008))}" stroke-dasharray="${f1(1 + R() * 1.5)} ${f1(1 + R() * 2)}" opacity="0.7"/>`; }
      if (lit < -0.12) out += `<path d="${p2(qs)}" fill="${S.hatchA(c[1])}" opacity="${f1(Math.min(0.6, -lit * 2))}"/>`;
      // the crest of a ruck catches the light
      if (hgt(v0) > 0.02 && hgt(v0) >= hgt(Math.max(0, v0 - dv)) && hgt(v0) >= hgt(v1)) { const A = P(...at(-w / 2 + 0.01, v0)), B = P(...at(w / 2 - 0.01, v0)); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(col, S.KEY, 0.6)}" stroke-width="1.4" opacity="0.55"/>`; }
      if (v0 >= next - dv) { const A = P(...at(-w / 2, v1)), B = P(...at(w / 2, v1)); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.7" opacity="0.5"/>`; }
    }
    // outline and frayed ends
    { const L = [], Rr = []; for (let i = 0; i <= n; i++) { const v = Math.min(d, i * dv); L.push(P(...at(-w / 2, v))); Rr.push(P(...at(w / 2, v))); }
      out += `<path d="${'M' + [...L, ...Rr.reverse()].map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L') + ' Z'}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(1, S.inkW(c[1]) * 0.9))}" stroke-linejoin="round"/>`; }
    for (const v of [0]) for (let k = 0; k < 18; k++) { const u = -w / 2 + w * (k + R() * 0.6) / 18, A = P(...at(u, v)), B = P(...at(u + (R() - 0.5) * 0.03, v - 0.03 - R() * 0.04)); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${mix(cols[k % cols.length], '#c8b890', 0.3)}" stroke-width="1" opacity="0.8"/>`; }
    // the flap: the corner beyond the fold line, mirrored over it and lifted, sacking side up
    const F0 = [w / 2 - fu, d], F1 = [w / 2, d - fv], fx = F1[0] - F0[0], fy = F1[1] - F0[1], fl = Math.hypot(fx, fy), ex = fx / fl, ey = fy / fl;
    const refl = ([u, v]) => { const px = u - F0[0], py = v - F0[1], t = px * ex + py * ey, qx = F0[0] + ex * t, qy = F0[1] + ey * t; return [2 * qx - u, 2 * qy - v]; };
    // bare floor where the corner lifted away
    out += `<path d="${p2([F0, [w / 2, d], F1].map(q => P(...at(q[0], q[1], -0.004))))}" fill="${o.floorCol || '#3e2e20'}"/><path d="${p2([F0, [w / 2, d], F1].map(q => P(...at(q[0], q[1], -0.004))))}" fill="${S.hatchA(c[1])}" opacity="0.3"/>`;
    const C2 = refl([w / 2, d]), lift = 0.06;
    const flap = [F0, F1, C2].map((q, k) => P(...at(q[0], q[1], k === 2 ? lift : 0.006)));
    out += shadowPoly([F0, F1, C2].map(q => P(...at(q[0] + 0.05, q[1] - 0.06, 0))), c[1], { op: 0.4, hop: 0.45 });
    // the thickness of the turned edge along the fold, then the sacking back, coarse weave and the hook ends showing through
    const ft = [F0, F1].map(q => P(...at(q[0], q[1], 0.006)));
    out += `<path d="M${f1(ft[0][0])} ${f1(ft[0][1])} L${f1(ft[1][0])} ${f1(ft[1][1])} L${f1(ft[1][0])} ${f1(ft[1][1] + 5)} L${f1(ft[0][0])} ${f1(ft[0][1] + 5)} Z" fill="${mix(cols[0], INK, 0.2)}" stroke="${INK}" stroke-width="0.8"/>`;
    out += cel(flap, { Z: c[1], fill: o.backCol || '#7a6a4a', tex: 'url(#mottle)', texOp: 0.5, band: 2.5 });
    for (let k = 1; k < 7; k++) { const t = k / 7, A = lerp(flap[0], flap[2], t), B = lerp(flap[1], flap[2], t); out += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#4a3a24" stroke-width="0.6" opacity="0.6" stroke-dasharray="1.5 1.5"/>`; }
    for (let k = 0; k < 14; k++) { const t1 = R(), t2 = R() * (1 - t1), p = [flap[0][0] * (1 - t1 - t2) + flap[1][0] * t1 + flap[2][0] * t2, flap[0][1] * (1 - t1 - t2) + flap[1][1] * t1 + flap[2][1] * t2]; out += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="0.9" fill="${cols[k % cols.length]}"/>`; }
    raw(PLW(FLOOR, out));
  };

  // ---- a cloak dropped in a heap: heavy wool in lobes that overlap, each fold with its shadow wedge; the hood fallen open on
  // its dark inside; a worn hem with a mud line; an iron clasp
  // ---- a cloak dropped on the floor, seen from standing height: a half-circle of heavy wool lying spread in the floor plane,
  // one side flung back over itself (its doubled edge has thickness and throws a shadow), the cloth crumpled into ridges that
  // run out from the collar (each ridge lit on its near side, in shadow beyond), the hood a limp lump at the collar, the
  // lining showing where a corner turned over, a muddy hem. c: [X, Z]; r: radius (m); ang: rotation in the floor plane.
  D.droppedCloak = (c, r, ang, col = '#3e3a30', o = {}) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), lin = o.lining || '#5a3a2a';
    const at = (u, v, y = 0.006) => [c[0] + u * ca - v * sa, y, c[1] + u * sa + v * ca];
    // outline: the collar edge (gathered, short) then the hem arc, crumpled
    const out0 = [];
    for (let i = 0; i <= 28; i++) { const th = Math.PI * i / 28, m = 1 + 0.08 * Math.sin(i * 1.7) + (R() - 0.5) * 0.08; out0.push([Math.cos(th) * r * m, Math.sin(th) * r * 0.85 * m]); }
    const gather = []; for (let i = 0; i <= 6; i++) gather.push([-r * 0.18 + r * 0.36 * i / 6, -0.04 + (i % 2) * 0.03]);
    const poly = [...out0, ...gather.reverse()];
    let svg = shadowPoly(poly.map(q => P(...at(q[0] + 0.03, q[1] - 0.04, 0))), c[1], { op: 0.22, hop: 0.25 });
    svg += cel(poly.map(q => P(...at(q[0], q[1]))), { Z: c[1], fill: col, tex: 'url(#mottle)', texOp: 0.45, band: 2 });
    svg += `<path d="${p2(poly.map(q => P(...at(q[0], q[1]))))}" fill="url(#speck)" opacity="0.35"/>`;
    // ridges where the cloth crumpled: a few, of different length and direction, crossing; each lit on its near side, a shadow
    // wedge beyond. The heap itself rises where the shoulders fell (drawn after, as a figure prop)
    const ridges = o.ridges || [[-0.55, 0.15, -0.05, 0.45], [0.1, 0.12, 0.62, 0.3], [-0.3, 0.55, 0.25, 0.62], [0.35, 0.5, 0.6, 0.12]];
    for (const [u0, v0, u1, v1] of ridges) {
      const pts = []; const bend = (R() - 0.5) * 0.12; for (let k = 0; k <= 6; k++) { const t = k / 6; pts.push([(u0 + (u1 - u0) * t) * r + Math.sin(t * Math.PI) * bend * r, (v0 + (v1 - v0) * t) * r]); }
      const wd = r * (0.06 + R() * 0.04), side = pts.map((q, k) => { const w = wd * Math.sin(Math.PI * (0.08 + 0.84 * k / 6)); return [q[0] + w * 0.4, q[1] + w]; });
      const ps = pts.map(q => P(...at(q[0], q[1]))), sh = side.map(q => P(...at(q[0], q[1])));
      svg += `<path d="${p2([...ps, ...sh.slice().reverse()])}" fill="#140c06" opacity="0.42"/><path d="${p2([...ps, ...sh.slice().reverse()])}" fill="${S.hatchA(c[1])}" opacity="0.45"/>`;
      svg += `<path d="${smooth(ps, false, 0.5)}" stroke="#140c06" stroke-width="1.3" fill="none" opacity="0.65"/><path d="${smooth(ps.map(q => [q[0] - 0.5, q[1] - 1.6]), false, 0.5)}" stroke="${mix(col, S.KEY, 0.55)}" stroke-width="1.3" fill="none" opacity="0.5"/>`;
    }
    // the half flung back over itself: a doubled layer with a thick rolled edge and a shadow under it
    const fl = []; for (let i = 0; i <= 12; i++) { const th = Math.PI * (0.52 + 0.46 * i / 12), m = 0.72 + 0.1 * Math.sin(i * 2.1); fl.push([Math.cos(th) * r * m, Math.sin(th) * r * 0.85 * m]); }
    fl.push([-r * 0.1, r * 0.05], [r * 0.02, r * 0.4]);
    svg += shadowPoly(fl.map(q => P(...at(q[0] + 0.05, q[1] - 0.06, 0.006))), c[1], { op: 0.35, hop: 0.4 });
    svg += cel(fl.map(q => P(...at(q[0], q[1], 0.05))), { Z: c[1], fill: mix(col, S.KEY, 0.05), tex: 'url(#mottle)', texOp: 0.5, band: 2.5 });
    { const e0 = fl.slice(0, 13).map(q => P(...at(q[0], q[1], 0.05))), e1 = fl.slice(0, 13).map(q => P(...at(q[0], q[1], 0.006))); svg += `<path d="${p2([...e0, ...e1.reverse()])}" fill="${mix(col, INK, 0.45)}" stroke="${INK}" stroke-width="1"/>`; }
    for (let k = 0; k < 3; k++) { const th = Math.PI * (0.6 + k * 0.13), A = P(...at(Math.cos(th) * r * 0.2, Math.sin(th) * r * 0.2, 0.05)), B = P(...at(Math.cos(th) * r * 0.66, Math.sin(th) * r * 0.56, 0.05)); svg += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1((A[0] + B[0]) / 2 + 4)} ${f1((A[1] + B[1]) / 2)} ${f1(B[0])} ${f1(B[1])}" stroke="#140c06" stroke-width="1.3" fill="none" opacity="0.6"/>`; }
    // a corner turned over: the lining
    { const t0 = 0.12, q = [[Math.cos(t0) * r * 0.98, Math.sin(t0) * r * 0.83], [Math.cos(t0 + 0.35) * r * 0.95, Math.sin(t0 + 0.35) * r * 0.8], [Math.cos(t0 + 0.12) * r * 0.7, Math.sin(t0 + 0.12) * r * 0.6]];
      svg += cel(q.map(p => P(...at(p[0], p[1], 0.03))), { Z: c[1], fill: lin, tex: 'url(#mottle)', texOp: 0.5, band: 1.5 }); }
    // the muddy hem
    svg += `<path d="${smooth(out0.map(q => P(...at(q[0] * 0.97, q[1] * 0.97))), false, 0.5)}" stroke="#2a2014" stroke-width="3" fill="none" opacity="0.4"/>`;
    raw(PLW(FLOOR, svg));
    // the heap where the shoulders and hood fell: a low lumpy mound of folds, the hood open on its dark inside, the clasp
    const [hx, hz] = [c[0] + (-r * 0.05) * ca - (r * 0.2) * sa, c[1] + (-r * 0.05) * sa + (r * 0.2) * ca];
    figProp(hx, 0, hz, (f, u) => { const s2 = u * r;
      f.part([[-0.45 * s2, 0.01 * s2], [-0.42 * s2, -0.07 * s2], [-0.3 * s2, -0.1 * s2], [-0.2 * s2, -0.17 * s2, 1], [-0.06 * s2, -0.14 * s2], [0.02 * s2, -0.19 * s2, 1], [0.16 * s2, -0.15 * s2], [0.3 * s2, -0.1 * s2], [0.42 * s2, -0.04 * s2], [0.44 * s2, 0.01 * s2]], { fill: col, tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.5, k: 0.5 });
      for (const [a2, b2, c2] of [[[-0.2, -0.16], [-0.17, -0.07], [-0.21, 0.0]], [[0.02, -0.18], [0.07, -0.08], [0.04, 0.0]], [[0.22, -0.12], [0.26, -0.05], [0.23, 0.0]]]) { f.flat([[a2[0] * s2, a2[1] * s2], [(b2[0] + 0.06) * s2, b2[1] * s2], [(c2[0] + 0.08) * s2, c2[1] * s2], [c2[0] * s2, c2[1] * s2], [b2[0] * s2, b2[1] * s2]], '#140c06', { op: 0.35 }); f.line([[a2[0] * s2, a2[1] * s2], [b2[0] * s2, b2[1] * s2], [c2[0] * s2, c2[1] * s2]], 1.4, '#140c06', { op: 0.6 }); }
      f.part([[-0.47 * s2, 0.0], [-0.5 * s2, -0.07 * s2], [-0.4 * s2, -0.12 * s2], [-0.28 * s2, -0.1 * s2], [-0.26 * s2, -0.02 * s2]], { fill: col, tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.4 });
      f.flat([[-0.45 * s2, -0.02 * s2], [-0.45 * s2, -0.07 * s2], [-0.38 * s2, -0.1 * s2], [-0.3 * s2, -0.08 * s2], [-0.3 * s2, -0.03 * s2]], mix(lin, '#000', 0.55), { op: 0.92 });
      f.line([[-0.49 * s2, -0.06 * s2], [-0.39 * s2, -0.115 * s2], [-0.28 * s2, -0.095 * s2]], 1.6, mix(col, '#d8c8a8', 0.4), { op: 0.6 });
      f.part(ell([-0.24 * s2, -0.1 * s2], 0.03 * s2, 0.02 * s2, 0.3, 10), { fill: '#3a3634', shade: 0.4, inkW: 1.2, cast: false }); f.rivet([-0.24 * s2, -0.1 * s2], 1.5, '#7a7670');
      f.line([[-0.22 * s2, -0.09 * s2], [-0.15 * s2, -0.04 * s2], [-0.17 * s2, 0.01 * s2]], 1.3, '#3a2a18', { op: 0.9 }); }, o.fp || {});
  };

  // ---- a drift of strewn rushes or straw banked on the floor: a low mat of it, thick at its heart, thin at its edge, with
  // loose stalks on top. at: floor plane (s,t); w,h in metres
  D.drift = (at, s0, t0, w, h, o = {}) => {
    const cols = o.cols || ['#7a6a3a', '#6a5a32', '#8a7a48', '#5a4a2a', '#94844e'];
    const ring = S.blobST(s0, t0, w, h, 16, 0.45).map(q => P(...at(q[0], q[1]))), core = S.blobST(s0, t0, w * 0.6, h * 0.6, 14, 0.5).map(q => P(...at(q[0], q[1])));
    let out = `<path d="${smooth(ring, true, 0.7)}" fill="${o.base || '#54482a'}" opacity="0.85"/><path d="${smooth(core, true, 0.7)}" fill="${mix(o.base || '#54482a', '#8a7a48', 0.35)}" opacity="0.8"/>`;
    out += `<path d="${smooth(ring, true, 0.7)}" fill="url(#speck)" opacity="0.5"/>`;
    out += S.strew(at, s0 - w / 2, s0 + w / 2, t0 - h / 2, t0 + h / 2, o.n || Math.round(w * h * 420), { cols, len: o.len || 0.15, w: o.w || 0.006, dens: (s, t) => Math.max(0, 1 - Math.hypot((s - s0) / (w / 2), (t - t0) / (h / 2))) * 1.4 });
    raw(PLW(FLOOR, out));
  };

  // ---- things hung on a peg or nail: the hang point is the figProp origin (y down)
  const HUNG = {
    hat: (f, s) => { f.line([[0, 0], [0, 0.03 * s]], 1.6, '#2a1a10'); f.part([[-0.17 * s, 0.13 * s], [-0.1 * s, 0.1 * s], [-0.08 * s, 0.02 * s], [0.0, 0.0], [0.08 * s, 0.02 * s], [0.1 * s, 0.1 * s], [0.18 * s, 0.13 * s], [0.0, 0.15 * s]], { fill: '#4a4034', tex: PR.T(f, 'weave'), texOp: 0.5, shade: 0.45 }); f.line([[-0.09 * s, 0.09 * s], [0.09 * s, 0.09 * s]], 2.4, '#2a2018'); },
    bag: (f, s) => { f.line([[0, 0], [-0.08 * s, 0.14 * s]], 2.4, '#3a2a18'); f.line([[0, 0], [0.08 * s, 0.13 * s]], 2.4, '#3a2a18'); f.part([[-0.12 * s, 0.12 * s], [0.12 * s, 0.11 * s], [0.14 * s, 0.32 * s], [-0.13 * s, 0.33 * s]], { fill: '#5a4430', tex: PR.T(f, 'mottle'), texOp: 0.5, shade: 0.45 }); f.part([[-0.12 * s, 0.12 * s], [0.12 * s, 0.11 * s], [0.1 * s, 0.2 * s], [-0.1 * s, 0.21 * s]], { fill: '#4a3624', shade: 0.4, inkW: 1.2, cast: false }); f.rivet([0, 0.2 * s], 1.8, '#6a6660'); f.stitches([[-0.11 * s, 0.25 * s], [0.11 * s, 0.25 * s]], '#c8b890'); },
    rope: (f, s) => { for (let k = 0; k < 4; k++) { const r = (0.1 - k * 0.006) * s, oy = 0.12 * s + k * 2; const pts = ell([k * 1.5, oy], r * 0.8, r, 0, 14); f.line(pts.concat([pts[0]]), 4.2, '#1a120c'); f.line(pts.concat([pts[0]]), 2.6, '#8a7a56'); } f.line([[0, 0], [0, 0.03 * s]], 3, '#8a7a56'); },
    ladle: (f, s) => { f.line([[0, 0], [0.01 * s, 0.32 * s]], 3.4, '#1a120c'); f.line([[0, 0], [0.01 * s, 0.32 * s]], 1.8, '#5a5650'); f.part(ell([0.01 * s, 0.36 * s], 0.05 * s, 0.045 * s, 0, 12), { fill: '#4a4644', shade: 0.4, inkW: 1.3 }); },
    herbs: (f, s) => { f.line([[0, 0], [0, 0.04 * s]], 2, '#6a5a3a'); for (let k = 0; k < 9; k++) { const a = (k - 4) * 0.07; f.line([[0, 0.04 * s], [Math.sin(a) * 0.28 * s, 0.04 * s + Math.cos(a) * 0.28 * s]], 1.2, k % 2 ? '#4a5a2a' : '#6a6a3a'); for (let j = 1; j < 4; j++) f.flat(ell([Math.sin(a) * 0.08 * j * s, (0.04 + Math.cos(a) * 0.08 * j) * s], 3, 1.6, a + 1.2, 6), k % 3 ? '#5a6a32' : '#7a6a3a'); } f.part([[-0.02 * s, 0.03 * s], [0.02 * s, 0.03 * s], [0.02 * s, 0.07 * s], [-0.02 * s, 0.07 * s]], { fill: '#8a7a56', shade: 0.3, inkW: 1, cast: false }); },
    lantern: (f, s) => { f.line([[0, 0], [0, 0.04 * s]], 1.6, '#2a2622'); f.part([[-0.06 * s, 0.06 * s], [0.06 * s, 0.06 * s], [0.07 * s, 0.24 * s], [-0.07 * s, 0.24 * s]], { fill: '#3a3634', shade: 0.4, inkW: 1.3 }); f.flat([[-0.04 * s, 0.09 * s], [0.04 * s, 0.09 * s], [0.045 * s, 0.21 * s], [-0.045 * s, 0.21 * s]], '#6a6040', { op: 0.6 }); f.part([[-0.08 * s, 0.06 * s], [0, 0.02 * s], [0.08 * s, 0.06 * s]], { fill: '#2a2622', shade: 0.3, inkW: 1.2, cast: false }); },
    cloak: (f, s) => PR.hung(f, 0, 'cloak', '#3a3a30'),
    belt: (f, s) => { f.line([[0, 0], [-0.04 * s, 0.4 * s]], 4, '#1a120c'); f.line([[0, 0], [-0.04 * s, 0.4 * s]], 2.6, '#4a3020'); f.line([[0, 0], [0.05 * s, 0.34 * s]], 4, '#1a120c'); f.line([[0, 0], [0.05 * s, 0.34 * s]], 2.6, '#4a3020'); f.part([[0.03 * s, 0.33 * s], [0.08 * s, 0.33 * s], [0.08 * s, 0.37 * s], [0.03 * s, 0.37 * s]], { fill: '#5a5650', shade: 0.3, inkW: 1, cast: false }); },
    horseshoe: (f, s) => { const pts = []; for (let k = 0; k <= 12; k++) { const th = Math.PI * 0.15 + Math.PI * 1.7 * k / 12; pts.push([Math.cos(th + Math.PI / 2) * 0.06 * s, 0.07 * s - Math.sin(th + Math.PI / 2) * 0.07 * s]); } f.line(pts, 5, '#1a120c'); f.line(pts, 3, '#4a4644'); },
    sickle: (f, s) => { f.line([[0, 0], [0, 0.2 * s]], 4, '#1a120c'); f.line([[0, 0], [0, 0.2 * s]], 2.6, '#5a4028'); f.line([[0, 0.2 * s], [0.08 * s, 0.24 * s], [0.16 * s, 0.2 * s], [0.18 * s, 0.1 * s]], 3.4, '#1a120c'); f.line([[0, 0.2 * s], [0.08 * s, 0.24 * s], [0.16 * s, 0.2 * s], [0.18 * s, 0.1 * s]], 1.8, '#6a6866'); },
    cup: (f, s) => { f.line([[0, 0], [0.01 * s, 0.03 * s]], 1.6, '#2a2018'); PR.tankard(f, 0.02 * s, 0.13 * s, '#6a6460'); },
    shirt: (f, s) => PR.hung(f, 0, 'shirt', '#8a826e'),
  };
  D.HUNG = HUNG;
  // a peg rail on a wall: a board with turned pegs; items: list of kinds (or null for an empty peg). at(s,t) on the wall plane,
  // s along the rail from s0 to s1 at height t; nrm: the wall's normal toward the room (for the peg's direction)
  D.pegRail = (at, s0, s1, t, items, o = {}) => {
    const n = items.length, q = [at(s0, t - 0.05), at(s1, t - 0.05), at(s1, t + 0.05), at(s0, t + 0.05)];
    raw(PLW([q[0], q[1], q[3]], cel(q.map(p => P(...p)), { Z: q[0][2], fill: o.col || '#4a3624', tex: 'url(#mottle)', texOp: 0.4 })));
    items.forEach((kind, i) => {
      const s = s0 + (s1 - s0) * (i + 0.5) / n, p = at(s, t), [x, y] = P(...p);
      raw(S.peg(p[0], p[1], p[2], { wood: true, dir: o.dir || [0.3, 0] }));
      if (kind) figProp(p[0], p[1] - 0.01, p[2] - 0.04, (f, u) => HUNG[kind](f, u), { tag: false });
    });
  };
  // one nail with something on it
  D.nailHang = (X, Y, Z, kind) => { raw(S.peg(X, Y, Z, {})); if (kind) figProp(X, Y - 0.005, Z - 0.02, (f, u) => HUNG[kind](f, u), { tag: false }); };
  return D;
};
