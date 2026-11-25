// World II, the Rotmire: THE DROWNING MERE (room key `mire_drown`), Living Ink, round 2 (group g1).
// Lore: the fen folk gave their offerings to the water here, long before the stilts; the Mire Mother herself was drowned
// in this fen with a braided noose round her neck. The mere lies in a dead alder carr: black, utterly still water, the
// trees standing in it to their knees and again upside down beneath them. The company stands on the old hurdle trackway
// that runs out into the mere just under the skin of the water. Offering posts stand in the water with braided cords and
// weighted bundles; a drowning stone hangs on its rope from a limb. "The Still Water: a log in the water" (fen lurker).
// Space: open and deep, at the water's skin; the long flat waterline with mirror reflections. Light: night; a low cold moon
// behind thin mist, its glade on the still water (the light focus). Shapes: gnarled dead alders, many-stemmed, crooked,
// never forked like a Y; their reflections. Palette: darkest key of the world, cold green-grey; amber nowhere.
// Courses: toxin (mould fur on the stumps, shelf fungus, a bile scum drifting), water (stillness, tanned posts, nothing rots).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'II');
const W = 1480, H = 480, ROOM = 'mire_drown';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2422, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#101410' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G, II = G.II;
const MIST = '#4e5a50', MURK = '#0c100e', MOON = '#dfe4cc', WATER = '#1a221c', WY = -0.08;
const fog = G.fogger(MIST, 8, 110, 0.8);
const MX = 560, MY = 176;

// a dead alder: a leaning trunk, several crooked limbs leaving it at different heights (never a fork at the tip), broken
// stubs, one limb snapped and hanging; returns segments [x0,y0,x1,y1,w] in metres (X,Y) at depth Z
function alder(X, Z, h, o = {}) {
  const segs = [], lean = o.lean ?? (R() - 0.5) * 0.25;
  const grow = (x, y, a, len, w, d) => { const n = 5 + Math.floor(R() * 3); let cx = x, cy = y;
    for (let i = 0; i < n; i++) { a += (R() - 0.5) * 0.55; const nx = cx + Math.cos(a) * len / n, ny = cy + Math.sin(a) * len / n, ww = w * (1 - i / n * 0.75);
      segs.push([cx, cy, nx, ny, ww]);
      if (d > 0 && i > 0 && i < n - 1 && R() < 0.45) grow(nx, ny, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), len * (0.35 + R() * 0.3), ww * 0.6, d - 1);
      cx = nx; cy = ny; }
    if (R() < 0.4) segs.push([cx, cy, cx + Math.cos(a + 0.4) * len * 0.08, cy + Math.sin(a + 0.4) * len * 0.08, w * 0.2]); };
  // two or three stems from the stool (alders coppiced long ago), each its own lean
  const stems = 1 + Math.floor(R() * 3);
  for (let k = 0; k < stems; k++) grow(X + (k - 1) * 0.15, WY, Math.PI / 2 + lean + (k - 1) * 0.18, h * (0.75 + R() * 0.35), o.w || 0.32, 3);
  return segs;
}
function drawTree(segs, Z, col, refl, o = {}) {
  let s = '', r = ''; const yw = P(0, WY, Z)[1];
  for (const [x0, y0, x1, y1, w] of segs) { const A = P(x0, y0, Z), B = P(x1, y1, Z), px = Math.max(0.7, w * K(Z));
    s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="${f1(px + 1.2)}" stroke-linecap="round"/>`;
    if (px > 1.2) s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${col}" stroke-width="${f1(px * 0.7)}" stroke-linecap="round"/>`;
    if (px > 3) s += `<path d="M${f1(A[0] - px * 0.25)} ${f1(A[1])} L${f1(B[0] - px * 0.25)} ${f1(B[1])}" stroke="${mix(col, MOON, 0.25)}" stroke-width="${f1(px * 0.15)}" stroke-linecap="round" opacity="0.6"/>`;
    if (refl) r += `<path d="M${f1(A[0] + (R() - 0.5) * 2)} ${f1(2 * yw - A[1])} L${f1(B[0] + (R() - 0.5) * 2)} ${f1(2 * yw - B[1])}" stroke="${refl}" stroke-width="${f1(px + 0.6)}" stroke-linecap="round" stroke-dasharray="${f1(6 + R() * 8)} ${f1(1 + R() * 2)}"/>`; }
  if (o.fungus) { const [x0, y0] = segs[0]; for (let k = 0; k < o.fungus; k++) { const p = P(x0 + 0.05, 0.4 + k * 0.35, Z); s += BK.shelf(p[0] + 2, p[1], Math.max(3, K(Z) * 0.22), mix('#7a7048', MIST, Math.min(0.6, Z / 60)), { n: 2 }); } }
  return { tree: s, refl: r };
}

