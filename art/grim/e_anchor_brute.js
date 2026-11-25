// Anchor Brute: a hulking drowned dock-hand, skin split over swollen muscle, chained to the ship's anchor
// he now swings as a flail. The chain is threaded through his own forearm. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(520, 760, 191);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#8a9488', mottle: 0.5, fine: true, wash: 0.36 };
a.raw(a.ground(270, 736, 170, 12));
// anchor on the floor ahead of him
a.shape({ d: 'M96 600 L108 600 L108 700 C130 700 150 690 160 676 L150 670 L172 664 L168 688 L160 684 C146 708 118 718 102 718 C86 718 58 708 44 684 L36 688 L32 664 L54 670 L44 676 C54 690 74 700 96 700 Z', fill: G.iron, depth: 12, mottle: 0.7, ink: 1.4,
  decals: a.stain(100, 690, 14, G.rust, 0.8) + P.barnacles(70, 690, 6, 10) + a.splat(140, 680, 6, { drops: 5 }) });
a.shape({ d: smooth([[86, 590], [118, 590], [120, 604], [84, 604]], true, 0.3), fill: G.iron, depth: 4, ink: 1.2 });
a.raw(`<circle cx="102" cy="580" r="10" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="102" cy="580" r="10" fill="none" stroke="${G.iron}" stroke-width="2.2"/>`);
// chain from the anchor ring up to the forearm
{ let c = ''; for (let i = 0; i < 16; i++) { const t = i / 15, x = 108 + 70 * t + Math.sin(t * 3) * 10, y = 572 - 190 * t; c += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="3.6" transform="rotate(${i % 2 ? -60 : 30} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${INK}" stroke-width="3.2"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="3.6" transform="rotate(${i % 2 ? -60 : 30} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${G.iron}" stroke-width="1.6"/>`; } a.raw(c); }
// legs
a.limb([[300, 480], [320, 600], [316, 712]], [70, 58, 44], Object.assign({ depth: 20, hatch: 110 }, skin));
a.limb([[236, 480], [214, 600], [210, 712]], [70, 58, 44], Object.assign({ depth: 20, hatch: 60, decals: a.gash(210, 600, 226, 640, 5, { rim: '#b0786a', dripLen: 16 }) }, skin));
for (const x of [176, 284]) a.shape(Object.assign({ d: smooth([[x + 8, 696], [x + 62, 694], [x + 72, 736], [x - 6, 736]], true, 0.5), depth: 8, lines: [`M${x + 6} 726 L${x + 6} 736`, `M${x + 20} 724 L${x + 20} 736`, `M${x + 34} 724 L${x + 34} 736`] }, skin));
a.shape({ d: smooth([[222, 450], [318, 446], [330, 520], [300, 540], [270, 510], [240, 540], [212, 520]], true, 0.5), fill: G.leatherD, depth: 16, mottle: 0.6, hatch: 80, decals: a.stain(270, 490, 18, G.blood, 0.6) });
// torso: massive, hunched, skin split over muscle
a.shape(Object.assign({ d: smooth([[196, 250], [300, 236], [356, 280], [350, 380], [326, 460], [216, 466], [180, 380], [170, 300]], true, 0.75), depth: 40, hatch: 110,
  decals: a.gash(226, 300, 270, 340, 8, { rim: '#c08070', dripLen: 22 }) + a.gash(300, 300, 320, 360, 6, { rim: '#c08070', dripLen: 18 }) + a.stain(280, 400, 26, G.bruise, 0.55) + P.barnacles(330, 300, 9, 16) +
    `<path d="M212 330 C230 360 260 370 290 360 M206 380 C236 400 276 404 316 390" stroke="${INK}" stroke-width="1" fill="none" opacity="0.7"/>` + `<path d="M262 260 L262 300 M250 280 L274 280" stroke="${G.azureD}" stroke-width="2.4" opacity="0.6"/>` }, skin));
// small head sunk between the shoulders
a.shape(Object.assign({ d: smooth([[204, 196], [232, 180], [262, 190], [270, 222], [258, 250], [222, 256], [202, 236]], true, 0.7), depth: 16, hatch: 100,
  decals: P.eye(222, 214, 5, '#c0a840', true) + P.eye(246, 212, 4, '#c0a840', true) + `<path d="M214 236 C228 244 244 244 254 236 C248 252 222 254 214 236 Z" fill="${G.black}"/>` + P.teeth(216, 238, 252, 238, 5, 4, 1, '#b8a878') + `<path d="M210 202 C220 196 228 198 232 204" stroke="${INK}" stroke-width="1.4" fill="none"/>`,
  over: P.drool(232, 252, 16) }, skin));
// arms: the near one threaded on the chain
a.limb([[206, 270], [160, 340], [178, 400]], [54, 46, 38], Object.assign({ depth: 16, hatch: 60, decals: `<circle cx="170" cy="380" r="7" fill="${G.black}"/>` + a.stain(170, 380, 10, G.blood, 0.8) }, skin));
a.raw(a.drip(170, 388, 30, 2.6));
a.shape(Object.assign({ d: smooth([[160, 396], [200, 392], [206, 424], [186, 436], [160, 428]], true, 0.6), depth: 7, lines: ['M164 410 L204 408', 'M164 420 L202 420'] }, skin));
a.limb([[340, 280], [372, 360], [352, 430]], [52, 44, 36], Object.assign({ depth: 16, hatch: 120 }, skin));
a.shape(Object.assign({ d: smooth([[334, 424], [372, 424], [376, 456], [352, 466], [332, 452]], true, 0.6), depth: 7 }, skin));
require('fs').writeFileSync('grim/e_anchor_brute.svg', a.svg());
