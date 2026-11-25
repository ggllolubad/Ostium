// Lamprey Swarm: a knot of fat lampreys feeding on what is left of a drowned man; they rear up together,
// rasping mouths open, blood trailing from the half-eaten corpse they ride. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 151);
const P = require('./parts')(a), R = a.R;
a.layer('shadow');
a.raw(a.ground(230, 676, 140, 10));
a.raw(`<path d="M120 672 C160 660 280 660 330 670 C320 684 160 686 120 672 Z" fill="${G.blood}" opacity="0.6"/>`);
a.layer('body', [230, 640]);
// the corpse they ride: ribcage and pelvis half-stripped, a skull rolled aside
a.shape({ d: smooth([[150, 640], [180, 600], [260, 596], [316, 620], [320, 664], [150, 668]], true, 0.6), fill: '#a87a72', depth: 20, mottle: 0.6, fine: true, hatch: 60,
  decals: P.ribs(240, 630, 90, 40, 4) + a.stain(200, 640, 20, G.blood, 0.8) + a.stain(290, 650, 14, G.bloodD, 0.7) });
a.shape({ d: smooth([[96, 650], [112, 628], [138, 630], [146, 656], [130, 672], [104, 672]], true, 0.6), fill: G.bone, depth: 10, mottle: 0.5, decals: P.socket(114, 646, 6) + P.socket(132, 646, 5) + P.teeth(110, 664, 136, 664, 5, 4, 1) });
a.layer('arm', [250, 620]);
// lampreys
const mouth = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r * 1.15).toFixed(1)}" fill="#7a2a24" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x}" cy="${y}" rx="${(r * 0.55).toFixed(1)}" ry="${(r * 0.62).toFixed(1)}" fill="${G.black}"/>` +
  Array.from({ length: 12 }, (_, i) => { const t = i / 12 * Math.PI * 2; return `<path d="M${(x + Math.cos(t) * r * 0.9).toFixed(1)} ${(y + Math.sin(t) * r).toFixed(1)} L${(x + Math.cos(t) * r * 0.55).toFixed(1)} ${(y + Math.sin(t) * r * 0.62).toFixed(1)}" stroke="${G.bone}" stroke-width="1.6" stroke-linecap="round"/>`; }).join('');
const eel = (spine, w0, col, mx, my, mr) => {
  a.limb(spine, spine.map((_, i) => w0 * (1 - i / spine.length * 0.6)), { fill: col, mottle: 0.5, fine: true, depth: w0 * 0.3, hatch: 70, spec: [`M${spine[1][0] + 4} ${spine[1][1]} L${spine[2][0] + 4} ${spine[2][1]}`], specOp: 0.4,
    decals: Array.from({ length: 6 }, (_, i) => { const p = spine[Math.min(spine.length - 1, 1 + (i % (spine.length - 1)))]; return `<circle cx="${(p[0] + (R() - 0.5) * 10).toFixed(1)}" cy="${(p[1] + (R() - 0.5) * 10).toFixed(1)}" r="1.2" fill="${G.black}" opacity="0.6"/>`; }).join('') });
  a.raw(mouth(mx, my, mr));
};
eel([[300, 610], [300, 520], [276, 430], [240, 370], [208, 346]], 34, '#4a5048', 196, 340, 16);
eel([[230, 616], [236, 540], [210, 470], [170, 430], [144, 424]], 30, '#525a4c', 134, 420, 14);
eel([[270, 620], [290, 560], [300, 500], [290, 460], [264, 444]], 24, '#454a42', 254, 438, 11);
eel([[190, 620], [176, 580], [150, 552], [122, 550]], 22, '#4f564a', 114, 548, 10);
a.raw(a.drip(196, 358, 20, 2.4) + a.drip(134, 436, 16, 2) + a.drip(254, 450, 12, 1.8) + a.splat(160, 470, 6, { drops: 5 }));
// gill pores
a.raw([[230, 380], [238, 384], [246, 390], [178, 440], [186, 446], [194, 452]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${G.black}"/>`).join(''));
a.writeRig('grim/rig/lamprey', { idle: 'writhe', attack: 'bite', hand: [196, 340] });
