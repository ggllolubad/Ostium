// World IX, the Hollow Barrow: THE VAULT OF THE DEAD (battle room, Living Ink). Room key 'barrow_tomb'.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430).
// Encounters: The Mould Vault (wights and worms in the grave-rot), The Witch's Tomb (she is tending the dead).
// The place: a burial vault deep under the mound, looking along it. Dry-stone walls rise straight to head height, lined
// with burial niches, each holding a body in grave linen; above, the courses step inward (corbelled) until great
// capstones close the roof. In the middle stands the rot witch's embalming slab with a body under a sheet, her bowls of
// salts, her herbs drying on a cord, her bone needles; one tallow lamp hangs on a chain over it: the only light, dim and
// bone-yellow, so the vault falls away into the dark on every side. Mould furs the walls in grey-green blooms and carpets
// the floor; a grave worm's burrow has broken up the flags, earth and bones heaped round it.
// Courses: TOXIN (mould bloom, caps, fur, rot, plague sores on the dead); FROST (grey rime in the joints and on the
// capstones, icicles from the corbels, the cold salts steaming). Palette: grey-green frost, bone, mould; the lamp is tallow.
// Usage: node scenes/bg_barrow_tomb.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IX');
const W = 1480, H = 480, ROOM = 'barrow_tomb';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 9303, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#f0ead0', shadowTint: '#141a14' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#0a0d0a', murk: '#080a08' });
const { BK, BL, air, glare, plates } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, box, post, beam, icicles, rime, mould, bracket, caps, pustules, steam } = BK;

