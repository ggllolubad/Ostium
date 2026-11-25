// Hookline Fisher: a drowned fisherman in oilskins, face netted over with his own line, hooks sunk
// through his cheeks. He hauls a weighted line ending in a gaff and a fistful of hooks. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 171);
const P = require('./parts')(a), R = a.R;
const oil = { fill: '#6a6a3a', mottle: 0.5, fine: true, wash: 0.36 };
a.raw(a.ground(240, 676, 130, 10));
// boots and legs
a.limb([[270, 430], [282, 540], [276, 650]], [50, 42, 34], Object.assign({ depth: 14, hatch: 110 }, oil));
a.limb([[214, 430], [200, 540], [196, 650]], [50, 42, 34], Object.assign({ depth: 14, hatch: 60 }, oil));
for (const x of [168, 250]) a.shape({ d: smooth([[x + 10, 630], [x + 48, 630], [x + 58, 660], [x + 56, 678], [x - 2, 678], [x - 4, 656]], true, 0.4), fill: G.black, depth: 8, mottle: 0.4 });
// oilskin coat
{
  const hem = P.ragged(306, 172, 520, 9, 16);
  a.shape(Object.assign({ d: smooth([[204, 230], [278, 226], [300, 300], [306, 440], ...hem, [172, 440], [182, 300]], true, 0.5), depth: 36, hatch: 90,
    decals: a.fold(214, 300, 196, 520, 7) + a.fold(282, 300, 296, 520, 7) + a.stain(240, 460, 20, G.algae, 0.55) + a.stain(270, 380, 14, G.blood, 0.5) + P.barnacles(290, 420, 6, 10) }, oil));
  a.raw(`<path d="M200 330 C230 340 270 340 300 330" stroke="${G.leatherD}" stroke-width="6" fill="none"/>`);
}
// coils of line over the shoulder, with hooks and a lead weight
{
  let line = '';
  for (let k = 0; k < 4; k++) line += `<ellipse cx="${272 + k * 2}" cy="${270 + k * 3}" rx="${30 - k * 2}" ry="${42 - k * 3}" transform="rotate(-25 ${272 + k * 2} ${270 + k * 3})" fill="none" stroke="${INK}" stroke-width="2"/><ellipse cx="${272 + k * 2}" cy="${270 + k * 3}" rx="${30 - k * 2}" ry="${42 - k * 3}" transform="rotate(-25 ${272 + k * 2} ${270 + k * 3})" fill="none" stroke="#c8bc98" stroke-width="0.8"/>`;
  a.raw(line + P.hook(296, 300, 0.7) + P.hook(250, 320, 0.6));
}
// head: sou'wester, face cocooned in fishing line, hooks through the cheeks
{
  a.shape({ d: smooth([[196, 190], [222, 170], [262, 172], [282, 196], [278, 236], [250, 252], [214, 248], [196, 226]], true, 0.7), fill: '#9aa596', depth: 18, mottle: 0.5, fine: true, hatch: 90,
    decals: P.eye(214, 210, 6, '#c0a840', true) + `<path d="M206 232 C218 240 236 240 248 234" stroke="${INK}" stroke-width="1.2" fill="none"/>` +
      `<g stroke="#d8ccaa" stroke-width="0.7" fill="none">` + Array.from({ length: 14 }, (_, i) => `<path d="M${194 + i * 6} 184 C${200 + i * 5} 210 ${190 + i * 6} 230 ${200 + i * 5} 252"/>`).join('') + Array.from({ length: 8 }, (_, i) => `<path d="M192 ${190 + i * 8} C230 ${186 + i * 8} 260 ${196 + i * 8} 282 ${190 + i * 8}"/>`).join('') + `</g>` +
      a.stain(232, 222, 8, G.blood, 0.6) });
  a.raw(P.hook(202, 220, 0.5) + P.hook(244, 224, 0.5) + a.drip(206, 238, 12, 1.6) + a.drip(248, 242, 10, 1.4));
  a.shape(Object.assign({ d: smooth([[180, 196], [206, 160], [252, 152], [288, 172], [304, 206], [290, 210], [268, 186], [214, 186], [196, 204]], true, 0.6), depth: 12, hatch: 40 }, oil));
}
// near arm hauling the line with a gaff
a.limb([[210, 250], [176, 300], [150, 290]], [30, 26, 20], Object.assign({ depth: 9, hatch: 60 }, oil));
a.shape({ d: smooth([[134, 280], [156, 276], [162, 296], [148, 304], [132, 298]], true, 0.6), fill: '#9aa596', depth: 5, mottle: 0.5 });
a.shape({ d: limb([[150, 330], [140, 220], [132, 160]], [7, 7, 6]), fill: G.woodD, depth: 3, core: false, tex: 'url(#grain)' });
a.raw(`<path d="M132 162 L128 130 C126 112 104 112 104 128 L108 136" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M132 162 L128 130 C126 112 104 112 104 128 L108 136" fill="none" stroke="${G.steelD}" stroke-width="3.2" stroke-linecap="round"/>` + a.drip(108, 136, 18, 2.2) + a.splat(110, 130, 4, { drops: 3 }));
// far arm with a fistful of hooks on lines
a.limb([[276, 250], [300, 320], [290, 380]], [30, 26, 20], Object.assign({ depth: 9, hatch: 120 }, oil));
a.shape({ d: smooth([[278, 374], [300, 372], [304, 394], [288, 402], [276, 392]], true, 0.6), fill: '#9aa596', depth: 5, mottle: 0.5 });
a.raw([0, 1, 2, 3].map(i => `<path d="M${288 + i * 3} 398 L${282 + i * 8} ${430 + i * 10}" stroke="#c8bc98" stroke-width="0.8"/>` + P.hook(282 + i * 8, 430 + i * 10, 0.45)).join(''));
require('fs').writeFileSync('grim/e_hookline.svg', a.svg());
