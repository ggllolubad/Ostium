// World XII, the White Silence: THE STILL LAKE (`silence_boss`, round 2, new). Boss room for The Cold Star.
// Lore (bible XII, The Cold Star): "The black star came down to see what was making all the noise." A perfect black disc
// with a thin white corona, round which the frost forms rings; nothing reflects from it; the Tooth orbits it like a small
// pale moon. It came down over the place where the clan made its noise: the frozen lake below the winter camp, where the
// drum-seer beat the great drum to call the herds and the singers sang, in the ring of whale-jaw arches on the ice.
// Kind of space: open exterior, the flattest and widest of all: a frozen lake as smooth as a mirror from our feet to the
// far shore, the sky over it; the dance ring of bone arches on the left; the camp tiny on the far shore.
// Light: the most dramatic in the world, and inverted: the star has drunk the light out of the sky, which has gone dark
// slate; the land and the lake are white. The corona and its frost rings are the brightest things; the lake mirrors the
// rings, but where the disc should be mirrored there is only the sky (nothing reflects from it).
// Composition: the right 45% is the star's stage: dark sky for the disc and its rings, the mirror of the rings on the
// ice below; nothing stands there. The heroes stand on the ice at the left.
// Shapes: circles (the rings and their reflections) over one long flat horizontal; the bone arches' curves on the left.
// Palette key: black sky, white ice and snow, grey ink. Nothing else.
// Depth planes (far): the bone arches of the dance ring (10-22 m); the lake and its fishing holes (to 200 m); the far
// shore with the camp (200-400 m); the sky.
// Lore placed: the drum-dance ring of whale-jaw arches, offerings tied to them, a great drum lying on the ice with a clean
// absence through its skin; the drum-seer's beater; the singers' place marked by two worn hollows; ice-fishing holes torn
// through the ice (void, clean-rimmed); the camp on the far shore, its hearth smoke cut off clean; the herd stopped; no
// shadows anywhere; the frost crystals hanging still in the air.
// Mid: the dropped drum (low), a fish spear, a string of frozen fish each with a clean hole through it.
// Fore: left: a whale-jaw arch's foot close, offerings and bone beads on it; right: nothing tall (the stage); a drift.
'use strict';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'battle', 'XII');
const ROOM = 'silence_boss', W = 1480, H = 480;
const S = require('./lik')({ W, H, HZ: 300, E: 1.2, FL: 652, CX: 740, seed: 12501, wob: { f: 0.15, s: 0.6 }, gritF: 2.0, minInk: 0.5, minHeavy: 0.9,
  gaps: [1.8, 2.2, 2.6, 3.2, 4], minHatchW: 0.45, minBand: 0.9, shadowTint: '#5a6068', keyTint: '#ffffff' });
const { P, K, p2, pp, f1, INK, raw, layer, cel, chip, hatch3, mix, R, smooth, inkW } = S;
const B = require('./battle_kit_b')(S, { murk: '#9aa0a8' });
const { line, pline, fillP, fillS, inkP, inkS, blob, lump, icicles, rime, tornVoid, eye, quiet, skyBands } = B;
const G = require('./battle_kit_g4')(S, B, { air: '#d8dce0' });
const { frame, stars, sastrugi, pool } = G;

const SNOW = '#eef0f2', SNOW3 = '#c2c7cf', ICE = '#dfe4e8', BONE = '#e0dccf', HIDE = '#e2dccf', VOID = '#050407', GREY = '#9aa0a8', SKY0 = '#16181c';
// the star as the boss figure places it (2x x 2330, its disc centre at figure (800, 470), scale 0.594, feet on 860):
const SC = [1165, 103], SR = 148;                          // disc centre and radius at 1x

