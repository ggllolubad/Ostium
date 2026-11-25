// World III, the Boiling Baths: THE FURNACE STAIR (room key `baths_furnace`), Living Ink, round 2 (group g1).
// Under the steam rooms: the hypocaust, where the hot rooms' floors stand on stacks of stone over a crawl of heat, and the
// praefurnium stair that goes down between parapets to the furnace mouth. The stokers never stopped: the fire still
// roars at the stair's foot, its light thrown up the stair onto the stacks and the sooted underside of the floor above,
// which leaks steam and scalding drips through its cracked slabs (the steam rooms are overhead). The bearer comes up this
// stair with his cauldrons; the nymphs are heard in the steam before they are seen.
// Encounters: "The Steam Rooms" (steam nymphs, scalded attendant), "The Furnace Stair" (kettle crab, cauldron bearer).
// Space: under-structure, tight and low (the ceiling 2.5 m), a forest of stone stacks receding. Light: firelight from the
// furnace mouth below and behind the fighters (dark key, hot). Shapes: squat stacks in uneven rows, low segmental
// relieving arches, the parapets of the stair converging. Palette: soot black, fire orange, boiled red, copper.
// Courses: fire (soot, crazed and split stone, glowing cracks, cinders), water (steam leaking, scalding drips, scale).
'use strict';
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'III');
const W = 1480, H = 480, ROOM = 'baths_furnace';
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 2513, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9, gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#1e0e0a' });
const { P, K, sc, pp, p2, f1, INK, raw, layer, cel, hatch3, mix, R, glow, stain, smooth, chip, tone, ashlar, EM } = S;
const BK = require('./battle_li')(S), G = require('./battle_kit_g1')(S, BK), { line } = G;
const MURK = '#120a08', SOOT = '#2a1e1a', STONE = '#5a443a', FIRE = '#ff9a4a', FIREW = '#ffd890', CEIL = 2.5;
const T = G.III((c, Z, k = 1) => mix(c, MURK, Math.max(0, Math.min(0.75, (Z - 7) / 26)) * k));
const fog = (c, Z, k = 1) => mix(c, MURK, Math.max(0, Math.min(0.75, (Z - 7) / 26)) * k);
const FX = 1.0, FZ = 20.5;                                    // the furnace mouth: centre X, depth
const heat = (X, Y, Z) => Math.max(0, 1 - Math.hypot(X - FX, (Y + 0.5) * 0.8, (Z - FZ) * 0.7) / 11);   // firelight reach

// a hypocaust stack: rough stone slabs piled to the floor above, each its own width and lean; the face toward the furnace
// takes an orange rim, the rest soot and crosshatch; o.slump: the top half fallen into a heap beside it
function stack(X, Z, o = {}) {
  let s = '', y = 0; const w0 = 0.62 + R() * 0.12, top = o.slump ? CEIL * (0.35 + R() * 0.25) : CEIL;
  while (y < top - 0.05) { const h = Math.min(top - y, 0.18 + R() * 0.22), w = w0 * (0.85 + R() * 0.3), dx = (R() - 0.5) * 0.06;
    const q = [P(X - w / 2 + dx, y, Z), P(X + w / 2 + dx, y, Z), P(X + w / 2 + dx, y + h, Z), P(X - w / 2 + dx, y + h, Z)], ht = heat(X, y, Z);
    s += cel(chip(q, 0.5), { Z, fill: mix(fog(tone(STONE, 0.2), Z, 1 - ht * 0.8), '#8a4a30', ht * 0.5), band: Math.max(0.8, K(Z) * 0.05), tex: 'url(#mottle)', texOp: 0.45, inkW: Math.max(0.5, K(Z) * 0.008) });
    y += h; }
  const a = P(X - w0 / 2, 0, Z), b = P(X + w0 / 2, top, Z), ht = heat(X, 1, Z);
  s += `<path d="${p2([[a[0], a[1]], [b[0], a[1]], [b[0], b[1]], [a[0], b[1]]])}" fill="${S.hatchA(Z)}" opacity="${f1(0.55 - ht * 0.4)}"/>`;
  if (ht > 0.1) { const side = X < FX ? b[0] : a[0]; s += EM(`<path d="M${f1(side)} ${f1(a[1])} L${f1(side)} ${f1(b[1])}" stroke="${FIRE}" stroke-width="${f1(Math.max(0.8, K(Z) * 0.04))}" opacity="${f1(Math.min(0.8, ht * 1.2))}"/>`); }
  if (o.slump) { const c = P(X + (R() - 0.5) * 0.6, 0, Z - 0.3); s += G.rubble(X + 0.4, Z - 0.2, 1.4, top * 0.7, fog(STONE, Z), { n: 8, stone: 0.12 }); }
  return s;
}

