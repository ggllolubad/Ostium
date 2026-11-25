// World XII, the White Silence: THE RIFT EDGE (`silence_rift`, round 2, new). Battle room, Living Ink.
// Place: where the void tore the tundra open (bible XII: void takes pieces away: faces, shadows, sound; the void mammoth's
// herd died out an age ago and it did not notice; the rime shade is a shadow cast by nothing; the starless eye fell from
// the black star). Encounters: the Rift Edge (shades at the edge of the rift), the Last Herd (the mammoth and its shade).
// Kind of space: open exterior, deep: a vast absence torn through the land runs from the near right away to the left
// horizon; the land simply stops at a clean rim; the far side is a cut face of old permafrost, strata and bones in it.
// Light: polar night. The sky is near black, with patches where even the stars have been taken; a low pale band of
// twilight lies along the horizon beyond the rift (the light focus, behind the fighters); the snow is grey; the rift is
// black. The darkest key of the world.
// Shapes: one long diagonal (the rift) through low horizontals; the far cut face in layered strata; the curves of tusks.
// Palette key: dark: black sky, grey snow, pale horizon band, absolute black absence; no colour.
// Depth planes (far): the near snow and the rift's near rim (8-20 m); the far rim with the herd and the cut face (18-60 m);
// the far tundra and the twilight band (far), the sky.
// Lore placed: the rift is a void absence (clean rim, no rubble, no cracks; slivers of the land thinning into nothing at
// its edge, pieces floating off); the far cut face shows the permafrost strata and the bones of old herds in them; the
// last herd stands frozen on the far rim, one mammoth cut clean in half where the rim passes through it; tusks lying
// in the snow; the shades' outlines lying flat on the snow, cast by nothing; patches of sky with no stars.
// Mid: a mammoth tusk half buried, a herder's broken crook, a shade-shaped stain.
// Fore: left: a drift with a broken sledge runner; right: a snow cornice whose end the void has taken (clean cut).
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XII');
const ROOM = 'silence_rift', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 12401, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#2a2e34', keyTint: '#ffffff' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#1a1c22' });
const { line, pline, fillP, fillS, inkP, inkS, blob, lump, icicles, rime, tornVoid, eye, quiet, skyBands } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#8a9098' });
const { frame, stars, sastrugi, pool } = G;

const SNOW = '#8e949c', SNOWL = '#b8bec6', SNOWD = '#5a6068', VOID = '#030304', BONE = '#c8c4b8', BAND = '#c8ccd2', MURK = B.MURK;
// the rift: its near rim and far rim on the ground (X at depth Z); it runs from the near right to the far left
const nearRim = Z => 13 - (Z - 9) * 0.95 + Math.sin(Z * 0.7) * 0.5 + Math.sin(Z * 2.3) * 0.2;
const farRim = Z => nearRim(Z) - 4.5 - Z * 0.22 + Math.sin(Z * 0.9) * 0.8;


