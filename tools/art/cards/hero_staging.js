// Hero staging draft (2026-11-25, hero-card agent): framings and new act poses for the hero cards that remain after
// the re-route (hero_routes.js). Nothing here is wired into samples.js yet. `node cards/hero_staging.js` validates every
// new pose on every figure of its calling with the existing checks (rig.js joint limits, plumb props, flask mouths,
// two-handed turns; check_poses.js face clearance, drape and joint cover) plus two new ones:
//   legs: a knee bends one way only (shin swings back from the thigh, 0 to 140 degrees) and a thigh stays in the hip
//         range (-40 forward to 150 back), so a lunge or a stride never breaks a knee;
//   frame: each pose lands inside the card in every framing it is used in (the act's anchor 24 px inside; the face
//         either 24 px inside or cropped wholly out by 30 px, never cut through the eyes).
'use strict';
const K = require('./card_kit');
const RIGM = require('./rig');
const CP = require('./check_poses');
const { RIG, FIGURES, ARMS, jointFaults } = RIGM;
const { W, H } = K;

// ==== framings. at/scale are per card from a seeded choice inside these ranges (and the deck-level spread, phase 2).
// anchor: what lands on `at`; 'feet' = the lowest ankle on the floor line.
const FRAMES = {
  full: { anchor: 'feet', scale: [0.66, 0.92], at: [[120, 960], [470, 640]], face: 'in', note: 'whole figure on a visible floor, the act wide round it; the room seen deep' },
  three: { anchor: 'head', scale: [1.25, 1.8], at: [[180, 780], [110, 300]], face: 'in', note: 'cut at mid thigh, figure half the frame wide (was 1.2 to 1.45 in the left third)' },
  close: { anchor: 'grip', scale: [1.7, 2.6], at: [[420, 720], [240, 380]], face: 'either', note: 'the hand and the weapon or prop together filling the frame (anchored between the grip and the act); the FX big' },
  low: { anchor: 'head', scale: [1.35, 1.9], at: [[220, 760], [90, 140]], face: 'in', horizon: 0.82, note: 'feet below the bottom edge, horizon low, the pool behind the head so the figure towers back-lit' },
  ots: { anchor: 'head', scale: [2.0, 2.8], at: [[90, 220], [190, 300]], face: 'in', shade: 0.55, fxScale: 0.6, note: 'head and shoulder huge at the left edge in shadow, looking into the lit room where the act lands small and far' },
};

// ==== leg limits (new; measured rests: knee bends 0 to 69, thighs 32 to 109 degrees)
const KNEE = [-5, 140], HIP = [-40, 150];
function legFaults(cls, key, pose) {
  const S = CP.shapesOf(cls, key), J = S.h0.J, out = [];
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  for (const s of ['n', 'f']) {
    if (!J['thigh_' + s] || !J['shin_' + s] || !J['foot_' + s]) continue;
    const t = J['thigh_' + s].pivot, k = J['shin_' + s].pivot, f = J['foot_' + s].pivot;
    const th = ang(t, k) + (pose['thigh_' + s] || 0) + (pose.pelvis || 0) + (pose.lean || 0);
    const bend = ang(k, f) - ang(t, k) + (pose['shin_' + s] || 0);
    if (bend < KNEE[0] || bend > KNEE[1]) out.push(`knee_${s} bends ${Math.round(bend)} (limit ${KNEE[0]} to ${KNEE[1]})`);
    if (th < HIP[0] || th > HIP[1]) out.push(`thigh_${s} points at ${Math.round(th)}, outside the hip range ${HIP[0]} to ${HIP[1]}`);
    if (Math.abs(pose['foot_' + s] || 0) > 35) out.push(`foot_${s} turns ${pose['foot_' + s]} (limit 35)`);
  }
  return out;
}

