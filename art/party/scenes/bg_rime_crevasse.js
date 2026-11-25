// World VIII, the Sundered Rime: THE CREVASSE (round 2; upgrade of 'rime_breach', renamed to the game's key
// 'rime_crevasse'). The old rime_breach outputs are left in place. Contract as the nave (1480 x 480 at 2x; far opaque,
// mid and fore transparent; horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters: Vent Hounds (the hounds nest where the magma breathes), Steam and Stone (rising heat, falling ice).
// The place: a crevasse the heat split open in the glacier under the hold. The company stands on the fallen snow bridges
// at its bottom, looking along it: two walls of glacier ice, banded with the dirty yearly strata, fluted by meltwater,
// undercut near the floor and overhanging higher up, close in overhead to a strip of sky. Daylight comes down through
// the ice, so the walls glow blue from within, palest high up. At the far end the vent breathes: an orange cleft under a
// black-glass tongue of obsidian, steam pouring up the slot; the hounds' bed of warm ash and gnawed bones by it. The
// miners came down here: their rope ladders and knotted ropes hang down the walls from iron spikes, and their winch's
// chain hangs from the lip far above.
// Round 2 (director notes on rime_breach): no low-poly facets (the ice is smooth curved walls with strata and flutes),
// no vase-shaped flow (the obsidian is a slumped tongue of lobes), no glowing branch (the hot cracks are short seams in
// the vent's crust only). Three depth planes: near walls and the fallen bridge, the slot's middle reach, the far end
// with the vent; recession toward the slot's blue air.
// Courses: FROST (the glacier, rime, icicles hanging from every overhang); FIRE (the vent, the obsidian, steam, ash, char).
// Palette: white and blue ice, orange seams, black obsidian; no red, no gold, no eyes, no lightning.
// Usage: node scenes/bg_rime_crevasse.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VIII');
const W = 1480, H = 480, ROOM = 'rime_crevasse';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 8202, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#eef8fc', shadowTint: '#102030' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#4a7a98', murk: '#0c1822' });
const { BK, BL, air, glare, plates, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, seam, seamTree, ash, steam, icicles, rime } = BK;

