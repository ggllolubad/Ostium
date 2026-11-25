// THE VESSEL, the secret seventh calling (bible/hero_vessel.md with its Director note 2026-11-23; LORE_CHANGES item 3).
// Hero tier, human 1.0, 6.4 heads, faces right. The Prismatic Elementalist (dirAC.js) after taking the Mother of Courses'
// place: the same person (face, build, proportions), now read as a living icon rather than a poor pilgrim.
// - Hieratic stillness: almost frontal at three-quarter, weight even, head level with the chin a touch raised, the gaze
//   calm and forward; both hands open at waist height with the palms turned out (the orans of old icons), so the inked
//   palms face us. A tall, still, near-symmetric column with the long sleeves hanging, unlike every hunched sibling.
// - Dress: undyed, but a vestment: full-length robe, long wide sleeves, a cowl lying back over the shoulders, a long
//   scapular down the front, heavy sculptural vertical folds; a plain cord knotted once with long even tails. Worn thin
//   only as a faint translucency at the hem and sleeve edges. The company's lead badge on a cord at the throat and the
//   rubric strip at one wrist.
// - The six inks (vermilion, cold pale blue, ochre-gold, indigo, sick olive, violet-black) are dyes written into the skin
//   in bands from the fingertips like an illuminated page: each rule gilded with a hairline of gold leaf, faint script in
//   the bands; they climb the arms and throat to the jaw; the face is bare. The course stacks sit on their bands like seals.
// - A faint, broken six-part nimbus behind the head, one arc per ink, gold-edged, on its own bone. An ink ring, no glow.
// - Serene, ageless face with clean planes, cropped close like a tonsure; colourless eyes; a faint warm-cool light up
//   into the face from the inks below. Bare feet, clean and planted.
// Rendered with kit.base exactly as the six heroes. Rigged from the start: joints first, f.bone() before every part.
// Figures: vessel (battle idle), vessel_rest (Guesthouse: asleep standing), vessel_garth (standing in the garth, one hand
// on the breast), vessel_portrait (600 x 600, head in the upper half framed by the nimbus, one inked palm raised to us).
'use strict';
const V = require('./kit_vessel');
const { K, E, B, G, INK, rubric, KK, SKIN, GAP, GOLD, GOLDD, INK6, bandCol, clipDraw, bandedLimb, hand6, STACK } = V;
const { TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig, norm } = E;
const { split, side, elb, glow } = KK;
const [W, H_] = TIERS.human;

// undyed vestment: natural cream-grey fleece; the scapular from a darker fleece; linen beneath
const P = {
  wool: '#aaa087', woolD: '#8c826c', woolL: '#c4baa1', woolT: '#ddd3bb', scap: '#958a72', scapD: '#7a705c', linen: '#d4cbb2', linenD: '#a0977f',
  cord: '#8e8062', lead: '#74777b', valley: '#3e3230', hair: '#8a8170',
};
const T = (f, n) => n + f.o.seed;
const WL = (f, o = {}) => Object.assign({ fill: P.wool, tex: T(f, 'weave'), texOp: 0.4, grime: false }, o);
const SKL = (f, o = {}) => Object.assign({ fill: SKIN, tex: T(f, 'mottle'), texOp: 0.45, grime: false }, o);
const smoothD = pts => E.smooth(pts, true);

// a deep fold valley carved in heavy cloth: a tapering trough in shadow, crosshatched, its crease inked, the lit ridge
// beside it on the light's side. pts run along the fold; w: its widest.
function valley(f, pts, w, o = {}) {
  const n = pts.length, L = [], R = [], Lt = norm(f.o.light);
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = norm(sub(b, a)), nn = [-d[1], d[0]], t = i / (n - 1);
    const ww = w * Math.sin(Math.PI * (0.06 + 0.88 * t)) * (o.taper === 'down' ? 0.45 + t * 0.7 : 1) / 2;
    L.push(add(pts[i], mul(nn, ww))); R.push(add(pts[i], mul(nn, -ww)));
  }
  const poly = [...L, ...R.reverse()], d = smoothD(poly);
  f.flat(poly, P.valley, { op: o.op ?? 0.42 });
  clipDraw(f, d, () => { const bb = E.bbox(poly); for (let x = bb[0] - 60; x < bb[2] + 10; x += 3.2) f.line([[x, bb[3] + 4], [x + (bb[3] - bb[1]) * 0.75 + 8, bb[1] - 4]], 0.9, INK, { straight: true, op: 0.42 }); });
  f.line(pts, o.core ?? 1.4, INK, { op: 0.7 });
  const d0 = norm(sub(pts[n - 1], pts[0])), nn = [-d0[1], d0[0]], sg = (nn[0] * Lt[0] + nn[1] * Lt[1]) > 0 ? 1 : -1;
  f.line(pts.map((p, i) => add(p, mul(nn, sg * (w * 0.62 * Math.sin(Math.PI * (0.1 + 0.8 * i / (n - 1))) + 1.5)))), o.ridge ?? 1.8, P.woolT, { op: 0.6 });
}
const pool = (f, c, rx, ry, col, op) => glow(f, c, rx, ry, col, op);
// a soft edge where the wool is worn thin: the edge lighter and a little translucent, never torn
function thinEdge(f, pts, w = 5) { f.line(pts, w, P.woolT, { op: 0.35 }); f.line(pts.map(q => add(q, [0, -w * 0.6])), 1, P.woolT, { op: 0.5 }); }

// the nimbus: a broken ring of six arcs, one per ink in the spec's order, each a band of dye between gold hairlines,
// broken twice more along its length; quiet (no glow, no rays)
function nimbus(f, c, r, o = {}) {
  const w = o.w ?? 4.5, a0 = o.start ?? 2.6, seg = Math.PI * 2 / 6, op = o.op ?? 0.62;
  for (let i = 0; i < 6; i++) {
    const s0 = a0 + i * seg + 0.09, s1 = a0 + (i + 1) * seg - 0.09, br = s0 + (s1 - s0) * (0.35 + f.r() * 0.3);
    for (const [u0, u1] of [[s0, br - 0.035], [br + 0.035, s1]]) {
      const arc = rr => { const p = []; for (let k = 0; k <= 10; k++) { const t = u0 + (u1 - u0) * k / 10; p.push(add(c, [Math.cos(t) * rr, Math.sin(t) * rr * (o.squash ?? 1)])); } return p; };
      f.line(arc(r), w, INK6[i], { op });
      f.line(arc(r), w * 0.45, mix(INK6[i], '#fff', 0.25), { op: op * 0.5 });
      f.line(arc(r - w / 2 - 0.6), 0.8, GOLD, { op: 0.85 }); f.line(arc(r + w / 2 + 0.6), 0.8, GOLD, { op: 0.85 });
    }
  }
  f.line([[c[0] - r * 0.02, c[1]], [c[0] + r * 0.02, c[1]]], 0.1, GOLD, { op: 0 });
}

