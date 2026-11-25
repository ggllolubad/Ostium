// Sister Ide, the Sacristan. Slight and very upright, thirties, thin and pale, frost on her breath indoors. The only
// bleached, near-white habit in the abbey; one white glove worn, the other hand bare with blue-cold fingertips, held out
// flat as if on glass; a sanctus bell and the sacristy keys at the belt; a candle snuffer. A linen band bound over the
// eyes, a fine white veil, a milky eye glimpsed at the band's edge. Faces left. Canvas 560 x 860, ground 830.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const a = new Art(560, 860, 9127), R = a.R;
const K = require('./keeperkit')(a);
const DETAIL = process.env.PASS !== 'base';
const SKIN = '#d8c8bc', HAB = '#cdc8bc', VEIL = '#e2ded4', BAND = '#d4ccb8', FROST = '#a8c8e0';

a.raw(a.ground(270, 830, 130, 10));
// slippers just showing under the long hem
for (const [x, t] of [[244, 214], [298, 268]]) a.shape({ d: smooth([[x + 14, 812], [x + 16, 828], [t - 6, 830], [t - 10, 822], [x - 12, 814]], true, 0.4), fill: '#8a847a', depth: 4, hatch: 20, ink: 1.6 });
// the habit: long, narrow, falling straight, bleached and starched; grime only at the hem
K.habit({ cx: 270, sh: 300, sw: 86, waist: 470, hem: 820, flare: 1.22, col: HAB, dirt: -0.25, clean: true, folds: [[-0.7, -0.06], [-0.3, 0.04], [0.1, -0.02], [0.5, 0.04], [0.8, 0.07]] });
K.scapular(266, 312, 790, 30, mix(HAB, '#ffffff', 0.2), true);
// belt: a white cord, the sanctus bell and the keys hanging from it
K.rope(200, 340, 470, '#d8d0c0', 70);
{
  const bx = 236, by = 500;
  a.raw(`<path d="M${bx} 474 L${bx} ${by - 12}" stroke="${INK}" stroke-width="1.4"/>`);
  a.shape({ d: `M${bx - 13} ${by + 14} Q${bx - 12} ${by - 14} ${bx} ${by - 14} Q${bx + 12} ${by - 14} ${bx + 13} ${by + 14} Z`, fill: G.goldL, depth: 5, ink: 1.8, hatch: 30, spec: [`M${bx - 6} ${by - 8} Q${bx - 8} ${by} ${bx - 8} ${by + 8}`], specOp: 0.6 });
  a.raw(`<circle cx="${bx}" cy="${by + 17}" r="3.4" fill="${G.gold}" stroke="${INK}" stroke-width="1.2"/>`);
}
K.keys(316, 492, 0.8, 4);

// ---------------------------------------------------------------- head: veil, wimple and the band over the eyes
K.cowl(270, 300, 120, mix(HAB, '#9a948a', 0.2));
a.limb([[262, 300], [256, 270]], [40, 38], { fill: SKIN, depth: 8, mottle: 0.4, hatch: 120 });
const F = K.face({ x: 250, y: 226, k: 0.92, skin: SKIN, age: 0.2, nose: 'straight', brow: 0.2, mouth: 'thin', eye: 'bound', cheek: 0.05, jaw: 0.92, browCol: '#a8a49a' });
K.wimple(F, '#e8e4dc', VEIL, 0.92, { band: BAND });
// a milky eye at the band's lower edge, frost on the lashes, cold lips
a.raw(`<path d="M${F.p(-24, -1).join(' ')} Q${F.p(-18, 2).join(' ')} ${F.p(-12, -1).join(' ')}" fill="#c8d4d8" stroke="${INK}" stroke-width="0.9"/>` +
  Array.from({ length: 5 }, (_, i) => `<path d="M${F.p(-24 + i * 3, 0).join(' ')} l0 2.5" stroke="#e8f4ff" stroke-width="1.1"/>`).join('') +
  `<path d="M${F.p(-31, 28).join(' ')} Q${F.p(-21, 29).join(' ')} ${F.p(-12, 27).join(' ')}" stroke="#7a8a9a" stroke-width="1.6" fill="none" opacity="0.7"/>`);

// ---------------------------------------------------------------- arms
// far arm: held out flat to her left at chest height, the bare hand open, palm down, blue at the fingertips
K.arm({ sh: [210, 318], el: [168, 400], wr: [104, 418], col: HAB, w: 0.92, skin: SKIN, hand: false, hatch: 120, wide: 0.85 });
K.hand([104, 418], SKIN, [-1, 0.08], 1.05, 'open');
a.raw(Array.from({ length: 4 }, (_, i) => `<circle cx="${f(70 - i * 1)}" cy="${f(410 + i * 5)}" r="3.6" fill="#7a9ab8" opacity="0.7"/>`).join(''));
// near arm: down at her side, the white-gloved hand holding the snuffer on its long pole
{
  const g0 = [338, 600], top = [360, 330];
  a.raw(`<path d="M${top[0]} ${top[1]} L${g0[0] - 6} ${g0[1] + 140}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${top[0]} ${top[1]} L${g0[0] - 6} ${g0[1] + 140}" stroke="${G.gold}" stroke-width="3"/>` +
    `<path d="M${top[0] - 12} ${top[1] + 4} Q${top[0]} ${top[1] - 22} ${top[0] + 12} ${top[1] + 4} Z" fill="${G.goldL}" stroke="${INK}" stroke-width="1.8"/>`);
}
K.arm({ sh: [326, 318], el: [348, 440], wr: [344, 540], col: HAB, w: 0.92, skin: '#f0ece4', hand: 'grip', dir: [-0.1, 1], hatch: 120, wide: 0.85 });
if (DETAIL) {
  // frost: her breath, rime at the hem and the cuffs, a few flakes falling round her
  a.raw(`<g opacity="0.22" filter="url(#rough)">${[[-44, 28, 8], [-56, 24, 13], [-72, 18, 17], [-90, 10, 14]].map(([u, v, r]) => `<circle cx="${f(F.p(u, v)[0])}" cy="${f(F.p(u, v)[1])}" r="${r}" fill="#e8f2fa"/>`).join('')}</g>`);
  a.raw(Array.from({ length: 22 }, () => { const x = 180 + R() * 190, y = 790 + R() * 30; return `<path d="M${f(x)} ${f(y)} l${f(2 + R() * 4)} ${f(-2 - R() * 5)}" stroke="${FROST}" stroke-width="1.2" opacity="0.8"/>`; }).join(''));
  a.raw(Array.from({ length: 14 }, () => { const x = 60 + R() * 380, y = 150 + R() * 600; return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + R() * 1.4)}" fill="#e8f4ff" opacity="0.7"/>`; }).join(''));
  // a candle-wax drop and a faint stain of old incense on the scapular; the only marks on her
  a.raw(a.stain(270, 640, 12, '#a89a7a', 0.35) + `<path d="M276 420 q1 6 -1 10" stroke="#f4ead0" stroke-width="3" opacity="0.8" stroke-linecap="round"/>`);
}
fs.mkdirSync('grim/keepers', { recursive: true });
fs.writeFileSync(`grim/keepers/ide${DETAIL ? '' : '_base'}.svg`, a.svg());
console.log('ide', DETAIL ? 'detail' : 'base');
