// World X, the Venom Spires: THE COMB (`hive_comb`, round 2, new). Battle room, Living Ink.
// Place: inside a working spire, in its brood comb (bible X: towers of grey paper comb; the hive feeds on everything;
// drones feed nectar to the hosts; galvanic beetles store lightning in their shells). Encounters: the Comb (drones and
// the hosts they feed), the Beetle Gallery (beetles crackling in the comb).
// Kind of space: enclosed interior, close and low: the round paper wall of the spire wraps the room, and the combs hang
// overhead as horizontal tiers on paper stalks, their cells opening downward over the fighters.
// Light: one source. A breach torn in the back wall lets in pale storm daylight; it falls in a slanting beam onto the
// floor comb. Everything else is warm paper dark, with venom-green nectar glinting in open cells.
// Shapes: horizontals (the comb tiers, the paper bands of the wall) and hexes; the curve of the wall; stalks.
// Palette key: warm and dark (chewed paper ochre-grey to brown-black), venom green accents, a cold white breach.
// Depth planes (far): the near tier overhead (cropped, 7-12 m), the far tiers and the core rod (13-20 m), the wall and
// the breach (19 m) with the storm sky beyond it (far).
// Lore placed: the hosts sealed into great cells in the wall, each a traveller in his cloak, larvae working under the
// skin (they hang head down like the brood); the spire's iron core rod, dragged up through the comb to catch the strike,
// scorched with white-violet ferns that run out over the cells; fused cells where a beetle discharged; drones' nectar
// balls cached in cells; the old floor comb, capped and trodden; dead drones and dropped larvae on it.
// Mid: a fallen comb fragment, a dead drone on its back, a nectar ball, a host's pack and staff.
// Fore: top: the near tier's broken edge and its stalk; left: a stalk pillar with a sealed host cell; right: the wall
// comb close up, a cocoon and paper flaps.
// No eyes (not a void world). No gold. No red.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'X');
const ROOM = 'hive_comb', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 10301, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e1610' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#120d0a' });
const { line, pline, fillP, fillS, inkP, inkS, blob, box, burn, fused, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#2a2018' });
const { pool, shaft, frame, comb } = G;

const PAPER = '#8a7c62', PAPERD = '#4a4032', PAPERDD = '#2a2219', VEN = '#93b24c', VEND = '#4e6a2a', VIO = '#d4c8f4', CHIT = '#16151c', MURK = B.MURK, DAY = '#d8d6e0';
const RW = 10, ZC = 9;                                             // the spire's wall: radius, centre depth
const wallAt = (s, t) => [RW * Math.sin(s / RW), t, ZC + RW * Math.cos(s / RW)];   // s = arc length (m), 0 straight ahead
const dk = (col, Z, k = 1) => mix(col, MURK, Math.min(0.7, Math.max(0, (Z - 6) / 22)) * k);
const BREACH = { s0: -6.2, s1: -2.4, t0: 1.6, t1: 6.2 };

// a cocooned host sealed into a great cell, head down like the brood: the cell's paper cap torn open at the lower end,
// the traveller's cloak and a hand hanging out, swellings shifting under the paper
function hostCell(at, s, t, Z, o = {}) {
  const sc = K(Z) * (o.k || 1), c = P(...at(s, t)), w = sc * 0.55 * (o.wk || 1), h = sc * 1.9; let out = '';
  const hx = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; hx.push([c[0] + Math.cos(a) * w * 1.05, c[1] + Math.sin(a) * h * 0.62]); }
  out += fillP(hx, mix(PAPERD, MURK, 0.3)) + fillP(hx.map(([x, y]) => [c[0] + (x - c[0]) * 0.8, c[1] + (y - c[1]) * 0.8]), '#0e0a08');
  const body = [[c[0] - w * 0.45, c[1] - h * 0.42], [c[0] + w * 0.45, c[1] - h * 0.42], [c[0] + w * 0.55, c[1] + h * 0.05], [c[0] + w * 0.35, c[1] + h * 0.38], [c[0] - w * 0.38, c[1] + h * 0.4], [c[0] - w * 0.55, c[1] + h * 0.02]];
  out += cel(body, { Z, fill: dk(o.col || '#7a705a', Z, 0.5), band: w * 0.35, tex: 'url(#mottle)', texOp: 0.5 });
  for (let k = 1; k < 6; k++) { const yy = c[1] - h * 0.42 + h * 0.8 * k / 6; out += `<path d="M${f1(c[0] - w * 0.5)} ${f1(yy)} Q${f1(c[0])} ${f1(yy + h * 0.05)} ${f1(c[0] + w * 0.5)} ${f1(yy - h * 0.02)}" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.5"/>`; }
  for (let k = 0; k < 3; k++) out += B.pustules(c[0] + (R() - 0.5) * w * 0.6, c[1] + (R() - 0.5) * h * 0.4, w * 0.25, 2, mix(VEN, '#d8d4b8', 0.4), Z);
  // the cloak's hem and a hand hanging out of the torn lower cap, the hat brim fallen against the cell lip
  out += fillP([[c[0] - w * 0.4, c[1] + h * 0.38], [c[0] + w * 0.3, c[1] + h * 0.36], [c[0] + w * 0.2, c[1] + h * 0.55], [c[0] - w * 0.1, c[1] + h * 0.5], [c[0] - w * 0.35, c[1] + h * 0.58]], dk('#4a3a2a', Z, 0.6)) + inkP([[c[0] - w * 0.4, c[1] + h * 0.38], [c[0] - w * 0.35, c[1] + h * 0.58], [c[0] - w * 0.1, c[1] + h * 0.5], [c[0] + w * 0.2, c[1] + h * 0.55], [c[0] + w * 0.3, c[1] + h * 0.36]], 0.6);
  if (o.hand !== false) out += line([[c[0] + w * 0.05, c[1] + h * 0.45], [c[0] + w * 0.1, c[1] + h * 0.68]], Math.max(1.4, w * 0.2), INK) + line([[c[0] + w * 0.05, c[1] + h * 0.45], [c[0] + w * 0.1, c[1] + h * 0.68]], Math.max(0.8, w * 0.12), '#b4ae94');
  out += `<path d="${p2(hx)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(0.7, inkW(Z)))}"/>` + line([hx[0], hx[1], hx[2]], Math.max(0.8, inkW(Z)), mix(PAPER, '#f4ead0', 0.4), 0.5);
  return out;
}
// a comb tier hanging overhead: a horizontal disc of cells at height Y, centre (X, Z), radius r (m), seen from below:
// the cells open downward (a hex grid in the underside plane), the rim a thick ring of layered paper (its side face lit
// toward the upper left), the stalk rising from its centre. o.cut: a bite of the near edge broken away.
function tier(X, Y, Z, r, o = {}) {
  const N = 44, rim = []; for (let k = 0; k < N; k++) { const a = k / N * Math.PI * 2, m = 1 + 0.06 * Math.sin(a * 3 + X) + (R() - 0.5) * 0.05; rim.push([X + Math.cos(a) * r * m, Z + Math.sin(a) * r * m * (o.squash || 1)]); }
  const th = o.th || 0.45, under = rim.map(([x, z]) => P(x, Y, z)), upper = rim.map(([x, z]) => P(x, Y + th, z));
  let s = '';
  // the rim's side face: the paper wall of the tier, banded, darker on its right
  const side = [...upper, ...under.slice().reverse()];
  s += fillP(upper, mix(o.col || PAPER, MURK, 0.25)) + cel(under, { Z, fill: dk(mix(o.col || PAPER, PAPERD, 0.5), Z, 0.6), band: 3, tex: 'url(#mottle)', texOp: 0.4 });
  for (let k = 0; k < N; k++) { const a = under[k], b = under[(k + 1) % N], c = upper[(k + 1) % N], d = upper[k]; if ((b[1] - a[1]) * 0 + 1 && Math.min(a[1], b[1]) > Math.max(c[1], d[1]) - 0.1) s += cel([a, b, c, d], { Z, fill: dk(S.tone(o.col || PAPER, 0.15), Z, 0.5), band: 1, hi: false, inkW: 0.5 }); }
  const ck = S.id('ti'); s += `<clipPath id="${ck}"><path d="${p2(under)}"/></clipPath><g clip-path="url(#${ck})">`;
  s += comb((u, v) => [X + u, Y - 0.01, Z + v], -r * 1.1, r * 1.1, -r * 1.1, r * 1.1, o.cell || 0.16, { wall: dk(o.col || PAPER, Z, 0.55), capP: 0.38, larvaP: 0.15, nectarP: 0.06, capCol: dk('#cfc4a4', Z, 0.5), grub: dk('#cdc6a6', Z, 0.6) });
  // the underside away from the light: a shadow band on the near-right, hatched
  s += `<path d="${p2(under)}" fill="${S.hatchA(Z)}" opacity="0.35"/><path d="${p2(under)}" fill="#120c08" opacity="0.28"/>`;
  if (o.burnAt) for (const [u, v, a, L] of o.burnAt) { const p = P(X + u, Y, Z + v); s += burn(p[0], p[1], a, L, 2.2, { core: VIO, depth: 3 }); }
  s += '</g>' + `<path d="${p2(under)}" fill="none" stroke="${INK}" stroke-width="${f1(Math.max(1, inkW(Z) * 1.2))}"/>`;
  return { svg: s, under, upper };
}
// a paper stalk (the pedicel) between two heights at (X, Z): a flared column of layered paper, ink, a band
function stalk(X, Z, y0, y1, r, col = PAPERD) {
  const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10, Y = y0 + (y1 - y0) * t, w = r * (1 + 0.9 * Math.pow(Math.abs(t - 0.5) * 2, 3)); pts.push([t, Y, w]); }
  const L = pts.map(([t, Y, w]) => P(X - w, Y, Z)), Rr = pts.map(([t, Y, w]) => P(X + w, Y, Z));
  let s = cel([...L, ...Rr.reverse()], { Z, fill: col, band: Math.max(1.5, K(Z) * r * 0.6), tex: 'url(#mottle)', texOp: 0.5 });
  for (let k = 1; k < 10; k++) { const a = L[k], b = Rr[10 - k]; s += pline([a, [(a[0] + b[0]) / 2, a[1] + 1.5], b], 0.6, INK, 0.45); }
  return s;
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the storm sky seen through the breach (drawn first, the wall cuts round it)
{ const q = []; for (let k = 0; k <= 20; k++) q.push(wallAt(BREACH.s0 + (BREACH.s1 - BREACH.s0) * k / 20, BREACH.t1 + 0.6)); const top = q.map(p => P(...p)), bot = q.map(p => P(p[0], BREACH.t0 - 0.5, p[2]));
  raw(fillP([...top, ...bot.reverse()], '#a8a4b8'));
  const c = P(...wallAt((BREACH.s0 + BREACH.s1) / 2, 4)); raw(pool(c[0], c[1] + 10, 80, 80, '#f0eef6', { n: 4, op: 0.3 }));
  // spires far off across the plain, seen through the tear
  for (const [x, h, w] of [[c[0] - 50, 70, 10], [c[0] - 18, 46, 7], [c[0] + 30, 90, 12], [c[0] + 64, 52, 8]]) raw(fillP([[x - w, c[1] + 60], [x - w * 0.4, c[1] + 60 - h * 0.6], [x + 1, c[1] + 60 - h], [x + w * 0.4, c[1] + 60 - h * 0.55], [x + w, c[1] + 60]], '#7a748a', 0.9));
  let d = ''; for (let k = 0; k < 40; k++) { const x = c[0] - 90 + R() * 180, y = c[1] - 60 + R() * 60; d += `M${f1(x)} ${f1(y)} l${f1(4)} ${f1(22)} `; } raw(`<path d="${d}" stroke="#8a86a0" stroke-width="0.6" opacity="0.5"/>`); }
