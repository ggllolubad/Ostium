// World XI, the Stilled Spire: THE CLOCK CHAMBER (`spire_boss`, round 2, new). Boss room for The Last Hour.
// Lore (bible XI, The Last Hour): "The great clock at the top of the spire. When it strikes twelve, the world stops. It
// is one minute to." The observatory's great astronomical clock, its mechanism exposed, frosted, fused and burned, a
// frozen astronomer caught in its gears. So the room is the clock chamber in the crown of the spire, behind the great
// outer dial that the whole plain could read.
// Kind of space: the highest interior of the world: a tall chamber of stone and timber; the back wall is the outer dial
// itself, a vast round of frosted glass seen from behind, its numerals reversed, the shadows of the outer hands on it.
// Light: the most dramatic in the world. The stopped night outside (moon and aurora) comes through the glass dial and
// backlights the chamber: a great luminous round on the right, the Last Hour standing in front of it like an eclipse;
// the shadows of the dial's glazing bars thrown across the floor toward us. Everything else is in silhouette.
// Composition: the right 45% is the Last Hour's stage: the luminous dial is centred on it so the clock face reads as a
// disc against a ring of light; nothing else stands there. Heroes left at the band.
// Shapes: the great circle (dial ring, its radial bars), against the hard timbers of the bell frame and the hour bell.
// Palette key: the highest contrast of the world: silver-blue light, black silhouettes, brass rims, aurora-green burns.
// Depth planes (far): the bell frame and the hour bell (9-13 m); the going train's iron bed and the stairhead (12-16 m);
// the dial wall (20 m) and the night outside it (far).
// Lore placed: the outer dial from behind (reversed numerals, the hands' shadows at one minute to twelve); the hour bell
// that will strike twelve, its hammer drawn back and frozen there; the bell rope; the stairhead coming up from the
// Clockwork Stair; the drive shaft from the movement out to the dial's arbor, fused at its joints; aurora-green burns
// down the iron; frost over everything, icicles from every timber.
// Mid: a fallen spare wheel, an oil can, a stopped hourglass on its side (sand mid-fall).
// Fore: top: the bell frame's tie beam; left: a frame post with an iron strap; right: the slack bell rope's end.
// No eyes. No red. Brass olive-brown, never gold.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XI');
const ROOM = 'spire_boss', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 11501, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#141c28' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#06080d' });
const { line, pline, fillP, fillS, inkP, inkS, blob, box, post, beam, icicles, rime, burn, fused, chain, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#06080d' });
const MV = require('./materials_v2')(S);
const { pool, frame, stars, gear } = G;

const BRASS = '#8c7c4c', BRASSD = '#54482a', FROST = '#d4e4ee', GLASS = '#b8cad8', MOON = '#e8f2fa', AUR = '#86e8b8', OAK = '#3a2e22', STONE = '#3e444e', MURK = B.MURK;
const ZD = 20, DX = 12.9, DY = 6.2, DR = 8.2;            // the outer dial: depth, centre, radius (m) — centred on the boss
const DC = P(DX, DY, ZD), DRp = K(ZD) * DR;
const burnA = (x, y, ang, len, w, o = {}) => burn(x, y, ang, len, w, Object.assign({ core: AUR, scorch: '#0c100e', coreOp: 0.6, haloOp: 0.3, branchP: 0.45, spread: 0.75 }, o));
const rad = (x, y) => Math.hypot(x - DC[0], y - DC[1]) / DRp;           // 1 at the dial's rim
// backlight: how lit a silhouette's edge is by the dial (near the dial, more)
const back = (x, y) => Math.max(0, 1 - (rad(x, y) - 1) / 2.2);

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the dial wall: dark stone round the great glass, a moulded stone ring framing it
{
  raw(`<path d="${pp([[-40, -2, ZD], [40, -2, ZD], [40, 22, ZD], [-40, 22, ZD]])}" fill="#0e1218"/>`);
  raw(S.ashlar((s, t) => [-40 + s, t, ZD], 80, 22, STONE, { rough: true, roughP: 0.4, scale: 1.2, vary: 0.2, lost: 0.2, skip: (a0, a1, t0, t1) => { const x = -40 + (a0 + a1) / 2, y = (t0 + t1) / 2; return Math.hypot(x - DX, y - DY) < DR + 0.6; } }));
  // light spilling round the ring onto the wall, stepped; dark elsewhere
  raw(fillP([P(-40, -2, ZD), P(40, -2, ZD), P(40, 22, ZD), P(-40, 22, ZD)], MURK, 0.5) + pool(DC[0], DC[1], DRp * 1.6, DRp * 1.6, MOON, { n: 4, op: 0.04 }));
  raw(hatch3((s, t) => [-40 + s, t, ZD], 0, 80, -2, 22, 0.7, { op: 0.4, keep: (s, t) => Math.hypot(-40 + s - DX, t - DY) > DR + 2.5 }) + hatch3((s, t) => [-40 + s, t, ZD], 0, 80, -2, 22, -0.8, { op: 0.35, keep: (s, t) => Math.hypot(-40 + s - DX, t - DY) > DR + 5 }));
  // the frame ring: voussoir-like stones round the dial, the inner arris catching the light
  for (let k = 0; k < 40; k++) { const a0 = k / 40 * Math.PI * 2, a1 = (k + 1) / 40 * Math.PI * 2, r0 = DR + 0.05, r1 = DR + 0.75 + (k % 2) * 0.15, q = [[a0, r0], [a1, r0], [a1, r1], [a0, r1]].map(([a, r]) => P(DX + Math.cos(a) * r, DY + Math.sin(a) * r, ZD));
    const c = q[0], qc = chip(q, 0.2), fl = mix(S.tone('#5a626e', 0.15), MOON, 0.12 * back(c[0], c[1])); raw(cel(qc, { Z: ZD, fill: fl, band: 1.5, inkW: 0.6 }) + MV.stoneMarks(qc, ZD, fl, { wy0: 3 })); }
}
// ---- the great dial from behind: frosted glass, the night beyond lighting it; the iron armature; reversed numerals;
// the outer hands' shadows standing at one minute to twelve; the arbor coming through the centre
{
  const ring = r => { const q = []; for (let k = 0; k < 96; k++) { const a = k / 96 * Math.PI * 2; q.push([DC[0] + Math.cos(a) * r, DC[1] + Math.sin(a) * r]); } return q; };
  raw(fillP(ring(DRp), GLASS));
  // the glass is lit unevenly: brightest high on the left where the moon stands behind it, in stepped rounds
  raw(pool(DC[0] - DRp * 0.25, DC[1] - DRp * 0.3, DRp * 0.95, DRp * 0.95, MOON, { n: 5, op: 0.16 }) + pool(DC[0] - DRp * 0.35, DC[1] - DRp * 0.45, DRp * 0.3, DRp * 0.3, '#ffffff', { n: 3, op: 0.25 }));
  // frost feathered across the glass, and an aurora-green cast seen through it at the bottom
  { const ck = S.id('dg'); raw(`<clipPath id="${ck}"><path d="${p2(ring(DRp))}"/></clipPath><g clip-path="url(#${ck})">`);
    raw(fillP([[DC[0] - DRp, DC[1] + DRp * 0.35], [DC[0] + DRp, DC[1] + DRp * 0.2], [DC[0] + DRp, DC[1] + DRp], [DC[0] - DRp, DC[1] + DRp]], AUR, 0.12));
    let fr = ''; for (let k = 0; k < 260; k++) { const a = R() * 6.28, d = Math.sqrt(R()) * DRp, x = DC[0] + Math.cos(a) * d, y = DC[1] + Math.sin(a) * d, b = R() * 6.28, l = 3 + R() * 9; fr += `M${f1(x)} ${f1(y)} l${f1(Math.cos(b) * l)} ${f1(Math.sin(b) * l)} `; } raw(`<path d="${fr}" stroke="#ffffff" stroke-width="0.7" opacity="0.45"/>`);
    raw(`<path d="${p2(ring(DRp))}" fill="url(#mottle)" opacity="0.3"/>`);
    // the outer hands' shadows on the glass: the hour hand at twelve, the minute hand one minute short (mirrored from
    // behind: one minute before twelve lies to the right of twelve seen from inside)
    const hand = (ang, len, w) => { const a = -Math.PI / 2 + ang, tx = DC[0] + Math.cos(a) * len, ty = DC[1] + Math.sin(a) * len, nx = -Math.sin(a) * w, ny = Math.cos(a) * w; return fillP([[DC[0] - nx - Math.cos(a) * len * 0.12, DC[1] - ny - Math.sin(a) * len * 0.12], [DC[0] + nx * 0.6 + Math.cos(a) * len * 0.8, DC[1] + ny * 0.6 + Math.sin(a) * len * 0.8], [tx, ty], [DC[0] - nx * 0.6 + Math.cos(a) * len * 0.8, DC[1] - ny * 0.6 + Math.sin(a) * len * 0.8], [DC[0] + nx - Math.cos(a) * len * 0.12, DC[1] + ny - Math.sin(a) * len * 0.12]], '#2a3644', 0.7); };
    raw(hand(0.01, DRp * 0.58, DRp * 0.05) + hand(Math.PI * 2 / 60, DRp * 0.9, DRp * 0.032));
    raw('</g>');
  }
  // the armature: concentric iron rings and radial glazing bars, the leads between panes
  for (const k of [0.97, 0.78, 0.62, 0.3]) { const q = ring(DRp * k); raw(`<path d="${p2(q)}" fill="none" stroke="${INK}" stroke-width="${f1(k > 0.9 ? 5 : 3)}"/>`); }
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, r0 = k % 2 ? DRp * 0.62 : DRp * 0.3; raw(pline([[DC[0] + Math.cos(a) * r0, DC[1] + Math.sin(a) * r0], [DC[0] + Math.cos(a) * DRp * 0.97, DC[1] + Math.sin(a) * DRp * 0.97]], k % 2 ? 1.8 : 3, INK)); }
  // the hour ring between the outer rings: reversed numerals as ink strokes (seen from behind), XII at the top
  const glyph = (x, y, s, str, ang) => { let d = '', cx = 0; const parts = str.split('').reverse(); for (const ch of parts) { if (ch === 'I') { d += `M${cx} ${-s} L${cx} ${s} `; cx += s * 0.7; } else if (ch === 'V') { d += `M${cx} ${-s} L${cx + s * 0.55} ${s} L${cx + s * 1.1} ${-s} `; cx += s * 1.5; } else { d += `M${cx} ${-s} L${cx + s * 1.1} ${s} M${cx + s * 1.1} ${-s} L${cx} ${s} `; cx += s * 1.5; } }
    return `<path d="${d}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang * 57.3)}) translate(${f1(-cx / 2)} 0) scale(-1 1) translate(${f1(-cx)} 0)" stroke="${INK}" stroke-width="2.2" fill="none" opacity="0.7"/>`; };
  const nums = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  for (let k = 0; k < 12; k++) { const a = -Math.PI / 2 - k / 12 * Math.PI * 2, r = DRp * 0.87; raw(glyph(DC[0] + Math.cos(a) * r, DC[1] + Math.sin(a) * r, DRp * 0.035, nums[k], a + Math.PI / 2)); }
  // the arbor through the centre: the drive shaft's end with its fused collar
  raw(`<circle cx="${f1(DC[0])}" cy="${f1(DC[1])}" r="${f1(DRp * 0.06)}" fill="${BRASSD}" stroke="${INK}" stroke-width="2"/>` + fused(DC[0], DC[1], DRp * 0.04, '#6a5a3a', ZD));
  // frost crust on the inside of the rim, icicles hanging from the lower bars
  raw(rime(ring(DRp * 0.97).slice(48, 96).concat([ring(DRp * 0.97)[0]]), ZD, { th: 4, col: FROST }) + icicles(ring(DRp * 0.97).slice(6, 42), ZD, { len: 26, dens: 0.6, col: FROST }));
}
// ---- the drive: an iron shaft from the movement out to the dial's arbor, carried on brackets; fused at the joints
{ const a = P(-2, 4.2, 13), b = DC; raw(line([a, b], 7, INK) + line([a, b], 4, '#2e3440') + line([[a[0], a[1] - 1.5], [b[0], b[1] - 1.5]], 1, MOON, 0.4));
  for (const t of [0.3, 0.62]) { const p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; raw(fused(p[0], p[1], 6, '#4a4a52', 15)); } }
