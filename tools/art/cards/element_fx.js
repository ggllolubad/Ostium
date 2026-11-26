// Element FX (LESSONS L61, Cole 2026-11-25: "i want them to look like that ELEMENT not just that color").
// The Elementalist writes a course: the stroke leaves the nib or the hand as ink and BECOMES the element where it travels
// and lands. Each element is its own shape, drawn in woodcut ink (rule 6: no glows, neon or sparkles), so the six
// courses read apart even in greyscale:
//   fire       flame tongues breaking off the stroke, smoke, ash and embers, a scorched char ring; ochre and orange, never
//              the round splat (it reads as blood; red is for blood, rule 9)
//   frost      the stroke stiffens into rime with icicle spurs; a bloom of hoar crystals where it lands; pale specks falling
//   lightning  the stroke forks into a jagged branching bolt; a burnt branching scar on the floor
//   water      a breaking wave crest or sheet of water throwing droplets; a pooled spill
//   toxin      grey-green fume billowing off the stroke; mould blooming where it lands
//   void       the stroke ends in a clean bored hole or rift with its wall showing; the surroundings drawn toward it
// physical (and any unknown course) keeps plain ink. stroke(), impact() and pour() return SVG strings in card space.
'use strict';
const K = require('./card_kit');
const { E, INK, PAPER } = K;
const { add, sub, mul, lerp, rot, mix, norm, len } = E;
const f1 = K.f1;

const COL = {
  fire: { body: '#c8782a', core: '#e0a848', dark: '#3a2010', smoke: '#7a7268' },
  frost: { body: '#dce8ee', core: '#f4f8fa', dark: '#5a7484' },
  lightning: { body: '#efe2a8', core: '#faf4d8', dark: '#2a2414' },
  water: { body: '#3e6a96', core: '#a8c4d4', dark: '#1a2c40' },
  toxin: { body: '#7a8a3a', core: '#c8c890', dark: '#1e2410', fume: '#3a4220' },
  void: { body: '#4b2a5c', core: '#8a6a9a', dark: '#06040a' },
};
const ELEMENTS = Object.keys(COL);
const isElement = c => ELEMENTS.includes(c);
const tri = (a, b, c) => 'M' + [a, b, c].map(p => f1(p[0]) + ',' + f1(p[1])).join('L') + 'Z';

