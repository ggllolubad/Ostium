// World VII, The Icebound Fleet, second batch: local helpers on top of kit_VII (which is required, never edited).
// The batch is mostly crews (gunners, topmen, a capstan gang, a surgeon, a sailmaker, a marine, a cook, a powder monkey),
// so the main helper is sailor(): one drowned seaman of the fleet built from joints at any scale and any orientation
// (upright, leaning level on a capstan bar, hanging head-down in the rigging), in the world's dress and course marks.
// Frost dominant: rime on the windward (+x in drawing space) and upper faces, icicles hung plumb in screen space, bodies
// and cloth stopped mid-motion. Water under it: pale, swollen, wrinkled skin, lividity, blue-black lips and nails.
'use strict';
const K = require('../kit');
const X7 = require('./kit_VII');
const { E, B, INK, bareLeg, ragLimb } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { PAL, spline, clipDraw, jointLimb, jcut, creases, fistDetail, openHand, tube, split, side } = X7;
const T3 = require('./kit_III'); // (ruler upgrade pass) mchain, the reviewed one-outline limb builder
const T3b = require('./kit_III_b'); // (ruler upgrade pass) knuckleFist / gripK, the reviewed modelled fist
const deg = d => d * Math.PI / 180;
const WORLD = { shadowTint: '#262a3a', mud: '#3a4652', keyTint: '#f4f8ff' };
const angOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);

// skin of the drowned under ice: grey-white, a violet-grey shadow (never the steel blue of metal)
const SKIN = { skin: '#bec6cb', skinS: '#5e6276', bite: PAL.bite, biteD: PAL.biteD, nail: '#3c3e52' };

// a free bare foot in any orientation (hanging in rigging, lifted mid-run): heel, Achilles, ankle knob, arch, ball,
// big toe with its nail, the small toes as pads. ang: the direction the toes point; s: foot length in px.
// o.under: +1 draws the sole on the local +y side (default: sole on +y, i.e. a right-facing foot seen from the near side).
function freeFoot(f, ankle, ang, s, look, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(ankle, ang, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg, p[2] || 0]));
  const sw = o.swell ?? 0.15;
  const P = F([[-0.18, -0.2], [0.12, -0.24], [0.42, -0.16 - sw * 0.04], [0.72, -0.08], [0.98, -0.02], [1.12, 0.04], [1.16, 0.12], [1.08, 0.2], [0.86, 0.22], [0.6, 0.2], [0.34, 0.24], [0.06, 0.3], [-0.2, 0.34], [-0.34, 0.24], [-0.36, 0.06], [-0.26, -0.12]]);
  for (let i = 3; i >= 1; i--) f.part(F(ell([0.98 - i * 0.07, 0.17], 0.06, 0.05, 0, 8)), Object.assign({}, look, { inkW: 1, inkHeavy: 1.2, cast: false, shade: 0.45, fill: mix(look.fill, '#2a2030', 0.12 + i * 0.04) }));
  f.part(P, Object.assign({ k: 0.9 }, look));
  const dk = mix(look.fill, '#2a1c22', 0.5), lt = mix(look.fill, '#fff', 0.35);
  f.part(F(ell([0.02, 0.06], 0.1, 0.08, 0, 10)), Object.assign({}, look, { inkW: 0, cast: false, shade: 0.5, fill: mix(look.fill, '#fff', 0.08) })); // ankle knob
  f.line(F([[-0.26, -0.1], [-0.3, 0.2]]), 1, dk, { op: 0.6 }); // Achilles
  f.line(F([[0.2, -0.16], [0.5, -0.1], [0.86, -0.02]]), 1, lt, { op: 0.55 }); // instep tendon
  f.part(F([[0.9, -0.04], [1.06, 0.0], [1.15, 0.08], [1.12, 0.16], [1.0, 0.16], [0.9, 0.1]]), Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.4, cast: false, shade: 0.35 }));
  f.flat(F([[1.04, -0.0], [1.12, 0.05], [1.12, 0.1], [1.04, 0.06]]), o.nail || mix(look.fill, '#d8dce0', 0.4), { op: 0.9 });
  for (let i = 0; i < 3; i++) f.line(F([[0.3 + i * 0.14, 0.2], [0.34 + i * 0.14, 0.1]]), 0.9, INK, { op: 0.4 }); // water-puckered sole
  return F;
}

// ---- (consistency pass 2026-11-25: now the default for every sailor; o.model: false restores the old tubes)
// ---- (ruler upgrade pass) modelled limbs for sailor()'s o.model (the rulers' men only; every other figure keeps the
// reviewed tubes). After kit_X_b's mArm: one outline through kit_III's mchain with muscle profiles: deltoid and triceps
// behind, biceps in front, the forearm's muscle mass swelling just below the elbow and tapering hard to a narrow wrist.
// ws = [shoulder, elbow, wrist] widths; build > 1 a heavier man. u(t, k) / fa(t, k): points on the upper arm / forearm,
// k across the limb toward the inside of the elbow's bend.
const scP = (arr, w) => arr.map(([t, k]) => [t, k * w]);
function armProfile(S0, E0, W0, ws, build = 1) {
  const [wS, wE, wW] = ws, dU = E.norm(sub(E0, S0)), dF = E.norm(sub(W0, E0)), nU = [-dU[1], dU[0]], nF = [-dF[1], dF[0]];
  const inU = (dF[0] * nU[0] + dF[1] * nU[1]) >= 0 ? 1 : -1, inF = -(dU[0] * nF[0] + dU[1] * nF[1]) >= 0 ? 1 : -1;
  const bic = scP([[0, 0.48], [0.3, 0.5], [0.58, 0.56 * build], [0.84, 0.46], [1, 0.42]], wS), tri = scP([[0, 0.54], [0.14, 0.6], [0.4, 0.56 * build], [0.72, 0.46], [1, 0.42]], wS);
  const flx = scP([[0, 0.46], [0.22, 0.56 * build], [0.5, 0.45], [0.8, 0.3], [1, wW / wE * 0.5]], wE), ext = scP([[0, 0.5], [0.18, 0.63 * build], [0.42, 0.5], [0.74, 0.33], [1, wW / wE * 0.5]], wE);
  const pts = T3.mchain([S0, E0, W0], [inU > 0 ? [bic, tri] : [tri, bic], inF > 0 ? [flx, ext] : [ext, flx]], { knob: [1.14] });
  return { pts, inU, inF, u: (t, k) => lp(S0, E0, t, k * wS * inU), fa: (t, k) => lp(E0, W0, t, k * wE * inF) };
}
// a bare lower shin from the trouser hem M to the ankle A: the calf swelling behind (away from the toes) and running
// into the Achilles, the shin bone straight in front, the ankle knobs; at(t, k): k > 0 toward the front (the shin).
function shinProfile(M, A, toeAng, wT) {
  const d = E.norm(sub(A, M)), n = [-d[1], d[0]], fr = (n[0] * Math.cos(toeAng) + n[1] * Math.sin(toeAng)) >= 0 ? 1 : -1;
  const calf = scP([[0, 0.62], [0.2, 0.6], [0.48, 0.44], [0.76, 0.3], [0.92, 0.31], [1, 0.34]], wT), shin = scP([[0, 0.42], [0.36, 0.4], [0.74, 0.32], [0.9, 0.37], [1, 0.34]], wT);
  const pts = T3.mchain([M, A], [fr > 0 ? [shin, calf] : [calf, shin]], {});
  return { pts, fr, at: (t, k) => lp(M, A, t, k * wT * fr) };
}
// the shin drawn with its anatomy: the tibia's lit edge, the calf's lower border, the Achilles, the ankle knob, veins
function mShin(f, M, A, toeAng, wT, look, o = {}) {
  const sp = shinProfile(M, A, toeAng, wT), at = sp.at, dk = mix(look.shadow || look.fill, '#000', 0.3), lt = mix(look.fill, '#fff', 0.45);
  f.part(sp.pts, Object.assign({ k: 0.9 }, look));
  f.line([at(0.08, 0.26), at(0.5, 0.22), at(0.84, 0.16)], Math.max(1.4, wT * 0.05), lt, { op: 0.55 }); // the shin bone's lit edge
  f.line([at(0.1, -0.2), at(0.36, -0.26), at(0.6, -0.12)], Math.max(1.2, wT * 0.035), dk, { op: 0.55 }); // the calf's lower border
  f.line([at(0.62, -0.18), at(0.9, -0.2)], Math.max(1.2, wT * 0.03), dk, { op: 0.5 }); // the Achilles
  f.flat(ell(at(0.93, 0.06), wT * 0.1, wT * 0.08, 0, 8), lt, { op: 0.5 }); f.line([at(0.86, 0.12), at(0.92, 0.18), at(0.99, 0.12)], 1.1, dk, { op: 0.5 }); // the ankle knob
  if (o.veins !== false) f.line([at(0.2, 0.05), at(0.4, -0.02), at(0.6, 0.06), at(0.8, 0.0)], Math.max(1, wT * 0.025), '#5a5e7a', { op: 0.45 });
  return sp;
}

// stripes or checks clipped inside a cloth shape. S: a B.spine for a torso (bands run across the spine), or a limb [a, b]
// (bands run across the limb). kind: 'stripe' | 'check'.
function shirtPattern(f, shape, kind, col, o = {}) {
  clipDraw(f, shape, () => {
    const bb = E.bbox(shape), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], R = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2 + 10;
    const a = o.ang ?? 0, gap = o.gap ?? 14, w = o.w ?? 5;
    for (let k = -Math.ceil(R / gap); k <= Math.ceil(R / gap); k++) {
      const q = add(c, rot([0, k * gap], a)), pts = [];
      for (let i = -6; i <= 6; i++) pts.push(add(add(q, rot([i * R / 6, 0], a)), rot([0, Math.sin(i * 0.9 + k) * (o.wave ?? 2)], a)));
      f.line(pts, w, col, { op: o.op ?? 0.7 });
      if (kind === 'check') { const q2 = add(c, rot([k * gap, 0], a)), p2 = []; for (let i = -6; i <= 6; i++) p2.push(add(add(q2, rot([0, i * R / 6], a)), rot([Math.sin(i * 0.8 + k) * 2, 0], a))); f.line(p2, w * 0.8, col, { op: (o.op ?? 0.7) * 0.75 }); }
    }
  });
}

