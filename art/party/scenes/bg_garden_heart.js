// World XIV, the Blighted Garden: THE ROOT CELLAR (battle room `garden_heart`, round 2, Living Ink).
// Under the garden: the old house's stone cellar, broken open from below by the roots of the garden's heart. Its far end
// is still a barrel-vaulted stone tunnel; the near end has fallen into a cave of loam and roots, roots hanging in
// curtains from the earth overhead and running across the floor. At the tunnel mouth the roots knot into the heart's
// root-mass, a mouth of thorn teeth in it, eyes in its bark, and pale foxfire caps on it: the only light. Encounter: The
// Root Cellar (the roots have mouths). The boss (the Antlered Mother) has her own room (`garden_boss`).
// Kind of space: underground and tight, low earth overhead. Light: darkness with a cold lilac-white foxfire on the knot
// (stepped halo, never a neon glow). Shapes: tangled curving roots, hanging root curtains, the broken barrel vault.
// Usage: node scenes/bg_garden_heart.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIV');
const { S, B, G } = require('./battle_kit_g5').make(14401, '#0c0a0c', '#1a1420', '#1c1820');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, mould, bracket, caps, pustules, tornVoid, eye, quiet } = B;
const { W, H, air, rose, foliage, bigCap, shaft } = G;
const MV = require('./materials_v2')(S);
const PINK = '#d4a0b2', LILAC = '#b4a0cc', YEL = '#ded68e', LOAM = '#1e1812', ROOT = '#2a2224', FOX = '#e6e0f2', MOULD = '#8a8098', BONE = '#d4ccb8', MURK = B.MURK;
const KN = [0.4, 0, 17];                  // the heart's knot (world)
const knS = P(KN[0], 1.4, KN[2]);
const near = (x, y, r = 420) => Math.max(0, 1 - Math.hypot(x - knS[0], (y - knS[1]) * 1.4) / r);

