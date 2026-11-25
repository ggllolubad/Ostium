// World XI, the Stilled Spire: THE CLOCKWORK STAIR (`spire_stair`, round 2, new). Battle room, Living Ink.
// Place: a landing on the great stair that winds up the spire's shaft to the clock at the top, where the Horologist keeps
// his study (bible XI: clock sentries mark time on every landing; frozen halberdiers finish their patrol; the Horologist,
// the last astronomer, keeps the hours from moving; the Last Hour hangs at the top; the speculum bearer carried glass up
// this stair). Encounters: the Clockwork Stair (sentries on every landing), the Horologist's Study (he has been waiting).
// Kind of space: a tall narrow shaft. The stair climbs the round wall in a helix across the frame and out of the top;
// the great clock's weight chains and pendulum hang down the middle of the shaft from out of sight.
// Light: one warm lamp. The Horologist's oil lamp hangs from the stair's soffit over the landing; it lights the brass
// faces of his clocks and the pendulum bob, warm; the shaft above goes up into cold blue dark.
// Shapes: diagonals (the helix of treads, its soffit overhead) against verticals (chains, the pendulum rod), and the
// round faces of a hundred stopped clocks.
// Palette key: warm and dark below (lamp amber on brass), cold blue-black above: the warm side of the world palette.
// Depth planes (far): the soffit of the turn overhead (near, 4-8 m); the pendulum, the weights and the lamp (8-11 m); the
// shaft wall with the stair rising on it and the clock wall (14-17 m), the shaft going up out of frame.
// Lore placed: the pendulum stopped at the end of its swing, not plumb (time stopped mid-beat); the weights hanging at
// different heights on fused chains; every clock on the study wall stopped at one minute to twelve, frosted; an empty
// sentry niche on the landing with its brass bracket; the stair's treads worn hollow by pilgrims; burns down the chains.
// Mid: the Horologist's bench (low, dark): a dismantled movement, a loupe, a candle; a basket of spare gears.
// Fore: top: the soffit of the next turn of the stair close overhead; left: the newel and a rail; right: a long-case
// clock at the frame edge, its door open, its pendulum gone.
// No eyes. No red. Brass olive-brown, never gold.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XI');
const ROOM = 'spire_stair', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 11301, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e1a20' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#0a0c12' });
const { line, pline, fillP, fillS, inkP, inkS, blob, box, post, icicles, rime, burn, fused, chain, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#0a0c12' });
const MV = require('./materials_v2')(S);
const { pool, frame, gear, joints } = G;

const BRASS = '#8c7c4c', BRASSD = '#54482a', BRASSL = '#c8b47a', FROST = '#d4e4ee', STONE = '#5e5c60', AUR = '#86e8b8', LAMP = '#ffd08a', AMB = '#e8a050', MURK = B.MURK, COLD = '#1a2436';
const RW = 8.5, ZC = 9.5;
const wallAt = (s, t) => [RW * Math.sin(s / RW), t, ZC + RW * Math.cos(s / RW)];
const LPOS = [-2.0, 3.3, 9.5], LP = P(...LPOS);
const lit = (x, y, r = 330) => Math.max(0, 1 - Math.hypot((x - LP[0]) / r, (y - LP[1]) / (r * 0.75)));
// warm near the lamp, cold and dark above it
const shade = (col, x, y, r = 330) => { const l = lit(x, y, r), up = Math.max(0, Math.min(1, (LP[1] - y) / 260)); return mix(mix(mix(col, COLD, 0.35 * up), MURK, 0.6 * (1 - l)), AMB, 0.22 * l * l); };
const burnA = (x, y, ang, len, w, o = {}) => burn(x, y, ang, len, w, Object.assign({ core: AUR, scorch: '#0c100e', coreOp: 0.5, haloOp: 0.3, branchP: 0.45, spread: 0.75 }, o));
// the helix: the stair's tread k at angle a, its riser foot at height Y (rising leftward from the right side)
const A0 = 2.1, DA = 0.075, RISE = 0.2, RIN = RW - 1.45;
const tread = k => ({ a: A0 - k * DA, Y: k * RISE });

// a clock face on the wall (round, its own size and rim), stopped at one minute to twelve, frosted
function clockFace(c, r, Z, o = {}) {
  let s = `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r * 1.18)}" fill="${shade(o.case || '#3a2e22', c[0], c[1])}" stroke="${INK}" stroke-width="${f1(Math.max(0.8, r * 0.08))}"/>`;
  s += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1(r)}" fill="${shade(o.dial || '#d8d0b8', c[0], c[1])}" stroke="${INK}" stroke-width="${f1(Math.max(0.6, r * 0.06))}"/>`;
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; s += pline([[c[0] + Math.cos(a) * r * 0.78, c[1] + Math.sin(a) * r * 0.78], [c[0] + Math.cos(a) * r * 0.92, c[1] + Math.sin(a) * r * 0.92]], Math.max(0.4, r * (k % 3 ? 0.04 : 0.08)), INK); }
  s += pline([c, [c[0] - r * 0.03, c[1] - r * 0.55]], Math.max(0.6, r * 0.09), INK) + pline([c, [c[0] - r * 0.09, c[1] - r * 0.85]], Math.max(0.5, r * 0.05), INK);
  if (r > 4) { let fr = ''; for (let k = 0; k < 8; k++) { const a = Math.PI * (0.5 + R() * 0.8), d = r * (0.5 + R() * 0.5), x = c[0] + Math.cos(a) * d, y = c[1] + Math.sin(a) * d, b = R() * 6.28, l = r * 0.25; fr += `M${f1(x)} ${f1(y)} l${f1(Math.cos(b) * l)} ${f1(Math.sin(b) * l)} `; } s += `<path d="${fr}" stroke="${FROST}" stroke-width="0.6" opacity="0.6"/>`; }
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the shaft wall: ashlar on the round, warm near the lamp, cold blue going up into the dark
{
  const sA = -20, sB = 20;
  { const cl = []; for (let k = 0; k <= 50; k++) cl.push(P(...wallAt(sA + (sB - sA) * k / 50, 0))); for (let k = 50; k >= 0; k--) cl.push(P(...wallAt(sA + (sB - sA) * k / 50, 22))); const cd = S.id('sw'); raw(`<clipPath id="${cd}"><path d="${p2(cl)}"/></clipPath><g clip-path="url(#${cd})">`); }
  // stones laid course by course, each tinted by the lamp and the height; weathered by materials v2 (frost, runs, cracks)
  const WXW = MV.begin((u, v) => wallAt(sA + u, v), sB - sA, 22);
  for (let t = 0, j = 0; t < 22; j++) { const h = [0.5, 0.36, 0.62, 0.44, 0.3, 0.56][j % 6] * (0.9 + R() * 0.2); let s = sA - R(); while (s < sB) { const w = 0.35 + Math.pow(R(), 1.5) * 1.9, lowS = R() < 0.3 ? h * (0.45 + R() * 0.2) : h; if (lowS < h) { const q2 = [wallAt(s + 0.03, t + lowS + 0.03), wallAt(s + w - 0.03, t + lowS + 0.03), wallAt(s + w - 0.03, t + h - 0.03), wallAt(s + 0.03, t + h - 0.03)].map(p => P(...p)), c2 = q2[0]; if (c2[1] > -40 && c2[1] < H + 20) raw(cel(chip(q2, 0.4), { Z: 15, fill: shade(S.tone('#4e4c50', 0.2), c2[0], c2[1]), band: 1, inkW: 0.5, hi: false })); }
      const q3 = [wallAt(s + 0.03, t + 0.03), wallAt(s + w - 0.03, t + 0.03 + (R() - 0.5) * 0.04), wallAt(s + w - 0.03, t + lowS - 0.03), wallAt(s + 0.03, t + lowS - 0.03)], q = q3.map(p => P(...p)), c = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2];
      if (c[1] > -40 && c[1] < H + 20) { const qc = chip(q, 0.35), fl = shade(S.tone(STONE, 0.2), c[0], c[1]); raw(cel(qc, { Z: 15, fill: fl, band: 1.3, tex: 'url(#mottle)', texOp: 0.4, inkW: 0.5, hi: lit(c[0], c[1]) > 0.3 })); WXW.stone(qc, 15, fl, q3); } s += w; } t += h; }
  raw(WXW.end());
  raw(hatch3(wallAt, sA, sB, 0, 22, 0.7, { op: 0.38, keep: (s, t) => lit(...P(...wallAt(s, t))) < 0.35 }) + hatch3(wallAt, sA, sB, 0, 22, -0.8, { op: 0.32, keep: (s, t) => lit(...P(...wallAt(s, t))) < 0.08 }));
  // frost on the beds high up, where the cold comes down the shaft
  for (let k = 0; k < 70; k++) { const s = sA + R() * (sB - sA), t = 5 + R() * 16, a = P(...wallAt(s, t)), b = P(...wallAt(s + 0.4 + R() * 0.6, t)); raw(pline([a, b], 0.9, FROST, 0.35)); }
  // the study wall: clocks of every kind hung over the landing, every one stopped at one minute to twelve
  // shelves on iron brackets carry the bracket clocks and lantern clocks; wall clocks hang on nails between them; a few
  // lie dismantled; every one is a different size and make, and every one stops at one minute to twelve
  const CASES = ['#3a2e22', '#4a3a26', '#2e2a26', BRASSD, '#3e3428'], k15 = K(15);
  for (const [s0, s1, t] of [[-9.4, -4.6, 1.75], [-3.8, -0.4, 2.15], [-8.6, -2.2, 3.05], [-1.4, 0.6, 3.6]]) {
    const a = P(...wallAt(s0, t)), b = P(...wallAt(s1, t)); raw(cel([[a[0], a[1]], [b[0], b[1]], [b[0], b[1] + k15 * 0.06], [a[0], a[1] + k15 * 0.06]], { Z: 15, fill: shade('#4a3a28', a[0], a[1]), band: 1.5 }));
    for (const ss of [s0 + 0.3, s1 - 0.3]) { const q = P(...wallAt(ss, t)); raw(pline([[q[0], q[1] + k15 * 0.06], [q[0], q[1] + k15 * 0.3], [q[0] + 4, q[1] + k15 * 0.06]], 1.4, INK)); }
    let ss = s0 + 0.15; while (ss < s1 - 0.3) { const kind = R(), w = 0.28 + R() * 0.32, q = P(...wallAt(ss + w / 2, t)), cw = k15 * w;
      if (kind < 0.45) { const h = cw * (1.2 + R() * 0.4); raw(cel([[q[0] - cw / 2, q[1]], [q[0] + cw / 2, q[1]], [q[0] + cw / 2, q[1] - h], [q[0] + cw * 0.3, q[1] - h - cw * 0.18], [q[0] - cw * 0.3, q[1] - h - cw * 0.18], [q[0] - cw / 2, q[1] - h]], { Z: 15, fill: shade(CASES[Math.floor(R() * 5)], q[0], q[1]), band: 1.5 }) + clockFace([q[0], q[1] - h * 0.62], cw * 0.34, 15, { case: BRASSD })); }
      else if (kind < 0.75) { const h = cw * 1.6; raw(cel([[q[0] - cw * 0.3, q[1]], [q[0] + cw * 0.3, q[1]], [q[0] + cw * 0.32, q[1] - h * 0.7], [q[0] - cw * 0.32, q[1] - h * 0.7]], { Z: 15, fill: shade(BRASSD, q[0], q[1]), band: 1.2 }) + `<path d="M${f1(q[0] - cw * 0.25)} ${f1(q[1] - h * 0.7)} Q${f1(q[0])} ${f1(q[1] - h * 1.05)} ${f1(q[0] + cw * 0.25)} ${f1(q[1] - h * 0.7)} Z" fill="${shade(BRASS, q[0], q[1])}" stroke="${INK}" stroke-width="0.8"/>` + clockFace([q[0], q[1] - h * 0.42], cw * 0.26, 15, { case: BRASSD })); }
      else { raw(cel([[q[0] - cw * 0.45, q[1]], [q[0] + cw * 0.45, q[1]], [q[0] + cw * 0.4, q[1] - cw * 0.25], [q[0] - cw * 0.4, q[1] - cw * 0.3]], { Z: 15, fill: shade('#5a4a34', q[0], q[1]), band: 1 }) + `<circle cx="${f1(q[0] + cw * 0.1)}" cy="${f1(q[1] - cw * 0.35)}" r="${f1(cw * 0.12)}" fill="${shade(BRASS, q[0], q[1])}" stroke="${INK}" stroke-width="0.7"/>`); }
      ss += w + 0.05 + R() * 0.15; }
  }
  for (const [s0, t0, r] of [[-6.4, 2.55, 0.2], [-2.6, 2.95, 0.26], [-0.2, 2.7, 0.16], [-9.8, 2.6, 0.3], [-4.2, 3.9, 0.22]]) { const q = P(...wallAt(s0, t0)), nail = P(...wallAt(s0, t0 + r + 0.18)); raw(pline([nail, [q[0] - k15 * r * 0.7, q[1] - k15 * r * 0.6], [q[0] + k15 * r * 0.7, q[1] - k15 * r * 0.6], nail], 0.6, INK) + `<circle cx="${f1(nail[0])}" cy="${f1(nail[1])}" r="1.2" fill="${INK}"/>` + clockFace(q, k15 * r, 15, { case: CASES[Math.floor(R() * 5)] })); }
  // the empty sentry niche on the landing: a round-headed recess with a brass bracket where the sentry stood
  { const s0 = 6.2, w = 1.3, h = 2.4, pts = []; for (let k = 0; k <= 12; k++) { const a = Math.PI * k / 12; pts.push(P(...wallAt(s0 + Math.cos(a) * w / 2, h - w / 2 + Math.sin(a) * w / 2))); }
    const n = [P(...wallAt(s0 + w / 2, 0.4)), ...pts, P(...wallAt(s0 - w / 2, 0.4))]; raw(fillP(n, '#0c0d10') + inkP(n, 1.4) + pline([P(...wallAt(s0 - 0.3, 1.9)), P(...wallAt(s0 + 0.3, 1.9))], 3, BRASSD) + rime(n.slice(1, 13), 15, { th: 2, col: FROST })); }
  raw('</g>');
}
// ---- the stair: treads climbing the round wall from the landing on the right, across the back, out of the top
{
  const N = 58;
  for (let k = N; k >= 0; k--) { const { a, Y } = tread(k), a1 = a - DA * 1.02, Yt = Y + RISE;
    const P3 = (aa, r, y) => P(r * Math.sin(aa), y, ZC + r * Math.cos(aa));
    const riser = [P3(a, RIN, Y), P3(a, RW, Y), P3(a, RW, Yt), P3(a, RIN, Yt)], top = [P3(a, RIN, Yt), P3(a, RW, Yt), P3(a1, RW, Yt), P3(a1, RIN, Yt)], under = [P3(a, RIN, Y), P3(a1, RIN, Y + RISE * 0.4), P3(a1, RIN, Yt - 0.35), P3(a, RIN, Yt - 0.35)];
    const c = riser[0], col = mix(shade(S.tone('#8a8488', 0.15), c[0], c[1], 520), '#000', 0.05);
    if (Yt > 1.2) raw(cel(top, { Z: 14, fill: mix(col, '#000', 0.25), band: 1, inkW: 0.5, hi: false })); // seen from below: the soffit side
    raw(cel(riser, { Z: 14, fill: col, band: 1, inkW: 0.55, hi: lit(c[0], c[1]) > 0.2 }));
    if (Yt < 1.2) raw(cel(top, { Z: 14, fill: mix(col, '#e8dcc0', 0.15), band: 1, inkW: 0.5 }));
    // the inner edge: the soffit's thickness (a band under the tread), seen from below as it climbs overhead
    raw(fillP([P3(a, RIN, Y - 0.25), P3(a1, RIN, Y - 0.25 + RISE), P3(a1, RIN, Yt), P3(a, RIN, Y + RISE * 0.02)], '#0e0c10', 0.95) + pline([P3(a, RIN, Y), P3(a, RIN, Yt), P3(a1, RIN, Yt)], 1.3, INK) + pline([P3(a, RIN, Yt), P3(a1, RIN, Yt)].map(([x, y]) => [x, y + 1]), 0.9, mix(LAMP, '#ffffff', 0.3), 0.35 + 0.4 * lit(c[0], c[1], 520)));
    if (k % 11 === 3) raw(rime([P3(a, RIN + 0.1, Yt), P3(a, RW - 0.1, Yt)], 14, { th: 2, col: FROST }));
  }
  // the soffit's lower edge line and the handrail: an iron rail on posts along the inner edge, rimed, icicles under it
  const edge = [], rail = []; for (let k = 0; k <= N; k += 2) { const { a, Y } = tread(k); edge.push(P(RIN * Math.sin(a), Y - 0.25, ZC + RIN * Math.cos(a))); rail.push(P((RIN + 0.05) * Math.sin(a), Y + 1.0, ZC + (RIN + 0.05) * Math.cos(a))); }
  raw(line(edge, 1.8, INK) + line(rail, 2.6, INK) + line(rail, 1.3, shade('#3a3a40', 700, 200)) + rime(rail, 14, { th: 1.6, col: FROST }));
  for (let k = 0; k < rail.length; k += 4) raw(pline([rail[k], [rail[k][0], rail[k][1] + 14]], 1.2, INK, 0.8));
  raw(icicles(edge.filter((_, i) => i % 2 === 0).map(([x, y]) => [x, y + 1]), 14, { len: 16, dens: 0.6, col: FROST }));
  // pilgrims' wear: the treads worn hollow in the middle (a darker dip on each lower riser lit by the lamp)
  for (let k = 0; k < 18; k++) { const { a, Y } = tread(k), p = P((RIN + 0.7) * Math.sin(a - DA / 2), Y + RISE, ZC + (RIN + 0.7) * Math.cos(a - DA / 2)); raw(fillS(blob(p[0], p[1], 6, 1.3, 7, 0.3), '#1a1614', 0.5)); }
}
// ---- the clock's drive coming down the shaft from the Last Hour above: weight chains to weights at different heights,
// fused links and burns down them; the pendulum rod and its great bob stopped at the end of its swing, not plumb
{
  for (const [X, Z, Yw, sz] of [[1.6, 11.5, 3.6, 0.42], [2.6, 12.2, 6.4, 0.36], [-0.6, 12.8, 9.2, 0.32]]) {
    const top = P(X, 30, Z), w = P(X, Yw + sz * 2.2, Z), k = K(Z); raw(chain([top, w], Math.max(2, k * 0.04), shade('#3a3a40', w[0], w[1])));
    raw(fused(w[0], w[1] - k * 0.6, Math.max(2, k * 0.06), '#4a4a50', Z));
    const wb = [[w[0] - k * sz * 0.5, w[1]], [w[0] + k * sz * 0.5, w[1]], [w[0] + k * sz * 0.55, w[1] + k * sz * 2.2], [w[0] - k * sz * 0.55, w[1] + k * sz * 2.2]];
    raw(cel(wb, { Z, fill: shade(BRASSD, w[0], w[1] + k * sz), band: k * sz * 0.25, tex: 'url(#mottle)', texOp: 0.4 }) + rime(wb.slice(0, 2), Z, { th: 2, col: FROST }) + icicles([wb[3], wb[2]], Z, { len: 10, dens: 1.2, col: FROST }));
  }
  // the pendulum: the rod from out of the top, swung out to the right and stopped there; the bob a great brass lens
  const pv = P(-0.6, 24, 10.5), ang = 0.12, L = 21.2, bobW = [-0.6 + Math.sin(ang) * L, 24 - Math.cos(ang) * L, 10.5], bob = P(...bobW), k = K(10.5);
  raw(line([pv, bob], Math.max(5, k * 0.09), INK) + line([pv, bob], Math.max(3, k * 0.06), mix(BRASS, AMB, 0.2)) + line([[pv[0] - 1.2, pv[1]], [bob[0] - 1.2, bob[1]]], 1, BRASSL, 0.7));
  const disc = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; disc.push([bob[0] + Math.cos(a) * k * 0.55, bob[1] + k * 0.45 + Math.sin(a) * k * 0.55]); }
  raw(cel(disc, { Z: 10.5, fill: shade(BRASS, bob[0], bob[1], 380), band: k * 0.18, tex: 'url(#mottle)', texOp: 0.3 }) + line(disc.slice(13, 19), 2.2, mix(LAMP, '#fff', 0.4), 0.7) + rime(disc.slice(12, 20), 10.5, { th: 2.5, col: FROST }) + icicles(disc.slice(2, 10), 10.5, { len: 14, dens: 1.4, col: FROST }));
  { const ck = S.id('bb'); raw(`<clipPath id="${ck}"><path d="${p2(disc)}"/></clipPath><g clip-path="url(#${ck})">` + burnA(bob[0] - k * 0.3, bob[1] + k * 0.2, 0.4, k * 0.6, 1.2, { depth: 2 }) + '</g>'); }
  // the strike mark of the stopped beat: frost blown off the bob's rim in a short fan on the right, as if still moving
  for (let i = 0; i < 9; i++) { const a = -0.6 + i * 0.14, p = [bob[0] + Math.cos(a) * k * 0.62, bob[1] + k * 0.45 + Math.sin(a) * k * 0.62]; raw(pline([p, [p[0] + 5 + R() * 5, p[1] + (R() - 0.5) * 3]], 0.7, FROST, 0.6)); }
}
// ---- the landing floor: flags laid round the shaft, joints running toward the newel; frost in them; the lamp's pool
{
  raw(`<path d="${pp([[-30, 0, 3.4], [30, 0, 3.4], [30, 0, 18], [-30, 0, 18]])}" fill="${MURK}"/>`);
  raw(B.flags(-20, 20, 3.4, 18, '#4a4648', { depth: 0.9, width: 1.0, vary: 0.16, cracks: 0.2, fogK: 0.5, joint: 0.55, skip: (x, z) => Math.hypot(x, z - ZC) > RW }));
  raw(joints(-10, 10, 4, 17, { dx: 1.6, dz: 1.2, op: 0.28, cracks: 4, lip: LAMP, lipOp: 0.25 }));
  raw(G.bandFloor(-12, 12, { col: '#3a3638', wear: shade('#6a6260', 700, 420), debrisCol: '#5a5658', wearOp: 0.3 }));
  for (let k = 0; k < 40; k++) { const X = -9 + R() * 18, Z = 4 + R() * 12, a = P(X, 0.01, Z), b = P(X + 0.4 + R() * 0.6, 0.01, Z); raw(pline([a, b], 0.9, FROST, 0.25)); }
  raw(pool(LP[0], P(LPOS[0], 0, LPOS[2])[1], 260, 26, AMB, { n: 4, op: 0.08 }));
  raw(hatch3((s, t) => [-20 + s, 0, 3.4 + t], 0, 40, 0, 14, 0.3, { op: 0.35, keep: (s, t) => lit(...P(-20 + s, 0, 3.4 + t)) < 0.25 }));
}
// ---- the lamp: an oil lamp in a brass cage hung on a chain from the soffit; its warm light the room's one source
{
  raw(pool(LP[0], LP[1] + 20, 340, 230, AMB, { n: 6, op: 0.04, jag: 0.3 }) + pool(LP[0], LP[1] + 4, 90, 80, LAMP, { n: 4, op: 0.08 }));
  const top = P(LPOS[0], 5.6, LPOS[2]), k = K(LPOS[2]), x = LP[0], y = LP[1];
  raw(chain([top, [x, y - k * 0.24]], 2.4, '#3a3a40'));
  const cage = [[x - k * 0.12, y - k * 0.2], [x + k * 0.12, y - k * 0.2], [x + k * 0.15, y + k * 0.12], [x, y + k * 0.22], [x - k * 0.15, y + k * 0.12]];
  raw(fillP(cage, '#ffe0a0') + fillS(blob(x, y, k * 0.07, k * 0.09, 8, 0.2), '#fff6d8') + inkP(cage, 1.4));
  for (const dx of [-0.08, 0, 0.08]) raw(pline([[x + dx * k, y - k * 0.2], [x + dx * k * 1.2, y + k * 0.15]], 1.1, BRASSD));
}
raw(quiet([[236, 0.13], [266, 0.13], [300, 0.12], [350, 0.1]], { hop: 0.16 }));
raw(frame('#06070b', { sides: [[200, 0.16], [110, 0.2], [50, 0.22]], top: [[110, 0.2], [60, 0.2]] }));

