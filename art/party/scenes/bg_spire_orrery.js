// World XI, the Stilled Spire: THE ORRERY DOME (`spire_orrery`, round 2; was `spire_dome`). Battle room, Living Ink.
// Place: the observatory's dome hall, where the great orrery stands (bible XI: an observatory whose astronomers tried to
// stop time; pilgrims crossed the hive plain to watch the stars stop; gear spiders repair the orrery and consider you a
// fault). Encounters: the Observatory Floor (pilgrims frozen before the orrery), the Gear Loft (spiders mending the works).
// Kind of space: a vast round interior under a dome: the dome is seen from inside, its courses and brass ribs curving up
// and converging on the crown, the observing slit open down its middle.
// Light: cold night light. The slit is open on a stopped sky; a pale blue shaft falls through it onto the orrery's brass
// sun, the brightest point in the room; the dome round it sinks into blue dark.
// Shapes: curves and circles: the dome's converging ribs, the orrery's orbit rings as ellipses in depth, planets.
// Palette key: dark and cold (night blue, blue-grey stone), brass catching the shaft, a little aurora green in the burns.
// Depth planes (far): the orrery (12-16 m) with its rings; the drum's gear loft and its great wheels (22-24 m); the dome
// (16-24 m, rising out of frame) and the sky through the slit (far).
// Lore placed: the orrery frozen mid-turn (the planets on their arms, Saturn's ring, the moon on the earth's arm), its
// drive gears fused at the hub, aurora-green burns down the column from the slit; the gear loft round the drum with the
// works that drove the dome and the orrery, wheels stopped, a spider's repair (a new brass tooth) in one; the lightning
// conductor down the dome; the zodiac ring let into the floor round the orrery; frost on everything.
// Mid: a fallen planet (a cracked brass globe), a pilgrim's staff and badge, an oil can of the gear spiders.
// Fore: left the iron telescope pier with its setting circle, rimed; right the dome's shutter chains; top the near rim of
// the dome hung with icicles. No eyes. No red. Brass is olive-brown, never gold.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XI');
const ROOM = 'spire_orrery', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 11201, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1c2634' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#0b1018' });
const { fog, line, pline, fillP, fillS, inkP, inkS, blob, box, post, icicles, rime, burn, fused, chain, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#0b1018' });
const MV = require('./materials_v2')(S);
const { pool, shaft, frame, stars, gear, joints } = G;

const BRASS = '#8c7c4c', BRASSD = '#54482a', BRASSL = '#c8b47a', FROST = '#d4e4ee', BLUE = '#9fb8cc', STONE = '#5c6674', STONED = '#323a46', AUR = '#86e8b8', SKY = '#0e1626', MURK = B.MURK, MOON = '#c8dcec';
const RD = 12.5, ZC = 13.5, YS = 5.5;                       // the dome: radius, centre depth, springing height (drum below)
const DH = 4.6;                                        // a saucer dome: low, so its ribs curve over inside the frame
const dome = (a, Y) => { const r = RD * Math.sqrt(Math.max(0, 1 - Math.pow((Y - YS) / DH, 2))); return [r * Math.sin(a), Y, ZC + r * Math.cos(a)]; };
const drum = (a, Y) => [RD * Math.sin(a), Y, ZC + RD * Math.cos(a)];
const atD = (s, t) => drum(s / RD, t);
const burnA = (x, y, ang, len, w, o = {}) => burn(x, y, ang, len, w, Object.assign({ core: AUR, scorch: '#0c100e', coreOp: 0.55, haloOp: 0.3, branchP: 0.45, spread: 0.75 }, o));
const SLIT = 0.075;
// how much of the slit's shaft falls on a screen point (a band from the slit down onto the orrery)
const SH = [[700, -10], [790, -10], [640, 260], [880, 260]];
const inShaft = (x, y) => { const t = Math.max(0, Math.min(1, (y + 10) / 270)), xa = SH[0][0] + (SH[2][0] - SH[0][0]) * t, xb = SH[1][0] + (SH[3][0] - SH[1][0]) * t; return Math.max(0, 1 - Math.abs(x - (xa + xb) / 2) / ((xb - xa) / 2 + 30)); };

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the dome seen from inside: each course a ring of stones on the sphere, the courses narrowing toward the crown;
// every stone its own cel, shaded (they face down), darker away from the slit; frost on the beds
{
  const WXD = MV.begin((u, v) => dome(-2.25 + u / RD, YS + v), 4.5 * RD, DH);
  const YL = []; for (let f = 0; f < 1.52; f += 0.1 + (f > 1.1 ? 0.04 : 0)) YL.push(YS + DH * Math.sin(f)); YL.push(YS + DH * 0.999);
  for (let j = 0; j < YL.length - 1; j++) { const y0 = YL[j], y1 = YL[j + 1], n = Math.max(12, Math.round(64 * Math.sqrt(Math.max(0.05, RD * RD - (y0 - YS) * (y0 - YS))) / RD)), off = R() * 0.5;
    for (let i = 0; i < n; i++) { const a0 = -2.25 + 4.5 * (i + off) / n, a1 = a0 + 4.5 / n; if (Math.abs((a0 + a1) / 2) < SLIT + 0.04 && y0 >= YS + DH * 0.3) continue;
      const q3 = [dome(a0, y0), dome(a1, y0), dome(a1, y1), dome(a0, y1)], q = q3.map(p => P(...p)); if (Math.max(...q.map(p => p[1])) < -30 || Math.min(...q.map(p => p[0])) > W + 40 || Math.max(...q.map(p => p[0])) < -40) continue;
      const c = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2], sh = inShaft(c[0], c[1]), d = Math.min(1, Math.abs((a0 + a1) / 2) / 1.6);
      const col = mix(mix(S.tone(mix(STONE, STONED, 0.3 + j * 0.04), 0.14), MURK, 0.35 + d * 0.45), MOON, sh * 0.22);
      { const qc = chip(q, 0.25); raw(cel(qc, { Z: 18, fill: col, band: 1.4, tex: 'url(#mottle)', texOp: 0.35, inkW: 0.55, hi: false })); WXD.stone(qc, 18, col, q3); }
      if (sh < 0.3) raw(`<path d="${p2(q)}" fill="${S.hatchA(18)}" opacity="${f1(0.22 + d * 0.25)}"/>`);
      if (d > 0.45 && R() < 0.6) raw(`<path d="${p2(q)}" fill="${S.hatchB(18)}" opacity="0.28"/>`);
      if (R() < 0.35) raw(line([q[0], q[1]].map(([x, y]) => [x, y + 0.8]), 0.8, FROST, 0.35)); }
  }
  raw(WXD.end({ plane: false }));
  // the slit: open on a stopped night; stars that do not wheel; the shutter's iron edges
  const L = [], Rr = []; for (let f = 0.3; f <= 1.54; f += 0.04) { const Y = YS + DH * Math.sin(f), sw = SLIT / Math.max(0.12, Math.cos(f)) * 0.9; L.push(P(...dome(-Math.min(0.6, sw), Y))); Rr.push(P(...dome(Math.min(0.6, sw), Y))); }
  const sl = [...L, ...Rr.slice().reverse()], ck = S.id('sl');
  raw(fillP(sl, SKY) + `<clipPath id="${ck}"><path d="${p2(sl)}"/></clipPath><g clip-path="url(#${ck})">` + stars(L[L.length - 1][0] - 30, -20, Rr[Rr.length - 1][0] + 30, L[0][1], 60, { col: '#e8eef8' }) + pool((L[0][0] + Rr[0][0]) / 2, 40, 40, 140, MOON, { n: 3, op: 0.1 }) + '</g>');
  for (const side of [L, Rr]) raw(line(side, 4.2, INK) + line(side, 2.2, '#3a4048') + line(side.map(([x, y]) => [x - 1, y]), 0.8, FROST, 0.5));
  raw(icicles([L[0], Rr[0]], 18, { len: 16, dens: 2, col: FROST }));
  // the ribs: brass-shod, curving up the sphere and converging on the crown; icicles on their lower runs
  for (const a of [-2.1, -1.66, -1.24, -0.86, -0.5, -0.2, 0.2, 0.5, 0.86, 1.24, 1.66, 2.1]) {
    const pts = []; for (let f = 0; f <= 1.53; f += 0.03) pts.push(P(...dome(a, YS + DH * Math.sin(f))));
    const d = Math.min(1, Math.abs(a) / 2), col = mix(BRASSD, MURK, 0.2 + d * 0.35);
    raw(line(pts, Math.max(3.4, K(18) * 0.24), INK) + line(pts, Math.max(2.2, K(18) * 0.15), col) + line(pts.map(([x, y]) => [x - 1, y]), 0.9, mix(BRASS, '#f4ecd0', 0.3), 0.55 - d * 0.3));
    raw(icicles(pts.slice(0, 9).map(([x, y]) => [x + 2, y + 2]), 18, { len: 14, dens: 1, col: FROST }));
    if (a === -0.5) for (let k = 3; k < 18; k += 4) raw(burnA(pts[k][0], pts[k][1], R() < 0.5 ? 0.3 : 2.8, 30 + R() * 30, 1.8, { depth: 3 }));
  }
}
// ---- the drum and its gear loft: the works that turned the dome and drove the orrery, great wheels on the wall over a
// timber gallery; stopped, rimed; one wheel with a new brass tooth (the gear spiders' repair)
{
  { const cl = []; for (let k = 0; k <= 40; k++) cl.push(P(...drum(-2.25 + 4.5 * k / 40, 0))); for (let k = 40; k >= 0; k--) cl.push(P(...drum(-2.25 + 4.5 * k / 40, YS))); const cd = S.id('dr'); raw(`<clipPath id="${cd}"><path d="${p2(cl)}"/></clipPath><g clip-path="url(#${cd})">`); }
  raw(S.ashlar((s, t) => atD(s - 28.2, t), 56.4, YS, mix(STONE, MURK, 0.48), { vary: 0.22, chip: 0.45, mortar: 0.6, lost: 0.12, spall: 0.2, rough: true, roughP: 0.4, scale: 0.9 }));
  // the wheels: overlapping trains at the loft's height, each its own size; a lantern pinion between two
  for (const [s, t, r, sp] of [[-19, 4.4, 1.0, 6], [-16.9, 3.95, 0.55, 5], [-11.5, 4.5, 0.85, 5], [-4.6, 4.45, 1.05, 6], [-2.8, 4.0, 0.42, 4], [3.8, 4.4, 0.95, 6], [5.6, 4.05, 0.5, 5], [12.6, 4.5, 1.1, 6], [14.7, 4.0, 0.6, 5], [20, 4.4, 0.9, 6]]) {
    const at = (u, v) => { const p = atD(u, v); return [p[0] * 0.995, p[1], p[2] - 0.15]; }, Z = atD(s, t)[2];
    raw(gear(at, s, t, r, Z, { col: mix(BRASSD, MURK, 0.35), spokes: sp, rot: R() * 6, behind: mix(STONE, MURK, 0.45), behindOp: 0.85 }));
    raw(rime(Array.from({ length: 7 }, (_, k) => P(...at(s + Math.cos(Math.PI * (1.1 + k * 0.12)) * r, t + Math.sin(Math.PI * (1.1 + k * 0.12)) * -r))), Z, { th: 2, col: FROST }));
  }
  { const c = P(...atD(3.8, 4.4)), r = K(26) * 0.95; raw(fillP([[c[0] - 3, c[1] - r - 2], [c[0] + 3, c[1] - r - 2], [c[0] + 2, c[1] - r * 0.86], [c[0] - 2, c[1] - r * 0.86]], BRASSL)); }
  // the gallery: a timber walk round the drum at 3.3 m on brackets, its balustrade; frost on the rail
  const rail = [], deck = []; for (let k = 0; k <= 40; k++) { const a = -2.25 + 4.5 * k / 40; deck.push(P(...drum(a * 0.985, 3.3).map((v, i) => i === 2 ? v - 0.2 : v))); rail.push(P(...drum(a * 0.97, 4.2).map((v, i) => i === 2 ? v - 0.6 : v))); }
  raw(line(deck, 5, INK) + line(deck, 3, mix('#4a3e2e', MURK, 0.4)) + line(rail, 2.6, INK) + line(rail, 1.4, mix('#5a4a36', MURK, 0.3)) + rime(rail.map(([x, y]) => [x, y - 1]), 22, { th: 2, col: FROST }));
  for (let k = 0; k <= 40; k += 2) raw(pline([deck[k], rail[k]], 1.2, INK, 0.8));
  raw('</g>');
  // the cornice where the dome springs: a moulded ledge, frost along it, icicles off it
  const cor = []; for (let k = 0; k <= 40; k++) cor.push(P(...drum(-2.25 + 4.5 * k / 40, YS)));
  raw(line(cor, Math.max(4, K(18) * 0.25), INK) + line(cor, Math.max(3, K(18) * 0.18), mix('#808a96', MURK, 0.35)) + rime(cor.map(([x, y]) => [x, y - 2]), 18, { th: 3, col: FROST }) + icicles(cor.map(([x, y]) => [x, y + 3]), 18, { len: 18, dens: 0.8, col: FROST }));
  // the drum sinks into the dark below the loft (the fighters' band)
  for (const [yt, op] of [[3.1, 0.2], [2.2, 0.2], [1.2, 0.22]]) { const pts = []; for (let k = 0; k <= 40; k++) pts.push(drum(-2.25 + 4.5 * k / 40, yt + Math.sin(k * 1.3) * 0.08)); raw(`<path d="${pp([drum(-2.25, 0), drum(2.25, 0), ...pts.reverse()])}" fill="${MURK}" opacity="${op}"/>`); }
}
// ---- the conductor: a copper strap down the dome from the slit's edge, its clamps fused, burns out over the stones
{ const pts = []; for (let Y = YS + DH * 0.95; Y >= 0.3; Y -= 0.3) pts.push(P(...(Y > YS ? dome(-0.34, Y) : drum(-0.34, Y))));
  raw(line(pts, 4, INK) + line(pts, 2.4, '#6a4e2a') + line(pts.map(([x, y]) => [x - 0.8, y]), 0.8, '#b8905a', 0.5));
  for (let k = 3; k < pts.length - 6; k += 3) raw(fused(pts[k][0], pts[k][1], 3, '#5a4a30', 20) + burnA(pts[k][0], pts[k][1], (k % 2 ? 0.3 : 2.85) + (R() - 0.5) * 0.4, 22 + R() * 24, 1.6, { depth: 2 })); }
