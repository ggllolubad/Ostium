// World X, The Venom Spires (Lightning + Toxin, Neurotoxin): shared helpers for world_X.js.
// Lightning (dominant) strikes and scars: branching Lichtenberg burns in white-violet on chitin and flesh, fused copper,
// standing setae, scorched plates. Toxin (neurotoxin) swells, paralyses and hollows: swelling, pustules, mould bloom,
// fruiting bodies (cordyceps stalks out of the hosts), peeling, larva holes.
// Never glowing outlines or sci-fi arcs (strikes are jagged ink-cored threads that fork); never slime puddles or neon green.
// Palette: chitin black, venom green, white-violet strikes, plus ink black, bone and grey (and the bible's named
// materials: copper sheen on the spider and beetle, a faded red duelling sash, a dusty brown traveller's cloak).
// Copied from the reviewed world VI kit (itself from the I, III, IV and V kits): textures, glow, lichtenberg, bolt, sparks,
// standingHair, scorch, fusedRun, rope, chainLinks, spline, at, clipDraw, lumpy, ribbon, fullLeg, armRig, legTube,
// bootRig, humanJoints, ik, tube, prune, openHand, mlimb, crabSeg, dactyl, shiftFig (palette keys re-pointed below).
// New for this world (bottom of the file): insect legs, insect wings, segmented plate bodies, compound eyes, pustules,
// mould, cordyceps, larva holes, grubs, silk. All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  // chitin black: a blue-violet black with a cold sheen so it reads on a dark ground
  chit: '#2c2a33', chitL: '#5e5a6c', chitD: '#121117', chitS: '#0a090d', chitP: '#a29cb8',
  // venom green: dull, olive, never neon
  ven: '#6a8238', venL: '#98ac5c', venD: '#36441e', venP: '#c6d08e', venS: '#1e2612',
  // white-violet strikes
  vio: '#a894dc', vioL: '#d6ccf4', vioD: '#5a4890', arc: '#f6f2ff', arcG: '#ddd2fa', lamp: '#a894dc', lampL: '#d6ccf4', lampD: '#5a4890',
  scar: '#3a2c44', scarL: '#d4cce4',
  bone: '#d6cdb8', boneD: '#9a917e', boneL: '#ebe4d2', grey: '#7a7880', greyD: '#4c4a50', greyL: '#a8a6aa',
  copper: '#7c5638', copperL: '#ae825a', copperD: '#3c2618', // copper sheen (spider markings, beetle shell)
  sash: '#7c463e', sashD: '#4a2622', sashL: '#a2685c', // the faded red duelling sash
  cloak: '#6a5a48', cloakD: '#40352a', cloakL: '#8e7c66', // dusty brown traveller's cloak
  skin: '#b6ab9a', skinS: '#4e4452', skinL: '#d4cbbb', // hollowed traveller's skin, pale
  leath: '#4a3a2c', leathD: '#2a2018', leathL: '#6e5a44',
  wood: '#5a4a38', woodD: '#33281c', woodL: '#86725a',
  iron: '#3c3c40', ironL: '#64646a', ironD: '#1e1e22',
  rust: '#6a4a3a', rustL: '#94705a', rustD: '#3a2620', brass: '#7c5638', brassL: '#ae825a', brassD: '#3c2618',
  paper: '#6e665c', paperL: '#968c7e', paperD: '#3e3832', // hive paper (chewed wood pulp) of the spire walls
  silk: '#d8d4dc', wax: '#b8a874',
  // aliases used by copied helpers
  slate: '#3a3842', slateL: '#6a6676', slateD: '#24222a', slateS: '#121117', slateP: '#9a96aa', surf: '#e6e2ec', surfD: '#c4bed2', surfS: '#7c7a88',
  harpy: '#b6ab9a', harpyS: '#4e4452', harpyL: '#d4cbbb', drip: '#98ac5c', blotch: '#6a5a7a', green: '#6a8238', verd: '#6a8238', verdL: '#98ac5c', verdD: '#36441e',
  kelp: '#36441e', kelpL: '#6a8238', barn: '#c4bed2', barnD: '#7c7a88', oil: '#2c2a33', oilL: '#5e5a6c', oilD: '#121117', wool: '#6a6670', woolL: '#8e8a94', woolD: '#45424a',
  drown: '#b6ab9a', drownS: '#4e4452',
  mud: '#262428',
};

// the world's render setup: kit.foeBase, violet-black shadow, grey-brown plain dust; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.26), shadowTint: '#1c1a26', mud: P.mud }, o));

// texture patterns and glow filters for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  // knit: rows of small V stitches (gansey wool)
  let k = '';
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const X = x * 6, Y = y * 6; k += `<path d="M${X},${Y} l3,4 l3,-4" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>`; }
  f.defs.push(`<pattern id="knit${s}" patternUnits="userSpaceOnUse" width="24" height="24">${k}</pattern>`);
  // cable: a twisted cable column for the gansey chest
  f.defs.push(`<pattern id="cable${s}" patternUnits="userSpaceOnUse" width="22" height="18"><path d="M3,0 q8,9 0,18 M19,0 q-8,9 0,18 M3,9 h16" fill="none" stroke="${INK}" stroke-width="1" opacity="0.55"/></pattern>`);
  // barbs: fine parallel lines for feather vanes
  f.defs.push(`<pattern id="barb${s}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="0.7" opacity="0.5"/></pattern>`);
  // scutes: overlapping scales on a bird's shank
  let sc = '';
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) sc += `<path d="M${x * 8 + (y % 2) * 4},${y * 6 + 6} a4,3 0 0 1 8,0" fill="none" stroke="${INK}" stroke-width="0.9" opacity="0.6"/>`;
  f.defs.push(`<pattern id="scute${s}" patternUnits="userSpaceOnUse" width="24" height="18">${sc}</pattern>`);
  // wrinkle: short curved creases (water-pruned or old skin, oilskin crackle)
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  // pitting on iron and old hide
  let g = '';
  for (let i = 0; i < 40; i++) { const x = r() * 30, y = r() * 30, rr = 0.5 + r() * 1.2; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${r() > 0.35 ? INK : '#c8c4b8'}" opacity="${r() > 0.5 ? 0.45 : 0.3}"/>`; }
  f.defs.push(`<pattern id="pit${s}" patternUnits="userSpaceOnUse" width="30" height="30">${g}</pattern>`);
  // whale hide: long wandering grooves and pale scratches
  let hd = '';
  for (let i = 0; i < 9; i++) { let x = r() * 200, y = r() * 200; const pts = [[x, y]]; const a0 = -0.3 + r() * 0.6; for (let q = 0; q < 5; q++) { x += Math.cos(a0 + (r() - 0.5) * 0.5) * (14 + r() * 18); y += Math.sin(a0 + (r() - 0.5) * 0.5) * (14 + r() * 18); pts.push([x, y]); } hd += `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join('L')}" fill="none" stroke="${i % 3 ? INK : '#d8dcd8'}" stroke-width="${i % 3 ? 0.9 : 0.8}" opacity="${i % 3 ? 0.4 : 0.35}" stroke-linejoin="round"/>`; }
  f.defs.push(`<pattern id="hide${s}" patternUnits="userSpaceOnUse" width="200" height="200">${hd}</pattern>`);
  f.defs.push(`<filter id="glow${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>`);
  f.defs.push(`<filter id="glowL${s}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>`);
  f.defs.push(`<filter id="spray${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`);
}

const R = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend
const pd = pts => E.smooth(pts, false);

