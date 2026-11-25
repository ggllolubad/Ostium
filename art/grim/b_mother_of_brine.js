// Mother of Brine (boss): the siren-matriarch. An emaciated torso with too many arms rises from a heaving
// mass of fish-tails and tentacles; her hair is a curtain of kelp and her eyes run down her face in a column.
// She cradles a drowned infant. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(700, 900, 311);
const P = require('./parts')(a), R = a.R;
const skin = { fill: '#a8b4a6', mottle: 0.5, fine: true, wash: 0.4 };
a.raw(a.ground(350, 876, 260, 14));
// the mass: tails and tentacles heaped
P.tentacle([[600, 876], [620, 760], [560, 700], [520, 740]], 70, 20, '#5f7d74', { hatch: 120 });
P.tentacle([[120, 876], [90, 780], [130, 720], [170, 760]], 70, 20, '#5f7d74', { hatch: 60 });
a.shape({ d: smooth([[130, 876], [150, 740], [250, 640], [450, 640], [560, 740], [580, 876]], true, 0.6), fill: '#4f6a62', tex: 'url(#mail)', texOp: 0.6, depth: 60, mottle: 0.5, fine: true, hatch: 80,
  decals: P.barnacles(240, 760, 16, 40) + P.barnacles(470, 780, 14, 34) + a.stain(350, 820, 60, G.bruise, 0.5) + a.gash(300, 740, 360, 760, 8, { rim: '#c08070', dripLen: 30 }) });
P.tentacle([[200, 860], [230, 780], [300, 760], [330, 800]], 50, 18, '#6a4a5a', { hatch: 60 });
P.tentacle([[480, 860], [440, 780], [380, 790], [370, 830]], 46, 16, '#6a4a5a', { hatch: 120 });
// torso rising from the mass
a.shape(Object.assign({ d: smooth([[290, 380], [410, 376], [440, 470], [430, 600], [450, 670], [260, 674], [270, 600], [262, 470]], true, 0.7), depth: 40, hatch: 110,
  decals: P.ribs(350, 520, 110, 130, 7) + a.stain(420, 620, 24, '#5f7d74', 0.6) + a.stain(280, 620, 20, '#5f7d74', 0.6) }, skin));
// too many arms: two reaching forward, two raised, two cradling
const arm = (pts, w, hand) => { a.limb(pts, [w, w * 0.85, w * 0.7], Object.assign({ depth: w * 0.3, hatch: pts[2][0] > 350 ? 120 : 60 }, skin)); const [hx, hy] = pts[2]; a.shape(Object.assign({ d: smooth([[hx - 12, hy - 8], [hx - 30 * hand, hy - 14], [hx - 34 * hand, hy], [hx - 30 * hand, hy + 12], [hx - 10, hy + 12]], true, 0.4), depth: 5, after: `<path d="M${hx - 30 * hand} ${hy - 14} L${hx - 40 * hand} ${hy - 18} M${hx - 34 * hand} ${hy} L${hx - 46 * hand} ${hy} M${hx - 30 * hand} ${hy + 12} L${hx - 40 * hand} ${hy + 18}" stroke="${INK}" stroke-width="1.4"/>` }, skin)); };
arm([[300, 400], [230, 380], [170, 400]], 26, 1);
arm([[300, 430], [220, 470], [160, 500]], 24, 1);
arm([[300, 390], [262, 300], [236, 230]], 22, 0.6);
arm([[404, 390], [452, 300], [470, 230]], 22, -0.6);
// cradled infant
a.shape({ d: smooth([[310, 560], [370, 548], [396, 580], [370, 610], [312, 606]], true, 0.7), fill: '#8a9aa4', depth: 14, mottle: 0.5, fine: true, hatch: 100, decals: `<path d="M318 576 l3 3 m0 -3 l-3 3 M330 574 l3 3 m0 -3 l-3 3" stroke="${INK}" stroke-width="0.8"/><path d="M318 590 C324 594 330 594 334 590" stroke="${INK}" stroke-width="0.9" fill="none"/>` });
arm([[410, 450], [420, 540], [380, 600]], 22, -1);
// head: hair a curtain of kelp, eyes in a column down the face, jaw split
a.raw(Array.from({ length: 14 }, (_, i) => P.weed(290 + i * 9, 220, 200 + (i % 4) * 40, i % 2 ? 1 : -1, i % 3 ? '#4f5f3a' : '#3a4a2a')).join(''));
a.shape(Object.assign({ d: smooth([[300, 250], [336, 222], [380, 226], [404, 262], [404, 330], [380, 372], [330, 376], [302, 340], [294, 290]], true, 0.7), depth: 26, hatch: 100,
  decals: P.eye(346, 260, 9, '#d8c040') + P.eye(350, 288, 7, '#d8c040') + P.eye(346, 312, 6, '#d8c040') + P.eye(372, 262, 5, '#d8c040') +
    `<path d="M314 334 C334 330 362 332 384 338 L376 368 C360 384 330 382 318 366 Z" fill="${G.black}"/>` + P.teeth(318, 336, 380, 340, 10, 8, 1) + P.teeth(322, 364, 374, 364, 8, 6, -1),
  over: P.drool(340, 378, 36, '#c8b0a0') }, skin));
a.raw([[320, 230], [350, 218], [380, 224]].map(([x, y]) => P.hook(x, y - 24, 0.7)).join(''));
require('fs').writeFileSync('grim/b_mother_of_brine.svg', a.svg());
