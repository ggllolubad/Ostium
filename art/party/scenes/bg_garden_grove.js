// World XIV, the Blighted Garden: THE DEER GLADE (battle room `garden_grove`, round 2, Living Ink).
// The wild garden past the walls: a glade among giant caps and dead oaks where the spore deer graze; in its middle the
// dryad's oak, dead, a clean-rimmed absence where its heartwood was. Encounters: The Overgrown Path (husks among the
// mushrooms), The Deer Glade (they graze on the spores), The Dead Oak (her oak is dead; she is not).
// Kind of space: open, vast woodland; tall trunks and a high canopy of caps. Light: late afternoon, a low pale-yellow sun
// in the spore haze at the upper left, slanting beams through the gaps; warm side, light key in the distance.
// Shapes: organic curves: gnarled kinked trunks, domed caps seen from below with their gills, bracken. Depth: near (the
// underside of a giant cap overhead, its stem at the left edge; bracken and puffballs at the right), middle (the dead oak,
// giant caps, the deer path), distance (trunks and caps fading into the warm haze).
// Usage: node scenes/bg_garden_grove.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIV');
const { S, B, G } = require('./battle_kit_g5').make(14301, '#1a1416', '#3a2a30', '#e4d6b4');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, mould, bracket, caps, pustules, tornVoid, eye, quiet, skyBands } = B;
const { W, H, air, rose, foliage, bigCap, tree, shaft } = G;
const PINK = '#d4a0b2', LILAC = '#b4a0cc', YEL = '#ded68e', LOAM = '#1a1512', BARK = '#5a4e52', BONE = '#d8d0bc', MOULD = '#8a8098', MURK = B.MURK, HAZE = '#e4d6b4';