// ======================================================================== FAR
layer('far');
raw(`<rect width="${W}" height="${H}" fill="#0a0b0e"/>` + G.sky([[0, '#0b0c10'], [0.45, '#15181d'], [0.7, '#262a31'], [0.85, '#4a4e56'], [1, '#8a8e96']]));
// an overcast of low soft cloud rolling in over the rift (the rift's night is clouded; the lake's sky is clear)
for (const [cx, cy, w, h] of [[200, 70, 520, 90], [700, 40, 640, 80], [1220, 80, 560, 100], [460, 160, 420, 50], [1000, 170, 480, 46]]) raw(G.cloud(cx, cy, w, h, '#1c1f25', { lit: '#4a4e58', dark: '#08090c', ink: 0.9 }));
if (false) raw(skyBands(['#0a0b0e'], [], {}, { wav: 4 }));
raw(stars(0, 0, W, 240, 360, { col: '#d8dce4', op: 0.7 }));
// patches where the stars have been taken: irregular, clean-rimmed areas of the sky blacker than the sky, starless
for (const [x, y, w, h] of [[420, 80, 220, 90], [1060, 50, 260, 110], [760, 170, 140, 40]]) { const q = blob(x, y, w / 2, h / 2, 16, 0.5); raw(fillS(q, '#040405', 1, 0.3) + inkS(q, 0.7, 0.3, 0.6)); }
// the twilight band along the horizon beyond the rift (the light focus), stepped
raw(pool(560, 236, 820, 40, '#e0e4ea', { n: 5, op: 0.13 }));
// ---- the far tundra beyond the rift: pale low land to the horizon, lighter than the sky
raw(`<path d="${pp([[-400, 0, 300], [400, 0, 300], [400, 0, 18], [-400, 0, 18]])}" fill="${mix(SNOW, BAND, 0.35)}"/>`);
for (const [y0, col] of [[300, '#9a9ea6'], [306, '#8a8e96']]) { }
// ---- the far side: a plateau of old tundra whose edge the void cut clean: a tall face of permafrost strata (fresh,
// pale, bones of old herds in it) dropping into black; its top edge against the twilight band
const FZ = X => 50 - X * 0.55 + Math.sin(X * 0.3) * 1.2, TOPY = X => 5 + Math.sin(X * 0.21) * 0.5;
const XS = []; for (let X = -170; X <= 50; X += 1.0) XS.push(X);
{
  const top = XS.map(X => P(X, TOPY(X), FZ(X))), bot = XS.map(X => P(X, -6, FZ(X)));
  raw(fillP([...top, [W + 5, top[top.length - 1][1]], [W + 5, 300], [-5, 300], [-5, top[0][1]]], mix(SNOW, BAND, 0.25)));
  raw(fillP([...top, ...bot.slice().reverse()], '#6a6e76'));
  for (let k = 0; k < 11; k++) { const u0 = k / 11, u1 = (k + 1) / 11, y0 = X => TOPY(X) - (TOPY(X) + 6) * u0 + Math.sin(X * 0.4 + k) * 0.15, y1 = X => TOPY(X) - (TOPY(X) + 6) * u1 + Math.sin(X * 0.4 + k + 1) * 0.15;
    const A = XS.map(X => P(X, y0(X), FZ(X))), Bb = XS.map(X => P(X, y1(X), FZ(X))), shade = Math.min(1, u0 * 1.5);
    raw(fillP([...A, ...Bb.slice().reverse()], mix(['#8a8e96', '#70747c', '#949aa0', '#7a7e86', '#666a72', '#868a90'][k % 6], VOID, shade)) + line(A, 0.6, INK, 0.5)); }
  for (let k = 0; k < 30; k++) { const X = -60 + R() * 105, Y = TOPY(X) - 0.5 - R() * 4, Z = FZ(X), p = P(X, Y, Z), r = Math.max(1.4, K(Z) * (0.25 + R() * 0.4)), c = mix(BONE, VOID, Math.min(0.8, (TOPY(X) - Y) / 8));
    raw(R() < 0.5 ? line([[p[0] - r, p[1]], [p[0] + r, p[1] - r * 0.2]], Math.max(1, r * 0.22), c) : `<path d="M${f1(p[0] - r)} ${f1(p[1])} q${f1(r)} ${f1(-r * 1.1)} ${f1(r * 2)} ${f1(-r * 0.1)}" stroke="${c}" stroke-width="${f1(Math.max(1, r * 0.2))}" fill="none"/>`); }
  raw(hatch3((X, Y) => [X, Y, FZ(X)], -170, 50, -6, 3, 0.7, { op: 0.3 }));
  raw(line(top, 1.8, INK) + line(top.map(([x, y]) => [x, y + 1.4]), 0.9, '#ffffff', 0.5));
  for (let k = 0; k < 16; k++) { const X = -50 + R() * 90, Y = TOPY(X) - R() * 3, Z = FZ(X), a = P(X - 0.3, Y, Z), b = P(X + 0.4, Y - 0.3, Z), t = P(X + (R() - 0.5) * 0.6, Y - 0.8 - R() * 1.5, Z - 1.5 - R() * 3); raw(fillP([a, t, b], '#7a7e86') + inkP([a, t, b], 0.6)); }
}
// ---- the near side: grey snow from the front up to the near rim, which wanders across the frame; between the near rim
// and the far face's lower strata, the absence: black
const NZ = X => 11.5 + X * 0.12 + Math.sin(X * 0.8) * 0.4 + Math.sin(X * 2.1) * 0.15;
{
  const rim = []; for (let X = -16; X <= 16; X += 0.25) rim.push(P(X, 0, NZ(X)));
  raw(fillP([[-5, rim[0][1] - 1], ...rim, [W + 5, rim[rim.length - 1][1] - 1], [W + 5, 330], [-5, 330]], VOID, 0.92));
  raw(fillP([[-5, H + 5], ...rim, [W + 5, H + 5]], SNOW));
  raw(sastrugi(-20, 16, 5, 11, 50, { len: 2.4, h: 0.1, ang: -0.5, shade: SNOWD, inkOp: 0.5 }));
  raw(G.bandFloor(-14, 14, { col: SNOW, wear: SNOWL, debrisCol: '#9aa0a8', wearOp: 0.3, scuff: SNOWD, z1: 8.8 }));
  raw(line(rim, 2, INK) + line(rim.map(([x, y]) => [x, y + 1.5]), 0.8, SNOWL, 0.6));
  for (let k = 0; k < 18; k++) { const X = -15 + R() * 30, Z = NZ(X), a = P(X - 0.2, 0, Z), b = P(X + 0.3, 0, Z), t = P(X + (R() - 0.5) * 0.4, 0, Z + 0.6 + R() * 1.6); raw(fillP([a, t, b], SNOW) + inkP([a, t, b], 0.6)); }
  for (let k = 0; k < 40; k++) { const X = -15 + R() * 30, u = R(), Z = NZ(X) + 1 + u * 20, p = P(X, -u * 3, Z), r = Math.max(0.8, K(Z) * 0.06); raw(fillP([[p[0] - r, p[1]], [p[0] + r * 0.4, p[1] - r * 0.8], [p[0] + r, p[1] + r * 0.3]], SNOW, Math.max(0.12, 0.8 - u)) + inkP([[p[0] - r, p[1]], [p[0] + r * 0.4, p[1] - r * 0.8], [p[0] + r, p[1] + r * 0.3]], 0.4)); }
}
// ---- the last herd on the far rim, frozen: shaggy white mammoths facing into the rift; one cut clean in half by the rim
{
  const mam = (X, Z, s, cut) => { const b = P(X, TOPY(X) + 1.6 * s, Z), k = K(Z) * s; let o = '';
    // facing right toward the rift: low rump, the back rising to a high shoulder hump, the domed head with its high crown,
    // the trunk hanging and curling, the tusks sweeping out and up; a skirt of long hair hanging to the knees, ragged
    const T = (u, v) => [b[0] + u * k, b[1] + v * k];
    const leg = (u) => cel([T(u - 0.16, 0.3), T(u + 0.16, 0.3), T(u + 0.15, 1.6), T(u + 0.2, 1.62), T(u - 0.2, 1.62), T(u - 0.15, 1.6)], { Z, fill: '#b8bcc2', band: 1.5 });
    o += leg(-0.95) + leg(0.75);
    const skirt = []; for (let i = 0; i <= 16; i++) { const u = 1.15 - i * 0.15; skirt.push(T(u, 0.85 + (i % 2) * 0.18 + R() * 0.1)); }
    const body = [T(-1.32, 0.3), T(-1.38, -0.3), T(-1.1, -0.82), T(-0.4, -1.08), T(0.3, -1.42), T(0.75, -1.58), T(1.05, -1.5), T(1.22, -1.78), T(1.5, -1.72), T(1.7, -1.35), T(1.72, -0.9), T(1.58, -0.45), T(1.3, 0.2), ...skirt];
    o += cel(body, { Z, fill: mix('#d8dade', BAND, 0.2), band: k * 0.18, shadow: '#7a7e86' }) + `<path d="${p2(body)}" fill="url(#mottle)" opacity="0.3"/>`;
    for (let i = 0; i < 22; i++) { const u = -1.25 + i * 0.12, top = -1.0 - 0.5 * Math.sin(Math.max(0, (u + 1.2) / 2.4) * Math.PI) * 0.9; o += line([T(u, top + 0.35), T(u + 0.03, 0.2), T(u + 0.01, 0.85 + R() * 0.15)], 0.6, INK, 0.45); }
    o += leg(-0.6) + leg(1.0);
    const eyeP = T(1.42, -1.18); o += pline([[eyeP[0] - 1.5, eyeP[1]], [eyeP[0] + 1.5, eyeP[1] + 0.4]], 0.8, INK);
    o += `<path d="M${f1(T(1.62, -0.6)[0])} ${f1(T(1.62, -0.6)[1])} Q${f1(T(1.95, 0.4)[0])} ${f1(T(1.95, 0.4)[1])} ${f1(T(1.72, 1.25)[0])} ${f1(T(1.72, 1.25)[1])} q${f1(-k * 0.2)} ${f1(k * 0.15)} ${f1(-k * 0.25)} ${f1(-k * 0.08)}" stroke="${INK}" stroke-width="${f1(Math.max(2.4, k * 0.2))}" fill="none" stroke-linecap="round"/><path d="M${f1(T(1.62, -0.6)[0])} ${f1(T(1.62, -0.6)[1])} Q${f1(T(1.95, 0.4)[0])} ${f1(T(1.95, 0.4)[1])} ${f1(T(1.72, 1.25)[0])} ${f1(T(1.72, 1.25)[1])} q${f1(-k * 0.2)} ${f1(k * 0.15)} ${f1(-k * 0.25)} ${f1(-k * 0.08)}" stroke="#c4c8ce" stroke-width="${f1(Math.max(1.4, k * 0.13))}" fill="none" stroke-linecap="round"/>`;
    o += `<path d="M${f1(T(1.45, -0.35)[0])} ${f1(T(1.45, -0.35)[1])} C${f1(T(2.3, 0.4)[0])} ${f1(T(2.3, 0.4)[1])} ${f1(T(2.7, -0.3)[0])} ${f1(T(2.7, -0.3)[1])} ${f1(T(2.35, -0.95)[0])} ${f1(T(2.35, -0.95)[1])}" stroke="${INK}" stroke-width="${f1(Math.max(2.4, k * 0.17))}" fill="none" stroke-linecap="round"/><path d="M${f1(T(1.45, -0.35)[0])} ${f1(T(1.45, -0.35)[1])} C${f1(T(2.3, 0.4)[0])} ${f1(T(2.3, 0.4)[1])} ${f1(T(2.7, -0.3)[0])} ${f1(T(2.7, -0.3)[1])} ${f1(T(2.35, -0.95)[0])} ${f1(T(2.35, -0.95)[1])}" stroke="${BONE}" stroke-width="${f1(Math.max(1.4, k * 0.11))}" fill="none" stroke-linecap="round"/>`;
    o += rime(body.slice(2, 8), Z, { th: Math.max(1.5, k * 0.08), col: '#ffffff' });
    if (cut) { const ck = S.id('mc'); return `<clipPath id="${ck}"><rect x="${f1(b[0] - k * 2)}" y="${f1(b[1] - k * 3)}" width="${f1(k * 2.2)}" height="${f1(k * 6)}"/></clipPath><g clip-path="url(#${ck})">${o}</g>` + line([[b[0] + k * 0.2, b[1] - k * 1.3], [b[0] + k * 0.2, b[1] + k * 1.7]], 1.4, INK) + fillP([[b[0] + k * 0.12, b[1] - k * 1.2], [b[0] + k * 0.2, b[1] - k * 1.2], [b[0] + k * 0.2, b[1] + k * 0.6], [b[0] + k * 0.12, b[1] + k * 0.6]], '#9a8e86'); }
    return o; };
  // the herd, each its own size and stance: a cow, a calf at her side, one turned back toward the others, the bull at the rim
  for (const [X, s, flip] of [[-42, 1.8, false], [-34.5, 1.15, false], [-24, 2.0, true], [-8, 1.75, false], [6, 2.05, false]]) { const o = mam(X, FZ(X) + 1.5, s, false), c = P(X, 0, FZ(X) + 1.5); raw(flip ? `<g transform="translate(${f1(c[0] * 2)} 0) scale(-1 1)">${o}</g>` : o); }
}
// ---- the shades: human outlines lying flat on the near snow, cast by nothing; one beginning to peel up at its head
for (const [X, Z, a] of [[-6, 8.5, 0.3], [2.5, 9.2, -0.4], [-10, 9.8, 0.1]]) { const pts = []; const shp = [[0, 0.2], [0.2, 0.1], [0.25, 0.5], [0.12, 0.9], [0.15, 1.3], [0.05, 1.6], [-0.05, 1.6], [-0.15, 1.3], [-0.12, 0.9], [-0.25, 0.5], [-0.2, 0.1]];
  for (const [u, v] of shp) { const c = Math.cos(a), s = Math.sin(a); pts.push(P(X + u * c - v * s, 0.01, Z + (u * s + v * c) * 1.2)); } raw(fillS(pts, '#0a0b0e', 0.85, 0.3)); }
