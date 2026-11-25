// World XII, The White Silence (Frost + Void, absolute zero). A tundra of herders and hunters. A black star rose and took
// all the warmth and all the sound. Frost (dominant) whitens and stills everything: rime on the windward faces, icicles
// hanging plumb, fur and fringes frozen mid-swing. Void takes pieces away with clean rims: faces, shadows, sound. Eyes
// may appear (a void world), sparingly and with purpose.
// The hardest world to read by design: near-white figures on near-white ground, carried by ink line, overlaps, the cel
// shadow band and crosshatch. Palette: almost pure white, a black sun, ink black and grey; nothing else.
// Every creature is a foe: drawn facing right with kit.foeBase (key light upper right in drawing space) and flipped on
// render. Windward = the heroes' side = drawing +x. No ground shadows: the void took them (bible).
// Rigged from the start: joints first, f.bone() before each part, parts drawn whole, overlap at the joints.
'use strict';
const K = require('../kit');
const X12 = require('./kit_XII');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { shiftFig, PAL, base, rnd, scatter, ang, elb, space, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, openHand, mlimb, humanJoints, rope, offsetLine, crease, softTone, muscleBody, fx, snowGround, snowLip, split, side } = X12;
const deg = d => d * Math.PI / 180;
const FUR = (o = {}) => Object.assign({ fill: PAL.fur, shadow: PAL.furS, light: PAL.furL, shade: 0.36 }, o);
const HIDE = (o = {}) => Object.assign({ fill: PAL.hide, shadow: PAL.hideS, light: '#f2f2ee', shade: 0.36 }, o);

// a clumped fur edge: subdivide a hem polyline into soft scallops (each clump a lobe hanging a little lower)
function clumpEdge(f, pts, n, amp) {
  const C = spline(pts, 3), S = arcLen(C), L = S[S.length - 1], out = [];
  for (let i = 0; i <= n * 2; i++) { const u = i / (n * 2) * L; let k = S.findIndex(v => v >= u); if (k < 0) k = C.length - 1; out.push(add(C[k], [0, i % 2 ? amp * (0.6 + f.r() * 0.8) : -amp * 0.2])); }
  return out;
}
// a knee-high leg-skin boot, fur out: baggy shaft with folds at the ankle, rounded toe, a dark hide sole, a beaded
// strip down the front, a thong tied round the ankle, fur tufts at the top. Kn knee, A ankle, s foot unit.
function furBoot(f, X, Kn, A, s, tone, furTex) {
  const gy = f.o.groundY, col = mix(PAL.fur, PAL.furS, tone + 0.05), xx = u => A[0] + u * s;
  const top = lerp(Kn, A, 0.08), d = E.norm(sub(A, Kn)), n = [-d[1], d[0]];
  const shaft = [add(top, mul(n, -27)), add(lerp(top, A, 0.5), mul(n, -27)), [xx(-0.42), A[1] + 4], [xx(-0.46), gy - 18], [xx(-0.4), gy - 5, 1], [xx(1.05), gy - 5, 1], [xx(1.22), gy - 14], [xx(1.16), gy - 30], [xx(0.86), gy - 44], [xx(0.4), A[1] + 4], add(lerp(top, A, 0.6), mul(n, 25)), add(top, mul(n, 28))];
  f.part(shaft, FUR({ fill: col, tex: furTex, texOp: 0.22 }));
  clipDraw(f, shaft, () => {
    for (let i = 0; i < 14; i++) { const p = add(lerp(top, A, f.r() * 0.9), mul(n, (f.r() - 0.5) * 40)); f.stroke([p, add(p, [1, 12 + f.r() * 10])], 3, PAL.furD, { op: 0.45 }); }
    // the beaded front strip: dark hide set with white beads, down the front of the shaft and over the instep
    const s0 = add(top, mul(n, 6)), s1 = add(A, mul(n, 4));
    f.stroke([s0, lerp(s0, s1, 0.5), s1], 9, '#2e3034'); for (let i = 0; i < 6; i++) f.flat(ell(lerp(s0, s1, (i + 0.5) / 6), 1.8, 1.8, 0, 6), '#f2f2f0');
    f.stroke([[xx(0.55), gy - 30], [xx(0.8), gy - 34], [xx(1.05), gy - 26]], 7, '#2e3034'); for (let i = 0; i < 3; i++) f.flat(ell([xx(0.65 + i * 0.17), gy - 31], 1.6, 1.6, 0, 6), '#f2f2f0');
    // folds bunched at the ankle, the dark sole edge
    for (let i = 0; i < 3; i++) f.stroke([add(A, [-24 + i * 4, -18 + i * 10]), add(A, [0, -12 + i * 10]), add(A, [20 - i * 2, -16 + i * 10])], 2.2, PAL.furD, { op: 0.6 });
    f.flat([[xx(-0.5), gy - 9], [xx(1.3), gy - 9], [xx(1.3), gy + 2], [xx(-0.5), gy + 2]], '#3a3c40', { op: 0.9 });
  });
  f.line([[xx(-0.4), gy - 9], [xx(1.12), gy - 10]], 0.9, '#d8dadc', { op: 0.6, dash: '2 2.5' }); // sinew welt
  // the ankle thong, knotted, its ends frozen stiff
  const t0 = add(A, mul(n, -24)), t1 = add(A, mul(n, 22));
  f.stroke([t0, lerp(t0, t1, 0.5), t1], 4, PAL.greyD);
  f.line([add(t1, [-2, 2]), add(t1, [4, 16]), add(t1, [2, 26])], 2, PAL.greyD); f.line([add(t1, [0, 2]), add(t1, [10, 12])], 2, PAL.greyD);
  // fur tufts at the top of the shaft
  X.locks([add(top, mul(n, -28)), add(top, mul(n, 28))], 4, 12, 20, 12, { cast: false, fill: col });
  X.rime([lp(Kn, A, 0.3, 26), lp(Kn, A, 0.8, 24), [xx(0.5), A[1] + 10], [xx(1.0), gy - 40]], 6, -1);
}

