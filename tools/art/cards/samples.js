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

// ==== hero rigs per calling (the pose table lives in rig.js)
const { RIG, DEFAULT_RIG } = require('./rig');
const seedOf = id => { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 1000 + (h % 8000); };
// choose a pose: o.v forces one; else the first whose words match the card's name, then its note; else by id hash
function rigOf(card, id, list, o = {}) {
  const L = ((RIG[card.cls] || DEFAULT_RIG)[list]) || DEFAULT_RIG[list];
  if (o.v != null) return Object.assign({}, L[o.v % L.length]);
  const name = (card.name || '').toLowerCase(), note = (card.note || '').toLowerCase();
  const hit = L.find(v => v.words && v.words.test(name)) || L.find(v => v.words && v.words.test(note));
  return Object.assign({}, hit || L[seedOf(id) % L.length]);
}
// a point on a bone (null point = that bone's joint), mapped to the card; falls back to the near hand
const bonePt = (P, ref) => { if (!ref || !P.h.J[ref[0]]) return P.J('hand_n'); return ref[1] ? P.M(P.h.at(ref[0], ref[1])) : P.J(ref[0]); };

// ==== hero compositions (attack, cast, block)
function act(card, id, o = {}) {
  const R = Object.assign(rigOf(card, id, 'act', o), o.rig || {});
  if (R.style === 'cast' || R.style === 'pour') return cast(card, id, o, R);
  return attack(card, id, o, R);
}
function attack(card, id, o = {}, R) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id));
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
    const hand = bonePt(P, R.weapon), hit = add(hand, R.off || [90, 10]);
    body = K.ground(r, Object.assign({ room, x: 700, w: 1500, c, pool: [hit[0] - 120, hit[1], 430, 270], dark: 0.3 }, o.ground || {}));
    body += K.motionHatch(r, [add(hand, [-230, 30]), add(hand, [-120, 14]), add(hand, [-20, 4])], 44, INK, { lw: 2.4, op: 0.75 });
    body += P.svg;
    body += K.impact(r, hit, 66, ink, { rays: 7, a0: -1.0, fan: 0.75, splat: { dir: [1, 0], spread: 1.8 } });
    body += flecks(r, hit, 110, [1, 0], ink === INK ? '#5a4a3a' : ink);
  }
  return { course: c, defs: P.defs, body };
}

