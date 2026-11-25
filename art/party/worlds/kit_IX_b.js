// World IX, The Hollow Barrow, second batch (IX_b): re-exports the first batch's kit (kit_IX.js, unchanged) and adds the
// helpers this batch needs. Copied from reviewed kits so the barrow does not depend on other worlds' files: the wing,
// feather, plumeMass, featherHem and talonFoot builders (kit_VI, reviewed: slotted primaries, layered coverts), the
// arthropod leg (world_IV Pit Crawler: thick-based jointed segments, lit ridge, pale joint membrane), the timber and
// tally builders (kit_VIII_b). New: humanoid limb builders for the household (arm with sleeve, leg with hose, wraps and
// shoes), a frost-filmed eye under a heavy lid and a dead grey head, one rat with its own random build (no two alike), a
// rat's scaly tail, a wrapped grave-linen corpse for the cart's heap, a small dark animal eye, and a mild perspective
// projection for the Dead-Cart. All helpers draw into the current bone unless they take bone names.
// Palette: the first batch's (grey-green frost, bone, mould; ink, bone, grey; rust and tarnished silver where named; red
// only for the plague cross on the Watchman's box). No eye motifs: IX is not a void world.
'use strict';
const K = require('../kit');
const X0 = require('./kit_IX');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { P, split, side, jcut, jointLimb, spline, clipDraw, fistDetail, hairClump, offsetLine, crease, softTone, livid, openHand } = X0;

const R = (f, a, b) => a + (b - a) * f.r();
const dir = a => [Math.cos(a), Math.sin(a)];
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);

// extra textures (call instead of X0.textures): barb (feather vanes), grain (split oak), wicker (woven withies), knit
function texturesB(f) {
  X0.textures(f);
  const s = f.o.seed, r = E.rng(s * 11 + 5);
  f.defs.push(`<pattern id="barb${s}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="0.7" opacity="0.5"/></pattern>`);
  let g = '';
  for (let i = 0; i < 7; i++) { const y = r() * 40; g += `<path d="M0,${y.toFixed(1)} q${(20 + r() * 20).toFixed(1)},${((r() - 0.5) * 4).toFixed(1)} 60,${((r() - 0.5) * 3).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${(0.6 + r() * 0.6).toFixed(1)}" opacity="0.6"/>`; }
  for (let i = 0; i < 3; i++) { const x = r() * 60, y = r() * 40; g += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4" ry="1.8" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="grain${s}" patternUnits="userSpaceOnUse" width="60" height="40">${g}</pattern>`);
  f.defs.push(`<pattern id="grainv${s}" patternUnits="userSpaceOnUse" width="60" height="40" patternTransform="rotate(90)">${g}</pattern>`);
  let w = '';
  for (let i = 0; i < 4; i++) w += `<path d="M0,${i * 6 + 3} q4,-3 8,0 t8,0" fill="none" stroke="${INK}" stroke-width="1" opacity="0.7"/>`;
  w += '<path d="M4,0 v24 M12,0 v24" stroke="#000" stroke-width="1.2" opacity="0.45"/>';
  f.defs.push(`<pattern id="wicker${s}" patternUnits="userSpaceOnUse" width="16" height="24">${w}</pattern>`);
  f.defs.push(`<pattern id="knit${s}" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M0,0 l3,4 l3,-4 M0,3 l3,4 l3,-4" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.5"/></pattern>`);
  // checker for motley: two-tone squares, laid at a slant
  f.defs.push(`<pattern id="scute${s}" patternUnits="userSpaceOnUse" width="8" height="6"><path d="M0,6 q4,-6 8,0" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/></pattern>`);
}

// ---- humanoid limbs for the household --------------------------------------------------------------------------
// a cloth tube along pts with widths ws, its far end a torn or rolled hem; o.rag: tooth depth, o.roll: a rolled cuff
function sleeveShape(f, pts, ws, o = {}) {
  const ch = K.chain(pts, ws, { steps: 8, bp: o.bp, bq: o.bq }), n = ch.length / 2, Pp = ch.slice(0, n), Q = ch.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], wb = ws[ws.length - 1];
  const hem = [];
  if (o.roll) { for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6; hem.push(add(b, add(mul(nn, Math.cos(an) * wb / 2), mul(d, Math.sin(an) * wb * 0.12)))); } }
  else { // a torn hem: tongues of uneven length and spacing, some split, never a regular sawtooth
    const k = (o.teeth || 6) * 2, rag = o.rag ?? 8; let u = wb / 2; const step = wb / k;
    for (let i = 1; i < k; i++) { u -= step * R(f, 0.55, 1.45); if (u < -wb / 2 + step * 0.3) break; const tongue = f.r() < 0.45, dep = tongue ? rag * R(f, 0.5, 1.6) : -rag * R(f, 0.0, 0.35); hem.push([...add(add(b, mul(nn, u)), mul(d, dep)), tongue && f.r() < 0.6 ? 1 : 0]); } }
  const a0 = pts[0], d0 = E.norm(sub(pts[1], a0)), n0 = [-d0[1], d0[0]], w0 = ws[0], cap = [];
  for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6; cap.push(add(a0, add(mul(n0, -Math.cos(an) * w0 / 2), mul(d0, -Math.sin(an) * w0 * 0.3)))); }
  return [...Pp, ...hem, ...Q, ...cap];
}
// An arm: bare skin from shoulder to wrist, split over upperarm/forearm, with an optional sleeve over it.
// o.ws [shoulder, elbow, wrist] skin widths; o.skin look; o.sleeve = { look, to (0..1 along the upper arm, 1..2 along the
// forearm), slack (width factor), rag, roll, teeth }; o.under(): extra drawing on the skin (forearm bone) before the sleeve.
function arm(f, S, Ee, W, sfx, o = {}) {
  const ws = o.ws || [50, 42, 32], r = o.r ?? ws[1] * 0.55;
  const [cU, cF] = jcut(S, Ee, W, r);
  split(f, () => { const d = f.part(jointLimb(S, Ee, lerp(Ee, W, 0.92), ws, { point: o.point ?? 0.4, mus0: o.mus0 ?? 0.14, mus1: o.mus1 ?? 0.28 }), Object.assign({ maxShade: ws[1] * 0.32 }, o.skin));
    if (o.model) clipDraw(f, d, () => { // modelled muscle on a bare arm: the deltoid's edge, the groove between biceps and triceps, the lit and the shadowed side, the elbow's knob, the forearm's belly
      const nU = E.norm([-(Ee[1] - S[1]), Ee[0] - S[0]]), litU = (nU[0] * -f.L[0] + nU[1] * -f.L[1]) > 0 ? 1 : -1, nF = E.norm([-(W[1] - Ee[1]), W[0] - Ee[0]]), litF = (nF[0] * -f.L[0] + nF[1] * -f.L[1]) > 0 ? 1 : -1;
      softTone(f, d, [[[lp(S, Ee, -0.1, -litU * ws[0] * 0.15), lp(S, Ee, 1.0, -litU * ws[1] * 0.1), lp(S, Ee, 1.0, -litU * ws[1]), lp(S, Ee, -0.1, -litU * ws[0])], '#000', 0.4, ws[0] * 0.12], [[lp(S, Ee, 0.0, litU * ws[0] * 0.15), lp(S, Ee, 0.8, litU * ws[1] * 0.12), lp(S, Ee, 0.8, litU * ws[1] * 0.42), lp(S, Ee, 0.0, litU * ws[0] * 0.45)], '#ffffff', 0.16, ws[0] * 0.1],
        [[lp(Ee, W, 0.05, -litF * ws[1] * 0.1), lp(Ee, W, 1.0, -litF * ws[2] * 0.05), lp(Ee, W, 1.0, -litF * ws[2]), lp(Ee, W, 0.05, -litF * ws[1])], '#000', 0.35, ws[1] * 0.1]]);
      crease(f, [lp(S, Ee, 0.04, litU * ws[0] * 0.48), lp(S, Ee, 0.3, litU * ws[0] * 0.12), lp(S, Ee, 0.44, -litU * ws[0] * 0.18)], Math.max(2, ws[0] * 0.035), { col: '#1a1814', op: 0.55 });
      crease(f, [lp(S, Ee, 0.45, -litU * ws[0] * 0.05), lp(S, Ee, 0.7, -litU * ws[1] * 0.1), lp(S, Ee, 0.92, -litU * ws[1] * 0.05)], Math.max(1.6, ws[0] * 0.03), { col: '#1a1814', op: 0.5 });
      f.flat(ell(Ee, ws[1] * 0.2, ws[1] * 0.14, ang(S, Ee), 8), '#ffffff', { op: 0.12 });
      crease(f, [lp(Ee, W, 0.08, litF * ws[1] * 0.3), lp(Ee, W, 0.35, litF * ws[1] * 0.12), lp(Ee, W, 0.7, 0)], Math.max(1.6, ws[1] * 0.03), { col: '#1a1814', op: 0.45 }); }); },
    [['upperarm' + sfx, cU], ['forearm' + sfx, cF]]);
  f.bone('forearm' + sfx);
  if (o.under) o.under();
  const sl = o.sleeve;
  if (sl) {
    const k = sl.slack ?? 1.22, to = sl.to ?? 1.5;
    if (to <= 1) {
      f.bone('upperarm' + sfx);
      const end = lerp(S, Ee, to), we = ws[0] + (ws[1] - ws[0]) * to;
      f.part(sleeveShape(f, [add(S, mul(E.norm(sub(S, Ee)), ws[0] * 0.3)), lerp(S, end, 0.5), end], [ws[0] * k, (ws[0] + we) / 2 * k, we * k * 1.06], sl), Object.assign({ maxShade: ws[0] * 0.4 }, sl.look));
    } else {
      const end = lerp(Ee, W, to - 1), we = ws[1] + (ws[2] - ws[1]) * (to - 1);
      // the sleeve has a body under it: swelling over the shoulder and biceps, pinched at the elbow, the cuff flaring
      const sp = [add(S, mul(E.norm(sub(S, Ee)), ws[0] * 0.3)), lerp(S, Ee, 0.42), lerp(S, Ee, 0.94), lerp(Ee, end, 0.45), end];
      const sw = [ws[0] * k * 0.98, ws[0] * k * 1.06, ws[1] * k * 0.9, (ws[1] + we) / 2 * k * 0.98, we * k * 1.18];
      split(f, () => { const sd = f.part(sleeveShape(f, sp, sw, sl), Object.assign({ maxShade: ws[0] * 0.4 }, sl.look));
        clipDraw(f, sd, () => { for (let i = 0; i < 3; i++) { const t0 = R(f, 0.05, 0.3), off = (i - 1) * ws[0] * 0.28; f.stroke([lp(S, Ee, t0, off), lp(S, Ee, t0 + 0.3, off * 0.7 + R(f, -3, 3)), lp(S, Ee, t0 + 0.55, off * 0.4)], Math.max(2, ws[0] * 0.06), '#12130f', { op: 0.42 }); } // drag folds down the upper sleeve
          for (let i = 0; i < 2; i++) f.stroke([lp(Ee, end, 0.2 + i * 0.3, -we * 0.4), lp(Ee, end, 0.25 + i * 0.3, 0), lp(Ee, end, 0.2 + i * 0.3, we * 0.35)], Math.max(2, ws[1] * 0.05), '#12130f', { op: 0.35 }); }); }, [['upperarm' + sfx, cU], ['forearm' + sfx, cF]]);
      f.bone('forearm' + sfx);
      // the cloth bunched into the crook of the elbow
      const de = E.norm(add(E.norm(sub(Ee, S)), E.norm(sub(W, Ee)))), ne = [-de[1], de[0]];
      for (let i = 0; i < 3; i++) f.stroke([add(Ee, add(mul(ne, ws[1] * (0.45 - i * 0.12)), mul(de, -ws[1] * 0.3 + i * 6))), add(Ee, add(mul(ne, ws[1] * 0.1), mul(de, i * 5))), add(Ee, add(mul(ne, -ws[1] * 0.2), mul(de, -ws[1] * 0.2 + i * 8)))], 2.4, '#12130f', { op: 0.5 });
    }
    f.bone('upperarm' + sfx);
    f.stroke([lp(S, Ee, 0.25, ws[0] * 0.35), lp(S, Ee, 0.55, ws[0] * 0.1), lp(S, Ee, 0.8, ws[0] * 0.3)], 2.6, '#12130f', { op: 0.45 });
  }
  return { cU, cF };
}
// A leg in hose or trousers, split over thigh/shin, with an optional binding below the knee and shin wraps; the foot as a
// turnshoe (B.boot 'shoe' style, low), a boot, a wooden patten (a raised sole on an iron ring), or bare.
// o.ws [hip, knee, ankle]; o.look; o.wraps colour; o.garter (twine at the knee); o.foot 'shoe'|'boot'|'patten'|'bare'|'none';
// o.fs foot size; o.shoe colour; o.clods: frozen earth caked on the shin and shoe.
function leg(f, FX, Hp, Kn, A, sfx, o = {}) {
  const ws = o.ws || [76, 54, 40], de = E.norm(add(E.norm(sub(Kn, Hp)), E.norm(sub(A, Kn)))), dd = [-de[1], de[0]];
  const kc = side(Kn, mul(E.norm(sub(Kn, Hp)), -1), ws[1] * 0.55), sc = side(Kn, E.norm(sub(A, Kn)), ws[1] * 0.55);
  split(f, () => {
    const lg = jointLimb(Hp, Kn, lerp(Kn, A, 0.95), ws, { point: 0.3, mus0: 0.1, mus1: o.calf ?? 0.2 }), d = f.part(lg, Object.assign({ maxShade: ws[1] * 0.35 }, o.look));
    { const bb = E.bbox(lg); X0.stains(f, d, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.mouldD, 0.035, 3, -1.9, 3 + Math.round(Kn[0]), 0.45); }
    if (o.dirt) { const bb = E.bbox(lg); X0.stains(f, d, [bb[0] - 10, Kn[1] + ws[1] * 0.3, bb[2] + 10, bb[3] + 10], '#0b0b08', 0.045, 3, -1.3 + o.dirt, 7 + Math.round(Hp[0]), 0.6); }
  }, [['thigh' + sfx, kc], ['shin' + sfx, sc]]);
  f.bone('thigh' + sfx);
  f.stroke([lp(Hp, Kn, 0.5, ws[0] * 0.28), lp(Hp, Kn, 0.7, ws[0] * 0.06), lp(Hp, Kn, 0.84, -ws[0] * 0.24)], 2.4, '#141410', { op: 0.6 });
  f.stroke([lp(Hp, Kn, 0.25, -ws[0] * 0.2), lp(Hp, Kn, 0.4, 0), lp(Hp, Kn, 0.46, ws[0] * 0.18)], 2, '#141410', { op: 0.5 });
  if (ws[0] > 80) { f.stroke([lp(Hp, Kn, 0.1, ws[0] * 0.3), lp(Hp, Kn, 0.3, ws[0] * 0.12), lp(Hp, Kn, 0.4, ws[0] * 0.3)], 2.6, '#141410', { op: 0.5 }); f.stroke([lp(Hp, Kn, 0.62, -ws[0] * 0.3), lp(Hp, Kn, 0.76, -ws[0] * 0.1), lp(Hp, Kn, 0.9, -ws[0] * 0.2)], 2.6, '#141410', { op: 0.5 }); f.line([lp(Hp, Kn, 0.1, ws[0] * 0.36), lp(Hp, Kn, 0.85, ws[1] * 0.4)], 2, '#d0d2c8', { op: 0.25 });
    const pc = lerp(Hp, Kn, 0.55), pa = ang(Hp, Kn), pt = [add(pc, rot([-ws[0] * 0.14, -ws[0] * 0.2], pa)), add(pc, rot([ws[0] * 0.16, -ws[0] * 0.22], pa)), add(pc, rot([ws[0] * 0.16, ws[0] * 0.12], pa)), add(pc, rot([-ws[0] * 0.12, ws[0] * 0.14], pa))].map(q => [...q, 1]);
    f.part(pt, Object.assign({}, o.look, { fill: mix(o.look.fill, P.linenD, 0.35), inkW: 1.1, cast: false, maxShade: 4 })); f.stitches(pt.slice(0, 3), P.linenL, 0.8); }
  f.bone('shin' + sfx);
  const a = lerp(Kn, A, 0.1), b = lerp(Kn, A, 0.96);
  if (o.wraps) {
    f.part(K.chain([a, lerp(a, b, 0.45), b], [ws[1] * 0.98, ws[1] * 0.92, ws[2] * 1.02]), { fill: o.wraps, shadow: P.linenD, tex: 'weave' + f.o.seed, texOp: 0.6, inkW: 1.3, cast: false, maxShade: 12 });
    X0.wraps(f, a, b, ws[1] * 0.98, ws[2] * 1.02, o.turns || 6, o.wraps, { stain: 0.5 });
  }
  if (o.garter) { for (const t of [0.12, 0.16]) f.line([lp(Kn, A, t, -ws[1] * 0.52), lp(Kn, A, t + 0.02, 0), lp(Kn, A, t, ws[1] * 0.52)], 2.6, o.garter); f.line([lp(Kn, A, 0.14, ws[1] * 0.48), lp(Kn, A, 0.22, ws[1] * 0.62)], 1.6, o.garter); f.line([lp(Kn, A, 0.14, ws[1] * 0.48), lp(Kn, A, 0.2, ws[1] * 0.7)], 1.4, o.garter); }
  if (o.torn) { // the hose torn open over the shin: grey skin through a ragged hole
    const c = lerp(Kn, A, o.torn), hl = ell(c, ws[1] * 0.32, ws[1] * 0.5, ang(Kn, A), 10).map(q => add(q, [R(f, -3, 3), R(f, -3, 3)]));
    f.part(hl, X0.SK(f, { inkW: 1.2, cast: false, maxShade: 6 })); X0.livid(f, c, 8, 12, 2); f.line(hl.concat([hl[0]]), 2.2, '#121210', { op: 0.6 });
  }
  const fs = o.fs || ws[2] * 1.3, foot = o.foot || 'shoe', col = o.shoe || P.leather, da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  if (foot !== 'none') {
    split(f, () => {
      if (foot === 'bare') B.bareFoot(f, A, 1, fs, P.skin, { shadow: P.skinS, tex: 'mottle' + f.o.seed });
      else if (foot === 'patten') {
        const gy = f.o.groundY, lift = fs * 0.22;
        B.boot(f, A, 1, fs, col, { shaft: 0.3, tex: 'mottle' + f.o.seed, toe: 1.25, style: 'shoe', groundY: gy - lift });
        f.part([[A[0] - fs * 0.5, gy - lift], [A[0] + fs * 1.36, gy - lift], [A[0] + fs * 1.3, gy - lift + fs * 0.1], [A[0] - fs * 0.46, gy - lift + fs * 0.1]].map(q => [...q, 1]), { fill: P.wood, shadow: P.woodD, shade: 0.35, tex: 'grain' + f.o.seed, texOp: 0.7, inkW: 1.2, cast: false });
        for (const x of [A[0] - fs * 0.25, A[0] + fs * 0.95]) f.part([[x - fs * 0.08, gy - lift + fs * 0.1], [x + fs * 0.08, gy - lift + fs * 0.1], [x + fs * 0.06, gy], [x - fs * 0.06, gy]].map(q => [...q, 1]), { fill: P.woodD, shade: 0.3, inkW: 1, cast: false });
        f.line([[A[0] + fs * 0.1, gy - lift - fs * 0.05], [A[0] + fs * 0.4, gy - lift - fs * 0.3]], 2.2, P.leatherD);
      } else B.boot(f, A, 1, fs, col, { shaft: foot === 'boot' ? 0.75 : 0.32, tex: 'mottle' + f.o.seed, toe: o.toe ?? 1.15, style: 'boot', groundY: o.gy });
    }, [['shin' + sfx, side(A, mul(da, -1), ws[2] * 0.6)], ['foot' + sfx, side(A, da, ws[2] * 0.6)]]);
    f.bone('foot' + sfx);
    if (o.clods) for (let i = 0; i < o.clods; i++) { const q = add(A, [R(f, -fs * 0.3, fs * 1.0), R(f, -fs * 0.3, Math.min(fs * 0.5, ((o.gy ?? f.o.groundY) - A[1]) * 0.7))]), rr = R(f, 3, 7) * fs / 50; f.part(ell(q, rr * 1.6, rr * 0.8, R(f, -0.4, 0.4), 7).map(p => add(p, [R(f, -1.5, 1.5), R(f, -1.5, 1.5)])), { fill: mix(P.earth, P.stoneD, 0.5), shadow: '#121310', shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false, k: 0.6, tex: 'mottle' + f.o.seed, texOp: 0.6 }); f.flat(ell(add(q, [rr * 0.1, -rr * 0.35]), rr * 0.7, rr * 0.22, 0, 5), P.frostS, { op: 0.55 }); }
    FX.frost(add(A, [fs * 0.3, fs * 0.6]), fs * 0.7, fs * 0.14, 8);
  }
  return { kc, sc };
}
// a fist through B.grip with knuckles, creases and nails
function grip(f, c, elbow, thumbAng, s, col, name, o = {}) {
  const g = B.grip(f, c, elbow, thumbAng, s, col, Object.assign({ shadow: P.skinS, tex: 'mottle' + f.o.seed, texOp: 0.55, name }, o));
  fistDetail(f, g, s, col, { nail: o.nail || '#4a4844', tips: o.tips });
  return g;
}
// a frost-filmed eye under a heavy lid frozen half-shut (the Barrow King's habit): hF head frame, (cx, cy) eye centre in
// head units, w/h half-sizes, lid: how far the lid comes down (0 = to the middle), skin look for the lid.
function frostEye(f, hF, cx, cy, w, h, lid, lidLook) {
  const E2 = pts => hF(pts.map(([u, v]) => [cx + u * w, cy + v * h]));
  f.flat(E2([[-1, 0.1], [0, -0.5], [1, 0.05], [0.4, 0.6], [-0.5, 0.55]]), '#141311', { op: 0.85 });
  f.flat(E2([[-0.86, 0.12], [-0.1, -0.18], [0.84, 0.06], [0.3, 0.42], [-0.4, 0.38]]), '#8b8f86');
  f.flat(E2([[-0.2, 0.0], [0.24, -0.04], [0.26, 0.3], [-0.16, 0.32]]), '#5c6059', { op: 0.75 });
  f.part(E2([[-1.1, -0.5], [-0.2, -1.0], [0.9, -0.62], [1.05, 0.06], [0.3, lid], [-0.5, lid - 0.04], [-1.0, 0.14]]), Object.assign({}, lidLook, { maxShade: 4, cast: false, inkW: 0.9, inkHeavy: 1.1, texOp: 0.5 }));
  f.line(E2([[-0.98, 0.12], [-0.5, lid - 0.04], [0.3, lid], [1.0, 0.06]]), 2.2, '#141210');
  f.line(E2([[-0.8, -0.56], [0.0, -0.82], [0.8, -0.5]]), 1.3, '#24221d', { op: 0.7 });
  f.line(E2([[-0.7, 0.5], [0.0, 0.62], [0.7, 0.4]]), 1.2, '#24221d', { op: 0.6 });
  f.flat(E2([[-0.8, 0.6], [0.0, 0.8], [0.8, 0.5], [0.4, 1.1], [-0.4, 1.1]]), '#1e1c18', { op: 0.3 });
  f.line(E2([[-0.9, 0.06], [-0.4, lid - 0.06], [0.3, lid - 0.04], [0.9, 0.02]]), 1.1, P.hoar, { op: 0.55 });
}
// a dead grey head: B.head (blind) with the barrow's face: frosted eyes, grey nose and ear, rime on the crown, frost in
// the stubble, the face modelled at faceShade 0.78. o: B.head params plus o.lid, o.skin, o.stubble, o.eyes (false: none).
function deadHead(f, FX, HC, H, hA, o = {}) {
  const skin = o.skin || P.skin, hF = frame(HC, hA, H);
  B.head(f, HC, H, hA, Object.assign({ skin, jaw: 1.1, chin: 0.02, nose: 1.0, hook: 0.2, mouth: 'set', blind: true, browDown: 0.06, faceShade: 0.78, faceHatch: false, jawShade: 0.55, gaunt: true, age: true }, o.head || {}));
  X0.greyFace(f, hF, skin, (o.head || {}).nose ?? 1.0, { noEar: (o.head || {}).noEar });
  const lidLook = X0.SK(f, { fill: skin });
  if (o.eyes !== false) { frostEye(f, hF, 0.115, -0.05, 0.056, 0.036, o.lid ?? 0.05, lidLook); frostEye(f, hF, 0.292, -0.058, 0.024, 0.034, (o.lid ?? 0.05) + 0.05, lidLook); }
  // the skull under the skin: temple hollow, cheek sunk under the cheekbone
  f.flat(hF([[-0.04, -0.33], [0.1, -0.32], [0.11, -0.2], [-0.02, -0.19]]), '#1a1814', { op: 0.25 });
  f.line(hF([[0.0, 0.05], [0.12, 0.03], [0.25, 0.085]]), Math.max(1.2, H * 0.012), P.skinL, { op: 0.5 });
  crease(f, hF([[0.27, 0.11], [0.235, 0.18], [0.205, 0.25], [0.19, 0.3]]), Math.max(1.4, H * 0.016), { col: '#1e1c18', lit: P.skinL });
  if (o.stubble) { for (let i = 0; i < 26; i++) { const q = hF([[R(f, -0.12, 0.3), R(f, 0.22, 0.5)]])[0]; f.line([q, add(q, [0.6, 1.8])], 1, f.r() > 0.4 ? o.stubble : P.hoar, { op: 0.7 }); } }
  X0.livid(f, hF([[0.05, 0.12]])[0], H * 0.1, H * 0.08, 3, H / 140);
  FX.frost(hF([[0.06, -0.3]])[0], H * 0.05, H * 0.02, 4, Math.max(0.8, H / 90));
  return hF;
}
// a small dark animal eye under a brow ridge (never a round staring disc): c centre, s size, a angle of the eye's long axis
function animalEye(f, c, s, a, o = {}) {
  const F = pts => pts.map(p => add(c, rot([p[0] * s, p[1] * s], a)));
  f.flat(F([[-0.95, -0.15], [-0.4, -0.7], [0.4, -0.72], [1.0, -0.2], [0.7, 0.45], [-0.5, 0.5]]), '#120c0c', { op: 0.55 });
  f.flat(F([[-0.55, 0.02], [-0.1, -0.3], [0.45, -0.24], [0.62, 0.04], [0.15, 0.24], [-0.35, 0.2]]), '#0c0a0a');
  if (o.film) f.flat(F([[-0.4, 0.0], [0.0, -0.18], [0.4, -0.12], [0.3, 0.12], [-0.2, 0.14]]), '#6a706a', { op: 0.6 });
  f.flat(ell(F([[0.12, -0.12]])[0], s * 0.08, s * 0.06, a, 6), '#c8ccc6', { op: 0.75 });
  f.stroke(F([[-0.9, -0.42], [-0.2, -0.82], [0.55, -0.74], [1.05, -0.42]]), Math.max(2, s * 0.34), '#141010', { op: 0.85 });
  if (o.frost) f.line(F([[-0.6, -0.58], [0.0, -0.8], [0.6, -0.66]]), 1, P.hoar, { op: 0.8 });
}

