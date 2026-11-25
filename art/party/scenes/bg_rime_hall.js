// World VIII, the Sundered Rime: THE JARL'S HALL (battle room, Living Ink). Room key 'rime_hall'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Glass Gate (a shieldmaiden holds the hall; the steam behind her is watching), The Thane's Hall (a giant
// at the hearth, and his shieldmaiden).
// The place: the mead-hall of the hold, looking down its length. Two rows of carved posts carry the roof; the rafters
// climb into the smoke. The long hearth burns down the middle, the cauldron on its chain over it, and its fire is the
// room's light: it lights the posts' inner faces, the shields, the roof's underside through the smoke. The floor split
// when the fire came up: a glowing crack runs the hall's length; on its left the hall froze (rime on the posts and benches,
// icicles from the tie-beams, a tapestry frozen stiff), on its right it burned (charred posts split with seams, a
// tapestry burnt to its rod). At the far end, the Glass Gate: the hall's great doors fused into one sheet of black
// obsidian glass with fire glowing in its cracks.
// Courses: FIRE (the hearth, the split, char, seams, ash, the glass gate); FROST (rime, icicles, the frozen side).
// Palette: orange and black (the world's warm key), ice white on the cold side, timber; no red, no gold, no eyes.
// Usage: node scenes/bg_rime_hall.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VIII');
const W = 1480, H = 480, ROOM = 'rime_hall';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 8404, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#ffe8c8', shadowTint: '#140c08' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#2a1a12', murk: '#0e0806' });
const { BK, BL, air, glare, plates, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, seam, seamTree, ash, steam, icicles, rime, box, post, beam, char } = BK;

