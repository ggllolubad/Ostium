// World X, the Venom Spires: THE HEART OF THE SPIRES (`hive_boss`, round 2, new). Boss room for The Hive Queen.
// Lore (bible X, The Hive Queen): "The heart of the spires. Every sting on the plain is hers." She was the first wasp to
// nest on a lightning-struck tower; she clings head-down to the inside of a spire, the spire's lightning rod running into
// her back. So her room is inside the mother spire, the first one, built round the tower that was struck first: the
// plain's tallest thing, the village church tower. The hive swallowed it; its stones still stand inside the paper.
// Kind of space: the vastest interior of the world: a hollow rising out of sight, the old stone tower on the left going
// up into the dark, galleries of brood comb ringing the hollow tier above tier like a cathedral's triforia.
// Light: the most dramatic in the world. Storm light pours down the hollow from a rent in the crown far above, a hard
// white-violet beam slanting from the upper left onto the queen's stage; everything else chitin-black, the comb's green
// glinting in the dark. No bolt is drawn: the strike is in the burns on the rod and the stones, and the fused iron.
// Composition: the right 45% is the queen's stage: the beam falls there and the hollow behind her is dark, curved and
// uncluttered; the iron rod comes down out of the dark into the place where her back is. Heroes stand left at the band.
// Shapes: the hollow's curves and the tower's hard verticals; the galleries' rhythm of arcs.
// Palette key: the darkest and most contrasted: chitin black, venom green, white-violet.
// Depth planes (far): the tower (12-16 m) and hanging comb near; the galleries on the hollow's wall (24-30 m); the
// hollow's upper dark and the beam's source (far above).
// Lore placed: the tower's rubble stone, its west door blocked with comb, its belfry lancet gutted, the masons' string
// course; burns branching down the stones from the top; the tower's iron cross, dragged down the hollow as the first
// rod, its arms fused; the queen's egg-laying galleries (capped cells, larvae, nectar); drones' dead heaped on the floor;
// travellers' bones and a pilgrim's badge in the litter; the church's floor slabs with incised crosses under the litter.
// Mid: a heap of dead drones and spent comb, a fallen paving slab with an incised cross, a pilgrim's hat.
// Fore: top-left: a hanging comb tier's edge; left: the tower's buttress foot; right: a paper column and the rod's guy.
// No eyes (not a void world). Gold none. Red none.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'X');
const ROOM = 'hive_boss', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 10501, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1a1820' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#08080b' });
const { line, pline, fillP, fillS, inkP, inkS, blob, lump, burn, fused, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#08080b' });
const { pool, shaft, frame, comb } = G;

const PAPER = '#6e6a60', PAPERD = '#34312c', STONE = '#6a6660', VEN = '#93b24c', VEND = '#4e6a2a', VIO = '#d4c8f4', BEAM = '#e4dcf4', CHIT = '#16151c', MURK = B.MURK;
const RW = 18, ZC = 12;
const wallAt = (s, t) => [RW * Math.sin(s / RW), t, ZC + RW * Math.cos(s / RW)];
// the beam's footprint: how lit a screen point is (a band slanting from upper left to the stage on the right)
const BEAMA = [[470, -10], [700, -10]], BEAMB = [[930, 430], [1420, 430]];
const inBeam = (x, y) => { const t = Math.max(0, Math.min(1, (y + 10) / 440)), xa = BEAMA[0][0] + (BEAMB[0][0] - BEAMA[0][0]) * t, xb = BEAMA[1][0] + (BEAMB[1][0] - BEAMA[1][0]) * t, m = (xa + xb) / 2, hw = (xb - xa) / 2; return Math.max(0, 1 - Math.abs(x - m) / hw); };
const tint = (col, x, y, k = 1) => { const b = inBeam(x, y); return mix(mix(col, MURK, 0.62 * (1 - b) * k), BEAM, 0.22 * b * b); };

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the hollow's wall (24-30 m): paper bands, dark; the queen's galleries ringing it tier over tier, each a ledge of
// brood comb under a lip of layered paper, lit only where the beam crosses
{
  const sA = -24, sB = 24;
  for (let t = -0.5; t < 30; t += 0.4 + R() * 0.5) { const lo = [], hi = []; for (let k = 0; k <= 60; k++) { const s = sA + (sB - sA) * k / 60; lo.push(P(...wallAt(s, t - Math.abs(Math.sin(s * 2.2 + t)) * 0.12))); hi.push(P(...wallAt(s, t + 0.9))); }
    const c = lo[30]; raw(fillP([...lo, ...hi.reverse()], mix(tint(S.tone(PAPERD, 0.1), c[0], c[1], 0.9), MURK, 0.1)) + line(lo, 0.7, INK, 0.6)); }
  for (const [t0, h] of [[3.2, 1.6], [7.8, 1.9], [12.8, 2.2], [18.2, 2.6]]) {
    const ck = S.id('ga'), band = []; for (let k = 0; k <= 60; k++) band.push(P(...wallAt(sA + (sB - sA) * k / 60, t0))); for (let k = 60; k >= 0; k--) band.push(P(...wallAt(sA + (sB - sA) * k / 60, t0 + h)));
    raw(fillP(band, '#0a0908') + `<clipPath id="${ck}"><path d="${p2(band)}"/></clipPath><g clip-path="url(#${ck})">`);
    raw(comb(wallAt, sA, sB, t0, t0 + h, 0.34 + t0 * 0.01, { wall: '#2e2b26', capP: 0.45, larvaP: 0.12, nectarP: 0.1, capCol: '#5a564a', grub: '#5a5644', nectar: '#3a4c1c', nectarL: '#7a9640', voidCol: '#060505' }));
    // the beam lights a stretch of each gallery; outside it the cells sink into the dark
    for (let k = 0; k < 24; k++) { const s0 = sA + (sB - sA) * k / 24, s1 = s0 + (sB - sA) / 24, c = P(...wallAt((s0 + s1) / 2, t0 + h / 2)), b = inBeam(c[0], c[1]); const q = [wallAt(s0, t0), wallAt(s1, t0), wallAt(s1, t0 + h), wallAt(s0, t0 + h)].map(p => P(...p));
      raw(fillP(q, b > 0.15 ? BEAM : MURK, b > 0.15 ? 0.12 * b : 0.55)); }
    raw('</g>');
    // the gallery's lip: a scalloped ledge of paper over it, its lower edge catching the beam
    const lip = []; for (let k = 0; k <= 60; k++) { const s = sA + (sB - sA) * k / 60; lip.push(P(...wallAt(s, t0 + h + Math.abs(Math.sin(s * 1.6)) * 0.15))); }
    raw(line(lip, 2.4, INK) + line(lip.map(([x, y]) => [x, y + 1.6]), 1.1, '#8a8478', 0.35));
  }
  raw(hatch3(wallAt, sA, sB, -0.5, 30, 0.7, { op: 0.4, keep: (s, t) => inBeam(...P(...wallAt(s, t))) < 0.35 }) + hatch3(wallAt, sA, sB, -0.5, 30, -0.8, { op: 0.35, keep: (s, t) => inBeam(...P(...wallAt(s, t))) < 0.1 }));
}
// ---- the beam: storm light down the hollow from the rent in the crown (out of frame, upper left), white-violet
raw(shaft(BEAMA[0], BEAMA[1], BEAMB[0], BEAMB[1], BEAM, { n: 5, op: 0.05, narrow: 0.7, motes: 140, mote: '#f4f0fc', moteOp: 0.6 }));
// ---- the tower: the village church tower the hive was built on, rubble stone rising out of frame on the left, its
// string courses, the west door choked with comb, the belfry lancet gutted, burns down its face from the top
{
  const X0 = -13.4, X1 = -6.4, Z = 13, at = (s, t) => [X0 + s, t, Z];
  raw(S.ashlar(at, X1 - X0, 16, STONE, { rough: true, roughP: 0.6, scale: 1.5, wscale: 1.0, vary: 0.3, lost: 0.3, spall: 0.35 }));
  // its right flank, turning away into the dark (the quoins long-and-short at the corner)
  raw(`<path d="${pp([[X1, 0, Z], [X1, 0, Z + 6], [X1, 16, Z + 6], [X1, 16, Z]])}" fill="#141210"/>` + hatch3((s, t) => [X1, t, Z + s], 0, 6, 0, 16, 0.6, { op: 0.5 }));
  for (let t = 0; t < 16; t += 0.5 + R() * 0.3) { const big = Math.round(t * 3) % 2; const q = [[X1 - (big ? 0.9 : 0.5), t + 0.03, Z], [X1, t + 0.03, Z], [X1, t + 0.47, Z], [X1 - (big ? 0.9 : 0.5), t + 0.47, Z]].map(p => P(...p)); raw(cel(chip(q, 0.3), { Z, fill: S.tone('#7a766e', 0.15), band: 1.5 })); }
  // string course: a projecting moulding across the tower at 5.4 m, its top catching light, its soffit dark
  raw(cel([P(X0, 5.4, Z), P(X1 + 0.1, 5.4, Z), P(X1 + 0.1, 5.75, Z - 0.15), P(X0, 5.75, Z - 0.15)], { Z, fill: '#8a867c', band: 3 }));
  // the west door: a round-headed arch, blocked with grey paper comb and a host sealed into it
  { const cx = (X0 + X1) / 2 + 0.3, w = 1.9, h = 3.6, pts = []; for (let k = 0; k <= 16; k++) { const a = Math.PI * k / 16; pts.push(P(cx + Math.cos(a) * w / 2, h - w / 2 + Math.sin(a) * w / 2, Z)); }
    const door = [P(cx + w / 2, 0, Z), ...pts, P(cx - w / 2, 0, Z)];
    raw(fillP(door, '#1c1a16')); const ck = S.id('wd'); raw(`<clipPath id="${ck}"><path d="${p2(door)}"/></clipPath><g clip-path="url(#${ck})">` + comb((s, t) => [cx - w / 2 + s, t, Z + 0.3], 0, w, 0, h, 0.16, { wall: '#3e3a34', capP: 0.5, larvaP: 0.1, nectarP: 0.08, capCol: '#6a665a', grub: '#6a6650', voidCol: '#080706' }) + `<path d="${p2(door)}" fill="${S.hatchA(13)}" opacity="0.5"/></g>`);
    for (let k = 0; k < 9; k++) { const a = Math.PI * (k + 0.5) / 9, r0 = w / 2, r1 = w / 2 + 0.45, q = [[cx + Math.cos(a - 0.17) * r0, h - w / 2 + Math.sin(a - 0.17) * r0, Z], [cx + Math.cos(a - 0.17) * r1, h - w / 2 + Math.sin(a - 0.17) * r1, Z], [cx + Math.cos(a + 0.17) * r1, h - w / 2 + Math.sin(a + 0.17) * r1, Z], [cx + Math.cos(a + 0.17) * r0, h - w / 2 + Math.sin(a + 0.17) * r0, Z]].map(p => P(...p)); raw(cel(chip(q, 0.2), { Z, fill: S.tone('#7a766c', 0.15), band: 1.5 })); }
    raw(inkP(door, 1.6)); }
  // the belfry lancet, gutted: a tall pointed opening into the dark hollow, a broken louvre board hanging
  { const cx = X0 + 3.6, y0 = 7.4, w = 1.3, pts = [P(cx - w / 2, y0, Z), P(cx - w / 2, y0 + 3.2, Z), P(cx - w * 0.25, y0 + 4.1, Z), P(cx, y0 + 4.5, Z), P(cx + w * 0.25, y0 + 4.1, Z), P(cx + w / 2, y0 + 3.2, Z), P(cx + w / 2, y0, Z)];
    raw(fillP(pts, '#040404') + inkP(pts, 1.6) + cel([P(cx - w / 2, y0 + 1.6, Z), P(cx + w * 0.1, y0 + 1.9, Z), P(cx + w * 0.15, y0 + 1.75, Z), P(cx - w / 2, y0 + 1.42, Z)], { Z, fill: '#3a3228', band: 1 })); }
  raw(fillP([P(X0, 0, Z), P(X1, 0, Z), P(X1, 16, Z), P(X0, 16, Z)], MURK, 0.38));
  // burns branching down the stones from the top of the tower, the strike that made the first spire
  for (let k = 0; k < 4; k++) { const p = P(X0 + 1 + R() * 5, 16, Z); raw(burn(p[0], p[1] + R() * 20, Math.PI / 2 + (R() - 0.5) * 0.5, 200 + R() * 120, 3.2, { core: VIO, depth: 4, haloOp: 0.3 })); }
  // the dark over it, stepped (the tower rises into the gloom); paper comb crusting its right edge and its top
  raw(hatch3(at, 0, X1 - X0, 0, 16, 0.75, { op: 0.4, keep: (s, t) => t > 6 || s > 5 }) + hatch3(at, 0, X1 - X0, 0, 16, -0.75, { op: 0.35, keep: (s, t) => t > 9 }));
  raw(comb(at, X1 - X0 - 1.2, X1 - X0, 0.5, 16, 0.22, { wall: '#3a3630', capP: 0.4, larvaP: 0.15, nectarP: 0.12, capCol: '#6a665a', grub: '#6a6650', nectar: '#3e5020', voidCol: '#080706', keep: (s, t) => R() < 0.7 - (X1 - X0 - s) * 0.4 }));
}
// ---- the iron cross from the tower's top: dragged down the hollow as the first rod, its arms fused into lumps, hanging
// on its chain out of the dark into the place where the queen's back is (the rod runs into her back)
{ // the cross hangs in the beam above the stage on its chain, high and clear of the queen; its rod runs on from its
  // foot down into the dark to where her back is
  const cx = 770, top = [cx + 4, -10], ch = [cx, 48], foot = [cx - 2, 150], cr = [[cx - 34, 76], [cx + 36, 72]];
  raw(B.chain([top, ch], 3.2, '#2a2826'));
  raw(line([ch, foot], 9, INK) + line([ch, foot], 5.5, '#3a3634') + line([[ch[0] - 2, ch[1]], [foot[0] - 2, foot[1]]], 1.2, BEAM, 0.7));
  raw(pline(cr, 9, INK) + pline(cr, 5.5, '#3a3634') + pline(cr.map(([x, y]) => [x, y - 2]), 1.2, BEAM, 0.6) + fused(cr[0][0], cr[0][1], 9, '#4a4440', 12) + fused(cr[1][0], cr[1][1], 8, '#4a4440', 12) + fused(ch[0], ch[1] + 4, 6, '#4a4440', 12));
  { const ck = S.id('cx'); raw(`<clipPath id="${ck}"><path d="M${cx - 5} 48 L${cx + 4} 48 L${cx + 2} 150 L${cx - 7} 150 Z"/></clipPath><g clip-path="url(#${ck})">` + burn(cx, 50, Math.PI / 2, 100, 1.6, { core: VIO, depth: 2, spread: 0.2 }) + '</g>'); }
  raw(line([foot, [920, 172], [1100, 150]], 4.5, INK) + line([foot, [920, 172], [1100, 150]], 2.4, '#2e2c2a') + line([foot, [920, 172], [1100, 150]].map(([x, y]) => [x, y - 1.5]), 0.8, BEAM, 0.4)); }
// the rent in the crown far above, where the storm light comes in: torn paper edges against a white glare
raw(G.pool(585, -6, 200, 70, '#ffffff', { n: 4, op: 0.3 }));
for (let k = 0; k < 9; k++) { const x = 450 + k * 32 + (R() - 0.5) * 10, L = 18 + R() * 30; raw(cel([[x - 12, -6], [x + 12, -6], [x + (R() - 0.5) * 10, L]], { Z: 30, fill: '#1e1c1a', band: 2 })); }
// ---- the floor: the church's slabs under the hive's litter: incised crosses, worn; drones' dead and spent comb heaped;
// the beam's pool lying across it to the stage
{
  raw(`<path d="${pp([[-40, 0, 3.5], [40, 0, 3.5], [40, 0, 30], [-40, 0, 30]])}" fill="#14120f"/>`);
  raw(B.flags(-18, 18, 3.6, 26, '#4a4640', { depth: 1.0, width: 1.2, vary: 0.2, missing: 0.05, cracks: 0.25, fogK: 0.9 }));
  for (const [X, Z] of [[-3, 9], [2.6, 12], [-6, 15], [5, 18]]) { const a = P(X - 0.25, 0.01, Z), b = P(X + 0.25, 0.01, Z), c = P(X, 0.01, Z - 0.3), d = P(X, 0.01, Z + 0.3); raw(pline([a, b], 1, INK, 0.6) + pline([c, d], 1, INK, 0.6)); }
  // the litter: dead drones (black), spent comb (grey), the occasional pale bone; denser at the edges
  for (let k = 0; k < 160; k++) { const X = -16 + R() * 32, Z = 5 + Math.pow(R(), 0.6) * 20; if (Math.abs(X) < 3 && R() < 0.7) continue; const p = P(X, 0.03, Z), r = K(Z) * (0.05 + R() * 0.07), u = R();
    raw(u < 0.55 ? fillS(blob(p[0], p[1], r * 1.4, r * 0.7, 8, 0.3), '#0e0d10') + line([[p[0] - r, p[1] - r * 0.3], [p[0] + r * 0.2, p[1] - r * 0.9]], 0.5, '#8a8698', 0.6) : u < 0.9 ? fillS(blob(p[0], p[1], r * 1.6, r * 0.6, 7, 0.4), '#3a3630', 0.9) : line([[p[0] - r * 2, p[1]], [p[0] + r * 2, p[1] - 1]], Math.max(1, r * 0.5), '#a8a090')); }
  // the beam's pool across the floor, the stage lit
  raw(pool(1150, 412, 330, 30, BEAM, { n: 5, op: 0.06, rot: -0.04 }));
  raw(G.bandFloor(-16, 16, { col: '#3a3834', wear: '#5a5650', debrisCol: '#2a2826', wearOp: 0.3 }));
  // darkness away from the beam on the floor, stepped
  raw(hatch3((s, t) => [-20 + s, 0, 3.5 + t], 0, 40, 0, 26, 0.3, { op: 0.4, keep: (s, t) => inBeam(...P(-20 + s, 0, 3.5 + t)) < 0.2 }));
}
raw(quiet([[236, 0.12], [266, 0.12], [300, 0.1], [350, 0.08]], { hop: 0.14 }));
raw(frame('#040406', { sides: [[160, 0.2], [90, 0.22], [40, 0.25]], top: [[120, 0.25], [70, 0.25], [30, 0.25]], bottom: [[30, 0.3]] }));

// ======================================================================== MID
layer('mid');
{ // a heap of dead drones and spent comb against the tower foot
  const Z = 11, c = P(-6.2, 0, Z), k = K(Z); raw(lump([[c[0] - k * 1.3, c[1]], [c[0] - k * 0.6, c[1] - k * 0.5], [c[0] + k * 0.4, c[1] - k * 0.6], [c[0] + k * 1.2, c[1]]], Z, '#1a1816', { band: 4 }));
  for (let i = 0; i < 26; i++) { const x = c[0] + (R() - 0.5) * k * 2.2, y = c[1] - R() * k * 0.5 * (1 - Math.abs(x - c[0]) / (k * 1.3)), r = k * 0.06; raw(fillS(blob(x, y, r * 1.4, r * 0.8, 7, 0.3), R() < 0.6 ? '#0c0b0e' : '#2e2b26') + (R() < 0.3 ? line([[x - r, y - r * 0.4], [x + r * 0.3, y - r]], 0.5, '#8a8698', 0.6) : '')); }
}
{ // a lifted floor slab with its incised cross, tipped on its edge
  const Z = 10, X = 3.2, q = [P(X - 0.7, 0, Z), P(X + 0.6, 0, Z - 0.2), P(X + 0.55, 0.5, Z), P(X - 0.65, 0.55, Z + 0.15)]; raw(cel(chip(q, 0.3), { Z, fill: mix('#4a4640', MURK, 0.35), band: 3, tex: 'url(#mottle)', texOp: 0.5 }));
  const c = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2]; raw(pline([[c[0] - 10, c[1]], [c[0] + 10, c[1] - 1]], 1, INK, 0.7) + pline([[c[0], c[1] - 7], [c[0], c[1] + 6]], 1, INK, 0.7)); }
{ // a pilgrim's hat, a lead badge pinned to it, and a staff, in the litter
  const Z = 9, p = P(-1.8, 0.05, Z), k = K(Z); raw(fillS(blob(p[0], p[1], k * 0.28, k * 0.07, 12, 0.15), '#2a241c') + cel(blob(p[0], p[1] - k * 0.07, k * 0.13, k * 0.08, 10, 0.2), { Z, fill: '#3a3024', band: 2 }) + `<circle cx="${f1(p[0] + k * 0.05)}" cy="${f1(p[1] - k * 0.08)}" r="1.4" fill="#7a7a7e" stroke="${INK}" stroke-width="0.5"/>`);
  raw(line([P(-3.4, 0.03, Z + 0.4), P(-2.1, 0.04, Z)], 2.4, INK) + line([P(-3.4, 0.03, Z + 0.4), P(-2.1, 0.04, Z)], 1.2, '#4a3a28')); }