// a copy of body.js head() that takes its frame function, so a head can be drawn mirrored (facing -x)
function headF(fig, F, H, p = {}) {
  const skin = p.skin || '#c9a07e', jaw = p.jaw ?? 1, chin = p.chin ?? 0, ink = fig.o.ink;
  const sock = mix(skin, '#2a1712', 0.6);
  // back hair / hood back
  if (p.hairBack) fig.part(F(p.hairBack), { fill: p.hairCol || '#2b2018', hatch: true });
  // face base
  const face = [[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355 + (p.browOut || 0), -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32 + chin * 0.5, 0.37], [0.29 + chin, 0.47], [0.13 + chin * 0.5, 0.535 + chin * 0.2], [-0.06 - 0.08 * (jaw - 1), 0.47 + 0.04 * (jaw - 1)], [-0.21 - 0.1 * (jaw - 1), 0.27], [-0.30, 0.08], [-0.37, -0.13]];
  fig.part(F(face), { fill: skin, shade: 0.42, maxShade: H * (fig.o.mode === 'block' ? 0.24 : 0.4) * (p.faceShade ?? 1), tex: 'mottle' + fig.o.seed, texOp: 0.35, hatch: p.faceHatch });
  // under-jaw plane and jaw hinge shadow: gives the skull a floor so it does not read as a cut-out
  fig.flat(F([[-0.24, 0.22], [-0.05, 0.42], [0.14, 0.5], [0.26, 0.47], [0.1, 0.535], [-0.06, 0.48], [-0.21, 0.3]]), sock, { op: p.jawShade ?? 0.45 });
  // ear: narrow, behind the jaw hinge, a third of the head tall, with a helix and a shadowed bowl
  if (!p.noEar) {
    const ec = [-0.2, 0.04];
    fig.part(F([[ec[0] + 0.03, ec[1] - 0.12], [ec[0] - 0.04, ec[1] - 0.1], [ec[0] - 0.07, ec[1] - 0.02], [ec[0] - 0.05, ec[1] + 0.08], [ec[0] + 0.0, ec[1] + 0.14], [ec[0] + 0.05, ec[1] + 0.12], [ec[0] + 0.04, ec[1] + 0.02]]), { fill: mix(skin, '#9a4c3a', 0.18), shade: 0.5, inkW: 1, inkHeavy: 1.6, cast: false });
    fig.line(F([[ec[0] + 0.02, ec[1] - 0.07], [ec[0] - 0.03, ec[1] - 0.04], [ec[0] - 0.02, ec[1] + 0.04], [ec[0] + 0.02, ec[1] + 0.06]]), 1, mix(skin, '#000', 0.55), { op: 0.8 });
  }
  // cheekbone + temple planes (soft dark)
  fig.flat(F([[0.05, 0.02], [0.2, 0.06], [0.24, 0.2], [0.12, 0.26], [0.02, 0.15]]), sock, { op: 0.18 });
  fig.flat(F([[0.0, -0.3], [0.12, -0.22], [0.08, -0.12], [-0.04, -0.17]]), sock, { op: 0.12 });
  // eye sockets
  const sq = p.squint ?? 0.3;
  fig.flat(F(ell([0.11, -0.06], 0.105, 0.065, 0.05, 12)), sock, { op: 0.75 });
  fig.flat(F(ell([0.295, -0.065], 0.05, 0.055, 0, 10)), sock, { op: 0.7 });
  if (!p.blind) {
    const eh = 0.034 * (1 - sq);
    fig.flat(F([[0.06, -0.055], [0.11, -0.055 - eh], [0.165, -0.06], [0.11, -0.05 + eh * 0.6]]), p.eyeWhite || '#d9cdb4');
    fig.flat(F(ell([0.135, -0.056], 0.016, 0.017, 0, 8)), p.iris || '#1a120c');
    fig.flat(F([[0.272, -0.06], [0.295, -0.07 - eh * 0.6], [0.31, -0.063], [0.29, -0.055]]), p.eyeWhite || '#d9cdb4');
    if (p.glint) fig.flat(F(ell([0.13, -0.062], 0.006, 0.006, 0, 6)), '#fff');
    fig.line(F([[0.055, -0.058], [0.11, -0.065 - eh], [0.17, -0.062]]), 1.6, ink);
  }
  // brows
  const bd = p.browDown ?? 0.02;
  fig.stroke(F([[0.0, -0.13], [0.09, -0.15], [0.19, -0.13 + bd]]), H * (p.browW || 0.045), p.browCol || mix(p.hairCol || '#2b2018', '#000', 0.2));
  fig.stroke(F([[0.255, -0.135 + bd], [0.3, -0.15], [0.345, -0.14]]), H * (p.browW || 0.045) * 0.75, p.browCol || mix(p.hairCol || '#2b2018', '#000', 0.2));
  // nose
  const nz = p.nose ?? 1, hook = p.hook ?? 0;
  // nose: bridge, rounded bulb, nostril wing. no sharp triangle tip
  const tipX = 0.395 * nz + 0.02 * (1 - nz);
  const nose = [[0.30, -0.07], [0.335 + hook * 0.05, -0.01], [tipX - 0.02, 0.09], [tipX + 0.005, 0.12], [tipX - 0.01, 0.155], [0.35, 0.168], [0.31, 0.163], [0.27, 0.15], [0.255, 0.12], [0.27, 0.09], [0.29, 0.02]];
  fig.part(F(nose), { fill: mix(skin, '#a3553f', 0.18), shade: 0.5, inkW: 1.3, inkHeavy: 2.2, cast: false });
  fig.line(F([[0.262, 0.1], [0.248, 0.13], [0.27, 0.155]]), 1.2, ink, { op: 0.8 }); // nostril wing
  fig.line(F([[0.30, 0.15], [0.325, 0.158], [0.345, 0.152]]), 1.4, ink);
  // under-brow shadow across the eye line
  fig.flat(F([[0.0, -0.12], [0.2, -0.115], [0.3, -0.1], [0.34, -0.07], [0.2, -0.085], [0.04, -0.09]]), sock, { op: 0.45 });
  // mouth
  const mo = p.mouth || 'grim';
  const ml = { grim: [[0.17, 0.285], [0.24, 0.272], [0.31, 0.283]], smirk: [[0.17, 0.27], [0.24, 0.275], [0.31, 0.262], [0.325, 0.245]], snarl: [[0.17, 0.29], [0.24, 0.27], [0.32, 0.28]], set: [[0.17, 0.28], [0.31, 0.275]] }[mo] || [[0.17, 0.28], [0.31, 0.275]];
  if (p.lips) { fig.flat(F([[0.18, 0.29], [0.24, 0.282], [0.31, 0.288], [0.29, 0.318], [0.22, 0.322]]), mix(skin, '#8a3a2e', 0.45), { op: 0.8 }); fig.line(F([[0.21, 0.3], [0.27, 0.298]]), 0.9, mix(skin, '#fff', 0.4), { op: 0.6 }); }
  if (p.lashes) fig.line(F([[0.06, -0.06], [0.11, -0.072], [0.17, -0.066], [0.185, -0.075]]), 2.2, ink);
  if (mo === 'snarl') fig.flat(F([[0.18, 0.28], [0.25, 0.262], [0.31, 0.27], [0.29, 0.3], [0.22, 0.305]]), '#2a0d0a');
  fig.stroke(F(ml), H * 0.022, ink);
  fig.flat(F([[0.19, 0.3], [0.27, 0.297], [0.29, 0.33], [0.21, 0.335]]), mix(skin, '#6a2a22', 0.3), { op: 0.6 });
  // age and character lines
  fig.line(F([[0.265, 0.12], [0.22, 0.2], [0.19, 0.27]]), 1.2, ink, { op: 0.8 });
  if (p.age) {
    fig.line(F([[0.03, -0.2], [0.18, -0.22]]), 1, ink, { op: 0.5 });
    fig.line(F([[0.04, -0.245], [0.16, -0.26]]), 0.9, ink, { op: 0.45 });
    fig.line(F([[0.0, -0.02], [-0.03, 0.03]]), 1, ink, { op: 0.6 });
    fig.line(F([[0.01, 0.0], [-0.02, 0.06]]), 0.9, ink, { op: 0.5 });
    fig.line(F([[0.07, 0.0], [0.13, 0.02]]), 1, ink, { op: 0.6 });
  }
  if (p.gaunt) { fig.flat(F([[0.06, 0.1], [0.2, 0.17], [0.2, 0.3], [0.08, 0.32], [0.0, 0.2]]), sock, { op: 0.35 }); fig.line(F([[0.04, 0.1], [0.1, 0.25]]), 1, ink, { op: 0.6 }); }
  if (p.scar) {
    // raised pale welt with old stitch ticks, not a drawn line
    fig.line(F(p.scar), 2.6, mix(skin, '#ead2be', 0.45), { op: 0.85 });
    fig.line(F(p.scar), 0.9, mix(skin, '#5a2219', 0.6));
    for (let i = 1; i < 4; i++) { const t = i / 4, n = p.scar.length - 1, k = Math.min(n - 1, Math.floor(t * n)), u = t * n - k, q = E.lerp(p.scar[k], p.scar[k + 1], u); fig.line(F([[q[0] - 0.02, q[1] + 0.02], [q[0] + 0.02, q[1] - 0.02]]), 0.9, mix(skin, '#3a1a12', 0.6), { op: 0.8 }); }
  }
  // stubble / beard
  if (p.beard) {
    const bc = p.beardCol || p.hairCol || '#2b2018';
    if (p.beard === 'stubble') fig.flat(F([[0.0, 0.18], [0.16, 0.22], [0.3, 0.33], [0.3, 0.47], [0.13, 0.53], [-0.06, 0.46], [-0.18, 0.28]]), bc, { op: 0.35 });
    if (p.beard === 'short' || p.beard === 'full') {
      const fl = p.beard === 'full' ? 0.12 : 0;
      fig.part(F([[-0.17, 0.2], [0.0, 0.25], [0.16, 0.31], [0.21, 0.32], [0.33, 0.34], [0.34 + chin, 0.48 + fl], [0.2, 0.6 + fl * 1.5], [0.02, 0.56 + fl], [-0.12, 0.42], [-0.2, 0.3]]), { fill: bc, shade: 0.4, tex: 'hatch' + fig.o.seed, texOp: 0.3 });
    }
    if (p.moustache || p.beard === 'short' || p.beard === 'full') fig.part(F([[0.17, 0.23], [0.25, 0.205], [0.33, 0.215], [0.35, 0.25], [0.31, 0.26], [0.24, 0.255], [0.17, 0.285], [0.14, 0.27]]), { fill: mix(p.beardCol || p.hairCol || '#2b2018', '#000', 0.1), shade: 0.4, inkW: 1 });
  }
  if (p.hair) fig.part(F(p.hair), { fill: p.hairCol || '#2b2018', shade: 0.4, tex: 'hatch' + fig.o.seed, texOp: 0.25 });
  if (p.hairLines) for (const l of p.hairLines) fig.line(F(l), 1, mix(p.hairCol || '#2b2018', '#d8c4a0', 0.35), { op: 0.7 });
  return F;
}