layer('far');
raw(`<rect width="${W}" height="${H}" fill="${MURK}"/>`);
// ---- the end wall far off (Z 30): rough sooted stone with the stair's lane cut down into the floor; dark
{ const at = (s, t) => [-20 + s, -2 + t, 30]; raw(ashlar(at, 40, 5, fog(STONE, 30), { scale: 0.8, rough: true, vary: 0.2 }) + hatch3(at, 0, 40, 0, 5, 0.8, { op: 0.5 })); }
// ---- the ceiling overhead: the underside of the steam rooms' floor, big cracked slabs seen from below, sooted black,
// converging to the far wall; gaps leaking steam; underlit orange near the furnace
{
  const atC = (s, t) => [-20 + s, CEIL, 3 + t];
  raw(`<path d="${pp([atC(0, 0), atC(40, 0), atC(40, 27), atC(0, 27)])}" fill="${SOOT}"/>`);
  for (let z = 3; z < 30; z += 1.1 + (z - 3) * 0.03) for (let x = -20; x < 20; x += 1.3 + R() * 0.5) { const w = 0.9 + R() * 1.2, d = 0.8 + R() * 0.6; if (R() < 0.06) continue; const q = [[x + 0.04, CEIL, z + 0.04], [x + w - 0.04, CEIL, z + 0.04], [x + w - 0.04, CEIL, z + d - 0.04], [x + 0.04, CEIL, z + d - 0.04]].map(p => P(...p)); if (q[1][0] < -10 || q[0][0] > W + 10) continue;
    const ht = heat(x + w / 2, CEIL, z + 0.5); raw(cel(q, { Z: z, fill: mix(fog(tone('#3a2a24', 0.2), z, 0.6), '#9a5030', ht * 0.7), band: 0.8, tex: 'url(#mottle)', texOp: 0.4, hi: false, inkW: 0.5 })); }
  raw(hatch3(atC, 0, 40, 0, 27, 0.5, { op: 0.4, keep: (s2, t) => heat(-20 + s2, CEIL, 3 + t) < 0.35 }) + hatch3(atC, 0, 40, 0, 27, -0.6, { op: 0.35, keep: (s2, t) => heat(-20 + s2, CEIL, 3 + t) < 0.2 }));
  // cracks in the slabs with steam curling down from the rooms above; scale where the drips have run
  for (let k = 0; k < 9; k++) { const X = -9 + R() * 18, Z = 6 + R() * 16, c = P(X, CEIL, Z); raw(S.crack(atC, X + 20, Z - 3, 1.2, R() * 3, { w: 1 }) + G.softSteam(c[0], c[1] + 4, -30 - R() * 30, 10 + R() * 8, { n: 5, op: 0.18, inkOp: 0.2 })); }
}
// ---- the relieving arches: low segmental arches spanning between stack rows at intervals, sooted, receding
for (const z of [12.6, 17.4, 23]) { const op = G.arch(-14, 16, CEIL - 0.55, 'seg', { rise: 0.5, n: 14 }); raw(`<path d="${p2([...op.slice(1, -1).map(([x, y]) => P(x, y, z)), P(16, CEIL, z), P(-14, CEIL, z)])}" fill="${fog('#3a2820', z)}" stroke="${INK}" stroke-width="1"/>` + G.ring(op, z - 0.02, 0.3, fog('#4a3428', z), { v: 0.5 })); }
// ---- the furnace mouth at the stair's foot: a heavy arch, sooted to black, the fire roaring inside it white-gold
{
  const op = G.arch(FX - 1.6, FX + 1.6, -0.2, 'round', { rise: 1.2, n: 10 }).map(([x, y]) => [x, y === 0 ? -1.8 : y]);
  const ps = op.map(([x, y]) => P(x, y, FZ));
  raw(`<path d="${p2(ps)}" fill="#ffb060"/>` + EM(`<path d="${p2(ps)}" fill="${FIRE}"/>`));
  // the fire: licks in stepped tongues, coal glowing white at the heart, the iron door hanging open on one hinge
  { const c = P(FX, -1.0, FZ), k = K(FZ); let fl = ''; for (let i = 0; i < 5; i++) { const x = c[0] + (i - 2) * k * 0.5 + (R() - 0.5) * k * 0.2, h = k * (0.5 + R() * 0.6); fl += `<path d="M${f1(x - k * 0.15)} ${f1(c[1] + k * 0.6)} Q${f1(x - k * 0.1)} ${f1(c[1] - h * 0.4)} ${f1(x + (R() - 0.5) * k * 0.2)} ${f1(c[1] - h)} Q${f1(x + k * 0.15)} ${f1(c[1] - h * 0.3)} ${f1(x + k * 0.15)} ${f1(c[1] + k * 0.6)} Z" fill="${FIREW}" opacity="0.55"/>`; } raw(EM(fl));
    raw(EM(`<path d="${p2(G.arch(FX - 1.0, FX + 1.0, -1.4, 'seg', { rise: 0.4 }).map(([x, y]) => P(x, y === 0 ? -1.8 : y, FZ + 0.5)))}" fill="#fff4d0" opacity="0.8"/>`)); }
  raw(G.ring(op.map(([x, y]) => [x, y]), FZ - 0.05, 0.55, '#2a1a14', { v: 0.45 }));
  const d0 = P(FX + 1.6, -1.6, FZ - 0.3), d1 = P(FX + 2.5, 0.6, FZ - 0.9); raw(cel([[d0[0], d0[1]], [d1[0], d0[1] + 6], [d1[0], d1[1]], [d0[0], d1[1] + 4]], { Z: FZ, fill: '#1e1410', band: 2 }) + EM(line([[d0[0] + 1, d0[1]], [d0[0] + 1, d1[1] + 4]], 1.2, FIRE, 0.7)));
  raw(glow(...P(FX, 0, FZ), 260, 170, FIRE, 0.4) + glow(...P(FX, -0.5, FZ), 110, 70, FIREW, 0.4));
}
// ---- the stacks: uneven rows either side of the stair lane, some slumped; nearer rows larger
{
  const ST = [];
  for (let zi = 0; zi < 10; zi++) { const z0 = 8.6 + zi * 2.1; for (let xi = -6; xi <= 6; xi++) { const z = z0 + (R() - 0.5) * 0.9, X = xi * 2.2 + 0.4 + (R() - 0.5) * 0.7; if (X > -1.6 && X < 3.6) continue; if (R() < 0.2) continue; ST.push([X, z, R() < 0.12]); } }
  ST.sort((a, b) => b[1] - a[1]); for (const [X, z, sl] of ST) raw(stack(X, z, { slump: sl }));
}
// ---- the stair lane: parapets of rough stone along both sides running down to the furnace; the top step's lip
{
  for (const X of [-1.4, 3.4]) { const at = (s2, t) => [X, t, 9.6 + s2]; raw(ashlar(at, 11, 0.85, fog(STONE, 13), { scale: 0.45, rough: true, vary: 0.25 }) + hatch3(at, 0, 11, 0, 0.85, 0.7, { op: X < 0 ? 0.25 : 0.5 }));
    const top = [P(X, 0.85, 9.6), P(X, 0.85, 20.6)]; raw(line(top, 3, INK, 1) + EM(line(top.map(([x, y]) => [x, y - 1]), 1, FIRE, 0.4))); }
  const lip = [P(-1.4, 0, 9.6), P(3.4, 0, 9.6)]; raw(line(lip, 3, INK, 1) + EM(line(lip.map(([x, y]) => [x, y - 1.5]), 1.2, FIRE, 0.5)));
}
const darkVeil = (ops) => { const c = P(FX, 0.3, FZ); for (const [r, op] of ops) { const hole = []; for (let k = 0; k < 22; k++) { const a = k / 22 * 6.283, m = 0.85 + R() * 0.25; hole.push([c[0] + Math.cos(a) * r * m * 1.5, c[1] + Math.sin(a) * r * m * 0.75]); }
  raw(`<path fill-rule="evenodd" d="M-20 -20 H${W + 20} V${H + 20} H-20 Z ${smooth(hole, true, 0.6)}" fill="${MURK}" opacity="${op}"/>`); } };