// ======================================================================== FAR
layer('far');
// ---- the sky drained dark by the star: slate black overhead, a dull grey low band where the land gives some light back
raw(`<rect width="${W}" height="${H}" fill="${SKY0}"/>` + G.sky([[0, '#121418'], [0.5, '#1c1f24'], [0.8, '#30343b'], [1, '#62666e']]));
raw(stars(0, 0, 760, 200, 90, { col: '#c8ccd4', op: 0.6 }));
// the light the corona throws on the sky round it, in stepped rounds (the figure draws the disc, corona and rings)
for (const [k, op] of [[2.9, 0.035], [2.4, 0.045], [1.95, 0.06], [1.6, 0.08]]) raw(`<circle cx="${SC[0]}" cy="${SC[1]}" r="${f1(SR * k)}" fill="#c8ccd4" opacity="${op}"/>`);
// frost crystals hanging still in the air everywhere, thickest round the star
{ let m = ''; for (let k = 0; k < 260; k++) { const near = R() < 0.6, a = R() * 6.28, d = near ? SR * (1.2 + R() * 2.6) : R() * 900, x = near ? SC[0] + Math.cos(a) * d : R() * W, y = near ? SC[1] + Math.sin(a) * d : R() * 290, l = 1 + R() * 2.4; if (y > 296) continue; m += `M${f1(x - l)} ${f1(y)} L${f1(x + l)} ${f1(y)} M${f1(x)} ${f1(y - l)} L${f1(x)} ${f1(y + l)} `; } raw(`<path d="${m}" stroke="#dce0e6" stroke-width="0.6" opacity="0.6"/>`); }
// ---- the far shore: a low white line of land with the camp on it, tiny; its smoke frozen and cut off clean
{
  const yS = 296; raw(fillP([[-5, yS + 4], ...Array.from({ length: 40 }, (_, k) => [k * W / 39, yS - Math.max(0, Math.sin(k * 0.4) * 3 + Math.sin(k * 1.3) * 1.5) - (k < 14 ? 4 : 0)]), [W + 5, yS + 4]], '#cfd3d8') + line(Array.from({ length: 40 }, (_, k) => [k * W / 39, yS - Math.max(0, Math.sin(k * 0.4) * 3 + Math.sin(k * 1.3) * 1.5) - (k < 14 ? 4 : 0)]), 0.8, INK, 0.6));
  for (const [x, h] of [[300, 9], [324, 11], [352, 8], [380, 10]]) { raw(fillP([[x - h * 0.5, yS - 3], [x + 1, yS - 3 - h], [x + h * 0.5, yS - 3]], '#e8e8e4') + inkP([[x - h * 0.5, yS - 3], [x + 1, yS - 3 - h], [x + h * 0.5, yS - 3]], 0.6) + pline([[x + 1, yS - 3 - h], [x, yS - 3 - h * 2.6]], 1.6, '#e4e6e8') + pline([[x - 2, yS - 3 - h * 2.6], [x + 2, yS - 3 - h * 2.6]], 1, INK)); }
  for (let k = 0; k < 9; k++) { const x = 430 + k * 9 + R() * 4; raw(fillP([[x - 3, yS - 5], [x + 3, yS - 6], [x + 3, yS - 3], [x - 3, yS - 3]], '#e4e6e8') + pline([[x + 3, yS - 6], [x + 5, yS - 9]], 0.8, INK)); }
}
// ---- the lake: perfectly smooth ice to the far shore. It mirrors the sky and the frost rings, but where the disc
// should be mirrored there is only the sky: nothing reflects from the star
{
  raw(fillP([[-5, 298], [W + 5, 298], [W + 5, H + 5], [-5, H + 5]], '#b8bec6'));
  // the mirrored sky in bands, light near the shore line, darker toward us (it mirrors the dark sky overhead)
  for (const [y, c] of [[298, '#9aa0a8'], [312, '#7e848c'], [330, '#6a7078'], [356, '#5a6068'], [392, '#4e545c'], [436, '#464c54']]) raw(fillP([[-5, y], ...Array.from({ length: 30 }, (_, k) => [k * W / 29, y + Math.sin(k * 0.9 + y) * 1.2]), [W + 5, y], [W + 5, H + 5], [-5, H + 5]], c, 0.7));
  // the reflected rings (mirrored about the horizon), and the reflected corona glow; no disc in the middle of them
  const ck = S.id('lk'); raw(`<clipPath id="${ck}"><rect x="0" y="299" width="${W}" height="${H}"/></clipPath><g clip-path="url(#${ck})">`);
  const MC = [SC[0], 600 - SC[1]];
  for (const [k, op, w] of [[2.7, 0.12, 12], [2.15, 0.15, 9], [1.72, 0.18, 7], [1.12, 0.3, 3]]) { let d = ''; const N = 120, g0 = Math.floor(R() * N), g1 = Math.floor(R() * N); for (let i = 0; i < N; i++) { if (k > 1.5 && (Math.abs(i - g0) < 6 || Math.abs(i - g1) < 4)) continue; const a0 = i / N * 6.283, a1 = (i + 1.02) / N * 6.283, rr = SR * k; d += `M${f1(MC[0] + Math.cos(a0) * rr)} ${f1(MC[1] + Math.sin(a0) * rr)} A${f1(rr)} ${f1(rr)} 0 0 1 ${f1(MC[0] + Math.cos(a1) * rr)} ${f1(MC[1] + Math.sin(a1) * rr)} `; } raw(`<path d="${d}" stroke="#e8ecf0" stroke-width="${w}" fill="none" opacity="${op}"/>`); }
  // the place the disc would be mirrored: only the mirrored sky, a faint ink ring where its edge would fall
  raw(`<circle cx="${MC[0]}" cy="${MC[1]}" r="${SR}" fill="none" stroke="${INK}" stroke-width="0.8" stroke-dasharray="2 9" opacity="0.18"/>`);
  // fine horizontal ripple-less streaks in the ice (polish marks, scratches of skates, wind-glaze), converging lines
  for (let k = 0; k < 90; k++) { const Z = 6 + Math.pow(R(), 1.3) * 120, X = -40 + R() * 80, a = P(X, 0, Z), b = P(X + 0.8 + R() * 3, 0, Z); raw(pline([a, b], 0.6, '#e8ecf0', 0.35)); }
  for (let k = 0; k < 12; k++) { const X0 = -14 + k * 2.4, pts = []; for (let Z = 4; Z < 80; Z *= 1.12) pts.push(P(X0 + Math.sin(Z) * 0.2, 0, Z)); raw(line(pts, 0.6, INK, 0.18)); }
  raw('</g>');
}
// ---- fishing holes torn through the lake ice by the void: clean-rimmed absences, black, the ice cut fresh at the rim
for (const [X, Z, w] of [[3.6, 16, 1.4], [8.4, 24, 1.8], [-2.4, 30, 1.6]]) raw(tornVoid((s, t) => [X + s, 0.005, Z + t], 0, 0, w, w * 0.8, { depth: 0.35, dir: [0, -1, 0], cut: '#9aa4b0', mat: ICE, slivers: 4, flecks: 4, tears: 2, tearLen: 0.4, teeth: 2, halo: false }).svg);
// ---- the dance ring of whale-jaw arches on the ice at the left: pairs of great curved jawbones leaning together, bound
// at the top with sinew, hung with offerings; frost on their windward sides
{
  const arch = (X, Z, h, sp, o = {}) => { const k = K(Z); let s = '';
    for (const sg of [-1, 1]) { const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12, x = X + sg * sp / 2 * (1 - Math.pow(t, 1.6)) + sg * 0.15 * Math.sin(t * 3.2), y = h * Math.sin(t * Math.PI / 2) ; pts.push([x, y]); }
      const L = pts.map(([x, y], i) => P(x - 0.13 * (1 - i / 14), y, Z)), Rr = pts.map(([x, y], i) => P(x + 0.13 * (1 - i / 14), y, Z));
      s += cel([...L, ...Rr.slice().reverse()], { Z, fill: mix(BONE, '#ffffff', 0.15), band: Math.max(1.5, k * 0.06), shadow: '#8a8478' }) + line(L.slice(2, 10).map(([x, y]) => [x + 1.5, y]), 0.8, INK, 0.4); }
    const tp = P(X, h, Z); s += pline([[tp[0] - k * 0.2, tp[1] + k * 0.15], [tp[0] + k * 0.2, tp[1] + k * 0.15]], Math.max(1.4, k * 0.06), INK) + pline([[tp[0] - k * 0.18, tp[1] + k * 0.25], [tp[0] + k * 0.18, tp[1] + k * 0.25]], Math.max(1.2, k * 0.05), INK);
    for (let i = 0; i < (o.charms ?? 3); i++) { const sg = i % 2 ? 1 : -1, t = 0.5 + R() * 0.35, p = P(X + sg * sp / 2 * (1 - Math.pow(t, 1.6)), h * Math.sin(t * Math.PI / 2), Z), L = k * (0.3 + R() * 0.4); s += pline([p, [p[0] + sg * 2, p[1] + L]], 0.7, INK) + cel(blob(p[0] + sg * 2, p[1] + L + k * 0.08, k * 0.07, k * 0.1, 8, 0.25), { Z, fill: HIDE, band: 1 }); }
    s += rime(Array.from({ length: 8 }, (_, i) => P(X - sp / 2 * (1 - Math.pow(i / 8, 1.6)), h * Math.sin(i / 8 * Math.PI / 2), Z)), Z, { th: 2, col: '#ffffff' });
    return s; };
  for (const [X, Z, h, sp] of [[-15.5, 23, 6.4, 3.8], [-9.2, 17, 4.6, 2.6], [-3.4, 20.5, 5.8, 3.4]]) raw(arch(X, Z, h, sp));
  // the fourth arch fallen: one jaw still standing, its fellow lying on the ice, the sinew binding torn
  { const Z = 13.4, X = -12.8, k = K(Z), st = []; for (let i = 0; i <= 10; i++) { const t = i / 10; st.push([X - 1.3 * (1 - Math.pow(t, 1.6)) + 0.1 * Math.sin(t * 3), 4.2 * Math.sin(t * Math.PI / 2) * 0.9]); }
    const L = st.map(([x, y], i) => P(x - 0.13 * (1 - i / 12), y, Z)), Rr = st.map(([x, y], i) => P(x + 0.13 * (1 - i / 12), y, Z)); raw(cel([...L, ...Rr.slice().reverse()], { Z, fill: mix(BONE, '#ffffff', 0.15), band: 2, shadow: '#8a8478' }) + rime(L.slice(0, 7), Z, { th: 2, col: '#ffffff' }));
    const fl = []; for (let i = 0; i <= 10; i++) { const t = i / 10; fl.push(P(X + 0.6 + t * 3.6, 0.12 + Math.sin(t * Math.PI) * 0.25, Z - 0.6 + t * 0.8)); } raw(line(fl, Math.max(3, k * 0.24), INK) + line(fl, Math.max(2, k * 0.17), mix(BONE, '#ffffff', 0.1)) + line(fl.map(([x, y]) => [x, y - 1.5]), 0.8, '#ffffff', 0.6)); }
  raw(G.bandFloor(-14, 14, { col: '#7e848c', wear: '#a8aeb6', debrisCol: '#c8ccd2', wearOp: 0.25, debris: 10 }));
  // the ring itself: a trodden circle on the ice, the dancers' path, and the singers' two worn hollows facing each other
  const ring = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2; ring.push(P(-9 + Math.cos(a) * 5.2, 0.005, 17 + Math.sin(a) * 3.6)); } raw(line(ring, 3, '#a8aeb6', 0.6) + line(ring, 0.7, INK, 0.3));
  for (const dx of [-0.5, 0.5]) { const p = P(-9 + dx, 0.01, 16), k = K(16); raw(fillS(blob(p[0], p[1], k * 0.28, k * 0.06, 10, 0.2), '#a8aeb6', 0.8)); }
}
raw(quiet([[244, 0.06], [280, 0.06], [320, 0.06]], { hop: 0.08, col: '#3a3e46', x0: -5, x1: 800 }));
raw(frame('#0c0d10', { sides: [[110, 0.14], [50, 0.16]], top: [[70, 0.18], [30, 0.2]] }));

