// World XI, the Stilled Spire: THE AURORA GALLERY (`spire_top`, round 2, new). Battle room, Living Ink.
// Place: the open gallery round the spire's crown, high over the world (bible XI: the stars stopped; aurora moths are
// drawn to the frozen stars, their wings carrying the northern lights; the Rime Colossus is the ice statue of the
// observatory's founder, and someone wound it up; pilgrims crossed the hive plain to watch the stars stop).
// Encounters: the Aurora Gallery (moths drawn to the frozen stars), the Founder Stands (someone wound up the statue).
// Kind of space: open exterior, high and vast: a curved stone walk with its parapet sweeping away to the left, the
// crown's wall on the left, and beyond the parapet nothing but sky and the world far below.
// Light: the stopped aurora. Curtains of green and violet hang still across the sky and light the snow on the walk a
// cold green-white; the lightest room of the world.
// Shapes: horizontals: the parapet's sweep, the aurora's bands, the flat world on the horizon; one vertical mass, the
// crown on the left; the empty plinth.
// Palette key: light and cold (snow white, aurora green, violet, deep teal sky), brass small.
// Depth planes (far): the parapet and the plinth (8-18 m); the crown's wall and its pinnacles (12-20 m); the world below
// on the horizon (the hive plain with its spires as specks, kilometres off) under the sky and the aurora (far).
// Lore placed: the founder's plinth empty, its iron dowels snapped, the inscription frosted, the ice of the statue's
// feet broken off and left standing, the drag of its first steps across the snow; a brass transit instrument on the
// parapet, fused; the frozen stars hanging still; the lightning rods on the pinnacles, burnt; aurora-green burns on the
// coping where a strike ran along it; pilgrims' votive ribbons frozen stiff on the rail.
// Mid: a fallen pinnacle finial in the snow, a dropped pilgrim's lantern, the brass winding key's packing crate.
// Fore: left: the crown's buttress with its icicles; right: a parapet pinnacle with a rimed gargoyle spout.
// No eyes (the gargoyle's eyes are blank sockets, not an eye motif; not a void world). No red. No gold.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XI');
const ROOM = 'spire_top', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 11401, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#2a3a46' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#2a3644' });
const { line, pline, fillP, fillS, inkP, inkS, blob, box, post, icicles, rime, burn, fused, chain, quiet, skyBands } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#7a98a4' });
const MV = require('./materials_v2')(S);
const { pool, frame, stars, aurora, joints } = G;

const BRASS = '#8c7c4c', BRASSD = '#54482a', FROST = '#e4eef4', SNOW = '#d8e4ea', SNOWS = '#9fb4c2', STONE = '#7c8894', STONED = '#4a5664', AUR = '#86e8b8', VIOL = '#a898e0', MURK = B.MURK;
const auroraTint = (col, k = 0.12) => mix(col, AUR, k);
const burnA = (x, y, ang, len, w, o = {}) => burn(x, y, ang, len, w, Object.assign({ core: AUR, scorch: '#0c100e', coreOp: 0.6, haloOp: 0.3, branchP: 0.45, spread: 0.75 }, o));
// the gallery walk: its outer edge (the parapet) sweeps in an arc from the near right to the far left
const PAR = t => { const a = -0.25 + t * 1.55, r = 15; return [9 - r * Math.sin(a) * 1.05, 0, 3 + r * (1 - Math.cos(a)) * 0.9 + t * 6]; };

