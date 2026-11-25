// Grim Bulwark: oathbound veteran knight. Battered great helm with a sword gash and an eye in the
// slit, hacked heater shield with broken arrows and a bloody handprint, flanged mace hanging from the
// near fist and dripping into a pool, tattered cloak, grime-soaked surcoat. Faces right; light upper left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(440, 700, 31);
const R = a.R;
const rot = (pts, cx, cy, ang) => pts.map(([x, y]) => { const c = Math.cos(ang), s = Math.sin(ang), dx = x - cx, dy = y - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; });
const ln = (pts) => 'M' + pts.map(p => p.map(v => +v.toFixed(1)).join(' ')).join(' L');
const ragged = (x0, x1, y, n, amp, lenJ) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 4, y + (i % 2 ? amp * (0.6 + R() * 0.8) : R() * lenJ)]); } return o; };

a.layer('shadow');
a.raw(a.ground(214, 676, 150, 11));
// blood pool under the mace
a.raw(`<path d="M96 674 C100 666 140 664 160 668 C176 671 174 680 150 682 C120 684 92 682 96 674 Z" fill="${G.blood}" opacity="0.85"/><path d="M110 674 C120 670 140 670 150 673" stroke="#c0503a" stroke-width="0.8" fill="none" opacity="0.6"/>`);

