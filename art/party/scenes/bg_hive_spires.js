// World X, the Venom Spires: THE OUTER SPIRES (`hive_spires`, round 2; was `hive_road`). Battle room, Living Ink.
// Place: where the plain road runs into the forest of spires (bible X: a plain of travellers' roads; lightning struck it
// and the insects built towers to catch it). Encounters here: wasps drifting between the towers, the web fields where
// spiders wait for the lightning to bring them food, the duelling ground where the mantis bows.
// Kind of space: open exterior, vast, the road running straight away into depth.
// Light: storm at dusk. The cloud deck is black overhead; under its base, on the horizon, a band of pale white-violet
// sky is the light focus; the far spires stand against it, fading into the air. No bolts: the strikes show as scorch.
// Shapes: verticals of many kinds (bulb, tiered, broken, twin, flared), never a field of cones; webs strung between them.
// Palette key: cool violet-grey, dark overhead, light at the horizon. Chitin black, venom green, white-violet; dust, paper.
// Depth planes (far): near spires at 22-40 m with webs between them; a middle cluster at 55-90 m; a distant forest at
// 120-260 m dissolving into the horizon light; the road converging to the horizon.
// Mid: the toppled milestone, the overturned cart, the fencing school's practice post (the duelling ground), staff and gourd.
// Fore: left the root of a near spire (paper bands, flight hole, a wasp, a bound traveller); right the bent waypost with a
// cocoon and a torn web strung from it to the frame top; dry thistles; dust along the front edge.
// No eyes (not a void world). No red except the mantis sash (not drawn here). No gold.
// Usage: node scenes/bg_hive_spires.js [outDir]
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'X');
const ROOM = 'hive_spires', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 10201, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#22202a' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#121216' });
const { fog, line, pline, fillP, fillS, inkP, inkS, blob, box, burn, fused, quiet, skyBands } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#8c84a0' });
const MV = require('./materials_v2')(S);
const { air, pool, frame, cloud, spire, web, joints } = G;

const CHIT = '#16151c', VEN = '#93b24c', VEND = '#4e6a2a', VIO = '#d4c8f4', PAPER = '#8c877a', PAPERD = '#5c5850', EARTH = '#5e5442', DUST = '#8a8270', MURK = B.MURK;
const HORIZ = '#cfc5dc';

// a traveller bound in grey paper and hung on a spire flank (from round 1, unchanged in look)
function cocoon(x, y, len, Z, o = {}) {
  const w = len * 0.2, prof = [0.35, 0.5, 0.62, 0.7, 0.78, 0.92, 1.0, 0.95, 0.7, 0.75, 0.6, 0.0], Lp = [], Rp = [];
  prof.forEach((m, i) => { const t = i / (prof.length - 1), yy = y + len * t, sway = Math.sin(t * 2.4) * w * 0.25; Lp.push([x + sway - w * m * (1 + (R() - 0.5) * 0.08), yy]); Rp.push([x + sway + w * m * (1 + (R() - 0.5) * 0.08), yy]); });
  const pts = [...Lp, ...Rp.reverse()];
  let s = pline([[x, y - len * 0.18], [x + 1, y + 1]], Math.max(0.8, len * 0.03), INK) + cel(pts, { Z, fill: o.col || mix(PAPER, '#c8c2b2', 0.15), band: w * 0.45 }) + `<path d="${smooth(pts, true, 0.4)}" fill="url(#mottle)" opacity="0.4"/>`;
  for (let k = 1; k < 8; k++) { const yy = y + len * k / 8.5, ww = w * 1.05; s += `<path d="M${f1(x - ww)} ${f1(yy + len * 0.03)} Q${f1(x)} ${f1(yy - len * 0.05)} ${f1(x + ww)} ${f1(yy + len * 0.02)}" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.55"/>`; }
  for (let k = 0; k < 3; k++) { const xx = x + (R() - 0.5) * w * 1.1, y0 = y + len * (0.3 + R() * 0.3); s += line([[xx, y0], [xx + (R() - 0.5) * 2, y0 + len * (0.15 + R() * 0.2)]], Math.max(1, w * 0.22), VEND, 0.55) + line([[xx, y0], [xx, y0 + len * 0.12]], Math.max(0.6, w * 0.1), VEN, 0.6); }
  if (o.limb) s += line([[x - w * 0.6, y + len * 0.5], [x - w * 1.0, y + len * 0.68], [x - w * 0.9, y + len * 0.82]], Math.max(1.2, w * 0.28), INK) + line([[x - w * 0.6, y + len * 0.5], [x - w * 1.0, y + len * 0.68], [x - w * 0.9, y + len * 0.82]], Math.max(0.7, w * 0.17), '#8a9070');
  return s;
}
function wasp(x, y, r, a = 0) { const c = Math.cos(a), s2 = Math.sin(a), T = (u, v) => [x + u * c - v * s2, y + u * s2 + v * c];
  return `<path d="${p2([T(-r, 0), T(-r * 0.3, -r * 0.3), T(r * 0.4, -r * 0.2), T(r, 0), T(r * 0.4, r * 0.25), T(-r * 0.3, r * 0.3)])}" fill="${CHIT}"/>` + pline([T(-r * 0.6, -r * 0.2), T(-r * 0.6, r * 0.2)], Math.max(0.5, r * 0.15), VEN) + `<ellipse cx="${f1(T(r * 0.1, -r * 0.6)[0])}" cy="${f1(T(r * 0.1, -r * 0.6)[1])}" rx="${f1(r * 0.6)}" ry="${f1(r * 0.25)}" fill="#d8d4e0" fill-opacity="0.35" stroke="${INK}" stroke-width="0.4"/>`; }