// ---- feathers and wings (copied from kit_VI, reviewed; recoloured by the caller's look) -----------------------------
function feather(f, root, a, L, W, look, o = {}) {
  const d = dir(a), n = [-d[1], d[0]], lead = o.lead ?? 0.35, bend = o.bend ?? 0, N = 16;
  const C = []; for (let i = 0; i <= N; i++) { const t = i / N; C.push(add(add(root, mul(d, L * t)), mul(n, bend * L * t * t))); }
  const tipR = o.round ? 0.22 : 0.32;
  const wt = t => W * Math.pow(Math.min(1, (t + 0.03) / 0.22), 0.7) * (t > 1 - tipR ? Math.sqrt(Math.max(0, 1 - ((t - 1 + tipR) / tipR) ** 2)) : 1) * (o.taper === false ? 1 : 1 - t * 0.3) + 0.5;
  const sst = (a, b, t) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); }, em = o.emarg || 0;
  const eL = t => 1 - em * 0.6 * sst(0.4, 0.56, t), eT = t => 1 - em * 0.32 * sst(0.5, 0.66, t);
  const Pp = [], Q = [];
  C.forEach((p, i) => { const t = i / N, a1 = C[Math.max(0, i - 1)], b1 = C[Math.min(N, i + 1)], dd = E.norm(sub(b1, a1)), nn = [-dd[1], dd[0]], w = wt(t); Pp.push(add(p, mul(nn, w * lead * eL(t)))); Q.push(add(p, mul(nn, -w * (1 - lead) * eT(t)))); });
  for (const t of (o.notch || [])) { const i = Math.max(2, Math.min(N - 2, Math.round(t * N))); Q[i] = lerp(Q[i], C[i], 0.55); }
  const tip = add(C[N], mul(E.norm(sub(C[N], C[N - 1])), W * 0.04));
  const out = [...Pp, o.round ? tip : [...tip, 1], ...Q.reverse()];
  f.part(out, Object.assign({ k: 0.9, inkW: 1.1, inkHeavy: 1.8, maxShade: Math.max(2.5, W * 0.12), hi: 0.02 }, look, { cast: !!o.cast, castOp: 0.5 }));
  f.line(C.slice(0, N - 1), Math.max(0.8, W * 0.04), mix(look.fill, '#fff', 0.3), { op: 0.45 });
  if (o.splits !== false) for (let k = 0; k < 2; k++) { const i = 5 + Math.floor(f.r() * 8), p = C[i], qq = Q[Q.length - 1 - i] || Q[0]; f.line([p, lerp(p, qq, 1.02)], 0.8, INK, { op: 0.6 }); }
  if (o.dark) clipDraw(f, out, () => f.flat([...Pp.slice(Math.round(N * (1 - o.dark))).map(q => add(q, mul(n, W))), add(tip, mul(d, W)), ...Q.slice(0, Math.round(N * o.dark) + 1).map(q => add(q, mul(n, -W)))], o.darkCol || '#1e221e', { op: o.darkOp ?? 0.3 }));
  if (o.bars) clipDraw(f, out, () => { for (let k = 1; k <= o.bars; k++) { const t = k / (o.bars + 1), p = C[Math.round(t * N)]; f.flat([add(p, add(mul(n, W), mul(d, -W * 0.12))), add(p, add(mul(n, W), mul(d, W * 0.1))), add(p, add(mul(n, -W), mul(d, W * 0.18))), add(p, add(mul(n, -W), mul(d, -W * 0.04)))], o.barCol || '#5a615c', { op: 0.55 }); } });
  if (o.lift) for (let k = 0; k < o.lift; k++) { const i = 3 + Math.floor(f.r() * (N - 5)), p = (f.r() > 0.5 ? Pp : [...Q].reverse())[i], aa = a + (f.r() - 0.5) * 1.6; f.line([p, add(p, rot([W * R(f, 0.3, 0.6), 0], aa))], 1, look.fill, { op: 0.9 }); f.line([p, add(p, rot([W * R(f, 0.3, 0.6), 0], aa))], 0.5, INK, { op: 0.5 }); }
  return { C, out, tip };
}
function plumeMass(f, pts, a, sz, look, o = {}) {
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const bb = E.bbox(pts), d = dir(a), n = [-d[1], d[0]], lt = mix(look.fill, '#fff', 0.3), dk = mix(look.shadow || look.fill, '#000', 0.25);
  clipDraw(f, pts, () => {
    const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, span = Math.max(bb[2] - bb[0], bb[3] - bb[1]) * 0.75;
    let row = 0;
    for (let v = -span; v < span; v += sz * 0.62, row++) for (let u = -span; u < span; u += sz * 0.9) {
      const q = add(add([cx, cy], mul(d, v + (f.r() - 0.5) * sz * 0.2)), mul(n, u + (row % 2) * sz * 0.45 + (f.r() - 0.5) * sz * 0.2)), w = sz * R(f, 0.38, 0.55), l = sz * R(f, 0.3, 0.45);
      const arc = [add(q, mul(n, -w)), add(add(q, mul(n, -w * 0.7)), mul(d, l * 0.8)), add(q, mul(d, l)), add(add(q, mul(n, w * 0.7)), mul(d, l * 0.8)), add(q, mul(n, w))];
      if (f.r() < (o.dark ?? 0.25)) f.flat([...arc, add(q, mul(d, -l * 0.6))], dk, { op: 0.35 });
      f.line(arc, o.w ?? 1.2, INK, { op: o.op ?? 0.55 });
      f.line(arc.slice(1, 4).map(p => add(p, mul(d, -2))), 0.9, lt, { op: 0.35 });
      if (f.r() < (o.shaft ?? 0.25)) f.line([add(q, mul(d, -l * 0.6)), add(q, mul(d, l * 0.9))], 0.8, lt, { op: 0.4 });
      if (o.bar && f.r() < o.bar) f.flat(ell(add(q, mul(d, l * 0.3)), w * 0.5, l * 0.18, a + Math.PI / 2, 6), o.barCol || '#4e5550', { op: 0.5 });
    }
  });
}
function featherHem(line, a, sz, f, jit = 0.4) {
  const d = dir(a), out = [];
  for (let i = 0; i < line.length - 1; i++) {
    const p0 = line[i], p1 = line[i + 1], L = E.len(sub(p1, p0)), k = Math.max(1, Math.round(L / sz));
    for (let j = 0; j < k; j++) { const t0 = j / k, t1 = (j + 1) / k, m = lerp(p0, p1, (t0 + t1) / 2), ext = sz * (0.55 + (f.r() - 0.5) * jit); out.push([...lerp(p0, p1, t0), 1], add(lerp(p0, p1, t0 + (t1 - t0) * 0.25), mul(d, ext * 0.75)), add(m, mul(d, ext)), add(lerp(p0, p1, t0 + (t1 - t0) * 0.75), mul(d, ext * 0.75))); }
  }
  out.push([...line[line.length - 1], 1]);
  return out;
}
// A wing (kit_VI): leading edge shoulder S -> elbow Ew -> wrist Wr -> tip T; trailing side tr; o.bones [b1,b2,b3]; o.look
// feather look; o.skin arm look; o.np/ns primaries/secondaries; o.bars barring on the flight feathers; o.drop (frozen
// half-open: the primaries hang); o.moult: indices of primaries missing; o.broken: index of a broken primary.
function wing(f, S, Ew, Wr, T, o = {}) {
  const tr = o.tr ?? 1, look = o.look, [b1, b2, b3] = o.bones;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return mul([-d[1], d[0]], tr); };
  const nF = nrm(Ew, Wr), nH = nrm(Wr, T), nU = nrm(S, Ew);
  const aF = Math.atan2(nF[1], nF[0]), aH = Math.atan2(nH[1], nH[0]), aT = ang(Wr, T);
  const Lp = o.Lp ?? E.len(sub(T, Wr)) * 1.6, Ls = o.Ls ?? Lp * 0.62, Wp = o.Wp ?? Lp * 0.13, Ws = o.Ws ?? Ls * 0.22;
  const sk = o.skin;
  const tone = i => mix(look.fill, i % 3 === 0 ? '#2a302c' : '#cfd4cc', 0.1 + (i % 3) * 0.04);
  f.bone(b3);
  const np = o.np ?? 9, moult = o.moult || [];
  for (let i = 0; i < np; i++) {
    if (moult.includes(i)) continue;
    const t = i / (np - 1), r0 = lerp(Wr, T, 0.05 + t * 0.95), a = aT + (aH - aT) * (1 - t) * (o.spreadP ?? 0.38) + (f.r() - 0.5) * 0.08, L = Lp * (0.78 + t * 0.3) * (o.pLen ? o.pLen(t) : 1) * R(f, 0.92, 1.06) * (o.broken === i ? 0.55 : 1);
    feather(f, r0, a, L, Wp * (1 - t * 0.15), Object.assign({}, look, { fill: mix(tone(i), f.r() > 0.5 ? '#fff' : '#000', f.r() * 0.08) }), { lead: 0.3, bend: tr * -0.03, round: o.broken !== i, notch: (o.notchP || []).includes(i) ? [0.62, 0.8] : [], dark: o.darkTips ?? 0, bars: o.bars, barCol: o.barCol, lift: o.lift && i % 3 === 1 ? 1 : 0, emarg: t > 0.4 ? 0.55 + t * 0.4 : 0 });
    if (o.broken === i) { const tp = add(r0, mul(dir(a), L)); f.line([tp, add(tp, rot([8, 6], a))], 1.4, INK, { op: 0.8 }); f.line([add(tp, rot([-4, -3], a)), add(tp, rot([6, -6], a))], 1.1, INK, { op: 0.7 }); }
  }
  f.bone(b2);
  const ns = o.ns ?? 12;
  for (let i = ns - 1; i >= 0; i--) {
    const t = i / (ns - 1), r0 = lerp(Ew, Wr, 0.04 + t * 0.94), a = aF + (o.rake ?? -0.35) * tr * (1 - t * 0.3) + (f.r() - 0.5) * 0.1, L = Ls * (o.sLen ? o.sLen(t) : (0.92 + 0.12 * Math.sin(t * 3))) * R(f, 0.9, 1.08);
    feather(f, r0, a, L, Ws, Object.assign({}, look, { fill: tone(i + 1) }), { lead: 0.4, bend: tr * 0.05, round: true, notch: (o.notchS || []).includes(i) ? [0.7] : [], dark: 0, bars: o.bars ? Math.max(1, o.bars - 1) : 0, barCol: o.barCol, lift: o.lift && i % 3 === 0 ? 1 : 0 });
  }
  f.bone(b1);
  const aU = n2 => Math.atan2(n2[1], n2[0]);
  for (let i = 0; i < (o.nt ?? 4); i++) { const t = i / 3, r0 = lerp(lerp(S, Ew, 0.55), Ew, t), a = aU(nU) + (o.rake ?? -0.35) * tr * 1.6; feather(f, r0, a, Ls * (0.8 - t * 0.15), Ws * 1.1, Object.assign({}, look, { fill: tone(i + 2) }), { lead: 0.45, round: true, dark: 0.2 }); }
  const arm2 = (a, b, wa, wb, bn, ext) => { f.bone(bn); f.part(K.chain([a, b], [wa, wb], { steps: 8, bp: [[0, 0.3, 0.18, 0.2]], bq: [[0, 0.6, 0.12, 0.2]] }), Object.assign({ k: 0.9 }, sk)); f.line([lp(a, b, 0.15, -wa * 0.2), lp(a, b, 0.85, -wb * 0.2)], 1.1, INK, { op: 0.4 }); f.line([lp(a, b, 0.1, wa * 0.3), lp(a, b, 0.5, wa * 0.36), lp(a, b, 0.9, wb * 0.3)], 1.3, mix(sk.fill, '#fff', 0.35), { op: 0.5 }); if (ext) ext(); };
  const wS = o.wS ?? Ws * 1.9, wE = o.wE ?? Ws * 1.2, wW = o.wW ?? Ws * 0.9;
  f.bone(b2);
  const soft = (x) => Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.2 }, x);
  const ng = Math.round(ns * 0.8);
  for (let i = ng - 1; i >= 0; i--) { const t = i / (ng - 1) + (f.r() - 0.5) * 0.04, r0 = add(lerp(Ew, Wr, 0.02 + t * 0.96), mul(nF, -wE * 0.1)), a = aF + (o.rake ?? -0.35) * tr * 0.6 + (f.r() - 0.5) * 0.15; feather(f, r0, a, Ls * 0.48 * (1 - t * 0.2) * R(f, 0.88, 1.08), Ws * 0.95, soft({ fill: mix(tone(i + 2), '#fff', 0.04) }), { lead: 0.45, round: true, splits: true, cast: !!o.cover }); }
  arm2(Ew, Wr, wE * 0.95, wW, b2);
  f.bone(b2);
  const cd = Ls * (o.covD ?? 0.3), ca = aF + (o.rake ?? -0.35) * tr * 0.6;
  const hemL = [add(Ew, mul(nF, cd * 0.85)), add(lerp(Ew, Wr, 0.5), mul(nF, cd)), add(Wr, mul(nF, cd * 0.7))];
  const cv = o.cover ? -0.62 : 0;
  const mass = [add(Ew, mul(nF, wE * (0.05 + cv))), add(lerp(Ew, Wr, 0.5), mul(nF, wE * (cv - 0.02))), add(lerp(Ew, Wr, 0.86), mul(nF, wW * (cv * 0.8 + 0.1))), add(Wr, mul(nF, cd * 0.5)), ...featherHem(hemL.slice().reverse(), ca, Ws * 0.7, f)];
  if (o.cover) f.flat(featherHem(hemL, ca, Ws * 0.7, f).map(q => add(q, mul(nF, 6))).concat([add(Wr, mul(nF, cd * 0.4)), add(Ew, mul(nF, cd * 0.6))]), '#0c100e', { op: 0.3 });
  plumeMass(f, mass, ca, Ws * 0.75, soft({ fill: mix(look.fill, '#fff', o.cover ? 0.12 : 0.06), tex: 'barb' + f.o.seed, texOp: 0.35 }), { w: 1, op: 0.5, bar: o.bars ? 0.5 : 0, barCol: o.barCol });
  if (o.cover) { const mg = [add(Ew, mul(nF, -wE * 0.6)), add(lerp(Ew, Wr, 0.5), mul(nF, -wE * 0.6)), add(lerp(Ew, Wr, 0.84), mul(nF, -wW * 0.45)), ...featherHem([add(lerp(Ew, Wr, 0.84), mul(nF, cd * 0.2)), add(lerp(Ew, Wr, 0.5), mul(nF, cd * 0.3)), add(Ew, mul(nF, cd * 0.32))], ca, Ws * 0.45, f)]; plumeMass(f, mg, ca, Ws * 0.45, soft({ fill: mix(look.fill, '#fff', 0.2), tex: 'barb' + f.o.seed, texOp: 0.35 }), { w: 0.9, op: 0.45, bar: o.bars ? 0.4 : 0, barCol: o.barCol }); }
  f.bone(b3);
  for (let i = 5; i >= 0; i--) { const t = i / 5, r0 = lerp(Wr, T, 0.05 + t * 0.6), a = aT + (aH - aT) * (1 - t) * 0.5; feather(f, r0, a, Lp * 0.34, Wp * 1.0, Object.assign({}, look, { fill: tone(i + 4), inkW: 0.8, inkHeavy: 1.1 }), { lead: 0.4, round: true, splits: false, cast: !!o.cover }); }
  arm2(S, Ew, wS, wE, b1, () => { const sa = aU(nU) + (o.rake ?? -0.35) * tr, sd = Ls * 0.42; const hm = [add(lerp(S, Ew, 0.1), mul(nU, sd * 0.8)), add(lerp(S, Ew, 0.95), mul(nU, sd * 0.6))]; plumeMass(f, [add(lerp(S, Ew, 0.05), mul(nU, -wS * (o.cover ? 0.62 : 0.3))), add(Ew, mul(nU, -wE * (o.cover ? 0.62 : 0.3))), add(Ew, mul(nU, sd * 0.4)), ...featherHem(hm.slice().reverse(), sa, Ws * 0.8, f)], sa, Ws * 0.8, Object.assign({}, look, { fill: mix(look.fill, '#fff', 0.05), inkW: 0.9, inkHeavy: 1.2 }), { w: 1, op: 0.5, bar: o.bars ? 0.4 : 0, barCol: o.barCol }); });
  return { nF, nH, aF, aH, aT };
}
// a bird's shank and taloned foot (kit_VI talonFoot), toes [[dirAngle, length, curlSign, 'back'?]]; o.swell: the toes
// swollen into sore-crusted pads (the King's Hawk's bumblefoot)
function talonFoot(f, K0, A, toes, s, o = {}) {
  const look = o.look;
  const toe = ([a, L, cs], i) => {
    const d1 = dir(a), p0 = A, p1 = add(p0, mul(d1, L * 0.45)), p2 = add(p1, rot(mul(d1, L * 0.35), cs * 0.35)), p3 = add(p2, rot(mul(d1, L * 0.25), cs * 0.75)), sw = o.swell ?? 0;
    f.part(K.chain([p0, p1, p2, p3], [s * (1.25 + sw), s * (1 + sw * 1.2), s * (0.88 + sw), s * 0.72], { steps: 5, bp: [[1, 0.5, sw * 0.4, 0.25]], bq: [[0, 0.6, sw * 0.5, 0.25]] }), Object.assign({ k: 0.9, cast: false, inkW: 1.2, inkHeavy: 2 }, look));
    for (const q of [p1, p2]) { const d = E.norm(sub(p3, p0)), nn = [-d[1], d[0]]; f.line([add(q, mul(nn, s * 0.5)), add(q, mul(nn, -s * 0.5))], 1.1, INK, { op: 0.55 }); }
    if (sw) { X0.pustules(f, lerp(p0, p1, 0.6), s * 0.5, s * 0.4, 2, s * 0.18, s * 0.28); }
    const dd = E.norm(sub(p3, p2)), cn = mul([-dd[1], dd[0]], cs), cb = add(p3, mul(dd, -s * 0.15));
    f.part([add(cb, mul(cn, -s * 0.42)), add(add(cb, mul(dd, s * 1.0)), mul(cn, -s * 0.2)), [...add(add(cb, mul(dd, s * 1.5)), mul(cn, s * 0.8)), 1], add(add(cb, mul(dd, s * 0.7)), mul(cn, s * 0.2)), add(cb, mul(cn, s * 0.42))], { fill: '#24221e', shadow: '#0a0a08', light: '#7a7a72', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false });
  };
  const tl = toes.map((_, i) => i);
  tl.filter(i => toes[i][3] === 'back').forEach(i => toe(toes[i], i));
  f.part(K.chain([K0, A], [s * 1.9, s * 1.45], { steps: 6 }), Object.assign({ k: 0.9, cast: false }, look));
  const d = E.norm(sub(A, K0)), nn = [-d[1], d[0]];
  for (let i = 1; i < 7; i++) { const q = lerp(K0, A, i / 7); f.line([add(q, mul(nn, s * 0.8)), add(add(q, mul(nn, s * 0.2)), mul(d, s * 0.25)), add(q, mul(nn, -s * 0.4))], 1, INK, { op: 0.5 }); }
  tl.filter(i => toes[i][3] !== 'back').forEach(i => toe(toes[i], i));
}