// ------------------------------------------------------------------ HOLLOW WANDERER (Human 1.0)
// A reindeer herder still walking the tundra, head bowed, leaning on his crook. The void took the face and everything
// behind it: the hood, stiff with frost, keeps its shape round nothing, and its opening is flat black to a clean rim.
// Fur-out winter parka to mid-shin, frozen in the swing of the last step; lasso coiled over the far shoulder, a herder's
// belt with knife, bone amulets and a reindeer bell whose clapper is gone. Rime on the windward faces, icicles plumb.
function hollowWanderer() {
  const CH = TIERS.human[1], GY = CH - 30;
  const f = new Fig(base(1203, CH, { grimeY: 600 }));
  const X = fx(f);
  const H = 100;
  const N = [330, 270], C = [300, 368], P = [292, 474];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = 0.5, HC = add(N, add(mul(up, 50), [26, 4])), hF = frame(HC, hA, H); // the hood bowed forward and down
  const SN = S.at(-0.36, 0.14), EN = [356, 404], WN = [448, 372];
  const SF = S.at(0.42, 0.1), EF = [318, 398], WF = [262, 470];
  const HN = S.at(-0.26, 1.0), KN = [262, 620], AN = [206, 744];
  const HF = S.at(0.3, 1.0), KF = [370, 612], AF = [392, 746];
  const c0 = [486, GY - 2], c1 = [452, 128], cA = ang(c0, c1); // the crook, planted ahead and leaned on
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('crook', WN, 'hand_n').joint('skirt', S.at(0, 0.86), 'pelvis').joint('lasso', S.at(0.3, 0.05), 'torso').joint('ruff', hF([[0.2, 0.1]])[0], 'head');
  const furTex = X.hairTex(90);

  // ---- far arm, swung back behind the body: fur sleeve, a mitten hanging from its cord
  const [cUF, cFF] = jcut(SF, EF, WF, 18);
  split(f, () => {
    f.part(jointLimb(SF, EF, WF, [50, 44, 40], { point: 0.3, mus0: 0.1, mus1: 0.1 }), FUR({ fill: mix(PAL.fur, PAL.furS, 0.25), tex: furTex, texOp: 0.25 }));
    creases(f, EF, ang(SF, WF) + 1.5, 22, 3, PAL.furD, 0.7);
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('hand_f');
  const mitF = [add(WF, [8, -14]), add(WF, [-14, 8]), add(WF, [-30, 34]), add(WF, [-26, 56]), add(WF, [-10, 62]), add(WF, [6, 50]), add(WF, [16, 30]), add(WF, [20, 4])];
  f.part(mitF, HIDE({ fill: mix(PAL.hide, PAL.hideS, 0.25), tex: 'mottle1203', texOp: 0.4 }));
  f.part([add(WF, [12, 26]), add(WF, [26, 30]), add(WF, [30, 44]), add(WF, [18, 46]), add(WF, [8, 38])], HIDE({ fill: mix(PAL.hide, PAL.hideS, 0.3), inkW: 1.1, cast: false })); // the thumb stall
  f.line([add(WF, [-8, 10]), add(WF, [-14, 40])], 1, PAL.hideD, { op: 0.6 });
  X.locks([add(WF, [12, -12]), add(WF, [-16, 4])], 4, 12, 18, 9, { cast: false });

  // ---- legs: fur trousers into knee-high leg-skin boots, fur out
  const leg = (Hp, Kn, A, sfx, tone) => {
    const [cT, cS] = jcut(Hp, Kn, A, 24);
    split(f, () => {
      f.part(jointLimb(Hp, Kn, A, [70, 56, 46], { point: 0.25, mus0: 0.12, mus1: 0.2 }), FUR({ fill: mix(PAL.fur, PAL.furS, tone), tex: furTex, texOp: 0.25 }));
      creases(f, Kn, ang(Hp, A) + 1.57, 24, 3, PAL.furD, 0.7);
    }, [['thigh' + sfx, cT], ['shin' + sfx, cS]]);
    split(f, () => furBoot(f, X, Kn, A, 56, tone, furTex), [['shin' + sfx, side(A, [0.3, -1], 18)], ['foot' + sfx, side(A, [-0.3, 1], 18)]]);
  };
  leg(HF, KF, AF, '_f', 0.22);
  leg(HN, KN, AN, '_n', 0.04);

  // ---- parka skirt: fur-out, long, frozen as it swung back on the last step; a mosaic hem band; clumped hem
  f.bone('skirt');
  const hemB = clumpEdge(f, [[160, 660], [236, 654], [300, 606]], 7, 9), hemF = clumpEdge(f, [[300, 606], [318, 638], [396, 650], [436, 646]], 7, 9);
  const sk = [S.at(-0.86, 0.72), S.at(0.86, 0.72), S.at(1.0, 0.9), [436, 600], ...hemF.slice().reverse(), ...hemB.slice().reverse(), [158, 620], [184, 560]];
  f.part(sk, FUR({ tex: furTex, texOp: 0.22 }));
  X.furField(sk, 90, 30, { dir: p => [-(p[1] - 470) * 0.004, 1] });
  clipDraw(f, sk, () => {
    for (const q of [[[214, 520], [196, 600], [180, 652]], [[250, 520], [244, 640]], [[384, 530], [404, 600], [416, 642]], [[346, 530], [352, 640]]]) { f.stroke(q, 9, PAL.furS, { op: 0.45 }); f.line(q.map(v => add(v, [-6, 0])), 1.2, '#ffffff', { op: 0.8 }); }
    // the dark mosaic band above the hem: black short-haired hide set with small white diamonds
    const hb = [[150, 600], [300, 580], [450, 588]], hb2 = hb.map(q => add(q, [0, 18]));
    f.part([...hb, ...hb2.slice().reverse()], { fill: '#2e3034', shadow: '#121216', shade: 0.3, inkW: 1.1, cast: false });
    for (let i = 0; i < 20; i++) { const t = (i + 0.5) / 20, c = add(t < 0.5 ? lerp(hb[0], hb[1], t * 2) : lerp(hb[1], hb[2], t * 2 - 1), [0, 9]); f.flat([add(c, [0, -5]), add(c, [4, 0]), add(c, [0, 5]), add(c, [-4, 0])], '#ecedea', { op: 0.9 }); }
    f.stroke([[300, 560], [302, 606], [312, 640]], 5, '#141418', { op: 0.85 }); // the split of the stride
  });
  X.lock(add(hemB[4], [0, -8]), 46, 15, { sway: -8, ice: 1, fill: mix(PAL.fur, PAL.furS, 0.15) }); X.lock(add(hemB[11], [0, -8]), 34, 13, { sway: -6, ice: 1 });
  X.lock(add(hemF[6], [0, -8]), 40, 14, { sway: -5, ice: 1, fill: mix(PAL.fur, PAL.furS, 0.15) }); X.lock(add(hemF[12], [0, -8]), 30, 12, { sway: -4 });
  X.icicles(hemB.slice(2, 12), 3, 20, 5); X.icicles(hemF.slice(3, 12), 3, 18, 5);

  // ---- torso: the parka body, the hood-ties and bone toggles, a belt with knife, amulets and the silent bell
  f.bone('torso');
  const tor = S.shape([[-0.14, 0.42, 0.46], [0.06, 0.92, 0.72], [0.3, 0.96, 0.86], [0.55, 0.88, 0.86], [0.8, 0.9, 0.9], [1.0, 0.92, 0.94]]);
  f.part(tor, FUR({ tex: furTex, texOp: 0.22 }));
  X.furField(tor, 80, 30, { dir: () => [0.12, 1] });
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-0.9, 0.1), S.at(-0.5, 0.0), S.at(-0.6, 0.9), S.at(-0.95, 0.9)], PAL.furS, 0.5, 14]]);
    f.stroke([S.at(0.5, 0.1), S.at(0.62, 0.45), S.at(0.58, 0.8)], 2.4, PAL.furD, { op: 0.7 }); // the front seam
  });
  X.rime([S.at(-0.4, -0.06), S.at(0.1, -0.12), S.at(0.6, -0.02), S.at(0.94, 0.2)], 11, -1);
  X.rime([S.at(0.95, 0.3), S.at(1.0, 0.6)], 7, -1);
  for (let i = 0; i < 3; i++) { const q = S.at(0.58, 0.16 + i * 0.13); f.part(ell(q, 4, 7, 0.2, 10), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1, cast: false }); f.line([add(q, [-8, 0]), add(q, [-3, 0])], 1.4, PAL.greyD); } // bone toggles
  f.bone('pelvis');
  const bl = [S.at(-0.95, 0.8), S.at(0.0, 0.83), S.at(0.96, 0.78), S.at(0.96, 0.87), S.at(0.0, 0.92), S.at(-0.97, 0.89)];
  f.part(bl, { fill: PAL.greyD, shadow: '#141418', shade: 0.35, tex: 'mottle1203', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 7; i++) { const q = S.at(-0.8 + i * 0.26, 0.855); f.part(ell(q, 6, 5, 0, 8), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 0.9, cast: false }); } // bone plaques on the belt
  // knife in a bone-mounted sheath, hanging from a strap at the back hip
  const kS = S.at(-0.7, 0.9), kF = frame(kS, deg(104), 1);
  f.line([S.at(-0.7, 0.86), kS], 2.2, PAL.greyD);
  f.part(kF([[0, -10], [80, -8], [96, 0], [80, 8], [0, 10]]), { fill: '#3a3c40', shadow: '#16161a', shade: 0.4, inkW: 1.2, tex: 'mottle1203' });
  for (const t of [16, 50]) f.part(kF([[t, -11], [t + 8, -11], [t + 8, 11], [t, 11]]), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 0.9, cast: false, sharp: true });
  f.part(kF([[-40, -7], [0, -8], [0, 8], [-40, 7]]), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 1.1, cast: false });
  for (let i = 0; i < 3; i++) f.line(kF([[-34 + i * 11, -7], [-32 + i * 11, 7]]), 1, PAL.boneD, { op: 0.7 });
  // the bell: a reindeer bell of hammered iron, its mouth empty: the clapper is gone, and so is the sound
  const bt = S.at(0.3, 0.92);
  f.line([bt, add(bt, [2, 26])], 2, PAL.greyD);
  const bc = add(bt, [2, 26]), bF = frame(bc, 0.05, 1);
  f.part(bF([[-7, 0], [7, 0], [12, 24], [18, 38], [-18, 38], [-12, 24]]), { fill: PAL.iron, shadow: PAL.ironD, light: '#8a8e92', shade: 0.35, inkW: 1.3, tex: 'mottle1203', texOp: 0.6 });
  f.flat(bF(ell([0, 38], 18, 4.5, 0, 14)), PAL.void);
  f.line(bF([[-10, 10], [-14, 32]]), 1.2, '#c8ccd0', { op: 0.6 });
  X.icicle(bF([[-14, 40]])[0], 12, 4); X.icicle(bF([[10, 40]])[0], 9, 3.5);
  // bone amulets on sinew at the hip: a carved reindeer and a disc with a hole through it
  const am = S.at(0.0, 0.92);
  f.line([am, add(am, [-4, 20]), add(am, [2, 34])], 1.2, PAL.greyD); f.line([am, add(am, [8, 24])], 1.2, PAL.greyD);
  f.part([add(am, [-10, 30]), add(am, [10, 30]), add(am, [12, 42]), add(am, [-8, 46])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1, cast: false });
  f.line([add(am, [-6, 36]), add(am, [6, 36])], 1, PAL.boneD, { op: 0.8 });
  f.part(ell(add(am, [9, 30]), 7, 7, 0, 12), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1, cast: false }); f.flat(ell(add(am, [9, 30]), 2.4, 2.4, 0, 8), PAL.void);

  // ---- the lasso: braided hide rope coiled over the far shoulder and across the chest, the bone slide on it
  f.bone('lasso');
  const lc = S.at(-0.62, 0.48);
  for (let i = 0; i < 4; i++) { const e = ell(add(lc, [i * 3 - 4, i * 3]), 34 - i * 2, 58 - i * 2, 0.25, 24); f.line(e.concat([e[0]]), 6.5, INK); f.line(e.concat([e[0]]), 4.4, PAL.hide); f.line(e.slice(14, 22), 1.2, '#ffffff', { op: 0.8 }); }
  const sl = add(lc, [10, 56]);
  f.part([add(sl, [-9, -6]), add(sl, [9, -8]), add(sl, [10, 8]), add(sl, [-8, 9])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1.1, cast: false });
  f.flat(ell(sl, 3, 3, 0, 8), PAL.void);
  X.icicles([add(lc, [-24, 46]), add(lc, [0, 60]), add(lc, [22, 50])], 3, 16, 4);
  rope(f, [add(SN, [6, -8]), S.at(0.1, 0.2), S.at(0.62, 0.5), S.at(0.8, 0.7)], 4, PAL.hide); // the coil's carrying loop across the chest

  // ---- the hood: stiff with frost, holding the shape of a head that is not there; its opening is flat void
  f.bone('head');
  const hood = hF([[-0.48, 0.42], [-0.56, 0.08], [-0.5, -0.24], [-0.3, -0.48], [-0.02, -0.58], [0.24, -0.52], [0.42, -0.34], [0.52, -0.06], [0.5, 0.22], [0.4, 0.46], [0.16, 0.62], [-0.14, 0.62], [-0.36, 0.56]]);
  f.part(hood, FUR({ tex: furTex, texOp: 0.22 }));
  X.furField(hood, 34, 20, { dir: p => sub(p, hF([[-0.1, -0.1]])[0]) });
  clipDraw(f, hood, () => {
    softTone(f, E.smooth(hood), [[hF([[-0.6, -0.1], [-0.3, -0.2], [-0.2, 0.6], [-0.6, 0.6]]), PAL.furS, 0.5, 12]]);
    f.stroke(hF([[-0.4, -0.3], [-0.12, -0.5], [0.2, -0.48]]), 2.2, PAL.furD, { op: 0.6 }); // the crown seam
  });
  X.rime(hF([[-0.34, -0.5], [-0.02, -0.62], [0.26, -0.56], [0.46, -0.36], [0.56, -0.08]]), 10, 1);
  // the ruff: a thick band of wolverine fur round the opening, lumpy, guard hairs frozen into clumps
  f.bone('ruff');
  const RC = [0.26, 0.2], ruff = [];
  for (let i = 0; i < 34; i++) { const t = i / 34 * Math.PI * 2, r = 1 + 0.07 * Math.sin(t * 7 + 1) + (f.r() - 0.5) * 0.08; ruff.push(rot([Math.cos(t) * 0.37 * r, Math.sin(t) * 0.47 * r], -0.2)); }
  const ruffS = hF(ruff.map(q => add(q, RC)));
  f.part(ruffS, FUR({ fill: mix(PAL.fur, PAL.furS, 0.08), tex: furTex, texOp: 0.3, k: 1 }));
  clipDraw(f, ruffS, () => { const c = hF([RC])[0]; for (let i = 0; i < 40; i++) { const a = f.r() * 6.28, p = add(c, rot([0, 0], 0)), q0 = hF([add(RC, rot([Math.cos(a) * 0.3, Math.sin(a) * 0.4], -0.2))])[0], d = E.norm(sub(q0, c)); f.stroke([q0, add(q0, mul(d, 10 + f.r() * 8))], 3, PAL.furD, { op: 0.5 }); f.line([add(q0, [1.5, -1.5]), add(add(q0, mul(d, 9)), [1.5, -1.5])], 1, '#ffffff', { op: 0.8 }); } });
  // the opening: the hood's inner lining shows round its upper rim; inside it, nothing, cut off clean
  f.part(hF(ell(RC, 0.26, 0.35, -0.2, 26)), { fill: PAL.furS, shadow: PAL.furD, shade: 0.4, inkW: 1.6, inkHeavy: 2.4, cast: false, tex: furTex, texOp: 0.4 });
  const op = hF(ell([0.3, 0.25], 0.21, 0.29, -0.2, 26));
  X.voidPatch(op, { rim: false, w: 1.4 });
  f.line(hF(ell([0.3, 0.25], 0.225, 0.305, -0.2, 26)).slice(9, 20), 1.3, '#ffffff', { op: 0.9 }); // the clean rim where the head was taken
  for (const [u, l, w] of [[0.02, 30, 15], [0.4, 36, 14]]) X.lock(hF([[0.26 + u * 0.6, 0.2 + 0.4]])[0], l, w, { sway: 2, ice: 0.8, fill: mix(PAL.fur, PAL.furS, 0.1) });

  // ---- near arm forward onto the crook: fur sleeve, mittened fist square to the pole
  const [cUN, cFN] = jcut(SN, EN, WN, 20);
  split(f, () => {
    f.part(jointLimb(SN, EN, lerp(EN, WN, 0.9), [70, 58, 52], { point: 0.35, mus0: 0.16, mus1: 0.14 }), FUR({ tex: X.hairTex(80), texOp: 0.22, maxShade: 20 }));
    X.furField(jointLimb(SN, EN, lerp(EN, WN, 0.9), [70, 58, 52]), 30, 22, { dir: () => [0.3, 1] });
    creases(f, EN, ang(SN, WN), 26, 3, PAL.furD, 0.7);
    f.stroke([lp(SN, EN, 0.2, 18), lp(SN, EN, 0.7, 20)], 2.2, PAL.furD, { op: 0.6 });
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('torso'); // the shoulder of the parka, rimed, stays with the body
  X.rime([add(SN, [-20, -14]), add(SN, [14, -26]), add(SN, [42, -20])], 9, -1);
  f.bone('upperarm_n');
  X.locks([lp(SN, EN, 0.4, -26), lp(SN, EN, 0.95, -24)], 3, 14, 24, 11, { ice: 0.6, cast: false });
  f.bone('forearm_n');
  const cuffA = lerp(EN, WN, 0.62);
  f.part(K.ragLimb(f, lerp(EN, WN, 0.55), lerp(EN, WN, 0.86), 50, 54, { depth: 7 }), FUR({ fill: mix(PAL.fur, PAL.furS, 0.15) }));
  X.locks([lp(EN, WN, 0.6, -26), lp(EN, WN, 0.9, -28)], 3, 14, 26, 10, { ice: 0.6, cast: false });
  X.rime([lp(EN, WN, 0.15, 22), lp(EN, WN, 0.7, 26)], 7, 1);

  // ---- the crook: a birch pole, hooked at the top, a bone knob below the hook, lashings and a bone ferrule
  f.bone('crook');
  f.part(limb(c0, c1, 15, 13, { steps: 10 }), { fill: PAL.wood, shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood1203' });
  for (let i = 0; i < 9; i++) { const t = 0.05 + f.r() * 0.9; f.line([lp(c0, c1, t, -5), lp(c0, c1, t + 0.004, 2)], 1.6, '#2e2e30', { op: 0.7 }); } // birch bark marks
  const hk = [c1, add(c1, [10, -34]), add(c1, [40, -50]), add(c1, [68, -36]), add(c1, [72, -6]), add(c1, [58, 14])];
  f.part(tube(spline(hk, 6), spline(hk, 6).map((_, i, a) => 14 - 4 * i / a.length)), { fill: PAL.wood, shadow: PAL.woodD, light: '#a6a6a0', shade: 0.35, tex: 'wood1203' });
  f.part(ell(lp(c0, c1, 0.96, 0), 12, 10, cA, 12), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1.2, cast: false }); // the bone knob
  for (const t of [0.5, 0.53, 0.56, 0.86, 0.89]) f.line([lp(c0, c1, t, -9), lp(c0, c1, t + 0.008, 9)], 3, PAL.greyD, { straight: true });
  f.part([lp(c0, c1, 0.0, -9), lp(c0, c1, 0.06, -9), lp(c0, c1, 0.06, 9), lp(c0, c1, 0.0, 9)], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1.1, cast: false, sharp: true });
  X.rime([lp(c0, c1, 0.6, 8), lp(c0, c1, 0.98, 8), add(c1, [12, -40]), add(c1, [44, -54]), add(c1, [74, -36])], 6, -1);
  X.icicles(spline(hk, 6).slice(-8).map(q => add(q, [0, 6])), 3, 22, 5);
  X.icicles([lp(c0, c1, 0.62, -8), lp(c0, c1, 0.8, -8)], 2, 16, 4);

  f.bone('hand_n');
  const g = B.grip(f, WN, EN, cA, 30, PAL.hide, { tex: 'mottle1203', texOp: 0.4, shadow: PAL.hideS, name: 'wanderer crook' });
  fistDetail(f, g, 30, PAL.hide, { wrinkle: true, nail: PAL.hide });
  X.rime([g.F([[-0.4, -0.7]])[0], g.F([[0.3, -0.85]])[0]], 5, 1);

  // ---- snow underfoot, no shadow; the feet sink into it
  f.bone('root');
  snowGround(f, 90, 560, GY, { prints: [[120, 22], [150, 20]] });
  f.bone('foot_n'); snowLip(f, [AN[0] + 20, GY + 3], 90, 9);
  f.bone('foot_f'); snowLip(f, [AF[0] + 22, GY + 3], 84, 8);
  f.bone('crook'); snowLip(f, [c0[0], GY + 3], 34, 8);
  return f;
}


// ------------------------------------------------------------------ THE PALE HUNTER (Elite 2.0)
// A tundra hunter kneeling over the tracks of the warm, bow drawn. The void took its face: from brow to chin the front
// of the head is cut away flat, a smooth black plane with a clean rim, the skull, ear and hair left round it. Long white
// furs: a knee-length parka of bear fur with a back flap trailing on the snow, the hood thrown back, bear-fur trousers,
// sealskin boots. An Arctic bow of spliced antler and bone backed with a braided sinew cable, canted forward; a sealskin
// quiver of ice-tipped arrows; slit goggles of bone hanging at the throat, no longer needed. Rime on the windward
// faces, the long hair and the fringes frozen plumb with icicles.
// Rig: standard humanoid + bow (hand_n), string (bow), arrow (hand_f), quiver, hood, hair, flap. The string's two runs
// meet at the draw hand: in the game the string is a two-point line from the bow tips to hand_f (see review).
function paleHunter() {
  const CH = TIERS.elite[1], GY = CH - 30;
  const f = new Fig(base(1201, CH, { grimeY: GY - 260 }));
  const X = fx(f, 1.6);
  const H = 200, furTex = X.hairTex(90);
  const N = [548, 612], C = [478, 800], P = [470, 1000];
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = 0.04, HC = add(N, add(mul(up, 112), [20, 0])), hF = frame(HC, hA, H);
  // the bow is in the far hand, out in front; the near arm draws, its elbow high and back, the hand anchored under the chin
  const SF = S.at(0.42, 0.1), EF = [786, 690], WF = [944, 672];
  const SN = S.at(-0.25, 0.12), WN = [598, 650], EN = [372, 612]; // the upper arm points back and away, so it is foreshortened
  const HN = S.at(-0.2, 1.0), KN = [760, 962], AN = [806, 1262];
  const HF = S.at(0.32, 1.0), KF = [602, 1318], AF = [300, 1318];
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the bow: canted 22 deg, top forward; drawn, so both limbs bend back toward the archer; the tips recurve forward
  const u = [Math.sin(deg(30)), -Math.cos(deg(30))], bk = [-Math.cos(deg(30)), -Math.sin(deg(30))], GR = add(WF, [4, 0]);
  const bowPt = sN => { const a = Math.abs(sN), bend = 120 * a * a - (a > 0.88 ? (a - 0.88) * 260 : 0); return add(add(GR, mul(u, sN * 440)), mul(bk, bend)); };
  const bowC = []; for (let i = 0; i <= 40; i++) bowC.push(bowPt(-1 + i / 20));
  const tipT = bowPt(1), tipB = bowPt(-1);
  const nock = add(WN, [8, -6]), rest = add(GR, [-2, -26]), aD = E.norm(sub(rest, nock)), aTip = add(rest, mul(aD, 86));
  f.joint('bow', WF, 'hand_f').joint('string', WF, 'bow').joint('arrow', WN, 'hand_n').joint('quiver', S.at(-0.7, 0.2), 'torso').joint('hood', S.at(-0.4, -0.02), 'torso').joint('hair', hF([[-0.3, -0.2]])[0], 'head').joint('flap', S.at(-0.5, 0.95), 'pelvis');

  // ---- quiver on the back, behind everything: sealskin, a stiff bow-case mouth, ice-tipped arrows, fletching
  f.bone('quiver');
  const q0 = S.at(-0.9, -0.15), q1 = S.at(-1.25, 0.7), qd = E.norm(sub(q1, q0)), qn = [-qd[1], qd[0]];
  for (let i = 0; i < 4; i++) { const a0 = add(q0, mul(qn, -20 + i * 14)), a1 = add(a0, mul(qd, -90 - i * 14)); f.line([a0, a1], 5, INK); f.line([a0, a1], 3, PAL.wood); f.part([add(a1, mul(qn, -10)), add(add(a1, mul(qd, -46)), mul(qn, -4)), add(add(a1, mul(qd, -54)), mul(qn, 6)), add(a1, mul(qn, 8))], { fill: i % 2 ? PAL.grey : PAL.fur, shadow: PAL.furS, shade: 0.35, inkW: 1, cast: false }); f.line([add(a1, mul(qd, -4)), add(a1, mul(qd, -50))], 1, PAL.greyD); }
  const quiv = [add(q0, mul(qn, -30)), add(q0, mul(qn, 34)), add(q1, mul(qn, 24)), add(add(q1, mul(qd, 20)), mul(qn, 0)), add(q1, mul(qn, -22))];
  f.part(quiv, HIDE({ fill: '#cfcfca', tex: 'mottle1201', texOp: 0.5 }));
  clipDraw(f, quiv, () => { for (let i = 0; i < 5; i++) f.line([add(lerp(q0, q1, 0.15 + i * 0.17), mul(qn, -34)), add(lerp(q0, q1, 0.17 + i * 0.17), mul(qn, 36))], 1.4, PAL.hideD, { op: 0.55 }); f.stroke([add(q0, mul(qn, 10)), add(q1, mul(qn, 8))], 7, PAL.hideS, { op: 0.4 }); });
  f.part([add(q0, mul(qn, -38)), add(q0, mul(qn, 42)), add(add(q0, mul(qd, 30)), mul(qn, 40)), add(add(q0, mul(qd, 30)), mul(qn, -36))], { fill: PAL.grey, shadow: '#121216', shade: 0.3, inkW: 1.2, cast: false });
  for (let i = 0; i < 6; i++) f.flat(ell(add(add(q0, mul(qd, 15)), mul(qn, -28 + i * 13)), 2.4, 2.4, 0, 6), '#f2f2f0');
  X.icicles([add(q1, mul(qn, -26)), add(q1, mul(qn, 28))], 3, 30, 7);

  // ---- far arm: the bow arm, straight out past the chest, a bone bracer on the forearm
  const [cUF, cFF] = jcut(SF, EF, WF, 30);
  split(f, () => {
    f.part(jointLimb(SF, EF, lerp(EF, WF, 0.88), [108, 92, 80], { point: 0.3, mus0: 0.14, mus1: 0.16 }), FUR({ fill: mix(PAL.fur, PAL.furS, 0.12), tex: X.hairTex(10), texOp: 0.22, maxShade: 30 }));
    X.furField(jointLimb(SF, EF, lerp(EF, WF, 0.88), [108, 92, 80]), 24, 34, { dir: () => [0.2, 1], w: 4.5 });
    creases(f, EF, ang(SF, WF), 44, 3, PAL.furD, 0.7);
  }, [['upperarm_f', cUF], ['forearm_f', cFF]]);
  f.bone('upperarm_f');
  X.rime([lp(SF, EF, 0.3, -50), lp(SF, EF, 0.95, -44)], 12, 1);
  f.bone('forearm_f');
  f.part([lp(EF, WF, 0.3, -40), lp(EF, WF, 0.78, -36), lp(EF, WF, 0.78, 36), lp(EF, WF, 0.3, 40)], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 1.4, tex: 'mottle1201', texOp: 0.4 }); // bone bracer
  for (let i = 1; i < 4; i++) f.line([lp(EF, WF, 0.3 + i * 0.12, -38), lp(EF, WF, 0.3 + i * 0.12, 38)], 1.4, PAL.boneD, { op: 0.7 });
  for (const t of [0.36, 0.72]) f.line([lp(EF, WF, t, -42), lp(EF, WF, t, 42)], 3.4, PAL.greyD);
  X.fringe([lp(EF, WF, 0.0, 44), lp(EF, WF, 0.3, 42)], 3, 26, 54, { ice: 0.4, tex: furTex, fill: mix(PAL.fur, PAL.furS, 0.12) });
  // ---- the bow: spliced antler and bone, a braided sinew cable on its back, tally notches by the grip
  f.bone('bow');
  const bowW = bowC.map((_, i) => { const a = Math.abs(-1 + i / 20); return a < 0.12 ? 34 : 24 - a * 12; });
  f.part(ribbon(bowC, bowW), { fill: PAL.bone, shadow: PAL.boneS, light: '#f6f2e8', shade: 0.4, inkW: 1.6, inkHeavy: 2.6, tex: 'mottle1201', texOp: 0.5 });
  for (const t of [0.22, 0.38, 0.62, 0.78]) { const i = Math.round(t * 40); f.line([add(bowC[i], mul(bk, -14)), add(bowC[i], mul(bk, 14))], 1.6, INK, { op: 0.8 }); for (let k = -2; k <= 2; k++) f.line([add(bowC[i + k], mul(bk, -13)), add(bowC[i + k], mul(bk, 13))], 2, PAL.greyD, { op: 0.85 }); } // splices lashed with sinew
  f.line(bowC.slice(3, 38).map(q => add(q, mul(bk, 9))), 4, PAL.greyD, { op: 0.9 }); f.line(bowC.slice(3, 38).map(q => add(q, mul(bk, 9))), 1.4, '#c8c8c4', { op: 0.7, dash: '3 3' }); // the sinew cable
  for (let i = 0; i < 9; i++) f.line([add(bowC[16 + i], mul(bk, -12)), add(bowC[16 + i], mul(bk, 12))], 1, PAL.boneD, { op: 0.7 });
  X.rime(bowC.slice(2, 18).map(q => add(q, mul(bk, -14))), 7, 1);
  X.icicles(bowC.slice(22, 36).map(q => add(q, mul(bk, -10))), 3, 30, 6);
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, ang(tipB, tipT), 46, PAL.hide, { tex: 'mottle1201', texOp: 0.4, shadow: PAL.hideS, name: 'hunter bow' });
  fistDetail(f, gF, 46, PAL.hide, { nail: PAL.hide });
  X.rime([gF.F([[-0.4, -0.7]])[0], gF.F([[0.3, -0.85]])[0]], 7, 1);

  // ---- far leg kneeling: knee on the snow, shin and boot lying back along it, sole up
  const [cTF, cSF] = jcut(HF, KF, AF, 40);
  split(f, () => {
    f.part(jointLimb(HF, KF, AF, [150, 112, 84], { point: 0.3, mus0: 0.14, mus1: 0.2 }), FUR({ fill: mix(PAL.fur, PAL.furS, 0.22), tex: furTex, texOp: 0.22 }));
    creases(f, KF, ang(HF, AF) + 1.57, 44, 3, PAL.furD, 0.7);
  }, [['thigh_f', cTF], ['shin_f', cSF]]);
  f.bone('foot_f');
  const ftF = [add(AF, [30, -46]), add(AF, [-30, -52]), add(AF, [-120, -40]), add(AF, [-176, -18]), add(AF, [-182, 10]), add(AF, [-150, 22]), add(AF, [-20, 32]), add(AF, [40, 26])];
  f.part(ftF, HIDE({ fill: mix(PAL.hide, PAL.hideS, 0.2), tex: 'mottle1201', texOp: 0.5 }));
  f.line([add(AF, [-176, -14]), add(AF, [-100, -36]), add(AF, [-10, -46])], 1.2, '#f0f0f0', { op: 0.7, dash: '3 4' }); // the crimped sole seam, sole up
  for (let i = 0; i < 4; i++) f.line([add(AF, [-160 + i * 30, -18]), add(AF, [-150 + i * 30, 14])], 1.1, PAL.hideD, { op: 0.6 });

  // ---- the back flap of the parka, trailing on the snow behind, stiff
  f.bone('flap');
  const flap = [S.at(-0.7, 0.86), S.at(-0.2, 0.92), [340, 1240], [240, 1330], [130, 1356], [96, 1340], [150, 1270], [260, 1110]];
  f.part(flap, FUR({ tex: furTex, texOp: 0.22 }));
  X.furField(flap, 50, 50, { dir: p => [-0.6, 1], w: 5 });
  X.locks([[96, 1344], [130, 1358], [200, 1350]], 3, 20, 34, 22, { cast: false, dir: [-0.4, 1], ice: 0.5 });

  // ---- torso and skirt: long bear-fur parka to the knee, the hood thrown back, fringes frozen plumb
  f.bone('torso');
  const tor = S.shape([[-0.12, 0.44, 0.5], [0.06, 0.9, 0.74], [0.3, 0.94, 0.92], [0.55, 0.86, 0.9], [0.8, 0.9, 0.88], [1.0, 0.94, 0.9]]);
  f.part(tor, FUR({ tex: furTex, texOp: 0.22 }));
  X.furField(tor, 110, 46, { dir: () => [0.1, 1], w: 5 });
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-1, 0.1), S.at(-0.4, 0.05), S.at(-0.5, 0.95), S.at(-1, 0.95)], PAL.furS, 0.45, 24]]);
    for (let i = 0; i < 3; i++) f.stroke([S.at(-0.6 + i * 0.4, 0.35), S.at(-0.5 + i * 0.4, 0.6), S.at(-0.55 + i * 0.4, 0.85)], 9, PAL.furS, { op: 0.4 });
  });
  X.rime([S.at(0.0, -0.08), S.at(0.5, 0.0), S.at(0.92, 0.25), S.at(0.95, 0.55)], 16, -1);
  f.bone('pelvis');
  const skirt = [S.at(-0.94, 0.74), S.at(0.9, 0.74), S.at(1.05, 0.95), [760, 1080], [720, 1118], [600, 1150], [520, 1160], [420, 1150], [360, 1110], S.at(-1.05, 1.0)];
  f.part(skirt, FUR({ tex: furTex, texOp: 0.22 }));
  X.furField(skirt, 70, 46, { dir: () => [0, 1], w: 5 });
  X.fringe([[360, 1110], [460, 1150], [560, 1154], [660, 1136], [760, 1080]], 11, 26, 80, { ice: 0.35, tex: furTex });
  // belt: braided sinew with ivory toggles; a knife in a bone sheath; a pair of ivory birds; a hare frozen stiff
  const bl = [S.at(-0.96, 0.78), S.at(0.0, 0.81), S.at(0.95, 0.77), S.at(0.95, 0.85), S.at(0.0, 0.89), S.at(-0.97, 0.86)];
  f.part(bl, { fill: PAL.greyD, shadow: '#141418', shade: 0.35, tex: 'hatch1201', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 14; i++) f.line([S.at(-0.9 + i * 0.13, 0.79), S.at(-0.85 + i * 0.13, 0.86)], 1.2, '#9a9c9e', { op: 0.6, straight: true });
  const kS = S.at(0.6, 0.86), kF = frame(kS, deg(70), 1);
  f.part(kF([[0, -14], [130, -10], [150, 0], [130, 10], [0, 14]]), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 1.3, tex: 'mottle1201' });
  for (const t of [30, 80]) f.line(kF([[t, -12], [t + 4, 12]]), 2.4, PAL.greyD);
  f.part(kF([[-54, -10], [0, -12], [0, 12], [-54, 10]]), { fill: PAL.boneD, shadow: '#2a2a2a', shade: 0.4, inkW: 1.2, cast: false });
  const am = S.at(-0.2, 0.88);
  f.line([am, add(am, [-6, 40])], 1.6, PAL.greyD); f.line([am, add(am, [14, 34])], 1.6, PAL.greyD);
  for (const [dx, dy, a0] of [[-6, 40, 0.3], [14, 34, -0.2]]) { const c = add(am, [dx, dy + 12]); f.part([add(c, rot([-16, -6], a0)), add(c, rot([-4, -12], a0)), add(c, rot([10, -8], a0)), add(c, rot([18, -14], a0)), add(c, rot([16, 2], a0)), add(c, rot([-10, 8], a0))], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1.1, cast: false }); } // carved ivory birds
  // a hare hung from the belt by its hind feet, frozen stiff, its fur white on white
  const hr = S.at(-0.62, 0.88);
  f.line([hr, add(hr, [-4, 30])], 2, PAL.greyD);
  const hare = [add(hr, [-12, 28]), add(hr, [6, 26]), add(hr, [16, 70]), add(hr, [26, 140]), add(hr, [18, 200]), add(hr, [-4, 216]), add(hr, [-22, 196]), add(hr, [-30, 130]), add(hr, [-22, 70])];
  f.part(hare, FUR({ tex: furTex, texOp: 0.3 }));
  f.part([add(hr, [-8, 200]), add(hr, [10, 206]), add(hr, [4, 250]), add(hr, [-6, 252])], FUR({ cast: false })); f.part([add(hr, [-22, 196]), add(hr, [-10, 210]), add(hr, [-24, 246]), add(hr, [-32, 240])], FUR({ cast: false })); // ears
  f.flat(ell(add(hr, [2, 226]), 3, 2, 0, 6), PAL.void); // a black-tipped ear, an eye
  f.flat([add(hr, [-4, 246]), add(hr, [6, 248]), add(hr, [4, 254]), add(hr, [-6, 252])], '#2a2a2e');
  X.icicle(add(hr, [-2, 254]), 22, 6);

  // ---- the hood thrown back onto the shoulders, its ruff stiff
  f.bone('hood');
  const hd = [S.at(-0.5, -0.08), S.at(-0.2, -0.2), S.at(-0.6, -0.28), S.at(-1.0, -0.08), S.at(-1.05, 0.2), S.at(-0.75, 0.24)];
  f.part(hd, FUR({ fill: mix(PAL.fur, PAL.furS, 0.12), tex: furTex, texOp: 0.25 }));
  f.part([S.at(-0.3, -0.16), S.at(-0.6, -0.22), S.at(-0.9, -0.04), S.at(-0.88, 0.06), S.at(-0.6, -0.04)], { fill: PAL.furS, shadow: PAL.furD, shade: 0.3, inkW: 1.2, cast: false, tex: furTex, texOp: 0.4 }); // the inside of the hood
  X.fringe([S.at(-1.04, 0.06), S.at(-1.05, 0.2), S.at(-0.8, 0.26)], 4, 16, 44, { ice: 0.4, fill: mix(PAL.fur, PAL.furS, 0.12) });

  // ---- near leg forward, knee up, boot planted
  const [cTN, cSN] = jcut(HN, KN, AN, 40);
  // (review: the thigh was a straight slab with a square knee and a row of teeth under it; it is now a rounded thigh,
  // the belly of the muscle full underneath, the knee a soft turn, long fur hanging from it in hanks)
  const thN = jointLimb(HN, KN, AN, [178, 130, 90], { point: 0.14, mus0: 0.36, mus0At: 0.42, mus1: 0.24 });
  split(f, () => {
    f.part(thN, FUR({ tex: furTex, texOp: 0.22, maxShade: 26 }));
    clipDraw(f, thN, () => softTone(f, E.smooth(thN), [[[lp(HN, KN, 0.1, -80), lp(HN, KN, 0.9, -70), lp(HN, KN, 0.9, -10), lp(HN, KN, 0.1, -20)], '#ffffff', 0.5, 18], [[lp(HN, KN, 0.1, 40), lp(HN, KN, 0.95, 40), lp(HN, KN, 0.95, 110), lp(HN, KN, 0.1, 110)], PAL.furS, 0.45, 18]]));
    creases(f, KN, ang(HN, AN) + 1.57, 44, 3, PAL.furD, 0.7);
  }, [['thigh_n', cTN], ['shin_n', cSN]]);
  f.bone('thigh_n');
  X.furField(thN, 40, 40, { dir: () => [0.4, 1], w: 5 });
  X.rime([lp(HN, KN, 0.3, -76), lp(HN, KN, 0.8, -70), add(KN, [10, -64])], 14, 1);
  X.hanks([lp(HN, KN, 0.45, 74), lp(HN, KN, 0.7, 82), lp(HN, KN, 0.92, 60)], 5, 50, 110, 24, 36, { ice: 0.4 });
  // the parka's front panel hangs over the top of the thigh from the belt (the parka is knee-length), its hem in hanks
  f.bone('pelvis');
  const pan = [S.at(-0.6, 0.8), S.at(0.7, 0.8), lp(HN, KN, 0.5, -90), lp(HN, KN, 0.56, 10), lp(HN, KN, 0.4, 70), lp(HN, KN, 0.1, 96), lp(HN, KN, -0.2, 90)];
  f.part(pan, FUR({ tex: furTex, texOp: 0.22, maxShade: 20 }));
  X.furField(pan, 30, 40, { dir: () => [0.1, 1], w: 5 });
  X.hanks([lp(HN, KN, -0.2, 84), lp(HN, KN, 0.1, 90), lp(HN, KN, 0.4, 64), lp(HN, KN, 0.56, 4)], 7, 40, 90, 24, 36, { ice: 0.35 });
  split(f, () => furBoot(f, X, KN, AN, 104, 0.08, furTex), [['shin_n', side(AN, [0.3, -1], 34)], ['foot_n', side(AN, [-0.3, 1], 34)]]);

  // ---- head: skull, ear and long frozen hair; the face cut away flat to a black plane
  f.bone('hair');
  // a single long braid hanging plumb down the back from the nape, tied with bone, frozen stiff
  const br0 = hF([[-0.34, 0.1]])[0], brC = [br0, add(br0, [-14, 120]), add(br0, [-20, 250]), add(br0, [-16, 360])];
  const brS = spline(brC, 8);
  for (let i = 0; i < brS.length - 1; i += 2) { const c = brS[i], w = 30 - i * 0.25; f.part([add(c, [-w / 2, -2]), add(c, [w / 2, 4]), add(c, [w / 2 - 2, 18]), add(c, [-w / 2 + 2, 14])], FUR({ fill: i % 4 ? PAL.fur : mix(PAL.fur, PAL.furS, 0.2), inkW: 1.1, inkHeavy: 1.6, cast: false })); }
  for (const t of [0.3, 0.75]) { const c = brS[Math.round(t * (brS.length - 1))]; f.part([add(c, [-18, -6]), add(c, [18, -4]), add(c, [17, 10]), add(c, [-17, 8])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.35, inkW: 1.2, cast: false }); }
  X.icicle(add(brS[brS.length - 1], [0, 8]), 40, 9);
  f.bone('head');
  f.part(limb(S.at(0.08, -0.02), hF([[-0.05, 0.36]])[0], 104, 92), { fill: '#c9cbcf', shadow: PAL.skinS, shade: 0.35, tex: 'mottle1201', texOp: 0.5 }); // neck
  const skull = hF([[-0.3, -0.42], [-0.06, -0.54], [0.2, -0.48], [0.34, -0.3], [0.36, -0.1], [0.35, 0.12], [0.33, 0.32], [0.28, 0.46], [0.12, 0.54], [-0.06, 0.48], [-0.2, 0.3], [-0.32, 0.08], [-0.38, -0.16]]);
  f.part(skull, { fill: '#c9cbcf', shadow: PAL.skinS, shade: 0.42, maxShade: H * 0.16, tex: 'mottle1201', texOp: 0.4 });
  // ear, the jaw's hinge and the cheekbone left behind the cut; frost-bite on what is left
  f.part(hF([[-0.17, -0.08], [-0.24, -0.06], [-0.27, 0.04], [-0.24, 0.14], [-0.18, 0.18], [-0.14, 0.1]]), { fill: mix(PAL.skin, PAL.bite, 0.3), shadow: PAL.skinS, shade: 0.5, inkW: 1.2, inkHeavy: 1.8, cast: false });
  f.line(hF([[-0.2, -0.04], [-0.23, 0.04], [-0.2, 0.12]]), 1.2, PAL.biteD, { op: 0.8 });
  f.stroke(hF([[-0.12, 0.2], [0.0, 0.4], [0.16, 0.5]]), 4, PAL.skinS, { op: 0.6 }); // the jaw line
  f.stroke(hF([[0.0, 0.04], [0.08, 0.12], [0.1, 0.26]]), 5, PAL.skinS, { op: 0.45 }); // under the cheekbone
  f.stroke(hF([[-0.06, -0.2], [0.04, -0.14]]), 4, PAL.skinS, { op: 0.4 }); // the temple's hollow
  for (let i = 0; i < 4; i++) f.line(hF([[-0.08 + i * 0.03, 0.3 + i * 0.03], [-0.02 + i * 0.03, 0.34 + i * 0.03]]), 1, PAL.biteD, { op: 0.5 }); // stubble frozen white
  X.bite(hF([[-0.1, 0.1]])[0], 16, 14, 4, 0.3);
  // the cut: the front of the head from the brow to under the chin is a flat black plane, rimmed clean
  const cut = hF([[0.16, -0.26, 1], [0.355, -0.27, 1], [0.37, 0.1], [0.345, 0.4, 1], [0.2, 0.53, 1], [0.15, 0.3], [0.13, 0.02]]); // a flat plane, sliced, hard corners at the brow and the chin
  X.voidPatch(cut, { rim: false, w: 2 });
  f.line(hF([[0.165, -0.24], [0.14, 0.02], [0.16, 0.3], [0.21, 0.5]]), 2, '#ffffff', { op: 0.95 });
  f.stroke(hF([[0.0, -0.36], [0.14, -0.38], [0.28, -0.32]]), 7, PAL.skinS, { op: 0.45 }); // the brow ridge left above the cut
  for (let i = 0; i < 3; i++) f.line(hF([[0.0, -0.3 + i * 0.05], [0.1, -0.31 + i * 0.05]]), 1, PAL.skinS, { op: 0.6 }); // the forehead's lines // the clean rim on the lit side of the cut
  // long white hair over the crown and down past the ear, frozen in clumps
  const hairTop = hF([[-0.1, -0.5], [-0.04, -0.56], [-0.22, -0.56], [-0.38, -0.42], [-0.42, -0.16], [-0.38, 0.12], [-0.32, 0.14], [-0.3, -0.06], [-0.22, -0.3]]); // pulled back off the brow, flat to the skull
  f.part(hairTop, FUR({ tex: X.hairTex(120), texOp: 0.35 }));
  X.furField(hairTop, 20, 30, { dir: p => sub(p, hF([[0.1, -0.5]])[0]), w: 4 });
  X.rime(hF([[-0.02, -0.56], [0.14, -0.5], [0.3, -0.34]]), 10, 1);
  // slit goggles of bone hanging at the throat on their sinew cord, no longer needed
  const gg = add(S.at(0.4, 0.02), [0, 26]);
  f.line([S.at(-0.1, -0.06), add(gg, [-40, -4])], 1.6, PAL.greyD); f.line([S.at(0.6, -0.08), add(gg, [40, -6])], 1.6, PAL.greyD);
  f.part([add(gg, [-44, -10]), add(gg, [44, -12]), add(gg, [46, 6]), add(gg, [6, 14]), add(gg, [-6, 14]), add(gg, [-46, 8])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 1.3, cast: false });
  f.flat([add(gg, [-34, -2]), add(gg, [-10, -3]), add(gg, [-10, 1]), add(gg, [-34, 2])], PAL.void); f.flat([add(gg, [10, -3]), add(gg, [34, -4]), add(gg, [34, 0]), add(gg, [10, 1])], PAL.void);

  // ---- the string of twisted sinew, from the tips to the nock under the chin, clear of the cut face
  f.bone('string');
  f.line([tipT, nock, tipB], 3.2, INK); f.line([tipT, nock, tipB], 1.4, '#b8b8b4', { straight: true });
  // ---- the arrow: driftwood shaft, white fletching, an ice head lashed on with sinew
  f.bone('arrow');
  f.line([nock, aTip], 7.5, INK); f.line([nock, aTip], 5, PAL.wood);
  f.line([add(nock, [2, -2]), add(aTip, [0, -2])], 1, '#c8c8c4', { op: 0.6 });
  for (const sg of [-1, 1]) f.part([add(nock, mul(rot(aD, sg * 0.5), 10)), add(nock, mul(aD, 70)), add(add(nock, mul(aD, 64)), mul([-aD[1] * sg, aD[0] * sg], 14)), add(add(nock, mul(aD, 12)), mul([-aD[1] * sg, aD[0] * sg], 16))], { fill: sg > 0 ? PAL.fur : PAL.grey, shadow: PAL.furS, shade: 0.3, inkW: 1, cast: false });
  const ah = frame(aTip, ang(nock, aTip), 1);
  f.part(ah([[-14, -7], [6, -9], [48, -2], [58, 0, 1], [48, 3], [6, 9], [-14, 7]]), X.IC({ fill: PAL.glaze, shade: 0.4, inkW: 1.3, inkHeavy: 2 }));
  f.line(ah([[0, -2], [52, 0]]), 1.2, '#ffffff', { op: 0.8 }); f.line(ah([[10, 5], [40, 2]]), 1, PAL.iceD, { op: 0.6 });
  for (let i = 0; i < 4; i++) f.line(ah([[-12 + i * 5, -8], [-10 + i * 5, 8]]), 1.6, PAL.greyD);

  // ---- near arm: the draw arm, folded, its elbow high and back; the bare hand hooked on the string under the chin
  const [cUN, cFN] = jcut(SN, EN, WN, 30);
  split(f, () => {
    f.part(jointLimb(SN, EN, lerp(EN, WN, 0.86), [112, 96, 82], { point: 0.45, mus0: 0.16, mus1: 0.2 }), FUR({ tex: furTex, texOp: 0.22, maxShade: 30 }));
    X.furField(jointLimb(SN, EN, lerp(EN, WN, 0.86), [112, 96, 82]), 30, 34, { dir: () => [0, 1], w: 4.5 });
    creases(f, EN, ang(SN, WN) + 1.4, 44, 3, PAL.furD, 0.7);
  }, [['upperarm_n', cUN], ['forearm_n', cFN]]);
  f.bone('upperarm_n');
  X.fringe([lp(SN, EN, 0.35, (EN[1] < SN[1] ? -1 : 1) * 54), add(EN, [-20, 40])], 5, 30, 80, { ice: 0.4, tex: furTex }); // the sleeve fringe hanging plumb under the raised arm
  X.rime([add(EN, [-30, -50]), add(EN, [20, -60]), lp(EN, WN, 0.3, -50)], 12, -1);
  f.bone('forearm_n');
  for (const t of [0.62, 0.7]) f.line([lp(EN, WN, t, -46), lp(EN, WN, t + 0.02, 46)], 3, PAL.furD, { op: 0.7 }); // the cuff's seam
  X.fringe([lp(EN, WN, 0.55, 48), lp(EN, WN, 0.85, 50)], 3, 24, 50, { ice: 0.5, tex: furTex });
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, deg(-90), 46, PAL.skin, { tex: 'mottle1201', texOp: 0.4, shadow: PAL.skinS, name: 'hunter draw' });
  fistDetail(f, gN, 46, PAL.skin, {});
  X.bite(gN.F([[0.4, 0]])[0], 14, 12, 4, 0.4);

  // ---- the tracks it kneels over: bare human feet in the snow, leading off toward the heroes; no shadow anywhere
  f.bone('root');
  const tr = [];
  for (let i = 0; i < 4; i++) tr.push([870 + i * 60 - (i % 2) * 10, 22 - (i % 2) * 6]);
  snowGround(f, 60, 1090, GY, { depth: 34, prints: tr });
  for (const [x] of tr) for (let k = 0; k < 4; k++) f.flat(ell([x + 20 + k * 3, GY + 2 - k * 1.6], 2, 1.4, 0, 6), PAL.snowD, { op: 0.8 }); // the toes of the warm one's tracks
  f.bone('foot_n'); snowLip(f, [AN[0] + 40, GY + 3], 170, 14);
  f.bone('shin_f'); snowLip(f, [KF[0], GY + 3], 120, 12);
  f.bone('foot_f'); snowLip(f, [AF[0] - 80, GY + 3], 200, 10);
  return f;
}

