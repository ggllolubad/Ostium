// World II, the Rotmire: THE MOOT-HALL'S EMPTY PILES, in Living Ink. Replaces grim/bg_worlds.js room 'mire_hut'.
// Contract as the nave: 1480 x 480 (shown at 2x); mire_hut_far.svg (opaque), _mid.svg, _fore.svg (transparent); the battle
// camera of nave.camera.json (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430, a human 190 px).
// Lore (bible/world_II_rotmire.md): fen villages on stilts where the water turned to poison and nothing in it rots.
//   "When the water turned, the village climbed into the moot-hall to wait. In the morning the hall had walked off."
// The place: the company stands on the village landing stage at dusk. Across the black water stand the stilt houses, and
// between them the moot-hall's double row of oak piles with no hall on them: the stumps snapped and splayed, two pulled
// clean out, the gangway from the reeve's neighbour ending in the air with its rope ladder hanging to nothing, the reeve's
// tally sticks still nailed to the last post, and a swathe of reeds trodden flat going off into the fen where it walked.
// Courses: TOXIN ripens (bile-green blisters in the bulging daub, shelf fungus and mould fur on every pile, toadstools
// fruiting along the thatch ridges, white mycelium threads in the timber); WATER preserves (piles tanned black and slick,
// a bog body tanned brown in the shallows by the stage, nothing rotted away). Palette: peat brown, bile green, and the
// hags' horn lanterns the only warm note (dull amber). No eyes, no gold, no red.
// Usage: node scenes/bg_mire_hut.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'II');
const W = 1480, H = 480, ROOM = 'mire_hut';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2402, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1c1a10' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, glow, stain, smooth, chip, tone, boards, EM, crack } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK);
const { line, polyS } = BK;
const { ell } = require('../engine');

// ============================================================================ WORLD KIT II (the Rotmire)
const PEAT = '#4a3828', PEATD = '#2a2018', BILE = '#7a8a3a', BILED = '#4a5428', AMBER = '#c8903e', OAK = '#2a2218', THATCH = '#52462c', DAUB = '#4e4434',
  WATER = '#10140f', MURK = '#141710', MIST = '#8a8e74', SKY = '#56584a', REED = '#5a5a36';