// ======================================================================== FAR
layer('far');
raw(G.gradSky([[0, '#bcaa98'], [0.3, '#d2c2a8'], [0.6, '#e8dcbc'], [1, '#f4eacc']]));
for (const [cx, cy, w, h] of [[760, 70, 520, 50], [1250, 120, 420, 40]]) raw(G.softCloud(cx, cy, w, h, '#e2d2b6', { lit: '#fff8e6', litK: 0.5, dark: '#9a8670', darkK: 0.25, op: 0.7 }));
// the low sun in the spore haze, stepped rings
raw(G.glow(300, 120, 260, 220, '#fff4d8', 0.7) + G.glow(300, 120, 90, 86, '#fffbee', 1) + `<circle cx="300" cy="120" r="24" fill="#fffdf4"/>`);
{ let m = ''; for (let k = 0; k < 260; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 300)}" r="${f1(0.5 + R() * 1.3)}" fill="${R() < 0.6 ? '#f6eec8' : PINK}" opacity="${f1(0.3 + R() * 0.5)}"/>`; raw(m); }
// ---- distance: a wood of trunks and caps fading into the haze, three steps of recession
for (const [Z, n, k] of [[90, 9, 0.8], [60, 8, 0.65], [40, 7, 0.45]]) {
  for (let i = 0; i < n; i++) { const X = -Z * 1.2 + (i + R() * 0.8) / n * Z * 2.4, b = P(X, 0, Z), kind = R(); if (Math.abs(X / Z) < 0.15 && Z < 50) continue;
    const g = kind < 0.55 ? tree(b[0], b[1], K(Z) * (14 + R() * 8), Z, { col: '#6a5e62', tw: K(Z) * (0.9 + R() * 0.5), depth: 2 }).svg : bigCap(b[0], b[1], K(Z) * (9 + R() * 7), Z, { col: R() < 0.5 ? '#d8b8c4' : '#c8b8d8', stem: '#c8b8b8', scales: 4 }).svg;
    raw(g + ''); }
  raw(fillP([[-5, -5], [W + 5, -5], [W + 5, H + 5], [-5, H + 5]], HAZE, k * 0.5));
}
// ---- the glade floor: meadow rising slightly to the far wood; the deer path winding in, converging
{
  raw(fillP([[0, 296], [W, 296], [W, H], [0, H]], '#8a8466'));
  for (const [z0, col] of [[40, '#7e7a5e'], [22, '#6a6650'], [13, '#545240'], [8.5, '#403e32']]) raw(fillP([P(-200, 0, z0), P(200, 0, z0), P(200, 0, 3.5), P(-200, 0, 3.5)].map(([x, y]) => [Math.max(-20, Math.min(W + 20, x)), y]), col));
  // grass tufts in the ground plane, smaller with distance
  let gt = ''; for (let k = 0; k < 1500; k++) { const Z = 5 + Math.pow(R(), 1.6) * 60, X = (R() - 0.5) * Z * 2.6, c = P(X, 0, Z), l = K(Z) * (0.12 + R() * 0.15); if (c[0] < -10 || c[0] > W + 10) continue; for (let j = 0; j < 3; j++) { const a = -Math.PI / 2 + (j - 1) * 0.35 + (R() - 0.5) * 0.3; gt += `M${f1(c[0])} ${f1(c[1])} l${f1(Math.cos(a) * l * 0.5)} ${f1(Math.sin(a) * l)} `; } } raw(`<path d="${gt}" stroke="#2a2a1e" stroke-width="0.8" opacity="0.6" fill="none"/>`);
  // the deer path: trodden loam winding to the far wood, hoof prints in it
  const pl = [], pr = []; for (let Z = 4; Z < 70; Z *= 1.12) { const X = 1.2 + Math.sin(Z * 0.18) * 2.2 + Z * 0.04, w = 0.7; pl.push(P(X - w, 0, Z)); pr.push(P(X + w, 0, Z)); }
  raw(fillP([...pl, ...pr.slice().reverse()], '#3a3228', 0.85) + line(pl, 0.8, INK, 0.5) + line(pr, 0.8, '#a8a080', 0.4));
  for (let k = 0; k < 40; k++) { const t = Math.floor(R() * (pl.length - 1)), c = [(pl[t][0] + pr[t][0]) / 2 + (R() - 0.5) * (pr[t][0] - pl[t][0]) * 0.6, pl[t][1]], r = Math.max(0.6, (pr[t][0] - pl[t][0]) * 0.06); raw(`<path d="M${f1(c[0] - r)} ${f1(c[1])} q${f1(r * 0.5)} ${f1(-r * 0.8)} ${f1(r * 0.9)} 0 M${f1(c[0] + r * 0.2)} ${f1(c[1])} q${f1(r * 0.5)} ${f1(-r * 0.8)} ${f1(r * 0.9)} 0" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.7"/>`); }
  // spore drifts lying pale in hollows, and petal falls
  for (let k = 0; k < 14; k++) { const Z = 8 + R() * 30, c = P((R() - 0.5) * Z * 1.6, 0, Z); raw(fillS(blob(c[0], c[1], K(Z) * (0.6 + R()), K(Z) * 0.06, 10, 0.5), '#e8dcae', 0.5)); }
}
// ---- the middle wood: gnarled dead oaks and giant caps around the glade, far to near
// varied in size, lean, spacing and depth: a giant near, a leaning tall one far, clusters of small ones, one fallen
const mids = [[-24, 34, 'tree', 15], [24, 38, 'cap', 15, -0.15], [-15, 27, 'cap', 6, 0.12], [-11.5, 26, 'cap', 3.2, -0.2], [14, 20, 'tree', 13], [-27, 18, 'tree', 12], [27, 17, 'cap', 4.2, 0.25], [24.5, 16.5, 'cap', 2.4, -0.1], [-12, 13.5, 'cap', 9.5, 0.06], [7.5, 30, 'cap', 7.5, -0.2]];
for (const [X, Z, kind, h, lean] of mids) { const b = P(X, 0, Z);
  if (kind === 'tree') { const t = tree(b[0], b[1], K(Z) * h, Z, { col: air(BARK, Z, 0.8, 7, 50), tw: K(Z) * 1.1, depth: 3, broken: 0.25 }); raw(t.svg); for (let i = 0; i < 4; i++) { const p = t.trunk[1 + Math.floor(R() * 4)]; raw(bracket(p[0] + t.tw * 0.3, p[1], t.tw * (0.5 + R() * 0.4), Z, { col: R() < 0.5 ? YEL : mix(BONE, PINK, 0.3) })); } raw(mould(t.trunk[1][0], t.trunk[1][1], t.tw * 0.5, t.tw * 0.8, { col: MOULD, n: 30 })); }
  else { const c = bigCap(b[0], b[1], K(Z) * h, Z, { col: air(R() < 0.5 ? '#d8a8bc' : '#c4b0dc', Z, 0.6, 7, 50), stem: air('#b8a6a8', Z, 0.6, 7, 50), spot: '#fff4f8', lean, cw: h < 5 ? 0.42 : 0.3, dome: h < 5 ? 0.7 : 0.95 }); raw(c.svg); if (h > 5) raw(eye(c.top[0] - c.cw * 0.3, c.top[1] + c.ury * 0.3, c.cw * 0.06, { white: '#e0d8c8', iris: '#7a6a8a', open: 0.4 })); } }