// ======================================================================== FAR
layer('far');
// ---- the sky: deep teal at the top, brightening to a pale green-white glow low where the aurora hangs
raw(`<rect width="${W}" height="${H}" fill="#0e1c28"/>` + G.sky([[0, '#0b1822'], [0.3, '#12242e'], [0.55, '#1c3840'], [0.75, '#2c5254'], [0.9, '#4a6e66'], [1, '#6a8a7e']]));
raw(`<rect width="${W}" height="70" fill="${S.hatchA(30)}" opacity="0.3"/>`);
raw(stars(0, 0, W, 170, 220, { col: '#e8f4f8', op: 0.75 }));
// frozen stars: a few big ones hanging still, each with a hard four-point glint and a ring of rime
for (const [x, y, r] of [[300, 40, 3], [1010, 26, 3.6], [1240, 90, 2.6], [620, 70, 2.2]]) raw(`<path d="M${x - r * 6} ${y} L${x + r * 6} ${y} M${x} ${y - r * 6} L${x} ${y + r * 6}" stroke="#f4fbff" stroke-width="1" opacity="0.8"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff"/><circle cx="${x}" cy="${y}" r="${r * 3}" fill="none" stroke="#dceef4" stroke-width="0.6" opacity="0.5" stroke-dasharray="2 3"/>`);
// the aurora: three curtains stopped mid-fold across the sky, rays standing up from bright hems
raw(aurora(-60, W + 60, 196, 150, { n: 3, amp: 26, dy: 34, op: 0.085, col: AUR, violet: VIOL }));
raw(aurora(300, 1300, 120, 90, { n: 2, amp: 18, dy: 22, op: 0.06, col: '#a8f0d0', violet: VIOL }));
// ---- the world far below: the hive plain under snow-haze to the horizon, its spires as specks, the stopped storm
{
  raw(fillP([[-5, 299], [W + 5, 299], [W + 5, 340], [-5, 340]], '#7a96a0'));
  for (const [y, c] of [[304, '#6a8690'], [312, '#5c7884'], [324, '#4e6a78']]) raw(fillP([[-5, y], ...Array.from({ length: 30 }, (_, k) => [k * W / 29, y + Math.sin(k * 1.7 + y) * 2]), [W + 5, y], [W + 5, 360], [-5, 360]], c, 0.9));
  let d = ''; for (let k = 0; k < 70; k++) { const x = R() * W, h = 2 + Math.pow(R(), 2) * 9, y = 300 + R() * 6; d += `M${f1(x - h * 0.15)} ${f1(y)} L${f1(x)} ${f1(y - h)} L${f1(x + h * 0.15)} ${f1(y)} Z `; } raw(`<path d="${d}" fill="#4a5e68" opacity="0.8"/>`);
  // the hive storm far off on the horizon to the right: a low black cloud bank, rain hanging out of it
  raw(G.cloud(1220, 290, 360, 22, '#3a4650', { ink: 0.8, lit: '#8aa0a8' }));
  let rn = ''; for (let k = 0; k < 50; k++) { const x = 1080 + R() * 280, y = 296; rn += `M${f1(x)} ${f1(y)} l2 10 `; } raw(`<path d="${rn}" stroke="#4a5864" stroke-width="0.6" opacity="0.6"/>`);
}
// ---- the crown on the left (last touch-up: articulated, no longer a flat blocky mass). The clock chamber's drum rises in
// two stages. The lower stage: a moulded plinth, a string course with icicles under its drip, three buttresses with
// snow-laden set-offs, a corbel table carrying a crenellated parapet, its merlons capped with snow and rimed on the
// windward side; one stretch of the parapet has fallen (jagged stumps, missing corbels, its stones on the string course
// and at the foot). Behind the parapet the upper stage rises, set back: its own string course, the tall frosted lancet,
// and a ruined stretch where its wall has broken down against the aurora sky.
{
  const RC = 7, CXc = -9.5, CZ = 19, drum = r => (s2, t) => [CXc + r * Math.sin(s2 / r), t - 0.6, CZ - r * Math.cos(s2 / r)];
  const at = drum(RC), S0 = -7.4, S1 = 7.4, TP = 5.2, TM = 6.6, RU = [2.6, 4.6];      // parapet foot, merlon top, ruined stretch (s)
  const band = (r, s0, s1, t0, t1, n = 30) => { const f = drum(r), q = []; for (let k = 0; k <= n; k++) q.push(P(...f(s0 + (s1 - s0) * k / n, t0))); for (let k = n; k >= 0; k--) q.push(P(...f(s0 + (s1 - s0) * k / n, t1))); return q; };
  const shade = (s2) => s2 < -3 ? 0.3 : s2 > 3.5 ? -0.12 : 0;                         // the drum's turning: left in shade, right lit by the aurora
  const ST = auroraTint(STONE, 0.1), STL = auroraTint(mix(STONE, FROST, 0.25), 0.2), STD = mix(STONE, '#1a2632', 0.45);
  // ---- the upper stage, set back (r 4.8), rising out of frame, its top broken down on the right
  {
    const R2 = 4.8, up = drum(R2), sA = -4.9, sB = 4.9, ruinT = sx => sx > 0.8 ? 7.4 + Math.sin(sx * 5.3) * 0.35 + (sx > 2.6 ? -0.6 : 0) + (R() - 0.5) * 0.25 : 30;
    const ol = []; for (let k = 0; k <= 30; k++) ol.push(P(...up(sA + (sB - sA) * k / 30, TP - 0.2))); for (let k = 30; k >= 0; k--) { const sx = sA + (sB - sA) * k / 30; ol.push(P(...up(sx, ruinT(sx)))); }
    const cu = S.id('cu'); raw(`<clipPath id="${cu}"><path d="${p2(ol)}"/></clipPath><g clip-path="url(#${cu})">`);
    raw(S.ashlar((s2, t) => up(s2 + sA, t), sB - sA, 26, mix(ST, '#2a3a48', 0.15), { rough: true, roughP: 0.35, scale: 0.9, vary: 0.22, lost: 0.1, weather: { algae: 0, salt: 0.5, saltCol: FROST } }));
    raw(hatch3((s2, t) => up(s2 + sA, t), 0, sB - sA, TP, 26, 0.7, { op: 0.4, keep: s2 => s2 < 3.2 }));
    // its string course
    raw(fillP(band(R2 + 0.12, sA, sB, 7.0, 7.25), STL) + pline(band(R2 + 0.12, sA, sB, 7.0, 7.0, 30).slice(0, 31), 1.4, INK, 0.8));
    // the tall lancet with frosted louvres (moved up onto the upper stage)
    { const s0 = -1.2, w = 0.9, y0 = TP + 0.6, pts = [up(s0 - w / 2, y0), up(s0 - w / 2, y0 + 4.4), up(s0 - w * 0.25, y0 + 5.4), up(s0, y0 + 5.8), up(s0 + w * 0.25, y0 + 5.4), up(s0 + w / 2, y0 + 4.4), up(s0 + w / 2, y0)].map(q => P(...q));
      raw(fillP(pts, '#1a2a34') + inkP(pts, 1.8)); for (let y = y0 + 0.3; y < y0 + 4.6; y += 0.35) raw(cel([P(...up(s0 - w / 2, y)), P(...up(s0 + w / 2, y)), P(...up(s0 + w / 2, y + 0.18)), P(...up(s0 - w / 2, y + 0.22))], { Z: 14, fill: '#2e3a46', band: 1, inkW: 0.5 }) + line([P(...up(s0 - w / 2, y + 0.2)), P(...up(s0 + w / 2, y + 0.2))], 0.8, FROST, 0.35)); }
    raw(fillP(ol, '#16222c', 0.2) + '</g>');
    // the broken top: a pale fracture line, snow lodged on the stumps, rime
    const brk = []; for (let k = 0; k <= 30; k++) { const sx = sA + (sB - sA) * (30 - k) / 30; if (sx > 0.8) brk.push(P(...up(sx, ruinT(sx)))); }
    raw(pline(brk, 2, INK, 0.9) + pline(brk.map(([x2, y2]) => [x2, y2 + 1.6]), 1.2, STL, 0.8) + rime(brk, 14, { th: 3, col: SNOW }));
  }
  // ---- the lower stage's wall, plinth to parapet foot
  {
    const ol = band(RC, S0, S1, 0, TP + 0.05), cd = S.id('cr'); raw(`<clipPath id="${cd}"><path d="${p2(ol)}"/></clipPath><g clip-path="url(#${cd})">`);
    raw(S.ashlar((s2, t) => at(s2 + S0, t), S1 - S0, TP + 0.2, ST, { rough: true, roughP: 0.4, scale: 1.0, vary: 0.24, lost: 0.12, weather: { algae: 0, salt: 0.5, saltCol: FROST } }));
    raw(hatch3((s2, t) => at(s2 + S0, t), 0, S1 - S0, 0, TP + 0.2, 0.7, { op: 0.38, keep: s2 => s2 < 4.2 }) + hatch3((s2, t) => at(s2 + S0, t), 0, S1 - S0, 0, TP + 0.2, -0.8, { op: 0.28, keep: s2 => s2 < 2.4 }));
    for (let k = 0; k < 5; k++) { const s2 = -5 + R() * 10, t = 0.6 + R() * 4; raw(rime([P(...at(s2 - 1, t)), P(...at(s2, t + 0.05)), P(...at(s2 + 1, t))], 14, { th: 3, col: FROST })); }
    raw(fillP(ol, '#16222c', 0.18) + '</g>');
    raw(inkP(ol, 1.4, 0.8));
  }
  // ---- the moulded plinth and the string course (projecting bands: lit top lip, dark drip shadow under)
  const course = (t0, t1, pr, snow) => { const q = band(RC + pr, S0, S1, t0, t1); let o = cel(q, { Z: 14, fill: STL, band: 1.5, inkW: 1 }) + fillP(band(RC + 0.02, S0, S1, t0 - 0.18, t0), STD, 0.55);
    if (snow) o += rime(q.slice(31).reverse(), 14, { th: 3.5, col: SNOW });
    return o; };
  raw(course(0, 0.55, 0.22, true) + course(2.9, 3.12, 0.14, true));
  raw(icicles(band(RC + 0.14, S0 + 0.5, S1 - 0.5, 2.9, 2.9, 30).slice(0, 31), 15, { len: 22, dens: 0.5, col: FROST }));
  // ---- the corbel table: small corbels carrying the parapet's projection, dark between; missing in the ruined stretch
  for (let s2 = S0 + 0.3; s2 < S1; s2 += 0.62) { if (s2 > RU[0] && s2 < RU[1]) continue; const f = drum(RC + 0.12), q = [P(...f(s2 - 0.14, 4.7)), P(...f(s2 + 0.14, 4.7)), P(...f(s2 + 0.14, TP)), P(...f(s2 - 0.14, TP))];
    raw(fillP(band(RC + 0.05, s2 + 0.14, s2 + 0.48, 4.85, TP, 3), '#1a2632', 0.6) + cel(q, { Z: 14, fill: shade(s2) > 0.1 ? STD : ST, band: 1, inkW: 0.7 })); }
  // ---- the buttresses: projecting piers with two set-offs, snow lying on their sloped weatherings
  for (const sb of [-4.6, 1.3, 5.6]) { const w = 0.34, d0 = 1.0, d1 = 0.7, d2 = 0.4;
    const pier = (dd, t0, t1) => { const f = drum(RC + dd), g = drum(RC), side = sb < -1 ? 1 : -1;   // the side face toward the hall's middle shows
      const front = [P(...f(sb - w, t0)), P(...f(sb + w, t0)), P(...f(sb + w, t1)), P(...f(sb - w, t1))], sideF = [P(...g(sb + side * w, t0)), P(...f(sb + side * w, t0)), P(...f(sb + side * w, t1)), P(...g(sb + side * w, t1))];
      return cel(sideF, { Z: 14, fill: STD, band: 1, inkW: 0.9 }) + cel(front, { Z: 14, fill: shade(sb) > 0.1 ? mix(ST, STD, 0.3) : ST, tex: 'url(#mottle)', texOp: 0.4, band: 1.5, inkW: 1.1 }) + (() => { let c = ''; for (let t = t0 + 0.42; t < t1 - 0.1; t += 0.42 + R() * 0.08) { c += line([P(...f(sb - w, t)), P(...f(sb + w, t))], 0.8, INK, 0.55); const sx = sb + (R() - 0.5) * w * 0.8; c += line([P(...f(sx, t)), P(...f(sx, Math.min(t1, t + 0.42)))], 0.7, INK, 0.45); } return c; })(); };
    const slope = (da, db, t) => { const fa = drum(RC + da), fb = drum(RC + db), q = [P(...fa(sb - w, t)), P(...fa(sb + w, t)), P(...fb(sb + w, t + 0.45)), P(...fb(sb - w, t + 0.45))]; return cel(q, { Z: 14, fill: STL, band: 1, inkW: 0.9 }) + rime([q[3], q[2]], 14, { th: 4, col: SNOW }) + rime([q[0], q[1]], 14, { th: 2.5, col: SNOW }); };
    raw(pier(d0, 0, 2.0) + slope(d0, d1, 2.0) + pier(d1, 2.45, 3.9) + slope(d1, d2, 3.9) + pier(d2, 4.35, TP + 0.1));
    raw(icicles([P(...drum(RC + d0)(sb - w, 2.0)), P(...drum(RC + d0)(sb + w, 2.0))], 15, { len: 18, dens: 0.7, col: FROST })); }
  // ---- the parapet: a band on the corbels, merlons and crenels; snow caps; the ruined stretch broken down to stumps
  { const RP = RC + 0.25, f = drum(RP);
    for (const [a0, a1] of [[S0, RU[0]], [RU[1], S1]]) raw(cel(band(RP, a0, a1, TP, TP + 0.55, 12), { Z: 14, fill: ST, tex: 'url(#mottle)', texOp: 0.4, band: 1.5, inkW: 1.1 }));
    let step = 1.55; for (let s2 = S0 + 0.1; s2 < S1; s2 += step) { step = 1.35 + R() * 0.4; const m0 = s2, m1 = s2 + 0.8 + R() * 0.3, ruined = m1 > RU[0] && m0 < RU[1];
      if (ruined) { // jagged stumps of merlon and parapet, fresh fracture faces
        const top = TP + 0.15 + R() * 0.35, q = [P(...f(m0, TP)), P(...f(m1, TP)), P(...f(m1, top + 0.2)), P(...f(m0 + 0.6, top - 0.15)), P(...f(m0 + 0.3, top + 0.25)), P(...f(m0, top))];
        raw(cel(q, { Z: 14, fill: ST, band: 1, inkW: 1 }) + pline([q[2], q[3], q[4], q[5]], 1, STL, 0.8)); continue; }
      const q = band(RP, m0, m1, TP + 0.5, TM - (R() < 0.2 ? 0.35 + R() * 0.3 : R() * 0.12), 6), sh = shade(m0);
      raw(cel(q, { Z: 14, fill: sh > 0.1 ? mix(ST, STD, 0.35) : sh < 0 ? STL : ST, tex: 'url(#mottle)', texOp: 0.4, band: 1.6, inkW: 1.2 }) + line([q[3], q[10]], 0.8, INK, 0.45));
      // snow cap (a rounded drift overhanging the merlon's top edge) and rime on the windward right edge
      const tp = q.slice(7).reverse(); raw(rime(tp, 14, { th: 5, col: SNOW, taper: true }) + rime([P(...f(m1, TP + 0.55)), P(...f(m1, TM))], 14, { th: 2.2, col: FROST }));
      // snow lodged in the crenel after it
      if (s2 + step < S1) raw(rime([P(...f(m1 + 0.05, TP + 0.55)), P(...f(s2 + step - 0.05, TP + 0.55))], 14, { th: 3, col: SNOW })); }
    raw(icicles(band(RP, S0, S1, TP, TP, 30).slice(0, 31).filter((q, i) => { const s2 = S0 + (S1 - S0) * i / 30; return s2 < RU[0] || s2 > RU[1]; }), 14, { len: 16, dens: 0.4, col: FROST }));
    // the fallen parapet's stones lying on the string course and at the foot of the wall
    for (let k = 0; k < 7; k++) { const s2 = RU[0] + R() * (RU[1] - RU[0]), t = k < 3 ? 3.12 : 0, c = P(...drum(RC + (k < 3 ? 0.2 : 0.9 + R() * 0.8))(s2, t)), kk = K(15) * (0.25 + R() * 0.2), q = chip([[c[0] - kk, c[1]], [c[0] - kk * 0.8, c[1] - kk * 0.7], [c[0] + kk * 0.6, c[1] - kk * 0.8], [c[0] + kk, c[1]]], 0.3);
      raw(cel(q, { Z: 14, fill: ST, band: 1, inkW: 0.9 }) + rime([q[1], q[2]], 14, { th: 2, col: SNOW })); } }
  // aurora light laid on the lit (right) side of the drum, cold, soft
  raw(`<path d="${p2(band(RC + 1.1, 2.0, S1, 0, TM))}" fill="${AUR}" opacity="0.06"/>`);
}
// ---- the gallery walk: snow on the flags, the parapet sweeping away to the left in an arc; balusters with the world
// showing between them; the coping rimed, burns along it; votive ribbons frozen on the rail; the transit instrument
{
  const N = 60, pts = []; for (let i = 0; i <= N; i++) pts.push(PAR(i / N));
  // the walk's snow from the near edge to the parapet foot
  const foot = pts.map(p => P(p[0], 0, p[2]));
  // the gallery's floor: stone flags laid in courses and leaded at the joints (lead strips run in the joints and turn up
  // at the parapet), the snow blown off the middle of the walk and lying in drifts at the parapet foot and in the joints
  const walk = [...foot, [-5, foot[foot.length - 1][1]], [-5, H + 5], [W + 5, H + 5]];
  raw(fillP(walk, '#5a6672'));
  { const ck = S.id('wk'); raw(`<clipPath id="${ck}"><path d="${p2(walk)}"/></clipPath><g clip-path="url(#${ck})">`);
    raw(B.flags(-16, 14, 3.4, 20, auroraTint('#8a96a2', 0.1), { depth: 0.85, width: 1.1, vary: 0.14, cracks: 0.25, fogK: 0.4, joint: 0.75, hi: true }));
    // lead in the joints: dull grey strips with a lit edge, running into depth and across
    for (let X = -14; X < 14; X += 1.1 + R() * 0.3) { const q = []; for (let Z = 3.5; Z < 20; Z += 0.5) q.push(P(X + Math.sin(Z) * 0.03, 0.006, Z)); raw(line(q, 1.6, '#3e4650', 0.75) + line(q.map(([x, y]) => [x - 0.8, y]), 0.5, '#c8d4dc', 0.4)); }
    // snow lying in the joints and in thin drifts across the flags; the middle of the walk scoured bare by the wind
    for (let k = 0; k < 120; k++) { const X = -14 + R() * 28, Z = 3.6 + Math.pow(R(), 0.8) * 15, a = P(X, 0.008, Z), b = P(X + 0.3 + R() * 1.2, 0.008, Z + (R() - 0.5) * 0.05); raw(pline([a, b], Math.max(0.8, K(Z) * 0.02), SNOW, 0.7)); }
    for (const [X, Z, w] of [[-10, 5.2, 3], [3, 4.4, 4], [9, 8, 2.5], [-4, 11, 3.2]]) { const q = []; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; q.push(P(X + Math.cos(a) * w / 2, 0.01, Z + Math.sin(a) * w * 0.18)); } raw(fillS(q, SNOW, 0.85, 0.5)); }
    raw('</g>'); }
  // the snow banked against the parapet foot, deep, carved by the wind
  { const pp2 = pts.filter(p => p[2] > 6.5), f2 = pp2.map(p => P(p[0], 0, p[2])), bank = pp2.map(p => P(p[0], 0.25 + Math.sin(p[2] * 2) * 0.08, p[2] - 0.5)); raw(fillS([...f2, ...bank.slice().reverse()], SNOW, 1, 0.3) + line(bank, 0.9, INK, 0.5)); }
  raw(G.sastrugi(-12, 10, 9, 16, 16, { len: 2.4, h: 0.1, ang: -0.35, shade: SNOWS, inkOp: 0.5 }));
  raw(G.bandFloor(-14, 14, { col: '#7a8692', wear: '#a8b4c0', debrisCol: '#9aa4ae', wearOp: 0.25, debris: 14 }));
  raw(joints(-12, 10, 4, 18, { dx: 1.3, dz: 1.1, op: 0.18, col: '#5a6a78', lip: '#ffffff', cracks: 0 }));
  // the parapet: a low wall of dressed stone, balusters in its upper half with sky and world between them
  for (let i = N - 1; i >= 0; i--) { const a = pts[i], b = pts[i + 1], Za = a[2], q = (y0, y1) => [P(a[0], y0, a[2]), P(b[0], y0, b[2]), P(b[0], y1, b[2]), P(a[0], y1, a[2])];
    { const fl = auroraTint(S.tone(STONE, 0.14), 0.08), qq = q(0, 0.45); raw(cel(qq, { Z: Za, fill: fl, band: 1, inkW: Math.max(0.4, inkW(Za) * 0.6), hi: false }) + (i % 3 === 0 ? MV.stoneMarks(qq, Za, fl, { wy0: 0.1 }) : '')); }
    if (i % 2 === 0) { const m = [(a[0] + b[0]) / 2, (a[2] + b[2]) / 2], bw = 0.09, bal = [P(m[0] - bw, 0.45, m[1]), P(m[0] + bw, 0.45, m[1]), P(m[0] + bw * 1.6, 0.68, m[1]), P(m[0] + bw, 0.9, m[1]), P(m[0] - bw, 0.9, m[1]), P(m[0] - bw * 1.6, 0.68, m[1])]; raw(cel(bal, { Z: Za, fill: auroraTint(STONE, 0.1), band: 1, inkW: 0.5 })); }
    raw(cel(q(0.9, 1.08), { Z: Za, fill: auroraTint(mix(STONE, '#e8f0f4', 0.25), 0.1), band: 1, inkW: Math.max(0.4, inkW(Za) * 0.6) })); }
  const cop = pts.map(p => P(p[0], 1.08, p[2])); raw(rime(cop, 12, { th: 3, col: FROST }) + icicles(pts.map(p => P(p[0], 0.9, p[2])), 12, { len: 10, dens: 0.6, col: FROST }));
  for (let k = 0; k < 3; k++) { const i = 8 + Math.floor(R() * 40), p = cop[i]; raw(burnA(p[0], p[1] + 1, (R() < 0.5 ? 0 : Math.PI) + (R() - 0.5) * 0.3, 40 + R() * 40, 1.6, { depth: 3 })); }
  // pilgrims' votive ribbons tied to the rail, frozen stiff in a wind that stopped
  for (let k = 0; k < 9; k++) { const p = cop[6 + Math.floor(R() * 48)], L = 6 + R() * 10; raw(fillP([[p[0], p[1] + 1], [p[0] + L, p[1] - L * 0.2], [p[0] + L * 0.9, p[1] + L * 0.25], [p[0] + 1, p[1] + 3]], ['#a8b8c4', '#c8c0a0', '#8aa0b0'][k % 3]) + inkP([[p[0], p[1] + 1], [p[0] + L, p[1] - L * 0.2], [p[0] + L * 0.9, p[1] + L * 0.25], [p[0] + 1, p[1] + 3]], 0.5)); }
  // the transit instrument on its iron stand by the parapet, fused at its trunnions
  { const X = 3.6, Z = PAR(0.3)[2] - 0.8, base = P(X, 0, Z), top = P(X, 1.5, Z), k = K(Z);
    raw(post(X, Z, 0.08, 0, 1.3, '#2e3640', { grain: false }));
    raw(line([[top[0] - k * 0.6, top[1] + k * 0.25], [top[0] + k * 0.5, top[1] - k * 0.3]], k * 0.12, INK) + line([[top[0] - k * 0.6, top[1] + k * 0.25], [top[0] + k * 0.5, top[1] - k * 0.3]], k * 0.08, BRASS));
    raw(fused(top[0], top[1], k * 0.07, '#6a5a3a', Z) + rime([[top[0] - k * 0.6, top[1] + k * 0.18], [top[0] + k * 0.5, top[1] - k * 0.37]], Z, { th: 2, col: FROST })); }
}
// ---- the founder's plinth, empty: dressed stone, the inscription frosted, its iron dowels snapped; the ice of the
// statue's feet broken off and left standing on it; a drag of the first heavy steps through the snow toward us
{ const X = -2.2, Z = 15.5, k = K(Z);
  raw(B.box(X - 0.9, X + 0.9, 0, 0.35, Z - 0.9, Z + 0.9, { col: auroraTint(STONED, 0.1) }) + B.box(X - 0.7, X + 0.7, 0.35, 1.9, Z - 0.7, Z + 0.7, { col: auroraTint(STONE, 0.12) }) + B.box(X - 0.82, X + 0.82, 1.9, 2.1, Z - 0.82, Z + 0.82, { col: auroraTint(mix(STONE, '#e8f0f4', 0.2), 0.1) }));
  raw(MV.stoneMarks([P(X - 0.7, 0.35, Z - 0.71), P(X + 0.7, 0.35, Z - 0.71), P(X + 0.7, 1.9, Z - 0.71), P(X - 0.7, 1.9, Z - 0.71)], Z, auroraTint(STONE, 0.12), { wy0: 0.4 }));
  const pl = [P(X - 0.5, 1.3, Z - 0.71), P(X + 0.5, 1.3, Z - 0.71), P(X + 0.5, 0.75, Z - 0.71), P(X - 0.5, 0.75, Z - 0.71)]; raw(fillP(pl, BRASSD) + inkP(pl, 0.8));
  for (let i = 0; i < 3; i++) raw(pline([[pl[0][0] + 4, pl[0][1] + 4 + i * 4], [pl[1][0] - 4 - R() * 10, pl[0][1] + 4 + i * 4]], 0.8, '#2a2010', 0.8));
  raw(rime([P(X - 0.82, 2.1, Z - 0.82), P(X, 2.12, Z - 0.82), P(X + 0.82, 2.1, Z - 0.82)], Z, { th: 3, col: FROST }));
  // the feet: two ice stumps broken off at the ankle, clear blue, a brass pin through one; shards round them
  for (const dx of [-0.32, 0.28]) { const b = P(X + dx, 2.1, Z - 0.2), h = k * 0.42, w = k * 0.17; const q = [[b[0] - w, b[1]], [b[0] + w * 1.4, b[1]], [b[0] + w * 0.8, b[1] - h * 0.5], [b[0] + w * 0.5, b[1] - h], [b[0] - w * 0.3, b[1] - h * 0.8], [b[0] - w * 0.8, b[1] - h * 0.4]]; raw(cel(q, { Z, fill: '#b8d4e4', band: 2, shadow: '#6a8aa0' }) + line([[b[0] - w * 0.4, b[1] - h * 0.7], [b[0] + w * 0.2, b[1] - h * 0.95]], 1, '#ffffff', 0.7)); }
  for (const dx of [-0.6, 0.65]) raw(pline([P(X + dx, 2.1, Z - 0.5), P(X + dx, 2.4, Z - 0.5)], 2, INK));
  for (let i = 0; i < 12; i++) { const p = P(X + (R() - 0.5) * 3, 0.02, Z - 1 - R() * 3), r = 1.5 + R() * 3; raw(cel([[p[0] - r, p[1]], [p[0] + r, p[1] - r * 0.4], [p[0] + r * 0.2, p[1] - r]], { Z, fill: '#c4dcea', band: 1, inkW: 0.5 })); }
  // the drag: two deep troughs ploughed through the snow from the plinth toward the front, ice shards in them
  for (const dx of [-0.4, 0.4]) { const q = []; for (let z = Z - 1; z > 6.2; z -= 0.4) q.push(P(X + dx + (z - Z) * 0.25 + Math.sin(z) * 0.08, 0.02, z)); raw(line(q, 5, SNOWS, 0.8) + line(q.map(([x, y]) => [x, y + 2]), 1, '#5a6a78', 0.5)); }
}
raw(quiet([[240, 0.06], [280, 0.06], [320, 0.06]], { hop: 0.08, col: '#4a6070' }));
raw(frame('#1a2a36', { sides: [[90, 0.12], [40, 0.14]], top: [[60, 0.16]] }));

