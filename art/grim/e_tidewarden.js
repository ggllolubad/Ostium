// Hollow Tidewarden (elite): a drowned temple guard grown into a fish-headed horror, scale-mail rotted to
// the bone in places, a hollow where its chest should be with an eel nesting inside; corroded trident. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(560, 800, 221);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#55705f', mottle: 0.5, fine: true, wash: 0.38 };
a.raw(a.ground(290, 776, 180, 12));
// tail fin behind
a.shape({ d: smooth([[350, 560], [430, 600], [470, 690], [440, 700], [400, 640], [360, 610]], true, 0.5), fill: '#6f8a7a', depth: 10, core: false, lines: ['M360 580 L450 680', 'M370 600 L430 690'] });
// legs: scaled, clawed
a.limb([[320, 520], [340, 640], [330, 752]], [64, 52, 40], Object.assign({ tex: 'url(#mail)', texOp: 0.5, depth: 18, hatch: 110 }, skin));
a.limb([[256, 520], [236, 640], [230, 752]], [64, 52, 40], Object.assign({ tex: 'url(#mail)', texOp: 0.5, depth: 18, hatch: 60 }, skin));
for (const x of [190, 296]) a.shape(Object.assign({ d: smooth([[x + 10, 736], [x + 64, 736], [x + 74, 776], [x - 6, 776]], true, 0.5), depth: 8, after: [0, 1, 2].map(i => `<path d="M${x + i * 20 - 2} 772 L${x + i * 20 - 10} 782" stroke="${INK}" stroke-width="2.4"/>`).join('') }, skin));
// rotted scale-mail coat
{
  const hem = P.ragged(372, 214, 580, 10, 20);
  a.shape({ d: smooth([[222, 300], [350, 292], [378, 380], [372, 500], ...hem, [214, 500], [204, 380]], true, 0.5), fill: G.tealD, tex: 'url(#mail)', texOp: 0.8, depth: 40, mottle: 0.5, fine: true, hatch: 90,
    decals: a.stain(300, 500, 30, G.rust, 0.6) + P.barnacles(350, 360, 12, 18) + P.barnacles(230, 520, 8, 14) });
  // the hollow: chest torn open, ribs, an eel coiled inside
  a.raw(P.ribs(286, 400, 90, 100, 6));
  a.limb([[262, 380], [300, 420], [290, 450], [262, 430]], [16, 14, 12, 8], { fill: '#3f4a3c', depth: 4, mottle: 0.5, fine: true, hatch: 60, after: `<circle cx="258" cy="378" r="7" fill="#7a2a24" stroke="${INK}" stroke-width="0.8"/><circle cx="258" cy="378" r="3" fill="${G.black}"/>` });
  a.raw(a.drip(270, 452, 26, 2.6) + a.drip(300, 452, 18, 2.2));
}
// pauldron-shells
for (const [x, w] of [[226, 1], [354, 1]]) a.shape({ d: smooth([[x - 36, 310], [x - 10, 284], [x + 26, 290], [x + 34, 320], [x, 338], [x - 30, 334]], true, 0.6), fill: '#c8b090', depth: 14, mottle: 0.5, hatch: 70, lines: [`M${x - 30} 318 C${x - 10} 300 ${x + 10} 300 ${x + 30} 312`, `M${x - 24} 328 C${x - 6} 314 ${x + 10} 314 ${x + 26} 324`] });
// head: a great fish head, jaw slung low, glassy eye, gill flaps bleeding
a.shape(Object.assign({ d: smooth([[196, 220], [236, 180], [300, 176], [340, 210], [344, 260], [316, 296], [250, 300], [206, 280], [186, 250]], true, 0.6), depth: 30, hatch: 100,
  decals: P.eye(256, 218, 14, '#d8c040') + `<path d="M196 254 C230 274 282 276 320 262 C300 300 230 302 196 254 Z" fill="${G.black}"/>` + P.teeth(204, 258, 316, 266, 12, 10, 1) + P.teeth(214, 284, 300, 286, 9, 8, -1) +
    `<path d="M316 214 C326 230 328 250 322 268 M328 210 C340 228 342 250 334 272" stroke="${G.bloodD}" stroke-width="2.4" fill="none"/>` + a.stain(300, 196, 14, G.tealD, 0.6),
  over: a.drip(324, 268, 22, 2.4) + P.drool(240, 292, 26) }, skin));
// fin crest
a.shape({ d: smooth([[236, 186], [256, 140], [296, 130], [330, 150], [338, 190], [300, 176]], true, 0.4), fill: '#a84a3a', depth: 8, core: false, lines: ['M258 176 L264 144', 'M276 176 L284 136', 'M296 176 L306 140', 'M316 182 L326 156'] });
// arms and the trident
a.shape({ d: limb([[200, 780], [196, 400], [190, 120]], [9, 9.5, 9]), fill: G.iron, depth: 4, core: false, decals: a.stain(196, 500, 8, G.rust, 0.8) });
a.raw(`<path d="M160 120 L160 80 M190 120 L190 60 M220 120 L220 80 M160 120 L220 120" stroke="${INK}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M160 120 L160 80 M190 120 L190 60 M220 120 L220 80 M160 120 L220 120" stroke="${G.steelD}" stroke-width="4.6" stroke-linecap="round" fill="none"/>` +
  [[160, 78], [190, 58], [220, 78]].map(([x, y]) => `<path d="M${x - 6} ${y + 6} L${x} ${y - 8} L${x + 6} ${y + 6} Z" fill="${G.steelD}" stroke="${INK}" stroke-width="1"/>`).join('') + a.drip(190, 70, 14, 2) + P.weed(220, 120, 50, 1));
a.limb([[230, 330], [196, 400], [196, 450]], [44, 38, 32], Object.assign({ depth: 14, hatch: 60 }, skin));
a.shape(Object.assign({ d: smooth([[176, 436], [214, 432], [220, 466], [196, 476], [174, 464]], true, 0.6), depth: 7, lines: ['M180 450 L218 448'] }, skin));
a.limb([[352, 330], [372, 410], [340, 470]], [44, 38, 32], Object.assign({ depth: 14, hatch: 120 }, skin));
a.shape(Object.assign({ d: smooth([[322, 462], [354, 458], [362, 486], [340, 496], [320, 484]], true, 0.6), depth: 7 }, skin));
require('fs').writeFileSync('grim/e_tidewarden.svg', a.svg());