// ---- the shaft: the slit's cold light down onto the orrery
raw(shaft(SH[0], SH[1], SH[2], SH[3], MOON, { n: 4, op: 0.06, narrow: 0.6, motes: 80, mote: '#e8f0f8', moteOp: 0.6 }));
// ---- the floor: blue-grey flags, frost in the joints, the zodiac ring let in round the orrery's base
{
  raw(`<path d="${pp([[-40, 0, 3.8], [40, 0, 3.8], [40, 0, 24], [-40, 0, 24]])}" fill="${MURK}"/>`);
  raw(B.flags(-30, 30, 3.8, 24, mix(STONE, MURK, 0.4), { depth: 1.0, width: 1.2, vary: 0.14, cracks: 0.18, fogK: 0.7, joint: 0.5, skip: (x, z) => Math.hypot(x, z - ZC) > RD }));
  raw(joints(-12, 12, 4, 25, { dx: 1.4, dz: 1.3, op: 0.3, cracks: 6, lip: FROST }));
  for (let k = 0; k < 50; k++) { const X = -12 + R() * 24, Z = 5 + R() * 14, A = P(X, 0.01, Z), Bq = P(X + 0.5 + R() * 0.8, 0.01, Z); raw(pline([A, Bq], 1, FROST, 0.28)); }
  const ring = (r, w, col) => { const o = [], i = []; for (let k = 0; k <= 60; k++) { const a = k / 60 * Math.PI * 2; o.push(P(0.4 + Math.cos(a) * (r + w), 0.01, 14 + Math.sin(a) * (r + w))); i.push(P(0.4 + Math.cos(a) * r, 0.01, 14 + Math.sin(a) * r)); } return fillP([...o, ...i.reverse()], col); };
  raw(ring(3.0, 0.5, mix('#6e7884', MURK, 0.35)) + ring(3.15, 0.18, mix(BRASS, MURK, 0.25)));
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, c = P(0.4 + Math.cos(a) * 3.25, 0.01, 14 + Math.sin(a) * 3.25), rx = K(14 + Math.sin(a) * 3.25) * 0.14; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(rx * 0.16)}" fill="${mix(BRASS, MURK, 0.3)}" stroke="${INK}" stroke-width="0.7"/>`); }
  raw(pool(...P(0.4, 0, 14), 170, 22, MOON, { n: 4, op: 0.08 }));
  raw(G.bandFloor(-14, 14, { col: mix(STONE, MURK, 0.4), wear: '#7a8694', debrisCol: '#6a7480', wearOp: 0.28 }));
}
// ---- the orrery: a brass column on a geared drum, the sun at its top, the planets on arms of different lengths and
// heights, each with its orbit ring let into a brass circle round the column; frozen mid-turn, rimed, icicled, burned
{
  const OX = 0.4, OZ = 14, k = K(OZ);
  // the orbit rings: thin brass circles in horizontal planes at the arms' heights (they read as ellipses in depth)
  const orbits = [[3.1, 1.6, 0.9], [3.5, 2.6, 2.3], [3.9, 3.7, 4.1], [3.3, 4.9, 5.6], [4.3, 6.2, 0.4]];
  const ringPts = (Y, r) => { const q = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2; q.push(P(OX + Math.cos(a) * r, Y, OZ + Math.sin(a) * r)); } return q; };
  for (const [Y, r] of orbits) { const q = ringPts(Y, r), back = q.slice(0, 37); raw(line(back, 2.2, INK, 0.8) + line(back, 1, mix(BRASS, MURK, 0.4), 0.9)); }
  // the drive drum and the column
  raw(box(OX - 0.8, OX + 0.8, 0, 0.9, OZ - 0.8, OZ + 0.8, { col: mix(BRASSD, MURK, 0.3), shadeOp: 0.5 }));
  raw(gear((u, v) => [u, 0.9, v], OX, OZ, 0.95, OZ, { col: mix(BRASS, MURK, 0.25), spokes: 6, open: false }));
  const c0 = P(OX, 0.9, OZ), c1 = P(OX, 4.3, OZ); raw(line([c0, c1], k * 0.2, INK) + line([c0, c1], k * 0.15, mix(BRASSD, MURK, 0.1)) + line([[c0[0] - k * 0.04, c0[1]], [c1[0] - k * 0.04, c1[1]]], 1.4, BRASSL, 0.55));
  { const ck = S.id('cb'); raw(`<clipPath id="${ck}"><path d="M${f1(c0[0] - k * 0.1)} ${f1(c0[1])} L${f1(c1[0] - k * 0.1)} ${f1(c1[1])} L${f1(c1[0] + k * 0.1)} ${f1(c1[1])} L${f1(c0[0] + k * 0.1)} ${f1(c0[1])} Z"/></clipPath><g clip-path="url(#${ck})">` + burnA(c1[0], c1[1], Math.PI / 2, c0[1] - c1[1], 1.4, { depth: 3, spread: 0.25 }) + '</g>'); }
  // the arms and planets (back half drawn first by depth)
  const planets = orbits.map(([Y, r, a], i) => ({ Y, r, a, pr: [0.18, 0.26, 0.4, 0.3, 0.14][i], ring: i === 3, moon: i === 2 })).sort((p, q) => Math.sin(q.a) - Math.sin(p.a));
  for (const pl of planets) {
    const end = [OX + Math.cos(pl.a) * pl.r, pl.Y, OZ + Math.sin(pl.a) * pl.r], hub = P(OX, pl.Y, OZ), e = P(...end), Z = end[2];
    raw(line([hub, e], Math.max(2.4, K(Z) * 0.07), INK) + line([hub, e], Math.max(1.2, K(Z) * 0.04), mix(BRASS, MURK, 0.2)));
    raw(icicles([hub, e].map(([x, y]) => [x, y + 2]), Z, { len: 10, dens: 1.2, col: FROST }));
    const pr = K(Z) * pl.pr, sh = inShaft(e[0], e[1]);
    if (pl.ring) raw(`<ellipse cx="${f1(e[0])}" cy="${f1(e[1] + pr * 0.1)}" rx="${f1(pr * 2)}" ry="${f1(pr * 0.45)}" transform="rotate(-12 ${f1(e[0])} ${f1(e[1])})" fill="none" stroke="${INK}" stroke-width="${f1(pr * 0.3)}"/>`);
    const disc = []; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; disc.push([e[0] + Math.cos(a) * pr, e[1] - pr * 0.9 + Math.sin(a) * pr]); }
    raw(cel(disc, { Z, fill: mix(mix(BRASS, '#6a7a84', pl.ring ? 0.1 : 0.3), MOON, sh * 0.25), band: pr * 0.45 }) + line(disc.slice(11, 16), Math.max(0.8, pr * 0.15), '#f4ecd0', 0.5));
    raw(rime(disc.slice(10, 17), Z, { th: Math.max(1.5, pr * 0.18), col: FROST }));
    if (pl.ring) raw(`<path d="M${f1(e[0] - pr * 2)} ${f1(e[1] + pr * 0.05 - pr * 0.9)} A${f1(pr * 2)} ${f1(pr * 0.45)} -12 0 0 ${f1(e[0] + pr * 2)} ${f1(e[1] - pr * 0.95 - pr * 0.4)}" fill="none" stroke="${mix(BRASS, MURK, 0.15)}" stroke-width="${f1(pr * 0.18)}"/>`);
    if (pl.moon) { const m = [e[0] + pr * 1.8, e[1] - pr * 1.6], mr = pr * 0.32; raw(line([[e[0], e[1] - pr * 0.9], m], 1.2, INK) + `<circle cx="${f1(m[0])}" cy="${f1(m[1])}" r="${f1(mr)}" fill="#a8b4bc" stroke="${INK}" stroke-width="1"/>`); }
    raw(fused(hub[0], hub[1], Math.max(2, k * 0.08), '#6a5a3a', OZ));
  }
  // the sun: a brass globe with rays, lit full by the shaft, the brightest thing in the room
  const s = P(OX, 4.75, OZ), sr = k * 0.55, disc = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; disc.push([s[0] + Math.cos(a) * sr, s[1] + Math.sin(a) * sr]); }
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + 0.1; raw(fillP([[s[0] + Math.cos(a - 0.08) * sr, s[1] + Math.sin(a - 0.08) * sr], [s[0] + Math.cos(a) * sr * (i % 2 ? 1.45 : 1.7), s[1] + Math.sin(a) * sr * (i % 2 ? 1.45 : 1.7)], [s[0] + Math.cos(a + 0.08) * sr, s[1] + Math.sin(a + 0.08) * sr]], mix(BRASS, MOON, 0.2)) + inkP([[s[0] + Math.cos(a - 0.08) * sr, s[1] + Math.sin(a - 0.08) * sr], [s[0] + Math.cos(a) * sr * (i % 2 ? 1.45 : 1.7), s[1] + Math.sin(a) * sr * (i % 2 ? 1.45 : 1.7)], [s[0] + Math.cos(a + 0.08) * sr, s[1] + Math.sin(a + 0.08) * sr]], 0.9)); }
  raw(cel(disc, { Z: OZ, fill: mix(BRASSL, MOON, 0.25), band: sr * 0.35 }) + line(disc.slice(13, 19), 2, '#fffaf0', 0.7) + rime(disc.slice(11, 19), OZ, { th: 3, col: FROST }) + icicles(disc.slice(2, 9), OZ, { len: 16, dens: 1.5, col: FROST }));
  { const ck = S.id('sb'); raw(`<clipPath id="${ck}"><path d="${p2(disc)}"/></clipPath><g clip-path="url(#${ck})">` + burnA(s[0] + sr * 0.2, s[1] - sr * 0.3, 1.3, sr * 1.2, 1.4, { depth: 2 }) + '</g>'); }
  // front halves of the orbit rings, over the column
  for (const [Y, r] of orbits) { const q = ringPts(Y, r), front = q.slice(36); raw(line(front, 2.4, INK, 0.85) + line(front, 1.1, mix(BRASS, MURK, 0.15), 0.95) + icicles(front.filter((_, i) => i % 3 === 0), OZ - r, { len: 8, dens: 0.6, col: FROST })); }
}
raw(quiet([[236, 0.14], [268, 0.14], [302, 0.12], [345, 0.12]], { hop: 0.17 }));
raw(frame('#05080e', { sides: [[380, 0.16], [260, 0.18], [150, 0.2], [70, 0.22]], top: [[90, 0.2], [40, 0.2]] }));
{ let m = ''; for (let k = 0; k < 120; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 330)}" r="${f1(0.4 + R() * 0.8)}" fill="${FROST}" opacity="${f1(0.15 + R() * 0.35)}"/>`; raw(m); }