// CAST: the course's ink flung from the hand (or a flask from it) in an arc that bursts in the air at the right
function cast(card, id, o = {}, R) {
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), ink = mix(INK6[course] || INK, '#16110e', course === 'physical' ? 0 : 0.74);
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const tipF = bonePt(P, R.hand);
  const hitP = o.hitAt || [930, Math.min(470, tipF[1] + 70)];
  let body = K.ground(r, Object.assign({ room: o.room || roomOf(card, course, id), x: 700, w: 1500, c, pool: [600, 280, 480, 270], dark: 0.3 }, o.ground || {}));
  if (R.style === 'pour') {
    // poured: a stream falling from the flask's mouth, splashing and spreading on the floor, fumes standing up from it
    const floor = [tipF[0] + 150, 560], st = [tipF, add(tipF, [60, 40]), add(tipF, [120, 160]), floor];
    body += P.svg;
    body += K.drybrush(r, st, 18, ink, { profile: t => 0.5 + 0.5 * t, dry: 0.5, op: 0.9, bodyLen: 0.6, bristles: 8 });
    body += K.drybrush(r, [add(floor, [-200, 18]), add(floor, [0, 6]), add(floor, [260, 20])], 34, ink, { dry: 0.8, op: 0.8, bodyLen: 0.5, bristles: 14 });
    body += K.splatter(r, floor, 140, ink, { dir: [0.4, -1], spread: 2.2, n: 26, blotR: 0.18 });
    for (const [dx, w] of [[-60, 70], [80, 90], [220, 70]]) body += K.billow(r, add(floor, [dx, -70 - r() * 40]), w, 34, course === 'toxin' ? '#68705a' : '#6a6458', { op: 0.4, lw: 4 });
    if (o.barrier) body += o.barrier(r, floor);
    return { course: c, defs: P.defs, body };
  }
  if (R.spray) hitP[1] = Math.min(hitP[1], tipF[1] + 20);
  const mid = [lerp(tipF, hitP, 0.5)[0], Math.min(tipF[1], hitP[1]) - 70], path = [tipF, lerp(tipF, mid, 0.5), mid, lerp(mid, hitP, 0.55), hitP];
  if (R.spray) for (let k = 0; k < 2; k++) { const h2 = add(hitP, [-60 - k * 40, (k ? 1 : -1) * 120]); body += K.drybrush(r, [tipF, add(lerp(tipF, h2, 0.5), [0, -50]), h2], 24, ink, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.7, bristles: 10 }); body += K.splatter(r, h2, 110, ink, { dir: [1, 0], spread: 2, n: 14, blotR: 0.2 }); }
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
  const course = courseOf(card, o), c = COURSE[course], r = rng(o.seed || seedOf(id)), R = Object.assign(rigOf(card, id, 'block', o), o.rig || {});
  if (R.style === 'pour') return cast(card, id, Object.assign({ barrier: (r2, floor) => {
    // the poured barrier: fumes standing up in a hatched wall, and the blow breaking on it
    let s2 = ''; for (let i = 0; i < 5; i++) s2 += K.billow(r2, add(floor, [40 + i * 30, -120 - i * 60]), 70, 40, '#6a6458', { op: 0.5, lw: 4 });
    const hit2 = add(floor, [180, -200]);
    for (let i = 0; i < 3; i++) s2 += K.motionHatch(r2, [[hit2[0] + 300, hit2[1] - 60 + i * 60], [hit2[0] + 150, hit2[1] - 50 + i * 55], [hit2[0] + 30, hit2[1] - 40 + i * 50]], 30, INK, { lw: 2.3, op: 0.7, slant: 0.35 });
    return s2 + K.impact(r2, hit2, 54, INK, { rays: 6, a0: 1.6, fan: 0.6, core: false });
  } }, o), R);
  const P = placeHero({ hero: o.hero || heroOf(card, course), pose: R.pose, hide: R.hide, at: R.at, scale: R.scale });
  const g = bonePt(P, R.face), hit = R.face && R.face[1] ? g : add(g, R.off || [120, 10]), ink = fxInk(course);
  let body = K.ground(r, Object.assign({ room: o.room || roomOf(card, course, id), x: 1200, w: 1500, c, pool: [hit[0] - 40, hit[1] - 40, 450, 280], dark: 0.3 }, o.ground || {}));
  for (let i = 0; i < 4; i++) { const y = hit[1] - 120 + i * 85 + (r() - 0.5) * 20; body += K.motionHatch(r, [[hit[0] + 340, y + 30], [hit[0] + 190, y + 10], [hit[0] + 50, y]], 32, INK, { lw: 2.4, op: 0.75, slant: 0.35 }); }
  body += P.svg;
  body += K.impact(r, add(hit, [8, 0]), 60, ink, { rays: 7, a0: 1.7, fan: 0.55, core: false, splat: { dir: [0.3, -1], spread: 2.6 } });
  body += R.wood ? splinters(r, add(hit, [10, -10]), 120, [0.6, -1]) : flecks(r, hit, 120, [0.6, -1], ink === INK ? '#5a4a3a' : ink);
  if (R.style === 'salt') {
    // the salt line on the floor: the blow stops dead above it
    body += K.drybrush(r, [[hit[0] - 120, 572], [hit[0] + 60, 566], [hit[0] + 260, 576]], 16, '#ece6d8', { dry: 0.7, op: 0.95, bodyLen: 0.6, bristles: 10 });
    for (let i = 0; i < 40; i++) body += `<circle cx="${(hit[0] - 120 + r() * 380).toFixed(1)}" cy="${(560 + r() * 26).toFixed(1)}" r="${(0.8 + r() * 1.6).toFixed(1)}" fill="#f4f0e4"/>`;
  }
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

// ==== object cards: picking, layouts, acts, hands and the check metadata live in objcomp.js
const OC = require('./objcomp');
const objectCard = (cd, id, o) => OC.deviceCard(cd, id, o, { courseOf, roomOf });
const DEVICE_KIND = { flask: objectCard, device: objectCard, rite: objectCard, curse: objectCard };

