// World XV, The Torn Sky, second batch: the first batch's kit (kit_XV, required and re-exported unchanged) plus the
// helpers this batch needs. The first batch's files are never edited; everything new lives here.
// Copied verbatim from world_XV.js (reviewed there, not exported by it): bareArm, bareLegRig, the looks AR/ARD/SKA/STL/
// LTH/CLB, scorch, plateLeg (the shaped leg harness of the independent review), cuirass and weld.
// Reused from kit_XV (required): godHand, leaf (gold leaf as large plates over black), fold2, formHatch, wing (the
// world_VI wing), burn, vcrack, crackV, eye, crackedHalo, standingHair, muscleArm, fullLeg, openHand, fistDetail.
// New here: gilt (a gilded form: leaf plates over black with form modelling), the 3D helpers for the Wheel of Thrones
// (an orthographic camera, affine wrapping of a face's decoration), drape (a hanging cloth panel with folds), mFist
// (B.grip plus the modelled knuckles), keyBit, chainLine, ash heap, dove.
// Lore (revised XV intro, 2026-11-23): the heaven was torn by the void's betrayal of the Mother of Courses; there was no
// war of gods. The host is her broken court (doorkeeper, herald, recorder, weigher, lamplighter, the throne's wheels,
// lions and guardian), each still doing its office.
'use strict';
const K = require('../kit');
const X = require('./kit_XV');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { P, split, side, jcut, elb, ang, R } = X;

// ================================================================ copied verbatim from world_XV.js
// a bare arm in one outline from shoulder through elbow to wrist, cut at the elbow for the rig
function bareArm(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const [c0, c1] = X.jcut(S0, E0, W0, ws[1] / 2);
  return split(f, () => f.part(X.jointLimb(S0, E0, W0, ws, Object.assign({ point: 0.35, mus0: 0.14, mus1: 0.22 }, o)), Object.assign({ maxShade: ws[1] * 0.3 }, look)), [['upperarm' + sfx, c0], ['forearm' + sfx, c1]]);
}
// a bare leg from hip to toes in one outline (kit fullLeg), cut at the knee and the ankle; extra() draws on it before
// the cut (greaves, burns) so they follow the same bones
function bareLegRig(f, Hp, Kn, A, s, wH, wK, look, sfx, o = {}) {
  const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  const i0 = f.out.length; const pts = X.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o); if (o.extra) o.extra(pts); const body = f.out.splice(i0).join('\n');
  const put = (bone, regs) => { let g = body; for (const r of regs) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; } f.bone(bone); f.raw(g); };
  put('thigh' + sfx, [side(Kn, mul(de, -1), wK / 2)]);
  put('shin' + sfx, [side(Kn, de, wK / 2), side(A, mul(da, -1), 18)]);
  put('foot' + sfx, [side(A, da, 18)]);
  return pts;
}
// burnished gold plate (armour): bright metal, not leaf; scorch and dents are added per figure
const AR = (f, o = {}) => Object.assign({ fill: '#a07c30', shadow: '#140c04', light: '#e6c878', shade: 0.5, tex: 'mottle' + f.o.seed, texOp: 0.3 }, o);
const ARD = (f, o = {}) => AR(f, Object.assign({ fill: '#8a6a24' }, o));
const SKA = (f, o = {}) => Object.assign({ fill: '#d0c2a6', shadow: '#3e3238', light: '#f0e6d2', shade: 0.4, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o); // an angel's pale skin
const STL = (f, o = {}) => Object.assign({ fill: '#8a8890', shadow: '#24222a', light: '#c8c6ce', shade: 0.42, tex: 'mottle' + f.o.seed, texOp: 0.4 }, o); // blade steel
const LTH = (f, o = {}) => Object.assign({ fill: '#2a2428', shadow: '#0c0a0c', light: '#4a4248', shade: 0.4, tex: 'wrinkle' + f.o.seed, texOp: 0.5 }, o); // black leather
const CLB = (f, o = {}) => Object.assign({ fill: '#26222a', shadow: '#0a080c', light: '#46404a', shade: 0.4, tex: 'weave' + f.o.seed, texOp: 0.5 }, o); // black cloth
// scorch on a surface (soot from the strike)
function scorch(f, c, rx, ry, op = 0.5, a = 0) { f.flat(ell(c, rx, ry, a, 14).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.35, (f.r() - 0.5) * ry * 0.35]) : q), '#140e16', { op }); }