// ======================================================================== MID
layer('mid');
// a fallen pinnacle finial, broken in two in the snow
{ const Z = 10.8, X = -6.4, a = P(X, 0.2, Z), b = P(X + 1.4, 0.18, Z - 0.3), k = K(Z); raw(cel([[a[0], a[1] - k * 0.2], [b[0], b[1] - k * 0.1], [b[0] + k * 0.15, b[1]], [a[0], a[1] + k * 0.18]], { Z, fill: mix(STONE, '#4a5a68', 0.4), band: 3 }) + cel([[b[0] + k * 0.25, b[1] - k * 0.05], [b[0] + k * 0.8, b[1] - k * 0.02], [b[0] + k * 0.3, b[1] + k * 0.12]], { Z, fill: mix(STONE, '#4a5a68', 0.4), band: 2 }) + rime([[a[0], a[1] - k * 0.2], [b[0], b[1] - k * 0.1]], Z, { th: 2.5, col: FROST })); }
// a pilgrim's lantern dropped, its glass frosted white; the winding key's packing crate, split
{ const Z = 9.5, p = P(2.4, 0.12, Z), k = K(Z); raw(cel([[p[0] - k * 0.07, p[1]], [p[0] + k * 0.07, p[1]], [p[0] + k * 0.06, p[1] - k * 0.2], [p[0] - k * 0.06, p[1] - k * 0.2]], { Z, fill: '#c8d8e0', band: 1.5 }) + pline([[p[0] - k * 0.08, p[1] - k * 0.2], [p[0], p[1] - k * 0.28], [p[0] + k * 0.08, p[1] - k * 0.2]], 1.2, INK));
  raw(B.box(5.6, 6.6, 0, 0.5, 12, 12.7, { col: '#6a5a44' }) + rime([P(5.6, 0.5, 12), P(6.6, 0.5, 12)], 12, { th: 2.5, col: FROST })); }