const ICE = '#d8eef4', ICE2 = '#9cc8d8', ICE3 = '#5a94b0', ICE4 = '#2a5672', DEEP = '#10283a', OBS = '#121016', OBS2 = '#2a2630', OR = '#ff8a2a', HOT = '#ffd98a', MURK = '#0c1822', TIM = '#4a3c2c';
const ZEND = 42;
// the walls: half-width w(Z) meanders and narrows going away; the profile undercuts near the floor and overhangs above
const wZ = (Z, sg) => Math.max(2.2, 8.2 - 0.15 * (Z - 4)) + (sg < 0 ? 1.1 * Math.sin(Z * 0.21 + 0.6) : 0.9 * Math.sin(Z * 0.17 + 2.4));
const prof = Y => 0.9 * Math.sin(Math.min(Y, 5) / 5 * Math.PI) - 0.07 * Math.max(0, Y - 5) + 0.02 * Math.max(0, Y - 14) ** 1.5;
const Xw = (Z, Y, sg) => sg * (wZ(Z, sg) + prof(Y));
// the light inside the ice: from the sky strip above (pale), fading to deep blue low down and far away
const iceCol = (Z, Y, facing) => { const h = Math.max(0, Math.min(1, (Y - 1) / 14)), base = h > 0.66 ? mix(ICE2, ICE, (h - 0.66) * 3) : h > 0.33 ? mix(ICE3, ICE2, (h - 0.33) * 3) : mix(ICE4, ICE3, h * 3); return air(mix(base, facing > 0 ? '#ffffff' : DEEP, facing > 0 ? facing * 0.25 : -facing * 0.45), Z, { z0: 8, z1: 60, max: 0.6 }); };

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${DEEP}"/>`);
// ---- the strip of sky far overhead (seen between the overhanging lips) and the miners' winch at the lip
{
  raw(fillP([[300, -10], [1200, -10], [1000, 200], [520, 200]], '#c8dce6'));
  raw(glare(760, 40, 60, '#f4fbfd', { steps: [[3, 0.3], [2, 0.4], [1.2, 0.55]], sx: 2, sy: 0.6 }));
}
// ---- the far end: the crevasse closes in a wall of ice; at its foot the vent: an orange cleft under a slumped tongue of
// obsidian, its crust cracked into plates, glowing seams between the upper plates, steam pouring up the slot
{
  const Z = ZEND, at = (s, t) => [-6 + s, t, Z];
  const wall = []; for (let i = 0; i <= 20; i++) { const X = -6 + 12 * i / 20; wall.push(P(X, 40, Z)); }
  raw(fillP([P(-8, 0, Z), P(8, 0, Z), P(8, 40, Z), P(-8, 40, Z)], air(ICE4, Z, { max: 0.4, z0: 8, z1: 60 })));
  for (let k = 0; k < 14; k++) { const Y = 1 + k * 2.2 + R(), pts = []; for (let i = 0; i <= 12; i++) pts.push(P(-8 + 16 * i / 12, Y + Math.sin(i * 0.8 + k) * 0.3, Z)); raw(line(pts, 1, air(ICE4, Z, { max: 0.5 }), 0.45)); }
  // the glow of the vent on the ice round it (painted), and the cleft
  raw(GLOW(`<ellipse cx="${f1(P(0.4, 1.5, Z)[0])}" cy="${f1(P(0, 1.5, Z)[1])}" rx="190" ry="80" fill="${OR}" opacity="0.35" filter="url(#soft)"/>`));
  const cl = [P(-1.6, 0, Z - 0.5), P(-0.9, 2.4, Z - 0.5), P(-0.2, 3.4, Z - 0.5), P(0.7, 2.9, Z - 0.5), P(1.9, 0, Z - 0.5)];
  raw(EM(fillP(cl, '#c24e14') + fillP([P(-0.9, 0, Z - 0.5), P(-0.4, 2.0, Z - 0.5), P(0.3, 2.4, Z - 0.5), P(1.1, 0, Z - 0.5)], OR) + fillP([P(-0.3, 0, Z - 0.5), P(0, 1.4, Z - 0.5), P(0.5, 0, Z - 0.5)], HOT)) + inkP(cl, 1.2));
  // the obsidian tongue: slumped lobes, each overlapping the one below, crust plates, rime on the windward flanks
  const lobes = [[-3.2, 3.2, 1.7], [-2.2, 2.4, 1.4], [-1.0, 1.2, 1.2], [2.6, 2.0, 1.2], [3.6, 1.0, 1.1], [-3.6, 0.6, 1.6], [3.4, 0.2, 1.8]];
  for (const [X, Y, r] of lobes) { const c = P(X, Y, Z - 0.3), k = K(Z), b = blob(c[0], c[1], k * r, k * r * 0.55, 12, 0.25); raw(cel(b, { Z, fill: OBS2, band: k * r * 0.2, shadow: OBS }) + pline(b.slice(7, 11), 1, '#6a7888', 0.7) + (Y > 1.5 ? EM(seam(jag([c[0] - k * r * 0.5, c[1] + 1], [c[0] + k * r * 0.4, c[1] - 1], 4, 1), 0.8, { glowW: 4, glowOp: 0.12 })) : '') + rime(b.slice(6, 10).reverse(), Z, { th: 1.6, op: 0.7 })); }
  raw(G.softSteam(...P(0.3, 2.6, Z - 0.6), 200, 26, { n: 12, op: 0.45, drift: 0.05, hotN: 3, hot: '#f0a070', wisps: 4 }));
  raw(ash(30, P(-3, 4, Z)[0], P(3, 4, Z)[0], 120, 270, { r: 1.4, op: 0.5 }));
  { let m = ''; for (let k = 0; k < 24; k++) m += `<circle cx="${f1(P(-2, 0, Z)[0] + R() * 60)}" cy="${f1(180 + R() * 90)}" r="${f1(0.5 + R() * 0.7)}" fill="${HOT}" opacity="${f1(0.4 + R() * 0.5)}"/>`; raw(EM(m)); }
}
// ---- the walls, slice by slice from the far end to the near, both sides: each slice its own tone by how it faces the
// light (toward the strip of sky above and the company), strata bands sweeping along them, meltwater flutes, rime and
// icicles at every overhang's lip
function walls() {
  const slices = []; for (let Z = ZEND; Z > 3.2;) { const dz = Math.max(0.35, Z * 0.09); slices.push([Z - dz, Z]); Z -= dz; }
  const Ys = [0, 0.6, 1.4, 2.4, 3.4, 4.4, 5.4, 6.6, 8, 9.6, 11.4, 13.4, 15.6, 18, 21, 25, 30, 36];
  for (const [z0, z1] of slices) for (const sg of [-1, 1]) {
    const zm = (z0 + z1) / 2, dx = Xw(z1, 3, sg) - Xw(z0, 3, sg), turn = -sg * dx / (z1 - z0);                         // >0: the wall turns to face us
    for (let i = 0; i < Ys.length - 1; i++) { const ya = Ys[i], yb = Ys[i + 1], q = [P(Xw(z0, ya, sg), ya, z0), P(Xw(z1, ya, sg), ya, z1), P(Xw(z1, yb, sg), yb, z1), P(Xw(z0, yb, sg), yb, z0)];
      if (Math.max(...q.map(p => p[1])) < -20) continue;
      const over = prof(yb) - prof(ya) < 0 ? -0.3 : 0.15, facing = Math.max(-1, Math.min(1, turn * 0.6 + over + (sg < 0 ? 0.15 : -0.1)));
      raw(fillP(q, iceCol(zm, (ya + yb) / 2, facing)));
      if (facing < -0.15) raw(`<path d="${p2(q)}" fill="${S.hatchA(zm)}" opacity="${f1(Math.min(0.5, -facing * 0.6))}"/>`);
    }
    // a meltwater flute: a vertical groove down the slice, lit on one lip
    if (R() < 0.5) { const yy = 2 + R() * 6, pts = []; for (let j = 0; j <= 8; j++) { const Y = yy + j * 1.5; pts.push(P(Xw(zm, Y, sg), Y, zm)); } raw(line(pts, Math.max(0.8, K(zm) * 0.05), air(DEEP, zm, { max: 0.5 }), 0.35) + line(pts.map(([x, y]) => [x - sg * 1.5, y]), Math.max(0.5, K(zm) * 0.02), '#e4f4f8', 0.3)); }
  }
  // strata: the dirty yearly bands sweeping along both walls (they converge on the far end: the room's perspective)
  for (const sg of [-1, 1]) for (let k = 0; k < 12; k++) { const Y0 = 1.2 + k * 1.8 + R() * 0.6, pts = []; for (let Z = 3.6; Z <= ZEND; Z += 0.5) { const Y = Y0 + 0.5 * Math.sin(Z * 0.3 + k) + (Z - 4) * 0.02 * (k % 3 - 1); pts.push(P(Xw(Z, Y, sg), Y, Z)); }
    const vis = pts.filter(p => p[1] > -10); if (vis.length < 2) continue; raw(line(vis, Math.max(0.8, 1.6 + R() * 2.2), k % 4 === 0 ? '#2a3a44' : '#3c5a6a', 0.45) + line(vis.map(([x, y]) => [x, y + 2]), 0.7, '#e8f6fa', 0.35)); }
  // the lip of each overhang: rime along it, icicles hanging off it, long, in clusters
  for (const sg of [-1, 1]) { const pts = []; for (let Z = 3.8; Z <= ZEND; Z += 0.6) pts.push(P(Xw(Z, 5.0, sg), 5.0, Z)); raw(icicles(pts.filter(p => p[0] > -20 && p[0] < W + 20), 12, { len: 26, dens: 0.8, col: '#e8f6fa', shadow: '#5a8aa4' })); const pts2 = []; for (let Z = 6; Z <= ZEND; Z += 0.8) pts2.push(P(Xw(Z, 11, sg), 11, Z)); raw(icicles(pts2.filter(p => p[1] > 0), 16, { len: 22, dens: 0.6, col: '#eef8fa', shadow: '#6a9ab4', ph: 2 })); }
}
walls();
// ---- the miners' traces on the walls: iron spikes driven in, a knotted rope and a rope ladder hanging from them; the
// winch's chain hanging out of the sky strip far above with its bucket, rimed
{
  for (const [Z, Y, sg] of [[9, 7.2, -1], [11, 9.5, -1], [14, 6.0, 1], [19, 8.4, 1]]) { const a = P(Xw(Z, Y, sg) - sg * 0.05, Y, Z); raw(pline([a, [a[0] - sg * 8, a[1] + 2]], 2.6, INK) + pline([a, [a[0] - sg * 8, a[1] + 2]], 1.4, '#3a3838')); }
  { const a = P(Xw(9, 7.2, -1), 7.2, 9), b = P(Xw(9, 0.8, -1) + 0.6, 0.8, 9); raw(line([[a[0] + 7, a[1] + 2], [a[0] + 12, (a[1] + b[1]) / 2], [b[0] + 4, b[1]]], 3.4, INK) + line([[a[0] + 7, a[1] + 2], [a[0] + 12, (a[1] + b[1]) / 2], [b[0] + 4, b[1]]], 1.8, '#8a7a5a')); for (let i = 1; i < 9; i++) { const t = i / 9, x = a[0] + 7 + (b[0] - a[0] - 3) * t + Math.sin(t * Math.PI) * 5, y = a[1] + 2 + (b[1] - a[1] - 2) * t; raw(`<circle cx="${f1(x)}" cy="${f1(y)}" r="2.4" fill="#6a5a40" stroke="${INK}" stroke-width="0.8"/>`); } }
  { const sg = 1, Z = 14, a = P(Xw(Z, 6.0, sg), 6.0, Z), b = P(Xw(Z, 0.4, sg) - 0.3, 0.4, Z), w = K(Z) * 0.45; for (const dx of [0, w]) raw(line([[a[0] - 8 - dx, a[1] + 2], [b[0] - 8 - dx, b[1]]], 2.4, INK) + line([[a[0] - 8 - dx, a[1] + 2], [b[0] - 8 - dx, b[1]]], 1.2, '#8a7a5a')); for (let i = 1; i < 12; i++) { const t = i / 12, y = a[1] + 2 + (b[1] - a[1] - 2) * t, x = a[0] - 8 + (b[0] - a[0]) * t; raw(pline([[x - w, y], [x, y - 1]], 2.6, INK) + pline([[x - w, y], [x, y - 1]], 1.4, mix(TIM, '#6a5a44', 0.4))); if (R() < 0.4) raw(BL.icicle(x - w / 2, y + 1, 4 + R() * 6, 1.4, { col: '#e8f6fa' })); } }
  { const a = [790, -10], b = P(1.4, 5.6, 20); raw(BK.chain([a, b], 2.2, '#3a3838') + cel([[b[0] - 10, b[1] + 2], [b[0] + 10, b[1] + 2], [b[0] + 8, b[1] + 18], [b[0] - 8, b[1] + 18]], { Z: 20, fill: '#3a3a3c', band: 2 }) + rime([[b[0] - 10, b[1] + 2], [b[0], b[1]], [b[0] + 10, b[1] + 2]], 20, { th: 2 }) + icicles([[b[0] - 8, b[1] + 18], [b[0] + 8, b[1] + 18]], 20, { len: 9, dens: 2 })); }
}
// ---- the floor: fallen snow-bridge blocks and old ice packed into the slot's bottom, a track of boot prints and paw
// prints toward the vent, steam vents breathing through it, rime drifts against the wall feet
{
  const fl = []; for (let Z = 3.4; Z <= ZEND; Z += 0.5) fl.push([Z, Xw(Z, 0, -1), Xw(Z, 0, 1)]);
  raw(fillP([...fl.map(([Z, a]) => P(a, 0, Z)), ...fl.slice().reverse().map(([Z, , b]) => P(b, 0, Z))], air('#4a7088', 12, { max: 0.3 })));
  // packed old ice: broad plates of their own tones, receding
  for (let i = 0; i < 90; i++) { const Z = 4 + Math.pow(R(), 0.9) * 32, xl = Xw(Z, 0, -1), xr = Xw(Z, 0, 1), X = xl + R() * (xr - xl), w = 0.8 + R() * 2.4, d = 0.5 + R() * 1.6, q = [[X, 0.01, Z], [X + w, 0.01, Z + (R() - 0.5) * 0.3], [X + w * 0.9, 0.01, Z + d], [X + 0.1, 0.01, Z + d * 0.9]].map(p => P(...p)); raw(fillS(chip(q, 0.5), air(tone('#6a94ac', 0.08), Z, { max: 0.5, z0: 8, z1: 50 }), 0.9, 0.3) + line([q[0], q[1]], 0.6, '#c8e0ec', 0.35) + line([q[3], q[2]], 0.6, '#1e3646', 0.35)); }
  // the prints: a trodden track along the bottom toward the vent (converging), boot prints and the hounds' paws
  for (let Z = 6.5; Z < 30; Z += 0.55 + R() * 0.2) { const X = 0.4 + Math.sin(Z * 0.2) * 0.8 + (Math.round(Z * 3) % 2 ? 0.2 : -0.2), c = P(X, 0.01, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * 0.09, k * 0.025, 7, 0.3), '#2a4a5c', 0.6)); }
  // steam breathing up through cracks in the floor, and a glowing seam under the near rubble (the fire is under everything)
  for (const [X, Z] of [[-3.2, 14], [2.8, 20], [-1.0, 26]]) { const c = P(X, 0, Z); raw(EM(seam(jag([c[0] - K(Z) * 0.4, c[1]], [c[0] + K(Z) * 0.4, c[1] + 1], 4, 1), Math.max(0.6, K(Z) * 0.03), { glowW: 5, glowOp: 0.12 })) + steam(c[0], c[1], K(Z) * 3.5, { n: 3, w: 10, op: 0.2 })); }
  // rime drifts banked against the wall feet
  for (const sg of [-1, 1]) for (let Z = 5; Z < 34; Z += 1.6 + R() * 1.4) { const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8, z = Z + t * 1.8; pts.push(P(Xw(z, 0, sg) - sg * (0.3 + 0.5 * Math.sin(t * Math.PI)), 0.5 * Math.sin(t * Math.PI), z)); } raw(fillS([P(Xw(Z, 0, sg), 0, Z), ...pts, P(Xw(Z + 1.8, 0, sg), 0, Z + 1.8)], air('#a8cad8', Z, { max: 0.5 }), 0.85)); }
  raw(occBand((s, t) => [-12 + s, 0, 3.4 + t], 24, 1.0, { op: 0.3 }));
}
// ---- the quiet band: stepped toward the slot's deep blue behind the fighters
raw(BL.quiet(MURK, 238, 360, { steps: [0.1, 0.12, 0.15, 0.17], hop: 0.15 }));
// ---- falling ice: fine frost falling through the slot's light, catching it
raw(snowfall(140, { len: 2, slant: 0.1, op: 0.5, col: '#eef8fc', y1: 330 }));

