// World XI, the Stilled Spire: THE DOME HALL (battle room, Living Ink). The observatory's round domed hall, where the
// astronomers stopped the hour. Same contract as the nave.
// Lore (bible/world_XI_stilled_spire.md): an observatory whose astronomers tried to stop time; they mostly succeeded: the
// clocks still tick inside the ice. Frost freezes bodies mid-motion; lightning fuses brass and leaves aurora-coloured
// burns. Palette: brass, pale blue, aurora green (plus stone grey, ink, bone). No lightning in the air: the strike shows
// only as aurora-green Lichtenberg burns branching over plaster and brass, fused brass at joints and pivots.
// What is placed:
//   - the drum of the hall, a round wall of blue-grey ashlar, frost on every bed, icicles from every ledge
//   - the dome over it, its stone courses curving up out of frame, brass-shod ribs, the observing slit open on a stopped
//     night (stars, no aurora), the shutter chains hanging
//   - the spire's lower clock in the drum wall: dial with hour, zodiac and star rings, the hands at ONE MINUTE TO
//     TWELVE, frosted over, the hand pivot fused; the empty niche of its striking jack and the jack's bell
//   - the lightning conductor, a copper strap down the wall from the dome: where the strike came down it, its fixings
//     fused and burns branching out over the ashlar
//   - an armillary sphere on its pedestal, its rings fused together at the crossings, frozen in a turn
//   - THE MERIDIAN LINE: a brass strip let into the floor from the wall to the front, degree ticks and the twelve signs
//     in roundels along it; frost in the joints of the floor
//   - tall windows in the drum, frosted blind, with stopped snow on their sills
//   - fore: an iron telescope pier with a brass setting circle, rimed; slack shutter chains hung with icicles; a frozen
//     star chart on the floor, a dropped pair of dividers
// No eyes (not a void world). Red not used. Brass is not gold: olive-brown metal, verdigris in the crevices.
// Usage: node scenes/bg_spire_dome.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XI');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 11101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1c2634' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW, GLOW, EM } = S;
const B = require('./battle_kit_b')(S, { murk: '#0d1218' });
const { fog, line, pline, fillP, fillS, inkP, blob, jag, lump, box, post, beam, icicles, rime, burn, fused, chain, quiet } = B;

