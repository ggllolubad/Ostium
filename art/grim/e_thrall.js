// Drowned Thrall: a bloated, waterlogged sailor's corpse. Jaw unhinged, one socket empty, belly split
// with entrails sagging out, a crab nesting in the ribs, boat hook in its fist. Faces left.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const a = new Art(460, 700, 101);
const P = require('./parts')(a), R = a.R;
a.raw(a.ground(226, 676, 120, 10));
a.raw(`<path d="M150 674 C170 666 230 664 270 670 C290 674 280 682 240 684 C190 686 140 684 150 674 Z" fill="${G.water}" opacity="0.4"/>`);
const skin = { fill: G.corpse, mottle: 0.5, fine: true, wash: 0.38 };
// far arm, limp
a.limb([[282, 256], [300, 330], [298, 404]], [30, 26, 20], Object.assign({ depth: 10, hatch: 120, decals: a.stain(296, 340, 10, G.bruise, 0.6) }, skin));
a.shape(Object.assign({ d: smooth([[286, 398], [306, 400], [312, 428], [304, 444], [298, 430], [292, 446], [286, 430], [280, 444], [276, 420]], true, 0.5), depth: 6 }, skin));
// legs, swollen
a.limb([[258, 420], [270, 530], [262, 646]], [52, 44, 34], Object.assign({ depth: 16, hatch: 110, decals: a.stain(268, 560, 16, G.bruise, 0.6) + a.stain(262, 470, 10, G.blood, 0.4) }, skin));
a.limb([[208, 422], [182, 520], [176, 640]], [56, 46, 36], Object.assign({ depth: 16, hatch: 70, decals: a.stain(186, 520, 14, G.bruise, 0.6) + a.gash(184, 560, 196, 590, 4, { rim: '#b0786a', dripLen: 10 }) }, skin));
for (const [x, w] of [[150, 1], [238, 1]]) a.shape(Object.assign({ d: smooth([[x + 6, 634], [x + 46, 632], [x + 54, 652], [x + 52, 678], [x - 6, 678], [x - 10, 660]], true, 0.5), depth: 7, lines: [`M${x} 670 L${x + 2} 678`, `M${x + 10} 668 L${x + 11} 678`, `M${x + 20} 668 L${x + 20} 678`] }, skin));
// sodden trousers
a.shape({ d: smooth([[196, 410], [284, 404], [290, 470], [270, 476], [238, 452], [210, 480], [184, 476]], true, 0.5), fill: G.cloth, depth: 16, mottle: 0.8, hatch: 80, decals: a.stain(240, 440, 18, G.algae, 0.5) + a.fold(214, 420, 200, 476, 5) });
// torso: bloated belly, split, rag shirt
{
  const torso = smooth([[196, 246], [284, 238], [300, 300], [296, 380], [288, 420], [200, 424], [168, 390], [156, 330], [170, 280]], true, 0.7);
  const guts = `<path d="M176 352 C190 340 222 338 240 350 C232 372 196 378 176 368 Z" fill="${G.black}"/><path d="M180 352 C196 346 220 346 236 352" stroke="#b0786a" stroke-width="2" fill="none"/>`;
  a.shape(Object.assign({ d: torso, depth: 30, hatch: 110, decals: guts + a.stain(250, 300, 22, G.bruise, 0.55) + a.stain(200, 300, 14, G.algae, 0.5) + P.barnacles(276, 262, 9, 12) +
    `<g stroke="${G.bruise}" stroke-width="0.8" fill="none" opacity="0.8"><path d="M230 260 C226 280 234 296 228 320"/><path d="M262 280 C270 300 262 320 270 340"/></g>` }, skin));
  // shirt rags (striped)
  a.shape({ d: smooth([[208, 244], [270, 238], [280, 266], [262, 300], [270, 330], [244, 318], [220, 330], [204, 300]], true, 0.5), fill: '#cfc6b0', depth: 14, mottle: 0.9, hatch: 110,
    decals: [0, 1, 2, 3, 4, 5].map(i => `<path d="M200 ${252 + i * 14} C230 ${248 + i * 14} 260 ${246 + i * 14} 290 ${248 + i * 14}" stroke="${G.azureD}" stroke-width="4.5" opacity="0.75"/>`).join('') + a.stain(244, 300, 16, G.algae, 0.6) + a.stain(230, 270, 10, G.blood, 0.4) });
  // entrails sagging from the split
  for (const [pts, w] of [[[[186, 362], [178, 396], [190, 418], [206, 404], [200, 380]], 9], [[[206, 366], [214, 400], [204, 440], [190, 452]], 8], [[[222, 360], [232, 386], [226, 412]], 7]])
    a.limb(pts, pts.map(() => w), { fill: '#a87a72', depth: 3, mottle: 0.8, fine: true, hatch: 30, lines: [], decals: a.stain(pts[1][0], pts[1][1], 4, G.blood, 0.7) });
  a.raw(a.drip(192, 452, 22, 2.4) + a.drip(226, 414, 14, 2));
  // crab peering out of the cavity
  a.shape({ d: smooth([[208, 350], [224, 344], [232, 352], [222, 360], [208, 360]], true, 0.6), fill: G.rust, depth: 4, core: false, ink: 0.9, after: `<path d="M210 348 L204 340 M214 346 L212 336" stroke="${INK}" stroke-width="0.9"/><circle cx="204" cy="340" r="1.4" fill="${G.black}"/><circle cx="212" cy="336" r="1.4" fill="${G.black}"/>` });
}
// head: drooping forward, jaw unhinged, socket empty
{
  a.limb([[218, 248], [198, 226]], [34, 28], Object.assign({ depth: 8, hatch: 100 }, skin));
  const head = smooth([[146, 176], [176, 158], [214, 164], [226, 192], [220, 222], [200, 240], [176, 244], [154, 232], [140, 206]], true, 0.7);
  a.shape(Object.assign({ d: head, depth: 22, hatch: 110, decals: P.socket(166, 196, 8) + P.eye(194, 194, 7, '#c9b25a', true) + a.stain(200, 176, 12, G.bruise, 0.6) +
    `<path d="M150 210 C148 218 150 224 156 228" stroke="${INK}" stroke-width="1" fill="none"/><path d="M178 210 C176 216 180 220 184 218" stroke="${INK}" stroke-width="1" fill="none"/>` }, skin));
  // hanging jaw
  a.shape(Object.assign({ d: smooth([[150, 226], [196, 232], [198, 262], [178, 282], [156, 276], [146, 252]], true, 0.6), depth: 12, hatch: 110,
    decals: `<path d="M154 232 C170 240 186 240 194 234 L192 250 C178 262 162 260 154 250 Z" fill="${G.black}"/>` + P.teeth(156, 234, 192, 236, 7, 5, 1, '#c8bc98') + P.teeth(158, 252, 190, 250, 6, 5, -1, '#c8bc98'),
    over: P.drool(170, 278, 20) + P.drool(184, 274, 12) }, skin));
  // lank hair and weed
  a.raw(P.weed(210, 168, 70, 1) + P.weed(196, 162, 54, -1) + P.weed(222, 182, 84, 1.2, '#5a6a40'));
  a.raw(P.flies(160, 150, 7, 50));
}
// near arm with the boat hook
{
  a.shape({ d: limb([[150, 676], [146, 400], [138, 170]], [7, 7.5, 7]), fill: G.woodD, depth: 3, tex: 'url(#grain)', texOp: 0.6, core: false, decals: a.stain(146, 520, 6, G.algae, 0.7) });
  a.raw(`<path d="M138 172 L136 120 C136 98 108 96 108 116 L110 124" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M138 172 L136 120 C136 98 108 96 108 116 L110 124" fill="none" stroke="${G.rust}" stroke-width="3.4" stroke-linecap="round"/><path d="M136 128 L152 112" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M136 128 L152 112" stroke="${G.rust}" stroke-width="2.8" stroke-linecap="round"/>` + a.drip(112, 124, 12, 1.8));
  a.limb([[200, 262], [168, 320], [152, 366]], [32, 28, 22], Object.assign({ depth: 10, hatch: 60, decals: a.gash(178, 300, 166, 330, 4, { rim: '#b0786a', dripLen: 12 }) }, skin));
  a.shape(Object.assign({ d: smooth([[132, 358], [160, 354], [166, 372], [156, 390], [134, 388], [128, 372]], true, 0.6), depth: 7, lines: ['M134 366 L160 364', 'M134 376 L160 374'] }, skin));
}
require('fs').writeFileSync('grim/e_thrall.svg', a.svg());
