// World XII, the White Silence: THE OPEN TUNDRA (`silence_tundra`, round 2; was `silence_camp`). Battle room, Living Ink.
// Place: the open tundra at the edge of the herders' winter camp, on the herd's trail (bible XII: a tundra of herders and
// hunters; a black star rose and took all the warmth and all the sound; hollow wanderers look for their faces; the stag
// makes no sound; the pale hunter hunts the warm). Encounters: the Open Tundra (wanderers in the snow), the Stag's Path
// (it makes no sound), the Hunt (it found you first).
// Kind of space: open exterior, the widest and flattest in the world: long low rises to the horizon, the sky most of it.
// Light: white-out daylight. Flat, overcast and sourceless; the brightest point is the glare ring round the Cold Star
// high on the right; nothing casts a shadow (the void has taken them). The highest key of the world.
// Shapes: long horizontals and low curves (rises, drifts, sastrugi), a few small dark verticals (a marker cairn, poles);
// the one perfect round in the sky.
// Palette key: near-white, light: snow, grey ink, the black disc. Nothing else.
// Depth planes (far): the outlying shelters of the camp, the cairn, the drying rack and the herd trail (12-30 m); the
// herd stopped on a rise far off (60-120 m) and low hills (far); the star in the sky.
// Lore placed: the Cold Star (a perfect black disc, a thin white corona, rings of frost hanging round it, the frost
// crystals still in the air; Cole's ruling); the camp's outlying hide shelters, slumped and wind-torn, the void's clean
// absences torn out of one, an eye in one (void world); the Hearth Grandmother's finished masks on a cord between two
// poles; the stone marker cairn with its offering bundle; the herd's trail of tracks that stops in the open; a dead
// reindeer frozen kneeling; a sledge with its load; footprints that stop; no shadows anywhere.
// Mid: a broken spear shaft, a dropped mitten, a frozen fish.
// Fore: left: a wind-carved drift with sastrugi; right: a drying frame with a hide on it, rimed and icicled.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XII');
const ROOM = 'silence_tundra', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 12201, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#6a7078', keyTint: '#ffffff' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#b8bcc4' });
const { line, pline, fillP, fillS, inkP, inkS, blob, lump, box, icicles, rime, tornVoid, eye, quiet } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#e6e8ec' });
const MV = require('./materials_v2')(S);
const { frame, sastrugi } = G;

const SNOW = '#eef0f2', SNOW2 = '#dcdfe4', SNOW3 = '#c2c7cf', HIDE = '#e2dccf', HIDE2 = '#cfc6b4', POLE = '#8a8478', VOID = '#050407', GREY = '#9aa0a8';
const fogW = (col, Z) => mix(col, '#e6e8ec', Math.min(0.7, Math.max(0, (Z - 8) / 40)));

