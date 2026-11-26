// The card object library, part seven: the variety pass for the Alchemist (L58), plus the screw press. 87 Alchemist object
// cards drew mostly on the vial, jar, flask and phial, so these give each brew its own vessel or tool with its own
// silhouette: retort, gemel, pelican, still, albarello, matula, costrel, demijohn, roemer, amphora and the rest.
// Same contract and META as objects6.js. Glass is drawn with its liquid clipped to a level and form hatching (L3).
'use strict';
const K = require('./card_kit');
const { E, D, INK } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm } = E;
const H = require('./objects6').helpers;
const { C, INKS, SIX, T, loop, L, P, turned, lit, tube, oval, ring, sweep, SB, arcs, shadeR, grain } = H;
const O = {}, META = {};

// the part of a closed outline below a level (Sutherland-Hodgman against y >= yl): the liquid in a glass
function clipBelow(poly, yl) { const out = []; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], ia = a[1] >= yl, ib = b[1] >= yl; if (ia) out.push([a[0], a[1]]); if (ia !== ib) { const t = (yl - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, yl]); } } return out; }
// a glass body: tinted, mottled, the liquid to a level, form arcs, reflections on the lit side, a few bubbles
function glass(f, F, body, o) {
  P(f, F, body, o.glass || C.GLASS, { tex: T(f, 'mottle'), texOp: 0.4, opacity: 0.94, dressO: { op: 0.25, wear: false } });
  if (o.level != null && !o.empty) { const q = clipBelow(body, o.level); if (q.length > 2) { f.part(F(q), { fill: o.liq, shade: 0.5, inkW: 1.1, cast: false, tex: T(f, 'mottle'), texOp: 0.6 }); grain(f, F, q, 0.3, 11, 1.1, '#e8ece4'); const top = q.filter(p => Math.abs(p[1] - o.level) < 0.5); if (top.length > 1) { const xs = top.map(p => p[0]); L(f, F, [[Math.min(...xs) + 4, o.level], [Math.max(...xs) - 4, o.level]], 2.4, mix(o.liq, '#fff', 0.5), { op: 0.8 }); } } }
  grain(f, F, body, 0.2, 12, 1.1, '#1a2420'); grain(f, F, body, 0.22, 17, -0.5, '#e8ece4');
  if (o.arcs) arcs(f, F, body, o.arcs[0], o.arcs[1], o.k || 0.22, { op: 0.35, col: '#1a2a20' });
  if (o.shade) shadeR(f, F, body, ...o.shade, 10, { op: 0.4 });
  for (const ln of o.hi || []) L(f, F, ln, ln.w || 6, '#f4f4ec', { op: 0.55 });
  const r = f.r; for (let i = 0; i < (o.bubbles || 8); i++) { const bb = E.bbox(o.level != null ? clipBelow(body, o.level) : body); if (!isFinite(bb[0])) break; f.flat(F(ell([bb[0] + (bb[2] - bb[0]) * (0.25 + r() * 0.5), bb[1] + (bb[3] - bb[1]) * (0.2 + r() * 0.6)], 3 + r() * 3, 3 + r() * 2, 0, 6)), '#e8ece0', { op: 0.5 }); }
}
const cork = (f, F, c, w, h) => { P(f, F, [[c[0] - w, c[1]], [c[0] + w, c[1]], [c[0] + w * 0.86, c[1] - h], [c[0] - w * 0.86, c[1] - h]], '#8a6a44', { dress: false, tex: T(f, 'mottle'), texOp: 0.9 }); oval(f, F, [c[0], c[1] - h], w * 0.86, w * 0.3, '#a8885a'); };
const liqOf = (o, dflt) => o.brew || (INKS[o.course] ? mix(INKS[o.course], '#2a1a10', 0.25) : dflt);

O.firepot = (f, o = {}) => { // a fire pot read as one (blind test: the corked round pot read as a flask): a wide-mouthed clay pot on three stubby feet, two lug handles, flames boiling up out of its open mouth, scorch down its sides
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const x of [-120, 0, 120]) P(f, F, [[x - 26, 150], [x + 26, 150], [x + 18, 230], [x - 18, 230]], C.CLAY, { dress: false });
  const body = turned([[230, -110], [240, -80], [250, 0], [220, 90], [150, 160], [90, 180]], 0.22); P(f, F, body, C.CLAY, { tex: T(f, 'mottle'), texOp: 1 });
  grain(f, F, body, 0.3, 10); arcs(f, F, body, [-40, 20, 80, 130], y => 245 - Math.max(0, y) * 0.6, 0.22, { op: 0.45 }); shadeR(f, F, body, 100, 250, -110, 180, 12, { op: 0.5 });
  for (const s2 of [-1, 1]) ring(f, F, [s2 * 252, -60], 26, 36, 10, C.CLAY);
  oval(f, F, [0, -110], 232, 50, mix(C.CLAY, '#fff', 0.15)); oval(f, F, [0, -106], 206, 40, '#3a1a0a', { shade: 0.2 }); f.flat(F(ell([0, -104], 160, 26, 0, 20)), '#d8803a', { op: 0.8 }); f.flat(F(ell([-20, -106], 90, 14, 0, 16)), '#f0c070', { op: 0.7 });   // the coals in its mouth
  for (let i = 0; i < 5; i++) L(f, F, [[-180 + i * 90, -96], [-170 + i * 86, 60 + (i % 2) * 40]], 14, '#1a120c', { op: 0.55 });   // scorch running down
  L(f, F, [[-220, -70], [-236, 40], [-190, 130]], 10, '#e8c8a0', { op: 0.4 }); D.chip(f, F([[200, -110]])[0], 10, 0); D.crack(f, F([[100, 60]])[0], 1.2, 70, { n: 4 });
  K.fxReq(f, 'flame', F([[-60, -130]])[0], 230, { col: '#c86030' }); K.fxReq(f, 'flame', F([[70, -126]])[0], 190, { col: '#c86030' });
  return { focus: F([[0, -110]])[0], sig: SB(F, [-280, -160, 280, 235]), feat: ['fire'], ells: [50 / 232, 40 / 206, 0.22] };
};
META.firepot = { act: 'burn' };

O.costrel = (f, o = {}) => { // a pilgrim's costrel: a flat round leather bottle, stitched round its rim, two strap loops, a wooden spout and stopper
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r, LE = '#6a4a30';
  const back = ell([18, 20], 210, 230, 0, 44); f.part(F(back), { fill: mix(LE, '#000', 0.4), shade: 0.3, inkW: 2, cast: true });   // its thickness
  const face = ell([0, 20], 210, 230, 0, 44); P(f, F, face, LE, { tex: T(f, 'mottle'), texOp: 1 });
  ring(f, F, [0, 20], 186, 206, 4, mix(LE, '#000', 0.25)); for (let i = 0; i < 40; i++) { const a = i / 40 * 6.28; L(f, F, [add([0, 20], [Math.cos(a) * 180, Math.sin(a) * 200]), add([0, 20], [Math.cos(a) * 194, Math.sin(a) * 214])], 2.4, '#d8c8a0', { op: 0.8 }); }   // the stitching
  oval(f, F, [0, 40], 90, 96, mix(LE, '#000', 0.2), { shade: 0.4 }); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; L(f, F, [add([0, 40], [Math.cos(a) * 30, Math.sin(a) * 32]), add([0, 40], [Math.cos(a) * 84, Math.sin(a) * 90])], 3, INK, { op: 0.6 }); }   // a tooled rose
  L(f, F, ell([0, 20], 196, 216, 0, 44).slice(24, 36), 8, '#e8c8a0', { op: 0.4 });
  for (const s of [-1, 1]) ring(f, F, [s * 200, -110], 26, 34, 10, LE);
  tube(f, F, [[-200, -140], [-160, -300], [0, -350], [160, -300], [200, -140]], 12, LE, { lit: false });
  P(f, F, [[-36, -200], [36, -200], [30, -270], [-30, -270]], C.OAKL, { tex: T(f, 'wood'), texOp: 0.9 }); cork(f, F, [0, -270], 26, 40);
  D.stain(f, F([[80, 140]])[0], 50, '#2a1a0c', { op: 0.35 }); f.scratches(F([[-60, -60]])[0], 40, 8, '#e8d8b8'); D.chip(f, F([[-200, 60]])[0], 9, 1.6);
  return { focus: F([[0, 20]])[0], sig: SB(F, [-235, -320, 235, 255]), hook: F([[0, -350]])[0], grip: { c: F([[0, -342]])[0], thumb: (o.ang ?? -0.1) + Math.PI / 2 }, feat: [], ells: [] };
};
META.costrel = { act: 'drip' };

O.demijohn = (f, o = {}) => { // a great demijohn of green glass in a wicker jacket, the acid fuming at its neck, the glass showing through the broken weave
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, WK = '#9a7a4a';
  const body = turned([[40, -300], [44, -250], [60, -200], [170, -120], [230, -20], [240, 80], [220, 170], [160, 230]], 0.22);
  glass(f, F, body, { glass: '#4a6a50', liq: '#3a4a26', level: -100, arcs: [[-60, 0, 60, 120, 180], y => 230], shade: [100, 230, -120, 220], hi: [[[-150, -100], [-210, 0], [-200, 120]]] });
  const wk = turned([[200, -60], [236, -10], [240, 80], [220, 170], [160, 230]], 0.22); P(f, F, wk, WK, { tex: T(f, 'weave'), texOp: 1 });
  for (let k = 0; k < 7; k++) { const y = -40 + k * 40; L(f, F, ell([0, y], 236 - Math.max(0, y - 100) * 0.5, 48, 0, 30).slice(0, 16), 4, INK, { op: 0.6 }); }
  for (let i = -6; i <= 6; i++) L(f, F, [[i * 34, -50], [i * 36, 100], [i * 26, 236]], 2.4, '#5a4a30', { op: 0.6 });
  f.part(F([[60, 40], [140, 30], [150, 120], [70, 130]]), { fill: '#4a6a50', shade: 0.3, inkW: 1.6, cast: false });   // the break in the weave
  ring(f, F, [0, -270], 46, 12, 6, '#3a5a40'); cork(f, F, [0, -300], 36, 40); D.wax(f, F([[-40, -306], [0, -314], [40, -306]]), '#3a2a20', { thick: 5, drips: 1, dripL: 30 });
  for (const s of [-1, 1]) { tube(f, F, [[s * 60, -200], [s * 200, -130], [s * 230, -60]], 10, WK, { lit: false }); }
  D.chip(f, F([[200, 200]])[0], 9, 0); D.stain(f, F([[-100, 160]])[0], 40, '#2a1a0c');
  K.fxReq(f, 'steam', F([[30, -350]])[0], 100, { col: '#9aa48a' });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-245, -350, 245, 260]), feat: ['steam', 'contents'], ells: [0.22] };
};
META.demijohn = { act: 'blow', only: ['close', 'floor', 'ledge', 'niche'] };