// ---- the going train: the clock's iron movement on its bed, wheels in a cage frame, stopped (low, dark, behind heroes)
{ const X0 = -8.5, X1 = -1, Z = 13.5;
  raw(box(X0, X1, 2.2, 2.45, Z - 0.6, Z + 0.6, { col: '#1e222a' }) + box(X0, X1, 4.6, 4.85, Z - 0.6, Z + 0.6, { col: '#22262e' }));
  for (const X of [X0 + 0.2, X0 + 2.6, X1 - 2.4, X1 - 0.2]) raw(post(X, Z - 0.55, 0.1, 2.2, 4.85, '#1e222a', { grain: false }));
  for (const [X, Y, r] of [[-7.2, 3.5, 0.9], [-5.5, 3.2, 0.5], [-4.3, 3.7, 0.75], [-2.6, 3.4, 0.6], [-1.9, 4.0, 0.3]]) raw(gear((u, v) => [u, v, Z - 0.65], X, Y, r, Z, { col: '#5a5034', spokes: 5, rot: R() * 6, behind: '#0a0c10' }));
  raw(rime([P(X0, 4.85, Z - 0.6), P(X1, 4.85, Z - 0.6)], Z, { th: 3, col: FROST }) + icicles([P(X0, 2.2, Z - 0.6), P(X1, 2.2, Z - 0.6)], Z, { len: 16, dens: 1, col: FROST })); }