// ------------------------------------------------------------------ FROZEN SAINT (Human 1.0)
// The tundra folk's holy man, kneeling on both knees in the snow, face turned up to the black star, hands raised and
// pressed palm to palm, frozen together inside one lump of ice. It prayed for warmth: its stone lamp sits cold on the
// snow before it, and the bone sun-disc on its breast is all that is left of the sun it prayed to. Behind its head the
// halo is black frost where gold should be: a ring of black rime with a clean rim inside it (frost and void together).
// Robes of bleached hide frozen white over the kneeling legs, spread stiff on the snow; a fur collar; prayer beads.
// Rig: standard humanoid + halo (head), robe (pelvis), beads (hand_n). The hands are frozen together: the ice block is
// on hand_n, so in the game hand_f follows hand_n with IK (see review).
function frozenSaint() {
  const CH = TIERS.human[1], GY = CH - 30;
  const f = new Fig(base(1206, CH, { grimeY: 640 }));
  const X = fx(f);
  const H = 100, furTex = X.hairTex(90);
  const N = [312, 436], C = [288, 532], P = [290, 628]; // sitting back toward the heels
  const S = B.spine(N, C, P, H);
  const up = E.norm(sub(N, C));
  const hA = -0.22, HC = add(N, add(mul(up, 58), [6, 0])), hF = frame(HC, hA, H);
  const SN = S.at(-0.3, 0.12), EN = [360, 536], WN = [420, 446];
  const SF = S.at(0.42, 0.1), EF = [384, 528], WF = [430, 442];
  const HN = S.at(-0.2, 1.0), KN = [430, 760], AN = [236, 764];
  const HF = S.at(0.3, 1.0), KF = [452, 754], AF = [252, 758];
  humanJoints(f, { P, T: S.at(0, 0.8), N: S.at(0.05, -0.02), SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const HALO = add(HC, [-12, -6]);
  f.joint('halo', HALO, 'head').joint('robe', S.at(0, 0.84), 'pelvis').joint('beads', WN, 'hand_n');
  const ROBE = (o = {}) => HIDE(Object.assign({ fill: '#e6e6e2', tex: 'mottle1206', texOp: 0.35 }, o));

  // ---- the halo of black frost: a ring of black rime, lumpy feathers leaning windward on its outer edge, a clean
  // pale rim inside where the void has cut it; black icicles hang plumb from its lower arc
  f.bone('halo');
  const ho = [], hi = [];
  for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), r = 92 + 7 * Math.sin(t * 5 + 1.3) + 5 * Math.sin(t * 11) + f.r() * 6 + Math.max(0, c) * 10 + Math.max(0, -sn) * 6; ho.push(add(HALO, [c * r, sn * r])); hi.push(add(HALO, [c * 64, sn * 64])); } // lumpy black rime, thicker on the windward and upper side
  f.part([...ho, ho[0], ...hi.slice().reverse(), hi[hi.length - 1]].map(q => q), { fill: '#141416', shadow: '#000000', light: '#3a3c40', shade: 0.3, inkW: 1.6, inkHeavy: 2.6, cast: false, hatch: false, k: 0.9 });
  for (let i = 0; i < 30; i++) { const t = f.r() * Math.PI * 2, r = 72 + f.r() * 14, q = add(HALO, [Math.cos(t) * r, Math.sin(t) * r]); f.flat(ell(q, 3 + f.r() * 4, 2 + f.r() * 2, t, 6), '#4a4c52', { op: 0.7 }); } // grey frost lumps catching what light there is
  for (let i = 0; i < 12; i++) { const t = -Math.PI * 0.75 + i * 0.08, a = add(HALO, [Math.cos(t) * 80, Math.sin(t) * 80]); f.line([a, add(a, [Math.cos(t) * 20, Math.sin(t) * 20])], 1, '#6a6c72', { op: 0.6 }); }
  const ie = ell(HALO, 64, 64, 0, 32); f.line(ie.concat([ie[0]]), 1.8, '#ffffff', { op: 0.95 }); // the clean inner rim
  for (const t of [0.35, 0.5, 0.62, 0.78]) { const a = t * Math.PI, q = add(HALO, [Math.cos(a) * 104, Math.sin(a) * 104 - 6]); X.icicle(q, 18 + f.r() * 22, 7, { fill: '#2a2c30', shadow: '#050506' }); }

  // ---- the legs under the robe: knees on the snow, shins back along it, the soles of the boots turned up behind
  const leg = (Hp, Kn, A, sfx, tone) => {
    const [cT, cS] = jcut(Hp, Kn, A, 22);
    split(f, () => f.part(jointLimb(Hp, Kn, A, [76, 58, 44], { point: 0.3 }), HIDE({ fill: mix(PAL.hide, PAL.hideS, tone) })), [['thigh' + sfx, cT], ['shin' + sfx, cS]]);
    f.bone('foot' + sfx);
    const sole = [add(A, [16, -22]), add(A, [-20, -30]), add(A, [-70, -22]), add(A, [-84, 0]), add(A, [-66, 18]), add(A, [6, 20])];
    f.part(sole, HIDE({ fill: mix(PAL.hide, PAL.hideS, tone + 0.15), tex: 'mottle1206', texOp: 0.5 }));
    f.line([add(A, [-80, -2]), add(A, [-40, -16]), add(A, [0, -18])], 1.1, '#f0f0f0', { op: 0.7, dash: '3 3' });
    for (let i = 0; i < 3; i++) f.line([add(A, [-62 + i * 18, -16]), add(A, [-58 + i * 18, 12])], 1, PAL.hideD, { op: 0.55 });
  };
  leg(HF, KF, AF, '_f', 0.25); leg(HN, KN, AN, '_n', 0.12);

  // ---- the robe: frozen stiff over the kneeling legs and spread on the snow; seams, a patched knee, frost bloom
  f.bone('robe');
  const robe = [S.at(-0.78, 0.7), S.at(0.76, 0.7), S.at(0.9, 0.86), [400, 660], [462, 700], [496, 740], [508, GY - 6], [520, GY, 1], [470, GY + 3], [440, GY - 3], [370, GY - 6], [300, GY + 4], [250, GY - 4], [214, GY - 24, 1], [196, 730], [200, 680]]; // over the lap to the knees; lifted at the back off the heels
  f.part(robe, ROBE());
  clipDraw(f, robe, () => {
    softTone(f, E.smooth(robe), [[[[180, 640], [250, 640], [260, 790], [180, 790]], PAL.hideS, 0.45, 18], [[[300, 720], [500, 730], [500, 790], [300, 790]], PAL.hideS, 0.3, 12]]);
    for (const q of [[[236, 660], [226, 720], [224, 770]], [[270, 670], [290, 730], [300, 786]], [[350, 680], [400, 720], [440, 780]], [[400, 670], [450, 716], [480, 750]]]) { f.stroke(q, 8, PAL.hideS, { op: 0.45 }); f.line(q.map(v => add(v, [6, 0])), 1.2, '#ffffff', { op: 0.85 }); }
    f.stitches([[210, 740], [300, 716], [400, 720], [490, 748]], PAL.hideD, 1);
    f.part([[446, 724], [484, 732], [480, 766], [442, 762]], HIDE({ fill: '#d2d2cc', sharp: true, inkW: 1.1, cast: false })); f.stitches([[446, 724], [484, 732], [480, 766], [442, 762], [446, 724]], PAL.hideD, 0.9); // the knee patch, worn through by kneeling
    X.frost([340, 730], 120, 50, 30, 1.6);
    // a hem band of black sun-signs worked in dyed hide: a ring and its rays, one after another round the robe
    for (let i = 0; i < 9; i++) { const c = [232 + i * 31, GY - 16 - Math.sin(i * 0.9) * 3]; f.line(ell(c, 6, 5, 0, 10).concat([ell(c, 6, 5, 0, 10)[0]]), 1.6, '#2e3034'); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; f.line([add(c, [Math.cos(a) * 8, Math.sin(a) * 7]), add(c, [Math.cos(a) * 12, Math.sin(a) * 10])], 1.3, '#2e3034'); } }
    f.line([[214, GY - 34], [360, GY - 36], [500, GY - 30]], 1.6, '#2e3034', { op: 0.8 });
  });
  X.rime([[404, 660], [460, 698], [494, 736]], 5, -1);
  X.icicles([[214, GY - 24], [196, 730]], 2, 14, 4);

  // ---- torso: the robe body, a bone sun-disc on a thong at the breast, a fur collar, a cord belt
  f.bone('torso');
  const tor = S.shape([[-0.12, 0.4, 0.44], [0.06, 0.74, 0.62], [0.3, 0.76, 0.74], [0.55, 0.7, 0.72], [0.8, 0.78, 0.76], [1.0, 0.84, 0.8]]);
  f.part(tor, ROBE());
  clipDraw(f, tor, () => {
    softTone(f, E.smooth(tor), [[[S.at(-0.9, 0.1), S.at(-0.4, 0.05), S.at(-0.5, 0.95), S.at(-0.9, 0.95)], PAL.hideS, 0.5, 14]]);
    for (const [a, b2] of [[[0.2, 0.25], [0.45, 0.65]], [[-0.1, 0.3], [0.1, 0.7]], [[0.5, 0.3], [0.7, 0.55]]]) f.stroke([S.at(a[0], a[1]), S.at((a[0] + b2[0]) / 2 + 0.06, (a[1] + b2[1]) / 2), S.at(b2[0], b2[1])], 4, PAL.hideS, { op: 0.5 });
    f.stitches([S.at(0.56, 0.12), S.at(0.62, 0.45), S.at(0.6, 0.8)], PAL.hideD, 1);
  });
  X.rime([S.at(0.5, 0.06), S.at(0.84, 0.25), S.at(0.88, 0.6)], 8, -1);
  f.bone('pelvis');
  const cord = [S.at(-0.8, 0.78), S.at(0.0, 0.8), S.at(0.78, 0.76), S.at(0.78, 0.82), S.at(0.0, 0.86), S.at(-0.8, 0.84)];
  f.part(cord, { fill: PAL.greyD, shadow: '#141418', shade: 0.35, tex: 'hatch1206', texOp: 0.5, k: 0.6 });
  for (let i = 0; i < 11; i++) f.line([S.at(-0.76 + i * 0.14, 0.78), S.at(-0.72 + i * 0.14, 0.84)], 1, '#9a9c9e', { op: 0.6, straight: true });
  const kt = S.at(0.6, 0.82); f.part(ell(kt, 7, 6, 0, 10), { fill: PAL.greyD, shadow: '#141418', shade: 0.35, inkW: 1.1, cast: false });
  f.stroke([kt, add(kt, [2, 30]), add(kt, [-2, 58])], 4, PAL.greyD); f.stroke([kt, add(kt, [10, 26]), add(kt, [12, 44])], 3.4, PAL.greyD);
  X.icicle(add(kt, [-2, 60]), 14, 4);
  f.bone('torso');
  // the fur collar: a stiff ruff of white fur round the shoulders
  const col = [S.at(-0.7, -0.04), S.at(-0.3, -0.18), S.at(0.3, -0.16), S.at(0.7, -0.02), S.at(0.8, 0.12), S.at(0.3, 0.16), S.at(-0.4, 0.18), S.at(-0.78, 0.1)];
  f.part(col, FUR({ tex: furTex, texOp: 0.28 }));
  X.furField(col, 26, 14, { dir: () => [0.2, 1], w: 2.8 });
  X.fringe([S.at(-0.78, 0.1), S.at(-0.4, 0.2), S.at(0.3, 0.18), S.at(0.8, 0.12)], 9, 8, 22, { ice: 0.3, tex: furTex });
  // the sun-disc: bone, carved with rays, on a thong at the breast; a crack through it
  const sd = S.at(0.42, 0.36);
  f.line([S.at(0.1, 0.12), sd, S.at(0.7, 0.12)], 1.4, PAL.greyD);
  f.part(ell(sd, 17, 18, 0, 20), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 1.4, cast: false, tex: 'mottle1206', texOp: 0.4 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; f.line([add(sd, [Math.cos(a) * 8, Math.sin(a) * 8]), add(sd, [Math.cos(a) * 14, Math.sin(a) * 14])], 1.1, PAL.boneD, { op: 0.85 }); }
  f.part(ell(sd, 6, 6, 0, 12), { fill: PAL.boneS, shadow: PAL.boneD, shade: 0.3, inkW: 1, cast: false });
  f.line([add(sd, [-4, -17]), add(sd, [1, -4]), add(sd, [-2, 6]), add(sd, [3, 17])], 1.2, INK, { op: 0.85, straight: true });

  // ---- the head: an old man's face turned up, eyes shut, lips parted on the prayer; beard and brows frozen white
  f.bone('head');
  f.part(limb(S.at(0.12, -0.02), hF([[-0.05, 0.34]])[0], 50, 44), { fill: PAL.skin, shadow: PAL.skinS, shade: 0.35, tex: 'mottle1206', texOp: 0.5 });
  f.part(hF([[-0.3, -0.36], [-0.5, -0.1], [-0.56, 0.3], [-0.5, 0.7], [-0.3, 0.74], [-0.24, 0.3], [-0.2, -0.1]]), FUR({ fill: '#e2e4e6', shadow: '#a0a4aa', tex: X.hairTex(100), texOp: 0.4, hatch: false })); // long hair behind
  B.head(f, HC, H, hA, { skin: PAL.skin, jaw: 1.04, chin: 0.0, nose: 1.08, hook: 0.3, mouth: 'set', squint: 1, blind: true, browDown: -0.03, age: true, gaunt: true, faceShade: 0.72, jawShade: 0.45, hairCol: '#c8cacc', browCol: '#f4f4f2', noEar: true });
  // B.head tints the nose warm: lay the cold skin back over it
  const nz = 1.08, tipX = 0.395 * nz + 0.02 * (1 - nz);
  f.flat(hF([[0.30, -0.07], [0.335 + 0.015, -0.01], [tipX - 0.02, 0.09], [tipX + 0.005, 0.12], [tipX - 0.01, 0.155], [0.35, 0.168], [0.31, 0.163], [0.27, 0.15], [0.255, 0.12], [0.27, 0.09], [0.29, 0.02]]), PAL.skin, { op: 0.55 });
  f.flat(hF([[0.19, 0.3], [0.27, 0.297], [0.29, 0.33], [0.21, 0.335]]), PAL.skin, { op: 0.6 });
  // shut lids, lashes white with frost, frozen tears down the cheek
  f.line(hF([[0.05, -0.05], [0.11, -0.03], [0.17, -0.045]]), 1.8, INK); f.line(hF([[0.27, -0.05], [0.3, -0.04], [0.32, -0.05]]), 1.4, INK);
  f.line(hF([[0.05, -0.04], [0.11, -0.02], [0.17, -0.035]]), 1.2, '#ffffff', { op: 0.9 });
  f.flat(hF([[0.24, 0.27], [0.31, 0.27], [0.3, 0.33], [0.24, 0.33]]), PAL.void, { op: 0.85 }); // the mouth parted on the prayer
  X.bite(hF([[0.3, 0.0]])[0], 6, 5, 3, 0.2); X.bite(hF([[0.36, 0.1]])[0], 4, 3, 2, 0.4);
  X.cracks(hF([[0.12, 0.12]])[0], 10, 2, 0.6);
  // beard frozen into one mass, combed ridges, icicles plumb from it
  const beard = hF([[-0.14, 0.16], [0.02, 0.26], [0.18, 0.34], [0.3, 0.35], [0.36, 0.44], [0.34, 0.6], [0.24, 0.76], [0.1, 0.8], [-0.04, 0.66], [-0.14, 0.44]]); // short enough to clear the raised near sleeve
  f.part(beard, { fill: '#eef0f0', shadow: '#a4a8ae', shade: 0.4, tex: X.hoar, texOp: 0.4, inkW: 1.4, hatch: false });
  for (let i = 0; i < 6; i++) f.line(hF([[-0.06 + i * 0.065, 0.34 + (i % 2) * 0.04], [-0.04 + i * 0.07, 0.56], [0.0 + i * 0.06, 0.74]]), 1.1, '#5a5e64', { op: 0.6 });
  f.part(hF([[0.17, 0.22], [0.26, 0.2], [0.36, 0.22], [0.4, 0.28], [0.32, 0.29], [0.24, 0.27], [0.16, 0.3]]), { fill: '#eceeee', shadow: '#7c8088', shade: 0.4, inkW: 1.1, cast: false }); // moustache
  for (const [u, v, l] of [[0.02, 0.7, 16], [0.12, 0.78, 26], [0.24, 0.74, 20], [0.32, 0.58, 12]]) X.icicle(hF([[u, v]])[0], l, 5);
  // hair: thin, swept back from a high brow, a band of hide with bone pendants round the head
  f.part(hF([[0.1, -0.44], [-0.1, -0.54], [-0.34, -0.42], [-0.46, -0.16], [-0.4, 0.12], [-0.3, 0.08], [-0.28, -0.16], [-0.12, -0.36], [0.06, -0.38]]), FUR({ fill: '#d6d8da', tex: X.hairTex(140), texOp: 0.4 }));
  f.stroke(hF([[-0.44, -0.2], [-0.1, -0.38], [0.2, -0.4]]), 9, PAL.greyD);
  { const q = hF([[-0.4, -0.22]])[0]; f.line([q, add(q, [-2, 16]), add(q, [0, 30])], 1.4, PAL.greyD); f.part([add(q, [-5, 28]), add(q, [5, 28]), add(q, [0, 42])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 0.9, cast: false }); } // one bone pendant hanging plumb at the back of the band
  X.rime(hF([[-0.1, -0.56], [0.12, -0.5], [0.3, -0.34]]), 6, 1);

  // ---- the arms raised in prayer, sleeves fallen back to the elbow, the hands pressed together in one block of ice
  const arm = (Sh, El, Wr, sfx, tone) => {
    const [cU, cF] = jcut(Sh, El, Wr, 18);
    split(f, () => {
      f.part(jointLimb(Sh, El, lerp(El, Wr, 0.6), [48, 40, 36], { point: 0.3, mus0: 0.1 }), ROBE({ fill: mix('#e6e6e2', PAL.hideS, tone), maxShade: 16 }));
      creases(f, El, ang(Sh, Wr) + 1.4, 24, 3, PAL.hideD, 0.7);
    }, [['upperarm' + sfx, cU], ['forearm' + sfx, cF]]);
    f.bone('forearm' + sfx);
    f.part(jointLimb(lerp(El, Wr, 0.3), lerp(El, Wr, 0.65), add(Wr, mul(E.norm(sub(Wr, El)), 6)), [34, 30, 28]), { fill: PAL.skin, shadow: PAL.skinS, shade: 0.35, tex: 'mottle1206', texOp: 0.5 }); // the bare, thin wrist
    X.bite(lerp(El, Wr, 0.85), 8, 8, 3, 0.3);
    f.part(K.ragLimb(f, lerp(El, Wr, 0.2), lerp(El, Wr, 0.56), 44, 52, { depth: 9, teeth: 4 }), ROBE({ fill: mix('#e6e6e2', PAL.hideS, tone), maxShade: 14 })); // the sleeve fallen back
    X.icicles([lp(El, Wr, 0.2, 24), lp(El, Wr, 0.55, 28)], 3, 22, 5);
  };
  arm(SF, EF, WF, '_f', 0.2);
  f.bone('hand_f');
  openHand(f, WF, deg(-84), 74, { fill: mix(PAL.skin, PAL.bite, 0.25), shadow: PAL.skinS }, { back: false, flip: true, spread: 0.02, curl: 0.05 });
  arm(SN, EN, WN, '_n', 0);
  f.bone('hand_n');
  const hn = openHand(f, WN, deg(-86), 74, { fill: PAL.skin, shadow: PAL.skinS }, { back: true, spread: 0.02, curl: 0.06 });
  hn.fing.forEach(g => f.flat(ell(g.k3, 3.5, 3, 0, 8), PAL.biteD, { op: 0.55 }));
  // the ice: one lump round both hands, translucent and dirty, thick at the wrists, icicled plumb below
  const ice = [add(WN, [-30, 20]), add(WN, [-30, -40]), add(WN, [-20, -86]), add(WN, [0, -108]), add(WN, [26, -100]), add(WN, [40, -64]), add(WN, [44, -10]), add(WN, [36, 26]), add(WN, [4, 36])];
  f.part(ice, X.IC({ fill: PAL.glaze, opacity: 0.5, shade: 0.4, inkW: 1.4, inkHeavy: 2.2, k: 0.8 }));
  f.line([add(WN, [-18, -80]), add(WN, [-14, -20])], 1.6, '#ffffff', { op: 0.85 }); f.line([add(WN, [30, -70]), add(WN, [34, -20])], 1.2, PAL.iceD, { op: 0.6 });
  X.cracks(add(WN, [6, -50]), 22, 2, 1.2);
  X.rime([add(WN, [6, -108]), add(WN, [30, -98]), add(WN, [44, -62]), add(WN, [46, -12])], 8, -1);
  X.icicles([add(WN, [-28, 22]), add(WN, [4, 36]), add(WN, [34, 26])], 4, 34, 7);
  // prayer beads of bone wound round the wrists, the loop hanging plumb below the ice
  f.bone('beads');
  const bd = [add(WN, [-24, 18]), add(WN, [-30, 60]), add(WN, [-14, 100]), add(WN, [10, 92]), add(WN, [24, 54]), add(WN, [30, 20])];
  const bC = spline(bd, 9);
  f.line(bC, 1.2, PAL.greyD);
  for (let i = 0; i < bC.length; i += 1) f.part(ell(bC[i], 4.6, 4.2, 0, 8), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false });
  const bt = bC[Math.floor(bC.length / 2)]; f.line([bt, add(bt, [0, 16])], 1.2, PAL.greyD); f.part([add(bt, [-5, 14]), add(bt, [5, 14]), add(bt, [0, 30])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.4, inkW: 1, cast: false });

  // ---- before it on the snow: the soapstone lamp, cold, its wick-ledge black; a bone bowl with frozen fat
  f.bone('root');
  snowGround(f, 80, 596, GY, {});
  const lp0 = [548, GY - 4];
  f.part([add(lp0, [-46, -18]), add(lp0, [44, -22]), add(lp0, [40, -4]), add(lp0, [30, 4]), add(lp0, [-36, 4]), add(lp0, [-48, -6])], { fill: PAL.grey, shadow: PAL.greyD, light: '#a8aaac', shade: 0.4, tex: 'mottle1206', texOp: 0.6, inkW: 1.5 });
  f.flat([add(lp0, [-40, -18]), add(lp0, [38, -22]), add(lp0, [30, -16]), add(lp0, [-34, -13])], '#5a5c60');
  f.flat([add(lp0, [24, -21]), add(lp0, [40, -22]), add(lp0, [36, -17]), add(lp0, [22, -17])], PAL.void); // the wick ledge, burnt black, cold
  X.frost(add(lp0, [0, -12]), 34, 6, 6, 1.2);
  f.bone('robe'); snowLip(f, [380, GY + 3], 250, 8);
  return f;
}