O.dropper = (f, o = {}) => { // a squat amber tincture bottle with its glass dropper seated in the neck: a fat black bulb on a bronze collar, the pipe showing through the glass, a dark drop running down the shoulder
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = liqOf(o, '#4a2a1a');
  const body = turned([[50, -130], [54, -90], [110, -50], [180, 20], [190, 200], [170, 250]], 0.22);
  glass(f, F, body, { glass: '#7a5a34', liq, level: 30, arcs: [[60, 120, 180], y => 190], shade: [100, 190, -40, 250], hi: [[[-150, 20], [-160, 200]], [[-36, -120], [-40, -70]]] });
  L(f, F, [[0, -120], [0, 220]], 14, INK, { op: 0.5 }); L(f, F, [[0, -120], [0, 220]], 8, '#c8d0c8', { op: 0.5 });   // the pipe inside
  D.label(f, F([[10, 120]])[0], 200, 110, o.ang ?? 0, '#cdbb94', G => { for (let k = 0; k < 4; k++) f.line(G([[-80, -30 + k * 18], [70, -32 + k * 18]]), 1.4, INK, { op: 0.7, dash: '7 3 4 2' }); });
  P(f, F, [[-70, -130], [70, -130], [64, -180], [-64, -180]], C.BRONZE, { dress: false }); oval(f, F, [0, -180], 64, 16, mix(C.BRONZE, '#fff', 0.2));
  const bulb = turned([[30, -380], [80, -350], [100, -290], [86, -220], [50, -186]], 0.22); P(f, F, bulb, '#2e2626', { tex: T(f, 'mottle'), texOp: 1 }); for (let i = 0; i < 4; i++) L(f, F, ell([0, -340 + i * 36], 90, 18, 0, 20).slice(0, 11), 2, INK, { op: 0.5 }); L(f, F, [[-64, -340], [-84, -260]], 9, '#a89a9a', { op: 0.5 });
  const run = [[60, -126], [100, -70], [150, -20], [160, 40]]; L(f, F, run, 12, INK); L(f, F, run, 7, liq);
  D.chip(f, F([[170, 240]])[0], 8, 0); D.stain(f, F([[-80, 230]])[0], 30, '#1a120c');
  return { focus: F([[0, -60]])[0], sig: SB(F, [-195, -385, 195, 265]), feat: ['contents'], ells: [16 / 64, 0.22] };
};
META.dropper = { act: 'drip', only: ['close', 'ledge', 'niche', 'table'] };

O.drinkinghorn = (f, o = {}) => { // a drinking horn tipped up to drink, mouth rimmed in bronze, the tip capped with a knob, red draught spilling from the lip
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = o.brew || '#5c0f0b';
  const S = sweep([[240, 180], [120, 160], [0, 100], [-100, 0], [-160, -140]], 30, 170, t => 30 + 140 * Math.pow(t, 1.4));
  P(f, F, S.poly, '#8a6a48', { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, S.A.slice(5, -3), 6, '#e8d0b0', { op: 0.45 });
  for (let i = 0; i < 9; i++) { const k = 4 + i * 2; if (k < S.c.length) L(f, F, [S.A[k], lerp(S.A[k], S.B[k], 0.5), S.B[k]], 2, '#3a2414', { op: 0.55 }); }
  const e = S.c[S.c.length - 1], d = norm(sub(e, S.c[S.c.length - 3])), ang = Math.atan2(d[1], d[0]) + Math.PI / 2;
  oval(f, F, e, 88, 30, C.BRONZE, { a: ang }); oval(f, F, e, 74, 22, liq, { a: ang, shade: 0.2 });
  for (const t of [0.6]) { const k = Math.round(t * (S.c.length - 1)), a = S.A[k], b = S.B[k], dd = norm(sub(b, a)), nn = [-dd[1], dd[0]]; P(f, F, [add(a, mul(nn, 12)), add(b, mul(nn, 12)), add(b, mul(nn, -12)), add(a, mul(nn, -12))], C.BRONZE, { dress: false, sharp: true }); }
  oval(f, F, [252, 182], 26, 24, C.BRONZE);
  const sp = [add(e, rot([60, 0], ang)), add(e, rot([90, 50], ang)), add(e, [80, 130])]; L(f, F, sp, 18, INK); L(f, F, sp, 12, liq);
  D.crack(f, F([[40, 110]])[0], -0.4, 60, { n: 3 }); D.chip(f, F([[-60, 40]])[0], 9, 0.5); D.stain(f, F([[100, 160]])[0], 30, '#2a1a0c');
  return { focus: F([[0, 60]])[0], sig: SB(F, [-260, -240, 280, 210]), mouth: F([add(e, [80, 130])])[0], feat: ['contents', 'blood'], ells: [30 / 88, 22 / 74] };
};
META.drinkinghorn = { act: 'pour' };

O.gemel = (f, o = {}) => { // a gemel flask: two glass bottles blown as one, two necks splaying apart, one brine-green and one burning-amber
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  for (const [s, liq] of [[-1, '#2e4a4a'], [1, '#8a4a1e']]) { const G = frame([s * 110, 0], s * 0.22, 1), Fp = pts => F(G(pts));
    const b = turned([[28, -330], [30, -220], [60, -150], [130, -60], [150, 40], [130, 140], [80, 200]], 0.22);
    glass(f, Fp, b, { liq, level: -40, arcs: [[-20, 40, 100, 160], y => 140], shade: [60, 150, -60, 200], hi: [[[-110, -40], [-130, 60], [-100, 140]]] });
    ring(f, Fp, [0, -310], 34, 9, 5, '#5a6a5a'); cork(f, Fp, [0, -330], 26, 34); }
  f.part(F([[-30, -40], [30, -40], [36, 160], [-36, 160]]), { fill: '#6a7a6a', shade: 0.4, inkW: 1.6, cast: false, opacity: 0.85 });   // where the two bodies are joined
  D.chip(f, F([[180, 170]])[0], 8, 0); D.crack(f, F([[-160, 40]])[0], 1.2, 60, { n: 3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-290, -400, 290, 240]), feat: ['contents'], ells: [0.22] };
};
META.gemel = { act: 'burst', only: ['close', 'ledge', 'table', 'niche'] };

O.ampoule = (f, o = {}) => { // a sealed glass ampoule, tear-shaped, its neck drawn to a fine sealed point, the elixir glowing gold-amber inside
  const F = frame([0, 0], o.ang ?? -0.3, 1), r = f.r, liq = o.brew || '#9a6a24';
  const body = turned([[4, -380], [14, -300], [24, -220], [60, -150], [130, -40], [160, 70], [140, 170], [80, 230]], 0.22);
  glass(f, F, body, { glass: '#a8b0a0', liq, level: -60, arcs: [[-20, 40, 100, 160], y => 150], shade: [60, 160, -60, 220], hi: [[[-100, -60], [-130, 60], [-100, 160]], [[-10, -280], [-14, -180]]] });
  f.flat(F(ell([-10, 60], 70, 90, 0, 20)), '#e0d4b0', { op: 0.35 });   // the glow in it
  for (const y of [-220, -190]) L(f, F, [[-24, y], [24, y]], 2, INK, { op: 0.6 }); // the scored neck
  f.part(F(ell([0, -384], 8, 8, 0, 8)), { fill: '#5a5a4a', shade: 0.3, inkW: 1.2, cast: false });
  D.chip(f, F([[120, 160]])[0], 7, 0);
  return { focus: F([[0, 40]])[0], sig: SB(F, [-165, -390, 165, 245]), feat: ['contents'], ells: [0.22] };
};
META.ampoule = { act: 'drip', ang: -0.3, only: ['close', 'ledge', 'niche', 'table'] };

O.decanter = (f, o = {}) => { // a clear glass decanter: a broad flat-shouldered base, a long neck with a ring, a ball stopper, the clear draught catching light
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = o.brew || '#a8a890';
  const body = turned([[34, -280], [36, -180], [44, -120], [140, -40], [220, 60], [230, 150], [210, 200]], 0.22);
  glass(f, F, body, { glass: '#b8c0b8', liq, level: 40, arcs: [[60, 110, 160], y => 228], shade: [120, 225, -40, 200], hi: [[[-150, -10], [-210, 80], [-200, 170]], [[-24, -260], [-26, -150]]] });
  ring(f, F, [0, -190], 44, 10, 6, '#a8b0a8'); oval(f, F, [0, -284], 40, 10, '#d8e0d8');
  P(f, F, [[-12, -286], [12, -286], [10, -310], [-10, -310]], '#c8d0c8', { dress: false }); oval(f, F, [0, -350], 46, 46, '#c0c8c0', { shade: 0.35 }); L(f, F, ell([0, -350], 34, 34, 0, 16).slice(9, 13), 4, '#ffffff', { op: 0.8 });
  for (let k = 0; k < 7; k++) L(f, F, [[-200 + k * 66, 80], [-180 + k * 60, 196]], 3, '#e8ece8', { op: 0.5 });   // cut flutes
  D.chip(f, F([[200, 200]])[0], 7, 0); D.stain(f, F([[60, 160]])[0], 20, '#5a5a4a');
  return { focus: F([[0, 60]])[0], sig: SB(F, [-235, -400, 235, 230]), feat: ['contents'], ells: [10 / 44, 0.22] };
};
META.decanter = { act: 'pour', only: ['close', 'ledge', 'table', 'niche'] };