raw(quiet([[240, 0.1], [272, 0.1], [306, 0.08], [350, 0.08]], { hop: 0.12, col: '#2a2e34' }));
raw(frame('#050506', { sides: [[160, 0.18], [80, 0.2], [36, 0.22]], top: [[120, 0.2], [60, 0.2]], bottom: [[40, 0.2]] }));
{ let m = ''; for (let k = 0; k < 100; k++) m += `<circle cx="${f1(R() * W)}" cy="${f1(R() * 420)}" r="${f1(0.4 + R() * 0.8)}" fill="#c8ccd2" opacity="${f1(0.3 + R() * 0.4)}"/>`; raw(m); }

// ======================================================================== MID
layer('mid');
{ const Z = 10.4, a = P(-7, 0.15, Z), b = P(-4.6, 0.2, Z - 0.6), k = K(Z); raw(`<path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2)} ${f1(a[1] - k * 0.5)} ${f1(b[0])} ${f1(b[1] - k * 0.15)}" stroke="${INK}" stroke-width="${f1(k * 0.2)}" fill="none" stroke-linecap="round"/><path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2)} ${f1(a[1] - k * 0.5)} ${f1(b[0])} ${f1(b[1] - k * 0.15)}" stroke="${mix(BONE, MURK, 0.3)}" stroke-width="${f1(k * 0.14)}" fill="none" stroke-linecap="round"/>` + fillS(blob(a[0], a[1] + 2, k * 0.4, k * 0.08, 10, 0.3), SNOW)); }
{ const Z = 9.2, a = P(3.2, 0.04, Z), b = P(4.8, 0.06, Z - 0.3); raw(line([a, b], 2.4, INK) + line([a, b], 1.2, '#6a6458') + `<path d="M${f1(b[0])} ${f1(b[1])} q${f1(6)} ${f1(-8)} ${f1(12)} ${f1(-2)}" stroke="${INK}" stroke-width="2.4" fill="none"/>`); }