// ---- the stairhead on the far left: the last turn of the Clockwork Stair coming up through the floor, its rail rimed
{ for (let k = 0; k < 7; k++) { const Y = -0.2 + k * 0.2, X = -13 + k * 0.42, Z = 15; raw(cel([P(X, Y, Z), P(X + 0.42, Y, Z), P(X + 0.42, Y + 0.2, Z), P(X, Y + 0.2, Z)], { Z, fill: '#2a2c32', band: 1, inkW: 0.5 })); }
 }
// ---- the bell frame and the hour bell: oak posts and braces, the great bell hung from the headstock, the hammer drawn
// back on its lever and frozen there; icicles from every timber; the bell's rim catching the dial's light
{
  const Z = 11, Yh = 6.3;
  for (const X of [-7.4, -1.6]) raw(post(X, Z, 0.22, 0, Yh + 0.3, OAK, { shadeOp: 0.55 }));
  raw(beam([-7.8, Yh, Z], [-1.2, Yh, Z], 0.4, '#2e241a') + beam([-7.4, 4.0, Z], [-5.6, Yh - 0.2, Z], 0.22, '#2e241a') + beam([-1.6, 4.0, Z], [-3.4, Yh - 0.2, Z], 0.22, '#2e241a'));
  raw(icicles([P(-7.8, Yh - 0.2, Z), P(-1.2, Yh - 0.2, Z)], Z, { len: 22, dens: 0.8, col: FROST }));
  // the bell: waisted profile, lip flared, the crown with its canons on the headstock
  const bx = -4.5, by = Yh - 0.35, bh = 2.5, prof = [], L = [], Rr = [];
  // a true bell profile: the rounded crown, the shoulder, the long concave waist, the sound bow swelling out to the lip
  for (let i = 0; i <= 16; i++) { const t = i / 16; let w = t < 0.12 ? 0.18 + 0.2 * Math.sin(t / 0.12 * Math.PI / 2) : 0.38 + 0.06 * (t - 0.12) + 0.5 * Math.pow(Math.max(0, (t - 0.55) / 0.45), 2.2); prof.push([w, t * 1.05 - 0.1]); }
  for (const [w, t] of prof) { L.push(P(bx - w * bh * 0.75, by - t * bh, Z)); Rr.push(P(bx + w * bh * 0.75, by - t * bh, Z)); }
  const bell = [...L, ...Rr.slice().reverse()]; raw(cel(bell, { Z, fill: '#6a5c36', band: 12, tex: 'url(#mottle)', texOp: 0.4 }) + line(L.map(([x, y]) => [x + 3, y]), 2, mix(BRASS, '#f4ecd0', 0.3), 0.5));
  raw(line([L[16], Rr[16]], 3, INK) + line([L[14], Rr[14]], 1.6, INK, 0.7) + line([L[12], Rr[12]], 1.2, INK, 0.6) + line([L[3], Rr[3]], 1.2, INK, 0.6) + line(Rr.slice(3, 16).map(([x, y]) => [x - 2, y]), 1.6, MOON, 0.55) + rime(L.slice(0, 6).concat([Rr[0]]), Z, { th: 3, col: FROST }) + icicles([L[16], Rr[16]], Z, { len: 18, dens: 1.2, col: FROST }));
  { const ck = S.id('bl'); raw(`<clipPath id="${ck}"><path d="${p2(bell)}"/></clipPath><g clip-path="url(#${ck})">` + burnA(Rr[8][0] - 4, Rr[8][1], 2.6, 60, 1.6, { depth: 3 }) + '</g>'); }
  // the hammer: an iron head on a lever drawn back from the bell's sound bow, held there by nothing
  const hp = P(-1.25, Yh - 2.0, Z - 0.3); raw(line([P(-0.8, Yh - 0.2, Z - 0.3), hp], 4, INK) + line([P(-0.8, Yh - 0.2, Z - 0.3), hp], 2.4, '#3a3e46') + cel([[hp[0] - 10, hp[1] - 8], [hp[0] + 6, hp[1] - 8], [hp[0] + 6, hp[1] + 8], [hp[0] - 10, hp[1] + 8]], { Z, fill: '#3a3e46', band: 2 }) + icicles([[hp[0] - 10, hp[1] + 8], [hp[0] + 6, hp[1] + 8]], Z, { len: 14, dens: 2, col: FROST }));
  // the bell rope hanging down from the wheel to the front, slack
  raw(line([P(-3.2, Yh, Z), P(-3.4, 4, Z - 2), P(-3.0, 0.6, Z - 3.4)], 2.4, INK) + line([P(-3.2, Yh, Z), P(-3.4, 4, Z - 2), P(-3.0, 0.6, Z - 3.4)], 1.2, '#6a5a44'));
}
// ---- the floor: boards on joists, frosted; the dial's light thrown across it with the shadows of the bars toward us
{
  raw(`<path d="${pp([[-40, 0, 3.5], [40, 0, 3.5], [40, 0, ZD], [-40, 0, ZD]])}" fill="#14181e"/>`);
  for (let X = -30; X < 30; X += 0.28) { const a = P(X, 0, 3.5), b = P(X, 0, ZD); raw(pline([a, b], 0.8, INK, 0.5)); }
  for (let k = 0; k < 160; k++) { const X = -20 + R() * 40, Z = 4 + Math.pow(R(), 0.7) * 16, L = 1 + R() * 2.5, a = P(X, 0, Z), b = P(X, 0, Z + L); raw(pline([a, b], 0.6, '#5a6470', 0.35)); }
  raw(G.bandFloor(-14, 14, { col: '#2a2e36', wear: '#4a505a', debrisCol: '#3a3e46', wearOp: 0.3 }));
  // a ladder up to the bell frame (a scale cue: rungs a foot apart), leaning on the left post, rimed
  { const a0 = P(-8.6, 0, 10.2), a1 = P(-7.8, 6.2, 11), b0 = P(-8.0, 0, 10.2), b1 = P(-7.2, 6.2, 11); raw(line([a0, a1], 3.4, INK) + line([a0, a1], 2, '#4a3a28') + line([b0, b1], 3.4, INK) + line([b0, b1], 2, '#4a3a28')); for (let k = 1; k < 23; k++) { const t = k / 23, p = [a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t], q = [b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t]; raw(pline([p, q], 2, INK) + pline([p, q], 1, '#5a4a34')); } raw(rime([a1, a0].map(([x, y]) => [x - 1, y]), 10.5, { th: 1.6, col: FROST })); }
  // the light thrown from the dial: a long stretched round on the floor coming toward us, cut by the bars' shadows
  const lit = []; for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; lit.push(P(DX * 0.8 + Math.cos(a) * 6.5, 0.01, 11 + Math.sin(a) * 6.5)); }
  raw(fillS(lit, MOON, 0.16, 0.4) + fillS(lit.map(([x, y]) => [x + (DC[0] - x) * 0.25, y + (P(DX * 0.8, 0, 11)[1] - y) * 0.25]), MOON, 0.1, 0.4));
  for (let k = 0; k < 9; k++) { const X = DX * 0.8 - 6 + k * 1.5, a = P(X, 0.01, 17), b = P(X * 0.7 + (k - 4) * 0.6, 0.01, 5); raw(pline([a, b], 2.4, '#06080c', 0.5)); }
  raw(hatch3((s, t) => [-30 + s, 0, 3.5 + t], 0, 60, 0, 16, 0.3, { op: 0.4, keep: (s, t) => { const p = P(-30 + s, 0, 3.5 + t); return p[0] < 900; } }));
}
raw(quiet([[240, 0.09], [272, 0.09], [306, 0.08], [352, 0.08]], { hop: 0.12 }));
raw(frame('#030407', { sides: [[220, 0.16], [120, 0.2], [50, 0.24]], top: [[90, 0.2], [40, 0.22]] }));