const STONE = '#5a5e54', STONED = '#3a3e36', MOULD = '#7c8c62', MOULDD = '#4a5638', FROST = '#c4d0c4', BONE = '#d2cab2', LINEN = '#a8a28e', MURK = '#080a08', TALLOW = '#e8d8a0', LAMP = '#f4e4b0';
const ZEND = 22, XW = 7.2, YV = 1.8, CH = 0.36, NC = 6;     // the end wall, the straight wall, its height, corbel course height, courses
const Xc = k => XW - (k + 1) * 0.78;                            // the X of corbel course k (stepping inward)
const LP = [0.6, 2.75, 11.2];                                   // the lamp
const lamp = (c, p, k = 1) => { const d = Math.hypot(p[0] - LP[0], (p[1] - LP[1]) * 1.2, p[2] - LP[2]); return mix(mix(c, '#e8d8a0', Math.max(0, Math.min(0.55, (1 - d / 5) * 0.75)) * k), MURK, Math.max(0, Math.min(0.75, (d - 3) / 9))); };

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the end wall far off: dry-stone, a deeper niche in it with a seated dead, all nearly lost in the dark
{
  const at = (s, t) => [-XW + s, t, ZEND];
  raw(S.ashlar(at, XW * 2, YV + NC * CH, lamp(STONE, [0, 1, ZEND]), { scale: 0.6, rough: true, roughP: 0.6, vary: 0.25, mortar: 0.75 }));
  const n = [P(-0.8, 0.3, ZEND - 0.01), P(0.8, 0.3, ZEND - 0.01), P(0.8, 1.6, ZEND - 0.01), P(0, 2.0, ZEND - 0.01), P(-0.8, 1.6, ZEND - 0.01)];
  raw(fillP(n, '#050605') + inkP(n, 1) + fillS(blob(P(0, 0.9, ZEND)[0], P(0, 0.9, ZEND)[1], 8, 14, 9, 0.2), lamp(LINEN, [0, 1, ZEND]), 0.8));
}
// ---- the side walls: straight dry-stone to head height with the niches of the dead; above, the corbelled courses
// stepping in, each course's underside seen from below and rimed, icicles off the lips; mould blooming in the joints
function wall(sg) {
  const z0 = 3.4, z1 = ZEND, Lz = z1 - z0;
  // the straight lower wall
  raw(S.ashlar((s, t) => [sg * XW, t, z0 + s], Lz, YV, lamp(STONE, [sg * XW, 1, 10]), { scale: 0.5, rough: true, roughP: 0.6, vary: 0.3, mortar: 0.7, lost: 0.25 }));
  // the corbel courses
  for (let k = 0; k < NC; k++) {
    const x = sg * Xc(k), xb = sg * (k === 0 ? XW : Xc(k - 1)), y0 = YV + k * CH, y1 = y0 + CH;
    // the underside of the step (seen from below): a dark strip between the course below's face and this one's
    raw(fillP([P(xb, y0, z0), P(xb, y0, z1), P(x, y0, z1), P(x, y0, z0)], lamp('#22261e', [x, y0, 10])) + hatch3((s, t) => [xb + (x - xb) * t, y0, z0 + s], 0, Lz, 0, 1, 0.5, { op: 0.4 }));
    raw(S.ashlar((s, t) => [x, y0 + t, z0 + s], Lz, CH, lamp(k % 2 ? STONE : '#62665a', [x, y0, 11]), { scale: 0.34, wscale: 0.32 + (k % 3) * 0.12, courses: [0.55, 0.45], rough: true, roughP: 0.8, chip: 0.75, vary: 0.35, mortar: 0.75, lost: 0.35 }));
    // rime along the step's lip, icicles hanging off it (only over the near half: the far is lost in the dark)
    const lip = []; for (let Z = z0; Z <= z1; Z += 0.8) lip.push(P(xb, y0, Z));
    raw(rime(lip.map(([px, py]) => [px, py + 1]), 10, { th: 1.6, col: FROST, op: 0.55 }) + icicles(lip.filter((_, i) => i < 12), 8, { len: 10 + (NC - k) * 2, dens: 0.6, col: FROST, shadow: '#5e6c62', ph: k }));
  }
  // grey-green mould blooming over the walls in patches, thickest low, fur and caps in the joints
  for (let i = 0; i < 18; i++) { const Z = z0 + 0.5 + Math.pow(R(), 0.8) * (Lz - 1), Y = R() < 0.6 ? R() * 1.2 : 1.2 + R() * 1.8, X = Y < YV ? sg * XW : sg * Xc(Math.min(NC - 1, Math.floor((Y - YV) / CH))), c = P(X, Y, Z), k = K(Z); raw(mould(c[0], c[1], k * (0.3 + R() * 0.5), k * (0.2 + R() * 0.3), { col: lamp(MOULD, [X, Y, Z], 0.6) })); if (R() < 0.3) raw(caps(c[0], c[1] + k * 0.1, k * 0.2, Z, { col: lamp(BONE, [X, Y, Z]), n: 3 })); }
  // the niches: round-headed holes in the lower wall, each with its dead laid in grave linen (pale, end on), skulls in some
  for (let Z = z0 + 1.0; Z < z1 - 0.6; Z += 1.5 + R() * 0.3) for (const [y0, y1] of [[0.15, 0.75], [0.95, 1.6]]) {
    if (R() < 0.12) continue;
    const zz0 = Z, zz1 = Z + 0.9, x = sg * XW, mid = (zz0 + zz1) / 2, k = K(mid);
    const n = [P(x, y0, zz0), P(x, y0, zz1), P(x, y1 - 0.2, zz1), P(x, y1 - 0.06, zz1 - 0.15), P(x, y1, mid), P(x, y1 - 0.06, zz0 + 0.15), P(x, y1 - 0.2, zz0)];
    const ni = [...n.map(([a, b]) => [a, b])];
    raw(fillS(ni, '#121510', 1, 0.3) + `<path d="${smooth(ni, true, 0.3)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.6, S.inkW(mid)))}"/>`);
    // the inside: the back (deeper, toward the wall's outside), the far side wall of the niche lit faintly
    const d = 0.7, bk = [P(x + sg * d, y0 + 0.03, zz0 + 0.1), P(x + sg * d, y0 + 0.03, zz1 - 0.1), P(x + sg * d, y1 - 0.15, zz1 - 0.1), P(x + sg * d, y1 - 0.05, mid), P(x + sg * d, y1 - 0.15, zz0 + 0.1)];
    raw(fillP([n[1], n[2], bk[2], bk[1]], lamp('#2a2e26', [x, y0, mid], 0.6), 0.8));
    // the dead: a linen bundle lying along the niche (head toward us), its feet hidden; or bones and a skull
    if (R() < 0.75) { const hd = P(x + sg * 0.12, y0 + 0.18, zz0 + 0.2), ft = P(x + sg * 0.55, y0 + 0.16, zz1 - 0.2); const body = [[hd[0], hd[1] - k * 0.14], [ft[0], ft[1] - k * 0.1], [ft[0], ft[1] + k * 0.02], [hd[0], hd[1] + k * 0.04]];
      raw(fillS(body, lamp(LINEN, [x, y0, mid]), 1, 0.4) + fillS(body, 'url(#mottle)', 0.4, 0.4) + fillS(blob(hd[0], hd[1] - k * 0.06, k * 0.11, k * 0.1, 9, 0.2), lamp('#b8b09a', [x, y0, mid]), 1) + pline([[hd[0] - k * 0.04, hd[1] - k * 0.08], [hd[0] + k * 0.04, hd[1] - k * 0.08]], 0.8, '#2a2a22', 0.8));
      for (let j = 1; j < 4; j++) raw(pline([[hd[0] + (ft[0] - hd[0]) * j / 4, hd[1] - k * 0.13 + (ft[1] - hd[1]) * j / 4], [hd[0] + (ft[0] - hd[0]) * j / 4, hd[1] + k * 0.03 + (ft[1] - hd[1]) * j / 4]], 0.6, INK, 0.5));
      if (R() < 0.6) raw(mould((hd[0] + ft[0]) / 2, (hd[1] + ft[1]) / 2 - k * 0.06, k * 0.18, k * 0.06, { col: lamp(MOULD, [x, y0, mid]), n: 10 })); }
    else { const c = P(x + sg * 0.25, y0 + 0.12, mid), r = k * 0.1; raw(fillS(blob(c[0], c[1] - r, r, r * 0.9, 9, 0.15), lamp(BONE, [x, y0, mid])) + `<ellipse cx="${f1(c[0] - r * 0.35)}" cy="${f1(c[1] - r)}" rx="${f1(r * 0.25)}" ry="${f1(r * 0.22)}" fill="#141410"/><ellipse cx="${f1(c[0] + r * 0.3)}" cy="${f1(c[1] - r)}" rx="${f1(r * 0.24)}" ry="${f1(r * 0.21)}" fill="#141410"/>`); for (let j = 0; j < 3; j++) raw(line([[c[0] + sg * r * (1 + j * 0.8), c[1] - r * 0.2], [c[0] + sg * r * (2 + j), c[1] + 1]], 1.4, lamp(BONE, [x, y0, mid]))); }
    raw(rime([n[6], n[5], n[4], n[3], n[2]].map(([a, b]) => [a, b + 1]), mid, { th: 1.2, col: FROST, op: 0.6 }));
  }
}
wall(-1); wall(1);
// ---- the roof: the great capstones laid across the top course, each its own slab, rimed, with roots through the gaps
{
  const xr = Xc(NC - 1), yr = YV + NC * CH;
  for (let Z = 3.0; Z < ZEND; ) { const w = 0.8 + R() * 0.6, q = [P(-xr - 0.2, yr, Z + 0.03), P(xr + 0.2, yr, Z + 0.03), P(xr + 0.2, yr, Z + w - 0.03), P(-xr - 0.2, yr, Z + w - 0.03)]; raw(cel(chip(q, 0.3), { Z: Z + w / 2, fill: lamp(tone(STONED, 0.15), [0, yr, Z + w / 2]), band: Math.max(1, K(Z) * 0.05), tex: 'url(#mottle)', texOp: 0.5, hi: false }) + hatch3((s, t) => [-xr + s, yr, Z + t], 0, xr * 2, 0, w, 0.6, { op: 0.35 })); if (R() < 0.5) raw(fillS(blob(...P((R() - 0.5) * xr, yr, Z + w * 0.5), K(Z) * 0.3, K(Z) * 0.05, 9, 0.5), FROST, 0.4)); Z += w; }
  for (let i = 0; i < 18; i++) { const Z = 4 + R() * 12, a = P((R() - 0.5) * xr * 1.6, yr, Z), l = K(Z) * (0.3 + R() * 0.6); raw(line([a, [a[0] + (R() - 0.5) * 6, a[1] + l * 0.5], [a[0] + (R() - 0.5) * 8, a[1] + l]], Math.max(1, K(Z) * 0.025), '#5a5446', 0.85)); }
}
// ---- the floor: flags heaved and broken, carpeted with grey-green mould round the walls, the worm's burrow broken
// up through it with earth and bones heaped round
{
  raw(BK.flags(-XW, XW, 3.4, ZEND, STONED, { depth: 0.8, width: 0.95, missing: 0.06, cracks: 0.2, vary: 0.2, fogK: 0.3 }));
  for (let i = 0; i < 40; i++) { const Z = 3.6 + Math.pow(R(), 0.8) * 16, sg = R() < 0.5 ? -1 : 1, X = sg * (XW - R() * 2.4), c = P(X, 0.01, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * (0.4 + R() * 0.6), k * 0.06, 10, 0.5), lamp(MOULDD, [X, 0, Z], 0.6), 0.75) + (R() < 0.3 ? caps(c[0], c[1], k * 0.12, Z, { col: lamp(BONE, [X, 0, Z]), n: 3 }) : '')); }
  // the burrow: a hole broken up through the flags, slabs tipped round it, the earth heaped, bones in the spoil
  { const Z = 14.5, c = P(3.4, 0, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * 1.6, k * 0.3, 14, 0.35), '#2a241c') + fillS(blob(c[0], c[1] + 1, k * 0.8, k * 0.13, 12, 0.3), '#030303') + inkP(blob(c[0], c[1] + 1, k * 0.8, k * 0.13, 12, 0.3), 1));
    raw(plates([[c[0] - k * 1.4, c[1] + 2], [c[0] + k * 1.4, c[1] + 2]], 5, { size: [k * 0.3, k * 0.6], cols: [lamp('#6a6e62', [3, 0, Z]), lamp(STONED, [3, 0, Z]), '#1a1c18'], Z }));
    for (let j = 0; j < 6; j++) { const a = [c[0] - k * 1.2 + R() * k * 2.4, c[1] - k * 0.1 + R() * k * 0.2]; raw(line([a, [a[0] + k * (0.15 + R() * 0.2), a[1] + (R() - 0.5) * 3]], 1.6, lamp(BONE, [3, 0, Z]))); } }
}
// ---- the lamp's light: the room's one light, a tallow flame in an iron cage-lamp on its chain from the capstones; a
// stepped glare round it, its light lying on the slab and fading out across the vault
{
  const c = P(...LP), k = K(LP[2]);
  raw(G.radGlow(c[0], c[1] + 40, 320, 190, '#e8d8a0', 0.3, { mid: 0.3, midOp: 0.5 }) + G.radGlow(c[0], c[1], k * 0.7, k * 0.6, '#fff4d0', 0.9));
  // the lamp's pool of light on the floor under the slab
  { const f = P(LP[0], 0, LP[2]); raw(G.radGlow(f[0], f[1] + 2, K(LP[2]) * 3.2, K(LP[2]) * 0.5, '#e8d8a0', 0.35)); }
  raw(BK.chain([P(LP[0], YV + NC * CH, LP[2]), [c[0], c[1] - k * 0.16]], 1.4, '#3a3834'));
  raw(cel([[c[0] - k * 0.1, c[1] - k * 0.14], [c[0] + k * 0.1, c[1] - k * 0.14], [c[0] + k * 0.12, c[1] + k * 0.06], [c[0] - k * 0.12, c[1] + k * 0.06]], { Z: LP[2], fill: '#2a2824', band: 1.5 }));
  raw(EM(fillS([[c[0] - k * 0.04, c[1] + k * 0.02], [c[0], c[1] - k * 0.11], [c[0] + k * 0.04, c[1] + k * 0.02]], LAMP, 1, 0.5)));
  for (const dx of [-0.08, 0, 0.08]) raw(pline([[c[0] + k * dx, c[1] - k * 0.14], [c[0] + k * dx * 1.2, c[1] + k * 0.06]], 1, INK));
  raw(G.softSteam(c[0], c[1] - k * 0.16, 50, 6, { n: 5, op: 0.25, col: '#6a6a60', wisps: 1 }));
}
// ---- the embalming slab under the lamp: a stone table, a body under a stained sheet, the witch's bowls of cold salts
// steaming, a jar of herbs, bone needles and thread laid out, a cord of herbs drying overhead
{
  const Z = LP[2] + 0.3, x0 = -0.6, x1 = 1.9, y1 = 0.85;
  raw(BK.box(x0, x1, 0, y1, Z - 0.4, Z + 0.5, { col: lamp('#6a6c62', [0.6, 0.8, Z], 1.2), shadeOp: 0.45 }));
  const k = K(Z), top = []; const prof = [0.12, 0.22, 0.2, 0.24, 0.26, 0.22, 0.16, 0.18, 0.12]; for (let i = 0; i <= 8; i++) top.push(P(x0 + 0.1 + (x1 - x0 - 0.2) * i / 8, y1 + prof[i], Z));
  const sh = [P(x0 - 0.05, y1 - 0.25, Z - 0.42), ...top, P(x1 + 0.05, y1 - 0.25, Z - 0.42)];
  raw(cel(sh, { Z, fill: lamp(LINEN, [0.6, 1, Z], 1.4), band: 3 }) + fillS(sh, 'url(#mottle)', 0.4) + fillS(blob(top[3][0], top[3][1] + 4, k * 0.3, k * 0.06, 9, 0.4), '#5a5a3a', 0.5));
  for (let i = 1; i < 8; i++) raw(pline([[top[i][0], top[i][1] + 2], [top[i][0] + (R() - 0.5) * 4, sh[0][1] - 2]], 0.7, INK, 0.45));
  // grey feet out of the sheet's end, a bubo-blackened toe
  { const f = top[8]; raw(fillS(blob(f[0] + k * 0.05, f[1] + k * 0.06, k * 0.06, k * 0.05, 8, 0.2), lamp('#8e968a', [1.9, 1, Z]))); }
  // the bowls of cold salts, steaming cold; a jar; bone needles
  for (const [dx, r] of [[-0.35, 0.14], [2.15, 0.12]]) { const c = P(x0 + dx, y1 + 0.02, Z - 0.25); raw(cel([[c[0] - k * r, c[1] - k * 0.06], [c[0] + k * r, c[1] - k * 0.06], [c[0] + k * r * 0.7, c[1] + k * 0.04], [c[0] - k * r * 0.7, c[1] + k * 0.04]], { Z, fill: lamp('#5a5a50', [0, 1, Z]), band: 1.2 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - k * 0.06)}" rx="${f1(k * r)}" ry="${f1(k * 0.03)}" fill="#e8ecdc"/>` + G.softSteam(c[0], c[1] - k * 0.08, 36, 6, { n: 5, op: 0.35, col: '#e8ece0', wisps: 1 })); }
  { const a = P(1.2, y1 + 0.02, Z - 0.38); for (let j = 0; j < 4; j++) raw(pline([[a[0] + j * 2.4, a[1]], [a[0] + j * 2.4 + 6, a[1] - 1]], 1, BONE)); }
  // the cord of drying herbs strung across over the slab, the bundles hanging
  { const a = P(-2.4, 2.2, Z + 0.4), b = P(3.6, 2.25, Z + 0.4); raw(line([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6], b], 1, '#5a5446')); for (let i = 1; i < 8; i++) { const t = i / 8, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 6; raw(fillS([[x - 3, y], [x + 3, y], [x + 2, y + 14 + R() * 6], [x - 2, y + 13]], lamp('#5a6a44', [0.6, 2, Z]), 0.9) + pline([[x, y], [x, y + 3]], 1.4, '#5a4a36')); } }
}
// ---- the quiet band: stepped toward the dark behind the fighters (deep: this is the darkest room in the world)
raw(BL.quiet(MURK, 236, 360, { steps: [0.1, 0.12, 0.15, 0.18], hop: 0.15 }));
// the darkness closing in round the edges of the lamp's reach (stepped veils at the frame's corners and top)
for (const [cx, cy, r] of [[0, 0, 620], [W, 0, 620], [0, H, 400], [W, H, 400]]) raw(G.radGlow(cx, cy, r, r * 0.85, MURK, 0.85, { mid: 0.45, midOp: 0.7 }));
// spores hanging in the lamplight
{ let m = ''; for (let k = 0; k < 70; k++) m += `<circle cx="${f1(560 + R() * 360)}" cy="${f1(120 + R() * 200)}" r="${f1(0.4 + R() * 0.8)}" fill="${R() < 0.5 ? '#e8dcb0' : '#a8b88a'}" opacity="${f1(0.15 + R() * 0.35)}"/>`; raw(m); }

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  // the witch's basket of grave linen and a pail of lime, low beside the slab; a toppled urn of ashes
  const Z = 10.0, c = P(-2.8, 0, Z), k = K(Z);
  raw(cel([[c[0] - k * 0.3, c[1]], [c[0] - k * 0.34, c[1] - k * 0.32], [c[0] + k * 0.34, c[1] - k * 0.32], [c[0] + k * 0.3, c[1]]], { Z, fill: '#3a3428', band: 2 }) + fillS(blob(c[0], c[1] - k * 0.36, k * 0.32, k * 0.1, 10, 0.4), '#7a766a') + pline([[c[0] - k * 0.3, c[1] - k * 0.16], [c[0] + k * 0.3, c[1] - k * 0.16]], 0.8, INK, 0.6));
  { const c2 = P(4.6, 0.18, 9.6), k2 = K(9.6); raw(cel(blob(c2[0], c2[1], k2 * 0.24, k2 * 0.17, 12, 0.08), { Z: 9.6, fill: '#3a3a32', band: 2 }) + `<ellipse cx="${f1(c2[0] + k2 * 0.22)}" cy="${f1(c2[1])}" rx="${f1(k2 * 0.05)}" ry="${f1(k2 * 0.13)}" fill="#0a0a08"/>` + fillS(blob(c2[0] + k2 * 0.6, c2[1] + k2 * 0.15, k2 * 0.4, k2 * 0.05, 9, 0.4), '#6a685c', 0.8)); }
}

