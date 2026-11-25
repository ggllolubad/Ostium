const { S, C } = require('./ms_style');
const fs = require('fs');
const INK = S.ink;
// Manuscript background: a vellum page. The scene panel is a drowned cathedral nave drawn in ink with
// blue-green washes, a tiled floor in perspective, kelp, a sunken bell, a broken column and fish.
// Margins carry vine scrolls and two drolleries (a sword-snail and a fish-bird), plus an illuminated O.
let o = '';
const W = 1600, H = 1000;
// base vellum + stains
o += `<rect width="${W}" height="${H}" fill="${C.parch}"/>`;
o += `<radialGradient id="stain" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#c9b48a" stop-opacity="0.22"/><stop offset="1" stop-color="#c9b48a" stop-opacity="0"/></radialGradient>`;
o += `<radialGradient id="vig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a4426" stop-opacity="0.18"/></radialGradient>`;
[[220, 760, 140], [1380, 120, 110], [900, 900, 160], [1500, 820, 90], [80, 220, 80]].forEach(([x, y, r]) => o += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#stain)"/>`);

// panel frame (scene area): x 60..1540, y 96..560
const PX = 60, PY = 96, PW = 1480, PH = 470;
o += `<clipPath id="panel"><rect x="${PX}" y="${PY}" width="${PW}" height="${PH}"/></clipPath>`;
o += `<g clip-path="url(#panel)">`;
// water wash
o += `<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f9fa6" stop-opacity="0.55"/><stop offset="0.75" stop-color="#8fb3a8" stop-opacity="0.35"/><stop offset="1" stop-color="#b9c4a0" stop-opacity="0.25"/></linearGradient>`;
o += `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="url(#water)"/>`;
// surface waves at top (medieval curls)
let wv = '';
for (let x = PX - 40; x < PX + PW + 40; x += 64) wv += `M${x} 128 C${x + 12} 108 ${x + 36} 108 ${x + 40} 124 C${x + 42} 134 ${x + 30} 136 ${x + 28} 128 `;
o += `<path d="${wv}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`;
o += `<rect x="${PX}" y="${PY}" width="${PW}" height="28" fill="#5d8f99" opacity="0.5"/>`;
// light shafts (paler wash)
[[320, 90], [800, 130], [1260, 90]].forEach(([x, w]) => o += `<polygon points="${x - w / 2},${PY} ${x + w / 2},${PY} ${x + w * 1.4},440 ${x - w * 0.9},440" fill="#f4ecd4" opacity="0.32"/>`);
// distant arcade: 5 gothic arches with hatched voids
const archXs = [140, 430, 720, 1010, 1300];
archXs.forEach((x, i) => {
  const w = 220, top = 150, base = 430;
  const d = `M${x} ${base} L${x} ${top + 90} C${x} ${top + 30} ${x + w * 0.3} ${top} ${x + w / 2} ${top - 10} C${x + w * 0.7} ${top} ${x + w} ${top + 30} ${x + w} ${top + 90} L${x + w} ${base}`;
  o += `<path d="${d} Z" fill="url(#h45w)" opacity="0.45"/>`;
  o += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
  const di = `M${x + 22} ${base} L${x + 22} ${top + 96} C${x + 22} ${top + 46} ${x + w * 0.34} ${top + 22} ${x + w / 2} ${top + 12} C${x + w * 0.66} ${top + 22} ${x + w - 22} ${top + 46} ${x + w - 22} ${top + 96} L${x + w - 22} ${base}`;
  o += `<path d="${di}" fill="none" stroke="${INK}" stroke-width="1.3"/>`;
  // voussoir ticks
  for (let t = 0; t < 9; t++) {
    const a = Math.PI * (0.08 + t * 0.105);
    const cx = x + w / 2, cy = top + 96, rx = w / 2, ry = 100;
    const x1 = cx - Math.cos(a) * (rx - 2), y1 = cy - Math.sin(a) * (ry + 4);
    const x2 = cx - Math.cos(a) * (rx - 22), y2 = cy - Math.sin(a) * (ry - 14);
    o += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${INK}" stroke-width="1.1"/>`;
  }
  // tracery quatrefoil in each arch head
  const qx = x + w / 2, qy = top + 50;
  o += `<g fill="none" stroke="${INK}" stroke-width="1.4"><circle cx="${qx}" cy="${qy - 10}" r="9"/><circle cx="${qx}" cy="${qy + 10}" r="9"/><circle cx="${qx - 10}" cy="${qy}" r="9"/><circle cx="${qx + 10}" cy="${qy}" r="9"/></g>`;
});
// piers between arches with capitals
archXs.concat([1590]).forEach((x) => {
  o += `<rect x="${x - 14}" y="230" width="28" height="200" fill="${C.parchD}" stroke="${INK}" stroke-width="2"/>`;
  o += `<rect x="${x - 2}" y="230" width="16" height="200" fill="url(#h45)" opacity="0.7"/>`;
  o += `<path d="M${x - 20} 230 L${x + 20} 230 L${x + 14} 218 L${x - 14} 218 Z" fill="${C.gold}" stroke="${INK}" stroke-width="1.6"/>`;
  [270, 320, 370].forEach(y => o += `<path d="M${x - 14} ${y} L${x + 14} ${y}" stroke="${INK}" stroke-width="1"/>`);
});
// floor: tiled pavement in perspective from y 430 to 566
const fy0 = 430, fy1 = 566, vx = 800;
o += `<rect x="${PX}" y="${fy0}" width="${PW}" height="${fy1 - fy0}" fill="#d9c79e"/>`;
const rows = [430, 446, 466, 492, 524, 566];
for (let r = 0; r < rows.length - 1; r++) {
  const yA = rows[r], yB = rows[r + 1];
  for (let k = -16; k <= 16; k++) {
    const sA = (yA - 360) / 200, sB = (yB - 360) / 200;
    const xa0 = vx + k * 120 * sA, xa1 = vx + (k + 1) * 120 * sA, xb0 = vx + k * 120 * sB, xb1 = vx + (k + 1) * 120 * sB;
    const dark = (k + r) % 2 === 0;
    o += `<polygon points="${xa0},${yA} ${xa1},${yA} ${xb1},${yB} ${xb0},${yB}" fill="${dark ? '#b99a6a' : '#e6d6b0'}" stroke="${INK}" stroke-width="1.1"/>`;
    if (dark) o += `<polygon points="${xa0},${yA} ${xa1},${yA} ${xb1},${yB} ${xb0},${yB}" fill="url(#h45w)" opacity="0.55"/>`;
  }
}
o += `<path d="M${PX} ${fy0} L${PX + PW} ${fy0}" stroke="${INK}" stroke-width="2.6"/>`;
o += `<rect x="${PX}" y="${fy0}" width="${PW}" height="${fy1 - fy0}" fill="#7fa8a2" opacity="0.18"/>`;
// kelp clusters
const kelp = (x, h, s) => {
  let k = '';
  for (let i = 0; i < 3; i++) {
    const xx = x + i * 14 * s, hh = h * (0.7 + 0.15 * i);
    const d = `M${xx} 436 C${xx - 14} ${436 - hh * 0.3} ${xx + 16} ${436 - hh * 0.55} ${xx - 4} ${436 - hh * 0.8} C${xx - 14} ${436 - hh * 0.9} ${xx + 4} ${436 - hh} ${xx + 2} ${436 - hh}`;
    k += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.greenD}" stroke-width="4.2" stroke-linecap="round"/>`;
    for (let j = 1; j < 4; j++) { const yy = 436 - hh * j * 0.22; k += `<path d="M${xx} ${yy} C${xx + 10} ${yy - 8} ${xx + 18} ${yy - 4} ${xx + 22} ${yy - 12}" fill="none" stroke="${INK}" stroke-width="1.4"/>`; }
  }
  return k;
};
o += kelp(78, 200, 1) + kelp(790, 120, 1) + kelp(1460, 220, 1);
o += `<path d="M1161 100 L1161 156" stroke="${INK}" stroke-width="2"/><g transform="translate(52 -276)"><path d="M1086 470 C1086 438 1132 438 1132 470 L1140 496 L1078 496 Z" fill="${C.goldD}" stroke="${INK}" stroke-width="2.2"/><path d="M1116 444 C1128 452 1132 470 1140 496 L1124 496 C1122 470 1120 456 1116 444 Z" fill="url(#h45)"/><path d="M1080 486 L1138 486" stroke="${INK}" stroke-width="1.3"/><circle cx="1109" cy="500" r="5" fill="${C.goldD}" stroke="${INK}" stroke-width="1.6"/><path d="M1104 438 L1104 430 L1114 430 L1114 438" fill="none" stroke="${INK}" stroke-width="2"/></g>`;
// fish
const fish = (x, y, s, f, col) => `<g transform="translate(${x} ${y}) scale(${f * s} ${s})"><path d="M0 0 C12 -12 34 -12 46 0 C34 12 12 12 0 0 Z" fill="${col}" stroke="${INK}" stroke-width="1.8"/><path d="M46 0 L60 -10 L57 0 L60 10 Z" fill="${col}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="-2" r="2" fill="${INK}"/><path d="M20 -6 C24 0 24 4 20 8 M28 -7 C32 0 32 4 28 8" fill="none" stroke="${INK}" stroke-width="1"/></g>`;
o += fish(470, 200, 0.9, 1, C.red) + fish(1290, 134, 0.8, -1, C.gold) + fish(1340, 164, 0.6, -1, C.azure) + fish(980, 280, 0.5, 1, C.green);
// bubbles
[[520, 160, 6], [532, 138, 4], [1060, 250, 7], [1068, 226, 4], [300, 300, 5]].forEach(([x, y, r]) => o += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.3"/>`);
o += `</g>`;
// panel border: gold band + ink rules
o += `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="none" stroke="${INK}" stroke-width="10"/>`;
o += `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="none" stroke="${C.gold}" stroke-width="6"/>`;
o += `<rect x="${PX - 10}" y="${PY - 10}" width="${PW + 20}" height="${PH + 20}" fill="none" stroke="${C.red}" stroke-width="2"/>`;
o += `<rect x="${PX - 15}" y="${PY - 15}" width="${PW + 30}" height="${PH + 30}" fill="none" stroke="${C.azureD}" stroke-width="1.4"/>`;

// lower page area rule lines (UI sits here)
o += `<path d="M60 594 L1540 594 M60 598 L1540 598" stroke="${C.red}" stroke-width="1.2"/>`;

// marginal vine along bottom and right
const vine = (x0, y0, x1, amp, n) => {
  let d = `M${x0} ${y0}`, leaves = '';
  const len = x1 - x0;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = x0 + len * t, y = y0 + Math.sin(t * Math.PI * 6) * amp;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    if (i % 6 === 3) {
      const dir = Math.sin(t * Math.PI * 6) > 0 ? -1 : 1;
      leaves += `<path d="M${x} ${y} C${x + 8} ${y + dir * 6} ${x + 20} ${y + dir * 4} ${x + 26} ${y + dir * 14} C${x + 14} ${y + dir * 16} ${x + 4} ${y + dir * 10} ${x} ${y} Z" fill="${i % 12 === 3 ? C.green : C.gold}" stroke="${INK}" stroke-width="1.3"/>`;
    }
  }
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` + leaves;
};
o += vine(40, 982, 1560, 6, 240);
// illuminated O initial top-left corner
o += `<g transform="translate(14 14)"><rect width="74" height="74" fill="${C.azure}" stroke="${INK}" stroke-width="2.4"/><rect x="5" y="5" width="64" height="64" fill="url(#diaper)"/><circle cx="37" cy="37" r="24" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="37" cy="37" r="24" fill="none" stroke="${C.gold}" stroke-width="8"/><path d="M37 13 L37 61" stroke="${C.red}" stroke-width="2"/><circle cx="37" cy="37" r="5" fill="${C.red}" stroke="${INK}" stroke-width="1.4"/></g>`;
o += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${S.defs}</defs><g filter="url(#wob)">${o}</g></svg>`;
fs.writeFileSync(process.argv[2] || 'src/ms_bg_game.svg', svg);
