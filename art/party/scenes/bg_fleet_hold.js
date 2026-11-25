// World VII, the Icebound Fleet: THE ORLOP (battle room, Living Ink). Room key 'fleet_hold'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Orlop Deck (down in the hold, the crew is still at work), The Captain's Cabin (the captain comes down to
// the orlop where his wife the sea has come aboard).
// The place: the flagship's orlop deck, below the waterline, looking aft along the ship. The deck beams run just over the
// company's heads and close in toward the far bulkhead. The sea came in: on the starboard side the leviathan's ice stove
// the hull and stands in the orlop as a wall of sea ice, glowing cold blue-green with the daylight outside; the bilge is
// frozen to a black glaze under it, an eel hole in it. Grey daylight falls through the hatchways from the deck far above,
// with the snow that sifted down heaped under them, and the companion ladder in the shaft. The cable tier with the anchor
// cable coiled frozen; the sailmaker's work hanging from the beams (the dead sewn in their hammocks, two round shot at the
// feet); the surgeon's cockpit by the larboard side (his table of sea chests, the bucket, the saw).
// Courses: WATER (the sea through the hull, the frozen bilge, the swollen sewn dead, barnacles inside the planking);
// FROST (the ice wall, rime on every beam's underside edge, icicles off the knees, frost feathers on the ceiling).
// Palette: black and blue-black timber, ice blue-green and white, grey daylight; no warm colour, no eyes, no gold, no red.
// Usage: node scenes/bg_fleet_hold.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'VII');
const W = 1480, H = 480, ROOM = 'fleet_hold';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 7303, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#dce8ee', shadowTint: '#06090c' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW } = S;
const G = require('./battle_kit_g3')(S, { air: '#0a0e12', murk: '#06080b' });
const { BK, BL, air, glare, wedges, snowfall } = G;
const { line, pline, fillP, fillS, inkP, blob, box, post, beam } = BK;