O.torch = (f, o = {}) => { // a pitch torch: a stave wrapped in tarred rags bound with iron, the head burning and dripping black pitch
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r;
  P(f, F, limb([0, 380], [0, -60], 46, 52, { capB: false }), C.OAK, { tex: T(f, 'wood'), texOp: 0.9 }); lit(f, F, [[-16, 360], [-18, -40]], 4, 0.45);
  const head = [[-90, -40], [-110, -140], [-100, -250], [-60, -300], [60, -300], [100, -250], [110, -140], [90, -40]]; P(f, F, head, '#2a2018', { tex: T(f, 'weave'), texOp: 1 });
  for (let k = 0; k < 6; k++) { const y = -60 - k * 42; L(f, F, [[-104, y + 10], [0, y - 8], [104, y + 12]], 5, '#5a4a38', { op: 0.8 }); }
  for (const y of [-40, -200]) { L(f, F, [[-100, y], [100, y]], 18, INK); L(f, F, [[-96, y], [96, y]], 11, C.IRON); f.rivet(F([[0, y]])[0], 4, '#9a9a96'); }
  L(f, F, [[-80, -60], [-96, -240]], 6, '#7a6a58', { op: 0.6 });
  for (let i = 0; i < 3; i++) K.fxReq(f, 'drip', F([[-60 + i * 50, -30]])[0], 3, { col: '#120c08' });
  K.fxReq(f, 'flame', F([[0, -300]])[0], 210, { col: '#c86030' });
  D.bloom(f, F([[40, 200]])[0], 16, '#1a120c', { n: 2 }); D.chip(f, F([[20, 340]])[0], 8, 0);
  return { focus: F([[0, -180]])[0], sig: SB(F, [-120, -310, 120, 120]), grip: { c: F([[0, 260]])[0], thumb: (o.ang ?? -0.35) - Math.PI / 2 }, feat: ['fire'], ells: [] };
};
META.torch = { act: 'burn', ang: -0.35 };

O.amphora = (f, o = {}) => { // a Byzantine amphora: a tall ribbed clay body tapering to a pointed foot, two looped handles at the neck, a pitch-sealed mouth leaking fire
  const F = frame([0, 0], o.ang ?? 0.2, 1), r = f.r;
  const body = turned([[50, -300], [56, -260], [60, -200], [140, -120], [170, 0], [150, 140], [90, 250], [30, 330], [16, 350]], 0.22);
  P(f, F, body, '#9a6a48', { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, body, [-100, -60, -20, 20, 60, 100, 140, 180, 220], y => 170 - Math.abs(y) * 0.3, 0.22, { op: 0.55, w: 2 }); shadeR(f, F, body, 60, 170, -140, 300, 12, { op: 0.5 });
  for (const s of [-1, 1]) { const h = [[s * 56, -250], [s * 150, -260], [s * 160, -170], [s * 120, -120]]; tube(f, F, h, 26, '#8a5a3a'); }
  ring(f, F, [0, -300], 56, 14, 8, '#8a5a3a'); oval(f, F, [0, -304], 46, 11, '#1a120c');
  D.wax(f, F([[-50, -306], [0, -314], [50, -306]]), '#1a120c', { thick: 8, drips: 1, dripL: 50 });
  L(f, F, [[-120, -100], [-160, 20], [-130, 140]], 10, '#f0d8b8', { op: 0.4 }); D.chip(f, F([[150, 0]])[0], 10, 1.5); D.crack(f, F([[60, 100]])[0], 1.3, 90, { n: 4 }); D.stain(f, F([[-40, 200]])[0], 30, '#2a1a0c');
  K.fxReq(f, 'flame', F([[10, -320]])[0], 120, { col: '#c86030' });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-180, -330, 180, 355]), feat: ['fire'], ells: [14 / 56, 11 / 46, 0.22] };
};
META.amphora = { act: 'burn', ang: 0.2, only: ['close', 'niche', 'ledge'] };

O.crock = (f, o = {}) => { // a grey salt-glazed stoneware crock: a squat straight-sided jar with a rolled lip and a strap handle, a cobalt band, caustic lye slopping over
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = '#8a8a7a';
  const body = turned([[180, -150], [196, -130], [210, 0], [204, 140], [180, 200]], 0.22); P(f, F, body, '#9a9688', { tex: T(f, 'mottle'), texOp: 1 });
  arcs(f, F, body, [-80, -30, 20, 70, 120, 170], y => 205, 0.22, { op: 0.4 }); shadeR(f, F, body, 100, 210, -130, 200, 12, { op: 0.45 });
  for (let i = 0; i < 40; i++) f.flat(F(ell([-180 + (i * 47) % 360, -120 + (i * 31) % 300], 4, 3, 0, 6)), i % 2 ? '#c8c4b4' : '#6a665a', { op: 0.6 });   // salt-glaze pitting
  L(f, F, ell([0, -40], 208, 44, 0, 30).slice(0, 16), 14, INK); L(f, F, ell([0, -40], 208, 44, 0, 30).slice(0, 16), 9, '#3a4a6a');   // the cobalt band
  oval(f, F, [0, -150], 196, 42, '#b8b4a6'); oval(f, F, [0, -146], 172, 32, liq, { shade: 0.2 }); L(f, F, ell([0, -146], 120, 20, 0, 20).slice(11, 17), 3, '#e8e8e0', { op: 0.7 });
  tube(f, F, [[196, -120], [270, -100], [276, -10], [204, 10]], 22, '#8a8678');
  const sp = [[-180, -140], [-206, -80], [-200, 20]]; L(f, F, sp, 16, INK); L(f, F, sp, 10, liq);
  L(f, F, [[-170, -100], [-190, 40], [-170, 150]], 10, '#f0f0e8', { op: 0.4 }); D.chip(f, F([[120, -150]])[0], 10, 0); D.crack(f, F([[60, 80]])[0], 1.2, 80, { n: 4 });
  K.fxReq(f, 'steam', F([[0, -170]])[0], 90, { col: '#b8b4a8' });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-215, -195, 285, 230]), mouth: F([[-200, 20]])[0], feat: ['steam', 'contents'], ells: [42 / 196, 32 / 172, 0.22] };
};
META.crock = { act: 'pour' };

O.oillamp = (f, o = {}) => { // a brass oil lamp with its best-known outline (blind test: the flat clay lamp read as a wooden thing): a low swelling body, a long tapering spout with the wick burning at its tip, a domed lid with a knob, a curled handle
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, BR = C.BRONZE;
  const body = [[-200, 60], [-230, 0], [-190, -60], [-60, -90], [80, -80], [180, -40], [330, -60], [400, -90], [410, -70], [340, -20], [220, 40], [120, 90], [-80, 100]];
  P(f, F, body, BR, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, body, 0.3, 10); shadeR(f, F, body, -40, 300, -40, 110, 14, { op: 0.45, slant: 2 });
  P(f, F, turned([[30, -200], [60, -170], [110, -120], [130, -86]], 0.22).map(([x, y]) => [x - 40, y]), mix(BR, '#fff', 0.1), { tex: T(f, 'mottle'), texOp: 1 }); oval(f, F, [-40, -210], 22, 22, BR);   // the domed lid and knob
  P(f, F, [[-120, 100], [80, 100], [100, 150], [-140, 150]], BR, { dress: false }); oval(f, F, [-20, 150], 120, 22, mix(BR, '#000', 0.2));   // the foot
  tube(f, F, [[-210, -20], [-330, -70], [-360, 30], [-280, 80], [-220, 40]], 22, BR);
  L(f, F, [[-200, -40], [-60, -80], [100, -70], [300, -60]], 7, '#f0e0b0', { op: 0.55 }); D.bloom(f, F([[40, 40]])[0], 26, C.VERD, { n: 3, op: 0.5 }); D.chip(f, F([[120, 90]])[0], 8, 0);
  K.fxReq(f, 'flame', F([[400, -96]])[0], 170, { col: '#c86030' });
  return { focus: F([[60, -20]])[0], sig: SB(F, [-365, -235, 415, 175]), feat: ['fire'], ells: [0.22] };
};
META.oillamp = { act: 'burn', only: ['close', 'ledge', 'table', 'niche'] };

