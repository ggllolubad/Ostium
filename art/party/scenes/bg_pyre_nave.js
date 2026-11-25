// World XIII, the Black Pyre: THE PENITENTS' NAVE (battle room `pyre_nave`, round 2 upgrade, Living Ink).
// The camera now looks DOWN the inquisition cathedral's nave: both arcades recede to the crossing, where the choir burns
// black and the Saint's fire shows as a darkness against the far apse lancets. Encounters: The Penitents' Walk (they
// flog themselves down the nave: their blood drops run down its middle), The Black Choir (deacon and knight).
// Lore (bible/world_XIII_black_pyre.md): the fire took on void; it gives no light and does not go out. Fire chars and
// splits; void makes the flame black with violet edges and leaves clean-rimmed absences; eyes allowed (void world).
// Light: cold grey daylight slanting in shafts from the LEFT clerestory (the key, upper left) across the nave onto the
// floor; the left wall's inner face is in shade, the right wall lit. Black flame lights nothing: it reads by silhouette
// against the lit aisle walls. No gold (the Saint's halo is the world's only gold). Red: the penitents' blood only.
// Depth planes: near (the first piers, the fore pier and the near arch), middle (the receding bays, chapels burning in
// the aisles), distance (the crossing, the burning choir, the apse lancets).
// Usage: node scenes/bg_pyre_nave.js [outDir]
'use strict';
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XIII');
const { S, B, G } = require('./battle_kit_g5').make(13201, '#100e12', '#1e1a22', '#56525a');
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const { line, pline, fillP, fillS, inkP, inkS, blob, jag, box, seam, ash, char, chain, tornVoid, quiet } = B;
const { W, H, air, blackFlame, shaft, pointed } = G;

