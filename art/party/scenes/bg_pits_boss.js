// World IV, the Sulphur Pits: THE FIRST BREACH, boss room of the Burning Lung (round 2, group g2). Room key 'pits_boss'.
// Contract as the nave: 1480 x 480 (shown at 2x); pits_boss_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounter: The Burning Lung (gas_miner, burning_lung). "The mine's first breath, grown into a toad the size of a chapel.
// Every breath it takes is fire." It was the first pocket of gas the miners broke into, and it took the shape of the toad
// that lived in it; it squats in the main gallery, filling it wall to wall.
// The place: the end of the main gallery, the tallest working in the pits, where the miners' picks first broke into the
// pocket. The gallery's far wall is torn open from the floor to out of frame in one ragged breach, and through it the pocket
// itself shows: a vast blistered cavity ribbed like the inside of a lung, glowing orange-white from within, breathing smoke.
// The gallery's timber sets are snapped and splayed where the thing came through; the rails run to the breach and are torn
// up and curled into it; crystal grows thick round the rim; ochre smoke rolls out along the roof, lit from below. At the
// left the gallery goes on as it was: sets, a lamp, the warning board, the old face marked with the miners' last tally.
// Composition: the right 45% is the boss's stage: the breach frames the giant, its glowing cavity behind his silhouette;
// the gallery and its rails lead the eye from the company to it.
// Courses: FIRE (the cavity's glow, seams in the rim, charred sets, ash rising, smoke); TOXIN (crystal rims, blisters on
// the cavity walls, the yellow-ochre smoke).
// Light: the most dramatic in the world: backlight from the breach, the gallery dark. Black against orange.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IV');
const W = 1480, H = 480, ROOM = 'pits_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2644, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e1006' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#0e0904', AIR = '#24160a';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 8, airD: 24, airMax: 0.5 });
const rockH = (pts, Z, col, o = {}) => G.smoothRock(pts, Z, col, Object.assign({ dir: 'h', rib: 9, wave: 3, k: 0.3 }, o, { dir: 'h' }));
const { line, polyS, timber, oilLamp } = G;
const { ell } = require('../engine');
const SULF = '#d8c040', OCHRE = '#a08048', LAMP = '#e8902a', HOT = '#ff8a2a', WHITE = '#fff0c8', ROCK = '#3a2c1a', SOOT = '#120a04';
const ZW = 17, RY = 7.2;
// the breach outline in screen space (1x): from the floor at x 800 up the left, over the top (out of frame), down the right edge
const BR = [[812, 352], [800, 300], [772, 250], [790, 196], [760, 150], [784, 104], [770, 52], [810, 14], [842, -12], [W + 20, -12], [W + 20, 356], [1420, 352], [1300, 356], [1180, 350], [1020, 356], [900, 352]];
const CC = [1150, 170];                                     // the cavity's hot core (behind the boss's head)
const LT = G.lightTint([{ p: [8, 3.5, 18], col: '#e8882a', r: 11, k: 0.7 }, { p: [-11.4, 2.4, 16.6], col: '#c87a30', r: 3, k: 0.45 }, { p: [3, 0.2, 12], col: '#c8702a', r: 8, k: 0.4, yk: 0.5 }]);

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3: through the breach, the pocket: a vast cavity ribbed like a lung, blistered, glowing from inside
{
  const cid = S.id('br'); raw(`<clipPath id="${cid}"><path d="${smooth(BR, true, 0.3)}"/></clipPath><g clip-path="url(#${cid})">`);
  // stepped glow from the walls to the core: red-brown at the rim, orange, then white-hot at the heart (no gradient)
  raw(`<rect x="700" y="-20" width="800" height="400" fill="#5a2410"/>`);
  for (const [r, col, op] of [[620, '#8a3a14', 1], [500, '#b8541a', 1], [380, '#d8762a', 1], [270, '#f09a3a', 1], [170, '#f8c060', 1], [90, '#ffe8a8', 0.9]]) {
    const pts = []; for (let k = 0; k < 30; k++) { const a = k / 30 * 6.283, j = 0.85 + R() * 0.25; pts.push([CC[0] + Math.cos(a) * r * j, CC[1] + Math.sin(a) * r * 0.62 * j]); } raw(`<path d="${smooth(pts, true, 0.6)}" fill="${col}" opacity="${op}"/>`); }
  // the ribs: ridges of rock arching round the core like the inside of a lung, each a dark band with a lit inner lip,
  // narrowing and paling as they go in; between them, blisters (alveoli of gas) and glowing seams
  for (let i = 0; i < 9; i++) {
    const r = 120 + i * 62 + R() * 30, a0 = -3.0 + R() * 0.9, a1 = a0 + 1.6 + R() * 2.2, w = 8 + i * 2.6 * (0.6 + R() * 0.8), pts = [], pts2 = [], ox = (R() - 0.5) * 60, oy = (R() - 0.5) * 30, ph = R() * 6;
    for (let a = a0; a <= a1; a += 0.08) { const rr = r * (1 + Math.sin(a * 2.3 + ph) * 0.12 + Math.sin(a * 5 + i) * 0.03), ww = w * (0.5 + 0.5 * Math.sin((a - a0) / (a1 - a0) * Math.PI)); pts.push([CC[0] + ox + Math.cos(a) * rr, CC[1] + oy + Math.sin(a) * rr * 0.6]); pts2.push([CC[0] + ox + Math.cos(a) * (rr + ww), CC[1] + oy + Math.sin(a) * (rr + ww) * 0.6]); }
    const col = mix('#3a1a0a', '#a84a1a', Math.max(0, 1 - i / 8) * 0.7);
    raw(`<path d="${smooth([...pts, ...pts2.reverse()], true, 0.5)}" fill="${col}" stroke="${INK}" stroke-width="${f1(0.8 + i * 0.12)}"/>` + line(pts, 1 + i * 0.12, '#ffd080', 0.6 - i * 0.04));
    for (let j = 0; j < 4 + i; j++) { const a = a0 + R() * (a1 - a0), rr = r - 6 - R() * 18; raw(BK.blisters(CC[0] + Math.cos(a) * rr, CC[1] + Math.sin(a) * rr * 0.6, 6 + i, 3, '#e8a040', { size: 2 + i * 0.4, flat: 0.7 })); }
  }
  for (let i = 0; i < 14; i++) { const a = R() * 6.28, r0 = 80 + R() * 300, pts = []; let r = r0, aa = a; for (let k = 0; k < 6; k++) { pts.push([CC[0] + Math.cos(aa) * r, CC[1] + Math.sin(aa) * r * 0.6]); r += 14 + R() * 10; aa += (R() - 0.5) * 0.1; } raw(EM(line(pts, 1.4, '#ffe0a0', 0.75))); }
  // smoke breathing out of the cavity, lit from inside: rolled lobes, pale where the light catches them
  raw(G.steam(CC[0] - 120, CC[1] + 60, 260, 200, { col: '#e8b070', op: 0.18, n: 7, drift: -0.5 }));
  raw('</g>');
}
// ---- plane 2: the gallery's far wall (Z 17) to the left of the breach: hewn rock, the sets, the old face, the board
{
  const at = (s, t) => [-34 + s, t, ZW], cid = S.id('gw');
  raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="M-20 -20 L${W + 20} -20 L${W + 20} ${H} L-20 ${H} Z ${smooth(BR, true, 0.3)}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(G.hewnRock(at, 68, 10, ROCK, { bed: 0.5, block: 3.0, pick: 0.5, tint: LT }));
  for (const [t0, ph] of [[3.6, 0.4], [5.2, 2.1], [2.4, 4.2]]) { const top = [], bot = []; for (let k = 0; k <= 46; k++) { const ss = k * 1.5, tt = t0 + Math.sin(ss * 0.13 + ph) * 0.25; top.push(P(...at(ss, tt))); bot.push(P(...at(ss, tt - 0.2 - Math.abs(Math.sin(ss * 0.3 + ph)) * 0.2))); } raw(`<path d="${p2([...top, ...bot.slice().reverse()])}" fill="${MURK}" opacity="0.5"/>` + line(top, 1.3, INK, 0.9) + line(top.map(([x, y]) => [x, y - 1.2]), 0.8, '#d8a060', 0.3)); }
  // the side gallery going off into the dark at the far left, a lamp deep in it
  raw(`<path d="${pp([[-14.6, 0, ZW], [-11.4, 0, ZW], [-11.4, 2.8, ZW], [-14.6, 2.8, ZW]])}" fill="#0a0604"/>`);
  for (let Z = 30; Z > ZW; Z -= 1.8) { const col = mix('#4a3820', MURK, 0.3 + (Z - ZW) / 18 * 0.6); raw(timber([-14.4, 0, Z], [-14.3, 2.7, Z], 0.24, { col, noDim: true }) + timber([-11.6, 0, Z], [-11.7, 2.7, Z], 0.24, { col, noDim: true }) + timber([-14.6, 2.7, Z], [-11.4, 2.75, Z], 0.24, { col, noDim: true })); }
  { const l = P(-12.6, 1.6, 27); raw(oilLamp(l[0], l[1], 2.4, true, { gr: 7, gop: 0.4 })); }
  // a tally of the last shift chalked on the face, struck through; the warning board (a lamp with a cross through it)
  { const c = P(-7.2, 1.9, ZW - 0.05), k = K(ZW); let d = ''; for (let i = 0; i < 9; i++) d += `M${f1(c[0] + i * k * 0.08)} ${f1(c[1])} l${f1(k * 0.02)} ${f1(k * 0.22)} `; d += `M${f1(c[0] - 3)} ${f1(c[1] + k * 0.18)} L${f1(c[0] + k * 0.75)} ${f1(c[1] + k * 0.02)}`; raw(`<path d="${d}" stroke="#d8d0bc" stroke-width="0.9" opacity="0.7"/>`); }
  { const c = P(-3.8, 2.2, ZW - 0.1), k = K(ZW); raw(cel([[c[0] - k * 0.35, c[1] - k * 0.25], [c[0] + k * 0.35, c[1] - k * 0.22], [c[0] + k * 0.33, c[1] + k * 0.25], [c[0] - k * 0.34, c[1] + k * 0.24]], { Z: ZW, fill: '#4a3a24', tex: 'url(#mottle)', texOp: 0.5, band: 1.4 }) + `<path d="M${f1(c[0] - 4)} ${f1(c[1] + 5)} l3 -9 l2 0 l3 9 Z M${f1(c[0] - k * 0.25)} ${f1(c[1] + k * 0.18)} L${f1(c[0] + k * 0.25)} ${f1(c[1] - k * 0.16)}" stroke="#d8d0bc" stroke-width="1" fill="none" opacity="0.8"/>`); }
  raw(hatch3(at, 0, 68, 0, 1.4, 0.7, { op: 0.35, ragged: 0.3 }));
  raw('</g>');
  // the sets along the far wall, regular at the left and snapped toward the breach
  for (const [X, st] of [[-17, 0], [-9.6, 0], [-5.4, 0], [-1.4, 1], [2.2, 2]]) {
    const Z = ZW - 0.3;
    if (st === 0) raw(timber([X, 0, Z], [X + 0.1, RY - 0.3, Z], 0.42, { bloom: 0.3 }) + timber([X - 1.6, RY - 0.5, Z], [X + 1.6, RY - 0.4, Z], 0.4, {}));
    if (st === 1) raw(timber([X, 0, Z], [X + 0.6, 4.2, Z], 0.42, { char: 0.5, hotP: 0.5 }) + timber([X + 0.6, 4.2, Z], [X - 0.4, 6.6, Z], 0.36, { char: 0.0, hotP: 0.5 }));
    if (st === 2) raw(timber([X - 0.9, 0, Z - 0.4], [X + 1.6, 1.0, Z - 0.6], 0.42, { char: 0.3, hotP: 0.5 }) + timber([X + 0.4, 5.4, Z], [X - 0.6, 7.6, Z], 0.4, { char: 0.0 }));
  }
  { const l = P(-9.4, 3.0, ZW - 0.5); raw(glow(l[0], l[1], 140, 110, LAMP, 0.3) + oilLamp(l[0], l[1], 7, true, { gr: 4 })); }
}
// ---- the breach rim: broken rock teeth along the edge, thick in crystal, glowing seams; snapped sets jutting in
{
  // the cut through the wall's thickness, seen inside the hole as a dark ragged band; teeth of rock left standing into it,
  // each its own size; the inner lip lit by the cavity's light; crystal grown thick on it; seams glowing
  const cid = S.id('rimc'), bd = smooth(BR, true, 0.3);
  raw(`<clipPath id="${cid}"><path d="${bd}"/></clipPath><g clip-path="url(#${cid})"><path d="${bd}" fill="none" stroke="#1a1008" stroke-width="34"/><path d="${bd}" fill="none" stroke="${S.hatchA(16)}" stroke-width="34" opacity="0.5"/>`);
  for (let i = 0; i < BR.length - 1; i++) { const A = BR[i], B = BR[i + 1]; if (A[0] > W && B[0] > W) continue;
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), nx = (B[1] - A[1]) / L, ny = -(B[0] - A[0]) / L, n = Math.max(1, Math.round(L / 70));
    for (let k = 0; k < n; k++) { if (R() < 0.35) continue; const u0 = k / n + R() * 0.3 / n, u1 = u0 + (0.5 + R() * 0.5) / n, um = u0 + (u1 - u0) * (0.25 + R() * 0.5), len = 10 + Math.pow(R(), 1.5) * 60;
      const p0 = [A[0] + (B[0] - A[0]) * u0, A[1] + (B[1] - A[1]) * u0], p1 = [A[0] + (B[0] - A[0]) * u1, A[1] + (B[1] - A[1]) * u1], tip = [A[0] + (B[0] - A[0]) * um - nx * len + (R() - 0.5) * 10, A[1] + (B[1] - A[1]) * um - ny * len + (R() - 0.5) * 10];
      raw(cel([p0, [p0[0] - nx * len * 0.5 + (R() - 0.5) * 12, p0[1] - ny * len * 0.5 + (R() - 0.5) * 12], tip, [tip[0] + (p1[0] - tip[0]) * 0.4 + (R() - 0.5) * 10, tip[1] + (p1[1] - tip[1]) * 0.4], p1], { Z: 14, fill: tone('#2a1a0c', 0.12), tex: 'url(#mottle)', texOp: 0.4, band: 2 }) + line([p0, tip], 1.2, '#ffb060', 0.55));
      if (R() < 0.35) raw(BK.sulphur(tip[0], tip[1] + 4, 10, 4, { size: 4 + R() * 4, col: '#e0c040' }));
      if (R() < 0.3) raw(EM(line([p0, [(p0[0] + tip[0]) / 2 + 3, (p0[1] + tip[1]) / 2], tip], 1.2, HOT, 0.85))); } }
  raw('</g>');
  raw(line(BR.slice(0, 10), 3.2, INK, 1));
  // a cap beam snapped in a V across the top of the breach, a set leg hanging into it on its spikes
  raw(timber([1.2, 6.2, 15.8], [4.2, 4.4, 15.8], 0.42, { char: 0.4, hotP: 0.5 }) + timber([4.2, 4.4, 15.8], [6.4, 7.9, 15.8], 0.4, { char: 0.0, hotP: 0.5 }));
}
// ---- the smoke rolling out along the gallery roof to the left, lit from below
{
  // smoke rolling out of the breach along the roof: soft masses, lit from below, wisps tearing off toward the left
  for (const [x, y, w, h, op] of [[980, 40, 420, 90, 0.75], [720, 50, 380, 70, 0.6], [470, 34, 360, 60, 0.45], [220, 46, 300, 50, 0.35]]) raw(G.softMass(x, y, w, h, '#5a3e20', { lit: '#f0a050', dark: '#24160a', op, litOp: 0.45, drift: -1, wisps: 3 }));
  raw(`<path d="${smooth([[-20, -20], [1100, -20], [1060, 50], [900, 70], [600, 66], [300, 58], [-20, 64]], true, 0.6)}" fill="${MURK}" opacity="0.25"/>`);
}
raw(G.frameDark(CC[0] - 120, CC[1] + 30, 880, 360, [[1.0, 0.26], [0.8, 0.22], [0.62, 0.16]]));
raw(BK.quiet(MURK, 236, 352, { steps: [0.16, 0.2, 0.22, 0.26], hop: 0.2 }));
// ---- the gallery floor: rock with spilt ore, the rails running from the left toward the breach and torn up into it,
// scorch fanning out from the breach, crushed tubs, a lost boot and cap
{
  const at = (s, t) => [-34 + s, 0, 3.6 + t], Lz = ZW - 3.6;
  raw(`<path d="${pp([at(0, 0), at(68, 0), at(68, Lz), at(0, Lz)])}" fill="#2a2014"/><path d="${pp([at(0, 0), at(68, 0), at(68, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.6"/>`);
  for (let i = 0; i < 12; i++) { const X = -16 + R() * 30, Z = 4.6 + R() * 10, w = 1 + R() * 2, d = 0.5 + R() * 0.8, lt = LT([X, 0, Z]); const q = S.blobST(X, Z, w, d, 9, 0.4).map(([a, b]) => P(a, 0.004, b)); raw(cel(q, { Z, fill: tone(lt ? mix('#3a2e1e', lt[0], lt[1] * 0.5) : '#3a2e1e', 0.15), tex: 'url(#mottle)', texOp: 0.4, band: Math.max(0.8, K(Z) * 0.02), inkW: 0.5 })); }
  for (let i = 0; i < 160; i++) { const X = -18 + R() * 34, Z = 3.8 + Math.pow(R(), 0.8) * (Lz - 0.4), [x, y] = P(X, 0, Z), r = K(Z) * (0.03 + R() * 0.08); raw(cel(chip(ell([x, y - r * 0.3], r, r * 0.45, (R() - 0.5) * 0.4, 7), 0.6), { Z, fill: tone(R() < 0.2 ? '#8a7432' : '#3a3022', 0.2), band: 0.7, inkW: 0.4, heavy: 0.6, hi: false })); }
  // two pairs of rails: running in from the left, the near pair torn up and curled where it meets the breach
  for (const [Zr, torn] of [[12.6, true], [9.4, false]]) for (const dz of [-0.35, 0.35]) {
    const pts = []; for (let X = -30; X <= (torn ? 3.5 : 1.2); X += 0.6) pts.push(P(X, 0.05, Zr + dz));
    raw(line(pts, 2, INK, 1) + line(pts.map(([x, y]) => [x, y - 0.6]), 0.9, '#9a8670', 0.85));
    if (torn) { const e = P(3.5, 0.05, Zr + dz), k = K(Zr); raw(line([e, [e[0] + k * 0.6, e[1] - k * 0.4], [e[0] + k * 1.0, e[1] - k * 1.3], [e[0] + k * 0.7, e[1] - k * 1.8]], 2.4, INK, 1) + line([e, [e[0] + k * 0.6, e[1] - k * 0.4], [e[0] + k * 1.0, e[1] - k * 1.3], [e[0] + k * 0.7, e[1] - k * 1.8]], 1, '#b08a60', 0.8)); }
    else { const e = P(1.2, 0.05, Zr + dz), k = K(Zr); raw(line([e, [e[0] + k * 0.5, e[1] - k * 0.15], [e[0] + k * 0.9, e[1] - k * 0.05]], 2, INK, 1)); }
  }
  for (const Zr of [12.6, 9.4]) for (let X = -30; X < (Zr > 10 ? 3.2 : 1); X += 0.8) raw(line([P(X, 0.02, Zr - 0.6), P(X, 0.02, Zr + 0.6)], Math.max(1, K(Zr) * 0.1), '#22180c', 0.95));
  // scorch fanned out over the floor from the breach
  for (let i = 0; i < 9; i++) { const a = Math.PI + (R() - 0.5) * 1.4, X0 = 5 + R() * 2, Z0 = 14 + R() * 2; raw(BK.scorch((s, t) => [s, 0.01, t], X0, Z0, 3 + R() * 3, a, { w: 0.06, depth: 3, col: '#0a0604', halo: '#3a1a08', haloOp: 0.3, core: HOT, coreOp: 0.35 })); }
  raw(G.floorCracks(at, 10, 34, 0.5, Lz, 7, { toward: 40, lip: '#c87a40' }));
  raw(glow(P(6, 0, 15)[0], P(6, 0, 15)[1], 500, 50, HOT, 0.22));
  raw(S.occBand((s, t) => [-34 + s, 0, ZW - t], 68, 1.2, { op: 0.25 }));
}