// ======================================================================== FORE: framing
layer('fore');
{
  // top: the nearest capstone right overhead, its underside rough and rimed, roots and drips hanging from its edge
  const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 30 + Math.sin(k * 0.7) * 6 + R() * 5]);
  raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3, fill: '#1e201a', band: 6 }) + fillP([[-5, -5], [W + 5, -5], ...e.slice().reverse()], S.hatchA(3), 0.45) + rime(e, 3, { th: 3, col: FROST, op: 0.6 }) + icicles(e, 3, { len: 30, dens: 0.35, col: FROST, shadow: '#5e6c62' }));
  for (let k = 0; k < 9; k++) { const x = R() * W; raw(line([[x, 30], [x + (R() - 0.5) * 10, 60 + R() * 40], [x + (R() - 0.5) * 16, 100 + R() * 60]], 2 + R() * 2, '#4e483c')); }
  // left: the near orthostat (a standing slab at the vault's mouth), a niche in it with a skull, mould down it
  const sl = [[-10, 30], [68, 34], [74, 200], [64, 330], [70, H + 10], [-10, H + 10]];
  raw(cel(sl, { Z: 4, fill: '#2a2e26', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + G.stoneV2(sl, 4, '#2a2e26') + fillP(sl, S.hatchA(4), 0.35) + rime([[68, 34], [74, 200], [64, 330]].reverse(), 4, { th: 4, col: FROST }));
  raw(mould(40, 300, 30, 80, { col: '#4a5638' }) + caps(56, 400, 22, 4, { col: '#b8b09a', n: 4 }));
  { const c = [32, 160]; raw(fillS([[c[0] - 22, c[1] + 26], [c[0] - 22, c[1] - 6], [c[0] - 14, c[1] - 20], [c[0], c[1] - 26], [c[0] + 14, c[1] - 20], [c[0] + 22, c[1] - 6], [c[0] + 22, c[1] + 26]], '#0c0e0a', 1, 0.3) + cel(blob(c[0] + 2, c[1] + 12, 12, 10, 10, 0.2), { Z: 4, fill: '#6a665a', band: 3 }) + fillS([[c[0] - 4, c[1] + 10], [c[0], c[1] + 7], [c[0] + 1, c[1] + 12], [c[0] - 3, c[1] + 14]], '#141410') + fillS([[c[0] + 5, c[1] + 9], [c[0] + 9, c[1] + 8], [c[0] + 10, c[1] + 13], [c[0] + 6, c[1] + 13]], '#141410') + mould(c[0] + 4, c[1] + 18, 10, 4, { col: '#4a5638' })); }
  // right: a heap of bones swept from the niches into the corner, low, a skull on top, mould and caps
  { const pile = [[W - 210, H + 5], [W - 170, H - 26], [W - 110, H - 44], [W - 40, H - 52], [W + 10, H - 40], [W + 10, H + 5]]; raw(fillS(pile, '#3a3a30', 1, 0.4));
    for (let i = 0; i < 26; i++) { const x = W - 190 + R() * 190, y = H - 10 - R() * 36, l = 12 + R() * 22, a = (R() - 0.5) * 2; raw(line([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * 0.4]], 4, INK) + line([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * 0.4]], 2.4, '#8a8470')); }
    { const c = [W - 70, H - 50]; raw(cel(blob(c[0], c[1], 15, 12, 10, 0.2, 0.4), { Z: 4, fill: '#7a7466', band: 3 }) + fillS([[c[0] - 8, c[1] - 2], [c[0] - 3, c[1] - 4], [c[0] - 2, c[1] + 2], [c[0] - 7, c[1] + 3]], '#141410') + fillS([[c[0] + 2, c[1] - 3], [c[0] + 7, c[1] - 2], [c[0] + 7, c[1] + 3], [c[0] + 2, c[1] + 2]], '#141410') + mould(c[0], c[1] - 8, 10, 4, { col: '#4a5638' })); }
    raw(mould(W - 120, H - 20, 40, 10, { col: '#4a5638' }) + caps(W - 150, H - 30, 18, 4, { col: '#b8b09a', n: 4 })); }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
