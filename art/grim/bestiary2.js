// Rigged bestiary, humanoids. Each enemy writes layered SVGs + a rig json into grim/rig/.
// Usage: node grim/bestiary2.js [name ...]   (no args = all)
const { Art, G, INK, smooth, limb, poly, blob } = require('../gr');
const only = process.argv.slice(2);
const E = {};
const ground = (a, x, rx) => { a.layer('shadow'); a.raw(a.ground(x, a.h - 24, rx, 10)); };

E.siren = () => {
  const a = new Art(460, 700, 411), B = require('./body')(a), P = B.P, skin = '#a3ad9e';
  ground(a, 230, 130);
  a.layer('legs', [240, 480]);
  a.shape({ d: smooth([[150, 676], [170, 600], [232, 576], [300, 590], [330, 640], [326, 676]], true, 0.6), fill: G.steelD, depth: 30, mottle: 0.6, hatch: 40, decals: P.barnacles(200, 600, 10, 22) + a.stain(250, 640, 20, G.algae, 0.6) });
  a.limb([[236, 440], [268, 520], [296, 600], [262, 640], [204, 648], [160, 630]], [62, 58, 50, 40, 30, 20], { fill: '#5f7d74', tex: 'url(#mail)', texOp: 0.5, depth: 18, mottle: 0.5, fine: true, hatch: 60, decals: a.gash(250, 600, 280, 610, 5, { rim: '#c08070', dripLen: 14 }) });
  a.shape({ d: smooth([[164, 628], [120, 600], [100, 616], [118, 634], [96, 648], [110, 664], [160, 642]], true, 0.4), fill: '#7d9a8e', depth: 8, core: false, lines: ['M160 634 L110 606', 'M160 636 L104 640', 'M158 640 L112 660'] });
  a.layer('back', [208, 206]);
  B.arm({ sh: [208, 210], el: [158, 256], wr: [118, 268], fill: skin, handDir: [-1, 0.1], claws: true, hatch: 130 });
  a.layer('body', [236, 440]);
  B.torso({ fsh: [204, 204], nsh: [266, 208], wl: [214, 340], wr: [258, 338], hl: [210, 450], hr: [266, 448], fill: skin, bare: true, decals: P.ribs(232, 300, 40, 60, 5) + a.stain(250, 420, 18, '#5f7d74', 0.7) + P.barnacles(258, 230, 6, 8) });
  a.layer('head', [230, 196]);
  a.shape({ d: smooth([[214, 110], [252, 104], [272, 150], [282, 260], [270, 330], [256, 260], [240, 170]], true, 0.6), fill: G.black, depth: 10, core: false, lines: ['M252 120 C262 180 266 240 262 310', 'M262 126 C274 180 276 240 274 300'], lineCol: '#4a4038' });
  a.limb([[236, 210], [222, 186]], [26, 22], { fill: skin, depth: 7, mottle: 0.5, fine: true, hatch: 110 });
  B.head({ x: 206, y: 150, k: 1.08, skin, style: 'drowned', jaw: 1, eye: 'glint' });
  a.raw([[196, 104], [210, 98], [224, 98]].map(([x, y]) => P.hook(x, y - 18, 0.5)).join(''));
  a.layer('arm', [262, 212]);
  B.arm({ sh: [262, 212], el: [292, 168], wr: [284, 122], fill: skin, handDir: [-0.2, -1], hatch: 120 });
  a.shape({ d: smooth([[268, 52], [296, 48], [308, 72], [298, 96], [272, 98], [260, 76]], true, 0.9), fill: G.goldL, depth: 8, ink: 1.4, after: `<ellipse cx="284" cy="73" rx="14" ry="18" fill="#b9c8c4"/><path d="M276 62 L286 74 L280 88 M286 74 L296 70" stroke="${INK}" stroke-width="0.7" fill="none"/>` });
  a.shape({ d: poly([[282, 98], [288, 98], [286, 116], [282, 116]]), fill: G.gold, depth: 2, core: false, ink: 0.9 });
  return [a, { idle: 'sway', attack: 'claw', cast: 'raise', hand: [118, 268] }];
};

