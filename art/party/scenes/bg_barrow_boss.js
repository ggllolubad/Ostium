// World IX, the Hollow Barrow: THE KING'S CHAMBER (boss room, Living Ink). Room key 'barrow_boss'. Boss: The Barrow
// King ("He sealed his kingdom in the barrow to stop the plague. The plague was already inside."), with a Barrow Draugr.
// Contract as the nave (1480 x 480 at 2x; far opaque, mid and fore transparent; horizon 300, eye 1.2 m, focal 652,
// cx 740; fighters at 6 m, feet on y 430). The right 45 % of the frame is the boss's stage.
// The place (polish round, redesigned so it is not a second barrow_tomb): the king's chamber at the heart of the great
// barrow, its roof fallen in, open to the sky inside a crater of frozen earth with the turf lip and roots hanging over it.
// The great carved slabs of the chamber stand in a ring, capstones fallen against them, snow sifting in. Midwinter dawn:
// the low sun stands in the notch where the passage was cut through the mound, and its light runs straight across the
// chamber to the king on his grave-throne; every slab throws a long shadow toward us. The brightest single light in the
// world, on the left third where the boss cannot cover it. Round the walls the household sits in the dark where they were placed, and the grave
// goods are heaped: chests, shields, spears, cauldrons, tarnished silver.
// Courses: FROST (rime in the hollows of the carving, icicles from every corbel, frozen breath of spores in the beam);
// TOXIN (mould bloom on the slabs and the dead, caps, plague sores). Palette: grey-green frost, bone, mould, tarnished
// silver; the sun's beam pale; no gold (nothing holy here), no red.
// Usage: node scenes/bg_barrow_boss.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'IX');
const W = 1480, H = 480, ROOM = 'barrow_boss';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 9404, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, keyTint: '#f4f0dc', shadowTint: '#121612' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, smooth, chip, tone, crack, GLOW, EM } = S;
const G = require('./battle_kit_g3')(S, { air: '#0a0c0a', murk: '#070807' });
const { BK, BL, air, glare, plates } = G;
const { line, pline, fillP, fillS, inkP, blob, jag, lump, box, post, beam, icicles, rime, mould, bracket, caps, pustules, steam } = BK;

const STONE = '#5e6258', STONED = '#363a32', MOULD = '#7c8c62', FROST = '#c4d0c4', BONE = '#d2cab2', LINEN = '#a8a28e', SILV = '#8a8e88', MURK = '#070807', SUN = '#f2ecd2', TIM = '#3e3a30';
const ZB = 17, XS = 10;                            // the old chamber's back line (grave goods), the household's wall
const SX = 378, SY = 196, NX = -19;               // the sun in the notch (screen), the notch's X on the crater's back bank
const SUNW = [-19, 4.5, 40];                       // the sun's direction as a world point (for the slabs' shadows)
// the beam: from the light-box high in the front-left wall, down across the chamber to the back wall behind the throne
const B0 = [-19, 10, 34], B1 = [9.6, 5.4, ZB];
const inBeam = p => { const v = [B1[0] - B0[0], B1[1] - B0[1], B1[2] - B0[2]], L = Math.hypot(...v), u = v.map(x => x / L), w = [p[0] - B0[0], p[1] - B0[1], p[2] - B0[2]], t = w[0] * u[0] + w[1] * u[1] + w[2] * u[2], d = Math.hypot(w[0] - u[0] * t, w[1] - u[1] * t, w[2] - u[2] * t); return Math.max(0, 1 - d / 2.4); };
const lit = (c, p, k = 1) => mix(c, '#e8e0c0', Math.min(0.55, inBeam(p) * 0.6) * k);
const dk = (c, Z) => mix(c, '#2a302a', Math.max(0, Math.min(0.35, (Z - 8) / 30)));