// ======================================================================== MID: low, dark things on the slot's floor
layer('mid');
{
  // the hounds' nest by the vent side: a bed of warm ash in a hollow, gnawed bones, a miner's split boot (low, dark)
  const Z = 12, c = P(2.6, 0, Z), k = K(Z);
  raw(fillS(blob(c[0], c[1], k * 1.2, k * 0.14, 12, 0.3), '#2a2224', 0.9) + EM(fillS(blob(c[0] + k * 0.2, c[1], k * 0.5, k * 0.05, 9, 0.4), '#7a2c0c', 0.8)));
  for (let i = 0; i < 6; i++) { const a = [c[0] - k * 0.9 + R() * k * 1.8, c[1] - k * 0.02 + (R() - 0.5) * k * 0.08], l = k * (0.12 + R() * 0.15), ang = (R() - 0.5) * 0.6; const b = [a[0] + Math.cos(ang) * l, a[1] + Math.sin(ang) * l * 0.3]; raw(line([a, b], 2.6, INK) + line([a, b], 1.4, '#a8a090') + `<circle cx="${f1(b[0])}" cy="${f1(b[1])}" r="1.5" fill="#a8a090" stroke="${INK}" stroke-width="0.5"/>`); }
  raw(ash(14, c[0] - k, c[0] + k, c[1] - k * 0.6, c[1], { r: 1.2, op: 0.5 }));
  // fallen blocks of the snow bridge, low, with their rimed tops
  raw(plates([P(-7, 0, 10.5), P(-3, 0, 11.4), P(4.5, 0, 10.8), P(7, 0, 10.2)], 7, { size: [10, 24], cols: ['#a8cad8', '#4a7088', '#1e3646'], rime: '#e4f4f8', Z: 10.5 }));
  // a dropped pick, its haft charred at the head end and frozen at the grip
  { const a = P(-2.4, 0.05, 9.2), b = P(-1.3, 0.08, 9.0); raw(line([a, b], 3, INK) + line([a, b], 1.6, '#4a3a2a') + pline([[b[0] - 3, b[1] - 5], [b[0] + 1, b[1]], [b[0] + 5, b[1] + 2]], 3.4, INK) + pline([[b[0] - 3, b[1] - 5], [b[0] + 1, b[1]], [b[0] + 5, b[1] + 2]], 1.8, '#3a3838')); }
}