// distance: fen mist lifts far things toward the mist colour; k > 1 for stronger
const fogC = (col, Z, k = 1) => mix(col, MIST, Math.max(0, Math.min(0.6, (Z - 10) / 110)) * k);
// a timber pile or post from Y0 to Y1 at X,Z, w metres wide: tanned black below the old waterline, slick; the top cut or
// snapped (o.snap: a jagged break); mould fur at the waterline, shelf fungus, white mycelium threads (toxin in the oak)
function pile(X, Y0, Y1, Z, w, o = {}) {
  const lean = o.lean || 0, a = P(X - w / 2, Y0, Z), b = P(X + w / 2, Y0, Z), c = P(X + w / 2 + lean, Y1, Z), d = P(X - w / 2 + lean, Y1, Z);
  let top = [c, d];
  if (o.snap) { const n = 5, tp = []; for (let k = 0; k <= n; k++) { const u = k / n; tp.push([c[0] + (d[0] - c[0]) * u, c[1] - (k % 2 ? 1 : 0.2) * K(Z) * (0.12 + R() * 0.2)]); } top = tp; }
  const col = fogC(o.col || OAK, Z), pts = [a, b, ...top];
  let s = cel(pts, { Z, fill: tone(col, 0.12), tex: 'url(#mottle)', texOp: 0.5, band: Math.max(1, (b[0] - a[0]) * 0.35) });
  // grain and splits
  const wpx = b[0] - a[0];
  for (let k = 0; k < 3; k++) { const u = 0.2 + k * 0.3 + R() * 0.1; s += `<path d="M${f1(a[0] + wpx * u)} ${f1(a[1] - 2)} L${f1(d[0] + wpx * u + (R() - 0.5) * 2)} ${f1(d[1] + 3)}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, wpx * 0.03))}" opacity="0.45"/>`; }
  // the old water line: tanned black and slick below, a mould-fur band at the line (pale, ragged)
  if (o.wl !== undefined) { const yA = P(X, o.wl, Z)[1];
    s += `<path d="${p2([[a[0], a[1]], [b[0], b[1]], [b[0] + lean * 0, yA], [a[0], yA]])}" fill="#0a0c08" opacity="0.45"/>`;
    s += `<path d="M${f1(a[0] + 0.5)} ${f1(yA)} L${f1(b[0] - 0.5)} ${f1(yA)}" stroke="${fogC('#a8ac90', Z)}" stroke-width="${f1(Math.max(0.8, K(Z) * 0.05))}" stroke-dasharray="1.5 1" opacity="0.6"/>`;
    s += `<path d="M${f1(a[0] + wpx * 0.25)} ${f1(yA + 1)} L${f1(a[0] + wpx * 0.25)} ${f1(a[1] - 1)}" stroke="#c8d0b0" stroke-width="0.6" opacity="0.25"/>`; }
  if (o.myc) for (let k = 0; k < 2; k++) { const y0 = d[1] + (a[1] - d[1]) * (0.2 + R() * 0.5); s += line([[a[0] + wpx * 0.2, y0], [a[0] + wpx * 0.5, y0 + 3 + R() * 4], [a[0] + wpx * 0.35, y0 + 8 + R() * 6], [a[0] + wpx * 0.7, y0 + 12 + R() * 6]], 0.5, '#d8d4c0', 0.55); }
  if (o.shelf) s += BK.shelf(a[0] + wpx * (0.2 + R() * 0.6), d[1] + (a[1] - d[1]) * o.shelf, Math.max(3, wpx * 0.9), fogC('#8a7a4a', Z), { n: 2 + Math.floor(R() * 2) });
  return s;
}
// a wattle-and-daub wall between frame posts, facing the viewer at Z, from X0 to X1 and Y0 to Y1: each panel bulges like a
// belly between ribs (toxin's swelling), blistered bile green where the daub split; peat sods patch the holes; in one panel
// the daub has fallen off the wattle weave
function daubWall(X0, X1, Y0, Y1, Z, o = {}) {
  let s = ''; const posts = []; for (let X = X0; X < X1 - 0.3; X += 1.1 + R() * 0.5) posts.push(X); posts.push(X1);
  for (let i = 0; i < posts.length - 1; i++) {
    const xa = posts[i] + 0.09, xb = posts[i + 1] - 0.09, bulge = 0.08 + R() * 0.12, pts = [];
    for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push(P(xa + (xb - xa) * u, Y1 - 0.06 + Math.sin(u * Math.PI) * 0.02, Z)); }
    for (let k = 0; k <= 8; k++) { const u = k / 8; pts.push(P(xb + Math.sin(u * Math.PI) * bulge * 0.5, Y1 - (Y1 - Y0) * u, Z)); }
    for (let k = 8; k >= 0; k--) { const u = k / 8; pts.push(P(xa + (xb - xa) * u, Y0 + 0.05 - Math.sin(u * Math.PI) * bulge * 0.6, Z)); }
    const col = fogC(tone(DAUB, 0.18), Z);
    s += `<path d="${smooth(pts, true, 0.5)}" fill="${col}"/><path d="${smooth(pts, true, 0.5)}" fill="url(#mottle)" opacity="0.5"/>`;
    // the belly's shading: lit upper left, shaded lower right (hatch), a dark seam under the sag
    const c = P((xa + xb) / 2, (Y0 + Y1) / 2, Z), rx = (P(xb, 0, Z)[0] - P(xa, 0, Z)[0]) / 2, ry = (P(0, Y0, Z)[1] - P(0, Y1, Z)[1]) / 2;
    const cid = S.id('dw'); s += `<clipPath id="${cid}"><path d="${smooth(pts, true, 0.5)}"/></clipPath><g clip-path="url(#${cid})"><ellipse cx="${f1(c[0] + rx * 0.55)}" cy="${f1(c[1] + ry * 0.6)}" rx="${f1(rx * 0.9)}" ry="${f1(ry * 0.8)}" fill="${S.hatchA(Z)}" opacity="0.55"/><ellipse cx="${f1(c[0] - rx * 0.35)}" cy="${f1(c[1] - ry * 0.35)}" rx="${f1(rx * 0.45)}" ry="${f1(ry * 0.4)}" fill="#e8dcb8" opacity="0.08"/></g>`;
    s += `<path d="${smooth(pts, true, 0.5)}" fill="none" stroke="${INK}" stroke-width="${f1(S.inkW(Z))}"/>`;
    // splits with blisters along them
    if (R() < 0.75) { const sx = c[0] + (R() - 0.5) * rx, sy = c[1] + (R() - 0.3) * ry; s += `<path d="M${f1(sx - rx * 0.3)} ${f1(sy - 2)} l${f1(rx * 0.25)} ${f1(3)} l${f1(rx * 0.3)} ${f1(-1)}" stroke="${INK}" stroke-width="0.8" fill="none"/>` + BK.blisters(sx, sy, rx * 0.4, 4 + Math.floor(R() * 6), fogC(BILE, Z, 0.6), { size: Math.max(0.8, K(Z) * 0.035) }); }
    if (o.sod === i) s += cel(chip([[c[0] - rx * 0.4, c[1] - ry * 0.1], [c[0] + rx * 0.2, c[1] - ry * 0.2], [c[0] + rx * 0.25, c[1] + ry * 0.35], [c[0] - rx * 0.35, c[1] + ry * 0.4]], 0.6), { Z, fill: fogC(PEATD, Z), tex: 'url(#mottle)', texOp: 0.5 });
    if (o.wattle === i) { const cid2 = S.id('wt'); const hole = [[c[0] - rx * 0.5, c[1] - ry * 0.5], [c[0] + rx * 0.4, c[1] - ry * 0.6], [c[0] + rx * 0.5, c[1] + ry * 0.2], [c[0] - rx * 0.1, c[1] + ry * 0.55], [c[0] - rx * 0.6, c[1] + ry * 0.1]];
      s += `<path d="${polyS(hole)}" fill="#1a160e"/><clipPath id="${cid2}"><path d="${polyS(hole)}"/></clipPath><g clip-path="url(#${cid2})">`;
      for (let k = 0; k < 6; k++) { const xx = c[0] - rx * 0.6 + k * rx * 0.24; s += `<path d="M${f1(xx)} ${f1(c[1] - ry)} L${f1(xx)} ${f1(c[1] + ry)}" stroke="${fogC('#5a4a30', Z)}" stroke-width="${f1(Math.max(0.8, rx * 0.06))}"/>`; }
      for (let k = 0; k < 7; k++) { const yy = c[1] - ry * 0.6 + k * ry * 0.2; s += `<path d="M${f1(c[0] - rx)} ${f1(yy)} Q${f1(c[0])} ${f1(yy + (k % 2 ? 2 : -2))} ${f1(c[0] + rx)} ${f1(yy)}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, ry * 0.12))}" fill="none"/><path d="M${f1(c[0] - rx)} ${f1(yy)} Q${f1(c[0])} ${f1(yy + (k % 2 ? 2 : -2))} ${f1(c[0] + rx)} ${f1(yy)}" stroke="${fogC('#6a5a3a', Z)}" stroke-width="${f1(Math.max(0.7, ry * 0.07))}" fill="none"/>`; }
      s += `</g><path d="${polyS(hole)}" fill="none" stroke="${INK}" stroke-width="0.9"/>`; }
  }
  // the frame posts over the panels
  for (const X of posts) s += cel([P(X - 0.09, Y0 - 0.05, Z), P(X + 0.09, Y0 - 0.05, Z), P(X + 0.09, Y1 + 0.05, Z), P(X - 0.09, Y1 + 0.05, Z)], { Z, fill: fogC(tone('#3a2c1e', 0.15), Z), tex: 'url(#mottle)', texOp: 0.4 });
  return s;
}
// reed thatch from the eave (Y eY at Z) up to the ridge (Y rY at Z + dZ), X0..X1: slumped between rafters, combed straw
// lines running down-slope, moss in clumps, the eave ragged and dripping; toadstools fruiting along the ridge
function thatch(X0, X1, eY, rY, Z, dZ, o = {}) {
  const at = (s, t) => [X0 + s, eY + (rY - eY) * t, Z + dZ * t], L = X1 - X0;
  const ridge = [], eave = [];
  for (let k = 0; k <= 16; k++) { const u = k / 16; ridge.push(P(...at(L * u, 1 - Math.abs(Math.sin(u * 7 + 1)) * 0.06 - (o.sag ? Math.sin(u * Math.PI) * o.sag : 0)))); eave.push(P(...at(L * u + (R() - 0.5) * 0.1, (R() * 0.06) - (o.sag ? Math.sin(u * Math.PI) * o.sag * 0.6 : 0)))); }
  const poly = [...eave, ...ridge.slice().reverse()], col = fogC(o.col || THATCH, Z);
  let s = `<path d="${smooth(poly, true, 0.35)}" fill="${col}"/><path d="${smooth(poly, true, 0.35)}" fill="url(#mottle)" opacity="0.55"/>`;
  const cid = S.id('th'); s += `<clipPath id="${cid}"><path d="${smooth(poly, true, 0.35)}"/></clipPath><g clip-path="url(#${cid})">`;
  for (let k = 0; k < L * 22; k++) { const u = R(), A = P(...at(L * u, 0.05 + R() * 0.85)), B = P(...at(L * u + 0.04, 0)); const l = 0.25 + R() * 0.5; s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(A[0] + (B[0] - A[0]) * l)} ${f1(A[1] + (B[1] - A[1]) * l)}" stroke="${R() < 0.5 ? mix(col, INK, 0.5) : mix(col, '#e8dca8', 0.25)}" stroke-width="${f1(Math.max(0.4, K(Z) * 0.012))}" opacity="0.6"/>`; }
  for (let k = 0; k < L * 1.2; k++) { const u = R(), c = P(...at(L * u, 0.2 + R() * 0.7)); s += stain(c[0], c[1], K(Z) * (0.3 + R() * 0.5), fogC(R() < 0.6 ? '#3e4a22' : BILED, Z), 0.55); }
  s += hatch3(at, 0, L, 0, 0.45, 0.3, { op: 0.4, ragged: 0.3 }) + `</g>`;
  s += `<path d="${smooth(poly, true, 0.35)}" fill="none" stroke="${INK}" stroke-width="${f1(S.inkW(Z) * 1.1)}"/>`;
  // the thatch's thickness at the eave: a heavy dark lip of cut straw ends, shaded beneath (seen from below)
  { const lip = eave.map(([x, y]) => [x, y + K(Z) * (0.22 + R() * 0.06)]); s += `<path d="${smooth([...eave, ...lip.slice().reverse()], true, 0.4)}" fill="${mix(col, INK, 0.45)}" stroke="${INK}" stroke-width="${f1(S.inkW(Z))}"/>`;
    let ends = ''; for (let k = 0; k < eave.length * 5; k++) { const u = R() * (eave.length - 1), i = Math.floor(u), f = u - i, A = eave[i], B = eave[i + 1], x = A[0] + (B[0] - A[0]) * f, y = A[1] + (B[1] - A[1]) * f; ends += `M${f1(x)} ${f1(y + 1)} l${f1((R() - 0.5) * 1.5)} ${f1(K(Z) * (0.15 + R() * 0.1))} `; }
    s += `<path d="${ends}" stroke="${mix(col, '#d8c898', 0.2)}" stroke-width="0.6" opacity="0.6"/>`; eave.forEach(p => { p[1] += K(Z) * 0.24; }); }
  // the eave's ragged straw ends and drips
  for (let k = 0; k < eave.length - 1; k++) for (let j = 0; j < 3; j++) { const A = eave[k], B = eave[k + 1], u = R(), x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u; s += `<path d="M${f1(x)} ${f1(y - 1)} l${f1((R() - 0.5) * 2)} ${f1(2 + R() * K(Z) * 0.12)}" stroke="${mix(col, INK, 0.3)}" stroke-width="0.7"/>`; }
  if (o.stools) for (let k = 0; k < o.stools; k++) { const r = ridge[1 + Math.floor(R() * 14)]; s += BK.toadstools(r[0], r[1] + 1, Math.max(2, K(Z) * 0.12), 2 + Math.floor(R() * 3), fogC('#b0a070', Z), { stem: fogC('#d0c8a8', Z) }); }
  return { svg: s, ridge, eave };
}
// a willow eel trap (a long conical basket) hanging point-down by its cord, screen px, with dried tithe eels inside
function eelTrap(x, y, len, o = {}) {
  const w = len * 0.28, top = [x, y], mouth = [[x - w, y + len * 0.15], [x + w, y + len * 0.15]], tip = [x + (R() - 0.5) * 2, y + len];
  let s = line([[x, y - len * 0.25], [x, y + len * 0.1]], 0.7, INK, 0.9);
  const body = [mouth[0], [x - w * 0.85, y + len * 0.5], tip, [x + w * 0.85, y + len * 0.5], mouth[1]];
  s += `<path d="${smooth(body, true, 0.5)}" fill="${o.col || '#5a4a2e'}" stroke="${INK}" stroke-width="0.8"/>`;
  for (let k = 1; k < 5; k++) { const u = k / 5, yy = y + len * (0.15 + u * 0.75), ww = w * (1 - u * 0.85); s += `<path d="M${f1(x - ww)} ${f1(yy)} Q${f1(x)} ${f1(yy + 1.5)} ${f1(x + ww)} ${f1(yy)}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.7"/>`; }
  s += `<path d="M${f1(x - w * 0.5)} ${f1(y + len * 0.2)} L${f1(tip[0] - 0.5)} ${f1(tip[1] - 1)} M${f1(x + w * 0.4)} ${f1(y + len * 0.2)} L${f1(tip[0] + 0.5)} ${f1(tip[1] - 1)}" stroke="${INK}" stroke-width="0.4" opacity="0.6"/>`;
  s += `<ellipse cx="${f1(x)}" cy="${f1(y + len * 0.15)}" rx="${f1(w)}" ry="${f1(w * 0.3)}" fill="#120e08" stroke="${INK}" stroke-width="0.6"/>`;
  return s;
}
// a hags' horn lantern on an iron hook: dull amber through scraped horn panes, the only warm note in the world
function hornLantern(x, y, s, o = {}) {
  let out = `<path d="M${f1(x)} ${f1(y - s * 1.6)} L${f1(x)} ${f1(y - s * 0.7)}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.12))}"/>`;
  out += `<path d="M${f1(x - s * 0.35)} ${f1(y - s * 0.7)} L${f1(x + s * 0.35)} ${f1(y - s * 0.7)} L${f1(x + s * 0.25)} ${f1(y - s * 0.95)} L${f1(x - s * 0.25)} ${f1(y - s * 0.95)} Z" fill="#2a2620" stroke="${INK}" stroke-width="0.6"/>`;
  out += EM(`<path d="M${f1(x - s * 0.32)} ${f1(y - s * 0.7)} L${f1(x + s * 0.32)} ${f1(y - s * 0.7)} L${f1(x + s * 0.36)} ${f1(y + s * 0.3)} L${f1(x - s * 0.36)} ${f1(y + s * 0.3)} Z" fill="${AMBER}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, s * 0.1))}"/>` +
    `<path d="M${f1(x - s * 0.15)} ${f1(y - s * 0.55)} L${f1(x - s * 0.12)} ${f1(y + s * 0.15)}" stroke="#f0d090" stroke-width="${f1(Math.max(0.5, s * 0.1))}" opacity="0.7"/>`);
  out += `<path d="M${f1(x)} ${f1(y - s * 0.7)} L${f1(x)} ${f1(y + s * 0.3)} M${f1(x - s * 0.36)} ${f1(y - s * 0.2)} L${f1(x + s * 0.36)} ${f1(y - s * 0.2)}" stroke="${INK}" stroke-width="${f1(Math.max(0.5, s * 0.08))}"/>`;
  out += `<path d="M${f1(x - s * 0.4)} ${f1(y + s * 0.3)} L${f1(x + s * 0.4)} ${f1(y + s * 0.3)} L${f1(x + s * 0.3)} ${f1(y + s * 0.45)} L${f1(x - s * 0.3)} ${f1(y + s * 0.45)} Z" fill="#2a2620" stroke="${INK}" stroke-width="0.6"/>`;
  out += glow(x, y - s * 0.2, s * (o.r || 4), s * (o.r || 4) * 0.8, AMBER, o.gop ?? 0.22);
  return out;
}
// reeds and sedge: tufts of blades rising from a screen point, bent, some with seed heads, ink-edged dark blades
function reeds(x, y, h, n, col = REED, o = {}) {
  let s = '';
  for (let i = 0; i < n; i++) { const dx = (R() - 0.5) * h * 0.5, hh = h * (0.5 + R() * 0.6), bend = (R() - 0.4) * hh * (o.flat ? 1.2 : 0.35), x0 = x + dx, tip = [x0 + bend, y - hh * (o.flat ? 0.4 : 1)];
    const w = Math.max(0.8, h * 0.03);
    s += `<path d="M${f1(x0 - w)} ${f1(y)} Q${f1(x0 + bend * 0.2)} ${f1(y - hh * 0.5)} ${f1(tip[0])} ${f1(tip[1])} Q${f1(x0 + bend * 0.25 + w)} ${f1(y - hh * 0.5)} ${f1(x0 + w)} ${f1(y)} Z" fill="${tone(col, 0.25)}" stroke="${INK}" stroke-width="${f1(Math.max(0.35, w * 0.4))}"/>`;
    if (R() < (o.heads ?? 0.15)) s += `<ellipse cx="${f1(tip[0])}" cy="${f1(tip[1] + h * 0.04)}" rx="${f1(w * 1.1)}" ry="${f1(h * 0.06)}" fill="#3a2a18" stroke="${INK}" stroke-width="0.5"/>`; }
  return s;
}

