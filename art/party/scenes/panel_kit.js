// Shared Living Ink panel kit for the abbey shop panels (extracted 2026-11-24 from panel_sacristy.js, unchanged): the frame
// size (1600 x 1000), the body rect, the dimmed room behind, the oak and iron frame, the title plate, the ostia dish and the
// iron ring knocker, all drawn with the figure engine (engine.js Fig, the keepers' warm light) at panel pixels.
'use strict';
const E = require('../engine');
const KK = require('../worlds/kit_keepers');
const { ell, mix, lerp } = E;
const W = 1600, H = 1000, X = 80, Y = 96, PW = 1440, PH = 856, INK = '#14100c';
const GOLD = '#b08a3a', GOLDL = '#e2c472', BRASS = '#8a7444', IRON = '#3a3a3c', VEL = '#4a1420', VELD = '#22080e';
const T = (f, n) => n + f.o.seed;
const fig = seed => new E.Fig(KK.KB(seed, { grimeY: null, groundY: 0, wobble: 1.4 }));
const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map(p => [p[0], p[1], 1]);

// ------------------------------------------------------------------ shared panel shell in Living Ink
function oak(f, x, y, w, h, col = '#4a3220', bw = 70) {
  for (let by = y; by < y + h - 1; by += bw) {
    const bh = Math.min(bw, y + h - by), tone = mix(col, f.r() < 0.5 ? '#8a6a48' : '#140c06', f.r() * 0.3);
    f.part(rect(x, by, w, bh), { fill: tone, tex: T(f, 'mottle'), texOp: 0.4, shade: 0.2, inkW: 1.4, inkHeavy: 2, cast: false, hatch: false });
    for (let g = 0; g < 5; g++) { const gy = by + 5 + f.r() * (bh - 10), pts = []; for (let gx = x; gx <= x + w; gx += 40) pts.push([gx, gy + Math.sin(gx * 0.02 + g) * 2 + (f.r() - 0.5) * 2]); f.line(pts, 0.6 + f.r() * 0.6, mix(tone, '#000', 0.45), { op: 0.7 }); }
    if (f.r() < 0.6) { const kx = x + f.r() * w, ky = by + bh / 2; f.flat(ell([kx, ky], 8, 4, 0, 10), mix(tone, '#000', 0.5)); f.line(ell([kx, ky], 14, 6, 0, 14).concat([ell([kx, ky], 14, 6, 0, 14)[0]]), 0.7, mix(tone, '#000', 0.4), { op: 0.7 }); }
    f.line([[x, by + 1.5], [x + w, by + 1.5]], 1, '#e8c898', { op: 0.18, straight: true });
  }
}
function shell(f) {
  // the room behind, dimmed (the panel is laid over the interior)
  f.raw(`<rect width="${W}" height="${H}" fill="#0a0705" opacity="0.62"/>`);
  f.flat(rect(X - 40, Y - 30, PW + 80, PH + 70).map(p => [p[0], p[1]]), '#000', { op: 0.45 });
}
function frame(f, t = 26) {
  oak(f, X - t, Y - t, PW + 2 * t, t, '#3a2616', 26); oak(f, X - t, Y + PH, PW + 2 * t, t, '#3a2616', 26);
  for (const sx of [X - t, X + PW]) { f.part(rect(sx, Y, t, PH), { fill: '#3a2616', tex: T(f, 'wood'), texOp: 0.5, shade: 0.3, inkW: 1.6, cast: false }); }
  f.line([[X - 2, Y - 2], [X + PW + 2, Y - 2], [X + PW + 2, Y + PH + 2], [X - 2, Y + PH + 2], [X - 2, Y - 2]], 2.4, INK, { straight: true });
  f.line([[X - t, Y - t], [X + PW + t, Y - t], [X + PW + t, Y + PH + t], [X - t, Y + PH + t], [X - t, Y - t]], 3, INK, { straight: true });
  // iron corner brackets, rivets, rust bleeding from them; iron bands across top and bottom
  for (const [cx, cy, sx, sy] of [[X - t, Y - t, 1, 1], [X + PW + t, Y - t, -1, 1], [X - t, Y + PH + t, 1, -1], [X + PW + t, Y + PH + t, -1, -1]]) {
    const L = t * 3.2, B = t * 1.25;
    f.part([[cx, cy, 1], [cx + sx * L, cy, 1], [cx + sx * L, cy + sy * B * 0.6], [cx + sx * (L - 10), cy + sy * B], [cx + sx * B, cy + sy * B, 1], [cx + sx * B, cy + sy * (L - 10)], [cx + sx * B * 0.6, cy + sy * L], [cx, cy + sy * L, 1]], { fill: IRON, light: '#6e6e70', shade: 0.35, inkW: 2, cast: false });
    for (const [px, py] of [[L * 0.75, B * 0.35], [B * 0.35, L * 0.75], [B * 0.45, B * 0.45]]) f.rivet([cx + sx * px, cy + sy * py], 3.4, '#7a7670');
    f.flat(ell([cx + sx * L * 0.5, cy + sy * B * 0.9], 9, 4, 0, 8), '#5a2a14', { op: 0.45 });
  }
  for (const by of [Y - t, Y + PH]) for (const bx of [X + PW * 0.33, X + PW * 0.67]) { f.part(rect(bx - 14, by - 2, 28, t + 4), { fill: IRON, shade: 0.3, inkW: 1.6, cast: false }); f.rivet([bx, by + t / 2], 3, '#7a7670'); }
}
function plate(f, cx, cy, w = 520) {
  const h = 64;
  f.part([[cx - w / 2, cy - h / 2, 1], [cx + w / 2, cy - h / 2, 1], [cx + w / 2 + 26, cy, 1], [cx + w / 2, cy + h / 2, 1], [cx - w / 2, cy + h / 2, 1], [cx - w / 2 - 26, cy, 1]], { fill: BRASS, light: '#c8a868', shade: 0.35, inkW: 2.4, cast: false, tex: T(f, 'mottle'), texOp: 0.4 });
  f.flat([[cx - w / 2 + 8, cy - h / 2 + 7], [cx + w / 2 - 8, cy - h / 2 + 7], [cx + w / 2 + 12, cy], [cx + w / 2 - 8, cy + h / 2 - 7], [cx - w / 2 + 8, cy + h / 2 - 7], [cx - w / 2 - 12, cy]].map(p => [p[0], p[1], 1]), '#1a1412', { stroke: INK, sw: 1.4 });
  for (const sx of [-1, 1]) f.rivet([cx + sx * (w / 2 + 6), cy], 3.6, '#c8a868');
  f.line([[cx - w / 2 + 14, cy - h / 2 + 10], [cx + w / 2 - 14, cy - h / 2 + 10]], 1.4, '#fff4d0', { op: 0.35, straight: true });
}
function dish(f, cx, cy) {
  f.flat(ell([cx, cy + 6], 86, 30, 0, 24), '#0a0806', { op: 0.6 });
  f.part(ell([cx, cy], 82, 28, 0, 28), { fill: '#5a5650', light: '#8a8680', shade: 0.35, inkW: 2, cast: false });
  f.part(ell([cx, cy - 3], 64, 19, 0, 24), { fill: '#3a3834', shade: 0.3, inkW: 1.2, cast: false, hatch: false });
  for (let k = 0; k < 14; k++) { const bx = cx - 50 + f.r() * 100, by = cy - 12 + f.r() * 14, r = 6 + f.r() * 3; f.part([[bx - r, by], [bx, by - r * 1.2], [bx + r, by], [bx, by + r * 0.9]].map(p => [p[0], p[1], 1]), { fill: mix('#8a8a86', '#4a4844', f.r()), shade: 0.3, inkW: 0.9, cast: false, hatch: false }); f.line([[bx, by - r * 0.7], [bx, by + r * 0.5]], 0.9, '#2a2826'); f.line([[bx - r * 0.4, by - r * 0.2], [bx + r * 0.4, by - r * 0.2]], 0.9, '#2a2826'); }
}
function knocker(f, cx, cy) {
  f.part(ell([cx, cy - 18], 9, 9, 0, 12), { fill: IRON, shade: 0.3, inkW: 1.6, cast: false }); f.rivet([cx, cy - 18], 3, '#7a7670');
  const rg = ell([cx, cy + 6], 24, 24, 0, 28); f.line(rg.concat([rg[0]]), 10, INK); f.line(rg.concat([rg[0]]), 7, '#4a4a4c'); f.line(rg.slice(17, 24), 1.6, '#a8a49a', { op: 0.6 });
}


const wrap = (f, w, h, extra = '') => { const s = f.svg(); return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${s.defs}</defs>${extra}${s.body}</svg>`; };
// the areas every panel shares (grim panels.js shell())
const common = () => ({ title: [800, 66], dish: [1404, 70], close: [1532, 56, 34], body: [X, Y, PW, PH], line: [X + 60, Y + PH - 46, PW - 120, 36] });
module.exports = { E, KK, W, H, X, Y, PW, PH, INK, GOLD, GOLDL, BRASS, IRON, VEL, VELD, T, fig, rect, oak, shell, frame, plate, dish, knocker, wrap, common };
