// World I, the Drowned Kingdom: THE OSSUARY (room key `ossuary`), Living Ink, round 2 (group g1).
// The charnel crypt under the cathedral's cloister walk. The sisters of the infirmary stacked the bones of the drowned here,
// long bones in courses and skulls between, bay by bay behind a low arcade; the tide still comes in and goes out, leaving its
// wrack of silt and loose bones along the floor. One beam of green-white light falls through the drain grating in the vault
// from the cloister above: the only light. Through the far bay a passage runs back to the stair the sisters used.
// Encounters: "The Ossuary Tide" (bloated, thrall, hookline), "The Weeping Cloister" (anchor brute keeps the door, weeping
// nun, choirboy), "The Pearl Diver" (hookline, pearl diver).
// Space: underground, tight and low: a barrel vault overhead with ribs converging, the arcade 3.5 m behind the fighters.
// Light: darkness with one beam (darkest key of the world, warm side: bone ochre; drowned gold only on the reliquary).
// Courses: water (tide line, silt, barnacles, kelp in the grating, wet floor), void (a torn absence through a bone wall).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'I');
const W = 1480, H = 480, ROOM = 'ossuary';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2321, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1a1612' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, ashlar } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, I = G.I;
const MURK = '#0b0f10', BONE = '#b8aa88', STONE = '#4a4c46', BEAM = '#d8ecd8', GOLD = I.GOLD;
const fog = G.fogger(MURK, 8, 34, 0.85);
const ZA = 9.6, ZB = 12.4, BX = -2.6, BZ = 8.4;      // arcade face, bay back walls, the beam's X and Z
// light from the beam: 1 at its foot, falling off with distance (used to lift tones near it)
const lit = (X, Y, Z) => Math.max(0, 1 - Math.hypot(X - BX, (Y - 1.2) * 0.6, (Z - BZ) * 0.8) / 6.5);
const shade = (col, X, Y, Z) => mix(mix(col, MURK, 0.55), mix(col, BEAM, 0.12), lit(X, Y, Z));
const vaultY = Z => 2.1 + 1.25 * Math.sin(Math.min(1, Math.max(0, (ZA - Z) / (ZA - 2.6))) * Math.PI * 0.62 + 0.0);

// a wall of bones in the plane at(s,t): courses of long-bone ends (knobbed pairs), every few courses a row of skulls;
// o.slump(s) lowers the top where a stack has collapsed; tones lifted near the beam
function boneWall(at, Ls, Lt, o = {}) {
  let s = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${MURK}"/>`;
  let t = 0.05, row = 0;
  while (t < Lt) {
    const skull = row % 4 === 2, h = skull ? 0.2 : 0.085;
    let u = (row % 2) * 0.04 + R() * 0.03;
    while (u < Ls) {
      const top = o.slump ? o.slump(u) : Lt; if (t + h > top) { u += 0.1; continue; }
      if (o.skip && o.skip(u, t)) { u += 0.1; continue; }
      const p = at(u, t + h / 2), [x, y] = P(...p), k = K(p[2]), col = shade(tone(BONE, 0.25), ...p);
      if (skull) { const r = k * 0.085, cr = [[x - r, y + r * 0.2], [x - r * 0.95, y - r * 0.45], [x - r * 0.5, y - r * 0.9], [x + r * 0.3, y - r * 0.95], [x + r * 0.9, y - r * 0.5], [x + r, y + r * 0.2], [x + r * 0.55, y + r * 0.75], [x - r * 0.55, y + r * 0.75]];
        s += `<path d="${smooth(cr, true, 0.5)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(0.4, r * 0.12))}"/>`;
        if (r > 2) s += `<ellipse cx="${f1(x - r * 0.38)}" cy="${f1(y + r * 0.05)}" rx="${f1(r * 0.27)}" ry="${f1(r * 0.24)}" fill="${INK}"/><ellipse cx="${f1(x + r * 0.38)}" cy="${f1(y + r * 0.05)}" rx="${f1(r * 0.27)}" ry="${f1(r * 0.24)}" fill="${INK}"/><path d="M${f1(x)} ${f1(y + r * 0.28)} l${f1(-r * 0.1)} ${f1(r * 0.25)} l${f1(r * 0.2)} 0 Z" fill="${INK}"/><path d="M${f1(x - r * 0.75)} ${f1(y - r * 0.55)} Q${f1(x - r * 0.2)} ${f1(y - r * 0.95)} ${f1(x + r * 0.3)} ${f1(y - r * 0.85)}" stroke="${mix(col, '#fff8e0', 0.4)}" stroke-width="${f1(Math.max(0.4, r * 0.12))}" fill="none" opacity="0.6"/>`;
        u += 0.2 + R() * 0.03;
      } else { const r = k * 0.026 * (0.8 + R() * 0.4);
        s += `<ellipse cx="${f1(x - r * 0.55)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.9)}" fill="${col}" stroke="${INK}" stroke-width="0.4"/><ellipse cx="${f1(x + r * 0.55)}" cy="${f1(y + r * 0.1)}" rx="${f1(r)}" ry="${f1(r * 0.85)}" fill="${col}" stroke="${INK}" stroke-width="0.4"/>`;
        u += 0.06 + R() * 0.02; }
    }
    t += h + 0.01; row++;
  }
  // the shadow side of the stack: crosshatch heavier low and away from the beam
  s += hatch3(at, 0, Ls, 0, Lt, 0.8, { op: o.hop ?? 0.35, ragged: 0.3 });
  return s;
}

layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- distance: through the far right bay, the passage back to the sisters' stair: barrel-vaulted, its end a dim grey glimmer
{
  const x0 = 7.2, x1 = 9.6;
  for (let Z = 30; Z > ZB; Z -= 1.6) { const q = G.arch(x0, x1, 1.6, 'round', { n: 6 }).map(([x, y]) => P(x, y, Z)); raw(`<path d="${p2(q)}" fill="none" stroke="${fog('#3a3a34', Z)}" stroke-width="${f1(Math.max(0.6, K(Z) * 0.08))}"/>`); }
  const end = G.arch(x0 + 0.3, x1 - 0.3, 1.5, 'round', { n: 6 }).map(([x, y]) => P(x, y, 30)); raw(`<path d="${p2(end)}" fill="#3a443e"/>` + glow(...P(8.4, 1.0, 30), 18, 22, '#9ab0a0', 0.25));
  for (let k = 0; k < 7; k++) { const Z = 28 - k * 0.5, A = P(x0 + 0.5 + k * 0.2, k * 0.17, Z), B = P(x1 - 0.5, k * 0.17, Z); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#4a544c" stroke-width="0.8" opacity="0.6"/>`); }
}
// ---- middle: the bays' back walls of stacked bones (Z 12.4), the bays' side walls; a reliquary niche; the void
{
  const atB = (s, t) => [-16 + s, t, ZB];
  raw(boneWall(atB, 23, 2.3, { slump: u => (u > 3.2 && u < 6.4) ? 0.8 + Math.abs(u - 4.8) * 0.55 : 2.3, skip: (u, t) => u > 22.9 }));
  // the void: a torn absence through the stacked bones of the middle bay: skulls and femurs cut clean along its rim
  raw(BK.tornVoid(atB, 18.2, 1.15, 0.55, 0.42, { rot: 0.2, lobes: [[0.2, 0.3, 0.6], [3.5, 0.2, 0.5]], fray: [[0.0, 4, 0.2], [4.0, 3, 0.18]], depth: 0.6, cut: '#1e1c16', fissures: 2, violet: true, lip: '#a09878' }).svg);
  // a reliquary niche in the left bay: a drowned-gold casket (holy), a skull crowned, candle stubs drowned
  { const c = P(-11.5, 1.2, ZB - 0.05), k = K(ZB), q = [[c[0] - k * 0.35, c[1] + k * 0.25], [c[0] + k * 0.35, c[1] + k * 0.25], [c[0] + k * 0.35, c[1] - k * 0.1], [c[0], c[1] - k * 0.3], [c[0] - k * 0.35, c[1] - k * 0.1]];
    raw(cel(q, { Z: ZB, fill: shade(GOLD, -11.5, 1.2, ZB), band: 1.2, tex: 'url(#mottle)', texOp: 0.4 }) + `<path d="M${f1(c[0] - k * 0.3)} ${f1(c[1] + k * 0.05)} L${f1(c[0] + k * 0.3)} ${f1(c[1] + k * 0.05)}" stroke="${INK}" stroke-width="0.8"/>` + I.barnacles(c[0] + k * 0.2, c[1] + k * 0.15, 5, 4, ZB, '#7a7660')); }
  // side walls of each bay (the piers' depth), rough stone receding to the bone walls
  for (const X of [-12.4, -7.2, -1.8, 3.4, 7.0]) { const lft = X > BX; const at = (s, t) => [X, t, ZA + s];
    raw(ashlar(at, ZB - ZA, 2.6, shade(STONE, X, 1, ZA + 1), { scale: 0.7, rough: true, vary: 0.2, mortar: 0.6 }) + hatch3(at, 0, ZB - ZA, 0, 2.6, 0.7, { op: lft ? 0.55 : 0.3 }) + (lft ? hatch3(at, 0, ZB - ZA, 0, 2.6, -0.8, { op: 0.4 }) : '')); }
}
// ---- near structure: the arcade wall (Z 9.6): squat piers, low round arches of uneven span and rise, the tide line on it
const OPS = [[-16.5, -12.4, 1.5, 0.85], [-12.0, -7.2, 1.45, 1.05], [-6.8, -1.8, 1.55, 0.9], [-1.4, 3.4, 1.4, 1.1], [3.8, 7.0, 1.5, 0.75], [7.2, 9.6, 1.15, 0.6], [10.0, 15, 1.5, 0.9]];
const OPN = OPS.map(([a, b, ys, rise]) => G.arch(a, b, ys, 'round', { rise, n: 8 }));
{
  OPN.forEach(op => raw(G.soffit(op, ZA, ZA + 0.7, shade('#2a2824', op[0][0], 2, ZA))));
  raw(G.holedWall(ZA, -18, 18, 0, 3.5, OPN, shade(STONE, -3, 1.5, ZA), { ash: { scale: 0.75, weather: { algae: 0.2, salt: 0.3, saltCol: '#8a8a7a' }, barnBands: [[0.0, 0.45, 60]], barnCol: '#6a685a' }, shadeH: 0.5, shadeOp: 0.45,
    extra: `<path d="${pp([[-18, 0, ZA], [18, 0, ZA], [18, 0.95, ZA], [-18, 0.95, ZA]])}" fill="#1a1a14" opacity="0.35"/>` }));
  OPN.forEach(op => raw(G.ring(op, ZA - 0.03, 0.3, shade('#5a5a52', (op[0][0] + op[op.length - 1][0]) / 2, 2, ZA), { v: 0.28 })));
  // the tide line: a pale salt band where the tide stands at the springing, wrack and weed stuck along it
  { const pts = []; for (let X = -18; X <= 18; X += 0.4) pts.push(P(X, 0.95 + Math.sin(X * 1.7) * 0.03, ZA - 0.02)); raw(line(pts, 2.2, '#8a8a74', 0.4) + line(pts.map(([x, y]) => [x, y + 2.5]), 1, INK, 0.5)); }
}
// ---- the vault overhead: a low barrel vault (axis across the room), its courses horizontal bands, ribs converging
{
  const atV = (s, t) => { const Z = ZA - t; return [-22 + s, vaultY(Z) + 1.2, Z]; };
  raw(ashlar(atV, 44, ZA - 2.6, '#3a3a34', { scale: 0.8, rough: true, vary: 0.25, mortar: 0.65, courses: [0.5, 0.35, 0.45, 0.3, 0.55] }));
  // value: dark everywhere but round the grating
  for (let k = 0; k < 4; k++) raw(hatch3(atV, 0, 44, 0, ZA - 2.6, [0.8, -0.8, 0.2, -0.3][k], { op: 0.4, ragged: 0.3, keep: (s, t) => Math.hypot(-22 + s - BX, (ZA - t - BZ) * 1.4) > 1.2 + k * 1.3 }));
  // polish: groin ribs spring from each pier and sweep up and toward us over the room, curving (the vault reads as a vault)
  for (const X of [-12.2, -7.0, -1.6, 3.6, 7.2, 10.0]) for (const sd of [-1, 1]) { const pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10, Z = ZA - u * (ZA - 3.4); pts.push(P(X + sd * u * 2.4, 2.6 + (vaultY(Z) + 1.2 - 2.6) * Math.sin(u * Math.PI / 2), Z)); }
    raw(G.limb(pts, 14, 34, '#3e3c34', { hatch: false, litCol: '#8a8a76' }) + G.limb(pts.map(([x, y]) => [x - 3, y + 2]), 3, 7, mix('#4a4a40', BEAM, lit(X, 3, 8) * 0.3), { hatch: false, lit: false })); }
  // the drain grating in the vault over the beam: an iron grid, kelp trailing through it, the light beyond it
  const gz = BZ, gy = vaultY(gz) + 1.2, g = [[BX - 0.45, gz - 0.35], [BX + 0.45, gz - 0.35], [BX + 0.45, gz + 0.35], [BX - 0.45, gz + 0.35]].map(([x, z]) => P(x, vaultY(z) + 1.18, z));
  raw(`<path d="${p2(g)}" fill="#e0f0e4"/>`);
  for (let k = 1; k < 5; k++) { const x = BX - 0.45 + k * 0.18, A = P(x, gy, gz - 0.35), B = P(x, gy, gz + 0.35); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="3"/>`); }
  for (let k = 1; k < 3; k++) { const z = gz - 0.35 + k * 0.23, A = P(BX - 0.45, vaultY(z) + 1.18, z), B = P(BX + 0.45, vaultY(z) + 1.18, z); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="2.4"/>`); }
  raw(`<path d="${p2(g)}" fill="none" stroke="${INK}" stroke-width="3"/>` + I.kelp(BX + 0.2, gy - 0.02, gz, 0.5, { w: 0.03, col: '#1a2418' }) + I.kelp(BX - 0.25, gy - 0.02, gz, 0.35, { w: 0.025, col: '#1a2418' }));
}
// ---- the beam: from the grating to the floor, fine lines, a pale fill, dust and silt motes turning in it
{
  const top = P(BX, vaultY(BZ) + 1.15, BZ), foot = P(BX + 0.25, 0, BZ + 0.2), wT = K(BZ) * 0.9, wF = K(BZ) * 1.25;
  raw(G.shaft(top[0] - wT / 2, top[1], wT, foot[1] - top[1], (foot[0] - top[0]) / (foot[1] - top[1]), BEAM, { op: 0.35, fill: 0.16, spread: (wF - wT) / 2, gap: 3 }));
  raw(G.shaft(top[0] - wT * 0.2, top[1], wT * 0.4, foot[1] - top[1], (foot[0] - top[0]) / (foot[1] - top[1]), '#f4fff4', { op: 0.3, fill: 0.14, spread: 4, gap: 2.5 }));
  let m = ''; for (let k = 0; k < 60; k++) { const u = R(), x = top[0] + (foot[0] - top[0]) * u + (R() - 0.5) * (wT + (wF - wT) * u), y = top[1] + (foot[1] - top[1]) * u; m += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.4 + R() * 0.9)}" fill="#e8f4e8" opacity="${f1(0.3 + R() * 0.5)}"/>`; } raw(m);
  raw(glow(foot[0], foot[1] - 30, 190, 120, BEAM, 0.12));
}
// ---- the dark: stepped veils of murk, each cut back round the beam in a ragged disc (darkness with one beam)
const darkVeil = (ops) => { const c = P(BX + 0.1, 1.3, BZ); for (const [r, op] of ops) { const hole = []; for (let k = 0; k < 22; k++) { const a = k / 22 * 6.283, m = 0.85 + R() * 0.25; hole.push([c[0] + Math.cos(a) * r * m * 1.25, c[1] + Math.sin(a) * r * m * 0.8]); }
  raw(`<path fill-rule="evenodd" d="M-20 -20 H${W + 20} V${H + 20} H-20 Z ${smooth(hole, true, 0.6)}" fill="${MURK}" opacity="${op}"/>`); } };