// ==== the Executioner's far arm, solved so the far hand stays on the grip (L24) instead of tuned by hand
function solveGrip(pose, mod = 'worlds/hero_paths_A', key = 'duelist_executioner') {
  const base = Object.assign({}, pose); delete base.vary; delete base.upperarm_f; delete base.forearm_f; delete base.hand_f;
  const h0 = K.hero(mod, key, {}), h = K.hero(mod, key, base);
  const T = h.at('hand_n', h0.J.hand_f.pivot), S = h.joint('upperarm_f'), E = h.joint('forearm_f'), Wr = h.joint('hand_f');
  const l1 = Math.hypot(E[0] - S[0], E[1] - S[1]), l2 = Math.hypot(Wr[0] - E[0], Wr[1] - E[1]), d = Math.min(l1 + l2 - 1e-6, Math.hypot(T[0] - S[0], T[1] - S[1]));
  const aT = Math.atan2(T[1] - S[1], T[0] - S[0]), aE = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)), deg = x => x * 180 / Math.PI;
  const a0 = Math.atan2(E[1] - S[1], E[0] - S[0]), b0 = Math.atan2(Wr[1] - E[1], Wr[0] - E[0]);
  const wrapD = a => ((a % 360) + 540) % 360 - 180;
  let best = null;
  for (const sgn of [1, -1]) {   // the two elbow solutions; keep the one whose fold matches the rest drawing
    const a1 = aT + sgn * aE, E1 = [S[0] + l1 * Math.cos(a1), S[1] + l1 * Math.sin(a1)], b1 = Math.atan2(T[1] - E1[1], T[0] - E1[0]);
    const ua = wrapD(deg(a1 - a0)), fa = wrapD(deg(b1 - b0) - ua);
    const t = (pose.torso || 0) + (pose.lean || 0), tiltN = t + (pose.upperarm_n || 0) + (pose.forearm_n || 0) + (pose.hand_n || 0);
    const hf = wrapD(tiltN - (t + ua + fa)), v = { upperarm_f: +ua.toFixed(1), forearm_f: +fa.toFixed(1), hand_f: +hf.toFixed(1) };
    const faults = jointFaults(Object.assign({}, pose, v), ARMS.duelist_executioner);
    if (!best || faults.length < best.faults.length) best = { v, faults };
  }
  return best.v;
}

