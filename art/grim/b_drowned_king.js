// The Drowned King (boss): a vast, sea-bloated monarch, coral grown through his skull into a crown, robes of
// rotted ermine heavy with silt, a gutted belly where eels nest, a bone sceptre tipped with an angler's lure. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(700, 900, 301);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#7f8f82', mottle: 0.5, fine: true, wash: 0.4 };
a.raw(a.ground(350, 876, 240, 14));
a.raw(`<path d="M150 872 C250 850 470 850 560 872 C500 892 220 894 150 872 Z" fill="${G.water}" opacity="0.45"/>`);
// royal mantle behind: vast, torn, ermine trim rotted
{
  const hem = P.ragged(600, 110, 860, 18, 24);
  a.shape({ d: smooth([[260, 250], [440, 240], [540, 330], [600, 560], ...hem, [110, 560], [170, 330]], true, 0.45), fill: '#5a1e2a', depth: 60, mottle: 0.5, fine: true, hatch: 60,
    decals: a.fold(260, 330, 170, 850, 10) + a.fold(330, 330, 300, 860, 10) + a.fold(440, 330, 470, 860, 10) + a.fold(520, 380, 570, 850, 9) + a.stain(350, 800, 60, G.algae, 0.55) + P.barnacles(520, 700, 14, 30) + P.barnacles(160, 760, 10, 24) });
  a.shape({ d: smooth([[240, 262], [460, 250], [480, 300], [420, 320], [350, 300], [280, 320], [222, 300]], true, 0.5), fill: '#d8d0bc', depth: 14, mottle: 0.8, fine: true, hatch: 80,
    decals: Array.from({ length: 14 }, (_, i) => `<path d="M${250 + i * 15} ${276 + (i % 3) * 8} l2 8 l2 -8 Z" fill="${G.black}"/>`).join('') + a.stain(350, 290, 30, G.algae, 0.6) });
}
// legs: pillars of swollen flesh
a.limb([[400, 640], [420, 760], [414, 856]], [100, 84, 70], Object.assign({ depth: 26, hatch: 110 }, skin));
a.limb([[290, 640], [266, 760], [262, 856]], [100, 84, 70], Object.assign({ depth: 26, hatch: 60 }, skin));
for (const x of [214, 370]) a.shape(Object.assign({ d: smooth([[x + 6, 836], [x + 96, 836], [x + 108, 876], [x - 8, 876]], true, 0.5), depth: 10, after: [0, 1, 2, 3].map(i => `<path d="M${x + 4 + i * 24} 870 L${x - 4 + i * 24} 880" stroke="${INK}" stroke-width="2"/>`).join('') }, skin));
// belly: gutted, eels nesting
a.shape(Object.assign({ d: smooth([[250, 330], [450, 320], [500, 420], [490, 560], [440, 650], [260, 656], [210, 560], [204, 420]], true, 0.75), depth: 60, hatch: 110,
  decals: `<path d="M290 450 C330 430 400 430 430 460 C420 540 340 560 290 520 Z" fill="${G.black}"/><path d="M296 456 C330 440 396 440 424 464" stroke="#b05040" stroke-width="3" fill="none"/>` +
    a.stain(440, 560, 34, G.bruise, 0.55) + a.stain(240, 420, 24, G.bruise, 0.5) + P.barnacles(460, 380, 16, 24) +
    `<g stroke="#5b5468" stroke-width="1.4" fill="none" opacity="0.8"><path d="M260 380 C280 400 270 420 290 440"/><path d="M460 470 C440 490 452 510 432 530"/></g>`,
  over: a.drip(330, 540, 40, 3.4) + a.drip(390, 548, 30, 3) }, skin));
for (const [pts, w] of [[[[310, 480], [330, 510], [360, 500], [380, 470]], 14], [[[350, 470], [372, 520], [400, 520], [410, 490]], 12]]) a.limb(pts, pts.map(() => w), { fill: '#3f4a3c', depth: 4, mottle: 0.5, fine: true, hatch: 60 });
a.raw(`<circle cx="306" cy="476" r="8" fill="#7a2a24" stroke="${INK}" stroke-width="1"/><circle cx="306" cy="476" r="3.4" fill="${G.black}"/><circle cx="412" cy="486" r="7" fill="#7a2a24" stroke="${INK}" stroke-width="1"/><circle cx="412" cy="486" r="3" fill="${G.black}"/>`);
// arms: sceptre held forward, other hand dragging a drowned courtier by the hair
a.shape({ d: limb([[200, 870], [190, 500], [180, 190]], [12, 12, 12]), fill: G.bone, depth: 5, core: false, mottle: 0.5, lines: ['M186 400 L196 404', 'M184 300 L194 304'] });
a.raw(`<path d="M180 190 C170 140 120 130 110 160" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M180 190 C170 140 120 130 110 160" fill="none" stroke="${G.bone}" stroke-width="4" stroke-linecap="round"/>` +
  `<circle cx="110" cy="172" r="22" fill="#d8f0c0" opacity="0.25"/><circle cx="110" cy="172" r="10" fill="#e8f8d0" stroke="${INK}" stroke-width="1.2"/><circle cx="110" cy="172" r="4" fill="#fff"/>`);