// a giant cap fallen across the glade, its stem snapped, the gills turned up
{ const Z = 24, a = P(-6, 0.6, Z), b = P(-2.5, 1.4, Z + 2), k = K(Z); raw(cel([[a[0], a[1] - k * 0.25], [b[0], b[1] - k * 0.2], [b[0], b[1] + k * 0.25], [a[0], a[1] + k * 0.3]], { Z, fill: '#a89a9c', band: 2 })); const c = [b[0] + k * 1.0, b[1] - k * 0.2]; raw(cel(blob(c[0], c[1], k * 1.2, k * 0.75, 16, 0.2, 0.5), { Z, fill: '#c4a0b2', band: k * 0.2 })); let g = ''; for (let i = 0; i < 18; i++) { const an = 0.5 + i / 18 * Math.PI; g += `M${f1(c[0] - k * 0.2)} ${f1(c[1])} L${f1(c[0] - k * 0.2 + Math.cos(an) * k * 0.9)} ${f1(c[1] + Math.sin(an) * k * 0.55)} `; } raw(`<path d="${g}" stroke="${INK}" stroke-width="0.6" opacity="0.5"/>`); }
// ---- THE DEAD OAK in the middle of the glade: vast, grey, hollow; the void has taken its heartwood: a clean-rimmed
// absence through the trunk; brackets shelved up it, its roots heaving the turf
{
  const X = 0.6, Z = 21, b = P(X, 0, Z), k = K(Z);
  const t = tree(b[0], b[1], k * 18, Z, { col: '#8a8286', tw: k * 2.3, depth: 3, limbs: 4, broken: 0.3, lean: 0.01 });
  // the roots heaving out across the turf
  raw(t.svg);
  for (let i = 0; i < 6; i++) { const p = t.trunk[1 + Math.floor(R() * 4)]; raw(bracket(p[0] + (R() < 0.5 ? -1 : 1) * t.tw * 0.35, p[1] - R() * 10, t.tw * (0.35 + R() * 0.3), Z, { col: R() < 0.5 ? YEL : mix(BONE, PINK, 0.35) })); }
  raw(mould(t.trunk[2][0], t.trunk[2][1], t.tw * 0.5, k * 1.2, { col: MOULD, n: 80 }) + pustules(t.trunk[1][0] + t.tw * 0.3, t.trunk[1][1], k * 0.4, 6, PINK, Z));
  // the void in the heartwood: torn through the trunk's thickness, clean rim, the cut grain showing, black inside
  raw(tornVoid((s, tt) => [X - 1.2 + s, tt, Z - 1.0], 1.15, 3.6, 1.25, 2.0, { depth: 1.2, cut: '#a8a098', mat: '#8a8286', tears: 3, tearLen: 0.7, teeth: 2, slivers: 5, flecks: 8, eyes: [[0.0, -0.1, 0.32]], eyeO: { white: '#e0d8c8', iris: '#6a5a7a', open: 0.4, look: [0.3, 0.2] }, edge: '#5a4a6a', edgeOp: 0.4 }).svg);
  // blooms hung from the dead crown
  for (const [pts] of t.limbs.slice(0, 18)) { const p = pts[pts.length - 1]; if (p[1] > 250) continue; raw(rose(p[0], p[1] + 4, k * (0.1 + R() * 0.06), R() < 0.5 ? PINK : LILAC)); }
}
// ---- the low sun's beams slanting through the gaps, stepped; spore turning in them
for (const [x0, w, x1, w1] of [[180, 60, 620, 140], [420, 40, 980, 120], [700, 50, 1300, 150]]) raw(G.shaftG([[x0, -5], [x0 + w, -5], [x1 + w1, 440], [x1, 440]], '#fff6d8', 0.22));
raw(quiet([[236, 0.1], [272, 0.12], [306, 0.12], [350, 0.12]], { hop: 0.14 }));

