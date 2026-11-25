// The Bell Below (boss): a cathedral bell the size of a chapel, cracked and crusted, hanging from a rotted
// beam by chains. Its tongue is a knot of fused drowned bodies; arms reach out of the mouth, and one vast
// eye opens in the dark inside. Faces left.
const { Art, G, INK, smooth, limb, poly } = require('../gr');
const a = new Art(700, 900, 321);
const P = require('./parts')(a), R = a.R;
a.layer('shadow');
a.raw(a.ground(350, 876, 250, 14));
a.layer('back', [350, 60]);
// beam and chains
a.shape({ d: poly([[60, 40], [640, 40], [640, 74], [60, 74]]), fill: G.woodD, depth: 10, tex: 'url(#grain)', texOp: 0.7, mottle: 0.6, decals: a.stain(200, 60, 20, G.algae, 0.6) + P.barnacles(480, 64, 8, 20) });
for (const x of [250, 450]) { let c = ''; for (let i = 0; i < 9; i++) { const y = 82 + i * 12; c += `<ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 3 : 6}" ry="7" fill="none" stroke="${INK}" stroke-width="3.6"/><ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 3 : 6}" ry="7" fill="none" stroke="${G.iron}" stroke-width="1.8"/>`; } a.raw(c); }
a.layer('arm', [350, 100]);
// the bell body
a.shape({ d: 'M260 190 C260 150 440 150 440 190 C470 300 500 460 560 560 C580 590 590 610 590 630 L110 630 C110 610 120 590 140 560 C200 460 230 300 260 190 Z', fill: G.gold, depth: 120, mottle: 0.7, wash: 0.45, hatch: 30,
  spec: ['M262 220 C248 320 226 430 176 540'], specOp: 0.4,
  decals: a.stain(360, 340, 60, '#4f7f6a', 0.7) + a.stain(470, 520, 50, '#4f7f6a', 0.7) + a.stain(220, 480, 40, '#4f7f6a', 0.6) + P.barnacles(420, 300, 20, 40) + P.barnacles(260, 560, 14, 30) +
    `<path d="M330 200 L346 280 L330 340 L352 420 L340 520" stroke="${G.black}" stroke-width="4" fill="none"/><path d="M330 200 L346 280 L330 340 L352 420 L340 520" stroke="#e8d8a0" stroke-width="1" fill="none" transform="translate(2 0)"/>` +
    `<path d="M170 520 C300 500 420 500 540 520" stroke="${INK}" stroke-width="3" fill="none"/><path d="M200 470 C300 452 410 452 512 470" stroke="${INK}" stroke-width="2" fill="none"/>` +
    `<text x="250" y="500" font-family="serif" font-size="22" fill="${INK}" opacity="0.6" letter-spacing="4">VOCO MORTVOS</text>` });
a.shape({ d: smooth([[300, 150], [400, 150], [410, 130], [380, 112], [320, 112], [290, 130]], true, 0.5), fill: G.goldL, depth: 10, mottle: 0.6 });
// the mouth: darkness, a vast eye, arms reaching out
a.raw(`<path d="M110 630 C200 660 500 660 590 630 C560 690 140 690 110 630 Z" fill="${G.black}"/>`);
a.raw(`<ellipse cx="350" cy="652" rx="44" ry="18" fill="#e6dcc0" stroke="${INK}" stroke-width="1.4"/><circle cx="342" cy="652" r="14" fill="#a83a2a"/><circle cx="342" cy="652" r="7" fill="${G.black}"/><circle cx="336" cy="647" r="3" fill="#fff"/>` +
  `<path d="M306 652 C320 646 336 644 360 646 M310 658 C330 664 360 664 388 656" stroke="${G.bloodL}" stroke-width="0.8" fill="none"/>`);
// the tongue: a knot of fused bodies hanging below
a.shape({ d: smooth([[300, 660], [400, 660], [420, 740], [396, 820], [350, 850], [304, 820], [282, 740]], true, 0.7), fill: '#8a9488', depth: 40, mottle: 0.5, fine: true, hatch: 110,
  decals: P.socket(330, 720, 9) + P.socket(354, 716, 8) + P.teeth(326, 744, 362, 744, 6, 6, 1) + P.socket(380, 780, 7) + P.socket(320, 790, 8) + `<path d="M330 800 C340 812 356 812 366 800" stroke="${INK}" stroke-width="1.2" fill="none"/>` +
    a.gash(300, 760, 330, 770, 6, { rim: '#c08070', dripLen: 30 }) + a.stain(390, 740, 18, G.bruise, 0.6) });
const reach = (pts, w) => { a.limb(pts, pts.map((_, i) => w * (1 - i * 0.12)), { fill: '#8a9488', depth: w * 0.3, mottle: 0.5, fine: true, hatch: pts[pts.length - 1][0] < 350 ? 60 : 120 }); const [x, y] = pts[pts.length - 1], d = pts[pts.length - 1][0] < 350 ? 1 : -1; a.raw([0, 1, 2, 3].map(i => `<path d="M${x} ${y + (i - 1.5) * 5} L${x - 22 * d} ${y + (i - 1.5) * 8 - 6}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y + (i - 1.5) * 5} L${x - 22 * d} ${y + (i - 1.5) * 8 - 6}" stroke="#8a9488" stroke-width="3" stroke-linecap="round"/>`).join('')); };
reach([[200, 650], [150, 700], [90, 720]], 26);
reach([[250, 660], [210, 740], [160, 790]], 22);
reach([[470, 660], [520, 720], [570, 740]], 24);
reach([[180, 640], [120, 640], [70, 600]], 20);
a.raw(a.drip(350, 850, 24, 3.4) + a.drip(320, 830, 16, 2.4) + P.flies(500, 300, 12, 120));
a.writeRig('grim/rig/bell_below', { idle: 'bell', attack: 'ring', hand: [350, 650] });