// ======================================================================== MID
layer('mid');
// the drum-seer's great frame drum, dropped flat on the ice; a clean absence through the centre of its skin; the beater
{ const Z = 11.5, X = -5.4, k = K(Z), c = P(X, 0.06, Z); const rimO = [], rimI = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; rimO.push(P(X + Math.cos(a) * 0.62, 0.08, Z + Math.sin(a) * 0.62)); rimI.push(P(X + Math.cos(a) * 0.55, 0.08, Z + Math.sin(a) * 0.55)); }
  raw(fillP(rimO, '#8a8478') + fillP(rimI, '#d8d2c4') + inkP(rimO, 1.1));
  // its painted figures: a herd, a hunter, a black sun
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, p = P(X + Math.cos(a) * 0.38, 0.081, Z + Math.sin(a) * 0.38); raw(pline([[p[0] - 3, p[1]], [p[0] + 3, p[1] - 0.6]], 0.9, INK) + pline([[p[0] - 2, p[1]], [p[0] - 2, p[1] + 1.4]], 0.6, INK) + pline([[p[0] + 2, p[1]], [p[0] + 2, p[1] + 1.4]], 0.6, INK)); }
  raw(tornVoid((s, t) => [X + s, 0.082, Z + t], 0, 0, 0.32, 0.28, { depth: 0.08, dir: [0, -1, 0], cut: '#a8a090', mat: '#d8d2c4', slivers: 3, flecks: 3, tears: 1, teeth: 1, halo: false }).svg);
  raw(line([P(X + 0.9, 0.04, Z - 0.3), P(X + 1.6, 0.05, Z - 0.6)], 2.2, INK) + line([P(X + 0.9, 0.04, Z - 0.3), P(X + 1.6, 0.05, Z - 0.6)], 1.2, '#b8b0a0')); }
