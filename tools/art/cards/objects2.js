// The card object library, part two: about thirty smaller devices drawn with the figure engine in kit.base, each
// dressed (D.dress: contour hatching, wear, grime, clipped to the part) and carrying its own named details.
// Every builder: (f, o) with o.ang (tilt through a frame), o.course (tints where the course shows), o.seed variety.
// Local origin at the object's middle, about 360 to 440 figure px tall. Returns { focus } for card FX to aim at.
'use strict';
const K = require('./card_kit');
const SB = (F, b) => require('./card_kit').E.bbox(F([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]]));   // a signature box given in the object's own frame, as a figure-space box (L16)
const { E, D, INK, BONE } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb } = E;

const IRON = '#4d4f52', OAK = '#5b412a', OAKL = '#7a5a3a', LEATHER = '#5a3e28', LINEN = '#c8bca0', CLAY = '#8a5a3a', STRAW = '#9a8a5a',
  SACK = '#8a7a5a', TALLOW = '#cfc3a0', BONEC = '#d4c8a8', PEWTER = '#8a8c86', TWINE = '#9a8460', RUST = '#5a2a12', VERD = '#4f7a66';
const TINT = { physical: '#7a6448', fire: '#b8541f', frost: '#9ab8c8', lightning: '#c9a43a', water: '#2f4f8f', toxin: '#7d9a3a', void: '#4b2a5c' };
const T = (f, n) => n + f.o.seed;
const loop = pts => pts.concat([pts[0]]);
// a filled, shaded, dressed part; returns its outline in card space
function P(f, F, pts, fill, o = {}) {
  const q = F(pts);
  f.part(q, Object.assign({ fill, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 }, o));
  if (o.dress !== false) D.dress(f, q, Object.assign({ lw: 1.2, op: 0.45 }, o.dressO || {}));
  return q;
}
// a turned profile [[halfwidth, y], ...] from the bottom up, as a closed outline
// a turned profile [[halfwidth, y], ...] from the base up, closed with the front arc of the base ellipse, because the
// viewpoint is a little above the object (Form checklist: openings and bases are ellipses)
const turned = prof => { const [w0, y0] = prof[0], arc = []; for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; arc.push([w0 * Math.cos(t), y0 + w0 * 0.2 * Math.sin(t)]); } return [...prof.map(([w, y]) => [-w, y]).reverse().reverse(), ...prof.slice().reverse().map(([w, y]) => [w, y]), ...arc]; };
const L = (f, F, pts, w, col, o) => f.line(F(pts), w, col, o);
// a candle or lamp flame: a guttering tongue, dark-edged, never a cartoon fire
// a flame is requested, not drawn: the composition draws it in ink (L18)
function flame(f, F, b, h, col = '#c8642a') { K.fxReq(f, 'flame', F([b])[0], h, { col }); }

const O = {};