// ======================================================================== FAR
layer('far');
// ---- sky: black storm deck overhead stepping down to the pale band under the cloud base at the horizon
raw(`<rect width="${W}" height="${H}" fill="#18161f"/>`);
raw(G.sky([[0, '#18161f'], [0.25, '#221f2b'], [0.5, '#2e2a38'], [0.68, '#4a4458'], [0.8, '#6e667e'], [0.9, '#a69cb6'], [1, HORIZ]]));
raw(`<rect width="${W}" height="90" fill="${S.hatchA(30)}" opacity="0.25"/>`);
// the light itself: a stepped glare low on the horizon, right of centre, where the cloud base lifts
raw(pool(880, 258, 680, 60, '#f6f0fc', { n: 6, op: 0.3 }) + pool(900, 262, 320, 26, '#ffffff', { n: 4, op: 0.25 }));
// the cloud deck: heavy masses, every one its own billowed lump, darker and bigger overhead; a lower broken row of
// ragged masses lit from below on their bellies; rain hanging out of two of them
for (const [cx, cy, w, h, col] of [[180, 30, 520, 120, '#24212c'], [640, 12, 620, 110, '#211e28'], [1150, 26, 640, 130, '#25222d'], [430, 96, 360, 80, '#2e2a38'], [1360, 110, 300, 70, '#2f2b39'], [850, 120, 420, 60, '#34303f']])
  raw(cloud(cx, cy, w, h, col, { lit: '#bcb4d0', ink: 1.4 }));
