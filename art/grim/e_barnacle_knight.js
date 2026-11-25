// Barnacle Knight: a drowned crusader fused to his rusted plate by a crust of barnacles and coral; the
// visor rusted shut, something pale moving behind it. Wields a sea-eaten greatsword. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(480, 720, 141);
const P = require('./parts')(a), R = a.R;
const plate = { fill: G.steelD, mottle: 0.6, fine: true, wash: 0.36, hlOp: 0.18 };
a.raw(a.ground(240, 696, 150, 11));
// legs in greaves
a.limb([[270, 440], [284, 560], [278, 664]], [56, 46, 36], Object.assign({ depth: 16, hatch: 110, decals: P.barnacles(284, 520, 10, 14) + a.stain(280, 600, 14, G.algae, 0.6) }, plate));
a.limb([[214, 440], [196, 560], [190, 664]], [56, 46, 36], Object.assign({ depth: 16, hatch: 60, decals: P.barnacles(198, 600, 8, 12) }, plate));
for (const x of [160, 248]) a.shape(Object.assign({ d: smooth([[x + 12, 652], [x + 52, 652], [x + 60, 676], [x + 58, 698], [x - 4, 698], [x - 8, 678]], true, 0.4), depth: 8, lines: [`M${x} 672 L${x + 56} 672`, `M${x} 684 L${x + 58} 684`] }, plate));
// skirt of torn mail
a.shape({ d: smooth([[196, 400], [292, 396], [304, 480], [276, 500], [244, 478], [214, 504], [186, 482]], true, 0.5), fill: G.iron, tex: 'url(#mail)', depth: 14, hatch: 80, decals: a.stain(240, 450, 20, G.rust, 0.6) + P.barnacles(220, 470, 6, 10) });
// cuirass, crusted
a.shape(Object.assign({ d: smooth([[192, 240], [290, 236], [314, 300], [300, 400], [190, 406], [172, 310]], true, 0.75), depth: 34, hatch: 110,
  lines: ['M244 246 L242 400', 'M180 330 C220 340 270 340 306 330'], spec: ['M200 260 C196 300 196 350 204 390'],
  decals: P.barnacles(276, 280, 18, 22) + P.barnacles(200, 360, 10, 16) + a.stain(230, 300, 24, G.algae, 0.55) + a.stain(270, 360, 26, G.rust, 0.7) + a.stain(206, 280, 16, G.rust, 0.7) + a.stain(250, 370, 14, G.tealD, 0.6) +
    `<path d="M252 268 C264 262 272 268 270 280 C262 286 254 282 252 268 Z" fill="#c87060" stroke="${INK}" stroke-width="0.8"/>` }, plate));
// pauldrons
for (const [x, s] of [[186, -1], [298, 1]]) a.shape(Object.assign({ d: smooth([[x - 28, 250], [x - 4, 226], [x + 26, 232], [x + 30, 264], [x, 280], [x - 26, 274]], true, 0.6), depth: 14, hatch: 80, decals: P.barnacles(x, 246, 8, 12) }, plate));
// helm: great helm, visor rusted shut, pale eye behind the slot
a.shape(Object.assign({ d: smooth([[196, 160], [226, 140], [262, 144], [282, 170], [282, 226], [262, 244], [214, 244], [194, 226]], true, 0.6), depth: 24, hatch: 90, spec: ['M204 174 C202 192 202 210 206 226'],
  decals: `<path d="M196 192 L282 190 L282 200 L196 202 Z" fill="${G.black}"/><ellipse cx="226" cy="196" rx="5" ry="2.4" fill="#d8dcd0"/><circle cx="224" cy="196" r="1.3" fill="${G.black}"/>` + P.barnacles(260, 160, 9, 12) + a.stain(240, 220, 12, G.tealD, 0.6) +
    [[206, 214], [212, 214], [218, 214], [206, 222], [212, 222], [218, 222]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${G.black}"/>`).join('') }, plate));
a.raw(a.drip(220, 202, 18, 1.8, '#5a6a50') + P.weed(270, 150, 90, 1, '#4f5f3a') + P.weed(254, 146, 70, -1, '#4f5f3a'));
// coral growing from the crown
a.raw(`<path d="M232 144 C228 120 216 112 220 96 M232 144 C238 126 250 118 246 100 M226 120 L214 114 M240 124 L254 118" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M232 144 C228 120 216 112 220 96 M232 144 C238 126 250 118 246 100 M226 120 L214 114 M240 124 L254 118" stroke="#c87060" stroke-width="3" fill="none" stroke-linecap="round"/>`);
// arms holding the greatsword point-down before him
a.limb([[200, 264], [176, 330], [196, 390]], [32, 28, 24], Object.assign({ depth: 10, hatch: 60, decals: P.barnacles(180, 320, 6, 8) }, plate));
a.limb([[290, 264], [266, 330], [214, 384]], [32, 28, 24], Object.assign({ depth: 10, hatch: 120 }, plate));
a.shape({ d: poly([[192, 412], [212, 412], [210, 640], [202, 676], [194, 640]]), fill: G.steelD, depth: 6, mottle: 0.7, ink: 1.2, spec: ['M198 420 L198 640'],
  decals: [[204, 470], [196, 530], [206, 580]].map(([x, y]) => `<path d="M${x - 4} ${y} L${x + 4} ${y + 6} L${x - 3} ${y + 10}" fill="${G.black}"/>`).join('') + a.stain(202, 600, 10, G.rust, 0.8) + a.stain(200, 640, 8, G.blood, 0.7) });
a.shape({ d: poly([[164, 404], [240, 400], [240, 412], [164, 416]]), fill: G.iron, depth: 3, core: false, ink: 1.1, decals: P.barnacles(220, 406, 4, 6) });
a.shape({ d: poly([[198, 340], [208, 340], [208, 404], [198, 404]]), fill: G.leatherD, depth: 3, core: false, ink: 1 });
a.shape(Object.assign({ d: smooth([[180, 370], [222, 366], [226, 392], [182, 396]], true, 0.5), depth: 6, lines: ['M184 380 L224 378'] }, plate));
a.shape({ d: smooth([[196, 328], [210, 328], [212, 340], [196, 342]]), fill: G.iron, depth: 2, core: false, ink: 1 });
require('fs').writeFileSync('grim/e_barnacle_knight.svg', a.svg());