// ======================================================================== FORE
layer('fore');
// top-left: a comb tier hanging near overhead, its broken edge and the cells opening down at us
{ const pts = [[-10, -10], [620, -10], [600, 14], [540, 30], [470, 26], [400, 44], [300, 52], [200, 70], [110, 64], [-10, 90]];
  raw(fillP(pts, '#141210')); const ck = S.id('ht'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">` + comb((u, v) => [u, 4.2, v], -14, 2, 2, 8, 0.32, { wall: '#34302a', capCol: '#5a564a', capP: 0.4, larvaP: 0.15, nectarP: 0.1, grub: '#5a5644', nectar: '#3a4c1c', nectarL: '#7a9640', voidCol: '#060505' }) + `<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.5"/></g>`);
  raw(line(pts.slice(1, -1), 3, INK)); for (let k = 0; k < 8; k++) { const p = pts[2 + Math.floor(R() * 7)], L = 12 + R() * 22; raw(cel([[p[0] - 5, p[1]], [p[0] + 5, p[1]], [p[0] + (R() - 0.5) * 6, p[1] + L]], { Z: 4, fill: '#3a3428', band: 2 })); } }
// left: the tower's buttress foot, close, rubble stone
{ const pts = [[-10, H + 5], [-10, 60], [50, 64], [56, 200], [70, 300], [86, 400], [110, H + 5]]; raw(fillP(pts, '#2a2824'));
  const ck = S.id('bt'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">` + S.ashlar((s, t) => [-6.2 + s, t, 3.2], 2.4, 5, '#4a4640', { rough: true, roughP: 0.5, scale: 0.8 }) + `<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.5"/><path d="${p2(pts)}" fill="#08080a" opacity="0.35"/></g>` + inkP(pts.slice(1, -1).concat([[110, H + 5]]), 2.4)); }