// ==== new poses (appended to RIG[calling].act / .block at integration). `mech` is the act's mechanic from
// hero_routes.HERO; a card takes the pose whose mech matches its own, then by hash among those. `frames` lists the
// framings the pose is drawn in; the validator checks it in each.
const POSES = {
  bulwark: [
    { mech: ['uppercut'], frames: ['three', 'full'], pose: { upperarm_n: -45, forearm_n: 30, hand_n: -25, torso: 6, lean: 4, head: -4 }, weapon: ['mace', [500, 236]], style: 'swing', pivot: 'upperarm_n', sweep: -80 },
    { mech: ['beckon'], frames: ['full', 'three'], pose: { upperarm_n: 5, forearm_n: 50, hand_n: 30, torso: -4, lean: -2, head: -6 }, weapon: ['hand_n', null], style: 'taunt' },
    { mech: ['sweep', 'swing'], frames: ['full', 'three'], pose: { torso: 16, lean: 6, head: -6, upperarm_f: -30, upperarm_n: 20, forearm_n: 20 }, weapon: ['door', [530, 300]], style: 'sweep' },
    { mech: ['charge', 'shove'], frames: ['full', 'three'], pose: { torso: 10, lean: 12, head: -8, upperarm_f: -14, thigh_n: -32, shin_n: 34, thigh_f: 24, shin_f: 4 }, weapon: ['door', [530, 300]], style: 'strike' },
    { mech: ['rise'], frames: ['full', 'three'], pose: { torso: 34, lean: 8, head: -14, upperarm_n: 10, forearm_n: 60, hand_n: 30, upperarm_f: -6 }, weapon: ['hand_n', null], style: 'rise' },
    { mech: ['brace'], frames: ['low', 'full'], block: true, pose: { torso: 22, lean: 8, head: -12, upperarm_f: -8, upperarm_n: -10, forearm_n: 20, thigh_n: -20, shin_n: 30 }, face: ['door', [526, 330]], wood: true },
    { mech: ['wade'], frames: ['full'], block: true, pose: { torso: 8, lean: 5, head: -4, upperarm_n: -25, forearm_n: 15, thigh_n: -22, shin_n: 20, thigh_f: 18 }, face: ['door', [526, 300]], wood: true },
  ],
  duelist: [
    { mech: ['lunge'], frames: ['full'], pose: { lean: 14, torso: 6, head: -10, cape: -20, upperarm_n: -28, forearm_n: 10, hand_n: -10, thigh_n: -42, shin_n: 40, thigh_f: 24, shin_f: 4 }, weapon: ['rapier', [588, 518]], style: 'strike', off: [40, 0] },
    { mech: ['spin', 'sweep'], frames: ['full', 'three'], pose: { torso: -8, lean: -4, head: -4, cape: 20, upperarm_n: -55, forearm_n: 5, hand_n: 10 }, weapon: ['rapier', [588, 518]], style: 'spin' },
    { mech: ['bow'], frames: ['full'], pose: { torso: 26, lean: 4, head: 16, cape: 14, upperarm_n: 40, forearm_n: 10, hand_n: 10 }, weapon: ['rapier', [588, 518]], style: 'flourish' },
    { mech: ['slip', 'retreat'], frames: ['full', 'three'], pose: { torso: -16, lean: -9, head: 8, cape: 16, upperarm_n: -5, forearm_n: 5, thigh_n: 18, thigh_f: -12 }, weapon: ['rapier', [588, 518]], style: 'cuts' },
    { mech: ['raise'], frames: ['full'], pose: { torso: -4, lean: -2, head: -6, upperarm_n: -50, forearm_n: -50, hand_n: 10 }, weapon: ['rapier', [588, 518]], style: 'raise' },
    { mech: ['stance'], frames: ['full'], block: true, pose: { torso: -6, lean: -3, upperarm_n: -20, forearm_n: 16, hand_n: 0, thigh_n: -16, shin_n: 18, thigh_f: 14 }, face: ['rapier', [520, 460]] },
  ],
  elementalist: [
    { mech: ['pour', 'swing'], frames: ['full', 'low'], pose: { torso: 40, lean: 8, head: 12, upperarm_n: 10, forearm_n: 30 }, hide: ['sign'], hand: ['hand_n', null], style: 'pour' },
    { mech: ['gust', 'blast'], frames: ['ots', 'low'], pose: { torso: -10, lean: -4, head: -12, upperarm_n: 30, forearm_n: 40 }, hide: ['sign'], hand: ['head', null], style: 'gust' },
    { mech: ['gather'], frames: ['full'], pose: { upperarm_n: -150, forearm_n: 115, hand_n: -20, torso: -4, head: -6, vary: { elementalist_catalyst: { upperarm_n: -140, forearm_n: 100 } } }, hide: ['sign'], hand: ['hand_n', null], style: 'gather' },
    { mech: ['sand'], frames: ['three', 'full'], pose: { upperarm_n: -30, forearm_n: 90, hand_n: 20, torso: 8, lean: 4 }, hide: ['sign'], hand: ['hand_n', null], style: 'sand' },
    { mech: ['still', 'press'], frames: ['close'], pose: { upperarm_n: -10, forearm_n: 40, hand_n: 10, torso: 6, head: 10 }, hide: ['sign'], hand: ['hand_n', null], style: 'press' },
  ],
  alchemist: [
    { mech: ['point', 'thrust'], frames: ['three', 'low'], pose: { upperarm_n: -60, forearm_n: 40, hand_n: 10, torso: 8, lean: 4, vary: { alchemist_transmuter: { forearm_n: 15 } } }, hand: ['hand_n', null], style: 'strike' },
    { mech: ['swing'], frames: ['full', 'ots'], pose: { upperarm_n: -70, forearm_n: 10, hand_n: 20, torso: 4, lean: 2 }, hand: ['hand_n', null], style: 'swing' },
  ],
  oracle: [
    { mech: ['swing'], frames: ['full', 'three'], pose: { upperarm_n: -10, forearm_n: 10, hand_n: 10, torso: 6, lean: 4 }, hand: ['hand_n', null], style: 'swing' },
    { mech: ['scatter'], frames: ['full'], pose: { upperarm_n: 22, forearm_n: 48, hand_n: -45, vary: { oracle_chronomancer: { upperarm_n: 10, forearm_n: 30, hand_n: -20 }, oracle_fatebinder: { upperarm_n: 10, forearm_n: 30, hand_n: -20 } } }, hand: ['hand_n', null], style: 'scatter' },
    { mech: ['lash', 'thread'], frames: ['full', 'three', 'ots'], pose: { upperarm_n: -25, forearm_n: 60, hand_n: -20, torso: 4, head: -4 }, hand: ['hand_n', null], style: 'thread' },
    { mech: ['veil'], frames: ['three'], block: true, pose: { upperarm_f: -30, torso: -6, lean: -3, head: 6 }, face: ['hand_n', null], off: [120, 0] },
    { mech: ['sand', 'walk'], frames: ['full'], pose: { lean: 3, thigh_n: -20, shin_n: 16, thigh_f: 16, upperarm_n: -10, forearm_n: 10 }, hand: ['hand_n', null], style: 'sand' },
    { mech: ['pour'], frames: ['close'], pose: { upperarm_n: -15, forearm_n: 15, hand_n: 25 }, hand: ['hourglass', null], style: 'pour' },
  ],
  hexweaver: [
    { mech: ['spit', 'gust'], frames: ['three', 'ots'], pose: { torso: 14, head: 14, lean: 8 }, hand: ['head', null], style: 'gust' },
    { mech: ['lunge', 'stab'], frames: ['low', 'three'], pose: { lean: 12, torso: 10, upperarm_f: 55, forearm_f: -30, hand_f: -10 }, weapon: ['pin', [440, 372]], style: 'strike' },
    { mech: ['chop', 'swing'], frames: ['low', 'full'], pose: { torso: 10, lean: 6, upperarm_f: 40, forearm_f: -20 }, weapon: ['hand_f', null], style: 'swing', pivot: 'upperarm_f', sweep: 60 },
    { mech: ['gather'], frames: ['three'], pose: { upperarm_n: -15, forearm_n: 10, upperarm_f: 60, forearm_f: -40, torso: 10 }, hand: ['hand_n', null], style: 'gather' },
    { mech: ['brace'], frames: ['full'], block: true, pose: { upperarm_n: -15, forearm_n: 12, upperarm_f: -15, torso: -4, lean: -2 }, face: ['poppet', null], off: [80, -10] },
  ],
  vessel: [],
};

