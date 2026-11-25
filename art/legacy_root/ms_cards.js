const { S, C } = require('./ms_style');
const fs = require('fs');
const INK = S.ink;
// Four manuscript card miniatures, 200x110 each, ink + wash, drollery flavour.
const wrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="110" viewBox="0 0 200 110"><defs>${S.defs}</defs><g filter="url(#wob)"><rect width="200" height="110" fill="${C.parch}"/>${body}<rect x="1.5" y="1.5" width="197" height="107" fill="none" stroke="${INK}" stroke-width="3"/></g></svg>`;
const curls = (y, col) => { let d = ''; for (let x = -10; x < 210; x += 34) d += `M${x} ${y} C${x + 6} ${y - 12} ${x + 20} ${y - 12} ${x + 22} ${y - 2} C${x + 23} ${y + 4} ${x + 16} ${y + 6} ${x + 15} ${y}`; return `<path d="M0 ${y} L200 ${y} L200 110 L0 110 Z" fill="${col}" opacity="0.55"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`; };

// Tidebolt: a lance of water hurled over medieval waves, a startled fish leaping
const tide = wrap(
  `<rect width="200" height="110" fill="#8fb3b0" opacity="0.35"/>` + curls(82, '#6f9fa6') +
  `<path d="M24 46 C70 30 130 28 176 42 C130 58 70 60 24 46 Z" fill="${C.azure}" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M40 44 C80 36 130 36 166 42" fill="none" stroke="#f7eedb" stroke-width="2.2" stroke-linecap="round"/>` +
  `<path d="M176 42 L190 34 L186 42 L190 50 Z" fill="#f7eedb" stroke="${INK}" stroke-width="1.6"/>` +
  `<path d="M24 46 C16 40 10 42 6 36 M28 52 C18 54 12 60 6 58 M30 40 C22 30 14 32 10 26" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>` +
  `<g transform="translate(120 76) rotate(-30)"><path d="M0 0 C8 -8 22 -8 30 0 C22 8 8 8 0 0 Z" fill="${C.red}" stroke="${INK}" stroke-width="1.6"/><path d="M30 0 L40 -7 L38 0 L40 7 Z" fill="${C.red}" stroke="${INK}" stroke-width="1.6"/><circle cx="7" cy="-1.5" r="2.2" fill="#f7eedb" stroke="${INK}" stroke-width="0.8"/><circle cx="7" cy="-1.5" r="0.9" fill="${INK}"/></g>` +
  `<g fill="none" stroke="${INK}" stroke-width="1.1"><circle cx="150" cy="66" r="3"/><circle cx="158" cy="58" r="2"/><circle cx="60" cy="72" r="2.5"/></g>`);

// Kindle: a brazier on a tripod, a little salamander basking in the flame
const kindle = wrap(
  `<rect width="200" height="110" fill="${C.red}" opacity="0.18"/>` +
  `<g stroke="${INK}" stroke-width="1" opacity="0.6">${Array.from({ length: 14 }, (_, i) => { const a = Math.PI * (i / 13); return `<path d="M${100 - Math.cos(a) * 40} ${58 - Math.sin(a) * 34} L${100 - Math.cos(a) * 92} ${58 - Math.sin(a) * 70}"/>`; }).join('')}</g>` +
  `<path d="M100 8 C124 30 132 46 124 64 C118 76 108 80 100 80 C86 80 76 72 74 60 C72 44 88 34 100 8 Z" fill="${C.red}" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M100 32 C112 46 114 58 108 68 C104 74 96 74 92 68 C88 60 94 50 100 32 Z" fill="${C.gold}" stroke="${INK}" stroke-width="1.4"/>` +
  `<path d="M66 76 C80 88 120 88 134 76 L130 70 L70 70 Z" fill="${C.steel}" stroke="${INK}" stroke-width="2"/><path d="M118 72 L130 70 L134 76 C130 80 124 83 118 84 Z" fill="url(#h45)"/>` +
  `<path d="M80 86 L66 108 M120 86 L134 108 M100 88 L100 108" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M104 60 C110 54 120 56 122 62 C126 60 132 62 132 66 C126 66 120 68 114 66 C108 66 104 64 104 60 Z" fill="${C.green}" stroke="${INK}" stroke-width="1.4"/><circle cx="108" cy="59" r="1" fill="${INK}"/><path d="M110 64 L108 69 M118 66 L117 70" stroke="${INK}" stroke-width="1.1"/>`);

