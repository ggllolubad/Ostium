// World VI, the Stormwrack Coast: THE WRECK COVE (round 2, group g2). Room key 'coast_cove'.
// Contract as the nave: 1480 x 480 (shown at 2x); coast_cove_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Encounters here: The Eel Shallows (things that bite and things that shock), The Wreck (the bosun and his new crew). The
// Thunder Whale's fight has moved to coast_boss.
// The place (bible VI: "wreckage from the Drowned Kingdom washes up here"): a sea cave at the foot of the wreckers' cliff,
// at low water. The company stands on a shingle bar inside the cave; the eel shallows lie between them and the mouth. In
// the mouth, jammed between the walls where a surge drove her, lies a ship of the Drowned Kingdom, her bow thrust into the
// cave, her bronze fittings gone green, her figurehead (a crowned woman, eyes worn smooth) under the bowsprit; her masts
// are snapped and her rigging hangs in the water; a lantern burns on her rail where the bosun keeps his new crew. Beyond
// her the storm sea breaks white under the glare. The cave is dark; everything inside is lit from the mouth: wet rims,
// the glare laid in the water toward the company.
// Courses: LIGHTNING (burns ferned across the cave roof where strikes came down the wet rock, the ship's bronze fused in
// black welds, a fulgurite in the shingle); WATER (barnacle bands, kelp hanging plumb, everything running wet, the sea).
// Light: contre-jour from the cave mouth: cold grey-green glare behind the wreck; dark key inside. Lamp yellow only at the
// lantern.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VI');
const W = 1480, H = 480, ROOM = 'coast_cove';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2816, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#10161a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, EM } = S;
const BK = require('./battle_li')(S);
const MURK = '#0a0e10', AIR = '#2a3438';
const G = require('./battle_kit_g2')(S, BK, { murk: MURK, air: AIR, air0: 8, airD: 30, airMax: 0.5 });
const { line, polyS, timber } = G;
const { ell } = require('../engine');
const CAVE = { world: 'coast', lichen: 0, salt: 0.06, decay: 0.8 };   // inside a dark sea cave: no lichen, little salt
const SLATE = '#3a4246', SURF = '#e8ecea', LAMPY = '#e8c860', WET = '#c8d4d4', KELP = '#2e3624', VERD = '#4f7d6c', SKY = '#9aa6a8', WOOD = '#2a2622', GLARE = '#dce6e4';
// the cave mouth (screen outline): a tall ragged opening, its foot in the water at the horizon
const MOUTH = (() => { const base = [[330, 314], [348, 268], [332, 236], [356, 196], [340, 164], [384, 118], [418, 100], [446, 66], [500, 52], [538, 30], [600, 34], [650, 16], [712, 24], [770, 12], [826, 30], [880, 26], [934, 52], [990, 60], [1030, 96], [1078, 112], [1100, 150], [1136, 176], [1128, 214], [1158, 246], [1150, 280], [1176, 314]];
  const out = []; base.forEach(([x, y], i) => { const j = i && i < base.length - 1; out.push([x + (j ? (R() - 0.5) * 26 : 0), y + (j ? (R() - 0.5) * 22 : 0)]); if (j && i < base.length - 2 && R() < 0.45) { const [x2, y2] = base[i + 1], mx = (x + x2) / 2, my = (y + y2) / 2, nx = (760 - mx), ny = (170 - my), l = Math.hypot(nx, ny) || 1, d = 10 + R() * 26; out.push([mx + nx / l * d + (R() - 0.5) * 8, my + ny / l * d]); } }); return out; })();

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- plane 3: outside the mouth: the storm sky with its glare, the sea breaking white, rain
{
  const cid = S.id('mo'); raw(`<clipPath id="${cid}"><path d="${p2(MOUTH)}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(`<rect x="300" y="0" width="900" height="320" fill="${SKY}"/>`);
  raw(G.skyGrad(0, 320, [[0, '#4a5456'], [0.4, '#7a8688'], [0.75, '#b8c2c0'], [1, '#dce4e2']], { x: 300, w: 900 }));
  raw(glow(820, 220, 260, 110, '#f4f8f6', 0.6) + glow(820, 230, 110, 40, '#ffffff', 0.55));
  for (const [x, y, w, h, col, op] of [[560, 40, 420, 60, '#2e3638', 0.8], [960, 26, 380, 70, '#2a3234', 0.85], [760, 120, 300, 30, '#5a6668', 0.5]]) raw(G.softMass(x, y, w, h, col, { lit: '#e8eeec', dark: '#1a2022', op, litOp: 0.45 }));
  raw(BK.rain(260, { x0: 320, x1: 1180, y0: 0, y1: 300, slant: 0.3, len: 16, col: '#eef2f0', op: 0.35 }));
  // the sea beyond: swells and breakers on a reef, white under the glare
  raw(G.sea(-60, 60, 40, 400, '#4a5658', { y: -0.4, lit: '#e8eeec', foam: 0.25, amp: 0.15, step: 0.08 }));
  for (const [X, Z, w] of [[-8, 70, 10], [6, 90, 14], [-2, 55, 6]]) { const base = []; for (let kk = 0; kk <= 10; kk++) base.push(P(X - w / 2 + w * kk / 10, -0.4, Z)); raw(BK.line(base, 2, SURF, 0.8)); for (let kk = 0; kk < 12; kk++) { const [x, y] = base[Math.floor(R() * base.length)], l = 6 + R() * 14; raw(`<path d="M${f1(x)} ${f1(y)} q${f1(l * 0.2)} ${f1(-l * 0.8)} ${f1(l * 0.9)} ${f1(-l)}" stroke="${SURF}" stroke-width="1.2" fill="none" opacity="0.55"/>`); } }
  raw('</g>');
}
// ---- plane 2: the ship of the Drowned Kingdom jammed in the mouth, bow into the cave, in silhouette against the glare
{
  const hull = [[690, 302], [694, 262], [712, 222], [748, 196], [800, 184], [860, 172], [930, 164], [1000, 160], [1080, 158], [1150, 160], [1200, 166], [1200, 306], [1000, 316], [820, 318]];
  raw(cel(hull, { Z: 24, fill: '#2e3434', tex: 'url(#mottle)', texOp: 0.5, band: 8 }));
  const cid = S.id('hu'); raw(`<clipPath id="${cid}"><path d="${p2(hull)}"/></clipPath><g clip-path="url(#${cid})">`);
  const topY = x => x < 700 ? 300 : x < 800 ? 262 - (x - 694) * 0.74 : 184 - (x - 800) * 0.065;
  for (let j = 1; j < 14; j++) { const u = j / 14, pts = []; for (let x = 680; x <= 1210; x += 16) { const t = topY(x); pts.push([x, t + (316 - t) * u + Math.sin(x * 0.012 + j) * 1.5]); } raw(line(pts, 1, INK, 0.75) + line(pts.map(([x, y]) => [x, y - 1]), 0.7, '#8a9898', 0.35)); }
  for (let x = 720; x < 1200; x += 46 + R() * 30) raw(line([[x, topY(x) + 4], [x + 2, 300]], 0.7, INK, 0.4));
  // the wale and her bronze fittings gone green; a black weld where a strike fused them; gunports with lids hanging
  { const pts = []; for (let x = 700; x <= 1200; x += 16) pts.push([x, topY(x) + 40 + Math.max(0, 800 - x) * 0.1]); raw(line(pts, 6, INK, 1) + line(pts, 3.6, VERD, 0.9) + line(pts.map(([x, y]) => [x, y - 1.4]), 0.9, '#a8d0c0', 0.5)); }
  raw(`<path d="M960 ${f1(topY(960) + 36)} l14 -2 l4 8 l-12 3 Z" fill="#0a0a0a"/>`);
  for (const x of [880, 970, 1060, 1150]) { const y = topY(x) + 54; raw(`<rect x="${x - 9}" y="${f1(y)}" width="18" height="14" fill="#0a0c0c" stroke="${INK}" stroke-width="1"/>` + line([[x - 9, y + 14], [x - 13, y + 26]], 1.6, '#1a1e1e', 1)); }
  raw(`<rect x="680" y="284" width="540" height="40" fill="#1a2018" opacity="0.5"/>` + BK.blisters(950, 298, 230, 60, '#7a7e74', { size: 1.4, flat: 0.15 }));
  for (let i = 0; i < 14; i++) { const x = 720 + R() * 470; raw(line([[x, 282 + R() * 10], [x + 3, 296], [x - 2, 312 + R() * 8]], 2, KELP, 0.9)); }
  raw('</g>');
  // the stem: a curved cutwater at the bow, and the forecastle rail with its stanchions along the sheer, rim-lit
  raw(line([[690, 304], [692, 258], [712, 218], [748, 194]], 7, INK, 1) + line([[690, 304], [692, 258], [712, 218], [748, 194]], 4, '#3a3430', 1));
  { const rail = []; for (let x = 748; x <= 1200; x += 12) rail.push([x, topY(x) - 14]); raw(line(rail, 3, INK, 1) + line(rail, 1.4, '#4a4440', 1)); for (let x = 760; x < 1200; x += 28) raw(line([[x, topY(x)], [x, topY(x) - 14]], 1.4, INK, 1)); }
  raw(line(hull.slice(1, 11).map(([x, y]) => [x, y - 1]), 1.6, GLARE, 0.6));
  // an anchor hanging at the bow on its chain, fluke in the water
  raw(BK.chain([742, 204], [736, 292], 0, 3, '#2a2e2e') + `<path d="M720 296 Q736 312 752 296 M736 292 L736 312" stroke="${INK}" stroke-width="4" fill="none"/><path d="M720 296 Q736 312 752 296" stroke="${VERD}" stroke-width="2" fill="none"/>`);
  // the bowsprit thrust into the cave, its jib boom snapped; the figurehead under it, a crowned woman, worn smooth
  raw(line([[760, 192], [560, 96]], 9, INK, 1) + line([[760, 192], [560, 96]], 6, '#2e2a26', 1) + line([[760, 192], [560, 96]].map(([x, y]) => [x, y - 2]), 1, GLARE, 0.45));
  raw(line([[580, 106], [520, 84], [500, 92]], 4, INK, 1));
  { // the figurehead: a crowned woman leaning out from the stem under the bowsprit, arms crossed, worn smooth by the sea
    const torso = [[706, 248], [699, 236], [693, 222], [690, 208], [694, 200], [701, 201], [707, 213], [713, 229], [716, 244]];
    raw(cel(torso, { Z: 20, fill: '#4a4440', band: 3, tex: 'url(#mottle)', texOp: 0.4 }) + cel(ell([691, 193], 5, 6.2, -0.3, 12), { Z: 20, fill: '#4e4844', band: 1.5 }));
    raw(`<path d="M685 188 l1 -5 l2 3 l2 -5 l2 4 l2 -4 l1 6" stroke="${INK}" stroke-width="2.4" fill="none"/><path d="M685 188 l1 -5 l2 3 l2 -5 l2 4 l2 -4 l1 6" stroke="${VERD}" stroke-width="1.2" fill="none"/>`);
    raw(line([[693, 214], [704, 211], [709, 219]], 1.6, INK, 0.8) + line([[692, 202], [691, 210], [695, 222], [701, 236], [705, 246]], 1, GLARE, 0.5) + line([[688, 196], [689, 214], [696, 234], [700, 250]], 1.8, '#3a3430', 0.9)); }
  // the masts snapped, leaning, rigging hanging into the water
  for (const [x0, y0, x1, y1] of [[900, 160, 860, 20], [1080, 150, 1140, 40]]) { raw(line([[x0, y0], [x1, y1]], 8, INK, 1) + line([[x0, y0], [x1, y1]], 5, '#2a2622', 1) + `<path d="M${x1 - 5} ${y1 + 2} l3 -8 l3 6 l4 -7" stroke="${INK}" stroke-width="1.4" fill="none"/>`); for (let j = 0; j < 4; j++) raw(line([[x1 + (x0 - x1) * (0.1 + j * 0.1), y1 + (y0 - y1) * (0.1 + j * 0.1)], [x1 + (j - 1.5) * 40, 300 + R() * 10]], 0.9, INK, 0.8)); }
  // the bosun's lantern on her rail, lamp yellow
  raw(G.lantern(800, 176, 11, { r: 8, gop: 0.4 }));
}
// ---- the cave: sea-worn slate round the mouth, laminated, barnacle bands, kelp plumb; rims wet with the mouth's light;
// a burn ferned across the roof
{
  const cid = S.id('cv'); raw(`<clipPath id="${cid}"><path fill-rule="evenodd" d="M-20 -20 L${W + 20} -20 L${W + 20} 330 L-20 330 Z ${p2(MOUTH)}"/></clipPath><g clip-path="url(#${cid})">`);
  // the cave wall in three overlapping masses (left, roof, right), each with its own banding
  raw(G.smoothRock([[-20, 340], [-20, -20], [760, -20], [520, 30], [400, 80], [340, 180], [330, 340]], 14, '#232a2e', { dir: 'h', rib: 8, wave: 5, flank: 0.2, rim: false }));
  raw(G.smoothRock([[600, -20], [W + 20, -20], [W + 20, 340], [1180, 340], [1150, 220], [1090, 120], [960, 50], [760, 20]], 14, '#1e2528', { dir: 'h', rib: 8, wave: 5, flank: 0.5, rim: false }));
  for (let k2 = 0; k2 < 60; k2++) { const x = R() * W, y = R() * 300; raw(line([[x, y], [x + 18 + R() * 30, y + (R() - 0.5) * 6]], 0.8, INK, 0.4)); }
  raw(`<rect x="-20" y="248" width="${W + 40}" height="90" fill="#1a2018" opacity="0.45"/>` + BK.blisters(200, 290, 180, 50, '#6e6e64', { size: 1.4, flat: 0.15 }) + BK.blisters(1320, 284, 150, 40, '#6e6e64', { size: 1.4, flat: 0.15 }));
  for (let i = 0; i < 30; i++) { const x = R() * W, y0 = 20 + R() * 220; if (x > 340 && x < 1160 && y0 > 40) continue; raw(line([[x, y0], [x + 3, y0 + 15], [x - 2, y0 + 30 + R() * 40]], 1.4 + R(), '#1e2618', 0.9)); }
  raw(BK.scorch((s2, t) => [s2, 4.5 + t * 0.2, 12 + t], -6, 0, 5, 0.3, { w: 0.07, depth: 4, col: '#0a0c0e', halo: '#a8b0b4', haloOp: 0.22 }));
  raw(G.frameDark(820, 180, 640, 300, [[1.0, 0.3], [0.85, 0.26], [0.7, 0.2]]));
  raw('</g>');
  // rock left standing in the mouth: a fin at the left foot and teeth hanging from the lip, black against the glare
  raw(G.smoothRock([[330, 316], [344, 270], [368, 236], [384, 196], [404, 214], [416, 262], [430, 316]], 26, '#141a1c', { wx: CAVE, dir: 'h', rib: 5, flank: 0.4, rimCol: GLARE, rimOp: 0.7 }));
  for (const [x, w, l] of [[520, 34, 40], [620, 22, 26], [700, 40, 52], [870, 28, 30], [990, 36, 44]]) { const top = MOUTH.reduce((m, [mx, my]) => Math.abs(mx - x) < Math.abs(m[0] - x) ? [mx, my] : m, [9999, 0])[1] - 6; raw(G.smoothRock([[x - w / 2, top - 4], [x + w / 2, top - 4], [x + w * 0.3, top + l * 0.6], [x + w * 0.05, top + l], [x - w * 0.25, top + l * 0.7]], 20, '#161c1e', { wx: CAVE, dir: 'v', rib: 4, flank: 0.4, rimCol: GLARE, rimOp: 0.6 }) + line([[x + w * 0.05, top + l], [x + w * 0.05, top + l + 6 + R() * 10]], 1, WET, 0.5)); }
  // the mouth's rim lit by the glare: a broken wet line all round
  raw(line(MOUTH, 3, INK, 1) + line(MOUTH.map(([x, y]) => [x + (x < 760 ? -2 : 2), y]), 1.4, GLARE, 0.55));
}
// ---- the shallows inside the cave: dark green-grey water, the glare laid in it in broken strokes toward the company,
// eel wakes, rain rings near the mouth
{
  const PY = -0.25, z0 = 8.2, z1 = 40;
  raw(BK.water(-30, 30, z0, z1, '#1e2a2a', { y: PY, n: 260, lite: '#7a8c8a' }));
  for (let y = 312; y < 404; y += 2 + R() * 3) { const u = (y - 312) / 92, w = 40 + u * 220, x = 820 + (R() - 0.5) * w; raw(`<path d="M${f1(x - w * 0.15)} ${f1(y)} l${f1(w * (0.1 + R() * 0.25))} 0" stroke="${GLARE}" stroke-width="${f1(0.8 + u * 1.2)}" opacity="${f1(0.35 * (1 - u * 0.6) + R() * 0.15)}"/>`); }
  for (const [X, Z] of [[-3.0, 12], [4.2, 14.5], [1.0, 18]]) { const pts = []; for (let k2 = 0; k2 <= 10; k2++) pts.push(P(X + k2 * 0.25, PY, Z + Math.sin(k2 * 0.9) * 0.3)); raw(line(pts, 1, '#a8b8b6', 0.5)); }
}
raw(BK.quiet(MURK, 238, 352, { steps: [0.12, 0.16, 0.2, 0.24], hop: 0.16 }));
// ---- the shingle bar the company stands on: wet pebbles, wrack, a fulgurite, the wreckers' cache on a shelf at the left
{
  const at = (s, t) => [-30 + s, 0, 3.6 + t], Lz = 4.8;
  raw(`<path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="#3a3e3c"/><path d="${pp([at(0, 0), at(60, 0), at(60, Lz), at(0, Lz)])}" fill="url(#mottle)" opacity="0.5"/>`);
  for (let i = 0; i < 420; i++) { const X = -14 + R() * 28, Z = 3.8 + Math.pow(R(), 0.8) * (Lz - 0.2), [x, y] = P(X, 0, Z), r = K(Z) * (0.025 + R() * 0.07); raw(cel(ell([x, y - r * 0.3], r, r * 0.55, (R() - 0.5) * 0.5, 7), { Z, fill: tone(R() < 0.7 ? '#4a5254' : '#6a6a60', 0.25), band: 0.6, inkW: 0.4, heavy: 0.6 }) + (R() < 0.2 ? line([[x - r * 0.4, y - r * 0.5], [x, y - r * 0.6]], 0.6, GLARE, 0.5) : '')); }
  // the bar's edge where the water laps: a foam lace line
  { const pts = []; for (let X = -14; X <= 14; X += 0.4) pts.push(P(X, -0.1, 8.4 + Math.sin(X * 0.7) * 0.2)); raw(line(pts, 1.4, '#c8d0ce', 0.6) + line(pts.map(([x, y]) => [x, y + 2]), 0.8, INK, 0.5)); }
  for (let k2 = 0; k2 < 30; k2++) { const X = -12 + k2 * 0.8, Z = 7.6 + Math.sin(k2) * 0.3, [x, y] = P(X, 0.01, Z), l = K(Z) * 0.4; raw(`<path d="M${f1(x - l / 2)} ${f1(y)} q${f1(l / 3)} -2 ${f1(l)} ${f1(R() * 2)}" stroke="${KELP}" stroke-width="${f1(Math.max(1, K(Z) * 0.05))}" fill="none"/>`); }
  raw(BK.scorch((s2, t) => [s2, 0.01, t], -2.4, 5.4, 1.2, 0.3, { w: 0.05, depth: 3, col: '#1a1a18', halo: '#a8b0a8', haloOp: 0.25 }));
  raw(S.occBand((s2, t) => [-30 + s2, 0, 3.6 + Lz - t], 60, 0.6, { op: 0.25 }));
}

// ======================================================================== MID: the wreckers' cache, low and dark
layer('mid');
{
  const Z = 9.2, k = K(Z);
  { const c = P(-8.2, 0, Z); raw(cel([[c[0] - k * 0.4, c[1]], [c[0] + k * 0.4, c[1]], [c[0] + k * 0.42, c[1] - k * 0.45], [c[0] - k * 0.38, c[1] - k * 0.47]], { Z, fill: '#2a2620', tex: 'url(#mottle)', texOp: 0.5 }) + line([[c[0] - k * 0.4, c[1] - k * 0.25], [c[0] + k * 0.42, c[1] - k * 0.24]], 1.2, INK, 0.8)); }
  { const c = P(-7.0, 0, Z + 0.3); raw(G.keg(c[0], c[1], k * 0.55, { Z, col: '#2e2820' })); }
  { const a = P(6.4, 0.02, Z), b = P(7.8, 0.4, Z + 0.4); raw(line([a, b], 2.6, INK, 1) + line([a, b], 1.4, '#3a3028', 1)); }
}

// ======================================================================== FORE: the cave's near lip across the top with kelp and drips; dark
// barnacled rocks low at both sides
layer('fore');
{
  raw(G.smoothRock([[-20, -20], [W + 20, -20], [W + 20, 40], [1240, 54], [1060, 30], [820, 44], [560, 24], [300, 46], [120, 30], [-20, 60]], 3, '#1a2024', { wx: CAVE, dir: 'h', rib: 6, flank: 0.3, rimCol: GLARE, rimOp: 0.4 }));
  for (let i = 0; i < 16; i++) { const x = R() * W, y = 30 + R() * 20, l = 20 + R() * 60; raw(line([[x, y], [x + 4, y + l * 0.4], [x - 3, y + l * 0.75], [x + 1, y + l]], 2 + R() * 2, '#1a2014', 0.95)); }
  for (let i = 0; i < 20; i++) { const x = R() * W; raw(`<path d="M${f1(x)} ${f1(50 + R() * 10)} l0 ${f1(6 + R() * 10)}" stroke="${WET}" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>`); }
  raw(G.smoothRock([[-20, H + 10], [-20, 340], [40, 330], [110, 362], [170, 420], [220, H + 10]], 3, '#20282c', { wx: CAVE, dir: 'h', rib: 7, flank: 0.4, rimCol: GLARE, rimOp: 0.45 }) + BK.blisters(90, 420, 70, 26, '#7a7e74', { size: 3 }));
  raw(G.smoothRock([[W + 20, H + 10], [W + 20, 350], [W - 60, 360], [W - 140, 410], [W - 200, H + 10]], 3, '#1e262a', { wx: CAVE, dir: 'h', rib: 7, flank: 0.3, rimCol: GLARE, rimOp: 0.4 }) + BK.blisters(W - 80, 430, 60, 20, '#7a7e74', { size: 3 }));
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