// ---- the spire's round wall: layered paper bands, each panel its own tone; dark with depth and away from the breach;
// comb built over it in patches; host cells sealed into it; the breach torn through it
{
  const sA = -16, sB = 16, bc = (BREACH.s0 + BREACH.s1) / 2;
  // bands of chewed paper laid round the wall, each its own depth and tone, the lower lip of each scalloped where the
  // wasps added a mouthful at a time; within a band, patches of fresher (paler) and older (darker) paper
  const rows = []; for (let t = -0.2; t < 15; t += 0.28 + R() * 0.32) rows.push(t);
  const dark = (s, t) => Math.min(1, Math.hypot((s - bc) / 9, (t - 4) / 6));
  for (let j = 0; j < rows.length - 1; j++) {
    const t0 = rows[j], t1 = rows[j + 1], M = 64, lo = [], hi = [];
    for (let k = 0; k <= M; k++) { const s = sA + (sB - sA) * k / M, sc = Math.abs(Math.sin((s * 2.6 + j * 1.7))) * 0.09; lo.push(wallAt(s, t0 - sc)); hi.push(wallAt(s, t1)); }
    const Z = 16, col = dk(S.tone(PAPER, 0.12), Z, 0.6);
    raw(fillP([...lo.map(p => P(...p)), ...hi.reverse().map(p => P(...p))], col));
    for (let k = 0; k < 6; k++) { const s0 = sA + R() * (sB - sA), w = 1 + R() * 3, q = []; for (let i = 0; i <= 8; i++) q.push(P(...wallAt(s0 + w * i / 8, t0 + (t1 - t0) * (0.15 + 0.2 * Math.sin(i)))));
      for (let i = 8; i >= 0; i--) q.push(P(...wallAt(s0 + w * i / 8, t1 - 0.03))); raw(fillS(q, R() < 0.4 ? '#c8bc9a' : '#1a140e', 0.1, 0.4)); }
    const lip = lo.map(p => P(...p)); raw(line(lip, 0.9, INK, 0.7) + line(lip.map(([x, y]) => [x, y + 1.1]), 0.7, '#e8dcbc', 0.35));
  }
  raw(`<path d="${pp([wallAt(sA, 0), wallAt(sB, 0), wallAt(sB, 15), wallAt(sA, 15)])}" fill="url(#mottle)" opacity="0.35"/>`);
  // darkness away from the breach: stepped hatch, laid in the wall
  for (const [lim, op, ang] of [[0.3, 0.4, 0.7], [0.55, 0.4, -0.8], [0.75, 0.35, 0.2]]) raw(hatch3(wallAt, sA, sB, -0.2, 15, ang, { op, keep: (s, t) => dark(s, t) > lim + (R() - 0.5) * 0.1 }));
  { const q = []; for (let k = 0; k <= 30; k++) { const a = k / 30 * Math.PI * 2, m = 0.75 + R() * 0.2; q.push(P(...wallAt(bc + Math.cos(a) * 3.2 * m, 4 + Math.sin(a) * 3.4 * m))); } raw(fillS(q, '#e8dcc0', 0.12, 0.4)); }
  // the breach's torn rim: paper flaps curling inward, a lit edge where the day comes through
  const rim = []; for (let k = 0; k < 30; k++) { const a = k / 30 * Math.PI * 2, m = 0.85 + R() * 0.25; rim.push(wallAt((BREACH.s0 + BREACH.s1) / 2 + Math.cos(a) * (BREACH.s1 - BREACH.s0) / 2 * m, (BREACH.t0 + BREACH.t1) / 2 + Math.sin(a) * (BREACH.t1 - BREACH.t0) / 2 * m)); }
  const rimS = rim.map(p => P(...p)), outer = rim.map(p => { const c = wallAt((BREACH.s0 + BREACH.s1) / 2, (BREACH.t0 + BREACH.t1) / 2); return P(c[0] + (p[0] - c[0]) * 1.35, c[1] + (p[1] - c[1]) * 1.3, p[2]); });
  // fill between the breach rim and the surrounding panels (paper around the tear), then cut the hole by re-drawing sky
  raw(fillP(outer, dk(PAPER, 19, 0.4)) + `<path d="${p2(outer)}" fill="url(#mottle)" opacity="0.4"/>`);
  { const q = []; for (let k = 0; k <= 20; k++) q.push(wallAt(BREACH.s0 + (BREACH.s1 - BREACH.s0) * k / 20, BREACH.t1 + 0.6)); const top = q.map(p => P(...p)), bot = q.map(p => P(p[0], BREACH.t0 - 0.5, p[2])), ck = S.id('br');
    raw(`<clipPath id="${ck}"><path d="${smooth(rimS, true, 0.3)}"/></clipPath><g clip-path="url(#${ck})">${fillP([...top, ...bot.reverse()], '#b4b0c4')}`);
    const c = P(...wallAt((BREACH.s0 + BREACH.s1) / 2, 4)); raw(pool(c[0] + 10, c[1] + 10, 70, 70, '#f6f4fa', { n: 4, op: 0.35 }));
    for (const [x, h, w] of [[c[0] - 50, 60, 9], [c[0] - 14, 40, 6], [c[0] + 34, 84, 11], [c[0] + 70, 48, 8]]) raw(fillP([[x - w, c[1] + 70], [x - w * 0.5, c[1] + 70 - h * 0.6], [x - w * 0.15, c[1] + 70 - h * 0.85], [x + 1, c[1] + 70 - h], [x + w * 0.4, c[1] + 70 - h * 0.55], [x + w, c[1] + 70]], '#8a849a', 0.9) + line([[x + 1, c[1] + 70 - h], [x + 1, c[1] + 64 - h - 6]], 1, '#5a5468'));
    let d = ''; for (let k = 0; k < 50; k++) { const x = c[0] - 90 + R() * 180, y = c[1] - 90 + R() * 120; d += `M${f1(x)} ${f1(y)} l${f1(3)} ${f1(18)} `; } raw(`<path d="${d}" stroke="#8a86a0" stroke-width="0.6" opacity="0.5"/></g>`); }
  for (let k = 0; k < rimS.length; k++) { if (R() < 0.45) continue; const a = rimS[k], b = rimS[(k + 1) % rimS.length], c = P(...wallAt((BREACH.s0 + BREACH.s1) / 2, (BREACH.t0 + BREACH.t1) / 2)), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], tip = [m[0] + (c[0] - m[0]) * (0.12 + R() * 0.15), m[1] + (c[1] - m[1]) * (0.12 + R() * 0.15) + 4];
    raw(cel([a, tip, b], { Z: 19, fill: dk(mix(PAPER, '#c8bea4', 0.3), 19, 0.3), band: 1.5, inkW: 0.6 })); }
  raw(`<path d="${smooth(rimS, true, 0.3)}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + line(rimS.slice(14, 26), 1, '#f0ece0', 0.7));
  // comb built over the wall in patches, and the hosts sealed into it
  for (const [s0, s1, t0, t1] of [[-15, -8, 0.2, 3.2], [3.5, 13, 0.3, 4.2], [-13, -7.5, 6.8, 10], [1, 7, 7.5, 11]])
    raw(comb(wallAt, s0, s1, t0, t1, 0.24, { wall: dk(PAPERD, 16, 0.75), capP: 0.4, larvaP: 0.15, nectarP: 0.08, capCol: dk('#a89c7e', 16, 0.8), grub: dk('#cdc6a6', 16, 0.6), keep: (s, t) => R() < 0.9 }));
  for (const [s, t, k, wk, hand] of [[-11, 1.4, 1.0, 1.0, true], [-9.1, 1.75, 0.8, 1.15, false], [5.5, 1.45, 1.2, 0.9, true], [7.7, 1.2, 0.9, 1.25, false], [10.4, 1.7, 1.05, 1.0, true], [-14.2, 1.1, 0.85, 1.1, false]]) raw(hostCell(wallAt, s, t, wallAt(s, t)[2], { k, wk, hand }));
  // one cell torn open and empty: the host has walked out of it (the puppet hosts), paper flaps hanging
  { const c = P(...wallAt(2.4, 1.6)), k = K(16); raw(fillS(blob(c[0], c[1], k * 0.5, k * 1.1, 10, 0.3), '#0c0806') + cel([[c[0] - k * 0.5, c[1] + k * 0.9], [c[0] - k * 0.2, c[1] + k * 0.95], [c[0] - k * 0.35, c[1] + k * 1.5]], { Z: 16, fill: dk(PAPER, 16, 0.6), band: 1.5 }) + cel([[c[0] + k * 0.15, c[1] - k * 1.0], [c[0] + k * 0.5, c[1] - k * 0.8], [c[0] + k * 0.55, c[1] - k * 0.3]], { Z: 16, fill: dk(PAPER, 16, 0.6), band: 1.5 })); }
}
// the beam: the breach's daylight slanting down to the right onto the floor comb
{ const a0 = P(...wallAt(BREACH.s0 + 0.6, BREACH.t1 - 0.4)), a1 = P(...wallAt(BREACH.s1 - 0.3, BREACH.t1 - 0.8)), b0 = P(-1.6, 0, 9.5), b1 = P(1.4, 0, 8.2);
  raw(shaft(a0, a1, b0, b1, '#e8e6ee', { n: 4, op: 0.06, motes: 60, mote: '#f4f2f8', moteOp: 0.55 })); }
// ---- the floor: the oldest comb, its cells capped and trodden flat; a pool of the beam's light on it; spills
{
  raw(`<path d="${pp([[-30, 0, 3.5], [30, 0, 3.5], [30, 0, 22], [-30, 0, 22]])}" fill="${dk(PAPERD, 10, 0.4)}"/>`);
  raw(comb((u, v) => [u, 0, v], -14, 14, 3.4, 20, 0.34, { wall: dk(PAPERD, 10, 0.5), capP: 0.75, larvaP: 0, nectarP: 0.04, capCol: dk('#8a7c5e', 10, 0.5), voidCol: '#140e0a', dark: true }));
  raw(hatch3((s, t) => [-16 + s, 0, 3.4 + t], 0, 32, 0, 4, 0.3, { op: 0.4, ragged: 0.3 }));
  const c = P(-0.2, 0, 9); raw(pool(c[0], c[1], 150, 18, '#e8e4dc', { n: 4, op: 0.1 }));
  for (const [X, Z, w] of [[2.4, 8.5, 0.8], [-4.4, 11, 0.6], [5.6, 12.5, 1]]) raw(G.puddle(X, Z, w, w * 0.6, VEND, { lit: '#c8dc8a', op: 0.75 }));
  raw(G.bandFloor(-14, 14, { col: dk(PAPERD, 8, 0.4), wear: '#6e6250', debrisCol: '#5a4e3c', cracks: 3 }));
  // dead drones and dropped larvae lying on the floor comb
  for (let k = 0; k < 12; k++) { const X = -9 + R() * 18, Z = 8 + R() * 10, p = P(X, 0.05, Z), r = K(Z) * 0.08; raw(R() < 0.5 ? fillS(blob(p[0], p[1], r * 1.4, r * 0.8, 8, 0.3), '#1a1816') + line([[p[0] - r, p[1] - r * 0.4], [p[0] + r * 0.3, p[1] - r]], 0.6, '#9a96a0', 0.6) : `<path d="M${f1(p[0] - r)} ${f1(p[1])} q${f1(r)} ${f1(-r * 1.2)} ${f1(r * 2)} 0" stroke="${INK}" stroke-width="${f1(r * 0.9)}" fill="none" stroke-linecap="round"/><path d="M${f1(p[0] - r)} ${f1(p[1])} q${f1(r)} ${f1(-r * 1.2)} ${f1(r * 2)} 0" stroke="#cac4a8" stroke-width="${f1(r * 0.55)}" fill="none" stroke-linecap="round"/>`); }
}
// ---- the core: the spire's iron rod, dragged up through the comb to catch the strike, scorched, ferns burned out
// from it over the cells; fused cells round its foot where a beetle discharged
{ const X = 2.6, Z = 15.5, a = P(X, 0, Z), b = P(X + 0.1, 14, Z);
  raw(line([a, b], K(Z) * 0.12, INK) + line([a, b], K(Z) * 0.07, '#3a3634') + line([[a[0] - 1, a[1]], [b[0] - 1, b[1]]], 0.8, '#8a8690', 0.5));
  // burns run down the rod itself (a scar along the iron, clipped to it), never into the air
  { const ck = S.id('rb'); raw(`<clipPath id="${ck}"><path d="M${f1(a[0] - K(Z) * 0.07)} ${f1(a[1])} L${f1(b[0] - K(Z) * 0.07)} ${f1(b[1])} L${f1(b[0] + K(Z) * 0.07)} ${f1(b[1])} L${f1(a[0] + K(Z) * 0.07)} ${f1(a[1])} Z"/></clipPath><g clip-path="url(#${ck})">` + burn(b[0], P(X, 6, Z)[1], Math.PI / 2, 160, 1.6, { core: VIO, depth: 3, spread: 0.2 }) + '</g>'); }
  raw(fused(a[0], a[1] - 4, 7, '#4a4440', Z) + fused(...P(X, 2.4, Z), 4, '#4a4440', Z)); }
// ---- the tiers overhead: the far tier high on the left over the breach, the right tier lower, their stalks to the core
{
  const T2 = tier(-5.5, 8.2, 15, 6, { th: 0.6, cell: 0.2, burnAt: [[4.5, 0, 2.6, 60]] });
  raw(stalk(-5.5, 15, 8.8, 14, 0.35));
  raw(T2.svg);
  const T1 = tier(4.6, 4.3, 13, 4.6, { th: 0.5, cell: 0.17, burnAt: [[-2, -1, 2.8, 70], [-2.2, 0.5, 3.6, 50]] });
  raw(stalk(4.6, 13.2, 4.8, 9.5, 0.3));
  raw(T1.svg);
  // drones' nectar balls cached on the tier rims, a host hung under the right tier by its ankles like brood
  const p = P(6.4, 4.3, 10.4); raw(line([p, [p[0], p[1] + 24]], 0.8, INK) + B.lump(blob(p[0], p[1] + 44, 9, 22, 10, 0.25), 10.4, dk('#6e644e', 10.4, 0.4), { band: 4 }) + B.pustules(p[0], p[1] + 44, 7, 3, mix(VEN, '#d8d4b8', 0.4), 10.4));
}
raw(frame('#0e0a07', { sides: [], top: [[150, 0.22], [110, 0.22], [70, 0.2]] }));
raw(quiet([[234, 0.2], [262, 0.18], [296, 0.15], [345, 0.12]], { hop: 0.2 }));
raw(frame('#0a0705', { sides: [[140, 0.2], [80, 0.22], [36, 0.25]], top: [[80, 0.22], [40, 0.24]], bottom: [[30, 0.25]] }));

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// a fallen comb fragment, tipped on its edge, cells to us
{ const Z = 11, X = -6.2; const q = [P(X - 1.1, 0, Z), P(X + 0.9, 0, Z - 0.3), P(X + 0.8, 0.75, Z - 0.2), P(X - 0.2, 1.0, Z), P(X - 1.0, 0.6, Z + 0.1)];
  raw(fillP(q, mix(PAPERD, MURK, 0.45))); const ck = S.id('fc'); raw(`<clipPath id="${ck}"><path d="${p2(q)}"/></clipPath><g clip-path="url(#${ck})">` + comb((u, v) => [X + u, v, Z], -1.2, 1, 0, 1.1, 0.13, { wall: mix(PAPERD, MURK, 0.4), capCol: mix('#8a7c5e', MURK, 0.5), nectarP: 0.15, nectar: '#3e5222', nectarL: '#6a8838' }) + `</g><path d="${p2(q)}" fill="none" stroke="${INK}" stroke-width="1.1"/>`); }
// a dead drone on its back, legs up; a nectar ball dropped beside it
{ const Z = 10.2, p = P(5.4, 0.25, Z), r = K(Z) * 0.25; raw(cel(blob(p[0], p[1], r * 1.3, r * 0.8, 12, 0.2), { Z, fill: '#1e1c22', band: 3 }));
  for (let k = 0; k < 6; k++) { const x = p[0] - r * 0.8 + k * r * 0.32; raw(pline([[x, p[1] - r * 0.6], [x + (R() - 0.5) * 4, p[1] - r * 1.4], [x + (R() - 0.5) * 6, p[1] - r * 1.7]], 1.1, INK)); }
  const q = P(6.3, 0.15, Z - 0.3); raw(cel(blob(q[0], q[1], r * 0.6, r * 0.55, 10, 0.2), { Z, fill: mix(VEND, MURK, 0.3), band: 2 }) + line([[q[0] - r * 0.3, q[1] - r * 0.25], [q[0], q[1] - r * 0.4]], 1, '#b4c878', 0.6)); }
// a host's pack and staff left at the foot of the wall
{ const Z = 12.5, a = P(-2.6, 0.03, Z), b = P(-1.0, 0.05, Z - 0.4); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, mix('#6a5638', MURK, 0.5)));
  const p = P(-3.4, 0.25, Z); raw(cel(blob(p[0], p[1], 9, 7, 10, 0.25), { Z, fill: mix('#5a4a36', MURK, 0.5), band: 2 })); }

// ======================================================================== FORE
layer('fore');
// top: the near tier's broken underside, very close, cropped by the frame top: big cells opening down, a torn edge
{ const N = 30, X = -1.2, Z = 5.6, Y = 3.8, r = 4.2, pts = []; for (let k = 0; k <= N; k++) { const a = Math.PI * (1.05 + 0.9 * k / N); pts.push(P(X + Math.cos(a) * r * (1 + (R() - 0.5) * 0.08), Y, Z + 2 + Math.sin(a) * r * 0.55)); }
  const poly = [[-10, -10], ...pts.filter(p => p[1] > -10), [W + 10, -10]];
  raw(fillP(poly, '#2a2219')); const ck = S.id('nt'); raw(`<clipPath id="${ck}"><path d="${p2(poly)}"/></clipPath><g clip-path="url(#${ck})">` + comb((u, v) => [u, Y, v], -12, 12, 2, 9, 0.3, { wall: '#4a4032', capCol: '#7a6e56', capP: 0.35, larvaP: 0.2, nectarP: 0.06, grub: '#8a826a', voidCol: '#0a0706' }) + `<path d="${p2(poly)}" fill="${S.hatchA(4)}" opacity="0.45"/><path d="${p2(poly)}" fill="#0c0806" opacity="0.3"/></g>`);
  raw(line(pts, 3.2, INK) + line(pts.map(([x, y]) => [x, y + 2]), 1.2, '#8a7c62', 0.6));
  // torn paper flaps hanging from the broken edge
  for (let k = 0; k < 9; k++) { const p = pts[Math.floor(R() * pts.length)]; if (p[1] < 0) continue; const L = 14 + R() * 26; raw(cel([[p[0] - 6, p[1]], [p[0] + 6, p[1]], [p[0] + 2 + (R() - 0.5) * 6, p[1] + L]], { Z: 5, fill: '#5a4e3c', band: 2 })); } }
// left: a paper stalk pillar with a sealed host cell, a drone's nectar stain running down
{ const pts = [[-10, H + 5], [-10, -5], [70, -5], [58, 60], [52, 140], [56, 240], [62, 330], [80, 420], [104, H + 5]];
  raw(cel(pts, { Z: 3.4, fill: '#3a3024', band: 12 }) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.5"/>`);
  const ck = S.id('lp'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">`);
  for (let y = 0; y < H; y += 9 + R() * 12) { const q = []; for (let k = 0; k <= 6; k++) q.push([-10 + k * 20, y + Math.sin(k * 1.3 + y) * 4 + k * 1.2]); raw(line(q, 1.4, INK, 0.65) + line(q.map(([x, yy]) => [x, yy + 2]), 0.7, '#a89a7c', 0.35)); }
  raw(`<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.5"/>` + line([[40, 170], [44, 230], [41, 300], [46, 360]], 4, VEND, 0.6) + '</g>');
  raw(B.pustules(30, 120, 14, 4, mix(VEN, '#d8d4b8', 0.4), 3.4)); }