E.eelkin = () => {
  const a = new Art(460, 700, 421), B = require('./body')(a), P = B.P, hide = '#46523f';
  ground(a, 240, 140);
  a.layer('legs', [250, 470]);
  a.limb([[250, 450], [290, 540], [300, 620], [250, 660], [170, 656], [130, 630], [150, 602], [190, 612]], [66, 62, 56, 48, 40, 30, 20, 12], { fill: hide, depth: 20, mottle: 0.5, fine: true, hatch: 60, spec: ['M276 510 C296 560 300 600 286 630'], specOp: 0.3 });
  a.layer('back', [214, 220]);
  B.arm({ sh: [214, 226], el: [176, 286], wr: [140, 300], fill: hide, handDir: [-1, 0.2], claws: true, hatch: 130, w: 0.85 });
  a.layer('body', [250, 450]);
  a.shape({ d: smooth([[276, 230], [306, 250], [318, 300], [312, 380], [300, 440], [290, 400], [290, 300]], true, 0.5), fill: '#5a4a3a', depth: 6, core: false, lines: ['M290 250 L310 280', 'M292 280 L314 310', 'M292 310 L312 340', 'M292 340 L306 370'] });
  B.torso({ fsh: [214, 220], nsh: [276, 222], wl: [220, 350], wr: [274, 346], hl: [222, 456], hr: [282, 452], fill: hide, bare: true, decals: a.stain(240, 400, 18, '#6a7a50', 0.5) + `<path d="M222 260 C226 320 230 380 228 450" stroke="#a8a888" stroke-width="10" opacity="0.5"/>` });
  a.layer('head', [236, 210]);
  a.limb([[244, 228], [222, 196]], [40, 34], { fill: hide, depth: 10, mottle: 0.5, fine: true, hatch: 80, decals: `<path d="M230 200 C234 210 234 220 230 228 M238 198 C242 208 242 218 238 226" stroke="${G.bloodD}" stroke-width="1.6" fill="none"/>` });
  a.shape({ d: smooth([[150, 176], [180, 154], [222, 150], [246, 170], [244, 206], [222, 222], [180, 220], [156, 206]], true, 0.6), fill: hide, depth: 20, mottle: 0.5, fine: true, hatch: 90,
    decals: `<path d="M180 160 C200 156 220 158 236 168 L232 182 C214 176 196 176 180 178 Z" fill="${G.black}" opacity="0.4"/>` + P.eye(204, 172, 3.6, '#d8d060') });
  a.raw(`<ellipse cx="160" cy="196" rx="17" ry="21" fill="#7a2a24" stroke="${INK}" stroke-width="1.4"/><ellipse cx="160" cy="196" rx="9" ry="12" fill="${G.black}"/>` +
    Array.from({ length: 16 }, (_, i) => { const t = i / 16 * Math.PI * 2; return `<path d="M${(160 + Math.cos(t) * 15).toFixed(1)} ${(196 + Math.sin(t) * 18).toFixed(1)} L${(160 + Math.cos(t) * 9.5).toFixed(1)} ${(196 + Math.sin(t) * 12).toFixed(1)}" stroke="${G.bone}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('') + P.drool(156, 218, 22, '#c0a090'));
  a.layer('arm', [270, 226]);
  B.arm({ sh: [270, 228], el: [262, 300], wr: [208, 314], fill: hide, handDir: [-1, -0.3], hatch: 120, w: 0.85 });
  a.shape({ d: 'M200 304 L150 262 L146 268 L156 276 L150 282 L164 292 L160 298 L196 318 Z', fill: G.bone, depth: 4, core: false, ink: 1, decals: a.stain(160, 280, 6, G.blood, 0.8) });
  return [a, { idle: 'coil', attack: 'stab', hand: [150, 270] }];
};

E.bellringer = () => {
  const a = new Art(460, 700, 431), B = require('./body')(a), P = B.P;
  ground(a, 230, 120);
  a.layer('body', [232, 420]);
  B.rag([194, 214], [272, 210], 664, '#38322e', { n: 12, amp: 20, flare: 40, depth: 40, decals: a.stain(230, 600, 30, G.algae, 0.55) + P.barnacles(280, 560, 8, 14) });
  for (const [y0, y1] of [[320, 350], [420, 450]]) { let c = ''; for (let i = 0; i < 14; i++) { const t = i / 13, x = 160 + 140 * t, y = y0 + (y1 - y0) * t; c += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="3" transform="rotate(${i % 2 ? 70 : 10} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="3" transform="rotate(${i % 2 ? 70 : 10} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${G.rust}" stroke-width="1.3"/>`; } a.raw(c); }
  a.layer('back', [204, 226]);
  B.arm({ sh: [204, 230], el: [182, 310], wr: [180, 374], fill: '#38322e', fore: '#38322e', handSkin: G.boneD, handDir: [0, 1], hatch: 40 });
  a.raw(Array.from({ length: 8 }, (_, i) => `<path d="M${172 + i * 2.5} ${400 + i * 4} l2 5 l2 -5 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.5"/>`).join(''));
  a.layer('head', [222, 214]);
  B.head({ x: 206, y: 160, k: 1.1, style: 'skull', jaw: 0.5 });
  a.shape({ d: smooth([[168, 168], [190, 116], [236, 108], [268, 136], [274, 200], [264, 230], [246, 214], [246, 160], [222, 134], [196, 140], [186, 190], [188, 226], [168, 222]], true, 0.6), fill: '#2e2824', depth: 14, mottle: 0.5, hatch: 30 });
  a.layer('arm', [262, 222]);
  B.arm({ sh: [262, 224], el: [290, 168], wr: [272, 118], fill: '#38322e', fore: '#38322e', handSkin: G.boneD, handDir: [0, -1], hatch: 120 });
  a.shape({ d: poly([[270, 100], [278, 100], [278, 82], [270, 82]]), fill: G.woodD, depth: 2, core: false, ink: 1 });
  a.shape({ d: smooth([[252, 82], [274, 42], [296, 82], [300, 86], [248, 86]], true, 0.5), fill: G.gold, depth: 12, mottle: 0.6, ink: 1.3, decals: a.stain(268, 66, 10, '#4f7f6a', 0.8), after: `<path d="M270 86 L266 100 L272 102 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.7"/>` });
  return [a, { idle: 'sway', attack: 'ring', hand: [274, 60] }];
};

E.barnacle_knight = () => {
  const a = new Art(480, 720, 441), B = require('./body')(a), P = B.P, st = G.steelD;
  ground(a, 240, 150);
  a.layer('legs', [240, 420]);
  B.leg({ hip: [222, 412], knee: [200, 540], ankle: [194, 662], fill: G.iron, shin: st, footFill: st, boot: true, hatch: 60, shinDecals: P.barnacles(198, 600, 8, 12) + a.stain(196, 620, 12, G.rust, 0.7) });
  B.leg({ hip: [266, 412], knee: [282, 542], ankle: [274, 664], fill: G.iron, shin: st, footFill: st, boot: true, hatch: 120, shinDecals: a.stain(280, 600, 12, G.rust, 0.7) });
  for (const [x, y] of [[200, 540], [282, 542]]) a.shape({ d: smooth([[x - 20, y - 14], [x + 14, y - 18], [x + 22, y + 4], [x + 6, y + 18], [x - 18, y + 14]], true, 0.6), fill: st, depth: 8, mottle: 0.5, decals: P.barnacles(x, y, 4, 8) });
  a.layer('body', [240, 420]);
  a.shape({ d: smooth([[204, 392], [282, 388], [298, 470], [270, 490], [244, 470], [216, 494], [192, 474]], true, 0.5), fill: G.iron, tex: 'url(#mail)', depth: 14, hatch: 80, decals: a.stain(240, 450, 20, G.rust, 0.6) });
  B.torso({ fsh: [196, 220], nsh: [286, 222], wl: [204, 340], wr: [280, 338], hl: [204, 400], hr: [284, 398], fill: st, hatch: 110, lines: ['M240 230 L238 396'],
    decals: P.barnacles(266, 270, 16, 22) + P.barnacles(212, 350, 8, 14) + a.stain(230, 300, 24, G.algae, 0.5) + a.stain(266, 360, 24, G.rust, 0.7) });
  a.layer('back', [204, 230]);
  B.arm({ sh: [204, 236], el: [178, 314], wr: [196, 376], fill: st, fore: st, handSkin: G.iron, handDir: [0.4, 1], hatch: 60, w: 1.1 });
  a.layer('head', [242, 214]);
  a.shape({ d: smooth([[206, 130], [236, 112], [272, 116], [290, 142], [290, 200], [270, 218], [222, 218], [204, 198]], true, 0.6), fill: st, depth: 24, mottle: 0.5, hatch: 90, spec: ['M214 146 C212 164 212 182 216 198'],
    decals: `<path d="M204 164 L290 162 L290 172 L204 174 Z" fill="${G.black}"/><ellipse cx="232" cy="168" rx="5" ry="2.4" fill="#d8dcd0"/><circle cx="230" cy="168" r="1.3" fill="${G.black}"/>` + P.barnacles(266, 132, 9, 12) + a.stain(246, 196, 12, G.tealD, 0.6) + a.stain(276, 190, 12, G.rust, 0.7) });
  a.raw(a.drip(226, 174, 18, 1.8, '#5a6a50') + P.weed(276, 124, 80, 1, '#4f5f3a') + `<path d="M240 116 C236 92 224 84 228 68 M240 116 C246 98 258 90 254 72 M234 92 L222 86 M248 96 L262 90" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M240 116 C236 92 224 84 228 68 M240 116 C246 98 258 90 254 72 M234 92 L222 86 M248 96 L262 90" stroke="#c87060" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  for (const [x] of [[196], [290]]) a.shape({ d: smooth([[x - 30, 232], [x - 4, 208], [x + 26, 214], [x + 32, 246], [x, 262], [x - 28, 256]], true, 0.6), fill: st, depth: 14, mottle: 0.5, hatch: 80, decals: P.barnacles(x, 228, 7, 12) });
  a.layer('arm', [286, 232]);
  a.shape({ d: poly([[150, 140], [164, 138], [166, 300], [160, 316], [150, 300]]), fill: G.steelD, depth: 5, mottle: 0.6, ink: 1.2, spec: ['M156 150 L156 296'], decals: a.stain(158, 200, 8, G.rust, 0.8) + a.stain(156, 260, 8, G.blood, 0.6) });
  a.shape({ d: poly([[128, 310], [188, 306], [188, 316], [128, 320]]), fill: G.iron, depth: 3, core: false, ink: 1.1 });
  a.shape({ d: poly([[152, 320], [162, 320], [162, 372], [152, 372]]), fill: G.leatherD, depth: 3, core: false, ink: 1 });
  B.arm({ sh: [286, 236], el: [264, 312], wr: [176, 344], fill: st, fore: st, handSkin: G.iron, handDir: [-0.2, 1], hatch: 120, w: 1.1 });
  return [a, { idle: 'heavy', attack: 'cleave', hand: [156, 150] }];
};

E.bloated = () => {
  const a = new Art(480, 700, 451), B = require('./body')(a), P = B.P, skin = '#8f9a78';
  ground(a, 240, 150);
  a.layer('legs', [240, 520]);
  B.leg({ hip: [206, 520], knee: [196, 590], ankle: [192, 646], fill: skin, w: 1.3, hatch: 60 });
  B.leg({ hip: [286, 520], knee: [296, 592], ankle: [292, 648], fill: skin, w: 1.3, hatch: 120 });
  a.layer('back', [180, 300]);
  B.arm({ sh: [186, 300], el: [146, 370], wr: [138, 430], fill: skin, w: 1.05, handDir: [0, 1], hatch: 60 });
  a.layer('body', [240, 520]);
  const veins = `<g stroke="#5b5468" stroke-width="1.2" fill="none" opacity="0.85">` + Array.from({ length: 8 }, () => { const x = 160 + a.R() * 170, y = 330 + a.R() * 200; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} C${(x + 14).toFixed(1)} ${(y + 10).toFixed(1)} ${(x + 6).toFixed(1)} ${(y + 24).toFixed(1)} ${(x + 22).toFixed(1)} ${(y + 34).toFixed(1)}"/>`; }).join('') + `</g>`;
  a.shape({ d: smooth([[190, 270], [290, 262], [342, 330], [364, 430], [340, 520], [290, 560], [196, 562], [138, 500], [134, 400], [160, 320]], true, 0.8), fill: skin, depth: 60, mottle: 0.5, fine: true, hatch: 110,
    decals: veins + `<path d="M236 360 C256 400 262 450 250 520 C236 470 226 420 236 360 Z" fill="${G.black}"/><path d="M238 366 C252 404 258 450 250 510" stroke="#b84a3a" stroke-width="3" fill="none"/><path d="M234 380 C226 420 232 470 248 516" stroke="#e0d090" stroke-width="2.2" fill="none"/>` + a.stain(300, 480, 30, G.bruise, 0.55) + a.stain(190, 520, 24, '#5f6a40', 0.5) + P.barnacles(330, 470, 6, 12),
    over: a.drip(248, 520, 30, 3, '#7a5a30') + P.drool(242, 500, 40, '#c8d080') });
  a.raw(P.flies(330, 320, 10, 80) + [[244, 410, 4], [240, 440, 3], [252, 470, 2.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c8d080" stroke="${INK}" stroke-width="0.6"/>`).join(''));
  a.layer('head', [236, 270]);
  B.head({ x: 216, y: 226, k: 1.2, skin, style: 'bloated', jaw: 0.8, eye: 'milky' });
  a.layer('arm', [310, 300]);
  B.arm({ sh: [310, 300], el: [350, 380], wr: [338, 442], fill: skin, w: 1.05, handDir: [-0.2, 1], hatch: 120 });
  return [a, { idle: 'wobble', attack: 'slam', hand: [200, 300] }];
};

E.hookline = () => {
  const a = new Art(460, 700, 461), B = require('./body')(a), P = B.P, oil = '#62622e', skin = '#9aa596';
  ground(a, 240, 130);
  a.layer('legs', [236, 420]);
  B.leg({ hip: [216, 420], knee: [200, 540], ankle: [196, 646], fill: oil, shin: G.black, footFill: G.black, boot: true, hatch: 60 });
  B.leg({ hip: [260, 420], knee: [276, 542], ankle: [268, 648], fill: oil, shin: G.black, footFill: G.black, boot: true, hatch: 120 });
  a.layer('back', [206, 226]);
  B.arm({ sh: [206, 230], el: [168, 290], wr: [142, 280], fill: oil, handSkin: skin, handDir: [-1, -0.4], hatch: 60 });
  a.shape({ d: limb([[150, 330], [140, 220], [132, 160]], [7, 7, 6]), fill: G.woodD, depth: 3, core: false, tex: 'url(#grain)' });
  a.raw(`<path d="M132 162 L128 130 C126 112 104 112 104 128 L108 136" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M132 162 L128 130 C126 112 104 112 104 128 L108 136" fill="none" stroke="${G.steelD}" stroke-width="3.2" stroke-linecap="round"/>` + a.drip(108, 136, 18, 2.2));
  a.layer('body', [236, 420]);
  B.rag([202, 226], [278, 222], 520, oil, { n: 9, amp: 16, flare: 20, depth: 36, decals: a.stain(240, 460, 20, G.algae, 0.55) + a.stain(270, 380, 14, G.blood, 0.5) + P.barnacles(290, 420, 6, 10) });
  a.raw(`<path d="M196 330 C230 340 270 340 300 330" stroke="${G.leatherD}" stroke-width="6" fill="none"/>`);
  { let line = ''; for (let k = 0; k < 4; k++) line += `<ellipse cx="${272 + k * 2}" cy="${270 + k * 3}" rx="${30 - k * 2}" ry="${42 - k * 3}" transform="rotate(-25 ${272 + k * 2} ${270 + k * 3})" fill="none" stroke="${INK}" stroke-width="2"/><ellipse cx="${272 + k * 2}" cy="${270 + k * 3}" rx="${30 - k * 2}" ry="${42 - k * 3}" transform="rotate(-25 ${272 + k * 2} ${270 + k * 3})" fill="none" stroke="#c8bc98" stroke-width="0.8"/>`; a.raw(line + P.hook(296, 300, 0.7) + P.hook(250, 320, 0.6)); }
  a.layer('head', [226, 212]);
  B.head({ x: 212, y: 176, k: 1.1, skin, style: 'drowned', jaw: 0.2, eye: 'milky' });
  a.raw(`<g stroke="#d8ccaa" stroke-width="0.7" fill="none" opacity="0.9">` + Array.from({ length: 10 }, (_, i) => `<path d="M${180 + i * 7} 140 C${184 + i * 6} 170 ${178 + i * 7} 196 ${184 + i * 6} 218"/>`).join('') + `</g>` + P.hook(190, 176, 0.5) + P.hook(212, 190, 0.5) + a.drip(196, 196, 12, 1.6));
  a.shape({ d: smooth([[170, 154], [198, 116], [246, 110], [282, 132], [298, 168], [284, 172], [262, 146], [210, 146], [190, 164]], true, 0.6), fill: oil, depth: 12, mottle: 0.5, hatch: 40 });
  a.layer('arm', [270, 230]);
  B.arm({ sh: [272, 232], el: [296, 310], wr: [286, 372], fill: oil, handSkin: skin, handDir: [0, 1], hatch: 120 });
  a.raw([0, 1, 2, 3].map(i => `<path d="M${286 + i * 3} 396 L${280 + i * 8} ${428 + i * 10}" stroke="#c8bc98" stroke-width="0.8"/>` + P.hook(280 + i * 8, 428 + i * 10, 0.45)).join(''));
  return [a, { idle: 'sway', attack: 'reel', hand: [106, 130] }];
};

E.weeping_nun = () => {
  const a = new Art(460, 700, 471), B = require('./body')(a), P = B.P, skin = '#a8b0a4';
  ground(a, 230, 120);
  a.layer('body', [232, 430]);
  B.rag([196, 222], [266, 220], 664, '#2c2a2c', { n: 12, amp: 14, flare: 34, depth: 40, decals: a.stain(230, 620, 30, '#c8c4b8', 0.4) + a.stain(250, 560, 18, G.algae, 0.5) + P.barnacles(272, 600, 7, 12) });
  a.shape({ d: smooth([[214, 236], [250, 234], [256, 330], [252, 520], [216, 524], [210, 330]], true, 0.4), fill: '#cfc8b4', depth: 12, mottle: 0.6, fine: true, hatch: 70, decals: a.stain(232, 300, 14, G.bloodD, 0.6) + a.stain(236, 440, 18, G.algae, 0.6) + `<path d="M232 260 L232 300 M220 276 L244 276" stroke="${G.bloodD}" stroke-width="3"/>` });
  a.layer('head', [230, 220]);
  B.head({ x: 214, y: 176, k: 1.05, skin, style: 'drowned', jaw: 0.1, eye: 'socket' });
  a.raw(`<path d="M196 178 C194 196 198 210 196 226 M200 180 C202 194 200 208 204 222" stroke="${G.bone}" stroke-width="2.4" fill="none"/>` + P.drool(198, 228, 18, '#d8e4e0'));
  a.shape({ d: smooth([[178, 166], [198, 124], [240, 116], [270, 140], [282, 196], [292, 262], [272, 270], [262, 212], [254, 164], [222, 142], [200, 156], [190, 210], [172, 230]], true, 0.6), fill: '#2c2a2c', depth: 12, mottle: 0.5, hatch: 30 });
  a.shape({ d: smooth([[192, 136], [232, 126], [262, 140], [258, 148], [226, 138], [196, 146]], true, 0.4), fill: '#cfc8b4', depth: 3, core: false, ink: 0.9 });
  a.layer('arm', [232, 240]);
  B.arm({ sh: [206, 244], el: [190, 300], wr: [196, 346], fill: '#2c2a2c', handSkin: skin, handDir: [1, 0.2], hatch: 40 });
  B.arm({ sh: [262, 244], el: [282, 300], wr: [266, 348], fill: '#2c2a2c', handSkin: skin, handDir: [-1, 0.2], hatch: 120 });
  a.shape({ d: smooth([[176, 340], [284, 340], [276, 368], [236, 380], [186, 368]], true, 0.6), fill: G.iron, depth: 10, mottle: 0.6, ink: 1.2, decals: a.stain(220, 360, 12, G.rust, 0.7) });
  a.raw(`<ellipse cx="230" cy="341" rx="52" ry="7" fill="#5f8a8a" stroke="${INK}" stroke-width="0.9"/>` + a.drip(186, 366, 22, 2.2, '#5f8a8a') + a.drip(270, 366, 16, 2, '#5f8a8a'));
  return [a, { idle: 'sway', attack: 'raise', hand: [230, 336] }];
};

E.anchor_brute = () => {
  const a = new Art(520, 760, 481), B = require('./body')(a), P = B.P, skin = '#8a9488';
  ground(a, 270, 170);
  a.layer('legs', [270, 470]);
  B.leg({ hip: [238, 470], knee: [214, 600], ankle: [210, 708], fill: G.leatherD, shin: skin, footFill: skin, w: 1.45, hatch: 60, shinDecals: a.gash(210, 620, 224, 660, 5, { rim: '#b0786a', dripLen: 16 }) });
  B.leg({ hip: [300, 470], knee: [318, 600], ankle: [314, 710], fill: G.leatherD, shin: skin, footFill: skin, w: 1.45, hatch: 120 });
  a.layer('back', [210, 270]);
  B.arm({ sh: [214, 276], el: [168, 340], wr: [172, 404], fill: skin, w: 1.75, handDir: [0.2, 1], hatch: 60, foreDecals: `<circle cx="170" cy="384" r="7" fill="${G.black}"/>` + a.stain(170, 384, 10, G.blood, 0.8) });
  a.layer('body', [270, 470]);
  B.torso({ fsh: [196, 250], nsh: [346, 246], wl: [214, 400], wr: [334, 396], hl: [222, 470], hr: [324, 468], fill: skin, bare: true, depth: 40,
    decals: a.gash(226, 300, 270, 340, 8, { rim: '#c08070', dripLen: 22 }) + a.gash(300, 300, 320, 360, 6, { rim: '#c08070', dripLen: 18 }) + a.stain(280, 400, 26, G.bruise, 0.55) + P.barnacles(330, 290, 9, 16) });
  a.layer('head', [252, 236]);
  B.head({ x: 236, y: 202, k: 0.95, skin, style: 'drowned', jaw: 0.5, eye: 'milky' });
  a.layer('arm', [336, 264]);
  { let c = ''; for (let i = 0; i < 16; i++) { const t = i / 15, x = 108 + 220 * t, y = 600 - 196 * t + Math.sin(t * 3) * 14; c += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="3.6" transform="rotate(${i % 2 ? -60 : 30} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${INK}" stroke-width="3.2"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="3.6" transform="rotate(${i % 2 ? -60 : 30} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${G.iron}" stroke-width="1.6"/>`; } a.raw(c); }
  a.shape({ d: 'M96 620 L108 620 L108 700 C130 700 150 690 160 676 L150 670 L172 664 L168 688 L160 684 C146 708 118 718 102 718 C86 718 58 708 44 684 L36 688 L32 664 L54 670 L44 676 C54 690 74 700 96 700 Z', fill: G.iron, depth: 12, mottle: 0.6, ink: 1.4, decals: a.stain(100, 690, 14, G.rust, 0.8) + P.barnacles(70, 690, 6, 10) + a.splat(140, 680, 6, { drops: 5 }) });
  a.raw(`<circle cx="102" cy="604" r="12" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="102" cy="604" r="12" fill="none" stroke="${G.iron}" stroke-width="2.2"/>`);
  B.arm({ sh: [336, 270], el: [370, 350], wr: [334, 412], fill: skin, w: 1.75, handDir: [-0.6, 0.8], hatch: 120 });
  return [a, { idle: 'heavy', attack: 'swing', hand: [104, 690] }];
};

E.choirboy = () => {
  const a = new Art(400, 600, 491), B = require('./body')(a), P = B.P, skin = '#a8b4a8';
  ground(a, 200, 90);
  a.layer('body', [200, 400]);
  B.rag([168, 266], [232, 264], 566, '#5a2a24', { n: 10, amp: 8, flare: 24, depth: 30 });
  B.rag([164, 264], [236, 262], 430, '#c8c4ac', { n: 10, amp: 16, flare: 20, depth: 24, decals: a.stain(210, 380, 22, G.algae, 0.6) + a.stain(190, 300, 10, G.bloodD, 0.4) });
  a.layer('head', [200, 262]);
  B.head({ x: 192, y: 222, k: 0.92, skin, style: 'drowned', jaw: 1, eye: 'milky' });
  a.raw(`<path d="${smooth([[170, 190], [196, 176], [222, 186], [232, 206], [226, 214], [210, 196], [186, 196]], true, 0.5)}" fill="${G.black}" stroke="${INK}" stroke-width="0.8"/>` + P.weed(222, 200, 46, 1, '#4f5f3a'));
  a.layer('arm', [200, 280]);
  B.arm({ sh: [172, 282], el: [160, 330], wr: [182, 350], fill: '#c8c4ac', handSkin: skin, handDir: [1, 0], w: 0.75, hatch: 40 });
  B.arm({ sh: [228, 282], el: [242, 330], wr: [216, 350], fill: '#c8c4ac', handSkin: skin, handDir: [-1, 0], w: 0.75, hatch: 120 });
  a.shape({ d: poly([[176, 338], [226, 338], [228, 370], [178, 372]]), fill: G.leatherD, depth: 8, mottle: 0.6, decals: a.stain(200, 354, 10, G.algae, 0.7) });
  return [a, { idle: 'sway', attack: 'wail', hand: [196, 250] }];
};

E.warden = () => {
  const a = new Art(560, 800, 501), B = require('./body')(a), P = B.P, skin = '#55705f';
  ground(a, 290, 180);
  a.layer('legs', [290, 500]);
  B.leg({ hip: [262, 500], knee: [238, 634], ankle: [232, 752], fill: G.tealD, shin: skin, footFill: skin, w: 1.3, hatch: 60, thighDecals: '' });
  B.leg({ hip: [318, 500], knee: [338, 636], ankle: [330, 754], fill: G.tealD, shin: skin, footFill: skin, w: 1.3, hatch: 120 });
  a.layer('back', [240, 300]);
  B.arm({ sh: [244, 306], el: [210, 386], wr: [204, 450], fill: skin, w: 1.4, handDir: [0, 1], hatch: 60 });
  a.layer('body', [290, 500]);
  a.shape({ d: smooth([[350, 520], [430, 560], [470, 650], [440, 660], [400, 600], [360, 570]], true, 0.5), fill: '#6f8a7a', depth: 10, core: false, lines: ['M360 540 L450 640', 'M370 560 L430 650'] });
  B.rag([230, 300], [352, 296], 580, G.tealD, { n: 10, amp: 20, flare: 20, depth: 40, decals: a.stain(300, 500, 30, G.rust, 0.6) + P.barnacles(350, 360, 12, 18) });
  a.raw(P.ribs(288, 400, 90, 100, 6));
  a.limb([[262, 380], [300, 420], [290, 450], [262, 430]], [16, 14, 12, 8], { fill: '#3f4a3c', depth: 4, mottle: 0.5, fine: true, hatch: 60, after: `<circle cx="258" cy="378" r="7" fill="#7a2a24" stroke="${INK}" stroke-width="0.8"/><circle cx="258" cy="378" r="3" fill="${G.black}"/>` });
  a.raw(a.drip(270, 452, 26, 2.6) + a.drip(300, 452, 18, 2.2));
  for (const x of [230, 352]) a.shape({ d: smooth([[x - 36, 310], [x - 10, 284], [x + 26, 290], [x + 34, 320], [x, 338], [x - 30, 334]], true, 0.6), fill: '#c8b090', depth: 14, mottle: 0.5, hatch: 70, lines: [`M${x - 30} 318 C${x - 10} 300 ${x + 10} 300 ${x + 30} 312`] });
  a.layer('head', [290, 290]);
  a.shape({ d: smooth([[196, 220], [236, 180], [300, 176], [340, 210], [344, 260], [316, 296], [250, 300], [206, 280], [186, 250]], true, 0.6), fill: skin, depth: 30, mottle: 0.5, fine: true, hatch: 100,
    decals: `<path d="M210 196 C240 186 280 186 320 196 L320 216 C280 208 240 210 210 216 Z" fill="${G.black}" opacity="0.4"/>` + P.eye(256, 214, 9, '#d8c040') + `<path d="M196 254 C230 274 282 276 320 262 C300 300 230 302 196 254 Z" fill="${G.black}"/>` + P.teeth(204, 258, 316, 266, 12, 10, 1) + P.teeth(214, 284, 300, 286, 9, 8, -1) +
      `<path d="M316 214 C326 230 328 250 322 268 M328 210 C340 228 342 250 334 272" stroke="${G.bloodD}" stroke-width="2.4" fill="none"/>`, over: a.drip(324, 268, 22, 2.4) + B.P.drool(240, 292, 26) });
  a.shape({ d: smooth([[236, 186], [256, 140], [296, 130], [330, 150], [338, 190], [300, 176]], true, 0.4), fill: '#a84a3a', depth: 8, core: false, lines: ['M258 176 L264 144', 'M276 176 L284 136', 'M296 176 L306 140', 'M316 182 L326 156'] });
  a.layer('arm', [352, 306]);
  a.shape({ d: limb([[200, 780], [196, 400], [190, 120]], [9, 9.5, 9]), fill: G.iron, depth: 4, core: false, decals: a.stain(196, 500, 8, G.rust, 0.8) });
  a.raw(`<path d="M160 120 L160 80 M190 120 L190 60 M220 120 L220 80 M160 120 L220 120" stroke="${INK}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M160 120 L160 80 M190 120 L190 60 M220 120 L220 80 M160 120 L220 120" stroke="${G.steelD}" stroke-width="4.6" stroke-linecap="round" fill="none"/>` + [[160, 78], [190, 58], [220, 78]].map(([x, y]) => `<path d="M${x - 6} ${y + 6} L${x} ${y - 8} L${x + 6} ${y + 6} Z" fill="${G.steelD}" stroke="${INK}" stroke-width="1"/>`).join(''));
  B.arm({ sh: [352, 310], el: [356, 392], wr: [214, 400], fill: skin, w: 1.4, handDir: [-0.2, 1], hatch: 120 });
  return [a, { idle: 'heavy', attack: 'thrust', hand: [190, 70] }];
};

E.abbess = () => {
  const a = new Art(560, 800, 511), B = require('./body')(a), P = B.P, salt = '#cfcabb';
  ground(a, 280, 170);
  a.layer('body', [280, 520]);
  B.rag([226, 262], [334, 258], 770, '#2a2628', { n: 14, amp: 14, flare: 50, depth: 50, decals: a.stain(280, 730, 40, '#e8e4d8', 0.6) });
  a.shape({ d: smooth([[250, 272], [312, 268], [320, 360], [316, 620], [252, 624], [244, 360]], true, 0.4), fill: '#8a1e18', depth: 16, mottle: 0.6, fine: true, hatch: 70, decals: `<path d="M281 300 L281 400 M262 330 L300 330" stroke="${G.gold}" stroke-width="2"/>` + a.stain(280, 520, 26, '#e8e4d8', 0.6) });
  a.layer('back', [230, 290]);
  B.arm({ sh: [232, 292], el: [200, 360], wr: [188, 410], fill: '#2a2628', handSkin: salt, handDir: [-0.3, 1], hatch: 40, w: 1.1 });
  a.shape({ d: limb([[188, 776], [182, 400], [178, 150]], [9, 9.5, 9]), fill: G.goldL, depth: 4, core: false });
  a.raw(`<path d="M178 152 C176 110 214 96 230 118 C242 136 226 158 206 150 C196 146 200 130 210 132" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M178 152 C176 110 214 96 230 118 C242 136 226 158 206 150 C196 146 200 130 210 132" fill="none" stroke="${G.goldL}" stroke-width="5" stroke-linecap="round"/>`);
  a.layer('head', [280, 262]);
  B.head({ x: 262, y: 210, k: 1.15, skin: salt, style: 'drowned', jaw: 0, eye: 'milky' });
  a.raw(`<path d="M228 232 L262 236" stroke="${INK}" stroke-width="1.4"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${230 + i * 7} 228 L${232 + i * 7} 240" stroke="${INK}" stroke-width="1.2"/>`).join('') + `<path d="M246 262 C262 270 282 270 296 262 C282 284 258 284 246 262 Z" fill="${G.black}"/>` + a.drip(266, 278, 20, 2.2));
  a.shape({ d: smooth([[214, 196], [238, 130], [284, 110], [328, 134], [338, 200], [348, 290], [322, 300], [314, 210], [298, 170], [254, 166], [232, 206], [228, 280], [206, 286]], true, 0.6), fill: '#2a2628', depth: 16, mottle: 0.4, fine: true, hatch: 30 });
  a.shape({ d: smooth([[232, 174], [262, 160], [298, 164], [304, 176], [262, 172], [236, 186]], true, 0.4), fill: '#e8e4d8', depth: 3, core: false, ink: 0.9 });
  a.layer('arm', [334, 290]);
  B.arm({ sh: [334, 292], el: [372, 350], wr: [402, 322], fill: '#2a2628', handSkin: salt, handDir: [0.6, -0.8], hatch: 120, w: 1.1, claws: true });
  a.raw(Array.from({ length: 24 }, () => { const x = 200 + a.R() * 200, y = 300 + a.R() * 460; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l2.4 -2.4 l2.4 2.4 l-2.4 2.4 Z" fill="#f4f0e4" stroke="${INK}" stroke-width="0.4"/>`; }).join(''));
  return [a, { idle: 'sway', attack: 'raise', hand: [410, 300] }];
};

E.pearl_diver = () => {
  const a = new Art(560, 800, 521), B = require('./body')(a), P = B.P, skin = '#cfc6b4';
  ground(a, 280, 170);
  a.layer('legs', [280, 520]);
  B.leg({ hip: [300, 520], knee: [356, 600], ankle: [322, 740], fill: skin, hatch: 120 });
  B.leg({ hip: [250, 520], knee: [196, 616], ankle: [236, 742], fill: skin, hatch: 60 });
  a.shape({ d: smooth([[240, 500], [312, 496], [318, 540], [284, 580], [246, 548]], true, 0.5), fill: '#6a5a48', depth: 10, mottle: 0.6, hatch: 80 });
  a.raw(`<path d="M300 520 C320 560 330 620 322 680" stroke="${G.parchD}" stroke-width="3" fill="none"/>`);
  a.shape({ d: smooth([[300, 676], [340, 672], [350, 704], [326, 720], [298, 706]], true, 0.6), fill: G.steelD, depth: 10, mottle: 0.7, decals: P.barnacles(326, 694, 5, 8) });
  a.layer('back', [320, 360]);
  B.arm({ sh: [320, 360], el: [360, 430], wr: [340, 480], fill: skin, handDir: [0, 1], hatch: 120 });
  a.shape({ d: smooth([[322, 474], [356, 470], [364, 504], [340, 516], [320, 500]], true, 0.6), fill: G.leatherD, depth: 8 });
  a.layer('body', [280, 520]);
  B.torso({ fsh: [222, 350], nsh: [318, 340], wl: [234, 450], wr: [318, 446], hl: [244, 512], hr: [316, 506], fill: skin, bare: true, depth: 30, decals: a.stain(300, 440, 20, G.bruise, 0.5) });
  a.layer('head', [236, 340]);
  B.head({ x: 216, y: 300, k: 1.1, skin, style: 'gaunt', jaw: 0.3, eye: 'none' });
  a.raw(`<path d="M190 286 C196 282 204 282 210 288" stroke="${INK}" stroke-width="1.6" fill="none"/>` + P.weed(236, 258, 70, -1, '#4f5f3a') + P.weed(250, 266, 90, 1, '#4f5f3a'));
  a.layer('arm', [230, 380]);
  B.arm({ sh: [230, 380], el: [180, 430], wr: [146, 404], fill: skin, handDir: [-1, -0.4], hatch: 60 });
  a.shape({ d: 'M134 392 L114 330 C110 314 94 312 92 328 L100 330 C102 322 106 322 108 330 L126 396 Z', fill: G.steelL, depth: 4, core: false, ink: 1.1, decals: a.stain(110, 340, 6, G.blood, 0.9) });
  a.raw(a.drip(98, 332, 18, 2));
  return [a, { idle: 'crouch', attack: 'stab', hand: [96, 326] }];
};

E.drowned_king = () => {
  const a = new Art(700, 900, 531), B = require('./body')(a), P = B.P, skin = '#7f8f82';
  ground(a, 350, 240);
  a.layer('back', [350, 300]);
  B.rag([246, 262], [454, 256], 860, '#5a1e2a', { n: 18, amp: 24, flare: 130, depth: 60, decals: a.stain(350, 800, 60, G.algae, 0.55) + P.barnacles(520, 700, 14, 30) });
  a.layer('legs', [350, 640]);
  B.leg({ hip: [296, 640], knee: [276, 760], ankle: [270, 846], fill: skin, w: 2, hatch: 60 });
  B.leg({ hip: [404, 640], knee: [424, 760], ankle: [418, 848], fill: skin, w: 2, hatch: 120 });
  a.layer('body', [350, 640]);
  a.shape({ d: smooth([[250, 330], [450, 320], [500, 420], [490, 560], [440, 650], [260, 656], [210, 560], [204, 420]], true, 0.75), fill: skin, depth: 60, mottle: 0.5, fine: true, hatch: 110,
    decals: `<path d="M290 450 C330 430 400 430 430 460 C420 540 340 560 290 520 Z" fill="${G.black}"/><path d="M296 456 C330 440 396 440 424 464" stroke="#b05040" stroke-width="3" fill="none"/>` + a.stain(440, 560, 34, G.bruise, 0.55) + P.barnacles(460, 380, 16, 24), over: a.drip(330, 540, 40, 3.4) + a.drip(390, 548, 30, 3) });
  a.shape({ d: smooth([[240, 262], [460, 250], [480, 300], [420, 320], [350, 300], [280, 320], [222, 300]], true, 0.5), fill: '#d8d0bc', depth: 14, mottle: 0.8, fine: true, hatch: 80, decals: Array.from({ length: 14 }, (_, i) => `<path d="M${250 + i * 15} ${276 + (i % 3) * 8} l2 8 l2 -8 Z" fill="${G.black}"/>`).join('') });
  a.layer('head', [346, 276]);
  B.head({ x: 330, y: 222, k: 1.55, skin, style: 'bloated', jaw: 0.9, eye: 'milky' });
  a.raw([[296, 168, -20], [322, 156, -6], [350, 152, 6], [378, 160, 18], [402, 176, 30]].map(([x, y, r]) => { const h = 50 + (x % 3) * 12; const d = `M${x} ${y} C${x + r * 0.3} ${y - h * 0.5} ${x + r} ${y - h * 0.7} ${x + r * 0.8} ${y - h} M${x + r * 0.4} ${y - h * 0.5} L${x + r * 0.4 - 12} ${y - h * 0.62} M${x + r * 0.6} ${y - h * 0.75} L${x + r * 0.6 + 12} ${y - h * 0.85}`; return `<path d="${d}" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#c86858" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('') +
    `<path d="M288 176 C320 164 380 162 412 180" stroke="${G.goldL}" stroke-width="6" fill="none"/>`);
  a.layer('arm', [450, 360]);
  a.shape({ d: limb([[200, 870], [190, 500], [180, 190]], [12, 12, 12]), fill: G.bone, depth: 5, core: false, mottle: 0.5 });
  a.raw(`<path d="M180 190 C170 140 120 130 110 160" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M180 190 C170 140 120 130 110 160" fill="none" stroke="${G.bone}" stroke-width="4" stroke-linecap="round"/><circle cx="110" cy="172" r="22" fill="#d8f0c0" opacity="0.25"/><circle cx="110" cy="172" r="10" fill="#e8f8d0" stroke="${INK}" stroke-width="1.2"/>`);
  B.arm({ sh: [452, 362], el: [420, 470], wr: [210, 490], fill: skin, w: 2.1, handDir: [-0.3, 1], hatch: 120 });
  return [a, { idle: 'heavy', attack: 'slam', cast: 'raise', hand: [110, 172] }];
};

E.mother_of_brine = () => {
  const a = new Art(700, 900, 541), B = require('./body')(a), P = B.P, skin = '#a8b4a6';
  ground(a, 350, 260);
  a.layer('legs', [350, 760]);
  for (const [sp, w, c] of [[[[600, 876], [620, 760], [560, 700], [520, 740]], 70, '#5f7d74'], [[[120, 876], [90, 780], [130, 720], [170, 760]], 70, '#5f7d74']]) P.tentacle(sp, w, 20, c, { hatch: 60 });
  a.shape({ d: smooth([[130, 876], [150, 740], [250, 640], [450, 640], [560, 740], [580, 876]], true, 0.6), fill: '#4f6a62', tex: 'url(#mail)', texOp: 0.6, depth: 60, mottle: 0.5, fine: true, hatch: 80, decals: P.barnacles(240, 760, 16, 40) + P.barnacles(470, 780, 14, 34) + a.gash(300, 740, 360, 760, 8, { rim: '#c08070', dripLen: 30 }) });
  a.layer('back', [300, 420]);
  B.arm({ sh: [300, 420], el: [230, 400], wr: [170, 420], fill: skin, w: 1.2, claws: true, handDir: [-1, 0.2], hatch: 60 });
  B.arm({ sh: [300, 450], el: [230, 490], wr: [170, 520], fill: skin, w: 1.1, claws: true, handDir: [-1, 0.4], hatch: 60 });
  a.layer('body', [350, 660]);
  B.torso({ fsh: [292, 390], nsh: [412, 388], wl: [300, 520], wr: [410, 516], hl: [292, 670], hr: [420, 668], fill: skin, bare: true, depth: 40, decals: P.ribs(350, 500, 100, 110, 7) });
  a.shape({ d: smooth([[310, 560], [370, 548], [396, 580], [370, 610], [312, 606]], true, 0.7), fill: '#8a9aa4', depth: 14, mottle: 0.5, fine: true, hatch: 100, decals: `<path d="M318 576 l3 3 m0 -3 l-3 3 M330 574 l3 3 m0 -3 l-3 3" stroke="${INK}" stroke-width="0.8"/>` });
  a.layer('head', [350, 380]);
  a.raw(Array.from({ length: 14 }, (_, i) => P.weed(300 + i * 8, 260, 200 + (i % 4) * 40, i % 2 ? 1 : -1, i % 3 ? '#4f5f3a' : '#3a4a2a')).join(''));
  B.head({ x: 334, y: 318, k: 1.45, skin, style: 'drowned', jaw: 1, eye: 'glint' });
  a.raw(P.eye(318, 278, 5, '#d8c040') + P.eye(322, 296, 4, '#d8c040') + [[316, 258], [340, 250], [364, 256]].map(([x, y]) => P.hook(x, y - 26, 0.7)).join(''));
  a.layer('arm', [410, 420]);
  B.arm({ sh: [404, 392], el: [452, 300], wr: [470, 230], fill: skin, w: 1.1, claws: true, handDir: [0.2, -1], hatch: 120 });
  B.arm({ sh: [410, 450], el: [424, 540], wr: [384, 596], fill: skin, w: 1.1, handDir: [-1, 0.2], hatch: 120 });
  return [a, { idle: 'sway', attack: 'claw', cast: 'raise', hand: [170, 420] }];
};

for (const [name, fn] of Object.entries(E)) {
  if (only.length && !only.includes(name)) continue;
  const [a, anim] = fn();
  a.writeRig('grim/rig/' + name, anim);
  console.log('rig', name, a.layers.map(l => l.name).join(','));
}
