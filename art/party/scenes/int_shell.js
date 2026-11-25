// The abbey interior shell in Living Ink: grim/interior.js's box-set camera, room shell, doors, windows and writer, unchanged in
// geometry and output format, with the drawing replaced by the Living Ink scene kit (scenes/lik.js).
// Camera: eye 1.6 m, horizon 430, focal 900, cx 800, frame 1600 x 1000. Back wall faces us, side walls recede.
// Layers: bg (behind the keeper and roster), mid (in front of their legs, under hands that rest on it), fg (in front of
// everything), fx (painted glows and the value veil for the unlit preview only, class glow).
// v2 (2026-11-24): value grading (every shell plane gets zone hatching from the room's lights and its corners, filled in at
// write time once every light is known; the preview gets a stepped veil), barrel vaults, arched doors, back windows, and
// wall wear (patches, cracks, damp bloom, soot) through I.wear().
'use strict';
const fs = require('fs');
const path = require('path');
const W = 1600, H = 1000, HZ = 430, EYE = 1.6, FL = 900, CX = 800;
const KK = require('../worlds/kit_keepers');

module.exports = (room, o) => {
  // the abbey uses the keepers' warm light (kit_keepers KB): keyTint #ffd8a0, shadowTint #2e1e1a
  const S = require('./lik')({ W, H, HZ, E: EYE, FL, CX, seed: o.seed || 77, keyTint: '#ffd8a0', shadowTint: '#2e1e1a', figBase: s => KK.KB(s), wob: { f: 0.07, s: 1.2 }, gritF: 1.1, lightGain: o.lightGain });
  const { P, K, pp, p2, f1, INK, raw, layer, PLW, cel, boards, masonry, limewash, hatch3, planeShade, occBand, normalOf, lam, mix, hot, outline, HOT, PLANES, LIGHTS, addLight, through, R, castOn, shadowPoly, figProp, M, glow, slot, zoneHatch, gradeDk } = S;
  const HW = o.width / 2, D0 = 2.5, D1 = o.depth, HT = o.height;
  const SPR = o.vault ? o.spring : HT, CROWN = o.vault ? HT - o.spring : 0;
  const I = Object.assign({}, S, { HW, D0, D1, HT, SPR, CROWN, W, H, room });
  const nB = [0, 0, -1], nF = [0, 1, 0], nC = [0, -1, 0], nL = [1, 0, 0], nR = [-1, 0, 0];
  I.Yv = X => SPR + CROWN * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2));
  I.atB = (s, t) => [-HW + s, t, D1];
  I.atL = (s, t) => [-HW, t, D0 + s];
  I.atR = (s, t) => [HW, t, D0 + s];
  I.atF = (s, t) => [-HW + s, 0, D0 + t];
  let gid = 0;
  // grade a plane: zone hatching filled in at write time. pts3: three points on the plane (for its tag)
  I.grade = (at, Ls, Lt, pts3, go = {}) => { const k = `g${gid++}`; slot(k, () => PLW(pts3, zoneHatch(at, Ls, Lt, gradeDk(at, go), go.zh || {}))); };

  // a face of any box or plane as boards, shaded by the key light and hatched along its own surface
  I.woodFace = (q, col, o2 = {}) => {
    // o2.bias shifts the key-light term (beams up in the roof get little of it)
    // q: 4 corners [p0 (s=0,t=0), p1 (s=Ls,t=0), p2, p3 (s=0,t=Lt)] — boards run along s
    const n = normalOf(q[0], q[1], q[3]), l = lam(n) + (o2.bias || 0);
    const Ls = Math.hypot(...S.sub3(q[1], q[0])), Lt = Math.hypot(...S.sub3(q[3], q[0]));
    const at = (s, t) => { const u = s / Ls, v = t / Lt; return [0, 1, 2].map(i => q[0][i] + (q[1][i] - q[0][i]) * u + (q[3][i] - q[0][i]) * v + (q[0][i] - q[1][i] + q[2][i] - q[3][i]) * u * v); };
    const c = l < 0.05 ? mix(col, S.SHT, 0.45) : l > 0.45 ? mix(col, S.KEY, 0.06) : col;
    let s = boards(at, Ls, Lt, c, Object.assign({ bw: 0.16, knots: 0.3 }, o2));
    s += planeShade(at, Ls, Lt, n, { op: 0.38, bias: o2.bias || 0 });
    raw(PLW([q[0], q[1], q[3]], s));
    if (o2.grade) I.grade(at, Ls, Lt, [q[0], q[1], q[3]], o2.grade);
  };
  // an axis-aligned wooden box: the faces the camera can see, front last; plus its cast shadow on the floor
  I.woodBox = (x0, x1, y0, y1, z0, z1, col, o2 = {}) => {
    if (o2.cast !== false && y0 < 0.05) raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0, x1, y0, y1, z0, z1), [0, 1, 0], 0), (z0 + z1) / 2, { op: 0.3 })));
    if (x1 < 0) I.woodFace([[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]], col, Object.assign({ boards: o2.boards || 1 }, o2));
    if (x0 > 0) I.woodFace([[x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [x0, y0, z0]], col, Object.assign({ boards: o2.boards || 1 }, o2));
    if (y1 < EYE) I.woodFace([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], col, Object.assign({}, o2, { bw: o2.topBw || 0.16, boards: o2.topBoards }));
    if (y0 > EYE) I.woodFace([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col, o2);
    I.woodFace([[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]], col, o2);
  };
  // a stone box (chimney breast, plinth): masonry faces
  I.stoneFace = (q, col, o2 = {}) => {
    const n = normalOf(q[0], q[1], q[3]), Ls = Math.hypot(...S.sub3(q[1], q[0])), Lt = Math.hypot(...S.sub3(q[3], q[0]));
    const at = (s, t) => { const u = s / Ls, v = t / Lt; return [0, 1, 2].map(i => q[0][i] + (q[1][i] - q[0][i]) * u + (q[3][i] - q[0][i]) * v); };
    const l = lam(n), c = l < 0.05 ? mix(col, S.SHT, 0.4) : col;
    raw(PLW([q[0], q[1], q[3]], (o2.ashlar ? S.ashlar(at, Ls, Lt, c, Object.assign({ scale: 0.36, wscale: 0.45, vary: 0.24, chip: 0.5, mortar: 0.55, lost: 0.12, spall: 0.12, courses: [0.9, 0.55, 1.1, 0.4, 0.8, 1.0, 0.5] }, o2.ashlar === true ? {} : o2.ashlar)) : masonry(at, Ls, Lt, c, o2)) + planeShade(at, Ls, Lt, n, { op: 0.4 }) + (o2.after ? o2.after(at, Ls, Lt) : '')));
    if (o2.grade) I.grade(at, Ls, Lt, [q[0], q[1], q[3]], o2.grade);
    return at;
  };
  I.stoneBox = (x0, x1, y0, y1, z0, z1, col, o2 = {}) => {
    if (o2.cast !== false && y0 < 0.05) raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], shadowPoly(castOn(S.boxPts(x0, x1, y0, y1, z0, z1), [0, 1, 0], 0), (z0 + z1) / 2, { op: 0.3 })));
    if (x1 < 0) I.stoneFace([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], col, o2);
    if (x0 > 0) I.stoneFace([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], col, o2);
    if (y1 < EYE) raw(PLW([[x0, y1, z0], [x1, y1, z0], [x0, y1, z1]], cel(S.chip([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]].map(p => P(...p)), 0.3), { Z: z0, fill: mix(col, S.KEY, 0.12), tex: 'url(#mottle)', texOp: 0.5 })));
    I.stoneFace([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], col, o2);
  };
  // a beam or post of square section along one axis
  I.beam = (x0, x1, y0, y1, z0, z1, col, o2) => I.woodBox(x0, x1, y0, y1, z0, z1, col, Object.assign({ boards: 1, cast: false, nails: false, segs: 1 }, o2));
  // a straight rod between two world points (iron bar, pole, chain), inked
  I.rod = (p, q, col, w) => { const A = P(...p), B = P(...q); return `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="${f1(w + 2.2)}" stroke-linecap="round"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${col}" stroke-width="${f1(w)}" stroke-linecap="round"/><path d="M${f1(A[0] - w * 0.25)} ${f1(A[1])} L${f1(B[0] - w * 0.25)} ${f1(B[1])}" stroke="${mix(col, S.KEY, 0.4)}" stroke-width="${f1(Math.max(0.5, w * 0.3))}" opacity="0.5"/>`; };

  // ------------------------------------------------------------------ arches: points and the ring of wedge stones (voussoirs)
  I.archPts = (at, s0, s1, t0, ts, rise, n = 10) => { const pts = [at(s0, t0), at(s1, t0), at(s1, ts)]; for (let i = 1; i < n; i++) { const th = Math.PI * i / n, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2; pts.push(at(sm + Math.cos(th) * rw, ts + Math.sin(th) * rise)); } pts.push(at(s0, ts)); return pts; };
  I.arcPts = (at, s0, s1, ts, rise, n = 14) => { const sm = (s0 + s1) / 2, rw = (s1 - s0) / 2, out = []; for (let i = 0; i <= n; i++) { const th = Math.PI * (1 - i / n); out.push(at(sm + Math.cos(th) * rw, ts + Math.sin(th) * rise)); } return out; };
  I.archRing = (at, s0, s1, ts, rise, dep, col, n = 9, o2 = {}) => {
    let out = ''; const sm = (s0 + s1) / 2, rw = (s1 - s0) / 2;
    for (let i = 0; i < n; i++) {
      if (o2.skip && o2.skip(i)) continue;
      const t0 = Math.PI * i / n, t1 = Math.PI * (i + 1) / n, Q = (t, k) => P(...at(sm + Math.cos(t) * (rw + k), ts + Math.sin(t) * (rise + k)));
      const ps = [Q(t0, 0), Q((t0 + t1) / 2, 0), Q(t1, 0), Q(t1, dep), Q((t0 + t1) / 2, dep * (1.02 + R() * 0.06)), Q(t0, dep)];
      out += cel(S.chip(ps, 0.35), { Z: at(sm, ts)[2], fill: S.tone(i === (n >> 1) ? mix(col, S.KEY, 0.08) : col, 0.22), tex: 'url(#mottle)', texOp: 0.4 });
    }
    return PLW([at(0, 0), at(1, 0), at(0, 1)], out);
  };
  // jamb stones up each side of an opening
  I.jambs = (at, s0, s1, ts, col, w = 0.2, tb = 0) => { let out = ''; for (const s of [s0 - w, s1]) for (let t = tb; t < ts - 0.05; t += 0.36 + R() * 0.06) { const q = [at(s, t + 0.02), at(s + w, t + 0.02), at(s + w, Math.min(ts, t + 0.36)), at(s, Math.min(ts, t + 0.36))]; out += cel(S.chip(q.map(p => P(...p)), 0.4), { Z: q[0][2], fill: S.tone(mix(col, '#a89a80', 0.12), 0.2), tex: 'url(#mottle)', texOp: 0.4 }); } return PLW([at(0, 0), at(1, 0), at(0, 1)], out); };

  // ------------------------------------------------------------------ the shell
  const wallMat = (at, Ls, Lt, side) => o.lime
    ? limewash(at, Ls, Lt, side < 0 ? mix(o.lime, S.SHT, 0.38) : side > 0 ? mix(o.lime, '#fff0d8', 0.04) : o.lime, Object.assign({ flakes: Math.round(Ls * 0.22), flakeT: [0.2, 1.1], damp: 0.45, streaks: Math.round(Ls * 1.4), stone: o.wall }, o.limeOpts || {}))
    : o.stone === 'ashlar' ? S.ashlar(at, Ls, Lt, side < 0 ? mix(o.wall2 || o.wall, S.SHT, 0.3) : (o.wall), Object.assign({ scale: 0.42, wscale: 0.5, vary: 0.26, chip: 0.5, mortar: 0.55, lost: 0.12, spall: 0.12, damp: 0.6, dampCol: '#2a2a22', courses: [0.9, 0.7, 0.55, 0.8, 1.05, 0.6, 0.5, 0.75, 0.95, 0.65] }, o.wallOpts || {}))
    : masonry(at, Ls, Lt, side < 0 ? mix(o.wall2 || o.wall, S.SHT, 0.3) : (o.wall), Object.assign({ course: 0.38, block: 0.8, damp: 0.5, marks: 0.02 }, o.wallOpts || {}));
  // the grading each shell plane gets: light falloff plus occlusion into its edges (corners, under the ceiling, the floor seam)
  const G = o.grade || {};
  I.shell = () => {
    layer('bg');
    raw(`<rect width="${W}" height="${H}" fill="#0e0b09"/>`);
    const { atB, atL, atR } = I;
    // back wall (under a vault: clipped to the vault's curve)
    const backQ = o.vault ? (() => { const top = []; for (let i = 0; i <= 32; i++) { const X = -HW + 2 * HW * i / 32; top.push([X, I.Yv(X), D1]); } return [[-HW, 0, D1], [HW, 0, D1], ...top.reverse()]; })() : null;
    const backBody = wallMat(atB, 2 * HW, HT, 0) + planeShade(atB, 2 * HW, HT, nB) +
      occBand((s, t) => atB(s, t), 2 * HW, 0.3, { op: 0.4 }) + (o.vault ? '' : occBand((s, t) => atB(s, HT - t), 2 * HW, 0.35, { op: 0.5, cross: true })) +
      occBand((s, t) => atB(t, s), SPR, 0.35, { op: 0.45, ang: 0.4 }) + occBand((s, t) => atB(2 * HW - t, s), SPR, 0.3, { op: 0.35, ang: 0.4 });
    if (o.vault) through(backQ, () => raw(PLW([atB(0, 0), atB(1, 0), atB(0, 1)], backBody)));
    else raw(PLW([atB(0, 0), atB(1, 0), atB(0, 1)], backBody));
    const vaultEdge = (s, t) => o.vault ? I.Yv(-HW + s) - t : HT - t;
    I.grade(atB, 2 * HW, HT, [atB(0, 0), atB(1, 0), atB(0, 1)], Object.assign({ ao: [[(s, t) => t, 0.5, 0.55], [vaultEdge, 0.9, 0.8], [(s, t) => s, 0.8, 0.7], [(s, t) => 2 * HW - s, 0.7, 0.6]] }, G.back));
    // side walls: the left faces away from the key light (crosshatched), the right is lit
    for (const [side, at] of [[-1, atL], [1, atR]]) {
      const n = side < 0 ? nL : nR;
      raw(PLW([at(0, 0), at(1, 0), at(0, 1)], wallMat(at, D1 - D0, SPR, side) + planeShade(at, D1 - D0, SPR, n, { angA: 0.5, angB: -0.9, op: 0.5 }) +
        occBand((s, t) => at(D1 - D0 - t, s), SPR, 0.4, { op: 0.45, ang: 0.3 }) + occBand((s, t) => at(s, t), D1 - D0, 0.25, { op: 0.45 }) + occBand((s, t) => at(s, SPR - t), D1 - D0, 0.4, { op: 0.5, cross: true })));
      I.grade(at, D1 - D0, SPR, [at(0, 0), at(1, 0), at(0, 1)], Object.assign({ ao: [[(s, t) => t, 0.4, 0.5], [(s, t) => SPR - t, 0.9, 0.85], [(s, t) => D1 - D0 - s, 0.8, 0.65], [(s, t) => s, 1.2, 0.7]], bias: side < 0 ? 0.08 : 0 }, side < 0 ? G.left : G.right));
    }
    // floor
    const atF = I.atF;
    if (o.floor === 'stone') raw(PLW([[0, 0, 3], [1, 0, 3], [0, 0, 4]], S.ashlar((s, t) => atF(s, D1 - D0 - t), 2 * HW, D1 - D0, o.floorCol, Object.assign({ scale: 0.62, wscale: 0.55, vary: 0.18, chip: 0.5, mortar: 0.6, lost: 0.1, spall: 0.05, courses: [0.9, 0.75, 1.0, 0.7, 0.85, 1.1, 0.8] }, o.floorOpts || {})) +
      occBand((s, t) => [-HW + s, 0, D1 - t], 2 * HW, 0.45, { op: 0.42, cross: true }) + occBand((s, t) => [-HW + t, 0, D0 + s], D1 - D0, 0.5, { op: 0.45, ang: 0.2 }) + occBand((s, t) => [HW - t, 0, D0 + s], D1 - D0, 0.4, { op: 0.35, ang: 0.2 }) + (o.wearPath ? o.wearPath(atF) : '')));
    else {
      const fl = boards((s, t) => [-HW + t, 0, D0 + s], D1 - D0, 2 * HW, o.floorCol, { bw: 0.22, knots: 0.35, stains: 0.22, vary: 0.18 });
      raw(PLW([[0, 0, 3], [1, 0, 3], [0, 0, 4]], fl + occBand((s, t) => [-HW + s, 0, D1 - t], 2 * HW, 0.45, { op: 0.42, cross: true }) +
        occBand((s, t) => [-HW + t, 0, D0 + s], D1 - D0, 0.5, { op: 0.45, ang: 0.2 }) + occBand((s, t) => [HW - t, 0, D0 + s], D1 - D0, 0.4, { op: 0.35, ang: 0.2 }) +
        (o.wearPath ? o.wearPath(atF) : '')));
    }
    I.grade(atF, 2 * HW, D1 - D0, [[0, 0, 3], [1, 0, 3], [0, 0, 4]], Object.assign({ ao: [[(s, t) => D1 - D0 - t, 0.6, 0.6], [(s, t) => s, 0.9, 0.7], [(s, t) => 2 * HW - s, 0.8, 0.6]], front: [D0, D0 + 1.3, 0.85], lw: 0.75 }, G.floor));
    if (o.vault) { I.vault(D0, D1, o.vaultCol || o.wall); for (const z of o.ribs || []) I.rib(z, o.wall2 || o.wall); return; }
    // ceiling: boards on heavy beams running side to side, all facing away from the key light
    const atC = (s, t) => [-HW + s, HT, D0 + t];
    raw(PLW([atC(0, 0), atC(1, 0), atC(0, 1)], boards((s, t) => [-HW + t, HT, D0 + s], D1 - D0, 2 * HW, mix(o.ceilCol || '#3a2e22', S.SHT, 0.4), { bw: 0.3, nails: false, knots: 0.2, vary: 0.12 }) +
      planeShade(atC, 2 * HW, D1 - D0, nC, { op: 0.5, angA: 0.3, angB: -1.2 })));
    I.grade(atC, 2 * HW, D1 - D0, [atC(0, 0), atC(1, 0), atC(0, 1)], Object.assign({ bias: 0.3, lw: 0.7 }, G.ceil));
    for (let z = D1 - 0.4; z > D0; z -= o.beamGap || 1.6) I.beam(-HW, HW, HT - 0.3, HT, z, z + 0.24, o.beamCol || '#3a2c1e', { nails: false, bias: -0.55, vary: 0.15 });
  };
  // ------------------------------------------------------------------ a barrel vault from z0 to z1: stone courses running along the room,
  // each course its own (near) plane so the lighting can tag it; shaded by its own normal, graded darker to the crown
  I.vault = (z0, z1, col, o2 = {}) => {
    const n = 48, arc = [0];
    const pt = th => [HW * Math.cos(th), SPR + CROWN * Math.sin(th)];
    for (let i = 1; i <= n; i++) { const a = pt(Math.PI * (1 - (i - 1) / n)), b = pt(Math.PI * (1 - i / n)); arc.push(arc[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const Lt = arc[n], thOf = t => { let i = 1; while (i < n && arc[i] < t) i++; const u = (t - arc[i - 1]) / (arc[i] - arc[i - 1]); return Math.PI * (1 - (i - 1 + u) / n); };
    const atV = (s, t) => { const [x, y] = pt(thOf(t)); return [x, y, z0 + s]; };
    let t = 0, ci = 0; const ch = o2.course || 0.34, plan = o2.plan || o.vaultPlan;
    while (t < Lt - 0.02) {
      const h = Math.min(Lt - t, ch * (plan ? plan[ci++ % plan.length] * (0.9 + R() * 0.2) : (0.8 + R() * 0.4))), t0 = t, t1 = t + h, at = (s, tt) => atV(s, t0 + tt);
      const q = [at(0, 0), at(z1 - z0, 0), at(0, h)], nrm = normalOf(q[0], q[1], q[2]);
      const lift = lam(nrm), c = lift < 0.05 ? mix(col, S.SHT, 0.3) : col;
      raw(PLW(q, masonry(at, z1 - z0, h, c, { course: h * 2.2, block: (o2.block || 0.62) * (0.7 + R() * 0.7), vary: 0.24, chip: 0.5, mortar: 0.6 }) + planeShade(at, z1 - z0, h, nrm, { op: 0.42, angA: 0.3, angB: -1.1 })));
      const mid = (t0 + t1) / 2, crownK = 1 - Math.abs(mid - Lt / 2) / (Lt / 2);
      I.grade(at, z1 - z0, h, q, Object.assign({ bias: 0.12 + 0.25 * crownK, lw: 0.75, ao: [[(s) => s, 0.6, 0.6]] }, G.vault));
      t = t1;
    }
    I.vaultAt = atV; I.vaultLt = Lt;
  };
  // a transverse rib across the vault at depth z: a band of wedge stones following the curve
  I.rib = (z, col, dep = 0.24) => {
    let out = ''; const n = 13;
    for (let i = 0; i < n; i++) {
      const X0 = -HW + 2 * HW * i / n, X1 = -HW + 2 * HW * (i + 1) / n, d0 = dep * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (X0 / HW) ** 2))), d1 = dep * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (X1 / HW) ** 2)));
      const q = [[X0, I.Yv(X0) - 0.01, z], [X1, I.Yv(X1) - 0.01, z], [X1, I.Yv(X1) - d1, z], [X0, I.Yv(X0) - d0, z]];
      out += cel(S.chip(q.map(p => P(...p)), 0.3), { Z: z, fill: S.tone(col, 0.2), tex: 'url(#mottle)', texOp: 0.4 });
    }
    // its soffit (underside), facing down: a dark band under the ring
    const under = []; for (let i = 0; i <= 26; i++) { const X = -HW + 2 * HW * i / 26, d = dep * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2))); under.push(P(X, I.Yv(X) - d, z)); }
    const under2 = []; for (let i = 26; i >= 0; i--) { const X = -HW + 2 * HW * i / 26, d = dep * (0.5 + 0.5 * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2))); under2.push(P(X, I.Yv(X) - d, z + 0.3)); }
    raw(PLW([[0, 0, z], [1, 0, z], [0, 1, z]], `<path d="${p2([...under, ...under2])}" fill="${mix(col, S.SHT, 0.5)}"/><path d="${p2([...under, ...under2])}" fill="${S.hatchA(z)}" opacity="0.5"/>` + out));
  };

  // ------------------------------------------------------------------ the way out in a side wall: square timber frame or a round arch
  // Through it: the reveal, the threshold, and a slice of the garth at dusk (ground, the far range with a lit window, the Grey),
  // or d.beyond(WX, sd, out) for something else (the smithy's stair).
  I.door = (z0, z1, d = {}) => {
    const sd = d.side || -1, WX = sd * HW, at = (s, t) => [WX, t, s], ts = d.ts || 1.95, rise = d.rise === undefined ? (z1 - z0) / 2 : d.rise;
    const hole = d.square ? [at(z0, 0), at(z1, 0), at(z1, ts), at(z0, ts)] : I.archPts(at, z0, z1, 0, ts, rise, 12);
    const out = X => WX + sd * X;
    through(hole, () => {
      if (d.beyond) return d.beyond(WX, sd, out, hole);
      const XF = out(7), zf0 = z0 * 0.4, zf1 = z1 * 3.2, fp = (Z, Y) => [XF, Y, Z], zc = (z0 + z1) / 2 * (HW + 7) / HW;
      // the Grey: a pale, colourless dusk, hatched lightly from the top so it is never a flat fill
      const skyQ = [fp(zf0, 1.2), fp(zf1, 1.2), fp(zf1, 7), fp(zf0, 7)];
      raw(PLW([fp(zf0, 0), fp(zf1, 0), fp(zf0, 1)], `<g class="em">${cel(skyQ.map(p => P(...p)), { Z: 9, fill: '#a8a69c', band: 0, ink: false })}<path d="${pp(skyQ)}" fill="url(#mottle)" opacity="0.4"/></g>` +
        hatch3((s, t) => fp(zf0 + s, 3.2 + t), 0, zf1 - zf0, 0, 3.8, 0.15, { op: 0.22, ragged: 0.3 })));
      const wallP = [fp(zf0, -0.5), fp(zf1, -0.5), fp(zf1, 1.3), fp(zc, 1.7), fp(zf0, 1.15)];
      raw(PLW([fp(zf0, 0), fp(zf1, 0), fp(zf0, 1)], cel(wallP.map(p => P(...p)), { Z: 9, fill: '#3a342c' }) +
        hatch3((s, t) => fp(zf0 + s, -0.5 + t), 0, zf1 - zf0, 0, 2.0, 0.9, { op: 0.4 }) +
        cel([fp(zf0, 1.15), fp(zc, 1.7), fp(zf1, 1.3), fp(zf1, 1.6), fp(zc, 2.3), fp(zf0, 1.45)].map(p => P(...p)), { Z: 9, fill: '#2a2826' }) +
        cel([fp(zc + 0.5, 1.4), fp(zc + 0.9, 1.4), fp(zc + 0.9, 2.6), fp(zc + 0.5, 2.6)].map(p => P(...p)), { Z: 9, fill: '#2e2a26' })));
      raw(PLW([fp(zf0, 0), fp(zf1, 0), fp(zf0, 1)], `<g class="em">${cel([fp(zc - 0.25, 0.35), fp(zc + 0.45, 0.35), fp(zc + 0.45, 0.95), fp(zc - 0.25, 0.95)].map(p => P(...p)), { Z: 9, fill: '#e8963c', band: 2 })}</g>`));
      const mud = [[WX, 0, z0 - 0.4], [out(7), 0, zf0], [out(7), 0, zf1], [WX, 0, z1 + 0.4]];
      raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], cel(mud.map(p => P(...p)), { Z: 6, fill: '#3e3428', tex: 'url(#mottle)', texOp: 0.6 }) + hatch3((s, t) => [out(s), 0, z0 - 0.4 + t], 0, 7, 0, (z1 - z0) + 0.8, 0.2, { op: 0.3, ragged: 0.4 })));
      for (let k = 0; k < 5; k++) { const Z = z0 + (z1 - z0) * R(), X1 = out(0.6 + R() * 3); raw(PLW([[0, 0, 1], [1, 0, 1], [0, 0, 2]], cel(S.chip([[X1, 0.005, Z - 0.2], [X1 + sd * 0.5, 0.005, Z - 0.2], [X1 + sd * 0.5, 0.005, Z + 0.25], [X1, 0.005, Z + 0.25]].map(p => P(...p))), { Z, fill: S.tone('#6a645a') }))); }
      // the reveal: the wall is thick; its far jamb face in shadow, coursed stone
      const T = 0.32, rv = [[WX, 0, z1], [out(T), 0, z1], [out(T), ts + rise + 0.2, z1], [WX, ts + rise + 0.2, z1]];
      raw(PLW([rv[0], rv[1], rv[3]], masonry((s, t) => [WX + sd * s, t, z1], T, ts + rise + 0.2, '#4a443c', { course: 0.32, block: 0.3 }) + hatch3((s, t) => [WX + sd * s, t, z1], 0, T, 0, ts + rise + 0.2, 0.8, { op: 0.5 })));
    });
    if (d.light) addLight(...d.light); else addLight(WX - sd * 0.4, 1.8, (z0 + z1) / 2, d.I || 0.75, 5.0, d.col || [0.66, 0.66, 0.7]);
    if (d.square) {
      for (const [p, q] of [[[z0 - 0.12, 0], [z0, ts + 0.12]], [[z1, 0], [z1 + 0.12, ts + 0.12]], [[z0 - 0.12, ts], [z1 + 0.12, ts + 0.2]]]) I.woodFace([at(p[0], q[1]), at(q[0], q[1]), at(q[0], p[1]), at(p[0], p[1])], '#3e2e20', { boards: 1, knots: 0.3, segs: 1 });
    } else {
      raw(I.jambs(at, z0, z1, ts, d.ring || o.wall2 || o.wall));
      raw(I.archRing(at, z0, z1, ts, rise, 0.22, d.ring || o.wall2 || o.wall, 7));
    }
    // the worn threshold step into the room
    if (d.threshold !== false) raw(PLW([[WX, 0.12, z0], [WX - sd, 0.12, z0], [WX, 0.12, z1]], cel(S.chip([[WX, 0.12, z0 - 0.15], [WX - sd * 0.35, 0.12, z0 - 0.15], [WX - sd * 0.35, 0.12, z1 + 0.15], [WX, 0.12, z1 + 0.15]].map(p => P(...p)), 0.3), { Z: z0, fill: '#6a6256' })));
    if (d.threshold !== false) raw(PLW([[WX - sd * 0.35, 0, z0], [WX - sd * 0.35, 0, z1], [WX - sd * 0.35, 1, z0]], cel([[WX - sd * 0.35, 0, z0 - 0.15], [WX - sd * 0.35, 0.12, z0 - 0.15], [WX - sd * 0.35, 0.12, z1 + 0.15], [WX - sd * 0.35, 0, z1 + 0.15]].map(p => P(...p)), { Z: z0, fill: '#3e3830' })));
    hot('exit', 'To the garth', hole.map(p => P(...p)));
    if (d.outline) outline('exit', d.outline); else { const dep = d.square ? 0.14 : 0.2, head = d.square ? [at(z0 - dep, ts + dep), at(z1 + dep, ts + dep)] : I.arcPts(at, z0 - dep, z1 + dep, ts, rise + dep, 18), x = WX - sd * 0.01;
      outline('exit', [[[[x, 0.12, z0 - dep], ...head.map(p => [x, p[1], p[2]]), [x, 0.12, z1 + dep], [WX - sd * 0.36, 0.12, z1 + 0.15], [WX - sd * 0.36, 0.12, z0 - 0.15]], true]]); }
    return hole;
  };
  // ------------------------------------------------------------------ a window in the back wall showing the Grey: deep reveal, bars, light
  I.backWindow = (x0, x1, y0, y1, d = {}) => {
    const at = (s, t) => [s, t, D1], rise = (x1 - x0) / 2;
    const hole = d.square ? [at(x0, y0), at(x1, y0), at(x1, y1), at(x0, y1)] : I.archPts(at, x0, x1, y0, y1 - rise, rise, 12);
    through(hole, () => {
      const far = (u, v) => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * v, D1 + 0.81], sk = d.sky || '#9a9a92';
      const q = [far(-0.3, -0.2), far(1.3, -0.2), far(1.3, 1.3), far(-0.3, 1.3)];
      raw(PLW([q[0], q[1], q[3]], `<g class="em">${cel(q.map(p => P(...p)), { Z: D1, fill: mix(sk, '#d8d8d0', 0.25), band: 0, ink: false })}<path d="${pp(q)}" fill="url(#mottle)" opacity="0.35"/></g>` + hatch3((s, t) => far(-0.3 + s / (x1 - x0), 0.55 + t / (y1 - y0)), 0, (x1 - x0) * 1.6, 0, (y1 - y0) * 0.75, 0.12, { op: 0.18, ragged: 0.3 })));
      // the garth's far roofs and a chimney stack against the Grey, low in the opening
      const rl = [far(-0.3, -0.2)]; for (let k = 0; k <= 6; k++) { const u = -0.1 + 1.2 * k / 6; rl.push(far(u, 0.22 + (k % 2 ? 0.1 : 0) + R() * 0.06)); } rl.push(far(1.3, -0.2));
      raw(PLW([q[0], q[1], q[3]], cel(rl.map(p => P(...p)), { Z: D1, fill: mix(sk, '#1a1816', 0.6), band: 0 }) + (R() < 0.7 ? (() => { const u = 0.2 + R() * 0.6; return cel([far(u, 0.2), far(u + 0.08, 0.2), far(u + 0.08, 0.42), far(u, 0.42)].map(p => P(...p)), { Z: D1, fill: mix(sk, '#1a1816', 0.65), band: 0 }); })() : '')));
      // the reveal: sill (lit, faces up), the sides, the head (faces down, dark); the wall is 0.8 m thick
      raw(PLW([[x0, y0, D1], [x1, y0, D1], [x0, y0, D1 + 1]], cel([[x0, y0, D1], [x1, y0, D1], [x1, y0, D1 + 0.8], [x0, y0, D1 + 0.8]].map(p => P(...p)), { Z: D1, fill: d.sill || '#6a6252', tex: 'url(#mottle)', texOp: 0.5 })));
      for (const X of [x0, x1]) { if ((X === x0 && x0 > 0) || (X === x1 && x1 < 0)) { const sq = [[X, y0, D1], [X, y0, D1 + 0.8], [X, y1, D1 + 0.8], [X, y1, D1]]; raw(PLW([sq[0], sq[1], sq[3]], masonry((s, t) => [X, y0 + t, D1 + s], 0.8, y1 - y0, X > 0 ? '#4a443a' : '#5a5448', { course: 0.3, block: 0.35 }) + (X > 0 ? hatch3((s, t) => [X, y0 + t, D1 + s], 0, 0.8, 0, y1 - y0, 0.7, { op: 0.45 }) : ''))); } }
      for (let i = 1; i < (d.bars || 4); i++) { const X = x0 + (x1 - x0) * i / (d.bars || 4); raw(I.rod([X, y0, D1 + 0.4], [X, y1 + 0.2, D1 + 0.4], '#2a2826', 2.5)); }
      raw(I.rod([x0 - 0.1, (y0 + y1) / 2 - 0.1, D1 + 0.4], [x1 + 0.1, (y0 + y1) / 2 - 0.1, D1 + 0.4], '#2a2826', 2));
    });
    if (!d.square) raw(I.archRing(at, x0, x1, y1 - rise, rise, 0.16, o.wall2 || o.wall, 7));
    raw(I.jambs(at, x0, x1, y1 - (d.square ? 0 : rise), o.wall2 || o.wall, 0.14, o.jambFix ? y0 : 0));   // o.jambFix: start at the sill (2026-11-24; earlier rooms ran them from the floor)
    // the sill stone below the opening, a drip of damp under it
    raw(PLW([[0, 0, D1], [1, 0, D1], [0, 1, D1]], cel(S.chip([at(x0 - 0.14, y0 - 0.12), at(x1 + 0.14, y0 - 0.12), at(x1 + 0.14, y0), at(x0 - 0.14, y0)].map(p => P(...p)), 0.3), { Z: D1, fill: mix(o.wall2 || o.wall, '#a89a80', 0.2) }) +
      S.stain(...P((x0 + x1) / 2, y0 - 0.35, D1), K(D1) * 0.18, '#2a2a1a', 0.3)));
    addLight((x0 + x1) / 2, (y0 + y1) / 2 - 0.2, D1 - 0.6, d.I || 0.7, d.range || 6.5, [0.62, 0.66, 0.74]);
    // a cold shaft of the Grey falling into the room (preview only)
    layer('fx'); raw(S.GLOW(`<path d="${pp([[x0, y1, D1], [x1, y1, D1], [x1 + 1.4, 0, D1 - 3.2], [x0 + 0.2, 0, D1 - 3.2]])}" fill="#d8dcd8" opacity="0.045"/>`)); layer(d.layer || 'bg');
    return hole;
  };

  // ------------------------------------------------------------------ wall wear: patches, cracks, damp bloom, soot, on any plane at(s,t)
  // w: { patches: [[s,t,w,h,col,square]], cracks: [[s,t,len,ang]], bloom: [[s,t,w,h]], soot: [[s0,s1,t0,t1,op]] }
  I.wear = (at, pts3, w = {}) => {
    let s = '';
    for (const [ps, pt, pw, ph, col, sq] of w.patches || []) s += S.patch(at, ps, pt, pw, ph, col, { square: sq });
    for (const [bs, bt, bw, bh] of w.bloom || []) s += S.bloomDamp(at, bs, bt, bw, bh, w.bloomCol ? { col: w.bloomCol } : {});
    for (const [cs, ct, cl, ca] of w.cracks || []) s += S.crack(at, cs, ct, cl, ca);
    for (const [s0, s1, t0, t1, op] of w.soot || []) s += S.soot(at, s0, s1, t0, t1, { op: op ?? 0.2 });
    raw(PLW(pts3, s));
  };

  // ------------------------------------------------------------------ write everything out
  // outDir: where the layers, light file and hotspots go (the game's grim/hub/int names). o.layers: which layers exist
  I.write = (keeper, extra = {}, outDir, wo = {}) => {
    S.runDeferred();
    const layers = wo.layers || ['bg', 'mid', 'fg'];
    // the preview's value veil goes under the painted glows in fx
    const fxBody = S.LAY.fx || []; S.LAY.fx = [S.veil(Object.assign({ top: 150, bottom: 150, corners: [[0, 0, 420], [W, 0, 420], [0, H, 380], [W, H, 380]] }, wo.veil || {})), ...fxBody];
    fs.mkdirSync(outDir, { recursive: true });
    for (const l of layers) fs.writeFileSync(path.join(outDir, `${room}__${l}.svg`), S.svgLayer(l));
    fs.writeFileSync(path.join(outDir, `${room}__fx.svg`), S.svgLayer('fx', { plain: true }));
    const all = layers.map(l => S.svgLayer(l)).map(s => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''));
    fs.writeFileSync(path.join(outDir, `${room}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${all.join('')}${S.svgLayer('fx', { plain: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`);
    fs.writeFileSync(path.join(outDir, `${room}.light.json`), JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: EYE, focal_px: FL, cx: CX }, planes: PLANES, lights: LIGHTS }));
    const f = n => +(+n).toFixed(1);
    const KP = Object.assign({ feet: P(keeper.X, 0, keeper.Z).map(f), height_px: f(K(keeper.Z) * keeper.h), z: keeper.Z, flip: false, figure: [170, 830] }, keeper);
    if (keeper.cutY !== undefined) KP.over_cut = f(P(0, keeper.cutY, keeper.cutZ)[1]);
    HOT.keeper = { label: keeper.label, poly: [] };
    fs.writeFileSync(path.join(outDir, `${room}_hotspots.json`), JSON.stringify(Object.assign({ w: W, h: H, room, camera: { horizon: HZ, eye_m: EYE, focal_px: FL, cx: CX }, hotspots: HOT, keeper: KP, panel: o.panel, draw_order: wo.drawOrder || ['bg', 'keeper', 'mid', 'fg'] }, extra), null, 1));
    console.log(room, PLANES.length, 'planes', LIGHTS.length, 'lights', Object.keys(HOT).join(','));
  };
  layer('bg');
  return I;
};
