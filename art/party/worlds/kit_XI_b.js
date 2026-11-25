// World XI, The Stilled Spire, second batch: local helpers on top of kit_XI (required and re-exported, never edited),
// plus anatomy helpers borrowed from the reviewed kit_IX (openHand, jointLimb, fistDetail, hairClump, crease...).
// Frost (dominant) stills and preserves: rime on the windward (drawing-right, front) and upper faces, icicles plumb in
// screen space, fur and hair frozen into faceted plates, bodies stopped mid-motion. Lightning fuses brass and leaves
// aurora-green Lichtenberg burns. Palette: brass, pale blue, aurora green, plus ink, bone and grey.
// No eye motifs (XI is not a void world): lenses and mirrors are shown at an angle, with the room reflected in them,
// cracks, frost and brass cells, never a round dark centre in a ring.
'use strict';
const K = require('../kit');
const XI = require('./kit_XI');
const IX = require('./kit_IX');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { P, spline, clipDraw, R, scatter, hard } = XI;
const angOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);

// frozen fur texture: short clumped strokes combed along +x, rime specks
function furTex(f) {
  const s = f.o.seed, r = E.rng(s * 7 + 3); let fu = '';
  for (let i = 0; i < 50; i++) { const x = r() * 40, y = r() * 40, a = (r() - 0.5) * 0.6, l = 5 + r() * 8; fu += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(Math.cos(a) * l * 0.5).toFixed(1)},${(Math.sin(a) * l * 0.5 + 1.2).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" fill="none" stroke="${r() > 0.4 ? INK : '#eef3f6'}" stroke-width="${(0.7 + r() * 0.6).toFixed(1)}" opacity="${r() > 0.5 ? 0.5 : 0.38}"/>`; }
  f.defs.push(`<pattern id="fzfur${s}" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(70)">${fu}</pattern>`);
  return 'fzfur' + s;
}

// fur frozen into faceted plates over a region (a mass of hide): each plate a flat-sided shard of hair, a lit facet on the
// key-light side, an inked lower edge with a tuft fringe; plates lean with `dir` (the lie of the coat). clip: the region.
function furPlates(f, clip, c, rx, ry, n, o = {}) {
  const dir = o.dir ?? 0.3, s = o.s ?? 1, col = o.col || '#8a8e92';
  clipDraw(f, clip, () => {
    for (let i = 0; i < n; i++) {
      const p = scatter(f, c, rx, ry), w = R(f, 22, 40) * s, h = R(f, 12, 22) * s, a = dir + (f.r() - 0.5) * 0.5;
      const q = [[-w / 2, -h * 0.3], [w * 0.1, -h * 0.5], [w / 2, -h * 0.1], [w * 0.4, h * 0.5], [-w * 0.3, h * 0.45]].map(v => add(p, rot(v, a)));
      const lit = f.r() > 0.5;
      f.flat(hard(q), lit ? (o.lite || P.iceL) : (o.dark || '#2a3240'), { op: (lit ? 0.22 : 0.26) * (o.op ?? 1) });
      f.line([q[4], q[3], q[2]], 1.1, INK, { op: 0.55, straight: true });
      for (let k = 0; k < 3; k++) { const b = lerp(q[4], q[3], 0.2 + k * 0.3); f.line([b, add(b, rot([4 * s, 6 * s], a))], 0.9, INK, { op: 0.45 }); }
      if (lit) f.line([q[0], q[1], q[2]], 1, '#f4f8fa', { op: 0.5, straight: true });
    }
    if (o.col) void col;
  });
}

// a ridge of hair standing straight up from the strike and frozen that way, along a polyline (root line); each spike a
// tapered tuft pointing along `up` (default plumb up), with a rime tip. len: spike length.
function bristleRidge(f, pts, len, o = {}) {
  const C = spline(pts, 4), n = o.n || Math.round(C.length / 1.6), up = o.up || [0, -1], col = o.col || '#5e6068';
  for (let i = 0; i < n; i++) {
    const t = (i + f.r() * 0.6) / n, b = C[Math.min(C.length - 1, Math.floor(t * (C.length - 1)))];
    const l = len * (0.55 + f.r() * 0.6) * (o.taper ? Math.sin(Math.PI * (0.1 + 0.8 * t)) : 1), lean = (f.r() - 0.5) * 0.35 + (o.lean || 0);
    const ci = Math.min(C.length - 1, Math.floor(t * (C.length - 1))), tg = E.norm(sub(C[Math.min(C.length - 1, ci + 1)], C[Math.max(0, ci - 1)])), nrm = o.out ? mul([-tg[1], tg[0]], o.out) : up;
    const d = rot(nrm, lean), w = (o.w || 7) * (0.7 + f.r() * 0.5), nn = [-d[1], d[0]], tip = add(b, mul(d, l));
    const sp = [add(b, mul(nn, w / 2)), add(lerp(b, tip, 0.55), mul(nn, w * 0.22)), tip, add(lerp(b, tip, 0.5), mul(nn, -w * 0.3)), add(b, mul(nn, -w / 2))];
    f.flat(sp, INK, { op: 0.9 }); f.flat(sp.map(q => add(lerp(q, b, 0.12), mul(nn, -0.6))), f.r() > 0.4 ? col : mix(col, '#d8e2e8', 0.35), { op: 0.95 });
    f.line([add(b, mul(nn, w * 0.1)), lerp(b, tip, 0.8)], 0.8, '#eef4f6', { op: 0.5 });
    if (o.rime !== false && f.r() < 0.5) f.line([add(lerp(b, tip, 0.45), mul(nn, -w * 0.25)), add(lerp(b, tip, 0.8), mul(nn, -w * 0.12))], 1.4, P.rime, { op: 0.8 });
    if (o.icicle && f.r() < o.icicle) XI.icicle(f, add(lerp(b, tip, 0.7), [0, 1]), 6 + f.r() * 6, 2.4);
  }
}

// a glazed surface seen at an angle (a lens, a speculum mirror, a glass case): never a round dark centre. Fills the
// region with a cold sheen, reflects the room (a slanted window with bars, a vault rib, a dome slit) as soft bands
// skewed along the surface, frosts it from one rim, and lays a single crack across. region: polygon; o.axis: the
// direction the surface is foreshortened along (screen radians); o.base colour; o.frost 0..1 (how blind); o.crack: [a,b].
function glazed(f, region, o = {}) {
  const bb = E.bbox(region), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], Rw = Math.max(bb[2] - bb[0], bb[3] - bb[1]);
  const ax = o.axis ?? 0, d = [Math.cos(ax), Math.sin(ax)], nn = [-d[1], d[0]];
  f.part(region, { fill: o.base || '#a9bcc6', shadow: o.shadow || '#4a5a6a', light: '#f2f8fa', shade: 0.3, inkW: o.inkW ?? 1.4, hatch: false, cast: false, tex: 'rime' + f.o.seed, texOp: 0.25, k: o.k ?? 1 });
  clipDraw(f, region, () => {
    // the room in the glass: a tall window (pale) with two bars, a dark vault rib, all skewed along the surface
    const W0 = o.win || [0.15, -0.1];
    const wc = add(c, add(mul(d, W0[0] * Rw), mul(nn, W0[1] * Rw)));
    const wq = [[-0.09, -0.28], [0.09, -0.32], [0.11, 0.26], [-0.07, 0.3]].map(([u, v]) => add(wc, add(mul(d, u * Rw), mul(nn, v * Rw))));
    f.flat(wq, '#eef6fa', { op: 0.55 });
    for (const u of [-0.035, 0.0, 0.035]) f.line([add(wc, add(mul(d, u * Rw), mul(nn, -0.3 * Rw))), add(wc, add(mul(d, (u + 0.015) * Rw), mul(nn, 0.28 * Rw)))], Math.max(1, Rw * 0.008), '#3a4656', { op: 0.45 }); // lancet mullions, no transom
    f.flat([add(wc, add(mul(d, -0.09 * Rw), mul(nn, -0.28 * Rw))), add(wc, add(mul(d, 0.0), mul(nn, -0.4 * Rw))), add(wc, add(mul(d, 0.09 * Rw), mul(nn, -0.32 * Rw)))], '#eef6fa', { op: 0.45 }); // the pointed head of the window
    const rib = [-0.45, -0.2, 0.05, 0.3, 0.5].map((u, i) => add(c, add(mul(d, (u) * Rw), mul(nn, (0.32 - 0.5 * Math.sin(i / 4 * Math.PI) * 0.6) * Rw))));
    f.stroke(rib, Math.max(5, Rw * 0.06), '#2a3444', { op: 0.35 });
    // a broad soft sheen band and a darker band of the floor
    f.flat([add(c, add(mul(d, -0.6 * Rw), mul(nn, -0.42 * Rw))), add(c, add(mul(d, 0.6 * Rw), mul(nn, -0.32 * Rw))), add(c, add(mul(d, 0.6 * Rw), mul(nn, -0.2 * Rw))), add(c, add(mul(d, -0.6 * Rw), mul(nn, -0.3 * Rw)))], '#ffffff', { op: 0.18 });
    f.flat([add(c, add(mul(d, -0.6 * Rw), mul(nn, 0.3 * Rw))), add(c, add(mul(d, 0.6 * Rw), mul(nn, 0.38 * Rw))), add(c, add(mul(d, 0.6 * Rw), mul(nn, 0.7 * Rw))), add(c, add(mul(d, -0.6 * Rw), mul(nn, 0.7 * Rw)))], '#33404e', { op: 0.3 });
    // frost blinding from the rim: a hoar mask and feathered rime
    const fr = o.frost ?? 0.6;
    if (fr > 0) { XI.hoar(f, add(c, mul(nn, -0.32 * Rw)), Rw * 0.6, Rw * 0.34, 0.6 + fr * 0.3); XI.hoar(f, add(c, add(mul(d, 0.38 * Rw), mul(nn, 0.1 * Rw))), Rw * 0.3, Rw * 0.4, 0.4 + fr * 0.3); f.flat(region.map(q => lerp(q, c, 0.0)), '#e6eef2', { op: 0.12 + fr * 0.25 }); }
    if (o.crack) { const [a, b] = o.crack, pts = [a]; for (let i = 1; i < 6; i++) pts.push(add(lerp(a, b, i / 6), mul(nn, (f.r() - 0.5) * Rw * 0.04))); pts.push(b); f.line(pts, 2.2, INK, { op: 0.8, straight: true }); f.line(pts.map(q => add(q, [1.2, 1.2])), 1, '#ffffff', { op: 0.7, straight: true }); for (let i = 1; i < 5; i++) { const q = pts[i], br = add(q, rot([Rw * 0.05, 0], angOf(a, b) + (i % 2 ? 0.9 : -0.9))); f.line([q, br], 1, INK, { op: 0.6 }); } }
    if (o.after) o.after(c, d, nn, Rw);
  });
}