// ------------------------------------------------------------------ the head, shared by the figure and the portrait
// The Elementalist's face made ageless and serene: clean planes on the brow, cheekbone, cheek, jaw and chin, the mouth
// calm, no lines of strain; the head cropped close like a tonsure; colourless eyes (iris and pupil the white of the eye,
// rimmed in a fine ink line); a faint warm-cool light up into the face from the inks below and in front.
function vesselHead(f, HC, H, hA, o = {}) {
  const skin = SKIN, crop = mix(skin, '#a8a296', 0.4), dk = '#3a1e16', lt = '#fff3d8';
  const hf0 = frame(HC, hA, H);
  f.part(hf0([[-0.3, -0.42], [-0.44, -0.22], [-0.46, 0.02], [-0.4, 0.16], [-0.28, 0.12], [-0.2, -0.1]]), SKL(f, { fill: crop, hatch: false }));
  const eyeW = '#d6cfc0', jaw = 0.94, chin = 0.0;
  const hf = B.head(f, HC, H, hA, {
    skin, jaw, chin, nose: 1.06, hook: 0.16, mouth: 'set', squint: o.closed ? 0 : 0.36, browDown: -0.04, faceShade: o.faceShade ?? 0.72, faceHatch: false,
    blind: !!o.closed, iris: eyeW, eyeWhite: eyeW, hairCol: P.hair, browCol: '#8a8276', browW: 0.034, jawShade: 0.3, lips: true,
  });
  const P1 = q => hf([q])[0], face = [[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32, 0.37], [0.29, 0.47], [0.13, 0.535], [-0.055, 0.468], [-0.2, 0.27], [-0.30, 0.08], [-0.37, -0.13]];
  // planes modelled with soft transitions, held inside the face: brow ridge, eye socket, cheekbone, the turn from cheek to
  // jaw, the nasolabial fold, the lips, the chin; then the warm-cool light from the inks below and in front
  clipDraw(f, smoothD(hf(face)), () => {
    glow(f, P1([0.12, -0.36]), H * 0.18, H * 0.1, lt, 0.35); // forehead
    glow(f, P1([0.17, -0.18]), H * 0.15, H * 0.045, lt, 0.4); // brow ridge
    glow(f, P1([0.13, -0.07]), H * 0.1, H * 0.06, dk, 0.32); // eye socket, soft
    glow(f, P1([0.12, 0.03]), H * 0.12, H * 0.06, lt, 0.4); // cheekbone
    glow(f, P1([0.08, 0.22]), H * 0.13, H * 0.1, dk, 0.22); // the cheek turning under the bone
    glow(f, P1([-0.08, 0.32]), H * 0.13, H * 0.12, dk, 0.22); // the jaw's side plane
    glow(f, P1([0.25, 0.25]), H * 0.06, H * 0.03, dk, 0.32); // the upper lip in shadow under the nose
    glow(f, P1([0.26, 0.42]), H * 0.07, H * 0.05, lt, 0.45); // the chin's lit pad
    glow(f, P1([0.24, 0.5]), H * 0.36, H * 0.26, '#f2a45a', 0.24); // up-light from the inks: warm from below
    glow(f, P1([0.36, 0.12]), H * 0.22, H * 0.36, '#9cc0dc', 0.18); // and cool from in front
    f.line(hf([[0.27, 0.14], [0.245, 0.2], [0.23, 0.255]]), 1.6, dk, { op: 0.16 }); f.line(hf([[0.268, 0.14], [0.243, 0.2], [0.228, 0.255]]), 0.8, dk, { op: 0.35 }); // the nasolabial fold, soft
    f.line(hf([[0.255, 0.14], [0.232, 0.2], [0.218, 0.25]]), 1.2, lt, { op: 0.25 });
  });
  // the mouth: a calm, closed, defined line; the lower lip catching the light; the soft crease under it
  f.line(hf([[0.18, 0.281], [0.24, 0.277], [0.3, 0.279]]), Math.max(1.1, H * 0.011), INK, { op: 0.8 });
  f.line(hf([[0.2, 0.302], [0.25, 0.305], [0.29, 0.3]]), Math.max(1.2, H * 0.014), lt, { op: 0.5 });
  f.line(hf([[0.22, 0.345], [0.26, 0.338], [0.29, 0.344]]), 0.8, INK, { op: 0.28 });
  if (o.closed) {
    f.line(hf([[0.055, -0.052], [0.11, -0.04], [0.17, -0.05]]), 1.6, INK);
    f.line(hf([[0.07, -0.07], [0.12, -0.075], [0.165, -0.068]]), 0.8, mix(skin, '#000', 0.4), { op: 0.5 });
    f.line(hf([[0.275, -0.055], [0.3, -0.05], [0.312, -0.056]]), 1.2, INK);
  } else {
    f.line(hf(ell([0.135, -0.056], 0.017, 0.018, 0, 10).concat([ell([0.135, -0.056], 0.017, 0.018, 0, 10)[0]])), 0.7, INK, { op: 0.7 });
    f.flat(hf(ell([0.13, -0.066], 0.005, 0.004, 0, 6)), '#fbf8f0', { op: 0.9 });
    f.line(hf([[0.294, -0.07], [0.3, -0.058]]), 0.6, INK, { op: 0.55 });
  }
  // the crop, close as a tonsure: the scalp reads through a light film and fine stubble
  f.part(hf([[-0.4, 0.1], [-0.45, -0.16], [-0.36, -0.42], [-0.1, -0.56], [0.16, -0.53], [0.3, -0.41], [0.26, -0.37], [0.14, -0.44], [-0.02, -0.43], [-0.15, -0.38], [-0.22, -0.2], [-0.25, 0.0], [-0.32, 0.12]]), { fill: '#9a9386', tex: T(f, 'mottle'), texOp: 0.4, inkW: 0, cast: false, shade: 0.4, hatch: false, opacity: 0.45 });
  const n = Math.round(90 * (H / 96) ** 1.2), ds = 0.006 * Math.min(1, 96 / H) ** 0.5;
  for (let i = 0; i < n; i++) { const u = -0.43 + f.r() * 0.7, v = -0.55 + f.r() * 0.6; if ((v > -0.38 && u > 0.06) || (v > -0.2 && u > -0.21) || u * u / 0.2 + (v + 0.1) ** 2 / 0.22 > 1) continue; f.flat(hf(ell([u, v], ds, ds, 0, 5)), i % 3 ? '#b8b2a6' : '#5e5a54', { op: 0.5 }); }
  for (let i = 0; i < 12; i++) { const t = i / 11, q = [0.28 - t * 0.5, -0.4 + Math.sin(t * Math.PI) * -0.04 + t * 0.03]; f.line(hf([q, [q[0] - 0.01, q[1] + 0.022]]), 0.7, '#b8b2a6', { op: 0.5 }); }
  return hf;
}
// The throat, short and modelled in its own skin first (the nape rising into the skull, the long neck muscle lit on one
// side and shadowed on the other, the larynx, the tendon under the jaw, the collarbone notch); then the violet-black laid
// over it as a translucent stain, its top edge a ruled, gold-hairlined line just under the jaw.
// Nb: centre of the neck's base; k: scale (1 at 96 px heads). Returns where the void seal sits, on the side of the neck.
function vesselNeck(f, Nb, HC, H, hA, o = {}) {
  const k = H / 96, wd = o.wide ?? 1.15, R = (u, v) => add(HC, rot([u * H, v * H], hA)), N = (x, y) => add(Nb, [x * k * wd, y * k]);
  const neck = [N(-20, 10), N(-21, 2), N(-19, -10), R(-0.2, 0.18), R(-0.26, 0.06), R(-0.1, 0.0), R(0.08, 0.3), R(0.14, 0.47), N(19, -16), N(17, -8), N(14, 1), N(15, 10)];
  const d0 = f.part(neck, SKL(f, { k: 0.9 }));
  const lt = mix(SKIN, '#fff3d8', 0.45), dk = mix(SKIN, '#3a1e16', 0.55), scm = [R(-0.13, 0.3), lerp(R(-0.13, 0.3), N(11, -2), 0.5), N(11, -2)];
  const rule = [R(-0.27, 0.34), R(-0.12, 0.45), R(0.02, 0.53), R(0.16, 0.585)];
  clipDraw(f, d0, () => {
    glow(f, lerp(scm[1], N(-10, -4), 0.4), 9 * k, 16 * k, lt, 0.35); // the lit side of the neck
    f.line(scm.map(q => add(q, [-1.8 * k, -0.6 * k])), 2.6 * Math.min(1.6, k), lt, { op: 0.5 });
    f.line(scm.map(q => add(q, [1.6 * k, 0.6 * k])), 1.6 * Math.min(1.6, k), dk, { op: 0.5 });
    f.line([R(-0.18, 0.24), lerp(R(-0.18, 0.24), N(-12, 0), 0.5), N(-12, 2)], 0.9, dk, { op: 0.4 });
    f.line([R(0.0, 0.42), lerp(R(0.0, 0.42), N(4, -12), 0.6)], 1, dk, { op: 0.45 }); // the tendon under the jaw
    f.part(ell(N(16, -13), 3.4 * k, 5.2 * k, 0.2, 10), SKL(f, { shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false })); // the larynx
    f.flat(ell(add(N(15, -14), [-1 * k, -1.5 * k]), 1.3 * k, 2 * k, 0.2, 8), lt, { op: 0.6 });
    f.line([N(9, 2), N(13, -3), N(17, 2)], 1.1, dk, { op: 0.7 }); // the collarbone notch
    for (let i = 0; i < 3; i++) { const a = N(11 - i * 2, -5 - i * 6); f.line([a, add(a, [4 * k, -1 * k]), add(a, [7 * k, -3 * k])], 0.8, dk, { op: 0.4 }); }
    // the stain, below its ruled line
    const below = [...rule, add(rule[3], [60 * k, 160 * k]), add(rule[0], [-60 * k, 160 * k])];
    clipDraw(f, smoothD(below.map(q => [q[0], q[1], 1])), () => V.inkOver(f, [neck], 5));
    f.line(rule.map(q => add(q, [0, 1.4 * k])), 0.7, mix(INK6[5], INK, 0.3), { op: 0.5 });
    f.line(rule, Math.max(0.9, 0.6 * k), GOLD, { op: 0.9 });
    V.script(f, [N(-14, -6), N(-8, -8), N(-2, -9), N(4, -9), N(9, -8)], [0, 1], mix(INK6[5], INK, 0.2), k);
  });
  return { void: N(o.voidAt ? o.voidAt[0] : -13, o.voidAt ? o.voidAt[1] : -14) };
}
// a long wide sleeve's lower half: from the elbow along the forearm to a mouth at `t`, its wool hanging below in a bell
// down to `drop` px under the mouth. Returns the mouth's centre.
function sleeveBell(f, E0, W0, t, drop, o = {}) {
  const d = norm(sub(W0, E0)); let nn = [-d[1], d[0]]; if (nn[1] > 0) nn = mul(nn, -1); // nn points up
  const inw = o.inward ?? 1, M = lerp(E0, W0, t), hw = o.hw ?? 32, top = add(M, mul(nn, hw)), bot = add(M, mul(nn, -hw));
  const low = add(bot, [(o.lean ?? 0), drop]), low2 = add(low, [inw * (o.width ?? 40), -6]);
  const back = add(E0, add(mul(nn, -hw * 0.6), [inw * 6, 16]));
  const pts = [add(add(E0, mul(d, -16)), mul(nn, hw * 0.9)), lerp(add(E0, mul(nn, hw)), top, 0.5), top, [...add(M, mul(d, 5)), 0], bot,
    add(lerp(bot, low, 0.5), [-inw * 4, 0]), add(low, [0, -6]), [...low, 1], lerp(low, low2, 0.5), [...low2, 1], add(lerp(low2, back, 0.5), [inw * 2, 0]), back];
  f.part(pts, WL(f, { fill: o.fill || P.wool, maxShade: 30 }));
  // carved folds down the hanging wool, and the soft worn edge of the mouth and hem
  const mid = lerp(bot, back, 0.45);
  valley(f, [mid, lerp(mid, lerp(low, low2, 0.45), 0.5), add(lerp(low, low2, 0.45), [0, -6])], 12, { op: 0.45 });
  valley(f, [add(lerp(bot, mid, 0.4), [0, 8]), add(low, [inw * 6, -18])], 8, { op: 0.32, ridge: 1.3 });
  valley(f, [add(back, [-inw * 4, 10]), add(low2, [-inw * 6, -12])], 8, { op: 0.36, ridge: 1.3 });
  f.flat(ell(M, 7, hw * 0.9, Math.atan2(d[1], d[0]), 12), '#1e1a16', { op: 0.78 }); // the mouth
  thinEdge(f, [top, add(M, mul(d, 5)), bot], 3);
  thinEdge(f, [add(low, [0, -6]), low, lerp(low, low2, 0.5), low2], 3);
  return M;
}

