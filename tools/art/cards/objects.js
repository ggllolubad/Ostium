// Card devices: single objects that stand for an act, drawn with the figure engine (Fig, f.part, f.line) in the
// kit.base render settings, so they carry the heroes' cel band, hatch, crosshatch, variable outline, grit and wobble.
// Each builder draws round a local origin (x right, y down) about 440 px tall in figure px, through a frame F so the
// object can be tilted without turning the key light. Returns named points (in figure px) for card FX to attach to.
'use strict';
const K = require('./card_kit');
const { E, D, INK, BONE } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm, len } = E;

const IRON = '#4d4f52', PEWTER = '#8a8c86', BRONZE = '#8e6a3a', VERD = '#4f7a66', OAK = '#5b412a', OAKL = '#7a5a3a', COPPER = '#8a5a34', PITCH = '#1e1812', WAX = '#c8b890';
const T = (f, n) => n + f.o.seed;
const closedLine = pts => pts.concat([pts[0]]);

// ==== flask (alchemist: plague flask, brew, tonic)
// a round-bottomed flask in a copper wire cage, cork sealed with pitch, a skull tag on twine; it is splitting open.
function flask(f, o = {}) {
  const F = frame(o.at || [0, 0], o.ang || 0, 1), r = f.r;
  const glass = o.glass || '#4a6232', liquid = o.liquid || '#7a8636';
  // bulb + neck outline (local, upright)
  const bulb = []; for (let i = 0; i <= 24; i++) { const a = E.deg(30 + i * 300 / 24); bulb.push([Math.sin(a) * 128, 62 - Math.cos(a) * 118 + Math.max(0, -Math.cos(a)) * 6]); }
  const body = [[30, -168, 1], [29, -100], [40, -66], ...bulb, [-40, -66], [-29, -100], [-30, -168, 1]];
  f.part(F(body), { fill: glass, shade: 0.42, hi: 0.06, tex: T(f, 'mottle'), texOp: 0.3, gritOp: 0.45 });
  // the back wall seen through the glass, and the liquid: a sick, ripening green with sediment
  f.line(F([[-96, 30], [-60, 8], [0, 0], [60, 8], [96, 30]]), 1.4, mix(glass, '#000', 0.5), { op: 0.7 });
  const liq = [[-118, 40], [-60, 30], [0, 34], [60, 28], [118, 42], ...bulb.filter(p => p[1] > 44).sort((a, b) => b[0] - a[0])];
  f.part(F(liq), { fill: liquid, shade: 0.5, inkW: 1.1, inkHeavy: 2.2, cast: false, tex: T(f, 'mottle'), texOp: 0.7, hi: 0.03 });
  f.line(F([[-118, 40], [-60, 30], [0, 34], [60, 28], [118, 42]]), 1.6, mix(liquid, '#fff', 0.45), { op: 0.8 });
  for (let i = 0; i < 9; i++) { const p = [-70 + r() * 140, 150 + r() * 22]; f.flat(F(ell(p, 6 + r() * 12, 3 + r() * 3, 0, 8)), '#2a2a12', { op: 0.75 }); } // sediment
  for (let i = 0; i < 12; i++) { const p = [-80 + r() * 160, 55 + r() * 90], rr = 2 + r() * 5; f.line(F(closedLine(ell(p, rr, rr, 0, 8))), 1, '#d8dca0', { op: 0.6 }); } // bubbles rising
  {
    const L = []; for (let y = -50; y < 176; y += 7) L.push(F([[20 + r() * 10, y + 4], [80, y + 9], [140, y + 2]]));
    D.contour(f, F(body), L, { w: 1.2, op: 0.45, dash: '16 4 26 6' });
    D.wear(f, F([[0, 30]])[0], 100, 110, 34, '#1a1a0c', '#e8ecd0'); D.wear(f, F([[0, -130]])[0], 26, 36, 14, '#1a1a0c', '#e8ecd0');
  }
  for (let i = 0; i < 10; i++) { const p = F([[-90 + r() * 150, -60 + r() * 100]])[0]; f.flat(E.ell(p, 10 + r() * 20, 6 + r() * 12, r() * 3, 10), '#1e2410', { op: 0.18 }); }
  for (const x of [-22, -12, 14]) { const L = 40 + r() * 60; f.line(F([[x, -160], [x - 2, -120], [x + 2, -120 + L * 0.5], [x - 4, -100 + L]]), 2.2, '#2a2410', { op: 0.55 }); f.flat(F(ell([x - 4, -100 + L], 3, 4, 0, 8)), '#2a2410', { op: 0.6 }); }
  // a parchment recipe strip pasted round the shoulder, peeling at one corner
  { const strip = [[-96, -20], [-40, -40], [20, -42], [78, -24], [84, 2], [22, -14], [-40, -12], [-100, 8]];
    f.part(F(strip), { fill: '#bfae86', shade: 0.4, inkW: 1.3, tex: T(f, 'mottle'), texOp: 0.6, hi: 0.04 });
    for (let k = 0; k < 2; k++) { const y = -24 + k * 10; f.line(F([[-80, y + 10], [-40, y - 4], [10, y - 6], [60, y + 2]]), 1.1, INK, { op: 0.65, dash: `${(6 + r() * 8).toFixed(0)} 3 4 2 9 3` }); }
    f.part(F([[78, -24], [96, -40], [100, -18], [84, 2]]), { fill: '#d0c098', shade: 0.25, inkW: 1.1, cast: true });
    D.stain(f, F([[-60, -16]])[0], 12, '#5a4020', { op: 0.35 }); }
  // worn highlight on the glass, broken where grime sits
  f.line(F([[-92, -40], [-108, 0], [-106, 40]]), 5, '#e8ecd0', { op: 0.55 });
  f.line(F([[-98, 62], [-92, 92]]), 4, '#e8ecd0', { op: 0.4 });
  f.line(F([[-18, -160], [-18, -110]]), 3, '#e8ecd0', { op: 0.5 });
  // grime: thumb smears and a tide line of dried brew down one side
  for (const p of [[-40, -30], [-58, 120], [70, -20]]) D.stain(f, F([p])[0], 16 + r() * 10, '#1e1a0c', { op: 0.3 });
  f.part(F([[40, -100], [54, -90], [58, -40], [50, 10], [44, -30]]), { fill: mix(liquid, '#3a3010', 0.3), shade: 0.3, inkW: 0.9, inkHeavy: 1.2, cast: false });
  // toxin's mark: mould bloom and pustules ripening on the glass near the base
  for (let i = 0; i < 14; i++) { const p = [-30 + r() * 110, 130 + r() * 40]; f.flat(F(ell(p, 3 + r() * 6, 2 + r() * 4, r() * 3, 8)), mix('#a8a878', '#e0dcc0', r()), { op: 0.85 }); f.flat(F(ell(p, 1.2, 1.2, 0, 6)), '#2a2a10'); }
  for (const [x, y, rr] of [[76, 116, 7], [92, 96, 5], [60, 142, 6]]) { f.part(F(ell([x, y], rr, rr * 0.9, 0, 10)), { fill: '#a0a05a', shade: 0.45, inkW: 1, inkHeavy: 1.4, cast: false }); f.flat(F(ell([x - rr * 0.3, y - rr * 0.3], rr * 0.3, rr * 0.25, 0, 6)), '#e8e4c0', { op: 0.8 }); }
  // copper wire cage: two meridians and a twisted girdle, green where it touches the glass
  f.line(F([[-30, -98], [-96, -30], [-122, 50], [-96, 140], [-10, 180]]), 4.6, INK);
  f.line(F([[-30, -98], [-96, -30], [-122, 50], [-96, 140], [-10, 180]]), 2.4, COPPER);
  f.line(F([[30, -98], [70, -40], [86, 50], [72, 140], [20, 182]]), 4.6, INK);
  f.line(F([[30, -98], [70, -40], [86, 50], [72, 140], [20, 182]]), 2.4, COPPER);
  const gird = [[-126, 62], [-60, 76], [0, 80], [60, 76], [126, 60]];
  f.line(F(gird), 6, INK); f.line(F(gird), 3.6, COPPER); for (let i = 0; i < 16; i++) { const p = lerp(gird[Math.floor(i / 4)], gird[Math.floor(i / 4) + 1], (i % 4) / 4); f.line(F([add(p, [-2, -3]), add(p, [3, 3])]), 1, '#2a1a10', { straight: true, op: 0.8 }); }
  D.bloom(f, F([[-104, 66]])[0], 16, VERD, { n: 3, specks: 6 }); D.bloom(f, F([[70, -40]])[0], 10, VERD, { n: 2, specks: 4 });
  // lip ring, chipped
  f.part(F([[-40, -184], [40, -184], [42, -166, 1], [-42, -166, 1]]), { fill: mix(glass, '#d0d8b0', 0.25), shade: 0.4, inkW: 1.4, hi: 0.1, sharp: true });
  D.chip(f, F([[18, -184]])[0], 7, o.ang || 0);
  // cork, swollen, and the pitch seal over it running down the neck
  f.part(F([[-24, -182], [-27, -224], [27, -226], [24, -182]]), { fill: '#8a6a44', shade: 0.4, tex: T(f, 'mottle'), texOp: 0.8, inkW: 1.4 });
  for (let i = 0; i < 6; i++) f.flat(F(ell([-16 + r() * 32, -214 + r() * 26], 1.6, 1.2, 0, 6)), '#3a2a18'); // cork pits
  D.wax(f, F([[-36, -196], [-30, -214], [-18, -226], [0, -230], [18, -226], [30, -216], [37, -198], [38, -184]]), PITCH, { thick: 9, drips: 1, dripL: 54 });
  f.part(F([[-20, -228], [-14, -244], [12, -246], [22, -230], [8, -236], [-8, -234]]), { fill: '#2a2018', shade: 0.35, inkW: 1.2, inkHeavy: 1.8, cast: false }); // pitch lump
  f.line(F([[-12, -238], [4, -241]]), 1.2, '#8a7a5a', { op: 0.7 });
  // twine round the neck, a knot, and the paper tag with its skull for the careless
  D.twine(f, F([[-30, -150], [-30, -136]]), F([[30, -150], [30, -136]]), 3, '#9a8460', { knot: F([[32, -142]])[0], ends: [F([[50, -128], [62, -104]]), F([[40, -120], [46, -96]])] });
  const tagC = F([[70, -58]])[0];
  f.line([F([[32, -142]])[0], F([[52, -96]])[0], add(tagC, rot([-4, -38], o.ang || 0))], 1.8, '#3a2a18');
  D.label(f, tagC, 64, 76, (o.ang || 0) + 0.22, '#cdbb94', (G, w, h) => {
    if (o.skull !== false) {
    const sk = G([[-14, -24], [0, -30], [14, -24], [16, -8], [8, 0], [8, 8], [-8, 8], [-8, 0], [-16, -8]]);
      f.line(closedLine(sk), 2, INK);
      f.flat(G(ell([-6, -14], 4.5, 4, 0, 8)), INK); f.flat(G(ell([7, -14], 4.5, 4, 0, 8)), INK); f.flat(G([[0, -8], [-2, -3], [2, -3]]), INK);
      for (let i = 0; i < 4; i++) f.line(G([[-6 + i * 4, 1], [-6 + i * 4, 8]]), 1.1, INK, { straight: true });
    }
    f.line(G([[-20, 18], [-6, 20], [6, 17], [20, 20]]), 1.2, INK, { op: 0.8 }); f.line(G([[-20, 27], [2, 28], [14, 26]]), 1.2, INK, { op: 0.7 });
    f.flat(G(ell([-22, -30], 3, 3, 0, 8)), '#1a120c'); // eyelet
  });
  // the split: a crack running up the bulb from the side that struck, glass lifting out of it
  const crackA = [104, 110], cr = D.crack(f, F([crackA])[0], (o.ang || 0) - 2.3, 150, { n: 7, w: 2.2 });
  D.crack(f, F([[90, 120]])[0], (o.ang || 0) - 1.4, 70, { n: 4, forks: false });
  for (let i = 0; i < 5; i++) { const p = F([[110 + r() * 40, 70 + r() * 70]])[0], z = 6 + r() * 9, a = r() * 6; f.part([add(p, rot([z, 0], a)), add(p, rot([-z * 0.5, z * 0.5], a)), add(p, rot([-z * 0.3, -z * 0.6], a))], { fill: mix(glass, '#d8e0c0', 0.45), shade: 0.3, inkW: 1.1, inkHeavy: 1.4, cast: false, sharp: true }); }
  for (let i = 0; i < 5; i++) { const y = -128 + i * 7; f.line(F([[-29, y], [0, y + 5], [29, y + 2]]), 3, INK); f.line(F([[-28, y], [0, y + 5], [28, y + 2]]), 1.4, '#7a6448'); }
  f.line([F([[-30, -120]])[0], F([[-52, -96]])[0], F([[-58, -70]])[0]], 1.4, '#3a2a18');
  f.part(F(ell([-60, -60], 11, 10, 0, 12)), { fill: '#6e7072', shade: 0.4, inkW: 1.2, cast: true, tex: T(f, 'mottle'), texOp: 0.5 });
  f.line(F([[-66, -62], [-54, -58]]), 1, INK, { op: 0.7 }); f.line(F([[-60, -68], [-60, -52]]), 1, INK, { op: 0.7 });
  for (let i = 0; i < 10; i++) { const p = [-100 + r() * 60, 120 + r() * 40]; f.flat(F(ell(p, 2 + r() * 4, 2 + r() * 3, 0, 8)), mix('#a8a878', '#e0dcc0', r()), { op: 0.8 }); }
  f.scratches(F([[-30, 60]])[0], 40, 8, '#e8ecd0');
  return { mouth: F([[118, 96]])[0], neck: F([[0, -150]])[0], crack: cr };
}

