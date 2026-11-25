// World III, The Boiling Baths, second batch: helpers for world_III_b.js, on top of kit_III.js (which is reused, never
// edited). Same palette, same render setup, same scald marks. New here: a warm-shadowed face with modelled planes, a
// muscled arm (after the reviewed Cauldron Bearer), quadruped legs with hooves and paws, a fire-hook, pearls and silver,
// brick and terracotta textures, cooked cockroaches, empty skin gloves, glass.
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const T = require('./kit_III');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { P, split, side, elb } = T;

// extra palette for this batch (still the world's: boiled red, pink-white, steam white; materials from the bible)
const Q = Object.assign({}, P, {
  brick: '#8a4a3a', brickL: '#b06a52', brickD: '#4a2420', mortar: '#cfc0b0', terra: '#a8583e', terraL: '#cc7a5a',
  soot: '#1e1614', ash: '#8a8480', ashL: '#bab4ae', ember: '#e07a4a',
  silver: '#a8aaae', silverD: '#5a5c62', silverL: '#e6e8ea', pearl: '#ece4da', pearlD: '#a89c96',
  velvet: '#5a3446', velvetD: '#2a1622', velvetL: '#7e5266', // soaked velvet of the rich (wine, darkened by water)
  glass: '#c8d4d0', glassD: '#6a7a78', urine: '#c8a860', clay: '#c8a88a', clayD: '#7a5a46', wax: '#e2d2a8', lead: '#7a7c80',
  hide: '#e4c2b6', hideD: '#b88e86', hideS: '#6a4048', hoof: '#4a3a34', hoofL: '#7a6a5e',
});

function textures(f) {
  T.textures(f);
  const s = f.o.seed, r = E.rng(s * 7 + 3);
  // brick courses with mortar, staggered, each brick a little uneven and pitted
  let b = '';
  for (let row = 0; row < 4; row++) for (let i = -1; i < 3; i++) {
    const x = i * 60 + (row % 2) * 30, y = row * 26, j = (r() - 0.5) * 3;
    b += `<path d="M${x + 2},${y + 2 + j} L${x + 57},${y + 2} L${x + 58},${y + 23 + j} L${x + 3},${y + 24}Z" fill="none" stroke="${INK}" stroke-width="1.1" opacity="0.7"/>`;
    b += `<path d="M${x + 6},${y + 6} L${x + 40},${y + 5}" stroke="#f0d0b8" stroke-width="1" opacity="0.35"/>`;
    for (let k = 0; k < 3; k++) b += `<circle cx="${(x + 8 + r() * 44).toFixed(1)}" cy="${(y + 6 + r() * 14).toFixed(1)}" r="${(0.8 + r() * 1.2).toFixed(1)}" fill="${INK}" opacity="0.35"/>`;
  }
  f.defs.push(`<pattern id="brick${s}" patternUnits="userSpaceOnUse" width="120" height="104">${b}</pattern>`);
  // hide and skin goosed by boiling: fine pores and short creases
  let p = '';
  for (let i = 0; i < 40; i++) p += `<circle cx="${(r() * 40).toFixed(1)}" cy="${(r() * 40).toFixed(1)}" r="${(0.5 + r() * 0.7).toFixed(1)}" fill="${INK}" opacity="0.35"/>`;
  f.defs.push(`<pattern id="pores${s}" patternUnits="userSpaceOnUse" width="40" height="40">${p}</pattern>`);
}

// a face with the reference figures' depth: the head's own shadow is a warm rose (not the world's dark wine), shade about
// 0.78, plus soft blurred planes: the cheek's lit top and shadowed underside, the side of the face turning away, the eye
// socket's depth. Returns the head frame.
function face(f, HC, H, hA, p, o = {}) {
  const st = f.o.shadowTint; f.o.shadowTint = o.tint || '#9a5662';
  B.head(f, HC, H, hA, Object.assign({ faceShade: 0.78, faceHatch: false, jawShade: 0.4 }, p));
  f.o.shadowTint = st;
  const hF = frame(HC, hA, H), sh = o.shade || '#8a4652';
  const softF = (pts, col, op) => f.raw(`<path d="${E.smooth(hF(pts))}" fill="${col}" opacity="${op}" filter="url(#steamblur${f.o.seed})"/>`);
  softF(ell([0.1, 0.1], 0.11, 0.06, 0.1, 12), '#fff4ee', o.lit ?? 0.24);
  softF([[-0.06, 0.2], [0.1, 0.26], [0.24, 0.24], [0.26, 0.3], [0.1, 0.33], [-0.08, 0.3]], sh, 0.32);
  softF([[-0.3, -0.2], [-0.2, -0.3], [-0.16, 0.0], [-0.2, 0.3], [-0.3, 0.2]], sh, 0.3);
  softF(ell([0.12, -0.07], 0.09, 0.04, 0.05, 10), sh, 0.25);
  return hF;
}
const softAt = (f, pts, col, op, big) => f.raw(`<path d="${E.smooth(pts)}" fill="${col}" opacity="${op}" filter="url(#steamblur${big ? '2' : ''}${f.o.seed})"/>`);

// a heavy muscled arm (the reviewed Cauldron Bearer arm, generalised): deltoid, biceps belly on the inside of the bend,
// triceps behind, the elbow's point, the forearm thick under the elbow and tapering to the wrist, soft light and shade
// clipped to the mass, its blurred shadow on the body. Upper arm and forearm are separate parts overlapping at the elbow.
function muscleArm(f, S0, E0, W0, wU, wF, look, sfx, o = {}) {
  const seed = f.o.seed, lit = o.lit || mix(look.fill, '#fff', 0.32), dk = o.dark || mix(look.fill, '#1a0808', 0.65);
  const dU = E.norm(sub(E0, S0)), dF = E.norm(sub(W0, E0)), nU = [-dU[1], dU[0]], nF = [-dF[1], dF[0]];
  const inU = (dF[0] * nU[0] + dF[1] * nU[1]) > 0 ? 1 : -1, inF = (dU[0] * nF[0] + dU[1] * nF[1]) < 0 ? 1 : -1;
  const sc = (arr, w) => arr.map(([t, k]) => [t, k * w]);
  const bic = sc([[0, 0.44], [0.2, 0.5], [0.48, 0.56], [0.72, 0.5], [0.9, 0.4], [1, 0.38]], wU), tri = sc([[0, 0.52], [0.12, 0.6], [0.32, 0.56], [0.55, 0.5], [0.8, 0.46], [1, 0.44]], wU);
  const flx = sc([[0, 0.44], [0.16, 0.5], [0.4, 0.44], [0.72, 0.33], [1, 0.3]], wF), ext = sc([[0, 0.5], [0.2, 0.58], [0.42, 0.5], [0.74, 0.36], [1, 0.32]], wF);
  const u = (t, k) => lp(S0, E0, t, k * wU * inU), fa = (t, k) => lp(E0, W0, t, k * wF * inF);
  f.bone('upperarm' + sfx);
  if (o.castShadow !== false) f.raw(`<path d="${E.smooth(T.mlimb(S0, E0, bic, tri).map(q => add(q, [-wU * 0.16, wU * 0.14])))}" fill="#1a0808" opacity="0.32" filter="url(#steamblur2${seed})"/>`);
  const up = T.mlimb(S0, E0, inU > 0 ? bic : tri, inU > 0 ? tri : bic, { capK: 0.8 }), cid = f.id('uac');
  f.part(up, Object.assign({}, look, { maxShade: wU * 0.3 }));
  f.defs.push(`<clipPath id="${cid}"><path d="${E.smooth(up)}"/></clipPath>`);
  f.raw(`<g clip-path="url(#${cid})"><path d="${E.smooth([u(0, -0.7), u(0.5, -0.66), u(1, -0.6), u(1, -0.3), u(0.5, -0.32), u(0, -0.36)])}" fill="${lit}" opacity="0.32" filter="url(#steamblur2${seed})"/><path d="${E.smooth([u(0.1, 0.7), u(0.5, 0.72), u(1, 0.6), u(1, 0.3), u(0.5, 0.36), u(0.1, 0.36)])}" fill="${dk}" opacity="0.35" filter="url(#steamblur2${seed})"/></g>`);
  f.stroke([u(0.04, -0.5), u(0.3, -0.36), u(0.44, -0.1)], Math.max(1.6, wU * 0.024), dk, { op: 0.55 });
  f.stroke([u(0.4, 0.0), u(0.62, 0.06), u(0.86, 0.02)], Math.max(1.4, wU * 0.02), dk, { op: 0.45 });
  f.line([u(0.2, -0.46), u(0.5, -0.44), u(0.8, -0.4)], Math.max(1.4, wU * 0.024), lit, { op: 0.45 });
  f.bone('forearm' + sfx);
  const fo = T.mlimb(E0, W0, inF > 0 ? flx : ext, inF > 0 ? ext : flx, { capK: 0.9 });
  f.part(fo, Object.assign({}, look, { maxShade: wF * 0.28 }));
  f.part(ell(add(E0, mul(E.norm(sub(dU, dF)), wU * 0.34)), wU * 0.15, wU * 0.11, Math.atan2(dU[1], dU[0]), 10), Object.assign({}, look, { cast: false, inkW: 1.1, inkHeavy: 1.4, hatch: false, maxShade: 5, fill: mix(look.fill, lit, 0.25) })); // the elbow's point
  for (let i = 0; i < 3; i++) f.line([fa(0.02 + i * 0.03, 0.42), fa(0.05 + i * 0.03, 0.1), fa(0.02 + i * 0.03, -0.2)], 1.1, dk, { op: 0.45 });
  f.stroke([fa(0.1, -0.1), fa(0.4, -0.06), fa(0.75, -0.02)], Math.max(1.4, wF * 0.022), dk, { op: 0.4 });
  f.line([fa(0.2, 0.3), fa(0.45, 0.2), fa(0.6, 0.26), fa(0.85, 0.16)], Math.max(1.2, wF * 0.018), o.vein || mix(look.fill, '#6a5a8a', 0.45), { op: 0.45 });
  f.line([fa(0.12, -0.5), fa(0.4, -0.44)], Math.max(1.4, wF * 0.024), lit, { op: 0.45 });
  return { up, fo, u, fa };
}

// a long iron fire-hook from butt a to tip b: a forged square rod, a crook curling back up at the tip (dir = +1 curls to
// the upper side), hammer marks, scale, a ring at the butt. Returns the rod angle.
function fireHook(f, a, b, w, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], A = Math.atan2(d[1], d[0]), up = o.up ?? -1;
  f.part(limb(a, b, w, w * 0.85, { steps: 10, capK: 0.4 }), { fill: P.iron, shadow: '#120e0e', shade: 0.4, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: 1.2 });
  f.line([lp(a, b, 0.02, up * w * 0.25), lp(a, b, 0.98, up * w * 0.22)], 1.2, P.ironL, { op: 0.6 });
  for (let i = 0; i < 9; i++) { const t = 0.08 + i * 0.1; f.line([lp(a, b, t, w * 0.45), lp(a, b, t + 0.012, -w * 0.45)], 0.9, INK, { op: 0.45 }); } // hammer marks / twist
  // the crook: the rod bends back on itself at the tip, its point turned up and back toward the user
  const k = w * 2.6, c0 = b, c1 = add(add(b, mul(d, k * 0.9)), mul(n, up * k * 0.5)), c2 = add(add(b, mul(d, k * 0.7)), mul(n, up * k * 1.4)), c3 = add(add(b, mul(d, k * 0.1)), mul(n, up * k * 1.6));
  f.part(K.chain([lp(a, b, 0.97), c0, c1, c2, c3], [w * 0.9, w * 0.85, w * 0.8, w * 0.7, w * 0.5]), { fill: P.iron, shadow: '#120e0e', shade: 0.4, inkW: 1.2, tex: 'mottle' + f.o.seed, texOp: 0.6 });
  f.part([add(c3, mul(n, up * -w * 0.25)), add(add(c3, mul(d, -w * 1.2)), mul(n, up * w * 0.2)), add(c3, mul(n, up * w * 0.3))], { fill: P.iron, shade: 0.3, inkW: 1, cast: false });
  f.line([c0, c1, c2], 1.2, mix(P.ironL, Q.ember, 0.5), { op: 0.55 }); // heat-coloured where it rakes the coals
  f.flat(ell(lp(a, b, 0.85, 0), w * 0.8, w * 0.5, A, 8), Q.ember, { op: 0.25 });
  // butt ring
  const e = ell(add(a, mul(d, -w * 0.9)), w * 0.9, w * 0.7, A, 12); f.line(e.concat([e[0]]), w * 0.45, INK); f.line(e.concat([e[0]]), w * 0.22, P.ironL);
  return A;
}