a.layer('back', [200, 180]);
// ---------------------------------------------------------------- gambeson skirt edge and a sheathed rondel dagger behind the body
{
  a.shape({ d: smooth([[168, 440], [270, 440], [276, 520], [240, 532], [200, 528], [162, 516]], true, 0.6), fill: '#8a7a5c', depth: 16, mottle: 0.8, grime: 0.4, hatch: 50,
    lines: ['M180 450 L176 516', 'M200 452 L198 524', 'M222 452 L222 528', 'M244 450 L246 526', 'M262 448 L266 518'], decals: a.stain(230, 500, 18, G.umber, 0.5) + a.stain(190, 506, 12, G.blood, 0.45) });
  a.limb([[150, 330], [130, 420]], [9, 6], { fill: G.leatherD, depth: 4, grime: 0.4 });
  a.shape({ d: smooth([[146, 318], [160, 316], [158, 332], [148, 334]]), fill: G.iron, depth: 3 });
}
a.layer('legs', [220, 400]);
// ---------------------------------------------------------------- far leg (forward)
{
  a.limb([[248, 350], [266, 430], [282, 505]], [56, 48, 38], {fill: G.steel, tex: 'url(#mail)', depth: 18, mottle: 0.6, hatch: 60, decals: a.stain(268, 470, 14, G.blood, 0.5) });
  a.limb([[284, 512], [292, 576], [298, 634]], [40, 38, 28], {fill: G.steel, depth: 14, mottle: 0.7, hatch: 62,
    lines: ['M290 520 L297 630', { d: 'M280 560 L284 572', w: 0.7 }, { d: 'M304 588 C300 598 302 606 298 614', w: 0.7 }],
    spec: ['M279 524 C279 560 284 600 288 628'], decals: a.stain(300, 610, 10, G.rust, 0.6) + a.stain(286, 548, 8, G.rust, 0.5) + a.drips(286, 300, 520, 2, 40, 2) });
  a.shape({ d: smooth([[264, 488], [288, 482], [306, 494], [306, 518], [290, 530], [270, 526], [262, 508]]), fill: G.steel, depth: 10, grime: 0.2,
    lines: ['M266 506 C278 512 294 512 304 504', 'M268 494 C280 500 294 500 304 494'], spec: ['M268 490 C274 486 282 485 288 486'], after: a.rivet(285, 518) + a.rivet(298, 514) });
  a.shape({ d: smooth([[262, 496], [250, 490], [244, 504], [252, 520], [264, 514]]), fill: G.steel, depth: 6 });
  // pointed sabaton
  a.shape({ d: smooth([[284, 626], [306, 624], [318, 640], [342, 656], [360, 668], [358, 678], [282, 678], [278, 650]], true, 0.4), fill: G.steelD, depth: 9, grime: 0.4,
    lines: ['M286 638 C298 636 310 638 318 642', 'M284 650 C300 648 318 650 330 656', 'M282 662 C304 660 326 662 344 668'], spec: ['M290 630 L304 629'], decals: a.stain(318, 668, 16, G.umber, 0.55) });
}
// ---------------------------------------------------------------- near leg (back)
{
  a.limb([[196, 356], [186, 430], [176, 505]], [56, 48, 38], {fill: G.steel, tex: 'url(#mail)', depth: 18, mottle: 0.6, hatch: 50, decals: a.stain(188, 478, 12, G.blood, 0.45) });
  a.limb([[175, 512], [166, 576], [158, 634]], [40, 38, 28], {fill: G.steel, depth: 14, mottle: 0.7, hatch: 50,
    lines: ['M170 520 L160 630', { d: 'M178 590 L182 600', w: 0.7 }], spec: ['M162 522 C160 560 156 600 152 626'], decals: a.stain(166, 600, 12, G.rust, 0.55) + a.stain(160, 630, 10, G.umber, 0.5) });
  a.shape({ d: smooth([[156, 486], [180, 482], [196, 494], [196, 518], [180, 530], [160, 526], [152, 508]]), fill: G.steel, depth: 10, grime: 0.25,
    lines: ['M156 506 C168 512 184 512 194 504', 'M158 494 C170 500 184 500 194 494'], spec: ['M160 490 C166 486 174 485 180 486'], after: a.rivet(166, 518) + a.rivet(182, 516) });
  a.shape({ d: smooth([[142, 626], [164, 624], [176, 640], [200, 656], [218, 668], [216, 678], [140, 678], [136, 650]], true, 0.4), fill: G.steelD, depth: 9, grime: 0.4,
    lines: ['M144 638 C156 636 168 638 176 642', 'M142 650 C158 648 176 650 188 656', 'M140 662 C162 660 184 662 202 668'], spec: ['M148 630 L162 629'], decals: a.stain(176, 668, 16, G.umber, 0.55) });
}
a.layer('body', [220, 400]);
// ---------------------------------------------------------------- torso + surcoat skirt
{
  const hem = ragged(292, 156, 466, 13, 26, 8);
  a.shape({ d: smooth([[184, 322], [262, 320], [278, 380], ...hem, [168, 380]], true, 0.5), fill: '#6e604c', depth: 26, mottle: 0.9, grime: 0.3, hatch: 70,
    lines: ['M200 340 C196 380 190 430 186 480', 'M222 340 C222 390 224 430 226 488', 'M244 338 C248 380 256 430 260 480', 'M180 350 C176 400 170 440 166 470'],
    decals: a.fold(200, 340, 186, 478, 7) + a.fold(224, 342, 228, 486, 6) + a.fold(246, 340, 262, 478, 7) + a.stain(226, 440, 30, G.blood, 0.8) + a.stain(240, 474, 20, G.bloodD, 0.7) + a.stain(190, 400, 14, G.umber, 0.4),
    over: a.drips(196, 268, 488, 6, 26, 2.2) });
  a.shape({ d: smooth([[198, 170], [252, 168], [272, 196], [268, 262], [260, 330], [184, 334], [174, 262], [172, 200]], true, 0.8), fill: '#857560', depth: 30, mottle: 0.9, grime: 0.3, hatch: 70,
    lines: ['M190 210 C196 250 194 290 192 326', 'M214 196 C220 240 222 290 220 330', { d: 'M180 240 C186 246 192 246 198 240', w: 0.7 }],
    decals: a.fold(192, 212, 192, 324, 5) + a.fold(214, 200, 220, 328, 6) + a.stain(214, 300, 24, G.blood, 0.75) + a.splat(200, 262, 7, { drops: 6 }) + a.gash(186, 278, 204, 292, 5, { rim: '#4a5a6c', drip: false }) });
  a.shape({ d: smooth([[188, 276], [204, 284], [206, 296], [192, 296]]), fill: G.steelD, tex: 'url(#mail)', depth: 3, core: false, ink: 0.8 });
}
// belt, buckle, pouch
{
  a.shape({ d: smooth([[178, 318], [266, 314], [268, 332], [180, 338]], true, 0.2), fill: G.leatherD, depth: 6, grime: 0.4, lines: ['M182 322 L264 318', 'M182 334 L264 328'] });
  a.shape({ d: poly([[204, 316], [220, 315], [221, 334], [205, 336]]), fill: '#8a6f3a', depth: 5, ink: 1.1, lines: ['M212 316 L212 335'], spec: ['M206 318 L206 330'] });
  a.shape({ d: smooth([[238, 336], [256, 334], [258, 360], [246, 366], [236, 358]]), fill: G.leather, depth: 8, grime: 0.4, lines: ['M238 344 L256 342'] });
}
// ---------------------------------------------------------------- far pauldron peeking above the shield
a.shape({ d: smooth([[248, 178], [272, 174], [290, 190], [286, 214], [258, 214]]), fill: G.steel, depth: 10, mottle: 0.6, lines: ['M254 196 C266 200 280 200 288 196'], spec: ['M256 182 C264 178 272 178 278 180'], after: a.rivet(270, 186) });
a.layer('shield', [262, 190]);
// ---------------------------------------------------------------- the door-shield: an old church door, oak planks, three hinge straps
{
  const X0 = 226, X1 = 352, Y0 = 176, Y1 = 584, sk = 10;           // slight skew: the far edge sits lower (three-quarter view)
  const P4 = (x, y) => [x, y + (x - X0) / (X1 - X0) * sk];
  // thickness edge on the near side
  a.shape({ d: poly([P4(X0 - 9, Y0 + 4), P4(X0, Y0), P4(X0, Y1), P4(X0 - 9, Y1 + 3)]), fill: G.woodD, depth: 3, core: false, tex: 'url(#grain)', texOp: 0.7 });
  const n = 4, pw = (X1 - X0) / n;
  for (let i = 0; i < n; i++) {
    const xa = X0 + i * pw, xb = xa + pw - 1.5, yb = Y1 - (i % 2 ? 6 : 0) - R() * 6;
    a.shape({ d: poly([P4(xa, Y0 + (i % 2 ? 3 : 0)), P4(xb, Y0 + (i % 2 ? 3 : 0)), P4(xb, yb), P4(xa + 3, yb + 4), P4(xa, yb)]), fill: i % 2 ? G.wood : '#73543a', depth: 14, mottle: 0.9, grime: 0.35, hatch: 40 + i * 12,
      tex: 'url(#grain)', texOp: 0.55,
      lines: [ { d: `M${xa + pw * 0.35} ${Y0 + 30} C${xa + pw * 0.45} ${Y0 + 140} ${xa + pw * 0.3} ${Y0 + 260} ${xa + pw * 0.4} ${Y1 - 40}`, w: 0.6 } ],
      decals: a.stain(xa + pw / 2, Y0 + 200 + R() * 160, 16, G.umber, 0.4) + (i === 1 ? a.stain(xa + pw / 2, Y1 - 60, 22, G.blood, 0.6) : '') });
  }
  // blood handprint and a deep axe gash
  const hand = `<g fill="${G.blood}" opacity="0.9"><path d="M272 300 C268 314 272 328 280 334 C286 338 296 334 298 326 C300 316 294 304 286 300 Z"/><path d="M274 300 L268 278 L272 276 L278 298 Z"/><path d="M280 298 L278 270 L283 270 L285 297 Z"/><path d="M286 300 L288 272 L293 273 L291 301 Z"/><path d="M292 304 L300 284 L304 286 L296 306 Z"/></g>` + a.drips(274, 296, 332, 4, 44, 2.4);
  a.raw(hand + a.gash(250, 420, 330, 470, 7, { rim: G.wood, drip: false }) + a.gash(300, 196, 336, 236, 4, { rim: G.wood, drip: false }));
  // three iron strap hinges with knuckles on the far edge and nail heads
  for (const yS of [232, 380, 528]) {
    const a0 = P4(X0 + 4, yS), a1 = P4(X1 + 6, yS);
    a.shape({ d: poly([[a0[0], a0[1] - 9], [a1[0], a1[1] - 9], [a1[0] + 6, a1[1] - 4], [a1[0] + 6, a1[1] + 5], [a1[0], a1[1] + 9], [a0[0] + 12, a0[1] + 9], [a0[0], a0[1] + 3]]), fill: G.iron, depth: 6, grime: 0.5,
      spec: [`M${a0[0] + 8} ${a0[1] - 6} L${a1[0] - 10} ${a1[1] - 6}`], decals: a.stain((a0[0] + a1[0]) / 2, yS + 4, 14, G.rust, 0.6) });
    a.shape({ d: smooth([[a1[0] + 2, a1[1] - 12], [a1[0] + 12, a1[1] - 10], [a1[0] + 12, a1[1] + 10], [a1[0] + 2, a1[1] + 12]], true, 0.6), fill: G.iron, depth: 4 });
    let nails = '';
    for (let k = 0; k < 6; k++) { const p = P4(X0 + 18 + k * 21, yS); nails += a.rivet(p[0], p[1], 1.9); }
    a.raw(nails);
  }
  // ring handle, its boss, the keyhole plate, and the company's red rubric strip tied to the ring
  a.raw(`<circle cx="252" cy="304" r="5" fill="${G.iron}" stroke="${INK}" stroke-width="1"/>`);
  a.raw(`<ellipse cx="252" cy="322" rx="9" ry="14" fill="none" stroke="${INK}" stroke-width="5.2"/><ellipse cx="252" cy="322" rx="9" ry="14" fill="none" stroke="${G.iron}" stroke-width="3.2"/>`);
  a.shape({ d: poly([[236, 352], [248, 351], [249, 380], [237, 381]]), fill: G.iron, depth: 3, core: false, ink: 1, after: `<path d="M242 360 L242 372" stroke="${G.black}" stroke-width="2.4"/><circle cx="242" cy="359" r="2.2" fill="${G.black}"/>` });
  a.shape({ d: smooth([[248, 334], [258, 334], [262, 370], [256, 402], [250, 396], [252, 368]], true, 0.6), fill: G.redD, depth: 5, mottle: 0.6, core: false, lines: ['M254 340 C256 360 255 380 253 396'] });
  // two broken arrows stuck in the planks
  a.limb([[310, 290], [348, 276]], [3.2, 3], { fill: G.wood, depth: 2, core: false, ink: 1, after: `<path d="M346 274 L354 270 M348 278 L356 280 M347 276 L355 275" stroke="${INK}" stroke-width="0.9"/>` });
  a.limb([[282, 450], [330, 472]], [3.2, 3], { fill: G.wood, depth: 2, core: false, ink: 1 });
}
a.layer('head', [230, 160]);
// ---------------------------------------------------------------- aventail, face, open bascinet
{
  let sc = [];
  for (let i = 0; i <= 8; i++) { const x = 182 + i * 10.5; sc.push([x, 192 + (i % 2 ? 5 : 0)]); }
  a.shape({ d: smooth([[196, 136], [252, 140], [266, 168], ...sc.reverse(), [178, 170]], true, 0.6), fill: G.steel, tex: 'url(#mail)', depth: 14, mottle: 0.6, decals: a.stain(240, 172, 10, G.rust, 0.5) + a.stain(206, 176, 9, G.blood, 0.5) });
  // face in profile, facing right: heavy brow, nose broken more than once, stubble, cold eye
  a.shape({ d: smooth([[232, 90], [252, 88], [262, 96], [266, 104], [272, 116], [266, 120], [266, 128], [262, 132], [264, 138], [256, 148], [240, 150], [230, 140]], true, 0.6),
    fill: G.flesh, depth: 16, mottle: 0.8, grime: 0.35, hatch: 70,
    lines: [{ d: 'M258 100 C262 102 264 104 266 106', w: 1.4 }, { d: 'M262 126 L256 127', w: 1 }, { d: 'M246 130 C250 134 252 138 252 142', w: 0.7 }],
    decals: a.stain(252, 140, 14, '#4a3a30', 0.6) + a.stain(246, 128, 10, '#4a3a30', 0.4) + `<path d="M244 112 L258 124" stroke="${G.bloodL}" stroke-width="1.3"/>` + a.stain(262, 116, 5, G.blood, 0.5) });
  a.raw(`<path d="M252 104 C255 102 259 102 261 104 C259 106 255 107 252 104 Z" fill="#e4d8bc" stroke="${INK}" stroke-width="0.8"/><circle cx="257.6" cy="104.2" r="1.5" fill="#2a1f18"/><path d="M250 99 C255 96 261 97 265 101" stroke="${INK}" stroke-width="2.2" fill="none"/>`);
  // bascinet: rounded skull rising to a point at the back, open face, a riveted brow band, a dented crown
  const helm = 'M200 150 C192 128 192 104 200 84 C206 66 214 52 210 40 C224 48 242 60 254 74 C262 82 266 90 266 96 L256 92 C246 86 236 86 230 90 C228 110 230 130 236 152 C224 156 210 156 200 150 Z';
  a.shape({ d: helm, fill: G.steel, depth: 26, mottle: 0.75, grime: 0.3, hatch: 55,
    lines: ['M204 96 C222 92 244 90 262 94', 'M206 102 C224 98 244 96 258 98', { d: 'M220 64 L230 78', w: 0.9 }, { d: 'M234 110 C236 124 238 138 240 150', w: 0.9 }],
    spec: ['M204 92 C202 110 202 128 206 142', 'M214 58 C224 60 236 66 244 72'],
    decals: a.stain(214, 126, 14, G.rust, 0.55) + a.stain(240, 78, 8, G.rust, 0.5) + a.rake(208, 70, 0.9, 20, 3, 4, 1.8) + a.drips(204, 226, 146, 3, 30, 2),
    after: [[210, 98], [222, 96], [236, 95], [250, 95]].map(([x, y]) => a.rivet(x, y, 1.6)).join('') });
}
// ---------------------------------------------------------------- the company's lead ostium badge on a cord
a.raw(`<path d="M234 176 C242 196 248 214 250 228" stroke="${G.leatherD}" stroke-width="1.6" fill="none"/><circle cx="251" cy="234" r="7" fill="#7a7c7a" stroke="${INK}" stroke-width="1.1"/><path d="M248 238 L248 230 C248 227 254 227 254 230 L254 238" stroke="${INK}" stroke-width="0.9" fill="none"/>`);
a.layer('arm', [176, 208]);
// ---------------------------------------------------------------- near arm hanging, fist around the mace haft
{
  // mace: pommel above the fist, haft angled forward-down, flanged head at knee height
  const top = [150, 352], head = [122, 520];
  a.shape({ d: limb([top, [136, 436], head], [8, 8.5, 9]), fill: G.wood, depth: 4, hatch: 64, tex: 'url(#grain)', texOp: 0.5,
    lines: [ln([[142, 380], [152, 382]]), ln([[140, 388], [150, 390]]), ln([[139, 396], [149, 398]])], decals: a.stain(130, 470, 6, G.blood, 0.8) + a.drips(128, 134, 476, 2, 24, 2) });
  a.shape({ d: smooth([[144, 342], [156, 340], [158, 352], [150, 358], [143, 352]]), fill: G.iron, depth: 4 });
  a.limb([[118, 498], [128, 470]], [11, 8], {fill: G.iron, depth: 4, core: false });
  // flanged head: seven flanges; three on the silhouette
  const cx = 118, cy = 540, ang = Math.atan2(cy - 436, cx - 136) - Math.PI / 2;
  const fl = (pts) => rot(pts, cx, cy, ang);
  a.shape({ d: smooth(fl([[cx - 8, cy - 26], [cx - 24, cy - 18], [cx - 26, cy + 8], [cx - 18, cy + 24], [cx - 6, cy + 24]]), true, 0.3), fill: G.steelD, depth: 6, grime: 0.3, decals: a.stain(cx - 16, cy, 8, G.blood, 0.7) });
  a.shape({ d: smooth(fl([[cx + 8, cy - 26], [cx + 24, cy - 18], [cx + 26, cy + 8], [cx + 18, cy + 24], [cx + 6, cy + 24]]), true, 0.3), fill: G.steel, depth: 6, grime: 0.3, decals: a.splat(cx + 16, cy + 4, 6, { drops: 4 }) });
  a.shape({ d: smooth(fl([[cx - 9, cy - 30], [cx + 9, cy - 30], [cx + 10, cy + 24], [cx, cy + 34], [cx - 10, cy + 24]]), true, 0.4), fill: G.steel, depth: 8, grime: 0.35,
    spec: [ln(fl([[cx - 4, cy - 24], [cx - 4, cy + 16]]))], decals: a.splat(cx + 2, cy + 6, 9, { drops: 6 }) + a.stain(cx - 2, cy - 14, 6, G.rust, 0.6) });
  let hair = '';
  for (let i = 0; i < 18; i++) { const x0 = cx - 10 + R() * 22, y0 = cy + R() * 22; hair += `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} C${(x0 + (R() - 0.5) * 10).toFixed(1)} ${(y0 + 10).toFixed(1)} ${(x0 + (R() - 0.5) * 12).toFixed(1)} ${(y0 + 20).toFixed(1)} ${(x0 + (R() - 0.5) * 16).toFixed(1)} ${(y0 + 30 + R() * 12).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.55"/>`; }
  a.raw(hair + a.drip(cx + 2, cy + 34, 22, 3) + a.drip(cx - 8, cy + 28, 14, 2.2) + `<circle cx="${cx}" cy="${cy + 92}" r="2" fill="${G.blood}"/><circle cx="${cx - 2}" cy="${cy + 118}" r="2.4" fill="${G.blood}"/>`);
  // upper arm (mail sleeve under rerebrace), couter, vambrace, gauntlet
  a.limb([[176, 208], [166, 250], [158, 290]], [36, 32, 28], {fill: G.steel, tex: 'url(#mail)', depth: 12, hatch: 30 });
  a.limb([[172, 222], [164, 254], [160, 278]], [28, 26, 22], {fill: G.steel, depth: 10, mottle: 0.6, hatch: 30, lines: ['M160 236 L180 238', { d: 'M156 256 L170 258', w: 0.7 }], spec: ['M156 232 C154 250 152 262 150 274'] });
  a.limb([[158, 296], [154, 330], [151, 358]], [28, 26, 22], {fill: G.steel, depth: 10, mottle: 0.6, hatch: 75, lines: ['M142 318 L166 318'], spec: ['M146 300 C144 320 143 336 142 350'], decals: a.stain(154, 336, 8, G.blood, 0.6) });
  a.shape({ d: smooth([[142, 282], [158, 274], [174, 284], [174, 304], [158, 312], [142, 302]]), fill: G.steelL, depth: 9, spec: ['M148 284 C152 280 158 279 162 280'], after: a.rivet(158, 294) });
  a.shape({ d: smooth([[140, 288], [128, 282], [124, 298], [132, 310], [142, 304]]), fill: G.steel, depth: 5 });
  a.shape({ d: smooth([[138, 358], [164, 352], [168, 366], [140, 372]], true, 0.6), fill: '#b9ab8c', depth: 7, grime: 0.5, lines: ['M140 362 L166 358', 'M141 367 L166 362'], decals: a.stain(150, 364, 6, G.blood, 0.7) });
  a.shape({ d: smooth([[134, 368], [150, 362], [164, 366], [166, 384], [158, 396], [140, 396], [132, 384]], true, 0.7), fill: G.steel, depth: 10, mottle: 0.5,
    lines: ['M136 374 C146 376 156 376 164 374', 'M134 382 C144 386 156 386 164 384', 'M136 390 C146 392 154 392 160 390'], spec: ['M140 368 L150 366'], decals: a.splat(154, 384, 5, { drops: 3 }) });
  a.shape({ d: smooth([[160, 368], [170, 364], [174, 376], [166, 382]]), fill: G.steelL, depth: 4, core: false });
  // pauldron: cop + two lames
  a.shape({ d: smooth([[150, 232], [190, 228], [212, 234], [206, 248], [168, 252], [150, 246]], true, 0.6), fill: G.steelD, depth: 7, mottle: 0.5 });
  a.shape({ d: smooth([[146, 220], [192, 214], [216, 222], [210, 238], [170, 242], [148, 236]], true, 0.6), fill: G.steel, depth: 7, mottle: 0.5, after: a.rivet(160, 232) + a.rivet(204, 230) });
  a.shape({ d: smooth([[152, 190], [180, 172], [210, 180], [218, 206], [204, 224], [164, 228], [146, 212]], true, 0.8), fill: G.steel, depth: 22, mottle: 0.7, grime: 0.3, hatch: 40,
    lines: ['M158 202 C172 198 196 198 216 206', { d: 'M176 184 L184 194', w: 0.8 }], spec: ['M160 192 C170 182 184 178 196 180'],
    decals: a.stain(190, 216, 12, G.rust, 0.6) + a.rake(168, 190, 0.5, 26, 3, 5, 2.2),
    after: a.rivet(168, 216) + a.rivet(200, 214) + a.rivet(188, 182) });
}
require('fs').writeFileSync('grim/bulwark_bible.svg', a.svg());