// the Cold Star: a perfect black disc, a thin white corona, frost forming in broken rings round it, crystals hanging
function coldStar(cx, cy, r) {
  let s = '';
  for (const [k, op] of [[2.7, 0.22], [2.15, 0.3], [1.72, 0.38]]) { let d = ''; const N = 90; for (let i = 0; i < N; i++) { if (R() < 0.2) continue; const a0 = i / N * 6.283, a1 = (i + 0.7) / N * 6.283, rr = r * k * (1 + (R() - 0.5) * 0.02); d += `M${f1(cx + Math.cos(a0) * rr)} ${f1(cy + Math.sin(a0) * rr)} A${f1(rr)} ${f1(rr)} 0 0 1 ${f1(cx + Math.cos(a1) * rr)} ${f1(cy + Math.sin(a1) * rr)} `; }
    s += `<path d="${d}" stroke="#8a929e" stroke-width="1.2" fill="none" opacity="${op}"/>`; }
  let m = ''; for (let k = 0; k < 110; k++) { const a = R() * 6.283, d = r * (1.35 + R() * 1.5), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, l = 1.2 + R() * 2.5; m += `M${f1(x - l)} ${f1(y)} L${f1(x + l)} ${f1(y)} M${f1(x)} ${f1(y - l)} L${f1(x)} ${f1(y + l)} `; } s += `<path d="${m}" stroke="#8a929e" stroke-width="0.6" opacity="0.6"/>`;
  // the glare round it: the sky whitest here (stepped)
  for (const [k, op] of [[1.9, 0.35], [1.45, 0.45]]) s += `<circle cx="${cx}" cy="${cy}" r="${f1(r * k)}" fill="#ffffff" opacity="${op}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${f1(r * 1.12)}" fill="none" stroke="#ffffff" stroke-width="5" opacity="0.95"/><circle cx="${cx}" cy="${cy}" r="${f1(r * 1.06)}" fill="none" stroke="${INK}" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${VOID}"/>`;
  return s;
}
// a slumped hide shelter: a low dome of hides over bent poles (not a cone): lumpy, sagging between the poles, the poles'
// ends standing out at different angles, a hide flap blown back and frozen; snow drifted up its windward side
function shelter(X, Z, w, h, o = {}) {
  const n = 18, base = [], top = []; let s = '';
  for (let k = 0; k <= n; k++) { const t = k / n, x = X - w / 2 + w * t, sag = Math.sin(t * Math.PI * 4) * 0.08 * h, hh = h * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.08)), 0.7) * (1 - sag / h) * (o.lean ? 1 + (t - 0.5) * o.lean : 1); base.push(P(x, 0, Z)); top.push(P(x, Math.max(0, hh), Z)); }
  const outline = [...base, ...top.slice().reverse()], col = fogW(HIDE, Z);
  s += cel(outline, { Z, fill: col, band: Math.max(2, K(Z) * h * 0.15), shadow: mix(HIDE2, '#8a8478', 0.3) }) + `<path d="${p2(outline)}" fill="url(#mottle)" opacity="0.3"/>`;
  // panels sewn over it: seams running up over the dome, stitch ticks; patches; the right side in hatch
  for (let k = 1; k < 5; k++) { const i = Math.round(k / 5 * n), b = base[i], t = top[i]; s += line([b, [b[0] + (t[0] - b[0]) * 0.5 + 3, b[1] + (t[1] - b[1]) * 0.5], t], 0.8, INK, 0.6); for (let j = 1; j < 6; j++) { const y = b[1] + (t[1] - b[1]) * j / 6; s += pline([[b[0] - 1.5, y], [b[0] + 1.5, y + 0.5]], 0.5, INK, 0.6); } }
  s += hatch3((u, v) => [X - w / 2 + u, v, Z], w * 0.6, w, 0, h, 0.8, { op: 0.35 });
  // the poles' ends standing out of the dome at the top, each its own angle
  for (let k = 0; k < (o.poles ?? 4); k++) { const i = Math.round((0.35 + R() * 0.3) * n), p = top[i], a = -Math.PI / 2 + (R() - 0.5) * 1.1, L = K(Z) * (0.4 + R() * 0.6); s += pline([p, [p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L]], Math.max(1.6, K(Z) * 0.05), INK) + pline([p, [p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L]], Math.max(0.8, K(Z) * 0.03), fogW(POLE, Z)); }
  // the door: a dark low opening with its flap blown back stiff
  const d0 = P(X + w * 0.05, 0, Z), d1 = P(X + w * 0.22, 0, Z), dt = P(X + w * 0.14, h * 0.55, Z);
  s += fillP([d0, d1, dt], '#2a2a2e') + cel([d1, dt, P(X + w * 0.34, h * 0.4, Z), P(X + w * 0.3, 0.05, Z)], { Z, fill: mix(col, HIDE2, 0.5), band: 1.5 });
  s += inkP(outline, Math.max(1, inkW(Z) * 1.1));
  // the drift banked up its windward (left) side and along its foot
  const bank = []; for (let k = 0; k <= 10; k++) { const t = k / 10; bank.push(P(X - w / 2 - 0.4 + (w * 0.6) * t, h * 0.5 * Math.pow(1 - t, 1.4) + 0.06, Z - 0.2)); }
  s += fillS([P(X - w / 2 - 0.6, 0, Z - 0.2), ...bank, P(X + w * 0.1, 0, Z - 0.2)], SNOW, 1, 0.4) + line(bank, 0.8, INK, 0.55);
  s += rime(top.slice(0, Math.round(n * 0.45)), Z, { th: 2.4, col: '#ffffff', under: '#9aa4b0' });
  return { svg: s, outline, at: (u, v) => [X - w / 2 + u * w, v * h, Z - 0.05] };
}

// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="#f2f3f5"/>` + G.sky([[0, '#f4f5f7'], [0.4, '#eceef1'], [0.75, '#e2e5e9'], [1, '#d8dce2']]));
raw(`<rect width="${W}" height="90" fill="${S.hatchA(30)}" opacity="0.1"/>`);
raw(coldStar(1090, 86, 52));
// wind-streaked haze over the far plain: long thin bands of blown snow
for (let k = 0; k < 10; k++) raw(G.softMass(R() * W, 210 + R() * 70, 260 + R() * 420, 14 + R() * 10, '#ffffff', { op: 0.55, n: 6, wisps: 4 }));
if (false) for (let k = 0; k < 14; k++) { const y = 200 + R() * 80, x0 = R() * W, l = 200 + R() * 500; raw(line([[x0, y], [x0 + l * 0.5, y - 2 + R() * 4], [x0 + l, y + (R() - 0.5) * 4]], 2 + R() * 4, '#ffffff', 0.35)); }
// ---- the far plain: low rises stepping toward us, each a slightly darker grey with an ink crest
{
  for (const [y0, col, amp] of [[276, '#e4e7eb', 6], [286, '#dcdfe5', 8], [296, '#e8eaee', 5]]) { const pts = [[-5, H + 5]]; for (let k = 0; k <= 30; k++) pts.push([k * W / 30, y0 + Math.sin(k * 0.55 + y0) * amp + Math.sin(k * 1.7) * 2]); pts.push([W + 5, H + 5]); raw(fillP(pts, col) + line(pts.slice(1, -1), 0.9, INK, 0.5)); }
  // the herd stopped on the far rise: small inked reindeer, heads up, every one facing the star; no sound, no shadow
  for (let k = 0; k < 22; k++) { const x = 160 + k * 26 + R() * 14, y = 279 + Math.sin(x * 0.011) * 4, s = 0.8 + R() * 0.5, hd = R() < 0.7;
    raw(fillP([[x - 7 * s, y - 6 * s], [x + 6 * s, y - 7 * s], [x + 7 * s, y - 3 * s], [x - 7 * s, y - 2.5 * s]], '#c8ccd2') + inkP([[x - 7 * s, y - 6 * s], [x + 6 * s, y - 7 * s], [x + 7 * s, y - 3 * s], [x - 7 * s, y - 2.5 * s]], 0.6));
    for (const dx of [-6, -4, 4, 6]) raw(pline([[x + dx * s, y - 3 * s], [x + dx * s, y + 1]], 0.7, INK));
    if (hd) raw(pline([[x + 6 * s, y - 6 * s], [x + 9 * s, y - 11 * s]], 1.6 * s, INK) + pline([[x + 9 * s, y - 11 * s], [x + 8 * s, y - 15 * s], [x + 6 * s, y - 17 * s]], 0.6, INK) + pline([[x + 9 * s, y - 11 * s], [x + 12 * s, y - 15 * s], [x + 13 * s, y - 18 * s]], 0.6, INK)); }
  raw(`<path d="${pp([[-80, 0, 4], [80, 0, 4], [80, 0, 80], [-80, 0, 80]])}" fill="${SNOW}"/>`);
  raw(sastrugi(-30, 30, 6, 60, 90, { len: 3.2, h: 0.12, ang: -0.2, shade: SNOW3, inkOp: 0.55 }));
}
raw(G.bandFloor(-14, 14, { col: SNOW2, wear: SNOW3, debrisCol: '#c8ccd2', wearOp: 0.35, scuff: GREY, debris: 12 }));
// a herder's sledge left on the trail (a scale cue): bone-shod runners, a lashed load of hides, a cradleboard hoop on top
{ const Z = 14, X0 = -1.0, X1 = 1.4, k = K(Z); for (const dz of [-0.3, 0.3]) { const a = P(X0, 0.05, Z + dz), b = P(X1, 0.05, Z + dz), c = P(X1 + 0.35, 0.4, Z + dz); raw(line([a, b, c], 2.6, INK) + line([a, b, c], 1.4, '#a8a49a')); }
  raw(B.box(X0 + 0.1, X1 - 0.1, 0.12, 0.6, Z - 0.3, Z + 0.3, { col: HIDE2 }) + rime([P(X0 + 0.1, 0.6, Z - 0.3), P(X1 - 0.1, 0.6, Z - 0.3)], Z, { th: 2, col: '#ffffff' }));
  const h = P((X0 + X1) / 2, 0.6, Z - 0.1); raw(`<path d="M${f1(h[0] - k * 0.25)} ${f1(h[1])} Q${f1(h[0])} ${f1(h[1] - k * 0.55)} ${f1(h[0] + k * 0.25)} ${f1(h[1])}" stroke="${INK}" stroke-width="2" fill="none"/>`); }
