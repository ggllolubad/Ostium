// Living Ink props for scenes, drawn with the figure engine (engine.js Fig) in figure px (640 px = 1.75 m human).
// Every builder takes the Fig f and draws around a local origin: x right, y down (negative y is up).
// The scene places a prop with S.figProp(X, Y, Z, f => ...), which scales it to its depth like a figure standing there.
'use strict';
const E = require('../engine');
const KK = require('../worlds/kit_keepers');
const { add, sub, mul, lerp, rot, mix, limb, ell } = E;
const PAL = KK.P;
const T = (f, n) => n + f.o.seed;
const U = 640 / 1.75;

// a turned or coopered vessel seen side-on: profile [[halfwidth, y]] from the base up (y negative), filled symmetric
function vessel(f, x, prof, col, o = {}) {
  const L = prof.map(([w, y]) => [x - w, y]), R = prof.map(([w, y]) => [x + w, y]).reverse();
  f.part([...L, ...R], { fill: col, shade: o.shade ?? 0.42, tex: o.tex, texOp: 0.45, inkW: 1.4, inkHeavy: 2.6 });
  const top = prof[prof.length - 1];
  f.part(ell([x, top[1]], top[0], top[0] * 0.28, 0, 12), { fill: o.inner || mix(col, '#000', 0.55), shade: 0.2, inkW: 1.1, cast: false, hatch: false });
  return top;
}
function tankard(f, x, h, col = PAL.iron, o = {}) {
  const w = h * 0.36;
  vessel(f, x, [[w, 0], [w * 1.02, -h * 0.5], [w * 0.95, -h]], col, { inner: '#2a1a10' });
  for (const t of [0.15, 0.82]) f.line([[x - w, -h * t], [x + w, -h * t]], 1.6, mix(col, '#000', 0.4), { op: 0.8, straight: true });
  f.line([[x + w * 0.95, -h * 0.82], [x + w * 1.7, -h * 0.72], [x + w * 1.65, -h * 0.3], [x + w, -h * 0.25]], 3.4, '#1a120c');
  f.line([[x + w * 0.95, -h * 0.82], [x + w * 1.7, -h * 0.72], [x + w * 1.65, -h * 0.3], [x + w, -h * 0.25]], 1.6, mix(col, '#fff', 0.2));
  f.line([[x - w * 0.6, -h * 0.9], [x - w * 0.7, -h * 0.2]], 1.2, mix(col, '#fff', 0.45), { op: 0.5 });
  if (o.dent) f.line([[x + w * 0.2, -h * 0.4], [x + w * 0.5, -h * 0.47]], 1, '#1a120c', { op: 0.6 });
}
function crock(f, x, h, col = '#8a6a48') {
  const w = h * 0.42;
  vessel(f, x, [[w * 0.8, 0], [w * 1.05, -h * 0.35], [w, -h * 0.75], [w * 0.7, -h * 0.92], [w * 0.75, -h]], col, { tex: T(f, 'mottle') });
  f.part([[x - w * 0.85, -h], [x + w * 0.85, -h], [x + w * 0.7, -h * 1.12], [x - w * 0.7, -h * 1.12]], { fill: mix(col, '#000', 0.2), shade: 0.4, inkW: 1.2, cast: false });
  f.line([[x - w * 0.95, -h * 0.6], [x + w * 0.95, -h * 0.6]], 1, mix(col, '#000', 0.4), { op: 0.6 });
  f.flat(ell([x + w * 0.3, -h * 0.4], w * 0.25, h * 0.12, 0.3, 8), '#2a1a10', { op: 0.25 });
}
function bottle(f, x, h, col = '#3a5a2a') {
  const w = h * 0.2;
  vessel(f, x, [[w, 0], [w * 1.05, -h * 0.55], [w * 0.35, -h * 0.75], [w * 0.3, -h * 0.95], [w * 0.36, -h]], col, { shade: 0.5 });
  f.part([[x - w * 0.3, -h], [x + w * 0.3, -h], [x + w * 0.25, -h * 1.1], [x - w * 0.25, -h * 1.1]], { fill: '#8a6a44', shade: 0.4, inkW: 1, cast: false });
  f.line([[x - w * 0.55, -h * 0.5], [x - w * 0.6, -h * 0.1]], 1.6, mix(col, '#fff', 0.55), { op: 0.6 });
}
function jug(f, x, h, col = '#7a5a3a') {
  const w = h * 0.34;
  vessel(f, x, [[w * 0.8, 0], [w * 1.1, -h * 0.4], [w * 0.75, -h * 0.82], [w * 0.62, -h]], col, { tex: T(f, 'mottle') });
  f.line([[x + w * 0.7, -h * 0.86], [x + w * 1.55, -h * 0.75], [x + w * 1.45, -h * 0.35], [x + w * 1.0, -h * 0.28]], 4.2, '#1a120c');
  f.line([[x + w * 0.7, -h * 0.86], [x + w * 1.55, -h * 0.75], [x + w * 1.45, -h * 0.35], [x + w * 1.0, -h * 0.28]], 2.2, col);
  f.part([[x - w * 0.62, -h], [x - w * 0.95, -h * 1.04], [x - w * 0.62, -h * 0.93]], { fill: col, shade: 0.3, inkW: 1, cast: false });
}
function cup(f, x, h, col = '#6a6460') { const w = h * 0.4; vessel(f, x, [[w * 0.8, 0], [w, -h]], col, { inner: '#2a1a10' }); }
function loaf(f, x, w, col = '#8a6a3e', o = {}) {
  const h = w * 0.42;
  f.part([[x - w / 2, 0], [x - w * 0.5, -h * 0.5], [x - w * 0.3, -h * 0.95], [x, -h], [x + w * 0.32, -h * 0.9], [x + w * 0.5, -h * 0.45], [x + w / 2, 0]], { fill: col, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 });
  for (let i = 0; i < 3; i++) f.line([[x - w * 0.25 + i * w * 0.2, -h * 0.85], [x - w * 0.15 + i * w * 0.2, -h * 0.55]], 1.3, '#3a2210', { op: 0.75 });
  if (o.cut) { f.part([[x + w / 2, 0], [x + w * 0.5, -h * 0.45], [x + w * 0.42, -h * 0.75], [x + w * 0.56, -h * 0.6], [x + w * 0.6, 0]], { fill: '#d8c09a', shade: 0.3, inkW: 1.1, cast: false, tex: T(f, 'mottle'), texOp: 0.6 }); }
}
function cheese(f, x, w) { f.part([[x - w / 2, 0], [x - w / 2, -w * 0.35], [x + w * 0.1, -w * 0.42], [x + w / 2, -w * 0.28], [x + w / 2, 0]], { fill: '#c8a85a', shade: 0.4, tex: T(f, 'mottle'), texOp: 0.4 }); f.part([[x + w * 0.1, -w * 0.42], [x + w / 2, -w * 0.28], [x + w / 2, 0], [x + w * 0.1, 0]], { fill: '#e0c880', shade: 0.25, inkW: 1, cast: false }); for (let i = 0; i < 3; i++) f.flat(ell([x + w * (0.18 + i * 0.1), -w * (0.1 + (i % 2) * 0.12)], 2.4, 2, 0, 6), '#8a6a2a'); }
function plate(f, x, w, col = '#6a5038') { f.part(ell([x, 0], w / 2, w * 0.14, 0, 16), { fill: col, shade: 0.35, inkW: 1.3 }); f.line(ell([x, -1], w * 0.36, w * 0.09, 0, 14).concat([ell([x, -1], w * 0.36, w * 0.09, 0, 14)[0]]), 1, mix(col, '#000', 0.4), { op: 0.6 }); for (let i = 0; i < 6; i++) f.flat(ell([x + (f.r() - 0.5) * w * 0.6, -1 + (f.r() - 0.5) * w * 0.08], 1.8, 1.4, 0, 6), '#a8885a'); }
function dice(f, x) { for (const [dx, dy, s] of [[0, 0, 9], [13, -1, 8.5]]) { f.part([[x + dx, dy], [x + dx + s, dy], [x + dx + s, dy - s], [x + dx, dy - s]].map(p => [p[0], p[1], 1]), { fill: '#d8ccb0', shade: 0.4, inkW: 1, cast: false }); f.flat(ell([x + dx + s * 0.5, dy - s * 0.5], 1.2, 1.2, 0, 6), '#1a120c'); } }
function knife(f, x, len) { f.part([[x, -2], [x + len * 0.6, -3], [x + len * 0.62, 0], [x, 0]], { fill: '#8a8a8c', shade: 0.3, inkW: 1, cast: false }); f.part([[x - len * 0.4, -3], [x, -3.5], [x, 1], [x - len * 0.4, 0.5]], { fill: PAL.oak, shade: 0.3, inkW: 1, cast: false }); }
// a fat candle stuck in its own wax on a surface (lit), emissive flame
function candleStub(f, x, h, w) {
  f.part(ell([x, 0], w * 1.4, w * 0.4, 0, 12), { fill: PAL.wax, shadow: PAL.waxD, shade: 0.3, inkW: 1, cast: false, hatch: false });
  const top = KK.candle(f, [x, 0], h, w, { drips: 3, lit: false });
  flameEm(f, add(top, [0, -1]), Math.max(5, w * 0.6));
}
// a small flame tagged emissive (no painted glow inside the prop: the scene paints glows in its fx layer)
function flameEm(f, p, s) {
  f.line([p, add(p, [0, -s * 0.5])], 1, '#1a120c');
  f.raw('<g class="em">');
  f.flat([add(p, [0, -s * 0.2]), add(p, [s * 0.5, -s * 0.9]), add(p, [s * 0.1, -s * 2.2]), add(p, [-s * 0.45, -s * 0.9])], PAL.flameO, { op: 0.95 });
  f.flat([add(p, [0, -s * 0.4]), add(p, [s * 0.25, -s * 0.9]), add(p, [s * 0.05, -s * 1.6]), add(p, [-s * 0.22, -s * 0.9])], '#fff0c0');
  f.raw('</g>');
}
// a sack slumped on the ground: weave, a tied neck, folds
function sack(f, x, s, o = {}) {
  const col = o.col || '#7a6a4c';
  f.part([[x - s * 0.32, 0], [x - s * 0.36, -s * 0.3], [x - s * 0.16, -s * 0.55], [x + s * 0.04, -s * 0.62], [x + s * 0.22, -s * 0.48], [x + s * 0.34, -s * 0.12], [x + s * 0.3, 0]], { fill: col, tex: T(f, 'weave'), texOp: 0.55, shade: 0.42 });
  f.line([[x - s * 0.14, -s * 0.42], [x - s * 0.08, -s * 0.22], [x - s * 0.15, -s * 0.05]], 1.4, '#1a120c', { op: 0.6 });
  f.line([[x + s * 0.14, -s * 0.36], [x + s * 0.06, -s * 0.2], [x + s * 0.12, -s * 0.04]], 1.4, '#1a120c', { op: 0.55 });
  f.line([[x - s * 0.3, -s * 0.06], [x + s * 0.28, -s * 0.05]], 3, '#3a2a18', { op: 0.35 });
  if (o.open) f.part([[x - s * 0.14, -s * 0.56], [x + s * 0.2, -s * 0.5], [x + s * 0.12, -s * 0.7], [x - s * 0.08, -s * 0.72]], { fill: o.contents || '#3a3a30', shade: 0.3, inkW: 1.1, cast: false, tex: T(f, 'mottle') });
  else { f.part([[x - s * 0.02, -s * 0.6], [x + s * 0.1, -s * 0.62], [x + s * 0.12, -s * 0.76], [x + s * 0.02, -s * 0.8], [x - s * 0.04, -s * 0.72]], { fill: col, tex: T(f, 'weave'), texOp: 0.5, shade: 0.35, inkW: 1.2, cast: false }); f.line([[x - s * 0.05, -s * 0.62], [x + s * 0.13, -s * 0.64]], 3, PAL.rope); }
  f.stitches([[x + s * 0.1, -s * 0.3], [x + s * 0.2, -s * 0.12]], '#c8b890', 1);
}
// a pair of boots stood on the floor, one slumped
function boots(f, x, s, col = '#3e2a1c') {
  for (const [dx, slump] of [[-s * 0.1, 0], [s * 0.12, 1]]) {
    const b = x + dx, top = -s * (slump ? 0.36 : 0.45);
    f.part([[b - s * 0.06, top], [b + s * 0.05, top + (slump ? s * 0.04 : 0)], [b + s * 0.055, -s * 0.09], [b + s * 0.17, -s * 0.05], [b + s * 0.18, 0], [b - s * 0.08, 0], [b - s * 0.075, -s * 0.12]], { fill: col, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 });
    f.line([[b - s * 0.06, top + s * 0.04], [b + s * 0.05, top + s * 0.05]], 1.4, mix(col, '#fff', 0.25), { op: 0.6 });
    f.line([[b - s * 0.04, -s * 0.2], [b + s * 0.03, -s * 0.22]], 1.1, '#1a120c', { op: 0.6 });
    f.line([[b - s * 0.08, -s * 0.01], [b + s * 0.18, -s * 0.01]], 2.4, '#140c06', { op: 0.8 });
    f.flat(ell([b + s * 0.02, -s * 0.06], s * 0.08, s * 0.03, 0, 8), '#2a2014', { op: 0.5 }); // mud
  }
}
// an upright barrel: staves each their own tone, bellied, iron hoops with rust, a lid of boards
function barrel(f, x, w, h, col = '#5a4430') {
  const b = w * 0.16, body = [[x - w, 0], [x - w - b, -h * 0.5], [x - w, -h], [x + w, -h], [x + w + b, -h * 0.5], [x + w, 0]];
  f.part(body, { fill: col, shade: 0.5, tex: T(f, 'wood'), texOp: 0.5 });
  for (let k = 1; k < 7; k++) { const t = -1 + 2 * k / 7, xx = x + w * 1.05 * Math.sin(t * Math.PI / 2); f.line([[xx, -2], [xx + (xx - x) * 0.14, -h * 0.5], [xx, -h + 2]], 1.1, '#1a120c', { op: 0.7 }); }
  for (const t of [0.1, 0.3, 0.7, 0.9]) { const bw = w + b * Math.sin(t * Math.PI) * 1.05, y = -h * t;
    f.part([[x - bw - 1, y - 5], [x, y - 2], [x + bw + 1, y - 5], [x + bw + 1, y + 4], [x, y + 7], [x - bw - 1, y + 4]], { fill: PAL.iron, shade: 0.45, inkW: 1.2, inkHeavy: 1.8, cast: false });
    if (f.r() < 0.6) f.flat(ell([x + (f.r() - 0.5) * bw * 1.4, y + 4], 5, 2.5, 0, 8), '#5a2a14', { op: 0.5 }); }
  f.part(ell([x, -h], w, w * 0.22, 0, 16), { fill: mix(col, '#c8a878', 0.12), shade: 0.3, inkW: 1.3, cast: false, tex: T(f, 'wood'), texOp: 0.5 });
  for (const d of [-0.35, 0.05, 0.4]) f.line([[x + w * d, -h - w * 0.2 * Math.sqrt(1 - d * d)], [x + w * d, -h + w * 0.2 * Math.sqrt(1 - d * d)]], 1, '#1a120c', { op: 0.7, straight: true });
}
// cloth hung over a line: kind cloak | shirt | sock, from the hang point (0,0) down
function hung(f, x, kind, col) {
  const s = U;
  const h = kind === 'cloak' ? 0.75 * s : kind === 'shirt' ? 0.5 * s : 0.26 * s, w = kind === 'sock' ? 0.055 * s : kind === 'cloak' ? 0.24 * s : 0.2 * s;
  const pts = kind === 'sock' ? [[x - w, 0], [x + w, 0], [x + w * 1.05, h * 0.65], [x + w * 2.2, h * 0.86], [x + w * 2, h], [x - w * 0.2, h * 0.98], [x - w * 1.05, h * 0.7]]
    : [[x - w, 0], [x + w, 0], [x + w * 1.08, h * 0.4], [x + w * 1.15, h * 0.85], [x + w * 0.6, h * 0.97], [x + w * 0.2, h * 0.9], [x - w * 0.3, h], [x - w * 1.1, h * 0.93], [x - w * 1.12, h * 0.45]];
  f.part(pts, { fill: col, tex: T(f, 'weave'), texOp: 0.5, shade: 0.42 });
  if (kind !== 'sock') for (const k of [-0.5, 0.05, 0.55]) f.line([[x + w * k, 4], [x + w * (k - 0.08), h * 0.5], [x + w * (k + 0.05), h * 0.92]], 1.4, '#1a120c', { op: 0.55 });
  if (kind === 'sock') f.line([[x - w, h * 0.12], [x + w, h * 0.12]], 2, '#c8b890', { op: 0.6 });
  if (kind === 'cloak') { f.part([[x - w * 1.1, 0], [x + w * 1.1, 0], [x + w * 1.0, h * 0.14], [x - w * 1.05, h * 0.16]], { fill: mix(col, '#000', 0.2), shade: 0.4, inkW: 1.2, cast: false, tex: T(f, 'weave'), texOp: 0.4 }); f.stitches([[x - w * 0.4, h * 0.5], [x - w * 0.1, h * 0.62]], '#a89a7a'); }
  // wet hems drip
  for (let i = 0; i < 2; i++) f.flat(ell([x + (f.r() - 0.5) * w, h + 6 + f.r() * 8], 1.6, 2.4, 0, 6), '#9aa6a8', { op: 0.6 });
}
// a fire of joined, curling tongues: each tongue an S-curve with a leaning, curling tip, of uneven height; the union is
// inked once round its outside (dark red edge), then orange body, yellow core, white heart; a few torn-off licks
function fire(f, w, h, o = {}) {
  const tongue = (x, tw, th, lean, c1, c2) => [[x - tw, 4], [x - tw * 0.95 + c1, -th * 0.28], [x - tw * 0.3 + c2, -th * 0.6], [x + lean - tw * 0.12 - c2 * 0.3, -th * 0.86], [x + lean, -th, 1],
    [x + lean * 0.6 + tw * 0.22 + c2 * 0.5, -th * 0.66], [x + tw * 0.55 - c1 * 0.4, -th * 0.34], [x + tw, 4], [x, th * 0.04]];
  const layerOf = (n, ww, hh, spread) => { const out = []; for (let i = 0; i < n; i++) { const u = n === 1 ? 0.5 : i / (n - 1), x = (u - 0.5) * ww * spread + (f.r() - 0.5) * ww * 0.06, mid = 1 - Math.abs(u - 0.5) * 1.3;
    const th = hh * (0.35 + 0.65 * mid) * (0.75 + f.r() * 0.45), tw = ww * (0.13 + f.r() * 0.07), lean = (f.r() - 0.45) * th * 0.35, c1 = (f.r() - 0.5) * tw * 0.9, c2 = (f.r() - 0.5) * tw * 1.1; out.push(tongue(x, tw, th, lean, c1, c2)); } return out; };
  const L1 = layerOf(o.n || 7, w, h, 0.82), base = ell([0, -h * 0.06], w * 0.5, h * 0.12, 0, 14);
  for (const t of L1) f.line(t.concat([t[0]]), 3.6, '#1a120c', { k: 0.9 });
  f.line(base.concat([base[0]]), 3.6, '#1a120c');
  for (const t of L1) f.flat(t, '#8a2410', { k: 0.9 });
  f.flat(base, '#8a2410');
  for (const t of layerOf((o.n || 7) - 1, w * 0.8, h * 0.8, 0.7)) f.flat(t, '#d8541c', { k: 0.9 });
  f.flat(ell([0, -h * 0.07], w * 0.4, h * 0.09, 0, 12), '#d8541c');
  for (const t of layerOf((o.n || 7) - 3, w * 0.58, h * 0.55, 0.6)) f.flat(t, '#ffa83a', { k: 0.9 });
  for (const t of layerOf(3, w * 0.34, h * 0.3, 0.5)) f.flat(t, '#fff0b0', { k: 0.9 });
  for (let i = 0; i < (o.licks ?? 5); i++) { const x = (f.r() - 0.5) * w * 0.6, y = -h * (1.02 + f.r() * 0.3), r = w * (0.015 + f.r() * 0.02); f.flat([[x, y + r * 3], [x + r * 1.1, y + r * 0.4], [x + r * 0.3, y - r * 3.4, 1], [x - r * 0.9, y]], i % 2 ? '#ffa83a' : '#d8541c', { op: 0.9 }); }
  for (let i = 0; i < 14; i++) f.flat(ell([(f.r() - 0.5) * w * 1.1, -h * (0.4 + f.r() * 1.0)], 1.4, 1.4, 0, 5), f.r() < 0.5 ? '#ffd27a' : '#ff8a3a', { op: 0.9 });
}
// a log seen end on: bark ring, cut face with growth rings and checks; or split (half round)
function logEnd(f, x, y, r, split) {
  if (split) { f.part([[x - r, y + r * 0.4], [x + r, y + r * 0.4], [x + r * 0.7, y - r * 0.5], [x, y - r * 0.85], [x - r * 0.7, y - r * 0.5]], { fill: '#b89868', shade: 0.35, inkW: 1.4, cast: false }); f.line([[x - r * 0.5, y], [x + r * 0.3, y - r * 0.4]], 1, '#6a4a2a', { op: 0.7 }); return; }
  f.part(ell([x, y], r, r, 0, 12), { fill: '#3a2a1a', shade: 0.4, inkW: 1.5, cast: false, tex: T(f, 'mottle'), texOp: 0.5 });
  f.part(ell([x - r * 0.06, y - r * 0.06], r * 0.8, r * 0.8, 0, 12), { fill: mix('#b89868', '#8a6a3a', f.r()), shade: 0.25, inkW: 0.9, cast: false, hatch: false });
  for (const t of [0.55, 0.3]) f.line(ell([x - r * 0.06, y - r * 0.06], r * t, r * t, 0, 12).concat([ell([x - r * 0.06, y - r * 0.06], r * t, r * t, 0, 12)[0]]), 0.8, '#6a4a2a', { op: 0.7 });
  if (f.r() < 0.6) f.line([[x, y], [x + r * 0.7, y - r * 0.3]], 1, '#3a2010', { op: 0.8 });
}
// a heavy old iron key, hand-forged: ring bow, long shank with a forge seam, a big crude bit; pitted, rust in the bit
function oldKey(f, p, ang, len, s) {
  KK.key(f, p, ang, len, s, '#38383a');
  const d = rot([1, 0], ang), n = [-d[1], d[0]];
  for (let i = 0; i < 5; i++) f.flat(ell(add(add(p, mul(d, s * 2.2 + f.r() * (len - s * 3))), mul(n, (f.r() - 0.5) * s * 0.4)), 1.2, 1, 0, 5), '#5a2a14', { op: 0.75 });
  f.flat(ell(add(p, mul(d, len - s * 0.6)), s * 0.7, s * 0.5, ang, 8), '#5a2a14', { op: 0.35 });
  f.line([add(add(p, mul(d, s * 2.4)), mul(n, s * 0.2)), add(add(p, mul(d, len * 0.6)), mul(n, s * 0.15))], 0.9, '#1a120c', { op: 0.6 });
}