// a string of pearls along a polyline (r: pearl radius): each a lit bead with a dark contact under it; o.sunk hides the
// pearls on the far side of a neck (only those whose index passes o.show)
function pearls(f, pts, r, o = {}) {
  let acc = 0; const seg = []; for (let i = 0; i < pts.length - 1; i++) { const l = E.len(sub(pts[i + 1], pts[i])); seg.push([pts[i], pts[i + 1], acc, l]); acc += l; }
  const n = Math.floor(acc / (r * 2.05));
  for (let k = 0; k <= n; k++) {
    if (o.show && !o.show(k, n)) continue;
    const t = k * r * 2.05, sg = seg.find(q => t <= q[2] + q[3] + 1e-6) || seg[seg.length - 1], c = lerp(sg[0], sg[1], Math.min(1, (t - sg[2]) / sg[3]));
    f.flat(ell(add(c, [0, r * 0.3]), r * 1.05, r * 0.95, 0, 10), INK, { op: 0.55 });
    f.flat(ell(c, r, r * 0.95, 0, 10), o.col || Q.pearl);
    f.flat(ell(add(c, [-r * 0.15, r * 0.25]), r * 0.75, r * 0.5, 0, 8), Q.pearlD, { op: 0.45 });
    f.flat(ell(add(c, [r * 0.3, -r * 0.35]), r * 0.32, r * 0.24, 0, 6), '#fff', { op: 0.9 });
  }
}
// a silver ring sunk in a swollen finger: band across the finger at c, angle a (along the finger), w finger width
function silverRing(f, c, a, w, o = {}) {
  const d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]];
  f.stroke([add(c, mul(n, w * 0.55)), add(c, mul(d, w * 0.08)), add(c, mul(n, -w * 0.55))], w * 0.32, Q.silverD);
  f.line([add(add(c, mul(n, w * 0.4)), mul(d, -w * 0.04)), add(c, mul(n, -w * 0.2))], w * 0.12, Q.silverL, { op: 0.85 });
  f.line([add(add(c, mul(n, w * 0.55)), mul(d, w * 0.2)), add(add(c, mul(n, -w * 0.55)), mul(d, w * 0.24))], 1.2, INK, { op: 0.5 }); // flesh bulging over it
  if (o.signet) { f.part(ell(add(c, mul(n, w * 0.45)), w * 0.3, w * 0.22, a, 8), { fill: Q.silver, shadow: Q.silverD, shade: 0.4, inkW: 1, cast: false }); f.line([add(c, mul(n, w * 0.38)), add(c, mul(n, w * 0.52))], 0.8, INK, { op: 0.7 }); }
}

// an empty skin glove: the whole skin of a hand come away and hanging plumb from the wrist, limp, translucent, the fingers
// as flattened empty sleeves, the nails still in them. top: where it hangs from (the wrist's lower edge), w: hand width
function skinGlove(f, top, w, len, o = {}) {
  const col = o.col || '#e6cec4', sh = '#7a5a60', sway = o.sway ?? 0;
  const J = () => (f.r() - 0.5) * w * 0.12;
  // the cuff where it tore round the wrist, then the slack palm sleeve, then four finger sleeves and the thumb
  const pal = [add(top, [-w * 0.55, 0]), add(top, [-w * 0.62 + J(), len * 0.25]), add(top, [-w * 0.52 + sway * 0.4, len * 0.5]), add(top, [w * 0.5 + sway * 0.4, len * 0.52]), add(top, [w * 0.62 + J(), len * 0.24]), add(top, [w * 0.55, 0])];
  f.part(pal, { fill: col, shadow: sh, shade: 0.3, inkW: 1, inkHeavy: 1.4, hatch: false, opacity: 0.84, castOp: 0.25, tex: 'mottle' + f.o.seed, texOp: 0.5 });
  const fingers = [[-0.3, 0.38], [-0.1, 0.48], [0.1, 0.44], [0.28, 0.32]];
  const tipsAt = [];
  fingers.forEach(([x, l], i) => {
    const r0 = add(top, [w * x + sway * 0.4, len * 0.48]), tip = add(r0, [sway * 0.6 + (i - 1.5) * w * 0.04, len * l]), fw = w * 0.21;
    const pts = [add(r0, [-fw * 0.55, 0]), add(lerp(r0, tip, 0.5), [-fw * 0.5, 0]), add(tip, [-fw * 0.42, -fw * 0.3]), [...add(tip, [0, fw * 0.12]), 0], add(tip, [fw * 0.42, -fw * 0.3]), add(lerp(r0, tip, 0.5), [fw * 0.48, 0]), add(r0, [fw * 0.55, 0])];
    f.part(pts, { fill: mix(col, '#fff', 0.1 * (i % 2)), shadow: sh, shade: 0.26, inkW: 0.9, inkHeavy: 1.2, hatch: false, cast: false, opacity: 0.94 });
    f.flat(ell(add(tip, [0, -fw * 0.25]), fw * 0.32, fw * 0.42, 0, 8), '#d8c4b8', { op: 0.9 }); // the nail still in it
    f.line(ell(add(tip, [0, -fw * 0.25]), fw * 0.32, fw * 0.42, 0, 8).slice(4, 8), 0.7, INK, { op: 0.6 });
    for (const t of [0.35, 0.65]) f.line([add(lerp(r0, tip, t), [-fw * 0.4, 0]), add(lerp(r0, tip, t + 0.03), [fw * 0.4, 0])], 0.7, INK, { op: 0.4 }); // the knuckle creases, empty
    tipsAt.push(tip);
  });
  // the thumb sleeve on one side, hanging out and down
  const tb = add(top, [w * (o.thumb ?? -1) * 0.58, len * 0.24]), tt = add(tb, [w * (o.thumb ?? -1) * 0.18, len * 0.38]);
  f.part([add(tb, [-w * 0.1, 0]), add(tt, [-w * 0.09, 0]), add(tt, [0, w * 0.1]), add(tt, [w * 0.09, 0]), add(tb, [w * 0.12, 0])], { fill: col, shadow: sh, shade: 0.26, inkW: 0.9, inkHeavy: 1.2, hatch: false, cast: false, opacity: 0.94 });
  // the inside of the cuff (dark), creases, pink veining showing through
  f.flat([add(top, [-w * 0.5, 1]), add(top, [w * 0.5, 1]), add(top, [w * 0.4, w * 0.18]), add(top, [-w * 0.4, w * 0.2])], P.rawD, { op: 0.55 });
  for (let i = 0; i < 3; i++) f.line([add(top, [-w * 0.4, len * (0.12 + i * 0.12)]), add(top, [w * 0.05, len * (0.16 + i * 0.12)]), add(top, [w * 0.4, len * (0.12 + i * 0.12)])], 0.8, INK, { op: 0.35 });
  f.line([add(top, [-w * 0.2, len * 0.08]), add(top, [-w * 0.1, len * 0.3]), add(top, [-w * 0.24, len * 0.46])], 0.8, P.rawL, { op: 0.5 });
  // crumpled: blotches where the dead skin has dried and where the raw underside shows through, the torn cuff ragged
  for (let i = 0; i < 5; i++) f.flat(ell(add(top, [(f.r() - 0.5) * w * 0.8, len * (0.1 + f.r() * 0.7)]), w * 0.1, w * 0.06, f.r() * 3, 8), i % 2 ? '#c8a8a0' : P.rawL, { op: 0.4 });
  for (let i = 0; i < 5; i++) { const q = add(top, [-w * 0.5 + i * w * 0.25, 0]); f.line([q, add(q, [(f.r() - 0.5) * 4, -w * 0.1 - f.r() * w * 0.08])], 1.2, col); }
  f.line([add(top, [-w * 0.45, len * 0.2]), add(top, [-w * 0.2, len * 0.36]), add(top, [w * 0.3, len * 0.3])], 1, INK, { op: 0.35 });
  return tipsAt;
}

// one cooked cockroach seen from above-side: c centre, a heading angle, s length. Shell boiled red like shrimp, split
// along the back, swollen glossy abdomen, six thick jointed legs (curled if o.dead), long antennae.
function roach(f, c, a, s, o = {}) {
  const F = frame(c, a, s), col = o.col || '#b8402a', dk = mix(col, '#2a0808', 0.6), lt = mix(col, '#ffd0b0', 0.45);
  const look = { fill: col, shadow: '#3a0e0a', shade: 0.4, inkW: Math.max(0.8, s * 0.02), inkHeavy: Math.max(1, s * 0.035), cast: o.cast ?? false, hatch: s > 40 };
  const legs = o.dead ? [[0.1, 1, 0.9], [-0.05, 1, 1.1], [-0.2, 1, 1.3], [0.1, -1, 0.9], [-0.05, -1, 1.1], [-0.2, -1, 1.3]] : [[0.14, 1, 0.5], [-0.02, 1, 0.2], [-0.18, 1, -0.2], [0.14, -1, 0.5], [-0.02, -1, 0.2], [-0.18, -1, -0.2]];
  const lw = Math.max(1.2, s * 0.045);
  for (const [x, sd, sp] of legs) {
    const b0 = [x, sd * 0.12], k1 = add(b0, rot([0.22, 0], sd * (1.2 - sp * 0.4))), k2 = add(k1, rot([0.26, 0], sd * (o.dead ? 2.4 : 1.6) - sp * sd * 0.6));
    f.part(F(K.chain([b0, k1, k2], [lw * 1.6 / s, lw * 1.1 / s, lw * 0.6 / s])), Object.assign({}, look, { fill: dk, inkW: 0.7, inkHeavy: 0.9 }));
    for (const q of [lerp(k1, k2, 0.4), lerp(k1, k2, 0.75)]) f.line(F([q, add(q, rot([0.05, 0], sd * 2))]), 0.6, INK, { op: 0.7 }); // spines
  }
  // abdomen (swollen), thorax shield (pronotum), head tucked under it; wings split open along the back
  f.part(F([[-0.5, 0], [-0.44, -0.16], [-0.22, -0.22], [0.02, -0.2], [0.12, -0.12], [0.12, 0.12], [0.02, 0.2], [-0.22, 0.22], [-0.44, 0.16]]), Object.assign({}, look, { fill: mix(col, '#e08060', 0.15) }));
  for (let i = 1; i < 5; i++) f.line(F([[-0.46 + i * 0.1, -0.17], [-0.48 + i * 0.1, 0.17]]), 0.6, INK, { op: 0.5 }); // segments
  f.part(F([[-0.38, -0.02], [-0.3, -0.2], [0.0, -0.21], [0.1, -0.1], [0.08, 0.0]]), Object.assign({}, look, { fill: mix(col, '#5a1410', 0.25), inkW: 0.7 })); // wing cases, split
  f.part(F([[-0.38, 0.02], [0.08, 0.0], [0.1, 0.1], [0.0, 0.21], [-0.3, 0.2]]), Object.assign({}, look, { fill: mix(col, '#5a1410', 0.15), inkW: 0.7 }));
  f.flat(F([[-0.36, 0], [0.06, -0.01], [0.06, 0.01]]), '#e8c8b0', { op: 0.7 }); // the pale meat in the split
  f.part(F([[0.06, -0.15], [0.2, -0.17], [0.3, -0.1], [0.32, 0], [0.3, 0.1], [0.2, 0.17], [0.06, 0.15]]), Object.assign({}, look, { fill: mix(col, '#ffc0a0', 0.2) })); // pronotum
  f.line(F([[0.1, -0.1], [0.24, -0.12], [0.3, -0.04]]), 0.8, lt, { op: 0.8 });
  f.flat(F(ell([0.34, 0], 0.05, 0.07, 0, 8)), dk);
  if (o.antennae !== false) for (const sd of [-1, 1]) f.line(F([[0.36, sd * 0.04], [0.55, sd * 0.16], [0.72, sd * (o.dead ? 0.4 : 0.1)], [0.86, sd * (o.dead ? 0.36 : 0.26)]]), 0.7, INK, { op: 0.85 });
  f.line(F([[-0.4, -0.12], [-0.1, -0.16]]), Math.max(0.8, s * 0.025), '#fff', { op: 0.55 }); // gloss
  for (const sd of [-1, 1]) f.line(F([[-0.5, sd * 0.06], [-0.6, sd * 0.1]]), 0.7, INK, { op: 0.7 }); // cerci
}

