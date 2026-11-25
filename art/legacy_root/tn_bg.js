const { C } = require('./tn_style');
const fs = require('fs');
const INK = C.ink;
const W = 1600, H = 1000;
// Tarot / Art Nouveau background: a great horseshoe arch with beaded, petalled border opens on a drowned
// moonlit hall. Whiplash current lines, a huge ornamental moon disc, reed and lily foreground, and a
// carved cream stage below for the UI.
let o = '';
o += `<defs><radialGradient id="moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#efe4cc" stop-opacity="0.8"/><stop offset="0.7" stop-color="#cfdcd2" stop-opacity="0.35"/><stop offset="1" stop-color="#cfdcd2" stop-opacity="0"/></radialGradient>
<linearGradient id="deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26444a"/><stop offset="0.7" stop-color="#3a6566"/><stop offset="1" stop-color="#4d7a7a"/></linearGradient>
<filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter></defs>`;
o += `<rect width="${W}" height="${H}" fill="#2b3a3a"/>`;
// scene inside arch
o += `<clipPath id="archclip"><path d="M70 604 L70 270 C70 110 230 64 380 64 L1220 64 C1370 64 1530 110 1530 270 L1530 604 Z"/></clipPath>`;
o += `<g clip-path="url(#archclip)">`;
o += `<rect width="${W}" height="${H}" fill="url(#deep)"/>`;
o += `<circle cx="800" cy="290" r="330" fill="url(#moon)"/>`;
o += `<circle cx="800" cy="290" r="250" fill="none" stroke="${C.ochre}" stroke-width="2.4" opacity="0.7"/>`;
o += `<circle cx="800" cy="290" r="238" fill="none" stroke="${C.ochre}" stroke-width="4" stroke-dasharray="0.1 14" stroke-linecap="round" opacity="0.8"/>`;
for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; const x1 = 800 + Math.cos(a) * 226, y1 = 290 + Math.sin(a) * 226, x2 = 800 + Math.cos(a) * 196, y2 = 290 + Math.sin(a) * 196; o += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${C.ochre}" stroke-width="1.6" opacity="0.55"/>`; }
// drowned columns with lily capitals, silhouetted
[200, 470, 1130, 1400].forEach((x, i) => {
  o += `<rect x="${x - 26}" y="150" width="52" height="400" fill="#284446" stroke="${INK}" stroke-width="3"/>`;
  o += `<rect x="${x + 6}" y="150" width="20" height="400" fill="#1f3638"/>`;
  o += `<path d="M${x - 46} 150 C${x - 40} 120 ${x - 20} 110 ${x} 124 C${x + 20} 110 ${x + 40} 120 ${x + 46} 150 Z" fill="#335556" stroke="${INK}" stroke-width="3"/>`;
  o += `<path d="M${x - 30} 140 C${x - 20} 128 ${x - 8} 126 ${x} 134 C${x + 8} 126 ${x + 20} 128 ${x + 30} 140" fill="none" stroke="${C.ochre}" stroke-width="2"/>`;
  [240, 330, 420].forEach(y => o += `<path d="M${x - 26} ${y} L${x + 26} ${y}" stroke="${INK}" stroke-width="1.6" opacity="0.7"/>`);
  o += `<path d="M${x - 20} 200 C${x - 30} 260 ${x - 10} 300 ${x - 22} 360" fill="none" stroke="#4f7a5a" stroke-width="5" stroke-linecap="round"/>`;
});
// whiplash current lines
for (let k = 0; k < 6; k++) {
  const y = 120 + k * 52;
  o += `<path d="M60 ${y} C220 ${y - 40} 320 ${y + 40} 520 ${y} C720 ${y - 40} 860 ${y + 40} 1060 ${y} C1260 ${y - 40} 1380 ${y + 40} 1560 ${y}" fill="none" stroke="${C.tealL}" stroke-width="${2.4 - k * 0.25}" opacity="${0.4 - k * 0.04}"/>`;
}
// light rays
[[560, 120], [800, 160], [1040, 120]].forEach(([x, w]) => o += `<polygon points="${x - w / 2},64 ${x + w / 2},64 ${x + w * 1.1},520 ${x - w * 1.1},520" fill="#efe4cc" opacity="0.07"/>`);
// stage floor: water surface on stone, at 470..604
o += `<path d="M60 470 C300 456 500 482 800 468 C1100 454 1300 482 1540 466 L1540 604 L60 604 Z" fill="#3f6b66" stroke="${INK}" stroke-width="3"/>`;
o += `<path d="M60 500 C300 488 500 512 800 500 C1100 488 1300 512 1540 498 L1540 604 L60 604 Z" fill="#355c58"/>`;
[488, 520, 556, 590].forEach((y, i) => o += `<path d="M60 ${y} C260 ${y - 10} 460 ${y + 10} 700 ${y} C940 ${y - 10} 1140 ${y + 10} 1540 ${y - 4}" fill="none" stroke="${C.tealL}" stroke-width="${1.8 - i * 0.2}" opacity="0.55"/>`);
// lily pads + blossoms + reeds in foreground
const pad = (x, y, rx) => `<path d="M${x} ${y} m-${rx} 0 a${rx} ${rx * 0.3} 0 1 0 ${rx * 2} 0 a${rx} ${rx * 0.3} 0 1 0 -${rx * 2} 0 Z" fill="${C.sage}" stroke="${INK}" stroke-width="2.4"/><path d="M${x} ${y} L${x + rx * 0.9} ${y - rx * 0.12}" stroke="${INK}" stroke-width="2"/><path d="M${x - rx * 0.6} ${y + 2} C${x - rx * 0.3} ${y - 4} ${x + rx * 0.2} ${y - 4} ${x + rx * 0.5} ${y + 2}" fill="none" stroke="${C.sageD}" stroke-width="1.6"/>`;
const bloom = (x, y) => `<g stroke="${INK}" stroke-width="2"><path d="M${x} ${y} C${x - 14} ${y - 6} ${x - 14} ${y - 24} ${x} ${y - 30} C${x + 14} ${y - 24} ${x + 14} ${y - 6} ${x} ${y} Z" fill="${C.roseL}"/><path d="M${x} ${y} C${x - 22} ${y} ${x - 26} ${y - 12} ${x - 22} ${y - 20} C${x - 14} ${y - 14} ${x - 8} ${y - 6} ${x} ${y} Z M${x} ${y} C${x + 22} ${y} ${x + 26} ${y - 12} ${x + 22} ${y - 20} C${x + 14} ${y - 14} ${x + 8} ${y - 6} ${x} ${y} Z" fill="${C.rose}"/><circle cx="${x}" cy="${y - 8}" r="3" fill="${C.ochreL}"/></g>`;
o += pad(150, 560, 60) + pad(780, 586, 46) + pad(1460, 566, 64) + pad(1020, 548, 30) + bloom(170, 556) + bloom(1440, 562) + bloom(796, 584);
const reed = (x, h, lean) => `<path d="M${x} 604 C${x + lean * 0.3} ${604 - h * 0.5} ${x + lean * 0.7} ${604 - h * 0.8} ${x + lean} ${604 - h}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x} 604 C${x + lean * 0.3} ${604 - h * 0.5} ${x + lean * 0.7} ${604 - h * 0.8} ${x + lean} ${604 - h}" fill="none" stroke="${C.sageD}" stroke-width="4" stroke-linecap="round"/>`;
o += reed(90, 260, -20) + reed(110, 220, 14) + reed(1500, 280, 22) + reed(1520, 230, -12) + reed(1480, 200, -26);
o += `<ellipse cx="96" cy="342" rx="7" ry="22" fill="${C.hairD}" stroke="${INK}" stroke-width="2"/><ellipse cx="1522" cy="324" rx="7" ry="22" fill="${C.hairD}" stroke="${INK}" stroke-width="2"/>`;
o += `</g>`;
// arch frame: ink band, ochre band with beads, petal ornaments, inner cream line
const arch = 'M70 604 L70 270 C70 110 230 64 380 64 L1220 64 C1370 64 1530 110 1530 270 L1530 604';
o += `<path d="${arch}" fill="none" stroke="${INK}" stroke-width="44"/>`;
o += `<path d="${arch}" fill="none" stroke="${C.ochre}" stroke-width="34"/>`;
o += `<path d="${arch}" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="0.1 22" stroke-linecap="round" transform="translate(0 0)"/>`;
o += `<path d="${arch}" fill="none" stroke="${C.ochreL}" stroke-width="6" stroke-dasharray="14 16" opacity="0.8"/>`;
o += `<path d="M96 604 L96 276 C96 130 244 90 384 90 L1216 90 C1356 90 1504 130 1504 276 L1504 604" fill="none" stroke="${C.cream}" stroke-width="2.4" opacity="0.7"/>`;
// keystone medallion
o += `<circle cx="800" cy="64" r="40" fill="${C.ochre}" stroke="${INK}" stroke-width="4"/><circle cx="800" cy="64" r="28" fill="${C.tealD}" stroke="${INK}" stroke-width="3"/>`;
o += `<path d="M800 44 L800 84 M780 64 L820 64" stroke="${C.ochreL}" stroke-width="2"/><path d="M788 76 L788 54 C788 44 812 44 812 54 L812 76 Z" fill="none" stroke="${C.ochreL}" stroke-width="2.4"/>`;
// spandrel corners (outside arch) with whiplash flourishes
o += `<path d="M0 0 L0 270 C10 120 140 30 380 20 L0 20 Z" fill="#33464a"/><path d="M1600 0 L1600 270 C1590 120 1460 30 1220 20 L1600 20 Z" fill="#33464a"/>`;
o += `<path d="M20 200 C30 120 90 70 180 50 C140 70 120 100 126 124 C132 146 160 146 160 126" fill="none" stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"/>`;
o += `<path d="M1580 200 C1570 120 1510 70 1420 50 C1460 70 1480 100 1474 124 C1468 146 1440 146 1440 126" fill="none" stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"/>`;
// stage below (UI area): carved cream panel with ochre wavy top border
o += `<rect y="604" width="${W}" height="${H - 604}" fill="#efe4cc"/>`;
let wave = 'M0 606';
for (let x = 0; x <= W; x += 100) wave += ` C${x + 30} 594 ${x + 70} 622 ${x + 100} 606`;
o += `<path d="${wave} L${W} 620 L0 620 Z" fill="${C.ochre}" stroke="${INK}" stroke-width="3"/>`;
o += `<path d="M30 980 C210 960 310 990 490 972 M1110 972 C1290 990 1390 960 1570 980" fill="none" stroke="${C.ochre}" stroke-width="3" stroke-linecap="round"/>`;
fs.writeFileSync('src/tn_bg.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o}</svg>`);
