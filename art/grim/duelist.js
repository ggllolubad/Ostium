// Grim Duelist: gaunt swordsman in a deep lunge, storm-charged rapier thrust forward, main gauche raised
// behind, wide hat throwing the eyes into shadow, slashed and bloodied doublet, tattered half-cape.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(520, 700, 47);
const R = a.R;
const A = require('./anatomy')(a);
const ln = (pts) => 'M' + pts.map(p => p.map(v => +v.toFixed(1)).join(' ')).join(' L');
const ragged = (x0, x1, y, n, amp) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 4, y + (i % 2 ? amp * (0.6 + R() * 0.8) : R() * 6)]); } return o; };

a.layer('shadow');
a.raw(a.ground(220, 676, 170, 10));
// blood spatter trail on the floor
a.raw(a.splat(430, 672, 5, { drops: 6 }) + a.splat(470, 668, 3, { drops: 3 }));

a.layer('back', [260, 290]);
// ---------------------------------------------------------------- half-cape (behind), streaming back
{
  const hem = ragged(150, 70, 430, 8, 26);
  a.shape({ d: smooth([[262, 282], [282, 296], [250, 340], [214, 400], ...hem, [96, 360], [150, 300], [210, 274]], true, 0.5), fill: G.cloth, depth: 30, mottle: 0.9, wash: 0.4, hatch: 20,
    decals: a.fold(240, 300, 150, 420, 7) + a.fold(214, 296, 110, 400, 7) + a.stain(140, 380, 20, G.bloodD, 0.5) });
}
a.layer('farm', [268, 296]);
// ---------------------------------------------------------------- far arm with main gauche, raised behind
{
  A.arm({ sh: [268, 296], el: [224, 304], wr: [194, 274], fill: G.redD, fore: G.redD, w: 0.72, hatch: 30 });
  // dagger pointing up-forward
  a.shape({ d: poly([[186, 256], [192, 254], [214, 196], [210, 194]]), fill: G.steelL, depth: 3, core: false, ink: 1, spec: ['M190 250 L210 198'] });
  a.shape({ d: poly([[170, 262], [204, 248], [206, 254], [172, 268]]), fill: G.iron, depth: 3, core: false, ink: 1 });
  a.raw(a.drip(200, 230, 10, 1.6));
  A.fist([190, 266], [0.35, -1], G.leatherD, 0.9);
}
a.layer('legs', [228, 420]);
// ---------------------------------------------------------------- rear leg (far), extended back
{
  a.limb([[232, 418], [196, 470], [160, 520]], [46, 40, 32], { fill: G.cloth, depth: 14, mottle: 0.7, hatch: 30, decals: a.stain(190, 470, 10, G.umber, 0.5) });
  a.limb([[160, 520], [128, 580], [98, 640]], [36, 34, 26], { fill: G.leatherD, depth: 12, mottle: 0.8, hatch: 40,
    lines: ['M150 532 C136 532 128 524 126 516', { d: 'M120 590 L126 596', w: 0.7 }], spec: ['M140 546 C128 570 118 594 108 620'] });
  a.shape({ d: smooth([[150, 508], [174, 512], [176, 532], [156, 540], [142, 530]]), fill: G.leather, depth: 6, lines: ['M148 520 L174 522'] });
  a.shape({ d: smooth([[88, 632], [108, 634], [118, 656], [128, 670], [126, 678], [82, 678], [80, 660]], true, 0.4), fill: G.leatherD, depth: 8, grime: 0.4, decals: a.stain(100, 668, 12, G.umber, 0.5) });
}
// ---------------------------------------------------------------- scabbard (empty) angling back
a.shape({ d: limb([[214, 408], [160, 450], [104, 492]], [9, 8, 6]), fill: G.leatherD, depth: 3, core: false, lines: ['M196 422 L200 428', 'M150 458 L154 464'] });
a.shape({ d: smooth([[100, 488], [110, 494], [104, 504], [96, 498]]), fill: G.iron, depth: 2, core: false, ink: 1 });
// ---------------------------------------------------------------- front leg (near), bent forward
{
  a.limb([[222, 424], [270, 470], [312, 514]], [50, 44, 36], { fill: G.cloth, depth: 16, mottle: 0.7, hatch: 50,
    decals: a.stain(270, 470, 14, G.blood, 0.6) + a.gash(250, 444, 276, 462, 4, { rim: G.bloodW, dripLen: 18 }) });
  a.limb([[312, 518], [316, 584], [318, 646]], [38, 36, 28], { fill: G.leatherD, depth: 12, mottle: 0.8, hatch: 60,
    lines: [{ d: 'M306 560 L312 566', w: 0.7 }], spec: ['M302 530 C302 566 304 600 306 632'] });
  // folded boot cuff over the knee
  a.shape({ d: smooth([[290, 500], [326, 498], [338, 520], [326, 540], [296, 538], [288, 520]]), fill: G.leather, depth: 8, grime: 0.3, lines: ['M292 512 C306 516 322 516 336 512'] });
  a.shape({ d: smooth([[306, 636], [328, 636], [342, 654], [358, 668], [358, 678], [304, 678], [302, 656]], true, 0.4), fill: G.leatherD, depth: 8, grime: 0.4, decals: a.stain(334, 668, 14, G.umber, 0.55) });
}
a.layer('body', [230, 420]);
// ---------------------------------------------------------------- torso: slashed doublet over linen
{
  const torso = smooth([[246, 280], [284, 284], [300, 318], [282, 380], [262, 430], [208, 432], [204, 392], [222, 330]], true, 0.8);
  a.shape({ d: torso, fill: G.red, depth: 30, mottle: 0.9, grime: 0.25, hatch: 60,
    lines: ['M262 300 L250 428', { d: 'M256 312 L262 316 M254 330 L260 334 M252 348 L258 352 M250 366 L256 370 M248 384 L254 388', w: 0.9 }],
    decals: a.fold(232, 340, 218, 426, 6) + a.fold(280, 320, 268, 400, 6) + a.stain(270, 380, 18, G.blood, 0.75) + a.gash(224, 352, 252, 340, 5, { rim: G.parch, drip: false }) + a.splat(286, 340, 6, { drops: 5 }) });
  // gold buttons
  for (const [x, y] of [[257, 310], [255, 328], [253, 346], [251, 364], [249, 382]]) a.raw(`<circle cx="${x}" cy="${y}" r="2" fill="${G.gold}" stroke="${INK}" stroke-width="0.7"/>`);
  // belt
  a.shape({ d: smooth([[206, 400], [266, 396], [264, 410], [206, 414]], true, 0.2), fill: G.leatherD, depth: 4, lines: ['M210 404 L262 400'] });
  a.shape({ d: poly([[228, 397], [240, 396], [240, 411], [228, 412]]), fill: G.gold, depth: 3, ink: 1 });
  // doublet skirt tabs
  const tabs = [];
  for (let i = 0; i < 5; i++) { const x = 206 + i * 12; tabs.push(`M${x} 412 L${x + 12} 412 L${x + 11} ${434 + (i % 2) * 6} L${x + 1} ${434 + (i % 2) * 6} Z`); }
  for (const d of tabs) a.shape({ d, fill: G.redD, depth: 5, core: false, ink: 1 });
}
a.layer('head', [262, 268]);
// ---------------------------------------------------------------- linen collar, neck and head under the hat
{
  a.shape({ d: smooth([[252, 270], [292, 272], [300, 290], [276, 298], [250, 292]], true, 0.6), fill: G.parch, depth: 8, grime: 0.4, lines: ['M258 282 L264 292', 'M272 280 L276 294', 'M286 280 L288 292'], decals: a.stain(280, 288, 6, G.blood, 0.6) });
  a.shape({ d: smooth([[262, 248], [290, 250], [292, 276], [266, 278]], true, 0.5), fill: G.fleshP, depth: 8 });
  // lank hair falling behind
  a.shape({ d: smooth([[254, 206], [264, 210], [262, 256], [256, 286], [246, 290], [248, 256]], true, 0.6), fill: G.black, depth: 6, core: false,
    lines: ['M252 214 C248 240 244 266 240 290', 'M258 214 C256 240 252 270 248 292'], lineCol: '#5a4a3a' });
  // face: gaunt 3/4 profile facing right
  const face = smooth([[262, 206], [292, 204], [304, 220], [312, 236], [306, 242], [306, 252], [300, 262], [290, 270], [272, 270], [262, 252]], true, 0.6);
  a.shape({ d: face, fill: G.flesh, depth: 16, mottle: 0.6, fine: true, hatch: 70,
    lines: [
      'M296 222 C300 230 306 236 311 238', // brow-nose line
      { d: 'M290 252 C296 252 300 254 303 254', w: 1.1 }, // mouth
      { d: 'M280 236 C284 246 284 258 280 268', w: 0.8 }, // cheek hollow
      { d: 'M268 230 C272 236 276 238 280 238', w: 0.7 },
      { d: 'M286 262 C290 266 296 266 300 262', w: 0.6 },
    ],
    decals: `<g fill="${INK}" opacity="0.55">` + Array.from({ length: 70 }, () => `<circle cx="${(270 + R() * 36).toFixed(1)}" cy="${(248 + R() * 22).toFixed(1)}" r="0.45"/>`).join('') + `</g>` +
      `<path d="M274 226 L292 258" stroke="${G.bloodL}" stroke-width="1.6"/><path d="M274 226 L292 258" stroke="${INK}" stroke-width="0.5"/>` });
  // brim shadow across the eyes, one eye catching light
  a.raw(`<path d="M262 206 L306 210 C306 222 300 228 290 230 C278 230 266 226 262 220 Z" fill="${G.black}" opacity="0.82"/>` +
    `<ellipse cx="292" cy="222" rx="2.6" ry="1.4" fill="#e8dcc0"/><circle cx="293" cy="222" r="1" fill="${INK}"/><circle cx="292.3" cy="221.4" r="0.4" fill="#fff"/>`);
  // hat: crown and wide brim, battered, with a broken feather
  a.shape({ d: smooth([[238, 168], [286, 162], [300, 184], [296, 204], [244, 204], [236, 186]], true, 0.6), fill: G.black, depth: 14, mottle: 0.6, hatch: 30, lineCol: '#4a3c30',
    lines: ['M242 196 C260 192 280 192 298 196'], decals: a.stain(270, 176, 8, G.umber, 0.6) });
  a.shape({ d: smooth([[196, 206], [244, 194], [300, 192], [340, 200], [330, 212], [286, 212], [240, 214], [200, 216]], true, 0.6), fill: G.cloth, depth: 6, core: false, hatch: 10,
    lines: ['M220 210 C250 204 290 202 330 206'], spec: ['M210 206 C240 198 280 196 320 198'], specOp: 0.35 });
  a.shape({ d: smooth([[244, 194], [298, 192], [298, 200], [244, 202]], true, 0.3), fill: G.redD, depth: 3, core: false, ink: 0.9 });
  a.shape({ d: smooth([[250, 190], [220, 150], [190, 128], [172, 126], [196, 146], [214, 168], [236, 192]], true, 0.6), fill: G.parchD, depth: 8, core: false,
    lines: ['M246 190 C230 166 210 144 180 128', 'M232 176 L222 182', 'M222 162 L212 168', 'M210 148 L200 154', 'M232 176 L238 170', 'M222 162 L228 156'] });
}
a.layer('arm', [250, 300]);
// ---------------------------------------------------------------- near arm thrust forward, swept-hilt rapier
{
  a.limb([[250, 300], [284, 304], [316, 300]], [30, 26, 22], { fill: G.red, depth: 10, mottle: 0.8, hatch: 80,
    lines: ['M262 292 L264 314', 'M278 292 L280 314'], decals: a.stain(286, 302, 7, G.parch, 0.9) + a.stain(266, 304, 6, G.parch, 0.9) });
  a.limb([[316, 300], [342, 296], [362, 292]], [22, 18, 15], { fill: G.redD, depth: 8, mottle: 0.7, hatch: 80 });
  // linen cuff
  a.shape({ d: smooth([[354, 280], [366, 282], [370, 302], [356, 304]], true, 0.5), fill: G.parch, depth: 4, core: false, lines: ['M358 284 L360 302', 'M364 284 L366 302'] });
  // blade: long, thin, storm-charged, blood near the tip
  const tip = [510, 246], base = [382, 287];
  a.shape({ d: poly([[base[0], base[1] - 2.4], [tip[0], tip[1]], [base[0], base[1] + 2.4]]), fill: G.steelL, depth: 1.5, core: false, ink: 1, spec: [`M${base[0] + 4} ${base[1] - 1} L${tip[0] - 10} ${tip[1] + 2}`] });
  let arcs = '';
  for (let k = 0; k < 3; k++) {
    let bolt = `M${base[0] + 14 + k * 30} ${base[1] - 4}`;
    for (let i = 1; i <= 14; i++) { const t = (k * 30 + i * 8) / (tip[0] - base[0]); bolt += ` L${(base[0] + (tip[0] - base[0]) * t + (R() - 0.5) * 3).toFixed(1)} ${(base[1] + (tip[1] - base[1]) * t + (R() - 0.5) * 9).toFixed(1)}`; }
    arcs += `<path d="${bolt}" fill="none" stroke="#f4e3a0" stroke-width="1.6" opacity="0.8"/><path d="${bolt}" fill="none" stroke="${G.gold}" stroke-width="0.6"/>`;
  }
  a.raw(arcs +
    `<path d="M470 254 L500 248" stroke="${G.blood}" stroke-width="3.5" stroke-linecap="round"/>` + a.drip(478, 254, 16, 2.2) + a.drip(492, 251, 10, 1.6));
  // swept hilt: knuckle bow, rings, quillons
  a.raw(`<path d="M372 300 C378 314 392 312 392 298 L388 280" fill="none" stroke="${INK}" stroke-width="3.2"/><path d="M372 300 C378 314 392 312 392 298 L388 280" fill="none" stroke="${G.goldL}" stroke-width="1.6"/>` +
    `<ellipse cx="384" cy="292" rx="8" ry="11" fill="none" stroke="${INK}" stroke-width="3"/><ellipse cx="384" cy="292" rx="8" ry="11" fill="none" stroke="${G.gold}" stroke-width="1.4"/>` +
    `<path d="M380 270 L388 312" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M380 270 L388 312" stroke="${G.goldL}" stroke-width="1.6" stroke-linecap="round"/>`);
  // gloved fist wrapped round the grip
  A.fist([362, 292], [1, -0.08], G.leatherD, 1.05);
  a.shape({ d: smooth([[352, 290], [358, 288], [360, 296], [354, 298]]), fill: G.gold, depth: 2, core: false, ink: 0.9 });
}
require('fs').writeFileSync('grim/duelist.svg', a.svg());
a.writeRig('grim/rig/duelist', { idle: 'stance', attack: 'thrust', hand: [510, 246] });
