const { S, C } = require('./gw_style');
const fs = require('fs');
const W = 1600, H = 1000;
// Painterly drowned nave: layered silhouettes (far arches, mid columns, near rubble), god rays,
// floating silt, a flagstone floor slick with water, foreground rocks and kelp framing, heavy vignette.
let o = `<defs>${S.defs}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1820"/><stop offset="0.55" stop-color="#1a3438"/><stop offset="1" stop-color="#21403f"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe8d8" stop-opacity="0.32"/><stop offset="1" stop-color="#bfe8d8" stop-opacity="0"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4440"/><stop offset="1" stop-color="#101a1c"/></linearGradient>
<radialGradient id="vig" cx="0.5" cy="0.42" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></radialGradient>
<radialGradient id="pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#9fe8d6" stop-opacity="0.25"/><stop offset="1" stop-color="#9fe8d6" stop-opacity="0"/></radialGradient>
<filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter><filter id="blur10"><feGaussianBlur stdDeviation="10"/></filter></defs>`;
o += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
o += `<g filter="url(#paint)">`;
// far arcade (very dark, low contrast)
for (let i = 0; i < 6; i++) {
  const x = 40 + i * 270, w = 240;
  o += `<path d="M${x} 470 L${x} 220 C${x} 130 ${x + w * 0.3} 90 ${x + w / 2} 80 C${x + w * 0.7} 90 ${x + w} 130 ${x + w} 220 L${x + w} 470 L${x + w - 30} 470 L${x + w - 30} 230 C${x + w - 30} 160 ${x + w * 0.62} 124 ${x + w / 2} 118 C${x + w * 0.38} 124 ${x + 30} 160 ${x + 30} 230 L${x + 30} 470 Z" fill="#14272b"/>`;
}
// god rays
[[330, 110], [800, 160], [1250, 110]].forEach(([x, w]) => o += `<polygon points="${x - w / 2},0 ${x + w / 2},0 ${x + w * 1.6},520 ${x - w * 1.2},520" fill="url(#ray)"/>`);
// mid columns (broken), with kelp
[[150, 120, 0], [560, 60, 1], [1040, 90, 0], [1450, 40, 1]].forEach(([x, top, broken]) => {
  o += `<rect x="${x - 34}" y="${top}" width="68" height="${480 - top}" fill="#1c3236"/>`;
  o += `<rect x="${x - 34}" y="${top}" width="22" height="${480 - top}" fill="#2a4a4c" opacity="0.8"/>`;
  o += `<rect x="${x + 16}" y="${top}" width="18" height="${480 - top}" fill="#0f1c1f"/>`;
  if (broken) o += `<path d="M${x - 40} ${top} L${x - 20} ${top - 26} L${x} ${top - 8} L${x + 18} ${top - 34} L${x + 40} ${top} Z" fill="#1c3236"/>`;
  else o += `<path d="M${x - 50} ${top} L${x + 50} ${top} L${x + 40} ${top - 18} L${x - 40} ${top - 18} Z" fill="#24403f"/>`;
  o += `<path d="M${x - 24} ${top + 40} C${x - 40} ${top + 120} ${x - 10} ${top + 190} ${x - 30} ${top + 280}" fill="none" stroke="${C.kelp}" stroke-width="9" stroke-linecap="round" opacity="0.9"/>`;
});
// floor
o += `<path d="M0 450 C300 436 500 462 800 448 C1100 434 1300 462 1600 444 L1600 1000 L0 1000 Z" fill="url(#floor)"/>`;
for (let r = 0; r < 5; r++) {
  const y = 470 + r * 28 + r * r * 4;
  o += `<path d="M0 ${y} C300 ${y - 8} 600 ${y + 8} 900 ${y} C1200 ${y - 8} 1400 ${y + 6} 1600 ${y}" fill="none" stroke="#0c1517" stroke-width="${2 + r * 0.6}" opacity="0.55"/>`;
  for (let k = 0; k < 9; k++) { const x = (k * 190 + r * 70) % 1640 - 20; o += `<path d="M${x} ${y} L${x - 10 - r * 4} ${y + 28 + r * 6}" stroke="#0c1517" stroke-width="${1.6 + r * 0.5}" opacity="0.5"/>`; }
}
// wet sheen pools
[[420, 520, 180], [980, 540, 220], [1380, 510, 140]].forEach(([x, y, r]) => o += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.16}" fill="url(#pool)"/>`);
// foreground rocks / rubble framing
o += `<path d="M0 520 C40 500 90 506 120 530 C140 548 120 590 80 600 L0 610 Z" fill="#0d1517"/>`;
o += `<path d="M1600 500 C1550 480 1500 490 1478 516 C1460 540 1480 586 1530 596 L1600 604 Z" fill="#0d1517"/>`;
o += `<path d="M20 520 C50 508 86 512 104 528" fill="none" stroke="#3a5a56" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
// foreground kelp
const kelp = (x, h, lean, col) => `<path d="M${x} 610 C${x + lean * 0.3} ${610 - h * 0.4} ${x - lean * 0.3} ${610 - h * 0.7} ${x + lean} ${610 - h}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round"/>`;
o += kelp(40, 300, 30, '#26361a') + kelp(70, 240, -20, '#34461f') + kelp(1550, 320, -30, '#26361a') + kelp(1520, 250, 24, '#34461f');
o += `</g>`;
// silt / particles
for (let i = 0; i < 90; i++) {
  const x = (i * 137.5) % 1600, y = (i * 61.3) % 560, r = 0.8 + (i % 4) * 0.6;
  o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#cfeee2" opacity="${0.12 + (i % 5) * 0.06}"/>`;
}
// UI zone: deep shadow band with painted edge
o += `<rect y="600" width="${W}" height="400" fill="#0b1012" opacity="0.88"/>`;
o += `<path d="M0 604 C200 592 400 614 600 600 C800 588 1000 614 1200 598 C1400 588 1500 610 1600 598" fill="none" stroke="#8a6a2a" stroke-width="5" filter="url(#paint)"/>`;
o += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
fs.writeFileSync('src/gw_bg.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o}</svg>`);

// ---------- painterly card art 180x100
const card = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="100" viewBox="0 0 180 100"><defs>${S.defs}</defs><g filter="url(#paint)">${body}</g></svg>`;
const tide = card(`<rect width="180" height="100" fill="#173840"/><path d="M0 70 C30 58 60 80 90 68 C120 56 150 76 180 64 L180 100 L0 100 Z" fill="#0f2a30"/><circle cx="130" cy="40" r="30" fill="${C.glowB}" opacity="0.25" filter="url(#glow)"/><path d="M20 46 C60 30 110 30 160 44 C112 58 60 60 20 46 Z" fill="#5aa0c0"/><path d="M40 44 C80 36 120 36 150 42" fill="none" stroke="#e8fff8" stroke-width="3" stroke-linecap="round" opacity="0.8"/><path d="M160 44 L174 38 L170 44 L174 50 Z" fill="#e8fff8"/><circle cx="12" cy="40" r="4" fill="#5aa0c0"/><circle cx="6" cy="52" r="3" fill="#5aa0c0"/>`);
const kindle = card(`<rect width="180" height="100" fill="#2a1414"/><circle cx="90" cy="64" r="44" fill="#e0603a" opacity="0.35" filter="url(#glow)"/><path d="M90 10 C116 38 122 56 112 76 C104 90 76 90 68 76 C58 56 70 38 90 10 Z" fill="#c8643b"/><path d="M90 36 C102 52 104 66 98 76 C94 82 86 82 82 76 C76 66 82 52 90 36 Z" fill="${C.glow}"/><path d="M52 92 L128 88" stroke="#3a2418" stroke-width="10" stroke-linecap="round"/>`);
const rime = card(`<rect width="180" height="100" fill="#1c2a36"/><circle cx="90" cy="50" r="40" fill="#cfe8f2" opacity="0.18" filter="url(#glow)"/><path d="M90 6 L108 50 L90 94 L72 50 Z" fill="#cfe0ea"/><path d="M90 6 L108 50 L90 94 Z" fill="#8fb0c4"/><path d="M44 36 L56 62 L44 90 L32 62 Z" fill="#8fa4b4"/><path d="M136 32 L148 60 L136 90 L124 60 Z" fill="#8fa4b4"/><path d="M0 92 L180 92 L180 100 L0 100 Z" fill="#101820"/>`);
const arc = card(`<rect width="180" height="100" fill="#181c2a"/><path d="M8 30 C4 14 28 4 42 14 C52 2 82 2 90 14 C102 4 132 6 136 18 C154 14 174 24 168 38 C150 46 30 46 8 30 Z" fill="#3e4651"/><path d="M44 40 L34 62 L46 62 L36 92 M92 42 L80 66 L94 66 L84 96 M140 40 L130 60 L142 60 L134 88" fill="none" stroke="${C.glow}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.5" filter="url(#glow2)"/><path d="M44 40 L34 62 L46 62 L36 92 M92 42 L80 66 L94 66 L84 96 M140 40 L130 60 L142 60 L134 88" fill="none" stroke="#fff6d8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 94 L180 94" stroke="#5aa0c0" stroke-width="6" opacity="0.6"/>`);
fs.writeFileSync('src/gw_card_tide.svg', tide);
fs.writeFileSync('src/gw_card_kindle.svg', kindle);
fs.writeFileSync('src/gw_card_rime.svg', rime);
fs.writeFileSync('src/gw_card_arc.svg', arc);