// ------------------------------------------------------------------ SILENCE STAG (Large 1.5)
// A white stag in its winter coat, head lowered, still as the snow; 1.5 humans to the antler tips (960 px), the withers
// at 565. Deer anatomy: the withers high over a deep chest that reaches the elbow, the belly tucked up into the flank,
// the back level to the croup and the rump rounding down to a short tail. The shoulder (blade and upper arm) and the
// haunch (thigh and hamstring) lie as masses on the flank. Each leg is one outline with its joints: in front the point
// of the elbow, the forearm's muscle, the knee knob, the thin cannon with its tendon, the fetlock and the sloped pastern;
// behind the stifle, the gaskin, the point of the hock, the cannon, the fetlock, the pastern. Cloven hooves with
// dewclaws stand sunk in the snow. A thick winter neck with a mane of long frozen hanks hanging from the throat.
// The antlers grow from furred pedicels through a knobbled coronet: each beam sweeps up and back, then forward at the
// crown; brow, bez and trez tines point forward, the royal higher, the crown forks; every tine curves upward and
// tapers, and no two are alike. Rime on the windward and upper faces, icicles plumb under the tines.
// Void: it has no shadow. Where its shadow should lie there is a clean-rimmed patch whiter than the snow round it.
// Rig: spine_1 (root, hindquarters) > spine_2 > neck > head > antler_n, antler_f, ear; tail; legs leg_<fn|ff|hn|hf>_1..3
// (front: upper arm > forearm > cannon and hoof, from the shoulder point, elbow, knee; hind: thigh > gaskin > cannon
// and hoof, from the hip, stifle, hock).
function silenceStag() {
  const CH = TIERS.large[1], GY = CH - 30;
  const f = new Fig(base(1204, CH, { grimeY: GY - 150 }));
  const X = fx(f, 1.2);
  const furTex = X.hairTex(100);
  const COAT = (o = {}) => FUR(Object.assign({ tex: furTex, texOp: 0.2 }, o));
  // legs: S top joint (point of shoulder / hip), E (elbow / stifle), K (knee / hock), F fetlock, Q end of the pastern
  const LEG = {
    fn: { S: [648, 694], E: [616, 796], K: [630, 912], F: [636, 1008], Q: [658, 1044] },
    hn: { S: [258, 606], E: [306, 762], K: [208, 880], F: [222, 1006], Q: [244, 1044] },
  };
  LEG.ff = Object.fromEntries(Object.entries(LEG.fn).map(([k, v]) => [k, add(v, [30, k === 'S' ? -4 : -8])]));
  LEG.hf = Object.fromEntries(Object.entries(LEG.hn).map(([k, v]) => [k, add(v, [30, k === 'S' ? -4 : -8])]));
  const poll = [706, 590], hA = deg(44), HC = add(poll, rot([96, 6], hA)), hF = frame(HC, hA, 1);
  const P0n = hF([[-58, -40]])[0], P0f = hF([[-48, -46]])[0];
  f.joint('spine_1', [300, 600]).joint('spine_2', [430, 600], 'spine_1').joint('neck', [600, 560], 'spine_2').joint('head', poll, 'neck').joint('tail', [150, 540], 'spine_1');
  f.joint('antler_n', P0n, 'head').joint('antler_f', P0f, 'head').joint('ear', hF([[-84, -30]])[0], 'head');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.S, par).joint(`leg_${k}_2`, L.E, `leg_${k}_1`).joint(`leg_${k}_3`, L.K, `leg_${k}_2`); }

  // ---- one leg as one outline from the top joint to the pastern, cut for the rig at the elbow (stifle) and the knee
  // (hock). P side = behind for a leg going down.
  const leg = (k, far, part = 3) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.32 : 0, look = COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 18 });
    const pts = [L.S, L.E, L.K, L.F, L.Q];
    const ws = front ? [118, 82, 46, 40, 30] : [176, 112, 52, 40, 30];
    const bp = front ? [[0, 1, 0.3, 0.07], [1, 0.12, 0.1, 0.1], [1, 1, 0.12, 0.05], [2, 1, 0.22, 0.05]] : [[0, 0.35, 0.22, 0.2], [1, 0.25, 0.3, 0.15], [1, 1, 0.5, 0.045], [2, 1, 0.22, 0.05]];
    const bq = front ? [[1, 0.2, 0.26, 0.12], [1, 1, 0.16, 0.05], [2, 1, 0.08, 0.05]] : [[0, 1, 0.14, 0.07], [1, 1, 0.1, 0.05], [2, 1, 0.08, 0.05]];
    const shape = K.chain(pts, ws, { bp, bq, steps: 12 });
    const [k1, k2] = jcut(L.S, L.E, L.K, ws[1] * 0.55), [c1, c2] = jcut(L.E, L.K, L.F, ws[2] * 0.6);
    const column = () => {
      f.part(shape, look);
      clipDraw(f, shape, () => {
        X.furField(shape, front ? 12 : 22, 22, { dir: () => [-0.15, 1], w: 3 });
        const d = E.norm(sub(L.F, L.K)), n = [-d[1], d[0]];
        f.line([add(lerp(L.K, L.F, 0.12), mul(n, ws[2] * 0.28)), add(lerp(L.K, L.F, 0.9), mul(n, ws[3] * 0.26))], 1.6, PAL.furD, { op: 0.6 }); // the tendon behind the cannon
        f.line([add(lerp(L.K, L.F, 0.12), mul(n, -ws[2] * 0.3)), add(lerp(L.K, L.F, 0.9), mul(n, -ws[3] * 0.3))], 1.3, '#ffffff', { op: 0.85 }); // the shin's lit edge
        crease(f, [lp(L.E, L.K, 0.98, -ws[2] * 0.5), lp(L.E, L.K, 1.02, 0), lp(L.E, L.K, 0.98, ws[2] * 0.5)], 1.8, { col: PAL.furD, op: 0.55 }); // the knee (hock)
        crease(f, [lp(L.K, L.F, 0.98, -ws[3] * 0.5), lp(L.K, L.F, 1.03, 0), lp(L.K, L.F, 0.98, ws[3] * 0.5)], 1.6, { col: PAL.furD, op: 0.5 }); // the fetlock
        if (front) crease(f, [lp(L.S, L.E, 0.9, ws[0] * 0.3), lp(L.E, L.K, 0.15, ws[1] * 0.1), lp(L.E, L.K, 0.4, -ws[1] * 0.1)], 2.4, { col: PAL.furD, op: 0.45 }); // the forearm's muscle
        else crease(f, [lp(L.E, L.K, 0.1, ws[1] * 0.3), lp(L.E, L.K, 0.5, ws[1] * 0.25), lp(L.E, L.K, 0.85, ws[2] * 0.3)], 2.4, { col: PAL.furD, op: 0.5 }); // the hamstring running to the point of the hock
      });
    };
    if (part & 1) split(f, column, [[`leg_${k}_1`, k1]]);
    if (!(part & 2)) return;
    split(f, column, [[`leg_${k}_2`, [k2, c1]], [`leg_${k}_3`, c2]]);
    f.bone(`leg_${k}_3`);
    // dewclaws behind the fetlock; the cloven hoof, its front wall sloped like the pastern, the two toes
    const dF = E.norm(sub(L.Q, L.F)), nF = [-dF[1], dF[0]];
    for (const o2 of [0, 7]) f.part([add(add(L.F, mul(nF, 16 + o2 * 0.3)), mul(dF, 6 + o2)), add(add(L.F, mul(nF, 30 + o2 * 0.3)), mul(dF, 14 + o2)), add(add(L.F, mul(nF, 26)), mul(dF, 24 + o2)), add(add(L.F, mul(nF, 14)), mul(dF, 16 + o2))], { fill: '#3a3c42', shadow: '#141418', light: '#7a7e84', shade: 0.3, inkW: 1, cast: false });
    const Q = L.Q, hv = (dx, col2) => [[Q[0] - 16 + dx, Q[1] - 4], [Q[0] + 8 + dx, Q[1] - 8], [Q[0] + 34 + dx, GY - 2, 1], [Q[0] + 30 + dx, GY + 2, 1], [Q[0] - 14 + dx, GY + 2, 1], [Q[0] - 20 + dx, GY - 12]];
    f.part(hv(-8, 0), { fill: mix('#3a3c42', '#000', 0.25), shadow: '#141418', light: '#6a6e74', shade: 0.35, inkW: 1.2, cast: false, grime: false }); // the far toe, behind
    f.part(hv(4, 0), { fill: '#3a3c42', shadow: '#141418', light: '#7a7e84', shade: 0.35, inkW: 1.4, cast: false, grime: false });
    f.line([[Q[0] + 2, Q[1] - 4], [Q[0] + 24, GY - 4]], 1.1, '#8a8e94', { op: 0.7 }); f.line([[Q[0] + 12, GY - 18], [Q[0] + 16, GY]], 1.2, INK, { op: 0.8 }); // horn grain, the cleft
    X.hanks([add(L.F, mul(nF, 20)), add(L.F, mul(nF, -20))], 2, 14, 26, 14, 20, { tone: tone + 0.05, ice: 0 }); // feathering over the fetlock
  };

  // ---- the antlers: pedicel, coronet, a beam sweeping up and back then forward at the crown; tines in order up the
  // beam, each curving upward and tapering; the crown forks. sc scales, flip mirrors small details (asymmetry).
  const antler = (P0, sc, tone, bone, alt) => {
    f.bone(bone);
    const look = { fill: mix('#e4e0d6', PAL.boneS, tone), shadow: mix(PAL.boneS, PAL.boneD, 0.3), light: '#f6f3ec', shade: 0.3, maxShade: 9, hatch: false, inkW: 1.5, inkHeavy: 2.4, tex: 'mottle1204', texOp: 0.35 };
    const bm = (alt ? [[0, 0], [6, -104], [-14, -222], [-50, -340], [-62, -446], [-34, -526]] : [[0, 0], [-50, -92], [-140, -192], [-222, -300], [-252, -412], [-232, -504], [-184, -560]]).map(q => add(P0, mul(q, sc)));
    const C = spline(bm, 6), n = C.length, W = C.map((_, i) => (30 - 15 * i / (n - 1)) * sc), at = t => Math.min(n - 1, Math.round(t * (n - 1)));
    // tines: [t on the beam, direction, length, upward curl]
    const tines = alt
      ? [[0.05, [1, -0.3], 160, 0.5], [0.15, [1, -0.5], 130, 0.5], [0.4, [0.9, -0.8], 140, 0.4], [0.62, [0.6, -1], 112, 0.35], [0.85, [0.9, -0.5], 82, 0.3], [0.94, [0.1, -1], 70, 0.2], [1.0, [-0.7, -1], 60, 0.2]]
      : [[0.04, [1, -0.25], 176, 0.5], [0.12, [1, -0.45], 142, 0.5], [0.36, [0.8, -0.8], 156, 0.4], [0.58, [0.5, -1], 132, 0.35], [0.8, [0.7, -0.8], 96, 0.3], [0.9, [0.1, -1], 80, 0.25], [1.0, [-0.6, -1], 66, 0.2]];
    const drawTine = ([t, d0, l, cu]) => {
      const i = at(t), b0 = C[i], d = E.norm(d0), tip = add(add(b0, mul(d, l * sc)), [0, -l * sc * cu * 0.5]); // each tine leaves the beam and curls upward toward its tip
      const mid = add(add(b0, mul(d, l * sc * 0.55)), [0, l * sc * cu * 0.06]);
      const tc = spline([add(b0, mul(d, -W[i] * 0.3)), mid, tip], 5), tw = tc.map((_, j) => { const u = j / (tc.length - 1); return Math.max(2.4, W[i] * (0.95 - 0.45 * Math.min(1, u * 4)) * (1 - u) ** 0.7); }); // a fillet where it leaves the beam
      f.part(ribbon(tc, tw), Object.assign({}, look, { k: 0.85 }));
      for (let j = 2; j < tc.length - 2; j += 3) f.line([lp(tc[j], tc[j + 1], 0, -tw[j] * 0.35), lp(tc[j], tc[j + 1], 0.5, tw[j] * 0.15)], 1, PAL.boneD, { op: 0.6 }); // grooves
      if (Math.abs(d[1]) < 0.7) X.rime(tc.slice(1, Math.round(tc.length * 0.6)).map((q, j) => add(q, [0, -tw[j + 1] * 0.45])), 4 * sc, d[0] > 0 ? -1 : 1);
      if (Math.abs(d[1]) < 0.8 && f.r() < 0.6) X.icicles(tc.slice(1, -1).map((q, j) => add(q, [0, tw[j + 1] * 0.42])), 2, 22 * sc, 4.5 * sc);
      return tip;
    };
    // tines that leave the near side of the beam go over it; the rest behind
    for (const tn of tines.filter((_, j) => j % 2)) drawTine(tn);
    f.part(ribbon(C, W), look);
    clipDraw(f, ribbon(C, W), () => {
      for (let i = 1; i < n - 1; i += 2) f.line([lp(C[i], C[i + 1], 0, -W[i] * 0.4), lp(C[i], C[i + 1], 0.6, W[i] * 0.2)], 1.1, PAL.boneD, { op: 0.6 });
      for (let i = 0; i < 14; i++) f.flat(ell(add(C[at(0.02 + i * 0.022)], [(f.r() - 0.5) * W[0] * 0.6, 0]), 2.6, 2, 0, 6), PAL.boneD, { op: 0.6 }); // pearling near the base
    });
    for (const tn of tines.filter((_, j) => !(j % 2))) drawTine(tn);
    X.rime(C.slice(2, Math.round(n * 0.7)).map((q, i) => add(q, [W[i + 2] * 0.32, -W[i + 2] * 0.22])), 6 * sc, -1);
    X.icicles(C.slice(Math.round(n * 0.3), n - 2).map(q => add(q, [W[0] * 0.2, 8 * sc])), 3, 26 * sc, 5 * sc);
    // the coronet: a knobbled burr where the antler leaves the pedicel
    f.part(ell(add(P0, [0, 4]), 24 * sc, 12 * sc, hA - 0.5, 16).map(q => add(q, [(f.r() - 0.5) * 5, (f.r() - 0.5) * 5])), Object.assign({}, look, { fill: mix('#d8d4ca', PAL.boneS, tone + 0.3), cast: false }));
  };
  const pedicel = (P0, tone) => { const b = add(P0, rot([0, 22], hA - 0.4)); f.part([add(P0, [-14, 0]), add(P0, [14, 2]), add(b, [16, 4]), add(b, [-16, 2])], COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 6, cast: false, inkW: 1.2 })); };

  // ---- far side first: far antler, far legs, tail
  f.bone('head'); pedicel(P0f, 0.3);
  antler(P0f, 0.77, 0.32, 'antler_f', true);
  leg('hf', true); leg('ff', true);
  leg('hn', false, 1); leg('fn', false, 1);
  f.bone('tail');
  const tl = [[176, 536], [150, 548], [138, 590], [150, 616], [170, 596], [182, 560]];
  f.part(tl, COAT({ fill: '#f8f8f6' }));
  X.hanks([[140, 600], [168, 606]], 2, 14, 30, 12, 18, { ice: 0.5 });

  // ---- the body: the withers high, the back level to the croup, the rump rounding to the tail; a deep chest to the
  // elbow, the belly tucked up into the flank. Cut for the rig at the loin.
  const torso = [[150, 530], [196, 510], [262, 504], [336, 512], [420, 520], [492, 512], [540, 500], [574, 496], [606, 506], [640, 534], [668, 612], [678, 686], [666, 748], [636, 788], [586, 808], [520, 802], [452, 790], [386, 768], [336, 748], [294, 740], [262, 752], [222, 744], [172, 706], [134, 650], [126, 590]];
  split(f, () => {
    f.part(torso, COAT({ maxShade: 26 }));
    X.furField(torso, 160, 30, { dir: p => [-0.4, 0.6 + (p[1] - 600) * 0.005], w: 3.4 });
    clipDraw(f, torso, () => {
      softTone(f, E.smooth(torso), [[[[340, 760], [470, 800], [600, 812], [650, 770], [560, 760], [440, 740]], PAL.furS, 0.55, 14], [[[250, 730], [330, 720], [340, 770], [260, 770]], PAL.furS, 0.6, 10], [[[340, 540], [520, 530], [520, 600], [340, 610]], '#ffffff', 0.5, 20]]);
      for (let i = 0; i < 5; i++) crease(f, [[452 + i * 24, 640 + i * 2], [460 + i * 22, 700], [454 + i * 20, 770 - i * 4]], 2, { col: PAL.furD, op: 0.3 }); // the ribs under the coat
      crease(f, [[350, 740], [330, 700], [300, 690]], 2.6, { col: PAL.furD, op: 0.5 }); // the fold of the flank in front of the stifle
      // an old scar on the flank; the stump of a hunter's arrow in the shoulder, its ice head long since broken
      f.stroke([[392, 660], [424, 672], [456, 676]], 5, '#fafafa'); f.line([[392, 660], [424, 672], [456, 676]], 1, INK, { op: 0.5 });
      f.flat(ell([430, 790], 70, 10, 0.05, 16), '#fbfbfb', { op: 0.55 }); // the pale belly
    });
  }, [['spine_1', side([400, 640], [-1, 0], 40)], ['spine_2', side([400, 640], [1, 0], 40)]]);
  // ---- the shoulder and haunch: masses lying on the flank, each with its own edge
  f.bone('spine_2'); // the blade and the haunch lie on the body (like shoulder armour, they stay with the torso when the leg swings)
  const shd = [[548, 516], [590, 512], [636, 560], [668, 640], [676, 700], [656, 760], [624, 800], [596, 790], [590, 730], [566, 640], [546, 570]];
  f.part(shd, COAT({ maxShade: 22, inkW: 1.2, inkHeavy: 1.8, cast: false }));
  X.furField(shd, 40, 26, { dir: () => [-0.3, 1], w: 3.2 });
  clipDraw(f, shd, () => { crease(f, [[560, 530], [590, 610], [626, 690]], 3, { col: PAL.furD, op: 0.55 }); softTone(f, E.smooth(shd), [[[[580, 700], [660, 700], [640, 800], [590, 800]], PAL.furS, 0.5, 12]]); }); // the spine of the blade, laid back
  f.bone('spine_1');
  const hch = [[200, 512], [262, 506], [312, 540], [336, 610], [330, 690], [312, 756], [286, 770], [250, 790], [222, 820], [196, 790], [160, 720], [140, 640], [150, 560]];
  f.part(hch, COAT({ maxShade: 26, inkW: 1.2, inkHeavy: 1.8, cast: false }));
  X.furField(hch, 50, 28, { dir: () => [-0.2, 1], w: 3.4 });
  clipDraw(f, hch, () => { crease(f, [[208, 540], [226, 640], [250, 740]], 3, { col: PAL.furD, op: 0.5 }); softTone(f, E.smooth(hch), [[[[140, 640], [200, 640], [220, 800], [150, 780]], PAL.furS, 0.5, 14]]); }); // the seam between the thigh and the hamstring
  softTone(f, E.smooth(hch), [[ell([176, 590], 34, 52, 0.1, 14), '#ffffff', 0.6, 10]]); // the pale rump patch, soft-edged
  // ---- the arrow stump and frost on the body
  f.bone('spine_2');
  const ar = [606, 640]; f.line([ar, add(ar, [-60, -44])], 6, INK); f.line([ar, add(ar, [-60, -44])], 4, PAL.wood); for (let i = 0; i < 3; i++) f.line([add(ar, [-6 - i * 4, -4 - i * 3]), add(ar, [-2 - i * 4, -8 - i * 3])], 1.5, PAL.greyD);
  f.part([add(ar, [-64, -46]), add(ar, [-84, -68]), add(ar, [-70, -52]), add(ar, [-88, -50])], { fill: PAL.fur, shadow: PAL.furS, shade: 0.3, inkW: 1, cast: false }); // fletching
  f.flat(ell(ar, 6, 4, 0.6, 8), PAL.greyD, { op: 0.8 });
  X.rime([[420, 520], [492, 512], [540, 500], [574, 496], [606, 506]], 10, -1);
  X.hanks([[392, 772], [452, 792], [520, 804], [586, 810]], 7, 24, 50, 16, 24, { ice: 0.3, tone: 0.08 }); // the longer winter hair along the belly
  f.bone('spine_1');
  X.rime([[150, 530], [196, 510], [262, 504], [336, 512], [420, 520]], 10, -1);

  // ---- near legs: the lower legs in front of the body and its shoulder and haunch
  leg('hn', false, 2); leg('fn', false, 2);

  // ---- the neck: thick in winter, carried forward and down; the mane of long frozen hanks hanging from the throat
  f.bone('neck');
  const neck = [[540, 502], [600, 506], [650, 532], [700, 570], [728, 606], [738, 652], [720, 700], [690, 712], [664, 700], [650, 660], [624, 612], [586, 566], [552, 540]];
  f.part(neck, COAT({ maxShade: 20 }));
  X.furField(neck, 50, 26, { dir: () => [-0.2, 1], w: 3.4 });
  clipDraw(f, neck, () => { crease(f, [[600, 540], [650, 590], [690, 640]], 2.6, { col: PAL.furD, op: 0.4 }); softTone(f, E.smooth(neck), [[[[650, 640], [740, 660], [720, 720], [650, 710]], PAL.furS, 0.5, 12]]); });
  X.rime([[560, 500], [610, 506], [660, 532], [706, 572]], 10, -1);
  X.hanks([[642, 640], [662, 690], [700, 712], [730, 700]], 10, 70, 150, 22, 34, { ice: 0.35 }); // the winter mane
  X.hanks([[600, 600], [640, 646]], 4, 60, 110, 22, 30, { ice: 0.3, tone: 0.1 });

  // ---- the head, lowered: a long skull, the forehead between the pedicels, the bridge of the nose, a black muzzle,
  // the eye small and dark in its socket, the tear gland's pit, the chin's beard
  f.bone('head');
  const head = hF([[-96, -30], [-70, -44], [-30, -44], [16, -38], [62, -28], [100, -18], [124, -8], [132, 6], [126, 20], [104, 28], [72, 30], [30, 36], [-10, 44], [-50, 48], [-84, 38], [-102, 12]]);
  f.part(head, COAT({ tex: furTex, texOp: 0.15, maxShade: 18 }));
  clipDraw(f, head, () => {
    softTone(f, E.smooth(head), [[hF([[-90, 20], [10, 30], [70, 40], [-80, 54]]), PAL.furS, 0.55, 8]]);
    crease(f, hF([[-50, 4], [-10, 10], [30, 14]]), 2.2, { col: PAL.furD, op: 0.5 }); // the cheek's edge
    crease(f, hF([[-36, -36], [10, -30], [60, -22]]), 1.8, { col: PAL.furD, op: 0.35 }); // the bridge of the nose
    f.flat(hF([[88, -16], [126, -6], [134, 8], [126, 22], [100, 24], [94, 6]]), '#2a2c30'); // the black muzzle
    f.flat(hF(ell([116, 0], 6, 3.5, 0.3, 8)), PAL.void); f.line(hF([[112, -6], [124, -2]]), 1, '#9a9ea4', { op: 0.7 }); // nostril
    f.line(hF([[90, 22], [110, 26], [126, 22]]), 1.4, INK, { op: 0.7 }); // the lip line
    f.flat(hF([[2, -24], [24, -20], [28, -12], [6, -10]]), PAL.furD, { op: 0.6 }); // the tear gland's pit
  });
  f.flat(hF(ell([-20, -16], 10, 6.5, 0.1, 12)), '#1a1a1e'); f.flat(hF(ell([-17, -18], 2.4, 1.6, 0, 6)), '#7a7e84'); f.line(hF([[-32, -21], [-20, -25], [-8, -20]]), 1.6, INK); f.line(hF([[-32, -23], [-20, -27], [-8, -22]]), 1.2, '#ffffff', { op: 0.9 }); // the eye, frost on the lashes
  X.rime(hF([[-70, -46], [-20, -46], [30, -38], [80, -26]]), 6, -1);
  X.hanks(hF([[-74, 42], [-40, 48], [-6, 46]]), 4, 30, 64, 14, 20, { ice: 0.4 }); // the beard of the throat
  X.icicles(hF([[60, 32], [96, 28]]), 2, 16, 4);
  f.bone('ear');
  const eb = hF([[-80, -34]])[0];
  const ear = [eb, add(eb, [-58, -36]), add(eb, [-92, -24]), add(eb, [-74, -2]), add(eb, [-16, 14])];
  f.part(ear, COAT({ maxShade: 10 }));
  f.flat([lerp(ear[0], ear[2], 0.2), lerp(ear[1], ear[2], 0.5), lerp(ear[3], ear[2], 0.4)], PAL.furS, { op: 0.6 });
  X.hanks([add(eb, [-90, -20]), add(eb, [-40, 4])], 2, 14, 26, 10, 14, { ice: 0.5 });
  f.bone('head'); pedicel(P0n, 0);
  antler(P0n, 0.8, 0, 'antler_n', false);

  // ---- the snow: no tracks behind it. Its shadow is missing: a clean-rimmed shape whiter than the snow round it
  f.bone('root');
  const gp = snowGround(f, 60, 880, GY, { depth: 30 });
  clipDraw(f, gp, () => {
    f.flat([[60, GY - 10], [880, GY - 10], [880, GY + 40], [60, GY + 40]], PAL.snowS, { op: 0.35 });
    const sh = [[110, GY + 4], [220, GY - 2], [380, GY + 2], [520, GY - 2], [660, GY + 4], [780, GY + 10], [660, GY + 22], [480, GY + 26], [290, GY + 24], [140, GY + 18]];
    f.flat(sh, '#fdfdfd'); f.line(sh.concat([sh[0]]), 1.2, PAL.snowD, { op: 0.8 });
  });
  for (const k of ['hf', 'ff', 'hn', 'fn']) { f.bone(`leg_${k}_3`); snowLip(f, [LEG[k].Q[0] + 12, GY + 3], 70, 11); }
  return f;
}