for (let i = 0; i < 9; i++) raw(G.softMass(R() * W, 172 + R() * 26, 140 + R() * 260, 34, '#2c2836', { op: 0.9 }));
{ let d = ''; for (let k = 0; k < 160; k++) { const near = R() < 0.5, x = near ? 1120 + R() * 260 : 300 + R() * 220, y = 200 + R() * 15, l = 30 + R() * 50; d += `M${f1(x)} ${f1(y)} l${f1(l * 0.14)} ${f1(l)} `; } raw(`<path d="${d}" stroke="#8a8498" stroke-width="0.6" opacity="0.32"/>`); }
// ---- the plain: ground to the horizon, darker toward us
raw(`<path d="M0 ${300 - 1.5} L${W} ${300 - 1.5} L${W} ${H} L0 ${H} Z" fill="${mix(EARTH, MURK, 0.5)}"/>`);
for (const [Z0, Z1, c] of [[120, 900, mix(DUST, HORIZ, 0.55)], [60, 120, mix(DUST, '#5a5468', 0.5)], [30, 60, mix(DUST, MURK, 0.45)], [14, 30, mix(EARTH, MURK, 0.48)]]) raw(`<path d="${pp([[-400, 0, Z1], [400, 0, Z1], [400, 0, Z0], [-400, 0, Z0]])}" fill="${c}"/>`);
// ---- distant forest of spires (120-260 m): small, pale, low contrast against the light band; kinds and heights mixed
{
  const list = []; for (let i = 0; i < 26; i++) list.push([-260 + R() * 520, 120 + R() * 150]);
  list.sort((a, b) => b[1] - a[1]);
  const kinds = ['tiered', 'bulb', 'broken', 'flare', 'twin', 'tiered', 'flare'];
  for (const [X, Z] of list) { const h = 18 + R() * 46, k = kinds[Math.floor(R() * kinds.length)]; raw(spire(X, Z, h * (0.18 + R() * 0.12), h, { kind: k, crown: ['rod', 'cross', 'vane', 'wheel'][Math.floor(R() * 4)], holes: 0, nburn: 0, col: air(PAPERD, Z, { z1: 220, kmax: 0.72 }), collars: 2 }).svg); }
  // a veil of air over them, stepped, so they sink into the light
  raw(fillP([[-5, 200], [W + 5, 200], [W + 5, 302], [-5, 302]], HORIZ, 0.18));
}
// ---- middle cluster (55-95 m): grey-violet, with webs strung between the nearer pairs
{
  const mids = [[-40, 78, 6, 30, 'tiered', 'cross'], [-8, 66, 6.5, 34, 'twin', 'vane'], [20, 92, 5, 20, 'broken', 'rod'], [38, 72, 7, 38, 'flare', 'wheel'], [-66, 100, 7, 26, 'broken', 'rod']];
  const tops = [];
  for (const [X, Z, bw, h, kind, crown] of mids) { const sp = spire(X, Z, bw, h, { kind, crown, holes: 3, nburn: 1, col: air(mix(PAPERD, '#2a2832', 0.35), Z, { z1: 150, kmax: 0.6 }) }); raw(sp.svg); tops.push(sp); }
  // webs between neighbours at mid height: the web fields seen from afar
  for (const [a, b] of [[0, 1], [1, 3]]) { const A = tops[a].R[18], Bp = tops[b].L[14], c = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2 + 6]; raw(web(c, [A, Bp, tops[a].R[8], tops[b].L[22]], { r: Math.abs(Bp[0] - A[0]) * 0.42, n: 14, op: 0.35, col: '#d8d0e8', w: 0.45, prey: 2, preySz: 2.5, Z: 80 })); }
}
// ---- the near spires (22-40 m): the room's near structure. Left a tall tiered tower hung with the taken; right a bulb
// and a broken one, with the great web field strung between them over the road
const nearL = spire(-15.5, 30, 6.8, 28, { kind: 'tiered', crown: 'cross', holes: 8, nburn: 3, rodH: 3, col: mix(PAPERD, '#24222c', 0.38), lean: 0.03 });
const nearR = spire(14, 40, 7.0, 19, { kind: 'bulb', crown: 'vane', holes: 9, nburn: 3, rodH: 3, col: mix(PAPERD, '#2a2832', 0.3), lean: -0.04 });
const nearR2 = spire(26, 50, 6.4, 20, { kind: 'broken', holes: 5, nburn: 2, col: mix(PAPERD, '#3a3646', 0.3), droop: 1.1 });
raw(nearR2.svg); raw(nearR.svg); raw(nearL.svg);
for (const [t, len, limb] of [[0.3, 2.2, true], [0.46, 1.9, false], [0.6, 1.7, true]]) { const p = nearL.R[Math.round(t * 40)]; raw(cocoon(p[0] + 2, p[1], K(30) * len, 30, { limb })); }
for (const [t, len] of [[0.38, 2.0], [0.55, 1.6]]) { const p = nearL.L[Math.round(t * 40)]; raw(cocoon(p[0] - 2, p[1], K(30) * len, 30)); }
for (const [t, len] of [[0.25, 2.1], [0.42, 1.8]]) { const p = nearR.L[Math.round(t * 40)]; raw(cocoon(p[0] - 2, p[1], K(36) * len, 36, { limb: true })); }
// the web field: a great orb web strung across the road between the near towers, high, with burned prey, and a second
// smaller web lower down on the right
{ const A = nearL.R[30], Bp = nearR.L[26], c = [(A[0] + Bp[0]) / 2 + 30, (A[1] + Bp[1]) / 2 + 20];
  raw(web(c, [A, Bp, nearL.R[16], nearR.L[14], nearL.R[37]], { r: 105, n: 18, op: 0.3, col: '#ddd6ec', w: 0.55, prey: 5, preySz: 5, torn: 5, strands: 7, Z: 32 }));
  const A2 = nearR.R[16], B2 = nearR2.L[18]; raw(web([(A2[0] + B2[0]) / 2, (A2[1] + B2[1]) / 2 + 10], [A2, B2, nearR2.L[8]], { r: 55, n: 14, op: 0.45, prey: 2, Z: 40 })); }
