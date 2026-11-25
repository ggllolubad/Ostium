// The Grasping Deep (elite): a single colossal tentacle bursting up through the flagstones, wrapped around
// a drowned knight it is slowly crushing; suckers ringed with hooks. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(560, 800, 241);
const P = require('./parts')(a), R = a.R;
a.layer('shadow');
a.raw(a.ground(280, 776, 200, 14));
a.layer('body', [280, 776]);
// broken flagstones heaved up around the base
for (const [x, w, r] of [[150, 70, -14], [380, 80, 12], [240, 60, -4], [320, 50, 6]]) a.shape({ d: poly([[x, 776], [x + w, 770 - r], [x + w - 6, 744 - r], [x + 6, 750]]), fill: G.steelD, depth: 8, mottle: 0.6, decals: a.stain(x + w / 2, 760, 10, G.algae, 0.6) });
a.raw(`<path d="M200 776 C240 740 340 736 380 776 Z" fill="${G.black}"/>`);
a.layer('arm', [300, 780]);
// the main tentacle: rising, curling over at the top
P.tentacle([[300, 790], [320, 650], [300, 520], [250, 420], [236, 320], [262, 230], [322, 186], [372, 210], [366, 266], [326, 270]], 120, 18, '#6a4a5a', { hatch: 60, decals: a.stain(300, 520, 30, G.bloodD, 0.5) + P.barnacles(330, 600, 14, 20) + P.barnacles(260, 380, 10, 16) });
// hooks in the suckers along the inner curve
a.raw([[240, 600], [214, 500], [198, 400], [206, 300], [236, 230]].map(([x, y]) => P.hook(x - 10, y - 10, 0.5)).join(''));
// the drowned knight in its grip: torso and dangling limbs, helm cracked
a.shape({ d: smooth([[196, 430], [252, 420], [262, 500], [250, 560], [196, 564], [180, 500]], true, 0.6), fill: G.steelD, depth: 18, mottle: 0.6, hatch: 70, decals: a.stain(220, 520, 16, G.rust, 0.7) + a.gash(200, 470, 240, 492, 6, { rim: '#c08070', dripLen: 24 }) });
a.limb([[200, 560], [176, 640], [170, 720]], [30, 26, 22], { fill: G.steelD, depth: 9, mottle: 0.6, hatch: 60 });
a.limb([[190, 440], [140, 490], [118, 560]], [26, 22, 18], { fill: G.steelD, depth: 8, mottle: 0.6, hatch: 60 });
a.shape({ d: smooth([[150, 380], [184, 366], [214, 382], [214, 420], [186, 434], [156, 420]], true, 0.6), fill: G.steel, depth: 14, mottle: 0.6, decals: `<path d="M156 400 L212 398 L212 406 L156 408 Z" fill="${G.black}"/><path d="M190 368 L176 430" stroke="${G.black}" stroke-width="2"/>` });
a.raw(a.drip(186, 432, 30, 2.4) + a.drip(118, 562, 40, 2.2));
// a band of the tentacle wrapping across the knight
P.tentacle([[150, 480], [210, 470], [270, 490], [292, 520]], 34, 26, '#6a4a5a', { hatch: 60 });
a.writeRig('grim/rig/kraken_arm', { idle: 'tentacle', attack: 'lash', hand: [330, 240] });