// ------------------------------------------------------------------ VOID MAMMOTH (Elite 2.5)
// The last of a herd that died out an age ago, still walking its round. A woolly mammoth at its true 2.5: the hump of
// long hair over the shoulders stands 1600 px and breaks the top of the frame (the ruling: elites may be cropped by it).
// To fit the elite canvas it stands in three-quarter view, the body turned 60 deg toward the heroes and the head a
// further 8 deg, so it looks at them over its tusks. A weak perspective (camera 7000 px off, eye at a human's chest) makes
// the low hindquarters smaller and sets their feet further up the snow.
// Anatomy: the high domed skull with its topknot, the dip of the neck, the shoulder hump, the back falling to small low
// hips; a deep chest; column legs that keep their joints (the elbow point and wrist knob in front, the knee cap and the
// heel of the hock behind) on broad padded feet with nails. A trunk that tapers in wrinkled rings to a two-fingered tip.
// Tusks leave their sheaths down and outward, sweep forward and turn up and in at the tips.
// The coat: long hair in clumped, frozen hanks layered in tiers (a cape from the hump, a sheet over the flank, a skirt to
// the knees, a beard under the jaw, long hair down every leg), each hank hanging plumb and breaking the outline; rime on
// the windward and upper faces, icicles at the hank tips.
// Void: clean round holes go right through it where flesh has been unmade, the snow showing through; the far tusk ends
// in a clean flat cut where the void took the rest. No shadow.
// Rig: spine_1 (root, hindquarters) > spine_2 > neck > head > trunk_1..3, tusk_n, tusk_f, ear; tail; legs
// leg_<fn|ff|hn|hf>_1 (upper arm / thigh) > _2 (forearm / shin) > _3 (foot).
function voidMammoth() {
  // final pass 2026-11-25: the elite canvas is heightened from 1400 to 1700 at the same pixel scale (GUIDE 2, true size
  // wins), so the hump stands in frame instead of being cut flat by the frame top; together with the rounder, lower
  // hindquarters and the stepping legs below, this removes the 'rectangular flank on column legs' read at sheet size.
  const CH = 1700, GY = CH - 30, DY = CH - TIERS.elite[1];
  const f = new Fig(base(1202, CH, { grimeY: GY - 330 }));
  const X = fx(f, 1.6);
  const furTex = X.hairTex(92);
  const COAT = (o = {}) => FUR(Object.assign({ tex: furTex, texOp: 0.2 }, o));
  const HIDEG = (o = {}) => Object.assign({ fill: '#c9cbcf', shadow: '#5e6068', light: '#e8e8ea', shade: 0.36, tex: 'mottle1202', texOp: 0.55 }, o);
  const IVORY = (tone, o = {}) => Object.assign({ fill: mix(PAL.bone, PAL.boneS, tone), shadow: PAL.boneS, light: '#f6f2e8', shade: 0.4, maxShade: 16, inkW: 1.8, inkHeavy: 3, tex: 'mottle1202', texOp: 0.35 }, o);
  // ---- the view: a: forward, u: height above the snow, l: sideways (+ the near side)
  const TH = deg(60), DH = deg(8), DIST = 7000, EYE = 450, X0 = 560, NJ = 420;
  const cb = Math.cos(TH), sb = Math.sin(TH), Zref = 240 * sb + 210 * cb;
  const Kz = (a, l) => DIST / (DIST - (a * sb + l * cb - Zref));
  const P = (a, u, l = 0) => { const k = Kz(a, l); return [X0 + (a * cb - l * sb) * k, GY - EYE - (u - EYE) * k]; };
  const hA = (ah, l) => [NJ + ah * Math.cos(DH) - l * Math.sin(DH), ah * Math.sin(DH) + l * Math.cos(DH)];
  const PH = (ah, u, l = 0) => { const [a, ll] = hA(ah, l); return P(a, u, ll); };
  const KH = (ah, l = 0) => { const [a, ll] = hA(ah, l); return Kz(a, ll); };
  const PP = arr => arr.map(q => { const p = P(q[0], q[1], q[2] || 0); return q[3] ? [...p, 1] : p; });
  const PPH = arr => arr.map(q => { const p = PH(q[0], q[1], q[2] || 0); return q[3] ? [...p, 1] : p; });
  // legs: S shoulder (hip), E elbow (knee), W wrist (hock), T top of the foot, F the sole's centre on the snow
  const LEG3 = {
    fn: { S: [300, 1000, 215], E: [236, 640, 228], W: [286, 300, 216], T: [300, 150, 214], F: [308, 0, 212] }, // the near fore leg stepping into the sway
    hn: { S: [-440, 880, 170], E: [-360, 560, 200], W: [-490, 262, 200], T: [-452, 140, 200], F: [-440, 0, 200] }, // the hock angled back under the low hips
  };
  LEG3.ff = Object.fromEntries(Object.entries(LEG3.fn).map(([k, v]) => [k, [v[0], v[1], -v[2]]]));
  LEG3.hf = Object.fromEntries(Object.entries(LEG3.hn).map(([k, v]) => [k, [v[0], v[1], -v[2]]]));
  const LEG = Object.fromEntries(Object.entries(LEG3).map(([k, L]) => [k, Object.fromEntries(Object.entries(L).map(([j, v]) => [j, P(...v)])).valueOf()]));
  for (const [k, L] of Object.entries(LEG)) L.k = Kz(LEG3[k].F[0], LEG3[k].F[2]);

  const HJ = P(NJ, 1150, 0);
  f.joint('spine_1', P(-360, 1000, 0)).joint('spine_2', P(-80, 1100, 0), 'spine_1').joint('neck', P(340, 1180, 0), 'spine_2').joint('head', HJ, 'neck').joint('tail', P(-660, 1060, 60), 'spine_1');
  f.joint('trunk_1', PH(238, 900, 0), 'head').joint('trunk_2', PH(285, 560, 0), 'trunk_1').joint('trunk_3', PH(300, 290, 0), 'trunk_2');
  f.joint('tusk_n', PH(205, 760, 112), 'head').joint('tusk_f', PH(205, 760, -112), 'head').joint('ear', PH(-40, 1100, 215), 'head');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.S, par).joint(`leg_${k}_2`, L.E, `leg_${k}_1`).joint(`leg_${k}_3`, L.W, `leg_${k}_2`); }

  const hanks = X.hanks;
  // ---- one leg: a hair-covered column that keeps its joints, on a broad padded foot. Front: the point of the elbow
  // behind, the forearm's muscle in front below it, the wrist knob; hind: the knee cap in front, the calf behind, the
  // heel of the hock. Long hanks hang from the upper leg to the wrist, shorter fur below, a tuft over the foot.
  const leg = (k, far, part = 3) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.3 : 0.02, s = L.k;
    const look = COAT({ fill: mix(PAL.fur, PAL.furS, tone), maxShade: 30 });
    // the column: the upper arm (thigh), the forearm (shin) swelling under the elbow (knee) and narrowing to a waist above
    // the wrist (hock), the wrist knob (the heel of the hock behind), then flaring into the round foot on the snow
    const G = [L.F[0], L.F[1] + 6], M = lerp(L.E, L.W, 0.4), N = lerp(L.E, L.W, 0.84);
    const pts = [L.S, L.E, M, N, L.W, L.T, G];
    const ws = (front ? [262, 212, 180, 128, 162, 150, 262] : [232, 204, 160, 118, 150, 144, 240]).map(w => w * s);
    const bp = front ? [[0, 1, 0.24, 0.08], [3, 1, 0.08, 0.1]] : [[1, 0.6, 0.12, 0.3], [3, 1, 0.22, 0.08], [4, 0.3, 0.08, 0.2]];
    const bq = front ? [[1, 0.5, 0.1, 0.3], [3, 1, 0.1, 0.1]] : [[0, 1, 0.18, 0.08], [3, 1, 0.06, 0.1]];
    const shape = K.chain(pts, ws, { bp, bq, steps: 10 });
    const [k1, k2] = jcut(L.S, L.E, L.W, ws[1] * 0.55), [c1, c2] = jcut(L.E, L.W, L.T, ws[4] * 0.55);
    const fy = L.F[1], fx0 = L.F[0], fw = ws[6];
    const column = () => {
      f.part(shape, look);
      clipDraw(f, shape, () => {
        X.furField(shape, 30, 70 * s, { dir: () => [0.05, 1], w: 5 });
        // the elbow (knee) fold, the creases round the wrist (hock), the tendon's lit edge, the foot's wrinkled hide
        crease(f, [lp(L.E, L.W, 0.0, -ws[1] * 0.4), lp(L.E, L.W, 0.06, 0), lp(L.E, L.W, 0.0, ws[1] * 0.4)], 3, { col: PAL.furD, op: 0.45 });
        for (let i = 0; i < 3; i++) crease(f, [lp(N, L.T, -0.1 + i * 0.3, -ws[4] * 0.44), lp(N, L.T, -0.04 + i * 0.3, 0), lp(N, L.T, -0.1 + i * 0.3, ws[4] * 0.44)], 2.4, { col: PAL.furD, op: 0.5 });
        f.line([lp(L.E, L.W, 0.15, ws[2] * 0.3), lp(L.E, L.W, 0.8, ws[3] * 0.3)], 1.4, '#ffffff', { op: 0.6 });
        softTone(f, E.smooth(shape), [[[[fx0 - fw * 0.6, fy - 90 * s], [fx0 + fw * 0.6, fy - 90 * s], [fx0 + fw * 0.6, fy + 10], [fx0 - fw * 0.6, fy + 10]], PAL.furS, 0.55, 10]]);
        for (let i = 0; i < 3; i++) f.line([[fx0 - fw * 0.5, fy - 66 * s + i * 14 * s], [fx0, fy - 58 * s + i * 14 * s], [fx0 + fw * 0.5, fy - 68 * s + i * 14 * s]], 1.2, INK, { op: 0.4 });
        f.flat([[fx0 - fw * 0.6, fy - 16], [fx0 + fw * 0.6, fy - 20], [fx0 + fw * 0.6, fy + 12], [fx0 - fw * 0.6, fy + 12]], '#4a4c52', { op: 0.6 }); // the pad's rim
      });
      // broad flat nails across the front half of the foot (it faces forward and toward the heroes): four in front, three behind
      const nn = front ? 4 : 3;
      for (let i = 0; i < nn; i++) { const x = fx0 - fw * 0.1 + i * fw * (front ? 0.13 : 0.17), w = 38 * s; f.part([[x - w / 2, fy - 4, 1], [x - w * 0.52, fy - 14 * s], [x - w * 0.2, fy - 24 * s], [x + w * 0.3, fy - 23 * s], [x + w * 0.52, fy - 13 * s], [x + w / 2, fy - 4, 1]], { fill: mix(mix(PAL.bone, PAL.boneS, 0.3), PAL.boneS, tone), shadow: PAL.boneS, shade: 0.35, inkW: 1.2, cast: false }); }
    };
    // the upper leg goes under the body (drawn first); the lower leg and foot are drawn after the body
    if (part & 1) split(f, column, [[`leg_${k}_1`, k1]]);
    if (!(part & 2)) return;
    split(f, column, [[`leg_${k}_2`, [k2, c1]], [`leg_${k}_3`, c2]]);
    // long hanks from the upper leg falling to above the wrist (hock), so the joint shows; shorter below; a few over the foot
    f.bone(`leg_${k}_1`);
    hanks([lp(L.S, L.E, 0.86, ws[0] * 0.52), lp(L.S, L.E, 0.9, 0), lp(L.S, L.E, 0.86, -ws[0] * 0.52)], 5, 150 * s, 230 * s, 40 * s, 56 * s, { ice: 0.4, tone });
    f.bone(`leg_${k}_2`);
    hanks([lp(L.E, L.W, 0.4, ws[2] * 0.55), lp(L.E, L.W, 0.44, -ws[2] * 0.52)], 4, 70 * s, 120 * s, 32 * s, 44 * s, { ice: 0.4, tone: tone + 0.04 });
    f.bone(`leg_${k}_3`);
    hanks([lp(L.W, L.T, 0.5, ws[4] * 0.5), lp(L.W, L.T, 0.6, -ws[4] * 0.5)], 2, 60 * s, 96 * s, 34 * s, 46 * s, { tone: tone + 0.06, ice: 0.3 });
  };

  // ---- the tusks: ivory leaving its sheath down and outward, sweeping forward, turning up and in at the tip
  // drawn in screen space from the projected socket (a projected 3D lyre folds onto itself at this angle): the near tusk
  // sweeps down and out across the chest, round and up, its tip turned back in toward the face; the far one is cut short
  const TUSK = [[0, 0], [-18, 140], [-40, 290], [-64, 418], [-108, 500], [-168, 522], [-226, 482], [-262, 392], [-270, 282], [-248, 172], [-206, 92]];
  const tuskC = sg => { const S0 = PH(205, 760, 112 * sg); return spline(TUSK.map(q => add(S0, [q[0] * sg, q[1]])), 8); };
  const tusk = (sg, bone) => {
    f.bone(bone);
    let C = tuskC(sg);
    const near = sg > 0, cutAt = near ? C.length : Math.round(C.length * 0.2); // the far tusk: the void took it clean at its first bend
    C = C.slice(0, cutAt);
    const W = C.map((_, i) => (92 - (near ? 72 : 30) * i / (C.length - 1)) * KH(205, 112 * sg));
    const o = ribbon(C, W), look = IVORY(near ? 0 : 0.3);
    f.part(o, look);
    clipDraw(f, o, () => {
      for (let i = 2; i < C.length - 2; i += 3) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, -W[i] * 0.55)), add(add(C[i], mul(d, 5)), mul(n, 0)), add(C[i], mul(n, W[i] * 0.55))], 1.3, PAL.boneD, { op: 0.6 }); } // growth rings
      f.line(C.slice(1, -2).map((q, i) => { const d = E.norm(sub(C[Math.min(C.length - 1, i + 2)], C[i])); return add(q, mul([d[1], -d[0]], W[i + 1] * 0.28)); }), 2.2, '#ffffff', { op: 0.7 }); // the lit ridge
      if (near) { const q = C[Math.round(C.length * 0.42)]; f.line([q, add(q, [26, 10]), add(q, [36, 30]), add(q, [30, 50])], 1.4, INK, { op: 0.8, straight: true }); } // a long crack
      for (let i = 0; i < 6; i++) { const q = C[2 + Math.floor(f.r() * (C.length - 4))]; f.line([q, add(q, [6 + f.r() * 10, 2])], 1, PAL.boneD, { op: 0.6 }); } // nicks
    });
    // the sheath of hide the tusk leaves, a thick lip
    const s0 = C[0], d0 = E.norm(sub(C[2], C[0])), n0 = [-d0[1], d0[0]];
    const shc = add(s0, mul(d0, 6)), sha = Math.atan2(d0[1], d0[0]);
    f.part(ell(shc, W[0] * 0.38, W[0] * 0.64, sha, 16).map((q, i) => add(q, [(f.r() - 0.5) * 6, (f.r() - 0.5) * 6])), COAT({ fill: mix(PAL.fur, PAL.furS, near ? 0.12 : 0.35), cast: false, inkW: 1.3, maxShade: 10 })); // the sheath of hide the tusk leaves
    f.line(ell(add(shc, mul(d0, W[0] * 0.18)), W[0] * 0.22, W[0] * 0.5, sha, 14).slice(2, 12), 1.6, PAL.furD, { op: 0.6 }); // its lip
    hanks([add(add(s0, mul(n0, W[0] * 0.6)), mul(d0, -6)), add(add(s0, mul(n0, -W[0] * 0.6)), mul(d0, -6))], 2, 40, 80, 24, 32, { ice: 0, tone: near ? 0.1 : 0.35 });
    const e = C[C.length - 1], de = E.norm(sub(e, C[C.length - 2]));
    if (near) {
      f.flat([add(e, mul([-de[1], de[0]], -10)), add(e, mul(de, 10)), add(e, mul([-de[1], de[0]], 8))], PAL.boneD, { op: 0.8 }); // the worn, chipped tip
      X.rime(C.slice(Math.round(C.length * 0.45), Math.round(C.length * 0.85)).map((q, i) => add(q, [4, -W[Math.round(C.length * 0.45) + i] * 0.4])), 9, -1);
      X.icicles(C.slice(3, Math.round(C.length * 0.42)).map((q, i) => add(q, [0, W[3 + i] * 0.42])), 3, 40, 8);
    } else {
      // the clean cut: a flat face showing the ivory's rings, a pale rim; nothing ragged
      const ce = ell(e, W[W.length - 1] * 0.52, W[W.length - 1] * 0.3, Math.atan2(de[1], de[0]) + Math.PI / 2, 22);
      f.part(ce, { fill: '#efece2', shadow: PAL.boneS, shade: 0.2, maxShade: 4, inkW: 2, inkHeavy: 2.4, cast: false, hatch: false });
      for (const r of [0.75, 0.5, 0.26]) f.line(ell(e, W[W.length - 1] * 0.52 * r, W[W.length - 1] * 0.3 * r, Math.atan2(de[1], de[0]) + Math.PI / 2, 18).concat([ell(e, W[W.length - 1] * 0.52 * r, W[W.length - 1] * 0.3 * r, Math.atan2(de[1], de[0]) + Math.PI / 2, 18)[0]]), 1, PAL.boneS, { op: 0.8 });
      f.flat(ell(e, 4, 3, 0, 8), PAL.void);
      X.icicles(C.slice(2, -2).map((q, i) => add(q, [0, W[2 + i] * 0.42])), 2, 30, 7);
    }
  };

  // ---- the body, in 3D round its outline: the dip behind the head, the hump, the back falling to small low hips, the
  // buttock, the belly, the deep chest. Its top line is broken into frozen clumps.
  // cross-sections along the body (a: forward): the top line (the dip behind the head, the hump of hair, the back falling
  // to small low hips), the belly line, the half-width; each section is a pear (narrow over the spine, widest low on the
  // barrel). The outline is the hull of the projected sections, its upper edge broken into frozen clumps.
  const tab = T => a => { for (let i = 0; i < T.length - 1; i++) { const [a0, v0] = T[i], [a1, v1] = T[i + 1]; if (a <= a0 && a >= a1) { const t = (a0 - a) / (a0 - a1), e = t * t * (3 - 2 * t); return v0 + (v1 - v0) * e; } } return a > T[0][0] ? T[0][1] : T[T.length - 1][1]; };
  // (final pass) the back falls further to small, round, low hips and the belly tucks up into the flank, so the hindquarters
  // turn away as a rounded haunch instead of a tall flat end
  const TOPU = tab([[480, 1230], [440, 1272], [380, 1412], [300, 1556], [200, 1600], [100, 1572], [0, 1470], [-200, 1320], [-380, 1190], [-520, 1080], [-620, 970], [-690, 860], [-720, 760]]);
  const BOTU = tab([[480, 800], [400, 650], [300, 600], [100, 572], [-100, 590], [-300, 628], [-460, 680], [-580, 720], [-660, 740], [-720, 750]]);
  const WID = tab([[480, 170], [400, 240], [300, 274], [100, 296], [-100, 296], [-300, 270], [-460, 226], [-580, 180], [-660, 130], [-720, 60]]);
  const S3 = (a, th, out = 0) => { const t = TOPU(a), b = BOTU(a), w = WID(a) + out, uc = (t + b) / 2, hh = (t - b) / 2 + out, sn = Math.sin(th), cs = Math.cos(th); return [a, uc + hh * sn, w * cs * (1 - 0.42 * Math.max(0, sn) ** 1.5)]; };
  const PS = (a, th, out = 0) => P(...S3(a, th, out));
  const hull = (pts) => { const q = pts.slice().sort((A, B) => A[0] - B[0] || A[1] - B[1]), cr = (o2, a2, b2) => (a2[0] - o2[0]) * (b2[1] - o2[1]) - (a2[1] - o2[1]) * (b2[0] - o2[0]), lo = [], hi = []; for (const p2 of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p2) <= 0) lo.pop(); lo.push(p2); } for (const p2 of q.slice().reverse()) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p2) <= 0) hi.pop(); hi.push(p2); } return lo.slice(0, -1).concat(hi.slice(0, -1)); };
  const secPts = []; for (let a = -720; a <= 480; a += 20) for (let i = 0; i < 28; i++) secPts.push(PS(a, i / 28 * Math.PI * 2));
  const H0 = hull(secPts), HC = [], hc0 = H0.reduce((acc, q) => add(acc, mul(q, 1 / H0.length)), [0, 0]);
  // resample the hull; a long straight hull edge is bowed outward, so the rump and the back stay round (flesh, not facets)
  for (let i = 0; i < H0.length; i++) { const a2 = H0[i], b2 = H0[(i + 1) % H0.length], L2 = E.len(sub(b2, a2)), n2 = Math.max(1, Math.round(L2 / 16)), dd = E.norm(sub(b2, a2)); let nm = [dd[1], -dd[0]]; if (nm[0] * (a2[0] + b2[0] - 2 * hc0[0]) + nm[1] * (a2[1] + b2[1] - 2 * hc0[1]) < 0) nm = mul(nm, -1); for (let k = 0; k < n2; k++) HC.push(add(lerp(a2, b2, k / n2), mul(nm, Math.sin(Math.PI * k / n2) * Math.max(0, L2 - 60) * 0.06))); }
  const cen = HC.reduce((acc, q) => add(acc, mul(q, 1 / HC.length)), [0, 0]);
  const torso = HC.map((q, i) => { const pr = HC[(i - 1 + HC.length) % HC.length], nx = HC[(i + 1) % HC.length], d = E.norm(sub(nx, pr)); let nrm = [d[1], -d[0]]; if (nrm[0] * (q[0] - cen[0]) + nrm[1] * (q[1] - cen[1]) < 0) nrm = mul(nrm, -1); const up = -nrm[1]; return up > 0.35 ? add(q, mul(nrm, (i % 2 ? 16 + f.r() * 12 : -4) * Math.min(1, (up - 0.35) * 3))) : q; }); // tufted where the outline faces up
  // the holes, placed on the open flank between the legs (screen space; each tunnel runs nearly along the view, so the
  // snow shows through and a sliver of black tunnel wall shows on one side)
  const holes = [X.hole([350, 468 + DY], 100, 108, 0.1, [22, 12]), X.hole([432, 176 + DY], 56, 60, 0, [14, 8]), X.hole([262, 300 + DY + 30], 46, 50, 0, [12, 6])];
  const tailP = PS(-716, deg(40));

  X.cut(holes, () => {
    // ---- far legs, tail
    leg('hf', true); leg('ff', true); leg('hn', false, 1); leg('fn', false, 1);
    f.bone('tail');
    const tl = [add(tailP, [10, -10]), add(tailP, [-26, 30]), add(tailP, [-40, 120]), add(tailP, [-30, 190]), add(tailP, [-6, 120]), add(tailP, [12, 30])];
    f.part(tl, COAT({ fill: mix(PAL.fur, PAL.furS, 0.15) }));
    X.locks([add(tailP, [-44, 150]), add(tailP, [-14, 170])], 3, 60, 110, 30, { ice: 0.6, dir: [0, 1] }); // the tuft
    // ---- the body
    split(f, () => {
      f.part(torso, COAT({ maxShade: 50 }));
      X.furField(torso, 300, 80, { dir: () => [-0.12, 1], w: 6 });
      clipDraw(f, torso, () => {
        // form: the barrel turning under, the hindquarters falling away into shade, the hump lit
        softTone(f, E.smooth(torso), [[[PS(-640, deg(-30)), PS(300, deg(-30)), PS(400, deg(-80)), PS(-560, deg(-80))], PAL.furS, 0.55, 30], [[PS(-720, deg(60)), PS(-560, deg(60)), PS(-560, deg(-60)), PS(-720, deg(-60))], PAL.furS, 0.45, 30], [[PS(100, deg(80)), PS(380, deg(70)), PS(300, deg(30)), PS(60, deg(40))], '#ffffff', 0.45, 30]]);
        crease(f, [PS(330, deg(55)), PS(300, deg(25)), PS(290, deg(-10))], 5, { col: PAL.furD, op: 0.5 }); // the shoulder blade's edge under the hump
        crease(f, [PS(-520, deg(60)), PS(-560, deg(25)), PS(-560, deg(-15))], 5, { col: PAL.furD, op: 0.45 }); // the haunch
        for (let i = 0; i < 7; i++) { const a = -500 + i * 130; crease(f, [PS(a, deg(60)), PS(a + 10, deg(20)), PS(a - 6, deg(-30))], 4, { col: PAL.furD, op: 0.3 }); } // the hair parting in long hanging sheets
        // an old spear broken off in the hump, its bone head deep in the hide; the shaft lashed with sinew
        const sp0 = PS(40, deg(62)), sp1 = add(sp0, [-70, -120]);
        f.line([sp0, sp1], 12, INK); f.line([sp0, sp1], 8, PAL.wood); for (let i = 0; i < 3; i++) f.line([lerp(sp0, sp1, 0.2 + i * 0.07), add(lerp(sp0, sp1, 0.2 + i * 0.07), [10, -4])], 2.4, PAL.greyD);
      });
    }, [['spine_1', side(PS(-260, 0), [-1, 0], 90)], ['spine_2', side(PS(-260, 0), [1, 0], 90)]]);
    // ---- the coat in tiers, each hanging plumb over the next with its own broken edge: a cape of long hanks from the
    // hump over the shoulder, a sheet over the flank and haunch
    f.bone('spine_1');
    hanks([PS(-60, deg(28)), PS(-280, deg(18)), PS(-480, deg(4)), PS(-640, deg(-12))], 14, 200, 320, 40, 58, { ice: 0.25, tone: 0.06, inside: torso }); // the sheet over the flank and haunch
    hanks([PS(-700, deg(20)), PS(-690, deg(-20))], 5, 140, 240, 36, 50, { ice: 0.4, tone: 0.12, inside: torso }); // the hair of the buttock
    X.rime([PS(-640, deg(80)), PS(-500, deg(84)), PS(-300, deg(86)), PS(-100, deg(86)), PS(40, deg(88))], 18, -1);
    f.bone('spine_2');
    hanks([PS(440, deg(70)), PS(330, deg(62)), PS(200, deg(56)), PS(60, deg(50)), PS(-60, deg(46))], 14, 220, 360, 40, 60, { ice: 0.25, inside: torso }); // the cape off the hump
    f.bone('spine_2');
    X.rime([PS(40, deg(88)), PS(160, deg(88)), PS(260, deg(86)), PS(360, deg(84)), PS(440, deg(80))], 20, -1);
    for (const h of [holes[0], holes[1]]) X.holeWall(h);
    f.bone('spine_1'); X.holeWall(holes[2]);
  });
  f.bone('spine_1'); X.holeRim(holes[0], { w: 3 }); X.holeRim(holes[2], { w: 2.6 });
  f.bone('spine_2'); X.holeRim(holes[1], { w: 2.6 });

  // ---- near legs, then the skirt of long hair hanging over their tops, and the beard under the jaw
  leg('hn', false, 2); leg('fn', false, 2);
  f.bone('spine_1');
  hanks([PS(-660, deg(-40)), PS(-500, deg(-48)), PS(-300, deg(-52)), PS(-100, deg(-54))], 12, 200, 330, 38, 56, { ice: 0.35 });
  f.bone('spine_2');
  hanks([PS(-100, deg(-54)), PS(80, deg(-54)), PS(240, deg(-52))], 9, 220, 340, 38, 58, { ice: 0.35 }); hanks([PS(240, deg(-52)), PS(380, deg(-44)), PS(460, deg(-30))], 6, 150, 230, 36, 52, { ice: 0.35 }); // shorter on the chest

  // ---- the far tusk (behind the trunk and the face), the near ear
  tusk(-1, 'tusk_f');
  f.bone('ear');
  const eb = PH(-40, 1100, 215);
  const ear = [add(eb, [20, -40]), add(eb, [-34, -60]), add(eb, [-84, -44]), add(eb, [-104, 6]), add(eb, [-90, 60]), add(eb, [-40, 74]), add(eb, [14, 44])];
  f.part(ear, COAT({ fill: mix(PAL.fur, PAL.furS, 0.2), maxShade: 14 }));
  X.furField(ear, 14, 30, { dir: () => [-0.3, 1], w: 3 });
  f.line([add(eb, [-16, -30]), add(eb, [-60, -36]), add(eb, [-80, 4]), add(eb, [-64, 46])], 1.6, PAL.furD, { op: 0.6 }); // the rim's fold
  hanks([add(eb, [-104, 10]), add(eb, [-70, 66]), add(eb, [0, 56])], 3, 50, 100, 26, 38, { ice: 0.5, tone: 0.2 });

  // ---- the head: the high peaked dome with its topknot, the broad cheeks, the brow over small deep eyes, the face
  // falling to the trunk between the tusk sheaths
  f.bone('head');
  const headC = PPH([[70, 1300, -10], [24, 1370, -36], [0, 1336, -110], [-6, 1250, -160], [-6, 1140, -200], [40, 1000, -232], [110, 862, -218], [170, 744, -170], [214, 690, -120], [240, 676, 0], [214, 690, 120], [170, 744, 172], [100, 870, 222], [20, 1000, 236], [-60, 1110, 205], [-40, 1236, 165], [-14, 1334, 96], [16, 1372, 20]]);
  // the beard under the jaw, hanging plumb in front of the chest
  hanks(PPH([[150, 760, 200], [200, 700, 110], [210, 690, -110], [150, 760, -200]]), 12, 200, 340, 36, 54, { ice: 0.35, tone: 0.08 });
  f.part(headC, COAT({ maxShade: 40 }));
  X.furField(headC, 90, 56, { dir: p => [0.0, 1], w: 5 });
  clipDraw(f, headC, () => {
    softTone(f, E.smooth(headC), [[PPH([[-60, 1240, 205], [-60, 1110, 215], [20, 1000, 240], [100, 870, 226], [170, 744, 176], [150, 760, 120], [60, 980, 150], [10, 1200, 150]]), PAL.furS, 0.7, 20], [PPH([[30, 1320, 40], [120, 1200, 0], [60, 1250, -100]]), '#ffffff', 0.5, 20], [PPH([[170, 900, 130], [220, 760, 60], [220, 760, -60], [170, 900, -130], [190, 960, 0]]), PAL.furS, 0.45, 16]]);
    X.furField(headC, 60, 40, { dir: () => [0.05, 1], w: 4, op: 0.6 });
    crease(f, PPH([[110, 1050, 200], [140, 1056, 160], [160, 1060, 120]]), 5, { col: PAL.furD, op: 0.5 }); crease(f, PPH([[160, 1060, -120], [140, 1056, -160]]), 4, { col: PAL.furD, op: 0.35 }); // the brow over each eye
    crease(f, PPH([[60, 1240, 60], [110, 1160, 30], [160, 1120, 0]]), 4, { col: PAL.furD, op: 0.4 }); // the dome's front falling to the forehead
    crease(f, PPH([[120, 900, 200], [180, 800, 150]]), 4, { col: PAL.furD, op: 0.45 }); // the cheek over the near tusk root
    crease(f, PPH([[120, 900, -200], [180, 800, -150]]), 4, { col: PAL.furD, op: 0.35 });
  });
  // the small deep eye, wrinkled round, lashes white with hoar (the far one is round the far cheek, out of sight)
  for (const [sg, sz] of [[1, 1]]) {
    const ec = PH(150, 990, 176 * sg);
    f.flat(ell(add(ec, [0, 6]), 30 * sz, 20 * sz, 0.1 * sg, 14), PAL.furD, { op: 0.55 }); // the socket
    f.flat(ell(ec, 13 * sz, 9 * sz, 0.15 * sg, 12), '#141418');
    f.flat(ell(add(ec, [3 * sg, -2]), 3 * sz, 2.2 * sz, 0, 6), '#9a9ea4');
    f.line([add(ec, [-20 * sz, -6]), add(ec, [0, -14 * sz]), add(ec, [20 * sz, -6])], 2.2, INK);
    for (let i = 0; i < 5; i++) f.line([add(ec, [-14 * sz + i * 7 * sz, -11 * sz]), add(ec, [-16 * sz + i * 7 * sz, -1 * sz])], 1.2, '#ffffff', { op: 0.9 });
    for (let i = 0; i < 3; i++) f.line([add(ec, [-24 * sz, 10 + i * 8]), add(ec, [0, 16 * sz + i * 8]), add(ec, [22 * sz, 10 + i * 8])], 1.2, INK, { op: 0.45 });
  }
  // the topknot: long hanks over the dome, the outline broken
  hanks(PPH([[-30, 1300, 150], [-14, 1350, 90], [16, 1386, 20], [20, 1372, -50], [0, 1330, -120]]), 7, 60, 130, 26, 40, { ice: 0.3 });
  X.rime(PPH([[24, 1372, -36], [0, 1338, -110], [-6, 1252, -160]]), 8, -1);
  // long hanks down the cheeks
  hanks(PPH([[-40, 1180, 200], [30, 990, 236], [110, 870, 222]]), 6, 110, 200, 32, 46, { ice: 0.4 });
  hanks(PPH([[30, 990, -236], [110, 870, -222]]), 3, 100, 170, 30, 42, { ice: 0.4, tone: 0.2 });

  // ---- the trunk: tapering in wrinkled rings, hair on its upper part, its tip curled up and out to two fingers
  const tC = spline(PPH([[214, 1070, 0], [228, 990, 0], [262, 820, 8], [284, 620, 12], [292, 460, 0], [300, 330, -40], [320, 250, -110], [352, 240, -180], [370, 290, -220]]), 7);
  const tW = tC.map((_, i) => (176 - 128 * Math.pow(i / (tC.length - 1), 0.85)) * KH(280, 0));
  const trunk = ribbon(tC, tW, { p: t => Math.min(1, 0.12 + 0.88 * Math.sqrt(t / 0.16)), q: t => Math.min(1, 0.12 + 0.88 * Math.sqrt(t / 0.16)) }); // (final pass) the root narrows into the brow instead of a square top
  const T1 = PH(285, 560, 0), T2 = PH(300, 290, 0);
  split(f, () => {
    f.part(trunk, HIDEG({ maxShade: 26 }));
    clipDraw(f, trunk, () => {
      for (let i = 1; i < tC.length - 1; i++) { const d = E.norm(sub(tC[i + 1], tC[i - 1])), n = [-d[1], d[0]], w = tW[i]; f.line([add(tC[i], mul(n, -w * 0.5)), add(add(tC[i], mul(d, 3 + w * 0.04)), mul(n, -w * 0.1)), add(add(tC[i], mul(d, 3 + w * 0.05)), mul(n, w * 0.15)), add(tC[i], mul(n, w * 0.5))], i % 2 ? 1.2 : 1.8, INK, { op: i % 2 ? 0.35 : 0.55 }); } // the rings
      softTone(f, E.smooth(trunk), [[tC.map((q, i) => add(q, [-tW[i] * 0.55, 0])).concat(tC.slice().reverse().map((q, i, a) => add(q, [-tW[a.length - 1 - i] * 0.15, 0]))), '#5e6068', 0.45, 10]]);
      f.line(tC.slice(2, -6).map((q, i) => add(q, [tW[i + 2] * 0.3, 0])), 1.6, '#ffffff', { op: 0.35 });
      X.cracks(tC[Math.round(tC.length * 0.55)], 34, 3, 1.4); // frost cracks in the hide
    });
    // the two fingers at the tip: a long one on top, a broad flap below, the nostrils between
    const te = tC[tC.length - 1], tp = tC[tC.length - 3], td = E.norm(sub(te, tp)), tn = [-td[1], td[0]];
    f.part([add(te, mul(tn, -18)), add(add(te, mul(td, 30)), mul(tn, -14)), add(add(te, mul(td, 44)), mul(tn, -4)), add(add(te, mul(td, 34)), mul(tn, 6)), add(te, mul(tn, 4))], HIDEG({ fill: '#b8babe', cast: false, inkW: 1.3 })); // the upper finger
    f.part([add(te, mul(tn, 6)), add(add(te, mul(td, 18)), mul(tn, 10)), add(add(te, mul(td, 20)), mul(tn, 26)), add(add(te, mul(td, 2)), mul(tn, 30)), add(te, mul(tn, 22))], HIDEG({ fill: '#b0b2b6', cast: false, inkW: 1.3 })); // the lower flap
    f.flat(ell(add(te, mul(tn, 4)), 7, 4, Math.atan2(td[1], td[0]), 8), '#141418'); f.flat(ell(add(add(te, mul(tn, 14)), mul(td, -4)), 6, 3.5, Math.atan2(td[1], td[0]), 8), '#141418'); // nostrils
  }, [['trunk_1', side(T1, [0, -1], 70)], ['trunk_2', [side(T1, [0, 1], 70), side(T2, [0, -1], 56)]], ['trunk_3', side(T2, [0, 1], 56)]]);
  f.bone('trunk_1');
  hanks([add(tC[0], [-tW[0] * 0.36, 0]), add(tC[1], [0, 0]), add(tC[0], [tW[0] * 0.36, 0])], 4, 80, 140, 26, 36, { ice: 0.3, tone: 0.04 }); // (final pass) the forehead's hair falling over the trunk's root
  hanks([add(tC[2], [-tW[2] * 0.4, 0]), add(tC[2], [tW[2] * 0.4, 0])], 3, 70, 130, 24, 34, { ice: 0.35, tone: 0.06 }); hanks([add(tC[6], [-tW[6] * 0.4, 0]), add(tC[6], [tW[6] * 0.4, 0])], 2, 50, 90, 22, 30, { ice: 0.3, tone: 0.1 }); // the hair on the trunk's upper part
  f.bone('trunk_3');
  X.icicle(add(tC[tC.length - 6], [-6, tW[tC.length - 6] * 0.4]), 30, 8);

  // ---- the near tusk, in front of the trunk's root
  tusk(1, 'tusk_n');

  // ---- the snow: a plane under all four feet (the far ones stand further up it); no shadow, no tracks
  f.bone('root');
  snowGround(f, 10, 1090, GY - 60, { depth: 96 });
  for (const k of ['hf', 'ff', 'hn', 'fn']) { f.bone(`leg_${k}_3`); snowLip(f, [LEG[k].F[0], LEG[k].F[1] + 4], 280 * LEG[k].k, 16); }
  return f;
}