// ------------------------------------------------------------------ THE VESSEL (figure)
function vessel(pose = 'battle', seed = 7000) {
  const f = new Fig(K.base(seed, { groundY: H_ - 30 }));
  const H = 96, gy = f.o.groundY, viol = bandCol(5);
  const rest = pose === 'rest', garth = pose === 'garth', battle = pose === 'battle';
  // ---- hieratic: the spine plumb over even feet, shoulders level
  const N = [298, 284], C = [298, 380], P0 = [298, 474], S = B.spine(N, C, P0, H);
  const SN = [238, 302], SF = [358, 300];
  const HC = rest ? [306, 220] : [304, 216], hA = rest ? 0.12 : garth ? -0.08 : -0.05;
  const HN = [282, 480], HF = [314, 478], KN = [282, 624], KF = [316, 622], AN = [280, 762], AF = [318, 760];
  let EN, WN, EF, WF, aN, aF;
  if (battle) { EN = [226, 438]; WN = [172, 406]; EF = [370, 436]; WF = [426, 402]; aN = -1.95; aF = -1.2; }
  if (rest) { EN = [230, 442]; WN = [214, 520]; EF = [366, 440]; WF = [382, 518]; aN = 1.85; aF = 1.3; }
  if (garth) { EN = [234, 432]; WN = [272, 368]; EF = [370, 436]; WF = [426, 402]; aN = -0.85; aF = -1.2; }
  const WB = [298, 454], Nb = [298, 280], NIM = add(HC, rot([-6, -4], hA));
  const stacks = {}, sAng = {};
  const faN = Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), faF = Math.atan2(WF[1] - EF[1], WF[0] - EF[0]);
  const elbN = elb(SN, EN, WN), elbF = elb(SF, EF, WF);

  // ---- skeleton
  f.joint('pelvis', P0).joint('torso', [298, 460], 'pelvis').joint('head', Nb, 'torso').joint('nimbus', NIM, 'head').joint('skirt', WB, 'pelvis');
  f.joint('upperarm_n', SN, 'torso').joint('forearm_n', EN, 'upperarm_n').joint('hand_n', WN, 'forearm_n');
  f.joint('upperarm_f', SF, 'torso').joint('forearm_f', EF, 'upperarm_f').joint('hand_f', WF, 'forearm_f');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n');
  f.joint('thigh_f', HF, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f');
  f.joint('cord_tails', [262, 458], 'pelvis').joint('badge', [312, 332], 'torso').joint('rubric', lerp(EN, WN, 0.82), 'forearm_n').joint('hood', [262, 280], 'torso');

  // ================= NIMBUS (behind everything at the head)
  f.bone('nimbus');
  nimbus(f, NIM, 76, { w: 4.5, op: 0.6 });

  // ================= LEGS (hidden under the vestment; for the rig) and the bare feet, clean and planted
  for (const [sfx, Hp, Kn, A] of [['_f', HF, KF, AF], ['_n', HN, KN, AN]]) {
    f.bone('thigh' + sfx); f.part(limb(Hp, Kn, 46, 34, { steps: 8, q: [[0.3, 0.12, 0.2]] }), SKL(f));
    f.bone('shin' + sfx); f.part(limb(Kn, lerp(Kn, A, 0.8), 32, 24, { steps: 8, p: [[0.25, 0.15, 0.2]] }), SKL(f));
  }
  const ankleCut = A => side(A, [0.45, 0.89], 16), shinCut = A => side(A, [-0.45, -0.89], 16);
  const legLook = (o = {}) => SKL(f, Object.assign({ shadow: '#7a5a4c' }, o));
  split(f, () => K.bareLeg(f, lerp(KF, AF, 0.72), AF, 1, 44, 24, legLook({ fill: mix(SKIN, '#7a6a60', 0.1) })), [['shin_f', shinCut(AF)], ['foot_f', ankleCut(AF)]]);
  split(f, () => K.bareLeg(f, lerp(KN, AN, 0.72), AN, 1, 45, 25, legLook()), [['shin_n', shinCut(AN)], ['foot_n', ankleCut(AN)]]);

  // ================= THE HOOD lying back behind the neck, and the far arm's upper sleeve (behind the body)
  f.bone('hood');
  f.part([[264, 266], [246, 260], [230, 274], [224, 300], [236, 318], [258, 306], [276, 288]], WL(f, { fill: P.woolD }));
  valley(f, [[244, 268], [236, 288], [240, 308]], 8, { op: 0.4 });
  f.bone('upperarm_f');
  bandedLimb(f, [add(SF, [0, -6]), EF], [36, 30], 5, [[E.len(sub(EF, SF)) - 40, 4]], SKL(f), { script: false });
  f.part(K.chain([add(SF, [-6, -10]), lerp(SF, EF, 0.5), EF], [46, 58, 64]), WL(f, { fill: P.woolD }));

  // ================= THE VESTMENT: one full-length shape, cut at the cord; heavy, carved, vertical folds
  const robe = [[262, 286], [240, 296], [226, 318], [222, 360], [228, 410], [236, 452], [230, 500], [222, 600], [214, 700], [206, 786, 1],
    [226, 790], [248, 786], [268, 788], [286, 772], [300, 762], [318, 765], [336, 757], [354, 761], [372, 772], [392, 788, 1],
    [388, 700], [382, 600], [374, 500], [362, 452], [368, 410], [376, 360], [374, 318], [360, 296], [336, 286]];
  split(f, () => f.part(robe, WL(f, { maxShade: 28 })), [['skirt', side([298, 420], [0, 1])], ['torso', side(WB, [0, -1])]]);
  f.bone('skirt');
  pool(f, [262, 600], 30, 150, '#fff4dc', 0.22); pool(f, [372, 620], 22, 150, '#120c10', 0.25);
  for (const [x0, x1, w, op] of [[240, 228, 13, 0.44], [262, 256, 11, 0.36], [352, 360, 13, 0.46], [372, 382, 10, 0.4]]) valley(f, [[x0, 464], [x0 + (x1 - x0) * 0.4, 580], [x0 + (x1 - x0) * 0.75, 680], [x1, 780]], w, { op, taper: 'down' });
  valley(f, [[280, 470], [278, 600], [276, 700], [280, 770]], 9, { op: 0.34, taper: 'down' });
  valley(f, [[248, 520], [242, 640], [236, 760]], 8, { op: 0.3, ridge: 1.4 });
  pool(f, [300, 560], 16, 160, '#fff4dc', 0.12);
  // the hem: lying in soft breaks over the feet, a faint translucency where it is worn thin
  for (const [a, b, c] of [[[214, 776], [228, 770], [242, 778]], [[250, 778], [262, 770], [272, 780]], [[358, 760], [370, 766], [380, 780]]]) f.stroke([a, b, c], 1.3);
  thinEdge(f, [[210, 784], [248, 782], [286, 768], [318, 761], [354, 758], [388, 784]], 5);
  clipDraw(f, 'M206,764 L392,764 L392,792 L206,792 Z', () => { // the feet faintly through the thin hem
    for (const [A, K0] of [[AN, KN], [AF, KF]]) K.bareLeg(f, lerp(K0, A, 0.72), A, 1, A === AN ? 45 : 44, 24, legLook({ opacity: 0.22, cast: false }));
  });
  f.bone('torso');
  pool(f, [252, 350], 26, 60, '#fff4dc', 0.25);
  valley(f, [[232, 330], [238, 390], [240, 446]], 9, { op: 0.38 });
  valley(f, [[364, 326], [358, 390], [356, 446]], 10, { op: 0.42 });
  for (const x of [256, 270]) valley(f, [[x, 410], [x - 1, 432], [x, 450]], 6, { op: 0.32, ridge: 1.2 }); // the cloth gathered into the cord

  // ================= THE CORD: plain, knotted once, two long even tails
  f.bone('torso');
  { const a = [234, 452], b = [362, 452], m = [298, 456];
    f.part([[a[0], a[1] - 3.5, 1], [m[0], m[1] - 3.5], [b[0], b[1] - 3.5, 1], [b[0], b[1] + 3.5, 1], [m[0], m[1] + 3.5], [a[0], a[1] + 3.5, 1]], { fill: P.cord, shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: true, tex: T(f, 'hatch'), texOp: 0.35 });
    f.line([[a[0], a[1] - 1.5], m.map((v, i) => v - (i ? 1.5 : 0)), [b[0], b[1] - 1.5]], 0.8, mix(P.cord, '#fff', 0.35), { op: 0.6 });
    f.part(ell([262, 457], 6, 5, 0.3, 10), { fill: P.cord, shade: 0.45, inkW: 1.1, inkHeavy: 1.5, cast: false }); }
  f.bone('cord_tails');
  for (const [dx, sw] of [[-2, -3], [4, 2]]) { const k0 = [262 + dx, 462], pts = [k0, add(k0, [sw * 0.4, 60]), add(k0, [sw, 130]), add(k0, [sw * 1.1, 176])]; f.stroke(pts, 6, mix(P.cord, '#000', dx < 0 ? 0.12 : 0.2)); f.line(pts.slice(0, 3).map(q => add(q, [-1.2, 0])), 0.8, mix(P.cord, '#fff', 0.3), { op: 0.5 }); const t = pts[3]; f.part(ell(add(t, [0, -2]), 3.6, 4.4, 0, 8), { fill: P.cord, shade: 0.4, inkW: 1, cast: false }); for (let j = -1; j <= 1; j++) f.line([add(t, [0, 2]), add(t, [j * 2, 9])], 0.8, mix(P.cord, '#000', 0.25), { op: 0.8 }); }

  // ================= THE SCAPULAR down the front, over the cord, cut at the waist with the robe
  split(f, () => f.part([[288, 296], [336, 296], [339, 420], [342, 600], [346, 752], [316, 758], [290, 754], [288, 600], [286, 420]], WL(f, { fill: P.scap, texOp: 0.45 })), [['skirt', side([298, 420], [0, 1])], ['torso', side(WB, [0, -1])]]);
  f.bone('skirt');
  valley(f, [[306, 470], [306, 620], [306, 760]], 7, { op: 0.32, ridge: 1.3 }); valley(f, [[326, 480], [328, 620], [330, 756]], 6, { op: 0.28, ridge: 1.2 });
  f.stitches([[291, 470], [290, 750]], mix(P.scap, '#fff', 0.35), 0.8); f.stitches([[341, 470], [344, 748]], mix(P.scap, '#fff', 0.35), 0.8);
  thinEdge(f, [[290, 756], [316, 760], [345, 754]], 3);
  f.bone('torso');
  valley(f, [[312, 330], [313, 390], [313, 444]], 6, { op: 0.28, ridge: 1.2 });
  f.stitches([[290, 330], [288, 446]], mix(P.scap, '#fff', 0.35), 0.8); f.stitches([[336, 330], [339, 446]], mix(P.scap, '#fff', 0.35), 0.8);

  // ================= THE COWL lying back over the shoulders, a U of drapery on the breast
  f.bone('torso');
  f.part([[218, 334], [222, 304], [246, 286], [268, 276], [298, 274], [330, 276], [358, 288], [378, 308], [380, 334], [362, 340], [342, 330], [320, 342], [300, 348], [278, 342], [256, 334], [236, 344]], WL(f, { fill: mix(P.wool, P.woolL, 0.25) }));
  valley(f, [[246, 300], [262, 320], [280, 334]], 8, { op: 0.4 }); valley(f, [[352, 300], [340, 320], [324, 334]], 8, { op: 0.42 });
  valley(f, [[230, 312], [232, 330]], 6, { op: 0.35, ridge: 1.2 }); valley(f, [[370, 312], [368, 330]], 6, { op: 0.35, ridge: 1.2 });
  thinEdge(f, [[236, 344], [256, 334], [278, 342], [300, 348], [320, 342], [342, 330], [362, 340]], 3);
  // the linen undertunic at the throat
  f.part([[270, 282], [286, 274], [312, 274], [328, 282], [318, 290], [298, 286], [280, 290]], { fill: P.linen, shadow: P.linenD, tex: T(f, 'weave'), texOp: 0.35, inkW: 1.1, grime: false });

  // ================= HEAD AND THROAT
  f.bone('head');
  const nk = vesselNeck(f, Nb, HC, H, hA, {});
  stacks.void = nk.void; sAng.void = -0.3;
  vesselHead(f, HC, H, hA, { closed: rest });
  // the badge on its cord at the throat, over the cowl
  f.bone('torso');
  { const bt = [312, 332], cn = [282, 284], cf = [322, 282], kn = lerp(cn, bt, 0.5);
    f.line([cn, kn, add(bt, [-3, -1])], 1.3, '#2b2119'); f.line([cf, add(cf, [-2, 20]), add(bt, [2, -2])], 1.2, '#2b2119', { op: 0.9 });
    f.part(ell(kn, 2.6, 2.1, 0.5, 8), { fill: '#3a2c20', inkW: 0.9, inkHeavy: 0, cast: false, hatch: false });
    f.bone('badge'); G.badge(f, bt, 10, P.lead, 0.0); }

  // ================= ARMS. Far (screen right): forearm out, sleeve bell hanging, palm out
  const armSide = (sfx, S0, E0, W0, a0, flip, hand) => {
    f.bone('upperarm' + sfx);
    if (sfx === '_n') { bandedLimb(f, [add(S0, [0, -6]), E0], [36, 30], 5, [[E.len(sub(E0, S0)) - 40, 4]], SKL(f), { script: false }); f.part(K.chain([add(S0, [6, -10]), lerp(S0, E0, 0.5), E0], [46, 58, 64]), WL(f)); valley(f, [lp(S0, E0, 0.25, 6), lp(S0, E0, 0.6, 4), lp(S0, E0, 0.92, 10)], 8, { op: 0.36, ridge: 1.3 }); }
    f.bone('forearm' + sfx);
    const L = E.len(sub(W0, E0));
    bandedLimb(f, [lerp(E0, W0, -0.1), W0], [30, 23], 4, [[14, 2], [30, 3]], SKL(f), { scriptK: 0.8 });
    const tM = rest ? 0.55 : 0.3; f.joint('sleeve' + sfx, lerp(E0, W0, tM), 'forearm' + sfx); f.bone('sleeve' + sfx);
    const M = sleeveBell(f, E0, W0, tM, rest ? 80 : garth && sfx === '_n' ? 110 : 150, { hw: 32, lean: sfx === '_n' ? 4 : -4, inward: sfx === '_n' ? 1 : -1, width: 38, fill: sfx === '_n' ? P.wool : mix(P.wool, P.woolD, 0.3) });
    f.bone('forearm' + sfx);
    if (sfx === '_n') { // the linen undertunic's inner cuff at this wrist only, and the rubric strip
      f.part(K.chain([lerp(E0, W0, tM - 0.04), lerp(E0, W0, tM + 0.08)], [44, 38]), { fill: P.linen, shadow: P.linenD, tex: T(f, 'weave'), texOp: 0.35, inkW: 1.1, grime: false });
      f.bone('rubric');
      const rc = mix(rubric, '#9a8a78', 0.2), r0 = lerp(E0, W0, 0.82), fa = Math.atan2(W0[1] - E0[1], W0[0] - E0[0]), nn = rot([0, 1], fa);
      f.part([add(r0, mul(nn, -12.5)), add(add(r0, mul(nn, -12)), rot([7, 0], fa)), add(add(r0, mul(nn, 12)), rot([7, 0], fa)), add(r0, mul(nn, 12.5))], { fill: rc, shade: 0.4, inkW: 1.1, inkHeavy: 1.5, cast: false, tex: T(f, 'weave'), texOp: 0.4 });
      let dn = nn[1] > 0 ? nn : mul(nn, -1); const kk = add(add(r0, mul(dn, 11)), rot([3, 0], fa));
      f.part(ell(kk, 3.6, 3, 0.3, 8), { fill: mix(rc, '#000', 0.15), inkW: 1, cast: false });
      f.part([add(kk, [-2, 2]), add(kk, [-4, 18]), add(kk, [-2, 26]), add(kk, [1, 23]), add(kk, [1, 4])], { fill: rc, shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false });
      f.part([add(kk, [1, 2]), add(kk, [4, 14]), add(kk, [7, 18]), add(kk, [5, 3])], { fill: mix(rc, '#000', 0.12), shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false });
    }
    if (sfx === '_f' && !rest) { stacks.water = lp(E0, W0, 1 - 22 / L, 0); stacks.toxin = lp(E0, W0, 1 - 38 / L, 1); sAng.toxin = Math.atan2(W0[1] - E0[1], W0[0] - E0[0]); }
    if (sfx === '_f' && rest) { stacks.water = lp(E0, W0, 1 - 22 / L, 0); }
    f.bone('hand' + sfx);
    return hand();
  };
  // far arm first (its bell hangs beside the far side of the body), then the near
  const hf_ = armSide('_f', SF, EF, WF, aF, false, () => hand6(f, WF, aF, rest ? 76 : 82, { view: 'palm', sq: 0.88, curls: rest ? [0.18, 0.24, 0.3, 0.38] : [0.02, 0.06, 0.1, 0.18], cdir: rest ? 1 : -1, spread: rest ? 0.05 : 0.11, thumb: [-0.85, 0.25], scarRing: 2 }));
  const hn_ = armSide('_n', SN, EN, WN, aN, true, () => garth
    ? hand6(f, WN, aN, 80, { view: 'back', sq: 0.8, curls: [0.04, 0.08, 0.14, 0.22], cdir: 1, spread: 0.05, thumb: [-0.6, 0.2] })
    : hand6(f, WN, aN, rest ? 76 : 82, { view: 'palm', sq: 0.88, flip: true, curls: rest ? [0.2, 0.26, 0.3, 0.4] : [0.02, 0.06, 0.1, 0.18], cdir: rest ? -1 : 1, spread: rest ? 0.05 : 0.11, thumb: [-0.85, 0.25] }));
  stacks.fire = hn_.fire; stacks.frost = hn_.frost; stacks.lightning = hn_.lightning;
  sAng.fire = -Math.PI / 2; sAng.frost = aN + Math.PI / 2; sAng.lightning = aN + Math.PI / 2;

  // ================= COURSE STACKS, sitting on their bands like seals, each its own bone (the in-breath brightens them)
  const parents = { fire: 'hand_n', frost: 'hand_n', lightning: 'hand_n', water: 'forearm_f', toxin: 'forearm_f', void: 'head' };
  const size = { fire: 6, frost: 6.2, lightning: 6.5, water: 5, toxin: 5.6, void: 4.4 };
  for (const k of ['void', 'water', 'toxin', 'fire', 'frost', 'lightning']) if (stacks[k]) f.joint('stack_' + k, stacks[k], parents[k]);
  for (const k of ['void', 'water', 'toxin', 'fire', 'frost', 'lightning']) {
    if (!stacks[k]) continue;
    f.bone('stack_' + k);
    if (k !== 'fire' && k !== 'void') f.line(ell(stacks[k], size[k] * 1.5, size[k] * 1.3, sAng[k] || 0, 18).concat([ell(stacks[k], size[k] * 1.5, size[k] * 1.3, sAng[k] || 0, 18)[0]]), 0.8, GOLD, { op: 0.75 }); // the seal's gilt ring
    STACK[k](f, stacks[k], size[k], sAng[k] ?? 0);
  }
  return f;
}