// ==== assembly
// Per-card overrides: which composition, and anything the data cannot say (a room named in the note, a style).
const OVR = {
  bw_mace_blow: { kind: 'attack', room: 'stair' },
  du_two_step: { kind: 'attack', room: 'belfry', ground: { shaft: [250, 160, 640, 260] } },
  el_ink_bolt: { kind: 'cast', room: 'nave' },
  bw_brace: { kind: 'block', room: 'stair' },
};
// counts the name does not carry (L11): set by hand
Object.assign(OVR, { al_bandolier: { count: 2 }, al_magnum_opus: { count: 3 }, });   // round 7: Toll of Bells and Crossed Glass draw one object each; sets of two read worse (L51)
// round 6 (review-4 blind test): an object that could not be made to read at 170 px is replaced for that card by one
// that does; the card's meaning decides (L48). Each entry says what it shows.
const READS = {
  du_barbers_trade: 'knife',          // the barber's lancet, bleeding
  el_second_spark: 'lantern',         // a lantern throwing a second spark
  festering: 'basin',                 // a basin of foul dressings
  aff_hive: 'wasp',                   // the wasp itself
  bandage_roll: 'shears',             // shears cutting the bandage
  al_foul_bellows: 'flask',           // a flask venting foul air
  el_scatter_ink: 'scroll',           // ink flung across a scroll
  ve_ink_band: 'palm',                // the Vessel's own banded hand
  du_catch_the_rhythm: 'handbell',    // the bell it keeps time with
  al_clean_linen: 'laundry',          // clean linen on the line
  al_cauterize: 'brazier',            // the irons heating in the coals
  w_pyre_saints_ash: 'flask',         // the lead vial broken, grey ash bursting out (the urn read as a jug)
  ve_mothers_place: 'reliquary',      // the Mother's place: a shrine casket
  w_drowned_undertow: 'skull',        // the drowned, in the undertow
  al_triage: 'spectacles',            // the surgeon's look
  or_the_last_hour: 'hourglass',      // the last of the sand
  al_refill: 'vial',                  // the empty bottle to be refilled (the alembic read as a scale)
  el_stopper_the_jar: 'jar',          // a jar, its mouth waxed shut (the held vial sank into the blue)
  ve_six_seals: 'charter',            // six seals hanging from one charter (a set of loose seals did not read)
  w_coast_call_the_bolt: 'hammer',   // the iron raised to call the bolt (the rod read as a stick, twice)
  ve_balance_the_scale: 'weights', ve_illumination: 'initial', ve_hearthstone: 'hearth',
  ve_drink_the_dregs: 'chalice', ve_give_back: 'ewer', ve_take_into_me: 'chalice',   // the offering bowl read as a palette ve_keep_the_hours: 'candle', ve_mantle: 'hood', ve_copy_the_page: 'book',
};
for (const [id, dev] of Object.entries(READS)) OVR[id] = Object.assign(OVR[id] || {}, { device: dev });
OVR.du_parry = Object.assign(OVR.du_parry || {}, { layout: 'close', zoom: 1.9, objOpt: { hilt: true } });   // the swept hilt alone, no hand: a hand on a long blade read as a stick (L50)
OVR.bw_k_scourge = Object.assign(OVR.bw_k_scourge || {}, { layout: 'close' });
// L57: framing is hashed per card; a hand-picked style only where two same-object cards came out alike (a per-card fix, the same in every batch)
OVR.du_serrated_rhythm = Object.assign(OVR.du_serrated_rhythm || {}, { style: 0 });
OVR.ve_ink_band = Object.assign(OVR.ve_ink_band || {}, { zoom: 1.35 });   // the banded hand big, the sleeve running off the frame   // close on the swept hilt: a blade alone reads as a stick (L46)
OVR.or_augury_of_birds = Object.assign(OVR.or_augury_of_birds || {}, { ground: { dark: 0, washOp: 0.55, soot: 0.3, hatchOp: 0.2, pool: [560, 280, 760, 380] } });   // an open dusk sky behind black birds   // black birds need a lit sky behind them (L45)
// Cole: most Vessel cards become object cards (its figure can barely move). vessel_hero_ids.txt (the pose agent's) lists the
// ones that stay hero cards; until it exists, only the Vessel cards above are forced to objects.
const VESSEL_HEROES = (() => { try { return new Set(require('fs').readFileSync(require('path').join(__dirname, 'vessel_hero_ids.txt'), 'utf8').split(/\s+/).filter(Boolean)); } catch (e) { return null; } })();
for (const id of Object.keys(CARDS)) if (CARDS[id].cls === 'vessel' && (VESSEL_HEROES ? !VESSEL_HEROES.has(id) : READS[id])) OVR[id] = Object.assign(OVR[id] || {}, { kind: 'device' });
// ==== VARIETY PASS (object-variety agent, L58; this block and the files it loads are that agent's). The new objects in
// objects6.js, objects7.js, ... join the library with their defaults (META), and picks.json sets each object card's
// object (id -> key, or id -> { device, act, ang, layout, style, zoom, count, objOpt }). Applied before the pick logic.
(() => {
  const OCv = require('./objcomp'), fsv = require('fs'), pv = require('path');
  for (const fn of fsv.readdirSync(__dirname).filter(n => /^objects([6-9]|\d\d)\.js$/.test(n)).sort()) {
    const m = require('./' + fn); Object.assign(OCv.LIB, m.O);
    for (const [k, d] of Object.entries(m.META || {})) { if (d.ang != null) OCv.ANG[k] = d.ang; if (d.scale) OCv.SCALE[k] = d.scale; if (d.long) OCv.LONG.add(k); if (d.only) OCv.ONLY[k] = d.only; if (d.noTurn) OCv.NO_TURN.add(k); if (d.act) OCv.ACT_DEFAULT[k] = d.act; if (d.gold) OCv.GOLD_OBJECTS.add(k); if (d.water) OCv.WATER_OK.add(k); if (d.scene) OCv.SCENE.add(k); }
  }
  let picks = {}; try { picks = JSON.parse(fsv.readFileSync(pv.join(__dirname, 'picks.json'), 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  for (const [id, p] of Object.entries(picks)) { if (id[0] === '_' || !CARDS[id]) continue; OVR[id] = Object.assign(OVR[id] || {}, typeof p === 'string' ? { device: p } : p); }
})();
// ==== end of the variety pass block
const KIND = { attack: act, cast: act, block };
// ==== HERO STAGING (hero-card agent, round 9; this block and hero_routes.js, hero_staging.js, hero_comp.js are that
// agent's). A hero card earns its hero only when the act is the point: the cards in hero_routes.OBJ become object cards
// (their object comes from picks.json), and every card in hero_routes.HERO is staged by hero_comp.js as its own picture
// (framing, pose, room view and motif; herosim.py checks them).
(() => {
  const HROUTES = require('./hero_routes'), HCOMP = require('./hero_comp');
  for (const id of Object.keys(HROUTES.OBJ)) if (CARDS[id]) OVR[id] = Object.assign(OVR[id] || {}, { kind: 'device' });
  const ctx = { get S() { return module.exports; }, courseOf, roomOf, heroOf };
  for (const k of ['attack', 'cast', 'block']) { const plain = KIND[k]; KIND[k] = (cd, id, o) => HCOMP.has(id) ? HCOMP.heroCard(cd, id, o, ctx) : plain(cd, id, o); }
  // ---- attuned course variants (Cole, 2026-11-25; LESSONS L60). The game shows an attuned card's art for the element its
  // hero is attuned to now (assets/art/cards/<id>_<element>.jpg), falling back to <id>.jpg.
  // - The base <id> of an attuned card is drawn in the Elementalist's starting element (data/heroes.json `attuned`, an
  //   index into the game's ELEMENTS order), which is fire. It is the same picture as <id>~fire.
  // - An attuned card's room follows its course (ROOM_BY_COURSE), not one room for every attuned card.
  // - <id>~<course> builds the base card with only the course changed: the same seed, layout, framing and pose (it is
  //   built under the base id), so it is deterministic under L57. render.js writes it as <id>_<course>.jpg.
  const ELEMENTS = ['fire', 'frost', 'lightning', 'water', 'toxin', 'void'];   // scripts/data.gd ELEMENTS
  const BASE_ELEMENT = ELEMENTS[(JSON.parse(fs.readFileSync('/home/claude/ostium/data/heroes.json', 'utf8')).elementalist.attuned || 0) % ELEMENTS.length];
  for (const id of Object.keys(CARDS)) if (CARDS[id].cat === 'attuned' && !(OVR[id] && OVR[id].course)) OVR[id] = Object.assign(OVR[id] || {}, { course: BASE_ELEMENT });
  delete ROOM_BY_COURSE.attuned;
  const VARIANT = new RegExp('^(.+)~(' + ELEMENTS.join('|') + ')$');
  const baseCard = card, baseDescribe = describe;
  card = function (id) {
    const m = VARIANT.exec(id); if (!m) return baseCard(id);
    const [, cid, course] = m; if (!CARDS[cid]) throw new Error('no card ' + cid + ' for variant ' + id);
    const keep = OVR[cid]; OVR[cid] = Object.assign({}, keep || {}, { course });
    try { const svg = baseCard(cid); LAST_META = Object.assign({}, LAST_META, { id, base: cid, course }); return svg; } finally { if (keep) OVR[cid] = keep; else delete OVR[cid]; }
  };
  describe = id => { const m = VARIANT.exec(id); return baseDescribe(m ? m[1] : id); };
})();
// ==== end of the hero staging block
// test ids: '@<calling>/<kind>[/<course>]' builds a stand-in card so a rig can be checked without a real card
function testCard(id) { const [cls, kind, cat = 'physical', v] = id.slice(1).split('/'); return { name: '', cls, cat, target: 'enemy', fx: kind === 'block' ? [{ t: 'block', n: 5 }] : [{ t: 'dmg', n: 5 }], _kind: kind, _v: v == null ? null : +v }; }
function card(id) {
  allocate();
  if (id.includes('!')) { const [cid, lay] = id.split('!'); OVR[id] = Object.assign({}, OVR[cid] || {}, { layout: lay }); CARDS[id] = CARDS[cid]; }
  const cd = id[0] === '@' ? testCard(id) : CARDS[id] || {}, o = Object.assign({}, OVR[id] || {}, cd._kind ? { kind: cd._kind, v: cd._v } : {});
  let kind = o.kind || kindOf(cd);
  if (KIND[kind] && !ART[id] && !heroOf(cd, courseOf(cd, o))) kind = 'device';   // shared and world cards have no hero
  const fn = ART[id] || KIND[kind] || DEVICE_KIND[kind] || generic;
  const res = fn(cd, id, o);
  LAST_META = res.meta || { id, kind: 'hero' };
  return K.svgDoc(seedOf(id) % 97, res.course, res.defs, res.body, res.finish || {});
}
let LAST_META = null;
// the card and the metadata the checks read
function build(id) { const svg = card(id); return { svg, meta: Object.assign({ id }, LAST_META) }; }
// the object cards of a batch get their layouts and variants together, so the batch spreads (L12, L13, L20)
// L57: nothing about an object card depends on the batch it is rendered in. The only deck-level step is the family
// spread (L42), and it is always computed over the whole deck, once, so a card's object is the same alone or in a run.
let SPREAD_DONE = false;
function allocate() {
  if (SPREAD_DONE) return; SPREAD_DONE = true;
  const pre = []; for (const id of Object.keys(CARDS)) { const cd = CARDS[id]; const o = OVR[id] || {}; let k = o.kind || kindOf(cd); if (KIND[k] && !ART[id] && !heroOf(cd, courseOf(cd, o))) k = 'device'; if (KIND[k] || ART[id]) continue; pre.push({ id, obj: OC.pickObject(cd, id, o) }); }
  OC.spread(pre);
}
function generic(cd) { throw new Error('no composition yet for kind ' + kindOf(cd)); }

// one line saying what a card got: its kind and hero or object (for review sheets)
function describe(id) { const cd = id[0] === '@' ? testCard(id) : CARDS[id] || {}; const o = OVR[id] || {}; let k = cd._kind || o.kind || kindOf(cd); if (KIND[k] && !ART[id] && !heroOf(cd, courseOf(cd, o))) k = 'device'; const h = KIND[k] && !ART[id] ? (heroOf(cd, courseOf(cd, o)) || [])[1] : ART[id] ? 'hand-made' : OC.pickObject(cd, id, o); return k + ' ' + (h || ''); }
module.exports = { SAMPLES, CARDS, card, build, allocate, OVR, worldOf, describe, kindOf, heroOf, roomOf, courseOf, W, H };
