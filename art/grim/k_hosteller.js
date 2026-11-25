// The Hosteller. Medium in every way, ageless and hard to place. Not a monk: a servant's plain grey tunic and a clean
// apron, the order's key ring and badge; the guest book under one arm, a lit lantern held out in the other hand. A smooth,
// pleasant, forgettable face drawn with the least detail of anyone in the game: small eyes, a small smile, hair neatly
// combed. The plainness is the joke. Faces left. Canvas 560 x 860, ground 830.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 1101), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#c8a68c', TUNIC = '#6a6862', APRON = '#d8d2c4', HOSE = '#4a4844';

a.raw(a.ground(270, 830, 130, 10));
// legs in plain hose, plain shoes
for (const [hip, ank, toe] of [[[240, 600], [236, 798], [196, 824]], [[296, 600], [302, 798], [262, 826]]]) {
  a.limb([hip, ank], [52, 38], { fill: HOSE, depth: 8, mottle: 0.3, hatch: 70 });
  a.shape({ d: smooth([[ank[0] + 18, ank[1] - 4], [ank[0] + 20, ank[1] + 26], [toe[0] - 4, toe[1] + 2], [toe[0] - 10, toe[1] - 8], [ank[0] - 18, ank[1] + 2]], true, 0.4), fill: '#3a2e24', depth: 5, hatch: 20, ink: 1.8 });
}
// the tunic to the knee, belted; a clean apron
K.habit({ cx: 268, sh: 300, sw: 96, waist: 470, hem: 650, flare: 1.15, col: TUNIC, dirt: -0.2, folds: [[-0.6, -0.04], [-0.1, 0.02], [0.4, 0.03], [0.75, 0.05]] });
a.shape({ d: smooth([[212, 478], [322, 474], [330, 640], [206, 644]], true, 0.2), fill: APRON, depth: 10, ink: 1.8, hatch: 60, mottle: 0.25, lines: [{ d: 'M240 490 L236 630 M292 488 L298 628', w: 0.9, op: 0.5 }] });
a.shape({ d: smooth([[186, 462], [354, 458], [356, 478], [186, 482]], true, 0.3), fill: '#3a2e24', depth: 4, ink: 1.6, hatch: 20, core: false });
K.keys(338, 494, 0.85, 5);
K.badge(214, 360, 1.1);
// head: the least detail of anyone in the game
a.limb([[262, 300], [256, 272]], [46, 42], { fill: SKIN, depth: 8, mottle: 0.2, hatch: 120 });
const F = K.face({ x: 248, y: 230, k: 0.98, skin: SKIN, age: 0.15, nose: 'snub', brow: 0.15, mouth: 'smile', eye: 'narrow', cheek: 0, jaw: 1.0, browCol: '#6a5a4a', plain: true });
K.hair(F, 'combed', '#5a4a3a', 0.98);
// near arm: the guest book clamped under it against the side
a.shape({ d: 'M316 346 L384 352 L378 438 L312 432 Z', fill: '#4a2a1c', depth: 6, ink: 2, hatch: 30, spec: ['M320 352 L378 358'], specOp: 0.3, lines: [{ d: 'M384 354 L378 436', w: 3, col: '#d8ccb0' }] });
K.arm({ sh: [326, 316], el: [340, 420], wr: [318, 470], col: TUNIC, w: 1.0, skin: SKIN, hand: false, hatch: 120, wide: 0.7 });
K.hand([318, 470], SKIN, [-0.3, 1], 1.15, 'grip');
// far arm: held out to the left at chest height, the lantern hanging from the hand, lit
K.arm({ sh: [208, 318], el: [166, 400], wr: [116, 390], col: TUNIC, w: 1.0, skin: SKIN, hand: false, hatch: 120, wide: 0.7 });
K.hand([116, 390], SKIN, [-1, -0.2], 1.1, 'fist');
{
  const x = 92, y = 470, s = 30;
  a.raw(`<path d="M${x + 8} 396 L${x} ${y - s * 1.6}" stroke="${INK}" stroke-width="2.6"/>`);
  a.raw(a.glow(x, y, s * 3, '#ffc070', 0.5));
  a.raw(`<path d="M${x - s * 0.55} ${y - s * 1.0} L${x} ${y - s * 1.5} L${x + s * 0.55} ${y - s * 1.0} Z" fill="#2a2622" stroke="${INK}" stroke-width="2"/>` +
    `<g class="em"><path d="M${x - s * 0.45} ${y - s} L${x + s * 0.45} ${y - s} L${x + s * 0.38} ${y + s * 0.6} L${x - s * 0.38} ${y + s * 0.6} Z" fill="#ffd486" stroke="${INK}" stroke-width="2"/><path d="M${x} ${y - s * 0.3} q${s * 0.12} ${s * 0.25} 0 ${s * 0.5} q${-s * 0.12} ${-s * 0.25} 0 ${-s * 0.5} Z" fill="#fff4d0"/></g>` +
    `<path d="M${x} ${y - s} L${x} ${y + s * 0.6} M${x - s * 0.42} ${y - s * 0.2} L${x + s * 0.42} ${y - s * 0.2}" stroke="${INK}" stroke-width="1.6"/><path d="M${x - s * 0.5} ${y + s * 0.6} L${x + s * 0.5} ${y + s * 0.6} L${x + s * 0.4} ${y + s * 0.8} L${x - s * 0.4} ${y + s * 0.8} Z" fill="#2a2622" stroke="${INK}" stroke-width="1.8"/>`);
}
fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/hosteller${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('hosteller', DETAIL ? 'detail' : 'base');