// ------------------------------------------------------------------ PORTRAIT (600 x 600)
// Head and shoulders, three-quarter, facing right: the head in the upper half framed by the nimbus, the cowl over the
// turning shoulders, the scapular and badge, and the near hand raised into the frame at chest height, palm to us, so all
// six inks read. Drawn natively at portrait scale with the same Living Ink settings.
function portrait(seed = 7003) {
  const f = new Fig(K.base(seed, { groundY: 570, grimeY: 2000 }));
  const H = 170, k = H / 96;
  const HC = [270, 194], hA = -0.04, NIM = add(HC, [-10, -6]);
  const Nb = [262, 324];
  const EN = [196, 700], WN = [410, 480], aH = -1.3;
  f.joint('torso', [270, 520], null).joint('head', Nb, 'torso').joint('nimbus', NIM, 'head').joint('badge', [292, 446], 'torso');
  f.joint('forearm_n', EN, 'torso').joint('hand_n', WN, 'forearm_n');
  f.bone('nimbus');
  nimbus(f, NIM, 132, { w: 7, op: 0.6 });
  f.bone('torso');
  // shoulders turning under the cowl: the near shoulder low and toward us, the far one falling away
  const body = [[206, 312], [146, 334], [86, 364], [44, 420], [24, 700], [600, 700], [600, 440], [556, 390], [480, 356], [400, 336], [330, 316]];
  f.part(body, WL(f, { maxShade: 30 }));
  pool(f, [140, 470], 80, 90, '#fff4dc', 0.25);
  // the scapular falling from the shoulders down the front
  f.part([[262, 400], [336, 396], [348, 700], [256, 700]], WL(f, { fill: P.scap, maxShade: 26 }));
  f.stitches([[268, 400], [264, 600]], mix(P.scap, '#fff', 0.35), 1); f.stitches([[332, 400], [340, 600]], mix(P.scap, '#fff', 0.35), 1);
  valley(f, [[300, 410], [302, 520], [304, 620]], 12, { op: 0.3, ridge: 1.4 });
  valley(f, [[110, 420], [96, 520], [92, 620]], 18, { op: 0.4 }); valley(f, [[200, 430], [206, 540], [204, 640]], 16, { op: 0.36 });
  valley(f, [[420, 420], [446, 520], [454, 620]], 18, { op: 0.45 }); valley(f, [[520, 430], [540, 520], [548, 620]], 16, { op: 0.42 });
  // the cowl lying back over the shoulders
  f.part([[44, 470], [60, 404], [104, 362], [170, 330], [226, 316], [262, 312], [318, 314], [398, 334], [474, 362], [532, 404], [556, 462], [516, 470], [458, 446], [400, 452], [344, 474], [300, 482], [250, 472], [190, 452], [126, 456], [80, 480]], WL(f, { fill: mix(P.wool, P.woolL, 0.25), maxShade: 26 }));
  for (const q of [[[170, 344], [196, 384], [222, 426]], [[420, 352], [398, 390], [376, 428]]]) valley(f, q, 14, { op: 0.38 });
  // the cowl's thick rolled front edge, its shadow cast down onto the breast and shoulders, pinched where it gathers
  { const U = [[66, 492], [126, 458], [190, 452], [250, 472], [300, 484], [344, 476], [400, 454], [458, 448], [530, 476]], ws = [24, 30, 30, 28, 26, 28, 30, 30, 24];
    f.flat(K.chain(U.map(q => add(q, [8, 18])), ws.map(w => w * 1.15)), '#1a1210', { op: 0.32 }); // cast shadow
    pool(f, [300, 540], 220, 34, '#120c10', 0.18);
    f.part(K.chain(U, ws), WL(f, { fill: mix(P.wool, P.woolL, 0.35), maxShade: 16, texOp: 0.5 }));
    const Lt = norm(f.o.light);
    for (let i = 1; i < U.length - 1; i++) { const d = norm(sub(U[i + 1], U[i - 1])), nn = [-d[1], d[0]], sg = (nn[0] * Lt[0] + nn[1] * Lt[1]) > 0 ? 1 : -1;
      const m = lerp(U[i], U[i + 1], 0.5), w = (ws[i] + ws[i + 1]) / 2; // a pinch where the roll gathers: a crease wrapping the roll
      f.stroke([add(m, mul(nn, w * 0.5)), add(add(m, mul(d, 5)), mul(nn, 0)), add(m, mul(nn, -w * 0.5))], 2.2, '#2a2020');
      f.line(U.slice(Math.max(0, i - 1), i + 2).map(q => add(q, mul(nn, sg * w * 0.28))), 2.4, P.woolT, { op: 0.45 }); }
    thinEdge(f, U.map((q, i) => add(q, [0, ws[i] * 0.45])), 3); }
  // the shoulders under the cloth: the near shoulder's round lit, the far one turning away into shade
  pool(f, [118, 392], 70, 34, '#fff4dc', 0.3); pool(f, [520, 420], 60, 60, '#120c10', 0.25);
  valley(f, [[46, 430], [86, 384], [150, 352]], 10, { op: 0.3, ridge: 1.4 }); // the shoulder's turn
  valley(f, [[556, 450], [520, 392], [460, 360]], 10, { op: 0.35, ridge: 1.4 });
  f.part([[222, 326], [246, 314], [292, 314], [318, 326], [300, 338], [262, 334], [238, 340]], { fill: P.linen, shadow: P.linenD, tex: T(f, 'weave'), texOp: 0.35, inkW: 1.3 });
  f.bone('head');
  const nk = vesselNeck(f, Nb, HC, H, hA, {});
  vesselHead(f, HC, H, hA, { faceShade: 0.5 });
  f.bone('torso');
  { const bt = [292, 446], cn = [236, 330], cf = [306, 326], kn = lerp(cn, bt, 0.5);
    f.line([cn, kn, add(bt, [-5, -2])], 2.2, '#2b2119'); f.line([cf, add(cf, [-3, 40]), add(bt, [4, -2])], 2, '#2b2119', { op: 0.9 });
    f.part(ell(kn, 4.6, 3.6, 0.5, 10), { fill: '#3a2c20', inkW: 1, inkHeavy: 0, cast: false, hatch: false });
    f.bone('badge'); G.badge(f, bt, 18, P.lead, 0.0); }
  f.joint('stack_void', nk.void, 'head'); f.bone('stack_void');
  STACK.void(f, nk.void, 4.4 * k, -0.3);
  // the near forearm rising into the frame, its wide sleeve fallen back, the hand open with the palm to us
  f.bone('forearm_n');
  const s2 = 2.0, fa = Math.atan2(WN[1] - EN[1], WN[0] - EN[0]), L = E.len(sub(WN, EN));
  bandedLimb(f, [EN, WN], [66, 50], 4, [[14 * s2 * 1.4, 2], [30 * s2 * 1.4, 3]], SKL(f, { maxShade: 22 }), { bow: 0.14, hatchStep: 7, gap: GAP * 1.6, scriptK: 1.8 });
  f.line([lp(EN, WN, 0.6, 12), lp(EN, WN, 0.92, 9)], 1, mix(bandCol(3), INK, 0.4), { op: 0.45 });
  const sl = [lp(EN, WN, -0.1, 64), lp(EN, WN, 0.46, 52), lp(EN, WN, 0.5, 0), lp(EN, WN, 0.46, -52), [lp(EN, WN, 0.46, -52)[0] - 20, 720], [lp(EN, WN, -0.1, 64)[0] - 40, 720]];
  f.part(sl, WL(f));
  valley(f, [lp(EN, WN, 0.4, -40), [lp(EN, WN, 0.4, -40)[0] - 10, 640]], 18, { op: 0.42 });
  f.flat(ell(lerp(EN, WN, 0.47), 10, 50, fa, 12), '#1e1a16', { op: 0.75 });
  thinEdge(f, [lp(EN, WN, 0.46, 52), lp(EN, WN, 0.5, 0), lp(EN, WN, 0.46, -52)], 5);
  const water = lp(EN, WN, 1 - 60 / L, -4), toxin = lp(EN, WN, 1 - 100 / L, 8);
  f.bone('hand_n');
  const h = hand6(f, add(WN, rot([-4, 0], fa)), aH, 168, { view: 'palm', sq: 0.86, curls: [0.03, 0.06, 0.12, 0.2], cdir: -1, spread: 0.12, thumb: [-0.8, 0.25] });
  for (const [s, c, sz, a, par] of [['water', water, 5 * k, 0, 'forearm_n'], ['toxin', toxin, 5.6 * k, fa, 'forearm_n'], ['fire', h.fire, 6 * k, -Math.PI / 2, 'hand_n'], ['frost', h.frost, 6.2 * k, aH + Math.PI / 2, 'hand_n'], ['lightning', h.lightning, 6.5 * k, aH + Math.PI / 2, 'hand_n']]) {
    f.joint('stack_' + s, c, par); f.bone('stack_' + s);
    if (s !== 'fire') f.line(ell(c, sz * 1.5, sz * 1.3, a, 18).concat([ell(c, sz * 1.5, sz * 1.3, a, 18)[0]]), 1, GOLD, { op: 0.75 });
    STACK[s](f, c, sz, a);
  }
  return f;
}

module.exports = {
  heroes: [
    { key: 'vessel', name: 'The Vessel', tier: 'human', w: W, h: H_, flip: false, build: () => vessel('battle', 7000) },
    { key: 'vessel_rest', name: 'The Vessel (Guesthouse rest)', tier: 'human', w: W, h: H_, flip: false, build: () => vessel('rest', 7001) },
    { key: 'vessel_garth', name: 'The Vessel (garth)', tier: 'human', w: W, h: H_, flip: false, build: () => vessel('garth', 7002) },
    { key: 'vessel_portrait', name: 'The Vessel (portrait)', tier: 'portrait', w: 600, h: 600, flip: false, build: () => portrait(7003) },
  ],
};