const TIM = '#23262a', TIMD = '#15171a', TIML = '#3a3f46', RIME = '#b8c8d0', ICEG = '#9ec8c4', ICEL = '#d4eeea', ICED = '#3e6a6c', MURK = '#06080b', DAY = '#c8d4dc';
const YB = 1.85, YC = 2.15, ZEND = 24;                      // beam underside, ceiling, the far bulkhead
const Xs = Y => 6.0 + 0.75 * Math.sin(Math.min(1, Y / YC) * Math.PI / 2);   // the hull's inner face (the bilge turns in below)
const dk = (c, Z, k = 1) => air(c, Z, { z0: 6, z1: 28, max: 0.75 * k });     // recession into the dark aft

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the far bulkhead aft: planked, a door to the bread room shut, a cold lantern hung by it, dark
{
  const Z = ZEND, at = (s, t) => [-7 + s, t, Z];
  raw(S.boards((s, t) => [-7 + t, s, Z], YC, 14, dk(TIM, Z), { bw: 0.22, segs: 1, knots: 0.2, nails: false, vary: 0.1 }).replace(/<path d="M[^"]*" fill="[^"]*"\/>/, m => m));
  const d = [P(-0.6, 0, Z - 0.02), P(0.6, 0, Z - 0.02), P(0.6, 1.7, Z - 0.02), P(-0.6, 1.7, Z - 0.02)];
  raw(cel(d, { Z, fill: dk('#1a1c20', Z), band: 1 }) + pline([P(0.4, 0.9, Z - 0.04), P(0.5, 0.9, Z - 0.04)], 1.6, dk('#5a6068', Z)));
}
// ---- the ceiling: the deck above, its planks running aft, frost feathers on them; the beams across, rimed on their
// lower front edges; between them the hatchway's light well (the room's light focus)
const HX0 = -3.0, HX1 = -0.9, HZ0 = 2.7, HZ1 = 3.9;
{
  const at = (s, t) => [-7 + t, YC, 2 + s];
  raw(S.boards(at, ZEND - 2, 14, TIMD, { bw: 0.24, knots: 0.1, nails: false, vary: 0.08, segs: 6 }));
  // frost feathers on the ceiling planks (the warm breath of the dead froze there): pale ragged patches
  for (let i = 0; i < 30; i++) { const X = -6 + R() * 12, Z = 3 + Math.pow(R(), 0.7) * 16, c = P(X, YC, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * (0.3 + R() * 0.5), k * 0.06, 10, 0.6), dk('#5a6a76', Z), 0.35)); }
}
// the light well through the hatchways: the opening, the coamings going up, the grey day at the top through the grating
{
  const op = [[HX0, YC, HZ0], [HX1, YC, HZ0], [HX1, YC, HZ1], [HX0, YC, HZ1]], ops = op.map(p => P(...p)), cid = S.id('hw');
  raw(`<clipPath id="${cid}"><path d="${p2(ops)}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(fillP(ops, '#2a343c'));
  // the far coaming's face going up, lit grey; the near one in shadow; the opening at the top: bright day, grating bars
  const up = 2.3, F = (pts) => pts.map(p => P(...p));
  // the far coaming face (lit grey, stepped lighter toward the top), the right face (facing the light), the left in shadow
  for (let j = 0; j < 4; j++) { const y0 = YC + 0.12 * j, y1 = YC + (j < 3 ? 0.12 * (j + 1) : up), c = mix('#a8b6c0', '#e8f0f4', j / 3);
    raw(fillP(F([[HX0, y0, HZ1], [HX1, y0, HZ1], [HX1, y1, HZ1], [HX0, y1, HZ1]]), c) + fillP(F([[HX1, y0, HZ0], [HX1, y0, HZ1], [HX1, y1, HZ1], [HX1, y1, HZ0]]), mix(c, '#c8d4dc', 0.2))); }
  raw(fillP(F([[HX0, YC, HZ0], [HX0, YC, HZ1], [HX0, YC + up, HZ1], [HX0, YC + up, HZ0]]), '#1a2026') + `<path d="${p2(F([[HX0, YC, HZ0], [HX0, YC, HZ1], [HX0, YC + up, HZ1], [HX0, YC + up, HZ0]]))}" fill="${S.hatchA(3)}" opacity="0.5"/>`);
  // planks of the well's lining, and the deck beam of the gun deck above crossing it
  for (let j = 1; j < 8; j++) { const y = YC + up * j / 8; raw(pline(F([[HX0, y, HZ1], [HX1, y, HZ1], [HX1, y, HZ0]]), 0.8, INK, 0.5)); }
  // the grating of the upper hatch at the top: bars both ways, the day bright between them, snow on the bars
  const top = F([[HX0, YC + up, HZ0], [HX1, YC + up, HZ0], [HX1, YC + up, HZ1], [HX0, YC + up, HZ1]]);
  raw(fillP(top, '#eef4f8'));
  for (let i = 0; i <= 9; i++) { const X = HX0 + (HX1 - HX0) * i / 9; raw(pline(F([[X, YC + up, HZ0], [X, YC + up, HZ1]]), 3.2, '#20262c')); }
  for (let i = 0; i <= 5; i++) { const Z = HZ0 + (HZ1 - HZ0) * i / 5; raw(pline(F([[HX0, YC + up, Z], [HX1, YC + up, Z]]), 2.4, '#2a3036')); }
  raw(BL.icicles(F([[HX0, YC + up, HZ1]])[0], F([[HX1, YC + up, HZ1]])[0], 9, { max: 16, col: '#e4eef2' }));
  raw('</g>' + inkP(ops, 1.4) + BL.rimeEdge([ops[3], ops[2]], { w: 2, col: RIME }) + BL.icicles([ops[0][0] + 2, ops[0][1] + 1], [ops[1][0] - 2, ops[1][1] + 1], 7, { max: 14, col: RIME }));
  raw(glare((ops[0][0] + ops[2][0]) / 2, (ops[0][1] + ops[2][1]) / 2, 40, '#9aaab4', { steps: [[3.0, 0.05], [2.0, 0.07], [1.3, 0.1]], sx: 1.8, sy: 0.6, jag: 0.3 }));
}
// ---- the side walls: the hull's inner lining (ceiling planks) running aft, ribs every few feet, hanging knees under the
// beams; barnacles and frozen weed come through the seams low down where the sea is outside
function side(sg) {
  const zs = 3.2, ze = ZEND, at = (s, t) => [sg * Xs(t), t, zs + s];
  // strakes as bands of their own tones, receding
  const nS = 9; for (let j = 0; j < nS; j++) { const y0 = j * YC / nS, y1 = (j + 1) * YC / nS; let z = zs; while (z < ze) { const l = 2 + R() * 3.5, z1 = Math.min(ze, z + l), q = [P(sg * Xs(y0), y0, z), P(sg * Xs(y0), y0, z1), P(sg * Xs(y1), y1, z1), P(sg * Xs(y1), y1, z)]; raw(fillP(q, dk(tone(j < 3 ? TIMD : TIM, 0.08), (z + z1) / 2)) + pline([q[0], q[1]], 0.6, INK, 0.6)); z = z1; } }
  raw(hatch3(at, 0, ze - zs, 0, YC, 0.5, { op: 0.35 }) + hatch3(at, 0, ze - zs, 0, YC * 0.5, -0.6, { op: 0.3 }));
  // barnacles and frozen weed through the seams low on the wall
  for (let i = 0; i < 26; i++) { const Z = zs + Math.pow(R(), 0.8) * 14, Y = R() * 0.7, c = P(sg * Xs(Y), Y, Z); raw(BL.blisters(c[0], c[1], K(Z) * 0.15, 4, dk('#5a6466', Z), { size: Math.max(0.6, K(Z) * 0.02), flat: 0.5 })); }
  // ribs (frames), each a curved timber from the floor to the beam shelf, rime on the edge toward the light
  for (let Z = zs + 0.4; Z < ze; Z += 0.75 + R() * 0.1) {
    const pts = [], pts2 = []; for (let i = 0; i <= 8; i++) { const Y = YC * i / 8; pts.push(P(sg * (Xs(Y) - 0.18), Y, Z)); pts2.push(P(sg * (Xs(Y) - 0.18), Y, Z + 0.24)); }
    const poly = [...pts, ...pts2.slice().reverse()], col = dk(TIM, Z);
    raw(fillP(poly, col) + fillP(sg < 0 ? [...pts2, ...pts2.slice().reverse().map(([x, y]) => [x - sg * 0.5, y])] : poly, S.hatchA(Z), sg < 0 ? 0.1 : 0.45) + pline(sg < 0 ? pts2 : pts, Math.max(0.6, S.inkW(Z) * 1.1), INK, 0.9));
    if (Z < 16) raw(BL.rimeEdge((sg < 0 ? pts : pts2).slice(3).map(([x, y]) => [x - 0.5, y]), { w: Math.max(0.6, K(Z) * 0.025), col: dk(RIME, Z), op: 0.7 }));
  }
}
side(-1); side(1);
// ---- the floor: the orlop deck's planks running aft (converging), worn, a frozen glaze of bilge on the starboard side
{
  const at = (s, t) => [-7 + t, 0, 3.6 + s];
  raw(S.boards(at, ZEND - 3.6, 14, '#24282c', { bw: 0.2, knots: 0.12, nails: true, vary: 0.12, segs: 5 }));
  raw(hatch3(at, 0, ZEND - 3.6, 0, 14, 0.2, { op: 0.25, gap: 1.2 }));
  // the frozen bilge: a black glaze spreading from the breach, cold light lying on it in streaks, an eel hole in it
  const gl = []; for (let i = 0; i <= 16; i++) { const t = i / 16; gl.push([1.2 + Math.sin(t * 9) * 0.5 + t * 1.2, 0.01, 8 + t * 12]); }
  const glP = [...gl, [Xs(0), 0.01, 20], [Xs(0), 0.01, 8]].map(p => P(...p));
  raw(fillS(glP, '#0e1820', 0.92, 0.3) + inkP(gl.map(p => P(...p)), 0.8, 0.6));
  for (let i = 0; i < 40; i++) { const Z = 8.5 + R() * 10, X = 2.5 + R() * 3.5, a = P(X, 0.01, Z), l = K(Z) * (0.3 + R() * 0.8); raw(`<path d="M${f1(a[0] - l / 2)} ${f1(a[1])} l${f1(l)} 0" stroke="${ICEG}" stroke-width="${f1(Math.max(0.6, K(Z) * 0.012))}" opacity="${f1(0.2 + R() * 0.35)}"/>`); }
  { const c = P(3.6, 0.01, 10.6), k = K(10.6); const ol = S.blobST(c[0], c[1], k * 1.1, k * 0.16, 14, 0.3); raw(fillS(ol, '#020406') + inkP(ol, 1) + pline(ol.slice(1, 7).map(([x, y]) => [x, y + 1]), 1, ICEG, 0.6)); }
  // the snow that sifted down the hatchways, heaped under them, with its lit crest; the companion ladder's foot in it
  { const cz = (HZ0 + HZ1) / 2 + 2.2, c = P((HX0 + HX1) / 2 + 1.9, 0, cz), k = K(cz), pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([c[0] - k * 1.4 + k * 2.8 * t, c[1] - k * 0.28 * Math.sin(t * Math.PI) * (0.8 + R() * 0.3)]); }
    raw(fillS([[c[0] - k * 1.5, c[1] + 2], ...pts, [c[0] + k * 1.5, c[1] + 2]], '#8a9aa6', 0.9) + line(pts.slice(2, 9), 1.2, '#dce6ec', 0.8)); }
  raw(occBand((s, t) => [-8 + s, 0, 3.6 + t], 16, 1.0, { op: 0.4 }));
}
// ---- the grey shaft down the hatchways to the snow heap (the day, slanting a little toward us)
{
  const tl = P(HX0, YC, HZ0), tr = P(HX1, YC, HZ1), bl = P(HX0 + 1.9, 0, HZ0 + 1.94), br = P(HX1 + 1.9, 0, HZ1 + 1.94);
  const hl = S.hull([P(HX0, YC, HZ0), P(HX1, YC, HZ0), P(HX1, YC, HZ1), P(HX0, YC, HZ1), P(HX0 + 1.9, 0, HZ0 + 1.94), P(HX1 + 1.9, 0, HZ0 + 1.94), P(HX1 + 1.9, 0, HZ1 + 1.94), P(HX0 + 1.9, 0, HZ1 + 1.94)]);
  raw(fillP(hl, DAY, 0.07) + fillP(hl.map(([x, y]) => [x + (x - (tl[0] + br[0]) / 2) * -0.25, y]), DAY, 0.06));
  raw(G.shaft(tl, [tr[0], tl[1]], bl, [br[0], bl[1]], DAY, { op: 0, motes: 40, mote: '#e4eef4' }));
  // the companion ladder slanting down through the light: two strings and treads
  const lb = P(HX1 + 0.5, 0, HZ1 + 2.6), lt = P(HX1 - 0.3, YC, HZ0 + 0.5), lb2 = P(HX1 - 0.3, 0, HZ1 + 2.6), lt2 = P(HX1 - 1.1, YC, HZ0 + 0.5);
  raw(line([lb, lt], 4, INK) + line([lb, lt], 2.6, '#3a4048') + line([lb2, lt2], 4, INK) + line([lb2, lt2], 2.6, '#3a4048'));
  for (let i = 1; i < 8; i++) { const t = i / 8, a = [lb[0] + (lt[0] - lb[0]) * t, lb[1] + (lt[1] - lb[1]) * t], b = [lb2[0] + (lt2[0] - lb2[0]) * t, lb2[1] + (lt2[1] - lb2[1]) * t]; raw(pline([a, b], 3, INK) + pline([a, b], 1.6, '#5a646e') + BL.rimeEdge([[b[0], b[1] - 1.5], [a[0], a[1] - 1.5]], { w: 1.2, col: '#dce6ec' })); }
}
// ---- THE BREACH: the starboard side stove in by the ice; a wall of sea ice standing in the orlop, glowing blue-green with
// the day outside; the planks burst inward round it, splintered, a rib snapped; ice spilled across the deck
{
  const z0 = 11.2, z1 = 18.5, k = K(14);
  // the hole in the lining (screen outline on the wall plane), ragged with splintered plank ends
  const hole = []; for (let i = 0; i <= 14; i++) { const t = i / 14, Y = YC * (0.05 + 0.9 * Math.sin(t * Math.PI)) + (R() - 0.5) * 0.15, Z = z0 + (z1 - z0) * t; hole.push([Xs(Y) - 0.05, Math.min(YC, Y), Z]); }
  const holeP = [...hole.map(p => P(...p)), P(Xs(0), 0, z1), P(Xs(0), 0, z0)];
  raw(GLOW(`<ellipse cx="${f1(P(Xs(1), 1, 14.5)[0])}" cy="${f1(P(0, 1, 14.5)[1])}" rx="300" ry="140" fill="${ICEG}" opacity="0.22" filter="url(#soft)"/>`));
  raw(fillP(holeP, ICED));
  // the ice mass: plates and lobes of sea ice, translucent, lit from behind (the outside day): pale at the top, deeper
  // blue-green in the body, dark cracks; lobes bulging in over the deck
  const cid = S.id('br'); raw(`<clipPath id="${cid}"><path d="${p2(holeP)}"/></clipPath><g clip-path="url(#${cid})">`);
  for (let i = 0; i < 26; i++) { const Y = R() * YC, Z = z0 + R() * (z1 - z0), c = P(Xs(Y) - 0.3, Y, Z), r = K(Z) * (0.25 + R() * 0.5); const col = Y > 1.3 ? ICEL : Y > 0.6 ? ICEG : mix(ICEG, ICED, 0.5); raw(cel(blob(c[0], c[1], r, r * 0.8, 9, 0.4), { Z, fill: col, band: r * 0.3, shadow: ICED, hi: false })); }
  for (let i = 0; i < 9; i++) { const a = P(Xs(1) - 0.2, R() * YC, z0 + R() * (z1 - z0)); raw(line([a, [a[0] + (R() - 0.5) * 40, a[1] + 10 + R() * 40]], 1, ICED, 0.8)); }
  raw('</g>' + inkP(holeP, 1.6));
  // splintered plank ends round the rim, pointing in
  for (let i = 0; i < 18; i++) { const p = hole[1 + Math.floor(R() * 12)], a = P(...p), l = K(p[2]) * (0.2 + R() * 0.4), ang = Math.PI * (0.8 + R() * 0.5); raw(fillP([[a[0], a[1] - 2], [a[0] + Math.cos(ang) * l, a[1] + Math.sin(ang) * l * 0.4], [a[0], a[1] + 2]], TIM) + inkP([[a[0], a[1] - 2], [a[0] + Math.cos(ang) * l, a[1] + Math.sin(ang) * l * 0.4], [a[0], a[1] + 2]], 0.7)); }
  // a rib snapped and bent in by the ice
  { const a = P(Xs(1.6) - 0.2, 1.6, 14.2), b = P(Xs(0.7) - 1.0, 0.7, 13.6), c = P(Xs(0) - 0.3, 0, 14.0); raw(line([a, b], K(14) * 0.24 + 1.6, INK) + line([a, b], K(14) * 0.24, TIML) + line([b, c], K(14) * 0.22 + 1.6, INK) + line([b, c], K(14) * 0.22, TIM) + BL.rimeEdge([a, b], { w: 1.6, col: RIME })); }
  // ice spilled across the deck from the breach
  raw(wedges([P(4.0, 0, 18.0), P(3.4, 0, 15), P(3.0, 0, 12.5), P(4.2, 0, 11.6)], 14, { size: [6, 18], cols: [ICEL, ICEG, ICED], rime: '#e8f6f4', Z: 14 }));
  // icicles down the lining above the hole and from the beam shelf over it
  raw(BL.icicles(P(Xs(YC) - 0.1, YC - 0.05, z0), P(Xs(YC) - 0.1, YC - 0.05, z1), 16, { max: 18, col: ICEL }));
}
// ---- the deck beams overhead: one every 1.1 m, each with its underside seen, rimed on the lower front edge, icicles;
// hanging knees at the sides; a few pillars down the middle under the beams (aft, behind the fighters)
const BZ = []; for (let Z = 4.3; Z < ZEND; Z += 1.05 + R() * 0.12) BZ.push(Z);
for (const Z of BZ.reverse()) {
  const x0 = -Xs(YB), x1 = Xs(YB);
  raw(box(x0, x1, YB, YC, Z, Z + 0.3, { col: dk(TIM, Z), shadeOp: 0.5, sides: false }));
  const fl = [P(x0, YB, Z), P(x1, YB, Z)];
  if (Z < 18) raw(BL.rimeEdge([[fl[0][0], fl[0][1] - 0.6], [fl[1][0], fl[1][1] - 0.6]], { w: Math.max(0.8, K(Z) * 0.03), col: dk(RIME, Z) }) );
  if (Z < 14) raw(BL.icicles([fl[0][0], fl[0][1] + 1], [fl[1][0], fl[1][1] + 1], Math.round(18 - Z), { max: K(Z) * 0.12, col: dk(RIME, Z), wk: 0.12 }));
  for (const sg of [-1, 1]) { const a = P(sg * (Xs(YB) - 0.05), YB, Z + 0.15), b = P(sg * (Xs(YB) - 0.6), YB, Z + 0.15), c = P(sg * (Xs(1.0) - 0.15), 1.0, Z + 0.15); raw(fillS([a, b, [b[0] + (c[0] - b[0]) * 0.3, b[1] + (c[1] - b[1]) * 0.15], c, [c[0] + sg * 3, c[1]]], dk(TIMD, Z), 1, 0.4) + inkP([a, b, c], Math.max(0.6, S.inkW(Z)), 0.8)); }
}
for (const Z of [12.7, 17.0, 21.2]) raw(post(0.9, Z, 0.13, 0, YB, dk(TIM, Z), { shadeOp: 0.5 }));
// ---- the sailmaker's work: the dead sewn in their hammocks hung from the beams along the larboard side, two round shot
// at the feet, the last stitch through the nose; swollen, frosted, hanging still
for (const [X, Z] of [[-4.4, 10.2], [-5.0, 12.6], [-4.6, 15.1], [-5.2, 17.4]]) {
  const top = P(X, YB, Z), bot = P(X, 0.35, Z), k = K(Z), w = k * 0.24, col = dk('#8a929a', Z, 0.7);
  const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10, sw = 0.75 + 0.35 * Math.sin(t * Math.PI) + (t > 0.25 && t < 0.45 ? 0.15 : 0); pts.push([top[0] - w * sw + Math.sin(t * 3) * 1.5, top[1] + (bot[1] - top[1]) * t]); }
  const body = [...pts, ...pts.slice().reverse().map(([x, y], i) => [top[0] + (top[0] - x) * 0.95 + 1, y])];
  raw(line([[top[0], top[1]], [top[0], top[1] + k * 0.12]], 1.4, INK) + cel(body, { Z, fill: col, band: Math.max(1, w * 0.3), tex: 'url(#mottle)', texOp: 0.4 }));
  for (let i = 1; i < 9; i++) { const y = top[1] + (bot[1] - top[1]) * i / 9; raw(pline([[top[0] - 1, y - 1], [top[0] + 1, y + 1]], 0.8, INK, 0.6)); }
  raw(pline([[top[0], top[1] + 4], [top[0], bot[1] - 4]], 0.6, INK, 0.5) + `<circle cx="${f1(top[0] - w * 0.4)}" cy="${f1(bot[1] - 3)}" r="${f1(Math.max(1.4, k * 0.07))}" fill="${dk('#2a2c30', Z)}" stroke="${INK}" stroke-width="0.6"/><circle cx="${f1(top[0] + w * 0.4)}" cy="${f1(bot[1] - 3)}" r="${f1(Math.max(1.4, k * 0.07))}" fill="${dk('#2a2c30', Z)}" stroke="${INK}" stroke-width="0.6"/>`);
  raw(BL.rimeEdge(pts.slice(1, 6).map(([x, y]) => [x - 0.5, y]), { w: Math.max(0.8, k * 0.04), col: dk(RIME, Z) }) + BL.icicles([bot[0] - w * 0.5, bot[1]], [bot[0] + w * 0.5, bot[1]], 3, { max: k * 0.15, col: dk(RIME, Z) }));
}
// ---- the quiet band: stepped toward the hold's dark behind the fighters
raw(BL.quiet(MURK, 236, 360, { steps: [0.1, 0.14, 0.16, 0.18], hop: 0.18 }));

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
{
  // the cable tier: the anchor cable coiled flat on the larboard side, as thick as a man's thigh, frozen in its coils
  const c = P(-3.6, 0, 11.6), k = K(11.6);
  for (let j = 0; j < 6; j++) { const rx = k * (1.4 - j * 0.12), ry = k * (0.22 - j * 0.015), y = c[1] - j * k * 0.09; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${INK}" stroke-width="${f1(k * 0.13)}"/><ellipse cx="${f1(c[0])}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="#2e3238" stroke-width="${f1(k * 0.09)}"/><ellipse cx="${f1(c[0])}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="#14161a" stroke-width="${f1(k * 0.09)}" stroke-dasharray="${f1(k * 0.05)} ${f1(k * 0.09)}"/>`); }
  raw(BL.rimeEdge(Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (1 + i / 8); return [c[0] + Math.cos(a) * k * 0.8, c[1] - k * 0.5 + Math.sin(a) * k * 0.12]; }), { w: 1.6, col: '#7a8a96' }));
  // the surgeon's cockpit: two sea chests for his table, a bucket beside it, the bow saw hung on a nail at the rib
  const Z2 = 9.4, k2 = K(Z2);
  raw(box(-6.0, -4.7, 0, 0.75, Z2, Z2 + 0.6, { col: '#1a1c20', shadeOp: 0.5 }) + box(-5.95, -4.75, 0.75, 0.82, Z2 - 0.05, Z2 + 0.62, { col: '#2a2c30', shadeOp: 0.4 }));
  { const b = P(-4.3, 0, Z2 - 0.3); raw(cel([[b[0] - k2 * 0.18, b[1]], [b[0] - k2 * 0.2, b[1] - k2 * 0.34], [b[0] + k2 * 0.2, b[1] - k2 * 0.34], [b[0] + k2 * 0.18, b[1]]], { Z: Z2, fill: '#24282c', band: 1.4 }) + `<ellipse cx="${f1(b[0])}" cy="${f1(b[1] - k2 * 0.34)}" rx="${f1(k2 * 0.2)}" ry="${f1(k2 * 0.05)}" fill="#0a0c0e" stroke="${INK}" stroke-width="0.6"/>`); }
  { const s0 = P(-5.4, 0.9, Z2 + 0.2); raw(pline([[s0[0], s0[1]], [s0[0] + 18, s0[1]], [s0[0] + 18, s0[1] - 6], [s0[0], s0[1] - 6], [s0[0], s0[1]]], 1.2, '#5a6068') + pline([[s0[0], s0[1]], [s0[0] + 18, s0[1]]], 0.8, '#8a929a')); }
  // casks on the starboard side by the breach, staved, iron hooped, ice frozen over them
  for (const [X, Z, r] of [[4.8, 9.8, 0.42], [5.4, 10.9, 0.4], [4.6, 11.8, 0.38]]) { const c3 = P(X, r, Z), k3 = K(Z); raw(cel(blob(c3[0], c3[1], k3 * r, k3 * r * 1.05, 14, 0.04), { Z, fill: '#22262a', band: k3 * r * 0.3 }) + pline([[c3[0] - k3 * r * 0.95, c3[1] - k3 * r * 0.4], [c3[0] + k3 * r * 0.95, c3[1] - k3 * r * 0.4]], 1.6, INK, 0.8) + pline([[c3[0] - k3 * r * 0.95, c3[1] + k3 * r * 0.4], [c3[0] + k3 * r * 0.95, c3[1] + k3 * r * 0.4]], 1.6, INK, 0.8) + BL.rimeEdge([[c3[0] - k3 * r * 0.7, c3[1] - k3 * r * 0.7], [c3[0], c3[1] - k3 * r]], { w: 1.4, col: '#8aa8a8' })); }
}