// ==== hourglass (oracle: time, delay, the stolen hour)
function hourglass(f, o = {}) {
  const F = frame(o.at || [0, 0], o.ang || 0, 1), r = f.r, a0 = o.ang || 0;
  const capT = -206, capB = 206;
  // back post (behind the glass)
  const post = (x, yA, yB, col, back) => {
    f.part(F(limb([x, yA], [x, yB], 22, 22, { p: [[0.12, 0.35, 0.04], [0.5, 0.18, 0.12], [0.88, 0.35, 0.04]], q: [[0.12, 0.35, 0.04], [0.5, 0.18, 0.12], [0.88, 0.35, 0.04]], capK: 0.2 })), { fill: col, shade: back ? 0.25 : 0.45, tex: T(f, 'wood'), texOp: 0.6 });
    for (const t of [0.12, 0.88]) f.line(F([[x - 14, lerp([0, yA], [0, yB], t)[1]], [x + 14, lerp([0, yA], [0, yB], t)[1]]]), 1.4, INK, { op: 0.7 });
  };
  post(30, capT + 30, capB - 30, mix(OAK, '#000', 0.35), true);
  // glass: two bulbs and the waist, tinted, back curve, sand
  const gl = [[-86, -176], [-92, -120], [-70, -50], [-14, -8], [-10, 0], [-14, 8], [-70, 50], [-92, 120], [-86, 176], [86, 176], [92, 120], [70, 50], [14, 8], [10, 0], [14, -8], [70, -50], [92, -120], [86, -176]];
  f.flat(F(gl), '#2c2838', { op: 0.72 });
  for (let i = 0; i < 40; i++) { const p = [-80 + r() * 160, -170 + r() * 340]; if (Math.abs(p[0]) > 20 + Math.abs(p[1]) * 0.45) continue; f.flat(F(ell(p, 0.8 + r() * 1.4, 0.8 + r() * 1.2, 0, 6)), r() < 0.6 ? '#8a8494' : '#141018', { op: 0.6 }); } // dust on the glass
  for (const y of [-130, 130]) f.line(F([[52, y - 30], [62, y], [56, y + 30]]), 2.4, '#b8b0c8', { op: 0.35 });
  // sand: the lower heap, made of star-grains, and what is left above
  const heap = [[-84, 176], [-80, 140], [-50, 106], [-12, 84], [12, 86], [52, 110], [82, 142], [86, 176]];
  f.part(F(heap), { fill: '#bfb294', shade: 0.4, inkW: 1.1, inkHeavy: 2, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
  for (let i = 0; i < 26; i++) { const p = [-60 + r() * 120, 110 + r() * 60]; if (Math.abs(p[0]) > (p[1] - 80) * 0.9) continue; f.flat(F(ell(p, 1.4 + r() * 1.6, 1.4 + r() * 1.6, 0, 6)), r() < 0.5 ? '#f2ead6' : '#5a4e6a', { op: 0.9 }); }
  const top = [[-66, -56], [-30, -26], [-12, -9], [12, -9], [30, -26], [66, -56], [40, -50], [10, -40], [0, -36], [-10, -40], [-40, -50]];
  f.part(F(top), { fill: '#bfb294', shade: 0.35, inkW: 1, inkHeavy: 1.6, cast: false });
  f.line(F([[0, -8], [0, 84]]), 3, '#cfc2a2'); f.line(F([[-1.5, -8], [-1.5, 84]]), 1, INK, { op: 0.6 });
  // glass outline, inner back curve, worn highlights, a crack
  f.line(F(gl.slice(0, 9)), 2.2, INK); f.line(F(gl.slice(9)), 2.2, INK);
  f.line(F([[-80, -170], [-60, -160], [0, -154], [60, -160], [80, -170]]), 1.2, '#8a8698', { op: 0.6 });
  f.line(F([[-70, -150], [-76, -110], [-58, -66]]), 4, '#ece6f0', { op: 0.6 }); f.line(F([[-72, 70], [-80, 110]]), 3, '#ece6f0', { op: 0.45 });
  D.crack(f, F([[70, -140]])[0], a0 + 2.0, 60, { n: 4, lip: '#ece6f0' });
  // the robe scrap tied over the top: violet-black cloth pricked with stars, its frayed end coming apart into grains
  // front posts
  post(-112, capT + 28, capB - 28, OAK);
  post(112, capT + 28, capB - 28, mix(OAK, '#2a1f2a', 0.15));
  // twine repair binding a split on the near post
  D.twine(f, F([[-124, 40], [-124, 50]]), F([[-100, 40], [-100, 50]]), 4, '#9a8460', { knot: F([[-98, 52]])[0], ends: [F([[-90, 62], [-86, 80]])] });
  D.crack(f, F([[-112, 20]])[0], a0 + 1.6, 46, { n: 3, forks: false, w: 1.4 });
  // caps: thick turned oak boards, bevelled, nailed
  const cap = (y, h, flipY) => {
    const s = flipY ? -1 : 1;
    f.part(F([[-150, y, 1], [150, y, 1], [146, y + s * h * 0.65], [138, y + s * h, 1], [-138, y + s * h, 1], [-146, y + s * h * 0.65]]), { fill: OAKL, shade: 0.42, tex: T(f, 'wood'), texOp: 0.7, sharp: false, k: 0.5 });
    f.line(F([[-146, y + s * h * 0.62], [146, y + s * h * 0.62]]), 1.4, INK, { op: 0.7 });
    f.line(F([[-140, y + s * 3], [140, y + s * 3]]), 1.2, mix(OAKL, '#fff', 0.45), { op: 0.6 });
    for (const x of [-112, 30, 112]) f.rivet(F([[x, y + s * h * 0.35]])[0], 3, '#6a6460');
  };
  cap(capT, 34, false); cap(capB, 34, true);
  // the void mark: a clean round bite out of the bottom cap's corner, rim drawn, nothing inside
  D.hole(f, F([[118, capB - 17]])[0], 15, 11, mix(OAKL, '#fff', 0.1), { ang: a0 });
  const holes = undefined;
  // wear: chips on the cap edges, a dent, scratches, stains, a burn ring from a candle set down
  D.chip(f, F([[-100, capT]])[0], 8, a0); D.chip(f, F([[60, capB]])[0], 7, a0 + Math.PI);
  f.scratches(F([[-40, capB - 18]])[0], 24, 5, '#d8c8a8');
  D.stain(f, F([[60, capT - 18]])[0], 18, '#2a1a10', { op: 0.35 });
  f.line(closedLine(ell(F([[-60, capT - 16]])[0], 18, 6, a0, 12)), 1.6, '#1a1008', { op: 0.6 });
  // candle stub stuck to the top cap, wax run over the edge
  const cs = F([[-60, capT]])[0];
  f.part(F([[-74, capT], [-73, capT - 46], [-62, capT - 50], [-48, capT - 46], [-47, capT]]), { fill: WAX, shade: 0.35, inkW: 1.3, cast: true, hi: 0.15 });
  D.wax(f, F([[-80, capT + 2], [-70, capT - 2], [-60, capT - 1], [-48, capT - 2], [-40, capT + 2]]), mix(WAX, '#fff', 0.1), { thick: 4, drips: 0.9, dripL: 30 });
  f.line(F([[-61, capT - 50], [-60, capT - 60]]), 1.6, INK);
  f.flat(F([[-66, capT - 58], [-61, capT - 84], [-55, capT - 58], [-60, capT - 52]]), '#e0a040', { op: 0.95 });
  f.flat(F([[-62, capT - 58], [-60, capT - 72], [-58, capT - 58]]), '#f8e8b0');
  // star chart scrap tied to the far post on a string
  f.line([F([[112, -120]])[0], F([[150, -96]])[0], F([[168, -70]])[0]], 1.6, '#3a2a18');
  D.label(f, F([[176, -36]])[0], 50, 62, a0 - 0.18, '#cdbb94', (G) => {
    for (const [x, y] of [[-12, -14], [6, -20], [14, 0], [-4, 6], [-14, 18]]) f.flat(G(ell([x, y], 2, 2, 0, 6)), INK);
    f.line(G([[-12, -14], [6, -20], [14, 0], [-4, 6], [-14, 18]]), 0.9, INK, { op: 0.7, straight: true });
  });
  return { top: F([[0, capT - 10]])[0], neck: F([[0, 0]])[0], heap: F([[0, 120]])[0], capT: F([[0, capT]])[0], capL: F([[-150, capT]])[0], holes };
}
// the robe scrap with pricked stars draped over the hourglass top, its fray coming apart. Drawn after the hourglass.
function robeScrap(f, at, ang, s = 1) {
  const F = frame(at, ang, s), r = f.r, cloth = '#463a58';
  // at = the top cap's left end. The cloth lies over the cap's left half and falls down past the post.
  const pts = [[60, -8], [100, -4], [118, 4], [96, 16], [40, 14], [8, 20], [-6, 40], [-14, 90], [-8, 140], [-20, 128, 1], [-28, 150], [-36, 118, 1], [-46, 138], [-50, 96], [-42, 40], [-30, 4], [0, -10]];
  void 0;
  f.part(F(pts), { fill: cloth, shade: 0.5, tex: T(f, 'weave'), texOp: 0.5 });
  f.line(F([[-30, 10], [-34, 60], [-30, 110]]), 1.3, INK, { op: 0.8 }); f.line(F([[-14, 30], [-20, 80]]), 1.2, INK, { op: 0.7 }); f.line(F([[20, 0], [70, 2]]), 1.1, INK, { op: 0.6 });
  // pricked stars: some still in the cloth, some only the empty pricks they left
  for (const [x, y, k] of [[80, 2, 1], [40, 2, 0], [10, 6, 1], [-22, 30, 1], [-30, 70, 0], [-18, 100, 1], [-36, 120, 0], [-24, 54, 0]]) { if (k) { f.flat(F(ell([x, y], 2.4, 2.4, 0, 6)), '#ece4d0'); f.line(F([[x - 4.5, y], [x + 4.5, y]]), 0.9, '#ece4d0', { op: 0.6 }); } else f.flat(F(ell([x, y], 1.8, 1.8, 0, 6)), '#08060a'); }
  for (let i = 0; i < 6; i++) { const b = F([[-46 + i * 7, 128 + (i % 2) * 14]])[0]; f.line([b, add(b, [(r() - 0.5) * 6, 8 + r() * 12])], 1, '#4a3a5a', { op: 0.9 }); }
  return { fray: F([[-28, 156]])[0] };
}

// ==== hand mirror (hexweaver: mirrorhex, theft, lies)
function mirror(f, o = {}) {
  const F = frame(o.at || [0, 0], o.ang || 0, 1), r = f.r, a0 = o.ang || 0;
  // handle: turned pewter rod, then bound in black thread with a bone charm and a pin through the binding
  f.part(F(limb([0, 170], [0, 430], 46, 36, { p: [[0.08, 0.3, 0.05], [0.5, 0.12, 0.2], [0.94, 0.4, 0.04]], q: [[0.08, 0.3, 0.05], [0.5, 0.12, 0.2], [0.94, 0.4, 0.04]] })), { fill: mix(PEWTER, '#000', 0.15), shade: 0.45, tex: T(f, 'mottle'), texOp: 0.6 });
  for (let i = 0; i < 9; i++) { const y = 240 + i * 11; f.line(F([[-23, y], [0, y + 5], [23, y + 1]]), 4, INK); f.line(F([[-22, y], [0, y + 5], [22, y + 1]]), 2, '#2e3428'); }
  f.part(F(ell([18, 300], 12, 9, 0.4, 10)), { fill: '#b8b090', shade: 0.3, inkW: 1.2, cast: false, hi: 0.2 }); // wax blob holding the thread, thumbprint
  for (let i = 0; i < 3; i++) f.line(F(ell([18, 300], 8 - i * 2.4, 6 - i * 1.8, 0.4, 10).slice(2, 9)), 0.8, '#6a6450', { op: 0.8 });
  f.line(F([[-30, 262], [34, 282]]), 2.6, INK); f.line(F([[-30, 262], [34, 282]]), 1.2, '#7a7c7a'); f.part(F(ell([-32, 261], 5, 5, 0, 8)), { fill: BONE, shade: 0.3, inkW: 1, cast: false }); // pin, bone head
  f.line([F([[-10, 340]])[0], F([[-30, 368]])[0], F([[-36, 392]])[0]], 1.4, '#2a2a20');
  f.part(F(ell([-38, 404], 13, 11, 0.2, 12)), { fill: BONE, shade: 0.35, inkW: 1.3, tex: T(f, 'mottle'), texOp: 0.4 }); f.flat(F(ell([-38, 400], 3, 3, 0, 6)), INK);
  f.line(F([[-46, 410], [-32, 412]]), 1, INK, { op: 0.6 });
  // frame: tarnished pewter oval, bead rim, scrollwork stub where the handle joins
  f.part(F(ell([0, 0], 158, 190, 0, 36)), { fill: PEWTER, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.6 });
  f.part(F([[-34, 168], [34, 168], [28, 204], [-28, 204]]), { fill: mix(PEWTER, '#000', 0.1), shade: 0.4, inkW: 1.3 });
  for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, p = [Math.cos(a) * 146, Math.sin(a) * 177]; if (r() < 0.12) continue; f.rivet(F([p])[0], 3.2, '#9a9c96'); }
  // glass: dark, cold, the room in it, the foe's guard caught inside
  const gl = ell([0, 0], 126, 156, 0, 36);
  f.part(F(gl), { fill: '#40444c', shade: 0.3, inkW: 2, inkHeavy: 3.4, hatch: false, hi: 0.02, tex: T(f, 'mottle'), texOp: 0.5 });
  f.flat(F([[-100, -90], [-60, -140], [20, -150], [-40, -60], [-90, 20]]), '#8a8e96', { op: 0.25 });
  // the caught guard: a shield warped by the curve of the glass, pale and wrong
  const sh = [[-44, -66], [40, -72], [46, -10], [26, 48], [-4, 76], [-30, 44], [-48, -6]];
  f.part(F(sh), { fill: '#8a8478', shade: 0.4, inkW: 1.4, inkHeavy: 2, cast: false, tex: T(f, 'wood'), texOp: 0.4 });
  f.part(F([[-34, -56], [30, -60], [34, -14], [18, 36], [-4, 58], [-22, 32], [-36, -8]]), { fill: '#6a665c', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false });
  f.rivet(F([[0, -6]])[0], 6, '#8a8a86');
  f.flat(F(gl), '#2a2e3a', { op: 0.35 });
  D.wear(f, F([[0, 0]])[0], 100, 130, 60, '#101218', '#c8ccd4');
  for (const [x, y, rr] of [[60, 80, 22], [-70, -40, 18], [20, 120, 16]]) D.stain(f, F([[x, y]])[0], rr, '#101014', { op: 0.3 }); // smudged fingermarks
  f.line(F([[-118, -20], [-110, 60], [-90, 110]]), 7, '#1a1c22', { op: 0.35 }); // the silvering going black at the rim
  // the crack: a star of cracks from a strike point, plus the void's clean bite out of the edge
  const cp = [40, -40];
  for (const a of [0.2, 1.3, 2.4, 3.3, 4.4, 5.4]) D.crack(f, F([cp])[0], a0 + a, 70 + r() * 60, { n: 5, lip: '#dfe2e8' });
  D.hole(f, F([[-62, 92]])[0], 28, 25, '#8a8e96', { ang: a0, th: 0.16 });
  const holes = undefined;
  f.line(F([[-96, -110], [-110, -50], [-108, 0]]), 5, '#e4e6ea', { op: 0.55 }); f.line(F([[-104, 30], [-98, 60]]), 4, '#e4e6ea', { op: 0.4 });
  // tarnish blooms, scratches and a dent on the frame
  for (const [x, y] of [[120, 60], [-140, -40], [60, 170], [-60, -175], [140, -90]]) D.bloom(f, F([[x, y]])[0], 14, '#2a2c28', { n: 3, specks: 6, op: 0.5 });
  f.scratches(F([[100, -130]])[0], 18, 5, '#e8e8e2'); f.flat(F(ell([-146, 80], 9, 14, 0.2, 10)), '#2a2c2a', { op: 0.45 });
  D.chip(f, F([[0, -190]])[0], 9, a0);
  f.part(F([[-30, -186], [-18, -212], [0, -222], [18, -212], [30, -186], [12, -196], [0, -200], [-12, -196]]), { fill: mix(PEWTER, '#000', 0.08), shade: 0.45, inkW: 1.3 });
  f.rivet(F([[0, -208]])[0], 3.4, '#9a9c96');
  f.line([F([[0, -214]])[0], F([[40, -236]])[0], F([[96, -222]])[0], F([[130, -186]])[0]], 1.6, '#2a2a20');
  f.part(F(ell([136, -170], 10, 13, 0.3, 10)), { fill: BONE, shade: 0.35, inkW: 1.2, tex: T(f, 'mottle'), texOp: 0.4 });
  f.flat(F(ell([136, -172], 2.4, 2.4, 0, 6)), INK);
  for (let i = 0; i < 6; i++) { const y = -60 + i * 8; f.line(F([[148, y], [166, y + 4]]), 3.4, INK); f.line(F([[148, y], [166, y + 4]]), 1.6, '#2e3428'); } // thread binding a cracked frame
  D.crack(f, F([[160, -70]])[0], a0 + 1.7, 60, { n: 4, forks: false, w: 1.6 });
  f.flat(F([[-90, -120], [-40, -150], [40, -152], [90, -120], [40, -128], [-40, -126]]), '#0a0a0e', { op: 0.35 }); // candle soot on the glass
  return { glass: F([[0, 0]])[0], left: F([[-158, -20]])[0], strike: F([cp])[0], holes };
}

// ==== bell (elementalist: ring, spectrum; abbey: toll)
function bell(f, o = {}) {
  const F = frame(o.at || [0, 0], o.ang || 0, 1), r = f.r, a0 = o.ang || 0;
  // headstock: an oak beam the bell hangs from, iron straps and bolts, a rope round its wheel stub
  f.part(F([[-170, -262, 1], [170, -268, 1], [174, -224, 1], [-168, -218, 1]]), { fill: OAK, shade: 0.45, tex: T(f, 'wood'), texOp: 0.8 });
  f.line(F([[-166, -258], [168, -264]]), 1.4, mix(OAK, '#fff', 0.4), { op: 0.6 });
  for (const x of [-60, 60]) { f.part(F([[x - 12, -270], [x + 12, -270], [x + 10, -190], [x - 10, -190]]), { fill: IRON, shade: 0.45, inkW: 1.3, sharp: true }); f.rivet(F([[x, -256]])[0], 3.4, '#6a6a66'); f.rivet(F([[x, -232]])[0], 3.4, '#6a6a66'); D.bloom(f, F([[x + 4, -210]])[0], 8, '#5a2a12', { n: 2, specks: 4, op: 0.6 }); }
  f.line(F([[150, -250], [190, -230], [206, -170], [198, -100]]), 7, INK); f.line(F([[150, -250], [190, -230], [206, -170], [198, -100]]), 4.4, '#8a7454');
  for (let i = 0; i < 6; i++) { const p = lerp(F([[195, -200]])[0], F([[200, -110]])[0], i / 6); f.line([p, add(p, [4, 6])], 1, INK, { straight: true, op: 0.7 }); }
  f.line(F([[198, -100], [190, -80]]), 1.2, '#8a7454'); f.line(F([[198, -100], [206, -78]]), 1.2, '#8a7454');
  // wax drips from the belfry's candles on the beam
  D.wax(f, F([[-140, -220], [-128, -222], [-116, -220]]), WAX, { thick: 3, drips: 1, dripL: 22 });
  // the bell: crown, shoulder, waist, sound bow, lip; bronze, green in the crevices
  const prof = [[-50, -200], [-80, -186], [-104, -150], [-112, -80], [-122, 0], [-146, 70], [-178, 118], [-196, 150]];
  const bodyP = [...prof, [-188, 166, 1], [0, 178], [188, 166, 1], ...prof.slice().reverse().map(p => [-p[0], p[1]])];
  // the mouth first (seen from a little below): dark inside, the iron clapper hanging in it
  f.flat(F(ell([0, 160], 190, 26, 0, 24)), '#120c08');
  f.part(bodyP.map(p => F([p])[0]), { fill: BRONZE, shade: 0.45, hi: 0.1, tex: T(f, 'mottle'), texOp: 0.6 });
  {
    const out = bodyP.map(p => F([p])[0]), L = [], L2 = [];
    for (let y = -170; y < 166; y += 8) { const hw = y < -80 ? 112 : y < 0 ? 112 + (y + 80) * 0.12 : 122 + Math.pow(y / 166, 2) * 74; L.push(F([[hw * 0.15 + r() * 10, y + 6 + r() * 2], [hw * 0.6, y + 10], [hw * 1.05, y + 4]])); }
    D.contour(f, out, L, { w: 1.7, op: 0.75, dash: '18 5 30 4' });
    for (let x = -100; x < -10; x += 13) L2.push(F([[x, -170], [x * 1.08, -60], [x * 1.35, 60], [x * 1.7, 150]]));
    D.contour(f, out, L2, { w: 1, op: 0.3, dash: '24 9' });
    D.wear(f, F([[-40, 20]])[0], 110, 120, 40, '#2a1a0c', '#e8c890');
  }
  f.part(F(limb([0, 40], [0, 168], 12, 12, { capK: 0.5 })), { fill: IRON, shade: 0.4, inkW: 1.2, cast: false });
  f.part(F(ell([0, 176], 22, 18, 0, 14)), { fill: IRON, shade: 0.45, inkW: 1.5 });
  // crown loops
  for (const x of [-30, 0, 30]) f.part(F([[x - 10, -198], [x - 12, -222], [x, -232], [x + 12, -222], [x + 10, -198], [x + 4, -198], [x + 5, -218], [x, -224], [x - 5, -218], [x - 4, -198]]), { fill: mix(BRONZE, '#000', 0.15), shade: 0.4, inkW: 1.2 });
  // cast bands and the inscription, letters worn half away
  const band = (y, w0, w1) => { f.line(F([[w0, y], [0, y + 8], [w1, y]]), 2.2, INK, { op: 0.8 }); f.line(F([[w0 + 2, y + 3], [0, y + 11], [w1 - 2, y + 3]]), 1.2, mix(BRONZE, '#fff', 0.4), { op: 0.6 }); };
  band(-148, -104, 104); band(-118, -110, 110);
  const hwAt = y => y < -80 ? 108 : y < 0 ? 108 + (y + 80) * 0.15 : 122 + Math.pow(y / 166, 2) * 74;
  const ring = (y0, y1, col) => { const L = [], R = []; for (let i = 0; i <= 6; i++) { const y = y0 + (y1 - y0) * i / 6; L.push([-hwAt(y) - 3, y + 6 * Math.sin(Math.PI * i / 6) * 0]); R.push([hwAt(y) + 3, y]); } f.part(F([...L.map(p => [p[0], p[1]]), [0, y1 + 10], ...R.reverse(), [0, y0 + 8]].map((p, i, a) => p)), { fill: col, shade: 0.5, hi: 0.12, tex: T(f, 'mottle'), texOp: 0.6, inkW: 1.5 }); };
  ring(-156, -138, mix(BRONZE, '#000', 0.08)); ring(92, 118, mix(BRONZE, '#fff', 0.05)); ring(132, 150, mix(BRONZE, '#000', 0.12));
  for (const [x, y, rr] of [[-70, 40, 40], [50, -60, 34], [80, 60, 30], [-30, -80, 26]]) D.bloom(f, F([[x, y]])[0], rr, mix(BRONZE, '#1a0c04', 0.45), { n: 4, specks: 8, op: 0.35 });
  for (let i = 0; i < 26; i++) { const p = F([[-90 + r() * 170, -100 + r() * 190]])[0]; f.line(ell(p, 4 + r() * 3, 2 + r() * 1.5, 0.3, 8).slice(0, 5), 1, '#2a1a0c', { op: 0.5 }); } // hammer marks
  for (let i = 0; i < 14; i++) { if (r() < 0.25) continue; const x = -86 + i * 13, y = -138 + Math.abs(x) * 0.0 + 4 * Math.cos(x / 100); f.line(F([[x, y], [x + 2, y + 12]]), 1.6, INK, { op: 0.75, straight: true }); if (r() < 0.6) f.line(F([[x - 2, y + 5], [x + 5, y + 4]]), 1.2, INK, { op: 0.7, straight: true }); }
  // verdigris in the crevices under the bands and at the crown
  for (const [x, y, rr] of [[-90, -110, 16], [60, -112, 14], [-150, 112, 18], [120, 116, 16], [0, -190, 14], [-40, 128, 12]]) D.bloom(f, F([[x, y]])[0], rr, mix(VERD, BRONZE, 0.35), { n: 3, specks: 4, op: 0.45 });
  // worn bright where hands and the clapper wore it, a crack up from the lip, a dent, scratches, a chipped lip
  f.line(F([[-80, -150], [-92, -80], [-106, 0], [-130, 70]]), 5, '#e8c890', { op: 0.45 });
  D.crack(f, F([[70, 172]])[0], a0 - 1.75, 120, { n: 6, w: 2.4, lip: '#e8c890' });
  f.flat(F(ell([-60, 30], 16, 10, -0.4, 10)), '#2a1a0c', { op: 0.4 }); f.line(F([[-72, 26], [-50, 22]]), 1, '#e8c890', { op: 0.6 });
  f.scratches(F([[40, -40]])[0], 30, 7, '#e8d0a0');
  D.chip(f, F([[-150, 162]])[0], 9, a0 + Math.PI);
  // the target's spectrum: five courses daubed on the bronze by hand
  D.label(f, F([[-100, -244]])[0], 40, 30, a0 - 0.08, '#cdbb94', (G) => { for (let k = 0; k < 3; k++) f.line(G([[-14, -8 + k * 7], [12, -8 + k * 7]]), 1, INK, { op: 0.7, dash: '5 2 3 2' }); });
  f.rivet(F([[-100, -254]])[0], 2.4, '#5a5a56');
  for (let i = 0; i < 4; i++) { const x = 120 + i * 9; f.line(F([[x, -268], [x + 4, -222]]), 3.4, INK); f.line(F([[x, -268], [x + 4, -222]]), 1.8, '#8a7454'); }
  for (const [x, y] of [[-40, -264], [20, -266], [130, -266]]) { f.flat(F([[x, y], [x + 6, y], [x + 4, y + 10], [x + 2, y + 14]]), '#d8d4c4', { op: 0.85 }); }
  D.wear(f, F([[0, -175]])[0], 60, 20, 16, '#2a1a0c', '#e8c890');
  return { strike: F([[150, 96]])[0], body: F([[0, -10]])[0], lip: F([[0, 170]])[0] };
}

// ==== a foe's shield (guards, block taken or broken)
// a battered heater shield of oak planks in an iron rim, its paint worn; o.bites = [[x, y, r]] clean void holes
function shield(f, o = {}) {
  const F = frame(o.at || [0, 0], o.ang || 0, o.s || 1), r = f.r, a0 = o.ang || 0, sc = o.s || 1;
  const out = [[-84, -112, 1], [-30, -120], [30, -120], [84, -112, 1], [86, -40], [70, 30], [36, 90], [0, 128, 1], [-36, 90], [-70, 30], [-86, -40]];
  f.part(F(out), { fill: '#5e4a34', shade: 0.45, tex: T(f, 'wood'), texOp: 0.8 });
  // the device painted on it long ago, flaking: a chevron in drowned blue
  const chev = [[-80, -10], [0, -80], [80, -10], [80, 28], [0, -40], [-80, 28]];
  D.contour(f, F(out), [], {});
  f.part(F(chev), { fill: '#3e5662', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 0.7 });
  for (let i = 0; i < 9; i++) { const p = F([[-60 + r() * 120, -50 + r() * 60]])[0]; f.flat(E.ell(p, 3 + r() * 6, 2 + r() * 4, r() * 3, 7), '#5e4a34', { op: 0.95 }); }
  for (const x of [-42, 0, 42]) f.line(F([[x, -118], [x * 0.9, 40], [x * 0.5, 100]]), 2, INK, { op: 0.85 });
  // iron rim and its rivets
  f.line(F(out.concat([out[0]])), 11, INK); f.line(F(out.concat([out[0]])), 7, IRON); f.line(F(out.slice(0, 5)), 2, '#8a8a86', { op: 0.6 });
  for (let i = 0; i < out.length; i++) f.rivet(F([lerp(out[i], out[(i + 1) % out.length], 0.5)])[0], 2.6 * sc, '#7a7a76');
  // use: gouges, a split plank, old blood
  for (const [x, y, a] of [[-40, -70, 0.4], [20, 50, -0.6], [-20, 20, 0.9]]) f.flat(F([[x - 14, y - 2], [x + 14, y + 2], [x + 13, y + 5], [x - 14, y + 1]].map(q => add(rot(sub(q, [x, y]), a), [x, y]))), '#1c120a');
  D.crack(f, F([[-20, 100]])[0], a0 - 1.7, 90, { n: 5, lip: '#a88a62' });
  f.spatter(F([[30, 60]])[0], 22, 12);
  f.scratches(F([[0, -90]])[0], 30, 6, '#c8b090');
  // the void's bites: clean round holes, rims drawn, nothing behind them
  const holes = undefined;
  for (const [x, y, rr] of o.bites || []) D.hole(f, F([[x, y]])[0], rr * sc, rr * sc, '#7a5e40', { ang: a0, th: 0.25 });
  return { holes, right: F([[90, -20]])[0], centre: F([[0, 0]])[0] };
}

module.exports = { shield, flask, hourglass, robeScrap, mirror, bell, IRON, PEWTER, BRONZE, VERD, OAK, COPPER, PITCH, WAX };