// a hoof shod in iron, cleft, with ice balled in the cleats. T: toe contact; s: size px; dir +1 toe right; o.lift: the
// hoof is off the ground (tilted by o.tilt).
function hoof(f, T, s, dir, look, o = {}) {
  const tl = o.tilt || 0, Fh = pts => pts.map(([u, v]) => add(T, rot([u * s * dir, v * s], tl * dir)));
  const wall = Fh([[0.1, 0], [-0.9, 0], [-1.0, -0.42], [-0.62, -0.86], [-0.1, -0.8], [0.12, -0.3]]);
  f.part(hard(wall), look);
  f.line(Fh([[-0.34, -0.82], [-0.3, -0.08]]), 1.6, INK, { op: 0.75 }); // the cleft
  for (let i = 0; i < 4; i++) f.line(Fh([[-0.9 + i * 0.25, -0.5 + i * 0.1], [-0.8 + i * 0.25, -0.1]]), 0.9, '#000', { op: 0.35 }); // growth rings
  f.part(hard(Fh([[0.16, 0.04], [-0.96, 0.04], [-0.94, -0.1], [0.12, -0.1]])), XI.IR(f, { inkW: 1, cast: false, fill: P.ironL }));
  f.line(Fh([[0.1, -0.04], [-0.8, -0.04]]), 1.2, P.steelL, { op: 0.7 }); // worn bright
  for (const u of [-0.7, -0.2]) f.rivet(Fh([[u, -0.04]])[0], Math.max(1.4, s * 0.05), P.steelL);
  if (o.ice !== false) for (const [u, w] of [[-0.36, 0.09], [-0.82, 0.06]]) { const q = Fh([[u, -0.02]])[0]; f.flat([add(q, [-s * w, 0]), add(q, [0, -s * w * 0.9]), add(q, [s * w, 0]), add(q, [0, s * 0.03])], P.rime, { op: 0.85 }); } // ice packed in the cleft and at the heel
  return wall;
}