// a hoof seen side-on: A the fetlock, gy the ground, dir +1 toes right, w width. Soft and split (water), shoe optional.
function hoof(f, A, gy, dir, w, look, o = {}) {
  const X = u => A[0] + dir * u * w, h = gy - A[1];
  const pastern = [add(A, [-dir * w * 0.42, 0]), add(A, [dir * w * 0.36, -2]), [X(0.62), A[1] + h * 0.5], [X(0.78), gy - h * 0.12]];
  const hf = [[X(0.26), A[1] + h * 0.42], [X(0.86), gy - h * 0.24], [X(1.02), gy - 2, 1], [X(-0.46), gy - 2, 1], [X(-0.5), gy - h * 0.3], [X(-0.42), A[1] + h * 0.5]];
  f.part([...pastern, ...hf.slice(1, 4), [X(-0.5), gy - h * 0.34], [X(-0.48), A[1] + h * 0.3]], Object.assign({}, look, { cast: false }));
  f.part(hf, { fill: o.col || Q.hoof, shadow: '#140e0c', shade: 0.4, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: 1.3, inkHeavy: 2 });
  f.line([[X(0.3), A[1] + h * 0.5], [X(0.84), gy - h * 0.2]], 1.6, Q.hoofL, { op: 0.6 }); // the wall's lit edge
  for (let i = 0; i < 3; i++) f.line([[X(-0.3 + i * 0.4), A[1] + h * 0.52], [X(-0.24 + i * 0.44), gy - 4]], 0.9, INK, { op: 0.45 }); // growth rings, ridged
  if (o.split) f.line([[X(0.66), gy - h * 0.28], [X(0.6), gy - h * 0.12], [X(0.68), gy - 3]], 1.6, '#0a0606'); // a split up the wall
  if (o.shoe) { f.part([[X(-0.46), gy - 8], [X(1.0), gy - 8], [X(1.02), gy, 1], [X(-0.48), gy, 1]], { fill: P.iron, shade: 0.3, inkW: 1, cast: false, sharp: true }); for (let i = 0; i < 3; i++) f.flat(ell([X(-0.2 + i * 0.4), gy - 4], 1.6, 1.6, 0, 6), P.ironL); }
  f.line([[X(-0.5), gy - h * 0.3], [X(-0.42), A[1] + h * 0.5], [X(-0.2), A[1] + h * 0.3]], 1, INK, { op: 0.4 }); // the heel bulb
  // the coronet: soft swollen flesh rolling over the top of the hoof wall
  f.stroke([[X(-0.44), A[1] + h * 0.46], [X(0.1), A[1] + h * 0.36], [X(0.4), A[1] + h * 0.44]], 3, mix(look.fill, '#3a1418', 0.5), { op: 0.6 });
}

// a bare leg in a strong bend (squat, crouch, bent knee) as one anatomical outline through hip, knee and ankle (mchain):
// the quadriceps' long swell on top, the hamstring under it, the knee's bony knob on the outside of the bend and a crease
// on the inside, the calf belly swelling high behind the shin and tapering to the Achilles, a narrow ankle; then a bare
// foot. Split for the rig at knee and ankle. ws: [thigh width, knee width, ankle width]; s: foot length unit.
// o.side: which normal side of the thigh is its underside (+1 P, -1 Q); worked out from the bend if not given.
function bentLeg(f, Hp, Kn, A, ws, s, look, sfx, o = {}) {
  const [wT, wK, wA] = ws, dT = E.norm(sub(Kn, Hp)), dS = E.norm(sub(A, Kn)), nT = [-dT[1], dT[0]];
  const inner = (dS[0] * nT[0] + dS[1] * nT[1]) > 0 ? 1 : -1; // the inside of the knee's bend is on the thigh's P side when +1
  const th = (pp, qq) => inner > 0 ? [pp, qq] : [qq, pp];
  const hamQ = [[0, wT * 0.5], [0.3, wT * 0.56], [0.65, wT * 0.5], [0.9, wK * 0.46], [1, wK * 0.42]], quad = [[0, wT * 0.46], [0.35, wT * 0.53], [0.7, wT * 0.46], [0.92, wK * 0.5], [1, wK * 0.48]];
  const calf = [[0, wK * 0.42], [0.14, wK * 0.56], [0.32, wK * 0.58], [0.55, wK * 0.44], [0.8, wA * 0.62], [1, wA * 0.5]], shin = [[0, wK * 0.46], [0.2, wK * 0.4], [0.55, wK * 0.34], [0.85, wA * 0.56], [1, wA * 0.5]];
  const nS = [-dS[1], dS[0]], innerS = (dT[0] * nS[0] + dT[1] * nS[1]) < 0 ? 1 : -1; // calf (inside of the bend) on P when +1
  const sh = (pp, qq) => innerS > 0 ? [pp, qq] : [qq, pp];
  const dk = elb(Hp, Kn, A), da = add(dS, [0.5, 0]);
  const lt = mix(look.fill, '#fff', 0.3), dkC = mix(look.fill, '#1a0a0a', 0.55);
  return split(f, () => {
    const out = f.part(T.mchain([Hp, Kn, A], [th(hamQ, quad), sh(calf, shin)], { knob: [1.18], capB: true }), Object.assign({ k: 0.9 }, look));
    // knee: the kneecap as a lit plane on the outside of the bend, the tendon under it, a crease on the inside
    const out_ = E.norm(sub(mul(dT, 1), mul(dS, 1))), kc = add(Kn, mul(out_, wK * 0.34));
    f.flat(ell(kc, wK * 0.2, wK * 0.15, Math.atan2(out_[1], out_[0]) + 1.57, 10), lt, { op: 0.4 });
    f.line(ell(kc, wK * 0.22, wK * 0.17, Math.atan2(out_[1], out_[0]) + 1.57, 10).slice(5, 10), 1.3, dkC, { op: 0.5 });
    f.line([add(kc, mul(dS, wK * 0.2)), lp(Kn, A, 0.2, -innerS * wK * 0.3)], 1.2, dkC, { op: 0.4 });
    f.line([add(Kn, add(mul(out_, -wK * 0.3), mul(dT, -wK * 0.3))), add(Kn, mul(out_, -wK * 0.4)), add(Kn, add(mul(out_, -wK * 0.3), mul(dS, wK * 0.3)))], 1.6, dkC, { op: 0.6 });
    // thigh: the quad's swell lit, the groove between quad and hamstring; shin: the bone's lit edge, the calf groove
    f.line([lp(Hp, Kn, 0.15, -inner * wT * 0.3), lp(Hp, Kn, 0.5, -inner * wT * 0.36), lp(Hp, Kn, 0.85, -inner * wK * 0.3)], 2, lt, { op: 0.4 });
    f.line([lp(Hp, Kn, 0.2, inner * wT * 0.1), lp(Hp, Kn, 0.6, inner * wT * 0.14), lp(Hp, Kn, 0.9, inner * wK * 0.06)], 1.3, dkC, { op: 0.4 });
    f.line([lp(Kn, A, 0.15, -innerS * wK * 0.3), lp(Kn, A, 0.55, -innerS * wK * 0.26), lp(Kn, A, 0.88, -innerS * wA * 0.3)], 1.8, lt, { op: 0.5 });
    f.line([lp(Kn, A, 0.12, innerS * wK * 0.1), lp(Kn, A, 0.4, innerS * wK * 0.16), lp(Kn, A, 0.62, innerS * wK * 0.06)], 1.3, dkC, { op: 0.45 });
    f.line([lp(Kn, A, 0.62, innerS * wA * 0.4), lp(Kn, A, 0.96, innerS * wA * 0.4)], 1.4, dkC, { op: 0.5 }); // Achilles
    if (o.after) o.after();
    return out;
  }, [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.55)], ['shin' + sfx, [side(Kn, dk, wK * 0.55), side(A, mul(da, -1), wA * 0.6)]]]);
}

// wear on a cloth area so it never reads as a flat field: clipped to the outline, soft damp patches, a few stains, tide
// lines, darns. pts: the cloth outline; bb its rough box [x0,y0,x1,y1]; n how much.
function clothWear(f, pts, bb, n = 4, o = {}) {
  const cid = f.id('cw'), d = E.smooth(pts), R = (a, b) => a + (b - a) * f.r();
  f.defs.push(`<clipPath id="${cid}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${cid})">`);
  for (let i = 0; i < n; i++) { const c = [R(bb[0], bb[2]), R(bb[1], bb[3])], rx = R(14, 34), ry = R(16, 40); f.raw(`<path d="${E.smooth(T.lumpy(f, ell(c, rx, ry, R(-0.5, 0.5), 10), rx * 0.2))}" fill="${o.damp || '#3a2e2a'}" opacity="${R(0.16, 0.3).toFixed(2)}" filter="url(#steamblur${f.o.seed})"/>`); }
  for (let i = 0; i < Math.ceil(n / 2); i++) { const c = [R(bb[0], bb[2]), R(bb[1], bb[3])], e = T.lumpy(f, ell(c, R(8, 18), R(6, 14), R(0, 3), 10), 3); f.flat(e, o.stain || '#6a4a38', { op: 0.28 }); f.line(e.slice(2, 8), 1, o.stain || '#5a3a2a', { op: 0.4 }); }
  if (o.tide) { const y0 = o.tide, pts2 = []; for (let x = bb[0] - 10; x <= bb[2] + 10; x += 22) pts2.push([x, y0 + Math.sin(x * 0.07) * 6 + R(-3, 3)]); f.flat([...pts2, [bb[2] + 10, bb[3] + 30], [bb[0] - 10, bb[3] + 30]], o.damp || '#3a2e2a', { op: 0.22 }); f.line(pts2, 1.4, '#e8e0d4', { op: 0.35 }); }
  f.raw('</g>');
}

// a small animal's paw on the ground: the heel pad behind, three knuckled toes splayed forward with overgrown curling
// claws. P: the paw's back (where the pastern meets it), dir +1 toes right, s: toe size
function paw(f, P0, gy, dir, s, look, o = {}) {
  const X = u => P0[0] + dir * u * s;
  f.part([[X(-0.5), gy - 2, 1], [X(-0.6), gy - s * 0.7], [X(-0.2), gy - s * 1.2], [X(0.6), gy - s * 1.2], [X(1.4), gy - s * 0.7], [X(1.6), gy - 2, 1]], Object.assign({}, look, { cast: false }));
  for (let i = 2; i >= 0; i--) {
    const tx = X(0.3 + i * 0.5), ty = gy - 1, sh = i === 1 ? 0 : 0.1;
    f.part([[tx - dir * s * 0.42, ty, 1], [tx - dir * s * 0.46, ty - s * 0.6], [tx - dir * s * 0.1, ty - s * 0.84], [tx + dir * s * 0.3, ty - s * 0.66], [tx + dir * s * 0.44, ty - s * 0.3], [tx + dir * s * 0.4, ty, 1]], Object.assign({}, look, { cast: false, inkW: 1.1, inkHeavy: 1.5, fill: mix(look.fill, '#3a1a1a', sh) }));
    f.line([[tx - dir * s * 0.2, ty - s * 0.68], [tx + dir * s * 0.12, ty - s * 0.56]], 0.9, INK, { op: 0.5 }); // the knuckle crease
    // the overgrown claw, curling down past the toe and touching the floor
    const c0 = [tx + dir * s * 0.34, ty - s * 0.4], c1 = [tx + dir * s * (0.8 + (o.claw ?? 0.4)), ty - s * 0.2], c2 = [tx + dir * s * (0.9 + (o.claw ?? 0.4)), ty - 1];
    f.part([add(c0, [0, -s * 0.12]), c1, [...c2, 1], add(c1, [-dir * s * 0.16, s * 0.06]), add(c0, [0, s * 0.12])], { fill: o.clawCol || '#3a2e2a', shade: 0.3, inkW: 0.9, inkHeavy: 1.1, cast: false });
  }
  f.flat(ell([X(0.5), gy - 1], s * 1.2, 2, 0, 8), '#1a1010', { op: 0.4 });
}

// glass vessel helper: a translucent outline with a dark core, a highlight and an inner liquid with a level line
function glassPart(f, pts, o = {}) {
  f.part(pts, { fill: o.col || Q.glass, shadow: Q.glassD, shade: 0.3, inkW: 1.2, inkHeavy: 1.6, hatch: false, cast: false, opacity: o.op ?? 0.75 });
}


// kit_III's peelSheet with a short, wide torn bed: a tall pointed raw bed over a narrow sheet read as a candle flame at
// sheet size; a sheet that has just come away leaves a broad raw patch only a little taller than it is wide
function peel(f, root, w, len, o = {}) { return T.peelSheet(f, root, w, len, Object.assign({ up: w * 0.6, bedCol: mix(P.raw, P.poach, 0.25) }, o)); }

// ======== independent review additions (2026-11-23) ========