// ---- the road: old paving running straight away into depth, its edges converging on the horizon; ruts; the strike scar
{
  const z0 = 3.6, z1 = 120, half = 3.2;
  // verges: dust and dry trampled grass either side, darker toward us
  raw(S.strew((s, t) => [s, 0, 6 + t], -40, 40, 0, 20, 1300, { cols: ['#6a6040', '#5a5034', '#7a7050', '#4a4430'], len: 0.35, ang: -1.5, spread: 0.8, dens: (s) => Math.abs(s) > half + 0.3 ? 1 : 0 }));
  raw(B.flags(-half, half, z0, 22, mix(DUST, MURK, 0.32), { depth: 0.7, width: 0.85, vary: 0.16, missing: 0.07, cracks: 0.25, fogK: 0.6 }));
  for (const [Za, Zb, c] of [[22, 50, mix(DUST, '#4a4658', 0.45)], [50, 120, mix(DUST, '#6a6478', 0.45)]]) raw(`<path d="${pp([[-half, 0, Za], [half, 0, Za], [half, 0, Zb], [-half, 0, Zb]])}" fill="${c}"/>`);
  raw(joints(-half, half, 22, 120, { dx: 0.9, dz: 2.5, op: 0.4, cracks: 2 }));
  raw(G.bandFloor(-14, 14, { col: mix(DUST, MURK, 0.35), wear: '#9a9282', debrisCol: '#7a7462' }));
  // the kerb stones along both edges, converging
  for (const sx of [-half, half]) { let d = ''; for (let Z = z0; Z < 120; Z *= 1.06) { const a = P(sx, 0, Z), b = P(sx, 0, Z * 1.05); d += `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} `; } raw(`<path d="${d}" stroke="${INK}" stroke-width="1.4" opacity="0.6"/>`); }
  // cart ruts worn along the road, two dark grooves running to the horizon
  for (const xr of [-1.05, 1.0]) { const pts = []; for (let Z = z0; Z < 120; Z *= 1.08) pts.push(P(xr + Math.sin(Z * 0.3) * 0.05, 0.01, Z)); raw(line(pts, 3.2, mix(EARTH, MURK, 0.6), 0.55) + line(pts.map(([x, y]) => [x - 1, y - 1]), 0.7, '#a89e86', 0.3)); }
  // puddles in the ruts, catching the horizon light
  for (const [X, Z] of [[-1.0, 9.5], [1.0, 14], [-1.05, 26], [1.0, 40]]) raw(G.puddle(X, Z, 0.5, Z * 0.06, '#7a7290', { lit: HORIZ }));
  // the strike scar: lightning came down on the road here; a fern burned across the paving, the slabs at its heart fused
  { const c = P(1.6, 0, 9.0), sc = S.id('sc'); raw(`<clipPath id="${sc}"><path d="${pp([[-half, 0, z0], [half, 0, z0], [half, 0, 30], [-half, 0, 30]])}"/></clipPath><g clip-path="url(#${sc})">`);
    for (let k = 0; k < 7; k++) raw(burn(c[0], c[1], k / 7 * Math.PI * 2 + R() * 0.4, 60 + R() * 80, 3.2, { core: VIO, depth: 4, haloOp: 0.25 }));
    raw(fillS(blob(c[0], c[1], 30, 6, 12, 0.5), '#0c0a10', 0.85) + fillS(blob(c[0] - 6, c[1] - 1, 16, 3, 10, 0.5), '#3a3640', 0.9) + '</g>'); }
}
// ---- the duelling ground on the left verge: a ring of trodden earth marked by old stones where the fencing schools met
{ const cx = -7.6, cz = 13; let s = ''; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, X = cx + Math.cos(a) * 3.2, Z = cz + Math.sin(a) * 1.6, p = P(X, 0, Z), r = K(Z) * (0.12 + R() * 0.08); s += B.lump(B.blob(p[0], p[1] - r * 0.4, r, r * 0.55, 8, 0.3), Z, mix(fog('#6a6656', Z), MURK, 0.35)); }
  raw(fillS(Array.from({ length: 20 }, (_, k) => { const a = k / 20 * Math.PI * 2; return P(cx + Math.cos(a) * 3, 0, cz + Math.sin(a) * 1.45); }), mix(EARTH, MURK, 0.55), 0.6) + s); }