// ======================================================================== MID
layer('mid');
// a fallen spare wheel, rimed, leaning on the bed's foot; an oil can; a stopped hourglass on its side, sand mid-fall
{ const Z = 10.5; raw(gear((u, v) => [u, v, Z], -5.2, 0.55, 0.55, Z, { col: '#3e3824', spokes: 5, rot: 0.4, behind: '#0a0c10' }));
  const c = P(-2.4, 0.1, 9.6), k = K(9.6); raw(cel([[c[0] - k * 0.07, c[1]], [c[0] + k * 0.07, c[1]], [c[0] + k * 0.06, c[1] - k * 0.15], [c[0] - k * 0.06, c[1] - k * 0.15]], { Z: 9.6, fill: '#3a3420', band: 1.5 }) + pline([[c[0], c[1] - k * 0.15], [c[0] + k * 0.12, c[1] - k * 0.28]], 1.2, INK));
  const h = P(3.2, 0.1, 9.2), r = K(9.2) * 0.12; raw(pline([[h[0] - r * 1.6, h[1] - r], [h[0] + r * 1.6, h[1] - r]], 2, INK) + pline([[h[0] - r * 1.6, h[1]], [h[0] + r * 1.6, h[1]]], 2, INK) + fillP([[h[0] - r * 1.4, h[1] - r * 0.9], [h[0], h[1] - r * 0.2], [h[0] - r * 1.4, h[1] - r * 0.1]], '#b8ae90', 0.85) + fillP([[h[0] + r * 1.4, h[1] - r * 0.9], [h[0], h[1] - r * 0.6], [h[0] + r * 1.4, h[1] - r * 0.1]], '#b8ae90', 0.85) + pline([[h[0], h[1] - r * 0.5], [h[0], h[1] - r * 0.25]], 1, '#d8ccaa')); }