const BRASS = '#8c7c4c', BRASSD = '#54482a', VERD = '#5a7a6a', FROST = '#d4e4ee', BLUE = '#9fb8cc', STONE = '#6c7684', STONED = '#3e4652', AUR = '#86e8b8', MURK = B.MURK;
const RC = 10, ZC = 6.2, YS = 5.2;                      // the drum: radius, centre depth; the dome springs at YS
const drum = (a, Y) => [RC * Math.sin(a), Y, ZC + RC * Math.cos(a)];
const atD = (s, t) => drum((s - 18) / RC, t);           // s along the wall (metres of arc), centred at s = 18
const dome = (a, Y) => { const r = Math.sqrt(Math.max(0, RC * RC - (Y - YS) * (Y - YS))); return [r * Math.sin(a), Y, ZC + r * Math.cos(a)]; };
const burnA = (x, y, ang, len, w, o = {}) => burn(x, y, ang, len, w, Object.assign({ core: AUR, scorch: '#0c100e', coreOp: 0.5, haloOp: 0.35, branchP: 0.4, spread: 0.7 }, o));

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the dome: courses of stone curving overhead (each patch its own cel, facing down: shaded), brass ribs, the slit
{
  const AN = 1.35, NA = 26, YS2 = [5.2, 5.9, 6.7, 7.6, 8.6, 9.7, 11, 12.4, 14.2];
  for (let j = 0; j < YS2.length - 1; j++) for (let i = 0; i < NA; i++) {
    const a0 = -AN + 2 * AN * i / NA, a1 = a0 + 2 * AN / NA, y0 = YS2[j], y1 = YS2[j + 1];
    if (Math.abs((a0 + a1) / 2) < 0.08 && y0 > 7.5) continue;                       // the observing slit
    const q = [dome(a0, y0), dome(a1, y0), dome(a1, y1), dome(a0, y1)].map(p => P(...p));
    if (Math.max(...q.map(p => p[1])) < -20) continue;
    const col = fog(S.tone(mix(STONE, STONED, 0.45 + j * 0.05), 0.12), 14, 0.5);
    raw(cel(chip(q, 0.25), { Z: 14, fill: col, band: 1.5, tex: 'url(#mottle)', texOp: 0.35, inkW: 0.6, hi: false }) + `<path d="${p2(q)}" fill="${S.hatchA(14)}" opacity="${f1(0.3 + j * 0.04)}"/>`);
    if (R() < 0.25) raw(`<path d="${p2(q)}" fill="${S.hatchB(14)}" opacity="0.3"/>`);
  }
  // the slit: open onto a stopped night, stars that do not wheel; the shutter's iron edges, rimed
  { const L = [], Rr = []; for (let k = 0; k <= 14; k++) { const Y = 7.6 + k * 0.5; L.push(P(...dome(-0.08, Y))); Rr.push(P(...dome(0.08, Y))); } const sl = [...L, ...Rr.reverse()];
    raw(fillP(sl, '#0a0e1a')); let st = ''; for (let k = 0; k < 40; k++) { const t = R(), x = L[0][0] + (Rr[0][0] - L[0][0]) * R(), y = L[0][1] - R() * 200; st += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.4 + R() * 0.9)}" fill="#e8eef8" opacity="${f1(0.4 + R() * 0.5)}"/>`; } const cs = S.id('sl'); raw(`<clipPath id="${cs}"><path d="${p2(sl)}"/></clipPath><g clip-path="url(#${cs})">${st}</g>`);
    for (const side of [L, Rr.slice().reverse()]) raw(line(side, 4, INK) + line(side, 2, '#3a4048')); raw(icicles(L.slice(0, 1).concat(Rr.slice(-1)), 14, { len: 16, dens: 2, col: FROST })); }
  // ribs: brass-shod stone, springing from the drum; burns where the strike ran down them to the conductor
  for (const a of [-1.2, -0.85, -0.5, -0.17, 0.17, 0.5, 0.85, 1.2]) {
    const pts = []; for (let k = 0; k <= 16; k++) pts.push(P(...dome(a, YS + k * 0.6)));
    raw(line(pts, Math.max(3, K(14) * 0.22), INK) + line(pts, Math.max(2, K(14) * 0.15), fog(BRASSD, 14, 0.5)) + line(pts.map(([x, y]) => [x - 1, y]), 1, mix(BRASS, '#f4ecd0', 0.3), 0.5));
    raw(icicles(pts.slice(0, 6).map(([x, y]) => [x, y + K(14) * 0.08]), 14, { len: 18, dens: 1.2, col: FROST }));
    if (a === -0.5) for (let k = 2; k < 10; k += 3) raw(burnA(pts[k][0], pts[k][1], (R() < 0.5 ? 0.3 : 2.8), 40 + R() * 30, 2, { depth: 3 }));
  }
}
// ---- the drum wall: ashlar on the round, frost on the beds; tall frosted windows; the cornice where the dome springs
{
  const sk = (s0, s1, t0, t1) => { const sm = (s0 + s1) / 2; return (Math.abs(sm - 18 + 7.9) < 0.75 || Math.abs(sm - 18 - 7.9) < 0.75) && (t0 + t1) / 2 > 1.4 && (t0 + t1) / 2 < 4.6; };
  { const cl = []; for (let k = 0; k <= 40; k++) cl.push(P(...drum(-1.75 + 3.5 * k / 40, 0))); for (let k = 40; k >= 0; k--) cl.push(P(...drum(-1.75 + 3.5 * k / 40, YS))); const cd = S.id('dr'); raw(`<clipPath id="${cd}"><path d="${p2(cl)}"/></clipPath><g clip-path="url(#${cd})">`); }
  raw(S.ashlar(atD, 36, YS, fog(STONE, 15, 0.5), { vary: 0.22, chip: 0.45, mortar: 0.6, lost: 0.12, spall: 0.2, rough: true, roughP: 0.3, weather: { algae: 0, salt: 0.45, saltCol: FROST }, skip: sk }) + '</g>');
  // the windows: tall round-headed lights, frosted blind (feathered rime over the glass), stopped snow on the sills
  for (const sgn of [-1, 1]) { const s0 = 18 + sgn * 7.9, pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push(atD(s0 - 0.7 + 1.4 * u, 4.0 + Math.sin(u * Math.PI) * 0.7)); }
    const win = [atD(s0 - 0.7, 1.4), ...pts, atD(s0 + 0.7, 1.4)].map(p => P(...p));
    raw(fillP(win, mix(BLUE, MURK, 0.25)) + `<path d="${p2(win)}" fill="url(#mottle)" opacity="0.5"/>`);
    let fr = ''; for (let k = 0; k < 60; k++) { const x = win[0][0] + R() * (win[win.length - 1][0] - win[0][0]), y = win[0][1] - R() * (win[0][1] - win[6][1]), l = 3 + R() * 6, a = R() * 6.28; fr += `M${f1(x)} ${f1(y)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)} `; }
    const cw = S.id('wn'); raw(`<clipPath id="${cw}"><path d="${p2(win)}"/></clipPath><g clip-path="url(#${cw})"><path d="${fr}" stroke="${FROST}" stroke-width="0.8" opacity="0.7"/>${pline([P(...atD(s0, 1.4)), P(...atD(s0, 4.6))], 1.6, INK)}${[2.2, 3.0, 3.8].map(Y => pline([P(...atD(s0 - 0.7, Y)), P(...atD(s0 + 0.7, Y))], 1.2, INK)).join('')}</g>`);
    raw(inkP(win, 1.8) + rime([P(...atD(s0 - 0.75, 1.42)), P(...atD(s0, 1.45)), P(...atD(s0 + 0.75, 1.42))], 15, { th: 4, col: FROST }) + icicles([P(...atD(s0 - 0.8, 1.35)), P(...atD(s0 + 0.8, 1.35))], 15, { len: 14, dens: 1.2, col: FROST })); }
  // the wall steps down toward the murk in the fighters' band
  for (const [yt, op] of [[2.9, 0.16], [2.2, 0.16], [1.5, 0.18], [0.8, 0.2]]) { const pts = []; for (let k = 0; k <= 36; k++) pts.push(atD(k, yt + Math.sin(k * 1.3) * 0.08)); raw(`<path d="${pp([atD(0, 0), atD(36, 0), ...pts.reverse()])}" fill="${MURK}" opacity="${op}"/>`); }
  raw(hatch3(atD, 0, 36, 0, 3.0, 0.8, { op: 0.35, ragged: 0.25 }) + hatch3(atD, 0, 36, 0, 1.6, -0.8, { op: 0.32, ragged: 0.3 }));
  // the cornice where the dome springs: a moulded ledge, frost along it, icicles off it
  const cor = []; for (let k = 0; k <= 36; k++) cor.push(P(...drum((k - 18) / RC * 0.98, YS)));
  raw(line(cor, Math.max(4, K(15) * 0.25), INK) + line(cor, Math.max(3, K(15) * 0.18), fog('#808a96', 15, 0.4)) + rime(cor.map(([x, y]) => [x, y - 2]), 15, { th: 3, col: FROST }) + icicles(cor.map(([x, y]) => [x, y + 3]), 15, { len: 22, dens: 0.8, col: FROST }));
}
// ---- the lightning conductor: a copper strap down the wall from the dome, its clamps fused, burns branching out from it
{
  const a = -0.52, pts = []; for (let k = 0; k <= 12; k++) pts.push(P(...drum(a, YS - k * YS / 12)));
  raw(line(pts, 4.2, INK) + line(pts, 2.6, '#7a5a30') + line(pts.map(([x, y]) => [x - 0.8, y]), 0.8, '#c89a60', 0.6));
  for (let k = 1; k < 7; k++) raw(fused(pts[k][0], pts[k][1], 3.4, '#6a5a3a', 15));
  const cb = S.id('cb'); raw(`<clipPath id="${cb}"><path d="${pp([drum(-1.4, 2.6), drum(0.2, 2.6), drum(0.2, YS), drum(-1.4, YS)])}"/></clipPath><g clip-path="url(#${cb})">`);
  for (let k = 1; k < 6; k++) raw(B.char(pts[k][0], pts[k][1], 16, 10, { Z: 15, op: 0.4 }) + burnA(pts[k][0], pts[k][1], (k % 2 ? 0.25 : 2.9) + (R() - 0.5) * 0.4, 34 + R() * 30, 2.6, { depth: 3 }));
  raw('</g>');
}
// ---- the lower clock in the drum wall: stone surround, brass dial with hour, zodiac and star rings; the hands at one
// minute to twelve; frosted; the pivot fused. Above it the jack's niche, empty, and the jack's bell.
{
  const c = P(...drum(0, 3.55)), r = K(ZC + RC) * 1.45;
  raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 1.14)}" fill="${fog('#5a6270', 15, 0.4)}" stroke="${INK}" stroke-width="2"/>`);
  for (let k = 0; k < 16; k++) { const a0 = k / 16 * Math.PI * 2, a1 = (k + 1) / 16 * Math.PI * 2, q = [[c[0] + Math.cos(a0) * r * 1.0, c[1] + Math.sin(a0) * r], [c[0] + Math.cos(a1) * r, c[1] + Math.sin(a1) * r], [c[0] + Math.cos(a1) * r * 1.14, c[1] + Math.sin(a1) * r * 1.14], [c[0] + Math.cos(a0) * r * 1.14, c[1] + Math.sin(a0) * r * 1.14]]; raw(cel(q, { Z: 15, fill: fog(S.tone('#6a7482', 0.15), 15, 0.4), band: 1.5 })); }
  raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${fog(BRASSD, 15, 0.3)}" stroke="${INK}" stroke-width="1.6"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.97)}" fill="url(#mottle)" opacity="0.5"/>`);
  // rings: the hour ring (twenty-four hours, roman marks), the zodiac ring (twelve signs as small glyph marks), the star ring
  let rings = ''; for (const k of [0.95, 0.78, 0.6, 0.42]) rings += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * k)}" fill="none" stroke="${INK}" stroke-width="1"/>`;
  raw(`<path d="M${f1(c[0] - r * 0.95)} ${f1(c[1])} A${f1(r * 0.95)} ${f1(r * 0.95)} 0 0 1 ${f1(c[0] + r * 0.95)} ${f1(c[1])} A${f1(r * 0.95)} ${f1(r * 0.95)} 0 0 1 ${f1(c[0] - r * 0.95)} ${f1(c[1])} M${f1(c[0] - r * 0.78)} ${f1(c[1])} A${f1(r * 0.78)} ${f1(r * 0.78)} 0 0 0 ${f1(c[0] + r * 0.78)} ${f1(c[1])} A${f1(r * 0.78)} ${f1(r * 0.78)} 0 0 0 ${f1(c[0] - r * 0.78)} ${f1(c[1])}" fill="${fog(BRASS, 15, 0.3)}" fill-rule="evenodd" opacity="0.9"/>` + rings);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2 - Math.PI / 2, x0 = c[0] + Math.cos(a) * r * 0.8, y0 = c[1] + Math.sin(a) * r * 0.8, x1 = c[0] + Math.cos(a) * r * 0.93, y1 = c[1] + Math.sin(a) * r * 0.93; raw(pline([[x0, y0], [x1, y1]], k % 2 ? 0.8 : 1.6, INK)); }
  for (let k = 0; k < 12; k++) { const a = (k + 0.5) / 12 * Math.PI * 2 - Math.PI / 2, x = c[0] + Math.cos(a) * r * 0.69, y = c[1] + Math.sin(a) * r * 0.69, g = r * 0.05; raw(`<path d="M${f1(x - g)} ${f1(y - g)} q${f1(g)} ${f1(g * 1.6)} ${f1(g * 2)} 0 M${f1(x)} ${f1(y - g * 0.4)} l0 ${f1(g * 1.4)}" stroke="${INK}" stroke-width="0.8" fill="none"/>`); }
  for (let k = 0; k < 18; k++) { const a = R() * 6.28, d = r * (0.1 + R() * 0.3); raw(`<circle cx="${f1(c[0] + Math.cos(a) * d)}" cy="${f1(c[1] + Math.sin(a) * d)}" r="0.9" fill="#e8e0c0" opacity="0.7"/>`); }
  // the hands: hour hand at twelve less a hair, minute hand one minute before twelve (6 degrees short)
  const hand = (ang, len, w, col) => { const a = ang - Math.PI / 2, tx = c[0] + Math.cos(a) * len, ty = c[1] + Math.sin(a) * len, nx = -Math.sin(a) * w, ny = Math.cos(a) * w; return fillP([[c[0] - nx - Math.cos(a) * len * 0.15, c[1] - ny - Math.sin(a) * len * 0.15], [c[0] + nx * 0.6 + Math.cos(a) * len * 0.75, c[1] + ny * 0.6 + Math.sin(a) * len * 0.75], [tx, ty], [c[0] - nx * 0.6 + Math.cos(a) * len * 0.75, c[1] - ny * 0.6 + Math.sin(a) * len * 0.75], [c[0] + nx - Math.cos(a) * len * 0.15, c[1] + ny - Math.sin(a) * len * 0.15]], col) + inkP([[c[0] - nx - Math.cos(a) * len * 0.15, c[1] - ny - Math.sin(a) * len * 0.15], [c[0] + nx * 0.6 + Math.cos(a) * len * 0.75, c[1] + ny * 0.6 + Math.sin(a) * len * 0.75], [tx, ty], [c[0] - nx * 0.6 + Math.cos(a) * len * 0.75, c[1] - ny * 0.6 + Math.sin(a) * len * 0.75], [c[0] + nx - Math.cos(a) * len * 0.15, c[1] + ny - Math.sin(a) * len * 0.15]], 1); };
  raw(hand(-0.5 / 12 * Math.PI * 2 * 0.0833, r * 0.55, r * 0.06, '#2a2418') + hand(-Math.PI * 2 / 60, r * 0.88, r * 0.04, '#2a2418'));
  raw(fused(c[0], c[1], r * 0.09, '#6a5a3a', 15));
  // frost over the dial: feathered rime from the lower left, a crust on the rim's upper side, icicles from its lower edge
  let fr = ''; for (let k = 0; k < 70; k++) { const a = Math.PI * (0.4 + R() * 0.9), d = r * (0.5 + R() * 0.5), x = c[0] + Math.cos(a) * d, y = c[1] + Math.sin(a) * d, l = 3 + R() * 7, b = R() * 6.28; fr += `M${f1(x)} ${f1(y)} l${f1(Math.cos(b) * l)} ${f1(Math.sin(b) * l)} `; }
  raw(`<path d="${fr}" stroke="${FROST}" stroke-width="0.9" opacity="0.55"/>` + rime(Array.from({ length: 13 }, (_, k) => { const a = Math.PI + k / 12 * Math.PI; return [c[0] + Math.cos(a) * r * 1.15, c[1] + Math.sin(a) * r * 1.15]; }), 15, { th: 3.5, col: FROST }) + icicles(Array.from({ length: 9 }, (_, k) => { const a = Math.PI * 0.15 + k / 8 * Math.PI * 0.7; return [c[0] + Math.cos(a) * r * 1.12, c[1] + Math.sin(a) * r * 1.12]; }), 15, { len: 20, dens: 1.4, col: FROST }));
  // a burn branching over the dial's brass from the conductor's side
  { const cl = S.id('dl'); raw(`<clipPath id="${cl}"><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 1.14)}"/></clipPath><g clip-path="url(#${cl})">${burnA(c[0] - r * 1.1, c[1] - r * 0.3, 0.2, r * 0.9, 1.8, { depth: 3 })}</g>`); }
  // the jack's bell on an iron bracket beside the dial (the jack itself has walked off its post)
  { const bb = [c[0] + r * 1.3, c[1] - r * 0.9], bw = r * 0.16; raw(pline([[c[0] + r * 1.1, bb[1] - 6], [bb[0] + 4, bb[1] - 6], [bb[0] + 4, bb[1]]], 2.4, INK) + cel([[bb[0] + 4 - bw * 0.5, bb[1]], [bb[0] + 4 + bw * 0.5, bb[1]], [bb[0] + 4 + bw, bb[1] + bw * 1.3], [bb[0] + 4 - bw, bb[1] + bw * 1.3]], { Z: 15, fill: fog(BRASSD, 15, 0.3), band: 2 }) + icicles([[bb[0] + 4 - bw, bb[1] + bw * 1.3], [bb[0] + 4 + bw, bb[1] + bw * 1.3]], 15, { len: 8, dens: 3, col: FROST })); }
}
// ---- the floor: blue-grey flags, frost in the joints, and the meridian line let into it from the wall to the front
{
  raw(`<path d="${pp([[-40, 0, 3.8], [40, 0, 3.8], [40, 0, 16.3], [-40, 0, 16.3]])}" fill="${MURK}"/>`);
  raw(B.flags(-30, 30, 3.8, 16.3, mix(STONE, MURK, 0.35), { depth: 1.0, width: 1.2, vary: 0.14, cracks: 0.15, fogK: 0.6, joint: 0.5, skip: (x, z) => Math.abs(x) < 0.35 || Math.hypot(x, z - ZC) > RC + 0.2 }));
  // frost lying in the joints and drifted against the drum
  for (let k = 0; k < 40; k++) { const X = -12 + R() * 24, Z = 5 + R() * 10, A = P(X, 0.01, Z), Bq = P(X + 0.5 + R() * 0.8, 0.01, Z); raw(pline([A, Bq], 1, FROST, 0.3)); }
  // the meridian line: a brass strip on a stone bed, degree ticks, the signs in roundels; verdigris in its seams
  const ml = (Z, dx) => P(dx, 0.01, Z);
  raw(fillP([ml(3.8, -0.3), ml(3.8, 0.3), ml(16.2, 0.3), ml(16.2, -0.3)], mix('#7e8894', MURK, 0.35)) + fillP([ml(3.8, -0.09), ml(3.8, 0.09), ml(16.2, 0.09), ml(16.2, -0.09)], mix(BRASS, MURK, 0.2)) + line([ml(3.8, -0.06), ml(16.2, -0.06)], 0.8, '#e0cc90', 0.6) + line([ml(3.8, 0.09), ml(16.2, 0.09)], 1, INK));
  for (let Z = 4.0; Z < 16; Z += 0.25) { const A = ml(Z, -0.25), Bq = ml(Z, Math.round(Z * 4) % 4 === 0 ? -0.12 : -0.18); raw(pline([A, Bq], 0.7, INK, 0.8)); }
  for (let k = 0; k < 7; k++) { const Z = 5 + k * 1.6, c = ml(Z, 0.2 + 0.0), rx = K(Z) * 0.16, ry = rx * (1.2 / Z) * 2; raw(`<ellipse cx="${f1(c[0] + rx * 0.9)}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(Math.max(1, ry))}" fill="${mix(BRASS, MURK, 0.3)}" stroke="${INK}" stroke-width="0.8"/><path d="M${f1(c[0] + rx * 0.5)} ${f1(c[1])} q${f1(rx * 0.4)} ${f1(-ry)} ${f1(rx * 0.8)} 0" stroke="${INK}" stroke-width="0.7" fill="none"/>`); }
  raw(S.occBand((s, t) => [-40 + s, 0, 16.3 - t], 80, 1.2, { op: 0.4, cross: true }) + hatch3((s, t) => [-40 + s, 0, 3.8 + t], 0, 80, 0, 1.4, 0.25, { op: 0.35, ragged: 0.3 }));
}
// ---- the armillary sphere on its pedestal (right): rings fused at their crossings, frozen in a turn, icicles off them
{
  const X = 5.6, Z = 13.0, base = P(X, 0, Z), k = K(Z);
  raw(box(X - 0.45, X + 0.45, 0, 1.3, Z - 0.45, Z + 0.45, { col: mix(fog(STONE, Z, 0.5), MURK, 0.3) }));
  const c = P(X, 2.7, Z), r = k * 1.15;
  raw(line([P(X, 1.3, Z), P(X, 1.6, Z)], 6, INK) + line([P(X, 1.3, Z), P(X, 1.6, Z)], 4, fog(BRASSD, Z, 0.3)));
  const ring = (rx, ry, rot, w) => `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${f1(rot)} ${f1(c[0])} ${f1(c[1])})" fill="none" stroke="${INK}" stroke-width="${f1(w + 2)}"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${f1(rot)} ${f1(c[0])} ${f1(c[1])})" fill="none" stroke="${fog(BRASS, Z, 0.3)}" stroke-width="${f1(w)}"/>`;
  raw(ring(r, r, 0, 3.4) + ring(r, r * 0.3, -23, 2.6) + ring(r * 0.3, r, -23, 2.6) + ring(r * 0.95, r * 0.55, 40, 2.2) + ring(r * 0.75, r * 0.75, 0, 1.6));
  raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 0.14)}" fill="${fog(BRASSD, Z, 0.3)}" stroke="${INK}" stroke-width="1"/>` + pline([[c[0] - r * 1.15 * Math.cos(1.17), c[1] + r * 1.15 * Math.sin(1.17)], [c[0] + r * 1.15 * Math.cos(1.17), c[1] - r * 1.15 * Math.sin(1.17)]], 1.6, INK));
  for (const a of [0.4, 2.2, 3.9, 5.3]) raw(fused(c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, 3.2, '#6a5a3a', Z));
  raw(rime(Array.from({ length: 9 }, (_, j) => { const a = Math.PI * 1.05 + j / 8 * Math.PI * 0.7; return [c[0] + Math.cos(a) * r * 1.04, c[1] + Math.sin(a) * r * 1.04]; }), Z, { th: 2.4, col: FROST }) + icicles(Array.from({ length: 7 }, (_, j) => { const a = Math.PI * 0.2 + j / 6 * Math.PI * 0.6; return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]; }), Z, { len: 14, dens: 1.6, col: FROST }));
  { const cl = S.id('ar'); raw(`<clipPath id="${cl}"><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 1.1)}"/></clipPath><g clip-path="url(#${cl})"></g>`); raw(burnA(c[0] - r * 0.7, c[1] - r * 0.7, 0.8, r * 0.6, 1.2, { depth: 2, haloOp: 0.1 })); }
}
raw(quiet([[236, 0.14], [268, 0.14], [302, 0.12], [345, 0.12]], { hop: 0.17 }));
// fine frost motes hanging still in the air
{ let m = ''; for (let k = 0; k < 120; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 330)}" r="${f1(0.4 + R() * 0.8)}" fill="${FROST}" opacity="${f1(0.15 + R() * 0.35)}"/>`; raw(m); }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// an overturned scholar's stool and a frozen star chart, a quadrant dropped and frozen to the floor (left, low and dark)
{ const Z = 10.4, c = P(-6.6, 0.0, Z), k = K(Z); raw(fillP([P(-7.6, 0.01, Z - 0.4), P(-6.3, 0.01, Z - 0.5), P(-6.0, 0.01, Z + 0.3), P(-7.4, 0.01, Z + 0.4)], mix('#a8a490', MURK, 0.5)) + pline([P(-7.3, 0.01, Z - 0.1), P(-6.4, 0.01, Z - 0.15)], 0.6, INK, 0.5) + pline([P(-7.1, 0.01, Z + 0.1), P(-6.3, 0.01, Z)], 0.6, INK, 0.5));
  raw(box(-5.6, -5.1, 0.0, 0.08, Z - 0.6, Z - 0.1, { col: mix('#4a3e2e', MURK, 0.45) }) + line([P(-5.5, 0.08, Z - 0.5), P(-5.2, 0.55, Z - 0.7)], 2, INK) + line([P(-5.2, 0.08, Z - 0.2), P(-4.9, 0.5, Z - 0.3)], 2, INK));
  const q = P(-4.1, 0.02, Z - 1.2), r = K(Z - 1.2) * 0.4; raw(`<path d="M${f1(q[0])} ${f1(q[1])} L${f1(q[0] + r)} ${f1(q[1])} A${f1(r)} ${f1(r * 0.25)} 0 0 0 ${f1(q[0])} ${f1(q[1] - r * 0.25)} Z" fill="${mix(BRASS, MURK, 0.5)}" stroke="${INK}" stroke-width="1"/>`); }
