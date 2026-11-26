// Hero card compositions, round 9 (hero-card agent, 2026-11-25; LESSONS L59). The hero cards that remain after the
// re-route (hero_routes.HERO) are each staged as their own picture:
//   - a framing (full, three, close, low, ots) and a placement, a pose and a room view, allocated once over the whole
//     deck (never per batch, L57) so that no two hero cards of a calling share a silhouette (IoU 0.42 here; herosim.py
//     fails at 0.5) or a view of the same room;
//   - the act's own FX, one mechanic per card (a chop, a cut, a poured line, a drawn thread...), never a stray blob;
//   - the card's motif drawn big and plain as the prop or the FX, so the name can be guessed at 162 x 86.
// The figure is wrapped in <g id="hero"> so render.js can write the hero mask that herosim.py compares.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const K = require('./card_kit');
const HR = require('./hero_routes');
const HS = require('./hero_staging');
const CP = require('./check_poses');
const EF = require('./element_fx');
const ELEMENT_SHAPES = true;   // L61: course FX drawn as their element (false only to calibrate the check on the old recolour)
const { RIG, FIGURES } = require('./rig');
const { E, W, H, INK, COURSE, INK6, BLOOD, PAPER } = K;
const { add, sub, mul, lerp, rot, mix, rng, norm, len } = E;
const f1 = K.f1;

// ==== the poses a mechanic may use: the rig's own poses, tagged here, and the new staged poses (hero_staging.POSES)
const MECH = {
  bulwark: { act0: ['chop', 'smash', 'drag', 'swing'], act1: ['smash', 'edge', 'snap', 'rake', 'uppercut'], act2: ['shove', 'edge', 'charge'], block0: ['brace'], block1: ['brace'] },
  duelist: { act0: ['cut', 'flurry', 'graze', 'feint', 'circle', 'flick', 'spin'], act1: ['thrust', 'drink', 'step', 'lunge'], act2: ['chop', 'drag', 'cut'], block0: ['stance'], block1: ['retreat', 'slip'] },
  elementalist: { act0: ['flick', 'dart', 'bolt', 'stroke', 'strike', 'lash'], act1: ['rays', 'strike', 'bolt', 'stroke'], act2: ['lash', 'stroke', 'sand', 'blast', 'rays'], block0: ['brace'], block1: ['still', 'press'] },
  alchemist: { act0: ['flung'], act1: ['pour', 'drop', 'gather'], act2: ['flung', 'drop', 'gather'], block0: ['brace'], block1: ['pour'] },
  oracle: { act0: ['point', 'bolt', 'echo', 'thread', 'cut'], act1: ['raise'], act2: ['point', 'bolt', 'lance', 'cut', 'thrust', 'echo', 'thread'], block0: ['ward'], block1: ['veil'] },
  hexweaver: { act0: ['pin', 'stab', 'cut', 'press'], act1: ['gather', 'press', 'reflect'], act2: ['scatter', 'gust', 'spit', 'reflect', 'strike'], block0: ['brace'], block1: ['salt'] },
  vessel: { act0: ['strike'], act1: ['gather'], act2: ['gust', 'gather'], block0: ['brace'], block1: ['brace'] },
};
function posesFor(cls) {
  const out = [];
  for (const list of ['act', 'block']) RIG[cls][list].forEach((P, i) => out.push({ name: list + i, P, mech: (MECH[cls] || {})[list + i] || [], block: list === 'block' }));
  (HS.POSES[cls] || []).forEach((P, i) => out.push({ name: 'new' + i, P, mech: P.mech, block: !!P.block, frames: P.frames }));
  return out;
}
const HERO_FIG = { bulwark: ['dirAC', 'bulwark'], duelist: ['dirAC', 'duelist'], elementalist: ['dirAC', 'elementalist_%c', 'signs'], alchemist: ['dirAC2', 'alchemist'], oracle: ['dirAC2', 'oracle'], hexweaver: ['dirAC2', 'hexweaver'], vessel: ['worlds/hero_vessel', 'vessel'] };
function figKey(card) { const arch = (card.arch || '').split('+')[0], k = card.cls + '_' + arch; return FIGURES[card.cls] && FIGURES[card.cls][k] ? k : card.cls; }