// a root: a tapering, kinked polyline (screen pts), bark lines, a cold rim of foxfire on the side toward the knot
function root(pts, w0, w1, o = {}) {
  // a smooth tapering body: outline offset either side of the path, filled, inked; bark lines along it; a thin cold rim
  // of foxfire on the side toward the knot
  const col = o.col || ROOT, n = pts.length, Lp = [], Rp = [], rim = [];
  for (let j = 0; j < n; j++) { const a = pts[Math.max(0, j - 1)], b = pts[Math.min(n - 1, j + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, ww = (w0 + (w1 - w0) * j / (n - 1)) / 2 * (1 + 0.15 * Math.sin(j * 2.1));
    Lp.push([pts[j][0] + nx * ww, pts[j][1] + ny * ww]); Rp.push([pts[j][0] - nx * ww, pts[j][1] - ny * ww]);
    const tx = knS[0] - pts[j][0], ty = knS[1] - pts[j][1], side = tx * nx + ty * ny > 0 ? 1 : -1; rim.push([pts[j][0] + side * nx * ww * 0.7, pts[j][1] + side * ny * ww * 0.7, near(pts[j][0], pts[j][1])]); }
  let s = MV.strand(pts, w0, w1, KN[2], { col, bark: w0 > 6 ? 1 : 0 });   // materials v2: smooth tapered tube, shaded, barked
  const lm = Math.max(...rim.map(r => r[2])); if (lm > 0.08 && w0 > 3) s += `<path d="${smooth(rim.map(r => [r[0], r[1]]), false, 0.5)}" stroke="${FOX}" stroke-width="${f1(Math.max(0.6, w0 * 0.08))}" fill="none" opacity="${f1(Math.min(0.55, lm * 0.8))}" stroke-linecap="round"/>`;
  return s;
}
// a wandering root path from a to b with n kinks
const wander = (a, b, n = 5, amp = 0.06) => { const o = [a], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let i = 1; i < n; i++) { const t = i / n; o.push([a[0] + (b[0] - a[0]) * t + (R() - 0.5) * L * amp, a[1] + (b[1] - a[1]) * t + (R() - 0.5) * L * amp * 0.6]); } o.push(b); return o; };
// a mouth in a root mass: a ring of thorn teeth round a black throat
function mouth(x, y, r, Z) {
  let s = fillS(blob(x, y, r * 1.25, r * 0.95, 14, 0.15), mix(ROOT, '#4a3a40', 0.3)) + fillS(blob(x, y, r, r * 0.72, 14, 0.12), '#050305');
  for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283, p = [x + Math.cos(a) * r, y + Math.sin(a) * r * 0.72], q = [x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.4]; s += fillP([[p[0] - Math.sin(a) * r * 0.1, p[1] + Math.cos(a) * r * 0.07], q, [p[0] + Math.sin(a) * r * 0.1, p[1] - Math.cos(a) * r * 0.07]], BONE) + inkP([[p[0] - Math.sin(a) * r * 0.1, p[1] + Math.cos(a) * r * 0.07], q, [p[0] + Math.sin(a) * r * 0.1, p[1] - Math.cos(a) * r * 0.07]], 0.5); }
  return s + inkS(blob(x, y, r * 1.25, r * 0.95, 14, 0.15), 1.2, 0.4);
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- distance: the cellar's barrel-vaulted stone tunnel running on into the dark beyond the knot, roots through its crown
{
  const XW = 2.8, SP = 1.7, z0 = 15.5, z1 = 34;
  raw(fillP([P(-XW, 0, z1), P(XW, 0, z1), P(XW, SP, z1), P(0, SP + XW, z1), P(-XW, SP, z1)], '#050405'));
  for (const sx of [-1, 1]) { const at = (s, t) => [sx * XW, t, z0 + s]; raw(S.ashlar(at, z1 - z0, SP, '#3a3436', { vary: 0.2, chip: 0.5, mortar: 0.6, rough: true, roughP: 0.4, scale: 0.6 }) + hatch3(at, 0, z1 - z0, 0, SP, 0.8, { op: 0.5 })); }
  // vault courses: arcs across the tunnel at each course, lit faintly near the mouth
  for (let z = z0; z < z1; z += 0.45 + R() * 0.15) { const arc = []; for (let k = 0; k <= 12; k++) { const a = Math.PI - k / 12 * Math.PI; arc.push(P(Math.cos(a) * XW, SP + Math.sin(a) * XW, z)); } raw(line(arc, Math.max(0.6, K(z) * 0.02), mix('#4a4448', MURK, Math.min(0.9, (z - z0) / 14)), 0.9)); }
  for (let z = z0; z < z1; z += 1.6) { const a = P(-XW, SP, z), b = P(XW, SP, z); raw(pline([a, b], 0.5, INK, 0.0)); }
  // roots breaking through the vault's crown and hanging into the tunnel
  for (let k = 0; k < 7; k++) { const z = z0 + 1 + R() * 12, x = (R() - 0.5) * 3, a = P(x, SP + XW * 0.9, z), b = P(x + (R() - 0.5), 0.4 + R() * 1.2, z); raw(root(wander(a, b, 5), K(z) * 0.1, K(z) * 0.02, { col: '#1e181a' })); }
}
// ---- the cave: loam walls, stones and old foundation courses showing in them; the earth overhead
{
  // back loam wall round the tunnel mouth (a ragged arch of earth)
  const back = [[-10, 0], [W + 10, 0], [W + 10, 380], [P(5, 0, 15.5)[0] + 60, 330], P(2.8, 1.7, 15.5), P(2.0, 3.6, 15.5), P(0, 4.5, 15.5), P(-2.0, 3.6, 15.5), P(-2.8, 1.7, 15.5), [P(-5, 0, 15.5)[0] - 60, 330], [-10, 380]];
  raw(fillP(back, '#241e1c') + `<path d="${p2(back)}" fill="url(#mottle)" opacity="0.5"/>` + `<path d="${p2(back)}" fill="${S.hatchA(14)}" opacity="0.45"/>`);
  // stones of the old foundation in the loam, round the mouth
  for (let k = 0; k < 26; k++) { const a = Math.PI * (0.05 + R() * 0.9), r = 3.4 + R() * 2.5, X = Math.cos(a) * r * 1.3, Y = Math.sin(a) * r * 0.8 + 0.5, c = P(X, Y, 15.6); if (c[1] < -10) continue; raw(cel(chip(blob(c[0], c[1], 6 + R() * 10, 4 + R() * 6, 7, 0.3), 0.4), { Z: 15, fill: mix('#2e2826', '#8a84a0', near(c[0], c[1]) * 0.5), band: 1.5, inkW: 0.6 })); }
  // roots crossing the loam wall, arcing down into the floor
  for (let k = 0; k < 11; k++) { const x0 = R() * W, a = [x0, -10], b = [x0 + (R() - 0.5) * 300, 260 + R() * 80]; raw(root(wander(a, b, 5, 0.08), 10 + R() * 12, 4 + R() * 4, { col: '#1a1416' })); }
}
// ---- the floor: loam with roots running across it toward us (converging into the knot), puddles holding the foxfire
{
  raw(fillP([[-10, 300], [W + 10, 300], [W + 10, H + 5], [-10, H + 5]], '#1e1814') + `<path d="M-10 300 H${W + 10} V${H + 5} H-10 Z" fill="url(#mottle)" opacity="0.5"/>`);
  for (let k = 0; k < 14; k++) { const X = (R() - 0.5) * 18, a = P(KN[0] + (R() - 0.5) * 2, 0.1, KN[2] - 0.5), b = P(X, 0.1, 4.5 + R() * 3); raw(root(wander(a, b, 7, 0.08), Math.max(2, K(KN[2]) * 0.18), K(5) * (0.15 + R() * 0.15))); }
  for (const [X, Z, w] of [[-3.4, 11, 1.6], [3.6, 9.5, 2.0]]) { const c = P(X, 0, Z); raw(fillS(blob(c[0], c[1], K(Z) * w, K(Z) * w * 0.07, 14, 0.3), '#3a3448', 0.9) + line([[c[0] - K(Z) * w * 0.5, c[1]], [c[0] + K(Z) * w * 0.3, c[1] - 1]], 1, FOX, 0.6)); }
  // what the roots crushed: a cask burst into its staves and hoops, a fallen shelf of jars
  { const Z = 12.5, c = P(-5.4, 0, Z), k = K(Z); for (let i = 0; i < 7; i++) { const a = -0.3 + i * 0.12, p = [c[0] + i * k * 0.13, c[1]], q = [p[0] + Math.cos(-1.2 - a) * k * 0.6, p[1] + Math.sin(-1.2 - a) * k * 0.6]; raw(line([p, q], k * 0.07 + 1.5, INK) + line([p, q], k * 0.07, '#4a3a2a')); } raw(`<ellipse cx="${f1(c[0] + k * 0.4)}" cy="${f1(c[1] - k * 0.05)}" rx="${f1(k * 0.6)}" ry="${f1(k * 0.12)}" fill="none" stroke="${INK}" stroke-width="2.4"/>`); }
  { const Z = 13.5, a = P(5.0, 1.4, Z), b = P(7.4, 0.2, Z), k = K(Z); raw(line([a, b], k * 0.08 + 2, INK) + line([a, b], k * 0.08, '#4a3a2a')); for (let i = 0; i < 4; i++) { const u = 0.15 + i * 0.22, c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - k * 0.12]; raw(cel([[c[0] - k * 0.08, c[1] + k * 0.1], [c[0] + k * 0.08, c[1] + k * 0.1], [c[0] + k * 0.07, c[1] - k * 0.1], [c[0] - k * 0.07, c[1] - k * 0.1]], { Z, fill: i % 2 ? '#5a6a5a' : '#6a5a4a', band: 1 })); } }
}
// ---- THE HEART'S KNOT at the tunnel mouth: roots twisting down into a mass that sinks into the floor, a mouth of
// thorn teeth in it, eyes in its bark, pale foxfire caps on it (the only light)
{
  const k = K(KN[2]), c = P(KN[0], 1.2, KN[2]);
  // the stepped halo of the foxfire (cold lilac-white; a soft light, not a neon glow)
  raw(G.glow(c[0], c[1] - k * 0.8, 520, 300, '#cfc4e6', 0.55) + G.glow(c[0], c[1] - k * 1.1, 200, 130, '#f2eefa', 0.6));
  // the roots twisting down into the knot from the vault and the earth
  for (let i = 0; i < 12; i++) { const a = [c[0] + (R() - 0.5) * k * 8, -10], b = [c[0] + (R() - 0.5) * k * 1.6, c[1] + k * 0.6]; raw(root(wander(a, [c[0] + (b[0] - c[0]) * 0.5 + (R() - 0.5) * k, c[1] - k * 1.2], 4, 0.06).concat([b]), k * (0.45 + R() * 0.3), k * 0.35, { col: '#241c1e' })); }
  const mass = blob(c[0], c[1], k * 2.0, k * 1.4, 16, 0.3); raw(cel(mass, { Z: KN[2], fill: '#2e2628', band: k * 0.3, tex: 'url(#mottle)', texOp: 0.5 }));
  for (let i = 0; i < 9; i++) { const a = [c[0] - k * 1.4 + R() * k * 2.8, c[1] - k * 1], b = [a[0] + (R() - 0.5) * k, c[1] + k * 0.9]; raw(line(wander(a, b, 4, 0.15), Math.max(1, k * 0.06), '#141012', 0.8)); }
  raw(mouth(c[0] + k * 0.25, c[1] + k * 0.1, k * 0.55, KN[2]));
  for (const [dx, dy, r] of [[-1.0, -0.5, 0.16], [1.1, -0.7, 0.12], [-0.6, 0.6, 0.1]]) raw(eye(c[0] + dx * k, c[1] + dy * k, k * r, { white: '#d8d0c4', iris: '#7a6a8a', open: 0.4 }));
  for (const [dx, dy, h] of [[-1.2, -1.0, 0.9], [0.7, -1.2, 0.75], [1.6, -0.4, 0.55], [-1.8, 0.1, 0.5], [0.1, -1.35, 0.6]]) raw(caps(c[0] + dx * k, c[1] + dy * k, k * h, KN[2], { col: '#fbf9ff', stem: '#e8e4f2', n: 5, spots: '#ffffff' }));
  for (let i = 0; i < 10; i++) { const p = [c[0] + (R() - 0.5) * k * 7, c[1] - k * (1.5 + R() * 4)]; raw(caps(p[0], p[1], k * (0.2 + R() * 0.2), KN[2], { col: FOX, n: 2 })); }
  raw(pustules(c[0] - k * 0.3, c[1] - k * 0.5, k * 0.4, 7, PINK, KN[2]));
}
// ---- the earth overhead: a low ragged ceiling of loam and rootlets across the top
{ const e = []; for (let k = 0; k <= 40; k++) e.push([k * W / 40, 40 + Math.sin(k * 0.7) * 12 + R() * 10 + Math.abs(k - 20) * 1.2]); raw(fillP([[-10, -10], [W + 10, -10], ...e.slice().reverse()], '#16120e') + hatch3((s, t) => [s, t, 6], -10, 10, 3, 6, 0.8, { op: 0.4 }));
  for (let k = 0; k < 120; k++) { const p = e[Math.floor(R() * e.length)], l = 10 + R() * 60, pts = [[p[0] + (R() - 0.5) * 20, p[1] - 2], [p[0] + (R() - 0.5) * 12, p[1] + l * 0.5], [p[0] + (R() - 0.5) * 16, p[1] + l]]; raw(line(pts, 1 + R() * 1.5, R() < 0.2 ? '#4a3c3a' : '#0a0808', 0.85)); } }