O.gourd = (f, o = {}) => { // a dried bottle gourd used as a flask: two swollen lobes, a cord tied round the waist, a corncob stopper, fen water leaking from a crack
  const F = frame([0, 0], o.ang ?? 0.15, 1), r = f.r, liq = '#4a4a2a';
  const body = turned([[40, -330], [60, -300], [110, -230], [118, -150], [80, -80], [80, -50], [170, 20], [220, 120], [200, 230], [140, 290]], 0.22);
  P(f, F, body, '#a8966e', { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, body, [-250, -190, -130, 20, 80, 140, 200, 250], y => y < -60 ? 110 : 210, 0.22, { op: 0.45 }); shadeR(f, F, body, 60, 220, -300, 290, 14, { op: 0.45 });
  for (let i = 0; i < 5; i++) L(f, F, [[-80 + i * 40, -60], [-60 + i * 30, -48]], 6, INK); L(f, F, ell([0, -60], 86, 18, 0, 20).slice(0, 11), 8, INK); L(f, F, ell([0, -60], 86, 18, 0, 20).slice(0, 11), 5, C.TWINE);
  tube(f, F, [[80, -60], [140, 20], [130, 120]], 5, C.TWINE, { lit: false });
  cork(f, F, [0, -330], 34, 50); for (let i = 0; i < 4; i++) L(f, F, [[-24, -350 - i * 10], [24, -346 - i * 10]], 1.6, INK, { op: 0.6 });
  L(f, F, [[-150, 40], [-200, 140], [-170, 240]], 10, '#f0e0c0', { op: 0.4 }); L(f, F, [[-80, -220], [-96, -140]], 6, '#f0e0c0', { op: 0.4 });
  D.crack(f, F([[120, 150]])[0], 1.2, 80, { n: 4, w: 2.4 }); D.bloom(f, F([[60, 200]])[0], 30, '#4a5a2a', { n: 3, op: 0.5 }); D.chip(f, F([[180, 220]])[0], 8, 0);
  K.fxReq(f, 'drip', F([[150, 200]])[0], 3, { col: liq });
  return { focus: F([[0, 60]])[0], sig: SB(F, [-225, -385, 225, 300]), feat: ['contents', 'crack'], ells: [0.22] };
};
META.gourd = { act: 'drip', only: ['close', 'ledge', 'floor', 'niche'] };

O.bandolier = (f, o = {}) => { // an alchemist's bandolier laid in a curve: a broad leather belt with a buckle, four loops each holding a corked bottle of a different brew
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, LE = '#5a3e28';
  const top = [[-380, -60], [-200, -10], [0, 10], [200, -10], [380, -60]], S = sweep(top, 70, 70);
  P(f, F, S.poly, LE, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, S.poly, 0.35, 9); grain(f, F, S.poly, 0.3, 14, -0.7, '#c8a878'); L(f, F, S.A, 3, '#c8a878', { op: 0.6, dash: '6 6' }); L(f, F, S.B, 3, '#c8a878', { op: 0.6, dash: '6 6' });
  const cols = ['#5c2a1a', '#2e3e4a', '#4a5a2a', '#3a2a44'];
  [-240, -80, 80, 240].forEach((x, i) => { const y = -10 + Math.abs(x) * -0.18 + 12, G = frame([x, y], x * 0.0006, 1), Fp = pts => F(G(pts));
    const b = turned([[22, -220], [24, -160], [60, -110], [64, 60], [56, 100]], 0.22); glass(f, Fp, b, { glass: '#5a6a5a', liq: cols[i], level: -60, bubbles: 2, hi: [[[-44, -90], [-48, 60]]] }); cork(f, Fp, [0, -220], 18, 30);
    P(f, Fp, [[-72, -10], [72, -10], [70, 60], [-70, 60]], mix(LE, '#000', 0.15), { tex: T(f, 'mottle'), texOp: 0.9, dress: false }); grain(f, Fp, [[-72, -10], [72, -10], [70, 60], [-70, 60]], 0.35, 8, -0.6, '#c8a878'); for (const s of [-1, 1]) f.rivet(Fp([[s * 56, 24]])[0], 4, '#9a8a66'); });
  P(f, F, [[350, -110], [440, -100], [436, 0], [346, -10]], C.BRONZE, { sharp: true }); f.part(F([[370, -86], [416, -80], [414, -24], [368, -30]]), { fill: LE, shade: 0.3, inkW: 1.4, cast: false });
  D.stain(f, F([[-300, -40]])[0], 30, '#1a120c'); D.chip(f, F([[0, 40]])[0], 8, 0);
  return { focus: F([[0, -80]])[0], sig: SB(F, [-410, -260, 445, 80]), feat: ['contents'], ells: [0.22] };
};
META.bandolier = { act: 'drip', only: ['close', 'table', 'floor'] };

O.antler = (f, o = {}) => { // a hart's antlers on their skull plate, as a trophy (blind test: one shed antler read as a dead branch): two branching beams spreading wide from a pale bone frontlet, brow tines forward, shavings rasped off one beam
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, AN = '#b8a07a';
  for (const s2 of [-1, 1]) { const X = p => [p[0] * s2, p[1]];
    const beam = sweep([[30, 140], [130, 60], [210, -60], [250, -200], [260, -330]].map(X), 70, 26); P(f, F, beam.poly, AN, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, beam.poly, 0.3, 9, 1.2, '#5a4430'); L(f, F, beam.A.slice(2, -3), 5, '#f4ecd8', { op: 0.45 });
    for (const [a, b, w] of [[[110, 80], [60, -40], 40], [[200, -40], [120, -170], 34], [[240, -170], [330, -270], 30], [[250, -250], [180, -350], 26]]) { const tn = sweep([X(a), X(lerp(a, b, 0.5)), X(b)], w, 9); P(f, F, tn.poly, AN, { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, tn.A.slice(1, -2), 3, '#f0e4c8', { op: 0.5 }); }
    ring(f, F, X([40, 130]), 46, 30, 8, '#8a7a5a'); }   // the burrs
  const plate = [[-90, 90], [-60, 60], [60, 60], [90, 90], [70, 200], [30, 260], [-30, 260], [-70, 200]]; P(f, F, plate, '#d8ccb0', { tex: T(f, 'mottle'), texOp: 1 }); shadeR(f, F, plate, 10, 90, 60, 260, 8, { op: 0.4 });
  for (const s2 of [-1, 1]) f.part(F(ell([s2 * 40, 150], 18, 12, 0, 10)), { fill: '#2a1e14', shade: 0.1, inkW: 1.4, cast: false, hatch: false });
  for (let i = 0; i < 16; i++) f.flat(F(ell([200 + (i * 23) % 80, -20 + (i * 17) % 60], 3, 2, 0, 6)), '#efe6cc', { op: 0.85 });   // rasped shavings
  D.crack(f, F([[0, 200]])[0], 1.6, 50, { n: 3 }); D.stain(f, F([[-150, -100]])[0], 24, '#5a4430');
  return { focus: F([[0, 60]])[0], sig: SB(F, [-345, -360, 345, 265]), feat: [], ells: [] };
};
META.antler = { act: 'crack', only: ['close', 'niche', 'ledge'] };

O.retort = (f, o = {}) => { // a glass retort over a flame: a round bulb, its long neck bent down and away, a drop forming at the beak
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = liqOf(o, '#5a3a22');
  const bulb = ell([-120, 60], 190, 180, 0, 44); glass(f, F, bulb, { liq, level: 80, arcs: [[0, 80, 160], y => 170 - Math.abs(y - 60) * 0.4], shade: [-10, 70, -100, 230], hi: [[[-250, 0], [-260, 100], [-210, 180]]] });
  const neck = sweep([[-60, -90], [20, -150], [140, -150], [260, -90], [350, -10]], 110, 26); glass(f, F, neck.poly, { glass: '#a8b4a8', bubbles: 0, hi: [neck.A.slice(3, -3).map(p => add(p, [0, 6]))] });
  f.part(F(ell([-90, -90], 66, 18, -0.3, 18)), { fill: '#a8b4a8', shade: 0.3, inkW: 1.4, cast: false });   // the tubulure on top
  P(f, F, [[-110, -110], [-70, -120], [-74, -150], [-110, -140]], '#8a6a44', { dress: false });
  f.part(F([[350, -10], [362, 20], [350, 34], [338, 20]]), { fill: liq, shade: 0.3, inkW: 1.2, cast: false });
  L(f, F, [[-310, 240], [70, 240]], 12, INK); L(f, F, [[-300, 240], [60, 240]], 7, C.IRON); for (const x of [-260, 20]) L(f, F, [[x, 240], [x - 30, 330]], 9, C.IRON);   // the iron ring stand
  K.fxReq(f, 'flame', F([[-120, 250]])[0], 80, { col: '#c86030' }); K.fxReq(f, 'drip', F([[352, 40]])[0], 2, { col: liq });
  D.stain(f, F([[-60, 160]])[0], 30, '#1a120c'); D.chip(f, F([[240, -110]])[0], 6, 0.5);
  return { focus: F([[-60, 40]])[0], sig: SB(F, [-315, -200, 370, 335]), mouth: F([[352, 40]])[0], feat: ['contents', 'fire'], ells: [] };
};
META.retort = { act: 'drip', only: ['close', 'table', 'ledge'] };

O.flashpan = (f, o = {}) => { // a brass flash pan on a long iron handle: a shallow round dish heaped with powder, flaring white in a gout of smoke
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r;
  P(f, F, [...ell([0, 0], 230, 70, 0, 40).slice(0, 21), ...ell([0, 60], 200, 56, 0, 40).slice(0, 21).reverse()], C.BRONZE, { tex: T(f, 'mottle'), texOp: 1 });
  oval(f, F, [0, 0], 230, 70, mix(C.BRONZE, '#fff', 0.2)); oval(f, F, [0, 4], 206, 56, '#4a3e2a', { shade: 0.25 });
  f.part(F([[-170, 10], [-100, -40], [0, -60], [110, -40], [170, 10], [100, 40], [-100, 40]]), { fill: '#3a3a36', shade: 0.4, inkW: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 1 });
  for (let i = 0; i < 30; i++) f.flat(F(ell([-150 + (i * 31) % 300, -30 + (i * 17) % 60], 3, 2, 0, 6)), i % 3 ? '#1a1a18' : '#c8c8b8', { op: 0.8 });
  tube(f, F, [[220, 20], [380, 60], [470, 80]], 26, C.IRON); ring(f, F, [500, 86], 30, 26, 10, C.IRON);
  L(f, F, ell([0, 0], 220, 64, 0, 40).slice(20, 34), 6, '#f0e0b0', { op: 0.5 }); D.bloom(f, F([[-120, 60]])[0], 20, C.VERD, { n: 3, op: 0.5 }); D.chip(f, F([[180, 40]])[0], 8, 0);
  K.fxReq(f, 'flame', F([[0, -40]])[0], 220, { col: '#d8b070' });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-235, -80, 260, 120]), grip: { c: F([[400, 66]])[0], thumb: (o.ang ?? -0.2) + Math.PI }, feat: ['fire'], ells: [70 / 230, 56 / 206] };
};
META.flashpan = { act: 'burst', ang: -0.2 };

O.tankard = (f, o = {}) => { // a pewter tankard with a hinged domed lid thumbed open, a strap handle, the courage foaming at the lip
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const body = turned([[150, -170], [150, -120], [162, 120], [180, 170], [186, 200]], 0.22); P(f, F, body, C.PEWTER, { tex: T(f, 'mottle'), texOp: 1 });
  arcs(f, F, body, [-80, -20, 40, 100], y => 156, 0.22, { op: 0.4 }); shadeR(f, F, body, 80, 165, -160, 200, 10, { op: 0.45 });
  for (const y of [-130, 150]) { L(f, F, ell([0, y], 158, 34, 0, 30).slice(0, 16), 10, INK); L(f, F, ell([0, y], 158, 34, 0, 30).slice(0, 16), 6, '#a8aaa4'); }
  oval(f, F, [0, -170], 150, 34, '#6a6c66'); oval(f, F, [0, -166], 134, 26, '#5a3a1e', { shade: 0.2 }); for (let i = 0; i < 7; i++) oval(f, F, [-90 + i * 30, -172 + (i % 2) * 6], 16, 8, '#e8dcc0', { inkW: 0.8 });   // foam
  const lid = [[-150, -176], [-130, -270], [-60, -330], [0, -340], [40, -320], [10, -290], [-80, -240], [-120, -180]]; P(f, F, lid, C.PEWTER, { tex: T(f, 'mottle'), texOp: 0.9 });
  oval(f, F, [-150, -190], 22, 22, '#6a6c66'); P(f, F, [[-150, -200], [-200, -260], [-180, -276], [-130, -214]], '#7a7c76', { dress: false });   // hinge and thumb-piece
  tube(f, F, [[-150, -110], [-260, -90], [-270, 60], [-160, 120]], 30, C.PEWTER);
  L(f, F, [[-120, -100], [-140, 40], [-130, 140]], 10, '#f4f4ec', { op: 0.5 }); D.chip(f, F([[120, 190]])[0], 8, 0); f.scratches(F([[40, 0]])[0], 40, 8, '#f0f0ea'); D.bloom(f, F([[90, 80]])[0], 20, '#4a4c48', { n: 2, op: 0.5 });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-290, -345, 190, 215]), grip: { c: F([[-265, -10]])[0], thumb: (o.ang ?? 0) }, feat: ['contents'], ells: [34 / 150, 26 / 134, 0.22] };
};
META.tankard = { act: 'swing' };

