// Pose checks run before a full render (render.js -all), and on its own: node cards/check_poses.js [ids...]
// L5: no calling draws one pose on more than POSE_SHARE of its hero cards.
// L6: a block's hit lands on the guard, clear of the head, on every figure of the calling.
// L24: two-handed grips stay on the grip. L29: pose words do not match path names. L31: hand FX points sit on the hand.
// Frame: the act's FX anchor, both hands and the head land inside the card on every figure.
// L28: arms and held props drawn in front of the head stay FACE_CLEAR figure px from the face point.
// L33: part continuity, by a geometry proxy on the figure's own part polygons: cloth drawn hanging from an arm bone
// turns only a little in total, and the arm's drawing keeps covering each elbow and wrist about as well as at rest.
// (L4 joint limits run in rig.js itself, on load.) Throws with every failure listed.
'use strict';
const K = require('./card_kit');
const E = require('../engine');
const { RIG, FIGURES } = require('./rig');
const POSE_SHARE = 0.4;
const HEAD_CLEAR = 120;     // figure px between a block's hit and the head joint
const MARGIN = 24;          // card px a point must sit inside the card edge
// the figure module and list for each figure key in FIGURES
const MOD = key => key.includes('_') && !/^elementalist$/.test(key) ? (/^(bulwark|duelist|elementalist)_/.test(key) ? 'worlds/hero_paths_A' : 'worlds/hero_paths_B') : null;
const BASE = { bulwark: ['dirAC', 'bulwark'], duelist: ['dirAC', 'duelist'], elementalist: ['dirAC', 'elementalist_fire', 'signs'], alchemist: ['dirAC2', 'alchemist'], oracle: ['dirAC2', 'oracle'], hexweaver: ['dirAC2', 'hexweaver'], vessel: ['worlds/hero_vessel', 'vessel'] };
const figOf = (cls, key) => key === cls ? BASE[cls] : [MOD(key), key];
// the same choice samples.js rigOf makes: first pose whose words match the name, then the note, else by id hash
const seedOf = id => { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 1000 + (h % 8000); };
function pick(card, id, list) {
  const L = RIG[card.cls][list], name = (card.name || '').toLowerCase(), note = (card.note || '').toLowerCase();
  let i = L.findIndex(v => v.words && v.words.test(name)); if (i < 0) i = L.findIndex(v => v.words && v.words.test(note));
  return i < 0 ? seedOf(id) % L.length : i;
}
// card-space points of one pose on one figure, mapped the way samples.js placeHero does
function placed(cls, key, R) {
  const [mod, k, list] = figOf(cls, key), h = K.hero(mod, k, R.pose, list || 'heroes', { hide: R.hide }), A = h.joint('head');
  const M = p => K.mapPt(p, A, R.at, R.scale);
  const bone = ref => (!ref || !h.J[ref[0]]) ? M(h.joint('hand_n')) : ref[1] ? M(h.at(ref[0], ref[1])) : M(h.joint(ref[0]));
  return { h, M, bone, head: M(A), hands: ['hand_n', 'hand_f'].map(n => M(h.joint(n))) };
}
// ==== shapes: each figure's filled part polygons, recorded per bone while it builds (rest coordinates)
// The face point (eyes and nose) of each figure at rest, read off gridded head renders; variants not listed share
// their calling's base figure. N: a third of the 94 px head unit; the closest approved rest drawing sits at 40.
const FACE = { bulwark: [330, 200], duelist: [318, 210], duelist_executioner: [305, 210], elementalist: [350, 240], elementalist_accumulator: [412, 280], elementalist_catalyst: [325, 210], alchemist: [330, 228], oracle: [345, 268], hexweaver: [380, 325], vessel: [300, 225] };
const FACE_CLEAR = 32;
// drape: how far a bone's drawing (with its non-chain children, such as sleeves) hangs below its lower joint, as a share
// of the bone's length. Hanging cloth must keep hanging: its bone turns at most this much in total, parents included.
const DRAPE = [[1.0, 25], [0.5, 45]];
const COVER_R = 16, COVER_DROP = 0.15;   // the joint disc radius, and the most its covered share may drop from rest
const shapeCache = {};
function shapesOf(cls, key) {
  if (shapeCache[key]) return shapeCache[key];
  const [mod, k, l] = figOf(cls, key), proto = E.Fig.prototype, orig = proto.part, polys = {};
  proto.part = function (pts, o) { if (Array.isArray(pts) && pts.length > 2) { const b = this.marks[this.marks.length - 1].bone; (polys[b] = polys[b] || []).push(pts.map(q => [q[0], q[1]])); } return orig.call(this, pts, o); };
  let h0; try { h0 = K.hero(mod, k, {}, l || 'heroes'); } finally { proto.part = orig; }
  return (shapeCache[key] = { h0, polys, runs: h0.f.runs().map(r => r.bone), mod, k, l: l || 'heroes' });
}
const segD = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
const polyDist = (p, poly) => { if (inside(p, poly)) return 0; let d = 1e9; for (let i = 0; i < poly.length; i++) d = Math.min(d, segD(p, poly[i], poly[(i + 1) % poly.length])); return d; };
// a bone with the children that are not the next joint of its chain (sleeves, props, cuffs)
const withKids = (J, b, next) => [b, ...Object.keys(J).filter(c => J[c].parent === b && c !== next)];
function shapeFaults(cls, key, pose) {
  const S = shapesOf(cls, key), J = S.h0.J, P = Object.assign({}, pose, (pose.vary || {})[key] || {});
  const h = K.hero(S.mod, S.k, P, S.l), out = [];
  const posed = (hh, b) => (S.polys[b] || []).map(poly => poly.map(q => hh.at(b, q)));
  // L28: arms and props in front of the head keep clear of the face
  const armOf = b => { while (b) { if (b === 'upperarm_n' || b === 'upperarm_f') return true; b = J[b] && J[b].parent; } return false; };
  const lastHead = S.runs.lastIndexOf('head'), front = [...new Set(S.runs.slice(lastHead + 1))].filter(b => J[b] && armOf(b) && S.polys[b]);
  const F = h.at('head', FACE[key] || FACE[cls]);
  let near = [1e9, ''];
  for (const b of front) for (const poly of posed(h, b)) { const d = polyDist(F, poly); if (d < near[0]) near = [d, b]; }
  if (near[0] < FACE_CLEAR) out.push(`${near[1]} comes ${Math.round(near[0])} px from the face (needs ${FACE_CLEAR})`);
  // L33: drape and joint cover
  const turn = b => { let t = P.lean || 0; while (b) { t += P[b] || 0; b = J[b] && J[b].parent; } return t; };
  for (const s of ['n', 'f']) {
    const chain = ['upperarm_' + s, 'forearm_' + s, 'hand_' + s];
    for (let i = 0; i < 2; i++) {
      const b = chain[i], c = chain[i + 1], a = J[b].pivot, e = J[c].pivot, L = Math.hypot(e[0] - a[0], e[1] - a[1]);
      const pts = withKids(J, b, c).flatMap(x => (S.polys[x] || []).flat()), drape = pts.length ? (Math.max(...pts.map(q => q[1])) - Math.max(a[1], e[1])) / L : 0;
      const lim = (DRAPE.find(([r]) => drape >= r) || [])[1];
      if (lim != null && Math.abs(turn(b)) > lim) out.push(`${b} carries cloth hanging ${drape.toFixed(1)} of its length below it, but turns ${Math.round(turn(b))} (limit ${lim})`);
      // cover: the share of a disc round the joint that the two parts' own drawing covers, against rest
      const set = [...withKids(J, b, c), ...withKids(J, c, chain[i + 2])];
      const cover = hh => { const piv = hh.joint(c), polys = set.flatMap(x => posed(hh, x)); let n = 0, k = 0; for (let dx = -COVER_R; dx <= COVER_R; dx += 4) for (let dy = -COVER_R; dy <= COVER_R; dy += 4) { if (dx * dx + dy * dy > COVER_R * COVER_R) continue; n++; const q = [piv[0] + dx, piv[1] + dy]; if (polys.some(pl => inside(q, pl))) k++; } return k / n; };
      const c0 = cover(S.h0), c1 = cover(h);
      if (c1 < c0 - COVER_DROP) out.push(`the ${c.replace('forearm', 'elbow').replace('hand', 'wrist')} opens: its disc is ${Math.round(c1 * 100)}% covered against ${Math.round(c0 * 100)}% at rest`);
    }
  }
  return out;
}
function shapes() {
  const bad = [];
  for (const [cls, figs] of Object.entries(FIGURES)) for (const list of ['act', 'block']) RIG[cls][list].forEach((R, i) => {
    for (const key of Object.keys(figs)) for (const f of shapeFaults(cls, key, R.pose)) bad.push(`${cls}.${list}[${i}] on ${key}: ${f}`);
  });
  return bad;
}
function geometry() {
  const bad = [], inCard = p => p[0] > MARGIN && p[0] < K.W - MARGIN && p[1] > MARGIN && p[1] < K.H - MARGIN;
  for (const [cls, figs] of Object.entries(FIGURES)) for (const list of ['act', 'block']) RIG[cls][list].forEach((R, i) => {
    for (const key of Object.keys(figs)) {
      const P = placed(cls, key, R), where = `${cls}.${list}[${i}] on ${key}`, ref = R.weapon || R.hand || R.face;
      const a = P.bone(ref);
      if (!inCard(a)) bad.push(`${where}: FX anchor ${ref && ref[0]} lands off the card at ${a.map(Math.round)}`);
      if (!inCard(P.head)) bad.push(`${where}: head lands off the card at ${P.head.map(Math.round)}`);
      if (ref && ref[1] && /^hand_/.test(ref[0]) && P.h.J[ref[0]]) { const j = P.M(P.h.joint(ref[0])), d = Math.hypot(a[0] - j[0], a[1] - j[1]) / R.scale; if (d > 45) bad.push(`${where}: FX point on ${ref[0]} sits ${Math.round(d)} figure px off that hand`); }
      if (list === 'block') {
        const hit = R.face[1] ? a : [a[0] + (R.off || [120, 10])[0], a[1] + (R.off || [120, 10])[1]];
        const d = Math.hypot(hit[0] - P.head[0], hit[1] - P.head[1]) / R.scale;
        if (d < HEAD_CLEAR) bad.push(`${where}: block hit is ${Math.round(d)} figure px from the head joint (needs ${HEAD_CLEAR}), so it lands on the face`);
      }
    }
  });
  return bad;
}
// pose words must not match the path names that card notes use ("Executioner" once picked the cut, "Mirrorhex" the mirror)
const PATH_NAMES = ['last bastion', 'ironwarden', 'thornguard', 'bladedancer', 'executioner', 'bloodletter', 'accumulator', 'catalyst', 'prismatic', 'transmuter', 'plaguewright', 'apothecary', 'chronomancer', 'augur', 'fatebinder', 'pactbound', 'doomsayer', 'mirrorhex', 'bulwark', 'duelist', 'elementalist', 'alchemist', 'oracle', 'hexweaver', 'vessel'];
function words() {
  const bad = [];
  for (const [cls, rig] of Object.entries(RIG)) for (const list of ['act', 'block']) rig[list].forEach((R, i) => {
    for (const n of PATH_NAMES) if (R.words && R.words.test(n)) bad.push(`${cls}.${list}[${i}]: words ${R.words} match the name "${n}"`);
  });
  return bad;
}
// two-handed holds: the far hand must stay on the grip (its rest place in the near hand's frame)
function grips() {
  const { TWO_HANDED } = require('./rig'), bad = [];
  for (const [cls, figs] of Object.entries(FIGURES)) for (const list of ['act', 'block']) RIG[cls][list].forEach((R, i) => {
    for (const key of Object.keys(figs)) if (TWO_HANDED.includes(key)) {
      const [mod, k, l] = figOf(cls, key), h = K.hero(mod, k, R.pose, l || 'heroes'), h0 = K.hero(mod, k, {}, l || 'heroes');
      const want = h.at('hand_n', h0.J.hand_f.pivot), got = h.joint('hand_f'), d = Math.hypot(want[0] - got[0], want[1] - got[1]);
      if (d > 4) bad.push(`${cls}.${list}[${i}] on ${key}: far hand is ${d.toFixed(1)} px off the grip`);
    }
  });
  return bad;
}
function shares(S, ids) {
  const bad = [], count = {}, staged = require('./hero_comp').allocation(S);
  for (const id of ids) {
    const card = S.CARDS[id]; if (!card || !RIG[card.cls]) continue;
    const kind = S.describe(id).split(' ')[0]; if (!['attack', 'block', 'cast'].includes(kind)) continue;
    const st = staged[id], list = kind === 'block' ? 'block' : 'act', c = (count[card.cls] = count[card.cls] || { n: 0 }), k = st ? st.pose : list + pick(card, id, list);   // a staged hero card counts the pose it is drawn in (hero_comp.js)
    c.n++; c[k] = (c[k] || 0) + 1;
  }
  const lines = [];
  for (const [cls, c] of Object.entries(count)) {
    const parts = Object.entries(c).filter(([k]) => k !== 'n').sort();
    lines.push(`${cls} (${c.n} cards): ` + parts.map(([k, v]) => `${k} ${v}`).join(', '));
    for (const [k, v] of parts) if (v / c.n > POSE_SHARE) bad.push(`${cls}: pose ${k} on ${v} of ${c.n} cards (${Math.round(v / c.n * 100)}%, cap ${POSE_SHARE * 100}%)`);
  }
  return { bad, lines };
}
function run(S, ids) {
  ids = ids && ids.length ? ids : Object.keys(S.CARDS).filter(id => !id.endsWith('+'));
  const sh = shares(S, ids), bad = sh.bad.concat(words(), grips(), geometry(), shapes());
  // the staged hero poses (hero_staging.js): every rig check above plus legs and framings, on every figure
  bad.push(...require('./hero_staging').validate());
  console.log('pose shares (L5):\n  ' + sh.lines.join('\n  '));
  if (bad.length) throw new Error('pose checks failed (LESSONS L5, L6, L24, L28, L29, L30, L31, L33):\n  ' + bad.join('\n  '));
  console.log('pose checks pass: shares (L5), block hits (L6), two-handed grips (L24), words (L29), frame (L30), hand FX points (L31), face clear (L28), drape and joint cover (L33), staged hero poses with legs and framings');
}
module.exports = { run, shares, geometry, words, grips, shapes, shapeFaults, shapesOf, FACE, FACE_CLEAR, DRAPE, pick, placed, POSE_SHARE, HEAD_CLEAR };
if (require.main === module) run(require('./samples'), process.argv.slice(2));
