// Grim Elementalist: hunched hooded elder. Gnarled staff hung with bones and a caged ember; burned,
// frostbitten conjuring hand with the six elements wheeling about it; singed robe, chained grimoire.
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const a = new Art(460, 700, 53);
const R = a.R;
const A = require('./anatomy')(a);
const ragged = (x0, x1, y, n, amp) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 4, y + (i % 2 ? amp * (0.5 + R() * 0.8) : R() * 5)]); } return o; };

a.layer('shadow');
a.raw(a.ground(230, 676, 130, 10));
a.layer('body', [230, 600]);
// ---------------------------------------------------------------- robe body
{
  const hem = ragged(312, 140, 664, 12, 10);
  a.shape({ d: smooth([[214, 236], [276, 232], [298, 300], [312, 420], [320, 560], ...hem, [140, 560], [158, 420], [178, 300]], true, 0.45), fill: G.violetD, depth: 40, mottle: 0.55, fine: true, grime: 0.25, hatch: 70,
    decals: a.fold(206, 300, 182, 640, 9) + a.fold(236, 310, 230, 650, 8) + a.fold(266, 300, 292, 640, 9) + a.fold(286, 330, 312, 600, 6) +
      a.stain(230, 640, 30, G.umber, 0.55) + a.stain(290, 520, 16, G.bloodD, 0.5) +
      // singed hem: charred band with embers
      `<path d="M140 640 C190 632 260 632 320 640 L320 676 L140 676 Z" fill="${G.black}" opacity="0.45"/>` +
      Array.from({ length: 14 }, () => `<circle cx="${(146 + R() * 170).toFixed(1)}" cy="${(644 + R() * 22).toFixed(1)}" r="${(0.8 + R() * 1.2).toFixed(1)}" fill="#e8823a"/>`).join('') });
  // bare, bandaged feet
  for (const [x, flip] of [[200, 1], [262, 1]]) a.shape({ d: smooth([[x, 666], [x + 30 * flip, 664], [x + 40 * flip, 672], [x + 36 * flip, 678], [x - 4, 678]], true, 0.5), fill: G.fleshP, depth: 5, mottle: 0.5, lines: [`M${x + 8} 668 L${x + 10} 678`, `M${x + 18} 666 L${x + 20} 678`] });
  // rope belt and chained grimoire
  a.shape({ d: smooth([[176, 354], [296, 346], [298, 360], [178, 368]], true, 0.3), fill: G.parchD, depth: 4, lines: ['M182 360 L190 356 M196 360 L204 355 M212 359 L220 354 M228 358 L236 353 M244 357 L252 352 M260 356 L268 351 M276 355 L284 350'] });
  a.raw(`<path d="M196 368 C192 390 196 408 190 424" fill="none" stroke="${G.iron}" stroke-width="2.2" stroke-dasharray="3 1.5"/>`);
  a.shape({ d: poly([[168, 420], [204, 416], [208, 470], [172, 474]]), fill: G.leatherD, depth: 10, mottle: 0.7,
    lines: ['M172 426 L204 422', 'M174 466 L206 462'], decals: `<path d="M180 436 L196 434 L198 452 L182 454 Z" fill="none" stroke="${G.gold}" stroke-width="1.2"/><circle cx="189" cy="444" r="3" fill="${G.bloodL}" stroke="${INK}" stroke-width="0.6"/>` + a.splat(196, 462, 4, { drops: 3 }) });
  a.shape({ d: poly([[206, 418], [212, 418], [214, 470], [208, 472]]), fill: G.parch, depth: 2, core: false, ink: 0.8, lines: ['M208 426 L212 426', 'M208 434 L212 434', 'M208 442 L212 442', 'M208 450 L212 450', 'M208 458 L212 458'] });
}
a.layer('near.staff', [208, 252]);
// ---------------------------------------------------------------- staff (behind near hand), with charms
{
  a.shape({ d: smooth([[168, 676], [176, 676], [184, 400], [190, 200], [194, 120], [184, 118], [178, 200], [172, 400]], true, 0.4), fill: G.woodD, depth: 4, tex: 'url(#grain)', texOp: 0.6,
    lines: ['M176 600 L182 596', 'M178 520 L184 518', 'M182 430 L188 428', { d: 'M184 300 C180 290 186 282 182 272', w: 0.7 }] });
  // gnarled crook holding a caged ember
  a.shape({ d: smooth([[184, 122], [176, 96], [186, 70], [208, 66], [222, 82], [214, 100], [204, 92], [208, 82], [196, 80], [190, 96], [196, 122]], true, 0.5), fill: G.woodD, depth: 6, tex: 'url(#grain)', texOp: 0.5 });
  a.raw(`<circle cx="206" cy="112" r="16" fill="#e98b3a" opacity="0.25"/><circle cx="206" cy="112" r="9" fill="#f0a040" opacity="0.5"/>`);
  a.shape({ d: smooth([[198, 104], [206, 98], [214, 104], [214, 120], [206, 126], [198, 120]]), fill: '#d4602a', depth: 4, core: false, ink: 1,
    after: `<path d="M206 102 C202 108 204 114 206 118 C209 112 210 108 206 102 Z" fill="#f6d27a"/><path d="M198 104 L214 120 M214 104 L198 120 M206 96 L206 126" stroke="${G.iron}" stroke-width="1.4"/>` });
  // hanging charms: finger bones and a rusted bell on cords
  a.raw(`<path d="M190 130 C186 150 188 170 184 186 M194 132 C200 150 204 166 202 180" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
  a.shape({ d: smooth([[180, 186], [188, 184], [190, 200], [186, 206], [180, 200]]), fill: G.bone, depth: 3, core: false, ink: 0.9, lines: ['M182 194 L189 193'] });
  a.shape({ d: smooth([[196, 180], [208, 180], [212, 194], [202, 200], [194, 194]]), fill: G.rust, depth: 4, core: false, ink: 0.9 });
}
a.layer('arm', [268, 254]);
// ---------------------------------------------------------------- far arm extended forward, conjuring
{
  A.sleeve({ sh: [268, 254], el: [306, 286], wr: [346, 296], fill: G.violetD, bell: 24, hang: 16, hatch: 80, decals: a.stain(320, 288, 10, '#c8d8e0', 0.5) + a.stain(338, 292, 8, '#c8d8e0', 0.6) });
  // frost crusting the sleeve
  a.raw(Array.from({ length: 10 }, (_, i) => { const x = 316 + i * 3.6, y = 280 + (i % 3) * 5; return `<path d="M${x} ${y} l2 -5 l2 5 l-2 3 Z" fill="#e6f0f2" stroke="${INK}" stroke-width="0.5"/>`; }).join(''));
  // burned and frostbitten hand, fingers splayed, palm up
  A.arm({ sh: [330, 292], el: [334, 294], wr: [352, 296], fill: G.fleshP, w: 0.55 });
  A.hand([352, 296], [1, -0.12], G.fleshP, 0.95);
  a.raw(a.stain(366, 296, 5, G.bloodD, 0.6) + a.stain(380, 290, 4, '#4a3a5a', 0.7) + `<path d="M372 286 l3 -2 M380 284 l3 -1" stroke="#e6f0f2" stroke-width="1.4"/>`);
}
a.layer('near', [208, 252]);
// ---------------------------------------------------------------- near arm holding the staff
{
  A.sleeve({ sh: [208, 252], el: [192, 300], wr: [188, 336], fill: G.violetD, bell: 24, hang: 14, hatch: 30 });
  A.fist([186, 340], [0.15, 1], G.fleshP, 1);
}
a.layer('head', [250, 240]);
// ---------------------------------------------------------------- mantle, hood, face, beard
{
  a.shape({ d: smooth([[196, 222], [290, 216], [310, 260], [286, 286], [246, 276], [206, 290], [184, 262]], true, 0.6), fill: G.cloth, depth: 18, mottle: 0.9, hatch: 50,
    decals: a.fold(214, 236, 200, 282, 5) + a.fold(282, 230, 296, 276, 5) });
  // beard, matted, falling over the chest
  a.shape({ d: smooth([[250, 212], [292, 214], [298, 250], [288, 296], [276, 330], [266, 300], [254, 262]], true, 0.6), fill: '#bdb4a2', depth: 12, mottle: 0.8, hatch: 80,
    lines: ['M262 220 C266 250 268 280 272 320', 'M272 222 C276 250 278 280 278 316', 'M282 220 C286 246 288 268 284 296', 'M256 230 C258 250 262 270 266 296'],
    decals: a.stain(276, 300, 8, G.umber, 0.6) });
  // gaunt face in the hood mouth
  a.shape({ d: smooth([[252, 168], [286, 166], [298, 186], [304, 200], [298, 206], [296, 218], [282, 226], [258, 222]], true, 0.6), fill: G.fleshP, depth: 14, mottle: 0.7, fine: true, hatch: 70,
    lines: ['M286 182 C292 190 298 196 302 200', { d: 'M282 214 C288 214 292 214 296 212', w: 1 }, { d: 'M270 196 C274 206 274 214 272 222', w: 0.7 }, { d: 'M262 186 C266 190 270 192 274 192', w: 0.6 }] });
  a.raw(`<path d="M250 164 L300 168 C300 180 292 188 282 190 C270 190 256 184 250 178 Z" fill="${G.black}" opacity="0.8"/>` +
    `<circle cx="286" cy="182" r="4.2" fill="#9cc4d8" opacity="0.45"/><circle cx="286" cy="182" r="2" fill="#e8f4f8"/><circle cx="286" cy="182" r="0.8" fill="#9cc4d8"/>`);
  // hood
  a.shape({ d: smooth([[228, 126], [262, 118], [292, 132], [306, 168], [300, 172], [282, 160], [254, 160], [246, 196], [252, 230], [222, 232], [208, 196], [210, 150]], true, 0.6), fill: G.violet, depth: 22, mottle: 0.9, hatch: 40,
    lines: ['M232 140 C226 170 228 200 236 226', { d: 'M262 128 C252 140 248 160 248 180', w: 0.8 }], decals: a.stain(240, 150, 12, G.umber, 0.5) });
}
a.layer('fx', [384, 258]);
// ---------------------------------------------------------------- the six elements wheeling above the palm
{
  const cx = 384, cy = 252, r = 40;
  const icons = {
    fire: (x, y) => `<path d="M${x} ${y - 9} C${x + 7} ${y - 2} ${x + 7} ${y + 7} ${x} ${y + 8} C${x - 7} ${y + 7} ${x - 7} ${y - 1} ${x} ${y - 9} Z" fill="#d4602a" stroke="${INK}" stroke-width="0.9"/><path d="M${x} ${y - 2} C${x + 3} ${y + 2} ${x + 3} ${y + 5} ${x} ${y + 6} C${x - 3} ${y + 5} ${x - 3} ${y + 2} ${x} ${y - 2} Z" fill="#f6d27a"/>`,
    frost: (x, y) => `<path d="M${x} ${y - 8} L${x} ${y + 8} M${x - 7} ${y - 4} L${x + 7} ${y + 4} M${x - 7} ${y + 4} L${x + 7} ${y - 4}" stroke="#e8f4f8" stroke-width="3"/><path d="M${x} ${y - 8} L${x} ${y + 8} M${x - 7} ${y - 4} L${x + 7} ${y + 4} M${x - 7} ${y + 4} L${x + 7} ${y - 4}" stroke="${G.azureD}" stroke-width="1.1"/>`,
    lightning: (x, y) => `<path d="M${x + 2} ${y - 9} L${x - 4} ${y + 1} L${x + 1} ${y + 1} L${x - 2} ${y + 9} L${x + 5} ${y - 2} L${x} ${y - 2} Z" fill="${G.goldL}" stroke="${INK}" stroke-width="0.9"/>`,
    water: (x, y) => `<path d="M${x} ${y - 9} C${x + 6} ${y - 1} ${x + 7} ${y + 4} ${x} ${y + 7} C${x - 7} ${y + 4} ${x - 6} ${y - 1} ${x} ${y - 9} Z" fill="#4f7fa6" stroke="${INK}" stroke-width="0.9"/><path d="M${x - 2} ${y + 1} C${x - 2} ${y + 3} ${x} ${y + 4} ${x + 1} ${y + 4}" stroke="#cfe2ee" stroke-width="1" fill="none"/>`,
    toxin: (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="${G.slime}" stroke="${INK}" stroke-width="0.9"/><circle cx="${x + 4}" cy="${y - 6}" r="2.6" fill="${G.slime}" stroke="${INK}" stroke-width="0.7"/><circle cx="${x - 2}" cy="${y - 2}" r="1.4" fill="#e8f0c8"/>`,
    void: (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#7b6a96" opacity="0.6"/><circle cx="${x}" cy="${y}" r="5" fill="${G.black}" stroke="${INK}" stroke-width="0.9"/><circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#b9a8d6" stroke-width="0.6" stroke-dasharray="2 2"/>`,
  };
  a.raw(`<ellipse cx="${cx}" cy="${cy + 6}" rx="${r + 6}" ry="${r * 0.55}" fill="none" stroke="${INK}" stroke-width="0.6" stroke-dasharray="1.5 3" opacity="0.8"/>`);
  ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'].forEach((k, i) => {
    const ang = -Math.PI / 2 + i * Math.PI / 3, x = cx + Math.cos(ang) * r, y = cy + 6 + Math.sin(ang) * r * 0.55;
    a.raw(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#fff7e4" opacity="0.18"/>` + icons[k](+x.toFixed(1), +y.toFixed(1)));
  });
  // crackle from palm up into the ring
  a.raw(`<path d="M382 288 L378 276 L386 268 L380 258" fill="none" stroke="${G.goldL}" stroke-width="1.2"/><path d="M390 288 C396 276 392 268 398 258" fill="none" stroke="#b9a8d6" stroke-width="1"/>`);
}
require('fs').writeFileSync('grim/elementalist.svg', a.svg());
a.writeRig('grim/rig/elementalist', { idle: 'sway', attack: 'cast', hand: [384, 290] });