// ---- one drowned sailor of the fleet.
// o.s scale (1 = a 1.0 human), o.pre bone prefix ('' = the standard humanoid names), o.parent the bone the pelvis hangs from.
// o.J joints {N, C, P, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF}; any limb set to null is skipped (waist-up
// gunners have no legs). o.hA head angle (radians, 0 = level facing +x; pi + x for a head-down man).
// Dress: o.shirt 'stripe'|'check'|'plain' with o.shirtCol, o.jacket {col, colD, colL} or null, o.trouser {col, len:
// 'shin'|'knee'|'full'|'cut'}, o.cap 'knit'|'kerchief'|'ears'|'none', o.queue (tarred pigtail, hung plumb).
// Hands: o.handN / o.handF = {grip: {c, thumbAng, inline, maxBend}} | {open: {ang, ...openHand opts}} | {fn(f)} | null.
// Hooks: o.afterTorso(S), o.afterHead(hF), o.beforeFar(), o.face (B.head overrides), o.mouth 'open'|'shut', o.belly.
// Draw order: far arm, far leg, near leg, torso (+ belly), head, near arm. Returns {S, hF, HC, gN, gF}.
// o.persona (independent review): one man's own identity, so men from this one builder never read as clones. Fields:
// face {B.head overrides: jaw, chin, nose, hook, squint, browDown, browW, hairCol, browCol, beard, beardCol, moustache,
// age, gaunt, scar, mouth}, build {chestW, belly, armW, thighW, headS} (multipliers / adds), dress {cap, capCol, shirt,
// shirtCol, sleeve, jacket {col, colD, colL, open, patch, buttons}, neck (a neckcloth colour), queue, earring},
// hair 'crop' | 'tufts' | 'long' | 'swept' | 'bald', frost [ 'beard' | 'mask' | 'nose' | 'brows' | 'mouthIce' | 'breath' ].
function applyPersona(o) {
  const P = o.persona; if (!P) return o;
  const q = Object.assign({}, o);
  q.chestW = (o.chestW || 1) * (P.chestW || 1); q.belly = (o.belly ?? 0.08) + (P.belly || 0); q.armW = (o.armW || 1) * (P.armW || 1);
  q.thighW = (o.thighW || 66) * (P.thighW || 1); q.headS = (o.headS || 1) * (P.headS || 1); q.handS = (o.handS || 1.06) * (P.handS || 1);
  q.face = Object.assign({}, o.face || {}, P.face || {});
  for (const k of ['cap', 'capCol', 'shirt', 'shirtCol', 'sleeve', 'queue', 'mouth', 'iceLen']) if (P[k] !== undefined) q[k] = P[k];
  if (P.jacket === null) q.jacket = null; else if (P.jacket && o.jacket) q.jacket = Object.assign({}, o.jacket, P.jacket);
  return q;
}
function sailor(f, X, o) {
  o = applyPersona(o);
  const PS = o.persona || {};
  const s = o.s || 1, H = 100 * s, W = v => v * s, pre = o.pre || '', J = o.J, nm = n => pre + n;
  const skin = o.skin || SKIN.skin, skinS = o.skinS || SKIN.skinS, seed = f.o.seed;
  const SK = (x = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.3, tex: 'mottle' + seed, texOp: 0.5, maxShade: W(30) }, x);
  const shirtCol = o.shirtCol || '#b4bbbf', shirtS = '#4e5868';
  const SH = (x = {}) => Object.assign({ fill: shirtCol, shadow: shirtS, tex: 'weave' + seed, texOp: 0.4, light: mix(shirtCol, '#fff', 0.3), maxShade: W(36) }, x);
  const jk = o.jacket, JK = (x = {}) => Object.assign({ fill: jk.col, shadow: '#14171f', tex: 'mottle' + seed, texOp: 0.5, light: jk.colL || mix(jk.col, '#fff', 0.2), maxShade: W(40) }, x);
  const tr = o.trouser || { col: '#8c9296', len: 'shin' }, TR = (x = {}) => Object.assign({ fill: tr.col, shadow: tr.colS || '#3c444e', tex: tr.tar ? 'mottle' + seed : X.hoar, texOp: 0.4, light: mix(tr.col, '#fff', 0.25), maxShade: W(36) }, x);
  const S0 = B.spine(J.N, J.C, J.P, H), up = E.norm(sub(J.N, J.C));
  // o.mirror: the man faces -x (a mirror, not a rotation): the spine's facing side and the head frame are mirrored
  const S = o.mirror ? Object.assign({}, S0, { at: (u, v) => S0.at(-u, v), F: v => mul(S0.F(v), -1), shape: prof => { const fr = prof.map(([v, , fw]) => S0.at(-fw, v)); const bk = prof.map(([v, b]) => S0.at(b, v)).reverse(); return [...fr, ...bk]; } }) : S0;
  const hS = o.headS || 1, hA = o.hA ?? 0, HC = o.HC || add(J.N, mul(up, W(62) * hS));
  const hF0 = frame(HC, o.mirror ? -hA : hA, H * hS);
  let hF = o.mirror ? pts => hF0(pts.map(q => [-q[0], q[1], q[2] || 0])) : hF0;
  const facing = S.F(0.5)[0] >= 0 ? 1 : -1; // +1 when the body faces +x
  const ro = o.mirror ? 1 : -1; // rime 'out' sign for polylines laid back-to-front (mirrored men run them the other way)
  // joints
  f.joint(nm('pelvis'), J.P, o.parent ?? null).joint(nm('torso'), S.at(0, 0.8), nm('pelvis')).joint(nm('head'), S.at(0.05, -0.02), nm('torso'));
  if (J.SN) f.joint(nm('upperarm_n'), J.SN, nm('torso')).joint(nm('forearm_n'), J.EN, nm('upperarm_n')).joint(nm('hand_n'), J.WN, nm('forearm_n'));
  if (J.SF) f.joint(nm('upperarm_f'), J.SF, nm('torso')).joint(nm('forearm_f'), J.EF, nm('upperarm_f')).joint(nm('hand_f'), J.WF, nm('forearm_f'));
  if (J.HN) f.joint(nm('thigh_n'), J.HN, nm('pelvis')).joint(nm('shin_n'), J.KN, nm('thigh_n')).joint(nm('foot_n'), J.AN, nm('shin_n'));
  if (J.HF) f.joint(nm('thigh_f'), J.HF, nm('pelvis')).joint(nm('shin_f'), J.KF, nm('thigh_f')).joint(nm('foot_f'), J.AF, nm('shin_f'));
  const res = { S, hF, HC, H, s, facing };

  // ---- an arm: sleeve (full, rolled or cut), skin forearm where rolled, rime on the windward top, icicles under the elbow
  const arm = (Sx, Ex, Wx, side_, hand, dark) => {
    const bU = nm('upperarm_' + side_), bF = nm('forearm_' + side_), bH = nm('hand_' + side_);
    const sl = o.sleeve || 'full', cloth = jk ? JK(dark ? { fill: jk.colD || mix(jk.col, '#000', 0.25) } : {}) : SH(dark ? { fill: mix(shirtCol, '#4a5260', 0.3) } : {});
    const [cU, cF] = jcut(Sx, Ex, Wx, W(19));
    const wsA = [W(48), W(40), W(32)].map(v => v * (o.armW || 1));
    const mdl = o.model !== false, bld = o.build || 1; // consistency pass: modelled limbs for every sailor
    split(f, () => {
      const endT = sl === 'full' ? 0.86 : sl === 'rolled' ? 0.25 : 0.0;
      const skA = SK(dark ? { fill: mix(skin, '#6a6e80', 0.18) } : {});
      if (sl !== 'full' && !mdl) f.part(jointLimb(Sx, Ex, lerp(Ex, Wx, 0.9), wsA.map(v => v * 0.9), { point: 0.35, mus0: 0.12, mus1: 0.2 }), skA);
      if (sl !== 'full' && mdl) {
        // (ruler upgrade pass) the bare arm as one modelled outline: the forearm's muscle swell under the elbow, the hard
        // taper to a narrow wrist, the groove between the muscle groups, the lit swell, tendons and the wrist bone
        const AP = armProfile(Sx, Ex, Wx, [wsA[0] * 0.96, wsA[1] * 1.08, wsA[2] * 0.74], bld), fa = AP.fa, dkA = mix(skinS, '#000', 0.2), ltA = mix(skin, '#fff', 0.45);
        f.part(AP.pts, Object.assign({ k: 0.9 }, skA));
        f.stroke([fa(0.06, -0.3), fa(0.3, -0.06), fa(0.66, 0.02)], W(3.2), dkA, { op: 0.62, taper: 'end' }); // the groove between the flexors and the extensors
        f.stroke([fa(0.1, -0.42), fa(0.32, -0.4)], W(8), ltA, { op: 0.42 }); f.line([fa(0.1, -0.44), fa(0.36, -0.4)], W(2.2), ltA, { op: 0.7 }); // the lit swell below the elbow
        f.stroke([fa(0.14, 0.36), fa(0.32, 0.4), fa(0.56, 0.26)], W(8), dkA, { op: 0.36 }); f.stroke([fa(0.6, 0.2), fa(0.9, 0.14)], W(5), dkA, { op: 0.3 }); // the shadowed belly of the flexors
        for (let i = 0; i < 3; i++) f.line([fa(0.7 + i * 0.05, 0.22 - i * 0.12), fa(0.96, 0.16 - i * 0.1)], W(1), dkA, { op: 0.5 }); // tendons to the wrist
        f.flat(ell(fa(0.93, -0.28), wsA[2] * 0.12, wsA[2] * 0.09, 0, 8), ltA, { op: 0.55 }); // the wrist bone
        f.line([fa(0.4, 0.1), fa(0.56, -0.04), fa(0.72, 0.06), fa(0.86, -0.02)], W(1.3), '#5a5e7a', { op: 0.5 }); // a swollen vein
      }
      const clothEnd = lerp(Ex, Wx, Math.max(0.02, endT));
      if (sl === 'full' && mdl) {
        // (ruler upgrade pass) the sleeve follows the arm inside it: full over the biceps and the forearm's swell, drawn in
        // to the cuff at the wrist, with folds bunched in the crook, spiralling round the forearm and pulled from the elbow
        const AP = armProfile(Sx, Ex, clothEnd, [wsA[0] * 1.08, wsA[1] * 1.16, wsA[2] * 1.06], bld), fa = AP.fa, u = AP.u;
        f.part(AP.pts, Object.assign({ k: 0.9 }, cloth));
        const cd = mix(cloth.fill, '#000', 0.55), cl = mix(cloth.light || cloth.fill, '#fff', 0.3);
        f.stroke([u(0.72, 0.4), u(0.92, 0.1), fa(0.12, 0.3)], W(3), cd, { op: 0.55 }); f.stroke([u(0.8, 0.46), u(0.96, 0.2), fa(0.2, 0.42)], W(2.2), cd, { op: 0.45 }); // bunched in the crook
        f.stroke([fa(0.3, 0.5), fa(0.44, 0.0), fa(0.4, -0.46)], W(2.6), cd, { op: 0.5 }); f.line([fa(0.34, 0.5), fa(0.48, 0.02), fa(0.44, -0.44)], W(2), cl, { op: 0.6 }); // a spiral fold round the forearm
        f.stroke([fa(0.58, 0.46), fa(0.7, 0.02), fa(0.66, -0.44)], W(2.2), cd, { op: 0.42 });
        f.stroke([u(0.9, -0.42), fa(0.2, -0.2), fa(0.5, -0.3)], W(2.4), cd, { op: 0.4 }); // pulled from the elbow's point
        f.stroke([u(0.1, -0.44), u(0.5, -0.42)], W(9), cl, { op: 0.26 }); f.line([u(0.14, -0.42), u(0.52, -0.4)], W(2.2), cl, { op: 0.6 }); // the lit roll over the triceps
        f.stroke([fa(0.06, -0.42), fa(0.36, -0.4)], W(9), cl, { op: 0.26 }); f.line([fa(0.08, -0.42), fa(0.34, -0.4)], W(2), cl, { op: 0.55 }); // the lit swell of the forearm under the sleeve
        f.stroke([fa(0.62, -0.3), fa(0.92, -0.26)], W(5), cd, { op: 0.3 }); // drawn in toward the cuff
      }
      else if (sl === 'full') f.part(jointLimb(Sx, Ex, clothEnd, wsA, { point: 0.3, mus0: 0.12, mus1: 0.12 }), cloth);
      else if (mdl && sl === 'rolled') {
        // (ruler upgrade pass) the sleeve pushed up over a muscled upper arm: full over the deltoid and biceps, bunched into
        // the roll at the elbow, a fold dragged round the arm and the lit roll of the triceps
        const AP = armProfile(Sx, Ex, lerp(Ex, Wx, 0.22), [wsA[0] * 1.1, wsA[1] * 1.2, wsA[1] * 1.12], bld), u = AP.u, cd = mix(cloth.fill, '#000', 0.55), cl = mix(cloth.light || cloth.fill, '#fff', 0.3);
        f.part(AP.pts, Object.assign({ k: 0.9 }, cloth));
        if (o.shirt && o.shirt !== 'plain' && !jk) shirtPattern(f, AP.pts, o.shirt, shirtS, { ang: angOf(Sx, Ex) + Math.PI / 2, gap: W(o.shirt === 'check' ? 12 : 13), w: W(o.shirt === 'check' ? 2.4 : 4.2), op: 0.5 });
        f.stroke([u(0.3, 0.5), u(0.46, 0.0), u(0.42, -0.5)], W(3), cd, { op: 0.5 }); f.stroke([u(0.62, 0.5), u(0.76, 0.06), u(0.7, -0.48)], W(2.6), cd, { op: 0.45 });
        f.stroke([u(0.12, -0.42), u(0.62, -0.4)], W(9), cl, { op: 0.3 }); f.line([u(0.14, -0.42), u(0.6, -0.4)], W(2), cl, { op: 0.6 });
        f.stroke([u(0.2, 0.3), u(0.6, 0.36)], W(8), cd, { op: 0.25 }); // the shadow under the biceps
      }
      else f.part(ragLimb(f, Sx, lerp(Sx, Ex, 1.0 + endT * 0.4), wsA[0] * 1.08, wsA[1] * 1.12, { depth: W(6) }), cloth);
      if (sl === 'full' && !jk && o.shirt !== 'plain') shirtPattern(f, jointLimb(Sx, Ex, clothEnd, wsA), o.shirt, shirtS, { ang: angOf(Sx, Ex) + Math.PI / 2, gap: W(o.shirt === 'check' ? 12 : 13), w: W(o.shirt === 'check' ? 2.4 : 4.2), op: 0.55 });
      creases(f, Ex, angOf(Sx, Wx) + 1.5, W(22), 3, '#0e1018', 0.65);
      if (sl === 'rolled' && mdl) {
        // (ruler upgrade pass) the roll: a thick twisted band of cloth hugging the arm just below the elbow, bunched into
        // lumps with creases between them, lit along its upper edge, short enough that the forearm's swell shows below it
        const r0 = lerp(Ex, Wx, 0.0), r1 = lerp(Ex, Wx, 0.17), rw = wsA[1] * 1.14, nn = E.norm(sub(r1, r0)), pn = [-nn[1], nn[0]];
        const roll = []; for (let i = 0; i <= 8; i++) { const t = i / 8; roll.push(add(lerp(r0, r1, 0.5), add(mul(pn, (t - 0.5) * rw), mul(nn, -W(10) - Math.sin(t * Math.PI * 3) * W(2))))); }
        for (let i = 8; i >= 0; i--) { const t = i / 8; roll.push(add(lerp(r0, r1, 0.5), add(mul(pn, (t - 0.5) * rw * 0.98), mul(nn, W(10) + Math.sin(t * Math.PI * 3 + 1) * W(2.4))))); }
        f.part(roll, Object.assign({}, cloth, { inkW: 1.4, maxShade: W(10) }));
        for (const t of [0.22, 0.48, 0.74]) f.line([add(lerp(r0, r1, 0.5), add(mul(pn, (t - 0.5) * rw), mul(nn, -W(9)))), add(lerp(r0, r1, 0.5), add(mul(pn, (t - 0.46) * rw), mul(nn, W(9))))], W(1.6), INK, { op: 0.55 });
        f.line(roll.slice(1, 8).map(q => add(q, mul(nn, W(3)))), W(1.6), mix(cloth.fill, '#fff', 0.45), { op: 0.5 });
      } else if (sl === 'rolled') { const rc = lerp(Ex, Wx, 0.14); f.part(limb(lerp(Ex, Wx, 0.02), lerp(Ex, Wx, 0.26), wsA[1] * 1.16, wsA[1] * 1.08, { steps: 6 }), Object.assign({}, cloth, { inkW: 1.3 })); f.line([lp(Ex, Wx, 0.14, -wsA[1] * 0.56), lp(Ex, Wx, 0.16, wsA[1] * 0.56)], 1.2, INK, { op: 0.6 }); void rc; }
      if (sl !== 'full') { X.livid(lerp(Ex, Wx, 0.62), W(10), W(12), 3, 0.3); X.veins(lerp(Ex, Wx, 0.5), W(8), W(10), 2); }
    }, [[bU, cU], [bF, cF]]);
    f.bone(bF);
    if (sl === 'full' && mdl) {
      // the cuff: a frayed turned band hugging the wrist, narrower than the forearm's swell above it, and the bare wrist
      f.part(tube([lerp(Ex, Wx, 0.8), lerp(Ex, Wx, 0.98)], [wsA[2] * 0.78, wsA[2] * 0.72], 0.8), SK({ fill: mix(skin, '#6a6e80', dark ? 0.24 : 0.08) }));
      f.part(ragLimb(f, lerp(Ex, Wx, 0.72), lerp(Ex, Wx, 0.88), wsA[2] * 1.16, wsA[2] * 1.06, { depth: W(4) }), cloth);
      f.line([lp(Ex, Wx, 0.75, -wsA[2] * 0.56), lp(Ex, Wx, 0.76, wsA[2] * 0.56)], W(1.4), INK, { op: 0.55 });
    } else if (sl === 'full') f.part(ragLimb(f, lerp(Ex, Wx, 0.56), lerp(Ex, Wx, 0.9), wsA[1] * 1.02, wsA[2] * 1.2, { depth: W(5) }), cloth);
    // icicles hang plumb from the under side of the elbow
    const outE = E.norm(add(E.norm(sub(Ex, Sx)), E.norm(sub(Ex, Wx))));
    const eLow = add(Ex, mul(outE, W(16)));
    if (o.elbowIce !== false) X.icicles([add(eLow, [-W(10), 0]), add(eLow, [W(10), W(2)])], 2, W(o.iceLen || 24), W(5));
    f.bone(bH);
    if (!hand) return null;
    if (hand.fn) return hand.fn(f, Wx, Ex);
    if (hand.grip) {
      const gp = hand.grip, col = mix(skin, PAL.bite, 0.14);
      let g;
      if (mdl) g = T3b.gripK(f, gp.c || Wx, Ex, gp.thumbAng, W(30) * (o.handS || 1.06), col, Object.assign({ tex: 'mottle' + seed, texOp: 0.45, shadow: skinS, nail: SKIN.nail, name: (o.name || pre) + ' ' + side_ }, gp)); // (ruler upgrade pass) the knuckled fist
      else { g = B.grip(f, gp.c || Wx, Ex, gp.thumbAng, W(30) * (o.handS || 1.06), col, Object.assign({ tex: 'mottle' + seed, texOp: 0.5, shadow: skinS, name: (o.name || pre) + ' ' + side_ }, gp)); fistDetail(f, g, W(30) * (o.handS || 1.06), skin, { nail: SKIN.nail }); }
      X.bite(g.F([[0.45, 0]])[0], W(8), W(8), 3, 0.5);
      return g;
    }
    if (hand.open) {
      const op = hand.open, h = openHand(f, Wx, op.ang, W(86) * (o.handS || 1.06), SK({ fill: mix(skin, PAL.bite, 0.15) }), Object.assign({ swell: 0.4, nail: SKIN.nail }, op));
      h.fing.forEach(g => f.flat(ell(g.k3, W(4.5), W(3.6), 0, 8), PAL.biteD, { op: 0.65 })); // frost-blackened fingertips
      return h;
    }
    return null;
  };

  // ---- a leg: trouser tube to its length, then bare shin and foot (planted on the ice, or free in the air)
  const leg = (Hx, Kx, Ax, side_, dark) => {
    const bT = nm('thigh_' + side_), bS = nm('shin_' + side_), bFt = nm('foot_' + side_), gy = f.o.groundY;
    const len = tr.len || 'shin', tEnd = len === 'full' ? 0.9 : len === 'knee' ? 0.18 : len === 'cut' ? 0.62 : 0.5;
    const M = lerp(Kx, Ax, tEnd), planted = Ax[1] > gy - W(80) && !o.footFree?.[side_];
    const legLook = SK(dark ? { fill: mix(skin, '#6a6e80', 0.2) } : { fill: mix(skin, '#9aa0b0', 0.1) });
    const dir = o.footDir?.[side_] ?? facing;
    if (o.feet === 'shoe') {
      split(f, () => {
        B.boot(f, Ax, dir, W(54), '#1c1d21', { tex: 'mottle' + seed, shaft: 0.7, style: 'shoe' });
        if (o.gaiter) {
          // a buttoned canvas gaiter from under the knee over the shoe's instep, buttons down the outside, frozen stiff
          const g0 = lerp(Kx, Ax, 0.06), gt = [lp(g0, Ax, 0, W(30)), lp(g0, Ax, 0.45, W(28)), lp(g0, Ax, 0.95, W(22)), add(Ax, [dir * W(30), W(18)]), add(Ax, [dir * W(12), W(26)]), add(Ax, [-dir * W(20), W(16)]), lp(g0, Ax, 0.9, -W(22)), lp(g0, Ax, 0.4, -W(32)), lp(g0, Ax, 0, -W(30))];
          f.part(gt, { fill: o.gaiter, shadow: '#12141a', tex: 'weave' + seed, texOp: 0.45, light: mix(o.gaiter, '#fff', 0.2), maxShade: W(24) });
          const bs = dir > 0 ? -1 : 1;
          for (let i = 0; i < 6; i++) { if (o.gaiterTorn?.[side_] && i === 3) continue; f.rivet(lp(g0, Ax, 0.08 + i * 0.15, bs * W(24)), W(2.6), PAL.pewter); }
          f.line([lp(g0, Ax, 0.02, -W(28)), lp(g0, Ax, 0.04, W(28))], W(2.4), INK, { op: 0.7 });
          if (o.gaiterTorn?.[side_]) { const tq = lp(g0, Ax, 0.55, bs * W(20)); f.flat([add(tq, [-W(6), -W(14)]), add(tq, [W(8), -W(4)]), add(tq, [W(2), W(16)]), add(tq, [-W(8), W(6)])], '#0c0e12', { op: 0.85 }); f.line([add(tq, [-W(6), -W(14)]), add(tq, [-W(12), W(2)]), add(tq, [-W(4), W(14)])], 1.1, '#b8c0c6', { op: 0.6 }); }
          f.stroke([lp(g0, Ax, 0.3, -W(20)), lp(g0, Ax, 0.5, W(4)), lp(g0, Ax, 0.6, W(20))], W(2.4), '#0e1016', { op: 0.5 });
          X.rime([lp(g0, Ax, 0.1, bs * W(30)), lp(g0, Ax, 0.5, bs * W(29)), lp(g0, Ax, 0.85, bs * W(23))], W(6), bs);
        }
      }, [[bS, side(Ax, [0, -1], W(14))], [bFt, side(Ax, [0, 1], W(14))]]);
    } else if (planted) {
      split(f, () => {
        if (o.model !== false) mShin(f, M, lerp(M, Ax, 0.94), dir > 0 ? 0 : Math.PI, W(46), legLook, { veins: false }); // consistency pass: the calf swells behind the shin under the planted foot's ankle
        bareLeg(f, M, Ax, dir, W(50), W(42), legLook, { swell: 0.3 });
        if (o.model !== false) { const sp = shinProfile(M, Ax, dir > 0 ? 0 : Math.PI, W(42)), at = sp.at, dk = mix(legLook.shadow || legLook.fill, '#000', 0.3), lt = mix(legLook.fill, '#fff', 0.45);
          f.line([at(0.06, 0.24), at(0.4, 0.2), at(0.7, 0.14)], W(1.8), lt, { op: 0.55 }); // the shin bone's lit edge
          f.line([at(0.08, -0.22), at(0.3, -0.3), at(0.56, -0.16)], W(1.6), dk, { op: 0.55 }); // the calf's lower border
          f.line([at(0.6, -0.2), at(0.82, -0.22)], W(1.3), dk, { op: 0.5 }); // the Achilles
          f.line([at(0.2, 0.04), at(0.42, -0.04), at(0.6, 0.04)], W(1.1), '#5a5e7a', { op: 0.4 }); } // a vein
      }, [[bS, side(Ax, [0, -1], W(16))], [bFt, side(Ax, [0, 1], W(16))]]);
      f.bone(bFt); X.bite([Ax[0] + dir * W(48), gy - W(12)], W(16), W(6), 6, 0.75);
    } else {
      f.bone(bS);
      const fa = o.footAng?.[side_] ?? (angOf(Kx, Ax) + (dir > 0 ? -1.35 : 1.35));
      if (o.model !== false) mShin(f, lerp(Kx, Ax, tEnd - 0.08), Ax, fa, W(44) * (o.thighW ? o.thighW / 66 : 1), legLook); // (ruler upgrade pass) the calf and ankle modelled
      else f.part(tube([lerp(Kx, Ax, tEnd - 0.08), lerp(Kx, Ax, 0.75), Ax], [W(42), W(34), W(28)]), legLook);
      f.bone(bFt);
      freeFoot(f, Ax, fa, W(58), legLook, { flip: dir < 0 });
      X.bite(add(Ax, rot([W(50), 0], fa)), W(14), W(8), 6, 0.8);
    }
    const [c1, c2] = jcut(Hx, Kx, M, W(24));
    const out = jointLimb(Hx, Kx, M, [W(o.thighW || 66), W(52), W(len === 'knee' ? 50 : 58)], { point: 0.22, mus0: 0.1, mus1: 0.08 });
    split(f, () => {
      f.part(out, TR(dark ? { fill: mix(tr.col, '#2a3038', 0.25) } : {}));
      clipDraw(f, out, () => {
        if (tr.stripe) for (let k = -4; k <= 4; k++) { const o2 = k * W(9.5); f.stroke([lp(Hx, Kx, -0.1, o2 * 1.15), lp(Hx, Kx, 0.5, o2 * 1.08), lp(Hx, Kx, 1.0, o2 * 0.95), lp(Kx, M, 0.5, o2 * 1.05), lp(Kx, M, 1.1, o2 * 1.2)], W(3.2), tr.stripe, { op: 0.7 }); }
        for (const [t, dep] of [[0.35, 1], [0.7, 0.8]]) f.stroke([lp(Hx, Kx, t, -W(34)), lp(Hx, Kx, t + 0.06, -W(10)), lp(Hx, Kx, t + 0.02, W(12))], W(3), '#1a1e28', { op: 0.5 * dep });
        f.stroke([lp(Kx, M, 0.25, W(26)), lp(Kx, M, 0.45, W(4)), lp(Kx, M, 0.7, -W(10))], W(2.6), '#1a1e28', { op: 0.45 });
        f.flat([lp(Kx, M, 0.5, -W(40)), lp(Kx, M, 0.5, W(40)), lp(Kx, M, 1.3, W(40)), lp(Kx, M, 1.3, -W(40))], '#3a4652', { op: 0.25 });
        if (tr.tar) for (let i = 0; i < 5; i++) { const q = lerp(Hx, Kx, 0.2 + f.r() * 0.7); f.flat(ell(add(q, [(f.r() - 0.5) * W(30), 0]), W(6 + f.r() * 8), W(4 + f.r() * 5), f.r() * 3, 8), '#16181c', { op: 0.45 }); }
      });
      creases(f, Kx, angOf(Hx, M) + 1.57, W(24), 3, '#1a1e28', 0.6);
      const hemA = lp(Kx, M, 0.98, -W(28)), hemB = lp(Kx, M, 0.98, W(28));
      f.line([hemA, lp(Kx, M, 1.04, -W(10)), lp(Kx, M, 0.97, W(8)), hemB], W(2.2), INK, { op: 0.8 });
      X.icicles([hemA, lp(Kx, M, 1.0, 0), hemB], 3, W(20), W(5));
    }, [[bT, c1], [bS, c2]]);
    return { M };
  };

  // far side first
  if (o.beforeFar) o.beforeFar(res);
  if (J.SF && o.farArmBehind !== false) res.gF = arm(J.SF, J.EF, J.WF, 'f', o.handF, true);
  if (J.HF) leg(J.HF, J.KF, J.AF, 'f', true);
  if (J.HN) leg(J.HN, J.KN, J.AN, 'n', false);
  if (o.beforeTorso) o.beforeTorso(res);

  // ---- torso: shirt (striped / checked / plain), the belly distended with the sea it swallowed, optional jacket
  f.bone(nm('torso'));
  const bel = o.belly ?? 0.08;
  // (ruler upgrade pass) o.inverted: a man hanging head-down. The torso is a ribcage, a waist and hips (not a sack): the
  // swollen belly falls toward the chest, the jacket and shirt slide down toward the armpits, and the bare skin between
  // the shirt's hem and the waistband shows the lower ribs, the costal arch and the hip crest
  const inv = !!o.inverted;
  const prof = o.prof || (inv ? [[-0.1, 0.42, 0.42], [0.06, 0.8, 0.68], [0.28, 0.86, 0.84], [0.48, 0.82, 0.8 + bel * 0.4], [0.64, 0.66, 0.7 + bel * 0.3], [0.78, 0.6, 0.62 + bel * 0.2], [0.9, 0.7, 0.62], [1.04, 0.78, 0.6]].map(([v, b, fr]) => [v, b * (o.chestW || 1), fr * (o.chestW || 1)]) : null) || [[-0.1, 0.4, 0.42], [0.06, 0.82, 0.66], [0.3, 0.8, 0.8], [0.55, 0.7, 0.76 + bel * 0.6], [0.78, 0.68, 0.74 + bel], [1.02, 0.72, 0.68 + bel * 0.4]].map(([v, b, fr]) => [v, b * (o.chestW || 1), fr * (o.chestW || 1)]);
  const torso = S.shape(prof); res.torso = torso;
  f.part(torso, SH());
  if (o.shirt && o.shirt !== 'plain') shirtPattern(f, torso, o.shirt, shirtS, { ang: Math.atan2(S.T(0.5)[1], S.T(0.5)[0]) + Math.PI / 2, gap: W(o.shirt === 'check' ? 13 : 14), w: W(o.shirt === 'check' ? 2.6 : 4.6), op: 0.62 });
  clipDraw(f, torso, () => {
    // the drowned belly: a sagging swell with stretched cloth, folds pulled across it, a salt tide-line
    f.stroke([S.at(0.2, 0.52), S.at(0.5, 0.66), S.at(0.7, 0.82)], W(3), '#1a1e28', { op: 0.45 });
    f.stroke([S.at(-0.4, 0.92), S.at(0.1, 0.98), S.at(0.6, 0.95)], W(4), '#1a1e28', { op: 0.4 });
    for (let i = 0; i < 2; i++) f.line([S.at(-0.8, 0.45 + i * 0.16), S.at(-0.2, 0.42 + i * 0.16), S.at(0.6, 0.47 + i * 0.16)], 1.2, '#dbe3e8', { op: 0.3 });
    f.flat([S.at(-0.9, -0.2), S.at(0.2, -0.2), S.at(-0.1, 0.4), S.at(-0.9, 0.5)], '#14171f', { op: 0.18 }); // the back turned from the light
  });
  if (jk) {
    // (independent review) the jacket was a flat dark box. Now: sloped shoulders and a rounded upper back, the waist taken
    // in, a hem that kicks out over the hip and hangs in frozen points; the front open on the shirt with a turned lapel,
    // a button row, a pocket flap, pull folds from the armpit, bunching at the waist, worn-bright edges, a patch
    const cw = o.chestW || 1, hem = inv ? 0.5 : jk.long ? 1.15 : 0.98, b2 = bel * 0.8;
    const jkt = inv
      // (ruler upgrade pass) slid down toward the armpits: the hem bunched and flared away from the ribs, hanging toward the head
      ? [S.at(-0.46 * cw, -0.07), S.at(-0.16, -0.13), S.at(0.24, -0.08), S.at(0.5, 0.03), S.at(0.72, 0.16), S.at(0.8, 0.32), S.at(0.86, 0.48), S.at(0.96, hem + 0.02, 1), S.at(0.7, hem - 0.03), S.at(0.5, hem + 0.05, 1), S.at(0.26, hem - 0.01), S.at(0.0, hem + 0.06, 1), S.at(-0.3, hem - 0.02), S.at(-0.6, hem + 0.05, 1), S.at(-1.0 * cw, hem + 0.02, 1), S.at(-0.96 * cw, 0.44), S.at(-0.92 * cw, 0.22), S.at(-0.76 * cw, 0.04)]
      : [S.at(-0.46 * cw, -0.07), S.at(-0.16, -0.13), S.at(0.24, -0.08), S.at(0.5, 0.03), S.at(0.68, 0.16), S.at(0.7, 0.3), S.at(0.62, 0.48), S.at(0.62 + b2, 0.66), S.at(0.74 + bel, 0.84), S.at(0.8 + b2, hem + 0.02, 1), S.at(0.6, hem - 0.02), S.at(0.42, hem + 0.06, 1), S.at(0.24, hem), S.at(0.02, hem + 0.05, 1), S.at(-0.26, hem - 0.01), S.at(-0.5, hem + 0.04, 1), S.at(-0.84 * cw, hem + 0.01, 1), S.at(-0.82 * cw, 0.8), S.at(-0.74 * cw, 0.64), S.at(-0.84 * cw, 0.42), S.at(-0.9 * cw, 0.22), S.at(-0.76 * cw, 0.04)];
    f.part(jkt, JK());
    const jD = jk.colD || mix(jk.col, '#000', 0.3), jL = jk.colL || mix(jk.col, '#fff', 0.25);
    clipDraw(f, jkt, () => {
      f.flat([S.at(-1.2, -0.2), S.at(-0.42, -0.2), S.at(-0.5, 0.5), S.at(-0.36, 1.3), S.at(-1.2, 1.3)], '#000', { op: 0.24 }); // the back turned from the light
      f.stroke([S.at(-0.66, 0.08), S.at(-0.52, 0.22), S.at(-0.5, 0.36)], W(9), jL, { op: 0.22 }); // the shoulder blade under the cloth
      // pull folds from the front armpit to the belt, bunching at the small of the back
      for (const [u0, v0, u1, v1, w, op] of [[0.5, 0.2, 0.18, 0.62, 3.2, 0.6], [0.52, 0.3, 0.3, 0.74, 2.4, 0.5], [-0.62, 0.3, -0.3, 0.7, 2.6, 0.5], [-0.7, 0.62, -0.2, 0.68, 3, 0.55], [-0.66, 0.74, -0.1, 0.8, 2.2, 0.4]]) {
        f.stroke([S.at(u0, v0), S.at((u0 + u1) / 2 + 0.04, (v0 + v1) / 2), S.at(u1, v1)], W(w), '#07080b', { op });
        f.line([S.at(u0 + 0.05, v0 + 0.02), S.at((u0 + u1) / 2 + 0.09, (v0 + v1) / 2 + 0.02), S.at(u1 + 0.05, v1 + 0.02)], W(1.4), jL, { op: op * 0.6 });
      }
      if (inv) {
        // (ruler upgrade pass) the cloth bunched at the hem and dragged toward the head over the ribcage: drag folds from
        // the hem up to the armpit, the ribcage's lit round under the cloth, heavy bunching along the hem
        f.flat(ell(S.at(0.1, 0.34), W(50) * cw, W(34), Math.atan2(S.T(0.4)[1], S.T(0.4)[0]) + Math.PI / 2, 14), jL, { op: 0.3 }); f.stroke([S.at(-0.5, 0.42), S.at(0.1, 0.5), S.at(0.6, 0.44)], W(6), '#07080b', { op: 0.35 }); // the ribcage's barrel under the cloth, and the shadow where the cloth leaves it
        for (const [u0, u1, w] of [[0.7, 0.4, 3], [0.36, 0.18, 2.6], [0.0, -0.1, 2.8], [-0.4, -0.5, 2.6], [-0.76, -0.7, 2.4]]) { f.stroke([S.at(u0, hem - 0.02), S.at((u0 + u1) / 2, hem - 0.18), S.at(u1, hem - 0.38)], W(w), '#07080b', { op: 0.55, taper: 'end' }); f.line([S.at(u0 + 0.07, hem - 0.03), S.at((u0 + u1) / 2 + 0.07, hem - 0.18), S.at(u1 + 0.06, hem - 0.34)], W(1.3), jL, { op: 0.4 }); }
        f.stroke([S.at(-0.9, hem - 0.05), S.at(-0.3, hem - 0.08), S.at(0.3, hem - 0.06), S.at(0.9, hem - 0.04)], W(6), '#07080b', { op: 0.35 });
      }
      // worn-bright edges along the hem and the seams; salt tide-lines
      f.line([S.at(-0.84, hem - 0.03), S.at(-0.3, hem - 0.04), S.at(0.3, hem - 0.03), S.at(0.8, hem - 0.01)], W(2), jL, { op: 0.4 });
      for (let i = 0; i < 2; i++) f.line([S.at(-0.8, 0.5 + i * 0.13), S.at(-0.3, 0.47 + i * 0.13), S.at(0.3, 0.52 + i * 0.13)], 1.1, '#dbe3e8', { op: 0.22 });
    });
    if (jk.open !== false) {
      // the open front: a V of shirt, the turned lapel catching the light, the button row on the far front
      const v1 = 0.5;
      const shirtV = [S.at(0.3, -0.03), S.at(0.58, 0.02), S.at(0.56, v1 * 0.6), S.at(0.46, v1)];
      f.part(shirtV, SH({ inkW: 1.1 }));
      if (o.shirt && o.shirt !== 'plain') shirtPattern(f, shirtV, o.shirt, shirtS, { ang: Math.atan2(S.T(0.3)[1], S.T(0.3)[0]) + Math.PI / 2, gap: W(10), w: W(2.6), op: 0.55 });
      f.part([S.at(0.26, -0.06), S.at(0.36, 0.0), S.at(0.44, v1 * 0.9), S.at(0.42, v1 + 0.04), S.at(0.3, 0.2)], JK({ fill: jL, inkW: 1.2, maxShade: W(8) })); // the lapel turned back
      f.stroke([S.at(0.44, v1 + 0.02), S.at(0.5, 0.72), S.at(0.56, hem)], W(2), '#07080b', { op: 0.8 }); // the closed front edge below
      const nb = inv ? 1 : jk.buttons ?? 5;
      for (let i = 0; i < nb; i++) { if (jk.missing === i) { f.line([S.at(0.4, 0.5 + i * 0.1), S.at(0.43, 0.53 + i * 0.1)], 1, '#9aa4ae', { op: 0.7 }); continue; } f.rivet(S.at(0.4, 0.5 + i * 0.1), W(3.2), PAL.pewter); }
    }
    // a pocket flap low on the front, and a stitched patch where the man wore through
    const pf = inv ? [S.at(0.0, 0.42), S.at(0.36, 0.44), S.at(0.34, 0.51), S.at(0.02, 0.49)] : [S.at(0.0, 0.74), S.at(0.36, 0.76), S.at(0.34, 0.83), S.at(0.02, 0.81)];
    f.part(pf, JK({ fill: mix(jk.col, '#000', 0.1), inkW: 1.1, maxShade: W(6) })); f.line(inv ? [S.at(0.02, 0.48), S.at(0.34, 0.5)] : [S.at(0.02, 0.8), S.at(0.34, 0.82)], 1, jL, { op: 0.4 });
    if (jk.patch) { const [pu, pv] = jk.patch, pp = [S.at(pu - 0.16, pv - 0.08), S.at(pu + 0.14, pv - 0.1), S.at(pu + 0.16, pv + 0.1), S.at(pu - 0.14, pv + 0.11)]; f.part(pp, JK({ fill: mix(jk.col, '#8a929c', 0.35), inkW: 1, tex: 'weave' + seed })); f.stitches(pp.concat([pp[0]]), mix(jk.col, '#fff', 0.5), 0.7); }
    f.stroke([S.at(-0.6, 0.3), S.at(-0.52, inv ? 0.45 : 0.6), S.at(-0.62, inv ? 0.58 : 0.9)], W(2.2), '#0e1018', { op: 0.7 }); // the side seam
    f.stitches([S.at(-0.26, 0.22), S.at(-0.32, inv ? 0.4 : 0.5), S.at(-0.26, inv ? 0.58 : 0.9)], '#6a7484', 0.8);
    f.line([S.at(-0.84, 0.3), S.at(-0.6, 0.16), S.at(-0.3, 0.1)], W(1.6), jL, { op: 0.4 });
    void jD;
    res.jacket = jkt;
  }
  if (inv) {
    // (ruler upgrade pass) the shirt ridden down toward the chest, its hem torn; the bare drowned skin above it to the
    // waistband: the lower ribs as lit ridges over hatched troughs, the costal arch, the swollen belly sagging toward the
    // ribs with its navel, the hip crest lit above the waistband; livid patches and veins
    const sh0 = 0.61, edge = []; for (let i = 0; i <= 12; i++) { const u = -1.3 + i * 0.22; edge.push(S.at(u, sh0 + ((i * 7) % 5) * 0.014 - 0.02, i % 3 === 1 ? 1 : 0)); }
    const band = [...edge, S.at(1.4, 0.95), S.at(-1.4, 0.95)];
    clipDraw(f, torso, () => {
      f.part(band, SK({ fill: mix(skin, '#8a86a2', 0.2), shadow: mix(skinS, '#000', 0.1), inkW: 1.6, maxShade: W(20), tex: 'mottle' + seed, texOp: 0.6 }));
      const dkS = mix(skinS, '#000', 0.25), ltS = mix(skin, '#fff', 0.5);
      f.flat([S.at(-1.4, 0.6), S.at(-0.3, 0.6), S.at(-0.4, 0.95), S.at(-1.4, 0.95)], '#14171f', { op: 0.22 }); // the back turned from the light
      for (const [v, u0, u1] of [[0.655, -0.9, 0.52], [0.7, -0.86, 0.42], [0.745, -0.8, 0.28], [0.79, -0.7, 0.1]]) { f.stroke([S.at(u0, v + 0.02), S.at((u0 + u1) / 2 - 0.1, v + 0.06), S.at(u1, v - 0.01)], W(6), dkS, { op: 0.5, taper: 'end' }); f.line([S.at(u0 + 0.04, v - 0.006), S.at((u0 + u1) / 2 - 0.1, v + 0.032), S.at(u1, v - 0.03)], W(2.6), ltS, { op: 0.75 }); } // the lower ribs, each a lit ridge arching over a dark trough
      f.stroke([S.at(0.7, 0.66), S.at(0.44, 0.74), S.at(0.16, 0.8)], W(4), dkS, { op: 0.3 }); f.line([S.at(0.7, 0.655), S.at(0.44, 0.735), S.at(0.16, 0.795)], W(1.8), dkS, { op: 0.7 }); // the costal arch
      f.flat(ell(S.at(0.62 + bel * 0.4, 0.8), W(22), W(16), 0.2, 12), ltS, { op: 0.25 }); // the swollen belly's lit round
      f.flat(ell(S.at(0.66 + bel * 0.4, 0.83), W(3), W(2.2), 0, 8), dkS, { op: 0.8 }); // the navel
      f.stroke([S.at(-0.5, 0.88), S.at(-0.1, 0.86), S.at(0.34, 0.865)], W(5), dkS, { op: 0.25 }); f.line([S.at(-0.46, 0.875), S.at(-0.1, 0.852), S.at(0.3, 0.855)], W(2), ltS, { op: 0.55 }); // the hip crest
      X.livid(S.at(-0.4, 0.8), W(14), W(10), 4, 0.35); X.veins(S.at(0.2, 0.8), W(14), W(10), 3);
      f.line(edge, W(1.8), INK, { op: 0.7 }); f.line(edge.map(q => add(q, mul(up, -W(3)))), W(1.4), mix(shirtCol, '#fff', 0.4), { op: 0.5 }); // the shirt's torn hem
    });
  }
  if (PS.neck) {
    // a neckcloth knotted at the throat, its ends frozen hanging plumb
    const n0 = S.at(-0.3, -0.04), n1 = S.at(0.5, 0.02), kn = S.at(0.42, 0.06);
    f.part([n0, S.at(0.1, -0.1), n1, S.at(0.5, 0.1), S.at(0.1, 0.06), S.at(-0.3, 0.06)], { fill: PS.neck, shadow: '#101218', tex: 'weave' + seed, texOp: 0.45, shade: 0.35, inkW: 1.1, maxShade: W(8) });
    f.part(ell(kn, W(8), W(6), 0, 10), { fill: PS.neck, shade: 0.4, inkW: 1, cast: false });
    for (const dx of [-W(3), W(5)]) { const e = add(kn, [dx * 1.4, W(34 + dx)]); f.stroke([kn, add(kn, [dx, W(16)]), e], W(5.5), PS.neck); X.icicle(add(e, [0, W(1)]), W(10), W(3)); }
  }
  if (o.afterTorso) o.afterTorso(res);
  // belt or rope, and rime along the windward top of the shoulders, icicles off the hem
  if (o.belt !== false) {
    const bc = o.beltCol || '#202226';
    f.part([S.at(-0.84, 0.86), S.at(0.7 + bel, 0.82), S.at(0.72 + bel, 0.92), S.at(-0.86, 0.96)], { fill: bc, shade: 0.4, tex: 'mottle' + seed, sharp: true, inkW: 1.2 });
    if (o.belt === 'rope') for (let i = 0; i < 8; i++) f.line([S.at(-0.8 + i * 0.2, 0.86), S.at(-0.72 + i * 0.2, 0.95)], 1.1, '#0c0d10', { op: 0.7 });
  }
  if (o.shoulderRime !== false) X.rime([S.at(-0.5, -0.07), S.at(-0.1, -0.13), S.at(0.3, -0.06), S.at(0.58, 0.1)], W(10), ro);
  if (o.hemIce !== false) X.icicles([S.at(-0.8, jk && jk.long ? 1.14 : 0.97), S.at(0.0, jk && jk.long ? 1.12 : 0.96), S.at(0.62, jk && jk.long ? 1.14 : 0.97)], 5, W(22), W(5));

  // ---- head: neck, a drowned face under a glaze, cap or kerchief, icicles from the chin
  f.bone(nm('head'));
  f.part(limb(S.at(0.05, -0.02), hF([[-0.08, 0.3]])[0], W(44), W(38)), SK());
  if (o.queue) { const q0 = hF([[-0.42, 0.0]])[0]; f.stroke([q0, add(q0, [-W(2), W(36)]), add(q0, [W(1), W(74)])], W(10), '#121316'); f.line([add(q0, [-W(3), W(30)]), add(q0, [W(3), W(32)])], W(2), PAL.rope); X.icicle(add(q0, [W(1), W(72)]), W(12), W(4)); }
  const face = Object.assign({ skin: '#c3cbcf', jaw: 1.15, chin: 0.02, nose: 1.05, hook: 0.15, mouth: 'set', squint: 0.35, age: true, faceShade: 0.72, jawShade: 0.36, faceHatch: false, iris: '#b4bec6', eyeWhite: '#d4dadc', hairCol: '#1a1c20', browCol: '#2a2c32', browDown: 0.0 }, o.face || {});
  if (o.mirror) headF(f, hF, H * hS, face); else B.head(f, HC, H * hS, hA, face);
  // B.head tints the ear and nose a little warm; this world has no warm colour, so wash them back to the drowned grey
  if (!face.noEar) f.flat(hF(ell([-0.215, 0.05], 0.07, 0.13, 0, 12)), face.skin, { op: 0.55 });
  f.flat(hF([[0.3, -0.04], [0.37, 0.08], [0.38, 0.15], [0.3, 0.16], [0.27, 0.1]]), face.skin, { op: 0.4 });
  // persona hair, under any cap: a wet crop, grey tufts round a bald crown, long hanks hanging plumb, or swept back stiff
  const hc = face.hairCol || '#1a1c20', HL = { fill: hc, shadow: mix(hc, '#000', 0.5), light: mix(hc, '#fff', 0.3), shade: 0.4, tex: 'hatch' + seed, texOp: 0.3, inkW: 1.1, cast: false, maxShade: W(10) };
  if (PS.hair === 'crop' || PS.hair === 'swept') {
    const sw = PS.hair === 'swept' ? 0.14 : 0;
    f.part(hF([[-0.4 - sw, -0.08], [-0.42 - sw * 1.4, -0.3], [-0.26 - sw, -0.5], [0.0, -0.56], [0.2, -0.52], [0.3, -0.38], [0.22, -0.34], [0.1, -0.4], [-0.06, -0.36], [-0.16, -0.2], [-0.24, -0.02], [-0.34, 0.08]]), HL);
    for (let i = 0; i < 6; i++) f.line(hF([[0.2 - i * 0.09, -0.5 + i * 0.01], [-0.02 - i * 0.09 - sw, -0.42 + i * 0.05]]), W(1.1), mix(hc, '#fff', 0.35), { op: 0.55 });
    if (sw) X.icicles(hF([[-0.5, -0.3], [-0.46, -0.06]]), 3, W(16), W(3.5));
  } else if (PS.hair === 'tufts') {
    // a frayed horseshoe of grey hair round the back of a bald crown: short separate clumps, frozen stiff
    for (const [u, v, du, dv] of [[-0.28, -0.3, -0.12, 0.06], [-0.34, -0.18, -0.12, 0.1], [-0.36, -0.04, -0.1, 0.12], [-0.3, 0.06, -0.06, 0.14], [-0.22, -0.34, -0.1, 0.02]]) {
      const q = hF([[u, v], [u + du * 0.5, v + dv * 0.5], [u + du, v + dv]]); hairClump(f, q, W(9), { pal: [hc, mix(hc, '#fff', 0.2), mix(hc, '#3a3e48', 0.3)], n: 3, gapOp: 0.35 });
    }
    f.line(hF([[-0.1, -0.5], [0.12, -0.52]]), 1, mix(face.skin, '#000', 0.4), { op: 0.4 }); // the bald crown's wrinkle
  } else if (PS.hair === 'long') {
    const roots = hF([[-0.38, -0.2], [-0.3, -0.36], [-0.16, -0.46], [-0.42, 0.0]]);
    roots.forEach((r, i) => { const l = W(70 + (i * 37) % 50); hairClump(f, [r, add(r, [W(2 - i), l * 0.5]), add(r, [W(-1 + i), l])], W(16 - i * 2), { pal: [hc, mix(hc, '#3a3e48', 0.3)], gapOp: 0.5 }); X.icicle(add(r, [W(-1 + i), l - W(2)]), W(12), W(3.5)); });
  }
  if (o.mouth === 'open') {
    f.part(hF([[-0.06, 0.4], [0.1, 0.5], [0.3, 0.44], [0.33, 0.56], [0.2, 0.64], [0.04, 0.62], [-0.1, 0.5]]), SK({ inkW: 1.3, maxShade: W(10) }));
    f.flat(hF([[0.16, 0.25], [0.25, 0.235], [0.33, 0.25], [0.32, 0.42], [0.24, 0.48], [0.17, 0.43]]), PAL.lips);
    f.flat(hF([[0.18, 0.27], [0.25, 0.26], [0.31, 0.27], [0.3, 0.4], [0.24, 0.45], [0.19, 0.41]]), '#0c0e14');
    f.flat(hF([[0.2, 0.39], [0.26, 0.37], [0.29, 0.41], [0.24, 0.44]]), '#4a4a5c', { op: 0.8 });
  } else f.flat(hF([[0.18, 0.268], [0.25, 0.262], [0.31, 0.27], [0.3, 0.3], [0.22, 0.3]]), PAL.lips, { op: 0.8 }); // blue-black lips
  X.livid(hF([[0.0, 0.3]])[0], W(10), W(8), 3, 0.3);
  X.bite(hF([[0.36, 0.08]])[0], W(5), W(5), 3, 0.6);
  X.glaze(hF([[0.06, -0.3], [0.36, -0.2], [0.38, 0.3], [0.2, 0.5], [0.0, 0.4]]), 0.2);
  const cap = o.cap || 'knit';
  if (cap === 'knit' || cap === 'ears') {
    const cl = o.capLift || 0, hF0 = hF; hF = pts => hF0(pts.map(q => [q[0], q[1] - cl]));
    const cp = hF([[-0.44, -0.04], [-0.42, -0.36], [-0.24, -0.56], [0.06, -0.62], [0.3, -0.5], [0.4, -0.3], [0.38, -0.14], [0.0, -0.2], [-0.3, -0.08]]);
    f.part(cp, { fill: o.capCol || PAL.wool, shadow: '#2a2e36', tex: X.hoar, texOp: 0.4, light: PAL.woolL, maxShade: W(30) });
    clipDraw(f, cp, () => { for (let i = 0; i < 9; i++) f.line(hF([[-0.4 + i * 0.09, -0.6], [-0.36 + i * 0.09, -0.1]]), 1.1, '#2a2e36', { op: 0.55 }); });
    f.part(hF([[-0.46, -0.02], [-0.4, -0.16], [0.0, -0.27], [0.4, -0.27], [0.42, -0.14], [0.0, -0.14], [-0.38, 0.02]]), { fill: mix(o.capCol || PAL.wool, '#000', 0.3), shadow: '#20242a', tex: 'weave' + seed, texOp: 0.5, inkW: 1.3 });
    X.rime(hF([[0.0, -0.6], [0.24, -0.54], [0.4, -0.34]]), W(6), ro);
    hF = hF0;
  } else if (cap === 'kerchief') {
    // a kerchief knotted over the ears against the noise of the guns: a band over the crown and both ears, knot at the nape
    const band = hF([[-0.36, -0.36], [-0.1, -0.56], [0.16, -0.56], [0.3, -0.42], [0.2, -0.32], [-0.02, -0.4], [-0.12, -0.2], [-0.08, 0.14], [-0.2, 0.22], [-0.34, 0.12], [-0.42, -0.1]]);
    f.part(band, { fill: o.capCol || '#2e3440', shadow: '#12141a', tex: 'weave' + seed, texOp: 0.5, maxShade: W(20) });
    f.line(hF([[-0.2, -0.46], [-0.24, -0.1], [-0.18, 0.16]]), 1.2, '#0c0e12', { op: 0.6 });
    const kn = hF([[-0.44, -0.06]])[0];
    f.part(ell(kn, W(9), W(7), 0, 10), { fill: o.capCol || '#2e3440', shade: 0.4, inkW: 1.1, cast: false });
    for (const dx of [-W(4), W(5)]) f.stroke([kn, add(kn, [dx, W(16)]), add(kn, [dx * 1.6, W(30)])], W(6), o.capCol || '#2e3440');
    // hair stiff with ice on the bare crown
    f.part(hF([[-0.3, -0.36], [-0.1, -0.5], [0.12, -0.5], [0.26, -0.42], [0.1, -0.44], [-0.1, -0.42]]), { fill: o.face?.hairCol || '#1a1c20', shade: 0.4, inkW: 1, cast: false });
    X.rime(hF([[-0.1, -0.56], [0.16, -0.56], [0.3, -0.42]]), W(5), ro);
  }
  // persona frozen state: each man stopped a different way
  const fr = PS.frost || [];
  if (PS.earring) { const er = hF([[-0.19, 0.19]])[0]; f.line(ell(er, W(4), W(5.5), 0, 10).concat([ell(er, W(4), W(5.5), 0, 10)[0]]), W(1.6), PAL.pewter); }
  if (fr.includes('mask')) {
    // the spray froze over his face in a sheet: eyes sealed white, a thick glaze over brow and cheek, cracked
    f.flat(hF([[0.02, -0.16], [0.36, -0.14], [0.4, 0.06], [0.3, 0.2], [0.08, 0.16], [-0.02, 0.0]]), '#dfe8ee', { op: 0.42 });
    f.flat(hF(ell([0.11, -0.06], 0.07, 0.035, 0.05, 10)), '#eef3f6', { op: 0.9 }); f.flat(hF(ell([0.295, -0.065], 0.03, 0.03, 0, 8)), '#eef3f6', { op: 0.85 });
    X.cracks(hF([[0.2, -0.02]])[0], W(16), 2, 0.4);
  }
  if (fr.includes('brows')) for (const seg of [[[0.0, -0.15], [0.19, -0.14]], [[0.25, -0.15], [0.34, -0.14]]]) f.stroke(hF(seg), W(3.6), '#e6edf1', { op: 0.85 });
  if (fr.includes('nose')) X.icicle(hF([[0.34, 0.17]])[0], W(22), W(4));
  if (fr.includes('mouthIce') && o.mouth === 'open') { f.part(hF([[0.19, 0.3], [0.3, 0.29], [0.3, 0.4], [0.24, 0.44], [0.19, 0.4]]), X.IC({ fill: '#d4dee6', inkW: 0.9, opacity: 0.85 })); }
  if (fr.includes('breath') && o.mouth === 'open') X.breath(hF([[0.33, 0.34]])[0], add(rot([1, 0], o.mirror ? Math.PI - hA : hA), [0, -0.25]), W(70), W(60));
  if (fr.includes('beard')) X.icicles(hF([[-0.08, 0.46], [0.12, 0.54], [0.3, 0.48]]), 6, W(40), W(5));
  if (o.afterHead) o.afterHead(res);
  if (o.chinIce !== false && !fr.includes('beard')) for (const [u, v, l] of [[0.1, 0.52, 18], [0.22, 0.5, 26]]) X.icicle(hF([[u, v]])[0], W(l), W(4.5));

  // near arm last (in front)
  if (o.beforeNear) o.beforeNear(res);
  if (J.SF && o.farArmBehind === false) res.gF = arm(J.SF, J.EF, J.WF, 'f', o.handF, true);
  if (J.SN) res.gN = arm(J.SN, J.EN, J.WN, 'n', o.handN, false);
  if (o.afterNear) o.afterNear(res);
  return res;
}