darkVeil([[120, 0.18], [220, 0.2], [340, 0.2], [480, 0.2]]);
raw(BK.quiet(MURK, 318, 400, { steps: [0.06, 0.08, 0.1, 0.12], hop: 0.1 }));
raw(G.edges(MURK, { l: 260, r: 260, t: 80, steps: [0.18, 0.2, 0.22, 0.24] }));
// ---- the floor: cracked clay and stone, ash drifted, coal and cinders, soot runnels; the firelight lying up the floor
{
  raw(G.flags(-16, 16, 3.2, 9.6, '#4a3830', { size: 0.7, cracks: 20, vary: 0.25, skip: (X, Z) => false }));
  for (const [r, op] of [[6, 0.06], [4.2, 0.08], [2.6, 0.1]]) { const pts = []; for (let k = 0; k < 16; k++) { const a = Math.PI + k / 15 * Math.PI, m = 0.85 + R() * 0.25; pts.push(P(FX + Math.cos(a) * r * m, 0.004, 9.6 + Math.sin(a) * r * 0.5 * m)); } raw(S.GLOW(`<path d="${smooth(pts, true, 0.6)}" fill="${FIRE}" opacity="${op}"/>`)); }
  let cn = ''; for (let k = 0; k < 140; k++) { const X = -14 + R() * 28, Z = 3.4 + R() * 6, [x, y] = P(X, 0.01, Z), r = K(Z) * (0.02 + R() * 0.03); cn += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 1.2)}" ry="${f1(r * 0.6)}" fill="#120a08"/>`; if (R() < 0.12) cn += EM(`<circle cx="${f1(x)}" cy="${f1(y - 0.5)}" r="${f1(r * 0.5)}" fill="${FIRE}"/>`); } raw(cn);
  for (let k = 0; k < 6; k++) { const X = -12 + R() * 24, Z = 4 + R() * 5; raw(G.puddle(X, Z, 0.7 + R() * 0.8, 0.3, '#1a1210', '#ff9a4a')); }
  raw(S.occBand((s2, t) => [-16 + s2, 0, 3.2 + t], 32, 1.0, { op: 0.45, cross: true }));
  darkVeil([[160, 0.16], [300, 0.18], [460, 0.18]]);
}

