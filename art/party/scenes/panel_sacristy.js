// Sister Ide's panel (the Sacristy shop panel), converted from grim/panels.js 'sacristy' to Living Ink. Same frame size
// (1600 x 1000), same layout areas (title, dish, close, body, line, teeth, case, cloth) so the game lays its text and items
// over it unchanged. Drawn with the figure engine (engine.js Fig, the keepers' warm light) at panel pixels.
// Lore (2026-11-23, item 5): the top row of the case is fifteen niches for the Teeth brought home, one per world. The panel
// base is drawn with the niches EMPTY; each Tooth is its own sprite (teeth/tooth_<world>.svg/.png, sized to its niche) so the
// game shows only the ones the company has brought home (positions in the layout's tooth_slots). The preview shows all 15.
// Usage: node scenes/panel_sacristy.js [outDir]   (default out/scenes/hub/panels)
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('../engine');
const KK = require('../worlds/kit_keepers');
const PR = require('./props_li');
const { ell, mix, lerp } = E;
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'panels');
const PK = require('./panel_kit');
const { W, H, X, Y, PW, PH, INK, GOLD, GOLDL, BRASS, IRON, VEL, VELD, T, fig, rect, oak, shell, frame, plate, dish, knocker } = PK;

// ------------------------------------------------------------------ the niches and the teeth
const NX = X + 70, NW = (PW - 140) / 15, NWI = NW - 12, NT = Y + 34, NB = Y + 150;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
const nicheOutline = (nx) => [[nx, NB, 1], [nx, NT + 26], [nx + 3, NT + 12], [nx + NWI / 2, NT, 1], [nx + NWI - 3, NT + 12], [nx + NWI, NT + 26], [nx + NWI, NB, 1]];
function body(f) {
  oak(f, X, Y, PW, PH, '#2a1a10', 100);
  // the niche row: a stone-and-oak arcade of fifteen, each velvet-lined, a brass arch with its world's numeral cut in a tablet
  for (let k = 0; k < 15; k++) {
    const nx = NX + k * NW;
    f.part(nicheOutline(nx), { fill: VEL, shadow: VELD, light: '#6a2030', shade: 0.42, inkW: 2, cast: false, tex: T(f, 'weave'), texOp: 0.35 });
    // the dent in the velvet where a Tooth lies (or will), and the worn pile
    f.flat(ell([nx + NWI / 2, NB - 22], NWI * 0.3, 6, 0, 14), VELD, { op: 0.7 });
    for (let j = 0; j < 4; j++) f.line([[nx + 6 + f.r() * (NWI - 12), NT + 34], [nx + 6 + f.r() * (NWI - 12), NB - 8]], 0.8, '#6a2030', { op: 0.35 });
    f.part([[nx - 4, NT + 28], [nx - 1, NT + 10], [nx + NWI / 2, NT - 4, 1], [nx + NWI + 1, NT + 10], [nx + NWI + 4, NT + 28], [nx + NWI, NT + 28], [nx + NWI - 3, NT + 13], [nx + NWI / 2, NT + 2, 1], [nx + 3, NT + 13], [nx, NT + 28]], { fill: BRASS, light: '#d8b870', shade: 0.3, inkW: 1.2, cast: false, hatch: false });
    // the numeral tablet under each niche: brass, the world's number cut into it
    const tx = nx + NWI / 2, ty = NB + 4;
    f.part(rect(tx - 18, ty, 36, 13), { fill: BRASS, light: '#d8b870', shade: 0.3, inkW: 1, cast: false, hatch: false });
    f.raw(`<text x="${tx}" y="${ty + 10.5}" font-family="Georgia, 'Times New Roman', serif" font-size="10" text-anchor="middle" fill="#2a1a08" letter-spacing="0.5">${ROMAN[k]}</text>`);
    // the odd neglect, as grim had it: cobweb, a dried flower
    const v = f.r(); if (v < 0.2) f.line([[nx + 2, NT + 30], [nx + 18, NT + 46], [nx + 2, NT + 42]], 0.6, '#d8d0c0', { op: 0.4 }); else if (v < 0.3) { f.line([[nx + NWI - 10, NB - 2], [nx + NWI - 6, NB - 22]], 1.2, '#4a5a2a'); f.flat(ell([nx + NWI - 6, NB - 24], 3, 3, 0, 6), '#6a2a3a'); }
  }
  // the brass rail under the niche row
  f.part(rect(X + 50, NB + 20, PW - 100, 12), { fill: BRASS, light: '#e0c070', shade: 0.3, inkW: 1.6, cast: false, tex: T(f, 'mottle'), texOp: 0.5 });
  // the case: 6 x 3 compartments behind old glass, velvet, a tufted cushion in each (the game sets its wares on them)
  const cx = X + 60, cy = Y + 196, cw = PW - 120, ch = PH - 380, cols = 6, rows = 3;
  f.part(rect(cx - 14, cy - 14, cw + 28, ch + 28), { fill: '#1a0e08', shade: 0.2, inkW: 3, cast: false, hatch: false });
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const bx = cx + c * cw / cols, by = cy + r * ch / rows, bw = cw / cols, bh = ch / rows;
    f.part(rect(bx + 6, by + 6, bw - 12, bh - 12), { fill: VEL, shadow: VELD, shade: 0.22, inkW: 2, cast: false, tex: T(f, 'weave'), texOp: 0.3 });
    const qx = bx + bw / 2, qy = by + bh * 0.56, qw = bw * 0.36, qh = bh * 0.22;
    f.part(ell([qx, qy], qw, qh, 0, 20), { fill: '#5a1a26', light: '#8a3a46', shade: 0.45, inkW: 1.6, cast: true, tex: T(f, 'weave'), texOp: 0.3 });
    f.flat(ell([qx, qy], qw * 0.45, qh * 0.4, 0, 14), '#2a0a10', { op: 0.35 });
    for (const [u, v] of [[-0.6, 0], [0.6, 0], [0, -0.6], [0, 0.6]]) f.rivet([qx + u * qw, qy + v * qh], 2.4, GOLDL);
    f.part(rect(qx - 26, by + bh - 30, 52, 12), { fill: BRASS, light: '#d8b870', shade: 0.3, inkW: 1, cast: false, hatch: false });
    f.line([[qx - 18, by + bh - 24], [qx + 18, by + bh - 24]], 1, '#4a3412', { dash: '3 2' });
  }
  for (let c = 1; c < cols; c++) f.part(rect(cx + c * cw / cols - 5, cy - 10, 10, ch + 20), { fill: GOLD, light: GOLDL, shade: 0.3, inkW: 1.2, cast: false, hatch: false });
  for (let r = 1; r < rows; r++) f.part(rect(cx - 10, cy + r * ch / rows - 5, cw + 20, 10), { fill: GOLD, light: GOLDL, shade: 0.3, inkW: 1.2, cast: false, hatch: false });
  for (let r = 1; r < rows; r++) for (let c = 1; c < cols; c++) { f.part(ell([cx + c * cw / cols, cy + r * ch / rows], 9, 9, 0, 14), { fill: GOLD, light: GOLDL, shade: 0.3, inkW: 1.4, cast: false, hatch: false }); f.line([[cx + c * cw / cols - 5, cy + r * ch / rows], [cx + c * cw / cols + 5, cy + r * ch / rows]], 1.4, '#5a3a10'); }
  // the glass: reflections in long parallel strips, never a gradient; frost at its lower corners (the sacristy is cold)
  for (let k = 0; k < 5; k++) { const gx = cx + f.r() * cw; f.flat([[gx, cy], [gx + 80, cy], [gx - 60, cy + ch], [gx - 140, cy + ch]], '#fff', { op: 0.03 + f.r() * 0.03 }); }
  for (let i = 0; i < 120; i++) { const corner = i % 2, x = corner ? cx + cw - f.r() * 160 : cx + f.r() * 160, y = cy + ch - f.r() * 90; f.line([[x, y], [x + (f.r() - 0.5) * 14, y - f.r() * 10]], 0.9, '#e8f2fa', { op: 0.45 }); }
  // the altar linen along the bottom, a red and gold band, wax spots
  const ay = Y + PH - 160;
  f.part([[X + 40, ay, 1], [X + PW - 40, ay, 1], [X + PW - 50, Y + PH - 30, 1], [X + 50, Y + PH - 30, 1]], { fill: '#c8c0b0', shadow: '#8a8270', shade: 0.25, inkW: 2, cast: false, tex: T(f, 'weave'), texOp: 0.3 });
  f.line([[X + 40, ay + 18], [X + PW - 40, ay + 18]], 8, '#7a1a14', { straight: true }); f.line([[X + 40, ay + 18], [X + PW - 40, ay + 18]], 2, GOLD, { dash: '10 6', straight: true });
  for (let k = 0; k < 12; k++) f.flat(ell([X + 100 + f.r() * (PW - 200), ay + 50 + f.r() * 70], 3 + f.r() * 5, 2 + f.r() * 2, 0, 8), '#a89e84', { op: 0.8 });
  for (let k = 0; k < 9; k++) { const x = X + 80 + f.r() * (PW - 160); f.line([[x, ay + 28], [x + (f.r() - 0.5) * 16, ay + 70], [x + (f.r() - 0.5) * 10, ay + 125]], 1.4, '#7a7260', { op: 0.6 }); f.flat([[x + 2, ay + 30], [x + 9, ay + 30], [x + 6, ay + 124], [x + 1, ay + 124]], '#5a5446', { op: 0.18 }); }
  // stains: wine, wax, a scorch from a candle, a darned tear; the cloth's lower edge in shadow
  for (const [sx, sr, col, op] of [[X + 260, 26, '#6a3a2a', 0.22], [X + 700, 34, '#8a7a5a', 0.25], [X + 1180, 20, '#3a2a1a', 0.35]]) f.flat(ell([sx, ay + 80], sr, sr * 0.45, 0.2, 14), col, { op });
  f.part([[X + 900, ay + 60], [X + 960, ay + 58], [X + 958, ay + 96], [X + 902, ay + 98]].map(p => [p[0], p[1], 1]), { fill: '#b8ae98', shade: 0.25, inkW: 1, cast: false, tex: T(f, 'weave'), texOp: 0.5 }); f.stitches([[X + 900, ay + 60], [X + 960, ay + 58], [X + 958, ay + 96], [X + 902, ay + 98], [X + 900, ay + 60]], '#5a4a3a');
  f.raw(`<path d="M${X + 50} ${Y + PH - 60} L${X + PW - 50} ${Y + PH - 60} L${X + PW - 50} ${Y + PH - 30} L${X + 50} ${Y + PH - 30} Z" fill="url(#hatch${f.o.seed})" opacity="0.4"/>`);
}