raw(`<ellipse cx="${f1(knS[0])}" cy="${f1(knS[1] - 40)}" rx="1100" ry="520" fill="${G.radGrad('#030203', 1, [[0, 0], [0.4, 0], [0.75, 0.55], [1, 0.85]])}"/>`);
raw(quiet([[236, 0.12], [270, 0.12], [306, 0.12], [350, 0.12]], { hop: 0.16 }));
// the floor in the fighters' band: wet loam with root ridges in perspective, puddles catching the foxfire, scattered stones
for (let k = 0; k < 18; k++) { const Z = 5 + R() * 8, X = (R() - 0.5) * Z * 2, c = P(X, 0, Z), r = K(Z) * (0.05 + R() * 0.08); raw(cel(chip(blob(c[0], c[1] - r * 0.3, r, r * 0.5, 7, 0.3), 0.4), { Z, fill: mix('#3a3230', '#8a84a0', near(c[0], c[1]) * 0.4), band: 1 })); }
for (const [X, Z, w] of [[-6.5, 7.5, 1.2], [5.5, 6.8, 1.6], [-1, 12.5, 0.9]]) { const c = P(X, 0, Z); raw(fillS(blob(c[0], c[1], K(Z) * w, K(Z) * w * 0.06, 14, 0.3), '#4a4460', 0.9) + line([[c[0] - K(Z) * w * 0.5, c[1]], [c[0] + K(Z) * w * 0.3, c[1] - 1]], 1, FOX, 0.7)); }
{ let m = ''; for (let k = 0; k < 80; k++) m += `<circle cx="${f1(knS[0] + (R() - 0.5) * 600)}" cy="${f1(knS[1] - R() * 260)}" r="${f1(0.5 + R())}" fill="${FOX}" opacity="${f1(0.3 + R() * 0.5)}"/>`; raw(m); }