// spirals and lozenges pecked into a slab face (screen, centre and radius), worn, rime caught in the grooves
function spiral(x, y, r, o = {}) { let d = ''; const turns = 2.6 + R(), n = 60, dir = R() < 0.5 ? 1 : -1, a0 = R() * 6; for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + dir * t * turns * Math.PI * 2, rr = r * (0.1 + t * 0.9); d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * rr) + ' ' + f1(y + Math.sin(a) * rr * (o.sy || 1)) + ' '; } return `<path d="${d}" stroke="${INK}" stroke-width="${f1(Math.max(0.8, r * 0.09))}" fill="none" opacity="0.75"/><path d="${d}" stroke="${FROST}" stroke-width="${f1(Math.max(0.4, r * 0.04))}" fill="none" opacity="0.4" transform="translate(0.8,0.8)"/>`; }
function lozenges(x0, y0, x1, y1, n) { let d = ''; for (let i = 0; i < n; i++) { const t = i / n, t2 = (i + 1) / n, xa = x0 + (x1 - x0) * t, xb = x0 + (x1 - x0) * t2, ym = (y0 + y1) / 2; d += `M${f1(xa)} ${f1(ym)} L${f1((xa + xb) / 2)} ${f1(y0)} L${f1(xb)} ${f1(ym)} L${f1((xa + xb) / 2)} ${f1(y1)} Z `; } return `<path d="${d}" stroke="${INK}" stroke-width="1" fill="none" opacity="0.6"/>`; }
// a great upright slab on the plane at(s,t): its face, chipped edges, carving, mould low, rime
function slab(at, s0, s1, h, col, o = {}) {
  const q = [at(s0, 0), at(s1, 0), at(s1 - 0.04, h * (0.97 + R() * 0.03)), at(s0 + (s1 - s0) * (0.3 + R() * 0.4), h * (0.99 + R() * 0.02)), at(s0 + 0.04, h * (0.95 + R() * 0.04))].map(p => P(...p));
  const mid = at((s0 + s1) / 2, h / 2), k = K(mid[2]);
  const cq = chip(q, 0.4), fl = lit(dk(tone(col, 0.12), mid[2]), mid);
  let s = cel(cq, { Z: mid[2], fill: fl, band: Math.max(1.5, k * 0.08), tex: 'url(#mottle)', texOp: 0.5 }) + G.stoneV2(cq, mid[2], fl);
  const c = P(...at((s0 + s1) / 2, h * 0.6)); if (o.spirals !== false) { s += spiral(c[0] - k * 0.25, c[1], k * 0.32) + (s1 - s0 > 1.4 ? spiral(c[0] + k * 0.4, c[1] + k * 0.3, k * 0.26) : ''); const l0 = P(...at(s0 + 0.15, h * 0.22)), l1 = P(...at(s1 - 0.15, h * 0.32)); s += lozenges(l0[0], l0[1], l1[0], l1[1], Math.max(3, Math.round((s1 - s0) * 3))); }
  s += mould(P(...at((s0 + s1) / 2, 0.4))[0], P(...at(0, 0.4))[1], k * (s1 - s0) * 0.35, k * 0.3, { col: dk(MOULD, mid[2]) });
  s += rime([q[4], q[3], q[2]], mid[2], { th: Math.max(1.2, k * 0.05), col: FROST, op: 0.7 });
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- polish round: the chamber is now OPEN TO THE SKY (a different kind of space and light from barrow_tomb). The
// barrow's crown has fallen in: we stand in the heart of the mound, inside a crater of frozen earth with the turf lip and
// roots hanging over it, the great carved slabs of the chamber standing in a ring, capstones fallen against them, snow
// sifting in. Dawn at midwinter: the low sun stands in the notch where the passage was cut through the mound (left
// third, visible), and its light runs straight across the chamber to the king; every slab throws a long shadow toward us.
// the sky: a smooth dawn gradient, pale and cold at the notch, grey-green above; soft clouds
raw(`<rect width="${W}" height="${H}" fill="#5a6460"/>` + G.skyGrad([[0, '#3e4a4c'], [0.3, '#6a7672'], [0.6, '#b8bca8'], [0.75, '#dcdcc6']], { y0: 0, y1: 280 }));
raw(G.radGlow(SX, SY, 460, 240, '#f4f0d8', 0.9, { mid: 0.3, midOp: 0.5 }));
for (let i = 0; i < 10; i++) { const x = R() * W, y = 20 + R() * 120, w = 200 + R() * 260, near = Math.max(0, 1 - Math.hypot(x - SX, (y - SY) * 2) / 500); raw(G.softCloud(x, y, w, w * 0.2, { mid: mix('#5a6664', '#d8d4bc', near), shade: mix('#3e4a4c', '#a8a890', near), lit: mix('#7a8680', '#fff8e4', near), op: 0.85, inkOp: 0.1 })); }
// the crater's back bank: frozen earth rising to the turf lip, the notch cut through it where the passage ran (the sun in
// it), roots and frost on the bank, stones of the fallen roof embedded; snow lying on its ledges
{
  const Z = 34, rimY = X => 10.2 + 0.6 * Math.sin(X * 0.13) + 0.35 * Math.sin(X * 0.47 + 1) + 0.15 * Math.sin(X * 1.9) - 4.6 * Math.exp(-Math.pow((X - NX) / 3.0, 4));
  const top = []; for (let X = -44; X <= 44; X += 1) top.push(P(X, rimY(X), Z));
  const poly = [...top, P(44, -1, Z), P(-44, -1, Z)];
  { const cb = S.id('bk'); raw(fillS(poly, '#2e2a22', 1, 0.3) + fillS(poly, 'url(#mottle)', 0.6, 0.3) + `<clipPath id="${cb}"><path d="${smooth(poly, true, 0.3)}"/></clipPath><g clip-path="url(#${cb})">` + hatch3((s2, t) => [-44 + s2, t, Z], 0, 88, 0, 12, 0.7, { op: 0.3 }) + '</g>'); }
  // strata of the mound's earth and the turf lip overhanging the top, snow on it
  for (let k = 0; k < 6; k++) { const pts = []; for (let X = -44; X <= 44; X += 2) pts.push(P(X, rimY(X) - 1.2 - k * 1.6 + Math.sin(X * 0.3 + k) * 0.3, Z)); raw(line(pts, 1.2, k % 2 ? '#2a2620' : '#4a4436', 0.6)); }
  raw(line(top, 7, '#2e2c22') + line(top.map(([x, y]) => [x, y - 3]), 4, '#e4e8dc', 0.95) + line(top, 1.2, INK, 0.8));
  for (let i = 0; i < 110; i++) { const X = -42 + R() * 84; if (Math.abs(X - NX) < 3.4) continue; const p = P(X, rimY(X) - 0.2, Z), l = 14 + R() * 50; raw(`<path d="${smooth([p, [p[0] + (R() - 0.5) * 5, p[1] + l * 0.5], [p[0] + (R() - 0.5) * 8, p[1] + l]], false, 0.6)}" stroke="#6a6250" stroke-width="${f1(0.8 + R() * 1.4)}" fill="none" opacity="0.85"/>`); }
  for (let i = 0; i < 16; i++) { const X = -40 + R() * 80, Y = 1 + R() * 7; if (Y > rimY(X) - 1) continue; const c = P(X, Y, Z), r = K(Z) * (0.3 + R() * 0.5); raw(lump(blob(c[0], c[1], r, r * 0.6, 9, 0.3), Z, '#5a5e54', { band: 1.5 }) + fillS(blob(c[0] - r * 0.2, c[1] - r * 0.5, r * 0.7, r * 0.15, 8, 0.4), '#dcdcd0', 0.9)); }
  // the notch's lit edges and the sun in it, low; its light spilling down the notch's slope
  { const nb = []; for (let X = NX - 4; X <= NX + 4; X += 0.5) nb.push(P(X, rimY(X), Z)); const cid = S.id('nt'); raw(`<clipPath id="${cid}"><path d="${p2([...nb, [nb[nb.length - 1][0], -10], [nb[0][0], -10]])}"/></clipPath><g clip-path="url(#${cid})">` + G.radGlow(SX, SY, 120, 100, '#fffef6', 1) + `<circle cx="${SX}" cy="${SY}" r="18" fill="#ffffff"/></g>` + line(nb, 3, '#f8f0d4', 0.8)); }
  raw(G.radGlow(SX, SY + 50, 220, 70, '#f0ead0', 0.45));
}
// the ring of great slabs standing round the chamber (an arc), leaning, carved, capstones fallen against them, snow on
// their tops; their long shadows thrown toward us by the low sun
const RING = []; for (let i = 0; i < 9; i++) { const a = Math.PI * (0.95 - i * 0.1), X = 3 + Math.cos(a) * 12, Z = 17 + Math.sin(a) * 6; RING.push([X, Z, 2.4 + R() * 1.4, 1.3 + R() * 0.8, (R() - 0.5) * 0.12]); }
{
  // the floor first: flags under drifted snow, frost in the joints
  raw(BK.flags(-16, 16, 3.6, 30, STONED, { depth: 1.1, width: 1.4, missing: 0.03, cracks: 0.2, vary: 0.2, fogK: 0.3 }));
  for (let i = 0; i < 40; i++) { const Z = 4 + Math.pow(R(), 0.8) * 22, X = (R() - 0.5) * 28, c = P(X, 0.01, Z), k = K(Z); raw(fillS(blob(c[0], c[1], k * (0.6 + R() * 1.2), k * 0.08, 10, 0.5), '#c8ccc0', 0.75)); }
  // the shadows: from each slab's foot, away from the sun, long and soft-edged, darker near the slab
  for (const [X, Z, h, w] of RING) { const dx = X - SUNW[0], dz = Z - SUNW[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, len = h * 3.2;
    const q = [[X - uz * w * 0.5, 0.01, Z + ux * w * 0.5], [X + uz * w * 0.5, 0.01, Z - ux * w * 0.5], [X + uz * w * 0.6 + ux * len, 0.01, Z - ux * w * 0.6 + uz * len], [X - uz * w * 0.6 + ux * len, 0.01, Z + ux * w * 0.6 + uz * len]].map(p => P(...p));
    raw(`<path d="${p2(q)}" fill="#1a2018" opacity="0.4" filter="url(#soft)"/>`); }
  // the slabs, far ones first
  for (const [X, Z, h, w, lean] of RING.slice().sort((a, b) => b[1] - a[1])) { const at = (s2, t) => [X - w / 2 + s2 + lean * t, t, Z]; raw(slab(at, 0, w, h, STONE, { spirals: R() < 0.7 })); const tp = [P(X - w / 2 + lean * h, h, Z), P(X + w / 2 + lean * h, h, Z)]; raw(line(tp.map(([x, y]) => [x, y - 2]), 4, '#e4e8dc', 0.95)); }
  // capstones fallen in: great slabs lying tipped against the ring
  for (const [X, Z, a] of [[-7.5, 19, -0.5], [12.5, 20.5, 0.6]]) { const c = P(X, 1.2, Z), k = K(Z), q = [[c[0] - k * 2.2 * Math.cos(a), c[1] + k * 1.0], [c[0] - k * 2.0 * Math.cos(a), c[1] + k * 0.6 - k * 1.2 * Math.sin(-a)], [c[0] + k * 2.0 * Math.cos(a), c[1] - k * 1.4 * Math.sin(-a) - k * 0.6], [c[0] + k * 2.2 * Math.cos(a), c[1] - k * 1.4 * Math.sin(-a) - k * 0.2]]; raw(cel(chip(q, 0.3), { Z, fill: tone('#4e5248', 0.1), band: k * 0.12, tex: 'url(#mottle)', texOp: 0.5 }) + line([q[1], q[2]].map(([x, y]) => [x, y - 2]), 3, '#e4e8dc', 0.9)); }
  // the king's recess behind the throne: two tall slabs and a carved lintel (its top shows above the throne's posts)
  { const at = (s2, t) => [5.2 + s2, t, 20]; raw(slab(at, 0, 1.8, 5.6, '#686c62') + slab(at, 7.6, 9.4, 5.8, '#686c62') + beam([4.8, 6.0, 19.9], [15.0, 6.1, 19.9], 0.8, '#5a5e54', { chip: true })); const l0 = P(5, 6.0, 19.8), l1 = P(14.8, 6.1, 19.8); raw(lozenges(l0[0], l0[1] - 10, l1[0], l1[1] + 8, 14) + line([[l0[0], l0[1] - 14], [l1[0], l1[1] - 14]], 4, '#e4e8dc', 0.9)); }
}
// ---- the grave goods heaped along the back wall and round the recess: chests, shields, spears in a sheaf, a cauldron,
// tarnished silver cups and a mask, drinking horns; the beam catching some of it
{
  const Z = ZB - 0.8;
  for (const [X, w, h] of [[-8, 1.2, 0.7], [-5.6, 1.0, 0.6], [-2.4, 1.3, 0.75], [9.6, 1.1, 0.65]]) raw(box(X, X + w, 0, h, Z - 0.6, Z, { col: lit(dk('#4a4030', Z), [X, h, Z], 1.5), shadeOp: 0.45 }) + rime([P(X, h + 0.02, Z - 0.6), P(X + w, h + 0.02, Z - 0.6)], Z, { th: 1.6, col: FROST, op: 0.7 }));
  for (const [X, r] of [[-6.8, 0.55], [-0.6, 0.5], [1.4, 0.6]]) { const c = P(X, 0.9 + r, Z - 0.3), k = K(Z), p = [X, 1, Z]; raw(`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(k * r)}" fill="${lit(dk('#5a5a4c', Z), p, 1.5)}" stroke="${INK}" stroke-width="1.2"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(k * r * 0.24)}" fill="${lit(dk(SILV, Z), p, 1.5)}" stroke="${INK}" stroke-width="0.8"/>` + rime(Array.from({ length: 8 }, (_, i) => { const a = Math.PI + i / 7 * Math.PI; return [c[0] + Math.cos(a) * k * r, c[1] + Math.sin(a) * k * r]; }), Z, { th: 1.6, col: FROST }) + mould(c[0] + k * r * 0.3, c[1] + k * r * 0.5, k * r * 0.4, k * r * 0.25, { col: MOULD })); }
  for (let i = 0; i < 6; i++) { const X = -4.2 + i * 0.12, a = P(X, 0, Z - 0.2), b = P(X - 0.3 + i * 0.12, 3.0 + R() * 0.3, Z - 0.1); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, lit(dk('#5a5040', Z), [X, 2, Z], 1.5)) + fillP([[b[0] - 2, b[1] + 4], [b[0], b[1] - 8], [b[0] + 2, b[1] + 4]], lit(dk(SILV, Z), [X, 3, Z], 1.5))); }
  { const c = P(6.6, 0.45, Z - 0.4), k = K(Z), r = k * 0.5; raw(cel(blob(c[0], c[1], r, r * 0.7, 14, 0.05), { Z, fill: lit(dk('#2e2c28', Z), [6.6, 0.5, Z], 1.5), band: 4 }) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1] - r * 0.6)}" rx="${f1(r * 0.9)}" ry="${f1(r * 0.13)}" fill="${mix(FROST, MURK, 0.3)}" stroke="${INK}" stroke-width="1"/>`); }
  for (const [X, Y] of [[-2.0, 0.78], [-1.6, 0.78], [9.9, 0.68]]) { const c = P(X, Y, Z - 0.5), k = K(Z); raw(cel([[c[0] - k * 0.07, c[1]], [c[0] + k * 0.07, c[1]], [c[0] + k * 0.05, c[1] - k * 0.08], [c[0] + k * 0.1, c[1] - k * 0.2], [c[0] - k * 0.1, c[1] - k * 0.2], [c[0] - k * 0.05, c[1] - k * 0.08]], { Z, fill: lit(dk(SILV, Z), [X, Y, Z], 1.6), band: 1 })); }
}
// ---- the household along the side wall at the left, seated where they were placed, in the dark, frozen, mould-furred
for (let Z = 7.5; Z < ZB - 2; Z += 1.4) { const X = -XS + 0.6, b = P(X, 0.5, Z), k = K(Z), col = dk(mix(LINEN, '#4a4e44', 0.5), Z);
  const body = [[b[0] - k * 0.22, b[1] + 2], [b[0] - k * 0.2, b[1] - k * 0.6], [b[0] - k * 0.05, b[1] - k * 0.75], [b[0] + k * 0.15, b[1] - k * 0.6], [b[0] + k * 0.3, b[1] + 2]];
  raw(box(-XS + 0.05, -XS + 0.9, 0, 0.5, Z - 0.4, Z + 0.4, { col: dk(STONED, Z), shadeOp: 0.5 }) + cel(body, { Z, fill: col, band: 2 }) + fillS(blob(b[0] - k * 0.05, b[1] - k * 0.86, k * 0.1, k * 0.11, 9, 0.15), dk('#8e968a', Z)) + mould(b[0], b[1] - k * 0.35, k * 0.12, k * 0.15, { col: dk(MOULD, Z), n: 8 }) + rime([[b[0] - k * 0.2, b[1] - k * 0.6], [b[0] - k * 0.05, b[1] - k * 0.75]], Z, { th: 1.2, col: FROST, op: 0.6 })); }