// ---- arthropod leg (world_IV Pit Crawler habit): P2 = [hip, coxa end, knee, ankle, claw tip], ws base width -------------
function insectLeg(f, P2, ws, look, o = {}) {
  const [c0, c1, k, an, tip] = P2, legL = o.lit || mix(look.fill, '#ffffff', 0.35), jt = o.joint || mix(look.fill, '#d0d0c4', 0.45);
  const lseg = (a, b, wa, wb, last) => {
    f.part(limb(a, b, wa, wb, { steps: 8, capK: 0.5, p: [[0.4, 0.16, 0.25]] }), look);
    f.line([lp(a, b, 0.12, wa * 0.22), lp(a, b, 0.8, wb * 0.24)], Math.max(1, wb * 0.16), legL, { op: 0.7 });
    if (!last) f.part(limb(lp(a, b, 0.97, 0), add(b, mul(E.norm(sub(b, a)), wb * 0.3)), wb * 0.95, wb * 0.85, { steps: 2, capK: 0.3 }), { fill: jt, shade: 0.4, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false, gritOp: 0.2 });
  };
  f.part(ell(c0, ws * 0.72, ws * 0.55, ang(c0, c1), 10), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.2) }));
  lseg(c0, c1, ws * 1.05, ws * 0.92); lseg(c1, k, ws * 0.92, ws * 0.72); lseg(k, an, ws * 0.66, ws * 0.44, false);
  // the tibia's spines along its inner edge (burying beetles dig with them)
  const dT = E.norm(sub(an, k)), nT = [-dT[1], dT[0]];
  for (let i = 1; i < 4; i++) { const q = lp(k, an, i / 4, -ws * 0.3 * (o.sp ?? 1)); f.line([q, add(q, add(mul(nT, -ws * 0.28 * (o.sp ?? 1)), mul(dT, ws * 0.1)))], Math.max(0.8, ws * 0.07), INK, { op: 0.8 }); }
  const d = E.norm(sub(tip, an)), nn = [-d[1], d[0]];
  const ts = [an, lerp(an, tip, 0.35), lerp(an, tip, 0.65), tip];
  for (let i = 0; i < 3; i++) f.part(limb(ts[i], ts[i + 1], ws * (0.36 - i * 0.06), ws * (0.3 - i * 0.06), { steps: 3, capK: 0.6 }), Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.1 }));
  f.part([add(tip, mul(nn, ws * 0.12)), add(add(tip, mul(d, ws * 0.32)), mul(nn, ws * 0.02)), [...add(add(tip, mul(d, ws * 0.42)), mul(nn, -ws * 0.12)), 1], add(tip, mul(nn, -ws * 0.1))], { fill: '#0c0a08', shade: 0.3, inkW: 0.8, cast: false, hatch: false });
  if (o.planted) f.flat(ell(add(tip, [0, 2]), ws * 0.5, 2, 0, 8), '#0e0b08', { op: 0.55 });
}