// ======================================================================== MID
layer('mid');
// the Horologist's bench: a low dark trestle with a dismantled movement, a loupe, a candle stub, a basket of spare gears
{ const Z = 10.5, X = -5.4; raw(box(X - 1.1, X + 1.1, 0.72, 0.8, Z - 0.35, Z + 0.35, { col: shade('#4a3a28', ...P(X, 0.8, Z)) }));
  for (const dx of [-0.95, 0.95]) raw(post(X + dx, Z - 0.25, 0.05, 0, 0.72, shade('#3a2e22', ...P(X, 0.4, Z)), { grain: false }));
  for (let k = 0; k < 6; k++) { const p = P(X - 0.8 + R() * 1.6, 0.82, Z - 0.2 + R() * 0.3), r = K(Z) * (0.04 + R() * 0.06); raw(`<ellipse cx="${f1(p[0])}" cy="${f1(p[1])}" rx="${f1(r)}" ry="${f1(r * 0.35)}" fill="${shade(BRASS, p[0], p[1])}" stroke="${INK}" stroke-width="0.6"/>`); }
  const c = P(X + 0.7, 0.82, Z - 0.1); raw(cel([[c[0] - 2, c[1]], [c[0] + 2, c[1]], [c[0] + 2, c[1] - 8], [c[0] - 2, c[1] - 8]], { Z, fill: '#d8ccb0', band: 1 }) + fillS(blob(c[0], c[1] - 10, 1.4, 2.6, 6, 0.2), LAMP));
  const b = P(-3.6, 0.2, 9.4); raw(cel(blob(b[0], b[1], 12, 8, 10, 0.2), { Z: 9.4, fill: shade('#5a4630', b[0], b[1]), band: 2 })); for (let k = 0; k < 5; k++) raw(`<circle cx="${f1(b[0] - 8 + R() * 16)}" cy="${f1(b[1] - 6 - R() * 3)}" r="${f1(2 + R() * 2)}" fill="${shade(BRASS, b[0], b[1])}" stroke="${INK}" stroke-width="0.6"/>`); }
