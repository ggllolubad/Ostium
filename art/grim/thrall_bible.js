// Drowned Thrall, from its bible entry: a bloated common sailor of the royal fleet. Torn striped shirt,
// rope-belted canvas trousers rolled to the shin, barefoot, kelp hair, barnacles on both shoulders,
// a clean void hole through one forearm, a rusted boat hook held two-handed. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 402);
const B = require('./body')(a), P = B.P, R = a.R;
const skin = '#a9b2a6', skinD = '#7f8a7e', canvas = '#6e6552', stripe = '#4e6079';
const pole = (t) => [318 + (64 - 318) * t, 560 + (196 - 560) * t];   // boat hook line, butt low behind, hook high in front
const ln = (pts) => 'M' + pts.map(p => p.map(v => +v.toFixed(1)).join(' ')).join(' L');

a.layer('shadow'); a.raw(a.ground(236, 676, 128, 10) + `<path d="M180 676 C200 670 260 670 290 674 C270 682 210 684 180 676 Z" fill="${G.water}" opacity="0.5"/>`);

// ---------------------------------------------------------------- far arm, gripping the pole high (behind the body)
a.layer('back', [206, 196]);
{
  const hand = pole(0.62);
  B.arm({ sh: [208, 202], el: [178, 262], wr: [hand[0] + 4, hand[1] + 4], fill: stripe, fore: skin, handSkin: skin, handDir: [-0.8, 0.6], hatch: 130,
    foreDecals: `<ellipse cx="${(178 + hand[0]) / 2 + 3}" cy="${(288 + hand[1]) / 2 + 4}" rx="7" ry="9" fill="#120d18" stroke="${INK}" stroke-width="1.2"/>` +
      `<ellipse cx="${(178 + hand[0]) / 2 + 3}" cy="${(288 + hand[1]) / 2 + 4}" rx="7" ry="9" fill="none" stroke="#d8dccf" stroke-width="0.6" opacity="0.6"/>` });
}
// ---------------------------------------------------------------- legs: canvas trousers rolled to mid-shin, bare swollen shins and feet
a.layer('legs', [236, 396]);
for (const [hip, knee, ankle, hatch] of [[[214, 398], [196, 524], [192, 646], 60], [[262, 398], [276, 526], [270, 648], 120]]) {
  const cuffY = knee[1] + (ankle[1] - knee[1]) * 0.42, cuffX = knee[0] + (ankle[0] - knee[0]) * 0.42;
  B.leg({ hip, knee, ankle, fill: canvas, shin: skin, footFill: skin, hatch, shinDecals: a.stain(ankle[0], ankle[1] - 40, 12, G.bruise, 0.6) + a.stain(ankle[0], ankle[1] - 10, 10, G.algae, 0.55) });
  a.shape({ d: smooth([[cuffX - 22, cuffY - 8], [cuffX + 22, cuffY - 10], [cuffX + 24, cuffY + 8], [cuffX - 22, cuffY + 10]], true, 0.5), fill: '#7d735e', depth: 6, grime: 0.5, lines: [`M${cuffX - 20} ${cuffY} L${cuffX + 22} ${cuffY - 1}`] });
}
// ---------------------------------------------------------------- bloated torso, distended belly pushing the shirt out
a.layer('body', [236, 396]);
B.torso({ fsh: [196, 194], nsh: [270, 198], wl: [164, 336], wr: [300, 332], hl: [196, 404], hr: [280, 404], fill: skin, hatch: 110, mottle: 0.7,
  decals: a.stain(240, 300, 26, G.bruise, 0.45) + P.barnacles(268, 214, 9, 14) });
// the striped shirt, torn open over the swollen belly; mussels in the folds
B.rag([194, 192], [278, 196], 410, '#b9c2c8', { n: 9, amp: 14, depth: 26, flare: 34,
  decals: Array.from({ length: 9 }, (_, i) => `<path d="M178 ${214 + i * 22} C220 ${208 + i * 22} 262 ${206 + i * 22} 300 ${212 + i * 22}" stroke="${stripe}" stroke-width="8" opacity="0.78"/>`).join('') +
    a.stain(250, 330, 26, G.algae, 0.6) + a.stain(216, 270, 16, G.umber, 0.45) + a.stain(230, 380, 14, G.blood, 0.35) });
a.shape({ d: smooth([[176, 300], [198, 296], [206, 330], [200, 364], [180, 370], [168, 340]], true, 0.6), fill: skin, depth: 8, mottle: 0.8, fine: true, hatch: 60,
  decals: a.stain(196, 340, 18, G.bruise, 0.55) + `<g stroke="${G.bruise}" stroke-width="0.8" fill="none" opacity="0.9"><path d="M184 306 C194 320 186 334 196 350"/><path d="M204 300 C210 318 202 332 208 356"/></g>`,
  after: `<path d="M198 296 L204 308 L198 320 L206 334 L200 348 L204 362" stroke="${INK}" stroke-width="1.3" fill="none"/>` });
