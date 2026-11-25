// World XV, the Torn Sky: THE THRONE STEPS (battle room, Living Ink). A floating slab of heaven's pavement before the
// steps where the Mother of Courses' seat stood, under the sky the void tore open. Same contract as the nave (exterior).
// Lore (bible/world_XV_torn_sky.md): a heaven; Void's betrayal of the Mother of Courses tore it open. THERE WAS NO WAR:
// nothing here is a battlefield (no weapons, no fallen gods, no siege). The ruins float in the storm and something looks
// in through the tears. The only world whose cast was never human. Lightning scars everything with violet branching
// burns; void cracks bodies open onto darkness. Gold leaf is allowed here, cracked over black. Eyes are expected.
// Lightning is NEVER drawn in the air: only violet Lichtenberg burns scarred into gold and stone, fused metal.
// Gold: leaf laid as plates over black, each plate modelled (lighter on its lit, upper-left side, never darker toward
// the light), the black showing in every crack between plates.
// What is placed:
//   - the storm: heavy violet-grey cloud, stepped; no bolts
//   - THE TEARS: irregular, clean-rimmed absences torn across the sky, the cloud thinning into nothing at their rims,
//     black beyond, eyes looking in through them
//   - floating ruins of heaven: column drums, an arch, a stair fragment, all gold leaf cracked over black, scorched by
//     violet burns, drifting at their own depths
//   - THE THRONE STEPS at the back: broad black steps with gilded risers, the throne lions' plinths EMPTY on either side,
//     on the top step the gilded footing where the seat was fixed, its bolts sheared (the seat is gone: the Wheel of
//     Thrones carried it, and is still turning, looking for the weight); the canopy's gilded posts, its black cloth torn
//   - the pavement: black stone with gold-leaf inlay bands, cracked, a violet burn branching across it, its far edge
//     broken off into the sky with pieces drifting away below
//   - fore: a gilded column drum on its broken base, burned and fused; a torn strip of the canopy and a scorched dove's
//     feather hanging
// Usage: node scenes/bg_sky_throne.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XV');
const W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 15101, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e1828' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#120f18' });
const { fog, line, pline, fillP, fillS, inkP, inkS, blob, jag, lump, box, burn, fused, tornVoid, eye, quiet, skyBands } = B;