// ---- THE SUN'S LIGHT across the chamber: soft shafts from the notch to the king, motes and falling snow lit in them
{
  const a = [SX, SY], b = P(9.6, 5.4, 17);
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  for (const [w0, w1, op] of [[30, 150, 0.12], [20, 100, 0.14], [10, 50, 0.16]]) raw(`<path d="${p2([[a[0] + nx * w0, a[1] + ny * w0], [b[0] + nx * w1, b[1] + ny * w1], [b[0] - nx * w1, b[1] - ny * w1], [a[0] - nx * w0, a[1] - ny * w0]])}" fill="${SUN}" opacity="${op}" filter="url(#soft)"/>`);
  { let m = ''; for (let i = 0; i < 120; i++) { const t = R(), sd = (R() - 0.5) * 2, w = 20 + 120 * t, x = a[0] + dx * t + nx * w * sd * 0.8, y = a[1] + dy * t + ny * w * sd * 0.8; m += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + R())}" fill="#fffcf0" opacity="${f1(0.3 + R() * 0.5)}"/>`; } raw(m); }
}
raw(G.snowfall(140, { len: 2.4, slant: 0.2, op: 0.55, col: '#f4f4ec', y1: 330 }));
// ---- the quiet band: stepped toward the chamber's dark behind the fighters
raw(BL.quiet(MURK, 244, 360, { steps: [0.1, 0.12, 0.15, 0.17], hop: 0.15 }));
for (const [cx, cy, r] of [[0, H, 420]]) for (const kk of [1, 0.7]) raw(fillS(blob(cx, cy, r * kk, r * kk * 0.7, 14, 0.25), MURK, 0.18));