O.chamberpot = (f, o = {}) => { // a cracked earthenware chamber pot, glazed green-brown, its loop handle, a yellow reek curling off it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const body = turned([[230, -110], [210, -80], [220, 0], [190, 90], [130, 140], [110, 160]], 0.22); P(f, F, body, '#6a6a3a', { tex: T(f, 'mottle'), texOp: 1 });
  arcs(f, F, body, [-50, 0, 50, 100], y => 216 - Math.max(0, y) * 0.6, 0.22, { op: 0.45 }); shadeR(f, F, body, 90, 220, -100, 160, 12, { op: 0.5 });
  oval(f, F, [0, -110], 230, 50, '#7a7a46'); oval(f, F, [0, -104], 196, 38, '#5a5a20', { shade: 0.2 });
  tube(f, F, [[200, -70], [300, -60], [310, 40], [196, 60]], 26, '#6a6a3a');
  D.crack(f, F([[-150, -100]])[0], 1.3, 160, { n: 6, w: 3 }); D.crack(f, F([[60, 40]])[0], 0.8, 80, { n: 4 });
  L(f, F, [[-190, -60], [-200, 30], [-150, 110]], 10, '#e8e8c8', { op: 0.4 }); D.chip(f, F([[-120, -112]])[0], 12, 0); D.chip(f, F([[100, -150]])[0], 10, 0); D.stain(f, F([[0, 60]])[0], 40, '#2a2a0c');
  K.fxReq(f, 'steam', F([[-40, -130]])[0], 140, { col: '#a8a46a' });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-235, -165, 320, 175]), grip: { c: F([[305, -10]])[0], thumb: (o.ang ?? 0) + Math.PI }, feat: ['steam', 'crack'], ells: [50 / 230, 38 / 196, 0.22] };
};
META.chamberpot = { act: 'blow' };

O.athanor = (f, o = {}) => { // an athanor: a squat round brick-and-iron furnace tower with a domed top and chimney, its fire-mouth glowing, iron bands
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const body = turned([[150, -120], [190, -60], [200, 200], [210, 260]], 0.22); P(f, F, body, '#7a5a44', { tex: T(f, 'mottle'), texOp: 1 });
  for (let k = 0; k < 8; k++) { const y = -40 + k * 36; L(f, F, ell([0, y], 200, 44, 0, 30).slice(0, 16), 2, INK, { op: 0.6 }); for (let i = 0; i < 6; i++) { const a = 0.3 + i * 0.45 + (k % 2) * 0.22, x = -Math.cos(a) * 200; L(f, F, [[x, y + 8 * Math.sin(a)], [x, y + 36]], 2, INK, { op: 0.5 }); } }   // brick courses
  shadeR(f, F, body, 90, 210, -120, 260, 12, { op: 0.45 });
  for (const y of [-40, 220]) { L(f, F, ell([0, y], 202, 44, 0, 30).slice(0, 16), 16, INK); L(f, F, ell([0, y], 202, 44, 0, 30).slice(0, 16), 10, C.IRON); }
  const dome = turned([[40, -260], [90, -230], [140, -170], [156, -120]], 0.22); P(f, F, dome, '#5a5c60', { tex: T(f, 'mottle'), texOp: 1 });
  P(f, F, [[-40, -260], [40, -260], [36, -380], [-36, -380]], '#4a4c50', { sharp: true }); oval(f, F, [0, -380], 40, 12, '#1a1410');
  const mouth = [[-80, 200], [-80, 100], [-40, 60], [40, 60], [80, 100], [80, 200]]; f.part(F(mouth), { fill: '#2a1206', shade: 0.1, inkW: 2.6, cast: false, hatch: false }); f.flat(F(ell([0, 170], 60, 34, 0, 16)), '#d8803a', { op: 0.75 }); f.flat(F(ell([0, 160], 30, 18, 0, 12)), '#f0c070', { op: 0.6 });
  P(f, F, [[-100, 60], [100, 60], [100, 40], [-100, 40]], C.IRON, { dress: false });
  D.bloom(f, F([[120, 80]])[0], 24, '#1a120c', { n: 3 }); D.chip(f, F([[-180, 100]])[0], 12, 1.6); L(f, F, [[-170, -40], [-190, 180]], 10, '#e8c8a0', { op: 0.35 });
  K.fxReq(f, 'flame', F([[0, 120]])[0], 70, { col: '#c86030' }); K.fxReq(f, 'steam', F([[0, -390]])[0], 120, { col: '#6a645a' });
  return { focus: F([[0, 100]])[0], sig: SB(F, [-215, -385, 215, 300]), feat: ['fire', 'steam'], ells: [44 / 200, 0.22] };
};
META.athanor = { act: 'burn', only: ['close', 'floor', 'niche'] };

O.egg = (f, o = {}) => { // the philosophers' egg: an egg-shaped glass vessel sealed at its narrow top, standing in a three-legged iron ring, the work clouding inside
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = o.brew || (o.white ? '#c8c8c0' : '#5a4a4a');
  const egg = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, y = -Math.cos(a), x = Math.sin(a); egg.push([x * 170 * (1 + 0.18 * -y) * (y < 0 ? 1 : 1), -60 - y * 250 * (y > 0 ? 1.1 : 0.9)]); }
  glass(f, F, egg, { glass: '#b8c4bc', liq, level: 40, arcs: [[-180, -100, -20, 60, 140], y => 160 - Math.abs(y + 40) * 0.3], shade: [60, 190, -300, 180], hi: [[[-110, -220], [-150, -80], [-130, 60]]] });
  f.flat(F(ell([0, -80], 90, 60, 0, 18)), '#e8e4d8', { op: 0.3 }); for (let i = 0; i < 6; i++) f.flat(F(ell([-60 + i * 24, -110 + (i % 2) * 30], 20, 12, 0.3, 12)), '#d8d4c8', { op: 0.35 });   // the cloud of the work
  oval(f, F, [0, -332], 16, 10, '#6a6a5a', { shade: 0.3 }); D.wax(f, F([[-18, -334], [0, -340], [18, -334]]), C.WAX, { thick: 5, drips: 1, dripL: 24 });
  ring(f, F, [0, 140], 140, 30, 10, C.IRON); for (const x of [-120, 20, 130]) L(f, F, [[x, 150], [x * 1.3, 280]], 12, INK); for (const x of [-120, 20, 130]) L(f, F, [[x, 150], [x * 1.3, 280]], 7, C.IRON);
  D.chip(f, F([[120, 60]])[0], 6, 0); D.bloom(f, F([[-100, 150]])[0], 14, C.RUST, { n: 2 });
  return { focus: F([[0, -60]])[0], sig: SB(F, [-200, -345, 200, 285]), feat: ['contents'], ells: [30 / 140, 0.22] };
};
META.egg = { act: 'glare', noTurn: true, only: ['close', 'table', 'ledge', 'niche'] };

O.still = (f, o = {}) => { // a copper pot still: a fat boiler with a domed head, its swan neck running down into a coiled worm in a tub, a drip from the spout
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = liqOf(o, '#5a3a22');
  const pot = turned([[90, -150], [170, -100], [200, 0], [190, 110], [140, 170]], 0.22); P(f, F, pot, C.COPPER, { tex: T(f, 'mottle'), texOp: 1 }); arcs(f, F, pot, [-60, 0, 60, 120], y => 190, 0.22, { op: 0.45 }); shadeR(f, F, pot, 80, 200, -100, 170, 10, { op: 0.45 });
  for (let i = 0; i < 10; i++) f.rivet(F([[-180 + i * 40, 0 + Math.abs(i - 4.5) * -3]])[0], 3.5, '#c89a70');
  const head = turned([[30, -280], [70, -250], [100, -200], [96, -150]], 0.22); P(f, F, head, mix(C.COPPER, '#fff', 0.1), { tex: T(f, 'mottle'), texOp: 1 });
  const neck = sweep([[60, -250], [180, -300], [280, -260], [330, -160]], 50, 26); P(f, F, neck.poly, C.COPPER, { tex: T(f, 'mottle'), texOp: 0.9 }); L(f, F, neck.A.slice(2, -2), 4, '#f0c8a0', { op: 0.5 });
  const tub = [[250, -140], [430, -140], [420, 170], [260, 170]]; P(f, F, tub, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); for (const y of [-100, 130]) { L(f, F, [[252, y], [428, y]], 12, INK); L(f, F, [[252, y], [428, y]], 7, C.IRON); } for (let i = 1; i < 5; i++) L(f, F, [[250 + i * 36, -140], [260 + i * 32, 170]], 2, INK, { op: 0.6 });
  for (let k = 0; k < 4; k++) { const y = -110 + k * 60; L(f, F, ell([340, y], 80, 18, 0, 20).slice(0, 11), 14, INK); L(f, F, ell([340, y], 80, 18, 0, 20).slice(0, 11), 9, C.COPPER); }   // the worm's coils showing
  tube(f, F, [[420, 130], [480, 140], [490, 160]], 16, C.COPPER); P(f, F, [[-200, 170], [200, 170], [220, 220], [-220, 220]], '#3a3a3c', { dress: false });   // spout and the firebox rim
  D.bloom(f, F([[-60, 80]])[0], 26, C.VERD, { n: 3, op: 0.55 }); D.bloom(f, F([[300, -40]])[0], 18, C.VERD, { n: 2, op: 0.5 });
  K.fxReq(f, 'drip', F([[492, 170]])[0], 3, { col: liq }); K.fxReq(f, 'flame', F([[0, 220]])[0], 80, { col: '#c86030' });
  return { focus: F([[100, -60]])[0], sig: SB(F, [-225, -310, 495, 225]), mouth: F([[492, 170]])[0], feat: ['contents', 'fire'], ells: [0.22] };
};
META.still = { act: 'drip', only: ['close', 'floor', 'table'] };