// a sentry's halberd fallen across the landing, frozen to the flags
{ const Z = 11, a = P(3.4, 0.03, Z), b = P(6.4, 0.03, Z - 0.6); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, shade('#4a3e2e', a[0], a[1])) + cel([[b[0], b[1] - 6], [b[0] + 12, b[1] - 2], [b[0] + 2, b[1] + 4]], { Z, fill: shade('#7a7e86', b[0], b[1]), band: 1 })); }

// ======================================================================== FORE
layer('fore');
// top: the underside of the next turn of the stair close overhead: each tread's soffit a step, the steps rising from
// the left to the right across the frame top, its stringer edge rimed and hung with icicles
{ const steps = []; let x = -20, y = 112; while (x < W + 40) { const w = 46 + R() * 8, d = 5.2 + R() * 1.2; steps.push([x, y], [x + w, y]); x += w; y -= d; steps.push([x, y]); }
  const pts = [[-10, -10], [W + 40, -10], ...steps.slice().reverse()];
  raw(fillP(pts, '#16141a'));
  const ck = S.id('so'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">`);
  for (let i = 0; i < steps.length - 2; i += 3) { const [a, b, c] = [steps[i], steps[i + 1], steps[i + 2]]; raw(cel([[a[0], a[1]], [b[0], b[1]], [c[0], c[1]], [c[0], c[1] - 18], [a[0], a[1] - 18]], { Z: 3, fill: S.tone('#24222a', 0.2), band: 3, hi: false }) + pline([[b[0], b[1]], [b[0] + 2, b[1] - 16]], 1, INK, 0.6)); }
  raw(`<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.35"/></g>`);
  raw(pline(steps, 2.6, INK) + pline(steps.map(([x, y]) => [x, y - 2]), 0.8, mix(LAMP, '#ffffff', 0.3), 0.35) + icicles(steps.filter((_, i) => i % 3 === 1), 3, { len: 26, dens: 0.5, col: FROST })); }
// left: the newel of the stair and its rail, close, stone banded with brass
{ const pts = [[-10, H + 5], [-10, 60], [64, 70], [60, 200], [70, 330], [84, H + 5]]; raw(cel(pts, { Z: 3.4, fill: '#1e1c20', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.45"/>`);
  for (const y of [120, 230, 350]) raw(pline([[-10, y], [64, y - 4]], 6, INK) + pline([[-10, y], [64, y - 4]], 3.6, '#4a4028'));
  raw(rime([[0, 62], [30, 64], [62, 70]], 3.4, { th: 5, col: FROST }) + icicles([[2, 64], [62, 70]], 3.4, { len: 40, dens: 0.8, col: FROST })); }
// right: a long-case clock at the frame edge, its door hanging open, its pendulum gone, its dial frosted at 11:59
{ const x0 = W - 92, y0 = 60, w = 96; raw(cel([[x0, H + 5], [x0, y0 + 70], [x0 + 6, y0], [W + 10, y0], [W + 10, H + 5]], { Z: 3.6, fill: '#2a2018', band: 10, tex: 'url(#mottle)', texOp: 0.5 }));
  raw(clockFace([x0 + 46, y0 + 48], 30, 3.6, { case: '#3a2c1e', dial: '#c8bea4' }));
  raw(fillP([[x0 + 14, 170], [x0 + 80, 170], [x0 + 80, 430], [x0 + 14, 430]], '#0a0806') + cel([[x0 + 14, 170], [x0 - 26, 182], [x0 - 26, 420], [x0 + 14, 430]], { Z: 3.6, fill: '#3a2c1e', band: 4 }) + rime([[x0, y0 + 2], [x0 + 50, y0 - 2], [W + 10, y0]], 3.6, { th: 4, col: FROST })); }
raw(fillP([[-5, H + 5], [-5, H - 13], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 11 - Math.sin(k * 1.5) * 5 - R() * 4]), [W + 5, H - 13], [W + 5, H + 5]], '#0a0a0e', 0.92));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