// ---- the herd's trail: a broad trampled path of hoofprints coming in from the far left and running toward us; a line
// of a man's footprints beside it that stops in the open
{
  for (let k = 0; k < 260; k++) { const t = R(), Z = 7 + Math.pow(t, 1.3) * 45, X = -3 - Z * 0.32 + (R() - 0.5) * (1.2 + Z * 0.05), p = P(X, 0, Z), r = Math.max(0.6, K(Z) * 0.05); raw(`<path d="M${f1(p[0] - r)} ${f1(p[1])} q${f1(r * 0.5)} ${f1(-r * 0.6)} ${f1(r)} 0 M${f1(p[0] + r * 0.2)} ${f1(p[1])} q${f1(r * 0.5)} ${f1(-r * 0.6)} ${f1(r)} 0" stroke="${GREY}" stroke-width="${f1(Math.max(0.5, r * 0.5))}" fill="none" opacity="0.7"/>`); }
  for (let k = 0; k < 20; k++) { const Z = 9 + k * 0.9, X = 2 + Math.sin(k) * 0.12 + (k % 2) * 0.3, p = P(X, 0, Z), r = K(Z) * 0.07; raw(fillS(blob(p[0], p[1], r, r * 0.3, 8, 0.2), SNOW3, 0.9) + line([[p[0] - r, p[1] - r * 0.2], [p[0] + r, p[1] - r * 0.2]], 0.5, INK, 0.5)); }
}
// ---- the outlying shelters of the camp on the left, slumped; the void's absences torn out of the nearer one, an eye
{ const s1 = shelter(-15, 26, 4.6, 2.2, { lean: -0.2 }), s2 = shelter(-8.5, 18.5, 5.2, 2.6, { lean: 0.15, poles: 5 });
  raw(s1.svg + s2.svg);
  const tv = tornVoid(s2.at, 0.4, 0.55, 0.24, 0.32, { depth: 0, mat: HIDE, slivers: 4, flecks: 5, tears: 3, teeth: 2, halo: false, edge: '#8a8478', edgeOp: 0.5, eyes: [[0.05, 0.05, 0.28]], eyeO: { white: '#cfcac0', iris: '#6a6a70', open: 0.4 } });
  const ct = S.id('sc'); raw(`<clipPath id="${ct}"><path d="${p2(s2.outline)}"/></clipPath><g clip-path="url(#${ct})">${tv.svg}</g>`); }