// a canine paw planted on the ground: heel pad behind, four knuckled toes, claws, ice balled between. T: centre of toes.
function paw(f, T, s, dir, look, o = {}) {
  const gy = o.gy ?? T[1], X = u => T[0] + dir * u * s;
  f.part([[X(-1.0), gy - 3, 1], [X(-1.1), gy - s * 0.55], [X(-0.6), gy - s * 0.95], [X(0.3), gy - s * 1.0], [X(0.9), gy - s * 0.7], [X(1.25), gy - s * 0.35], [X(1.3), gy - 2, 1]], look);
  for (let i = 0; i < 3; i++) {
    const tx = X(0.0 + i * 0.42);
    f.part([[tx - dir * s * 0.32, gy - 1, 1], [tx - dir * s * 0.34, gy - s * 0.45], [tx - dir * s * 0.08, gy - s * 0.7], [tx + dir * s * 0.24, gy - s * 0.6], [tx + dir * s * 0.38, gy - s * 0.3], [tx + dir * s * 0.34, gy - 1, 1]], Object.assign({}, look, { inkW: 1.2, inkHeavy: 1.8, cast: false, fill: mix(look.fill, '#000', 0.08 * i) }));
    f.part([[tx + dir * s * 0.28, gy - s * 0.34], [tx + dir * s * 0.58, gy - s * 0.12], [tx + dir * s * 0.52, gy - 1, 1], [tx + dir * s * 0.3, gy - s * 0.1]], { fill: '#2a2a2e', shade: 0.3, inkW: 1, cast: false, light: '#8a8e96' });
    f.line([[tx - dir * s * 0.12, gy - s * 0.6], [tx + dir * s * 0.12, gy - s * 0.52]], 1, '#f2f6f8', { op: 0.45 });
    if (o.ice !== false) f.flat(ell([tx - dir * s * 0.4, gy - s * 0.12], s * 0.12, s * 0.1, 0, 7), P.rime, { op: 0.9 });
  }
  f.part([[X(-1.05), gy - s * 0.5], [X(-0.7), gy - s * 0.66], [X(-0.5), gy - s * 0.28], [X(-0.85), gy - 3]], Object.assign({}, look, { inkW: 1, cast: false }));
}

// a quadruped leg in three bones (upper, lower, pastern) from kit_VIII's Magma Hound habits: muscled segments that
// overlap at each joint, a bony point at the elbow or hock, a sloped pastern into a weight-bearing foot.
// L = {H, K, A, T} (shoulder/hip, elbow/stifle, wrist/hock, ground contact). front: true for a foreleg.
// o.w: [upper top, upper bottom, lower bottom, pastern] widths; o.look; o.foot(f, L) draws the foot; o.pre bone prefix.
function quadLeg(f, k, L, front, o = {}) {
  const look = o.look, w = o.w || [110, 56, 34, 30], part = o.part ?? 7, pre = o.pre || 'leg_';
  if (part & 1) {
    f.bone(`${pre}${k}_1`);
    const d = f.part(limb(L.H, L.K, w[0], w[1], front ? { steps: 12, capK: 0.9, p: [[0.55, 0.26, 0.2]], q: [[0.25, 0.12, 0.18]] } : { steps: 12, capK: 0.9, p: [[0.4, 0.3, 0.22]], q: [[0.45, 0.16, 0.2]] }), Object.assign({ k: 0.9 }, look));
    f.stroke(front ? [lp(L.H, L.K, 0.2, w[0] * 0.15), lp(L.H, L.K, 0.75, w[1] * 0.18)] : [lp(L.H, L.K, 0.15, -w[0] * 0.18), lp(L.H, L.K, 0.6, 4), lp(L.H, L.K, 0.9, w[1] * 0.18)], 3, INK, { op: 0.5 });
    if (o.after1) o.after1(d);
  }
  if (part & 2) {
    f.bone(`${pre}${k}_2`);
    const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]];
    if (front) {
      f.part(limb(L.K, L.A, w[1] * 0.92, w[2], { steps: 10, capK: 0.9, q: [[0.22, 0.2, 0.18]] }), Object.assign({ k: 0.9 }, look));
      f.part([add(L.K, mul(nk, w[1] * 0.2)), add(add(L.K, mul(nk, w[1] * 0.58)), mul(dk, -w[1] * 0.1)), add(add(L.K, mul(nk, w[1] * 0.56)), mul(dk, w[1] * 0.26)), add(add(L.K, mul(nk, w[1] * 0.22)), mul(dk, w[1] * 0.44))], Object.assign({}, look, { fill: mix(look.fill, '#000', 0.12), inkW: 1.2, inkHeavy: 1.6, cast: false })); // elbow point
    } else {
      f.part(limb(L.K, L.A, w[1] * 1.1, w[2], { steps: 10, capK: 0.9, p: [[0.22, 0.3, 0.18]] }), Object.assign({ k: 0.9 }, look));
      f.part([add(L.A, mul(nk, w[2] * 0.2)), add(add(L.A, mul(nk, w[2] * 0.75)), mul(dk, -w[2] * 0.3)), add(add(L.A, mul(nk, w[2] * 0.7)), mul(dk, w[2] * 0.25)), add(L.A, mul(dk, w[2] * 0.45))], Object.assign({}, look, { fill: mix(look.fill, '#000', 0.12), inkW: 1.2, inkHeavy: 1.6, cast: false })); // hock point
    }
    f.line([lp(L.K, L.A, 0.15, front ? -w[2] * 0.25 : w[2] * 0.25), lp(L.K, L.A, 0.85, front ? -w[2] * 0.2 : w[2] * 0.2)], 1.2, '#eef4f6', { op: 0.35 });
    if (o.after2) o.after2();
  }
  if (part & 4) {
    f.bone(`${pre}${k}_3`);
    const pt = o.pastern || [L.T[0] - (o.dir || 1) * w[3] * 0.4, L.T[1] - w[3] * 1.1];
    f.part(K.chain([lerp(L.A, pt, -0.12), L.A, lerp(L.A, pt, 0.55), pt], [w[2] * 0.95, w[2] * 0.9, w[3] * 0.8, w[3]], { steps: 6 }), Object.assign({ k: 0.9 }, look));
    f.part(ell(L.A, w[2] * 0.5, w[2] * 0.42, 0, 10), Object.assign({}, look, { fill: mix(look.fill, '#fff', 0.05), inkW: 1, inkHeavy: 1.2, cast: false })); // the knob of the joint
    if (o.foot) o.foot(f, L, pt);
    if (o.after3) o.after3(pt);
  }
}