// ======================================================================== MID
layer('mid');
// a fallen planet: a brass globe cracked open on the floor, its arm snapped
{ const Z = 10.5, p = P(-4.6, 0.3, Z), r = K(Z) * 0.3, disc = []; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; disc.push([p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r * 0.95]); }
  raw(cel(disc, { Z, fill: mix(BRASSD, MURK, 0.4), band: r * 0.4 }) + pline([[p[0] - r * 0.2, p[1] - r], [p[0] + r * 0.1, p[1] - r * 0.2], [p[0] - r * 0.1, p[1] + r * 0.5]], 1.4, INK) + line([P(-3.9, 0.12, Z), P(-2.6, 0.12, Z - 0.5)], 3, INK) + line([P(-3.9, 0.12, Z), P(-2.6, 0.12, Z - 0.5)], 1.6, mix(BRASS, MURK, 0.4))); }
// a pilgrims' bench (a scale cue: a plain oak form, seat at 0.45 m), rimed, before the orrery where they stood to watch
{ const Z = 11.8, X0 = 4.2, X1 = 6.6; raw(B.box(X0, X1, 0.4, 0.47, Z - 0.18, Z + 0.18, { col: mix('#5a4a36', MURK, 0.35) })); for (const X of [X0 + 0.15, X1 - 0.15]) raw(B.box(X - 0.05, X + 0.05, 0, 0.4, Z - 0.15, Z + 0.15, { col: mix('#4a3e2e', MURK, 0.45) })); raw(rime([P(X0, 0.47, Z - 0.18), P(X1, 0.47, Z - 0.18)], Z, { th: 2.2, col: FROST })); }
// a pilgrim's staff and a dropped badge, frosted to the floor; an oil can of the gear spiders
{ const Z = 9.2, a = P(2.2, 0.03, Z), b = P(3.6, 0.04, Z - 0.3); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, mix('#6a5638', MURK, 0.5)) + `<circle cx="${f1(b[0] + 8)}" cy="${f1(b[1] - 1)}" r="2" fill="${mix('#7a7a7e', MURK, 0.3)}" stroke="${INK}" stroke-width="0.6"/>`);
  const c = P(6.0, 0.1, 11.5), k = K(11.5); raw(cel([[c[0] - k * 0.08, c[1]], [c[0] + k * 0.08, c[1]], [c[0] + k * 0.06, c[1] - k * 0.16], [c[0] - k * 0.06, c[1] - k * 0.16]], { Z: 11.5, fill: mix(BRASSD, MURK, 0.4), band: 1.5 }) + pline([[c[0], c[1] - k * 0.16], [c[0] + k * 0.12, c[1] - k * 0.3]], 1.2, INK)); }