layer('far');
// ---- the night sky: dark bands, a little paler round the moon; the moon low behind thin mist, stepped halo, mist across it
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
raw(G.sky([[0, '#0a0e0b'], [0.35, '#111712'], [0.55, '#1a221a'], [0.62, '#243024'], [1, '#2a362a']]) + G.stars(140, 0, 240, '#d8dcc8'));   // polish: smooth night gradient, stars
raw(S.GLOW(`<ellipse cx="${MX}" cy="${MY}" rx="260" ry="170" fill="url(#mhalo)"/>`)); S.DEFS.push(`<radialGradient id="mhalo"><stop offset="0" stop-color="${MOON}" stop-opacity="0.45"/><stop offset="0.25" stop-color="${MOON}" stop-opacity="0.16"/><stop offset="1" stop-color="${MOON}" stop-opacity="0"/></radialGradient>`);
raw(`<circle cx="${MX}" cy="${MY}" r="21" fill="${MOON}"/><path d="M${MX - 8} ${MY - 6} q5 -4 10 -1 M${MX + 3} ${MY + 6} q5 2 8 -3" stroke="#b8bca4" stroke-width="2" fill="none" opacity="0.6"/>`);
for (const [cx, cy, w, h] of [[MX - 60, MY + 10, 380, 52], [MX + 220, MY - 40, 300, 44], [MX - 380, MY - 90, 420, 60], [MX + 600, MY - 110, 360, 50], [MX + 360, MY + 40, 260, 34]]) raw(G.softCloud(cx, cy, w, h, '#2e3a2e', { op: 0.75, lit: '#7a8a72', dark: '#141a14' }));
// ---- distance: the far carr, a ragged low treeline, flat; mist lying on the water before it
{
  const pts = []; for (let x = -20; x <= W + 30; x += 24 + R() * 40) pts.push([x, 286 - 4 - Math.abs(Math.sin(x * 0.013)) * 8 - R() * 6]);
  raw(`<path d="${smooth([...pts, [W + 30, 302], [-20, 302]], true, 0.7)}" fill="${fog('#121812', 110)}"/>`);
  for (let i = 0; i < 26; i++) { const Z = 70 + R() * 40, X = -60 + R() * 120; const t = G.otree(X, WY, Z, 6 + R() * 6, { kind: 'dead', col: fog('#10140f', Z), roots: false }); raw(t.svg); }
}
// ---- the water, the moon's glade broken on it, then mist banks low
raw(BK.water(-90, 90, 3.0, 150, WATER, { y: WY, n: 340, lite: '#3a4a40', refl: [[MX, 70, MOON, 302, 470], [MX, 30, '#f0f4e0', 302, 440], [MX, 120, '#8a9a84', 302, 400]] }));
raw(G.softBank(-10, W + 10, 302, 14, { col: MIST, op: 0.3, ph: 1, below: 6 }) + G.softBank(-10, W + 10, 310, 10, { col: '#6a7868', op: 0.18, ph: 4, below: 4 }));
// ---- middle: dead alders standing in the water at every depth, their reflections; offering posts; a drowning stone
{
  // polish: organic alders spread unevenly through depth: clusters, gaps, one fallen, sizes from saplings to old stools
  const TREES = [[-26, 46, 9], [-23, 48, 6], [-14, 38, 8], [-7, 30, 10], [-6, 31.5, 5], [9, 34, 8], [18, 42, 11], [30, 50, 9], [-22, 26, 9], [14, 24, 7], [24, 28, 12], [26, 30, 6], [-30, 32, 8], [3, 58, 7], [-2, 64, 6], [36, 38, 7], [-40, 40, 10], [6, 20, 6.5]];
  for (const [X, Z, h] of TREES.sort((a, b) => b[1] - a[1])) { const t = G.otree(X, WY, Z, h, { kind: 'alder', col: fog('#20221c', Z, 0.8), lean: (R() - 0.5) * 0.25, mv: { excurrent: false, gnarl: 1.5, spread: 1.1, trunkH: 0.4, kids: [2, 4], lenK: [0.45, 0.7], stems: 1 + Math.floor(R() * 3) } }); const yw = P(0, WY, Z)[1]; raw(G.reflect(t.segs, yw, fog('#0a0e0c', Z, 0.5), 0.5) + t.svg); if (Z < 32) { const p0 = P(X + 0.05, 0.6, Z); raw(BK.shelf(p0[0] + 2, p0[1], Math.max(3, K(Z) * 0.22), mix('#7a7048', MIST, 0.4), { n: 2 })); } }
  { const Z = 22, a = P(-12, WY + 0.15, Z), b = P(-6.5, WY + 0.6, Z + 1); raw(G.limb([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 3], b], K(Z) * 0.35, K(Z) * 0.12, fog('#1c221a', Z))); }   // a fallen alder lying in the water
  // offering posts in the water: bog-oak, notched, braided cords tied round them, a weighted bundle at the foot
  for (const [X, Z, h] of [[-3.2, 15, 2.2], [4.6, 17, 1.8], [7.8, 13, 2.6], [-9.5, 12, 2.0]]) {
    raw(II.post(X, WY, h, Z, 0.26, fog('#1c160e', Z), { carve: 4, snap: R() < 0.5 }));
    const rf = P(X, WY, Z), rt = P(X, h, Z); raw(line([[rf[0], rf[1]], [rf[0] + (R() - 0.5) * 2, 2 * rf[1] - rt[1]]], Math.max(1.5, K(Z) * 0.3), fog('#141a14', Z, 0.7), 0.7));
    for (let k = 0; k < 2; k++) { const c = P(X, h * (0.4 + k * 0.3), Z - 0.15), w = K(Z) * 0.16; raw(`<path d="M${f1(c[0] - w)} ${f1(c[1])} q${f1(w)} ${f1(w * 0.3)} ${f1(w * 2)} 0" stroke="${INK}" stroke-width="${f1(Math.max(1.6, K(Z) * 0.05))}" fill="none"/><path d="M${f1(c[0] - w)} ${f1(c[1])} q${f1(w)} ${f1(w * 0.3)} ${f1(w * 2)} 0" stroke="${fog('#7a6a48', Z)}" stroke-width="${f1(Math.max(0.8, K(Z) * 0.03))}" fill="none" stroke-dasharray="2 1.5"/>`); }
    const b = P(X + 0.2, WY + 0.1, Z - 0.2), bw = K(Z) * 0.2; raw(cel([[b[0] - bw, b[1]], [b[0] + bw, b[1]], [b[0] + bw * 0.8, b[1] - bw * 0.8], [b[0] - bw * 0.7, b[1] - bw * 0.9]], { Z, fill: fog('#2a2418', Z), band: 1 }));
    raw(BK.ripples(rf[0], rf[1] + 1, K(Z) * 0.5, 2, '#5a6a5a', 0.35));
  }
  // the drowning stone: a holed stone hanging on its braided rope from a limb of the near-right alder, just over the water
  { const Z = 14, top = P(10.4, 5.2, Z), st = P(10.6, 0.9, Z), k = K(Z); raw(BK.rope([top, [top[0] + 3, (top[1] + st[1]) / 2], [st[0], st[1] - k * 0.2]], Math.max(1.2, k * 0.035), fog('#6a5a3a', Z)));
    raw(G.rockMass([[st[0] - k * 0.22, st[1]], [st[0] - k * 0.25, st[1] - k * 0.2], [st[0], st[1] - k * 0.3], [st[0] + k * 0.24, st[1] - k * 0.18], [st[0] + k * 0.2, st[1] + k * 0.05]], Z, fog('#3a3c34', Z), { fiss: 1 }) + `<ellipse cx="${f1(st[0])}" cy="${f1(st[1] - k * 0.14)}" rx="${f1(k * 0.05)}" ry="${f1(k * 0.04)}" fill="${INK}"/>`);
    const t = G.otree(11.2, WY, Z + 0.5, 6.5, { kind: 'alder', lean: 0.12, col: fog('#1e2019', Z, 0.8), mv: { excurrent: false, gnarl: 1.5, spread: 1.1, trunkH: 0.4, kids: [2, 4], lenK: [0.45, 0.7], stems: 2 } }); const yw = P(0, WY, Z + 0.5)[1]; raw(G.reflect(t.segs, yw, '#080c0a', 0.5) + t.svg + G.limb([P(11.2, 5.0, Z + 0.4), P(10.6, 5.25, Z + 0.4), P(10.2, 5.2, Z + 0.4)], K(Z) * 0.14, K(Z) * 0.06, fog('#1a2018', Z))); }
  // a bile scum drifting in a long skin on the still water, the only colour
  for (let k = 0; k < 9; k++) { const Z = 11 + R() * 14, X = -10 + R() * 20, c = P(X, WY + 0.002, Z), w = K(Z) * (0.8 + R() * 1.5); raw(`<path d="${smooth([[c[0] - w, c[1]], [c[0] - w * 0.3, c[1] - K(Z) * 0.03], [c[0] + w * 0.6, c[1] - K(Z) * 0.02], [c[0] + w, c[1] + 1], [c[0], c[1] + K(Z) * 0.04]], true, 0.6)}" fill="${II.BILED}" opacity="0.45"/>`); }
}
{ let g = ''; for (let k = 0; k < 70; k++) { const y = 303 + Math.pow(R(), 1.2) * 70, w = 6 + (y - 300) * 0.5 * R() + 4, x = MX + (R() - 0.5) * (14 + (y - 300) * 0.9); g += `M${f1(x - w / 2)} ${f1(y)} l${f1(w)} 0 `; } raw(S.GLOW(`<path d="${g}" stroke="${MOON}" stroke-width="1.2" opacity="0.55"/>`)); }
raw(BK.quiet(MURK, 300, 380, { steps: [0.06, 0.08, 0.1, 0.12], hop: 0.08 }));
raw(G.edges(MURK, { l: 200, r: 240, t: 90, steps: [0.18, 0.2, 0.22, 0.24] }));
// ---- the trackway: hurdles of woven hazel laid end to end just under the water's skin, running out into the mere,
// pegged down with stakes; water lies over them in a sheen; their edges ragged, brushwood bundles under them
{
  const Zend = 13;
  const half = z => 6.6 - (z - 3.2) * 0.42;
  for (let z = 3.2; z < Zend; z += 1.5) for (let x = -half(z) - 0.4; x < half(z); x += 1.9 + R() * 0.3) { const x0 = x + (R() - 0.5) * 0.3, x1 = x0 + 1.8 + R() * 0.2, sk = (R() - 0.5) * 0.25, z0 = z + (R() - 0.5) * 0.2, z1 = z0 + 1.35 + R() * 0.2, Y = WY + 0.02;
    if (x1 > half(z) + 0.6 || x0 < -half(z) - 0.6) continue;
    const Q = [[x0, Y, z0], [x1, Y, z0 + sk], [x1 + sk * 0.5, Y, z1 + sk], [x0 + sk * 0.5, Y, z1]];
    raw(`<path d="${pp(Q)}" fill="${tone('#2e281a', 0.15)}" stroke="#1a160e" stroke-width="${f1(Math.max(0.5, K(z) * 0.006))}"/>`);
    let wv = ''; for (let k = 1; k < 9; k++) { const t = k / 9, A = P(x0 + sk * 0.5 * t, Y, z0 + (z1 - z0) * t), B = P(x1 + sk * 0.5 * t, Y, z0 + sk + (z1 - z0) * t); wv += `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} `; } raw(`<path d="${wv}" stroke="#40362a" stroke-width="${f1(Math.max(0.6, K(z) * 0.02))}" opacity="0.7"/>`);
    let st = ''; for (let k = 0; k <= 4; k++) { const A = P(x0 + (x1 - x0) * k / 4, Y, z0 + sk * k / 4), B = P(x0 + (x1 - x0) * k / 4 + sk * 0.5, Y, z1 + sk * k / 4); st += `M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])} `; } raw(`<path d="${st}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, K(z) * 0.012))}" opacity="0.45"/>`); }
  // the water lying over the trackway, darker than the open mere, its edge ragged
  { const Ls = [], Rs = []; for (let z = 3.0; z <= Zend + 0.5; z += 0.5) { Ls.push(P(-half(z) - 0.3 - R() * 0.3, WY + 0.03, z)); Rs.push(P(half(z) + 0.3 + R() * 0.3, WY + 0.03, z)); } raw(`<path d="${smooth([...Ls, ...Rs.reverse()], true, 0.3)}" fill="#0a0e0c" opacity="0.35"/>`); }
  // the water's sheen over the hurdles: the moon's light lying in broken strokes, low contrast
  for (let k = 0; k < 140; k++) { const Z = 3.3 + Math.pow(R(), 1.3) * 10, X = (R() < 0.5 ? (MX - 740) * Z / 652 + (R() - 0.5) * 1.2 : -7 + R() * 14), [x, y] = P(X, WY + 0.03, Z), l = K(Z) * (0.2 + R() * 0.6); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="${R() < 0.6 ? '#6a7a68' : MOON}" stroke-width="${f1(Math.max(0.5, K(Z) * 0.01))}" opacity="${f1(0.15 + R() * 0.25)}"/>`); }
  for (let k = 0; k < 14; k++) { const X = -7 + R() * 14, Z = 3.6 + R() * 9, A = P(X, WY + 0.35, Z), B = P(X, WY, Z); raw(line([A, B], Math.max(1.2, K(Z) * 0.05), INK, 1) + line([A, B], Math.max(0.7, K(Z) * 0.03), '#3a2e1e', 1)); }
  raw(`<path d="${pp([[-30, WY + 0.03, 3], [30, WY + 0.03, 3], [30, WY + 0.03, 6], [-30, WY + 0.03, 6]])}" fill="${MURK}" opacity="0.3"/>`);
}

// ======================================================================== MID: low things on the trackway behind the fighters
layer('mid');
{
  // a sunk punt, its stern up out of the water; a wicker cage of the hags' half under, a broken hurdle tilted up
  const Z = 11.2, a = P(-6.0, WY, Z), b = P(-3.6, WY + 0.5, Z + 0.8), k = K(Z); raw(cel([[a[0], a[1]], [b[0], b[1]], [b[0] + k * 0.1, b[1] + k * 0.15], [a[0] + k * 0.3, a[1] + k * 0.05]], { Z, fill: '#1c1812', band: 1.5 }));
  const c = P(4.2, WY, 10.4), k2 = K(10.4); raw(`<path d="${smooth([[c[0] - k2 * 0.4, c[1]], [c[0] - k2 * 0.35, c[1] - k2 * 0.4], [c[0], c[1] - k2 * 0.55], [c[0] + k2 * 0.38, c[1] - k2 * 0.38], [c[0] + k2 * 0.4, c[1]]], true, 0.5)}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  for (let j = 0; j < 6; j++) raw(line([[c[0] - k2 * 0.35 + j * k2 * 0.14, c[1]], [c[0] - k2 * 0.2 + j * k2 * 0.08, c[1] - k2 * 0.5]], 1, '#3a3020', 0.8));
}

// ======================================================================== FORE: a great dead alder at the left edge reaching over the top; reeds
layer('fore');
{
  const t = G.otree(-3.75, -1, 3.2, 3.6, { kind: 'dead', lean: 0.3, col: '#1a1a14', mv: { spread: 1.4, gnarl: 1.5 } });   // frames the top left; trunk at the edge
  raw(t.svg);

  { const p = P(-3.45, 0.9, 3.2); raw(BK.shelf(p[0] + 18, p[1], 30, '#5e5634', { n: 3 }) + BK.shelf(p[0] + 12, p[1] - 70, 22, '#545030', { n: 2 })); }
  for (const [x, n] of [[W - 30, 26], [W - 120, 14], [240, 10]]) raw(II.reeds(x, H + 4, 90 + R() * 40, n, '#22261a', { heads: 0.3 }));
  raw(`<path d="${smooth([[W - 260, H + 4], [W - 200, H - 16], [W - 80, H - 22], [W + 10, H - 10], [W + 10, H + 4]], true, 0.5)}" fill="#0e120c" stroke="${INK}" stroke-width="1.4"/>`);
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
