// World XV, The Torn Sky (Lightning + Void, Discharge). A heaven: a war of gods tore it open, the ruins float in the
// storm and something looks in through the tears. The only world whose cast was never human: angels and heaven's
// creatures, so every body is idealised human or animal anatomy broken by the courses, never a mannequin.
// Lightning (dominant) scars everything with violet branching Lichtenberg burns, fuses metal and joints and stands hair
// and feathers on end; no arcs or bolts are baked into a figure (strikes and discharges are engine effects).
// Void (second) cracks bodies open onto darkness with clean rims; eyes are expected here.
// Palette: gold leaf cracked over black, violet lightning; plus ink black, bone and grey.
// Foes face left: every figure is drawn facing right with kit.foeBase (key light upper right in drawing space) and
// flipped. Built for the rig from the start: joints first, f.bone() before every part, parts drawn whole, overlaps at
// the joints, shoulder armour on the torso. Seeds 1500 + index in the order of the brief: Shattered God 1500, Thunder
// Seraph 1501, Rift Leviathan 1502, Fallen Angel 1503, Rift Hound 1504, Storm Shade 1505, Choir of Eyes 1506,
// Skywreck Knight 1507.
'use strict';
const K = require('../kit');
const X = require('./kit_XV');
const { E, B, G, INK, TIERS } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, plate, ell, frame, Fig } = E;
const { P, split, side, jcut, elb, ang, R, tube } = X;

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

// ------------------------------------------------------------------ FALLEN ANGEL (cast, human 1.1)
// It fell in the war and kept fighting it. An angel of the host in gold armour, dented and scorched, limping: the weight
// on the near leg, the far leg trailing on its toes behind a fused, buckled greave. A sword drawn in a high forward guard
// in the near hand; the far hand clamped over a void crack in its side, black showing between the fingers. Both wings
// broken: the near one snapped at the wrist, its hand dragging the floor behind; the far one half raised, torn open.
// A cracked halo tilted behind the head. Skin of gold leaf over black (like all of heaven's flesh); violet Lichtenberg
// burns across the face and down the sword arm; hair standing from the strike.
// Rig: standard humanoid + sword (hand_n) + skirt (pelvis) + halo (head) + wing_n_1..3, wing_f_1..3 (torso).
// Motion: idle a limping stance (weight shifts, far foot dabs); attack a desperate sword strike (sword arm over and down).
function fallenAngel() {
  const CW = 820, CH = TIERS.human[1], seed = 1503;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 110, gy = f.o.groundY;
  const SKG = (o = {}) => SKA(f, o); // pale angel flesh: the burns read violet on it
  const N = [470, 214], C = [458, 318], Pv = [438, 432];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.42, 0.1);
  const EN = [414, 350], WN = [508, 300];                     // near arm: elbow down by the side, fist forward in a high guard
  const EF = [566, 330], WF = [520, 398];                     // far arm: elbow out, the hand clamped on its side
  const HN = S.at(-0.2, 1.0), KN = [476, 604], AN = [462, 760]; // near leg under it, the weight on it
  const HF = S.at(0.3, 1.0), KF = [392, 612], AF = [334, 756]; // far leg trailing, lamed
  const HC = [492, 146], hA = 0.1, neck0 = S.at(0.12, -0.04);
  const bA = -0.98, bD = [Math.cos(bA), Math.sin(bA)];
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('sword', WN, 'hand_n').joint('skirt', S.at(0, 0.84), 'pelvis').joint('halo', add(HC, [-40, -40]), 'head');
  const Wf = { S: S.at(-0.34, 0.06), E: [410, 140], W: [340, 92], T: [210, 120] };
  const Wn = { S: S.at(-0.58, 0.14), E: [360, 330], W: [300, 470], T: [150, 700] };
  for (const [k, w] of [['n', Wn], ['f', Wf]]) f.joint(`wing_${k}_1`, w.S, 'torso').joint(`wing_${k}_2`, w.E, `wing_${k}_1`).joint(`wing_${k}_3`, w.W, `wing_${k}_2`);
  const FEA = o => X.FE(f, o);

  // ---- the far wing, half raised behind it, torn: whole feathers gone, the hand bent back
  X.wing(f, Wf.S, Wf.E, Wf.W, Wf.T, { bones: ['wing_f_1', 'wing_f_2', 'wing_f_3'], tr: -1, Lp: 124, Ls: 80, Wp: 17, Ws: 19, np: 8, ns: 9, nt: 3, look: FEA({ fill: mix(P.plume, '#000', 0.25) }), skin: SKG({ fill: mix('#d0c2a6', '#000', 0.3) }), lift: true, notchP: [1, 4, 6], notchS: [2, 5, 7], rake: -0.3, wS: 30, wE: 22, wW: 16, darkTips: 0.4, spreadP: 0.45 });
  f.bone('wing_f_2'); X.burn(f, lerp(Wf.E, Wf.W, 0.3), ang(Wf.E, Wf.W) + 0.6, 50, 2, { depth: 2, clip: ell(lerp(Wf.E, Wf.W, 0.4), E.len(sub(Wf.W, Wf.E)) * 0.6, 26, ang(Wf.E, Wf.W), 16) });
  f.bone('wing_f_3'); scorch(f, lerp(Wf.W, Wf.T, 0.7), 30, 14, 0.5, ang(Wf.W, Wf.T));

  // ---- the halo, cracked into three, tilted behind the head
  f.bone('halo');
  X.crackedHalo(f, add(HC, [-34, -40]), 66, 50, -0.3, 12, [0.08, 0.45, 0.74], { drift: 9, lost: 0.4 });

  // ---- far leg, trailing: gilt flesh, a greave buckled and fused to the shin by the strike
  const greave = (Kn, A, tone, fused) => pts => {
    const g = [lp(Kn, A, 0.12, -22), lp(Kn, A, 0.1, 22), lp(Kn, A, 0.45, 23), lp(Kn, A, 0.9, 14), lp(Kn, A, 0.94, -13), lp(Kn, A, 0.45, -22)];
    f.part(g, AR(f, { fill: mix('#c69a3c', '#000', tone), maxShade: 16 }));
    X.clipDraw(f, E.smooth(g), () => { scorch(f, lp(Kn, A, 0.7, 0), 30, 50, 0.55); X.dent(f, lp(Kn, A, 0.35, 8), 10, 0.3); f.line([lp(Kn, A, 0.12, 8), lp(Kn, A, 0.9, 6)], 2, '#f6dc90', { op: 0.5 }); });
    f.rivet(lp(Kn, A, 0.18, -16), 2.2, '#a07c30'); f.rivet(lp(Kn, A, 0.8, -11), 2.2, '#a07c30');
    if (fused) { X.burn(f, lp(Kn, A, 0.4, -16), ang(Kn, A) + 0.4, 50, 2.2, { depth: 2, clip: g }); f.part([lp(Kn, A, 0.1, -22), lp(Kn, A, 0.06, 0), lp(Kn, A, 0.1, 22), lp(Kn, A, 0.16, 18), lp(Kn, A, 0.14, 0), lp(Kn, A, 0.17, -18)], AR(f, { fill: '#8a6a24', maxShade: 4, cast: false })); f.line([lp(Kn, A, 0.13, -18), lp(Kn, A, 0.11, 0), lp(Kn, A, 0.14, 18)], 2, P.vio, { op: 0.8 }); } // the top edge melted onto the knee and fused there
    // sandal straps over the instep and round the ankle
    const ax = A[0], ay = A[1];
    for (const [dx0, dx1, y0] of [[-14, 22, 4], [4, 44, 16]]) f.line([[ax + dx0, ay + y0], [ax + (dx0 + dx1) / 2, ay + y0 - 3], [ax + dx1, ay + y0 + 6]], 3.2, '#1a1418');
  };
  bareLegRig(f, HF, KF, AF, 44, 58, 42, SKG({ fill: mix('#d0c2a6', '#000', 0.2), maxShade: 12 }), '_f', { extra: greave(KF, AF, 0.2, true), nail: P.boneS });

  // ---- far arm: the upper arm in gilt flesh under the cuirass's shoulder, a vambrace, the hand over the wound
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.9), 46, 38, SKG({ fill: mix('#d0c2a6', '#000', 0.18) }), '_f', { vein: false });
  f.bone('forearm_f');
  { const vb = [lp(EF, WF, 0.25, -21), lp(EF, WF, 0.22, 21), lp(EF, WF, 0.9, 17), lp(EF, WF, 0.92, -16)]; f.part(vb, ARD(f, { maxShade: 10 })); f.line([lp(EF, WF, 0.3, -12), lp(EF, WF, 0.86, -10)], 1.6, '#f6dc90', { op: 0.5 }); }

  // ---- torso: a black arming tunic under an anatomical cuirass of gold, dented and scorched, a void crack in the side
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.38], [0.06, 0.62, 0.56], [0.2, 0.7, 0.68], [0.4, 0.62, 0.62], [0.6, 0.5, 0.52], [0.8, 0.56, 0.52], [0.98, 0.62, 0.56]]);
  f.part(torso, CLB(f));
  const cu = S.shape([[0.04, 0.6, 0.52], [0.18, 0.7, 0.7], [0.38, 0.64, 0.66], [0.56, 0.52, 0.56], [0.72, 0.54, 0.56], [0.8, 0.58, 0.58]]);
  const cuD = E.smooth(cu);
  f.part(cu, AR(f, { maxShade: 30 }));
  X.clipDraw(f, cuD, () => {
    X.softTone(f, cuD, [[[S.at(-0.7, 0.0), S.at(-0.25, 0.0), S.at(-0.3, 0.9), S.at(-0.7, 0.9)], '#1a0e06', 0.4, 10], [[S.at(0.15, 0.12), S.at(0.5, 0.14), S.at(0.4, 0.3), S.at(0.15, 0.3)], '#fff0c0', 0.4, 8]]);
    // the idealised body beaten into the plate: pectorals, the sternum's groove, the belly's segments, the iliac line
    X.crease(f, [S.at(-0.05, 0.12), S.at(0.12, 0.3), S.at(0.4, 0.32), S.at(0.6, 0.24)], 2.6, { col: '#2a1a0a', lit: '#fff0c0' });
    X.crease(f, [S.at(0.12, 0.08), S.at(0.14, 0.24), S.at(0.16, 0.46)], 1.8, { col: '#2a1a0a', lit: '#fff0c0', op: 0.6 });
    for (let i = 0; i < 3; i++) X.crease(f, [S.at(0.14, 0.45 + i * 0.08), S.at(0.3, 0.46 + i * 0.08), S.at(0.46, 0.44 + i * 0.08)], 1.6, { col: '#2a1a0a', lit: '#fff0c0', op: 0.5 });
    X.crease(f, [S.at(-0.1, 0.62), S.at(0.15, 0.72), S.at(0.38, 0.76)], 1.8, { col: '#2a1a0a', lit: '#fff0c0', op: 0.55 });
    X.stains(f, cuD, E.bbox(cu), '#140e16', 0.028, 3, -1.55, 71, 0.85); // scorch
    X.dent(f, S.at(0.3, 0.2), 16, 0.4); X.dent(f, S.at(-0.3, 0.42), 12, -0.2); X.dent(f, S.at(0.36, 0.58), 10, 0.1);
    X.burn(f, S.at(-0.4, 0.06), 0.9, 120, 3, { depth: 3 });
    f.scratches(S.at(0.1, 0.4), 40, 7, '#f6dc90', 0.9, -0.6);
    // the void crack in its side, under the far hand: clean-lipped, black inside
    X.vcrack(f, [S.at(0.4, 0.42), S.at(0.5, 0.5), S.at(0.56, 0.6), S.at(0.6, 0.7)], 9, { dark: '#2a1a0a' });
    X.crackV(f, S.at(0.5, 0.52), 2.3, 40, 4, { depth: 1, dark: '#2a1a0a' });
  });
  // shoulder guard (on the torso), belt, a strap across the back
  f.part([S.at(-0.66, 0.06), S.at(-0.3, -0.04), S.at(0.1, 0.02), S.at(0.0, 0.16), S.at(-0.5, 0.24), S.at(-0.74, 0.18)], AR(f, { fill: '#b28634', maxShade: 12 }));
  f.rivet(S.at(-0.4, 0.06), 2.6, '#c69a3c'); f.rivet(S.at(-0.12, 0.04), 2.6, '#c69a3c'); X.dent(f, S.at(-0.5, 0.12), 8, 0.2);
  f.part([S.at(-0.62, 0.76), S.at(0.58, 0.74), S.at(0.6, 0.83), S.at(-0.64, 0.85)], LTH(f, { sharp: true }));
  f.part([S.at(0.14, 0.74), S.at(0.3, 0.74), S.at(0.3, 0.84), S.at(0.14, 0.84)], AR(f, { inkW: 1.2, sharp: true, cast: false }));
  // ---- pteruges: strips of black leather tipped with gold, hanging over the thighs (skirt bone)
  f.bone('skirt');
  { const hem = X.charHem(f, S.at(-0.6, 1.36), S.at(0.62, 1.32), 7, 16, [0, 1]); const sk = [S.at(-0.56, 0.8), S.at(0.56, 0.78), S.at(0.64, 1.1), ...hem.slice().reverse(), S.at(-0.62, 1.1)]; f.part(sk, CLB(f, { maxShade: 14 })); X.clipDraw(f, E.smooth(sk), () => { for (let i = 0; i < 5; i++) X.crease(f, [S.at(-0.4 + i * 0.22, 0.9), S.at(-0.42 + i * 0.24, 1.1), S.at(-0.44 + i * 0.25, 1.3)], 2.2, { col: '#060408', lit: '#5a5060' }); }); X.charEdge(f, hem, 5, { gap: 6 }); }
  for (let i = 0; i < 9; i++) {
    const t = i / 8, top = lerp(S.at(-0.52, 0.84), S.at(0.5, 0.82), t), L = 96 + 14 * Math.sin(t * 3) + R(f, -8, 8), w = 22, sw = (t - 0.5) * 22;
    const st = [add(top, [-w / 2, 0]), add(top, [w / 2, 0]), add(top, [w / 2 + sw, L]), add(top, [-w / 2 + sw, L + (i % 3 === 1 ? -14 : 0)])].map(q => [...q, 1]);
    f.part(st, LTH(f, { fill: i % 2 ? '#2a2428' : '#342c30', maxShade: 8 }));
    const tip = [add(top, [-w / 2 + sw, L - 12]), add(top, [w / 2 + sw, L - 12]), add(top, [w / 2 + sw, L]), add(top, [-w / 2 + sw, L])].map(q => [...q, 1]);
    if (i !== 6) f.part(tip, AR(f, { inkW: 1, inkHeavy: 1.2, cast: false, maxShade: 4 }));
    f.line([add(top, [sw * 0.5, 6]), add(top, [sw, L - 16])], 1, '#5a5058', { op: 0.6 });
    if (i % 3 === 0) X.charEdge(f, [add(top, [-w / 2 + sw, L - 30]), add(top, [-w / 2 + sw * 0.8, L - 50])], 4, { violet: true, gap: 20 });
  }

  // ---- head: gilt face, burns branching across it, hair standing from the strike
  f.bone('head');
  f.part(limb(neck0, add(HC, [-14, 40]), 52, 46), SKG());
  const hd = B.head(f, HC, H, hA, { skin: '#d0c2a6', jaw: 1.05, chin: 0.01, nose: 1.0, hook: 0.1, mouth: 'set', squint: 0.45, browDown: 0.04, lips: false, faceShade: 0.8, faceHatch: false, iris: P.vioD, hairCol: '#1e1a20', browCol: '#1a1418', browW: 0.05,
    hair: [[-0.42, 0.1], [-0.5, -0.22], [-0.36, -0.5], [-0.08, -0.6], [0.2, -0.54], [0.3, -0.4], [0.1, -0.42], [-0.1, -0.34], [-0.24, -0.12], [-0.3, 0.1]] });
  const face = hd([[-0.3, -0.4], [0.18, -0.47], [0.355, -0.13], [0.33, 0.21], [0.29, 0.47], [0.13, 0.535], [-0.06, 0.47], [-0.21, 0.27], [-0.37, -0.13]]);
  X.clipDraw(f, E.smooth(face), () => {
    X.burn(f, hd([[-0.12, 0.44]])[0], hA - 0.35, 44, 1.6, { depth: 2, haloOp: 0.25, wander: 0.6 }); // a burn up the cheek from the jaw
    X.burn(f, hd([[0.02, -0.32]])[0], hA + 0.25, 30, 1.2, { depth: 2, haloOp: 0.2, wander: 0.6 }); // and one across the brow
  });
  f.line(hd([[0.06, 0.18], [0.16, 0.24]]), 1, INK, { op: 0.5 });
  { const roots = []; for (let i = 0; i < 13; i++) { const t = i / 12, q = hd([[-0.44 + t * 0.62, -0.12 - Math.sin(t * Math.PI) * 0.46 - t * 0.04]])[0]; roots.push([q, -2.5 + t * 1.5 + R(f, -0.1, 0.1)]); } X.standingHair(f, roots, 34, { pal: ['#0e0c10', '#1e1a20', '#4a4450', '#2a2430'], w: 6, gap: false }); }

  // ---- near leg, under it, the weight on it
  bareLegRig(f, HN, KN, AN, 48, 64, 46, SKG({ maxShade: 14 }), '_n', { extra: greave(KN, AN, 0, false), nail: P.black });
  f.bone('thigh_n'); X.burn(f, lp(HN, KN, 0.7, 10), 2.2, 40, 1.8, { depth: 2, clip: ell(lerp(HN, KN, 0.55), E.len(sub(KN, HN)) * 0.5, 22, ang(HN, KN), 16) });

  // ---- the near wing, snapped at the wrist: the arm drooping behind, the hand hanging and dragging on the floor
  X.wing(f, Wn.S, Wn.E, Wn.W, Wn.T, { bones: ['wing_n_1', 'wing_n_2', 'wing_n_3'], tr: 1, Lp: 120, Ls: 84, Wp: 18, Ws: 20, np: 9, ns: 10, nt: 3, look: FEA(), skin: SKG(), lift: true, notchP: [2, 5], notchS: [1, 4, 8], rake: 0.25, wS: 34, wE: 24, wW: 18, darkTips: 0.45, spreadP: 0.25 });
  f.bone('wing_n_2'); X.burn(f, lerp(Wn.E, Wn.W, 0.4), ang(Wn.E, Wn.W) - 0.6, 60, 2.2, { depth: 2, clip: ell(lerp(Wn.E, Wn.W, 0.45), E.len(sub(Wn.W, Wn.E)) * 0.6, 28, ang(Wn.E, Wn.W), 16) });
  f.bone('wing_n_3');
  X.vcrack(f, [add(Wn.W, [-10, -6]), add(Wn.W, [2, 4]), add(Wn.W, [14, 10])], 7); // the break at the wrist, black inside
  X.fusedRun(f, add(Wn.W, [6, 12]), 14, 4, SKG());

  // ---- near arm: gilt upper arm, gold vambrace, the sword in a high forward guard
  f.bone('sword');
  const g0 = add(WN, mul(bD, -26)), gd = add(WN, mul(bD, 30)), tip = add(WN, mul(bD, 380));
  f.part(limb(g0, gd, 13, 12, { steps: 6 }), LTH(f, { fill: '#4a3a30' }));
  f.part(ell(add(g0, mul(bD, -6)), 11, 9, bA, 10), AR(f, { inkW: 1.3, cast: false })); // pommel
  f.flat(ell(add(g0, mul(bD, -8)), 4, 3, bA, 8), '#ecd088', { op: 0.7 });
  for (let i = 0; i < 5; i++) f.line([lp(g0, gd, 0.1 + i * 0.18, -7), lp(g0, gd, 0.16 + i * 0.18, 7)], 1.2, '#c69a3c', { straight: true, op: 0.8 });
  const bl = [lp(gd, tip, 0, -11), lp(gd, tip, 0.82, -9), [...tip, 1], lp(gd, tip, 0.86, 8), lp(gd, tip, 0.0, 11)];
  f.part(bl, STL(f, { maxShade: 6 }));
  f.line([lp(gd, tip, 0.02, 0), lp(gd, tip, 0.8, 0)], 1.4, '#3a3840', { op: 0.7 }); // fuller
  f.line([lp(gd, tip, 0.05, -8), lp(gd, tip, 0.8, -7)], 1.4, '#e8e6ee', { op: 0.6 });
  for (const t of [0.34, 0.6]) f.flat([lp(gd, tip, t - 0.02, 9.5), lp(gd, tip, t, 4), lp(gd, tip, t + 0.03, 9)], '#4e4c54'); // notches in the edge
  X.burn(f, lp(gd, tip, 0.5, 0), bA + 0.2, 90, 1.6, { depth: 2, halo: false, clip: bl });
  f.part([lp(gd, tip, 0.012, -44), lp(gd, tip, -0.012, -40), lp(gd, tip, -0.016, 0), lp(gd, tip, -0.012, 40), lp(gd, tip, 0.012, 44), lp(gd, tip, 0.01, 30), lp(gd, tip, 0.016, 0), lp(gd, tip, 0.01, -30)].map((q, i) => i === 0 || i === 4 ? [...q, 1] : q), AR(f, { inkW: 1.4, cast: false, maxShade: 3 })); // cross-guard: a slim bar with flared quillon ends
  f.flat(ell(lp(gd, tip, 0, 0), 7, 7, 0, 10), '#e6c878', { op: 0.6 });
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.9), 50, 40, SKG(), '_n', { lit: '#e8c878', vein: false });
  f.bone('upperarm_n'); X.burn(f, lp(SN, EN, 0.2, 6), ang(SN, EN) + 0.2, 80, 2.4, { depth: 2, clip: ell(lerp(SN, EN, 0.5), E.len(sub(EN, SN)) * 0.55, 22, ang(SN, EN), 16) });
  f.bone('forearm_n');
  { const vb = [lp(EN, WN, 0.25, -22), lp(EN, WN, 0.22, 22), lp(EN, WN, 0.9, 18), lp(EN, WN, 0.92, -17)]; f.part(vb, AR(f, { maxShade: 10 })); X.clipDraw(f, E.smooth(vb), () => { scorch(f, lp(EN, WN, 0.6, 0), 24, 14, 0.5); X.dent(f, lp(EN, WN, 0.5, 6), 8, 0.2); }); f.line([lp(EN, WN, 0.3, 12), lp(EN, WN, 0.86, 10)], 1.6, '#f6dc90', { op: 0.5 }); }
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, bA, 24, '#d0c2a6', { inline: true, bend: 0, shadow: '#2e2436', tex: 'mottle' + seed, texOp: 0.4, name: 'angel sword' });
  X.fistDetail(f, gN, 24, '#d0c2a6', { nail: '#8a8070' });

  // ---- far hand, clamped over the crack in its side (back of the hand, fingers spread over the plate)
  f.bone('hand_f');
  const hf = X.openHand(f, WF, ang(EF, WF) + 0.55, 82, { look: SKG({ fill: mix('#d0c2a6', '#000', 0.1), maxShade: 8 }), back: true, flip: true, spread: 0.2, curl: 0.25, curls: [0.2, 0.3, 0.35, 0.45], nail: '#8a8070' });
  X.vcrack(f, [lerp(hf.fing[1].k1, hf.fing[2].k1, 0.5), lerp(hf.fing[1].k3, hf.fing[2].k3, 0.6)], 5, { dark: '#2a1a0a' }); // the void between the fingers
  f.bone('root');
  f.flat(ell([440, gy + 2], 210, 9, 0, 18), '#000', { op: 0.3 });
  X.leafDrift(f, [300, 700], 120, 60, 8);
  return f;
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