const STONE = '#aaa6a0', DARKS = '#5a5658', VIO = '#9a6ad8', VIOD = '#4a2e6a', BLOOD = '#7a1a14', IRON = '#2e2a2c', MURK = B.MURK;
const NW = 6, Z0 = 3, ZC = 46, PIERS = [8.5, 14, 19.5, 25, 30.5, 36, 41.5], PD = 0.7, SPR = 5.0, WT = 13, VS = 13;
const bays = []; { const ps = [Z0 - 2, ...PIERS, ZC]; for (let i = 0; i < ps.length - 1; i++) bays.push([ps[i] + (i === 0 ? 0 : PD), ps[i + 1] - PD]); }
const opening = ([za, zb]) => pointed(za - Z0, zb - Z0, SPR, 10, 0.9);
const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const wallAt = X => (s, t) => [X, t, Z0 + s];
const LD = (() => { const d = [0.55, -0.62, 0.56], l = Math.hypot(...d); return d.map(v => v / l); })();
const toFloor = p => { const t = p[1] / -LD[1]; return [p[0] + LD[0] * t, 0, p[2] + LD[2] * t]; };
const hull = S.hull;

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- distance: beyond the crossing. The apse lancets pale with daylight, the choir between burning black, smoke banks
{
  const ZA = 64;
  raw(fillP([P(-16, 0, ZA), P(16, 0, ZA), P(16, 26, ZA), P(-16, 26, ZA)], '#3a3640'));
  for (const [X, w] of [[-4.6, 1.1], [-2.2, 1.2], [0.2, 1.3], [2.6, 1.2], [4.9, 1.0]]) { const o = pointed(X - w / 2, X + w / 2, 11, 6, 1).map(([x, y]) => P(x, y < 0.01 ? 2.8 : y, ZA)); raw(fillP(o, '#c8ccd0') + fillP(o.slice(0, Math.ceil(o.length / 2)), '#e4e6e8', 0.6) + inkP(o, 1)); const m = P(X, 2.8, ZA), m2 = P(X, 11.5, ZA); raw(pline([m, m2], 1, '#3a3640')); }
  // the choir burning black, silhouetted against the lancets; smoke rising into the crossing
  for (const [X, Z, w, h] of [[-3.2, 56, 4.2, 5.5], [1.0, 54, 5.6, 7.5], [4.6, 57, 3.4, 4.6]]) { const c = P(X, 0, Z); raw(blackFlame(c[0], c[1], K(Z) * w, K(Z) * h, { n: 4, lean: -0.15 })); }
  for (let i = 0; i < 4; i++) { const c = P(-2 + i * 1.6, 12 + i * 1.5, 54); raw(fillS(blob(c[0], c[1], 70 + i * 20, 18 + i * 3, 12, 0.4), mix('#1a161c', '#3a3640', i * 0.15), 0.75)); }
  // the choir stalls: burned canopies either side of the crossing, black
  for (const sx of [-1, 1]) for (let k = 0; k < 6; k++) { const Z = 47 + k * 1.3, X = sx * 4.6, a = P(X - 0.3, 0, Z), b = P(X + 0.3, 3.2 + (k % 3) * 0.4, Z); raw(fillP([[a[0], a[1]], [b[0], a[1]], [b[0], b[1] + 4], [(a[0] + b[0]) / 2, b[1] - 3], [a[0], b[1] + 4]], '#141216') + inkP([[a[0], a[1]], [b[0], a[1]], [b[0], b[1] + 4], [(a[0] + b[0]) / 2, b[1] - 3], [a[0], b[1] + 4]], 0.6)); }
}
// ---- the crossing wall at Z 46: the great crossing arch open onto the burning choir
{
  const op = pointed(-5.2, 5.2, 10.5, 12, 0.95).map(([s, t]) => [s, t]);
  const outer = pp([[-16, 0, ZC], [16, 0, ZC], [16, 26, ZC], [-16, 26, ZC]]), hole = p2(op.map(([x, y]) => P(x, y, ZC)));
  const cid = S.id('cx'); raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${hole}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(S.ashlar((s, t) => [-16 + s, t, ZC], 32, 26, air('#8a8682', ZC, 0.7), { vary: 0.2, chip: 0.4, mortar: 0.55, rough: true, roughP: 0.3, scale: 1.3 }));
  raw(S.soot((s, t) => [-16 + s, t, ZC], 10, 22, 4, 22, { op: 0.6 }) + hatch3((s, t) => [-16 + s, t, ZC], 0, 32, 0, 26, 0.8, { op: 0.35 }));
  raw('</g>');
  // the arch's order of voussoirs, charred
  for (let i = 1; i < op.length - 2; i++) { const a = op[i], b = op[i + 1], q = [P(a[0], a[1], ZC - 0.1), P(b[0], b[1], ZC - 0.1), P(b[0] * 1.08, b[1] + 0.55, ZC - 0.1), P(a[0] * 1.08, a[1] + 0.55, ZC - 0.1)]; raw(cel(chip(q, 0.3), { Z: ZC, fill: air(S.tone('#6a6664', 0.2), ZC, 0.6), band: 1 })); }
  // a void absence through the spandrel over the crossing, an eye in it
  raw(tornVoid((s, t) => [s, t, ZC - 0.15], 6.8, 16.5, 2.6, 2.0, { depth: 0.8, cut: '#6a6668', mat: '#5a5658', thin: '#000', thinOp: 0.18, tears: 4, teeth: 3, slivers: 6, flecks: 10, eyes: [[0.05, 0.1, 0.32]], eyeO: { white: '#cfc8bc', iris: '#6a5a7a', open: 0.4, look: [-0.4, 0.3] }, edge: VIOD, edgeOp: 0.5 }).svg);
}
// ---- the aisles seen through the arcade: outer walls with lancets, chapel altars burning black against the lit walls
for (const sx of [-1, 1]) {
  const XA = sx * 11.5, lit = sx < 0;
  const at = (s, t) => [XA, t, Z0 + s];
  raw(S.ashlar(at, ZC - Z0, 8.6, air(lit ? '#b8b4ae' : '#8a8682', 24, 0.5), { vary: 0.2, chip: 0.4, mortar: 0.5, rough: true, roughP: 0.3 }));
  for (const zc of [11.2, 16.7, 22.2, 27.7, 33.2, 38.7, 44]) { const w = 0.9, o = pointed(zc - w / 2 - Z0, zc + w / 2 - Z0, 4.6, 6, 1).map(([s, t]) => P(...at(s, t < 0.01 ? 2.4 : t))); raw(fillP(o, lit ? '#dfe2e4' : '#7e848c') + inkP(o, 0.8) + pline([P(...at(zc - Z0, 2.4)), P(...at(zc - Z0, 5.3))], 0.7, '#3a3640')); if (lit) raw(shaft([...o, P(XA + 5, 0, zc + 4), P(XA + 3.2, 0, zc + 2.6)], '#e8eaec', 0.05)); }
  raw(fillP([P(XA, 8.6, Z0), P(sx * 6, 8.6, Z0), P(sx * 6, 8.6, ZC), P(XA, 8.6, ZC)], '#1e1a1e') + `<path d="${pp([[XA, 8.6, Z0], [sx * 6, 8.6, Z0], [sx * 6, 8.6, ZC], [XA, 8.6, ZC]])}" fill="${S.hatchA(20)}" opacity="0.5"/>`);
  raw(fillP([P(XA, 0, Z0), P(sx * 6, 0, Z0), P(sx * 6, 0, ZC), P(XA, 0, ZC)], '#2a2628'));
  raw(S.soot(at, 0, ZC - Z0, 0, 4.5, { op: 0.5 }));
  // chapel altars along the aisle wall, burning black; the flame reads against the pale wall
  for (const zc of (lit ? [16.7, 27.7, 38.7] : [22.2, 33.2])) { const a = P(XA - sx * 0.6, 0, zc); raw(box(Math.min(XA, XA - sx * 1.0), Math.max(XA, XA - sx * 1.0), 0, 1.0, zc - 0.8, zc + 0.8, { col: '#3a3638', shadeOp: 0.5 }));
    const t = P(XA - sx * 0.5, 1.0, zc); raw(blackFlame(t[0], t[1], K(zc) * 1.4, K(zc) * 2.4, { n: 3, lean: sx * 0.1 })); }
}
// ---- the nave arcades: the walls with their openings, clerestory lancets over the triforium band
for (const sx of [-1, 1]) {
  const X = sx * NW, at = wallAt(X), Ls = ZC - Z0, lit = sx > 0;
  const holes = bays.map(b => opening(b));
  const outer = pp([at(0, 0), at(Ls, 0), at(Ls, WT), at(0, WT)]), hs = holes.map(o => p2(o.map(([s, t]) => P(...at(s, t))))).join(' ');
  const cid = S.id('ar'); raw(`<clipPath id="${cid}"><path clip-rule="evenodd" d="${outer} ${hs}"/></clipPath><g clip-path="url(#${cid})">`);
  raw(S.ashlar(at, Ls, WT, mix(STONE, lit ? '#c8c4bc' : '#6a6668', 0.2), { vary: 0.26, chip: 0.5, mortar: 0.6, lost: 0.2, spall: 0.3, rough: true, roughP: 0.3, skip: (s0, s1, t0, t1) => holes.some(o => inPoly((s0 + s1) / 2, (t0 + t1) / 2, o)) }));
  // atmospheric recession: the far bays fade toward the air
  for (const [za, k] of [[18, 0.18], [26, 0.18], [34, 0.2]]) raw(fillP([P(...at(za - Z0, 0)), P(...at(Ls, 0)), P(...at(Ls, WT)), P(...at(za - Z0, WT))], G.AIR, k));
  // char climbing from the floor (heavier low), the shade side crosshatched
  for (const [yt, op] of [[4.2, 0.2], [3.2, 0.24], [2.2, 0.28], [1.2, 0.3]]) { const pts = []; for (let k = 0; k <= 40; k++) pts.push(at(k * Ls / 40, yt + Math.sin(k * 1.3) * 0.4 + Math.sin(k * 3.1) * 0.2)); raw(`<path d="${pp([at(0, 0), at(Ls, 0), ...pts.reverse()])}" fill="#0c0a0c" opacity="${op}"/>`); }
  if (!lit) raw(hatch3(at, 0, Ls, 0, WT, 0.75, { op: 0.4, ragged: 0.05 }) + hatch3(at, 0, Ls, 0, WT, -0.8, { op: 0.3, ragged: 0.05, gap: 1.1 }));
  for (const zc of PIERS) raw(S.soot(at, zc - Z0 - 1.6, zc - Z0 + 1.6, 2.5, 11.5, { op: 0.5 }));
  // triforium string courses
  for (const y of [8.6, 9.3]) raw(cel([P(...at(0, y)), P(...at(Ls, y)), P(...at(Ls, y + 0.22)), P(...at(0, y + 0.22))], { Z: 20, fill: air(lit ? '#8a8680' : '#4a4648', 20, 0.4), band: 1 }));
  raw('</g>');
  // clerestory lancet pairs in every bay: the left glass blazing with daylight, the right dim; tracery charred
  bays.slice(1).forEach(([za, zb], bi) => { const zc = (za + zb) / 2;
    for (const dz of [-0.75, 0.75]) { const w = 1.05, o = pointed(zc + dz - w / 2 - Z0, zc + dz + w / 2 - Z0, 11.6, 6, 1).map(([s, t]) => P(...at(s, t < 0.01 ? 9.6 : t)));
      const gone = (sx > 0 && bi === 3 && dz > 0);
      raw(fillP(o, gone ? '#08060a' : lit ? air('#7e848c', zc, 0.3) : '#e6e8ea') + (lit || gone ? '' : fillP(o.slice(0, Math.ceil(o.length / 2)), '#f6f6f4', 0.7)) + inkP(o, Math.max(0.6, inkW(zc) * 1.1)));
      if (!gone) { const m0 = P(...at(zc + dz - Z0, 9.6)), m1 = P(...at(zc + dz - Z0, 12.3)); raw(pline([m0, m1], Math.max(0.6, inkW(zc)), '#2a2628')); for (const y of [10.4, 11.2]) raw(pline([P(...at(zc + dz - w / 2 - Z0, y)), P(...at(zc + dz + w / 2 - Z0, y))], Math.max(0.4, inkW(zc) * 0.6), '#2a2628', 0.8)); } }
    if (bi === 4 && sx < 0) raw(seam(jag(P(...at(zc - Z0, 12.4)), P(...at(zc - Z0 + 1.2, 9.4)), 5, 2), 1, { core: VIOD, hot: VIO, glowOp: 0 })); });
  // voussoirs round each opening, charred toward the floor
  for (const o of holes) for (let i = 1; i < o.length - 2; i++) { const a = o[i], b = o[i + 1], c = [(o[1][0] + o[o.length - 2][0]) / 2, SPR], na = Math.hypot(a[0] - c[0], a[1] - c[1]) || 1, nb = Math.hypot(b[0] - c[0], b[1] - c[1]) || 1, d = 0.42;
    const q = [at(a[0], a[1]), at(b[0], b[1]), at(b[0] + (b[0] - c[0]) / nb * d, b[1] + (b[1] - c[1]) / nb * d), at(a[0] + (a[0] - c[0]) / na * d, a[1] + (a[1] - c[1]) / na * d)];
    const Zq = q[0][2]; if (Zq < 4) continue; raw(cel(chip(q.map(p => P(...p)), 0.3), { Z: Zq, fill: air(S.tone(lit ? '#8a8682' : '#5a5658', 0.2), Zq, 0.8), band: 1, tex: 'url(#mottle)', texOp: 0.4 })); }
}
// ---- the nave vault over the far bays: cells between transverse and diagonal ribs, each cell its own plane
{
  const rib = (z, n = 10) => pointed(-NW, NW, VS, n, 0.6).slice(1, -1).map(([x, y]) => [x, y, z]);
  const ps = [...PIERS.filter(z => z > 22), ZC];
  for (let i = 0; i < ps.length - 1; i++) { const za = ps[i], zb = ps[i + 1], zm = (za + zb) / 2, ap = [0, VS + 4.2, zm], A = rib(za), Bq = rib(zb);
    const cells = [[A, ap, 0.2], [Bq, ap, 0.05], [[[-NW, VS, za], [-NW, VS, zb]], ap, 0.35], [[[NW, VS, za], [NW, VS, zb]], ap, 0.1]];
    for (const [edge, apx, dk] of cells) { const poly = [...edge, apx].map(p => P(...p)); raw(cel(poly, { Z: zm, fill: air(mix('#6a6664', '#0c0a0c', dk), zm, 0.5), band: 1, hi: false }) + `<path d="${p2(poly)}" fill="${S.hatchA(zm)}" opacity="${0.25 + dk}"/>`); }
    for (const [p, q] of [[[-NW, VS, za], ap], [[NW, VS, za], ap], [ap, [-NW, VS, zb]], [ap, [NW, VS, zb]]]) { const pts = []; for (let k = 0; k <= 8; k++) { const u = k / 8; const e = p[1] < q[1] ? Math.sin(u * Math.PI / 2) : 1 - Math.cos(u * Math.PI / 2); pts.push(P(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * e, p[2] + (q[2] - p[2]) * u)); } raw(line(pts, Math.max(1.5, K(zm) * 0.22), INK) + line(pts, Math.max(0.8, K(zm) * 0.14), air('#7a7672', zm, 0.5))); }
  }
  for (const z of ps) { const pts = rib(z).map(p => P(...p)); raw(line(pts, Math.max(1.6, K(z) * 0.28), INK) + line(pts, Math.max(0.9, K(z) * 0.18), air('#8a8682', z, 0.5))); }
  // the void has unmade a piece of one vault cell: black, an eye in it
  raw(tornVoid((s, t) => [s, VS + 3.6, t], -1.6, 38.6, 2.2, 3.0, { depth: 0.5, dir: [0, 1, 0], cut: '#5a5658', mat: '#4a4648', tears: 3, teeth: 2, slivers: 5, flecks: 8, eyes: [[0.0, 0.0, 0.4]], eyeO: { white: '#cfc8bc', iris: '#6a5a7a', open: 0.35, look: [0.1, 0.6] }, edge: VIOD, edgeOp: 0.5 }).svg);
}
// ---- the piers: compound piers with a vaulting shaft running up into the vault; capitals burned to stumps
for (const z of PIERS.slice().reverse()) for (const sx of [-1, 1]) {
  const x0 = sx < 0 ? -NW : NW - 0.55, x1 = sx < 0 ? -NW + 0.55 : NW, col = air(sx > 0 ? '#7a7672' : '#4a4648', z, 0.7);
  raw(box(x0, x1, 0, 0.5, z - PD - 0.1, z + PD + 0.1, { col: air('#4a4648', z, 0.6), shadeOp: 0.5 }) + box(x0, x1, 0.5, SPR, z - PD, z + PD, { col, shadeOp: 0.45 }));
  const xs0 = sx < 0 ? -NW + 0.55 : NW - 0.85, xs1 = sx < 0 ? -NW + 0.85 : NW - 0.55; raw(box(xs0, xs1, 0.5, VS, z - 0.18, z + 0.18, { col: air(sx > 0 ? '#b0aca6' : '#6a6668', z, 0.7), shadeOp: 0.4 }));
  const c = [P(x0 - 0.15, SPR + 0.3, z - PD - 0.1), P(x1 + 0.15, SPR + 0.3, z - PD - 0.1), P(x1, SPR - 0.15, z - PD - 0.1), P(x0, SPR - 0.15, z - PD - 0.1)];
  raw(cel(chip(c, 0.6), { Z: z, fill: air('#3a3638', z, 0.6), tex: 'url(#mottle)', texOp: 0.5, band: 1 }));
  raw(S.soot((s, t) => [sx < 0 ? x1 : x0, t, z - PD + s], 0, 2 * PD, 0.5, 6, { op: 0.45 }) + fillP([P(x0 - 0.9, 0, z - PD), P(x1 + 0.4, 0, z - PD), P(x1 + 0.4, 3.4, z - PD), P(x0 - 0.9, 3.4, z - PD)], '#0c0a0c', 0.3));
}
// a void absence through a pier's side (mid distance, right), stone unmade with the cut through its thickness
raw(tornVoid((s, t) => [NW - 0.55, t, 25 - PD + s], 0.7, 3.2, 1.0, 1.5, { dir: [1, 0, 0], depth: 0.55, cut: '#8a8682', mat: '#7a7672', tears: 3, teeth: 2, slivers: 5, flecks: 7, edge: VIOD, edgeOp: 0.5 }).svg);
// heat split seams in the pale right wall above the band
for (let k = 0; k < 9; k++) { const z = 9 + R() * 30, y = 6 + R() * 6, a = P(NW - 0.01, y, z); if (PIERS.some(p => Math.abs(p - z) < 1)) continue; raw(seam(jag(a, [a[0] + (R() - 0.5) * 8, a[1] + 8 + R() * 14], 5, 2), Math.max(0.6, K(z) * 0.03), { core: VIOD, hot: VIO, glowOp: 0 })); }
// ---- the nave floor: ledger flags converging, blood drops of the penitents' walk down the middle, ash drifts
{
  raw(B.flags(-NW, NW, Z0, ZC, mix('#5a5658', MURK, 0.35), { depth: 1.2, width: 1.5, vary: 0.14, cracks: 0.25, fogK: 0.5, joint: 0.6 }));
  // the cold daylight lying on the flags in long slanted patches (from each left clerestory lancet)
  bays.slice(1).forEach(([za, zb]) => { const zc = (za + zb) / 2; for (const dz of [-0.75, 0.75]) { const win = [[-NW, 9.6, zc + dz - 0.5], [-NW, 9.6, zc + dz + 0.5], [-NW, 12.4, zc + dz + 0.5], [-NW, 12.4, zc + dz - 0.5]], fl = win.map(toFloor);
    if (fl.some(p => p[2] > ZC - 0.5 || p[0] > NW)) continue; raw(fillP(hull(fl.map(p => P(...p))), '#c8ccd0', 0.16)); } });
  // ash drifted against the pier plinths, raked by feet down the middle
  for (const z of PIERS) for (const sx of [-1, 1]) { const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(P(sx * (NW - 0.6 - u * 1.4), Math.sin(u * Math.PI) * 0.18, z - 1 + u * 2)); } raw(fillS([P(sx * (NW - 0.6), 0, z - 1), ...pts, P(sx * (NW - 0.6), 0, z + 1)], air('#6a6664', z, 0.6), 0.85) + line(pts, 0.6, INK, 0.4)); }
  // the penitents' blood: drops in a wavering trail down the middle of the nave, some smeared by bare feet
  for (let k = 0; k < 140; k++) { const z = 6.5 + Math.pow(R(), 1.3) * 30, x = Math.sin(z * 0.45) * 0.9 + (R() - 0.5) * 1.3, c = P(x, 0, z), r = Math.max(0.5, K(z) * (0.018 + R() * 0.03)); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * (R() < 0.15 ? 3 : 1.3))}" ry="${f1(r * 0.4)}" fill="${BLOOD}" opacity="${f1(0.5 + R() * 0.4)}"/>`); }
  raw(S.occBand((s, t) => [-NW + s, 0, ZC - t], 2 * NW, 1.6, { op: 0.4, cross: true }));
}
// ---- the light shafts from the left clerestory, slanting down across the nave (stepped, pale, ash turning in them)
bays.slice(2).forEach(([za, zb]) => { const zc = (za + zb) / 2; for (const dz of [-0.75, 0.75]) { const win = [[-NW, 9.6, zc + dz - 0.5], [-NW, 9.6, zc + dz + 0.5], [-NW, 12.4, zc + dz + 0.5], [-NW, 12.4, zc + dz - 0.5]], fl = win.map(toFloor);
  if (fl.some(p => p[2] > ZC + 2)) continue; const sp = hull([...win, ...fl].map(p => P(...p))); raw(shaft(sp, '#e2e4e6', 0.07)); const bb = [Math.min(...sp.map(p => p[0])), Math.max(...sp.map(p => p[0])), Math.min(...sp.map(p => p[1])), Math.max(...sp.map(p => p[1]))]; raw(ash(6, bb[0], bb[1], bb[2], bb[3] - 20, { r: 1.4, op: 0.6, col: '#d8d6d2' })); } });