// ======================================================================== FORE
layer('fore');
// top: the bell frame's tie beam across the top of the frame, close, its icicles
{ const pts = [[-10, -10], [W + 10, -10], [W + 10, 20], [-10, 34]]; raw(cel(pts, { Z: 3, fill: '#1e1812', band: 8, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.4"/>` + line([[-10, 34], [W + 10, 20]].map(([x, y]) => [x, y - 2]), 1.2, MOON, 0.3) + icicles([[-10, 34], [700, 27], [W + 10, 20]], 3, { len: 34, dens: 0.6, col: FROST })); }
// left: a frame post with an iron strap, rimed
{ const pts = [[-10, H + 5], [-10, 20], [58, 18], [56, H + 5]]; raw(cel(pts, { Z: 3, fill: '#241c14', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.45"/>`);
  for (const y of [90, 300]) raw(pline([[-10, y], [58, y + 3]], 9, INK) + pline([[-10, y], [58, y + 3]], 6, '#2e3238') + `<circle cx="20" cy="${y + 1}" r="3" fill="#4a4e56" stroke="${INK}" stroke-width="1"/>`);
  raw(rime([[-10, 22], [58, 20]], 3, { th: 6, col: FROST })); }
// right: the slack end of a shutter chain at the very edge, catching the dial's light
raw(chain([[W - 18, -10], [W - 26, 200], [W - 14, H + 10]], 5, '#2e3238') + line([[W - 20, -10], [W - 28, 200], [W - 16, H + 10]], 0.8, MOON, 0.3));
raw(fillP([[-5, H + 5], [-5, H - 12], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 10 - Math.sin(k * 1.5) * 5 - R() * 4]), [W + 5, H - 12], [W + 5, H + 5]], '#06080c', 0.92));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) }, boss_stage: { x: [814, 1480], dial_centre_1x: [+DC[0].toFixed(1), +DC[1].toFixed(1)], note: 'the outer dial is centred on the Last Hour placed at 2x x 2330' } }, null, 1));
console.log(ROOM, 'layers written');