// a fallen chained book, frozen open (right, low)
{ const Z = 9.4, c = P(2.6, 0.06, Z), k = K(Z); raw(cel([[c[0] - k * 0.25, c[1]], [c[0], c[1] + k * 0.03], [c[0] + k * 0.25, c[1]], [c[0] + k * 0.22, c[1] - k * 0.05], [c[0], c[1] - k * 0.03], [c[0] - k * 0.22, c[1] - k * 0.05]], { Z, fill: mix('#c8c0a8', MURK, 0.5), band: 1 }) + chain([[c[0] + k * 0.25, c[1] - 1], [c[0] + k * 0.6, c[1] + 2], [c[0] + k * 1.0, c[1]]], 1.6, mix('#4a4a48', MURK, 0.3))); }

// ======================================================================== FORE: framing at the edges
layer('fore');
{
  // left: an iron telescope pier with its brass setting circle, rimed on the windward side
  const Z = 4.3, X = -5.05;
  raw(post(X, Z, 0.32, -1, 6, '#1e2228', { shadeOp: 0.55, grain: false }));
  for (let k = 0; k < 18; k++) { const a = P(X - 0.3 + (k % 3) * 0.3, 0.3 + Math.floor(k / 3) * 0.7, Z - 0.33); raw(`<circle cx="${f1(a[0])}" cy="${f1(a[1])}" r="2.4" fill="#2e3238" stroke="${INK}" stroke-width="0.8"/><circle cx="${f1(a[0] - 0.7)}" cy="${f1(a[1] - 0.7)}" r="0.8" fill="#8a8e96"/>`); }
  const c = P(X + 0.35, 3.6, Z - 0.4), r = K(Z) * 0.55;
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.3)}" ry="${f1(r)}" fill="#3a3018" stroke="${INK}" stroke-width="2.4"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.24)}" ry="${f1(r * 0.92)}" fill="none" stroke="${BRASS}" stroke-width="3" opacity="0.8"/>`);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, y = c[1] + Math.sin(a) * r * 0.9; if (Math.cos(a) < 0) continue; raw(pline([[c[0] + Math.cos(a) * r * 0.24, y], [c[0] + Math.cos(a) * r * 0.3, y]], 0.8, INK)); }
  raw(rime(Array.from({ length: 14 }, (_, k) => P(X - 0.32, 5.8 - k * 0.42, Z - 0.33)), Z, { th: 5, col: FROST }) + icicles([P(X - 0.3, 2.0, Z - 0.34), P(X + 0.3, 2.0, Z - 0.34)], Z, { len: 30, dens: 1.2, col: FROST }));
}
{
  // right: the dome's shutter chains hanging slack down the frame edge, rimed, icicles on them
  for (const [x0, x1, sag] of [[W - 70, W - 20, 0], [W - 40, W + 10, 1]]) { const pts = [[x0, -5], [x0 + 8 + sag * 4, 160], [x1 - 6, 330], [x1, H + 5]]; raw(chain(pts, 5, '#3a3e44')); for (let k = 0; k < 4; k++) { const p = pts[1 + Math.floor(R() * 2)]; raw(icicles([[p[0] - 6, p[1] + k * 20], [p[0] + 6, p[1] + k * 20]], 4, { len: 16, dens: 2, col: FROST })); } }
  // a dropped pair of dividers on the front floor, frozen in
  raw(line([[W - 220, H - 22], [W - 170, H - 46]], 3, INK) + line([[W - 220, H - 22], [W - 170, H - 46]], 1.6, BRASS) + line([[W - 170, H - 46], [W - 130, H - 16]], 3, INK) + line([[W - 170, H - 46], [W - 130, H - 16]], 1.6, BRASS) + `<circle cx="${W - 170}" cy="${H - 46}" r="3" fill="${BRASSD}" stroke="${INK}" stroke-width="1"/>`);
}
// the near rim of the dome overhead, dark across the top of the frame, hung with icicles
{ const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 10 + Math.sin(k * 0.7) * 4 + R() * 3]); raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3.5, fill: '#1a2028', band: 4 }) + `<path d="${p2([[-5, -5], [W + 5, -5], ...e.slice().reverse()])}" fill="${S.hatchA(4)}" opacity="0.5"/>` + icicles(e, 3.5, { len: 46, dens: 0.5, col: FROST })); }

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `spire_dome_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, 'spire_dome.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log('spire_dome layers written');
