// Card compositions. One composition per card kind, driven by card data (course, target, calling, path), with
// per-card overrides in OVR. card(id) returns the full 1120 x 612 SVG.
'use strict';
const fs = require('fs');
const K = require('./card_kit');
const OB = require('./objects');
const { E, W, H, INK, COURSE, INK6, BLOOD, BLOOD_L, BONE, PAPER, D } = K;
const { add, sub, mul, lerp, rot, mix, rng, norm, len, ell } = E;

const CARDS = JSON.parse(fs.readFileSync('/home/claude/ostium/data/cards.json', 'utf8'));
const SAMPLES = ['bw_mace_blow', 'du_two_step', 'el_ink_bolt', 'bw_brace', 'al_plague_flask', 'or_stolen_hour', 'silver_lie', 'el_strike_the_ring'];

// ==== data rules
const ATTUNED = 'water';   // attuned cards show the Elementalist's ink in this course unless overridden
const ROOM_BY_COURSE = { physical: 'stair', water: 'brine_grotto', void: 'throne', toxin: 'mire_hut', fire: 'pyre_nave', frost: 'fleet_ice', lightning: 'foundry_floor', attuned: 'nave' };
const ROOM_BY_WORLD = { world_drowned: 'nave', world_mire: 'mire_bog', world_baths: 'baths_pool', world_pits: 'pits_shaft', world_foundry: 'foundry_floor', world_coast: 'coast_cliffs', world_fleet: 'fleet_deck', world_rime: 'rime_hall', world_barrow: 'barrow_hall', world_hive: 'hive_comb', world_spire: 'spire_orrery', world_silence: 'silence_shrine', world_pyre: 'pyre_nave', world_garden: 'garden_walk', world_sky: 'sky_ruins' };
const HERO = {
  bulwark: ['dirAC', 'bulwark'], duelist: ['dirAC', 'duelist'], elementalist: ['dirAC', 'elementalist_%c', 'signs'],
  alchemist: ['dirAC2', 'alchemist'], oracle: ['dirAC2', 'oracle'], hexweaver: ['dirAC2', 'hexweaver'], vessel: ['worlds/hero_vessel', 'vessel'],
};
const PATHS = { A: require('../worlds/hero_paths_A').heroes.map(h => h.key), B: require('../worlds/hero_paths_B').heroes.map(h => h.key) };
const courseOf = (card, o = {}) => o.course || (card.cat === 'attuned' ? ATTUNED : card.cat) || 'physical';
const types = card => new Set((card.fx || []).map(x => x.t));
// kind decides hero or object: attacks, blocks and casts get the hero; the rest get a device
function kindOf(card) {
  const t = types(card), kw = card.kw || [];
  if (card.rarity === 'Curse' || kw.includes('Affliction')) return 'curse';
  if (kw.includes('Flask') || (card.cls === 'alchemist' && (t.has('apply') || t.has('brew')))) return 'flask';
  if (kw.includes('Rite')) return 'rite';
  if (t.has('dmg') && /enem/.test(card.target)) return card.cls === 'elementalist' || card.cat !== 'physical' ? 'cast' : 'attack';
  if (t.has('block') || t.has('guard') || t.has('ward') || t.has('armor')) return 'block';
  return 'device';
}
// the hero figure for a card: the path variant when the card belongs to one path, else the calling's base figure
function heroOf(card, course) {
  const arch = (card.arch || '').split('+')[0], key = `${card.cls}_${arch}`;
  if (PATHS.A.includes(key)) return ['worlds/hero_paths_A', key];
  if (PATHS.B.includes(key)) return ['worlds/hero_paths_B', key];
  const h = HERO[card.cls]; if (!h) return null;
  return [h[0], h[1].replace('%c', course === 'physical' ? 'fire' : course), h[2]];
}
const roomOf = (card, course) => ROOM_BY_WORLD[card.cls] || ROOM_BY_COURSE[card.cat] || ROOM_BY_COURSE[course];

