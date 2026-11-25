// World XII, the White Silence: THE FROZEN SHRINE (`silence_shrine`, round 2, new). Battle room, Living Ink.
// Place: the tundra folk's shrine, cut into the foot of a glacier (bible XII: the frozen saint was a saint of the tundra
// folk; it prayed for warmth, and the black star answered; a halo of black frost behind its head where gold should be;
// the starless eye fell from the black star and looks for the rest of the face). Encounter: the Frozen Shrine (saints
// and the eyes that watch them).
// Kind of space: enclosed, a cave of old ice: a low vault of banded ice, columns of ice where icicles met the floor,
// niches cut in the walls; a second chamber beyond through an ice arch.
// Light: one cold source. A fissure has opened in the vault over the altar; a thin blade of white daylight comes down it
// and falls on the saint frozen into the wall behind the altar. Everything else is a dim grey-blue gloom inside the ice.
// Shapes: curves and verticals: the vault's arc and its ice bands, the hanging icicle curtains and ice columns, the
// rounded niches; the black halos.
// Palette key: mid to dark, grey with the faintest cold blue (ice), white light; black void and black halos. No colour.
// Depth planes (far): ice columns near (6-9 m); the shrine hall, its niches and the altar (10-16 m); the inner chamber
// through the arch (20-30 m) sinking into grey.
// Lore placed: the saint frozen kneeling inside the clear ice behind the altar, hands raised, a black-frost halo where the
// gold was; niches with the kneeling dead (votaries who came to pray for warmth), each with its black halo frosted on the
// ice above it; the void's absences torn through the ice wall with eyes looking out (void world); offerings on the altar
// (a bone bowl, a carved ivory seal, a lamp of seal oil long out); prayer strips frozen stiff; no shadows anywhere.
// Mid: a fallen ice column broken in pieces, an offering bowl overturned, prayer strips in the snow.
// Fore: left: an ice column with its icicle curtain; right: an ice column and a hanging curtain; top: the vault's edge
// with icicles.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XII');
const ROOM = 'silence_shrine', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 12301, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#3a4250', keyTint: '#ffffff' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#22262e' });
const { line, pline, fillP, fillS, inkP, inkS, blob, lump, box, icicles, rime, tornVoid, eye, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#4a515c' });
const { pool, shaft, frame } = G;

const ICE = '#a8b2bc', ICEL = '#d4dce2', ICED = '#5a6470', SNOW = '#d8dce0', BONE = '#d8d2c4', VOID = '#050407', MURK = B.MURK, LIGHT = '#f4f8fa';
const VR = 9, VZ = 12, VY = 0.6;                         // the vault: a barrel of ice across the hall, radius, centre depth, springing
const LXp = P(0.6, 5.6, 14);                              // where the blade of light comes down
const lit = (x, y) => Math.max(0, 1 - Math.hypot((x - 790) / 230, (y - 190) / 210));
const tint = (col, x, y) => mix(mix(col, MURK, 0.66 * (1 - lit(x, y))), LIGHT, 0.28 * lit(x, y) * lit(x, y));

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the inner chamber beyond the arch (20-30 m): grey, dim, icicles hanging in rows, a faint second light
{ const Z = 28; raw(fillP([P(-6, -1, Z), P(6, -1, Z), P(6, 5, Z), P(-6, 5, Z)], '#59606a'));
  for (let k = 0; k < 40; k++) { const X = -5 + R() * 10, top = P(X, 3.6 + R(), Z), L = K(Z) * (0.5 + R() * 1.6); raw(fillP([[top[0] - 2, top[1]], [top[0] + 2, top[1]], [top[0], top[1] + L]], '#7a828c')); }
  raw(pool(...P(0, 1.5, Z), 120, 60, '#c8d0d8', { n: 3, op: 0.12 })); }
// ---- the back wall of the hall (16 m): banded old ice, the arch to the inner chamber, niches with the kneeling dead,
// black halos frosted over each; the saint frozen in the clear ice behind the altar
{
  const Z = 16, at = (s, t) => [-20 + s, t, Z];
  // the ice bands: each year's layer its own tone and thickness, slightly bowed, dust lines between
  // the ice: one mass of old glacier ice, its face darkening away from the light (smooth, it is ice), with a few folded
  // dust layers that bend, pinch out and break (never stripes), clear lenses, and meltwater runs frozen down it
  raw(fillP([P(...at(0, -1)), P(...at(40, -1)), P(...at(40, 9)), P(...at(0, 9))], ICE));
  raw(G.pool(790, 210, 520, 330, '#e8eef2', { n: 5, op: 0.22 }) + `<rect x="0" y="0" width="${W}" height="${H}" fill="${G.grad([[0, MURK, 0.85], [0.3, MURK, 0.35], [0.5, MURK, 0.05], [0.7, MURK, 0.35], [1, MURK, 0.85]], { x1: 0, y1: 0, x2: 1, y2: 0 })}"/>`);
  for (let k = 0; k < 7; k++) { const s0 = R() * 30, L = 6 + R() * 14, t0 = 0.5 + R() * 7.5, amp = 0.3 + R() * 0.8, q = [], q2 = []; for (let i = 0; i <= 24; i++) { const u = i / 24, th = 0.05 + 0.14 * Math.sin(u * Math.PI); q.push(P(...at(s0 + L * u, t0 + Math.sin(u * 3 + k) * amp))); q2.push(P(...at(s0 + L * u, t0 + th + Math.sin(u * 3 + k) * amp))); }
    raw(fillS([...q, ...q2.reverse()], '#5a5650', 0.35, 0.4) + line(q, 0.6, INK, 0.25)); }
  for (let k = 0; k < 6; k++) { const s0 = 2 + R() * 34, t0 = 1 + R() * 6; raw(fillS(blob(...P(...at(s0, t0)), 30 + R() * 50, 18 + R() * 30, 14, 0.25), '#dfe8ee', 0.25, 0.5)); }
  for (let k = 0; k < 22; k++) { const s0 = R() * 40, t0 = 3 + R() * 6, q = []; for (let i = 0; i <= 6; i++) q.push(P(...at(s0 + Math.sin(i + k) * 0.08, t0 - i * (0.3 + R() * 0.2)))); raw(line(q, 1.8, '#c8d4dc', 0.3) + line(q.map(([x, y]) => [x + 1.2, y]), 0.6, INK, 0.2)); }
  // the arch: a rounded opening into the inner chamber, its rim of clearer ice
  { const pts = []; for (let k = 0; k <= 20; k++) { const a = Math.PI * k / 20; pts.push(P(Math.cos(a) * 2.6 - 6.4, 2.4 + Math.sin(a) * 2.2, Z)); }
    const arch = [P(-3.8, -0.5, Z), ...pts, P(-9, -0.5, Z)], ck = S.id('ar');
    raw(`<clipPath id="${ck}"><path d="${p2(arch)}"/></clipPath><g clip-path="url(#${ck})">${fillP(arch, '#4a515c', 0.65)}</g>` + inkP(arch, 1.6) + line(pts.slice(2, 10).map(([x, y]) => [x + 2, y + 2]), 2, ICEL, 0.6)); }
  // niches: rounded recesses cut in the ice, each with a kneeling dead votary (low, dim), a black halo frosted above
  for (const [X, w, top] of [[2.6, 1.1, 2.0], [5.4, 1.5, 2.4], [8.5, 1.0, 1.7], [-11.4, 1.4, 2.2], [11.3, 1.25, 2.1]]) {
    const pts = []; for (let k = 0; k <= 12; k++) { const a = Math.PI * k / 12; pts.push(P(X + Math.cos(a) * w / 2 * (1 + (R() - 0.5) * 0.1), top + Math.sin(a) * w / 2 * (0.8 + R() * 0.4), Z)); }
    const n = [P(X + w / 2, 0.3, Z), ...pts, P(X - w / 2, 0.3, Z)]; raw(fillP(n, '#2e333c') + inkP(n, 1.1));
    const h = P(X, top + 0.15, Z), hr = K(Z) * 0.26 * w / 1.25; raw(`<circle cx="${f1(h[0])}" cy="${f1(h[1])}" r="${f1(hr)}" fill="#141418"/>` + rime(Array.from({ length: 9 }, (_, k) => { const a = Math.PI * (1 + k / 8); return [h[0] + Math.cos(a) * hr * 1.1, h[1] + Math.sin(a) * hr * 1.1]; }), Z, { th: 1.6, col: '#ffffff', under: '#6a7480' }));
    const b = P(X, 0.3, Z), k = K(Z); raw(cel([[b[0] - k * 0.32, b[1]], [b[0] - k * 0.24, b[1] - k * 0.5], [b[0] - k * 0.1, b[1] - k * 0.78], [b[0] + k * 0.12, b[1] - k * 0.8], [b[0] + k * 0.26, b[1] - k * 0.48], [b[0] + k * 0.34, b[1]]], { Z, fill: '#8a9098', band: 2 }) + cel(blob(b[0] + k * 0.02, b[1] - k * 0.92, k * 0.12, k * 0.14, 10, 0.1), { Z, fill: '#9aa0a8', band: 1.5 }));
  }
  // the saint in the ice behind the altar: a kneeling figure seen through clear ice, hands raised and frozen together,
  // a halo of black frost; the clear ice round it a lens of paler blue-grey with fracture planes
  { const X = 0.6, Y = 1.1, k = K(Z) * 1.6, c = P(X, Y + 1.6 * 1.6, Z);
    raw(fillS(blob(c[0], c[1], k * 1.3, k * 1.6, 18, 0.15), mix(ICEL, '#ffffff', 0.35), 0.75, 0.4));
    const b = P(X, Y, Z), hd = [b[0] + k * 0.02, b[1] - k * 1.32];
    // the halo of black frost: a ring of black crystals standing out round the head, where the gold should be
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r0 = k * 0.3, r1 = k * (0.42 + R() * 0.12); raw(pline([[hd[0] + Math.cos(a) * r0, hd[1] + Math.sin(a) * r0], [hd[0] + Math.cos(a) * r1, hd[1] + Math.sin(a) * r1]], Math.max(1.2, k * 0.04), '#0a0a0e')); }
    raw(`<circle cx="${f1(hd[0])}" cy="${f1(hd[1])}" r="${f1(k * 0.32)}" fill="none" stroke="#0a0a0e" stroke-width="${f1(k * 0.07)}"/>`);
    // kneeling, seen from the side, robe heaped behind, back straight, hands raised together before the face
    raw(cel([[b[0] - k * 0.62, b[1]], [b[0] - k * 0.6, b[1] - k * 0.36], [b[0] - k * 0.28, b[1] - k * 0.62], [b[0] - k * 0.16, b[1] - k * 1.12], [b[0] + k * 0.16, b[1] - k * 1.16], [b[0] + k * 0.22, b[1] - k * 0.7], [b[0] + k * 0.46, b[1] - k * 0.3], [b[0] + k * 0.5, b[1]]], { Z, fill: '#7e8690', band: 3, shadow: '#4a525c' }));
    raw(cel(blob(hd[0], hd[1], k * 0.15, k * 0.18, 12, 0.1), { Z, fill: '#8e969e', band: 2 }));
    raw(cel([[hd[0] + k * 0.12, b[1] - k * 1.02], [hd[0] + k * 0.24, b[1] - k * 1.02], [hd[0] + k * 0.3, b[1] - k * 1.42], [hd[0] + k * 0.22, b[1] - k * 1.5], [hd[0] + k * 0.15, b[1] - k * 1.4]], { Z, fill: '#8e969e', band: 1.5 }));
    for (let j = 1; j < 5; j++) raw(line([[b[0] - k * 0.5 + j * k * 0.15, b[1] - k * 0.1], [b[0] - k * 0.4 + j * k * 0.14, b[1] - k * 0.6]], 0.7, INK, 0.5));
    for (let i = 0; i < 6; i++) { const a = R() * 6.28, r0 = k * (0.4 + R() * 0.6); raw(pline([[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0 * 1.2], [c[0] + Math.cos(a) * r0 * 1.8, c[1] + Math.sin(a) * r0 * 2]], 0.8, '#ffffff', 0.55)); }
    raw(inkS(blob(c[0], c[1], k * 1.3, k * 1.6, 18, 0.15), 1, 0.4, 0.5)); }
  // the void: absences torn through the ice wall, eyes looking out of them
  for (const [s0, t0, w, h, eyes] of [[13.2, 4.8, 2.0, 1.4, [[0.1, 0, 0.26]]], [28.2, 5.4, 1.8, 2.0, [[-0.15, 0.1, 0.22], [0.25, -0.25, 0.15]]]])
    raw(tornVoid(at, s0, t0, w, h, { depth: 0.6, cut: '#6a727c', mat: ICE, slivers: 3, flecks: 3, tears: 2, tearLen: 0.4, teeth: 2, edge: '#e8eef2', edgeOp: 0.5, eyes, eyeO: { white: '#e0dcd2', iris: '#3a3a40' } }).svg);
  // stepped gloom away from the light
  raw(hatch3(at, 0, 40, -1, 9, 0.7, { op: 0.35, keep: (s, t) => lit(...P(...at(s, t))) < 0.3 }) + hatch3(at, 0, 40, -1, 9, -0.8, { op: 0.3, keep: (s, t) => lit(...P(...at(s, t))) < 0.05 }));
}
// ---- the vault: a barrel of banded ice over the hall, each band a ring seen from below; the fissure open at the crown
// over the altar; icicle curtains hanging from its lower edges
{
  const ring = (a, z) => [VR * Math.sin(a), VY + VR * Math.cos(a) * 0.62 + 5.8, z];
  for (let z = 5; z < 16; z += 0.5 + R() * 0.6) { for (let i = -10; i < 10; i++) { const a0 = i * 0.16, a1 = a0 + 0.16, z1 = z + 0.6; if (Math.abs((a0 + a1) / 2 - 0.06) < 0.09 && z > 10 && z < 15.5) continue;
      const q = [ring(a0, z), ring(a1, z), ring(a1, z1), ring(a0, z1)].map(p => P(...p)), c = q[0]; if (Math.max(...q.map(p => p[1])) < -10) continue;
      raw(cel(q, { Z: z, fill: tint(mix(S.tone(ICE, 0.12), ICED, 0.35), c[0], c[1]), band: 1, inkW: 0.4, hi: false })); } }
  raw(`<path d="M0 0 L${W} 0 L${W} 120 L0 120 Z" fill="${S.hatchA(14)}" opacity="0.2"/>`);
  // the fissure: a ragged slot of white sky along the crown, its lips frosted
  const L = [], Rr = []; for (let z = 10; z <= 15.5; z += 0.25) { const j = (R() - 0.5) * 0.04; L.push(P(...ring(-0.03 + j, z))); Rr.push(P(...ring(0.15 + j, z))); }
  raw(fillP([...L, ...Rr.slice().reverse()], LIGHT) + line(L, 1.6, INK) + line(Rr, 1.6, INK) + icicles(L.concat(Rr.slice().reverse()), 12, { len: 14, dens: 0.6, col: '#ffffff', shadow: '#7a8490' }));
}
// ---- the blade of light from the fissure down onto the saint and the altar
raw(shaft([LXp[0] - 22, 0], [LXp[0] + 30, 0], [LXp[0] - 70, 290], [LXp[0] + 110, 290], LIGHT, { n: 4, op: 0.08, narrow: 0.7, motes: 70, mote: '#ffffff', moteOp: 0.7 }));
// ---- the altar: a block of old ice and stone with a bone top, offerings on it, prayer strips frozen stiff
{ const X = 0.6, Z = 13.5; raw(box(X - 1.2, X + 1.2, 0, 1.0, Z - 0.5, Z + 0.5, { col: tint('#8a9098', ...P(X, 1, Z)) }) + box(X - 1.35, X + 1.35, 1.0, 1.12, Z - 0.6, Z + 0.6, { col: tint(BONE, ...P(X, 1.1, Z)) }));
  const p = P(X - 0.5, 1.12, Z - 0.2), k = K(Z); raw(cel([[p[0] - k * 0.16, p[1]], [p[0] + k * 0.16, p[1]], [p[0] + k * 0.1, p[1] - k * 0.1], [p[0] - k * 0.1, p[1] - k * 0.1]], { Z, fill: BONE, band: 1.5 }));
  const q = P(X + 0.5, 1.12, Z - 0.2); raw(cel(blob(q[0], q[1] - k * 0.06, k * 0.1, k * 0.07, 10, 0.2), { Z, fill: '#e8e4dc', band: 1.5 }));
  for (let i = 0; i < 6; i++) { const s = P(X - 1.1 + i * 0.44, 1.0, Z - 0.6), L = K(Z) * (0.3 + R() * 0.25); raw(cel([[s[0] - 2, s[1]], [s[0] + 2, s[1]], [s[0] + 3 + (R() - 0.5) * 4, s[1] + L]], { Z, fill: '#c8c4b8', band: 1 })); }
  raw(rime([P(X - 1.35, 1.12, Z - 0.6), P(X + 1.35, 1.12, Z - 0.6)], Z, { th: 2.5, col: '#ffffff' })); }