// ------------------------------------------------------------------ SKYWRECK KNIGHT (cast, large 1.4)
// A knight of the heavenly host who fell out of the sky in his armour. The strike and the impact fused the gold plate
// into one shell: helm, bevor and pauldrons are one hump with no neck between them, the lames are welded solid, the far
// arm is fused to his flank, and his folded wings of gold-plated feathers are melted into the backplate like a carapace.
// He charges in a hunch, knees bent, the broken lance couched under the near arm, its fore half snapped off and the
// break splintered and fused. Dents and a crater where he landed, cracks opening on violet light, burns branching over
// the plate, scorch.
// Rig: standard humanoid (the head bone moves with the fused hump: keep it small) + lance (hand_n) + tassets (pelvis).
// Motion: idle grinding metal (the torso works against the shell); attack a lance charge (lean and drive forward).
function skywreckKnight() {
  const [CW, CH] = TIERS.large, seed = 1507;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 140, gy = f.o.groundY;
  const A1 = (o = {}) => AR(f, o), A2 = (o = {}) => AR(f, Object.assign({ fill: '#9a7a2e' }, o)), A3 = (o = {}) => AR(f, Object.assign({ fill: '#7a5e22' }, o));
  const N = [546, 386], C = [460, 452], Pv = [410, 620];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.16), SF = S.at(0.5, 0.14);
  const EN = [420, 548], WN = [548, 586];                      // near arm tucked, the lance clamped in the armpit
  const EF = [600, 560], WF = [588, 664];                      // far arm fused to the flank
  const HN = S.at(-0.2, 1.0), KN = [500, 812], AN = [480, 1004];
  const HF = S.at(0.3, 1.0), KF = [330, 822], AF = [262, 1010];
  const HC = [606, 352], neck0 = S.at(0.2, -0.06);
  const lA = 0.24, lD = [Math.cos(lA), Math.sin(lA)], lB = add(WN, mul(lD, -380)), lV = add(WN, mul(lD, 70)), lX = add(WN, mul(lD, 330));
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('lance', WN, 'hand_n').joint('tassets', S.at(0, 0.86), 'pelvis');
  const ln = (t, o2) => add(lerp(lB, lX, t), mul([-lD[1], lD[0]], o2));

  // ---- the lance's butt end behind him (lance bone)
  f.bone('lance');
  const shaft = (a, b, wa, wb) => { f.part(limb(a, b, wa, wb, { steps: 10 }), Object.assign({}, X.BK(f), { fill: '#241e24', light: '#4a4048', tex: 'craze' + seed, texOp: 0.4 })); f.line([lp(a, b, 0.02, -wa * 0.28), lp(a, b, 0.98, -wb * 0.28)], 1.6, '#6a6068', { op: 0.6 }); };
  shaft(lB, WN, 20, 24);
  for (let i = 0; i < 5; i++) { const t = 0.08 + i * 0.2; f.line([ln(t * 0.5, -11), ln(t * 0.5 + 0.012, 11)], 3.4, '#9a7a2e'); f.line([ln(t * 0.5, -11), ln(t * 0.5 + 0.012, 11)], 1.2, '#ecd088', { op: 0.6 }); } // gold bands round the shaft
  // ---- far leg, back: plate over a black arming hose
  // the legs: an arming hose under shaped plate (cuisse, domed knee cop, a greave following the calf, a sabaton); the
  // knees welded half bent by the strike
  const knightLeg = (Hp, Kn, A, sfx, tone) => { const ex = plateLeg(f, Hp, Kn, A, 104, 74, 80, tone, 'knight', { fused: true }); bareLegRig(f, Hp, Kn, A, 70, 100, 70, CLB(f, { maxShade: 20 }), sfx, { extra: ex, nail: P.boneS }); f.bone('shin' + sfx); ex.knee(); };
  knightLeg(HF, KF, AF, '_f', 0.3);

  // ---- the folded wings, plated feathers melted into the back like a carapace (torso)
  f.bone('torso');
  const wingFold = (root, tipP, n, tone) => {
    for (let i = n - 1; i >= 0; i--) {
      const t = i / (n - 1), r0 = lerp(root, add(root, [-60, 40]), t), tp = add(lerp(tipP, add(tipP, [-40, -30]), t), [R(f, -8, 8), R(f, -8, 8)]);
      const d = E.norm(sub(tp, r0)), nn = [-d[1], d[0]], L = E.len(sub(tp, r0)), w = 30 + 10 * Math.sin(t * 3);
      const fe = [add(r0, mul(nn, w * 0.4)), add(add(r0, mul(d, L * 0.7)), mul(nn, w * 0.5)), add(tp, mul(nn, w * 0.2)), [...tp, 1], add(add(r0, mul(d, L * 0.8)), mul(nn, -w * 0.45)), add(r0, mul(nn, -w * 0.4))];
      f.part(fe, AR(f, { fill: mix('#a8822e', '#000', tone + (i % 2) * 0.1), maxShade: 8, inkW: 1.3 }));
      f.line([r0, lerp(r0, tp, 0.9)], 1.4, '#2a1a0a', { op: 0.6 });
      f.line([add(r0, mul(nn, -w * 0.25)), add(add(r0, mul(d, L * 0.8)), mul(nn, -w * 0.3))], 1.2, '#ecd088', { op: 0.45 });
    }
  };
  wingFold(S.at(-0.8, 0.04), [262, 700], 6, 0.3);
  wingFold(S.at(-0.62, -0.02), [290, 650], 7, 0.12);
  weld(f, [S.at(-0.7, -0.02), S.at(-0.98, 0.2), S.at(-1.06, 0.42), S.at(-1.0, 0.62)], 9, A2(), { runs: 3 }); // the wing roots melted into the backplate
  X.crackV(f, S.at(-1.0, 0.36), 1.9, 80, 6, { depth: 2, dark: '#1c1208' });
  X.burn(f, S.at(-0.9, 0.1), 1.6, 140, 3, { depth: 3, clip: S.shape([[-0.14, 0.62, 0.5], [0.0, 1.0, 0.76], [0.18, 1.12, 0.96], [0.36, 1.04, 0.92], [0.56, 0.86, 0.72], [0.72, 0.8, 0.66]]) });

  // ---- far arm, fused to the flank: vambrace and gauntlet run into the faulds in one melted mass
  f.bone('upperarm_f'); f.part(limb(SF, EF, 74, 56, { p: [[0.3, 0.18, 0.2]], q: [[0.6, 0.12, 0.2]] }), A3({ maxShade: 18 }));
  f.bone('forearm_f'); f.part(limb(EF, WF, 62, 46, { p: [[0.25, 0.16, 0.18]] }), A3({ maxShade: 16 }));
  f.bone('hand_f'); const gF = B.grip(f, WF, EF, -Math.PI / 2, 34, '#7a5e22', { plate: true, cuff: true, quiet: true });

  // ---- torso: one shell. Breastplate, faulds and the hump of the back plate fused without seams that move.
  f.bone('torso');
  const torso = S.shape([[-0.14, 0.62, 0.5], [0.0, 1.0, 0.76], [0.18, 1.12, 0.96], [0.36, 1.04, 0.92], [0.56, 0.86, 0.72], [0.72, 0.8, 0.66], [0.86, 0.82, 0.7], [0.98, 0.86, 0.76]]);
  const tD = E.smooth(torso);
  X.cutHoles(f, [[S.at(-0.2, 0.56), 13]], () => {
    f.part(torso, A1({ maxShade: 40 }));
    X.clipDraw(f, tD, () => {
      X.softTone(f, tD, [[[S.at(-1.1, 0.0), S.at(-0.4, 0.0), S.at(-0.4, 1.0), S.at(-1.1, 1.0)], '#140c04', 0.5, 14], [[S.at(0.2, 0.1), S.at(0.6, 0.14), S.at(0.5, 0.36), S.at(0.2, 0.3)], '#fff0c0', 0.4, 10]]);
      // the breastplate's ridge and the fauld lames, their edges melted shut
      f.line([S.at(0.62, 0.12), S.at(0.8, 0.34), S.at(0.62, 0.6)], 2.4, INK, { op: 0.6 }); f.line([S.at(0.56, 0.14), S.at(0.72, 0.34), S.at(0.56, 0.58)], 1.6, '#ecd088', { op: 0.6 });
      X.softTone(f, tD, [[ell(S.at(0.55, 0.24), H * 0.3, H * 0.18, 0.4, 14), '#fff6d0', 0.5, H * 0.08], [[S.at(0.2, 0.4), S.at(0.9, 0.4), S.at(0.8, 0.5), S.at(0.2, 0.5)], '#140a02', 0.5, H * 0.05]]); // the breastplate's swell over the chest, its turn under to the waist
      X.formHatch(f, [S.at(0.92, 0.12), S.at(0.96, 0.3), S.at(0.8, 0.5), S.at(0.7, 0.62)], H * 0.12, { op: 0.45 });
      for (let i = 0; i < 4; i++) weld(f, [S.at(-0.9, 0.62 + i * 0.09), S.at(0.0, 0.64 + i * 0.09), S.at(0.8, 0.62 + i * 0.09)], 5, A2(), { runs: i % 2 });
      X.stains(f, tD, E.bbox(torso), '#100a10', 0.02, 3.4, -1.5, 91, 0.95); // scorch
      X.dent(f, S.at(0.4, 0.26), 22, 0.4); X.dent(f, S.at(-0.3, 0.3), 16, -0.2); X.dent(f, S.at(0.2, 0.48), 13, 0.3); X.dent(f, S.at(-0.6, 0.12), 18, 0.5);
      // the landing crater: a crushed dish in the chest with cracks running out of it onto violet
      const cr = S.at(0.1, 0.32); f.flat(ell(cr, 34, 28, 0.3, 18), '#2a1a08', { op: 0.55 }); f.flat(ell(add(cr, mul(f.L, 6)), 26, 20, 0.3, 16), '#ecd088', { op: 0.3 });
      for (const a of [0.2, 1.6, 2.8, 4.2, 5.4]) { const q = X.crackV(f, add(cr, rot([22, 0], a)), a, R(f, 50, 90), 5, { depth: 1, dark: '#1c1208' }); }
      f.flat(ell(cr, 9, 7, 0.3, 10), P.vio, { op: 0.85 }); f.flat(ell(cr, 4, 3, 0.3, 8), P.vioW, { op: 0.9 }); // violet light in the deepest crack
      X.burn(f, S.at(0.6, 0.6), -2.4, 110, 2.6, { depth: 3 });
      f.scratches(S.at(0.3, 0.5), 50, 9, '#ecd088', 0.9, -0.5);
    });
  }, { shape: tD });
  // the far arm's weld onto the flank (drawn over the torso edge)
  weld(f, [lp(EF, WF, 0.2, -30), lp(EF, WF, 0.7, -28), add(WF, [-30, 30])], 8, A2(), { runs: 3 });
  f.bone('hand_f'); X.fistDetail(f, gF, 34, '#7a5e22', { nail: '#3a2a10', wrinkle: false });
  // ---- tassets over the hips (pelvis) and the fused, buckled faulds' lower edge
  f.bone('tassets');
  for (const [u0, u1, tone] of [[-0.92, -0.08, 0.2], [-0.1, 0.8, 0.05]]) {
    for (let k = 2; k >= 0; k--) { const v = 0.94 + k * 0.12, um = (u0 + u1) / 2; const pl = [S.at(u0 - k * 0.05, v), S.at(um, v - 0.04), S.at(u1 + k * 0.04, v), S.at(u1 + k * 0.04 + 0.03, v + 0.15), S.at(um, v + 0.2), S.at(u0 - k * 0.05 - 0.03, v + 0.16)]; f.part(pl, A1({ fill: mix('#a07c30', '#000', tone + k * 0.08), maxShade: 10, inkW: 1.4 })); f.line([lerp(pl[5], pl[4], 0.1), pl[4], lerp(pl[4], pl[3], 0.9)], 1.6, '#e6c878', { op: 0.45 }); f.rivet(lerp(pl[0], pl[2], 0.2), 3, '#a07c30'); f.rivet(lerp(pl[0], pl[2], 0.8), 3, '#a07c30'); X.clipDraw(f, E.smooth(pl), () => scorch(f, lerp(pl[4], pl[5], 0.5), 30, 14, 0.6)); }
  }
  weld(f, [S.at(-0.5, 1.0), S.at(-0.48, 1.15), S.at(-0.5, 1.32)], 5, A2(), { runs: 1 });

  // ---- near leg, forward and bent, the weight driving onto it
  knightLeg(HN, KN, AN, '_n', 0);

  // ---- the helm, fused into the hump: no neck, the bevor and pauldrons one mass with it; visor slit welded shut except
  // a crack; a crest of plate feathers melted flat (head bone)
  f.bone('head');
  const hF = frame(HC, 0.5, 150);
  const helm = hF([[-0.5, -0.06], [-0.42, -0.4, 1], [-0.06, -0.5], [0.3, -0.46, 1], [0.46, -0.22], [0.5, 0.1, 1], [0.44, 0.4], [0.2, 0.5], [-0.2, 0.46], [-0.48, 0.3, 1]]);
  f.part(helm, A1({ maxShade: 26 }));
  X.clipDraw(f, E.smooth(helm), () => {
    X.softTone(f, E.smooth(helm), [[hF([[-0.5, -0.1], [-0.1, -0.1], [-0.1, 0.5], [-0.5, 0.5]]), '#140c04', 0.45, 10], [hF([[0.0, -0.5], [0.3, -0.45], [0.3, -0.25], [0.0, -0.3]]), '#fff0c0', 0.45, 8]]);
    f.line(hF([[0.06, -0.54], [0.36, -0.3], [0.5, 0.04], [0.46, 0.36]]), 2.4, INK, { op: 0.55 }); // the medial ridge
    // the visor slit, welded shut along most of its length; one crack open onto violet
    weld(f, hF([[0.1, -0.06], [0.3, -0.04], [0.5, 0.0]]), 6, A2(), { runs: 0 });
    X.vcrack(f, hF([[0.26, -0.05], [0.4, -0.02], [0.5, 0.01]]), 5, { dark: '#1c1208' });
    for (let i = 0; i < 7; i++) { const q = hF([[0.3 + (i % 2) * 0.06, 0.12 + i * 0.045]])[0]; f.flat(ell(q, 2.4, 2, 0, 6), '#0a0608'); } // breaths
    X.stains(f, E.smooth(helm), E.bbox(helm), '#140e16', 0.03, 2.8, -1.4, 93, 0.85);
    X.dent(f, hF([[-0.1, -0.3]])[0], 16, 0.2);
    X.burn(f, hF([[-0.3, -0.3]])[0], 0.4, 90, 2.4, { depth: 2 });
  });
  // a crest of gold feathers along the helm, melted flat and run down its side
  for (let i = 0; i < 6; i++) { const r0 = hF([[-0.3 + i * 0.1, -0.5 + Math.abs(i - 2.5) * 0.02]])[0], tp = add(r0, rot([46 - i * 3, 0], -2.4 + i * 0.12)); const d = E.norm(sub(tp, r0)), nn = [-d[1], d[0]]; f.part([add(r0, mul(nn, 7)), add(tp, mul(nn, 3)), [...tp, 1], add(tp, mul(nn, -3)), add(r0, mul(nn, -7))], A2({ maxShade: 4, inkW: 1.2, cast: false })); }
  weld(f, hF([[-0.34, -0.46], [-0.1, -0.56], [0.14, -0.52]]), 7, A2(), { runs: 2 });
  // bevor and gorget welded to the breastplate: the head cannot turn
  f.bone('torso');
  const bev = [hF([[-0.3, 0.3]])[0], hF([[0.3, 0.44]])[0], S.at(0.7, 0.08), S.at(0.2, 0.06), S.at(-0.5, 0.02)];
  f.part(bev, A2({ maxShade: 14 }));
  weld(f, [hF([[-0.36, 0.32]])[0], hF([[0.0, 0.46]])[0], hF([[0.34, 0.44]])[0]], 8, A2(), { runs: 2 });
  // ---- near pauldron (torso): a great round dome welded to the helm and the hump
  G.pauldron(f, add(SN, [6, -18]), 60, -0.4, '#a07c30', '#7a5e22', 3);
  weld(f, [add(SN, [-50, -40]), add(SN, [0, -62]), add(SN, [50, -56])], 7, A2(), { runs: 2 });
  X.crackV(f, add(SN, [-10, 10]), 1.2, 60, 4, { depth: 1, dark: '#1c1208' });
  // ---- near arm: rerebrace, couter, vambrace; the gauntlet round the lance's grip
  f.bone('upperarm_n'); f.part(limb(SN, EN, 72, 54, { p: [[0.35, 0.2, 0.2]], q: [[0.55, 0.14, 0.2]] }), CLB(f, { maxShade: 14 })); { const rb = limb(lp(SN, EN, 0.22, 0), lp(SN, EN, 0.9, 0), 74, 58, { p: [[0.3, 0.2, 0.22]], q: [[0.6, 0.12, 0.2]] }); f.part(rb, A1({ maxShade: 20 })); X.clipDraw(f, E.smooth(rb), () => X.softTone(f, E.smooth(rb), [[[lp(SN, EN, 0.2, 30), lp(SN, EN, 0.9, 24), lp(SN, EN, 0.9, 6), lp(SN, EN, 0.2, 8)], '#fff6d0', 0.45, 8]])); }
  f.bone('forearm_n'); f.part(limb(EN, WN, 58, 44, { q: [[0.25, 0.18, 0.18]] }), CLB(f, { maxShade: 12 })); { const vb = limb(lp(EN, WN, 0.14, 0), lp(EN, WN, 0.86, 0), 62, 46, { q: [[0.25, 0.18, 0.18]] }); f.part(vb, A1({ maxShade: 16 })); X.clipDraw(f, E.smooth(vb), () => X.softTone(f, E.smooth(vb), [[[lp(EN, WN, 0.15, -26), lp(EN, WN, 0.85, -20), lp(EN, WN, 0.85, -4), lp(EN, WN, 0.15, -6)], '#fff6d0', 0.4, 8]])); for (const t of [0.35, 0.6]) f.line([lp(EN, WN, t, -30), lp(EN, WN, t + 0.03, 0), lp(EN, WN, t, 30)], 1.6, INK, { op: 0.5 }); }
  f.part(ell(add(EN, [-6, 6]), 26, 20, ang(SN, EN) + 0.6, 14), A2({ k: 0.8 })); // couter
  weld(f, [lp(EN, WN, 0.1, -26), add(EN, [-20, 10]), lp(SN, EN, 0.85, -30)], 6, A2(), { runs: 1 }); // the elbow fused half bent
  // ---- the lance in front: grip, the vamplate (a cone guarding the hand), the shaft snapped off and splintered
  f.bone('lance');
  shaft(lV, lX, 26, 22);
  const vp = add(WN, mul(lD, 56)), vN = [-lD[1], lD[0]];
  { const ap = add(vp, mul(lD, 40)), b0 = add(vp, mul(lD, -12)); f.part([add(ap, mul(vN, 13)), add(b0, mul(vN, 58)), add(add(b0, mul(lD, -9)), mul(vN, 30)), add(b0, mul(lD, -12)), add(add(b0, mul(lD, -9)), mul(vN, -30)), add(b0, mul(vN, -58)), add(ap, mul(vN, -13))].map((q, i) => i === 1 || i === 5 ? [...q, 1] : q), A1({ maxShade: 8 })); f.line([add(b0, mul(vN, 54)), add(add(b0, mul(lD, 20)), mul(vN, 30)), add(ap, mul(vN, 10))], 1.6, '#e6c878', { op: 0.5 }); } // vamplate: a cone guarding the hand
  X.clipDraw(f, E.smooth([add(add(vp, mul(lD, -20)), mul(vN, -60)), add(add(vp, mul(lD, -20)), mul(vN, 60)), add(add(vp, mul(lD, 40)), mul(vN, 20)), add(add(vp, mul(lD, 40)), mul(vN, -20))].map(q => [...q, 1])), () => { X.dent(f, add(add(vp, mul(lD, -12)), mul(vN, -26)), 10, 0); scorch(f, add(add(vp, mul(lD, -10)), mul(vN, 30)), 18, 26, 0.5); });
  for (let i = 0; i < 4; i++) f.rivet(add(add(vp, mul(lD, -14)), mul(vN, -40 + i * 26)), 2.6, '#a07c30');
  // the break: splinters of the black shaft bristling, their ends fused into a glassy violet-tipped lump
  for (let i = 0; i < 7; i++) { const o2 = -10 + i * 3.3, l = R(f, 20, 60), q0 = add(lX, mul(vN, o2)), q1 = add(add(q0, mul(lD, l)), mul(vN, R(f, -6, 6))); f.stroke([q0, lerp(q0, q1, 0.6), q1], R(f, 4, 7), '#241e24'); f.line([q0, q1], 0.9, '#6a6068', { op: 0.6 }); }
  f.part(ell(add(lX, mul(lD, 8)), 14, 16, lA, 10), Object.assign({}, X.BK(f), { maxShade: 4, cast: false }));
  f.flat(ell(add(lX, mul(lD, 10)), 5, 6, lA, 8), P.vio, { op: 0.85 });
  X.burn(f, lerp(lV, lX, 0.2), lA, 180, 2.2, { depth: 2, halo: false, clip: limb(lV, lX, 26, 22, { steps: 10 }) });
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, lA, 34, '#a07c30', { inline: true, plate: true, cuff: true, name: 'knight lance' });
  f.bone('root');
  f.flat(ell([420, gy + 2], 300, 10, 0, 20), '#000', { op: 0.3 });
  // scorched ground and gold flakes shaken off the shell
  X.leafDrift(f, [380, gy - 30], 180, 30, 10, 1.2);
  X.placeFigure(f, 0, 1.15, [430, gy], [430, gy], Object.keys(f.joints)); // true size: 1.4 against the 1.1 Fallen Angel
  return f;
}