O.roemer = (f, o = {}) => { // a green roemer: a wide round bowl of glass on a hollow stem studded with raspberry prunts, a coiled foot, spiced wine in it
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = o.brew || '#3a1416';
  const bowl = turned([[180, -260], [200, -180], [190, -90], [130, -30], [70, 0]], 0.22); glass(f, F, bowl, { glass: '#7a9a6a', liq, level: -180, arcs: [[-140, -90], y => 180], shade: [100, 200, -250, -20], hi: [[[-160, -230], [-180, -150], [-140, -70]]] });
  const stem = [[-70, 0], [70, 0], [76, 180], [-76, 180]]; P(f, F, stem, '#5a7a4a', { tex: T(f, 'mottle'), texOp: 0.9, opacity: 0.95 });
  for (let k = 0; k < 6; k++) { const c = [-44 + (k % 3) * 44, 50 + Math.floor(k / 3) * 70]; oval(f, F, c, 18, 18, '#6a8a5a', { shade: 0.4 }); f.flat(F(ell(add(c, [-5, -6]), 5, 4, 0, 6)), '#e8f0e0', { op: 0.7 }); }   // the prunts
  for (let k = 0; k < 4; k++) { const y = 190 + k * 18; L(f, F, ell([0, y], 110 + k * 22, 20 + k * 4, 0, 24).slice(0, 13), 14, INK); L(f, F, ell([0, y], 110 + k * 22, 20 + k * 4, 0, 24).slice(0, 13), 9, '#6a8a5a'); }   // the coiled foot
  oval(f, F, [0, -260], 180, 40, '#8aaa7a', { opacity: 0.9 }); oval(f, F, [0, -184], 168, 30, liq, { shade: 0.2 });
  D.chip(f, F([[150, -250]])[0], 7, 0); D.stain(f, F([[0, -120]])[0], 30, '#2a0a06');
  return { focus: F([[0, -150]])[0], sig: SB(F, [-205, -305, 205, 275]), grip: { c: F([[0, 90]])[0], thumb: (o.ang ?? 0) - Math.PI / 2 }, feat: ['contents'], ells: [40 / 180, 30 / 168, 0.22] };
};
META.roemer = { act: 'pour', noTurn: true };

O.wateringcan = (f, o = {}) => { // a copper watering can (blind test: the pierced clay pot read as a plain round vessel): a drum body, a long spout ending in a pierced rose, a strap handle over the top, rain falling from the rose
  const F = frame([0, 0], o.ang ?? 0.12, 1), r = f.r, CU = C.COPPER;
  const body = turned([[170, -150], [180, -120], [190, 120], [180, 160]], 0.22); P(f, F, body, CU, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, body, 0.3, 10); shadeR(f, F, body, 90, 190, -150, 170, 10, { op: 0.45 });
  for (const y of [-110, 130]) { L(f, F, ell([0, y], 184, 40, 0, 30).slice(0, 16), 10, INK); L(f, F, ell([0, y], 184, 40, 0, 30).slice(0, 16), 6, mix(CU, '#000', 0.25)); }
  oval(f, F, [0, -150], 170, 38, mix(CU, '#fff', 0.15)); oval(f, F, [0, -146], 120, 26, '#1a120c');
  const sp = sweep([[150, 60], [250, -20], [350, -110], [430, -190]], 54, 26); P(f, F, sp.poly, CU, { tex: T(f, 'mottle'), texOp: 1 }); L(f, F, sp.A.slice(1, -2), 4, '#f0c8a0', { op: 0.5 });
  const rc = [452, -212]; oval(f, F, rc, 54, 30, mix(CU, '#fff', 0.1), { a: -0.8 }); for (let i = 0; i < 9; i++) f.flat(F(ell(add(rc, [Math.cos(i) * 30, Math.sin(i * 1.7) * 14]), 4, 3, 0, 6)), '#120c08');   // the rose
  tube(f, F, [[-170, -60], [-250, -160], [-120, -300], [60, -280], [120, -150]], 22, CU);
  L(f, F, [[-150, -100], [-160, 40], [-150, 140]], 10, '#f0d0b0', { op: 0.45 }); D.bloom(f, F([[60, 60]])[0], 30, C.VERD, { n: 4, op: 0.55 }); D.chip(f, F([[170, -150]])[0], 9, 0);
  for (let i = 0; i < 6; i++) K.fxReq(f, 'drip', F([add(rc, [20 + i * 14, 40 + (i % 3) * 16])])[0], 3, { col: '#2e3e4a' });
  return { focus: F([[100, -60]])[0], sig: SB(F, [-275, -315, 510, 200]), grip: { c: F([[-180, -230]])[0], thumb: (o.ang ?? 0.12) + 1.2 }, feat: ['contents'], ells: [38 / 170, 26 / 120, 0.22] };
};
META.wateringcan = { act: 'drip', ang: 0.12 };

O.matula = (f, o = {}) => { // a physician's matula held up to the light: a round-bottomed clear flask with a wide flared neck, cloudy urine in it, a wicker carrying basket below
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = '#8a7e5a';
  const body = turned([[90, -320], [60, -270], [56, -200], [110, -140], [190, -40], [210, 60], [180, 160], [100, 220], [20, 236]], 0.22);
  glass(f, F, body, { glass: '#c0c8c0', liq, level: -60, arcs: [[-20, 40, 100, 160], y => 200 - Math.abs(y - 60) * 0.4], shade: [90, 210, -60, 220], hi: [[[-140, -60], [-180, 40], [-150, 140]], [[-36, -270], [-40, -200]]] });
  f.flat(F(ell([0, 60], 120, 70, 0, 20)), '#e8d8a0', { op: 0.25 }); for (let i = 0; i < 5; i++) f.flat(F(ell([-60 + i * 30, 120 + (i % 2) * 30], 16, 6, 0.2, 10)), '#6a5a2a', { op: 0.4 });   // the sediment read
  oval(f, F, [0, -320], 90, 22, '#d8e0d8'); L(f, F, ell([0, -320], 90, 22, 0, 24).slice(13, 22), 3, '#ffffff', { op: 0.7 });
  const bk = turned([[160, 120], [190, 160], [150, 250], [90, 270]], 0.22); P(f, F, bk, '#9a7a4a', { tex: T(f, 'weave'), texOp: 1 }); for (let k = 0; k < 4; k++) L(f, F, ell([0, 140 + k * 34], 186 - k * 14, 36, 0, 24).slice(0, 13), 3, INK, { op: 0.6 });
  tube(f, F, [[-150, 130], [-230, -40], [-200, -200], [-120, -260]], 10, '#9a7a4a', { lit: false });
  D.chip(f, F([[150, 250]])[0], 8, 0);
  return { focus: F([[0, 20]])[0], sig: SB(F, [-240, -345, 215, 280]), grip: { c: F([[-180, -230]])[0], thumb: (o.ang ?? 0) + 1.2 }, feat: ['contents'], ells: [22 / 90, 0.22] };
};
META.matula = { act: 'glare', noTurn: true };

O.pomegranate = (f, o = {}) => { // a ripe pomegranate split open: a round leathery fruit with its crown, burst along one side to show packed seeds, juice running
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, SK = '#7a3a28';
  const body = ell([0, 20], 250, 230, 0, 48); P(f, F, body, SK, { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, body, 0.3, 10); arcs(f, F, body, [-120, -60, 0, 60, 120, 180], y => 250 - Math.abs(y - 20) * 0.5, 0.3, { op: 0.35 }); shadeR(f, F, body, 60, 250, -200, 250, 14, { op: 0.45 }); L(f, F, ell([0, 20], 230, 210, 0, 48).slice(26, 38), 10, '#d8a080', { op: 0.45 });
  const crown = [[-60, -200], [-70, -270], [-40, -240], [-20, -290], [0, -250], [20, -290], [40, -240], [70, -270], [60, -200]]; P(f, F, crown, mix(SK, '#000', 0.2), { sharp: true, dress: false });
  const split = [[40, -120], [150, -110], [230, -20], [240, 90], [180, 190], [80, 200], [40, 100], [70, 0]]; f.part(F(split), { fill: '#e8d8b8', shade: 0.3, inkW: 2.2, cast: false });   // the pith
  for (let i = 0; i < 46; i++) { const c = [70 + (i % 8) * 22 + (Math.floor(i / 8) % 2) * 10, -90 + Math.floor(i / 8) * 50 + (i % 3) * 4]; if (c[0] < 225 - Math.abs(c[1] - 40) * 0.4) { f.part(F(ell(c, 11, 13, 0.3, 8)), { fill: '#6a1810', shade: 0.4, inkW: 1, cast: false }); f.flat(F(ell(add(c, [-3, -4]), 3, 3, 0, 6)), '#e8a090', { op: 0.8 }); } }
  for (let i = 0; i < 3; i++) L(f, F, [[60 + i * 70, -100 + i * 40], [44 + i * 66, 196 - i * 20]], 3, '#c8b898', { op: 0.7 });
  D.bloom(f, F([[-120, 120]])[0], 30, '#3a1a10', { n: 3, op: 0.5 }); D.chip(f, F([[-200, -60]])[0], 8, 0); D.stain(f, F([[-60, -60]])[0], 40, '#3a1a12');
  K.fxReq(f, 'drip', F([[140, 200]])[0], 3, { col: '#4c0c08' });
  return { focus: F([[120, 40]])[0], sig: SB(F, [-255, -295, 255, 255]), feat: ['contents', 'blood'], ells: [] };
};
META.pomegranate = { act: 'burst', only: ['close', 'table', 'ledge', 'floor'] };

O.pelican = (f, o = {}) => { // an alchemist's pelican: a round-bellied glass with a tall head from which two arms curve back down into the belly, the work circulating
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, liq = liqOf(o, '#6a3a22');
  const body = turned([[40, -340], [50, -260], [70, -170], [160, -80], [200, 30], [180, 140], [110, 200], [80, 220]], 0.22);
  for (const s of [-1, 1]) { const arm = sweep([[s * 40, -250], [s * 200, -260], [s * 280, -150], [s * 230, -20], [s * 150, 60]], 40, 34); glass(f, F, arm.poly, { glass: '#a8b4a8', bubbles: 0, hi: [arm.A.slice(3, -4)] }); }
  glass(f, F, body, { liq, level: 20, arcs: [[60, 110, 160], y => 190], shade: [90, 200, -100, 210], hi: [[[-130, -60], [-180, 40], [-150, 140]], [[-30, -320], [-40, -200]]] });
  oval(f, F, [0, -344], 36, 10, '#c8d0c8'); D.wax(f, F([[-40, -348], [0, -356], [40, -348]]), C.WAX, { thick: 5, drips: 1, dripL: 30 });
  for (let i = 0; i < 6; i++) f.flat(F(ell([-50 + i * 20, 60 + (i % 2) * 40], 14, 8, 0.4, 10)), mix(liq, '#fff', 0.35), { op: 0.4 });   // the circulating work
  K.fxReq(f, 'drip', F([[-200, -120]])[0], 2, { col: liq }); D.chip(f, F([[150, 180]])[0], 7, 0);
  return { focus: F([[0, -20]])[0], sig: SB(F, [-300, -360, 300, 230]), feat: ['contents'], ells: [0.22] };
};
META.pelican = { act: 'drip', noTurn: true, only: ['close', 'ledge', 'table', 'niche'] };

O.albarello = (f, o = {}) => { // an apothecary's albarello: a waisted tin-glazed drug jar, blue and ochre bands, a scrolled label reading THERIAC, a parchment cover tied over its mouth
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, GZ = '#d8d0b8';
  const body = turned([[130, -250], [150, -220], [150, -140], [120, -40], [112, 40], [130, 140], [150, 220], [140, 260]], 0.22); P(f, F, body, GZ, { tex: T(f, 'mottle'), texOp: 1 });
  shadeR(f, F, body, 60, 150, -230, 260, 12, { op: 0.45 }); arcs(f, F, body, [-180, -100, 100, 180], y => 148, 0.22, { op: 0.35 });
  for (const [y, col] of [[-200, '#2e3e6a'], [-160, '#9a7a3a'], [180, '#9a7a3a'], [220, '#2e3e6a']]) { L(f, F, ell([0, y], 150, 32, 0, 30).slice(0, 16), 16, INK); L(f, F, ell([0, y], 150, 32, 0, 30).slice(0, 16), 11, col); }
  for (let i = 0; i < 4; i++) { const x = -90 + i * 60; L(f, F, [[x, -120], [x + 20, -80], [x, -40]], 5, '#2e3e6a', { op: 0.8 }); L(f, F, [[x, 40], [x + 20, 80], [x, 120]], 5, '#2e3e6a', { op: 0.8 }); }   // painted leaf scrolls
  f.part(F([[-110, -20], [110, -30], [116, 30], [-104, 40]]), { fill: '#e8e0c8', shade: 0.3, inkW: 1.6, cast: false }); for (let k = 0; k < 7; k++) L(f, F, [[-84 + k * 26, -8], [-70 + k * 26, 22]], 4, '#2e3e6a');   // the label's letters
  const cover = [[-150, -250], [-120, -300], [0, -320], [120, -300], [150, -250], [170, -210], [130, -228], [0, -236], [-130, -228], [-170, -210]]; P(f, F, cover, '#c8b88a', { tex: T(f, 'mottle'), texOp: 0.9 });
  L(f, F, ell([0, -238], 150, 26, 0, 24).slice(0, 13), 6, INK); L(f, F, ell([0, -238], 150, 26, 0, 24).slice(0, 13), 3.5, C.TWINE);
  L(f, F, [[-120, -120], [-104, 0], [-120, 140]], 10, '#ffffff', { op: 0.45 }); D.chip(f, F([[140, 230]])[0], 10, 0); D.chip(f, F([[-150, -150]])[0], 9, 1.6); D.crack(f, F([[80, 140]])[0], 1.2, 60, { n: 3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-175, -325, 175, 275]), feat: [], ells: [32 / 150, 0.22] };
};
META.albarello = { act: 'open', only: ['close', 'ledge', 'table', 'niche'] };