// A fist with modelled anatomy (the shared B.fist reads as a flat glove block). Same frame as B.fist: local +x points
// along ang to the knuckles, the back of the hand faces -x (the elbow), the knuckle row runs along local y with the thumb
// on -y (o.flip mirrors it to +y); the gripped object runs along local y at x = 0.5 and is drawn before the fist. Big
// knuckle heads with valleys between them, extensor tendons fanning from the wrist to each knuckle, each finger's first
// segment over the top of the grip with the middle knuckle rounding it and its crease, the fingertip tucked under, the
// thumb wrapping over the index finger. o.raw: a flayed hand (the skin gone): wet red muscle with grain along it, the
// tendons standing out pale and glossy, the knuckle caps pale cartilage, dark nail beds and no nails. Otherwise skin with
// nails and dimples (o.fat) or bony knuckles. Use through gripK, which takes the angle from B.gripAngle.
function knuckleFist(f, c, ang, s, col, o = {}) {
  s *= o.scale ?? 1.18;
  const F0 = frame(c, ang, s), F = o.flip ? pts => F0(pts.map(p => p.length > 2 ? [p[0], -p[1], p[2]] : [p[0], -p[1]])) : F0;
  const sh = o.shadow || mix(col, '#1a0808', 0.6), dk = mix(col, '#1a0606', 0.55), lt = mix(col, '#fff4ec', 0.4);
  const tendon = o.raw ? '#d4988a' : mix(col, '#fff', 0.3) /* consistency pass: raw tendons muted, they read as glove seams */, lw = Math.max(1, s * 0.012);
  const look = (x = {}) => Object.assign({ fill: col, shadow: sh, shade: 0.42, inkW: Math.max(1.1, s * 0.012), inkHeavy: Math.max(1.6, s * 0.022), cast: false, k: 0.85, tex: o.tex, texOp: o.texOp ?? 0.5, maxShade: s * 0.14 }, x);
  // the back of the hand: narrow at the wrist, broad at the knuckle row, its far edge rounding over the little finger
  f.part(F([[-0.86, -0.4], [-0.5, -0.52], [0.0, -0.6], [0.3, -0.58], [0.42, -0.36], [0.44, 0.0], [0.42, 0.36], [0.32, 0.56], [-0.05, 0.6], [-0.5, 0.5], [-0.88, 0.36], [-0.94, 0.0]]), look({ cast: o.cast ?? true, castOp: 0.35 }));
  const rows = [[-0.4, 0.16, 0.86], [-0.12, 0.16, 0.9], [0.16, 0.15, 0.86], [0.42, 0.13, 0.78]];
  // fingers, little finger first (it sits lowest), each one outline: the first segment over the grip, the middle knuckle
  // rounding it, the middle segment turning down out of sight, the tip tucked under the palm
  for (let i = 3; i >= 0; i--) {
    const [y, hh, x1] = rows[i];
    f.part(F([[0.24, y - hh], [0.5, y - hh - 0.02], [x1 - 0.1, y - hh - 0.005], [x1 + 0.02, y - hh * 0.5], [x1 + 0.04, y + hh * 0.2], [x1 - 0.04, y + hh * 0.85], [x1 - 0.2, y + hh + 0.01], [0.5, y + hh + 0.02], [0.24, y + hh]]), look({ shade: 0.46 }));
    f.line(F([[x1 - 0.17, y - hh * 0.8], [x1 - 0.13, y], [x1 - 0.16, y + hh * 0.75]]), lw * 1.1, dk, { op: 0.6 }); // the middle knuckle's crease
    f.line(F([[x1 - 0.05, y - hh * 0.6], [x1 + 0.0, y + hh * 0.1]]), lw * 1.4, lt, { op: 0.5 }); // its lit round
    f.flat(F([[0.3, y + hh - 0.03], [x1 - 0.2, y + hh - 0.02], [x1 - 0.12, y + hh + 0.01], [0.3, y + hh + 0.01]]), dk, { op: 0.55 }); // the shadow under the finger, on the next one
    f.line(F([[0.34, y - hh * 0.5], [0.6, y - hh * 0.62]]), lw * 1.3, lt, { op: 0.4 });
    // the tip tucked under: a sliver of the fingertip and its nail (or a dark nail bed) at the fist's lower edge
    const tp = [x1 - 0.26, y + hh + 0.035];
    f.part(F(ell(tp, 0.07, 0.035, 0, 8)), look({ fill: mix(col, '#2a0a0a', 0.2), inkW: 0.9, inkHeavy: 1, shade: 0.3, tex: null }));
    f.flat(F(ell(add(tp, [0.02, -0.005]), 0.04, 0.02, 0, 8)), o.raw ? '#5a1418' : (o.nail || mix(col, '#f0e4da', 0.5)), { op: 0.9 });
  }
  // knuckle heads, the valleys between them, tendons fanning back over the hand to the wrist
  rows.forEach(([y], i) => {
    const kh = [0.33, y * 0.92];
    f.line(F([[-0.78, y * 0.3], [-0.3, y * 0.6], [0.1, y * 0.86], kh]), o.raw ? lw * 1.6 : lw * 1.4, tendon, { op: o.raw ? 0.55 : 0.45 });
    if (o.raw) f.line(F([[-0.78, y * 0.3 + 0.03], [-0.3, y * 0.6 + 0.03], [0.1, y * 0.86 + 0.03], add(kh, [0, 0.03])]), lw, '#6a2a1a', { op: 0.6 });
    if (o.fat) { f.line(F([[kh[0] + 0.02, kh[1] - 0.06], [kh[0] + 0.05, kh[1]], [kh[0] + 0.02, kh[1] + 0.06]]), lw * 1.6, dk, { op: 0.6 }); }
    else { f.part(F(ell(kh, 0.085, 0.105, 0, 10)), look({ fill: o.raw ? '#c87868' : mix(col, '#fff', 0.2), inkW: 0.9, inkHeavy: 1.1, shade: 0.35, tex: null })); f.flat(F(ell(add(kh, [-0.02, -0.03]), 0.03, 0.04, 0, 6)), '#fff', { op: o.raw ? 0.45 : 0.35 }); }
    if (i < 3) f.line(F([[0.24, (y + rows[i + 1][0]) / 2], [0.44, (y + rows[i + 1][0]) / 2 + 0.01]]), lw * 1.4, dk, { op: 0.6 });
  });
  if (o.raw) { // the flayed back: muscle grain running to the fingers, wet highlights, the torn edge of the skin at the wrist
    for (let i = 0; i < 3; i++) { const y = (rows[i][0] + rows[i + 1][0]) / 2; f.part(F([[-0.7, y * 0.4 - 0.05], [0.0, y * 0.8 - 0.06], [0.24, y - 0.05], [0.24, y + 0.05], [0.0, y * 0.8 + 0.06], [-0.7, y * 0.4 + 0.05]]), look({ fill: mix(col, '#e07060', 0.3), inkW: 0, inkHeavy: 0, shade: 0.2, tex: null })); f.line(F([[-0.6, y * 0.45], [0.2, y]]), lw * 0.8, '#4a0e0e', { op: 0.5 }); } // the muscle bellies between the bones, swollen
    for (let i = 0; i < 9; i++) { const y = -0.48 + i * 0.12; f.line(F([[-0.84, y * 0.8], [-0.5, y * 0.9 + 0.02]]), lw * 0.7, '#4a0e0e', { op: 0.4 }); }
    f.line(F([[-0.7, -0.36], [-0.2, -0.46], [0.2, -0.5]]), lw * 2.4, '#fff4ec', { op: 0.55 });
    f.line(F([[0.5, -0.56], [0.7, -0.58]]), lw * 2, '#fff4ec', { op: 0.5 });
    // meat, not a glove: dark clotted blood in the grooves and runs of it, glistening points, the ragged rim of skin at the
    // wrist where the glove tore away
    for (const [x, y, r] of [[-0.5, 0.2, 0.16], [0.1, -0.2, 0.12], [-0.2, 0.42, 0.12], [0.6, 0.3, 0.1]]) f.raw(`<path d="${E.smooth(F(ell([x, y], r * 1.4, r, 0.3, 10)))}" fill="#4a0a0e" opacity="0.4" filter="url(#steamblur${f.o.seed})"/>`);
    for (const y of [-0.3, 0.1, 0.38]) f.stroke(F([[0.3, y], [0.5, y + 0.06], [0.7, y + 0.04], [0.86, y + 0.12]]), lw * 2.6, '#5a0c10', { op: 0.65 });
    for (let i = 0; i < 9; i++) f.flat(F(ell([-0.7 + (i % 5) * 0.32, -0.45 + Math.floor(i / 5) * 0.7 + (i % 2) * 0.1], 0.025, 0.018, 0, 6)), '#fff', { op: 0.8 });
    const cuff = []; for (let i = 0; i <= 10; i++) { const y = -0.5 + i * 0.1; cuff.push([-0.9 + f.r() * 0.07 - (i % 3 === 1 ? 0.05 : 0), y + (f.r() - 0.5) * 0.04]); }
    f.stroke(F(cuff), Math.max(4, s * 0.06), '#e6cec4'); f.line(F(cuff.map(([x, y]) => [x + 0.04, y])), lw, INK, { op: 0.6 });
  } else {
    f.line(F([[-0.8, 0.12], [-0.4, 0.04], [-0.1, 0.16], [0.1, 0.1]]), lw * 1.4, o.vein || mix(col, '#6a5a8a', 0.45), { op: 0.5 });
  }
  // the thumb, wrapping over the index finger's first segment: two segments, the joint crease, the nail (or bed)
  if (o.thumb !== false) {
    f.part(F([[-0.56, -0.46], [-0.24, -0.72], [0.12, -0.84], [0.44, -0.84], [0.66, -0.74], [0.68, -0.6], [0.5, -0.5], [0.16, -0.5], [-0.2, -0.36], [-0.5, -0.22]]), look({ shade: 0.46, inkHeavy: Math.max(1.8, s * 0.024) }));
    f.line(F([[0.16, -0.82], [0.2, -0.66], [0.14, -0.52]]), lw * 1.2, dk, { op: 0.55 });
    f.part(F(ell([0.52, -0.73], 0.1, 0.06, -0.1, 8)), look({ fill: o.raw ? '#6a1a1e' : (o.nail || mix(col, '#f0e4da', 0.5)), inkW: 0.9, inkHeavy: 1, shade: 0.3, tex: null }));
    f.line(F([[-0.4, -0.5], [-0.1, -0.7], [0.3, -0.8]]), lw * 1.6, lt, { op: 0.45 });
    if (o.raw) f.line(F([[-0.5, -0.36], [-0.1, -0.6], [0.3, -0.7]]), lw * 1.6, tendon, { op: 0.55 });
  }
  return F;
}
// gripK: a fist on a straight object with its angle from B.gripAngle (the shared rule), drawn with knuckleFist
function gripK(f, c, elbow, thumbAng, s, col, o = {}) {
  const g = B.gripAngle(c, elbow, thumbAng, o);
  g.F = knuckleFist(f, c, g.ang, s, col, Object.assign({}, o, { flip: g.flip }));
  return g;
}

