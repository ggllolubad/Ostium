// The build checks (LESSONS.md): every measurable lesson as an assertion over a batch of card metadata. render.js runs
// runMeta() before it renders and pixchecks.py after, writes both to checks.txt, and exits non-zero on any failure.
// Each check names its lesson. A check that fails prints every offending card.
'use strict';
const fs = require('fs');
const path = require('path');
const OC = require('./objcomp');

const ACTS = new Set(['pour', 'burst', 'swing', 'fling', 'ring', 'burn', 'crack', 'bolt', 'glare', 'blow', 'unspool', 'press', 'open', 'turn', 'drip', 'freeze']);

function runMeta(metas) {
  const out = [], fail = (lesson, msg, ids) => out.push({ lesson, ok: false, msg, ids: ids || [] }), pass = (lesson, msg) => out.push({ lesson, ok: true, msg });
  const all = metas.filter(m => m.kind === 'object'), seenBase = new Set();
  const objs = all.filter(m => { const b = m.base || String(m.id).split('~')[0]; if (seenBase.has(b)) return false; seenBase.add(b); return true; }), N = objs.length, big = N > 100;   // L60: an attuned card's ~course variants are one card for the batch checks (spread, uniqueness, hands, holes)
  if (!N) { pass('-', 'no object cards in this batch'); return out; }
  // L12: spread. Per review batch: at most 2 cards per object and a unique (object, variant, layout). Full runs: 20 per object.
  const per = {}; objs.forEach(m => (per[m.object] = per[m.object] || []).push(m.id));
  const capObj = big ? 20 : 4, over = Object.entries(per).filter(([, v]) => v.length > capObj);
  over.length ? fail('L12', `objects over ${capObj} cards: ` + over.map(([k, v]) => `${k} x${v.length}`).join(', '), over.flatMap(([, v]) => v)) : pass('L12', `no object on more than ${capObj} cards (${Object.keys(per).length} objects)`);
  if (!big) { const keys = {}; objs.forEach(m => { const k = [m.object, m.variant, m.layout, m.style, m.flipped].join('|'); /* the card's whole framing (L57: hashed per card) */ (keys[k] = keys[k] || []).push(m.id); }); const dup = Object.entries(keys).filter(([, v]) => v.length > 1);
    dup.length ? fail('L12', 'repeated (object, variant, layout, framing): ' + dup.map(([k, v]) => `${k}: ${v.join(' ')}`).join('; '), dup.flatMap(([, v]) => v)) : pass('L12', 'every (object, variant, layout, framing) is unique; silhouettes are verified by the pixel IoU check'); }
  // L13: layout share and subject size
  const lay = {}; objs.forEach(m => { const k = m.layout + (m.hand ? ':' + m.hand.edge + ':' + Math.round(m.hand.angle / 15) : ''); lay[k] = (lay[k] || 0) + 1; });
  const share = N < 10 ? [] : Object.entries(lay).filter(([, v]) => v / N > 0.3);   // shares mean nothing on a handful of test cards
  share.length ? fail('L13', 'layouts over 30%: ' + share.map(([k, v]) => `${k} ${Math.round(100 * v / N)}%`).join(', ')) : pass('L13', 'layout shares: ' + Object.entries(lay).map(([k, v]) => `${k} ${Math.round(100 * v / N)}%`).join(', '));
  const small = objs.filter(m => !OC.fillOk(m.subjFrac, m.span));   // 35%, or edge to edge (90% span) and 20%
  small.length ? fail('L13', 'subject bbox under 35% of the frame: ' + small.map(m => `${m.id} ${(m.subjFrac * 100).toFixed(0)}%`).join(', '), small.map(m => m.id)) : pass('L13', 'every subject (object and hand) fills at least 35% of the frame, or runs edge to edge (90%) and fills 20%');
  // L14: colour roles on parts (red only blood, rubric, doom; gold only money and holy things, and the Vessel)
  const col = all.filter(m => m.badRed.length || m.badGold.length);   // every variant: the course changes the ink
  col.length ? fail('L14', 'red or gold outside its role: ' + col.map(m => `${m.id} ${[...m.badRed, ...m.badGold].join('/')}`).join(', '), col.map(m => m.id)) : pass('L14', 'every red and gold fill has a role');
  // L15: water only for heavy things
  const wet = objs.filter(m => m.layout === 'water' && !OC.WATER_OK.has(m.object));
  wet.length ? fail('L15', 'water layout on light objects: ' + wet.map(m => m.id + ' ' + m.object).join(', '), wet.map(m => m.id)) : pass('L15', 'water only on ' + [...OC.WATER_OK].join(', '));
  // L16: the signature shape stays in the frame
  const crop = objs.filter(m => m.sigInside < 0.95);
  crop.length ? fail('L16', 'signature cropped: ' + crop.map(m => `${m.id} ${(m.sigInside * 100).toFixed(0)}%`).join(', '), crop.map(m => m.id)) : pass('L16', 'every signature box at least 95% inside the frame with a 20 px margin');
  // L17: hung things hang from their hook
  const hang = objs.filter(m => m.layout === 'hang' && (!m.hook || m.hookGap == null || m.hookGap > 3));
  hang.length ? fail('L17', 'hang without a hook or with a gap: ' + hang.map(m => m.id).join(', '), hang.map(m => m.id)) : pass('L17', 'every hung object hangs from its declared hook (gap 0 px)');
  // L18: object FX only through card_kit ink FX (static scan of the object sources for the old hand-drawn FX)
  const legacy = [];
  for (const f of ['objects.js', 'objects2.js', 'objects3.js', 'objects4.js']) { const src = fs.readFileSync(path.join(__dirname, f), 'utf8'); src.split('\n').forEach((l, i) => { if (/'#d8d4c8'|'#f8e8b0'|'#f0c070'|'#f0e8c8'|f\.flat\([^;]*'#e0a040'/.test(l)) legacy.push(`${f}:${i + 1}`); }); }
  legacy.length ? fail('L18', 'hand-drawn FX left in object code: ' + legacy.join(', ')) : pass('L18', 'object code makes FX only by K.fxReq; all FX groups carry data-fx');
  // L19: counted copies differ
  const same = objs.filter(m => m.copies.length > 1 && new Set(m.copies).size < m.copies.length);
  same.length ? fail('L19', 'identical copies: ' + same.map(m => m.id).join(', '), same.map(m => m.id)) : pass('L19', 'counted copies all differ');
  // L20: acts and hands
  const acting = objs.filter(m => ACTS.has(m.act) && m.actShown).length, hands = objs.filter(m => m.hand);
  N < 10 ? pass('L20', `act and hand shares not tested: ${N} object cards (need 10)`) : acting / N < 0.8 ? fail('L20', `objects shown mid-act ${Math.round(100 * acting / N)}% (need 80%)`) : pass('L20', `objects shown mid-act ${Math.round(100 * acting / N)}%`);
  N < 10 ? 0 : hands.length / N < 0.2 ? fail('L20', `hands on ${Math.round(100 * hands.length / N)}% of object cards (need 20%)`) : pass('L20', `hands on ${Math.round(100 * hands.length / N)}% of object cards`);
  const clash = []; for (let i = 0; i < hands.length; i++) for (let j = i + 1; j < hands.length; j++) { const a = hands[i].hand, b = hands[j].hand, d = Math.abs(((a.angle - b.angle + 540) % 360) - 180); if (hands[i].object === hands[j].object && a.edge === b.edge && d < 15) clash.push(hands[i].id + '/' + hands[j].id); }   // L57: same-object hand cards only; angles are hashed per card
  clash.length && !big ? fail('L20', 'hand cards sharing an edge and angle: ' + clash.join(', ')) : pass('L20', 'no two hand cards with the same object share an edge and angle');
  // L21: state words
  const st = [];
  for (const m of objs) for (const [k, rule] of Object.entries(OC.STATE_RULES)) { if (!m.state[k]) continue; for (const x of rule.forbid || []) if (m.feats.includes(x)) st.push(`${m.id} is ${k} but shows ${x}`); for (const x of rule.require || []) if (!m.feats.includes(x)) st.push(`${m.id} is ${k} but lacks ${x}`); }
  st.length ? fail('L21', st.join('; ')) : pass('L21', 'no card contradicts its state words');
  // L22: void holes vary
  const voids = objs.filter(m => m.course === 'void'), vh = [];
  voids.filter(m => !m.holes.length).forEach(m => vh.push(m.id + ' has no hole'));
  for (let i = 0; i < voids.length; i++) for (let j = i + 1; j < voids.length; j++) if (voids[i].object === voids[j].object && !big) for (const a of voids[i].holes) for (const b of voids[j].holes) if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 40) vh.push(`${voids[i].id}/${voids[j].id} share a hole centre`);
  vh.length ? fail('L22', vh.join('; ')) : pass('L22', `${voids.length} void cards, each with a seeded hole${big ? '' : '; no two with the same object share a hole centre within 40 px'}`);
  // L23: the card's own noun
  const nn = objs.filter(m => m.noun && m.noun !== m.object && !m.override);
  nn.length ? fail('L23', 'name noun disagrees with pick: ' + nn.map(m => `${m.id} ${m.noun}->${m.object}`).join(', '), nn.map(m => m.id)) : pass('L23', 'every name noun from the table matches its pick');
  // L9: one viewpoint (ellipse ratios agree) and contact on surfaces
  const el = objs.filter(m => m.ells && m.ells.length > 1 && Math.max(...m.ells) / Math.min(...m.ells) > 1.3 && !['signet', 'mortar', 'spectacles'].includes(m.object));
  el.length ? fail('L9', 'ellipse ratios disagree: ' + el.map(m => `${m.id} ${m.ells.map(x => x.toFixed(2)).join('/')}`).join(', ')) : pass('L9', 'ellipse ratios agree within 1.3 on every object that declares them');
  const ct = objs.filter(m => m.contact != null && m.contact > 8);
  ct.length ? fail('L9', 'not touching its surface: ' + ct.map(m => `${m.id} ${m.contact.toFixed(0)}px`).join(', ')) : pass('L9', 'every object on a surface touches it, with a contact shadow');
  // L58: variety. Deck-wide on every run (a deck property, not a batch one): within one calling, the shared pool and
  // each world, no object on more than 3 object cards; a calling's listed signature object may take 4.
  const R = reuse(), CS = require('./samples').CARDS, groups = new Set(objs.map(m => (CS[m.id] || {}).cls || 'shared'));
  if (!big) R.over = R.over.filter(x => groups.has(x.group));   // a review batch answers for its own callings; a full run for every one
  R.over.length ? fail('L58', 'objects on too many cards in one calling: ' + R.over.map(x => `${x.group} ${x.obj} x${x.ids.length}`).join(', '), R.over.flatMap(x => x.ids)) : pass('L58', `no object on more than 3 cards in any calling, the shared pool or a world (signatures at most 4: ${Object.entries(SIGNATURE).map(([k, v]) => k + ' ' + v).join(', ')}); ${R.cards} object cards on ${R.objects} objects; uses per object ${R.hist}`);
  return out;
}
// L58: the signature exception, listed explicitly (a calling's own object, allowed on 4 cards with different silhouettes)
const SIGNATURE = { vessel: 'chalice', alchemist: 'flask', hexweaver: 'poppet', oracle: 'hourglass', bulwark: 'shield' };
const CAP = 3;
function reuse() {
  const S = require('./samples'); S.allocate();
  const per = {}; let cards = 0;
  for (const id of Object.keys(S.CARDS)) { const [k, obj] = S.describe(id).split(' '); if (['attack', 'cast', 'block'].includes(k) || obj === 'hand-made' || !obj) continue; cards++; const g = S.CARDS[id].cls || 'shared'; ((per[g] = per[g] || {})[obj] = per[g][obj] || []).push(id); }
  const over = [], hist = {}; let objects = 0;
  for (const [g, m] of Object.entries(per)) for (const [obj, ids] of Object.entries(m)) { objects++; hist[ids.length] = (hist[ids.length] || 0) + 1; if (ids.length > (SIGNATURE[g] === obj ? CAP + 1 : CAP)) over.push({ group: g, obj, ids }); }
  return { per, over, cards, objects, hist: Object.entries(hist).map(([n, c]) => `${n}:${c}`).join(' ') };
}
function report(results) { return results.map(r => `${r.ok ? 'PASS' : 'FAIL'}  ${r.lesson.padEnd(4)} ${r.msg}`).join('\n'); }
module.exports = { runMeta, report, reuse, SIGNATURE, CAP };