// ======================================================================== MID: low things behind the fighters
layer('mid');
{
  // a dead hound laid at the king's feet long ago, a horse's skull, a toppled cauldron, low and dark
  const Z = 11.2, c = P(-3.0, 0, Z), k = K(Z);
  raw(cel(blob(c[0], c[1] - k * 0.12, k * 0.55, k * 0.14, 12, 0.3), { Z, fill: '#4a4a3e', band: 2, tex: 'url(#mottle)', texOp: 0.5 }) + mould(c[0], c[1] - k * 0.15, k * 0.3, k * 0.06, { col: MOULD }) + rime([[c[0] - k * 0.5, c[1] - k * 0.16], [c[0], c[1] - k * 0.25]], Z, { th: 1.4, col: FROST, op: 0.7 }));
  { const c2 = P(3.4, 0.12, 10.4), k2 = K(10.4); raw(cel([[c2[0] - k2 * 0.3, c2[1]], [c2[0] - k2 * 0.25, c2[1] - k2 * 0.16], [c2[0] + k2 * 0.15, c2[1] - k2 * 0.2], [c2[0] + k2 * 0.35, c2[1] - k2 * 0.05], [c2[0] + k2 * 0.3, c2[1]]], { Z: 10.4, fill: '#8a8470', band: 2 }) + fillS([[c2[0] - k2 * 0.15, c2[1] - k2 * 0.12], [c2[0] - k2 * 0.05, c2[1] - k2 * 0.14], [c2[0] - k2 * 0.06, c2[1] - k2 * 0.07]], '#141410')); }
}