raw(quiet([[232, 0.16], [266, 0.16], [300, 0.14], [345, 0.14]], { hop: 0.18 }));
raw(ash(120, 0, W, 10, 260, { r: 1.8, op: 0.5, col: '#a8a49e' }));

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
{ // a penitents' bench pushed askew across the nave, one end on the flags, charred (a familiar size: 2.2 m long, seat 0.45 m)
  const Z = 10.2, X = -2.6, k = K(Z); const a = P(X - 1.1, 0.45, Z + 0.3), b = P(X + 1.1, 0.45, Z - 0.2); raw(cel([[a[0], a[1] - 2], [b[0], b[1] - 2], [b[0], b[1] + k * 0.08], [a[0], a[1] + k * 0.08]], { Z, fill: mix('#2a2224', MURK, 0.2), band: 1.5 })); for (const [x, z] of [[X - 0.9, Z + 0.25], [X + 0.9, Z - 0.15]]) raw(line([P(x, 0.45, z), P(x, 0, z)], 2.6, INK) + line([P(x, 0.45, z), P(x, 0, z)], 1.4, '#2a2224')); raw(B.char((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2, k * 0.5, k * 0.05, { Z })); }
{ // a dropped scourge (knotted cords on a handle) on the flags, a dead censer on its side trailing its chain, ash heaps
  const Z = 9.0, c = P(-1.8, 0.03, Z); raw(line([[c[0] - 14, c[1] + 2], [c[0] + 6, c[1] - 1]], 3, INK) + line([[c[0] - 14, c[1] + 2], [c[0] + 6, c[1] - 1]], 1.6, mix('#4a3a2a', MURK, 0.3)));
  for (let k = 0; k < 4; k++) { const pts = [[c[0] + 6, c[1] - 1], [c[0] + 14 + k * 3, c[1] + 2 - k], [c[0] + 24 + k * 4, c[1] + 1 + k * 0.8]]; raw(line(pts, 1.6, INK) + line(pts, 0.8, mix('#6a5a44', MURK, 0.3))); for (let j = 1; j < 3; j++) raw(`<circle cx="${f1(pts[j][0])}" cy="${f1(pts[j][1])}" r="1.4" fill="${mix(BLOOD, MURK, 0.3)}" stroke="${INK}" stroke-width="0.4"/>`); }
  const Z2 = 10.4, d = P(3.0, 0.2, Z2), r = K(Z2) * 0.18; raw(cel(blob(d[0], d[1], r * 1.2, r, 10, 0.2), { Z: Z2, fill: mix(IRON, MURK, 0.2), band: 2 }) + chain([[d[0] - r, d[1]], [d[0] - r * 3, d[1] + 3], [d[0] - r * 6, d[1] + 1]], 1.6, mix(IRON, MURK, 0.2)));
  for (let k = 0; k < 6; k++) raw(`<rect x="${f1(d[0] - r * 0.6 + k * r * 0.25)}" y="${f1(d[1] - r * 0.4)}" width="${f1(r * 0.08)}" height="${f1(r * 0.8)}" fill="${INK}" opacity="0.6"/>`);
  raw(fillS(blob(d[0] + r * 1.6, d[1] - r * 0.5, r * 1.2, r * 0.6, 10, 0.4), '#060508', 0.55));
}

// ======================================================================== FORE: framing
layer('fore');
{ // top right: the inquisition's processional banner hung from the near vault, sackcloth burned to tatters at the hem,
  // the black flame of the order stitched on it; its pole and cords
  const x0 = 1190, x1 = 1400, y0 = -5, hem = []; for (let k = 0; k <= 12; k++) { const u = k / 12; hem.push([x1 - (x1 - x0) * u, 100 + Math.sin(u * 9) * 8 + (k % 2 ? 26 : 0) * R() + (u > 0.4 && u < 0.6 ? 40 : 0)]); }
  const poly = [[x0, y0], [x1, y0], ...hem]; raw(cel(poly, { Z: 3.6, fill: '#4a4446', band: 8, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(poly)}" fill="${S.hatchA(4)}" opacity="0.45"/>`);
  for (let k = 1; k < 5; k++) { const x = x0 + (x1 - x0) * k / 5 + (R() - 0.5) * 10; raw(line([[x, 0], [x + 4, 60], [x - 3, 130]], 1.6, '#3a3436', 0.6)); }
  raw(B.char(x0 + 60, 92, 40, 14, { Z: 4, op: 0.6 }));
  raw(blackFlame((x0 + x1) / 2, 78, 56, 60, { n: 3, lick: 0 }));
  raw(line([[x0 - 20, 6], [x1 + 30, 2]], 7, INK) + line([[x0 - 20, 6], [x1 + 30, 2]], 4, '#3a3032') + pline([[x0 - 20, 6], [x0 + 10, -5]], 1.4, INK) + pline([[x1 + 30, 2], [x1 + 10, -5]], 1.4, INK));
}
{ // left: the near pier's shaft at the frame edge, soot-black, a violet-lipped split, scourges hung on a nail
  const xs = [[-10, 0], [46, 0], [52, 480], [-10, 480]]; raw(cel(xs, { Z: 3.5, fill: '#2a2628', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(xs)}" fill="${S.hatchA(4)}" opacity="0.5"/>` + `<path d="${p2(xs)}" fill="${S.hatchB(4)}" opacity="0.35"/>`);
  for (let y = 30; y < 480; y += 48 + R() * 30) raw(pline([[-10, y], [48, y + 2]], 1.2, INK, 0.6));
  raw(line([[40, 0], [44, 480]], 2, '#5a5658', 0.6) + seam(jag([30, 120], [20, 300], 8, 3), 1.4, { core: VIOD, hot: VIO, glowOp: 0 }) + ash(14, 0, 90, 60, 420, { r: 2.4, op: 0.6 }));
}
{ // right: a hanging iron censer on its chain, cold, trailing black smoke that falls rather than rises
  const x = 1436; raw(chain([[x, -5], [x + 2, 90], [x - 1, 168]], 4.5, IRON));
  const c = [x - 1, 190], r = 20; raw(cel([[c[0] - r, c[1] - r * 0.6], [c[0] + r, c[1] - r * 0.6], [c[0] + r * 0.8, c[1] + r * 0.6], [c[0], c[1] + r], [c[0] - r * 0.8, c[1] + r * 0.6]], { Z: 3.6, fill: '#2e2a2c', band: 4 }) + pline([[c[0] - r, c[1] - r * 0.6], [c[0], c[1] - r * 1.3], [c[0] + r, c[1] - r * 0.6]], 3, INK));
  for (let k = 0; k < 5; k++) raw(`<rect x="${f1(c[0] - r * 0.7 + k * r * 0.33)}" y="${f1(c[1] - r * 0.3)}" width="2.4" height="${f1(r * 0.8)}" fill="#08060a"/>`);
  for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 8; i++) pts.push([c[0] - 6 + k * 6 + Math.sin(i * 0.9 + k) * (3 + i), c[1] + r + i * 14]); raw(line(pts, 6 - k, '#0a080c', 0.55 - k * 0.12)); }
}
raw(ash(30, 0, W, 0, 470, { r: 2.6, op: 0.55 }));

G.write(OUT, 'pyre_nave');