// ======================================================================== MID
layer('mid');
{
  // a crushed ore tub on its side, a dropped miner's cap and boot, a lamp still burning on the floor
  const Z = 10.8, k = K(Z);
  { const c = P(-6.4, 0, Z); raw(cel([[c[0] - k * 0.6, c[1] - k * 0.5], [c[0] + k * 0.3, c[1] - k * 0.62], [c[0] + k * 0.5, c[1] - k * 0.1], [c[0] - k * 0.1, c[1] - k * 0.2], [c[0] - k * 0.55, c[1]]], { Z, fill: '#2e2416', tex: 'url(#mottle)', texOp: 0.5, band: 2 }) + line([[c[0] - k * 0.5, c[1] - k * 0.3], [c[0] + k * 0.35, c[1] - k * 0.4]], 1.6, '#1a1410', 1) + BK.sulphur(c[0] - k * 0.8, c[1] - 2, k * 0.4, 9, { size: k * 0.05, col: '#8a7832' })); }
  { const c = P(-1.6, 0, Z - 0.6), kk = K(Z - 0.6); raw(cel(ell([c[0], c[1] - kk * 0.04], kk * 0.13, kk * 0.05, 0, 12), { Z, fill: '#221a12', band: 1 }) + oilLamp(c[0] + kk * 0.3, c[1] - 1, kk * 0.07, true, { gr: 5, gop: 0.3 })); }
}