raw(quiet([[232, 0.16], [262, 0.15], [296, 0.13], [345, 0.1]], { hop: 0.17 }));
raw(frame('#0c0b10', { sides: [[110, 0.16], [60, 0.18], [26, 0.2]], top: [[70, 0.18], [34, 0.2]] }));
// wasps drifting between the towers (dark specks with wing flicks), thick round the near spires' flight holes
for (let k = 0; k < 60; k++) { const near = R() < 0.6, x = near ? (R() < 0.5 ? 300 + R() * 220 : 960 + R() * 260) : R() * W, y = 40 + R() * 180; raw(wasp(x, y, 1.1 + R() * 2.2, (R() - 0.5) * 1)); }

// ======================================================================== MID: low, dark things behind the fighters
layer('mid');
// the toppled milestone, its numbers half legible, its iron waymark torn away (taken for a crown)
{ const Z = 10.6, X = -5.2, c = P(X, 0.2, Z), k = K(Z);
  const q = [[c[0] - k * 0.75, c[1] + k * 0.18], [c[0] + k * 0.6, c[1] + k * 0.2], [c[0] + k * 0.7, c[1] - k * 0.18], [c[0] - k * 0.6, c[1] - k * 0.26]];
  { const qc = chip(q, 0.4), fl = mix(fog('#7a7666', Z), MURK, 0.4); raw(cel(qc, { Z, fill: fl, tex: 'url(#mottle)', texOp: 0.5 }) + MV.stoneMarks(qc, Z, fl, { wy0: 0.2 })); }
  raw(`<path d="M${f1(c[0] - k * 0.3)} ${f1(c[1] - k * 0.05)} l${f1(k * 0.08)} ${f1(-k * 0.08)} l0 ${f1(k * 0.16)} M${f1(c[0] - k * 0.1)} ${f1(c[1] - k * 0.1)} l${f1(k * 0.1)} 0 l${f1(-k * 0.1)} ${f1(k * 0.14)} l${f1(k * 0.1)} 0" stroke="${INK}" stroke-width="0.9" fill="none" opacity="0.7"/>`); }