// right: the wall's comb close up, a cocoon hung from it, paper flaps
{ const pts = [[W + 10, H + 5], [W + 10, -5], [W - 70, -5], [W - 60, 80], [W - 76, 170], [W - 64, 270], [W - 84, 360], [W - 110, H + 5]];
  raw(fillP(pts, '#2e261c')); const ck = S.id('rc'); raw(`<clipPath id="${ck}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${ck})">` + comb((u, v) => [3.4 + u * 0.15, v, 3.6 + u], -1, 1, 0, 4.5, 0.14, { wall: '#4a4032', capCol: '#7a6e56', capP: 0.4, larvaP: 0.2, nectarP: 0.08, grub: '#8a826a', voidCol: '#0a0706' }) + `<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.4"/></g>`);
  raw(`<path d="${p2(pts)}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  raw(line([[W - 120, -5], [W - 118, 40]], 1.2, INK) + B.lump(blob(W - 118, 82, 15, 40, 12, 0.2), 4, '#6e644e', { band: 5 }) + B.pustules(W - 118, 84, 12, 4, mix(VEN, '#d8d4b8', 0.4), 4)); }
raw(fillP([[-5, H + 5], [-5, H - 14], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 12 - Math.sin(k * 1.7) * 5 - R() * 5]), [W + 5, H - 14], [W + 5, H + 5]], '#120c08', 0.92));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