// A soft or bony bare arm, shoulder to wrist, as one anatomical outline (mchain) with the build's anatomy on it.
// ws: [shoulder, elbow, wrist] widths. o.build: 'fat' (a heavy lobe hanging under the upper arm, a dimpled elbow, rolls
// at the wrist), 'gaunt' (a bony elbow point, slack skin under the upper arm, forearm tendons, the wrist bone), 'soft'
// (smooth, young, a little fat). Draws into the current bone (o.split for a rig split at the elbow). Returns helpers.
function fleshArm(f, S0, E0, W0, ws, look, o = {}) {
  const b = o.build || 'soft', [wS, wE, wW] = ws;
  const dU = E.norm(sub(E0, S0)), dF = E.norm(sub(W0, E0)), nU = [-dU[1], dU[0]], nF = [-dF[1], dF[0]];
  const downU = nU[1] >= 0 ? 1 : -1, downF = nF[1] >= 0 ? 1 : -1; // which side of each segment faces the floor
  const inU = (dF[0] * nU[0] + dF[1] * nU[1]) > 0 ? 1 : -1; // the inside of the elbow's bend, on the upper arm
  const sc = (arr, w) => arr.map(([t, k]) => [t, k * w]);
  let upDown, upUp, faDown, faUp;
  if (b === 'fat') {
    upDown = sc([[0, 0.5], [0.22, 0.64], [0.5, 0.72], [0.76, 0.6], [1, 0.44]], wS); upUp = sc([[0, 0.5], [0.3, 0.52], [0.65, 0.48], [1, 0.42]], wS);
    faDown = sc([[0, 0.46], [0.25, 0.52], [0.6, 0.44], [0.88, 0.36], [1, 0.38]], wE); faUp = sc([[0, 0.46], [0.3, 0.48], [0.7, 0.4], [0.9, 0.34], [1, 0.36]], wE);
  } else if (b === 'gaunt') {
    upDown = sc([[0, 0.46], [0.2, 0.5], [0.5, 0.46], [0.8, 0.36], [1, 0.4]], wS); upUp = sc([[0, 0.44], [0.3, 0.4], [0.6, 0.34], [0.86, 0.33], [1, 0.38]], wS);
    faDown = sc([[0, 0.42], [0.2, 0.46], [0.5, 0.34], [0.82, 0.24], [0.94, 0.27], [1, 0.25]], wE); faUp = sc([[0, 0.4], [0.25, 0.44], [0.55, 0.32], [0.85, 0.24], [1, 0.26]], wE);
  } else {
    upDown = sc([[0, 0.5], [0.3, 0.56], [0.6, 0.52], [1, 0.42]], wS); upUp = sc([[0, 0.5], [0.35, 0.5], [0.7, 0.44], [1, 0.4]], wS);
    faDown = sc([[0, 0.44], [0.3, 0.48], [0.7, 0.38], [1, 0.34]], wE); faUp = sc([[0, 0.44], [0.3, 0.46], [0.7, 0.38], [1, 0.34]], wE);
  }
  if (wW) { faDown[faDown.length - 1][1] = wW * 0.5; faUp[faUp.length - 1][1] = wW * 0.5; }
  const profs = [downU > 0 ? [upDown, upUp] : [upUp, upDown], downF > 0 ? [faDown, faUp] : [faUp, faDown]];
  const pts = T.mchain([S0, E0, W0], profs, { knob: [b === 'gaunt' ? 1.3 : 1.12], capA: o.capA });
  const u = (t, k) => lp(S0, E0, t, k * wS), fa = (t, k) => lp(E0, W0, t, k * wE);
  const dk = mix(look.fill, '#2a0c14', 0.55), lt = mix(look.fill, '#fff', 0.38), fold = look.fold || '#8a3a44';
  const draw = () => {
    if (o.occ) occlude(f, pts, wS * 0.12, 0.45);
    const out = f.part(pts, Object.assign({ k: 0.9 }, look));
    const cid = f.id('fa'); f.defs.push(`<clipPath id="${cid}"><path d="${out}"/></clipPath>`);
    // soft modelling clipped to the arm: light along the top, a warm shade under it
    f.raw(`<g clip-path="url(#${cid})"><path d="${E.smooth([u(0, -downU * 0.7), u(0.5, -downU * 0.7), u(1, -downU * 0.6), fa(0.5, -downF * 0.6), fa(1, -downF * 0.55), fa(1, -downF * 0.2), fa(0.5, -downF * 0.2), u(1, -downU * 0.2), u(0.5, -downU * 0.25), u(0, -downU * 0.3)])}" fill="${lt}" opacity="0.3" filter="url(#steamblur2${f.o.seed})"/><path d="${E.smooth([u(0.05, downU * 0.8), u(0.5, downU * 0.85), u(1, downU * 0.6), fa(0.5, downF * 0.6), fa(1, downF * 0.5), fa(1, downF * 0.2), fa(0.5, downF * 0.25), u(1, downU * 0.25), u(0.5, downU * 0.35), u(0.05, downU * 0.3)])}" fill="${dk}" opacity="0.32" filter="url(#steamblur2${f.o.seed})"/></g>`);
    f.line([u(0.1, -downU * 0.34), u(0.5, -downU * 0.36), u(0.85, -downU * 0.3)], Math.max(1.4, wS * 0.025), lt, { op: 0.45 });
    // the elbow: crease on the inside of the bend, the point (or dimple) on the outside
    const ex = add(E0, mul(E.norm(sub(dU, dF)), -inU * 0)), bis = E.norm(add(nU, nF));
    f.line([lp(S0, E0, 0.9, inU * wE * 0.36), lp(S0, E0, 0.97, inU * wE * 0.1), lp(E0, W0, 0.06, inU * wE * 0.32)], Math.max(1.4, wE * 0.03), fold, { op: 0.7 });
    if (b === 'gaunt') {
      const ep = add(E0, mul(bis, -inU * wE * 0.38));
      f.part(ell(ep, wE * 0.16, wE * 0.12, Math.atan2(dU[1], dU[0]), 10), Object.assign({}, look, { cast: false, inkW: 1, inkHeavy: 1.2, hatch: false, maxShade: 4, fill: mix(look.fill, lt, 0.35) }));
      for (let i = 0; i < 3; i++) f.line([add(ep, rot([-wE * (0.1 + i * 0.08), -wE * 0.16], Math.atan2(dU[1], dU[0]))), add(ep, rot([-wE * (0.14 + i * 0.08), wE * 0.16], Math.atan2(dU[1], dU[0])))], 1, dk, { op: 0.5 }); // wrinkled skin over the point
      f.line([fa(0.15, -inU * 0.1), fa(0.5, -inU * 0.08), fa(0.85, -inU * 0.04)], 1.4, dk, { op: 0.5 }); // tendon groove
      f.line([fa(0.2, inU * 0.2), fa(0.55, inU * 0.16), fa(0.88, inU * 0.12)], Math.max(1.4, wE * 0.03), lt, { op: 0.45 });
      f.line([u(0.2, downU * 0.38), u(0.5, downU * 0.42), u(0.8, downU * 0.32)], 1.2, dk, { op: 0.45 }); // slack skin under the arm
      f.line([fa(0.3, downF * 0.16), fa(0.6, downF * 0.06), fa(0.75, downF * 0.12), fa(0.95, downF * 0.02)], 1.4, o.vein || mix(look.fill, '#5a5a8a', 0.5), { op: 0.55 });
      f.part(ell(fa(0.95, -downF * 0.26), wE * 0.07, wE * 0.06, 0, 8), Object.assign({}, look, { cast: false, inkW: 0.8, inkHeavy: 0.8, hatch: false, maxShade: 2, fill: lt })); // the wrist bone
    } else {
      const ep = add(E0, mul(bis, -inU * wE * 0.3));
      f.line([add(ep, rot([-wE * 0.06, -wE * 0.06], 0)), add(ep, [wE * 0.02, 0]), add(ep, [-wE * 0.04, wE * 0.07])], Math.max(1.4, wE * 0.03), fold, { op: 0.6 }); // the dimple over the elbow
    }
    if (b === 'fat') {
      f.stroke([u(0.18, downU * 0.48), u(0.5, downU * 0.44), u(0.82, downU * 0.4)], Math.max(2.4, wS * 0.04), fold, { op: 0.7 }); // the lobe's upper fold
      f.line([u(0.22, downU * 0.62), u(0.5, downU * 0.68), u(0.76, downU * 0.56)], Math.max(1.6, wS * 0.025), lt, { op: 0.45 }); // its lit swell
      for (let i = 0; i < 3; i++) f.line([u(0.35 + i * 0.12, downU * 0.5), u(0.4 + i * 0.12, downU * 0.62)], 1, '#f4e0e0', { op: 0.5 }); // stretch marks
      for (let i = 0; i < 2; i++) f.stroke([fa(0.82 + i * 0.09, -0.5), fa(0.86 + i * 0.09, 0), fa(0.82 + i * 0.09, 0.5)], Math.max(2, wE * 0.04), fold, { op: 0.6 }); // rolls at the wrist
    } else if (b === 'soft') {
      f.stroke([fa(0.9, -0.42), fa(0.93, 0), fa(0.9, 0.42)], Math.max(1.6, wE * 0.03), fold, { op: 0.5 });
    }
    if (o.deltoid) { // the shoulder's own mass capping the arm's root, laid over the torso's edge, its lower rim inked
      const dl = [add(S0, mul(dU, -wS * 0.5)), add(S0, mul(nU, -downU * wS * 0.62)), u(0.36, -downU * 0.6), u(0.5, 0), u(0.4, downU * 0.56), add(S0, mul(nU, downU * wS * 0.6))];
      f.part(dl, Object.assign({}, look, { inkW: 0, inkHeavy: 0, cast: false, hatch: false, maxShade: wS * 0.14 }));
      f.stroke([u(0.3, -downU * 0.56), u(0.46, -downU * 0.2), u(0.42, downU * 0.3)], Math.max(2, wS * 0.03), fold, { op: 0.6 });
      f.line([add(S0, mul(nU, -downU * wS * 0.4)), u(0.2, -downU * 0.5)], Math.max(1.6, wS * 0.03), lt, { op: 0.5 }); }
    T.wrinkles(f, fa(0.5, 0), fa(0.95, 0), wE * 0.8, 5, { op: 0.4 });
    if (o.peel) peel(f, u(0.55, downU * 0.3), Math.max(14, wS * 0.22), wS * 0.7, { sway: (f.r() - 0.5) * 6 });
    if (o.blisters !== false) T.blisters(f, lp(S0, E0, 0.92, inU * wE * 0.2), wE * 0.2, wE * 0.2, 3, 3, Math.max(5, wE * 0.06), { burst: 0.5 }); // blistered at the fold
    T.scald(f, u(0.5, 0), wS * 0.35, wS * 0.3, 6, { ang: Math.atan2(dU[1], dU[0]), pink: P.poachD });
    return out;
  };
  const out = o.split ? split(f, draw, [['upperarm' + o.split, side(E0, mul(elb(S0, E0, W0), -1), wE * 0.6)], ['forearm' + o.split, side(E0, elb(S0, E0, W0), wE * 0.6)]]) : draw();
  return { pts: out, u, fa, dU, dF, nU, nF, downU, downF, inU };
}