// ---- the floor: packed snow and blue ice, frozen meltwater runs converging on the altar, ice slabs fallen from the vault
{ raw(`<path d="${pp([[-30, 0, 3.5], [30, 0, 3.5], [30, 0, 16], [-30, 0, 16]])}" fill="${mix(SNOW, MURK, 0.4)}"/>`);
  for (let k = 0; k < 9; k++) { const X0 = -10 + k * 2.6, pts = []; for (let Z = 4; Z < 15; Z += 0.5) pts.push(P(X0 + (0.6 - X0) * (Z - 4) / 11 + Math.sin(Z * 2 + k) * 0.1, 0.01, Z)); raw(line(pts, 2.6, '#8a96a2', 0.5) + line(pts.map(([x, y]) => [x - 1, y - 0.6]), 0.7, '#ffffff', 0.5)); }
  for (let k = 0; k < 16; k++) { const X = -12 + R() * 24, Z = 6 + R() * 9, p = P(X, 0.02, Z), r = K(Z) * (0.12 + R() * 0.15); raw(cel([[p[0] - r, p[1]], [p[0] + r * 0.8, p[1] - r * 0.2], [p[0] + r * 0.2, p[1] - r * 0.5]], { Z, fill: tint(ICE, p[0], p[1]), band: 1, inkW: 0.5 })); }
  raw(pool(...P(0.6, 0, 12), 200, 20, LIGHT, { n: 4, op: 0.1 }));
  raw(G.bandFloor(-14, 14, { col: mix(SNOW, MURK, 0.45), wear: mix(SNOW, MURK, 0.25), debrisCol: ICE, wearOp: 0.3 }));
  // a pilgrims' kneeling bench of whalebone and hide before the altar (a scale cue), and a seal-oil lamp, cold
  { const Z = 11.8, X0 = -1.4, X1 = 2.6; raw(B.box(X0, X1, 0.25, 0.32, Z - 0.15, Z + 0.15, { col: tint(BONE, ...P(0.6, 0.3, Z)) })); for (const X of [X0 + 0.2, (X0 + X1) / 2, X1 - 0.2]) raw(B.box(X - 0.05, X + 0.05, 0, 0.25, Z - 0.1, Z + 0.1, { col: tint('#a8a294', ...P(X, 0.2, Z)) }));
    const l = P(3.6, 0.05, 12.4), k = K(12.4); raw(cel([[l[0] - k * 0.14, l[1]], [l[0] + k * 0.14, l[1]], [l[0] + k * 0.1, l[1] - k * 0.07], [l[0] - k * 0.1, l[1] - k * 0.07]], { Z: 12.4, fill: '#8a8478', band: 1.5 })); } }