// ======================================================================== FORE
layer('fore');
// left: the crown's buttress, close, stone with icicles from its offsets
{ const pts = [[-10, H + 5], [-10, -5], [40, -5], [44, 120], [58, 130], [56, 300], [66, 310], [70, H + 5]];
  raw(cel(pts, { Z: 3.2, fill: '#3a4654', band: 12, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.4"/>`);
  raw(rime([[-10, 116], [20, 120], [58, 130]], 3.2, { th: 6, col: FROST }) + icicles([[44, 128], [58, 132]], 3.2, { len: 60, dens: 1, col: FROST })); }
// right: a parapet pinnacle at the frame edge, its gargoyle spout rimed, a long icicle hanging from its mouth
{ const pts = [[W + 10, H + 5], [W + 10, -5], [W - 50, -5], [W - 56, 100], [W - 80, 110], [W - 82, 400], [W - 100, H + 5]];
  raw(cel(pts, { Z: 3.4, fill: '#3e4a58', band: 10, tex: 'url(#mottle)', texOp: 0.5 }) + `<path d="${p2(pts)}" fill="${S.hatchA(3)}" opacity="0.4"/>`);
  const g = [[W - 80, 150], [W - 150, 140], [W - 176, 150], [W - 160, 166], [W - 120, 170], [W - 80, 178]]; raw(cel(g, { Z: 3.4, fill: '#56626e', band: 5 }) + fillS(blob(W - 158, 150, 3, 2.4, 6, 0.2), '#141a20') + rime(g.slice(0, 4), 3.4, { th: 4, col: FROST }) + icicles([[W - 176, 152], [W - 168, 160]], 3.4, { len: 130, dens: 2, col: FROST }));
  { const ck = S.id('pb'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">` + burnA(W - 30, 0, 1.7, 120, 2.2, { depth: 3 }) + '</g>'); } }
raw(fillP([[-5, H + 5], [-5, H - 12], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 10 - Math.sin(k * 1.5) * 5 - R() * 4]), [W + 5, H - 12], [W + 5, H + 5]], '#a8bcc8', 0.9));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