// ======================================================================== MID: low dark things behind the fighters
layer('mid');
{
  // a heap of coal by the parapet's head, a long iron rake and a shovel laid on it; a stoker's leather apron dropped
  const Z = 9.0; raw(G.rubble(-4.6, Z, 2.4, 0.5, '#1a1412', { n: 22, stone: 0.08 }));
  raw(line([P(-6.2, 0.4, Z - 0.3), P(-2.2, 0.15, Z - 0.6)], 3, INK, 1) + line([P(-6.2, 0.4, Z - 0.3), P(-2.2, 0.15, Z - 0.6)], 1.6, '#3a3634', 1));
  // a cracked copper cauldron on its side, a scale crust at its lip
  const c = P(5.6, 0.25, 9.2), k = K(9.2); raw(`<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(k * 0.3)}" ry="${f1(k * 0.26)}" fill="#5a2e20" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${f1(c[0] + k * 0.22)}" cy="${f1(c[1])}" rx="${f1(k * 0.08)}" ry="${f1(k * 0.24)}" fill="#120806" stroke="${T.SCALE}" stroke-width="1" opacity="0.9"/>`);
}

raw(G.barrel(-0.9, 8.8, { col: '#3a2a1e', hoop: '#1e1a18', extra: G.softSteam(...P(-0.9, 1.0, 8.8), 30, 8, { n: 4, op: 0.15 }) }));   // scale cue: the stokers' quench barrel
// ======================================================================== FORE: the near ceiling slab overhead, a big stack at the left, a cauldron yoke right
layer('fore');
{
  // the near underside of the floor above: a cracked slab with a hole, scalding drips running from it
  const ZN = 3.0; raw(cel([P(-4, CEIL, ZN), P(4, CEIL, ZN), P(4, CEIL, ZN + 1.4), P(-4, CEIL, ZN + 1.4)], { Z: ZN, fill: '#1e1412', tex: 'url(#mottle)', texOp: 0.5, band: 3 }));
  raw(`<path d="${pp([[-4, CEIL - 0.3, ZN], [4, CEIL - 0.3, ZN], [4, CEIL, ZN], [-4, CEIL, ZN]])}" fill="#140c0a" stroke="${INK}" stroke-width="2"/>`);
  for (let k = 0; k < 10; k++) { const X = -3 + R() * 6, a = P(X, CEIL - 0.3, ZN); raw(`<path d="M${f1(a[0])} ${f1(a[1])} l0 ${f1(4 + R() * 14)}" stroke="${T.SCALE}" stroke-width="2" opacity="0.6"/>`); }
  for (let k = 0; k < 4; k++) { const a = P(-1.6 + k * 1.1, CEIL - 0.3, ZN); raw(G.softSteam(a[0], a[1] + 6, -50, 14, { n: 4, op: 0.2 })); }
  // a near stack at the left edge, big, sooted, its right face catching the fire
  { let y = -0.2; const X = -3.85, Zs = 3.6, w0 = 0.7; while (y < CEIL) { const h = 0.2 + R() * 0.22, w = w0 * (0.88 + R() * 0.24), q = [P(X - w / 2, y, Zs), P(X + w / 2, y, Zs), P(X + w / 2, y + h, Zs), P(X - w / 2, y + h, Zs)]; raw(cel(chip(q, 0.5), { Z: Zs, fill: tone('#2a1c16', 0.2), band: 6, tex: 'url(#mottle)', texOp: 0.5 })); y += h; }
    const a = P(X + w0 / 2, -0.2, Zs), b = P(X + w0 / 2, CEIL, Zs); raw(`<path d="${p2([P(X - w0 / 2, -0.2, Zs), a, b, P(X - w0 / 2, CEIL, Zs)])}" fill="${S.hatchA(3)}" opacity="0.55"/>` + EM(line([a, b], 2.4, FIRE, 0.6))); }
  // right: a bearer's yoke left leaning on the wall, a copper cauldron hanging from it, steam off it
  const yb = P(3.7, -0.2, 3.8), yt = P(3.3, 2.1, 3.8); raw(line([yb, yt], 10, INK, 1) + line([yb, yt], 7, '#3a2618', 1));
  const cc = P(3.85, 0.55, 3.9), kk = K(3.9); raw(cel([[cc[0] - kk * 0.3, cc[1] - kk * 0.25], [cc[0] + kk * 0.3, cc[1] - kk * 0.25], [cc[0] + kk * 0.26, cc[1] + kk * 0.1], [cc[0] + kk * 0.1, cc[1] + kk * 0.25], [cc[0] - kk * 0.1, cc[1] + kk * 0.25], [cc[0] - kk * 0.26, cc[1] + kk * 0.1]], { Z: 3.9, fill: T.COPPER, band: 6, tex: 'url(#mottle)', texOp: 0.4 }) + line([[cc[0] - kk * 0.28, cc[1] - kk * 0.25], [yt[0] + 4, yt[1] + 30], [cc[0] + kk * 0.28, cc[1] - kk * 0.25]], 2, INK, 1) + G.softSteam(cc[0], cc[1] - kk * 0.3, 80, 16, { n: 5, op: 0.18 }));
  for (const [cx, sd] of [[60, -1], [W - 50, 1]]) { const pts = []; for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push([cx + sd * (t - 0.5) * 180, H - 8 - Math.sin(t * Math.PI) * (18 + R() * 8)]); } raw(G.rockMass([[cx - 100, H + 4], ...pts, [cx + 100, H + 4]], 3.5, '#140c0a', { fiss: 3, hop: 0.6 })); }
}

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