// Rimeshard: frost crystals bursting from the floor, a frost-rimed snail recoiling
const rime = wrap(
  `<rect width="200" height="110" fill="#b9cfd6" opacity="0.35"/>` +
  `<path d="M0 92 L200 92" stroke="${INK}" stroke-width="2"/><rect y="92" width="200" height="18" fill="url(#h45w)" opacity="0.7"/>` +
  [[100, 10, 22], [70, 40, 14], [132, 34, 16], [44, 60, 10], [160, 58, 11]].map(([x, top, w]) => `<path d="M${x - w} 92 L${x} ${top} L${x + w} 92 Z" fill="#eef3f2" stroke="${INK}" stroke-width="2"/><path d="M${x} ${top} L${x + w} 92 L${x + w * 0.3} 92 Z" fill="url(#h45)"/><path d="M${x} ${top + 8} L${x - w * 0.4} 88" stroke="${INK}" stroke-width="1"/>`).join('') +
  `<g stroke="${C.azureD}" stroke-width="1.4" stroke-linecap="round"><path d="M100 6 L100 2 M90 10 L86 7 M110 10 L114 7"/></g>` +
  `<g transform="translate(166 80)"><path d="M0 10 C0 0 16 -4 20 6 C23 13 16 18 10 16 C6 15 6 10 10 9" fill="${C.gold}" stroke="${INK}" stroke-width="1.5"/><path d="M-6 12 C2 12 18 12 26 12 C27 8 25 6 22 7" fill="${C.green}" stroke="${INK}" stroke-width="1.5"/></g>` +
  `<g fill="${INK}"><circle cx="24" cy="20" r="1.4"/><circle cx="176" cy="18" r="1.4"/><circle cx="150" cy="14" r="1"/><circle cx="40" cy="34" r="1"/></g>`);

// Arc Torrent: a puff-cheeked wind-head in a storm cloud spitting three bolts onto a soaked floor
const arc = wrap(
  `<rect width="200" height="110" fill="#8e9ab2" opacity="0.3"/>` +
  `<path d="M10 30 C4 14 26 4 40 12 C48 0 76 0 84 12 C96 2 124 4 128 16 C144 8 170 14 172 28 C188 30 194 44 182 50 L20 50 C4 50 0 38 10 30 Z" fill="${C.steel}" stroke="${INK}" stroke-width="2"/>` +
  `<path d="M20 50 L182 50 C186 46 186 42 182 40 L24 40 Z" fill="url(#h45)"/>` +
  `<g><circle cx="100" cy="28" r="14" fill="${C.flesh}" stroke="${INK}" stroke-width="1.8"/><circle cx="88" cy="32" r="6" fill="#e9b9a0" stroke="${INK}" stroke-width="1.2"/><circle cx="112" cy="32" r="6" fill="#e9b9a0" stroke="${INK}" stroke-width="1.2"/><circle cx="95" cy="24" r="1.4" fill="${INK}"/><circle cx="105" cy="24" r="1.4" fill="${INK}"/><circle cx="100" cy="36" r="2.6" fill="${INK}"/><path d="M90 18 L96 21 M110 18 L104 21" stroke="${INK}" stroke-width="1.4"/></g>` +
  [[46, 52, 40, 92], [100, 44, 100, 96], [154, 52, 160, 92]].map(([x1, y1, x2, y2]) => { const mx = (x1 + x2) / 2; return `<path d="M${x1} ${y1} L${mx - 6} ${y1 + 16} L${mx + 6} ${y1 + 18} L${x2 - 4} ${y2 - 14} L${x2 + 4} ${y2 - 12} L${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M${x1} ${y1} L${mx - 6} ${y1 + 16} L${mx + 6} ${y1 + 18} L${x2 - 4} ${y2 - 14} L${x2 + 4} ${y2 - 12} L${x2} ${y2}" fill="none" stroke="${C.gold}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`; }).join('') +
  `<path d="M0 98 L200 98" stroke="${INK}" stroke-width="2"/><path d="M30 102 C60 98 140 98 170 102 C140 106 60 106 30 102 Z" fill="${C.azure}" stroke="${INK}" stroke-width="1.2"/>`);

fs.writeFileSync('src/ms_card_tide.svg', tide);
fs.writeFileSync('src/ms_card_kindle.svg', kindle);
fs.writeFileSync('src/ms_card_rime.svg', rime);
fs.writeFileSync('src/ms_card_arc.svg', arc);
