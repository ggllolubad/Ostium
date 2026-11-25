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
  if (t.has('dmg') && /enem/.test(card.target)) return ['bulwark', 'duelist'].includes(card.cls) ? 'attack' : card.cls === 'elementalist' || card.cat !== 'physical' ? 'cast' : 'attack';
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
// world cards, foe-added cards and afflictions use their own world's room; the world is in the cls or the id
const worldOf = (card, id = '') => { const m = /^(?:aff|t|w)_([a-z]+)/.exec(id); return card.cls && card.cls.startsWith('world_') ? card.cls.slice(6) : m ? m[1] : null; };
const roomOf = (card, course, id) => ROOM_BY_WORLD['world_' + worldOf(card, id)] || ROOM_BY_COURSE[card.cat] || ROOM_BY_COURSE[course];

// ==== shared composition pieces
// No foes on any card (Cole, 2026-11-25): the hero acts on empty air and the ink FX carry the blow.
function placeHero(spec) {
  const h = K.hero(spec.hero[0], spec.hero[1], spec.pose, spec.hero[2] || 'heroes', { hide: spec.hide });
  const A = h.joint(spec.anchor || 'head');
  return { h, svg: K.place(h.body, A, spec.at, spec.scale), defs: h.defs, M: p => K.mapPt(p, A, spec.at, spec.scale), J: n => (h.J[n] ? K.mapPt(h.joint(n), A, spec.at, spec.scale) : null) };
}
// the swing: a dry-brush arc trailing a weapon head round a pivot, heavy at the head, dry and split at its tail
function swing(r, piv, head, sweep, w, o = {}) {
  const R = len(sub(head, piv)), a1 = Math.atan2(head[1] - piv[1], head[0] - piv[0]), a0 = a1 - sweep * Math.PI / 180;
  const pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + (a1 - a0) * i / 12; pts.push(add(piv, [Math.cos(a) * R, Math.sin(a) * R])); }
  let s = K.drybrush(r, pts, w, o.col || INK, { profile: t => 0.12 + 0.88 * Math.pow(t, 1.6) * (t > 0.93 ? (1 - t) * 14 : 1), dry: 1, bodyLen: 0.0, body: false, op: o.op ?? 0.8, ragStart: 0, bristles: o.bristles || 16 });
  s += K.motionHatch(r, pts.map(p => add(piv, mul(sub(p, piv), 0.78))), w * 0.9, INK, { lw: 2.2, op: 0.7 });
  return s;
}
// ink flecks thrown off a smash: small inked shards, some in the course's ink
function flecks(r, c, R, dir, col) {
  let s = '';
  for (let i = 0; i < 7; i++) {
    const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 2.2, d = R * (0.4 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = 3 + r() * 6;
    const q = [add(p, rot([z, 0], a)), add(p, rot([-z * 0.4, z * 0.6], a)), add(p, rot([-z * 0.7, -z * 0.3], a))];
    s += `<path d="${K.polyD(q)}" fill="${r() < 0.5 ? col : INK}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
  }
  return `<g filter="url(#kWob)">${s}</g>`;
}
const fxInk = course => course === 'physical' ? INK : mix(INK6[course] || INK, '#16110e', 0.6);

// ==== hero rigs per calling and kind
// Pose (bone rotations, posed the way card_figure.js does), placement (the head joint lands on `at`, at `scale`) and
// the points the FX hang on, in figure px on a named bone. Tuned by eye with posepeek.js and the @cls/kind test ids.
// Path variants share their calling's rig: their joints sit where the base figure's do.
const RIG = {
  bulwark: {
    attack: { style: 'swing', pose: { upperarm_n: -160, forearm_n: 40, hand_n: 160, torso: 10, upperarm_f: -10, lean: 4 }, at: [330, 372], scale: 1.22, weapon: ['mace', [500, 236]], pivot: 'upperarm_n', sweep: 85 },
    block: { pose: { torso: 4, head: 4, lean: -2, upperarm_f: -2 }, at: [380, 352], scale: 1.42, face: ['door', [526, 330]], wood: true },
  },
  duelist: {
    attack: { style: 'cuts', pose: { upperarm_n: -35, forearm_n: -5, hand_n: -10, torso: 6, lean: 6, head: -6, cape: -10 }, at: [300, 236], scale: 1.2, weapon: ['rapier', [588, 518]], off: 'dagger' },
    block: { pose: { upperarm_n: -30, forearm_n: -70, hand_n: -30, torso: -4, lean: -3 }, at: [330, 250], scale: 1.25, face: ['rapier', [520, 460]] },
  },
  elementalist: {
    cast: { pose: { upperarm_n: -60, forearm_n: 110, hand_n: -30, torso: -4, head: -10 }, hide: ['sign'], at: [262, 300], scale: 1.32, hand: ['hand_n', [394, 296]] },
    block: { pose: { upperarm_f: -12, forearm_f: -12, torso: -5, head: -4, upperarm_n: 10 }, hide: ['sign'], at: [300, 290], scale: 1.3, face: ['book', null] },
  },
  alchemist: {
    cast: { pose: { upperarm_f: -25, forearm_f: -15, torso: 5, lean: 4 }, at: [300, 300], scale: 1.2, hand: ['flask', null], glass: true },
    block: { pose: { upperarm_n: -25, forearm_n: -60, torso: -4, lean: -2 }, at: [330, 300], scale: 1.25, face: ['hand_n', null] },
  },
  oracle: {
    cast: { pose: { upperarm_n: -55, forearm_n: 25, torso: 3, head: -4 }, at: [300, 280], scale: 1.25, hand: ['hourglass', null] },
    block: { pose: { upperarm_n: -35, forearm_n: -35, torso: -5, lean: -2 }, at: [330, 290], scale: 1.25, face: ['hourglass', null] },
  },
  hexweaver: {
    cast: { pose: { upperarm_n: -45, forearm_n: 15, torso: 4, head: -6 }, at: [300, 300], scale: 1.3, hand: ['poppet', null] },
    attack: { style: 'strike', pose: { upperarm_f: 50, forearm_f: 60, hand_f: 10, torso: 8, lean: 5 }, at: [300, 300], scale: 1.3, weapon: ['hand_f', null] },
    block: { pose: { upperarm_n: -20, forearm_n: -40, torso: -8, lean: -3 }, at: [320, 300], scale: 1.3, face: ['poppet', null] },
  },
  vessel: {
    cast: { pose: { upperarm_n: -60, forearm_n: -15, torso: 3 }, at: [330, 250], scale: 1.2, hand: ['hand_n', null] },
    attack: { style: 'strike', pose: { upperarm_f: -60, forearm_f: -20, torso: 6, lean: 4 }, at: [330, 250], scale: 1.2, weapon: ['hand_f', null] },
    block: { pose: { upperarm_n: 30, forearm_n: -60, upperarm_f: -30, forearm_f: -60, torso: -3 }, at: [340, 250], scale: 1.2, face: ['hand_f', null] },
  },
};
// a calling with no attack rig attacks the way it casts (the Elementalist, Alchemist and Oracle throw or flick)
const DEFAULT_RIG = { attack: { style: 'strike', pose: {}, at: [330, 300], scale: 1.2 }, cast: { pose: {}, at: [300, 300], scale: 1.25 }, block: { pose: {}, at: [380, 330], scale: 1.3 } };
const rigOf = (cls, kind) => Object.assign({}, DEFAULT_RIG[kind], (RIG[cls] || {})[kind] || {});
const seedOf = id => { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 1000 + (h % 8000); };
// a point on a bone (null point = that bone's joint), mapped to the card; falls back to the near hand
const bonePt = (P, ref) => { if (!ref || !P.h.J[ref[0]]) return P.J('hand_n'); return ref[1] ? P.M(P.h.at(ref[0], ref[1])) : P.J(ref[0]); };

// ==== hero compositions (attack, cast, block)
function attack(card, id, o = {}) {
  if (!RIG[card.cls] || !RIG[card.cls].attack) return cast(card, id, Object.assign({ asAttack: true }, o));
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), R = Object.assign(rigOf(card.cls, 'attack'), o.rig || {});
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const room = o.room || roomOf(card, course, id), ink = fxInk(course);
  const hits = Math.max(1, ...(card.fx || []).map(x => x.times || 1));
  const style = o.style || R.style;
  let body;
  if (style === 'swing') {
    // the weapon comes round in a dry-brush arc and smashes into the air ahead of it
    const head = bonePt(P, R.weapon), piv = P.J(R.pivot) || P.J('torso'), hit = add(head, [34, 26]);
    body = K.ground(r, Object.assign({ room, x: 820, w: 1450, c, pool: [hit[0] - 80, hit[1] + 120, 430, 270], dark: 0.3 }, o.ground || {}));
    body += swing(r, piv, head, R.sweep || 80, 70, { op: 0.9 });
    body += P.svg;
    body += K.impact(r, hit, 78, ink, { rays: 8, a0: -1.3, fan: 0.85, splat: { dir: [1, 0.4], spread: 1.8 } });
    body += K.splatter(r, add(hit, [60, 30]), 160, ink, { dir: [1, 0.3], spread: 1.2, n: 22, blotR: 0.08, blot: false });
    if (course === 'physical') body += K.splatter(r, add(hit, [40, 40]), 110, BLOOD, { dir: [1, 0.5], spread: 1.0, n: 10, blot: false, op: 0.85 });
    body += flecks(r, hit, 130, [1, -0.2], ink === INK ? '#5a4a3a' : ink);
  } else if (style === 'cuts') {
    // the cuts hang in the air where the blade passed: crescents of ink with a dark wet line in them, flung drops
    const tip = bonePt(P, R.weapon), X = add(tip, o.cutAt || [140, 10]);
    body = K.ground(r, Object.assign({ room, x: 400, w: 1500, c, pool: [X[0] - 200, X[1] - 30, 440, 280], dark: 0.3 }, o.ground || {}));
    body += P.svg;
    const base = [[-80, -120], [-25, -40], [25, 50], [55, 120]], n = Math.min(3, hits), CUTS = Array.from({ length: n }, (_, k) => base.map(q => add(q, [(k - (n - 1) / 2) * 62, (k - (n - 1) / 2) * -18 + (k % 2) * 14])));
    CUTS.map(cu => cu.map(q => add(X, q))).forEach((cu, k) => {
      body += K.slash(r, cu, 30 - k * 6, ink);
      body += K.drybrush(r, cu.slice(1, 3).map(q => add(q, [2, 3])), 4, course === 'physical' ? BLOOD : mix(ink, '#fff', 0.25), { dry: 0.6, op: 0.85, bristles: 2, body: false });
    });
    body += K.splatter(r, add(X, [70, -10]), 170, ink, { dir: [1, -0.1], spread: 1.6, n: 22, blot: false });
    if (course === 'physical') body += K.splatter(r, add(X, [60, 10]), 130, BLOOD, { dir: [1, 0.2], spread: 1.4, n: 12, blot: false, op: 0.85 });
    body += K.drybrush(r, [add(tip, [-300, 40]), add(tip, [-150, 26]), add(tip, [-20, 16])], 16, INK, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.55, bristles: 7 });
    if (R.off && P.h.J[R.off]) { const dag = P.J(R.off); body += K.motionHatch(r, [add(dag, [-30, -60]), add(dag, [90, -100]), add(X, [-70, -150])], 30, INK, { lw: 2, op: 0.6 }); }
  } else {
    // strike: a short hard blow; hatched motion from behind the hand, the smash just past it
    const hand = bonePt(P, R.weapon), hit = add(hand, [90, 10]);
    body = K.ground(r, Object.assign({ room, x: 700, w: 1500, c, pool: [hit[0] - 120, hit[1], 430, 270], dark: 0.3 }, o.ground || {}));
    body += K.motionHatch(r, [add(hand, [-230, 30]), add(hand, [-120, 14]), add(hand, [-20, 4])], 44, INK, { lw: 2.4, op: 0.75 });
    body += P.svg;
    body += K.impact(r, hit, 66, ink, { rays: 7, a0: -1.0, fan: 0.75, splat: { dir: [1, 0], spread: 1.8 } });
    body += flecks(r, hit, 110, [1, 0], ink === INK ? '#5a4a3a' : ink);
  }
  return { course: c, defs: P.defs, body };
}

// CAST: the course's ink flung from the hand (or a flask from it) in an arc that bursts in the air at the right
function cast(card, id, o = {}) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), ink = mix(INK6[course] || INK, '#16110e', course === 'physical' ? 0 : 0.74), R = Object.assign(rigOf(card.cls, 'cast'), o.rig || {});
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const tipF = bonePt(P, R.hand);
  const hitP = o.hitAt || [930, Math.min(470, tipF[1] + 70)];
  let body = K.ground(r, Object.assign({ room: o.room || roomOf(card, course, id), x: 700, w: 1500, c, pool: [600, 280, 480, 270], dark: 0.3 }, o.ground || {}));
  const mid = [lerp(tipF, hitP, 0.5)[0], Math.min(tipF[1], hitP[1]) - 70], path = [tipF, lerp(tipF, mid, 0.5), mid, lerp(mid, hitP, 0.55), hitP];
  const PP = K.catmull(path, 10), bi = Math.round(PP.length * 0.62), bead = PP[bi];
  body += K.drybrush(r, K.catmull(path, 3).filter(q => q[0] < bead[0] - 10), 30, ink, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.85, bristles: 12 });
  body += K.motionHatch(r, K.catmull(path, 3).filter(q => q[0] < bead[0] - 30).map(q => add(q, [0, 26])), 26, INK, { lw: 2, op: 0.6 });
  body += P.svg;
  body += beadDrop(r, bead, norm(sub(PP[Math.min(PP.length - 1, bi + 2)], bead)), 21, ink);
  // the burst in the air: a ragged blot, drops flung on past it, the course's mark in what falls
  body += K.impact(r, hitP, 58, ink, { rays: 7, core: false, a0: -0.5, splat: { dir: [1, 0.1], spread: 2.4 } });
  body += K.splatter(r, add(hitP, [30, 10]), 150, ink, { dir: [1, 0.2], spread: 2.4, n: 26, blot: false });
  if (R.glass || o.glass) body += shards(r, hitP, 150, [1, -0.2], '#b8c4a8');
  for (let i = 0; i < 9; i++) { const q = K.catmull(path, 6)[Math.round(r() * 12) + 2]; body += `<circle cx="${(q[0] + (r() - 0.5) * 30).toFixed(1)}" cy="${(q[1] + 12 + r() * 30).toFixed(1)}" r="${(1.5 + r() * 3).toFixed(1)}" fill="${ink}"/>`; }
  return { course: c, defs: P.defs, body };
}
// a flung drop of ink: a round head with a drawn-out tail, inked, with a lit fleck and a dark lower side
function beadDrop(r, p, dir, rad, col) {
  const d = norm(dir), n = [-d[1], d[0]], tail = add(p, mul(d, -rad * 3.2));
  const pts = [tail, add(add(p, mul(n, rad)), mul(d, -rad * 0.2)), add(p, mul(d, rad)), add(add(p, mul(n, -rad)), mul(d, -rad * 0.2))];
  return `<g filter="url(#kRag)"><path d="${K.pathD(pts, true)}" fill="${mix(col, '#000', 0.3)}" stroke="${INK}" stroke-width="${Math.max(1.2, rad * 0.14)}"/>`
    + (rad > 8 ? `<path d="${K.pathD([add(p, [-rad * 0.5, -rad * 0.5]), add(p, [-rad * 0.1, -rad * 0.7]), add(p, [-rad * 0.3, -rad * 0.2])], true)}" fill="${mix(col, '#fff', 0.45)}" opacity="0.7"/><path d="${K.pathD([add(p, [rad * 0.6, rad * 0.2]), add(p, [0, rad * 0.85]), add(p, [-rad * 0.55, rad * 0.4]), add(p, [0, rad * 0.5])], true)}" fill="#000" opacity="0.45"/>` : '') + '</g>';
}
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

// BLOCK: the hero set behind their guard; an unseen blow smashes on it from the right
function block(card, id, o = {}) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), R = Object.assign(rigOf(card.cls, 'block'), o.rig || {});
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const g = bonePt(P, R.face), hit = R.face && R.face[1] ? g : add(g, [120, 10]), ink = fxInk(course);
  let body = K.ground(r, Object.assign({ room: o.room || roomOf(card, course, id), x: 1200, w: 1500, c, pool: [hit[0] - 40, hit[1] - 40, 450, 280], dark: 0.3 }, o.ground || {}));
  for (let i = 0; i < 4; i++) { const y = hit[1] - 120 + i * 85 + (r() - 0.5) * 20; body += K.motionHatch(r, [[hit[0] + 340, y + 30], [hit[0] + 190, y + 10], [hit[0] + 50, y]], 32, INK, { lw: 2.4, op: 0.75, slant: 0.35 }); }
  body += P.svg;
  body += K.impact(r, add(hit, [8, 0]), 60, ink, { rays: 7, a0: 1.7, fan: 0.55, core: false, splat: { dir: [0.3, -1], spread: 2.6 } });
  body += R.wood ? splinters(r, add(hit, [10, -10]), 120, [0.6, -1]) : flecks(r, hit, 120, [0.6, -1], ink === INK ? '#5a4a3a' : ink);
  body += grit(r, [hit[0] - 120, 600], 300);
  return { course: c, defs: P.defs, body };
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
      for (const [x, y, w, h] of [[250, 505, 80, 28], [880, 500, 90, 30], [150, 545, 70, 24], [990, 545, 80, 26]]) s += K.billow(r, [x, y], w * 0.8, h * 0.8, '#68705a', { op: 0.4, lw: 4 });
      return s;
    },
    front: (r, M, p) => {
      const m = M(p.mouth);
      let s = '';
      // the burst: gas jetting out of the split and turning over as it climbs, brew spat out with it
      for (const [dx, dy, w, h] of [[34, -8, 30, 20], [80, -40, 44, 28], [140, -86, 58, 36], [205, -132, 68, 40]]) s += K.billow(r, add(m, [dx, dy]), w, h, '#727a5a', { op: 0.5, lw: 4 });
      s += K.splatter(r, add(m, [20, 10]), 120, '#4a5a22', { dir: [1, 0.3], spread: 1.4, n: 18, blotR: 0.1 });
      for (let i = 0; i < 5; i++) s += beadDrop(r, add(m, [60 + r() * 130, 10 + r() * 80]), [1, 0.2 + r() * 0.5], 4 + r() * 5, '#7a8a3a');
      s += shards(r, add(m, [20, 0]), 150, [1, -0.2], '#a8b888');
      // spores drifting up out of the mist
      for (let i = 0; i < 30; i++) { const q = [220 + r() * 700, 300 + r() * 220]; s += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(1 + r() * 2).toFixed(1)}" fill="${r() < 0.5 ? '#c8c890' : '#22220e'}" opacity="0.7"/>`; }
      return s;
    },
  });
};

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
      five.forEach((k, i) => { const q = add(b, [-120 + i * 52 + (r() - 0.5) * 12, 30 - Math.abs(i - 2) * 16 + (r() - 0.5) * 14]); s += K.drybrush(r, [add(q, [-16, 22]), q, add(q, [14, -24])], 16, mix(INK6[k], '#2a1a10', 0.5), { dry: 1, op: 0.85, bodyLen: 0.35, bristles: 7 }); });
      // the stroke that strikes it: one heavy cut of the brush into the bell's flank
      const hit = M(p.strike);
      s += K.slash(r, [add(hit, [250, 120]), add(hit, [140, 40]), add(hit, [30, -6]), add(hit, [-40, -14])], 46, INK, { edgeCol: '#e8d8b0' });
      s += K.impact(r, hit, 60, INK, { rays: 6, a0: 1.2, fan: 0.9, core: false });
      five.forEach((k, i) => { s += K.splatter(r, add(hit, [(r() - 0.5) * 50, (r() - 0.5) * 50]), 120, mix(INK6[k], '#2a1a10', 0.5), { blot: false, n: 4, dir: [Math.cos(2.4 + i * 0.5), Math.sin(2.4 + i * 0.5)], spread: 1.2 }); });
      return s;
    },
  });
};