// ======================================================================== FORE
layer('fore');
{ // left: the iron telescope pier with its brass setting circle, rimed on the windward side
  const Z = 4.3, X = -5.05;
  raw(post(X, Z, 0.32, -1, 6, '#1e2228', { shadeOp: 0.55, grain: false }));
  for (let k = 0; k < 18; k++) { const a = P(X - 0.3 + (k % 3) * 0.3, 0.3 + Math.floor(k / 3) * 0.7, Z - 0.33); raw(`<circle cx="${f1(a[0])}" cy="${f1(a[1])}" r="2.4" fill="#2e3238" stroke="${INK}" stroke-width="0.8"/><circle cx="${f1(a[0] - 0.7)}" cy="${f1(a[1] - 0.7)}" r="0.8" fill="#8a8e96"/>`); }
  const c = P(X + 0.35, 3.6, Z - 0.4), r = K(Z) * 0.55;
  raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.3)}" ry="${f1(r)}" fill="#3a3018" stroke="${INK}" stroke-width="2.4"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.24)}" ry="${f1(r * 0.92)}" fill="none" stroke="${BRASS}" stroke-width="3" opacity="0.8"/>`);
  for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, y = c[1] + Math.sin(a) * r * 0.9; if (Math.cos(a) < 0) continue; raw(pline([[c[0] + Math.cos(a) * r * 0.24, y], [c[0] + Math.cos(a) * r * 0.3, y]], 0.8, INK)); }
  raw(rime(Array.from({ length: 14 }, (_, k) => P(X - 0.32, 5.8 - k * 0.42, Z - 0.33)), Z, { th: 5, col: FROST }) + icicles([P(X - 0.3, 2.0, Z - 0.34), P(X + 0.3, 2.0, Z - 0.34)], Z, { len: 30, dens: 1.2, col: FROST }));
}
{ // right: the dome's shutter chains hanging slack down the frame edge, rimed
  for (const [x0, x1, sag] of [[W - 70, W - 20, 0], [W - 40, W + 10, 1]]) { const pts = [[x0, -5], [x0 + 8 + sag * 4, 160], [x1 - 6, 330], [x1, H + 5]]; raw(chain(pts, 5, '#3a3e44')); for (let k = 0; k < 4; k++) { const p = pts[1 + Math.floor(R() * 2)]; raw(icicles([[p[0] - 6, p[1] + k * 20], [p[0] + 6, p[1] + k * 20]], 4, { len: 22, dens: 1.4, col: FROST })); } }
  raw(line([[W - 220, H - 22], [W - 170, H - 46]], 3, INK) + line([[W - 220, H - 22], [W - 170, H - 46]], 1.6, BRASS) + line([[W - 170, H - 46], [W - 130, H - 16]], 3, INK) + line([[W - 170, H - 46], [W - 130, H - 16]], 1.6, BRASS) + `<circle cx="${W - 170}" cy="${H - 46}" r="3" fill="${BRASSD}" stroke="${INK}" stroke-width="1"/>`);
}
{ // the near rim of the dome overhead, dark across the top of the frame, hung with icicles
  const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 12 + Math.sin(k * 0.7) * 5 + R() * 3 + 10 * Math.pow(Math.abs(k / 15 - 1), 2)]);
  raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3.5, fill: '#1a2028', band: 4 }) + `<path d="${p2([[-5, -5], [W + 5, -5], ...e.slice().reverse()])}" fill="${S.hatchA(4)}" opacity="0.5"/>` + icicles(e, 3.5, { len: 40, dens: 0.6, col: FROST }));
}
raw(fillP([[-5, H + 5], [-5, H - 14], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 12 - Math.sin(k * 1.5) * 5 - R() * 4]), [W + 5, H - 14], [W + 5, H + 5]], '#0a0e14', 0.92));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