// ======================================================================== FORE: framing
layer('fore');
{
  // top: the remains of a snow bridge arching across the slot right overhead, its underside blue and hatched, its broken
  // ends ragged, icicles hanging from its whole length
  const top = [], bot = []; for (let i = 0; i <= 30; i++) { const x = -10 + (W + 20) * i / 30; top.push([x, -10]); bot.push([x, 26 + 26 * Math.cos((i / 30 - 0.45) * Math.PI * 1.2) + R() * 6]); }
  const br = [...top, ...bot.slice().reverse()];
  raw(cel(br, { Z: 3.5, fill: '#2a5672', band: 8, shadow: '#0c1822' }) + fillP(br, S.hatchA(4), 0.45));
  for (let i = 0; i < 6; i++) { const y = 10 + i * 8; raw(line(bot.map(([x, yy]) => [x, Math.min(yy - 4, y + Math.sin(x * 0.01 + i) * 4)]), 1, '#5a94b0', 0.5)); }
  raw(icicles(bot.slice(0, 31), 3.5, { len: 60, dens: 0.5, wmul: 1.2, col: '#e8f6fa', shadow: '#4a7a98' }));
  // left: the near wall's edge, dark blue ice bulging in from the frame edge, rimed on its lip, a rope hanging past it
  const lw = [[-10, 40], [44, 60], [70, 150], [54, 250], [80, 360], [66, H + 10], [-10, H + 10]];
  raw(cel(lw, { Z: 4, fill: '#1e4258', band: 10, shadow: '#0a1620' }) + fillP(lw, S.hatchA(4), 0.35) + rime(lw.slice(1, 6).reverse(), 4, { th: 5, col: '#d8eef4' }));
  for (let i = 0; i < 5; i++) { const y = 90 + i * 70; raw(line([[0, y], [50, y + 6 + R() * 10]], 1.4, '#5a94b0', 0.6)); }
  raw(line([[96, 30], [104, 180], [96, 300], [102, H + 10]], 4, INK) + line([[96, 30], [104, 180], [96, 300], [102, H + 10]], 2.2, '#8a7a5a'));
  // right: an obsidian boulder fallen in from the vent side, rimed, one dull seam, steam from under it
  const ob = [[W + 10, H + 10], [W - 170, H + 10], [W - 150, H - 50], [W - 110, H - 90], [W - 60, H - 104], [W - 20, H - 140], [W + 10, H - 150]];
  raw(cel(ob, { Z: 3.6, fill: OBS, band: 8 }) + G.rockV2(ob, 3.6, OBS) + fillP(ob, S.hatchA(4), 0.3) + rime(ob.slice(2).reverse().slice(0, 4).reverse(), 3.6, { th: 5, col: '#d8eef4' }));
  for (let k = 0; k < 5; k++) { const x = W - 150 + R() * 140, y = H - 20 - R() * 90, r = 10 + R() * 12; raw(`<path d="M${f1(x - r)} ${f1(y)} Q${f1(x - r * 0.2)} ${f1(y - r * 0.9)} ${f1(x + r)} ${f1(y - r * 0.2)}" stroke="#7a8a9a" stroke-width="1" fill="none" opacity="0.6"/>`); }
  raw(EM(seam(jag([W - 120, H - 30], [W - 40, H - 80], 6, 3), 1.8, { glowOp: 0.1 })) + steam(W - 90, H - 60, 120, { n: 3, w: 20, op: 0.22 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