// ======================================================================== FORE: framing (left; the stage is kept clear)
layer('fore');
{
  // left: the great slab at the passage mouth, close, carved with a spiral, rimed, mould low
  const sl = [[-10, -10], [52, -10], [60, 120], [54, 260], [62, H + 10], [-10, H + 10]];
  raw(cel(sl, { Z: 4, fill: '#2e322a', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + fillP(sl, S.hatchA(4), 0.3) + rime([[52, -10], [60, 120], [54, 260]].reverse(), 4, { th: 4, col: FROST }) + spiral(22, 180, 26) + mould(30, 400, 28, 70, { col: '#4a5638' }));
  { let m = ''; for (let i = 0; i < 40; i++) { const x = 120 + R() * 380, y = R() * 160; m += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + R() * 1.2)}" fill="#f8f4e4" opacity="${f1(0.25 + R() * 0.4)}"/>`; } raw(m); }
  // bottom right: the grave goods spilled at the throne's foot, low across the bottom: a split shield, cups, coins of
  // tarnished silver, a fallen spear, mould and frost; it meets the throne's own base
  raw(plates([[930, H + 6], [1180, H + 4], [1490, H + 6]], 14, { size: [30, 56], cols: ['#6a6e62', '#3e423a', '#1e221c'], Z: 3.8, ink: 1.2, rime: FROST, hatchOp: 0.3 }));
  for (let i = 0; i < 8; i++) { const x = 980 + R() * 480, y = H - 18 - R() * 20; raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(5 + R() * 3)}" ry="${f1(2 + R())}" fill="${SILV}" stroke="${INK}" stroke-width="0.8"/>`); }
  raw(line([[960, H - 10], [1260, H - 34]], 4, INK) + line([[960, H - 10], [1260, H - 34]], 2.4, '#5a5040') + mould(1100, H - 20, 40, 8, { col: '#4a5638' }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
