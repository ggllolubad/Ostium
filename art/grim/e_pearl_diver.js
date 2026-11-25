// Pearl Diver (elite): a lean, eyeless thing that was a pearl diver, skin blanched and wrinkled from the
// deep, ballast stone on a rope at its waist, wielding a hooked shucking knife and a pouch of poisoned pearls. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(560, 800, 251);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#cfc6b4', mottle: 0.6, fine: true, wash: 0.4 };
a.raw(a.ground(280, 776, 170, 12));
// low crouch: legs folded
a.limb([[300, 520], [350, 600], [322, 700], [320, 760]], [44, 38, 30, 26], Object.assign({ depth: 14, hatch: 110 }, skin));
a.limb([[250, 520], [200, 620], [236, 700], [236, 760]], [44, 38, 30, 26], Object.assign({ depth: 14, hatch: 60 }, skin));
for (const x of [210, 296]) a.shape(Object.assign({ d: smooth([[x, 748], [x + 52, 748], [x + 60, 776], [x - 8, 776]], true, 0.5), depth: 6, after: `<path d="M${x - 8} 776 L${x - 16} 782 M${x + 2} 776 L${x - 6} 784" stroke="${INK}" stroke-width="1.6"/>` }, skin));
// loincloth and ballast stone on a rope
a.shape({ d: smooth([[240, 500], [312, 496], [318, 540], [284, 580], [246, 548]], true, 0.5), fill: '#6a5a48', depth: 10, mottle: 0.6, hatch: 80 });
a.raw(`<path d="M300 520 C320 560 330 620 322 680" stroke="${G.parchD}" stroke-width="3" fill="none"/>`);
a.shape({ d: smooth([[300, 676], [340, 672], [350, 704], [326, 720], [298, 706]], true, 0.6), fill: G.steelD, depth: 10, mottle: 0.7, decals: P.barnacles(326, 694, 5, 8) });
// torso: hunched forward, ribs and sinew
a.shape(Object.assign({ d: smooth([[214, 360], [262, 320], [330, 330], [344, 400], [318, 500], [244, 510], [216, 460]], true, 0.7), depth: 30, hatch: 100,
  decals: `<g stroke="${INK}" stroke-width="1" fill="none" opacity="0.8">` + [0, 1, 2, 3, 4].map(i => `<path d="M${238 + i * 4} ${392 + i * 18} C${262 + i * 4} ${402 + i * 18} ${290} ${400 + i * 18} ${312} ${388 + i * 18}"/>`).join('') + `</g>` +
    [0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${226 + i * 14} 336 C${230 + i * 14} 344 ${226 + i * 14} 352 ${230 + i * 14} 360" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.6"/>`).join('') + a.stain(300, 440, 20, G.bruise, 0.5) }, skin));
// head: eyeless, nose collapsed, gill-slit mouth
a.shape(Object.assign({ d: smooth([[180, 300], [200, 266], [240, 256], [270, 280], [270, 324], [244, 350], [204, 346], [180, 326]], true, 0.7), depth: 20, hatch: 100,
  decals: `<path d="M200 290 C208 286 216 286 222 292 M236 288 C242 284 250 284 256 290" stroke="${INK}" stroke-width="1.6" fill="none"/><path d="M204 294 C210 298 216 298 220 294 M238 292 C244 296 250 296 254 292" stroke="${INK}" stroke-width="0.8" fill="none"/>` +
    `<path d="M190 316 C204 322 226 324 244 318" stroke="${G.black}" stroke-width="3"/><path d="M192 326 C206 330 222 332 238 328" stroke="${G.black}" stroke-width="2"/><path d="M210 302 L206 310 L214 310 Z" fill="${G.black}"/>` },
  skin));
a.raw(P.weed(240, 262, 70, -1, '#4f5f3a') + P.weed(252, 270, 90, 1, '#4f5f3a'));
// near arm: hooked shucking knife
a.limb([[230, 380], [180, 430], [146, 404]], [28, 24, 18], Object.assign({ depth: 9, hatch: 60 }, skin));
a.shape(Object.assign({ d: smooth([[128, 392], [152, 388], [158, 408], [142, 416], [126, 410]], true, 0.6), depth: 5 }, skin));
a.shape({ d: 'M134 392 L114 330 C110 314 94 312 92 328 L100 330 C102 322 106 322 108 330 L126 396 Z', fill: G.steelL, depth: 4, core: false, ink: 1.1, decals: a.stain(110, 340, 6, G.blood, 0.9) });
a.raw(a.drip(98, 332, 18, 2));
// far arm: pouch of black pearls
a.limb([[320, 360], [360, 430], [340, 480]], [28, 24, 18], Object.assign({ depth: 9, hatch: 120 }, skin));
a.shape({ d: smooth([[322, 474], [356, 470], [364, 504], [340, 516], [320, 500]], true, 0.6), fill: G.leatherD, depth: 8 });
a.raw([[330, 520], [344, 524], [338, 532]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#3a3a48" stroke="${INK}" stroke-width="0.7"/><circle cx="${x - 1}" cy="${y - 1}" r="1.2" fill="#c8c8e0"/>`).join('') + `<path d="M336 528 C334 540 338 546 336 556" stroke="${G.slime}" stroke-width="1.6" fill="none"/>`);
require('fs').writeFileSync('grim/e_pearl_diver.svg', a.svg());