// A boiled noble's head with a character (the Best Families). kind: 'patriarch' (fat, bald, a grey fringe, jowls and a
// double chin, mouth open in complaint, a furrowed brow, broken veins), 'dowager' (gaunt, long, a hooked nose, hollow
// cheeks, sharp cheekbones, thin pursed lips mid-sentence, a collapsed wet coiffure with bone hairpins and a pearl drop),
// 'heir' (soft and young, round cheeks, a weak chin, wet curls, dozing with the lips slack), 'matron' (heavy, placid,
// dozing, hair slumped in a wet bun), 'snorer' (an old lord with a grey beard, mouth open, asleep). On every one the skin
// is boiled: swollen lids and lips (water), a flush, a peeling patch, blisters, sweat. Face shade 0.78 through face().
// o.skin, o.hair, o.lit. Returns the head frame.
function bfHead(f, HC, H, hA, kind, o = {}) {
  const seed = f.o.seed, skin = o.skin || '#f0d4c8', hF = frame(HC, hA, H), hair = o.hair || '#5a4a40';
  const shD = '#8a4652', fold = '#7a3a46', lipC = '#b8646a';
  const SKh = (x = {}) => Object.assign({ fill: skin, shadow: '#9a5662', shade: 0.32, tex: 'mottle' + seed, texOp: 0.4, maxShade: H * 0.1, cast: false }, x);
  const softF = (pts, col, op) => f.raw(`<path d="${E.smooth(hF(pts))}" fill="${col}" opacity="${op}" filter="url(#steamblur${seed})"/>`);
  const ln = (pts, w, col, op) => f.line(hF(pts), w, col, { op });
  const lids = (open, puff) => { for (const [x, w] of [[0.11, 0.078], [0.295, 0.034]]) { const lo = -0.058 + open * 0.02; f.part(hF([[x - w * 1.05, -0.07], [x - w * 0.3, -0.1 - puff], [x + w * 0.5, -0.098 - puff], [x + w * 1.05, -0.074], [x + w * 0.9, lo + 0.004], [x, lo - 0.004], [x - w * 0.9, lo]]), SKh({ fill: mix(skin, '#d89a98', 0.35), inkW: 1.2, inkHeavy: 1.8, maxShade: 4 })); f.line(hF([[x - w * 0.95, lo], [x, lo + 0.008], [x + w * 0.9, lo + 0.002]]), 1.8, INK, { op: 0.85 }); ln([[x - w * 0.8, -0.108 - puff], [x, -0.122 - puff], [x + w * 0.8, -0.108 - puff]], 1.2, fold, 0.5); } };
  const bags = (k) => { for (const [x, w] of [[0.11, 0.07], [0.29, 0.03]]) { ln([[x - w, -0.03], [x, -0.012 + k * 0.01], [x + w, -0.03]], 1.4, fold, 0.5); ln([[x - w * 0.8, -0.0], [x, 0.022 + k * 0.012], [x + w * 0.7, 0.002]], 1.1, fold, 0.35); } softF([[0.04, -0.03], [0.18, -0.03], [0.17, 0.02], [0.05, 0.02]], shD, 0.25); };
  const rawPatch = (c, rx, ry) => { const e = T.lumpy(f, ell(c, rx, ry, 0.2, 12), Math.min(rx, ry) * 0.25); f.flat(hF(e), P.raw, { op: 0.85 }); f.flat(hF(e.map(q => lerp(q, c, 0.5))), P.rawD, { op: 0.3 }); f.line(hF(e.slice(0, 7)), 1.6, P.dead, { op: 0.95 }); f.line(hF(e.slice(0, 7).map(q => add(q, [0, -0.008]))), 0.8, INK, { op: 0.5 }); T.flakes(f, hF([add(c, [rx * 0.6, -ry * 0.6])])[0], H * 0.03, H * 0.02, 3, { s: H / 160 }); ln([add(c, [-rx * 0.3, -ry * 0.2]), add(c, [rx * 0.2, -ry * 0.4])], 1.2, P.wet, 0.6); };
  const flush = (c, rx, ry, op) => softF(T.lumpy(f, ell(c, rx, ry, 0.15, 12), 0.01), '#d8707a', op);
  const veins = (c, n) => { for (let i = 0; i < n; i++) { const q = add(c, [(f.r() - 0.5) * 0.06, (f.r() - 0.5) * 0.05]); ln([q, add(q, [0.015 + f.r() * 0.02, (f.r() - 0.5) * 0.02]), add(q, [0.03, (f.r() - 0.5) * 0.03])], 0.8, '#a02a3a', 0.6); } };
  const ear = (lobeDrop) => { if (!lobeDrop) return; const lb = hF([[-0.19, 0.17]])[0]; f.line([lb, add(lb, [0, H * 0.05])], 1.2, Q.silverD); pearls(f, [add(lb, [0, H * 0.075]), add(lb, [0, H * 0.076])], H * 0.022); };
  let F;
  if (kind === 'patriarch') {
    // the heavy lower face under the skull's outline: jowls and a double chin widening the head below the jaw
    f.part(hF([[-0.3, 0.12], [-0.06, 0.4], [0.14, 0.5], [0.33, 0.5], [0.4, 0.6], [0.34, 0.74], [0.14, 0.82], [-0.08, 0.78], [-0.26, 0.62], [-0.36, 0.36]]), SKh({ inkW: 2, inkHeavy: 3.2, maxShade: H * 0.1 }));
    f.stroke(hF([[-0.04, 0.62], [0.14, 0.7], [0.34, 0.64]]), H * 0.018, fold); f.line(hF([[0.0, 0.64], [0.16, 0.71]]), 1.4, '#fff4ee', { op: 0.4 });
    softF(ell([0.2, 0.66], 0.1, 0.04, 0, 12), '#fff4ee', 0.4);
    F = face(f, HC, H, hA, { skin, jaw: 1.4, chin: -0.04, nose: 1.2, hook: 0.1, mouth: 'set', squint: 0.5, browDown: 0.1, age: true, lips: false, iris: '#2a1a18', eyeWhite: '#eadcd2', hairCol: '#9a948a', browCol: '#a8a298', browW: 0.06 }, { lit: 0.3 });
    // the jowl sagging off the back cheek, the deep fold from the nose past the mouth
    f.part(hF([[-0.14, 0.26], [0.02, 0.32], [0.14, 0.44], [0.1, 0.58], [-0.08, 0.62], [-0.22, 0.46]]), SKh({ inkW: 1.3, inkHeavy: 0, shadow: '#b88088', maxShade: 8 }));
    ln([[0.28, 0.13], [0.22, 0.24], [0.17, 0.34], [0.15, 0.44]], 2.8, fold, 0.65);
    // the mouth open in complaint: the dark hole, a few yellowed teeth, the thick lower lip hanging, the tongue
    f.flat(hF([[0.16, 0.27], [0.24, 0.252], [0.32, 0.262], [0.345, 0.3], [0.31, 0.37], [0.22, 0.38], [0.165, 0.33]]), '#2a0a10');
    f.flat(hF([[0.2, 0.345], [0.28, 0.335], [0.3, 0.37], [0.22, 0.378]]), '#8a3a44', { op: 0.85 });
    for (const x of [0.2, 0.235, 0.27, 0.3]) f.flat(hF([[x, 0.262], [x + 0.03, 0.26], [x + 0.028, 0.285], [x + 0.004, 0.287]]), '#d8c8a0', { op: 0.9 });
    f.part(hF([[0.16, 0.36], [0.22, 0.385], [0.31, 0.378], [0.35, 0.33], [0.37, 0.37], [0.32, 0.42], [0.21, 0.43], [0.15, 0.4]]), SKh({ fill: lipC, inkW: 1.2, inkHeavy: 1.6, maxShade: 3, tex: null }));
    for (let i = 0; i < 4; i++) ln([[0.2 + i * 0.035, 0.39], [0.205 + i * 0.035, 0.42]], 1, INK, 0.6);
    f.part(hF([[0.15, 0.27], [0.24, 0.245], [0.33, 0.255], [0.35, 0.275], [0.24, 0.262], [0.16, 0.285]]), SKh({ fill: mix(lipC, skin, 0.4), inkW: 1.1, inkHeavy: 1.4, maxShade: 2, tex: null }));
    lids(0.6, 0.012); bags(1);
    // the brow knotted in complaint: furrows across, two vertical lines between the brows
    for (let i = 0; i < 3; i++) ln([[-0.04, -0.2 - i * 0.055], [0.08, -0.215 - i * 0.055 + (i % 2) * 0.01], [0.24, -0.205 - i * 0.055]], 1.7, fold, 0.6);
    ln([[0.21, -0.17], [0.205, -0.1]], 1.8, fold, 0.7); ln([[0.235, -0.165], [0.235, -0.11]], 1.4, fold, 0.55);
    veins([0.36, 0.08], 6); flush([0.38, 0.1], 0.05, 0.05, 0.45); flush([0.12, 0.14], 0.12, 0.07, 0.4);
    // the bald dome: lit, boiled shiny, peeling in patches, blistered, liver spots, sweat; the grey fringe behind the ear
    softF(ell([-0.06, -0.38], 0.16, 0.07, -0.2, 12), '#fffaf6', 0.55);
    T.sheen(f, hF([[-0.28, -0.32], [-0.1, -0.46], [0.1, -0.46], [0.2, -0.38]]), 3, 0.7);
    rawPatch([-0.16, -0.3], 0.07, 0.045); rawPatch([0.08, -0.4], 0.05, 0.03);
    for (const [x, y, r] of [[-0.02, -0.3, 0.022], [0.18, -0.32, 0.018], [-0.24, -0.16, 0.02]]) f.flat(hF(ell([x, y], r, r * 0.8, 0.3, 8)), '#9a6a50', { op: 0.5 });
    T.blisters(f, hF([[-0.08, -0.2]])[0], H * 0.08, H * 0.05, 4, 3, H * 0.03, { burst: 0.5 });
    f.part(hF([[-0.3, -0.14], [-0.4, -0.06], [-0.42, 0.1], [-0.36, 0.26], [-0.26, 0.3], [-0.26, 0.18], [-0.3, 0.04], [-0.26, -0.08]]), { fill: '#a49e94', shadow: '#3a3632', shade: 0.4, tex: 'hatch' + seed, texOp: 0.4, maxShade: 8, inkW: 1.2, inkHeavy: 1.6, cast: false });
    for (let i = 0; i < 5; i++) ln([[-0.3 - i * 0.02, -0.1 + i * 0.07], [-0.36 - i * 0.01, 0.0 + i * 0.07]], 1, '#e8e4dc', 0.6);
    T.beads(f, hF([[0.06, -0.22]])[0], H * 0.2, H * 0.08, 10, H / 100);
  } else if (kind === 'dowager') {
    // the collapsed coiffure: a tall wet mass slumped back and down onto the shoulder, behind the head
    const hc = mix(hair, '#000', 0.1);
    f.part(hF([[0.2, -0.44], [0.02, -0.64], [-0.3, -0.7], [-0.58, -0.5], [-0.74, -0.14], [-0.74, 0.3], [-0.64, 0.68], [-0.5, 0.9], [-0.36, 0.82], [-0.32, 0.46], [-0.34, 0.08], [-0.2, -0.28], [0.06, -0.38]]), { fill: hc, shadow: '#1a1210', shade: 0.42, tex: 'hatch' + seed, texOp: 0.4, maxShade: H * 0.12, inkW: 1.6, inkHeavy: 2.6 });
    for (let k = 0; k < 7; k++) ln([[0.1 - k * 0.08, -0.5 - (k % 2) * 0.06], [-0.3 - k * 0.05, -0.36 + k * 0.08], [-0.5 - k * 0.02, 0.1 + k * 0.08], [-0.48 - k * 0.01, 0.4 + k * 0.06]], 1.4, mix(hair, '#e8d8c0', 0.35), 0.6); // wet clumps
    for (let k = 0; k < 4; k++) f.stroke(hF([[-0.3 - k * 0.04, -0.2 + k * 0.12], [-0.42 - k * 0.05, 0.2 + k * 0.12], [-0.46 - k * 0.04, 0.5 + k * 0.1]]), H * 0.03, mix(hair, '#000', 0.4), { op: 0.6 }); // the dark between clumps
    F = face(f, HC, H, hA, { skin, jaw: 0.9, chin: 0.05, nose: 1.22, hook: 0.55, mouth: 'grim', squint: 0.36, browDown: -0.03, age: true, gaunt: true, lips: false, lashes: true, iris: '#2a1a18', eyeWhite: '#e8dcd2', hairCol: hair, browCol: mix(hair, '#000', 0.2), browW: 0.026, noEar: true }, { lit: 0.22, tint: '#8a4a5a' });
    // bone: the cheekbone's lit ridge, the hollow under it, the temple's hollow, the hard jaw line, cords under the jaw
    softF([[0.02, 0.02], [0.14, 0.03], [0.24, 0.07], [0.22, 0.1], [0.12, 0.08], [0.0, 0.07]], '#fff4ee', 0.55);
    softF([[-0.04, 0.12], [0.08, 0.16], [0.2, 0.2], [0.16, 0.28], [0.04, 0.28], [-0.08, 0.22]], '#6a3040', 0.4);
    softF([[-0.06, -0.3], [0.04, -0.24], [0.02, -0.12], [-0.1, -0.18]], '#6a3040', 0.3);
    ln([[-0.2, 0.26], [-0.06, 0.44], [0.1, 0.52], [0.24, 0.52]], 1.4, '#5a2a34', 0.5);
    // lines: crow's feet, nasolabial, marionette lines, purse lines over the lip
    for (let i = 0; i < 3; i++) ln([[0.0, -0.07 + i * 0.03], [-0.06, -0.08 + i * 0.045]], 1, fold, 0.55);
    ln([[0.3, 0.12], [0.25, 0.2], [0.2, 0.27]], 2, fold, 0.6); ln([[0.18, 0.31], [0.16, 0.38], [0.15, 0.45]], 1.6, fold, 0.55);
    // thin lips pursed, parted mid-sentence; purse lines; a blister on the lower lip
    f.flat(hF([[0.18, 0.278], [0.25, 0.27], [0.31, 0.276], [0.3, 0.292], [0.24, 0.296], [0.19, 0.29]]), '#3a1418');
    f.part(hF([[0.17, 0.275], [0.24, 0.262], [0.32, 0.27], [0.3, 0.276], [0.24, 0.272], [0.18, 0.281]]), SKh({ fill: lipC, inkW: 1, inkHeavy: 1.2, maxShade: 2, tex: null }));
    f.part(hF([[0.18, 0.293], [0.25, 0.298], [0.31, 0.29], [0.3, 0.31], [0.24, 0.318], [0.19, 0.308]]), SKh({ fill: mix(lipC, '#e8a0a0', 0.3), inkW: 1, inkHeavy: 1.2, maxShade: 2, tex: null }));
    for (let i = 0; i < 5; i++) ln([[0.19 + i * 0.026, 0.245], [0.2 + i * 0.026, 0.262]], 0.9, fold, 0.6);
    T.blister(f, hF([[0.27, 0.31]])[0], H * 0.018);
    lids(0.75, 0.01); bags(0.5);
    for (let i = 0; i < 2; i++) ln([[0.02, -0.21 - i * 0.05], [0.14, -0.23 - i * 0.05], [0.26, -0.22 - i * 0.05]], 1.2, fold, 0.45);
    flush([0.14, 0.1], 0.08, 0.05, 0.4); rawPatch([0.0, -0.3], 0.07, 0.04);
    peel(f, hF([[-0.08, 0.36]])[0], H * 0.1, H * 0.28, { sway: -2, col: '#f6ece6', bedCol: '#d07a72' });
    // the hair over the temple and the wet locks plastered across the brow, then the bone hairpins and a pearl drop
    f.part(hF([[0.22, -0.44], [0.02, -0.56], [-0.26, -0.5], [-0.38, -0.2], [-0.34, 0.16], [-0.24, 0.12], [-0.22, -0.16], [-0.04, -0.34], [0.14, -0.36]]), { fill: hc, shadow: '#1a1210', shade: 0.4, tex: 'hatch' + seed, texOp: 0.35, maxShade: 10, inkW: 1.4, inkHeavy: 2, cast: false });
    for (let k = 0; k < 4; k++) ln([[0.16 - k * 0.08, -0.42 + k * 0.01], [-0.12 - k * 0.04, -0.34 + k * 0.08], [-0.26 - k * 0.02, -0.06 + k * 0.08]], 1.2, mix(hair, '#e8d8c0', 0.35), 0.6);
    f.stroke(hF([[0.04, -0.4], [0.12, -0.3], [0.1, -0.2], [0.13, -0.14]]), H * 0.03, hc); // a lock plastered on the brow
    for (const [a, b, pearlHead] of [[[-0.4, -0.5], [-0.84, -0.82], true], [[-0.56, -0.24], [-0.98, -0.32], false], [[-0.2, -0.6], [-0.4, -1.02], false]]) { const pa = hF([a])[0], pb = hF([b])[0]; f.stroke([pa, pb], H * 0.03, INK); f.stroke([lerp(pa, pb, 0.02), lerp(pa, pb, 0.98)], H * 0.02, Q.bone || P.bone); f.line([lerp(pa, pb, 0.2), lerp(pa, pb, 0.9)], 0.9, '#fff', { op: 0.6 }); if (pearlHead) f.part(ell(pb, H * 0.03, H * 0.03, 0, 10), { fill: Q.pearl, shadow: Q.pearlD, shade: 0.35, inkW: 1, cast: false }); }
    ear(true);
  } else if (kind === 'heir') {
    f.part(hF([[-0.28, 0.14], [-0.04, 0.42], [0.14, 0.52], [0.3, 0.5], [0.35, 0.58], [0.27, 0.68], [0.08, 0.72], [-0.12, 0.64], [-0.3, 0.42]]), SKh({ inkW: 1.8, inkHeavy: 2.8 }));
    f.stroke(hF([[0.0, 0.58], [0.14, 0.64], [0.3, 0.6]]), H * 0.014, fold);
    F = face(f, HC, H, hA, { skin, jaw: 1.18, chin: -0.07, nose: 0.92, hook: -0.25, mouth: 'set', squint: 0.9, browDown: -0.04, lips: false, iris: '#2a1a18', eyeWhite: '#eadcd2', hairCol: hair, browCol: mix(hair, '#000', 0.1), browW: 0.032 }, { lit: 0.34 });
    // round soft cheeks pushed up under the closed eyes, the lips slack and parted, a drip at the corner
    softF(ell([0.1, 0.12], 0.14, 0.09, 0.1, 14), '#fff4ee', 0.35);
    ln([[0.28, 0.15], [0.24, 0.22], [0.22, 0.27]], 1.6, fold, 0.45);
    f.flat(hF([[0.18, 0.285], [0.26, 0.28], [0.31, 0.288], [0.29, 0.31], [0.21, 0.31]]), '#3a1418', { op: 0.85 });
    f.part(hF([[0.17, 0.282], [0.25, 0.27], [0.32, 0.282], [0.3, 0.288], [0.18, 0.29]]), SKh({ fill: lipC, inkW: 1, inkHeavy: 1.2, maxShade: 2, tex: null }));
    f.part(hF([[0.18, 0.305], [0.25, 0.31], [0.31, 0.3], [0.3, 0.33], [0.24, 0.345], [0.19, 0.33]]), SKh({ fill: mix(lipC, '#f0a8a8', 0.35), inkW: 1, inkHeavy: 1.2, maxShade: 2, tex: null }));
    T.drip(f, hF([[0.2, 0.34]])[0], H / 110);
    lids(0.0, 0.016); for (const [x, w] of [[0.11, 0.07], [0.29, 0.03]]) ln([[x - w, -0.03], [x, -0.016], [x + w, -0.03]], 1.2, fold, 0.4);
    flush([0.13, 0.12], 0.13, 0.08, 0.5); flush([0.36, 0.1], 0.04, 0.04, 0.5);
    rawPatch([0.37, 0.06], 0.03, 0.025); rawPatch([0.04, -0.3], 0.06, 0.035);
    peel(f, hF([[-0.02, 0.4]])[0], H * 0.1, H * 0.26, { sway: 2, col: '#f6ece6', bedCol: '#d07a72' });
    T.blisters(f, hF([[0.12, -0.2]])[0], H * 0.06, H * 0.03, 3, 3, H * 0.025, { burst: 0.3 });
    // wet curls plastered on the skull and the brow
    f.part(hF([[0.24, -0.4], [0.04, -0.56], [-0.26, -0.52], [-0.42, -0.3], [-0.42, 0.02], [-0.32, 0.12], [-0.3, -0.12], [-0.16, -0.3], [0.02, -0.34], [0.16, -0.3]]), { fill: hair, shadow: '#1a1210', shade: 0.4, tex: 'hatch' + seed, texOp: 0.35, maxShade: 10, inkW: 1.4, inkHeavy: 2, cast: false });
    for (let i = 0; i < 9; i++) { const c = [0.16 - i * 0.07, -0.44 + Math.abs(i - 4) * 0.02 + (i > 5 ? (i - 5) * 0.08 : 0)]; const cp = []; for (let k = 0; k <= 8; k++) { const a = k * 0.8, r = 0.035 * (1 - k / 11); cp.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } ln(cp, 1.6, mix(hair, '#e8d8c0', 0.3), 0.7); }
    f.stroke(hF([[0.16, -0.36], [0.22, -0.28], [0.2, -0.2]]), H * 0.03, hair); f.stroke(hF([[0.04, -0.36], [0.08, -0.26], [0.04, -0.18]]), H * 0.026, hair);
    T.beads(f, hF([[0.12, -0.16]])[0], H * 0.15, H * 0.06, 8, H / 120);
  } else { // 'matron' and 'snorer': placid, flushed, asleep
    const sn = kind === 'snorer';
    if (!sn) f.part(hF([[-0.28, 0.14], [-0.04, 0.42], [0.14, 0.5], [0.32, 0.5], [0.37, 0.6], [0.28, 0.7], [0.08, 0.74], [-0.14, 0.66], [-0.3, 0.42]]), SKh({ inkW: 1.8, inkHeavy: 2.8 }));
    if (!sn) f.part(hF([[0.2, -0.46], [-0.1, -0.6], [-0.44, -0.5], [-0.62, -0.18], [-0.6, 0.18], [-0.44, 0.3], [-0.32, 0.0], [-0.16, -0.3]]), { fill: hair, shadow: '#1a1210', shade: 0.42, tex: 'hatch' + seed, texOp: 0.4, maxShade: 12, inkW: 1.4, inkHeavy: 2.2 });
    F = face(f, HC, H, hA, { skin, jaw: sn ? 1.2 : 1.3, chin: -0.04, nose: sn ? 1.14 : 1.0, hook: sn ? 0.2 : -0.1, mouth: 'set', squint: 0.9, browDown: -0.03, age: true, lips: false, iris: '#2a1a18', eyeWhite: '#eadcd2', hairCol: hair, browCol: sn ? '#b8b2a8' : mix(hair, '#000', 0.1), browW: sn ? 0.05 : 0.03, noEar: !sn, beard: sn ? 'short' : null, beardCol: '#a8a298' }, { lit: 0.3 });
    lids(0.0, 0.014); bags(0.6);
    if (sn) { f.flat(hF([[0.2, 0.33], [0.27, 0.32], [0.3, 0.36], [0.26, 0.4], [0.21, 0.39]]), '#2a0a10'); f.flat(hF([[0.22, 0.37], [0.27, 0.37], [0.26, 0.39]]), '#8a3a44', { op: 0.8 }); }
    else { ln([[0.17, 0.29], [0.24, 0.296], [0.31, 0.284], [0.335, 0.266]], 2.6, '#6a3a40', 0.9); f.flat(hF([[0.19, 0.3], [0.3, 0.29], [0.29, 0.32], [0.21, 0.325]]), lipC, { op: 0.6 }); }
    ln([[0.27, 0.14], [0.22, 0.24], [0.2, 0.33]], 2.2, fold, 0.55);
    flush([0.13, 0.13], 0.13, 0.08, 0.5); veins([0.36, 0.1], sn ? 5 : 2);
    rawPatch([-0.02, -0.28], 0.06, 0.035);
    T.blisters(f, hF([[-0.12, 0.08]])[0], H * 0.05, H * 0.05, 3, 3, H * 0.03, { burst: 0.5 });
    peel(f, hF([[-0.14, 0.34]])[0], H * 0.1, H * 0.24, { sway: -2, col: '#f6ece6', bedCol: '#d07a72' });
    if (!sn) { f.part(hF([[0.22, -0.44], [0.0, -0.56], [-0.3, -0.5], [-0.38, -0.24], [-0.32, 0.08], [-0.24, -0.12], [-0.08, -0.32], [0.12, -0.36]]), { fill: hair, shadow: '#1a1210', shade: 0.4, tex: 'hatch' + seed, texOp: 0.35, maxShade: 10, inkW: 1.3, inkHeavy: 1.8, cast: false }); for (let k = 0; k < 4; k++) ln([[0.16 - k * 0.1, -0.44], [-0.1 - k * 0.06, -0.34 + k * 0.06], [-0.26 - k * 0.02, -0.06 + k * 0.08]], 1.2, mix(hair, '#e8d8c0', 0.35), 0.6); const bun = hF([[-0.58, -0.02]])[0]; f.part(T.lumpy(f, ell(bun, H * 0.16, H * 0.2, 0.4, 12), H * 0.02), { fill: hair, shadow: '#1a1210', shade: 0.42, tex: 'hatch' + seed, texOp: 0.4, maxShade: 10, inkW: 1.4 }); const hp = add(bun, [-H * 0.05, -H * 0.1]); f.stroke([hp, add(hp, [-H * 0.3, -H * 0.2])], H * 0.028, INK); f.stroke([hp, add(hp, [-H * 0.29, -H * 0.19])], H * 0.018, P.bone); }
    else { softF(ell([-0.06, -0.36], 0.15, 0.06, -0.2, 12), '#fffaf6', 0.45); f.part(hF([[-0.3, -0.12], [-0.4, 0.0], [-0.38, 0.22], [-0.26, 0.24], [-0.28, 0.0]]), { fill: '#a49e94', shadow: '#3a3632', shade: 0.4, tex: 'hatch' + seed, texOp: 0.4, maxShade: 6, inkW: 1.1, cast: false }); }
    T.beads(f, hF([[0.06, -0.2]])[0], H * 0.15, H * 0.06, 8, H / 120);
  }
  return hF;
}