// ------------------------------------------------------------------ RIFT HOUND (cast, large, 1.1 long)
// It comes through the tears in the sky. A hound-shaped hole in the world: black void with violet edges, depth showing
// as the far inner wall catching a dim violet on the side that faces the light, never a flat cut-out. A deep-chested
// sighthound's anatomy (after the reviewed Cinder Hound): withers over a deep brisket, a tucked loin, elbows set back,
// sloped pasterns, heavy thighs, sharp hocks. Stalking forward low, the head level and the jaw hanging open, too many
// eyes in its face. Lightning: the hackles and the topline stand on end in fine spikes, and its paws burn violet
// branching scars into the floor. Void: edges thinning into clean shards that drift off; gold leaf falling into it and
// vanishing at the rim.
// Rig: spine_1 (root), spine_2, neck, head, jaw, tail_1, tail_2, leg_{hf,ff,hn,fn}_1..3.
// Motion: idle flickering edges (shards, rim); attack a lunge from a rift (spine and neck forward, jaw open).
function riftHound() {
  const CW = 1080, CH = TIERS.large[1], seed = 1504;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY;
  // after the reviewed Magma Hound and Plague Wolf: front H shoulder point, K elbow back under the brisket, A wrist, T paw;
  // hind H hip, K stifle forward, A hock behind, T paw
  const LEG = {
    fn: { H: [610, 800], K: [566, 904], A: [612, 1006], T: [656, gy] },
    ff: { H: [628, 790], K: [596, 896], A: [580, 1002], T: [568, gy] },
    hn: { H: [244, 744], K: [312, 862], A: [200, 970], T: [230, gy] },
    hf: { H: [264, 736], K: [338, 852], A: [250, 962], T: [278, gy] },
  };
  const NK = [576, 712], HC = [800, 752], hA = 0.18, ja = 0.36;
  const jp = add(HC, rot([-34, 26], hA));
  f.joint('spine_1', [270, 730]).joint('spine_2', [400, 740], 'spine_1').joint('neck', NK, 'spine_2').joint('head', [740, 760], 'neck').joint('jaw', jp, 'head');
  f.joint('tail_1', [168, 712], 'spine_1').joint('tail_2', [100, 660], 'tail_1');
  for (const [k, L] of Object.entries(LEG)) { const par = k[0] === 'f' ? 'spine_2' : 'spine_1'; f.joint(`leg_${k}_1`, L.H, par).joint(`leg_${k}_2`, L.K, `leg_${k}_1`).joint(`leg_${k}_3`, L.A, `leg_${k}_2`); }
  const PL = ['#100a1a', '#1e1630', '#2c2244', '#3a2c58', '#4a3a6e']; // the planes' tones, darkest to the one facing the light
  // one part of the hole: violet rim, the void, then planes (polygons inside it, each a flat tone of dark violet set by
  // which way it faces, with a violet edge where two planes meet) so the hole reads as a body's form
  const vpart = (shape, planes = [], o = {}) => {
    const d = E.smooth(shape);
    f.line([...shape, shape[0]], o.rimW ?? 5, P.vioD, { op: 0.95 });
    f.line([...shape, shape[0]], 1.6, P.vioL, { op: 0.8 });
    f.flat(d, P.void);
    X.clipDraw(f, d, () => {
      for (const [pl, tone] of planes) { f.flat(pl, PL[tone]); f.line([...pl, pl[0]], 1.8, P.vioD, { op: 0.8 }); f.line([...pl, pl[0]], 0.8, P.vio, { op: 0.45 }); }
      X.softTone(f, d, [[shape.map(q => add(q, mul(f.L, (o.depth ?? 10) * 2.2))), P.void, 0.6, 8]]); // the edge turned away from the light sinks into the dark
      if (o.inside) o.inside();
    });
    return d;
  };
  // a limb segment's two planes: the one facing the light and the one turned away, with the ridge between them
  const limbPlanes = (a, b, wa, wb, lift = 0) => { const lp2 = (t, k) => lp(a, b, t, k); return [[[lp2(-0.1, wa * 0.05), lp2(1.1, wb * 0.05), lp2(1.1, -wb * 0.8), lp2(-0.1, -wa * 0.8)], 2 + lift], [[lp2(-0.1, wa * 0.05), lp2(1.1, wb * 0.05), lp2(1.1, wb * 0.8), lp2(-0.1, wa * 0.8)], 0]]; };
  // fine standing spikes along an edge (lightning stands the hackles on end): thin black needles with a violet rim
  const hackles = (pts, n, l0, l1, up) => {
    const C = X.spline(pts, 4), Sx = X.arcLen(C), T = Sx[Sx.length - 1];
    for (let i = 0; i < n; i++) {
      const u = T * (i + R(f, 0.2, 0.8)) / n; let k = 1; while (k < C.length - 1 && Sx[k] < u) k++;
      const d = E.norm(sub(C[Math.min(C.length - 1, k + 1)], C[k - 1])), nn = mul([-d[1], d[0]], up), l = R(f, l0, l1), a = Math.atan2(nn[1], nn[0]) + R(f, -0.35, 0.35) - 0.25 * up;
      const b = C[k], tip = add(b, rot([l, 0], a)), w = R(f, 3, 6);
      const sp = [add(b, mul(d, -w)), add(lerp(b, tip, 0.5), mul(d, -w * 0.3)), [...tip, 1], add(b, mul(d, w))];
      f.line([...sp, sp[0]], 3, P.vioD, { op: 0.9 }); f.flat(sp, P.void);
    }
  };
  const leg = (k, far, part = 7) => {
    const L = LEG[k], front = k[0] === 'f', dim = far ? -1 : 0;
    const seg = (a, b, wa, wb, o) => vpart(limb(a, b, wa, wb, Object.assign({ steps: 12, capK: 0.9 }, o)), limbPlanes(a, b, wa, wb, dim));
    if (part & 1) { f.bone(`leg_${k}_1`); if (front) seg(L.H, L.K, 86, 48, { p: [[0.55, 0.28, 0.2]], q: [[0.25, 0.12, 0.18]] }); else seg(L.H, L.K, 140, 58, { p: [[0.4, 0.3, 0.22]], q: [[0.45, 0.16, 0.2]] }); }
    if (part & 2) {
      f.bone(`leg_${k}_2`);
      const dk = E.norm(sub(L.A, L.K)), nk = [-dk[1], dk[0]];
      if (front) { seg(L.K, L.A, 48, 28, { q: [[0.22, 0.22, 0.18]] }); vpart([add(L.K, mul(nk, 10)), add(add(L.K, mul(nk, 30)), mul(dk, -6)), add(add(L.K, mul(nk, 30)), mul(dk, 14)), add(add(L.K, mul(nk, 12)), mul(dk, 24))], [], { rimW: 3 }); } // the point of the elbow
      else { seg(L.K, L.A, 64, 26, { p: [[0.22, 0.3, 0.18]] }); vpart([add(L.A, mul(nk, 6)), add(add(L.A, mul(nk, 26)), mul(dk, -8)), add(add(L.A, mul(nk, 24)), mul(dk, 8)), add(L.A, mul(dk, 14))], [], { rimW: 3 }); } // the hock's point
    }
    if (part & 4) {
      f.bone(`leg_${k}_3`);
      const T = L.T, pt = [T[0] - 10, gy - 34], Xp = u => T[0] + u * 34;
      vpart(K.chain([lerp(L.A, pt, -0.1), L.A, lerp(L.A, pt, 0.55), pt], [30, 28, 24, 32]), limbPlanes(L.A, pt, 28, 28, dim));
      // the paw: heel pad behind, three knuckled toes on the ground, black glassy claws with a violet edge
      vpart([[Xp(-0.9), gy - 4, 1], [Xp(-1.0), gy - 26], [Xp(-0.6), gy - 42], [Xp(0.2), gy - 44], [Xp(0.8), gy - 34], [Xp(1.3), gy - 18], [Xp(1.4), gy - 3, 1]], [[[[Xp(-0.6), gy - 42], [Xp(0.8), gy - 34], [Xp(0.6), gy - 24], [Xp(-0.5), gy - 30]], 2 + dim]], { rimW: 3.4 });
      for (let i = 0; i < 3; i++) { const tx = Xp(0.05 + i * 0.42); vpart([[tx - 13, gy - 2, 1], [tx - 14, gy - 22], [tx - 4, gy - 32], [tx + 9, gy - 28], [tx + 15, gy - 14], [tx + 14, gy - 2, 1]], [[[[tx - 12, gy - 22], [tx - 4, gy - 32], [tx + 9, gy - 28], [tx + 4, gy - 20]], 3 + dim]], { rimW: 2.6 }); const cl = [[tx + 10, gy - 16], [tx + 24, gy - 7], [tx + 22, gy - 1, 1], [tx + 12, gy - 4]]; f.line([...cl, cl[0]], 2, P.vioD); f.flat(cl, '#120e1a'); f.line([cl[0], cl[1]], 1, P.vioL, { op: 0.7 }); }
      f.bone('root');
      X.burn(f, [T[0] + 10, gy + 2], R(f, -0.3, 0.3) + (f.r() > 0.5 ? 0 : Math.PI), 70, 2.4, { depth: 2, scorch: '#100a14', haloOp: 0.5 }); // the paw burns the floor
      f.bone(`leg_${k}_3`);
    }
  };
  // ---- far legs and the tail behind the body
  leg('hf', true); leg('ff', true);
  f.bone('tail_1');
  const tl1 = [[180, 716], [140, 700], [104, 676]]; vpart(K.chain(tl1, [46, 36, 28]), limbPlanes(tl1[0], tl1[2], 46, 28));
  f.bone('tail_2');
  const tl2 = [[112, 680], [70, 650], [40, 610], [26, 570]]; vpart(K.chain(tl2, [30, 22, 14, 8]), []);
  X.shards(f, [26, 570], -2.0, 5, 1.1); // the tail thinning into nothing
  hackles([[180, 700], [130, 690], [80, 660], [44, 610]], 9, 10, 22, -1);
  // ---- near upper legs: the shoulder and haunch masses
  leg('hn', false, 1); leg('fn', false, 1);
  // ---- body: croup, a loin arched over a tucked waist, the ribcage deep to the elbow, heavy withers; cut at the loin
  const torso = [[166, 716], [210, 694], [290, 690], [350, 704], [420, 716], [490, 698], [550, 680], [600, 696], [640, 740], [662, 812], [648, 872], [600, 906], [530, 912], [466, 888], [410, 842], [362, 806], [316, 798], [278, 822], [226, 830], [176, 808], [150, 762]];
  const cut = [380, 720], cd = [1, 0];
  const planes = [
    [[[170, 716], [290, 692], [420, 716], [550, 682], [600, 700], [570, 744], [440, 756], [300, 742], [200, 752]], 3], // the topline, facing the light
    [[[548, 690], [604, 702], [640, 750], [632, 806], [596, 800], [566, 748]], 4], // the shoulder blade laid back from the withers
    [[[430, 760], [566, 752], [606, 806], [600, 850], [540, 862], [456, 830]], 2], // the barrel of the ribs, its upper half
    [[[470, 850], [600, 856], [640, 880], [600, 906], [520, 908]], 0], // the brisket turning under
    [[[176, 730], [262, 724], [300, 770], [270, 820], [200, 812]], 3], // the haunch over the hip
    [[[300, 744], [420, 760], [400, 810], [330, 800]], 1], // the loin and flank, tucked up
  ];
  const ribs = []; for (let i = 0; i < 5; i++) ribs.push([[462 + i * 22, 770 - i * 2], [466 + i * 20, 820], [458 + i * 18, 870 - i * 4]]);
  split(f, () => {
    vpart(torso, planes, { inside: () => { for (const L of ribs) f.line(L, 1.4, P.vio, { op: 0.35 }); X.leafDrift(f, [420, 790], 160, 60, 5, 0.9); } });
  }, [['spine_1', side(cut, mul(cd, -1), 50)], ['spine_2', side(cut, cd, 50)]]);
  f.bone('spine_1'); hackles([[170, 700], [250, 684], [330, 690], [400, 712]], 16, 10, 26, -1);
  X.shards(f, [300, 660], -1.4, 4, 1);
  f.bone('spine_2'); hackles([[410, 714], [470, 702], [550, 680]], 10, 12, 28, -1);
  // ---- neck: heavy, carried forward and level from the withers, the hackles standing
  f.bone('neck');
  const neck = [[520, 690], [578, 680], [640, 696], [704, 722], [766, 736], [784, 790], [744, 824], [694, 822], [644, 812], [604, 790], [572, 760]];
  vpart(neck, [[[[540, 690], [640, 698], [760, 738], [740, 770], [640, 750], [560, 730]], 3], [[[600, 780], [700, 790], [744, 820], [650, 812]], 0]]);
  hackles([[540, 684], [600, 680], [660, 694], [730, 718]], 14, 14, 34, -1);
  // ---- head: a wolfhound's skull held level, the jaw dropped open on its hinge, the gape black; too many eyes in its face
  const HF = frame(HC, hA, 1.1);
  f.bone('jaw');
  const J = pts => HF(pts).map(q => add(jp, rot(sub(q, jp), ja)));
  // (independent review) a canine jaw: shorter, deep at the back where the masseter sits, the chin rounded
  const jaw = J([[-34, 18], [0, 34], [48, 40], [86, 42], [102, 46], [98, 58], [70, 64], [30, 66], [-10, 60], [-38, 40]]);
  vpart(jaw, [[J([[-24, 30], [50, 42], [98, 48], [70, 56], [0, 50]]), 2]]);
  for (let i = 0; i < 4; i++) { const q = J([[44 + i * 15, 38]])[0]; f.flat([add(q, [-3, 0]), add(q, [3, 0]), add(q, [0, -9])].map(x => [...x, 1]), P.vioD, { op: 0.9 }); } // teeth only as notches in the rim
  f.bone('head');
  const ear = HF([[-30, -56], [-44, -96], [-60, -128, 1], [-80, -98], [-92, -64], [-58, -42]]);
  vpart(ear, [[HF([[-44, -90], [-60, -124], [-70, -96], [-58, -60]]), 2]]);
  X.shards(f, HF([[-60, -130]])[0], -2.0, 3, 0.8);
  // (independent review) a canine skull, not a crocodile's: the muzzle shorter than the cranium and deep at its root,
  // a defined stop where the brow ridge drops to the bridge, the cheek's mass (zygomatic arch over the masseter) behind
  // the mouth's corner, a blunt nose pad at the tip, the upper lip's flew hanging over the jaw
  const skull = HF([[-76, -10], [-72, -40], [-50, -58], [-14, -64], [14, -62], [30, -54], [36, -44], [44, -36], [70, -31], [96, -25], [110, -21], [120, -12], [122, 2], [114, 12], [96, 20], [72, 30], [46, 38], [20, 44], [-8, 48], [-34, 44], [-60, 28]]);
  vpart(skull, [[HF([[-64, -40], [-14, -62], [30, -54], [24, -30], [-36, -22]]), 3], // the cranium's top, toward the light
    [HF([[44, -34], [110, -21], [118, -8], [70, -14], [44, -18]]), 4], // the bridge of the muzzle
    [HF([[30, -26], [70, -12], [110, -4], [104, 10], [60, 14], [34, 6]]), 2], // the muzzle's side
    [HF([[-50, 0], [-14, -14], [26, -6], [36, 20], [10, 40], [-30, 38]]), 1], // the cheek: the arch over the masseter
    [HF([[38, 22], [96, 20], [72, 30], [46, 38]]), 0]]); // the flew under the lip
  f.line(HF([[30, -54], [38, -42], [46, -36]]), 3, P.vioD, { op: 0.9 }); f.line(HF([[28, -56], [36, -46]]), 1.4, P.vioL, { op: 0.8 }); // the stop under the brow
  f.line(HF([[-44, 2], [-14, -12], [24, -4]]), 1.8, P.vio, { op: 0.6 }); // the zygomatic arch's edge
  { const np = HF([[106, -20], [122, -12], [124, 2], [114, 10], [104, 4], [100, -10]]); f.line([...np, np[0]], 3, P.vioD); f.flat(np, '#020104'); f.flat(HF(ell([116, 0], 4, 3, 0.3, 8)), '#120e1a'); f.line(HF([[108, -18], [120, -11]]), 1.2, P.vioL, { op: 0.8 }); } // the nose pad, a nostril
  // the eyes: one pair where a hound's would be, and more crowding the brow and the muzzle, each a different size, all
  // looking at the party; no lids, they sit in the void
  for (const [u, v, sz, gz] of [[14, -34, 14, [0.6, 0.1]], [-16, -44, 10, [0.7, 0.2]], [56, -26, 7.5, [0.5, 0.3]], [-38, -22, 8, [0.8, 0]], [80, -18, 6, [0.4, 0.2]], [-6, -14, 6, [0.6, 0.4]], [34, -14, 5.5, [0.4, 0.3]], [-52, -42, 5.5, [0.7, 0.2]]]) {
    const c = HF([[u, v]])[0], a = hA;
    f.flat(ell(c, sz * 1.25, sz * 0.58, a, 16), P.vioD, { op: 0.9 });
    f.flat(ell(c, sz, sz * 0.44, a, 16), '#d8d0e4');
    f.flat(ell(add(c, rot([gz[0] * sz * 0.4, gz[1] * sz * 0.1], a)), sz * 0.38, sz * 0.38, 0, 12), P.vio);
    f.flat(ell(add(c, rot([gz[0] * sz * 0.45, gz[1] * sz * 0.1], a)), sz * 0.18, sz * 0.2, 0, 8), '#020103');
    f.flat(ell(add(c, rot([gz[0] * sz * 0.2 - sz * 0.15, -sz * 0.12], a)), sz * 0.1, sz * 0.08, 0, 6), '#fff', { op: 0.8 });
    f.line(ell(c, sz, sz * 0.44, a, 16).slice(8, 16), 1.1, INK, { op: 0.8 });
  }
  X.shards(f, HF([[0, -70]])[0], -1.8, 3, 0.8);
  // ---- near lower legs, in front
  leg('hn', false, 6); leg('fn', false, 6);
  f.bone('root');
  f.flat(ell([430, gy + 2], 330, 8, 0, 20), '#000', { op: 0.3 });
  X.placeFigure(f, 0, 1, [0, 0], [40, -10], Object.keys(f.joints));
  return f;
}

// ------------------------------------------------------------------ STORM SHADE (cast, human 1.0)
// Lightning that forgot to stop: a human outline made of standing lightning, frozen mid-strike, violet-white. Its body
// is a thin, translucent violet-grey volume (so the outline reads as a body with a lit and a shaded side) carrying
// bundles of branching channels that run along each limb and fork off it; the channels are ink-edged with violet-white
// cores (an ink drawing of lightning, never a glow or a glowing outline). It lunges, the near hand driven forward and
// down with the fingers forking into five channels, the far arm flung back, the head thrust forward, its hair standing
// in branching filaments. The feet fork into the floor and fuse it: glassy fulgurite tubes, scorched branching burns,
// lifted tiles of gilt floor. The channels thicken into a knot at the heart.
// Rig: standard humanoid. Motion: idle crackling (small bone jitters, the engine flickers the channels); attack a strike
// (the near arm drives down and forward; the discharge is an engine effect).
function stormShade() {
  const CW = 700, CH = TIERS.human[1], seed = 1505;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const H = 100, gy = f.o.groundY;
  const N = [362, 242], C = [346, 336], Pv = [322, 444];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.3, 0.12), SF = S.at(0.4, 0.1);
  const EN = [420, 318], WN = [516, 372];
  const EF = [304, 196], WF = [238, 150];
  const HN = S.at(-0.2, 1.0), KN = [418, 560], AN = [430, 742];
  const HF = S.at(0.3, 1.0), KF = [248, 584], AF = [170, 730];
  const HC = [398, 186], hA = 0.28, neck0 = S.at(0.14, -0.04);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  const BODY = (o = {}) => Object.assign({ fill: '#3a3050', shadow: '#120e1c', light: '#6a5e8a', shade: 0.4, tex: 'craze' + seed, texOp: 0.25, inkW: 1.2, inkHeavy: 2.2, cast: false }, o);
  // channels: a bundle of jagged branching strokes running along a chain of points, kept inside the limb's width
  const channels = (pts, ws, n, o = {}) => {
    const C2 = X.spline(pts, 6), Sx = X.arcLen(C2), T = Sx[Sx.length - 1], wAt = u => { const t = u / T * (ws.length - 1), i = Math.min(ws.length - 2, Math.floor(t)); return ws[i] + (ws[i + 1] - ws[i]) * (t - i); };
    const strokes = [];
    for (let k = 0; k < n; k++) {
      let off = (k / Math.max(1, n - 1) - 0.5) * 0.7 + R(f, -0.1, 0.1); const line = [];
      for (let u = 0; u <= T; u += R(f, 7, 14)) {
        let i = 1; while (i < C2.length - 1 && Sx[i] < u) i++;
        const d = E.norm(sub(C2[Math.min(C2.length - 1, i)], C2[i - 1])), nn = [-d[1], d[0]];
        off = Math.max(-0.45, Math.min(0.45, off + R(f, -0.16, 0.16)));
        line.push(add(C2[i], mul(nn, off * wAt(u))));
        if (f.r() < (o.branch ?? 0.16) && u > 10) { // a side branch forking off, raking forward along the limb
          const a = Math.atan2(d[1], d[0]) + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), L = R(f, 12, 34) * (o.bs ?? 1); const br = [line[line.length - 1]]; let q = br[0], aa = a;
          for (let j = 0; j < 3; j++) { aa += R(f, -0.5, 0.5); q = add(q, rot([L / 3, 0], aa)); br.push(q); }
          strokes.push([br, (o.w ?? 2.6) * 0.5]);
        }
      }
      strokes.push([line, (o.w ?? 2.6) * (k === Math.floor(n / 2) ? 1.3 : R(f, 0.6, 1))]);
    }
    for (const [L, w] of strokes) f.line(L, w + 2.6, P.vioS, { op: 0.95, straight: true });
    for (const [L, w] of strokes) f.line(L, w, P.vioL, { straight: true });
    for (const [L, w] of strokes) if (w > 2.2) f.line(L, Math.max(0.8, w * 0.4), P.vioW, { straight: true });
    return strokes;
  };
  // a limb: the translucent volume, then its channels
  const zap = (bone, pts, ws, n, o = {}) => { f.bone(bone); channels(pts, ws, n, o); };
  // a limb's volume in one anatomical outline through its joint (cut at the joint for the rig), then its channels
  const limbV = (A0, J0, B0, ws, look, b1, b2, n) => { const [c0, c1] = X.jcut(A0, J0, B0, ws[1] / 2); split(f, () => f.part(X.jointLimb(A0, J0, B0, ws, { point: 0.3, mus0: 0.16, mus1: 0.2 }), BODY(Object.assign({ maxShade: ws[1] * 0.35 }, look))), [[b1, c0], [b2, c1]]); zap(b1, [A0, J0], [ws[0], ws[1]], n); zap(b2, [J0, B0], [ws[1], ws[2]], n); };
  // forked fingers / toes: channels splaying off a point
  const forks = (c, a0, n, L, spread, w) => { for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * spread + R(f, -0.08, 0.08); const pts = [c]; let q = c, aa = a; for (let j = 0; j < 4; j++) { aa += R(f, -0.35, 0.35); q = add(q, rot([L * R(f, 0.2, 0.3), 0], aa)); pts.push(q); } f.line(pts, w + 2.4, P.vioS, { op: 0.95, straight: true }); f.line(pts, w, P.vioL, { straight: true }); f.line(pts.slice(0, 3), Math.max(0.7, w * 0.4), P.vioW, { straight: true }); } };
  // ---- the floor where it stands: fused and burnt (root)
  f.bone('root');
  for (const [c, a] of [[[452, gy], 0.1], [[150, gy], Math.PI - 0.2], [[452, gy], Math.PI - 0.3]]) X.burn(f, c, a, 120, 3, { depth: 3, scorch: '#100a14', haloOp: 0.55 });
  f.flat(ell([310, gy + 2], 230, 8, 0, 18), '#000', { op: 0.3 });
  // fulgurite: glassy branching tubes of fused floor where the feet went in, and gilt tiles lifted and fused
  for (const [c, a] of [[[460, gy - 2], -0.4], [[146, gy - 2], -2.6], [[500, gy - 4], -0.1]]) { const pts = [c]; let q = c, aa = a; for (let j = 0; j < 4; j++) { aa += R(f, -0.5, 0.5); q = add(q, rot([R(f, 12, 22), 0], aa)); pts.push(q); } f.line(pts, 8, INK, { straight: true }); f.line(pts, 5.4, '#5a5068', { straight: true }); f.line(pts.map(p2 => add(p2, [-1, -1.5])), 1.4, '#d8d0e8', { op: 0.7, straight: true }); }
  for (const [c, a] of [[[520, gy - 6], -0.3], [[100, gy - 8], 0.4], [[390, gy - 4], 0.15]]) X.chip(f, c, 14, X.GL(f, { shade: 0.35 }), { a, k: 0.45 });
  // ---- far arm, flung back and up
  limbV(SF, EF, WF, [40, 32, 22], { fill: '#2e2640' }, 'upperarm_f', 'forearm_f', 4);
  f.bone('hand_f'); forks(WF, ang(EF, WF), 4, 60, 0.32, 1.6);
  // ---- far leg, thrust back
  limbV(HF, KF, AF, [60, 42, 24], { fill: '#2e2640' }, 'thigh_f', 'shin_f', 4);
  f.bone('foot_f'); forks(AF, ang(KF, AF) + 0.3, 3, 80, 0.3, 2.2);
  // ---- torso: a volume with a knot of channels at the heart
  f.bone('torso');
  const torso = S.shape([[-0.06, 0.34, 0.36], [0.06, 0.6, 0.56], [0.22, 0.66, 0.66], [0.42, 0.56, 0.58], [0.62, 0.46, 0.44], [0.8, 0.54, 0.5], [0.98, 0.62, 0.56], [1.1, 0.5, 0.46], [1.18, 0.3, 0.3]]);
  f.part(torso, BODY({ maxShade: 26 }));
  X.clipDraw(f, E.smooth(torso), () => { X.crease(f, [S.at(-0.05, 0.12), S.at(0.15, 0.3), S.at(0.45, 0.3)], 2.4, { col: '#241c34', lit: '#e6e0ff' }); for (let i = 0; i < 4; i++) X.crease(f, [S.at(-0.3, 0.36 + i * 0.07), S.at(-0.05, 0.4 + i * 0.07), S.at(0.15, 0.38 + i * 0.08)], 1.6, { col: '#241c34', lit: '#e6e0ff', op: 0.45 }); });
  const heart = S.at(0.2, 0.3);
  for (const [a, b] of [[S.at(-0.2, 0.0), S.at(-0.3, 0.98)], [S.at(0.1, 0.02), S.at(0.0, 1.0)], [S.at(0.36, 0.08), S.at(0.3, 0.96)], [S.at(-0.5, 0.1), S.at(0.5, 0.2)], [S.at(-0.4, 0.5), S.at(0.4, 0.42)]]) channels([a, heart, b], [40, 50, 40], 1, { w: 2.4, branch: 0.25 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + R(f, -0.3, 0.3); channels([heart, add(heart, rot([R(f, 30, 60), 0], a))], [20, 14], 1, { w: 3, branch: 0.3, bs: 0.6 }); }
  f.flat(ell(heart, 10, 12, 0, 10), P.vioW); f.line(ell(heart, 10, 12, 0, 10).concat([ell(heart, 10, 12, 0, 10)[0]]), 2.4, P.vioS);
  // ---- head: thrust forward, a skull of channels with dark sockets; the hair standing in branching filaments
  f.bone('head');
  const hF = frame(HC, hA, H);
  f.part(limb(neck0, lerp(neck0, HC, 0.7), 46, 38), BODY());
  const head = hF([[-0.32, 0.1], [-0.36, -0.22], [-0.2, -0.46], [0.08, -0.5], [0.3, -0.36], [0.38, -0.12, 1], [0.33, -0.02], [0.4, 0.14, 1], [0.33, 0.2], [0.34, 0.36], [0.26, 0.5, 1], [0.04, 0.48], [-0.12, 0.3, 1], [-0.24, 0.24]]);
  f.part(head, BODY({ maxShade: 20 }));
  channels([hF([[-0.3, 0.2]])[0], hF([[-0.2, -0.3]])[0], hF([[0.2, -0.4]])[0], hF([[0.36, 0.0]])[0], hF([[0.26, 0.42]])[0]], [26, 30, 30, 24, 18], 4, { w: 2.2, branch: 0.2, bs: 0.5 });
  channels([hF([[0.0, -0.12]])[0], hF([[0.2, -0.16]])[0], hF([[0.36, -0.1]])[0]], [10, 10, 8], 1, { w: 2.6, branch: 0 }); // the brow ridge
  channels([hF([[0.3, -0.06]])[0], hF([[0.38, 0.1]])[0], hF([[0.32, 0.16]])[0]], [6, 6, 6], 1, { w: 2, branch: 0 }); // the nose
  f.flat(hF([[0.06, -0.06], [0.16, -0.1], [0.25, -0.06], [0.16, -0.02]]), P.void, { op: 0.95 }); // a socket: no eye, a gap between channels
  f.flat(hF([[0.16, 0.28], [0.3, 0.26], [0.28, 0.33], [0.18, 0.34]]), P.void, { op: 0.85 }); // the mouth open on the strike
  for (let i = 0; i < 9; i++) { const r0 = hF([[-0.3 + i * 0.07, -0.3 - Math.sin(i / 8 * Math.PI) * 0.2]])[0]; forks(r0, -1.9 + i * 0.12 + hA * 0.5, 2, R(f, 60, 110), 0.4, 1.6); }
  // ---- near leg, forward, planted
  limbV(HN, KN, AN, [64, 46, 26], {}, 'thigh_n', 'shin_n', 6);
  f.bone('foot_n'); forks(AN, 0.6, 4, 90, 0.35, 2.4);
  // ---- near arm, driven forward and down: the strike
  limbV(SN, EN, WN, [44, 36, 24], {}, 'upperarm_n', 'forearm_n', 5);
  f.bone('hand_n'); forks(WN, ang(EN, WN) + 0.15, 5, 90, 0.22, 2);
  return f;
}

