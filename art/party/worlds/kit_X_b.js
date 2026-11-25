// World X, The Venom Spires, second batch: helpers for world_X_b.js. Built on kit_X (required and re-exported, never
// edited), so the batch keeps the first batch's palette, Living Ink setup and course marks.
// Lightning shows only as its marks: branching white-violet Lichtenberg burns, fused metal and joints, standing hair and
// bristles. No arcs or bolts in the air (strikes are engine effects): X.bolt, X.sparks and X.stat are never called here.
// Toxin: swelling, larvae shifting under skin, venom-green welts, pustules, grey paper comb, locked (paralysed) muscle.
// New here: modelled human limbs (muscle profiles through mchain, split at the joint for the rig), a modelled fist (the
// reviewed knuckleFist from kit_III_b), faces with the venom's paralysis (rolled eyes, clenched jaw, drooping side),
// hats and hoods, hive comb, small crawling wasps, pilgrim badges and votives.
'use strict';
const K = require('../kit');
const X = require('./kit_X');
const T3 = require('./kit_III');
const T3b = require('./kit_III_b');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side, elb } = X;

// extra palette for this batch (inside the world palette: dust grey cloth, chitin black leather, venom green, white-violet)
const P = Object.assign({}, X.P, {
  dust: '#625d54', dustD: '#3e3a34', dustL: '#8e887c', // dust grey road cloth
  felt: '#5e574c', feltD: '#2e2a24', feltL: '#847a6c', // old felt hats
  hazel: '#7a6448', hazelL: '#a8906c', hazelD: '#3e3224', // worn hazel and ash wood
  fleece: '#8a857a', fleeceD: '#4e4a44', fleeceL: '#b4ae9e', // dust grey fleece
  clay: '#7c766c', clayD: '#4a4640', clayL: '#a49e92', // termite clay, grey
  glass: '#8e88a2', glassL: '#cec6e6', glassD: '#3e3a4c', // fulgurite: sand fused to white-violet glass
  gilt: '#8a7444', giltL: '#b89e62', giltD: '#4a3c22', // dull gilt (holy: the saint's halo only)
  tin: '#8a8a8c', tinL: '#c2c2c4', tinD: '#4a4a4e',
  nymph: '#2e2a26', nymphL: '#5c544a', nymphD: '#141210', // the cicada nymph's earth-dull black shell
  adult: '#b8b49a', adultL: '#dcd8c0', adultD: '#6a6a52', // the pale swollen adult
  earth: '#4a4238', earthL: '#6e6454', earthD: '#26221c',
  stone: '#6c6862', stoneL: '#949088', stoneD: '#3a3834',
  horse: '#4a4038', horseL: '#7a6c5c', horseD: '#221c18', // a dun-black road horse, dusted
});

// material looks (kit_X keeps its own copies private): wrought iron, timber, rust, copper
const IR = (f, o = {}) => Object.assign({ fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.8 }, o);
const WD = (f, o = {}) => Object.assign({ fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.4, tex: 'wood' + f.o.seed, texOp: 0.6 }, o);
const RU = (f, o = {}) => Object.assign({ fill: P.rust, shadow: P.rustD, light: P.rustL, shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.8 }, o);
const CU = (f, o = {}) => Object.assign({ fill: P.copper, shadow: P.copperD, light: P.copperL, shade: 0.42, tex: 'pit' + f.o.seed, texOp: 0.5 }, o);
// modelled fist (the reviewed kit_III_b hand) and its grip
const knuckleFist = T3b.knuckleFist, gripK = T3b.gripK, mchain = T3.mchain;

