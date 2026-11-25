// Wreck Crab: a crab the size of a dog wearing a drowned man's ribcage and skull as its shell, claws
// scarred and hung with rotted rope. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(480, 560, 201);
const P = require('./parts')(a), R = a.R;
const shell = { fill: '#8a4a32', mottle: 0.55, fine: true, wash: 0.36 };
a.layer('shadow');
a.raw(a.ground(240, 536, 170, 12));
a.layer('legs', [250, 440]);
// legs (four a side visible), jointed
const leg = (pts) => { for (let i = 0; i < pts.length - 1; i++) a.limb([pts[i], pts[i + 1]], [12 - i * 3, 9 - i * 3], Object.assign({ depth: 4, hatch: 80 }, shell)); };
leg([[300, 420], [360, 380], [392, 470], [400, 534]]); leg([[290, 430], [340, 410], [356, 490], [356, 534]]);
leg([[200, 420], [150, 380], [120, 470], [114, 534]]); leg([[214, 430], [170, 412], [160, 490], [164, 534]]);
a.layer('body', [250, 440]);
// body carapace
a.shape(Object.assign({ d: smooth([[150, 430], [180, 380], [250, 364], [330, 382], [360, 430], [330, 470], [250, 480], [176, 470]], true, 0.7), depth: 30, hatch: 100,
  decals: P.barnacles(300, 400, 10, 16) + a.stain(230, 420, 20, G.algae, 0.55) }, shell));
// ribcage worn as shell, skull on top
a.raw(P.ribs(270, 380, 130, 70, 5));
a.shape({ d: smooth([[254, 300], [282, 288], [314, 300], [320, 330], [304, 352], [270, 352], [254, 332]], true, 0.7), fill: G.bone, depth: 14, mottle: 0.5, fine: true, hatch: 100,
  decals: P.socket(272, 318, 7) + P.socket(298, 316, 6) + P.teeth(270, 342, 304, 342, 6, 5, 1) + a.stain(300, 300, 8, G.algae, 0.6) });
// eye stalks
for (const [x, y] of [[176, 396], [196, 388]]) a.raw(`<path d="M${x} ${y} L${x - 10} ${y - 26}" stroke="${INK}" stroke-width="4"/><path d="M${x} ${y} L${x - 10} ${y - 26}" stroke="#8a4a32" stroke-width="2.2"/><circle cx="${x - 10}" cy="${y - 28}" r="4" fill="${G.black}" stroke="${INK}" stroke-width="0.8"/><circle cx="${x - 11}" cy="${y - 29}" r="1" fill="#fff"/>`);
a.layer('arm', [180, 440]);
// claws: one huge, one small
a.limb([[180, 440], [130, 420], [100, 380]], [26, 22, 18], Object.assign({ depth: 8, hatch: 60 }, shell));
a.shape(Object.assign({ d: smooth([[110, 390], [70, 360], [40, 330], [46, 312], [80, 316], [100, 340], [92, 300], [60, 280], [70, 266], [110, 290], [126, 360]], true, 0.5), depth: 14, hatch: 60,
  decals: P.teeth(52, 318, 96, 336, 6, 4, -1, '#c8a080') + a.stain(80, 330, 8, G.blood, 0.8), over: a.drip(54, 330, 16, 2) }, shell));
a.raw(`<path d="M100 360 C90 380 98 400 88 420" stroke="#a89068" stroke-width="2.2" fill="none"/>`);
a.limb([[320, 440], [370, 428], [396, 400]], [20, 16, 12], Object.assign({ depth: 6, hatch: 120 }, shell));
a.shape(Object.assign({ d: smooth([[392, 404], [420, 380], [428, 392], [412, 404], [426, 414], [416, 424], [394, 418]], true, 0.5), depth: 6 }, shell));
a.writeRig('grim/rig/crab', { idle: 'scuttle', attack: 'pinch', hand: [50, 320] });