// ======================================================================== FORE
layer('fore');
// left: a drift with a broken sledge runner sticking out of it
{ const bank = []; for (let k = 0; k <= 14; k++) bank.push([-10 + k * 13, 450 - Math.sin(k / 14 * Math.PI) * 26 + Math.sin(k * 1.4) * 4]);
  raw(fillS([[-10, H + 5], ...bank, [180, H + 5]], SNOWL, 1, 0.4) + line(bank, 1.4, INK, 0.8));
  raw(`<path d="M6 470 Q16 400 34 360 Q44 344 56 348" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M6 470 Q16 400 34 360 Q44 344 56 348" stroke="#6a6458" stroke-width="5.5" fill="none" stroke-linecap="round"/>` + rime([[16, 400], [34, 360], [56, 348]], 3, { th: 3, col: '#ffffff' })); }
// right: a snow cornice at the frame edge overhanging the rift, its end taken clean by the void
{ const top = [[W + 10, 300], [W - 20, 296], [W - 60, 302], [W - 82, 312]], cut = [[W - 82, 312], [W - 86, 340], [W - 70, 366], [W - 76, 392], [W - 58, H + 5]];
  const poly = [[W + 10, H + 5], ...top, ...cut.slice(1)]; raw(cel(poly, { Z: 3, fill: SNOWL, band: 6, shadow: SNOWD }) + line(top, 1.6, INK) + line(cut, 2.4, INK) + line(cut.map(([x, y]) => [x + 3, y]), 1, '#ffffff', 0.5));
  raw(fillP([[W - 100, H + 5], ...cut.slice(1).map(([x, y]) => [x - 14, y + 6]), [W - 86, 340]], VOID, 0.9)); }

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) } }, null, 1));
console.log(ROOM, 'layers written');