// the close crop's centre: between the hand that holds the act's prop (or makes it) and the act point
function gripPt(h, ref, refPt) { let b = ref && h.J[ref[0]] ? ref[0] : 'hand_n'; while (b && !/^hand_/.test(b) && h.J[b]) b = h.J[b].parent; const hand = h.J[b] ? h.joint(b) : h.joint('hand_n'); return [hand[0] + (refPt[0] - hand[0]) * 0.45, hand[1] + (refPt[1] - hand[1]) * 0.45]; }
// ==== placement for a framing (the middle of its ranges here; per card in phase 2)
function placeIn(cls, key, P, frameName, at, scale) {
  const F = FRAMES[frameName], [mod, k, list] = key === cls ? ({ bulwark: ['dirAC', 'bulwark'], duelist: ['dirAC', 'duelist'], elementalist: ['dirAC', 'elementalist_fire', 'signs'], alchemist: ['dirAC2', 'alchemist'], oracle: ['dirAC2', 'oracle'], hexweaver: ['dirAC2', 'hexweaver'], vessel: ['worlds/hero_vessel', 'vessel'] })[cls] : [/^(bulwark|duelist|elementalist)_/.test(key) ? 'worlds/hero_paths_A' : 'worlds/hero_paths_B', key];
  const h = K.hero(mod, k, P.pose, list || 'heroes', { hide: P.hide });
  const ref = P.weapon || P.hand || P.face;
  const refPt = (!ref || !h.J[ref[0]]) ? h.joint('hand_n') : ref[1] ? h.at(ref[0], ref[1]) : h.joint(ref[0]);
  const feet = ['foot_n', 'foot_f'].filter(n => h.J[n]).map(n => h.joint(n)).sort((a, b) => b[1] - a[1])[0];
  const A = F.anchor === 'feet' ? feet : F.anchor === 'act' ? refPt : F.anchor === 'grip' ? gripPt(h, ref, refPt) : h.joint('head');
  scale = scale ?? (F.scale[0] + F.scale[1]) / 2; at = at ?? F.at.map(r => (r[0] + r[1]) / 2);
  const M = p => K.mapPt(p, A, at, scale);
  return { h, M, A, at, scale, act: M(refPt), head: M(h.joint('head')), face: M(h.at('head', CP.FACE[key] || CP.FACE[cls])) };
}
// the placements inside a framing's ranges (5 x 5 positions, 3 scales) where the act and the face land legally;
// phase 2 picks a card's placement from these, so a pose fails a framing only when none exists
const M24 = 24, inC = p => p[0] > M24 && p[0] < W - M24 && p[1] > M24 && p[1] < H - M24;
const outC = p => p[0] < -30 || p[0] > W + 30 || p[1] < -30 || p[1] > H + 30;
function placements(cls, key, P, frameName, fine = false) {
  const F = FRAMES[frameName], ok = [], lerp1 = (r, t) => r[0] + (r[1] - r[0]) * t, TX = fine ? [0, 1 / 8, 2 / 8, 3 / 8, 4 / 8, 5 / 8, 6 / 8, 7 / 8, 1] : [0, 0.25, 0.5, 0.75, 1];
  const pl0 = placeIn(cls, key, P, frameName, [0, 0], 1);   // unit placement; others are affine in it
  const rel = p => [p[0] - pl0.at[0], p[1] - pl0.at[1]];
  const act = rel(pl0.act), face = rel(pl0.face);
  for (const ts of (fine ? [0, 1 / 3, 2 / 3, 1] : [0, 0.5, 1])) for (const tx of TX) for (const ty of [0, 0.25, 0.5, 0.75, 1]) {
    const s = lerp1(F.scale, ts), at = [lerp1(F.at[0], tx), lerp1(F.at[1], ty)], map = q => [at[0] + q[0] * s, at[1] + q[1] * s];
    const a = map(act), f = map(face);
    if (!inC(a)) continue;
    if (F.face === 'in' && !inC(f)) continue;
    if (F.face === 'either' && !inC(f) && !outC(f)) continue;
    ok.push({ at, scale: s });
  }
  return ok;
}
function frameFaults(cls, key, P, frameName) {
  const n = placements(cls, key, P, frameName).length;
  return n ? [] : [`${frameName}: no placement in the framing's range keeps the act anchor and the face legal`];
}