// the fencing school's practice post on the duelling ground: a scarred oak pell, notched by a thousand cuts
{ const Z = 12.4, X = -8.6; raw(B.post(X, Z, 0.11, 0, 1.5, mix('#5a4a36', MURK, 0.4), { shadeOp: 0.5 })); const t = P(X, 1.5, Z); for (let k = 0; k < 7; k++) { const y = t[1] + 6 + k * 4.5 + R() * 2; raw(pline([[t[0] - 3, y], [t[0] + 3, y + 1.5]], 0.7, INK, 0.7)); } }
// the overturned cart, its load wrapped in comb, one wheel up
{ const Z = 11.4, X = 6.6;
  raw(box(X - 1.2, X + 1.2, 0.3, 0.9, Z - 0.5, Z + 0.5, { col: mix(fog('#4a3e2e', Z), MURK, 0.45), shadeOp: 0.5 }));
  const c = P(X + 0.9, 1.15, Z - 0.6), r = K(Z) * 0.45; raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.35)}" ry="${f1(r)}" fill="none" stroke="${INK}" stroke-width="${f1(r * 0.2)}"/><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(r * 0.35)}" ry="${f1(r)}" fill="none" stroke="${mix('#5a4a34', MURK, 0.4)}" stroke-width="${f1(r * 0.11)}"/>`);
  for (let k = 0; k < 6; k++) { const p = P(X - 2 + R() * 1.4, 0.12, Z - 0.8 + R() * 0.6); raw(cel(blob(p[0], p[1] - 3, 8 + R() * 6, 4 + R() * 2, 10, 0.3, (R() - 0.5) * 0.4), { Z, fill: mix(PAPER, MURK, 0.45), band: 1.5 })); if (R() < 0.5) raw(fillS(blob(p[0], p[1] - 3, 4, 2, 7, 0.4), VEND, 0.6)); } }
{ const Z = 9.2, a = P(-1.8, 0.03, Z), b = P(-0.4, 0.04, Z - 0.3); raw(line([a, b], 2.6, INK) + line([a, b], 1.3, mix('#6a5638', MURK, 0.4)) + `<ellipse cx="${f1(b[0] + 6)}" cy="${f1(b[1] - 3)}" rx="5" ry="3.6" fill="${mix('#8a7a4e', MURK, 0.45)}" stroke="${INK}" stroke-width="0.8"/>`); }

// ======================================================================== FORE: framing at the edges
layer('fore');
{ // left: the root of a near spire, its paper bands and a flight hole, a wasp coming out; a cocoon low on it
  const pts = [[-10, H + 5], [-10, -5], [62, -5], [70, 50], [64, 120], [74, 200], [68, 290], [80, 380], [100, H + 5]];
  raw(cel(pts, { Z: 3.6, fill: mix(PAPERD, '#0c0b0e', 0.5), band: 10 }) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.5"/>`);
  const cid = S.id('fl'); raw(`<clipPath id="${cid}"><path d="${p2(pts)}"/></clipPath><g clip-path="url(#${cid})">`);
  for (let y = 0; y < H; y += 10 + R() * 14) { const q = []; for (let k = 0; k <= 8; k++) q.push([-10 + k * 26, y + Math.sin(k * 1.1 + y) * 6 + k * 0.8]); raw(line(q, 1.6, INK, 0.7) + line(q.map(([x, yy]) => [x, yy + 2]), 0.8, '#a8a494', 0.4)); }
  raw(`<path d="${p2(pts)}" fill="${S.hatchA(4)}" opacity="0.5"/><path d="${p2(pts)}" fill="${S.hatchB(4)}" opacity="0.25"/>` + burn(62, -5, 1.75, 300, 5, { core: VIO, depth: 4 }) + '</g>');
  raw(fillS(blob(40, 170, 12, 8, 9, 0.45), '#060508') + `<path d="M24 168 Q40 156 56 166" stroke="#9a968a" stroke-width="2" fill="none"/>` + wasp(76, 150, 7, -0.4) + wasp(100, 112, 5, 0.3));
  raw(cocoon(30, 300, 90, 3.6, { limb: true }));
}
{ // right: the bent iron waypost, its finger board scorched; a cocoon hanging from it; a torn web from it to the frame top
  const Z = 4.2, X = 4.75, a = P(X, 0, Z), top = P(X - 0.35, 2.6, Z);
  raw(G.web([W - 40, 70], [[W + 10, -10], [top[0] + 2, top[1]], [W - 160, -10], [W + 10, 160]], { r: 95, n: 18, op: 0.6, col: '#e2dcef', w: 0.8, prey: 3, preySz: 7, torn: 5, Z: 4 }));
  raw(line([a, [a[0] - 4, a[1] - 140], top], 9, INK) + line([a, [a[0] - 4, a[1] - 140], top], 6, '#3a3634') + line([[a[0] - 2, a[1] - 30], [a[0] - 5, a[1] - 140]], 1.4, '#7a7670', 0.5));
  const fb = [[top[0] - 70, top[1] + 4], [top[0] + 4, top[1] - 4], [top[0] + 4, top[1] + 18], [top[0] - 66, top[1] + 26]];
  { const ck = S.id('fb'); raw(cel(fb, { Z, fill: '#4a3e2e', band: 4 }) + `<clipPath id="${ck}"><path d="${p2(fb)}"/></clipPath><g clip-path="url(#${ck})">` + burn(top[0] - 4, top[1] + 4, 3.0, 60, 2.4, { core: VIO, depth: 3 }) + '</g>'); } raw('' + pline([[top[0] - 40, top[1] + 4], [top[0] - 30, top[1] + 22]], 1.6, INK));
  raw(fused(top[0] + 2, top[1] - 4, 7, '#4a4440', Z) + cocoon(top[0] - 50, top[1] + 30, 90, Z, { limb: true }));
  for (let k = 0; k < 26; k++) { const x = W - 90 + R() * 100, y = H - R() * 8, h = 50 + R() * 90, bend = (R() - 0.3) * 30, q = [[x, y], [x + bend * 0.15, y - h * 0.35], [x + bend * 0.45, y - h * 0.7], [x + bend, y - h]]; raw(MV.strand(q, 2.2, 0.7, 4.2, { col: '#6a6440', shade: false })); if (R() < 0.6) { const t = q[2]; raw(fillS(blob(t[0] + bend * 0.04, t[1] + 6, 2.2, 8, 8, 0.3), '#7a7050') + inkS(blob(t[0] + bend * 0.04, t[1] + 6, 2.2, 8, 8, 0.3), 0.6)); } }
}
raw(fillP([[-5, H + 5], [-5, H - 16], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 14 - Math.sin(k * 1.3) * 6 - R() * 5]), [W + 5, H - 16], [W + 5, H + 5]], mix(EARTH, '#0a0a0a', 0.55), 0.95));

// ======================================================================== write
fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