// a dense mat of wet fur that froze where it hung: clumped ropes along an edge, each hanging plumb and ending in an
// icicled tag. edge: polyline (screen); n ropes; len max length; w width; col fur colour.
function furFringe(f, X, edge, n, len, w, col, o = {}) {
  const C = spline(edge, 3), L = C.length, tags = [];
  for (let k = 0; k < n; k++) { const t = (k + 0.15 + f.r() * 0.7) / n; tags.push([C[Math.min(L - 1, Math.floor(t * (L - 1)))], len * (0.4 + f.r() * 0.6), w * (0.75 + f.r() * 0.55)]); }
  tags.sort((a, b) => a[1] - b[1]); // short ones behind, long ones in front
  for (const [p, l, ww] of tags) {
    // (independent review) a hank of wet fur, not a cone: a broad root that holds together to about half its length,
    // then parts into two or three locks of different length, each tapering to a blunt clumped end (some to a frozen
    // point), with its own strands; hung plumb
    const sway = (f.r() - 0.5) * ww * 0.5, c0 = mix(col, '#000', f.r() * 0.18);
    const LK = { fill: c0, shadow: o.shadow || mix(col, '#1c2230', 0.45), light: o.light || mix(col, '#fff', 0.35), shade: 0.3, inkW: 0.9, inkHeavy: 1.4, cast: false, tex: o.tex, texOp: 0.55, k: 1, maxShade: ww * 0.3 };
    const pr = add(p, [0, (f.r() - 0.3) * ww * 0.9]); // roots at uneven heights, so the fringe never reads as a row
    const nl = ww > 22 ? 2 + (f.r() < 0.5 ? 1 : 0) : 2, order = [...Array(nl).keys()].sort(() => f.r() - 0.5);
    for (const j of order) {
      const u = j / (nl - 1) - 0.5, lw = ww * (0.78 - nl * 0.1) * (0.8 + f.r() * 0.4), ll = l * (0.45 + f.r() * 0.55), sharp = f.r() < (o.sharp ?? 0.2);
      const top = add(pr, [u * ww * 0.45, -ww * 0.4]), tip = add(pr, [u * ww * (0.6 + f.r() * 0.6) + sway, ll]);
      const pts = [add(top, [-lw * 0.6, 0]), add(top, [lw * 0.6, 0]), add(lerp(top, tip, 0.45), [lw * 0.46, 0]), add(lerp(top, tip, 0.8), [lw * 0.3, 0]), sharp ? [...tip, 1] : add(tip, [lw * 0.14, -lw * 0.1]), sharp ? null : add(tip, [-lw * 0.16, -lw * 0.04]), add(lerp(top, tip, 0.8), [-lw * 0.28, 0]), add(lerp(top, tip, 0.45), [-lw * 0.46, 0])].filter(Boolean);
      f.part(pts, Object.assign({}, LK, { fill: mix(c0, j % 2 ? '#000' : '#fff', 0.05) }));
      f.line([add(top, [lw * 0.1, 4]), add(lerp(top, tip, 0.6), [lw * 0.08, 0]), add(tip, [0, -lw * 0.3])], 0.9, mix(col, '#fff', 0.4), { op: 0.6 });
      f.line([add(top, [-lw * 0.24, 4]), add(lerp(top, tip, 0.7), [-lw * 0.16, 0])], 0.9, mix(col, '#1c2230', 0.55), { op: 0.6 });
      if (f.r() < (o.ice ?? 0.45) / nl) X.icicle(add(tip, [0, -3]), ll * 0.25 + 4, Math.max(3, lw * 0.3));
    }
  }
}