// ==== validate every new pose on every figure of its calling
function validate() {
  const bad = [], merged = {};
  for (const cls of Object.keys(RIG)) merged[cls] = { act: RIG[cls].act.slice(), block: RIG[cls].block.slice() };
  for (const [cls, list] of Object.entries(POSES)) for (const P of list) {
    if (cls === 'duelist') P.pose.vary = Object.assign({}, P.pose.vary, { duelist_executioner: solveGrip(P.pose) });
    (P.block ? merged[cls].block : merged[cls].act).push(P);
  }
  // rig.js's own validator on the merged table; keep only the faults of the new poses (the old ones already pass)
  const isNew = s => { const m = /^(\w+)\.(act|block)\[(\d+)\]/.exec(s); return m && +m[3] >= RIG[m[1]][m[2]].length; };
  try { RIGM.validate(merged); } catch (e) { bad.push(...e.message.split('\n').slice(1).map(s => s.trim()).filter(isNew)); }
  for (const [cls, list] of Object.entries(POSES)) list.forEach((P, i) => {
    for (const key of Object.keys(FIGURES[cls])) {
      const where = `${cls}.new[${i}] (${P.mech.join('/')}) on ${key}`;
      for (const f of CP.shapeFaults(cls, key, P.pose)) bad.push(`${where}: ${f}`);
      for (const f of legFaults(cls, key, Object.assign({}, P.pose, (P.pose.vary || {})[key] || {}))) bad.push(`${where}: ${f}`);
      for (const fr of P.frames) for (const f of frameFaults(cls, key, P, fr)) bad.push(`${where}: ${f}`);
    }
  });
  return bad;
}
module.exports = { FRAMES, POSES, KNEE, HIP, legFaults, solveGrip, placeIn, placements, frameFaults, validate, gripPt };
if (require.main === module) {
  const bad = validate();
  const n = Object.values(POSES).reduce((a, l) => a + l.length, 0);
  if (bad.length) { console.log(`${n} new poses: ${bad.length} faults\n  ` + bad.join('\n  ')); process.exit(1); }
  console.log(`${n} new poses pass on every figure: joints, plumb, mouth, two-hand (rig.js), face, drape, cover (check_poses.js), legs, frames`);
}
