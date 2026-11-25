// World III, the Boiling Baths: THE GREAT POOL, in Living Ink. Replaces grim/bg_worlds.js room 'baths_pool'.
// Contract as the nave: 1480 x 480 (shown at 2x); baths_pool_far.svg (opaque), _mid.svg, _fore.svg (transparent); the
// battle camera of nave.camera.json (horizon 300, eye 1.2 m, focal 652, cx 740; fighters at 6 m, feet on y 430).
// Lore (bible/world_III_boiling_baths.md): a temple of healing waters where the nobility came to be cleansed. The water
// never stopped heating, and cleansing turned into cooking.
// The place: the company stands on the marble surround of the temple's great pool. Beyond it the water boils milky and
// green; across it the pink-white colonnade, and in the apse behind the middle bay the sacred spring itself, pouring from
// its bronze lip into the basin, the wall round it hung thick with the pilgrims' clay votives (legs, arms, hands, feet,
// swaddled babies), many cracked by the heat. At the right, the arch to the seventh pool, its bronze plaque stamped VII,
// and wet drag-marks across the floor from it: the best families have climbed out to complain about the water.
// Courses: FIRE cooks from outside in (the floor's marble heat-crazed, tiles lifted and blistered, the hypocaust's fire
// glowing up through the worst cracks; the painted bathers on the wall peeling off in sheets like boiled skin; copper
// pipes cooked red-brown, scorched); WATER keeps everything wet, swollen and steaming (steam rising and collecting under
// the vault, scale crusting white at every leak and along the pool's tide line, rag-bandaged pipes weeping, wet sheen).
// Palette: pink-white marble, steam white, boiled red (the cooked tide line, the copper, the meander's rubric-red border:
// no other red). Gold only on the holy: the gilded wave band of the spring's apse and its conch.
// Usage: node scenes/bg_baths_pool.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'III');
const W = 1480, H = 480, ROOM = 'baths_pool';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2503, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#3a1e1c' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, occBand, mix, R, glow, stain, smooth, chip, tone, EM, crack, figProp } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK);
const { line, polyS } = BK;
const { ell } = require('../engine');

// ============================================================================ WORLD KIT III (the Boiling Baths)
const MARB = '#b8a29c', MARBD = '#8a7470', STEAM = '#ece6e0', BOIL = '#a4483a', COPPER = '#8a4a32', BRONZE = '#7a5a32', GILT = '#b89848',
  WATER = '#7a8e7e', MURK = '#2a1c1c', HOT = '#ff9a4a', SCALE = '#e8e4d4', CLAY = '#a8704a';
