// Drowned Bell-Ringer: an acolyte whose face has rotted to the skull, cassock heavy with silt and
// chains, ringing a corroded handbell overhead; the clapper is a human finger bone. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(460, 700, 131);
const P = require('./parts')(a), R = a.R;
a.raw(a.ground(230, 676, 120, 10));
// cassock
{
  const hem = P.ragged(306, 150, 650, 12, 22);
  a.shape({ d: smooth([[198, 226], [266, 222], [292, 300], [304, 450], ...hem, [150, 460], [168, 320]], true, 0.45), fill: '#3a3430', depth: 40, mottle: 0.6, fine: true, hatch: 70,
    decals: a.fold(200, 300, 180, 640, 8) + a.fold(240, 300, 236, 650, 8) + a.fold(276, 320, 292, 640, 7) + a.stain(230, 600, 30, G.algae, 0.55) + a.stain(200, 640, 20, '#8a8070', 0.5) + P.barnacles(280, 560, 8, 14) });
  // chains wrapping the body
  for (const [y0, y1] of [[330, 360], [420, 450]]) {
    let c = ''; for (let i = 0; i < 14; i++) { const t = i / 13, x = 160 + 140 * t, y = y0 + (y1 - y0) * t + Math.sin(t * 6) * 3; c += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="3" transform="rotate(${i % 2 ? 70 : 10} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${INK}" stroke-width="2.6"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="3" transform="rotate(${i % 2 ? 70 : 10} ${x.toFixed(1)} ${y.toFixed(1)})" fill="none" stroke="${G.rust}" stroke-width="1.3"/>`; }
    a.raw(c);
  }
}
// near arm hanging with a rosary of teeth
a.limb([[206, 240], [180, 310], [178, 372]], [30, 26, 22], { fill: '#3a3430', depth: 9, mottle: 0.6, fine: true, hatch: 40 });
a.shape({ d: smooth([[166, 366], [188, 364], [192, 384], [182, 396], [166, 390]], true, 0.6), fill: G.boneD, depth: 5, lines: ['M170 376 L190 374'], after: `<path d="M172 392 L168 420 M186 394 L190 420" stroke="${INK}" stroke-width="2"/><path d="M172 392 L168 420 M186 394 L190 420" stroke="${G.bone}" stroke-width="1"/>` });
a.raw(Array.from({ length: 8 }, (_, i) => `<path d="M${170 + i * 2.5} ${400 + i * 4} l2 5 l2 -5 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.5"/>`).join(''));
// head: skull with flesh shreds, inside a cowl
a.shape({ d: smooth([[174, 186], [196, 164], [230, 162], [248, 190], [244, 226], [226, 246], [194, 244], [176, 224]], true, 0.7), fill: G.bone, depth: 16, mottle: 0.6, fine: true, hatch: 90,
  decals: P.socket(196, 196, 8) + P.socket(222, 196, 7) + `<path d="M204 210 L208 222 L212 210 Z" fill="${G.black}"/>` + P.teeth(190, 228, 230, 228, 8, 6, 1, G.bone) + `<path d="M188 226 L232 226" stroke="${INK}" stroke-width="1"/>` +
    a.stain(232, 214, 10, '#a87a72', 0.75) + a.stain(184, 210, 6, '#a87a72', 0.7) + `<circle cx="222" cy="196" r="1.6" fill="#e8e0a0"/>` });
a.raw(`<path d="M228 220 C234 232 230 244 236 252 M184 220 C178 232 182 244 176 250" stroke="#a87a72" stroke-width="2.4" fill="none"/>`);
a.shape({ d: smooth([[160, 196], [182, 150], [226, 140], [262, 166], [270, 226], [262, 250], [244, 236], [246, 186], [224, 164], [196, 170], [182, 210], [190, 246], [166, 244]], true, 0.6), fill: '#2e2824', depth: 14, mottle: 0.5, hatch: 30 });
// far arm raised, ringing the bell
a.limb([[258, 236], [286, 186], [268, 136]], [28, 24, 20], { fill: '#3a3430', depth: 8, mottle: 0.6, fine: true, hatch: 120 });
a.shape({ d: smooth([[256, 126], [276, 120], [282, 138], [268, 148], [254, 142]], true, 0.6), fill: G.boneD, depth: 4 });
a.shape({ d: poly([[262, 118], [270, 118], [270, 100], [262, 100]]), fill: G.woodD, depth: 2, core: false, ink: 1 });
a.shape({ d: smooth([[244, 100], [266, 60], [288, 100], [292, 104], [240, 104]], true, 0.5), fill: G.gold, depth: 12, mottle: 0.6, ink: 1.3,
  decals: a.stain(260, 84, 10, '#4f7f6a', 0.8) + a.stain(280, 96, 6, '#4f7f6a', 0.8), after: `<path d="M262 104 L258 118 L264 120 Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.7"/>` });
// sound rings
a.raw([1, 2, 3].map(i => `<path d="M${236 - i * 10} ${70 - i * 4} C${226 - i * 10} ${86} ${226 - i * 10} ${100 + i * 2} ${236 - i * 10} ${116 + i * 4}" stroke="${INK}" stroke-width="0.9" fill="none" opacity="${0.8 - i * 0.2}"/>`).join(''));
require('fs').writeFileSync('grim/e_bellringer.svg', a.svg());