// ==== shared composition pieces
const FOE_FILTER = c => `<filter id="kFoe" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.35"/><feComponentTransfer><feFuncR type="linear" slope="0.42"/><feFuncG type="linear" slope="0.42"/><feFuncB type="linear" slope="0.47"/></feComponentTransfer></filter>`;
// a foe fragment (default the Drowned Thrall) at the frame edge, darkened so the hero reads first
function foe(pose, anchorJoint, to, s, o = {}) {
  const t = K.hero(o.mod || 'dirAC2', o.key || 'thrall', pose, 'heroes', o);
  const A = t.joint(anchorJoint);
  return { t, svg: K.place(t.body, A, to, s, { filter: 'url(#kFoe)' }), defs: t.defs, M: p => K.mapPt(p, A, to, s) };
}
function placeHero(spec) {
  const h = K.hero(spec.hero[0], spec.hero[1], spec.pose, spec.hero[2] || 'heroes', { hide: spec.hide });
  const A = h.joint(spec.anchor || 'head');
  return { h, svg: K.place(h.body, A, spec.at, spec.scale), defs: h.defs, M: p => K.mapPt(p, A, spec.at, spec.scale), J: n => K.mapPt(h.joint(n), A, spec.at, spec.scale) };
}
// the swing: a dry-brush arc trailing a weapon head round a pivot, heavy at the head, dry and split at its tail
function swing(r, piv, head, sweep, w, o = {}) {
  const R = len(sub(head, piv)), a1 = Math.atan2(head[1] - piv[1], head[0] - piv[0]), a0 = a1 - sweep * Math.PI / 180;
  const pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + (a1 - a0) * i / 12, rr = R * (o.spiral ? 1 - o.spiral * (1 - i / 12) : 1); pts.push(add(piv, [Math.cos(a) * rr, Math.sin(a) * rr])); }
  let s = K.drybrush(r, pts, w, o.col || INK, { profile: t => 0.12 + 0.88 * Math.pow(t, 1.6) * (t > 0.93 ? (1 - t) * 14 : 1), dry: 1, bodyLen: 0.0, body: false, op: o.op ?? 0.8, ragStart: 0, bristles: o.bristles || 16 });
  const inner = pts.map(p => add(piv, mul(sub(p, piv), 0.78)));
  s += K.motionHatch(r, inner, w * 0.9, o.col || INK, { lw: 2.2, op: 0.7 });
  return s;
}

// ==== hero rigs per calling and kind
// Pose (bone rotations for card_figure-style posing), placement (anchor joint `head` lands on `at`, at `scale`) and
// the points the FX hang on, in figure px on a named bone. Tuned by eye with posepeek.js. A calling or kind with no
// entry falls back to DEFAULT_RIG, which gives a usable but plain card until someone tunes it.
const RIG = {
  bulwark: {
    attack: { style: 'swing', pose: { upperarm_n: -160, forearm_n: 40, hand_n: 160, torso: 10, upperarm_f: -10, lean: 4 }, at: [330, 372], scale: 1.22, weapon: ['mace', [500, 236]], pivot: 'upperarm_n', sweep: 85 },
    block: { pose: { torso: 4, head: 4, lean: -2, upperarm_f: -2 }, at: [380, 352], scale: 1.42, face: ['door', [526, 330]] },
  },
  duelist: {
    attack: { style: 'cuts', pose: { upperarm_n: -35, forearm_n: -5, hand_n: -10, torso: 6, lean: 6, head: -6, cape: -10 }, at: [300, 236], scale: 1.2, weapon: ['rapier', [588, 518]], off: ['dagger', null] },
  },
  elementalist: {
    cast: { pose: { upperarm_n: -60, forearm_n: 110, hand_n: -30, torso: -4, head: -10 }, hide: ['sign'], at: [262, 300], scale: 1.32, hand: ['hand_n', [394, 296]] },
  },
};
const DEFAULT_RIG = { attack: { style: 'cuts', pose: {}, at: [330, 300], scale: 1.2 }, cast: { pose: {}, at: [300, 300], scale: 1.25 }, block: { pose: {}, at: [380, 330], scale: 1.35 } };
const rigOf = (cls, kind) => Object.assign({}, DEFAULT_RIG[kind], (RIG[cls] || {})[kind] || {});
const seedOf = id => { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 1000 + (h % 8000); };
const handPt = (P, R) => R.hand ? P.M(P.h.at(R.hand[0], R.hand[1])) : P.J('hand_n');
const weaponPt = (P, R) => R.weapon ? P.M(P.h.at(R.weapon[0], R.weapon[1])) : handPt(P, R);