const GOLD = '#c09a46', GOLDL = '#ecd488', GOLDD = '#7a5c24', BLACK = '#121016', VIO = '#b49ae8', STONEK = '#24202a', MURK = B.MURK;
const burnV = (x, y, a, l, w, o = {}) => burn(x, y, a, l, w, Object.assign({ core: VIO, scorch: '#0c0810', coreOp: 0.7, branchP: 0.55, spread: 0.6 }, o));
// gold leaf over black on a quad (screen points a,b,c,d): plates laid in rows, each modelled lighter toward the upper left,
// black in the cracks between them, a few plates lost to bare black
function gilt(q, Z, o = {}) {
  // one skin of leaf over the black: modelled in stepped tones (lighter toward the upper-left light), crazed by a net of
  // black cracks, flakes lost to bare black here and there; never a grid of bricks
  const [a, b, c, d] = q, dim = o.dim || 0;
  const L = (u, v) => { const top = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], bot = [d[0] + (c[0] - d[0]) * u, d[1] + (c[1] - d[1]) * u]; return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v]; };
  const g = (col) => mix(col, MURK, dim);
  let s = cel(q, { Z, fill: g(GOLD), band: Math.max(1, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.06), shadow: g(GOLDD), inkW: Math.max(0.7, inkW(Z) * 0.9) });
  // stepped modelling: a lit field toward the upper left, a brighter one inside it
  s += fillP([L(0, 0), L(0.62, 0), L(0.35, 0.55), L(0, 0.8)], g(mix(GOLD, GOLDL, 0.55)), 0.9) + fillP([L(0.02, 0.03), L(0.3, 0.03), L(0.12, 0.35), L(0.02, 0.4)], g(GOLDL), 0.85);
  s += fillP([L(1, 0.4), L(1, 1), L(0.45, 1), L(0.8, 0.6)], g(GOLDD), 0.55);
  // crazing: cracks wandering across the leaf, black, branching
  const n = o.cracks ?? Math.max(2, Math.round(Math.hypot(b[0] - a[0], d[1] - a[1]) / 14));
  for (let k = 0; k < n; k++) { let u = R(), v = R(), ang = R() * 6.28; const pts = [L(u, v)]; for (let i = 0; i < 5; i++) { ang += (R() - 0.5) * 1.2; u = Math.min(1, Math.max(0, u + Math.cos(ang) * 0.12)); v = Math.min(1, Math.max(0, v + Math.sin(ang) * 0.18)); pts.push(L(u, v)); } s += pline(pts, Math.max(0.6, inkW(Z) * 0.7), BLACK, 0.9); }
  // flakes lost to the black
  for (let k = 0; k < (o.lost ?? 2); k++) { const ctr = L(0.15 + R() * 0.7, 0.15 + R() * 0.7), r = Math.max(1.5, Math.hypot(b[0] - a[0], b[1] - a[1]) * (0.03 + R() * 0.05)); s += fillP(chip(blob(ctr[0], ctr[1], r, r * 0.7, 6, 0.5), 0.5), BLACK) + pline(blob(ctr[0], ctr[1], r, r * 0.7, 6, 0.5).slice(0, 3).map(([x, y]) => [x + 0.8, y + 0.8]), 0.6, g(GOLDL), 0.6); }
  return s;
}
// a storm cloud mass with a shadowed underside, inked (as World X's, violet-grey)
function cloud(cx, cy, w, h, col) {
  const pts = []; for (let k = 0; k <= 18; k++) { const t = k / 18, bump = Math.abs(Math.sin(t * Math.PI * (3 + Math.floor(R() * 3)) + R())) * h * 0.3; pts.push([cx - w / 2 + w * t, cy - (h * 0.5 + bump) * Math.sin(t * Math.PI)]); }
  const under = []; for (let k = 18; k >= 0; k--) { const t = k / 18; under.push([cx - w / 2 + w * t, cy + h * 0.1 * Math.sin(t * Math.PI * 2 + 1)]); }
  const poly = [...pts, ...under], cid = S.id('cl');
  const band = [...under, ...under.slice().reverse().map(([x, y]) => [x, y - h * 0.25])];
  return fillS(poly, col, 1, 0.45) + `<path d="${smooth(poly, true, 0.45)}" fill="url(#mottle)" opacity="0.35"/><clipPath id="${cid}"><path d="${smooth(poly, true, 0.45)}"/></clipPath><g clip-path="url(#${cid})">${fillS(band, mix(col, '#08060c', 0.45), 0.9, 0.4)}<path d="${smooth(band, true, 0.4)}" fill="${S.hatchA(30)}" opacity="0.5"/></g>` + line(pts.slice(2, 10).map(([x, y]) => [x + 2, y + 2.5]), 1.2, mix(col, '#efe8f8', 0.35), 0.5) + `<path d="${smooth(poly, true, 0.45)}" fill="none" stroke="${INK}" stroke-width="1.3"/>`;
}
// a column drum of heaven floating (or standing): a cylinder, gilt over black, fluted, its broken top, burns, fused edge
function drum(x, y, r, h, Z, o = {}) {
  const tilt = o.tilt || 0, q = [[x - r, y - h], [x + r, y - h + tilt], [x + r, y + tilt], [x - r, y]];
  let s = gilt(q, Z, { rows: Math.max(2, Math.round(h / r * 1.5)), cols: 6, dim: o.dim || 0 });
  s += `<path d="${p2([[x + r * 0.35, y - h], [x + r, y - h + tilt], [x + r, y + tilt], [x + r * 0.35, y]])}" fill="${S.hatchA(Z)}" opacity="0.5"/>`;
  for (let k = 1; k < 6; k++) { const xx = x - r + 2 * r * k / 6; s += pline([[xx, y - h + tilt * k / 6], [xx, y + tilt * k / 6]], 0.7, INK, 0.6); }
  // broken top: a jagged break, black inside
  const top = jag([x - r, y - h], [x + r, y - h + tilt], 7, r * 0.15); s += fillP([...top, [x + r, y - h + tilt + r * 0.12], [x - r, y - h + r * 0.12]], BLACK) + inkP(top, 1);
  const bot = [[x - r, y], [x + r, y + tilt], [x + r, y + tilt + r * 0.25], [x - r, y + r * 0.22]]; s += cel(bot, { Z, fill: STONEK, band: 2 });
  const cl = S.id('dc'); s += `<clipPath id="${cl}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${cl})">${burnV(x - r * 0.6, y - h * 0.9, 1.2, h * 0.9, Math.max(1, r * 0.08), { depth: 3 })}</g>`;
  if (o.fuse) s += fused(x + r * 0.9, y - h * 0.5, r * 0.25, mix(GOLDD, '#2a2030', 0.3), Z);
  return s;
}