// ---- ice columns at mid depth either side (where icicles met the floor), banded, fluted
for (const [X, Z, w] of [[-8.6, 9.5, 0.9], [7.4, 9.8, 1.0], [-12.5, 12, 1.2]]) { const pts = []; for (let k = 0; k <= 14; k++) { const t = k / 14, Y = t * 8, ww = w * (0.7 + 0.5 * Math.pow(Math.abs(t - 0.55) * 1.8, 2)) * (1 + Math.sin(t * 17 + X) * 0.06); pts.push([P(X - ww / 2, Y, Z), P(X + ww / 2, Y, Z)]); }
  const poly = [...pts.map(p => p[0]), ...pts.map(p => p[1]).reverse()], c = P(X, 3, Z); raw(cel(poly, { Z, fill: tint(ICE, c[0], c[1]), band: K(Z) * w * 0.25, shadow: ICED }) + line(pts.map(p => [p[0][0] + 3, p[0][1]]), 1.4, ICEL, 0.6));
  for (let k = 1; k < 14; k += 2) raw(pline([pts[k][0], pts[k][1]], 0.6, INK, 0.4)); }
raw(quiet([[236, 0.12], [268, 0.12], [302, 0.1], [348, 0.1]], { hop: 0.12 }));
raw(frame('#0c0e12', { sides: [[420, 0.14], [280, 0.16], [160, 0.18], [70, 0.22]], top: [[110, 0.2], [50, 0.2]], bottom: [[40, 0.24]] }));

