// Weeping Nun: a drowned sister in a sodden habit, wimple torn away; salt tears have eaten channels down
// her face to the bone. She cradles a basin of brine that heals the dead. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 181);
const P = require('./parts')(a), R = a.R;
a.raw(a.ground(230, 676, 120, 10));
{
  const hem = P.ragged(300, 160, 660, 12, 16);
  a.shape({ d: smooth([[200, 220], [262, 218], [288, 290], [300, 440], ...hem, [160, 440], [174, 290]], true, 0.45), fill: '#2c2a2c', depth: 40, mottle: 0.5, fine: true, hatch: 70,
    decals: a.fold(204, 290, 186, 650, 8) + a.fold(232, 290, 232, 660, 8) + a.fold(264, 300, 280, 650, 7) + a.stain(230, 620, 30, '#c8c4b8', 0.4) + a.stain(250, 560, 18, G.algae, 0.5) + P.barnacles(272, 600, 7, 12) });
  // white scapular, stained
  a.shape({ d: smooth([[214, 236], [250, 234], [256, 330], [252, 520], [216, 524], [210, 330]], true, 0.4), fill: '#cfc8b4', depth: 12, mottle: 0.7, fine: true, hatch: 70,
    decals: a.stain(232, 300, 14, G.bloodD, 0.6) + a.stain(236, 440, 18, G.algae, 0.6) + `<path d="M232 260 L232 300 M220 276 L244 276" stroke="${G.bloodD}" stroke-width="3"/>` });
}
// arms cradling a basin of brine
a.limb([[206, 240], [190, 300], [204, 344]], [26, 22, 18], { fill: '#2c2a2c', depth: 8, mottle: 0.5, fine: true, hatch: 40 });
a.limb([[262, 240], [280, 300], [256, 346]], [26, 22, 18], { fill: '#2c2a2c', depth: 8, mottle: 0.5, fine: true, hatch: 120 });
a.shape({ d: smooth([[176, 340], [284, 340], [276, 368], [236, 380], [186, 368]], true, 0.6), fill: G.iron, depth: 10, mottle: 0.6, ink: 1.2, decals: a.stain(220, 360, 12, G.rust, 0.7) });
a.raw(`<ellipse cx="230" cy="341" rx="52" ry="7" fill="#5f8a8a" stroke="${INK}" stroke-width="0.9"/><path d="M196 340 C210 336 226 336 240 340" stroke="#d8ece8" stroke-width="1" fill="none"/>` + a.drip(186, 366, 22, 2.2, '#5f8a8a') + a.drip(270, 366, 16, 2, '#5f8a8a'));
for (const [x, y] of [[196, 346], [264, 346]]) a.shape({ d: smooth([[x - 10, y - 6], [x + 10, y - 8], [x + 12, y + 8], [x - 8, y + 10]], true, 0.6), fill: '#a8b0a4', depth: 4 });
// head: wimple torn, face channelled by salt
a.shape({ d: smooth([[196, 160], [220, 146], [250, 150], [264, 176], [262, 214], [244, 232], [214, 232], [196, 212]], true, 0.7), fill: '#a8b0a4', depth: 16, mottle: 0.6, fine: true, hatch: 90,
  decals: P.socket(212, 186, 6) + P.eye(240, 186, 5, '#a0b8b0', true) +
    `<path d="M210 192 C208 210 212 222 210 234 M214 192 C216 206 214 220 218 232" stroke="${G.bone}" stroke-width="2.6" fill="none"/><path d="M210 192 C208 210 212 222 210 234" stroke="${INK}" stroke-width="0.6" fill="none"/>` +
    `<path d="M238 194 C240 210 236 222 240 234" stroke="${G.bone}" stroke-width="2" fill="none"/><path d="M220 214 C226 220 234 220 240 214" stroke="${INK}" stroke-width="1.1" fill="none"/>`,
  over: P.drool(212, 234, 18, '#d8e4e0') + P.drool(240, 234, 12, '#d8e4e0') });
a.shape({ d: smooth([[186, 166], [204, 134], [244, 128], [272, 150], [282, 200], [292, 260], [274, 268], [264, 214], [258, 170], [226, 150], [204, 166], [196, 220], [180, 236]], true, 0.6), fill: '#2c2a2c', depth: 12, mottle: 0.5, fine: true, hatch: 30 });
a.shape({ d: smooth([[196, 146], [236, 136], [266, 150], [262, 158], [230, 148], [200, 156]], true, 0.4), fill: '#cfc8b4', depth: 3, core: false, ink: 0.9, decals: a.stain(236, 146, 6, G.algae, 0.6) });
require('fs').writeFileSync('grim/e_weeping_nun.svg', a.svg());
