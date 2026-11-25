// World X, the Venom Spires: THE PLAIN ROAD (battle room, Living Ink). The travellers' road across the plain, running
// between the hive spires the insects built to catch the lightning. Same contract as the nave (exterior).
// Lore (bible/world_X_venom_spires.md): a plain of travellers' roads; lightning struck it, and the insects built towers to
// catch the lightning; their venom stops the heart, then the will. Lightning marks chitin and flesh with branching
// white-violet burns; toxin swells, paralyses and hollows. Palette: chitin black, venom green, white-violet strikes (plus
// dust, earth, grey paper comb, bone, grey). NO lightning is drawn in the air: the storm is cloud only; the strikes show
// as scorch on the spires and the road (Lichtenberg ferns with a white-violet core), fused iron, burnt paper.
// What is placed:
//   - the storm sky: heavy cloud masses, stepped, inked; no bolts
//   - the spires: towers of grey paper comb and chewed earth, layered in scalloped bands, holed with flight holes; each
//     crowned with iron the hive dragged up to catch the strikes: a church spire's cross, a weathervane, a cart axle, a
//     milestone's iron waymark; the iron fused into lumps, burns branching down the paper from it
//   - the travellers the hive took: wrapped in grey paper and hung on the spire flanks, swollen venom green through it
//   - the road: old paving across the plain, cart ruts, tilted slabs; a strike scar burned across the paving, the stones
//     at its heart fused; a toppled milestone, an overturned cart with its load wrapped in comb (low, dark)
//   - fore: the root of a near spire (paper bands, flight holes, a wasp at a hole); a bent iron waypost with a hanging
//     paper cocoon, dry thistles on the verge
// No eyes (not a void world). Red not used. No gold.
// Usage: node scenes/bg_hive_road.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'X');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 10101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#22202a' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW, GLOW, EM } = S;
const B = require('./battle_kit_b')(S, { murk: '#121216' });
const { inkS, fog, line, pline, fillP, fillS, inkP, blob, jag, lump, box, beam, burn, fused, pustules, quiet, skyBands } = B;

const CHIT = '#16151c', VEN = '#93b24c', VEND = '#4e6a2a', VIO = '#d4c8f4', PAPER = '#8c877a', PAPERD = '#5c5850', EARTH = '#5e5442', DUST = '#8a8270', IRON = '#3a3634', MURK = B.MURK;
const skyFog = (col, Z) => mix(col, '#3a3846', Math.min(0.75, Math.max(0, (Z - 12) / 90)));

