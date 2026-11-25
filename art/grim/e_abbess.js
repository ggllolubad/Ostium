// Abbess of Salt (elite): a towering drowned abbess, skin crusted white with salt, crozier hung with
// drowned children's shoes; her mouth is sewn shut and she preaches through a slit in her throat. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(560, 800, 231);
const P = require('./parts')(a), R = a.R;
const salt = { fill: '#cfcabb', mottle: 0.6, fine: true, wash: 0.34 };
a.raw(a.ground(280, 776, 170, 12));
{
  const hem = P.ragged(382, 182, 772, 14, 14);
  a.shape({ d: smooth([[220, 260], [330, 256], [366, 340], [382, 520], ...hem, [182, 520], [196, 340]], true, 0.45), fill: '#2a2628', depth: 50, mottle: 0.4, fine: true, hatch: 70,
    decals: a.fold(226, 340, 200, 760, 9) + a.fold(282, 340, 280, 770, 9) + a.fold(338, 360, 362, 760, 8) + a.stain(280, 730, 40, '#e8e4d8', 0.6) + a.stain(330, 600, 26, '#e8e4d8', 0.45) });
  a.shape({ d: smooth([[244, 270], [312, 266], [320, 360], [316, 620], [250, 624], [242, 360]], true, 0.4), fill: '#8a1e18', depth: 16, mottle: 0.6, fine: true, hatch: 70,
    decals: `<path d="M262 300 L300 300 L300 340 L262 340 Z" fill="none" stroke="${G.gold}" stroke-width="2"/><path d="M281 300 L281 400 M262 330 L300 330" stroke="${G.gold}" stroke-width="2"/>` + a.stain(280, 520, 26, '#e8e4d8', 0.6) });
}
// crozier with hanging shoes
a.shape({ d: limb([[188, 776], [182, 400], [178, 150]], [9, 9.5, 9]), fill: G.goldL, depth: 4, core: false, decals: a.stain(182, 500, 8, '#e8e4d8', 0.8) });
a.raw(`<path d="M178 152 C176 110 214 96 230 118 C242 136 226 158 206 150 C196 146 200 130 210 132" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M178 152 C176 110 214 96 230 118 C242 136 226 158 206 150 C196 146 200 130 210 132" fill="none" stroke="${G.goldL}" stroke-width="5" stroke-linecap="round"/>`);
for (const [x, y, l] of [[196, 220, 40], [176, 240, 60], [160, 214, 30]]) {
  a.raw(`<path d="M${x + 6} ${y} L${x} ${y + l}" stroke="${INK}" stroke-width="0.8"/>`);
  a.shape({ d: smooth([[x - 8, y + l], [x + 8, y + l], [x + 10, y + l + 12], [x - 14, y + l + 14], [x - 16, y + l + 8]], true, 0.5), fill: G.leatherD, depth: 3, core: false, ink: 0.9 });
}
// arms
a.limb([[226, 290], [190, 360], [186, 410]], [40, 34, 28], { fill: '#2a2628', depth: 12, mottle: 0.4, fine: true, hatch: 40 });
a.shape(Object.assign({ d: smooth([[166, 396], [200, 392], [206, 418], [188, 428], [166, 420]], true, 0.6), depth: 6, lines: ['M170 408 L204 406'] }, salt));
a.limb([[334, 290], [372, 350], [400, 330]], [40, 34, 28], { fill: '#2a2628', depth: 12, mottle: 0.4, fine: true, hatch: 120 });
a.shape(Object.assign({ d: smooth([[394, 312], [420, 300], [440, 306], [432, 318], [446, 322], [430, 334], [404, 344]], true, 0.5), depth: 6, after: `<path d="M440 306 L452 300 M446 322 L458 322" stroke="${INK}" stroke-width="1.2"/>` }, salt));
// head: salt-crusted, mouth sewn, throat slit preaching
a.shape(Object.assign({ d: smooth([[244, 250], [312, 248], [314, 276], [246, 280]], true, 0.5), depth: 8, decals: `<path d="M252 262 C272 270 292 270 306 262 C292 284 264 284 252 262 Z" fill="${G.black}"/><path d="M256 264 C272 270 290 270 302 264" stroke="#8a2a20" stroke-width="2.2" fill="none"/>`, over: a.drip(270, 278, 20, 2.2) + a.drip(290, 278, 14, 1.8) }, salt));
a.shape(Object.assign({ d: smooth([[236, 180], [268, 160], [304, 168], [320, 198], [314, 236], [290, 254], [256, 254], [236, 234]], true, 0.7), depth: 20, hatch: 100,
  decals: P.eye(258, 200, 7, '#2a4a5a', true) + P.eye(292, 198, 6, '#2a4a5a', true) + `<path d="M252 226 L300 226" stroke="${INK}" stroke-width="1.4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${256 + i * 8} 220 L${258 + i * 8} 232" stroke="${INK}" stroke-width="1.2"/>`).join('') +
    `<path d="M256 206 C254 216 256 222 252 230 M292 204 C294 214 292 220 296 228" stroke="${G.bone}" stroke-width="1.6" fill="none"/>` + a.stain(310, 190, 12, '#e8e4d8', 0.6) }, salt));
// wimple and tall coif
a.shape({ d: smooth([[222, 186], [246, 120], [292, 100], [336, 124], [346, 190], [356, 280], [330, 290], [322, 200], [306, 160], [262, 156], [240, 196], [236, 270], [214, 276]], true, 0.6), fill: '#2a2628', depth: 16, mottle: 0.4, fine: true, hatch: 30 });
a.shape({ d: smooth([[240, 164], [270, 150], [306, 154], [312, 166], [270, 162], [244, 176]], true, 0.4), fill: '#e8e4d8', depth: 3, core: false, ink: 0.9 });
// salt crystals scattered
a.raw(Array.from({ length: 24 }, () => { const x = 200 + R() * 200, y = 300 + R() * 460; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l2.4 -2.4 l2.4 2.4 l-2.4 2.4 Z" fill="#f4f0e4" stroke="${INK}" stroke-width="0.4"/>`; }).join(''));
require('fs').writeFileSync('grim/e_abbess.svg', a.svg());