// a sea louse (a pale isopod about a thumb long): segmented oval shell, many legs, a dark gut line. c centre, a heading
// angle, s length px. o.frozen draws it white under rime.
function louse(f, c, a, s, o = {}) {
  const F = frame(c, a, s), col = o.frozen ? '#dfe7ec' : (o.col || '#b9c3c8'), lw = Math.max(1, s * 0.05);
  for (let i = 0; i < 7; i++) { const x = -0.34 + i * 0.12, bend = (i - 3) * 0.06; for (const sg of [-1, 1]) f.line(F([[x, sg * 0.22], [x + 0.06 + bend, sg * 0.5], [x - 0.04 + bend * 1.6, sg * 0.72]]), lw, '#20222a', { op: 0.85 }); }
  f.line(F([[0.48, -0.08], [0.72, -0.3], [0.86, -0.32]]), lw * 0.9, '#20222a', { op: 0.75 }); f.line(F([[0.48, 0.08], [0.72, 0.3], [0.86, 0.32]]), lw * 0.9, '#20222a', { op: 0.75 });
  f.line(F([[-0.5, -0.06], [-0.66, -0.16]]), lw, '#20222a', { op: 0.7 }); f.line(F([[-0.5, 0.06], [-0.66, 0.16]]), lw, '#20222a', { op: 0.7 }); // the tail fans (uropods)
  f.part(F([[-0.52, 0], [-0.44, -0.2], [-0.1, -0.29], [0.25, -0.27], [0.48, -0.15], [0.56, 0], [0.48, 0.15], [0.25, 0.27], [-0.1, 0.29], [-0.44, 0.2]]), { fill: col, shadow: '#4e5868', light: '#f2f6f8', shade: 0.45, inkW: Math.max(0.8, s * 0.045), inkHeavy: Math.max(1, s * 0.07), cast: false, hatch: false, opacity: o.frozen ? 1 : 0.9 });
  for (let i = 1; i < 7; i++) { const x = -0.44 + i * 0.13; f.line(F([[x, -0.26], [x + 0.03, 0], [x, 0.26]]), Math.max(0.6, s * 0.03), '#3e4652', { op: 0.65 }); }
  if (!o.frozen) f.line(F([[-0.42, 0], [0.4, 0]]), Math.max(0.9, s * 0.07), '#121116', { op: 0.75 }); // the gut line
  f.flat(F(ell([0.1, -0.13], 0.16, 0.05, 0, 6)), '#f6f9fb', { op: 0.55 });
  if (o.frozen) f.flat(F(ell([0, 0], 0.5, 0.28, 0, 10)), '#eef3f6', { op: 0.35 });
}