// A noble's torso on a B.spine S (3/4 view, front on +u). kind 'fat' (a heavy man: breasts sagging over a fold, the belly
// in an upper roll and a hanging apron of fat, the navel deep in the fold), 'gaunt' (an old woman: collarbones standing
// out over hollows, the breastbone, ribs on the flank, slack small breasts, a little slack pouch of belly), 'soft' (a
// plump young man: soft chest, a round belly, one soft roll). The lobes are shaded parts over the base with only their
// lower contours inked, so the masses hang and press instead of being outlined eggs. Draws into the current bone.
function bfTorso(f, S, kind, look, o = {}) {
  const prof = { fat: [[-0.06, 0.46, 0.46], [0.06, 0.86, 0.66], [0.2, 0.98, 0.9], [0.38, 0.98, 1.06], [0.55, 0.94, 1.18], [0.72, 0.9, 1.26], [0.88, 0.88, 1.2], [1.0, 0.8, 0.96], [1.1, 0.6, 0.5]],
    gaunt: [[-0.06, 0.36, 0.36], [0.06, 0.72, 0.5], [0.18, 0.8, 0.62], [0.34, 0.74, 0.66], [0.5, 0.62, 0.58], [0.66, 0.58, 0.62], [0.82, 0.6, 0.7], [0.96, 0.6, 0.66], [1.08, 0.46, 0.4]],
    soft: [[-0.06, 0.44, 0.44], [0.06, 0.84, 0.62], [0.2, 0.94, 0.84], [0.38, 0.9, 0.96], [0.56, 0.84, 1.04], [0.74, 0.8, 1.1], [0.9, 0.8, 1.0], [1.02, 0.72, 0.78], [1.1, 0.5, 0.44]] }[kind];
  const at = S.at, H = S.H, fold = look.fold || '#7a3440', lt = mix(look.fill, '#fff', 0.4), dk = mix(look.fill, '#2a0c14', 0.5);
  const body = T.lumpy(f, S.shape(prof), H * 0.045);
  if (o.occ !== false) occlude(f, body, H * 0.12, 0.5);
  const out = f.part(body, Object.assign({}, look, { maxShade: o.maxShade ?? H * 0.3 }));
  const cid = f.id('bt'); f.defs.push(`<clipPath id="${cid}"><path d="${out}"/></clipPath>`);
  const lobe = (pts, x = {}) => { // a hanging mass: lit on its top, its own shadow cast on the flesh under its lower edge
    const c = pts.reduce((a, q) => add(a, mul(q, 1 / pts.length)), [0, 0]), bb = E.bbox(pts), hh = bb[3] - bb[1];
    f.raw(`<path d="${E.smooth(pts.map(q => add(q, [-6, hh * 0.22])))}" fill="#4a1622" opacity="0.32" filter="url(#steamblur${f.o.seed})"/>`);
    f.part(pts, Object.assign({}, look, { inkW: 0, inkHeavy: 0, cast: false, hatch: false, shade: 0.3, maxShade: hh * 0.18 }, x));
    f.raw(`<path d="${E.smooth(pts.map(q => lerp(q, add(c, [hh * 0.1, -hh * 0.22]), 0.55)))}" fill="#fff8f2" opacity="0.32" filter="url(#steamblur${f.o.seed})"/>`); };
  const crease = (pts, w) => { f.stroke(pts, w, fold); f.line(pts, Math.max(1.2, w * 0.28), INK, { op: 0.7 }); f.line(pts.map(q => add(q, [1.5, -3.5])), Math.max(1.2, w * 0.4), lt, { op: 0.5 }); };
  f.raw(`<g clip-path="url(#${cid})">`);
  // soft light down the front-top, warm shade down the back side (the planes turning)
  f.raw(`<path d="${E.smooth([at(0.2, 0.05), at(0.9, 0.15), at(1.0, 0.5), at(0.7, 0.6), at(0.3, 0.4)])}" fill="#fff6f0" opacity="0.18" filter="url(#steamblur2${f.o.seed})"/>`);
  f.raw(`<path d="${E.smooth([at(-0.9, 0.1), at(-0.5, 0.1), at(-0.5, 0.9), at(-1.0, 1.0)])}" fill="${dk}" opacity="0.4" filter="url(#steamblur2${f.o.seed})"/>`);
  f.raw(`<path d="${E.smooth([at(-0.2, 0.86), at(0.6, 0.98), at(1.4, 0.92), at(1.4, 1.2), at(-0.2, 1.2)])}" fill="${dk}" opacity="0.35" filter="url(#steamblur2${f.o.seed})"/>`); // the underside turning away
  if (kind === 'fat') {
    // breast sagging over its fold; the belly's upper roll; the apron of fat hanging over the groin, the navel in the fold
    const br = [at(0.25, 0.14), at(0.8, 0.14), at(1.16, 0.26), at(1.2, 0.4), at(1.04, 0.5), at(0.7, 0.52), at(0.36, 0.46), at(0.2, 0.32)];
    lobe(br); crease([at(0.3, 0.44), at(0.7, 0.53), at(1.04, 0.5), at(1.2, 0.42)], H * 0.035);
    f.flat(ell(at(0.92, 0.42), H * 0.05, H * 0.035, 0.3, 10), '#a0585e', { op: 0.6 }); f.flat(ell(at(0.93, 0.42), H * 0.02, H * 0.014, 0.3, 8), '#6a2a34', { op: 0.6 });
    const r1 = [at(0.3, 0.52), at(0.9, 0.54), at(1.34, 0.62), at(1.4, 0.72), at(1.2, 0.78), at(0.7, 0.76), at(0.3, 0.7)];
    lobe(r1); crease([at(0.3, 0.72), at(0.8, 0.78), at(1.2, 0.79), at(1.42, 0.72)], H * 0.04);
    const r2 = [at(0.2, 0.78), at(0.9, 0.8), at(1.36, 0.86), at(1.38, 1.0), at(1.1, 1.1), at(0.6, 1.1), at(0.2, 1.0)];
    lobe(r2); crease([at(0.2, 1.0), at(0.6, 1.1), at(1.1, 1.1), at(1.38, 1.0)], H * 0.04);
    f.flat(ell(at(1.06, 0.8), H * 0.05, H * 0.025, 0.2, 10), '#4a1a24', { op: 0.8 }); f.line([at(0.98, 0.79), at(1.06, 0.775), at(1.14, 0.79)], 1.6, lt, { op: 0.5 }); // the navel, deep in the fold
    crease([at(-0.7, 0.5), at(-0.4, 0.6), at(-0.1, 0.62)], H * 0.025); crease([at(-0.6, 0.8), at(-0.3, 0.86), at(0.1, 0.88)], H * 0.025); // flank folds
    for (let i = 0; i < 5; i++) f.line([at(1.0 + i * 0.05, 0.88), at(1.05 + i * 0.05, 0.98)], 1.2, '#f4e0e0', { op: 0.45 }); // stretch marks
    T.blisters(f, at(0.8, 0.77), H * 0.25, H * 0.04, 6, 3, H * 0.03, { burst: 0.5 }); T.blisters(f, at(0.7, 0.5), H * 0.2, H * 0.04, 4, 3, H * 0.03);
  } else if (kind === 'gaunt') {
    // collarbones over deep hollows, the notch, the breastbone, ribs on the flank, slack small breasts, the slack pouch
    for (const [a, b] of [[at(0.48, 0.05), at(0.0, 0.08)]]) { f.stroke([a, lerp(a, b, 0.5), b], H * 0.045, lt, { op: 0.8 }); f.line([add(a, [0, H * 0.03]), add(lerp(a, b, 0.5), [0, H * 0.04]), add(b, [0, H * 0.03])], 1.6, fold, { op: 0.7 }); f.flat(ell(add(lerp(a, b, 0.4), [0, -H * 0.04]), H * 0.14, H * 0.03, Math.atan2(b[1] - a[1], b[0] - a[0]), 10), dk, { op: 0.35 }); }
    f.flat(ell(at(0.5, 0.02), H * 0.04, H * 0.03, 0, 8), dk, { op: 0.5 });
    f.line([at(0.56, 0.08), at(0.6, 0.22), at(0.62, 0.36)], 1.6, fold, { op: 0.5 });
    for (let i = 0; i < 5; i++) { const v = 0.24 + i * 0.07; f.line([at(-0.4, v - 0.02), at(-0.1, v + 0.02), at(0.2, v + 0.05)], 1.4, fold, { op: 0.5 }); f.line([at(-0.36, v + 0.015), at(-0.1, v + 0.045)], 1.2, lt, { op: 0.4 }); }
    const br = [at(0.4, 0.2), at(0.68, 0.18), at(0.8, 0.3), at(0.82, 0.48), at(0.68, 0.56), at(0.48, 0.5), at(0.36, 0.36)];
    lobe(br); crease([at(0.38, 0.44), at(0.52, 0.53), at(0.7, 0.56), at(0.82, 0.48)], H * 0.03);
    f.flat(ell(at(0.72, 0.5), H * 0.035, H * 0.025, 0.4, 8), '#9a5a5e', { op: 0.55 });
    const pouch = [at(0.2, 0.76), at(0.7, 0.74), at(0.86, 0.86), at(0.8, 0.98), at(0.4, 1.02), at(0.16, 0.94)];
    lobe(pouch); crease([at(0.2, 0.96), at(0.5, 1.02), at(0.82, 0.96)], H * 0.025);
    T.wrinkles(f, at(0.3, 0.8), at(0.8, 0.92), H * 0.4, 7, { op: 0.45 });
    f.line([at(-0.58, 0.1), at(-0.62, 0.4), at(-0.56, 0.7)], 1.4, fold, { op: 0.4 }); // the spine's ridge turning away
  } else {
    const br = [at(0.3, 0.16), at(0.8, 0.16), at(1.0, 0.3), at(0.98, 0.44), at(0.7, 0.48), at(0.36, 0.42)];
    lobe(br); crease([at(0.36, 0.42), at(0.7, 0.49), at(0.98, 0.44)], H * 0.028);
    f.flat(ell(at(0.82, 0.38), H * 0.04, H * 0.03, 0.3, 10), '#b06a6e', { op: 0.55 });
    const bel = [at(0.3, 0.56), at(0.9, 0.56), at(1.14, 0.7), at(1.14, 0.9), at(0.9, 1.02), at(0.4, 1.0), at(0.2, 0.86)];
    lobe(bel); crease([at(0.3, 0.94), at(0.7, 1.02), at(1.1, 0.92)], H * 0.03);
    f.flat(ell(at(0.94, 0.8), H * 0.035, H * 0.022, 0.2, 8), '#5a2030', { op: 0.75 });
    f.line([at(0.2, 0.56), at(0.6, 0.6), at(1.0, 0.6)], 1.4, fold, { op: 0.45 });
    crease([at(-0.6, 0.66), at(-0.3, 0.72), at(0.0, 0.74)], H * 0.02);
  }
  f.raw('</g>');
  // armpit crease and the back's shoulder-blade edge
  crease([at(-0.2, 0.12), at(-0.06, 0.24), at(0.02, 0.36)], H * 0.022);
  f.line([at(-0.7, 0.06), at(-0.74, 0.22), at(-0.62, 0.38)], 1.6, fold, { op: 0.45 });
  T.scald(f, at(0.2, 0.5), H * 0.6, H * 0.6, 22, { pink: P.poachD });
  T.beads(f, at(0.3, 0.3), H * 0.5, H * 0.3, 14, H / 120);
  T.sheen(f, [at(0.6, 0.12), at(0.9, 0.2), at(1.1, 0.34)], 3, 0.5);
  return { body, out, prof };
}
// where two boiled bodies press together the flesh has run into one: a soft flush across the join, a raw seam where it
// split, blisters crowding the fold
function fuse(f, c, rx, ry, a = 0) {
  f.raw(`<path d="${E.smooth(ell(c, rx, ry, a, 14))}" fill="#d87880" opacity="0.4" filter="url(#steamblur2${f.o.seed})"/>`);
  const e = ell(c, rx * 0.55, ry * 0.3, a, 12).slice(1, 8);
  f.stroke(e, Math.max(3, ry * 0.12), '#7a2a34', { op: 0.75 }); f.line(e.map(q => add(q, [1, -3])), 1.4, '#f4dcd4', { op: 0.5 });
  T.blisters(f, c, rx * 0.5, ry * 0.4, 5, 3, Math.max(5, ry * 0.12), { burst: 0.5 });
}