// ---- THE TEETH (lore change 2026-11-23, item 5): each world's ruler carries a Tooth, a shard of the Mother of Courses; the
// ones brought home lie in Sister Ide's case. Fifteen, every one a different tooth (fang, molar, incisor, tusk, split root),
// each marked by its own world's two courses (bible 00 shape language: fire splits and chars with glowing seams, frost rimes
// the windward side and hangs icicles, lightning leaves branching burns and fused bronze, water barnacles and verdigris, toxin
// swells and grows mould and fungus, void takes clean round pieces away and, in void worlds, may open an eye), and warm: a
// warm ivory with an amber light in the dentine that shows in its cracks (Ide says they are warm). Drawn upright, root tip
// at (x, y), crown up; h = height in figure px.
const TEETH = [
  { w: 'I', name: 'Drowned Kingdom', c: ['water', 'void'], g: { top: 'point', roots: 1, rl: 0.5, cw: 0.5, curve: 0.12 } },
  { w: 'II', name: 'Rotmire', c: ['toxin', 'water'], g: { top: 4, roots: 2, rl: 0.46, cw: 0.82 } },
  { w: 'III', name: 'Boiling Baths', c: ['fire', 'water'], g: { top: 'edge', roots: 1, rl: 0.52, cw: 0.56 } },
  { w: 'IV', name: 'Sulphur Pits', c: ['fire', 'toxin'], g: { top: 2, roots: 1, rl: 0.5, cw: 0.6, bifid: true } },
  { w: 'V', name: 'Storm Foundry', c: ['fire', 'lightning'], g: { top: 'point', roots: 1, rl: 0.34, cw: 0.62, curve: 0.3 } },
  { w: 'VI', name: 'Stormwrack Coast', c: ['lightning', 'water'], g: { top: 'point', roots: 1, rl: 0.45, cw: 0.46, curve: -0.36 } },
  { w: 'VII', name: 'Icebound Fleet', c: ['frost', 'water'], g: { top: 'edge', roots: 1, rl: 0.5, cw: 0.66, chip: true } },
  { w: 'VIII', name: 'Sundered Rime', c: ['fire', 'frost'], g: { top: 2, roots: 2, rl: 0.48, cw: 0.7, split: true } },
  { w: 'IX', name: 'Hollow Barrow', c: ['frost', 'toxin'], g: { top: 3, roots: 3, rl: 0.44, cw: 0.86 } },
  { w: 'X', name: 'Venom Spires', c: ['lightning', 'toxin'], g: { top: 'point', roots: 1, rl: 0.56, cw: 0.34, curve: 0.08 } },
  { w: 'XI', name: 'Stilled Spire', c: ['frost', 'lightning'], g: { top: 'point', roots: 1, rl: 0.5, cw: 0.58 } },
  { w: 'XII', name: 'White Silence', c: ['frost', 'void'], g: { top: 'slant', roots: 1, rl: 0.5, cw: 0.6 } },
  { w: 'XIII', name: 'Black Pyre', c: ['fire', 'void'], g: { top: 2, roots: 2, rl: 0.5, cw: 0.64 } },
  { w: 'XIV', name: 'Blighted Garden', c: ['toxin', 'void'], g: { top: 'worn', roots: 3, rl: 0.62, cw: 0.74, splay: 0.3 } },
  { w: 'XV', name: 'Torn Sky', c: ['lightning', 'void'], g: { top: 5, roots: 2, rl: 0.4, cw: 0.76 } },
];
// a tooth's outline from its build: [root outline (to the neck), crown outline (from the neck up)], unit coords: x across,
// y 0 at the root tips, -1 at the crown's top
function toothShape(g, rr) {
  const rl = g.rl, cw = g.cw, nw = cw * 0.72, cv = g.curve || 0, sx = (x, v) => x + cv * v * v * 0.8;
  // roots: tips spread under the neck, furcations between them
  const n = g.roots, root = [], tips = [];
  for (let i = 0; i < n; i++) tips.push(n === 1 ? 0 : (-0.5 + i / (n - 1)) * (nw + (g.splay || 0) * 0.6) * 1.05);
  root.push([-nw / 2, -rl]);
  tips.forEach((tx, i) => { const tw = Math.min(0.12, nw / n * 0.35); root.push([tx - tw, -rl * 0.25], [tx + (rr() - 0.5) * 0.02, 0, 1]); if (g.bifid && n === 1) root.push([tx + 0.02, -rl * 0.12], [tx + 0.08, -0.02, 1]); root.push([tx + tw, -rl * 0.25]); if (i < n - 1) root.push([(tx + tips[i + 1]) / 2, -rl * 0.55, 1]); });
  root.push([nw / 2, -rl]);
  // crown: bulging sides, then its biting surface
  const t = g.top, c0 = -rl, mx = -rl - (1 - rl) * 0.3, sh = t === 'point' ? -0.74 : -0.9, crown = [[-nw / 2, c0], [-cw / 2, mx], [-cw / 2 * 0.92, sh]];
  if (t === 'point') crown.push([-cw * 0.2, -0.9], [0.02, -1, 1], [cw * 0.2, -0.9]);
  else if (t === 'edge') crown.push([-cw * 0.3, -0.99], [-cw * 0.12, -0.97], [0.04, -1], [cw * 0.2, -0.97], [cw * 0.42, g.chip ? -0.88 : -0.99, 1]);
  else if (t === 'slant') crown.push([-cw * 0.25, -0.86], [cw * 0.45, -1.0, 1]);
  else if (t === 'worn') crown.push([-cw * 0.3, -0.93], [0.0, -0.95], [cw * 0.3, -0.92]);
  else { for (let i = 0; i < t; i++) { const u = -0.5 + (i + 0.5) / t; crown.push([u * cw * 0.95 - cw * 0.06, -0.93], [u * cw * 0.95, -0.99 - rr() * 0.03, 1], [u * cw * 0.95 + cw * 0.06, -0.93]); } }
  crown.push([cw / 2 * 0.92, sh], [cw / 2, mx], [nw / 2, c0]);
  const S2 = pts => pts.map(([x, v, k]) => k ? [sx(x, v), v, 1] : [sx(x, v), v]);
  return { root: S2(root), crown: S2(crown), cej: c0 };
}
function tooth(f, x, y, h, spec, o = {}) {
  const r = () => f.r(), g = toothShape(spec.g, r), wd = h * 0.62;
  const pt = (u, v) => [x + u * wd, y + v * h], P2 = pts => pts.map(([u, v, k]) => k ? [...pt(u, v), 1] : pt(u, v));
  const c = spec.c, has = k => c.includes(k);
  const dark = has('void') && (has('fire') || has('lightning'));
  const enamel = dark ? '#3a2c26' : has('frost') && has('void') ? '#f2ece0' : '#ecdcb8', dentine = dark ? '#2a201c' : '#c89a60';
  const W = Math.max(0.8, h * 0.012), inkW = Math.max(1, h * 0.016);
  // void: a clean round piece is taken out of the crown's edge (masked away: whatever lies behind shows through)
  const biteC = pt(spec.g.cw * 0.5, -0.82), biteR = h * 0.1;
  if (has('void')) { const mid = f.id('tm'); f.defs.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="${x - h * 2}" y="${y - h * 2}" width="${h * 4}" height="${h * 4}"><rect x="${x - h * 2}" y="${y - h * 2}" width="${h * 4}" height="${h * 4}" fill="#fff"/><circle cx="${biteC[0]}" cy="${biteC[1]}" r="${biteR}" fill="#000"/></mask>`); f.raw(`<g mask="url(#${mid})">`); }
  f.part(P2(g.root), { fill: dentine, shadow: mix(dentine, '#4a2a14', 0.5), light: mix(dentine, '#fff0d0', 0.4), tex: T(f, 'mottle'), texOp: 0.4, shade: 0.22, inkW, inkHeavy: inkW * 1.6, cast: false, hatch: false });
  f.part(P2(g.crown), { fill: enamel, shadow: mix(enamel, '#8a5a2a', 0.45), light: mix(enamel, '#fffaf0', 0.6), tex: T(f, 'mottle'), texOp: 0.25, shade: 0.24, inkW, inkHeavy: inkW * 1.6, cast: false, hatch: false });
  // the warm light in it: the amber of the dentine shows through the enamel at the neck, and in its cracks
  f.raw('<g class="em">');
  f.flat(P2([[-0.12, g.cej - 0.02], [0.12, g.cej - 0.02], [0.08, g.cej - 0.16], [-0.08, g.cej - 0.16]]), '#ffb45a', { op: dark ? 0.6 : 0.35 });
  f.line(P2([[0.04, -0.96], [-0.03, -0.8], [0.05, g.cej - 0.05]]), Math.max(0.8, h * 0.01), '#ffc070', { op: 0.85 });
  f.raw('</g>');
  f.line(P2([[-spec.g.cw * 0.36, g.cej - 0.01], [0, g.cej - 0.05], [spec.g.cw * 0.36, g.cej - 0.01]]), W, '#7a5a3a', { op: 0.55 });
  const L = (u0, v0, u1, v1) => [pt(u0, v0), pt(u1, v1)];
  // ---- the course marks, small and set into it
  if (has('water')) {
    for (let i = 0; i < 4; i++) { const u = (r() - 0.5) * 0.3, v = -0.1 - r() * 0.25, br = h * (0.022 + r() * 0.012), p = pt(u, v); f.part(ell(p, br, br * 0.85, 0, 8), { fill: '#b4b0a0', shade: 0.3, inkW: W * 0.7, cast: false, hatch: false }); f.flat(ell([p[0] + br * 0.1, p[1] + br * 0.15], br * 0.4, br * 0.3, 0, 6), '#14100c'); }
    f.flat(P2([[-0.18, g.cej + 0.05], [0.1, g.cej], [0.16, g.cej + 0.15], [-0.08, g.cej + 0.2]]), '#4f7d6c', { op: 0.5 });
  }
  if (has('void')) {
    // a clean round piece gone from the crown's edge (the panel's ground shows through), and a small hole through, rims inked
    const bite = ell(biteC, biteR, biteR, 0, 20);
    f.line(bite.slice(5, 16), inkW, '#14100c'); f.line(bite.slice(7, 13), W * 0.8, '#7a5a9a', { op: 0.7 });
    const hp = pt(-0.06, g.cej - 0.22), hr = h * 0.045, hole = ell(hp, hr, hr, 0, 16);
    f.flat(hole, '#040507'); f.line(hole.concat([hole[0]]), W, '#14100c');
    if (has('toxin')) { const ep = pt(0.12, -0.5), er = h * 0.035; f.part(ell(ep, er * 1.5, er, 0, 12), { fill: '#e8e0c8', shade: 0.2, inkW: W, cast: false, hatch: false }); f.flat(ell(ep, er * 0.62, er * 0.62, 0, 10), '#5a6a3a'); f.flat(ell(ep, er * 0.3, er * 0.3, 0, 8), '#040507'); f.line([[ep[0] - er * 1.5, ep[1]], [ep[0], ep[1] - er * 1.1], [ep[0] + er * 1.5, ep[1]]], W * 0.9, '#14100c'); }
  }
  if (has('fire')) {
    // split and charred: a seam that glows down the crown, its biting edge charred black
    if (!has('frost')) f.flat(P2([[-spec.g.cw * 0.46, -0.9], [spec.g.cw * 0.46, -0.9], [spec.g.cw * 0.4, -0.82], [-spec.g.cw * 0.4, -0.82]]), '#1a120c', { op: 0.5 });
    const seam = [[0.05, -0.99], [-0.04, -0.82], [0.06, -0.66], [-0.02, g.cej - 0.02]];
    f.raw('<g class="em">'); f.line(P2(seam), W * 2.2, '#ff7a2a'); f.line(P2(seam), W * 0.9, '#ffe0a0'); f.raw('</g>');
    for (let i = 0; i < 2; i++) { const p = pt((r() - 0.5) * 0.3, -1.05 - i * 0.06); f.flat([p, [p[0] + h * 0.02, p[1] - h * 0.05], [p[0] - h * 0.01, p[1] - h * 0.03]], '#4a4440', { op: 0.7 }); }
  }
  if (has('frost')) {
    // rime crusted along the windward (left) flank, a short icicle from the root tip, a facet line
    const fl = []; for (let i = 0; i <= 6; i++) { const v = -0.92 + i * 0.1; fl.push(pt(-spec.g.cw * 0.5 - 0.02 + (i % 2) * 0.03, v)); }
    f.line(fl, W * 2.4, '#f2f6f6', { op: 0.9 }); for (let i = 0; i < 5; i++) { const v = -0.85 + i * 0.12; f.line(L(-spec.g.cw * 0.5, v, -spec.g.cw * 0.5 - 0.07, v - 0.02), W * 0.9, '#e8f0f0', { op: 0.9 }); }
    f.part([pt(-0.04, -0.01), pt(0.03, -0.01), [...pt(0.0, 0.16), 1]], { fill: '#d8e8ec', shade: 0.25, inkW: W * 0.8, cast: false, hatch: false });
    if (has('fire')) { f.flat(P2([[-spec.g.cw * 0.5, -0.92], [0.0, -0.95], [0.0, g.cej], [-spec.g.cw * 0.36, g.cej]]), '#f4f8f8', { op: 0.45 }); f.flat(P2([[0.0, -0.95], [spec.g.cw * 0.48, -0.9], [spec.g.cw * 0.36, g.cej], [0.0, g.cej]]), '#1a120c', { op: 0.45 }); }
  }
  if (has('lightning')) {
    // a branching burn scarred into it (never an arc in the air); outside the void, a fused bronze cap on the root tip
    const col = has('void') ? '#9a6ac0' : has('toxin') ? '#c8b8e8' : has('frost') ? '#6ac8a0' : '#2a1208';
    const burn = (p0, a, l, d) => { let px = p0[0], py = p0[1]; const pts = [[px, py]]; for (let i = 0; i < 4; i++) { a += (r() - 0.5) * 0.9; px += Math.cos(a) * l / 4; py += Math.sin(a) * l / 4; pts.push([px, py]); if (d > 0 && r() < 0.5) burn([px, py], a + (r() < 0.5 ? -0.8 : 0.8), l * 0.45, d - 1); } f.line(pts, W * (0.5 + d * 0.35), col, { op: 0.9 }); };
    const cid = f.id('tc'); f.defs.push(`<clipPath id="${cid}"><path d="${E.smooth(P2(g.root), true, 1)}"/><path d="${E.smooth(P2(g.crown), true, 1)}"/></clipPath>`);
    f.raw(`<g clip-path="url(#${cid})">`); burn(pt(0.12, -0.95), Math.PI * 0.6, h * 0.38, 2); f.raw('</g>');
    if (!has('void')) { f.part(P2([[-0.12, -0.02], [0.12, -0.02], [0.1, -0.14], [-0.1, -0.14]]), { fill: '#8a6a3a', light: '#c8a060', shade: 0.3, inkW: W, cast: false, hatch: false }); }
  }
  if (has('toxin')) {
    // ripened: small pustules on the root, a mould bloom at the neck, a fruiting cap where it rotted most
    for (let i = 0; i < 4; i++) { const p = pt((r() - 0.3) * 0.25, -0.12 - r() * 0.28), pr = h * (0.018 + r() * 0.012); f.part(ell(p, pr, pr, 0, 8), { fill: has('void') ? '#c8a8c0' : '#b8b04a', shade: 0.35, inkW: W * 0.6, cast: false, hatch: false }); }
    if (has('frost')) for (let i = 0; i < 16; i++) { const p = pt(0.05 + r() * 0.25, g.cej + 0.04 - r() * 0.1); f.line([p, [p[0] + h * 0.015, p[1] - h * 0.03]], W * 0.7, '#8a9a7a', { op: 0.85 }); }
    if (has('water') || has('void')) { const cp = pt(spec.g.cw * 0.35, g.cej - 0.02); f.line([pt(spec.g.cw * 0.25, g.cej + 0.08), cp], W * 1.3, '#c8b890'); f.part([[cp[0] - h * 0.07, cp[1]], [cp[0] - h * 0.05, cp[1] - h * 0.045], [cp[0] + h * 0.04, cp[1] - h * 0.05], [cp[0] + h * 0.07, cp[1]]], { fill: has('void') ? '#d8a8c8' : '#8a6a3a', shade: 0.4, inkW: W, cast: false }); }
    if (has('lightning')) f.part(ell(pt(0.0, 0.04), h * 0.025, h * 0.04, 0, 10), { fill: '#6a9a3a', shade: 0.3, inkW: W * 0.7, cast: false, hatch: false });
  }
  if (spec.w === 'XV') { // the Torn Sky: gold leaf cracked over the black
    for (let i = 0; i < 7; i++) { const p = pt((r() - 0.5) * 0.45, -0.5 - r() * 0.4); f.flat([[p[0], p[1]], [p[0] + h * 0.06, p[1] - h * 0.02], [p[0] + h * 0.05, p[1] + h * 0.04], [p[0] - h * 0.01, p[1] + h * 0.035]], i % 2 ? '#d8b860' : '#b08a3a', { op: 0.95 }); }
  }
  if (spec.g.split) f.line(P2([[0.0, -0.95], [0.02, -0.7], [-0.02, g.cej], [0.0, -0.2]]), W * 1.4, '#14100c', { op: 0.85 });
  if (has('void')) f.raw('</g>');
}

module.exports = { TEETH, toothShape, tooth, U, PAL, T, vessel, tankard, crock, bottle, jug, cup, loaf, cheese, plate, dice, knife, candleStub, flameEm, sack, boots, barrel, hung, fire, logEnd, oldKey };