darkVeil([[150, 0.22], [260, 0.24], [380, 0.24], [520, 0.22], [700, 0.2]]);
raw(BK.quiet(MURK, 300, 400, { steps: [0.08, 0.1, 0.12, 0.14], hop: 0.12 }));
raw(G.edges(MURK, { l: 260, r: 300, t: 60, steps: [0.18, 0.2, 0.22, 0.26] }));
// ---- the floor: worn flags under a skin of tide water; silt wrack and loose bones along the tide's reach; the beam's pool
{
  raw(G.flags(-12, 12, 3.2, ZA, '#3e3c36', { size: 0.8, cracks: 16, vary: 0.2, fog: (c, Z) => c }));
  // light the flags near the beam's foot: a pale pool on the wet stone, stepped, not a gradient
  for (const [r, op] of [[2.6, 0.06], [1.8, 0.08], [1.1, 0.1], [0.6, 0.12]]) { const pts = []; for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283, m = 0.85 + R() * 0.25; pts.push(P(BX + 0.25 + Math.cos(a) * r * m, 0.004, BZ + 0.2 + Math.sin(a) * r * 0.45 * m)); } raw(`<path d="${smooth(pts, true, 0.6)}" fill="${BEAM}" opacity="${op}"/>`); }
  raw(G.puddle(BX + 0.3, BZ + 0.3, 2.4, 0.9, '#0c1414', '#e4f4e4') + G.puddle(-8.2, 7.6, 1.6, 0.6, '#0a0e0e', '#6a7a70') + G.puddle(5.5, 8.2, 2.2, 0.7, '#0a0e0e', '#7a8a7e'));
  // the tide's wrack: a wandering line of silt, weed and small bones
  const wr = []; for (let X = -12; X <= 12; X += 0.5) wr.push(P(X, 0.006, 8.9 + Math.sin(X * 0.7) * 0.3 + R() * 0.15)); raw(line(wr, 3, '#3a3a2e', 0.7) + line(wr, 1, '#6a6650', 0.5));
  for (let k = 0; k < 40; k++) { const X = -12 + R() * 24, Z = 6.4 + R() * 3, [x, y] = P(X, 0.01, Z), l = K(Z) * (0.12 + R() * 0.2), a = R() * 3.14, col = shade(BONE, X, 0, Z); raw(`<path d="M${f1(x - Math.cos(a) * l / 2)} ${f1(y - Math.sin(a) * l * 0.15)} L${f1(x + Math.cos(a) * l / 2)} ${f1(y + Math.sin(a) * l * 0.15)}" stroke="${INK}" stroke-width="${f1(Math.max(1.4, K(Z) * 0.035))}" stroke-linecap="round"/><path d="M${f1(x - Math.cos(a) * l / 2)} ${f1(y - Math.sin(a) * l * 0.15)} L${f1(x + Math.cos(a) * l / 2)} ${f1(y + Math.sin(a) * l * 0.15)}" stroke="${col}" stroke-width="${f1(Math.max(0.7, K(Z) * 0.02))}" stroke-linecap="round"/>`); }
  raw(S.occBand((s, t) => [-12 + s, 0, ZA - t], 24, 1.2, { op: 0.4, cross: true }));
  darkVeil([[140, 0.2], [240, 0.22], [360, 0.22], [520, 0.2]]);
}

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  // a collapsed stack spilled out of the second bay onto the floor: skulls and long bones in a low heap, dark
  const Z = 9.0, pts = []; for (let k = 0; k <= 12; k++) { const t = k / 12, X = -11.5 + t * 4.6; pts.push(P(X, Math.sin(t * Math.PI) * (0.55 - t * 0.2) + (R() - 0.5) * 0.04, Z - Math.sin(t * Math.PI) * 0.5)); }
  raw(`<path d="${smooth([P(-11.8, 0, Z), ...pts, P(-6.6, 0, Z)], true, 0.4)}" fill="#1e1c16" stroke="${INK}" stroke-width="1"/>`);
  for (let k = 0; k < 34; k++) { const t = R(), X = -11.4 + t * 4.4, Y = R() * Math.max(0.05, Math.sin(t * Math.PI) * 0.5), Zb = Z - R() * 0.4, [x, y] = P(X, Y, Zb), r = K(Zb) * (R() < 0.3 ? 0.08 : 0.035), col = mix(BONE, MURK, 0.62);
    raw(R() < 0.3 ? `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.85)}" fill="${col}" stroke="${INK}" stroke-width="0.6"/><ellipse cx="${f1(x - r * 0.3)}" cy="${f1(y)}" rx="${f1(r * 0.25)}" ry="${f1(r * 0.22)}" fill="${INK}"/><ellipse cx="${f1(x + r * 0.35)}" cy="${f1(y)}" rx="${f1(r * 0.25)}" ry="${f1(r * 0.22)}" fill="${INK}"/>` : `<path d="M${f1(x - r * 3)} ${f1(y + (R() - 0.5) * r * 2)} L${f1(x + r * 3)} ${f1(y)}" stroke="${INK}" stroke-width="${f1(r * 1.3)}" stroke-linecap="round"/><path d="M${f1(x - r * 3)} ${f1(y)} L${f1(x + r * 3)} ${f1(y)}" stroke="${col}" stroke-width="${f1(r * 0.7)}" stroke-linecap="round"/>`); }
  // a bier left by the sisters, its pall rotted, low; a bucket and a broken lantern; kelp stranded by the tide
  const bz = 9.1; raw(cel([P(2.2, 0.55, bz), P(4.6, 0.55, bz), P(4.6, 0.62, bz), P(2.2, 0.62, bz)], { Z: bz, fill: '#2a241a', band: 0.8 }) + [2.3, 4.4].map(X => cel([P(X, 0, bz), P(X + 0.08, 0, bz), P(X + 0.08, 0.55, bz), P(X, 0.55, bz)], { Z: bz, fill: '#1e1a12' })).join(''));
  raw(`<path d="${smooth([P(2.1, 0.62, bz), P(3.2, 0.7, bz), P(4.7, 0.6, bz), P(4.8, 0.25, bz), P(4.3, 0.42, bz), P(3.4, 0.3, bz), P(2.5, 0.45, bz), P(2.0, 0.2, bz)], true, 0.5)}" fill="#2c2a22" stroke="${INK}" stroke-width="0.8"/>`);
  raw(I.kelp(6.2, 0, 8.6, -0.25, { w: 0.05, col: '#1a2016' }) + I.kelp(-4.6, 0, 8.8, -0.2, { w: 0.04, col: '#1a2016' }));
}