// ======================================================================== MID
layer('mid');
{ const Z = 10.6; for (const [X, l, a] of [[-5.4, 1.1, 0.1], [-4.0, 0.7, -0.2], [-3.2, 0.5, 0.4]]) { const p = P(X, 0.2, Z), k = K(Z); raw(cel([[p[0] - k * l / 2, p[1] + k * 0.18], [p[0] + k * l / 2, p[1] + k * 0.2 + a * 6], [p[0] + k * l / 2, p[1] - k * 0.2 + a * 6], [p[0] - k * l / 2, p[1] - k * 0.22]], { Z, fill: mix(ICE, MURK, 0.4), band: 2 })); } }
{ const Z = 9.4, p = P(3.4, 0.08, Z), k = K(Z); raw(cel([[p[0] - k * 0.14, p[1]], [p[0] + k * 0.1, p[1] - k * 0.04], [p[0] + k * 0.14, p[1] - k * 0.14], [p[0] - k * 0.1, p[1] - k * 0.12]], { Z, fill: mix(BONE, MURK, 0.35), band: 1.5 }));
  for (let i = 0; i < 4; i++) { const q = P(4.6 + i * 0.3, 0.01, Z + 0.6 + R() * 0.4); raw(pline([q, [q[0] + 6, q[1] - 1]], 2, mix('#c8c4b8', MURK, 0.3))); } }