// a wet linen bath sheet thrown over a shoulder: a heavy band along a centre line (line: from where it starts on the
// chest, over the shoulder, down the back and on down), its widths at each point (ws), clinging and translucent, folds
// running along it and bunching where it bends over the shoulder, a fringed torn end, the family badge embroidered on
// it (o.at: index along the line). o.badge 'heron' | 'tower' | 'fish', o.col badge thread. Draws into the current bone.
function bathSheet(f, line, ws, o = {}) {
  const out = K.chain(line, ws, { steps: 6 });
  const end = line[line.length - 1], d = E.norm(sub(end, line[line.length - 2])), nn = [-d[1], d[0]], we = ws[ws.length - 1];
  f.part(out, T.LIN(f, { fill: o.fill || '#e6e0d4', maxShade: 16, opacity: 0.93, texOp: 0.45 }));
  // folds along the band: dark valleys and lit ridges, bunched at the bend over the shoulder
  for (let j = -2; j <= 2; j++) { if (!j) continue; const pts = line.map((q, i) => { const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)], dd = E.norm(sub(b, a)); return add(q, mul([-dd[1], dd[0]], ws[i] * j * 0.2 + (f.r() - 0.5) * 4)); }); f.stroke(pts, j % 2 ? 4 : 3, '#7a7064', { op: 0.7 }); f.line(pts.map(q => add(q, [2, -3])), 1.6, '#fffaf2', { op: 0.55 }); }
  if (o.bend != null) { const q = line[o.bend]; for (let i = 0; i < 3; i++) f.stroke([add(q, [-ws[o.bend] * 0.4, -10 + i * 10]), add(q, [0, -4 + i * 12]), add(q, [ws[o.bend] * 0.4, -12 + i * 10])], 3, '#7a7064', { op: 0.6 }); }
  // the torn, fringed end
  for (let i = 0; i <= 6; i++) { const q = add(end, mul(nn, we * (i / 6 - 0.5) * 0.9)); f.line([q, add(q, add(mul(d, 12 + f.r() * 10), [(f.r() - 0.5) * 4, 4]))], 1.4, '#d8d0c2'); }
  clothWear(f, out, E.bbox(out), 4);
  // the badge
  const bc = line[o.at ?? Math.floor(line.length / 2)], col = o.col || '#6a3a4e';
  f.line(ell(bc, 16, 18, 0, 12).concat([ell(bc, 16, 18, 0, 12)[0]]), 2.2, col);
  if (o.badge === 'fish') for (let j = 0; j < 3; j++) f.line([add(bc, [-9, -7 + j * 7]), add(bc, [8, -7 + j * 7]), add(bc, [11, -4 + j * 7])], 1.8, col);
  else if (o.badge === 'tower') f.line([add(bc, [-7, 10]), add(bc, [-7, -7]), add(bc, [-2, -7]), add(bc, [-2, -11]), add(bc, [2, -11]), add(bc, [2, -7]), add(bc, [7, -7]), add(bc, [7, 10])], 2, col);
  else f.line([add(bc, [-8, 10]), add(bc, [-1, -2]), add(bc, [5, -11]), add(bc, [11, -10])], 2.2, col);
  return out;
}
// ambient occlusion: a soft dark halo just outside a body's outline, laid before the body is drawn, so it stands off
// what is behind it instead of merging into one pink field
function occlude(f, pts, grow = 18, op = 0.55) {
  const c = pts.reduce((a, q) => add(a, mul(q, 1 / pts.length)), [0, 0]);
  f.raw(`<path d="${E.smooth(pts.map(q => add(q, mul(E.norm(sub(q, c)), grow))))}" fill="#2a0e18" opacity="${op}" filter="url(#steamblur${f.o.seed})"/>`);
}

// an open flayed hand (the skin gone whole, hanging from the wrist as a glove): kit_III's handBack in wet raw red, then
// the extensor tendons standing pale and glossy from the wrist to each knuckle, pale knuckle caps, the muscle grain, dark
// nail beds where the nails came away with the glove, wet highlights. Same arguments as handBack.
function rawHand(f, c, a, s, o = {}) {
  const col = o.col || '#b8483a', hb = T.handBack(f, c, a, s, col, Object.assign({ shadow: '#4a1414', tex: 'pores' + f.o.seed, texOp: 0.6, nail: '#5a1418', vein: '#6a1a2a', lean: true }, o));
  const wr = hb.F([[-0.66, 0]])[0], d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]];
  hb.fingers.forEach((k, i) => { const w0 = add(wr, mul(n, (i - 1.5) * s * 0.12)); f.line([w0, lerp(w0, k, 0.5), k], Math.max(1.8, s * 0.026), '#d4988a', { op: 0.55 }); f.line([add(w0, mul(n, 2)), add(k, mul(n, 2))], 1, '#5a1a14', { op: 0.5 }); f.flat(ell(k, s * 0.07, s * 0.06, 0, 8), '#c87868', { op: 0.8 }); });
  hb.tips.forEach((t, i) => { const k = hb.fingers[i]; f.line([lerp(k, t, 0.1), lerp(k, t, 0.8)], Math.max(1.6, s * 0.03), '#c88878', { op: 0.45 }); });
  for (let i = 0; i < 8; i++) { const q = lerp(wr, hb.fingers[i % 4], 0.2 + (i / 8) * 0.6); f.line([q, add(q, mul(d, s * 0.12))], 0.9, '#4a0e0e', { op: 0.5 }); }
  T.sheen(f, [lerp(wr, hb.fingers[0], 0.3), lerp(wr, hb.fingers[1], 0.6), hb.fingers[2]], 3, 0.6);
  return hb;
}

module.exports = { rawHand, peel, occlude, bathSheet, bfTorso, fuse, bfHead, knuckleFist, gripK, fleshArm, paw, Q, textures, face, softAt, muscleArm, bentLeg, clothWear, fireHook, pearls, silverRing, skinGlove, roach, hoof, glassPart };