// ------------------------------------------------------------------ CHOIR OF EYES (cast, human 1.0, a floating cluster)
// The eyes of the dead god (the Mother of Courses), singing her last hymn. Each singer is an eye still set in a shard of
// her gilt face: a piece of brow, the lids, a fold of cheek and, under it, a small mouth open on the note. The shards
// broke from a hollow statue, so their broken edges show the thin black shell and the void behind; from the back of
// each a tapering stalk of void trails like an optic nerve, thinning into nothing. Ten of them of different sizes hang
// in a loose cluster, the biggest at its heart, all turned to the party, the far ones darker; gold leaf flakes drift
// round them. Lightning: violet burns branch across some shards, the lids of one fused half shut. Void: clean cracks,
// one eye socket empty.
// Rig: cluster (root) > eye_1..eye_10. Motion: idle the eyes singing in turn (each mouth part and its shard bobbing);
// attack a hymn that causes stress (all mouths open, the cluster swells: an engine effect).
function choirOfEyes() {
  const [CW, CH] = TIERS.human, seed = 1506;
  const f = new Fig(X.base(seed, CH, { grimeY: 3000 })); X.textures(f);
  const gy = f.o.groundY;
  f.joint('cluster', [300, 420]);
  // [centre, size (eye half-width), tilt, open, mouth (0 closed .. 1 wide), depth 0 near .. 1 far, gaze]
  const U = [
    [[250, 200], 26, -0.2, 0.55, 0.6, 0.8], [[400, 180], 20, 0.25, 0.4, 0.2, 0.9], [[150, 330], 30, -0.35, 0.7, 0.9, 0.6],
    [[470, 330], 24, 0.3, 0.6, 0.5, 0.7], [[220, 520], 22, -0.15, 0.3, 0.3, 0.5], [[420, 520], 30, 0.2, 0.65, 0.8, 0.45],
    [[320, 640], 20, 0.05, 0.75, 0.6, 0.55], [[530, 450], 16, 0.4, 0.5, 0.4, 0.85],
    [[320, 380], 46, 0.04, 0.8, 1.0, 0], [[110, 460], 18, -0.5, 0, 0.3, 0.75],
  ];
  U.forEach((u, i) => f.joint('eye_' + (i + 1), u[0], 'cluster'));
  const order = U.map((u, i) => [u, i]).sort((a, b) => b[0][5] - a[0][5]);
  for (const [[c, sz, a, op, mo, dp], i] of order) {
    f.bone('eye_' + (i + 1));
    const F = frame(c, a, sz), dim = dp * 0.45;
    const G = (o = {}) => X.GL(f, Object.assign({ fill: mix(P.gold, '#000', dim), light: mix(P.goldL, '#000', dim * 0.8), maxShade: sz * 0.5 }, o));
    // the optic stalk: a tapering void tendril from the back of the shard, curving down and away, thinning out
    const st = [F([[-0.6, 0.2]])[0], F([[-1.8, 0.9]])[0], add(F([[-2.6, 1.4]])[0], [0, sz * 0.8]), add(F([[-2.9, 1.6]])[0], [0, sz * 2.4])];
    const stS = X.ribbon(X.spline(st, 4), X.spline(st, 4).map((_, k, A) => sz * 0.55 * (1 - k / A.length) + 1.2));
    f.line([...stS, stS[0]], 3, P.vioD, { op: 0.9 }); f.flat(stS, P.void); f.line(X.spline(st, 4).slice(2, -4), 1, P.vio, { op: 0.4 });
    X.shards(f, st[3], Math.PI / 2, 2, sz / 40);
    // the shard: brow, lids, a fold of cheek and the mouth below; broken edges sharp
    const shard = F([[-1.55, -0.3, 1], [-1.2, -1.15], [-0.3, -1.45, 1], [0.5, -1.3], [1.35, -0.85, 1], [1.5, 0.2], [1.2, 1.0, 1], [0.9, 1.9], [0.3, 2.55, 1], [-0.35, 2.3], [-0.9, 1.6, 1], [-1.35, 0.8]].map(q => [q[0] + R(f, -0.18, 0.18), q[1] + R(f, -0.18, 0.18), q[2] || 0]));
    f.flat(shard.map(q => add(q, mul(f.L, -sz * 0.22))), P.void); // the shell's thickness: black void behind the broken edge
    f.line(shard.map(q => add(q, mul(f.L, -sz * 0.22))).concat([add(shard[0], mul(f.L, -sz * 0.22))]), 1.4, P.vio, { op: 0.6 });
    f.part(shard, G());
    X.gild(f, shard, { lost: 0.3 + dp * 0.2, nB: 2, s: sz / 40 });
    X.clipDraw(f, E.smooth(shard), () => {
      X.crease(f, F([[-1.1, -0.55], [-0.2, -0.85], [0.9, -0.6]]), Math.max(1.4, sz * 0.06), { col: P.goldS, lit: P.goldW, op: 0.6 }); // the brow's fold
      X.crease(f, F([[0.6, 0.7], [0.75, 1.3], [0.45, 1.75]]), Math.max(1.2, sz * 0.05), { col: P.goldS, lit: P.goldW, op: 0.5 }); // the cheek's fold beside the mouth
      if (i % 3 === 0) X.burn(f, F([[1.3, -0.6]])[0], a + 2.6, sz * 2.2, Math.max(1.2, sz * 0.05), { depth: 2, haloOp: 0.3 });
      if (i % 4 === 1) X.vcrack(f, F([[-1.4, 0.4], [-0.9, 0.7], [-0.6, 1.3]]), Math.max(2, sz * 0.1));
    });
    // the eye (one socket is empty: a clean hole onto the void)
    if (i === 9) { f.flat(F(ell([0, 0], 0.95, 0.5, 0, 22)), P.void); f.line(F(ell([0, 0], 0.98, 0.53, 0, 22)).concat([F([[0.98, 0]])[0]]), 1.4, P.ashW, { op: 0.8 }); }
    else X.eye(f, c, sz, a, { mass: false, lid: G({ tex: 'craq' + seed }), open: op, gaze: [0.7, 0.05], iris: i === 8 ? P.goldM : mix(P.vio, '#000', dim), white: mix('#e2dccc', '#000', dim * 0.6) });
    if (i === 2) { f.flat(F([[-1.0, -0.15], [0, -0.42], [1.0, -0.12], [0.6, -0.05], [0, -0.2], [-0.6, -0.05]]), mix(P.gold, '#000', 0.2)); f.line(F([[-0.9, -0.12], [0, -0.32], [0.9, -0.1]]), 2, P.vio, { op: 0.9 }); } // lids fused half shut by the strike
    // the mouth: lips round a dark opening, open on the note (or closed between notes)
    const mc = [0.15, 1.72], mw = 0.5, mh = 0.03 + mo * 0.2, lipC = mix('#8a6226', '#000', dim);
    f.flat(F(ell(add(mc, [0, mh * 0.2]), mw * 0.85, mh + 0.03, 0, 18)), '#0a0608'); // the opening
    if (mo > 0.5) f.flat(F(ell(add(mc, [0.08, mh * 0.5]), mw * 0.35, mh * 0.5, 0, 10)), P.vioS); // the throat: void, a violet depth
    f.part(F([[mc[0] - mw, mc[1] + 0.02, 1], [mc[0] - mw * 0.5, mc[1] - mh - 0.12], [mc[0] - 0.06, mc[1] - mh - 0.08], [mc[0] + 0.04, mc[1] - mh - 0.14], [mc[0] + mw * 0.55, mc[1] - mh - 0.1], [mc[0] + mw, mc[1] + 0.02, 1], [mc[0] + mw * 0.5, mc[1] - mh * 0.7], [mc[0], mc[1] - mh * 0.85], [mc[0] - mw * 0.5, mc[1] - mh * 0.7]]), G({ fill: lipC, cast: false, inkW: 1, inkHeavy: 1.4, maxShade: 3 })); // upper lip with its bow
    f.part(F([[mc[0] - mw * 0.9, mc[1] + 0.06, 1], [mc[0] - mw * 0.45, mc[1] + mh * 0.9 + 0.04], [mc[0] + mw * 0.45, mc[1] + mh * 0.9 + 0.04], [mc[0] + mw * 0.9, mc[1] + 0.06, 1], [mc[0] + mw * 0.5, mc[1] + mh + 0.22], [mc[0], mc[1] + mh + 0.26], [mc[0] - mw * 0.5, mc[1] + mh + 0.2]]), G({ fill: lipC, cast: false, inkW: 1, inkHeavy: 1.4, maxShade: 4 })); // lower lip, fuller
    f.line(F([[mc[0] - mw * 0.3, mc[1] + mh + 0.12], [mc[0] + mw * 0.3, mc[1] + mh + 0.12]]), Math.max(0.8, sz * 0.04), P.goldW, { op: 0.5 });
  }
  f.bone('cluster');
  X.leafDrift(f, [310, 400], 250, 300, 26, 1.2);
  f.bone('root');
  f.flat(ell([310, gy + 2], 150, 6, 0, 16), '#000', { op: 0.22 });
  return f;
}