// ==== hero compositions (attack, cast, block)
// ATTACK, swing style: the weapon comes round in a dry-brush arc onto a foe's head at the frame's right; ink smash,
// blood, bone chips. Cuts style: thrust and cut marks laid on a foe's chest, one cut per hit (fx times).
function attack(card, id, o = {}) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), R = Object.assign(rigOf(card.cls, 'attack'), o.rig || {});
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const room = o.room || roomOf(card, course);
  const hits = Math.max(1, ...(card.fx || []).map(x => x.times || 1));
  if ((o.style || R.style) === 'swing') {
    const head = weaponPt(P, R), piv = R.pivot ? P.J(R.pivot) : P.J('torso');
    const T = foe({ head: 18, torso: 8, lean: 4 }, 'head', [head[0] + 95, head[1] + 128], R.scale, { hide: ['boat_hook'] });
    const hit = add(head, [20, 30]);
    let body = K.ground(r, Object.assign({ room, x: 820, w: 1450, c, pool: [hit[0] - 120, hit[1] + 120, 420, 260], dark: 0.3 }, o.ground || {}));
    body += swing(r, piv, head, R.sweep || 80, 70, { op: 0.9 });
    body += T.svg + P.svg;
    body += K.impact(r, hit, 70, INK, { rays: 7, a0: -1.4, fan: 0.8, splat: { dir: [1, 0.35], spread: 1.6 } });
    body += K.splatter(r, add(hit, [30, 30]), 130, BLOOD, { dir: [1, 0.6], spread: 1.0, n: 22, blotR: 0.12, op: 0.9 });
    body += chips(r, hit, 120, [1, -0.3]);
    return { course: c, defs: P.defs + T.defs + FOE_FILTER(c), body };
  }
  // cuts
  const tip = weaponPt(P, R);
  const T = foe({ torso: -4, head: -6 }, 'torso', [tip[0] + 150, 560], 1.25, { hide: ['boat_hook'] });
  const X = add(tip, o.cutAt || [110, 40]);
  let body = K.ground(r, Object.assign({ room, x: 400, w: 1500, c, pool: [X[0] - 180, X[1] - 40, 430, 280], dark: 0.3 }, o.ground || {}));
  body += T.svg;
  // the cuts: a long falling slash and shorter ones that cross it off-centre; blood opens along each and runs
  const CUTS = [[[-80, -150], [-10, -60], [40, 40], [70, 120]], [[-110, 60], [-20, 10], [80, -20]], [[-60, 120], [10, 90], [90, 60]]].slice(0, Math.min(3, hits));
  const cuts = CUTS.map(cu => cu.map(q => add(X, q)));
  cuts.forEach((cu, k) => { body += K.drybrush(r, cu.map(q => add(q, [5, 7])), 22 - k * 4, '#460b07', { dry: 0.5, op: 0.85, bodyLen: 0.6, bristles: 9 }); });
  for (let i = 0; i < 7; i++) { const P2 = K.catmull(cuts[i % cuts.length], 6), q = P2[3 + (i % 4) * 3] || X, L = 24 + r() * 60; body += K.drybrush(r, [add(q, [4, 8]), add(q, [6, 8 + L * 0.5]), add(q, [4, 8 + L])], 6, '#460b07', { dry: 0.2, op: 0.85, bristles: 3, profile: t => 1 - t * 0.6 }); }
  cuts.forEach((cu, k) => { body += K.slash(r, cu, 26 - k * 6); });
  body += K.splatter(r, add(X, [50, -20]), 130, BLOOD, { dir: [1, -0.3], spread: 1.4, n: 18, blotR: 0.05, op: 0.85 });
  body += P.svg;
  // the blade's path: hatched motion along the thrust, and round from the off hand when there is one
  body += K.drybrush(r, [add(tip, [-300, 40]), add(tip, [-150, 26]), add(tip, [-20, 16])], 16, INK, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.55, bristles: 7 });
  if (R.off && P.h.J[R.off[0]]) { const dag = P.M(P.h.at(R.off[0], [P.h.J[R.off[0]].pivot[0], P.h.J[R.off[0]].pivot[1] - 90])); body += K.motionHatch(r, [add(dag, [-40, -30]), add(dag, [80, -80]), add(X, [-60, -140])], 30, INK, { lw: 2, op: 0.6 }); }
  return { course: c, defs: P.defs + T.defs + FOE_FILTER(c), body };
}
// bone and tooth chips flung from an impact: little inked shards with a lit face
function chips(r, c, R, dir, col = BONE) {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 2.2, d = R * (0.4 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = 3 + r() * 5;
    const q = [add(p, rot([z, 0], a)), add(p, rot([-z * 0.4, z * 0.6], a)), add(p, rot([-z * 0.7, -z * 0.3], a))];
    s += `<path d="${K.polyD(q)}" fill="${mix(col, '#6a5a44', 0.3 + r() * 0.5)}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  }
  return `<g filter="url(#kWob)">${s}</g>`;
}

// CAST: a bead of the course's ink flung from the hand in an arc onto a foe's chest at the frame's right edge
function cast(card, id, o = {}) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), ink = mix(INK6[course] || INK, '#0c0a10', 0.55), R = Object.assign(rigOf(card.cls, 'cast'), o.rig || {});
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const tipF = handPt(P, R);
  const T = foe({ torso: 8, head: 10, lean: 3 }, 'torso', [1010, 610], 1.2, { hide: ['boat_hook'] });
  const hitP = T.M(T.t.at('torso', [300, 380]));
  let body = K.ground(r, Object.assign({ room: o.room || roomOf(card, course), x: 700, w: 1500, c, pool: [560, 270, 470, 260], dark: 0.3 }, o.ground || {}));
  body += T.svg;
  const mid = [660, tipF[1] - 50], path = [tipF, lerp(tipF, mid, 0.5), mid, lerp(mid, hitP, 0.55), hitP];
  const PP = K.catmull(path, 10), bead = PP[Math.round(PP.length * 0.56)];
  // the trail: thin where it left the finger, a dry split body, the bead ahead of it
  body += K.drybrush(r, K.catmull(path, 3).filter(q => q[0] < bead[0] - 10), 30, ink, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.85, bristles: 12 });
  body += K.motionHatch(r, K.catmull(path, 3).filter(q => q[0] < bead[0] - 30).map(q => add(q, [0, 26])), 26, INK, { lw: 2, op: 0.6 });
  body += P.svg;
  body += beadDrop(r, bead, norm(sub(PP[Math.round(PP.length * 0.56) + 2], bead)), 21, ink);
  body += K.splatter(r, hitP, 120, ink, { dir: [1, -0.1], spread: 2.6, n: 30, blotR: 0.3 });
  for (let i = 0; i < 9; i++) { const q = K.catmull(path, 6)[Math.round(r() * 12) + 2]; body += `<circle cx="${(q[0] + (r() - 0.5) * 30).toFixed(1)}" cy="${(q[1] + 12 + r() * 30).toFixed(1)}" r="${(1.5 + r() * 3).toFixed(1)}" fill="${ink}"/>`; }
  return { course: c, defs: P.defs + T.defs + FOE_FILTER(c), body };
}
// a flung drop of ink: a round head with a drawn-out tail, inked, with a lit fleck and a dark lower side
function beadDrop(r, p, dir, rad, col) {
  const d = norm(dir), n = [-d[1], d[0]], tail = add(p, mul(d, -rad * 3.2));
  const pts = [tail, add(add(p, mul(n, rad)), mul(d, -rad * 0.2)), add(p, mul(d, rad)), add(add(p, mul(n, -rad)), mul(d, -rad * 0.2))];
  return `<g filter="url(#kRag)"><path d="${K.pathD(pts, true)}" fill="${mix(col, '#000', 0.3)}" stroke="${INK}" stroke-width="${Math.max(1.2, rad * 0.14)}"/>`
    + (rad > 8 ? `<path d="${K.pathD([add(p, [-rad * 0.5, -rad * 0.5]), add(p, [-rad * 0.1, -rad * 0.7]), add(p, [-rad * 0.3, -rad * 0.2])], true)}" fill="${mix(col, '#fff', 0.55)}" opacity="0.8"/><path d="${K.pathD([add(p, [rad * 0.6, rad * 0.2]), add(p, [0, rad * 0.85]), add(p, [-rad * 0.55, rad * 0.4]), add(p, [0, rad * 0.5])], true)}" fill="#000" opacity="0.45"/>` : '') + '</g>';
}

// BLOCK: the hero set behind the guard, a foe's weapon biting it from the right; pressure lines, splinters, dust
function block(card, id, o = {}) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), R = Object.assign(rigOf(card.cls, 'block'), o.rig || {});
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const T = foe({ lean: 9, torso: 6, upperarm_n: -14 }, 'head', [1010, 250], 1.3);
  const hit = R.face ? P.M(P.h.at(R.face[0], R.face[1])) : add(P.J('hand_n'), [60, 0]);
  let body = K.ground(r, Object.assign({ room: o.room || roomOf(card, course), x: 1200, w: 1500, c, pool: [500, 260, 450, 280], dark: 0.3 }, o.ground || {}));
  body += T.svg;
  for (let i = 0; i < 4; i++) { const y = hit[1] - 120 + i * 85 + (r() - 0.5) * 20; body += K.motionHatch(r, [[hit[0] + 320, y + 30], [hit[0] + 170, y + 10], [hit[0] + 30, y]], 30, INK, { lw: 2.3, op: 0.7, slant: 0.35 }); }
  body += P.svg;
  body += K.impact(r, add(hit, [8, 0]), 54, INK, { rays: 6, a0: 1.9, fan: 0.45, core: false, splat: { dir: [-0.2, -1], spread: 2.6 } });
  body += splinters(r, add(hit, [10, -10]), 110, [0.6, -1]);
  body += grit(r, [hit[0] - 150, 600], 260);
  return { course: c, defs: P.defs + T.defs + FOE_FILTER(c), body };
}
// oak splinters thrown off a struck plank edge
function splinters(r, c, R, dir) {
  let s = '';
  for (let i = 0; i < 8; i++) {
    const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 1.8, d = R * (0.3 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), l = 8 + r() * 16, b = a + (r() - 0.5) * 1.5;
    const q = [add(p, rot([l, 0], b)), add(p, rot([0, 2.5], b)), add(p, rot([-l * 0.6, 0], b)), add(p, rot([0, -2], b))];
    s += `<path d="${K.polyD(q)}" fill="${mix('#7a5a3a', '#c8a070', r() * 0.6)}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  }
  return `<g filter="url(#kWob)">${s}</g>`;
}
// dust and grit kicked up along the bottom edge: dry low strokes and flung specks
function grit(r, c, w) {
  let s = '';
  for (let i = 0; i < 5; i++) { const y = c[1] - r() * 40, x = c[0] + (r() - 0.5) * w; s += K.drybrush(r, [[x - 90, y + 10], [x, y - 12], [x + 90, y]], 26, mix('#6a5a44', '#c8b48a', r() * 0.5), { dry: 1, op: 0.55, body: false, bristles: 10 }); }
  for (let i = 0; i < 40; i++) { const p = add(c, [(r() - 0.5) * w * 1.3, -r() * 80]); s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(0.8 + r() * 2).toFixed(1)}" fill="${INK}" opacity="${(0.4 + r() * 0.5).toFixed(2)}"/>`; }
  return s;
}

// ==== devices
const ART = {};   // hand-made device compositions per card id
// an object card: ground, FX behind, the object drawn as a Fig at figure scale, FX in front
function device(spec) {
  const c = COURSE[spec.course], r = rng(spec.seed);
  const f = K.objFig(spec.seed);
  const pts = spec.build(f);
  const fs2 = K.figSVG(f), M = p => K.mapPt(p, [0, 0], spec.at, spec.scale);
  let body = K.ground(r, Object.assign({ c }, spec.ground));
  if (spec.back) body += spec.back(r, M, pts);
  let mask = '';
  if (pts.holes) { mask = `<mask id="kHoles" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000"><rect x="-2000" y="-2000" width="4000" height="4000" fill="#fff"/>${pts.holes.map(h => `<path d="${K.pathD(ell(h.c, h.rx, h.ry, h.ang || 0, 24), true)}" fill="#000"/>`).join('')}</mask>`; }
  body += K.place((mask ? `<defs>${mask}</defs>` : '') + `<g${mask ? ' mask="url(#kHoles)"' : ''}>${fs2.body}</g>`, [0, 0], spec.at, spec.scale);
  if (spec.front) body += spec.front(r, M, pts);
  return { course: c, defs: fs2.defs + (spec.defs || ''), body };
}
// a curl of gas or smoke: a dry-brush stroke that drifts and turns over at its end
function curl(r, p0, dir, L, w, col, o = {}) {
  const d = norm(dir), n = [-d[1], d[0]] , s = o.turn ?? 1;
  const pts = [p0, add(p0, add(mul(d, L * 0.35), mul(n, s * L * 0.08))), add(p0, add(mul(d, L * 0.7), mul(n, -s * L * 0.02))), add(p0, add(mul(d, L * 0.92), mul(n, -s * L * 0.16))), add(p0, add(mul(d, L * 0.8), mul(n, -s * L * 0.3))), add(p0, add(mul(d, L * 0.66), mul(n, -s * L * 0.22)))];
  return K.drybrush(r, pts, w, col, { profile: t => 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.1)), dry: 0.9, op: o.op ?? 0.75, bodyLen: 0.3, bristles: o.bristles || 12 });
}

