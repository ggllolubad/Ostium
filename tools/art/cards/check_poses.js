// Pose checks run before a full render (render.js -all), and on its own: node cards/check_poses.js [ids...]
// L5: no calling draws one pose on more than POSE_SHARE of its hero cards.
// L6: a block's hit lands on the guard, clear of the head, on every figure of the calling.
// L24: two-handed grips stay on the grip. L29: pose words do not match path names. L31: hand FX points sit on the hand.
// Frame: the act's FX anchor, both hands and the head land inside the card on every figure.
// (L4 joint limits run in rig.js itself, on load.) Throws with every failure listed.
'use strict';
const K = require('./card_kit');
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
  const bad = [], count = {};
  for (const id of ids) {
    const card = S.CARDS[id]; if (!card || !RIG[card.cls]) continue;
    const kind = S.describe(id).split(' ')[0]; if (!['attack', 'block', 'cast'].includes(kind)) continue;
    const list = kind === 'block' ? 'block' : 'act', c = (count[card.cls] = count[card.cls] || { n: 0 }), k = list + pick(card, id, list);
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
  const sh = shares(S, ids), bad = sh.bad.concat(words(), grips(), geometry());
  console.log('pose shares (L5):\n  ' + sh.lines.join('\n  '));
  if (bad.length) throw new Error('pose checks failed (LESSONS L5, L6, L24, L29, L30, L31):\n  ' + bad.join('\n  '));
  console.log('pose checks pass: shares (L5), block hits (L6), two-handed grips (L24), words (L29), frame (L30), hand FX points (L31)');
}
module.exports = { run, shares, geometry, words, grips, pick, placed, POSE_SHARE, HEAD_CLEAR };
if (require.main === module) run(require('./samples'), process.argv.slice(2));