// a fish spear laid down, and a string of frozen fish, each with a clean hole through it
{ const Z = 9.6, a = P(1.2, 0.03, Z), b = P(3.2, 0.03, Z - 0.4); raw(line([a, b], 2.2, INK) + line([a, b], 1.1, '#8a8478'));
  for (let i = 0; i < 4; i++) { const p = P(4.0 + i * 0.35, 0.05, Z + 0.4), k = K(Z); raw(cel([[p[0] - k * 0.14, p[1]], [p[0] + k * 0.1, p[1] - k * 0.04], [p[0] + k * 0.16, p[1] + k * 0.02], [p[0] + k * 0.1, p[1] + k * 0.05]], { Z, fill: '#b8bcc2', band: 1 }) + `<circle cx="${f1(p[0])}" cy="${f1(p[1] + k * 0.01)}" r="${f1(k * 0.02)}" fill="${VOID}"/>`); } }

// ======================================================================== FORE
layer('fore');
// left: the foot of a whale-jaw arch close by, bone grained, bead strings and a bundle tied on, rimed
{ const pts = [[-10, H + 5], [-10, 40], [20, -10], [64, -10], [40, 60], [30, 160], [34, 280], [48, 400], [62, H + 5]];
  raw(cel(pts, { Z: 3, fill: mix(BONE, '#ffffff', 0.1), band: 10, shadow: '#7a7468' }) + `<path d="${p2(pts)}" fill="url(#mottle)" opacity="0.35"/>`);
  for (let y = 40; y < H; y += 16 + R() * 14) raw(pline([[0, y], [30 + R() * 8, y + 5]], 0.8, INK, 0.4));
  raw(rime([[-10, 40], [20, -10]], 3, { th: 6, col: '#ffffff' }));
  for (let k = 0; k < 9; k++) raw(`<ellipse cx="${f1(38 - k * 1.2)}" cy="${f1(120 + k * 9)}" rx="3.4" ry="4" fill="#e8e4dc" stroke="${INK}" stroke-width="0.8"/>`);
  raw(cel(blob(46, 236, 10, 14, 10, 0.25), { Z: 3, fill: HIDE, band: 3 }) + pline([[40, 200], [46, 222]], 1, INK)); }