// ---- shaped leg harness, rebuilt in the independent review (director: the first two passes still read as stacked boxes)
// Every plate is shaped to the limb and rendered as curved metal: its top and bottom edges bow down (a hoop seen from
// above), a specular streak runs down the lit front following the taper, a core shadow and a thin reflected light run
// down the back, and each plate casts its shadow on the one it laps. The cuisse is a cone (broad at the hip, narrow at
// the knee); the cop a dome with a fluted fan on the outside of the knee; the greave swells over the calf and tapers to
// the ankle; the sabaton is lamed down the instep to its toe. Two styles so the Seraph and the Knight are not one set:
// 'seraph': slender gothic plate, a fluted cuisse, a peaked cop with a scalloped five-flute fan, a greave with a sharp
// medial ridge and a cusped top, a long pointed sabaton; 'knight': heavy rounded plate, a roped (twisted) top edge,
// three articulating lames, a round dome cop with a plain heart-shaped fan and a raised roll, a hinged and riveted
// greave, a broad blunt "bear-paw" sabaton, welds over the knee where the strike fused it.
function plateLeg(f, Hp, Kn, A, wH, wK, s, tone, style, o = {}) {
  const SER = style === 'seraph', gy = f.o.groundY, Lt = f.L;
  const nF = (a, b) => { const d = E.norm(sub(b, a)); const n = [-d[1], d[0]]; return n[0] >= 0 ? n : mul(n, -1); };
  const FP = (a, b, t, k) => add(lerp(a, b, t), mul(nF(a, b), k)); // k > 0: the front of the leg (toward the toes)
  const base = mix(SER ? '#b08a36' : '#94722a', '#000', tone);
  const L = (x = {}) => AR(f, Object.assign({ fill: base, light: SER ? '#f0d488' : '#dcc070', maxShade: wK * 0.25 }, x));
  const D = mix(base, '#000', 0.25);
  // cylinder rendering inside a plate: streak, core shadow, reflected light, along a/b with front/back edges kf(t), kb(t)
  const metal = (sh, a, b, kf, kb, t0, t1, st = {}) => X.clipDraw(f, E.smooth(sh), () => {
    const band = (u0, u1, col, op, bl) => { const P1 = [], P2 = []; for (let i = 0; i <= 8; i++) { const t = t0 + (t1 - t0) * i / 8, f0 = kf(t), b0 = kb(t); P1.push(FP(a, b, t, b0 + (f0 - b0) * u0)); P2.push(FP(a, b, t, b0 + (f0 - b0) * u1)); } X.softTone(f, E.smooth(sh), [[[...P1, ...P2.reverse()], col, op, bl]]); };
    band(0.7, 0.86, '#fff6d8', st.spec ?? 0.75, wK * 0.04 + 1); // the specular streak on the lit front
    band(0.5, 0.66, '#fff0c0', 0.25, wK * 0.06 + 1);
    band(0.1, 0.36, '#140a02', st.core ?? 0.55, wK * 0.06 + 1); // the core shadow
    band(0.0, 0.07, '#e6c878', 0.25, 2); // reflected light on the back edge
    if (st.extra) st.extra();
  });
  const rolled = (pts, w) => { f.line(pts, w + 2.4, INK, { op: 0.8 }); f.line(pts, w, mix(base, '#fff', 0.25)); f.line(pts.map(q => add(q, mul(Lt, w * 0.25))), Math.max(1, w * 0.3), '#fff6d8', { op: 0.7 });
    if (!SER) for (let i = 1; i < pts.length; i++) { const q0 = pts[i - 1], q1 = pts[i]; for (let k = 0; k < 4; k++) { const q = lerp(q0, q1, k / 4), d = E.norm(sub(q1, q0)), n = [-d[1], d[0]]; f.line([add(q, mul(n, w * 0.45)), add(add(q, mul(d, w * 0.5)), mul(n, -w * 0.45))], 1.1, INK, { op: 0.6, straight: true }); } } }; // a roped edge
  // the knee's geometry is shared by the greave (its cast shadow) and the cop
  const cbK = t => -wH * (0.3 - t * 0.05) * (1 - t * 0.2);
  const fn = () => {
    // ---------------- the greave (shin bone), drawn first so the cop and the lames lap over it
    const gf = t => wK * (SER ? 0.44 - 0.14 * t + (t > 0.9 ? (t - 0.9) * 1.2 : 0) : 0.48 - 0.14 * t + (t > 0.9 ? (t - 0.9) * 1.4 : 0));
    const gb = t => -wK * (0.48 + 0.24 * Math.sin(Math.PI * Math.min(1, t / 0.62)) * (t < 0.62 ? 1 : 0) + (t >= 0.62 ? -0.12 * (t - 0.62) / 0.3 : 0) - (t > 0.92 ? (t - 0.92) * 1.6 : 0)) * (SER ? 0.95 : 1.06);
    const gT = [], gB = [];
    for (let i = 0; i <= 12; i++) { const t = 0.06 + 0.9 * i / 12; gT.push(FP(Kn, A, t, gf(t))); gB.push(FP(Kn, A, t, gb(t))); }
    const topBow = [FP(Kn, A, 0.06, gf(0.06)), FP(Kn, A, SER ? 0.0 : 0.1, (gf(0.06) + gb(0.06)) * 0.5 + (SER ? wK * 0.14 : 0)), FP(Kn, A, 0.06, gb(0.06))];
    const botBow = [FP(Kn, A, 0.96, gb(0.96)), FP(Kn, A, 1.0, (gf(0.96) + gb(0.96)) * 0.5), FP(Kn, A, 0.96, gf(0.96))];
    const gv = [...gT, botBow[2], botBow[1], botBow[0], ...gB.slice().reverse(), topBow[1]];
    f.part(gv, L({ maxShade: wK * 0.3 }));
    metal(gv, Kn, A, gf, gb, 0.04, 0.98, { extra: () => {
      X.softTone(f, E.smooth(gv), [[ell(FP(Kn, A, 0.32, -wK * 0.38), wK * 0.18, wK * 0.3, Math.atan2(A[1] - Kn[1], A[0] - Kn[0]), 12), '#fff0c0', 0.3, wK * 0.08]]); // the calf's swell catching light
      scorch(f, FP(Kn, A, 0.84, 0), wK * 0.45, wK * 0.6, 0.5); X.dent(f, FP(Kn, A, 0.45, wK * 0.1), wK * 0.14, 0.3);
      if (o.burn !== false) X.burn(f, FP(Kn, A, 0.24, -wK * 0.3), Math.atan2(A[1] - Kn[1], A[0] - Kn[0]) + 0.3, wK * 1.3, wK * 0.03 + 1, { depth: 2 });
    } });
    if (SER) { const rg = []; for (let i = 0; i <= 8; i++) { const t = 0.08 + 0.86 * i / 8; rg.push(FP(Kn, A, t, gf(t) * 0.55)); } f.line(rg, 2.6, INK, { op: 0.6 }); f.line(rg.map(q => add(q, mul(Lt, 2.2))), 2.2, '#fff6d8', { op: 0.7 }); } // the medial ridge
    else { const hg = []; for (let i = 0; i <= 6; i++) { const t = 0.1 + 0.8 * i / 6; hg.push(FP(Kn, A, t, gb(t) * 0.86)); } f.line(hg, 1.8, INK, { op: 0.55 }); for (const t of [0.22, 0.7]) { const q = FP(Kn, A, t, gb(t) * 0.86); f.part(ell(q, wK * 0.07, wK * 0.12, 0, 8), L({ fill: D, maxShade: 3, cast: false, inkW: 1.2 })); } for (const t of [0.15, 0.5, 0.85]) f.rivet(FP(Kn, A, t, gf(t) * 0.7), wK * 0.035 + 1.2, '#a07c30'); } // hinge and rivets
    rolled([FP(Kn, A, 0.95, gb(0.95)), botBow[1], FP(Kn, A, 0.95, gf(0.95))], SER ? 3 : 5);
    // ---------------- the sabaton (foot bone)
    const ax = A[0], h = gy - A[1], toe = SER ? 1.5 : 1.22, X0 = u => ax + u * s;
    const sole = [[X0(-0.42), gy - 2], [X0(toe), gy - (SER ? h * 0.18 : 2)]];
    const sab = [[X0(-0.36), A[1] + h * 0.1], [X0(0.22), A[1] - 2], [X0(0.55), A[1] + h * 0.28], [X0(0.9), gy - h * 0.42], [X0(toe - 0.12), gy - h * (SER ? 0.26 : 0.36)], [X0(toe), gy - (SER ? h * 0.16 : h * 0.12), 1], [X0(toe - 0.04), gy - 1], [X0(-0.38), gy - 1], [X0(-0.46), gy - h * 0.4]];
    f.part(sab, L({ fill: mix(base, '#000', 0.08), maxShade: s * 0.12 }));
    X.clipDraw(f, E.smooth(sab), () => { X.softTone(f, E.smooth(sab), [[[[X0(-0.5), gy - h * 0.2], [X0(toe), gy - h * 0.1], [X0(toe), gy + 4], [X0(-0.5), gy + 4]], '#140a02', 0.55, 6], [[[X0(0.2), A[1] + h * 0.1], [X0(toe - 0.1), gy - h * 0.34], [X0(toe - 0.2), gy - h * 0.2], [X0(0.3), A[1] + h * 0.35]], '#fff6d8', 0.45, 5]]); scorch(f, [X0(0.5), gy - h * 0.2], s * 0.4, h * 0.3, 0.5); });
    const nl = SER ? 4 : 3; // the lames down the instep, each lapping the one in front of it
    for (let i = nl - 1; i >= 0; i--) { const u0 = 0.18 + i * (toe - 0.5) / nl, u1 = u0 + (toe - 0.5) / nl + 0.06, y = u => A[1] + (gy - h * 0.3 - A[1]) * Math.min(1, (u - 0.1) / (toe - 0.2)) - 2;
      const lm = [[X0(u0), y(u0) - 4], [X0(u1), y(u1) - 4], [X0(u1 + 0.02), gy - h * 0.12], [X0(u0 + 0.03), gy - h * 0.14]];
      f.line([[X0(u0), y(u0) - 4], [X0(u0 + 0.04), gy - h * 0.14]], 3, '#140a02', { op: 0.5 }); f.line([[X0(u0 + 0.02), y(u0) - 2], [X0(u1), y(u1) - 2]], 1.8, '#fff6d8', { op: 0.6 }); f.rivet([X0(u0 + 0.06), (y(u0) + gy - h * 0.14) / 2], s * 0.025 + 1, '#a07c30'); }
    f.line([[X0(-0.4), gy - 3], [X0(toe - 0.06), gy - 3]], 4, '#1a1206', { op: 0.85 }); // the sole
    rolled([[X0(-0.3), A[1] + h * 0.16], [X0(0.0), A[1] + h * 0.22], [X0(0.3), A[1] + h * 0.12]], SER ? 2.4 : 4); // the ankle lame's edge
    // ---------------- the lames above the knee, then the cuisse (thigh bone) lapping them
    const cf = t => wH * (0.56 + 0.06 * Math.sin(Math.PI * t * 0.9)) * (1 - t * 0.38), cb = t => -wH * (0.3 - t * 0.05) * (1 - t * 0.2);
    const nla = SER ? 1 : 3;
    for (let i = 0; i < nla; i++) { const t0 = 0.84 + i * 0.05, t1 = t0 + 0.08; const lm = [FP(Hp, Kn, t0, cf(t0) * 1.02), FP(Hp, Kn, t0 + 0.04, (cf(t0) + cb(t0)) / 2), FP(Hp, Kn, t0, cb(t0) * 1.05), FP(Hp, Kn, t1, cb(t1) * 1.05), FP(Hp, Kn, t1 + 0.04, (cf(t1) + cb(t1)) / 2), FP(Hp, Kn, t1, cf(t1) * 1.02)];
      f.part(lm, L({ fill: mix(base, '#000', 0.1 + i * 0.05), maxShade: 5, inkW: 1.4 })); f.line([lm[0], lm[1], lm[2]].map(q => add(q, mul(Lt, 1.5))), 1.8, '#fff6d8', { op: 0.55 }); }
    const cT = [], cB = []; for (let i = 0; i <= 10; i++) { const t = 0.08 + 0.8 * i / 10; cT.push(FP(Hp, Kn, t, cf(t))); cB.push(FP(Hp, Kn, t, cb(t))); }
    const cTop = FP(Hp, Kn, 0.14, (cf(0.08) + cb(0.08)) * 0.45), cBot = FP(Hp, Kn, 0.93, (cf(0.88) + cb(0.88)) * 0.5);
    const cu = [...cT, cBot, ...cB.slice().reverse(), cTop];
    f.part(cu, L({ maxShade: wH * 0.28 }));
    metal(cu, Hp, Kn, cf, cb, 0.06, 0.92, { extra: () => {
      scorch(f, FP(Hp, Kn, 0.6, 0), wH * 0.3, wH * 0.4, 0.45); X.dent(f, FP(Hp, Kn, 0.4, wH * 0.15), wH * 0.1, 0.4);
      if (o.burn !== false) X.burn(f, FP(Hp, Kn, 0.2, wH * 0.1), Math.atan2(Kn[1] - Hp[1], Kn[0] - Hp[0]) + 0.3, wH * 1.1, wH * 0.025 + 1, { depth: 2 });
      if (SER) for (const u of [0.18, 0.42, 0.66]) { const fl = []; for (let i = 0; i <= 8; i++) { const t = 0.12 + 0.72 * i / 8; fl.push(FP(Hp, Kn, t, cb(t) + (cf(t) - cb(t)) * u)); } f.line(fl, 2.2, INK, { op: 0.5 }); f.line(fl.map(q => add(q, mul(Lt, 2.4))), 1.8, '#fff6d8', { op: 0.55 }); } // three flutes converging on the knee
      else weld(f, [FP(Hp, Kn, 0.5, cb(0.5) * 0.9), FP(Hp, Kn, 0.47, 0), FP(Hp, Kn, 0.5, cf(0.5) * 0.9)], 5, AR(f), { runs: 1 }); // the strike fused the cuisse across
    } });
    rolled([FP(Hp, Kn, 0.08, cf(0.08)), cTop, FP(Hp, Kn, 0.08, cb(0.08))], SER ? 3 : 6); // the turned (roped) top edge
    if (!SER) for (const t of [0.3, 0.6]) f.rivet(FP(Hp, Kn, t, cb(t) * 0.75), wK * 0.04 + 1.2, '#a07c30');
  };
  // ---------------- the knee, drawn after the leg on the shin bone so the cop stays whole with the lower leg: the fan,
  // then the dome
  fn.knee = () => {
    const gb = t => -wK * (0.48 + 0.24 * Math.sin(Math.PI * Math.min(1, t / 0.62)) * (t < 0.62 ? 1 : 0)) * (SER ? 0.95 : 1.06), cb = cbK;
    const dK = Math.atan2(A[1] - Kn[1], A[0] - Kn[0]), kc = FP(Hp, Kn, 0.99, wK * 0.14), kr = wK * (SER ? 0.5 : 0.56);
    const back = mul(nF(Kn, A), -1);
    { const fanC = add(kc, mul(back, kr * 0.35)), lobes = SER ? 5 : 3, R0 = kr * (SER ? 1.25 : 1.1), a0 = Math.atan2(back[1], back[0]), fan = [fanC];
      for (let i = 0; i <= lobes * 4; i++) { const t = -1 + 2 * i / (lobes * 4), aa = a0 + t * 1.15, scal = SER ? 1 - 0.12 * Math.abs(Math.sin(Math.PI * i / 4)) : 1 - 0.25 * t * t; fan.push(add(fanC, rot([R0 * scal * (1 - 0.15 * t * t), 0], aa))); }
      f.part(fan, L({ fill: D, maxShade: kr * 0.3, inkW: 1.5 }));
      X.clipDraw(f, E.smooth(fan), () => X.softTone(f, E.smooth(fan), [[ell(add(fanC, mul(Lt, kr * 0.5)), kr * 0.6, kr * 0.4, 0, 12), '#fff0c0', 0.35, kr * 0.15]]));
      for (let i = 1; i < lobes; i++) { const aa = a0 - 1.15 + 2.3 * i / lobes; f.line([add(fanC, rot([kr * 0.3, 0], aa)), add(fanC, rot([R0 * 0.85, 0], aa))], 2, INK, { op: 0.55 }); f.line([add(fanC, rot([kr * 0.3, 0], aa + 0.05)), add(fanC, rot([R0 * 0.82, 0], aa + 0.05))], 1.4, '#fff6d8', { op: 0.5 }); }
      if (!SER) rolled(fan.slice(2, -1), 3.4); }
    const cop = SER ? [add(kc, rot([0, -kr * 1.15], dK - Math.PI / 2)), add(kc, rot([kr * 0.95, -kr * 0.2], dK - Math.PI / 2)), add(kc, rot([kr * 0.2, kr * 1.15], dK - Math.PI / 2)), add(kc, rot([-kr * 0.85, kr * 0.15], dK - Math.PI / 2))].map((q, i) => i % 2 ? q : [...q, 1]) : ell(kc, kr, kr * 0.92, dK, 22);
    f.part(cop, L({ maxShade: kr * 0.45 }));
    X.clipDraw(f, E.smooth(cop), () => X.softTone(f, E.smooth(cop), [[ell(add(kc, mul(Lt, kr * 0.38)), kr * 0.36, kr * 0.28, 0, 12), '#fffaf0', 0.8, kr * 0.1], [ell(add(kc, mul(Lt, -kr * 0.45)), kr * 0.75, kr * 0.5, dK, 14), '#140a02', 0.55, kr * 0.15], [ell(add(kc, mul(Lt, -kr * 0.95)), kr * 0.5, kr * 0.12, dK + Math.PI / 2, 10), '#e6c878', 0.3, 3]]));
    if (SER) { f.line([add(kc, rot([0, -kr * 1.1], dK - Math.PI / 2)), kc, add(kc, rot([kr * 0.18, kr * 1.1], dK - Math.PI / 2))], 2.2, INK, { op: 0.6 }); f.line([add(kc, rot([kr * 0.06, -kr], dK - Math.PI / 2)), add(kc, rot([kr * 0.08, -kr * 0.1], dK - Math.PI / 2))], 1.6, '#fffaf0', { op: 0.7 }); }
    else { f.line(ell(kc, kr * 0.72, kr * 0.66, dK, 22).concat([ell(kc, kr * 0.72, kr * 0.66, dK, 22)[0]]), 2.4, INK, { op: 0.45 }); f.line(ell(add(kc, mul(Lt, 1.6)), kr * 0.72, kr * 0.66, dK, 22).slice(16, 22), 1.6, '#fff6d8', { op: 0.6 }); }
    f.rivet(add(kc, mul(back, kr * 0.62)), wK * 0.035 + 1.2, '#a07c30');
    if (o.fused) { weld(f, [FP(Hp, Kn, 0.86, cb(0.86) * 1.1), add(kc, mul(back, kr * 0.9)), FP(Kn, A, 0.12, gb(0.12) * 1.05)], 6, AR(f), { runs: 1 }); f.line([add(kc, mul(back, kr * 0.95)), FP(Kn, A, 0.1, gb(0.1))], 2, P.vio, { op: 0.7 }); }
  };
  return fn;
}
// A shaped cuirass on a spine S: the breastplate swells over the chest and narrows to the waist, the pectorals beaten
// into it, a medial ridge; below it three curved fauld lames overlapping downward over the belly and hips. o.w scales
// the widths; o.after(clipD) draws scorch, dents and burns inside the breastplate.
function cuirass(f, S, o = {}) {
  const k = o.w ?? 1, L = (x = {}) => AR(f, Object.assign({ maxShade: S.H * 0.35 }, x));
  for (let i = 2; i >= 0; i--) { // the faulds, lowest first so each upper lame laps over the one below
    const v0 = 0.64 + i * 0.085, v1 = v0 + 0.13, wv = v => (0.5 + (v - 0.6) * 0.55) * k;
    const top = [], bot = []; for (let j = 0; j <= 8; j++) { const u = -1 + j / 4; top.push(S.at(u * wv(v0) * 1.02, v0 + 0.025 * (1 - u * u))); bot.push(S.at(u * wv(v1) * 1.04, v1 + 0.035 * (1 - u * u))); }
    const lm = [...top, ...bot.reverse()];
    f.part(lm, L({ fill: i % 2 ? '#8a6a24' : '#a07c30', maxShade: 10, inkW: 1.6 }));
    f.line(top.slice(1, -1).map(q => add(q, [0, 3])), 2, '#f6dc90', { op: 0.5 });
    for (const u of [-0.7, 0.75]) f.rivet(S.at(u * wv(v0), v0 + 0.05), S.H * 0.018 + 1, '#a07c30');
    X.clipDraw(f, E.smooth(lm), () => { scorch(f, S.at(-0.3 + i * 0.2, v1 - 0.02), S.H * 0.3, S.H * 0.06, 0.5); });
  }
  const bp = S.shape([[0.0, 0.58 * k, 0.48 * k], [0.12, 0.7 * k, 0.72 * k], [0.26, 0.7 * k, 0.82 * k], [0.4, 0.62 * k, 0.7 * k], [0.54, 0.52 * k, 0.54 * k], [0.66, 0.5 * k, 0.5 * k], [0.72, 0.52 * k, 0.52 * k]]);
  const d = E.smooth(bp);
  f.part(bp, L());
  X.clipDraw(f, d, () => {
    X.softTone(f, d, [[[S.at(-0.8, 0.0), S.at(-0.25, 0.0), S.at(-0.3, 0.8), S.at(-0.8, 0.8)], '#140a02', 0.5, S.H * 0.08], [ell(S.at(0.4, 0.2), S.H * 0.24, S.H * 0.13, 0.3, 14), '#fff6d0', 0.55, S.H * 0.06], [ell(S.at(-0.05, 0.2), S.H * 0.2, S.H * 0.12, 0.3, 14), '#fff0c0', 0.3, S.H * 0.06], [[S.at(0.0, 0.32), S.at(0.7, 0.32), S.at(0.6, 0.42), S.at(0.0, 0.4)], '#140a02', 0.45, S.H * 0.04], [[S.at(-0.5, 0.5), S.at(0.5, 0.5), S.at(0.45, 0.72), S.at(-0.5, 0.72)], '#140a02', 0.3, S.H * 0.06]]);
    X.crease(f, [S.at(-0.05, 0.12), S.at(0.15, 0.31), S.at(0.42, 0.34), S.at(0.68, 0.26)], S.H * 0.016 + 1, { col: '#2a1a0a', lit: '#fff0c0' }); // under the pectorals
    f.line([S.at(0.16, 0.04), S.at(0.18, 0.3), S.at(0.2, 0.6)], S.H * 0.012 + 1, INK, { op: 0.5 }); f.line([S.at(0.2, 0.04), S.at(0.22, 0.3), S.at(0.24, 0.58)], S.H * 0.01 + 1, '#f6dc90', { op: 0.55 }); // medial ridge
    X.formHatch(f, [S.at(-0.6, 0.04), S.at(-0.66, 0.3), S.at(-0.56, 0.6)], S.H * 0.12, { op: 0.4 });
    if (o.after) o.after(d);
  });
  f.line(S.shape([[0.0, 0.58 * k, 0.48 * k], [0.12, 0.7 * k, 0.72 * k]]).slice(0, 2), 2.4, '#f6dc90', { op: 0.5 }); // the rolled neck edge
  return bp;
}
// a weld where the strike fused two plates into one: a raised, rippled bead of melted gold along the seam, dark at its
// foot, bright on its crown, with short runs hanging off it
function weld(f, pts, w, look, o = {}) {
  const C = X.spline(pts, 3).map((q, i) => add(q, [0, Math.sin(i * 1.7) * w * 0.12]));
  f.stroke(C, w * 1.8 + 6, '#140c04', { op: 0.55 }); // the scorched foot of the bead
  f.stroke(C, w + 4, INK, { op: 0.85 });
  f.stroke(C, w, look.fill);
  for (let i = 2; i < C.length - 2; i += 3) f.flat(ell(C[i], w * 0.6, w * 0.45, f.r() * 3, 8), look.light, { op: 0.35 }); // ripples
  for (let i = 1; i < C.length - 1; i += 2) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, w * 0.45)), add(add(C[i], mul(d, w * 0.3)), mul(n, -w * 0.4))], 1, look.shadow, { op: 0.6, straight: true }); }
  f.line(C.slice(1, -1).map(q => add(q, mul(f.L, -w * 0.25))), Math.max(0.8, w * 0.25), look.light, { op: 0.7 });
  for (let k = 0; k < (o.runs ?? 2); k++) { const q = C[Math.floor(R(f, 0.15, 0.85) * C.length)]; X.fusedRun(f, q, R(f, 8, 22) * (w / 6), Math.max(2.5, w * 0.55), look); }
}