// ======================================================================== FORE: the near rib overhead, a skull-built pier left, the charnel grille right
layer('fore');
{
  // the near transverse rib across the top: the vault's own arch seen at Z 3, dark, voussoirs, a drip line
  const ZN = 3.0, pts = []; for (let X = -6; X <= 6; X += 0.5) pts.push([X, 2.05 + Math.pow(Math.abs(X) / 6, 2) * -0.6 + 0.6]);
  raw(`<path d="${p2([...pts.map(([x, y]) => P(x, y + 1.2, ZN)), ...pts.map(([x, y]) => P(x, y, ZN)).reverse()])}" fill="#15130f" stroke="${INK}" stroke-width="2.4"/>`);
  for (let k = 0; k < pts.length; k += 1) { const A = P(pts[k][0], pts[k][1], ZN), B = P(pts[k][0] * 1.05, pts[k][1] + 1.2, ZN); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="1.6"/>`); }
  raw(`<path d="${p2([...pts.map(([x, y]) => P(x, y + 1.2, ZN)), ...pts.map(([x, y]) => P(x, y, ZN)).reverse()])}" fill="${S.hatchA(3)}" opacity="0.6"/>`);
  for (let k = 0; k < 9; k++) { const p = pts[Math.floor(R() * pts.length)], A = P(p[0], p[1], ZN); raw(`<path d="M${f1(A[0])} ${f1(A[1])} l0 ${f1(3 + R() * 6)}" stroke="#6a7a70" stroke-width="1.2" opacity="0.5"/>`); }
  // the left: a pier faced with skulls set in mortar, rows of them, the near ones big; a bone candle-stand on it, cold
  const Zp = 4.1, at = (s, t) => [-5.6 + s, t, Zp];
  raw(`<path d="${pp([at(0, 0), at(1.35, 0), at(1.35, 4), at(0, 4)])}" fill="#17140f" stroke="${INK}" stroke-width="2"/>`);
  raw(ashlar(at, 1.35, 4, '#2a2620', { scale: 0.5, rough: true, vary: 0.2, mortar: 0.6 }));
  for (const [s0, t0] of [[0.35, 0.9], [0.55, 1.9], [0.3, 2.85]]) { const q = G.arch(-5.6 + s0, -5.6 + s0 + 0.5, t0 + 0.25, 'round', { n: 5 }).map(([x, y]) => P(x, y ? y : t0, Zp)); raw(`<path d="${p2(q)}" fill="#0a0908" stroke="${INK}" stroke-width="1.6"/>`);
    const [x, y] = P(-5.6 + s0 + 0.25, t0 + 0.12, Zp - 0.05), rr = K(Zp) * 0.1, col = mix(BONE, MURK, 0.55);
    raw(`<path d="${smooth([[x - rr, y + rr * 0.2], [x - rr * 0.9, y - rr * 0.5], [x, y - rr * 0.95], [x + rr * 0.9, y - rr * 0.5], [x + rr, y + rr * 0.2], [x + rr * 0.55, y + rr * 0.8], [x - rr * 0.55, y + rr * 0.8]], true, 0.5)}" fill="${col}" stroke="${INK}" stroke-width="1.2"/><path d="M${f1(x - rr * 0.62)} ${f1(y - rr * 0.05)} q${f1(rr * 0.25)} ${f1(-rr * 0.18)} ${f1(rr * 0.5)} ${f1(rr * 0.02)} l${f1(-rr * 0.08)} ${f1(rr * 0.3)} q${f1(-rr * 0.2)} ${f1(rr * 0.1)} ${f1(-rr * 0.4)} 0 Z" fill="${INK}"/><path d="M${f1(x + rr * 0.12)} ${f1(y - rr * 0.03)} q${f1(rr * 0.25)} ${f1(-rr * 0.2)} ${f1(rr * 0.5)} ${f1(-rr * 0.02)} l${f1(-rr * 0.05)} ${f1(rr * 0.3)} q${f1(-rr * 0.2)} ${f1(rr * 0.1)} ${f1(-rr * 0.42)} 0 Z" fill="${INK}"/><path d="M${f1(x - rr * 0.5)} ${f1(y + rr * 0.55)} l${f1(rr)} 0" stroke="${INK}" stroke-width="1" stroke-dasharray="1.5 1.5"/>`); }
  raw(hatch3(at, 0, 1.35, 0, 4, 0.8, { op: 0.4 }) + I.barnacles(...P(-5.0, 0.3, Zp), 22, 14, Zp, '#5a5648'));
  // the right: the charnel's iron grille gate standing half open, rusted, kelp caught in it; the brute keeps this door
  const Zg = 4.4, gx0 = 3.9, gx1 = 5.4, gp = []; for (let X = gx0; X <= gx1 + 0.01; X += 0.15) gp.push(X);
  for (const X of gp) { const A = P(X, 0, Zg + (X - gx0) * 0.5), B = P(X, 2.6, Zg + (X - gx0) * 0.5); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="5"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#3a2a20" stroke-width="2.4"/>`); }
  for (const Y of [0.3, 1.4, 2.5]) { const A = P(gx0, Y, Zg), B = P(gx1, Y, Zg + (gx1 - gx0) * 0.5); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="6"/><path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="#4a3426" stroke-width="3"/>`); }
  raw(I.kelp(4.4, 2.5, Zg + 0.3, 1.3, { w: 0.05, col: '#141a12' }) + I.kelp(5.0, 2.5, Zg + 0.55, 0.9, { w: 0.04, col: '#141a12' }));
  for (const [cx, sd] of [[70, -1], [W - 60, 1]]) { const pts2 = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts2.push([cx + sd * (t - 0.5) * 200, H - 12 - Math.sin(t * Math.PI) * (22 + R() * 8)]); } raw(G.rockMass([[cx - 110, H + 4], ...pts2, [cx + 110, H + 4]], 3.5, '#14120e', { fiss: 3, hop: 0.6 })); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
