// Brine Siren: emaciated drowned singer, scaled skin, ribs showing, black hair plastered down, jaw split
// into a fanged maw mid-song; coiled fish tail with torn fins on a wet rock; cracked mirror. Faces left.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const a = new Art(460, 700, 111);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#9fae9c', mottle: 0.5, fine: true, wash: 0.36 };
a.raw(a.ground(230, 676, 130, 10));
// rock
a.shape({ d: smooth([[150, 676], [170, 600], [232, 576], [300, 590], [330, 640], [326, 676]], true, 0.6), fill: G.steelD, depth: 30, mottle: 0.7, hatch: 40, decals: P.barnacles(200, 600, 10, 22) + P.barnacles(290, 620, 6, 14) + a.stain(250, 640, 20, G.algae, 0.6) });
// tail coiling down over the rock, fins torn
a.limb([[230, 470], [268, 540], [296, 600], [262, 640], [204, 648], [160, 630]], [64, 58, 50, 40, 30, 20], { fill: '#5f7d74', tex: 'url(#mail)', texOp: 0.5, depth: 18, mottle: 0.6, fine: true, hatch: 60,
  decals: a.stain(280, 560, 14, G.bruise, 0.6) + a.gash(250, 600, 280, 610, 5, { rim: '#c08070', dripLen: 14 }) });
a.shape({ d: smooth([[164, 628], [120, 600], [100, 616], [118, 634], [96, 648], [110, 664], [160, 642]], true, 0.4), fill: '#7d9a8e', depth: 8, core: false, lines: ['M160 634 L110 606', 'M160 636 L104 640', 'M158 640 L112 660'], decals: `<path d="M120 610 L128 622 L114 626 Z" fill="#e6d8b8"/>` });
// torso: gaunt, ribs, scaled patches
{
  const torso = smooth([[204, 286], [262, 282], [272, 330], [262, 400], [258, 470], [206, 476], [198, 400], [190, 330]], true, 0.7);
  a.shape(Object.assign({ d: torso, depth: 26, hatch: 100, decals: P.ribs(228, 360, 46, 64, 5) + a.stain(250, 440, 16, '#5f7d74', 0.7) + a.stain(210, 430, 10, G.bruise, 0.5) +
    `<path d="M206 300 C214 314 226 318 232 316" stroke="${INK}" stroke-width="0.9" fill="none"/>` }, skin));
  a.raw(`<path d="M206 468 C220 476 244 476 260 468" stroke="${INK}" stroke-width="1.2" fill="none"/>` + P.barnacles(254, 296, 6, 8));
}
// far arm raised with a cracked hand-mirror
a.limb([[252, 296], [282, 252], [276, 206]], [18, 15, 12], Object.assign({ depth: 6, hatch: 120 }, skin));
a.shape(Object.assign({ d: smooth([[266, 196], [284, 192], [288, 210], [276, 218], [264, 212]], true, 0.6), depth: 4 }, skin));
a.shape({ d: smooth([[262, 140], [290, 136], [302, 160], [292, 184], [266, 186], [254, 164]], true, 0.9), fill: G.goldL, depth: 8, ink: 1.4,
  after: `<ellipse cx="278" cy="161" rx="14" ry="18" fill="#b9c8c4"/><path d="M270 150 L280 162 L274 176 M280 162 L290 158" stroke="${INK}" stroke-width="0.7" fill="none"/><ellipse cx="274" cy="156" rx="4" ry="6" fill="#fff" opacity="0.4"/>` });
a.shape({ d: poly([[276, 186], [282, 186], [280, 208], [276, 208]]), fill: G.gold, depth: 2, core: false, ink: 0.9 });
// near arm reaching forward, webbed claws
a.limb([[208, 298], [170, 330], [140, 344]], [18, 15, 12], Object.assign({ depth: 6, hatch: 60 }, skin));
a.shape(Object.assign({ d: smooth([[144, 334], [128, 330], [100, 322], [104, 332], [92, 338], [104, 344], [96, 354], [112, 354], [124, 360], [146, 356]], true, 0.4), depth: 5,
  decals: `<path d="M104 334 L124 340 M98 346 L124 348" stroke="${INK}" stroke-width="0.6"/>`, after: `<path d="M100 322 L92 318 M92 338 L84 338 M96 354 L88 358" stroke="${INK}" stroke-width="1.2"/>` }, skin));
// head: hair plastered, jaw split into a maw
{
  a.shape({ d: smooth([[214, 196], [262, 190], [282, 230], [286, 320], [270, 380], [256, 300], [240, 240]], true, 0.6), fill: G.black, depth: 10, core: false, lines: ['M252 210 C262 260 266 300 262 360', 'M262 214 C274 260 276 300 274 340'], lineCol: '#4a4038' });
  a.shape(Object.assign({ d: smooth([[188, 210], [216, 196], [246, 204], [254, 232], [248, 252], [232, 262], [206, 262], [188, 248], [180, 228]], true, 0.7), depth: 18, hatch: 110,
    decals: P.eye(206, 222, 6, '#d8c058') + `<path d="M196 214 C202 210 210 210 214 214" stroke="${INK}" stroke-width="1" fill="none"/>` + a.stain(236, 224, 10, '#5f7d74', 0.6) }, skin));
  // the maw: lower jaw dropped far, lined with needle teeth
  a.shape(Object.assign({ d: smooth([[184, 244], [234, 254], [240, 284], [214, 304], [188, 296], [178, 270]], true, 0.6), depth: 10, hatch: 110,
    decals: `<path d="M186 246 C204 254 224 256 234 254 L230 276 C214 290 196 288 186 274 Z" fill="${G.black}"/><path d="M190 262 C200 270 214 272 226 268" stroke="#7a2020" stroke-width="3" fill="none"/>` + P.teeth(188, 248, 232, 256, 10, 7, 1) + P.teeth(190, 276, 228, 276, 8, 7, -1),
    over: P.drool(200, 300, 18, '#c8b0a0') }, skin));
  a.raw(P.weed(254, 210, 60, 1, '#4f5f3a') + `<path d="M178 250 C160 240 150 252 140 244 M176 262 C162 266 154 278 142 276" stroke="${INK}" stroke-width="0.6" fill="none" opacity="0.6"/>`);
  // a crown of rusted fishhooks
  a.raw([[204, 200], [216, 194], [230, 194], [242, 200]].map(([x, y]) => P.hook(x, y - 18, 0.55)).join(''));
}
require('fs').writeFileSync('grim/e_siren.svg', a.svg());