// ================================================================ new for the second batch
const GILT = (f, o = {}) => X.GL(f, Object.assign({ texOp: 0.22 }, o)); // gilt flesh or gilt stone
const FACE = [[-0.30, -0.40], [-0.08, -0.52], [0.18, -0.47], [0.31, -0.31], [0.355, -0.13], [0.315, -0.05], [0.33, 0.08], [0.33, 0.21], [0.305, 0.29], [0.32, 0.37], [0.29, 0.47], [0.13, 0.535], [-0.06, 0.47], [-0.21, 0.27], [-0.30, 0.08], [-0.37, -0.13]]; // B.head's face outline
// A gilded form: the part, gold leaf laid over black in plates (kit_XV leaf: whole across the form, black only in the
// cracks between plates, at chipped edges and in recesses), then form modelling inside it: a soft core shadow on the
// side away from the light, a burnished light on the lit side, form hatching along the shadow contour. Never flat
// yellow, never a spotted pattern.
// ---- independent review: form modelling by crescents. f.L points TOWARD the key light. The region of a shape left
// uncovered by a copy of itself shifted toward the light is a crescent on the shadow side; shifted away from the light,
// a crescent on the lit side. Blurred and clipped to the shape these give a real value range on any form: the lit
// plane, the core shadow (terminator) and, inside it at the very edge, reflected light; a narrow specular band inset
// from the lit edge. (The first gilt() set its dark blob toward f.L, i.e. on the LIT side, which flattened every gilt
// form in the batch: the root of the director's "flat yellow paint".)
function blurId(f, bl) { bl = Math.max(1, Math.round(bl)); const id = `sb${f.o.seed}_${bl}`; f._sb = f._sb || {}; if (!f._sb[id]) { f._sb[id] = 1; f.defs.push(`<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${bl}"/></filter>`); } return id; }
function crescentD(pts, dx, dy, bb, pad = 400) { return `M${(bb[0] - pad).toFixed(1)},${(bb[1] - pad).toFixed(1)} H${(bb[2] + pad).toFixed(1)} V${(bb[3] + pad).toFixed(1)} H${(bb[0] - pad).toFixed(1)} Z ` + E.smooth(pts.map(q => [q[0] + dx, q[1] + dy, q[2] || 0])); }
function model(f, pts, o = {}) {
  const d = E.smooth(pts), bb = E.bbox(pts), sz = o.sz ?? Math.min(bb[2] - bb[0], bb[3] - bb[1]), L = o.L || f.L;
  const lay = (k, col, op, bl) => op > 0 ? `<path d="${crescentD(pts, L[0] * k * sz, L[1] * k * sz, bb)}" fill-rule="evenodd" fill="${col}" opacity="${op}" filter="url(#${blurId(f, bl)})"/>` : '';
  let g = '';
  g += lay(o.core ?? 0.36, o.darkCol || '#100804', o.dark ?? 0.55, sz * 0.07 + 2); // the core shadow
  g += lay(o.deep ?? 0.16, o.darkCol || '#100804', o.dark2 ?? 0.25, sz * 0.04 + 1.5); // deepening toward the turn
  g += lay(o.edge ?? 0.05, o.reflCol || '#9a7634', o.refl ?? 0.32, sz * 0.015 + 1); // reflected light on the shadow edge
  g += lay(-(o.litK ?? 0.42), o.litCol || '#e8c46e', o.lite ?? 0.3, sz * 0.08 + 2); // the lit plane
  const id = f.id('cl'); f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
  let spec = '';
  if ((o.spec ?? 0.32) > 0) { const id2 = f.id('cl'); f.defs.push(`<clipPath id="${id2}"><path d="${E.smooth(pts.map(q => [q[0] - L[0] * sz * 0.04, q[1] - L[1] * sz * 0.04, q[2] || 0]))}"/></clipPath>`); spec = `<g clip-path="url(#${id2})">${lay(-0.12, o.specCol || '#fff2cc', o.spec ?? 0.32, sz * 0.012 + 1)}</g>`; }
  f.raw(`<g clip-path="url(#${id})">${g}${spec}</g>`);
  return d;
}
// a blurred cast shadow of pts on whatever lies under it (drawn before the occluder), offset away from the light by k
function castOn(f, pts, k, op = 0.45, clip = null, bl = null) {
  const s = `<path d="${E.smooth(pts.map(q => [q[0] - f.L[0] * k, q[1] - f.L[1] * k, q[2] || 0]))}" fill="#0a0604" opacity="${op}" filter="url(#${blurId(f, bl ?? k * 0.35 + 2)})"/>`;
  if (clip) { const id = f.id('cl'); f.defs.push(`<clipPath id="${id}"><path d="${typeof clip === 'string' ? clip : E.smooth(clip)}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${s}</g>`); } else f.raw(s);
}
// the batch's gilt: kit_XV's leaf plates over black (black only in the cracks between plates, chips and recesses) on a
// form modelled by model(). o.sz: the form's thickness for the modelling (a limb's width; default the bbox's short side)
function gilt(f, pts, o = {}) {
  const bb = E.bbox(pts), sz = o.sz ?? Math.min(bb[2] - bb[0], bb[3] - bb[1]);
  const lk = {}; for (const [k, v] of Object.entries(o.look || {})) if (v !== undefined) lk[k] = v;
  const look = GILT(f, Object.assign({ maxShade: o.maxShade ?? Math.min(60, sz * 0.22 + 4) }, lk));
  const d = f.part(pts, look);
  X.leaf(f, pts, { cell: o.cell ?? Math.max(24, sz * 0.5), s: o.s ?? Math.max(0.45, Math.min(1.2, sz / 140)), chips: o.chips ?? 3, open: o.open ?? 0.14, nB: 1, recess: o.recess, burnish: false });
  if (o.model !== false) model(f, pts, { sz, dark: o.dark ?? 0.55, lite: o.lite ?? 0.3, core: o.core, litK: o.litK, refl: o.refl, spec: o.spec, L: o.L });
  if (o.hatch) X.formHatch(f, o.hatch, o.hatchLen ?? sz * 0.18, { op: 0.4 });
  return d;
}
// The batch's gold, toned (director, 2026-11-24: "drop the overall gold saturation and brightness so it sits with batch
// 1's Shattered God, not as a saturated yellow"): every gold-hued colour the figure emitted (its own and kit_XV's
// helpers') is pulled down in saturation and value, once, after the build. Hue is kept; creams under 0.3 saturation
// (the leaf's lit lips), violet, bone, grey and the rubric red are untouched. f.out keeps its length, so the rig marks
// stay valid.
function toneGold(f, kS = 0.86, kV = 0.9) {
  const cache = {};
  const T = h => {
    if (cache[h]) return cache[h];
    const r = parseInt(h.slice(1, 3), 16) / 255, g = parseInt(h.slice(3, 5), 16) / 255, b = parseInt(h.slice(5, 7), 16) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn, s = mx ? dl / mx : 0;
    let H = 0; if (dl) H = mx === r ? ((g - b) / dl) % 6 : mx === g ? (b - r) / dl + 2 : (r - g) / dl + 4; H *= 60; if (H < 0) H += 360;
    let out = h;
    if (H >= 24 && H <= 58 && s > 0.3 && mx > 0.12) {
      const s2 = s * kS, v2 = mx * (mx > 0.4 ? kV : 1), c = v2 * s2, x = c * (1 - Math.abs(((H / 60) % 2) - 1)), m = v2 - c;
      const [r1, g1, b1] = H < 60 ? [c, x, 0] : [x, c, 0];
      out = '#' + [r1 + m, g1 + m, b1 + m].map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
    }
    return (cache[h] = out);
  };
  const re = /#[0-9a-fA-F]{6}\b/g;
  for (let i = 0; i < f.out.length; i++) f.out[i] = f.out[i].replace(re, T);
  for (let i = 0; i < f.defs.length; i++) f.defs[i] = f.defs[i].replace(re, T);
  return f;
}
// A lidded, wet, deep-set eye (void world): the socket a soft hollow (its upper wall in the brow's shadow, its lower
// wall catching light), the brow's fold above it, kit_XV's eyeball (wet sclera with violet veins, striated iris, pupil),
// then a thick upper lid laid over it with its margin, crease and lit bulge, the lid's shadow on the ball, a lower lid
// with a waterline glint, a pale tear duct at the inner corner, and a second, long wet highlight. c: centre, s: half
// width of the opening, a: the face's angle; o.open 0..1, o.gaze, o.iris, o.lid (look), o.socket (depth 0..1).
function deepEye(f, c, s, a = 0, o = {}) {
  const F = frame(c, a, s), op = o.open ?? 0.6, lid = o.lid || GILT(f), top = -0.42 * op - 0.06, dk = o.dark || '#0e0804';
  const sk = F(ell([0.02, -0.12], 1.9, 1.35, 0, 22));
  X.softTone(f, E.smooth(sk), [[F(ell([0, -0.32], 1.75, 0.9, 0, 18)), dk, 0.62 * (o.socket ?? 1), s * 0.22 + 1], [F(ell([0.15, 0.55], 1.3, 0.45, 0, 14)), o.litCol || '#e8cc8a', 0.32, s * 0.15 + 1]]);
  X.crease(f, F([[-1.5, -0.55], [-0.6, -1.12], [0.4, -1.14], [1.35, -0.7]]), Math.max(1.2, s * 0.09), { col: dk, lit: o.litCol || '#f0d89a', op: 0.7 }); // the brow's fold over the socket
  X.eye(f, c, s, a, { lid, open: op, gaze: o.gaze, iris: o.iris, mass: false, inkW: o.inkW ?? Math.max(0.8, s * 0.04), white: o.white || '#d8d0bc', lower: false });
  // the upper lid: a thick band from its margin up to the crease, modelled, overhanging the ball
  const mg = [[-1.04, 0.05], [-0.6, top * 0.85 - 0.02], [0, top - 0.04], [0.55, top * 0.9 - 0.03], [1.05, -0.02]];
  const cr = [[1.12, -0.12], [0.6, top - 0.36], [0, top - 0.46], [-0.6, top * 0.85 - 0.36], [-1.12, -0.06]];
  const lidSh = F([...mg, ...cr]);
  f.flat(F(mg.map(([x, y]) => [x, y + 0.2])).concat(F(mg.slice().reverse().map(([x, y]) => [x, y - 0.02]))), '#120a10', { op: 0.5 }); // the lid's shadow on the ball
  f.part(lidSh, Object.assign({}, lid, { cast: false, maxShade: s * 0.18, inkW: Math.max(0.8, s * 0.05), inkHeavy: Math.max(1, s * 0.08), hatch: false }));
  f.line(F([[-0.7, top - 0.3], [0, top - 0.42], [0.65, top - 0.32]]), Math.max(0.7, s * 0.07), o.litCol || '#f4dea4', { op: 0.55 }); // the lid's lit bulge
  f.stroke(F(mg), Math.max(1.2, s * 0.15), INK); // the lid margin
  f.line(F(mg.slice(1, 4).map(([x, y]) => [x, y - 0.05])), Math.max(0.6, s * 0.035), '#fff6e0', { op: 0.55 }); // wet glint on the margin
  // lower lid and waterline; the tear duct at the inner corner
  f.part(F([[-0.95, 0.12], [-0.4, 0.42], [0.3, 0.44], [0.98, 0.1], [0.9, 0.3], [0.3, 0.66], [-0.4, 0.64], [-1.0, 0.3]]), Object.assign({}, lid, { cast: false, maxShade: s * 0.12, inkW: Math.max(0.6, s * 0.035), inkHeavy: 0, hatch: false }));
  f.line(F([[-0.8, 0.2], [-0.3, 0.38], [0.3, 0.38], [0.85, 0.14]]), Math.max(0.7, s * 0.06), '#fffaf0', { op: 0.6 });
  f.flat(F(ell([-1.0, 0.1], 0.13, 0.1, 0, 8)), '#9c8ea4', { op: 0.8 });
  f.flat(F(ell([-0.05, -0.02], 0.3, 0.06, -0.3, 10)), '#fffaf0', { op: 0.35 }); // the long wet highlight across the ball
  if (o.lashes) for (let i = 0; i < 7; i++) { const q = F([[-0.75 + i * 0.25, top * (1 - Math.abs(-0.75 + i * 0.25) * 0.2) - 0.04]])[0], d2 = rot([0, -s * 0.22], a + (i - 3) * 0.08); f.line([q, add(q, d2)], Math.max(0.6, s * 0.03), INK, { op: 0.7 }); }
  return F;
}
// ---------------------------------------------------------------- lion anatomy (independent review)
// Shared by the Fourfold Beast and the Throne Lion, after the Plague Wolf and Magma Hound habits (muscled segments that
// overlap at the joints, a point at the elbow and the hock, weight-bearing paws), done in gilt over black.
// A muscle mass: a K.chain through pts with bellies, gilt and modelled across its own width.
function muscle(f, pts, ws, o = {}) {
  const sh = K.chain(pts, ws, { steps: o.steps ?? 10, bp: o.bp || [], bq: o.bq || [] });
  gilt(f, sh, Object.assign({ sz: o.sz ?? ws.reduce((a, b) => a + b, 0) / ws.length, cell: o.cell, s: o.s, chips: o.chips ?? 1, look: o.look, dark: o.dark ?? 0.55 }, o.g || {}));
  return sh;
}
// A planted lion's paw seen from the side and a little above, toes forward (+x): the heel or the carpal pad at the back,
// the broad foot, four toes (the far ones higher and smaller, each a knuckled pad flat on the ground with a crease
// between it and the next), claws sheathed (o.claws: 'tip' shows their points, 'metal' fused metal claws out). P: the
// ground point under the middle of the paw, s: the paw's length. Returns the paw outline.
function lionPaw(f, P, s, o = {}) {
  const gy = P[1], X0 = u => P[0] + u * s, look = o.look || {};
  const dim = o.dim ?? 0;
  const fill = mix(look.fill || GILT(f).fill, '#000', dim);
  if (o.carpal) gilt(f, [[X0(-0.62), gy - s * 0.18], [X0(-0.7), gy - s * 0.42], [X0(-0.5), gy - s * 0.5], [X0(-0.4), gy - s * 0.24]], { look: { fill: mix(fill, '#000', 0.15) }, sz: s * 0.2, chips: 0, cell: s * 0.3, s: 0.4 }); // the carpal pad behind the wrist
  const foot = [[X0(-0.5), gy - 2, 1], [X0(-0.56), gy - s * 0.3], [X0(-0.4), gy - s * 0.6], [X0(-0.05), gy - s * 0.72], [X0(0.32), gy - s * 0.6], [X0(0.52), gy - s * 0.36], [X0(0.56), gy - 2, 1]];
  gilt(f, foot, { look: { fill }, sz: s * 0.6, cell: s * 0.4, s: Math.max(0.4, s / 260), chips: 1 });
  // the toes: far to near, each a knuckle over a pad, set on the ground
  const toes = o.toes || [[0.06, -0.3, 0.86], [0.2, -0.18, 0.92], [0.32, -0.08, 1.0], [0.42, 0.0, 1.06]];
  toes.forEach(([u, lift, k], i) => {
    const w = s * 0.25 * k, hgt = s * 0.36 * k, cx = X0(u + 0.1), by = gy - s * (lift < 0 ? -lift * 0.35 : 0);
    const t = [[cx - w * 0.55, by - 1, 1], [cx - w * 0.62, by - hgt * 0.5], [cx - w * 0.3, by - hgt * 0.95], [cx + w * 0.22, by - hgt], [cx + w * 0.6, by - hgt * 0.6], [cx + w * 0.66, by - hgt * 0.2], [cx + w * 0.58, by - 1, 1]];
    castOn(f, t, w * 0.12, 0.35, foot);
    gilt(f, t, { look: { fill: mix(fill, '#000', (3 - i) * 0.06) }, sz: w, cell: w * 0.8, s: Math.max(0.3, w / 180), chips: 0, core: 0.4 });
    X.crease(f, [[cx - w * 0.5, by - hgt * 0.45], [cx - w * 0.36, by - hgt * 0.2], [cx - w * 0.4, by - 2]], Math.max(1.2, w * 0.05), { col: '#0a0604', lit: '#e6ca88', op: 0.75 }); // the cleft behind the toe
    f.line([[cx - w * 0.15, by - hgt * 0.86], [cx + w * 0.3, by - hgt * 0.8]], Math.max(0.8, w * 0.04), '#f0dca4', { op: 0.5 }); // the knuckle's lit top
    if (o.claws === 'tip' && i > 0) f.part([[cx + w * 0.5, by - hgt * 0.32], [cx + w * 0.86, by - hgt * 0.1], [cx + w * 0.56, by - hgt * 0.06]].map(q => [...q, 1]), { fill: '#c8c0ae', shadow: '#3a3430', shade: 0.3, inkW: 1, cast: false, maxShade: 2 });
    if (o.claws === 'metal') { const cl = [[cx + w * 0.42, by - hgt * 0.5], [cx + w * 1.1, by - hgt * 0.16], [cx + w * 1.12, by - 1, 1], [cx + w * 0.5, by - hgt * 0.14]]; f.part(cl, X.GR(f, { fill: '#6a6870', light: '#c8c6d0', maxShade: 3, cast: false, inkW: 1.2 })); f.line([lerp(cl[0], cl[1], 0.1), lerp(cl[0], cl[1], 0.9)], 1.2, '#e0dee6', { op: 0.6 }); if (i % 2) X.fusedRun(f, lerp(cl[0], cl[1], 0.6), w * 0.18, Math.max(2.5, w * 0.06), X.GR(f, { fill: '#8a8890', light: '#d8d6e0' })); }
  });
  f.flat(ell([X0(0.05), gy + 1], s * 0.75, Math.max(3, s * 0.03), 0, 14), '#000', { op: 0.45 });
  return foot;
}
// A carved mane lock: a tapering tongue of hair from root heading a, bending, its tip turned into a stiff curl (o.curl
// +1/-1 sets which way; 0 a plain pointed lock); an incised groove down it, a lit edge on the side toward the light, the
// shadow it casts on the locks under it. Gilt leaf over black, modelled across its width.
function maneLock(f, root, a, len, w, o = {}) {
  const bend = o.bend ?? 0.25, cs = o.curl ?? 1, N = 10, C = [];
  for (let i = 0; i <= N; i++) { const t = i / N, aa = a + bend * t * t * (o.bs ?? 1); C.push(add(root, rot([len * t, 0], a + bend * t * t))); }
  const wt = t => w * (t < 0.3 ? 0.62 + 0.38 * Math.sin(t / 0.3 * Math.PI / 2) : 1 - (t - 0.3) * 0.85);
  const Pp = [], Q = [];
  C.forEach((p, i) => { const t = i / N, d = E.norm(sub(C[Math.min(N, i + 1)], C[Math.max(0, i - 1)])), n = [-d[1], d[0]]; Pp.push(add(p, mul(n, wt(t) / 2))); Q.push(add(p, mul(n, -wt(t) / 2))); });
  const e = C[N], de = E.norm(sub(C[N], C[N - 1])), ne = [-de[1], de[0]], r = w * 0.3;
  let tip;
  if (cs) { const cc = add(e, mul(ne, cs * r * 0.5)); tip = []; for (let k = 0; k <= 8; k++) { const t = -Math.PI / 2 * cs + k / 8 * Math.PI * 1.3 * cs; tip.push(add(cc, rot([r * Math.cos(t) * 1.05, r * Math.sin(t)], Math.atan2(de[1], de[0])))); } }
  else tip = [[...add(e, mul(de, w * 0.4)), 1]];
  const sh = cs > 0 ? [...Pp, ...tip.slice().reverse(), ...Q.reverse()] : [...Pp, ...tip, ...Q.reverse()];
  if (o.cast !== false) castOn(f, sh, w * 0.16, 0.38, o.castClip || null);
  gilt(f, sh, { look: o.look || { fill: o.fill }, sz: w * 1.3, cell: w * 1.1, s: Math.max(0.3, w / 150), chips: 0, dark: o.dark ?? 0.42, lite: 0.28, core: 0.3 });
  const g = C.slice(1, N - 1).map((p, i) => add(p, mul([-de[1], de[0]], (o.groove ?? 0.08) * w * Math.sin(i))));
  X.crease(f, g, Math.max(1.2, w * 0.07), { col: '#0a0604', lit: '#f0d898', op: 0.75 }); // the incised groove
  if (cs) { const cc = add(e, mul(ne, cs * r * 0.5)), sp = []; for (let k = 0; k <= 12; k++) { const t = k / 12 * 4.6 * cs, rk = r * 0.8 * (1 - k / 14); sp.push(add(cc, [Math.cos(t) * rk, Math.sin(t) * rk])); } f.line(sp, Math.max(1, w * 0.06), '#0a0604', { op: 0.8 }); } // the curl's spiral cut
  return sh;
}
// A carved lion's head in three-quarter view, facing +x. Frame: x along the head toward the nose, y down, unit s (the
// head's length, back of the skull to the nose). o.open: the jaw's drop (0..1); o.eye: 'living' (a deep gold eye under
// the brow) or 'blank' (a smooth carved stone eye); o.jaw / o.head: bone names (the jaw is drawn first, under the
// head); o.chip: teeth chipped; o.fill: the gilt. Stern: a heavy knotted brow drawn down over the eye, the nose wrinkled
// back, a short broad muzzle with whisker pads, the upper lip's flews hanging over the gape, canines, a chin with its
// tuft. Returns { F, nose, jawF }.
function lionHead(f, c, s, a, o = {}) {
  const F = frame(c, a, s), op = o.open ?? 0.6, fill = o.fill || GILT(f).fill, G = (x = {}) => ({ look: Object.assign({ fill }, x) });
  const hinge = [-0.16, 0.1], ja = op * 0.42, JF = pts => F(pts.map(q => { const v = rot(sub(q, hinge), ja); return [hinge[0] + v[0], hinge[1] + v[1], q[2] || 0]; }));
  // ---- the mouth's inside (head bone), then the lower jaw (jaw bone) over it
  if (o.head) f.bone(o.head);
  f.flat(F([[-0.12, 0.06], [0.18, 0.1], [0.44, 0.2], [0.54, 0.22]]).concat(JF([[0.5, 0.3], [0.1, 0.24], [-0.14, 0.16]])), '#0c0604');
  f.flat(F([[0.0, 0.12], [0.3, 0.18]]).concat(JF([[0.3, 0.27], [0.02, 0.24]])), '#2a1408', { op: 0.6 }); // the palate's ridges in the dark
  if (o.jaw) f.bone(o.jaw);
  const jaw = JF([[-0.26, 0.1], [0.06, 0.2], [0.34, 0.26], [0.5, 0.3], [0.52, 0.38], [0.44, 0.47], [0.2, 0.49], [-0.06, 0.42], [-0.22, 0.3]]);
  f.part(JF([[0.02, 0.24], [0.36, 0.26], [0.32, 0.3], [0.04, 0.29]]), { fill: mix(fill, '#000', 0.55), shade: 0.3, inkW: 1, cast: false, maxShade: 3 }); // the tongue, dark gold
  gilt(f, jaw, Object.assign({ sz: s * 0.22, cell: s * 0.2, s: Math.max(0.35, s / 700), chips: 1, dark: 0.6 }, G()));
  X.crease(f, JF([[0.0, 0.4], [0.2, 0.43], [0.38, 0.4]]), Math.max(1.2, s * 0.008), { col: '#0a0604', lit: '#e8cc8a', op: 0.6 }); // the chin's fold
  for (const [u, l, ch] of [[0.4, 0.11, false], [0.33, 0.045, false], [0.28, 0.04, o.chip], [0.2, 0.05, false]]) { const q = JF([[u, 0.26]])[0], up = rot([0, -1], a + ja); const t = [add(q, rot([-s * 0.022, 0], a + ja)), add(q, rot([s * 0.022, 0], a + ja)), [...add(q, mul(up, s * l * (ch ? 0.45 : 1))), 1]]; f.part(t, X.BN(f, { fill: '#d8cca8', maxShade: 2, cast: false, inkW: 1.1, hatch: false })); if (ch) f.line([t[2], add(t[2], rot([s * 0.02, s * 0.006], a))], 1.4, INK); } // the lower canines and incisors
  for (let k = 0; k < 4; k++) maneLock(f, JF([[0.12 + k * 0.08, 0.44]])[0], a + ja + 1.75 - k * 0.12, s * (0.12 + k * 0.02), s * 0.06, { fill: mix(fill, '#000', 0.12), curl: k % 2 ? 1 : -1, bend: 0.3, cast: false }); // the chin's tuft
  // ---- the skull, the cheeks and the muzzle (head bone)
  if (o.head) f.bone(o.head);
  const skull = F([[-0.52, -0.12], [-0.46, -0.34], [-0.28, -0.46], [-0.04, -0.5], [0.16, -0.45], [0.27, -0.38], [0.44, -0.32], [0.56, -0.26], [0.63, -0.16], [0.63, -0.04], [0.61, 0.08], [0.57, 0.18], [0.5, 0.25], [0.42, 0.21], [0.3, 0.16], [0.18, 0.1], [0.04, 0.12], [-0.12, 0.18], [-0.34, 0.16], [-0.5, 0.06]]);
  gilt(f, skull, Object.assign({ sz: s * 0.5, cell: s * 0.28, s: Math.max(0.4, s / 600), chips: 2, dark: 0.55 }, G()));
  X.softTone(f, E.smooth(skull), [
    [F([[0.18, -0.43], [0.56, -0.29], [0.58, -0.22], [0.2, -0.33]]), '#f0d48c', 0.4, s * 0.02 + 1], // the nasal bridge, the top plane, lit
    [F([[0.18, -0.3], [0.52, -0.18], [0.5, 0.16], [0.24, 0.12], [0.12, -0.1]]), '#100804', 0.35, s * 0.03 + 1], // the muzzle's side plane, in shade under it
    [F([[-0.3, -0.42], [0.02, -0.5], [0.1, -0.4], [-0.2, -0.34]]), '#f4dea4', 0.3, s * 0.03 + 1], // the forehead's lit plane
    [F([[-0.32, -0.04], [0.02, 0.0], [0.08, 0.12], [-0.3, 0.14]]), '#100804', 0.4, s * 0.03 + 1], // under the cheekbone
    [F([[-0.3, -0.16], [0.0, -0.14], [0.02, -0.06], [-0.28, -0.06]]), '#f0d898', 0.28, s * 0.02 + 1], // the cheekbone, lit
  ]);
  // the heavy brow, knotted and drawn down; the eye deep under it
  const ec = F([[0.11, -0.28]])[0], es = s * 0.055;
  if (o.eye === 'blank') { // carved stone: a smooth lidded almond, no pupil
    const al = F([[0.04, -0.28], [0.11, -0.32], [0.19, -0.3], [0.17, -0.25], [0.09, -0.24]]);
    X.softTone(f, E.smooth(skull), [[F(ell([0.11, -0.29], 0.12, 0.07, -0.1, 14)), '#0e0804', 0.55, s * 0.015 + 1]]);
    gilt(f, al, Object.assign({ sz: es * 1.2, cell: es * 2, s: 0.3, chips: 0, dark: 0.4, lite: 0.45 }, G({ fill: mix(fill, '#fff', 0.08) })));
    f.stroke(F([[0.03, -0.29], [0.11, -0.335], [0.2, -0.3]]), Math.max(2, s * 0.012), '#0a0604');
  } else deepEye(f, ec, es, a - 0.12, { open: 0.42, gaze: [0.8, 0.1], iris: P.goldM || '#8a6a26', lid: GILT(f, { fill: mix(fill, '#000', 0.12) }), socket: 1.1 });
  const brow = F([[-0.08, -0.38], [0.06, -0.46], [0.2, -0.44], [0.29, -0.35], [0.22, -0.32], [0.1, -0.37], [-0.04, -0.34]]);
  castOn(f, brow, s * 0.025, 0.55, skull);
  gilt(f, brow, Object.assign({ sz: s * 0.08, cell: s * 0.1, s: 0.35, chips: 0, dark: 0.5, lite: 0.45 }, G({ fill: mix(fill, '#fff', 0.06) })));
  for (const u of [0.22, 0.255]) X.crease(f, F([[u, -0.46], [u - 0.01, -0.4], [u + 0.01, -0.35]]), Math.max(1.2, s * 0.008), { col: '#0a0604', lit: '#f0d898', op: 0.75 }); // the frown's knot
  // the nose leather, the nose wrinkled back in folds over the bridge
  const nose = F([[0.5, -0.25], [0.6, -0.23], [0.65, -0.15], [0.64, -0.06], [0.57, -0.04], [0.51, -0.13]]);
  gilt(f, nose, Object.assign({ sz: s * 0.08, cell: s * 0.1, s: 0.3, chips: 0, dark: 0.6 }, G({ fill: mix(fill, '#000', 0.4) })));
  f.flat(F(ell([0.6, -0.08], 0.025, 0.014, 0.4, 8)), '#0a0604');
  for (let k = 0; k < 3; k++) X.crease(f, F([[0.3 + k * 0.06, -0.39 + k * 0.025], [0.34 + k * 0.06, -0.33 + k * 0.025], [0.33 + k * 0.06, -0.27 + k * 0.025]]), Math.max(1.2, s * 0.009), { col: '#0a0604', lit: '#f0d898', op: 0.7 });
  X.crease(f, F([[0.5, -0.04], [0.4, 0.02], [0.3, 0.06], [0.2, 0.08]]), Math.max(1.4, s * 0.01), { col: '#0a0604', lit: '#f0d898', op: 0.7 }); // from the nostril back to the lip's corner
  X.crease(f, F([[-0.36, 0.08], [-0.2, 0.14], [-0.02, 0.14]]), Math.max(1.4, s * 0.01), { col: '#0a0604', lit: '#f0d898', op: 0.6 }); // the cheek's lower edge
  for (let k = 0; k < 2; k++) X.crease(f, F([[-0.26 + k * 0.1, -0.44 + k * 0.02], [-0.16 + k * 0.1, -0.47 + k * 0.02], [-0.06 + k * 0.1, -0.45 + k * 0.02]]), Math.max(1.2, s * 0.008), { col: '#0a0604', lit: '#f0d898', op: 0.55 }); // the forehead's furrows
  // the whisker pad, its rows of pits, and the upper lip's flew hanging over the gape
  const pad = F([[0.34, -0.1], [0.56, -0.05], [0.62, 0.04], [0.6, 0.15], [0.51, 0.24], [0.38, 0.2], [0.28, 0.06]]);
  castOn(f, pad, s * 0.02, 0.4, skull);
  gilt(f, pad, Object.assign({ sz: s * 0.16, cell: s * 0.14, s: 0.35, chips: 0, dark: 0.55, lite: 0.35 }, G()));
  for (let k = 0; k < 10; k++) f.flat(F(ell([0.38 + (k % 4) * 0.045, 0.0 + Math.floor(k / 4) * 0.05], 0.008, 0.006, 0, 6)), '#0a0604', { op: 0.75 });
  f.stroke(F([[0.57, 0.18], [0.5, 0.25], [0.42, 0.21], [0.3, 0.16], [0.18, 0.1], [0.06, 0.11]]), Math.max(2, s * 0.014), '#0a0604'); // the lip line, the flew hanging at the front
  // the upper teeth: the canines long, the incisors between, one chipped
  for (const [u, l, ch] of [[0.46, 0.13, o.chip], [0.53, 0.05, false], [0.36, 0.045, false], [0.24, 0.05, false]]) { const q = F([[u, u > 0.5 ? 0.2 : 0.22 - (0.46 - u) * 0.4]])[0], dn = rot([0, 1], a); const t = [add(q, rot([-s * 0.024, 0], a)), add(q, rot([s * 0.024, 0], a)), [...add(q, mul(dn, s * l * (ch ? 0.5 : 1))), 1]]; f.part(t, X.BN(f, { fill: '#e0d4b0', maxShade: 2, cast: false, inkW: 1.1, hatch: false })); f.line([lerp(t[0], t[2], 0.2), lerp(t[0], t[2], 0.7)], 1, '#fff8e8', { op: 0.6 }); if (ch) f.line([lerp(t[0], t[2], 0.95), lerp(t[1], t[2], 0.95)], 1.6, INK); }
  // ears set back in the mane
  if (o.ear !== false) { const er = F([[-0.36, -0.42], [-0.42, -0.54], [-0.34, -0.63], [-0.2, -0.62], [-0.13, -0.5]]); gilt(f, er, Object.assign({ sz: s * 0.1, cell: s * 0.1, s: 0.3, chips: 0 }, G())); X.softTone(f, E.smooth(er), [[F([[-0.3, -0.48], [-0.26, -0.6], [-0.18, -0.52]]), '#0a0604', 0.6, 2]]); if (o.earChip) { f.flat(F([[-0.33, -0.62], [-0.24, -0.68], [-0.2, -0.6], [-0.28, -0.57]]), '#2a2430'); f.line(F([[-0.33, -0.62], [-0.24, -0.68], [-0.2, -0.6]]), 1.6, '#f4e0a8', { op: 0.6 }); } }
  return { F, JF, skull, jaw, nose };
}
// ---------------------------------------------------------------- large gilt wings (independent review)
// One stiff gilt flight feather, fused by the strike: a quill and rachis, two vanes of unequal width (the leading vane
// narrow), barbs laid along the vanes at an angle toward the tip, a notch or two, the tip burnt black (o.burn, a fraction
// of the length) with a ragged boundary, a crack across the leaf; it casts a soft shadow on the feathers it lies over.
// o.emarg narrows the vanes past mid-length so the tips separate into slotted fingers.
function gFeather(f, root, a, L, W, o = {}) {
  const d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]], bend = o.bend ?? 0, N = 16, lead = o.lead ?? 0.32, em = o.emarg || 0;
  const C = []; for (let i = 0; i <= N; i++) { const t = i / N; C.push(add(add(root, mul(d, L * t)), mul(n, bend * L * t * t))); }
  const sst = (a0, b0, t) => { const x = Math.max(0, Math.min(1, (t - a0) / (b0 - a0))); return x * x * (3 - 2 * x); };
  const tk = o.tipK ?? 0.2, wt = t => W * Math.pow(Math.min(1, (t + 0.02) / 0.16), 0.6) * (t > 1 - tk ? Math.pow(Math.max(0, 1 - ((t - 1 + tk) / tk) ** 2), o.point ? 0.8 : 0.5) : 1) * (1 - t * 0.18);
  const Pp = [], Q = [];
  C.forEach((p, i) => { const t = i / N, dd = E.norm(sub(C[Math.min(N, i + 1)], C[Math.max(0, i - 1)])), nn = [-dd[1], dd[0]], w = wt(t); Pp.push(add(p, mul(nn, w * lead * (1 - em * 0.55 * sst(0.45, 0.6, t))))); Q.push(add(p, mul(nn, -w * (1 - lead) * (1 - em * 0.4 * sst(0.52, 0.66, t))))); });
  for (const t of (o.notch || [])) { const i = Math.max(2, Math.min(N - 2, Math.round(t * N))); Q[i] = lerp(Q[i], C[i], 0.6); }
  const tip = add(C[N], mul(E.norm(sub(C[N], C[N - 1])), W * 0.06));
  const out = [...Pp, [...tip, 1], ...Q.slice().reverse()];
  if (o.cast !== false) castOn(f, out, o.castK ?? W * 0.3, o.castOp ?? 0.45);
  const fill = o.fill || GILT(f).fill;
  f.part(out, GILT(f, { fill, maxShade: Math.max(2, W * 0.05), inkW: o.inkW ?? Math.max(1.1, W * 0.025), inkHeavy: Math.max(1.3, W * 0.04), cast: false, k: 0.9, texOp: 0.15, hatch: false }));
  X.clipDraw(f, E.smooth(out), () => {
    // the leading vane lit, the trailing vane in shade toward its edge (each vane curves away from the rachis)
    X.softTone(f, E.smooth(out), [[[...Pp, ...C.slice().reverse()], o.litCol || '#ecd496', 0.3, W * 0.06 + 1], [Q.map((q, i) => lerp(q, C[i], 0.45)).concat(Q.slice().reverse().map(q => add(q, mul(n, -W)))), '#100804', o.shade ?? 0.42, W * 0.08 + 1]]);
    // barbs: fine lines from the rachis out to each edge, raked toward the tip
    const nb = Math.max(4, Math.round(L / (W * 0.22)));
    for (let k = 1; k < nb; k++) { const t = 0.12 + 0.8 * k / nb, i = Math.round(t * N), p = C[i], q1 = Q[Math.min(N, i + 1)], q2 = Pp[Math.min(N, i + 1)]; f.line([p, lerp(p, q1, 1.05)], Math.max(0.6, W * 0.012), INK, { op: 0.32 }); if (k % 2) f.line([p, lerp(p, q2, 1.05)], Math.max(0.5, W * 0.01), '#fff0c8', { op: 0.35 }); }
    if (o.crack !== false) { const t = R(f, 0.3, 0.6), i = Math.round(t * N); f.line([Pp[i], add(C[i], mul(d, W * 0.1)), Q[Math.min(N, i + 1)]], Math.max(1, W * 0.025), P.blackD, { op: 0.85 }); }
    if (o.burn) { const t0 = 1 - o.burn, bd = []; for (let k = 0; k <= 8; k++) { const t = k / 8, i = Math.round(t0 * N); bd.push(add(lerp(Q[i], Pp[i], t), mul(d, (f.r() - 0.5) * W * 0.5))); } f.flat([...bd, add(tip, mul(d, W)), add(Q[N], mul(d, W))], '#16100e', { op: 0.92 }); f.line(bd, Math.max(1, W * 0.04), P.vioD, { op: 0.7 }); f.line(bd, Math.max(0.6, W * 0.015), P.vioL, { op: 0.6 }); }
    if (o.scorch) X.burn(f, C[Math.round(N * 0.25)], a + R(f, -0.2, 0.2), L * 0.6, Math.max(1.2, W * 0.035), { depth: 2, haloOp: 0.3 });
  });
  f.line(C.slice(0, N - 1), Math.max(1, W * 0.05), mix(fill, '#000', 0.5), { op: 0.7 }); // the rachis
  f.line(C.slice(1, N - 2).map(q => add(q, mul(f.L, W * 0.025))), Math.max(0.7, W * 0.022), '#fff0c8', { op: 0.6 });
  return { C, out, tip, Pp, Q };
}
// A great gilt wing on the world_VI plan, for the Fourfold Beast: leading edge S (shoulder) > Ew (elbow) > Wr (wrist) >
// T (the line of the hand); tr: which side the trailing edge lies (+1 the left of the leading edge's direction). Layers
// back to front: primaries fanned from the hand, slotted (emarginated) past mid-length, their tips burnt black (the
// pinions); secondaries along the forearm; tertials; greater coverts over the secondaries' bases; median coverts; two
// rows of lesser coverts, small and scale-like; the marginal coverts along the leading edge; the leading edge itself, a
// shaped band thick at the shoulder and the wrist (the alula standing off the wrist). Each feather is on the bone it
// grows from. o.eyes(row, q, size, a): called for chosen coverts to set an eye into them.
function bigWing(f, S, Ew, Wr, T, o = {}) {
  const tr = o.tr ?? 1, [b1, b2, b3] = o.bones, fill = o.fill || GILT(f).fill, dim = k => mix(fill, '#000', k);
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return mul([-d[1], d[0]], tr); };
  const nF = nrm(Ew, Wr), nH = nrm(Wr, T), nU = nrm(S, Ew);
  const aF = Math.atan2(nF[1], nF[0]), aH = Math.atan2(nH[1], nH[0]), aT = ang(Wr, T), aU = Math.atan2(nU[1], nU[0]);
  const Lp = o.Lp ?? E.len(sub(T, Wr)) * 1.5, Ls = o.Ls ?? Lp * 0.6, Wp = o.Wp ?? Lp * 0.11, Ws = o.Ws ?? Ls * 0.2, rake = o.rake ?? -0.32;
  const blend = (x, y, k) => Math.atan2(Math.sin(x) * (1 - k) + Math.sin(y) * k, Math.cos(x) * (1 - k) + Math.cos(y) * k);
  // primaries: outermost first (it lies under the next)
  f.bone(b3);
  const np = o.np ?? 10;
  for (let i = np - 1; i >= 0; i--) { const t = i / (np - 1), r0 = lerp(Wr, T, 0.04 + t * 0.9), a = blend(aH, aT, Math.pow(t, 0.8) * (o.spreadP ?? 0.85)) + (f.r() - 0.5) * 0.05, L = Lp * (0.7 + t * 0.34) * (o.pLen ? o.pLen(t) : 1) * R(f, 0.94, 1.04);
    gFeather(f, r0, a, L, Wp * (1 - t * 0.12), { fill: dim(0.08 + (i % 3) * 0.05), lead: 0.28, bend: tr * -0.04, emarg: t > 0.3 ? 0.55 + t * 0.4 : 0, burn: o.burnP ?? 0.22, notch: (o.notchP || []).includes(i) ? [0.62, 0.78] : [], cast: false, tipK: 0.3, point: true }); } // the outermost layer: no cast shadow (it would fall in the air)
  // secondaries, from the wrist in to the elbow (each laps the one outside it)
  f.bone(b2);
  const ns = o.ns ?? 12;
  for (let i = 0; i < ns; i++) { const t = 1 - i / (ns - 1), r0 = lerp(Ew, Wr, 0.04 + t * 0.94), a = aF + rake * tr * (1 - t * 0.4) + (f.r() - 0.5) * 0.06, L = Ls * (o.sLen ? o.sLen(t) : 1) * R(f, 0.92, 1.06);
    gFeather(f, r0, a, L, Ws, { fill: dim(0.12 + (i % 2) * 0.06), lead: 0.4, bend: tr * 0.04, burn: o.burnS ?? 0.1, notch: (o.notchS || []).includes(i) ? [0.7] : [], castK: Ws * 0.3, scorch: i === 4 }); }
  // tertials at the elbow
  f.bone(b1);
  for (let i = 0; i < (o.nt ?? 4); i++) { const t = i / 3, r0 = lerp(lerp(S, Ew, 0.55), Ew, t); gFeather(f, r0, aU + rake * tr * 1.5, Ls * (0.8 - t * 0.12), Ws * 1.1, { fill: dim(0.1), lead: 0.45, burn: 0.06 }); }
  // the greater coverts: one row of broad feathers lapping the secondaries' bases
  f.bone(b2);
  const aC = aF + rake * tr * 0.55, ng = Math.round(ns * 0.9);
  for (let i = 0; i < ng; i++) { const t = 1 - i / (ng - 1), base = add(lerp(Ew, Wr, 0.03 + t * 0.95), mul(nF, Ls * 0.06)), L = Ls * 0.46 * (1 - t * 0.12) * R(f, 0.9, 1.08);
    gFeather(f, base, aC + (f.r() - 0.5) * 0.08, L, Ws * 1.05, { fill: dim(0.06 + (i % 2) * 0.04), lead: 0.45, bend: tr * 0.05, castK: Ws * 0.4, castOp: 0.5, crack: f.r() < 0.5 }); }
  // the median and lesser coverts and the marginals: feathered masses, each with its hem of rounded tips and scalloped
  // rows inside, laid from the deepest to the leading edge so each laps the one behind and throws its shadow on it
  const covRow = (depth, sz, dk, ri) => {
    f.bone(b2);
    const hemL = [], n = 6; for (let i = 0; i <= n; i++) { const t = i / n; hemL.push(add(add(lerp(Ew, Wr, t), mul(nF, Ls * depth * (1 - t * 0.3))), mul(dir2(aC), Ls * depth * 0.2))); }
    const mass = [add(Ew, mul(nF, -(o.wE ?? Ws) * 0.2)), add(lerp(Ew, Wr, 0.5), mul(nF, -(o.wE ?? Ws) * 0.15)), add(Wr, mul(nF, -(o.wW ?? Ws) * 0.2)), ...X.featherHem(hemL.slice().reverse(), aC, sz, f, 0.5)];
    castOn(f, mass, sz * 0.35, 0.5);
    X.plumeMass(f, mass, aC, sz, GILT(f, { fill: dim(dk), maxShade: 3, cast: false, hatch: false, texOp: 0.15, inkW: 1.4, inkHeavy: 2 }), { w: Math.max(1, sz * 0.03), op: 0.6, dark: 0.3, shaft: 0.4 });
    model(f, mass, { sz: Ls * depth * 0.9, dark: 0.45, lite: 0.3, core: 0.3 });
    if (o.eyes && o.eyesAt) for (let i = 1; i < n; i++) if (o.eyesAt(ri, i, n)) { const q = lerp(lerp(Ew, Wr, i / n), hemL[i], 0.6); o.eyes(ri, q, sz * 0.42, aC); }
    return mass;
  };
  const dir2 = a => [Math.cos(a), Math.sin(a)];
  covRow(0.34, Ws * 0.9, 0.04, 1); covRow(0.22, Ws * 0.7, 0.02, 2); covRow(0.12, Ws * 0.5, 0.0, 3);
  // the leading edge: a shaped band, thick at the shoulder, the forearm lean, a knot at the wrist; the alula off the wrist
  const le = (a, b, wa, wb, bn) => { f.bone(bn); const sh = K.chain([a, lerp(a, b, 0.5), b], [wa, (wa + wb) * 0.46, wb], { steps: 10, bp: [[1, 0.5, 0.1, 0.4]] }); gilt(f, sh, { look: { fill: dim(0.0) }, sz: (wa + wb) / 2, cell: wa * 0.8, s: Math.max(0.4, wa / 160), chips: 1, dark: 0.5 }); return sh; };
  le(S, Ew, o.wS ?? Ws * 2, o.wE ?? Ws * 1.3, b1);
  le(Ew, Wr, o.wE ?? Ws * 1.3, o.wW ?? Ws * 1.1, b2);
  f.bone(b3);
  for (let i = 3; i >= 0; i--) gFeather(f, add(Wr, mul(nH, -(o.wW ?? Ws) * 0.2)), aT - tr * (0.25 + i * 0.1), Lp * (0.22 + i * 0.04), Wp * 0.8, { fill: dim(0.02), lead: 0.3, burn: 0.0, castK: Wp * 0.3 }); // the alula
  gilt(f, ell(Wr, (o.wW ?? Ws) * 0.5, (o.wW ?? Ws) * 0.42, aT, 14), { look: { fill: dim(0.0) }, sz: (o.wW ?? Ws), chips: 0, cell: 60, s: 0.5 }); // the wrist's knot
  // scapulars over the upper arm
  f.bone(b1);
  { const aS = aU + rake * tr * 1.2, hm = [add(lerp(S, Ew, 0.05), add(mul(nU, Ls * 0.3), mul([Math.cos(aS), Math.sin(aS)], Ls * 0.1))), add(lerp(S, Ew, 0.95), mul(nU, Ls * 0.22))]; const ms = [add(lerp(S, Ew, 0.02), mul(nU, -(o.wS ?? Ws) * 0.3)), add(Ew, mul(nU, -(o.wE ?? Ws) * 0.3)), ...X.featherHem(hm.slice().reverse(), aS, Ws * 0.8, f, 0.5)]; castOn(f, ms, Ws * 0.3, 0.5); X.plumeMass(f, ms, aS, Ws * 0.8, GILT(f, { fill: dim(0.03), maxShade: 3, cast: false, hatch: false, texOp: 0.15, inkW: 1.4, inkHeavy: 2 }), { w: 1.4, op: 0.6, dark: 0.3 }); model(f, ms, { sz: Ls * 0.3, dark: 0.45, lite: 0.3 }); } // the scapulars over the upper arm
  return { nF, nH, aF, aH, aT };
}
// A lion's limb in one outline from the top joint through the middle joint to the bottom (kit_XV jointLimb: a bony point
// on the outside of the bend, muscle bellies inside it), gilt and modelled, cut at the middle joint for the rig.
function lionLimb(f, A, J, Bp, ws, bones, o = {}) {
  const [c0, c1] = X.jcut(A, J, Bp, ws[1] / 2);
  return split(f, () => { const sh = X.jointLimb(A, J, Bp, ws, { point: o.point ?? 0.3, mus0: o.mus0 ?? 0.2, mus1: o.mus1 ?? 0.22, mus0At: o.mus0At }); gilt(f, sh, { look: o.look, sz: ws[1] * 1.1, cell: ws[1] * 0.6, s: Math.max(0.4, ws[1] / 200), chips: 1, dark: 0.55 }); if (o.extra) o.extra(sh); return sh; }, o.only === 1 ? [[bones[1], o.clip1 ? [c1, o.clip1] : c1]] : o.only === 0 ? [[bones[0], c0]] : [[bones[0], c0], [bones[1], c1]]);
}
// point in polygon (even-odd)
function inPoly(p, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
// A carved mane laid in rows inside a region: locks rooted on rings round a centre C (rx, ry scale the rings; ry2 below
// the centre), each pointing outward and drooping, the outer rings first so each ring nearer the face laps the one
// outside it; a lock is kept only if its root and tip lie in the region. rings: [[r, len, w], ...] outer to inner.
function maneMass(f, C, region, rings, o = {}) {
  const out = [], at = (th, r) => add(C, [Math.cos(th) * r * (o.rx ?? 1), Math.sin(th) * r * (Math.sin(th) > 0 ? (o.ry2 ?? 0.8) : (o.ry ?? 0.9))]);
  rings.forEach(([r, len, w], ri) => {
    const n = Math.max(6, Math.round(2 * Math.PI * r / (w * (o.gap ?? 0.7))));
    for (let i = 0; i < n; i++) {
      const th = (i + (ri % 2) * 0.5) / n * Math.PI * 2 + (o.rot ?? 0), root = at(th, r), down = Math.sin(th);
      const L = len * R(f, 0.82, 1.14) * (down > 0.3 ? (o.longBelow ?? 1.2) : 1), a = th + (Math.cos(th) < 0 ? 1 : -1) * (o.droop ?? 0.35) * Math.max(0, Math.cos(th) * Math.cos(th)) + R(f, -0.1, 0.1);
      if (!inPoly(root, region)) continue;
      let Lk = L; while (Lk > L * 0.5 && !inPoly(add(root, rot([Lk, 0], a)), region)) Lk *= 0.9;
      if (!inPoly(add(root, rot([Lk, 0], a)), region)) continue;
      out.push(maneLock(f, root, a, Lk, w * R(f, 0.88, 1.1), { fill: mix(o.fill || GILT(f).fill, '#000', (o.dimOuter ?? 0.12) * (rings.length - 1 - ri) / Math.max(1, rings.length - 1) + (i % 3) * 0.025), curl: f.r() < 0.15 ? 0 : (f.r() < 0.5 ? 1 : -1), bend: (Math.cos(th) < 0 ? -1 : 1) * R(f, 0.15, 0.4), castClip: o.castClip }));
    }
  });
  return out;
}
// A carved mane filling a region: lock roots on a jittered grid inside it, each lock pointing away from the face centre
// FC and drooping, the farthest drawn first so the locks nearer the face lap them (rows of scales, not rows of balls).
function maneFill(f, FC, region, o = {}) {
  const bb = E.bbox(region), st = o.step ?? 52, roots = [];
  for (let y = bb[1]; y < bb[3]; y += st * 0.8) for (let x = bb[0] + ((Math.round(y / st) % 2) * st * 0.5); x < bb[2]; x += st) { const q = [x + R(f, -0.3, 0.3) * st, y + R(f, -0.3, 0.3) * st]; if (inPoly(q, region) && !(o.skip && inPoly(q, o.skip))) roots.push(q); }
  roots.sort((p, q) => E.len(sub(q, FC)) - E.len(sub(p, FC)));
  const dmax = Math.max(...roots.map(q => E.len(sub(q, FC))));
  return roots.map((q, i) => {
    const v = sub(q, FC), dist = E.len(v), k = dist / dmax, fl = add(E.norm(v), o.flow || [-0.75, 0.3]); let a = Math.atan2(fl[1], fl[0]) + R(f, -0.12, 0.12); // outward from the face, flowing back and down
    const L = (o.len ?? 120) * (0.75 + 0.45 * k) * R(f, 0.85, 1.12), w = (o.w ?? 74) * (0.8 + 0.3 * k) * R(f, 0.88, 1.1);
    return maneLock(f, q, a, L, w, { castClip: region, fill: mix(o.fill || GILT(f).fill, '#000', (o.dimOuter ?? 0.14) * k + (i % 3) * 0.02), curl: f.r() < 0.15 ? 0 : (f.r() < 0.5 ? 1 : -1), bend: (Math.cos(a) < 0 ? -1 : 1) * R(f, 0.15, 0.4) });
  });
}
// the modelled fist: B.grip (the angle worked out from the elbow) plus knuckle heads, creases and the thumbnail
function mFist(f, c, elbow, thumbAng, s, col, o = {}) { const g = B.grip(f, c, elbow, thumbAng, s, col, o); X.fistDetail(f, g, s, col, { nail: o.nail || mix(col, '#000', 0.35), wrinkle: o.wrinkle }); return g; }
// draw() in a plane's own 2D coordinates, then carry it into the picture by the plane's affine projection: local (u,v)
// goes to O + u*U + v*V. The key light is carried into local space first so the cel shading still falls from the
// upper left after the projection.
function onPlane(f, O, U, V, draw) {
  const det = U[0] * V[1] - U[1] * V[0], Ls = f.L, Ll = E.norm([(V[1] * Ls[0] - V[0] * Ls[1]) / det, (-U[1] * Ls[0] + U[0] * Ls[1]) / det]);
  const L0 = f.L; f.L = Ll; const i0 = f.out.length; const res = draw(); f.L = L0;
  const m = `matrix(${U[0].toFixed(4)},${U[1].toFixed(4)},${V[0].toFixed(4)},${V[1].toFixed(4)},${O[0].toFixed(2)},${O[1].toFixed(2)})`;
  const body = f.out.splice(i0).join('\n'); f.raw(`<g transform="${m}">${body}</g>`);
  return res;
}
// an orthographic camera: yaw about the vertical, pitch about the horizontal; world x right, y down, z away from the
// viewer. P3 maps a 3D point to [screen x, screen y, depth]; V3 maps a direction.
function camera(o, yaw, pitch, s = 1) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const V3 = ([x, y, z]) => { const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp; return [x1 * s, y2 * s, z2 * s]; };
  const P3 = p => { const v = V3(p); return [o[0] + v[0], o[1] + v[1], v[2]]; };
  return { V3, P3 };
}
const v3 = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
// a heap of grey ash (the weighed souls): a slumped mound, flecks, a few curled flakes, a pale crust on top
function ashHeap(f, c, w, h, o = {}) {
  const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12, x = c[0] - w / 2 + w * t, y = c[1] - h * Math.pow(Math.sin(Math.PI * t), 0.8) * (0.85 + f.r() * 0.3); pts.push([x, y]); }
  pts.push([c[0] + w / 2, c[1] + 2, 1], [c[0] - w / 2, c[1] + 2, 1]);
  f.part(pts, X.GR(f, { fill: '#8a8684', light: '#c4beb6', shadow: '#2a2628', maxShade: h * 0.4, tex: 'ashtex' + f.o.seed, texOp: 0.8, cast: false }));
  X.ashCake(f, [c[0], c[1] - h * 0.55], w * 0.3, h * 0.3, 8, 0.8, 0.5);
  for (let i = 0; i < 5; i++) X.creases(f, [c[0] - w * 0.3 + i * w * 0.15, c[1] - h * 0.3], -0.3, w * 0.1, 1, '#3a3638', 0.5);
  X.ash(f, [c[0], c[1] - h], o.n ?? 8, w * 0.6, h * 2.5, 0.8);
}
module.exports = Object.assign({}, X, { bareArm, bareLegRig, AR, ARD, SKA, STL, LTH, CLB, scorch, plateLeg, cuirass, weld, GILT, FACE, gilt, mFist, onPlane, camera, v3, ashHeap, X,
  blurId, crescentD, model, castOn, toneGold, deepEye, muscle, lionPaw, maneLock, lionHead, gFeather, bigWing, inPoly, maneMass, lionLimb, maneFill });