const sc = (arr, w) => arr.map(([t, k]) => [t, k * w]);
// ---- a modelled arm, shoulder to wrist, as one outline with muscle profiles: deltoid and triceps behind, biceps in
// front, the forearm's muscle mass swelling below the elbow and tapering hard to a narrow wrist. Anatomy lines: the
// biceps edge, the forearm groove, the elbow crease and point, the wrist bone and tendons. ws = [shoulder, elbow, wrist].
// o.sfx splits it at the elbow into upperarm<sfx> / forearm<sfx>; o.build 'lean' | 'stout'; o.after(u, fa) extra marks.
function mArm(f, S0, E0, W0, ws, look, o = {}) {
  const [wS, wE, wW] = ws, dU = E.norm(sub(E0, S0)), dF = E.norm(sub(W0, E0)), nU = [-dU[1], dU[0]], nF = [-dF[1], dF[0]];
  let inU = (dF[0] * nU[0] + dF[1] * nU[1]) >= 0 ? 1 : -1; if (Math.abs(dF[0] * nU[0] + dF[1] * nU[1]) < 0.05) inU = o.inU ?? inU;
  const inF = -(dU[0] * nF[0] + dU[1] * nF[1]) >= 0 ? 1 : -1;
  const lean = o.build === 'lean' ? 0.88 : o.build === 'stout' ? 1.1 : 1;
  const bic = sc([[0, 0.48], [0.3, 0.5], [0.58, 0.56 * lean], [0.84, 0.46], [1, 0.42]], wS), tri = sc([[0, 0.54], [0.14, 0.6], [0.4, 0.55 * lean], [0.72, 0.46], [1, 0.42]], wS);
  const flx = sc([[0, 0.46], [0.22, 0.54 * lean], [0.5, 0.44], [0.8, 0.31], [1, wW / wE * 0.5]], wE), ext = sc([[0, 0.5], [0.18, 0.6 * lean], [0.42, 0.5], [0.74, 0.34], [1, wW / wE * 0.5]], wE);
  const profs = [inU > 0 ? [bic, tri] : [tri, bic], inF > 0 ? [flx, ext] : [ext, flx]];
  const pts = mchain([S0, E0, W0], profs, { knob: [o.build === 'lean' ? 1.25 : 1.12] });
  const u = (t, k) => lp(S0, E0, t, k * wS * inU), fa = (t, k) => lp(E0, W0, t, k * wE * inF);
  const dk = mix(look.shadow || look.fill, '#000', 0.25), lt = mix(look.fill, '#fff', 0.35);
  const draw = () => {
    const out = f.part(pts, Object.assign({ k: 0.9 }, look));
    if (o.bare !== false) {
      f.line([u(0.3, 0.12), u(0.6, 0.22), u(0.86, 0.2)], 1.2, dk, { op: 0.5 }); // the biceps' edge
      f.line([u(0.12, -0.42), u(0.45, -0.38)], 1.4, lt, { op: 0.45 });
      f.line([fa(0.05, -0.36), fa(0.3, -0.12), fa(0.62, -0.02)], 1.3, dk, { op: 0.55 }); // the groove between the forearm's muscle groups
      f.line([fa(0.12, -0.52), fa(0.34, -0.48)], 1.6, lt, { op: 0.45 }); // the lit swell below the elbow
      f.line([lp(S0, E0, 0.93, inU * wE * 0.34), add(E0, mul(E.norm(add(nU, nF)), 0)), lp(E0, W0, 0.07, inF * wE * 0.3)], 1.3, dk, { op: 0.6 }); // the elbow crease
      for (let i = 0; i < 3; i++) f.line([fa(0.72 + i * 0.07, 0.25 - i * 0.12), fa(0.95, 0.2 - i * 0.12)], 0.9, dk, { op: 0.45 }); // tendons to the wrist
      f.flat(ell(fa(0.93, -0.3), wW * 0.12, wW * 0.09, 0, 8), lt, { op: 0.5 }); // the wrist bone
    } else {
      // cloth: folds bunched in the crook of the elbow and spiralling down the forearm
      f.stroke([lp(S0, E0, 0.82, inU * wE * 0.45), lp(S0, E0, 0.95, inU * wE * 0.05), lp(E0, W0, 0.1, -inF * wE * 0.2)], 2.2, dk, { op: 0.55 });
      f.stroke([fa(0.25, 0.48), fa(0.36, 0.0), fa(0.32, -0.4)], 1.8, dk, { op: 0.45 });
      f.stroke([u(0.35, 0.45), u(0.48, -0.1)], 1.8, dk, { op: 0.4 });
      f.line([u(0.15, -0.4), u(0.6, -0.42)], 1.4, lt, { op: 0.4 });
    }
    if (o.after) o.after(u, fa);
    return out;
  };
  const out = o.sfx ? split(f, draw, [['upperarm' + o.sfx, side(E0, mul(elb(S0, E0, W0), -1), wE * 0.6)], ['forearm' + o.sfx, side(E0, elb(S0, E0, W0), wE * 0.6)]]) : draw();
  return { pts: out, u, fa, inU, inF };
}
// ---- a modelled leg hip to ankle: the quadriceps' swell in front, the hamstring behind, a kneecap, the calf's two
// heads bulging high behind the shin, a hard taper to the ankle, the Achilles. dir +1 faces right. ws = [hip, knee, ankle].
// o.sfx splits it at the knee. o.bare false: cloth folds instead of anatomy lines.
function mLeg(f, Hp, Kn, A, ws, look, o = {}) {
  const [wH, wK, wA] = ws, dir = o.dir ?? 1, dT = E.norm(sub(Kn, Hp)), dS = E.norm(sub(A, Kn)), nT = [-dT[1], dT[0]], nS = [-dS[1], dS[0]];
  const frT = nT[0] * dir >= 0 ? 1 : -1, frS = nS[0] * dir >= 0 ? 1 : -1; // which normal side is the front
  const st = o.build === 'stout' ? 1.08 : o.build === 'lean' ? 0.9 : 1, sw = o.swell ?? 0;
  const quad = sc([[0, 0.48], [0.35, 0.55 * st], [0.72, 0.48], [0.94, 0.44], [1, 0.46]], wH), ham = sc([[0, 0.5], [0.3, 0.54 * st], [0.68, 0.46], [1, wK / wH * 0.44]], wH);
  const calf = sc([[0, 0.44], [0.14, 0.56 * st + sw * 0.05], [0.3, 0.6 * st + sw * 0.08], [0.52, 0.46 + sw * 0.08], [0.78, wA / wK * 0.6 + sw * 0.06], [1, wA / wK * 0.5 + sw * 0.05]], wK);
  const shin = sc([[0, 0.48], [0.12, 0.46], [0.4, 0.38 + sw * 0.04], [0.8, wA / wK * 0.52 + sw * 0.04], [1, wA / wK * 0.5 + sw * 0.04]], wK);
  quad[quad.length - 1][1] = wK * 0.5; ham[ham.length - 1][1] = wK * 0.46;
  const profs = [frT > 0 ? [quad, ham] : [ham, quad], frS > 0 ? [shin, calf] : [calf, shin]];
  const pts = mchain([Hp, Kn, A], profs, { knob: [1.08], capA: o.capA });
  const th = (t, k) => lp(Hp, Kn, t, k * wH * frT), sh = (t, k) => lp(Kn, A, t, k * wK * frS);
  const dk = mix(look.shadow || look.fill, '#000', 0.25), lt = mix(look.fill, '#fff', 0.35);
  const draw = () => {
    const out = f.part(pts, Object.assign({ k: 0.9 }, look));
    if (o.bare !== false) {
      f.line([th(0.2, 0.2), th(0.6, 0.3), th(0.9, 0.22)], 1.2, dk, { op: 0.45 }); // the quadriceps' edge
      f.line([lp(Hp, Kn, 0.9, frT * wK * 0.3), lp(Hp, Kn, 0.98, frT * wK * 0.48), lp(Kn, A, 0.06, frS * wK * 0.36)], 1.4, dk, { op: 0.6 }); // the kneecap
      f.line([sh(0.08, -0.2), sh(0.3, -0.36), sh(0.5, -0.3)], 1.2, dk, { op: 0.55 }); // the calf's inner head
      f.line([sh(0.15, 0.3), sh(0.55, 0.26), sh(0.85, 0.2)], 1.6, lt, { op: 0.5 }); // the shin bone's lit edge
      f.line([sh(0.7, -0.26), sh(0.96, -0.32)], 1.1, dk, { op: 0.5 }); // the Achilles
    } else {
      f.stroke([lp(Hp, Kn, 0.86, -frT * wK * 0.5), lp(Hp, Kn, 0.96, -frT * wK * 0.05), lp(Kn, A, 0.12, frS * wK * 0.2)], 2.2, dk, { op: 0.5 });
      f.stroke([th(0.4, 0.4), th(0.55, -0.1)], 1.8, dk, { op: 0.4 }); f.stroke([sh(0.45, 0.4), sh(0.55, -0.3)], 1.6, dk, { op: 0.4 });
      f.line([th(0.1, 0.35), th(0.7, 0.36)], 1.4, lt, { op: 0.4 });
    }
    if (o.after) o.after(th, sh);
    return out;
  };
  const out = o.sfx ? split(f, draw, [['thigh' + o.sfx, side(Kn, mul(elb(Hp, Kn, A), -1), wK * 0.6)], ['shin' + o.sfx, side(Kn, elb(Hp, Kn, A), wK * 0.6)]]) : draw();
  return { pts: out, th, sh };
}

