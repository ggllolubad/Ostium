// World VI, The Stormwrack Coast (Lightning + Water, Electrocute), batch b: the 11 creatures that bring the world to 19
// (3 rulers, 4 elites, 12 cast). The reviewed 8 live in world_VI.js; this file must read as the same world: kit_VI's
// palette, feathers with slotted fingers, crab-leg segments, sea-wear (barnacles, kelp, salt, drips) and Lichtenberg
// burns. Lightning (dominant) only as marks: branching burns spreading from fused metal, fused joints, welds and standing
// hair. Strikes and arcs are engine effects, never drawn here. The drowned crew are welded through metal, never wood.
// Every foe is built facing right with kit.foeBase light (kit_VI.base) and flipped. Seeds 620 + index (bible order).
'use strict';
const K = require('../kit');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame, Fig } = E;
const V = require('./kit_VI_b');
const T3b = require('./kit_III_b'); // the reviewed modelled fist (knuckleFist / gripK), used by the ruler upgrade pass
const { P, split, side, ang, elb, dir, lumpE, hairMass } = V;
// (independent review) kit_VI draws a struck-metal burn tree as lamp-yellow threads; on dark iron at sheet size these
// read as gold tassels (gold is only for holy things). In this batch a burn tree on metal is a dark scorch with a pale
// heat-tinted edge; the lamp yellow stays as the small glint at each weld.
// The default skin-scar tree (kit_VI: maroon channel, pink keloid edge) reads as pink lace wherever it crosses the
// soaked clothes most of these figures wear, so here a burn tree with no colour given is a dark burnt channel with a
// pale, neutral edge: a scar on skin, a scorch on wool and canvas. Welds (kit_VI_b.weld) take the same colours.
const SCAR = { col: '#33241f', lite: '#c4bcb0' };
{ const lich0 = V.lichtenberg; V.lichtenberg = (f, c, a, len, w, o = {}) => lich0(f, c, a, len, w, o.metal ? Object.assign({}, o, { metal: false, col: '#0e0c0a', lite: '#a8a294', op: 0.9 }) : (o.col || o.pale ? o : Object.assign({}, SCAR, o))); }
{ const base0 = V.base; V.base = (seed, h, o = {}) => Object.assign(base0(seed, h, o), { burnCol: SCAR.col, burnLite: SCAR.lite }); }
const deg = d => d * Math.PI / 180;
// a lit storm lantern with its light a warm pale yellow, kept small (gold is only for holy things): a small soft glow
// behind the globe, the glass washed paler than kit_VI's lamp yellow
function paleLamp(f, top, h, o = {}) {
  const c = add(top, [0, h * 0.62]), w = h * 0.52;
  V.glow(f, c, w * 0.62, h * 0.36, '#f3e8bd', o.op ?? 0.42, false);
  const r = V.stormLantern(f, top, h, { glowOp: 0 });
  f.flat([[c[0] - w * 0.32, c[1] - h * 0.2], [c[0] - w * 0.44, c[1]], [c[0] - w * 0.36, c[1] + h * 0.18], [c[0] + w * 0.36, c[1] + h * 0.18], [c[0] + w * 0.44, c[1]], [c[0] + w * 0.32, c[1] - h * 0.2]], '#fbf4dc', { op: 0.42 });
  for (const u of [-0.36, -0.12, 0.12, 0.36]) f.line([[c[0] + w * u * 0.8, c[1] - h * 0.2], [c[0] + w * u * 1.15, c[1]], [c[0] + w * u, c[1] + h * 0.18]], 2.2, INK); // the wire guard over the wash
  f.flat([add(c, [-w * 0.06, h * 0.07]), add(c, [0, -h * 0.11]), add(c, [w * 0.06, h * 0.07])], '#fffdf2');
  return r;
}
// a sailor's knitted wool cap pulled down over a head frame hf (breaks a bald dome into a sailor's head)
function knitCap(f, hf, col, s) {
  const cap = (pts, o2) => f.part(hf(pts), Object.assign({ fill: col, shadow: '#141416', light: mix(col, '#fff', 0.25), shade: 0.42, tex: 'knit' + s, texOp: 0.7 }, o2 || {}));
  cap([[-0.48, -0.06], [-0.5, -0.36], [-0.34, -0.6], [-0.04, -0.68], [0.24, -0.58], [0.34, -0.34], [0.3, -0.24], [-0.1, -0.26]]); // the crown, slumped back
  cap([[-0.5, -0.02], [-0.42, -0.3], [0.0, -0.36], [0.34, -0.34], [0.36, -0.2], [0.0, -0.18], [-0.44, 0.08]], { inkW: 1.6 }); // the rolled brim
  for (let k = 0; k < 5; k++) f.line(hf([[-0.42 + k * 0.17, -0.31 + Math.abs(k - 2) * 0.01], [-0.4 + k * 0.17, -0.2]]), 1.1, INK, { op: 0.5 }); // ribbing
}
// parallel ink hatching clipped to a region (shadow sides are crosshatched, not graded)
function hatchIn(f, region, a, gap, col, op, w = 1.2) {
  const xs = region.map(q => q[0]), ys = region.map(q => q[1]), c = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2], R0 = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 10;
  const d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]];
  V.clipDraw(f, region, () => { for (let t = -R0; t <= R0; t += gap) { const o = add(c, mul(n, t)); f.line([add(o, mul(d, -R0)), add(o, mul(d, R0))], w, col, { op, straight: true }); } });
}
const ankleCut = (Kn, A) => add(E.norm(sub(A, Kn)), [0.6, 0]);

// ------------------------------------------------------------------ DROWNED MERCHANT (cast, human 1.0)
// A merchant passenger drowned clutching his strongbox. Round and stooped: the box hugged to the belly in both arms, the
// hips pushed forward and the shoulders back against its weight, small shuffling steps. The iron straps of the box are
// fused into his forearms; burns branch from the welds across the chest and neck. Water bloated the face and belly and
// split the fine clothes at the seams. A soaked fur-trimmed velvet gown over a doublet burst down the front; keys, seal,
// purse, silver rings sunk in swollen fingers, one shoe lost, ledger pages stuck to the box.
// Rig: standard humanoid + box (parent forearm_n: the straps are welded to it) + gown (skirt, parent pelvis). The far
// hand holds the box too: in game it follows by IK.
// Motion: idle clutching the box tighter (forearms in, torso curl); attack a ram with the box (torso and arms forward).
function drownedMerchant() {
  const CH = TIERS.human[1], f = new Fig(V.base(630, CH, { shadowTint: '#2a2a38' })); V.textures(f);
  const H = 104, gy = f.o.groundY, s = '630';
  const skin = P.drown, skinS = P.drownS;
  const vel = '#4a4c56', velD = '#30313a', velL = '#6c6e78', fur = '#5e5850', dbl = '#4a4650', dblL = '#6a6670', hose = '#55544e';
  const VL = (o = {}) => Object.assign({ fill: vel, shadow: '#1a1a22', light: velL, shade: 0.4, tex: 'weave' + s, texOp: 0.4 }, o);
  const DB = (o = {}) => Object.assign({ fill: dbl, shadow: '#16161c', light: dblL, shade: 0.4, tex: 'quilt' + s, texOp: 0.5 }, o);
  const DRS = (o = {}) => V.DR(f, o);
  const N = [244, 272], C = [250, 400], PV = [262, 548];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.12, 0.12), SF = S.at(0.4, 0.06);
  const EN = [258, 462], WN = [384, 504];
  const EF = [326, 290], WF = [462, 306];
  const HN = S.at(0.12, 1.0), KN = [310, 660], AN = [326, 746];
  const HF = S.at(-0.3, 0.98), KF = [240, 660], AF = [226, 748];
  const HC = [292, 204], hA = 0.24, hF = frame(HC, hA, H);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [250, 266], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the strongbox, three faces seen: the near end (toward us), the front (toward the heroes) and the top
  const bx = { nb: [282, 318], nf: [388, 352], nfb: [392, 478], nbb: [286, 444], ff: [500, 312], ffb: [504, 438], fb: [394, 278] };
  f.joint('box', lerp(bx.nbb, bx.nfb, 0.5), 'forearm_n').joint('gown', S.at(0, 0.9), 'pelvis');

  // ---- far arm: the upper arm behind the chest (the forearm and hand come over the box's top later)
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [66, 58], { steps: 6 }), DB({ fill: mix(dbl, '#000', 0.2) }));

  // ---- legs: hose under the gown, small shuffling steps; one buckled shoe, the near foot bare and swollen
  const legL = (Hp, Kn, A, sfx, wq, bare) => {
    V.legTube(f, Hp, Kn, lerp(Kn, A, 0.62), [wq, wq * 0.74, wq * 0.62], { fill: hose, shadow: '#1e1e22', shade: 0.4, tex: 'knit' + s, texOp: 0.5 }, sfx, { A, bq: [[1, 0.2, 0.16]] });
    const da = ankleCut(Kn, A);
    if (bare) split(f, () => K.bareLeg(f, lerp(Kn, A, 0.5), A, 1, 56, wq * 0.6, DRS({ fill: mix(skin, skinS, 0.08) }), { swell: 1 }), [['shin' + sfx, side(A, mul(da, -1), 20)], ['foot' + sfx, side(A, da, 20)]]);
    else V.bootRig(f, Kn, A, 52, '#24231f', sfx, { style: 'shoe', shaft: 0.34, strap: true, tex: 'mottle' + s });
  };
  legL(HF, KF, AF, '_f', 78, false);
  f.bone('foot_f'); V.verdigris(f, add(AF, [6, 30]), 6, 4, 3); // the pewter buckle gone green
  f.bone('shin_f'); f.stroke([lp(KF, AF, 0.52, -14), lp(KF, AF, 0.6, 0), lp(KF, AF, 0.54, 14)], 1.6);
  legL(HN, KN, AN, '_n', 84, true);
  f.bone('shin_n');
  { const cu = lerp(KN, AN, 0.5), d = E.norm(sub(AN, KN)), n = [-d[1], d[0]]; f.part([add(add(cu, mul(n, 32)), mul(d, -12)), add(add(cu, mul(n, -30)), mul(d, -8)), [...add(add(cu, mul(n, -28)), mul(d, 6)), 1], add(cu, mul(d, 2)), [...add(add(cu, mul(n, 24)), mul(d, 8)), 1]], { fill: mix(hose, '#fff', 0.06), shadow: '#1e1e22', shade: 0.4, tex: 'knit' + s, inkW: 1.2, cast: false }); } // the stocking rolled down off the bare foot
  V.livid(f, lerp(KN, AN, 0.78), 10, 10, 5); V.veins(f, lerp(KN, AN, 0.7), 8, 8, 3);
  f.bone('foot_n'); V.barnacles(f, add(AN, [36, 34]), 14, 5, 3, 3, 4.5);
  f.bone('root'); for (const a2 of [AN, AF]) f.flat(ell(add(a2, [24, 44]), 52, 5, 0, 12), '#3a4448', { op: 0.5 });

  // ---- the gown's back and skirt: heavy wet velvet from the shoulders to below the knee, open over the belly
  f.bone('gown');
  const gown = [S.at(-0.8, 0.62), S.at(0.2, 0.84), add(S.at(0.9, 1.06), [0, 0]), [378, 640], [370, 690], [352, 702, 1], [326, 690], [296, 706, 1], [262, 696], [226, 710, 1], [196, 700], [164, 708, 1], [154, 650], [166, 570], S.at(-0.9, 0.88)];
  f.part(gown, VL());
  for (const [a2, b2] of [[[184, 560], [176, 696]], [[214, 580], [218, 704]], [[250, 590], [252, 692]], [[300, 600], [308, 694]], [[340, 590], [354, 688]]]) { f.stroke([a2, lerp(a2, b2, 0.5), b2], 2.6); f.line([add(a2, [5, 4]), add(b2, [5, -10])], 1.2, velL, { op: 0.45 }); }
  f.flat([[156, 666], [376, 656], [370, 690], [352, 702], [326, 690], [296, 706], [262, 696], [226, 710], [196, 700], [164, 708]], '#14141a', { op: 0.3 });
  V.furTrim(f, [[158, 700], [196, 704], [240, 706], [290, 702], [336, 696], [372, 684]], 18, fur);
  for (const x of [186, 240, 300, 352]) V.drip(f, [x, 720], 1.1);
  V.saltCrust(f, [240, 620], 60, 20, 12); V.kelpHang(f, [200, 640], 50, 6, 3);
  f.part([[192, 590], [218, 586], [222, 612], [194, 616]], VL({ fill: mix(vel, '#3a2a1a', 0.3), sharp: true, inkW: 1.1 })); f.stitches([[192, 590], [218, 586], [222, 612], [194, 616], [192, 590]], P.bone, 0.8);

  // ---- torso: a bloated pear. The doublet is burst down the front from the chest to the belly; the grey belly sags
  // out of it below the box, its weight hanging over the belt
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.4, 0.36], [0.08, 0.72, 0.6], [0.24, 0.82, 0.78], [0.42, 0.8, 0.96], [0.6, 0.8, 1.2], [0.76, 0.82, 1.42], [0.9, 0.84, 1.56], [1.02, 0.8, 1.5], [1.1, 0.7, 1.16], [1.16, 0.5, 0.6]]);
  f.part(torso, DB());
  const belly = S.shape([[0.36, -0.7, 0.98], [0.56, -0.86, 1.22], [0.74, -1.0, 1.44], [0.9, -1.02, 1.58], [1.02, -0.96, 1.52], [1.1, -0.84, 1.18], [1.15, -0.7, 0.86]]);
  f.part(belly, DRS({ inkW: 1.4, shade: 0.34 }));
  V.livid(f, S.at(1.3, 1.02), 26, 14, 9); V.veins(f, S.at(1.2, 0.86), 20, 16, 5);
  for (let i = 0; i < 6; i++) f.line([S.at(1.05 + i * 0.07, 0.8 + i * 0.035), S.at(1.18 + i * 0.07, 0.86 + i * 0.035)], 1, P.drownL, { op: 0.6 }); // stretch marks
  f.line([S.at(1.48, 0.94), S.at(1.53, 0.97), S.at(1.48, 1.0)], 1.6, INK, { op: 0.75 }); // navel
  f.stroke([S.at(0.9, 1.1), S.at(1.2, 1.08), S.at(1.45, 1.02)], 2.4, mix(skinS, '#000', 0.3)); // the overhang's shadow line
  // the doublet's torn edges: eyelets, broken laces, threads
  const edL = [S.at(0.7, 0.36), S.at(0.86, 0.56), S.at(1.0, 0.74), S.at(1.02, 0.9), S.at(0.96, 1.02)], edR = [S.at(0.98, 0.36), S.at(1.22, 0.56), S.at(1.44, 0.74), S.at(1.58, 0.9), S.at(1.52, 1.02)];
  f.line(edL, 2.4, INK); f.line(edR, 2.4, INK); f.line(edL.map(q => add(q, [-3, 0])), 1, dblL, { op: 0.6 });
  edL.forEach((q, i) => { f.line(ell(q, 2.6, 2.6, 0, 8).concat([ell(q, 2.6, 2.6, 0, 8)[0]]), 1.1, P.bone); if (i % 2) f.line([q, add(q, [10, 5]), add(q, [8, 16])], 1.2, '#2a2620'); });
  // burns branching from the welds up across the bare chest and into the neck
  V.lichtenberg(f, S.at(0.98, 0.66), deg(-104), 110, 2.4, { depth: 3, fork: 0.7 });
  V.lichtenberg(f, S.at(0.6, 0.62), deg(-130), 70, 2, { depth: 2 });
  f.stroke([S.at(-0.5, 0.3), S.at(-0.4, 0.56)], 2.2); f.stroke([S.at(0.3, 0.3), S.at(0.5, 0.5)], 2);
  for (let i = 0; i < 4; i++) { const q = S.at(0.1 + i * 0.16, 0.3 + i * 0.12); f.flat([add(q, [-3, -16]), add(q, [4, -16]), add(q, [5, 16]), add(q, [-3, 16])], '#8a8270', { op: 0.85 }); f.line([add(q, [-3, -16]), add(q, [-3, 16])], 1.2, INK, { op: 0.7 }); } // paned slashes show the shirt
  f.stroke([S.at(0.1, 0.7), S.at(0.5, 0.78), S.at(0.8, 0.8)], 2); V.saltCrust(f, S.at(0.3, 0.5), 30, 30, 10); f.spatter(S.at(0.5, 0.4), 16, 6, '#2a2a32');
  // the gown's back over the shoulders, falling open, a fur collar standing in wet points
  const gb = S.shape([[-0.04, 0.48, 0.1], [0.12, 0.86, 0.2], [0.34, 0.94, 0.0], [0.62, 0.94, -0.36], [0.88, 0.94, -0.6]]);
  f.part(gb, VL());
  f.stroke([S.at(-0.6, 0.3), S.at(-0.7, 0.6), S.at(-0.82, 0.86)], 2.4); f.stroke([S.at(-0.3, 0.2), S.at(-0.4, 0.5)], 2);
  V.saltCrust(f, S.at(-0.55, 0.5), 20, 40, 10); V.wetSheen(f, [S.at(-0.7, 0.2), S.at(-0.76, 0.34), S.at(-0.8, 0.5), S.at(-0.82, 0.62)], 2.2, 0.4);
  V.furTrim(f, [S.at(-0.62, 0.0), S.at(-0.2, -0.04), S.at(0.2, -0.02), S.at(0.5, 0.06)], 30, fur, { hang: 0.8 });
  V.barnacles(f, S.at(-0.3, 0.06), 30, 8, 7, 3, 6); V.mussel(f, S.at(0.24, 0.06), 0.3);
  // belt slung under the belly: purse, the chain of keys, the merchant's seal on its cord
  const bl = [S.at(-0.84, 1.06), S.at(0.0, 1.16), S.at(0.7, 1.18), S.at(1.1, 1.12)];
  f.part([...bl.map(q => add(q, [0, -7])), ...bl.slice().reverse().map(q => add(q, [0, 7]))], { fill: '#2a2420', shadow: '#0c0a08', shade: 0.4, inkW: 1.2, tex: 'mottle' + s });
  const bk = S.at(0.9, 1.16); f.part([add(bk, [-9, -10]), add(bk, [9, -10]), add(bk, [9, 10]), add(bk, [-9, 10])], V.BRS(f, { sharp: true, inkW: 1.2, cast: false })); V.verdigris(f, bk, 6, 6, 3);
  const pu = S.at(-0.4, 1.18); f.part([add(pu, [-16, -4]), add(pu, [14, -4]), add(pu, [20, 30]), add(pu, [2, 42]), add(pu, [-18, 30])], { fill: '#3a3028', shadow: '#120e0a', shade: 0.4, tex: 'mottle' + s, inkW: 1.2 }); f.line([add(pu, [-12, 2]), add(pu, [12, 2])], 2, '#1a1410'); f.line([add(pu, [0, 2]), add(pu, [-2, 16]), add(pu, [2, 22])], 1.4, '#6a5a40');
  const kc = S.at(0.2, 1.17); V.chainLinks(f, [kc, add(kc, [-6, 26]), add(kc, [-2, 48])], 7, P.ironL, { w: 1.6 });
  for (const [a2, l] of [[1.3, 34], [1.7, 40], [2.0, 28]]) { const k0 = add(kc, [-2, 50]), k1 = add(k0, rot([l, 0], a2)); f.line([k0, k1], 4.6, INK); f.line([k0, k1], 2.6, P.ironL); f.line([k1, add(k1, rot([7, 0], a2 + 1.5))], 3.4, P.ironL); }
  const sc = S.at(0.6, 1.18); f.line([sc, add(sc, [4, 24])], 1.4, '#4a3a2a'); f.part(ell(add(sc, [4, 34]), 9, 10, 0, 12), V.BRS(f, { inkW: 1.2, cast: false })); f.flat(ell(add(sc, [4, 34]), 4.5, 5, 0, 10), P.brassD); V.verdigris(f, add(sc, [4, 34]), 6, 6, 3);

  // ---- head: bloated and jowled, mouth pursed, small eyes sunk in the swelling; one soaked tuft of hair standing
  f.bone('head');
  f.part(K.chain([S.at(0.12, 0.04), add(HC, [-10, 46])], [92, 84], { steps: 4 }), DRS());
  V.lichtenberg(f, S.at(0.4, 0.08), deg(-70), 60, 2, { depth: 2 });
  const jowl = hF([[-0.2, 0.22], [-0.04, 0.42], [0.14, 0.52], [0.3, 0.46], [0.36, 0.58], [0.24, 0.72], [0.02, 0.76], [-0.2, 0.64], [-0.3, 0.42]]);
  f.part(jowl, DRS({ shade: 0.32, hatch: false, maxShade: 14 }));
  B.head(f, HC, H, hA, { skin, jaw: 1.55, chin: -0.04, nose: 1.02, hook: -0.15, mouth: 'set', squint: 0.6, browDown: 0.03, age: true, faceShade: 0.8, faceHatch: false, jawShade: 0.3, iris: '#3a3a40', eyeWhite: '#cfd0c6', hairCol: '#5a564e', browCol: '#6a665c' });
  // the swelling: a puffed cheek, swollen lids pressing on small eyes, jowls and a double chin sagging over the collar
  f.part(hF([[0.02, 0.06], [0.2, 0.03], [0.34, 0.14], [0.33, 0.28], [0.18, 0.35], [0.02, 0.27]]), DRS({ cast: false, inkW: 0, shade: 0.5, hatch: false }));
  f.part(hF([[0.05, -0.09], [0.11, -0.115], [0.18, -0.1], [0.18, -0.055], [0.11, -0.066], [0.05, -0.05]]), DRS({ fill: mix(skin, '#7a7898', 0.3), cast: false, inkW: 1, inkHeavy: 1.2, shade: 0.4 }));
  f.flat(hF(ell([0.12, -0.025], 0.08, 0.03, 0, 10)), '#7a7898', { op: 0.55 });
  f.line(hF([[-0.04, 0.48], [0.14, 0.58], [0.32, 0.56]]), 1.6, INK, { op: 0.6 }); f.line(hF([[-0.14, 0.6], [0.04, 0.7], [0.22, 0.7]]), 1.2, INK, { op: 0.45 });
  f.line(hF([[0.06, 0.12], [0.0, 0.24], [0.08, 0.36], [0.18, 0.42]]), 1.4, INK, { op: 0.55 }); // the cheek's fold over the jowl
  V.livid(f, hF([[0.05, 0.1]])[0], 14, 10, 4); V.livid(f, hF([[0.05, 0.6]])[0], 14, 8, 3); V.peel(f, hF([[-0.05, -0.3]])[0], 2, 0.9, 16);
  f.flat(hF([[0.22, 0.27], [0.29, 0.255], [0.335, 0.28], [0.3, 0.325], [0.23, 0.315]]), P.lips, { op: 0.95 }); // pursed blue lips
  f.line(hF([[0.24, 0.288], [0.315, 0.288]]), 1.4, INK); for (let i = 0; i < 3; i++) f.line(hF([[0.25 + i * 0.025, 0.25], [0.26 + i * 0.025, 0.272]]), 0.8, INK, { op: 0.5 });
  // bald crown; sparse wet hair plastered at the sides; one tuft standing straight up
  f.part(hF([[-0.42, 0.16], [-0.46, -0.12], [-0.38, -0.3], [-0.28, -0.18], [-0.3, 0.06]]), { fill: '#5a564e', shadow: '#1e1c1a', shade: 0.4, tex: 'hatch' + s, texOp: 0.4, inkW: 1.2 });
  for (let i = 0; i < 5; i++) f.line(hF([[-0.42 + i * 0.02, -0.2 + i * 0.07], [-0.34 + i * 0.01, 0.04 + i * 0.03]]), 1, '#8a867c', { op: 0.6 });
  V.standingHair(f, [[-0.14, -0.5], [-0.08, -0.52], [-0.02, -0.52], [0.04, -0.51]].map(q => hF([q])[0]), 34, { col: '#6a665c', w: 2.8, fan: 0.7, lean: 0.1 });
  V.drip(f, hF([[0.3, 0.74]])[0], 1); V.drip(f, hF([[0.06, 0.78]])[0], 0.9);
  V.peel(f, hF([[-0.1, -0.42]])[0], 2, 0.8, 12); V.barnacle(f, hF([[-0.3, -0.36]])[0], 4);
  // (independent review) the bald crown read as an egg: the swollen scalp is creased into folds where the water bloated
  // it, lit on the brow ridge and in shadow toward the back, with a fringe of wet hair plastered round the back of the skull
  f.flat(hF([[-0.46, -0.06], [-0.42, -0.34], [-0.2, -0.52], [-0.04, -0.54], [-0.12, -0.3], [-0.3, -0.06]]), '#2a2c3a', { op: 0.28 });
  for (const [v, w2] of [[-0.36, 2.6], [-0.3, 2.2], [-0.24, 1.8]]) { f.stroke(hF([[-0.2, v - 0.06], [0.0, v - 0.1], [0.18, v - 0.04]]), w2 * 1.6, '#3a3a48', { op: 0.6 }); f.line(hF([[-0.18, v - 0.04], [0.0, v - 0.08], [0.16, v - 0.02]]), 1, '#e4e4da', { op: 0.5 }); } // swollen folds across the brow
  for (const [u, v, L] of [[-0.44, -0.1, 0.3], [-0.38, -0.24, 0.42], [-0.3, -0.36, 0.5], [-0.46, 0.06, 0.24]]) { const r0 = hF([[u, v]])[0]; f.stroke([r0, add(r0, [-4, L * 60]), add(r0, [-2, L * 110])], 8, '#4a463e'); f.line([add(r0, [1, 4]), add(r0, [-2, L * 70])], 1, '#8a867c', { op: 0.6 }); } // wet hanks plastered round the back, hanging plumb

  // ---- the strongbox: iron-bound oak, studded, the hasp and a big padlock; ledger pages plastered to it
  f.bone('box');
  const oak = V.WD(f, { fill: '#6e5842', tex: 'wood' + s, texOp: 0.7 });
  V.boxFaces(f, [[bx.nb, bx.nf, bx.ff, bx.fb], [bx.nb, bx.nf, bx.nfb, bx.nbb], [bx.nf, bx.ff, bx.ffb, bx.nfb]], oak);
  for (let i = 1; i < 3; i++) { f.line([lerp(bx.nf, bx.nfb, i / 3), lerp(bx.ff, bx.ffb, i / 3)], 1.6, INK, { op: 0.7 }); f.line([lerp(bx.nb, bx.nbb, i / 3), lerp(bx.nf, bx.nfb, i / 3)], 1.6, INK, { op: 0.7 }); f.line([lerp(bx.nb, bx.fb, i / 3), lerp(bx.nf, bx.ff, i / 3)], 1.4, INK, { op: 0.6 }); } // plank seams
  f.line([lerp(bx.nb, bx.nbb, 0.18), lerp(bx.nf, bx.nfb, 0.18), lerp(bx.ff, bx.ffb, 0.18)], 2, INK, { op: 0.8, straight: true }); // the lid's line
  V.strap(f, bx.nf, bx.nfb, 12, { rivets: 5 }); // iron corner binding
  for (const t of [0.3, 0.76]) V.strap(f, lerp(bx.nf, bx.ff, t), lerp(bx.nfb, bx.ffb, t), 13, { rivets: 4 }); // girth straps over the front
  for (const t of [0.3, 0.76]) V.strap(f, lerp(bx.nf, bx.ff, t), lerp(bx.nb, bx.fb, t), 11, { rivets: 2 }); // and over the lid
  for (const c of [bx.nb, bx.ff, bx.nbb, bx.ffb]) f.part(ell(c, 6, 6, 0, 8), V.IR(f, { inkW: 1, cast: false })); // corner caps
  // the hasp and the big padlock on the front
  const hp = lerp(bx.nf, bx.ff, 0.53); f.part([add(hp, [-7, -3]), add(hp, [7, -5]), add(hp, [8, 28]), add(hp, [-7, 30])], V.IR(f, { sharp: true, inkW: 1.2, cast: false }));
  const pl = add(hp, [0, 44]); f.line(ell(add(pl, [0, -12]), 9, 10, 0, 12).slice(6, 13), 4.6, INK); f.line(ell(add(pl, [0, -12]), 9, 10, 0, 12).slice(6, 13), 2.6, P.ironL);
  f.part([add(pl, [-15, -8]), add(pl, [15, -10]), add(pl, [17, 10]), add(pl, [10, 22]), add(pl, [-10, 24]), add(pl, [-17, 12])], V.IR(f, { inkW: 1.4, cast: false })); f.flat([add(pl, [-2, 2]), add(pl, [2, 2]), add(pl, [2, 12]), add(pl, [-2, 12])], '#050404'); f.flat(ell(add(pl, [0, 1]), 3, 3, 0, 8), '#050404');
  V.verdigris(f, pl, 10, 10, 4, 0.5); f.flat(ell(add(pl, [8, 14]), 6, 3, 0.4, 8), P.rust, { op: 0.6 });
  // ledger pages stuck wet to the near end, inked columns running
  const lg = lerp(lerp(bx.nb, bx.nbb, 0.45), lerp(bx.nf, bx.nfb, 0.45), 0.2), lgf = frame(lg, 0.12, 1);
  f.part(lgf([[-6, -16], [26, -18], [30, 20], [22, 28], [-4, 24]]), { fill: '#c8c2ae', shadow: '#6a6658', shade: 0.3, inkW: 1, cast: false, tex: 'mottle' + s, texOp: 0.5 });
  for (let i = 0; i < 5; i++) f.line(lgf([[-2, -12 + i * 7], [24, -14 + i * 7]]), 0.8, '#3a3a52', { op: 0.6, dash: '3 2' });
  f.line(lgf([[8, -16], [10, 24]]), 0.8, P.rustD, { op: 0.6 }); f.flat(lgf(ell([14, 6], 10, 6, 0.5, 8)), '#3a3a52', { op: 0.25 });
  V.barnacles(f, lerp(bx.nfb, bx.ffb, 0.5), 30, 4, 5, 3, 5.5); V.kelpHang(f, lerp(bx.nfb, bx.ffb, 0.8), 40, 5, 2);
  V.scorch(f, lerp(bx.nf, bx.ff, 0.3), 14, 8, 0.5); V.saltCrust(f, lerp(bx.nb, bx.ff, 0.5), 30, 6, 8);
  // the welded girth strap down the near end, under the forearm
  const st0 = lerp(bx.nb, bx.nf, 0.5), st1 = lerp(bx.nbb, bx.nfb, 0.5);
  V.strap(f, st0, add(st1, [0, 2]), 13, { rivets: 3 });

  // ---- far forearm over the box's lid, the swollen fingers hooked down over its far front corner
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.55)], [60, 54], { steps: 6 }), DB({ fill: mix(dbl, '#000', 0.12) }));
  f.part(K.ragLimb(f, EF, lerp(EF, WF, 0.5), 62, 58, { depth: 8, teeth: 5 }), DB({ fill: mix(dbl, '#000', 0.12), cast: false }));
  f.part(K.chain([lerp(EF, WF, 0.45), WF], [50, 46], { steps: 6 }), DRS({ fill: mix(skin, skinS, 0.15) }));
  V.weld(f, lp(EF, WF, 0.78, 0), ang(bx.nf, bx.ff) + Math.PI / 2, 15, { burns: [[deg(200), 46, 1.8]] }); // fused to the lid strap
  f.bone('hand_f');
  V.openHand(f, WF, deg(70), 60, { look: DRS({ fill: mix(skin, skinS, 0.12) }), back: true, curl: 0.55, spread: 0.06, swell: 0.75 });

  // ---- near arm: doublet sleeve, burst along the forearm; the swollen forearm along the box's lower edge, the girth
  // strap running down over it and welded into the flesh; the hand cupping the box's front corner from below
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.3)], [80, 70, 64], { steps: 8, bp: [[0, 0.4, 0.12]] }), DB());
    f.stroke([lp(SN, EN, 0.5, 22), lp(SN, EN, 0.7, 4), lp(SN, EN, 0.85, -22)], 2);
  }, [['upperarm_n', side(EN, mul(de, -1), 36)], ['forearm_n', side(EN, de, 36)]]);
  f.bone('torso'); // the gown's sleeve hangs from the shoulder: wide, open, fur-cuffed (on the torso so it does not fly off)
  const gs = [add(SN, [-40, -14]), add(SN, [30, -16]), lp(SN, EN, 0.5, -46), lp(SN, EN, 0.72, -50), [...lp(SN, EN, 0.82, -36), 1], lp(SN, EN, 0.74, 8), lp(SN, EN, 0.4, 44)];
  f.part(gs, VL()); f.stroke([lp(SN, EN, 0.2, -10), lp(SN, EN, 0.5, -24), lp(SN, EN, 0.7, -36)], 2.2); f.stroke([lp(SN, EN, 0.15, 20), lp(SN, EN, 0.4, 14), lp(SN, EN, 0.62, -6)], 2.2); f.stroke([lp(SN, EN, 0.3, 36), lp(SN, EN, 0.5, 30)], 1.8);
  V.wetSheen(f, [lp(SN, EN, 0.1, -30), lp(SN, EN, 0.3, -38), lp(SN, EN, 0.5, -42), lp(SN, EN, 0.66, -44)], 2.2, 0.45); V.saltCrust(f, lp(SN, EN, 0.4, 10), 16, 20, 8); f.part([lp(SN, EN, 0.36, 24), lp(SN, EN, 0.34, 6), lp(SN, EN, 0.52, 4), lp(SN, EN, 0.54, 22)], VL({ fill: mix(vel, '#3a2a1a', 0.3), sharp: true, inkW: 1.1, cast: false })); f.stitches([lp(SN, EN, 0.36, 24), lp(SN, EN, 0.34, 6), lp(SN, EN, 0.52, 4), lp(SN, EN, 0.54, 22)], P.bone, 0.8);
  V.furTrim(f, [lp(SN, EN, 0.82, -36), lp(SN, EN, 0.78, -10), lp(SN, EN, 0.72, 10)], 16, fur);
  V.barnacles(f, add(SN, [0, 4]), 16, 8, 4, 3, 5);
  f.bone('forearm_n');
  f.part(K.chain([lerp(EN, WN, 0.15), lerp(EN, WN, 0.6), WN], [66, 62, 50], { steps: 8, bq: [[0, 0.5, 0.1]] }), DRS());
  V.livid(f, lerp(EN, WN, 0.5), 22, 10, 4); f.line([lp(EN, WN, 0.3, 14), lp(EN, WN, 0.9, 10)], 1.2, INK, { op: 0.45 });
  f.part(K.ragLimb(f, lerp(EN, WN, 0.05), lerp(EN, WN, 0.48), 74, 70, { depth: 9, teeth: 6 }), DB({ cast: false }));
  const sx = lp(EN, WN, 0.62, 0); // where the strap, run under the box, crosses the forearm
  f.part([add(sx, [-7, -30]), add(sx, [7, -30]), add(sx, [8, 30]), add(sx, [-6, 30])].map(q => [...q, 1]), V.IR(f, { inkW: 1.2, cast: false, shade: 0.3 }));
  V.weld(f, add(sx, [0, -26]), Math.PI / 2, 16, { burns: [[deg(-150), 56, 2], [deg(-100), 30, 1.4]] });
  V.weld(f, add(sx, [1, 26]), Math.PI / 2, 15, { burns: [[deg(160), 40, 1.6]] });
  f.bone('hand_n');
  const hd = V.openHand(f, add(WN, [0, -4]), deg(-58), 64, { look: DRS(), back: true, curl: 0.55, spread: 0.06, swell: 0.75 });
  for (const i of [1, 3]) { const g = hd.fing[i], q = lerp(g.kb, g.k1, 0.55), d = E.norm(sub(g.k1, g.kb)), n = [-d[1], d[0]]; f.part([add(q, mul(n, g.W * 0.56)), add(add(q, mul(n, g.W * 0.56)), mul(d, 6)), add(add(q, mul(n, -g.W * 0.56)), mul(d, 6)), add(q, mul(n, -g.W * 0.56))], { fill: '#b8bcbc', shadow: '#3a3e44', light: '#f4f6f4', shade: 0.4, inkW: 1, cast: false, hatch: false }); } // silver rings sunk in the swollen fingers
  V.barnacle(f, hd.fing[2].k1, 3.6); V.barnacle(f, hd.fing[0].k1, 3); V.peel(f, WN, 2);
  return f;
}

// ------------------------------------------------------------------ DROWNED DRUMMER (cast, human 1.0)
// The marine drummer of a warship wrecked on the coast, still beating to quarters. A young man bloated pale, marching in
// place: the weight on the near leg, the far knee lifted under the drum, which is slung on a sling from the near shoulder
// to the far (in-game left) hip and rides in front of the thigh. Both sticks are raised above the split head. The strike
// came through the drum's iron hoop: the hoop is fused to his hip, burns fern up the ribs and down the thigh, the sticks
// are scorched into his fists, the hair stands under the dented morion. A padded jacket, canvas trousers, stockings
// fallen round the ankles, buckled shoes, a short sword, spare sticks in the belt; barnacles across the shoulders.
// Rig: standard humanoid + drum (parent pelvis: the hoop is welded to the hip) + stick_n, stick_f (parent hands).
// Motion: idle a slow silent beat (forearms and sticks); attack a roll on the split drum (sticks fast, last beat high).
function drownedDrummer() {
  const CH = TIERS.human[1], f = new Fig(V.base(628, CH, { shadowTint: '#2a2a38' })); V.textures(f);
  const H = 100, gy = f.o.groundY, s = '628';
  const skin = P.drown, skinS = P.drownS;
  const jack = '#5a5e66', jackD = '#383c44', jackL = '#7c8088', canv = '#6e6c64', canvD = '#4e4c46', hoseC = '#6a6862';
  const JK = (o = {}) => Object.assign({ fill: jack, shadow: '#181a22', light: jackL, shade: 0.4, tex: 'quilt' + s, texOp: 0.55 }, o);
  const CV = (o = {}) => Object.assign({ fill: canv, shadow: '#2c2a24', shade: 0.4, tex: 'weave' + s, texOp: 0.5 }, o);
  const DRS = (o = {}) => V.DR(f, o);
  const N = [300, 266], C = [298, 390], PV = [292, 508];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.1, 0.12), SF = S.at(0.42, 0.06);
  const EN = [304, 414], WN = [374, 350];
  const EF = [386, 404], WF = [438, 334];
  const HN = S.at(-0.1, 1.0), KN = [292, 640], AN = [284, 744];
  const HF = S.at(0.36, 0.98), KF = [404, 596], AF = [392, 688];
  const HC = [330, 196], hA = -0.08, hF = frame(HC, hA, H);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [304, 260], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // sticks: square-ish to each forearm, raised over the drum, the tips forward
  // drumsticks run on from the forearm through the palm, like a sword grip (inline): the near stick dipping toward the
  // head mid-beat, the far stick lifted high for the next stroke
  const tN = ang(EN, WN) + deg(6), tF = ang(EF, WF) - deg(16);
  f.joint('drum', [356, 506], 'pelvis').joint('stick_n', WN, 'hand_n').joint('stick_f', WF, 'hand_f');
  const DC = [404, 530], dA = -0.32; // drum centre and the tilt of its axis
  const stick = (W0, a, L) => { const t = add(W0, rot([L, 0], a)), b0 = add(W0, rot([-34, 0], a)); f.part(limb(b0, t, 11, 7, { steps: 6, capK: 1 }), V.WD(f, { fill: '#7a6a50', tex: 'wood' + s, inkW: 1.2, inkHeavy: 1.6, cast: false })); f.part(ell(add(t, rot([-4, 0], a)), 7, 5.6, a, 10), V.WD(f, { fill: '#8a7a5e', inkW: 1.1, cast: false })); f.flat(ell(add(W0, rot([20, 0], a)), 9, 6, a, 10), '#141210', { op: 0.85 }); V.lichtenberg(f, add(W0, rot([22, 0], a)), a, 40, 1.2, { metal: true, depth: 1 }); f.line([add(W0, rot([34, -2], a)), add(W0, rot([L - 10, -2], a))], 1, '#c8b890', { op: 0.5 }); return t; };

  // ---- far arm: the upper arm behind the body
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [58, 50], { steps: 6 }), JK({ fill: jackD }));

  // ---- far leg, lifted mid-step under the drum: trouser to mid-calf, bare swollen shin, stocking round the ankle, shoe
  const legD = (Hp, Kn, A, sfx, wq, tone, lifted) => {
    const cu = lerp(Kn, A, 0.4), da = ankleCut(Kn, A);
    split(f, () => { f.part(K.chain([cu, A], [wq * 0.6, 36], { steps: 6 }), DRS({ fill: mix(skin, skinS, tone) })); V.livid(f, lerp(cu, A, 0.5), 10, 14, 4); }, [['shin' + sfx, side(A, mul(da, -1), 18)]]);
    V.bootRig(f, Kn, A, 50, '#22211e', sfx, { style: 'shoe', shaft: 0.28, strap: true, tex: 'mottle' + s, groundY: lifted ? A[1] + 46 : gy });
    f.bone('foot' + sfx);
    const bk = add(A, [16, 26]); f.part([add(bk, [-7, -6]), add(bk, [7, -6]), add(bk, [7, 6]), add(bk, [-7, 6])], { fill: '#8e9290', shadow: '#3a3e40', shade: 0.4, inkW: 1, sharp: true, cast: false }); f.flat([add(bk, [-3, -2]), add(bk, [3, -2]), add(bk, [3, 2]), add(bk, [-3, 2])], '#22211e'); // pewter buckle
    f.bone('shin' + sfx); // the stocking fallen in rolls round the ankle
    { const q = lp(Kn, A, 0.84, 0), d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], P2 = (u, v) => add(add(q, mul(n, u)), mul(d, v));
      f.part([P2(21, -16), P2(8, -10), P2(-10, -14), P2(-21, -8), P2(-25, 10), P2(-20, 22), P2(-6, 18), P2(8, 26), P2(22, 20), P2(25, 4)], { fill: hoseC, shadow: '#22222a', shade: 0.42, tex: 'knit' + s, texOp: 0.6, inkW: 1.2, cast: false, k: 0.8 }); // the stocking fallen into a slack heap round the ankle
      for (const [a2, b2] of [[P2(-20, -4), P2(2, 2)], [P2(-4, 8), P2(20, 12)], [P2(-16, 14), P2(-2, 18)]]) f.stroke([a2, lerp(a2, b2, 0.5), b2], 1.6);
      f.line([P2(14, -12), P2(12, -24), P2(16, -30)], 1, hoseC, { op: 0.8 }); }
    V.legTube(f, Hp, Kn, cu, [wq, wq * 0.76, wq * 0.7], CV({ fill: mix(canv, '#000', tone) }), sfx, { A, bp: [[0, 0.4, 0.12]], after: () => {
      const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], w = wq * 0.36;
      const rT = E.rng(6281 + Math.round(wq)), th = [add(add(cu, mul(n, w + 3)), mul(d, -14)), add(add(cu, mul(n, -w - 3)), mul(d, -14))]; for (let k = 0; k <= 7; k++) { const u = -w - 2 + (2 * w + 4) * k / 7, dd = k % 2 ? 6 + rT() * 22 : rT() * 6; th.push(k % 2 ? [...add(add(cu, mul(n, u)), mul(d, dd)), 1] : add(add(cu, mul(n, u)), mul(d, dd))); } f.part(th, CV({ fill: mix(canv, '#000', tone), inkW: 1.1, cast: false, maxShade: 6 })); for (const q of th.filter(q => q[2] === 1)) f.line([q, add(q, mul(d, 8 + rT() * 10))], 1, canv, { op: 0.7 }); // the canvas torn off at mid-calf in uneven strips, threads hanging (not a rolled cuff)
      f.stroke([lp(Hp, Kn, 0.8, -w), lp(Kn, cu, 0.1, 0), lp(Kn, cu, 0.25, w)], 1.8);
    } });
  };
  legD(HF, KF, AF, '_f', 70, 0.18, true);

  // ---- torso: a young marine's chest in a soaked padded jacket, buttoned, a belt at the waist
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.38, 0.34], [0.08, 0.66, 0.56], [0.24, 0.74, 0.72], [0.44, 0.68, 0.74], [0.66, 0.62, 0.78], [0.86, 0.64, 0.8], [1.02, 0.66, 0.72], [1.1, 0.6, 0.6]]);
  f.part(torso, JK());
  // (independent review) the padded jacket quilted in channels that wrap the barrel of the chest: a stitched seam in a
  // valley between puffed, lit rolls, so the panel is not a flat slab
  V.clipDraw(f, torso, () => { for (const u of [-0.7, -0.46, -0.22, 0.02, 0.26, 0.48]) { const L = [S.at(u, 0.06), S.at(u * 1.06, 0.4), S.at(u * 1.1, 0.7), S.at(u * 1.08, 1.0)]; f.stroke(L, 7, '#08090c', { op: 0.45 }); f.line(L, 1, '#8a8e94', { op: 0.5, dash: '4 4' }); f.line(L.map(q => add(q, [10, 0])), 2.4, jackL, { op: 0.35 }); } for (const v of [0.3, 0.56, 0.82]) f.stroke([S.at(-0.74, v), S.at(-0.2, v + 0.03), S.at(0.5, v)], 3, '#08090c', { op: 0.35 }); hatchIn(f, [S.at(-0.9, 0.1), S.at(-0.55, 0.1), S.at(-0.55, 1.05), S.at(-0.9, 1.05)], deg(60), 7, '#06070a', 0.45, 1.1); });
  // a burnt rent at the ribs: the bloated skin under it, burns ferning up from the hip weld
  const rr = S.at(0.36, 0.68); f.part([add(rr, [-18, -30]), add(rr, [8, -36]), add(rr, [22, -6]), add(rr, [16, 30]), add(rr, [-10, 34]), add(rr, [-22, 4])], DRS({ inkW: 1.4, cast: false }));
  V.lichtenberg(f, add(rr, [6, 34]), deg(-100), 70, 2.2, { depth: 2, fork: 0.7 });
  f.line([add(rr, [-18, -30]), add(rr, [8, -36]), add(rr, [22, -6]), add(rr, [16, 30]), add(rr, [-10, 34]), add(rr, [-22, 4]), add(rr, [-18, -30])], 3, '#141210', { op: 0.7 });
  f.stroke([S.at(-0.4, 0.3), S.at(-0.3, 0.6)], 2.2); f.stroke([S.at(0.0, 0.4), S.at(0.1, 0.7)], 2); f.stroke([S.at(-0.6, 0.5), S.at(-0.5, 0.8)], 2.2); f.stroke([S.at(-0.2, 0.74), S.at(0.1, 0.86)], 1.8);
  f.part([S.at(-0.58, 0.28), S.at(-0.36, 0.26), S.at(-0.34, 0.42), S.at(-0.56, 0.44)], JK({ fill: mix(jack, '#3a2a1a', 0.25), sharp: true, inkW: 1.1, cast: false })); f.stitches([S.at(-0.58, 0.28), S.at(-0.36, 0.26), S.at(-0.34, 0.42), S.at(-0.56, 0.44), S.at(-0.58, 0.28)], P.bone, 0.8); // patch
  const ed = [S.at(0.5, 0.12), S.at(0.62, 0.4), S.at(0.68, 0.7), S.at(0.66, 0.96)]; f.line(ed, 2.2, INK); f.line(ed.map(q => add(q, [-3, 0])), 1, jackL, { op: 0.5 });
  [0.2, 0.36, 0.52].forEach((v, i) => { const q = S.at(0.56 + v * 0.18, v); f.part(ell(q, 5.5, 5.5, 0, 10), { fill: '#8e9290', shadow: '#3a3e40', shade: 0.4, inkW: 1, cast: false }); if (i === 1) V.fusedRun(f, add(q, [0, 4]), 10, 3, '#8e9290'); });
  V.saltCrust(f, S.at(-0.2, 0.5), 30, 40, 12); V.wetSheen(f, [S.at(-0.6, 0.2), S.at(-0.62, 0.36), S.at(-0.64, 0.52), S.at(-0.66, 0.66)], 2, 0.4);
  f.part([S.at(-0.66, 0.96), S.at(0.72, 0.94), S.at(0.74, 1.04), S.at(-0.68, 1.06)], { fill: '#2a2620', shadow: '#0c0a08', shade: 0.4, inkW: 1.2, tex: 'mottle' + s, sharp: true }); // belt
  const bk = S.at(0.5, 0.99); f.part([add(bk, [-9, -9]), add(bk, [9, -9]), add(bk, [9, 9]), add(bk, [-9, 9])], { fill: '#8e9290', shadow: '#3a3e40', shade: 0.4, inkW: 1.2, sharp: true, cast: false }); f.flat([add(bk, [-4, -4]), add(bk, [4, -4]), add(bk, [4, 4]), add(bk, [-4, 4])], '#2a2620');
  for (const [u, a2] of [[-0.3, -1.3], [-0.16, -1.42]]) { const q = S.at(u, 1.0); f.part(limb(add(q, rot([-30, 0], a2)), add(q, rot([40, 0], a2)), 9, 7, { steps: 4 }), V.WD(f, { fill: '#7a6a50', inkW: 1.1, cast: false })); } // spare sticks through the belt
  V.barnacles(f, S.at(-0.2, 0.08), 34, 10, 9, 3, 6.5); V.barnacles(f, S.at(0.36, 0.06), 16, 6, 4, 3, 5);
  // the sling: from the near shoulder across the chest to the drum at the far hip
  f.part([S.at(-0.36, 0.02), S.at(-0.1, -0.02), S.at(0.72, 0.84), S.at(0.6, 0.92)], { fill: '#d0ccbc', shadow: '#5a5850', shade: 0.4, inkW: 1.3, tex: 'weave' + s, texOp: 0.4 });
  f.stitches([S.at(-0.24, 0.02), S.at(0.62, 0.86)], '#6a6658', 0.9); V.scorch(f, S.at(0.5, 0.66), 12, 20, 0.45, -0.8);
  const sb = S.at(0.12, 0.3); f.part(ell(sb, 9, 11, -0.8, 10), { fill: '#8e9290', shadow: '#3a3e40', shade: 0.4, inkW: 1.1, cast: false }); f.flat(ell(sb, 4, 5, -0.8, 8), '#2a2a2e'); // the sling plate
  // the short sword on the near hip: brass-less iron hilt, a leather scabbard angled back
  f.bone('pelvis');
  // the jacket's short skirts over the seat, split at the back, hanging wet
  const jt = [S.at(-0.7, 0.98), S.at(0.5, 1.02), add(S.at(0.6, 1.08), [4, 30]), add(S.at(0.2, 1.1), [0, 44]), [...add(S.at(-0.1, 1.1), [0, 36]), 1], add(S.at(-0.4, 1.1), [-4, 48]), add(S.at(-0.78, 1.08), [-8, 34])];
  f.part(jt, JK({ fill: mix(jack, '#000', 0.08) })); f.stroke([S.at(-0.4, 1.02), add(S.at(-0.4, 1.1), [-2, 40])], 2); f.stroke([S.at(0.2, 1.04), add(S.at(0.2, 1.1), [0, 36])], 1.8);
  for (const u of [-0.5, 0.0, 0.4]) V.drip(f, add(S.at(u, 1.1), [0, 44]), 1);
  const sw0 = S.at(-0.5, 1.0); f.part([add(sw0, [-6, -6]), add(sw0, [8, -4]), add(sw0, [-52, 120]), add(sw0, [-64, 116])], { fill: '#2a2420', shadow: '#0c0a08', shade: 0.4, inkW: 1.2, tex: 'mottle' + s });
  f.part([add(sw0, [-60, 112]), add(sw0, [-50, 116]), add(sw0, [-56, 128]), add(sw0, [-66, 124])], V.IR(f, { inkW: 1, cast: false })); // chape
  f.part(limb(add(sw0, [4, -6]), add(sw0, [20, -40]), 11, 10, { steps: 4 }), V.WD(f, { fill: '#3a2c22', inkW: 1.1, cast: false })); f.part(limb(add(sw0, [-12, -2]), add(sw0, [18, -10]), 7, 7, { steps: 3 }), V.IR(f, { inkW: 1, cast: false })); f.part(ell(add(sw0, [22, -44]), 7, 6, 0, 8), V.IR(f, { inkW: 1, cast: false }));

  // ---- near leg, planted and carrying the weight
  legD(HN, KN, AN, '_n', 76, 0.0, false);
  f.bone('thigh_n'); V.lichtenberg(f, lp(HN, KN, 0.12, 18), deg(96), 80, 2, { depth: 2, col: '#3a2a2c', lite: '#9a8a80' }); // the burn scorched through the canvas down the thigh
  f.part([lp(HN, KN, 0.5, -10), lp(HN, KN, 0.46, 14), lp(HN, KN, 0.66, 16), lp(HN, KN, 0.7, -8)], CV({ fill: mix(canv, '#3a2a1a', 0.3), sharp: true, inkW: 1.1, cast: false })); f.stitches([lp(HN, KN, 0.5, -10), lp(HN, KN, 0.46, 14), lp(HN, KN, 0.66, 16), lp(HN, KN, 0.7, -8), lp(HN, KN, 0.5, -10)], P.bone, 0.8);
  f.bone('root'); for (const a2 of [AN]) f.flat(ell(add(a2, [26, 46]), 56, 5, 0, 12), '#3a4448', { op: 0.5 });

  // ---- the drum: a wooden shell with a split head, iron hoops, tension ropes fused stiff, leather tugs; the lower hoop
  // welded to the hip
  f.bone('drum');
  const ax = dir(dA - Math.PI / 2), R0 = 86, dep = 104, tc = add(DC, mul(ax, dep / 2)), bc = add(DC, mul(ax, -dep / 2)), ry = 30;
  const eT = ell(tc, R0, ry, dA, 24), eB = ell(bc, R0, ry, dA, 24), u = dir(dA);
  const shell = [add(tc, mul(u, R0)), ...ell(bc, R0, ry, dA, 24).filter((q, i) => i <= 12), add(tc, mul(u, -R0))];
  const shellPts = [add(tc, mul(u, R0)), add(bc, mul(u, R0)), ...Array.from({ length: 11 }, (_, i) => { const t = Math.PI * (i + 1) / 12; return add(bc, rot([Math.cos(t) * R0, Math.sin(t) * ry], dA)); }), add(bc, mul(u, -R0)), add(tc, mul(u, -R0))];
  f.part(shellPts, V.WD(f, { fill: '#5e6064', light: '#8a8e92', shadow: '#22242a', tex: 'wood' + s, texOp: 0.5 }));
  // painted band and the ship's number, worn off; rope zigzag: from the top hoop to the bottom hoop and back
  const tp = i => add(tc, rot([Math.cos(Math.PI * i / 6) * R0, Math.sin(Math.PI * i / 6) * ry], dA)), bp = i => add(bc, rot([Math.cos(Math.PI * i / 6) * R0, Math.sin(Math.PI * i / 6) * ry], dA));
  f.flat([tp(1.6), tp(4.4), bp(4.4), bp(1.6)].map(q => add(q, mul(ax, -14))), '#3a3e48', { op: 0.35 });
  f.line([lerp(tp(3), bp(3), 0.4), lerp(tp(3.3), bp(3.3), 0.55)], 1, P.bone, { op: 0.4 });
  for (let i = 0; i < 6; i++) { const a = 0.4 + i * 1.0, b2 = a + 0.5, c = a + 1.0; const r = [tp(a), bp(b2), tp(Math.min(5.8, c))]; f.line(r, 4.6, INK, { straight: true }); f.line(r, 2.6, '#3a342a', { straight: true }); f.line(r, 0.9, '#8a7a5a', { straight: true, op: 0.6 }); const tug = lerp(tp(a), bp(b2), 0.62); f.part([add(tug, rot([-8, -6], dA)), add(tug, rot([8, -6], dA)), add(tug, rot([7, 8], dA)), add(tug, rot([-7, 8], dA))], { fill: '#3a2c20', shadow: '#0e0a08', shade: 0.4, inkW: 1, cast: false }); }
  // bottom hoop (iron), the counter-hoop on top, the top head with its split
  const hoop = (c, w) => { const e = ell(c, R0 + 3, ry + 2, dA, 24), front = e.filter((_, i) => i <= 12); f.line(front, w + 2.4, INK); f.line(front, w, P.iron); f.line(front.map(q => add(q, [0, -1])), 1, P.ironL, { op: 0.7 }); };
  hoop(bc, 7);
  f.part(eT, { fill: '#c8c2b0', shadow: '#6a665a', light: '#e8e4d8', shade: 0.3, inkW: 1.4, cast: false, tex: 'mottle' + s, texOp: 0.6 }); // vellum head, dirty
  const spl = [add(tc, rot([-50, -8], dA)), add(tc, rot([-14, -2], dA)), add(tc, rot([10, 8], dA)), add(tc, rot([46, 4], dA))]; f.part([...spl.map(q => add(q, [0, -3])), ...spl.slice().reverse().map(q => add(q, [0, 4]))], { fill: '#141210', shade: 0.2, inkW: 1, cast: false }); f.line(spl, 1, '#e8e4d8', { op: 0.5 });
  f.line(ell(tc, R0 * 0.8, ry * 0.8, dA, 24).slice(14, 22), 1, '#8a8676', { op: 0.6 }); f.flat(ell(add(tc, rot([24, -6], dA)), 12, 4, dA, 8), '#5a564a', { op: 0.4 }); // stick wear on the head
  const eTr = ell(tc, R0 + 3, ry + 2, dA, 24); f.line(eTr.concat([eTr[0]]), 9.4, INK); f.line(eTr.concat([eTr[0]]), 7, P.iron); f.line(eTr.slice(14, 22), 1.2, P.ironL, { op: 0.7 });
  for (let i = 0; i < 6; i++) f.rivet(tp(0.4 + i), 2, P.ironL);
  V.lichtenberg(f, bp(4.6), deg(-60), 60, 1.6, { metal: true, depth: 2 }); V.scorch(f, bp(4.8), 20, 10, 0.5);
  V.barnacles(f, bp(2), 20, 4, 4, 3, 5); V.kelpHang(f, bp(1.4), 46, 5, 2); V.saltCrust(f, lerp(tp(2), bp(2), 0.5), 30, 20, 10);
  V.weld(f, bp(5.3), dA + Math.PI / 2, 18, { burns: [[deg(200), 40, 1.8], [deg(-150), 30, 1.4]] }); // the bottom hoop fused into the hip

  // ---- head: bloated young face, the eyes rolled up, the mouth set; a dented morion with a comb; hair standing
  f.bone('head');
  f.part(K.chain([S.at(0.1, 0.04), add(HC, [-12, 40])], [64, 58], { steps: 4 }), DRS());
  f.part(S.shape([[-0.04, 0.36, 0.3], [0.03, 0.42, 0.4], [0.07, 0.34, 0.24]]), JK({ fill: jackD, inkW: 1.4 })); // stand collar
  V.lichtenberg(f, S.at(0.2, 0.02), deg(-80), 40, 1.6, { depth: 1 });
  B.head(f, HC, H, hA, { skin, jaw: 1.18, chin: 0.0, nose: 0.95, hook: -0.1, mouth: 'set', squint: -0.1, browDown: -0.02, faceShade: 0.8, faceHatch: false, jawShade: 0.35, iris: '#d9dcd2', eyeWhite: '#d9dcd2', hairCol: '#4a4640', browCol: '#5a564e', lips: false });
  // eyes rolled up: only a sliver of grey iris under the upper lids
  f.flat(hF([[0.09, -0.07], [0.13, -0.078], [0.165, -0.07], [0.13, -0.064]]), '#5a5e6a'); f.flat(hF([[0.283, -0.072], [0.3, -0.078], [0.31, -0.07], [0.29, -0.066]]), '#5a5e6a');
  f.flat(hF(ell([0.12, -0.02], 0.08, 0.03, 0, 10)), '#7a7898', { op: 0.5 }); // swollen lower lid
  f.part(hF([[0.04, 0.06], [0.2, 0.04], [0.32, 0.14], [0.31, 0.26], [0.18, 0.31], [0.04, 0.25]]), DRS({ cast: false, inkW: 0, shade: 0.5, hatch: false })); // puffed cheek
  f.flat(hF([[0.19, 0.27], [0.3, 0.265], [0.31, 0.295], [0.2, 0.3]]), P.lips, { op: 0.85 });
  V.livid(f, hF([[-0.05, 0.12]])[0], 8, 6, 3, 0.6); V.peel(f, hF([[0.1, 0.4]])[0], 2, 0.8, 12);
  // hair standing under the brim at the nape and temple, stiff
  V.standingHair(f, [[-0.42, -0.1], [-0.4, 0.0], [-0.34, 0.08], [-0.28, 0.12]].map(q => hF([q])[0]), 24, { col: '#4a4640', w: 2.4, lean: -1.1, fan: 0.9 });
  // the morion: a tall steel crown with a comb, a brim peaked fore and aft, dented and rusted
  const mo = (pts, o2) => f.part(hF(pts), Object.assign(V.IR(f, { fill: '#6a6e72', light: '#a8acae', shadow: '#1e2024', tex: 'pit' + s, texOp: 0.5 }), o2 || {}));
  mo([[-0.4, -0.28], [-0.42, -0.46], [-0.3, -0.58], [0.0, -0.62], [0.22, -0.56], [0.32, -0.42], [0.32, -0.28]]); // crown
  mo([[-0.44, -0.5], [-0.42, -0.74], [-0.26, -0.98], [0.0, -1.1], [0.2, -1.0], [0.32, -0.74], [0.3, -0.54], [0.1, -0.6], [-0.14, -0.62], [-0.36, -0.56]], { fill: '#868a8e', light: '#c8ccce' }); // the comb: a tall crescent plate fore to aft
  f.line(hF([[-0.4, -0.62], [-0.26, -0.9], [0.0, -1.04], [0.2, -0.94], [0.3, -0.7]]), 1.6, '#d8dcde', { op: 0.6 }); f.line(hF([[-0.36, -0.58], [0.0, -0.62], [0.28, -0.58]]), 2, INK, { op: 0.6 }); // the comb's lit edge and its seam on the crown
  
  mo([[-0.72, -0.12], [-0.6, -0.26], [-0.3, -0.32], [0.0, -0.34], [0.32, -0.32], [0.62, -0.38], [0.74, -0.2], [0.5, -0.22], [0.2, -0.24], [-0.2, -0.22], [-0.5, -0.16]], { inkW: 1.6 }); // brim, peaked
  f.line(hF([[-0.6, -0.2], [-0.2, -0.28], [0.3, -0.3], [0.66, -0.3]]), 1.4, '#c8ccce', { op: 0.5 });
  f.flat(hF(ell([0.08, -0.5], 0.08, 0.05, 0.4, 10)), '#1e2024', { op: 0.5 }); f.line(hF([[0.0, -0.55], [0.14, -0.46]]), 1, '#c8ccce', { op: 0.6 }); // a dent
  for (let i = 0; i < 5; i++) f.rivet(hF([[-0.34 + i * 0.16, -0.36]])[0], 2.2, '#8e9294');
  f.flat(hF(ell([-0.3, -0.42], 0.06, 0.04, 0, 8)), P.rust, { op: 0.6 }); V.scorch(f, hF([[0.1, -0.84]])[0], 10, 8, 0.6); V.lichtenberg(f, hF([[0.06, -0.92]])[0], deg(110), 40, 1.4, { metal: true, depth: 2 });
  V.barnacle(f, hF([[-0.56, -0.2]])[0], 4); V.drip(f, hF([[0.72, -0.2]])[0], 1); V.drip(f, hF([[-0.7, -0.1]])[0], 1);
  f.line(hF([[-0.28, -0.3], [-0.24, 0.1], [-0.1, 0.42]]), 2.4, '#3a2c20'); // chin strap

  // ---- far forearm and stick, over the drum
  f.bone('stick_f'); stick(WF, tF, 150);
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.72)], [50, 44], { steps: 6 }), JK({ fill: jackD }));
  f.part(limb(lerp(EF, WF, 0.6), lerp(EF, WF, 0.78), 54, 54, { steps: 4 }), JK({ fill: mix(jackD, '#fff', 0.08), inkW: 1.3, cast: false }));
  f.part(V.tube([lerp(EF, WF, 0.72), lerp(EF, WF, 0.94)], [40, 36]), DRS({ cast: false }));
  f.bone('hand_f');
  B.grip(f, WF, EF, tF, 28, mix(skin, skinS, 0.15), { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, inline: true, bend: tF - ang(EF, WF), name: 'drummer far' });
  V.lichtenberg(f, add(WF, rot([-14, 0], ang(WF, EF) + Math.PI)), ang(WF, EF), 30, 1.4, { depth: 1 });

  // ---- near arm: padded sleeve, swollen wrist, the stick scorched into the fist
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.74)], [66, 56, 50], { steps: 8, bp: [[0, 0.4, 0.1]] }), JK());
    f.stroke([lp(SN, EN, 0.5, 18), lp(SN, EN, 0.72, 2), lp(SN, EN, 0.86, -20)], 2);
    V.barnacles(f, lp(SN, EN, 0.2, 10), 14, 10, 4, 3, 5);
  }, [['upperarm_n', side(EN, mul(de, -1), 30)], ['forearm_n', side(EN, de, 30)]]);
  f.bone('forearm_n');
  f.part(limb(lerp(EN, WN, 0.6), lerp(EN, WN, 0.78), 58, 58, { steps: 4 }), JK({ fill: mix(jack, '#fff', 0.08), inkW: 1.3, cast: false })); // turned cuff
  f.part(V.tube([lerp(EN, WN, 0.74), lerp(EN, WN, 0.94)], [44, 40]), DRS({ cast: false }));
  f.bone('stick_n'); stick(WN, tN, 150);
  f.bone('hand_n');
  B.grip(f, WN, EN, tN, 30, skin, { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, inline: true, bend: tN - ang(EN, WN), name: 'drummer near' });
  V.lichtenberg(f, lp(EN, WN, 0.8, 0), ang(WN, EN), 50, 1.8, { depth: 2 });
  V.peel(f, WN, 2); V.barnacle(f, add(WN, [-10, 10]), 3.6);
  return f;
}

// ------------------------------------------------------------------ CRAGSMAN (cast, human 1.0)
// He went over the cliff on a rope for the harpies' eggs. He hangs from a rope that comes down out of the frame top,
// body angled out and back, bare feet braced against the air as if against the cliff; the near hand high on the rope,
// the far hand reaching out with the fowling pole (a horsehair noose at its tip). The wet rope brought a strike down
// into him: the rope is fused into his hand and burned into his waist where the bowline sits over a padded sling;
// Lichtenberg trees branch from the waist across the belly and down the legs, the hair stands in a soaked crest.
// Wiry and long-armed, soaked pale, fingers swollen. Ripped wool jumper, canvas breeches, egg basket with cracked eggs,
// sack of feathers, knife, a harpy's grey feather in the knitted cap.
// Rig: rope (root, pivot at the anchor above the frame) > pelvis > standard humanoid; pole (parent hand_f), basket and
// sack (parent pelvis / torso). The near hand is fused to the rope: in game it follows the rope (IK) as he swings.
// Motion: idle a slow swing on the rope (rope), kicking off from nothing (legs); attack a swing across the ranks on the
// rope (rope swings wide) with the pole lashing (far arm, pole).
function cragsman() {
  const CW = 900, CH = TIERS.human[1], f = new Fig(V.base(629, CH)); V.textures(f);
  const H = 96, gy = f.o.groundY, s = '629';
  const skin = '#b0a896', skinS = '#4e4652', wool = P.wool, breech = '#5e5c54';
  const SKN = (o = {}) => V.SK(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const WL = (o = {}) => V.WO(f, o);
  const BR = (o = {}) => Object.assign({ fill: breech, shadow: '#1c1c1e', shade: 0.4, tex: 'weave' + s, texOp: 0.5 }, o);
  const anchor = [384, -40], waist = [298, 456], RH = [310, 392];
  const N = [206, 300], C = [236, 384], PV = [300, 486];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.05, 0.12), SF = S.at(0.42, 0.06);
  const EN = [226, 420], WN = RH; // the near hand holds the rope low, just above the bowline
  const EF = [370, 270], WF = [424, 330]; // the far arm reaches out over the rope, coming down onto the pole
  const HN = S.at(-0.1, 1.0), KN = [404, 486], AN = [502, 528];
  const HF = S.at(0.3, 0.96), KF = [420, 540], AF = [500, 600]; // legs thrust out, feet braced flat against the air
  const HC = [236, 222], hA = -0.18, hF = frame(HC, hA, H);
  f.joint('rope', anchor);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [212, 294], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joints.pelvis.parent = 'rope';
  const fa = ang(EF, WF), pA = fa - Math.PI / 2 + deg(14); // the pole runs through the far fist, square-ish to the forearm, tip up and forward
  const pTip = add(WF, rot([400, 0], pA)), pBut = add(WF, rot([-100, 0], pA));
  f.joint('pole', WF, 'hand_f').joint('basket', S.at(-0.5, 1.02), 'pelvis').joint('sack', S.at(-0.6, 0.2), 'torso');
  const footLook = SKN({ fill: mix(skin, '#e0d8c8', 0.08), tex: 'wrinkle' + s, texOp: 0.4 });

  // ---- the rope: from the anchor above the frame down to the fist, through it, and on to the bowline at the waist
  f.bone('rope');
  V.rope(f, [anchor, lerp(anchor, RH, 0.5), RH], 9, { col: '#7e7058' }); 
  V.rope(f, [RH, lerp(RH, waist, 0.5), waist], 9, { col: '#6e6048' });
  V.lichtenberg(f, lerp(anchor, RH, 0.7), ang(RH, anchor), 70, 1.4, { metal: true, depth: 1 }); // scorched where the strike ran down it
  V.scorch(f, lerp(RH, waist, 0.3), 8, 22, 0.5, 0.1); V.kelpHang(f, lerp(anchor, RH, 0.45), 40, 5, -3);

  // ---- the sack of feathers on his back, tied at the neck, quills and grey feathers poking out
  f.bone('sack');
  const sk0 = S.at(-0.66, 0.18), sackP = [add(sk0, [-20, -40]), add(sk0, [22, -46]), add(sk0, [34, 20]), add(sk0, [20, 92]), add(sk0, [-24, 104]), add(sk0, [-52, 50])];
  f.part(sackP, { fill: '#6a665a', shadow: '#24221e', shade: 0.42, tex: 'weave' + s, texOp: 0.55 });
  for (let i = 0; i < 6; i++) { const r0 = add(sk0, [-14 + i * 7, -42 - (i % 2) * 4]); V.feather(f, r0, deg(-100 - i * 12), 40 + (i % 3) * 10, 9, V.FE(f, { fill: i % 2 ? P.slateL : P.slate }), { lead: 0.4, round: true, splits: false }); }
  f.stroke([add(sk0, [-20, -30]), add(sk0, [20, -34])], 3, '#3a3024'); f.stroke([add(sk0, [-30, 30]), add(sk0, [-10, 70])], 2); f.stroke([add(sk0, [10, 10]), add(sk0, [12, 60])], 1.8);
  f.part([add(sk0, [-16, 40]), add(sk0, [8, 36]), add(sk0, [10, 60]), add(sk0, [-14, 64])], { fill: '#4e4a40', sharp: true, inkW: 1.1, tex: 'weave' + s }); f.stitches([add(sk0, [-16, 40]), add(sk0, [8, 36]), add(sk0, [10, 60]), add(sk0, [-14, 64]), add(sk0, [-16, 40])], P.bone, 0.8);

  // ---- far arm (upper arm behind the body)
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [46, 40], { steps: 6 }), WL({ fill: P.woolD }));
  // ---- the fowling pole: a long ash pole with a forked tip and a horsehair noose, its butt behind his body
  f.bone('pole');
  f.part(limb(pBut, pTip, 14, 9, { steps: 12 }), V.WD(f, { tex: 'wood' + s, texOp: 0.7 }));
  f.line([lp(pBut, pTip, 0.03, -3), lp(pBut, pTip, 0.97, -2)], 1.1, P.woodL, { op: 0.55, straight: true });
  for (const t of [0.3, 0.33, 0.62]) f.line([lp(pBut, pTip, t, -8), lp(pBut, pTip, t + 0.008, 8)], 3, '#4e4436', { straight: true }); // tarred whipping
  { const tf = frame(pTip, pA, 1); f.stroke(tf([[-30, 0], [-6, -4], [10, -14], [16, -16]]), 5, '#5a4a3a'); f.stroke(tf([[-30, 0], [-4, 4], [12, 12]]), 4, '#5a4a3a');
    const loop = tf([[10, -14], [24, -2], [30, 18], [22, 40], [8, 50], [-6, 40], [-6, 18], [4, 4], [12, 12]]); f.line(loop, 2.6, INK); f.line(loop, 1.4, '#c8c0aa'); // the noose
    for (let i = 0; i < 3; i++) f.line(tf([[-4 + i * 4, 36 + i * 3], [-10 + i * 4, 54 + i * 4]]), 0.9, '#c8c0aa', { op: 0.8 }); f.flat(tf(ell([-24, 0], 5, 6, 0, 8)), '#3a2c20'); }
  V.lichtenberg(f, lp(pBut, pTip, 0.2, 0), pA, 50, 1.2, { metal: true, depth: 1 });
  V.kelpHang(f, lp(pBut, pTip, 0.7, 4), 34, 4, 2); f.line([lp(pBut, pTip, 0.5, 6), add(lp(pBut, pTip, 0.5, 6), [2, 30]), add(lp(pBut, pTip, 0.5, 6), [-2, 50])], 1, '#c8c0aa', { op: 0.7 }); // a spare noose hair hanging

  // ---- legs: canvas breeches to the knee, wiry bare shins, calloused bare feet braced flat against nothing
  const legC = (Hp, Kn, A, sfx, wq, tone, fa2) => {
    const cu = lerp(Kn, A, 0.2), da = ankleCut(Kn, A);
    split(f, () => { f.part(K.chain([lerp(Kn, A, 0.1), lerp(Kn, A, 0.4), A], [wq * 0.62, wq * 0.58, 34], { steps: 6, bq: [[0, 0.5, 0.12]] }), SKN({ fill: mix(skin, skinS, tone) })); f.line([lp(Kn, A, 0.3, wq * 0.2), lp(Kn, A, 0.9, 6)], 1.2, mix(skin, '#fff', 0.35), { op: 0.5 }); }, [['shin' + sfx, side(A, mul(da, -1), 18)]]);
    split(f, () => V.looseFoot(f, A, fa2, 58, 46, footLook, { sole: 1 }), [['foot' + sfx, side(A, da, 18)]]);
    V.legTube(f, Hp, Kn, cu, [wq, wq * 0.8, wq * 0.76], BR({ fill: mix(breech, '#000', tone) }), sfx, { A, bp: [[0, 0.4, 0.12]], after: () => {
      const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], w = wq * 0.4;
      f.part([add(add(cu, mul(n, w + 4)), mul(d, -10)), add(add(cu, mul(n, -w - 4)), mul(d, -8)), [...add(add(cu, mul(n, -w - 2)), mul(d, 9)), 1], add(add(cu, mul(n, -w * 0.3)), mul(d, 2)), [...add(add(cu, mul(n, w * 0.2)), mul(d, 11)), 1], add(add(cu, mul(n, w + 3)), mul(d, 4))], BR({ fill: mix(breech, '#000', tone - 0.05), inkW: 1.2, cast: false }));
      f.stroke([lp(Hp, Kn, 0.7, -w), lp(Hp, Kn, 0.9, 0), lp(Hp, Kn, 0.8, w)], 1.8);
    } });
  };
  legC(HF, KF, AF, '_f', 62, 0.2, ang(KF, AF) - Math.PI / 2 - deg(6));
  f.bone('shin_f'); V.lichtenberg(f, lp(KF, AF, 0.15, 0), ang(KF, AF), 70, 1.8, { depth: 2 });

  // ---- torso: wiry, in a ripped wool jumper; the rope's bowline over a padded sling at the waist, burned in
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.34, 0.3], [0.08, 0.6, 0.5], [0.24, 0.66, 0.64], [0.44, 0.58, 0.6], [0.66, 0.5, 0.52], [0.86, 0.54, 0.54], [1.02, 0.6, 0.58], [1.1, 0.52, 0.5]]);
  f.part(torso, WL());
  f.part(S.shape([[0.1, -0.1, 0.5], [0.5, -0.06, 0.5], [0.86, -0.1, 0.46]]), WL({ fill: mix(P.wool, '#fff', 0.06), tex: 'cable' + s, texOp: 0.75, cast: false, inkW: 1, inkHeavy: 1.4 })); // cable panel down the chest
  f.part(S.shape([[0.9, 0.56, 0.56], [1.1, 0.52, 0.5]]), WL({ fill: mix(P.wool, '#2a2a2e', 0.18), tex: 'weave' + s, texOp: 0.6, inkW: 1.1, cast: false })); // ribbed welt
  f.flat(S.shape([[0.1, 0.6, -0.2], [0.5, 0.58, -0.1], [0.9, 0.54, -0.2]]), '#1a1a1e', { op: 0.22 }); // the shadow under the arm down his back
  f.stroke([S.at(-0.5, 0.2), S.at(-0.4, 0.4), S.at(-0.46, 0.66)], 2.2); f.stroke([S.at(0.2, 0.36), S.at(0.0, 0.5), S.at(-0.1, 0.7)], 2);
  // the jumper ripped open over the belly: pale skin, ribs, burns branching up from the waist
  const rip = [S.at(0.06, 0.62), S.at(0.26, 0.56), S.at(0.44, 0.6), S.at(0.52, 0.74), S.at(0.5, 0.9), S.at(0.1, 0.92), S.at(-0.04, 0.8)];
  f.part(rip.map((q, i) => i % 2 ? [...q, 1] : q), SKN({ inkW: 1.4, cast: false }));
  for (let i = 0; i < 3; i++) f.line([S.at(0.14, 0.64 + i * 0.06), S.at(0.3, 0.62 + i * 0.06), S.at(0.44, 0.65 + i * 0.06)], 1, INK, { op: 0.45 }); // ribs
  V.lichtenberg(f, S.at(0.3, 0.9), deg(-100), 70, 2, { depth: 2, fork: 0.7 });
  V.lichtenberg(f, S.at(0.0, 0.9), deg(-130), 50, 1.6, { depth: 2 });
  f.line(rip.concat([rip[0]]), 2.2, '#141210', { op: 0.6 });
  for (const q of [S.at(0.06, 0.62), S.at(0.5, 0.9), S.at(-0.04, 0.8)]) f.line([q, add(q, [4, 10]), add(q, [0, 16])], 1, P.woolL); // unravelled yarn
  f.stroke([S.at(-0.4, 0.3), S.at(-0.36, 0.6)], 2.2); f.stroke([S.at(0.3, 0.2), S.at(0.4, 0.42)], 2); V.saltCrust(f, S.at(-0.3, 0.5), 20, 30, 10);
  const dn = S.at(-0.3, 0.4); f.part(ell(dn, 13, 10, 0.4, 10), WL({ fill: '#5a5a52', inkW: 1, cast: false })); for (let i = 0; i < 3; i++) f.line([add(dn, [-10, -5 + i * 4]), add(dn, [10, -3 + i * 4])], 0.8, P.bone, { op: 0.6 }); // a darn
  // the padded sling round the hips and the rope's bowline over it, burned into the waist
  const sl = [S.at(-0.66, 0.9), S.at(0.0, 0.96), S.at(0.62, 0.92)];
  f.part([...sl.map(q => add(q, [0, -14])), ...sl.slice().reverse().map(q => add(q, [0, 14]))], { fill: '#6a6458', shadow: '#22201c', shade: 0.42, tex: 'quilt' + s, texOp: 0.6, inkW: 1.4 });
  const rl = [S.at(-0.66, 0.92), S.at(-0.2, 0.97), S.at(0.3, 0.97), S.at(0.62, 0.9)]; V.rope(f, rl, 8, { col: '#6e6048' });
  const kn = S.at(0.08, 0.98); f.part(lumpE(f, kn, 14, 12, 0, 0.2), { fill: '#6e6048', tex: 'weave' + s, inkW: 1.3, cast: false }); V.rope(f, [kn, add(kn, [10, 20]), add(kn, [6, 36])], 6, { col: '#6e6048', fray: true });
  V.weld(f, add(kn, [-24, 6]), Math.PI / 2, 14, { burns: [[deg(110), 70, 2], [deg(70), 50, 1.6]] }); V.scorch(f, kn, 30, 14, 0.4);
  // the egg basket at the near hip: a small wicker creel, eggs cracked, yolk run down its side
  f.bone('basket');
  const bk = S.at(-0.62, 1.12); const bkP = [add(bk, [-28, -16]), add(bk, [30, -20]), add(bk, [26, 30]), add(bk, [-22, 34])];
  for (const [x, y] of [[-14, -22], [2, -26], [16, -22]]) { const e = add(bk, [x, y]); f.part(ell(e, 9, 12, -0.2, 12), { fill: '#d8d2c0', shadow: '#7a7468', shade: 0.4, inkW: 1.1, cast: false }); f.line([add(e, [-4, -6]), add(e, [0, -1]), add(e, [-2, 4]), add(e, [3, 8])], 0.9, INK, { op: 0.8 }); }
  f.part(bkP, { fill: '#6e5e44', shadow: '#2a2218', shade: 0.42, tex: 'weave' + s, texOp: 0.8, k: 0.8 });
  for (let i = 0; i < 5; i++) f.line([lerp(bkP[0], bkP[3], i / 5 + 0.1), lerp(bkP[1], bkP[2], i / 5 + 0.1)], 1, INK, { op: 0.5 });
  f.stroke([add(bk, [6, -18]), add(bk, [8, 10]), add(bk, [4, 40])], 3, P.lamp, { op: 0.75 }); // a cracked egg's yolk running down
  f.line([add(bk, [-28, -16]), add(bk, [-30, -60]), S.at(-0.6, 0.94)], 2, '#3a2c20'); // its cord to the sling
  // ---- the knife in its sheath at the back of the sling
  f.bone('pelvis');
  const kf = S.at(-0.2, 1.0); f.part([add(kf, [-6, 0]), add(kf, [6, 0]), add(kf, [2, 50]), [...add(kf, [0, 58]), 1], add(kf, [-4, 50])], { fill: '#3a2c20', shade: 0.4, inkW: 1.1, cast: false }); f.part(limb(add(kf, [0, -26]), add(kf, [0, 2]), 9, 8, { steps: 3 }), V.WD(f, { fill: '#2e241c', inkW: 1, cast: false }));

  // ---- near leg
  legC(HN, KN, AN, '_n', 66, 0.0, ang(KN, AN) - Math.PI / 2 - deg(4));
  f.bone('thigh_n'); V.lichtenberg(f, lp(HN, KN, 0.1, 8), ang(HN, KN) + 0.2, 90, 2, { depth: 2, col: '#3a2a2c', lite: '#9a8a80' });
  f.bone('shin_n'); V.lichtenberg(f, lp(KN, AN, 0.2, 0), ang(KN, AN), 60, 1.8, { depth: 2 }); f.scratches(lerp(KN, AN, 0.5), 10, 3, P.bone, 0.8);

  // ---- head: narrow face, teeth bared at the drop and the strike; a knitted cap pushed back with a harpy's feather;
  // the soaked hair standing in a crest from the brow
  f.bone('head');
  f.part(K.chain([S.at(0.12, 0.04), add(HC, [-10, 36])], [52, 46], { steps: 4 }), SKN());
  f.line([S.at(0.2, 0.02), add(HC, [6, 36])], 1.2, INK, { op: 0.5 }); // the neck's cord
  f.part(S.shape([[-0.06, 0.38, 0.32], [0.04, 0.5, 0.44], [0.1, 0.36, 0.2]]), WL({ fill: P.woolD, inkW: 1.3 })); // rolled neck
  B.head(f, HC, H, hA, { skin, jaw: 0.94, chin: 0.03, nose: 1.1, hook: 0.4, mouth: 'snarl', squint: 0.45, browDown: 0.06, age: true, gaunt: true, beard: 'stubble', beardCol: '#3a362e', hairCol: '#3a362e', faceShade: 0.85, jawShade: 0.5 });
  // (independent review) the crest grows from the scalp: soaked hair plastered on the skull in front of the cap, and
  // from it the stiff crest stands, rooted in it (it first floated a gap above a bald dome)
  f.part(hF([[-0.2, -0.36], [-0.12, -0.5], [0.04, -0.54], [0.18, -0.48], [0.28, -0.36], [0.2, -0.32], [0.06, -0.38], [-0.08, -0.34]]), { fill: '#3a362e', shadow: '#121010', light: '#6a645a', shade: 0.42, tex: 'hatch' + s, texOp: 0.35, inkW: 1.3, cast: false });
  V.standingHair(f, [[-0.12, -0.44], [-0.02, -0.48], [0.06, -0.48], [0.14, -0.44], [0.2, -0.38]].map(q => hF([q])[0]), 44, { col: '#3a362e', w: 4, fan: 0.8, lean: 0.25 });
  for (const [u, v] of [[0.0, -0.44], [0.12, -0.42]]) V.drip(f, hF([[u, v]])[0], 1.2);
  for (let i = 0; i < 4; i++) f.flat(hF([[0.19 + i * 0.03, 0.28], [0.215 + i * 0.03, 0.28], [0.21 + i * 0.03, 0.305], [0.195 + i * 0.03, 0.305]]), '#d8d0b8'); // bared teeth
  f.line(hF([[0.04, 0.12], [0.1, 0.26]]), 1.2, INK, { op: 0.6 });
  // the cap pushed back on the skull, the brim rolled; the harpy's long grey feather stuck through it
  const cap = hF([[-0.5, 0.0], [-0.52, -0.26], [-0.4, -0.46], [-0.18, -0.5], [-0.06, -0.4], [-0.1, -0.2], [-0.24, -0.06], [-0.36, 0.04]]);
  f.part(cap, WL({ fill: '#4a4e52', tex: 'weave' + s, texOp: 0.7 }));
  f.part(hF([[-0.54, -0.02], [-0.5, -0.2], [-0.1, -0.4], [-0.04, -0.3], [-0.38, -0.06]]), WL({ fill: '#3e4246', tex: 'weave' + s, texOp: 0.75, inkW: 1.4 }));
  for (let i = 0; i < 5; i++) f.line(hF([[-0.44 + i * 0.07, -0.08 - i * 0.06], [-0.34 + i * 0.05, -0.38 - i * 0.02]]), 1, INK, { op: 0.4 });
  V.feather(f, hF([[-0.36, -0.3]])[0], deg(-150), 92, 16, V.FE(f, { fill: P.slateL }), { lead: 0.35, round: true, bend: 0.1, notch: [0.6] });
  V.drip(f, hF([[0.3, 0.5]])[0], 0.9); V.saltCrust(f, hF([[-0.3, 0.2]])[0], 10, 10, 3);

  // ---- far forearm and fist on the pole, coming down onto it from above
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.6)], [40, 36], { steps: 6 }), WL({ fill: P.woolD }));
  f.part(K.ragLimb(f, EF, lerp(EF, WF, 0.6), 42, 38, { depth: 7, teeth: 5 }), WL({ fill: P.woolD, cast: false }));
  f.part(K.chain([lerp(EF, WF, 0.5), lerp(EF, WF, 0.8), WF], [34, 32, 30], { steps: 6 }), SKN());
  f.line([lp(EF, WF, 0.55, 6), lp(EF, WF, 0.9, 4)], 1, INK, { op: 0.45 }); // tendon
  f.bone('hand_f');
  B.grip(f, WF, EF, pA, 27, mix(skin, skinS, 0.1), { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'cragsman pole' });

  // ---- near arm, stretched up to the rope: long, wiry, the sleeve ripped back; the hand fused to the rope
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.4)], [50, 42, 40], { steps: 8, bp: [[0, 0.4, 0.1]] }), WL());
    f.stroke([lp(SN, EN, 0.4, 12), lp(SN, EN, 0.6, 0), lp(SN, EN, 0.8, -12)], 1.8);
  }, [['upperarm_n', side(EN, mul(de, -1), 22)], ['forearm_n', side(EN, de, 22)]]);
  f.bone('forearm_n');
  f.part(K.ragLimb(f, lerp(EN, WN, 0.05), lerp(EN, WN, 0.4), 44, 40, { depth: 8, teeth: 5 }), WL({ cast: false }));
  f.part(K.chain([lerp(EN, WN, 0.32), lerp(EN, WN, 0.7), WN], [36, 34, 30], { steps: 6, bq: [[0, 0.4, 0.1]] }), SKN());
  f.line([lp(EN, WN, 0.4, -6), lp(EN, WN, 0.95, -5)], 1.1, INK, { op: 0.5 }); f.line([lp(EN, WN, 0.4, 7), lp(EN, WN, 0.9, 6)], 1.3, mix(skin, '#fff', 0.35), { op: 0.5 });
  V.lichtenberg(f, lp(EN, WN, 0.92, 0), ang(WN, EN), 80, 2, { depth: 2 });
  f.bone('hand_n');
  B.grip(f, RH, EN, ang(waist, anchor), 27, mix(skin, '#e0d8c8', 0.1), { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, maxBend: 35, name: 'cragsman rope' });
  V.weld(f, add(RH, rot([16, 0], ang(waist, anchor))), ang(waist, anchor), 12, { burns: [], haloOp: 0.5 }); V.weld(f, add(RH, rot([-18, 0], ang(waist, anchor))), ang(waist, anchor), 12, { burns: [], haloOp: 0.5 });
  return f;
}

// ------------------------------------------------------------------ SHIP-BREAKER (cast, large 1.5)
// He broke every wreck down to timber and nails. A huge slab-muscled man walking heavy on the front foot, a ship's oak
// knee (the curved timber brace, its iron bolts still through it) carried over his near (in-game right) shoulder like a
// club, an iron crowbar hanging in the far (left) hand. Struck while prying copper sheathing off a hull: strips of
// copper and iron bolts are fused into his forearms and shoulder, blackened, with Lichtenberg ferns spreading across the
// chest from the welds; the beard singed stiff. Water bloated the belly and hands; barnacles in the crooks of the
// elbows. A waxed-canvas smock, a leather apron with pockets full of nails, a rope coil over the far shoulder, a sack of
// torn copper sheathing on the back with a bow saw tied across it, a belt of salvage hooks, sea boots, a wool cap.
// Rig: standard humanoid + knee (parent hand_n) + crowbar (parent hand_f) + sack (parent torso) + apron (parent pelvis).
// Motion: idle shaking water out of the beard (head); attack an overhead blow with the oak knee (near arm up and over).
function shipBreaker() {
  const CW = TIERS.large[0], CH = TIERS.large[1], f = new Fig(V.base(625, CH)); V.textures(f);
  const H = 150, gy = f.o.groundY, s = '625';
  const skin = '#aea292', skinS = '#4a4250', smock = '#6e6a5c', smockD = '#4a463c', smockL = '#8e8a7a', leather = '#4a3a2c', copper = '#7a5a40', copperD = '#3a2618';
  const SKN = (o = {}) => V.SK(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const SM = (o = {}) => Object.assign({ fill: smock, shadow: '#22201c', light: smockL, shade: 0.4, tex: 'weave' + s, texOp: 0.5 }, o);
  const CU = (o = {}) => Object.assign({ fill: copper, shadow: copperD, light: '#a47a58', shade: 0.4, tex: 'pit' + s, texOp: 0.6, inkW: 1.3, inkHeavy: 1.8, cast: false }, o);
  const N = [450, 320], C = [478, 480], PV = [446, 650];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.34, 0.12), SF = S.at(0.52, 0.06);
  const EN = [414, 492], WN = [494, 414];
  const EF = [586, 470], WF = [600, 616];
  const HN = S.at(-0.2, 0.98), KN = [380, 850], AN = [300, 1004];
  const HF = S.at(0.36, 0.98), KF = [560, 840], AF = [592, 1010];
  const HC = [494, 224], hA = 0.06, hF = frame(HC, hA, H);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [456, 314], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the knee: the handle arm runs through the fist and back over the shoulder to the bend; the other arm hangs behind
  const bend = add(WN, rot([236, 0], deg(-135))), butt = add(WN, rot([56, 0], deg(45))), hA2 = ang(WN, bend), drop = add(bend, rot([200, 0], deg(132)));
  const cA = deg(28); // the crowbar hangs from the far fist, the claw forward and down
  f.joint('knee', WN, 'hand_n').joint('crowbar', WF, 'hand_f').joint('sack', S.at(-0.7, 0.2), 'torso').joint('apron', S.at(0.4, 0.86), 'pelvis');

  // ---- the oak knee's back arm hangs behind the body: drawn first, the bend and the handle come over the shoulder later
  // one curved timber: a spline through the handle and the drop, thick at the bend (the throat fills the inside of the
  // corner) and tapering to both ends; a darker copy offset behind it is its thickness
  const KC = V.spline([butt, lerp(butt, bend, 0.5), lerp(butt, bend, 0.88), add(bend, mul(add(E.norm(sub(bend, butt)), E.norm(sub(drop, bend))), 14)), lerp(bend, drop, 0.14), lerp(bend, drop, 0.55), drop], 5);
  const KS = V.arcLen(KC), KL = KS[KS.length - 1], tB = 292 / 492;
  const kw = t => 62 + 46 * Math.exp(-(((t - tB) / 0.16) ** 2)) - 10 * t;
  const KO = { pts: V.ribbon(KC, kw), d1: E.norm(sub(bend, butt)), n1: [-E.norm(sub(bend, butt))[1], E.norm(sub(bend, butt))[0]], w: 84 };
  const oakL = V.WD(f, { fill: '#5a4636', light: '#8a7458', shadow: '#22180f', tex: 'wood' + s, texOp: 0.85 });
  const drawKnee = () => {
    f.part(KO.pts.map(q => add(q, [-9, 9])), V.WD(f, { fill: '#33281e', inkW: 1.6, cast: false })); // the timber's thickness, seen past its near face
    f.part(KO.pts, oakL);
    // grain running round the bend, a shake (split) along the grain, end grain at both ends
    for (const k of [-0.32, -0.12, 0.1, 0.3]) f.line(KC.filter((_, i) => i % 3 === 0).map((q, i, A) => { const j = Math.min(KC.length - 1, i * 3), at = V.at(KC, KS, KS[j]); return add(q, mul(at.n, kw(KS[j] / KL) * k)); }), 1.1, INK, { op: 0.4 });
    const sp = V.at(KC, KS, KL * 0.3); f.flat(lumpE(f, add(sp.p, mul(sp.n, 6)), 36, 4, Math.atan2(sp.d[1], sp.d[0]), 0.3), '#120c08', { op: 0.75 });
    for (const [u, sg] of [[0, -1], [KL, 1]]) { const at = V.at(KC, KS, u), w = kw(u / KL) / 2; f.part([add(at.p, mul(at.n, w)), add(add(at.p, mul(at.n, w)), mul(at.d, sg * 8)), add(add(at.p, mul(at.n, -w)), mul(at.d, sg * 8)), add(at.p, mul(at.n, -w))], V.WD(f, { fill: '#6e5a44', inkW: 1.3, cast: false, tex: 'mottle' + s })); for (let i = 1; i < 4; i++) f.line(ell(at.p, w * 0.25 * i, 3, Math.atan2(at.n[1], at.n[0]), 12).slice(0, 7), 0.9, INK, { op: 0.5 }); }
    // iron bolts through it, rust weeping down, a worn-bright outer bend, barnacles and weed at the drop end
    for (const t of [0.22, 0.42, tB, 0.76, 0.9]) { const q = V.at(KC, KS, KL * t).p; f.part(ell(q, 10, 10, 0, 10), V.IR(f, { inkW: 1.2, cast: false })); f.flat(ell(add(q, [1, 1]), 3.6, 3.6, 0, 8), P.ironD); f.flat([add(q, [-2, 8]), add(q, [4, 34]), add(q, [-3, 30])], P.rust, { op: 0.6 }); }
    const ob = V.at(KC, KS, KL * tB); f.line([add(ob.p, add(mul(ob.n, -kw(tB) * 0.48), mul(ob.d, -40))), add(ob.p, mul(ob.n, -kw(tB) * 0.5)), add(ob.p, add(mul(ob.n, -kw(tB) * 0.48), mul(ob.d, 40)))], 2.4, '#a89070', { op: 0.55 });
    V.barnacles(f, V.at(KC, KS, KL * 0.92).p, 22, 14, 6, 3, 7); V.kelpHang(f, V.at(KC, KS, KL * 0.97).p, 60, 6, -4);
    f.spatter(V.at(KC, KS, KL * 0.06).p, 18, 10, '#4a1210');
  };

  // ---- the sack of torn copper sheathing on the back, a bow saw lashed across it
  f.bone('sack');
  const sk0 = S.at(-0.9, 0.24), sackP = [add(sk0, [-30, -70]), add(sk0, [40, -78]), add(sk0, [56, 40]), add(sk0, [40, 170]), add(sk0, [-40, 190]), add(sk0, [-78, 90])];
  for (const [x, y, a2] of [[-10, -84, -0.3], [18, -90, 0.2], [-34, -70, -0.7]]) { const q = add(sk0, [x, y]); f.part([add(q, rot([-14, 20], a2)), add(q, rot([16, 22], a2)), add(q, rot([20, -30], a2)), add(q, rot([4, -40], a2)), add(q, rot([-12, -26], a2))], CU({ fill: mix(copper, '#000', f.r() * 0.2) })); f.line([add(q, rot([-8, 10], a2)), add(q, rot([10, -26], a2))], 1, '#b08a64', { op: 0.6 }); V.verdigris(f, q, 8, 10, 3); } // sheathing sticking out of the mouth
  f.part(sackP, { fill: '#5e5a4e', shadow: '#1e1c18', shade: 0.42, tex: 'weave' + s, texOp: 0.6 });
  f.stroke([add(sk0, [-24, -60]), add(sk0, [34, -66])], 4, '#3a3024'); for (const [a2, b2] of [[[-50, 0], [-30, 120]], [[10, -20], [20, 130]], [[-20, 60], [10, 160]]]) f.stroke([add(sk0, a2), add(sk0, lerp(a2, b2, 0.5)), add(sk0, b2)], 2.2);
  for (const q of [add(sk0, [20, 40]), add(sk0, [-30, 110])]) { f.flat(ell(q, 10, 6, 0.5, 8), '#2a2620', { op: 0.6 }); f.line([add(q, [-10, -2]), add(q, [-4, 3]), add(q, [6, -2])], 1.4, '#a47a58'); } // copper edges cutting through the sacking
  // the bow saw: a wooden frame with a toothed blade and a twisted cord, lashed across the sack
  const s0 = add(sk0, [-70, 150]), s1 = add(sk0, [60, -10]);
  f.part(limb(s0, s1, 9, 9, { steps: 6 }), V.WD(f, { inkW: 1.2, cast: false }));
  const dS = E.norm(sub(s1, s0)), nS = [-dS[1], dS[0]];
  for (const e of [s0, s1]) f.part(limb(e, add(e, mul(nS, -54)), 10, 9, { steps: 4 }), V.WD(f, { inkW: 1.2, cast: false }));
  f.line([add(s0, mul(nS, -50)), add(s1, mul(nS, -50))], 3, P.ironL, { straight: true }); for (let i = 0; i < 16; i++) { const q = add(lerp(s0, s1, (i + 0.5) / 16), mul(nS, -50)); f.line([q, add(add(q, mul(nS, -5)), mul(dS, 3))], 1, P.ironD); }
  f.line([add(lerp(s0, s1, 0.5), mul(nS, -8)), add(lerp(s0, s1, 0.5), mul(nS, -46))], 2.6, '#8a7a5a'); f.line([add(s0, mul(nS, -8)), add(s1, mul(nS, -8))], 1.8, '#8a7a5a'); // twisted cord, the toggle
  V.rope(f, [add(sk0, [-70, 40]), add(sk0, [40, 60])], 5, { col: '#6e6048' }); V.rope(f, [add(sk0, [-60, 120]), add(sk0, [50, 110])], 5, { col: '#6e6048' });

  // ---- the oak knee's hanging arm (behind the body)
  f.bone('knee'); drawKnee();

  // ---- far arm: the upper arm behind the body
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [116, 100], { steps: 6 }), SM({ fill: smockD }));

  // ---- legs: heavy, in canvas trousers into sea boots; the near (back) leg trailing, the heel lifted
  const legB = (Hp, Kn, A, sfx, wq, tone, heel) => {
    V.legTube(f, Hp, Kn, lerp(Kn, A, 0.3), [wq, wq * 0.78, wq * 0.66], { fill: mix('#4a4842', '#000', tone), shadow: '#1a1a1c', shade: 0.4, tex: 'weave' + s, texOp: 0.45 }, sfx, { A, bq: [[0, 0.4, 0.12]] });
    const da = ankleCut(Kn, A);
    split(f, () => {
      if (heel) { f.raw(`<g transform="rotate(${heel} ${A[0] + 74} ${gy})">`); }
      B.boot(f, A, 1, 92, mix('#262826', '#000', tone), { knee: lp(Kn, A, 0.16), kneeW: wq * 0.72, tex: 'mottle' + s });
      if (heel) f.raw('</g>');
      const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], w = wq * 0.36, top = lp(Kn, A, 0.16);
      for (const t of [-0.06, 0.04]) f.stroke([lp(Kn, A, 0.16 + t, -w), lp(Kn, A, 0.19 + t, 0), lp(Kn, A, 0.15 + t, w)], 2); // the trousers bunched into the boot mouth
      for (const t of [0.55, 0.7, 0.84]) f.line([lp(Kn, A, t, -w * 0.8), lp(Kn, A, t + 0.03, 0), lp(Kn, A, t, w * 0.6)], 1.4, INK, { op: 0.45 });
      f.line([lp(Kn, A, 0.3, w * 0.45), lp(Kn, A, 0.86, w * 0.4)], 2.4, P.slateP, { op: 0.35 }); f.scratches(lp(Kn, A, 0.6, 0), 18, 4, P.slateP, 0.9);
    }, [['shin' + sfx, side(A, mul(da, -1), 34)], ['foot' + sfx, side(A, da, 34)]]);
  };
  legB(HN, KN, AN, '_n', 140, 0.12, 22);
  f.bone('foot_n'); V.barnacles(f, add(AN, [70, 50]), 20, 8, 4, 4, 7);
  legB(HF, KF, AF, '_f', 136, 0.0, 0);
  f.bone('foot_f'); V.barnacles(f, add(AF, [70, 50]), 24, 8, 5, 4, 8);
  f.bone('root'); f.flat(ell([AF[0] + 60, gy + 2], 120, 8, 0, 14), '#3a4448', { op: 0.5 }); f.flat(ell([AN[0] + 90, gy + 2], 70, 6, 0, 12), '#3a4448', { op: 0.4 });
  f.bone('shin_f'); V.kelpHang(f, lp(KF, AF, 0.3, -40), 70, 7, 6);

  // ---- torso: a slab of a man, the smock open at the chest; the belly bloated; ferns across the chest from the welds
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.5, 0.46], [0.08, 0.94, 0.76], [0.22, 1.06, 0.94], [0.42, 1.0, 1.0], [0.62, 0.88, 1.12], [0.8, 0.84, 1.22], [0.96, 0.82, 1.12], [1.08, 0.8, 0.88]]);
  f.part(torso, SM());
  const chest = S.shape([[0.04, -0.06, 0.6], [0.18, -0.16, 0.8], [0.34, -0.24, 0.86], [0.48, -0.36, 0.84]]);
  f.part(chest, SKN({ inkW: 1.4, cast: false }));
  for (let i = 0; i < 10; i++) { const q = add(S.at(0.2 + f.r() * 0.5, 0.12 + f.r() * 0.3), [0, 0]); f.line([q, add(q, [2, 5]), add(q, [5, 7])], 1, '#3a3028', { op: 0.6 }); } // chest hair
  f.stroke([S.at(0.3, 0.32), S.at(0.6, 0.34), S.at(0.8, 0.28)], 2.4, mix(skinS, '#000', 0.2)); // the pectoral's lower edge
  V.lichtenberg(f, S.at(-0.04, 0.14), deg(-10), 110, 2.4, { depth: 3, fork: 0.75 });
  V.lichtenberg(f, S.at(0.74, 0.1), deg(140), 70, 2, { depth: 2 });
  f.line([S.at(-0.08, 0.02), S.at(-0.16, 0.24), S.at(-0.34, 0.5)], 2.4, INK); f.line([S.at(0.6, 0.0), S.at(0.82, 0.2), S.at(0.86, 0.5)], 2.4, INK); // the smock's open neck edges
  f.part(S.shape([[-0.06, 0.5, 0.42], [0.04, 0.6, 0.56], [0.1, 0.44, 0.2]]), SM({ fill: smockD, inkW: 1.4 })); // rolled collar
  f.stroke([S.at(-0.6, 0.3), S.at(-0.5, 0.6), S.at(-0.6, 0.86)], 2.6); f.stroke([S.at(0.6, 0.6), S.at(0.9, 0.7)], 2.2); f.stroke([S.at(-0.2, 0.62), S.at(0.1, 0.72)], 2);
  V.wetSheen(f, [S.at(-0.7, 0.2), S.at(-0.72, 0.36), S.at(-0.74, 0.52), S.at(-0.74, 0.68)], 2.4, 0.4); V.saltCrust(f, S.at(-0.4, 0.5), 30, 40, 14);
  // the copper strips fused into the near shoulder, bolts through them, blackened at the welds
  const shA = S.at(-0.36, 0.06);
  f.part([add(shA, [-40, -16]), add(shA, [30, -30]), add(shA, [50, 6]), add(shA, [-24, 30])], CU());
  f.part([add(shA, [-30, 18]), add(shA, [36, 4]), add(shA, [40, 30]), add(shA, [-18, 44])], CU({ fill: mix(copper, '#000', 0.2) }));
  for (const q of [add(shA, [-16, -8]), add(shA, [20, -12]), add(shA, [8, 30])]) { f.part(ell(q, 7, 7, 0, 10), V.IR(f, { inkW: 1.1, cast: false })); f.flat(ell(q, 2.6, 2.6, 0, 6), P.ironD); }
  V.weld(f, add(shA, [48, 0]), deg(10), 22, { burns: [[deg(30), 80, 2.2]] }); V.scorch(f, shA, 34, 20, 0.45); V.verdigris(f, shA, 30, 20, 5);
  // the rope coil over the far shoulder, across the chest
  V.rope(f, [S.at(0.74, -0.02), S.at(0.6, 0.3), S.at(0.3, 0.6), S.at(-0.2, 0.86)], 12, { col: '#7a6c52' }); V.rope(f, [S.at(0.82, 0.02), S.at(0.7, 0.34), S.at(0.4, 0.66), S.at(-0.1, 0.9)], 11, { col: '#6e6048' });
  // belt of salvage hooks
  f.bone('pelvis');
  const bl = [S.at(-0.74, 0.92), S.at(0.0, 0.96), S.at(0.9, 0.92)];
  f.part([...bl.map(q => add(q, [0, -11])), ...bl.slice().reverse().map(q => add(q, [0, 11]))], { fill: '#2a2018', shadow: '#0e0a08', shade: 0.4, inkW: 1.4, tex: 'mottle' + s });
  for (const [u, l, a2] of [[-0.6, 60, 0.1], [-0.36, 74, -0.05], [-0.12, 54, 0.12]]) { const q = S.at(u, 0.96), hk = [q, add(q, rot([0, l * 0.7], a2)), add(q, rot([10, l], a2)), add(q, rot([28, l * 0.86], a2)), add(q, rot([30, l * 0.66], a2))]; f.stroke(hk, 9, INK); f.stroke(hk, 6, P.iron); f.line(hk.slice(0, 3), 1.2, P.ironL, { op: 0.6 }); f.flat(ell(hk[2], 4, 3, 0, 6), P.rust, { op: 0.6 }); }
  // ---- the leather apron over the smock, chest to knee, pockets full of salvaged nails
  f.bone('apron');
  const ap = [S.at(0.2, 0.5), S.at(0.96, 0.6), S.at(1.1, 0.86), add(S.at(1.1, 1.0), [10, 70]), [584, 840], [560, 862, 1], [520, 850], [486, 866, 1], [450, 852], [420, 862, 1], [410, 780], S.at(0.1, 1.0)];
  f.part(ap, { fill: leather, shadow: '#160e0a', light: '#6a5444', shade: 0.42, tex: 'mottle' + s, texOp: 0.6 });
  f.stroke([[470, 700], [466, 790], [470, 850]], 2.4, '#1a120c'); f.stroke([[540, 690], [548, 790], [550, 850]], 2.2, '#1a120c');
  for (const [x, y] of [[458, 740], [526, 730]]) { f.part([[x - 30, y - 6], [x + 32, y - 10], [x + 34, y + 44], [x - 28, y + 48]], { fill: mix(leather, '#000', 0.2), shadow: '#120a06', shade: 0.4, tex: 'mottle' + s, inkW: 1.4, sharp: true }); f.stitches([[x - 26, y + 42], [x - 28, y - 2], [x + 30, y - 6], [x + 30, y + 40]], '#a08060', 0.9); for (let i = 0; i < 5; i++) { const q = [x - 20 + i * 11, y - 8 - (i % 2) * 6]; f.line([add(q, [0, 14]), q, add(q, [-3 + i, -10])], 3.4, INK); f.line([add(q, [0, 14]), q, add(q, [-3 + i, -10])], 2, i % 2 ? P.ironL : '#6a4a30'); f.line([add(q, [-5, -10 + 0]), add(q, [2 + i, -10])], 2.6, INK); } } // nail heads poking out
  for (const [x, y, r] of [[500, 800, 6], [440, 820, 5], [560, 780, 4], [470, 660, 5], [540, 640, 4]]) { f.flat(ell([x, y], r, r * 0.7, 0.4, 10), '#0c0806', { op: 0.7 }); f.line(ell([x, y], r + 2, r * 0.7 + 2, 0.4, 10), 1, '#8a6a4a', { op: 0.45 }); } // burn pocks
  f.flat(lumpE(f, [520, 700], 40, 26, 0.3, 0.4), '#1a120c', { op: 0.35 }); f.flat(lumpE(f, [450, 820], 30, 20, 0, 0.4), '#2a1c10', { op: 0.3 }); // old tar and water stains
  V.wetSheen(f, [[556, 640], [560, 690], [566, 740], [570, 800], [574, 840]], 2.6, 0.4); f.line([[430, 650], [440, 700], [436, 760]], 1.4, '#7a6250', { op: 0.5 }); V.scorch(f, [500, 620], 26, 14, 0.4);
  f.part([[418, 790], [446, 786], [448, 812], [420, 816]], { fill: mix(leather, '#000', 0.3), shade: 0.4, sharp: true, inkW: 1.1, cast: false }); f.stitches([[418, 790], [446, 786], [448, 812], [420, 816], [418, 790]], '#a08060', 0.8); // a patch
  V.saltCrust(f, [500, 820], 60, 30, 12); for (const x of [440, 500, 560]) V.drip(f, [x, 866], 1.3);
  f.line([S.at(0.2, 0.5), S.at(0.5, 0.2), S.at(0.7, 0.0)], 3, '#2a1c12'); // neck strap

  // ---- head: a big head under a wool cap, broken nose, small eyes, the beard singed stiff and standing
  f.bone('head');
  f.part(K.chain([S.at(0.12, 0.02), add(HC, [-14, 60])], [118, 104], { steps: 4 }), SKN());
  B.head(f, HC, H, hA, { skin, jaw: 1.22, chin: 0.03, nose: 1.12, hook: -0.3, mouth: 'grim', squint: 0.62, browDown: 0.07, age: true, beard: 'full', beardCol: '#4a4038', hairCol: '#4a4038', faceShade: 0.85, jawShade: 0.55, browW: 0.055, scar: [[0.3, -0.03], [0.34, 0.05], [0.38, 0.1]] });
  f.flat(hF([[0.33, -0.02], [0.37, 0.03], [0.34, 0.07], [0.3, 0.03]]), '#4a2a2a', { op: 0.5 }); // the nose's broken bridge, a kink
  f.line(hF([[0.32, -0.06], [0.36, 0.0], [0.33, 0.06], [0.37, 0.1]]), 1.6, INK, { op: 0.75 });
  f.flat(hF(ell([0.18, 0.08], 0.09, 0.06, 0, 10)), '#7a5a52', { op: 0.22 }); V.saltCrust(f, hF([[0.12, 0.44]])[0], 18, 10, 5);
  // the singed beard: stiff wiry strands standing out off the jaw, the ends curled and scorched
  V.standingHair(f, [0.0, 0.06, 0.12, 0.18, 0.24, 0.3].map(t => hF([[t - 0.1, 0.52 + t * 0.3]])[0]), 26, { col: '#4a4038', w: 2.4, fan: 1.0, lean: 1.1 });
  for (let i = 0; i < 6; i++) { const q = hF([[-0.08 + i * 0.07, 0.62 + i * 0.03]])[0]; f.flat(ell(add(q, [4, 12]), 2.4, 2, 0, 6), '#141210', { op: 0.8 }); }
  V.drip(f, hF([[0.12, 0.74]])[0], 1.4); V.drip(f, hF([[0.26, 0.7]])[0], 1.2);
  const capP = hF([[-0.48, -0.06], [-0.5, -0.34], [-0.36, -0.58], [-0.08, -0.68], [0.18, -0.62], [0.33, -0.46], [0.36, -0.3], [0.2, -0.27], [-0.1, -0.22], [-0.32, -0.08]]);
  f.part(capP, V.WO(f, { fill: '#3e4448', tex: 'weave' + s, texOp: 0.7 }));
  for (let i = 0; i < 7; i++) f.line(hF([[-0.4 + i * 0.11, -0.3 + Math.abs(i - 3) * 0.01], [-0.32 + i * 0.08, -0.6 + Math.abs(i - 3) * 0.02]]), 1.2, INK, { op: 0.45 });
  f.part(hF([[-0.5, -0.1], [-0.48, -0.3], [0.0, -0.36], [0.38, -0.34], [0.4, -0.2], [0.0, -0.2], [-0.32, -0.04]]), V.WO(f, { fill: '#33383c', tex: 'weave' + s, texOp: 0.75, inkW: 1.6 }));
  V.standingHair(f, [[-0.46, -0.04], [-0.42, 0.04], [-0.36, 0.1]].map(q => hF([q])[0]), 28, { col: '#4a4038', w: 2.8, lean: -1.0, fan: 0.8 });

  // ---- far forearm: bloated, a copper strip fused round it; the fist hanging with the crowbar
  f.bone('crowbar');
  const cb0 = add(WF, rot([-150, 0], cA)), cb1 = add(WF, rot([270, 0], cA));
  f.part(limb(cb0, cb1, 20, 18, { steps: 10 }), V.IR(f, { inkW: 1.4 }));
  f.line([lp(cb0, cb1, 0.05, -5), lp(cb0, cb1, 0.95, -5)], 1.4, P.ironL, { op: 0.6, straight: true });
  { const cf = frame(cb1, cA, 1); f.part(cf([[-14, -10], [10, -12], [30, -4], [44, 14], [40, 30], [30, 20], [24, 8], [6, 6], [-14, 10]]), V.IR(f, { inkW: 1.3 })); f.flat(cf([[30, 8], [44, 22], [38, 24]]), '#0a0a0a'); } // the claw
  { const cf = frame(cb0, cA, 1); f.part(cf([[16, -10], [-10, -12], [-22, -18], [-24, -8], [-10, 8], [16, 10]]), V.IR(f, { inkW: 1.3 })); } // the chisel end, bent
  f.flat(ell(lerp(cb0, cb1, 0.7), 12, 6, cA, 8), P.rust, { op: 0.6 }); V.lichtenberg(f, lerp(cb0, cb1, 0.72), cA, 70, 1.6, { metal: true, depth: 1, fork: 0.4 }); // the burn runs along the bar, not off it
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.5), WF], [86, 82, 66], { steps: 8, bp: [[0, 0.4, 0.12]] }), SKN({ fill: mix(skin, skinS, 0.12) }));
  { const sc = lerp(EF, WF, 0.14), sd = E.norm(sub(WF, EF)), sn = [-sd[1], sd[0]]; f.part([add(add(sc, mul(sn, 52)), mul(sd, -16)), add(add(sc, mul(sn, 54)), mul(sd, 12)), add(add(sc, mul(sn, -52)), mul(sd, 16)), add(add(sc, mul(sn, -54)), mul(sd, -12))], SM({ fill: smockD, inkW: 1.6, cast: false })); for (const o2 of [-30, -8, 14, 34]) f.line([add(add(sc, mul(sn, o2)), mul(sd, -14)), add(add(sc, mul(sn, o2 + 4)), mul(sd, 14))], 1.2, INK, { op: 0.5 }); } // the sleeve rolled up in a thick bunched ring
  { const q0 = lp(EF, WF, 0.5, -44), q1 = lp(EF, WF, 0.5, 44), q2 = lp(EF, WF, 0.66, 42), q3 = lp(EF, WF, 0.66, -40); f.part([q0, q1, q2, q3], CU()); for (const t of [0.2, 0.8]) { const q = lerp(lerp(q0, q3, 0.5), lerp(q1, q2, 0.5), t); f.part(ell(q, 6, 6, 0, 8), V.IR(f, { inkW: 1, cast: false })); } V.weld(f, lerp(q0, q3, 0.5), ang(EF, WF), 18, { burns: [[ang(WF, EF), 60, 1.8]] }); }
  V.barnacles(f, lp(EF, WF, 0.1, -20), 16, 10, 4, 3, 6);
  f.bone('hand_f');
  B.grip(f, WF, EF, cA, 48, mix(skin, skinS, 0.15), { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'breaker crowbar' });
  V.peel(f, WF, 2, 1.4);

  // ---- near arm, raised: a bloated forearm with a copper sheet and iron bolts fused into it, the fist round the knee's
  // handle in front of the shoulder; the bend of the knee lies over the shoulder
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.2)], [122, 104, 98], { steps: 8, bp: [[0, 0.5, 0.14]] }), SM());
    f.stroke([lp(SN, EN, 0.4, 30), lp(SN, EN, 0.6, 6), lp(SN, EN, 0.8, -30)], 2.4);
  }, [['upperarm_n', side(EN, mul(de, -1), 46)], ['forearm_n', side(EN, de, 46)]]);
  f.bone('forearm_n');
  f.part(K.chain([lerp(EN, WN, 0.1), lerp(EN, WN, 0.55), WN], [100, 94, 74], { steps: 8, bq: [[0, 0.5, 0.12]] }), SKN());
  { const sc = lerp(EN, WN, 0.1), sd = E.norm(sub(WN, EN)), sn = [-sd[1], sd[0]]; f.part([add(add(sc, mul(sn, 56)), mul(sd, -18)), add(add(sc, mul(sn, 58)), mul(sd, 14)), add(add(sc, mul(sn, -56)), mul(sd, 18)), add(add(sc, mul(sn, -58)), mul(sd, -14))], SM({ inkW: 1.6, cast: false })); for (const o2 of [-32, -10, 12, 34]) f.line([add(add(sc, mul(sn, o2)), mul(sd, -16)), add(add(sc, mul(sn, o2 + 4)), mul(sd, 16))], 1.2, INK, { op: 0.5 }); }
  V.barnacles(f, lp(EN, WN, 0.12, 30), 16, 10, 5, 3, 6);
  { const q0 = lp(EN, WN, 0.38, -46), q1 = lp(EN, WN, 0.38, 46), q2 = lp(EN, WN, 0.74, 40), q3 = lp(EN, WN, 0.74, -42); f.part([q0, q1, q2, q3], CU()); f.line([lerp(q0, q3, 0.2), lerp(q1, q2, 0.3)], 1.2, '#a47a58', { op: 0.6 }); f.line([lerp(q0, q3, 0.6), lerp(q1, q2, 0.62)], 1, INK, { op: 0.5 }); for (const [t, u] of [[0.2, 0.3], [0.2, 0.75], [0.7, 0.3], [0.7, 0.72]]) { const q = lerp(lerp(q0, q3, t), lerp(q1, q2, t), u); f.part(ell(q, 7, 7, 0, 10), V.IR(f, { inkW: 1.1, cast: false })); f.flat(ell(q, 2.6, 2.6, 0, 6), P.ironD); } V.verdigris(f, lerp(q0, q2, 0.5), 20, 14, 4);
    V.weld(f, lerp(q0, q1, 0.5), ang(EN, WN) + Math.PI / 2, 20, { burns: [[ang(WN, EN), 70, 2]] }); V.weld(f, lerp(q3, q2, 0.5), ang(EN, WN) + Math.PI / 2, 18, { burns: [] }); }
  f.bone('knee');
  // the handle and the bend over the shoulder, in front of the body (the back arm was drawn behind)
  clipDrawK(f, KO, drawKnee, butt, bend, add(SN, rot([-10, 0], hA2)));
  f.bone('hand_n');
  B.grip(f, WN, EN, hA2, 50, skin, { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, name: 'breaker knee' });
  V.peel(f, WN, 2, 1.4); V.barnacle(f, add(WN, [-10, 20]), 5);
  return f;
}
// draw the knee again clipped to its handle and bend (the part that lies in front of the shoulder)
function clipDrawK(f, KO, draw, butt, bend, cut) {
  const d1 = KO.d1, n1 = KO.n1, c = cut, reg = [add(c, mul(n1, -200)), add(c, mul(n1, 200)), add(add(c, mul(n1, 200)), mul(d1, -400)), add(add(c, mul(n1, -200)), mul(d1, -400))];
  V.clipDraw(f, reg, draw);
}

// ------------------------------------------------------------------ ROCK OCTOPUS (cast, small 0.5)
// An octopus of the tide pools under the wreckers' cliff, which walled its den with the bright salvage of the wrecks.
// Risen off a wet rock on the curled tips of its arms, the swollen mantle held high and sagging behind, two front arms
// lifted stiff toward the company. The strike hit the pool among its hoard: the copper and brass are fused into the
// suckers of those two arms, which have set rigid, studded with scorched metal and branching like antlers at the welds.
// Pale Lichtenberg trees across the mantle and down every arm; the papillae stand in stiff points. Water has swollen
// it: the mantle hangs heavy, the skin pale and wrinkled, barnacles at the arm bases. Copper nails along the raised
// arms, a brass button in a sucker, a bent copper coin, a brass hinge, tarred line round one arm, one arm bitten off and
// regrowing, kelp trailing from the mantle, empty crab shells round the rock, a broken cork float in the arms.
// Rig: rock (root) > body (the arm crown) > mantle, eyes; raised arms arm_r1_1..3 and arm_r2_1..3; walking arms
// arm_w1..w5 (one bone each).
// Motion: idle the arm tips curling and uncurling (arm_w*), the mantle swelling and sagging (mantle); attack a raised arm
// whipped round a hero (arm_r1_1..3), the hero held in place.
function rockOctopus() {
  const CH = TIERS.small[1], f = new Fig(V.base(627, CH)); V.textures(f);
  const gy = f.o.groundY, s = '627';
  const fl = { fill: '#6a727a', shadow: '#262a34', light: '#9aa2a8', shade: 0.36, tex: 'mottle' + s, texOp: 0.6 };
  const FL = (o = {}) => Object.assign({}, fl, o);
  const WC = [318, 640], EY = [338, 596];
  f.joint('rock', [300, gy]).joint('body', WC, 'rock').joint('mantle', [318, 606], 'body');
  const raised = [
    { b: 'arm_r1', ctrl: [[344, 636], [392, 598], [438, 560], [484, 524], [524, 494], [556, 478], [572, 476]], w: 30 },
    { b: 'arm_r2', ctrl: [[332, 628], [366, 584], [398, 540], [430, 498], [458, 464], [476, 446], [482, 432]], w: 27 },
  ];
  const walk = [
    { b: 'arm_w5', ctrl: [[296, 642], [252, 650], [210, 668], [178, 690], [164, 712], [170, 726], [182, 722]], w: 22, far: true },
    { b: 'arm_w1', ctrl: [[304, 650], [266, 672], [230, 690], [206, 708], [196, 730], [206, 744], [220, 738], [218, 726]], w: 27 },
    { b: 'arm_w2', ctrl: [[318, 656], [312, 680], [302, 700], [292, 718], [294, 734], [306, 736], [310, 724]], w: 26 },
    { b: 'arm_w3', ctrl: [[338, 654], [370, 674], [398, 690], [420, 708], [432, 730], [424, 744], [410, 738], [414, 726]], w: 27 },
  ];
  for (const A of raised) { const c = A.ctrl, n = c.length - 1; f.joint(A.b + '_1', c[0], 'body').joint(A.b + '_2', lerp(c[2], c[3], 0.2), A.b + '_1').joint(A.b + '_3', lerp(c[4], c[5], 0.1), A.b + '_2'); }
  for (const A of walk) f.joint(A.b, A.ctrl[0], 'body');
  f.joint('arm_w4', [330, 650], 'body');

  // ---- the rock: a wet boulder with a lit top plane and a dark front face, bedding lines, weed, barnacles, and the
  // octopus's middens: empty crab shells heaped round its foot
  f.bone('rock');
  const rockP = [[136, gy], [142, 742], [168, 706], [220, 688], [292, 680], [364, 686], [430, 700], [468, 732], [478, gy]];
  f.part(rockP, { fill: '#545a60', shadow: '#1c2026', light: '#8a9298', shade: 0.42, tex: 'pit' + s, texOp: 0.6 });
  f.part([[150, 742], [176, 714], [226, 698], [292, 690], [362, 696], [426, 710], [460, 736], [400, 728], [300, 716], [210, 724]], { fill: '#6c7278', shadow: '#2a2e34', shade: 0.3, inkW: 0, cast: false }); // the wet top plane catching the light
  for (const yy of [748, 768]) f.line([[146, yy], [240, yy - 6], [330, yy - 2], [420, yy - 8], [474, yy - 4]], 1.2, INK, { op: 0.5 }); // bedding planes
  V.wetSheen(f, [[180, 716], [230, 702], [290, 696], [350, 700], [410, 712]], 2, 0.5);
  V.barnacles(f, [176, 760], 26, 20, 9, 3, 6); V.barnacles(f, [450, 756], 20, 20, 7, 3, 6); V.kelpHang(f, [170, 712], 50, 6, -6); V.kelpHang(f, [466, 740], 36, 5, 4);
  for (const [x, y, r, a2] of [[118, 782, 16, 0.3], [94, 786, 12, -0.4], [496, 780, 18, -0.2], [524, 784, 12, 0.5], [140, 786, 10, 0.9]]) { // empty crab shells
    const c = [x, y]; f.part([add(c, rot([-r, 2], a2)), add(c, rot([-r * 0.7, -r * 0.6], a2)), add(c, rot([0, -r * 0.8], a2)), add(c, rot([r * 0.8, -r * 0.5], a2)), add(c, rot([r, 2], a2)), add(c, rot([0, r * 0.3], a2))], V.SL(f, { fill: '#7a6a5a', shadow: '#2a2018', light: '#a8968a', inkW: 1.1, cast: false, shade: 0.4 }));
    f.flat(ell(add(c, rot([0, -r * 0.1], a2)), r * 0.6, r * 0.25, a2, 8), '#1a1410', { op: 0.6 }); f.line([add(c, rot([-r * 0.5, -r * 0.5], a2)), add(c, rot([r * 0.4, -r * 0.6], a2))], 1, '#c8b8a8', { op: 0.6 });
    if (r > 12) { f.line([add(c, rot([r, 0], a2)), add(c, rot([r + 10, -6], a2)), add(c, rot([r + 16, 2], a2))], 3, '#6a5a4a'); } }
  f.flat(ell([300, gy + 2], 200, 7, 0, 18), '#3a4448', { op: 0.5 });

  // ---- the far walking arm, behind
  const look = (A) => A.far ? FL({ fill: mix(fl.fill, '#000', 0.18) }) : FL();
  const drawWalk = (A, i) => {
    f.bone(A.b);
    const mid = A.ctrl[Math.floor(A.ctrl.length / 2)], mid2 = A.ctrl[Math.floor(A.ctrl.length / 2) + 1], d = E.norm(sub(mid2, mid)), n = [-d[1], d[0]];
    const T = V.tentacle(f, A.ctrl, A.w, look(A), { oral: n[1] > 0 ? 1 : -1, swell: 0.25 });
    V.clipDraw(f, T.out, () => V.lichtenberg(f, T.at(T.L * 0.1).p, Math.atan2(T.at(T.L * 0.1).d[1], T.at(T.L * 0.1).d[0]), T.L * 0.5, 1.6, { pale: true, depth: 2, col: '#c8ccc8', fork: 0.5 }));
    V.barnacles(f, T.at(T.L * 0.06).p, 8, 6, 3, 2, 4);
    return T;
  };
  drawWalk(walk[0]);

  // ---- the mantle: a huge swollen sac held high, its weight sagging back and down; pale wrinkled skin, stiff papillae,
  // pale Lichtenberg trees, kelp trailing
  f.bone('mantle');
  // (independent review) the sac re-drawn as a heavy pendulous bag, not an egg: the weight hangs to the back and under,
  // the outline lumpy, a fold where it creases over itself, warts in clusters, a deep sag fold with a lit ridge
  const mant = V.lumpy(f, [[318, 626], [296, 638], [262, 654], [226, 662], [192, 652], [166, 630], [148, 598], [142, 564], [150, 532], [166, 510], [188, 498], [214, 496], [236, 488, 1], [256, 478], [278, 480], [296, 496], [310, 520, 1], [322, 542], [338, 566], [350, 592], [354, 612]], 4);
  f.part(mant, FL({ tex: 'wrinkle' + s, texOp: 0.45, shade: 0.4 }));
  V.clipDraw(f, mant, () => {
    f.flat(ell([270, 520], 70, 60, -0.5, 18), '#ffffff', { op: 0.06 }); // the round of the sac
    f.flat([[170, 530], [210, 590], [270, 622], [340, 612], [300, 640], [200, 620]], '#141820', { op: 0.4 }); // the sag's underside in shadow
    for (let i = 0; i < 4; i++) f.line([[196 + i * 6, 500 + i * 22], [240 + i * 10, 540 + i * 18], [300 + i * 6, 560 + i * 14]], 1.1, INK, { op: 0.4 }); // sag folds
    V.lichtenberg(f, [300, 470], deg(160), 120, 2.2, { pale: true, depth: 3, col: '#cfd3cf' });
    V.lichtenberg(f, [330, 540], deg(-150), 80, 1.8, { pale: true, depth: 2, col: '#cfd3cf' });
    for (let i = 0; i < 34; i++) { const q = [186 + f.r() * 160, 466 + f.r() * 140], h2 = 2 + f.r() * 3; f.flat([add(q, [-2.4, 1.6]), add(q, [0, -h2]), add(q, [2.4, 1.6])], mix(fl.fill, '#fff', 0.3), { op: 0.8 }); f.line([add(q, [0, -h2]), add(q, [2.4, 1.6])], 0.8, INK, { op: 0.6 }); } // papillae standing up in small stiff points
    f.stroke([[190, 560], [230, 588], [280, 606], [330, 606]], 2.6, '#141820'); f.stroke([[180, 520], [214, 548], [254, 566]], 2, '#141820'); f.stroke([[250, 470], [256, 520], [276, 560]], 1.8, '#141820'); // the creases where the sac folds over under its own weight
    V.saltCrust(f, [240, 470], 40, 16, 10);
    for (const [c, a2] of [[[214, 566], 0.6], [[258, 600], 0.3]]) { const C = [add(c, rot([-40, 0], a2)), add(c, rot([0, 8], a2)), add(c, rot([40, 0], a2))]; f.stroke(C, 7, '#0c1016', { op: 0.6 }); f.line(C.map(q => add(q, [3, -6])), 1.8, '#c8ccca', { op: 0.55 }); } // deep sag folds, each a valley and a lit ridge
    const rW = E.rng(6271); for (let i = 0; i < 26; i++) { const q = [176 + rW() * 160, 470 + rW() * 150], r = 2.5 + rW() * 4.5; f.flat(ell(add(q, [-r * 0.4, r * 0.5]), r * 1.1, r * 0.7, 0, 8), '#0a0c10', { op: 0.35 }); f.flat(ell(q, r, r * 0.8, 0, 8), mix(fl.fill, '#fff', 0.1), { op: 0.9 }); f.flat(ell(add(q, [r * 0.25, -r * 0.3]), r * 0.4, r * 0.3, 0, 6), '#d8dad6', { op: 0.3 }); f.line(ell(q, r, r * 0.8, 0, 8).slice(3, 8), 0.8, INK, { op: 0.6 }); } // warts: a lit bump with its shadow under it
    f.flat([[150, 560], [200, 620], [262, 652], [340, 630], [352, 680], [150, 680]], '#0a0c12', { op: 0.35 }); hatchIn(f, [[150, 580], [230, 630], [330, 640], [330, 680], [150, 680]], deg(55), 6, '#06080c', 0.5, 1); // the hanging underside in crosshatched shadow
  });
  for (const [x, y] of [[166, 512], [192, 500], [258, 480]]) f.part([[x - 3, y + 3], [x - 4, y - 5], [x + 3, y + 2]], FL({ inkW: 0.8, inkHeavy: 1, cast: false, hatch: false })); // a few stiff points on the outline
  V.kelpHang(f, [206, 568], 70, 6, -6); V.kelpHang(f, [236, 590], 54, 5, 3);
  V.barnacles(f, [300, 610], 20, 8, 5, 2, 4);

  // ---- walking arms, in front of the rock
  for (const A of walk.slice(1)) drawWalk(A);
  // the stump: an arm bitten off short, the end healed pale and a small new arm regrowing from it
  f.bone('arm_w4');
  { const T = V.tentacle(f, [[326, 652], [342, 672], [352, 690], [356, 700]], 24, FL(), { oral: 1, suckTo: 0.7, bandEnd: 0.8 }); const e = T.at(T.L * 0.88).p; f.part(lumpE(f, e, 12, 10, 0.4, 0.2), FL({ fill: '#c8c4bc', cast: false, inkW: 1.1 })); f.part(V.ribbon(V.spline([e, add(e, [8, 10]), add(e, [16, 12]), add(e, [20, 6])], 2), t => 7 * (1 - t) + 1.5), FL({ fill: '#b4b0aa', cast: false, inkW: 0.9, inkHeavy: 1.1 })); }
  // the ring of tarred line wound round arm_w3, the broken cork float caught between two arms
  f.bone('arm_w3'); { const q = lerp(walk[3].ctrl[1], walk[3].ctrl[2], 0.5); for (let i = 0; i < 3; i++) f.line([add(q, [-6 + i * 7, -16]), add(q, [-2 + i * 7, 0]), add(q, [-8 + i * 7, 16])], 3.4, '#2a2418'); f.line([add(q, [16, -10]), add(q, [30, 10]), add(q, [26, 30])], 2.6, '#2a2418'); }
  f.bone('arm_w2'); { const q = [282, 690]; f.part([add(q, [-14, -8]), add(q, [12, -12]), add(q, [16, 6]), add(q, [6, 12]), add(q, [-4, 4]), add(q, [-14, 8])], { fill: '#8a7660', shadow: '#3a2e22', shade: 0.4, tex: 'pit' + s, texOp: 0.7, inkW: 1.1, cast: false }); f.flat([add(q, [6, 12]), add(q, [-4, 4]), add(q, [2, 2])], '#1a1410', { op: 0.6 }); f.line([add(q, [-10, -4]), add(q, [8, -8])], 1.4, P.lamp, { op: 0.5 }); } // cork float, its paint band

  // ---- the head and eyes: two bulging turrets in front of the mantle, horizontal bar pupils, wrinkled lids
  f.bone('mantle');
  const eye = (c, r, far) => {
    f.part([add(c, [-r * 1.5, r * 0.9]), add(c, [-r * 1.2, -r * 0.6]), add(c, [-r * 0.2, -r * 1.3]), add(c, [r * 0.9, -r * 0.9]), add(c, [r * 1.4, r * 0.2]), add(c, [r * 1.1, r * 1.0])], FL({ fill: mix(fl.fill, far ? '#000' : '#fff', 0.08), tex: 'wrinkle' + s, texOp: 0.5 }));
    f.part(ell(c, r, r * 0.86, 0, 16), { fill: '#a8a292', shadow: '#4a463c', light: '#d4cec0', shade: 0.35, inkW: 1.3, inkHeavy: 1.8, cast: false, hatch: false });
    f.flat([add(c, [-r * 0.66, -r * 0.14]), add(c, [r * 0.66, -r * 0.2]), add(c, [r * 0.62, r * 0.18]), add(c, [-r * 0.62, r * 0.2])], '#0e0c0a'); // the bar pupil
    f.flat(ell(add(c, [-r * 0.3, -r * 0.45]), r * 0.18, r * 0.12, 0, 6), '#fff', { op: 0.75 });
    f.part([add(c, [-r * 1.2, -r * 0.1]), add(c, [-r * 0.6, -r * 1.0]), add(c, [r * 0.4, -r * 1.06]), add(c, [r * 1.1, -r * 0.4]), add(c, [r * 0.6, -r * 0.62]), add(c, [-r * 0.4, -r * 0.66])], FL({ cast: false, inkW: 1.1, shade: 0.4 })); // heavy upper lid
    f.line([add(c, [-r * 0.9, r * 0.7]), add(c, [0, r * 0.98]), add(c, [r * 0.9, r * 0.6])], 1.2, INK, { op: 0.6 });
    for (let i = 0; i < 3; i++) f.part([add(c, [-r + i * r * 0.8, -r * 1.0]), add(c, [-r * 0.8 + i * r * 0.8, -r * 1.5]), add(c, [-r * 0.6 + i * r * 0.8, -r * 0.98])], FL({ inkW: 0.8, cast: false, hatch: false })); // papillae over the eye
  };
  eye([316, 590], 11, true); eye(EY, 14, false);
  V.lichtenberg(f, add(EY, [-24, 10]), deg(170), 40, 1.4, { pale: true, depth: 1, col: '#cfd3cf' });
  // the web between the arms at the crown, under the head
  f.bone('body');
  f.part([[290, 630], [318, 618], [352, 628], [360, 648], [338, 662], [304, 662], [284, 648]], FL({ fill: mix(fl.fill, '#d8dad4', 0.25), cast: false }));
  f.line([[296, 648], [318, 640], [344, 648]], 1.2, INK, { op: 0.5 }); V.barnacles(f, [300, 650], 16, 6, 5, 2, 4); V.barnacles(f, [346, 648], 10, 6, 3, 2, 4);
  f.flat(ell([322, 666], 6, 4, 0, 8), '#1a1214', { op: 0.6 }); // the siphon's mouth

  // ---- the two raised arms: rigid, studded with the hoard fused into the suckers, branching like antlers at the welds
  const drawRaised = (A, i) => {
    const c = A.ctrl, j2 = f.joints[A.b + '_2'].pivot, j3 = f.joints[A.b + '_3'].pivot, d2 = E.norm(sub(c[3], c[2])), d3 = E.norm(sub(c[5], c[4]));
    split(f, () => {
      const T = V.tentacle(f, c, A.w, FL({ fill: mix(fl.fill, '#3a3a40', 0.1) }), { oral: 1, swell: 0.3, skip: t => (i === 0 ? [0.3, 0.5, 0.7] : [0.4, 0.62]).some(x => Math.abs(t - x) < 0.03) });
      V.clipDraw(f, T.out, () => V.lichtenberg(f, T.at(T.L * 0.05).p, Math.atan2(T.at(T.L * 0.05).d[1], T.at(T.L * 0.05).d[0]), T.L * 0.7, 1.8, { pale: true, depth: 2, col: '#cfd3cf', fork: 0.5 }));
      V.barnacles(f, T.at(T.L * 0.06).p, 10, 6, 3, 2, 4.5);
      // the hoard welded into the suckers
      T.suckers.forEach((sq, k) => {
        if (sq.t < 0.15 || sq.t > 0.9) return;
        const sgn = (k % 3 === 0);
        if (k % 2 === 0) { // a copper sheathing nail driven out through the sucker, its head proud
          const tip = add(sq.q, mul(sq.n, sq.r * 2.6)); f.line([sq.q, tip], 3.6, INK); f.line([sq.q, tip], 2, '#8a5a3a'); f.part(ell(tip, sq.r * 0.7, sq.r * 0.4, sq.a, 8), { fill: '#8a5a3a', shadow: '#3a2218', shade: 0.4, inkW: 0.9, cast: false, hatch: false });
        }
        f.flat(ell(sq.q, sq.r * 1.3, sq.r, sq.a, 8), '#141210', { op: 0.5 }); // the scorched weld round each
      });
      const W = (t, fn) => { const a = T.at(T.L * t); fn(add(a.p, mul(a.n, T.wf(t) * 0.36)), Math.atan2(a.d[1], a.d[0]), a.n, T.wf(t)); };
      const antler = (p, a2, nn, w) => { V.weld(f, p, a2, w * 0.5, { burns: [], rim: false }); const b0 = add(p, mul(nn, w * 0.3)), b1 = add(b0, rot(mul(nn, w * 0.9), -0.3)), b2 = add(b1, rot(mul(nn, w * 0.6), 0.5)), b3 = add(b1, rot(mul(nn, w * 0.55), -0.6)); for (const br of [[b0, b1, b2], [b1, b3]]) { f.stroke(br, w * 0.28 + 2, INK); f.stroke(br, w * 0.28, '#4a3a2c'); f.line(br.slice(0, 2), 1, '#c8a070', { op: 0.7 }); } f.flat(ell(b2, 2, 2, 0, 6), P.lampL, { op: 0.8 }); };
      if (i === 0) {
        W(0.3, (p, a2) => { f.part(ell(p, 11, 9, a2, 14), { fill: '#a07a4a', shadow: '#3a2a18', light: '#d8b080', shade: 0.4, inkW: 1.2, cast: false, hatch: false }); f.flat(ell(p, 2, 2, 0, 6), '#141210'); f.flat(ell(add(p, [3, 1]), 2, 2, 0, 6), '#141210'); }); // the brass button in a sucker
        W(0.5, (p, a2, nn, w) => antler(p, a2, nn, w));
        W(0.7, (p, a2) => { f.part(ell(p, 9, 6, a2 + 0.4, 12).map((q, k2) => k2 > 6 ? add(q, [0, 3]) : q), { fill: '#8a5a3a', shadow: '#3a2218', light: '#c08a5a', shade: 0.4, inkW: 1.1, cast: false, hatch: false }); f.line([add(p, [-4, 0]), add(p, [4, 2])], 0.8, '#3a2218'); }); // a bent copper coin
      } else {
        W(0.4, (p, a2) => { const hf = frame(p, a2, 1); f.part(hf([[-12, -7], [12, -7], [12, 7], [-12, 7]]), { fill: '#9a7a4a', shadow: '#3a2a18', light: '#d0a870', shade: 0.4, inkW: 1.1, cast: false, sharp: true, hatch: false }); f.line(hf([[0, -7], [0, 7]]), 2, '#3a2a18'); for (const x of [-7, 7]) f.flat(ell(hf([[x, 0]])[0], 1.6, 1.6, 0, 6), '#141210'); }); // a brass hinge
        W(0.62, (p, a2, nn, w) => antler(p, a2, nn, w));
      }
      V.verdigris(f, T.at(T.L * 0.5).p, 14, 10, 4);
      const tp = T.at(T.L * 0.97).p; f.flat(ell(tp, 4, 4, 0, 6), '#141210', { op: 0.7 }); // the tip scorched black
    }, [[A.b + '_1', side(j2, mul(d2, -1), A.w * 0.5)], [A.b + '_2', [side(j2, d2, A.w * 0.5), side(j3, mul(d3, -1), A.w * 0.4)]], [A.b + '_3', side(j3, d3, A.w * 0.4)]]);
  };
  drawRaised(raised[1], 1); drawRaised(raised[0], 0);
  return f;
}

// ------------------------------------------------------------------ STORM PETRELS (cast, small, a flock 0.6 across)
// The storm's chickens: dozens of small sooty seabirds riding in low over the surf ahead of the gale, their feet
// pattering on the water as if walking on it. Lightning has stood every feather on end (each bird a ruffled, spiky
// body round a bird's shape), scorched and frayed the wingtips and burned a fern across each white rump band; the sea has
// soaked them bedraggled. One trails a broken wing, a snarl of fishing line binds two of them, a scrap of torn sail is
// tangled in the flock, one carries a ship's button in its beak, a dead one floats below; foam flecks; every bill open.
// Rig: water (root) > bird_1 .. bird_11 (one bone per body) > dead (on the water), sail (the tangled scrap).
// Motion: idle a fluttering hover (each bird bobs, wings flick), feet pattering; attack the flock pours over a hero.
function stormPetrels() {
  const CH = TIERS.small[1], f = new Fig(V.base(626, CH)); V.textures(f);
  const gy = f.o.groundY, s = '626', wl = gy - 50;
  // birds: [x, y, scale, tilt, nearWing, farWing, extra]
  const B0 = [
    [150, 500, 0.72, -0.1, -2.2, -2.5, { col: '#26282e' }], [430, 470, 0.7, 0.05, -1.9, -2.3, { col: '#26282e' }], [300, 452, 0.66, -0.15, -2.4, -2.6, { col: '#24262c' }],
    [214, 590, 0.86, 0.08, -2.0, -2.4, { line: 1 }], [360, 560, 0.84, -0.12, -2.3, -2.6, { button: 1 }], [500, 600, 0.82, 0.1, -1.7, -2.1, {}],
    [110, 640, 0.92, 0.0, -2.5, -2.7, {}], [290, 650, 0.98, -0.06, -1.8, -2.2, { line: 1 }], [440, 676, 0.96, 0.12, -2.1, -2.5, { broken: 1 }],
    [180, 700, 1.0, -0.04, -2.2, -2.6, {}], [360, 712, 1.04, 0.04, -2.0, -2.4, { sail: 1 }],
  ];
  f.joint('water', [300, wl]);
  B0.forEach((b, i) => f.joint('bird_' + (i + 1), [b[0], b[1]], 'water'));
  f.joint('dead', [250, wl + 8], 'water').joint('sail', [380, 760], 'bird_11');

  // ---- the surf: a dark swell with breaking white lace, spray kicked up where the feet patter
  f.bone('water');
  f.part([[-10, wl - 4], [80, wl - 12], [180, wl - 2], [270, wl - 14], [360, wl - 4], [460, wl - 14], [540, wl - 4], [610, wl - 10], [610, gy + 30, 1], [-10, gy + 30, 1]], { fill: P.sea, shadow: P.seaD, light: P.seaL, shade: 0.4, tex: 'mottle' + s, texOp: 0.5, inkW: 0, cast: false });
  f.line([[-10, wl - 4], [80, wl - 12], [180, wl - 2], [270, wl - 14], [360, wl - 4], [460, wl - 14], [540, wl - 4], [610, wl - 10]], 1.4, INK, { op: 0.6 });
  for (let i = 0; i < 5; i++) f.line([[0, wl + 10 + i * 12], [140, wl + 4 + i * 12], [260, wl + 12 + i * 12], [380, wl + 2 + i * 12], [500, wl + 10 + i * 12], [600, wl + 4 + i * 12]], 1, P.seaL, { op: 0.4 });
  const lace = (x0, x1, y) => { for (let x = x0; x < x1; x += 10 + f.r() * 10) { const q = [x, y + (f.r() - 0.5) * 8]; f.flat(lumpE(f, q, 6 + f.r() * 8, 3 + f.r() * 3, 0, 0.4, 10), f.r() > 0.4 ? P.foam : P.surfD, { op: 0.85 }); if (f.r() > 0.6) f.line(ell(q, 4, 2, 0, 8), 0.8, P.surfS, { op: 0.6 }); } };
  lace(60, 540, wl - 8); lace(120, 480, wl + 16);

  // ---- the dead one floating below: on its side on the swell, a wing spread flat, legs up
  f.bone('dead');
  { const dc = [250, wl + 6]; const d = V.petrel(f, dc, 0.9, { tilt: 0.25, wing: [0.3, -0.2], gape: 0.6, spikes: 14, drips: false, col: '#3a3c42' }); f.flat(ell(add(dc, [0, 12]), 70, 6, 0, 12), P.seaD, { op: 0.5 }); lace(190, 310, wl + 12); }

  // ---- the flock, back to front
  const anchors = [];
  B0.forEach((b, i) => {
    f.bone('bird_' + (i + 1));
    const r = V.petrel(f, [b[0], b[1]], b[2], { tilt: b[3], wing: [b[4], b[5]], gape: 0.3 + f.r() * 0.35, broken: !!b[6].broken, col: b[6].col, legAng: b[1] > 620 ? 0.5 : 0.2 });
    anchors.push(r);
    if (b[6].button) { const q = r.bill; f.part(ell(add(q, [-2, 3]), 6, 5.6, 0, 10), V.BRS(f, { inkW: 1, cast: false, hatch: false })); f.flat(ell(add(q, [-3, 2]), 1.2, 1.2, 0, 6), '#141210'); f.flat(ell(add(q, [0, 4]), 1.2, 1.2, 0, 6), '#141210'); V.verdigris(f, add(q, [-2, 4]), 3, 3, 2); }
    if (b[1] > 640) for (const ft of r.feet) { f.flat(lumpE(f, add(ft, [6, 6]), 10, 4, 0, 0.5), P.foam, { op: 0.85 }); for (let k = 0; k < 3; k++) f.flat(ell(add(ft, [-6 + k * 7, -4 - f.r() * 10]), 1.6, 1.6, 0, 6), P.foam, { op: 0.85 }); } // spray kicked up by the pattering feet
  });
  // the snarl of fishing line binding two birds: loops round each body and a tangle between
  f.bone('bird_4');
  { const a = anchors[3].rump, b = anchors[7].rump; const pts = [add(a, [-10, -8]), add(a, [14, 6]), add(a, [-8, 10]), lerp(a, b, 0.3), add(lerp(a, b, 0.5), [24, -8]), add(lerp(a, b, 0.5), [-12, 10]), lerp(a, b, 0.75), add(b, [-12, -10]), add(b, [12, 4]), add(b, [-6, 12])]; f.line(pts, 2.2, INK, { op: 0.7 }); f.line(pts, 1, '#d8d4c4'); f.part(ell(lerp(a, b, 0.55), 5, 4, 0, 8), { fill: '#8a8a7a', inkW: 0.8, cast: false }); f.line([add(b, [-6, 12]), add(b, [-10, 30]), add(b, [-4, 44])], 1, '#d8d4c4', { op: 0.8 }); }
  // the scrap of torn sail tangled in the feet of the lowest bird, trailing in the surf
  f.bone('sail');
  { const ft = anchors[10].feet[0], q = add(ft, [-6, 6]); const sail = [q, add(q, [34, 0]), add(q, [56, 14]), [...add(q, [62, 30]), 1], add(q, [40, 24]), [...add(q, [30, 36]), 1], add(q, [12, 22]), [...add(q, [-6, 30]), 1], add(q, [-8, 12])]; f.part(sail, { fill: '#d8d4c4', shadow: '#8a8678', light: '#f0ece0', shade: 0.25, tex: 'weave' + s, texOp: 0.6, inkW: 1.2 }); f.line([add(q, [4, 4]), add(q, [10, 40])], 1, INK, { op: 0.5 }); f.flat(ell(add(q, [16, 20]), 5, 5, 0, 8), '#3a3a3a', { op: 0.6 }); f.line(ell(add(q, [16, 20]), 6, 6, 0, 10).concat([ell(add(q, [16, 20]), 6, 6, 0, 10)[0]]), 1.4, P.ironL); V.scorch(f, add(q, [28, 30]), 10, 8, 0.5); f.flat([add(q, [-12, 36]), add(q, [30, 48]), add(q, [14, 40])], '#2a2e34', { op: 0.3 }); }
  // foam flecks blown through the flock
  f.bone('water');
  for (let i = 0; i < 18; i++) { const q = [80 + f.r() * 440, 430 + f.r() * 280]; f.flat(lumpE(f, q, 2 + f.r() * 3, 1.5 + f.r() * 2, 0, 0.5, 8), P.foam, { op: 0.7 }); }
  return f;
}

// ------------------------------------------------------------------ LANTERN COW (cast, large, 1.3 at the shoulder)
// A hobbled coast cow the wreckers walked along the cliff top at night with a storm lantern lashed to her horns, to look
// like a ship's riding light at anchor. A heavy, gaunt cow plodding with a slow nod, head carried low, the forelegs
// short-stepping in the hobble. The iron lantern drew strike after strike: the horns are scorched black and split,
// Lichtenberg trees branch from their bases down the face, neck and shoulders, and the hair along the spine stands in a
// stiff ridge. Water soaked the hide until it sags, swelled the udder and wrinkled the legs pale where the surf reaches;
// barnacles crust the hooves. The lantern's iron frame is fused to the horns, its glass cracked. A leather hobble
// chained between the forelegs, a rope halter with a trailing lead, a bell on a strap, a soaked sackcloth blanket over
// the back, a brand on the hip, a torn ear tag, kelp in the tail. True size wins: the canvas is widened at the same scale.
// Rig: spine_1 (hips, root) > spine_2 (ribcage) > neck > head > lantern, ear; bell (neck); tail; blanket (spine_2);
// legs leg_[f|h][n|f]_1..3 (upper, lower, cannon and hoof).
// Motion: idle the slow nod (neck, head) with the lantern swinging like a riding light (lantern); attack a lumbering
// butt (neck and head drive forward and up), the strike running down from the lantern through her.
function lanternCow() {
  const CW = 1600, CH = TIERS.large[1], f = new Fig(V.base(624, CH)); V.textures(f);
  const gy = f.o.groundY, s = '624';
  const hide = '#4a453e'; // wet grey-brown: the hide sits with the world's slate and oilskin, not lighter than them
  const HD = (o = {}) => V.SL(f, Object.assign({ fill: hide, shadow: '#1a1714', light: '#7c756a', tex: 'mottle' + s, texOp: 0.6, maxShade: 30 }, o));
  const PALE = (o = {}) => HD(Object.assign({ fill: '#7a746a', light: '#a49c8e', tex: 'wrinkle' + s, texOp: 0.55 }, o));
  const groove = (pts, w = 2.6, op = 0.55) => f.stroke(pts, w, '#0e1014', { op });
  const hair = (c, rx, ry, a2, n, col = '#29241f') => { for (let i = 0; i < n; i++) { const q = V.scatter(f, c, rx, ry), l = 5 + f.r() * 7; f.line([q, add(q, rot([l, 0], a2 + (f.r() - 0.5) * 0.4))], 0.9, col, { op: 0.45 }); } }; // the lie of the coat
  // legs: E elbow (front) / stifle (hind), K knee / hock, F fetlock, T the hoof's centre on the ground
  const LEG = {
    fn: { E: [1070, 700], K: [1078, 884], F: [1082, 1006], T: [1106, gy] },
    ff: { E: [1010, 700], K: [1000, 886], F: [998, 1008], T: [1020, gy] },
    hn: { E: [530, 664], K: [404, 860], F: [436, 1004], T: [468, gy] },
    hf: { E: [498, 664], K: [366, 866], F: [396, 1006], T: [426, gy] },
  };
  const POLL = [1296, 548], hA = deg(62), HF = frame(POLL, hA, 1);
  f.joint('spine_1', [480, 420]).joint('spine_2', [760, 430], 'spine_1').joint('neck', [1020, 300], 'spine_2').joint('head', [1260, 560], 'neck').joint('lantern', add(POLL, [14, -70]), 'head').joint('ear', HF([[10, 36]])[0], 'head').joint('bell', [1188, 630], 'neck').joint('tail', [332, 284], 'spine_1').joint('blanket', [760, 262], 'spine_2');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.E, par).joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.F, `leg_${k}_2`); }

  // ---- a cloven hoof: two claws (the far toe peeking ahead), the coronet band, the heel bulb, the dewclaws behind
  const hoof = (L, far) => {
    const x = L.T[0], tone = far ? 0.22 : 0;
    const HL = { fill: mix('#34302e', '#000', tone), shadow: '#0a0909', light: '#6e6a66', shade: 0.4, tex: 'mottle' + s, texOp: 0.5, inkW: 1.4 };
    f.part([[x - 16, gy - 54], [x + 24, gy - 54], [x + 62, gy - 4], [x + 60, gy, 1], [x - 10, gy, 1]], Object.assign({}, HL, { fill: mix(HL.fill, '#000', 0.3) })); // far claw
    f.part([[x - 34, gy - 48], [x - 8, gy - 56], [x + 22, gy - 56], [x + 52, gy - 6], [x + 50, gy, 1], [x - 30, gy, 1], [x - 44, gy - 18]], HL);
    f.line([[x - 6, gy - 54], [x + 6, gy - 28], [x + 10, gy - 2]], 1.8, INK, { op: 0.8 }); // the cleft
    for (let i = 0; i < 3; i++) f.line([[x - 30 + i * 4, gy - 40 + i * 12], [x + 22 + i * 8, gy - 46 + i * 14]], 1, '#8a8682', { op: 0.4 }); // growth rings
    f.line([[x - 34, gy - 48], [x - 8, gy - 56], [x + 22, gy - 56]], 2.2, '#e0e2de', { op: 0.35 }); // the coronet's pale band
    V.barnacles(f, [x + 8, gy - 24], 24, 16, 7, 3, 6);
  };
  // ---- one leg as one outline, split into three bones at the knee (hock) and the fetlock
  const leg = (k, far) => {
    const L = LEG[k], front = k[0] === 'f', tone = far ? 0.2 : 0, { E: Ep, K: Kp, F: Fp, T } = L, x = T[0];
    const pts = front ? [
      [Ep[0] + 44, Ep[1] - 50], [Ep[0] + 50, Ep[1] + 20], [Ep[0] + 34, Ep[1] + 90], [Kp[0] + 20, Kp[1] - 40], [Kp[0] + 30, Kp[1] + 4], [Kp[0] + 20, Kp[1] + 40],
      [Fp[0] + 16, Fp[1] - 40], [Fp[0] + 28, Fp[1] + 2], [x + 22, gy - 52], [x - 34, gy - 46], [Fp[0] - 22, Fp[1] + 30], [Fp[0] - 30, Fp[1] + 2], [Fp[0] - 18, Fp[1] - 34],
      [Kp[0] - 18, Kp[1] + 46], [Kp[0] - 30, Kp[1] + 6], [Kp[0] - 22, Kp[1] - 34], [Ep[0] - 22, Ep[1] + 80], [Ep[0] - 46, Ep[1] + 14], [Ep[0] - 62, Ep[1] - 24], [Ep[0] - 40, Ep[1] - 64]]
      : [
      [Ep[0] + 30, Ep[1] - 50], [Ep[0] + 40, Ep[1] + 10], [Ep[0] + 4, Ep[1] + 90], [Kp[0] + 30, Kp[1] - 40], [Kp[0] + 34, Kp[1] + 10], [Kp[0] + 32, Kp[1] + 60],
      [Fp[0] + 16, Fp[1] - 40], [Fp[0] + 28, Fp[1] + 2], [x + 22, gy - 52], [x - 34, gy - 46], [Fp[0] - 20, Fp[1] + 30], [Fp[0] - 30, Fp[1] + 2], [Fp[0] - 18, Fp[1] - 34],
      [Kp[0] - 14, Kp[1] + 70], [Kp[0] - 30, Kp[1] + 26], [Kp[0] - 64, Kp[1] - 14, 1], [Kp[0] - 48, Kp[1] - 50], [Kp[0] - 50, Kp[1] - 130], [Ep[0] - 150, Ep[1] - 40], [Ep[0] - 160, Ep[1] - 120]];
    const lk = HD({ fill: mix(hide, '#000', tone), tex: 'wrinkle' + s, texOp: 0.4 });
    const cutK = [Kp[0], Kp[1] + (front ? 18 : 22)], cutF = [Fp[0], Fp[1] - 4];
    split(f, () => {
      f.part(pts, lk);
      V.clipDraw(f, pts, () => {
        // the lower leg pale and wrinkled where the surf reaches, the wet line across it
        f.flat([[x - 120, Kp[1] + 60], [x + 120, Kp[1] + 50], [x + 120, gy], [x - 120, gy]], '#a29a8c', { op: 0.22 });
        f.stroke([[x - 80, Kp[1] + 62], [x - 20, Kp[1] + 50], [x + 60, Kp[1] + 56]], 3, '#1c2028', { op: 0.4 });
        for (let i = 0; i < 6; i++) { const yy = Kp[1] + 70 + i * 18; f.line([[x - 60, yy], [x - 34, yy - 3], [x - 4, yy + 2]], 0.9, INK, { op: 0.35 }); }
        f.flat(ell([Kp[0] + (front ? -6 : -10), Kp[1] + 8], 30, 26, 0, 12), '#0e1014', { op: 0.18 }); // the knee / hock knuckle's shadow side
        hair([Ep[0], Ep[1] + 70], 40, 60, Math.PI / 2, 14);
      });
      // anatomy: the forearm's muscle edge or the gaskin's, the cannon's tendon, the knee or hock, the fetlock knob
      if (front) { groove([[Ep[0] + 20, Ep[1] - 20], [Ep[0] + 16, Ep[1] + 70], [Kp[0] + 10, Kp[1] - 30]], 2.2, 0.45); groove([[Ep[0] - 40, Ep[1] - 10], [Ep[0] - 30, Ep[1] + 30]], 3, 0.6); }
      else { groove([[Ep[0] - 10, Ep[1] - 30], [Ep[0] - 40, Ep[1] + 60], [Kp[0] + 10, Kp[1] - 60]], 2.2, 0.45); groove([[Kp[0] - 48, Kp[1] - 20], [Kp[0] - 36, Kp[1] - 70]], 3, 0.6); f.flat(ell([Kp[0] - 42, Kp[1] - 4], 10, 14, 0.3, 8), '#c8ccca', { op: 0.3 }); }
      f.line([[Kp[0] - 18, Kp[1] + 56], [Fp[0] - 20, Fp[1] - 26]], 1.6, '#e0e4e2', { op: 0.4 }); f.line([[Kp[0] - 12, Kp[1] + 60], [Fp[0] - 14, Fp[1] - 30]], 1.2, INK, { op: 0.45 }); // the flexor tendon down the back of the cannon
      f.line([[Kp[0] + 22, Kp[1] - 4], [Kp[0] + 26, Kp[1] + 22]], 1.4, '#e0e4e2', { op: 0.4 });
      f.part([[Fp[0] - 40, Fp[1] + 4], [Fp[0] - 34, Fp[1] - 8], [Fp[0] - 26, Fp[1] + 12], [Fp[0] - 34, Fp[1] + 18]], HD({ fill: '#2c2a2a', inkW: 1.1, cast: false })); // dewclaw
      hoof(L, far);
    }, [[`leg_${k}_1`, side(cutK, [0, -1], 30)], [`leg_${k}_2`, [side(cutK, [0, 1], 30), side(cutF, [0, -1], 26)]], [`leg_${k}_3`, side(cutF, [0, 1], 26)]]);
  };

  // ---- far legs (behind the body)
  leg('hf', true); leg('ff', true);

  // ---- tail: hanging plumb from the tail head, a wet switch tangled with kelp
  f.bone('tail');
  const tl = V.spline([[334, 282], [306, 330], [296, 430], [300, 560], [304, 660]], 6);
  f.part(V.ribbon(tl, t => 30 - t * 18), HD({ cast: false }));
  hairMass(f, [[304, 640], [308, 700], [302, 760], [310, 810]], [24, 30, 26, 16], { fill: '#2a2c30', shadow: '#0a0a0c', shade: 0.4, tex: 'hatch' + s, texOp: 0.3 }, { tips: 5, tipL: 40, lit: '#6a6e72' });
  V.kelpHang(f, [306, 720], 90, 8, 8); V.kelpHang(f, [300, 680], 60, 6, -6); V.drip(f, [310, 860], 1.3);

  // ---- the body: hooks and pins jutting (gaunt), a dipped back, a deep ribcage, the flank hollow, the belly sagging
  // with water; cut at the loin
  const body = [[334, 286], [348, 262, 1], [372, 270], [404, 262], [440, 226, 1], [470, 240], [520, 262], [600, 284], [700, 300], [800, 296], [880, 272], [940, 238], [980, 222], [1012, 240], [1090, 360], [1132, 470], [1126, 580], [1090, 664], [1020, 716], [920, 752], [800, 764], [690, 748], [600, 708], [548, 664], [500, 650], [430, 626], [360, 570], [318, 470], [306, 380], [314, 306]]; // the pin bones and the hook bone jut from the croup, the spine sags, the withers rise
  split(f, () => {
    f.part(body, HD({ tex: 'wrinkle' + s, texOp: 0.35 }));
    V.clipDraw(f, body, () => {
      f.flat([[560, 660], [700, 700], [900, 700], [1090, 640], [1100, 760], [560, 760]], '#0c0e14', { op: 0.35 }); // the belly turning under
      f.flat([[520, 290], [590, 300], [620, 420], [590, 560], [530, 520], [500, 400]], '#0c0e14', { op: 0.3 }); // the hollow of the flank
      { const r3 = E.rng(6241); let x0 = 330; while (x0 < 1110) { const top = x0 < 540 ? 300 : 316, bot = x0 < 540 ? 620 : 756, t0 = 0.4 + r3() * 0.2, bw = x0 < 540 ? 22 : 30, ya = top + (bot - top) * t0; f.line([[x0 + bw * 0.9, ya], [x0 + bw, (ya + bot) / 2], [x0 + bw * 0.5, bot - 10]], 1.2, INK, { op: 0.42 }); if (r3() > 0.6) f.line([[x0 + bw * 0.4, top + (bot - top) * 0.12], [x0 + bw * 0.7, top + (bot - top) * (0.2 + r3() * 0.12)]], 1.1, INK, { op: 0.3 }); x0 += 12 + r3() * 26; } } // hatching that wraps round the barrel and haunch
      for (let i = 0; i < 14; i++) f.flat(lumpE(f, [360 + f.r() * 720, 320 + f.r() * 380], 20 + f.r() * 40, 12 + f.r() * 24, f.r() * 3, 0.5), f.r() > 0.5 ? '#2a2622' : '#6a6256', { op: 0.25 }); // mottled patches in the coat
      for (let i = 0; i < 16; i++) { const x0 = 560 + i * 26 + f.r() * 10, y0 = 520 + f.r() * 30; f.line([[x0, y0], [x0 + 2, y0 + 50 + f.r() * 60], [x0 - 1, y0 + 90 + f.r() * 90]], 1.6, '#c8d0d4', { op: 0.35 }); } // wet streaks running down from the blanket
      for (let i = 0; i < 8; i++) { const x0 = 690 + i * 36; f.stroke([[x0 + 10, 470], [x0 + 18, 560], [x0 + 8, 650 - i * 4]], 12, '#0e1014', { op: 0.32 }); f.stroke([[x0 + 26, 476], [x0 + 34, 560], [x0 + 26, 640 - i * 4]], 5, '#958d7e', { op: 0.3 }); } // ribs standing out under the slack hide, a valley and a lit ridge each
      f.flat([[320, 480], [520, 560], [800, 620], [1120, 560], [1120, 760], [320, 760]], '#0c0e14', { op: 0.22 }); f.flat(ell([1050, 420], 70, 120, 0.2, 14), '#b0a898', { op: 0.08 }); f.flat(ell([430, 330], 90, 80, 0, 14), '#b0a898', { op: 0.08 }); // the barrel turning under; the lit shoulder and haunch
      groove([[940, 260], [990, 350], [1060, 470]], 3.4, 0.6); f.line([[960, 262], [1004, 350]], 1.4, '#958d80', { op: 0.4 }); // the shoulder blade's spine
      groove([[436, 236], [480, 320], [520, 400]], 3, 0.5); f.flat(ell([444, 246], 32, 22, 0.3, 12), '#a09888', { op: 0.36 }); f.stroke([[420, 262], [444, 232], [470, 248]], 2.6, '#0e1014', { op: 0.6 }); groove([[400, 268], [430, 300], [470, 300], [500, 280]], 2.4, 0.5); // the hook bone jutting, the hollow under it
      f.flat(ell([352, 270], 16, 14, 0, 10), '#a09888', { op: 0.4 }); f.stroke([[336, 290], [350, 264], [370, 274]], 2.4, '#0e1014', { op: 0.6 }); // the pin bone
      f.stroke([[520, 268], [620, 292], [720, 304], [820, 298]], 2.4, '#0e1014', { op: 0.45 }); // the sag of the spine's line
      f.flat(ell([322, 312], 16, 22, 0, 10), '#968e80', { op: 0.28 }); groove([[330, 330], [340, 420], [360, 520]], 2.4, 0.45); // the pin bone, the thigh's lean back edge
      for (const [c, a2] of [[[800, 400], 1.6], [[620, 380], 1.3], [[1050, 520], 1.7], [[420, 420], 1.5], [[900, 640], 1.4]]) hair(c, 80, 60, a2, 22);
      V.saltCrust(f, [780, 680], 120, 30, 20);
      for (let i = 0; i < 3; i++) f.stroke([[620 + i * 60, 690 + i * 10], [700 + i * 60, 714 + i * 8], [780 + i * 60, 716]], 2, '#0e1014', { op: 0.4 }); // sagging folds of wet hide on the belly
    });
  }, [['spine_1', side([620, 420], [-1, 0], 80)], ['spine_2', side([620, 420], [1, 0], 80)]]);
  // the udder, swollen with water, teats, before the hind legs
  f.bone('spine_1');
  f.part([[540, 662], [600, 676], [640, 706], [634, 760], [596, 782], [548, 772], [526, 730]], PALE({ fill: '#8e8680', shade: 0.42 }));
  for (const [x, l] of [[552, 30], [580, 34], [610, 28]]) f.part(limb([x, 764], [x + 2, 764 + l], 16, 11, { steps: 4 }), PALE({ fill: '#867e78', cast: false, inkW: 1.2 }));
  V.veins(f, [586, 716], 30, 20, 4); V.drip(f, [582, 806], 1.2);
  // the brand on the hip: an old burned mark, raised and pale
  { const q = [404, 380]; for (const l of [[[-18, -18], [18, 18]], [[-18, 18], [18, -18]], [[-22, 0], [22, 0]]]) { f.line(l.map(p2 => add(q, p2)), 7, '#2a2a2e', { op: 0.7 }); f.line(l.map(p2 => add(q, p2)), 2.6, '#b8bcbc', { op: 0.7 }); } f.line(ell(q, 30, 30, 0, 18).concat([ell(q, 30, 30, 0, 18)[0]]), 4, '#2a2a2e', { op: 0.6 }); }
  // the hair along the spine standing in a stiff ridge
  f.bone('spine_1'); V.standingHair(f, [[344, 278], [380, 262], [420, 248], [460, 246], [500, 252], [540, 258]], 24, { col: '#2a2622', w: 3, fan: 0.4, lean: -0.3 });
  f.bone('spine_2'); V.standingHair(f, [[880, 254], [920, 244], [960, 236], [996, 242]], 26, { col: '#2a2622', w: 3, fan: 0.4, lean: 0.2 });

  // ---- the soaked sackcloth blanket over the back: following the back's line, sagging down the barrel in a ragged wet
  // hem, pulled lower at its corners; a rope surcingle round the barrel
  f.bone('blanket');
  const hemB = []; { let x = 974; const r2 = E.rng(624 * 7); while (x > 572) { const st = 14 + r2() * 34, d2 = r2(); const y = 488 + (x - 572) * 0.04 + (d2 > 0.8 ? 70 + r2() * 50 : d2 > 0.5 ? 30 + r2() * 30 : r2() * 26); hemB.push(d2 > 0.6 ? [x, y, 1] : [x, y]); if (d2 > 0.8) hemB.push([x - 6, y - 40 - r2() * 20]); x -= st; } }
  const bl = [[560, 268], [700, 292], [840, 286], [930, 246], [966, 262], [984, 360], [978, 480], ...hemB, [572, 470], [562, 380]]; // a ragged, uneven, sodden hem with long tatters
  f.part(bl, { fill: '#6c685a', shadow: '#22201a', light: '#9a9686', shade: 0.42, tex: 'weave' + s, texOp: 0.7 });
  V.clipDraw(f, bl, () => {
    for (const [x, sw] of [[600, -8], [680, 4], [760, -6], [840, 6], [920, -4]]) { f.stroke([[x, 268], [x + sw, 380], [x - sw, 510]], 3, '#16140f', { op: 0.6 }); f.line([[x + 6, 272], [x + 6 + sw, 380], [x + 6 - sw, 500]], 1.4, '#a8a494', { op: 0.4 }); } // folds dragged down by the water
    f.flat([[560, 420], [990, 410], [990, 560], [560, 560]], '#14141a', { op: 0.32 }); // soaked dark lower half
    f.flat(ell([790, 330], 200, 50, 0, 16), '#ffffff', { op: 0.06 }); // the round of the back under it
  });
  for (const q of hemB.filter(q => q[1] > 540).slice(0, 6)) V.drip(f, add(q, [0, 4]), 1.4); for (const [x, y] of [[700, 360], [820, 420], [640, 440]]) { f.line([[x, y], [x + 14, y + 12], [x + 6, y + 30]], 1.6, '#16140f'); f.line([[x + 3, y], [x + 17, y + 12]], 1, '#a8a494', { op: 0.6 }); } // tears in the sacking
  f.part([[700, 330], [760, 326], [764, 380], [702, 386]], { fill: '#5a5648', sharp: true, inkW: 1.2, tex: 'weave' + s }); f.stitches([[700, 330], [760, 326], [764, 380], [702, 386], [700, 330]], P.bone, 1);
  V.saltCrust(f, [760, 300], 140, 30, 20); V.scorch(f, [940, 290], 30, 20, 0.45);
  for (const q of hemB.filter((_, i) => i % 3 === 0)) { f.line([q, add(q, [-3, 14]), add(q, [1, 26])], 1.1, '#a8a494', { op: 0.75 }); } // frayed threads hanging from the hem
  V.rope(f, [[870, 248], [876, 360], [884, 470], [900, 580], [912, 680], [920, 730]], 9, { col: '#5a4e3c' });
  // burns from the horns down the neck reach the shoulders
  f.bone('spine_2'); V.lichtenberg(f, [1060, 300], deg(105), 180, 2.8, { depth: 3, fork: 0.7, col: '#24262c', lite: '#c8ccce' });
  V.lichtenberg(f, [1100, 420], deg(80), 120, 2.2, { depth: 2, col: '#24262c', lite: '#c8ccce' });

  // ---- neck: thin, carried low from the withers, the dewlap hanging slack from the throat to the brisket
  f.bone('neck');
  const neck = [[960, 236], [1040, 250], [1130, 300], [1210, 370], [1270, 450], [1312, 540], [1296, 640], [1258, 720], [1200, 740], [1150, 724], [1120, 660], [1110, 560], [1060, 430], [990, 330]];
  f.part(neck, HD({ tex: 'wrinkle' + s, texOp: 0.45 }));
  const dew = [[1250, 720], [1210, 760], [1170, 790], [1140, 780], [1124, 720], [1116, 640], [1124, 580], [1150, 640], [1190, 700]];
  f.part(dew, HD({ fill: mix(hide, '#8a8274', 0.2), cast: false, tex: 'wrinkle' + s, texOp: 0.6 }));
  for (let i = 0; i < 5; i++) f.line([[1130 + i * 6, 620 + i * 30], [1170 + i * 12, 660 + i * 26], [1200 + i * 6, 700 + i * 16]], 1.1, INK, { op: 0.45 });
  V.clipDraw(f, neck, () => { groove([[1010, 290], [1130, 360], [1250, 470]], 2.6, 0.5); groove([[1070, 440], [1170, 540], [1250, 640]], 2.4, 0.45); f.flat([[1120, 600], [1220, 640], [1280, 600], [1300, 700], [1140, 740]], '#0c0e14', { op: 0.3 }); hair([1150, 430], 80, 60, 0.9, 24); for (let i = 0; i < 4; i++) f.stroke([[1060 + i * 40, 300 + i * 40], [1040 + i * 44, 360 + i * 44], [1060 + i * 40, 420 + i * 40]], 1.8, '#0e1014', { op: 0.35 }); }); // folds of slack hide
  V.lichtenberg(f, [1290, 520], deg(200), 220, 3, { depth: 3, fork: 0.75, col: '#24262c', lite: '#c8ccce' });
  V.lichtenberg(f, [1300, 600], deg(165), 150, 2.4, { depth: 2, col: '#24262c', lite: '#c8ccce' });
  V.standingHair(f, [[1040, 254], [1080, 268], [1120, 290], [1160, 318], [1200, 350], [1240, 392]], 24, { col: '#2a2622', w: 2.8, fan: 0.4, lean: 0.7 });
  // the bell: a leather strap round the neck, an iron cow bell hanging at the throat
  f.bone('bell');
  { const st = [[1214, 380], [1192, 430], [1172, 490], [1160, 550], [1168, 604], [1188, 640]]; f.stroke(st, 18, INK); f.stroke(st, 14, '#3a2c20'); f.line(st.map(q => add(q, [-4, 0])), 1.2, '#6a5444', { op: 0.6 }); f.part(ell([1170, 494], 10, 13, 0.2, 10), V.IR(f, { inkW: 1.1, cast: false }));
    const bc = [1196, 690]; f.part([add(bc, [-24, -40]), add(bc, [22, -42]), add(bc, [30, 32]), add(bc, [-28, 36])], V.IR(f, { inkW: 1.5 })); f.flat(ell(add(bc, [1, 34]), 29, 8, 0, 12), '#060606'); f.part(ell(add(bc, [4, 44]), 7, 7, 0, 8), V.IR(f, { inkW: 1, cast: false })); f.flat(ell(add(bc, [-10, -10]), 4, 16, 0, 8), P.rust, { op: 0.6 }); V.verdigris(f, add(bc, [8, 10]), 10, 10, 3); V.lichtenberg(f, add(bc, [-4, -34]), deg(80), 44, 1.4, { metal: true, depth: 1 }); }

  // ---- head: a cow's head carried low, long and heavy: the broad flat forehead, the deep round jaw, the wide wet muzzle;
  // the eye rolled white with fear; a rope halter with the lead trailing
  f.bone('head');
  const skull = HF([[-30, -34], [10, -44], [80, -42], [160, -36], [230, -36], [280, -32], [312, -10], [324, 40], [318, 96], [292, 116], [244, 112], [196, 106], [130, 124], [76, 146], [24, 146], [-18, 120], [-40, 70], [-44, 10]]);
  f.part(skull, HD({ tex: 'wrinkle' + s, texOp: 0.4 }));
  V.clipDraw(f, skull, () => {
    f.flat(HF([[-40, 60], [40, 90], [150, 100], [210, 100], [190, 130], [60, 170], [-50, 140]]), '#0c0e14', { op: 0.38 }); // the jaw's underside in shadow
    f.flat(HF([[20, -36], [200, -30], [200, -6], [20, -10]]), '#b0a898', { op: 0.1 }); // the lit flat of the forehead
    f.flat(HF(ell([70, 20], 46, 30, 0, 14)), '#0c0e14', { op: 0.22 }); // the eye's socket
    V.lichtenberg(f, HF([[0, -20]])[0], hA + 0.05, 250, 3, { depth: 3, fork: 0.8, col: '#24262c', lite: '#d0d4d2' });
    V.lichtenberg(f, HF([[10, 0]])[0], hA + 0.55, 170, 2.4, { depth: 2, col: '#24262c', lite: '#d0d4d2' });
    hair(HF([[150, 40]])[0], 60, 40, hA, 18);
  });
  groove(HF([[-30, 90], [40, 130], [110, 120], [180, 104]]), 3, 0.6); groove(HF([[60, 50], [100, 80], [120, 110]]), 2.4, 0.45); groove(HF([[150, -30], [200, 0], [250, 20]]), 1.6, 0.35); // the jaw's edge, the cheek muscle, the bridge
  // the eye, rolled white: a bulging orb, the iris rolled down under the lower lid, wrinkled lids, a wet tear streak
  
  f.part(HF([[30, -14], [60, -34], [100, -30], [118, -10], [80, -6], [40, 4]]), HD({ cast: true, castOp: 0.6, inkW: 1.4 })); // the brow ridge overhanging the eye
  f.flat(HF(ell([72, 14], 26, 17, 0, 14)), '#0a0c10', { op: 0.75 }); // the deep socket
  const eyeO = HF([[50, 14], [62, 4], [80, 2], [96, 10], [92, 22], [74, 26], [58, 24]]);
  f.part(eyeO, { fill: '#1c1612', shadow: '#060404', light: '#4a3a30', shade: 0.3, inkW: 1.4, cast: false, hatch: false }); // the dark bovine eye
  f.flat(HF([[50, 14], [58, 8], [60, 20]]), '#d8d4c8', { op: 0.85 }); // a crescent of white showing at the back corner: fear
  f.flat(HF(ell([82, 9], 3.4, 2.2, 0, 6)), '#e8ecee', { op: 0.85 }); // a wet highlight
  f.part(HF([[46, 10], [62, -2], [82, -4], [100, 6], [96, 10], [80, 4], [62, 6], [50, 14]]), HD({ cast: false, inkW: 1.2, shade: 0.3 })); // the upper lid
  f.line(HF([[54, 26], [74, 30], [94, 22]]), 1.4, INK, { op: 0.6 }); f.line(HF([[46, 34], [74, 40], [100, 30]]), 1.1, INK, { op: 0.45 }); // lower lid folds
  for (let i = 0; i < 5; i++) f.line(HF([[98 + i * 2, 4 + i * 4], [104 + i * 3, 2 + i * 5]]), 1.1, '#1a1a1c', { op: 0.7 }); // lashes
  for (let i = 0; i < 3; i++) f.line(HF([[40 - i * 8, 10 + i * 8], [26 - i * 8, 4 + i * 10]]), 1, INK, { op: 0.5 });
  f.stroke(HF([[96, 30], [130, 50], [170, 56]]), 4, '#141820', { op: 0.5 });
  // the muzzle: broad and bare, the nostril flared, wet, dripping
  const mz = HF([[254, -34], [302, -28], [322, 0], [328, 50], [320, 100], [290, 118], [258, 90], [246, 30]]);
  f.part(mz, HD({ fill: '#38332e', light: '#655e54', cast: false, tex: 'pit' + s, texOp: 0.5 }));
  f.part(HF(ell([304, 20], 17, 12, 0.6, 12)), { fill: '#121216', shade: 0.3, inkW: 1.4, cast: false }); f.line(HF([[288, 12], [312, 10], [322, 26]]), 1.4, '#c8ccce', { op: 0.6 });
  f.line(HF([[296, 88], [320, 86]]), 2.2, INK); for (let i = 0; i < 6; i++) f.flat(ell(HF([[270 + (i % 3) * 14, -6 + Math.floor(i / 3) * 18]])[0], 2.2, 2.2, 0, 6), '#e0e4e2', { op: 0.6 });
  V.drip(f, HF([[318, 96]])[0], 1.6); V.drip(f, HF([[296, 104]])[0], 1.2);
  // the halter: noseband, cheek piece, poll strap; the lead rope trailing to the ground
  const hl = c => V.rope(f, c, 8, { col: '#6a5c44' });
  hl(HF([[230, -40], [240, 40], [232, 112]])); hl(HF([[238, 76], [150, 92], [60, 82], [-6, 50], [-24, -30]]));
  const ring = HF([[232, 116]])[0]; f.line(ell(ring, 9, 9, 0, 10).concat([ell(ring, 9, 9, 0, 10)[0]]), 4, INK); f.line(ell(ring, 9, 9, 0, 10).concat([ell(ring, 9, 9, 0, 10)[0]]), 2.4, P.ironL);
  V.rope(f, [ring, add(ring, [-6, 60]), add(ring, [-26, 120]), add(ring, [-14, 180]), [ring[0] + 30, gy - 4], [ring[0] + 120, gy - 2]], 7, { col: '#5a4e3c', fray: true });
  // ---- the ear, sticking out sideways below the horn, the tag torn half away
  f.bone('ear');
  { const e0 = HF([[-10, 40]])[0], E2 = frame(e0, deg(200), 1); f.part(E2([[0, -10], [34, -16], [70, -16], [94, -8], [100, 4], [86, 12], [44, 14], [0, 10]]), HD({ cast: false, fill: mix(hide, '#fff', 0.1) })); f.flat(E2([[20, -2], [80, -8], [88, 2], [74, 6], [26, 5]]), '#4a3e40', { op: 0.3 }); f.line(E2([[10, 0], [80, -2]]), 1, INK, { op: 0.5 }); f.flat(E2([[84, -16], [94, -6], [86, -2]]), '#0c0c0e');
    f.part(E2([[50, 12], [64, 12], [66, 36], [58, 42], [50, 34]]), { fill: '#a8a294', shadow: '#5a5448', shade: 0.35, inkW: 1, cast: false }); f.line(E2([[50, 34], [58, 32]]), 1, INK); } // the ear, the tag torn half away

  // ---- the horns: scorched black and split, rising from the poll; the lantern lashed between them, its frame fused
  const hornAt = (ctrl, w) => { const C = V.spline(ctrl, 4), S2 = V.arcLen(C), L2 = S2[S2.length - 1]; const out = V.ribbon(C, t => w * (1 - t * 0.82) + 2); f.part(out, { fill: '#1c1a1a', shadow: '#060505', light: '#4c4846', shade: 0.4, tex: 'pit' + s, texOp: 0.5, inkW: 1.5 }); for (let i = 1; i < 6; i++) { const at = V.at(C, S2, L2 * i / 7); f.line([add(at.p, mul(at.n, w * 0.45 * (1 - i / 7))), add(at.p, mul(at.n, -w * 0.45 * (1 - i / 7)))], 1, '#6a6460', { op: 0.55 }); } f.line(C.slice(2, Math.floor(C.length * 0.7)).map(q => add(q, [2, 1])), 2, '#a8a29a', { op: 0.35 }); return C; };
  const hb = add(POLL, [0, 0]);
  f.bone('head'); hornAt([add(hb, [-14, 4]), add(hb, [-62, -40]), add(hb, [-78, -112]), add(hb, [-58, -180])], 30); // far horn: the two sweep out in a lyre and flank the lantern
  // the lantern: a tin storm lantern sat on the poll, lashed with tarred rope, its frame fused to both horns
  f.bone('lantern');
  const lt = add(hb, [10, -262]); paleLamp(f, lt, 190);
  const gl = add(lt, [0, 118]); f.line([add(gl, [-10, -20]), add(gl, [4, -2]), add(gl, [-2, 12]), add(gl, [12, 26])], 1.6, INK); f.line([add(gl, [4, -2]), add(gl, [18, -6])], 1.2, INK); // cracked glass
  for (const [a2, b2] of [[add(hb, [-66, -70]), add(lt, [-48, 172])], [add(hb, [80, -70]), add(lt, [54, 172])], [add(hb, [-66, -160]), add(lt, [-26, 84])], [add(hb, [78, -160]), add(lt, [30, 84])]]) { V.rope(f, [a2, lerp(a2, b2, 0.5), b2], 6, { col: '#2e2820' }); V.rope(f, [add(a2, [4, 14]), add(lerp(a2, b2, 0.5), [4, 12]), add(b2, [2, 12])], 6, { col: '#2e2820' }); }
  f.bone('head');
  const nh = [add(hb, [14, 6]), add(hb, [72, -36]), add(hb, [90, -112]), add(hb, [70, -182])];
  hornAt(nh, 34); // near horn, in front of the lantern's base
  f.flat([add(hb, [70, -44]), add(hb, [88, -100]), add(hb, [83, -102]), add(hb, [65, -47])], '#000'); f.line([add(hb, [67, -48]), add(hb, [84, -98])], 1, '#8a8478', { op: 0.6 }); // the split
  V.weld(f, add(hb, [-66, -122]), deg(-60), 16, { burns: [] }); V.weld(f, add(hb, [80, -122]), deg(60), 16, { burns: [] }); // the frame fused to each horn
  V.fusedRun(f, add(hb, [78, -110]), 24, 4, P.ironL);
  V.lichtenberg(f, add(hb, [36, -30]), deg(-75), 70, 1.6, { metal: true, depth: 2 });

  // ---- near legs, in front; the hobble chained between the forelegs
  leg('hn', false); leg('fn', false);
  f.bone('leg_fn_2');
  { const a = [LEG.fn.F[0] + 4, LEG.fn.F[1] - 50], b = [LEG.ff.F[0] + 4, LEG.ff.F[1] - 50]; for (const q of [a, b]) { f.part([add(q, [-32, -12]), add(q, [32, -16]), add(q, [32, 12]), add(q, [-32, 16])], { fill: '#3a2a1e', shadow: '#120a06', shade: 0.4, inkW: 1.3, tex: 'mottle' + s }); f.part([add(q, [-6, -10]), add(q, [8, -10]), add(q, [8, 10]), add(q, [-6, 10])], V.IR(f, { sharp: true, inkW: 1, cast: false })); } V.chainLinks(f, [add(a, [-30, 6]), add(lerp(a, b, 0.5), [0, 14]), add(b, [30, 6])], 13, P.iron); }
  f.bone('root');
  for (const L of Object.values(LEG)) f.flat(ell(add(L.T, [10, 2]), 80, 7, 0, 12), '#3a4448', { op: 0.45 });
  return f;
}

// ------------------------------------------------------------------ THE STRAND-WIFE (elite, 1.9)
// A wrecker's widow who stripped the drowned on the beach after each wreck. Tall, gaunt and long-armed, walking forward
// and leaning against the drag: the far hand hauls a drowned sailor behind her on a boat hook through his collar, the
// pole running back from the fist in line with the straining arm; the near (in-game right) arm is held out forward, the
// hand a fused knot of rings: dozens of the drowned's rings welded by a strike into one scorched, knuckled mass of metal,
// branching scars running up the arm from it. Her hair stands in a stiff grey fan. Soaked, the layers sagging,
// barnacles at the ankles. Layers of the dead's clothes: a sailor's striped shirt, a merchant's long coat, an officer's
// waistcoat over both; a necklace of ship's buttons; an officer's hat jammed over her headscarf; a sack of salvage on her
// back with a boot sticking out; a short knife for fingers; a pair of boots tied round her neck; sea boots too big.
// The corpse: a bloated sailor stripped to his shirt, hooked by the collar, his shoulders lifted, his legs dragging.
// True size wins: the canvas is widened at the same scale for the corpse.
// Rig: standard humanoid + hook (parent hand_f) > corpse (pivot at the collar) > corpse_legs; coat_skirt (pelvis);
// sack and neck_boots (torso). Motion: idle going through the drowned man's pockets (torso bends, near arm); attack a
// blow of the ringed fist (near arm) that discharges into a hero.
function strandWife() {
  const CW = 1600, CH = TIERS.elite[1], f = new Fig(V.base(623, CH)); V.textures(f);
  const H = 178, gy = f.o.groundY, s = '623';
  const skin = '#aca290', skinS = '#4a4250';
  const SKN = (o = {}) => V.SK(f, Object.assign({ fill: skin, shadow: skinS }, o));
  const coatC = '#4a4a46', coatL = '#6e6e68', vestC = '#5a5650', stripeA = '#3c4a5a';
  const CT = (o = {}) => Object.assign({ fill: coatC, shadow: '#141414', light: coatL, shade: 0.42, tex: 'weave' + s, texOp: 0.45 }, o);
  f.defs.push(`<pattern id="stripe${s}" patternUnits="userSpaceOnUse" width="40" height="26" patternTransform="rotate(-14)"><rect width="40" height="11" fill="${stripeA}"/></pattern>`);
  const ST = (o = {}) => Object.assign({ fill: '#a4a49c', shadow: '#3e4250', shade: 0.4, tex: 'weave' + s, texOp: 0.4, over: `<rect x="0" y="0" width="1600" height="1400" fill="url(#stripe${s})" opacity="0.8"/>` }, o);
  const N = [1066, 452], C = [990, 630], PV = [904, 812];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.12, 0.12), SF = S.at(0.42, 0.06);
  const EN = [1118, 640], WN = [1250, 650];
  const EF = [900, 646], WF = [744, 786];
  const HN = S.at(0.1, 1.0), KN = [1000, 1060], AN = [1020, 1290];
  const HF = S.at(-0.2, 0.98), KF = [862, 1066], AF = [764, 1284];
  const HC = [1136, 340], hA = 0.24, hF = frame(HC, hA, H);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [1072, 446], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  // the boat hook runs back from the far fist, in line with the arm, down to the corpse's collar
  const collar = [520, 1126], pA = ang(WF, collar), pB = add(WF, rot([60, 0], pA + Math.PI));
  const hips = [300, 1290];
  f.joint('hook', WF, 'hand_f').joint('corpse', collar, 'hook').joint('corpse_legs', hips, 'corpse').joint('coat_skirt', S.at(0, 0.92), 'pelvis').joint('sack', S.at(-0.7, 0.2), 'torso').joint('neck_boots', S.at(0.3, 0.05), 'torso');

  // ---- the corpse (consistency pass 2026-11-25; it was a smooth striped tube): a bloated drowned sailor dragged on his
  // back by the collar, the striped shirt rucked up by the hook over a swollen belly, his legs bound in a torn sailcloth
  // shroud with rope turns, bare swollen feet sticking out of it, one arm flopped back over his head onto the sand.
  // The old corpse code still runs into a discarded buffer first so the random stream (and so every later part of the
  // Strand-Wife) stays exactly as reviewed; the new corpse draws from its own stream.
  const DS = (o = {}) => V.DR(f, o);
  { const keep = f.out; f.out = [];
    for (const [hp, kn, an, tone] of [[[320, 1280], [180, 1320], [50, 1336], 0.2], [[300, 1300], [160, 1346], [30, 1352], 0]]) {
      f.part(K.chain([hp, kn, an], [96, 72, 52], { steps: 8, bp: [[0, 0.4, 0.1]], bq: [[1, 0.3, 0.12]] }), DS({ fill: mix(P.drown, P.drownS, tone) }));
      f.line([lp(hp, kn, 0.2, 10), lp(hp, kn, 0.9, 8)], 1.4, P.drownL, { op: 0.5 }); V.livid(f, lerp(kn, an, 0.4), 30, 10, 6); V.veins(f, lerp(hp, kn, 0.5), 30, 12, 4);
      const ft = add(an, [-30, -10]); f.part([add(ft, [30, -24]), add(ft, [-20, -30]), add(ft, [-44, -10]), add(ft, [-40, 14]), add(ft, [24, 22])], DS({ fill: mix(P.drown, P.drownS, tone + 0.1), inkW: 1.3 })); // a bare swollen foot, toes up
      for (let i = 0; i < 4; i++) f.flat(ell(add(ft, [-40, -24 + i * 10]), 6, 5, 0, 8), mix(P.drown, P.drownS, 0.3));
    }
    V.barnacles(f, [180, 1320], 30, 10, 6, 3, 6); V.kelpHang(f, [240, 1300], 50, 6, 4);
    // the shirt: a striped sailor's shirt dragged up over the bloated belly, torn
    const shirt = [[560, 1090], [600, 1130], [580, 1190], [500, 1250], [400, 1296], [300, 1316], [260, 1280], [300, 1230], [400, 1170], [480, 1110]];
    f.part([[540, 1110], [560, 1160], [470, 1250], [380, 1300], [290, 1320], [260, 1290], [330, 1250], [440, 1180]], DS({ shade: 0.36 })); // the body under it
    f.part(shirt.map((q, i) => i > 3 && i < 7 && i % 2 ? [...q, 1] : q), ST({ shadow: '#3a3e4a' }));
    f.part([[420, 1250], [470, 1236], [500, 1262], [440, 1290], [400, 1290]], DS({ inkW: 1.3, cast: false })); V.livid(f, [450, 1268], 30, 12, 6); // the bloated belly bulging out of a tear
    for (const [a2, b2] of [[[540, 1130], [440, 1200]], [[500, 1200], [380, 1260]]]) f.stroke([a2, lerp(a2, b2, 0.5), b2], 2.6);
    // the arms flopped back over the head, dragging
    f.part(K.chain([[560, 1124], [640, 1190], [700, 1260]], [56, 48, 40], { steps: 6 }), ST({ shadow: '#3a3e4a' }));
    f.part(K.chain([[690, 1250], [740, 1300], [780, 1330]], [40, 36, 30], { steps: 6 }), DS());
    V.openHand(f, [778, 1330], deg(30), 70, { look: DS({ fill: mix(P.drown, P.drownS, 0.1) }), back: true, curl: 0.4, swell: 0.6, spread: 0.2 });
    // the head lolling back off the shoulders, mouth open, water running out; the hook through the collar behind the neck
    const ch = [584, 1086], chF = frame(ch, deg(150), 92);
    f.part(K.chain([[548, 1118], [578, 1100]], [60, 56], { steps: 4 }), DS());
    B.head(f, ch, 92, deg(150), { skin: P.drown, jaw: 1.4, chin: -0.04, nose: 1.0, mouth: 'set', squint: 0.6, browDown: 0.05, faceShade: 0.75, faceHatch: false, jawShade: 0.3, iris: '#c8cec6', eyeWhite: '#e4e6de', hairCol: '#2a2c22', beard: 'stubble', beardCol: '#3a3a32' });
    f.flat(chF([[0.17, 0.26], [0.3, 0.26], [0.3, 0.38], [0.2, 0.4]]), '#0c1012'); f.flat(chF(ell([0.24, 0.4], 0.03, 0.05, 0, 6)), P.drip, { op: 0.9 });
    V.livid(f, chF([[0.0, 0.1]])[0], 12, 10, 4); V.kelpHang(f, chF([[-0.3, -0.3]])[0], 60, 6, 2);
    for (const [q, L3, w3] of [[[0.06, -0.46], 46, 12], [[-0.12, -0.5], 58, 14], [[-0.3, -0.42], 40, 11], [[-0.42, -0.24], 30, 9]]) { const r0 = chF([q])[0]; f.stroke([r0, add(r0, [-2, L3 * 0.5]), add(r0, [3, L3])], w3, '#1e2018'); f.line([add(r0, [2, 4]), add(r0, [1, L3 * 0.6])], 1.2, '#5a5e52', { op: 0.6 }); } // wet hair hanging plumb from the lolling skull to the sand
    V.kelpHang(f, chF([[0.2, -0.4]])[0], 40, 5, 2);
    f.flat(ell([600, 1150], 140, 10, 0, 14), '#3a4448', { op: 0.4 }); f.flat(ell([300, gy + 2], 260, 9, 0, 16), '#3a4448', { op: 0.4 }); // the wet drag mark on the sand
    for (let i = 0; i < 6; i++) f.line([[120 + i * 70, 1360 + (i % 2) * 4], [170 + i * 70, 1358]], 2, '#1a1c1e', { op: 0.4 });


    f.out = keep; }
  const frMain = f.r; f.r = E.rng(6231);
  { const Hp = [300, 1300], Sh = [540, 1132], ax = sub(Sh, Hp), Lx = E.len(ax), d = E.norm(ax), nv = [d[1], -d[0]]; // nv: up off the sand (belly side)
    const T = (u, v) => add(add(Hp, mul(d, u * Lx)), mul(nv, v));
    const skinD = mix(P.drown, P.drownS, 0.25), sailC = '#9a968a', sailS = '#3e4048', rope = '#6a5e48';
    const SL = (o = {}) => Object.assign({ fill: sailC, shadow: sailS, light: '#c4c0b2', shade: 0.42, tex: 'weave' + s, texOp: 0.55, maxShade: 26 }, o);
    // -- the legs in their shroud (bone corpse_legs): one bundle of sailcloth round both legs, thick at the hips, the
    // knees pushing through, narrowing to the ankles; wound in a spiral, torn strips trailing, four rope turns biting in
    f.bone('corpse_legs');
    const kn = [172, 1316], an = [66, 1336];
    for (const [ft, tone, rot0] of [[[30, 1318], 0.15, -0.3], [[44, 1342], 0, 0.15]]) { // the bare feet sticking out of the shroud, toes up, swollen
      const F = frame(ft, Math.PI + rot0, 1);
      const foot = F([[-30, -14], [-6, -22], [18, -30], [34, -22], [38, -4], [30, 14], [6, 18], [-24, 14], [-34, 0]]);
      f.part(foot, DS({ fill: mix(P.drown, P.drownS, tone), inkW: 1.3, maxShade: 10 }));
      for (let i = 0; i < 5; i++) { const q = F([[30 + (i === 0 ? 4 : 0), -22 + i * 8]])[0]; f.part(ell(q, i === 0 ? 7 : 5.4, i === 0 ? 6 : 4.4, Math.PI + rot0, 8), DS({ fill: mix(P.drown, P.drownS, tone + 0.08), inkW: 0.9, cast: false, maxShade: 4 })); f.flat(ell(add(q, rot([2, 0], Math.PI + rot0)), 2, 1.6, 0, 6), '#4a4a62', { op: 0.7 }); } // toes, the nails gone dark
      f.line(F([[-20, 10], [0, 14], [20, 10]]), 1, P.drownS, { op: 0.6 }); for (let i = 0; i < 3; i++) f.line(F([[-14 + i * 10, -12], [-10 + i * 10, 6]]), 0.9, P.drownS, { op: 0.45 }); // the sole puckered by the water
    }
    const shr = [[330, 1236], [262, 1250], [206, 1270], [170, 1278], [130, 1290], [90, 1300], [60, 1306], [50, 1330], [62, 1360], [110, 1362], [170, 1360], [230, 1362], [300, 1358], [348, 1340], [364, 1290]];
    f.part(shr, SL());
    { const id = f.id('cs'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(shr, true)}"/></clipPath>`); const i0 = f.out.length;
      f.flat([[60, 1340], [364, 1330], [364, 1380], [60, 1380]], '#000', { op: 0.3 }); // the underside on the sand
      f.flat([[150, 1270], [200, 1262], [210, 1300], [150, 1310]], '#e2ded0', { op: 0.3 }); // the knee pushing up through the cloth
      for (let i = 0; i < 7; i++) { const x = 90 + i * 40 + f.r() * 10; f.stroke([[x, 1300], [x + 22, 1322], [x + 30, 1360]], 3, '#2a2c32', { op: 0.5 }); f.line([[x - 3, 1300], [x + 19, 1320], [x + 27, 1356]], 1.2, '#d8d4c6', { op: 0.5 }); } // the spiral wind of the cloth
      for (const [c, r] of [[[240, 1300], 22], [[110, 1330], 16]]) { f.flat(ell(c, r, r * 0.6, 0.3, 10), '#6a6658', { op: 0.5 }); } // wet dark stains soaking through
      V.livid(f, [200, 1320], 40, 14, 4);
      const inner = f.out.splice(i0).join('\n'); f.out.push(`<g clip-path="url(#${id})">${inner}</g>`); }
    for (const x of [320, 246, 160, 92]) { let yT = 1240; for (let k = 0; k < shr.length - 1; k++) if (shr[k][0] >= x && shr[k + 1][0] < x) yT = lerp(shr[k], shr[k + 1], (shr[k][0] - x) / (shr[k][0] - shr[k + 1][0]))[1]; const yB = 1362; const ln = [[x + 6, yT - 2], [x - 4, (yT + yB) / 2], [x - 10, yB + 2]]; f.stroke(ln, 7, '#14120e'); f.stroke(ln, 4.6, rope); f.line(ln.map(q => add(q, [-1.2, -1])), 1, '#a8987a', { op: 0.6 }); f.flat(ell([x + 6, yT - 2], 5, 3.4, 0, 8), rope); } // rope turns biting into the shroud
    for (const [a0, l, sw] of [[[230, 1360], 50, -8], [[120, 1362], 36, 6], [[300, 1358], 30, -4]]) { const q = [a0, add(a0, [sw * 0.5, l * 0.2]), add(a0, [sw - 10, l * 0.4])]; f.stroke(q, 12, sailC, { op: 0.95 }); f.line(q, 1.2, INK, { op: 0.6 }); } // torn strips dragging on the sand
    V.barnacles(f, [180, 1300], 30, 8, 5, 3, 6); V.kelpHang(f, [250, 1272], 40, 6, -6);
    // -- the torso (bone corpse): the back on the sand, the swollen belly domed up, the costal arch, the chest under the
    // rucked shirt, the shoulders lifted by the hook
    f.bone('corpse');
    const torsoUV = [[-0.08, -14], [0.04, -50], [0.24, -58], [0.48, -54], [0.7, -50], [0.88, -46], [1.0, -38], [1.08, -16], [1.1, 18], [1.02, 46], [0.9, 62], [0.78, 60], [0.7, 50], [0.62, 60], [0.52, 78], [0.4, 86], [0.28, 82], [0.16, 64], [0.06, 42], [-0.06, 26]];
    const torso = torsoUV.map(([u, v]) => T(u, v));
    f.part(torso, DS({ maxShade: 40, shade: 0.36 }));
    { const id = f.id('ct'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(torso, true)}"/></clipPath>`); const i0 = f.out.length;
      f.raw(`<path d="${E.smooth([T(-0.2, -80), T(1.2, -80), T(1.2, -14), T(0.6, -4), T(-0.2, -20)], true)}" fill="${P.drownS}" opacity="0.55" filter="url(#cast${s})"/>`); // the side lying on the sand, in soft shadow
      f.raw(`<path d="${E.smooth([T(0.2, 50), T(0.3, 80), T(0.44, 84), T(0.54, 70), T(0.42, 56)], true)}" fill="${P.drownL}" opacity="0.45" filter="url(#cast${s})"/>`); // the lit top of the swollen belly, soft
      V.livid(f, T(0.3, 20), 50, 30, 9); V.veins(f, T(0.36, 40), 40, 24, 5); // marbling: the blood settled and the veins gone dark
      for (let i = 0; i < 6; i++) f.line([T(0.2 + i * 0.05, 84 - i * 2), T(0.24 + i * 0.05, 60)], 1, P.drownL, { op: 0.6 }); // stretch marks on the swell
      f.flat(ell(T(0.34, 62), 5, 3.6, 0, 8), '#3a3a50', { op: 0.85 }); // the navel, pushed out
      f.stroke([T(0.62, 60), T(0.6, 30), T(0.64, 0)], 4, P.drownS, { op: 0.5 }); // the costal arch's edge
      for (let i = 0; i < 18; i++) f.flat(ell(T(0.04 + f.r() * 0.5, -54 + f.r() * 16), 2 + f.r() * 4, 1.5 + f.r() * 2, f.r() * 3, 7), '#8a8270', { op: 0.6 }); // sand caked on the flank
      for (const [u0, v0] of [[0.1, 50], [0.06, 30], [0.14, 64]]) f.stroke([T(u0, v0), T(u0 + 0.05, v0 - 14), T(u0 + 0.04, v0 - 34)], 3, P.drownS, { op: 0.5 }); // skin folds where the belly meets the hips
      const inner = f.out.splice(i0).join('\n'); f.out.push(`<g clip-path="url(#${id})">${inner}</g>`); }
    // the shirt: rucked up over the chest by the drag, the hem rolled at the ribs, a tear; stripes run round the body and
    // bend over it; tension folds pull from the hooked collar
    const shirtUV = [[0.3, -60], [0.5, -58], [0.7, -54], [0.88, -50], [1.0, -42], [1.1, -18], [1.12, 20], [1.04, 50], [0.9, 66], [0.78, 64], [0.7, 56], [0.62, 66, 1], [0.6, 40], [0.52, 10], [0.44, -20], [0.36, -44, 1]];
    const shirt = shirtUV.map(([u, v, k]) => k ? [...T(u, v), 1] : T(u, v));
    f.part(shirt, ST({ over: '', shadow: '#3a3e4a', maxShade: 30 }));
    { const id = f.id('cs'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(shirt, true)}"/></clipPath>`); const i0 = f.out.length;
      for (let i = 0; i < 9; i++) { const u = 0.36 + i * 0.085; f.stroke([T(u - 0.02, -64), T(u + 0.03, -10), T(u + 0.01, 40), T(u - 0.04, 74)], 10, stripeA, { op: 0.8 }); } // stripes bending round the ribcage
      for (const [a0, b0] of [[[1.06, 10], [0.7, -30]], [[1.04, 30], [0.76, 20]], [[1.0, 44], [0.8, 54]], [[1.02, -20], [0.64, -50]]]) { const a = T(...a0), b = T(...b0); f.stroke([a, lerp(a, b, 0.5), b], 4, '#1e222c', { op: 0.6 }); f.line([add(a, [-2, -2]), add(lerp(a, b, 0.5), [-2, -2])], 1.2, '#e0e0d8', { op: 0.5 }); } // pulled from the collar
      f.flat([T(0.3, -70), T(0.6, -64), T(0.6, -44), T(0.3, -50)], '#000', { op: 0.3 });
      const inner = f.out.splice(i0).join('\n'); f.out.push(`<g clip-path="url(#${id})">${inner}</g>`); }
    f.stroke([T(0.62, 64), T(0.58, 40), T(0.5, 10), T(0.42, -22), T(0.36, -46)], 6, '#7a7a74', { op: 0.9 }); f.line([T(0.6, 62), T(0.56, 40), T(0.48, 10), T(0.4, -22)], 1.2, '#d8d8d0', { op: 0.7 }); // the rolled hem
    f.flat([T(0.84, 52), T(0.9, 60), T(0.86, 40), T(0.82, 44)], '#2a2e36', { op: 0.9 }); f.line([T(0.84, 52), T(0.88, 58)], 1, INK, { op: 0.6 }); // a tear
    // the near arm flopped back over the head: the sleeve to the elbow, then the bare forearm with its muscle and tendons
    const SH = T(1.02, 34), EL = [646, 1196], WR = [728, 1290];
    f.part(K.chain([SH, EL], [54, 46], { steps: 6, bp: [[0, 0.5, 0.08, 0.25]] }), ST({ over: '', shadow: '#3a3e4a' }));
    for (let i = 0; i < 3; i++) { const u = 0.25 + i * 0.25; f.stroke([lp(SH, EL, u, -24), lp(SH, EL, u + 0.04, 0), lp(SH, EL, u, 24)], 8, stripeA, { op: 0.75 }); }
    f.stroke([lp(SH, EL, 0.86, -20), lp(SH, EL, 0.92, 0), lp(SH, EL, 0.86, 22)], 3, '#1e222c', { op: 0.6 }); // the sleeve bunched at the elbow
    f.part(K.chain([EL, lerp(EL, WR, 0.3), WR], [40, 44, 28], { steps: 8, bp: [[0, 0.6, 0.12, 0.3]], bq: [[1, 0.2, 0.06, 0.3]] }), DS({ maxShade: 16 }));
    f.line([lp(EL, WR, 0.15, 8), lp(EL, WR, 0.5, 4), lp(EL, WR, 0.85, 2)], 1.4, P.drownS, { op: 0.55 }); f.line([lp(EL, WR, 0.6, -6), lp(EL, WR, 0.92, -4)], 1, P.drownS, { op: 0.5 }); // the groove and a tendon
    f.line([lp(EL, WR, 0.1, -16), lp(EL, WR, 0.4, -18)], 2, P.drownL, { op: 0.6 }); V.livid(f, lerp(EL, WR, 0.6), 12, 8, 3);
    f.part(K.chain([lp(EL, WR, 0.02, 0), lp(EL, WR, 0.1, 0)], [48, 46], { steps: 2 }), ST({ over: '', shadow: '#3a3e4a', cast: false })); // the cuff of the sleeve
    V.openHand(f, [770, 1322], deg(30), 70, { look: DS({ fill: mix(P.drown, P.drownS, 0.1) }), back: true, curl: 0.5, spread: 0.3, swell: 0.6 });
    // the head lolling back off the shoulders, mouth open, water running out (as before)
    const ch = [584, 1086], chF = frame(ch, deg(150), 92);
    f.part(K.chain([T(1.04, 0), [578, 1100]], [62, 56], { steps: 4 }), DS());
    f.stroke([T(1.06, 14), [574, 1096]], 3, P.drownS, { op: 0.5 }); // the neck's tendon stretched by the lolling head
    B.head(f, ch, 92, deg(150), { skin: P.drown, jaw: 1.4, chin: -0.04, nose: 1.0, mouth: 'set', squint: 0.6, browDown: 0.05, faceShade: 0.75, faceHatch: false, jawShade: 0.3, iris: '#c8cec6', eyeWhite: '#e4e6de', hairCol: '#2a2c22', beard: 'stubble', beardCol: '#3a3a32' });
    f.flat(chF([[0.17, 0.26], [0.3, 0.26], [0.3, 0.38], [0.2, 0.4]]), '#0c1012'); f.flat(chF(ell([0.24, 0.4], 0.03, 0.05, 0, 6)), P.drip, { op: 0.9 });
    V.livid(f, chF([[0.0, 0.1]])[0], 12, 10, 4); V.kelpHang(f, chF([[-0.3, -0.3]])[0], 60, 6, 2);
    for (const [q, L3, w3] of [[[0.06, -0.46], 46, 12], [[-0.12, -0.5], 58, 14], [[-0.3, -0.42], 40, 11], [[-0.42, -0.24], 30, 9]]) { const r0 = chF([q])[0]; f.stroke([r0, add(r0, [-2, L3 * 0.5]), add(r0, [3, L3])], w3, '#1e2018'); f.line([add(r0, [2, 4]), add(r0, [1, L3 * 0.6])], 1.2, '#5a5e52', { op: 0.6 }); } // wet hair hanging plumb
    V.kelpHang(f, chF([[0.2, -0.4]])[0], 40, 5, 2);
    f.flat(ell([600, 1150], 140, 10, 0, 14), '#3a4448', { op: 0.4 }); f.flat(ell([300, gy + 2], 260, 9, 0, 16), '#3a4448', { op: 0.4 }); // the wet drag mark on the sand
    for (let i = 0; i < 6; i++) f.line([[120 + i * 70, 1360 + (i % 2) * 4], [170 + i * 70, 1358]], 2, '#1a1c1e', { op: 0.4 }); }
  f.r = frMain;

  // ---- the boat hook: ash pole, rope whipping, an iron socket, spike and recurved hook through the shirt collar
  f.bone('hook');
  const hookTip = add(collar, rot([20, 0], pA));
  f.part(limb(pB, collar, 20, 18, { steps: 10 }), V.WD(f, { tex: 'wood' + s, texOp: 0.7 }));
  f.line([lp(pB, collar, 0.03, -5), lp(pB, collar, 0.97, -5)], 1.2, P.woodL, { op: 0.5, straight: true });
  for (const t of [0.1, 0.13, 0.56]) f.line([lp(pB, collar, t, -12), lp(pB, collar, t + 0.01, 12)], 4, '#4e4436', { straight: true });
  { const hk = frame(collar, pA, 1); f.part(hk([[-44, -12, 1], [4, -11], [12, 0], [4, 11], [-44, 12, 1]]), V.IR(f, { inkW: 1.4 })); f.part(hk([[8, -6], [60, -3], [76, 0, 1], [60, 4], [8, 6]]), V.IR(f, { inkW: 1.3 })); f.part(hk([[-8, 8], [14, 12], [34, 26], [34, 46], [20, 58], [0, 56, 1], [16, 46], [20, 30], [8, 20], [-8, 18]]), V.IR(f, { inkW: 1.4 })); f.flat(hk([[-36, -8], [-10, -8], [-10, 8], [-36, 8]]), P.rust, { op: 0.5 }); V.verdigris(f, hk([[-20, 0]])[0], 10, 8, 3); }
  f.part([[548, 1100], [572, 1088], [586, 1110], [560, 1126]], ST({ inkW: 1.3, cast: false, shadow: '#3a3e4a' })); // the shirt's collar bunched over the hook

  // ---- the sack of salvage on her back, a boot sticking out of its mouth
  f.bone('sack');
  const sk0 = S.at(-0.9, 0.22), sackP = [add(sk0, [-40, -80]), add(sk0, [40, -90]), add(sk0, [66, 60]), add(sk0, [40, 200]), add(sk0, [-50, 220]), add(sk0, [-96, 100])];
  { const bt = add(sk0, [-10, -100]); f.part([add(bt, [-20, 40]), add(bt, [-24, -40]), add(bt, [-10, -70]), add(bt, [40, -76]), add(bt, [44, -60]), add(bt, [14, -46]), add(bt, [20, 40])], { fill: '#2a2824', shadow: '#0c0a08', light: '#5a5650', shade: 0.4, tex: 'mottle' + s, texOp: 0.5 }); f.line([add(bt, [-14, -40]), add(bt, [14, -46])], 1.4, '#6a6660', { op: 0.6 }); } // a boot's sole and heel
  f.part(sackP, { fill: '#5e5a4e', shadow: '#1e1c18', shade: 0.42, tex: 'weave' + s, texOp: 0.6 });
  f.stroke([add(sk0, [-30, -70]), add(sk0, [34, -78])], 5, '#3a3024');
  for (const [a2, b2] of [[[-60, 0], [-40, 160]], [[10, -30], [24, 170]], [[-20, 80], [10, 200]]]) f.stroke([add(sk0, a2), add(sk0, lerp(a2, b2, 0.5)), add(sk0, b2)], 2.4);
  for (const [x, y] of [[20, 60], [-40, 130], [30, 150]]) { const q = add(sk0, [x, y]); f.flat(ell(q, 12, 8, 0.3, 10), '#1a1814', { op: 0.6 }); } // lumps of salvage pressing through
  V.saltCrust(f, add(sk0, [0, 60]), 40, 80, 14); V.drip(f, add(sk0, [-10, 222]), 1.4); V.drip(f, add(sk0, [30, 210]), 1.2);

  // ---- far arm reaching back, the fist on the boat hook (the pole runs back in line with the straining arm)
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [74, 64], { steps: 6 }), CT({ fill: mix(coatC, '#000', 0.2) }));
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.7)], [64, 58], { steps: 6 }), CT({ fill: mix(coatC, '#000', 0.2) }));
  f.part(V.tube([lerp(EF, WF, 0.6), lerp(EF, WF, 0.92)], [44, 40]), SKN({ cast: false }));
  f.bone('hand_f');
  B.grip(f, WF, EF, pA, 40, mix(skin, skinS, 0.15), { tex: 'mottle' + s, texOp: 0.5, shadow: skinS, inline: true, name: 'strand-wife hook' });

  // ---- legs: in sea boots far too big for her, the tops gaping; the far leg pushing back, the near leg forward
  const legW = (Hp, Kn, A, sfx, wq, tone, heel) => {
    V.legTube(f, Hp, Kn, lerp(Kn, A, 0.2), [wq, wq * 0.74, wq * 0.66], { fill: mix('#3e3c38', '#000', tone), shadow: '#141414', shade: 0.4, tex: 'weave' + s, texOp: 0.45 }, sfx, { A });
    const da = ankleCut(Kn, A);
    split(f, () => {
      if (heel) f.raw(`<g transform="rotate(${heel} ${A[0] + 84} ${gy})">`);
      B.boot(f, A, 1, 104, mix('#262826', '#000', tone), { knee: lp(Kn, A, 0.2), kneeW: wq * 0.98, tex: 'mottle' + s });
      if (heel) f.raw('</g>');
      const d = E.norm(sub(A, Kn)), n = [-d[1], d[0]], w = wq * 0.5, top = lp(Kn, A, 0.2);
      f.flat([add(add(top, mul(n, w)), mul(d, 2)), add(add(top, mul(n, -w)), mul(d, 6)), add(add(top, mul(n, -w * 0.6)), mul(d, 24)), add(add(top, mul(n, w * 0.6)), mul(d, 20))], '#0a0a0a', { op: 0.85 }); // the gaping top of a boot too big
      for (const t of [0.4, 0.55, 0.7, 0.84]) f.line([lp(Kn, A, t, -w * 0.8), lp(Kn, A, t + 0.03, 0), lp(Kn, A, t, w * 0.6)], 1.6, INK, { op: 0.45 }); // the slack shaft folding
      f.line([lp(Kn, A, 0.3, w * 0.5), lp(Kn, A, 0.86, w * 0.4)], 2.6, P.slateP, { op: 0.35 }); f.scratches(lp(Kn, A, 0.6, 0), 20, 4, P.slateP, 0.9);
    }, [['shin' + sfx, side(A, mul(da, -1), 40)], ['foot' + sfx, side(A, da, 40)]]);
  };
  legW(HF, KF, AF, '_f', 86, 0.15, 18);
  f.bone('foot_f'); V.barnacles(f, add(AF, [60, 40]), 30, 14, 7, 4, 8);

  // ---- the merchant's long coat's skirts, sagging wet, split by the stride
  f.bone('coat_skirt');
  // the sodden coat's hem torn into strips of uneven length (seeded), hanging plumb, a few long tatters
  const skHem = []; { const r8 = E.rng(6238); let x = 1050; while (x > 796) { const d = r8(), y = 1084 + (d > 0.82 ? 50 + r8() * 50 : d > 0.45 ? 16 + r8() * 26 : r8() * 12); skHem.push(d > 0.45 ? [x, y, 1] : [x, y]); if (d > 0.82) skHem.push([x - 6, 1090 + r8() * 10]); x -= 12 + r8() * 26; } skHem.push([796, 1094, 1]); }
  const sk = [S.at(-0.66, 0.88), S.at(0.6, 0.9), add(S.at(0.66, 1.0), [30, 60]), ...skHem, [780, 1010], add(S.at(-0.72, 1.0), [-24, 40])];
  f.part(sk, CT());
  for (const [a2, b2] of [[[800, 860], [790, 1080]], [[860, 880], [870, 1100]], [[940, 880], [960, 1100]], [[1010, 860], [1040, 1080]], [[830, 900], [826, 1000]], [[900, 900], [910, 1010]], [[980, 890], [996, 990]]]) { f.stroke([a2, lerp(a2, b2, 0.5), b2], 3); f.line([add(a2, [8, 10]), add(b2, [8, -20])], 1.6, coatL, { op: 0.4 }); }
  f.flat(lumpE(f, [880, 940], 50, 30, 0.3, 0.4), '#0c0c0e', { op: 0.25 }); f.flat(lumpE(f, [1000, 1010], 30, 20, 0, 0.4), '#2a2620', { op: 0.35 }); V.wetSheen(f, [[1030, 880], [1040, 940], [1048, 1000], [1054, 1060]], 2.6, 0.45); // stains, wet sheen
  V.clipDraw(f, sk, () => f.flat([[770, 1030], [1070, 1030], [1070, 1200], [770, 1200]], '#0c0c0e', { op: 0.38 })); // the soaked hem band
  for (const q of skHem.filter(q => q[1] > 1110)) { V.drip(f, add(q, [0, 4]), 1.4); f.line([q, add(q, [-2, 14]), add(q, [1, 24])], 1.1, coatL, { op: 0.6 }); } // drips and threads off the long strips
  V.saltCrust(f, [900, 1000], 120, 40, 20); V.kelpHang(f, [820, 1060], 60, 6, -4);
  f.part([[960, 960], [1010, 954], [1014, 1004], [962, 1010]], CT({ fill: '#3a3a36', sharp: true, inkW: 1.3 })); f.stitches([[960, 960], [1010, 954], [1014, 1004], [962, 1010], [960, 960]], P.bone, 1);

  // ---- torso: gaunt, in layers: the striped shirt at the throat, the long coat, the officer's waistcoat over both
  f.bone('torso');
  const torso = S.shape([[-0.04, 0.32, 0.28], [0.08, 0.56, 0.44], [0.22, 0.62, 0.52], [0.42, 0.54, 0.48], [0.62, 0.46, 0.46], [0.82, 0.5, 0.5], [1.0, 0.56, 0.52]]);
  f.part(torso, CT());
  f.part(S.shape([[0.0, -0.06, 0.42], [0.14, 0.0, 0.5], [0.3, 0.06, 0.44]]), ST()); // the striped shirt showing at the open neck
  const vest = S.shape([[0.12, 0.3, 0.52], [0.3, 0.44, 0.58], [0.56, 0.44, 0.56], [0.8, 0.46, 0.6], [0.94, 0.5, 0.64]]);
  f.defs.push(`<pattern id="tick${s}" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(-20)"><rect width="3" height="9" fill="${P.slateD}" opacity="0.5"/></pattern>`);
  f.part(vest, { fill: vestC, shadow: '#1a1a1c', light: '#7a766e', shade: 0.42, tex: 'tick' + s, texOp: 0.9 });
  { const ed = [S.at(0.5, 0.14), S.at(0.56, 0.4), S.at(0.6, 0.7), S.at(0.62, 0.94)]; f.line(ed, 2.4, INK); [0.24, 0.38, 0.52, 0.66, 0.8].forEach((v, i) => { const q = S.at(0.54 + v * 0.06, v); f.part(ell(q, 6, 6, 0, 10), V.BRS(f, { inkW: 1, cast: false, fill: i === 2 ? '#6a6248' : P.brass })); if (i === 2) V.fusedRun(f, add(q, [0, 5]), 12, 3, P.brass); }); }
  f.line([S.at(0.0, 0.5), S.at(0.3, 0.52)], 2.2, INK); f.part([S.at(0.04, 0.5), S.at(0.3, 0.52), S.at(0.3, 0.58), S.at(0.04, 0.56)], { fill: mix(vestC, '#000', 0.2), sharp: true, inkW: 1.1, cast: false }); // the vest's pocket flap
  f.stroke([S.at(-0.3, 0.3), S.at(-0.24, 0.6)], 2.4); f.stroke([S.at(-0.5, 0.5), S.at(-0.46, 0.8)], 2.2); f.stroke([S.at(0.2, 0.7), S.at(0.4, 0.84)], 2);
  V.wetSheen(f, [S.at(-0.5, 0.2), S.at(-0.54, 0.36), S.at(-0.56, 0.52), S.at(-0.58, 0.68)], 2.4, 0.4); V.saltCrust(f, S.at(-0.2, 0.5), 30, 40, 12);
  // belt: a short knife for fingers in a sheath, and a cord of rings and buttons
  const bl = [S.at(-0.66, 0.9), S.at(0.0, 0.94), S.at(0.64, 0.92)];
  f.part([...bl.map(q => add(q, [0, -10])), ...bl.slice().reverse().map(q => add(q, [0, 10]))], { fill: '#2a2018', shadow: '#0e0a08', shade: 0.4, inkW: 1.3, tex: 'mottle' + s });
  { const kn = S.at(0.36, 0.94); f.part([add(kn, [-8, 0]), add(kn, [8, 0]), add(kn, [4, 70]), [...add(kn, [0, 82]), 1], add(kn, [-6, 70])], { fill: '#3a2c20', shade: 0.4, inkW: 1.1, cast: false }); f.part(limb(add(kn, [0, -36]), add(kn, [0, 2]), 12, 11, { steps: 3 }), V.WD(f, { fill: '#2e241c', inkW: 1, cast: false })); f.part(ell(add(kn, [0, -40]), 7, 5, 0, 8), V.IR(f, { inkW: 1, cast: false })); }
  // the pair of boots tied by the laces, hanging round her neck over the chest
  f.bone('neck_boots');
  { const nb = S.at(0.36, 0.3); for (const [dx, a2, tone] of [[-30, 0.12, 0.2], [24, -0.1, 0]]) { const bf = frame(add(nb, [dx, 0]), a2, 1); f.part(bf([[-18, -40], [18, -44], [22, 40], [50, 52], [54, 70], [-14, 72], [-20, 30]]), { fill: mix('#3a3430', '#000', tone), shadow: '#0e0c0a', light: '#6a625a', shade: 0.42, tex: 'mottle' + s, texOp: 0.5 }); f.line(bf([[-14, 62], [50, 62]]), 1.4, '#8a8278', { op: 0.5 }); f.flat(bf(ell([0, -42], 16, 5, 0, 8)), '#0a0a0a'); } V.rope(f, [add(nb, [-30, -42]), S.at(0.1, 0.02), S.at(0.0, -0.02), S.at(0.6, 0.0), add(nb, [24, -44])], 2.4, { col: '#4a4034' }); }
  // the necklace of ship's buttons
  f.bone('torso');
  { const pts = [S.at(-0.1, 0.0), S.at(0.1, 0.12), S.at(0.3, 0.18), S.at(0.5, 0.12)]; f.line(pts, 1.6, '#3a3024'); for (let i = 0; i < 9; i++) { const t = i / 8, k2 = Math.min(2, Math.floor(t * 3)), q = lerp(pts[k2], pts[k2 + 1], t * 3 - k2); f.part(ell(q, 6.5, 6.5, 0, 10), V.BRS(f, { inkW: 1, cast: false, fill: i % 3 ? P.brass : '#8e9290' })); f.flat(ell(add(q, [-1.5, 0]), 1.2, 1.2, 0, 6), '#141210'); f.flat(ell(add(q, [1.5, 0]), 1.2, 1.2, 0, 6), '#141210'); } }

  // ---- near leg forward
  legW(HN, KN, AN, '_n', 92, 0.0, 0);
  f.bone('foot_n'); V.barnacles(f, add(AN, [70, 44]), 34, 14, 8, 4, 9);
  f.bone('shin_n'); V.kelpHang(f, lp(KN, AN, 0.3, -50), 70, 7, 6);
  f.bone('root'); f.flat(ell([AN[0] + 80, gy + 2], 150, 8, 0, 14), '#3a4448', { op: 0.5 });

  // ---- head: a thin hard wind-burned face, lips moving as she counts; the headscarf, the officer's hat jammed over it;
  // grey hair standing out from under them in a stiff fan
  f.bone('head');
  f.part(K.chain([S.at(0.12, 0.02), add(HC, [-16, 70])], [70, 62], { steps: 4 }), SKN());
  f.line([S.at(0.24, 0.0), add(HC, [8, 64])], 1.6, INK, { op: 0.5 }); // the neck's cord
  V.lichtenberg(f, S.at(-0.1, 0.0), deg(-80), 70, 2, { depth: 2 });
  B.head(f, HC, H, hA, { skin: '#b4a698', jaw: 0.84, chin: 0.05, nose: 1.0, hook: 0.2, mouth: 'set', squint: 0.5, browDown: 0.05, age: true, gaunt: true, lips: true, lashes: true, faceShade: 0.8, faceHatch: false, jawShade: 0.3, hairCol: '#8e8c84', browCol: '#6a685e' });
  f.flat(hF([[-0.15, 0.12], [0.25, 0.1], [0.29, 0.3], [0.17, 0.46], [0.0, 0.47], [-0.15, 0.3]]), '#9a7a66', { op: 0.38 }); // warm the jaw's shadow so it reads as a woman's skin, not stubble
  f.flat(hF(ell([0.18, 0.08], 0.09, 0.06, 0, 10)), '#7a5a52', { op: 0.25 }); for (let i = 0; i < 4; i++) f.line(hF([[0.3 + i * 0.01, 0.04 + i * 0.02], [0.34, 0.07 + i * 0.02]]), 0.8, '#5e4446', { op: 0.5 }); // wind-burn (mauve, not red)
  f.line(hF([[0.2, 0.31], [0.25, 0.34], [0.3, 0.31]]), 1.2, INK, { op: 0.6 }); // the lower lip moving, counting
  for (let i = 0; i < 4; i++) f.line(hF([[0.22 + i * 0.02, 0.36], [0.23 + i * 0.02, 0.4]]), 0.8, INK, { op: 0.45 }); // lip creases
  for (let i = 0; i < 3; i++) f.line(hF([[0.2 + i * 0.012, -0.06 + i * 0.03], [0.25 + i * 0.02, -0.04 + i * 0.045]]), 1.1, INK, { op: 0.55 }); // crow's feet
  // the headscarf tied under the chin, and the officer's cocked hat jammed down over it
  f.part(hF([[-0.5, 0.3], [-0.52, -0.1], [-0.36, -0.42], [-0.08, -0.54], [0.22, -0.48], [0.34, -0.3], [0.2, -0.26], [-0.1, -0.24], [-0.24, 0.0], [-0.26, 0.36]]), { fill: '#6a6458', shadow: '#22201c', shade: 0.42, tex: 'weave' + s, texOp: 0.55 });
  f.stroke(hF([[-0.2, 0.36], [-0.04, 0.52], [0.1, 0.56]]), 6, '#5e5a4e'); f.stroke(hF([[0.06, 0.56], [0.0, 0.74], [-0.06, 0.86]]), 5, '#5e5a4e');
  const hat = (pts, o2) => f.part(hF(pts), Object.assign({ fill: '#2a2c32', shadow: '#0e0f12', light: '#565a64', shade: 0.42, tex: 'mottle' + s, texOp: 0.6 }, o2 || {}));
  hat([[-0.42, -0.3], [-0.4, -0.58], [-0.18, -0.76], [0.12, -0.74], [0.3, -0.54], [0.32, -0.3]]);
  hat([[-0.7, -0.2], [-0.84, -0.66, 1], [-0.56, -0.54], [-0.32, -0.52], [-0.36, -0.32]], { fill: '#24262c' });
  hat([[-0.4, -0.32], [-0.1, -0.42], [0.2, -0.4], [0.46, -0.32], [0.7, -0.46, 1], [0.6, -0.26], [0.32, -0.2], [-0.1, -0.22], [-0.44, -0.18]], { inkW: 1.7 });
  f.line(hF([[-0.34, -0.36], [0.0, -0.4], [0.3, -0.36], [0.6, -0.38]]), 1.4, '#c8b070', { op: 0.55 }); // tarnished braid on the brim
  f.part(hF([[-0.16, -0.4], [0.02, -0.44], [0.02, -0.32], [-0.16, -0.3]]), { fill: '#1a1c22', shade: 0.3, inkW: 1, cast: false });
  // the stiff grey fan of hair behind the head, clumped, burnt at the tips
  const hr2 = E.rng(6233); for (const i of [3, 0, 5, 1, 6, 2, 4]) { const a2 = deg(-165 + i * 14 + (hr2() - 0.5) * 16), r0 = hF([[-0.5 + i * 0.012, 0.1 - i * 0.07]])[0], L2 = 80 + hr2() * 110, bw = (hr2() - 0.5) * 0.7, w0 = 24 + hr2() * 30; const hm = hairMass(f, [r0, add(r0, rot([L2 * 0.35, 0], a2 + bw)), add(r0, rot([L2 * 0.7, 0], a2 - bw * 0.6)), add(r0, rot([L2, 0], a2 + bw * 0.3))], [w0, w0 * 0.9, w0 * 0.6, w0 * 0.3], { fill: i % 2 ? '#b8b6ae' : '#9a988f', shadow: '#2e2e32', shade: 0.4, tex: 'hatch' + s, texOp: 0.2, inkW: 1.2 }, { tips: 2 + (i % 3), tipL: 16 + hr2() * 20, lit: '#d8d6ce', strands: false, amp: 5, phase: i }); const P0 = r0; V.clipDraw(f, hm.outline, () => { for (let k = 0; k < 3; k++) { const off = (hr2() - 0.5) * w0 * 0.7, t1 = 0.4 + hr2() * 0.6, d0 = rot([1, 0], a2 + bw * 0.3), n0 = [-d0[1], d0[0]]; f.line([add(P0, mul(n0, off)), add(add(P0, mul(d0, L2 * t1 * 0.5)), mul(n0, off * 0.8 + (hr2() - 0.5) * 6)), add(add(P0, mul(d0, L2 * t1)), mul(n0, off * 0.5))], 1 + hr2() * 1.4, hr2() > 0.5 ? '#ecebe4' : '#2a2a30', { op: 0.45 }); } }); } // the hair in stiff wiry clumps of uneven width and length fanning up and back, strands of differing length
  V.barnacles(f, hF([[-0.56, -0.44]])[0], 16, 10, 4, 3, 6); V.drip(f, hF([[0.68, -0.4]])[0], 1.4); V.drip(f, hF([[-0.8, -0.6]])[0], 1.2);

  // ---- near arm held out forward, long and gaunt; the hand a fused knot of rings, scars branching up the arm
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.6)], [66, 56, 52], { steps: 8, bp: [[0, 0.4, 0.1]] }), CT());
    f.stroke([lp(SN, EN, 0.4, 24), lp(SN, EN, 0.62, 4), lp(SN, EN, 0.8, -24)], 2.4);
    V.wetSheen(f, [lp(SN, EN, 0.2, -26), lp(SN, EN, 0.5, -30), lp(SN, EN, 0.7, -30)], 2.2, 0.45);
  }, [['upperarm_n', side(EN, mul(de, -1), 34)], ['forearm_n', side(EN, de, 34)]]);
  f.bone('torso'); V.barnacles(f, add(SN, [0, 6]), 20, 10, 5, 3, 6);
  f.bone('forearm_n');
  f.part(limb(lerp(EN, WN, 0.5), lerp(EN, WN, 0.66), 70, 70, { steps: 4 }), CT({ fill: '#3a3a36', inkW: 1.6, cast: false })); // the coat's cuff turned back
  f.part(K.chain([lerp(EN, WN, 0.62), lerp(EN, WN, 0.82), WN], [46, 42, 38], { steps: 6 }), SKN());
  f.line([lp(EN, WN, 0.66, -8), lp(EN, WN, 0.96, -6)], 1.2, INK, { op: 0.5 }); // tendon
  V.lichtenberg(f, lp(EN, WN, 0.98, 0), ang(WN, EN), 150, 2.4, { depth: 3, fork: 0.7, col: '#120e0c', lite: '#8a8478' }); // scorched through the sleeve
  f.bone('hand_n');
  // the hand: spread and heavy, every finger choked with rings, the rings welded by the strike into one knuckled mass
  const hd = V.openHand(f, WN, deg(16), 118, { look: SKN({ fill: mix(skin, skinS, 0.1) }), back: true, curl: 0.3, spread: 0.2, swell: 0.4 });
  const knot = [];
  hd.fing.forEach((g, i) => { for (const t of [0.2, 0.5, 0.85]) knot.push([lerp(g.kb, g.k2, t), g.W]); });
  knot.push([hd.F([[0.3, -0.05]])[0], 24], [hd.F([[0.36, 0.1]])[0], 24], [hd.F([[0.2, 0.0]])[0], 22]);
  const mass = []; knot.forEach(([q, w]) => { for (let k = 0; k < 4; k++) mass.push(add(q, rot([w * 0.7, 0], k * 1.57 + f.r()))); });
  const hull = (() => { const pts = mass.slice(), c = pts.reduce((a, q) => add(a, mul(q, 1 / pts.length)), [0, 0]); pts.sort((a, b) => Math.atan2(a[1] - c[1], a[0] - c[0]) - Math.atan2(b[1] - c[1], b[0] - c[0])); const out = []; const step = Math.max(1, Math.floor(pts.length / 22)); for (let i = 0; i < pts.length; i += step) { const a = Math.atan2(pts[i][1] - c[1], pts[i][0] - c[0]); let best = pts[i]; for (const q of pts) if (Math.abs(Math.atan2(q[1] - c[1], q[0] - c[0]) - a) < 0.15 && E.len(sub(q, c)) > E.len(sub(best, c))) best = q; out.push(best); } return out; })();
  f.part(hull, { fill: '#3a3632', shadow: '#0c0a08', light: '#7a7266', shade: 0.42, tex: 'pit' + s, texOp: 0.7, inkW: 1.6 }); // the fused metal: blackened, pitted
  knot.forEach(([q, w], i) => { const r = w * 0.46, a2 = f.r() * 3; const ring = ell(q, r, r * 0.62, a2, 14); f.line(ring.concat([ring[0]]), 4.6, INK); f.line(ring.concat([ring[0]]), 2.8, i % 4 === 0 ? '#9a9c98' : i % 3 === 0 ? '#8a7446' : '#5a5650'); f.line(ring.slice(8, 12), 1, i % 5 === 0 ? P.lampL : '#d8d8d0', { op: 0.8 }); }); // the rings, each still a ring, sunk in the mass
  for (let i = 0; i < 4; i++) { const q = knot[3 + i * 3][0]; f.flat(ell(q, 3, 2, 0, 6), P.lampL, { op: 0.9 }); } // lamp-yellow glints in the welds
  V.scorch(f, hd.F([[0.2, 0.0]])[0], 40, 26, 0.4);
  V.weld(f, hd.F([[0.02, 0.0]])[0], deg(16) + Math.PI / 2, 40, { burns: [[deg(196), 90, 2.4], [deg(170), 60, 1.8]] });
  return f;
}

// ------------------------------------------------------------------ THE GIBBETED WRECKER (elite, 2.3 to the arm top)
// A wrecker hanged in irons on the headland as a warning to the coast; the irons are the highest metal for miles. A
// tarred oak gibbet post planted in the rock, leaning into the wind, studded with iron spikes against climbers, a
// plaque nailed to it with his crime lettered in rubric red; from its arm a chain welded rigid holds the man-shaped cage
// of iron hoops and straps. He hangs inside at head height, gripping the bars, legs dangling through the bottom hoop.
// Struck through the cage so often that the bars are fused to his bones at the wrists, the ribs and the jaw; his skin
// is scorched black in branching Lichtenberg trees and his hair stands in a stiff singed brush. Water has swollen and
// whitened what flesh is left. A ragged wool jumper, one sea boot, the frayed end of a noose round the neck, his storm
// lantern still hanging at his belt, a dead gull caught in the bars, droppings crusting the cage top, a rusted spike
// through the cage's foot, the padlocked hasp fused shut. True size wins: the canvas is heightened at the same scale.
// Rig: gibbet (root: post, arm, brace, plaque) > chain (pivot at the arm's eye) > cage (pivot at the chain's foot) >
// pelvis > torso > head; thigh/shin/foot near and far (the legs swing free below the bottom hoop); lantern (pelvis).
// Motion: idle the cage creaking round in the wind (chain, cage), the legs swinging; attack a strike on the gibbet that
// jumps from the cage to the heroes while his legs kick (thighs, shins).
function gibbetedWrecker() {
  const CW = TIERS.elite[0], CH = 1560, f = new Fig(V.base(622, CH)); V.textures(f);
  const gy = f.o.groundY, s = '622', H = 98;
  const oak = { fill: '#3a342e', shadow: '#0e0c0a', light: '#6a6258', shade: 0.42, tex: 'wood' + s, texOp: 0.8 };
  const skin = '#bdbcb0', skinS = '#4e4c5a';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, shade: 0.32, tex: 'wrinkle' + s, texOp: 0.55 }, o);
  const IRN = (o = {}) => V.IR(f, Object.assign({ inkW: 1.4, inkHeavy: 2, cast: false }, o));
  const post0 = [380, gy - 10], post1 = [400, 70], eye = [780, 110], cageTop = [786, 262];
  const PV = [770, 700], N = [790, 434], HC = [820, 350], hA = 0.18, hF = frame(HC, hA, H);
  const SN = [760, 450], SF = [826, 446], WN = [866, 560], WF = [716, 556], EN = [800, 560], EF = [742, 540];
  const HN = [790, 702], KN = [812, 820], AN = [800, 930], HF2 = [752, 700], KF = [736, 816], AF = [744, 924];
  f.joint('gibbet', post0).joint('chain', eye, 'gibbet').joint('cage', cageTop, 'chain').joint('pelvis', PV, 'cage').joint('torso', [780, 640], 'pelvis').joint('head', N, 'torso');
  f.joint('thigh_n', HN, 'pelvis').joint('shin_n', KN, 'thigh_n').joint('foot_n', AN, 'shin_n').joint('thigh_f', HF2, 'pelvis').joint('shin_f', KF, 'thigh_f').joint('foot_f', AF, 'shin_f').joint('lantern', [722, 690], 'pelvis');

  // ---- the gibbet: a square tarred oak post with its side face showing, leaning into the wind; the arm with its
  // underside, a brace, iron spikes against climbers, the plaque; planted in a split rock
  f.bone('gibbet');
  const rock = [[150, gy + 30], [170, gy - 60], [240, gy - 104], [330, gy - 120], [440, gy - 110], [520, gy - 80], [600, gy - 30], [640, gy + 30]];
  f.part(rock, { fill: '#545a60', shadow: '#1c2026', light: '#8a9298', shade: 0.42, tex: 'pit' + s, texOp: 0.6 });
  f.part([[180, gy - 50], [250, gy - 96], [340, gy - 112], [440, gy - 100], [520, gy - 72], [440, gy - 80], [340, gy - 92], [240, gy - 80]], { fill: '#6c7278', shade: 0.3, inkW: 0, cast: false });
  f.line([[200, gy - 20], [300, gy - 40], [420, gy - 30], [560, gy - 10]], 1.2, INK, { op: 0.5 }); f.flat([[360, gy - 112], [372, gy - 60], [366, gy], [356, gy - 50]], '#0c0e10', { op: 0.7 }); // the crack the post is wedged into
  for (const [x, y] of [[300, gy - 90], [480, gy - 86]]) { f.part([[x - 18, y + 4], [x - 10, y - 8], [x + 14, y - 10], [x + 18, y + 6]], { fill: '#6e7276', shade: 0.4, inkW: 1.1, cast: false }); } // wedge stones
  V.saltCrust(f, [400, gy - 60], 160, 30, 20); f.flat(ell([400, gy + 4], 260, 8, 0, 14), '#2a2e30', { op: 0.5 });
  const pd = E.norm(sub(post1, post0)), pn = [-pd[1], pd[0]], pw = 34;
  f.part([add(post0, mul(pn, pw)), add(post0, mul(pn, pw + 16)), add(post1, mul(pn, pw + 16)), add(post1, mul(pn, pw))].map(q => [...q, 1]), Object.assign({}, oak, { fill: '#26221e' })); // the side face
  f.part([add(post0, mul(pn, -pw)), add(post0, mul(pn, pw)), add(post1, mul(pn, pw)), add(post1, mul(pn, -pw))].map(q => [...q, 1]), oak);
  for (let i = 0; i < 6; i++) f.line([lp(post0, post1, 0.02, -24 + i * 9), lp(post0, post1, 0.98, -22 + i * 9)], 0.9, INK, { op: 0.35, straight: true }); // grain
  f.flat([lp(post0, post1, 0.3, -6), lp(post0, post1, 0.6, -2), lp(post0, post1, 0.6, 4), lp(post0, post1, 0.3, 2)], '#0c0a08', { op: 0.7 }); // a shake split down it
  for (let i = 0; i < 9; i++) { const t = 0.08 + i * 0.07, q = lp(post0, post1, t, (i % 2 ? 1 : -1) * 18), sg = i % 2 ? 1 : -1, tip = add(q, add(mul(pn, sg * 34), mul(pd, 8))); f.part([add(q, mul(pd, -5)), tip, add(q, mul(pd, 5))], IRN({ fill: P.rust, light: P.rustL })); f.flat(ell(q, 5, 5, 0, 8), P.ironD); f.flat([add(q, [0, 6]), add(q, [2, 30]), add(q, [-2, 26])], P.rust, { op: 0.5 }); } // spikes against climbers
  // the arm and its brace: the arm's underside face shows; an iron eye at its end
  const a0 = add(post1, [-30, -12]), a1 = [820, 70];
  f.part([[a0[0], a0[1] + 52], [a1[0], a1[1] + 40], [a1[0] - 6, a1[1] + 54], [a0[0] + 30, a0[1] + 66]].map(q => [...q, 1]), Object.assign({}, oak, { fill: '#22201c' })); // underside
  f.part([[a0[0], a0[1] - 14], [a1[0], a1[1] - 26], [a1[0], a1[1] + 40], [a0[0], a0[1] + 52]].map(q => [...q, 1]), oak);
  f.part([[a1[0], a1[1] - 26], [a1[0] + 14, a1[1] - 20], [a1[0] + 14, a1[1] + 46], [a1[0], a1[1] + 40]].map(q => [...q, 1]), Object.assign({}, oak, { fill: '#5a5248', tex: 'mottle' + s })); // end grain
  for (let i = 0; i < 4; i++) f.line([[a0[0] + 10, a0[1] - 6 + i * 14], [a1[0] - 10, a1[1] - 18 + i * 14]], 0.9, INK, { op: 0.35, straight: true });
  const b0 = lp(post0, post1, 0.82, 30), b1 = [650, 98]; f.part(limb(b0, b1, 30, 28, { steps: 6, capA: false, capB: false }), oak); f.part(limb(add(b0, [8, 8]), add(b1, [8, 10]), 12, 10, { steps: 4 }), Object.assign({}, oak, { fill: '#22201c', cast: false }));
  for (const q of [b0, b1, add(post1, [0, 20]), add(a0, [30, 18])]) { f.part(ell(q, 9, 9, 0, 10), IRN()); f.flat(ell(q, 3, 3, 0, 8), P.ironD); } // bolt heads
  f.part([add(a0, [-6, -18]), add(a0, [60, -24]), add(a0, [60, 56]), add(a0, [-6, 60])].map(q => [...q, 1]), IRN({ fill: P.iron })); // iron strap binding the joint
  V.lichtenberg(f, add(a0, [60, 10]), deg(8), 120, 2.4, { depth: 2, col: '#0c0a08', lite: '#7a6a58' }); V.scorch(f, add(a0, [30, 20]), 40, 24, 0.5);
  const ey = add(eye, [0, -10]); f.line(ell(ey, 12, 14, 0, 12).concat([ell(ey, 12, 14, 0, 12)[0]]), 7, INK); f.line(ell(ey, 12, 14, 0, 12).concat([ell(ey, 12, 14, 0, 12)[0]]), 4.4, P.iron);
  V.scorch(f, add(a1, [-30, 10]), 40, 30, 0.55); V.lichtenberg(f, add(a1, [-20, 0]), deg(190), 160, 2.6, { depth: 3, col: '#0c0a08', lite: '#7a6a58' });
  // the plaque nailed to the post, his crime lettered in rubric red
  const pq = lp(post0, post1, 0.38, 0), PQ = frame(pq, Math.atan2(pd[1], pd[0]) + Math.PI / 2, 1);
  f.part(PQ([[-54, -36], [56, -40], [58, 38], [-52, 42]]).map(q => [...q, 1]), V.WD(f, { fill: '#6e6250', tex: 'wood' + s, inkW: 1.4 }));
  f.part(PQ([[-54, 30], [58, 26], [58, 38], [-52, 42]]).map(q => [...q, 1]), V.WD(f, { fill: '#3e3428', inkW: 1, cast: false })); // its thickness
  for (let r = 0; r < 3; r++) { const y = -20 + r * 16, pts = []; for (let x = -42; x < 46; x += 6) pts.push([x, y + (f.r() - 0.5) * 6]); f.line(PQ(pts), 2.4, K.rubric, { op: 0.85 }); } // the letters, rubric red
  for (const q of PQ([[-46, -30], [48, -32], [-44, 34], [50, 30]])) { f.flat(ell(q, 3.4, 3.4, 0, 8), P.ironD); f.flat([q, add(q, [1, 18]), add(q, [-1, 14])], P.rust, { op: 0.5 }); }
  f.flat(PQ([[30, -40], [58, -40], [58, -10]]), '#0c0a08', { op: 0.7 }); // a corner split off

  // ---- the chain, its links welded rigid by the strikes: it hangs dead straight
  f.bone('chain');
  V.chainLinks(f, [add(ey, [0, 10]), add(cageTop, [0, -16])], 22, P.iron);
  for (let i = 0; i < 4; i++) { const q = lerp(add(ey, [0, 10]), cageTop, 0.2 + i * 0.2); f.flat(ell(q, 7, 4, 0, 8), '#141210', { op: 0.7 }); f.flat(ell(q, 2.6, 1.6, 0, 6), P.lampL, { op: 0.7 }); } // weld beads between the links
  f.part(ell(add(cageTop, [0, -10]), 12, 12, 0, 12), IRN()); f.flat(ell(add(cageTop, [0, -10]), 5, 5, 0, 8), '#060606');

  // ---- the cage: iron hoops and straps shaped to a man. Hoops at the crown, neck, shoulders, chest, waist and hips;
  // straps down the front, back and both sides; the back halves first, the man, then the front halves.
  f.bone('cage');
  const hoops = [[cageTop[1] + 20, 50, 12, 6], [404, 60, 14, 0], [452, 98, 20, -10], [540, 92, 18, -10], [626, 84, 16, -12], [706, 92, 18, -14]]; // y, rx, ry, x offset
  const cx = y => 786 + (y - 262) * -0.04;
  const hoopHalf = (h, front) => { const [y, rx, ry, ox] = h, c = [cx(y) + ox, y], e = ell(c, rx, ry, 0, 24), half = front ? e.slice(0, 13) : e.slice(12).concat([e[0]]); f.line(half, 10, INK); f.line(half, 6.6, front ? P.iron : P.ironD); if (front) f.line(half.slice(3, 10).map(q => add(q, [0, -1.6])), 1.4, P.ironL, { op: 0.6 }); return c; };
  const strapLine = (u, front) => hoops.map(([y, rx, ry, ox]) => { const a2 = u * Math.PI; return [cx(y) + ox + Math.cos(a2) * rx, y + Math.sin(a2) * ry * (front ? 1 : -1)]; });
  for (const h of hoops) hoopHalf(h, false);
  for (const u of [0.0, 1.0]) { const L = strapLine(u, false); f.line(L, 10, INK); f.line(L, 6.6, P.ironD); } // side straps (the far one behind)
  { const L = strapLine(0.5, false); f.line(L, 10, INK); f.line(L, 6.6, P.ironD); } // back strap
  f.line([[cx(282) - 46, 282], [cx(282), 248], [cx(282) + 52, 282]], 10, INK); f.line([[cx(282) - 46, 282], [cx(282), 248], [cx(282) + 52, 282]], 6.6, P.ironD); // crown bar

  // ---- the man inside: gaunt, scorched black in branching trees, swollen white where flesh is left
  // far arm: the wrist fused to a bar on the cage's far side
  f.bone('torso');
  f.part(K.chain([SF, EF, WF], [36, 32, 28], { steps: 8 }), SKN({ fill: mix(skin, skinS, 0.25) }));
  V.openHand(f, WF, deg(200), 62, { look: SKN({ fill: mix(skin, skinS, 0.25) }), back: true, curl: 0.6, spread: 0.06, swell: 0.3 });
  // legs dangling through the bottom hoop: the near leg in its one sea boot, the far leg bare, toes hanging
  const legG = (Hp, Kn, A, sfx, tone, boot) => {
    const da = ankleCut(Kn, A);
    split(f, () => { const tr = K.chain([Hp, Kn, A], [64, 46, 36], { steps: 8, bq: [[0, 0.45, 0.12]], bp: [[1, 0.02, 0.16, 0.12], [1, 0.4, 0.08]] }); f.part(tr, { fill: mix('#4a4a46', '#000', tone), shadow: '#141414', shade: 0.4, tex: 'weave' + s, texOp: 0.5 }); f.stroke([lp(Hp, Kn, 0.7, -14), lp(Hp, Kn, 0.95, 0), lp(Kn, A, 0.1, 14)], 1.8); V.clipDraw(f, tr, () => { for (let k = 0; k < 3; k++) f.stroke([lp(Kn, A, -0.08 + k * 0.08, -22), lp(Kn, A, -0.02 + k * 0.08, 0), lp(Kn, A, -0.06 + k * 0.08, 22)], 2.6, '#0a0a0a', { op: 0.55 }); f.stroke([lp(Hp, Kn, 0.2, 26), lp(Hp, Kn, 0.55, 30), lp(Hp, Kn, 0.85, 22)], 5, '#0a0a0a', { op: 0.4 }); f.line([lp(Hp, Kn, 0.1, -24), lp(Hp, Kn, 0.6, -26), lp(Kn, A, 0.3, -16)], 1.6, '#8a8a84', { op: 0.45 }); f.flat([lp(Kn, A, 0.55, -40), lp(Kn, A, 0.55, 40), lp(Kn, A, 1.1, 40), lp(Kn, A, 1.1, -40)], '#0a0a0c', { op: 0.3 }); }); }, [['thigh' + sfx, side(Kn, mul(elb(Hp, Kn, A), -1), 26)], ['shin' + sfx, side(Kn, elb(Hp, Kn, A), 26)]]);
    if (boot) split(f, () => { const rk = add(A, rot(sub(lerp(A, Kn, 0.62), A), deg(-60))); f.raw(`<g transform="rotate(60 ${A[0]} ${A[1]})">`); B.boot(f, A, 1, 54, '#242624', { knee: rk, kneeW: 44, tex: 'mottle' + s, groundY: A[1] + 46 }); f.raw('</g>'); }, [['shin' + sfx, side(A, mul(da, -1), 20)], ['foot' + sfx, side(A, da, 20)]]);
    else { split(f, () => { f.part(K.chain([lerp(Kn, A, 0.5), A], [36, 30], { steps: 4 }), SKN({ fill: mix(skin, skinS, tone) })); }, [['shin' + sfx, side(A, mul(da, -1), 16)]]); split(f, () => V.looseFoot(f, A, deg(78), 52, 40, SKN({ fill: mix(skin, skinS, tone + 0.05) }), { sole: -1 }), [['foot' + sfx, side(A, da, 16)]]); }
  };
  legG(HF2, KF, AF, '_f', 0.2, false);
  f.bone('shin_f'); V.lichtenberg(f, lerp(KF, AF, 0.6), deg(80), 50, 2, { depth: 2, col: '#141010', lite: '#8a8070' });
  legG(HN, KN, AN, '_n', 0, true);
  // torso: the gaunt chest in a ragged wool jumper torn open over the ribs, the ribs fused to the cage's front strap
  f.bone('torso');
  const torso = [[760, 430], [810, 432], [846, 470], [852, 540], [840, 620], [820, 690], [760, 704], [728, 690], [716, 610], [714, 520], [726, 460]];
  f.part(torso, V.WO(f, { fill: '#5e5c56', tex: 'knit' + s }));
  const rip = [[784, 576], [836, 584], [846, 620], [832, 676], [796, 690], [770, 640]];
  f.part(rip, SKN({ inkW: 1.4, cast: false }));
  for (let i = 0; i < 3; i++) { f.stroke([[780, 596 + i * 28], [814, 588 + i * 28], [842, 600 + i * 28]], 5, '#2a2830', { op: 0.6 }); f.line([[784, 606 + i * 28], [816, 598 + i * 28], [840, 610 + i * 28]], 1.6, P.drownL, { op: 0.6 }); } // ribs
  V.clipDraw(f, rip, () => { V.lichtenberg(f, [846, 620], deg(200), 90, 4, { depth: 3, fork: 0.8, col: '#141010', lite: '#8a8070' }); V.lichtenberg(f, [800, 590], deg(120), 70, 3, { depth: 2, col: '#141010', lite: '#8a8070' }); });
  for (const [a2, b2] of [[[730, 470], [724, 560]], [[760, 520], [770, 600]], [[740, 600], [750, 680]]]) f.stroke([a2, lerp(a2, b2, 0.5), b2], 2.4); f.part([[730, 500], [760, 496], [762, 530], [732, 534]], V.WO(f, { fill: '#4a4842', sharp: true, inkW: 1.1, cast: false })); f.stitches([[730, 500], [760, 496], [762, 530], [732, 534], [730, 500]], P.bone, 0.8); // folds, a patch
  for (const [x, y, r] of [[744, 456, 5], [722, 640, 4]]) { f.flat(ell([x, y], r + 3, r + 2, 0, 9), '#141210', { op: 0.6 }); f.flat(ell([x, y], r, r * 0.8, 0, 8), '#2a1c18'); } // burn holes
  for (const q of [[716, 520], [726, 600], [846, 470], [738, 676]]) f.line([q, add(q, [-8, 14]), add(q, [-4, 26])], 1.2, P.woolL); // unravelled yarn
  f.stroke([[740, 470], [736, 560], [744, 650]], 2.4); V.saltCrust(f, [750, 560], 20, 60, 10);
  f.line([[716, 690], [770, 700], [826, 692]], 5, '#2a2018'); // the belt
  // the noose's frayed end round his neck
  V.rope(f, [[766, 432], [796, 444], [822, 436]], 9, { col: '#5a4e3c' }); V.rope(f, [[776, 440], [770, 476], [778, 510]], 7, { col: '#5a4e3c', fray: true });
  // the storm lantern still hanging at his belt
  f.bone('lantern'); paleLamp(f, [722, 696], 96);
  // head: skin-tight, the jaw fused open against a bar, the eyes gone white, the hair in a stiff singed brush
  f.bone('head');
  f.part(K.chain([[786, 444], add(HC, [-12, 38])], [44, 40], { steps: 4 }), SKN());
  V.standingHair(f, [[-0.3, -0.42], [-0.2, -0.48], [-0.1, -0.52], [0.0, -0.52], [0.1, -0.5], [0.2, -0.44]].map(q => hF([q])[0]), 34, { col: '#2a2420', w: 3, fan: 0.7, lean: -0.1 });
  for (let i = 0; i < 6; i++) { const q = hF([[-0.3 + i * 0.1, -0.5 - (i % 2) * 0.04]])[0]; f.flat(ell(add(q, [0, -30]), 2.4, 2, 0, 6), '#141210', { op: 0.8 }); } // the singed tips
  B.head(f, HC, H, hA, { skin, jaw: 1.0, chin: 0.02, nose: 1.06, hook: 0.3, mouth: 'set', squint: 0.4, browDown: 0.06, gaunt: true, age: true, faceShade: 0.85, faceHatch: false, jawShade: 0.55, iris: '#dcdcd2', eyeWhite: '#dcdcd2', hairCol: '#2a2420' });
  f.flat(hF([[0.16, 0.26], [0.32, 0.25], [0.3, 0.46], [0.2, 0.5], [0.12, 0.4]]), '#0a0808'); // the jaw hanging open
  for (let i = 0; i < 4; i++) f.flat(hF([[0.18 + i * 0.03, 0.26], [0.2 + i * 0.03, 0.26], [0.2 + i * 0.03, 0.3], [0.18 + i * 0.03, 0.3]]), '#c8c0a8');
  f.flat(hF([[0.0, -0.1], [0.12, -0.16], [0.18, -0.04], [0.04, 0.04]]), '#141010', { op: 0.25 });
  V.clipDraw(f, hF([[-0.3, -0.4], [0.36, -0.4], [0.36, 0.55], [-0.3, 0.55]]), () => { V.lichtenberg(f, hF([[0.28, 0.42]])[0], deg(-120), 80, 3.2, { depth: 3, fork: 0.8, col: '#141010', lite: '#8a8070' }); });
  f.line(hF([[0.05, 0.1], [0.12, 0.25]]), 1.4, INK, { op: 0.6 }); f.line(hF([[-0.06, 0.12], [-0.02, 0.3]]), 1.2, INK, { op: 0.5 });

  // ---- the cage's front halves over him: hoops, the front strap fused to his ribs, the near strap, the jaw bar
  f.bone('cage');
  for (const h of hoops) hoopHalf(h, true);
  { const L = strapLine(-0.15, true); f.line(L, 10, INK); f.line(L, 6.6, P.iron); f.line(L.map(q => add(q, [-1.5, 0])), 1.4, P.ironL, { op: 0.6 }); }
  { const L = strapLine(0.35, true); f.line(L, 10, INK); f.line(L, 6.6, P.iron); }
  f.line([[cx(282) - 40, 296], [cx(282) + 30, 262], [cx(282) + 56, 300]], 10, INK); f.line([[cx(282) - 40, 296], [cx(282) + 30, 262], [cx(282) + 56, 300]], 6.6, P.iron); // crown bar, front
  // where the bars are fused into him: the jaw, the ribs, the wrists; a fused weld at each, burns spreading
  const jawP = hF([[0.24, 0.44]])[0]; f.line([[cx(380) + 60, 360], jawP, [cx(420) + 66, 420]], 9, INK); f.line([[cx(380) + 60, 360], jawP, [cx(420) + 66, 420]], 5.6, P.iron); V.weld(f, jawP, deg(70), 16, { burns: [[deg(160), 40, 2]] });
  for (const y of [500, 560]) V.weld(f, [cx(y) + 74, y], deg(90), 16, { burns: [[deg(190), 36, 2]] });
  // the padlocked hasp fused shut at the front of the hip hoop
  { const q = [cx(706) + 40, 720]; f.part([add(q, [-10, -10]), add(q, [12, -12]), add(q, [14, 14]), add(q, [-10, 16])], IRN()); f.line(ell(add(q, [2, 18]), 8, 9, 0, 10).slice(6, 13), 4, INK); f.part([add(q, [-12, 22]), add(q, [16, 20]), add(q, [18, 44]), add(q, [-10, 46])], IRN({ fill: P.rust, light: P.rustL })); f.flat(ell(add(q, [3, 34]), 2.4, 4, 0, 6), '#060606'); V.weld(f, add(q, [2, 16]), 0, 14, { burns: [], rim: false }); }
  // the rusted spike driven through the cage's foot, the dead gull caught in the bars, droppings on the cage top
  { const q = [cx(706) - 70, 712]; f.part([add(q, [-40, -6]), add(q, [20, -4]), add(q, [40, 0]), add(q, [20, 4]), add(q, [-40, 6])], IRN({ fill: P.rust, light: P.rustL })); f.part(ell(add(q, [-42, 0]), 6, 9, 0, 8), IRN({ fill: P.rustD })); }
  { const g = [cx(540) - 96, 566]; // a gull, dead, caught head-down by one wing in the bars: the white body, grey mantle, black-tipped primaries
    V.feather(f, add(g, [6, -22]), deg(-60), 96, 20, V.FE(f, { fill: '#a8aeb4' }), { lead: 0.35, round: true, dark: 0.3, darkCol: '#1a1a1e', darkOp: 0.8, emarg: 0.4 }); // the caught wing, up and out through the bars
    f.part([add(g, [-12, -26]), add(g, [14, -30]), add(g, [20, 0]), add(g, [10, 34]), add(g, [-6, 40]), add(g, [-16, 10])], { fill: '#dcdcd4', shadow: '#6a6a72', shade: 0.38, tex: 'barb' + s, texOp: 0.4, inkW: 1.2 });
    V.feather(f, add(g, [-10, -16]), deg(118), 74, 16, V.FE(f, { fill: '#9aa0a6' }), { lead: 0.4, round: true, dark: 0.35, darkCol: '#1a1a1e', darkOp: 0.8 }); // the other wing hanging down, broken
    f.part([add(g, [-6, 36]), add(g, [8, 40]), add(g, [8, 58]), add(g, [-6, 54])], { fill: '#d8d8d0', shade: 0.35, inkW: 1, cast: false }); f.part([add(g, [-2, 56]), add(g, [6, 56]), add(g, [4, 76]), [...add(g, [0, 80]), 1], add(g, [-2, 70])], { fill: P.lampD, shade: 0.3, inkW: 0.9, cast: false }); f.flat(ell(add(g, [4, 46]), 2, 2, 0, 6), '#0a0a0a');
    for (const dx of [-6, 4]) f.line([add(g, [dx, -28]), add(g, [dx + 2, -44]), add(g, [dx + 6, -50])], 2, '#5a4a3a'); }
  for (let i = 0; i < 14; i++) { const q = [cx(282) - 50 + f.r() * 100, 250 + f.r() * 40]; f.flat(lumpE(f, q, 4 + f.r() * 5, 2 + f.r() * 3, 0, 0.4, 8), '#e8e8e0', { op: 0.85 }); f.line([q, add(q, [f.r() * 4 - 2, 8 + f.r() * 14])], 1.4, '#d8d8d0', { op: 0.7 }); } // droppings crusting the cage top
  for (const [x, y] of [[cx(452) + 98, 452], [cx(540) - 92, 540], [cx(626) + 84, 626], [cx(706) - 92, 706], [cx(404) + 60, 404]]) f.rivet([x, y], 4, P.ironL);
  V.scorch(f, [cx(452), 440], 50, 14, 0.45); for (const [x, y] of [[cx(452) + 70, 456], [cx(626) - 60, 630]]) { f.flat(ell([x, y], 9, 5, 0, 8), '#0a0808', { op: 0.8 }); f.flat(ell([x, y], 3, 2, 0, 6), P.lampL, { op: 0.8 }); } // fused beads where strikes welded the hoops
  for (const y of [540, 626, 706]) f.flat([[cx(y) + 20, y + 14], [cx(y) + 24, y + 40], [cx(y) + 16, y + 36]], P.rust, { op: 0.6 });
  // near arm: up the front of the cage, the wrist fused to the front strap, the fingers clenched round the bar
  f.bone('torso');
  f.part(K.chain([SN, EN, WN], [44, 38, 32], { steps: 8, bp: [[0, 0.4, 0.1]] }), SKN());
  f.part(K.ragLimb(f, SN, lerp(SN, EN, 0.6), 50, 46, { depth: 8, teeth: 5 }), V.WO(f, { fill: '#5e5c56', tex: 'knit' + s, cast: false }));
  V.lichtenberg(f, lp(EN, WN, 0.85, 0), ang(WN, EN), 80, 2.6, { depth: 2, col: '#141010', lite: '#8a8070' });
  const barN = [cx(560) + 92, 560];
  f.line([add(barN, [-6, -60]), add(barN, [4, 60])], 10, INK); f.line([add(barN, [-6, -60]), add(barN, [4, 60])], 6.6, P.iron); // the side strap he holds
  B.grip(f, barN, EN, deg(-85), 30, mix(skin, skinS, 0.1), { tex: 'wrinkle' + s, texOp: 0.4, shadow: skinS, name: 'gibbet near' });
  V.weld(f, lerp(barN, EN, 0.28), ang(EN, barN), 18, { burns: [[ang(barN, EN), 50, 2]] });
  return f;
}

// ------------------------------------------------------------------ THE WIND-SELLER (ruler, 3.5)
// The coast's wise-woman, who sold sailors their winds tied in knotted cords and whistled up storms for the wreckers.
// A giant, gaunt old woman on a sea-stack in the surf, the stack's foot in the waves at the bottom of the frame, the top
// of her head and her hair cut off by the frame top. She leans forward over the edge, one foot on a lower ledge, and a
// long knotted cord runs from her hands up out of the frame into the storm. Struck so often that Lichtenberg ferns cover
// her from scalp to ankle in a lace of white scars; her long grey hair stands straight up into the wind, stiff; her
// fingers are fused to the cord at the knuckles. Soaked pale and sea-wrinkled, barnacles crusting her bare feet and
// shins. The cord is tarred hemp with a knot every arm's length, three untied and frayed. Layered grey wool shawls,
// soaked and hanging plumb, pinned with bone pins, the hems frayed and fused stiff; a sailor's oilskin coat taken in
// payment, far too big; a string of payment coins and ships' buttons; a bird-bone whistle; a sack of knotted cords at
// the hip; a dead gull at the belt; a carved wooden ship charm; kelp round the ankles; a driftwood staff leaning on the
// stack; a broken ship's lantern at her feet. Canvas heightened (same scale) so the stack's foot and her face both show.
// Rig: stack (root: rock, surf, staff, lantern) > pelvis > torso > head > hair; arms upperarm/forearm/hand near and far;
// cord (parent hand_n: the fingers are fused to it); thigh/shin/foot near and far; shawl_skirt (pelvis).
// Motion: idle the fingers worrying at the next knot (hands, forearms) and a low whistle (head); attack a knot untied
// (the hands part on the cord, the torso rears back).
function windSeller() {
  const CW = 1700, CH = 1900, f = new Fig(V.base(621, CH)); V.textures(f);
  const gy = f.o.groundY, s = '621', H = 330;
  const skin = '#a89c8a', skinS = '#3a3240', handS = '#584a4a';
  const SKN = (o = {}) => Object.assign({ fill: skin, shadow: skinS, light: '#d4cab4', shade: 0.32, tex: 'wrinkle' + s, texOp: 0.55 }, o);
  const shawl = '#5e5e5a', shawlD = '#3e3e3c', shawlL = '#84847e';
  const SH = (o = {}) => Object.assign({ fill: shawl, shadow: '#161618', light: shawlL, shade: 0.42, tex: 'knit' + s, texOp: 0.55, maxShade: 120 }, o);
  const OIL = (o = {}) => V.OI(f, Object.assign({ texOp: 0.6, maxShade: 120 }, o));
  const scarL = (c, a2, L2, w, depth = 2) => V.lichtenberg(f, c, a2, L2, w, { pale: true, depth, col: '#e6e2d8', fork: 0.8 }); // the white lace of scars
  const N = [1010, 380], C = [800, 560], PV = [620, 920];
  const S = B.spine(N, C, PV, H);
  const SN = S.at(-0.2, 0.14), SF = S.at(0.4, 0.06);
  const cord0 = [1500, -20], cordA = [1190, 600], cordB = [1136, 707], cordQ = [1240, 470]; // the cord from the storm down through both fists, clear of the face
  const WN = cordA, WF = cordB, EN = [940, 650], EF = [930, 590];
  const HN = S.at(0.1, 1.0), KN = [800, 1300], AN = [806, 1640];
  const HF = S.at(-0.3, 0.98), KF = [560, 1260], AF = [520, 1560];
  const HC = [1150, 230], hA = -0.18, hF = frame(HC, hA, H);
  const top = 1592, ledge = 1676;
  f.joint('stack', [600, gy]);
  V.humanJoints(f, { P: PV, T: S.at(0, 0.85), N: [1016, 372], SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joints.pelvis.parent = 'stack';
  f.joint('cord', WN, 'hand_n').joint('hair', hF([[-0.1, -0.3]])[0], 'head').joint('shawl_skirt', S.at(0, 0.92), 'pelvis');

  // ---- the sea-stack: a pillar of bedded rock with a lit top, a stepped lower ledge, a dark sea face, cracks, guano,
  // weed and barnacles at the waterline; the surf breaking white round its foot
  f.bone('stack');
  const stk = [[240, gy + 40], [270, 1800], [300, 1700], [350, top + 10], [400, top - 6], [560, top - 14], [690, top - 4], [720, ledge - 30], [760, ledge - 6], [930, ledge - 10], [980, 1720], [1020, 1800], [1060, gy + 40]];
  f.part(stk, { fill: '#4e545a', shadow: '#181c22', light: '#8a9298', shade: 0.42, tex: 'pit' + s, texOp: 0.6, maxShade: 50 });
  V.clipDraw(f, stk, () => {
    f.flat([[700, ledge], [1100, ledge], [1100, gy + 40], [700, gy + 40]], '#0c0e12', { op: 0.35 }); // the sea face in shadow
    f.flat([[350, top + 10], [700, top - 4], [700, top + 30], [350, top + 40]], '#a0a8ae', { op: 0.3 }); f.flat([[720, ledge - 6], [940, ledge - 10], [940, ledge + 16], [720, ledge + 20]], '#a0a8ae', { op: 0.3 }); // the lit top faces
    for (let i = 0; i < 7; i++) { const y = top + 50 + i * 36; f.line([[200, y], [420, y - 6], [640, y + 4], [860, y - 4], [1100, y + 6]], 1.4, INK, { op: 0.45 }); f.line([[200, y + 3], [420, y - 3], [640, y + 7]], 1, '#8a9298', { op: 0.3 }); } // bedding planes
    for (const [x0, y0] of [[480, top + 20], [760, ledge + 10], [400, 1780]]) f.stroke([[x0, y0], [x0 + 10, y0 + 60], [x0 - 4, y0 + 120], [x0 + 6, y0 + 180]], 4, '#0a0c0e', { op: 0.6 }); // cracks
    for (let i = 0; i < 26; i++) { const q = [360 + f.r() * 560, top + f.r() * 60]; f.flat([q, add(q, [4 - f.r() * 8, 10 + f.r() * 30]), add(q, [6, 4])], '#d8d8d0', { op: 0.6 }); } // guano streaks
    V.barnacles(f, [640, 1820], 360, 30, 40, 4, 10); V.saltCrust(f, [640, 1760], 340, 30, 30);
  });
  for (const x of [320, 500, 700, 900]) V.kelpHang(f, [x, 1790 + (x % 3) * 6], 70, 9, 4);
  // the driftwood staff leaning against the stack, the broken ship's lantern at her feet
  const st0 = [300, 1840], st1 = [430, 1430]; f.part(limb(st0, st1, 30, 22, { steps: 10 }), V.WD(f, { fill: '#8a8070', light: '#b8ae9a', tex: 'wood' + s, texOp: 0.8 }));
  for (let i = 0; i < 4; i++) f.flat(ell(lp(st0, st1, 0.2 + i * 0.2, (i % 2 ? 6 : -6)), 6, 3, ang(st0, st1), 8), '#3a342a', { op: 0.7 }); f.line([lp(st0, st1, 0.05, -6), lp(st0, st1, 0.95, -5)], 1.4, '#e0d8c4', { op: 0.5, straight: true });
  for (const [t, L2, col] of [[0.78, 90, '#3a3024'], [0.86, 130, '#6e6048'], [0.92, 70, '#2a2418']]) { const q = lp(st0, st1, t, 0); f.line([add(q, [-16, -4]), add(q, [16, 4])], 5, col); const pts = [q, add(q, [-L2 * 0.4, L2 * 0.3]), add(q, [-L2 * 0.8, L2 * 0.4]), add(q, [-L2, L2 * 0.7])]; V.rope(f, pts, 5, { col, fray: true }); for (let k = 1; k < 3; k++) f.part(lumpE(f, pts[k], 8, 7, 0, 0.3), { fill: col, inkW: 1.1, cast: false }); } // winds for sale tied to the staff, blown back
  { const lt = [452, top - 116]; const L2 = V.stormLantern(f, lt, 100, { glowOp: 0.0 }); { const c = add(lt, [0, 62]), w = 52; f.flat([[c[0] - w * 0.32, c[1] - 20], [c[0] - w * 0.44, c[1]], [c[0] - w * 0.36, c[1] + 18], [c[0] + w * 0.36, c[1] + 18], [c[0] + w * 0.44, c[1]], [c[0] + w * 0.32, c[1] - 20]], '#1a1a18', { op: 0.82 }); f.line([add(c, [-14, -18]), add(c, [-4, -2]), add(c, [-12, 10])], 1.6, '#b8b8ae', { op: 0.7 }); } f.flat([add(lt, [-20, 50]), add(lt, [0, 40]), add(lt, [24, 54]), add(lt, [8, 70])], '#0a0a0a'); for (let i = 0; i < 5; i++) f.flat([add(lt, [-40 + i * 18, 96]), add(lt, [-34 + i * 18, 88]), add(lt, [-28 + i * 18, 96])], '#d8d8c8', { op: 0.8 }); } // broken: the glass shattered round it
  // the surf breaking round the stack's foot
  f.part([[0, gy - 20], [200, gy - 34], [400, gy - 10], [700, gy - 30], [1000, gy - 14], [1300, gy - 30], [1700, gy - 16], [1700, CH, 1], [0, CH, 1]], { fill: P.sea, shadow: P.seaD, light: P.seaL, shade: 0.4, tex: 'mottle' + s, texOp: 0.5, inkW: 0, cast: false });
  for (let x = 120; x < 1300; x += 14 + f.r() * 18) { const q = [x, gy - 24 + (f.r() - 0.5) * 16]; f.flat(lumpE(f, q, 10 + f.r() * 16, 5 + f.r() * 6, 0, 0.4, 10), f.r() > 0.35 ? P.foam : P.surfD, { op: 0.9 }); }
  for (const [x, h2] of [[260, 120], [1040, 140], [700, 80]]) for (let k = 0; k < 7; k++) { const q = [x + (f.r() - 0.5) * 60, gy - 30 - f.r() * h2]; f.flat(lumpE(f, q, 6 + f.r() * 10, 4 + f.r() * 6, 0, 0.5, 8), P.foam, { op: 0.75 }); } // spray thrown up the rock

  // ---- far leg: on the stack top behind; gaunt, bare from mid-shin, barnacles, kelp round the ankle
  const legWS = (Hp, Kn, A, sfx, wq, tone, foot) => {
    const da = ankleCut(Kn, A);
    split(f, () => { f.part(K.chain([lerp(Kn, A, 0.2), lerp(Kn, A, 0.6), A], [wq * 0.62, wq * 0.52, wq * 0.42], { steps: 6, bq: [[0, 0.5, 0.12]] }), SKN({ fill: mix(skin, skinS, tone) })); V.clipDraw(f, K.chain([lerp(Kn, A, 0.2), A], [wq * 0.62, wq * 0.42], { steps: 4 }), () => { scarL(lerp(Kn, A, 0.3), ang(Kn, A), 260, 3.4, 3); V.barnacles(f, lerp(Kn, A, 0.85), wq * 0.3, 40, 12, 5, 11); }); f.line([lp(Kn, A, 0.3, wq * 0.2), lp(Kn, A, 0.9, wq * 0.12)], 2, '#e8e4d8', { op: 0.4 }); }, [['shin' + sfx, side(A, mul(da, -1), wq * 0.25)]]);
    split(f, () => { K.bareLeg(f, lerp(Kn, A, 0.85), A, 1, 150, wq * 0.44, SKN({ fill: mix(skin, skinS, tone + 0.05), shadow: handS }), { swell: 0.4 }); V.barnacles(f, add(A, [80, 60]), 60, 14, 12, 5, 12); }, [['foot' + sfx, side(A, da, wq * 0.25)]]);
    f.bone('shin' + sfx); for (let i = 0; i < 3; i++) V.rope(f, [lp(Kn, A, 0.9 - i * 0.05, -wq * 0.3), lp(Kn, A, 0.92 - i * 0.05, 0), lp(Kn, A, 0.9 - i * 0.05, wq * 0.3)], 9, { col: P.kelp }); V.kelpHang(f, lp(Kn, A, 0.9, wq * 0.2), 90, 9, 6);
    split(f, () => f.part(K.chain([Hp, Kn, lerp(Kn, A, 0.3)], [wq * 1.2, wq * 0.9, wq * 0.7], { steps: 8 }), SKN({ fill: mix(skin, skinS, tone + 0.1) })), [['thigh' + sfx, side(Kn, mul(elb(Hp, Kn, A), -1), wq * 0.4)], ['shin' + sfx, side(Kn, elb(Hp, Kn, A), wq * 0.4)]]);
  };
  { const ff = [520, top - 10]; AF[0] = ff[0]; AF[1] = top - 104; }
  f.joints.foot_f.pivot = AF.slice();
  const gyBak = f.o.groundY; f.o.groundY = top - 8; legWS(HF, KF, AF, '_f', 150, 0.2); f.o.groundY = gyBak;

  // ---- near leg, forward on the lower ledge
  { AN[0] = 820; AN[1] = ledge - 104; f.joints.foot_n.pivot = AN.slice(); }
  f.o.groundY = ledge - 8; legWS(HN, KN, AN, '_n', 156, 0.0); f.o.groundY = gyBak;
  // ---- the far arm, behind: the oilskin sleeve, the sharp far elbow pushing the cloth
  f.bone('upperarm_f');
  f.part(K.chain([SF, EF], [132, 112], { steps: 6, bq: [[0, 0.8, 0.1]] }), OIL({ fill: '#22262a' }));
  for (let i = 0; i < 3; i++) f.stroke([lp(SF, EF, 0.5 + i * 0.14, -50), lp(SF, EF, 0.56 + i * 0.14, 0), lp(SF, EF, 0.5 + i * 0.14, 50)], 2.4, '#060807', { op: 0.6 });

  // a torn, wet hem: uneven strips hanging plumb (the Drowned King's hem), some long, some short, a few blown back
  // (ruler upgrade pass) each strip ends in a torn, squarish tip of its own width (two corners at different depths), so the
  // hem is not a sawtooth of identical points
  const rag = (a, b, n, depth, blow = 0) => { const r = []; for (let i = 1; i < n; i++) { const q = lerp(a, b, (i + (f.r() - 0.5) * 0.7) / n), d = (i % 2 ? 1 : 0.2) * depth * (0.3 + f.r() * 1.2) * (i % 5 === 1 ? 1.6 : 1); if (i % 2) { const tw = 8 + f.r() * 16, bx = blow * d / depth; r.push([q[0] + tw / 2 - bx, q[1] + d * (0.78 + f.r() * 0.3), 1], [q[0] - tw / 2 - bx, q[1] + d, 1]); } else r.push([q[0], q[1] + d, 0]); } return r; };
  const valley = (pts, w = 5) => { f.stroke(pts, w * 1.6, '#0a0a0c', { op: 0.7 }); f.stroke(pts.map(q => add(q, [w * 1.4, -w * 0.6])), w * 2.4, '#000', { op: 0.12 }); f.line(pts.map(q => add(q, [w * 2 + 3, -2])), 2.4, shawlL, { op: 0.45 }); }; // a fold: the dark crease, the soft shadow of its slope, the lit ridge beside it // a deep fold: the dark valley and the lit ridge beside it

  // ---- the skirts: the oilskin coat's long back skirt and two shawl-wool skirts, sodden, clinging over the near knee,
  // dragged back by the wind, the hems torn into uneven wet strips
  f.bone('shawl_skirt');
  const knee = [KN[0] + 40, KN[1] - 20];
  // (ruler upgrade pass) the three skirts read as three layers at sheet size: each its own value (the outer shawl skirt
  // lightest, the under-skirt a step darker, the oilskin darkest but glossy), each with a broad lit front plane where it
  // turns to the light, fold ridges wide enough to survive 0.3x, its own woven border, the hem soaked dark with the wet
  // wicking up unevenly to a glistening edge, and the layer above casting a shadow band onto it
  const r0h = rag([870, 1430], [330, 1480], 16, 60, 30);
  const sk0 = [S.at(-0.8, 0.8), S.at(0.5, 0.92), [880, 1130], [900, 1300], [870, 1420], ...r0h, [330, 1460], [360, 1200], S.at(-0.96, 0.98)];
  f.part(sk0, OIL({ fill: '#262b2e', light: '#6a7472' }));
  const r1h = rag([knee[0] + 20, 1366], [400, 1396], 13, 50, 24);
  const sk1 = [S.at(-0.76, 0.86), S.at(0.6, 0.9), [knee[0] + 40, knee[1] - 120], [knee[0] + 56, knee[1] - 20], [knee[0] + 34, knee[1] + 80], ...r1h, [394, 1380], [420, 1180], S.at(-0.9, 1.0)];
  const r2h = rag([knee[0] + 36, knee[1] - 30], [440, 1232], 12, 56, 34);
  const sk2 = [S.at(-0.84, 0.8), S.at(0.62, 0.84), [knee[0] + 20, knee[1] - 200], [knee[0] + 50, knee[1] - 90], ...r2h, [430, 1250], [450, 1100], S.at(-0.98, 0.98)];
  const skFold = (pts, w, litOp = 0.5) => { // a fold: a dark valley, the soft slope beside it, a broad lit ridge on the light (front) side
    f.stroke(pts, w * 1.5, '#060607', { op: 0.62, taper: 'start' });
    f.stroke(pts.map(q => add(q, [-w * 1.3, 0])), w * 2.6, '#000', { op: 0.16, taper: 'start' });
    f.stroke(pts.map(q => add(q, [w * 1.9, -2])), w * 1.8, '#d2d2c8', { op: litOp * 0.42, taper: 'start' });
    f.line(pts.map(q => add(q, [w * 1.5, -2])).slice(1), Math.max(2.4, w * 0.5), '#e2e2d8', { op: litOp });
  };
  const soak = (a, b, hi, lo, sd, sheen = true) => { // the hem soaked dark; the wet wicks up unevenly and its edge glistens
    const r = E.rng(sd), top = [], bot = [];
    for (let i = 0; i <= 14; i++) { const q = lerp(a, b, i / 14), h = lo + Math.pow(r(), 0.8) * (hi - lo); top.push(add(q, [0, -h])); bot.push(add(q, [0, 140])); }
    f.flat([...top, ...bot.slice().reverse()], '#0a0a0c', { op: 0.36 });
    f.flat([...top.map((q, i) => add(q, [0, (i % 3 + 1) * 12 + 18])), ...bot.slice().reverse()], '#050506', { op: 0.22 });
    for (let k = 0; k < 7; k++) { const q = lerp(top[k * 2], top[k * 2 + 1], 0.5), L = 30 + r() * 70; f.stroke([add(q, [0, 20]), add(q, [3, -L * 0.5]), add(q, [-2, -L])], 9, '#0a0a0c', { op: 0.3, taper: 'end' }); } // wet streaks running up
    if (sheen) V.wetSheen(f, top.map(q => add(q, [0, 10])), 2.6, 0.55);
    return top;
  };
  const border = (a, b, up, valleysX, stripes) => { // a woven border band parallel to the hem, dipping into each fold valley
    for (const [dy, w, col, op] of stripes) { const pts = []; for (let i = 0; i <= 20; i++) { const q = lerp(a, b, i / 20); let dip = 0; for (const vx of valleysX) dip += 16 * Math.exp(-Math.pow((q[0] - vx) / 34, 2)); pts.push(add(q, [0, -up + dy + dip])); } f.stroke(pts, w, col, { op }); }
  };
  const castBand = (hemPts, w = 36, op = 0.42) => { const hp = hemPts.map(q => [q[0], q[1]]); f.stroke(hp.map(q => add(q, [-6, 16])), w, '#050506', { op }); f.stroke(hp.map(q => add(q, [-6, 40])), w * 0.9, '#050506', { op: op * 0.4 }); };
  // the oilskin back skirt: dark, but glossy where the rain runs off it
  V.clipDraw(f, sk0, () => {
    for (const x of [380, 440, 520, 610, 700, 790]) valley([[x, 1060], [x - 14, 1260], [x - 30, 1460]], 4);
    for (const [x, w] of [[408, 9], [474, 7], [556, 10], [648, 8], [744, 9], [826, 7]]) { f.stroke([[x + 8, 1080], [x - 4, 1260], [x - 18, 1450]], w * 1.6, '#8a9694', { op: 0.18, taper: 'start' }); f.line([[x + 10, 1110], [x - 2, 1270], [x - 14, 1430]], w * 0.4, '#c4ccc8', { op: 0.5 }); } // the gloss on each fold's lit ridge
    castBand(r1h, 40, 0.5);
    soak([870, 1470], [330, 1520], 70, 26, 6221, false);
    V.wetSheen(f, [[350, 1100], [346, 1200], [342, 1300], [340, 1400]], 3, 0.5);
  });
  // the under-skirt: grey wool a step darker than the outer one
  f.part(sk1, SH({ fill: '#4a4a46', light: '#8a8a82' }));
  V.clipDraw(f, sk1, () => {
    f.flat([[knee[0] - 150, 1200], [knee[0] + 60, 1180], [knee[0] + 60, 1420], [knee[0] - 170, 1420]], '#d4d4ca', { op: 0.12 }); // the front turning to the light
    for (const [x, w] of [[470, 6], [560, 7], [650, 6], [740, 7]]) skFold([[x, 1240], [x - 10, 1320], [x - 26, 1410]], w, 0.45);
    castBand(r2h, 40, 0.5);
    border([knee[0] + 30, 1386], [400, 1416], 64, [446, 536, 624, 714], [[0, 16, '#22221f', 0.7], [-16, 4, '#b8b4a6', 0.6]]); // a dark woven band with a pale thread
    soak([knee[0] + 20, 1390], [400, 1420], 48, 16, 6222);
  });
  f.part(sk2, SH({ fill: '#6c6c66', light: '#a6a69c' }));
  V.clipDraw(f, sk2, () => {
    // the near knee pushes the wet cloth: the knee's round is the brightest plane on the skirts, folds pulled taut over
    // it with lit ridges, slack valleys dragging back and down from it
    f.flat(lumpE(f, add(knee, [-6, -50]), 96, 120, 0.3, 0.15), '#e6e6dc', { op: 0.16 });
    f.flat(lumpE(f, add(knee, [10, -60]), 54, 74, 0.3, 0.2), '#f0f0e6', { op: 0.2 });
    for (let k = 0; k < 4; k++) { const pts = [add(knee, [-20 - k * 30, -110 + k * 20]), add(knee, [10 - k * 10, -40 + k * 10]), add(knee, [-10 - k * 20, 40 + k * 20])]; f.stroke(pts, 4, '#0a0a0c', { op: 0.55 }); f.line(pts.map(q => add(q, [9, -4])), 3, '#ecece2', { op: 0.5 }); }
    // the slack folds from the belt: wide enough to read at sheet size
    for (const [x, w] of [[470, 9], [540, 10], [610, 9], [680, 10], [740, 7]]) skFold([[x, 980], [x - 18, 1120], [x - 40, 1290]], w, 0.55);
    // the back of the skirt turning away from the light under the hump
    f.flat([[300, 900], [470, 920], [440, 1100], [420, 1320], [300, 1320]], '#08080a', { op: 0.2 });
    hatchIn(f, [[300, 900], [450, 920], [420, 1120], [400, 1320], [300, 1320]], deg(62), 10, '#08080a', 0.3, 1.3);
    border([knee[0] + 36, knee[1] - 30], [440, 1232], 90, [452, 522, 592, 662, 730], [[0, 7, '#c4c0b2', 0.62], [16, 7, '#c4c0b2', 0.5], [8, 6, '#2a2a26', 0.55]]); // two pale stripes woven near the hem
    soak([knee[0] + 36, knee[1] - 20], [440, 1242], 66, 22, 6223);
    V.saltCrust(f, [640, 1120], 200, 70, 34);
  });
  // a tear in the outer skirt showing the dark layer under, a darn, threads hanging from the strips
  { const t0 = [560, 1180]; f.part([add(t0, [-30, -10]), add(t0, [6, -26]), add(t0, [34, 0]), add(t0, [20, 40]), add(t0, [-12, 50]), add(t0, [-34, 24])].map((q, i) => i % 2 ? [...q, 1] : q), OIL({ fill: '#16181a', cast: false, inkW: 1.4 })); for (const q of [add(t0, [-30, -10]), add(t0, [34, 0]), add(t0, [-12, 50])]) f.line([q, add(q, [4, 14]), add(q, [-2, 26])], 1.4, shawlL); }
  { const d0 = [700, 1060]; f.part([add(d0, [-34, -20]), add(d0, [30, -24]), add(d0, [34, 22]), add(d0, [-30, 26])], SH({ fill: '#4e4e4a', inkW: 1.2, cast: false })); for (let i = 0; i < 6; i++) f.line([add(d0, [-30, -16 + i * 8]), add(d0, [30, -20 + i * 8])], 1, P.bone, { op: 0.55 }); for (let i = 0; i < 6; i++) f.line([add(d0, [-26 + i * 10, -22]), add(d0, [-24 + i * 10, 24])], 1, P.bone, { op: 0.45 }); } // a darn
  for (const sk of [sk1, sk2]) for (const q of sk.filter(q => q[2] === 1)) { const L2 = 10 + f.r() * 34; f.line([q, add(q, [-4, L2 * 0.6]), add(q, [-8 + f.r() * 6, L2])], 1.6, shawlL, { op: 0.75 }); if (f.r() > 0.6) V.drip(f, add(q, [-6, L2 + 2]), 1.6); }
  V.lichtenberg(f, [760, 1300], deg(-110), 220, 3.4, { depth: 3, col: '#141210', lite: '#6a6660' }); V.scorch(f, [760, 1310], 50, 18, 0.5);

  // ---- the rope belt hung with the winds she sells: knotted cords of hemp and tarred line, each knot a wind; a purse
  // with an iron clasp (the burns spread from it); a sack of more cords; the dead gull; charms
  const belt = [S.at(-0.9, 0.86), S.at(-0.3, 0.92), S.at(0.3, 0.94), S.at(0.66, 0.9)];
  { f.bone('shawl_skirt');
    { const q = S.at(-0.8, 1.02); f.part([add(q, [-60, -20]), add(q, [50, -30]), add(q, [70, 120]), add(q, [30, 190]), add(q, [-60, 180]), add(q, [-80, 80])], { fill: '#5a564a', shadow: '#1c1a16', shade: 0.42, tex: 'weave' + s, texOp: 0.6 }); f.stroke([add(q, [-50, -6]), add(q, [44, -16])], 7, '#2a2418'); for (let i = 0; i < 4; i++) { const r0 = add(q, [-36 + i * 22, -24]); V.rope(f, [r0, add(r0, [8 - i * 4, -40]), add(r0, [-6 + i * 8, -70])], 8, { col: '#3a3024', fray: true }); f.part(ell(add(r0, [4, -40]), 10, 9, 0, 10), { fill: '#3a3024', inkW: 1.2, cast: false }); } } // the sack of cords
    const winds = [[-0.6, 150, '#3a3024'], [-0.42, 220, '#6e6048'], [-0.24, 120, '#2a2418'], [-0.06, 260, '#8a7a5a'], [0.12, 180, '#3a3024'], [0.3, 200, '#6e6048']];
    winds.forEach(([u, L2, col], i) => { const r0 = S.at(u, 0.93), sw = -26 - i * 6, pts = [r0, add(r0, [sw * 0.3, L2 * 0.35]), add(r0, [sw * 0.7, L2 * 0.7]), add(r0, [sw, L2])]; V.rope(f, pts, 6 + (i % 2) * 2, { col, fray: true }); for (let k = 1; k <= 3; k++) { const q = lerp(pts[Math.min(2, k - 1)], pts[Math.min(3, k)], 0.5); f.part(lumpE(f, q, 9 + (i % 2) * 2, 8, 0, 0.3), { fill: col, shadow: '#0c0a06', shade: 0.42, inkW: 1.3, cast: false, tex: 'hatch' + s, texOp: 0.4 }); f.line([add(q, [-5, -4]), add(q, [5, 4])], 1.2, INK, { op: 0.6 }); } }); // the winds for sale, three knots to a cord, blown back
    { const q = S.at(0.46, 1.0); f.line([q, add(q, [6, 30])], 3, '#2a2418'); const pb = add(q, [6, 30]); f.part([add(pb, [-30, 0]), add(pb, [30, -4]), add(pb, [40, 50]), add(pb, [16, 80]), add(pb, [-20, 80]), add(pb, [-40, 46])], { fill: '#4a3a2c', shadow: '#140c08', light: '#7a6450', shade: 0.42, tex: 'mottle' + s, texOp: 0.6, inkW: 1.4 }); f.part([add(pb, [-28, -6]), add(pb, [28, -10]), add(pb, [30, 4]), add(pb, [-28, 8])], V.IR(f, { inkW: 1.2, cast: false })); f.part(ell(add(pb, [0, -14]), 7, 7, 0, 8), V.IR(f, { inkW: 1, cast: false })); f.stitches([add(pb, [-34, 40]), add(pb, [-14, 76]), add(pb, [14, 76]), add(pb, [36, 44])], '#a08060', 1); V.weld(f, add(pb, [24, 0]), 0, 14, { burns: [[deg(70), 90, 2.4], [deg(20), 60, 1.8]], rim: false }); } // the purse, its iron clasp struck: the burn spreads down the leather
    { const g = S.at(0.6, 1.06); f.line([g, add(g, [10, 40])], 4, '#3a3024'); const gb = add(g, [10, 40]); f.part([add(gb, [-18, 0]), add(gb, [20, -4]), add(gb, [30, 60]), add(gb, [14, 120]), add(gb, [-10, 110]), add(gb, [-24, 50])], { fill: '#dcdcd4', shadow: '#6a6a72', shade: 0.38, tex: 'barb' + s, texOp: 0.4, inkW: 1.4 }); V.feather(f, add(gb, [-10, 20]), deg(100), 150, 30, V.FE(f, { fill: '#9aa0a6' }), { lead: 0.4, round: true, dark: 0.35, darkCol: '#1a1a1e', darkOp: 0.8 }); f.part([add(gb, [6, 116]), add(gb, [16, 120]), add(gb, [10, 160]), add(gb, [2, 150])], { fill: P.lampD, shade: 0.3, inkW: 1, cast: false }); f.flat(ell(add(gb, [8, 100]), 3, 3, 0, 6), '#0a0a0a'); } // the dead gull
  }

  // ---- torso: a bent old body under the oilskin coat far too big: the hump of the back high, the coat dragging down
  // from it in folds, cinched by the rope belt
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.4, 0.3], [0.1, 0.8, 0.5], [0.26, 1.02, 0.62], [0.44, 0.94, 0.58], [0.64, 0.7, 0.5], [0.8, 0.6, 0.46], [0.9, 0.64, 0.5], [1.0, 0.86, 0.66], [1.08, 0.9, 0.6]]); // the hump high, the waist pinched in by the belt, the hips under the coat
  f.part(torso, OIL());
  V.clipDraw(f, torso, () => {
    for (const [u, w] of [[-0.85, 5], [-0.6, 4], [-0.35, 4.4], [-0.1, 3.6], [0.2, 3.4]]) valley([S.at(u * 1.05, 0.32), S.at(u * 0.85, 0.62), S.at(u * 0.6, 0.86)], w); // the coat hangs from the hump in folds that pull in to the belt
    for (const [u, w] of [[-0.8, 4], [-0.4, 3.4], [0.0, 3.4], [0.36, 3]]) valley([S.at(u * 0.6, 0.94), S.at(u * 1.1, 1.0), S.at(u * 1.3, 1.08)], w); // flaring out below it
    f.flat(S.shape([[0.2, 1.2, -0.5], [0.5, 1.1, -0.4], [0.8, 0.9, -0.3], [1.1, 1.0, -0.4]]), '#050606', { op: 0.35 }); // the back turned away from the light
    for (let i = 0; i < 4; i++) f.stroke([S.at(-0.7 + i * 0.4, 0.8), S.at(-0.6 + i * 0.4, 0.88), S.at(-0.5 + i * 0.4, 0.84)], 3, '#060807', { op: 0.6 }); // bunched under the belt
    V.wetSheen(f, [S.at(-0.85, 0.3), S.at(-0.82, 0.45), S.at(-0.8, 0.6), S.at(-0.78, 0.75)], 3, 0.55); V.saltCrust(f, S.at(-0.4, 0.6), 70, 70, 26);
    f.part([S.at(-0.5, 0.62), S.at(-0.26, 0.6), S.at(-0.24, 0.74), S.at(-0.5, 0.76)], OIL({ fill: '#2e3430', sharp: true, inkW: 1.3, cast: false })); f.stitches([S.at(-0.5, 0.62), S.at(-0.26, 0.6), S.at(-0.24, 0.74), S.at(-0.5, 0.76), S.at(-0.5, 0.62)], P.bone, 1.2); // a patch
  });
  V.rope(f, belt, 12, { col: '#4e4436' }); { const kn = S.at(0.36, 0.94); f.part(lumpE(f, kn, 16, 14, 0, 0.25), { fill: '#4e4436', inkW: 1.4, cast: false, tex: 'hatch' + s, texOp: 0.4 }); V.rope(f, [kn, add(kn, [-14, 60]), add(kn, [-30, 120])], 9, { col: '#4e4436', fray: true }); }

  // ---- the great shawl over the hump and shoulders: grey wool, sodden, clinging to the hump and the shoulder blade, its
  // back point dragged back by the wind, the corners knotted at the breast, holes, a darn, fringe of uneven wet clumps
  const shHem = (() => { const out = [], a = S.at(-1.24, 0.66), tip = add(S.at(-1.0, 0.96), [-90, 60]), b = S.at(0.3, 0.5); const r5 = E.rng(6215); for (let i = 0; i <= 22; i++) { const t = i / 22, base = t < 0.4 ? lerp(a, tip, t / 0.4) : lerp(tip, b, (t - 0.4) / 0.6), d = Math.pow(r5(), 2) * 50; out.push(i % 2 ? [...add(base, [-d * 0.4, d]), 1] : add(base, [0, -r5() * 12])); } return out; })(); // the hem: a long point dragged down the back and blown back, the edge torn unevenly
  const shw = [S.at(0.4, -0.06), S.at(-0.1, -0.12), S.at(-0.6, -0.04), S.at(-1.0, 0.12), S.at(-1.18, 0.34), S.at(-1.24, 0.6), ...shHem, S.at(0.42, 0.42), S.at(0.6, 0.34), S.at(0.66, 0.14)];
  f.part(shw, SH({ fill: '#64645e' }));
  const shY = S.at(-0.1, 0.22); // the near shoulder blade and shoulder ball under the wool
  V.clipDraw(f, shw, () => {
    f.flat(lumpE(f, S.at(-0.5, 0.06), 130, 50, -0.5, 0.2), '#ffffff', { op: 0.06 }); // the crest of the hump catching the light
    f.flat(ell(add(SN, [10, -10]), 70, 50, 0.2, 14), '#ffffff', { op: 0.09 }); f.line(ell(add(SN, [10, -10]), 74, 54, 0.2, 14).slice(6, 13), 2.6, '#0a0a0c', { op: 0.5 }); // the shoulder ball showing through
    // folds radiate from the knot at the breast back over the hump; slack valleys pull down and back with the wind
    const knot = S.at(0.5, 0.26);
    for (const [u, v] of [[-1.1, 0.5], [-0.9, 0.8], [-0.7, 0.14], [-0.6, 0.72], [-0.3, 0.6], [-0.1, 0.04], [0.1, 0.5]]) valley([knot, add(lerp(knot, S.at(u, v), 0.55), [0, 24]), S.at(u, v)], 5.4); // folds from the knot over the hump, sagging between
    for (let k = 0; k < 4; k++) f.stroke([S.at(-1.1 + k * 0.08, 0.46 + k * 0.1), add(S.at(-1.0, 0.8), [-60 + k * 20, 20 + k * 6]), add(S.at(-1.0, 0.94), [-90 + k * 10, 50])], 4, '#0a0a0c', { op: 0.5 }); // pull folds into the dragged point
    f.flat(S.shape([[0.2, -1.2, -0.6], [0.5, -1.3, -0.6]]).map(q => add(q, [-10, 10])), '#0a0a0c', { op: 0.3 }); // the shadow side of the hump
    for (const [c, r] of [[S.at(-0.7, 0.36), 16], [S.at(-0.2, 0.3), 10]]) { f.flat(lumpE(f, c, r * 1.5, r, 0.3, 0.4), '#16181a', { op: 0.9 }); for (let k = 0; k < 4; k++) { const a2 = k * 1.6 + f.r(); f.line([add(c, rot([r * 1.4, 0], a2)), add(c, rot([r * 2, 0], a2 + 0.2))], 1.2, shawlL, { op: 0.7 }); } } // moth and salt holes
    { const d0 = S.at(-0.45, 0.2); f.part([add(d0, [-30, -18]), add(d0, [26, -22]), add(d0, [30, 20]), add(d0, [-26, 24])], SH({ fill: '#56564f', inkW: 1.1, cast: false })); for (let i = 0; i < 5; i++) f.line([add(d0, [-26, -14 + i * 9]), add(d0, [26, -18 + i * 9])], 1, P.bone, { op: 0.55 }); } // a darn
    for (let k = 0; k < 10; k++) { const c = S.at(-1.0 + f.r() * 1.3, 0.1 + f.r() * 0.6), a2 = 1.2 + f.r() * 1.2, L2 = 30 + f.r() * 60; f.stroke([c, add(c, rot([L2 * 0.5, 4], a2)), add(c, rot([L2, -2], a2))], 3, '#0a0a0c', { op: 0.5 }); } // small creases where the wet wool clings
    V.saltCrust(f, S.at(-0.6, 0.3), 100, 60, 30); V.wetSheen(f, [S.at(-0.9, 0.16), S.at(-1.02, 0.26), S.at(-1.08, 0.38)], 3, 0.45);
    V.scorch(f, S.at(0.3, 0.1), 50, 26, 0.4);
    // value breakup (independent review): the crest of the hump keeps the light; the wool wrapping round and under the
    // hump turns away from it into crosshatched shadow; heavy wet folds hang plumb from the crest, each with a dark valley
    // on its shadow side and a lit ridge on its light side; the hem is soaked dark and the wet wicks up it unevenly
    const under = [S.at(-0.8, -0.06), S.at(-0.78, 0.06), add(S.at(-0.86, 0.2), [10, 6]), add(S.at(-0.9, 0.36), [16, 10]), add(S.at(-0.88, 0.56), [26, 4]), add(S.at(-0.8, 0.8), [20, 0]), add(S.at(-0.66, 1.0), [-10, 20]), [200, 900], [120, 600], [300, 120]];
    f.flat(under, '#121214', { op: 0.5 });
    hatchIn(f, under, deg(62), 9, '#08080a', 0.55, 1.4); hatchIn(f, under, deg(-28), 12, '#08080a', 0.35, 1.2);
    const r6 = E.rng(6216), hem0 = add(S.at(-1.0, 0.96), [-90, 60]), hem1 = S.at(0.3, 0.5);
    // folds: curved with the hump, of different lengths, tapering from where they gather to where they open at the hem
    for (const [u0, v0, t1, w0, bow] of [[-0.62, 0.1, 0.04, 16, 70], [-0.36, 0.14, 0.2, 13, 50], [-0.5, 0.42, 0.3, 11, 26], [-0.12, 0.2, 0.46, 12, 40], [0.06, 0.4, 0.62, 10, 20], [-0.22, 0.56, 0.74, 9, 14], [0.22, 0.3, 0.88, 8, 16]]) {
      const c0 = S.at(u0, v0), e0 = add(lerp(hem0, hem1, t1), [0, 24]), dv = E.norm(sub(e0, c0)), pn = [dv[1], -dv[0]]; // pn: toward the back and up (the hump bulges that way)
      const C = V.spline([c0, add(lerp(c0, e0, 0.45), mul(pn, bow)), add(lerp(c0, e0, 0.8), mul(pn, bow * 0.4)), e0], 6);
      const lit = C.map(q => add(q, mul(pn, -w0 * 0.9)));
      f.stroke(C, w0 * 1.5, '#0a0a0c', { op: 0.55, taper: 'start' }); // the valley
      f.stroke(C.map(q => add(q, mul(pn, w0 * 0.9))), w0 * 2.2, '#000', { op: 0.12 }); // its soft shadowed slope
      f.stroke(C.map(q => add(q, mul(pn, -w0 * 1.6))), w0 * 1.6, '#c8c8be', { op: 0.16, taper: 'start' }); // (ruler upgrade pass) the broad lit slope of the ridge, wide enough for sheet size
      f.line(lit.slice(Math.floor(lit.length * 0.15), Math.floor(lit.length * 0.9)), Math.max(3, w0 * 0.42), '#c4c4ba', { op: 0.5 }); // the lit ridge
    }
    // (ruler upgrade pass) a woven border runs in from the hem: a dark band between two pale threads, bending with the
    // hump and the dragged point, so the broadest tone on her is broken by a band that shows the shawl's form at sheet size
    { const cS = S.at(-0.4, 0.3), base = shHem.map((q, i) => { const a = shHem[Math.max(0, i - 1)], b = shHem[Math.min(shHem.length - 1, i + 1)]; return [(a[0] + q[0] * 2 + b[0]) / 4, (a[1] + q[1] * 2 + b[1]) / 4]; });
      const nrm = base.map((q, i) => { const a = base[Math.max(0, i - 1)], b = base[Math.min(base.length - 1, i + 1)], t = E.norm(sub(b, a)); let n = [-t[1], t[0]]; if (n[0] * (cS[0] - q[0]) + n[1] * (cS[1] - q[1]) < 0) n = mul(n, -1); return n; });
      const band = d => base.map((q, i) => add(q, mul(nrm[i], d + Math.sin(i * 1.3) * 5)));
      f.stroke(band(186), 28, '#262624', { op: 0.66 }); f.stroke(band(160), 8, '#c8c4b6', { op: 0.66 }); f.stroke(band(212), 8, '#c8c4b6', { op: 0.56 }); f.line(band(186), 2, '#6a6a64', { op: 0.5 }); }
    const wet = [...shHem.map(q => add(q, [0, 60])).reverse(), ...shHem.map((q, i) => add(q, [0, -70 - (i % 3) * 30 - r6() * 50]))];
    f.flat(wet, '#101012', { op: 0.42 }); // the hem soaked dark, the wet wicking up unevenly
    f.flat(shHem.map(q => add(q, [0, 40])).reverse().concat(shHem.map(q => add(q, [0, -28 - r6() * 16]))), '#060607', { op: 0.35 });
    for (let k = 0; k < 9; k++) { const q = lerp(hem0, hem1, 0.05 + k * 0.11), L3 = 50 + r6() * 90; f.stroke([q, add(q, [4, -L3 * 0.5]), add(q, [-2, -L3])], 10, '#101012', { op: 0.35 }); } // wet streaks running up from the hem
    V.wetSheen(f, shHem.slice(2, 20).map(q => add(q, [6, -18])), 2.4, 0.4);
  });
  // the fringe: wet clumps of uneven length, a few short and stubby, a few long, blown back and down
  for (let i = 0; i < 34; i++) { const k = 6 + Math.floor(i / 34 * (shHem.length - 1)), q = lerp(shw[k], shw[k + 1], f.r()), L2 = Math.pow(f.r(), 1.5) * 110 + 14, wv = 3 + f.r() * 4; f.stroke([q, add(q, [-L2 * 0.2, L2 * 0.5]), add(q, [-L2 * 0.45 + (f.r() - 0.5) * 10, L2])], wv, i % 3 ? '#5a5a56' : '#7a7a74'); if (L2 > 80 && f.r() > 0.5) V.drip(f, add(q, [-L2 * 0.45, L2 + 2]), 1.4); }
  // the knotted corners at her breast: two heavy ends tied in a hard knot, hanging and swinging back in the wind
  { const kc = S.at(0.56, 0.26); f.part(lumpE(f, kc, 34, 28, 0.4, 0.25), SH({ fill: '#62625c', inkW: 1.6 })); f.stroke([add(kc, [-18, -10]), add(kc, [10, 8]), add(kc, [24, -6])], 3, '#0a0a0c', { op: 0.7 });
    for (const [dx, L2, w] of [[-10, 200, 46], [16, 150, 36]]) { const p0 = add(kc, [dx, 18]); hairMass(f, [p0, add(p0, [-10, L2 * 0.4]), add(p0, [-34, L2 * 0.75]), add(p0, [-60, L2])], [w, w * 0.9, w * 0.7, w * 0.5], SH({ fill: '#5e5e58' }), { tips: 4, tipL: 30, lit: shawlL, amp: 3, phase: dx }); } }
  V.lichtenberg(f, S.at(0.5, 0.06), deg(150), 160, 3, { depth: 2, col: '#141210', lite: '#6a6660' });
  for (const [u, v] of [[0.3, 0.32], [-0.1, 0.06]]) { const q = S.at(u, v); f.part(limb(add(q, [-30, -10]), add(q, [34, 10]), 9, 6, { steps: 4 }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.2, cast: false }); f.part(ell(add(q, [-32, -11]), 8, 7, 0, 8), { fill: P.bone, inkW: 1.1, cast: false }); } // bone pins
  // the string of payment coins and ships' buttons, the bird-bone whistle, a holed stone and a shell, the ship charm;
  // the coins took the strike: burns spread from them across the skin of her throat
  { const pts = [S.at(0.02, 0.0), S.at(0.24, 0.12), S.at(0.46, 0.14), S.at(0.62, 0.06)]; f.line(pts, 2.6, '#3a3024'); for (let i = 0; i < 12; i++) { const t = i / 11, k2 = Math.min(2, Math.floor(t * 3)), q = lerp(pts[k2], pts[k2 + 1], t * 3 - k2); f.part(ell(q, 11, 11, 0, 12), V.BRS(f, { inkW: 1.1, cast: false, fill: i % 3 === 0 ? '#9a9c98' : i % 3 === 1 ? P.brass : '#7a6a4a' })); if (i % 3) { f.flat(ell(add(q, [-3, 0]), 2, 2, 0, 6), '#141210'); f.flat(ell(add(q, [3, 0]), 2, 2, 0, 6), '#141210'); } else f.line([add(q, [-5, -3]), add(q, [5, 3])], 1, '#3a3a3a', { op: 0.7 }); if (i === 4 || i === 8) V.weld(f, q, 0, 12, { burns: [], rim: false }); } V.verdigris(f, S.at(0.3, 0.14), 30, 10, 5); }
  { const q = S.at(0.62, 0.06); f.line([q, add(q, [16, 80])], 2, '#3a3024'); const w0 = add(q, [16, 80]); f.part(limb(w0, add(w0, [10, 90]), 16, 12, { steps: 4 }), { fill: '#d8d0bc', shadow: '#7a7262', shade: 0.4, inkW: 1.2, cast: false }); for (let i = 0; i < 3; i++) f.flat(ell(add(w0, [4 + i * 3, 30 + i * 18]), 3, 2.4, 0, 6), '#2a2420'); } // the bird-bone whistle
  { const q = S.at(0.3, 0.14); f.line([q, add(q, [-6, 60])], 2, '#3a3024'); const st = add(q, [-6, 72]); f.part(lumpE(f, st, 18, 16, 0, 0.2), { fill: '#6a6e72', shade: 0.4, inkW: 1.2, cast: false, tex: 'pit' + s, texOp: 0.6 }); f.flat(ell(st, 6, 5, 0, 8), '#0a0a0a'); } // a holed hag-stone
  { const q = S.at(0.14, 0.08); f.line([q, add(q, [-10, 110])], 2, '#3a3024'); const sc = add(q, [-10, 110]); f.part([add(sc, [-36, 0]), add(sc, [36, -4]), add(sc, [26, 20]), add(sc, [-28, 22])], V.WD(f, { fill: '#7a6a52', inkW: 1.2, cast: false })); f.line([add(sc, [0, -2]), add(sc, [0, -40])], 3, '#5a4a3a'); f.part([add(sc, [2, -38]), add(sc, [22, -18]), add(sc, [2, -12])], { fill: '#c8c0aa', shade: 0.3, inkW: 1, cast: false }); } // the carved ship charm
  { const q = S.at(0.44, 0.16); f.line([q, add(q, [4, 46])], 2, '#3a3024'); const sh2 = add(q, [4, 58]); f.part([add(sh2, [-14, -10]), add(sh2, [14, -10]), add(sh2, [18, 4]), add(sh2, [0, 18]), add(sh2, [-18, 4])], { fill: '#d8d0c0', shade: 0.35, inkW: 1.1, cast: false }); for (let i = -2; i <= 2; i++) f.line([add(sh2, [0, 16]), add(sh2, [i * 7, -8])], 0.9, INK, { op: 0.5 }); } // a scallop shell

  // ---- the head: ancient, weathered and canny. A long face hollowed by the wind under heavy brows; deep-set eyes
  // narrowed into the gale with a live glint; a hooked nose; the mouth pursed to whistle in a mesh of creases; a wattle
  // of loose skin at the throat; liver spots, a wart, white whiskers; the lace of scars over all of it
  f.bone('head');
  const neckP = K.chain([S.at(0.16, 0.02), add(HC, [-36, 150])], [170, 140], { steps: 4 });
  f.part(neckP, SKN());
  V.clipDraw(f, neckP, () => { for (let i = 0; i < 5; i++) f.stroke([S.at(-0.1 + i * 0.12, 0.0), lerp(S.at(-0.1 + i * 0.12, 0.0), add(HC, [-60 + i * 22, 160]), 0.5), add(HC, [-70 + i * 22, 170])], 2, INK, { op: 0.4 }); f.flat(S.shape([[-0.06, 0.4, -0.1], [0.04, 0.5, -0.1]]), '#2a2430', { op: 0.3 }); scarL(S.at(0.3, 0.0), deg(-70), 200, 3.6, 3); }); // the neck's cords and creases
  for (let i = 0; i < 4; i++) f.stroke([add(HC, [-50 + i * 26, 150 + i * 8]), add(HC, [-20 + i * 24, 176 + i * 10]), add(HC, [10 + i * 20, 168 + i * 14])], 3, '#1e181c', { op: 0.55 }); // loose folds of skin under the jaw
  { const cl = S.shape([[-0.06, 0.42, 0.34], [0.02, 0.52, 0.46], [0.08, 0.4, 0.2]]); f.part(cl, SH({ fill: '#5e5e58', inkW: 1.6, maxShade: 30 })); V.clipDraw(f, cl, () => { for (let k = 0; k < 4; k++) f.stroke([S.at(-0.4 + k * 0.24, -0.04), S.at(-0.36 + k * 0.24, 0.02), S.at(-0.3 + k * 0.22, 0.07)], 3, '#0a0a0c', { op: 0.6 }); }); } // the shawl's edge rolled and bunched round the neck
  B.head(f, HC, H, hA, { skin, jaw: 0.92, chin: 0.08, nose: 1.2, hook: 0.7, mouth: 'set', squint: 0.72, browDown: 0.1, age: true, gaunt: true, lips: false, glint: true, iris: '#3a3a30', eyeWhite: '#c8c4b0', faceShade: 0.72, faceHatch: true, jawShade: 0.5, noEar: true, hairCol: '#9a9890', browCol: '#b4b2aa', browW: 0.07 });
  // (ruler upgrade pass) the face re-modelled to hold up beside the Drowned King at sheet size: broad lit planes on the
  // brow, cheekbone, nose, upper lip and chin; core shadow kept to the temple, the socket and the hollow under the
  // cheekbone; every crease drawn as a fold (a dark line with a lit lip under it) following the skull, of different
  // lengths, instead of rows of parallel bars; the mouth a pucker pushed forward round the whistle, not a star of lines
  const LIT = '#efe6d0', CORE = '#221c24';
  f.flat(hF([[-0.06, -0.44], [0.14, -0.46], [0.3, -0.32], [0.33, -0.17], [0.16, -0.16], [0.0, -0.22]]), LIT, { op: 0.26 }); // the brow and forehead turned to the light
  f.flat(hF([[0.03, 0.0], [0.2, -0.03], [0.29, 0.05], [0.25, 0.12], [0.08, 0.1]]), LIT, { op: 0.5 }); // the cheekbone
  f.flat(hF([[0.3, -0.07], [0.36, -0.02], [0.42, 0.09], [0.41, 0.13], [0.33, 0.07]]), LIT, { op: 0.5 }); // the nose's bridge and hook
  f.flat(hF([[0.23, 0.37], [0.33, 0.36], [0.37, 0.44], [0.31, 0.51], [0.23, 0.48]]), LIT, { op: 0.42 }); // the chin
  f.flat(hF([[0.26, 0.17], [0.34, 0.18], [0.37, 0.22], [0.28, 0.23]]), LIT, { op: 0.42 }); // the upper lip's ridge
  f.flat(hF([[-0.01, -0.33], [0.1, -0.29], [0.08, -0.16], [-0.03, -0.18]]), CORE, { op: 0.3 }); // the temple sunk
  f.flat(hF([[0.03, 0.13], [0.18, 0.16], [0.21, 0.26], [0.13, 0.33], [0.02, 0.27]]), CORE, { op: 0.42 }); // the hollow under the cheekbone
  f.flat(hF(ell([0.12, -0.07], 0.11, 0.065, 0.05, 12)), '#140f14', { op: 0.4 }); f.flat(hF(ell([0.295, -0.07], 0.05, 0.05, 0, 10)), '#140f14', { op: 0.3 }); // the sockets
  f.line(hF([[0.0, -0.15], [0.1, -0.175], [0.22, -0.155]]), 3, LIT, { op: 0.45 }); // the brow ridge's lit bone above the brows
  // heavy hooded lids over the narrowed eyes
  f.part(hF([[0.04, -0.09], [0.11, -0.125], [0.19, -0.1], [0.19, -0.07], [0.11, -0.085], [0.05, -0.07]]), Object.assign(SKN(), { cast: false, inkW: 1.1, inkHeavy: 1.4, shade: 0.4 }));
  const fold = (pts, w, op = 0.62) => { f.line(hF(pts), w, INK, { op }); f.line(hF(pts.map(([u, v]) => [u + 0.004, v + 0.013])), w * 0.8, LIT, { op: op * 0.55 }); };
  fold([[0.06, -0.025], [0.12, -0.005], [0.18, -0.035]], 2.4); fold([[0.05, 0.02], [0.12, 0.045], [0.2, 0.012]], 2); // bags under the eye
  for (const [a2, L] of [[-0.5, 0.08], [-0.15, 0.1], [0.2, 0.085], [0.55, 0.06]]) fold([[0.04, -0.05 + a2 * 0.03], [0.04 - L * 0.5 * Math.cos(a2), -0.05 + a2 * 0.03 + L * 0.4 * Math.sin(a2)], [0.04 - L * Math.cos(a2), -0.05 + a2 * 0.03 + L * Math.sin(a2) * 0.9]], 2, 0.55); // crow's feet fanning back from the outer corner
  fold([[-0.02, -0.22], [0.08, -0.245], [0.2, -0.22]], 2.6); fold([[0.02, -0.28], [0.11, -0.3], [0.21, -0.27]], 2.2); fold([[-0.05, -0.33], [0.05, -0.36], [0.14, -0.345]], 2, 0.5); // brow furrows following the forehead's curve
  fold([[0.21, -0.195], [0.225, -0.14]], 2.6); fold([[0.24, -0.2], [0.245, -0.15]], 2, 0.5); // between the brows
  // the nasolabial fold cut deep; long gaunt creases down the cheek; the marionette lines at the mouth's corners
  f.stroke(hF([[0.26, 0.13], [0.2, 0.24], [0.17, 0.34], [0.18, 0.44]]), 6, '#1e181c', { op: 0.72 }); f.line(hF([[0.285, 0.14], [0.225, 0.25], [0.2, 0.35]]), 3, LIT, { op: 0.5 });
  fold([[0.05, 0.16], [0.08, 0.3], [0.13, 0.42]], 2.4); fold([[-0.04, 0.13], [-0.02, 0.27], [0.05, 0.39]], 2, 0.5); fold([[0.22, 0.34], [0.215, 0.43]], 2.2, 0.55);
  // the pucker: lips pushed forward round a small dark hole, short creases drawn in toward it above and below
  f.part(hF([[0.27, 0.25], [0.31, 0.235], [0.35, 0.25], [0.365, 0.285], [0.35, 0.32], [0.31, 0.335], [0.275, 0.315], [0.265, 0.285]]), { fill: mix(skin, '#6a4650', 0.38), shadow: '#2a1e24', shade: 0.42, inkW: 1.3, inkHeavy: 1.8, cast: false, tex: 'wrinkle' + s, texOp: 0.4 });
  f.line(hF([[0.285, 0.252], [0.32, 0.243], [0.35, 0.258]]), 2.4, LIT, { op: 0.55 }); // the upper lip's lit roll
  f.flat(hF(ell([0.348, 0.287], 0.014, 0.018, 0, 8)), '#0c0a0a'); // the hole she whistles through
  for (const [u0, v0, u1, v1] of [[0.29, 0.24, 0.285, 0.205], [0.315, 0.236, 0.315, 0.2], [0.34, 0.244, 0.35, 0.212], [0.29, 0.33, 0.285, 0.365], [0.32, 0.336, 0.322, 0.372], [0.345, 0.326, 0.355, 0.358], [0.27, 0.29, 0.245, 0.295]]) f.line(hF([[u0, v0], [(u0 + u1) / 2 + 0.006, (v0 + v1) / 2], [u1, v1]]), 1.8, INK, { op: 0.55 }); // pucker creases
  // liver spots, a wart with a white whisker, stray whiskers on the chin
  for (const [u, v, r] of [[0.02, -0.28, 0.022], [0.1, 0.06, 0.016], [-0.06, 0.0, 0.02], [0.16, -0.32, 0.014]]) f.flat(hF(ell([u, v], r, r * 0.8, 0.3, 8)), '#6a5a48', { op: 0.55 });
  f.part(hF(ell([0.12, 0.2], 0.022, 0.02, 0, 8)), Object.assign(SKN(), { cast: false, inkW: 1, shade: 0.4 })); f.line(hF([[0.12, 0.19], [0.15, 0.14]]), 1, '#e0ddd0');
  for (const [u, v] of [[0.24, 0.44], [0.27, 0.46], [0.2, 0.47]]) f.line(hF([[u, v], [u + 0.015, v + 0.04]]), 1, '#e0ddd0', { op: 0.8 });
  V.clipDraw(f, hF([[-0.34, -0.5], [0.4, -0.5], [0.42, 0.5], [-0.3, 0.5]]), () => { scarL(hF([[-0.2, -0.4]])[0], deg(70), 180, 2.4, 3); scarL(hF([[0.28, -0.3]])[0], deg(110), 130, 2, 2); });
  V.drip(f, hF([[0.2, 0.52]])[0], 2); V.drip(f, hF([[0.36, 0.3]])[0], 1.6); V.saltCrust(f, hF([[-0.1, 0.2]])[0], 30, 20, 6);

  // ---- the hair: long grey hair stood straight up into the gale in wind-torn hanks of every width and length, some
  // knotted with cords she sells, a bone bead, a gull feather tied in, burnt at the tips
  f.bone('hair');
  f.part(hF([[-0.46, 0.2], [-0.5, -0.12], [-0.38, -0.42], [-0.1, -0.54], [0.2, -0.5], [0.32, -0.36], [0.1, -0.4], [-0.2, -0.3], [-0.32, 0.0], [-0.34, 0.24]]), { fill: '#9a988f', shadow: '#2e2e32', shade: 0.4, tex: 'hatch' + s, texOp: 0.3, inkW: 1.4 }); // thin hair plastered over the scalp
  for (let i = 0; i < 6; i++) f.line(hF([[-0.42 + i * 0.1, -0.4 + Math.abs(i - 2.5) * 0.04], [-0.36 + i * 0.1, 0.0 + i * 0.03]]), 1.1, '#c8c6be', { op: 0.5 });
  const hanks = [];
  const hr = E.rng(6213);
  const order = [6, 1, 10, 3, 8, 0, 12, 5, 2, 11, 7, 4, 9];
  for (const i of order) { const t = i / 12, r0 = hF([[-0.52 + t * 0.8 + (hr() - 0.5) * 0.06, -0.22 - Math.sin(t * Math.PI) * 0.28]])[0], a2 = deg(-165 + t * 110 + (hr() - 0.5) * 34), L2 = 120 + Math.pow(hr(), 0.7) * 520, w0 = 20 + Math.pow(hr(), 1.4) * 90, bw = (hr() - 0.5) * 0.9;
    const path = [r0, add(r0, rot([L2 * 0.3, 0], a2 + bw * 0.5)), add(r0, rot([L2 * 0.65, 0], a2 - bw * 0.4)), add(r0, rot([L2, 0], a2 + bw * 0.6 - 0.2))];
    const hm = hairMass(f, path, [w0 * 0.5, w0, w0 * (0.6 + hr() * 0.4), w0 * 0.3], { fill: mix('#c4c2ba', '#8a8880', hr()), shadow: '#3a3a40', light: '#ecebe4', shade: 0.36, tex: 'hatch' + s, texOp: 0.18, inkW: 1.4 }, { tips: 2 + Math.floor(hr() * 4), tipL: 20 + hr() * 60, lit: '#f0eee8', amp: 3 + hr() * 6, phase: i * 1.7, tipCurl: 0.6, strands: false });
    V.clipDraw(f, hm.outline, () => { for (let k = 0; k < 3 + Math.floor(w0 / 20); k++) { const off = (hr() - 0.5) * w0 * 0.8, t0 = hr() * 0.3, t1 = 0.5 + hr() * 0.5, pp = [0, 1, 2, 3].map(j => { const tt = t0 + (t1 - t0) * j / 3, kk = Math.min(2, Math.floor(tt * 3)), q = lerp(path[kk], path[kk + 1], tt * 3 - kk), dq = E.norm(sub(path[kk + 1], path[kk])); return add(q, mul([-dq[1], dq[0]], off * (1 - tt * 0.6) + (hr() - 0.5) * 8)); }); f.line(pp, 1 + hr() * 1.6, hr() > 0.45 ? '#f0eee8' : '#2a2a30', { op: 0.35 + hr() * 0.35 }); } }); // strands of differing length and weight, crossing
    hanks.push({ path, w0, L2 }); }
  hanks.forEach((h, i) => {
    const tipA = h.path[3], dd = E.norm(sub(h.path[3], h.path[2]));
    f.flat(ell(add(tipA, mul(dd, -6)), 6, 4, 0, 8), '#141210', { op: 0.7 }); // singed tips
    if (i % 3 === 0) { const q = lerp(h.path[1], h.path[2], 0.5), n = [-dd[1], dd[0]]; f.line([add(q, mul(n, h.w0 * 0.42)), add(q, mul(n, -h.w0 * 0.42))], 6, INK); f.line([add(q, mul(n, h.w0 * 0.42)), add(q, mul(n, -h.w0 * 0.42))], 4, '#6e6048'); f.part(ell(add(q, mul(n, h.w0 * 0.45)), 7, 6, 0, 8), { fill: '#6e6048', inkW: 1.1, cast: false }); V.rope(f, [add(q, mul(n, h.w0 * 0.45)), add(q, add(mul(n, h.w0 * 0.45 + 10), [-20, 40])), add(q, add(mul(n, h.w0 * 0.45 + 4), [-34, 80]))], 3.4, { col: '#6e6048', fray: true }); } // a knotted cord tied round a hank
    if (i === 4) { const q = lerp(h.path[2], h.path[3], 0.3); f.part(limb(add(q, mul(dd, -14)), add(q, mul(dd, 14)), 16, 14, { steps: 3 }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1.2, cast: false }); f.line([add(q, mul(dd, -10)), add(q, mul(dd, 10))], 1, INK, { op: 0.5 }); } // a bone bead
    if (i === 8) V.feather(f, lerp(h.path[1], h.path[2], 0.4), Math.atan2(dd[1], dd[0]) + 0.4, 140, 26, V.FE(f, { fill: '#b8bec2' }), { lead: 0.35, round: true, dark: 0.3, darkCol: '#1a1a1e', darkOp: 0.8, notch: [0.6] }); // a gull feather tied in
    if (i === 10) { const q = lerp(h.path[2], h.path[3], 0.5); for (let k = 0; k < 3; k++) { const qq = add(q, mul(dd, (k - 1) * 18)); f.part(lumpE(f, qq, 10, 9, 0, 0.3), { fill: '#3a3024', inkW: 1.2, cast: false }); } } // three wind-knots tied in the hair itself
  });

  // ---- the knotted cord: tarred hemp from the storm above, down through her fists; a knot every arm's length, three
  // below her hands untied and frayed; the loose end hanging
  f.bone('cord');
  // the cord above the fists bellies in the gale (a rope, not a staff), with hemp fibres standing off it
  const cUp = V.spline([cord0, add(lerp(cord0, cordA, 0.3), [46, 0]), add(lerp(cord0, cordA, 0.62), [36, 0]), add(lerp(cord0, cordA, 0.86), [8, 0]), cordA], 8);
  const cordPts = [...cUp, cordB, add(cordB, [-30, 160]), add(cordB, [-20, 340]), add(cordB, [10, 470])];
  V.rope(f, cordPts, 19, { col: '#3e3428' });
  const cS = V.arcLen(cUp), cL = cS[cS.length - 1];
  for (let k = 0; k < 26; k++) { const at = V.at(cUp, cS, cL * (0.05 + k * 0.036)), sg = k % 2 ? 1 : -1; f.line([add(at.p, mul(at.n, sg * 9)), add(add(at.p, mul(at.n, sg * (16 + (k % 3) * 6))), mul(at.d, 8))], 1.2, '#7a6a50', { op: 0.75 }); } // fibres standing off the struck hemp
  for (const t of [0.2, 0.55, 0.85]) { const at = V.at(cUp, cS, cL * t), q = at.p, aa = Math.atan2(at.d[1], at.d[0]); f.part(lumpE(f, q, 26, 21, aa, 0.25), { fill: '#3e3428', shadow: '#0e0a06', shade: 0.42, tex: 'hatch' + s, texOp: 0.4, inkW: 1.6 }); f.line([add(q, rot([-16, -10], aa)), add(q, rot([4, 12], aa)), add(q, rot([18, -6], aa))], 2.4, INK, { op: 0.7 }); f.line([add(q, rot([-12, 6], aa)), add(q, rot([10, -10], aa))], 1.6, '#8a7a5e', { op: 0.7 }); V.rope(f, [add(q, rot([10, 14], aa)), add(q, rot([20, 40], aa + 0.4)), add(q, rot([14, 62], aa + 0.6))], 5, { col: '#3e3428', fray: true }); } // the tied knots above, each an overhand knot with its tail blown out
  for (const t of [0.3, 0.62, 0.92]) { const k2 = t < 0.5 ? 3 : 4, q = lerp(cordPts[k2], cordPts[k2 + 1], (t * 2) % 1); for (let i = -2; i <= 2; i++) f.line([q, add(q, [i * 7 + 14, 30 + Math.abs(i) * 6]), add(q, [i * 9 + 20, 48])], 2.2, '#6a5a44', { op: 0.85 }); f.line(ell(q, 16, 8, 0.3, 10).slice(0, 6), 2.4, '#3a3024'); } // three untied, the hemp frayed into kinks where they were
  V.scorch(f, V.at(cUp, cS, cL * 0.7).p, 18, 60, 0.6, 0.5);

  // ---- arms: long and gaunt in the oilskin's huge sleeves, turned back; the hands knuckled round the cord, fused to it
  f.bone('forearm_f');
  f.part(K.chain([EF, lerp(EF, WF, 0.5)], [130, 120], { steps: 6 }), OIL({ fill: '#22262a' }));
  f.part(K.chain([lerp(EF, WF, 0.4), WF], [80, 66], { steps: 6 }), SKN({ fill: mix(skin, skinS, 0.18) }));
  f.bone('hand_f');
  T3b.gripK(f, WF, EF, ang(cordB, cordA), 84, mix(skin, '#5a4a44', 0.16), { tex: 'wrinkle' + s, texOp: 0.45, shadow: '#3e302c', nail: '#c8bca4', name: 'wind-seller far' }); // (ruler upgrade pass) the modelled fist: bony knuckle heads, tendons, creased finger joints, nails
  V.weld(f, add(WF, rot([-30, 0], ang(EF, WF))), ang(cordB, cordA), 24, { burns: [], haloOp: 0.4 });
  f.bone('upperarm_n');
  const de = elb(SN, EN, WN);
  split(f, () => {
    f.part(K.chain([SN, EN, lerp(EN, WN, 0.4)], [124, 104, 100], { steps: 8, bp: [[0, 0.4, 0.14]], bq: [[0, 0.7, 0.1]] }), OIL());
    for (let i = 0; i < 4; i++) f.stroke([lp(SN, EN, 0.2 + i * 0.18, -60), lp(SN, EN, 0.26 + i * 0.18, 0), lp(SN, EN, 0.2 + i * 0.18, 60)], 2.6, '#0c0e0c', { op: 0.6 }); // oilskin creases round the arm
    f.stroke([lp(SN, EN, 0.4, 50), lp(SN, EN, 0.62, 10), lp(SN, EN, 0.8, -50)], 4); f.stroke([lp(SN, EN, 0.2, -30), lp(SN, EN, 0.5, -60)], 3.4);
    V.wetSheen(f, [lp(SN, EN, 0.1, -60), lp(SN, EN, 0.4, -70), lp(SN, EN, 0.7, -66)], 3, 0.45); V.saltCrust(f, lp(SN, EN, 0.5, 20), 40, 40, 14);
    f.part([add(EN, mul(de, -70)), add(add(EN, mul(de, -96)), mul(E.norm(sub(EN, SN)), -20)), add(add(EN, mul(de, -86)), mul(E.norm(sub(WN, EN)), 30))], OIL({ fill: '#3a403a', cast: false, inkW: 1.6 })); for (let i = 0; i < 3; i++) f.stroke([add(EN, add(mul(de, -60 + i * 8), [0, -30 - i * 14])), add(EN, mul(de, -10 + i * 6)), add(EN, add(mul(de, -60 + i * 8), [24 + i * 10, 30 + i * 10]))], 2.6, '#060807', { op: 0.6 }); // the elbow's bony point, the sleeve creased round it
  }, [['upperarm_n', side(EN, mul(de, -1), 66)], ['forearm_n', side(EN, de, 66)]]);
  // the great shawl wraps over the near shoulder and upper arm (on the torso, like shoulder armour): the shoulder ball
  // shows through as a lit round, the wet wool hangs from it in plumb folds to a torn, dark, dripping edge above the elbow
  f.bone('torso');
  { const r7 = E.rng(6217), dr = [[826, 352], [880, 300], [968, 300], [1022, 352], [1034, 450], [1022, 560]];
    for (let x = 1020; x >= 834; x -= 16 + r7() * 14) dr.push(r7() > 0.5 ? [x, 586 + r7() * 50, 1] : [x, 574 + r7() * 20]);
    dr.push([826, 520], [814, 430]);
    f.part(dr, SH({ fill: '#64645e', maxShade: 46 }));
    V.clipDraw(f, dr, () => {
      f.line(ell([952, 372], 78, 58, 0.3, 16).slice(7, 14), 3, '#0a0a0c', { op: 0.5 }); // the shoulder ball under the wool
      for (const [x0, x1, w] of [[880, 862, 5], [930, 918, 5.4], [984, 990, 4.6]]) valley([[x0, 420], [x0 - 6, 500], [x1, 600]], w);
      for (const [x0, x1] of [[900, 890], [956, 950], [1006, 1014]]) f.line([[x0, 430], [x0 - 2, 510], [x1, 590]], 2.6, '#c6c6bc', { op: 0.65 }); // lit ridges
      f.flat([[800, 600], [1040, 600], [1040, 680], [800, 680], [800, 540], [1040, 520]].slice(0, 4).map((q, i) => i < 2 ? add(q, [0, -60]) : q), '#101012', { op: 0.45 }); // the wet lower edge
      hatchIn(f, [[814, 330], [866, 330], [870, 640], [814, 640]], deg(62), 8, '#08080a', 0.45, 1.2); // the back of the arm turned from the light
      V.saltCrust(f, [940, 470], 60, 60, 14);
    });
    for (const q of dr.filter(q => q[2] === 1)) { const L3 = 14 + r7() * 40; f.stroke([q, add(q, [-3, L3 * 0.6]), add(q, [-6, L3])], 5, '#4e4e4a'); if (r7() > 0.5) V.drip(f, add(q, [-6, L3 + 2]), 1.5); } // wet fringe clumps
    V.lichtenberg(f, [1010, 420], deg(110), 120, 2.4, { depth: 2, col: '#141210', lite: '#6a6660' }); }
  f.bone('forearm_n');
  f.part(limb(lerp(EN, WN, 0.36), lerp(EN, WN, 0.5), 150, 150, { steps: 4 }), OIL({ fill: '#3a3e38', inkW: 1.8, cast: false })); // the turned-back cuff
  f.part(K.chain([lerp(EN, WN, 0.46), lerp(EN, WN, 0.78), WN], [92, 82, 72], { steps: 6 }), SKN());
  V.clipDraw(f, K.chain([lerp(EN, WN, 0.46), WN], [92, 72], { steps: 4 }), () => { scarL(lp(EN, WN, 0.95, 0), ang(WN, EN), 200, 3.4, 3); f.line([lp(EN, WN, 0.5, -20), lp(EN, WN, 0.95, -16)], 2, INK, { op: 0.5 }); f.line([lp(EN, WN, 0.5, 22), lp(EN, WN, 0.95, 18)], 2.4, '#e8e4d8', { op: 0.4 }); });
  f.bone('hand_n');
  T3b.gripK(f, WN, EN, ang(cordA, cordQ), 90, mix(skin, '#e8dcc4', 0.12), { tex: 'wrinkle' + s, texOp: 0.45, shadow: '#3e302c', nail: '#c8bca4', name: 'wind-seller near' });
  V.weld(f, add(WN, rot([34, 0], ang(EN, WN))), ang(cordA, cordQ), 26, { burns: [[ang(WN, EN), 90, 3]], haloOp: 0.45 }); // the knuckles fused to the cord
  scarL(add(WN, [-20, 10]), deg(160), 90, 2.4, 2);
  return f;
}

// ------------------------------------------------------------------ THE LAST PRIZE (ruler, 4)
// The richest ship the coast ever took, going down for a hundred years and not finished. A great merchant carrack
// broken-backed and heeled on the rocks broadside to the company, bows toward the heroes (drawn to the right, mirrored);
// the mast stumps and upper works are cut off by the frame top and the stern by the far edge; surf breaks white along the
// waterline. Lightning dominates: struck again and again through her ironwork, every bolt and fitting is fused into a
// blackened weld with a Lichtenberg scorch tree running across the planking from it; the standing rigging has frayed and
// fused into stiff black rods. Water swelled the hull and split it along the seams: planks bulging, barnacles thick on
// the lower strakes, kelp hanging from the gunports. The drowned crew stand their stations: gunners bloated at the four
// open ports with their hands fused to the guns (the muzzles fused to the port rims), three sailors at the rail welded to
// its iron fittings through their pikes and hooks. A cracked bell scorched at the bow, a torn sail draped over the side,
// the name board half fallen, the stove-in hold spilling bales, spice casks and a split coin chest, an anchor hanging by
// a fused chain, the wreckers' grapnel lines in her rail, a lit lantern at the stern, her boat smashed and hanging by
// one rope, a pump handle frozen mid-stroke, a gull on a fused mast stump. Her face is her figurehead: a carved oak woman
// split down the middle by a strike, a Lichtenberg tree burned across the face.
// Rig: sea (root: rocks, surf) > hull_aft and hull_fore (each pivots at the keel under the break, so the broken back
// works as she groans); gun_1..4 (recoil), sailor_1..3 and their arms sailor_k_arm (drag a hero aboard), boat, anchor,
// bell, sail, lantern. Motion: idle the hull groaning and listing with each wave (hull_aft, hull_fore), surf breaking over
// the rail; attack a broadside (guns recoil; the crack of the strike is an engine effect) and the drowned at the rail
// reach down to drag a hero aboard (sailor arms).
function lastPrize() {
  const CW = TIERS.ruler[0], CH = TIERS.ruler[1], f = new Fig(V.base(620, CH)); V.textures(f);
  const gy = f.o.groundY, s = '620';
  f.o.burnCol = '#0c0a08'; f.o.burnLite = '#7a7060'; // every weld here is in timber or iron: its burn tree is a scorch, not a skin scar
  const BP = [800, 1440];
  const HEEL = 3.5; // she lies askew on the rocks: the whole hull tilted bow-down a few degrees, the two halves broken apart at the keel
  const TA = q => add(BP, rot(sub(q, BP), deg(-2.5 + HEEL))), TF = q => add(BP, rot(sub(q, BP), deg(3 + HEEL)));
  const MA = pts => pts.map(q => q.length > 2 ? [...TA(q), 1] : TA(q)), MF = pts => pts.map(q => q.length > 2 ? [...TF(q), 1] : TF(q));
  const sheer = x => x < 260 ? 110 + x * 0.12 : x < 340 ? 141 + (x - 260) * 1.9 : x < 1080 ? 292 + Math.sin((x - 340) / 740 * Math.PI) * 18 : x < 1140 ? 292 - (x - 1080) * 1.5 : 202 - (x - 1140) * 0.06;
  const keel = x => x < 1240 ? 1450 : 1450 - Math.pow((x - 1240) / 260, 1.6) * 1200;
  const strake = (x, t) => sheer(x) + (keel(x) - sheer(x)) * t;
  const plank = { fill: '#4e4a44', shadow: '#16140f', light: '#7e786c', shade: 0.42, tex: 'wood' + s, texOp: 0.75, maxShade: 40 };
  f.joint('sea', [800, gy]).joint('hull_aft', BP, 'sea').joint('hull_fore', BP, 'sea');
  const ports = [[420, 'A'], [640, 'A'], [990, 'F'], [1190, 'F']];
  ports.forEach(([x, h], i) => f.joint('gun_' + (i + 1), (h === 'A' ? TA : TF)([x, strake(x, 0.42)]), h === 'A' ? 'hull_aft' : 'hull_fore'));
  const sailors = [[300, 'A'], [560, 'A'], [1010, 'F']];
  sailors.forEach(([x, h], i) => { const T = h === 'A' ? TA : TF; f.joint('sailor_' + (i + 1), T([x, sheer(x)]), h === 'A' ? 'hull_aft' : 'hull_fore').joint(`sailor_${i + 1}_arm`, T([x + 20, sheer(x) - 60]), 'sailor_' + (i + 1)); });
  f.joint('boat', TF([1300, sheer(1300)]), 'hull_fore').joint('anchor', TF([1432, 260]), 'hull_fore').joint('bell', TF([1330, 120]), 'hull_fore').joint('sail', TA([360, sheer(360)]), 'hull_aft').joint('lantern', TA([330, 100]), 'hull_aft');

  // ---- the rocks she lies on, black and wet, and the sea behind
  f.bone('sea');
  f.part([[-10, 1300], [300, 1320], [700, 1290], [1100, 1316], [1610, 1296], [1900, 1310], [1900, CH, 1], [-10, CH, 1]], { fill: P.sea, shadow: P.seaD, light: P.seaL, shade: 0.4, tex: 'mottle' + s, texOp: 0.5, inkW: 0, cast: false });
  const rocks = [[-10, 1600], [-10, 1440], [120, 1400], [260, 1430], [420, 1380], [600, 1410], [760, 1360], [880, 1400], [1060, 1380], [1240, 1420], [1400, 1370], [1540, 1410], [1700, 1380], [1900, 1410], [1900, 1600]];
  // ---- the aft half (drawn first, the break between) and the fore half; each as one hull side with its features
  const half = (aft) => {
    const T = aft ? TA : TF, M = aft ? MA : MF, x0 = aft ? -20 : 800, x1 = aft ? 800 : 1500;
    f.bone(aft ? 'hull_aft' : 'hull_fore');
    // the break edge: jagged, splintered plank ends
    const brk = []; for (let i = 0; i <= 14; i++) { const t = i / 14, y = sheer(800) + (keel(800) - sheer(800)) * t; brk.push([800 + (aft ? -1 : 1) * (10 + (i % 2) * 26 + f.r() * 14), y, i % 2]); }
    const top = []; for (let x = x0; x <= x1; x += 20) top.push([x, sheer(x)]);
    const bot = []; for (let x = x1; x >= x0; x -= 20) bot.push([x, Math.min(keel(x), 1480)]);
    const side = aft ? [...top, ...brk, ...bot.slice(1)] : [...brk.slice().reverse().map(q => q), ...top.slice(1), ...bot.slice(1)];
    const SP = M(side);
    f.part(SP, plank);
    V.clipDraw(f, SP, () => {
      // the hull turning under: darker toward the bilge, a lit band under the rail
      f.flat(M([[x0, 1000], [x1, 1000], [x1, 1500], [x0, 1500]]), '#0a0a0c', { op: 0.35 });
      f.flat(M([[x0, 1200], [x1, 1200], [x1, 1500], [x0, 1500]]), '#0a0a0c', { op: 0.3 });
      // strakes: plank seams following the sheer, the swollen planks bulging and split open along the seams
      for (let k = 1; k < 26; k++) { const t = k / 26, pts = []; for (let x = x0; x <= x1; x += 24) pts.push([x, strake(x, t)]); f.line(M(pts), 1.6, INK, { op: 0.55 }); if (k % 3 === 0) f.line(M(pts.map(q => add(q, [0, 3]))), 1.2, '#8a8478', { op: 0.35 }); if (k % 4 === 1) { const xs = x0 + 60 + f.r() * (x1 - x0 - 160), seg = []; for (let x = xs; x < xs + 160; x += 16) seg.push([x, strake(x, t)]); f.stroke(M(seg), 7, '#0a0806', { op: 0.75 }); } }
      for (let k = 0; k < 40; k++) { const x = x0 + f.r() * (x1 - x0), t = 0.05 + f.r() * 0.85, q = [x, strake(x, t)]; f.line(M([q, add(q, [0, (keel(x) - sheer(x)) / 26])]), 1.2, INK, { op: 0.5 }); } // butt joints
      for (let k = 0; k < 8; k++) { const x = x0 + 40 + f.r() * (x1 - x0 - 80), t = 0.15 + f.r() * 0.6; f.flat(M(ell([x, strake(x, t) + 10], 60, 10, 0, 12)), '#c8c2b0', { op: 0.1 }); } // planks bulging, catching light
      V.barnacles(f, T([(x0 + x1) / 2, 1320]), (x1 - x0) * 0.5, 70, 70, 5, 13); V.saltCrust(f, T([(x0 + x1) / 2, 1200]), (x1 - x0) * 0.5, 60, 50);
      for (let k = 0; k < 6; k++) V.verdigris(f, T([x0 + 60 + k * (x1 - x0 - 120) / 5, 1250]), 30, 40, 4, 0.45);
    });
    // wales: thick protruding strakes, a lit top edge and a cast shadow below, iron bolts fused at intervals
    for (const t of [0.12, 0.3, 0.6, 0.8]) {
      const up = [], dn = []; for (let x = x0 + 4; x <= x1 - 4; x += 20) { up.push([x, strake(x, t) - 14]); dn.push([x, strake(x, t) + 18]); }
      f.part(M([...up, ...dn.reverse()]), Object.assign({}, plank, { fill: '#3e3a34', cast: true, castOp: 0.6 }));
      f.line(M(up.map(q => add(q, [0, 3]))), 2, '#9a9284', { op: 0.5 });
      for (let x = x0 + 70; x < x1 - 30; x += 150 + f.r() * 60) { const q = T([x, strake(x, t) + 2]); f.part(ell(q, 9, 9, 0, 10), V.IR(f, { inkW: 1.2, cast: false })); f.flat(ell(q, 15, 11, 0, 10), '#0a0808', { op: 0.5 }); f.flat(ell(q, 3, 2, 0, 6), P.lampL, { op: 0.75 }); V.lichtenberg(f, q, deg(f.r() * 360), 70 + f.r() * 70, 2.2, { depth: 2, fork: 0.7, col: '#0c0a08', lite: '#7a7060' }); } // every bolt fused into a black weld, a scorch tree across the planks
    }
    // the rail: a cap rail with its thickness, iron fittings (chainplates) welded black
    const rl = []; for (let x = x0 + 2; x <= x1 - 2; x += 20) rl.push([x, sheer(x) - 4]);
    f.part(M([...rl.map(q => add(q, [0, -16])), ...rl.slice().reverse().map(q => add(q, [0, 14]))]), Object.assign({}, plank, { fill: '#5a544a', cast: true }));
    f.line(M(rl.map(q => add(q, [0, -14]))), 2, '#a89e8c', { op: 0.5 });
    for (let x = x0 + 80; x < x1 - 40; x += 130) { const q = [x, sheer(x) + 10]; f.part(M([add(q, [-8, 0]), add(q, [8, 0]), add(q, [6, 120]), add(q, [-6, 120])]).map(p2 => [...p2, 1]), V.IR(f, { inkW: 1.2, cast: false })); V.weld(f, T(add(q, [0, 120])), Math.PI / 2, 14, { burns: [[deg(80 + f.r() * 40), 90, 2]] }); } // chainplates
  };
  half(true); half(false);

  // ---- she heels toward the company, so the deck shows above the rail as a plane receding up and back: deck planks,
  // a hatch grating, ring bolts, a coil of rope, the far bulwark standing behind
  for (const aft of [true, false]) {
    const M = aft ? MA : MF, x0 = aft ? -20 : 830, x1 = aft ? 770 : 1440, dep = 120, sk = -70;
    f.bone(aft ? 'hull_aft' : 'hull_fore');
    const nearE = [], farE = []; for (let x = x0; x <= x1; x += 20) { nearE.push([x, sheer(x) - 18]); farE.push([x + sk, sheer(x) - 18 - dep]); }
    const deck = M([...nearE, ...farE.slice().reverse()]);
    f.part(deck, Object.assign({}, plank, { fill: '#5e584e', light: '#8a8274' }));
    V.clipDraw(f, deck, () => {
      for (let k = 1; k < 9; k++) { const t = k / 9; f.line(M(nearE.map((q, i) => lerp(q, farE[i], t))), 1.2, INK, { op: 0.5 }); }
      for (let k = 0; k < 20; k++) { const i = Math.floor(f.r() * (nearE.length - 1)), t = Math.floor(f.r() * 9) / 9; f.line(M([lerp(nearE[i], farE[i], t), lerp(nearE[i], farE[i], t + 1 / 9)]), 1.2, INK, { op: 0.5 }); }
      f.flat(M([...farE, ...farE.slice().reverse().map(q => add(q, [20, 30]))]), '#0a0a0c', { op: 0.35 }); // the far bulwark's shadow
      V.saltCrust(f, M([[(x0 + x1) / 2, sheer((x0 + x1) / 2) - 60]])[0], (x1 - x0) * 0.4, 30, 30);
      V.lichtenberg(f, M([[(x0 + x1) / 2, sheer((x0 + x1) / 2) - 40]])[0], deg(aft ? 190 : -10), 200, 2.4, { depth: 3, col: '#0c0a08', lite: '#7a7060' });
    });
    const fb = M([...farE, ...farE.slice().reverse().map(q => add(q, [0, -46]))]); f.part(fb, Object.assign({}, plank, { fill: '#3e3a34' }));
    f.line(M(farE.map(q => add(q, [0, -46]))), 2, '#a89e8c', { op: 0.5 });
    const hc = aft ? 480 : 1000, hq = [[hc - 80, sheer(hc) - 40], [hc + 60, sheer(hc + 60) - 40], [hc + 60 + sk * 0.6, sheer(hc + 60) - 40 - dep * 0.6], [hc - 80 + sk * 0.6, sheer(hc - 80) - 40 - dep * 0.6]];
    f.part(M(hq).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#3a342c' }));
    for (let k = 1; k < 6; k++) { f.line(M([lerp(hq[0], hq[1], k / 6), lerp(hq[3], hq[2], k / 6)]), 1.6, '#0a0808', { op: 0.8 }); f.line(M([lerp(hq[0], hq[3], k / 6), lerp(hq[1], hq[2], k / 6)]), 1.6, '#0a0808', { op: 0.8 }); }
    f.part(M([hq[0], hq[1], add(hq[1], [0, 14]), add(hq[0], [0, 14])]).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#2a2620', cast: false })); // the hatch coaming's near face
    const rc = M([[hc + 140, sheer(hc + 140) - 70]])[0]; V.ropeCoil(f, rc, 40, 14, 4, 6, { col: '#6a5c44' }); // a coil of rope on the deck
    for (const x of [x0 + 100, x1 - 120]) { const q = M([[x, sheer(x) - 60]])[0]; f.line(ell(q, 9, 5, 0, 10).concat([ell(q, 9, 5, 0, 10)[0]]), 3.4, P.iron); f.flat(ell(q, 14, 8, 0, 10), '#0a0808', { op: 0.4 }); } // ring bolts, fused
  }
  // ---- the standing rigging fused into stiff black rods, the mast stumps rising out of the frame, a gull on the fore
  f.bone('hull_aft');
  for (const [x, a2] of [[560, -1.3], [620, -1.35], [680, -1.42], [740, -1.5]]) { const b0 = TA([x, sheer(x) - 10]), b1 = add(b0, rot([500, 0], a2)); f.line([b0, b1], 6, INK); f.line([b0, b1], 3.4, '#1e1c1a'); f.line([b0, lerp(b0, b1, 0.6)], 1, '#6a6460', { op: 0.5 }); for (let k = 0; k < 3; k++) { const q = lerp(b0, b1, 0.2 + k * 0.25); f.flat(ell(q, 4, 3, 0, 6), '#0a0808'); } }
  { const m0 = TA([650, sheer(650) + 10]), m1 = TA([640, -60]); f.part(limb(m0, m1, 74, 70, { steps: 8 }), Object.assign({}, plank, { fill: '#3a3530' })); f.line([lp(m0, m1, 0.1, -20), lp(m0, m1, 0.95, -18)], 2, '#7a7268', { op: 0.5 }); for (const t of [0.3, 0.6]) { f.part([lp(m0, m1, t, -40), lp(m0, m1, t + 0.04, -40), lp(m0, m1, t + 0.04, 40), lp(m0, m1, t, 40)], V.IR(f, { inkW: 1.3 })); V.weld(f, lp(m0, m1, t + 0.02, 30), 0, 16, { burns: [[deg(-60), 80, 2]] }); } V.scorch(f, lp(m0, m1, 0.8, 0), 40, 60, 0.6); }
  f.bone('hull_fore');
  for (const [x, a2] of [[1180, -1.75], [1230, -1.68], [1290, -1.6]]) { const b0 = TF([x, sheer(x) - 10]), b1 = add(b0, rot([260, 0], a2)); f.line([b0, b1], 6, INK); f.line([b0, b1], 3.4, '#1e1c1a'); }
  { const m0 = TF([1250, sheer(1250) + 10]), m1 = TF([1252, 40]); f.part([lp(m0, m1, 0, -36), lp(m0, m1, 1, -34), [...lp(m0, m1, 1.06, -16), 1], lp(m0, m1, 1.0, -4), [...lp(m0, m1, 1.1, 8), 1], lp(m0, m1, 1.02, 20), [...lp(m0, m1, 1.07, 30), 1], lp(m0, m1, 0, 36)], Object.assign({}, plank, { fill: '#2e2a26' })); f.flat(lumpE(f, lp(m0, m1, 0.96, 0), 34, 22, 0, 0.3), '#0a0808', { op: 0.8 }); f.flat(ell(lp(m0, m1, 0.98, 0), 6, 3, 0, 6), P.lampL, { op: 0.8 }); // the fore stump, broken off and fused black
    const g = lp(m0, m1, 1.08, 0); f.part([add(g, [-40, 0]), add(g, [-30, -30]), add(g, [10, -42]), add(g, [40, -30]), add(g, [44, -10]), add(g, [10, 4])], { fill: '#dcdcd4', shadow: '#6a6a72', shade: 0.38, tex: 'barb' + s, texOp: 0.4, inkW: 1.3 }); f.part([add(g, [-34, -16]), add(g, [20, -38]), add(g, [60, -40]), add(g, [24, -14])], { fill: '#9aa0a6', shadow: '#3a3e44', shade: 0.4, inkW: 1.2, tex: 'barb' + s, texOp: 0.4 }); f.part([add(g, [36, -40]), add(g, [52, -64]), add(g, [64, -56]), add(g, [48, -30])], { fill: '#dcdcd4', shade: 0.38, inkW: 1.2 }); f.part([add(g, [58, -62]), add(g, [80, -58]), add(g, [62, -54])], { fill: P.lampD, shade: 0.3, inkW: 1, cast: false }); f.flat(ell(add(g, [56, -58]), 2, 2, 0, 6), '#0a0a0a'); f.part([add(g, [-46, -6]), add(g, [-70, 0]), add(g, [-46, 4])], { fill: '#1a1a1e', inkW: 1, cast: false }); for (const dx of [-4, 8]) f.line([add(g, [dx, 2]), add(g, [dx, 14])], 2.4, P.lampD); } // a gull on it

  // ---- the gunports: open, the lids hanging, the cannon muzzles fused to the rims, the bloated gunners behind with
  // their hands fused to the guns; kelp hanging from the sills
  ports.forEach(([x, h], i) => {
    const T = h === 'A' ? TA : TF, M = h === 'A' ? MA : MF, y = strake(x, 0.42), w = 190, hh = 170;
    f.bone(h === 'A' ? 'hull_aft' : 'hull_fore');
    const pr = M([[x - w / 2, y - hh / 2], [x + w / 2, y - hh / 2], [x + w / 2, y + hh / 2], [x - w / 2, y + hh / 2]]).map(q => [...q, 1]);
    f.part(pr, { fill: '#08080a', shade: 0.2, inkW: 2, cast: false, hatch: false });
    f.part(M([[x - w / 2 - 8, y + hh / 2], [x + w / 2 + 8, y + hh / 2], [x + w / 2 + 14, y + hh / 2 + 22], [x - w / 2 - 14, y + hh / 2 + 22]]).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#5a544a' })); // the sill
    f.part(M([[x - w / 2 - 6, y - hh / 2 - 30], [x + w / 2 + 6, y - hh / 2 - 30], [x + w / 2 + 20, y - hh / 2 - 200], [x - w / 2 + 4, y - hh / 2 - 210]]).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#46423c' })); // the lid, hanging open on its hinges above
    for (const dx of [-50, 50]) { const q = T([x + dx, y - hh / 2 - 30]); f.part([add(q, [-7, -60]), add(q, [7, -60]), add(q, [7, 10]), add(q, [-7, 10])], V.IR(f, { inkW: 1.1, cast: false })); V.weld(f, add(q, [0, 6]), Math.PI / 2, 14, { burns: [[deg(100 + f.r() * 30), 80, 2]] }); }
    f.bone('gun_' + (i + 1));
    // the gunner: a bloated face and shoulders in the dark of the port, white eyes, his swollen hands fused to the gun
    const gc = T([x - 40, y - 26]); f.part(lumpE(f, add(gc, [-10, 50]), 80, 50, 0, 0.2), V.DR(f, { fill: mix(P.drown, '#000', 0.4), shade: 0.4 }));
    B.head(f, gc, 92, 0.1, { skin: mix(P.drown, '#000', 0.25), jaw: 1.4, chin: -0.04, mouth: 'set', squint: 0.5, browDown: 0.06, faceShade: 0.75, faceHatch: false, jawShade: 0.3, iris: '#d0d4cc', eyeWhite: '#d0d4cc', hairCol: '#1a1c18', beard: i % 2 ? 'short' : 'stubble', beardCol: '#2a2a24' });
    knitCap(f, frame(gc, 0.1, 92), ['#3a3834', '#44403a', '#34363a', '#403c36'][i], s);
    V.kelpHang(f, add(gc, [-38, -10]), 60, 6, 3);
    // the cannon: a bronze barrel run out, its muzzle swell fused to the port rim
    const mz = T([x + 60, y + 14]), br0 = T([x - 20, y + 20]);
    f.part(limb(br0, mz, 74, 62, { steps: 6 }), V.BRS(f, { fill: '#5e5a40', shadow: '#1e1c12', light: '#8a8460', inkW: 1.6 }));
    f.part(ell(mz, 22, 40, 0, 14), V.BRS(f, { fill: '#6a6648', inkW: 1.6, cast: false })); f.flat(ell(add(mz, [6, 0]), 12, 24, 0, 12), '#050505');
    for (const t of [0.3, 0.7]) f.line([lp(br0, mz, t, -36), lp(br0, mz, t, 36)], 4, '#3a3624');
    V.verdigris(f, lerp(br0, mz, 0.5), 40, 20, 6); V.weld(f, add(mz, [-4, 38]), 0, 20, { burns: [[deg(80), 70, 2], [deg(140), 50, 1.6]] }); V.weld(f, add(mz, [-4, -38]), 0, 18, { burns: [] });
    V.openHand(f, T([x - 30, y + 60]), deg(-20), 74, { look: V.DR(f, { fill: mix(P.drown, '#000', 0.2) }), back: true, curl: 0.5, swell: 0.7, spread: 0.1 }); V.weld(f, T([x, y + 50]), 0, 16, { burns: [] }); // the hand on the gun, fused
    V.kelpHang(f, T([x - 60, y + hh / 2 + 18]), 90, 8, -4); V.kelpHang(f, T([x + 50, y + hh / 2 + 18]), 60, 7, 4); V.drip(f, T([x, y + hh / 2 + 24]), 1.6);
  });

  // ---- the break: the hold stove in, cargo spilling down the rocks into the surf
  f.bone('hull_fore');
  { const c = [800, 1180]; const cr = [TA([740, 300]), TA([770, 520]), TA([752, 700]), TA([786, 900]), TA([770, 1100]), TA([796, 1300]), TA([790, 1440]), TF([812, 1440]), TF([806, 1290]), TF([834, 1080]), TF([816, 880]), TF([850, 700]), TF([828, 500]), TF([868, 300])].map((q, i) => i % 2 ? [...q, 1] : q);
    f.part(cr, { fill: '#0c0806', shadow: '#030202', shade: 0.5, inkW: 2.4, cast: false }); // the dark of the hold through the broken back, wider at the deck
    V.clipDraw(f, cr, () => { f.flat(ell([800, 640], 30, 160, 0, 12), '#000', { op: 0.6 }); f.part([TA([760, 820]), TF([840, 800]), TF([830, 840]), TA([770, 860])], Object.assign({}, plank, { fill: '#2a241e', cast: false })); }); // one broken deck beam across the opening
    { const r4 = E.rng(6201); // splinters, torn planks and hanging rope at the break: irregular in length, angle and spacing
      for (const aft of [true, false]) { let y = 330 + r4() * 40; const T = aft ? TA : TF, d2 = aft ? 1 : -1;
        while (y < 1380) { const q = T([aft ? 762 + r4() * 10 : 838 - r4() * 10, y]), L2 = 10 + Math.pow(r4(), 1.6) * 90, a2 = (r4() - 0.5) * 1.4, w2 = 6 + r4() * 8;
          f.part([q, add(q, rot([d2 * L2 * 0.6, -w2 * 0.6], a2)), [...add(q, rot([d2 * L2, -w2 * 0.2], a2 + (r4() - 0.5) * 0.3)), 1], add(q, rot([d2 * L2 * 0.7, w2 * 0.4], a2)), add(q, [0, w2])], V.WD(f, { fill: r4() > 0.5 ? '#9a8a6e' : '#6a5c4a', inkW: 1.1, cast: false }));
          y += 26 + Math.pow(r4(), 1.4) * 150; } }
      // torn planks hanging off the break at angles, still nailed at one end
      for (const [x, y, L2, a2, h] of [[770, 560, 210, 1.9, 'A'], [832, 760, 260, 1.2, 'F'], [768, 1010, 170, 2.2, 'A'], [836, 400, 140, 0.9, 'F']]) { const T = h === 'A' ? TA : TF, q = T([x, y]), e = add(q, rot([L2, 0], a2)); f.part(limb(q, e, 26, 22, { steps: 6, capB: false }), V.WD(f, { fill: '#5a5044', inkW: 1.4 })); f.part([add(e, rot([0, -12], a2)), add(e, rot([16, -6], a2)), add(e, rot([8, 2], a2)), add(e, rot([22, 8], a2)), add(e, rot([0, 12], a2))], V.WD(f, { fill: '#9a8a6e', inkW: 1, cast: false })); f.line([lp(q, e, 0.1, -8), lp(q, e, 0.9, -7)], 1, INK, { op: 0.5 }); f.flat(ell(add(q, rot([10, 0], a2)), 4, 4, 0, 6), P.ironD); V.barnacles(f, lerp(q, e, 0.6), 14, 6, 3, 3, 5); }
      // ropes hanging across and down the gap
      V.sagRope(f, TA([700, 420]), TF([900, 440]), 160, 7, { col: '#5a4e3c' }); V.rope(f, [TF([850, 640]), TF([836, 760]), TF([846, 900]), TF([840, 1000])], 6, { col: '#4e4436', fray: true }); V.rope(f, [TA([744, 300]), TA([760, 420]), TA([756, 520])], 5, { col: '#6a5c44', fray: true }); }
    for (const [dx, dy, w2, h2, a2] of [[-40, 120, 90, 60, 0.2], [30, 160, 80, 56, -0.3], [-10, 220, 100, 64, 0.1]]) { const q = add(c, [dx, dy]); f.part([add(q, rot([-w2 / 2, -h2 / 2], a2)), add(q, rot([w2 / 2, -h2 / 2], a2)), add(q, rot([w2 / 2, h2 / 2], a2)), add(q, rot([-w2 / 2, h2 / 2], a2))], { fill: '#7a6e5a', shadow: '#2a2418', shade: 0.42, tex: 'weave' + s, texOp: 0.7, inkW: 1.4 }); f.line([add(q, rot([-w2 / 2, 0], a2)), add(q, rot([w2 / 2, 0], a2))], 3, '#3a3024'); f.line([add(q, rot([0, -h2 / 2], a2)), add(q, rot([0, h2 / 2], a2))], 3, '#3a3024'); } // bales of cloth, corded
    for (const [dx, dy, a2] of [[90, 260, 0.4], [-100, 270, -0.2]]) { const q = add(c, [dx, dy]); f.part(lumpE(f, q, 44, 56, a2, 0.08), V.WD(f, { fill: '#6a5a44' })); for (const k of [-0.6, 0, 0.6]) f.line([add(q, rot([-44, k * 50], a2)), add(q, rot([44, k * 50], a2))], 4, P.iron); } // spice casks, iron-hooped
    const ch = add(c, [10, 330]); f.part([add(ch, [-70, -30]), add(ch, [60, -40]), add(ch, [70, 30]), add(ch, [-64, 40])], V.WD(f, { fill: '#5a4838' })); f.flat([add(ch, [-10, -36]), add(ch, [6, -38]), add(ch, [0, 36]), add(ch, [-14, 38])], '#0a0806'); for (let i = 0; i < 14; i++) { const q = add(ch, [-60 + f.r() * 120, 30 + f.r() * 50]); f.part(ell(q, 7, 4, f.r(), 8), V.BRS(f, { fill: '#a08850', light: '#d8c08a', inkW: 0.9, cast: false, hatch: false })); } // the split coin chest, coins spilled across the rocks (tarnished, not gold)
    V.weld(f, add(ch, [60, -36]), 0, 14, { burns: [] }); V.kelpHang(f, add(c, [-60, 60]), 100, 8, 4); }

  // ---- the torn sail draped over the side like a curtain, aft
  f.bone('sail');
  { const sl = MA([[200, sheer(200) - 20], [500, sheer(500) - 20], [520, 500], [480, 760], [500, 900, 1], [440, 860], [400, 980, 1], [340, 880], [300, 940, 1], [250, 840], [200, 900, 1], [170, 600]]);
    f.part(sl, { fill: '#8a857a', shadow: '#2a2822', light: '#b8b2a4', shade: 0.42, tex: 'weave' + s, texOp: 0.7 });
    V.clipDraw(f, sl, () => { f.flat(MA(ell([300, 620], 40, 60, 0.2, 12)), '#1a1814', { op: 0.8 }); for (let k = 0; k < 5; k++) f.flat(MA(lumpE(f, [240 + f.r() * 260, 300 + f.r() * 500], 30 + f.r() * 30, 20 + f.r() * 30, f.r(), 0.4)), '#3a3226', { op: 0.3 }); V.saltCrust(f, TA([360, 600]), 140, 260, 40); V.wetSheen(f, MA([[230, 300], [226, 500], [232, 700], [228, 860]]), 3, 0.4); f.flat(MA(ell([440, 420], 26, 36, 0, 10)), '#1a1814', { op: 0.8 }); f.flat(MA([[200, 760], [520, 700], [520, 1000], [200, 1000]]), '#3a3830', { op: 0.25 }); for (let k = 0; k < 7; k++) { const x = 220 + k * 44; f.stroke(MA([[x, 200], [x - 6, 560], [x + 4, 900]]), 4, '#1a1814', { op: 0.55 }); f.line(MA([[x + 14, 220], [x + 10, 560], [x + 16, 880]]), 2, '#e0dacc', { op: 0.45 }); } f.flat(MA([[150, 700], [540, 700], [540, 1000], [150, 1000]]), '#1a1814', { op: 0.3 }); V.scorch(f, TA([380, 420]), 60, 40, 0.5); V.lichtenberg(f, TA([380, 400]), deg(100), 200, 2.6, { depth: 2, col: '#141210', lite: '#5a5650' }); });
    for (let k = 0; k < 4; k++) { const q = TA([260 + k * 60, 300]); f.flat(ell(q, 8, 8, 0, 8), '#2a2824'); f.line(ell(q, 9, 9, 0, 10).concat([ell(q, 9, 9, 0, 10)[0]]), 2, P.ironL); } // grommets
    for (const x of [220, 300, 400, 480]) V.drip(f, TA([x, 920]), 1.6); }
  // the name board, half fallen, hanging by one nail
  f.bone('hull_aft');
  { const nb = TA([300, 1000]), NB = frame(nb, deg(24), 1); f.part(NB([[-10, -30], [230, -30], [230, 30], [-10, 30]]).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#5e584c' })); f.part(NB([[-10, 30], [230, 30], [226, 42], [-6, 42]]).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#2e2a24', cast: false })); for (let k = 0; k < 8; k++) f.line(NB([[10 + k * 26, -14], [16 + k * 26, 14], [24 + k * 26, -10]]), 3.4, '#b8a070', { op: 0.6 }); f.flat(ell(NB([[0, 0]])[0], 5, 5, 0, 8), P.ironD); V.lichtenberg(f, NB([[200, 0]])[0], deg(160), 90, 2, { depth: 2, col: '#0c0a08', lite: '#7a7060' }); }
  // the stern lantern, lit, on its iron bracket at the frame edge
  f.bone('lantern'); { const q = TA([330, 40]); f.line([TA([300, sheer(300) - 20]), TA([300, 30]), add(q, [0, 6])], 6, INK); f.line([TA([300, sheer(300) - 20]), TA([300, 30]), add(q, [0, 6])], 3.4, P.iron); paleLamp(f, q, 150); }
  // the boat, smashed, hanging against the fore side by one rope
  f.bone('boat');
  { const b0 = TF([1300, sheer(1300)]); V.rope(f, [b0, add(b0, [4, 120]), add(b0, [-4, 210])], 7, { col: '#5a4e3c' });
    const bf = frame(add(b0, [-10, 230]), deg(78), 1); // the boat hangs bow-down from its painter: we look into it
    const outer = bf([[0, -14], [60, -60], [200, -74], [330, -60], [380, -30], [384, 20], [330, 56], [200, 70], [60, 56], [0, 14]]);
    f.part(outer, V.WD(f, { fill: '#56504a', inkW: 1.8 }));
    const inner = bf([[20, -6], [70, -46], [200, -58], [320, -46], [360, -20], [362, 14], [320, 42], [200, 54], [70, 42], [20, 6]]);
    f.part(inner, V.WD(f, { fill: '#2e2a24', shade: 0.3, cast: false }));
    V.clipDraw(f, inner, () => { for (let k = 1; k < 9; k++) f.line(bf([[30 + k * 38, -56], [30 + k * 38 + 4, 52]]), 3, '#4a4238', { op: 0.8 }); for (const x of [120, 240]) f.part(bf([[x - 12, -60], [x + 12, -60], [x + 12, 60], [x - 12, 60]]).map(q => [...q, 1]), V.WD(f, { fill: '#5e5850', inkW: 1.2, cast: false })); f.flat(bf([[200, -20], [280, -30], [300, 30], [220, 40]]), '#0a0806', { op: 0.9 }); }); // ribs, thwarts, the stove-in bottom
    for (const q of bf([[200, -24], [280, -30], [300, 30]])) f.line([q, add(q, [10, -12])], 2.4, '#8a8070');
    f.line(bf([[0, -14], [60, -60], [200, -74], [330, -60], [380, -30]]), 2.4, '#a09888', { op: 0.5 }); // the gunwale's worn top
    V.barnacles(f, bf([[300, 60]])[0], 40, 10, 6, 3, 6); V.kelpHang(f, bf([[380, 0]])[0], 80, 6, -3); V.drip(f, bf([[384, 20]])[0], 1.6); }
  // the anchor hanging from the cathead by its fused chain, against the bow
  f.bone('anchor');
  { const ct = TF([1440, 250]); V.chainLinks(f, [ct, add(ct, [10, 200]), add(ct, [6, 380])], 26, P.iron); for (const t of [0.3, 0.7]) { const q = lerp(ct, add(ct, [6, 380]), t); f.flat(ell(q, 9, 6, 0, 8), '#0a0808'); f.flat(ell(q, 3, 2, 0, 6), P.lampL, { op: 0.8 }); } const a0 = add(ct, [6, 380]), a1 = add(a0, [10, 300]); f.part(limb(a0, a1, 30, 34, { steps: 6 }), V.IR(f, { inkW: 1.6 })); f.line(ell(add(a0, [0, -10]), 22, 22, 0, 12).concat([ell(add(a0, [0, -10]), 22, 22, 0, 12)[0]]), 7, INK); f.line(ell(add(a0, [0, -10]), 22, 22, 0, 12).concat([ell(add(a0, [0, -10]), 22, 22, 0, 12)[0]]), 4.4, P.iron); f.part([add(a1, [-140, -110]), add(a1, [-120, -120]), add(a1, [-40, -20]), add(a1, [0, 10]), add(a1, [40, -20]), add(a1, [120, -120]), add(a1, [140, -110]), add(a1, [60, 20]), add(a1, [0, 40]), add(a1, [-60, 20])], V.IR(f, { inkW: 1.6 })); for (const sg of [-1, 1]) f.part([add(a1, [sg * 140, -110]), add(a1, [sg * 170, -150]), add(a1, [sg * 120, -120])], V.IR(f, { inkW: 1.3, cast: false })); f.part([add(a0, [-60, 30]), add(a0, [60, 30]), add(a0, [60, 50]), add(a0, [-60, 50])], V.WD(f, { fill: '#4a3e30' })); V.barnacles(f, add(a1, [0, -40]), 50, 30, 10, 3, 8); V.kelpHang(f, add(a1, [-90, -60]), 80, 7, 3); V.lichtenberg(f, add(a0, [0, 100]), deg(80), 120, 2, { metal: true, depth: 2 }); }

  // ---- the bow: the cracked bell in its belfry on the forecastle, the figurehead split down the middle
  f.bone('bell');
  { const b0 = TF([1330, 120]); f.part(MF([[1280, 200], [1290, 40], [1380, 30], [1384, 196]]).map(q => [...q, 1]), Object.assign({}, plank, { fill: '#3a3530' })); f.flat(MF([[1300, 190], [1304, 70], [1366, 64], [1370, 186]]), '#0a0a0c', { op: 0.9 }); const bc = add(b0, [0, 30]); f.part([add(bc, [-24, -40]), add(bc, [24, -40]), add(bc, [32, 20]), add(bc, [44, 40]), add(bc, [-44, 40]), add(bc, [-32, 20])], V.BRS(f, { fill: '#5e5a40', light: '#9a9268', inkW: 1.6 })); f.line([add(bc, [6, -38]), add(bc, [-4, -10]), add(bc, [10, 12]), add(bc, [2, 38])], 2.6, '#050505'); V.scorch(f, add(bc, [0, 0]), 30, 34, 0.55); V.verdigris(f, add(bc, [-10, 20]), 20, 14, 4); f.part(ell(add(bc, [0, 46]), 8, 8, 0, 8), V.IR(f, { inkW: 1, cast: false })); V.rope(f, [add(bc, [0, 50]), add(bc, [6, 120]), add(bc, [0, 180])], 5, { col: '#5a4e3c', fray: true }); }
  f.bone('hull_fore');
  { const stem = TF([1474, 340]); // the stem's head: a carved scroll bracket, and on it the woman leaning out over the sea
    const OAK = (o = {}) => V.WD(f, Object.assign({ fill: '#8a765a', light: '#b8a27e', shadow: '#2a1c10', inkW: 1.8, tex: 'wood' + s, texOp: 0.45 }, o));
    f.part([add(stem, [-40, 60]), add(stem, [10, -10]), add(stem, [80, -40]), add(stem, [120, -20]), add(stem, [110, 40]), add(stem, [60, 80]), add(stem, [0, 120])], OAK({ fill: '#5a4a38' })); // the scroll bracket
    f.line([add(stem, [0, 70]), add(stem, [50, 30]), add(stem, [90, 0]), add(stem, [100, 20]), add(stem, [80, 40])], 3, '#1e140c'); V.barnacles(f, add(stem, [40, 90]), 40, 20, 8, 3, 7);
    // (independent review) re-carved so she reads as a woman at game size, not a log: a figure leaning out from the stem,
    // her back arched, the breast and the crossed arms carved proud of the gown, heavy carved locks down her back, her
    // face in profile looking out to sea; the head brought inside the frame
    const FA = deg(-50), FH = frame(add(stem, [30, -16]), FA, 0.96);
    const body = FH([[-30, -30], [0, -46], [90, -40], [150, -46], [196, -56], [246, -42], [272, -16], [272, 8], [256, 26], [234, 50], [206, 80], [172, 60], [132, 40], [70, 56], [10, 64], [-30, 40]]);
    f.part(body, OAK({ shade: 0.36, maxShade: 22 }));
    V.clipDraw(f, body, () => {
      for (let k = 0; k < 5; k++) { const y0 = 40 - k * 12; f.stroke(FH([[-20, y0 + 10], [50, y0 + 4], [120, y0 - 4 + (k % 2) * 6]]), 3, '#2a1c10', { op: 0.55 }); f.line(FH([[-16, y0 + 4], [50, y0 - 2], [116, y0 - 10]]), 1.4, '#c8b48c', { op: 0.45 }); } // the gown's carved folds running down into the scroll
      hatchIn(f, FH([[-40, 30], [200, 40], [200, 90], [-40, 90]]), FA + deg(60), 7, '#1e140a', 0.45, 1.1); // the underside turned from the light
      V.saltCrust(f, FH([[110, -20]])[0], 50, 16, 12);
    });
    f.part(FH([[148, 36], [178, 26], [214, 32], [242, 48], [230, 72], [198, 86], [164, 70]]), OAK({ shade: 0.45, maxShade: 16, cast: false, inkW: 1.8 })); f.line(FH([[176, 30], [214, 36], [236, 50]]), 2, '#d8c49a', { op: 0.6 }); // the carved breast, its lit upper curve
    // the crossed arms in relief: the near upper arm down her side, the forearm folded across under the breast
    f.part(K.chain(FH([[232, -14], [196, 2], [160, 16]]), [34, 30, 28], { steps: 5 }), OAK({ shade: 0.4, maxShade: 12, cast: false, inkW: 1.4 }));
    f.part(K.chain(FH([[160, 16], [186, 34], [216, 44]]), [28, 26, 22], { steps: 5 }), OAK({ shade: 0.4, maxShade: 12, cast: false, inkW: 1.4 }));
    f.part(FH([[210, 30], [232, 30], [240, 44], [232, 56], [212, 54]]), OAK({ shade: 0.35, maxShade: 8, cast: false, inkW: 1.2 })); for (let k = 0; k < 3; k++) f.line(FH([[218 + k * 6, 32], [222 + k * 6, 50]]), 1.1, INK, { op: 0.6 }); // the hand, carved fingers
    // her head, held high and looking out over the sea, a carved face in profile
    const fhd = FH([[296, -26]])[0], HS2 = 88, hA2 = deg(-16);
    f.part(K.chain([FH([[250, -14]])[0], add(fhd, rot([-24, 36], hA2))], [46, 40], { steps: 4 }), OAK());
    // carved locks of hair falling from the crown down her back in heavy waves (behind the head, over the back)
    for (const [dy, w0, L] of [[-0.1, 30, 1.0], [0.05, 26, 0.86], [0.2, 22, 0.7]]) { const C = V.spline(FH([[300 - 20, -64 + dy * 40], [240, -70 + dy * 20], [190, -60 + dy * 20], [140, -58 + dy * 30], [140 - 60 * L, -50 + dy * 30]]), 6); f.part(V.ribbon(C, t => w0 * (1 - t * 0.6) + 4), OAK({ fill: '#6e5c44', shade: 0.4, maxShade: 10, cast: false, inkW: 1.3 })); f.line(C.slice(1, -2).map(q => add(q, [3, -3])), 1.6, '#c8b48c', { op: 0.5 }); }
    B.head(f, fhd, HS2, hA2, { skin: '#9a8664', jaw: 0.92, chin: 0.06, nose: 1.12, hook: 0.05, mouth: 'set', squint: 0.3, browDown: 0.02, faceShade: 0.8, faceHatch: false, jawShade: 0.28, lips: true, iris: '#5a4a34', eyeWhite: '#9a8a68', noEar: true, hairCol: '#6a5a40', hair: [[-0.46, 0.5], [-0.5, -0.2], [-0.24, -0.54], [0.16, -0.52], [0.32, -0.36], [0.1, -0.4], [-0.16, -0.3], [-0.28, 0.1], [-0.3, 0.5]] });
    const hf2 = frame(fhd, hA2, HS2);
    for (let k = 0; k < 4; k++) f.stroke(hf2([[-0.44 + k * 0.06, -0.3], [-0.58 + k * 0.06, 0.1], [-0.56 + k * 0.08, 0.5]]), 7, '#4a3a26', { op: 0.8 }); // carved strands at the temple
    f.part(hf2([[-0.2, -0.56], [0.06, -0.62], [0.24, -0.54], [0.1, -0.5], [-0.12, -0.46]]), OAK({ fill: '#7a6850', shade: 0.35, maxShade: 6, cast: false, inkW: 1.2 })); // a carved fillet across the brow
    // the split: a narrow jagged crack straight down the middle of her face and breast, black and charred at the lips
    const sp = [hf2([[0.16, -0.54]])[0], hf2([[0.2, -0.32]])[0], hf2([[0.24, -0.12]])[0], hf2([[0.22, 0.06]])[0], hf2([[0.26, 0.26]])[0], hf2([[0.22, 0.5]])[0], FH([[262, 16]])[0], FH([[230, 48]])[0], FH([[196, 70]])[0]];
    f.line(sp, 5, '#0a0604'); f.line(sp, 2.2, '#000'); f.line(sp.map(q => add(q, [-3.5, -1])), 1.2, '#e0cca0', { op: 0.6 });
    V.clipDraw(f, hf2(ell([0.05, 0.0], 0.44, 0.58, 0, 16)), () => V.lichtenberg(f, hf2([[0.16, -0.1]])[0], hA2 + Math.PI * 0.9, 150, 3.4, { depth: 3, fork: 0.8, col: '#0a0806', lite: '#e0c898' })); // the tree burned across her face
    V.kelpHang(f, FH([[40, 60]])[0], 100, 8, 3); V.drip(f, hf2([[0.3, 0.56]])[0], 1.6); V.barnacles(f, FH([[10, 50]])[0], 20, 10, 5, 3, 6); }
  // the wreckers' grapnel lines hooked into her rail, running down to the rocks
  for (const [x, h] of [[460, 'A'], [900, 'F']]) { const T = h === 'A' ? TA : TF; f.bone(h === 'A' ? 'hull_aft' : 'hull_fore'); const g0 = T([x, sheer(x) - 6]); for (const a2 of [-0.6, 0, 0.6]) f.stroke([g0, add(g0, rot([30, 0], -Math.PI / 2 + a2)), add(g0, rot([40, 0], -Math.PI / 2 + a2 * 1.6))], 7, P.iron); f.part(limb(g0, add(g0, [0, 50]), 12, 10, { steps: 3 }), V.IR(f, { inkW: 1.2, cast: false })); V.rope(f, [add(g0, [0, 50]), add(g0, [-40, 500]), add(g0, [-120, 1000]), add(g0, [-160, 1300])], 8, { col: '#6a5c44' }); }
  // the pump handle frozen mid-stroke above the rail
  f.bone('hull_fore'); { const p0 = TF([880, sheer(880) - 20]); f.part(limb(p0, add(p0, [0, -110]), 40, 34, { steps: 4 }), Object.assign({}, plank, { fill: '#4a4438' })); f.part(limb(add(p0, [0, -110]), add(p0, [130, -180]), 14, 10, { steps: 4 }), V.IR(f, { inkW: 1.4 })); V.weld(f, add(p0, [0, -110]), 0, 14, { burns: [[deg(80), 60, 1.8]] }); }

  // ---- the three drowned sailors at the rail, leaning over it, welded to its iron fittings through their pikes and hooks
  sailors.forEach(([x, h], i) => {
    const T = h === 'A' ? TA : TF, r0 = T([x, sheer(x)]);
    f.bone('sailor_' + (i + 1));
    // a bloated hunched back and belly bulging over the rail: a short wool jacket over the striped shirt (independent
    // review: the striped barrel read as a mannequin; the jacket gives a layer and the stripes now wrap the belly)
    const tc = add(r0, [-10, -120]); const shirtP = [add(tc, [-56, -40]), add(tc, [-20, -78]), add(tc, [30, -84]), add(tc, [66, -50]), add(tc, [84, 10]), add(tc, [92, 70]), add(tc, [70, 126]), add(tc, [10, 146]), add(tc, [-52, 132]), add(tc, [-74, 60]), add(tc, [-72, 0])];
    f.part(shirtP, { fill: '#a4a49c', shadow: '#3e4250', shade: 0.4, tex: 'weave' + s, texOp: 0.5 }); // the drowned's striped shirt
    V.clipDraw(f, shirtP, () => { for (let k = 0; k < 6; k++) f.stroke([add(tc, [-20, -46 + k * 34]), add(tc, [40, -44 + k * 34 + 8 + (k % 2) * 4]), add(tc, [100, -54 + k * 30])], 7, '#3c4a5a', { op: 0.7 }); V.saltCrust(f, add(tc, [30, 40]), 40, 60, 10); });
    const jk = [add(tc, [-60, -44]), add(tc, [-22, -80]), add(tc, [16, -84]), add(tc, [24, -40]), add(tc, [14, 30]), add(tc, [26, 96]), add(tc, [8, 140]), add(tc, [-52, 134]), add(tc, [-76, 60]), add(tc, [-74, 0])];
    f.part(jk, { fill: ['#50565e', '#5a554b', '#4a5058'][i], shadow: '#121418', light: '#6a6e74', shade: 0.42, tex: 'weave' + s, texOp: 0.55 }); // the jacket, sodden
    V.clipDraw(f, jk, () => { for (const [u, v] of [[-50, -10], [-30, 30], [-10, 70]]) f.stroke([add(tc, [u, v]), add(tc, [u + 26, v + 40]), add(tc, [u + 16, v + 80])], 3, '#060708', { op: 0.6 }); V.wetSheen(f, [add(tc, [-64, -10]), add(tc, [-66, 30]), add(tc, [-60, 70])], 2.4, 0.4); hatchIn(f, [add(tc, [-80, -40]), add(tc, [-40, -40]), add(tc, [-40, 140]), add(tc, [-80, 140])], deg(60), 7, '#060708', 0.5, 1.1); });
    f.line([add(tc, [16, -84]), add(tc, [24, -40]), add(tc, [14, 30]), add(tc, [26, 96])], 2, '#8a8e94', { op: 0.5 }); // the jacket's lit front edge
    for (let k = 0; k < 3; k++) { const q = add(tc, [20 - k * 2, -30 + k * 44]); f.part(ell(q, 6, 6, 0, 8), V.IR(f, { inkW: 1, cast: false })); } // horn buttons
    V.barnacles(f, add(tc, [-30, -60]), 30, 14, 6, 3, 6); f.part(K.chain([add(tc, [10, -70]), add(tc, [36, -110])], [50, 44], { steps: 3 }), V.DR(f)); // the neck
    { const nk = add(tc, [24, -84]); f.part([add(nk, [-30, -6]), add(nk, [26, -12]), add(nk, [30, 8]), add(nk, [-26, 14])], { fill: '#2c3240', shade: 0.4, inkW: 1.2, cast: false, tex: 'weave' + s }); f.part([add(nk, [10, 6]), add(nk, [24, 8]), add(nk, [28, 46]), [...add(nk, [16, 52]), 1], add(nk, [8, 36])], { fill: '#2c3240', shade: 0.4, inkW: 1.1, cast: false }); } // a sodden neckerchief
    // the head: bloated and bowed over the rail to the company, heavy lids over filmed eyes, livid; a knitted cap breaks
    // the skull's dome, wet hair hangs plumb from under it, the kelp hangs from the cap behind the ear, clear of the face
    const hc = add(tc, [30, -130]), HA3 = 0.42 + i * 0.06;
    B.head(f, hc, 100, HA3, { skin: P.drown, jaw: 1.3, chin: -0.02, nose: 1.08, hook: 0.1, mouth: 'set', squint: 0.55, browDown: 0.08, age: true, faceShade: 0.82, faceHatch: false, jawShade: 0.45, iris: '#c8cec6', eyeWhite: '#d8dad2', hairCol: '#2a2c22', beard: ['short', 'full', 'stubble'][i], beardCol: ['#3a3a32', '#4a463c', '#3a3a32'][i] });
    const hf3 = frame(hc, HA3, 100);
    f.part(hf3([[0.04, -0.09], [0.11, -0.12], [0.19, -0.1], [0.19, -0.055], [0.11, -0.06], [0.05, -0.05]]), V.DR(f, { fill: mix(P.drown, '#7a7898', 0.3), cast: false, inkW: 0, inkHeavy: 0, shade: 0.4 })); f.line(hf3([[0.05, -0.05], [0.11, -0.06], [0.19, -0.055]]), 2.2, INK, { op: 0.8 }); // swollen lids half over the filmed eye
    f.flat(hf3(ell([0.12, -0.0], 0.09, 0.035, 0, 10)), '#7a7898', { op: 0.5 }); // the bag under it
    f.flat(hf3([[0.2, 0.27], [0.3, 0.26], [0.3, 0.31], [0.2, 0.31]]), P.lips, { op: 0.9 }); // blue lips
    f.flat(hf3([[-0.1, 0.0], [0.12, -0.04], [0.18, 0.16], [0.0, 0.24]]), '#2a2c3a', { op: 0.22 }); // the cheek hollow turned from the light
    V.livid(f, hf3([[0.02, 0.12]])[0], 12, 10, 4); V.peel(f, hf3([[0.08, -0.26]])[0], 2, 0.8, 14);
    knitCap(f, hf3, ['#4e4a44', '#3c3a40', '#56524a'][i], s);
    V.barnacles(f, hf3([[-0.2, -0.56]])[0], 14, 8, 3, 3, 5);
    for (const [u, v, L] of [[-0.46, 0.04, 70], [-0.38, 0.1, 54], [-0.3, 0.12, 40]]) { const q = hf3([[u, v]])[0]; f.stroke([q, add(q, [-2, L * 0.5]), add(q, [2, L])], 9, '#1c1e18'); } // wet hair hanging plumb from under the cap
    for (const [u, v] of [[-0.5, 0.0], [-0.42, -0.1]]) V.kelpHang(f, hf3([[u, v]])[0], 50 + f.r() * 30, 5, (f.r() - 0.5) * 6); // kelp off the back of the cap
    f.bone(`sailor_${i + 1}_arm`);
    // the pike or hook: its iron head welded to the rail's fitting, the shaft held in the swollen hand, reaching down
    const p0 = add(r0, [40, 10]), p1 = add(p0, rot([620, 0], deg(78 + i * 4)));
    f.part(limb(add(p0, [0, -60]), p1, 18, 16, { steps: 8 }), V.WD(f, { tex: 'wood' + s }));
    const hd = frame(p1, deg(78 + i * 4), 1); if (i === 1) { f.part(hd([[-10, -10], [70, -4], [90, 0, 1], [70, 4], [-10, 10]]), V.IR(f, { inkW: 1.4 })); } else { f.part(hd([[-30, -10], [10, -8], [40, 10], [40, 40], [20, 54], [10, 50, 1], [24, 36], [20, 16], [0, 10], [-30, 10]]), V.IR(f, { inkW: 1.4 })); }
    V.weld(f, p0, deg(78), 22, { burns: [[deg(10), 100, 2.2], [deg(160), 80, 2]] });
    const pa = deg(78 + i * 4), gq = add(p0, rot([44, 0], pa)), el = add(r0, [150, -10]), sh = add(tc, [40, -40]);
    // the arm: the jacket sleeve to the elbow (muscle swell, the elbow's point), a turned-back cuff, the swollen bare forearm
    f.part(K.chain([sh, el], [50, 44], { steps: 6, bp: [[0, 0.35, 0.16]], bq: [[0, 0.75, 0.08]] }), { fill: ['#50565e', '#5a554b', '#4a5058'][i], shadow: '#121418', light: '#6a6e74', shade: 0.42, tex: 'weave' + s, texOp: 0.55 });
    f.line([lp(sh, el, 0.08, -18), lp(sh, el, 0.5, -20), lp(sh, el, 0.9, -16)], 2.4, '#8a8e94', { op: 0.55 }); // the sleeve's lit top
    for (let k = 0; k < 3; k++) f.stroke([lp(sh, el, 0.5 + k * 0.14, -22), lp(sh, el, 0.56 + k * 0.14, 0), lp(sh, el, 0.5 + k * 0.14, 22)], 2.4, '#060708', { op: 0.6 });
    f.part(K.chain([lerp(el, gq, 0.08), gq], [40, 32], { steps: 6, bp: [[0, 0.3, 0.14]], bq: [[0, 0.4, 0.1]] }), V.DR(f)); // the swollen forearm
    f.part(limb(lerp(el, gq, 0.02), lerp(el, gq, 0.16), 52, 50, { steps: 3 }), { fill: '#a4a49c', shadow: '#3e4250', shade: 0.4, inkW: 1.4, cast: false, tex: 'weave' + s }); f.stroke([lp(el, gq, 0.02, -24), lp(el, gq, 0.09, 0), lp(el, gq, 0.02, 24)], 5, '#3c4a5a', { op: 0.7 }); // the shirt cuff rolled back over the sleeve
    V.livid(f, lerp(el, gq, 0.55), 12, 8, 3); V.barnacles(f, lerp(el, gq, 0.4), 10, 6, 2, 3, 5);
    B.grip(f, gq, el, pa, 36, P.drown, { tex: 'mottle' + s, texOp: 0.5, shadow: P.drownS, name: 'prize sailor ' + (i + 1) });
  });
  // the rail in front of the sailors (they lean over it)
  for (const [aft, x0, x1] of [[true, 200, 790], [false, 810, 1140]]) { const M = aft ? MA : MF; f.bone(aft ? 'hull_aft' : 'hull_fore'); const rl = []; for (let x = x0; x <= x1; x += 20) rl.push([x, sheer(x) - 4]); f.part(M([...rl.map(q => add(q, [0, -16])), ...rl.slice().reverse().map(q => add(q, [0, 14]))]), Object.assign({}, plank, { fill: '#5a544a' })); f.line(M(rl.map(q => add(q, [0, -14]))), 2, '#a89e8c', { op: 0.5 }); }

  // ---- surf breaking white along the waterline, over the rocks, and the rocks in front
  f.bone('sea');
  f.part(rocks, { fill: '#2c3036', shadow: '#0c0e12', light: '#5a626a', shade: 0.42, tex: 'pit' + s, texOp: 0.6 });
  V.clipDraw(f, rocks, () => { for (let i = 0; i < 5; i++) f.line([[0, 1440 + i * 30], [400, 1450 + i * 30], [800, 1430 + i * 30], [1200, 1450 + i * 30], [1600, 1440 + i * 30]], 1.2, INK, { op: 0.4 }); V.barnacles(f, [800, 1460], 780, 40, 60, 4, 10); V.wetSheen(f, [[100, 1420], [300, 1430], [500, 1400], [700, 1420], [900, 1410]], 3, 0.5); });
  for (let x = -10; x < 1880; x += 16 + f.r() * 20) { const q = [x, 1380 + (f.r() - 0.5) * 50]; f.flat(lumpE(f, q, 14 + f.r() * 22, 6 + f.r() * 10, 0, 0.4, 10), f.r() > 0.35 ? P.foam : P.surfD, { op: 0.9 }); if (f.r() > 0.6) f.line(ell(q, 10, 4, 0, 8), 1, P.surfS, { op: 0.6 }); }
  for (const [x, hh2] of [[200, 120], [620, 160], [1080, 140], [1400, 200], [1700, 120]]) for (let k = 0; k < 5; k++) { const q = [x + (f.r() - 0.5) * 120, 1380 - f.r() * hh2]; f.flat(lumpE(f, q, 8 + f.r() * 16, 5 + f.r() * 10, 0, 0.5, 8), P.foam, { op: 0.6 + f.r() * 0.3 }); } // surf thrown up her side
  V.shiftFig(f, -290, 0); // the bow and the figurehead into the frame; the stern runs out past the far edge
  return f;
}

module.exports = {
  heroes: [
    { key: 'last_prize', name: 'The Last Prize', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: lastPrize },
    { key: 'wind_seller', name: 'The Wind-Seller', tier: 'ruler', w: 1700, h: 1900, flip: true, build: windSeller },
    { key: 'gibbeted_wrecker', name: 'The Gibbeted Wrecker', tier: 'elite', w: TIERS.elite[0], h: 1560, flip: true, build: gibbetedWrecker },
    { key: 'strand_wife', name: 'The Strand-Wife', tier: 'elite', w: 1600, h: TIERS.elite[1], flip: true, build: strandWife },
    { key: 'lantern_cow', name: 'Lantern Cow', tier: 'large', w: 1600, h: TIERS.large[1], flip: true, build: lanternCow },
    { key: 'ship_breaker', name: 'Ship-Breaker', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: shipBreaker },
    { key: 'storm_petrels', name: 'Storm Petrels', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: stormPetrels },
    { key: 'rock_octopus', name: 'Rock Octopus', tier: 'small', w: TIERS.small[0], h: TIERS.small[1], flip: true, build: rockOctopus },
    { key: 'drowned_drummer', name: 'Drowned Drummer', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: drownedDrummer },
    { key: 'cragsman', name: 'Cragsman', tier: 'human', w: 900, h: TIERS.human[1], flip: true, build: cragsman },
    { key: 'drowned_merchant', name: 'Drowned Merchant', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: drownedMerchant },
  ],
};
