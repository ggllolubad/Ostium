// Object card compositions: picking the object, laying it out, its act, a hand, void holes, and the metadata every
// check in checks.js reads. samples.js hands every object card (device, rite, curse, flask) to deviceCard().
// Read LESSONS.md first; each rule below names the lesson it serves.
'use strict';
const K = require('./card_kit');
const OB = require('./objects');
const O2 = require('./objects2').O;
const O3 = require('./objects3').O;
const O4 = require('./objects4').O;
const O5 = require('./objects5').O;
const { E, W, H, INK, COURSE, INK6, BLOOD, D } = K;
const { add, sub, mul, lerp, rot, mix, rng, norm, len, ell } = E;

// ==== the library
const FLASK_COL = { physical: ['#5a4a30', '#6a4a2a'], fire: ['#6a5034', '#8a4a2a'], frost: ['#6a7a82', '#9aaab0'], lightning: ['#6a6448', '#8a8060'], water: ['#3e4e46', '#3e4a50'], toxin: ['#4a5636', '#5e6636'], void: ['#3a3048', '#2a1a3a'] };
const BREWS = ['#6a4a2a', '#3a4a52', '#5a6236', '#4a3a4e', '#7a7050', '#5a3226'];   // L14: brews differ in value and murk, not in saturated hue
const LIB = Object.assign({},
  { flask: (f, o) => { const p = OB.flask(f, Object.assign({ glass: (FLASK_COL[o.course] || FLASK_COL.physical)[0], liquid: o.brew || (FLASK_COL[o.course] || FLASK_COL.physical)[1], skull: o.course === 'toxin' }, o)) || {};
      if (f.bb && p.neck) { const bw = f.bb[2] - f.bb[0]; p.sig = [f.bb[0] + bw * 0.1, p.neck[1] - 20, f.bb[2] - bw * 0.1, f.bb[3] - 10]; } if (p.neck) p.grip = { c: p.neck, thumb: (o.ang || 0) - Math.PI / 2 }; return p; },   // L16: the cork may crop, the neck and body may not
    hourglass: OB.hourglass, mirror: OB.mirror, bell: OB.bell, shield: (f, o) => OB.shield(f, Object.assign({ s: 1.7, bites: [] }, o)) },
  O2, O3, O4, O5);
LIB.cauldron = undefined; delete LIB.cauldron; delete LIB.hymnal;
// per-object defaults: tilt, base scale, long (crossed when counted), allowed water (L15)
const ANG = { phial: -0.55, feather: -0.6, sword: -0.35, rapier: -0.35, knife: -0.4, needle: -0.5, key: -0.5, brush: -0.6, bone: -0.35, hammer: -0.25, stinger: -0.6, tongs: -0.35, coalpan: -0.1, splint: -0.3, scroll: -0.12, cord: 1.3, shard: 0.15, handbell: -0.35, scourge: 0.1 };
const SCALE = { ring: 1.0, coins: 1.0, feather: 1.05, signet: 1.0, knife: 1.2, needle: 1.15, stinger: 1.1, bone: 1.1, key: 1.05, vial: 1.15, phial: 1.15, jar: 1.15, skull: 1.05, cup: 1.05, shard: 1.15, poppet: 1.05, bread: 1.05, boot: 1.05 };
const LONG = new Set(['sword', 'rapier', 'brush', 'feather', 'knife', 'needle', 'key', 'bone', 'rod', 'hammer', 'tongs', 'coalpan', 'splint', 'shard', 'stinger', 'candle', 'scourge']);
const WATER_OK = new Set(['anchor', 'skull', 'bell', 'keg']);   // L15: heavy things only