// ======================================================================== FORE: a great near set at the left; rubble low right
layer('fore');
{
  const ZN = 4.2;
  raw(timber([-4.75, -0.6, ZN], [-4.55, RY, ZN], 0.55, { char: 0.6, hotP: 0.3 }) + timber([-4.3, -0.6, ZN + 0.3], [-3.9, 3.8, ZN + 0.3], 0.3, {}));
  raw(timber([-34, 4.0, ZN + 0.4], [-2.6, 4.25, ZN + 0.4], 0.5, { char: 0.85, hotP: 0.4 }));
  { const c = P(-4.4, 2.6, ZN - 0.2); raw(oilLamp(c[0] + 30, c[1], 9, false)); }
  raw(rockH([[-20, H + 4], [-10, H - 46], [60, H - 60], [140, H - 42], [200, H + 4]], 3, '#1e1408', { cell: 24, flank: 0.4, rimCol: '#e89050', rimOp: 0.35 }));
  raw(rockH([[W - 200, H + 4], [W - 150, H - 24], [W - 70, H - 36], [W + 20, H - 22], [W + 20, H + 4]], 3, '#1a1208', { cell: 20, flank: 0.3, rimCol: '#ffa050', rimOp: 0.6 }));
  // ash and embers rising past the fighters, more toward the breach
  for (let i = 0; i < 70; i++) { const x = 300 + Math.pow(R(), 0.6) * 1180, y = 30 + R() * 400; raw(R() < 0.35 ? EM(`<path d="M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * 2)} ${f1(-3 - R() * 4)}" stroke="${R() < 0.5 ? '#ffd080' : HOT}" stroke-width="${f1(0.7 + R() * 0.6)}" stroke-linecap="round"/>`) : `<path d="M${f1(x)} ${f1(y)} q${f1(-2 + R() * 2)} -3 ${f1(R() * 3)} ${f1(-6 - R() * 4)}" stroke="#8a7e70" stroke-width="${f1(0.5 + R() * 0.6)}" fill="none" opacity="${f1(0.35 + R() * 0.3)}"/>`); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) }, boss_stage: { x_from: 814, note: 'right 45% kept for the ruler; the breach frames it' } }, null, 1));
console.log(ROOM + ' layers written');