// a felt slipper wrapped in rags, side-on: toe at `toe` on the ground, dir +1 right, s = foot unit px
function ragSlipper(f, toe, s, look, o = {}) {
  const gy = toe[1], X = u => toe[0] - s * 1.05 + u * s, sh0 = o.shaft ?? 0.8;
  // heel, ankle shaft (the rags wound up over the ankle), instep, a soft rounded toe
  const sh = [[X(0.04), gy, 1], [X(-0.04), gy - s * 0.2], [X(0.02), gy - s * 0.5], [X(0.06), gy - s * sh0], [X(0.36), gy - s * (sh0 + 0.02)], [X(0.4), gy - s * 0.52], [X(0.62), gy - s * 0.4], [X(0.86), gy - s * 0.3], [X(1.04), gy - s * 0.2], [X(1.1), gy - s * 0.08], [X(1.0), gy, 1]];
  f.part(sh, look);
  const rag = o.rag || '#8a8478';
  // rag bands wound round the foot and ankle: broad quads crossing the foot on a slant, each with an inked lower edge
  const bands = [[0.06, 0.66, 0.38, 0.74], [0.04, 0.42, 0.42, 0.56], [0.3, 0.06, 0.56, 0.44], [0.54, 0.04, 0.78, 0.34]];
  for (const [u0, v0, u1, v1] of bands) {
    const a = [X(u0), gy - s * v0], b = [X(u1), gy - s * v1], dn = [0, s * 0.12];
    const q = [a, b, add(b, dn), add(a, dn)];
    f.part(q, { fill: rag, shadow: mix(rag, '#000', 0.5), shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'weave' + f.o.seed, texOp: 0.4, k: 0.6 });
    f.line([add(a, [0, 1]), add(b, [0, 1])], 0.9, mix(rag, '#fff', 0.4), { op: 0.6 });
  }
  f.line([[X(0.36), gy - s * 0.78], [X(0.48), gy - s * 0.9], [X(0.44), gy - s * 1.02]], 1.8, rag); // a loose rag end
  f.part([[X(-0.02), gy - 4], [X(1.06), gy - 4], [X(1.0), gy, 1], [X(0.04), gy, 1]], { fill: '#1a1816', shade: 0.2, inkW: 1, cast: false }); // felt sole
  XI.rimeCrust(f, [[X(0.6), gy - s * 0.42], [X(0.86), gy - s * 0.32], [X(1.06), gy - s * 0.16]], s * 0.09, [1, -0.3]);
}

// spectacles frosted white, set on a face frame hF (B.head units): two lenses seen from the side, the near one a narrow
// frosted oval (white, never a dark pupil), the bridge, the temple arm to the ear.
function frostSpecs(f, hF, o = {}) {
  const c1 = hF([[0.12, -0.055]])[0], c2 = hF([[0.3, -0.06]])[0], r = o.r || 1;
  // the lenses are foreshortened ovals of frosted glass, ice-grey and broken by hoar and a crack: never a white disc
  // that could read as a staring eye (XI is not a void world)
  const L1 = hF(ell([0.12, -0.055], 0.05 * r, 0.058 * r, 0.5, 14)), L2 = hF(ell([0.31, -0.06], 0.022 * r, 0.05 * r, 0.2, 12));
  for (const Lx of [L2, L1]) { f.flat(Lx, '#a8b8c4', { op: 0.7 }); f.flat(Lx.slice(0, 7), '#dce6ec', { op: 0.45 }); f.line(Lx.concat([Lx[0]]), 1.8, P.brassD); f.line(Lx.slice(9, 14), 1, P.brassL, { op: 0.8 }); }
  XI.hoar(f, c1, 10, 8, 0.7); f.line([hF([[0.08, -0.1]])[0], hF([[0.12, -0.05]])[0], hF([[0.15, -0.02]])[0]], 0.9, INK, { op: 0.6 });
  f.line([hF([[0.195, -0.06]])[0], hF([[0.24, -0.07]])[0], hF([[0.28, -0.065]])[0]], 1.6, P.brassD); // bridge
  f.line([hF([[0.045, -0.06]])[0], hF([[-0.1, -0.05]])[0], hF([[-0.2, -0.0]])[0]], 1.6, P.brassD); // temple arm to the ear
  void c2;
}

// ---- a pointing hand: the forefinger out along the arm's line, the other three curled, the thumb tucked; back of hand up
function pointHand(f, wrist, a, s, look, o = {}) {
  // a fist on the arm's line (back of the hand up, fingers curled under), with the forefinger straight out along the line
  const fs = s * 0.46, c = add(wrist, rot([fs * 0.55, 0], a)), sg = o.flip ? -1 : 1;
  const F = frame(c, a, fs), FF = pts => F(pts.map(([u, v]) => [u, v * sg]));
  const F0 = B.fist(f, c, a, fs, look.fill, { shadow: look.shadow, tex: look.tex, texOp: 0.4, flip: o.flip, scale: 1.0 });
  const k0 = [0.3, -0.42], k1 = [0.95, -0.46], k2 = [1.4, -0.47], k3 = [1.78, -0.46];
  const fin = FF([[k0[0], k0[1] - 0.15], [k1[0], k1[1] - 0.14], [k2[0], k2[1] - 0.12], [k3[0] - 0.04, k3[1] - 0.1], [k3[0] + 0.06, k3[1]], [k3[0] - 0.04, k3[1] + 0.1], [k2[0], k2[1] + 0.12], [k1[0], k1[1] + 0.14], [k0[0], k0[1] + 0.16]]);
  f.part(fin, Object.assign({}, look, { cast: false, inkW: 1.3, inkHeavy: 1.8, k: 0.8, maxShade: fs * 0.12 }));
  for (const kk of [k1, k2]) f.line(FF([[kk[0], kk[1] - 0.13], [kk[0] + 0.03, kk[1]], [kk[0], kk[1] + 0.13]]), 1.1, INK, { op: 0.7 });
  f.part(FF([[1.56, -0.56], [1.74, -0.53], [1.74, -0.44], [1.56, -0.47]]), { fill: mix(look.fill, '#d8d4cc', 0.4), shade: 0.3, inkW: 0.8, cast: false, hatch: false }); // the nail
  void F0;
  return { fing: [null, null, null, { k3: FF([[k3[0] + 0.06, k3[1]]])[0] }] };
}