// PLAGUE FLASK: a green flask bursts on a lamprey and a sick mist drifts over the foes on either side.
ART.al_plague_flask = (card) => {
  const course = courseOf(card);
  return device({
    course, seed: 2101, at: [548, 352], scale: 1.0, ground: { room: 'brine_grotto', x: 1100, w: 1500, pool: [560, 300, 440, 270], dark: 0.3 },
    build: f => OB.flask(f, { ang: -0.22 }),
    back: (r, M, p) => {
      // the sick mist rolling out low to the foes on either side: dry, hatched drifts and a few small billows
      let s = '';
      for (const [x, y, dx] of [[420, 520, -1], [380, 560, -1], [700, 520, 1], [740, 565, 1], [470, 480, -1], [660, 485, 1]]) s += K.drybrush(r, [[x, y], [x + dx * 140, y - 12 + (r() - 0.5) * 20], [x + dx * 300, y + 6]], 40, '#5e6848', { profile: t => 0.3 + 0.7 * Math.sin(Math.PI * t), dry: 1, body: false, op: 0.6, bristles: 16 });
      for (const [x, y, w, h] of [[250, 505, 80, 28], [880, 500, 90, 30], [150, 545, 70, 24], [990, 545, 80, 26]]) s += K.billow(r, [x, y], w, h, '#68705a', { op: 0.6, lw: 4 });
      return s;
    },
    front: (r, M, p) => {
      const m = M(p.mouth);
      let s = '';
      // the burst: gas jetting out of the split and turning over as it climbs, brew spat out with it
      for (const [dx, dy, w, h] of [[34, -8, 30, 20], [80, -40, 44, 28], [140, -86, 58, 36], [205, -132, 68, 40]]) s += K.billow(r, add(m, [dx, dy]), w, h, '#727a5a', { op: 0.7, lw: 4 });
      s += K.splatter(r, add(m, [20, 10]), 120, '#4a5a22', { dir: [1, 0.3], spread: 1.4, n: 18, blotR: 0.1 });
      for (let i = 0; i < 5; i++) s += beadDrop(r, add(m, [60 + r() * 130, 10 + r() * 80]), [1, 0.2 + r() * 0.5], 4 + r() * 5, '#7a8a3a');
      s += shards(r, add(m, [20, 0]), 150, [1, -0.2], '#a8b888');
      // spores drifting up out of the mist
      for (let i = 0; i < 30; i++) { const q = [220 + r() * 700, 300 + r() * 220]; s += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(1 + r() * 2).toFixed(1)}" fill="${r() < 0.5 ? '#c8c890' : '#22220e'}" opacity="0.7"/>`; }
      return s;
    },
  });
};
// glass shards: thin inked slivers with a lit edge
function shards(r, c, R, dir, col) {
  let s = '';
  for (let i = 0; i < 8; i++) {
    const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 2, d = R * (0.3 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = 6 + r() * 12, b = r() * 6;
    const q = [add(p, rot([z, 0], b)), add(p, rot([-z * 0.3, z * 0.35], b)), add(p, rot([-z * 0.8, -z * 0.1], b))];
    s += `<path d="${K.polyD(q)}" fill="${col}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round" opacity="0.9"/><path d="M${q[0][0].toFixed(1)},${q[0][1].toFixed(1)}L${q[2][0].toFixed(1)},${q[2][1].toFixed(1)}" stroke="#f4f4e4" stroke-width="1" opacity="0.8"/>`;
  }
  return `<g filter="url(#kWob)">${s}</g>`;
}

// STOLEN HOUR: stars peel off the Oracle's robe and become grains in the hourglass.
ART.or_stolen_hour = (card) => {
  const course = courseOf(card);
  let scrapPts;
  return device({
    course, seed: 2202, at: [560, 330], scale: 1.0, ground: { room: 'spire_orrery', x: 700, w: 1600, pool: [560, 290, 400, 280], dark: 0.3 },
    build: f => { const p = OB.hourglass(f, { ang: -0.1 }); scrapPts = OB.robeScrap(f, add(p.capL, [6, -30]), -0.1); return Object.assign(p, scrapPts); },
    back: (r, M, p) => {
      // the orrery's rings behind, broken and hatched, not compass-perfect
      let s = '';
      for (const [rx, ry, a0, a1] of [[330, 150, 190, 350], [400, 190, 200, 330], [360, 120, 10, 160]]) s += K.motionHatch(r, K.arc([560, 300], rx, ry, a0, a1, 18, -0.25), 22, INK, { lw: 1.8, op: 0.5, grow: false, step: 11 });
      return s;
    },
    front: (r, M, p) => {
      // the stars coming loose from the fray as grains: pale specks with short dry trails, falling round to the glass
      let s = '';
      const fr = M(p.fray), heap = M(p.neck);
      for (let i = 0; i < 22; i++) {
        const t = i / 21, q = add(lerp(fr, add(heap, [-40, -60]), t), [Math.sin(t * 5) * 40 + (r() - 0.5) * 30, (r() - 0.5) * 30]);
        const sz = 3.4 - t * 1.6;
        s += K.drybrush(r, [add(q, [-10 - r() * 10, -18]), add(q, [-4, -8]), q], 5, '#cfc6d8', { profile: u => u, dry: 1, body: false, op: 0.5, bristles: 3 });
        s += `<path d="${K.pathD(K.blob(r, q, sz, 6, 0.6), true)}" fill="#efe8d8" stroke="${INK}" stroke-width="0.9"/>`;
      }
      return `<g filter="url(#kWob)">${s}</g>`;
    },
  });
};

// SILVER LIE: the cracked glass is held up and a foe's guard slides into it.
ART.silver_lie = (card) => {
  const course = courseOf(card);
  let sp;
  return device({
    course, seed: 2303, at: [690, 262], scale: 0.92, ground: { room: 'throne', x: 900, w: 1500, pool: [560, 280, 460, 270], dark: 0.32 },
    build: f => { sp = OB.shield(f, { at: [-500, 20], ang: 0.12, s: 1.05, bites: [[70, -40, 26], [40, 40, 18], [88, 30, 14], [-10, -80, 10]] }); const m = OB.mirror(f, { ang: -0.2 }); m.sr = sp.right; return m; },
    back: (r, M, p) => {
      // what the bites took, streaming into the glass: oak and paint flakes, hatched motion, a dry pull of ink
      const a = M(p.sr), g = M(p.glass); let s = '';
      s += K.motionHatch(r, [add(a, [-10, -60]), lerp(a, g, 0.5), add(g, [-110, -70])], 40, INK, { lw: 2.2, op: 0.7 });
      s += K.motionHatch(r, [add(a, [-10, 60]), add(lerp(a, g, 0.5), [0, 70]), add(g, [-110, 40])], 34, INK, { lw: 2, op: 0.6 });
      s += K.drybrush(r, [a, lerp(a, g, 0.45), add(g, [-120, -10])], 54, '#2a2234', { profile: t => 0.9 - 0.7 * t, dry: 1, body: false, op: 0.5, bristles: 14 });
      for (let i = 0; i < 34; i++) { const t = Math.pow(r(), 0.8), q = add(lerp(a, add(g, [-120, 0]), t), [(r() - 0.5) * 30, (r() - 0.5) * 140 * (1 - t * 0.6)]), z = (3 + r() * 9) * (1 - t * 0.5), b = r() * 6; s += `<path d="${K.polyD([add(q, rot([z, 0], b)), add(q, rot([-z * 0.5, z * 0.6], b)), add(q, rot([-z * 0.6, -z * 0.4], b))])}" fill="${r() < 0.6 ? '#6a5236' : '#4a6470'}" stroke="${INK}" stroke-width="1.2" opacity="${(1 - t * 0.5).toFixed(2)}"/>`; }
      return `<g filter="url(#kWob)">${s}</g>`;
    },
  });
};

// STRIKE THE RING: a foe painted in five colours rings like struck bronze as the Prismatic's stroke lands.
ART.el_strike_the_ring = (card) => {
  return device({
    course: 'physical', seed: 2404, at: [500, 330], scale: 0.98, ground: { room: 'belfry', x: 800, w: 1500, pool: [500, 280, 420, 280], dark: 0.3, shaft: [180, 140, 520, 220] },
    build: f => OB.bell(f, { ang: 0.06 }),
    back: (r, M, p) => {
      // the ring: broken hatched arcs shaking out from the bronze, uneven, offset, drying out as they go
      const c = M(p.body); let s = '';
      for (const [k, R] of [[0, 270], [1, 330], [2, 395]]) for (const [a0, a1] of [[-70, 40], [140, 250]]) s += K.motionHatch(r, K.arc(c, R + r() * 20, R * 0.92, a0 + r() * 10, a1 - r() * 10, 16), 40 - k * 8, INK, { lw: 3 - k * 0.5, op: 0.9 - k * 0.15, grow: false, slant: 0.2, step: 9 + k * 2, skip: 0.1 });
      return s;
    },
    front: (r, M, p) => {
      let s = '';
      // the target's spectrum daubed on the bronze by a scribe's brush: five short loaded strokes
      const b = M(p.body), five = ['fire', 'lightning', 'toxin', 'water', 'void'];
      five.forEach((k, i) => { const q = add(b, [-120 + i * 52 + (r() - 0.5) * 12, 30 - Math.abs(i - 2) * 16 + (r() - 0.5) * 14]); s += K.drybrush(r, [add(q, [-26, 18]), q, add(q, [22, -22])], 26, mix(INK6[k], '#3a2a1a', 0.22), { dry: 0.9, op: 0.9, bodyLen: 0.5 }); });
      // the stroke that strikes it: one heavy cut of the brush into the bell's flank
      const hit = M(p.strike);
      s += K.slash(r, [add(hit, [250, 120]), add(hit, [140, 40]), add(hit, [30, -6]), add(hit, [-40, -14])], 46, INK, { edgeCol: '#e8d8b0' });
      s += K.impact(r, hit, 60, INK, { rays: 6, a0: 1.2, fan: 0.9, core: false });
      five.forEach((k, i) => { s += K.splatter(r, add(hit, [(r() - 0.5) * 50, (r() - 0.5) * 50]), 120, mix(INK6[k], '#2a1a10', 0.3), { blot: false, n: 4, dir: [Math.cos(2.4 + i * 0.5), Math.sin(2.4 + i * 0.5)], spread: 1.2 }); });
      return s;
    },
  });
};

// ==== generic device card (any card without a hand-made one)
// The object comes from the calling (or the kind), its scale and tilt from OBJ_PLACE; the FX from the course: a dry
// arc of the course's ink behind, splatter, and a hatched ring. Plain on purpose: a rare card earns an ART entry.
const DEVICE_BY_CLS = { alchemist: 'flask', oracle: 'hourglass', hexweaver: 'mirror', elementalist: 'bell', bulwark: 'shield', duelist: 'shield', vessel: 'bell', shared: 'hourglass' };
const DEVICE_BY_KIND = { flask: 'flask' };
const OBJ_PLACE = { flask: [[548, 352], 1.0, -0.15], hourglass: [[560, 330], 1.0, -0.1], mirror: [[600, 262], 0.92, -0.2], bell: [[540, 330], 0.98, 0.06], shield: [[560, 300], 1.0, 0.1] };
function deviceGeneric(card, id, o = {}) {
  const course = courseOf(card, o), obj = o.device || DEVICE_BY_KIND[kindOf(card)] || DEVICE_BY_CLS[card.cls] || 'hourglass';
  const [at, scale, ang] = OBJ_PLACE[obj], inkC = mix(INK6[course] || '#3a2a1a', '#1a120c', 0.3);
  return device({
    course, seed: o.seed || seedOf(id), at, scale, ground: Object.assign({ room: o.room || roomOf(card, course), x: 800, w: 1500, pool: [at[0], at[1] - 20, 430, 270], dark: 0.3 }, o.ground || {}),
    build: f => obj === 'shield' ? OB.shield(f, { ang, s: 1.7, bites: course === 'void' ? [[50, -30, 20], [20, 50, 12]] : [] }) : OB[obj](f, { ang }),
    back: (r) => {
      let s = K.drybrush(r, K.arc(at, 300, 220, 200, 330, 10), 60, inkC, { dry: 1, body: false, op: 0.7, bristles: 16 });
      for (const R of [330, 390]) s += K.motionHatch(r, K.arc(at, R, R * 0.7, 20, 160, 14), 26, INK, { lw: 2, op: 0.6, grow: false });
      return s;
    },
    front: (r) => K.splatter(r, add(at, [180, -60]), 140, inkC, { blot: false, n: 18, dir: [1, -0.4], spread: 1.4 }),
  });
}
const DEVICE_KIND = { flask: deviceGeneric, device: deviceGeneric, rite: deviceGeneric, curse: deviceGeneric };

// ==== assembly
// Per-card overrides: which composition, and anything the data cannot say (a room named in the note, a style).
const OVR = {
  bw_mace_blow: { kind: 'attack', room: 'stair' },
  du_two_step: { kind: 'attack', room: 'belfry', cutAt: [105, 60], ground: { shaft: [250, 160, 640, 260] } },
  el_ink_bolt: { kind: 'cast', room: 'nave' },
  bw_brace: { kind: 'block', room: 'stair' },
};
const KIND = { attack, cast, block };
function card(id) {
  const cd = CARDS[id] || {}, o = OVR[id] || {};
  let kind = o.kind || kindOf(cd);
  if (KIND[kind] && !ART[id] && !heroOf(cd, courseOf(cd, o))) kind = 'device';   // shared and world cards have no hero
  const fn = ART[id] || KIND[kind] || DEVICE_KIND[kind] || generic;
  const res = fn(cd, id, o);
  return K.svgDoc(seedOf(id) % 97, res.course, res.defs, res.body, res.finish || {});
}
function generic(cd) { throw new Error('no composition yet for kind ' + kindOf(cd)); }

module.exports = { SAMPLES, CARDS, card, kindOf, heroOf, roomOf, courseOf, W, H };