// ============================================================================ FAR
layer('far');
// ---- the sky: low overcast at dusk, banks of cloud with lit upper-left rims, hatched undersides; sickly pale at the horizon
{
  // dark overcast pressing down, sickly pale low over the fen where the last light comes through (backlights the village)
  raw(`<rect width="${W}" height="${H}" fill="#22241a"/>`);
  raw(G.sky([[0, '#1e2018'], [0.2, '#2a2c20'], [0.35, '#363828'], [0.48, '#4a4c3a'], [0.56, '#62644a'], [0.62, '#7e8064'], [0.66, '#8a8c70'], [1, '#3a3c2c']]));   // polish: smooth dusk gradient
  // cloud masses of every size, drawn far (low, pale) to near (high, dark): lobed tops lit at the upper left, flat
  // dragged bellies, crosshatch in the belly, torn wisps trailing to the right
  const CL = []; for (let i = 0; i < 19; i++) { const y = 40 + Math.pow(R(), 0.8) * 230; CL.push([y, R() * W * 1.1 - 60]); }
  CL.sort((a, b) => b[0] - a[0]);
  // polish: soft cloud masses (no hard lobes), darker and larger high, small and pale low over the fen, lit from below
  for (const [cy, cx] of CL) { const depth = (cy - 30) / 250, kind = R(), w = (380 - depth * 220) * (kind < 0.35 ? 1.6 : 0.7 + R() * 0.6), h = (60 - depth * 40) * (kind < 0.35 ? 0.4 : 0.8 + R() * 0.6), col = mix('#24261c', '#7a7c62', Math.pow(depth, 1.3) * 0.9);
    raw(G.softCloud(cx, cy, w, h, col, { op: 0.8, lit: mix(col, '#c8c8a4', 0.35), dark: mix(col, '#101208', 0.4) })); }
}
// ---- the far fen at the horizon: reed beds, pollard stumps, the roofs of other stilt villages in the mist
{
  for (let i = 0; i < 9; i++) { const X = -70 + i * 17 + R() * 8, Z = 70 + R() * 50, w = 6 + R() * 6, fy = 1.8, ey = 3.8, ry = 6;
    const pts = [P(X, -0.4, Z), P(X + w, -0.4, Z), P(X + w, ey, Z), P(X + w * 0.5 + (R() - 0.5), ry, Z + 2), P(X, ey, Z)];
    raw(`<path d="${p2(pts)}" fill="${fogC('#3a3428', Z, 1.1)}" stroke="${fogC(INK, Z, 0.8)}" stroke-width="0.6"/>`);
    for (let k = 0; k < 4; k++) { const A = P(X + w * (0.1 + k * 0.27), -0.4, Z), B = P(X + w * (0.1 + k * 0.27), fy, Z); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${fogC(INK, Z, 0.8)}" stroke-width="0.8"/>`); }
    if (R() < 0.5) { const l = P(X + w * 0.3, fy + 0.6, Z); raw(EM(`<circle cx="${f1(l[0])}" cy="${f1(l[1])}" r="1" fill="${AMBER}" opacity="0.8"/>`)); } }
  raw(`<path d="${smooth([[-10, 300], ...Array.from({ length: 40 }, (_, i) => [i * 38, 296 - R() * 7 - Math.sin(i * 0.7) * 3]), [W + 10, 300], [W + 10, 312], [-10, 312]], true, 0.6)}" fill="${fogC('#3a3a26', 80, 1.1)}"/>`);
  let rb = ''; for (let i = 0; i < 700; i++) { const x = R() * W, y = 300 + R() * 10, h = 2 + R() * 6; rb += `M${f1(x)} ${f1(y)} l${f1((R() - 0.3) * 1.5)} ${f1(-h)} `; } raw(`<path d="${rb}" stroke="${fogC(INK, 60, 0.7)}" stroke-width="0.6" opacity="0.6"/>`);
  for (const [X, Z] of [[-40, 55], [-26, 48], [30, 52], [52, 60]]) { const b = P(X, -0.4, Z), t = P(X, 2.5 + R() * 2, Z); raw(line([b, t], 2.2, fogC('#2a241a', Z), 1)); for (let k = 0; k < 5; k++) raw(line([t, [t[0] + (R() - 0.5) * 16, t[1] - 4 - R() * 8]], 0.7, fogC('#2a241a', Z), 0.9)); }
  raw(G.softBank(-10, W + 10, 304, 12, { col: MIST, op: 0.3, ph: 1 }));
}
// ---- the black water from the stage out to the fen: still, oily, the lanterns' reflections broken in it
const LANTS = [];
raw(BK.water(-80, 80, 9.8, 140, WATER, { y: -0.4, n: 260, lite: '#5a5e48' }));
// ---- reed beds across the water, and the trodden swathe: where the moot-hall walked off into the fen it left a channel
// through the reeds, reeds lying flat at its sides, and its footprints: clusters of pile-sockets in the peat, churned and
// ringed, one stride after another, smaller and smaller toward the horizon at the right
const trail = Z => 3 + (Z - 22) * 0.55;
{
  for (let i = 0; i < 90; i++) { const Z = 24 + Math.pow(R(), 0.9) * 70, X = -60 + R() * 120; if (Math.abs(X - trail(Z)) < 4.5 + Z * 0.03) continue;
    const [x, y] = P(X, -0.4, Z); raw(reeds(x, y, K(Z) * (1.2 + R() * 0.8), 5 + Math.floor(R() * 5), fogC(R() < 0.5 ? REED : '#4a4a2c', Z), { heads: 0.2 })); }
  for (let i = 0; i < 30; i++) { const Z = 24 + i * 2.3, X = trail(Z); const [x, y] = P(X, -0.4, Z), w = K(Z) * 7;
    raw(`<path d="${smooth([[x - w / 2, y], [x - w * 0.3, y - K(Z) * 0.06], [x + w * 0.4, y - K(Z) * 0.05], [x + w / 2, y + 0.5]], true, 0.6)}" fill="#2e2618" opacity="0.4"/>`);
    raw(reeds(x - w * 0.55, y, K(Z) * 1.1, 3, fogC(REED, Z), { flat: true, heads: 0 }) + reeds(x + w * 0.55, y, K(Z) * 1.1, 3, fogC(REED, Z), { flat: true, heads: 0 })); }
  for (const Z of [26, 34, 43, 53, 64, 77]) for (const [dx, dz] of [[-1.6, 0], [1.6, 0], [-1.5, 2.2], [1.7, 2.2]]) { const c = P(trail(Z + dz) + dx, -0.4, Z + dz), k = K(Z);
    raw(BK.ripples(c[0], c[1], k * 0.9, 3, '#7a7a5a', 0.45) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(Math.max(0.8, k * 0.25))}" ry="${f1(Math.max(0.4, k * 0.06))}" fill="#050604"/>`); }
}
// ---- stilt houses across the water (each its own: one long, one squat with a sod-patched wall, one far with a walkway)
const HOUSES = [
  { X0: -20.5, X1: -9.2, Z: 20, fy: 2.3, ey: 4.6, ry: 7.6, dz: 3.2, door: -11.6, sod: 1, wattle: 4, stools: 5, sag: 0.25 },
  { X0: 7.4, X1: 15.6, Z: 19, fy: 2.0, ey: 4.2, ry: 6.9, dz: 2.6, door: 8.6, sod: 3, wattle: -1, stools: 4, sag: 0.4 },
  { X0: 16.5, X1: 31, Z: 28, fy: 2.4, ey: 4.6, ry: 7.4, dz: 3, door: 19.2, sod: -1, wattle: 2, stools: 3, sag: 0.15 },
];
function house(h) {
  const { X0, X1, Z, fy, ey, ry, dz } = h;
  // the piles: tanned black, splayed a little, fungus and mould fur at the old waterline (the water now stands lower)
  for (let X = X0 + 0.3; X <= X1 - 0.2; X += 1.5 + R() * 0.4) raw(pile(X, -0.45, fy, Z + 0.25, 0.26, { lean: (R() - 0.5) * 0.12, wl: 0.35 + R() * 0.2, shelf: R() < 0.5 ? 0.35 + R() * 0.3 : 0, myc: R() < 0.5 }));
  // round 2: the gable end turned toward the middle (the house has depth): daub panels between posts receding, the
  // thatch's verge over it; the left house shows its right end (shaded, away from the light), the right ones their left end
  { const Xe = (X0 + X1) / 2 < 0 ? X1 : X0, D = dz * 2, lit = Xe === X0, atE = (s2, t) => [Xe, fy + t, Z + s2];
    const gab = [[0, 0], [D, 0], [D, ey - fy], [dz, ry - fy], [0, ey - fy]].map(([s2, t]) => P(...atE(s2, t)));
    raw(cel(gab, { Z: Z + dz, fill: fogC(tone(DAUB, 0.15), Z + dz), tex: 'url(#mottle)', texOp: 0.5, band: 2 }));
    if (!lit) raw(hatch3(atE, 0, D, 0, ry - fy, 0.8, { op: 0.45, keep: (s2, t) => t < ey - fy + (ry - ey) * (1 - Math.abs(s2 - dz) / dz) }) + hatch3(atE, 0, D, 0, ey - fy, -0.7, { op: 0.35 }));
    for (let k = 1; k < 4; k++) { const a = P(...atE(D * k / 4, 0)), b = P(...atE(D * k / 4, Math.min(ey - fy, ey - fy + (ry - ey) * (1 - Math.abs(D * k / 4 - dz) / dz)) - 0.05)); raw(line([a, b], Math.max(1.2, K(Z) * 0.16), INK, 1) + line([a, b], Math.max(0.7, K(Z) * 0.1), fogC('#3a2c1e', Z), 1)); }
    const v0 = P(...atE(-0.3, ey - fy - 0.1)), v1 = P(...atE(dz, ry - fy + 0.15)), v2 = P(...atE(D + 0.3, ey - fy - 0.1));
    raw(line([v0, v1, v2], Math.max(2, K(Z) * 0.25), INK, 1) + line([v0, v1, v2], Math.max(1.2, K(Z) * 0.16), fogC(THATCH, Z), 1));
    for (let k = 0; k < 2; k++) raw(pile(Xe, -0.45, fy, Z + D * (0.45 + k * 0.5), 0.24, { wl: 0.35, myc: R() < 0.5 })); }
  // the floor beam and platform edge
  raw(cel([P(X0 - 0.3, fy - 0.28, Z), P(X1 + 0.3, fy - 0.28, Z), P(X1 + 0.3, fy, Z), P(X0 - 0.3, fy, Z)], { Z, fill: fogC('#2e2418', Z), tex: 'url(#mottle)', texOp: 0.5 }));
  raw(daubWall(X0, X1, fy, ey, Z, { sod: h.sod, wattle: h.wattle }));
  // the door: low and wide, dark inside; a rope ladder hangs from it to the water, its rungs swollen; the horn lantern
  { const d0 = P(h.door, fy, Z - 0.02), d1 = P(h.door + 1.0, fy + 1.45, Z - 0.02);
    raw(cel([[d0[0], d1[1]], [d1[0], d1[1]], [d1[0], d0[1]], [d0[0], d0[1]]], { Z, fill: '#0e0c08', hi: false }) + `<path d="${p2([[d0[0], d1[1]], [d1[0], d1[1]], [d1[0], d0[1]], [d0[0], d0[1]]])}" fill="${S.hatchB(Z)}" opacity="0.5"/>`);
    const lx = h.door - 0.25, L = P(lx, fy + 1.3, Z - 0.1); raw(hornLantern(L[0], L[1], K(Z) * 0.28)); LANTS.push([L[0], L[1], Z]);
    const a = P(h.door + 0.25, fy, Z - 0.05), b = P(h.door + 0.75, fy, Z - 0.05), a2 = P(h.door + 0.2, -0.3, Z - 0.3), b2 = P(h.door + 0.8, -0.3, Z - 0.3);
    raw(line([a, a2], 1, INK, 1) + line([b, b2], 1, INK, 1)); for (let k = 1; k < 7; k++) { const u = k / 7, A = [a[0] + (a2[0] - a[0]) * u, a[1] + (a2[1] - a[1]) * u], B = [b[0] + (b2[0] - b[0]) * u, b[1] + (b2[1] - b[1]) * u + (R() - 0.5)]; raw(line([A, B], Math.max(1.2, K(Z) * 0.06), INK, 1) + line([A, B], Math.max(0.6, K(Z) * 0.035), fogC('#5a4a30', Z), 1)); }
  }
  // a small window: shutter hanging, dark
  { const wx = (X0 + X1) / 2 + 1.3, w0 = P(wx, fy + 0.9, Z - 0.02), w1 = P(wx + 0.6, fy + 1.4, Z - 0.02); raw(`<path d="${p2([[w0[0], w1[1]], [w1[0], w1[1]], [w1[0], w0[1]], [w0[0], w0[1]]])}" fill="#0e0c08" stroke="${INK}" stroke-width="0.9"/>` + cel([[w1[0], w1[1] + 1], [w1[0] + (w1[0] - w0[0]) * 0.45, w1[1] + 3], [w1[0] + (w1[0] - w0[0]) * 0.4, w0[1] + 4], [w1[0], w0[1]]], { Z, fill: fogC('#3a2e1e', Z) })); }
  // eel traps hung in a row under the eaves; the thatch; drips
  for (let X = X0 + 0.6; X < X1 - 0.4; X += 0.7 + R() * 0.5) { if (Math.abs(X - h.door - 0.5) < 0.9) continue; const e = P(X, ey - 0.05, Z - 0.3); raw(eelTrap(e[0], e[1] + K(Z) * 0.1, K(Z) * (0.55 + R() * 0.25), { col: fogC('#5a4a2e', Z) })); }
  const T = thatch(X0 - 0.5, X1 + 0.5, ey, ry, Z - 0.5, dz, { stools: h.stools, sag: h.sag });
  raw(T.svg);
  return T;
}
for (const h of HOUSES.slice().sort((a, b) => b.Z - a.Z)) {
  if (h === HOUSES[2]) {
    // a walkway on low piles between the far house and the near right one, its planks sagging, a plank missing
    const Z = 24, at = (s, t) => [14 + s, 1.6 - Math.sin(s / 6 * Math.PI) * 0.15, Z + t];
    for (let X = 14.3; X < 20; X += 1.2) raw(pile(X, -0.45, 1.55, Z + 0.8, 0.18, { wl: 0.4, myc: R() < 0.4 }));
    raw(boards(at, 6, 0.9, fogC('#3a2e1e', Z), { bw: 0.18, segs: 2, nails: false }));
  }
  house(h);
}
// ---- THE MOOT-HALL THAT WALKED: its double row of oak piles standing in the water with no hall on them. Snapped tops
// splayed outward where the weight tore off them; two sockets empty, the water still churned round them; the reeve's tally
// sticks nailed to the last post; the gangway from the near house ending in air, its rope ladder hanging into nothing.
{
  const rows = [[16.5, [-6.3, -4.3, -2.2, -0.1, 2.0, 4.1, 6.0]], [20.5, [-6.1, -4.1, -2.0, 0.1, 2.2, 4.2, 6.2]]];
  for (const [Z, xs] of rows.slice().reverse()) xs.forEach((X, i) => {
    const gone = (Z > 18 && (i === 2 || i === 5)) || (Z < 18 && i === 4);
    if (gone) { // the empty socket: a ring of churned peat water and a raw splinter lip of the hole
      const c = P(X, -0.4, Z); raw(BK.ripples(c[0], c[1], K(Z) * 0.9, 4, '#6a6a50', 0.5) + `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(K(Z) * 0.22)}" ry="${f1(K(Z) * 0.05)}" fill="#050604" stroke="${INK}" stroke-width="0.7"/>` + stain(c[0], c[1], K(Z) * 0.8, '#3a3020', 0.5));
      return; }
    const top = (Z < 18 ? 1.7 : 1.9) + R() * 0.9, lean = (X < 0 ? -1 : 1) * (0.06 + R() * 0.14);
    raw(pile(X, -0.45, top, Z, 0.36, { snap: true, lean, wl: 0.3 + R() * 0.15, shelf: R() < 0.6 ? 0.3 + R() * 0.3 : 0, myc: true }));
    // the torn tenon: a pale splintered core where the hall's sill beam pulled off the pile head
    const t = P(X + lean, top, Z); raw(`<path d="M${f1(t[0] - K(Z) * 0.1)} ${f1(t[1] - 1)} l${f1(K(Z) * 0.05)} ${f1(-K(Z) * 0.28)} l${f1(K(Z) * 0.06)} ${f1(K(Z) * 0.22)} l${f1(K(Z) * 0.04)} ${f1(-K(Z) * 0.15)} l${f1(K(Z) * 0.04)} ${f1(K(Z) * 0.2)}" fill="${fogC('#8a7a58', Z)}" stroke="${INK}" stroke-width="0.6"/>`);
    if (Z < 18 && i === 6) { // the reeve's notched tally sticks, nailed to the last post
      for (let k = 0; k < 4; k++) { const a = P(X - 0.05 + k * 0.05, top - 0.15, Z - 0.17), b = P(X - 0.08 + k * 0.05, top - 0.75 - k * 0.05, Z - 0.17); raw(line([a, b], 2.4, INK, 1) + line([a, b], 1.4, fogC('#8a7a58', Z), 1)); for (let j = 0; j < 5; j++) { const y = a[1] + (b[1] - a[1]) * (0.15 + j * 0.16); raw(`<path d="M${f1(a[0] - 0.8)} ${f1(y)} l1.6 0" stroke="${INK}" stroke-width="0.5"/>`); } }
    }
  });
  // the cross-beams that tied the rows, snapped, one hanging by a peg into the water
  { const a = P(-2.2, 1.6, 16.5), b = P(-1.4, -0.3, 18.2); raw(line([a, b], K(17) * 0.18, INK, 1) + line([a, b], K(17) * 0.12, '#3a2e1e', 1));
    const c = P(4.1, 2.0, 20.4), d = P(6.2, 1.2, 20.4); raw(line([c, d], K(20) * 0.2, INK, 1) + line([c, d], K(20) * 0.13, '#3a2e1e', 1)); }
  // the gangway from the left house's door platform, ending in air over the gap; its rope ladder hangs to nothing
  { const Z = 18.0, y = 2.3, at = (s, t) => [-9.2 + s, y - s * 0.02, Z + t];
    raw(boards(at, 2.6, 0.8, fogC('#3a2e1e', Z), { bw: 0.2, segs: 1, nails: false, chipEnds: true }) + cel([P(-9.2, y - 0.3, Z), P(-6.6, y - 0.32, Z), P(-6.7, y - 0.02, Z), P(-9.2, y, Z)], { Z, fill: '#2e2418', tex: 'url(#mottle)', texOp: 0.5 }));
    for (let k = 0; k < 4; k++) { const e = P(-6.6 + (R() - 0.5) * 0.1, y - 0.05, Z + 0.1 + k * 0.2); raw(`<path d="M${f1(e[0])} ${f1(e[1])} l${f1(3 + R() * 3)} ${f1(1 + R())} l${f1(-1)} ${f1(2)}" fill="${fogC('#8a7a58', Z)}" stroke="${INK}" stroke-width="0.5"/>`); }
    const a = P(-6.95, y, Z + 0.1), b = P(-6.65, y, Z + 0.1), a2 = P(-7.0, 0.3, Z + 0.1), b2 = P(-6.6, 0.5, Z + 0.1);
    raw(line([a, a2], 0.9, INK, 1) + line([b, b2], 0.9, INK, 1)); for (let k = 1; k < 7; k++) { const u = k / 7, A = [a[0] + (a2[0] - a[0]) * u, a[1] + (a2[1] - a[1]) * u], B = [b[0] + (b2[0] - b[0]) * u, b[1] + (b2[1] - b[1]) * u]; raw(line([A, B], 1.8, INK, 1) + line([A, B], 1, fogC('#5a4a30', Z), 1)); }
    raw(line([a2, [a2[0] - 2, a2[1] + 6]], 0.6, INK, 0.8) + line([b2, [b2[0] + 1, b2[1] + 4]], 0.6, INK, 0.8));
  }
}
// ---- lantern reflections in the water, broken; mist lying low among the piles
for (const [x, y, Z] of LANTS) { const yr = 300 + (300 - y) * 0.5; raw(glow(x, yr, K(Z) * 0.3, K(Z) * 1.2, AMBER, 0.12)); for (let yy = 302; yy < yr + 10; yy += 2 + R() * 2.5) { const ww = K(Z) * (0.15 + R() * 0.35); raw(`<path d="M${f1(x - ww / 2 + (R() - 0.5) * 3)} ${f1(yy)} l${f1(ww)} 0" stroke="${AMBER}" stroke-width="${f1(0.7 + R() * 0.6)}" opacity="${f1(0.2 + R() * 0.35)}"/>`); } }
raw(G.softBank(-10, W + 10, 300, 22, { col: MIST, op: 0.2, ph: 3, below: 8 }) + G.softBank(-10, W + 10, 318, 14, { col: MIST, op: 0.16, ph: 5, below: 6 }));
// ---- the fighters' band: stepped toward the murk behind them
raw(BK.quiet(MURK, 232, 372, { steps: [0.12, 0.14, 0.16, 0.2], hop: 0.14 }));
// ---- the landing stage: oak planks laid across, wet and peat-stained, mould fur in the gaps, black water showing through
// the gaps; its far edge with stubby pile heads and mooring rings; a bog body tanned brown in the water just beyond it
{
  const Zf = 10.2, at = (s, t) => [-16 + t, 0, 3.6 + s];   // round 2: planks run away from us (joints converge)
  raw(boards(at, Zf - 3.6, 32, PEAT, { bw: 0.24, vary: 0.3, stains: 0.35, knots: 0.3 }));
  // wet: dark stains where water stands, a dull sheen; mould and moss in the joints; peat clods trodden flat
  for (let i = 0; i < 26; i++) { const X = -12 + R() * 24, Z = 4 + R() * 6, [x, y] = P(X, 0, Z); raw(stain(x, y, K(Z) * (0.12 + R() * 0.25), '#0a0c06', 0.3)); }
  for (let i = 0; i < 40; i++) { const X = -13 + R() * 26, Z = 4.2 + R() * 5.8, [x, y] = P(X, 0, Z), l = K(Z) * (0.2 + R() * 0.5); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="${R() < 0.5 ? '#6a7044' : '#a8a888'}" stroke-width="${f1(Math.max(0.6, K(Z) * 0.015))}" opacity="0.4"/>`); }
  for (let i = 0; i < 14; i++) { const X = -12 + R() * 24, Z = 4.5 + R() * 5, [x, y] = P(X, 0, Z); raw(cel(chip(ell([x, y], K(Z) * 0.12, K(Z) * 0.04, 0, 7), 0.6), { Z, fill: tone(PEATD, 0.2), band: 0.8 })); }
  raw(occBand((s, t) => [-16 + s, 0, Zf - t], 32, 1.0, { op: 0.35 }));
  // the far edge beam and pile heads with iron mooring rings
  raw(cel([P(-16, 0, Zf), P(16, 0, Zf), P(16, 0.12, Zf), P(-16, 0.12, Zf)], { Z: Zf, fill: '#2a2018', tex: 'url(#mottle)', texOp: 0.5 }));
  for (let X = -11; X < 12; X += 3.1 + R() * 0.8) { raw(pile(X, 0, 0.35 + R() * 0.15, Zf, 0.24, { snap: R() < 0.3 })); if (R() < 0.6) { const r = P(X + 0.14, 0.2, Zf - 0.05); raw(`<ellipse cx="${f1(r[0] + 2)}" cy="${f1(r[1] + 2)}" rx="2" ry="2.6" fill="none" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f1(r[0] + 2)}" cy="${f1(r[1] + 2)}" rx="2" ry="2.6" fill="none" stroke="#5a4a3a" stroke-width="0.5"/>`); } }
}

// ======================================================================== MID: low things on the stage behind the fighters
layer('mid');
{
  // the eel-catchers' gear: a heap of willow traps and a leister (eel spear) laid on them; a creel; a peat stack under a
  // sacking cover; a moored punt at the right, half sunk, a pole across it; a frog-bone twine charm on a pile head; all dark
  const Z = 9.3;
  for (let k = 0; k < 5; k++) { const [x, y] = P(-7.5 + k * 0.45 + R() * 0.2, 0.15 + (k % 2) * 0.2, Z - (k % 2) * 0.3); raw(`<g transform="rotate(${f1(-70 - R() * 30)} ${f1(x)} ${f1(y)})">${eelTrap(x, y, K(Z) * 0.85, { col: '#3e3220' })}</g>`); }
  { const a = P(-8.3, 0.45, Z - 0.2), b = P(-5.6, 0.55, Z - 0.4); raw(line([a, b], 2.4, INK, 1) + line([a, b], 1.2, '#4a3a26', 1)); for (let k = 0; k < 5; k++) raw(line([[b[0] + 1, b[1] - 2 + k], [b[0] + 8, b[1] - 5 + k * 2.4]], 0.8, INK, 1)); }
  // the peat stack: turfs stacked crosswise, each a dark brick with fibrous edges, a wet sacking over the top
  { const x0 = -4.2, Zp = 9.6; for (let r = 0; r < 4; r++) for (let k = 0; k < 6 - r; k++) { const X = x0 + k * 0.3 + r * 0.15, Y = r * 0.13; raw(cel(chip([P(X, Y, Zp), P(X + 0.28, Y, Zp), P(X + 0.28, Y + 0.12, Zp), P(X, Y + 0.12, Zp)], 0.5), { Z: Zp, fill: tone('#2e2216', 0.2), tex: 'url(#mottle)', texOp: 0.5, band: 0.8 })); }
    const cov = [P(x0 + 0.2, 0.52, Zp - 0.05), P(x0 + 0.9, 0.62, Zp - 0.05), P(x0 + 1.5, 0.5, Zp - 0.05), P(x0 + 1.4, 0.25, Zp - 0.05), P(x0 + 0.6, 0.35, Zp - 0.05)]; raw(cel(cov, { Z: Zp, fill: '#3a3424', tex: 'url(#mottle)', texOp: 0.5 })); }
  // the bog body in the shallows just past the stage edge: face and one hand above the water, tanned brown, unrotted
  { const Zb = 10.8, f = P(3.4, -0.3, Zb), k = K(Zb);
    raw(`<path d="${smooth([[f[0] - k * 0.3, f[1]], [f[0] - k * 0.22, f[1] - k * 0.12], [f[0] - k * 0.05, f[1] - k * 0.16], [f[0] + k * 0.12, f[1] - k * 0.12], [f[0] + k * 0.2, f[1] - k * 0.04], [f[0] + k * 0.24, f[1]]], true, 0.5)}" fill="#4a3220" stroke="${INK}" stroke-width="0.8"/>`);
    raw(`<path d="M${f1(f[0] - k * 0.1)} ${f1(f[1] - k * 0.1)} l${f1(k * 0.06)} ${f1(k * 0.02)} M${f1(f[0] + k * 0.03)} ${f1(f[1] - k * 0.11)} l${f1(k * 0.05)} 0 M${f1(f[0] - k * 0.02)} ${f1(f[1] - k * 0.04)} l${f1(k * 0.08)} ${f1(-k * 0.01)}" stroke="${INK}" stroke-width="0.7"/>`);
    const hnd = P(4.2, -0.3, Zb + 0.2); raw(`<path d="${smooth([[hnd[0] - 3, hnd[1]], [hnd[0] - 2, hnd[1] - 6], [hnd[0] - 1, hnd[1] - 9], [hnd[0] + 1, hnd[1] - 8], [hnd[0] + 2.5, hnd[1] - 5], [hnd[0] + 3, hnd[1]]], true, 0.5)}" fill="#3e2a1a" stroke="${INK}" stroke-width="0.7"/>`);
    raw(BK.ripples(f[0], f[1] + 1, k * 0.5, 3, '#6a6a50', 0.35) + line([[f[0] - k * 0.2, f[1] - k * 0.02], [f[0] - k * 0.5, f[1] + 1]], 1, '#5a5030', 0.7));
  }
  // the punt, moored at the right, half sunk, its pole laid across the stage
  { const Z = 10.9, a = P(6.2, -0.35, Z), b = P(10.4, -0.3, Z), k = K(Z);
    raw(cel([[a[0], a[1]], [b[0], b[1]], [b[0] - k * 0.2, b[1] - k * 0.22], [a[0] + k * 0.15, a[1] - k * 0.12]], { Z, fill: '#2a2216', tex: 'url(#mottle)', texOp: 0.5 }));
    raw(line([P(5.6, 0.05, 9.6), P(10.8, 0.08, 9.9)], 2.2, INK, 1) + line([P(5.6, 0.05, 9.6), P(10.8, 0.08, 9.9)], 1.1, '#4a3a26', 1));
    raw(line([P(6.0, 0.2, 10.15), [a[0] + 3, a[1] - 3]], 0.8, '#5a4a30', 0.9)); }
  // a creel and a dropped leech jar by it (the barber's); a hags' frog-bone twine charm on a pile head
  { const Z = 9.0, c = P(1.4, 0, Z), k = K(Z); raw(cel([[c[0] - k * 0.22, c[1]], [c[0] + k * 0.22, c[1]], [c[0] + k * 0.26, c[1] - k * 0.38], [c[0] - k * 0.26, c[1] - k * 0.38]], { Z, fill: '#3a3020' })); for (let j = 1; j < 5; j++) raw(`<path d="M${f1(c[0] - k * 0.24)} ${f1(c[1] - k * 0.08 * j)} l${f1(k * 0.48)} 0" stroke="${INK}" stroke-width="0.6" opacity="0.7"/>`);
    const jr = P(2.1, 0, Z - 0.2); raw(`<g transform="rotate(80 ${f1(jr[0])} ${f1(jr[1] - 3)})"><path d="${smooth([[jr[0] - 3, jr[1]], [jr[0] - 3.4, jr[1] - 6], [jr[0] - 2, jr[1] - 9], [jr[0] + 2, jr[1] - 9], [jr[0] + 3.4, jr[1] - 6], [jr[0] + 3, jr[1]]], true, 0.5)}" fill="#3a3a2a" stroke="${INK}" stroke-width="0.7"/></g>`); }
}

// ======================================================================== FORE: the house we stand under, drawn over the fighters
layer('fore');
{
  const NEAR = '#16130c';
  // the thatch eave of the house over the stage, top left: we stand under its overhang
  const pts = [[-10, -10], [560, -10], [520, 18], [430, 32], [330, 38], [210, 50], [100, 58], [-10, 70]];
  raw(`<path d="${smooth(pts, true, 0.4)}" fill="#2a2416"/><path d="${smooth(pts, true, 0.4)}" fill="url(#mottle)" opacity="0.6"/><path d="${smooth(pts, true, 0.4)}" fill="${S.hatchA(3)}" opacity="0.45"/><path d="${smooth(pts, true, 0.4)}" fill="${S.hatchB(3)}" opacity="0.3"/>`);
  let st = ''; for (let i = 0; i < 160; i++) { const u = R(), x = 520 - u * 530, y = 18 + u * 40 + R() * 6; st += `M${f1(x)} ${f1(y - 6 - R() * 10)} l${f1((R() - 0.5) * 3)} ${f1(8 + R() * 10)} `; } raw(`<path d="${st}" stroke="#4a3e26" stroke-width="1" opacity="0.8"/><path d="${smooth(pts.slice(1), false, 0.4)}" stroke="${INK}" stroke-width="2.2" fill="none"/>`);
  for (let i = 0; i < 9; i++) { const u = R(), x = 500 - u * 500, y = 22 + u * 38; raw(BK.toadstools(x, y + 4, 4 + R() * 3, 1 + Math.floor(R() * 2), '#8a7a50')); }
  for (let i = 0; i < 12; i++) { const u = R(), x = 520 - u * 520, y = 26 + u * 38, l = 6 + R() * 20; raw(`<path d="M${f1(x)} ${f1(y)} l0 ${f1(l)}" stroke="#8a9080" stroke-width="0.8" opacity="0.5" stroke-dasharray="${f1(l * 0.6)} 3"/><circle cx="${f1(x)}" cy="${f1(y + l + 2)}" r="1.1" fill="#a8b0a0" opacity="0.6"/>`); }
  // eel traps hung from that eave, and the horn lantern on its iron hook, lit
  for (const [x, y, l] of [[130, 52, 54], [178, 48, 46], [395, 34, 40]]) raw(eelTrap(x, y, l, { col: '#3a3020' }));
  raw(`<path d="M262 44 L262 70 Q262 78 270 78" stroke="${INK}" stroke-width="2.4" fill="none"/>` + hornLantern(270, 104, 22, { r: 4.5, gop: 0.26 }));
  // the frog-bone charm on twine from the eave: little bones knotted along a cord
  { let c = line([[300, 40], [302, 80], [299, 112]], 0.8, '#8a7a58', 1); for (let k = 0; k < 7; k++) { const y = 50 + k * 9; c += `<path d="M${f1(298 + (k % 2) * 2)} ${f1(y)} l${f1(4 + R() * 2)} ${f1(2 + R() * 2)}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M${f1(298 + (k % 2) * 2)} ${f1(y)} l${f1(4 + R() * 2)} ${f1(2 + R() * 2)}" stroke="#d8ccb0" stroke-width="1.1" stroke-linecap="round"/>`; } raw(c); }
  // two near piles framing the stage: tanned black, slick, shelf fungus stacked, mould fur, mycelium; the right one with a
  // rope and a drowned dog hanging by it (preserved, unrotted, its fur matted)
  raw(pile(-4.72, -1, 6, 4.3, 0.42, { wl: 0.35, myc: true, col: '#1e1810' }) + pile(4.75, -1, 6, 4.3, 0.42, { wl: 0.4, myc: true, col: '#1e1810' }));
  { const p = P(-4.72, 2.4, 4.2); raw(BK.shelf(p[0] + 14, p[1] + 20, 34, '#6e6438', { n: 3 }) + BK.shelf(p[0] + 8, p[1] + 80, 24, '#5e5430', { n: 2 }) + BK.blisters(p[0] + 10, p[1] + 140, 12, 7, '#5a6428', { size: 2.2 })); const q = P(4.75, 2.0, 4.2); raw(BK.shelf(q[0] - 14, q[1] + 30, 30, '#6e6438', { n: 3 })); }
  { const top = P(4.55, 3.2, 4.2), a = [top[0] - 6, top[1] + 70]; raw(BK.rope([top, [top[0] - 3, top[1] + 30], a], 2.2, '#5a4a30'));
    const k = 34; raw(cel([[a[0] - k * 0.3, a[1]], [a[0] + k * 0.25, a[1] + 2], [a[0] + k * 0.32, a[1] + k * 1.2], [a[0] + k * 0.1, a[1] + k * 1.6], [a[0] - k * 0.2, a[1] + k * 1.5], [a[0] - k * 0.35, a[1] + k * 0.9]], { Z: 4.2, fill: '#3a2a1a', tex: 'url(#mottle)', texOp: 0.5, band: 3 }));
    for (let j = 0; j < 14; j++) raw(`<path d="M${f1(a[0] + (R() - 0.5) * k * 0.5)} ${f1(a[1] + 6 + R() * k * 1.3)} l${f1((R() - 0.5) * 3)} ${f1(5 + R() * 5)}" stroke="${INK}" stroke-width="0.8" opacity="0.7"/>`);
    raw(`<path d="M${f1(a[0] - k * 0.15)} ${f1(a[1] + k * 1.5)} l${f1(-2)} ${f1(k * 0.5)} M${f1(a[0] + k * 0.15)} ${f1(a[1] + k * 1.55)} l${f1(1)} ${f1(k * 0.45)}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`); }
  // reeds and sedge in the bottom corners, rising out of the water by the stage; a broken eel trap
  for (const [x, n] of [[20, 26], [90, 14], [W - 30, 24], [W - 110, 12]]) raw(reeds(x, H + 4, 90 + R() * 30, n, '#3a3a20', { heads: 0.25 }));
  raw(`<path d="${smooth([[-10, H + 2], [40, H - 26], [150, H - 18], [230, H + 2]], true, 0.6)}" fill="${NEAR}" stroke="${INK}" stroke-width="1.4"/><path d="${smooth([[W + 10, H + 2], [W - 60, H - 24], [W - 170, H - 14], [W - 240, H + 2]], true, 0.6)}" fill="${NEAR}" stroke="${INK}" stroke-width="1.4"/>`);
  raw(BK.blisters(60, H - 14, 30, 9, '#5a6428', { size: 2.6 }) + BK.toadstools(W - 90, H - 16, 7, 4, '#9a8a58'));
  // lantern gnats over the water near the lamp (small dark specks, a few catching the amber)
  for (let i = 0; i < 40; i++) { const a = R() * 6.28, d = 20 + R() * 70; raw(`<circle cx="${f1(270 + Math.cos(a) * d)}" cy="${f1(104 + Math.sin(a) * d * 0.6)}" r="${f1(0.5 + R() * 0.6)}" fill="${R() < 0.3 ? AMBER : INK}" opacity="0.8"/>`); }
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