// ---- pieces
function tongues(r, base, h, n, c) {   // flame tongues rising off a point: the kit's ink flame (dark tongues, an ochre core), spread
  let s = '';
  for (let i = 0; i < n; i++) s += K.inkFlame(r, add(base, [(i - (n - 1) / 2) * h * 0.35, (r() - 0.5) * h * 0.1]), h * (0.75 + r() * 0.5), c.core);
  return s;
}
function embers(r, c0, R, n, c) { let s = ''; for (let i = 0; i < n; i++) { const q = add(c0, [(r() - 0.5) * R * 2, -r() * R * 1.4]); s += `<path d="M${f1(q[0])},${f1(q[1])}l${f1(1 + r() * 3)},${f1(-3 - r() * 5)}" stroke="${r() < 0.55 ? c.body : '#2a2020'}" stroke-width="${f1(2 + r() * 2.2)}" stroke-linecap="round"/>`; } return s; }
function spurs(r, pts, L, c, down = true) {   // icicle spurs hanging off a line: long pale wedges, inked, with a lit edge
  let s = '';
  pts.forEach((p, i) => { const l = L * (0.5 + r() * 0.8), a = (down ? Math.PI / 2 : -Math.PI / 2) + (r() - 0.5) * 0.5, tip = add(p, [Math.cos(a) * l, Math.sin(a) * l]), w = l * 0.18, n = [-Math.sin(a), Math.cos(a)];
    s += `<path d="${tri(add(p, mul(n, w)), add(p, mul(n, -w)), tip)}" fill="${c.body}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${f1(p[0] + n[0] * w * 0.4)},${f1(p[1] + n[1] * w * 0.4)}L${f1(tip[0])},${f1(tip[1])}" stroke="${c.core}" stroke-width="1.2"/>`; });
  return `<g filter="url(#kWob)">${s}</g>`;
}
function hoar(r, c0, R, n, c) {   // hoar crystals: short ink spines branching off a few rays, pale filled; never a sparkle
  let s = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.4, L = R * (0.5 + r() * 0.6), tip = add(c0, [Math.cos(a) * L, Math.sin(a) * L * 0.8]);
    s += `<path d="M${f1(c0[0])},${f1(c0[1])}L${f1(tip[0])},${f1(tip[1])}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(c0[0])},${f1(c0[1])}L${f1(tip[0])},${f1(tip[1])}" stroke="${c.body}" stroke-width="2.6" stroke-linecap="round"/>`;
    for (const t of [0.45, 0.7]) { const b = lerp(c0, tip, t); for (const sg of [-1, 1]) { const e = add(b, rot([L * 0.22, 0], a + sg * 0.8)); s += `<path d="M${f1(b[0])},${f1(b[1])}L${f1(e[0])},${f1(e[1])}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M${f1(b[0])},${f1(b[1])}L${f1(e[0])},${f1(e[1])}" stroke="${c.body}" stroke-width="1.6" stroke-linecap="round"/>`; } } }
  return `<g filter="url(#kWob)">${s}</g>`;
}
function jag(r, a, b, n, amp) { const pts = [a]; for (let i = 1; i < n; i++) { const t = i / n, d = norm(sub(b, a)), nn = [-d[1], d[0]]; pts.push(add(lerp(a, b, t), mul(nn, (r() - 0.5) * amp * 2))); } pts.push(b); return pts; }
function bolt(r, pts, w, c) {   // a jagged bolt as a split loaded stroke: ink under a pale core, hard corners (polyline, not a curve)
  const d = 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L');
  return `<g filter="url(#kRag)"><path d="${d}" stroke="${INK}" stroke-width="${f1(w)}" fill="none" stroke-linejoin="miter" stroke-linecap="round"/><path d="${d}" stroke="${c.body}" stroke-width="${f1(w * 0.42)}" fill="none" stroke-linejoin="miter"/></g>`;
}
function scar(r, c0, R, c) {   // a burnt branching scar on the floor: dark branching strokes, flattened
  let s = ''; const main = jag(r, add(c0, [-R, 0]), add(c0, [R, 6]), 7, 8);
  s += K.drybrush(r, main, 12, INK, { dry: 0.8, op: 0.9, body: false, bristles: 5 });
  for (let k = 1; k < main.length - 1; k += 2) { const q = main[k], e = add(q, [(r() - 0.5) * R * 0.6, (r() < 0.5 ? -1 : 1) * (10 + r() * 18)]); s += K.drybrush(r, jag(r, q, e, 3, 5), 6, INK, { dry: 1, op: 0.85, body: false, bristles: 3 }); }
  return s;
}
function crest(r, c0, R, dir, c) {   // a breaking wave crest: a thick curling sheet with a hooked lip and foam, droplets thrown off
  const d = norm(dir), n = [-d[1], d[0]], up = n[1] < 0 ? n : mul(n, -1);
  const base = [add(c0, mul(d, -R)), add(c0, mul(d, -R * 0.3)), add(add(c0, mul(d, R * 0.2)), mul(up, R * 0.5)), add(add(c0, mul(d, R * 0.55)), mul(up, R * 0.75)), add(add(c0, mul(d, R * 0.75)), mul(up, R * 0.45)), add(add(c0, mul(d, R * 0.6)), mul(up, R * 0.25))];
  let s = K.drybrush(r, base, R * 0.42, c.body, { dry: 0.4, op: 0.95, bodyLen: 0.85, bristles: 12, profile: t => 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.15)) });
  s += K.drybrush(r, base.slice(2), R * 0.12, c.core, { dry: 0.8, op: 0.9, body: false, bristles: 5 });
  s += `<path d="${K.pathD(base, false)}" stroke="${INK}" stroke-width="3" fill="none" opacity="0.8" filter="url(#kWob)"/>`;
  for (let i = 0; i < 9; i++) { const q = add(add(c0, mul(d, R * (0.4 + r() * 0.8))), mul(up, R * (0.5 + r() * 0.7))), rr = 3 + r() * 5; s += `<path d="${K.pathD([add(q, [0, -rr * 2.2]), add(q, [rr, 0]), add(q, [0, rr]), add(q, [-rr, 0])], true)}" fill="${c.core}" stroke="${INK}" stroke-width="1.4"/>`; }
  return s;
}
function puddle(r, c0, R, c) { let s = `<g filter="url(#kRag)"><ellipse cx="${f1(c0[0])}" cy="${f1(c0[1])}" rx="${f1(R)}" ry="${f1(R * 0.2)}" fill="${c.dark}" opacity="0.85"/></g>`; for (let i = 0; i < 3; i++) s += K.drybrush(r, K.arc(c0, R * (0.35 + i * 0.22), R * 0.06 * (1 + i), 200, 340, 10), 4, c.core, { dry: 1, op: 0.7, body: false, bristles: 2 }); return s; }
function mould(r, c0, R, n, c) {   // mould blooms: clusters of small rings and dots, a little hatching under
  let s = '';
  for (let i = 0; i < n; i++) { const q = add(c0, [(r() - 0.5) * R * 2, (r() - 0.5) * R * 0.7]), z = 6 + r() * 12; s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(z)}" fill="${r() < 0.5 ? c.body : c.core}" stroke="${INK}" stroke-width="1.6"/><circle cx="${f1(q[0] + z * 0.2)}" cy="${f1(q[1] + z * 0.2)}" r="${f1(z * 0.35)}" fill="${c.dark}"/>`; }
  return `<g filter="url(#kWob)">${s}</g>`;
}
function hole(r, c0, R, c) {   // a clean bored hole with its wall showing (as D.hole), and the surroundings drawn into it
  const rx = R, ry = R * 0.62;
  let s = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + r() * 0.3, far = add(c0, [Math.cos(a) * R * 3.2, Math.sin(a) * R * 2.2]), near = add(c0, [Math.cos(a) * R * 1.25, Math.sin(a) * R * 0.85]); s += K.motionHatch(r, [far, lerp(far, near, 0.5), near], 16, INK, { lw: 2, op: 0.7, grow: true }); }
  s += `<g filter="url(#kRag)"><ellipse cx="${f1(c0[0])}" cy="${f1(c0[1])}" rx="${f1(rx * 1.16)}" ry="${f1(ry * 1.16)}" fill="${c.body}" stroke="${INK}" stroke-width="3.4"/>`;
  s += `<ellipse cx="${f1(c0[0] + rx * 0.08)}" cy="${f1(c0[1] + ry * 0.14)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${c.dark}"/>`;
  s += `<path d="M${f1(c0[0] - rx)},${f1(c0[1])}A${f1(rx)},${f1(ry)} 0 0 1 ${f1(c0[0] + rx)},${f1(c0[1])}" stroke="${c.core}" stroke-width="3" fill="none" opacity="0.85"/></g>`;
  return s;
}