const fog = (col, Z, k = 1) => mix(col, '#6a5250', Math.max(0, Math.min(0.4, (Z - 8) / 30)) * k); // steam haze lifts far things
// marble on a plane at(s,t): slabs of uneven size, each its own tone, with soft grey-violet veins wandering across
function marble(at, Ls, Lt, col, o = {}) {
  let out = `<path d="${pp([at(0, 0), at(Ls, 0), at(Ls, Lt), at(0, Lt)])}" fill="${mix(col, INK, 0.55)}"/>`;
  const rowsH = o.rows || 0.8; let t = 0, ri = 0;
  while (t < Lt - 0.02) {
    const h = Math.min(Lt - t, rowsH * (0.7 + R() * 0.6)); let s = -R() * 0.8;
    while (s < Ls) {
      const w = (o.slab || 1.2) * (0.6 + R() * 0.9), a0 = Math.max(0, s), a1 = Math.min(Ls, s + w);
      if (a1 - a0 > 0.05 && !(o.skip && o.skip(a0, a1, t, t + h))) {
        const g = 0.015, q = [at(a0 + g, t + g), at(a1 - g, t + g), at(a1 - g, t + h - g), at(a0 + g, t + h - g)], qs = q.map(p => P(...p)), Zb = (q[0][2] + q[2][2]) / 2;
        const fill = tone(col, o.vary ?? 0.14);
        out += cel(o.chipAmt ? chip(qs, o.chipAmt) : qs, { Z: Zb, fill, tex: 'url(#mottle)', texOp: 0.25, band: Math.max(0.8, K(Zb) * 0.02) });
        // veins: two or three soft wandering lines, one darker and thin, one pale
        for (let k = 0; k < 2 + Math.floor(R() * 2); k++) { const pts = []; let vs = a0 + R() * (a1 - a0), vt = t + R() * h, ang = R() * 6.28; for (let j = 0; j < 7; j++) { pts.push(P(...at(Math.max(a0, Math.min(a1, vs)), Math.max(t, Math.min(t + h, vt))))); ang += (R() - 0.5) * 1.2; vs += Math.cos(ang) * w * 0.15; vt += Math.sin(ang) * h * 0.18; }
          out += `<path d="${smooth(pts, false, 0.6)}" stroke="${k ? mix(fill, '#f8f0f0', 0.5) : mix(fill, '#5a4a5a', 0.45)}" stroke-width="${f1(Math.max(0.4, K(Zb) * 0.008))}" fill="none" opacity="${k ? 0.45 : 0.5}"/>`; }
        // heat crazing: a fine net of short ink lines on some slabs (fire's mark on stone)
        if (R() < (o.craze || 0)) { let cz = ''; const c = P(...at((a0 + a1) / 2, t + h / 2)), rx = Math.abs(qs[1][0] - qs[0][0]) * 0.4, ry = Math.abs(qs[3][1] - qs[0][1]) * 0.4; for (let j = 0; j < 7; j++) { const x = c[0] + (R() - 0.5) * rx * 2, y = c[1] + (R() - 0.5) * ry * 2; cz += `M${f1(x)} ${f1(y)} l${f1((R() - 0.5) * rx * 0.6)} ${f1((R() - 0.5) * ry * 0.6)} l${f1((R() - 0.5) * rx * 0.4)} ${f1((R() - 0.5) * ry * 0.5)} `; } out += `<path d="${cz}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.5"/>`; }
      }
      s += w;
    }
    t += h; ri++;
  }
  return out;
}
// a column of the colonnade at X on depth Z: Attic base, a fluted shaft with entasis, an Ionic capital with its volutes;
// lit on the left, hatched on the right third; the cooked red tide line and the white scale crust near its foot; peeling
function column(X, Z, h, r, o = {}) {
  let s = ''; const k = K(Z), base = P(X, 0, Z), top = P(X, h, Z), rpx = r * k, col = fog(o.col || MARB, Z);
  const shaft = []; for (let i = 0; i <= 10; i++) { const u = i / 10, w = rpx * (1 - 0.14 * u + 0.05 * Math.sin(u * Math.PI)); shaft.push([base[0] - w, base[1] + (top[1] - base[1]) * u - (i === 0 ? -rpx * 0.25 : 0)]); }
  const right = shaft.map(([x, y]) => [base[0] + (base[0] - x), y]).reverse();
  const poly = [...shaft, ...right];
  s += `<path d="${p2(poly)}" fill="${col}"/><path d="${p2(poly)}" fill="url(#mottle)" opacity="0.3"/>`;
  // cylinder shading: a cel band on the right, hatched; a lit stripe on the left
  const band = shaft.map(([x, y], i) => [base[0] + (base[0] - x) * 0.25, y]), bandR = right.slice().reverse();
  s += `<path d="${p2([...band, ...right])}" fill="${mix(col, '#3a1e1c', 0.4)}"/><path d="${p2([...band, ...right])}" fill="${S.hatchA(Z)}" opacity="0.45"/>`;
  s += `<path d="${p2(shaft.map(([x, y]) => [x + rpx * 0.35, y]).concat(shaft.map(([x, y]) => [x + rpx * 0.5, y]).reverse()))}" fill="#fff6f0" opacity="0.25"/>`;
  // flutes
  for (let j = 1; j < 8; j++) { const u = j / 8 * 2 - 1, xx = base[0] + Math.sin(u * Math.PI / 2) * rpx * 0.92, xt = top[0] + Math.sin(u * Math.PI / 2) * rpx * 0.8; s += `<path d="M${f1(xx)} ${f1(base[1] - rpx * 0.5)} L${f1(xt)} ${f1(top[1] + rpx * 0.3)}" stroke="${mix(col, INK, 0.45)}" stroke-width="${f1(Math.max(0.4, k * 0.012))}" opacity="${f1(0.35 + Math.max(0, u) * 0.3)}"/>`; }
  s += `<path d="${p2(poly)}" fill="none" stroke="${INK}" stroke-width="${f1(S.inkW(Z))}"/>`;
  // the base: two tori and a plinth
  s += cel([[base[0] - rpx * 1.45, base[1]], [base[0] + rpx * 1.45, base[1]], [base[0] + rpx * 1.45, base[1] - rpx * 0.4], [base[0] - rpx * 1.45, base[1] - rpx * 0.4]], { Z, fill: tone(col, 0.1), tex: 'url(#mottle)', texOp: 0.25 });
  s += cel(ell([base[0], base[1] - rpx * 0.6], rpx * 1.3, rpx * 0.26, 0, 14), { Z, fill: tone(col, 0.1) }) + cel(ell([base[0], base[1] - rpx * 0.95], rpx * 1.12, rpx * 0.2, 0, 14), { Z, fill: tone(col, 0.1) });
  // the capital: echinus, two volutes, abacus
  const cy = top[1];
  s += cel([[top[0] - rpx * 1.5, cy - rpx * 0.55], [top[0] + rpx * 1.5, cy - rpx * 0.55], [top[0] + rpx * 1.5, cy - rpx * 0.8], [top[0] - rpx * 1.5, cy - rpx * 0.8]], { Z, fill: tone(col, 0.1) });
  s += cel([[top[0] - rpx * 1.3, cy - rpx * 0.55], [top[0] + rpx * 1.3, cy - rpx * 0.55], [top[0] + rpx * 0.9, cy], [top[0] - rpx * 0.9, cy]], { Z, fill: tone(col, 0.1) });
  for (const sg of [-1, 1]) { const vx = top[0] + sg * rpx * 1.25, vy = cy - rpx * 0.25; s += `<circle cx="${f1(vx)}" cy="${f1(vy)}" r="${f1(rpx * 0.4)}" fill="${col}" stroke="${INK}" stroke-width="${f1(S.inkW(Z) * 0.9)}"/><path d="M${f1(vx)} ${f1(vy)} m${f1(-rpx * 0.25)} 0 a${f1(rpx * 0.25)} ${f1(rpx * 0.25)} 0 1 1 ${f1(rpx * 0.3)} ${f1(rpx * 0.12)} a${f1(rpx * 0.14)} ${f1(rpx * 0.14)} 0 1 1 ${f1(-rpx * 0.12)} ${f1(-rpx * 0.12)}" stroke="${INK}" stroke-width="0.6" fill="none"/>`; }
  // the cooked tide line at the old water height (boiled red-brown), white scale crust below it, peeling skin of the marble
  if (o.tide !== undefined) { const ty = P(X, o.tide, Z)[1]; s += `<path d="M${f1(base[0] - rpx * 0.95)} ${f1(ty)} Q${f1(base[0])} ${f1(ty + 3)} ${f1(base[0] + rpx * 0.95)} ${f1(ty)}" stroke="${BOIL}" stroke-width="${f1(Math.max(1, k * 0.06))}" fill="none" opacity="0.55"/>`;
    s += `<path d="${p2([[base[0] - rpx * 0.95, ty + 2], [base[0] + rpx * 0.95, ty + 2], [base[0] + rpx * 1.0, base[1] - rpx * 1.1], [base[0] - rpx * 1.0, base[1] - rpx * 1.1]])}" fill="${SCALE}" opacity="0.25"/>`; }
  if (o.peel) { const py = top[1] + (base[1] - top[1]) * o.peel; s += `<path d="M${f1(base[0] - rpx * 0.7)} ${f1(py)} q${f1(rpx * 0.4)} ${f1(-rpx * 0.3)} ${f1(rpx * 0.8)} 0 l${f1(-rpx * 0.1)} ${f1(rpx * 0.9)} q${f1(-rpx * 0.4)} ${f1(rpx * 0.2)} ${f1(-rpx * 0.6)} ${f1(-rpx * 0.1)} Z" fill="${mix(col, '#7a5a5a', 0.4)}" stroke="${INK}" stroke-width="0.6"/><path d="M${f1(base[0] + rpx * 0.1)} ${f1(py)} q${f1(rpx * 0.3)} ${f1(rpx * 0.2)} ${f1(rpx * 0.15)} ${f1(rpx * 0.6)}" stroke="${INK}" stroke-width="0.7" fill="${mix(col, '#fff', 0.3)}"/>`; }
  return s;
}
// a clay votive hung on a cord from a nail: a leg, an arm, a hand, a foot or a swaddled baby, terracotta, some cracked
function votive(x, y, s, kind, o = {}) {
  const col = tone(o.col || CLAY, 0.2); let out = `<path d="M${f1(x)} ${f1(y - s * 0.5)} L${f1(x)} ${f1(y)}" stroke="${INK}" stroke-width="0.5"/><circle cx="${f1(x)}" cy="${f1(y - s * 0.5)}" r="0.7" fill="${INK}"/>`;
  let shape;
  if (kind === 'leg') shape = [[x - s * 0.18, y], [x + s * 0.18, y], [x + s * 0.14, y + s * 0.9], [x + s * 0.12, y + s * 1.7], [x + s * 0.5, y + s * 1.85], [x + s * 0.5, y + s * 2.0], [x - s * 0.12, y + s * 2.0], [x - s * 0.15, y + s * 0.9]];
  else if (kind === 'arm') shape = [[x - s * 0.15, y], [x + s * 0.15, y], [x + s * 0.12, y + s * 1.3], [x + s * 0.25, y + s * 1.55], [x + s * 0.05, y + s * 1.8], [x - s * 0.2, y + s * 1.6], [x - s * 0.13, y + s * 1.3]];
  else if (kind === 'hand') shape = [[x - s * 0.22, y], [x + s * 0.22, y], [x + s * 0.28, y + s * 0.5], [x + s * 0.2, y + s * 0.95], [x + s * 0.05, y + s * 1.0], [x - s * 0.12, y + s * 0.95], [x - s * 0.28, y + s * 0.55]];
  else if (kind === 'foot') shape = [[x - s * 0.15, y], [x + s * 0.12, y], [x + s * 0.14, y + s * 0.5], [x + s * 0.55, y + s * 0.62], [x + s * 0.55, y + s * 0.8], [x - s * 0.18, y + s * 0.8]];
  else shape = [[x, y], [x + s * 0.25, y + s * 0.2], [x + s * 0.28, y + s * 0.9], [x + s * 0.15, y + s * 1.25], [x - s * 0.15, y + s * 1.25], [x - s * 0.28, y + s * 0.9], [x - s * 0.25, y + s * 0.2]];
  out += cel(shape, { Z: o.Z || 20, fill: col, band: Math.max(0.6, s * 0.12), inkW: 0.6 });
  if (kind === 'hand') for (let j = 0; j < 3; j++) out += `<path d="M${f1(x - s * 0.1 + j * s * 0.1)} ${f1(y + s * 0.6)} l0 ${f1(s * 0.32)}" stroke="${INK}" stroke-width="0.4"/>`;
  if (kind === 'baby') for (let j = 0; j < 3; j++) out += `<path d="M${f1(x - s * 0.25)} ${f1(y + s * (0.45 + j * 0.22))} l${f1(s * 0.5)} ${f1(s * 0.08)}" stroke="${INK}" stroke-width="0.4"/>`;
  if (R() < 0.35) out += `<path d="M${f1(x - s * 0.1)} ${f1(y + s * 0.3)} l${f1(s * 0.12)} ${f1(s * 0.25)} l${f1(-s * 0.06)} ${f1(s * 0.3)}" stroke="${INK}" stroke-width="0.6" fill="none"/>`;
  return out;
}
// a copper pipe along screen points, cooked red-brown, with rivet bands; o.rags at fractions: rag bandages weeping steam
function pipe(pts, w, o = {}) {
  let s = line(pts, w + 2, INK, 1) + line(pts, w, o.col || COPPER, 1) + line(pts.map(([x, y]) => [x - w * 0.15, y - w * 0.22]), Math.max(0.6, w * 0.25), '#d89070', 0.55) + line(pts.map(([x, y]) => [x + w * 0.1, y + w * 0.25]), Math.max(0.6, w * 0.3), '#3a1a10', 0.5);
  for (const u of o.rags || []) { const i = Math.min(pts.length - 2, Math.floor(u * (pts.length - 1))), A = pts[i], B = pts[i + 1], x = A[0] + (B[0] - A[0]) * 0.5, y = A[1] + (B[1] - A[1]) * 0.5;
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w * 1.1)}" ry="${f1(w * 0.85)}" fill="#c8b8a0" stroke="${INK}" stroke-width="0.7"/><path d="M${f1(x - w * 0.6)} ${f1(y - w * 0.5)} l${f1(w * 0.4)} ${f1(w)} M${f1(x)} ${f1(y - w * 0.7)} l${f1(w * 0.4)} ${f1(w * 1.2)}" stroke="${INK}" stroke-width="0.5" opacity="0.7"/><path d="M${f1(x)} ${f1(y + w * 0.8)} l0 ${f1(w * 2 + R() * w * 2)}" stroke="${SCALE}" stroke-width="${f1(w * 0.4)}" opacity="0.6" stroke-linecap="round"/>` + G.softSteam(x + w * 0.5, y - w, w * 7, w * 2.2, { n: 4, op: 0.22, drift: 0.3 }); }
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="#3a2626"/>`);
const ZC = 18, ZB = 23, CH = 5.6, CR = 0.34, COLS = [-18, -13.5, -9, -4.5, 0, 4.5, 9, 13.5, 18].map(x => x - 2.25);
// ---- the ambulatory's back wall behind the colonnade: marble revetment below, painted plaster above (the fresco of
// bathers peeling off in sheets), the apse of the spring in the middle bay, the VII arch at the right; the vault over all
{
  const at = (s, t) => [-30 + s, t, ZB];
  raw(marble(at, 60, 1.8, fog('#5e4a46', ZB), { rows: 0.9, slab: 1.6, craze: 0.3 }));
  // plaster: warm ochre wash with the fresco (bathers in the water, waves) in faded panels, peeling in curling sheets
  raw(`<path d="${pp([at(0, 1.8), at(60, 1.8), at(60, 10), at(0, 10)])}" fill="${fog('#5a3a32', ZB)}"/><path d="${pp([at(0, 1.8), at(60, 1.8), at(60, 10), at(0, 10)])}" fill="url(#mottle)" opacity="0.45"/>`);
  for (let i = 0; i < 9; i++) { const X0 = -26 + i * 6 + R(), wv = [], peel = i % 2 === 0; for (let k = 0; k <= 20; k++) wv.push(P(X0 + k * 0.22, 2.5 + Math.sin(k * 1.1) * 0.12, ZB)); raw(line(wv, 1.4, fog('#6a8a8a', ZB), 0.6));
    for (let b = 0; b < 3; b++) { const bx = X0 + 0.8 + b * 1.4 + R() * 0.3, h0 = P(bx, 2.6, ZB), hd = P(bx, 3.35, ZB); raw(`<path d="M${f1(h0[0] - 3)} ${f1(h0[1])} Q${f1(h0[0] - 4)} ${f1(hd[1] + 6)} ${f1(hd[0])} ${f1(hd[1] + 4)} Q${f1(h0[0] + 4)} ${f1(hd[1] + 6)} ${f1(h0[0] + 3)} ${f1(h0[1])} Z" fill="${fog('#a87a68', ZB)}" opacity="0.7" stroke="${fog('#4a2a24', ZB)}" stroke-width="0.6"/><circle cx="${f1(hd[0])}" cy="${f1(hd[1])}" r="${f1(K(ZB) * 0.11)}" opacity="0.7" fill="${fog('#a87a68', ZB)}" stroke="${fog('#5a3a30', ZB)}" stroke-width="0.6"/>`); }
    // a sheet of the painted plaster peeling down off the wall, curled, its back showing, the raw plaster behind it pinker
    if (!peel) continue;
    const px = X0 + 2 + R() * 2, py = 3.0 + R() * 0.6, a = P(px, py + 0.7, ZB - 0.02), b = P(px + 1.0, py + 0.8, ZB - 0.02), c = P(px + 0.9, py - 0.2, ZB - 0.25), d = P(px + 0.1, py - 0.3, ZB - 0.25);
    raw(`<path d="${p2([a, b, P(px + 1.0, py - 0.1, ZB), P(px, py - 0.05, ZB)])}" fill="${fog('#a8685a', ZB)}" opacity="0.9"/>` + cel([a, b, c, d], { Z: ZB, fill: fog('#7a5a50', ZB), band: 2 }) + `<path d="${p2([a, b, c, d])}" fill="${S.hatchA(ZB)}" opacity="0.4"/><path d="M${f1(c[0])} ${f1(c[1])} Q${f1((c[0] + d[0]) / 2)} ${f1(c[1] + 6)} ${f1(d[0])} ${f1(d[1])}" stroke="${INK}" stroke-width="0.9" fill="${fog('#9a7a6a', ZB)}"/>`); }
  raw(hatch3(at, 0, 60, 4.5, 10, 0.6, { op: 0.4, ragged: 0.3 }) + hatch3(at, 0, 60, 0, 3, -0.7, { op: 0.35, ragged: 0.3 }));
  // the apse of the spring, behind the middle bay: a semicircular niche, the conch over it gilded with the temple's waves
  // (holy), the bronze lip pouring into the basin; clay votives hung thick round it on nails and cords
  const ax = 0, aw = 1.5, ay = 3.8;
  const arc = []; for (let k = 0; k <= 16; k++) { const a = Math.PI - k / 16 * Math.PI; arc.push(P(ax + Math.cos(a) * aw, ay + Math.sin(a) * aw * 0.9, ZB)); }
  const niche = [P(ax - aw, 0.6, ZB), ...arc, P(ax + aw, 0.6, ZB)];
  raw(`<path d="${p2(niche)}" fill="#3a2422"/><path d="${p2(niche)}" fill="${S.hatchA(ZB)}" opacity="0.5"/>`);
  { const cid = S.id('ap'); raw(`<clipPath id="${cid}"><path d="${p2(niche)}"/></clipPath><g clip-path="url(#${cid})">`); for (let k = 0; k < 9; k++) { const a = Math.PI * (k + 0.5) / 9, c = P(ax, ay, ZB); raw(`<path d="M${f1(c[0])} ${f1(c[1])} L${f1(c[0] + Math.cos(a) * K(ZB) * aw * 1.1)} ${f1(c[1] - Math.sin(a) * K(ZB) * aw)}" stroke="${GILT}" stroke-width="${f1(K(ZB) * 0.1)}" opacity="0.55"/><path d="M${f1(c[0])} ${f1(c[1])} L${f1(c[0] + Math.cos(a) * K(ZB) * aw * 1.1)} ${f1(c[1] - Math.sin(a) * K(ZB) * aw)}" stroke="${INK}" stroke-width="0.6" opacity="0.6"/>`); } raw('</g>'); }
  raw(`<path d="${p2(niche)}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  { const wv = []; for (let k = 0; k <= 16; k++) { const a = Math.PI - k / 16 * Math.PI; wv.push(P(ax + Math.cos(a) * (aw + 0.18), ay + Math.sin(a) * (aw + 0.18) * 0.9 + Math.sin(k * 2) * 0.04, ZB)); } raw(line(wv, K(ZB) * 0.16, INK, 1) + line(wv, K(ZB) * 0.11, GILT, 0.9) + line(wv.map(([x, y]) => [x - 0.5, y - 0.8]), 0.6, '#f0e0a0', 0.6)); }
  // basin and spout: the bronze lip, verdigris-free but heat-blackened; water falling in a thick rope, steaming
  { const sp = P(ax, 2.4, ZB - 0.1); raw(cel([[sp[0] - 6, sp[1] - 3], [sp[0] + 6, sp[1] - 3], [sp[0] + 4, sp[1] + 3], [sp[0] - 4, sp[1] + 3]], { Z: ZB, fill: '#4a3a22' }));
    raw(`<path d="M${f1(sp[0] - 2.5)} ${f1(sp[1] + 3)} Q${f1(sp[0] - 3)} ${f1(sp[1] + 30)} ${f1(sp[0] - 2)} ${f1(P(0, 0.9, ZB)[1])} L${f1(sp[0] + 2)} ${f1(P(0, 0.9, ZB)[1])} Q${f1(sp[0] + 3)} ${f1(sp[1] + 30)} ${f1(sp[0] + 2.5)} ${f1(sp[1] + 3)} Z" fill="#b8c8b8" opacity="0.85" stroke="${mix('#b8c8b8', INK, 0.5)}" stroke-width="0.6"/>`);
    const b0 = P(ax - 1.1, 0.5, ZB - 0.5), b1 = P(ax + 1.1, 0.95, ZB - 0.5); raw(cel([[b0[0], b1[1]], [b1[0], b1[1]], [b1[0] - 4, b0[1]], [b0[0] + 4, b0[1]]], { Z: ZB, fill: fog(MARB, ZB), tex: 'url(#mottle)', texOp: 0.3 }));
    raw(G.softSteam(sp[0], P(0, 1.0, ZB)[1], 70, 16, { n: 6, op: 0.25, drift: -0.1 })); }
  const kinds = ['leg', 'arm', 'hand', 'foot', 'baby'];
  for (let i = 0; i < 46; i++) { const a = R() * Math.PI, rr = aw + 0.35 + R() * 1.0, X = ax + Math.cos(a) * rr * 1.15, Y = ay - 1.2 + Math.sin(a) * rr * 1.1 + (R() < 0.4 ? -R() * 1.4 : 0); if (Math.abs(X) < aw + 0.25 && Y < ay + 1.2) continue; const [x, y] = P(X, Y, ZB - 0.05); raw(votive(x, y, K(ZB) * (0.2 + R() * 0.1), kinds[Math.floor(R() * 5)], { Z: ZB })); }
  // the arch to the seventh pool, at the right: dark, steam rolling out of it, its bronze plaque stamped VII
  { const x0 = 11.2, x1 = 14.0, yt = 3.0, arc2 = []; for (let k = 0; k <= 12; k++) { const a = Math.PI - k / 12 * Math.PI; arc2.push(P((x0 + x1) / 2 + Math.cos(a) * (x1 - x0) / 2, yt + Math.sin(a) * (x1 - x0) / 2, ZB)); }
    const op = [P(x0, 0, ZB), ...arc2, P(x1, 0, ZB)]; raw(`<path d="${p2(op)}" fill="#1c1212"/><path d="${p2(op)}" fill="${S.hatchB(ZB)}" opacity="0.5"/><path d="${p2(op)}" fill="none" stroke="${INK}" stroke-width="1.3"/>`);
    for (let k = 0; k < 7; k++) { const a = Math.PI - (k + 0.5) / 7 * Math.PI, A = P((x0 + x1) / 2 + Math.cos(a) * (x1 - x0) / 2, yt + Math.sin(a) * (x1 - x0) / 2, ZB), B = P((x0 + x1) / 2 + Math.cos(a) * ((x1 - x0) / 2 + 0.4), yt + Math.sin(a) * ((x1 - x0) / 2 + 0.4), ZB); raw(`<path d="M${f1(A[0])} ${f1(A[1])} L${f1(B[0])} ${f1(B[1])}" stroke="${INK}" stroke-width="0.9"/>`); }
    const pl = P((x0 + x1) / 2, yt + 1.85, ZB - 0.05); raw(cel([[pl[0] - 16, pl[1] - 8], [pl[0] + 16, pl[1] - 8], [pl[0] + 16, pl[1] + 8], [pl[0] - 16, pl[1] + 8]], { Z: ZB, fill: BRONZE, band: 2 }) + `<path d="M${f1(pl[0] - 11)} ${f1(pl[1] - 5)} l3 10 l3 -10 M${f1(pl[0] - 1.5)} ${f1(pl[1] - 5)} l0 10 M${f1(pl[0] + 4)} ${f1(pl[1] - 5)} l0 10 M${f1(pl[0] + 9.5)} ${f1(pl[1] - 5)} l0 10" stroke="${INK}" stroke-width="1.6"/><path d="M${f1(pl[0] - 15)} ${f1(pl[1] - 7)} l30 0" stroke="#d8b878" stroke-width="0.7" opacity="0.5"/>`);
    raw(G.softSteam((op[3][0] + op[9][0]) / 2, P(0, 0.8, ZB)[1], 90, 34, { n: 6, op: 0.22, drift: -0.2 })); }
  // the copper hot-water mains along the wall, cooked red-brown, bandaged with rags where they leak
  raw(pipe([P(-30, 1.95, ZB - 0.2), P(-3, 1.95, ZB - 0.2), P(-2.2, 1.6, ZB - 0.2), P(-1.6, 1.6, ZB - 0.2)], K(ZB) * 0.13, { rags: [0.25, 0.6] }) + pipe([P(1.6, 1.7, ZB - 0.2), P(10.6, 1.7, ZB - 0.2), P(10.8, 4.2, ZB - 0.2), P(30, 4.2, ZB - 0.2)], K(ZB) * 0.13, { rags: [0.4, 0.85] }));
  // the vault over the ambulatory and pool, coffered, lost in collected steam
  const atV = (s, t) => [-30 + s, 7.4 + t * 0.15, ZC - 2 + t];
  raw(`<path d="${pp([atV(0, 0), atV(60, 0), atV(60, ZB - ZC + 2), atV(0, ZB - ZC + 2)])}" fill="${fog('#6a4a44', 18)}"/>`);
  for (let X = -30; X < 30; X += 1.5) for (let t = 0.4; t < ZB - ZC + 1; t += 1.5) { const q = [atV(X + 30 + 0.2, t), atV(X + 31.3, t), atV(X + 31.3, t + 1.1), atV(X + 30 + 0.2, t + 1.1)].map(p => P(...p)); raw(`<path d="${p2(q)}" fill="${fog('#4a302c', 18)}" stroke="${INK}" stroke-width="0.6"/>`); }
  raw(hatch3(atV, 0, 60, 0, ZB - ZC + 2, 0.4, { op: 0.4 }));
}
// ---- the colonnade: columns on a podium step at the pool's far edge, an entablature over them with a meander frieze
{
  const at = (s, t) => [-30 + s, t, ZC];
  // entablature: architrave, frieze (meander in rubric red and black), cornice; heat-stained, a crack across a block
  raw(marble((s, t) => [-30 + s, CH + 0.15 + t, ZC - 0.1], 60, 0.5, fog(MARB, ZC), { rows: 0.5, slab: 3.2 }));
  raw(cel([P(-30, CH + 0.65, ZC - 0.1), P(30, CH + 0.65, ZC - 0.1), P(30, CH + 1.25, ZC - 0.1), P(-30, CH + 1.25, ZC - 0.1)], { Z: ZC, fill: fog('#c8b0a8', ZC), tex: 'url(#mottle)', texOp: 0.3 }));
  { let mq = ''; for (let X = -30; X < 30; X += 0.6) { const a = P(X, CH + 0.75, ZC - 0.12), b = P(X + 0.45, CH + 1.15, ZC - 0.12); mq += `M${f1(a[0])} ${f1(b[1])} L${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1] + (a[1] - b[1]) * 0.3)} L${f1(a[0] + (b[0] - a[0]) * 0.35)} ${f1(b[1] + (a[1] - b[1]) * 0.3)} L${f1(a[0] + (b[0] - a[0]) * 0.35)} ${f1(b[1] + (a[1] - b[1]) * 0.6)} `; } raw(`<path d="${mq}" stroke="${BOIL}" stroke-width="1.6" fill="none" opacity="0.8"/><path d="${mq}" stroke="${INK}" stroke-width="0.5" fill="none" opacity="0.6"/>`); }
  raw(cel([P(-30, CH + 1.25, ZC - 0.35), P(30, CH + 1.25, ZC - 0.35), P(30, CH + 1.5, ZC - 0.35), P(-30, CH + 1.5, ZC - 0.35)], { Z: ZC, fill: fog('#d8c4bc', ZC) }));
  raw(hatch3((s, t) => [-30 + s, CH + 0.15 + t, ZC - 0.1], 0, 60, 0, 0.5, 0.5, { op: 0.35 }));
  raw(crack((s, t) => [-30 + s, CH + 0.15 + t, ZC - 0.12], 24.3, 1.0, 0.8, -1.2, { w: 0.9 }) + crack((s, t) => [-30 + s, CH + 0.15 + t, ZC - 0.12], 37.6, 1.2, 0.9, -1.6, { w: 0.9 }));
  // the podium step at the far side of the pool: the cooked red tide line and the scale crust under it
  raw(marble((s, t) => [-30 + s, -0.12 + t, ZC - 1.0], 60, 0.5, fog('#9a8480', ZC), { rows: 0.25, slab: 1.4, craze: 0.4 }));
  { const pts = []; for (let k = 0; k <= 60; k++) pts.push(P(-30 + k, 0.08 + Math.sin(k * 1.7) * 0.03, ZC - 1.02)); raw(line(pts, K(ZC) * 0.06, BOIL, 0.6) + line(pts.map(([x, y]) => [x, y + 3]), K(ZC) * 0.08, SCALE, 0.5)); }
  for (const X of COLS) raw(column(X, ZC, CH, CR, { tide: -0.1, peel: R() < 0.4 ? 0.35 + R() * 0.3 : 0 }));
}
// ---- the great pool between: milky, green, boiling; bubbles bursting in rings, scum of scale drifting, steam rising
{
  raw(BK.water(-30, 30, 8.8, ZC - 1.0, WATER, { y: -0.12, n: 300, lite: '#c8d8c8' }));
  for (let i = 0; i < 70; i++) { const X = -16 + R() * 32, Z = 9.2 + R() * 7.6, [x, y] = P(X, -0.12, Z), r = K(Z) * (0.05 + R() * 0.12); raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.55)}" fill="${mix(WATER, '#e8f0e8', 0.5)}" stroke="${mix(WATER, INK, 0.5)}" stroke-width="0.5" opacity="0.8"/><path d="M${f1(x - r * 0.5)} ${f1(y - r * 0.3)} a${f1(r * 0.5)} ${f1(r * 0.3)} 0 0 1 ${f1(r * 0.6)} ${f1(-r * 0.15)}" stroke="#ffffff" stroke-width="0.5" fill="none" opacity="0.7"/>`); if (R() < 0.3) raw(BK.ripples(x, y, r * 4, 2, '#e0e8e0', 0.4)); }
  for (let i = 0; i < 9; i++) { const X = -15 + R() * 30, Z = 9.5 + R() * 7, [x, y] = P(X, -0.12, Z); raw(stain(x, y, K(Z) * (0.3 + R() * 0.4), SCALE, 0.35)); }
}
// ---- round 2: the pool in perspective. It is narrower than the hall: marble surrounds run back along both sides of it,
// their copings receding to the colonnade; broad steps go down into the water at the near left; the apse's shaft of light
// lies on the water as a bright broken glade
{
  const PX0 = -8.6, PX1 = 11.4, z0 = 8.8, z1 = ZC - 1.0;
  for (const [x0, x1] of [[-30, PX0], [PX1, 30]]) { raw(marble((s2, t) => [x0 + s2, 0, z0 + t], x1 - x0, z1 - z0, fog('#7e6a64', 13), { rows: 1.2, slab: 1.6, craze: 0.35, vary: 0.12 }) + hatch3((s2, t) => [x0 + s2, 0, z0 + t], 0, x1 - x0, 0, z1 - z0, 0.3, { op: 0.25 })); }
  // the side copings: a raised marble kerb along each side, its inner face down into the water shaded, scale crust on it
  for (const [X, sd] of [[PX0, 1], [PX1, -1]]) { const top = [P(X, 0.12, z0), P(X, 0.12, z1)], lip = [P(X, -0.12, z0), P(X, -0.12, z1)], back = [P(X - sd * 0.45, 0.12, z1), P(X - sd * 0.45, 0.12, z0)];
    raw(cel([top[0], top[1], back[0], back[1]], { Z: 12, fill: fog('#c8b4ac', 12), band: 1 }) + cel([top[0], top[1], lip[1], lip[0]], { Z: 12, fill: fog(sd > 0 ? '#7a6460' : '#a08a84', 12), band: 1 }) + (sd > 0 ? `<path d="${p2([top[0], top[1], lip[1], lip[0]])}" fill="${S.hatchA(12)}" opacity="0.45"/>` : '') + line(lip, 2, SCALE, 0.5));
    raw(line([P(X, -0.06, z0), P(X, -0.06, z1)], K(12) * 0.06, BOIL, 0.5)); }
  // steps down into the pool at the near left: three broad treads under the milky water, paler as they come up
  for (let k = 0; k < 3; k++) { const y = -0.12 - k * 0.25, za = z0 + k * 0.45, q = [P(PX0, y + 0.002, za), P(PX0 + 6, y + 0.002, za), P(PX0 + 6, y + 0.002, za + 0.45), P(PX0, y + 0.002, za + 0.45)]; raw(`<path d="${p2(q)}" fill="${mix(WATER, '#e8f0e0', 0.35 - k * 0.1)}" opacity="0.5"/>` + line([q[3], q[2]], 1, mix(WATER, INK, 0.4), 0.5)); }
  // the shaft's glade on the water: warm broken light under the apse
  for (let k = 0; k < 90; k++) { const z = 9 + Math.pow(R(), 0.7) * 8, X = (R() - 0.5) * (1.5 + (z1 - z) * 0.25), [x, y] = P(X, -0.11, z), l = K(z) * (0.2 + R() * 0.6); raw(S.GLOW(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="#fff0d4" stroke-width="${f1(Math.max(0.6, K(z) * 0.02))}" opacity="${f1(0.3 + R() * 0.4)}"/>`)); }
}
// ---- the quiet band behind the fighters, then steam: rising in columns off the pool and collecting under the vault in a
// thick ceiling layer (detail above the fighters' heads is veiled, the band itself stays low-contrast)
raw(BK.quiet(MURK, 232, 350, { steps: [0.22, 0.22, 0.24, 0.26], hop: 0.2 }));
// last touch-up: the steam thinned so the colonnade reads: wisps off the pool, a thin layer only up under the vault
for (let i = 0; i < 9; i++) raw(G.softSteam(60 + i * 165 + R() * 60, 350, 200 + R() * 60, 16 + R() * 10, { n: 8, op: 0.045, inkOp: 0.06, drift: 0.08 }));
for (let i = 0; i < 2; i++) raw(G.softBank(-10, W + 10, 34 + i * 20, 30, { col: STEAM, op: 0.11, ph: i * 2, below: 20, soft: true }));
for (const x of [250, 1010, 1330]) { raw(G.softSteam(x, 236, 170, 34, { n: 7, op: 0.08, inkOp: 0.12, drift: 0.15 })); }
// ---- round 2: steam in depth (thin and pale far, thicker near), then the light focus: afternoon sun down the apse's oculus
// onto the spring, a warm shaft through the steam; the conch lit; the frame's edges dark
for (const [y, h, op, ph] of [[264, 14, 0.07, 1], [246, 20, 0.05, 3]]) raw(G.softBank(-10, W + 10, y, h, { col: STEAM, op, ph, below: h * 0.6, soft: true }));
{ const c = P(0, 4.6, ZB); raw(G.shaft(c[0] - 46, -10, 92, c[1] + 10 + 120, 0.08, '#fff2d8', { op: 0.42, fill: 0.16, spread: 40, gap: 3.5 }) + G.shaft(c[0] - 18, -10, 36, c[1] + 140, 0.06, '#fffaf0', { op: 0.4, fill: 0.14, spread: 14, gap: 3 }));
  raw(glow(c[0], c[1] + 10, 150, 120, '#ffe8c8', 0.3) + glow(c[0], P(0, 1, ZB)[1], 90, 40, '#fff0d8', 0.3)); }
raw(G.edges('#1e1212', { l: 240, r: 240, t: 70, steps: [0.18, 0.2, 0.22, 0.24] }));
// ---- the surround the company stands on: marble slabs, heat-crazed, two lifted and tilted by the heat with the
// hypocaust's fire glowing up through the gaps; a meander mosaic border at the pool's edge; wet; drag marks from VII
{
  const Zr = 8.8, at = (s, t) => [-18 + s, 0, 3.5 + t];
  raw(marble(at, 36, Zr - 3.5 - 0.5, '#86706a', { rows: 1.1, slab: 1.5, craze: 0.45, vary: 0.12 }));
  // the mosaic border by the pool: a band of tesserae with a running-wave pattern, black and boiled red on bone
  { const bt = Zr - 0.5; raw(`<path d="${pp([[-18, 0, bt], [18, 0, bt], [18, 0, Zr], [-18, 0, Zr]])}" fill="#d0bca8"/>`); let wv = ''; for (let X = -18; X < 18; X += 0.5) { const a = P(X, 0, bt + 0.4), b = P(X + 0.25, 0, bt + 0.1), c = P(X + 0.5, 0, bt + 0.4); wv += `M${f1(a[0])} ${f1(a[1])} Q${f1(b[0])} ${f1(b[1] - 2)} ${f1(c[0])} ${f1(c[1])} `; } raw(`<path d="${wv}" stroke="${BOIL}" stroke-width="1.6" fill="none" opacity="0.75"/><path d="${wv}" stroke="${INK}" stroke-width="0.4" fill="none"/>`);
    raw(hatch3((s, t) => [-18 + s, 0, bt + t], 0, 36, 0, 0.5, 1.4, { op: 0.25, gap: 0.6 })); }
  // the near lip of the pool: the coping's edge, wet, scale crusting over it
  { const pts = []; for (let k = 0; k <= 40; k++) pts.push(P(-18 + k * 0.9, 0, Zr)); raw(line(pts, 2, INK, 1) + line(pts.map(([x, y]) => [x, y + 1.5]), 1.2, SCALE, 0.5)); }
  // lifted slabs over the hypocaust: tilted up, the dark gap under them glowing (the fire beneath), heat shimmer of steam
  for (const [X, Z, w, d] of [[-6.8, 7.0, 1.3, 0.9], [8.4, 6.9, 1.1, 0.8], [-1.6, 7.6, 0.9, 0.6]]) {
    const gap = [P(X, 0, Z), P(X + w, 0, Z), P(X + w, 0, Z + d), P(X, 0, Z + d)]; raw(`<path d="${p2(gap)}" fill="#1a0a06"/>` + EM(`<path d="${p2(gap.map(([x, y], i) => [x + (i % 3 ? -2 : 2), y + (i < 2 ? -1 : 1)]))}" fill="${HOT}" opacity="0.55"/>`) + glow((gap[0][0] + gap[1][0]) / 2, gap[0][1] - 3, K(Z) * w * 0.7, K(Z) * 0.3, HOT, 0.25));
    raw(cel([P(X, 0, Z), P(X + w, 0, Z), P(X + w, d * 0.35, Z + d * 0.85), P(X, d * 0.3, Z + d * 0.88)], { Z, fill: '#9a827c', tex: 'url(#mottle)', texOp: 0.3 }));
    raw(crack((s, t) => [X + s, 0.001, Z + t], -0.1, d * 0.5, 1.2, 3.3, { w: 0.9, lip: '#f8c890' }));
    raw(G.softSteam((gap[0][0] + gap[1][0]) / 2, gap[0][1] - 4, 40, 10, { n: 4, op: 0.12 })); }
  // glowing seams in the worst cracks of the floor
  for (let i = 0; i < 12; i++) { const X = -13 + R() * 26, Z = 4.2 + R() * 4.2, pts = []; let s = X, t = Z; for (let k = 0; k < 8; k++) { pts.push(P(s, 0.001, t)); s += (R() - 0.5) * 0.5 + 0.22; t += (R() - 0.5) * 0.3; } raw(glow(pts[3][0], pts[3][1], K(Z) * 0.9, K(Z) * 0.2, HOT, 0.18) + line(pts, 3, INK, 0.9) + EM(line(pts, 1.2, HOT, 0.85) + line(pts, 0.5, '#ffe0a0', 0.8))); }
  // wet: the sheen of standing water, scale rings where puddles dried; the drag marks from the seventh pool, wet and pink
  for (let i = 0; i < 22; i++) { const X = -14 + R() * 28, Z = 4 + R() * 5.5, [x, y] = P(X, 0, Z), l = K(Z) * (0.3 + R() * 0.8); raw(`<path d="M${f1(x - l / 2)} ${f1(y)} l${f1(l)} 0" stroke="#fff0ea" stroke-width="${f1(Math.max(0.5, K(Z) * 0.012))}" opacity="0.35"/>`); }
  for (let k = 0; k < 4; k++) { const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10; pts.push(P(12.6 - u * 5 + k * 0.4 + Math.sin(u * 4 + k) * 0.2, 0.001, 8.6 - u * 2.6 + k * 0.08)); } raw(line(pts, K(9) * (0.12 + R() * 0.08), '#b87a70', 0.35) + line(pts, 0.6, INK, 0.35)); }
  raw(occBand((s, t) => [-18 + s, 0, Zr - 0.5 - t], 36, 1.2, { op: 0.25 }));
  for (const X of COLS) { const [x] = P(X, 0, ZC); for (let y = 300 + 652 * 1.2 / Zr + 2; y < 470; y += 2.5 + R() * 3) { const w = 6 + R() * 6; raw(`<path d="M${f1(x * 0.9 + 74 - w / 2 + (R() - 0.5) * 4)} ${f1(y)} l${f1(w)} 0" stroke="#d8c8c0" stroke-width="0.8" opacity="${f1(0.08 + R() * 0.12)}"/>`); } }
  raw(hatch3(at, 0, 36, 0, 2.2, 0.3, { op: 0.35, ragged: 0.3 }) + hatch3(at, 0, 36, 0, 1.2, -0.7, { op: 0.3, ragged: 0.4 }));
  for (let i = 0; i < 14; i++) { const X = -13 + R() * 26, Z = 4 + R() * 4.5; raw(crack((s, t) => [s, 0.001, t], X, Z, 0.6 + R() * 0.8, R() * 6.28, { w: 0.8, lip: '#e8d0c8' })); }
  for (let i = 0; i < 10; i++) { const X = -13 + R() * 26, Z = 4 + R() * 4.5, [x, y] = P(X, 0, Z); raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(K(Z) * (0.3 + R() * 0.4))}" ry="${f1(K(Z) * 0.06)}" fill="none" stroke="${SCALE}" stroke-width="1" opacity="0.35" stroke-dasharray="5 2 2 3"/>`); }
}

// ======================================================================== MID: low things on the surround behind the fighters
layer('mid');
{
  // a heap of bath sheets dropped wet by the pool; wooden bath clogs; a broken oil flask, its oil spread; a bronze strigil;
  // a dead kettle crab, cooked red-pink on its back; a pilgrim's crutch with a cord of votives; all low and soft
  const Z = 8.2, k = K(Z);
  { const c = P(-7.6, 0, Z), pts = [[c[0] - k * 0.7, c[1]], [c[0] - k * 0.5, c[1] - k * 0.25], [c[0] - k * 0.1, c[1] - k * 0.32], [c[0] + k * 0.3, c[1] - k * 0.22], [c[0] + k * 0.75, c[1] - k * 0.05], [c[0] + k * 0.8, c[1]]];
    raw(cel(pts, { Z, fill: '#a89a90', tex: 'url(#mottle)', texOp: 0.45, band: 2 })); for (let j = 0; j < 4; j++) raw(`<path d="M${f1(c[0] - k * 0.5 + j * k * 0.3)} ${f1(c[1] - k * 0.2)} q${f1(k * 0.1)} ${f1(k * 0.08)} ${f1(k * 0.05)} ${f1(k * 0.2)}" stroke="${INK}" stroke-width="0.6" fill="none"/>`); }
  for (const [X, a] of [[-5.6, 0.2], [-5.2, -0.4]]) { const c = P(X, 0, Z - 0.4); raw(`<g transform="rotate(${f1(a * 57)} ${f1(c[0])} ${f1(c[1])})">` + cel([[c[0] - k * 0.13, c[1]], [c[0] + k * 0.13, c[1]], [c[0] + k * 0.12, c[1] - k * 0.06], [c[0] - k * 0.13, c[1] - k * 0.05]], { Z, fill: '#5a4430' }) + `</g>`); }
  { const c = P(3.0, 0, Z + 0.3); raw(`<path d="${smooth([[c[0] - 6, c[1]], [c[0] - 4, c[1] - 6], [c[0] + 2, c[1] - 7], [c[0] + 9, c[1] - 3], [c[0] + 8, c[1]]], true, 0.5)}" fill="#7a5a3a" stroke="${INK}" stroke-width="0.7"/>` + stain(c[0] + 14, c[1] + 1, 12, '#3a2a1a', 0.35)); }
  { const a = P(4.4, 0.02, Z - 0.2), b = P(5.0, 0.02, Z - 0.5); raw(`<path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2 + 4)} ${f1(a[1] - 7)} ${f1(b[0])} ${f1(b[1])}" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2 + 4)} ${f1(a[1] - 7)} ${f1(b[0])} ${f1(b[1])}" stroke="${BRONZE}" stroke-width="1.6" fill="none"/>`); }
  { const c = P(-1.8, 0, Z + 0.5), kk = K(Z + 0.5); raw(cel(ell([c[0], c[1] - kk * 0.08], kk * 0.22, kk * 0.1, 0, 12), { Z, fill: '#c87a6a', band: 1.5 })); for (let j = 0; j < 6; j++) { const a = Math.PI + 0.3 + j * 0.45; raw(`<path d="M${f1(c[0] + Math.cos(a) * kk * 0.18)} ${f1(c[1] - kk * 0.12)} l${f1(Math.cos(a) * kk * 0.12)} ${f1(-kk * 0.1)} l${f1(Math.cos(a) * kk * 0.05)} ${f1(kk * 0.06)}" stroke="${INK}" stroke-width="1.3" fill="none"/>`); } }
  { const a = P(6.4, 0.03, Z - 0.6), b = P(7.9, 0.08, Z - 0.3); raw(line([a, b], 3, INK, 1) + line([a, b], 1.6, '#6a5038', 1)); for (let j = 0; j < 4; j++) raw(votive(a[0] + (b[0] - a[0]) * (0.3 + j * 0.15), a[1] + 1, 4, ['leg', 'hand', 'foot', 'baby'][j], { Z })); }
}

// ======================================================================== FORE: framing over the fighters
layer('fore');
{
  // two near columns at the frame's edges (in shadow, close), a line of bath sheets strung between them across the top,
  // steaming; the left column carries a rack of strigils and oil flasks on a cord; the right a copper pipe bandaged in rags
  const ZN = 4.4;
  raw(column(-4.72, ZN, 7, 0.36, { col: '#a08888', tide: 0.35 }) + column(4.95, ZN, 7, 0.36, { col: '#a08888', tide: 0.3, peel: 0.55 }));
  raw(`<rect x="0" y="0" width="${W}" height="${H}" fill="none"/>`);
  for (const X of [-4.72, 4.95]) { const a = P(X - 0.36, 0, ZN), b = P(X + 0.36, 7, ZN); raw(`<path d="${p2([[a[0] - 10, a[1]], [b[0] + 10, a[1]], [b[0] + 10, b[1]], [a[0] - 10, b[1]]])}" fill="#3a2020" opacity="0.35"/>`); }
  // the soffit of the near arch across the top: dark marble in shadow, dripping; lime scale hanging from it in little
  // stalactites (water's mark) and a fringe of condensation drops
  { const bot = []; for (let x = -10; x <= W + 10; x += 30) bot.push([x, 26 + Math.sin(x * 0.004) * 4]);
    raw(`<path d="${p2([[-10, -10], [W + 10, -10], ...bot.slice().reverse()])}" fill="#3a2a2a"/><path d="${p2([[-10, -10], [W + 10, -10], ...bot.slice().reverse()])}" fill="url(#mottle)" opacity="0.5"/><path d="${p2([[-10, -10], [W + 10, -10], ...bot.slice().reverse()])}" fill="${S.hatchA(3)}" opacity="0.45"/>`);
    raw(line(bot, 2.4, INK, 1) + line(bot.map(([x, y]) => [x, y - 4]), 0.8, '#8a7470', 0.5));
    for (let i = 0; i < 60; i++) { const x = R() * W, y = 26 + Math.sin(x * 0.004) * 4; raw(BK.icicle(x, y - 1, 4 + Math.pow(R(), 2) * 22, 2 + R() * 3, { col: SCALE, ink: 0.5 })); }
    for (let i = 0; i < 40; i++) { const x = R() * W, y = 34 + R() * 60; raw(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="0.9" ry="1.5" fill="#e8f0f0" opacity="0.5"/>`); } }
  // a pilgrim's cord of clay votives tied round the left column: legs, arms, hands, feet and a swaddled baby, cracked
  { const c = P(-4.72, 2.35, ZN - 0.4), kinds = ['leg', 'hand', 'baby', 'arm', 'foot', 'leg', 'hand']; raw(line([[c[0] - 40, c[1] - 6], [c[0] + 30, c[1] + 6]], 1.4, '#8a7a58', 1));
    kinds.forEach((kd, j) => raw(votive(c[0] - 34 + j * 11, c[1] - 4 + j * 1.7 + 10, 14 + R() * 5, kd, { Z: ZN, col: '#9a6040' }))); }
  // strigils and oil flasks on a cord round the left column
  { const c = P(-4.72, 1.5, ZN - 0.4); for (let j = 0; j < 4; j++) { const x = c[0] - 26 + j * 14, y = c[1] + (j % 2) * 4; raw(`<path d="M${f1(x)} ${f1(y)} q-8 14 2 34" stroke="${INK}" stroke-width="4.4" fill="none"/><path d="M${f1(x)} ${f1(y)} q-8 14 2 34" stroke="${BRONZE}" stroke-width="2.6" fill="none"/><path d="M${f1(x - 1)} ${f1(y + 3)} q-6 12 1 26" stroke="#d8b878" stroke-width="0.8" fill="none" opacity="0.6"/>`); } raw(line([[c[0] - 32, c[1] - 2], [c[0] + 20, c[1] + 4]], 1.2, '#8a7a58', 1)); }
  raw(pipe([[W + 10, 150], [P(4.95, 0, ZN)[0] + 30, 150], [P(4.95, 0, ZN)[0] + 30, H + 10]], 9, { rags: [0.3, 0.75] }));
  // bottom corners: a cracked amphora on its side with water running out, a dead lapdog's velvet collar, scale crust
  raw(`<path d="${smooth([[-10, H + 2], [30, H - 22], [140, H - 16], [220, H + 2]], true, 0.6)}" fill="#4a3232" stroke="${INK}" stroke-width="1.4"/><path d="${smooth([[W + 10, H + 2], [W - 50, H - 22], [W - 160, H - 12], [W - 230, H + 2]], true, 0.6)}" fill="#4a3232" stroke="${INK}" stroke-width="1.4"/>`);
  { const c = [W - 120, H - 24]; raw(cel([[c[0] - 40, c[1]], [c[0] - 30, c[1] - 18], [c[0] + 20, c[1] - 22], [c[0] + 42, c[1] - 12], [c[0] + 46, c[1] - 4], [c[0] + 20, c[1] + 6], [c[0] - 30, c[1] + 6]], { Z: 4, fill: '#8a5038', tex: 'url(#mottle)', texOp: 0.5, band: 3 }) + `<path d="M${f1(c[0] - 10)} ${f1(c[1] - 20)} l8 10 l-4 12" stroke="${INK}" stroke-width="1.2" fill="none"/>` + G.softSteam(c[0] + 40, c[1] - 10, 50, 14, { n: 4, op: 0.16 })); }
  raw(BK.sulphur(70, H - 14, 40, 14, { col: SCALE, size: 3 }));
}

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM + ' layers written');