a.raw([[262, 360], [272, 352], [252, 372]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.4" transform="rotate(30 ${x} ${y})" fill="#2a2f3a" stroke="${INK}" stroke-width="0.8"/>`).join(''));
// rope belt with a hanging end and a corked bottle
a.shape({ d: smooth([[188, 396], [280, 392], [282, 404], [190, 410]], true, 0.3), fill: '#8a7b5a', depth: 4, core: false, lines: ['M196 400 L206 396', 'M214 401 L224 396', 'M232 400 L242 395', 'M250 400 L260 395', 'M266 399 L276 395'] });
a.limb([[262, 404], [270, 450], [264, 474]], [3.4, 3, 2.6], { fill: '#8a7b5a', depth: 2, core: false });
a.shape({ d: smooth([[234, 408], [246, 406], [250, 440], [244, 452], [232, 452], [228, 440]], true, 0.6), fill: '#5c6b4a', depth: 6, core: false, ink: 1, spec: ['M234 414 L234 440'], after: `<path d="M236 402 L244 402 L244 410 L236 410 Z" fill="${G.leather}" stroke="${INK}" stroke-width="0.8"/>` });
// barnacle clusters on the far shoulder and the back of the neck
a.raw(P.barnacles(206, 200, 9, 16) + P.barnacles(240, 186, 6, 12));
// ---------------------------------------------------------------- head: bloated, jaw slack, milky eyes, kelp hair hanging over the face
a.layer('head', [232, 178]);
a.limb([[238, 200], [224, 180]], [34, 30], { fill: skin, depth: 7, mottle: 0.5, fine: true, hatch: 110 });
B.head({ x: 200, y: 142, k: 1.0, skin, style: 'bloated', jaw: 0.75, eye: 'milky', hair: 'weed' });
a.raw(P.weed(224, 104, 74, -1) + P.weed(232, 110, 86, 1.1) + P.weed(214, 102, 60, -0.7) + a.drip(196, 186, 18, 2, G.water) + P.flies(176, 96, 5, 40));
// ---------------------------------------------------------------- near arm and the boat hook, held two-handed across the body
a.layer('arm', [268, 200]);
{
  const p0 = pole(0), p1 = pole(1.0);
  a.shape({ d: limb([p0, pole(0.5), p1], [7, 7.5, 7]), fill: G.woodD, depth: 3, tex: 'url(#grain)', texOp: 0.6, core: false,
    decals: a.stain(pole(0.7)[0], pole(0.7)[1], 6, G.algae, 0.7) + a.stain(pole(0.2)[0], pole(0.2)[1], 6, G.umber, 0.6) });
  // rope wraps on the haft
  for (const t of [0.28, 0.31, 0.34, 0.62, 0.65]) { const [x, y] = pole(t); a.raw(`<path d="M${x - 8} ${y - 3} L${x + 8} ${y + 4}" stroke="${INK}" stroke-width="3.6"/><path d="M${x - 8} ${y - 3} L${x + 8} ${y + 4}" stroke="#8a7b5a" stroke-width="2"/>`); }
  // the iron hook: a socket, a back-curving hook and a straight spike, rusted and dripping
  const [hx, hy] = p1;
  const hk = `M${hx + 6} ${hy + 10} L${hx - 4} ${hy - 6} C${hx - 14} ${hy - 26} ${hx - 2} ${hy - 44} ${hx + 16} ${hy - 38} C${hx + 26} ${hy - 34} ${hx + 26} ${hy - 22} ${hx + 18} ${hy - 16}`;
  a.raw(`<path d="${hk}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${hk}" fill="none" stroke="${G.rust}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M${hx - 2} ${hy - 4} L${hx - 26} ${hy - 30}" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="M${hx - 2} ${hy - 4} L${hx - 26} ${hy - 30}" stroke="${G.rustL}" stroke-width="2.8" stroke-linecap="round"/>` +
    `<path d="M${hx + 2} ${hy + 4} L${hx + 14} ${hy + 18}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${hx + 2} ${hy + 4} L${hx + 14} ${hy + 18}" stroke="${G.iron}" stroke-width="6" stroke-linecap="round"/>` +
    a.drip(hx + 18, hy - 14, 14, 1.8, G.water) + a.drip(hx - 24, hy - 26, 10, 1.6, G.blood));
  const hand = pole(0.40);
  B.arm({ sh: [266, 204], el: [300, 316], wr: [hand[0] + 6, hand[1] - 2], fill: stripe, fore: skin, handSkin: skin, handDir: [-0.7, 0.7], hatch: 120,
    upperDecals: a.stain(276, 244, 10, G.algae, 0.6) + P.barnacles(270, 214, 8, 14) });
}
require('fs').writeFileSync('grim/thrall_bible.svg', a.svg());