// ------------------------------------------------------------------ THUNDER SERAPH (elite, 2.4)
// It holds the sky together with its spear, and it is losing. A gold-armoured seraph at true size (2.4), braced in a
// long lunge, the near leg driven back, both arms up the shaft of a spear thrust upward into a tear in the sky; the
// spear's head is lost inside the tear, a clean-rimmed rift of void across the frame top with eyes looking in. Six wings
// spread round it: the upper pair raised beside the spear, the middle pair out wide, the lower pair low over the legs.
// Some are broken: the near lower wing burnt to bare quills, the far middle wing snapped at the elbow and hanging.
// The face is a helm of gold sculpted as a serene face, eyes closed, cracked across onto the void; a crest of standing
// feathers. Lightning: burns branch down the spear and over the gauntlets, which the strike fused to the shaft; feathers
// and crest stand on end. Void: the crack across the face, a clean hole through one wing, the tear.
// Rig: standard humanoid + spear (hand_n; the far hand also holds it: IK) + skirt (pelvis) + tear (root) +
// wing_{n,f}{1,2,3}_{1,2,3} (torso). Motion: idle straining against the spear (arms and torso tremble); attack a lightning
// strike down the spear (an engine effect along the shaft).
function thunderSeraph() {
  const CW = 1300, CH = 1800, seed = 1501;
  const f = new Fig(X.base(seed, CH)); X.textures(f);
  const H = 240, gy = f.o.groundY;
  const N = [640, 650], C = [632, 836], Pv = [604, 1020];
  const S = B.spine(N, C, Pv, H);
  const SN = S.at(-0.26, 0.12), SF = S.at(0.36, 0.1);
  const spB = [826, 980], spT = [904, -20], sA = ang(spB, spT), sD = [Math.cos(sA), Math.sin(sA)];
  const onSp = y => lerp(spB, spT, (spB[1] - y) / (spB[1] - spT[1]));
  const WN = onSp(250), EN = [606, 350];
  const WF = onSp(440), EF = [980, 560];
  const HN = S.at(-0.2, 1.0), KN = [480, 1360], AN = [392, 1700];
  const HF = S.at(0.3, 1.0), KF = [850, 1320], AF = [866, 1690];
  const HC = [690, 512], hA = -0.5, neck0 = S.at(0.12, -0.04);
  X.humanJoints(f, { P: Pv, T: S.at(0, 0.86), N: neck0, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF });
  f.joint('spear', WN, 'hand_n').joint('skirt', S.at(0, 0.84), 'pelvis').joint('tear', [760, 40]);
  const W = {
    // each pair spreads differently: the upper pair half folded and raised beside the spear, the middle pair thrown wide,
    // the lower pair drooping half closed; the far middle wing snapped at the elbow and hanging
    n1: [S.at(-0.5, 0.04), [520, 450], [500, 250], [450, 100], -1], n2: [S.at(-0.5, 0.12), [390, 610], [230, 540], [30, 540], -1], n3: [S.at(-0.45, 0.24), [450, 900], [390, 1050], [340, 1240], 1],
    f1: [S.at(0.0, 0.0), [800, 440], [960, 290], [1150, 150], 1], f2: [S.at(0.06, 0.1), [910, 620], [960, 800], [985, 1000], -1], f3: [S.at(0.02, 0.22), [860, 900], [1000, 960], [1190, 1060], -1],
  };
  for (const [k, [r, e, w]] of Object.entries(W)) f.joint('wing_' + k + '_1', r, 'torso').joint('wing_' + k + '_2', e, 'wing_' + k + '_1').joint('wing_' + k + '_3', w, 'wing_' + k + '_2');
  const wing = (k, far, o = {}) => {
    const [r, e, w, tp, tr] = W[k], dim = far ? 0.3 : 0;
    const ph = k.charCodeAt(1) * 1.7 + k.charCodeAt(0);
    return X.wing(f, r, e, w, tp, Object.assign({ bones: ['wing_' + k + '_1', 'wing_' + k + '_2', 'wing_' + k + '_3'], tr, Lp: 290, Ls: 176, Wp: 32, Ws: 36, np: 10, ns: 11, nt: 4, look: X.FE(f, { fill: mix(P.plume, '#000', dim) }), skin: X.GL(f, { fill: mix(P.gold, '#000', dim) }), lift: true, rake: -0.3, wS: 64, wE: 46, wW: 34, darkTips: 0.45, spreadP: 0.45, cover: true, notchP: [2, 6], notchS: [3, 7, 9], pLen: t => 0.7 + 0.42 * Math.sin(t * 2.7) + 0.08 * Math.sin(t * 17 + ph), sLen: t => 0.84 + 0.12 * Math.sin(t * 6 + ph) + 0.06 * Math.sin(t * 19) }, o));
  };
  const CLS = (o = {}) => CLB(f, o);

  // ---- the tear in the sky: a long clean-rimmed rift of void across the frame top, eyes looking in through it
  f.bone('tear');
  const tear = [[330, 70, 1], [470, 34], [600, 12, 1], [700, -10], [840, -6, 1], [1000, 20], [1150, 60, 1], [1000, 96], [880, 120, 1], [760, 140], [640, 128, 1], [480, 100]];
  X.voidShape(f, tear, { depth: 10, rimW: 4, inside: () => { X.starfield(f, E.smooth(tear), E.bbox(tear), 30); for (const [c, sz] of [[[560, 70], 13], [[940, 56], 10], [[1060, 70], 7]]) X.eye(f, c, sz, 0.1, { lid: X.BK(f), open: 0.75, gaze: [-0.1, 0.8], iris: P.vio }); } });
  // ---- far wings, behind everything (dimmer)
  wing('f3', true, { spreadP: 0.4, Lp: 250 }); wing('f2', true, { np: 7, ns: 8, spreadP: 0.12, Lp: 220, Ls: 150 }); wing('f1', true, { spreadP: 0.5 });
  f.bone('wing_f2_2'); X.vcrack(f, [lerp(W.f2[1], W.f2[2], 0.05), add(W.f2[1], [10, 20]), lerp(W.f2[1], W.f2[2], 0.2)], 10); // snapped at the elbow
  // ---- far leg, forward
  { const ex = plateLeg(f, HF, KF, AF, 124, 88, 100, 0.25, 'seraph'); bareLegRig(f, HF, KF, AF, 96, 128, 92, CLB(f, { maxShade: 24 }), '_f', { extra: ex, nail: P.boneS }); f.bone('shin_f'); ex.knee(); }
  // ---- the spear's lower shaft (behind the arms)
  f.bone('spear');
  const shaft = (a, b, w) => { const sh = limb(a, b, w, w * 0.9, { steps: 12 }); f.part(sh, X.BK(f, { fill: '#221c24', light: '#4a4050', maxShade: 8 })); f.line([lp(a, b, 0.01, -w * 0.25), lp(a, b, 0.99, -w * 0.25)], 2, '#6a6070', { op: 0.6 }); X.burn(f, lp(a, b, 0.05, 0), ang(a, b), E.len(sub(b, a)) * 0.9, 3, { depth: 2, halo: false, wander: 0.4, clip: sh }); return sh; };
  shaft(spB, spT, 30);
  for (const y of [900, 760, 600, 140, 40]) { const q = onSp(y); f.part([add(q, rot([-6, -19], sA + Math.PI / 2)), add(q, rot([6, -19], sA + Math.PI / 2)), add(q, rot([6, 19], sA + Math.PI / 2)), add(q, rot([-6, 19], sA + Math.PI / 2))].map(x => [...x, 1]), AR(f, { maxShade: 3, cast: false, inkW: 1.2 })); } // gold bands
  f.part(ell(spB, 20, 16, sA, 12), AR(f, { maxShade: 6, cast: false })); // the butt cap
  // ---- far arm, up the shaft from the far side: black arming sleeve, gold vambrace, the gauntlet fused to the shaft
  X.muscleArm(f, SF, EF, lerp(EF, WF, 0.88), 92, 76, CLS({ fill: '#1e1a22' }), '_f', { lit: '#4a4250', vein: false });
  f.bone('forearm_f'); { const vb = [lp(EF, WF, 0.22, -40), lp(EF, WF, 0.2, 40), lp(EF, WF, 0.88, 32), lp(EF, WF, 0.9, -30)]; f.part(vb, ARD(f, { maxShade: 14 })); }
  f.bone('hand_f');
  const gF = B.grip(f, WF, EF, sA, 58, '#8a6a24', { plate: true, cuff: true, maxBend: 40, name: 'seraph far hand' });
  X.fusedRun(f, add(WF, [-10, 34]), 40, 9, AR(f)); X.burn(f, add(WF, [10, -10]), 1.2, 120, 3, { depth: 2, clip: [lp(EF, WF, 0.2, -40), lp(EF, WF, 0.2, 40), lp(EF, WF, 1.25, 40), lp(EF, WF, 1.25, -40)] });
  // ---- torso: a black arming coat under a cuirass of gold, sculpted like an idealised body
  f.bone('torso');
  const torso = S.shape([[-0.08, 0.36, 0.38], [0.06, 0.62, 0.56], [0.2, 0.7, 0.66], [0.4, 0.62, 0.6], [0.6, 0.5, 0.5], [0.8, 0.56, 0.52], [0.98, 0.62, 0.56]]);
  f.part(torso, CLS({ maxShade: 40 }));
  cuirass(f, S, { after: () => { X.stains(f, E.smooth(S.shape([[0, 0.8, 0.8], [0.8, 0.8, 0.8]])), E.bbox(S.shape([[0, 0.9, 0.9], [0.8, 0.9, 0.9]])), '#100a10', 0.016, 3, -1.7, 61, 0.8); X.dent(f, S.at(0.4, 0.22), 22, 0.4); X.dent(f, S.at(-0.2, 0.46), 16, 0.2); X.burn(f, S.at(-0.3, 0.05), 1.2, 220, 4, { depth: 3 }); X.burn(f, S.at(0.5, 0.15), 1.9, 160, 3, { depth: 3 }); f.scratches(S.at(0.2, 0.45), 60, 10, '#e6c878', 1, -0.6); } });
  // gorget and the near shoulder guard (both on the torso)
  f.part([S.at(-0.42, -0.06), S.at(0.0, -0.12), S.at(0.5, -0.04), S.at(0.5, 0.06), S.at(0.0, 0.02), S.at(-0.42, 0.06)], AR(f, { fill: '#8a6a24', maxShade: 10 }));
  f.part([S.at(-0.7, 0.04), S.at(-0.3, -0.08), S.at(0.12, 0.0), S.at(0.04, 0.16), S.at(-0.5, 0.24), S.at(-0.78, 0.16)], AR(f, { maxShade: 18 }));
  for (const u of [-0.5, -0.2]) f.rivet(S.at(u, 0.04), 4, '#a07c30');
  // a war-belt with a scabbard (empty) and a sash of black cloth knotted at the hip
  // ---- skirt of gold lames over a black kilt, to the knee
  f.bone('skirt');
  { const hem = X.charHem(f, S.at(-0.62, 1.5), S.at(0.66, 1.44), 9, 26, [0, 1]); const sk = [S.at(-0.58, 0.96), S.at(0.6, 0.94), S.at(0.66, 1.1), ...hem.slice().reverse(), S.at(-0.62, 1.1)]; f.part(sk, CLS({ maxShade: 20 })); X.clipDraw(f, E.smooth(sk), () => { for (let i = 0; i < 6; i++) X.crease(f, [S.at(-0.44 + i * 0.18, 0.9), S.at(-0.46 + i * 0.2, 1.1), S.at(-0.5 + i * 0.22, 1.4)], 3, { col: '#060408', lit: '#5a5060' }); }); X.charEdge(f, hem, 7, { gap: 8 }); }
  for (let i = 0; i < 7; i++) {
    const t = i / 6, top = lerp(S.at(-0.56, 1.02), S.at(0.56, 1.0), t), L = 120 + 30 * Math.sin(t * 3) + R(f, -12, 12), w = 50, sw = (t - 0.5) * 60;
    const st = [add(top, [-w / 2, 0]), add(top, [w / 2, 0]), add(top, [w / 2 * 0.8 + sw, L * 0.8]), add(top, [w * 0.3 + sw, L]), add(top, [sw, L + 10]), add(top, [-w * 0.3 + sw, L]), add(top, [-w / 2 * 0.8 + sw, L * 0.8])];
    f.part(st, AR(f, { fill: i % 2 ? '#8a6a24' : '#a07c30', maxShade: 10 }));
    f.line([add(top, [sw * 0.2, 8]), add(top, [sw * 0.9, L - 10])], 1.6, '#e6c878', { op: 0.45 });
    f.rivet(add(top, [0, 12]), 3, '#a07c30');
    X.clipDraw(f, E.smooth(st), () => scorch(f, add(top, [sw, L - 10]), 30, 30, 0.6));
  }
  // ---- near leg, braced back, straight: the weight drives up through it into the spear
  { const ex = plateLeg(f, HN, KN, AN, 128, 92, 104, 0, 'seraph'); bareLegRig(f, HN, KN, AN, 100, 132, 96, CLB(f, { maxShade: 26 }), '_n', { extra: ex, nail: P.boneS }); f.bone('shin_n'); ex.knee(); }
  // ---- head: a shaped helm whose face is a serene face of gold, eyes closed, lifted to look up the spear; a brow band,
  // cheek guards over the jaw, a bowl swelling over the skull with a ridge and a crest of feathers standing from the
  // strike; the face cracked across onto the void
  f.bone('head');
  const Hs = H * 0.94, hF = frame(HC, hA, Hs);
  f.part(limb(neck0, add(HC, rot([-30, 70], hA)), 120, 108), AR(f, { fill: '#7a5e22', maxShade: 24 })); // the gorget's collar
  const bowl = hF([[-0.58, 0.32], [-0.64, -0.06], [-0.52, -0.44], [-0.2, -0.64], [0.14, -0.62], [0.32, -0.48], [0.26, -0.3], [0.0, -0.36], [-0.2, -0.16], [-0.26, 0.3]]);
  f.part(bowl, AR(f, { maxShade: 40 }));
  X.clipDraw(f, E.smooth(bowl), () => { X.softTone(f, E.smooth(bowl), [[hF([[-0.66, -0.1], [-0.34, -0.1], [-0.3, 0.34], [-0.62, 0.34]]), '#140a02', 0.55, 16], [hF(ell([-0.02, -0.5], 0.2, 0.09, 0, 14)), '#fff6d0', 0.6, 12]]); X.formHatch(f, hF([[-0.6, -0.2], [-0.56, 0.1], [-0.46, 0.3]]), 28, { op: 0.45 }); scorch(f, hF([[-0.4, 0.1]])[0], 40, 30, 0.5); });
  f.line(hF([[-0.5, -0.44], [-0.18, -0.64], [0.16, -0.62]]), 3, INK, { op: 0.6 }); f.line(hF([[-0.46, -0.48], [-0.16, -0.66], [0.12, -0.66]]), 2.4, '#f6dc90', { op: 0.6 }); // the bowl's ridge
  const hd = B.head(f, HC, Hs, hA, { skin: '#b08a34', jaw: 0.96, chin: 0.0, nose: 1.0, hook: 0.0, mouth: 'set', blind: true, browDown: 0.0, lips: true, faceShade: 0.82, faceHatch: false, noEar: true, browCol: '#6a4e1a', browW: 0.025 });
  const face = hd([[-0.3, -0.4], [0.18, -0.47], [0.355, -0.13], [0.33, 0.21], [0.29, 0.47], [0.13, 0.535], [-0.06, 0.47], [-0.21, 0.27], [-0.37, -0.13]]);
  X.clipDraw(f, E.smooth(face), () => {
    X.softTone(f, E.smooth(face), [[hd([[-0.4, -0.3], [-0.04, -0.2], [0.0, 0.2], [-0.1, 0.5], [-0.4, 0.4]]), '#140a02', 0.55, 16], [hd(ell([0.2, 0.08], 0.08, 0.05, -0.3, 12)), '#fff6d0', 0.55, 10], [hd(ell([0.14, 0.22], 0.07, 0.04, -0.2, 12)), '#140a02', 0.4, 10], [hd(ell([0.12, -0.05], 0.1, 0.05, 0, 12)), '#140a02', 0.5, 8], [hd(ell([0.1, -0.19], 0.1, 0.03, 0, 12)), '#fff6d0', 0.55, 6]]);
    X.formHatch(f, hd([[-0.04, -0.3], [-0.02, -0.05], [0.0, 0.2], [0.08, 0.38], [0.16, 0.5]]), Hs * 0.06, { op: 0.45 });
  });
  for (const [a2, b2] of [[[0.06, -0.055], [0.17, -0.05]], [[0.27, -0.06], [0.31, -0.055]]]) { f.line(hd([a2, [(a2[0] + b2[0]) / 2, -0.035], b2]), 3.4, '#1e1206'); f.line(hd([[a2[0], a2[1] - 0.025], [(a2[0] + b2[0]) / 2, -0.085], [b2[0], b2[1] - 0.02]]), 1.6, '#1e1206', { op: 0.6 }); } // closed lids and their creases
  f.line(hd([[0.3, -0.08], [0.36, 0.05], [0.395, 0.12], [0.35, 0.165]]), 2.6, '#1e1206', { op: 0.7 }); f.line(hd([[0.31, -0.04], [0.37, 0.08]]), 3, '#fff0c0', { op: 0.6 });
  // the brow band and the cheek guard, riveted, over the face's edge
  const band = hF([[0.3, -0.42], [0.06, -0.38], [-0.22, -0.24], [-0.3, -0.12], [-0.24, -0.08], [0.0, -0.28], [0.32, -0.34]]); f.part(band, AR(f, { fill: '#8a6a24', maxShade: 8 }));
  const cheek = hF([[-0.24, -0.08], [-0.06, 0.0], [0.02, 0.3], [-0.02, 0.5], [-0.2, 0.46], [-0.3, 0.2]]); f.part(cheek, AR(f, { maxShade: 16 }));
  X.clipDraw(f, E.smooth(cheek), () => X.softTone(f, E.smooth(cheek), [[hF([[-0.3, 0.0], [-0.16, 0.0], [-0.16, 0.5], [-0.3, 0.5]]), '#140a02', 0.5, 10]]));
  for (const q of [[-0.16, 0.06], [-0.12, 0.4], [0.1, -0.33], [-0.1, -0.26]]) f.rivet(hF([q])[0], 3.4, '#a07c30');
  X.vcrack(f, hd([[-0.36, 0.06], [-0.1, -0.02], [0.12, 0.04], [0.26, -0.0], [0.4, 0.06]]), 12, { dark: '#2a1a0a' }); // cracked across
  X.crackV(f, hd([[0.0, 0.0]])[0], hA + 1.3, 50, 6, { depth: 1, dark: '#2a1a0a' });
  X.burn(f, hF([[-0.4, -0.3]])[0], hA - 0.4, 120, 3, { depth: 2, clip: bowl });
  // the crest: feathers standing on end from the strike, set in a socket on the ridge
  for (let i = 0; i < 9; i++) { const r0 = hF([[-0.44 + i * 0.07, -0.56 - Math.sin(i / 8 * Math.PI) * 0.06]])[0], a2 = hA - Math.PI / 2 - 0.8 + i * 0.13 + R(f, -0.08, 0.08); X.feather(f, r0, a2, R(f, 110, 170), 26, X.FE(f, { fill: i % 3 ? P.plume : mix(P.plume, '#000', 0.2) }), { lead: 0.4, round: true, lift: 2, dark: 0.3 }); }
  f.part(hF([[-0.5, -0.56], [-0.2, -0.7], [0.18, -0.66], [0.18, -0.56], [-0.2, -0.6], [-0.5, -0.48]]), AR(f, { maxShade: 10 })); // the crest's socket
  // ---- near wings, then the near arm over them
  wing('n3', false, { np: 7, ns: 7, look: X.FE(f, { fill: '#4a4448' }), darkTips: 0.7, spreadP: 0.2, Lp: 240 }); // the lowest, drooping, burnt to grey
  f.bone('wing_n3_2'); X.burn(f, lerp(W.n3[1], W.n3[2], 0.5), 2.2, 120, 3, { depth: 2, clip: ell(lerp(W.n3[1], W.n3[2], 0.5), E.len(sub(W.n3[2], W.n3[1])) * 0.6, 40, ang(W.n3[1], W.n3[2]), 16) });
  wing('n2', false, { spreadP: 0.72, Lp: 310, np: 11 });
  f.bone('wing_n2_3'); X.cutHoles(f, [], () => {}); X.voidDisk(f, lerp(W.n2[2], W.n2[3], 0.4), 18, 14, 0.3);
  wing('n1', false, { spreadP: 0.12, Lp: 260, ns: 9 });
  f.bone('wing_n1_2'); X.burn(f, lerp(W.n1[1], W.n1[2], 0.3), -2.2, 140, 3, { depth: 2, clip: ell(lerp(W.n1[1], W.n1[2], 0.45), E.len(sub(W.n1[2], W.n1[1])) * 0.6, 40, ang(W.n1[1], W.n1[2]), 16) });
  // ---- near arm, high on the shaft
  X.muscleArm(f, SN, EN, lerp(EN, WN, 0.88), 96, 80, CLS({ fill: '#26222a' }), '_n', { lit: '#4a4250', vein: false });
  f.bone('torso'); G.pauldron(f, add(SN, [-10, -6]), 58, -0.5, '#a07c30', '#7a5e22', 3); X.burn(f, add(SN, [-30, 10]), 2.0, 90, 2.4, { depth: 2, clip: ell(add(SN, [-10, 20]), 70, 50, -0.5, 14) });
  f.bone('forearm_n'); { const vb = [lp(EN, WN, 0.22, -44), lp(EN, WN, 0.2, 44), lp(EN, WN, 0.88, 34), lp(EN, WN, 0.9, -32)]; f.part(vb, AR(f, { maxShade: 14 })); X.clipDraw(f, E.smooth(vb), () => { scorch(f, lp(EN, WN, 0.6, 0), 40, 20, 0.5); X.burn(f, lp(EN, WN, 0.85, 0), ang(WN, EN), 140, 3, { depth: 2 }); }); }
  f.bone('hand_n');
  const gN = B.grip(f, WN, EN, sA, 60, '#a07c30', { plate: true, cuff: true, maxBend: 40, name: 'seraph near hand' });
  X.fusedRun(f, add(WN, [-14, 36]), 50, 10, AR(f)); X.fusedRun(f, add(WN, [20, 40]), 26, 7, AR(f));
  f.bone('root');
  f.flat(ell([620, gy + 4], 420, 14, 0, 20), '#000', { op: 0.3 });
  X.leafDrift(f, [620, 1500], 400, 200, 18, 1.6);
  return f;
}

// a circle as an SVG path (a clip region)
const circ = (c, r) => `M${(c[0] + r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] - r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] + r).toFixed(1)},${c[1].toFixed(1)}Z`;

// ------------------------------------------------------------------ RIFT LEVIATHAN (elite, 2.5)
// It swims in the space between the stars. A vast eel whose body is black void with stars inside it, edged in violet,
// coiling out of a tear in the sky and back into it; only part of it is in frame. Volume: the body is a tube of night
// (stars thin out toward its edges, a soft violet-dark band inside each edge), a long dorsal fin of dark membrane on
// rays runs along its back, a lateral line, gill slits. The moray head lunges toward the party with its jaws open,
// lined with needle teeth of gold leaf cracked over black, the throat a deeper dark; a row of small eyes along the
// brow. Lightning: violet burns branch across the fin membrane, which the strike has frayed and fused at its edge.
// Rig: tear (root), seg_1..seg_8 (a chain from the tail end), head, jaw; coil_1, coil_2 (the loop at the top, re-entering
// the tear). Motion: idle a slow coil (the seg chain rolls); attack a lunge through the tear (segs straighten, jaw drops).
function riftLeviathan() {
  const [CW, CH] = TIERS.elite, seed = 1502;
  const f = new Fig(X.base(seed, CH, { grimeY: 4000 })); X.textures(f);
  const gy = f.o.groundY;
  // the body's centreline: out of the tear low down, a sweep right and up, over into the neck, the head lunging right
  const ctrl = [[200, 1120], [380, 1210], [640, 1210], [870, 1090], [960, 860], [880, 640], [660, 560], [560, 430], [580, 300], [660, 230]];
  const C = X.spline(ctrl, 6), Sx = X.arcLen(C), T = Sx[Sx.length - 1];
  const wAt = t => 22 + 86 * Math.pow(t, 0.62) - 14 * Math.max(0, t - 0.9) * 10; // thin out of the tear, heavy at the neck
  const W = C.map((_, i) => wAt(Sx[i] / T) * 2);
  const at = u => { let i = 1; while (i < C.length - 1 && Sx[i] < u) i++; const d = E.norm(sub(C[i], C[i - 1])); return { p: lerp(C[i - 1], C[i], Math.max(0, Math.min(1, (u - Sx[i - 1]) / ((Sx[i] - Sx[i - 1]) || 1)))), d, n: [-d[1], d[0]], w: wAt(u / T) }; };
  const NS = 8, segU = k => T * k / NS;
  f.joint('tear', [240, 700]);
  for (let k = 0; k < NS; k++) f.joint('seg_' + (k + 1), at(segU(k)).p, k ? 'seg_' + k : 'tear');
  const hd0 = at(T);
  f.joint('head', hd0.p, 'seg_' + NS).joint('jaw', add(hd0.p, [120, 40]), 'head');
  // the upper coil: a loop of the same body further back, out of the tear and back in
  const cc = X.spline([[220, 250], [380, 150], [520, 200], [520, 330], [400, 420], [230, 430]], 6), cS = X.arcLen(cc), cT = cS[cS.length - 1];
  const cW = cc.map((_, i) => 96 - 50 * (cS[i] / cT)); // further back on the body: thinner toward the tail inside the tear
  f.joint('coil_1', cc[0], 'tear').joint('coil_2', cc[Math.floor(cc.length / 2)], 'coil_1');
  // one stretch of the body. Its back (fside) carries a dorsal ridge of small black scutes and a fin of torn membrane on
  // uneven rays; its belly a row of ventral plates of dark hide, each curved round the body and lit on its upper lip;
  // between them the flank is open void with stars, a soft dark band inside each edge giving the tube its roundness.
  const body = (Cl, Wl, fside, o = {}) => {
    const n = Cl.length, rib = X.ribbon(Cl, Wl), d = E.smooth(rib), bb = E.bbox(rib), wv = t => Wl[Math.round(t * (n - 1))] / 2;
    const Sx2 = X.arcLen(Cl), T2 = Sx2[n - 1], idx = u => { let i = 1; while (i < n - 1 && Sx2[i] < u) i++; return i; };
    // the fin: rays at uneven spacing and length, the membrane slung between their tips and sagging, torn out in places
    const rays = []; for (let u = R(f, 10, 30); u < T2 - 20; u += R(f, 16, 38)) { const i = idx(u), t = u / T2, dd = E.norm(sub(Cl[Math.min(n - 1, i + 1)], Cl[i - 1])), nn = mul([-dd[1], dd[0]], fside), base = add(Cl[i], mul(nn, wv(t) * 0.9)); const h = (12 + 46 * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (o.finH ?? 1)) * R(f, 0.6, 1.25), a = Math.atan2(nn[1], nn[0]) - fside * R(f, 0.3, 0.6); rays.push({ base, tip: add(base, rot([h, 0], a)), h }); }
    for (let k = 0; k < rays.length - 1; k++) {
      const A = rays[k], Bq = rays[k + 1]; if (f.r() < 0.16) continue; // torn away between these rays
      const sag = lerp(lerp(A.tip, Bq.tip, 0.5), lerp(A.base, Bq.base, 0.5), R(f, 0.15, 0.45)), mem = [A.base, A.tip, sag, Bq.tip, Bq.base];
      f.flat(mem, P.vioS, { op: 0.9 }); f.line([A.tip, sag, Bq.tip], 1.4, P.vioL, { op: 0.7 });
      if (f.r() < 0.25) X.burn(f, lerp(A.base, A.tip, 0.3), ang(A.base, A.tip), A.h * 0.8, 1.4, { depth: 1, halo: false, clip: mem });
      if (f.r() < 0.2) f.flat(ell(lerp(lerp(A.base, Bq.tip, 0.5), sag, 0.3), 4, 3, 0, 8), P.void); // a hole torn in it
    }
    for (const r of rays) { f.stroke([r.base, lerp(r.base, r.tip, 0.5), r.tip], 4.4, P.vioD); f.line([r.base, lerp(r.base, r.tip, 0.85)], 1.1, P.vio, { op: 0.8 }); }
    // the body
    f.line([...rib, rib[0]], 6, P.vioD, { op: 0.95 });
    f.line([...rib, rib[0]], 1.8, P.vioL, { op: 0.85 });
    f.flat(d, P.void);
    X.clipDraw(f, d, () => {
      X.starfield(f, d, bb, Math.round((bb[2] - bb[0]) * (bb[3] - bb[1]) / 1100));
      for (const sg of [1, -1]) f.raw(`<path d="${E.smooth(X.offsetLine(Cl, t => sg * wv(t)), false)}" fill="none" stroke="${P.void}" stroke-width="${(o.band ?? 50)}" opacity="0.85" filter="url(#smkL${seed})"/>`);
      f.raw(`<path d="${E.smooth(X.offsetLine(Cl, t => fside * (wv(t) - 4)), false)}" fill="none" stroke="${P.vioD}" stroke-width="10" opacity="0.7" filter="url(#smk${seed})"/>`);
      // the ventral plates (independent review): broad scutes on the belly that grow from small at the tail to large at
      // the neck, vary a little one to the next, bend with the body (each edge is laid along the curving centreline, so
      // a plate on a bend fans open on the outside and crowds on the inside), and lap forward: each plate's free hind
      // edge rides over the one behind it, lit along its lip, its shadow dropped on the plate it covers
      const onC = (u, k) => { const i = idx(Math.max(0, Math.min(T2 - 1, u))), dd = E.norm(sub(Cl[Math.min(n - 1, i + 1)], Cl[i - 1])), nn = mul([-dd[1], dd[0]], -fside); return add(Cl[i], mul(nn, wv(u / T2) * k)); };
      const KS = [1.03, 0.82, 0.6, 0.4, 0.24];
      for (let u = 10, j = 0; u < T2 - 10; j++) {
        const t = u / T2, w = wv(t), pw = Math.max(7, w * (0.18 + 0.3 * t) * R(f, 0.85, 1.15)), bul = k => pw * 0.42 * Math.sin(Math.PI * (k - 0.2) / 0.86);
        const back = KS.map(k => onC(u + bul(k), k)), front = KS.slice().reverse().map(k => onC(u + pw + bul(k), k * (k > 0.3 ? 1 : 1.1)));
        const pl = [...back, ...front];
        f.flat(back.map(q => add(q, mul(f.L, -4))).concat(back.slice().reverse()), '#000', { op: 0.55 }); // the shadow under its hind lip on the plate behind
        f.part(pl, { fill: mix('#2c2636', '#000', (j % 3) * 0.08), shadow: '#0a080e', light: '#5e5470', shade: 0.4, tex: 'craze' + seed, texOp: 0.4, inkW: 1.2, inkHeavy: 1.8, cast: false, maxShade: Math.max(3, pw * 0.3) });
        f.line(back.slice(0, 4).map(q => add(q, mul(f.L, 1.4))), Math.max(1, pw * 0.08), P.vioL, { op: 0.6 }); // the lit lip
        if (pw > 16) f.line([onC(u + pw * 0.5 + bul(0.9) * 0.6, 0.92), onC(u + pw * 0.5 + bul(0.5) * 0.6, 0.5)], 1, P.vioD, { op: 0.5 }); // wear scored across the bigger plates
        u += pw * R(f, 0.72, 0.84);
      }
      f.line(X.offsetLine(Cl, t => fside * wv(t) * 0.1), 1.6, P.vio, { op: 0.45, dash: '10 7' }); // the lateral line
    });
    // the dorsal ridge: small black scutes along the back
    for (let u = 8; u < T2 - 6; u += R(f, 12, 22)) { const i = idx(u), t = u / T2, dd = E.norm(sub(Cl[Math.min(n - 1, i + 1)], Cl[i - 1])), nn = mul([-dd[1], dd[0]], fside), q = add(Cl[i], mul(nn, wv(t) * 0.96)), h = 4 + wv(t) * 0.12; const sc = [add(q, mul(dd, -h)), add(add(q, mul(nn, h * 1.2)), mul(dd, h * 0.4)), add(q, mul(dd, h))].map(x => [...x, 1]); f.line([...sc, sc[0]], 2, P.vioD); f.flat(sc, '#1a1622'); }
    return rib;
  };
  // the main body casts its shadow over the coil it passes in front of (depth where coils cross)
  const castShadow = (Cl, Wl, region) => X.clipDraw(f, region, () => f.raw(`<path d="${E.smooth(X.ribbon(Cl.map(q => add(q, mul(f.L, -22))), Wl))}" fill="#000" opacity="0.75" filter="url(#smkL${seed})"/>`));
  // the upper coil, re-entering the tear (behind it)
  split(f, () => body(cc, cW, 1, { band: 50 }), [['coil_1', side(cc[Math.floor(cc.length / 2)], mul(E.norm(sub(cc[Math.floor(cc.length / 2) + 1], cc[Math.floor(cc.length / 2) - 1])), -1), 40)], ['coil_2', side(cc[Math.floor(cc.length / 2)], E.norm(sub(cc[Math.floor(cc.length / 2) + 1], cc[Math.floor(cc.length / 2) - 1])), 40)]]);
  f.bone('coil_2'); castShadow(C, W, E.smooth(X.ribbon(cc, cW)));
  // the main body, cut into the seg chain
  const cuts = [];
  for (let k = 0; k < NS; k++) {
    // the overlap disk at each cut is wider than the body plus its fin (independent review), so the straight part of a
    // cut never crosses the drawing and leaves no antialiased tick in the rim; the clip circle grows to hold the disks
    const a = at(segU(k)), b = at(segU(k + 1)), m = at((segU(k) + segU(k + 1)) / 2), rr = q => Math.min(q.w + 80, 190), regs = [circ(m.p, Math.max(E.len(sub(b.p, a.p)) * 0.75, 260) + 130)];
    if (k > 0) regs.push(side(a.p, a.d, rr(a)));
    if (k < NS - 1) regs.push(side(b.p, mul(b.d, -1), rr(b)));
    cuts.push(['seg_' + (k + 1), regs]);
  }
  split(f, () => body(C, W, 1), cuts);
  // gill slits behind the head (on the last segment)
  f.bone('seg_' + NS);
  for (let i = 0; i < 3; i++) { const g = at(T - 60 - i * 26); f.line([add(g.p, mul(g.n, -g.w * 0.5)), add(add(g.p, mul(g.d, 8)), mul(g.n, -g.w * 0.1)), add(g.p, mul(g.n, g.w * 0.3))], 3, P.vio, { op: 0.7 }); }
  // ---- the head: a moray's skull of void, jaws open, needle teeth of gold, a row of eyes along the brow
  const hA = -0.16, HF = frame(hd0.p, hA, 0.82);
  const jA = 0.5, jp = HF([[60, 30]])[0], J = pts => HF(pts).map(q => add(jp, rot(sub(q, jp), jA)));
  const tooth = (b, a, L, w) => { const tp = add(b, rot([L, 0], a)), n = rot([0, w / 2], a); const t = [add(b, n), add(lerp(b, tp, 0.6), mul(n, 0.7)), [...tp, 1], add(b, mul(n, -1))]; f.part(t, X.GL(f, { shade: 0.3, inkW: 1, inkHeavy: 1.3, cast: false, maxShade: 2, tex: undefined })); f.line([lerp(b, tp, 0.2), lerp(b, tp, 0.8)], 0.8, P.goldW, { op: 0.6 }); if (f.r() < 0.4) f.line([lerp(b, tp, 0.3), add(lerp(b, tp, 0.5), mul(n, 0.4))], 0.9, P.blackD, { op: 0.8 }); };
  f.bone('jaw');
  const jaw = J([[40, 20], [120, 34], [240, 44], [330, 44], [360, 56], [320, 74], [220, 86], [100, 84], [30, 64]]);
  f.line([...jaw, jaw[0]], 6, P.vioD, { op: 0.95 }); f.line([...jaw, jaw[0]], 1.8, P.vioL, { op: 0.85 }); f.flat(jaw, P.void);
  X.clipDraw(f, E.smooth(jaw), () => X.starfield(f, E.smooth(jaw), E.bbox(jaw), 40));
  f.part(J([[80, 30], [200, 38], [340, 40], [350, 50], [200, 50], [80, 42]]), X.GL(f, { maxShade: 3, cast: false, inkW: 1.2 })); // the gum line, gilt
  for (let i = 0; i < 10; i++) { const q = J([[96 + i * 25, 32 + i * 0.6]])[0]; tooth(q, hA + jA - Math.PI / 2 + 0.2 + R(f, -0.12, 0.12), R(f, 22, 40) * (i % 3 === 1 ? 1.3 : 1), R(f, 8, 11)); }
  f.bone('head');
  f.flat(HF([[40, 0], [200, 20], [350, 30], [320, 90], [180, 150], [60, 120]]).map(q => add(jp, rot(sub(q, jp), jA * 0.5))), '#000'); // the gape: deeper than the body, no stars
  f.flat(ell(HF([[90, 40]])[0], 50, 30, hA + 0.4, 14), P.vioS, { op: 0.9 }); // the throat
  const skull = HF([[-60, -110], [40, -128], [160, -118], [280, -86], [370, -40], [392, 4], [360, 20], [240, 24], [120, 30], [40, 36], [-60, 60]]);
  f.line([...skull, skull[0]], 6, P.vioD, { op: 0.95 }); f.line([...skull, skull[0]], 1.8, P.vioL, { op: 0.85 }); f.flat(skull, P.void);
  X.clipDraw(f, E.smooth(skull), () => { X.starfield(f, E.smooth(skull), E.bbox(skull), 70); f.raw(`<path d="${E.smooth(skull)}" fill="none" stroke="${P.void}" stroke-width="50" opacity="0.8" filter="url(#smkL${seed})"/>`); f.line(HF([[60, -120], [160, -96], [300, -60]]), 1.4, P.vio, { op: 0.45 }); });
  f.part(HF([[70, 26], [200, 18], [350, 14], [380, 8], [360, 24], [200, 30], [70, 38]]), X.GL(f, { maxShade: 3, cast: false, inkW: 1.2 }));
  for (let i = 0; i < 11; i++) { const q = HF([[90 + i * 26, 26 - i * 1.2]])[0]; tooth(q, hA + Math.PI / 2 - 0.25 + R(f, -0.12, 0.12), R(f, 22, 44) * (i % 4 === 2 ? 1.35 : 1), R(f, 8, 11)); }
  // eyes along the brow, small, all looking forward at the party
  for (const [u, v, sz] of [[250, -70, 13], [196, -88, 10], [300, -50, 9], [150, -98, 8], [110, -104, 6], [340, -32, 6]]) X.eye(f, HF([[u, v]])[0], sz, hA, { lid: X.BK(f, { fill: '#2a2236' }), open: 0.7, gaze: [0.9, 0.1], iris: P.vio, inkW: 1 });
  X.shards(f, HF([[-60, -110]])[0], -2.2, 3, 1.2);
  // ---- the tear: a long clean-edged rift of void, the body entering and leaving it (drawn over the body's ends)
  f.bone('tear');
  const tear = [[236, 60, 1], [280, 200], [312, 330, 1], [300, 470], [334, 640, 1], [318, 820], [336, 960, 1], [290, 1150], [222, 1340, 1], [196, 1160], [164, 990, 1], [176, 820], [136, 640, 1], [168, 470], [150, 300, 1], [196, 170]];
  X.voidShape(f, tear, { depth: 8, rimW: 4, inside: () => { X.starfield(f, E.smooth(tear), E.bbox(tear), 120); X.eye(f, [230, 700], 14, -1.5, { lid: X.BK(f), open: 0.6, gaze: [0, 0.8], iris: P.vio }); } });
  X.leafDrift(f, [330, 700], 60, 400, 10, 1.2); // gold leaf torn off heaven's edge, drifting into the rift
  return f;
}

