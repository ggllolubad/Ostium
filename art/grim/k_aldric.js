// Prior Aldric. Tall and lean, perfectly still, gloved hands folded over the ledger of the dead held against him.
// An immaculate habit and black scapular, the only clean ones in the abbey; the master ring of keys on a chain; a plain iron
// pectoral cross; a single red cord of office at the waist. Close-cropped silver hair, a calm unreadable face, pale eyes.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 3391), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#c8ac98', HAB = '#6a6660', SCAP = '#1e1c1c', GLOVE = '#2a2624', RED = '#8a1a14';

a.raw(a.ground(270, 830, 130, 10));
for (const [x, t] of [[246, 214], [298, 266]]) a.shape({ d: smooth([[x + 14, 812], [x + 16, 828], [t - 6, 830], [t - 10, 822], [x - 12, 814]], true, 0.4), fill: '#1a1614', depth: 4, hatch: 20, ink: 1.6, spec: [`M${t} 824 L${x} 818`], specOp: 0.4 });
K.habit({ cx: 272, sh: 250, sw: 92, waist: 450, hem: 818, flare: 1.14, col: HAB, dirt: -0.3, clean: true, folds: [[-0.7, -0.03], [-0.3, 0.02], [0.1, -0.02], [0.5, 0.03], [0.8, 0.05]] });
K.scapular(268, 262, 800, 40, SCAP, true);
// the red cord of office, knotted, its ends hanging
K.rope(196, 348, 448, RED, 110);
// the master ring of keys on a chain at the near hip
a.raw(`<path d="M340 452 Q350 480 344 508" stroke="${INK}" stroke-width="2.6" fill="none" stroke-dasharray="4 2"/>`);
K.keys(344, 520, 1.15, 7);
// head
K.cowl(274, 248, 128, dark(HAB, 0.1));
a.limb([[264, 252], [256, 220]], [44, 40], { fill: SKIN, depth: 8, mottle: 0.4, hatch: 120 });
const F = K.face({ x: 246, y: 168, k: 0.98, skin: SKIN, age: 0.7, nose: 'straight', brow: 0.35, mouth: 'set', eye: 'open', cheek: 0.05, jaw: 0.98, browCol: '#a8a8a4', iris: '#8a9aa0' });
K.hair(F, 'crop', '#b8b8b4', 0.98);
// the iron pectoral cross on its thong
a.raw(`<path d="M${F.p(-12, 48).join(' ')} Q236 300 240 328 M${F.p(16, 40).join(' ')} Q262 300 244 328" stroke="${INK}" stroke-width="1.2" fill="none"/>`);
a.raw(`<path d="M242 326 L242 372 M228 340 L256 340" stroke="${INK}" stroke-width="8" stroke-linecap="square"/><path d="M242 326 L242 372 M228 340 L256 340" stroke="${G.iron}" stroke-width="4.6" stroke-linecap="square"/>`);
// arms: forearms folded in front, the ledger of the dead held flat against the body under gloved hands
K.arm({ sh: [192, 268], el: [186, 392], wr: [252, 410], col: HAB, w: 0.95, skin: GLOVE, hand: false, hatch: 120, wide: 0.75 });
{
  // the ledger: a heavy black book, red-edged, held upright against the scapular
  const bx = 198, by = 384, w = 96, h = 120;
  a.shape({ d: `M${bx} ${by} L${bx + w} ${by - 6} L${bx + w + 4} ${by + h - 6} L${bx + 4} ${by + h} Z`, fill: '#5a1810', depth: 6, ink: 2.2, hatch: 30, spec: [`M${bx + 8} ${by + 6} L${bx + w - 6} ${by}`], specOp: 0.35, after: [[bx, by], [bx + w, by - 6], [bx + w + 4, by + h - 6], [bx + 4, by + h]].map(([x, y], i) => `<path d="M${x + (i % 3 ? -12 : 12)} ${y} L${x} ${y} L${x} ${y + (i < 2 ? 12 : -12)}" stroke="${G.goldL}" stroke-width="4" fill="none"/>`).join(''),
    lines: [{ d: `M${bx + w} ${by - 4} L${bx + w + 4} ${by + h - 6}`, w: 3.4, col: RED }, { d: `M${bx + 14} ${by + 20} L${bx + w - 14} ${by + 16} L${bx + w - 12} ${by + 60} L${bx + 16} ${by + 64} Z`, w: 1.2, col: '#3a3430' }] });
}
K.arm({ sh: [334, 268], el: [334, 392], wr: [262, 418], col: HAB, w: 0.95, skin: GLOVE, hand: false, hatch: 120, wide: 0.75 });
K.hand([262, 418], GLOVE, [-1, -0.1], 1.1, 'rest');
K.hand([236, 412], GLOVE, [-1, 0.05], 1.05, 'rest');
a.raw(`<path d="M262 404 L268 432 M238 400 L242 424" stroke="#6a6460" stroke-width="2.4" opacity="0.9"/><path d="M232 418 l-20 2 M256 424 l-22 4" stroke="#5a5450" stroke-width="1.4"/>`);
if (DETAIL) {
  // he is clean: only a white collar edge and the press-creases of the scapular show; a single grey thread at the cuff
  a.raw(`<path d="M${F.p(-20, 52).join(' ')} Q256 250 ${F.p(18, 42).join(' ')}" stroke="#e8e4dc" stroke-width="2.4" fill="none"/>`);
  a.raw(`<path d="M252 300 L252 780 M284 300 L284 780" stroke="#3a3636" stroke-width="1" opacity="0.6"/>`);
}
fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/aldric${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('aldric', DETAIL ? 'detail' : 'base');