// ---- one astronomer of the Stilled College, built from a pelvis point, a lean and a scale (1 = a 1.0 human), in the
// college dress: black scholar's gown, pale blue hood, square cap. Every body is its own man: o.face (B.head overrides),
// o.build {chest, belly, neck}, o.cap {a, col} | null, o.hood colour, o.beard 'forked'|'long'|'short'|'stubble'|null,
// o.specs, o.open (mouth open mid-argument), o.armN / o.armF = {a: pointing angle} | {fn(f, S, Sh)} | null.
// Rig: pre+'torso' (parent o.parent), pre+'head', pre+'arm_n', pre+'arm_f' (whole raised arm, pivot at the shoulder).
// Returns { S, hF, HC, Sh: {n, f}, tips: {n, f}, wrist: {n, f} }.
function scholar(f, o) {
  if (o.tone) { const t = o.tone; o = Object.assign({}, o, { gown: mix(o.gown || '#262a32', '#0a0b0e', t), skin: mix(o.skin || '#b4bcc2', '#3a404e', t * 0.85), hood: mix(o.hood || '#8aa2b6', '#26303c', t) }); } // o.tone: pushed back into the mass and darker
  const s = o.s || 1, H = 100 * s, pre = o.pre || '', seed = f.o.seed;
  const lean = o.lean || 0, P0 = o.P, up = rot([0, -1], lean);
  const N = add(P0, mul(up, 190 * s)), C = add(lerp(P0, N, 0.5), mul(rot(up, -Math.PI / 2), 16 * s * (o.hunch ?? 1)));
  const S = B.spine(N, C, P0, H);
  const SN = S.at(-0.18, 0.12), SF = S.at(0.32, 0.08), bu = o.build || {};
  const hA = o.hA ?? lean * 0.6, HC = o.HC || add(add(N, mul(up, 56 * s)), mul(rot(up, Math.PI / 2), 8 * s));
  const gownC = o.gown || '#262a32', GOWN = (x = {}) => Object.assign({ fill: gownC, shadow: '#101216', light: '#4a5262', shade: 0.42, tex: 'weave' + seed, texOp: 0.45, maxShade: 30 * s }, x);
  const SK = (x = {}) => Object.assign({ fill: o.skin || '#b4bcc2', shadow: '#525870', shade: 0.36, tex: 'mottle' + seed, texOp: 0.5, maxShade: 14 * s }, x);
  const hoodC = o.hood || '#8aa2b6';
  f.joint(pre + 'torso', P0, o.parent ?? null).joint(pre + 'head', S.at(0.1, -0.04), pre + 'torso');
  f.joint(pre + 'arm_n', SN, pre + 'torso').joint(pre + 'arm_f', SF, pre + 'torso');
  const res = { S, HC, Sh: { n: SN, f: SF }, tips: {}, wrist: {} };
  // an arm raised to point: the sleeve fallen back and frozen hanging from the elbow, the bare forearm burned, the hand pointing
  const arm = (Sh, A, side) => {
    f.bone(pre + 'arm_' + side);
    if (A.fn) { A.fn(f, S, Sh, res); return; }
    const a = A.a, bend = A.bend ?? 0.25, E0 = add(Sh, rot([118 * s, 0], a + bend)), W0 = add(E0, rot([108 * s, 0], a - bend * 0.4));
    const dk = side === 'f' ? 0.25 : 0;
    // the upper arm in its sleeve, and the sleeve's mouth hanging plumb from the elbow, stiff with frost
    f.part(K.chain([Sh, E0], [56 * s, 48 * s]), GOWN({ fill: mix(gownC, '#000', dk) }));
    const sm = [add(E0, rot([-10 * s, -26 * s], a)), add(E0, rot([16 * s, 24 * s], a)), add(E0, [6 * s, 90 * s * (A.drop ?? 1)]), add(E0, [-14 * s, 110 * s * (A.drop ?? 1)]), add(E0, [-30 * s, 84 * s * (A.drop ?? 1)]), add(Sh, [-10 * s, 30 * s])];
    f.part(sm, GOWN({ fill: mix(gownC, '#000', dk + 0.08), k: 0.8 }));
    XI.icicles(f, [add(E0, [6 * s, 90 * s * (A.drop ?? 1)]), add(E0, [-14 * s, 110 * s * (A.drop ?? 1)]), add(E0, [-30 * s, 84 * s * (A.drop ?? 1)])], 3, 8 * s, 26 * s);
    const fa = K.chain([lerp(E0, W0, -0.08), W0], [40 * s, 32 * s], { bp: [[0, 0.3, 0.12, 0.2]] });
    f.part(fa, SK({ fill: mix(o.skin || '#b4bcc2', '#5a6070', dk) }));
    clipDraw(f, fa, () => {
      XI.lichtenberg(f, lerp(E0, W0, 0.2), a + (f.r() - 0.5) * 0.6, 90 * s, 2 * s, { depth: 2 });
      for (const off of [-7, 4]) f.line([lp(E0, W0, 0.45, off * s), lp(E0, W0, 0.95, off * 0.6 * s)], 1.2 * s, INK, { op: 0.3 }); // tendons standing in the starved forearm
      f.flat(ell(lp(E0, W0, 0.92, -12 * s), 6 * s, 4 * s, a, 8), '#e8eef0', { op: 0.4 }); // the wrist bone
      for (let i = 0; i < 3; i++) f.flat(ell(lp(E0, W0, 0.3 + f.r() * 0.5, (f.r() - 0.5) * 20 * s), 2.4 * s, 1.8 * s, 0, 6), '#5a6070', { op: 0.5 }); // liver spots
    });
    if (A.sleeve) { const sl = K.chain([lerp(E0, W0, -0.1), lerp(E0, W0, 0.78)], [54 * s, 50 * s]); f.part(sl, GOWN({ fill: mix(gownC, '#000', dk) })); clipDraw(f, sl, () => { XI.fold(f, [lp(E0, W0, 0.1, 10 * s), lp(E0, W0, 0.6, 4 * s)], 1.6 * s); XI.hoar(f, lp(E0, W0, 0.4, -14 * s), 16 * s, 26 * s, 0.6); }); XI.icicles(f, [lp(E0, W0, 0.78, 24 * s), lp(E0, W0, 0.78, -24 * s)], 2, 8 * s, 18 * s); } // the sleeve not fallen back: only the wrist and hand bare
    XI.rimeCrust(f, [lp(Sh, E0, 0.2, -26 * s), lp(E0, W0, 0.1, -20 * s), lp(E0, W0, 0.9, -16 * s)], 5 * s, [1, -0.3]);
    if (A.hold) { A.hold(f, W0, a, s, res); }
    else if (A.reach) { IX.openHand(f, W0, a, 66 * s, { look: SK({ fill: mix(o.skin || '#b4bcc2', '#5a6070', dk) }), curl: A.curl ?? 0.35, spread: A.spread ?? 0.2, back: true, flip: side === 'f' }); }
    else { const h = pointHand(f, W0, a, 64 * s, SK({ fill: mix(o.skin || '#b4bcc2', '#5a6070', dk) }), { flip: side === 'f' }); const tip = h.fing[3].k3; res.tips[side] = tip; XI.icicle(f, add(tip, [0, 2]), 10 * s, 3 * s); }
    XI.icicle(f, add(E0, [0, 20 * s]), 16 * s, 4 * s);
    res.wrist[side] = W0; res.elbow = res.elbow || {}; res.elbow[side] = E0;
  };
  if (o.armF) arm(SF, o.armF, 'f');
  // ---- body (rebuilt in the independent review): one gown outline from the shoulders to the hem, never a torso slab
  // over a skirt slab. The gown falls from a broad yoke over the chest, is cinched by a cord girdle, and hangs plumb
  // from the hips in frozen tube folds to a broken hem; the hood lies on the back, its pale lining turned out round the
  // neck, its bag hanging down between the shoulders.
  f.bone(pre + 'torso');
  const cw = bu.chest ?? 1, bw = bu.belly ?? 1, sL = (o.skirtL ?? 200) * s;
  const shB = S.at(-0.52 * cw, 0.04), shF = S.at(0.5 * cw, 0.08), chF = S.at(0.66 * cw, 0.3), blF = S.at(0.64 * bw, 0.62), wF = S.at(0.56 * bw, 0.78), hF0 = S.at(0.62, 0.98);
  const wB = S.at(-0.58, 0.72), hB0 = S.at(-0.7, 0.98), bkM = S.at(-0.66 * cw, 0.36);
  const hemY = Math.max(hF0[1], hB0[1]) + sL, hemF = [hF0[0] + 26 * s, hemY - 6 * s], hemB = [hB0[0] - 22 * s, hemY + 4 * s];
  const hem = []; for (let i = 1; i < 6; i++) { const t = i / 6, q = lerp(hemF, hemB, t); hem.push([q[0] + (f.r() - 0.5) * 8 * s, q[1] + (i % 2 ? 14 : -6) * s * (0.6 + f.r() * 0.6), i % 2 ? 1 : 0]); } // frozen tube folds end in points
  const gown = sL > 0
    ? [shB, S.at(-0.1, -0.04), shF, chF, blF, wF, hF0, add(hF0, [14 * s, sL * 0.45]), [hemF[0], hemF[1], 1], ...hem, [hemB[0], hemB[1], 1], add(hB0, [-12 * s, sL * 0.5]), hB0, wB, bkM]
    : [shB, S.at(-0.1, -0.04), shF, chF, blF, wF, hF0, S.at(0.2, 1.06), S.at(-0.4, 1.06), hB0, wB, bkM];
  f.part(gown, GOWN({ k: 0.85 }));
  clipDraw(f, gown, () => {
    const lit = [S.at(0.3, 0.06), S.at(0.62 * cw, 0.3), S.at(0.6 * bw, 0.66), add(hF0, [16 * s, sL * 0.9]), add(hF0, [-10 * s, sL * 0.9]), S.at(0.3, 0.7), S.at(0.24, 0.3)];
    IX.softTone(f, E.smooth(gown), [[lit, '#8a98ac', 0.22, 14 * s], [[S.at(-0.66, 0.1), S.at(-0.3, 0.2), S.at(-0.4, 0.98), add(hB0, [0, sL]), add(hB0, [-30 * s, sL])], '#000', 0.45, 14 * s]]); // lit front, the back turning into shadow
    // folds: from the yoke down over the chest, gathered at the girdle, then tube folds falling plumb to the hem
    for (const u of [-0.36, 0.0, 0.32]) XI.trough(f, [S.at(u * cw, 0.12), S.at(u * 0.8, 0.45), S.at(u * 0.6, 0.76)], 8 * s, { col: '#06070a', lite: '#5a6476', liteOp: 0.4, op: 0.5 });
    if (sL > 0) for (let i = 0; i < 4; i++) { const t = (i + 0.5) / 4, top = lerp(S.at(0.5, 0.84), S.at(-0.6, 0.84), t), bot = lerp(hemF, hemB, t + (f.r() - 0.5) * 0.06); XI.trough(f, [top, lerp(top, bot, 0.5), add(bot, [0, -4 * s])], 11 * s, { col: '#06070a', lite: '#5a6476', liteOp: 0.45, op: 0.55 }); }
    for (const k of [0, 1]) f.stroke([lerp(S.at(0.5, 0.86), S.at(-0.5, 0.86), 0.2 + k * 0.4), lerp(S.at(0.5, 0.92), S.at(-0.5, 0.92), 0.4 + k * 0.4)], 2 * s, INK, { op: 0.45 }); // catenary drag under the girdle
    XI.hoar(f, S.at(0.5, 0.4), 26 * s, 50 * s, 0.7); if (sL > 0) XI.hoar(f, add(hF0, [10 * s, sL * 0.6]), 18 * s, 40 * s, 0.6);
    if (o.patch) { const q = S.at(-0.2, 0.6); const pq = [add(q, [-14 * s, -12 * s]), add(q, [14 * s, -14 * s]), add(q, [16 * s, 12 * s]), add(q, [-12 * s, 14 * s])]; f.part(hard(pq), GOWN({ fill: '#1c1f26', cast: false, inkW: 1 })); f.stitches([...pq, pq[0]], '#7a8290', 0.8); }
  });
  if (sL > 0) XI.icicles(f, [[hemF[0], hemF[1]], ...hem.map(q => [q[0], q[1]]), [hemB[0], hemB[1]]], 6, 8 * s, 26 * s);
  XI.rimeCrust(f, [shF, chF, blF, wF], 6 * s, [1, -0.2]);
  // the cord girdle, knotted at the front hip, its tails hanging plumb
  const g0 = S.at(-0.6, 0.78), g1 = S.at(0.58 * bw, 0.79), kn = lerp(g0, g1, 0.78);
  f.stroke([g0, lerp(g0, g1, 0.5), g1], 5 * s, INK); f.stroke([g0, lerp(g0, g1, 0.5), g1], 3 * s, '#5a5e66');
  f.part(ell(kn, 7 * s, 6 * s, 0, 8), { fill: '#5a5e66', shade: 0.35, inkW: 1, cast: false });
  for (const dx of [-3, 4]) { const tl = [kn, add(kn, [dx * s, 18 * s]), add(kn, [dx * 1.6 * s, 34 * s])]; f.stroke(tl, 3.6 * s, INK); f.stroke(tl, 2.2 * s, '#5a5e66'); XI.icicle(f, add(kn, [dx * 1.6 * s, 34 * s]), 8 * s, 2.4 * s); }
  // the hood: its bag hanging down the back from the shoulders, the pale lining turned out; a lined collar round the neck
  const hb = [S.at(-0.2, -0.06), S.at(-0.62, 0.02), S.at(-0.86, 0.2), S.at(-0.82, 0.44), S.at(-0.66, 0.58), S.at(-0.5, 0.4), S.at(-0.3, 0.2)];
  f.part(hb, GOWN({ fill: mix(gownC, '#000', 0.15), k: 0.8 }));
  const lin = [S.at(-0.24, -0.06), S.at(-0.6, 0.0), S.at(-0.84, 0.16), S.at(-0.8, 0.24), S.at(-0.58, 0.12), S.at(-0.3, 0.04)];
  f.part(lin, { fill: hoodC, shadow: '#3a4a5c', light: '#d0e0ea', shade: 0.42, tex: 'weave' + seed, texOp: 0.4, maxShade: 12 * s, k: 0.8 });
  clipDraw(f, lin, () => { XI.fold(f, [S.at(-0.4, 0.02), S.at(-0.6, 0.22)], 1.4 * s); XI.hoar(f, S.at(-0.5, 0.06), 20 * s, 12 * s, 0.8); });
  const col = [S.at(-0.3, -0.1), S.at(0.0, -0.16), S.at(0.34, -0.06), S.at(0.4, 0.04), S.at(0.1, 0.02), S.at(-0.24, 0.04)];
  f.part(col, { fill: mix(hoodC, '#fff', 0.1), shadow: '#3a4a5c', light: '#e0ecf2', shade: 0.4, tex: 'weave' + seed, texOp: 0.4, maxShade: 8 * s, k: 0.8, cast: false });
  XI.icicles(f, [S.at(-0.82, 0.44), S.at(-0.66, 0.58)], 3, 8 * s, 20 * s);
  XI.rimeCrust(f, [S.at(0.0, -0.16), S.at(0.34, -0.06)], 4 * s, [1, -0.3]);
  if (o.inkhorn) { const q = S.at(0.2, 1.0); f.part([add(q, [-8 * s, -4 * s]), add(q, [8 * s, -6 * s]), add(q, [6 * s, 24 * s]), add(q, [-2 * s, 30 * s])], { fill: '#b8ac94', shadow: '#4a4236', shade: 0.4, inkW: 1, cast: false }); XI.icicle(f, add(q, [0, 30 * s]), 22 * s, 4 * s, { col: '#1a1a22' }); }
  if (o.after) o.after(S);
  // ---- head
  f.bone(pre + 'head');
  f.part(limb(S.at(0.1, -0.04), add(HC, rot([-0.12 * H, 0.38 * H], hA)), 38 * s * (bu.neck ?? 1), 32 * s * (bu.neck ?? 1)), SK());
  const fc = Object.assign({ skin: o.skin || '#b4bcc2', jaw: 1.05, chin: 0.02, nose: 1.1, hook: 0.2, mouth: 'set', squint: 0.3, browDown: 0.06, age: true, faceShade: 0.8, jawShade: 0.42, eyeWhite: '#d8e2e8', iris: '#2a3038', hairCol: '#7a7670', browCol: '#cfd8dc' }, o.face || {});
  if (o.beard === 'short' || o.beard === 'stubble') { fc.beard = o.beard; fc.beardCol = fc.beardCol || '#9aa0a4'; }
  B.head(f, HC, H, hA, fc);
  const hF = frame(HC, hA, H); res.hF = hF;
  if (o.open !== false) { f.flat(hF([[0.16, 0.27], [0.25, 0.26], [0.32, 0.27], [0.31, 0.36], [0.24, 0.4], [0.18, 0.35]]), '#141418'); f.flat(hF([[0.18, 0.27], [0.27, 0.265], [0.29, 0.285], [0.19, 0.29]]), '#d8d4c4', { op: 0.75 }); XI.icicle(f, hF([[0.26, 0.4]])[0], 8 * s, 2.4 * s); } // frozen open mid-argument
  f.flat(hF([[0.2, 0.33], [0.3, 0.335], [0.28, 0.36], [0.2, 0.355]]), '#4a5a7a', { op: 0.5 }); // lips cracked and blue
  const drawBeard = () => {
  if (o.beard === 'long' || o.beard === 'forked') {
    const fk = o.beard === 'forked';
    const bd = hF(fk ? [[-0.12, 0.28], [0.06, 0.4], [0.18, 0.43], [0.34, 0.41], [0.38, 0.56], [0.38, 1.02], [0.28, 0.8], [0.18, 1.06], [0.08, 0.76], [-0.06, 0.5]] : [[-0.1, 0.26], [0.1, 0.32], [0.34, 0.34], [0.36, 0.5], [0.26, 0.86], [0.1, 0.8], [-0.04, 0.5]]);
    f.part(bd, { fill: fc.beardCol || '#c8cfd4', shadow: '#4e5668', light: '#ffffff', shade: 0.4, tex: 'rime' + seed, texOp: 0.6, maxShade: 12 * s });
    clipDraw(f, bd, () => { for (let i = 0; i < 7; i++) f.stroke([hF([[0.0 + i * 0.05, 0.32]])[0], hF([[0.02 + i * 0.045, 0.6]])[0], hF([[0.06 + i * 0.03, 0.88]])[0]], 3 * s, i % 2 ? '#5a6274' : '#f2f6f8', { op: 0.6 }); });
    XI.icicles(f, fk ? [bd[5], bd[6], bd[7], bd[8]] : [bd[4], bd[5], bd[6]], fk ? 4 : 3, 10 * s, 24 * s);
  }
  };
  if (!o.beardOver) drawBeard();
  if (o.specs) frostSpecs(f, hF);
  XI.clipDraw(f, hF([[0.14, -0.3], [0.4, -0.2], [0.38, 0.4], [0.18, 0.5], [0.14, 0.1]]), () => XI.hoar(f, hF([[0.3, 0.1]])[0], 16 * s, 26 * s, 0.6));
  XI.icicle(f, hF([[0.36, 0.16]])[0], 8 * s, 2.6 * s);
  if (o.cap !== null) {
    const cap = o.cap || {}, ca = hA + (cap.a || 0), cF = frame(HC, ca, H), cc = cap.col || '#1e2026';
    f.part(cF([[-0.42, -0.22], [-0.4, -0.44], [-0.2, -0.58], [0.1, -0.58], [0.28, -0.44], [0.32, -0.28], [0.0, -0.3], [-0.3, -0.24]]), GOWN({ fill: cc, maxShade: 10 * s }));
    const top = cF([[-0.5, -0.56], [0.0, -0.74], [0.5, -0.6], [0.0, -0.46]]);
    f.part(hard(top), GOWN({ fill: mix(cc, '#fff', 0.08), maxShade: 6 * s, k: 0.5 }));
    f.line([top[1], top[3]], 1.2, INK, { op: 0.5 }); f.flat(ell(lerp(top[1], top[3], 0.5), 4 * s, 3 * s, ca, 6), '#0e0e12');
    XI.rimeCrust(f, [top[0], top[1], top[2]], 5 * s, [1, -0.3]);
    XI.icicles(f, [top[2], top[3], top[0]], 3, 6 * s, 16 * s);
  }
  if (o.hairSpikes) XI.icicles(f, hF([[-0.34, 0.1], [-0.36, -0.1]]), 2, 8 * s, 18 * s);
  if (o.armN) arm(SN, o.armN, 'n');
  if (o.beardOver) { f.bone(pre + 'head'); drawBeard(); }
  return res;
}