// ------------------------------------------------------------------ STARLESS EYE (Small 0.6)
// An eye that fell from the black star, floating, still looking for the rest of the face. An anatomical eye torn out of
// its socket, seen at three-quarters as it turns toward the heroes: a wet globe whose cornea bulges over a black iris
// with grey striations and a void pupil; the sclera veined in fine grey (there is no blood in it), filmed with wet, a
// few dull glints. A torn remnant of the upper lid still clings over the top, its lashes frozen stiff; a sliver of the
// lower lid hangs under the front with frozen tears. Behind the equator the eye muscles leave the globe as flat bands
// (the tendon pale and smooth at the insertion, the belly fibrous) and the thick optic nerve leaves the back pole in its
// sheath; all of them end torn, frayed into the void. Behind it trails a ragged edge of void where it was torn from a
// face (the bible's ragged edge): black tatters with thin pale rims. Frost on the surface: hoar on the upper globe, rime
// on the lid and the muscles, icicles plumb. It floats over the snow and casts no shadow.
// Rig: body (root, the globe) > iris, lid_u, lid_l, trail_1 > trail_2 > trail_3 (the void, the nerve and the muscles).
function starlessEye() {
  const CH = TIERS.small[1], GY = CH - 30;
  const f = new Fig(base(1205, CH, { grimeY: GY + 100 }));
  const X = fx(f);
  const EC = [392, 452], R = 112, IC0 = add(EC, [66, -4]);
  const TIS = (o = {}) => Object.assign({ fill: '#c2c4c8', shadow: '#5e6068', light: '#e4e4e6', shade: 0.38, tex: 'mottle1205', texOp: 0.55 }, o);
  const SKN = (o = {}) => Object.assign({ fill: '#d2d4d6', shadow: '#6e7078', light: '#eeeeee', shade: 0.38, tex: 'mottle1205', texOp: 0.55 }, o);
  const T1 = add(EC, [-120, 10]), T2 = add(EC, [-210, 40]), T3 = add(EC, [-290, 84]);
  f.joint('body', EC).joint('iris', IC0, 'body').joint('lid_u', add(EC, [-20, -100]), 'body').joint('lid_l', add(EC, [60, 92]), 'body');
  f.joint('trail_1', T1, 'body').joint('trail_2', T2, 'trail_1').joint('trail_3', T3, 'trail_2');

  // ---- the void it was torn from: a ragged black wake trailing behind the globe, tattered at every edge, thin pale rims
  // on the torn lips; the muscles and the nerve run back into it
  const wc = spline([add(EC, [-60, 0]), T1, T2, T3, add(EC, [-350, 130])], 6), wn = wc.length;
  const ragged = (C, W, amp) => {
    const n = C.length, P = [], Q = [], ph = f.r() * 6;
    C.forEach((c, i) => { const a2 = C[Math.max(0, i - 1)], b2 = C[Math.min(n - 1, i + 1)], d = E.norm(sub(b2, a2)), nn = [-d[1], d[0]], wav = Math.sin(i * 0.8 + ph) * W[i] * 0.07;
      P.push({ q: add(c, mul(nn, W[i] / 2 + wav)), nn, d }); Q.push({ q: add(c, mul(nn, -W[i] / 2 - wav * 0.6)), nn: mul(nn, -1), d }); });
    // torn flaps: a few broad tatters along each edge, pointing back the way it was torn, never a fringe of spikes
    const flap = (arr, i, sg) => { const e = arr[i], l = amp * (0.7 + f.r() * 1.1) * (0.5 + i / n); return [[...add(add(e.q, mul(e.nn, l)), mul(e.d, -l * 0.9)), 1]]; };
    const edge = (arr, sg) => { const out = []; arr.forEach((e, i) => { out.push(e.q); if (i > 1 && i < n - 1 && i % 3 === 1 && f.r() < 0.55) out.push(...flap(arr, i, sg)); }); return out; };
    const tip = C[n - 1], tags = []; for (let k = 0; k < 2; k++) tags.push([...add(tip, [-(12 + f.r() * 16), (k - 0.5) * 26]), 1], add(tip, [-2, (k - 0.2) * 14]));
    return [...edge(P, 1), ...tags, ...edge(Q, -1).reverse()];
  };
  const wW = wc.map((_, i) => 210 * (1 - i / (wn - 1)) ** 0.8 + 16);
  const wake = ragged(wc, wW, 26);
  const cutA = side(T2, [-1, -0.3], 70), cutB = side(T2, [1, 0.3], 70), cutC = side(T3, [-1, -0.5], 50), cutD = side(T3, [1, 0.5], 50);
  split(f, () => {
    f.part(wake, { fill: PAL.void, shadow: '#000', light: '#16161a', shade: 0.2, maxShade: 6, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false, grime: false, gritOp: 0.1 });
    // a thin pale rim along the upper torn lip, where the void's edge catches the light
    f.line(wc.slice(1, Math.round(wn * 0.7)).map((q, i) => add(q, [0, -wW[i + 1] * 0.44])), 1, '#e8eaec', { op: 0.6 });
  }, [['trail_1', cutB], ['trail_2', [cutA, cutD]], ['trail_3', cutC]]);

  // ---- the muscles and the optic nerve: flat bands and a thick cord, frozen, running back into the void, frayed
  const band = (pts, w0, w1, bone, look) => {
    f.bone(bone);
    const C = spline(pts, 5), n = C.length, W = C.map((_, i) => { const t = i / (n - 1); return (w0 + (w1 - w0) * t) * (t < 0.3 ? 0.4 + 0.6 * Math.sin(t / 0.3 * Math.PI / 2) : 1 - (t - 0.3) * 0.15); }); // the tendon narrow at the insertion, the belly full
    const sh = ribbon(C, W);
    f.part(sh, look);
    clipDraw(f, sh, () => {
      for (let k = -2; k <= 2; k++) f.line(C.map((q, i) => { const d = E.norm(sub(C[Math.min(n - 1, i + 1)], C[Math.max(0, i - 1)])); return add(q, mul([-d[1], d[0]], W[i] * k * 0.18)); }).slice(Math.round(n * 0.25)), 0.8, '#3a3c42', { op: 0.45 }); // the fibres
      f.line(C.slice(0, Math.round(n * 0.3)).map((q, i) => add(q, [0, -W[i] * 0.2])), 1.4, '#ffffff', { op: 0.75 }); // the tendon's sheen at the insertion
    });
    const e = C[n - 1], d = E.norm(sub(e, C[n - 2])), nn = [-d[1], d[0]];
    for (let k = 0; k < 5; k++) { const o2 = (k / 4 - 0.5) * W[n - 1]; f.line([add(e, mul(nn, o2)), add(add(e, mul(nn, o2 + (f.r() - 0.5) * 6)), mul(d, 8 + f.r() * 14))], 1.6, '#8a8c92', { op: 0.85 }); } // torn, frayed fibres
    return C;
  };
  const MUS = TIS({ fill: '#b8babe', maxShade: 8 });
  // the inferior rectus under the globe, the optic nerve from the back pole, both behind the globe
  band([add(EC, [30, 96]), add(EC, [-40, 104]), add(EC, [-120, 96]), add(EC, [-190, 110])], 28, 22, 'trail_1', MUS);
  const nv = band([add(EC, [-96, 14]), add(EC, [-150, 30]), add(EC, [-200, 60]), add(EC, [-236, 96])], 44, 38, 'trail_2', TIS({ fill: '#cfd1d4', maxShade: 10 }));
  for (let i = 1; i < nv.length - 1; i += 3) f.line([lp(nv[i], nv[i + 1], 0, -18), lp(nv[i], nv[i + 1], 0.5, 18)], 0.9, '#5e6068', { op: 0.5 }); // the sheath's rings
  X.icicles(nv.slice(2, -2).map(q => add(q, [0, 18])), 2, 20, 4.5);

  // ---- the globe: wet sclera veined in grey, shaded as a sphere, the cornea bulging toward what it watches
  f.bone('body');
  const ball = []; for (let i = 0; i < 48; i++) { const t = i / 48 * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), bulge = c > 0.62 ? (c - 0.62) * 40 * (1 - Math.abs(sn) * 0.3) : 0; ball.push(add(EC, [c * (R + bulge), sn * R * 0.985])); }
  f.part(ball, { fill: '#f0f0ee', shadow: '#8a8e96', light: '#ffffff', shade: 0.42, maxShade: 40, tex: 'mottle1205', texOp: 0.18 });
  clipDraw(f, ball, () => {
    softTone(f, E.smooth(ball), [[[add(EC, [-R, -R]), add(EC, [-30, -R]), add(EC, [-50, R]), add(EC, [-R, R])], '#9a9ea6', 0.6, 26], [[add(EC, [-R, R * 0.4]), add(EC, [R, R * 0.5]), add(EC, [R, R]), add(EC, [-R, R])], '#8a8e96', 0.35, 20], [ell(add(EC, [30, -50]), 46, 28, -0.3, 12), '#ffffff', 0.6, 14]]);
    // veins: grey, fine, branching, thickest at the back and the corners, thinning toward the iris
    for (let i = 0; i < 22; i++) {
      const a = Math.PI * (0.55 + f.r() * 0.9) * (f.r() > 0.5 ? 1 : -1), p0 = add(EC, [Math.cos(a) * (R + 4), Math.sin(a) * (R + 4)]), toward = add(IC0, [-46, (f.r() - 0.5) * 80]);
      const p1 = lerp(p0, toward, 0.3 + f.r() * 0.15), p2 = lerp(p0, toward, 0.55 + f.r() * 0.25), m1 = add(lerp(p0, p1, 0.5), [(f.r() - 0.5) * 16, (f.r() - 0.5) * 16]);
      f.line([p0, m1, p1, add(p2, [(f.r() - 0.5) * 12, (f.r() - 0.5) * 12])], 0.9 + f.r() * 0.7, '#4e5058', { op: 0.65 });
      for (let k = 0; k < 2; k++) { const b0 = lerp(p0, p1, 0.4 + k * 0.4), bd = [(f.r() - 0.5) * 30, (f.r() - 0.5) * 30]; f.line([b0, add(b0, mul(bd, 0.5)), add(add(b0, bd), [(f.r() - 0.5) * 8, (f.r() - 0.5) * 8])], 0.7, '#5e6068', { op: 0.55 }); }
    }
    // the hoar on the upper globe, dull: no snowflakes, a bloom of frost and a few frozen beads
    f.raw(`<path d="${E.smooth(ell(add(EC, [-20, -70]), 90, 40, -0.1, 16))}" fill="url(#${X.hoar})" opacity="0.7"/>`);
    X.frost(add(EC, [-10, -78]), 70, 16, 14, 1.3);
    // the wet: a dull sheen along the lit rim and a few soft glints (nothing bright: the light is weak here)
    f.line(ell(EC, R - 6, R * 0.97 - 6, 0, 48).slice(36, 45), 2, '#ffffff', { op: 0.55 });
    for (const [q, rx, ry] of [[add(EC, [40, -66]), 9, 4], [add(EC, [-36, -40]), 6, 3], [add(EC, [-70, 30]), 5, 2.5]]) f.flat(ell(q, rx, ry, -0.4, 10), '#ffffff', { op: 0.75 });
  });
  // the muscles that cross the visible face: the superior rectus over the top, the lateral across the near side, both
  // leaving the globe behind the limbus and running back into the void
  band([add(EC, [24, -96]), add(EC, [-30, -112]), add(EC, [-90, -108]), add(EC, [-176, -76])], 28, 24, 'trail_1', MUS);
  band([add(EC, [-2, 20]), add(EC, [-44, 38]), add(EC, [-86, 50]), add(EC, [-120, 56]), add(EC, [-172, 70])], 26, 26, 'trail_1', MUS);
  f.bone('trail_1');
  X.rime([add(EC, [-40, -116]), add(EC, [-110, -106]), add(EC, [-170, -78])], 6, -1);
  X.icicle(add(EC, [-130, 64]), 22, 5); X.icicle(add(EC, [-60, 120]), 16, 4.5);

  // ---- the iris: black, ringed with grey striations, a darker collarette; the pupil a clean round hole into nothing
  f.bone('iris');
  const ir = ell(IC0, 42, 70, 0.04, 30);
  f.flat(ell(IC0, 47, 75, 0.04, 30), '#7a7e86', { op: 0.6 }); // the limbus, a grey wet ring
  f.part(ir, { fill: '#1c1c20', shadow: '#050506', light: '#3a3c42', shade: 0.3, inkW: 1.8, inkHeavy: 2.6, cast: false, hatch: false });
  for (let i = 0; i < 34; i++) { const a = i / 34 * Math.PI * 2 + f.r() * 0.08; f.line([add(IC0, [Math.cos(a) * 18, Math.sin(a) * 30]), add(IC0, [Math.cos(a) * (36 + f.r() * 4), Math.sin(a) * (60 + f.r() * 6)])], 0.9, '#5a5c64', { op: 0.6 }); }
  f.line(ell(IC0, 26, 44, 0.04, 26).concat([ell(IC0, 26, 44, 0.04, 26)[0]]), 1.4, '#62646c', { op: 0.6 }); // the collarette
  const pp = ell(add(IC0, [4, 0]), 14, 23, 0.04, 20);
  f.flat(pp, PAL.void); f.line(pp.concat([pp[0]]), 1.4, '#ffffff', { op: 0.9 });
  f.flat(ell(add(IC0, [16, -40]), 8, 4, -0.5, 10), '#d8dce0', { op: 0.55 }); // the wet glint on the cornea, dulled
  f.line([add(IC0, [30, -52]), add(IC0, [46, -26]), add(IC0, [48, 6])], 1.4, '#9a9ea6', { op: 0.5 }); // the cornea's edge catching the light

  // ---- the remnant of the upper lid, torn from the face, clinging over the top of the globe; lashes frozen stiff
  f.bone('lid_u');
  const lidTop = [add(EC, [-96, -66]), add(EC, [-56, -122]), add(EC, [10, -134]), add(EC, [72, -112]), add(EC, [118, -62])], lidEdge = [add(EC, [124, -48]), add(EC, [92, -76]), add(EC, [40, -96]), add(EC, [-20, -98]), add(EC, [-70, -78])];
  const lid = [...spline(lidTop, 6), ...spline(lidEdge, 6), add(EC, [-92, -60]), add(EC, [-110, -70]), add(EC, [-100, -78]), add(EC, [-114, -90])]; // the back of it torn
  f.part(lid, SKN({ maxShade: 14 }));
  clipDraw(f, lid, () => { for (let i = 0; i < 4; i++) crease(f, [add(EC, [-60 + i * 12, -92 - i * 7]), add(EC, [0 + i * 6, -106 - i * 6]), add(EC, [60 + i * 4, -92 - i * 5])], 1.6, { col: '#3a3c42', op: 0.5 }); f.line(spline(lidEdge, 6).map(q => add(q, [0, -4])), 2, '#8a8c92', { op: 0.6 }); }); // the lid's folds; its margin
  for (let i = 0; i < 13; i++) { const t = i / 12, b0 = lerp(add(EC, [-40, -96]), add(EC, [118, -54]), t), l = 14 + Math.sin(t * Math.PI) * 14; f.line([b0, add(b0, [6 + t * 8, -l * 0.25]), add(b0, [12 + t * 12, -l * 0.7])], 1.8, INK); f.line([add(b0, [10 + t * 10, -l * 0.5]), add(b0, [12 + t * 12, -l * 0.7])], 1.2, '#ffffff', { op: 0.8 }); } // lashes, frozen, curling up, white-tipped with hoar
  X.rime([add(EC, [-56, -124]), add(EC, [10, -136]), add(EC, [72, -114]), add(EC, [116, -66])], 7, -1);
  // ---- a sliver of the lower lid under the front, a few lashes, frozen tears hanging from it
  f.bone('lid_l');
  const ll = [add(EC, [4, 108]), add(EC, [52, 96]), add(EC, [96, 70]), add(EC, [122, 40]), add(EC, [126, 54]), add(EC, [104, 86]), add(EC, [60, 112]), add(EC, [14, 122]), add(EC, [-10, 118])];
  f.part(ll, SKN({ maxShade: 6 }));
  for (let i = 0; i < 7; i++) { const b0 = lerp(add(EC, [24, 108]), add(EC, [116, 58]), i / 6); f.line([b0, add(b0, [5, 10]), add(b0, [8, 16])], 1.4, INK); } // the lower lashes
  for (const [dx, l] of [[30, 40], [64, 26], [92, 34]]) X.icicle(add(EC, [dx, 120 - dx * 0.5]), l, 7); // frozen tears

  // ---- snow below; it floats, and there is no shadow on it
  f.bone('root');
  snowGround(f, 140, 560, GY, {});
  X.frost([350, GY - 2], 120, 3, 10, 1.2);
  return f;
}