// ==== generic device card (any card without a hand-made one)
// The object is picked from the card's own words (name weighs most, then the note, then the rules text), so cards
// about bells get a bell and cards about salt get salt. Kind, calling and course break ties and fill gaps. The FX come
// from the course. Plain on purpose: a rare card earns an ART entry.
const { O } = require('./objects2');
const FLASK_COL = { physical: ['#5a4a30', '#8a5a2a'], fire: ['#7a5a2a', '#c8742a'], frost: ['#6a8a9a', '#b8d0dc'], lightning: ['#7a7040', '#d8c870'], water: ['#3a5a4a', '#3a6a8a'], toxin: ['#4a6232', '#7a8636'], void: ['#3a3048', '#2a1a3a'] };
const LIB = Object.assign({ flask: (f, o) => OB.flask(f, Object.assign({ glass: (FLASK_COL[o.course] || FLASK_COL.physical)[0], liquid: (FLASK_COL[o.course] || FLASK_COL.physical)[1], skull: o.course === 'toxin' }, o)), hourglass: OB.hourglass, mirror: OB.mirror, bell: OB.bell, shield: (f, o) => OB.shield(f, Object.assign({ s: 1.7, bites: o.course === 'void' ? [[50, -30, 20], [20, 50, 12]] : [] }, o)) }, O);
const OBJ_WORDS = [
  ['poppet', /poppet|doll|effigy|straw/], ['mirror', /mirror|silver|reflection|glint|\bglass\b/], ['shard', /shard|splinter/],
  ['bell', /\bbells?\b|toll|knell|tailors|dirge|handbell|chime|ringing/], ['hourglass', /\bhour|time|clock|delay|hasten|stillness|second hand|watch\b/],
  ['needle', /needle|sewn|stitch|seam|\bpins?\b/], ['candle', /candle|tallow|taper|\bwax|vigil|witching/], ['eye', /\beyes?\b|stare|gaze|\bseen\b/],
  ['knife', /knife|blade|bleed|letting|\bcut|scar|stab|dagger|edge/], ['skull', /skull|death|doom|grave|corpse|barrow|dread|final|harbinger|prophet|tomb|draugr|dead/],
  ['bone', /\bbones?\b|marrow|knuckle/], ['cord', /\bcord|knot|thread|ladder|\bbind|\btie/], ['rope', /rope|hook|\bhaul|harpoon|keelhaul|lash|\bline\b/],
  ['chain', /chain|flail|shackle|penitent/], ['book', /codex|\bbook|\bpage|ledger|\bread|tome/], ['scroll', /scroll|signed|letter|\bnames?\b|chalk|writ/],
  ['inkpot', /\bink\b|quill|\bnib|\bwrite|spectrum|six courses/], ['key', /\bkeys?\b|\block\b|threshold|\bgate/], ['lantern', /\blamp|lantern|glare|beam|false light/],
  ['purse', /alms|purse|coin|tithe|price|debt|\bgold|wealth|\bpay/], ['bandage', /bandage|linen|wound|festering|towel|\brag\b|cloth|vinegar|\bsores?\b|fever|frostbite|sickness/],
  ['herbs', /herb|simple|sage|bloom|flower|seed|spore|garden|blight|moss|\broot/], ['bread', /bread|feast|cellar|sin-eater|\beats?\b/],
  ['bowl', /broth|ladle|milk|\bbowl|soup|stew/], ['brazier', /brazier|coals|\bfire\b|burn|\bash|flame|fire-setting|ember|smoulder/], ['salt', /\bsalt\b/],
  ['cup', /drink|\bcup|chalice|wine|offering|drain|blood/], ['hammer', /hammer|anvil|wedge|forge|temper|quench|weld|melt|smith/],
  ['rod', /\brod\b|storm|\bbolt|lightning/], ['stinger', /sting|venom|wasp|hive/], ['reliquary', /relic|saint|holy|hymn|prayer|abbey|blessing|vigil/],
  ['boot', /\bstep|march|shoulder|\bswap|\brank|fall back|\bgap\b|advance|retreat|wade|stride|dodge|stumble/],
  ['anchor', /anchor|\bsea\b|drown|keel|\bwave|undertow|pressure|flood|brine|\btide|\bdeep\b/], ['door', /\bdoor|bar the|barricade|hold the line/],
  ['shield', /shield|guard|\bwall\b|\bward|parry|brace|\bblock/], ['keg', /powder|\bkeg|blast|charge|explo/], ['jar', /\bjar\b|\bpot\b|firepot|crock/],
  ['vial', /draught|phial|vial|tincture|bottle|potion|salts|tonic/], ['flask', /flask|\bbrew|acid/],
];
const OBJ_BY_CLS = { alchemist: 'vial', oracle: 'hourglass', hexweaver: 'poppet', elementalist: 'inkpot', bulwark: 'shield', duelist: 'knife', vessel: 'reliquary' };
const OBJ_BY_COURSE = { physical: 'boot', fire: 'brazier', frost: 'bandage', water: 'anchor', toxin: 'herbs', void: 'candle', lightning: 'rod', attuned: 'inkpot' };
function pickObject(card, id = '') {
  const course = courseOf(card), kind = kindOf(card);
  const name = (card.name || '').toLowerCase(), note = (card.note || '').toLowerCase(), text = (card.text || '').toLowerCase();
  let best = null, bs = 0;
  const FLASKS = ['flask', 'vial', 'jar', 'keg'];
  if (kind === 'flask' && /drink|sip|throws back|bites the cork|lifts .* drinks|holds a small open vial|hangs from/.test(note)) return /powder|blast/.test(note + name) ? 'keg' : 'vial';
  OBJ_WORDS.forEach(([k, re], i) => {
    if (k === 'eye' && course !== 'void') return;
    if (kind === 'flask' && !FLASKS.includes(k)) return;
    const sc = (re.test(name) ? 3 : 0) + (re.test(note) ? 1 : 0) + (re.test(text) ? 0.3 : 0) - i * 0.001;
    if (sc > bs) { bs = sc; best = k; }
  });
  if (bs >= 0.9) return best;
  if (kind === 'flask') return 'flask';
  if (kind === 'curse') return 'chain';
  return OBJ_BY_CLS[card.cls] || OBJ_BY_COURSE[course] || 'skull';
}
// the course's mark round the object: what the course does to the air and the floor, never sparkles or glows
function courseFX(r, at, course, back) {
  const ink = fxInk(course); let s = '';
  if (back) {
    // the object's shadow on the floor: a dry ink pool, hatched, so it sits in the room instead of floating
    s += K.drybrush(r, [[at[0] - 230, 560], [at[0], 548], [at[0] + 260, 562]], 40, '#120c08', { dry: 0.6, op: 0.55, bodyLen: 0.6, bristles: 14 });
    s += K.motionHatch(r, [[at[0] - 200, 575], [at[0], 568], [at[0] + 240, 578]], 24, INK, { lw: 1.8, op: 0.5, grow: false });
    const side = r() < 0.5 ? -1 : 1, a0 = side < 0 ? 150 : -40;
    for (const R of [300, 360]) s += K.motionHatch(r, K.arc(at, R, R * 0.72, a0, a0 + 70, 10), 24, INK, { lw: 2, op: 0.45, grow: false });
    if (course === 'toxin') for (const [x, w] of [[at[0] - 260, 110], [at[0] + 270, 120]]) s += K.billow(r, [x, 540], w, 34, '#68705a', { op: 0.4, lw: 4 });
    if (course === 'water') for (let i = 0; i < 3; i++) s += K.drybrush(r, [[at[0] - 420, 540 + i * 22], [at[0], 520 + i * 26], [at[0] + 420, 545 + i * 20]], 26, mix('#2f4f8f', '#16110e', 0.65), { dry: 1, body: false, op: 0.65, bristles: 12 });
    return s;
  }
  if (course === 'fire') for (let i = 0; i < 30; i++) { const p = [at[0] - 260 + r() * 520, 80 + r() * 300]; s += `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}l${(2 + r() * 4).toFixed(1)},${(-3 - r() * 5).toFixed(1)}" stroke="${r() < 0.6 ? '#2a2020' : '#d8742a'}" stroke-width="${(1.5 + r() * 2).toFixed(1)}" stroke-linecap="round"/>`; }
  else if (course === 'frost') { for (let i = 0; i < 40; i++) { const p = [at[0] - 300 + r() * 600, 60 + r() * 480]; s += `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}l0,${(3 + r() * 6).toFixed(1)}" stroke="#e8eef0" stroke-width="${(1 + r() * 1.6).toFixed(1)}" stroke-linecap="round" opacity="0.8"/>`; } s += K.drybrush(r, [[0, 596], [W / 2, 580], [W, 598]], 34, '#d8e4e8', { dry: 1, body: false, op: 0.6, bristles: 18 }); }
  else if (course === 'lightning') { const br = (p, a, l, d) => { if (d > 4) return ''; const q = add(p, [Math.cos(a) * l, Math.sin(a) * l]); return `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}" stroke="#f0e8c0" stroke-width="${(3 - d * 0.5).toFixed(1)}" stroke-linecap="round"/><path d="M${(p[0] + 2).toFixed(1)},${(p[1] + 2).toFixed(1)}L${(q[0] + 2).toFixed(1)},${(q[1] + 2).toFixed(1)}" stroke="${INK}" stroke-width="1.2" opacity="0.7"/>` + br(q, a + 0.3 + r() * 0.4, l * 0.72, d + 1) + (r() < 0.7 ? br(q, a - 0.3 - r() * 0.4, l * 0.65, d + 1) : ''); }; s += `<g filter="url(#kWob)">${br([at[0] - 40, 600], -1.9, 70, 0)}${br([at[0] + 60, 600], -1.3, 64, 0)}</g>`; }
  else if (course === 'void') { for (const [x, y, rr] of [[at[0] - 300, 470, 26], [at[0] + 330, 150, 18], [at[0] + 270, 500, 12]]) s += `<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr * 0.9}" fill="#060509" stroke="${INK}" stroke-width="2.4"/><path d="M${x - rr * 0.8},${y - rr * 0.6}A${rr} ${rr * 0.9} 0 0 1 ${x + rr * 0.6},${y - rr * 0.8}" stroke="#d8d0e0" stroke-width="1.2" fill="none" opacity="0.8"/>`; }
  else if (course === 'water') for (let i = 0; i < 12; i++) { const p = [at[0] - 200 + r() * 400, 320 + r() * 200]; s += `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}q-4,8 0,12q4,-4 0,-12z" fill="${mix('#2f4f8f', '#16110e', 0.5)}" stroke="${INK}" stroke-width="1"/>`; }
  else if (course === 'toxin') for (let i = 0; i < 30; i++) { const p = [at[0] - 300 + r() * 600, 150 + r() * 380]; s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(1 + r() * 2).toFixed(1)}" fill="${r() < 0.5 ? '#c8c890' : '#22220e'}" opacity="0.75"/>`; }
  s += K.splatter(r, add(at, [220, -80]), 130, ink, { blot: false, n: 14, dir: [1, -0.4], spread: 1.4 });
  return s;
}
const OBJ_SCALE = { knife: 1.2, needle: 1.15, bandage: 1.1, stinger: 1.1, bone: 1.1, key: 1.05, vial: 1.15, jar: 1.15, skull: 1.05, cord: 1.0, purse: 1.05, cup: 1.05, eye: 1.05, shard: 1.15, poppet: 1.05, hammer: 1.0, salt: 0.95, book: 1.0, bread: 1.05, boot: 1.05 };
function deviceGeneric(card, id, o = {}) {
  const course = courseOf(card, o), obj = o.device || pickObject(card, id), at = o.at || [560, 318], scale = o.scale || OBJ_SCALE[obj] || 0.95;
  return device({
    course, seed: o.seed || seedOf(id), at, scale, ground: Object.assign({ room: o.room || roomOf(card, course, id), x: 800, w: 1500, pool: [at[0], at[1] - 20, 430, 270], dark: 0.3 }, o.ground || {}),
    build: f => LIB[obj](f, { course, ang: o.ang }),
    back: r => courseFX(r, at, course, true),
    front: r => courseFX(r, at, course, false),
  });
}
const DEVICE_KIND = { flask: deviceGeneric, device: deviceGeneric, rite: deviceGeneric, curse: deviceGeneric };