// right: a paper column at the frame edge, and the rod's guy chain slanting up out of frame
{ const pts = [[W + 10, H + 5], [W + 10, -5], [W - 58, -5], [W - 50, 100], [W - 66, 220], [W - 54, 320], [W - 74, H + 5]];
  raw(cel(pts, { Z: 3.4, fill: '#24221e', band: 10, tex: 'url(#mottle)', texOp: 0.5 })); const ck = S.id('pc'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">`);
  for (let y = 0; y < H; y += 9 + R() * 12) { const q = []; for (let k = 0; k <= 4; k++) q.push([W - 80 + k * 24, y + Math.sin(k * 1.3 + y) * 4]); raw(line(q, 1.3, INK, 0.6) + line(q.map(([x, yy]) => [x, yy + 2]), 0.6, '#8a8478', 0.3)); }
  raw(`<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.5"/></g>`);
  raw(B.chain([[W - 60, 30], [W - 140, -10]], 4, '#2a2826')); }
raw(fillP([[-5, H + 5], [-5, H - 14], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 12 - Math.sin(k * 1.3) * 5 - R() * 5]), [W + 5, H - 14], [W + 5, H + 5]], '#060508', 0.94));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) }, boss_stage: { x: [814, 1480], note: 'right 45% kept for the ruler' } }, null, 1));
console.log(ROOM, 'layers written');