// looks
const SL = (f, o = {}) => Object.assign({ fill: P.slate, shadow: P.slateS, light: P.slateP, shade: 0.38, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o); // slate hide
const SK = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o); // weathered skin
const DR = (f, o = {}) => Object.assign({ fill: P.drown, shadow: P.drownS, shade: 0.3, tex: 'mottle' + f.o.seed, texOp: 0.6 }, o); // drowned skin
const HS = (f, o = {}) => Object.assign({ fill: P.harpy, shadow: P.harpyS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o); // harpy skin
const WO = (f, o = {}) => Object.assign({ fill: P.wool, shadow: '#2a2a2e', shade: 0.38, tex: 'knit' + f.o.seed, texOp: 0.6 }, o); // wool
const OI = (f, o = {}) => Object.assign({ fill: P.oil, shadow: P.oilD, light: P.oilL, shade: 0.4, tex: 'wrinkle' + f.o.seed, texOp: 0.45 }, o); // oilskin
const IR = (f, o = {}) => Object.assign({ fill: P.iron, shadow: P.ironD, light: P.ironL, shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.8 }, o); // wrought iron
const RU = (f, o = {}) => Object.assign({ fill: P.rust, shadow: P.rustD, light: P.rustL, shade: 0.4, tex: 'pit' + f.o.seed, texOp: 0.8 }, o); // rust
const BRS = (f, o = {}) => Object.assign({ fill: P.brass, shadow: P.brassD, light: P.brassL, shade: 0.42, tex: 'pit' + f.o.seed, texOp: 0.5 }, o); // brass
const WD = (f, o = {}) => Object.assign({ fill: P.wood, shadow: P.woodD, light: P.woodL, shade: 0.4, tex: 'wood' + f.o.seed, texOp: 0.6 }, o); // timber
const FE = (f, o = {}) => Object.assign({ fill: P.slate, shadow: P.slateS, light: P.slateP, shade: 0.42, tex: 'barb' + f.o.seed, texOp: 0.5, inkW: 1, inkHeavy: 1.4 }, o); // feathers

// ---- glow and lightning ----
function glow(f, c, rx, ry, col = P.lamp, op = 0.3, big = false, a = 0) {
  // an invisible frame so a layer exported on its own keeps the whole blur inside its filter region
  const m = Math.max(rx, ry) * 1.6 + (big ? 70 : 25); f.raw(`<rect x="${(c[0] - m).toFixed(1)}" y="${(c[1] - m).toFixed(1)}" width="${(2 * m).toFixed(1)}" height="${(2 * m).toFixed(1)}" fill="#000" opacity="0"/>`);
  f.raw(`<ellipse cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${(a * 57.3).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)})" fill="${col}" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
}
function glowLine(f, pts, w, col = P.lamp, op = 0.4, big = false) {
  f.raw(`<path d="${pd(pts)}" fill="none" stroke="${col}" stroke-width="${w.toFixed(1)}" stroke-linecap="round" opacity="${op}" filter="url(#${big ? 'glowL' : 'glow'}${f.o.seed})"/>`);
}
// Lichtenberg burn: a fern of branching scars from c heading a, length len, trunk width w.
// skin: a dark channel with a pale shiny keloid edge. o.metal: scorched black branches with a thin fused thread.
// o.pale: pale scar lines on dark hide (the whale). No bloom: a scar, not light.
function lichtenberg(f, c, a, len, w, o = {}) {
  const dark = o.metal ? '#141210' : (o.col || P.scar), lite = o.metal ? P.arcG : (o.lite || P.scarL);
  const branches = [];
  const go = (p, aa, L, ww, depth) => {
    const pts = [p]; let q = p, b = aa; const n = 5;
    for (let i = 0; i < n; i++) { b += (f.r() - 0.5) * 0.7; q = add(q, rot([L / n, 0], b)); pts.push(q); }
    branches.push([pts, ww, depth]);
    if (depth > 0) for (let k = 1; k < n; k++) {
      const nk = f.r() < 0.5 ? 2 : 1;
      for (let j = 0; j < nk; j++) if (f.r() < (o.fork ?? 0.8)) go(pts[k], b + (j ? -1 : 1) * (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.0), L * R(f, 0.3, 0.55), ww * 0.62, depth - 1);
    }
  };
  go(c, a, len, w, o.depth ?? 3);
  if (o.pale) { for (const [pts, ww] of branches) f.stroke(pts, ww + 1.4, INK, { op: 0.5 }); for (const [pts, ww] of branches) f.stroke(pts, ww, o.col || P.surfD, { op: o.op ?? 0.85 }); return; }
  for (const [pts, ww] of branches) f.stroke(pts, ww + (o.metal ? 1.2 : 1.6), lite, { op: o.metal ? 0.0 : 0.45 });
  for (const [pts, ww] of branches) f.stroke(pts, ww, dark, { op: o.op ?? 0.85 });
  if (o.metal) for (const [pts, ww, d] of branches) if (d >= (o.depth ?? 3) - 1) f.line(pts.slice(0, 4), Math.max(0.7, ww * 0.25), P.arcG, { op: 0.75 });
}
// a jagged bolt from a to b: an ink thread with a lamp-yellow core and a white heart; forks spit off it. The bloom is
// small and only round the thread; the bolt never traces a shape's outline.
function bolt(f, a, b, o = {}) {
  const w = o.w ?? 2.4, n = o.n ?? Math.max(4, Math.round(E.len(sub(b, a)) / 22)), jit = o.jit ?? 0.28;
  const d = sub(b, a), L = E.len(d), nn = E.norm([-d[1], d[0]]);
  const pts = [a];
  for (let i = 1; i < n; i++) { const t = i / n; pts.push(add(add(a, mul(d, t)), mul(nn, (f.r() - 0.5) * 2 * jit * L / n * 2.2))); }
  pts.push(b);
  const draw = (q, ww) => { f.line(q, ww + 3.2, INK, { straight: true, op: 0.85 }); f.line(q, ww + 1.2, o.col || P.lamp, { straight: true }); f.line(q, Math.max(0.8, ww * 0.45), P.arc, { straight: true }); };
  if (o.bloom !== false) f.raw(`<path d="M${pts.map(q => q.map(v => v.toFixed(1)).join(',')).join('L')}" fill="none" stroke="${P.lamp}" stroke-width="${(w * 4).toFixed(1)}" opacity="${o.bloomOp ?? 0.2}" filter="url(#glow${f.o.seed})"/>`);
  draw(pts, w);
  const forks = o.forks ?? 3;
  for (let k = 0; k < forks; k++) {
    const i = 1 + Math.floor(f.r() * (n - 1)), p0 = pts[i], dd = Math.atan2(d[1], d[0]) + (f.r() > 0.5 ? 1 : -1) * R(f, 0.5, 1.1), fl = L * R(f, 0.1, 0.24);
    const q = [p0]; let p = p0; for (let j = 0; j < 3; j++) { p = add(p, rot([fl / 3, 0], dd + (f.r() - 0.5) * 1.0)); q.push(p); }
    draw(q, w * 0.45);
  }
  if (o.ends !== false) for (const e of [a, b]) f.raw(`<circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="${(w * 3.5).toFixed(1)}" fill="${P.lamp}" opacity="0.3" filter="url(#glow${f.o.seed})"/>`);
  return pts;
}
// sparks thrown off a point: short lamp-yellow streaks with dark tails
function sparks(f, c, n, r, o = {}) {
  for (let i = 0; i < n; i++) {
    const a = (o.ang ?? -Math.PI / 2) + (f.r() - 0.5) * (o.spread ?? 3.2), d = r * (0.3 + f.r() * 0.9), p = add(c, rot([d, 0], a)), l = R(f, 4, 12) * (o.s ?? 1);
    const t = add(p, rot([-l, 0], a));
    f.line([t, p], 2.6, INK, { straight: true, op: 0.5 }); f.line([t, p], 1.4, f.r() > 0.4 ? P.arcG : P.lamp, { straight: true }); f.flat(ell(p, 1.4, 1.4, 0, 6), P.arc);
  }
}
// standing hair: wiry strands lifted up and out from a scalp line, frizzed at the tips
function standingHair(f, pts, len, o = {}) {
  const col = o.col || '#3a322a';
  pts.forEach((p, i) => { const a = -Math.PI / 2 + (o.lean ?? 0) + (i / (pts.length - 1 || 1) - 0.5) * (o.fan ?? 1.4) + (f.r() - 0.5) * 0.35, l = len * R(f, 0.6, 1.1); const q1 = add(p, rot([l * 0.5, 0], a + (f.r() - 0.5) * 0.4)), q2 = add(p, rot([l, 0], a + (f.r() - 0.5) * 0.6)); f.stroke([p, q1, q2], o.w ?? 3, col); if (f.r() < 0.4) f.line([q1, add(q1, rot([l * 0.3, 0], a + 0.8))], 0.9, col); });
}
// scorch: an irregular soot smudge (heat-blackening on metal or feathers)
function scorch(f, c, rx, ry, op = 0.5, a = 0) {
  f.flat(ell(c, rx, ry, a, 14).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.35, (f.r() - 0.5) * ry * 0.35]) : q), '#141210', { op });
  f.flat(ell(add(c, [rx * 0.15, -ry * 0.2]), rx * 0.55, ry * 0.5, a, 12).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3]) : q), '#141210', { op: op * 0.7 });
}
// fused metal: a run of metal melted and set hard, bright at its lip
function fusedRun(f, p, len, w, col = P.brass) {
  const pts = [p, add(p, [w * 0.2, len * 0.4]), add(p, [-w * 0.15, len * 0.75]), add(p, [0, len])];
  f.stroke(pts, w + 2, INK, { op: 0.8 }); f.stroke(pts, w, mix(col, '#000', 0.3)); f.stroke(pts.slice(0, 3), w * 0.4, mix(col, '#fff', 0.45), { op: 0.7 });
  f.part(ell(add(p, [0, len + w * 0.3]), w * 0.75, w * 0.6, 0, 8), { fill: col, shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
}

// ---- water marks ----
function livid(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry); f.flat(ell(p, (3 + f.r() * 7) * s, (2 + f.r() * 4) * s, f.r() * 3, 8), f.r() > 0.45 ? P.blotch : P.green, { op: 0.4 }); } }
function veins(f, c, rx, ry, n, s = 1) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry); f.line([p, add(p, [(3 + f.r() * 6) * s, (5 + f.r() * 5) * s]), add(p, [f.r() * 12 * s, (12 + f.r() * 8) * s]), add(p, [(f.r() * 16 - 4) * s, (22 + f.r() * 10) * s])], 0.9 + s * 0.3, '#57527e', { op: 0.6 }); } }
function peel(f, c, n, s = 1, spread = 22) { for (let i = 0; i < n; i++) { const p = add(c, [(f.r() - 0.5) * spread, (f.r() - 0.5) * spread * 0.8]); f.flat([p, add(p, [7 * s, -2 * s]), add(p, [9 * s, 3 * s]), add(p, [3 * s, 4 * s])], '#e2e0d2', { op: 0.85 }); f.line([p, add(p, [7 * s, -2 * s])], 0.8, INK, { op: 0.6 }); } }
// barnacles: low irregular cones in clusters, a dark slit at the top, never neat teeth
function barnacle(f, c, r) { const j = () => (f.r() - 0.5) * r * 0.5; f.part([add(c, [-r + j(), r * 0.4]), add(c, [-r * 0.5 + j(), -r * 0.35 + j()]), add(c, [r * 0.4 + j(), -r * 0.45 + j()]), add(c, [r + j(), r * 0.4])], { fill: mix(P.barn, P.barnD, f.r() * 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.9, hatch: false }); f.line([add(c, [-r * 0.3, -r * 0.3]), add(c, [r * 0.25, -r * 0.35])], Math.max(1.4, r * 0.18), '#1c1a1a'); if (r > 7) { f.line([add(c, [-r * 0.6, r * 0.2]), add(c, [-r * 0.3, -r * 0.25])], 0.8, INK, { op: 0.5 }); f.line([add(c, [r * 0.6, r * 0.2]), add(c, [r * 0.25, -r * 0.3])], 0.8, INK, { op: 0.5 }); } }
function barnacles(f, c, rx, ry, n, r0, r1) { const pts = []; for (let i = 0; i < n; i++) pts.push([scatter(f, c, rx, ry), R(f, r0, r1)]); pts.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => barnacle(f, p, r)); }
function mussel(f, c, a, s = 1) { f.part(ell(c, 7 * s, 3.6 * s, a, 10), { fill: '#1d2332', shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false }); f.line([add(c, rot([-5 * s, -1 * s], a)), add(c, rot([5 * s, -1 * s], a))], 0.9, '#6a7a9a', { op: 0.7 }); }
function drip(f, p, s = 1, col = P.drip) { f.flat([add(p, [-1.6 * s, 0]), add(p, [1.6 * s, 0]), add(p, [0, 7 * s])], col, { op: 0.8 }); f.flat(ell(add(p, [0, 12 * s]), 2 * s, 3.4 * s, 0, 6), col, { op: 0.85 }); f.flat(ell(add(p, [0.5 * s, 11 * s]), 0.6 * s, 1 * s, 0, 5), '#fff', { op: 0.6 }); }
function kelpHang(f, p, len, w, sway = 0, o = {}) { const pts = [p, add(p, [sway * 0.4, len * 0.35]), add(p, [sway, len * 0.7]), add(p, [sway * 0.6, len])]; f.stroke(pts, w, o.col || P.kelp); f.line(pts.slice(0, 3).map(q => add(q, [-w * 0.18, -w * 0.05])), Math.max(1, w * 0.1), o.lit || P.kelpL, { op: 0.7 }); if (o.drip !== false) drip(f, add(pts[3], [0, 2]), Math.max(0.8, w / 9)); return pts[3]; }
function verdigris(f, c, rx, ry, n, op = 0.6) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry); f.flat(ell(p, 2 + f.r() * rx * 0.25, 2 + f.r() * ry * 0.2, f.r() * 3, 10), f.r() > 0.3 ? P.verd : P.verdL, { op: op * (0.6 + f.r() * 0.5) }); } }
function saltCrust(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = R(f, 1, 3.2); f.flat(ell(p, r * 1.4, r, f.r() * 3, 7), P.surf, { op: 0.55 }); } }
function wetSheen(f, pts, w = 2, op = 0.5) { const n = pts.length; for (let i = 0; i < n - 1; i += 2) f.line([pts[i], pts[Math.min(n - 1, i + 1)]], w, P.surf, { op }); }

// ---- rope, chain, cloth ----
function rope(f, pts, w, o = {}) {
  const col = o.col || '#8a7a5a';
  f.line(pts, w + 2.2, INK, { k: o.k });
  f.line(pts, w, col, { k: o.k });
  f.line(pts.map(q => add(q, [w * 0.18, -w * 0.18])), Math.max(0.7, w * 0.22), mix(col, '#fff', 0.35), { op: 0.6, k: o.k });
  const n = pts.length; let acc = 0;
  for (let i = 0; i < n - 1; i++) { const a = pts[i], b = pts[i + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; for (let t = (acc % (w * 1.4)); t < L; t += w * 1.4) { const q = add(a, mul(d, t)); f.line([add(q, mul(nn, w * 0.5)), add(add(q, mul(nn, -w * 0.5)), mul(d, w * 0.6))], 0.9, INK, { op: 0.6, straight: true }); } acc += L; }
  if (o.fray) { const e = pts[pts.length - 1], d = E.norm(sub(e, pts[pts.length - 2])); for (let i = -1; i <= 1; i++) f.line([e, add(add(e, mul(d, w * 1.4)), mul([-d[1], d[0]], i * w * 0.6))], 1, col); }
}
// a hanging rope: a catenary-ish sag from a to b (or a plumb drop with a frayed end when b is null)
function sagRope(f, a, b, sag, w, o = {}) {
  const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(add(lerp(a, b, t), [0, sag * 4 * t * (1 - t)])); }
  rope(f, pts, w, o); return pts;
}
// a coil of rope seen side-on (hung at the belt): stacked loops, a lashing, a loose tail
function ropeCoil(f, c, rx, ry, n, w, o = {}) {
  const col = o.col || '#8a7a5a';
  for (let i = 0; i < n; i++) { const e = ell(add(c, [i * 2.2 - n, i * 1.4]), rx - i * 1.2, ry - i * 0.6, o.a || 0, 20); f.line(e.concat([e[0]]), w + 2, INK); f.line(e.concat([e[0]]), w, mix(col, '#000', i % 2 ? 0.15 : 0)); f.line(e.slice(12, 18), 0.9, mix(col, '#fff', 0.4), { op: 0.6 }); }
  const t = add(c, [0, -ry]); f.line([add(t, [-6, -2]), add(t, [6, 2])], 4, '#2e2418'); f.line([add(t, [-6, 6]), add(t, [6, 10])], 4, '#2e2418');
  rope(f, [add(c, [rx * 0.6, ry * 0.7]), add(c, [rx * 0.7, ry * 1.6]), add(c, [rx * 0.5, ry * 2.4])], w * 0.9, { col, fray: true });
}
// iron chain of alternating links along a polyline; s = link length
function chainLinks(f, pts, s, col = P.iron, o = {}) {
  const C = []; for (let i = 0; i < pts.length - 1; i++) { const L = E.len(sub(pts[i + 1], pts[i])), n = Math.max(1, Math.round(L / (s * 0.8))); for (let k = 0; k < n; k++) C.push([lerp(pts[i], pts[i + 1], k / n), lerp(pts[i], pts[i + 1], (k + 1) / n)]); }
  C.forEach(([a, b], i) => {
    const m = lerp(a, b, 0.5), an = ang(a, b);
    if (i % 2) { f.line([add(m, rot([-s * 0.5, 0], an)), add(m, rot([s * 0.5, 0], an))], s * 0.26 + 1.6, INK, { straight: true }); f.line([add(m, rot([-s * 0.45, 0], an)), add(m, rot([s * 0.45, 0], an))], s * 0.22, mix(col, '#fff', 0.15), { straight: true }); }
    else { const e = ell(m, s * 0.58, s * 0.3, an, 12); f.line(e.concat([e[0]]), s * 0.2 + 1.6, INK); f.line(e.concat([e[0]]), s * 0.16, col); f.line(e.slice(7, 11), 0.9, mix(col, '#fff', 0.5), { op: 0.8 }); }
  });
}

// ---- curves ----
function spline(ctrl, step = 4) {
  const out = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(E.len(sub(p2, p1)) / step));
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  out.push(ctrl[ctrl.length - 1].slice(0, 2));
  return out;
}
const arcLen = C => { const s = [0]; for (let i = 1; i < C.length; i++) s.push(s[i - 1] + E.len(sub(C[i], C[i - 1]))); return s; };
function at(C, S, u) { let i = 1; while (i < C.length - 1 && S[i] < u) i++; const t = Math.max(0, Math.min(1, (u - S[i - 1]) / ((S[i] - S[i - 1]) || 1))); const p = lerp(C[i - 1], C[i], t), d = E.norm(sub(C[i], C[i - 1])); return { p, d, n: [-d[1], d[0]] }; }
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], 1]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
function lumpy(f, pts, amp) { const c = pts.reduce((a, p) => add(a, mul(p, 1 / pts.length)), [0, 0]); return pts.map(p => { const d = E.norm(sub(p, c)), k = (f.r() - 0.4) * amp; return p[2] ? [...add(p, mul(d, k)), 1] : add(p, mul(d, k)); }); }
// a ribbon of varying width along a centre line C (resampled): returns the outline
function ribbon(C, wf) { const S = arcLen(C), L = S[S.length - 1], Pp = [], Q = []; C.forEach((p, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], d = E.norm(sub(b, a)), n = [-d[1], d[0]], w = wf(S[i] / L) / 2; Pp.push(add(p, mul(n, w))); Q.push(add(p, mul(n, -w))); }); return [...Pp, ...Q.reverse()]; }

// ---- limbs ----
function fullLeg(f, Hp, Kn, A, dir2, s, wH, wK, look, o = {}) {
  const gy = o.gy ?? f.o.groundY, ax = A[0], ay = A[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir2 * u * s;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d[1] * dir2, -d[0] * dir2]; };
  const nT = nrm(Hp, Kn), nS = nrm(Kn, A), nK = E.norm(add(nT, nS));
  const tq = o.thigh ?? 0.08, cf = o.calf ?? 0;
  const atS = (t, off) => add(lerp(Kn, A, t), mul(nS, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    add(Hp, mul(nT, wH / 2)), add(lerp(Hp, Kn, 0.4), mul(nT, wH * 0.5 * (1 + tq))), add(lerp(Hp, Kn, 0.8), mul(nT, (wH + wK) * 0.25)),
    add(Kn, mul(nK, wK * 0.56)), atS(0.18, wK * 0.46), atS(0.45, wK * 0.4), atS(0.72, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    atS(0.72, -(wa * 0.62 + 2)), atS(0.36, -wK * 0.5 * (1.18 + sw * 0.1 + cf)), atS(0.12, -wK * 0.52), add(Kn, mul(nK, -wK * 0.5)),
    add(lerp(Hp, Kn, 0.6), mul(nT, -wH * 0.5 * (1 + tq * 0.6))), add(Hp, mul(nT, -wH / 2)),
  ];
  f.part(pts, Object.assign({ k: 0.9 }, look));
  return pts;
}
// a soft tube shoulder to wrist (sleeve or bare arm), cut at the elbow. ws: widths at shoulder, elbow, wrist
function armRig(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const de = elb(S0, E0, W0);
  return split(f, () => {
    const d = f.part(K.chain([S0, E0, W0], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
    if (o.muscle !== false) { f.line([lp(S0, E0, 0.3, ws[0] * 0.15), lp(S0, E0, 0.85, ws[1] * 0.1)], 1.1, INK, { op: 0.4 }); f.line([lp(E0, W0, 0.05, -ws[1] * 0.3), add(E0, mul(de, -ws[1] * 0.1)), lp(S0, E0, 0.92, -ws[1] * 0.3)], 1.2, INK, { op: 0.5 }); }
    if (o.after) o.after();
    return d;
  }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
}
// a trouser tube from hip through knee to a cuff, cut at the knee
function legTube(f, Hp, Kn, cu, ws, look, sfx, o = {}) {
  const A = o.A || cu, dk = elb(Hp, Kn, A);
  return split(f, () => {
    const d = f.part(K.chain([Hp, Kn, cu], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
    if (o.after) o.after();
    return d;
  }, [['thigh' + sfx, side(Kn, mul(dk, -1), ws[1] * 0.6)], ['shin' + sfx, side(Kn, dk, ws[1] * 0.6)]]);
}
// a boot cut at the ankle for the rig
function bootRig(f, K0, A, s, col, sfx, o = {}) {
  const da = add(E.norm(sub(A, K0)), [0.6, 0]);
  return split(f, () => B.boot(f, A, 1, s, col, o), [['shin' + sfx, side(A, mul(da, -1), s * 0.36)], ['foot' + sfx, side(A, da, s * 0.36)]]);
}
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  if (J.SN) f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  if (J.SF) f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  if (J.HN) f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  if (J.HF) f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), b = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], b + sign * a)), Wr];
}

// ---- hands (copied from the world I kit): fingers bend only toward the palm ----
function tube(pts, ws, capK = 0.9) {
  const o = K.chain(pts, ws, { steps: 6 }), n = o.length / 2, Pp = o.slice(0, n), Q = o.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = ws[ws.length - 1] / 2, cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(b, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * capK)))); }
  return [...Pp, ...cap, ...Q];
}
function prune(f, a, b, w, n, op = 0.5) {
  const d = E.norm(sub(b, a)), nn = [-d[1], d[0]];
  for (let i = 0; i < n; i++) { const o = (i / (n - 1) - 0.5) * w * 0.7, p0 = add(a, mul(nn, o)), p1 = add(b, mul(nn, o * 0.8)); f.line([p0, add(lerp(p0, p1, 0.33), mul(nn, 1.6)), add(lerp(p0, p1, 0.66), mul(nn, -1.6)), p1], 0.9, INK, { op }); }
}
// open hand. c: wrist, ang: wrist to middle knuckle, s: hand length. o.back shows the back of the hand. Fingers fan in the
// picture plane; curl shows only as foreshortening. o.claw: long hooked nails (the harpies).
function openHand(f, c, a0, s, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(c, a0, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg]));
  const back = !!o.back, look = o.look, sp = o.spread ?? 0.14, cu = o.curl ?? 0.2, sw = 1 + (o.swell ?? 0.1);
  const sh = look.shadow || mix(look.fill, '#000', 0.4), dk = mix(sh, '#000', 0.3), lt = mix(look.fill, '#fff', 0.45);
  const part = (q, st) => f.part(q, Object.assign({}, look, { cast: false }, st || {}));
  const FG = [[0.405, -0.17, 0.4, 0.088], [0.45, -0.062, 0.5, 0.097], [0.465, 0.048, 0.545, 0.1], [0.44, 0.158, 0.49, 0.097]];
  const fing = FG.map(([u, v, L, w], i) => {
    const a = (i - 1.9) * sp + (o.bend || [0, 0, 0, 0])[i], d = [Math.cos(a), Math.sin(a)], k0 = [u, v];
    const l1 = L * 0.46, l2 = L * 0.3 * (1 - cu * 0.45), l3 = L * 0.24 * (1 - cu * 0.62);
    const k1 = add(k0, mul(d, l1)), k2 = add(k1, mul(d, l2)), k3 = add(k2, mul(d, l3)), W = w * sw;
    return { k0: F([k0])[0], k1: F([k1])[0], k2: F([k2])[0], k3: F([k3])[0], kb: F([add(k0, mul(d, -0.05))])[0], W: W * s };
  });
  const thB = [0.07, 0.19], ta = (o.thumbAng ?? 0.9), td = [Math.cos(ta), Math.sin(ta)], th1 = add(thB, mul(td, 0.24)), td2 = [Math.cos(ta - 0.25), Math.sin(ta - 0.25)], th2 = add(th1, mul(td2, 0.2 * (1 - cu * 0.3)));
  const clawTip = (a, b, w) => { if (!o.claw) return; const d = E.norm(sub(b, a)), nn = [-d[1], d[0]], q = add(b, mul(d, w * 0.1)); f.part([add(q, mul(nn, w * 0.3)), add(add(q, mul(d, w * 1.1)), mul(nn, -w * 0.25)), [...add(add(q, mul(d, w * 1.5)), mul(nn, -w * 0.7)), 1], add(add(q, mul(d, w * 0.6)), mul(nn, -w * 0.3)), add(q, mul(nn, -w * 0.3))], { fill: '#2a2624', shadow: '#0e0c0c', light: '#6a6460', shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false }); };
  const thumb = () => {
    part(tube([F([add(thB, mul(td, -0.06))])[0], F([th1])[0], F([th2])[0]], [0.15 * sw * s, 0.125 * sw * s, 0.105 * sw * s]), { inkW: 1.4, inkHeavy: 2 });
    const a = F([th1])[0], b = F([th2])[0], ww = 0.11 * sw * s;
    f.line([lp(a, b, -0.04, ww * 0.55), lp(a, b, 0.02, 0), lp(a, b, -0.04, -ww * 0.55)], 1.4, dk, { op: 0.75 });
    if (back) nail(a, b, ww); clawTip(a, b, ww);
  };
  const nail = (a, b, w) => {
    const q = [lp(a, b, 0.3, w * 0.3), lp(a, b, 0.86, w * 0.34), lp(a, b, 1.04, w * 0.1), lp(a, b, 1.04, -w * 0.12), lp(a, b, 0.86, -w * 0.34), lp(a, b, 0.3, -w * 0.28)];
    f.part(q, { fill: o.nail || '#7a7068', shadow: '#2a2426', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false });
    f.line([lp(a, b, 1.0, w * 0.05), lp(a, b, 0.78, w * 0.12)], 1, INK, { op: 0.7 });
  };
  const finger = g => {
    const ws = [g.W, g.W * 0.94, g.W * 0.86, g.W * 0.78];
    part(tube([g.kb, g.k1, g.k2, g.k3], ws), { inkW: 1.4, inkHeavy: 2 });
    for (const [k, w, pa, pb] of [[g.k1, ws[1], g.k0, g.k2], [g.k2, ws[2], g.k1, g.k3]]) {
      const dd = E.norm(sub(pb, pa)), nn = [-dd[1], dd[0]];
      if (back) { for (let i = 0; i < 3; i++) { const c0 = add(k, mul(dd, (i - 1) * w * 0.15)); f.line([add(c0, mul(nn, -w * 0.34)), add(c0, mul(dd, -w * 0.09)), add(c0, mul(nn, w * 0.34))], i === 1 ? 1.3 : 0.9, INK, { op: 0.5 }); } }
      else for (const off of [-0.05, 0.05]) f.line([add(add(k, mul(dd, off * w)), mul(nn, w * 0.42)), add(add(k, mul(dd, off * w + 1)), mul(nn, 0)), add(add(k, mul(dd, off * w)), mul(nn, -w * 0.42))], off < 0 ? 1.5 : 1, dk, { op: 0.8 });
    }
    if (back) nail(g.k2, g.k3, ws[3]); else prune(f, lerp(g.k2, g.k3, 0.25), lerp(g.k2, g.k3, 0.95), ws[3], 3, 0.35);
    clawTip(g.k2, g.k3, ws[3]);
  };
  const palm = F([[-0.06, -0.15], [0.06, -0.2], [0.24, -0.215], [0.4, -0.22], [0.47, -0.13], [0.49, 0.0], [0.48, 0.12], [0.45, 0.21], [0.3, 0.24], [0.16, 0.26], [0.04, 0.23], [-0.06, 0.12]]);
  if (back) {
    thumb(); part(palm, { inkW: 1.5, inkHeavy: 2.4 }); fing.forEach(finger);
    fing.forEach(g => { f.flat(ell(g.k0, g.W * 0.34, g.W * 0.24, a0, 10), lt, { op: 0.35 }); f.line([F([[0.04, 0.0]])[0], g.k0], 1.6, lt, { op: 0.35 }); });
    f.line(F([[0.02, -0.1], [0.14, -0.04], [0.22, 0.06], [0.3, 0.04], [0.38, 0.12]]), 2, mix(sh, '#3a3a6a', 0.3), { op: 0.5 });
  } else {
    fing.forEach(finger); part(palm, { inkW: 1.5, inkHeavy: 2.4 });
    part(F([[0.0, 0.04], [0.12, 0.02], [0.24, 0.12], [0.22, 0.24], [0.08, 0.26], [-0.04, 0.16]]), { inkW: 1, inkHeavy: 1.2, maxShade: 14 });
    f.line(F([[0.36, -0.2], [0.33, -0.08], [0.36, 0.04], [0.42, 0.13]]), 1.8, dk, { op: 0.8 });
    f.line(F([[0.3, 0.19], [0.18, 0.12], [0.06, 0.1], [0.0, 0.04]]), 1.6, dk, { op: 0.75 });
    thumb();
  }
  return { fing, F };
}

// ---- feathers and wings ----
// One feather from root heading a: length L, width W, the vane split by the rachis (lead = share on the +n side).
// o.bend curls the tip toward +n; o.notch tears the trailing vane; o.lift (static) splays a few barbs off the edge.
function feather(f, root, a, L, W, look, o = {}) {
  const d = dir(a), n = [-d[1], d[0]], lead = o.lead ?? 0.35, bend = o.bend ?? 0, N = 16;
  const C = []; for (let i = 0; i <= N; i++) { const t = i / N; C.push(add(add(root, mul(d, L * t)), mul(n, bend * L * t * t))); }
  // a flight feather keeps its width along the vane: narrow only at the quill, rounded at the tip
  const tipR = o.round ? 0.22 : 0.32;
  const wt = t => W * Math.pow(Math.min(1, (t + 0.03) / 0.22), 0.7) * (t > 1 - tipR ? Math.sqrt(Math.max(0, 1 - ((t - 1 + tipR) / tipR) ** 2)) : 1) * (o.taper === false ? 1 : 1 - t * 0.3) + 0.5;
  // emargination (independent review): the outer primaries' vanes step in past mid-length, so the wing tip splays into
  // slotted fingers instead of a row of planks
  const sst = (a, b, t) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); }, em = o.emarg || 0;
  const eL = t => 1 - em * 0.6 * sst(0.4, 0.56, t), eT = t => 1 - em * 0.32 * sst(0.5, 0.66, t);
  const Pp = [], Q = [];
  C.forEach((p, i) => { const t = i / N, a1 = C[Math.max(0, i - 1)], b1 = C[Math.min(N, i + 1)], dd = E.norm(sub(b1, a1)), nn = [-dd[1], dd[0]], w = wt(t); Pp.push(add(p, mul(nn, w * lead * eL(t)))); Q.push(add(p, mul(nn, -w * (1 - lead) * eT(t)))); });
  // notches in the trailing vane: a V cut back toward the rachis
  for (const t of (o.notch || [])) { const i = Math.max(2, Math.min(N - 2, Math.round(t * N))); Q[i] = lerp(Q[i], C[i], 0.55); }
  const tip = add(C[N], mul(E.norm(sub(C[N], C[N - 1])), W * 0.04));
  const out = [...Pp, o.round ? tip : [...tip, 1], ...Q.reverse()];
  f.part(out, Object.assign({ k: 0.9, inkW: 1.1, inkHeavy: 1.8, maxShade: Math.max(2.5, W * 0.12), hi: 0.02 }, look, { cast: false }));
  // rachis and a few barb splits
  f.line(C.slice(0, N - 1), Math.max(0.8, W * 0.04), mix(look.fill, '#fff', 0.3), { op: 0.45 });
  if (o.splits !== false) for (let k = 0; k < 2; k++) { const i = 5 + Math.floor(f.r() * 8), p = C[i], qq = Q[Q.length - 1 - i] || Q[0]; f.line([p, lerp(p, qq, 1.02)], 0.8, INK, { op: 0.6 }); }
  if (o.dark) clipDraw(f, out, () => f.flat([...Pp.slice(Math.round(N * (1 - o.dark))).map(q => add(q, mul(n, W))), add(tip, mul(d, W)), ...Q.slice(0, Math.round(N * o.dark) + 1).map(q => add(q, mul(n, -W)))], o.darkCol || '#1a1e24', { op: o.darkOp ?? 0.3 }));
  if (o.lift) for (let k = 0; k < o.lift; k++) { const i = 3 + Math.floor(f.r() * (N - 5)), p = (f.r() > 0.5 ? Pp : [...Q].reverse())[i], aa = a + (f.r() - 0.5) * 1.6; f.line([p, add(p, rot([W * R(f, 0.3, 0.6), 0], aa))], 1, look.fill, { op: 0.9 }); f.line([p, add(p, rot([W * R(f, 0.3, 0.6), 0], aa))], 0.5, INK, { op: 0.5 }); }
  return { C, out, tip };
}

// a feathered mass: one shape for a region of plumage, its edge torn into rounded feather tips along `hem` (a polyline
// on the region's lower edge), with scalloped rows of feather ends inside pointing along `a`. Reads as plumage, not as
// tiles. pts: the region outline; a: the direction the feathers lie (root to tip); sz: feather-end size.
function plumeMass(f, pts, a, sz, look, o = {}) {
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const bb = E.bbox(pts), d = dir(a), n = [-d[1], d[0]], lt = mix(look.fill, '#fff', 0.3), dk = mix(look.shadow || look.fill, '#000', 0.25);
  clipDraw(f, pts, () => {
    const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, span = Math.max(bb[2] - bb[0], bb[3] - bb[1]) * 0.75;
    let row = 0;
    for (let v = -span; v < span; v += sz * 0.62, row++) for (let u = -span; u < span; u += sz * 0.9) {
      const q = add(add([cx, cy], mul(d, v + (f.r() - 0.5) * sz * 0.2)), mul(n, u + (row % 2) * sz * 0.45 + (f.r() - 0.5) * sz * 0.2)), w = sz * R(f, 0.38, 0.55), l = sz * R(f, 0.3, 0.45);
      const arc = [add(q, mul(n, -w)), add(add(q, mul(n, -w * 0.7)), mul(d, l * 0.8)), add(q, mul(d, l)), add(add(q, mul(n, w * 0.7)), mul(d, l * 0.8)), add(q, mul(n, w))];
      if (f.r() < (o.dark ?? 0.25)) f.flat([...arc, add(q, mul(d, -l * 0.6))], dk, { op: 0.35 });
      f.line(arc, o.w ?? 1.2, INK, { op: o.op ?? 0.55 });
      f.line(arc.slice(1, 4).map(p => add(p, mul(d, -2))), 0.9, lt, { op: 0.35 });
      if (f.r() < (o.shaft ?? 0.25)) f.line([add(q, mul(d, -l * 0.6)), add(q, mul(d, l * 0.9))], 0.8, lt, { op: 0.4 });
    }
  });
}
// a hem of rounded feather tips from a to b along a polyline (returns points for an outline): bulges of size sz out
// along `a` (the direction the feathers point)
function featherHem(line, a, sz, f, jit = 0.4) {
  const d = dir(a), out = [];
  for (let i = 0; i < line.length - 1; i++) {
    const p0 = line[i], p1 = line[i + 1], L = E.len(sub(p1, p0)), k = Math.max(1, Math.round(L / sz));
    for (let j = 0; j < k; j++) { const t0 = j / k, t1 = (j + 1) / k, m = lerp(p0, p1, (t0 + t1) / 2), ext = sz * (0.55 + (f.r() - 0.5) * jit); out.push([...lerp(p0, p1, t0), 1], add(add(lerp(p0, p1, t0 + (t1 - t0) * 0.25), mul(d, ext * 0.75)), [0, 0]), add(m, mul(d, ext)), add(lerp(p0, p1, t0 + (t1 - t0) * 0.75), mul(d, ext * 0.75))); }
  }
  out.push([...line[line.length - 1], 1]);
  return out;
}

// A wing whose leading edge runs shoulder S -> elbow Ew -> wrist Wr -> tip T. The trailing side is `tr` (+1: the side to the
// left of the leading edge's direction, i.e. +normal). Feathers: primaries fan from the hand, secondaries along the forearm,
// tertials at the elbow, then greater, median and marginal coverts layered over their bases. Bones: b1 (upper arm), b2
// (forearm), b3 (hand): each feather is drawn on the bone it grows from. o.look: the feather look; o.skin: arm look.
function wing(f, S, Ew, Wr, T, o = {}) {
  const tr = o.tr ?? 1, look = o.look || FE(f), [b1, b2, b3] = o.bones;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return mul([-d[1], d[0]], tr); };
  const nF = nrm(Ew, Wr), nH = nrm(Wr, T), nU = nrm(S, Ew);
  const aF = Math.atan2(nF[1], nF[0]), aH = Math.atan2(nH[1], nH[0]), aT = ang(Wr, T);
  const Lp = o.Lp ?? E.len(sub(T, Wr)) * 1.6, Ls = o.Ls ?? Lp * 0.62, Wp = o.Wp ?? Lp * 0.13, Ws = o.Ws ?? Ls * 0.22;
  const sk = o.skin || HS(f);
  const tone = i => mix(look.fill, i % 3 === 0 ? '#2a3038' : '#8a949c', 0.12 + (i % 3) * 0.04);
  // primaries: from the wrist to the tip, fanning from the trailing direction toward the line of the hand
  f.bone(b3);
  const np = o.np ?? 9;
  for (let i = 0; i < np; i++) {
    const t = i / (np - 1), r0 = lerp(Wr, T, 0.05 + t * 0.95), a = aT + (aH - aT) * (1 - t) * (o.spreadP ?? 0.38) + (f.r() - 0.5) * 0.08, L = Lp * (0.78 + t * 0.3) * (o.pLen ? o.pLen(t) : 1) * R(f, 0.92, 1.06);
    feather(f, r0, a, L, Wp * (1 - t * 0.15), Object.assign({}, look, { fill: mix(tone(i), f.r() > 0.5 ? '#fff' : '#000', f.r() * 0.08) }), { lead: 0.3, bend: tr * -0.03, round: true, notch: (o.notchP || []).includes(i) ? [0.62, 0.8] : [], dark: o.darkTips ?? 0, lift: o.lift && i % 3 === 1 ? 1 : 0, emarg: t > 0.4 ? 0.55 + t * 0.4 : 0 });
  }
  // secondaries along the forearm, pointing to the trailing side, raking back toward the body
  f.bone(b2);
  const ns = o.ns ?? 12;
  for (let i = ns - 1; i >= 0; i--) {
    const t = i / (ns - 1), r0 = lerp(Ew, Wr, 0.04 + t * 0.94), a = aF + (o.rake ?? -0.35) * tr * (1 - t * 0.3) + (f.r() - 0.5) * 0.1, L = Ls * (o.sLen ? o.sLen(t) : (0.92 + 0.12 * Math.sin(t * 3))) * R(f, 0.9, 1.08);
    feather(f, r0, a, L, Ws, Object.assign({}, look, { fill: tone(i + 1) }), { lead: 0.4, bend: tr * 0.05, round: true, notch: (o.notchS || []).includes(i) ? [0.7] : [], dark: 0, lift: o.lift && i % 3 === 0 ? 1 : 0 });
  }
  // tertials at the elbow, longer and soft, lying back toward the body
  f.bone(b1);
  for (let i = 0; i < (o.nt ?? 4); i++) { const t = i / 3, r0 = lerp(lerp(S, Ew, 0.55), Ew, t), a = aU(nU) + (o.rake ?? -0.35) * tr * 1.6; feather(f, r0, a, Ls * (0.8 - t * 0.15), Ws * 1.1, Object.assign({}, look, { fill: tone(i + 2) }), { lead: 0.45, round: true, dark: 0.2 }); }
  function aU(n2) { return Math.atan2(n2[1], n2[0]); }
  // the arm itself: a lean muscled limb inside the leading edge, skin over bone
  const arm = (a, b, wa, wb, bn, ext) => { f.bone(bn); f.part(K.chain([a, b], [wa, wb], { steps: 8, bp: [[0, 0.3, 0.18, 0.2]], bq: [[0, 0.6, 0.12, 0.2]] }), Object.assign({ k: 0.9 }, sk)); f.line([lp(a, b, 0.15, -wa * 0.2), lp(a, b, 0.85, -wb * 0.2)], 1.1, INK, { op: 0.4 }); f.line([lp(a, b, 0.1, wa * 0.3), lp(a, b, 0.5, wa * 0.36), lp(a, b, 0.9, wb * 0.3)], 1.3, mix(sk.fill, '#fff', 0.35), { op: 0.5 }); if (ext) ext(); };
  const wS = o.wS ?? Ws * 1.9, wE = o.wE ?? Ws * 1.2, wW = o.wW ?? Ws * 0.9;
  // coverts: greater (long), median, then lesser/marginal small scale-like rows close to the leading edge
  // greater coverts: one row of broad feathers over the bases of the secondaries
  f.bone(b2);
  const soft = (x) => Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.2 }, x);
  const ng = Math.round(ns * 0.8);
  for (let i = ng - 1; i >= 0; i--) { const t = i / (ng - 1) + (f.r() - 0.5) * 0.04, r0 = add(lerp(Ew, Wr, 0.02 + t * 0.96), mul(nF, -wE * 0.1)), a = aF + (o.rake ?? -0.35) * tr * 0.6 + (f.r() - 0.5) * 0.15; feather(f, r0, a, Ls * 0.48 * (1 - t * 0.2) * R(f, 0.88, 1.08), Ws * 0.95, soft({ fill: tone(i + 2) }), { lead: 0.45, round: true, splits: true }); }
  // the forearm skin along the leading edge, then the coverts lapping over its trailing half
  arm(Ew, Wr, wE * 0.95, wW, b2);
  f.bone(b2);
  // the median and lesser coverts and the marginals along the leading edge: one feathered mass with a tipped hem
  const cd = Ls * (o.covD ?? 0.3), ca = aF + (o.rake ?? -0.35) * tr * 0.6;
  const hemL = [add(Ew, mul(nF, cd * 0.85)), add(lerp(Ew, Wr, 0.5), mul(nF, cd)), add(Wr, mul(nF, cd * 0.7))];
  const mass = [add(Ew, mul(nF, wE * 0.05)), add(lerp(Ew, Wr, 0.5), mul(nF, -wE * 0.02)), add(Wr, mul(nF, wW * 0.1)), add(Wr, mul(nF, cd * 0.5)), ...featherHem(hemL.slice().reverse(), ca, Ws * 0.7, f).map(q => q)];
  plumeMass(f, mass, ca, Ws * 0.75, soft({ fill: mix(look.fill, '#fff', 0.06), tex: 'barb' + f.o.seed, texOp: 0.35 }), { w: 1, op: 0.5 });
  f.bone(b3);
  for (let i = 5; i >= 0; i--) { const t = i / 5, r0 = lerp(Wr, T, 0.05 + t * 0.6), a = aT + (aH - aT) * (1 - t) * 0.5; feather(f, r0, a, Lp * 0.34, Wp * 1.0, Object.assign({}, look, { fill: tone(i + 4), inkW: 0.8, inkHeavy: 1.1 }), { lead: 0.4, round: true, splits: false }); }
  // upper arm (with the scapular coverts lying over it), forearm and hand skin along the leading edge
  arm(S, Ew, wS, wE, b1, () => { const sa = aU(nU) + (o.rake ?? -0.35) * tr, sd = Ls * 0.42; const hm = [add(lerp(S, Ew, 0.1), mul(nU, sd * 0.8)), add(lerp(S, Ew, 0.95), mul(nU, sd * 0.6))]; plumeMass(f, [add(lerp(S, Ew, 0.05), mul(nU, -wS * 0.3)), add(Ew, mul(nU, -wE * 0.3)), add(Ew, mul(nU, sd * 0.4)), ...featherHem(hm.slice().reverse(), sa, Ws * 0.8, f)], sa, Ws * 0.8, Object.assign({}, look, { fill: mix(look.fill, '#fff', 0.05), inkW: 0.9, inkHeavy: 1.2 }), { w: 1, op: 0.5 }); });
  return { nF, nH, aF, aH, aT };
}
// a bird's shank and taloned foot gripping. K0: the hock (top of the shank), A: the ankle ball (base of the toes),
// toes: [[dirAngle, length, curlSign]] forward toes then the hind toe; claws hook at the tips. s: toe thickness.
function talonFoot(f, K0, A, toes, s, o = {}) {
  const look = o.look || { fill: '#5a5652', shadow: '#1e1c1e', light: '#8a8680', shade: 0.4, tex: 'scute' + f.o.seed, texOp: 0.7 };
  const toe = ([a, L, cs], i) => {
    const d1 = dir(a), p0 = A, p1 = add(p0, mul(d1, L * 0.45)), p2 = add(p1, rot(mul(d1, L * 0.35), cs * 0.35)), p3 = add(p2, rot(mul(d1, L * 0.25), cs * 0.75));
    f.part(K.chain([p0, p1, p2, p3], [s * 1.25, s, s * 0.88, s * 0.72], { steps: 5 }), Object.assign({ k: 0.9, cast: false, inkW: 1.2, inkHeavy: 2 }, look));
    for (const q of [p1, p2]) { const d = E.norm(sub(p3, p0)), nn = [-d[1], d[0]]; f.line([add(q, mul(nn, s * 0.5)), add(q, mul(nn, -s * 0.5))], 1.1, INK, { op: 0.55 }); }
    // the claw: a thick black hook continuing the toe's curl
    const dd = E.norm(sub(p3, p2)), cn = mul([-dd[1], dd[0]], cs), cb = add(p3, mul(dd, -s * 0.15));
    f.part([add(cb, mul(cn, -s * 0.42)), add(add(cb, mul(dd, s * 1.0)), mul(cn, -s * 0.2)), [...add(add(cb, mul(dd, s * 1.5)), mul(cn, s * 0.8)), 1], add(add(cb, mul(dd, s * 0.7)), mul(cn, s * 0.2)), add(cb, mul(cn, s * 0.42))], { fill: '#24201e', shadow: '#0a0808', light: '#7a7470', shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, hatch: false });
    f.line([add(add(cb, mul(dd, s * 0.3)), mul(cn, -s * 0.2)), add(add(cb, mul(dd, s * 1.0)), mul(cn, 0.0))], 1, '#a8a29a', { op: 0.6 });
  };
  const tl = o.order || toes.map((_, i) => i);
  tl.filter(i => toes[i][3] === 'back').forEach(i => toe(toes[i], i));
  // the shank: a scaled column, thicker at the hock, scutes down its front
  f.part(K.chain([K0, A], [s * 1.9, s * 1.45], { steps: 6 }), Object.assign({ k: 0.9, cast: false }, look));
  const d = E.norm(sub(A, K0)), nn = [-d[1], d[0]];
  for (let i = 1; i < 7; i++) { const q = lerp(K0, A, i / 7); f.line([add(q, mul(nn, s * 0.8)), add(add(q, mul(nn, s * 0.2)), mul(d, s * 0.25)), add(q, mul(nn, -s * 0.4))], 1, INK, { op: 0.5 }); }
  tl.filter(i => toes[i][3] !== 'back').forEach(i => toe(toes[i], i));
}

// ---- props ----
// a whaling harpoon stuck in hide: socket and wooden stock outside, the barbed iron head buried at `p`, shank toward a.
// Rope tied at the stock end hangs plumb. Returns the tip of the rod (the lightning rod point).
function harpoon(f, p, a, L, o = {}) {
  const d = dir(a), n = [-d[1], d[0]], shank = add(p, mul(d, L * 0.55)), end = add(p, mul(d, L)), w = o.w ?? 7;
  f.part(limb(p, shank, w * 0.75, w * 0.75, { steps: 4, capA: false }), RU(f, { inkW: 1.2, inkHeavy: 1.8, cast: false }));
  if (L > 60) { f.part(limb(shank, end, w * 1.5, w * 1.3, { steps: 4 }), WD(f, { inkW: 1.2, inkHeavy: 1.8, cast: false })); f.line([lp(shank, end, 0.05, -w * 0.4), lp(shank, end, 0.95, -w * 0.35)], 0.9, P.woodL, { op: 0.6, straight: true }); }
  f.part(limb(add(shank, mul(d, -w * 1.4)), add(shank, mul(d, w * 1.2)), w * 1.7, w * 1.6, { steps: 3 }), RU(f, { inkW: 1.2, inkHeavy: 1.6, cast: false })); // socket
  f.flat(ell(add(p, mul(d, w * 2)), w * 1.4, w * 0.9, a, 10), P.rustD, { op: 0.5 }); // rust bleed into the hide
  f.stroke([add(p, mul(n, w * 0.4)), add(add(p, mul(d, -w * 0.5)), [0, w * 3]), add(add(p, mul(d, -w * 0.6)), [w * 0.3, w * 7])], w * 0.8, P.rustD, { op: 0.6 });
  if (o.rope !== false) { const ra = lerp(shank, end, 0.15); const len = o.ropeLen ?? R(f, 50, 140); rope(f, [ra, add(ra, [3, len * 0.3]), add(ra, [-2, len * 0.65]), add(ra, [1, len])], o.rw ?? 3.4, { col: '#8a7e62', fray: true }); }
  return L > 60 ? end : shank;
}
// a storm lantern (tin hurricane lamp): fount, wire guard round a glass globe, chimney cap, bail. top: the bail's apex.
// h: overall height. The flame is lamp yellow; the bail hangs from the fist. Returns {globe centre, flame}.
function stormLantern(f, top, h, o = {}) {
  const w = h * 0.52, c = add(top, [0, h * 0.62]), tin = o.tin || P.ironL;
  const TN = (x) => ({ fill: tin, shadow: P.ironD, light: '#b8bcbc', shade: 0.42, tex: 'pit' + f.o.seed, texOp: 0.6, inkW: 1.2, inkHeavy: 2, cast: false, ...x });
  // bail: a wire arc from the cap sides up to the fist (in slight perspective)
  const capY = top[1] + h * 0.28;
  f.line([[top[0] - w * 0.42, capY + h * 0.06], [top[0] - w * 0.32, top[1] + h * 0.06], top, [top[0] + w * 0.3, top[1] + h * 0.05], [top[0] + w * 0.42, capY + h * 0.06]], 3.4, INK);
  f.line([[top[0] - w * 0.42, capY + h * 0.06], [top[0] - w * 0.32, top[1] + h * 0.06], top, [top[0] + w * 0.3, top[1] + h * 0.05], [top[0] + w * 0.42, capY + h * 0.06]], 1.6, P.ironL);
  // glow behind the globe
  glow(f, c, w * 1.3, h * 0.7, P.lamp, o.glowOp ?? 0.35, true);
  // globe glass with the flame inside
  const gl = [[c[0] - w * 0.32, c[1] - h * 0.2], [c[0] - w * 0.44, c[1]], [c[0] - w * 0.36, c[1] + h * 0.18], [c[0] + w * 0.36, c[1] + h * 0.18], [c[0] + w * 0.44, c[1]], [c[0] + w * 0.32, c[1] - h * 0.2]];
  f.part(gl, { fill: P.lampL, shadow: P.lampD, light: '#fff8e0', shade: 0.3, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false });
  f.flat(ell(add(c, [0, h * 0.02]), w * 0.25, h * 0.14, 0, 12), P.arc, { op: 0.9 });
  f.flat([add(c, [-w * 0.07, h * 0.08]), add(c, [0, -h * 0.13]), add(c, [w * 0.07, h * 0.08])], '#fffbe8');
  f.flat(ell(add(c, [-w * 0.16, -h * 0.06]), w * 0.04, h * 0.1, 0.2, 8), '#fff', { op: 0.6 }); // glass glint
  f.flat(ell(add(c, [w * 0.1, h * 0.12]), w * 0.12, h * 0.04, 0, 8), '#2a2418', { op: 0.35 }); // soot on the glass
  // wire guard: vertical wires over the globe
  for (const u of [-0.36, -0.12, 0.12, 0.36]) f.line([[c[0] + w * u * 0.8, c[1] - h * 0.2], [c[0] + w * u * 1.15, c[1]], [c[0] + w * u, c[1] + h * 0.18]], 2.2, INK);
  f.line([[c[0] - w * 0.46, c[1]], [c[0] + w * 0.46, c[1]]], 2.4, INK);
  // cap with vents
  f.part([[c[0] - w * 0.36, c[1] - h * 0.2], [c[0] - w * 0.3, capY + h * 0.02], [c[0] - w * 0.12, capY - h * 0.04], [c[0] + w * 0.12, capY - h * 0.04], [c[0] + w * 0.3, capY + h * 0.02], [c[0] + w * 0.36, c[1] - h * 0.2]], TN({}));
  for (let i = 0; i < 4; i++) f.flat(ell([c[0] - w * 0.18 + i * w * 0.12, capY + h * 0.06], w * 0.035, h * 0.025, 0, 6), '#0a0806');
  f.part(ell([top[0], capY - h * 0.05], w * 0.13, h * 0.04, 0, 10), TN({}));
  // fount (the oil tank) under the globe, dented, with a burner wick knob
  f.part([[c[0] - w * 0.5, c[1] + h * 0.18], [c[0] + w * 0.5, c[1] + h * 0.18], [c[0] + w * 0.56, c[1] + h * 0.3], [c[0] + w * 0.46, c[1] + h * 0.4, 1], [c[0] - w * 0.46, c[1] + h * 0.4, 1], [c[0] - w * 0.56, c[1] + h * 0.3]], TN({}));
  f.part(ell([c[0] + w * 0.56, c[1] + h * 0.22], w * 0.08, w * 0.08, 0, 8), TN({ fill: P.brass }));
  f.flat(ell([c[0] - w * 0.2, c[1] + h * 0.32], w * 0.12, h * 0.03, -0.2, 8), '#000', { op: 0.3 });
  scorch(f, [c[0] + w * 0.15, capY + h * 0.06], w * 0.18, h * 0.05, 0.5);
  if (o.rust !== false) verdigris(f, [c[0], c[1] + h * 0.33], w * 0.4, h * 0.04, 4, 0.5);
  return { c, bottom: [c[0], c[1] + h * 0.4] };
}


// a lighthouse lens-lantern: a beehive of stacked Fresnel glass rings in a brass cage, a vented dome cap with a hanging
// ring, a drip base. Inside, a lightning flame crackles. top: the hanging ring; w: cage width. Returns the lens centre.
function lensLantern(f, top, w, o = {}) {
  const h = w * 1.42, cx = top[0], y0 = top[1], capB = y0 + h * 0.22, lensB = y0 + h * 0.82, c = [cx, (capB + lensB) / 2];
  const br = (x) => BRS(f, Object.assign({ inkW: 1.4, inkHeavy: 2.2, cast: false }, x || {}));
  glow(f, c, w * 1.5, h * 0.9, P.lamp, o.glowOp ?? 0.42, true);
  // the lens: a barrel of glass, then horizontal prism rings catching the light, dark separations
  const lens = [[cx - w * 0.42, capB], [cx - w * 0.5, c[1] - h * 0.12], [cx - w * 0.52, c[1]], [cx - w * 0.5, c[1] + h * 0.12], [cx - w * 0.42, lensB], [cx + w * 0.42, lensB], [cx + w * 0.5, c[1] + h * 0.12], [cx + w * 0.52, c[1]], [cx + w * 0.5, c[1] - h * 0.12], [cx + w * 0.42, capB]];
  f.part(lens, { fill: P.lampL, shadow: P.lampD, light: '#fffbe6', shade: 0.28, inkW: 1.4, inkHeavy: 2, cast: false, hatch: false });
  clipDraw(f, lens, () => {
    f.flat(ell(c, w * 0.34, h * 0.24, 0, 16), P.lamp, { op: 0.55 });
    f.flat(ell(c, w * 0.18, h * 0.15, 0, 14), P.arc, { op: 0.95 });
    // prism rings: dark gaps, bright lower lips (the rings bend the light toward the viewer)
    const nr = o.rings ?? 9;
    for (let i = 0; i <= nr; i++) { const y = capB + (lensB - capB) * i / nr, bow = h * 0.02; f.line([[cx - w * 0.55, y], [cx, y + bow], [cx + w * 0.55, y]], 2.2, '#4a3a16', { op: 0.75 }); f.line([[cx - w * 0.5, y + 3], [cx, y + bow + 3], [cx + w * 0.5, y + 3]], 1.2, '#fffbe6', { op: 0.6 }); }
    // the crackling flame: a hot core and jagged threads inside the glass
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (f.r() - 0.5) * 2.6; bolt(f, add(c, [0, h * 0.05]), add(c, rot([w * R(f, 0.28, 0.42), 0], a)), { w: 1.4, forks: 1, n: 4, jit: 0.4, bloom: false, ends: false }); }
  });
  // the cage: brass astragal bars over the lens, top and bottom rims
  for (const u of [-0.34, -0.1, 0.16, 0.38]) { const q = [[cx + w * u * 0.86, capB], [cx + w * u * 1.04, c[1]], [cx + w * u * 0.86, lensB]]; f.line(q, 6, INK); f.line(q, 3.4, P.brass); f.line(q.map(p => add(p, [-1, 0])), 1, P.brassL, { op: 0.7 }); }
  f.part([[cx - w * 0.48, capB - h * 0.03], [cx + w * 0.48, capB - h * 0.03], [cx + w * 0.5, capB + h * 0.035], [cx - w * 0.5, capB + h * 0.035]], br({ sharp: true }));
  f.part([[cx - w * 0.5, lensB - h * 0.02], [cx + w * 0.5, lensB - h * 0.02], [cx + w * 0.46, lensB + h * 0.06], [cx + w * 0.2, lensB + h * 0.12], [cx - w * 0.2, lensB + h * 0.12], [cx - w * 0.46, lensB + h * 0.06]], br({}));
  f.part(ell([cx, lensB + h * 0.14], w * 0.08, h * 0.03, 0, 8), br({})); // drip cup
  // the dome cap with vents and the chimney, a ring to hang it by
  f.part([[cx - w * 0.44, capB - h * 0.02], [cx - w * 0.36, y0 + h * 0.12], [cx - w * 0.14, y0 + h * 0.06], [cx + w * 0.14, y0 + h * 0.06], [cx + w * 0.36, y0 + h * 0.12], [cx + w * 0.44, capB - h * 0.02]], br({}));
  for (let i = 0; i < 6; i++) f.flat(ell([cx - w * 0.3 + i * w * 0.12, y0 + h * 0.16], w * 0.03, h * 0.018, 0, 6), '#0a0806');
  f.part([[cx - w * 0.1, y0 + h * 0.07], [cx - w * 0.08, y0 + h * 0.02], [cx + w * 0.08, y0 + h * 0.02], [cx + w * 0.1, y0 + h * 0.07]], br({ fill: P.brassD }));
  const rg = ell([cx, y0 - w * 0.02], w * 0.07, w * 0.08, 0, 12); f.line(rg.concat([rg[0]]), 5, INK); f.line(rg.concat([rg[0]]), 2.8, P.brass);
  // wear: verdigris in the crevices, soot over the chimney, a run of fused brass where the strike came down the cage
  verdigris(f, [cx - w * 0.3, capB], w * 0.12, h * 0.02, 5); verdigris(f, [cx + w * 0.2, lensB + h * 0.05], w * 0.2, h * 0.03, 5);
  scorch(f, [cx, y0 + h * 0.1], w * 0.16, h * 0.05, 0.55);
  fusedRun(f, [cx + w * 0.34, lensB + h * 0.07], h * 0.12, 4, P.brass);
  lichtenberg(f, [cx - w * 0.2, y0 + h * 0.13], -0.4, w * 0.4, 1.8, { metal: true, depth: 2 });
  return { c, lensB, capB, h };
}

// the vestigial hand at a harpy's wing wrist: three bony hooked fingers that bend only toward the palm (one direction)
function wristClaw(f, W0, a0, s = 1, look) {
  const lk = look || HS(f);
  for (let i = 0; i < 3; i++) {
    const a = a0 + (i - 1) * 0.32, p0 = add(W0, rot([6 * s, 0], a)), p1 = add(p0, rot([20 * s, 0], a)), p2 = add(p1, rot([14 * s, 0], a + 0.55));
    f.part(K.chain([p0, p1, p2], [9 * s, 7 * s, 6 * s], { steps: 4 }), Object.assign({}, lk, { cast: false, inkW: 1.1, inkHeavy: 1.6 }));
    f.line([lp(p0, p1, 0.9, -4 * s), lp(p0, p1, 0.9, 4 * s)], 0.9, INK, { op: 0.6 }); f.line([lp(p0, p1, 0.4, -3 * s), lp(p0, p1, 0.4, 3 * s)], 0.8, INK, { op: 0.4 });
    const dd = E.norm(sub(p2, p1)), cn = [-dd[1], dd[0]];
    f.part([add(p2, mul(cn, -3 * s)), add(add(p2, mul(dd, 9 * s)), mul(cn, -1 * s)), [...add(add(p2, mul(dd, 13 * s)), mul(cn, 6 * s)), 1], add(add(p2, mul(dd, 5 * s)), mul(cn, 2 * s)), add(p2, mul(cn, 3 * s))], { fill: '#24201e', shadow: '#0a0808', light: '#6a6460', shade: 0.4, inkW: 1, cast: false, hatch: false });
  }
}

// ---- crab legs (independent review: copied from kit_III / kit_I_b, the reviewed Wreck Crab and Kettle Crab fixes, with
// slate tints). A limb outline from per-side width profiles [[t, halfWidth, sharp?]...] along a -> b.
function mlimb(a, b, Pw, Qw, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  const sd = (arr, sg) => arr.map(([t, w, sh]) => { const q = add(lerp(a, b, t), mul(n, sg * w)); return sh ? [...q, 1] : q; });
  const pp = sd(Pw, 1), qq = sd(Qw, -1), ck = o.capK ?? 0.75, out = [...pp];
  const wpB = Pw[Pw.length - 1][1], wqB = Qw[Qw.length - 1][1], cB = lerp(lerp(a, b, Pw[Pw.length - 1][0]), lerp(a, b, Qw[Qw.length - 1][0]), 0.5);
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(cB, add(mul(n, Math.cos(an) * w), mul(d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...qq.reverse());
  const wpA = Pw[0][1], wqA = Qw[0][1], cA = lerp(lerp(a, b, Pw[0][0]), lerp(a, b, Qw[0][0]), 0.5);
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(cA, add(mul(n, -Math.cos(an) * w), mul(d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
// one crab leg segment: a thick flattened tube flaring toward its distal socket, a lit ridge, a carina groove, spines on
// the leading edge, setae on the trailing edge, a pale joint membrane
function crabSeg(f, a, b, wa, wb, look, o = {}) {
  const Pw = [[0, wa * 0.42], [0.2, wa * 0.52], [0.6, wb * 0.56], [0.88, wb * 0.62], [1, wb * 0.5]];
  const Qw = [[0, wa * 0.42], [0.25, wa * 0.48], [0.65, wb * 0.5], [0.9, wb * 0.56], [1, wb * 0.46]];
  const pts = mlimb(a, b, Pw, Qw, { capK: 0.5 });
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], dk = mix(look.fill, '#000', 0.5), lt = mix(look.fill, '#e4ebee', 0.45);
  f.line([lp(a, b, 0.1, wa * 0.2), lp(a, b, 0.55, wb * 0.26), lp(a, b, 0.86, wb * 0.3)], 1.8, lt, { op: 0.6 });
  f.line([lp(a, b, 0.12, -wa * 0.18), lp(a, b, 0.8, -wb * 0.22)], 1.1, dk, { op: 0.5 });
  f.line([lp(a, b, 0.9, wb * 0.6), lp(a, b, 0.95, 0), lp(a, b, 0.9, -wb * 0.55)], 1.4, INK, { op: 0.7 });
  if (o.membrane !== false) f.flat(ell(lp(a, b, 0.97, -wb * 0.18), wb * 0.16, wb * 0.1, Math.atan2(d[1], d[0]), 8), o.memCol || mix(look.fill, '#c8b4a8', 0.45), { op: 0.7 });
  const sg = o.spineSide ?? 1, ns = o.spines ?? 3;
  for (let i = 0; i < ns; i++) {
    const t = 0.18 + i * 0.68 / Math.max(1, ns - 1), w = (wa + (wb - wa) * t) * 0.5, base = lp(a, b, t, sg * w * 0.95), L = w * (0.4 + f.r() * 0.25);
    const tip = add(base, add(mul(n, sg * L), mul(d, L * 0.9)));
    f.part([add(base, mul(d, -w * 0.22)), tip, add(base, mul(d, w * 0.2))], Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false, k: 0.4, fill: mix(look.fill, '#dfe4e2', 0.3) }));
  }
  for (let i = 0; i < (o.hairs ?? 6); i++) {
    const t = 0.1 + f.r() * 0.8, w = (wa + (wb - wa) * t) * 0.5, base = lp(a, b, t, -sg * w * 0.9), L = w * (0.3 + f.r() * 0.35);
    f.line([base, add(base, add(mul(n, -sg * L), mul(d, L * 0.6)))], 0.9, INK, { op: 0.8 });
  }
  return pts;
}
// the dactyl: a curved, tapering last segment ending in a dark horn tip planted on the ground
function dactyl(f, a, tip, w, look, bend = 0.25) {
  const d = E.norm(sub(tip, a)), n = [-d[1], d[0]], L = E.len(sub(tip, a)), m = add(lerp(a, tip, 0.5), mul(n, L * bend * 0.3));
  const pts = [add(a, mul(n, w * 0.5)), add(m, mul(n, w * 0.36)), add(lerp(m, tip, 0.6), mul(n, w * 0.16)), [...tip, 1], add(lerp(m, tip, 0.6), mul(n, -w * 0.14)), add(m, mul(n, -w * 0.32)), add(a, mul(n, -w * 0.5))];
  f.part(pts, Object.assign({ k: 0.85 }, look));
  f.flat([add(lerp(m, tip, 0.45), mul(n, w * 0.2)), [...tip, 1], add(lerp(m, tip, 0.45), mul(n, -w * 0.18))], '#14161a', { op: 0.85 });
  for (let i = 0; i < 4; i++) { const q = add(lerp(a, m, 0.2 + i * 0.2), mul(n, -w * 0.36)); f.line([q, add(q, add(mul(n, -w * 0.3), mul(d, w * 0.2)))], 0.9, INK, { op: 0.75 }); }
  f.line([add(a, mul(n, w * 0.22)), add(m, mul(n, w * 0.18)), add(lerp(m, tip, 0.5), mul(n, w * 0.06))], 1.3, mix(look.fill, '#e4ebee', 0.45), { op: 0.55 });
  return pts;
}

// move a finished figure (drawing and joints) by [dx, dy]: used when a creature's reach runs off its tier canvas
function shiftFig(f, dx, dy) {
  f.out = f.out.map(q => `<g transform="translate(${dx},${dy})">${q}</g>`);
  for (const j of Object.values(f.joints)) j.pivot = [Math.round((j.pivot[0] + dx) * 10) / 10, Math.round((j.pivot[1] + dy) * 10) / 10];
  return f;
}


// ======================================================================= World X additions
const dir = a => [Math.cos(a), Math.sin(a)];
// extra textures: compound-eye facets, hive-paper bands, comb cells, setae, chitin growth lines and punctures
function texturesX(f) {
  textures(f);
  const s = f.o.seed, r = E.rng(s * 7 + 11);
  let fc = ''; for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { const X = x * 6 + (y % 2) * 3, Y = y * 5.2; fc += `<path d="M${X},${Y + 1.7} l3,-1.7 l3,1.7 v3.4 l-3,1.7 l-3,-1.7z" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.7"/><circle cx="${X + 2.2}" cy="${Y + 2.4}" r="0.7" fill="#b8b0d0" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="facet${s}" patternUnits="userSpaceOnUse" width="18" height="15.6">${fc}</pattern>`);
  let pp = ''; for (let i = 0; i < 14; i++) { const y = i * 9 + r() * 4; pp += `<path d="M0,${y.toFixed(1)} q30,${(r() * 8 - 4).toFixed(1)} 60,${(r() * 4 - 2).toFixed(1)} t60,0" fill="none" stroke="${r() > 0.5 ? INK : '#b0a690'}" stroke-width="${(0.8 + r() * 1.6).toFixed(1)}" opacity="${(0.25 + r() * 0.3).toFixed(2)}"/>`; }
  f.defs.push(`<pattern id="pulp${s}" patternUnits="userSpaceOnUse" width="120" height="126" patternTransform="rotate(-8)">${pp}</pattern>`);
  f.defs.push(`<pattern id="comb${s}" patternUnits="userSpaceOnUse" width="36" height="31.2"><path d="M0,5.2 l9,-5.2 l9,5.2 v10.4 l-9,5.2 l-9,-5.2z M18,20.8 l9,-5.2 l9,5.2 v10.4 M18,20.8 v10.4" fill="none" stroke="${INK}" stroke-width="1.4" opacity="0.6"/></pattern>`);
  let st = ''; for (let i = 0; i < 26; i++) { const x = r() * 24, y = r() * 24, a = -1.2 + r() * 0.9, l = 3 + r() * 4; st += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" stroke="${r() > 0.4 ? INK : '#d8d0c0'}" stroke-width="0.8" opacity="0.55"/>`; }
  f.defs.push(`<pattern id="setae${s}" patternUnits="userSpaceOnUse" width="24" height="24">${st}</pattern>`);
  f.defs.push(`<pattern id="growth${s}" patternUnits="userSpaceOnUse" width="10" height="7"><path d="M0,3.5 q5,-2 10,0" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.5"/></pattern>`);
}
// looks: chitin (cold sheen), venom-green chitin band, pale membrane, hive paper
const CH = (f, o = {}) => Object.assign({ fill: P.chit, shadow: P.chitS, light: P.chitL, shade: 0.42, tex: 'pit' + f.o.seed, texOp: 0.35 }, o);
const VN = (f, o = {}) => Object.assign({ fill: P.ven, shadow: P.venS, light: P.venL, shade: 0.42, tex: 'pit' + f.o.seed, texOp: 0.3 }, o);
const MEM = (f, o = {}) => Object.assign({ fill: '#5a5260', shadow: '#1a161e', light: '#8a8296', shade: 0.4, tex: 'wrinkle' + f.o.seed, texOp: 0.5 }, o);
const PAP = (f, o = {}) => Object.assign({ fill: P.paper, shadow: P.paperD, light: P.paperL, shade: 0.4, tex: 'pulp' + f.o.seed, texOp: 0.8 }, o);
const SKX = (f, o = {}) => Object.assign({ fill: P.skin, shadow: P.skinS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o);
const CLK = (f, o = {}) => Object.assign({ fill: P.cloak, shadow: '#221c18', light: P.cloakL, shade: 0.4, tex: 'weave' + f.o.seed, texOp: 0.45 }, o);

// a lightning burn on dark chitin: a fern of pale white-violet scar lines over a charred ink channel (no bloom: a scar)
function burn(f, c, a, len, w, o = {}) { lichtenberg(f, c, a, len, w, Object.assign({ pale: true, col: P.vioL, op: 0.85, depth: 2 }, o)); }
// a lightning burn on flesh: dark violet channel with a pale shiny keloid edge
function skinBurn(f, c, a, len, w, o = {}) { lichtenberg(f, c, a, len, w, Object.assign({ col: P.scar, lite: P.scarL, depth: 3 }, o)); }
// static: a short jagged white-violet fork jumping off an edge or a point (small, ink-cored, never an outline)
function stat(f, a, b, o = {}) { return bolt(f, a, b, Object.assign({ w: 1.3, forks: 2, n: 4, jit: 0.45, bloomOp: 0.16, ends: false, col: P.vio }, o)); }

// toxin: a ripening pustule, a swollen bulb with a pale head and a dark ring where it lifts the skin
function pustule(f, c, r, o = {}) {
  const col = o.col || mix(P.ven, P.bone, 0.35);
  f.flat(ell(add(c, [r * 0.1, r * 0.25]), r * 1.25, r * 0.95, 0, 10), o.ring || '#1a1a10', { op: 0.45 });
  f.part(ell(c, r, r * 0.86, o.a || 0, 12), { fill: col, shadow: mix(col, '#1a2010', 0.6), light: mix(col, '#fff', 0.4), shade: 0.45, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false });
  f.flat(ell(add(c, [-r * 0.2, -r * 0.25]), r * 0.42, r * 0.34, 0, 8), mix(P.venP, '#fff', 0.3), { op: 0.75 });
  if (o.burst) { f.flat(ell(add(c, [r * 0.1, -r * 0.05]), r * 0.4, r * 0.25, 0.4, 8), '#12140a', { op: 0.9 }); f.line([add(c, [r * 0.3, r * 0.1]), add(c, [r * 0.4, r * 1.2]), add(c, [r * 0.35, r * 1.9])], Math.max(1, r * 0.25), P.venL, { op: 0.8 }); }
}
function pustules(f, c, rx, ry, n, r0, r1, o = {}) { const L = []; for (let i = 0; i < n; i++) L.push([scatter(f, c, rx, ry), R(f, r0, r1)]); L.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => pustule(f, p, r, { burst: f.r() < (o.burst ?? 0.25), col: o.col })); }
// mould bloom: a soft fuzzy patch of pale grey-green specks with a few hyphae
function mould(f, c, rx, ry, n = 20, o = {}) {
  f.flat(ell(c, rx, ry, o.a || 0, 14).map(q => add(q, [(f.r() - 0.5) * rx * 0.3, (f.r() - 0.5) * ry * 0.3])), o.base || mix(P.ven, P.grey, 0.5), { op: o.baseOp ?? 0.22 });
  for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = R(f, 0.8, 2.2) * (o.s ?? 1); f.flat(ell(p, r, r, 0, 6), f.r() > 0.35 ? '#c4c8b4' : P.venP, { op: 0.75 }); if (f.r() < 0.3) f.line([p, add(p, [(f.r() - 0.5) * 6, -2 - f.r() * 5])], 0.7, '#d0d4c4', { op: 0.6 }); }
}
// a fruiting body (cordyceps): a stalk out of the host, tapering, bent, with a dark-speckled club head and a pale tip
function cordyceps(f, b0, a, L, w, o = {}) {
  const bend = o.bend ?? 0.25, m = add(add(b0, rot([L * 0.5, 0], a)), rot([0, L * bend * 0.3], a)), t = add(b0, rot([L, 0], a + bend * 0.5));
  const look = { fill: o.col || '#9a9668', shadow: '#2e2e1a', light: '#d0ccaa', shade: 0.42, inkW: 1.1, inkHeavy: 1.6, cast: false, tex: 'wrinkle' + f.o.seed, texOp: 0.4 };
  f.flat(ell(b0, w * 1.1, w * 0.7, a, 10), '#1a1a10', { op: 0.6 }); // where it breaks the skin
  f.part(K.chain([b0, lerp(b0, m, 0.6), m, lerp(m, t, 0.5)], [w, w * 0.8, w * 0.62, w * 0.56], { steps: 4 }), look);
  const hc = lerp(m, t, 0.72), ha = Math.atan2(t[1] - m[1], t[0] - m[0]);
  f.part(ell(hc, L * 0.2, w * 0.75, ha, 12), Object.assign({}, look, { fill: o.head || mix(P.ven, '#3a3020', 0.4), tex: 'pit' + f.o.seed, texOp: 0.7 }));
  for (let i = 0; i < 5; i++) f.flat(ell(add(hc, rot([(f.r() - 0.5) * L * 0.3, (f.r() - 0.5) * w * 0.9], ha)), 1, 1, 0, 5), '#14120a', { op: 0.8 });
  f.part(ell(add(hc, rot([L * 0.22, 0], ha)), w * 0.4, w * 0.36, ha, 8), Object.assign({}, look, { fill: P.venP }));
  f.line([lp(b0, m, 0.1, w * 0.25), lp(b0, m, 0.9, w * 0.2)], 1, '#e4e0c4', { op: 0.55 });
  return t;
}
// a hollow: a larva's exit hole with a ragged rim, a dark shaft and a pale crinkled lip
function hole(f, c, rx, ry, a = 0, o = {}) {
  const e = ell(c, rx, ry, a, 12).map((q, i) => i % 2 ? add(q, [(f.r() - 0.5) * rx * 0.4, (f.r() - 0.5) * ry * 0.4]) : q);
  f.flat(ell(c, rx * 1.5, ry * 1.4, a, 12), o.bruise || '#2e2a1e', { op: 0.35 });
  f.flat(e, o.lip || mix(P.skin, P.ven, 0.25), { op: 0.95 });
  f.flat(e.map(q => lerp(q, c, 0.25)), '#0c0a0e');
  f.flat(e.slice(0, 6).map(q => lerp(q, c, 0.25)).concat([add(c, rot([0, ry * 0.2], a))]), '#2a2018', { op: 0.6 });
  f.line(e.slice(6, 12).concat([e[0]]), 1, '#e2dcc4', { op: 0.6 });
}
// a grub: pale green-bone segmented larva, curled, with a dark head capsule and mandibles. c: centre, a: head direction
function grub(f, c, a, s = 1, o = {}) {
  const col = o.col || mix(P.venP, P.bone, 0.5), n = 6, pts = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1), q = add(c, rot([(t - 0.5) * 26 * s, Math.sin(t * Math.PI) * -7 * s * (o.curl ?? 1)], a)); pts.push(q); }
  for (let i = 0; i < n; i++) { const r = (5.5 - Math.abs(i - 2.5) * 0.6) * s; f.part(ell(pts[i], r * 0.9, r, a, 10), { fill: col, shadow: mix(col, '#2a2a1a', 0.6), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false }); }
  const h = add(pts[n - 1], rot([4 * s, 0], a));
  f.part(ell(h, 3.6 * s, 3.2 * s, a, 8), { fill: '#3a2e1e', shade: 0.4, inkW: 0.9, cast: false, hatch: false });
  f.line([add(h, rot([3 * s, -1.5 * s], a)), add(h, rot([6 * s, 0], a))], 1, INK);
  return pts;
}
// silk: a thin pale strand (o.sag for a catenary between a and b)
function silk(f, a, b, o = {}) {
  const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(add(lerp(a, b, t), [0, (o.sag || 0) * 4 * t * (1 - t)])); }
  f.line(pts, (o.w ?? 1.1) + 1.2, INK, { op: (o.op ?? 0.8) * 0.5 }); f.line(pts, o.w ?? 1.1, o.col || P.silk, { op: o.op ?? 0.8 }); return pts;
}
// a compound eye: a faceted dark mass, kidney-bent, with a cold sheen crescent; no pupil and no stare
function ceye(f, c, rx, ry, a = 0, o = {}) {
  const k = o.kidney ?? 0.25, pts = ell(c, rx, ry, a, 20).map((q, i) => { const t = i / 20 * Math.PI * 2, dent = Math.max(0, Math.cos(t - Math.PI)) ** 3 * k; return lerp(q, c, dent); });
  f.part(pts, { fill: o.col || '#24222c', shadow: '#08070a', light: '#5a566a', shade: 0.45, tex: 'facet' + f.o.seed, texOp: 0.75, inkW: 1.3, inkHeavy: 2.2, cast: false });
  clipDraw(f, pts, () => { f.flat(ell(add(c, rot([-rx * 0.25, -ry * 0.35], a)), rx * 0.5, ry * 0.32, a - 0.4, 12), '#8a84a4', { op: 0.22 }); f.flat(ell(add(c, rot([rx * 0.35, ry * 0.35], a)), rx * 0.7, ry * 0.5, a, 12), '#000', { op: 0.3 }); });
  for (let i = 0; i < (o.glints ?? 4); i++) f.flat(ell(add(c, rot([-rx * (0.1 + f.r() * 0.4), -ry * (0.2 + f.r() * 0.4)], a)), 1.1, 1.1, 0, 5), '#e0dcf0', { op: 0.5 });
  return pts;
}
// an antenna along control points: a long scape, then a beaded flagellum that tapers; o.elbow is cosmetic
function antenna(f, ctl, w, look, o = {}) {
  const C = spline(ctl, 2), S = arcLen(C), L = S[S.length - 1], n = o.n ?? 16;
  for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, a = at(C, S, t0 * L).p, b = at(C, S, t1 * L - 0.5).p, ww = Math.max(1.6, w * (1 - t0 * 0.6) * (i === 0 ? 1.15 : 1)); f.part(limb(a, b, ww, ww * 0.9, { steps: 3, capK: 0.5 }), Object.assign({}, look, { inkW: 0.9, inkHeavy: 1.2, cast: false })); f.line([lp(a, b, 0.2, ww * 0.25), lp(a, b, 0.8, ww * 0.2)], 0.8, look.light || '#888', { op: 0.6 }); }
  return C[C.length - 1];
}
// an insect leg through its joints: J = [coxa base, femur base (trochanter), knee, ankle, tarsus tip]; w = width at the
// coxa (thick at the base, tapering out). Femur and tibia use the reviewed crab segment (ridge, groove, spines, setae,
// membrane); the tarsus is four beads and a claw pair. o.planted: the claws bite the ground with a contact shadow.
function ileg(f, J, w, look, o = {}) {
  const [c0, c1, k, an, tip] = J;
  f.part(ell(c0, w * 0.75, w * 0.6, Math.atan2(c1[1] - c0[1], c1[0] - c0[0]), 12), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.25), cast: false }));
  f.part(limb(c0, c1, w * 1.08, w * 0.92, { steps: 6, capK: 0.6, p: [[0.5, 0.12, 0.3]] }), Object.assign({}, look, { cast: false }));
  crabSeg(f, c1, k, w * 0.9, w * 0.76, Object.assign({}, look, { cast: false }), { spines: o.femurSpines ?? 0, hairs: o.hairs ?? 4, spineSide: o.spineSide ?? 1, memCol: o.mem });
  crabSeg(f, k, an, w * 0.66 * (o.tib ?? 1), w * 0.5 * (o.tib ?? 1), Object.assign({}, look, { cast: false }), { spines: o.spines ?? 3, hairs: o.hairs ?? 5, spineSide: o.spineSide ?? 1, memCol: o.mem });
  const n = 4, d = E.norm(sub(tip, an)), nn = [-d[1], d[0]], L = E.len(sub(tip, an));
  for (let i = 0; i < n; i++) { const a = add(an, mul(d, L * i / n)), b = add(an, mul(d, L * (i + 0.95) / n)), ww = w * (0.36 - i * 0.04) * Math.sqrt(o.tib ?? 1); f.part(limb(a, b, ww, ww * 0.8, { steps: 3, capK: 0.6 }), Object.assign({}, look, { inkW: 1, inkHeavy: 1.5, cast: false })); }
  for (const sg of [1, -0.6]) f.part([add(tip, mul(nn, w * 0.12)), add(add(tip, mul(d, w * 0.3)), mul(nn, sg * w * 0.12)), [...add(add(tip, mul(d, w * 0.38)), mul(nn, sg * w * 0.34)), 1], add(add(tip, mul(d, w * 0.14)), mul(nn, sg * w * 0.04)), add(tip, mul(nn, -w * 0.1))], { fill: '#0e0d10', light: '#5a5662', shade: 0.4, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
  if (o.planted) f.flat(ell(add(tip, [0, 2]), w * 0.6, 2.4, 0, 8), '#0c0b0e', { op: 0.6 });
  return tip;
}
// an insect wing (membranous): root, heading a, length L, chord W. Translucent membrane, a heavy costa on the leading
// edge, the radius, media and cubitus fanning to the margin, cross-veins closing cells, a dark stigma, torn notches on
// the trailing edge (o.tears: [t...]), o.burn: a scorched hole with a white-violet scar round it. tr: trailing side sign.
function iwing(f, root, a, L, W, o = {}) {
  const tr = o.tr ?? 1, F = frame(root, a, 1), Y = y => y * tr;
  const lead = [], trail = [], N = 14;
  for (let i = 0; i <= N; i++) { const t = i / N; lead.push([L * t, Y(-W * 0.12 * Math.sin(t * Math.PI * 0.9) - W * 0.05)]); }
  for (let i = N; i >= 0; i--) { const t = i / N, w = W * Math.pow(Math.sin(Math.min(1, t * 1.05) * Math.PI * 0.92), 0.7) * (t > 0.85 ? 1 - (t - 0.85) * 2.2 : 1); let y = w * 0.9; if ((o.tears || []).some(tt => Math.abs(tt - t) < 0.5 / N)) y *= 0.45; trail.push([L * t, Y(y + W * 0.04)]); }
  const out = F([...lead, ...trail]);
  f.flat(out, o.col || '#c8c2d6', { op: o.op ?? 0.3 });
  clipDraw(f, out, () => { f.flat(F([[0, Y(-W)], [L * 0.3, Y(-W)], [L * 0.16, Y(W)], [0, Y(W)]]), '#4a4656', { op: 0.16 }); f.flat(F([[L * 0.4, Y(-W * 0.2)], [L * 0.85, Y(-W * 0.1)], [L * 0.7, Y(W * 0.5)], [L * 0.45, Y(W * 0.6)]]), o.sheen || P.vioL, { op: 0.16 }); f.flat(F([[L * 0.2, Y(W * 0.2)], [L * 0.5, Y(W * 0.3)], [L * 0.4, Y(W)], [L * 0.15, Y(W)]]), P.venL, { op: 0.1 }); });
  f.line(out.concat([out[0]]), 1.2, INK, { op: 0.75 });
  const vein = (pts, w2) => { f.line(F(pts), w2 + 0.8, INK, { op: 0.75 }); f.line(F(pts), Math.max(0.6, w2 * 0.4), '#6a6478', { op: 0.6 }); };
  vein(lead.slice(0, 11), 2.6); // costa
  vein([[2, Y(-W * 0.02)], [L * 0.3, Y(W * 0.0)], [L * 0.58, Y(-W * 0.06)], [L * 0.85, Y(W * 0.0)]], 1.6); // radius
  vein([[4, Y(W * 0.08)], [L * 0.32, Y(W * 0.25)], [L * 0.6, Y(W * 0.35)], [L * 0.9, Y(W * 0.3)]], 1.3); // media
  vein([[6, Y(W * 0.15)], [L * 0.3, Y(W * 0.5)], [L * 0.55, Y(W * 0.82)]], 1.2); // cubitus
  for (const [x0, y0, x1, y1] of [[0.32, 0.0, 0.32, 0.25], [0.45, -0.03, 0.47, 0.31], [0.6, 0.33, 0.58, 0.75], [0.3, 0.25, 0.32, 0.5], [0.58, -0.06, 0.6, 0.33], [0.72, -0.03, 0.75, 0.33]]) vein([[L * x0, Y(W * y0)], [L * x1, Y(W * y1)]], 0.9);
  f.part(F([[L * 0.56, Y(-W * 0.16)], [L * 0.7, Y(-W * 0.13)], [L * 0.69, Y(-W * 0.05)], [L * 0.57, Y(-W * 0.06)]]), { fill: '#2a2632', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false }); // stigma
  if (o.burn) { const bc = F([[L * o.burn[0], Y(W * o.burn[1])]])[0], r = W * (o.burn[2] || 0.12); f.flat(ell(bc, r * 1.5, r * 1.2, a, 10).map(q => add(q, [(f.r() - 0.5) * r * 0.6, (f.r() - 0.5) * r * 0.6])), '#14121a', { op: 0.55 }); f.flat(ell(bc, r * 0.8, r * 0.6, a, 9).map(q => add(q, [(f.r() - 0.5) * r * 0.5, (f.r() - 0.5) * r * 0.5])), o.holeCol || '#4a4654', { op: 0.9 }); burn(f, add(bc, rot([r, 0], a)), a + 0.3, r * 3, 1.2, { depth: 1 }); }
  return { out, F };
}
// a big membranous wing built cell by cell (for large insects, where a single translucent sheet reads as a plank): root,
// heading a, length L, chord W, trailing side tr. Longitudinal veins converge toward the tip; cross-veins close the
// cells; each cell is its own translucent pane (tint varies), so torn-out cells (o.holes: [[col,row]]) are real holes;
// the trailing margin is ragged where o.tears say; o.burn: [col,row] a scorched cell with a fern. Veins scale with L.
function cellWing(f, root, a, L, W, o = {}) {
  const tr = o.tr ?? 1, F = frame(root, a, 1), vs = o.vw ?? L / 340;
  const lead = t => -W * 0.14 * Math.sin(t * Math.PI * 0.95) - W * 0.04;
  const trail = t => W * Math.pow(Math.sin(Math.min(1, t * 1.04) * Math.PI * 0.93), 0.75) * (t > 0.82 ? 1 - (t - 0.82) * 2.6 : 1) * 0.92 + W * 0.04;
  const rows = [0, 0.1, 0.3, 0.56, 0.8, 1], cols = o.cols || [0, 0.08, 0.24, 0.4, 0.52, 0.64, 0.78, 0.9, 1];
  const jit = []; for (let c = 0; c < cols.length; c++) { jit.push([]); for (let r = 0; r < rows.length; r++) jit[c].push(c === 0 || c === cols.length - 1 || r === 0 ? 0 : (f.r() - 0.5) * 0.05); }
  const P = (c, r) => { const t = Math.min(1, cols[c] + jit[c][r]), fr = rows[r], conv = Math.pow(t, 2.2); const y = lead(t) + (trail(t) - lead(t)) * (fr * (1 - conv * 0.3)); return F([[L * t, y * tr]])[0]; };
  const isHole = (c, r) => (o.holes || []).some(([hc, hr]) => hc === c && hr === r);
  const tearCols = o.tears || [];
  // panes
  for (let c = 0; c < cols.length - 1; c++) for (let r = 0; r < rows.length - 1; r++) {
    if (isHole(c, r)) continue;
    let q = [P(c, r), P(c + 1, r), P(c + 1, r + 1), P(c, r + 1)];
    if (r === rows.length - 2) { // the trailing margin: ragged, torn where asked
      const a0 = P(c + 1, r + 1), b0 = P(c, r + 1), torn = tearCols.includes(c), mid = [];
      for (let i = 1; i < 5; i++) { const p = lerp(a0, b0, i / 5), back = torn ? R(f, 0.25, 0.6) : R(f, 0, 0.08); mid.push(lerp(p, lerp(P(c + 1, r), P(c, r), i / 5), back)); }
      q = [P(c, r), P(c + 1, r), torn ? lerp(a0, P(c + 1, r), 0.3) : a0, ...mid, torn ? lerp(b0, P(c, r), 0.3) : b0];
    }
    const tint = mix(o.col || '#b8b2c8', r < 2 ? '#7a7464' : '#d8d2e6', R(f, 0.1, 0.4));
    f.flat(q.map(p => [p[0], p[1], 1]), tint, { op: (o.op ?? 0.24) * R(f, 0.85, 1.2) * (r < 2 ? 1.3 : 1) });
    if (f.r() < 0.35) f.flat(q.map(p => lerp(p, q.reduce((s, z) => add(s, mul(z, 1 / q.length)), [0, 0]), 0.35)).map(p => [p[0], p[1], 1]), o.sheen || P.vioL, { op: 0.07 }); // a sheen in the pane
    if (r === rows.length - 2) f.line(q.slice(2).concat([q[0]]).slice(0, -1), 1.2, INK, { op: 0.55 }); // the margin
  }
  // veins: longitudinal (heavier toward the leading edge), then cross-veins; ink with a dark amber core
  const vein = (pts, w) => { f.line(pts, w + 1.2 * vs, INK, { op: 0.85 }); f.line(pts, Math.max(0.8, w * 0.4), '#5a5262', { op: 0.6 }); };
  for (let r = 0; r < rows.length - 1; r++) { const pts = []; for (let c = 0; c < cols.length - (r > 1 ? 1 : 0); c++) pts.push(P(c, r)); vein(pts, (r === 0 ? 3.2 : r === 1 ? 2.2 : 1.4) * vs); }
  for (let c = 1; c < cols.length - 1; c++) for (let r = 0; r < rows.length - 2; r++) { if (isHole(c, r) && isHole(c - 1, r)) continue; if (r >= 2 && (c % 2 || c > 5)) continue; if (r >= 1 && c > 6) continue; vein([P(c, r), P(c, r + 1)], 1.1 * vs); } // closed cells toward the front, open toward the margin
  // the stigma: a dark thickening on the leading edge
  f.part([P(4, 0), P(5, 0), P(5, 1), P(4, 1)].map(p => [p[0], p[1], 1]), { fill: '#2a2420', shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  // torn holes: ragged frayed rims with stubs of broken vein
  for (const [hc, hr] of (o.holes || [])) { const q = [P(hc, hr), P(hc + 1, hr), P(hc + 1, hr + 1), P(hc, hr + 1)], cc = q.reduce((s, z) => add(s, mul(z, 0.25)), [0, 0]); for (let i = 0; i < 4; i++) { const p0 = q[i], p1 = q[(i + 1) % 4]; for (let k = 1; k < 4; k++) { const p = lerp(p0, p1, k / 4); f.line([p, lerp(p, cc, R(f, 0.08, 0.22))], 1.1, INK, { op: 0.6 }); } } }
  if (o.burn) { const [bc, br] = o.burn, q = [P(bc, br), P(bc + 1, br), P(bc + 1, br + 1), P(bc, br + 1)], cc = q.reduce((s, z) => add(s, mul(z, 0.25)), [0, 0]); f.flat(q.map(p => lerp(p, cc, 0.1)).map(p => [p[0], p[1], 1]), '#14121a', { op: 0.55 }); f.flat(q.map(p => lerp(p, cc, 0.45)), '#2a2430', { op: 0.6 }); burn(f, cc, a + 0.4, E.len(sub(q[1], q[0])) * 1.4, 1.6 * vs, { depth: 2 }); }
  return { P, cols, rows };
}
// a segmented plate body along control points (front first). Each segment's tergite wraps down to `wrap` of the ventral
// side and its posterior rim (a darker band with thickness) laps over the front of the next segment; the sternites show
// below. hw(u): half depth at u (0 front, 1 rear). vs: +1 if the ventral side is on +normal. band(i): fill for segment i's
// posterior band (or null). Returns pt(u, k) with k in [-1 dorsal, 1 ventral].
function segBody(f, ctl, hw, n, look, o = {}) {
  const C = spline(ctl, 3), S = arcLen(C), Lt = S[S.length - 1], vs = o.vs ?? 1, wrap = o.wrap ?? 0.62, st = 8;
  const pt = (u, k) => { const A = at(C, S, Math.max(0, Math.min(1, u)) * Lt); return add(A.p, mul(A.n, vs * k * hw(Math.max(0, Math.min(1, u))))); };
  const ov = (o.ov ?? 0.3) / n, segU = o.segU || (i => [i / n, (i + 1) / n]);
  const order = []; for (let i = n - 1; i >= 0; i--) order.push(i);
  for (const i of order) {
    const [u0, u1] = segU(i), U = q => u0 + (u1 + ov - u0) * q / st;
    if (o.bone) f.bone(o.bone(i));
    if (o.sternite !== false) { const sn = []; for (let q = 0; q <= st; q++) sn.push(pt(U(q), wrap - 0.1)); for (let q = st; q >= 0; q--) sn.push(pt(U(q) - 0.2 / n, 1)); f.part(sn, Object.assign({}, look, { fill: o.sternCol || mix(look.fill, P.grey, 0.25), cast: false, inkW: 1.1, inkHeavy: 1.8 })); f.line([pt(u1, wrap), pt(u1 + ov * 0.3, 0.98)], 1.2, INK, { op: 0.6 }); }
    const tg = []; for (let q = 0; q <= st; q++) tg.push(pt(U(q), -1)); tg.push(pt(u1 + ov * 1.05, -0.4)); for (let q = st; q >= 0; q--) tg.push(pt(U(q), wrap));
    const lk = Object.assign({}, look, o.look ? o.look(i) : {});
    f.part(tg, Object.assign({ k: 0.9 }, lk));
    clipDraw(f, tg, () => {
      if (o.band && o.band(i)) { const bt = o.bandT ?? 0.45, bu = u0 + (u1 + ov - u0) * bt, b = []; for (let q = 0; q <= 6; q++) b.push(pt(bu + (u1 + ov - bu) * q / 6 + (q % 2 ? 0.04 / n : 0), -1.3)); for (let q = 6; q >= 0; q--) b.push(pt(bu + (u1 + ov - bu) * q / 6, 1.2)); b.push(pt(bu - 0.18 / n, -0.35)); f.part(b, Object.assign({}, VN(f), { fill: o.band(i), inkW: 0.9, inkHeavy: 1.2, cast: false })); }
      const rim = []; for (let q = 0; q <= 4; q++) rim.push(pt(u1 + ov * (0.35 + q * 0.17), -1.3 + q * 0.6)); for (let q = 4; q >= 0; q--) rim.push(pt(u1 + ov * 1.4, -1.3 + q * 0.6));
      f.flat(rim, '#000', { op: 0.45 });
      f.line([pt(u1 + ov * 0.3, -0.98), pt(u1 + ov * 0.32, -0.4), pt(u1 + ov * 0.3, wrap - 0.05)], 1.4, mix(lk.light || P.chitP, '#fff', 0.2), { op: 0.5 }); // lit lip of the rim
      f.flat([pt(u0, -1.3), pt(u0 + 0.22 / n, -1.3), pt(u0 + 0.22 / n, 1), pt(u0, 1)], '#000', { op: 0.35 }); // under the plate in front
      if (o.deco) o.deco(i, u0, u1, pt);
    });
    f.line([pt(u0 + 0.1 / n, -0.82), pt((u0 + u1) / 2, -0.88), pt(u1, -0.8)], 1.6, mix(lk.light || P.chitP, '#fff', 0.35), { op: 0.55 }); // sheen along the dorsal curve
  }
  return pt;
}
// a mandible: a curved toothed blade from base b heading a (closing toward +n if cl = 1), length L, root width w
function mandible(f, b, a, L, w, look, cl = 1) {
  const F = frame(b, a, 1), Y = y => y * cl;
  const pts = F([[-w * 0.3, Y(-w * 0.5)], [L * 0.4, Y(-w * 0.55)], [L * 0.8, Y(-w * 0.2)], [L, Y(w * 0.25), 1], [L * 0.86, Y(w * 0.22)], [L * 0.78, Y(w * 0.36), 1], [L * 0.66, Y(w * 0.28)], [L * 0.56, Y(w * 0.42), 1], [L * 0.44, Y(w * 0.36)], [L * 0.3, Y(w * 0.5), 1], [L * 0.1, Y(w * 0.5)], [-w * 0.3, Y(w * 0.45)]]);
  f.part(pts, Object.assign({ k: 0.85 }, look, { cast: false }));
  f.line(F([[0, Y(-w * 0.2)], [L * 0.5, Y(-w * 0.28)], [L * 0.85, Y(0)]]), 1.2, look.light || '#888', { op: 0.6 });
  f.flat(F([[L * 0.7, Y(-w * 0.1)], [L, Y(w * 0.25)], [L * 0.8, Y(w * 0.2)]]), '#0a090c', { op: 0.7 });
  return F([[L, Y(w * 0.25)]])[0];
}

// a furred mass: the shape, then clumped directional locks inside it (lit and dark), then tapered locks along the edge
// that break the outline. o.flow(p) -> lock angle at p; o.len lock length; o.edge: step along the edge between locks
// (0 = none); o.skip(p): no edge lock here (where the mass meets another part); o.matted(p): a darker, clumped lock.
function furMass(f, pts, look, o = {}) {
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const bb = E.bbox(pts), L = o.len || 12, flow = o.flow || (() => Math.PI * 0.75), lt = o.lt || mix(look.fill, '#e8e2f0', 0.3), dk = o.dk || mix(look.fill, '#000', 0.55);
  clipDraw(f, pts, () => {
    if (o.under) o.under();
    for (let y = bb[1]; y < bb[3]; y += L * 0.5) for (let x = bb[0]; x < bb[2]; x += L * 0.55) {
      const p = [x + (f.r() - 0.5) * L * 0.6, y + (f.r() - 0.5) * L * 0.5], a = flow(p) + (f.r() - 0.5) * 0.45, l = L * R(f, 0.7, 1.25), bendA = (f.r() - 0.5) * 0.5;
      const q = [p, add(p, rot([l * 0.5, 0], a + bendA)), add(p, rot([l, 0], a + bendA * 2))];
      const lit = f.r() < (o.litShare ?? 0.45);
      const tc = o.tint && o.tint(p);
      f.stroke(q, R(f, 1.6, 3.2) * (o.w ?? 1), tc ? (lit ? mix(tc, '#fff', 0.25) : mix(tc, '#000', 0.4)) : lit ? lt : dk, { op: lit ? 0.5 : 0.6 });
    }
    if (o.inner) o.inner();
  });
  if (o.edge) {
    const C = spline([...pts, pts[0]], 2), S = arcLen(C), Lt = S[S.length - 1], cen = pts.reduce((a, p) => add(a, mul(p, 1 / pts.length)), [0, 0]);
    for (let u = 0; u < Lt; u += o.edge * R(f, 0.7, 1.3)) {
      const A = at(C, S, u), p = A.p; if (o.skip && o.skip(p)) continue;
      const out = E.norm(sub(p, cen)), fa = flow(p), fd = dir(fa), d = E.norm(add(mul(out, 0.7), mul(fd, 1.0))), l = L * R(f, 0.55, 1.05), w = L * R(f, 0.14, 0.24);
      const nn = [-d[1], d[0]], cv = (f.r() - 0.3) * w * 2.2, b0 = add(p, mul(nn, w)), b1 = add(p, mul(nn, -w)), tip = add(add(p, mul(d, l)), mul(nn, cv)), mid = add(lerp(p, tip, 0.55), mul(nn, cv * 0.6 + w * 0.3));
      const tc = o.tint && o.tint(p), col = o.matted && o.matted(p) ? dk : tc || look.fill;
      f.flat([add(b0, mul(d, -w)), b0, mid, tip, b1, add(b1, mul(d, -w))], col);
      f.line([b0, mid, tip], 1, INK, { op: 0.75 }); f.line([tip, b1], 0.9, INK, { op: 0.5 });
      if (f.r() < 0.5) f.line([lerp(p, mid, 0.3), lerp(mid, tip, 0.6)], 0.9, lt, { op: 0.6 });
    }
  }
}

module.exports = {
  furMass, P, base, textures, texturesX, R, scatter, ang, elb, pd, dir, CH, VN, MEM, PAP, SKX, CLK,
  glow, glowLine, lichtenberg, bolt, sparks, standingHair, scorch, fusedRun, burn, skinBurn, stat,
  pustule, pustules, mould, cordyceps, hole, grub, silk, ceye, antenna, ileg, iwing, cellWing, segBody, mandible,
  livid, veins, peel, drip, rope, sagRope, chainLinks, spline, arcLen, at, clipDraw, lumpy, ribbon,
  fullLeg, armRig, legTube, bootRig, humanJoints, ik, tube, prune, openHand,
  shiftFig, mlimb, crabSeg, dactyl, split, side,
};