// ==== picking (L11, L23): the card name's noun first, then the audit table, then word scoring
const NOUNS = [
  // forced names first: card names whose noun is not the object, or would hit a wrong word below
  [/wax the mouth/, 'vial'], [/crossed glass/, 'mirror'], [/^bind$/, 'bound'], [/ink band/, 'inkarm'], [/steady hand/, 'vial'], [/wheel turns/, 'hourglass'], [/lens glare/, 'spectacles'],
  [/handbell/, 'handbell'], [/\bbells?\b|knell|toll|tailors/, 'bell'], [/phial/, 'phial'], [/\bflasks?\b|\bopus\b/, 'flask'], [/\bdraught|tincture|bottle|tonic|elixir|simple\b/, 'vial'],
  [/\bjar\b|\bpot\b|firepot/, 'jar'], [/powder|\bkeg\b|blast/, 'keg'], [/hourglass|\bsand\b/, 'hourglass'], [/\bclock|\bwatch\b|second hand|midnight|\bhour\b/, 'clock'],
  [/mirror|\bglass\b/, 'mirror'], [/shard|splinter/, 'shard'], [/bandage|\blinen\b|dressing/, 'bandage'], [/\bwound|festering|\bsores?\b/, 'wrapped'], [/stitch|sewn|suture|barber/, 'suture'],
  [/\brope|\bhook\b|keelhaul|lash it/, 'rope'], [/\bchain\b/, 'chain'], [/\bcord\b|\bknot|thread|\bbind\b|ladder/, 'cord'], [/augury|\bbirds?\b|rook|crow|wren/, 'birds'], [/feather/, 'feather'],
  [/knucklebone|\bbones\b|bone pouch/, 'knuckles'], [/\bbone\b/, 'bone'], [/skull/, 'skull'], [/candle|taper|\bwax\b|vigil|witching/, 'candle'], [/\blamp\b|lantern/, 'lantern'],
  [/brazier|\bcoals?\b/, 'brazier'], [/broth/, 'broth'], [/\bbowl\b|staunch|letting|haemorrhage/, 'basin'], [/\bladle\b|milk|stew/, 'bowl'], [/\bcup\b|chalice|cupping/, 'cup'],
  [/gold leaf/, 'goldleaf'], [/\balms\b|purse/, 'purse'], [/\bcoins?\b/, 'coins'], [/scale|balance/, 'scales'], [/\bkey\b|unwind|wind the spring/, 'key'],
  [/hymn|psalm|neume/, 'hymnal'], [/\bbook|\bpage\b|codex|ledger|capital|rubric\b/, 'book'], [/scroll|sentence|signed|\bnames?\b/, 'scroll'], [/\bbrush\b|scatter ink|flung ink|wash/, 'brush'], [/\bink\b|\bnib\b|inkpot/, 'inkpot'],
  [/\bring\b|sigil ring/, 'signet'], [/\beye\b|gaze|\bseen\b|stare/, 'eye'], [/\bdoor\b|threshold|\bgate\b|dread/, 'doorajar'], [/\bshield\b|\bward\b/, 'shield'], [/\bsword\b|headsman|sentence|judgment|condemned/, 'sword'],
  [/rapier|parry|riposte|\bguard\b|\bmeasure\b/, 'rapier'], [/knife|lancet|\bvein\b|blades?/, 'knife'], [/anchor|\bsea\b|undertow/, 'anchor'], [/lightning|\bbolt\b|\bstorm\b|\brod\b/, 'rod'],
  [/sting|wasp|venom|hive/, 'stinger'], [/\bhood\b/, 'hood'], [/\brats?\b/, 'ratsack'], [/\bsack\b|\bbag\b|\bdirt\b|quicklime/, 'sack'], [/herb|bloom|\bseed|spore|garden/, 'herbs'],
  [/bread|sin-eater/, 'bread'], [/\bsalt\b/, 'salt'], [/anvil|ringing/, 'anvil'], [/hammer|wedge|weld/, 'hammer'], [/tongs|ember|cauteri/, 'tongs'], [/bellows/, 'bellows'],
  [/alembic|\bstill\b|\bbrew\b|decant|rectify/, 'alembic'], [/crucible|athanor|red work|great work/, 'crucible'], [/mortar|hartshorn|pestle/, 'mortar'], [/reservoir|vessel|gauge|stopper|brass band/, 'vessel'],
  [/\bink band|bands?\b/, 'inkarm'], [/\bpalm\b|\bhand\b|finger|touch/, 'hand'], [/barbs?|thorn|scourge|flagellant|hair shirt/, 'scourge'], [/rhythm|bellrope|bell rope/, 'bellrope'],
  [/glare|\blens\b/, 'beacon'], [/spectacle|steady hand|\bsight\b|duellist's eye|diagnosis/, 'spectacles'], [/poppet|doll|effigy/, 'poppet'], [/relic|reliquary|saint/, 'reliquary'], [/\bboot\b|\bstep\b|wade|feet/, 'boot'],
];
// hand picks the audit settled on, where the name has no library noun (213 rows; see devices.csv)
const AUDIT = require('./audit.json');
function nounOf(card) { const n = (card.name || '').toLowerCase(); for (const [re, k] of NOUNS) if (re.test(n) && LIB[k]) return k; return null; }
const OBJ_BY_CLS = { alchemist: 'vial', oracle: 'hourglass', hexweaver: 'poppet', elementalist: 'inkpot', bulwark: 'shield', duelist: 'knife', vessel: 'reliquary' };
const OBJ_BY_COURSE = { physical: 'boot', fire: 'brazier', frost: 'bandage', water: 'anchor', toxin: 'herbs', void: 'candle', lightning: 'rod', attuned: 'inkpot' };
// o.device (a per-card override) wins, then the name's noun, then the audit table, then the calling or course
// L12 in a full run: past 20 cards an object hands its extra cards to its family, in turn (an override, so L23 allows it)
const FAMILY = { palm: ['offering', 'chalice', 'ewer'], offering: ['chalice', 'palm', 'initial'], ewer: ['chalice', 'offering'], chalice: ['ewer', 'offering'], hearth: ['candle', 'hood'], weights: ['seal', 'initial'], initial: ['book', 'seal'], seal: ['initial', 'weights'], hood: ['laundry', 'reliquary'], vial: ['phial', 'flask', 'jar', 'cup'], hand: ['inkarm', 'signet', 'goldleaf', 'spectacles'], inkpot: ['brush', 'book', 'scroll'], candle: ['lantern', 'brazier'], herbs: ['mortar', 'jar'], knife: ['rapier', 'sword', 'needle'], skull: ['bone', 'knuckles'], bandage: ['wrapped', 'suture'], bell: ['handbell', 'anvil'], book: ['scroll', 'hymnal'], poppet: ['needle', 'cord'], hourglass: ['clock'], boot: ['sack'], shield: ['door'] };
const SPREAD = {};
function spread(list) { // list: [{ id, obj }] of a big batch, in order
  for (const k in SPREAD) delete SPREAD[k];
  const count = {}; list.forEach(e => count[e.obj] = (count[e.obj] || 0) + 1); const seen = {};
  for (const e of list) { seen[e.obj] = (seen[e.obj] || 0) + 1; if (seen[e.obj] <= 20 || !FAMILY[e.obj]) continue;
    const alt = FAMILY[e.obj].filter(k => LIB[k] && (count[k] || 0) < 20).sort((a, b) => (count[a] || 0) - (count[b] || 0))[0]; if (!alt) continue;
    SPREAD[e.id] = alt; count[alt] = (count[alt] || 0) + 1; count[e.obj] -= 1; e.obj = alt; }
}
// the Vessel's object cards (Cole: holy; its themes are held courses, Take, Give and Even, the Hearth, the Mouth and the
// Whole): its own objects, chosen by the card's words, name first
const VESSEL_WORDS = [[/hearth|warm|stove|coal|stoke|fire/, 'hearth'], [/\bseals?\b|sealed|rivet/, 'seal'], [/weigh|balance|even|level|weight|match|equal/, 'weights'],
  [/page|illumin|initial|copy|script|rule line|letter|gilt/, 'initial'], [/drink|swallow|gorge|dregs|chew|taste|bite|mouthful/, 'chalice'], [/spit|give|flood|pour|empt|return|retch|exhale|breathe out/, 'ewer'],
  [/take|gather|sponge|draw|carry|soak|conduit|pass through|lend/, 'offering'], [/mantle|robe|shelter|sleeve|spread arms|shoulder|lift/, 'hood'], [/hour|watch|night|vigil|sleep/, 'candle'],
  [/palm|hand|band|touch|unclench|nimbus|ink/, 'palm'], [/upright|stand|place|mother|keep/, 'reliquary']];
function vesselPick(card) { const n = (card.name || '').toLowerCase(), t = n + ' ' + (card.note || '').toLowerCase(); for (const src of [n, t]) for (const [re, k] of VESSEL_WORDS) if (re.test(src)) return k; return 'offering'; }
function pickObject(card, id, o = {}) {
  if (o.device && LIB[o.device]) return o.device;
  if (SPREAD[id]) return SPREAD[id];
  if (card.cls === 'vessel') return vesselPick(card);
  const nn = nounOf(card); if (nn) return nn;
  const a = AUDIT[id]; if (a && LIB[a]) return a;
  const note = (card.note || '').toLowerCase(); for (const [re, k] of NOUNS) if (re.test(note) && LIB[k]) return k;
  return OBJ_BY_CLS[card.cls] || OBJ_BY_COURSE[card.cat] || 'skull';
}

// ==== state words (L21) and acts (L20)
function stateOf(card) {
  const t = ((card.name || '') + ' ' + (card.note || '')).toLowerCase();
  return { frozen: /frozen|freez|frost|\brime\b|\bice\b|\bicy\b/.test(t), clean: /\bclean\b|\bfresh\b/.test(t), broken: /broken|cracked|\bcracks?\b|shatter|\bsplit/.test(t), empty: /\bempty\b/.test(t) };
}
const STATE_RULES = { frozen: { forbid: ['steam'], require: ['rime'] }, clean: { forbid: ['stain', 'blood'] }, broken: { require: ['crack'] }, empty: { forbid: ['contents'] } };
// the act an object is caught in: words in the card first, then the object's own default
const ACT_WORDS = [[/wheel turns/, 'swing'], [/steady hand/, 'drip'], [/wax the mouth/, 'press'], [/lens glare/, 'glare'], [/\bpour|\bspill|\btip\b|decant|runs? over|\bflood/, 'pour'], [/burst|shatter|\bbreak|smash|explode|\bblast/, 'burst'], [/\bswing|\blash|\bstrike|\bhammer|\bdrive|\bslam/, 'swing'], [/\bthrow|\bfling|\bflung|\bhurl|\btoss|\bscatter|\bspit/, 'fling'],
  [/\bring\b|\btoll|\bknell|\bchime/, 'ring'], [/\bburn|\bfire\b|flame|kindle|ignite|smoulder/, 'burn'], [/\bdrip|\bbleed|let it run|\bweep/, 'drip'], [/\bcrack|\bsplit|\bsnap/, 'crack']];
const ACT_DEFAULT = { flask: 'burst', vial: 'pour', phial: 'crack', jar: 'burst', keg: 'burn', cup: 'pour', basin: 'pour', bowl: 'pour', broth: 'freeze', bell: 'ring', handbell: 'ring', anvil: 'ring', candle: 'burn', lantern: 'burn', brazier: 'burn', crucible: 'burn',
  coalpan: 'burn', tongs: 'burn', sword: 'swing', rapier: 'swing', knife: 'swing', hammer: 'swing', scourge: 'swing', rod: 'bolt', anchor: 'swing', rope: 'fling', chain: 'swing', brush: 'fling', inkpot: 'drip', sack: 'fling', ratsack: 'burst',
  salt: 'pour', herbs: 'fling', bandage: 'unspool', wrapped: 'drip', suture: 'drip', inkarm: 'drip', hand: 'drip', goldleaf: 'press', feather: 'fling', birds: 'fling', knuckles: 'fling', coins: 'fling', purse: 'fling', scales: 'swing',
  clock: 'crack', hourglass: 'drip', mirror: 'crack', shard: 'swing', beacon: 'glare', spectacles: 'crack', book: 'turn', hymnal: 'turn', scroll: 'fling', cord: 'swing', poppet: 'drip', needle: 'drip', bone: 'crack', skull: 'crack',
  eye: 'drip', doorajar: 'open', shield: 'swing', door: 'swing', hood: 'drip', bound: 'swing', reliquary: 'glare', boot: 'fling', alembic: 'drip', mortar: 'fling', bellows: 'blow', vessel: 'drip', signet: 'swing', bellrope: 'swing', key: 'swing',
  splint: 'crack', tourniquet: 'swing', wasp: 'fling', shears: 'swing', laundry: 'drip', urn: 'fling', weights: 'press', initial: 'turn', seal: 'press', hearth: 'burn', chalice: 'pour', ewer: 'pour', offering: 'drip', palm: 'drip', bread: 'fling', stinger: 'drip', reliquary2: 'glare' };

// ==== measured figure: records part bounding boxes and every red or gold fill, so the checks can read them (L14)
const RED_OK = new Set(['#4c0c08', '#5c0f0b', '#6a1810', '#7a1810', '#460b07', '#661510', '#3a0e0a', '#2a0a06', '#7a2418', '#a83020', '#8e1f17', '#7a1a12', '#5a1a12']);   // blood, rubric, doom
const GOLD_OBJECTS = new Set(['coins', 'purse', 'reliquary', 'goldleaf']);                                 // money and holy things
function hsv(hex) { const h = hex.replace('#', ''); if (h.length !== 6) return null; const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let hu = 0; if (d) { hu = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hu *= 60; if (hu < 0) hu += 360; } return [hu, mx ? d / mx : 0, mx]; }
const isRed = c => { const v = hsv(c); return v && (v[0] >= 345 || v[0] <= 12) && v[1] > 0.5 && v[2] > 0.25; };
const isGold = c => { const v = hsv(c); return v && v[0] >= 40 && v[0] <= 56 && v[1] > 0.45 && v[2] > 0.45; };
function measuredFig(seed) {
  const f = K.objFig(seed), part = f.part.bind(f), flat = f.flat.bind(f);
  f.bb = [1e9, 1e9, -1e9, -1e9]; f.parts = []; f.colours = [];
  const note = (pts, fill) => { if (Array.isArray(pts) && pts.length > 2) { const q = E.bbox(pts); f.bb = [Math.min(f.bb[0], q[0]), Math.min(f.bb[1], q[1]), Math.max(f.bb[2], q[2]), Math.max(f.bb[3], q[3])]; f.parts.push(q); } if (fill && /^#/.test(fill)) f.colours.push(fill.toLowerCase()); };
  f.part = (pts, o = {}) => { note(pts, o.fill); return part(pts, o); };
  const line = f.line.bind(f);
  f.line = (pts, w, col, o) => { if (Array.isArray(pts) && pts.length > 1 && w >= 6 && !(o && o.op < 0.5)) { const q = E.bbox(pts); f.bb = [Math.min(f.bb[0], q[0] - w / 2), Math.min(f.bb[1], q[1] - w / 2), Math.max(f.bb[2], q[2] + w / 2), Math.max(f.bb[3], q[3] + w / 2)]; f.parts.push([q[0] - w / 2, q[1] - w / 2, q[2] + w / 2, q[3] + w / 2]); } return line(pts, w, col, o); };   // body strokes (rings, ropes, blades) count; thin detail lines do not
  f.flat = (pts, fill, o) => { if (Array.isArray(pts) && pts.length > 2) f.colours.push(String(fill).toLowerCase()); return flat(pts, fill, o); };
  return f;
}

// ==== surfaces and props of the room (card space)
const blobAt = (r, c, w, h) => { const o = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; o.push([c[0] + Math.cos(a) * w * (0.7 + r() * 0.5), c[1] + Math.sin(a) * h * (0.7 + r() * 0.5)]); } return o; };
function surface(seed, kind, y) {
  const f = K.objFig(seed), r = f.r;
  if (kind === 'ledge') {
    const face = [[-30, y], [300, y - 6], [700, y + 4], [1150, y - 4], [1150, H + 30], [-30, H + 30]];
    f.part(face, { fill: '#6a645a', shade: 0.4, tex: 'mottle' + seed, texOp: 0.8 });
    f.part([[-30, y], [1150, y - 4], [1150, y + 16], [-30, y + 18]], { fill: '#8a8478', shade: 0.3, inkW: 1.4, cast: false });
    D.dress(f, face, { op: 0.4, dir: 0.05 });
    for (let i = 0; i < 6; i++) D.chip(f, [60 + i * 190 + r() * 60, y + 2], 9 + r() * 8, 0);
    for (let i = 0; i < 3; i++) D.crack(f, [100 + r() * 900, y + 20], 1.3 + r() * 0.4, 90, { n: 5, lip: '#a8a49a' });
    for (let i = 0; i < 5; i++) f.flat(blobAt(r, [r() * W, y + 8 + r() * 20], 30 + r() * 30, 8), '#3e4a28', { op: 0.6 });
    for (let i = 1; i < 4; i++) f.line([[i * 290 + r() * 40, y + 18], [i * 290 + r() * 40 + 6, H + 20]], 2, INK, { op: 0.7 });
  } else if (kind === 'table') { // an oak table top in perspective: planks running away, a worn front edge
    const top = [[-40, y], [1160, y], [1160, H + 30], [-40, H + 30]];
    f.part(top, { fill: '#6a4a30', shade: 0.35, tex: 'wood' + seed, texOp: 0.9 });
    for (let i = -6; i < 12; i++) f.line([[560 + i * 30, y], [560 + i * 120, H + 30]], 2, INK, { op: 0.6 });
    f.part([[-40, H - 30], [1160, H - 30], [1160, H + 30], [-40, H + 30]], { fill: '#4a3220', shade: 0.4, inkW: 1.6, cast: false });
    D.dress(f, top, { op: 0.35, dir: 1.4 });
    for (let i = 0; i < 4; i++) { f.line(ell([200 + r() * 700, y + 40 + r() * 80], 30 + r() * 20, 8, 0, 14).concat([]), 1.2, '#2a1a0c', { op: 0.4 }); }
    for (let i = 0; i < 3; i++) D.stain(f, [r() * W, y + 30 + r() * 100], 30 + r() * 20, '#2a1a0c', { op: 0.3 });
  } else if (kind === 'floor') { // flagstones in perspective, cracked, grime in the joints
    const fl = [[-40, y], [1160, y], [1160, H + 30], [-40, H + 30]];
    f.part(fl, { fill: '#5a564e', shade: 0.35, tex: 'mottle' + seed, texOp: 0.9 });
    const rows = [y, y + 34, y + 84, y + 160, H + 30];
    rows.slice(1, -1).forEach(yy => f.line([[-40, yy], [1160, yy + (r() - 0.5) * 6]], 2.2, INK, { op: 0.7 }));
    for (let k = 0; k < rows.length - 1; k++) { const n = 6 - k; for (let i = 0; i <= n; i++) { const x0 = 560 + (i - n / 2) * (1120 / n) * (0.6 + k * 0.25) + (k % 2) * 40; f.line([[x0, rows[k]], [x0 + (x0 - 560) * 0.25, rows[k + 1]]], 2, INK, { op: 0.6 }); } }
    D.dress(f, fl, { op: 0.35, dir: 0.05 });
    for (let i = 0; i < 3; i++) D.crack(f, [100 + r() * 900, y + 60 + r() * 80], r() * 3, 80, { n: 4, lip: '#9a968a' });
  } else if (kind === 'niche') { // a stone niche in a wall: the arch, its shadowed back, a sill the object stands on
    const wall = [[-40, -40], [1160, -40], [1160, H + 40], [-40, H + 40]];
    f.part(wall, { fill: '#5e5a52', shade: 0.3, tex: 'mottle' + seed, texOp: 0.8 });
    for (let i = 0; i < 8; i++) f.line([[-40, 40 + i * 80], [1160, 40 + i * 80]], 1.6, INK, { op: 0.5 });
    const cx = 560, niche = [[cx - 300, y], [cx - 300, 120], [cx - 220, 40], [cx - 100, 10], [cx + 100, 10], [cx + 220, 40], [cx + 300, 120], [cx + 300, y]];
    f.part(niche, { fill: '#1e1a16', shade: 0.2, inkW: 2.4, hatch: false, cast: false });
    f.part([[cx - 320, y], [cx + 320, y], [cx + 340, y + 40], [cx - 340, y + 40]], { fill: '#7a766c', shade: 0.35, inkW: 1.6, tex: 'mottle' + seed, texOp: 0.6 });
    D.dress(f, wall, { op: 0.3 });
  }
  return K.figSVG(f);
}
function beam(seed, hookX) {
  const f = K.objFig(seed), r = f.r, b = [[-30, -20], [1150, -20], [1150, 62], [-30, 74]];
  f.part(b, { fill: '#5b412a', shade: 0.45, tex: 'wood' + seed, texOp: 0.9 }); D.dress(f, b, { op: 0.45 });
  f.line([[-30, 70], [1150, 58]], 2, '#a88a62', { op: 0.6 });
  for (const x of [120, hookX - 70, hookX + 70, 980]) f.rivet([x, 30], 5, '#6a6a66');
  f.part([[hookX - 16, 56], [hookX + 16, 54], [hookX + 14, 84], [hookX - 14, 86]], { fill: '#3a3a3c', shade: 0.4, inkW: 1.3 });
  return K.figSVG(f);
}
function water(r, y, course) {
  const col = mix(COURSE[course === 'physical' ? 'water' : course].deep, '#16232c', 0.5);
  let s = `<path d="M-20,${y} Q300,${y - 6} 560,${y + 2} T1140,${y} L1140,${H + 20} L-20,${H + 20}Z" fill="${col}" opacity="0.82"/>`;
  for (let i = 0; i < 9; i++) { const yy = y + 8 + i * 16 + r() * 8, x0 = r() * 300, x1 = x0 + 200 + r() * 700; s += `<path d="M${x0.toFixed(1)},${yy.toFixed(1)}Q${((x0 + x1) / 2).toFixed(1)},${(yy - 4).toFixed(1)} ${x1.toFixed(1)},${yy.toFixed(1)}" stroke="${i % 3 ? INK : '#c8d4d8'}" stroke-width="${(1.2 + r()).toFixed(1)}" fill="none" opacity="${i % 3 ? 0.55 : 0.4}" stroke-dasharray="${(30 + r() * 80).toFixed(0)} ${(8 + r() * 30).toFixed(0)}"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
// contact shadow where an object meets its surface (L9, finding g)
const contactShadow = (x0, x1, y) => `<ellipse cx="${((x0 + x1) / 2).toFixed(1)}" cy="${(y + 4).toFixed(1)}" rx="${((x1 - x0) * 0.52).toFixed(1)}" ry="12" fill="#0c0806" opacity="0.6" filter="url(#kSoft)"/><ellipse cx="${((x0 + x1) / 2).toFixed(1)}" cy="${(y + 2).toFixed(1)}" rx="${((x1 - x0) * 0.4).toFixed(1)}" ry="5" fill="#0c0806" opacity="0.7"/>`;

// ==== the calling's real hand (finding e): the hero's forearm and hand runs from card_figure posing, turned onto a grip
const HANDS = {
  bulwark: { mod: 'dirAC', key: 'bulwark', grip: [327, 416], axis: Math.atan2(236 - 424, 500 - 318), scale: 2.4 },
  duelist: { mod: 'dirAC', key: 'duelist', grip: [444, 396], axis: Math.atan2(518 - 396, 588 - 446), scale: 2.6, inline: true },
};
const HAND_OF = { bulwark: 'bulwark', duelist: 'duelist' };
function heroHand(cls, gripCard, thumbAng, sc, seedFlip) {
  const hk = HAND_OF[cls] || (seedFlip ? 'bulwark' : 'duelist'), Hd = HANDS[hk];
  const h = K.hero(Hd.mod, Hd.key, {}, 'heroes', { only: ['forearm_n', 'hand_n'] });
  const s = Math.min(Hd.scale * sc, 3.3), th = thumbAng - Hd.axis;   // the hand keeps near hero scale, never a giant fist over the object
  const elbow = h.joint('forearm_n'), dirE = rot(sub(elbow, Hd.grip), th), elbowCard = add(gripCard, mul(dirE, s));
  const tf = `translate(${gripCard[0].toFixed(1)},${gripCard[1].toFixed(1)}) rotate(${(th * 180 / Math.PI).toFixed(1)}) scale(${s.toFixed(3)}) translate(${-Hd.grip[0]},${-Hd.grip[1]})`;
  const ang = Math.atan2(dirE[1], dirE[0]), edge = Math.abs(Math.cos(ang)) > Math.abs(Math.sin(ang)) ? (Math.cos(ang) > 0 ? 'right' : 'left') : (Math.sin(ang) > 0 ? 'bottom' : 'top');
  return { svg: `<g id="hand" transform="${tf}">${h.body}</g>`, defs: h.defs, edge, angle: ((ang * 180 / Math.PI) + 360) % 360, hand: hk, elbow: elbowCard };
}

// an object that is the calling's own drawing (the Vessel's palm): the hero's parts, turned upright into figure space,
// with the six inks banded over the wrist and, the Vessel being holy, a worn gilt hairline at each band's edge
function heroPartSVG(hp, turn) {
  const h = K.hero(hp.mod, hp.key, {}, 'heroes', { only: hp.only }), a = h.joint(hp.only[0]), b = h.joint(hp.only[1]), v = sub(b, a), s = 3.4;
  const th = -Math.PI / 2 - Math.atan2(v[1], v[0]) + turn, A = [0, 170];
  const tf = `translate(${A[0]},${A[1]}) rotate(${(th * 180 / Math.PI).toFixed(2)}) scale(${s}) translate(${-a[0]},${-a[1]})`;
  const wrist = [0, A[1] - len(v) * s * 0.55]; let bands = '';
  [0, 1, 2].forEach(k => { const y = wrist[1] + 70 - k * 34, w = 64 - k * 4, col = INK6[['fire', 'water', 'void'][k]];
    bands += `<path d="M${-w},${y} Q0,${y + 14} ${w},${y} L${w},${y - 20} Q0,${y - 6} ${-w},${y - 20}Z" fill="${mix(col, '#16110e', 0.45)}" opacity="0.85"/>`;
    bands += `<path d="M${-w},${y - 20} Q0,${y - 6} ${w},${y - 20}" stroke="#9a8450" stroke-width="2.4" fill="none"/><path d="M${-w},${y} Q0,${y + 14} ${w},${y}" stroke="#9a8450" stroke-width="2.4" fill="none"/>`; });
  return { defs: h.defs, body: `<g transform="${tf}">${h.body}</g><g>${bands}</g>` };
}

// ==== act FX in card space (all through card_kit ink FX, L18)
function actFX(r, act, M, pts, course, place, state) {
  const ink = course === 'physical' ? INK : mix(INK6[course] || INK, '#16110e', 0.6), focus = M(pts.focus || [0, 0]), feats = [];
  let s = '';
  const surf = place.surfaceY || 560;
  if (act === 'pour' && pts.mouth) { const m = M(pts.mouth), floor = [m[0] + 60, surf]; const liq = (pts.feat || []).includes('blood') ? BLOOD : ink; s += K.drybrush(r, [m, add(m, [30, 40]), add(m, [50, (floor[1] - m[1]) * 0.6]), floor], 16, liq, { profile: t => 0.5 + 0.5 * t, dry: 0.4, op: 0.9, bodyLen: 0.7, bristles: 7 }); s += K.splatter(r, floor, 90, liq, { dir: [0.3, -1], spread: 2.4, n: 16, blotR: 0.2 }); feats.push('contents'); }
  else if (act === 'burst') { s += K.impact(r, focus, 70, ink, { rays: 7, core: false, a0: -0.4 }); for (let i = 0; i < 8; i++) { const a = r() * 6.28, d = 60 + r() * 110, p = add(focus, [Math.cos(a) * d, Math.sin(a) * d]), z = 6 + r() * 10; s += `<path d="${K.polyD([add(p, rot([z, 0], a)), add(p, rot([-z * 0.3, z * 0.4], a)), add(p, rot([-z * 0.8, -z * 0.1], a))])}" fill="#b8c0b0" stroke="${INK}" stroke-width="1.4"/>`; } feats.push('crack'); }
  else if (act === 'swing' || act === 'fling') { const piv = place.pivot || add(focus, [-260, 200]), R = len(sub(focus, piv)), a1 = Math.atan2(focus[1] - piv[1], focus[0] - piv[0]), a0 = a1 - (act === 'swing' ? 1.1 : 0.7); const arc = []; for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10; arc.push(add(piv, [Math.cos(a) * R * 1.05, Math.sin(a) * R * 1.05])); } s += K.drybrush(r, arc, 50, INK, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.55, bristles: 12 }); s += K.motionHatch(r, arc.map(p => add(piv, mul(sub(p, piv), 0.85))), 36, INK, { lw: 2.2, op: 0.65 }); if (act === 'fling') s += K.splatter(r, add(focus, [90, -30]), 140, ink, { blot: false, n: 14, dir: [1, -0.3], spread: 1.2 }); }
  else if (act === 'ring') { for (const [k, R0] of [[0, 220], [1, 280], [2, 340]]) for (const [a0, a1] of [[-60, 40], [140, 240]]) s += K.motionHatch(r, K.arc(focus, R0, R0 * 0.85, a0, a1, 14), 34 - k * 8, INK, { lw: 2.6 - k * 0.5, op: 0.85 - k * 0.15, grow: false, slant: 0.2, step: 10 + k * 2 }); }
  else if (act === 'drip' || act === 'press' || act === 'open' || act === 'turn') { s += K.inkDrip(r, add(focus, [0, 60]), ink, 3); }
  else if (act === 'crack') { s += K.splatter(r, focus, 100, INK, { blot: false, n: 10 }); feats.push('crack'); }
  else if (act === 'bolt') { s += K.inkBolt(r, [focus[0] + 160, -20], add(focus, [10, -10])); }
  else if (act === 'glare') { s += `<ellipse cx="${focus[0].toFixed(1)}" cy="${focus[1].toFixed(1)}" rx="260" ry="200" fill="#e8dcb8" opacity="0.16" filter="url(#kSoft)"/>`; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28 + r() * 0.3, p0 = add(focus, [Math.cos(a) * 170, Math.sin(a) * 150]), p1 = add(focus, [Math.cos(a) * (330 + r() * 160), Math.sin(a) * (300 + r() * 120)]); s += K.drybrush(r, [p0, lerp(p0, p1, 0.5), p1], 26, '#d8ccaa', { profile: t => 1 - t, dry: 1, body: false, op: 0.18, bristles: 9 }); } }   // a soft bloom with faint dry rays, not a cartoon sun
  else if (act === 'blow') { s += K.billow(r, add(focus, [100, -10]), 80, 40, course === 'toxin' ? '#68705a' : '#6a6458', { op: 0.5, lw: 4 }) + K.billow(r, add(focus, [200, -40]), 100, 50, course === 'toxin' ? '#68705a' : '#6a6458', { op: 0.45, lw: 4 }); }
  else if (act === 'freeze') { /* the object itself carries the rime */ }
  return { s: `<g data-fx="act-${act}">${s}</g>`, feats };
}
// course marks in the air round the object (no stray dots: void holes are D.hole on the object, L22)
function courseMarks(r, focus, course) {
  let s = '';
  if (course === 'fire') for (let i = 0; i < 24; i++) { const p = [focus[0] - 260 + r() * 520, 80 + r() * 300]; s += `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}l${(2 + r() * 4).toFixed(1)},${(-3 - r() * 5).toFixed(1)}" stroke="${r() < 0.6 ? '#2a2020' : '#b8642a'}" stroke-width="${(1.5 + r() * 2).toFixed(1)}" stroke-linecap="round"/>`; }
  else if (course === 'frost') for (let i = 0; i < 36; i++) { const p = [focus[0] - 300 + r() * 600, 60 + r() * 480]; s += `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)}l0,${(3 + r() * 6).toFixed(1)}" stroke="#e8eef0" stroke-width="${(1 + r() * 1.6).toFixed(1)}" stroke-linecap="round" opacity="0.8"/>`; }
  else if (course === 'toxin') for (let i = 0; i < 26; i++) { const p = [focus[0] - 300 + r() * 600, 150 + r() * 380]; s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(1 + r() * 2).toFixed(1)}" fill="${r() < 0.5 ? '#c8c890' : '#22220e'}" opacity="0.75"/>`; }
  return `<g data-fx="course">${s}</g>`;
}

// ==== allocation per batch (L12, L13, L20): layouts spread, no repeated (object, variant, layout), enough hands
// hand entry angles (grip to elbow, degrees, y down) handed out in turn: every one 15 or more apart on its edge
const HAND_ANGS = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 300, 320, 340];
const LAYOUTS = ['close', 'ledge', 'table', 'floor', 'niche', 'hang', 'water', 'held', 'scene'];
const ALLOC = {};
let BATCH = null; const BIG = () => !!BATCH && BATCH.length > 100; const USED_HOLES = [], USED_HANDS = [];
const edgeOf = a => { const t = a * Math.PI / 180; return Math.abs(Math.cos(t)) > Math.abs(Math.sin(t)) ? (Math.cos(t) > 0 ? 'right' : 'left') : (Math.sin(t) > 0 ? 'bottom' : 'top'); };
const ONLY = { bell: ['close'], initial: ['close', 'scene'], reliquary: ['close', 'niche'], shears: ['close'], rod: ['close'], palm: ['close'], wasp: ['close', 'table', 'floor'] };   // round 6: layouts these read in
const SCENE = new Set(['doorajar', 'birds', 'anvil', 'wrapped', 'suture', 'goldleaf', 'inkarm', 'beacon']);
function optionsFor(obj, pts, n, bb) {
  if (SCENE.has(obj)) return ['scene'];
  if (ONLY[obj]) return ONLY[obj];
  const ops = ['close', 'ledge', 'table', 'floor', 'niche'];
  if (n > 1 && LONG.has(obj)) return ['close'];   // crossed long things stand too tall for a surface (L13)
  if (n === 1 && pts.hook && (!bb || pts.hook[1] < (bb[1] + bb[3]) / 2)) ops.push('hang');   // L17: only from a hook above the middle
  if (n === 1 && WATER_OK.has(obj)) ops.push('water');
  if (n === 1 && pts.grip) ops.push('held');
  return ops;
}
// the share of the frame an object would fill in a layout (L13), estimated the way deviceCard places it, so the batch
// allocation never hands a layout that must fail the subject-size check
function fillOf(obj, pts, n, bb, lay) {
  const long = LONG.has(obj), bw = bb[2] - bb[0], bh = bb[3] - bb[1], sig0 = pts.sig || [bb[0] + bw * 0.06, bb[1] + bh * 0.06, bb[2] - bw * 0.06, bb[3] - bh * 0.06];
  const nW = n > 1 && !long ? 1 + 0.62 * (n - 1) : 1, areaSc = Math.sqrt(0.46 * W * H / (bw * nW * bh)), sigSc = Math.min((W - 60) / ((sig0[2] - sig0[0]) * nW), (H - 60) / (sig0[3] - sig0[1])), fit = Math.min(areaSc, sigSc);
  const tall = bh > 1.15 * bw * nW;
  let sc = lay === 'close' || lay === 'held' ? Math.min(areaSc * 1.1, sigSc) : lay === 'scene' ? Math.min(Math.max(1100 / bw, 600 / bh) * 0.92, sigSc)
    : lay === 'hang' ? Math.min(fit * 1.05, (H - 144) / Math.max(1, sig0[3] - (pts.hook || [0, bb[1]])[1])) : lay === 'water' ? Math.min(fit * 1.1, 436 / (bh * 0.8))
    : Math.min(fit * 1.05, ((tall ? 576 : lay === 'ledge' ? 540 : lay === 'table' ? 525 : lay === 'floor' ? 555 : 550) - 21) / (bb[3] - sig0[1]));
  const w = Math.min(W, bw * nW * sc), h = Math.min(H, bh * sc);
  return fillOk(w * h / (W * H), Math.max(w / W, h / H), 0.04) ? 1 : 0;
}
// L13 subject size: the subject (object and hand) covers 35% of the frame, or runs edge to edge (90% of the frame's
// width or height) and covers 20%: a bottle or a chain cannot cover 35% without losing its signature (L16)
const fillOk = (area, span, margin = 0) => area >= 0.35 + margin || (span >= 0.9 + margin && area >= 0.2 + margin);
// the object as deviceCard will first draw it (default tilt, the card's course, state and calling), for the allocation
function probe(card, obj, course, o = {}) { const f = measuredFig(1), pts = LIB[obj](f, Object.assign({ course, ang: (o.ang ?? ANG[obj] ?? 0), state: stateOf(card), variant: 0, holy: card.cls === 'vessel' }, o.objOpt || {})) || {}; return { pts, bb: f.bb }; }
function allocate(entries) { // entries: [{ id, obj, opts, variants }] in batch order
  BATCH = entries.map(e => e.id);
  USED_HOLES.length = 0; USED_HANDS.length = 0; let nHeld = 0; const lay = {}, seen = new Set(), cap = Math.max(1, Math.floor(entries.length * 0.3));
  const gripCards = entries.filter(e => e.opts.includes('held')), needHands = Math.ceil(entries.length * 0.22);
  const handIds = new Set(gripCards.slice(0, Math.max(needHands, Math.ceil(gripCards.length * 0.6))).map(e => e.id));
  for (const e of entries.slice().sort((a, b) => a.opts.length - b.opts.length)) {
    let ops = handIds.has(e.id) ? ['held'] : e.opts.filter(l => l !== 'held');
    ops = ops.slice().sort((a, b) => (lay[a] || 0) - (lay[b] || 0) || ((seedOf(e.id) >> LAYOUTS.indexOf(a)) & 1) - 0.5);
    let pick = null;
    for (const l of ops) { if ((lay[l] || 0) >= cap && l !== 'held') continue; for (let v = 0; v < e.variants; v++) { const k = e.obj + '|' + v + '|' + l; if (!seen.has(k)) { pick = [l, v]; break; } } if (pick) break; }
    if (!pick) pick = [ops[0], seedOf(e.id) % e.variants];
    seen.add(e.obj + '|' + pick[1] + '|' + pick[0]); lay[pick[0]] = (lay[pick[0]] || 0) + 1;
    ALLOC[e.id] = { layout: pick[0], variant: pick[1], handAng: pick[0] === 'held' ? HAND_ANGS[(nHeld++) % HAND_ANGS.length] : null };
  }
}
const seedOf = id => { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 1000 + (h % 8000); };
const countOf = (card, o) => o.count || ((n => /\b(three|thrice|triple)\b/.test(n) ? 3 : /\b(two|twin|twins|pair|both|twofold|double|doubled)\b/.test(n) ? 2 : 1)((card.name || '').toLowerCase()));

// ==== the composition
function deviceCard(card, id, o = {}, ctx = {}) {
  const course = ctx.courseOf(card, o), obj = pickObject(card, id, o), seed = o.seed || seedOf(id), c = COURSE[course], r = rng(seed);
  const state = stateOf(card), n = countOf(card, o), long = LONG.has(obj), base = (SCALE[obj] || 0.95) * (o.scaleMul || 1); void base;
  const al = ALLOC[id] || {}, variant = al.variant ?? (seed >> 4) % 3;
  const holy = card.cls === 'vessel';
  // build the copies; each differs (L19): its own seed, tilt and, for brews, its contents
  const makeCopies = (turn = 0) => { const cs = [];
    for (let k = 0; k < n; k++) {
      const f = measuredFig(seed + k * 7), a0 = (o.ang ?? ANG[obj] ?? 0) + [-0.14, 0, 0.14][(variant + k) % 3] + turn, da = n > 1 ? (k - (n - 1) / 2) * (long ? 1.0 : 0.22) : 0;
      const pts = LIB[obj](f, Object.assign({ course, ang: a0 + da, state, variant: variant + k, holy, brew: n > 1 ? BREWS[(seed + k) % BREWS.length] : undefined }, o.objOpt || {}));
      cs.push({ f, pts: pts || {}, bb: f.bb, key: obj + ':' + (variant + k) + ':' + (n > 1 ? BREWS[(seed + k) % BREWS.length] : '') });
    }
    return cs; };
  let copies = makeCopies();
  const opts = optionsFor(obj, copies[0].pts, n, copies[0].bb);
  let lay = o.layout || al.layout || opts[(seed >> 3) % opts.length];
  if (!opts.includes(lay)) lay = 'close';
  // a held card turns its object so the hand enters at the angle the batch allotted it (L20: no two hands alike)
  if (lay === 'held' && copies[0].pts.grip) { const h0 = heroHand(card.cls, [0, 0], copies[0].pts.grip.thumb, 1, seed % 2), dif = a => ((a - h0.angle + 540) % 360) - 180;
    const free = a => USED_HANDS.every(u => edgeOf(u) !== edgeOf(a) || Math.abs(((u - a + 540) % 360) - 180) >= 16);
    const tgt = HAND_ANGS.filter(a => free(a)).sort((a, b) => Math.abs(dif(a)) - Math.abs(dif(b)))[0];
    const d = tgt == null ? 0 : dif(tgt); if (Math.abs(d) > 2) copies = makeCopies(d * Math.PI / 180); USED_HANDS.push(tgt == null ? h0.angle : tgt); }
  const P0 = copies[0].pts;
  // placement: scale to fit, then honour the signature box (L16) by shifting, then by shrinking
  const bb = copies[0].bb, bw = bb[2] - bb[0], bh = bb[3] - bb[1], bcx = (bb[0] + bb[2]) / 2, bcy = (bb[1] + bb[3]) / 2;
  const sig0 = P0.sig ? [Math.max(P0.sig[0], bb[0]), Math.max(P0.sig[1], bb[1]), Math.min(P0.sig[2], bb[2]), Math.min(P0.sig[3], bb[3])] : [bb[0] + bw * 0.06, bb[1] + bh * 0.06, bb[2] - bw * 0.06, bb[3] - bh * 0.06];   // a declared box never exceeds the drawing
  const nW = n > 1 && !long ? 1 + 0.62 * (n - 1) : 1, sigW = (sig0[2] - sig0[0]) * nW, sigH = sig0[3] - sig0[1];
  const areaSc = Math.sqrt(0.46 * W * H / (bw * nW * bh)), sigSc = Math.min((W - 60) / sigW, (H - 60) / sigH), fit = Math.min(areaSc, sigSc), side = (seed >> 5) % 2 ? 1 : -1;
  let holeOver = '', sc, at, surf = null, surfaceY = null, under = '', over = '', defs = '', pool, hand = null, hookGap = null, extra = '';
  const placeOn = (y, mul2, xc) => { sc = Math.min(fit * mul2, (y - 21) / (bb[3] - sig0[1])); at = [xc - bcx * sc, y + 2 - bb[3] * sc]; surfaceY = y; };
  if (lay === 'close') { sc = Math.min(areaSc * 1.1, sigSc); at = [560 + side * 50 - bcx * sc, 306 - bcy * sc + bh * sc * 0.08]; }
  else if (lay === 'scene') { sc = Math.min(Math.max(1100 / bw, 600 / bh) * 0.92, sigSc); at = [560 - bcx * sc, 306 - bcy * sc]; }
  else if (lay === 'ledge' || lay === 'table' || lay === 'floor' || lay === 'niche') { const tall = bh > 1.15 * bw * nW, y = tall ? 566 + Math.round(r() * 20) : lay === 'ledge' ? 520 + Math.round(r() * 40) : lay === 'table' ? 505 + Math.round(r() * 40) : lay === 'floor' ? 540 + Math.round(r() * 30) : 550; placeOn(y, 1.05, 560 + side * (lay === 'niche' ? 0 : 50)); surf = surface(seed + 50, lay, y); }
  else if (lay === 'hang') { const hx = 560 + side * 40; const hk = P0.hook; sc = Math.min(fit * 1.05, (H - 24 - 120) / Math.max(1, sig0[3] - hk[1])); at = [hx - hk[0] * sc, 120 - hk[1] * sc]; }
  else if (lay === 'water') { const wy = 440 + Math.round(r() * 40); sc = Math.min(fit * 1.1, (wy - 24) / (bh * 0.8)); at = [560 + side * 70 - bcx * sc, wy - (bb[3] - bh * 0.22) * sc]; over = water(r, wy, course); surfaceY = wy; }
  else { sc = Math.min(areaSc * 1.05, sigSc); at = [540 + side * 40 - bcx * sc, 300 - bcy * sc]; }
  const M = p => K.mapPt(p, [0, 0], at, sc), inFrame = b => { const ix = Math.max(0, Math.min(b[2], W - 20) - Math.max(b[0], 20)), iy = Math.max(0, Math.min(b[3], H - 20) - Math.max(b[1], 20)); return (ix * iy) / Math.max(1, (b[2] - b[0]) * (b[3] - b[1])); };
  const sigCard = () => { const a = M([sig0[0], sig0[1]]), b2 = M([sig0[2], sig0[3]]); return [Math.min(a[0], b2[0]), Math.min(a[1], b2[1]), Math.max(a[0], b2[0]), Math.max(a[1], b2[1])]; };
  const shift = () => { const sg = sigCard(); let dx = 0, dy = 0;
    if (sg[0] < 20) dx = 20 - sg[0]; else if (sg[2] > W - 20) dx = W - 20 - sg[2];
    if (!surfaceY && lay !== 'hang') { if (sg[1] < 20) dy = 20 - sg[1]; else if (sg[3] > H - 20) dy = H - 20 - sg[3]; }
    if (lay === 'hang' && sg[1] < 20 && sg[3] + 20 - sg[1] < H - 20) dy = 20 - sg[1];   // a hung thing may hang lower on a longer chain
    at = [at[0] + dx, at[1] + dy]; };
  const anchor = surfaceY ? [bcx, bb[3]] : lay === 'hang' ? P0.hook : [bcx, bcy], scaleTo = s2 => { const fixed = M(anchor); sc = s2; at = [fixed[0] - anchor[0] * sc, fixed[1] - anchor[1] * sc]; };
  if (o.zoom) { const c0 = M(P0.grip ? P0.grip.c : [bcx, bcy]); scaleTo(sc * o.zoom); const c1 = M(P0.grip ? P0.grip.c : [bcx, bcy]); at = [at[0] + (c0[0] - c1[0]), at[1] + (c0[1] - c1[1])]; }   // a per-card close crop
  for (let k = 0; k < 8 && inFrame(sigCard()) < 0.97; k++) { shift(); if (inFrame(sigCard()) < 0.97) scaleTo(sc * 0.9); }
  // then grow toward the L13 fill while the signature still fits (L16): layouts never leave a small subject they could avoid
  const fillNow = () => { const a = M([bb[0], bb[1]]), b2 = M([bb[2], bb[3]]), ex = n > 1 && !long ? bw * sc * 0.62 * (n - 1) / 2 : 0, x0 = Math.max(0, Math.min(a[0], b2[0]) - ex), x1 = Math.min(W, Math.max(a[0], b2[0]) + ex), y0 = Math.max(0, Math.min(a[1], b2[1])), y1 = Math.min(H, Math.max(a[1], b2[1])); return [(x1 - x0) * (y1 - y0) / (W * H), Math.max((x1 - x0) / W, (y1 - y0) / H)]; };
  let growStop = ''; if (lay !== 'scene') for (let k = 0; k < 14 && !fillOk(...fillNow(), 0.01); k++) { const keep = [sc, at]; scaleTo(sc * 1.06); shift(); if (inFrame(sigCard()) < 0.97) { growStop = sigCard().map(Math.round).join(','); [sc, at] = keep; break; } }

  // void holes (L22): seeded per card, 1 or 2, on a solid part of the object, drawn with D.hole so the wall shows,
  // and never within 48 px of a hole already drawn in this batch
  const holes = [];
  if (course === 'void') { const f = copies[0].f, area = q => (q[2] - q[0]) * (q[3] - q[1]); let big = f.parts.filter(q => area(q) > 6000); if (!big.length) big = f.parts.slice().sort((a, b) => area(b) - area(a)).slice(0, 2); const nh = 1;   // one hole: two side by side read as eyes
    for (let i = 0; i < nh && big.length; i++) { let p = null, q = null;
      for (let t = 0; t < 60 && !p; t++) { const pool2 = t < 24 ? big : f.parts, mg = t < 24 ? 40 : 24; q = pool2[Math.floor(r() * pool2.length)]; const c = [q[0] + (q[2] - q[0]) * (0.2 + r() * 0.6), q[1] + (q[3] - q[1]) * (0.2 + r() * 0.6)], cc = M(c); if (cc[0] > mg && cc[0] < W - mg && cc[1] > mg && cc[1] < H - mg && USED_HOLES.filter(u => !BIG() || u.obj === obj).map(u => u.p).concat(holes.map(h => h.card)).every(u => Math.hypot(u[0] - cc[0], u[1] - cc[1]) >= 48)) p = c; }
      if (!p) continue; const rr = Math.min(26, (q[2] - q[0]) * 0.16, (q[3] - q[1]) * 0.16) + 6; D.hole(f, p, rr, rr * 0.9, '#8a8478', { ang: r() }); holes.push({ fig: p, card: M(p), r: rr }); }
    if (!holes.length && surfaceY) { const f2 = K.objFig(seed + 77), q0 = M([bb[0], bb[1]]), q1 = M([bb[2], bb[3]]), ob = [Math.min(q0[0], q1[0]), 0, Math.max(q0[0], q1[0]), 0]; for (let t = 0; t < 12 && !holes.length; t++) { const cc = [ob[0] - 60 - r() * 120 + (t % 2) * (ob[2] - ob[0] + 240), surfaceY + 26 + r() * 30]; if (cc[0] > 50 && cc[0] < W - 50 && USED_HOLES.filter(u => !BIG() || u.obj === obj).every(u => Math.hypot(u.p[0] - cc[0], u.p[1] - cc[1]) >= 48)) { D.hole(f2, cc, 34, 14, '#5a564e', { ang: 0 }); holes.push({ card: cc, r: 34 }); } } const s4 = K.figSVG(f2); defs += s4.defs; holeOver = s4.body; }   // a hole in the ground beside it
    holes.forEach(h => USED_HOLES.push({ obj, p: h.card })); }
  // the hang line ends on the hook (L17)
  if (lay === 'hang') { const hk = M(P0.hook), hx = hk[0]; const B1 = beam(seed + 60, hx); defs += B1.defs; under += B1.body + `<path d="M${hx.toFixed(1)},84 L${hk[0].toFixed(1)},${hk[1].toFixed(1)}" stroke="${INK}" stroke-width="7"/><path d="M${hx.toFixed(1)},84 L${hk[0].toFixed(1)},${hk[1].toFixed(1)}" stroke="#6a5a40" stroke-width="4" stroke-dasharray="6 3"/>`; hookGap = 0; pool = [hx, 300, 380, 260]; }
  if (surf) { defs += surf.defs; under += surf.body; }
  under += holeOver;
  // the copies, side by side or crossed
  const placed = copies.map((cp, k) => { const dx = n > 1 && !long ? (k - (n - 1) / 2) * bw * sc * 0.62 : 0; const s2 = K.figSVG(cp.f); defs += s2.defs; if (cp.pts.heroPart) { const hp = heroPartSVG(cp.pts.heroPart, cp.pts.heroTurn || 0); defs += hp.defs; s2.body += hp.body; } return K.place(s2.body, [0, 0], [at[0] + dx, at[1]], sc); });
  const objBox = (() => { const a = M([bb[0], bb[1]]), b2 = M([bb[2], bb[3]]); let x0 = Math.min(a[0], b2[0]), x1 = Math.max(a[0], b2[0]); if (n > 1 && !long) { x0 -= bw * sc * 0.62 * (n - 1) / 2; x1 += bw * sc * 0.62 * (n - 1) / 2; } return [x0, Math.min(a[1], b2[1]), x1, Math.max(a[1], b2[1])]; })();
  if (surfaceY && lay !== 'water') under += contactShadow(objBox[0], objBox[2], surfaceY);
  // a hand on the grip (L20): the calling's own hand from card_figure
  if (lay === 'held' && P0.grip) { const gC = M(P0.grip.c); hand = heroHand(card.cls, gC, P0.grip.thumb, sc, seed % 2); defs += hand.defs; extra += hand.svg; pool = [gC[0] + 120, 280, 420, 260]; }
  const focus = M(P0.focus || [bcx, bcy]);
  // FX: requested by the object, then the act, then the state (frozen rimes over, broken cracks), all in ink
  const feats = new Set(P0.feat || []), fxSrc = [];
  let fx = '';
  for (const q of copies[0].f.fxReq || []) { if (q.kind === 'steam' && state.frozen) continue; const p = M(q.p); if (q.kind === 'rime') fx += K.inkRime(r, [p, M(q.to || add(q.p, [80, 0]))]); else if (q.kind === 'drip') fx += K.inkDrip(r, p, q.col || INK, q.size || 3); else if (q.kind === 'flame') fx += K.inkFlame(r, p, q.size * sc, q.col); else if (q.kind === 'steam') fx += K.inkSteam(r, p, q.size * sc); feats.add(q.kind === 'flame' ? 'fire' : q.kind); fxSrc.push(q.kind); }
  const words = ((card.name || '') + ' ' + (card.note || '')).toLowerCase();
  let act = o.act || (ACT_WORDS.find(([re]) => re.test((card.name || '').toLowerCase())) || [])[1] || ACT_DEFAULT[obj] || 'drip';
  if (act === 'pour' && !P0.mouth) act = ACT_DEFAULT[obj] === 'pour' ? 'drip' : (ACT_DEFAULT[obj] || 'drip');
  if (state.frozen && act === 'pour') act = 'freeze';
  if (state.empty && act === 'pour') act = 'fling';   // L21: an empty thing cannot pour
  const A = actFX(r, act, M, Object.assign({}, P0, { feat: [...feats] }), course, { surfaceY, pivot: hand ? hand.elbow : null }, state);
  if (act === 'glare') under += A.s; else fx += A.s;   // glare is a halo behind the thing, not a veil over it
  A.feats.forEach(x => feats.add(x));
  if (state.frozen && !feats.has('rime')) { fx += K.inkRime(r, [[objBox[0], objBox[3] - 10], [(objBox[0] + objBox[2]) / 2, objBox[3] - 24], [objBox[2], objBox[3] - 8]]); feats.add('rime'); }
  if (state.broken && !feats.has('crack')) { const f2 = K.objFig(seed + 90); D.crack(f2, focus, -1.2, 120, { n: 6, w: 2.6 }); D.crack(f2, add(focus, [10, 6]), 0.6, 80, { n: 4 }); const s3 = K.figSVG(f2); defs += s3.defs; fx += s3.body; feats.add('crack'); }
  // ground and assembly
  let body = K.ground(r, Object.assign({ room: o.room || ctx.roomOf(card, course, id), x: 500 + (seed % 900), w: 1400 + (seed % 300), c, pool: pool || [focus[0] + (r() - 0.5) * 160, focus[1] - 40 - r() * 60, 380 + r() * 140, 220 + r() * 100], dark: 0.3, hatchR: 0.9 + r() * 0.3 }, o.ground || {}));
  body += under + `<g id="subj">${placed.slice().reverse().join('')}${extra}</g>` + over + fx + courseMarks(r, focus, course);
  // metadata for the checks
  const sgc = sigCard(), clip = b => [Math.max(0, b[0]), Math.max(0, b[1]), Math.min(W, b[2]), Math.min(H, b[3])];
  const sb = objBox.slice(); if (hand) { const g = M(P0.grip.c), e = hand.elbow, pad = 60 * sc; sb[0] = Math.min(sb[0], g[0] - pad, e[0] - pad); sb[1] = Math.min(sb[1], g[1] - pad, e[1] - pad); sb[2] = Math.max(sb[2], g[0] + pad, e[0] + pad); sb[3] = Math.max(sb[3], g[1] + pad, e[1] + pad); }
  const cb = clip(sb), cw = cb[2] - cb[0], ch = cb[3] - cb[1];
  const colours = [...new Set(copies.flatMap(cp => cp.f.colours))];
  const inkHue = course !== 'physical' && INK6[course] ? hsv(INK6[course])[0] : null, courseInk = x => { const v = hsv(x); return inkHue != null && v && Math.abs(((v[0] - inkHue + 540) % 360) - 180) < 14 && v[2] < 0.5; };
  const badRed = colours.filter(x => isRed(x) && !RED_OK.has(x) && !courseInk(x)), badGold = colours.filter(x => isGold(x) && !(GOLD_OBJECTS.has(obj) || holy));
  const meta = { id, kind: 'object', object: obj, variant, layout: lay, act, actShown: act !== 'freeze' || feats.has('rime'), hand: hand ? { edge: hand.edge, angle: hand.angle, hand: hand.hand } : null,
    sigInside: inFrame(sgc), hook: !!P0.hook, hookGap, surfaceY, contact: surfaceY && lay !== 'water' ? Math.abs(objBox[3] - surfaceY) : null,
    holes: holes.map(h => h.card), copies: copies.map(cp => cp.key), feats: [...feats], state, ells: P0.ells || null,
    subjFrac: (cw * ch) / (W * H), span: Math.max(cw / W, ch / H), dbg: { growStop, sc: +sc.toFixed(2), bw: Math.round(bw), bh: Math.round(bh), box: cb.map(Math.round), areaSc: +areaSc.toFixed(2), sigSc: +sigSc.toFixed(2) }, badRed, badGold, noun: card.cls === 'vessel' ? null : nounOf(card), override: !!o.device || !!SPREAD[id], spread: SPREAD[id] || null, course, fxSrc };
  return { course: c, defs, body, meta };
}

module.exports = { spread, FAMILY, probe, fillOf, fillOk, SCENE, deviceCard, pickObject, nounOf, allocate, optionsFor, stateOf, STATE_RULES, LIB, WATER_OK, LAYOUTS, measuredFig, seedOf, countOf, NOUNS, AUDIT };