// ======================================================================== FAR
layer('far');
raw(skyBands(['#1c1824', '#24202e', '#2c2736', '#342e3e', '#3a3444'], [70, 140, 200, 260], { wav: 6 }));
raw(`<rect width="${W}" height="140" fill="${S.hatchA(30)}" opacity="0.3"/>`);
for (const [cx, cy, w, h, col] of [[260, 70, 700, 140, '#2e2838'], [1180, 60, 760, 130, '#2a2434'], [720, 150, 600, 90, '#3a3446'], [120, 210, 400, 70, '#403a4c'], [1380, 220, 420, 70, '#403a4c']]) raw(cloud(cx, cy, w, h, col));
// ---- THE TEARS: absences torn across the sky; the cloud thins into nothing at their rims; eyes look in through them
for (const [x, y, w, h, eyes] of [[330, 70, 260, 120, [[-0.25, 0.05, 0.28], [0.35, 0.15, 0.16]]], [1120, 95, 330, 90, [[0.05, 0.0, 0.42]]], [760, 190, 120, 54, []]]) {
  const at = (s2, t2) => [(s2 - 740) / 652 * 300, 1.2 - (t2 - 300) / 652 * 300, 300];      // the sky plane far off, mapped back from screen
  const tv = tornVoid((s2, t2) => at(x + s2 * 1, y - t2 * 1), 0, 0, w, h, { depth: 0, mat: '#3a3446', tears: 3, tearLen: 0.55, teeth: 3, slivers: 9, flecks: 16, halo: false, n: 56, eyes, eyeO: { white: '#cfc6b8', iris: '#8a7aa8', open: 0.45 }, edge: '#6a5a8a', edgeOp: 0.5 });
  raw(tv.svg);
}
// ---- floating ruins of heaven, at their own depths, gilt over black, scorched
raw(drum(230, 210, 18, 60, 30, { tilt: 8, fuse: true }) + drum(1290, 180, 14, 40, 34, { tilt: -6 }) + drum(980, 232, 10, 28, 40, { tilt: 4 }));
{ // an arch fragment drifting: two voussoir runs and a keystone, gilt soffit
  const cx = 560, cy = 140, r = 70; let s = '';
  for (let k = 0; k < 7; k++) { const a0 = Math.PI + k / 9 * Math.PI, a1 = Math.PI + (k + 1) / 9 * Math.PI, q = [[cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r], [cx + Math.cos(a1) * r * 1.25, cy + Math.sin(a1) * r * 1.25], [cx + Math.cos(a0) * r * 1.25, cy + Math.sin(a0) * r * 1.25]]; s += cel(chip(q, 0.3), { Z: 28, fill: STONEK, band: 2 }); }
  for (let k = 0; k < 7; k++) { const a0 = Math.PI + k / 9 * Math.PI, a1 = Math.PI + (k + 1) / 9 * Math.PI; s += gilt([[cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r], [cx + Math.cos(a1) * r * 0.9, cy + Math.sin(a1) * r * 0.9 + 6], [cx + Math.cos(a0) * r * 0.9, cy + Math.sin(a0) * r * 0.9 + 6]], 28, { rows: 1, cols: 2 }); }
  const e = [cx + Math.cos(Math.PI * 16 / 9) * r * 1.1, cy + Math.sin(Math.PI * 16 / 9) * r * 1.1]; s += fillS(blob(e[0], e[1], 8, 12, 8, 0.5), BLACK);
  raw(s + burnV(cx - r * 1.1, cy - 4, -0.7, 70, 2, { depth: 3 }));
}
{ // a stair fragment floating on the right: three steps cut off clean on one side (the void), torn on the other
  const x0 = 1380, y0 = 120; let s = '';
  for (let k = 0; k < 3; k++) { const q = [[x0 - 40 + k * 18, y0 + k * 14], [x0 + 40, y0 + k * 14], [x0 + 40, y0 + k * 14 + 14], [x0 - 40 + k * 18, y0 + k * 14 + 14]]; s += cel(q, { Z: 32, fill: STONEK, band: 2 }) + gilt([q[0], q[1], [q[1][0], q[1][1] + 5], [q[0][0], q[0][1] + 5]], 32, { rows: 1, cols: 3 }); }
  raw(s);
}
// ---- the sky below the slab's far edge (we stand on a floating slab): cloud below the horizon, dark, quiet
for (const [y0, col] of [[300, '#2c2736'], [320, '#26222e'], [345, '#1e1a26']]) { const pts = [[-5, H + 5]]; for (let k = 0; k <= 30; k++) pts.push([k * W / 30, y0 + Math.sin(k * 0.9 + y0) * 5]); pts.push([W + 5, H + 5]); raw(fillP(pts, col) + line(pts.slice(1, -1), 0.8, INK, 0.4)); }
// ---- the pavement of heaven: black stone, gold-leaf inlay bands, cracked, its far edge broken off into the sky
{
  const zEdge = X => 15.6 + Math.sin(X * 0.7) * 0.5 + Math.sin(X * 2.3) * 0.25;
  const edge = []; for (let k = 0; k <= 60; k++) { const X = -30 + k; edge.push(P(X, 0, zEdge(X))); }
  const slab = [P(-30, 0, 3.8), P(30, 0, 3.8), ...edge.slice().reverse()];
  raw(fillP(slab, '#16131c'));
  const cs = S.id('pv'); raw(`<clipPath id="${cs}"><path d="${p2(slab)}"/></clipPath><g clip-path="url(#${cs})">`);
  raw(B.flags(-30, 30, 3.8, 16.4, mix(STONEK, MURK, 0.2), { depth: 1.3, width: 1.6, vary: 0.12, cracks: 0.2, fogK: 0.4, joint: 0.6 }));
  // gold-leaf inlay bands across the pavement (dim: the fighters' band), cracked over black
  for (const Z0 of [7.4, 11.2]) { for (let X = -20; X < 20; X += 0.9 + R() * 0.3) { if (R() < 0.1) continue; const q = [P(X, 0.01, Z0 + 0.25), P(X + 0.85, 0.01, Z0 + 0.25), P(X + 0.85, 0.01, Z0), P(X, 0.01, Z0)]; raw(cel(chip(q, 0.3), { Z: Z0, fill: mix(mix(GOLD, GOLDD, 0.3 + R() * 0.3), MURK, 0.45), band: 1, inkW: 0.5, hi: false })); } }
  // the violet burn branching across the paving from a strike point (scar only)
  { const c = P(-1.2, 0, 9.6); for (let k = 0; k < 6; k++) raw(burnV(c[0], c[1], k / 6 * 6.28 + R() * 0.4, 60 + R() * 80, 3, { depth: 4, haloOp: 0.3 })); raw(fused(c[0], c[1], 9, mix(GOLDD, '#1a1420', 0.4), 9.6)); }
  raw(S.occBand((s, t) => [-40 + s, 0, 3.8 + t], 80, 1.3, { op: 0.4, ang: 0.25 }));
  raw('</g>');
  // the broken far edge: the slab's thickness showing as torn stone below the edge, pieces drifting away below it
  const under = edge.map(([x, y], i) => [x, y + 6 + Math.abs(Math.sin(i * 1.7)) * 10 + R() * 5]);
  raw(cel([...edge, ...under.slice().reverse()], { Z: 15, fill: '#1c1824', band: 2 }) + `<path d="${p2([...edge, ...under.slice().reverse()])}" fill="${S.hatchA(15)}" opacity="0.5"/>` + line(edge, 1.4, INK));
  for (let k = 0; k < 14; k++) { const x = R() * W, y = 330 + R() * 40, r = 2 + R() * 6; raw(cel(chip(blob(x, y, r * 1.4, r, 7, 0.3), 0.4), { Z: 20, fill: '#1c1824', band: 1.2 })); if (R() < 0.4) raw(fillP([[x - r * 0.8, y - r * 0.6], [x + r * 0.5, y - r * 0.7], [x + r * 0.4, y - r * 0.3], [x - r * 0.7, y - r * 0.3]], mix(GOLD, MURK, 0.5))); }
}
// ---- THE THRONE STEPS: broad black steps with gilded risers, the lions' plinths empty, the seat's footing with its bolts
// sheared (the seat is gone), the canopy posts and the torn canopy over nothing
{
  const Zs = 13.2, X = 0.0, nS = 5, rise = 0.32, tread = 0.4, w0 = 3.6;
  for (let k = 0; k < nS; k++) { const w = w0 - k * 0.35, z0 = Zs + k * tread, y0 = k * rise, y1 = (k + 1) * rise;
    const riser = [P(X - w, y1, z0), P(X + w, y1, z0), P(X + w, y0, z0), P(X - w, y0, z0)];
    raw(gilt(riser, z0, { dim: y1 < 1.7 ? 0.62 : 0.35, lost: 4, cracks: 6 }));
    const trd = [P(X - w, y1, z0), P(X + w, y1, z0), P(X + w - 0.35, y1, z0 + tread), P(X - w + 0.35, y1, z0 + tread)];
    raw(cel(trd, { Z: z0, fill: mix(STONEK, '#4a4456', 0.3), band: 1.2, hi: true })); }
  const topY = nS * rise, ztop = Zs + nS * tread;
  // the empty lion plinths either side of the steps (their lions walked away; one paw's gilded outline left on each)
  for (const sx of [-1, 1]) { const px = X + sx * (w0 + 0.6); raw(box(px - 0.55, px + 0.55, 0, 1.1, Zs - 0.2, Zs + 0.9, { col: STONEK, shadeOp: 0.5 }));
    const tp = P(px, 1.11, Zs + 0.3); raw(`<ellipse cx="${f1(tp[0] - sx * 8)}" cy="${f1(tp[1])}" rx="6" ry="1.6" fill="none" stroke="${mix(GOLD, MURK, 0.35)}" stroke-width="1"/>` + fused(tp[0] + sx * 6, tp[1] - 1, 3, mix(GOLDD, MURK, 0.3), Zs));
    raw(gilt([P(px - 0.55, 1.1, Zs - 0.2), P(px + 0.55, 1.1, Zs - 0.2), P(px + 0.55, 0.95, Zs - 0.2), P(px - 0.55, 0.95, Zs - 0.2)], Zs, { rows: 1, cols: 4, dim: 0.4 })); }
  // the seat's footing: a gilded plinth on the top step, the seat torn away, sheared bolts standing, burn scars
  const fq = [P(X - 1.1, topY + 0.5, ztop), P(X + 1.1, topY + 0.5, ztop), P(X + 1.1, topY, ztop), P(X - 1.1, topY, ztop)];
  raw(gilt(fq, ztop, { rows: 2, cols: 6 }));
  raw(cel([P(X - 1.1, topY + 0.5, ztop), P(X + 1.1, topY + 0.5, ztop), P(X + 0.95, topY + 0.5, ztop + 0.8), P(X - 0.95, topY + 0.5, ztop + 0.8)], { Z: ztop, fill: '#2a2432', band: 1.5 }));
  for (const [bx, bz] of [[-0.7, 0.2], [0.7, 0.2], [-0.6, 0.65], [0.6, 0.65]]) { const b0 = P(X + bx, topY + 0.5, ztop + bz), b1 = [b0[0], b0[1] - 7]; raw(pline([b0, b1], 3.4, INK) + pline([b0, b1], 2, '#6a6070') + fillP([[b1[0] - 2.5, b1[1]], [b1[0] + 2.5, b1[1] - 1.5], [b1[0] + 2, b1[1] + 1], [b1[0] - 2, b1[1] + 1.5]], '#b8b0c0')); }
  { const cl = S.id('ft'); raw(`<clipPath id="${cl}"><path d="${p2(fq)}"/></clipPath><g clip-path="url(#${cl})">${burnV(fq[0][0] + 10, fq[0][1] + 4, 0.2, 90, 2.4, { depth: 4 })}</g>`); }
  // canopy posts: tall gilded shafts, the canopy's black cloth torn to strips hanging over the empty footing
  for (const sx of [-1, 1]) { const xb = X + sx * 1.7, a = P(xb, topY + 0.5, ztop + 0.6), b2 = P(xb, 5.6, ztop + 0.6), w = K(ztop) * 0.12;
    raw(gilt([[a[0] - w, b2[1]], [a[0] + w, b2[1]], [a[0] + w, a[1]], [a[0] - w, a[1]]], ztop, { rows: 10, cols: 2 }) + `<path d="${p2([[a[0], b2[1]], [a[0] + w, b2[1]], [a[0] + w, a[1]], [a[0], a[1]]])}" fill="${S.hatchA(ztop)}" opacity="0.45"/>`);
    raw(fused(a[0], b2[1] + 10, w * 1.4, mix(GOLDD, '#2a2030', 0.3), ztop) + `<circle cx="${f1(a[0])}" cy="${f1(b2[1] - w * 0.8)}" r="${f1(w * 1.1)}" fill="${GOLD}" stroke="${INK}" stroke-width="1"/><circle cx="${f1(a[0] - w * 0.35)}" cy="${f1(b2[1] - w * 1.1)}" r="${f1(w * 0.35)}" fill="${GOLDL}"/>`); }
  const cL = P(X - 1.7, 5.4, ztop + 0.6), cR = P(X + 1.7, 5.4, ztop + 0.6);
  raw(cel([[cL[0], cL[1] - 8], [cR[0], cR[1] - 8], [cR[0], cR[1] + 6], [cL[0], cL[1] + 6]], { Z: ztop, fill: BLACK, band: 2 }) + gilt([[cL[0], cL[1] + 2], [cR[0], cR[1] + 2], [cR[0], cR[1] + 6], [cL[0], cL[1] + 6]], ztop, { rows: 1, cols: 12 }));
  for (let k = 0; k < 9; k++) { const t = (k + 0.5) / 9, x = cL[0] + (cR[0] - cL[0]) * t, l = 20 + R() * 70, wd = (cR[0] - cL[0]) / 9 * 0.9, pts = [[x - wd / 2, cL[1] + 6], [x + wd / 2, cL[1] + 6], [x + wd * 0.3 + (R() - 0.5) * 6, cL[1] + 6 + l], [x - wd * 0.1, cL[1] + 6 + l * 0.8], [x - wd * 0.4, cL[1] + 6 + l * 0.95]]; if (R() < 0.25) continue; raw(cel(pts, { Z: ztop, fill: '#1a1622', band: 1.5 }) + pline([[x, cL[1] + 10], [x + 1, cL[1] + l * 0.7]], 0.6, mix(GOLD, MURK, 0.3), 0.7)); }
}
raw(quiet([[236, 0.14], [270, 0.14], [304, 0.12], [345, 0.12]], { hop: 0.16 }));
// motes of gold leaf flaking off and drifting up, and violet sparks? no: only leaf flakes (no spark, no arc)
{ let m = ''; for (let k = 0; k < 70; k++) { const x = R() * W, y = R() * 300, r = 0.8 + R() * 1.6, a = R() * 3; m += `<path d="M${f1(x - r)} ${f1(y)} L${f1(x + r * Math.cos(a))} ${f1(y - r * 0.7)} L${f1(x + r)} ${f1(y + r * 0.4)} Z" fill="${R() < 0.5 ? GOLD : GOLDL}" stroke="${INK}" stroke-width="0.35" opacity="${f1(0.5 + R() * 0.4)}"/>`; } raw(m); }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// a fallen gilded lamp of the star-lighters, cold, on the pavement; scattered leaf flakes; a cracked slab lifted (low, dark)
{ const Z = 9.2, c = P(-7.2, 0.15, Z), k = K(Z); raw(cel([[c[0] - k * 0.25, c[1] + k * 0.12], [c[0] + k * 0.3, c[1] + k * 0.1], [c[0] + k * 0.2, c[1] - k * 0.18], [c[0] - k * 0.15, c[1] - k * 0.2]], { Z, fill: mix(GOLDD, MURK, 0.45), band: 2 }) + pline([[c[0] + k * 0.3, c[1] - k * 0.02], [c[0] + k * 0.75, c[1] + k * 0.05]], 1.6, INK) + fillS(blob(c[0], c[1] - k * 0.05, k * 0.08, k * 0.05, 7, 0.3), '#2a2432')); }
{ const Z = 10.6, X = 6.4, q = [P(X - 0.9, 0.0, Z), P(X + 0.8, 0.0, Z + 0.2), P(X + 0.8, 0.35, Z - 0.3), P(X - 0.9, 0.22, Z - 0.4)]; raw(cel(q, { Z, fill: mix(STONEK, MURK, 0.2), band: 2 }) + fillP([q[0], q[3], P(X - 0.9, 0, Z - 0.5)], '#08060c')); }