// ======================================================================== FORE: framing over the fighters
layer('fore');
{
  // the nearest beam right overhead across the top, its underside and front face, rimed and hung with long icicles;
  // a hammock bundle and an unlit lantern hung from it
  const y0 = -10, y1 = 52;
  raw(cel([[-10, y0], [W + 10, y0], [W + 10, y1 - 6], [-10, y1]], { Z: 3, fill: '#101214', band: 8 }) + fillP([[-10, y0], [W + 10, y0], [W + 10, y1 - 6], [-10, y1]], S.hatchA(3), 0.45));
  // the beam's grain, adze marks, a deep check split along it, a carved tally of the dead cut into it by someone below
  for (let i = 0; i < 6; i++) { const y = 6 + i * 7 + R() * 3, pts = []; for (let x = -10; x <= W + 10; x += 40) pts.push([x, y + Math.sin(x * 0.01 + i) * 2 - x * 0.004]); raw(line(pts, 0.8, '#2e3338', 0.7)); }
  for (let i = 0; i < 40; i++) { const x = R() * W, y = 8 + R() * 36; raw(`<path d="M${f1(x)} ${f1(y)} q6 -3 12 0" stroke="#3a4048" stroke-width="0.8" fill="none" opacity="0.6"/>`); }
  raw(line([[200, 30], [520, 26], [760, 31], [980, 28]], 2.4, '#000') + line([[200, 32], [520, 28], [760, 33], [980, 30]], 0.8, '#5a6470', 0.6));
  { let d = ''; for (let g = 0; g < 7; g++) { const x0 = 560 + g * 26; for (let k2 = 0; k2 < 4; k2++) d += `M${x0 + k2 * 4} 14 l1 16 `; d += `M${x0 - 3} 26 l20 -10 `; } raw(`<path d="${d}" stroke="#6a7480" stroke-width="1.2" fill="none" opacity="0.8"/>`); }
  raw(BL.rimeEdge([[-10, y1 - 3], [W + 10, y1 - 9]], { w: 3.6, col: RIME }) + BL.icicles([-10, y1], [W + 10, y1 - 6], 46, { max: 40, col: RIME, wk: 0.12 }));
  // the lantern (iron and horn, cold, iced over) hanging from the beam at the right
  { const x = 1190, y = y1 + 46; raw(line([[x, y1 - 4], [x, y - 22]], 1.6, INK) + cel([[x - 12, y - 20], [x + 12, y - 20], [x + 14, y + 16], [x - 14, y + 16]], { Z: 3, fill: '#2a3036', band: 3 }) + fillP([[x - 8, y - 14], [x + 8, y - 14], [x + 9, y + 10], [x - 9, y + 10]], '#4a5a64') + pline([[x, y - 14], [x, y + 10]], 1.6, INK) + BL.rimeEdge([[x - 12, y - 21], [x + 12, y - 21]], { w: 2, col: RIME }) + BL.icicles([x - 13, y + 17], [x + 13, y + 17], 4, { max: 16, col: RIME })); }
  // left: a near rib and its hanging knee, black, curving in from the edge, rime on its lit edge, barnacles low
  { const pts = [[-10, 40], [40, 60], [58, 140], [66, 250], [70, 380], [74, H + 10]]; raw(fillS([[-10, 40], ...pts, [-10, H + 10]], '#0a0c0e', 1, 0.4) + fillS([[22, 60], [58, 140], [66, 250], [70, 380], [74, H + 10], [40, H + 10], [44, 300], [34, 150]], S.hatchA(3), 0.4, 0.4) + line(pts, 3, INK) + BL.rimeEdge(pts.slice(1).map(([x, y]) => [x + 2, y]).reverse(), { w: 3.2, col: RIME })); }
  // right: the near pillar (a stanchion) under the beam, an iron ring with a frozen rope, rime on its left edge
  { const x0 = W - 62, x1 = W - 20; raw(fillP([[x0, 40], [x1, 38], [x1 + 2, H + 10], [x0 - 2, H + 10]], '#0e1012') + fillP([[x0 + 22, 40], [x1, 38], [x1 + 2, H + 10], [x0 + 24, H + 10]], S.hatchA(3), 0.5) + BL.rimeEdge(Array.from({ length: 12 }, (_, i) => [x0 - 1, H - i * (H - 40) / 11]), { w: 3.5, col: RIME }));
    raw(`<ellipse cx="${x0 - 2}" cy="250" rx="7" ry="10" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="${x0 - 2}" cy="250" rx="7" ry="10" fill="none" stroke="#3a4048" stroke-width="2"/>` + line([[x0 - 8, 256], [x0 - 30, 330], [x0 - 22, 420], [x0 - 40, H + 5]], 6, INK) + line([[x0 - 8, 256], [x0 - 30, 330], [x0 - 22, 420], [x0 - 40, H + 5]], 3.6, '#4a525a')); }
  // frost motes in the air near the light
  { let m = ''; for (let k = 0; k < 60; k++) m += `<circle cx="${f1(300 + R() * 700)}" cy="${f1(60 + R() * 300)}" r="${f1(0.5 + R() * 0.8)}" fill="#dce6ec" opacity="${f1(0.1 + R() * 0.3)}"/>`; raw(m); }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