// a storm cloud mass: lumpy top, flat-ish shadowed underside (cel band + hatch), inked
function cloud(cx, cy, w, h, col, o = {}) {
  const pts = []; const n = 18;
  for (let k = 0; k <= n; k++) { const t = k / n, x = cx - w / 2 + w * t, bump = Math.abs(Math.sin(t * Math.PI * (3 + (o.lobes || 2)) + (o.ph || 0))) * h * 0.35; pts.push([x, cy - h * 0.5 * Math.sin(t * Math.PI) - bump * Math.sin(t * Math.PI)]); }
  const under = []; for (let k = n; k >= 0; k--) { const t = k / n; under.push([cx - w / 2 + w * t, cy + h * 0.12 * Math.sin(t * Math.PI * 2 + 1) + (R() - 0.5) * 3]); }
  const poly = [...pts, ...under];
  let s = fillS(poly, col, 1, 0.45) + `<path d="${smooth(poly, true, 0.45)}" fill="url(#mottle)" opacity="0.35"/>`;
  const band = [...under.map(([x, y]) => [x, y]), ...under.slice().reverse().map(([x, y]) => [x, y - h * (0.22 + 0.05 * Math.sin(x * 0.05))])];
  const cid = S.id('cl'); s += `<clipPath id="${cid}"><path d="${smooth(poly, true, 0.45)}"/></clipPath><g clip-path="url(#${cid})">${fillS(band, mix(col, '#0e0c14', 0.45), 0.9, 0.4)}<path d="${smooth(band, true, 0.4)}" fill="${S.hatchA(30)}" opacity="0.5"/></g>`;
  s += line(pts.slice(2, 10).map(([x, y]) => [x + 2, y + 2.5]), 1.2, mix(col, '#e8e4f4', 0.35), 0.5);
  s += `<path d="${smooth(poly, true, 0.45)}" fill="none" stroke="${INK}" stroke-width="${f1(o.ink || 1.4)}"/>`;
  return s;
}
// a hive spire at (X, Z): base width bw (m), height h (m); paper-comb bands, flight holes, iron crown, burns, cocoons
function spire(X, Z, bw, h, o = {}) {
  const lean = o.lean ?? (R() - 0.5) * 0.1, L = [], Rr = [], n = 30, ex = 0.45 + R() * 0.9, collars = [];
  for (let k = 0; k < 2 + Math.floor(R() * 3); k++) collars.push([0.15 + R() * 0.7, 0.04 + R() * 0.05, 0.15 + R() * 0.35]);
  const bulge = t => collars.reduce((a, [c, wd, amp]) => a + amp * Math.exp(-Math.pow((t - c) / wd, 2)), 0);
  for (let k = 0; k <= n; k++) { const t = k / n, Y = h * t, w = bw / 2 * Math.pow(1 - t, ex) * (1 + 0.1 * Math.sin(t * 9 + X) + 0.05 * Math.sin(t * 23) + bulge(t)) + 0.08, cx = X + lean * Y + Math.sin(t * 4 + X) * bw * 0.05; L.push(P(cx - w, Y, Z)); Rr.push(P(cx + w * (0.95 + 0.1 * Math.sin(t * 7)), Y, Z)); }
  const poly = [...L, ...Rr.slice().reverse()], col = o.col || skyFog(PAPER, Z), cid = S.id('sp');
  let s = cel(poly, { Z, fill: col, band: Math.max(2, K(Z) * bw * 0.12), tex: 'url(#mottle)', texOp: 0.5 });
  s += `<clipPath id="${cid}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${cid})">`;
  // scalloped paper bands: each layer of chewed paper an arc, alternating tones, the band's lower lip catching light
  const bandH = o.bandH || 0.55; for (let Y = 0; Y < h; Y += bandH * (0.7 + R() * 0.6)) { const t = Y / h, w = bw / 2 * Math.pow(1 - t, 0.75) + 0.3, cx = X + lean * Y, pts = [];
    for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push(P(cx - w + 2 * w * u, Y + Math.sin(u * Math.PI * (2 + Math.floor(R() * 2))) * bandH * 0.25, Z)); }
    s += line(pts, Math.max(0.6, K(Z) * 0.025), mix(col, INK, 0.55), 0.7) + line(pts.map(([a, b]) => [a, b + 1.2]), 0.6, mix(col, '#f0ece0', 0.4), 0.45);
    if (R() < 0.35) s += fillS(pts.concat(pts.slice().reverse().map(([a, b]) => [a, b - K(Z) * bandH * 0.6])), mix(col, R() < 0.5 ? '#c8bea4' : '#3a3630', 0.25), 0.45); }
  // shadow side crosshatch and a darker band low down (the fighters' band for near spires)
  s += hatch3((sv, t) => [X + sv, t, Z], 0, bw, 0, h, 0.8, { op: 0.35, keep: (sv) => sv > bw * 0.55 }) + hatch3((sv, t) => [X - bw / 2 + sv, t, Z], 0, bw * 1.2, 0, h, -0.7, { op: 0.3, keep: (sv) => sv > bw * 0.85 });
  if (o.burns !== false) for (let k = 0; k < (o.nburn || 2); k++) { const top = P(X + lean * h * 0.9, h * 0.92, Z); s += burn(top[0] + (R() - 0.5) * 6, top[1], Math.PI / 2 + (R() - 0.5) * 0.6, K(Z) * h * (0.35 + R() * 0.3), Math.max(1, K(Z) * 0.07), { core: VIO, depth: 4 }); }
  s += '</g>';
  // flight holes: dark ragged mouths with a raised paper lip
  for (let k = 0; k < (o.holes ?? 6); k++) { const t = 0.15 + R() * 0.7, Y = h * t, w = bw / 2 * Math.pow(1 - t, 0.75), cx = X + lean * Y + (R() - 0.5) * w * 1.2, c = P(cx, Y, Z), r = Math.max(1.2, K(Z) * (0.12 + R() * 0.1)); s += fillS(blob(c[0], c[1], r, r * 0.8, 8, 0.4), '#0a080a') + `<path d="M${f1(c[0] - r * 1.2)} ${f1(c[1] + r * 0.6)} Q${f1(c[0])} ${f1(c[1] + r * 1.4)} ${f1(c[0] + r * 1.2)} ${f1(c[1] + r * 0.6)}" stroke="${mix(col, '#f0ece0', 0.4)}" stroke-width="${f1(Math.max(0.5, r * 0.25))}" fill="none"/>`; }
  s += `<path d="${p2(poly)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.8, inkW(Z) * 1.1))}"/>`;
  // the iron crown: a rod of scavenged iron, scorched, fused at the top
  const top = P(X + lean * h, h, Z), rk = K(Z), kind = o.crown || 'rod';
  if (kind !== 'none') {
    const rh = o.rodH || 2.4; const tip = [top[0] + rk * 0.05, top[1] - rk * rh];
    s += line([top, tip], Math.max(1.6, rk * 0.09), INK) + line([top, tip], Math.max(0.8, rk * 0.05), IRON);
    if (kind === 'cross') s += pline([[tip[0] - rk * 0.45, tip[1] + rk * 0.55], [tip[0] + rk * 0.45, tip[1] + rk * 0.5]], Math.max(1.6, rk * 0.1), INK) + pline([[tip[0] - rk * 0.45, tip[1] + rk * 0.55], [tip[0] + rk * 0.45, tip[1] + rk * 0.5]], Math.max(0.8, rk * 0.06), IRON);
    if (kind === 'vane') { s += fillP([[tip[0], tip[1] + rk * 0.3], [tip[0] + rk * 0.9, tip[1] + rk * 0.15], [tip[0] + rk * 0.8, tip[1] + rk * 0.5], [tip[0], tip[1] + rk * 0.55]], IRON) + inkP([[tip[0], tip[1] + rk * 0.3], [tip[0] + rk * 0.9, tip[1] + rk * 0.15], [tip[0] + rk * 0.8, tip[1] + rk * 0.5], [tip[0], tip[1] + rk * 0.55]], 1); s += pline([[tip[0] - rk * 0.5, tip[1] + rk * 0.9], [tip[0] + rk * 0.5, tip[1] + rk * 0.9]], 1.2, INK); }
    if (kind === 'axle') { for (const dy of [0.2, 0.6]) s += `<ellipse cx="${f1(tip[0])}" cy="${f1(tip[1] + rk * dy)}" rx="${f1(rk * 0.35)}" ry="${f1(rk * 0.1)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(1, rk * 0.06))}"/>`; }
    s += fused(tip[0], tip[1] + rk * 0.15, Math.max(2, rk * 0.16), '#4a4440', Z) + fused(top[0], top[1] - rk * 0.1, Math.max(2.5, rk * 0.22), '#4a4440', Z);
  }
  return { svg: s, L, Rr, top };
}
// a traveller wrapped in grey paper, hung on a spire flank: a swaddled body, swollen venom green through the paper
function cocoon(x, y, len, Z, o = {}) {
  // a body bound in grey paper hung head-down-ish by its feet: narrow at the hanging end (feet), broad at the shoulders,
  // a rounded head end below; the paper laid on in overlapping strips; venom green soaking through in streaks
  const w = len * 0.2, prof = [0.35, 0.5, 0.62, 0.7, 0.78, 0.92, 1.0, 0.95, 0.7, 0.75, 0.6, 0.0], Lp = [], Rp = [];
  prof.forEach((m, i) => { const t = i / (prof.length - 1), yy = y + len * t, sway = Math.sin(t * 2.4) * w * 0.25; Lp.push([x + sway - w * m * (1 + (R() - 0.5) * 0.08), yy]); Rp.push([x + sway + w * m * (1 + (R() - 0.5) * 0.08), yy]); });
  const pts = [...Lp, ...Rp.reverse()];
  let s = pline([[x, y - len * 0.18], [x + 1, y + 1]], Math.max(0.8, len * 0.03), INK) + cel(pts, { Z, fill: o.col || mix(PAPER, '#c8c2b2', 0.15), band: w * 0.45 }) + `<path d="${smooth(pts, true, 0.4)}" fill="url(#mottle)" opacity="0.4"/>`;
  for (let k = 1; k < 8; k++) { const yy = y + len * k / 8.5, ww = w * 1.05; s += `<path d="M${f1(x - ww)} ${f1(yy + len * 0.03)} Q${f1(x)} ${f1(yy - len * 0.05)} ${f1(x + ww)} ${f1(yy + len * 0.02)}" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.55"/>`; }
  for (let k = 0; k < 3; k++) { const xx = x + (R() - 0.5) * w * 1.1, y0 = y + len * (0.3 + R() * 0.3); s += line([[xx, y0], [xx + (R() - 0.5) * 2, y0 + len * (0.15 + R() * 0.2)]], Math.max(1, w * 0.22), VEND, 0.55) + line([[xx, y0], [xx, y0 + len * 0.12]], Math.max(0.6, w * 0.1), VEN, 0.6); }
  s += fillS(blob(x, y + len * 0.995, w * 0.18, w * 0.12, 6, 0.4), VEN, 0.8);
  if (o.limb) s += line([[x - w * 0.6, y + len * 0.5], [x - w * 1.0, y + len * 0.68], [x - w * 0.9, y + len * 0.82]], Math.max(1.2, w * 0.28), INK) + line([[x - w * 0.6, y + len * 0.5], [x - w * 1.0, y + len * 0.68], [x - w * 0.9, y + len * 0.82]], Math.max(0.7, w * 0.17), '#8a9070');
  return s;
}
// a wasp in flight (small): black chitin body, venom-green bands, two blurred-edge wings (line work)
function wasp(x, y, r, a = 0) { const c = Math.cos(a), s2 = Math.sin(a), T = (u, v) => [x + u * c - v * s2, y + u * s2 + v * c];
  return `<path d="${p2([T(-r, 0), T(-r * 0.3, -r * 0.3), T(r * 0.4, -r * 0.2), T(r, 0), T(r * 0.4, r * 0.25), T(-r * 0.3, r * 0.3)])}" fill="${CHIT}"/>` + pline([T(-r * 0.6, -r * 0.2), T(-r * 0.6, r * 0.2)], Math.max(0.5, r * 0.15), VEN) + `<ellipse cx="${f1(T(r * 0.1, -r * 0.6)[0])}" cy="${f1(T(r * 0.1, -r * 0.6)[1])}" rx="${f1(r * 0.6)}" ry="${f1(r * 0.25)}" transform="rotate(${f1(a * 57 - 20)} ${f1(T(r * 0.1, -r * 0.6)[0])} ${f1(T(r * 0.1, -r * 0.6)[1])})" fill="#d8d4e0" fill-opacity="0.35" stroke="${INK}" stroke-width="0.4"/>`; }