// ======================================================================== MID
layer('mid');
{ // an old stone garden bench sunk in the turf, overgrown (a familiar size: 1.8 m long, seat 0.45 m)
  const Z = 9.8, X = -2.2; raw(B.box(X - 0.9, X + 0.9, 0.38, 0.47, Z - 0.25, Z + 0.25, { col: mix('#6a6466', MURK, 0.35), shadeOp: 0.5 }) + B.box(X - 0.8, X - 0.6, 0, 0.38, Z - 0.2, Z + 0.2, { col: mix('#5a5456', MURK, 0.4), shadeOp: 0.5 }) + B.box(X + 0.6, X + 0.8, 0, 0.38, Z - 0.2, Z + 0.2, { col: mix('#5a5456', MURK, 0.4), shadeOp: 0.5 })); const c = P(X, 0.47, Z); raw(mould(c[0] - 8, c[1], 14, 3, { col: mix(MOULD, MURK, 0.3), n: 20 }) + caps(c[0] + 10, c[1], K(Z) * 0.12, Z, { col: mix(YEL, MURK, 0.3), n: 2 })); }
{ // a ring of pale caps on the path's verge, a shed antler grown with coral fungus, a gnawed puffball smoking spore
  const Z = 9.4; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, p = P(-4.2 + Math.cos(a) * 0.9, 0, Z + Math.sin(a) * 0.5); raw(caps(p[0], p[1], K(Z) * (0.1 + R() * 0.06), Z, { col: mix(BONE, MURK, 0.3), n: 2 })); }
  const Z2 = 10.2, a = P(3.6, 0.05, Z2), k = K(Z2); raw(line([a, [a[0] + k * 0.5, a[1] - k * 0.12], [a[0] + k * 0.9, a[1] - k * 0.05]], 4, INK) + line([a, [a[0] + k * 0.5, a[1] - k * 0.12], [a[0] + k * 0.9, a[1] - k * 0.05]], 2.2, mix(BONE, MURK, 0.4)) + line([[a[0] + k * 0.5, a[1] - k * 0.12], [a[0] + k * 0.55, a[1] - k * 0.35]], 3, INK) + caps(a[0] + k * 0.55, a[1] - k * 0.32, k * 0.12, Z2, { col: mix(PINK, MURK, 0.3), n: 3 }));
}