O.plaguemask = (f, o = {}) => { // a plague doctor's beaked mask: a long curved leather beak stuffed with herbs, two round glass eyes in brass rims, straps, stitching
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, LE = '#3a2a22';
  const head = [[-260, -140], [-160, -230], [-40, -230], [40, -180], [60, -80], [40, 60], [-60, 120], [-200, 110], [-280, 20]]; P(f, F, head, mix(LE, '#fff', 0.1), { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, head, 0.4, 9);
  const beak = [[30, -170], [180, -110], [330, 0], [400, 110], [380, 120], [250, 80], [100, 70], [40, 40]]; P(f, F, beak, mix(LE, '#fff', 0.18), { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, beak, 0.4, 9, -0.4);
  for (let i = 0; i < 6; i++) L(f, F, [[60 + i * 50, -150 + i * 34], [70 + i * 42, 66 - i * 2]], 2.4, '#c8b898', { op: 0.7, dash: '6 5' });   // stitched seams down the beak
  L(f, F, [[40, -170], [180, -116], [330, -6]], 5, '#a89a8a', { op: 0.5 });
  for (const [cx, cy] of [[-150, -90], [-20, -100]]) { oval(f, F, [cx, cy], 58, 58, C.BRONZE, { shade: 0.4 }); oval(f, F, [cx, cy], 40, 40, '#2a3a3a', { shade: 0.2 }); f.flat(F(ell([cx - 12, cy - 14], 12, 8, -0.5, 10)), '#e8f0f0', { op: 0.85 }); for (let k = 0; k < 6; k++) f.rivet(F([add([cx, cy], [Math.cos(k) * 50, Math.sin(k) * 50])])[0], 3, '#c8b088'); }
  tube(f, F, [[-260, -40], [-330, 0], [-340, 120]], 18, LE, { lit: false }); tube(f, F, [[-230, -170], [-300, -240]], 16, LE, { lit: false });
  for (let i = 0; i < 5; i++) f.part(F(ell([380 - i * 12, 106 - i * 6], 10, 6, 0.5, 8)), { fill: '#5a6a34', shade: 0.4, inkW: 1, cast: false });   // herbs at the nostril
  D.stain(f, F([[200, 30]])[0], 40, '#1a120c'); D.chip(f, F([[-200, 100]])[0], 8, 0); f.scratches(F([[-100, 40]])[0], 40, 8, '#c8b898');
  return { focus: F([[-60, -80]])[0], sig: SB(F, [-345, -240, 405, 130]), feat: [], ells: [] };
};
META.plaguemask = { act: 'blow', only: ['close', 'table', 'niche', 'ledge'] };

O.mushroom = (f, o = {}) => { // a cluster-free single toadstool of black rot: a broad cap, split and blackened at its rim, gills beneath, a ringed stalk in a clod of earth
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, CAP = '#4a3a30';
  P(f, F, [[-70, -40], [70, -40], [80, 180], [100, 230], [-100, 230], [-80, 180]], '#c8bca0', { tex: T(f, 'mottle'), texOp: 1 }); shadeR(f, F, [[-70, -40], [70, -40], [80, 180], [-80, 180]], 10, 80, -40, 200, 8, { op: 0.45 });
  P(f, F, [[-90, 40], [90, 40], [110, 80], [-110, 80]], '#b0a488', { dress: false });   // the ring
  f.part(F(ell([0, -40], 280, 60, 0, 40)), { fill: '#8a7a60', shade: 0.4, inkW: 2, cast: false }); for (let i = 0; i < 24; i++) { const a = Math.PI * i / 24; L(f, F, [[0, -40], [Math.cos(a) * 270, -40 + Math.sin(a) * 56]], 1.6, INK, { op: 0.6 }); }   // gills
  const cap = [[-300, -40], [-280, -120], [-200, -210], [-80, -260], [80, -260], [200, -210], [280, -120], [300, -40], [200, -60], [100, -50], [0, -56], [-120, -50], [-220, -64]]; P(f, F, cap, CAP, { tex: T(f, 'mottle'), texOp: 1 });
  shadeR(f, F, cap, 60, 300, -270, -40, 14, { op: 0.5 }); L(f, F, [[-260, -110], [-180, -200], [-60, -246]], 10, '#c8a888', { op: 0.45 });
  for (let i = 0; i < 9; i++) { const c = [-200 + i * 50, -170 + Math.abs(i - 4) * 14]; f.part(F(ell(c, 16 + (i % 3) * 5, 10, 0, 10)), { fill: '#d8ccb0', shade: 0.3, inkW: 1, cast: false }); }   // the warts
  for (const x of [-220, 160]) f.part(F([[x, -50], [x + 30, -120], [x + 50, -50]]), { fill: '#120c08', shade: 0.1, inkW: 1.4, cast: false, hatch: false });   // splits at the rim
  P(f, F, [[-170, 230], [-120, 200], [120, 200], [180, 230], [130, 270], [-140, 270]], '#3a2e22', { tex: T(f, 'mottle'), texOp: 1 });
  D.bloom(f, F([[100, -120]])[0], 40, '#120c08', { n: 4, op: 0.6 }); D.stain(f, F([[30, 120]])[0], 20, '#2a1a0c');
  K.fxReq(f, 'steam', F([[0, -270]])[0], 80, { col: '#6a705a' });
  return { focus: F([[0, -120]])[0], sig: SB(F, [-305, -265, 305, 275]), feat: [], ells: [60 / 280] };
};
META.mushroom = { act: 'blow', only: ['close', 'floor', 'table', 'ledge'] };

O.lancet = (f, o = {}) => { // a barber-surgeon's fleam folded out of its horn case: a broad case, three blades on pins, one open with a lit edge and a bead of blood at its point
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r;
  const cas = [[-300, -40], [-260, -90], [60, -80], [110, -40], [100, 40], [60, 80], [-260, 70], [-300, 30]]; D.slab(f, F(cas), [10, 14], '#2a1a10'); P(f, F, cas, '#7a5a3a', { tex: T(f, 'mottle'), texOp: 1 });
  for (const x of [-220, -60]) { P(f, F, [[x - 26, -80], [x + 26, -80], [x + 26, 70], [x - 26, 70]], C.BRONZE, { dress: false, sharp: true }); f.rivet(F([[x, -6]])[0], 5, '#c8b888'); }
  L(f, F, [[-280, -60], [80, -60]], 4, '#e8d0b0', { op: 0.45 });
  const blades = [[[60, -10], [150, -60], [250, -290], [300, -300], [270, -200], [150, 40]], [[60, -10], [160, -30], [370, -90], [400, -40], [330, 40], [150, 40]]];
  for (const b of blades) { P(f, F, b, C.IRONL, { sharp: true, dress: false }); L(f, F, b.slice(1, 4), 2.4, '#f8f8f0', { op: 0.8 }); }
  f.part(F(ell([380, 0], 12, 14, 0, 10)), { fill: '#5c0f0b', shade: 0.3, inkW: 1.2, cast: false }); D.bloom(f, F([[300, -20]])[0], 12, '#4c0c08', { n: 2, op: 0.6 });
  f.rivet(F([[80, 0]])[0], 9, '#c8c8c4'); D.chip(f, F([[-200, 70]])[0], 8, 0); D.stain(f, F([[-100, 20]])[0], 30, '#1a120c');
  return { focus: F([[200, -60]])[0], sig: SB(F, [-305, -280, 395, 85]), grip: { c: F([[-180, 0]])[0], thumb: (o.ang ?? -0.2) }, feat: ['blood'], ells: [] };
};
META.lancet = { act: 'drip', ang: -0.2 };

O.screwpress = (f, o = {}) => { // a wooden screw press: two oak posts and a heavy crosshead, a great threaded screw turned by a capstan bar, the platen bearing down
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-300, 250], [300, 250], [320, 320], [-320, 320]], C.OAK, { sharp: true, tex: T(f, 'wood'), texOp: 1 });
  for (const s of [-1, 1]) { const post = [[s * 250, -320], [s * 190, -320], [s * 190, 260], [s * 250, 260]].map(p => [p[0], p[1], 1]); D.slab(f, F(post), [14, 0]); P(f, F, post, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); }
  const head = [[-300, -330, 1], [300, -330, 1], [300, -230, 1], [-300, -230, 1]]; D.slab(f, F(head), [12, 12]); P(f, F, head, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); lit(f, F, [[-296, -326], [296, -326]], 4, 0.5);
  P(f, F, [[-56, -400], [56, -400], [56, 40], [-56, 40]], C.OAK, { tex: T(f, 'wood'), texOp: 0.9 }); for (let k = 0; k < 16; k++) { const y = -380 + k * 26; L(f, F, [[-56, y + 12], [56, y - 4]], 5, INK, { op: 0.75 }); L(f, F, [[-50, y + 8], [50, y - 8]], 2, '#c8a878', { op: 0.5 }); }   // the thread
  tube(f, F, [[-260, -160], [260, -110]], 26, C.OAKL); P(f, F, [[-70, -170], [70, -170], [70, -100], [-70, -100]], C.OAK, { dress: false, sharp: true });   // the capstan bar through its boss
  const platen = [[-170, 40, 1], [170, 40, 1], [170, 100, 1], [-170, 100, 1]]; D.slab(f, F(platen), [10, 10]); P(f, F, platen, C.OAKL, { tex: T(f, 'wood'), texOp: 1 });
  P(f, F, [[-150, 100], [150, 100], [160, 250], [-160, 250]], '#c8bca0', { tex: T(f, 'weave'), texOp: 0.9 }); for (let k = 0; k < 5; k++) L(f, F, [[-156, 120 + k * 28], [156, 120 + k * 28]], 2.4, INK, { op: 0.6 });   // the pressed stack of cloths
  for (const [x, y] of [[-220, -280], [220, -280], [-220, 280], [220, 280]]) f.rivet(F([[x, y]])[0], 6, '#6a6a66');
  D.crack(f, F([[220, 0]])[0], 1.5, 90, { n: 4 }); D.chip(f, F([[-300, -300]])[0], 10, 1.6); D.stain(f, F([[0, 200]])[0], 40, '#3a2a14');
  K.fxReq(f, 'drip', F([[-150, 250]])[0], 3, { col: '#3a2a44' }); K.fxReq(f, 'drip', F([[140, 250]])[0], 3, { col: '#3a2a44' });
  return { focus: F([[0, 60]])[0], sig: SB(F, [-320, -405, 320, 325]), feat: [], ells: [] };
};
META.screwpress = { act: 'press', only: ['close', 'floor', 'niche'] };