// ======================================================================== FAR
layer('far');
raw(skyBands(['#2a2834', '#33313e', '#3d3a48', '#46424e', '#4a4650'], [60, 120, 180, 240], { wav: 6 }));
// the sky hatch: heavy at the top (the storm's weight), thinning down
raw(`<rect width="${W}" height="120" fill="${S.hatchA(30)}" opacity="0.35"/><rect width="${W}" height="60" fill="${S.hatchB(30)}" opacity="0.3"/>`);
// the cloud masses: big and low over the plain, darker and heavier at the top
for (const [cx, cy, w, h, col] of [[300, 40, 760, 150, '#2e2b38'], [1100, 30, 820, 140, '#2a2834'], [620, 95, 560, 110, '#383542'], [1360, 110, 480, 110, '#3a3644'], [120, 130, 420, 90, '#3e3a48'], [880, 160, 520, 70, '#46424e'], [300, 190, 380, 50, '#4c4854'], [1250, 200, 420, 55, '#4c4854']]) raw(cloud(cx, cy, w, h, col, { lobes: 1 + Math.floor(R() * 3), ph: R() * 3 }));
// rain curtains hanging from the far clouds (fine slant lines, pale, no light): the storm's weather, not its strike
{ let d = ''; for (let k = 0; k < 120; k++) { const x = 900 + R() * 520, y = 190 + R() * 20, l = 40 + R() * 50; d += `M${f1(x)} ${f1(y)} l${f1(l * 0.15)} ${f1(l)} `; } raw(`<path d="${d}" stroke="#8a8698" stroke-width="0.6" opacity="0.35"/>`); }
// ---- the plain to the horizon: low dusty ground, darker toward us under the storm, faint road verges
raw(`<path d="M0 ${300 - 2} L${W} ${300 - 2} L${W} ${H} L0 ${H} Z" fill="${mix(EARTH, MURK, 0.5)}"/>`);
for (const [Z0, Z1, c] of [[60, 400, mix(DUST, '#3a3846', 0.55)], [30, 60, mix(DUST, MURK, 0.5)], [16, 30, mix(EARTH, MURK, 0.5)]]) raw(`<path d="${pp([[-200, 0, Z1], [200, 0, Z1], [200, 0, Z0], [-200, 0, Z0]])}" fill="${c}"/>`);
// ---- the far spires: a forest of towers to the horizon, smaller and greyer with distance, each crowned with iron
for (const [X, Z, bw, h, crown] of [[-120, 160, 9, 46, 'rod'], [-60, 140, 7, 34, 'cross'], [-20, 180, 10, 60, 'vane'], [30, 150, 8, 40, 'rod'], [70, 170, 9, 50, 'axle'], [120, 150, 7, 38, 'rod'], [160, 190, 11, 64, 'cross'], [-160, 200, 10, 52, 'rod'], [200, 160, 8, 36, 'vane']]) raw(spire(X, Z, bw, h, { crown, holes: 2, nburn: 1, col: skyFog(PAPERD, Z) }).svg);
for (const [X, Z, bw, h, crown] of [[-44, 70, 6, 30, 'cross'], [-14, 80, 5, 22, 'rod'], [18, 62, 6, 34, 'vane'], [44, 90, 7, 28, 'axle'], [-70, 85, 6, 26, 'rod']]) raw(spire(X, Z, bw, h, { crown, holes: 3, col: skyFog(PAPERD, Z) }).svg);
// ---- two mid-distance spires, one each side of the road ahead, their bases in the murk, their crowns in the cloud
{
  const a = spire(-17, 34, 6.5, 26, { crown: 'cross', holes: 8, nburn: 3, rodH: 3, col: mix(PAPER, '#3a3846', 0.4) }); raw(a.svg);
  for (const [t, len, limb] of [[0.35, 2.2, true], [0.5, 1.9, false], [0.62, 1.8, true]]) { const i = Math.round(t * 30), p = a.Rr[i]; raw(cocoon(p[0] + 2, p[1], K(34) * len, 34, { limb })); }
  for (const [t, len] of [[0.42, 2.0], [0.56, 1.7]]) { const i = Math.round(t * 30), p = a.L[i]; raw(cocoon(p[0] - 2, p[1], K(34) * len, 34)); }
  const b = spire(21, 40, 7.5, 30, { crown: 'vane', holes: 8, nburn: 3, rodH: 3, col: mix(PAPER, '#3a3846', 0.45) }); raw(b.svg);
  for (const [t, len] of [[0.3, 2.2], [0.45, 1.8], [0.66, 1.6]]) { const i = Math.round(t * 30), p = b.L[i]; raw(cocoon(p[0] - 2, p[1], K(40) * len, 40, { limb: t < 0.4 })); }
}
// ---- the road: old paving running across the plain from the left to the right horizon-ward; ruts worn in it
{
  const z0 = 4.2, z1 = 10.5;
  // verge: dry trampled grass, dust
  raw(`<path d="${pp([[-60, 0, z1], [60, 0, z1], [60, 0, 16], [-60, 0, 16]])}" fill="${mix(EARTH, MURK, 0.45)}"/>` + `<path d="${pp([[-60, 0, z1], [60, 0, z1], [60, 0, 16], [-60, 0, 16]])}" fill="url(#mottle)" opacity="0.5"/>`);
  raw(S.strew((s, t) => [-30 + s, 0, z1 + t], 0, 60, 0, 6, 900, { cols: ['#6a6040', '#5a5034', '#7a7050', '#4a4430'], len: 0.4, ang: -1.5, spread: 0.8 }));
  raw(B.flags(-40, 40, z0, z1, mix(DUST, MURK, 0.35), { depth: 0.75, width: 0.9, vary: 0.16, missing: 0.06, cracks: 0.2, fogK: 0.5 }));
  // cart ruts: two worn grooves along the road, darker, with standing dust in them
  for (const zr of [6.9, 8.1]) { const pts = []; for (let k = 0; k <= 40; k++) pts.push(P(-30 + k * 1.5, 0.01, zr + Math.sin(k * 0.4) * 0.08)); raw(line(pts, K(zr) * 0.09, mix(EARTH, MURK, 0.6), 0.7) + line(pts.map(([x, y]) => [x, y - 1.5]), 0.8, '#a89e86', 0.3)); }
  // the strike scar: lightning came down on the road here; a fern burned across the paving, the slabs at its heart fused
  { const c = P(1.2, 0, 8.6), sc = S.id('sc'); raw(`<clipPath id="${sc}"><path d="${pp([[-30, 0, z0], [30, 0, z0], [30, 0, z1], [-30, 0, z1]])}"/></clipPath><g clip-path="url(#${sc})">`);
    for (let k = 0; k < 7; k++) raw(burn(c[0], c[1], k / 7 * Math.PI * 2 + R() * 0.4, 70 + R() * 90, 3.4, { core: VIO, depth: 4, haloOp: 0.25 }));
    raw(fillS(blob(c[0], c[1], 34, 7, 12, 0.5), '#0c0a10', 0.85) + fillS(blob(c[0] - 6, c[1] - 1, 18, 3.5, 10, 0.5), '#3a3640', 0.9) + line([[c[0] - 20, c[1] - 2], [c[0] - 4, c[1] - 3.5], [c[0] + 10, c[1] - 2]], 1, '#a8a4b8', 0.6) + '</g>'); }
  raw(hatch3((s, t) => [-40 + s, 0, 4 + t], 0, 80, 0, 1.3, 0.25, { op: 0.35, ragged: 0.3 }));
}
raw(quiet([[232, 0.17], [262, 0.16], [296, 0.14], [345, 0.1]], { hop: 0.18 }));
// wasps over the plain (small dark specks with wing flicks), more near the spires
{ for (let k = 0; k < 70; k++) { const near = R() < 0.5, x = near ? (R() < 0.5 ? 380 + R() * 200 : 1060 + R() * 220) : R() * W, y = 30 + R() * 200; raw(wasp(x, y, 1.2 + R() * 2, (R() - 0.5) * 1)); } }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// the toppled milestone, its numbers half legible, its iron waymark torn away (taken for a crown)
{ const Z = 10.6, X = -7.4, c = P(X, 0.2, Z), k = K(Z);
  const q = [[c[0] - k * 0.75, c[1] + k * 0.18], [c[0] + k * 0.6, c[1] + k * 0.2], [c[0] + k * 0.7, c[1] - k * 0.18], [c[0] - k * 0.6, c[1] - k * 0.26]];
  raw(cel(chip(q, 0.4), { Z, fill: mix(fog('#7a7666', Z), MURK, 0.4), tex: 'url(#mottle)', texOp: 0.5 }));
  raw(`<path d="M${f1(c[0] - k * 0.3)} ${f1(c[1] - k * 0.05)} l${f1(k * 0.08)} ${f1(-k * 0.08)} l0 ${f1(k * 0.16)} M${f1(c[0] - k * 0.1)} ${f1(c[1] - k * 0.1)} l${f1(k * 0.1)} 0 l${f1(-k * 0.1)} ${f1(k * 0.14)} l${f1(k * 0.1)} 0" stroke="${INK}" stroke-width="0.9" fill="none" opacity="0.7"/>`);
  raw(fillS(blob(c[0] + k * 0.45, c[1] - k * 0.05, k * 0.08, k * 0.05, 7, 0.4), '#2a1a12', 0.7)); }