// ---- a rat. c: body centre, a: heading (body toward the head), s: nose-to-rump length (px). Each call draws its own
// build from f.r(): girth, hump, head length and angle, ear size, snout, fur tone, mange, so no two are alike.
// o.state 'live' (sores, buboes, fur rotting off), 'dead' (frozen stiff, rimed, eyes shut, mould fur, fruiting bodies when
// o.old), 'bones' (picked to a skeleton). o.mouth: open with the incisors bared. o.legs 'claw' (forelegs reaching down
// and forward to the ground), 'hang', 'tuck', 'splay'. o.fleas: dark dust in the fur. Returns { root (tail root),
// head (snout tip), F (local frame) }.
function rat(f, FX, c, a, s, o = {}) {
  const sg = o.sg ?? (Math.cos(a) < 0 ? -1 : 1), F0 = frame(c, a, s), F = pts => F0(pts.map(p => p.length > 2 ? [p[0], p[1] * sg, p[2]] : [p[0], p[1] * sg]));
  const st = o.state || 'live', G = o.G ?? R(f, 0.15, 0.22), hump = R(f, 0.85, 1.15), hl = R(f, 0.34, 0.44), hw = G / 0.18 * R(f, 0.82, 0.98);
  const tone = o.tone ?? R(f, 0, 1), fur = mix(mix('#3e3d37', '#85837a', tone), P.frost, st === 'dead' ? 0.22 : 0);
  const furD = mix(fur, '#1a1a16', 0.55), furL = mix(fur, '#d8d8cc', 0.35);
  const LOOK = (x = {}) => Object.assign({ fill: fur, shadow: mix(fur, '#141412', 0.7), shade: 0.4, tex: 'fur' + f.o.seed, texOp: 0.8, inkW: o.inkW ?? 1.2, inkHeavy: o.inkH ?? 1.9, maxShade: s * 0.07, cast: o.cast ?? false, castOp: 0.3 }, x);
  const skinR = mix(P.skin, P.bruise, 0.3);
  if (st === 'bones') return ratBones(f, F, s, G, o);
  const neck = [0.2, -0.15 * G], ha = (o.ha ?? R(f, -0.5, 0.5)), HF0 = pts => F(pts.map(([u, v, k]) => { const q = add(neck, rot([u * hl / 0.4, v * hw], ha)); return k ? [...q, 1] : q; }));
  const legs = o.legs || 'tuck';
  // far legs first
  const footAt = (hip, len, la, far) => {
    const k1 = add(hip, rot([len * 0.5, 0], la)), ft = add(k1, rot([len * 0.5, 0], la + (legs === 'claw' ? -0.5 : 0.6)));
    f.part(F(limb(hip, k1, 0.07, 0.04, { steps: 4, capK: 0.6 })), LOOK({ fill: far ? furD : fur, inkW: 0.8, inkHeavy: 1, maxShade: 2 }));
    f.part(F(limb(k1, ft, 0.032, 0.026, { steps: 3, capK: 0.6 })), { fill: far ? mix(skinR, '#000', 0.3) : mix(skinR, '#fff', 0.1), shadow: P.bruiseD, shade: 0.4, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
    const dd = rot([1, 0], la + (legs === 'claw' ? -0.5 : 0.6));
    for (let i = -1; i <= 1; i++) { const q = add(ft, rot(mul(dd, 0.05), i * 0.45)); f.line(F([ft, q, add(q, rot(mul(dd, 0.025), i * 0.45 + 0.8))]), Math.max(0.8, s * 0.012), P.bone, { op: 0.9 }); }
    return F([ft])[0];
  };
  const legSet = far => {
    const L = s * 0.32, fl = legs === 'claw' ? 1.6 : legs === 'hang' ? 1.4 : legs === 'splay' ? 0.9 : 2.2, hl2 = legs === 'claw' ? 1.2 : legs === 'hang' ? 1.5 : 2.4;
    footAt([0.14 + (far ? 0.04 : 0), 0.45 * G], L / s, fl + (far ? 0.25 : 0), far);
    footAt([-0.28 + (far ? 0.05 : 0), 0.55 * G], L * 1.15 / s, hl2 + (far ? -0.2 : 0), far);
  };
  if (!o.lite) legSet(true);
  // body: rump heavy, the back humped over the hips, narrowing to the shoulders and neck
  const body = [[-0.53, 0.1 * G], [-0.5, -0.55 * G * hump], [-0.38, -0.98 * G * hump], [-0.18, -1.02 * G * hump], [0.0, -0.8 * G], [0.13, -0.56 * G], [0.24, -0.42 * G], [0.29, 0.0], [0.24, 0.36 * G], [0.1, 0.68 * G], [-0.12, 0.96 * G], [-0.36, 0.92 * G], [-0.5, 0.62 * G]];
  const bD = f.part(F(body), LOOK(o.lite ? { inkHeavy: 1.4, tex: 'fur' + f.o.seed, texOp: 0.6 } : {}));
  if (!o.lite) clipDraw(f, bD, () => {
    f.flat(F([[-0.4, 0.5 * G], [0.2, 0.3 * G], [0.2, 0.9 * G], [-0.4, 0.9 * G]]), furL, { op: 0.25 }); // the paler belly
    for (let i = 0; i < 5; i++) { const u = -0.42 + i * 0.13; f.line(F([[u, -0.7 * G], [u + 0.05, -0.2 * G], [u + 0.04, 0.3 * G]]), 1, furD, { op: 0.5 }); } // fur lying back in combed tracts
    if (st !== 'dead' && f.r() < 0.7) { const mg = F(ell([R(f, -0.3, 0.05), R(f, -0.2, 0.3) * G], 0.09, 0.4 * G, R(f, 0, 3), 9).map(q => add(q, [R(f, -0.02, 0.02), R(f, -0.02, 0.02)]))); f.part(mg, X0.SK(f, { fill: skinR, inkW: 0, inkHeavy: 0, cast: false, maxShade: 2 })); f.line(mg.concat([mg[0]]), 1, furD, { op: 0.7 }); } // fur rotted off in a patch
    if (st === 'dead') { X0.mould(f, F([[R(f, -0.35, 0.0), R(f, -0.3, 0.2) * G]])[0], s * R(f, 0.08, 0.14), s * 0.06, { rings: 1, ink: 0 }); }
  });
  // the shaggy back: hanks of fur standing off the outline so it never reads as a smooth bean
  if (o.lite) { f.line(F([[-0.42, -0.85 * G * hump], [-0.2, -1.0 * G * hump], [0.05, -0.75 * G]]), Math.max(1, s * 0.018), furL, { op: 0.55 }); f.line(F([[-0.3, 0.2 * G], [0.0, 0.5 * G]]), 1, furD, { op: 0.5 }); }
  else for (let i = 0; i < 3; i++) { const u = -0.44 + i * 0.16 + R(f, -0.03, 0.03), q = F([[u, -0.9 * G * hump]])[0], d2 = F([[u - 0.12, -1.25 * G * hump]])[0]; hairClump(f, [q, lerp(q, d2, 0.5), d2], s * 0.05, { pal: [furD, fur, furL], gap: false, n: 2 }); }
  // head: a long wedge to a blunt snout, the ear round and thin
  const head = HF0([[-0.06, -0.11], [0.06, -0.125], [0.18, -0.095], [0.3, -0.052], [0.38, -0.018], [0.42, 0.012], [0.39, 0.042], [0.27, 0.068], [0.12, 0.092], [-0.05, 0.1]]);
  const earC = HF0([[0.05, -0.13]])[0];
  const er = R(f, 0.07, 0.09) * s * hw;
  f.part(head, LOOK({ maxShade: s * 0.03 }));
  f.flat(HF0([[0.3, -0.04], [0.42, 0.0], [0.4, 0.05], [0.3, 0.06]]), mix(skinR, '#000', 0.1), { op: 0.55 }); // the bare snout
  f.part(ell(earC, er, er * 1.15, a + ha, 10), { fill: mix(mix(skinR, '#e6dcd4', 0.45), fur, 0.1), shadow: mix(P.bruise, '#000', 0.2), light: '#efe6de', shade: 0.3, inkW: 0.9, inkHeavy: 1, cast: false, hatch: false });
  f.flat(ell(add(earC, rot([er * 0.15, er * 0.1 * sg], a)), er * 0.42, er * 0.6, a + ha, 8), '#3a3234', { op: 0.5 });
  if (o.tornEar) f.flat([add(earC, rot([er, -er * 0.4 * sg], a)), add(earC, rot([er * 0.3, -er * 0.2 * sg], a)), add(earC, rot([er * 0.8, er * 0.3 * sg], a))], '#0c0c0a');
  f.part(HF0([[0.4, -0.015], [0.435, 0.01], [0.43, 0.035], [0.405, 0.04]]), { fill: '#2a2626', shade: 0.3, inkW: 0.8, cast: false, hatch: false }); // the nose
  const eye = HF0([[0.19, -0.05]])[0];
  if (st === 'dead') { f.line([add(eye, rot([-s * 0.022, 0], a + ha)), add(eye, rot([s * 0.022, s * 0.004 * sg], a + ha))], Math.max(1, s * 0.012), '#101010'); f.flat(ell(eye, s * 0.02, s * 0.012, a + ha, 6), P.hoar, { op: 0.5 }); }
  else { f.flat(ell(eye, s * 0.02, s * 0.016, a + ha, 8), '#0c0a0a'); f.flat(ell(add(eye, rot([s * 0.006, -s * 0.006 * sg], a)), s * 0.006, s * 0.005, 0, 5), '#b8bcb4', { op: 0.7 }); }
  f.line(HF0([[0.12, -0.1], [0.22, -0.08], [0.3, -0.05]]), Math.max(0.8, s * 0.01), furD, { op: 0.6 }); // the brow over it
  if (o.mouth) { // the mouth open, the long yellow-bone incisors bared
    f.flat(HF0([[0.22, 0.06], [0.38, 0.045], [0.4, 0.1], [0.3, 0.13]]), '#0e0c0c');
    f.part(HF0([[0.36, 0.035], [0.39, 0.035], [0.385, 0.1], [0.37, 0.11]]), { fill: P.bone, shadow: P.boneS, shade: 0.3, inkW: 0.8, cast: false, hatch: false });
    f.part(HF0([[0.33, 0.13], [0.355, 0.125], [0.37, 0.07], [0.35, 0.065]]), { fill: mix(P.bone, P.mouldY, 0.3), shadow: P.boneS, shade: 0.3, inkW: 0.8, cast: false, hatch: false });
  } else f.line(HF0([[0.24, 0.07], [0.32, 0.065], [0.38, 0.05]]), Math.max(0.8, s * 0.01), '#141212', { op: 0.8 });
  if (!o.lite) for (let i = 0; i < 3; i++) { const q = HF0([[0.38, 0.03]])[0]; f.line([q, add(q, rot([s * R(f, 0.12, 0.2), 0], a + ha + (i - 1) * 0.25 * sg + 0.1 * sg))], 0.7, i === 1 ? P.hoar : furL, { op: 0.6 }); } // whiskers
  // the course marks on this rat
  if (o.lite) { if (st === 'dead') { f.line(F([[-0.46, -0.62 * G * hump], [-0.3, -1.0 * G * hump], [-0.08, -0.96 * G * hump]]), Math.max(1.2, s * 0.025), P.hoar, { op: 0.65 }); if (f.r() < 0.4) X0.mould(f, F([[-0.2, -0.2 * G]])[0], s * 0.08, s * 0.05, { rings: 0, ink: 0 }); } else if (f.r() < 0.25) X0.sore(f, F([[R(f, -0.3, 0.1), 0.1 * G]])[0], s * 0.03, { ang: a, crust: false }); }
  else if (st === 'live') {
    if (o.bubo || f.r() < 0.35) X0.bubo(f, F([[R(f, 0.0, 0.18), 0.6 * G]])[0], s * R(f, 0.07, 0.1), { sag: 0.5, cast: false }); // a bubo the size of an egg
    if (f.r() < 0.6) X0.sore(f, F([[R(f, -0.3, 0.1), R(f, -0.4, 0.3) * G]])[0], s * 0.03, { ang: a });
  } else {
    if (s > 110) FX.rime(F([[-0.46, -0.6 * G * hump], [-0.3, -1.0 * G * hump], [-0.08, -0.95 * G * hump], [0.1, -0.7 * G]]), Math.max(3, s * 0.04), sg > 0 ? 1 : -1); else { FX.frost(F([[-0.2, -0.7 * G]])[0], s * 0.18, s * 0.05, 4, Math.max(0.8, s / 90)); f.line(F([[-0.46, -0.62 * G * hump], [-0.3, -1.0 * G * hump], [-0.08, -0.96 * G * hump]]), Math.max(1, s * 0.02), P.hoar, { op: 0.6 }); }
    if (o.old) X0.graveCaps(f, F([[-0.2, -0.9 * G]])[0], a - Math.PI / 2 * sg, s * 0.22, 2);
    X0.fungalFur(f, F([[-0.45, 0.5 * G], [-0.1, 0.85 * G], [0.15, 0.6 * G]]), s * 0.05, sg > 0 ? 1 : -1, { gaps: 0.5 });
  }
  if (o.lite) { const ft = F([[0.16, 0.85 * G]])[0], ft2 = F([[-0.3, 0.95 * G]])[0]; f.flat(ell(ft, s * 0.035, s * 0.02, a, 6), mix(skinR, '#fff', 0.1), { op: 0.9 }); f.flat(ell(ft2, s * 0.04, s * 0.022, a, 6), mix(skinR, '#000', 0.1), { op: 0.9 }); return { root: F([[-0.5, 0.12 * G]])[0], head: HF0([[0.42, 0.02]])[0], F, G }; }
  if (o.fleas) for (let i = 0; i < o.fleas; i++) { const q = F([[R(f, -0.4, 0.3), R(f, -0.7, 0.5) * G]])[0]; f.flat(ell(q, 1.1, 0.8, R(f, 0, 3), 5), '#0a0a08', { op: 0.85 }); }
  legSet(false);
  return { root: F([[-0.5, 0.12 * G]])[0], head: HF0([[0.42, 0.02]])[0], F, G };
}

// ---- a big modelled rat for the Rat King (s 200-400 px, rump to snout tip). Rebuilt on independent review: a real, filthy
// brown-grey rat, not a tube. The spine is hunched and peaks over the haunch; the body is widest at the haunch and narrows
// through the shoulders into a long head that tapers to a pointed snout. Small dark bead eyes under a brow. Ears are thin
// cupped leaves in dull grey-pink, darker in the bowl. Fur is directional ink hatching lying back along the body and
// sweeping down the flanks, wet clumps drawn to points along the back and hanging from the belly, mange patches of grey
// scabbed skin. Pink (desaturated) only at the nose, the feet and the ears. Plantigrade hind feet, small clawed hands.
// Pose: 'strain' (thrust outward, forelegs reaching), 'claw' (forelegs clawing down and forward), 'bite' (head turned hard
// aside, jaws open on a neighbour), 'limp' (dead: head hanging, legs slack, eyes shut, rimed and mould-furred).
// Returns { root (tail root), head, F }.
const PINK = '#877875', PINKD = '#4a3e3e', PINKL = '#ab9d98';
function pip(poly, q) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
const qd = (S, w) => S.map(([p0, p1, p2]) => `M${E.f1(p0[0])},${E.f1(p0[1])}Q${E.f1(p1[0])},${E.f1(p1[1])} ${E.f1(p2[0])},${E.f1(p2[1])}`).join('');
// directional hatching inside a local polygon: n strokes, dirAt(q) gives the stroke angle (local), lens [min,max]
function furHatch(f, M, poly, n, dirAt, lens, o = {}) {
  const bb = E.bbox(poly), dk = [], lt = [], dd = [];
  for (let i = 0; i < n; i++) {
    const q = [R(f, bb[0], bb[2]), R(f, bb[1], bb[3])]; if (!pip(poly, q)) continue;
    const a0 = dirAt(q) + R(f, -0.18, 0.18), L = R(f, lens[0], lens[1]), p1 = add(q, rot([L * 0.5, L * 0.08], a0)), p2 = add(q, rot([L, 0], a0 + R(f, -0.2, 0.2)));
    const k = o.lightAt ? o.lightAt(q) : 0, r = f.r();
    (r < k * 0.6 ? lt : r > 1 - (o.deep ? o.deep(q) : 0) ? dd : dk).push(M([q, p1, p2]));
  }
  const w = o.w || 1;
  if (dk.length) f.raw(`<path d="${qd(dk)}" fill="none" stroke="#12120f" stroke-width="${E.f1(w)}" stroke-linecap="round" opacity="0.5"/>`);
  if (dd.length) f.raw(`<path d="${qd(dd)}" fill="none" stroke="#080807" stroke-width="${E.f1(w * 1.5)}" stroke-linecap="round" opacity="0.6"/>`);
  if (lt.length) f.raw(`<path d="${qd(lt)}" fill="none" stroke="${o.lit || '#d4d4c8'}" stroke-width="${E.f1(w * 0.85)}" stroke-linecap="round" opacity="0.42"/>`);
}
// a wet clump of fur drawn to a point: base on b (local), lying along angle aa, length L, base width W
function wetTuft(f, M, b, aa, L, W, col, o = {}) {
  const d = rot([1, 0], aa), n = [-d[1], d[0]], bend = (o.bend ?? R(f, -0.25, 0.25)) * L;
  const pts = [add(b, mul(n, W / 2)), add(add(b, mul(d, L * 0.45)), mul(n, W * 0.32 + bend * 0.3)), [...add(add(b, mul(d, L)), mul(n, bend)), 1], add(add(b, mul(d, L * 0.5)), mul(n, -W * 0.22 + bend * 0.35)), add(b, mul(n, -W / 2))];
  f.flat(M(pts), col);
  f.line(M([pts[0], pts[1], pts[2]]), o.inkW || 1, '#0c0c0a', { op: 0.75 });
  f.line(M([pts[2], pts[3], pts[4]]), (o.inkW || 1) * 0.8, '#0c0c0a', { op: 0.5 });
  f.line(M([add(b, mul(d, L * 0.15)), add(add(b, mul(d, L * 0.55)), mul(n, W * 0.1 + bend * 0.3))]), Math.max(0.7, (o.inkW || 1) * 0.7), o.sheen || '#c6cac0', { op: 0.5 });
}
// a clump of fur as converging brush strokes (no outline): base b (local), angle aa, length L, base width W
function furClump(f, M, b, aa, L, W, cols, o = {}) {
  const d = rot([1, 0], aa), n = [-d[1], d[0]], tip = add(add(b, mul(d, L)), mul(n, (o.bend ?? R(f, -0.2, 0.2)) * L)), k = o.n || 4;
  for (let i = 0; i < k; i++) { const b0 = add(b, mul(n, (i / (k - 1) - 0.5) * W)), m = add(lerp(b0, tip, 0.55), mul(n, (i / (k - 1) - 0.5) * W * 0.25)); f.stroke(M([b0, m, add(tip, mul(n, R(f, -0.15, 0.15) * W))]), o.w || W * 0.55, cols[i % cols.length], { op: o.op ?? 0.9 }); }
  if (o.sheen) f.line(M([lerp(b, tip, 0.15), lerp(b, tip, 0.7)]), Math.max(0.7, (o.w || 1) * 0.25), o.sheen, { op: 0.45 });
}
// collects small strokes and fills by style and writes each style as one path (same call signatures as f.line/flat/stroke)
function batcher(f) {
  const Ls = new Map(), Fs = new Map(), put = (m, k, d) => { if (!m.has(k)) m.set(k, []); m.get(k).push(d); };
  const B2 = {
    r: () => f.r(),
    line(pts, w = 1.4, col, o = {}) { put(Ls, `${col || INK}|${E.f1(w)}|${o.op ?? 1}`, E.smooth(pts, false, o.k ?? 1)); },
    flat(pts, col, o = {}) { put(Fs, `${col}|${o.op ?? 1}`, typeof pts === 'string' ? pts : E.smooth(pts, true, o.k ?? 1)); },
    stroke(pts, w = 3, col, o = {}) { const n = pts.length, Lp = [], R2 = []; for (let i = 0; i < n; i++) { const pa = pts[Math.max(0, i - 1)], pb = pts[Math.min(n - 1, i + 1)], d = E.norm(sub(pb, pa)), nn = [-d[1], d[0]], t = i / (n - 1), ww = w * Math.sin(Math.PI * (0.08 + 0.84 * t)) / 2; Lp.push(add(pts[i], mul(nn, ww))); R2.push(add(pts[i], mul(nn, -ww))); } B2.flat([...Lp, ...R2.reverse()], col || INK, o); },
    flush() { for (const [k, ds] of Fs) { const [c, op] = k.split('|'); f.raw(`<path d="${ds.join('')}" fill="${c}" opacity="${op}"/>`); } for (const [k, ds] of Ls) { const [c, w, op] = k.split('|'); f.raw(`<path d="${ds.join('')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`); } Fs.clear(); Ls.clear(); },
  };
  return B2;
}
function bigRat(f, FX, c, a, s, o = {}) {
  const Bt = batcher(f); // the rat's many small strokes go out as a few combined paths (the rig export renders every layer with all defs)
  // final pass 2026-11-25: the rats shared one body plan in four poses. Each rat now also gets its own build and carriage
  // from a local PRNG seeded by its place (so the mound's layout and every other random draw stay as they were): body
  // length (lean and long to short and stocky), girth, the hump, the head's size, a bend through the spine (curled,
  // twisting or arched, the rump end fixed so the tail root does not move), and one of three coats (grey, brown, black).
  const LRr = (() => { let z = (Math.floor(Math.abs(c[0] * 13.7 + c[1] * 7.3 + s * 3.1)) % 2147483646) + 1; return () => (z = (z * 16807) % 2147483647) / 2147483647; })();
  const dead0 = o.pose === 'limp' || o.pose === 'hung';
  const Ls = 0.82 + LRr() * 0.38, gK = 0.84 + LRr() * 0.42, kb = (LRr() - 0.5) * (dead0 ? 0.5 : 1.1), coat = LRr(), hK = 0.88 + LRr() * 0.2, humpK = 0.8 + LRr() * 0.45;
  const sg = o.sg ?? (Math.cos(a) < 0 ? -1 : 1), F0 = frame(c, a, s), bendP = (x, y) => { const xx = -0.5 + (x + 0.5) * Ls; return [xx, y + kb * 0.5 * (xx + 0.5) ** 2]; };
  const F = pts => F0(pts.map(p => { const q = bendP(p[0], p[1] * sg); return p.length > 2 ? [q[0], q[1], p[2]] : q; }));
  const pose = o.pose || 'claw', dead = pose === 'limp' || pose === 'hung', G = R(f, 1.0, 1.14) * gK, H2 = R(f, 0.78, 0.88) * hK, hump = R(f, 0.92, 1.12) * humpK;
  const coatLo = coat < 0.3 ? '#4a3f33' : coat < 0.5 ? '#2c2a27' : '#47463f', coatHi = coat < 0.3 ? '#8a7a64' : coat < 0.5 ? '#5e5b54' : '#86847a';
  const tone = o.tone ?? R(f, 0, 1), fur = mix(mix(coatLo, coatHi, tone), P.frost, dead ? 0.22 : 0), furD = mix(fur, '#121210', 0.6), furL = mix(fur, '#e0e0d4', 0.4);
  const wet = mix(fur, '#0e0e0c', 0.42), sw = Math.max(0.9, s * 0.0036);
  const FUR = (x = {}) => Object.assign({ fill: fur, shadow: mix(fur, '#0e0e0c', 0.72), shade: 0.42, tex: 'fur' + f.o.seed, texOp: 0.3, inkW: 1.5, inkHeavy: 2.6, maxShade: s * 0.06, cast: o.cast ?? true, castOp: 0.5 }, x);
  const PNK = (x = {}) => Object.assign({ fill: PINK, shadow: PINKD, light: PINKL, shade: 0.4, inkW: 1.0, inkHeavy: 1.4, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.45 }, x);
  const v = y => y * G;
  // the body: rump round, the spine hunched to a peak over the haunch, sloping down through the shoulders to the neck;
  // under it the deep haunch, the waist tucked, the chest
  const BODY = [[-0.5, 0.07], [-0.528, -0.03], [-0.5, -0.14], [-0.43, -0.235 * hump], [-0.33, -0.29 * hump], [-0.2, -0.3 * hump], [-0.08, -0.262 * hump], [0.03, -0.21], [0.13, -0.165], [0.22, -0.13], [0.27, -0.06], [0.27, 0.03], [0.2, 0.1], [0.1, 0.13], [0.0, 0.122], [-0.1, 0.13], [-0.2, 0.165], [-0.3, 0.2], [-0.4, 0.19], [-0.47, 0.15]].map(([x, y]) => [x, v(y)]);
  // legs: shank (or forearm) from the knee (or elbow) under the body, then the bare grey-pink foot (or hand) with its toes
  const PZ = { strain: { f: [-0.25, -0.05], h: [2.2, 0.15] }, claw: { f: [0.9, 0.5], h: [1.95, 0.1] }, bite: { f: [1.25, 0.6], h: [2.1, 0.25] }, limp: { f: [1.7, 2.0], h: [1.6, 1.9] }, hung: { f: [0.45, 0.25], h: [0.75, 0.35] } }[pose]; // hung: by the tail, the legs dangling toward the head
  const leg = (root, a1, l1, a2, l2, w1, fore, far) => {
    const k = add(root, rot([l1, 0], a1)), ft = add(k, rot([l2, 0], a2)), lf = far ? mix(fur, '#000', 0.35) : fur;
    f.part(F(limb(root, k, w1, w1 * 0.5, { steps: 6, capK: 0.6, p: [[0.25, 0.2, 0.2]], q: [[0.3, 0.1, 0.2]] })), FUR({ fill: mix(lf, '#000', 0.22), inkW: 1.1, inkHeavy: 1.6, maxShade: s * 0.018, cast: false, texOp: 0.5 }));
    const pf = PNK(far ? { fill: mix(PINK, '#000', 0.32) } : {});
    f.part(F(limb(lerp(root, k, 0.82), ft, w1 * 0.42, w1 * (fore ? 0.34 : 0.3), { steps: 4, capK: 0.5, q: fore ? [] : [[0.2, 0.25, 0.2]] })), pf);
    const n = fore ? 4 : 5, dd = rot([1, 0], a2);
    for (let i = 0; i < n; i++) {
      const ta = (i - (n - 1) / 2) * (fore ? 0.36 : 0.2), t0 = add(ft, mul(dd, -0.008)), t1 = add(t0, rot(mul(dd, fore ? 0.038 : 0.046), ta)), t2 = add(t1, rot(mul(dd, 0.02), ta + 0.8));
      const tp = F(limb(t0, t1, 0.016, 0.011, { steps: 3, capK: 0.7, p: [[0.6, 0.25, 0.12]] })); Bt.flat(tp, far ? mix(PINK, '#000', 0.32) : PINK); Bt.line([...tp, tp[0]], 0.8, INK, { op: 0.85 });
      Bt.line(F([lerp(t0, t1, 0.55), add(lerp(t0, t1, 0.55), rot([0.004, 0.004], ta))]), Math.max(0.7, s * 0.0025), PINKD, { op: 0.7 });
      Bt.line(F([t1, t2]), Math.max(1.1, s * 0.0055), '#d8d2bc', { op: 0.95 });
    }
    // fur over the top of the shank, lying down it
    if (!far) for (let i = 0; i < 5; i++) { const q = lerp(root, k, R(f, 0.05, 0.6)), aa = a1 + R(f, -0.2, 0.2); Bt.line(F([q, add(q, rot([0.03, 0.004], aa))]), sw, '#12120f', { op: 0.55 }); }
    Bt.flush();
    return F([ft])[0];
  };
  const hindRoot = [-0.28, v(0.12)], foreRoot = [0.1, v(0.08)];
  const legsSide = far => {
    const dx = far ? 0.045 : 0, dv = far ? -0.02 : 0;
    leg([hindRoot[0] + dx, hindRoot[1] + dv], PZ.h[0] + (far ? -0.2 : 0), 0.14, PZ.h[1] + (far ? 0.15 : 0), 0.13, 0.1, false, far);
    leg([foreRoot[0] + dx, foreRoot[1] + dv], PZ.f[0] + (far ? 0.22 : 0), 0.105, PZ.f[1] + (far ? 0.2 : 0), 0.045, 0.06, true, far);
  };
  legsSide(true); legsSide(false);
  // the head on its neck, at its own angle; head and body are one outline so the head grows out of the shoulders
  const ha = o.ha ?? { strain: R(f, -0.15, 0.1), claw: R(f, 0.1, 0.4), bite: R(f, 0.7, 1.1), limp: R(f, 0.35, 0.75), hung: R(f, -0.15, 0.15) }[pose], hn = [0.2, v(-0.035)];
  const HF = pts => F(pts.map(([u, w, k]) => { const q = add(hn, rot([u * H2, w * H2], ha)); return k ? [...q, 1] : q; }));
  const HL = pts => pts.map(([u, w]) => add(hn, rot([u * H2, w * H2], ha)));
  const HEAD = [[-0.08, -0.1], [0.02, -0.135], [0.12, -0.138], [0.2, -0.115], [0.27, -0.078], [0.33, -0.048], [0.385, -0.024], [0.415, -0.006], [0.43, 0.014], [0.414, 0.032], [0.37, 0.044], [0.31, 0.056], [0.25, 0.08], [0.17, 0.108], [0.07, 0.114], [-0.03, 0.1], [-0.09, 0.06]];
  const ONE = [...BODY.slice(0, 9), ...HL(HEAD.slice(1, 16)), ...BODY.slice(13)];
  // the far ear behind the skull: smaller, darker
  const ear = (b, eA, eL, eW, far) => {
    const E2 = pts => HF(pts.map(([u, w]) => add(b, rot([u * eL, w * eW], eA))));
    const leaf = [[0, -0.2], [0.2, -0.42], [0.5, -0.5], [0.8, -0.4], [0.98, -0.12], [1.0, 0.12], [0.88, 0.36], [0.62, 0.5], [0.32, 0.42], [0.1, 0.22]];
    f.part(E2(leaf), PNK(far ? { fill: mix(PINK, '#000', 0.3), inkW: 1.0, inkHeavy: 1.2 } : { inkW: 1.0, inkHeavy: 1.3 }));
    if (!far) { // the opening faces forward (+w): we look into the bowl past its thick back rim; it is deepest at the root
      Bt.flat(E2([[0.08, -0.05], [0.25, -0.3], [0.52, -0.36], [0.78, -0.28], [0.92, -0.06], [0.9, 0.18], [0.74, 0.38], [0.48, 0.42], [0.24, 0.3], [0.1, 0.14]]), '#4a3c3d');
      Bt.flat(E2([[0.1, 0.0], [0.25, -0.18], [0.45, -0.2], [0.5, 0.0], [0.38, 0.18], [0.18, 0.14]]), '#271f20', { op: 0.85 }); // the deep root of the bowl
      Bt.flat(E2([[0.58, -0.22], [0.82, -0.16], [0.86, 0.08], [0.7, 0.2], [0.58, 0.04]]), mix(PINK, PINKD, 0.25), { op: 0.6 }); // the inner wall catching light near the top
      for (let k = 0; k < 3; k++) Bt.line(E2([[0.3 + k * 0.12, 0.2], [0.45 + k * 0.12, 0.0], [0.62 + k * 0.08, -0.16]]), Math.max(0.6, s * 0.002), PINKL, { op: 0.25 }); // veins on the thin skin
      Bt.line(E2([[0.3, 0.44], [0.62, 0.46], [0.86, 0.32], [0.98, 0.08]]), Math.max(1, s * 0.0035), PINKL, { op: 0.75 }); // the thin front rim
      Bt.line(E2([[0.12, 0.04], [0.22, 0.16], [0.28, 0.3]]), Math.max(1, s * 0.004), '#1e1818', { op: 0.7 }); // the fold at its root
      if (f.r() < 0.25 || o.tornEar) Bt.flat(E2([[0.62, -0.5], [0.8, -0.24], [0.94, -0.3], [0.86, -0.5]]), '#0c0c0a');
    }
    for (let k = 0; k < 4; k++) { const q = add(b, rot([R(f, -0.01, 0.015), R(f, -0.02, 0.02)], eA)); Bt.line(HF([q, add(q, [0.03, 0.01])]), sw, '#12120f', { op: 0.6 }); }
  };
  const eA = -2.15 + R(f, -0.2, 0.2), eL = R(f, 0.13, 0.15), eW = eL * R(f, 0.66, 0.74);
  ear([0.1, -0.12], eA + 0.3, eL * 0.8, eW * 0.8, true); // the far ear, behind the skull
  Bt.flush();
  const bD = f.part(F(ONE), FUR());
  clipDraw(f, bD, () => {
    softTone(f, bD, [[F([[-0.6, v(0.03)], [0.12, v(0.0)], [0.16, v(0.3)], [-0.6, v(0.3)]]), '#000', 0.5, s * 0.03], [F([[-0.46, v(-0.33)], [0.2, v(-0.24)], [0.2, v(-0.14)], [-0.46, v(-0.18)]]), '#ffffff', 0.15, s * 0.025], [F(ell([-0.32, v(-0.1)], 0.11, v(0.09), 0, 8)), '#ffffff', 0.13, s * 0.022], [F(ell([0.12, v(0.0)], 0.07, v(0.1), 0, 8)), '#000', 0.25, s * 0.02]]);
    // fur: hatching that lies back along the body and sweeps down the flanks; it wraps round the haunch
    const dirAt = q => { const vn = q[1] / v(0.25), hc = sub(q, [-0.32, v(-0.06)]), hr = E.len(hc); return hr < 0.17 && q[0] < -0.3 ? Math.atan2(hc[1], hc[0]) + Math.PI / 2 * 1.0 : Math.PI + 0.12 + vn * 0.6; };
    furHatch(f, F, BODY, Math.round((o.lite ? 300 : 560) * Math.min(1.3, (s / 300) ** 2)), dirAt, [0.026, 0.055], { w: sw, lightAt: q => q[1] < v(-0.15) ? 0.9 : 0.1, deep: q => q[1] > v(0.06) ? 0.5 : 0.05 });
    softTone(f, bD, [[F([[-0.19, v(-0.2)], [-0.14, v(-0.06)], [-0.2, v(0.08)], [-0.27, v(0.16)], [-0.22, v(0.16)], [-0.12, v(0.0)], [-0.14, v(-0.18)]]), '#000', 0.4, s * 0.012]]); // the hollow in front of the haunch
    Bt.line(F([[-0.44, v(-0.22 * hump)], [-0.3, v(-0.28 * hump)], [-0.16, v(-0.28 * hump)], [-0.02, v(-0.23)]]), Math.max(1.2, s * 0.005), furL, { op: 0.4 }); // the spine's lit ridge
    // wet clumps inside the coat: a few spiky points with a sheen
    for (let i = 0; i < 6; i++) { const q = [R(f, -0.44, 0.1), v(R(f, -0.22, 0.08))], tip = add(q, rot([R(f, 0.06, 0.09), 0], Math.PI + 0.15 + q[1] * 2 + R(f, -0.15, 0.2))); for (let k = 0; k < 4; k++) { const b0 = add(q, [R(f, -0.012, 0.012), R(f, -0.02, 0.02)]); Bt.line(F([b0, lerp(b0, tip, 0.5), tip]), Math.max(1.2, s * (0.007 - k * 0.0012)), k % 2 ? '#0e0e0c' : wet, { op: 0.7 }); } Bt.line(F([lerp(q, tip, 0.15), lerp(q, tip, 0.7)]), Math.max(0.7, sw * 0.8), '#c6cac0', { op: 0.45 }); } // wet fur drawn together into points, with a sheen
    // mange: fur rotted off in patches to grey, scabbed skin
    if (!dead) for (let m = 0; m < (f.r() < 0.35 ? 2 : f.r() < 0.75 ? 1 : 0); m++) {
      const q = [R(f, -0.4, 0.05), v(R(f, -0.18, 0.06))], rx = R(f, 0.045, 0.08), ry = v(R(f, 0.03, 0.055)), mg = []; for (let k = 0; k < 13; k++) { const t = k / 13 * Math.PI * 2, j = R(f, 0.62, 1.15); mg.push([q[0] + Math.cos(t) * rx * j, q[1] + Math.sin(t) * ry * j]); }
      const mD = f.part(F(mg), X0.SK(f, { fill: mix(mix(P.skin, P.bruise, 0.3), '#000', 0.18), shadow: P.bruiseD, inkW: 0, inkHeavy: 0, cast: false, maxShade: 3, hatch: false }));
      for (let k = 0; k < 6; k++) { const sc = add(q, [R(f, -rx * 0.65, rx * 0.65), R(f, -ry * 0.6, ry * 0.6)]), sl = R(f, 0.012, 0.03), sa = R(f, -0.6, 0.6) + Math.PI; Bt.stroke(F([sc, add(sc, rot([sl * 0.5, 0.003], sa)), add(sc, rot([sl, 0], sa))]), Math.max(1.5, s * R(f, 0.005, 0.009)), '#2a2320', { op: 0.85 }); if (k % 2) Bt.line(F([add(sc, rot([sl * 0.2, -0.002], sa)), add(sc, rot([sl * 0.6, -0.003], sa))]), Math.max(0.8, s * 0.002), P.pus, { op: 0.5 }); }
      for (let k = 0; k < 10; k++) { const sc = add(q, [R(f, -rx * 0.7, rx * 0.7), R(f, -ry * 0.7, ry * 0.7)]); Bt.flat(F(ell(sc, 0.0025, 0.0025, 0, 4)), '#1a1816', { op: 0.6 }); }
      // the ragged fur edge round it: short broken strokes pointing out
      for (let k = 0; k < 16; k++) { const t = k / 16 * Math.PI * 2, e0 = [q[0] + Math.cos(t) * rx * 1.02, q[1] + Math.sin(t) * ry * 1.02]; Bt.line(F([e0, add(e0, rot([0.018, 0], t + R(f, -0.4, 0.4)))]), sw, '#0e0e0c', { op: 0.7 }); }
      if (f.r() < 0.6) X0.sore(f, F([q])[0], s * 0.016, { ang: a });
    }
    if (dead) { X0.mould(f, F([[R(f, -0.36, -0.1), v(-0.12)]])[0], s * 0.1, s * 0.05, { rings: 1, ink: 0 }); X0.mould(f, F([[0.05, v(0.05)]])[0], s * 0.06, s * 0.04, { rings: 1, ink: 0 }); }
    Bt.flush();
  });
  // wet clumps along the outline: drawn to points along the back and rump, hanging from the belly; irregular, never a comb
  const ridge = u => { const pts = BODY.slice(1, 10); for (let i = 0; i < pts.length - 1; i++) if (u >= pts[i][0] && u <= pts[i + 1][0]) { const t = (u - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); return lerp(pts[i], pts[i + 1], t)[1]; } return pts[pts.length - 1][1]; };
  { let u = -0.5 + R(f, 0, 0.03); while (u < 0.12) { const top = [u, ridge(u) + v(0.03)], wt = f.r() < 0.4; furClump(Bt, F, top, Math.PI - 0.12 - R(f, 0, 0.25), R(f, 0.045, 0.08), R(f, 0.02, 0.032), wt ? [wet, '#0e0e0c', wet] : [mix(fur, '#000', 0.1), furD, fur], { w: Math.max(2, s * 0.008), sheen: wt ? '#c6cac0' : null, n: 3 }); u += R(f, 0.035, 0.08); } }
  { let u = -0.46 + R(f, 0, 0.03); while (u < 0.16) { const bt = [u, v(u < -0.15 ? 0.17 : 0.12) - v(0.03)]; furClump(Bt, F, bt, Math.PI * 0.62 + R(f, -0.15, 0.15), R(f, 0.03, 0.055), R(f, 0.02, 0.03), [furD, '#0c0c0a', mix(fur, '#000', 0.4)], { w: Math.max(1.8, s * 0.007), n: 3 }); u += R(f, 0.04, 0.085); } }
  for (let k = 0; k < 3; k++) furClump(Bt, F, [-0.49, v(R(f, -0.12, 0.08))], Math.PI + R(f, -0.4, 0.5), R(f, 0.03, 0.05), 0.02, [furD, wet], { w: Math.max(1.8, s * 0.007), n: 3 });
  Bt.flush();
  clipDraw(f, bD, () => {
    softTone(f, bD, [[HF([[-0.1, 0.03], [0.44, 0.02], [0.44, 0.12], [-0.1, 0.12]]), '#000', 0.45, s * 0.02], [HF([[0.0, -0.13], [0.32, -0.06], [0.32, -0.03], [0.0, -0.07]]), '#ffffff', 0.15, s * 0.015]]);
    furHatch(f, F, HL(HEAD), Math.round((o.lite ? 50 : 90) * Math.min(1.3, (s / 300) ** 2)), () => Math.PI + ha + 0.08, [0.015, 0.03], { w: sw * 0.85, lightAt: q => 0.3, deep: () => 0.05 });
    Bt.flat(HF([[0.33, -0.035], [0.43, 0.0], [0.42, 0.04], [0.33, 0.05]]), mix(fur, PINK, 0.35), { op: 0.6 }); // the short bare muzzle
    Bt.flush();
  });
  ear([0.03, -0.11], eA, eL, eW, false);
  Bt.flush();
  // the nose pad and nostril; the eye: a small dark bead under the brow, one glint (shut and rimed on the dead)
  { const np = HF([[0.392, -0.008], [0.432, 0.006], [0.428, 0.032], [0.396, 0.036]]); Bt.flat(np, PINK); Bt.flat(HF([[0.396, 0.016], [0.428, 0.02], [0.426, 0.032], [0.398, 0.034]]), PINKD, { op: 0.6 }); Bt.line([...np, np[0]], 1, INK); }
  Bt.line(HF([[0.41, 0.012], [0.424, 0.018]]), Math.max(1, s * 0.004), '#1a1414', { op: 0.85 });
  const eye = HF([[0.2, -0.05]])[0], eAng = a + ha * sg;
  Bt.flat(ell(eye, s * 0.02, s * 0.014, eAng, 8), '#0e0d0c', { op: 0.35 }); // the socket's shadow
  Bt.stroke(HF([[0.15, -0.078], [0.2, -0.086], [0.25, -0.068]]), Math.max(2, s * 0.01), furD, { op: 0.8 }); // the brow
  if (dead) { Bt.line([add(eye, rot([-s * 0.012, 0], eAng)), add(eye, rot([s * 0.012, s * 0.002], eAng))], Math.max(1.4, s * 0.005), '#0e0e0e'); Bt.flat(ell(eye, s * 0.012, s * 0.006, eAng, 6), P.hoar, { op: 0.6 }); }
  else { Bt.flat(ell(eye, s * 0.011, s * 0.0095, eAng, 8), '#070606'); Bt.flat(ell(add(eye, rot([s * 0.003, -s * 0.0035], eAng)), s * 0.0032, s * 0.0028, 0, 5), '#c8ccc4', { op: 0.85 }); }
  // the mouth: open on the long yellowed incisors, or shut
  const open = !dead || f.r() < 0.4;
  if (open) {
    const gape = pose === 'bite' ? 0.075 : 0.05;
    Bt.flat(HF([[0.2, 0.068], [0.375, 0.046], [0.395, 0.06 + gape], [0.3, 0.08 + gape], [0.22, 0.08]]), '#0e0b0b');
    Bt.flat(HF([[0.24, 0.08], [0.33, 0.07 + gape * 0.6], [0.3, 0.085 + gape * 0.6]]), mix(P.bruise, '#000', 0.25), { op: 0.8 });
    const tooth = (pts, c) => { const q = HF(pts); Bt.flat(q, c); Bt.line([...q, q[0]], 0.9, INK, { op: 0.9 }); };
    for (const dx of [0, 0.011]) tooth([[0.375 + dx, 0.036], [0.389 + dx, 0.036], [0.386 + dx, 0.084], [0.377 + dx, 0.089]], mix(P.bone, P.mouldY, 0.4));
    for (const dx of [0, 0.011]) tooth([[0.34 + dx, 0.08 + gape], [0.354 + dx, 0.078 + gape], [0.364 + dx, 0.05 + gape * 0.4], [0.352 + dx, 0.048 + gape * 0.4]], mix(P.bone, P.mouldY, 0.5));
  } else Bt.line(HF([[0.22, 0.074], [0.32, 0.066], [0.385, 0.05]]), Math.max(1.2, s * 0.005), '#121010');
  for (let i = 0; i < 7; i++) { const q = HF([[0.37, 0.015 + (i % 3) * 0.008]])[0], wa = a + (ha + (i - 3) * 0.11 + 0.05) * sg, L = s * R(f, 0.12, 0.2); Bt.line([q, add(q, rot([L * 0.5, L * 0.02 * sg], wa)), add(q, rot([L, L * 0.08 * sg], wa))], Math.max(0.7, s * 0.0026), i % 2 ? P.hoar : furD, { op: 0.75 }); } // whiskers
  // the ruff where the head meets the shoulders: fur laid back over the joint, a wet clump under the throat
  for (let k = 0; k < 26; k++) { const q = HL([[R(f, -0.08, 0.05), R(f, -0.11, 0.1)]])[0], aa = Math.PI + ha * 0.5 + R(f, -0.3, 0.3); Bt.line(F([q, add(q, rot([R(f, 0.025, 0.05), 0.005], aa))]), sw, k % 3 ? '#12120f' : furL, { op: 0.55 }); }
  furClump(Bt, F, [0.18, v(0.09)], Math.PI * 0.6, 0.05, 0.024, [wet, '#0c0c0a', furD], { w: Math.max(1.8, s * 0.007), n: 3, sheen: '#c6cac0' });
  X0.pustules(f, HF([[0.24, -0.02]])[0], s * 0.02, s * 0.015, f.r() < 0.5 ? 2 : 0, s * 0.006, s * 0.01);
  // the course marks: buboes the size of eggs and sores on the living; rime, mould fur and a fungal fringe on the dead
  if (!dead) { if (o.bubo ?? f.r() < 0.22) X0.bubo(f, F([[R(f, -0.12, 0.08), v(0.13)]])[0], s * R(f, 0.045, 0.06), { sag: 0.5, cast: false }); if (f.r() < 0.5) X0.sore(f, F([[R(f, -0.2, 0.1), v(-0.18)]])[0], s * 0.02, { ang: a }); }
  else { FX.rime(F([[-0.5, v(-0.14)], [-0.33, v(-0.29 * hump)], [-0.1, v(-0.26)], [0.1, v(-0.18)]]), Math.max(4, s * 0.025), sg > 0 ? 1 : -1); if (o.old ?? f.r() < 0.4) X0.graveCaps(f, F([[-0.28, v(-0.28)]])[0], a - Math.PI / 2 * sg, s * 0.12, 3); X0.fungalFur(f, F([[-0.46, v(0.15)], [-0.1, v(0.16)], [0.18, v(0.12)]]), s * 0.025, sg > 0 ? 1 : -1, { gaps: 0.4 }); }
  if (o.fleas) for (let i = 0; i < o.fleas; i++) { const q = F([[R(f, -0.4, 0.25), v(R(f, -0.22, 0.12))]])[0]; Bt.flat(ell(q, 1.6, 1.1, R(f, 0, 3), 5), '#080808', { op: 0.9 }); }
  Bt.flush();
  return { root: F([[-0.51, v(0.04)]])[0], head: HF([[0.42, 0.012]])[0], F };
}

// a rat picked to its bones: skull, spine as beads, ribs, the pelvis, leg bones
function ratBones(f, F, s, G, o = {}) {
  const BL = { fill: P.bone, shadow: P.boneS, shade: 0.4, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false, tex: 'mottle' + f.o.seed, texOp: 0.4 };
  const sp = []; for (let i = 0; i <= 12; i++) { const t = i / 12; sp.push(F([[-0.48 + t * 0.7, -0.35 * G * Math.sin(Math.PI * (0.2 + t * 0.7))]])[0]); }
  for (let i = 1; i < 6; i++) { const q = sp[3 + i]; const e1 = add(q, [0, s * 0.12]); f.line([q, lerp(q, e1, 0.5).map((v, j) => j ? v : v - s * 0.02), e1], Math.max(1, s * 0.014), P.boneD, { op: 0.9 }); }
  for (const q of sp) f.part(ell(q, s * 0.024, s * 0.018, 0, 6), BL);
  f.part(F([[-0.5, -0.05], [-0.38, -0.12], [-0.34, 0.05], [-0.46, 0.08]]), BL);
  f.part(F([[0.2, -0.1], [0.34, -0.08], [0.44, 0.0], [0.42, 0.04], [0.3, 0.06], [0.2, 0.05]]), BL); // skull
  f.flat(ell(F([[0.27, -0.03]])[0], s * 0.025, s * 0.018, 0, 6), '#141210');
  f.part(F([[0.36, 0.04], [0.39, 0.04], [0.385, 0.09], [0.37, 0.095]]), Object.assign({}, BL, { fill: mix(P.bone, P.mouldY, 0.4) }));
  return { root: F([[-0.5, 0.0]])[0], head: F([[0.44, 0.02]])[0], F, G };
}
// a rat's tail from root to the end point through a bend: a scaly, tapering tube with ring ticks, frozen pale
function ratTail(f, pts, w0, o = {}) {
  const C = spline(pts, 4), n = C.length, ws = C.map((_, i) => w0 * (1 - 0.86 * Math.pow(i / (n - 1), 0.85)));
  const col = o.col || mix(P.skin, P.bone, 0.35), dk = mix(col, '#000', 0.5);
  const out = X0.ribbon(C, ws);
  f.part(out, { fill: col, shadow: mix(col, '#1a1816', 0.65), shade: 0.4, inkW: o.inkW ?? 1, inkHeavy: o.inkH ?? 1.4, cast: false, tex: 'scute' + f.o.seed, texOp: 0.6, maxShade: Math.max(2, w0 * 0.3), k: 0.9 });
  // scale rings: close-set, slightly bowed, staggered so they read as scales, not stripes; a pale underside
  const Bt = batcher(f);
  for (let i = 1; i < n - 1; i++) { const d = E.norm(sub(C[i + 1], C[i - 1])), nn = [-d[1], d[0]], bw = ws[i] * 0.18 * (i % 2 ? 1 : -1); Bt.line([add(C[i], mul(nn, ws[i] * 0.48)), add(add(C[i], mul(d, bw)), mul(nn, 0)), add(C[i], mul(nn, -ws[i] * 0.48))], Math.max(0.6, Math.round(ws[i] * 0.06 * 2) / 2), dk, { op: 0.55 }); }
  f.line(offsetLine(C, t => ws[Math.round(t * (n - 1))] * 0.28).slice(0, Math.round(n * 0.85)), Math.max(0.6, w0 * 0.1), mix(col, '#fff', 0.3), { op: 0.35 });
  if (o.rime) f.line(offsetLine(C, t => -ws[Math.round(t * (n - 1))] * 0.3), Math.max(0.8, w0 * 0.2), P.hoar, { op: 0.55 });
  Bt.flush();
  return C;
}

// ---- grave-linen corpse for the cart's heap: a wrapped body from head h to feet ft, w its breadth. o.face: the head
// bare, lolling (a grey face, eyes shut, mouth open); o.child; o.look linen look; o.binds: number of bindings.
function shroud(f, FX, h, ft, w, o = {}) {
  const d = E.norm(sub(ft, h)), n = [-d[1], d[0]], L = E.len(sub(ft, h));
  const at = (t, k) => add(lerp(h, ft, t), mul(n, k * w / 2));
  const W = t => (t < 0.12 ? 0.62 + t * 2.5 : t < 0.3 ? 0.95 + (t - 0.12) * 0.3 : t < 0.7 ? 1.0 - (t - 0.3) * 0.5 : 0.8 - (t - 0.7) * 1.4) * (1 + R(f, -0.04, 0.04));
  const Pp = [], Q = []; for (let i = 0; i <= 14; i++) { const t = i / 14; Pp.push(at(t, W(t))); Q.push(at(t, -W(t) * (i > 2 && i < 12 ? 1 + R(f, -0.06, 0.08) : 1))); }
  const outl = [...Pp, add(ft, mul(d, w * 0.12)), ...Q.reverse(), add(h, mul(d, -w * 0.3))];
  const look = Object.assign({ fill: P.linen, shadow: '#26261f', shade: 0.42, tex: 'weave' + f.o.seed, texOp: 0.55, maxShade: w * 0.3, inkW: 1.4, inkHeavy: 2.2 }, o.look || {});
  const sD = f.part(outl, look);
  const bb = E.bbox(outl);
  X0.stains(f, sD, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.mouldD, 0.04, 3, -1.7, 31 + Math.round(h[0] + h[1]), 0.6);
  clipDraw(f, sD, () => {
    for (let i = 0; i < 4; i++) { const t0 = R(f, 0.15, 0.85); f.stroke([at(t0, -0.9), at(t0 + 0.04, -0.1), at(t0 + 0.02, 0.8)], 3, '#121310', { op: 0.45 }); } // the linen pulled in folds over the body
    f.flat([at(0, -1.2), at(1, -1.2), at(1, -0.3), at(0, -0.4)], '#000', { op: 0.18 });
  });
  for (const t of (o.bindAt || [0.16, 0.42, 0.72, 0.92].slice(0, o.binds ?? 4))) { const p0 = at(t, -W(t) * 1.04), p1 = at(t, W(t) * 1.04), m = add(lerp(p0, p1, 0.5), mul(d, w * 0.05)); f.line([p0, m, p1], Math.max(2, w * 0.06), '#26261f'); f.line([add(p0, mul(d, -1.5)), add(m, mul(d, -1.5)), add(p1, mul(d, -1.5))], 1, P.linenL, { op: 0.5 }); }
  if (o.face) {
    const hc = add(h, mul(d, w * 0.25)), H2 = w * 1.1, hA = o.hA ?? ang(ft, h) - Math.PI / 2;
    B.head(f, hc, H2, hA, { skin: P.skin, jaw: 1.05, mouth: 'snarl', blind: true, faceShade: 0.78, jawShade: 0.6, gaunt: true, age: true, noEar: true, hairBack: undefined });
    X0.greyFace(f, frame(hc, hA, H2), P.skin, 1, { noEar: true });
    const hF = frame(hc, hA, H2);
    for (const [cx, w2] of [[0.115, 0.05], [0.292, 0.024]]) f.line(hF([[cx - w2, -0.055], [cx, -0.045], [cx + w2, -0.055]]), Math.max(1, H2 * 0.02), '#121110');
    f.part(hF([[-0.42, -0.1], [-0.3, -0.5], [0.0, -0.58], [0.28, -0.5], [0.34, -0.36], [0.1, -0.4], [-0.16, -0.3], [-0.3, 0.1], [-0.3, 0.5], [-0.46, 0.4]]), look); // the shroud pulled back off the face, still round the head
    FX.frost(hF([[0.15, 0.1]])[0], H2 * 0.15, H2 * 0.1, 4, Math.max(0.8, H2 / 80));
  }
  return { outl, at, W };
}


// ---- one of the dead, for the cart's heap: an articulated body at any angle. pel: pelvis; a: the spine's direction
// (pelvis to head); s: body length (crown to heel). o.arms [[upper, fore], [upper, fore]] absolute angles (near, far);
// o.legs likewise; o.loll: the head's turn off the spine; o.dress 'tunic' | 'shift' | 'shroud' (wrapped, hands and feet
// bound in) ; o.col cloth colour; o.hose; o.feet 'bare' | 'shoe'; o.hair colour; o.child. Plague and toxin show only as
// staining on the cloth, livid skin and a sore or two; frost as rime on the upper edges.
function corpse(f, FX, pel, a, s, o = {}) {
  const d = dir(a), n = [-d[1], d[0]], at = (u, w) => add(add(pel, mul(d, u * s)), mul(n, w * s));
  const skin = mix(P.skin, P.skinD, R(f, 0, 0.3)), SKN = (x = {}) => X0.SK(f, Object.assign({ fill: skin, maxShade: s * 0.03 }, x));
  const col = o.col || P.linen, CL = (x = {}) => Object.assign({ fill: col, shadow: mix(col, '#0e0e0c', 0.7), shade: 0.42, tex: 'weave' + f.o.seed, texOp: 0.55, maxShade: s * 0.05, inkW: 1.5, inkHeavy: 2.4, cast: true, castOp: 0.45 }, x);
  const stain = (dd, pts) => { const bb = E.bbox(pts); X0.stains(f, dd, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], '#1c1a12', 0.05, 3, -1.5, Math.round(bb[0] + bb[1]) % 97, 0.6); X0.stains(f, dd, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.mouldD, 0.04, 3, -1.9, Math.round(bb[0] * 3 + bb[1]) % 89, 0.5); };
  if (o.dress === 'shroud') {
    const r = shroud(f, FX, at(0.5, 0), at(-0.5, 0), s * 0.2, { face: o.face, binds: 4, look: { fill: col } });
    if (o.arms) { const [ua, fa] = o.arms[0], S2 = at(0.28, 0.08), E2 = add(S2, rot([s * 0.17, 0], ua)), W2 = add(E2, rot([s * 0.15, 0], fa)); f.part(jointLimb(S2, E2, lerp(E2, W2, 0.94), [s * 0.065, s * 0.055, s * 0.045], { point: 0.4 }), SKN()); f.part(sleeveShape(f, [add(S2, mul(d, s * 0.02)), lerp(S2, E2, 0.7)], [s * 0.1, s * 0.09], { rag: s * 0.02 }), CL({ cast: false })); openHand(f, W2, fa, s * 0.14, { look: SKN(), back: true, spread: 0.2, curl: 0.4, swell: 0.1, nail: '#4a4a44', tips: '#3e3e3a' }); } // an arm worked loose of the shroud
    return r;
  }
  const armDraw = (k, far) => {
    const [ua, fa] = o.arms ? o.arms[k] : [a + Math.PI * 0.8, a + Math.PI * 0.6], S2 = at(0.3, far ? -0.08 : 0.08), E2 = add(S2, rot([s * 0.18, 0], ua)), W2 = add(E2, rot([s * 0.16, 0], fa));
    const lk = far ? SKN({ fill: mix(skin, '#000', 0.25) }) : SKN();
    f.part(jointLimb(S2, E2, lerp(E2, W2, 0.94), [s * 0.075, s * 0.062, s * 0.05], { point: 0.4, mus0: 0.12, mus1: 0.25 }), lk);
    livid(f, lerp(E2, W2, 0.5), s * 0.02, s * 0.04, 3, s / 400); if (f.r() < 0.4) X0.sore(f, lerp(E2, W2, 0.4), s * 0.012, { ang: fa });
    if (o.dress !== 'shift' || true) f.part(sleeveShape(f, [add(S2, mul(d, s * 0.03)), lerp(S2, E2, o.dress === 'shift' ? 1.05 : 0.85)], [s * 0.11, s * 0.095], { rag: s * 0.02, roll: o.dress === 'shift' }), CL({ fill: far ? mix(col, '#000', 0.2) : col, cast: false }));
    const hd = openHand(f, W2, fa + R(f, -0.2, 0.2), s * 0.15, { look: lk, back: true, flip: !far, spread: R(f, 0.06, 0.25), curl: R(f, 0.25, 0.7), swell: 0.12, nail: '#4a4a44', tips: '#3e3e3a' });
    FX.rime([lp(S2, E2, 0.2, s * 0.04), lp(E2, W2, 0.8, s * 0.03)], Math.max(3, s * 0.008), -1);
    for (const g of hd.fing.slice(1, 3)) FX.icicle(add(g.k3, [0, 2]), s * 0.02, s * 0.006);
  };
  const legDraw = (k, far) => {
    const [ta, sa] = o.legs ? o.legs[k] : [a + Math.PI, a + Math.PI], H2 = at(-0.04, far ? -0.05 : 0.05), K2 = add(H2, rot([s * 0.25, 0], ta)), A2 = add(K2, rot([s * 0.23, 0], sa));
    const hoseC = o.hose || mix(P.woolD, '#000', 0.1), lk = o.dress === 'shift' ? SKN(far ? { fill: mix(skin, '#000', 0.25) } : {}) : CL({ fill: far ? mix(hoseC, '#000', 0.25) : hoseC, tex: 'weave' + f.o.seed, cast: false });
    f.part(jointLimb(H2, K2, lerp(K2, A2, 0.95), [s * 0.11, s * 0.08, s * 0.06], { point: 0.3, mus0: 0.1, mus1: 0.2 }), lk);
    if (o.dress === 'shift') livid(f, lerp(K2, A2, 0.5), s * 0.02, s * 0.05, 3, s / 400);
    // the foot: a heel, the arch, the toes, turned off the shin; bare and grey or in a rotted shoe
    const fa2 = sa - Math.PI / 2 * (Math.cos(sa) >= 0 ? -1 : 1) * 0.9, fd = rot([1, 0], fa2), fn = [-fd[1], fd[0]], fl = s * 0.14;
    const foot = [add(A2, mul(fn, -s * 0.03)), add(add(A2, mul(fd, fl * 0.6)), mul(fn, -s * 0.028)), add(add(A2, mul(fd, fl)), mul(fn, -s * 0.012)), add(add(A2, mul(fd, fl * 1.02)), mul(fn, s * 0.01)), add(add(A2, mul(fd, fl * 0.5)), mul(fn, s * 0.03)), add(add(A2, mul(fd, -fl * 0.15)), mul(fn, s * 0.035))];
    if (o.feet === 'shoe') f.part(foot, { fill: P.leatherD, shadow: '#0e0d0a', shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: 1.4, cast: false }); else { f.part(foot, SKN({ fill: mix(skin, '#000', far ? 0.25 : 0), cast: false })); for (let i = 0; i < 3; i++) f.line([add(add(A2, mul(fd, fl * (0.82 + i * 0.05))), mul(fn, -s * 0.016)), add(add(A2, mul(fd, fl * (0.86 + i * 0.05))), mul(fn, s * 0.006))], 1, '#1e1c18', { op: 0.6 }); f.line([add(A2, mul(fd, fl * 0.95)), add(A2, mul(fd, fl * 1.02))], 2, '#3e3e3a', { op: 0.8 }); }
    FX.icicle(add(A2, mul(fd, fl * 0.5)), s * 0.03, s * 0.008);
  };
  armDraw(1, true); legDraw(1, true);
  // the torso and its dress: a tunic to mid-thigh with a belt, or a linen shift to the calf; folds, stains, a rent
  const tor = [at(0.38, 0.05), at(0.34, 0.125), at(0.25, 0.14), at(0.12, 0.105), at(0.02, 0.12), at(-0.05, 0.085), at(-0.05, -0.085), at(0.02, -0.12), at(0.12, -0.105), at(0.25, -0.14), at(0.34, -0.125), at(0.38, -0.05)];
  const skirtL = o.dress === 'shift' ? -0.36 : -0.17;
  const sk = [at(0.02, 0.12), at(skirtL, 0.15), at(skirtL - 0.02, 0.06), at(skirtL, 0.0), at(skirtL - 0.03, -0.08), at(skirtL, -0.15), at(0.02, -0.12)];
  const skD = f.part(sk.map((q, i) => i > 0 && i < sk.length - 1 && i % 2 ? [...q, 1] : q), CL()); stain(skD, sk);
  const tD = f.part(tor, CL()); stain(tD, tor);
  clipDraw(f, tD, () => { for (let i = 0; i < 4; i++) f.stroke([at(0.32, -0.08 + i * 0.05), at(0.16, -0.06 + i * 0.05 + R(f, -0.01, 0.01)), at(0.0, -0.08 + i * 0.05)], Math.max(2, s * 0.006), '#0e0e0c', { op: 0.45 }); softTone(f, tD, [[[at(0.4, 0.04), at(-0.1, 0.04), at(-0.1, 0.2), at(0.4, 0.2)], '#000', 0.35, s * 0.02]]); });
  clipDraw(f, skD, () => { for (let i = 0; i < 4; i++) f.stroke([at(0.0, -0.1 + i * 0.065), at(skirtL * 0.5, -0.11 + i * 0.07), at(skirtL, -0.12 + i * 0.075)], Math.max(2, s * 0.006), '#0e0e0c', { op: 0.45 }); });
  if (o.dress !== 'shift') f.line([at(0.03, 0.115), at(0.0, 0.0), at(0.03, -0.115)], Math.max(3, s * 0.012), P.leatherD);
  if (f.r() < 0.5) { const q = at(R(f, 0.1, 0.25), R(f, -0.06, 0.06)), hl = ell(q, s * 0.03, s * 0.02, a, 9).map(p2 => add(p2, [R(f, -2, 2), R(f, -2, 2)])); f.part(hl, SKN({ inkW: 1.1, cast: false })); f.line(hl.concat([hl[0]]), 1.6, '#121210', { op: 0.6 }); } // a rent, grey skin through it
  FX.rime([at(0.34, 0.11), at(0.1, 0.13), at(-0.15, 0.15)], Math.max(4, s * 0.01), 1);
  // the head: lolling off the spine, the face grey, eyes shut, the mouth dropped open
  const H2 = s * 0.15, hc = at(0.48, 0), hA = a + Math.PI / 2 + (o.loll ?? R(f, -0.7, 0.7));
  f.part(K.chain([at(0.33, 0), at(0.42, 0)], [s * 0.06, s * 0.05]), SKN());
  B.head(f, hc, H2, hA, { skin, jaw: R(f, 0.95, 1.2), chin: R(f, -0.02, 0.05), nose: R(f, 0.9, 1.15), hook: R(f, 0, 0.5), mouth: 'snarl', blind: true, faceShade: 0.8, faceHatch: false, jawShade: 0.6, gaunt: true, age: !o.child, noEar: false, hairCol: o.hair || mix('#3a3830', '#8a8a80', f.r()), hairBack: [[-0.46, 0.2], [-0.52, -0.16], [-0.42, -0.42], [-0.16, -0.54], [-0.26, -0.2], [-0.32, 0.1]], hair: o.bald ? undefined : [[-0.42, 0.04], [-0.44, -0.22], [-0.32, -0.44], [-0.08, -0.55], [0.16, -0.53], [0.3, -0.42], [0.18, -0.4], [0.02, -0.46], [-0.12, -0.36], [-0.22, -0.2], [-0.26, 0.0], [-0.32, 0.1]] });
  const hF = frame(hc, hA, H2); X0.greyFace(f, hF, skin, 1);
  for (const [cx, w2] of [[0.115, 0.05], [0.292, 0.024]]) f.line(hF([[cx - w2, -0.055], [cx, -0.045], [cx + w2, -0.055]]), Math.max(1.2, H2 * 0.02), '#121110');
  livid(f, hF([[0.05, 0.1]])[0], H2 * 0.12, H2 * 0.1, 3, H2 / 140); if (f.r() < 0.5) X0.sore(f, hF([[0.0, 0.3]])[0], H2 * 0.04, { ang: hA });
  FX.frost(hF([[0.05, -0.3]])[0], H2 * 0.1, H2 * 0.04, 4, Math.max(0.8, H2 / 90));
  legDraw(0, false); armDraw(0, false);
  return { at, hc };
}


// ---- one of the dead for the cart's heap, posed by gravity (rebuilt on independent review). The layout (world file) lays
// each body on the pile below it and decides each limb's angle: limbs over air hang plumb, limbs on the pile slide down its
// slope, the head lolls toward the ground. This draws the body with modelled anatomy: a torso with chest, small of the back,
// belly and buttock; a biceps and a forearm that swells below the elbow and narrows to a knobbed wrist; a thigh, a kneecap, a
// calf that bellies and an ankle bone; dead hands curled with knuckles and nails; a grey waxen face shaded at about 0.8, lids
// shut, the jaw slack. Cloth hangs by gravity (folds run toward the ground), is stained, torn and patched.
// o.pel pelvis; o.a spine angle (pelvis -> neck); o.bend the spine's curl (rad, + toward the front); o.s crown-to-heel length;
// o.arms [{ua, fa, wa}] near, far (absolute angles of upper arm, forearm, hand); o.legs [{ta, sa}]; o.hA the crown's angle
// (absolute, neck -> crown); o.dress 'tunic' | 'shift' | 'shroud'; o.col cloth; o.hose; o.feet 'bare' | 'shoe'; o.bald; o.hair.
const angLerp = (a0, a1, t) => { let d = a1 - a0; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return a0 + d * t; };
function deadArm(f, FX, S, ua, fa, wa, s, o = {}) {
  const E2 = add(S, rot([s * 0.18, 0], ua)), W = add(E2, rot([s * 0.155, 0], fa)), skin = o.skin || P.skin;
  const lk = X0.SK(f, { fill: o.far ? mix(skin, '#000', 0.25) : skin, maxShade: s * 0.03 });
  const sk = jointLimb(S, E2, lerp(E2, W, 0.95), [s * 0.068, s * 0.056, s * 0.034], { point: 0.45, mus0: 0.18, mus0At: 0.5, mus1: 0.38 });
  const d = f.part(sk, lk);
  clipDraw(f, d, () => {
    const dF = E.norm(sub(W, E2)), nF = [-dF[1], dF[0]];
    f.line([lp(E2, W, 0.4, s * 0.008), lp(E2, W, 0.92, s * 0.004)], Math.max(1, s * 0.003), '#1e1c18', { op: 0.45 }); // a tendon to the wrist
    f.line([lp(E2, W, 0.15, -s * 0.014), lp(E2, W, 0.7, -s * 0.01)], Math.max(1, s * 0.004), P.skinL, { op: 0.4 }); // the ulna's lit ridge
    f.flat(ell(add(W, mul(dF, -s * 0.01)), s * 0.009, s * 0.007, ang(E2, W), 7), P.skinL, { op: 0.5 }); // the wrist knob
    livid(f, lerp(E2, W, 0.55), s * 0.02, s * 0.03, 3, s / 400); X0.veins(f, lerp(E2, W, 0.6), s * 0.01, s * 0.02, 2, s / 500);
    if (f.r() < 0.4) X0.sore(f, lerp(E2, W, 0.35), s * 0.01, { ang: fa });
  });
  let sl = null; if (o.sleeve) { sl = f.part(sleeveShape(f, [add(S, mul(E.norm(sub(S, E2)), s * 0.03)), lerp(S, E2, 0.55), lerp(S, E2, o.sleeve)], o.delt ? [s * 0.108, s * 0.096, s * 0.088] : [s * 0.1, s * 0.094, s * 0.088], { rag: s * 0.018, roll: o.roll }), Object.assign({}, o.cloth, { cast: false }));
    clipDraw(f, sl, () => { for (let k = 0; k < 3; k++) { const q = lp(S, E2, 0.2 + k * 0.22, s * R(f, -0.03, 0.03)); f.stroke([q, add(q, [R(f, -4, 4), s * 0.03]), add(q, [R(f, -6, 6), s * 0.06])], Math.max(2, s * 0.008), '#0e0e0c', { op: 0.5 }); } }); }
  const hd = openHand(f, W, wa, s * 0.14, { look: lk, back: true, flip: !!o.flip, spread: R(f, 0.06, 0.18), curl: R(f, 0.55, 0.85), swell: 0.1, nail: '#4a4a44', tips: '#3e3e3a' });
  if (o.rime) FX.rime([lp(S, E2, 0.2, -s * 0.03), lp(E2, W, 0.8, -s * 0.02)], Math.max(3, s * 0.006), -1);
  if (o.icicles !== false) for (const g of hd.fing.slice(1, 3)) FX.icicle(add(g.k3, [0, 2]), s * 0.02, s * 0.006);
  return { E: E2, W, sl };
}
function deadLeg(f, FX, Hp, ta, sa, s, o = {}) {
  const K2 = add(Hp, rot([s * 0.25, 0], ta)), A2 = add(K2, rot([s * 0.235, 0], sa)), skin = o.skin || P.skin;
  const lk = o.look || X0.SK(f, { fill: o.far ? mix(skin, '#000', 0.25) : skin, maxShade: s * 0.04 });
  const lg = jointLimb(Hp, K2, lerp(K2, A2, 0.96), [s * 0.105, s * 0.064, s * 0.038], { point: 0.36, mus0: 0.2, mus0At: 0.42, mus1: 0.48 });
  const d = f.part(lg, lk);
  const nb = E.norm(mul(add(E.norm(sub(Hp, K2)), E.norm(sub(A2, K2))), -1)); // the outside of the knee's bend
  clipDraw(f, d, () => {
    const dn = (a2, b2) => { const dd = E.norm(sub(b2, a2)), nn = [-dd[1], dd[0]]; return nn[1] > 0 ? 1 : -1; }; // which edge faces the floor
    softTone(f, d, [[[lp(Hp, K2, -0.1, s * 0.07 * dn(Hp, K2)), lp(Hp, K2, 1.05, s * 0.05 * dn(Hp, K2)), lp(K2, A2, 1.05, s * 0.035 * dn(K2, A2)), lp(K2, A2, 1.05, s * 0.0), lp(K2, A2, 0.0, s * 0.0), lp(Hp, K2, -0.1, s * 0.0)], '#000', 0.45, s * 0.015], [[lp(Hp, K2, 0.05, -s * 0.05 * dn(Hp, K2)), lp(Hp, K2, 0.8, -s * 0.035 * dn(Hp, K2)), lp(Hp, K2, 0.8, -s * 0.012 * dn(Hp, K2)), lp(Hp, K2, 0.05, -s * 0.02 * dn(Hp, K2))], '#ffffff', 0.15, s * 0.01]]);
    if (o.look) for (let k = 0; k < 4; k++) { const q = lerp(K2, Hp, 0.05 + k * 0.06); X0.crease(f, [add(q, mul(nb, -s * 0.03)), add(add(q, mul(nb, -s * 0.005)), mul(E.norm(sub(A2, K2)), s * 0.01)), add(q, mul(nb, s * 0.02))], Math.max(1.6, s * 0.005), { col: '#0e0e0c', lit: mix(lk.fill, '#fff', 0.3), op: 0.55 }); } // the hose bunched behind the knee
    { const tk = E.norm(sub(A2, Hp)); f.line([add(add(K2, mul(nb, s * 0.03)), mul(tk, -s * 0.03)), add(K2, mul(nb, s * 0.04)), add(add(K2, mul(nb, s * 0.03)), mul(tk, s * 0.03))], Math.max(1.4, s * 0.004), mix(lk.fill, '#fff', 0.4), { op: 0.45 }); } // the kneecap's lit edge
    f.line([lp(K2, A2, 0.15, s * 0.0), lp(K2, A2, 0.85, s * 0.0)].map(q => add(q, mul(nb, s * 0.018))), Math.max(1, s * 0.003), mix(lk.fill, '#fff', 0.4), { op: 0.35 }); // the shin bone's front
    f.flat(ell(add(A2, mul(nb, s * 0.008)), s * 0.009, s * 0.007, 0, 7), mix(lk.fill, '#fff', 0.35), { op: 0.45 }); // the ankle bone
    if (o.bare) livid(f, lerp(K2, A2, 0.5), s * 0.02, s * 0.05, 3, s / 400);
    if (o.dirt) X0.stains(f, d, [Math.min(K2[0], A2[0]) - 40, Math.min(K2[1], A2[1]) - 40, Math.max(K2[0], A2[0]) + 40, Math.max(K2[1], A2[1]) + 40], '#14130e', 0.05, 3, -1.4, Math.round(K2[0]) % 83, 0.5);
  });
  // the foot: a dead foot falls slack (plantar flexed): the toes run on from the shin, turned toward the body's front
  let fd = E.norm(add(mul(rot([1, 0], sa), 0.75), mul(o.front, 0.65))); if (fd[1] < -0.2) fd = E.norm(add(fd, [0, 1.3])); // a dead foot falls toward the floor
  const fn = [-fd[1], fd[0]], fl = s * 0.115, sd = -(Math.sign(fn[0] * rot([1, 0], sa)[0] + fn[1] * rot([1, 0], sa)[1]) || 1);
  const FT = (u, w) => add(add(A2, mul(fd, u * fl)), mul(fn, w * s * sd));
  const foot = [FT(-0.12, -0.022), FT(0.1, -0.026), FT(0.45, -0.024), FT(0.78, -0.02), FT(0.98, -0.01), [...FT(1.04, 0.004), 1], FT(0.96, 0.016), FT(0.7, 0.022), FT(0.45, 0.016), FT(0.2, 0.024), FT(-0.08, 0.03), FT(-0.22, 0.012)];
  if (o.shoe) { f.part(foot, { fill: P.leatherD, shadow: '#0e0d0a', shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: 1.4, cast: false }); f.line([foot[0], foot[1], foot[2]].map(q => add(q, mul(fn, s * 0.004 * sd))), 1.4, P.leatherL, { op: 0.4 }); }
  else { f.part(foot, X0.SK(f, { fill: o.far ? mix(skin, '#000', 0.25) : skin, cast: false, maxShade: s * 0.02 })); for (let i = 0; i < 4; i++) f.line([FT(0.72 + i * 0.07, -0.02), FT(0.76 + i * 0.07, 0.0), FT(0.74 + i * 0.07, 0.014)], 1, '#1e1c18', { op: 0.6 }); f.line([FT(0.92, 0.006), FT(1.0, 0.004)], Math.max(2, s * 0.005), '#3e3e3a', { op: 0.8 }); f.flat(ell(FT(-0.05, 0.01), s * 0.012, s * 0.009, 0, 7), P.skinL, { op: 0.35 }); }
  FX.icicle(add(A2, mul(fd, fl * 0.5)), s * 0.03, s * 0.008);
  return { K: K2, A: A2 };
}
function deadBodyDraw(f, FX, o) {
  const s = o.s, d0 = dir(o.a), n0 = [-d0[1], d0[0]], bend = o.bend || 0;
  const cen = u => add(add(o.pel, mul(d0, u * s)), mul(n0, bend * u * u * s * 1.4));
  const tan = u => E.norm(add(d0, mul(n0, bend * u * 2.8))), nrm = u => { const t = tan(u); return [-t[1], t[0]]; };
  const at = (u, w) => add(cen(u), mul(nrm(u), w * s));
  const skin = mix(P.skin, P.skinD, R(f, 0, 0.3)), col = o.col || P.linen;
  const CL = (x = {}) => Object.assign({ fill: col, shadow: mix(col, '#0e0e0c', 0.7), shade: 0.42, tex: 'weave' + f.o.seed, texOp: 0.55, maxShade: s * 0.05, inkW: 1.5, inkHeavy: 2.4, cast: true, castOp: 0.45 }, x);
  const stain = (dd, pts) => { const bb = E.bbox(pts); X0.stains(f, dd, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], '#1c1a12', 0.05, 3, -1.5, Math.round(bb[0] + bb[1]) % 97, 0.6); X0.stains(f, dd, [bb[0] - 10, bb[1] - 10, bb[2] + 10, bb[3] + 10], P.mouldD, 0.04, 3, -1.9, Math.round(bb[0] * 3 + bb[1]) % 89, 0.5); };
  // cloth hangs by gravity: folds start on the cloth's upper side and run toward the ground; a few drag folds at the belt
  const folds = (dd, pts, n) => { const bb = E.bbox(pts); clipDraw(f, dd, () => { for (let i = 0; i < n; i++) { const q = [R(f, bb[0], bb[2]), R(f, bb[1], bb[1] + (bb[3] - bb[1]) * 0.6)], l = s * R(f, 0.06, 0.14), sw = R(f, -0.35, 0.35); const pts2 = [q, add(q, [Math.sin(sw) * l * 0.5 + R(f, -3, 3), l * 0.5]), add(q, [Math.sin(sw) * l, l])]; f.stroke(pts2, Math.max(2.4, s * 0.009), '#0d0d0b', { op: 0.5 }); f.line(pts2.map(p => add(p, [-2.5, -1])).slice(0, 2), Math.max(1, s * 0.003), mix(col, '#fff', 0.35), { op: 0.4 }); } }); };
  const front = nrm(0.2), up = front[1] < 0; // which way the body's front faces
  const legSpec = o.legs || [{ ta: o.a + Math.PI, sa: o.a + Math.PI }, { ta: o.a + Math.PI + 0.1, sa: o.a + Math.PI + 0.1 }];
  const armSpec = o.arms || [{ ua: Math.PI / 2, fa: Math.PI / 2, wa: Math.PI / 2 }, { ua: Math.PI / 2, fa: Math.PI / 2, wa: Math.PI / 2 }];
  const HN = at(-0.03, 0.01), HFp = at(-0.02, -0.025), SN = at(0.35, 0.005), SF = at(0.355, -0.02); // the shoulders high on the ribcage (ruler pass), so the ribs show under the arm
  const legLook = far => o.dress === 'tunic' ? CL({ fill: far ? mix(o.hose || P.woolD, '#000', 0.25) : (o.hose || P.woolD), cast: false, maxShade: s * 0.04 }) : null;
  if (o.dress === 'shroud') {
    // wrapped in grave linen, bound: one wrapped shape from the crown through the bent knees to the feet
    const K2 = add(HN, rot([s * 0.25, 0], legSpec[0].ta)), A2 = add(K2, rot([s * 0.235, 0], legSpec[0].sa)), hc = add(at(0.42, 0), rot([s * 0.075, 0], o.hA));
    const C = X0.spline([add(hc, rot([s * 0.06, 0], o.hA)), at(0.4, 0), at(0.25, 0), at(0.05, 0), K2, lerp(K2, A2, 0.6), add(A2, rot([s * 0.05, 0], legSpec[0].sa))], 6), n = C.length;
    const W = C.map((_, i) => { const t = i / (n - 1); return s * (t < 0.08 ? 0.09 + t * 0.6 : t < 0.18 ? 0.13 - (t - 0.08) * 0.25 : t < 0.42 ? 0.16 + Math.sin((t - 0.18) * 13) * 0.012 : t < 0.68 ? 0.15 - (t - 0.42) * 0.14 : 0.11 - (t - 0.68) * 0.17) * R(f, 0.97, 1.03); });
    const outl = X0.ribbon(C, W), sD = f.part(outl, CL({ castOp: 0.6 })); stain(sD, outl); folds(sD, outl, 4);
    { // ruler pass: the wrapped body's own value plan and the ribcage and shoulder pressing through the linen
      const Lk = f.L, ln = i => { const dd = E.norm(sub(C[Math.min(n - 1, i + 1)], C[Math.max(0, i - 1)])); return [-dd[1], dd[0]]; }, ls = i => Math.sign(ln(i)[0] * Lk[0] + ln(i)[1] * Lk[1]) || 1;
      const band = (sg, a0, a1, op, col2) => { const A = [], Bq = []; for (let i = 0; i < n; i++) { const m = mul(ln(i), ls(i) * sg); A.push(add(C[i], mul(m, W[i] * a0))); Bq.push(add(C[i], mul(m, W[i] * a1))); } return [[...A, ...Bq.reverse()], col2, op, s * 0.018]; };
      softTone(f, sD, [band(1, 0.6, 0.12, 0.26, '#ffffff'), band(-1, 0.65, 0.05, 0.5, '#000')]);
      clipDraw(f, sD, () => { for (let k = 0; k < 4; k++) { const i = Math.round(n * (0.2 + k * 0.045)); if (i < 1 || i >= n - 1) continue; const dd = E.norm(sub(C[i + 1], C[i - 1])), m = ln(i); crease(f, [add(C[i], mul(m, -W[i] * 0.4)), add(add(C[i], mul(m, 0)), mul(dd, -s * 0.012)), add(add(C[i], mul(m, W[i] * 0.42)), mul(dd, -s * 0.03))], Math.max(2, s * 0.005), { col: '#121210', lit: mix(col, '#fff', 0.35), op: 0.4 }); } });
    }
    for (let i = 3; i < n - 2; i += Math.round(n / 6)) { const dd = E.norm(sub(C[i + 1], C[i - 1])), nn = [-dd[1], dd[0]]; f.line([add(C[i], mul(nn, W[i] * 0.53)), add(add(C[i], mul(dd, 4)), mul(nn, 0)), add(C[i], mul(nn, -W[i] * 0.53))], Math.max(2.4, s * 0.008), '#26261f'); f.line([add(C[i], mul(nn, W[i] * 0.5)), add(C[i], mul(nn, -W[i] * 0.5))].map(q => add(q, mul(dd, -2))), 1, P.linenL, { op: 0.5 }); }
    FX.rime(X0.offsetLine(C, t => -W[Math.round(t * (n - 1))] * 0.45).filter((_, i) => i % 3 === 0 && i < n * 0.8), Math.max(4, s * 0.01), 1);
    return { at, hc };
  }
  // far limbs first
  deadLeg(f, FX, HFp, legSpec[1].ta, legSpec[1].sa, s, { far: true, front, look: legLook(true), skin, shoe: o.feet === 'shoe', bare: o.dress !== 'tunic' });
  deadArm(f, FX, SF, armSpec[1].ua, armSpec[1].fa, armSpec[1].wa, s, { far: true, skin, flip: true, sleeve: o.dress === 'tunic' ? 0.95 : 0.45, roll: o.dress === 'shift', cloth: CL({ fill: mix(col, '#000', 0.2) }) });
  deadLeg(f, FX, HN, legSpec[0].ta, legSpec[0].sa, s, { front, look: legLook(false), skin, shoe: o.feet === 'shoe', bare: o.dress !== 'tunic', dirt: true });
  // the torso (ruler pass): buttock, small of the back, belly, the ribcage's edge, ribcage, shoulder blade, chest; the
  // belly sags toward the floor when the body lies face down and hollows under the ribs when it lies on its back
  const Lk = f.L, nT = nrm(0.2), lsd = Math.sign(nT[0] * Lk[0] + nT[1] * Lk[1]) || 1; // +1: the front faces the key light
  const gsd = nrm(0.12)[1] > 0.15 ? 1 : nrm(0.12)[1] < -0.15 ? -1 : 0; // +1: the belly hangs toward the floor
  const bly = gsd > 0 ? 0.024 : gsd < 0 ? -0.014 : 0.004;
  // one torso outline whose profile carries the anatomy: the buttock, the pinch of the waist, the belly (sagging or
  // hollow), the ribcage's barrel with the step of its lower edge, the shoulder blade's hump at the back, the chest
  const sag = (u, w) => { const p = at(u, w), low = (w > 0) === (gsd > 0) && gsd !== 0; return low ? add(p, [0, s * 0.016 * Math.exp(-(((u - 0.1) / 0.1) ** 2))]) : p; };
  const FR = [[-0.1, 0.045], [-0.05, 0.07], [0.01, 0.075], [0.06, 0.076 + bly], [0.11, 0.074 + bly], [0.155, 0.07 + bly * 0.5], [0.185, 0.084], [0.215, 0.1], [0.26, 0.11], [0.3, 0.106], [0.34, 0.092], [0.375, 0.068], [0.405, 0.046]];
  const BK = [[-0.1, 0.07], [-0.05, 0.104], [0.0, 0.098], [0.05, 0.07], [0.1, 0.058], [0.15, 0.064], [0.2, 0.08], [0.25, 0.092], [0.29, 0.104], [0.33, 0.112], [0.36, 0.1], [0.39, 0.07], [0.41, 0.046]];
  const torso = [...FR.map(([u, w]) => sag(u, w)), at(0.425, 0), ...BK.slice().reverse().map(([u, w]) => sag(u, -w)), at(-0.115, 0)];
  const tD = f.part(torso, CL({ castOp: 0.6, maxShade: s * 0.045 })); stain(tD, torso); folds(tD, torso, 1);
  const backUp = lsd < 0; // the back faces the light: shoulder blade and spine show
  const bareChest = o.bareChest ?? (o.dress === 'shift' ? f.r() < 0.8 : f.r() < 0.45);
  const skinC = mix(skin, P.frost, 0.1);
  clipDraw(f, tD, () => {
    // the shift or tunic torn open over the chest: grey skin over the ribs
    if (bareChest) {
      const edge = []; for (let i = 0; i <= 7; i++) { const u = 0.36 - i * 0.028; edge.push([...at(u, (i % 2 ? 0.0 : 0.028) + R(f, -0.012, 0.012)), 1]); }
      const sk = [at(0.37, 0.16), ...edge, at(0.15, 0.16)];
      f.part(sk, X0.SK(f, { fill: skinC, cast: false, inkW: 0, inkHeavy: 0, maxShade: s * 0.035 }));
      livid(f, at(0.26, 0.06), s * 0.03, s * 0.03, 3, s / 400);
      f.line(edge.map(q => [q[0], q[1]]), Math.max(2.2, s * 0.006), '#0e0e0c', { op: 0.85 }); // the torn edge of the cloth
      f.line(edge.map(q => add([q[0], q[1]], mul(nrm(0.26), -s * 0.006))), Math.max(1, s * 0.003), mix(col, '#fff', 0.35), { op: 0.5 });
      f.line([at(0.37, 0.088), at(0.3, 0.092), at(0.22, 0.088)], Math.max(1.4, s * 0.004), '#1e1c18', { op: 0.45 }); // the sternum's edge
      f.line([at(0.395, 0.07), at(0.37, 0.04), at(0.36, 0.0)], Math.max(1.6, s * 0.005), '#1e1c18', { op: 0.5 }); // the collarbone
      f.line([at(0.388, 0.072), at(0.364, 0.044)].map(q => add(q, mul(Lk, s * 0.004))), Math.max(1, s * 0.003), P.skinL, { op: 0.55 });
    }
    // value plan: the side toward the light lit, the side away in core shadow, the hollows darkest
    softTone(f, tD, [
      [[at(-0.13, lsd * 0.14), at(0.44, lsd * 0.14), at(0.44, lsd * 0.05), at(-0.13, lsd * 0.045)], '#ffffff', 0.26, s * 0.018],
      [[at(-0.13, -lsd * 0.16), at(0.44, -lsd * 0.16), at(0.44, -lsd * 0.075), at(-0.13, -lsd * 0.08)], '#000', 0.4, s * 0.016],
      [ell(at(0.12, gsd >= 0 ? 0.09 : 0.06), s * 0.045, s * 0.026, o.a, 8), '#000', gsd >= 0 ? 0.55 : 0.4, s * 0.012], // under the belly's sag, or the hollow under the ribs
      [ell(at(0.08, -0.062), s * 0.045, s * 0.02, o.a, 8), '#000', 0.35, s * 0.01], // the small of the back
      [ell(at(0.31, -0.075), s * 0.05, s * 0.026, o.a, 8), '#ffffff', backUp ? 0.3 : 0.15, s * 0.01], // the shoulder blade's lit plane
      [ell(at(0.27, 0.075), s * 0.05, s * 0.024, o.a, 8), '#ffffff', backUp ? 0.1 : 0.25, s * 0.01], // the chest's lit plane
    ]);
    // the ribcage's lower edge over the belly, and the belly's fold where it sags
    crease(f, [at(0.21, 0.1), at(0.18, 0.065), at(0.16, 0.025), at(0.155, -0.02)], Math.max(2.6, s * 0.0075), { col: '#0e0e0c', lit: bareChest ? P.skinL : mix(col, '#fff', 0.35), op: 0.65 });
    if (gsd > 0) crease(f, [at(0.0, 0.06), at(0.06, 0.084), at(0.12, 0.086), at(0.155, 0.074)], Math.max(2, s * 0.006), { col: '#0e0e0c', lit: mix(col, '#fff', 0.3), op: 0.6 });
    // the back: the spine's groove and its knuckles, the buttock's fold
    if (backUp) crease(f, [at(0.38, -0.06), at(0.3, -0.072), at(0.2, -0.062), at(0.1, -0.045), at(0.03, -0.06)], Math.max(1.8, s * 0.005), { col: '#0e0e0c', lit: mix(col, '#fff', 0.35), op: 0.5 });
    if (backUp) for (let k = 0; k < 5; k++) f.flat(ell(at(0.08 + k * 0.055, -0.078 - 0.004 * k), s * 0.009, s * 0.006, o.a, 6), mix(col, '#fff', 0.45), { op: backUp ? 0.5 : 0.3 });
    crease(f, [at(-0.02, -0.1), at(-0.03, -0.05), at(-0.06, -0.01)], Math.max(2, s * 0.006), { col: '#0e0e0c', lit: mix(col, '#fff', 0.3), op: 0.5 });
    // the ribcage: ribs sloping down toward the front, the cloth clinging to them; the edge of the ribcage over the belly
    const rw = Math.max(2.2, s * (bareChest ? 0.0075 : 0.0062));
    for (let k = 0; k < 5; k++) { const u0 = 0.205 + k * 0.035; crease(f, [at(u0 + 0.034, -0.075), at(u0 + 0.016, -0.02), at(u0 - 0.004, 0.035), at(u0 - 0.03, 0.09)], rw * (1 - k * 0.07), { col: '#121210', lit: bareChest ? P.skinL : mix(col, '#fff', 0.4), op: bareChest ? 0.75 : 0.55, litOp: 0.6 }); }
    crease(f, [at(0.37, -0.1), at(0.33, -0.06), at(0.28, -0.05), at(0.24, -0.075)], Math.max(2.4, s * 0.007), { col: '#0e0e0c', lit: mix(col, '#fff', 0.35), op: backUp ? 0.7 : 0.45 }); // the shoulder blade's edge
    for (let i = 0; i < 2; i++) f.stroke([at(0.06, -0.06 + i * 0.05), at(0.02, -0.05 + i * 0.05), at(-0.01, -0.06 + i * 0.05)], Math.max(2, s * 0.007), '#0e0e0c', { op: 0.45 });
  });
  // the skirt of the tunic or shift over the thighs, its hem hanging toward the ground
  const KN = add(HN, rot([s * 0.25, 0], legSpec[0].ta)), AN = add(KN, rot([s * 0.235, 0], legSpec[0].sa)), skEnd = o.dress === 'shift' ? lerp(KN, AN, 0.18) : lerp(HN, KN, 0.5);
  // the skirt follows the thighs as a sleeve of cloth (narrow: the thighs seen from the side), its hem sagging to the ground
  const dS = E.norm(sub(skEnd, at(0.0, 0))), nS = [-dS[1], dS[0]], ws = o.dress === 'shift' ? 0.07 : 0.072;
  const hem = []; for (let i = 0; i <= 6; i++) { const t = i / 6, q = add(skEnd, mul(nS, (t - 0.5) * s * ws * 2)); hem.push(i % 2 ? [...add(q, [R(f, -3, 3), s * R(f, 0.01, 0.025)]), 1] : add(q, [0, s * 0.015])); }
  const mid = lerp(at(0.0, 0), skEnd, 0.5), skirt = [at(0.03, 0.085), add(mid, mul(nS, s * ws * 1.1)), ...hem.slice().reverse(), add(mid, mul(nS, -s * ws * 1.1)), at(0.03, -0.09)];
  if (E.len(sub(skEnd, at(0, 0))) < s * 0.05) skirt.length = 0;
  if (skirt.length) { const skD = f.part(skirt, CL()); stain(skD, skirt); folds(skD, skirt, 4); }
  if (o.dress === 'tunic') { f.line([at(0.03, 0.085), at(0.015, 0.0), at(0.03, -0.095)], Math.max(3, s * 0.012), P.leatherD); f.line([at(0.03, 0.085), at(0.015, 0.0), at(0.03, -0.095)].map(q => add(q, [-1.5, -1.5])), 1, P.leatherL, { op: 0.4 }); }
  if (f.r() < 0.55) { const q = at(R(f, 0.1, 0.26), R(f, -0.04, 0.05)), hl = ell(q, s * 0.03, s * 0.02, o.a, 9).map(p2 => add(p2, [R(f, -2, 2), R(f, -2, 2)])); f.part(hl, X0.SK(f, { fill: skin, inkW: 1.1, cast: false, maxShade: 4 })); f.line(hl.concat([hl[0]]), 1.6, '#121210', { op: 0.6 }); livid(f, q, s * 0.02, s * 0.015, 2, s / 400); } // a rent, grey skin through it
  else { const q = at(R(f, 0.08, 0.24), R(f, -0.05, 0.04)), pt = ell(q, s * 0.035, s * 0.028, o.a + 0.3, 9).map((p2, j) => [...add(p2, [R(f, -5, 5), R(f, -5, 5)]), j % 3 ? 0 : 1]); f.part(pt, CL({ fill: mix(col, P.linenD, 0.5), cast: false, inkW: 1.1, maxShade: 4 })); f.stitches(pt.slice(0, 4), P.linenD, 0.8); } // a darned patch
  { const pr = up ? FR : BK, wAt = u => { for (let i = 1; i < pr.length; i++) if (pr[i][0] >= u) { const t = (u - pr[i - 1][0]) / (pr[i][0] - pr[i - 1][0]); return pr[i - 1][1] + (pr[i][1] - pr[i - 1][1]) * t; } return pr[pr.length - 1][1]; };
    FX.rime([0.34, 0.24, 0.14, 0.04, -0.06].map(u => sag(u, (up ? 1 : -1) * (wAt(u) - 0.006))), Math.max(4, s * 0.01), up ? 1 : -1); } // rime along the body's upper edge
  // the neck and the head lolling off it: a grey waxen face, lids shut, the jaw slack
  const NT = at(0.42, 0), H2 = s * 0.15, hc = add(NT, rot([H2 * 0.42, 0], o.hA)), hAng = o.hA + Math.PI / 2;
  f.part(K.chain([at(0.33, 0), NT, add(NT, rot([H2 * 0.1, 0], o.hA))], [s * 0.065, s * 0.055, s * 0.05]), X0.SK(f, { fill: skin, maxShade: s * 0.02 }));
  B.head(f, hc, H2, hAng, { skin, jaw: R(f, 0.95, 1.2), chin: R(f, -0.02, 0.04), nose: R(f, 0.95, 1.15), hook: R(f, 0, 0.5), mouth: 'set', blind: true, faceShade: 0.8, faceHatch: false, jawShade: 0.65, gaunt: true, age: true, noEar: false, hairCol: o.hair || mix('#3a3830', '#8a8a80', f.r()), hairBack: [[-0.46, 0.2], [-0.52, -0.16], [-0.42, -0.42], [-0.16, -0.54], [-0.26, -0.2], [-0.32, 0.1]], hair: o.bald ? undefined : [[-0.42, 0.04], [-0.44, -0.22], [-0.32, -0.44], [-0.08, -0.55], [0.16, -0.53], [0.3, -0.42], [0.18, -0.4], [0.02, -0.46], [-0.12, -0.36], [-0.22, -0.2], [-0.26, 0.0], [-0.32, 0.1]] });
  const hF = frame(hc, hAng, H2); X0.greyFace(f, hF, skin, 1);
  f.flat(hF([[0.03, -0.1], [0.18, -0.12], [0.3, -0.08], [0.28, -0.0], [0.16, 0.01], [0.04, -0.02]]), '#1c1a16', { op: 0.35 }); // the eyes sunk in their sockets
  for (const [cx, w2] of [[0.115, 0.05], [0.292, 0.024]]) f.line(hF([[cx - w2, -0.055], [cx, -0.04], [cx + w2, -0.055]]), Math.max(1.2, H2 * 0.022), '#121110');
  f.flat(hF([[0.18, 0.27], [0.25, 0.262], [0.31, 0.272], [0.3, 0.33], [0.24, 0.35], [0.19, 0.33]]), '#141210'); // the jaw dropped slack
  f.line(hF([[0.19, 0.27], [0.25, 0.262], [0.31, 0.272]]), 1.4, mix(skin, '#5a6070', 0.4), { op: 0.7 }); // grey-blue lip
  f.line(hF([[0.02, -0.22], [0.14, -0.26], [0.24, -0.22]]), Math.max(1.2, H2 * 0.018), '#e4e6dc', { op: 0.35 }); // waxen sheen on the brow
  f.line(hF([[0.14, 0.04], [0.22, 0.06]]), Math.max(1, H2 * 0.014), '#e4e6dc', { op: 0.3 }); // and the cheekbone
  livid(f, hF([[0.05, 0.12]])[0], H2 * 0.12, H2 * 0.1, 3, H2 / 140); if (f.r() < 0.5) X0.sore(f, hF([[0.0, 0.3]])[0], H2 * 0.04, { ang: hAng });
  FX.frost(hF([[0.05, -0.3]])[0], H2 * 0.1, H2 * 0.04, 4, Math.max(0.8, H2 / 90));
  // the near arm last, over the torso
  const nArm = deadArm(f, FX, SN, armSpec[0].ua, armSpec[0].fa, armSpec[0].wa, s, { skin, sleeve: o.dress === 'tunic' ? 0.7 : 0.42, roll: o.dress === 'shift', cloth: CL(), delt: true });
  // the near shoulder (ruler pass): the deltoid swells the sleeve's top; lit on its crown, a fold where it meets the arm
  if (nArm.sl) { const ua = armSpec[0].ua, dU = dir(ua), nU = [-dU[1], dU[0]], c = add(SN, mul(dU, s * 0.03)), lit2 = Math.sign(nU[0] * Lk[0] + nU[1] * Lk[1]) || 1;
    softTone(f, nArm.sl, [[ell(add(c, mul(nU, lit2 * s * 0.03)), s * 0.055, s * 0.024, ua, 8), '#ffffff', 0.3, s * 0.01], [ell(add(c, mul(nU, -lit2 * s * 0.045)), s * 0.08, s * 0.03, ua, 8), '#000', 0.5, s * 0.012]]);
    clipDraw(f, nArm.sl, () => crease(f, [add(c, add(mul(dU, s * 0.05), mul(nU, -s * 0.05))), add(c, mul(dU, s * 0.075)), add(c, add(mul(dU, s * 0.055), mul(nU, s * 0.05)))], Math.max(2, s * 0.006), { col: '#0e0e0c', lit: mix(col, '#fff', 0.3), op: 0.55 }));
  }
  return { at, hc };
}
// each body of the heap is drawn as one group so that it can throw its own shadow onto the bodies under it (offset away
// from the key light) and a dark gap round its edge, and bodies deep in the pile are toned down (o.depth 0..1)
function deadBody(f, FX, o) {
  const pp = f.part, ds = []; f.part = function (pts, oo) { const d = pp.call(this, pts, oo); ds.push(d); return d; };
  const i0 = f.out.length; let res; try { res = deadBodyDraw(f, FX, o); } finally { f.part = pp; }
  const body = f.out.splice(i0).join('\n'), sd = f.o.seed, L = f.L, k = o.s * (o.castK ?? 0.05);
  if (!f._dbf) { f._dbf = 1; f.defs.push(`<filter id="dbc${sd}" x="-15%" y="-15%" width="130%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>`); }
  const sil = ds.map(d => `<path d="${d}"/>`).join(''), clip = o.clip ? ` clip-path="url(#${o.clip})"` : '';
  f.raw(`<g${clip}><g transform="translate(${E.f1(-L[0] * k)},${E.f1(-L[1] * k)})" filter="url(#dbc${sd})" opacity="0.8" fill="#000" stroke="#000" stroke-width="8">${sil}</g><g filter="url(#dbc${sd})" opacity="0.5" fill="#000" stroke="#000" stroke-width="12">${sil}</g></g>`);
  f.raw(body);
  if (o.depth) f.raw(`<g opacity="${E.f1(Math.min(0.42, o.depth * 0.5) * 100) / 100}" fill="#0a0907">${sil}</g>`);
  return res;
}