// right: a low drift only, the stage kept clear
{ const bank = []; for (let k = 0; k <= 12; k++) bank.push([W - 200 + k * 18, 466 - Math.sin(k / 12 * Math.PI) * 14]); raw(fillS([[W - 200, H + 5], ...bank, [W + 10, H + 5]], SNOW, 1, 0.4) + line(bank, 1.2, INK, 0.7)); }
raw(fillP([[-5, H + 5], [-5, H - 10], ...Array.from({ length: 20 }, (_, k) => [k * W / 19, H - 8 - Math.sin(k * 1.5) * 4 - R() * 3]), [W + 5, H - 10], [W + 5, H + 5]], '#e4e8ec', 0.9));

fs.mkdirSync(OUT, { recursive: true });
for (const l of ['far', 'mid', 'fore']) fs.writeFileSync(path.join(OUT, `${ROOM}_${l}.svg`), S.svgLayer(l));
fs.writeFileSync(path.join(OUT, `${ROOM}.camera.json`), JSON.stringify({ w: W, h: H, shown_at: 2, camera: { horizon: 300, eye_m: 1.2, focal_px: 652, cx: 740 }, fighters: { z_m: 6.0, feet_y: 430, human_px: 190, figure_scale: +S.sc(6).toFixed(4) }, boss_stage: { x: [814, 1480], star_centre_1x: SC, star_radius_1x: SR, note: 'the lake mirrors the rings about the horizon round the star placed at 2x x 2330; the figure\'s own root bone (tundra and camp) is dropped in the preview, the room supplies the ground' } }, null, 1));
console.log(ROOM, 'layers written');