// ---- the Grandmother's masks strung on a cord between two poles: sewn hide faces, no two alike
{ const Z = 15, a = P(-3.6, 2.4, Z), b = P(0.6, 2.3, Z);
  for (const p of [-3.6, 0.6]) { const A = P(p, 0, Z), Bq = P(p + 0.05, 2.8, Z); raw(line([A, Bq], 3, INK) + line([A, Bq], 1.8, POLE)); }
  const cord = []; for (let k = 0; k <= 20; k++) { const t = k / 20; cord.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 14]); }
  raw(line(cord, 1.1, INK));
  for (let k = 0; k < 6; k++) { const t = (k + 0.8) / 7, p = cord[Math.round(t * 20)], mw = K(Z) * (0.12 + R() * 0.04), mh = mw * (1.3 + R() * 0.3), cx = p[0] + (R() - 0.5) * 3, cy = p[1] + 3 + mh;
    raw(pline([[p[0], p[1]], [cx, cy - mh]], 0.7, INK) + cel(blob(cx, cy, mw, mh, 14, 0.14), { Z, fill: k % 2 ? HIDE : '#f2eee4', band: 1.5 }));
    if (k % 3) raw(eye(cx - mw * 0.4, cy - mh * 0.2, mw * 0.22, { white: '#1a1a1e', iris: VOID, open: 0.35, lid: false, look: [0, 0] }));
    raw(eye(cx + mw * 0.4, cy - mh * 0.2, mw * 0.22, { white: '#1a1a1e', iris: VOID, open: k === 2 ? 0.2 : 0.38, lid: false, look: [0, 0] }) + pline([[cx - mw * 0.3, cy + mh * 0.45], [cx + mw * 0.32, cy + mh * 0.4]], 1.2, INK)); } }
// ---- the marker cairn on the rise, stones stacked, an offering bundle tied to its top, rimed on the windward side
{ const X = 5.4, Z = 22, k = K(Z); let y = 0; for (const [w, h, dx] of [[1.2, 0.5, 0], [1.0, 0.45, 0.1], [0.8, 0.4, -0.06], [0.55, 0.35, 0.05], [0.3, 0.5, 0]]) { const a = P(X + dx - w / 2, y, Z), b = P(X + dx + w / 2, y + h, Z); raw(lump([[a[0], a[1]], [b[0], a[1]], [b[0] - 2, b[1]], [a[0] + 2, b[1]]], Z, fogW('#a8acb2', Z), { band: 2 }) + MV.stoneMarks([[a[0], a[1]], [b[0], a[1]], [b[0] - 2, b[1]], [a[0] + 2, b[1]]], Z, fogW('#a8acb2', Z), { wy0: y }) + rime([[a[0], b[1] + 2], [a[0] + (b[0] - a[0]) * 0.5, b[1]]], Z, { th: 2, col: '#ffffff' })); y += h; }
  const t = P(X, y, Z); raw(cel(blob(t[0] + 3, t[1] + 4, 4, 5, 8, 0.3), { Z, fill: HIDE2, band: 1.5 }) + pline([[t[0] + 3, t[1]], [t[0] + 3, t[1] + 8]], 0.7, INK)); }
// ---- a dead reindeer frozen kneeling on the trail, head up toward the star; no shadow under it
{ const X = 9.8, Z = 17, b = P(X, 0.55, Z), k = K(Z);
  raw(cel([[b[0] - k * 0.75, b[1] + k * 0.1], [b[0] - k * 0.6, b[1] - k * 0.32], [b[0] + k * 0.5, b[1] - k * 0.38], [b[0] + k * 0.7, b[1] - k * 0.1], [b[0] + k * 0.55, b[1] + k * 0.5], [b[0] - k * 0.6, b[1] + k * 0.52]], { Z, fill: fogW('#d8d8d6', Z), band: 3 }));
  raw(pline([[b[0] + k * 0.55, b[1] - k * 0.3], [b[0] + k * 0.75, b[1] - k * 0.9]], k * 0.18, INK) + pline([[b[0] + k * 0.55, b[1] - k * 0.3], [b[0] + k * 0.75, b[1] - k * 0.9]], k * 0.12, '#dcdcda'));
  for (const sg of [-1, 1]) raw(line([[b[0] + k * 0.75, b[1] - k * 0.95], [b[0] + k * (0.75 + sg * 0.2), b[1] - k * 1.3], [b[0] + k * (0.7 + sg * 0.35), b[1] - k * 1.55]], 1.2, INK));
  raw(rime([[b[0] - k * 0.6, b[1] - k * 0.32], [b[0] + k * 0.5, b[1] - k * 0.38]], Z, { th: 3, col: '#ffffff' })); }