// ---- animal construction (second review): after the Lantern Cow (world_VI_b), Musk Ox (world_VIII_b) and Magma Hound
// a leg as one outline along a centre line C (top to the ground), with half-widths on the front side (wF, toward +x for
// a downward leg) and the back side (wB) at each centre point, so a forearm can taper hard to a knee, a hock can jut
// behind, a cannon can be thin and a fetlock can swell. Returns the closed outline.
function legOutline(C, wF, wB) {
  const F = [], Bk = [], n = C.length;
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)), nn = [d[1], -d[0]]; // nn: the front side of a leg going down
    const pf = add(C[i], mul(nn, -wF[i])), pb = add(C[i], mul(nn, wB[i]));
    F.push(Array.isArray(wF[i]) ? pf : pf); Bk.push(pb);
  }
  // a rounded cap over the top (the shoulder or haunch mass), so the leg's top never reads as a cut slab
  const d0 = E.norm(sub(C[1], C[0])), n0 = [d0[1], -d0[0]], r0 = (wF[0] + wB[0]) / 2, c0 = add(C[0], mul(n0, (wB[0] - wF[0]) / 2)), cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(c0, add(mul(n0, Math.cos(t) * r0), mul(d0, -Math.sin(t) * r0 * 0.7)))); }
  return [...F, ...Bk.reverse(), ...cap];
}
// cross-contour hatching round a limb segment a->b on its shadow side (after kit_VIII_b.wrapHatch)
function wrapHatch(f, a, b, wa, wb, side, n, o = {}) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
  for (let i = 0; i < n; i++) {
    const t = (o.t0 ?? 0) + ((o.t1 ?? 1) - (o.t0 ?? 0)) * (i + 0.5 + (f.r() - 0.5) * 0.5) / n, c = lerp(a, b, t), w = wa + (wb - wa) * t, bow = (o.bow ?? 0.22) * w;
    const s0 = o.s0 ?? (0.15 + f.r() * 0.2);
    const pts = [s0, (s0 + 0.95) / 2, 0.8, 0.96].map(s => add(add(c, mul(nn, side * w * s)), mul(d, bow * s * s)));
    f.stroke(pts, (o.w || 3) * (0.7 + f.r() * 0.6), o.col || INK, { op: o.op ?? 0.35 });
  }
}
// hatching that wraps round a barrel: curved strokes from a top line down to a bottom line, bowing toward +x (the
// round of the body turning away), denser and darker toward the belly. top/bot: functions x -> y.
function barrelHatch(f, x0, x1, top, bot, o = {}) {
  let x = x0;
  while (x < x1) {
    const t0 = 0.35 + f.r() * 0.25, ya = top(x) + (bot(x) - top(x)) * t0, yb = bot(x) - 6, bw = (o.bow ?? 18) * (0.7 + f.r() * 0.6);
    f.stroke([[x, ya], [x + bw * 0.8, (ya + yb) / 2], [x + bw * 0.3, yb]], (o.w ?? 2.4) * (0.7 + f.r() * 0.5), o.col || INK, { op: o.op ?? 0.32 });
    x += (o.step ?? 22) * (0.6 + f.r() * 0.8);
  }
}
// a small dark animal eye set deep under a brow (never round and staring): a dark socket, an almond of dark eye, a
// pin of light, the heavy brow above; o.frost films it white along the lid.
function animalEye(f, c, s, a, o = {}) {
  const F = pts => pts.map(p => add(c, rot([p[0] * s, p[1] * s], a)));
  f.flat(F([[-1.1, -0.1], [-0.4, -0.75], [0.5, -0.75], [1.15, -0.2], [0.8, 0.5], [-0.6, 0.55]]), '#101014', { op: 0.5 });
  f.flat(F([[-0.6, 0.02], [-0.1, -0.28], [0.5, -0.22], [0.66, 0.04], [0.15, 0.24], [-0.38, 0.2]]), '#0a0a0e');
  f.flat(ell(F([[0.18, -0.1]])[0], s * 0.09, s * 0.06, a, 6), '#c8d0d4', { op: 0.8 });
  if (o.frost) f.flat(F([[-0.5, -0.06], [0.0, -0.3], [0.5, -0.24], [0.1, -0.12]]), '#d8e2e8', { op: 0.55 });
  f.stroke(F([[-1.0, -0.42], [-0.2, -0.86], [0.6, -0.76], [1.15, -0.44]]), Math.max(2.4, s * 0.4), o.brow || '#1a1c20', { op: 0.9 });
}
// a cloven hoof on the ground (or lifted, o.tilt about the toe): two claws with the far one peeking ahead, the cleft,
// the coronet band, growth rings, an iron shoe worn bright with ice packed in the cleats, dewclaws behind the fetlock.
// T: the hoof's centre at the ground; s: hoof length unit (about 100 for an ox).
function clovenHoof(f, T, s, look, o = {}) {
  const tl = o.tilt || 0, H = pts => pts.map(([u, v]) => add(T, rot([u * s, v * s], tl)));
  const dark = Object.assign({}, look, { fill: mix(look.fill, '#000', 0.3) });
  f.part(H([[-0.14, -0.5], [0.26, -0.5], [0.62, -0.04], [0.6, 0, 1], [-0.1, 0, 1]]), dark); // far claw
  f.part(H([[-0.4, -0.44], [-0.08, -0.54], [0.22, -0.54], [0.54, -0.06], [0.52, 0, 1], [-0.34, 0, 1], [-0.48, -0.18]]), look);
  f.line(H([[-0.06, -0.52], [0.06, -0.28], [0.1, -0.02]]), 1.8, INK, { op: 0.8 });
  for (let i = 0; i < 3; i++) f.line(H([[-0.34 + i * 0.04, -0.38 + i * 0.11], [0.2 + i * 0.08, -0.44 + i * 0.13]]), 1, '#8a8682', { op: 0.4 });
  f.line(H([[-0.4, -0.44], [-0.08, -0.54], [0.22, -0.54]]), 2.2, '#e0e2de', { op: 0.35 });
  if (o.shoe !== false) { f.part(H([[-0.36, -0.06, 1], [0.54, -0.06, 1], [0.56, 0.02, 1], [-0.38, 0.02, 1]]), XI.IR(f, { fill: P.ironL, inkW: 1, cast: false })); f.line(H([[-0.3, -0.03], [0.5, -0.03]]), 1.2, '#c0c6cc', { op: 0.7 }); for (const u of [-0.2, 0.3]) f.rivet(H([[u, -0.03]])[0], Math.max(1.4, s * 0.025), P.steelL); }
  if (o.ice !== false) for (const [u, w] of [[0.06, 0.07], [-0.3, 0.05]]) { const q = H([[u, -0.03]])[0]; f.flat([add(q, [-s * w, 0]), add(q, [0, -s * w]), add(q, [s * w, 0]), add(q, [0, s * 0.02])], P.rime, { op: 0.85 }); }
}

module.exports = Object.assign({}, XI, {
  XI, angOf, legOutline, wrapHatch, barrelHatch, animalEye, clovenHoof, pointHand, scholar, furTex, furPlates, bristleRidge, glazed, hoof, paw, quadLeg, ragSlipper, frostSpecs,
  openHand: IX.openHand, jointLimb: IX.jointLimb, jcut: IX.jcut, creases: IX.creases, fistDetail: IX.fistDetail, tube: IX.tube,
  hairClump: IX.hairClump, offsetLine: IX.offsetLine, crease: IX.crease, creaseField: IX.creaseField, softTone: IX.softTone, stains: IX.stains, mlimb: IX.mlimb,
});