// ==== assembly
// Per-card overrides: which composition, and anything the data cannot say (a room named in the note, a style).
const OVR = {
  bw_mace_blow: { kind: 'attack', room: 'stair' },
  du_two_step: { kind: 'attack', room: 'belfry', ground: { shaft: [250, 160, 640, 260] } },
  el_ink_bolt: { kind: 'cast', room: 'nave' },
  bw_brace: { kind: 'block', room: 'stair' },
};
const KIND = { attack, cast, block };
// test ids: '@<calling>/<kind>[/<course>]' builds a stand-in card so a rig can be checked without a real card
function testCard(id) { const [cls, kind, cat = 'physical'] = id.slice(1).split('/'); return { name: id, cls, cat, target: 'enemy', fx: kind === 'block' ? [{ t: 'block', n: 5 }] : [{ t: 'dmg', n: 5 }], _kind: kind }; }
function card(id) {
  const cd = id[0] === '@' ? testCard(id) : CARDS[id] || {}, o = Object.assign({}, OVR[id] || {}, cd._kind ? { kind: cd._kind } : {});
  let kind = o.kind || kindOf(cd);
  if (KIND[kind] && !ART[id] && !heroOf(cd, courseOf(cd, o))) kind = 'device';   // shared and world cards have no hero
  const fn = ART[id] || KIND[kind] || DEVICE_KIND[kind] || generic;
  const res = fn(cd, id, o);
  return K.svgDoc(seedOf(id) % 97, res.course, res.defs, res.body, res.finish || {});
}
function generic(cd) { throw new Error('no composition yet for kind ' + kindOf(cd)); }

// one line saying what a card got: its kind and hero or object (for review sheets)
function describe(id) { const cd = id[0] === '@' ? testCard(id) : CARDS[id] || {}; const o = OVR[id] || {}; let k = cd._kind || o.kind || kindOf(cd); if (KIND[k] && !ART[id] && !heroOf(cd, courseOf(cd, o))) k = 'device'; const h = KIND[k] && !ART[id] ? (heroOf(cd, courseOf(cd, o)) || [])[1] : (o.device || (typeof pickObject === 'function' ? pickObject(cd, id) : '')); return k + ' ' + (h || ''); }
module.exports = { SAMPLES, CARDS, card, worldOf, describe, kindOf, heroOf, roomOf, courseOf, W, H };