// ---- mild perspective for vehicles: a point x (screen x at the near plane), y (screen y at the near plane), z depth.
// Points recede toward the vanishing point (cx, hy) (camera at chest height): s = D / (D + z).
function persp(cx, hy, D) { return (x, y, z = 0) => { const s = D / (D + z); return [cx + (x - cx) * s, hy + (y - hy) * s]; }; }

// timber with a sawn end and grain (kit_VIII_b habit): a plank from a to b, w wide
function plank(f, pts, look) {
  const d = f.part(pts.map(q => [q[0], q[1], 1]), Object.assign({ shade: 0.4, tex: 'grain' + f.o.seed, texOp: 0.7, inkW: 1.4 }, look));
  return d;
}
// tally marks (kit_VIII_b): groups of four strokes and a fifth across
function tally(f, p, n, s, a = 0, col = '#d8dcd4') {
  for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5, q = add(p, rot([g * s * 1.5 + k * s * 0.24, 0], a)); if (k < 4) f.line([q, add(q, rot([s * 0.05, s * 0.6], a))], Math.max(1.2, s * 0.08), col, { op: 0.85 }); else { const q0 = add(p, rot([g * s * 1.5 - s * 0.08, s * 0.42], a)); f.line([q0, add(q0, rot([s * 0.9, -s * 0.28], a))], Math.max(1.2, s * 0.08), col, { op: 0.85 }); } }
}

module.exports = Object.assign({}, X0, { R, dir, texturesB, sleeveShape, arm, leg, grip, frostEye, deadHead, animalEye, feather, plumeMass, featherHem, wing, talonFoot, insectLeg, rat, bigRat, ratBones, ratTail, shroud, corpse, deadBody, deadArm, deadLeg, angLerp, persp, plank, tally });