// ======================================================================== FORE
layer('fore');
for (const [x0, x1, flip] of [[-10, 70, false], [W - 66, W + 10, true]]) { const pts = []; for (let k = 0; k <= 12; k++) { const y = -5 + k * 41, w = (x1 - x0) * (0.75 + 0.25 * Math.sin(k * 1.3)); pts.push(flip ? [x1 - w, y] : [x0 + w, y]); }
  const poly = flip ? [[x1, -5], ...pts, [x1, H + 5]] : [[x0, -5], ...pts, [x0, H + 5]];
  raw(cel(poly, { Z: 3, fill: '#6a7480', band: 8, shadow: '#2e3440' }) + `<path d="${p2(poly)}" fill="url(#mottle)" opacity="0.4"/>`);
  for (let y = 10; y < H; y += 18 + R() * 20) raw(pline([[flip ? x1 : x0, y], [pts[Math.min(12, Math.round(y / 41))][0], y + 4]], 0.9, INK, 0.5));
  raw(line(pts.map(([x, y]) => [x + (flip ? 4 : -4), y]), 2, ICEL, 0.55)); }
{ const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 14 + Math.sin(k * 0.9) * 6 + R() * 4 + 16 * Math.pow(Math.abs(k / 15 - 1), 2)]);
  raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3, fill: '#4a525e', band: 4 }) + icicles(e, 3, { len: 70, dens: 0.7, col: '#e8eef2', shadow: '#7a8490' })); }
raw(fillP([[-5, H + 5], [-5, H - 12], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 10 - Math.sin(k * 1.5) * 5 - R() * 4]), [W + 5, H - 12], [W + 5, H + 5]], '#7a828c', 0.9));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