const TIM = '#4a3626', TIMD = '#2a1e16', CHAR = '#1a120e', OBS = '#121014', OBS2 = '#2a2630', OR = '#ff8a2a', HOT = '#ffd98a', EMB = '#c24e14', FROST = '#d8e6ee', MURK = '#0e0806', STONE = '#5a524a';
const ZG = 33, WX = 8, WY = 3.4, RY = 9.8, PXr = 4.6;            // the gate wall, the side walls, the wall plate, the ridge, post rows
const POSTZ = [8.6, 12.2, 15.8, 19.4, 23, 26.6, 30.2];
const roofY = X => WY + (WX - Math.abs(X)) / WX * (RY - WY);
const SPLIT = Z => -2.2 + 0.5 * Math.sin(Z * 0.4) + 0.2 * Math.sin(Z * 1.3);  // the crack's X along the hall
const dk = (c, Z) => air(c, Z, { z0: 10, z1: 50, max: 0.55 });
const fireAt = [0, 0.5, 18];                                    // the hearth's middle (for the warm light on surfaces)
const warm = (c, p, k = 1) => { const d = Math.hypot(p[0] - fireAt[0], p[1] - fireAt[1], p[2] - fireAt[2]); return mix(c, '#ff9a4a', Math.max(0, Math.min(0.45, (1 - d / 14) * 0.5)) * k); };

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the roof: rafters climbing to the ridge, boards between them, smoke filling it, the fire's light on its underside
{
  for (const sg of [-1, 1]) {
    const at = (s, t) => { const X = sg * (WX - t), Y = roofY(X); return [X, Y, 4 + s]; };
    raw(fillP([at(0, 0), at(ZG - 4, 0), at(ZG - 4, WX), at(0, WX)].map(p => P(...p)), TIMD));
    raw(S.boards((s, t) => at(s, t), ZG - 4, WX, '#2e2018', { bw: 0.4, knots: 0.1, nails: false, vary: 0.15, segs: 6 }));
    raw(hatch3(at, 0, ZG - 4, 0, WX, 0.6, { op: 0.4 }) + hatch3(at, 0, ZG - 4, 0, WX, -0.7, { op: 0.3 }));
    for (let Z = 5; Z < ZG; Z += 1.8) raw(beam([sg * WX, WY, Z], [0, RY, Z], 0.28, warm(dk(TIM, Z), [sg * 3, 6, Z], 0.6)));
  }
  // the ridge beam and the smoke hole over the hearth: a dark square opening with a grey night beyond, snow sifting
  raw(beam([0, RY, 4], [0, RY, ZG], 0.4, TIMD));
  { const q = [P(-1.2, RY - 0.4, 16.5), P(1.2, RY - 0.4, 16.5), P(1.2, RY - 0.4, 19.5), P(-1.2, RY - 0.4, 19.5)]; raw(fillP(q, '#1a2028') + inkP(q, 1.2) + BL.icicles(q[0], q[1], 6, { max: 10, col: FROST })); }
  // the smoke: banks of it hanging under the roof, lit warm from below where the fire is, cold toward the frozen side
  for (let i = 0; i < 9; i++) { const Z = 10 + R() * 18, X = -4 + R() * 8, c = P(X, 6 + R() * 2, Z); raw(BL.bank(c[0] - K(Z) * 5, c[0] + K(Z) * 5, c[1], K(Z) * 1.2, { col: mix('#8a6a54', '#5a5a60', Math.max(0, -X / 6)), op: 0.16, soft: true, ph: i })); }
}
// ---- the side walls: vertical staves, tapestries hung on them (frozen stiff on the left, burnt to the rod on the right)
for (const sg of [-1, 1]) {
  const at = (s, t) => [sg * WX, t, 4 + s];
  raw(S.boards((s, t) => [sg * WX, s, 4 + t], WY, ZG - 4, dk(sg < 0 ? '#3a3a3c' : '#2a1c14', 14), { bw: 0.3, segs: 1, knots: 0.2, nails: false, vary: 0.15 }));
  raw(hatch3(at, 0, ZG - 4, 0, WY, 0.7, { op: 0.4 }));
  for (const [z0, z1] of [[9.5, 12], [13.5, 16], [21, 23.5]]) {
    const rod = [P(sg * (WX - 0.1), 2.9, z0), P(sg * (WX - 0.1), 2.9, z1)];
    raw(pline(rod, 2.4, INK) + pline(rod, 1.2, '#5a4a36'));
    if (sg < 0) { const q = [P(-WX + 0.12, 2.85, z0 + 0.1), P(-WX + 0.12, 2.85, z1 - 0.1), P(-WX + 0.12, 0.8, z1 - 0.1), P(-WX + 0.12, 0.7, z0 + 0.1)]; raw(cel(q, { Z: z0, fill: dk('#3a4048', z0), band: 2 }) + fillP(q, 'url(#mottle)', 0.5)); for (const Y of [2.5, 1.2]) raw(pline([P(-WX + 0.13, Y, z0 + 0.1), P(-WX + 0.13, Y, z1 - 0.1)], Math.max(1, K(z0) * 0.08), dk('#5a5a4a', z0), 0.8)); for (let i = 0; i < 14; i++) { const zz = z0 + 0.15 + (z1 - z0 - 0.3) * i / 13, t = P(-WX + 0.12, 0.75, zz); raw(pline([t, [t[0], t[1] + K(z0) * 0.12]], 0.8, dk('#5a5a4a', z0))); }
      for (let i = 0; i < 3; i++) { const u = (i + 0.5) / 3, a = P(-WX + 0.12, 2.5, z0 + (z1 - z0) * u), b = P(-WX + 0.12, 1.2, z0 + (z1 - z0) * u); raw(line([a, b], 1.4, dk('#8a9aa4', z0), 0.6)); }
      raw(BL.rimeEdge([q[0], q[1]], { w: 1.4, col: FROST }) + BL.icicles(q[3], q[2], 5, { max: K(z0) * 0.2, col: FROST })); }
    else { const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(P(WX - 0.12, 2.85 - 0.5 * (0.5 + 0.5 * Math.sin(i * 2.1)) - R() * 0.3, z0 + (z1 - z0) * t)); } raw(fillP([rod[0], rod[1], ...pts.slice().reverse()], dk('#3a2418', z0)) + line(pts, 1.4, CHAR) + EM(line(pts.filter((_, i) => i % 2), 0.8, EMB, 0.8))); }
  }
}
// ---- the gate wall at the far end, and THE GLASS GATE: the great doors fused into one sheet of black glass, run in ropes
// and drips, its cracks glowing; steam leaking from its foot
{
  const at = (s, t) => [-WX + s, t, ZG];
  raw(S.boards((s, t) => [-WX + t, s, ZG], RY, WX * 2, dk(TIM, ZG), { bw: 0.3, segs: 1, knots: 0.2, nails: false, vary: 0.15 }));
  const gw = [[-2.2, 0], [2.2, 0], [2.2, 3.8], [0, 4.4], [-2.2, 3.8]].map(([x, y]) => P(x, y, ZG - 0.05));
  raw(GLOW(`<ellipse cx="${f1(P(0, 2, ZG)[0])}" cy="${f1(P(0, 2, ZG)[1])}" rx="90" ry="60" fill="${OR}" opacity="0.25" filter="url(#soft)"/>`));
  raw(cel(gw, { Z: ZG, fill: OBS, band: 2 }) + fillP(gw, '#2a2630', 0.5));
  // the run glass: vertical ropes and drips of black glass with sharp highlights
  for (let i = 0; i < 9; i++) { const X = -2 + i * 0.5 + (R() - 0.5) * 0.2, a = P(X, 3.6 + R() * 0.5, ZG - 0.08), b = P(X + (R() - 0.5) * 0.2, 0.1 + R() * 0.8, ZG - 0.08); raw(line([a, b], 2.4, '#08070a') + line([[a[0] - 0.8, a[1] + 2], [b[0] - 0.8, b[1] - 2]], 0.7, '#8a98a8', 0.6)); }
  { const pts = []; for (let i = 0; i <= 8; i++) pts.push(P(-1.6 + i * 0.4 + (R() - 0.5) * 0.2, 0.4 + 3 * (0.5 + 0.5 * Math.sin(i * 1.3)), ZG - 0.09)); raw(EM(seam(pts, 1.1, { glowW: 6, glowOp: 0.25 }))); }
  for (let i = 0; i < 4; i++) { const c = P(-1.6 + R() * 3.2, 1 + R() * 2.4, ZG - 0.09); raw(EM(seamTree(c[0], c[1], -Math.PI / 2 + (R() - 0.5), 10 + R() * 10, 0.8, { glowOp: 0.08 }, 1))); }
  raw(inkP(gw, 1.6) + steam(...P(-1.2, 0.2, ZG - 0.3), 50, { n: 2, op: 0.22 }) + steam(...P(1.4, 0.2, ZG - 0.3), 40, { n: 2, op: 0.2 }));
  // the lintel and jambs of the old door frame, charred, with carved beasts
  for (const X of [-2.5, 2.5]) raw(post(X, ZG - 0.2, 0.25, 0, 4.4, dk(CHAR, ZG), { shadeOp: 0.4 }));
  raw(beam([-3, 4.5, ZG - 0.25], [3, 4.5, ZG - 0.25], 0.4, dk(CHAR, ZG)));
}
// ---- the floor: packed earth and flags, the benches along both sides, the long hearth down the middle, the split
{
  const at = (s, t) => [-WX + t, 0, 4 + s];
  raw(fillP([at(0, 0), at(ZG - 4, 0), at(ZG - 4, WX * 2), at(0, WX * 2)].map(p => P(...p)), '#2a2018'));
  raw(BK.flags(-WX, WX, 4.0, ZG, '#4a3e34', { depth: 0.9, width: 1.2, missing: 0.05, cracks: 0.15, vary: 0.15, fogK: 0.5 }));
  // the warm light of the fire on the floor round the hearth (painted), the cold side washed blue
  raw(GLOW(`<ellipse cx="${f1(P(0, 0, 16)[0])}" cy="${f1(P(0, 0, 16)[1])}" rx="320" ry="40" fill="${OR}" opacity="0.22" filter="url(#soft)"/>`));
  { const L = []; for (let Z = 4; Z <= ZG; Z += 1) L.push(P(SPLIT(Z), 0.005, Z)); raw(fillP([P(-WX, 0, 4), ...L, P(-WX, 0, ZG)], '#6a8aa0', 0.18)); }
  // frost on the cold side's floor, ash and embers on the hot side
  for (let i = 0; i < 40; i++) { const Z = 4.5 + Math.pow(R(), 0.8) * 26, X = -WX + 0.3 + R() * (SPLIT(Z) + WX - 0.6), c = P(X, 0.01, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * (0.3 + R() * 0.6), k * 0.05, 9, 0.5), FROST, 0.35)); }
  raw(ash(60, P(0, 0, 9)[0], W, 330, 470, { r: 1.6, op: 0.4 }));
  // the benches along both sides, low, with their sleeping furs: rimed on the left, charred on the right
  for (const sg of [-1, 1]) { raw(box(sg < 0 ? -WX + 0.2 : WX - 1.5, sg < 0 ? -WX + 1.5 : WX - 0.2, 0, 0.45, 7, ZG - 1, { col: dk(sg < 0 ? '#4a4c50' : CHAR, 14), shadeOp: 0.5 }));
    const e = [P(sg * (WX - 1.5), 0.47, 7), P(sg * (WX - 1.5), 0.47, ZG - 1)]; raw(sg < 0 ? BL.rimeEdge(e, { w: 2, col: FROST }) + BL.icicles([e[0][0], e[0][1] + 2], [e[1][0], e[1][1] + 2], 14, { max: 8, col: FROST }) : EM(seam(jag(e[0], e[1], 10, 1), 0.8, { glowOp: 0.1 }))); }
}
// ---- the split: a glowing crack the length of the hall, wide near us, narrowing to the gate; steam where it meets the
// frozen side; rime crusting its cold lip
{
  const top = [], bot = []; for (let Z = 4.2; Z <= ZG - 0.5; Z += 0.5) { const w = 0.08 + 0.18 * Math.pow(1 - (Z - 4) / (ZG - 4), 1.5); top.push(P(SPLIT(Z) - w, 0.005, Z)); bot.push(P(SPLIT(Z) + w, 0.005, Z)); }
  const wedge = [...top, ...bot.slice().reverse()];
  raw(EM(fillP(wedge, EMB) + fillP(wedge.map(([x, y]) => [x, y]), OR, 0.7)) + inkP(wedge, 1.2));
  raw(EM(line(top.map((p, i) => [(p[0] + bot[i][0]) / 2, (p[1] + bot[i][1]) / 2]), 1.2, HOT, 0.9)));
  raw(GLOW(line(top, 14, OR, 0.12, ' filter="url(#soft)"')));
  raw(rime(top.filter((_, i) => i % 2 === 0).slice().reverse(), 10, { th: 2.4, col: FROST }));
  // a crust of cooled black slag floating on the split's near, wide part, in broken plates, the glow between them
  for (let i = 0; i < 26; i++) { const Z = 4.3 + Math.pow(R(), 1.4) * 8, w2 = 0.08 + 0.18 * Math.pow(1 - (Z - 4) / (ZG - 4), 1.5), X = SPLIT(Z) + (R() - 0.5) * w2 * 1.4, c = P(X, 0.006, Z), k2 = K(Z); raw(fillS(blob(c[0], c[1], k2 * w2 * (0.4 + R() * 0.4), k2 * 0.03, 7, 0.5), '#2a1a12', 0.95) + pline([[c[0] - k2 * w2 * 0.3, c[1] - 1], [c[0] + k2 * w2 * 0.2, c[1] - 1]], 0.6, '#6a5a50', 0.6)); }
  for (let i = 0; i < 6; i++) { const p = top[4 + Math.floor(R() * (top.length - 6))]; raw(steam(p[0], p[1], 30 + R() * 40, { n: 2, op: 0.2 })); }
}
// ---- the posts: two rows of carved posts carrying the roof; the left row rimed (icicles from the tie-beams), the right
// row charred and split with seams; tie-beams across, round shields hung on the posts' inner faces, lit by the hearth
for (const Z of POSTZ.slice().reverse()) {
  for (const sg of [-1, 1]) {
    const X = sg * PXr, top = roofY(X), col = sg < 0 ? warm(dk('#5a5652', Z), [X, 1, Z], 0.7) : dk(CHAR, Z);
    raw(post(X, Z, 0.22, 0, top, col, { shadeOp: 0.5 }));
    // interlace carving bands, the worn beast heads at the top
    for (const Y of [3.2, 1.6]) { const a = P(X - 0.22, Y, Z - 0.23), b = P(X + 0.22, Y + 0.4, Z - 0.23); let d = ''; for (let k = 0; k < 3; k++) { const y = a[1] + (b[1] - a[1]) * k / 3; d += `M${f1(a[0])} ${f1(y)} C${f1(a[0] + (b[0] - a[0]) * 0.4)} ${f1(y - 5)} ${f1(b[0] - (b[0] - a[0]) * 0.4)} ${f1(y + 4)} ${f1(b[0])} ${f1(y - 2)} `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="0.8" fill="none" opacity="0.7"/>`); }
    if (sg < 0) { const pts = []; for (let k = 0; k <= 10; k++) pts.push(P(X - 0.22, k * top / 10, Z - 0.23)); raw(rime(pts.reverse(), Z, { th: Math.max(1.6, K(Z) * 0.06), col: FROST })); }
    else { const a = P(X, 0.3, Z - 0.23), b = P(X + 0.05, 3.6, Z - 0.23); raw(EM(seam(jag(a, b, 8, K(Z) * 0.03), Math.max(0.6, K(Z) * 0.025), { glowW: 5, glowOp: 0.12 })) + ash(5, a[0] - 10, a[0] + 10, b[1], a[1], { r: 1.2, op: 0.4 })); }
    // a round shield on the post's inner face (toward the hearth), lit warm, rimed or scorched
    if (Z < 24) { const c = P(X - sg * 0.25, 2.3, Z), r = K(Z) * 0.42; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.45)}" ry="${f1(r)}" fill="${sg < 0 ? warm(dk('#7a7268', Z), [X, 2, Z]) : dk('#2a1a12', Z)}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.13)}" ry="${f1(r * 0.28)}" fill="${dk('#3a3a38', Z)}" stroke="${INK}" stroke-width="0.8"/>`); for (let k = 0; k < 4; k++) raw(pline([[c[0] - r * 0.4, c[1] - r * 0.7 + k * r * 0.45], [c[0] + r * 0.4, c[1] - r * 0.7 + k * r * 0.45 + 1]], 0.6, INK, 0.4)); if (sg < 0) raw(BL.icicles([c[0] - r * 0.3, c[1] + r * 0.85], [c[0] + r * 0.3, c[1] + r * 0.95], 3, { max: K(Z) * 0.2, col: FROST })); }
  }
  // the tie-beam across between the posts, rimed on its left half, charred on its right; icicles off the cold half
  const a = P(-PXr, 4.3, Z), b = P(PXr, 4.3, Z);
  raw(beam([-PXr, 4.3, Z], [PXr, 4.3, Z], 0.3, warm(dk(TIM, Z), [0, 4, Z], 0.6)));
  raw(BL.rimeEdge([[a[0], a[1] - K(Z) * 0.15], [(a[0] + b[0]) / 2 - 10, a[1] - K(Z) * 0.15]], { w: Math.max(1, K(Z) * 0.05), col: FROST }) + BL.icicles([a[0], a[1] + K(Z) * 0.15], [(a[0] + b[0]) / 2 - 20, a[1] + K(Z) * 0.15], 8, { max: K(Z) * 0.3, col: FROST }) + EM(seam(jag([(a[0] + b[0]) / 2 + 20, b[1] + K(Z) * 0.1], [b[0], b[1] + K(Z) * 0.1], 6, 1), Math.max(0.6, K(Z) * 0.02), { glowOp: 0.1 })));
}
// ---- the long hearth: a stone kerb down the middle, the fire burning along it in low tongues, the cauldron on its chain
// from a tie-beam, embers and ash; its light lies on everything near it
{
  const z0 = 10.5, z1 = 27;
  for (let Z = z0; Z <= z1; Z += 0.45) for (const sg of [-1, 1]) { const c = P(sg * 0.75, 0.1, Z), r = K(Z) * 0.2; raw(lump(blob(c[0], c[1] - r * 0.3, r, r * 0.55, 8, 0.4), Z, warm(dk(STONE, Z), [sg * 0.75, 0.2, Z]), { band: 1.2 })); }
  raw(G.radGlow(P(0, 0.8, 16)[0], P(0, 0.8, 16)[1], 340, 170, '#ff9a4a', 0.4));
  raw(glare(P(0, 0.6, 15)[0], P(0, 0.6, 15)[1] - 10, 50, '#ffb060', { steps: [[3.4, 0.06], [2.4, 0.08], [1.6, 0.12]], sx: 2.4, sy: 0.9 }));
  // the logs lying along the hearth, charred, their undersides glowing, embers between
  for (let i = 0; i < 16; i++) { const Z = z0 + R() * (z1 - z0 - 1.2), X = (R() - 0.5) * 0.8, a = P(X, 0.14, Z), b = P(X + (R() - 0.5) * 0.3, 0.16, Z + 0.9 + R() * 0.6); raw(line([a, b], K(Z) * 0.13, CHAR) + EM(line([[a[0], a[1] + K(Z) * 0.04], [b[0], b[1] + K(Z) * 0.04]], K(Z) * 0.035, EMB, 0.9))); }
  // the fire: tongues of flame rising from the logs along the hearth, each a flame shape with a hot core, short (it is a
  // hearth, not a pyre), farther ones smaller
  for (let Z = z1; Z >= z0; Z -= 0.45 + R() * 0.35) { const b = P((R() - 0.5) * 0.6, 0.15, Z), k = K(Z), h = k * (0.5 + R() * 0.7), w = k * (0.14 + R() * 0.12), lean = (R() - 0.3) * w;
    const fl = [[b[0] - w, b[1]], [b[0] - w * 0.8 + lean * 0.2, b[1] - h * 0.35], [b[0] - w * 0.3 + lean * 0.5, b[1] - h * 0.62], [b[0] - w * 0.1 + lean * 0.6, b[1] - h * 0.5], [b[0] + lean, b[1] - h], [b[0] + w * 0.25 + lean * 0.7, b[1] - h * 0.55], [b[0] + w * 0.45 + lean * 0.6, b[1] - h * 0.72], [b[0] + w * 0.6 + lean * 0.3, b[1] - h * 0.35], [b[0] + w, b[1]]];
    raw(EM(G.softMass(b[0], b[1] - h * 0.4, w * 1.6, h * 0.6, '#c84a14', 0.5, { blur: w * 0.5 }) + fillS(fl, '#d8581a', 0.9, 0.6) + fillS(fl.map(([x, y]) => [b[0] + (x - b[0]) * 0.6, b[1] + (y - b[1]) * 0.65]), OR, 1, 0.6) + fillS(fl.map(([x, y]) => [b[0] + (x - b[0]) * 0.3, b[1] + (y - b[1]) * 0.35]), HOT, 1, 0.6))); }
  // the cauldron hanging from the tie-beam on its chain, its rim boiling over on one side and frozen on the other
  { const Z = 15.8, c = P(0.2, 1.05, Z), k = K(Z), r = k * 0.42; raw(BK.chain([P(0.2, 4.15, Z), [c[0], c[1] - r * 0.7]], 1.6, '#3a3434'));
    raw(cel(blob(c[0], c[1], r, r * 0.72, 14, 0.05), { Z, fill: '#2a2624', band: 4 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - r * 0.6)}" rx="${f1(r * 0.92)}" ry="${f1(r * 0.13)}" fill="#3a2a20" stroke="${INK}" stroke-width="1"/>` + fillS(blob(c[0] + r * 0.4, c[1] - r * 0.62, r * 0.4, r * 0.08, 8, 0.3), '#c8b080', 0.8) + rime([[c[0] - r * 0.92, c[1] - r * 0.6], [c[0] - r * 0.5, c[1] - r * 0.72], [c[0] - r * 0.1, c[1] - r * 0.74]], Z, { th: 2 }) + steam(c[0] + r * 0.3, c[1] - r * 0.7, 60, { n: 2, op: 0.25 })); }
}
// ---- the quiet band: stepped toward the hall's dark behind the fighters
raw(BL.quiet(MURK, 240, 360, { steps: [0.08, 0.1, 0.12, 0.14], hop: 0.12 }));
raw(ash(40, 400, 1200, 40, 300, { r: 1.8, op: 0.45 }));
{ let m = ''; for (let k = 0; k < 40; k++) m += `<circle cx="${f1(540 + R() * 420)}" cy="${f1(100 + R() * 220)}" r="${f1(0.6 + R() * 0.8)}" fill="${HOT}" opacity="${f1(0.4 + R() * 0.5)}"/>`; raw(EM(m)); }

// ======================================================================== MID: low things on the floor behind the fighters
layer('mid');
{
  // a mead cask on its side, burst, the mead frozen in a sheet on the cold side; drinking horns dropped; a toppled bench
  const Z = 10.4, k = K(Z), c = P(-4.0, 0.38, Z);
  raw(cel(blob(c[0], c[1], k * 0.48, k * 0.36, 14, 0.04), { Z, fill: '#3a2a1c', band: 3 }) + pline([[c[0] - k * 0.25, c[1] - k * 0.35], [c[0] - k * 0.25, c[1] + k * 0.35]], 1.6, INK) + pline([[c[0] + k * 0.25, c[1] - k * 0.35], [c[0] + k * 0.25, c[1] + k * 0.35]], 1.6, INK) + rime([[c[0] - k * 0.45, c[1] - k * 0.15], [c[0] - k * 0.2, c[1] - k * 0.35], [c[0] + k * 0.2, c[1] - k * 0.35]], Z, { th: 2 }));
  raw(fillS(blob(c[0] + k * 0.9, c[1] + k * 0.36, k * 0.9, k * 0.08, 10, 0.4), '#c8b880', 0.55) + pline([[c[0] + k * 0.4, c[1] + k * 0.38], [c[0] + k * 1.4, c[1] + k * 0.4]], 0.8, FROST, 0.7));
  for (const [X, Z2] of [[-2.8, 9.6], [3.2, 10.2]]) { const a = P(X, 0.06, Z2), kk = K(Z2); raw(line([[a[0], a[1]], [a[0] + kk * 0.3, a[1] - kk * 0.05], [a[0] + kk * 0.42, a[1] - kk * 0.14]], kk * 0.07, INK) + line([[a[0], a[1]], [a[0] + kk * 0.3, a[1] - kk * 0.05], [a[0] + kk * 0.42, a[1] - kk * 0.14]], kk * 0.045, '#c8b898')); }
  raw(box(3.8, 6.2, 0, 0.18, 11.2, 11.6, { col: CHAR, shadeOp: 0.5 }) + EM(seam([P(4, 0.19, 11.2), P(5.8, 0.19, 11.2)], 0.8, { glowOp: 0.08 })));
}

// ======================================================================== FORE: framing
layer('fore');
{
  // left: the near post of the cold row, carved with a beast head at its top, rimed down its windward edge, a drinking
  // horn hung on a peg
  const x0 = -12, x1 = 52;
  raw(fillP([[x0, -5], [x1, -5], [x1 - 2, H + 5], [x0, H + 5]], '#2a2a2c') + fillP([[x0 + 40, -5], [x1, -5], [x1 - 2, H + 5], [x0 + 40, H + 5]], S.hatchA(4), 0.5) + fillP([[x1 - 8, -5], [x1, -5], [x1 - 2, H + 5], [x1 - 10, H + 5]], '#ff9a4a', 0.25));
  { let d = ''; for (const y of [120, 300]) for (let k = 0; k < 4; k++) { const yy = y + k * 14; d += `M${x0} ${yy} C${x0 + 20} ${yy - 14} ${x1 - 20} ${yy + 10} ${x1} ${yy - 6} `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="1.6" fill="none" opacity="0.7"/>`); }
  raw(BL.rimeEdge(Array.from({ length: 16 }, (_, i) => [x0 + 2, H - i * (H + 10) / 15]).reverse(), { w: 5, col: FROST }));
  raw(BL.icicles([x0, 240], [x1, 242], 4, { max: 30, col: FROST }));
  // top: the nearest tie-beam across the top of the frame, charred on the right, rimed on the left, a row of drinking
  // horns and a frozen cloak hung from it
  raw(cel([[-10, -10], [W + 10, -10], [W + 10, 38], [-10, 46]], { Z: 3, fill: '#2a1c14', band: 7 }) + fillP([[-10, -10], [W + 10, -10], [W + 10, 38], [-10, 46]], S.hatchA(3), 0.4));
  raw(BL.rimeEdge([[-10, 42], [700, 40]], { w: 3.6, col: FROST }) + BL.icicles([-10, 46], [680, 42], 20, { max: 44, col: FROST }) + EM(seam(jag([780, 40], [W + 10, 36], 16, 3), 2, { glowOp: 0.12 })) + char(1100, 22, 220, 18, { Z: 3 }));
  // right: the end of a bench with a heaped, charred sleeping fur and a sword in its scabbard against it, low in the corner
  raw(cel([[W - 200, H + 5], [W - 196, H - 42], [W + 10, H - 46], [W + 10, H + 5]], { Z: 3.6, fill: CHAR, band: 6 }) + EM(seam(jag([W - 190, H - 40], [W, H - 44], 8, 2), 1.4, { glowOp: 0.12 })));
  raw(cel([[W - 180, H - 42], [W - 150, H - 74], [W - 80, H - 84], [W - 20, H - 70], [W + 10, H - 48]], { Z: 3.6, fill: '#3a2a20', band: 6 }) + ash(14, W - 180, W, H - 120, H - 50, { r: 2, op: 0.5 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