// ======================================================================== FORE
layer('fore');
{ // the underside of a giant cap overhead: its stem at the left edge, the gills radiating out across the top-left
  const st = [[-10, H + 5], [58, H + 5], [48, 300], [56, 120], [44, -5], [-10, -5]]; raw(cel(st, { Z: 3.6, fill: '#bfb2a8', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2([[30, H + 5], [58, H + 5], [48, 300], [56, 120], [44, -5], [26, -5]])}" fill="${S.hatchA(4)}" opacity="0.45"/>`);
  const rimPts = []; for (let k = 0; k <= 24; k++) { const u = k / 24, x = -10 + u * 760, y = 30 + Math.pow(u, 1.6) * 30 + Math.sin(u * 19) * 5 + (k === 15 ? 22 : 0); rimPts.push([x, y]); }
  const under = [[-10, -10], [760, -10], ...rimPts.slice().reverse()]; raw(cel(under, { Z: 3.6, fill: '#8a6e7e', band: 4 }));
  let gl = ''; for (let k = 0; k < 70; k++) { const u = k / 70, e = [-10 + u * 760, 30 + Math.pow(u, 1.6) * 30], o = [40, -40]; gl += `M${f1(o[0] + (e[0] - o[0]) * 0.05)} ${f1(o[1] + (e[1] - o[1]) * 0.05)} L${f1(e[0])} ${f1(e[1] + Math.sin(u * 19) * 5)} `; } raw(`<path d="${gl}" stroke="${INK}" stroke-width="1" opacity="0.6"/>`);
  raw(line(rimPts, 2.4, INK) + line(rimPts.map(([x, y]) => [x, y - 3]), 1.2, '#d8b8c8', 0.6));
  // the torn margin drips; a few eyes have opened in the gills
  for (let k = 0; k < 9; k++) { const p = rimPts[2 + Math.floor(R() * 20)], l = 8 + R() * 22; raw(fillP([[p[0] - 3, p[1]], [p[0] + 3, p[1]], [p[0] + 0.5, p[1] + l]], '#8a6e7e') + inkP([[p[0] - 3, p[1]], [p[0] + 0.5, p[1] + l], [p[0] + 3, p[1]]], 0.8)); }
  for (const [x, y, r] of [[210, 22, 9], [470, 34, 7]]) raw(eye(x, y, r, { white: '#e0d8c8', iris: '#7a6a8a', open: 0.35 }));
  raw(mould(30, 300, 24, 60, { col: MOULD, n: 50 }) + bracket(56, 250, 40, 4, { col: YEL }) + bracket(52, 330, 30, 4, { col: mix(BONE, PINK, 0.3) }));
}
{ // right: bracken fronds and a cluster of puffballs smoking spore at the frame corner
  for (let k = 0; k < 6; k++) { const bx = W - 140 + k * 26, by = H + 5, tip = [bx - 40 + R() * 30, 300 + R() * 60], pts = [[bx, by], [(bx + tip[0]) / 2 + 20, (by + tip[1]) / 2], tip]; raw(line(pts, 3, INK) + line(pts, 1.6, '#6a6040'));
    for (let j = 1; j < 9; j++) { const u = j / 9, p = [bx + (tip[0] - bx) * u + 20 * Math.sin(u * Math.PI), by + (tip[1] - by) * u], l = 26 * (1 - u) + 6; raw(pline([p, [p[0] - l, p[1] + l * 0.3]], 2.2, INK) + pline([p, [p[0] - l, p[1] + l * 0.3]], 1, '#8a7a4a') + pline([p, [p[0] + l * 0.8, p[1] + l * 0.4]], 2.2, INK) + pline([p, [p[0] + l * 0.8, p[1] + l * 0.4]], 1, '#7a6a40')); } }
  for (const [x, r] of [[W - 90, 26], [W - 50, 34], [W - 20, 22]]) raw(cel(blob(x, H - r * 0.7, r, r * 0.85, 14, 0.08), { Z: 4, fill: YEL, band: r * 0.25 }) + `<circle cx="${x - r * 0.3}" cy="${H - r * 1.1}" r="${r * 0.2}" fill="#fffbe8" opacity="0.7"/>` + B.steam(x, H - r * 1.5, 70, { n: 3, col: '#f0e6b8', op: 0.45, w: 14 }));
}
{ let m = ''; for (let k = 0; k < 50; k++) { const x = R() * W, y = R() * H, col = [PINK, LILAC, YEL][k % 3]; m += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1 + R() * 1.6)}" fill="${col}" stroke="${INK}" stroke-width="0.3" opacity="0.6"/>`; } raw(m); }

G.write(OUT, 'garden_grove');