a.limb([[260, 360], [206, 440], [196, 500]], [64, 54, 44], Object.assign({ depth: 18, hatch: 60, decals: P.barnacles(220, 420, 8, 12) }, skin));
a.shape(Object.assign({ d: smooth([[166, 478], [214, 470], [224, 512], [196, 528], [164, 516]], true, 0.6), depth: 9, lines: ['M170 494 L222 490', 'M170 506 L220 504'] }, skin));
a.limb([[450, 360], [520, 460], [536, 560]], [64, 54, 44], Object.assign({ depth: 18, hatch: 120 }, skin));
a.shape(Object.assign({ d: smooth([[514, 548], [556, 546], [562, 584], [540, 596], [512, 584]], true, 0.6), depth: 9 }, skin));
// the courtier: limp corpse hanging from his fist
a.raw(`<path d="M538 590 C540 610 536 620 540 632" stroke="${G.black}" stroke-width="5"/>`);
a.shape({ d: smooth([[522, 630], [556, 626], [566, 660], [548, 680], [524, 670]], true, 0.7), fill: '#9aa596', depth: 10, mottle: 0.5, fine: true, decals: P.socket(536, 650, 5) + P.socket(554, 648, 4) + `<path d="M532 664 C540 670 548 670 556 664" stroke="${INK}" stroke-width="1"/>` });
a.limb([[544, 680], [552, 760], [548, 840]], [30, 26, 22], { fill: '#4a3a2a', depth: 8, mottle: 0.5, fine: true, hatch: 110 });
// head: crowned in coral that grows through the skull
a.shape(Object.assign({ d: smooth([[276, 190], [320, 160], [390, 160], [430, 200], [432, 266], [400, 314], [320, 320], [276, 290], [264, 240]], true, 0.7), depth: 34, hatch: 100,
  decals: `<path d="M290 200 C320 214 360 214 420 206 L420 250 C380 246 320 250 290 240 Z" fill="${G.black}" opacity="0.55"/>` + P.eye(318, 232, 9, '#d8d0a0', true) + P.socket(378, 230, 11) + `<path d="M300 262 C320 258 380 258 404 262 L398 320 C372 336 330 336 306 318 Z" fill="${G.black}"/><path d="M310 300 C330 312 370 312 392 300" stroke="#6a2020" stroke-width="4" fill="none"/>` + P.teeth(302, 264, 402, 264, 11, 10, 1, '#c8bc98') + P.teeth(310, 318, 396, 318, 9, 8, -1, '#c8bc98') +
    a.stain(410, 210, 16, G.bruise, 0.6) + `<path d="M338 236 L334 256 L346 256 Z" fill="${G.black}"/>`,
  over: P.drool(330, 312, 40) + P.drool(366, 316, 28) }, skin));
a.raw([[300, 176, -20], [330, 162, -6], [362, 158, 6], [392, 166, 18], [418, 184, 30]].map(([x, y, r]) => { const h = 50 + (x % 3) * 12; return `<path d="M${x} ${y} C${x + r * 0.3} ${y - h * 0.5} ${x + r} ${y - h * 0.7} ${x + r * 0.8} ${y - h} M${x + r * 0.4} ${y - h * 0.5} L${x + r * 0.4 - 12} ${y - h * 0.62} M${x + r * 0.6} ${y - h * 0.75} L${x + r * 0.6 + 12} ${y - h * 0.85}" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C${x + r * 0.3} ${y - h * 0.5} ${x + r} ${y - h * 0.7} ${x + r * 0.8} ${y - h} M${x + r * 0.4} ${y - h * 0.5} L${x + r * 0.4 - 12} ${y - h * 0.62} M${x + r * 0.6} ${y - h * 0.75} L${x + r * 0.6 + 12} ${y - h * 0.85}" stroke="#c86858" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('') +
  `<path d="M292 186 C330 174 390 172 424 190" stroke="${G.goldL}" stroke-width="6" fill="none"/><path d="M292 186 C330 174 390 172 424 190" stroke="${INK}" stroke-width="1" fill="none"/>` + P.weed(420, 220, 120, 1) + P.weed(280, 230, 100, -1));
require('fs').writeFileSync('grim/b_drowned_king.svg', a.svg());