O.bomb = (f, o = {}) => { // a powder pot as everyone knows it: a round black iron shell, a short neck with a cap, a fuse burning down, rivet seam round its middle
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, c = [0, 40], R = 220;
  P(f, F, ell(c, R, R, 0, 48), '#46474a', { tex: T(f, 'mottle'), texOp: 1 }); grain(f, F, ell(c, R, R, 0, 48), 0.4, 8, 0.9, '#b8b8b4'); grain(f, F, ell(c, R, R, 0, 48), 0.3, 12, -0.6, '#16110e'); arcs(f, F, ell(c, R, R, 0, 48), [c[1] - 120, c[1] - 60, c[1] + 60, c[1] + 120], y => Math.sqrt(Math.max(0, R * R - (y - c[1]) ** 2)), 0.22, { op: 0.45 });
  L(f, F, ell(c, R - 20, R - 20, 0, 48).slice(26, 40), 14, '#b8b8b4', { op: 0.5 }); f.flat(F(ell(add(c, [-90, -100]), 40, 26, -0.6, 16)), '#e0e0dc', { op: 0.6 });
  const eq = ell(c, R, 46, 0, 40).slice(0, 21); L(f, F, eq, 14, INK); L(f, F, eq, 8, '#5a5c60'); for (let i = 1; i < 20; i += 2) f.rivet(F([eq[i]])[0], 4, '#9a9a96');
  P(f, F, [[-50, c[1] - R - 50], [50, c[1] - R - 50], [56, c[1] - R + 20], [-56, c[1] - R + 20]], '#4a4c50', { dress: false }); oval(f, F, [0, c[1] - R - 50], 50, 14, '#5a5c60');
  const fuse = [[0, c[1] - R - 56], [30, c[1] - R - 120], [80, c[1] - R - 150], [120, c[1] - R - 140]]; L(f, F, fuse, 12, INK); L(f, F, fuse, 7, '#a89470');
  D.bloom(f, F([add(c, [100, 80])])[0], 30, C.RUST, { n: 3 }); D.chip(f, F([add(c, [-180, 80])])[0], 9, 1.2);
  K.fxReq(f, 'flame', F([[124, c[1] - R - 146]])[0], 90, { col: '#d89040' });
  return { focus: F([c])[0], sig: SB(F, [-225, c[1] - R - 160, 225, c[1] + R + 5]), feat: ['fire'], ells: [46 / R] };
};
META.bomb = { act: 'burn', only: ['close', 'floor', 'ledge', 'table'] };

O.unicornhorn = (f, o = {}) => { // the panacea of the apothecaries: a long spiralled unicorn's horn, ivory, its base capped in a silver mount, laid on a cloth with a few grains rasped from its tip
  const F = frame([0, 0], o.ang ?? -0.55, 1), r = f.r, IV = '#e0d6bc';
  const S = sweep([[0, 330], [0, 100], [0, -150], [0, -380]], 170, 22); P(f, F, S.poly, IV, { tex: T(f, 'mottle'), texOp: 1 }); shadeR(f, F, S.poly, 0, 60, -380, 330, 9, { op: 0.4 });
  for (let k = 0; k < 15; k++) { const y0 = 320 - k * 46, w = 82 - k * 4.4; L(f, F, [[-w, y0 + 20], [0, y0 - 4], [w, y0 - 30]], 5, '#7a6a4a', { op: 0.8 }); L(f, F, [[-w + 6, y0 + 12], [0, y0 - 12]], 2.4, '#fff8e8', { op: 0.6 }); }   // the spiral grooves
  P(f, F, [[-96, 300], [96, 300], [100, 380], [-100, 380]], '#a8aaa8', { dress: false }); for (const y of [312, 368]) L(f, F, [[-72, y], [72, y]], 4, '#5a5c5a'); f.rivet(F([[0, 340]])[0], 7, '#e8e8e4');
  L(f, F, S.A.slice(2, -3), 4, '#fffaf0', { op: 0.5 }); D.stain(f, F([[20, 120]])[0], 24, '#8a7a5a', { op: 0.3 });
  for (let i = 0; i < 10; i++) f.flat(F(ell([-30 + (i * 13) % 60, -400 - (i * 7) % 30], 3, 2, 0, 6)), '#f0e8d4', { op: 0.85 });
  return { focus: F([[0, -100]])[0], sig: SB(F, [-80, -390, 80, 385]), grip: { c: F([[0, 340]])[0], thumb: (o.ang ?? -0.55) - Math.PI / 2 }, feat: [], ells: [] };
};
META.unicornhorn = { act: 'glare', ang: -0.55 };

O.quintrack = (f, o = {}) => { // the quintessence: an oak rack of four dull phials of the four elements, and a fifth, tall and clear, standing apart on the rack's raised end
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const rk = [[-340, 120, 1], [340, 120, 1], [340, 200, 1], [-340, 200, 1]]; D.slab(f, F(rk), [0, 16]); P(f, F, rk, C.OAKL, { tex: T(f, 'wood'), texOp: 1 }); grain(f, F, rk, 0.3, 9, 0.05);
  P(f, F, [[160, 120, 1], [340, 120, 1], [340, 60, 1], [160, 60, 1]], C.OAK, { tex: T(f, 'wood'), texOp: 1 });   // the raised end
  ['#6a3a22', '#3e4e5a', '#7a7050', '#4a5a36'].forEach((liq, k) => { const G = frame([-290 + k * 110, 0], 0, 1), Fp = pts => F(G(pts)); const b = turned([[18, -90], [20, -40], [40, 0], [42, 130]], 0.22); glass(f, Fp, b, { glass: '#6a7a6a', liq, level: 20, bubbles: 2 }); cork(f, Fp, [0, -90], 16, 24); });
  const G5 = frame([250, -10], 0, 1), F5 = pts => F(G5(pts)); const b5 = turned([[22, -330], [24, -220], [60, -150], [70, 60], [64, 70]], 0.22);
  glass(f, F5, b5, { glass: '#d0d8d0', liq: '#c8ccc0', level: -120, bubbles: 6, hi: [[[-46, -130], [-52, 40]], [[-10, -310], [-12, -230]]] }); cork(f, F5, [0, -330], 20, 30);
  L(f, F, [[160, 116], [340, 116]], 3, '#e8d0a8', { op: 0.6 }); D.chip(f, F([[-200, 200]])[0], 8, 0); D.crack(f, F([[0, 170]])[0], 0.05, 80, { n: 3 });
  return { focus: F([[250, -150]])[0], sig: SB(F, [-345, -370, 345, 215]), feat: ['contents'], ells: [0.22] };
};
META.quintrack = { act: 'drip', only: ['close', 'table', 'ledge', 'niche'] };

module.exports = { O, META, helpers: { clipBelow, glass, cork } };