// ======================================================================== FORE: framing at the edges
layer('fore');
raw(drum(18, H + 10, 58, 330, 4.2, { tilt: 14, fuse: true }));
{ // right: a torn strip of the canopy hanging into the frame, gilt hem, a scorched dove's feather caught on it
  const pts = [[W - 120, -5], [W + 10, -5], [W + 10, 250], [W - 20, 300], [W - 50, 240], [W - 80, 330], [W - 100, 200], [W - 118, 150]];
  raw(cel(pts, { Z: 4, fill: '#16121c', band: 8 }) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.35"/>` + `<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.35"/>`);
  for (let k = 0; k < 4; k++) raw(pline([[W - 110 + k * 30, 10], [W - 100 + k * 28, 220 + R() * 60]], 1, INK, 0.6));
  raw(gilt([[W - 120, 40], [W + 10, 40], [W + 10, 56], [W - 120, 56]], 4, { rows: 1, cols: 6 }));
  const f = [W - 70, 340]; raw(`<path d="M${f[0]} ${f[1]} q-6 30 -2 70 q8 -36 2 -70 Z" fill="#cfc8d4" stroke="${INK}" stroke-width="1.2"/>` + pline([[f[0] - 1, f[1]], [f[0] - 3, f[1] + 70]], 0.8, INK) + B.char(f[0] - 3, f[1] + 50, 6, 14, { Z: 4, op: 0.5 }) + burnV(f[0] - 3, f[1] + 20, 1.6, 30, 1.2, { depth: 2 }));
}
{ const e = []; for (let k = 0; k <= 30; k++) e.push([k * W / 30, 8 + Math.sin(k * 0.8) * 4 + R() * 3]); raw(cel([[-5, -5], [W + 5, -5], ...e.slice().reverse()], { Z: 3.5, fill: '#14101a', band: 4 }) + `<path d="${p2([[-5, -5], [W + 5, -5], ...e.slice().reverse()])}" fill="${S.hatchA(4)}" opacity="0.5"/>`); }

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `sky_throne_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, 'sky_throne.camera.json'), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log('sky_throne layers written');