// ------------------------------------------------------------------ RIME SHADE (Human 1.0)
// A shadow cast by nothing. The herder it belonged to walked here (the tracks come in and stop) and was taken; the
// shadow stayed. It lies flat on the snow from where the feet were, and from the hips up it is peeling off the snow,
// rising and turning toward the heroes, arms reaching, frozen part-way. It is flat black, the void's black: nothing
// reflects from it, its edges are clean, and its silhouette is still a herder's (the hood, the parka's fringed hem,
// mittened hands). Black frost hangs from its underside in icicles. Where its upper half lay, the snow it shaded is
// left as a clean-rimmed patch whiter than the snow round it. The herder's things lie where they fell.
// Rig: root (snow, the flat legs) > shade_1 (the bend) > shade_2 (chest) > head, arm_n_1 > arm_n_2, arm_f_1 > arm_f_2.
function rimeShade() {
  const CH = TIERS.human[1], GY = CH - 30;
  const f = new Fig(base(1207, CH, { grimeY: GY + 100 }));
  const X = fx(f);
  const BLK = (o = {}) => Object.assign({ fill: '#0a0a0c', shadow: '#000000', light: '#1e1f23', shade: 0.2, maxShade: 8, inkW: 1.6, inkHeavy: 2.4, hatch: false, castOp: 0.25, grime: false, gritOp: 0.15 }, o);
  const C = [[262, GY - 2], [222, GY - 12], [192, 736], [182, 680], [188, 616], [204, 560], [232, 516], [262, 488]];
  const CW = [34, 54, 78, 84, 108, 132, 150, 70]; // the bend at the hips, the waist, the chest, the shoulders, the neck
  const SNs = [238, 528], ENs = [324, 528], WNs = [404, 548], SFs = [228, 508], EFs = [296, 458], WFs = [356, 416], HD = [300, 444];
  f.joint('shade_1', C[1]).joint('shade_2', C[4], 'shade_1').joint('head', C[7], 'shade_2');
  f.joint('arm_n_1', SNs, 'shade_2').joint('arm_n_2', ENs, 'arm_n_1').joint('arm_f_1', SFs, 'shade_2').joint('arm_f_2', EFs, 'arm_f_1');

  // ---- the snow, the tracks that come in and stop, the patch the risen half left behind, the herder's things
  f.bone('root');
  snowGround(f, 20, 590, GY, { depth: 40, prints: [[540, 18], [582, 16]] });
  const patch = [[262, GY - 6], [200, GY - 10], [130, GY - 8], [80, GY - 2], [52, GY + 6], [70, GY + 16], [130, GY + 18], [200, GY + 14], [262, GY + 10]];
  f.flat(patch, '#fefefe'); f.line(patch.concat([patch[0]]), 1.3, PAL.snowD, { op: 0.9 });
  for (const [a, b2] of [[[60, GY + 2], [92, GY - 14]], [[120, GY - 8], [106, GY - 22]]]) { f.flat(ell(a, 18, 4, -0.3, 10), '#fefefe'); f.line(ell(a, 18, 4, -0.3, 10).concat([ell(a, 18, 4, -0.3, 10)[0]]), 1, PAL.snowD, { op: 0.8 }); } // where the arms lay
  X.rime([[264, GY - 8], [200, GY - 12], [130, GY - 10], [70, GY - 4]], 5, 1, { look: { fill: '#f6f8f8' } }); // hoar grown along the rim where it lifted
  // a hide mitten, a bone knife, a broken string of beads, dropped where the hands and belt were
  const mt = [70, GY + 10];
  f.part([add(mt, [-26, -4]), add(mt, [10, -10]), add(mt, [26, -2]), add(mt, [22, 8]), add(mt, [-22, 8])], HIDE({ fill: '#d0d0ca', inkW: 1.2, cast: false, grime: false }));
  f.part([add(mt, [2, -8]), add(mt, [14, -18]), add(mt, [22, -12]), add(mt, [12, -4])], HIDE({ fill: '#c4c4be', inkW: 1, cast: false, grime: false }));
  f.line([add(mt, [-26, 0]), add(mt, [-40, 4]), add(mt, [-56, 2])], 1.4, PAL.greyD);
  const kn = [150, GY + 22]; f.part([add(kn, [-30, -3]), add(kn, [0, -4]), add(kn, [0, 3]), add(kn, [-30, 3])], { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 1.1, cast: false, grime: false }); f.part([add(kn, [0, -4]), add(kn, [44, -2]), add(kn, [52, 0]), add(kn, [0, 4])], { fill: '#9a9ea4', shadow: '#4a4c52', shade: 0.3, inkW: 1.1, cast: false, grime: false });
  for (let i = 0; i < 9; i++) { const q = [300 + i * 14 + (i % 3) * 3, GY + 14 + Math.sin(i) * 4]; f.part(ell(q, 4, 3.4, 0, 8), { fill: PAL.bone, shadow: PAL.boneS, shade: 0.3, inkW: 0.9, cast: false, grime: false }); }
  f.line([[296, GY + 14], [330, GY + 18], [370, GY + 12], [420, GY + 16]], 0.9, PAL.greyD, { op: 0.8 });

  // ---- the flat half: the legs lying on the snow from where the feet were, two boots' outlines; flat black
  for (const [a, b2, w] of [[[262, GY - 6], [470, GY - 14], 22], [[262, GY + 4], [480, GY + 6], 24]]) {
    const leg = [lp(a, b2, 0, w / 2), lp(a, b2, 0.5, w * 0.45), lp(b2, a, 0, w * 0.36), add(b2, [14, -w * 0.3]), add(b2, [22, 0]), add(b2, [14, w * 0.4]), lp(b2, a, 0, -w * 0.4), lp(a, b2, 0.55, -w * 0.5), lp(a, b2, 0, -w / 2)];
    f.part(leg, BLK({ cast: false }));
  }
  // the parka's hem, flattened on the snow at the hips, its fringe still in the outline
  const hem = [[300, GY - 14], [250, GY - 16], [230, GY + 14], [300, GY + 14], [306, GY + 6], [318, GY + 10], [312, GY - 2], [322, GY - 6], [310, GY - 10]];
  f.part(hem, BLK({ cast: false }));

  // ---- the risen half: one sheet from the bend at the hips up to the shoulders, turning to face the heroes as it rises
  const body = ribbon(spline(C, 8), spline(C, 8).map((_, i, a) => { const u = i / (a.length - 1), k = Math.min(C.length - 1.001, u * (C.length - 1)), j = Math.floor(k); return CW[j] + (CW[j + 1] - CW[j]) * (k - j); }));
  const c1 = side(C[4], [0.1, -1], 60), c0 = side(C[4], [-0.1, 1], 60);
  split(f, () => {
    f.part(body, BLK());
    clipDraw(f, body, () => {
      // the far face of the sheet shows where it turns at the bend: a hair darker; the fringe of the parka hem in the outline
      f.flat([[180, GY - 4], [168, 720], [236, 730], [262, GY - 4]], '#000000', { op: 0.6 });
      f.line([[206, 700], [214, 640], [230, 590]], 1.2, '#2a2b30', { op: 0.9 }); // the turn of the sheet, the only line inside it // the turn of the sheet, the only line inside it
    });
  }, [['shade_1', c0], ['shade_2', c1]]);
  f.bone('shade_1');
  // black frost: icicles hanging plumb from the overhang of the rising sheet
  for (const [q, l] of [[[146, 690], 30], [[138, 640], 22], [[140, 590], 36]]) X.icicle(q, l, 8, { fill: '#26282c', shadow: '#050506' });
  f.bone('shade_2');
  // fringe of the parka hem in the silhouette, at the side: clean flat points, not torn
  const hm = [[150, 676], [138, 700], [150, 712], [142, 734], [160, 740], [176, 700]]; f.part(hm, BLK({ cast: false, inkW: 1.2 })); // the parka hem flaring at the hip, its fringe tabs in the outline

  // ---- the arms, reaching for the heroes; flat black, mittened hands with the thumb out, fingers of the bare far hand
  const arm = (S0, E0, W0, w, bA, bB) => {
    const [cu, cf] = jcut(S0, E0, W0, w * 0.5);
    split(f, () => f.part(jointLimb(S0, E0, W0, [w, w * 0.85, w * 0.7], { point: 0.25 }), BLK()), [[bA, cu], [bB, cf]]);
  };
  arm(SFs, EFs, WFs, 46, 'arm_f_1', 'arm_f_2');
  f.bone('arm_f_2');
  const hf = openHand(f, WFs, ang(EFs, WFs) - 0.2, 80, BLK(), { spread: 0.32, curl: 0.25, back: true });
  X.icicle(add(EFs, [0, 18]), 24, 6, { fill: '#26282c', shadow: '#050506' });
  arm(SNs, ENs, WNs, 50, 'arm_n_1', 'arm_n_2');
  f.bone('arm_n_2');
  const mitN = frame(WNs, ang(ENs, WNs), 1);
  f.part(mitN([[-6, -22], [40, -26], [66, -14], [72, 4], [60, 20], [20, 24], [-6, 20]]), BLK()); // the mitten
  f.part(mitN([[8, -20], [26, -44], [40, -42], [34, -20]]), BLK({ cast: false })); // its thumb
  for (const [q, l] of [[lp(ENs, WNs, 0.3, 24), 30], [mitN([[40, 26]])[0], 22]]) X.icicle(q, l, 7, { fill: '#26282c', shadow: '#050506' });

  // ---- the head: a hooded head, leaning toward the heroes; no face, nothing reflects
  f.bone('head');
  const hood = [add(HD, [-44, 46]), add(HD, [-56, 10]), add(HD, [-70, -10]), add(HD, [-62, -36]), add(HD, [-36, -60]), add(HD, [0, -66]), add(HD, [30, -58]), add(HD, [52, -40]), add(HD, [60, -16]), add(HD, [56, 4]), add(HD, [62, 20]), add(HD, [50, 34]), add(HD, [40, 50]), add(HD, [12, 56]), add(HD, [-20, 56])]; // a hooded head in profile: the peak behind, the ruff's lumpy edge in front, the chin tucked
  f.part(hood, BLK());
  f.part([add(HD, [-62, -36]), add(HD, [-88, -24]), add(HD, [-96, 10]), add(HD, [-70, -10])], BLK({ cast: false })); // the hood's tail falling behind
  return f;
}

