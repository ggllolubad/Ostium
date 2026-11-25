// Drowned Thrall, rigged: a drowned sailor, waterlogged and torn open, boat hook in hand. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 401);
const B = require('./body')(a), P = B.P, R = a.R;
const skin = '#8e9a8a';
a.layer('shadow'); a.raw(a.ground(230, 676, 120, 10));
// far arm reaching forward, clawed
a.layer('back', [200, 190]);
B.arm({ sh: [204, 196], el: [156, 250], wr: [128, 296], fill: '#5a5448', fore: skin, handSkin: skin, handDir: [-1, 0.6], claws: true, hatch: 130, foreDecals: a.gash(140, 270, 150, 286, 3, { rim: '#b0786a', dripLen: 10 }) });
// legs: torn trousers to the knee, bare swollen shins
a.layer('legs', [232, 392]);
B.leg({ hip: [214, 392], knee: [190, 522], ankle: [186, 642], fill: '#4a4842', shin: skin, footFill: skin, hatch: 60, shinDecals: a.stain(188, 590, 12, G.bruise, 0.6) });
B.leg({ hip: [256, 392], knee: [270, 524], ankle: [262, 644], fill: '#4a4842', shin: skin, footFill: skin, hatch: 120, shinDecals: a.stain(266, 600, 10, G.bruise, 0.6) });
a.raw(P.ragged(240, 290, 524, 5, 10).map((p, i, arr) => i ? `<path d="M${arr[i - 1][0]} ${arr[i - 1][1]} L${p[0]} ${p[1]}" stroke="${INK}" stroke-width="1.2"/>` : '').join(''));
// torso: shirt torn open over a split belly, ribs showing
a.layer('body', [232, 392]);
B.torso({ fsh: [200, 190], nsh: [266, 194], wl: [208, 332], wr: [264, 330], hl: [206, 396], hr: [266, 396], fill: skin, hatch: 110,
  decals: P.ribs(224, 300, 44, 56, 4) + a.stain(250, 250, 14, G.bruise, 0.5) + P.barnacles(262, 214, 7, 10),
  over: '' });
B.rag([214, 196], [272, 200], 410, '#c8c0a8', { n: 8, amp: 16, depth: 18, decals: [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M200 ${214 + i * 24} C230 ${210 + i * 24} 260 ${208 + i * 24} 290 ${212 + i * 24}" stroke="${G.azureD}" stroke-width="6" opacity="0.6"/>`).join('') + a.stain(250, 330, 22, G.algae, 0.6) + a.stain(236, 280, 14, G.blood, 0.4) });
// the shirt is torn open down the front: the wound shows through
a.shape({ d: smooth([[212, 254], [232, 250], [240, 300], [234, 370], [214, 380], [206, 320]], true, 0.6), fill: skin, depth: 10, mottle: 0.5, fine: true, decals: P.ribs(222, 296, 30, 48, 4) + `<path d="M210 340 C220 336 232 338 236 346 C230 366 214 368 210 340 Z" fill="${G.black}"/>` });
for (const [pts, w] of [[[[214, 352], [206, 386], [216, 410], [228, 396]], 8], [[[224, 354], [228, 392], [220, 430], [210, 444]], 7]]) a.limb(pts, pts.map(() => w), { fill: '#a87a72', depth: 3, mottle: 0.7, fine: true, hatch: 30 });
a.raw(a.drip(212, 444, 22, 2.2) + a.drip(228, 398, 14, 1.8));
// head: drowned, jaw slack, one eye milky, weed for hair
a.layer('head', [214, 176]);
a.limb([[226, 198], [212, 178]], [30, 26], { fill: skin, depth: 7, mottle: 0.5, fine: true, hatch: 110 });
B.head({ x: 194, y: 140, k: 1.15, skin, style: 'drowned', jaw: 0.65, eye: 'milky', hair: 'weed' });
a.raw(P.flies(170, 90, 6, 50));
// near arm and the boat hook
a.layer('arm', [264, 196]);
a.shape({ d: limb([[226, 676], [222, 400], [214, 120]], [7, 7.5, 7]), fill: G.woodD, depth: 3, tex: 'url(#grain)', texOp: 0.6, core: false, decals: a.stain(222, 520, 6, G.algae, 0.7) });
a.raw(`<path d="M214 122 L212 80 C212 58 184 56 184 76 L186 84" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M214 122 L212 80 C212 58 184 56 184 76 L186 84" fill="none" stroke="${G.rust}" stroke-width="3.4" stroke-linecap="round"/><path d="M212 90 L228 74" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M212 90 L228 74" stroke="${G.rust}" stroke-width="2.8" stroke-linecap="round"/>` + a.drip(188, 84, 12, 1.8));
B.arm({ sh: [264, 198], el: [278, 280], wr: [236, 322], fill: '#5a5448', fore: skin, handSkin: skin, handDir: [-1, -0.2], hatch: 120, upperDecals: a.stain(270, 240, 10, G.algae, 0.6) });
a.writeRig('grim/rig/thrall', { idle: 'sway', attack: 'swing', reach: 'grab' });