raw(quiet([[240, 0.1], [276, 0.1], [312, 0.08]], { col: '#c4c8d0', hop: 0.06 }));
raw(frame('#9aa0aa', { sides: [[80, 0.1], [36, 0.1]], top: [[50, 0.08]] }));
// fine snow hanging still in the air
{ let m = ''; for (let k = 0; k < 160; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 400)}" r="${f1(0.4 + R() * 1)}" fill="${R() < 0.5 ? '#ffffff' : GREY}" opacity="${f1(0.4 + R() * 0.4)}"/>`; raw(m); }

// ======================================================================== MID
layer('mid');
{ const Z = 10.5, a = P(-6.4, 0.04, Z), b = P(-4.8, 0.06, Z - 0.4); raw(line([a, b], 2.6, INK) + line([a, b], 1.4, POLE) + cel([[b[0], b[1] - 4], [b[0] + 10, b[1] - 2], [b[0] + 1, b[1] + 2]], { Z, fill: '#c8c4bc', band: 1 })); }
{ const Z = 9.4, p = P(3.6, 0.05, Z), k = K(Z); raw(cel(blob(p[0], p[1], k * 0.1, k * 0.06, 9, 0.3), { Z, fill: HIDE2, band: 1.5 }));
  const q = P(6.2, 0.05, Z + 1.4), kk = K(Z + 1.4); raw(cel([[q[0] - kk * 0.2, q[1]], [q[0] + kk * 0.15, q[1] - kk * 0.06], [q[0] + kk * 0.25, q[1] - kk * 0.12], [q[0] + kk * 0.22, q[1] + kk * 0.02]], { Z, fill: '#b8bcc0', band: 1 })); }

// ======================================================================== FORE
layer('fore');
// left: a wind-carved drift, its crest inked, sastrugi scored in it, a blue-grey lee hollow
{ const bank = []; for (let k = 0; k <= 16; k++) { const x = -10 + k * 14; bank.push([x, 452 - Math.sin(k / 16 * Math.PI) * 26 + Math.sin(k * 1.3) * 4]); }
  raw(fillS([[-10, H + 5], ...bank, [230, H + 5]], SNOW, 1, 0.4) + line(bank, 1.4, INK, 0.8));
  for (let k = 0; k < 12; k++) { const i = 1 + Math.floor(R() * 14), [x, y] = bank[i], d = 10 + R() * 30, l = 20 + R() * 40; raw(line([[x - l * 0.5, y + d], [x, y + d - 3], [x + l * 0.5, y + d + 1]], 1, INK, 0.5) + line([[x - l * 0.4, y + d + 2], [x + l * 0.4, y + d + 3]], 2, SNOW3, 0.6)); } }
// right: a drying frame with a hide stretched on it, rimed, icicles from its lower edge; a sledge prow
{ // a leaning herder's pole at the frame edge with a frozen hide strip and a string of bone charms on it, rimed
  const a = [W - 40, H + 5], b = [W - 70, 40]; raw(pline([a, b], 7, INK) + pline([a, b], 4.2, POLE) + rime([b, [W - 58, 200]], 3.5, { th: 4, col: '#ffffff', under: '#9aa4b0' }));
  const hd = [[W - 68, 70], [W - 30, 78], [W - 22, 200], [W - 44, 236], [W - 62, 190]]; raw(cel(hd, { Z: 3.5, fill: HIDE, band: 6 }) + `<path d="${p2(hd)}" fill="url(#mottle)" opacity="0.35"/>` + icicles([hd[4], hd[3], hd[2]], 3.5, { len: 30, dens: 1, col: '#f4f8fa', shadow: '#9aa4b0' }));
  for (let k = 0; k < 6; k++) raw(`<ellipse cx="${f1(W - 74 - k * 2)}" cy="${f1(90 + k * 16)}" rx="3" ry="4.5" fill="#e8e4dc" stroke="${INK}" stroke-width="0.8"/>`); }
raw(fillP([[-5, H + 5], [-5, H - 12], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 10 - Math.sin(k * 1.5) * 5 - R() * 4]), [W + 5, H - 12], [W + 5, H + 5]], '#dfe2e6', 0.95));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