// ==== silhouettes on the 64 x 35 grid herosim.py uses, from the figure's own part polygons
const GW = 64, GH = 35;
const rasterCache = {};
function posedHero(cls, key, P) { const S = CP.shapesOf(cls, key), pose = Object.assign({}, P.pose, (P.pose.vary || {})[key] || {}); return { S, h: K.hero(S.mod, S.k, pose, S.l, { hide: P.hide }) }; }
function raster(cls, key, P, pname, A, at, scale) {
  const ck = [key, pname].join('|'); const base = rasterCache[ck] || (rasterCache[ck] = (() => { const { S, h } = posedHero(cls, key, P); const L = []; for (const [b, polys] of Object.entries(S.polys)) { if ((P.hide || []).includes(b)) continue; for (const poly of polys) L.push(poly.map(p => h.at(b, p))); } return L; })());
  const g = new Uint8Array(GW * GH), sx = GW / W, sy = GH / H;
  for (const poly of base) {
    const q = poly.map(r => [(at[0] + (r[0] - A[0]) * scale) * sx, (at[1] + (r[1] - A[1]) * scale) * sy]);
    let x0 = W, x1 = -1, y0 = H, y1 = -1; for (const p of q) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    x0 = Math.max(0, Math.floor(x0)); x1 = Math.min(GW - 1, Math.ceil(x1)); y0 = Math.max(0, Math.floor(y0)); y1 = Math.min(GH - 1, Math.ceil(y1));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (g[y * GW + x]) continue; const px = x + 0.5, py = y + 0.5; let c = false; for (let i = 0, j = q.length - 1; i < q.length; j = i++) { const a = q[i], b = q[j]; if ((a[1] > py) !== (b[1] > py) && px < (b[0] - a[0]) * (py - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } if (c) g[y * GW + x] = 1; }
  }
  return g;
}
const iou = (a, b) => { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { i += a[k] & b[k]; u += a[k] | b[k]; } return u ? i / u : 0; };
const SIL_TARGET = 0.44;   // herosim.py fails at 0.5; the polygon raster tracks the rendered masks (r 0.997, mean -0.02 on the Bulwark), so a small margin

// ==== the deck-level allocation, cached on disk by a hash of everything it depends on
const ALLOC_FILE = path.join(__dirname, 'hero_alloc.json');
const VERSION = 9;
const POSE_CAP = 0.38;
// pairs a render showed to read alike (herosim.py B fails, written by herosim.py --separate): kept out of one framing
const SEPARATE_FILE = path.join(__dirname, 'hero_separate.json');
const SEPARATE = (() => { try { return JSON.parse(fs.readFileSync(SEPARATE_FILE, 'utf8')); } catch (e) { return []; } })();
const sepKey = (a, b) => a < b ? a + '|' + b : b + '|' + a, SEP = new Set(SEPARATE.map(p => sepKey(p[0], p[1])));
let ALLOC = null;
function hashInputs() { return crypto.createHash('sha1').update(JSON.stringify([VERSION, SEPARATE, HR.HERO, HS.FRAMES, HS.POSES, MECH, SIL_TARGET, Object.keys(RIG).map(c => [RIG[c].act.map(p => p.pose), RIG[c].block.map(p => p.pose)])])).digest('hex').slice(0, 16); }
const seedOf = id => { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 1000 + (h % 8000); };
function allocation(S) {
  if (ALLOC) return ALLOC;
  const hash = hashInputs();
  try { const c = JSON.parse(fs.readFileSync(ALLOC_FILE, 'utf8')); if (c.hash === hash) return (ALLOC = c.cards); } catch (e) { /* rebuild */ }
  HS.validate();   // solves the Executioner's grips into the new poses
  const out = {}, byCls = {};
  for (const id of Object.keys(HR.HERO).sort()) { const c = S.CARDS[id]; if (c) (byCls[c.cls] = byCls[c.cls] || []).push(id); }
  for (const [cls, ids] of Object.entries(byCls)) {
    const pool = posesFor(cls), capOf = fr => Math.max(2, Math.ceil(ids.length * (fr === 'full' ? 0.5 : 0.35)));
    // 1. every card's candidates: (pose, framing, placement) with its silhouette raster and its base cost
    const C = ids.map(id => {
      const card = S.CARDS[id], key = figKey(card), [frame, mech] = HR.HERO[id], r = rng(seedOf(id)), isBlock = S.kindOf(card) === 'block';
      const own = pool.filter(p => p.mech.includes(mech)), kin = pool.filter(p => p.block === isBlock && !own.includes(p));
      const whole = /\brope|tally/.test(HR.HERO[id][2]);   // a motif drawn on the door (rope, tally) needs the door in view
      const list = [];
      for (const fr of ['three', 'full', 'low', 'close', 'ots']) {
        if (whole && (fr === 'close' || fr === 'ots')) continue;
        for (const [pc, pen] of [...own.map(p => [p, 0]), ...kin.map(p => [p, 0.08])]) {   // the card's own mechanic first; any act (or block) pose at a cost
          if (pc.frames && !pc.frames.includes(fr) && fr !== 'close') continue;
          const pls = HS.placements(cls, key, pc.P, fr, true); if (!pls.length) continue;
          const u = HS.placeIn(cls, key, pc.P, fr, [0, 0], 1);
          const keep = fr === frame ? 70 : 24;
          for (let i = 0; i < Math.min(keep, pls.length); i++) {
            const p = pls[Math.floor((i + r()) * pls.length / Math.min(keep, pls.length)) % pls.length];
            list.push({ pose: pc.name, frame: fr, at: p.at.map(v => Math.round(v)), scale: +p.scale.toFixed(3), base: (fr === frame ? 0 : 0.25) + pen + r() * 0.02,
              act: [p.at[0] + u.act[0] * p.scale, p.at[1] + u.act[1] * p.scale], m: raster(cls, key, pc.P, pc.name, u.A, p.at, p.scale) });
          }
        }
      }
      return { id, list, pick: null, r };
    });
    // 2. the cost of a candidate against the cards already placed: silhouette overlap, framing cap, two acts at one spot
    const costOf = (ci, cand) => {
      let mx = 0, near = 0, used = 0, sep = 0, same = 0;
      C.forEach((o, j) => { if (j === ci || !o.pick) return; mx = Math.max(mx, iou(o.pick.m, cand.m)); if (o.pick.pose === cand.pose) same++; if (o.pick.frame === cand.frame) { used++; if (Math.hypot(o.pick.act[0] - cand.act[0], o.pick.act[1] - cand.act[1]) < 160) near++; if (SEP.has(sepKey(o.id, C[ci].id))) sep++; } });
      return { mx, cost: (mx >= SIL_TARGET ? 1 + mx : mx * 0.3) + cand.base + (used >= capOf(cand.frame) ? 0.5 : 0) + near * 0.2 + sep * 0.8 + (same + 1 > POSE_CAP * ids.length ? 0.9 : 0) };   // L5: no pose on more than 40% of a calling's hero cards
    };
    const choose = ci => { let best = null; for (const cand of C[ci].list) { const v = costOf(ci, cand); if (!best || v.cost < best.cost) best = Object.assign({ cand }, v); } C[ci].pick = best.cand; return best.mx; };
    C.forEach((_, ci) => choose(ci));   // greedy, in id order
    // 3. repair: re-place the worst offenders against all the others until every pair is under the target
    for (let pass = 0; pass < 20; pass++) {
      const worst = C.map((o, ci) => [ci, Math.max(0, ...C.map((q, cj) => cj === ci ? 0 : iou(o.pick.m, q.pick.m)))]).filter(x => x[1] >= SIL_TARGET).sort((a, b) => b[1] - a[1]);
      if (!worst.length) break;
      for (const [ci] of worst) choose(ci);
    }
    // 4. the room view: a crop of the room no other card of the calling shows (L59, ground)
    const views = [];
    C.forEach((o, ci) => {
      const id = o.id, best = o.pick, r = o.r, room = HR.HERO[id][3] || null, W0 = { full: [1500, 1757], three: [1200, 1600], close: [900, 1150], low: [1100, 1400], ots: [1250, 1600] }[best.frame];
      let view = null;
      for (let t = 0; t < 40 && !view; t++) {
        const w = Math.round(W0[0] + r() * (W0[1] - W0[0])), x = Math.round(r() * (2960 - w)), visH = w * H / W;
        const y = best.frame === 'low' ? 0 : best.frame === 'full' ? Math.round(960 - visH) : Math.round(r() * (960 - visH));
        if (!views.some(v => v.room === room && Math.abs(v.x - x) < 260 && Math.abs(v.w - w) < 260)) view = { room, x, y, w };
      }
      view = view || { room, x: Math.round(r() * 1200), y: 0, w: 1400 };
      views.push(view);
      const mx = Math.max(0, ...C.map((q, cj) => cj === ci ? 0 : iou(best.m, q.pick.m)));
      out[id] = { cls, key: figKey(S.CARDS[id]), pose: best.pose, frame: best.frame, at: best.at, scale: best.scale, sil: +mx.toFixed(3), view, mech: HR.HERO[id][1] };
    });
  }
  try { fs.writeFileSync(ALLOC_FILE, JSON.stringify({ hash, cards: out }, null, 0) + '\n'); } catch (e) { /* read-only: keep in memory */ }
  return (ALLOC = out);
}

// ==== small ink pieces (the ones samples.js keeps private, and the motif kits)
function flecks(r, c, R, dir, col) {
  let s = '';
  for (let i = 0; i < 7; i++) { const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 2.2, d = R * (0.4 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = 3 + r() * 6; const q = [add(p, rot([z, 0], a)), add(p, rot([-z * 0.4, z * 0.6], a)), add(p, rot([-z * 0.7, -z * 0.3], a))]; s += `<path d="${K.polyD(q)}" fill="${r() < 0.5 ? col : INK}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
function bead(r, p, dir, rad, col) {
  const d = norm(dir), n = [-d[1], d[0]], tail = add(p, mul(d, -rad * 3.2));
  return `<g filter="url(#kRag)"><path d="${K.pathD([tail, add(add(p, mul(n, rad)), mul(d, -rad * 0.2)), add(p, mul(d, rad)), add(add(p, mul(n, -rad)), mul(d, -rad * 0.2))], true)}" fill="${mix(col, '#000', 0.3)}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, rad * 0.14))}"/>`
    + (rad > 8 ? `<path d="${K.pathD([add(p, [-rad * 0.5, -rad * 0.5]), add(p, [-rad * 0.1, -rad * 0.7]), add(p, [-rad * 0.3, -rad * 0.2])], true)}" fill="${mix(col, '#fff', 0.45)}" opacity="0.7"/>` : '') + '</g>';
}
function shards(r, c, R, dir, col, n = 8, z0 = 6) {
  let s = '';
  for (let i = 0; i < n; i++) { const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 2, d = R * (0.3 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = z0 + r() * z0 * 2, b = r() * 6; const q = [add(p, rot([z, 0], b)), add(p, rot([-z * 0.3, z * 0.35], b)), add(p, rot([-z * 0.8, -z * 0.1], b))]; s += `<path d="${K.polyD(q)}" fill="${col}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" opacity="0.95"/><path d="M${f1(q[0][0])},${f1(q[0][1])}L${f1(q[2][0])},${f1(q[2][1])}" stroke="#f4f4e4" stroke-width="1.2" opacity="0.8"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
function grit(r, c, w) {
  let s = '';
  for (let i = 0; i < 5; i++) { const y = c[1] - r() * 40, x = c[0] + (r() - 0.5) * w; s += K.drybrush(r, [[x - 90, y + 10], [x, y - 12], [x + 90, y]], 26, mix('#6a5a44', '#c8b48a', r() * 0.5), { dry: 1, op: 0.55, body: false, bristles: 10 }); }
  for (let i = 0; i < 40; i++) { const p = add(c, [(r() - 0.5) * w * 1.3, -r() * 80]); s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(0.8 + r() * 2)}" fill="${INK}" opacity="${f1(0.4 + r() * 0.5)}"/>`; }
  return s;
}
function arcPts(c, R, a0, a1, n = 14, sq = 1) { const o = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; o.push(add(c, [Math.cos(a) * R, Math.sin(a) * R * sq])); } return o; }
// a red line drawn hair-thin and sure: the doom and blood line of cuts and threads (red is for blood and doom, NOTES 9)
function redLine(r, pts, w, col = '#7a1a12') { return K.drybrush(r, pts, w, col, { dry: 0.3, op: 0.95, bodyLen: 0.8, bristles: 3, profile: t => 0.35 + 0.65 * Math.sin(Math.PI * t) }) + `<path d="${K.pathD(K.catmull(pts, 6), false)}" stroke="${INK}" stroke-width="${f1(Math.max(1, w * 0.18))}" fill="none" opacity="0.6" filter="url(#kWob)"/>`; }
// bell or steel ringing: broken hatched arcs shaking out from a point (as el_strike_the_ring)
function ringArcs(r, c, R0, k = 3) { let s = ''; for (let i = 0; i < k; i++) { const R = R0 * (1 + i * 0.32); for (const [a0, a1] of [[-60, 50], [130, 240]]) s += K.motionHatch(r, arcPts(c, R, a0 + r() * 10, a1 - r() * 10, 14, 0.9), 40 - i * 6, INK, { lw: 4.4 - i * 0.6, op: 0.95 - i * 0.12, grow: false, slant: 0.2, step: 7 + i * 2, skip: 0.05 }); } return s; }
// little bones (knucklebones, bird bones): a shaft with knobbed ends, inked, bone-pale
function bones(r, c, R, dir, n = 7, z0 = 12) {
  let s = '';
  for (let i = 0; i < n; i++) { const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 1.6, d = R * (0.2 + r() * 0.9), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = z0 * (0.8 + r() * 0.6), b = r() * 6, u = rot([z, 0], b), v = rot([0, z * 0.22], b);
    s += `<path d="${K.pathD([add(add(p, u), v), add(add(p, mul(u, -1)), v), add(add(p, mul(u, -1)), mul(v, -1)), add(add(p, u), mul(v, -1))], true)}" fill="#e2d6b8" stroke="${INK}" stroke-width="1.8"/>`;
    for (const e of [u, mul(u, -1)]) s += `<circle cx="${f1(p[0] + e[0])}" cy="${f1(p[1] + e[1])}" r="${f1(z * 0.32)}" fill="#e8dcc0" stroke="${INK}" stroke-width="1.6"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
// grains of sand or salt flung or falling: pale specks with a few dark ones, in a fan or a column
function grains(r, c, dir, L, spread, n = 160, col = '#e8dcc0') { let s = ''; for (let i = 0; i < n; i++) { const t = Math.pow(r(), 0.7), a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * spread * (0.3 + t), p = add(c, [Math.cos(a) * L * t, Math.sin(a) * L * t]); s += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(1.2 + r() * 2.4)}" fill="${r() < 0.82 ? col : INK}" stroke="${INK}" stroke-width="0.6" opacity="${f1(0.75 + r() * 0.25)}"/>`; } return `<g filter="url(#kWob)">${s}</g>`; }
// thorns and barbs torn loose: small hooked wedges of dark iron
function barbs(r, c, R, dir, n = 10) { let s = ''; for (let i = 0; i < n; i++) { const a = Math.atan2(dir[1], dir[0]) + (r() - 0.5) * 2.2, d = R * (0.25 + r() * 0.8), p = add(c, [Math.cos(a) * d, Math.sin(a) * d]), z = 9 + r() * 9, b = r() * 6; s += `<path d="M${f1(p[0])},${f1(p[1])}l${f1(Math.cos(b) * z)},${f1(Math.sin(b) * z)}l${f1(Math.cos(b + 2.4) * z * 0.5)},${f1(Math.sin(b + 2.4) * z * 0.5)}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f1(p[0])},${f1(p[1])}l${f1(Math.cos(b) * z * 0.7)},${f1(Math.sin(b) * z * 0.7)}" stroke="#8a8a84" stroke-width="1.2"/>`; } return `<g filter="url(#kWob)">${s}</g>`; }
// tally marks scratched in fives, the fifth across, red in the cuts
function tally(r, c, groups = 3, z = 26) { let s = ''; for (let g = 0; g < groups; g++) { const o = add(c, [g * z * 1.7, (r() - 0.5) * 6]); for (let i = 0; i < 4; i++) s += `<path d="M${f1(o[0] + i * z * 0.28)},${f1(o[1])}l${f1((r() - 0.5) * 4)},${f1(z)}" stroke="#5a1410" stroke-width="4" stroke-linecap="round"/><path d="M${f1(o[0] + i * z * 0.28 + 1)},${f1(o[1] + 2)}l0,${f1(z - 4)}" stroke="${PAPER}" stroke-width="1" opacity="0.6"/>`; s += `<path d="M${f1(o[0] - 6)},${f1(o[1] + z * 0.75)}L${f1(o[0] + z * 1.05)},${f1(o[1] + z * 0.2)}" stroke="#5a1410" stroke-width="4" stroke-linecap="round"/>`; } return `<g filter="url(#kWob)">${s}</g>`; }
// a torn scrap of robe cloth, ragged at the tear, hatched on its fold
function clothScrap(r, c, s0 = 60, col = '#3a3040') { const pts = K.blob(r, c, s0, 9, 0.7, 0.6, r() * 3); let s = `<path d="${K.pathD(pts, true)}" fill="${col}" stroke="${INK}" stroke-width="3"/>`; for (let i = 0; i < 6; i++) { const q = add(c, [(r() - 0.5) * s0, (r() - 0.5) * s0 * 0.5]); s += `<path d="M${f1(q[0])},${f1(q[1])}l${f1(10 + r() * 14)},${f1(6 + r() * 8)}" stroke="${INK}" stroke-width="1.6" opacity="0.7"/>`; } return `<g filter="url(#kWob)">${s}</g>`; }
// rope lashed round: three thick wraps with a lit twist and a frayed end
function ropeWraps(r, c, w = 120, k = 3) { let s = ''; for (let i = 0; i < k; i++) { const y = c[1] + (i - (k - 1) / 2) * 26, pts = [[c[0] - w / 2, y + 8], [c[0], y - 6], [c[0] + w / 2, y + 6]]; s += K.drybrush(r, pts, 20, '#b89a64', { dry: 0.2, op: 1, bodyLen: 0.9, bristles: 6 }); s += `<path d="${K.pathD(pts, false)}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-dasharray="7 9"/>`; } s += K.drybrush(r, [[c[0] + w / 2, c[1] + 30], [c[0] + w / 2 + 30, c[1] + 70], [c[0] + w / 2 + 20, c[1] + 110]], 14, '#a88a58', { dry: 0.9, op: 0.95, bristles: 6 }); return s; }
// stars: small four-point ink-edged specks, pale, never sparkles (a cross of two thin strokes)
function stars(r, c, R, n = 14, col = '#e8e0f0') { let s = ''; for (let i = 0; i < n; i++) { const p = add(c, [(r() - 0.5) * R * 2, (r() - 0.5) * R]), z = 3 + r() * 6; s += `<path d="M${f1(p[0] - z)},${f1(p[1])}L${f1(p[0] + z)},${f1(p[1])}M${f1(p[0])},${f1(p[1] - z)}L${f1(p[0])},${f1(p[1] + z)}" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/><circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(z * 0.3)}" fill="${col}" stroke="${INK}" stroke-width="0.8"/>`; } return `<g filter="url(#kWob)">${s}</g>`; }
function water(r, y, x0, x1) { let s = `<path d="M${x0},${y}L${x1},${y + 6}L${x1},${H}L${x0},${H}Z" fill="#2a3a40" opacity="0.55"/>`; for (let i = 0; i < 9; i++) { const yy = y + i * 12 + r() * 6, xa = x0 + r() * (x1 - x0) * 0.6; s += K.drybrush(r, [[xa, yy], [xa + 90 + r() * 120, yy - 3], [xa + 200 + r() * 160, yy + 2]], 6, i % 3 ? '#c8d4d0' : INK, { dry: 1, op: 0.7, body: false, bristles: 3 }); } return s; }

// ==== course marks (NOTES rule 8), so a course reads even where the ink is small: fire throws embers and ash, frost
// falls as pale specks and rimes the floor, lightning burns branch along the floor, toxin is grey-green hatched mist,
// water drips and pools, void is a clean bored hole with its wall showing
function courseMarks(r, course, p, floorY, k) {
  const y = Math.min(H - 24, floorY), ink = K.courseInk(course, { attuned: true });
  let s = '';
  if (course === 'fire') { for (let i = 0; i < 26; i++) { const q = add(p, [(r() - 0.5) * 420 * k, -r() * 260 * k]); s += `<path d="M${f1(q[0])},${f1(q[1])}l${f1(1 + r() * 3)},${f1(-3 - r() * 5)}" stroke="${r() < 0.55 ? ink : '#2a2020'}" stroke-width="${f1(2 + r() * 2.4)}" stroke-linecap="round"/>`; } }
  else if (course === 'frost') { for (let i = 0; i < 60; i++) { const q = [r() * W, r() * H]; s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(1 + r() * 2.2)}" fill="#eef4f6" opacity="${f1(0.5 + r() * 0.4)}"/>`; } s += K.inkRime(r, [[40, y], [W * 0.5, y - 8], [W - 40, y + 4]], 16); }
  else if (course === 'lightning') { const a = [p[0] - 60 * k, y - 4]; s += K.drybrush(r, [a, add(a, [140 * k, -10]), add(a, [260 * k, 6]), add(a, [360 * k, -12])], 10, INK, { dry: 0.9, op: 0.85, body: false, bristles: 5 }) + K.drybrush(r, [add(a, [140 * k, -10]), add(a, [190 * k, 30]), add(a, [230 * k, 24])], 7, ink, { dry: 0.9, op: 0.9, body: false, bristles: 4 }); }
  else if (course === 'toxin') { for (const [dx, w] of [[-160, 120], [40, 150], [240, 120]]) s += K.billow(r, [p[0] + dx * k, y - 40], w * k, 40 * k, '#5e6848', { op: 0.45, lw: 4 }); }
  else if (course === 'water') { s += K.inkDrip(r, add(p, [0, 30 * k]), ink, 3) + K.drybrush(r, [[p[0] - 220 * k, y], [p[0], y - 6], [p[0] + 240 * k, y + 2]], 18 * k, ink, { dry: 0.8, op: 0.75, body: false, bristles: 8 }); }
  else if (course === 'void') { const c = add(p, [120 * k, 40 * k]), rx = 34 * k, ry = 22 * k; s += `<g filter="url(#kRag)"><ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx * 1.2)}" ry="${f1(ry * 1.2)}" fill="${ink}" stroke="${INK}" stroke-width="3"/><ellipse cx="${f1(c[0] + rx * 0.1)}" cy="${f1(c[1] + ry * 0.12)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#06040a"/><path d="M${f1(c[0] - rx)},${f1(c[1])}A${f1(rx)},${f1(ry)} 0 0 1 ${f1(c[0] + rx)},${f1(c[1])}" stroke="${mix(ink, PAPER, 0.5)}" stroke-width="2" fill="none" opacity="0.8"/></g>`; }
  return `<g data-fx="course">${s}</g>`;
}
// ==== motif kits: the card's own thing, drawn at the act (words from hero_routes motif text)
const MOTIF = [
  [/red line|thin red|red arc|red lines|hair-thin/, 'redline'], [/bell|ring arcs|ringing|toll/, 'ring'], [/thread/, 'thread'], [/bone/, 'bones'],
  [/sand|grains/, 'sand'], [/rime|frost|\bice\b|white star|snow|frozen/, 'frost'], [/blood|red pool|red to the elbow|bleeding|blistered/, 'blood'],
  [/spark|lightning|scorch/, 'spark'], [/\brope/, 'rope'], [/barb|spike|wire|thorn/, 'barbs'], [/tally/, 'tally'], [/robe scrap|torn robe|ribbons|robe dragged|coat/, 'cloth'],
  [/green|rot\b|venom|bile|veins|mist/, 'toxic'], [/\bstars?\b|night/, 'stars'], [/smoke|white ash|fuse/, 'smoke'], [/dust|silt|stone chips/, 'dust'], [/shallows|water at/, 'water'],
  [/flask|bottle|charge/, 'glass'], [/shard|mirror|cracked glass|glass/, 'shards'], [/vermilion|fire|flare/, 'flame'], [/afterimage|ghost|echo|beat later|twice/, 'echo'],
];
function motifsOf(text) { const out = []; for (const [re, k] of MOTIF) if (re.test(text) && !out.includes(k)) out.push(k); return out.slice(0, 3); }

// ==== the composition
const fxInk = (course, card = {}) => K.courseInk(course, { attuned: card.cat === 'attuned' });   // attuned cards pull less toward black (L60)
const SHADE = `<filter id="hShade" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="0.42"/><feFuncG type="linear" slope="0.42"/><feFuncB type="linear" slope="0.46"/></feComponentTransfer></filter>`;
function heroCard(card, id, o, ctx) {
  const S = ctx.S, A = allocation(S)[id];
  const course = ctx.courseOf(card, o), c = COURSE[course], r = rng(seedOf(id) * 7 + 3), ink = fxInk(course, card), cls = card.cls;
  const pc = posesFor(cls).find(p => p.name === A.pose), P = pc.P, F = HS.FRAMES[A.frame];
  const fig = ctx.heroOf(card, course);
  const h = K.hero(fig[0], fig[1], P.pose, fig[2] || 'heroes', { hide: P.hide });
  const ref = P.weapon || P.hand || P.face;
  const refPt = (!ref || !h.J[ref[0]]) ? h.joint('hand_n') : ref[1] ? h.at(ref[0], ref[1]) : h.joint(ref[0]);
  const feet = ['foot_n', 'foot_f'].filter(n => h.J[n]).map(n => h.joint(n)).sort((a, b) => b[1] - a[1])[0];
  const A0 = F.anchor === 'feet' ? feet : F.anchor === 'act' ? refPt : F.anchor === 'grip' ? HS.gripPt(h, ref, refPt) : h.joint('head');
  const M = p => K.mapPt(p, A0, A.at, A.scale), J = n => (h.J[n] ? M(h.joint(n)) : null);
  const act = M(refPt), head = J('head'), handN = J('hand_n'), hip = J('pelvis') || head;
  const k = Math.max(A.frame === 'full' ? 0.95 : 0.7, Math.min(1.9, A.scale / 1.3)) * (F.fxScale || 1);   // FX size follows the figure, with a floor so a full-figure act still reads at 162 px
  const fwd = A.frame === 'ots' ? [1, -0.05] : [1, 0.1];
  const motifText = HR.HERO[id][2], motifs = motifsOf(motifText), mech = A.mech;
  // the ground: this card's own view of its room (allocated), the pool where the act is (low: behind the head)
  const room = card.cat === 'attuned' ? ctx.roomOf(card, course, id) : A.view.room || ctx.roomOf(card, course, id);   // an attuned card's room follows its course (L60)
  const pool = A.frame === 'low' ? [head[0] + 60, head[1] + 80, 520, 330] : A.frame === 'ots' ? [Math.min(900, act[0] + 120), act[1], 460, 280] : A.frame === 'full' ? [lerp(hip, act, 0.5)[0], 320, 520, 300] : [act[0] + 40, act[1], 440, 280];
  let body = K.ground(r, Object.assign({ room, x: A.view.x, y: A.view.y, w: A.view.w, c, pool, dark: A.frame === 'ots' ? 0.18 : 0.3 }, o.ground || {}));
  // where the act lands: a point ahead of the anchor, out in the room for the ots view
  const hit = A.frame === 'ots' ? [Math.min(W - 120, act[0] + 260), act[1] + 30] : add(act, mul(fwd, 70 * k));
  let back = '', front = '';
  const swingArc = (piv, head2, sweep, w) => { const R = len(sub(head2, piv)), a1 = Math.atan2(head2[1] - piv[1], head2[0] - piv[0]), a0 = a1 - sweep * Math.PI / 180, pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + (a1 - a0) * i / 12; pts.push(add(piv, [Math.cos(a) * R, Math.sin(a) * R])); } return K.drybrush(r, pts, w, INK, { profile: t => 0.12 + 0.88 * Math.pow(t, 1.6) * (t > 0.93 ? (1 - t) * 14 : 1), dry: 1, bodyLen: 0, body: false, op: 0.85, ragStart: 0, bristles: 16 }) + K.motionHatch(r, pts.map(p => add(piv, mul(sub(p, piv), 0.8))), w * 0.9, INK, { lw: 2.2, op: 0.7 }); };
  const incoming = (g) => { let s = ''; for (let i = 0; i < 3; i++) { const y = g[1] - 90 * k + i * 80 * k; s += K.motionHatch(r, [[g[0] + 330 * k, y + 30], [g[0] + 190 * k, y + 10], [g[0] + 50 * k, y]], 32 * k, INK, { lw: 2.4, op: 0.75, slant: 0.35 }); } return s + K.impact(r, add(g, [8, 0]), 56 * k, ink, { rays: 7, a0: 1.7, fan: 0.55, core: false, splat: { dir: [0.3, -1], spread: 2.6 } }); };
  const piv = J(P.pivot) || J('upperarm_n') || J('torso') || head;
  // an element is a shape, not a hue (L61): on a course card the stroke leaves the hand as ink and becomes the element
  // where it travels and lands (element_fx.js); physical cards and the doom threads stay ink
  let done = false;
  if (ELEMENT_SHAPES && EF.isElement(course)) {
    const floorY = Math.min(H - 30, feet ? M(feet)[1] : H - 40), hitP = A.frame === 'ots' ? hit : [Math.min(W - 170, act[0] + 380 * k), Math.min(H - 130, act[1] + 40 * k)];
    const arcPath = (a, b, lift) => { const mid = [lerp(a, b, 0.5)[0], Math.min(a[1], b[1]) - lift]; return [a, lerp(a, mid, 0.5), mid, lerp(mid, b, 0.55), b]; };
    done = true;
    switch (mech) {
      case 'flick': case 'dart': case 'bolt': case 'lance': { const straight = mech !== 'flick'; back += EF.stroke(r, course, straight ? [act, lerp(act, hitP, 0.5), hitP] : arcPath(act, hitP, 90 * k), (mech === 'bolt' || mech === 'lance' ? 30 : mech === 'dart' ? 16 : 22) * k); front += EF.impact(r, course, hitP, (mech === 'bolt' ? 105 : 92) * k, { floorY, dir: [1, 0] }); break; }
      case 'flung': back += EF.stroke(r, course, arcPath(act, hitP, 90 * k), 16 * k, { inkPart: 0.55 }); front += bead(r, lerp(act, hitP, 0.6), [1, 0.3], 22 * k, '#6a5a34') + shards(r, hitP, 120 * k, [1, -0.2], '#b8c4a8', 7, 6 * k) + EF.impact(r, course, hitP, 95 * k, { floorY, dir: [1, 0] }); break;
      case 'stroke': back += EF.stroke(r, course, [add(hitP, [-170 * k, -100 * k]), hitP, add(hitP, [150 * k, 90 * k])], 24 * k, { inkPart: 0.3 }) + EF.stroke(r, course, [add(hitP, [-160 * k, 110 * k]), hitP, add(hitP, [160 * k, -80 * k])], 18 * k, { inkPart: 0.3 }); front += EF.impact(r, course, hitP, 85 * k, { floorY, dir: [1, 0] }); break;
      case 'strike': case 'press': { back += mech === 'strike' ? K.motionHatch(r, [add(act, [-230 * k, 30 * k]), add(act, [-120 * k, 14 * k]), add(act, [-20, 4])], 44 * k, INK, { lw: 2.4, op: 0.75 }) : ''; front += EF.impact(r, course, add(act, [(mech === 'strike' ? 110 : 40) * k, 10 * k]), 85 * k, { floorY, dir: [1, 0] }); break; }
      case 'drop': { const p = add(act, [30 * k, 60 * k]); front += bead(r, add(p, [0, 80 * k]), [0, 1], 22 * k, '#c8d0c8') + EF.impact(r, course, [p[0], Math.min(floorY - 40, p[1] + 220 * k)], 54 * k, { floorY, dir: [0, -1] }); break; }
      case 'pour': front += EF.pour(r, course, act, [act[0] + 170 * k, floorY], 16 * k); break;
      case 'gust': case 'spit': { const m = add(head, [60 * k, 20 * k]); back += EF.stroke(r, course, [m, add(m, [170 * k, -20 * k]), add(m, [360 * k, 20 * k])], 30 * k, { inkPart: 0.2 }); front += EF.impact(r, course, add(m, [400 * k, 30 * k]), 90 * k, { floorY, dir: [1, 0] }); break; }
      case 'blast': { for (let i = 0; i < 5; i++) { const a = -1.1 + i * 0.5; back += EF.stroke(r, course, [act, add(act, [Math.cos(a) * 160 * k, Math.sin(a) * 130 * k]), add(act, [Math.cos(a) * 320 * k, Math.sin(a) * 250 * k])], 18 * k, { inkPart: 0.25 }); } front += EF.impact(r, course, add(act, [120 * k, 0]), 105 * k, { floorY, dir: [1, 0] }); break; }
      case 'gather': case 'rays': { const tgt = mech === 'rays' ? hitP : act; for (let i = 0; i < 5; i++) { const a = (-140 + i * 55) * Math.PI / 180, far = add(tgt, [Math.cos(a) * 300 * k + (mech === 'rays' ? -200 * k : 240 * k), Math.sin(a) * 220 * k]); back += EF.stroke(r, course, mech === 'gather' ? [tgt, lerp(tgt, far, 0.5), far] : [far, lerp(far, tgt, 0.5), tgt], (mech === 'rays' ? 8 : 14) * k, { inkPart: mech === 'gather' ? 0.25 : 0.4 }); } front += EF.impact(r, course, tgt, (mech === 'rays' ? 85 : 70) * k, { floorY, dir: [1, 0] }); break; }
      default: done = false;
    }
  }
  if (!done) switch (mech) {
    case 'chop': back += swingArc(piv, act, 110, 64 * k); front += K.impact(r, add(act, [30 * k, 30 * k]), 70 * k, ink, { rays: 8, a0: -1.3, fan: 0.85, splat: { dir: [1, 0.5], spread: 1.6 } }); break;
    case 'uppercut': back += swingArc(piv, act, -100, 60 * k); front += K.impact(r, add(act, [20 * k, -30 * k]), 64 * k, ink, { rays: 7, a0: -2.2, fan: 0.6, splat: { dir: [0.5, -1], spread: 1.6 } }); break;
    case 'smash': case 'edge': case 'snap': back += K.motionHatch(r, [add(act, [-220 * k, 50 * k]), add(act, [-110 * k, 20 * k]), add(act, [-14, 4])], 46 * k, INK, { lw: 2.4, op: 0.75 }); front += K.impact(r, hit, 66 * k, ink, { rays: 8, a0: -1, fan: 0.8, splat: { dir: fwd, spread: 1.8 } }) + flecks(r, hit, 110 * k, fwd, ink === INK ? '#5a4a3a' : ink); break;
    case 'rake': front += K.slash(r, [add(act, [-40 * k, -60 * k]), add(act, [60 * k, -10 * k]), add(act, [170 * k, 40 * k]), add(act, [260 * k, 110 * k])], 30 * k, ink); break;
    case 'shove': case 'charge': back += [0, 1, 2, 3].map(i => K.motionHatch(r, [add(hip, [-420 * k, -120 * k + i * 70 * k]), add(hip, [-260 * k, -126 * k + i * 70 * k]), add(hip, [-120 * k, -130 * k + i * 70 * k])], 30 * k, INK, { lw: 2.2, op: 0.7 })).join('') + grit(r, [hip[0] - 120 * k, Math.min(H, feet ? M(feet)[1] : H)], 320 * k); front += K.impact(r, add(act, [40 * k, 0]), 60 * k, ink, { rays: 7, a0: -0.8, fan: 0.6, core: false, splat: { dir: [1, 0], spread: 1.6 } }); break;
    case 'sweep': case 'swing': { const R0 = Math.max(160 * k, len(sub(act, hip))); back += K.drybrush(r, arcPts(hip, R0, mech === 'sweep' ? 160 : 200, mech === 'sweep' ? 360 : 330, 16, mech === 'sweep' ? 0.35 : 0.9), 54 * k, INK, { profile: t => 0.1 + 0.9 * Math.pow(t, 1.4), dry: 1, body: false, op: 0.8, bristles: 16 }); front += K.impact(r, act, 58 * k, ink, { rays: 7, a0: -0.6, fan: 0.7, core: false, splat: { dir: [1, -0.2], spread: 1.6 } }); break; }
    case 'spin': for (let i = 0; i < 3; i++) front += K.slash(r, arcPts(hip, (190 + i * 40) * k, -40 + i * 120, 40 + i * 120, 8, 0.45), 26 * k, ink); back += K.drybrush(r, arcPts(hip, 230 * k, 0, 340, 20, 0.4), 30 * k, INK, { dry: 1, body: false, op: 0.55, bristles: 12 }); break;
    case 'cut': case 'flurry': case 'feint': { const n = mech === 'flurry' ? 5 : mech === 'feint' ? 2 : Math.min(3, Math.max(1, ...(card.fx || []).map(x => x.times || 1)) + (/two|second|third|between/.test(card.name.toLowerCase()) ? 1 : 0)); for (let i = 0; i < n; i++) { const X = add(hit, [i * 50 * k - (n - 1) * 25 * k, (i % 2) * 24 * k]), sz = mech === 'flurry' ? 0.5 : 1; front += K.slash(r, [add(X, [-70 * k * sz, -110 * k * sz]), add(X, [-20 * k * sz, -36 * k * sz]), add(X, [24 * k * sz, 46 * k * sz]), add(X, [50 * k * sz, 110 * k * sz])], (mech === 'feint' && i === 0 ? 10 : 28) * k, mech === 'feint' && i === 0 ? mix(ink, PAPER, 0.5) : ink); } back += K.drybrush(r, [add(act, [-280 * k, 40 * k]), add(act, [-140 * k, 24 * k]), add(act, [-16, 12])], 16 * k, INK, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.5, bristles: 7 }); break; }
    case 'graze': front += redLine(r, [add(hit, [-110 * k, 14 * k]), add(hit, [0, 0]), add(hit, [130 * k, -16 * k])], 7 * k); break;
    case 'circle': front += K.drybrush(r, arcPts(add(act, [40 * k, 0]), 46 * k, -200, 140, 18), 12 * k, ink, { dry: 0.8, body: false, op: 0.9, bristles: 6 }) + shards(r, add(act, [110 * k, 10 * k]), 90 * k, [1, 0.3], '#8a8070', 7, 7 * k); break;
    case 'thrust': case 'lunge': case 'stab': case 'point': { const tip = act, dir = norm(sub(act, J('hand_n') || hip)); back += K.motionHatch(r, [sub(tip, mul(dir, 320 * k)), sub(tip, mul(dir, 160 * k)), sub(tip, mul(dir, 20))], 40 * k, INK, { lw: 2.4, op: 0.75 }); front += K.impact(r, add(tip, mul(dir, 40 * k)), 50 * k, ink, { rays: 6, a0: Math.atan2(dir[1], dir[0]) - 0.9, fan: 0.4, core: false, splat: { dir, spread: 1.4 } }); break; }
    case 'lance': front += K.drybrush(r, [act, lerp(act, [W + 40, act[1] + 20], 0.5), [W + 40, act[1] + 30]], 34 * k, ink, { profile: t => 0.5 + 0.5 * t, dry: 0.3, op: 0.95, bodyLen: 0.9, bristles: 10 }); break;
    case 'drink': front += bead(r, add(act, [120 * k, -60 * k]), [-1, 0.4], 16 * k, '#5a4a30') + shards(r, add(act, [180 * k, -40 * k]), 60 * k, [1, -0.3], '#a8b090', 5, 5 * k) + K.drybrush(r, [add(act, [300 * k, -160 * k]), add(act, [220 * k, -110 * k]), add(act, [140 * k, -70 * k])], 10 * k, INK, { dry: 1, body: false, op: 0.6, bristles: 5 }); break;
    case 'drag': back += [0, 1, 2].map(i => K.motionHatch(r, [add(act, [260 * k, -40 * k + i * 40 * k]), add(act, [140 * k, -40 * k + i * 40 * k]), add(act, [20, -40 * k + i * 40 * k])], 26 * k, INK, { lw: 2, op: 0.7 })).join(''); break;
    case 'beckon': case 'rise': case 'bow': case 'step': case 'retreat': case 'slip': case 'raise': case 'stance': {
      if (mech === 'slip' || mech === 'retreat' || mech === 'step') back += [0, 1, 2].map(i => K.motionHatch(r, [add(hip, [140 * k, -60 * k + i * 60 * k]), add(hip, [60 * k, -60 * k + i * 60 * k]), add(hip, [-20, -60 * k + i * 60 * k])], 26 * k, INK, { lw: 2, op: 0.6 })).join('');
      if (mech === 'slip') front += K.slash(r, [add(hip, [220 * k, -260 * k]), add(hip, [150 * k, -120 * k]), add(hip, [110 * k, 40 * k]), add(hip, [120 * k, 160 * k])], 30 * k, mix(ink, PAPER, 0.35));
      if (mech === 'raise') front += K.motionHatch(r, [add(act, [0, 200 * k]), add(act, [0, 110 * k]), add(act, [0, 30])], 36 * k, INK, { lw: 2.4, op: 0.7 });
      if (mech === 'bow') front += K.drybrush(r, [act, add(act, [60 * k, -80 * k]), add(act, [140 * k, -40 * k]), add(act, [100 * k, 30 * k])], 12 * k, ink, { dry: 0.9, body: false, op: 0.8, bristles: 5 });
      if (mech === 'rise') front += grit(r, [act[0], Math.min(H, act[1] + 120 * k)], 240 * k);
      if (mech === 'stance') front += incoming(act);
      break; }
    case 'brace': front += incoming(act) + (/door/.test(String(ref && ref[0])) ? flecks(r, act, 120 * k, [0.6, -1], '#7a5a3a') : ''); break;
    case 'wade': front += water(r, Math.min(H - 70, (feet ? M(feet)[1] : H) - 120 * k), 0, W); front += incoming(act); break;
    case 'flick': case 'dart': case 'bolt': case 'stroke': case 'strike': case 'flung': case 'drop': {
      const hitP = A.frame === 'ots' ? hit : [Math.min(W - 160, act[0] + 380 * k), Math.min(H - 120, act[1] + 40 * k)];
      if (mech === 'stroke') { front += K.drybrush(r, [add(hitP, [-150 * k, -90 * k]), hitP, add(hitP, [140 * k, 80 * k])], 28 * k, ink, { dry: 0.7, op: 0.95, bodyLen: 0.5, bristles: 10 }); front += K.drybrush(r, [add(hitP, [-140 * k, 100 * k]), hitP, add(hitP, [150 * k, -70 * k])], 22 * k, mix(ink, PAPER, 0.25), { dry: 0.7, op: 0.95, bodyLen: 0.5, bristles: 8 }); break; }
      if (mech === 'strike') { back += K.motionHatch(r, [add(act, [-230 * k, 30 * k]), add(act, [-120 * k, 14 * k]), add(act, [-20, 4])], 44 * k, INK, { lw: 2.4, op: 0.75 }); front += K.impact(r, add(act, [90 * k, 10 * k]), 64 * k, ink, { rays: 7, a0: -1, fan: 0.75, splat: { dir: [1, 0], spread: 1.8 } }); break; }
      if (mech === 'drop') { const p = add(act, [30 * k, 60 * k]); front += bead(r, add(p, [0, 90 * k]), [0, 1], 24 * k, '#c8d0c8') + K.drybrush(r, [p, add(p, [0, 50 * k]), add(p, [0, 70 * k])], 6 * k, '#c8d0c8', { dry: 1, body: false, op: 0.7, bristles: 3 }) + K.splatter(r, [p[0], Math.min(H - 30, p[1] + 230 * k)], 100 * k, INK, { dir: [0, -1], spread: 2.6, n: 18, blotR: 0.2 }); break; }
      const straight = mech === 'dart' || mech === 'bolt', mid = straight ? lerp(act, hitP, 0.5) : [lerp(act, hitP, 0.5)[0], Math.min(act[1], hitP[1]) - 90 * k], pth = [act, lerp(act, mid, 0.5), mid, lerp(mid, hitP, 0.55), hitP];
      const PP = K.catmull(pth, 10), bi = Math.round(PP.length * 0.62), bd = PP[bi];
      back += K.drybrush(r, PP.slice(0, Math.max(3, bi - 1)).filter((q, i) => i % 3 === 0 || i === bi - 2),(mech === 'bolt' ? 40 : mech === 'dart' ? 14 : 26) * k, ink, { profile: t => 0.1 + 0.9 * t, dry: 1, body: false, op: 0.85, bristles: 12 });
      front += bead(r, bd, norm(sub(PP[Math.min(PP.length - 1, bi + 2)], bd)), (mech === 'flung' ? 26 : mech === 'bolt' ? 24 : 16) * k, mech === 'flung' ? '#6a5a34' : ink);
      front += K.impact(r, hitP, (mech === 'bolt' ? 70 : 54) * k, ink, { rays: 7, core: false, a0: -0.5, splat: { dir: [1, 0.1], spread: 2.4 } });
      if (mech === 'flung') front += shards(r, hitP, 150 * k, [1, -0.2], '#b8c4a8', 9, 7 * k);
      break; }
    case 'pour': { const fl = [act[0] + 160 * k, Math.min(H - 40, act[1] + 280 * k)], st = [act, add(act, [60 * k, 40 * k]), add(act, [120 * k, 160 * k]), fl]; front += K.drybrush(r, st, 22 * k, ink, { profile: t => 0.5 + 0.5 * t, dry: 0.5, op: 0.95, bodyLen: 0.6, bristles: 8 }) + K.drybrush(r, [add(fl, [-200 * k, 18]), add(fl, [0, 6]), add(fl, [260 * k, 20])], 34 * k, ink, { dry: 0.8, op: 0.85, bodyLen: 0.5, bristles: 14 }) + K.splatter(r, fl, 140 * k, ink, { dir: [0.4, -1], spread: 2.2, n: 26, blotR: 0.18 }); break; }
    case 'gust': case 'blast': case 'spit': { const m = add(head, [60 * k, 20 * k]); if (mech === 'blast') { for (let i = 0; i < 9; i++) { const a = -1.2 + i * 0.3; front += K.flick(r, add(act, [Math.cos(a) * 60 * k, Math.sin(a) * 60 * k]), add(act, [Math.cos(a) * 300 * k, Math.sin(a) * 260 * k]), 20 * k, ink); } break; }
      for (const [dx, dy, w2, h2] of [[50, 0, 50, 30], [130, -20, 70, 40], [230, -10, 90, 50]]) front += K.billow(r, add(m, [dx * k, dy * k]), w2 * k, h2 * k, mech === 'spit' ? '#5e6848' : mix(ink, '#888070', 0.4), { op: 0.6, lw: 4 });
      if (mech === 'spit') for (let i = 0; i < 6; i++) front += bead(r, add(m, [(80 + r() * 200) * k, (r() - 0.3) * 80 * k]), [1, 0.2], (4 + r() * 6) * k, '#5e6848'); break; }
    case 'gather': case 'rays': { const tgt = mech === 'rays' ? hit : act; for (let i = 0; i < 6; i++) { const a = (-150 + i * 50) * Math.PI / 180, far = add(tgt, [Math.cos(a) * 330 * k + (mech === 'rays' ? -200 * k : 260 * k), Math.sin(a) * 240 * k]); front += K.drybrush(r, [far, lerp(far, tgt, 0.5), tgt], (mech === 'rays' ? 6 : 14) * k, i % 2 ? ink : mix(ink, PAPER, 0.3), { profile: t => mech === 'rays' ? 1 : 0.2 + 0.8 * t, dry: 0.8, body: false, op: 0.85, bristles: mech === 'rays' ? 3 : 6 }); } if (mech === 'rays') front += K.impact(r, tgt, 50 * k, ink, { rays: 6, core: false }); break; }
    case 'press': case 'still': { const c0 = add(act, [24 * k, 0]); if (mech === 'press') { for (let i = 0; i < 6; i++) { const a = i * 60 * Math.PI / 180; front += K.drybrush(r, [add(c0, [Math.cos(a) * 60 * k, Math.sin(a) * 60 * k]), add(c0, [Math.cos(a) * 110 * k, Math.sin(a) * 110 * k])], 18 * k, ink, { dry: 0.6, op: 0.9, bodyLen: 0.6, bristles: 6 }); } } else { for (let i = 0; i < 5; i++) back += K.motionHatch(r, arcPts(c0, (70 + i * 28) * k, 200, 340, 10), 14 * k, INK, { lw: 1.6, op: 0.6 - i * 0.1, grow: false }); } break; }
    case 'sand': front += grains(r, act, [1, A.frame === 'full' && /stop|walk/.test(id) ? 1.6 : -0.1], 420 * k, 0.8, 220); break;
    case 'scatter': front += bones(r, add(act, [140 * k, -20 * k]), 240 * k, [1, -0.1], 9, 14 * k) + K.motionHatch(r, [add(act, [-120 * k, 40 * k]), add(act, [-60 * k, 20 * k]), add(act, [0, 0])], 30 * k, INK, { lw: 2, op: 0.6 }); break;
    case 'thread': case 'lash': { const tgt = A.frame === 'ots' ? hit : [Math.min(W - 120, act[0] + 420 * k), act[1] + (mech === 'lash' ? 60 : -20) * k], mid = lerp(act, tgt, 0.5), wob = mech === 'lash' ? 90 * k : 30 * k; const pts = [act, add(lerp(act, mid, 0.5), [0, -wob]), mid, add(lerp(mid, tgt, 0.5), [0, wob]), tgt]; front += redLine(r, pts, 9 * k); if (mech === 'lash') front += K.impact(r, tgt, 40 * k, '#5a1410', { rays: 5, core: false }); else front += `<path d="M${f1(tgt[0])},${f1(tgt[1])}q${f1(18 * k)},${f1(-4 * k)} ${f1(14 * k)},${f1(16 * k)}" stroke="${INK}" stroke-width="${f1(4 * k)}" fill="none" stroke-linecap="round"/>`; break; }
    case 'echo': break;   // drawn below: faint afterimages of the figure
    case 'ward': { const c0 = [hip[0] + 100 * k, Math.min(H - 30, (feet ? M(feet)[1] : H - 60))]; for (let i = 0; i < 2; i++) back += K.drybrush(r, arcPts(c0, (260 + i * 70) * k, 180 + i * 20, 520 - i * 30, 24, 0.22), (26 - i * 8) * k, i ? mix(ink, PAPER, 0.3) : ink, { dry: 0.9, body: false, op: 0.85, bristles: 10 }); if (P.face) front += incoming(act); break; }
    case 'veil': front += K.drybrush(r, [add(act, [-60 * k, -200 * k]), add(act, [40 * k, -60 * k]), add(act, [60 * k, 120 * k]), add(act, [20 * k, 260 * k])], 120 * k, '#2a2034', { dry: 0.5, op: 0.85, bodyLen: 0.8, bristles: 18 }) + incoming(add(act, [70 * k, 0])); break;
    case 'reflect': { const m = act, from = [W - 60, act[1] - 140 * k], back2 = [W - 40, act[1] + 160 * k]; front += K.drybrush(r, [from, lerp(from, m, 0.5), add(m, [30 * k, 0])], 24 * k, ink, { profile: t => 0.3 + 0.7 * t, dry: 0.8, body: false, op: 0.85, bristles: 10 }) + K.drybrush(r, [add(m, [30 * k, 0]), lerp(m, back2, 0.5), back2], 30 * k, ink, { profile: t => 1 - 0.6 * t, dry: 0.8, body: false, op: 0.9, bristles: 10 }) + shards(r, add(m, [30 * k, 0]), 70 * k, [1, 0], '#b8b8c8', 6, 6 * k); break; }
    case 'salt': { const y = Math.min(H - 30, (feet ? M(feet)[1] : H - 50)), x0 = act[0] - 60; front += grains(r, act, [0.25, 1], Math.max(60, y - act[1]), 0.25, 140, '#f0ece0') + K.drybrush(r, [[x0 - 40, y - 4], [x0 + 200, y - 10], [x0 + 520, y]], 18, '#ece6d8', { dry: 0.7, op: 0.95, bodyLen: 0.6, bristles: 10 }); break; }
    case 'pin': front += K.impact(r, add(act, [10 * k, 40 * k]), 40 * k, ink, { rays: 6, core: false, a0: 0.6, fan: 0.6 }) + barbs(r, add(act, [10 * k, 40 * k]), 80 * k, [1, 0.6], 6).replace(/#8a8a84/g, '#c8b070'); break;
    default: front += K.impact(r, hit, 56 * k, ink, { rays: 7, core: false });
  }
  // motif kits at the act, big enough to read at 162 x 86
  const mp = A.frame === 'ots' ? hit : lerp(act, hit, 0.6);
  for (const mk of motifs) {
    if (mk === 'redline' && mech !== 'graze') front += redLine(r, [add(mp, [-90 * k, 30 * k]), add(mp, [10 * k, 0]), add(mp, [120 * k, -26 * k])], 8 * k);
    if (mk === 'ring') back += ringArcs(r, mp, 110 * k);
    if (mk === 'thread' && mech !== 'thread' && mech !== 'lash') front += redLine(r, [add(act, [0, -10]), add(mp, [0, -80 * k]), add(mp, [160 * k, -40 * k])], 7 * k);
    if (mk === 'bones' && mech !== 'scatter') front += bones(r, mp, 110 * k, [1, 0], 5, 13 * k);
    if (mk === 'sand' && mech !== 'sand') front += grains(r, add(act, [0, 20]), [0.3, 1], 240 * k, 0.5, 120);
    if (mk === 'frost') { front += K.inkRime(r, [add(act, [-50 * k, -12 * k]), act, add(act, [50 * k, 14 * k])], 22 * k) + shards(r, mp, 140 * k, fwd, '#d8e6ec', 9, 8 * k); }
    if (mk === 'blood') front += K.splatter(r, add(mp, [30 * k, 20 * k]), 130 * k, BLOOD, { dir: [1, 0.4], spread: 1.4, n: 18, blotR: 0.16, op: 0.9 });
    if (mk === 'spark') front += K.inkBolt(r, add(act, [0, -10]), add(mp, [140 * k, -50 * k]), '#efe6c2');
    if (mk === 'rope') front += ropeWraps(r, M(h.J.door ? h.at('door', [526, 330]) : refPt), 130 * k);
    if (mk === 'barbs' && mech !== 'pin') front += barbs(r, mp, 130 * k, fwd, 12);
    if (mk === 'tally') front += tally(r, add(M(h.J.door ? h.at('door', [480, 380]) : refPt), [-40 * k, 0]), 3, 30 * k);
    if (mk === 'cloth') front += clothScrap(r, add(act, [40 * k, 20 * k]), 60 * k);
    if (mk === 'toxic') front += K.billow(r, add(mp, [60 * k, 0]), 90 * k, 46 * k, '#5e6848', { op: 0.6, lw: 4 }) + K.billow(r, add(mp, [170 * k, -40 * k]), 70 * k, 36 * k, '#68705a', { op: 0.5, lw: 4 });
    if (mk === 'stars') front += stars(r, add(mp, [80 * k, -60 * k]), 180 * k, 14);
    if (mk === 'smoke') front += K.inkSteam(r, add(act, [10 * k, -10]), 200 * k, '#b8b4a8', { n: 3 });
    if (mk === 'dust') front += grit(r, [act[0], Math.min(H, act[1] + 160 * k)], 260 * k);
    if (mk === 'water' && mech !== 'wade') front += water(r, H - 90, 0, W);
    if (mk === 'glass' && mech !== 'flung' && mech !== 'drink') front += shards(r, mp, 120 * k, fwd, '#b8c4a8', 7, 7 * k);
    if (mk === 'shards') front += shards(r, mp, 170 * k, fwd, '#c0c4d0', 10, 8 * k);
    if (mk === 'flame') front += K.inkFlame(r, add(mp, [40 * k, 40 * k]), 120 * k, INK6.fire);
  }
  if (!(done && course === 'void')) front += courseMarks(r, course, mp, feet ? M(feet)[1] : H - 40, k);   // one hole only (L38): the element impact already bored it
  // the hero: the figure layer alone is the hero mask render.js writes for herosim.py (L59)
  const figSvg = K.place(h.body, A0, A.at, A.scale);
  let echo = '';
  if (mech === 'echo' || motifs.includes('echo')) for (const [dx, op] of [[-90, 0.22], [-46, 0.34]]) echo += `<g opacity="${op}">${K.place(h.body, A0, add(A.at, [dx * k, -6]), A.scale)}</g>`;
  body += `<g class="cfx">${back}</g>` + echo + `<g id="hero"${F.shade ? ' filter="url(#hShade)"' : ''}>${figSvg}</g>` + `<g class="cfx">${front}</g>`;   // cfx: the act's FX layer (attuned_check.py L61 reads it alone)
  return { course: c, defs: h.defs + SHADE, body, meta: { id, kind: 'hero', frame: A.frame, pose: A.pose, mech, sil: A.sil, room } };
}
const has = id => !!HR.HERO[id];
module.exports = { heroCard, has, allocation, posesFor, motifsOf, MECH, SIL_TARGET };