// ------------------------------------------------------------------ write
fs.mkdirSync(path.join(OUT, 'sacristy_teeth'), { recursive: true });
const wrap = (f, w, h, extra = '') => { const s = f.svg(); return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${s.defs}</defs>${extra}${s.body}</svg>`; };
const F = fig(1690); shell(F); body(F); frame(F); plate(F, 800, 66); dish(F, 1404, 70); knocker(F, 1532, 50);
fs.writeFileSync(path.join(OUT, 'sacristy.svg'), wrap(F, W, H));
// each Tooth: its own sprite the size of its niche, a warm glow painted behind it (UI art: the panel may paint light)
const slots = [];
PR.TEETH.forEach((T0, k) => {
  const nx = NX + k * NW, sw = Math.round(NWI), sh = Math.round(NB - NT), f = fig(1700 + k);
  const gid = `tg${k}`;
  const glowDef = `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="#ffb060" stop-opacity="0.55"/><stop offset="0.5" stop-color="#ff9a40" stop-opacity="0.2"/><stop offset="1" stop-color="#ff9a40" stop-opacity="0"/></radialGradient></defs><ellipse cx="${sw / 2}" cy="${sh * 0.6}" rx="${sw * 0.55}" ry="${sh * 0.48}" fill="url(#${gid})"/>`;
  PR.tooth(f, sw / 2, sh - 16, sh * 0.72, T0, { bg: VEL });
  fs.writeFileSync(path.join(OUT, 'sacristy_teeth', `tooth_${T0.w}.svg`), wrap(f, sw, sh, glowDef));
  slots.push({ world: T0.w, name: T0.name, courses: T0.c, rect: [Math.round(nx), NT, sw, sh], file: `sacristy_teeth/tooth_${T0.w}.png` });
});
const layout = { title: [800, 66], dish: [1404, 70], close: [1532, 56, 34], body: [X, Y, PW, PH], line: [X + 60, Y + PH - 46, PW - 120, 36], teeth: [150, 130, 1300, 116], case: [140, 292, 1320, 476], cloth: [140, 812, 1320, 110], tooth_slots: slots };
fs.writeFileSync(path.join(OUT, 'sacristy_layout.json'), JSON.stringify({ sacristy: layout }, null, 1));
console.log('sacristy panel written,', slots.length, 'teeth');