// ======================================================================== MID
layer('mid');
{ // a root breaking up out of the floor behind the fighters, its rootlets clutching a skull; low and dark
  const Z = 9.6, a = P(-2.8, 0, Z), b = P(-1.6, 0.6, Z), c = P(-0.4, 0, Z - 0.3), k = K(Z); raw(root([a, [a[0] + k * 0.3, a[1] - k * 0.4], b, [b[0] + k * 0.4, b[1] + k * 0.2], c], k * 0.18, k * 0.1, { col: '#1a1416' }));
  const sk = [b[0] - k * 0.1, a[1] - k * 0.12]; raw(cel(blob(sk[0], sk[1], k * 0.11, k * 0.09, 10, 0.1), { Z, fill: mix(BONE, MURK, 0.5), band: 2 }) + fillS(blob(sk[0] - k * 0.04, sk[1], k * 0.025, k * 0.02, 6, 0.2), '#050405'));
}

// ======================================================================== FORE
layer('fore');
{ // left: a curtain of roots hanging from the earth to the floor at the frame edge, rootlets and a mouth
  for (let k = 0; k < 6; k++) { const x0 = -20 + k * 16 + R() * 10, a = [x0, -10], b = [x0 + 10 + R() * 20, H + 10]; raw(root(wander(a, b, 8, 0.06), 18 - k * 1.5, 10, { col: '#1e181a' })); }
  raw(mouth(46, 250, 26, 4) + eye(30, 140, 11, { white: '#d0c8bc', iris: '#7a6a8a', open: 0.35 }));
  // right: a root as thick as a man arching in from the top right down to the floor, rootlets hanging off it
  const arc = [[W + 20, 60], [W - 60, 110], [W - 110, 220], [W - 104, 360], [W - 80, H + 10]]; raw(root(arc, 50, 34, { col: '#221c1e' }));
  for (let k = 0; k < 10; k++) { const p = arc[1 + Math.floor(R() * 2)], l = 30 + R() * 70; raw(line([[p[0] + (R() - 0.5) * 30, p[1]], [p[0] + (R() - 0.5) * 30, p[1] + l]], 1.4, '#0a0808', 0.9)); }
  raw(caps(W - 120, 230, 28, 4, { col: FOX, n: 3 }) + pustules(W - 96, 300, 18, 4, PINK, 4) + mould(W - 100, 400, 20, 30, { col: MOULD, n: 40 }));
}

G.write(OUT, 'garden_heart');