// ------------------------------------------------------------------ THE COLD STAR (Ruler 4)
// The black star, come down to see what was making all the noise; it hangs at the top of the frame, very close, cropped
// by the frame like a cathedral seen from inside. A perfect black disc: no shading, no grain, nothing reflects from it.
// A thin white corona flickers at its rim in fine filaments. Round it the frost has formed rings in the air: rime, not
// solid ice: bands of fine ice dust and frozen haze, concentric but irregular, thick in places and thinning to nothing,
// their inner edges catching the corona, a few small clots of rime and hair-thin streaks in them; the two outer rings
// stop clean where the void has bitten a gap. The Tooth orbits it like a small pale moon: a stone molar, cusped and two-rooted, worn, cracked,
// lit on one side, its orbit traced by a thread of dust. In its centre the single enormous eye lies shut, a slit of
// white just showing between the lids (it opens when it attacks).
// Far below on the tundra, tiny under it, the herders' camp it came down on: four hide tents, their smoke frozen into
// thin pillars cut off clean where the warmth was taken; the hearth in the middle a round black hole; the herd and the
// people stopped where they stood, their faces taken, looking up. Nothing casts a shadow.
// Rig: root (the tundra and the camp); disc (root of the star, pivot at its centre) > corona, ring_1..3, tooth (pivot at
// the centre: turning it orbits the Tooth), eye > lid_u, lid_l (pivots far out to the side, so a small turn slides a
// lid open; in the game the lids want a translation key).
function coldStar() {
  const CW = TIERS.ruler[0], CH = TIERS.ruler[1], GY = CH - 30;
  const f = new Fig(base(1200, CH, { grimeY: CH + 200 }));
  const X = fx(f, 2);
  const DC = [800, 470], R = 500;
  f.joint('disc', DC).joint('corona', DC, 'disc').joint('ring_1', DC, 'disc').joint('ring_2', DC, 'disc').joint('ring_3', DC, 'disc').joint('tooth', DC, 'disc').joint('eye', DC, 'disc');
  f.joint('lid_u', [DC[0] + 4000, DC[1]], 'eye').joint('lid_l', [DC[0] + 4000, DC[1]], 'eye');

  // ---- the tundra far below and the camp it came down on (root): drawn first, the star hangs in front of the sky
  f.bone('root');
  const HZ = 1300;
  const plain = [[-20, HZ], [300, HZ - 6], [700, HZ + 2], [1100, HZ - 8], [1620, HZ], [1620, CH + 10], [-20, CH + 10]];
  f.part(plain, { fill: PAL.snow, shadow: PAL.snowS, shade: 0.05, maxShade: 4, inkW: 1.4, inkHeavy: 2, cast: false, hatch: false, grime: false, gritOp: 0.2 });
  clipDraw(f, plain, () => {
    for (let i = 0; i < 46; i++) { const y = HZ + 10 + Math.pow(f.r(), 1.6) * 280, x = f.r() * 1600, l = (20 + f.r() * 60) * (1 + (y - HZ) / 140); f.line([[x, y], [x + l * 0.5, y - 2 - (y - HZ) * 0.01], [x + l, y + 1]], 0.8 + (y - HZ) / 200, PAL.snowD, { op: 0.5 }); f.line([[x + 3, y - 2], [x + l * 0.5, y - 4]], 1, '#ffffff', { op: 0.9 }); } // sastrugi, finer toward the horizon
    for (let i = 0; i < 5; i++) { const y = HZ + 40 + i * 50; f.line([[0, y], [800, y + (f.r() - 0.5) * 10], [1600, y]], 1, PAL.snowS, { op: 0.35 }); }
  });
  // the camp, tiny under the star: four hide tents round a hearth that is now a round black hole, a drying rack, a
  // sledge, the herd and its people stopped where they stood, a line of tracks coming in. Dark accents (door flaps, the
  // cut ends of the smoke, the taken faces, the hearth) keep it legible at sheet size.
  const CX = 820, cy = HZ + 34; // the camp sits a little below the horizon line, on the near plain
  const tent = (x, h, lean = 0) => {
    const y = cy + (x - CX) * 0.01, b0 = [x - h * 0.45, y], b1 = [x + h * 0.45, y], top = [x + lean, y - h];
    f.part([b0, top, b1], { fill: '#e6e6e2', shadow: PAL.hideS, shade: 0.35, inkW: 1.3, inkHeavy: 2, cast: false, grime: false, sharp: true });
    f.flat([top, b1, [x + h * 0.08, y]], PAL.hideS, { op: 0.55 }); // the shadow side of the cone
    for (const dx of [-7, -2, 4, 8]) f.line([add(top, [dx * 0.3, 5]), add(top, [dx * 0.9, -h * 0.22])], 1.2, PAL.greyD); // the poles through the smoke hole
    for (let i = 1; i < 3; i++) f.line([lerp(top, b0, i / 3), lerp(top, b1, i / 3)], 0.8, PAL.hideD, { op: 0.5 }); // the hide's seams
    f.flat([[x - h * 0.1, y], [x - h * 0.07, y - h * 0.34], [x + h * 0.05, y - h * 0.34], [x + h * 0.07, y]], '#1e1e22'); // the door flap, open
    // the smoke frozen into a thin pillar as it rose, cut off clean where the warmth was taken
    const sC = spline([add(top, [0, -h * 0.2]), add(top, [-4, -h * 0.8]), add(top, [3, -h * 1.4]), add(top, [-1, -h * 2.0])], 4), sW = sC.map((_, i) => 3.5 + i * 0.25);
    f.part(ribbon(sC, sW), X.IC({ fill: '#eceeee', shadow: PAL.iceS, inkW: 0.9, inkHeavy: 1.2 }));
    const e = sC[sC.length - 1]; f.line([add(e, [-sW[sW.length - 1] / 2 - 2, 0]), add(e, [sW[sW.length - 1] / 2 + 2, 0])], 2.2, INK);
  };
  tent(CX - 96, 46, -1); tent(CX - 30, 58, 1); tent(CX + 52, 50); tent(CX + 128, 40, -1);
  // the hearth in the middle of the camp: where the fire burned, a round black hole ringed with stones
  const hc = [CX + 6, cy + 16]; f.flat(ell(hc, 15, 4.5, 0, 16), PAL.void); f.line(ell(hc, 16.5, 5.5, 0, 16).slice(0, 9), 1, '#ffffff', { op: 0.9 });
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; f.part(ell(add(hc, [Math.cos(a) * 21, Math.sin(a) * 7]), 3, 2.2, 0, 6), { fill: PAL.grey, shadow: PAL.greyD, shade: 0.3, inkW: 0.8, cast: false, grime: false }); }
  // a drying rack with hides on it, a sledge with its load
  f.line([[CX + 170, cy + 2], [CX + 170, cy - 26]], 1.4, INK); f.line([[CX + 206, cy + 4], [CX + 206, cy - 24]], 1.4, INK); f.line([[CX + 166, cy - 24], [CX + 210, cy - 22]], 1.4, INK);
  f.part([[CX + 174, cy - 23], [CX + 190, cy - 22], [CX + 192, cy - 8], [CX + 176, cy - 10]], { fill: '#dcdcd6', shadow: PAL.hideS, shade: 0.3, inkW: 0.9, cast: false, grime: false });
  f.part([[CX - 186, cy + 10], [CX - 140, cy + 6], [CX - 136, cy + 10], [CX - 182, cy + 14]], { fill: PAL.wood, shadow: PAL.woodD, shade: 0.3, inkW: 1, cast: false, grime: false }); f.part([[CX - 180, cy + 7], [CX - 150, cy + 4], [CX - 152, cy - 4], [CX - 176, cy - 2]], { fill: '#d8d8d2', shadow: PAL.hideS, shade: 0.3, inkW: 0.9, cast: false, grime: false }); // a sledge, loaded
  // the herd, stopped: bodies, legs, lifted heads and small antlers, white on white in ink
  for (const [x, sz, hd] of [[CX - 250, 0.9, 0.2], [CX - 228, 0.8, -0.3], [CX - 206, 1, 0.1], [CX + 240, 0.9, 0.3], [CX + 262, 0.8, -0.2]]) {
    const by = cy + 4 + (x - CX) * 0.01, w = 22 * sz, h = 10 * sz, top = by - 12 * sz - h;
    f.part([[x - w / 2, top], [x + w / 2, top - 2], [x + w / 2 + 2, by - 12 * sz], [x - w / 2, by - 12 * sz]], { fill: '#ececea', shadow: PAL.furS, shade: 0.3, inkW: 1, inkHeavy: 1.3, cast: false, grime: false });
    for (const dx of [-w / 2 + 2, -w / 2 + 5, w / 2 - 5, w / 2 - 2]) f.line([[x + dx, by - 12 * sz], [x + dx, by]], 1.2, INK);
    const nk = [x + w / 2, top]; f.line([nk, add(nk, [5 * sz, -10 * sz + hd * 4])], 2.6 * sz, INK); f.line([add(nk, [5 * sz, -10 * sz]), add(nk, [2 * sz, -20 * sz]), add(nk, [-3 * sz, -25 * sz])], 0.9, INK); f.line([add(nk, [5 * sz, -10 * sz]), add(nk, [9 * sz, -22 * sz])], 0.9, INK);
  }
  // people, stopped mid-step, hoods turned up to the star: no faces
  for (const [x, s2] of [[CX - 62, 1], [CX + 92, 0.9], [CX + 104, 0.75]]) {
    const by = cy + 8;
    f.part([[x - 5 * s2, by], [x - 6 * s2, by - 18 * s2], [x - 4 * s2, by - 25 * s2], [x + 4 * s2, by - 25 * s2], [x + 6 * s2, by - 18 * s2], [x + 5 * s2, by]], { fill: '#e4e4e0', shadow: PAL.hideS, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, grime: false });
    f.part(ell([x + 1, by - 30 * s2], 4.2 * s2, 4.8 * s2, -0.4, 10), { fill: '#e4e4e0', shadow: PAL.hideS, shade: 0.3, inkW: 1, cast: false, grime: false }); f.flat(ell([x + 2.2, by - 31 * s2], 2.2 * s2, 2.6 * s2, -0.4, 8), PAL.void);
  }
  for (let i = 0; i < 16; i++) { const x = CX - 300 - i * 34, y = cy + 26 + i * 6; f.flat(ell([x, y], 3.2, 1.3, 0, 6), PAL.snowD, { op: 0.8 }); } // tracks coming in across the plain
  snowGround(f, -20, 1620, GY, { depth: 30 });

  // ---- the frost rings: rime in the air, never solid ice. Each is a band of frozen haze (soft overlapping arcs), fine
  // ice dust (specks, white and grey so it reads on any sky, dense in places and thinning to nothing), hair-thin streaks
  // and a few small clots of rime; the inner edge catches the corona. Where the void bit a gap, every layer stops on one
  // clean radial line. Outer rings are wider, fainter and thinner.
  const ring = (r, w, bone, gaps, k) => {
    f.bone(bone);
    const i0 = f.out.length, T = 2 * Math.PI, ph1 = f.r() * 6, ph2 = f.r() * 6, ph3 = f.r() * 6;
    const dens = a => 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(a * 3 + ph1)) * (0.55 + 0.45 * Math.sin(a * 7 + ph2)) * (0.7 + 0.3 * Math.sin(a * 17 + ph3));
    const gauss = () => (f.r() + f.r() + f.r() - 1.5) / 1.5;
    const fid = f.id('rh'); f.defs.push(`<filter id="${fid}" filterUnits="userSpaceOnUse" x="-300" y="-600" width="2200" height="2400"><feGaussianBlur stdDeviation="${(w * 0.18).toFixed(1)}"/></filter>`);
    const arc = (rr, a0, a1, n = 60) => { const q = []; for (let j = 0; j <= n; j++) { const a = (a0 + (a1 - a0) * j / n) * T; q.push(add(DC, [Math.cos(a) * rr, Math.sin(a) * rr])); } return q; };
    // the haze: soft arcs of frozen fog, pale and grey, of different widths and strengths
    for (let i = 0; i < 16; i++) {
      const a0 = f.r(), len = 0.1 + f.r() * 0.28, rr = r + gauss() * w * 0.25, ww = w * (0.35 + f.r() * 0.6), d = 'M' + arc(rr, a0, a0 + len).map(q => q.map(v => v.toFixed(1)).join(',')).join('L');
      f.raw(`<path d="${d}" fill="none" stroke="${i % 3 ? '#e2e6e9' : '#9aa0a8'}" stroke-width="${ww.toFixed(1)}" stroke-linecap="round" opacity="${((i % 3 ? 0.2 : 0.12) * k * (0.5 + f.r() * 0.6) * (0.4 + dens(a0 * T))).toFixed(3)}" filter="url(#${fid})"/>`);
    }
    // the ice dust
    const N = Math.round(r * w * 0.045 * k);
    for (let i = 0; i < N; i++) {
      const a = f.r() * T; if (f.r() > dens(a)) continue;
      const g = gauss(), rr = r + g * w * 0.5, q = add(DC, [Math.cos(a) * rr, Math.sin(a) * rr]), sz = (0.5 + f.r() * 1.4) * (1 - Math.abs(g) * 0.4);
      const inner = rr < r - w * 0.2 && r < 620; // the inner edge of the inner rings catches the corona
      f.flat(ell(q, sz * 1.3, sz, a, 6), f.r() < (inner ? 0.85 : 0.65) ? '#ffffff' : '#6e747c', { op: (0.45 + f.r() * 0.5) * (0.6 + 0.4 * k) });
    }
    // hair-thin streaks along the band
    for (let i = 0; i < 9; i++) { const a0 = f.r(), rr = r + gauss() * w * 0.45; f.line(arc(rr, a0, a0 + 0.04 + f.r() * 0.18, 40), 0.6 + f.r() * 0.8, i % 2 ? '#ffffff' : '#7a808a', { op: (0.35 + f.r() * 0.4) * k }); }
    if (r < 620) f.line(arc(r - w * 0.42, 0, 1, 160), 1, '#ffffff', { op: 0.45 }); // the corona's light on the inner edge
    // a few small clots of rime, the lower ones with a hair of an icicle
    for (let i = 0; i < Math.round(8 * k); i++) {
      const a = f.r() * T, rr = r + gauss() * w * 0.3, q = add(DC, [Math.cos(a) * rr, Math.sin(a) * rr]), sz = 2.4 + f.r() * 3.6 * k;
      f.part(ell(q, sz * 1.4, sz, a + Math.PI / 2, 7).map(v => add(v, [(f.r() - 0.5) * sz * 0.5, (f.r() - 0.5) * sz * 0.5])), X.IC({ fill: '#f2f4f4', shadow: '#9aa0a8', shade: 0.35, inkW: 0.9, inkHeavy: 1.2, k: 1, maxShade: 3 }));
    }
    // the void's bites: every layer stops on a clean radial line
    const mid = f.id('rm'), wedge = ([a0, a1]) => { const q = [DC]; for (let j = 0; j <= 12; j++) { const a = (a0 + (a1 - a0) * j / 12) * T; q.push(add(DC, [Math.cos(a) * (r + w * 2), Math.sin(a) * (r + w * 2)])); } return 'M' + q.map(v => v.map(z => z.toFixed(1)).join(',')).join('L') + 'Z'; };
    f.defs.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="-200" y="-500" width="2000" height="2200"><rect x="-200" y="-500" width="2000" height="2200" fill="#fff"/>${gaps.map(g => `<path d="${wedge(g)}" fill="#000"/>`).join('')}</mask>`);
    const body = f.out.splice(i0).join('\n'); f.raw(`<g mask="url(#${mid})">${body}</g>`); // one masked group for the whole ring
  };
  ring(790, 96, 'ring_3', [[0.6, 0.66]], 0.55);
  ring(668, 64, 'ring_2', [[0.3, 0.34]], 0.8);
  ring(568, 40, 'ring_1', [], 1);

  // ---- the Tooth: a small pale moon of stone, a molar: a worn, cusped crown and two roots, the grinding face pitted
  // and grooved, a crack through it, rime on its upper edge; lit from the key side, the far side in shade. A thread of
  // dust traces its orbit.
  f.bone('tooth');
  { const q = []; for (let j = 0; j <= 50; j++) { const a = deg(4 + j * 1.2); q.push(add(DC, [Math.cos(a) * 640, Math.sin(a) * 640])); } f.line(q, 0.8, '#9aa0a8', { op: 0.5, dash: '1 6' }); }
  const TC = add(DC, [Math.cos(deg(36)) * 640, Math.sin(deg(36)) * 640]), tF = frame(TC, deg(-30), 0.8);
  const tooth = tF([[-58, -36], [-50, -66], [-30, -58], [-12, -72], [8, -60], [28, -74], [50, -62], [62, -36], [58, 6], [46, 34], [40, 96], [28, 138, 1], [16, 102], [8, 54], [-6, 54], [-14, 106], [-30, 132, 1], [-42, 92], [-50, 34], [-62, 0]]);
  f.part(tooth, { fill: '#e2dfd6', shadow: '#8c887e', light: '#f6f4ee', shade: 0.42, maxShade: 26, inkW: 1.8, inkHeavy: 3, tex: 'mottle1200', texOp: 0.5, hatch: true });
  clipDraw(f, tooth, () => {
    f.part(tF([[-48, -58], [-30, -50], [-12, -64], [8, -52], [28, -66], [48, -56], [40, -40], [-40, -40]]), { fill: '#cfccc2', shadow: '#8c887e', shade: 0.3, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); // the worn grinding face
    for (const [a2, b2] of [[[-30, -54], [-20, -44]], [[8, -50], [2, -42]], [[30, -60], [20, -44]]]) f.line(tF([a2, b2]), 1.1, '#5e5b54', { op: 0.8 }); // its grooves
    f.line(tF([[-56, 12], [0, 20], [56, 10]]), 1.6, '#8c887e', { op: 0.7 }); // the neck where the crown meets the roots
    f.line(tF([[-6, -70], [4, -20], [-6, 24], [8, 70]]), 1.5, INK, { op: 0.85, straight: true }); f.line(tF([[-4, -68], [6, -20], [-4, 22]]), 0.9, '#ffffff', { op: 0.6, straight: true }); // the crack
    for (let i = 0; i < 12; i++) f.flat(ell(tF([[-50 + f.r() * 100, -30 + f.r() * 120]])[0], 1.4 + f.r() * 1.6, 1.1 + f.r(), f.r() * 3, 6), '#6e6b64', { op: 0.55 }); // pits in the stone
  });
  X.rime(tF([[-50, -68], [-12, -76], [28, -78], [52, -64]]), 6, -1);
  X.icicles(tF([[-30, 132], [28, 138]]), 2, 18, 4);

  // ---- the disc: perfect black. No shading, no grain, no sheen: nothing reflects from it
  f.bone('disc');
  const disc = ell(DC, R, R, 0, 120);
  f.flat(disc, '#040405');
  f.line(disc.concat([disc[0]]), 3, INK);
  // ---- the corona: a thin white rim, flickering in fine filaments; drawn in ink and white so it reads on any sky
  f.bone('corona');
  const cr = ell(DC, R + 7, R + 7, 0, 120); f.line(cr.concat([cr[0]]), 6, '#ffffff'); f.line(ell(DC, R + 11, R + 11, 0, 120).concat([ell(DC, R + 11, R + 11, 0, 120)[0]]), 1.2, INK, { op: 0.7 });
  for (let i = 0; i < 300; i++) {
    const a = f.r() * Math.PI * 2, pale = f.r() < 0.7, l = (pale ? 10 + Math.pow(f.r(), 2.5) * 80 : 6 + Math.pow(f.r(), 3) * 30), r0 = R + 9, bend = (f.r() - 0.5) * 0.06;
    const p0 = add(DC, [Math.cos(a) * r0, Math.sin(a) * r0]), p1 = add(DC, [Math.cos(a + bend) * (r0 + l * 0.6), Math.sin(a + bend) * (r0 + l * 0.6)]), p2 = add(DC, [Math.cos(a + bend * 2) * (r0 + l), Math.sin(a + bend * 2) * (r0 + l)]);
    f.line([p0, p1, p2], 0.5 + f.r() * 0.8, pale ? (f.r() < 0.6 ? '#ffffff' : '#b8bec6') : INK, { op: pale ? 0.5 + f.r() * 0.4 : 0.4 + f.r() * 0.3 }); // the corona's filaments, mostly white; a few fine ink hairs keep it on a white sky
  }

  // ---- the eye: enormous, centred; under the lids a white veined ball and a black iris, its pupil a clean hole
  f.bone('eye');
  const EW = 300, EH = 170, almond = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, x = -EW + 2 * EW * t, y = Math.sin(Math.PI * t) ** 0.8 * EH; almond.push(add(DC, [x, -y])); }
  for (let i = 39; i >= 1; i--) { const t = i / 40, x = -EW + 2 * EW * t, y = Math.sin(Math.PI * t) ** 0.8 * EH * 0.85; almond.push(add(DC, [x, y])); }
  f.part(almond, { fill: '#f2f2f0', shadow: '#8a8e96', shade: 0.3, maxShade: 30, inkW: 2.4, inkHeavy: 3.4, cast: false, tex: 'mottle1200', texOp: 0.25 });
  clipDraw(f, almond, () => {
    for (let i = 0; i < 18; i++) { const sg = f.r() > 0.5 ? 1 : -1, p0 = add(DC, [sg * (EW - 10), (f.r() - 0.5) * 80]), p1 = add(DC, [sg * (120 + f.r() * 60), (f.r() - 0.5) * 120]), m = add(lerp(p0, p1, 0.5), [(f.r() - 0.5) * 30, (f.r() - 0.5) * 30]); f.line([p0, m, p1], 1.2 + f.r(), '#5a5c64', { op: 0.6 }); }
    const ic = add(DC, [0, 6]);
    f.part(ell(ic, 120, 124, 0, 40), { fill: '#141416', shadow: '#040405', shade: 0.2, inkW: 2, cast: false, hatch: false });
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; f.line([add(ic, [Math.cos(a) * 56, Math.sin(a) * 58]), add(ic, [Math.cos(a) * 112, Math.sin(a) * 116])], 1.2, '#4a4c54', { op: 0.55 }); }
    const pu = ell(ic, 46, 48, 0, 32); f.flat(pu, PAL.void); f.line(pu.concat([pu[0]]), 2.4, '#ffffff', { op: 0.95 }); // the pupil: a clean round hole
  });
  // ---- the lids: black as the disc, meeting in a slit; lashes of hoar along their edges
  const slitU = DC[1] - 5, slitL = DC[1] + 6; // shut: a hairline of white between the lids
  f.bone('lid_u');
  const lu = [add(DC, [-EW - 40, -EH - 60]), add(DC, [EW + 40, -EH - 60]), add(DC, [EW + 30, 0]), ...almond.slice(0, 41).reverse().map(q => [q[0], Math.max(q[1], slitU - Math.sin(Math.PI * (q[0] - DC[0] + EW) / (2 * EW)) * 6)]), add(DC, [-EW - 30, 0])];
  clipDraw(f, disc, () => f.flat(lu, '#040405'));
  const lashU = []; for (let i = 0; i <= 30; i++) { const x = DC[0] - EW + 2 * EW * i / 30; lashU.push([x, slitU - Math.sin(Math.PI * i / 30) * 6]); }
  f.line(lashU, 2.4, '#2a2c30');
  for (let i = 2; i < 29; i += 2) { const q = lashU[i], l = 5 + Math.sin(Math.PI * i / 30) * 8; f.line([q, add(q, [(i - 15) * 0.4, l])], 1.1, '#6a6e76', { op: 0.7 }); } // lashes, grey with hoar, hanging over the slit
  f.bone('lid_l');
  const ll2 = [add(DC, [-EW - 30, 0]), ...almond.slice(40).map(q => q), add(DC, [EW + 30, 0]), add(DC, [EW + 40, EH + 60]), add(DC, [-EW - 40, EH + 60])];
  const llPts = [add(DC, [-EW - 30, 0]), add(DC, [EW + 30, 0]), add(DC, [EW + 40, EH + 60]), add(DC, [-EW - 40, EH + 60])].map(q => q);
  const lowEdge = []; for (let i = 0; i <= 30; i++) { const x = DC[0] - EW + 2 * EW * i / 30; lowEdge.push([x, slitL + Math.sin(Math.PI * i / 30) * 8]); }
  clipDraw(f, disc, () => f.flat([add(DC, [-EW - 30, 0]), ...lowEdge, add(DC, [EW + 30, 0]), add(DC, [EW + 40, EH + 60]), add(DC, [-EW - 40, EH + 60])], '#040405'));
  f.line(lowEdge, 2, '#2a2c30');
  return f;
}

module.exports = {
  heroes: [
    { key: 'cold_star', name: 'The Cold Star', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: coldStar },
    { key: 'rime_shade', name: 'Rime Shade', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: rimeShade },
    { key: 'starless_eye', name: 'Starless Eye', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: starlessEye },
    { key: 'void_mammoth', name: 'Void Mammoth', tier: 'elite', w: TIERS.elite[0], h: 1700, flip: true, build: voidMammoth },
    { key: 'silence_stag', name: 'Silence Stag', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: silenceStag },
    { key: 'frozen_saint', name: 'Frozen Saint', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: frozenSaint },
    { key: 'pale_hunter', name: 'The Pale Hunter', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: paleHunter },
    { key: 'hollow_wanderer', name: 'Hollow Wanderer', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: hollowWanderer },
  ],
};