// ---- a face taken by the venom (on B.head, face shading 0.8). p.rolled: eyes rolled up into the lids (a sliver of iris
// under the upper lid); p.slack: the jaw hanging, mouth open; p.clench: jaw muscles knotted, teeth bared at the lips;
// p.droop: the near side of the face paralysed, the lower lid and the mouth corner dragged down, the cheek swollen;
// p.weal: [x, y, r] a hard venom-green sting welt. Returns the head frame.
function pHead(f, HC, H, hA, p = {}) {
  const hF = frame(HC, hA, H), skin = p.skin || P.skin;
  B.head(f, HC, H, hA, Object.assign({ faceShade: 0.8, jawShade: 0.5, eyeWhite: '#d4ccba' }, p, p.rolled ? { iris: p.eyeWhite || '#d4ccba', squint: 0 } : {}));
  const sk = mix(skin, '#2a1c20', 0.55);
  if (p.rolled) for (const [x, rx] of [[0.12, 0.022], [0.29, 0.012]]) f.flat(hF(ell([x, -0.084], rx, 0.01, 0, 6)), '#3a3836', { op: 0.85 });
  if (p.slack) { f.flat(hF([[0.18, 0.27], [0.25, 0.258], [0.31, 0.27], [0.3, 0.35], [0.24, 0.37], [0.185, 0.33]]), '#1a1210'); f.flat(hF([[0.2, 0.265], [0.27, 0.262], [0.285, 0.275], [0.21, 0.278]]), P.boneD, { op: 0.9 }); }
  if (p.clench) {
    f.flat(hF([[0.18, 0.268], [0.31, 0.262], [0.315, 0.29], [0.18, 0.296]]), '#d0c6aa', { op: 0.95 }); // teeth bared between the lips
    for (let i = 0; i < 5; i++) f.line(hF([[0.195 + i * 0.026, 0.266], [0.195 + i * 0.026, 0.294]]), 0.8, INK, { op: 0.6 });
    f.line(hF([[0.175, 0.296], [0.25, 0.302], [0.32, 0.292]]), 1.6, INK, { op: 0.8 });
    f.stroke(hF([[-0.14, 0.12], [-0.08, 0.24], [-0.06, 0.36]]), H * 0.03, sk, { op: 0.55 }); // the masseter knotted
    f.line(hF([[-0.1, 0.1], [-0.04, 0.24], [-0.02, 0.34]]), 1.2, mix(skin, '#fff', 0.35), { op: 0.5 });
  }
  if (p.droop) {
    f.part(hF([[0.0, 0.04], [0.16, 0.02], [0.27, 0.12], [0.3, 0.3], [0.22, 0.44], [0.06, 0.42], [-0.06, 0.26]]), { fill: mix(skin, P.venP, 0.25), shadow: P.skinS, shade: 0.3, maxShade: H * 0.06, inkW: 0, inkHeavy: 0, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.5 }); // the swollen slack cheek
    f.line(hF([[0.04, -0.03], [0.11, -0.005], [0.17, -0.03]]), 1.4, sk, { op: 0.8 }); f.flat(hF([[0.06, -0.04], [0.16, -0.04], [0.11, -0.01]]), '#8a4a4a', { op: 0.5 }); // the lower lid dragged down, its red rim
    f.stroke(hF([[0.17, 0.28], [0.22, 0.31], [0.24, 0.36]]), H * 0.02, INK, { op: 0.8 }); // the mouth corner pulled down
    f.line(hF([[0.25, 0.12], [0.2, 0.26], [0.18, 0.4]]), 1.4, sk, { op: 0.6 }); // the fold slackened
    f.line(hF([[0.08, 0.12], [0.18, 0.1]]), 1.4, mix(skin, '#fff', 0.4), { op: 0.5 }); // shine on the stretched skin
  }
  if (p.weal) for (const [x, y, r] of [].concat(p.welts || [p.weal])) weal(f, hF([[x, y]])[0], r * H);
  return hF;
}
// a hard venom-green sting welt: a raised lump with a dark puncture at its crown and a bruise ring
function weal(f, c, r) {
  const e = ell(c, r, r * 0.78, 0.3, 12).map((q, i) => i % 3 ? add(q, [(f.r() - 0.5) * r * 0.3, (f.r() - 0.5) * r * 0.3]) : q);
  f.flat(ell(add(c, [r * 0.1, r * 0.15]), r * 1.6, r * 1.25, 0.3, 12), '#3a3a22', { op: 0.3 }); // the bruise round it
  f.part(e, { fill: mix(P.ven, P.skin, 0.55), shadow: mix(P.venD, P.skinS, 0.5), light: mix(P.venP, P.skin, 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.5 });
  f.line([add(c, [-r * 0.6, -r * 0.3]), add(c, [-r * 0.1, -r * 0.6])], 1, '#e4e2cc', { op: 0.45 });
  f.flat(ell(c, r * 0.16, r * 0.13, 0, 6), '#1a120e'); f.line([c, add(c, [r * 0.5, r * 0.3])], 0.8, '#2a1a14', { op: 0.6 });
}
// lightning-stiffened hair along a scalp curve (screen space): stiff clumped hanks fanning out from the scalp, each a
// tapered stroke with a lit edge, a few frizzed tips. pts: scalp points, out: function(p) -> outward angle
function stiffHair(f, pts, len, col, o = {}) {
  pts.forEach((p, i) => {
    const a = (o.out ? o.out(p, i) : -Math.PI / 2) + (f.r() - 0.5) * (o.jit ?? 0.3), l = len * X.R(f, 0.65, 1.15);
    const q1 = add(p, rot([l * 0.55, 0], a + (f.r() - 0.5) * 0.2)), q2 = add(p, rot([l, 0], a + (f.r() - 0.5) * 0.35));
    f.stroke([p, q1, q2], (o.w ?? 5) * X.R(f, 0.8, 1.2), col);
    f.line([lerp(p, q1, 0.3), q1], 0.9, mix(col, '#fff', 0.35), { op: 0.6 });
    if (f.r() < 0.45) f.line([q1, add(q1, rot([l * 0.35, 0], a + (f.r() > 0.5 ? 0.5 : -0.5)))], 1, col);
  });
}
// a mane of hair standing stiff off the scalp (lightning): one filled mass of clumped hanks, each hank a tapering spike of
// uneven length leaning out from the scalp's normal, a lit strand down each, dark roots; never a halo of thin lines.
// hF: head frame; a0..a1: the scalp arc in head-frame angles (0 = forward, -PI/2 = crown); len: hank length in head units
function stiffMane(f, hF, a0, a1, len, col, o = {}) {
  const n = o.n ?? 14, rS = o.r ?? 0.46, cx = o.c || [-0.04, -0.06], pts = [], strands = [];
  const sc = (a, r) => [cx[0] + Math.cos(a) * r, cx[1] + Math.sin(a) * r * 1.08];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    pts.push(sc(a, rS * (0.92 + R(f, 0, 0.12))));
    if (i < n) {
      // one hank: a blunt clump that splits into two or three frizzed points of uneven length
      const da = (a1 - a0) / n, l = len * R(f, 0.45, 1.1) * (o.taper ? o.taper(i / n) : 1), lean = R(f, -0.2, 0.2), k = f.r() < 0.5 ? 2 : 3;
      for (let j = 0; j < k; j++) { const am = a + da * (j + 0.6) / (k + 0.2) + lean * 0.3, lj = l * R(f, 0.6, 1.0); const t = sc(am + lean * 0.25, rS + lj); pts.push([...t, 1]); if (j < k - 1) pts.push(sc(am + da * 0.15, rS + lj * R(f, 0.45, 0.7))); strands.push([sc(am, rS * 0.85), t]); }
    }
  }
  const back = []; for (let i = n; i >= 0; i--) back.push(sc(a0 + (a1 - a0) * i / n, rS * 0.6));
  const M = hF([...pts, ...back]);
  f.part(M, { fill: col, shadow: mix(col, '#000', 0.6), light: mix(col, '#fff', 0.3), shade: 0.36, tex: 'hatch' + f.o.seed, texOp: 0.3, inkW: 1.2, inkHeavy: 2 });
  for (const [b, t] of strands) { f.line(hF([b, lerp(b, t, 0.5), lerp(b, t, 0.85)]), 1.1, mix(col, '#fff', 0.4), { op: 0.6 }); if (f.r() < 0.6) f.line(hF([lerp(b, t, 0.05), lerp(b, t, 0.5)]), 1, mix(col, '#000', 0.5), { op: 0.6 }); }
  return M;
}
// a burn fern kept inside a region (skin or cloth): o.cloth chars it darker with a pale scorched rim
function fern(f, region, c, a, len, w, o = {}) {
  X.clipDraw(f, region, () => o.cloth ? X.lichtenberg(f, c, a, len, w, { col: '#17131a', lite: P.vioL, depth: o.depth ?? 3, op: 0.8 }) : X.skinBurn(f, c, a, len, w, { depth: o.depth ?? 3 }));
}
// grey hive paper comb: a lumpy mass of chewed pulp with open hexagonal cells (dark mouths, a few capped pale, a grub
// head in one), scalloped growth lines, a torn lower edge. pts: outline.
function comb(f, pts, o = {}) {
  const sd = f.o.seed, bb = E.bbox(pts), cs = o.cell ?? 14;
  f.part(pts, X.PAP(f, { fill: o.fill || P.paper, k: 0.85 }));
  X.clipDraw(f, pts, () => {
    // the envelope: courses of chewed pulp laid in overlapping scallops, banded paler and darker
    for (let y = bb[1] + cs * 0.6, r = 0; y < bb[3] + cs; y += cs * 0.9, r++) { const row = []; for (let x = bb[0] - cs; x <= bb[2] + cs; x += cs * 1.6) { row.push([x, y + (r % 2) * 2]); row.push([x + cs * 0.8, y + cs * 0.5]); } f.line(row, 1.4, r % 3 ? P.paperD : P.paperL, { op: 0.55 }); }
    // torn patches where the cells show: hexagonal mouths, a few capped, a grub curled in one
    const np = o.patches ?? Math.max(1, Math.round((bb[2] - bb[0]) * (bb[3] - bb[1]) / (cs * cs * 60)));
    for (let p = 0; p < np; p++) {
      const pc = [R(f, bb[0] + cs, bb[2] - cs), R(f, bb[1] + cs, bb[3] - cs)], pr = cs * R(f, 1.4, 2.4), patch = X.lumpy(f, ell(pc, pr * 1.3, pr, R(f, 0, 3), 10), pr * 0.25);
      f.flat(patch, P.paperD, { op: 0.9 });
      X.clipDraw(f, patch, () => { for (let yy = pc[1] - pr * 1.4; yy < pc[1] + pr * 1.4; yy += cs * 1.5) for (let xx = pc[0] - pr * 1.6 + ((Math.round(yy / cs)) % 2) * cs * 0.85; xx < pc[0] + pr * 1.6; xx += cs * 1.75) { const c = [xx, yy], hx = []; for (let i = 0; i < 6; i++) hx.push(add(c, rot([cs * 0.72, 0], i * Math.PI / 3 + 0.5))); const r2 = f.r(); if (r2 < 0.2) f.flat(hx.map(q => [...lerp(q, c, 0.16), 1]), mix(P.paperL, P.bone, 0.4)); else { f.flat(hx.map(q => [...lerp(q, c, 0.18), 1]), '#0c0a0c', { op: 0.85 }); if (r2 < 0.3) { const g = []; for (let i = 0; i <= 6; i++) g.push(add(c, rot([cs * 0.3, 0], 0.6 + i * 0.62))); f.line(g, cs * 0.24, mix(P.venP, P.bone, 0.5)); } } } });
      f.line(patch.slice(0, 7), 1.6, P.paperL, { op: 0.7 }); // the torn rim of the envelope
    }
  });
  return pts;
}
// a small wasp crawling or settling (s = 1 is about 34 px long), head toward a: banded gaster, folded wings, jointed legs,
// a dark compound eye (no glint, no stare)
function miniWasp(f, c, a, s = 1, o = {}) {
  const F = frame(c, a, s), look = X.CH(f, { inkW: 0.9, inkHeavy: 1.2, cast: false, tex: null });
  for (const [b, k, tp] of [[[2, 3], [5, 10], [9, 14]], [[-2, 3], [-5, 11], [-3, 16]], [[-6, 2], [-12, 9], [-16, 13]]]) f.line(F([b, k, tp]), 1.6 * s, INK);
  const gs = F([[-4, -2], [-12, -6], [-22, -5], [-28, 0], [-22, 6], [-12, 6], [-4, 3]]);
  f.part(gs, look);
  X.clipDraw(f, gs, () => { for (const x of [-10, -17]) f.stroke(F([[x, -7], [x - 1, 0], [x, 7]]), 3.2 * s, P.ven, { op: 0.9 }); });
  f.part(F(ell([3, 0], 6, 4.6, 0, 10)), look);
  f.part(F([[9, -4], [14, -3], [15, 2], [11, 4], [8, 2]]), look);
  f.flat(F(ell([12, -1], 2.2, 2.6, 0.3, 8)), '#141218');
  f.line(F([[13, -3], [17, -9], [22, -10]]), 1 * s, INK); // antenna
  if (o.wings !== false) { const wg = F([[2, -3], [-8, -11], [-24, -10], [-26, -6], [-6, -4]]); f.flat(wg, '#c8c2d6', { op: 0.35 }); f.line(wg.concat([wg[0]]), 0.8, INK, { op: 0.7 }); f.line(F([[0, -4], [-20, -8]]), 0.7, INK, { op: 0.5 }); }
  return F;
}
// a lead pilgrim badge: a cast scallop on a pin (s = half width)
function leadBadge(f, c, s, a = 0) {
  const F = frame(c, a, s);
  f.part(F([[0, 1.1], [-0.95, 0.1], [-0.8, -0.5], [-0.35, -0.85], [0.35, -0.85], [0.8, -0.5], [0.95, 0.1]]), { fill: '#7a7a7c', shadow: '#2a2a2c', light: '#b4b4b6', shade: 0.42, inkW: 1, inkHeavy: 1.4, cast: false, tex: 'pit' + f.o.seed, texOp: 0.6 });
  for (let i = -2; i <= 2; i++) f.line(F([[0, 0.95], [i * 0.32, -0.75]]), 0.8, INK, { op: 0.6 });
  f.line(F([[-0.7, -0.5], [0.7, -0.5]]), 0.9, '#cfcfd0', { op: 0.5 });
}
// votive offerings hung on a cord: a wax limb sagging with heat, or a tin heart
function waxLimb(f, top, len, a = 0) {
  const F = frame(top, a, len / 60);
  f.line([top, F([[0, 8]])[0]], 1.2, '#4a3a2a');
  f.part(F([[-5, 8], [5, 8], [7, 30], [5, 44], [9, 52], [8, 60], [-2, 62], [-6, 52], [-4, 40], [-7, 24]]), { fill: P.wax, shadow: '#5a4e30', light: '#e4d8a8', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
  f.line(F([[-3, 42], [4, 41]]), 0.9, '#6a5a38', { op: 0.6 }); f.line(F([[0, 58], [1, 68]]), 2.2, P.wax); // a sagging drip
}
function tinHeart(f, top, s) {
  f.line([top, add(top, [0, s * 0.8])], 1.1, '#3a3a3a');
  const c = add(top, [0, s * 1.6]);
  f.part([add(c, [0, s * 0.9]), add(c, [-s * 0.95, -s * 0.05]), add(c, [-s * 0.75, -s * 0.7]), add(c, [-s * 0.2, -s * 0.7]), add(c, [0, -s * 0.35]), add(c, [s * 0.2, -s * 0.7]), add(c, [s * 0.75, -s * 0.7]), add(c, [s * 0.95, -s * 0.05])], { fill: P.tin, shadow: P.tinD, light: P.tinL, shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, tex: 'pit' + f.o.seed, texOp: 0.5 });
  f.line([add(c, [-s * 0.5, -s * 0.4]), add(c, [-s * 0.2, -s * 0.1])], 1, '#e0e0e2', { op: 0.6 });
}
// a broad felt hat (pilgrim, dowser, shepherd): crown with a dent and a band, a wide brim dipping at the front, worn
// pale at the edge, frayed. hF: the head frame. o.hole: a scorched hole through the crown; o.badges: lead badges on the brim
function feltHat(f, hF, o = {}) {
  const col = o.col || P.felt, look = X.CLK(f, { fill: col, shadow: mix(col, '#0e0c0a', 0.55), light: mix(col, '#fff', 0.25), tex: 'mottle' + f.o.seed, texOp: 0.6 });
  const crown = hF([[-0.38, -0.28], [-0.36, -0.6], [-0.2, -0.78], [0.0, -0.7], [0.14, -0.8], [0.32, -0.64], [0.38, -0.28]]);
  f.part(crown, look);
  f.line(hF([[-0.02, -0.72], [0.06, -0.6], [0.1, -0.74]]), 1.4, INK, { op: 0.6 }); // the dent
  f.part(hF([[-0.39, -0.36], [0.39, -0.36], [0.4, -0.26], [-0.39, -0.25]]), X.CLK(f, { fill: o.band || P.leathD, cast: false, inkW: 1.1 }));
  if (o.hole) { const hc = hF([o.hole])[0]; X.scorch(f, hc, H0(hF) * 0.09, H0(hF) * 0.07, 0.6); f.flat(ell(hc, H0(hF) * 0.045, H0(hF) * 0.035, 0, 10).map(q => add(q, [(f.r() - 0.5) * 3, (f.r() - 0.5) * 3])), '#0a0808'); X.burn(f, hc, -2.4, H0(hF) * 0.25, 1.2, { depth: 1 }); }
  const fr = o.front ?? 1.0, bk = o.back ?? 0.95;
  const brim = hF([[-bk, -0.2], [-0.6, -0.34], [0.0, -0.38], [0.5, -0.34], [fr * 0.82, -0.26], [fr, -0.14], [fr * 0.9, -0.08], [0.5, -0.18], [0.0, -0.2], [-0.6, -0.14], [-bk - 0.02, -0.08]]);
  f.part(brim, Object.assign({}, look, { shade: 0.26 }));
  f.line(hF([[-bk + 0.05, -0.12], [-0.4, -0.17], [0.2, -0.2], [fr * 0.86, -0.11]]), 1.6, mix(col, '#fff', 0.3), { op: 0.5 }); // worn pale edge
  f.line(hF([[-0.5, -0.3], [0.3, -0.33]]), 1.2, INK, { op: 0.4 });
  for (const q of (o.badges || [])) leadBadge(f, hF([q])[0], H0(hF) * 0.06, -0.2);
  return brim;
}
// verdigris: blotches of dull green corrosion in the hollows of copper (the tinker's named colour)
function verdigris(f, c, rx, ry, n, op = 0.6) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]); f.flat(ell(p, 2 + f.r() * rx * 0.25, 2 + f.r() * ry * 0.2, f.r() * 3, 10), f.r() > 0.3 ? '#5e7a62' : '#8aa088', { op: op * (0.6 + f.r() * 0.5) }); } }
// a coil of cord hung at the belt (copied from kit_X, where it is not exported): stacked loops, a lashing, a loose tail
function ropeCoil(f, c, rx, ry, n, w, o = {}) {
  const col = o.col || '#8a7a5a';
  for (let i = 0; i < n; i++) { const e = ell(add(c, [i * 2.2 - n, i * 1.4]), rx - i * 1.2, ry - i * 0.6, o.a || 0, 20); f.line(e.concat([e[0]]), w + 2, INK); f.line(e.concat([e[0]]), w, mix(col, '#000', i % 2 ? 0.15 : 0)); f.line(e.slice(12, 18), 0.9, mix(col, '#fff', 0.4), { op: 0.6 }); }
  const t = add(c, [0, -ry]); f.line([add(t, [-6, -2]), add(t, [6, 2])], 4, '#2e2418'); f.line([add(t, [-6, 6]), add(t, [6, 10])], 4, '#2e2418');
  X.rope(f, [add(c, [rx * 0.6, ry * 0.7]), add(c, [rx * 0.7, ry * 1.6]), add(c, [rx * 0.5, ry * 2.4])], w * 0.9, { col, fray: true });
}
// wear on a cloth region: damp-dark blotches, pale road-dust rubs, a few darns and pulled threads, dust rising from the hem
function wear(f, pts, n = 5, o = {}) {
  const bb = E.bbox(pts);
  X.clipDraw(f, pts, () => {
    for (let i = 0; i < n; i++) { const c = [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])]; f.flat(X.lumpy(f, ell(c, R(f, 10, 26), R(f, 8, 20), f.r() * 3, 10), 4), f.r() < 0.5 ? '#1e1a16' : (o.dust || '#a8a294'), { op: R(f, 0.12, 0.22) }); }
    for (let i = 0; i < Math.ceil(n * 1.5); i++) { const c = [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])], a = R(f, 1.2, 1.9); f.line([c, add(c, rot([R(f, 8, 20), 0], a))], 0.9, f.r() < 0.5 ? INK : '#c8c0b0', { op: 0.45 }); }
    if (o.hem !== false) { const y0 = bb[3] - (bb[3] - bb[1]) * (o.hemH ?? 0.3); for (let i = 0; i < 6; i++) f.flat([[bb[0] - 5, y0 + i * 6], [bb[2] + 5, y0 + i * 6], [bb[2] + 5, bb[3] + 5], [bb[0] - 5, bb[3] + 5]], o.mud || '#2a2620', { op: 0.07 }); }
  });
}
const R = (f, a, b) => a + (b - a) * f.r();
// a scorched, frayed hem from a to b (down = +y): uneven tongues (some long, some only a notch, an occasional burnt-out
// gap), never a regular sawtooth. Returns the points (sharp at the tips) for an outline.
function hemLine(f, a, b, n, depth) {
  const q = []; let t = 0;
  while (t < 1) {
    const p = lerp(a, b, t), k = f.r();
    if (k < 0.18) q.push([p[0], p[1] - depth * R(f, 0.6, 1.1)]); // a burnt-out bite
    else if (k < 0.55) q.push([p[0] + R(f, -3, 3), p[1] + depth * R(f, 0.5, 1.2), 1]); // a tongue
    else q.push([p[0], p[1] + R(f, -2, 4)]);
    t += R(f, 0.5, 1.4) / n;
  }
  q.push([...b, 1]);
  return q;
}
// stiff frayed threads standing off a hem (lightning frays and fuses cloth): short wiry strokes with a fused bead
function hemThreads(f, pts, col, n = 6) {
  for (let i = 0; i < n; i++) { const p = pts[Math.floor(f.r() * pts.length)], a = Math.PI / 2 + R(f, -0.9, 0.9), l = R(f, 8, 18), e = add(p, rot([l, 0], a)); f.line([p, lerp(p, e, 0.5), e], 1.1, col); f.flat(ell(e, 1.4, 1.4, 0, 5), '#1a1614'); }
}
// ---- one continuous spill of hive comb (independent review): ribbons along paths (ctrl points, width t -> px) merged
// into one mass, built as layered shelves of grey paper comb from the bottom up, each shelf's scalloped lower edge
// overhanging the one below and casting a dark recess on it; open cells in torn patches; the whole mass darker where
// it sinks into the recesses and against what it grows over. o.clip: draw only inside this region.
function combMass(f, paths, o = {}) {
  const run = () => {
    const ribs = paths.map(([ctl, wf]) => X.lumpy(f, X.ribbon(X.spline(ctl, 3), wf), 8));
    for (const rb of ribs) f.flat(rb.map(q => add(q, [-8, 12])), '#0c0a0a', { op: 0.55 }); // its shadow on the statue and deck
    for (const rb of ribs) f.part(rb, X.PAP(f, { fill: '#56524a', shadow: '#161414', cast: false, k: 0.85 })); // the deep body of the mass
    for (const [ctl, wf] of paths) {
      const C = X.spline(ctl, 3), S = X.arcLen(C), L = S[S.length - 1], step = o.step ?? 70, tiers = [];
      for (let u = 0; u < L; u += step * R(f, 0.8, 1.2)) tiers.push(u);
      for (let k = tiers.length - 1; k >= 0; k--) { // bottom shelf first; each one above overlaps it
        const u0 = Math.max(0, tiers[k] - step * 0.3), u1 = Math.min(L, tiers[k] + step), sk = R(f, 0.72, 1.0), top = [], bot = [], bul = step * R(f, 0.35, 0.6);
        const A1 = X.at(C, S, u1);
        for (let i = 0; i <= 8; i++) { const u = u0 + (u1 - u0) * 0.3, A = X.at(C, S, u), ww = wf(u / L) / 2 * sk; top.push(add(A.p, mul(A.n, ww * (1 - 2 * i / 8)))); }
        for (let i = 0; i <= 10; i++) { const v = 1 - 2 * i / 10, ww = wf(u1 / L) / 2 * sk; bot.push(add(add(A1.p, mul(A1.n, -ww * v)), mul(A1.d, bul * Math.sqrt(Math.max(0, 1 - v * v))))); } // the shelf's lower lip, bulging out and down like a nest envelope
        const shelf = X.lumpy(f, [...top, ...bot], step * 0.08);
        f.flat(shelf.map(q => add(q, [-4, 14])), '#0a0808', { op: 0.55 }); // the recess under its overhanging lip
        comb(f, shelf, { cell: o.cell ?? 13, fill: mix(P.paper, '#2a2826', R(f, 0.0, 0.12)) });
        X.clipDraw(f, shelf, () => { const bb2 = bot.map(q => add(q, mul(A1.d, -step * 0.28))); f.flat([...bot, ...bb2.reverse()], '#14120e', { op: 0.22 }); f.line(bot.map(q => add(q, mul(A1.d, -4))), 2, P.paperL, { op: 0.5 }); }); // darker under the lip, its edge catching the light
      }
    }
  };
  if (o.clip) X.clipDraw(f, o.clip, run); else run();
}