// a clay pipe stem from a mouth point, frozen in the teeth
function clayPipe(f, X, p, a, s) {
  const F = frame(p, a, s);
  f.part(F([[0, -2.2], [70, -1.6], [70, 1.6], [0, 2.2]]), { fill: '#d8d2c2', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  f.part(F([[66, -4], [70, -18], [84, -20], [86, -4], [78, 3], [68, 2]]), { fill: '#cfc8b6', shadow: '#7a7468', shade: 0.4, inkW: 1.1, cast: false, hatch: false });
  f.flat(F([[71, -17], [83, -18], [82, -14], [72, -14]]), '#2a2826');
  X.icicle(F([[78, 3]])[0], 10 * s, 3);
}


// wet fur texture (registered once per figure as 'wfur' + seed): clumped strands combed downward and back
function furTex(f) {
  const s = f.o.seed, r = f.r; let fu = '';
  for (let i = 0; i < 46; i++) { const x = r() * 40, y = r() * 40, a = 1.45 + (r() - 0.5) * 0.6, l = 6 + r() * 9; fu += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(Math.cos(a) * l * 0.5 + 1.5).toFixed(1)},${(Math.sin(a) * l * 0.5).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" fill="none" stroke="${r() > 0.45 ? INK : '#eef2f2'}" stroke-width="${(0.8 + r() * 0.6).toFixed(1)}" opacity="${r() > 0.5 ? 0.5 : 0.4}"/>`; }
  f.defs.push(`<pattern id="wfur${s}" patternUnits="userSpaceOnUse" width="40" height="40">${fu}</pattern>`);
  return 'wfur' + s;
}
function offsetLine(pts, off) {
  const n = pts.length;
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)); return add(p, mul([-d[1], d[0]], off(i / (n - 1)))); });
}
// a clump of wet fur along path (root to tip): dark gap, tapered body, strands converging on the tip (after kit_IX)
function hairClump(f, path, w, o = {}) {
  const pal = o.pal, b0 = o.base || pal[Math.floor(f.r() * pal.length)];
  const tw = t => Math.sin(Math.PI * (0.1 + 0.85 * t)) * (t < 0.15 ? 0.6 + t * 2.6 : 1);
  if (o.gap !== false) f.stroke(path, w + 4, INK, { op: o.gapOp ?? 0.7 });
  f.stroke(path, w, b0);
  const n = o.n || Math.max(3, Math.round(w / 6));
  for (let k = 0; k < n; k++) {
    const s2 = (k / (n - 1) - 0.5) * w * 0.7, j = (f.r() - 0.5) * 3;
    const pts = offsetLine(path, t => (s2 + j) * tw(t) * 0.95);
    f.line(pts.slice(Math.floor(f.r() * 2), pts.length - Math.floor(f.r() * 2)), 0.7 + f.r() * 1.0, f.r() > 0.45 ? mix(b0, '#000', 0.45) : mix(b0, '#ffffff', 0.35), { op: 0.75 });
  }
}

// rime laid on in broken drifts rather than one even band: the edge split into runs of uneven length and depth with
// gaps between them (the wind packs it in some places and scours it off others)
function rimeBroken(f, X, pts, d, out = -1, o = {}) {
  const C = spline(pts, 4), n = C.length; let i = 0;
  while (i < n - 3) {
    const run = 18 + Math.floor(f.r() * 30), gap = f.r() < (o.gaps ?? 0.3) ? 2 + Math.floor(f.r() * 4) : 0, seg = C.slice(i, Math.min(n, i + run + 1));
    const k = Math.max(1, Math.round(d * 1.4 / 4)), sp = seg.filter((_, j) => j % k === 0 || j === seg.length - 1);
    if (sp.length >= 3) X.rime(sp, d * (0.6 + f.r() * 0.6), out, o);
    i += run + gap;
  }
}

module.exports = { WORLD, SKIN, deg, angOf, armProfile, shinProfile, mShin, freeFoot, shirtPattern, sailor, furFringe, louse, clayPipe, furTex, offsetLine, hairClump, rimeBroken };