// the overturned cart, its load of bundles wrapped in comb, one wheel up and cracked (low, dark)
{ const Z = 11.4, X = 7.0;
  raw(box(X - 1.2, X + 1.2, 0.3, 0.9, Z - 0.5, Z + 0.5, { col: mix(fog('#4a3e2e', Z), MURK, 0.45), shadeOp: 0.5 }));
  const c = P(X + 0.9, 1.15, Z - 0.6), r = K(Z) * 0.45; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.35)}" ry="${f1(r)}" fill="none" stroke="${INK}" stroke-width="${f1(r * 0.2)}"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.35)}" ry="${f1(r)}" fill="none" stroke="${mix('#5a4a34', MURK, 0.4)}" stroke-width="${f1(r * 0.11)}"/>`);
  for (let k = 0; k < 6; k++) { const p = P(X - 2 + R() * 1.4, 0.12, Z - 0.8 + R() * 0.6); raw(cel(blob(p[0], p[1] - 3, 8 + R() * 6, 4 + R() * 2, 10, 0.3, (R() - 0.5) * 0.4), { Z, fill: mix(PAPER, MURK, 0.45), band: 1.5 })); if (R() < 0.5) raw(fillS(blob(p[0], p[1] - 3, 4, 2, 7, 0.4), VEND, 0.6)); }
  raw(burn(...P(X - 0.6, 0.85, Z - 0.52), 0.3, 40, 1.6, { core: mix(VIO, MURK, 0.3), depth: 2, op: 0.7 })); }
// a dropped pilgrim's staff and gourd by the road
{ const Z = 9.2, a = P(-1.8, 0.03, Z), b = P(-0.4, 0.04, Z - 0.3); raw(line([a, b], 2.6, INK) + line([a, b], 1.3, mix('#6a5638', MURK, 0.4)) + `<ellipse cx="${f1(b[0] + 6)}" cy="${f1(b[1] - 3)}" rx="5" ry="3.6" fill="${mix('#8a7a4e', MURK, 0.45)}" stroke="${INK}" stroke-width="0.8"/>`); }

// ======================================================================== FORE: framing at the edges
layer('fore');
{
  // left: the root of a near spire, its paper bands and a flight hole, a wasp coming out; a cocoon low on it
  const pts = [[-10, H + 5], [-10, -5], [58, -5], [66, 60], [62, 140], [70, 220], [66, 300], [78, 380], [96, H + 5]];
  raw(cel(pts, { Z: 3.6, fill: mix(PAPERD, '#0c0b0e', 0.45), band: 10 }) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.5"/>`);
  const cid = S.id('fl'); raw(`<clipPath id="${cid}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${cid})">`);
  for (let y = 0; y < H; y += 14 + R() * 10) { const pp2 = []; for (let k = 0; k <= 8; k++) pp2.push([-10 + k * 26, y + Math.sin(k * 1.1 + y) * 6]); raw(line(pp2, 1.6, INK, 0.7) + line(pp2.map(([x, yy]) => [x, yy + 2]), 0.8, '#a8a494', 0.4)); }
  raw(`<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.45"/>` + burn(60, -5, 1.75, 300, 5, { core: VIO, depth: 4 }) + '</g>');
  raw(fillS(blob(40, 170, 12, 8, 9, 0.45), '#060508') + `<path d="M24 168 Q40 156 56 166" stroke="#9a968a" stroke-width="2" fill="none"/>` + wasp(72, 150, 7, -0.4) + wasp(96, 110, 5, 0.3));
  raw(cocoon(30, 300, 90, 3.6, { limb: true }));
}
{
  // right: the bent iron waypost, its finger board scorched and split; a paper cocoon hanging from it; thistles
  const Z = 4.2, X = 4.75, a = P(X, 0, Z), top = P(X - 0.35, 2.6, Z);
  raw(line([a, [a[0] - 4, a[1] - 140], top], 9, INK) + line([a, [a[0] - 4, a[1] - 140], top], 6, '#3a3634') + line([[a[0] - 2, a[1] - 30], [a[0] - 5, a[1] - 140]], 1.4, '#7a7670', 0.5));
  const fb = [[top[0] - 70, top[1] + 4], [top[0] + 4, top[1] - 4], [top[0] + 4, top[1] + 18], [top[0] - 66, top[1] + 26]];
  raw(cel(fb, { Z, fill: '#4a3e2e', band: 4 }) + burn(top[0] - 4, top[1] + 4, 3.0, 60, 2.4, { core: VIO, depth: 3 }) + pline([[top[0] - 40, top[1] + 4], [top[0] - 30, top[1] + 22]], 1.6, INK));
  raw(fused(top[0] + 2, top[1] - 4, 7, '#4a4440', Z) + cocoon(top[0] - 50, top[1] + 30, 90, Z, { limb: true }));
  for (let k = 0; k < 26; k++) { const x = W - 90 + R() * 100, y = H - R() * 8, h = 50 + R() * 90, bend = (R() - 0.3) * 30, pts = [[x, y], [x + bend * 0.3, y - h * 0.5], [x + bend, y - h]]; raw(line(pts, 2, INK, 0.9) + line(pts, 1, '#6a6440')); if (R() < 0.6) { const t = pts[2]; raw(fillS(blob(t[0] + bend * 0.04, t[1] + 6, 2.2, 8, 8, 0.3), '#7a7050') + inkS(blob(t[0] + bend * 0.04, t[1] + 6, 2.2, 8, 8, 0.3), 0.6)); } }
}
// dust and grit low along the front edge
raw(fillP([[-5, H + 5], [-5, H - 16], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 14 - Math.sin(k * 1.3) * 6 - R() * 5]), [W + 5, H - 16], [W + 5, H + 5]], mix(EARTH, '#0a0a0a', 0.55), 0.95));

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `hive_road_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, 'hive_road.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log('hive_road layers written');