const H0 = hF => E.len(sub(hF([[1, 0]])[0], hF([[0, 0]])[0])); // the head unit of a head frame, in px

// ---- a cicada forewing, freshly emerged (independent review): a translucent membrane (whatever is behind it shows
// through, tinted), strong dark veins in the cicada pattern (a thickened costa to the node, the opaque basal cell, the
// radius, media and cubitus stems, the ulnar cells closed by the nodal line, eight apical cells fanning to the ambient
// vein that runs inside the margin, the clavus behind its suture), torn margin notches and a torn-out chunk, wet sheen
// streaks and beads, and slight crumpling (wavy veins, fold creases). root, heading a, length L, chord unit W; tr: the
// trailing side (+1: +y of the frame). o.tears: [[u, depth]] notches along the trailing margin (u 0..1 round it);
// o.chunk: [u0, u1] a torn-out bite of the margin; o.crumple 0..1; o.col: membrane tint; o.op: membrane opacity.
function cicadaWing(f, root, a, L, W, o = {}) {
  const tr = o.tr ?? 1, cr = o.crumple ?? 0.5, F0 = frame(root, a, 1), ph = R(f, 0, 6);
  // crumpling: a low, uneven warp of the whole wing (veins and outline bend together)
  const warp = ([x, y]) => [x + Math.sin(y * 9 + ph) * 0.004 * cr, y + (Math.sin(x * 7.3 + ph) * 0.012 + Math.sin(x * 17 + ph * 2) * 0.005) * cr];
  const Fw = pts => F0(pts.map(p => { const q = warp(p); return [q[0] * L, q[1] * W * tr, p[2]]; }));
  const lw = Math.max(1, L / 420); // vein scale
  // outline, root -> leading edge -> tip -> trailing edge (normalized: x along, y across, + trailing)
  const OUT = [[0, -0.02], [0.08, -0.07], [0.2, -0.1], [0.35, -0.125], [0.5, -0.14], [0.65, -0.14], [0.78, -0.12], [0.88, -0.08], [0.95, -0.02], [0.99, 0.07], [1.0, 0.18], [0.98, 0.3], [0.93, 0.42], [0.85, 0.52], [0.74, 0.6], [0.6, 0.64], [0.46, 0.62], [0.33, 0.55], [0.22, 0.44], [0.13, 0.32], [0.06, 0.2], [0.015, 0.08]];
  // resample round the outline so tears can bite anywhere
  const ring = []; for (let i = 0; i < OUT.length; i++) { const p0 = OUT[i], p1 = OUT[(i + 1) % OUT.length]; for (let k = 0; k < 4; k++) ring.push(lerp(p0, p1, k / 4)); }
  const N = ring.length, cen = [0.55, 0.22];
  const torn = ring.map((p, i) => {
    const u = i / N; let d = 0, jag = false;
    for (const [tu, td] of (o.tears || [])) { const g = Math.abs(u - tu); if (g < 0.02) { d = Math.max(d, td * (1 - g / 0.02)); jag = true; } }
    if (o.chunk && u > o.chunk[0] && u < o.chunk[1]) { d = Math.max(d, 0.1 + 0.05 * Math.sin((u - o.chunk[0]) / (o.chunk[1] - o.chunk[0]) * Math.PI) + R(f, -0.02, 0.03)); jag = true; }
    const q = lerp(p, cen, d); if (jag) return [q[0] + R(f, -0.006, 0.006), q[1] + R(f, -0.01, 0.01), 1]; return q;
  });
  const out = Fw(torn);
  // the membrane: thin and tinted, darker and denser at the base, with a pale wet sheen in bands; the crumple creases
  f.flat(out, o.col || '#b8c4a6', { op: o.op ?? 0.2 });
  X.clipDraw(f, out, () => {
    f.flat(Fw([[0, -0.2], [0.3, -0.2], [0.26, 0.7], [0, 0.4]]), o.base || '#7a8460', { op: 0.32 }); // the thicker, greener base of a new wing
    f.flat(Fw([[0.0, 0.1], [0.36, 0.48], [0.3, 0.7], [0.0, 0.5]]), '#6e7656', { op: 0.18 }); // the clavus, a shade denser
    for (let i = 0; i < 4; i++) { const x0 = R(f, 0.3, 0.9); f.flat(Fw([[x0, -0.2], [x0 + 0.03, -0.2], [x0 - 0.04, 0.8], [x0 - 0.08, 0.8]]), '#e8ecdc', { op: R(f, 0.04, 0.07) }); } // wet sheen bands
    for (let i = 0; i < Math.round(5 * cr) + 2; i++) { const x0 = R(f, 0.25, 0.92), s2 = R(f, -0.08, 0.08); f.line(Fw([[x0, -0.16], [x0 + s2 * 0.5 + 0.02, 0.2], [x0 + s2, 0.7]]), 2.4 * lw, '#2a2c20', { op: 0.16 }); f.line(Fw([[x0 + 0.008, -0.16], [x0 + s2 * 0.5 + 0.028, 0.2], [x0 + s2 + 0.008, 0.7]]), 1.4 * lw, '#f0f2e4', { op: 0.22 }); } // crumple creases: a dark fold beside a lit ridge
  });
  f.line(out.concat([out[0]]), 1.4 * lw, INK, { op: 0.7 }); // the membrane's own edge
  // veins: ink, a dark core, a thin lit thread along one side so they read as raised tubes
  const vein = (pts, w2, o2 = {}) => { const q = Fw(pts); f.line(q, w2 * lw + 1.4, INK, { op: 0.92 }); f.line(q, Math.max(0.8, w2 * lw * 0.45), o2.core || '#3e3a2a', { op: 0.85 }); f.line(q.map(p => add(p, [0.6 * lw, -0.6 * lw])), Math.max(0.6, w2 * lw * 0.18), '#c8ccb4', { op: 0.45 }); };
  // the costa: a thickened leading edge to the node, then the ambient vein on round the margin
  const cost = [[0.0, -0.02], [0.08, -0.065], [0.2, -0.095], [0.35, -0.118], [0.5, -0.132]];
  f.flat(Fw([...cost, ...cost.slice().reverse().map(([x, y]) => [x, y + 0.035 * (1 - x * 0.8)])]), '#26241a'); vein(cost, 6.5);
  f.line(Fw([[0.04, -0.05], [0.2, -0.085], [0.45, -0.115]]), 1.6 * lw, '#d4d8c0', { op: 0.5 });
  const amb = [[0.5, -0.128], [0.65, -0.122], [0.78, -0.104], [0.88, -0.064], [0.94, -0.0], [0.966, 0.08], [0.966, 0.18], [0.948, 0.29], [0.9, 0.4], [0.83, 0.48], [0.73, 0.55], [0.6, 0.585], [0.48, 0.57]];
  vein(amb, 2.6);
  // the basal cell (closed, near opaque) between the R+Sc and M stems
  const RS = [[0.01, -0.01], [0.12, -0.05], [0.24, -0.072], [0.33, -0.08]], MS = [[0.02, 0.03], [0.12, 0.045], [0.24, 0.055], [0.33, 0.05]];
  f.flat(Fw([...RS, ...MS.slice().reverse()]), '#4a4e36', { op: 0.55 });
  vein(RS, 4.2); vein(MS, 3.6); vein([[0.33, -0.08], [0.33, 0.05]], 2.6);
  // R, M, CuA stems on toward the nodal line; the claval suture and the anal vein
  const Rr = [[0.33, -0.08], [0.46, -0.1], [0.58, -0.105], [0.7, -0.098]], Mm = [[0.33, 0.05], [0.44, 0.09], [0.55, 0.13], [0.65, 0.16]], Cu = [[0.03, 0.06], [0.12, 0.13], [0.24, 0.22], [0.36, 0.3], [0.47, 0.36], [0.55, 0.4]];
  vein(Rr, 3.2); vein(Mm, 3); vein(Cu, 3); vein([[0.46, -0.1], [0.5, -0.13]], 2.2); vein([[0.58, -0.105], [0.56, -0.0], [0.55, 0.13]], 2); vein([[0.44, 0.09], [0.47, 0.36]], 2); // the radial cross-vein, r-m and m-cu
  vein([[0.03, 0.1], [0.12, 0.22], [0.22, 0.36], [0.31, 0.5], [0.34, 0.545]], 2.6); vein([[0.04, 0.16], [0.14, 0.32], [0.22, 0.46]], 1.8); // the claval suture, the anal vein
  // the nodal line closing the ulnar cells, then the eight apical cells fanning to the ambient vein
  const nod = [[0.7, -0.098], [0.68, 0.03], [0.65, 0.16], [0.6, 0.29], [0.55, 0.4]];
  vein(nod, 2.4);
  const atN = t => { const s = t * (nod.length - 1), i = Math.min(nod.length - 2, Math.floor(s)); return lerp(nod[i], nod[i + 1], s - i); };
  const atA = t => { const s = t * (amb.length - 1), i = Math.min(amb.length - 2, Math.floor(s)); return lerp(amb[i], amb[i + 1], s - i); };
  for (let i = 0; i <= 8; i++) { const t = i / 8, p0 = atN(t), p1 = atA(0.12 + t * 0.8), m = lerp(p0, p1, 0.5); vein([p0, [m[0] + (i % 2 ? 0.006 : -0.006), m[1]], p1], i === 0 || i === 8 ? 2.4 : 2); }
  // wet beads clinging to the membrane, a drop gathering at the lowest point of the margin
  for (let i = 0; i < (o.beads ?? 5); i++) { const p = Fw([[R(f, 0.3, 0.9), R(f, 0.0, 0.5)]])[0], r = R(f, 2, 4.5) * lw * 0.6; f.flat(ell(p, r, r * 1.2, 0, 8), '#dfe6cc', { op: 0.45 }); f.flat(ell(add(p, [-r * 0.3, -r * 0.4]), r * 0.35, r * 0.35, 0, 6), '#fff', { op: 0.7 }); f.line(ell(p, r, r * 1.2, 0, 8).slice(1, 5), 0.8, INK, { op: 0.5 }); }
  // torn edges: frayed threads of membrane and broken vein stubs where the margin is bitten
  torn.forEach((p, i) => { if (p[2] && f.r() < 0.5) { const q = Fw([p])[0], c2 = Fw([cen])[0]; f.line([q, lerp(q, c2, R(f, 0.01, 0.03))], 1.2 * lw, INK, { op: 0.6 }); } });
  return { out, Fw };
}

module.exports = Object.assign({}, X, { P, cicadaWing, combMass, knuckleFist, gripK, mchain, mArm, mLeg, pHead, weal, stiffHair, fern, comb, miniWasp, leadBadge, waxLimb, tinHeart, feltHat, H0, ropeCoil, wear, hemLine, hemThreads, stiffMane, IR, WD, RU, CU, verdigris });