// ---- the stroke in flight: ink at the hand, the element along the rest
function stroke(r, course, pts, w, o = {}) {
  const c = COL[course], P = K.catmull(pts, 8), cut = Math.round(P.length * (o.inkPart ?? 0.35));
  const inkPart = P.slice(0, cut + 1), rest = P.slice(cut);
  let s = K.drybrush(r, inkPart.filter((q, i) => i % 3 === 0 || i === inkPart.length - 1), w, INK, { profile: t => 0.15 + 0.85 * t, dry: 0.8, body: false, op: 0.85, bristles: 10 });
  if (!c) return s + K.drybrush(r, rest.filter((q, i) => i % 3 === 0 || i === rest.length - 1), w, INK, { dry: 1, body: false, op: 0.85, bristles: 10 });
  const R = rest.filter((q, i) => i % 3 === 0 || i === rest.length - 1);
  if (course === 'fire') { s += K.drybrush(r, R, w * 0.8, c.dark, { dry: 0.9, body: false, op: 0.9, bristles: 8 }); R.slice(2).forEach((q, i) => { if (i % 3 === 0) s += tongues(r, q, w * 3.2, 1, c); }); s += K.inkSteam(r, R[Math.floor(R.length / 2)], w * 4, c.smoke, { n: 2 }); }
  else if (course === 'frost') { s += K.inkRime(r, R, w * 0.9) + spurs(r, R.slice(1), w * 1.8, c); }
  else if (course === 'lightning') { s += bolt(r, jag(r, R[0], R[R.length - 1], 9, w * 1.2), w * 0.9, c); for (let k = 2; k < 7; k += 2) { const q = lerp(R[0], R[R.length - 1], k / 9); s += bolt(r, jag(r, q, add(q, [(r() - 0.3) * w * 4, w * (1.5 + r() * 2)]), 3, w * 0.5), w * 0.45, c); } }
  else if (course === 'water') { s += K.drybrush(r, R, w * 1.1, c.body, { dry: 0.4, op: 0.95, bodyLen: 0.8, bristles: 10 }) + K.drybrush(r, R, w * 0.3, c.core, { dry: 0.9, op: 0.85, body: false, bristles: 4 }); R.forEach((q, i) => { if (i % 2) s += `<circle cx="${f1(q[0] + (r() - 0.5) * w * 2)}" cy="${f1(q[1] - w * (0.6 + r()))}" r="${f1(2 + r() * 3)}" fill="${c.core}" stroke="${INK}" stroke-width="1.2"/>`; }); }
  else if (course === 'toxin') { s += K.drybrush(r, R, w * 0.7, c.dark, { dry: 0.9, body: false, op: 0.85, bristles: 8 }); R.forEach((q, i) => { if (i % 2 === 0) s += K.billow(r, add(q, [0, -w * 0.6]), w * 1.5, w * 0.9, c.fume, { op: 0.6, lw: 3, curls: 2 }); }); }
  else if (course === 'void') { s += K.drybrush(r, R, w * 0.6, c.body, { profile: t => 1 - 0.85 * t, dry: 0.7, body: false, op: 0.9, bristles: 8 }); }
  return s;
}
// ---- where it lands
function impact(r, course, c0, R, o = {}) {
  const c = COL[course], floorY = o.floorY;
  if (!c) return K.impact(r, c0, R, INK, { rays: 7, core: false });
  let s = '';
  if (course === 'fire') { s += tongues(r, add(c0, [0, R * 0.6]), R * 2.0, 3, c) + embers(r, c0, R * 1.4, 22, c) + K.inkSteam(r, add(c0, [0, -R * 0.9]), R * 2.2, c.smoke, { n: 3 }); if (floorY) s += `<g filter="url(#kRag)"><ellipse cx="${f1(c0[0])}" cy="${f1(floorY)}" rx="${f1(R * 1.5)}" ry="${f1(R * 0.28)}" fill="none" stroke="${c.dark}" stroke-width="${f1(R * 0.22)}" opacity="0.85"/></g>`; }
  else if (course === 'frost') { s += hoar(r, c0, R * 1.3, 9, c) + spurs(r, [add(c0, [-R * 0.5, R * 0.2]), add(c0, [0, R * 0.3]), add(c0, [R * 0.5, R * 0.2])], R * 0.9, c); for (let i = 0; i < 30; i++) { const q = add(c0, [(r() - 0.5) * R * 4, (r() - 0.2) * R * 3]); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(1.2 + r() * 2)}" fill="${c.core}" stroke="${INK}" stroke-width="0.5"/>`; } }
  else if (course === 'lightning') { for (let k = 0; k < 5; k++) { const a = -2.4 + k * 0.8 + (r() - 0.5) * 0.4; s += bolt(r, jag(r, c0, add(c0, [Math.cos(a) * R * 2.0, Math.sin(a) * R * 1.6]), 4, R * 0.3), R * 0.3, c); } if (floorY) s += scar(r, [c0[0], floorY], R * 1.6, c); }
  else if (course === 'water') { s += crest(r, c0, R * 1.8, o.dir || [1, 0], c); if (floorY) s += puddle(r, [c0[0] + R * 0.3, floorY], R * 1.6, c); }
  else if (course === 'toxin') { s += K.billow(r, add(c0, [-R * 0.3, -R * 0.2]), R * 1.1, R * 0.7, c.fume, { op: 0.65, lw: 4 }) + K.billow(r, add(c0, [R * 0.7, -R * 0.6]), R * 0.8, R * 0.5, c.fume, { op: 0.55, lw: 4 }) + mould(r, add(c0, [0, R * 0.5]), R * 1.1, 20, c); }
  else if (course === 'void') { s += hole(r, c0, R * 0.95, c); }
  return `<g data-fx="element-${course}">${s}</g>`;
}
// ---- poured: the stream leaves the mouth as ink and falls as the element, landing as the element
function pour(r, course, mouth, floor, w) {
  const mid = [lerp(mouth, floor, 0.45)[0] + w * 2, lerp(mouth, floor, 0.45)[1]], pts = [mouth, add(mouth, [w * 2.5, w * 1.6]), mid, floor];
  return stroke(r, course, pts, w, { inkPart: 0.3 }) + impact(r, course, add(floor, [0, -w * 2]), w * 5.5, { floorY: floor[1], dir: [1, -0.3] });
}
module.exports = { COL, ELEMENTS, isElement, stroke, impact, pour, hole, crest, hoar, spurs, tongues, bolt, jag, mould };