// ==== vessels
O.jar = (f, o = {}) => { // clay pot with a waxed cloth cover tied down; a rag fuse when it is a fire pot
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  P(f, F, turned([[70, 150], [118, 80], [128, 10], [110, -70], [72, -110], [80, -128]]), CLAY, { tex: T(f, 'mottle'), texOp: 0.7 });
  L(f, F, [[-124, 30], [0, 44], [124, 30]], 2, mix(CLAY, '#000', 0.4), { op: 0.7 }); L(f, F, [[-118, 60], [0, 74], [118, 60]], 1.4, mix(CLAY, '#000', 0.4), { op: 0.6 });
  for (let i = 0; i < 5; i++) f.flat(F([[-100 + i * 40, -60], [-92 + i * 40, -10 - r() * 30], [-86 + i * 40, -60]]), '#5a3a20', { op: 0.6 }); // glaze runs
  P(f, F, [[-96, -120], [-60, -150], [0, -158], [60, -150], [96, -120], [84, -96], [40, -104], [0, -100], [-40, -104], [-84, -96]], LINEN, { tex: T(f, 'weave'), texOp: 0.6 });
  D.twine(f, F([[-82, -112], [-82, -104]]), F([[82, -112], [82, -104]]), 3, TWINE, { knot: F([[84, -106]])[0], ends: [F([[100, -90], [104, -64]])] });
  D.chip(f, F([[60, -112]])[0], 10, o.ang || 0); D.crack(f, F([[-40, 140]])[0], -1.2, 80, { n: 4, lip: '#e0c0a0' });
  if (o.course === 'fire') { L(f, F, [[0, -158], [8, -190], [-4, -214]], 6, INK); L(f, F, [[0, -158], [8, -190], [-4, -214]], 3.6, '#8a7458'); flame(f, F, [-4, -212], 40); }
  return { focus: F([[0, -40]])[0] };
};
O.vial = (f, o = {}) => { // a tall stoppered bottle of draught, label and wax, the brew coloured by its course
  const F = frame([0, 0], o.ang || 0, 1), r = f.r, liq = mix(TINT[o.course] || '#6a2018', '#2a1a10', o.course === 'physical' ? 0.1 : 0.3);
  const out = turned([[62, 170], [70, 120], [70, 0], [54, -50], [26, -80], [24, -150], [30, -160]]);
  P(f, F, out, mix('#5a4a30', liq, 0.5), { tex: T(f, 'mottle'), texOp: 0.7 });
  for (let i = 0; i < 5; i++) L(f, F, [[30 + i * 7, -40], [44 + i * 5, 150]], 1.4 + (i % 2), i % 2 ? '#e8e4d0' : '#1a1410', { op: 0.3 });   // reflections down the glass (L3)
  P(f, F, [[-66, 20], [-20, 12], [20, 16], [66, 10], ...turned([[62, 170], [70, 120], [68, 20]]).slice(3, 6).reverse()], liq, { shade: 0.5, dress: false, cast: false, inkW: 1.1 });
  L(f, F, [[-66, 20], [-20, 12], [20, 16], [66, 10]], 1.6, mix(liq, '#fff', 0.45), { op: 0.8 });
  L(f, F, [[-50, -20], [-56, 40], [-52, 110]], 5, '#e8e4d0', { op: 0.45 });
  D.label(f, F([[4, 80]])[0], 84, 60, (o.ang || 0) - 0.04, '#cdbb94', (G) => { for (let k = 0; k < 3; k++) f.line(G([[-30, -14 + k * 12], [26, -16 + k * 12]]), 1.1, INK, { op: 0.7, dash: '7 3 4 2' }); });
  P(f, F, [[-22, -160], [-26, -206], [26, -208], [22, -160]], '#8a6a44', { tex: T(f, 'mottle'), texOp: 0.8 });
  D.wax(f, F([[-30, -196], [-18, -212], [0, -214], [18, -212], [30, -196]]), '#3a2a20', { thick: 6, drips: 1, dripL: 40 });
  D.twine(f, F([[-25, -140], [-25, -134]]), F([[25, -140], [25, -134]]), 2, TWINE, { knot: F([[26, -136]])[0], ends: [F([[40, -120], [46, -96]])] });
  if (o.sprig) for (let i = 0; i < 4; i++) { const b = F([[40 + i * 4, -120]])[0]; f.part(ell(add(b, [10 + i * 6, -10 - i * 12]), 12, 5, -0.6 + i * 0.3, 8), { fill: '#6a7a44', shade: 0.4, inkW: 1, cast: false }); }
  D.chip(f, F([[20, -160]])[0], 6, o.ang || 0);
  return { focus: F([[0, 40]])[0], mouth: F([[0, -210]])[0], grip: { c: F([[0, -112]])[0], thumb: (o.ang || 0) - Math.PI / 2 } };   // held up by the neck
};
O.keg = (f, o = {}) => { // a powder keg: staves, iron hoops, a fuse burning down
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  const out = [[-110, 150], [-128, 60], [-132, -20], [-124, -110], [-104, -150], [104, -150], [124, -110], [132, -20], [128, 60], [110, 150]];
  P(f, F, out, OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  for (const x of [-80, -36, 10, 56, 98]) L(f, F, [[x * 0.85, 150], [x * 1.02, -20], [x * 0.8, -150]], 1.6, INK, { op: 0.8 });
  for (const y of [-118, 110]) { L(f, F, [[-128, y], [0, y + 10], [128, y]], 12, INK); L(f, F, [[-126, y], [0, y + 10], [126, y]], 8, IRON); for (const x of [-90, -30, 30, 90]) f.rivet(F([[x, y + 6]])[0], 2.6, '#6a6a66'); D.bloom(f, F([[60, y + 4]])[0], 14, RUST, { n: 2, specks: 5 }); }
  f.part(F(ell([0, -150], 104, 20, 0, 18)), { fill: mix(OAKL, '#fff', 0.1), shade: 0.35, inkW: 1.4, tex: T(f, 'wood'), texOp: 0.5 });
  f.part(F(ell([30, -152], 14, 6, 0, 10)), { fill: '#2a1a10', shade: 0.2, inkW: 1, cast: false });
  L(f, F, [[30, -154], [44, -190], [30, -226], [50, -250]], 5, INK); L(f, F, [[30, -154], [44, -190], [30, -226], [50, -250]], 2.8, '#6a5a44');
  flame(f, F, [50, -250], 30, '#e07a30');
  f.part(F([[-60, 20], [40, 14], [44, 70], [-56, 76]]), { fill: '#c8b890', shade: 0.3, inkW: 1.2, tex: T(f, 'mottle'), texOp: 0.5 });
  L(f, F, [[-40, 30], [20, 60]], 3, '#7a1a12', { op: 0.85 }); L(f, F, [[20, 30], [-40, 60]], 3, '#7a1a12', { op: 0.85 }); // a rubric warning cross on the label
  for (let i = 0; i < 20; i++) f.flat(F(ell([-90 + r() * 180, 150 + r() * 14], 1.6, 1.2, 0, 6)), '#1a1410', { op: 0.8 }); // spilled powder
  return { focus: F([[0, -40]])[0] };
};
O.cup = (f, o = {}) => { // a dented pewter cup, brimming with something dark
  const F = frame([0, 0], o.ang || 0, 1);
  P(f, F, turned([[90, 170], [96, 150], [30, 130], [22, 60], [40, 30], [100, -20], [124, -140], [130, -150]]), PEWTER);
  f.part(F(ell([0, -148], 128, 26, 0, 20)), { fill: '#2a1a14', shade: 0.2, inkW: 1.6, cast: false });
  f.flat(F(ell([0, -144], 110, 18, 0, 20)), o.course === 'physical' ? '#4c0c08' : mix(TINT[o.course] || '#4c0c08', '#000', 0.4), { op: 0.95 });
  f.flat(F(ell([-30, -150], 30, 4, 0, 10)), '#f0e0d0', { op: 0.35 });
  for (const x of [-60, 40, 90]) { L(f, F, [[x, -140], [x + 4, -100], [x + 2, -70]], 4, '#4c0c08', { op: 0.85 }); f.flat(F(ell([x + 2, -68], 4, 6, 0, 8)), '#4c0c08'); }
  f.part(F(ell([0, 152], 98, 20, 0, 20)), { fill: mix(PEWTER, '#000', 0.1), shade: 0.4, inkW: 1.5, cast: false }); L(f, F, [[-40, 36], [0, 42], [40, 36]], 6, mix(PEWTER, '#000', 0.3));
  f.flat(F(ell([70, -60], 18, 10, 0.4, 10)), '#2a2c2a', { op: 0.45 }); f.flat(F(ell([-40, 160], 22, 6, 0, 10)), '#2a2c2a', { op: 0.45 }); // dents
  f.scratches(F([[-30, -60]])[0], 30, 7, '#e8e8e2');
  return { focus: F([[0, -150]])[0] };
};
O.bowl = (f, o = {}) => { // a wooden bowl with a ladle in it; broth, milk or worse
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  L(f, F, [[60, -40], [130, -200], [150, -250]], 14, INK); L(f, F, [[60, -40], [130, -200], [150, -250]], 9, mix(OAKL, '#fff', 0.1));
  P(f, F, [[-200, 0], [200, 0], [176, 60], [120, 110], [60, 126], [-60, 126], [-120, 110], [-176, 60]], OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  f.part(F(ell([0, 0], 200, 40, 0, 24)), { fill: '#3a2414', shade: 0.25, inkW: 1.6, cast: false });
  const soup = o.milk ? '#d8d0b4' : mix(TINT[o.course] || '#7a6040', '#4a3a20', 0.5);
  f.flat(F(ell([0, 6], 184, 30, 0, 24)), soup);
  for (let i = 0; i < 9; i++) f.flat(F(ell([-140 + r() * 280, -4 + r() * 18], 6 + r() * 12, 3 + r() * 3, 0, 8)), mix(soup, '#000', 0.3), { op: 0.7 });
  if (!o.milk) { f.part(F([[-30, 2], [-20, -20], [-2, -24], [6, -8], [-6, 4]]), { fill: BONEC, shade: 0.35, inkW: 1.2, cast: false }); L(f, F, [[-24, -12], [-6, -16]], 1, INK); } // a knuckle in it
  L(f, F, [[-176, 60], [0, 80], [176, 60]], 1.6, INK, { op: 0.6 }); D.crack(f, F([[-120, 110]])[0], -1.4, 70, { n: 4 });
  return { focus: F([[0, 0]])[0] };
};
O.cauldron = O.bowl;

// ==== hexwork
O.poppet = (f, o = {}) => { // a straw poppet in a sackcloth smock, cord at the neck, pins driven in
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  for (const [a, b] of [[[-40, 60], [-80, 200]], [[30, 60], [70, 200]], [[-60, -60], [-170, 20]], [[50, -60], [160, 10]]]) { f.part(F(limb(a, b, 40, 28, { capK: 0.4 })), { fill: STRAW, shade: 0.45, tex: T(f, 'wood'), texOp: 0.6 }); for (let i = 0; i < 6; i++) { const p = lerp(F([b])[0], F([a])[0], i / 8); f.line([add(p, [-8, -4]), add(p, [6, 6]), add(p, [12, 22])], 1, '#5a4a20', { op: 0.7 }); } L(f, F, [lerp(a, b, 0.78), lerp(a, b, 0.84)], 6, INK); }
  P(f, F, [[-70, -90], [70, -90], [86, 30], [96, 100], [-90, 104], [-80, 30]], SACK, { tex: T(f, 'weave'), texOp: 0.7 });
  P(f, F, ell([0, -150], 66, 72, 0, 20), mix(SACK, '#fff', 0.15), { tex: T(f, 'weave'), texOp: 0.7 });
  for (const x of [-26, 24]) { L(f, F, [[x - 10, -170], [x + 10, -150]], 3, INK); L(f, F, [[x + 10, -170], [x - 10, -150]], 3, INK); } // stitched eyes
  f.stitches(F([[-30, -116], [0, -110], [30, -118]]), '#2a1a10', 1.6);
  D.twine(f, F([[-40, -88], [-40, -80]]), F([[40, -88], [40, -80]]), 3, '#1a1410', { knot: F([[42, -84]])[0], ends: [F([[60, -60], [56, -30]])] });
  const pins = o.pins ?? 3;
  for (let i = 0; i < pins; i++) { const p = F([[-30 + i * 30, -40 + (i % 2) * 40]])[0], a = (o.ang || 0) - 0.9 - i * 0.2, t = add(p, rot([-90, 0], a)); f.line([t, add(p, rot([30, 0], a))], 3.4, INK); f.line([t, add(p, rot([30, 0], a))], 1.6, '#9a9c96'); f.part(ell(t, 7, 7, 0, 8), { fill: i ? BONE : '#2a2a2a', shade: 0.3, inkW: 1, cast: false }); f.flat(ell(p, 4, 4, 0, 6), '#4c0c08', { op: 0.85 }); }
  D.stain(f, F([[20, 40]])[0], 26, '#3a2414', { op: 0.35 }); f.spatter(F([[-20, 0]])[0], 30, 10);
  return { focus: F([[0, -60]])[0] };
};
O.needle = (f, o = {}) => { // an iron sail needle and a length of waxed cord pulled through, knotted, a drop of blood
  const F = frame([0, 0], o.ang || -0.5, 1);
  P(f, F, [[-200, -6], [140, -10], [210, 0], [140, 10], [-200, 6], [-214, 0]], '#8a8c8a', { dress: false, inkW: 1.6 });
  f.flat(F(ell([-180, 0], 14, 3, 0, 10)), '#0a0a0a'); L(f, F, [[-200, -4], [150, -6]], 1, '#e8e8e2', { op: 0.7 });
  D.bloom(f, F([[-60, 0]])[0], 12, RUST, { n: 2, specks: 6 });
  const cord = [[-180, 0], [-240, 40], [-220, 130], [-100, 150], [0, 110], [60, 160], [140, 200]];
  L(f, F, cord, 7, INK); L(f, F, cord, 4.4, '#b8a070'); for (let i = 1; i < cord.length; i++) L(f, F, [lerp(cord[i - 1], cord[i], 0.5), lerp(cord[i - 1], cord[i], 0.55)], 1.4, INK, { op: 0.7 });
  f.part(F(ell([0, 110], 14, 11, 0, 10)), { fill: '#b8a070', shade: 0.4, inkW: 1.2, cast: false });
  D.wax(f, F([[-60, 148], [-40, 146], [-20, 140]]), '#d8c890', { thick: 3, drips: 1, dripL: 20 });
  f.flat(F(ell([200, 18], 7, 9, 0, 10)), '#4c0c08'); f.flat(F([[196, 26], [204, 26], [200, 60]]), '#4c0c08');
  return { focus: F([[100, 0]])[0] };
};
O.cord = (f, o = {}) => { // a knotted cord with charms bound into it: a bone, an iron ring, a pouch, a tooth, one feather
  const F = frame([0, 0], o.ang ?? 0.25, 1), r = f.r, pts = [[-30, -250], [20, -170], [-10, -80], [30, 10], [0, 100], [40, 190], [20, 250]];
  L(f, F, pts, 10, INK); L(f, F, pts, 6.4, '#3a3026');
  const P2 = K.catmull(pts, 6);
  for (let i = 3; i < P2.length - 2; i += 3) { const q = F([P2[i]])[0]; f.line([add(q, [-6, -3]), add(q, [6, 3])], 1.2, '#7a6a54', { op: 0.8, straight: true }); }
  const knot = (p) => { const q = F([p])[0]; f.part(ell(q, 13, 11, 0.4, 12), { fill: '#3a3026', shade: 0.45, inkW: 1.3, cast: false }); f.line(ell(q, 8, 6, 0.4, 10).slice(1, 6), 1.1, '#7a6a54', { op: 0.8 }); f.line([add(q, [-10, 4]), add(q, [-18, 18]), add(q, [-14, 30])], 2.4, '#3a3026'); };
  [[20, -170], [-10, -80], [30, 10], [0, 100], [40, 190]].forEach(knot);
  // the charms, each bound on with its own twist of thread
  P(f, F, limb([24, -164], [110, -120], 22, 16, { capK: 0.9 }), BONEC, { dressO: { op: 0.35 } }); L(f, F, [[60, -152], [66, -134]], 3, INK);
  f.line(F(loop(ell([-60, -60], 30, 30, 0, 18))), 11, INK); f.line(F(loop(ell([-60, -60], 30, 30, 0, 18))), 7, IRON); L(f, F, [[-10, -80], [-34, -70]], 3, '#3a3026'); D.bloom(f, F([[-80, -50]])[0], 8, RUST, { n: 2, specks: 3 });
  P(f, F, [[40, 20], [96, 10], [110, 70], [80, 96], [40, 80]], LEATHER, { tex: T(f, 'mottle'), texOp: 0.7 }); D.twine(f, F([[44, 28], [46, 36]]), F([[96, 18], [98, 26]]), 2, '#2a2420'); f.stitches(F([[60, 60], [96, 56]]), '#c8b08a', 1);
  P(f, F, [[-6, 108], [-40, 130], [-60, 170], [-36, 160], [-14, 126]], '#e8e0c8', { dress: false });
  const fq = F([[46, 196]])[0], ft = F([[120, 250]])[0]; f.part([fq, add(lerp(fq, ft, 0.5), [14, -10]), ft, add(lerp(fq, ft, 0.5), [-10, 12])], { fill: '#5a4a3a', shade: 0.45, inkW: 1.2, cast: false, k: 0.8 }); f.line([fq, ft], 1.2, INK); for (let k = 1; k < 7; k++) { const b = lerp(fq, ft, k / 7); f.line([b, add(b, [12, -2])], 0.9, INK, { op: 0.6 }); f.line([b, add(b, [-2, 12])], 0.9, INK, { op: 0.6 }); }
  f.part(F(ell([18, 262], 16, 14, 0, 12)), { fill: BONEC, shade: 0.4, inkW: 1.3 }); f.flat(F(ell([18, 262], 4, 4, 0, 6)), INK);
  return { focus: F([[0, 0]])[0], top: F([[-30, -250]])[0] };
};
O.knife = (f, o = {}) => { // the bone knife: a long nicked blade, a carved bone grip bound in cord, old blood in the fuller
  const F = frame([0, 0], o.ang ?? -0.4, 1), r = f.r;
  P(f, F, [[-40, -14], [120, -20], [200, -20], [262, -2], [210, 16], [120, 18], [-40, 14]], '#a8acae', { dressO: { op: 0.4 } });
  L(f, F, [[-30, -2], [210, -6]], 3, mix('#a8acae', '#000', 0.45)); L(f, F, [[-30, -11], [200, -18]], 1.4, '#f0f0ea', { op: 0.8 }); L(f, F, [[-30, 12], [190, 14]], 1.2, INK, { op: 0.6 });
  for (const x of [50, 100, 150, 190]) D.chip(f, F([[x, -18]])[0], 5 + r() * 3, (o.ang ?? -0.4) + Math.PI);
  L(f, F, [[0, 2], [140, 0], [180, 6]], 3.4, '#4c0c08', { op: 0.85 }); D.bloom(f, F([[30, 6]])[0], 12, RUST, { n: 2, specks: 6 });
  f.scratches(F([[120, 0]])[0], 30, 8, '#f0f0ea');
  P(f, F, [[-62, -30], [-40, -32], [-38, 32], [-62, 30]], IRON, { sharp: true, dressO: { op: 0.4 } }); f.rivet(F([[-50, 0]])[0], 4, '#6a6a66');
  P(f, F, [[-200, -20], [-62, -18], [-62, 18], [-200, 24], [-224, 8], [-226, -8]], BONEC, { tex: T(f, 'mottle'), texOp: 0.7 });
  for (let i = 0; i < 5; i++) { const x = -190 + i * 12; L(f, F, [[x, -20], [x + 8, 20]], 3.6, INK); L(f, F, [[x, -20], [x + 8, 20]], 1.8, '#3a2a1a'); }
  for (const x of [-120, -96]) L(f, F, [[x, -14], [x + 10, 0], [x, 14]], 1.4, INK, { op: 0.7 }); // carved rings
  f.part(F(ell([-232, 0], 14, 20, 0, 12)), { fill: mix(BONEC, '#000', 0.1), shade: 0.4, inkW: 1.3 }); f.flat(F(ell([-236, 0], 4, 6, 0, 8)), INK);
  L(f, F, [[-232, 12], [-250, 50], [-236, 90]], 2.4, '#3a2a1a');
  f.spatter(F([[140, 22]])[0], 50, 18);
  return { focus: F([[200, 0]])[0], grip: { c: F([[-140, 0]])[0], thumb: (o.ang ?? -0.4) } };
};
O.eye = (f, o = {}) => { // a bone amulet with an eye painted on it (void cards only), on a cord, cracked
  const F = frame([0, 0], o.ang || 0, 1);
  L(f, F, [[-160, -220], [-60, -170], [0, -150]], 2.4, '#2a2420'); L(f, F, [[160, -220], [60, -170], [0, -150]], 2.4, '#2a2420');
  P(f, F, ell([0, 10], 150, 160, 0, 30), BONEC, { tex: T(f, 'mottle'), texOp: 0.6 });
  f.part(F(ell([0, -150], 14, 14, 0, 10)), { fill: IRON, shade: 0.4, inkW: 1.2 });
  f.part(F([[-100, 10], [-40, -40], [40, -42], [100, 10], [40, 56], [-40, 58]]), { fill: '#e8e0cc', shade: 0.3, inkW: 2.2, cast: false });
  f.part(F(ell([6, 8], 36, 40, 0, 16)), { fill: '#4b2a5c', shade: 0.4, inkW: 1.6, cast: false });
  f.flat(F(ell([6, 8], 15, 17, 0, 12)), '#08060a'); f.flat(F(ell([-4, -4], 5, 5, 0, 8)), '#f0e8f0', { op: 0.9 });
  L(f, F, [[-100, 10], [-40, -54], [40, -56], [100, 10]], 2, INK, { op: 0.8 });
  D.crack(f, F([[-60, 140]])[0], -1.2, 110, { n: 5 }); D.hole(f, F([[90, 110]])[0], 14, 14, mix(BONEC, '#000', 0.1));
  return { focus: F([[6, 8]])[0] };
};
O.shard = (f, o = {}) => { // a long mirror shard hung on thread, a face that is not there in it
  const F = frame([0, 0], o.ang || 0.15, 1);
  const out = [[10, -180, 1], [50, -150, 1], [90, -120, 1], [80, -30, 1], [70, 60, 1], [44, 150, 1], [20, 220, 1], [-20, 120, 1], [-60, 40, 1], [-70, -30, 1], [-80, -100, 1]];
  D.slab(f, F(out.map(p => [p[0], p[1]])), [12, 9], '#1e2024');   // the glass has thickness: a dark silvered edge (review 3: origami)
  P(f, F, out, '#5a5e66', { sharp: true, dress: false, tex: T(f, 'mottle'), texOp: 0.8, hatch: true });
  for (let i = 0; i < 7; i++) { const y = -140 + i * 50; L(f, F, [[-70 + i * 6, y], [60 - i * 4, y - 60]], 2 + (i % 3), i % 2 ? '#c8ccd4' : '#2a2c32', { op: i % 2 ? 0.35 : 0.3 }); }   // the room in it, cold streaks
  f.flat(F([[-60, -90], [40, -130], [-30, 40]]), '#a8acb8', { op: 0.3 });
  D.crack(f, F([[0, -60]])[0], 1.3, 140, { n: 5, lip: '#dfe2e8' });
  L(f, F, [[10, -180], [90, -120], [70, 60], [20, 220], [-60, 40], [-80, -100], [10, -180]], 3, INK, { straight: true });
  L(f, F, [[-70, -96], [-50, 30]], 3, '#e4e6ea', { op: 0.6 }); D.wear(f, F([[0, 0]])[0], 40, 120, 30, '#101218', '#c8ccd4');
  f.spatter(F([[30, 120]])[0], 30, 10);
  return { focus: F([[0, 0]])[0] };
};

// ==== fire, light, wax
O.candle = (f, o = {}) => { // tallow candles on an iron pricket, wax run down to the dish; black tallow for void
  const F = frame([0, 0], o.ang || 0, 1), r = f.r, wax = o.course === 'void' ? '#2a2430' : TALLOW;
  P(f, F, [[-150, 180], [150, 180], [120, 150], [-120, 150]], IRON, { dressO: { op: 0.4 } });
  P(f, F, limb([0, 150], [0, 110], 30, 24), IRON, { dress: false });
  for (const [x, h, w] of [[-60, 220, 46], [20, 300, 54], [90, 160, 40]]) {
    P(f, F, [[x - w / 2, 150], [x - w / 2, 150 - h], [x - w * 0.1, 150 - h - 8], [x + w / 2, 150 - h + 4], [x + w / 2, 150]], wax, { hi: 0.15, dressO: { op: 0.3 } });
    D.wax(f, F([[x - w / 2 - 4, 150 - h + 6], [x, 150 - h - 6], [x + w / 2 + 4, 150 - h + 8]]), mix(wax, '#fff', 0.1), { thick: 5, drips: 1, dripL: 70 });
    f.part(F(ell([x, 150 - h - 2], w / 2, w * 0.14, 0, 14)), { fill: mix(wax, '#fff', 0.15), shade: 0.3, inkW: 1.2, cast: false }); f.flat(F(ell([x, 150 - h - 2], w * 0.2, w * 0.06, 0, 10)), mix(wax, '#000', 0.4));
    L(f, F, [[x, 150 - h - 6], [x + 2, 150 - h - 20]], 2, INK);
    if (o.course === 'void') { f.flat(F([[x - 9, 150 - h - 20], [x - 6, 150 - h - 70], [x + 2, 150 - h - 92], [x + 9, 150 - h - 50], [x + 9, 150 - h - 20]]), '#08060a'); L(f, F, [[x - 9, 150 - h - 20], [x - 6, 150 - h - 70], [x + 2, 150 - h - 92], [x + 9, 150 - h - 50]], 1.6, '#7a5a9a', { op: 0.9 }); }
    else flame(f, F, [x + 1, 150 - h - 18], 52);
  }
  for (let i = 0; i < 6; i++) f.part(F(ell([-130 + r() * 260, 160 + r() * 10], 8 + r() * 10, 4, 0, 8)), { fill: wax, shade: 0.3, inkW: 1, cast: false });
  return { focus: F([[20, -170]])[0] };
};
O.lantern = (f, o = {}) => { // an iron storm lantern: horn panes, a guttering flame, soot, a dent
  const F = frame([0, 0], o.ang || 0, 1);
  L(f, F, [[-60, -230], [0, -290], [60, -230]], 8, INK); L(f, F, [[-60, -230], [0, -290], [60, -230]], 4.6, IRON);
  P(f, F, [[-90, -170], [0, -240], [90, -170]], IRON, { dressO: { op: 0.4 } });
  P(f, F, [[-110, 160], [110, 160], [100, 120], [-100, 120]], IRON, { dressO: { op: 0.4 } });
  f.part(F([[-92, 120], [-92, -170], [92, -170], [92, 120]]), { fill: '#847452', shade: 0.25, inkW: 1.4, hatch: false, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
  f.raw(`<ellipse cx="${F([[0, -20]])[0][0].toFixed(1)}" cy="${F([[0, -20]])[0][1].toFixed(1)}" rx="80" ry="110" fill="${o.course === 'water' ? '#d8e0c8' : '#f0d088'}" opacity="0.35" filter="url(#soft${f.o.seed})"/>`);
  flame(f, F, [0, 20], 90, '#e09040');
  for (let i = 0; i < 16; i++) { const x = -86 + i * 11 + (i % 3) * 2; L(f, F, [[x, 116], [x + 3, -166]], 1.2 + (i % 2), i % 3 ? '#5a4a30' : '#d8c8a0', { op: 0.35 }); }   // the grain of the horn panes
  for (const x of [-92, 0, 92]) { L(f, F, [[x, 120], [x, -170]], 10, INK); L(f, F, [[x, 120], [x, -170]], 6, IRON); }
  for (const y of [-120, 60]) { L(f, F, [[-92, y], [92, y]], 6, INK); L(f, F, [[-92, y], [92, y]], 3, IRON); }
  f.flat(F([[-80, -160], [80, -160], [60, -120], [-60, -110]]), '#0e0a08', { op: 0.5 }); // soot
  D.bloom(f, F([[70, 140]])[0], 16, RUST, { n: 3 }); f.flat(F(ell([-60, -200], 14, 8, 0.4, 10)), '#1a1a1a', { op: 0.5 });
  return { focus: F([[0, -20]])[0], hook: F([[0, -290]])[0], grip: { c: F([[0, -282]])[0], thumb: (o.ang || 0) + Math.PI / 2 }, sig: SB(F, [-110, -240, 110, 160]) };
};
O.brazier = (f, o = {}) => { // a deep iron fire basket of grate bars on a tripod: coals glowing between the bars, a low dirty fire, ash lifting
  const F = frame([0, 0], o.ang || 0, 1), r = f.r, glow = o.course === 'void' ? '#2a1a3a' : '#9a4a22';
  for (const [a, b] of [[[-120, 60], [-190, 250]], [[120, 60], [190, 250]], [[10, 80], [20, 262]]]) { L(f, F, [a, b], 18, INK); L(f, F, [a, b], 12, IRON); L(f, F, [b, add(b, [b[0] < 0 ? -24 : 24, 4])], 14, INK); } // the tripod, splayed feet
  const rimY = -90, botY = 70;
  f.part(F(ell([0, rimY], 170, 34, 0, 30)), { fill: '#120c0a', shade: 0.1, inkW: 1.6, cast: false, hatch: false }); // the dark inside
  for (let i = 0; i < 14; i++) { const c = [-130 + i * 20 + r() * 10, rimY + 4 + r() * 18]; f.part(F(ell(c, 18, 11, r(), 9)), { fill: i % 3 ? '#2a1a14' : glow, shade: 0.4, inkW: 1.1, cast: false }); } // coals heaped above the rim
  f.part(F([[-170, rimY], [170, rimY], [120, botY], [-120, botY]]), { fill: '#16100c', shade: 0.15, inkW: 2, cast: false, hatch: false }); // the basket's inside, seen through the bars
  for (let i = 0; i < 9; i++) { const t = i / 8, p = [-150 + t * 300, rimY + 30 + (r() * 60)]; f.part(F(ell(p, 26, 16, r(), 10)), { fill: r() < 0.5 ? glow : mix(glow, '#e0a060', 0.25), shade: 0.4, inkW: 0.8, cast: false }); } // coals glowing through
  for (let i = 0; i <= 10; i++) { const t = i / 10, top = [-170 + t * 340, rimY + Math.sin(Math.PI * t) * 32], bot = [-120 + t * 240, botY + Math.sin(Math.PI * t) * 20]; L(f, F, [top, bot], 13, INK); L(f, F, [top, bot], 8, i % 2 ? IRON : mix(IRON, '#000', 0.25)); } // the grate bars
  for (const [y, k] of [[rimY, 1], [-10, 0.86], [botY, 0.7]]) { const band = ell([0, y], 170 * k + 2, 32 * k, 0, 30).slice(0, 16); L(f, F, band, 15, INK); L(f, F, band, 9, mix(IRON, '#fff', y === rimY ? 0.2 : 0)); } // hoops
  for (let i = 0; i < 6; i++) f.rivet(F([[-140 + i * 56, rimY + 26 + Math.sin(Math.PI * i / 5) * 6]])[0], 3, '#6a6a66');
  D.bloom(f, F([[100, 20]])[0], 22, RUST, { n: 4, specks: 10 });
  if (o.course !== 'void') { flame(f, F, [-40, rimY - 6], 120, '#c86030'); flame(f, F, [50, rimY - 4], 90, '#c86030'); }
  for (let i = 0; i < 16; i++) f.flat(F(ell([-140 + r() * 280, -260 - r() * 120], 2 + r() * 2, 1.4, r(), 6)), r() < 0.5 ? '#3a3030' : '#5a4a40', { op: 0.85 });
  return { focus: F([[0, rimY - 60]])[0], sig: SB(F, [-190, -130, 200, 260]), ells: [34 / 170, 0.188, 0.188] };
};

// ==== bone and the dead
O.skull = (f, o = {}) => { // a skull with the jaw gone, cracked, wax pooled on its crown, moss in the sockets
  const F = frame([0, 0], o.ang || 0.1, 1), r = f.r;
  const out = [[-150, -20], [-130, -120], [-60, -180], [40, -184], [120, -130], [150, -30], [130, 40], [100, 60], [90, 120], [60, 150], [-40, 150], [-80, 110], [-120, 70]];
  P(f, F, out, BONEC, { tex: T(f, 'mottle'), texOp: 0.7 });
  for (const x of [-50, 60]) { f.part(F(ell([x, 10], 42, 40, 0, 16)), { fill: '#0e0a08', shade: 0.1, inkW: 2, cast: false, hatch: false }); f.flat(F([[x - 38, 30], [x - 10, 46], [x + 24, 44], [x + 8, 52], [x - 30, 48]]), '#3a4424', { op: 0.85 }); }
  f.flat(F([[0, 60], [-20, 100], [20, 100]]), '#0e0a08');
  for (let i = 0; i < 7; i++) { const x = -56 + i * 18; f.part(F([[x, 120], [x + 14, 120], [x + 13, 150], [x + 1, 152]]), { fill: '#d8cca8', shade: 0.3, inkW: 1, cast: false }); }
  D.crack(f, F([[-20, -180]])[0], 1.9, 120, { n: 6, lip: '#f0e8d0' }); D.crack(f, F([[100, -140]])[0], 2.4, 70, { n: 4 });
  D.wax(f, F([[-40, -184], [0, -192], [40, -186]]), TALLOW, { thick: 6, drips: 1, dripL: 40 });
  D.stain(f, F([[80, 100]])[0], 30, '#3a2a14', { op: 0.4 });
  return { focus: F([[0, -20]])[0] };
};
O.bone = (f, o = {}) => { // a long bone snapped in two, a mark scratched in blood on it, tied with thread
  const F = frame([0, 0], o.ang || -0.35, 1);
  const half = (x0, x1, flip) => { const c = (x0 + x1) / 2; P(f, F, [[x0, -16], [c, -12], [x1, -18], [x1 + (flip ? -10 : 10), -6, 1], [x1 + (flip ? 4 : -4), 2, 1], [x1 + (flip ? -8 : 8), 14, 1], [x1, 18], [c, 14], [x0, 18]], BONEC, { tex: T(f, 'mottle'), texOp: 0.6 }); };
  half(-220, -20, false); half(220, 30, true);
  for (const x of [-220, 220]) P(f, F, [[x, -40], [x + (x < 0 ? -30 : 30), -30], [x + (x < 0 ? -40 : 40), 0], [x + (x < 0 ? -30 : 30), 30], [x, 40]], BONEC, { dressO: { op: 0.4 } });
  L(f, F, [[-160, -6], [-130, 6], [-100, -8]], 3, '#4c0c08', { op: 0.9 }); L(f, F, [[-120, -10], [-120, 10]], 3, '#4c0c08', { op: 0.9 });
  D.twine(f, F([[100, -20], [104, -20]]), F([[100, 20], [104, 20]]), 4, '#2a2420', {});
  for (let i = 0; i < 6; i++) f.part(F(ell([-10 + i * 6, 30 + i * 10], 4, 3, i, 6)), { fill: BONEC, shade: 0.3, inkW: 1, cast: false });
  return { focus: F([[0, 0]])[0] };
};
O.chain = (f, o = {}) => { // an iron shackle on a hanging chain, rust and a broken link
  const F = frame([0, 0], o.ang || 0, 1);
  for (let i = 0; i < 7; i++) { const c = [Math.sin(i * 0.6) * 30, -230 + i * 52], vert = i % 2 === 0; const e = ell(c, vert ? 16 : 26, vert ? 30 : 16, 0, 14); f.line(F(loop(e)), 11, INK); f.line(F(loop(e)), 7, IRON); f.line(F(e.slice(8, 12)), 2, '#9a9a96', { op: 0.7 }); if (i === 3) D.bloom(f, F([c])[0], 14, RUST, { n: 2 }); }
  const sh = []; for (let i = 0; i <= 16; i++) { const a = E.deg(200 - i * 220 / 16); sh.push([Math.cos(a) * 110, 170 - Math.sin(a) * 100]); }
  f.line(F(sh), 30, INK); f.line(F(sh), 24, IRON); f.line(F(sh.slice(2, 8)), 3, '#9a9a96', { op: 0.7 });
  P(f, F, [[-130, 190], [130, 190], [130, 214], [-130, 214]], IRON, { sharp: true });
  for (const x of [-110, 110]) f.rivet(F([[x, 202]])[0], 6, '#6a6a66');
  D.bloom(f, F([[60, 120]])[0], 20, RUST, { n: 3, specks: 8 }); f.spatter(F([[0, 180]])[0], 40, 12);
  return { focus: F([[0, 150]])[0] };
};
O.rope = (f, o = {}) => { // a coil of tarred rope and an iron hook on its end
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  for (let i = 0; i < 6; i++) { const e = ell([-40 + i * 4, 40 + i * 6], 150 - i * 6, 70 - i * 2, 0.05, 24); f.line(F(loop(e)), 14, INK); f.line(F(loop(e)), 10, '#5a4a30'); for (let k = 0; k < 24; k += 2) f.line(F([e[k], add(e[k], [4, 6])]), 1.2, INK, { op: 0.7, straight: true }); }
  const run = [[100, 30], [150, -60], [140, -160], [80, -220]];
  f.line(F(run), 14, INK); f.line(F(run), 10, '#5a4a30');
  P(f, F, [[70, -230], [60, -280], [40, -320], [0, -330], [-30, -300], [-24, -270], [0, -296], [24, -292], [40, -270], [50, -226]], IRON, { dressO: { op: 0.4 } });
  P(f, F, [[-36, -300], [-60, -280], [-44, -310]], IRON, { dress: false, sharp: true });
  D.bloom(f, F([[30, -300]])[0], 14, RUST, { n: 2 }); D.twine(f, F([[70, -226], [80, -226]]), F([[66, -206], [80, -206]]), 3, TWINE);
  return { focus: F([[0, 40]])[0] };
};
O.anchor = (f, o = {}) => { // a ship's anchor, barnacled and green, chain trailing from its ring
  const F = frame([0, 0], o.ang || 0.15, 1), r = f.r;
  f.line(F(loop(ell([0, -230], 34, 34, 0, 16))), 18, INK); f.line(F(loop(ell([0, -230], 34, 34, 0, 16))), 12, IRON);
  P(f, F, [[-18, -196], [18, -196], [22, 160], [-22, 160]], IRON, { dressO: { op: 0.45 } });
  P(f, F, [[-110, -150], [110, -150], [110, -126], [-110, -126]], OAK, { sharp: true, tex: T(f, 'wood'), texOp: 0.8 });
  const arm = [[-200, 40], [-160, 120], [-80, 170], [0, 180], [80, 170], [160, 120], [200, 40], [214, 70], [170, 150], [90, 200], [0, 210], [-90, 200], [-170, 150], [-214, 70]];
  P(f, F, arm, IRON, { dressO: { op: 0.45 } });
  for (const s of [-1, 1]) P(f, F, [[s * 200, 40], [s * 240, 0], [s * 230, 60], [s * 214, 70]], IRON, { dress: false });
  for (let i = 0; i < 12; i++) { const p = F([[-160 + r() * 320, 130 + r() * 60]])[0]; f.part(ell(p, 7 + r() * 5, 6 + r() * 4, 0, 8), { fill: '#bab4a0', shade: 0.4, inkW: 1, cast: false }); f.flat(ell(p, 2, 1.4, 0, 6), INK); }
  D.bloom(f, F([[0, 0]])[0], 30, VERD, { n: 4, specks: 10 }); D.bloom(f, F([[-100, 160]])[0], 20, VERD, { n: 3 });
  f.line(F([[-60, 200], [-20, 140], [10, 60]]), 3, '#2a3a1a', { op: 0.85 }); // kelp
  return { focus: F([[0, 0]])[0] };
};

// ==== the written and the counted
O.book = (f, o = {}) => { // a cord-bound book open on its spine, one page torn, ink and rubric on it
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  P(f, F, [[-250, 60], [250, 60], [246, 100], [-246, 100]], LEATHER, { dressO: { op: 0.4 } });
  for (const s of [-1, 1]) {
    const pg = [[0, 70], [s * 40, -150], [s * 120, -170], [s * 236, -150], [s * 240, 60], [s * 120, 40], [s * 40, 50]];
    P(f, F, s < 0 ? pg : pg.slice().reverse(), '#d4c6a0', { tex: T(f, 'mottle'), texOp: 0.6, hatch: true, dressO: { op: 0.25 } });
    for (let k = 0; k < 8; k++) { const y = -130 + k * 22; if (s > 0 && k > 5) continue; L(f, F, [[s * 60, y + 4], [s * 140, y - 2], [s * 210, y + 2]], 1.3, INK, { op: 0.7, dash: `${(8 + r() * 14).toFixed(0)} 3 5 3` }); }
    L(f, F, [[s * 230, 52], [s * 226, -140]], 2, mix('#d4c6a0', '#000', 0.3));
  }
  f.flat(F([[-200, -140], [-170, -140], [-170, -110], [-200, -110]]), '#7a1a12', { op: 0.9 }); // a rubric initial
  f.part(F([[140, -60], [236, -70], [238, 50], [200, 20], [170, 40], [150, -10]]), { fill: '#3a2a1a', shade: 0.3, inkW: 1.2, cast: false }); // the torn-out corner shows the board
  L(f, F, [[0, 70], [0, -150]], 3, INK);
  D.stain(f, F([[-120, -20]])[0], 40, '#5a3a18', { op: 0.3 }); f.spatter(F([[80, -100]])[0], 30, 12, INK);
  D.twine(f, F([[-6, 70], [6, 70]]), F([[-6, 100], [6, 100]]), 3, '#2a2420', { knot: F([[0, 110]])[0], ends: [F([[-20, 150], [-30, 190]]), F([[20, 150], [40, 196]])] });
  return { focus: F([[0, -60]])[0] };
};
O.scroll = (f, o = {}) => { // a long scroll half unrolled, written over, a wax seal and a ribbon of rubric
  const F = frame([0, 0], o.ang || -0.12, 1), r = f.r;
  P(f, F, [[-200, -150], [200, -150], [200, 150], [-200, 150]], '#d4c6a0', { tex: T(f, 'mottle'), texOp: 0.6, dressO: { op: 0.3 } });
  for (let k = 0; k < 10; k++) L(f, F, [[-170, -120 + k * 26], [0, -124 + k * 26], [170, -118 + k * 26]], 1.4, INK, { op: 0.7, dash: `${(10 + r() * 20).toFixed(0)} 3 6 4` });
  for (const y of [-170, 170]) { P(f, F, limb([-220, y], [220, y], 44, 44, { capK: 0.4 }), mix('#d4c6a0', '#000', 0.08), { dressO: { op: 0.35 } }); for (const x of [-232, 232]) f.part(F(ell([x, y], 12, 24, 0, 12)), { fill: OAK, shade: 0.4, inkW: 1.2 }); }
  f.part(F(ell([110, 110], 34, 30, 0, 16)), { fill: '#3a2a20', shade: 0.45, inkW: 1.6 }); f.line(F(loop(ell([110, 110], 18, 16, 0, 12))), 1.4, '#3a0a08');
  f.part(F([[100, 130], [130, 136], [140, 230], [124, 220], [110, 236]]), { fill: '#7a1a12', shade: 0.4, inkW: 1.2 });
  L(f, F, [[-160, 120], [-100, 100], [-40, 126]], 2.4, '#4c0c08', { op: 0.9 }); // a signature in blood
  return { focus: F([[0, 0]])[0] };
};
O.inkpot = (f, o = {}) => { // a stoneware inkpot, a quill stood in it, ink run down its sides, the six courses' rings
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  L(f, F, [[-10, -80], [60, -260], [90, -330]], 6, INK); L(f, F, [[-10, -80], [60, -260], [90, -330]], 3, '#d8d0bc');
  const sh = t => [-10 + t * 100, -80 - t * 250 - Math.sin(t * Math.PI) * 20]; // the quill's shaft; its vane runs the upper half, ragged, never a lollipop blob
  const vl = [], vr = []; for (let i = 0; i <= 10; i++) { const t = 0.42 + i * 0.058, p = sh(t), w = 26 * Math.sin(Math.PI * Math.min(1, (t - 0.4) / 0.62)) + 2; vl.push(add(p, [-w, -w * 0.3 + (i % 3 === 1 ? 6 : 0)])); vr.push(add(p, [w * 0.6, w * 0.25])); }
  f.part(F([...vl, ...vr.slice().reverse()]), { fill: '#c8c0ac', shade: 0.4, inkW: 1.2, tex: T(f, 'mottle'), texOp: 0.6 });
  for (let i = 1; i < 10; i++) { const p = sh(0.42 + i * 0.058); L(f, F, [p, vl[i]], 1, INK, { op: 0.55 }); L(f, F, [p, vr[i]], 0.8, INK, { op: 0.4 }); }
  for (const i of [3, 6]) L(f, F, [sh(0.42 + i * 0.058), add(vl[i], [-4, 4])], 2.4, '#5a5a50', { op: 0.6 });   // splits in the vane
  P(f, F, turned([[120, 160], [132, 100], [130, 0], [100, -50], [50, -70], [54, -84]]), '#6a6458', { tex: T(f, 'mottle'), texOp: 0.6 });
  f.part(F(ell([0, -84], 54, 12, 0, 14)), { fill: '#0a0a10', shade: 0.1, inkW: 1.4, cast: false });
  const six = ['#b8341f', '#8fb2c9', '#c9a43a', '#2f4f8f', '#7d9a3a', '#4b2a5c'], ink = o.course && o.course !== 'physical' ? mix(TINT[o.course], '#100c10', 0.5) : '#16121a';
  for (const [x, L2] of [[-40, 120], [20, 80], [60, 140]]) { L(f, F, [[x, -70], [x * 1.4, 20], [x * 1.6, L2 - 60]], 6, ink, { op: 0.9 }); f.flat(F(ell([x * 1.6, L2 - 56], 5, 7, 0, 8)), ink); }
  six.forEach((c, i) => f.line(F(ell([-180 + (i % 3) * 30, 170 + Math.floor(i / 3) * 10], 26, 7, 0, 14).slice(0, 12)), 2.4, mix(c, '#2a1a10', 0.72), { op: 0.8 })); // rings left by other pots, faded (L14)
  return { focus: F([[0, -84]])[0] };
};
O.purse = (f, o = {}) => { // a fat leather purse, its mouth open, coins spilled; the ledger's red line behind
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  P(f, F, [[-150, 160], [-176, 60], [-150, -50], [-80, -110], [80, -110], [150, -50], [176, 60], [150, 160]], LEATHER, { tex: T(f, 'mottle'), texOp: 0.7 });
  f.stitches(F([[-150, 150], [-170, 60], [-146, -40]]), '#c8b08a', 1.4);
  D.twine(f, F([[-80, -110], [-80, -100]]), F([[80, -110], [80, -100]]), 3, '#3a2a18', { knot: F([[84, -104]])[0], ends: [F([[110, -70], [118, -30]])] });
  for (let i = 0; i < 9; i++) { const p = F([[-60 + r() * 120, -130 - r() * 20]])[0]; f.part(ell(p, 22, 8, (r() - 0.5) * 0.6, 14), { fill: '#b8902e', shade: 0.4, inkW: 1.3, cast: false }); }
  for (let i = 0; i < 7; i++) { const p = F([[120 + r() * 140, 150 + r() * 30]])[0]; f.part(ell(p, 20, 7, r() - 0.5, 14), { fill: '#a8842a', shade: 0.4, inkW: 1.2, cast: false }); f.line(ell(p, 12, 4, 0, 10).slice(0, 5), 1, '#5a4210', { op: 0.7 }); }
  const st = F([[60, 220]])[0]; f.part(ell(st, 22, 22, 0, 16), { fill: '#b8902e', shade: 0.4, inkW: 1.4 }); f.line(ell(st, 14, 14, 0, 12).slice(0, 9), 1.2, '#5a4210'); // a coin on its edge
  return { focus: F([[0, -120]])[0] };
};
O.key = (f, o = {}) => { // a heavy iron key on a ring with a paper tag
  const F = frame([0, 0], o.ang || -0.5, 1);
  f.line(F(loop(ell([-200, 0], 60, 60, 0, 20))), 20, INK); f.line(F(loop(ell([-200, 0], 60, 60, 0, 20))), 14, IRON);
  f.line(F(loop(ell([-280, -20], 40, 40, 0, 16))), 10, INK); f.line(F(loop(ell([-280, -20], 40, 40, 0, 16))), 6, '#6a6a66');
  P(f, F, [[-142, -14], [180, -14], [180, 14], [-142, 14]], IRON, { dressO: { op: 0.45 } });
  P(f, F, [[150, 14], [220, 14], [220, 90], [196, 90], [196, 56], [176, 56], [176, 90], [150, 90]], IRON, { sharp: true });
  for (const x of [-120, 20, 140]) f.line(F([[x, -18], [x, 18]]), 3, mix(IRON, '#000', 0.4));
  D.bloom(f, F([[60, 0]])[0], 16, RUST, { n: 3 }); D.bloom(f, F([[200, 60]])[0], 12, RUST, { n: 2 });
  f.line([F([[-300, 10]])[0], F([[-310, 70]])[0]], 1.6, '#3a2a18');
  D.label(f, F([[-312, 110]])[0], 50, 70, (o.ang || 0) + 0.5, '#cdbb94', (G) => { f.line(G([[-14, -10], [12, -12]]), 1.2, INK, { op: 0.7 }); f.line(G([[-14, 4], [8, 2]]), 1.2, INK, { op: 0.7 }); });
  return { focus: F([[40, 0]])[0], grip: { c: F([[-150, 0]])[0], thumb: o.ang || -0.5 } };
};

// ==== care and keeping
O.bandage = (f, o = {}) => { // a rolled strip of linen unwinding across the boards, blood seeping through the turns, a pin through it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  // the strip, lying in a loose S off the roll, frayed at its end
  const strip = [[60, 60], [-40, 110], [-160, 96], [-260, 130], [-300, 170, 1], [-290, 196, 1], [-250, 166], [-150, 132], [-40, 146], [80, 100]];
  P(f, F, strip, LINEN, { tex: T(f, 'weave'), texOp: 0.7 });
  for (let i = 0; i < 5; i++) L(f, F, [[-296 + i * 3, 176 + i * 4], [-312 - r() * 10, 186 + i * 5]], 1, '#b8ac90');
  L(f, F, [[40, 74], [-60, 122], [-170, 110], [-270, 150]], 1.2, INK, { op: 0.5, dash: '12 4' });
  f.flat(F([[-120, 104], [-70, 112], [-60, 138], [-110, 134]]), '#7a1810', { op: 0.55 }); f.flat(F(ell([-90, 120], 12, 7, 0.2, 10)), '#4c0c08', { op: 0.6 });
  // the roll: seen end on, the turns of the strip spiralling in, blood through the outer turns
  P(f, F, [[-20, -120], [140, -150], [190, -60], [180, 50], [110, 100], [-10, 120], [-60, 30], [-60, -60]], mix(LINEN, '#000', 0.04), { tex: T(f, 'weave'), texOp: 0.6 });
  const C = [100, -30];
  for (let i = 0; i < 6; i++) f.line(F(ell(C, 76 - i * 12, 108 - i * 17, -0.25, 22).slice(3, 20)), 1.6, INK, { op: 0.65 });
  f.part(F(ell(C, 14, 20, -0.25, 12)), { fill: '#2a2014', shade: 0.2, inkW: 1.2, cast: false });
  f.flat(F([[130, -120], [176, -70], [170, 0], [140, -20], [120, -80]]), '#6a1810', { op: 0.55 }); f.flat(F([[150, -90], [168, -60], [150, -40]]), '#4c0c08', { op: 0.6 });
  D.stain(f, F([[-20, -40]])[0], 30, '#8a7a30', { op: 0.3 });
  L(f, F, [[-40, -90], [70, -40]], 3.6, INK); L(f, F, [[-40, -90], [70, -40]], 1.8, '#9a9c96'); f.part(F(ell([-44, -92], 8, 8, 0, 8)), { fill: '#7a7a76', shade: 0.4, inkW: 1, cast: false });
  return { focus: F([[60, -20]])[0] };
};
O.herbs = (f, o = {}) => { // a bundle of herbs tied with twine, leaves curling, a seed head, a pale bloom
  const F = frame([0, 0], o.ang || 0.2, 1), r = f.r, leaf = o.course === 'toxin' ? '#6a7a3a' : '#5a6a3e';
  for (let i = 0; i < 9; i++) { const a = -0.5 + i * 0.12, s0 = [0, 120], s1 = add(s0, rot([0, -260 - r() * 60], a)); f.line(F([s0, lerp(s0, s1, 0.5), s1]), 5, INK); f.line(F([s0, lerp(s0, s1, 0.5), s1]), 3, '#5a5a30');
    for (let k = 1; k < 5; k++) { const b = lerp(s0, s1, 0.3 + k * 0.15), side = k % 2 ? 1 : -1; f.part(F(ell(add(b, [side * 22, -6]), 24, 9, a + side * 0.6, 10)), { fill: mix(leaf, '#d8d0a0', r() * 0.25), shade: 0.45, inkW: 1.1, cast: false }); } }
  for (let i = 0; i < 6; i++) f.line(F([[-30 + i * 12, 120], [-40 + i * 14, 240]]), 4, '#4a3a20');
  P(f, F, [[-50, 90], [50, 90], [46, 150], [-46, 150]], SACK, { tex: T(f, 'weave'), texOp: 0.6, dressO: { op: 0.35 } });
  D.twine(f, F([[-50, 104], [-50, 112]]), F([[50, 104], [50, 112]]), 3, TWINE, { knot: F([[52, 110]])[0], ends: [F([[70, 140], [80, 170]])] });
  f.part(F(ell([60, -230], 26, 22, 0, 12)), { fill: o.course === 'toxin' ? '#d8c8d8' : '#e0d8b8', shade: 0.35, inkW: 1.2 });
  for (let i = 0; i < 10; i++) f.flat(F(ell([60 + (r() - 0.5) * 30, -230 + (r() - 0.5) * 26], 1.6, 1.6, 0, 6)), '#3a2a18');
  return { focus: F([[0, -120]])[0] };
};
O.bread = (f, o = {}) => { // a dark loaf torn open on a cloth, crumbs, a knife beside it
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  P(f, F, [[-260, 80], [-140, 40], [120, 50], [260, 90], [200, 160], [-200, 160]], LINEN, { tex: T(f, 'weave'), texOp: 0.6, dressO: { op: 0.3 } });
  P(f, F, [[-200, 80], [-210, 0], [-150, -70], [-40, -100], [20, -96], [40, 60], [-60, 100]], '#5a3a1e', { tex: T(f, 'mottle'), texOp: 0.7 });
  P(f, F, [[40, -90], [140, -80], [210, -20], [200, 70], [60, 80]], '#5a3a1e', { tex: T(f, 'mottle'), texOp: 0.7 });
  f.part(F([[20, -96], [40, -90], [60, 80], [40, 60]]), { fill: '#c8a878', shade: 0.3, inkW: 1.1, cast: false, tex: T(f, 'mottle'), texOp: 0.8 });
  for (const [x, y] of [[-150, -40], [-90, -70], [130, -50]]) L(f, F, [[x - 30, y + 10], [x + 30, y - 10]], 3, '#2a1a0c');
  for (let i = 0; i < 14; i++) f.part(F(ell([-100 + r() * 300, 110 + r() * 40], 4 + r() * 4, 3, r(), 6)), { fill: '#7a5a34', shade: 0.3, inkW: 0.9, cast: false });
  return { focus: F([[30, -20]])[0] };
};
O.salt = (f, o = {}) => { // a sack of salt slumped open, a white line poured out across the boards
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  P(f, F, [[-130, 160], [-160, 40], [-120, -90], [-80, -150], [-30, -170], [40, -160], [90, -110], [140, 20], [150, 160]], SACK, { tex: T(f, 'weave'), texOp: 0.7 });
  f.part(F(ell([0, -150], 66, 22, 0, 16)), { fill: '#e8e4d8', shade: 0.25, inkW: 1.4, cast: false });
  D.twine(f, F([[-74, -124], [-74, -116]]), F([[80, -116], [80, -108]]), 3, TWINE, { knot: F([[82, -112]])[0], ends: [F([[110, -80], [120, -40]])] });
  f.part(F([[140, 140], [360, 150], [460, 170], [440, 186], [300, 182], [150, 178]]), { fill: '#e8e4d8', shade: 0.25, inkW: 1.2, cast: false, tex: T(f, 'mottle'), texOp: 0.4 });
  for (let i = 0; i < 40; i++) f.flat(F(ell([150 + r() * 320, 150 + r() * 40], 1.4, 1.2, 0, 6)), r() < 0.7 ? '#f4f0e4' : INK, { op: 0.85 });
  D.stain(f, F([[40, 80]])[0], 40, '#3a2a14', { op: 0.3 }); f.stitches(F([[-150, 40], [-120, -80]]), '#d8cbb0', 1.2);
  return { focus: F([[200, 160]])[0] };
};
O.reliquary = (f, o = {}) => { // a small lead reliquary, gilt worn off, a bone behind a cracked window: holy, so gold
  const F = frame([0, 0], o.ang || 0, 1);
  const GILT = '#9a8450';   // worn, aged gold (Cole: holy things and the Vessel; never bright yellow)
  D.slab(f, F([[-150, 160], [-150, -60], [0, -180], [150, -60], [150, 160]]), [18, 10], '#3e4042');
  P(f, F, [[-150, 160], [-150, -60], [0, -180], [150, -60], [150, 160]], '#6e7072', { sharp: true, tex: T(f, 'mottle'), texOp: 0.9 });
  L(f, F, [[-128, 146], [-128, -50], [0, -154], [128, -50], [128, 146], [-128, 146]], 2, INK, { op: 0.5, straight: true }); for (let i = 0; i < 12; i++) { const y = -40 + i * 16; L(f, F, [[-146, y], [-132, y + 6]], 1.2, INK, { op: 0.5 }); L(f, F, [[132, y], [146, y + 6]], 1.2, INK, { op: 0.5 }); }   // an engraved border, hatched sides
  for (const p of [[-150, 160], [-150, -60], [0, -180], [150, -60], [150, 160]]) f.rivet(F([p])[0], 5, GILT);
  L(f, F, [[-140, -58], [0, -170], [140, -58]], 4, GILT, { op: 0.85 });
  f.part(F([[-90, 120], [-90, -40], [90, -40], [90, 120]]), { fill: '#2a2820', shade: 0.2, inkW: 2, cast: false, hatch: true, tex: T(f, 'mottle'), texOp: 0.6 });
  f.part(F([[-30, 100], [-40, 0], [-10, -20], [20, 0], [30, 100]]), { fill: BONEC, shade: 0.35, inkW: 1.2, cast: false });
  f.flat(F([[-90, -40], [90, -40], [-40, 120]]), '#d8e0e4', { op: 0.18 }); D.crack(f, F([[-80, -30]])[0], 0.9, 120, { n: 5 });
  L(f, F, [[0, -180], [0, -260]], 10, GILT); L(f, F, [[-36, -230], [36, -230]], 10, GILT); L(f, F, [[0, -180], [0, -260]], 2, INK, { op: 0.5 });
  D.bloom(f, F([[100, 120]])[0], 18, '#2a2c28', { n: 3 }); f.scratches(F([[-110, 60]])[0], 20, 5, '#e8e8e2');
  return { focus: F([[0, 40]])[0] };
};
O.boot = (f, o = {}) => { // a worn boot mid-step, mud to the ankle, a patch, the sole coming away
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  P(f, F, [[-80, -220], [70, -230], [80, -20], [200, 60], [230, 130], [220, 170], [-110, 170], [-110, 60], [-90, -40]], '#3e2a1c', { tex: T(f, 'mottle'), texOp: 0.7 });
  P(f, F, [[-90, -230], [80, -240], [84, -180], [-94, -170]], '#4a3424', { dressO: { op: 0.4 } });
  P(f, F, [[-120, 170], [230, 170], [236, 196], [-124, 200]], '#1e140c', { dress: false });
  f.flat(F([[200, 172], [236, 168], [240, 190], [210, 186]]), '#0a0604'); // sole coming away
  f.part(F([[-70, -80], [10, -90], [16, -20], [-66, -10]]), { fill: '#5a4430', shade: 0.4, inkW: 1.2 }); f.stitches(F([[-70, -82], [12, -92], [16, -20], [-66, -10], [-70, -82]]), '#c8b08a', 1);
  f.flat(F([[-110, 60], [230, 120], [236, 196], [-124, 200]]), '#2a2014', { op: 0.55 }); // mud
  for (let i = 0; i < 18; i++) f.flat(F(ell([-130 + r() * 380, 200 + r() * 30], 2 + r() * 5, 1.6 + r() * 2, 0, 8)), '#2a2014', { op: 0.85 });
  for (const y of [-200, -160, -120]) L(f, F, [[-40, y], [40, y + 6]], 2.4, '#1a120c');
  return { focus: F([[60, 60]])[0] };
};

// ==== trades of the worlds
O.hammer = (f, o = {}) => { // a smith's hammer and an iron wedge, the face burred, a split haft bound with wire
  const F = frame([0, 0], o.ang || -0.25, 1), r = f.r;
  P(f, F, limb([-20, -100], [-20, 260], 30, 36, { capK: 0.4 }), OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  for (let i = 0; i < 5; i++) { const y = 60 + i * 8; L(f, F, [[-38, y], [-2, y + 4]], 3, INK); L(f, F, [[-38, y], [-2, y + 4]], 1.6, '#8a8a86'); }
  P(f, F, [[-160, -170], [120, -170], [140, -150], [140, -60], [120, -40], [-160, -40], [-190, -80], [-190, -130]], IRON, { dressO: { op: 0.45 } });
  f.flat(F([[120, -170], [150, -160], [150, -50], [120, -40]]), '#cfd0cc', { op: 0.5 }); f.scratches(F([[140, -100]])[0], 16, 6, '#f0f0ea');
  P(f, F, [[140, 120], [260, 140], [140, 190]], '#5a5c60', { sharp: true });
  D.bloom(f, F([[-100, -100]])[0], 22, RUST, { n: 3 }); for (let i = 0; i < 10; i++) f.flat(F(ell([180 + r() * 100, 110 + r() * 80], 1.6, 1.6, 0, 6)), '#e8a040', { op: 0.9 }); // sparks
  return { focus: F([[140, -100]])[0], grip: { c: F([[-20, 170]])[0], thumb: (o.ang ?? -0.25) - Math.PI / 2 } };
};
O.rod = (f, o = {}) => { // an iron rod planted in split stone, iron straps and a copper coil, its tip fused and split, burns branching down it
  const F = frame([0, 0], o.ang ?? 0.05, 1), r = f.r;
  P(f, F, [[-280, 190], [-230, 120], [-140, 104], [-40, 96], [10, 120], [60, 98], [140, 100], [230, 130], [290, 200], [260, 230], [-270, 236]], '#5e5a54', { tex: T(f, 'mottle'), texOp: 0.8 }); f.flat(F([[-250, 150], [-120, 116], [120, 112], [250, 150], [200, 170], [-200, 172]]), '#8a949a', { op: 0.3 }); // wet rock, a sheen of rain on it
  D.crack(f, F([[10, 110]])[0], 1.4, 90, { n: 5, lip: '#a8a49a' });
  for (const s of [-1, 1]) P(f, F, [[s * 22, 120], [s * 80, 150], [s * 84, 170], [s * 18, 140]], IRON, { dress: false });
  for (const s of [-1, 1]) f.rivet(F([[s * 70, 156]])[0], 4, '#6a6a66');
  P(f, F, limb([0, 150], [0, -250], 30, 22, { capB: false }), IRON, { dressO: { op: 0.5 } });
  for (let i = 0; i < 9; i++) { const y = -120 + i * 10; L(f, F, [[-18, y], [18, y + 6]], 5, INK); L(f, F, [[-18, y], [18, y + 6]], 3, '#b06a3a'); } // copper coil
  D.bloom(f, F([[0, -90]])[0], 18, VERD, { n: 3, specks: 6 });
  for (const y of [40, -20]) { P(f, F, [[-24, y - 8], [24, y - 8], [26, y + 10], [-26, y + 10]], '#3a3a3c', { sharp: true, dress: false }); f.rivet(F([[0, y + 1]])[0], 3, '#6a6a66'); }
  f.part(F([[-14, -250], [-34, -300], [-8, -282], [0, -340], [8, -280], [34, -304], [14, -250]]), { fill: '#7a5a3a', shade: 0.4, inkW: 1.4 });
  f.flat(F(ell([0, -256], 16, 10, 0, 10)), '#1a1410', { op: 0.7 });
  for (let i = 0; i < 4; i++) f.flat(F(ell([-10 + i * 6, -240 + i * 12], 4, 6, 0, 8)), '#d8c8a0', { op: 0.8 }); // fused drips
  const br = (p, a, l, d) => { if (d > 4 || l < 10) return; const q = add(p, rot([0, l], a)); f.line(F([p, q]), Math.max(1.4, 4 - d * 0.6), '#1a1008', { straight: true, op: 0.85 }); f.line(F([add(p, [1.5, 1.5]), add(q, [1.5, 1.5])]), 1, '#8a6a4a', { straight: true, op: 0.5 }); /* scorch, not white twigs (L18) */ br(q, a + 0.4 + r() * 0.3, l * 0.7, d + 1); if (r() < 0.7) br(q, a - 0.4 - r() * 0.3, l * 0.6, d + 1); };
  br([0, -240], 0, 60, 0); br([-14, -150], 0.5, 40, 1); br([14, 0], -0.4, 44, 1); br([-60, 120], 0.9, 40, 1); br([60, 124], -0.9, 44, 1);
  for (let i = 0; i < 8; i++) f.flat(F(ell([-140 + r() * 280, 130 + r() * 60], 10 + r() * 14, 4, 0, 8)), '#1a1410', { op: 0.55 });
  D.wear(f, F([[0, -60]])[0], 14, 160, 20);
  return { focus: F([[0, -280]])[0], sig: SB(F, [-290, -250, 290, 236]) };   // planted in the rock, never held (review 3)
};
O.stinger = (f, o = {}) => { // a torn-out insect stinger, chitin plates, a bead of venom at its point
  const F = frame([0, 0], o.ang || -0.6, 1), r = f.r;
  P(f, F, [[-220, -50], [-120, -70], [60, -40], [240, -4], [60, 36], [-120, 60], [-220, 46]], '#2a2620', { tex: T(f, 'mottle'), texOp: 0.4, dressO: { op: 0.3, lt: '#c8d0a0' } });
  for (const x of [-180, -120, -60, 0]) L(f, F, [[x, -60], [x + 10, 0], [x, 54]], 2.2, '#8a8a70', { op: 0.6 });
  L(f, F, [[-200, -30], [100, -20], [230, -4]], 2, '#c8c8a0', { op: 0.5 });
  for (const s of [-1, 1]) f.part(F([[-220, s * 30], [-300, s * 80], [-280, s * 20]]), { fill: '#3a3428', shade: 0.4, inkW: 1.2, cast: false }); // torn flesh at the root
  f.flat(F(ell([-250, 0], 30, 40, 0, 12)), '#5a6a2a', { op: 0.7 });
  f.part(F(ell([262, 8], 16, 20, 0, 12)), { fill: '#7d9a3a', shade: 0.4, inkW: 1.4, cast: false }); f.flat(F(ell([256, 2], 5, 6, 0, 8)), '#e0ecc0', { op: 0.8 });
  for (let i = 0; i < 4; i++) L(f, F, [[-100 + i * 70, 30], [-90 + i * 70, 44]], 1.4, '#c8d0a0', { op: 0.6 });
  return { focus: F([[250, 0]])[0] };
};
O.door = (f, o = {}) => { // a church door barred: oak planks, strap hinges, a bar dropped across, a keyhole
  const F = frame([0, 0], o.ang || 0, 1), r = f.r;
  D.slab(f, F([[-160, 220], [-160, -140], [-100, -220], [0, -240], [100, -220], [160, -140], [160, 220]]), [16, 10], '#2e2014');
  P(f, F, [[-160, 220], [-160, -140], [-100, -220], [0, -240], [100, -220], [160, -140], [160, 220]], OAK, { tex: T(f, 'wood'), texOp: 0.8 });
  for (const x of [-80, 0, 80]) L(f, F, [[x, 220], [x, -230 + Math.abs(x) * 0.2]], 2.4, INK);
  for (const y of [-120, 120]) { P(f, F, [[-170, y - 12], [120, y - 16], [150, y], [120, y + 16], [-170, y + 12]], '#2f2f31', { dress: false }); for (let k = 0; k < 4; k++) f.rivet(F([[-140 + k * 70, y]])[0], 3, '#777'); D.bloom(f, F([[0, y + 20]])[0], 16, RUST, { n: 2 }); }
  P(f, F, [[-200, 10], [200, -4], [204, 40], [-196, 54]], OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  for (const x of [-170, 170]) P(f, F, [[x - 16, -10], [x + 16, -10], [x + 16, 70], [x - 16, 70]], IRON, { dress: false });
  f.part(F([[90, 80], [118, 78], [120, 140], [92, 142]]), { fill: '#2f2f31', shade: 0.4, inkW: 1.2 }); f.flat(F([[102, 98], [108, 98], [109, 120], [101, 120]]), '#000');
  for (let i = 0; i < 6; i++) L(f, F, [[-130 + i * 8, 150], [-133 + i * 8, 190]], 1.4, '#c8ab80', { straight: true, op: 0.85 }); f.spatter(F([[60, 160]])[0], 40, 16);
  return { focus: F([[0, 20]])[0] };
};

O.suture = (f, o = {}) => { // a curved barber's needle trailing gut thread through three stitches in a strip of hide
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r;
  P(f, F, [[-260, 40], [-120, 10], [80, 20], [260, 0], [250, 120], [60, 140], [-120, 130], [-250, 150]], '#b89a78', { tex: T(f, 'mottle'), texOp: 0.8 });
  L(f, F, [[-200, 74], [-60, 66], [80, 78], [200, 62]], 4, '#4c0c08'); L(f, F, [[-200, 72], [-60, 64], [80, 76], [200, 60]], 1.6, INK, { op: 0.8 }); // the wound
  for (let i = 0; i < 3; i++) { const x = -150 + i * 90; L(f, F, [[x - 10, 40], [x + 10, 104]], 5, INK); L(f, F, [[x - 10, 40], [x + 10, 104]], 2.6, '#d8c8a0'); f.part(F(ell([x + 12, 106], 7, 5, 0, 8)), { fill: '#d8c8a0', shade: 0.3, inkW: 1, cast: false }); }
  const th = [[60, 50], [100, -40], [40, -140], [-60, -170]];
  L(f, F, th, 5, INK); L(f, F, th, 2.6, '#d8c8a0');
  const nd = []; for (let i = 0; i <= 10; i++) { const a = E.deg(200 + i * 12); nd.push([140 + Math.cos(a) * 110, -40 + Math.sin(a) * 110]); }
  L(f, F, nd, 9, INK); L(f, F, nd, 5, '#9a9c96'); L(f, F, nd.slice(2, 8), 1.4, '#f0f0ea', { op: 0.8 });
  f.flat(F(ell([60, -40], 6, 3, 0, 8)), INK); f.flat(F(ell([20, 60], 10, 6, 0, 8)), '#4c0c08');
  f.spatter(F([[0, 110]])[0], 40, 14); D.wear(f, F([[0, 80]])[0], 200, 40, 24);
  return { focus: F([[40, 60]])[0] };
};

O.tourniquet = (f, o = {}) => { // a leather strap cinched round and twisted tight on a stick, the buckle worn bright
  const F = frame([0, 0], o.ang ?? 0.1, 1), r = f.r;
  const loopO = ell([0, 0], 190, 103, 0, 30);
  f.line(F(loop(loopO)), 42, INK); f.line(F(loop(loopO)), 36, LEATHER); f.line(F(loopO.slice(17, 25)), 30, mix(LEATHER, '#2a1f2a', 0.5), { op: 0.7 });
  f.line(F(loopO.slice(16, 26)), 36, 'url(#xhatch' + f.o.seed + ')', { op: 0.5 }); f.line(F(loopO.slice(19, 27)), 3, '#8a6a48', { op: 0.6 });
  for (let i = 0; i < 30; i += 2) { const p = loopO[i]; f.line(F([add(p, [-4, -14]), add(p, [4, 14])]), 1, '#2a1a10', { op: 0.6, straight: true }); }
  f.stitches(F(ell([0, 0], 172, 90, 0, 30).slice(2, 14)), '#c8b08a', 1);
  for (const a of [-0.6, 0.2, 0.9, 2.2, 3.4, 4.4]) { const p = [Math.cos(a) * 190, Math.sin(a) * 103]; f.part(F(ell(p, 5, 5, 0, 8)), { fill: '#8a7a5a', shade: 0.4, inkW: 1, cast: false }); }
  P(f, F, [[-40, -150], [40, -150], [44, -90], [-44, -90]], '#8a8478', { sharp: true, dressO: { op: 0.4 } }); f.flat(F([[-26, -134], [26, -134], [26, -106], [-26, -106]]), '#1a1410');
  L(f, F, [[0, -140], [0, -100]], 4, INK); L(f, F, [[-38, -150], [38, -150]], 1.4, '#e8e4d8', { op: 0.7 });
  P(f, F, limb([-60, 160], [180, 60], 26, 22, { capK: 0.6 }), OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  for (let i = 0; i < 4; i++) { const x = 30 + i * 14; L(f, F, [[x, 80], [x + 26, 140]], 7, INK); L(f, F, [[x, 80], [x + 26, 140]], 4, LEATHER); }
  f.flat(F(ell([-140, 60], 30, 14, 0.3, 12)), '#4c0c08', { op: 0.6 }); f.spatter(F([[-120, 70]])[0], 36, 12);
  return { focus: F([[0, 0]])[0] };
};

O.splint = (f, o = {}) => { // two oak slats bound with linen and cord, a knot, the binding stained through
  const F = frame([0, 0], o.ang ?? -0.3, 1);
  for (const y of [-40, 40]) P(f, F, [[-260, y - 18], [260, y - 22], [270, y], [260, y + 20], [-260, y + 18], [-270, y]], OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  for (const x of [-170, 0, 170]) { P(f, F, [[x - 40, -76], [x + 40, -80], [x + 44, 78], [x - 36, 80]], LINEN, { tex: T(f, 'weave'), texOp: 0.7, dressO: { op: 0.3 } }); for (let k = 0; k < 4; k++) L(f, F, [[x - 40, -60 + k * 38], [x + 42, -64 + k * 38]], 1.2, INK, { op: 0.6 }); }
  f.flat(F(ell([0, 10], 34, 50, 0, 12)), '#6a1810', { op: 0.5 });
  D.twine(f, F([[160, -80], [176, -80]]), F([[160, 80], [176, 80]]), 4, TWINE, { knot: F([[186, 84]])[0], ends: [F([[200, 120], [196, 160]]), F([[214, 104], [240, 130]])] });
  D.crack(f, F([[-200, -40]])[0], 0, 120, { n: 5, forks: false, w: 1.4, lip: '#c8a070' });
  return { focus: F([[0, 0]])[0] };
};

O.coalpan = (f, o = {}) => { // a shallow iron coal pan on a long handle, coals heaped and smoking, a scorched cloth wrap on the grip
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r;
  P(f, F, limb([120, 40], [300, -40], 22, 18, { capK: 0.6 }), IRON, { dressO: { op: 0.4 } });
  P(f, F, [[220, -12], [300, -46], [306, -30], [228, 4]], SACK, { tex: T(f, 'weave'), texOp: 0.7, dress: false });
  for (let i = 0; i < 9; i++) f.part(F(ell([-140 + i * 32, -10 - r() * 24 - (i > 2 && i < 7 ? 20 : 0)], 24, 16, r(), 10)), { fill: i % 3 ? '#2a1a14' : '#9a4a1e', shade: 0.4, inkW: 1.2, cast: false });
  for (let i = 0; i < 9; i++) f.flat(F(ell([-140 + r() * 260, -30 - r() * 30], 4, 2, r(), 6)), '#e8904a', { op: 0.85 });
  P(f, F, [[-200, -10], [160, -10], [140, 50], [90, 70], [-140, 70], [-180, 40]], IRON, { dressO: { op: 0.45 } });
  for (let i = 0; i < 6; i++) f.rivet(F([[-160 + i * 60, 10]])[0], 3, '#6a6a66');
  D.bloom(f, F([[-60, 50]])[0], 22, RUST, { n: 3, specks: 8 });
  for (let i = 0; i < 3; i++) L(f, F, [[-80 + i * 60, -60], [-90 + i * 60, -140], [-70 + i * 60, -220]], 4, '#3a3030', { op: 0.45 });
  return { focus: F([[-20, -30]])[0], grip: { c: F([[260, -26]])[0], thumb: (o.ang ?? -0.1) + Math.PI } };
};

O.tongs = (f, o = {}) => { // smith's tongs holding a glowing ember, the jaws scaled black, the reins wired shut
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r;
  for (const s of [-1, 1]) { const reins = [[0, s * 10], [-120, s * 24], [-260, s * 36]]; L(f, F, reins, 18, INK); L(f, F, reins, 12, IRON); L(f, F, reins, 2, '#8a8a86', { op: 0.6 }); }
  for (const s of [-1, 1]) P(f, F, [[0, s * 6], [90, s * 30], [150, s * 34], [160, s * 20], [100, s * 14]], IRON, { dressO: { op: 0.45 } });
  f.part(F(ell([0, 0], 16, 16, 0, 12)), { fill: IRON, shade: 0.4, inkW: 1.4 }); f.rivet(F([[0, 0]])[0], 5, '#6a6a66');
  for (let i = 0; i < 4; i++) { const x = -180 + i * 9; L(f, F, [[x, -40], [x + 4, 40]], 3, INK); L(f, F, [[x, -40], [x + 4, 40]], 1.4, '#9a9a96'); }
  P(f, F, ell([170, 0], 40, 30, 0.3, 16), '#a8401a', { tex: T(f, 'mottle'), texOp: 0.6, dress: false });
  f.flat(F(ell([164, -6], 20, 12, 0.3, 10)), '#e8904a'); f.flat(F(ell([160, -8], 8, 5, 0.3, 8)), '#f8d8a0');
  for (let i = 0; i < 10; i++) f.flat(F(ell([170 + (r() - 0.5) * 120, -60 - r() * 120], 1.6, 1.6, 0, 6)), r() < 0.5 ? '#e8904a' : '#3a3030', { op: 0.85 });
  D.bloom(f, F([[60, 20]])[0], 16, RUST, { n: 2 });
  return { focus: F([[170, 0]])[0], grip: { c: F([[-220, 0]])[0], thumb: (o.ang ?? -0.35) } };
};

module.exports = { O, TINT };