// ------------------------------------------------------------------ THE SHATTERED GOD (ruler 5, the last ruler)
// What remains of the Mother of Courses, who held all six courses: a vast seated woman of gold-leafed stone like a
// cathedral Madonna, hollow, broken in the war of heaven into pieces that hang apart in the air. No will is left in her.
// Cropped on every side, as a cathedral is seen from inside. The pieces: the veiled head bowed toward the party with its
// six-rayed nimbus broken behind it; the shoulders and breast with the heart broken out, the Tooth floating in the void
// where the heart was; the near forearm and the open hand drifting forward, palm up, two fingers gone; the far hand
// raised in blessing; the lap and knees under heavy drapery. Her eyes are gone (they are scattered through the void
// worlds as the Starless Eye, the Choir and the Garden's eyes): the sockets are empty with clean rims, and the void runs
// out of them like tears. Her mouth is gone, a clean hole. Every break shows the thin black shell of the statue and the
// void inside; the void leaks out of the cracks and falls in clean-edged streams that thin into shards.
// Lightning: violet Lichtenberg burns branch over every piece, gold melted at the breaks and frozen in runs, the iron
// cramps that pinned the statue together sheared and scorched. No arcs are drawn between the pieces: what holds them in
// the air is the engine's lightning FX, never baked in.
// Rig (the parts in the Motion line): root; head > face_crack (no separate face: the head drifts as one), nimbus; chest
// > tooth; arm_n (the near forearm and hand, one floating piece); hand_f; lap; chips. Each piece is its own bone parented
// to root so it can drift apart and back. Motion: idle fragments drifting slowly apart and back; attack a discharge from
// every crack (engine FX from the crack points).
function shatteredGod() {
  const [CW, CH] = TIERS.ruler, seed = 1500;
  const f = new Fig(X.base(seed, CH, { grimeY: 5000 })); X.textures(f);
  const GLD = (o = {}) => X.GL(f, Object.assign({ shade: 0.46, texOp: 0.35 }, o));
  const HC = [884, 300], Hh = 470, hA = 0.5;
  f.joint('lap', [900, 1420]).joint('chest', [840, 1000]).joint('tooth', [900, 990], 'chest').joint('head', [760, 760]).joint('nimbus', [820, 250], 'head');
  f.joint('arm_n', [520, 1180]).joint('hand_f', [1420, 1000]).joint('mantle', [420, 900]).joint('chips', [800, 800]);
  const back = mul(f.L, 1), lit = mul(f.L, -1);
  // a floating piece: the black stone shell's thickness on the side away from the light, the gilt face over it, then
  // gold leaf in large plates (black only in the cracks, chips and recesses), then the carving drawn by inside()
  const piece = (shape, o = {}) => {
    const th = o.th ?? 26, sh = shape.map(q => add(q, mul(back, th)));
    f.part(sh, { fill: '#26222a', shadow: '#08060a', light: '#4a4450', shade: 0.3, tex: 'chisel' + seed, texOp: 0.7, inkW: 1.6, inkHeavy: 2.6, cast: false, maxShade: 8 });
    f.part(shape, GLD(Object.assign({ maxShade: o.ms ?? 70 }, o.look || {})));
    const d = E.smooth(shape);
    if (o.inside) X.clipDraw(f, d, o.inside);
    X.leaf(f, shape, { cell: o.cell ?? 80, s: 1.6, chips: o.chips ?? 7, nB: o.nB ?? 2, open: 0.18 });
    return d;
  };
  const brk = (a, b, n, amp) => { const out = []; for (let i = 0; i <= n; i++) { const t = i / n, q = lerp(a, b, t), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; out.push([...add(q, mul(nn, i === 0 || i === n ? 0 : R(f, -amp, amp))), 1]); } return out; };
  const leak = (p, L, w, o = {}) => {
    const pts = [p]; let q = p; for (let i = 1; i <= 6; i++) { q = add(q, [Math.sin(i * 1.3 + p[0]) * w * 0.25, L / 6]); pts.push(q); }
    const C2 = X.spline(pts, 5), rib = X.ribbon(C2, C2.map((_, i, A) => w * Math.max(0.15, 1 - i / A.length * 1.05) + 1));
    f.line([...rib, rib[0]], 2.4, P.vioD, { op: 0.9 }); f.flat(rib, P.void); f.line(C2.slice(1, -3).map(z => add(z, [-w * 0.2, 0])), 1, P.vio, { op: 0.4 });
    for (let k = 0; k < (o.drops ?? 2); k++) { const c = add(q, [R(f, -3, 3), 16 + k * 22]), r = w * 0.32 * (1 - k * 0.3) + 1.5; f.line(ell(c, r, r * 1.3, 0, 10).concat([ell(c, r, r * 1.3, 0, 10)[0]]), 1.8, P.vioD); f.flat(ell(c, r, r * 1.3, 0, 10), P.void); }
    if (o.shards !== false) X.shards(f, add(q, [0, 30 + (o.drops ?? 2) * 22]), Math.PI / 2, 2, w / 30);
  };
  const cramp = (p, a, L) => { const q = add(p, rot([L, 0], a)); f.flat(ell(p, 15, 9, a, 10), '#5a5a62', { op: 0.9 }); f.part(limb(p, q, 13, 11, { steps: 4 }), { fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.4, inkW: 1.4, cast: false }); f.flat(ell(q, 5.5, 6.5, a, 8), '#1a1218'); f.line([p, lerp(p, q, 0.7)], 1.2, P.vio, { op: 0.6 }); };
  // a palm's creases, its mound and its hollow (godHand palmIn; k squashes it for a foreshortened palm)
  const palmLines = (F, k = 1) => {
    X.softTone(f, E.smooth(F([[-0.1, -0.3], [0.6, -0.3], [0.6, 0.3], [-0.1, 0.3]])), [[F(ell([0.12, 0.12 * k], 0.12, 0.08 * Math.abs(k), 0.3, 12)), '#fff0c0', 0.4, 8], [F(ell([0.3, -0.02 * k], 0.14, 0.08 * Math.abs(k), 0, 12)), '#140a02', 0.45, 10], [F(ell([0.2, -0.16 * k], 0.12, 0.04 * Math.abs(k), 0, 12)), '#fff0c0', 0.25, 6]]);
    for (const [pts, w] of [[[[0.36, 0.17], [0.22, 0.13], [0.1, 0.1], [0.0, 0.07]], 4], [[[0.44, -0.18], [0.4, -0.06], [0.38, 0.05], [0.4, 0.12]], 3.4], [[[0.36, 0.16], [0.3, 0.04], [0.26, -0.1], [0.24, -0.18]], 3]]) X.crease(f, F(pts.map(p => [p[0], p[1] * k])), w, { col: '#1a0e04', lit: '#f6dc90', op: 0.7 });
  };
  // model a big stone hand: hatching down each finger's shadow side, knuckle bumps lit, a crack across two fingers
  const handModel = (h, o = {}) => {
    h.fing.forEach((g, i) => {
      if (g.cut) return;
      X.formHatch(f, [g.k0, g.k1, g.k2, g.k3], g.W * 0.32, { w: 1.2, op: 0.5 });
      for (const k of [g.k1, g.k2]) f.flat(ell(add(k, mul(lit, g.W * 0.15)), g.W * 0.22, g.W * 0.14, 0, 10), P.goldW, { op: 0.35 });
      if (i === 0 || i === 2) { const c = lerp(g.k1, g.k2, 0.45), d = E.norm(sub(g.k2, g.k1)), nn = [-d[1], d[0]]; X.vcrack(f, [add(c, mul(nn, g.W * 0.55)), add(add(c, mul(nn, 0)), mul(d, g.W * 0.12)), add(c, mul(nn, -g.W * 0.55))], 5); }
      if (o.tipNails) { const d = E.norm(sub(g.k3, g.k2)), nn = [-d[1], d[0]], e = add(g.k3, mul(d, -g.W * 0.05)); f.part([add(e, mul(nn, g.W * 0.32)), add(add(e, mul(d, g.W * 0.28)), mul(nn, g.W * 0.2)), add(add(e, mul(d, g.W * 0.34)), mul(nn, -g.W * 0.12)), add(e, mul(nn, -g.W * 0.3))], GLD({ fill: P.goldL, maxShade: 3, cast: false, inkW: 1.2 })); }
    });
    X.formHatch(f, h.thumb, 16, { w: 1.2, op: 0.5 });
  };

  // ================= the nimbus: a great ring of gold broken in pieces, six rays standing out of it, one for each course
  // she held (independent review: rays set round the part of the ring the frame shows, thicker, and each carrying its
  // course's own mark from bible 00 so the six read: fire splits and chars, frost rimes and hangs icicles, lightning
  // burns and fuses, water swells and grows barnacles, toxin ripens into pustules and brackets, void cuts clean holes)
  f.bone('nimbus');
  const nc = [820, 250];
  const ringEnds = X.crackedHalo(f, nc, 540, 500, 0.1, 72, [0.09, 0.255, 0.414, 0.5, 0.716, 0.89], { drift: 24, lost: 0.12, capW: 0.07 });
  const courseRay = (t, len, course, snapped) => {
    const b0 = add(nc, rot([Math.cos(t) * 570, Math.sin(t) * 530], 0.1)), a = Math.atan2(Math.sin(t) * 530, Math.cos(t) * 570) + 0.1;
    const RF = frame(b0, a, 1), w = 46, sw = course === 'water' ? 1 : 0;
    const prof = u => w * (1 - u * 0.78) * (1 + sw * 0.45 * Math.sin(Math.PI * Math.min(1, u * 1.4)));
    const top = [], bot = []; for (let i = 0; i <= 10; i++) { const u = i / 10 * (snapped ? 0.999 : 0.96); top.push([u * len, -prof(u)]); bot.push([u * len, prof(u) * (course === 'water' ? 1.2 : 1)]); }
    const end = snapped ? brk(RF([[len, -prof(1)]])[0], RF([[len, prof(1)]])[0], 4, 8) : [[...RF([[len * 1.04, 0]])[0], 1]];
    const ray = [...RF(top), ...end, ...RF(bot).reverse()];
    f.part(RF([[-6, -w - 8], [-6, w + 8], [10, w], [10, -w]]), GLD({ maxShade: 6, cast: false })); // the socket where it is set into the ring
    const holes = course === 'void' ? [[RF([[len * 0.4, 6]])[0], 15], [RF([[len * 0.66, -4]])[0], 10]] : [];
    X.cutHoles(f, holes, () => {
      f.part(ray, GLD({ maxShade: 14, inkW: 2.2 })); X.leaf(f, ray, { cell: 50, chips: 1, nB: 1 });
      X.clipDraw(f, E.smooth(ray), () => { X.softTone(f, E.smooth(ray), [[RF([[0, 0], [len, 0], [len, w], [0, w * 1.4]]), '#140a02', 0.45, 8]]); });
      f.line(RF([[8, -2], [len * 0.9, -1]]), 2.6, P.goldS, { op: 0.6 }); f.line(RF([[8, -6], [len * 0.88, -4]]), 2, P.goldW, { op: 0.6 }); // the carved ridge down the ray
    }, { rimW: 2.4, rim: P.goldW, shape: ray });
    if (snapped) X.breakFace(f, end, rot([1, 0], a), 12, { shell: 5 });
    const down = ang => Math.PI / 2 - ang; // plumb, in ray-local angle
    if (course === 'fire') { // split open along its length on a seam of light, the lips charred and flaking, ash curling up off it
      const sp = RF([[len * 0.22, 0], [len * 0.45, -5], [len * 0.7, 3], [len * 0.9, -2]]);
      X.vcrack(f, sp, 16, { dark: P.charS, lip: P.ashL }); f.line(X.spline(sp, 4).slice(3, -3), 2.4, P.goldW, { op: 0.95 }); f.line(X.spline(sp, 4).slice(4, -5), 1, '#fffaf0');
      for (let i = 0; i < 5; i++) { const q = RF([[len * (0.3 + i * 0.13), (i % 2 ? 1 : -1) * w * 0.35 * (1 - i * 0.12)]])[0]; f.flat(ell(q, 7, 4, a + i, 7), P.charD, { op: 0.85 }); }
      f.flat(RF([[len * 0.84, -prof(0.84)], [len * 1.04, 0], [len * 0.84, prof(0.84)], [len * 0.78, 0]]), P.charD, { op: 0.8 }); // the tip burnt black
      X.ash(f, RF([[len * 0.7, -w * 0.4]])[0], 7, 30, 120, 1.2);
    } else if (course === 'frost') { // rime crusted on the windward edge, icicles hanging plumb from the lee edge
      const rime = []; for (let i = 0; i <= 8; i++) { const u = 0.1 + i * 0.1; rime.push(RF([[u * len, -prof(u) - (i % 2 ? 10 : 4) - R(f, 0, 6)]])[0]); } for (let i = 8; i >= 0; i--) { const u = 0.1 + i * 0.1; rime.push(RF([[u * len, -prof(u) * 0.45]])[0]); }
      f.part(rime.map(q => [...q, 1]), Object.assign(X.BN(f), { fill: '#e4e0d8', light: '#ffffff', shadow: '#6a6874', maxShade: 4, cast: false, inkW: 1.4, sharp: true }));
      for (let i = 0; i < 5; i++) f.line([rime[1 + i], rime[16 - i]], 1, '#8a8894', { op: 0.6, straight: true });
      for (let i = 0; i < 5; i++) { const u = 0.15 + i * 0.15, q = RF([[u * len, prof(u) - 3]])[0], L = R(f, 26, 60) * (1 - i * 0.12); const ic = [add(q, [-6 + i * 0.6, 0]), add(q, [6 - i * 0.6, 0]), [q[0] + R(f, -2, 2), q[1] + L, 1]]; f.part(ic, Object.assign(X.BN(f), { fill: '#d8d6e0', light: '#ffffff', shadow: '#5a5864', maxShade: 3, cast: false, inkW: 1.2 })); f.line([add(q, [2, 2]), [q[0] + 1, q[1] + L * 0.7]], 1, '#ffffff', { op: 0.7 }); }
    } else if (course === 'lightning') { // a Lichtenberg burn down it, the gold melted at the edge and run
      X.burn(f, RF([[len * 0.08, 0]])[0], a, len * 0.95, 5, { depth: 3, clip: ray });
      X.fusedRun(f, RF([[len * 0.55, prof(0.55)]])[0], 40, 8, GLD()); X.fusedRun(f, RF([[len * 0.3, prof(0.3)]])[0], 24, 6, GLD());
    } else if (course === 'water') { // swollen and sagging, crusted with barnacles, drips hanging off it
      for (let i = 0; i < 9; i++) { const u = R(f, 0.3, 0.8), q = RF([[u * len, R(f, -0.6, 0.8) * prof(u)]])[0], r = R(f, 6, 11); f.part(ell(q, r, r * 0.8, f.r() * 3, 8), Object.assign(X.BN(f), { maxShade: 3, cast: false, inkW: 1.2 })); f.flat(ell(add(q, [1, -1]), r * 0.4, r * 0.25, 0, 6), P.boneS); f.line([add(q, [-r * 0.6, 0]), add(q, [0, -r * 0.6])], 1, '#fff8e8', { op: 0.6 }); }
      for (const u of [0.45, 0.62]) { const q = RF([[u * len, prof(u) * 1.2 - 2]])[0]; f.flat(ell(add(q, [0, 10]), 4, 6, 0, 8), P.greyD); f.flat(ell(add(q, [-1, 8]), 1.4, 2, 0, 6), P.greyL); }
      f.formHatch && X.formHatch(f, RF([[len * 0.2, w * 1.0], [len * 0.5, w * 1.5], [len * 0.8, w * 0.6]]), 16, { op: 0.45 });
    } else if (course === 'toxin') { // ripened into pustules and split blisters, shelf fungus fruiting off its edge
      for (let i = 0; i < 7; i++) { const u = 0.2 + i * 0.1, q = RF([[u * len, R(f, -0.6, 0.6) * prof(u)]])[0], r = R(f, 7, 13) * (1 - i * 0.06); f.part(ell(q, r, r * 0.85, 0, 10), GLD({ fill: P.goldM, maxShade: 4, cast: false, inkW: 1.3 })); f.flat(ell(add(q, mul(f.L, r * 0.35)), r * 0.35, r * 0.25, 0, 6), P.goldW, { op: 0.6 }); if (i % 2) f.flat(ell(q, r * 0.22, r * 0.2, 0, 6), P.goldS); }
      for (const u of [0.35, 0.55, 0.72]) { const q = RF([[u * len, -prof(u) + 2]])[0], r = R(f, 24, 32) * (1.1 - u * 0.5); const sh = []; for (let k = 0; k <= 8; k++) { const t2 = Math.PI * k / 8; sh.push(add(q, rot([Math.cos(t2) * r, -Math.sin(t2) * r * 0.55], a))); } f.part(sh, Object.assign(X.GR(f), { fill: '#b8b2a6', light: '#e8e2d6', maxShade: 4, cast: false, inkW: 1.3 })); for (let k = 1; k < 4; k++) f.line([q, sh[k * 2]], 0.9, P.greyD, { op: 0.6 }); }
    } else if (course === 'void') { // cut clean: round holes through it, the tip thinned into shards
      X.shards(f, RF([[len * 1.0, 0]])[0], a, 4, 1.3);
    }
  };
  // the six, round the visible ring: [angle round the ring, length, course, snapped]
  for (const [t, len, course, sn] of [[-0.3, 240, 'fire', false], [0.26, 190, 'frost', true], [0.82, 230, 'lightning', false], [2.32, 220, 'water', false], [2.86, 170, 'toxin', true], [3.4, 240, 'void', false]]) courseRay(t, len, course, sn);
  // ================= the mantle: a long fold broken off the near shoulder, hanging down her back past the frame
  f.bone('mantle');
  { const top = brk([330, 960], [470, 860], 4, 12);
    const mt = [...top, [560, 880], [520, 1040], [470, 1240], [430, 1450], [300, 1640], [-40, 1640], [60, 1400], [210, 1160]];
    const d = piece(mt, { th: 22, ms: 80, inside: () => {
      for (const [q, w] of [[[[420, 960], [330, 1180], [180, 1460], [80, 1640]], 34], [[[490, 980], [430, 1220], [330, 1460], [240, 1640]], 40], [[[520, 1010], [480, 1240], [430, 1440], [400, 1640]], 26]]) X.fold2(f, E.smooth(mt), q, w);
      // (final pass) more carving: secondary folds between the long ones, a catenary sag across the top where it hangs
      // from the shoulder, and the turned-back border down its front edge showing a lit band
      for (const [q, w] of [[[[370, 1000], [290, 1200], [130, 1500], [20, 1640]], 22], [[[460, 1060], [390, 1280], [290, 1500], [160, 1640]], 20], [[[500, 1120], [460, 1320], [360, 1640]], 16]]) X.fold2(f, E.smooth(mt), q, w, { darkOp: 0.75, lightOp: 0.45 });
      for (const [y, w] of [[1010, 18], [1070, 14]]) X.fold2(f, E.smooth(mt), [[250, y + 120], [380, y + 20], [520, y - 10]], w, { darkOp: 0.7 });
      f.stroke([[556, 900], [520, 1040], [474, 1240], [436, 1440], [316, 1636]], 34, '#fff0c0', { op: 0.28 }); f.line([[536, 900], [500, 1040], [454, 1240], [416, 1440], [296, 1636]], 3, '#120800', { op: 0.6 }); // the turned-back border
      X.burn(f, [470, 1100], 2.2, 380, 6, { depth: 3 }); X.crackV(f, [300, 1300], 2.0, 200, 9, { depth: 2 }); } });
    X.breakFace(f, top.slice().reverse(), rot(lit, Math.PI), 0, {}); }
  // ================= the lap: the knees under heavy drapery, a deep valley falling between them, fabric pooling
  f.bone('lap');
  const lapTop = brk([430, 1340], [1180, 1314], 11, 16);
  const lap = [...lapTop, [1250, 1316], [1330, 1290], [1460, 1286], [1560, 1316], [1640, 1370], [1640, 1640], [360, 1640], [350, 1480]];
  const lapD = E.smooth(lap);
  piece(lap, { th: 30, ms: 90, cell: 90, inside: () => {
    // the knees: the near knee forward and lit, the far knee behind it in shade; the thigh's long top under the cloth
    X.softTone(f, lapD, [[ell([1290, 1380], 150, 90, 0, 20), '#fff0c0', 0.45, 34], [ell([1300, 1480], 170, 60, 0, 20), '#140a02', 0.45, 30], [ell([1500, 1330], 110, 60, 0, 18), '#140a02', 0.4, 26], [[[360, 1380], [700, 1360], [700, 1640], [360, 1640]], '#140a02', 0.55, 40], [[[700, 1350], [1180, 1330], [1180, 1380], [700, 1400]], '#fff0c0', 0.3, 20]]);
    X.fold2(f, lapD, [[1400, 1310], [1410, 1420], [1420, 1530], [1430, 1640]], 46); // the deep valley between the knees
    for (const [q, w] of [[[[1210, 1420], [1000, 1400], [760, 1400], [560, 1420]], 26], [[[1220, 1460], [1010, 1470], [800, 1490]], 20], [[[1250, 1500], [1240, 1570], [1250, 1640]], 30], [[[1170, 1480], [1130, 1560], [1110, 1640]], 26], [[[900, 1500], [860, 1570], [840, 1640]], 30], [[[620, 1440], [560, 1540], [520, 1640]], 30], [[[1520, 1360], [1560, 1480], [1580, 1640]], 30]]) X.fold2(f, lapD, q, w);
    // (final pass) catenary folds slung from the near knee back across the thighs, and the cloth pooling in broken
    // V-folds above the hem band
    for (const [q, w] of [[[[1260, 1350], [1060, 1360], [820, 1380], [600, 1400], [420, 1420]], 22], [[[1240, 1390], [1000, 1420], [760, 1440], [520, 1470]], 18], [[[1180, 1430], [980, 1450], [700, 1480], [460, 1510]], 16]]) X.fold2(f, lapD, q, w, { darkOp: 0.75, lightOp: 0.5 });
    for (let x = 420; x < 1600; x += 92) { const y0 = 1500 - (x - 340) * 0.031, dx = 20 + (x % 3) * 8; X.fold2(f, lapD, [[x - dx, y0], [x, y0 + 46], [x + dx, y0]], 10, { darkOp: 0.7, hatch: false }); }
    // the hem's inscription band, black with gilt letters, folding with the cloth over the shins
    const by = x => 1586 - (x - 340) * 0.031 + 10 * Math.sin(x / 70);
    const bp = []; for (let x = 340; x <= 1640; x += 20) bp.push([x, by(x)]);
    const band = [...bp.map(q => add(q, [0, -26])), ...bp.slice().reverse().map(q => add(q, [0, 26]))];
    f.flat(band, P.black, { op: 0.95 }); f.line(bp.map(q => add(q, [0, -24])), 3, P.goldL, { op: 0.6 }); f.line(bp.map(q => add(q, [0, 24])), 3, P.goldL, { op: 0.6 });
    for (let x = 360; x < 1620; x += 30) { const y = by(x); f.line([[x, y - 11], [x + 7, y - 3], [x + 2, y + 5], [x + 12, y + 9]], 2.6, P.gold, { op: 0.85 }); if (f.r() < 0.45) f.line([[x + 17, y - 11], [x + 17, y + 9]], 2.6, P.gold, { op: 0.85 }); }
    X.burn(f, [560, 1360], 0.5, 340, 7, { depth: 3 }); X.burn(f, [1430, 1330], 2.4, 280, 6, { depth: 3 });
    X.crackV(f, [920, 1340], 1.6, 220, 10, { depth: 2 }); X.crackV(f, [1300, 1420], 2.3, 160, 8, { depth: 2 });
    X.voidDisk(f, [1100, 1530], 34, 28, 0.2, { rim: P.goldL });
  } });
  X.formHatch(f, [[1180, 1330], [1260, 1318], [1340, 1330], [1420, 1360]], 22, { op: 0.4 });
  cramp(lapTop[4], -1.7, 40); cramp(lapTop[9], -1.5, 32);
  // ================= the far hand, raised in blessing beside the breast: two fingers up, two folded; the sleeve cropped,
  // its cuff broken open on the hollow inside
  f.bone('hand_f');
  { const wr = [1430, 930], a0 = -1.72, hs = 330;
    const sleeve = [add(wr, [-90, 10]), add(wr, [70, -16]), [1640, 960], [1640, 1180], add(wr, [-60, 220])];
    const sd = piece(sleeve, { th: 18, ms: 40, cell: 60, inside: () => { X.fold2(f, E.smooth(sleeve), [add(wr, [-50, 50]), add(wr, [40, 110]), [1640, 1080]], 24); X.fold2(f, E.smooth(sleeve), [add(wr, [-40, 130]), add(wr, [60, 170]), [1640, 1150]], 18); X.burn(f, [1600, 1100], 3.4, 200, 5, { depth: 2 }); } });
    f.flat(ell(add(wr, [-8, 2]), 74, 26, -0.12, 16), P.void); f.line(ell(add(wr, [-8, 2]), 78, 30, -0.12, 16).concat([ell(add(wr, [-8, 2]), 78, 30, -0.12, 16)[0]]), 6, '#3a3440'); f.line(ell(add(wr, [-8, 2]), 80, 32, -0.12, 16).slice(8, 16), 2, P.goldW, { op: 0.6 }); // the cuff's mouth: the shell, the hollow
    // the hand of blessing (independent review: built with godHand so the fingers fold): index and middle up, the
    // middle a little more bent; ring and little folded down over the palm with their nails showing; the thumb laid
    // across to touch the ring finger; the palm with its mound, hollow and creases
    const h = X.godHand(f, wr, -1.66, 360, { look: GLD({ maxShade: 26 }), flip: false, nail: P.goldL,
      palm: [[-0.06, -0.13], [0.06, -0.18], [0.22, -0.21], [0.38, -0.2], [0.5, -0.16], [0.53, -0.06], [0.53, 0.04], [0.52, 0.13], [0.44, 0.19], [0.3, 0.2], [0.18, 0.23], [0.06, 0.2], [-0.06, 0.12]],
      palmIn: F => palmLines(F, -1),
      fingers: [
        { b: [0.5, -0.15], a: 0.08, L: [0.11, 0.15, 0.08], bend: [0.6, 2.3, 1.0], w: 0.095, back: 1, z: 1, nailOff: -0.25 }, // little, folded
        { b: [0.52, -0.05], a: 0.04, L: [0.13, 0.17, 0.09], bend: [0.5, 2.35, 0.9], w: 0.104, back: 1, z: 1, nailOff: -0.25 }, // ring, folded
        { b: [0.53, 0.05], a: 0.0, L: [0.24, 0.14, 0.12], bend: [-0.02, 0.14, 0.1], w: 0.11, back: 1, nail: false }, // middle
        { b: [0.51, 0.14], a: -0.04, L: [0.22, 0.13, 0.11], bend: [-0.06, 0.05, 0.03], w: 0.106, back: 1, nail: false }, // index
      ],
      thumb: { b: [0.08, 0.2], a: 0.02, L: [0.2, 0.15, 0.12], bend: [0.1, -0.45, -0.4], w: 0.13, back: -1, z: 2 } });
    for (const g of [h.fing[2], h.fing[3]]) { const c = lerp(g.k[1], g.k[2], 0.5), d = E.norm(sub(g.k[2], g.k[1])), nn = [-d[1], d[0]]; X.vcrack(f, [add(c, mul(nn, g.W * 0.5)), add(c, mul(d, g.W * 0.1)), add(c, mul(nn, -g.W * 0.5))], 5); }
    X.burn(f, h.F([[0.1, 0.0]])[0], -1.66 + 0.6, 150, 4, { depth: 2, clip: h.F([[-0.06, -0.2], [0.5, -0.2], [0.5, 0.2], [-0.06, 0.18]]) });
    leak(h.F([[0.02, 0.18]])[0], 90, 12); }
  // ================= the breast and shoulders (independent review: carved so the body reads through the cloth). The
  // near shoulder's cap with the armhole broken open where the upper arm fell away; the breast a full rounded form
  // standing out of the front contour, lit on its top, its core shadow turning under it and its cast shadow on the
  // ribs where the cloth tucks under the girdle; tension folds pulled from the breast up to the shoulder and from the
  // armpit down to the girdle; the ribcage narrowing under the girdle; the heart broken out between them
  f.bone('chest');
  const chBot = brk([1150, 1200], [450, 1222], 10, 16);
  const chest = [[620, 830], [800, 806], [960, 820], [1090, 858], [1150, 896], [1200, 948], [1234, 1008], [1242, 1060], [1222, 1102], [1176, 1124], [1150, 1146], [1162, 1186], ...chBot, [412, 1150], [404, 1050], [418, 950], [462, 890], [540, 852]];
  const chD = E.smooth(chest), heart = [880, 990], hr = 96, bc = [1140, 1020];
  X.cutHoles(f, [[heart, hr]], () => piece(chest, { th: 32, ms: 90, inside: () => {
    X.softTone(f, chD, [
      [[[380, 940], [560, 960], [600, 1260], [380, 1260]], '#140a02', 0.6, 34], // the back of the torso turned from the light
      [ell([570, 880], 120, 46, -0.25, 16), '#fff0c0', 0.5, 20], // the shoulder's cap lit
      [ell([600, 1010], 70, 90, 0.4, 16), '#140a02', 0.6, 22], // the armpit and the underside of the shoulder
      [[[660, 840], [960, 836], [960, 880], [700, 900]], '#fff0c0', 0.3, 16], [[[700, 872], [900, 862], [880, 890], [720, 900]], '#140a02', 0.35, 8], // the collarbone under the cloth
      [ell(add(bc, [24, -40]), 92, 58, -0.4, 18), '#fff6d0', 0.6, 22], // the breast's lit top
      [ell(add(bc, [-50, 40]), 80, 60, -0.5, 18), '#140a02', 0.55, 22], // its core shadow turning under
      [[[980, 1098], [1100, 1104], [1220, 1096], [1200, 1140], [1060, 1150], [980, 1140]], '#140a02', 0.75, 12], // the cast shadow under the breast
      [[[1040, 1150], [1160, 1150], [1160, 1210], [1040, 1210]], '#fff0c0', 0.3, 14], // the ribcage's lit front below the girdle
    ]);
    X.formHatch(f, [[1060, 930], [1150, 950], [1225, 1010], [1238, 1070]], 34, { op: 0.45 }); // the breast's curve turning from the light
    X.formHatch(f, [add(bc, [-110, -40]), add(bc, [-110, 30]), add(bc, [-60, 80])], 30, { op: 0.45 }); // its far flank
    X.formHatch(f, [[470, 900], [430, 980], [420, 1100], [430, 1190]], 44, { op: 0.5 }); // the back turning away
    X.fold2(f, chD, [[660, 856], [800, 912], [960, 916], [1080, 872]], 22); // the neckline
    // tension folds: from the breast up across the chest to the shoulder; from the armpit down to the girdle
    for (const [q, w] of [[[[1196, 1000], [1080, 940], [930, 890], [760, 872]], 20], [[[1180, 1060], [1060, 1050], [990, 1080]], 16], [[[620, 960], [700, 1030], [820, 1090], [930, 1118]], 26], [[[560, 920], [620, 1040], [700, 1110]], 18]]) X.fold2(f, chD, q, w);
    // the cloth hanging straight below the breast and over the ribs
    for (const [q, w] of [[[[1170, 1150], [1160, 1180], [1150, 1214]], 12], [[[1090, 1150], [1080, 1185], [1086, 1214]], 14], [[[780, 1150], [774, 1190], [790, 1218]], 18], [[[600, 1140], [590, 1180], [600, 1220]], 22]]) X.fold2(f, chD, q, w);
    // final pass 2026-11-25: the cloth over the near shoulder and flank, under the forearm, was still a smooth gilt mass.
    // Carved now: heavy drape folds falling from the shoulder's cap diagonally to the girdle, each a deep trough with a
    // lit ridge beside it; the cloth bloused over the girdle in short hanging loops; a cross-pull from the armpit
    const DF = { darkOp: 0.78, lightOp: 0.5 };
    for (const [q, w] of [[[[520, 880], [540, 960], [600, 1060], [660, 1140]], 30], [[[600, 870], [640, 960], [720, 1060], [770, 1140]], 24], [[[690, 880], [740, 950], [830, 1040], [880, 1130]], 20], [[[460, 930], [470, 1030], [500, 1120], [520, 1190]], 26], [[[430, 1000], [440, 1100], [450, 1190]], 18]]) X.fold2(f, chD, q, w, DF);
    for (const [x0, x1, dy] of [[480, 600, 0], [600, 730, 6], [730, 860, -4], [980, 1080, 4], [1080, 1170, 0]]) X.fold2(f, chD, [[x0, 1126 + dy], [(x0 + x1) / 2, 1162 + dy], [x1, 1128 + dy]], 16, DF); // bloused over the girdle
    X.fold2(f, chD, [[560, 1000], [660, 980], [760, 1000], [860, 1040]], 14, DF); // a cross-pull from the armpit
    // tension folds radiating from the breast: up over it to the shoulder seam, out under it to the armpit, down to the
    // girdle; the cloth drawn tight between them, so each is a sharp ridge rather than a soft valley
    for (const [q, w] of [[[[1150, 960], [1110, 900], [1040, 860]], 12], [[[1190, 980], [1170, 920], [1120, 872]], 10], [[[1120, 1060], [1040, 1030], [960, 1030]], 12], [[[1150, 1090], [1090, 1110], [1010, 1130]], 10], [[[1220, 1040], [1236, 1080], [1222, 1120]], 9], [[[980, 870], [1000, 940], [1010, 1010]], 10]]) X.fold2(f, chD, q, w, DF);
    for (const q of [[[1170, 950], [1130, 895], [1060, 858]], [[1130, 1052], [1050, 1022], [970, 1022]]]) f.line(q.map(z => add(z, mul(lit, 6))), 3, '#fff6d0', { op: 0.55 });
    for (const [q, w] of [[[[540, 900], [570, 1000], [630, 1100]], 4], [[[640, 900], [690, 1000], [750, 1100]], 3.4]]) f.line(q.map(z => add(z, mul(lit, 9))), w, '#fff6d0', { op: 0.5 }); // the sharpest ridges catch the light
    // the ribs under the thin cloth on the near flank, below the girdle
    for (let i = 0; i < 3; i++) X.crease(f, [[900 + i * 12, 1160 + i * 16], [980 + i * 10, 1166 + i * 14], [1050 + i * 6, 1160 + i * 12]], 3.2, { col: '#140a02', lit: '#f6dc90', op: 0.5 });
    X.burn(f, [1200, 950], 2.6, 340, 7, { depth: 3 }); X.burn(f, [470, 1180], -0.8, 300, 6, { depth: 3 });
    X.crackV(f, [heart[0] - 86, heart[1] - 50], -2.6, 190, 10, { depth: 2 }); X.crackV(f, [heart[0] + 92, heart[1] + 30], 0.4, 200, 10, { depth: 2 });
  } }), { shape: chD, rimW: 3, rim: P.goldL });
  // the near armhole: the upper arm broke away at the shoulder, so the sleeve's mouth is open on the hollow
  { const ah = [450, 1004], rim = ell(ah, 50, 96, 0.14, 22).map((q, i) => [...add(q, mul(E.norm(sub(q, ah)), i % 3 === 1 ? -9 : i % 2 ? 6 : 0)), 1]);
    f.flat(rim, '#3a3440'); f.line([...rim, rim[0]], 2, INK, { op: 0.9 }); const inn = rim.map(q => lerp(ah, q, 0.72)); f.flat(inn, P.void); f.flat(inn.map(q => add(lerp(ah, q, 0.6), [8, 12])), P.vioS, { op: 0.55 });
    f.line(rim.slice(0, 12), 2.4, P.goldW, { op: 0.7 }); leak(add(ah, [4, 90]), 60, 14, { drops: 1 }); }
  // the cord girdle: a twisted gilt cord wrapped twice round the ribs under the bust (its near run arcs up, as a hoop
  // seen from below), crossing at a knot, the two ends hanging plumb past the break with knots tied along them
  { const knot = (c, r, a) => { for (const [dx, dy, k] of [[-0.5, 0.1, 0.8], [0.45, 0.05, 0.85], [0, -0.3, 0.9], [0, 0.35, 0.7]]) { const q = add(c, rot([dx * r, dy * r], a)), sh = ell(q, r * 0.62 * k, r * 0.48 * k, a + dx, 12); f.part(sh, GLD({ maxShade: 5, cast: false, inkW: 1.6, inkHeavy: 2.2 })); f.line(ell(q, r * 0.42 * k, r * 0.3 * k, a + dx, 12).slice(2, 9), 1.4, P.goldS, { op: 0.7 }); } f.flat(ell(add(c, rot([0, 0.05 * r], a)), r * 0.16, r * 0.12, a, 8), P.goldS, { op: 0.8 }); };
    const twist = (pts, w) => { const C = X.rope(f, pts, w, P.gold, { lit: false }); for (let i = 2; i < C.length - 2; i += 3) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, w * 0.45)), add(add(C[i], mul(d, w * 0.55)), mul(n, -w * 0.45))], 2, P.goldS, { op: 0.6, straight: true }); f.line([add(add(C[i], mul(d, w * 0.2)), mul(n, w * 0.3)), add(add(C[i], mul(d, w * 0.45)), mul(n, -w * 0.1))], 1.4, P.goldW, { op: 0.45, straight: true }); } return C; };
    const kn = [1150, 1110];
    twist([[406, 1150], [560, 1140], [720, 1130], [880, 1116], [1020, 1110], [1100, 1112], kn], 18); // the upper wrap, from the back round the ribs under the heart
    twist([[412, 1198], [560, 1178], [720, 1160], [880, 1142], [1010, 1130], [1100, 1120], kn], 17); // the lower wrap, converging on the knot
    knot(kn, 44, 0.2);
    const end1 = [add(kn, [-12, 24]), add(kn, [-16, 56]), add(kn, [-14, 92]), add(kn, [-12, 124])], end2 = [add(kn, [14, 24]), add(kn, [24, 50]), add(kn, [30, 80]), add(kn, [32, 104])];
    twist(end1, 14); twist(end2, 14); knot(lerp(end1[1], end1[2], 0.4), 22, 0.1); knot(end1[3], 20, 0); knot(end2[3], 19, -0.1);
    for (const e of [end1[3], end2[3]]) for (let k = -3; k <= 3; k++) f.line([add(e, [0, 10]), add(e, [k * 3 + R(f, -1, 1), 34 + R(f, -6, 6)])], 2, k % 2 ? P.goldM : P.gold, { op: 0.9 }); } // frayed tassels
  // inside the heart: the hollow, its far wall dim violet, the black shell broken jagged round it
  f.flat(ell(add(heart, mul(back, 26)), hr * 0.86, hr * 0.86, 0, 30), P.vioS, { op: 0.75 }); f.flat(ell(add(heart, mul(back, 14)), hr * 0.84, hr * 0.84, 0, 30), P.void);
  f.line(ell(heart, hr + 8, hr + 8, 0, 40).concat([ell(heart, hr + 8, hr + 8, 0, 40)[0]]), 14, '#3a3440'); f.line(ell(heart, hr + 1, hr + 1, 0, 40).slice(20, 40), 2, P.goldW, { op: 0.7 });
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + 0.2, q = add(heart, rot([hr - 2, 0], a)); f.flat([q, add(q, rot([R(f, 12, 26), -8], a)), add(q, rot([R(f, 8, 18), 9], a))], '#0c0a0e'); }
  // the underside of the break, seen from below: the shell, the hollow inside it
  X.breakFace(f, chBot.slice().reverse(), [0, 1], 44, { shell: 12 });
  cramp(chBot[3], 1.6, 36); cramp(chBot[7], 1.5, 42);
  leak(add(heart, [-20, hr - 8]), 150, 28); leak(add(chBot[5], [0, 46]), 70, 18, { drops: 1 });
  // ================= the Tooth: a great molar floating where the heart was, bound with gilt wire, scored with growth lines
  f.bone('tooth');
  { const tc = add(heart, [6, -4]), TF = frame(tc, 0.18, 112);
    const tooth = TF([[-0.42, -0.1], [-0.36, -0.42], [-0.2, -0.5], [0.0, -0.42], [0.2, -0.52], [0.38, -0.42], [0.44, -0.08], [0.34, 0.12], [0.3, 0.52], [0.18, 0.62, 1], [0.1, 0.24], [-0.06, 0.24], [-0.14, 0.62, 1], [-0.28, 0.5], [-0.34, 0.12]]);
    f.part(tooth, X.BN(f, { maxShade: 30, inkW: 2.4, inkHeavy: 3.4 }));
    X.clipDraw(f, E.smooth(tooth), () => { for (let i = 0; i < 5; i++) f.line(TF([[-0.4, -0.3 + i * 0.09], [0, -0.26 + i * 0.09], [0.42, -0.3 + i * 0.09]]), 1.4, P.boneS, { op: 0.6 }); X.vcrack(f, TF([[0.05, -0.5], [0.0, -0.1], [0.08, 0.2]]), 6, { dark: P.boneS, lip: '#fff8e8' }); });
    for (const v of [-0.06, 0.04]) f.line(TF([[-0.44, v], [0, v + 0.03], [0.46, v]]), 3, P.goldL); f.line(TF([[-0.44, -0.06], [0, -0.03], [0.46, -0.06]]), 1.2, P.goldD); }
  // ================= the near forearm and the open hand, one floating piece, palm up, offered forward; two fingers gone
  f.bone('arm_n');
  { const el = [500, 1236], wr = [860, 1290];
    const d = E.norm(sub(wr, el)), n = [-d[1], d[0]];
    const slvTop = brk(add(el, mul(n, 100)), add(el, mul(n, -100)), 5, 14);
    const sl = [add(lerp(el, wr, 0.55), mul(n, -96)), add(wr, mul(n, -70)), add(wr, mul(n, 70)), add(lerp(el, wr, 0.5), mul(n, 120)), ...slvTop.slice().reverse()];
    piece(sl, { th: 24, ms: 50, cell: 60, inside: () => { for (const k of [-40, 40]) X.fold2(f, E.smooth(sl), [add(el, mul(n, k)), add(lerp(el, wr, 0.5), mul(n, k * 1.3)), add(wr, mul(n, k * 0.8))], 24); X.burn(f, add(el, mul(n, -20)), ang(el, wr) - 0.3, 260, 5, { depth: 3 }); } });
    X.breakFace(f, slvTop, mul(d, -1), 30, { shell: 10 }); // the broken elbow end: shell and hollow
    f.flat(ell(wr, 30, 66, ang(el, wr), 16), P.void); f.line(ell(wr, 34, 70, ang(el, wr), 16).concat([ell(wr, 34, 70, ang(el, wr), 16)[0]]), 6, '#3a3440');
    // the open hand, palm up and offered, the fingers relaxed at different bends; ring and little finger broken off
    const h = X.godHand(f, add(wr, mul(d, -16)), ang(el, wr) - 0.1, 380, { look: GLD({ maxShade: 26 }), flip: true, nail: P.goldL,
      palm: [[-0.06, -0.12], [0.1, -0.15], [0.3, -0.16], [0.48, -0.13], [0.53, -0.06], [0.53, 0.04], [0.5, 0.11], [0.3, 0.13], [0.12, 0.14], [-0.06, 0.1]],
      palmIn: F => palmLines(F, 0.7),
      fingers: [
        { b: [0.5, -0.1], a: -0.08, L: [0.17, 0.11, 0.09], bend: [0.1, 0.5, 0.4], w: 0.09, cut: [1, 0.45] }, // little, broken at the middle joint
        { b: [0.52, -0.04], a: -0.04, L: [0.2, 0.13, 0.11], bend: [0.15, 0.45, 0.35], w: 0.1, cut: [0, 0.65] }, // ring, broken off short
        { b: [0.53, 0.02], a: 0.0, L: [0.22, 0.14, 0.12], bend: [0.3, 0.6, 0.45], w: 0.104 }, // middle, curled most
        { b: [0.51, 0.08], a: 0.04, L: [0.21, 0.13, 0.11], bend: [0.15, 0.4, 0.3], w: 0.1, z: 1 }, // index
      ],
      thumb: { b: [0.1, 0.12], a: 0.55, L: [0.18, 0.14, 0.11], bend: [0, -0.35, -0.2], w: 0.13, z: 2 } });
    X.burn(f, h.F([[0.05, 0.0]])[0], 0.1, 190, 4, { depth: 2, clip: h.F([[-0.06, -0.14], [0.5, -0.14], [0.5, 0.12], [-0.06, 0.1]]) });
    { const g = h.fing[2]; f.part(ell(lerp(g.k[0], g.k[1], 0.45), g.W * 0.2, g.W * 0.56, ang(g.k[0], g.k[1]), 14), GLD({ fill: P.goldL, maxShade: 4, cast: false, inkW: 1.6 })); } // a ring
    leak(add(slvTop[3], [0, 40]), 90, 16, { drops: 1 }); }
  // ================= the head: veiled, bowed toward the party in grief; a long neck broken at its base
  f.bone('head');
  { const hF = frame(HC, hA, Hh);
    // void running from an empty socket as a tear: a ribbon laid on the face along pts (head units), then drops that
    // fall plumb off its end
    const tear = (pts, w, drops) => {
      const C = X.spline(hF(pts), 5), rib = X.ribbon(C, C.map((_, i, A) => w * (0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, 0.15 + i / A.length)))));
      f.line([...rib, rib[0]], 2.4, P.vioD, { op: 0.9 }); f.flat(rib, P.void); f.line(C.slice(2, -3).map(z => add(z, mul(f.L, w * 0.18))), 1.2, P.vio, { op: 0.5 });
      const e = C[C.length - 1];
      for (let k = 0; k < drops; k++) { const c = add(e, [R(f, -2, 2), 18 + k * 24]), r = w * 0.34 * (1 - k * 0.3) + 1.5; f.line(ell(c, r, r * 1.3, 0, 10).concat([ell(c, r, r * 1.3, 0, 10)[0]]), 1.8, P.vioD); f.flat(ell(c, r, r * 1.3, 0, 10), P.void); }
    };
    // the veil behind the head, carved in heavy folds, falling behind the jaw to the shoulder
    const veilB = hF([[0.24, -0.5], [0.06, -0.68], [-0.3, -0.72], [-0.6, -0.48], [-0.72, -0.06], [-0.7, 0.42], [-0.6, 0.84], [-0.3, 1.0], [-0.18, 0.7], [-0.24, 0.36], [-0.3, 0.0], [-0.22, -0.38], [0.08, -0.48]]);
    const vbD = E.smooth(veilB);
    piece(veilB, { th: 22, ms: 80, cell: 70, look: { fill: P.goldM }, inside: () => {
      for (const [q, w] of [[hF([[-0.1, -0.66], [-0.46, -0.44], [-0.6, 0.06], [-0.56, 0.6], [-0.44, 0.96]]), 40], [hF([[0.04, -0.62], [-0.3, -0.48], [-0.44, -0.06], [-0.42, 0.5], [-0.3, 0.9]]), 30], [hF([[-0.3, -0.7], [-0.62, -0.3], [-0.68, 0.3]]), 24]]) X.fold2(f, vbD, q, w);
      X.burn(f, hF([[-0.64, 0.1]])[0], hA - 1.4, 220, 5, { depth: 3 }); } });
    // the long neck, its base broken jagged; the underside of the break seen from below
    const nkB = brk(hF([[0.26, 0.94]])[0], hF([[-0.12, 0.98]])[0], 5, 9);
    const nk = [hF([[-0.1, 0.38]])[0], hF([[0.12, 0.46]])[0], hF([[0.15, 0.62]])[0], hF([[0.2, 0.84]])[0], ...nkB, hF([[-0.1, 0.7]])[0]];
    piece(nk, { th: 18, ms: 40, cell: 50, inside: () => { X.softTone(f, E.smooth(nk), [[hF([[-0.12, 0.4], [0.02, 0.44], [0.0, 1.0], [-0.14, 1.0]]), '#140a02', 0.5, 16]]); X.fold2(f, E.smooth(nk), hF([[-0.04, 0.8], [0.08, 0.84], [0.22, 0.82]]), 12, { hatch: false }); } });
    X.breakFace(f, nkB.slice().reverse(), rot([0, 1], hA), 26, { shell: 8 });
    cramp(nkB[2], hA + 1.5, 34);
    // the face: an idealised woman's face carved in stone and gilded, bowed, ancient, grieving
    // the face (independent review): turned from strict profile toward three-quarter and bowed, so both orbits, the
    // far cheek's contour and the near cheek's plane show. Grief carried by the carving, not by eyes: the brows drawn
    // up at their inner ends with a furrow between them, a heavy upper-lid shelf overhanging each empty socket and
    // drooping at its outer corner, the cheek drawn in under the cheekbone, the fold from nose to mouth, and the soft,
    // downturned corner of the mouth still carved round the clean hole where the lips were. hd: head-local units.
    const hd = pts => hF(pts);
    const face = hd([[-0.02, -0.46], [0.16, -0.46], [0.26, -0.4], [0.34, -0.24], [0.35, -0.15], [0.34, -0.09], [0.36, -0.01], [0.362, 0.08], [0.345, 0.18], [0.33, 0.27], [0.31, 0.36], [0.285, 0.44], [0.24, 0.5], [0.16, 0.53], [0.06, 0.5], [-0.06, 0.44], [-0.18, 0.32], [-0.25, 0.14], [-0.28, -0.06], [-0.27, -0.26], [-0.18, -0.42]]);
    const fD = E.smooth(face);
    f.part(face, GLD({ maxShade: 40 }));
    X.clipDraw(f, fD, () => {
      X.softTone(f, fD, [
        [hd([[-0.4, -0.5], [0.02, -0.5], [0.0, -0.1], [0.04, 0.2], [0.02, 0.56], [-0.4, 0.56]]), '#140a02', 0.5, 26], // the near side plane turning from the light
        [hd(ell([-0.12, -0.28], 0.1, 0.12, 0, 12)), '#140a02', 0.35, 18], // the temple's hollow
        [hd(ell([0.14, -0.33], 0.12, 0.07, 0, 14)), '#fff0c0', 0.45, 16], // the forehead lit
        [hd(ell([0.08, -0.07], 0.15, 0.1, 0.1, 16)), '#140a02', 0.65, 14], [hd(ell([0.3, -0.08], 0.06, 0.08, 0, 12)), '#140a02', 0.55, 10], // the orbits
        [hd(ell([0.13, 0.03], 0.1, 0.045, -0.2, 12)), '#fff6d0', 0.55, 10], // the cheekbone catching the light
        [hd([[0.02, 0.1], [0.2, 0.1], [0.22, 0.2], [0.12, 0.28], [0.0, 0.24]]), '#140a02', 0.55, 14], // the cheek drawn in under it
        [hd(ell([0.33, 0.05], 0.04, 0.1, 0, 10)), '#fff0c0', 0.45, 8], // the far cheek's front plane
        [hd([[-0.2, 0.3], [0.0, 0.42], [0.16, 0.5], [0.16, 0.6], [-0.2, 0.6]]), '#140a02', 0.55, 12], // the jaw's underplane
        [hd(ell([0.23, 0.44], 0.05, 0.04, 0, 10)), '#fff0c0', 0.5, 8], [hd(ell([0.22, 0.37], 0.07, 0.018, 0, 10)), '#140a02', 0.5, 6], // the chin lit, the hollow above it
      ]);
      X.formHatch(f, hd([[-0.04, -0.3], [-0.03, -0.05], [-0.02, 0.2], [0.06, 0.4], [0.16, 0.5]]), Hh * 0.06, { op: 0.45 }); // the cheek turning away
      X.formHatch(f, hd([[0.03, 0.12], [0.1, 0.2], [0.18, 0.26]]), Hh * 0.03, { op: 0.4 });
      // the far tear, on the far cheek behind the nose (drawn before the nose so the nose stays in front of it)
      tear([[0.3, -0.02], [0.33, 0.06], [0.342, 0.16], [0.336, 0.25]], 12, 0);
    });
    // grief in the brow: the brows drawn up toward the middle, a furrow between them, a short crease above
    f.stroke(hd([[-0.08, -0.15], [0.02, -0.19], [0.12, -0.225], [0.17, -0.215]]), 9, '#140a02', { op: 0.6 }); f.line(hd([[-0.06, -0.165], [0.04, -0.205], [0.13, -0.24]]), 2.6, P.goldW, { op: 0.5 });
    f.stroke(hd([[0.23, -0.22], [0.27, -0.205], [0.32, -0.17]]), 6, '#140a02', { op: 0.55 });
    X.crease(f, hd([[0.18, -0.3], [0.185, -0.25], [0.19, -0.2]]), 4, { col: '#140a02', lit: P.goldW, op: 0.6 }); // the furrow
    X.crease(f, hd([[0.08, -0.3], [0.13, -0.315], [0.17, -0.3]]), 3, { col: '#140a02', lit: P.goldW, op: 0.45 });
    // her eyes gone: under each heavy lid shelf a deep socket with a clean pale lower rim and the void inside
    for (const [c, rx, ry, sh] of [[[0.075, -0.045], 0.088, 0.064, 1], [[0.302, -0.055], 0.036, 0.054, 0.55]]) {
      const so = hd(ell(c, rx, ry, 0.12, 26));
      f.flat(so, P.void); f.flat(hd(ell([c[0] - rx * 0.1, c[1] + ry * 0.25], rx * 0.55, ry * 0.45, 0.12, 14)), P.vioS, { op: 0.65 });
      f.line(so.slice(2, 13), 3, P.goldW, { op: 0.85 }); // the clean lower rim
      // the upper lid: a heavy shelf of carved stone over the top of the socket, its lower edge drooping at the outer
      // corner, lit along its top, a crease above it, its shadow dropped into the socket
      const L0 = [c[0] + rx * 1.08, c[1] - ry * 0.05], L1 = [c[0] - rx * 1.12, c[1] + ry * 0.35];
      const lid = hd([L0, [c[0] + rx * 0.4, c[1] - ry * 1.25], [c[0] - rx * 0.4, c[1] - ry * 1.2], [L1[0] - rx * 0.1, L1[1] - ry * 0.6], L1, [c[0] - rx * 0.4, c[1] + ry * 0.05], [c[0] + rx * 0.3, c[1] - ry * 0.12], [c[0] + rx * 0.9, c[1] + ry * 0.1]]);
      f.flat(hd([[c[0] + rx, c[1] + ry * 0.1], [c[0] - rx * 1.1, c[1] + ry * 0.45], [c[0] - rx * 0.3, c[1] + ry * 0.55], [c[0] + rx * 0.4, c[1] + ry * 0.3]]), '#000', { op: 0.6 }); // its shadow in the socket
      f.part(lid, GLD({ maxShade: 6 * sh + 2, inkW: 2, inkHeavy: 2.6, cast: false }));
      X.clipDraw(f, E.smooth(lid), () => X.softTone(f, E.smooth(lid), [[hd([[c[0] - rx * 1.2, c[1] - ry * 1.3], [c[0] + rx * 1.2, c[1] - ry * 1.3], [c[0] + rx, c[1] - ry * 0.6], [c[0] - rx, c[1] - ry * 0.4]]), '#fff0c0', 0.5, 6], [hd([[c[0] - rx * 1.2, c[1] + ry * 0.4], [c[0] + rx, c[1] - ry * 0.1], [c[0] + rx, c[1] + ry * 0.2], [c[0] - rx * 1.2, c[1] + ry * 0.6]]), '#140a02', 0.5, 5]]));
      f.line(hd([[c[0] + rx * 1.0, c[1] - ry * 0.7], [c[0] + rx * 0.2, c[1] - ry * 1.6], [c[0] - rx * 0.6, c[1] - ry * 1.45], [c[0] - rx * 1.2, c[1] - ry * 0.5]]), 2.6 * sh + 1, '#140a02', { op: 0.6 }); // the lid's fold
    }
    // the near tear runs from under the shelf down the drawn cheek and off the jaw
    tear([[0.07, 0.0], [0.055, 0.08], [0.06, 0.17], [0.085, 0.26], [0.11, 0.34], [0.112, 0.42], [0.095, 0.47]], 14, 2);
    // the nose, in front of the far cheek: a long straight bridge, the tip, the wing round the nostril
    const nose = hd([[0.17, -0.17], [0.215, -0.14], [0.255, -0.06], [0.33, 0.06], [0.388, 0.125], [0.382, 0.162], [0.35, 0.18], [0.31, 0.172], [0.27, 0.185], [0.225, 0.172], [0.205, 0.14], [0.212, 0.06], [0.19, -0.06]]);
    f.part(nose, GLD({ maxShade: 14, inkW: 2, inkHeavy: 2.8, cast: false }));
    X.clipDraw(f, E.smooth(nose), () => X.softTone(f, E.smooth(nose), [[hd([[0.17, -0.16], [0.23, -0.14], [0.26, 0.2], [0.18, 0.2]]), '#140a02', 0.55, 8], [hd([[0.235, -0.1], [0.32, 0.04], [0.375, 0.13], [0.35, 0.14], [0.29, 0.05], [0.225, -0.07]]), '#fff6d0', 0.55, 5]]));
    f.part(hd([[0.222, 0.132], [0.255, 0.124], [0.276, 0.152], [0.258, 0.177], [0.228, 0.172], [0.214, 0.152]]), GLD({ maxShade: 4, inkW: 1.1, inkHeavy: 1.4, cast: false })); // the nostril's wing
    f.line(hd([[0.3, 0.172], [0.33, 0.165], [0.355, 0.168]]), 2.6, '#140a02', { op: 0.8 }); // the nostril
    X.crease(f, hd([[0.215, 0.18], [0.19, 0.24], [0.175, 0.3], [0.165, 0.34]]), 4, { col: '#140a02', lit: P.goldW, op: 0.6 }); // the fold from nose to mouth
    f.line(hd([[0.29, 0.19], [0.285, 0.235]]), 2.4, '#140a02', { op: 0.4 }); // the philtrum
    // her mouth gone: a clean hole where the lips were, the soft corner still carved and turned down, a remnant of the
    // lower lip's shelf below it, the hollow under the lip
    const mo = hd([[0.205, 0.272], [0.245, 0.262], [0.29, 0.264], [0.315, 0.276], [0.295, 0.29], [0.25, 0.298], [0.21, 0.292]]);
    f.flat(mo, P.void); f.line([...mo, mo[0]], 2.6, P.goldW, { op: 0.85 }); f.flat(hd(ell([0.258, 0.282], 0.03, 0.01, 0, 10)), P.vioS, { op: 0.8 });
    f.part(hd([[0.17, 0.29], [0.19, 0.276], [0.208, 0.285], [0.205, 0.3], [0.19, 0.318], [0.172, 0.312]]), GLD({ maxShade: 4, inkW: 1.3, cast: false })); // the corner's soft pad
    f.stroke(hd([[0.205, 0.288], [0.18, 0.305], [0.16, 0.33]]), 5, '#140a02', { op: 0.7 }); // the corner turned down
    f.part(hd([[0.21, 0.3], [0.26, 0.304], [0.3, 0.296], [0.295, 0.318], [0.25, 0.33], [0.215, 0.322]]), GLD({ maxShade: 4, inkW: 1.3, cast: false })); // the lower lip's shelf
    f.stroke(hd([[0.2, 0.345], [0.25, 0.352], [0.29, 0.342]]), 6, '#140a02', { op: 0.55 });
    X.leaf(f, face, { cell: 120, s: 1.2, chips: 3, nB: 1, open: 0.08 });
    // carved hair in heavy waves at the temple under the veil's edge
    for (let i = 0; i < 4; i++) X.hairClump(f, hd([[0.02 - i * 0.05, -0.44 + i * 0.02], [-0.1 - i * 0.04, -0.3], [-0.16 - i * 0.03, -0.12], [-0.14 - i * 0.02, 0.06]]), 24, { pal: [P.goldS, P.goldD, P.goldM, P.goldD], gap: true, n: 3 });
    // the veil's front edge over the brow and down past the cheek, a heavy rolled hem
    const veilF = hF([[0.24, -0.5], [0.12, -0.44], [-0.08, -0.42], [-0.22, -0.2], [-0.24, 0.12], [-0.2, 0.42], [-0.28, 0.66], [-0.38, 0.54], [-0.36, 0.12], [-0.32, -0.24], [-0.16, -0.52], [0.06, -0.58]]);
    f.part(veilF, GLD({ fill: P.goldM, maxShade: 26 }));
    X.clipDraw(f, E.smooth(veilF), () => { X.fold2(f, E.smooth(veilF), hF([[0.18, -0.52], [-0.06, -0.5], [-0.26, -0.3], [-0.3, 0.1], [-0.3, 0.5]]), 22); });
    X.leaf(f, veilF, { cell: 50, s: 1.2, chips: 2, nB: 0 });
    // the crack splitting the face from the veil; burns over the brow and the cheek
    X.vcrack(f, hd([[0.12, -0.5], [0.06, -0.34], [0.0, -0.22], [-0.05, -0.1]]), 14);
    X.vcrack(f, hd([[-0.04, 0.0], [-0.09, 0.15], [-0.06, 0.3], [-0.13, 0.46]]), 12);
    X.crackV(f, hd([[0.02, -0.26]])[0], hA + 2.7, 110, 7, { depth: 1 });
    X.burn(f, hd([[0.2, -0.4]])[0], hA + 0.6, 140, 3.4, { depth: 2, clip: face });
    X.burn(f, hd([[-0.06, 0.42]])[0], hA - 2.2, 110, 3, { depth: 2, clip: face });
    f.flat(ell(hF([[0.345, 0.26]])[0], 4, 5, 0, 8), P.void); leak(add(hF([[0.345, 0.26]])[0], [2, 6]), 30, 7, { drops: 2, shards: false }); // the far tear dripping off the cheek
  }
  // ================= floating rubble and gold leaf all round (chips)
  f.bone('chips');
  for (const [c, r] of [[[260, 560], 36], [[1240, 560], 28], [[1500, 720], 40], [[180, 900], 26], [[1290, 1240], 20], [[700, 1290], 18], [[1540, 1260], 22], [[620, 640], 18]]) { const q = X.chip(f, c, r, GLD({ maxShade: 6 })); f.flat([q[3], q[4], q[5]].map(z => add(z, mul(back, r * 0.35))).concat([q[5], q[4], q[3]]), '#0c0a0e', { op: 0.8 }); }
  X.leafDrift(f, [800, 760], 760, 700, 30, 1.6);
  return f;
}
module.exports = {
  heroes: [
    { key: 'shattered_god', name: 'The Shattered God', tier: 'ruler', w: TIERS.ruler[0], h: TIERS.ruler[1], flip: true, build: shatteredGod },
    { key: 'rift_leviathan', name: 'Rift Leviathan', tier: 'elite', w: TIERS.elite[0], h: TIERS.elite[1], flip: true, build: riftLeviathan },
    { key: 'thunder_seraph', name: 'Thunder Seraph', tier: 'elite', w: 1300, h: 1800, flip: true, build: thunderSeraph },
    { key: 'skywreck_knight', name: 'Skywreck Knight', tier: 'large', w: TIERS.large[0], h: TIERS.large[1], flip: true, build: skywreckKnight },
    { key: 'rift_hound', name: 'Rift Hound', tier: 'large', w: 1080, h: TIERS.large[1], flip: true, build: riftHound },
    { key: 'storm_shade', name: 'Storm Shade', tier: 'human', w: 700, h: TIERS.human[1], flip: true, build: stormShade },
    { key: 'choir_of_eyes', name: 'Choir of Eyes', tier: 'human', w: TIERS.human[0], h: TIERS.human[1], flip: true, build: choirOfEyes },
    { key: 'fallen_angel', name: 'Fallen Angel', tier: 'human', w: 820, h: TIERS.human[1], flip: true, build: fallenAngel },
  ],
};
