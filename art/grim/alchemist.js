// Grim Alchemist: masked brewer in an acid-eaten leather coat and stained apron, brass respirator and
// cracked goggles, bandolier of vials. Winds back to hurl a lit firepot; the other hand tips a seething vial.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 61);
const R = a.R;
const A = require('./anatomy')(a);
const ragged = (x0, x1, y, n, amp) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 4, y + (i % 2 ? amp * (0.5 + R() * 0.8) : R() * 5)]); } return o; };
const vial = (x, y, col, h = 16) => a.shape({ d: smooth([[x - 3, y], [x + 3, y], [x + 4, y + 4], [x + 5, y + h], [x, y + h + 3], [x - 5, y + h], [x - 4, y + 4]], true, 0.4), fill: col, depth: 3, core: false, ink: 0.9, spec: [`M${x - 2} ${y + 6} L${x - 2} ${y + h - 2}`], specOp: 0.6, after: `<rect x="${x - 3}" y="${y - 3}" width="6" height="3" fill="${G.wood}" stroke="${INK}" stroke-width="0.6"/>` });

a.layer('shadow');
a.raw(a.ground(240, 676, 140, 10));
a.raw(`<path d="M318 676 C328 670 352 668 360 674 C354 680 330 682 318 676 Z" fill="${G.slime}" opacity="0.7"/>`);
a.layer('legs', [245, 400]);
// ---------------------------------------------------------------- legs
{
  a.limb([[262, 396], [280, 452], [292, 510]], [44, 38, 32], { fill: G.cloth, depth: 13, mottle: 0.6, fine: true, hatch: 60 });
  a.limb([[292, 512], [296, 578], [300, 640]], [34, 32, 26], { fill: G.leatherD, depth: 10, mottle: 0.7, hatch: 60, spec: ['M284 526 L290 628'], lines: ['M282 560 L310 560'] });
  a.shape({ d: smooth([[286, 632], [310, 632], [326, 652], [346, 668], [344, 678], [282, 678], [280, 656]], true, 0.4), fill: G.leatherD, depth: 8, grime: 0.5 });
  a.limb([[230, 396], [220, 456], [210, 515]], [44, 38, 32], { fill: G.cloth, depth: 13, mottle: 0.6, fine: true, hatch: 40 });
  a.limb([[210, 517], [200, 580], [190, 642]], [34, 32, 26], { fill: G.leatherD, depth: 10, mottle: 0.7, hatch: 40, spec: ['M196 530 L184 628'], lines: ['M190 560 L216 560'] });
  a.shape({ d: smooth([[176, 634], [200, 634], [216, 652], [236, 668], [234, 678], [172, 678], [170, 656]], true, 0.4), fill: G.leatherD, depth: 8, grime: 0.5 });
}
a.layer('body', [245, 400]);
// ---------------------------------------------------------------- long coat with acid holes
{
  const hem = ragged(316, 176, 540, 10, 18);
  a.shape({ d: smooth([[214, 226], [282, 224], [300, 300], [304, 380], [318, 470], ...hem, [180, 470], [194, 380], [198, 300]], true, 0.45), fill: G.black, depth: 36, mottle: 0.7, grime: 0.3, hatch: 70,
    decals: a.fold(212, 300, 196, 540, 7) + a.fold(296, 320, 310, 540, 7) + a.stain(200, 470, 16, G.slime, 0.5) + a.stain(300, 500, 12, G.black, 0.6) +
      Array.from({ length: 7 }, () => { const x = 190 + R() * 120, y = 380 + R() * 150; return `<path d="${require('../gr').blob(x, y, 3 + R() * 3, R, 7, 0.4)}" fill="${G.black}" stroke="${G.slime}" stroke-width="0.8"/>`; }).join('') });
  // apron
  a.shape({ d: smooth([[226, 250], [276, 248], [284, 330], [292, 520], [272, 540], [234, 540], [214, 520], [220, 330]], true, 0.4), fill: '#9a7a5a', depth: 24, mottle: 0.9, grime: 0.3, hatch: 70,
    decals: a.stain(250, 420, 26, G.slime, 0.55) + a.stain(262, 470, 18, G.bloodD, 0.55) + a.stain(240, 360, 12, '#4f7fa6', 0.45) + a.splat(270, 400, 6, { drops: 6, col: G.slime }) + a.fold(240, 300, 236, 530, 5) + a.fold(268, 300, 276, 530, 5) });
  // belt, pouches, mortar
  a.shape({ d: smooth([[196, 376], [302, 372], [302, 388], [198, 392]], true, 0.2), fill: G.leatherD, depth: 4, lines: ['M200 382 L300 378'] });
  a.shape({ d: smooth([[196, 388], [222, 388], [224, 420], [198, 422]], true, 0.4), fill: G.leatherD, depth: 7, lines: ['M196 396 L222 396'] });
  a.shape({ d: smooth([[284, 386], [306, 384], [310, 412], [288, 414]], true, 0.4), fill: G.leatherD, depth: 7, lines: ['M284 394 L308 392'] });
  // bandolier with vials
  a.shape({ d: 'M214 232 L228 226 L300 372 L286 378 Z', fill: G.leatherD, depth: 3, core: false, ink: 1.1 });
  [[232, 246, '#4f7fa6'], [244, 272, '#d4602a'], [256, 298, G.slime], [268, 324, '#7b6a96'], [280, 350, '#c8b070']].forEach(([x, y, c]) => vial(x + 4, y - 8, c, 14));
}
a.layer('farm', [272, 236]);
// ---------------------------------------------------------------- far arm forward, tipping a seething vial
{
  A.sleeve({ sh: [272, 236], el: [298, 272], wr: [328, 288], fill: G.black, bell: 20, hang: 10, hatch: 80, decals: a.stain(300, 270, 8, G.slime, 0.5) });
  vial(352, 262, '#6a9a6a', 20);
  A.fist([332, 288], [0.7, -0.7], G.leatherD, 1, false);
  a.raw(`<path d="M356 286 C358 300 354 320 358 340 C360 360 356 380 360 400" stroke="${G.slime}" stroke-width="2.4" fill="none" opacity="0.85"/>` +
    [[356, 300], [360, 330], [354, 360], [362, 390]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${(1.5 + R() * 2).toFixed(1)}" fill="${G.slime}" stroke="${INK}" stroke-width="0.5"/>`).join('') +
    `<path d="M346 262 C340 250 348 242 344 230 M356 258 C362 246 354 238 360 224" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.6"/>`);
}
a.layer('head', [255, 226]);
// ---------------------------------------------------------------- head: cowl, goggles, beak (scaled to proportion)
a.raw('<g transform="translate(255 226) scale(0.78) translate(-255 -226)">');
{
  a.shape({ d: smooth([[226, 214], [278, 212], [288, 236], [252, 244], [216, 236]], true, 0.6), fill: G.leatherD, depth: 8, mottle: 0.6 });
  a.shape({ d: smooth([[222, 140], [262, 132], [292, 150], [296, 186], [288, 222], [252, 228], [222, 214], [212, 180]], true, 0.6), fill: G.greenD, depth: 20, mottle: 0.8, hatch: 40,
    lines: ['M228 150 C224 176 226 200 234 220', { d: 'M246 140 C240 160 240 180 244 200', w: 0.7 }], decals: a.stain(236, 196, 10, G.slime, 0.5) });
  // pale skin round the eyes, sunken
  a.shape({ d: smooth([[256, 160], [292, 160], [298, 176], [292, 190], [258, 188]], true, 0.6), fill: G.fleshP, depth: 6, core: false, mottle: 0.6, fine: true });
  // goggles: two brass rims, one lens cracked
  a.raw(`<path d="M252 172 L300 170" stroke="${G.leatherD}" stroke-width="4"/>`);
  for (const [x, crack] of [[268, false], [290, true]]) {
    a.shape({ d: smooth([[x - 9, 174], [x, 164], [x + 9, 174], [x, 184]], true, 1), fill: G.goldL, depth: 5, ink: 1.2,
      after: `<circle cx="${x}" cy="174" r="6" fill="#4a5a52"/><circle cx="${x - 2}" cy="172" r="2" fill="#dfe8e0" opacity="0.7"/>` + (crack ? `<path d="M${x - 5} 170 L${x} 174 L${x + 4} 169 M${x} 174 L${x + 2} 180" stroke="#e8f0e8" stroke-width="0.7" fill="none"/>` : '') });
  }
  // plague beak: waxed leather, brass rivets, stuffed with herbs (a sprig pokes out of the nostril)
  a.shape({ d: smooth([[262, 184], [292, 182], [326, 196], [352, 216], [356, 226], [330, 222], [300, 214], [266, 210], [256, 198]], true, 0.6), fill: G.leatherD, depth: 10, mottle: 0.7, hatch: 70,
    lines: ['M270 196 C296 198 324 206 350 220', { d: 'M300 188 L300 212', w: 0.8 }], spec: ['M272 188 C300 188 326 198 346 212'], specOp: 0.4,
    decals: a.stain(320, 212, 8, G.slime, 0.5), after: a.rivet(276, 190, 1.4) + a.rivet(276, 206, 1.4) + a.rivet(300, 200, 1.4) });
  a.raw(`<path d="M336 208 C340 200 346 198 350 192 M338 210 C344 206 350 206 354 202" stroke="${G.greenD}" stroke-width="1.2" fill="none"/>`);
  // brimmed leather cap
  a.shape({ d: smooth([[210, 146], [240, 120], [282, 122], [300, 146], [304, 156], [214, 156]], true, 0.5), fill: G.black, depth: 10, mottle: 0.5, hatch: 30, spec: ['M232 132 C250 124 270 124 284 130'], specOp: 0.3 });
}
a.raw('</g>');
a.layer('arm', [226, 238]);
// ---------------------------------------------------------------- near arm wound back over the shoulder with a lit firepot
{
  A.sleeve({ sh: [226, 238], el: [194, 234], wr: [180, 204], fill: G.black, bell: 20, hang: 8, hatch: 20 });
  // firepot: clay jar, rag wick, fire
  a.shape({ d: smooth([[158, 150], [182, 148], [192, 168], [186, 184], [160, 186], [152, 168]], true, 0.7), fill: '#8a5a3a', depth: 10, mottle: 0.6, lines: ['M156 166 L190 164'], decals: a.stain(170, 176, 6, G.black, 0.5) });
  a.shape({ d: smooth([[164, 136], [176, 136], [178, 150], [162, 150]], true, 0.4), fill: G.parchD, depth: 3, core: false, ink: 0.9 });
  A.fist([178, 196], [0, -1], G.leatherD, 1.05, false);
  a.raw(`<path d="M170 138 C150 120 164 98 156 80 C176 92 186 108 178 124 C190 114 192 100 188 90 C204 108 196 130 172 138 Z" fill="#e8823a" stroke="${INK}" stroke-width="1"/>` +
    `<path d="M172 134 C164 122 170 110 168 100 C178 110 182 120 176 132 Z" fill="#f6d27a"/>` +
    `<path d="M166 92 C160 76 168 66 162 54" stroke="${INK}" stroke-width="0.7" fill="none" opacity="0.5"/>`);
}
require('fs').writeFileSync('grim/alchemist.svg', a.svg());
a.writeRig('grim/rig/alchemist', { idle: 'sway', attack: 'throw', hand: [172, 160] });
