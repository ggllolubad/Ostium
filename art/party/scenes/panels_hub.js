// The remaining abbey shop panels in Living Ink (converted 2026-11-24 from grim/panels.js): Guesthouse, Almonry, Smithy,
// Infirmarium, Cellarium, Scriptorium, Chapter House, plus the small UI sprites the panels use. Each panel keeps grim's
// 1600 x 1000 frame and its layout areas exactly (title, dish, close, body, line and the panel's own areas), written to
// <name>_layout.json; where the game sets sprites into the art, the receptacles are drawn empty and listed as slots (the
// Smithy's six rune sockets; the Scriptorium's ribbon tabs), as the Sacristy does for the Teeth.
// Rulings kept (see SCENE_NOTES.md, "Rulings audit"): gold only on holy things (the charter's illumination and seals' gilt;
// everything else that grim gilded is bronze, iron, ochre paint or orpiment yellow); red only for blood, doom and rubric;
// no lightning drawn (the Smithy's sparks are forge sparks off the horn, short and low); no eye motifs.
// Lore kept: the Guesthouse panel's guest book is far older than the abbey (gatherings sewn in over centuries, brown at the
// foot, paler above, the oldest leaf brown, a newer slip tucked in) with the heavy hand-forged key laid by it; Fenn's oldest
// ledger, its fore-edge stained sulphur yellow, lies closed under his balance; Lucan's stopped watch lies by the Codex.
// Usage: node scenes/panels_hub.js [outDir]   (default out/scenes/hub/panels)
'use strict';
const fs = require('fs');
const path = require('path');
const PK = require('./panel_kit');
const PR = require('./props_li');
const { E, KK, W, H, X, Y, PW, PH, INK, GOLD, GOLDL, BRASS, IRON, T, fig, rect, oak, shell, frame, plate, dish, knocker, wrap, common } = PK;
const { ell, mix, lerp, add } = E;
const OUT = process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'panels');
fs.mkdirSync(OUT, { recursive: true });
const BRONZE = '#7a5a32', BRONZEL = '#a8824a', LEAD = '#74777b', RUB = '#8a1a14', OCHRE = '#a8843a', LAPIS = '#2a3a6a', ORP = '#c8a83a', PARCH = '#e0d0aa';
const rr = (f, a, b) => a + f.r() * (b - a);
// materials v2 (2026-11-24): the panel walls' stones weather like the rooms' (abbey_in preset), through a stand-in room
// camera only used for its scale (a panel stone ~ a stone 3 m away)
const MVP = require('./materials_v2')(require('./lik')({ W, H, HZ: 430, E: 1.6, FL: 900, CX: 800, seed: 3 }));
const weather = (f, pts, tone) => f.raw(MVP.stoneMarks(pts.map(p => [p[0], p[1]]), 4.5, tone, { wx: { world: 'abbey_in', salt: 0.08, decay: 0.8 } }));
const glowDef = (id, col, op) => `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="0.5" stop-color="${col}" stop-opacity="${op * 0.4}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs>`;
let gid = 0;
// a painted glow (UI art may paint its own light, as the Teeth sprites do)
const glowAt = (f, x, y, rx, ry, col = '#ffc870', op = 0.3) => { const id = 'pg' + (gid++); f.raw(glowDef(id, col, op) + `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`); };

// ------------------------------------------------------------------ shared objects
// a vellum page: base, foxing, grain, stains; o.rule [first, step], o.margin, o.age (0 new .. 1 brown)
function vellum(f, pts, bb, o = {}) {
  const base = mix(o.base || PARCH, '#8a6a3a', o.age || 0);
  f.part(pts, { fill: base, shadow: mix(base, '#6a4a2a', 0.35), light: mix(base, '#fff8e8', 0.3), shade: 0.15, inkW: 2, inkHeavy: 2.6, cast: false, hatch: false, tex: T(f, 'weave'), texOp: 0.06 });
  const [x, y, w, h] = bb;
  for (let k = 0; k < (o.fox ?? 18); k++) f.flat(ell([x + f.r() * w, y + f.r() * h], rr(f, 0.8, 3), rr(f, 0.8, 2.6), 0, 6), '#8a5a2a', { op: rr(f, 0.08, 0.25) });
  for (let k = 0; k < 3; k++) f.flat(ell([x + f.r() * w, y + f.r() * h], rr(f, 30, 80), rr(f, 20, 50), f.r(), 14), '#8a6a3a', { op: 0.06 });
  if (o.rule) for (let ly = y + o.rule[0]; ly < y + h - 20; ly += o.rule[1]) f.line([[x + 24, ly], [x + w - 24, ly + (f.r() - 0.5)]], 0.7, '#8a6a4a', { op: 0.35, straight: true });
  if (o.margin) for (const dx of [0, 5]) f.line([[x + o.margin + dx, y + 18], [x + o.margin + dx, y + h - 18]], 1, '#9a3a2a', { op: 0.55, straight: true });
}
// an open book: boards with corner pieces, the page block's strata under each page, two curved pages, the gutter
function book(f, x, y, w, h, leather, o = {}) {
  const gx = x + w / 2;
  f.part([[x - 22, y - 14, 1], [x + w + 22, y - 14, 1], [x + w + 26, y + h + 26, 1], [x - 26, y + h + 26, 1]], { fill: leather, light: mix(leather, '#c8a878', 0.25), shade: 0.35, inkW: 3, cast: false, tex: T(f, 'mottle'), texOp: 0.55 });
  for (let k = 0; k < 50; k++) { const sx = x - 20 + f.r() * (w + 40), sy = y - 10 + f.r() * (h + 30); f.line([[sx, sy], [sx + rr(f, -20, 20), sy + rr(f, -6, 6)]], 1, mix(leather, '#000', 0.45), { op: 0.45 }); }
  for (const [cx, cy] of [[x - 22, y - 14], [x + w + 22, y - 14], [x - 26, y + h + 26], [x + w + 26, y + h + 26]]) { f.part([[cx - 26, cy, 1], [cx, cy - 26, 1], [cx + 26, cy, 1], [cx, cy + 26, 1]], { fill: o.corner || IRON, light: mix(o.corner || IRON, '#d8d0c0', 0.35), shade: 0.35, inkW: 1.6, cast: false }); f.rivet([cx, cy], 3.4, '#8a8680'); }
  // the page block: strata of leaves, under each page; o.ages: colours of the gatherings from the foot up (old book)
  for (let k = 5; k >= 1; k--) {
    const col = o.ages ? o.ages[Math.min(o.ages.length - 1, 5 - k)] : mix('#c8b890', '#6a5a40', k / 7);
    f.part([[x - k * 2, y + k * 3, 1], [x + w * 0.25, y - 8 + k * 3], [gx, y + 10 + k * 3, 1], [gx, y + h + 8 + k * 2, 1], [x + w * 0.25, y + h + k * 3], [x - k * 2, y + h + k * 4, 1]], { fill: col, shade: 0.2, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
    f.part([[x + w + k * 2, y + k * 3, 1], [x + w * 0.75, y - 8 + k * 3], [gx, y + 10 + k * 3, 1], [gx, y + h + 8 + k * 2, 1], [x + w * 0.75, y + h + k * 3], [x + w + k * 2, y + h + k * 4, 1]], { fill: col, shade: 0.2, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false });
  }
  const q = (p0, c, p1) => { const o = []; for (let i = 0; i <= 12; i++) { const t = i / 12; o.push([(1 - t) * (1 - t) * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p1[0], (1 - t) * (1 - t) * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p1[1]]); } return o; };
  const sharp = a => { a[0] = [a[0][0], a[0][1], 1]; a[a.length - 1] = [a[a.length - 1][0], a[a.length - 1][1], 1]; return a; };
  const L = [...sharp(q([x, y], [x + w * 0.25, y - 12], [gx, y + 8])), ...sharp(q([gx, y + h + 6], [x + w * 0.25, y + h - 6], [x, y + h]))];
  const Rp = [...sharp(q([x + w, y], [x + w * 0.75, y - 12], [gx, y + 8])), ...sharp(q([gx, y + h + 6], [x + w * 0.75, y + h - 6], [x + w, y + h]))];
  vellum(f, L, [x, y, w / 2, h], { rule: o.rule, margin: o.margin, fox: 20, age: o.ageL || 0, base: o.page });
  vellum(f, Rp, [gx, y, w / 2, h], { rule: o.rule, margin: o.margin, fox: 20, age: o.ageR || 0, base: o.page });
  // the gutter: the pages curving down into it, in shadow (a stepped band, never a gradient)
  for (const [d, op] of [[60, 0.12], [34, 0.16], [16, 0.22]]) { f.flat([[gx - d, y + 6], [gx, y + 10], [gx, y + h + 6], [gx - d, y + h + 2]], '#2a1608', { op }); f.flat([[gx + d, y + 6], [gx, y + 10], [gx, y + h + 6], [gx + d, y + h + 2]], '#2a1608', { op: op * 0.9 }); }
  f.line([[gx, y + 8], [gx, y + h + 6]], 2.4, INK, { straight: true });
  for (const [dx, col] of o.ribbons || []) f.part([[gx + dx, y + h - 40, 1], [gx + dx + 4, y + h + 70], [gx + dx + 13, y + h + 58], [gx + dx + 22, y + h + 72], [gx + dx + 18, y + h - 40, 1]], { fill: col, shade: 0.35, inkW: 1.4, cast: false, tex: T(f, 'weave'), texOp: 0.4 });
}
// a painted border round a page area: rubric rule, a second rule in o.col2, a vine of small leaves and berries
function border(f, x, y, w, h, col = RUB, col2 = OCHRE) {
  f.line([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], 2, col, { op: 0.75, straight: true });
  f.line([[x + 6, y + 6], [x + w - 6, y + 6], [x + w - 6, y + h - 6], [x + 6, y + h - 6], [x + 6, y + 6]], 1.2, col2, { op: 0.7, straight: true });
  for (let t = 0; t < 1; t += 0.06) { const vx = x + 3, vy = y + 20 + t * (h - 40); f.line([[vx, vy], [vx + 10, vy + 6], [vx + 4, vy + 14]], 1, col2, { op: 0.7 }); f.flat(ell([vx + 6, vy + 6], 1.8, 1.8, 0, 6), col, { op: 0.8 }); }
}
function candle(f, x, y, h = 70) {
  glowAt(f, x, y - h, h * 1.4, h * 1.2, '#ffc870', 0.32);
  f.part(ell([x, y], 22, 6, 0, 14), { fill: IRON, light: '#6e6e70', shade: 0.35, inkW: 1.2, cast: false });
  KK.candle(f, [x, y - 4], h, 9, { drips: 3, fs: 12 });
}
function quill(f, x, y, ang = -30) {
  f.raw(`<g transform="rotate(${ang} ${x} ${y})">`);
  f.part([[x, y], [x + 60, y - 14], [x + 150, y - 4], [x + 70, y + 8]], { fill: '#d8d0c0', light: '#f4f0e8', shade: 0.25, inkW: 1.4, cast: false, hatch: false });
  for (let k = 0; k < 14; k++) f.line([[x + 20 + k * 9, y - 1], [x + 26 + k * 9, y - 9 + k * 0.3]], 0.8, '#8a8478');
  f.line([[x - 30, y + 2], [x + 10, y]], 3, INK); f.line([[x - 30, y + 2], [x - 12, y + 1.5]], 1.2, '#2a2a3a');
  f.raw('</g>');
}
function inkpot(f, x, y) {
  f.flat(ell([x, y], 30, 10, 0, 14), '#0a0806', { op: 0.5 });
  f.part([[x - 24, y], [x - 28, y - 30], [x - 12, y - 38], [x + 12, y - 38], [x + 28, y - 30], [x + 24, y]], { fill: '#1a1614', light: '#4a4440', shade: 0.4, inkW: 1.6, cast: false });
  f.part(ell([x, y - 38], 12, 4, 0, 12), { fill: '#0a0806', shade: 0.2, inkW: 1, cast: false, hatch: false });
  f.line([[x - 16, y - 30], [x - 18, y - 14], [x - 12, y - 6]], 2, '#6a6460', { op: 0.6 });
}
// uneven ashlar for the panel walls: courses of mixed height, stones of mixed length, pinning slips over low stones
function wall(f, x, y, w, h, toneAt, o = {}) {
  f.part(rect(x, y, w, h), { fill: '#141210', shade: 0.1, inkW: 0, cast: false, hatch: false });
  const plan = o.plan || [64, 40, 78, 30, 58, 70, 36, 52];
  let by = y, row = 0;
  while (by < y + h) {
    const ch = plan[row % plan.length] * (0.9 + f.r() * 0.2); let bx = x - f.r() * 120;
    while (bx < x + w) {
      const bw = (ch < 40 ? rr(f, 50, 140) : rr(f, 70, 260)) * (0.6 + f.r() * 0.7), x0 = Math.max(x, bx + 3), x1 = Math.min(x + w, bx + bw - 3), t = (by - y) / h;
      if (x1 - x0 > 8) {
        const split = ch > 46 && f.r() < 0.5, hs = split ? ch * rr(f, 0.55, 0.8) : ch;
        const one = (yy, hh, slip) => { const tone = mix(toneAt(t, f.r()), slip ? '#5a5a50' : '#000', slip ? 0.2 : 0); const sp = [[x0 + (f.r() - 0.5) * 4, yy + 3 + (f.r() - 0.5) * 5], [x1 + (f.r() - 0.5) * 4, yy + 3 + (f.r() - 0.5) * 6], [x1 + (f.r() - 0.5) * 4, yy + hh - 3 + (f.r() - 0.5) * 4], [x0 + (f.r() - 0.5) * 4, yy + hh - 3 + (f.r() - 0.5) * 5]]; f.part(sp.map(p => [p[0], p[1], 1]), { fill: tone, light: mix(tone, '#e8d8c0', 0.2), shade: 0.4, inkW: 1.6, inkHeavy: 2.2, cast: false, tex: T(f, 'mottle'), texOp: 0.5 }); weather(f, sp, tone); if (o.lit) f.line([[x0 + 5, yy + hh - 4], [x1 - 7, yy + hh - 4]], 1.4, o.lit, { op: 0.08 + t * 0.35, straight: true }); if (f.r() < 0.2) f.flat(ell([x0 + (x1 - x0) * rr(f, 0.2, 0.8), yy + hh * 0.5], (x1 - x0) * 0.12, hh * 0.22, 0, 10), '#0a0806', { op: 0.35 }); };
        one(by, hs, false);
        if (split) { let sx = x0; while (sx < x1 - 8) { const sw = Math.min(x1 - sx, rr(f, 30, 90)); const keep = [x0, x1]; f.part([[sx, by + hs], [sx + sw - 3, by + hs], [sx + sw - 3, by + ch - 3], [sx, by + ch - 3]].map(p => [p[0], p[1], 1]), { fill: mix(toneAt(t, f.r()), '#5a5a50', 0.2), shade: 0.35, inkW: 1.2, cast: false, hatch: false, tex: T(f, 'mottle'), texOp: 0.4 }); sx += sw; void keep; } }
      }
      bx += bw;
    }
    by += ch; row++;
  }
}
const writePanel = (name, seed, draw, extra = {}) => {
  const f = fig(seed); shell(f);
  f.raw(`<clipPath id="bodyclip${seed}"><rect x="${X}" y="${Y}" width="${PW}" height="${PH}"/></clipPath><g clip-path="url(#bodyclip${seed})">`);
  const more = draw(f) || {};
  f.raw('</g>');
  frame(f); plate(f, 800, 66); dish(f, 1404, 70); knocker(f, 1532, 50);
  fs.writeFileSync(path.join(OUT, name + '.svg'), wrap(f, W, H));
  const layout = Object.assign(common(), extra, more);
  fs.writeFileSync(path.join(OUT, name + '_layout.json'), JSON.stringify({ [name]: layout }, null, 1));
  console.log('panel', name);
};

// ================================================================== Guesthouse: the guest book, far older than the abbey's books, open on the
// Hosteller's table; a candle; the heavy old iron key laid by it; his quill and inkpot
writePanel('guesthouse', 1811, f => {
  oak(f, X, Y, PW, PH, '#3a2618', 90);
  const bx = X + 130, by = Y + 64, bw = PW - 260, bh = PH - 160;
  book(f, bx, by, bw, bh, '#3a2416', { rule: [86, 44], ribbons: [[-60, '#6a1a14'], [30, '#2a3a5a']], ages: ['#5a4228', '#6e5634', '#8a7448', '#a8946a', '#c8b890'], ageL: 0.45, ageR: 0.04 });
  border(f, X + 170, Y + 88, bw / 2 - 70, bh - 50, RUB, '#3a3028');
  // the slip of newer paper tucked in at the gutter, standing proud of the old leaf
  f.part([[X + 130 + bw / 2 - 40, Y + 40, 1], [X + 130 + bw / 2 + 30, Y + 44, 1], [X + 130 + bw / 2 + 26, Y + 130, 1], [X + 130 + bw / 2 - 36, Y + 126, 1]], { fill: '#ece2c8', shade: 0.2, inkW: 1.4, cast: false, hatch: false, tex: T(f, 'mottle'), texOp: 0.2 });
  for (let k = 0; k < 4; k++) f.line([[X + 130 + bw / 2 - 30, Y + 58 + k * 14], [X + 130 + bw / 2 + 16, Y + 60 + k * 14]], 0.9, '#3a3028', { op: 0.6 });
  candle(f, X + 34, Y + PH - 30, 90);
  inkpot(f, X + PW - 50, Y + PH - 24); quill(f, X + PW - 70, Y + PH - 70, -150);
  // the key: a heavy hand-forged iron key, longer than a hand, laid across the board's corner at the right
  f.flat([[X + 50, Y + 400, 1], [X + 72, Y + 400, 1], [X + 76, Y + 660, 1], [X + 54, Y + 660, 1]], '#000', { op: 0.3 });
  PR.oldKey(f, [X + 58, Y + 390], Math.PI / 2 + 0.03, 250, 22);
}, { left: [250, 180, 520, 620], right: [830, 180, 520, 620] });

// ================================================================== Almonry: Fenn's ledger with red-ruled columns, a balance in bronze and lead
// badges stacked; his oldest ledger, closed, its fore-edge stained sulphur yellow, under the balance
writePanel('almonry', 1812, f => {
  oak(f, X, Y, PW, PH, '#2e2016', 70);
  book(f, X + 130, Y + 64, PW - 260, PH - 160, '#4a1a12', { page: '#ddcfa6', rule: [100, 50], margin: 60, ribbons: [[-40, '#5a1a10']] });
  for (const px of [X + 130 + (PW - 260) / 2 - 130, X + PW - 260]) for (const dx of [0, 5]) f.line([[px + dx, Y + 80], [px + dx, Y + PH - 90]], 1, '#9a3a2a', { op: 0.6, straight: true });
  // the old ledger, closed, at the bottom left: boards scuffed to the wood, the page block's edge toward us, sulphur-stained
  const lx = X + 30, ly = Y + PH - 118, lw = 150, lh = 46;
  f.part(rect(lx, ly + lh - 8, lw, 8), { fill: '#3a2618', shade: 0.35, inkW: 1.4, cast: false });
  f.part(rect(lx + 4, ly + 8, lw - 8, lh - 16), { fill: '#cdbf98', shade: 0.2, inkW: 1.2, cast: false, hatch: false });
  for (let i = 1; i < 7; i++) f.line([[lx + 6, ly + 8 + i * (lh - 16) / 7], [lx + lw - 6, ly + 8 + i * (lh - 16) / 7 + (f.r() - 0.5)]], 0.6, '#6a5a3a', { op: 0.5 });
  { const tide = []; for (let i = 0; i <= 14; i++) { const t = i / 14; tide.push([lx + 4 + (lw - 8) * t, ly + lh - 8 - 12 - 5 * Math.sin(t * 9 + 1) - 3 * Math.sin(t * 23)]); }
    f.flat([...tide, [lx + lw - 4, ly + lh - 8], [lx + 4, ly + lh - 8]], '#c8b040', { op: 0.55 }); f.line(tide, 1.2, '#8a7428', { op: 0.85 });
    for (const t of [0.2, 0.45, 0.8]) f.flat([[lx + lw * t, ly + lh - 13], [lx + lw * t + 3, ly + lh - 16], [lx + lw * t + 6, ly + lh - 13], [lx + lw * t + 3, ly + lh - 11]], '#e8d468'); }
  f.part(rect(lx - 3, ly, lw + 6, 9), { fill: '#4a3020', shade: 0.3, inkW: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
  for (const cx of [lx + 4, lx + lw - 4]) f.flat(ell([cx, ly + 4], 6, 3, 0, 8), '#7a5a3a', { op: 0.8 });
  // the balance in bronze, standing on the old ledger
  const sx = X + 96, sy = ly;
  f.line([[sx, sy], [sx, sy - 150]], 6, INK); f.line([[sx, sy], [sx, sy - 150]], 3.6, BRONZE);
  f.line([[sx - 50, sy - 140], [sx + 50, sy - 150]], 5, INK); f.line([[sx - 50, sy - 140], [sx + 50, sy - 150]], 3, BRONZEL);
  f.part(ell([sx, sy - 150], 6, 6, 0, 10), { fill: BRONZEL, shade: 0.3, inkW: 1.2, cast: false });
  for (const [dx, dy] of [[-50, -140], [50, -150]]) { f.line([[sx + dx, sy + dy], [sx + dx - 18, sy + dy + 46]], 1.2, '#5a5650'); f.line([[sx + dx, sy + dy], [sx + dx + 18, sy + dy + 46]], 1.2, '#5a5650'); f.part([[sx + dx - 24, sy + dy + 46], [sx + dx + 24, sy + dy + 46], [sx + dx + 14, sy + dy + 58], [sx + dx - 14, sy + dy + 58]], { fill: BRONZE, light: BRONZEL, shade: 0.4, inkW: 1.4, cast: false }); f.flat(ell([sx + dx + 8, sy + dy + 54], 4, 2, 0, 6), '#4f6a4a', { op: 0.6 }); }
  // the stack of lead badges at the right edge
  for (let k = 0; k < 7; k++) { const cx = X + PW - 40 + (f.r() - 0.5) * 3, cy = Y + PH - 26 - k * 5; f.part(ell([cx, cy], 20, 6, 0, 14), { fill: mix(LEAD, '#4a4c50', f.r()), shade: 0.3, inkW: 1, cast: false, hatch: false }); }
}, { left: [250, 180, 520, 620], right: [830, 180, 520, 620] });

// ================================================================== Smithy: Hild's forge wall lit from below; a leather tool roll for the company;
// the anvil on its stump; a slate rune tablet with six empty sockets (the runes are sprites: rune_slots); the armoury rack
writePanel('smithy', 1813, f => {
  wall(f, X, Y, PW, PH, (t, r) => mix('#2a2622', '#4a3a2e', t * 0.8 + r * 0.2), { lit: '#c87a3a' });
  glowAt(f, X + PW / 2, Y - 20, 520, 300, '#000', 0.55);
  glowAt(f, X + PW / 2, Y + PH + 60, 700, 460, '#ff7a2a', 0.32);
  glowAt(f, X + PW / 2, Y + PH - 80, 320, 220, '#ffb060', 0.16);
  // left: the tool roll hung from two iron hooks, one pocket row per hero
  const lx = X + 40, ly = Y + 40, lw = 380, lh = PH - 80;
  f.part([[lx, ly + 20, 1], [lx + lw / 2, ly + 6], [lx + lw, ly + 20, 1], [lx + lw + 6, ly + lh - 30, 1], [lx + lw / 2, ly + lh + 4], [lx - 6, ly + lh - 30, 1]], { fill: '#5a3a20', light: '#8a6038', shadow: '#2a180c', shade: 0.4, inkW: 3, tex: T(f, 'mottle'), texOp: 0.6 });
  f.stitches([[lx + 14, ly + 30], [lx + lw / 2, ly + 14], [lx + lw - 14, ly + 30], [lx + lw - 10, ly + lh - 40], [lx + lw / 2, ly + lh - 6], [lx + 10, ly + lh - 40], [lx + 14, ly + 30]], '#c8a070', 2);
  for (const hx of [lx + 60, lx + lw - 60]) { f.line([[hx, ly - 26], [hx, ly + 6], [hx - 6, ly + 18], [hx - 14, ly + 20]], 9, INK); f.line([[hx, ly - 26], [hx, ly + 6], [hx - 6, ly + 18], [hx - 14, ly + 20]], 5, '#4a4642'); f.rivet([hx, ly - 30], 4.4, '#7a7670'); }
  const rows = [];
  for (let k = 1; k < 4; k++) { const py = ly + k * lh / 4; f.line([[lx + 6, py], [lx + lw / 2, py + 10], [lx + lw - 6, py]], 3, '#1a0c04', { op: 0.7 }); f.line([[lx + 6, py + 3], [lx + lw / 2, py + 13], [lx + lw - 6, py + 3]], 1.2, '#a87a4a', { op: 0.4 }); }
  for (let k = 0; k < 4; k++) rows.push([Math.round(lx + 16), Math.round(ly + 28 + k * lh / 4), lw - 32, Math.round(lh / 4 - 30)]);
  // the pockets: a flap of darker leather across the lower half of each row, stitched into five pockets, a buckle strap at the end
  for (let k = 0; k < 4; k++) { const py0 = ly + 28 + k * lh / 4 + lh / 8, py1 = ly + 20 + (k + 1) * lh / 4 - 8;
    f.part([[lx + 14, py0, 1], [lx + lw - 14, py0, 1], [lx + lw - 12, py1, 1], [lx + 12, py1, 1]], { fill: '#4a2e18', light: '#6a4a2a', shade: 0.35, inkW: 1.6, cast: false, tex: T(f, 'mottle'), texOp: 0.5 });
    for (let j = 1; j < 5; j++) f.stitches([[lx + 14 + j * (lw - 28) / 5, py0 + 2], [lx + 14 + j * (lw - 28) / 5, py1 - 2]], '#c8a070', 1.4);
    f.part([[lx + lw - 30, py0 - 10, 1], [lx + lw - 6, py0 - 10, 1], [lx + lw - 6, py0 + 14, 1], [lx + lw - 30, py0 + 14, 1]], { fill: '#2e2c2a', shade: 0.3, inkW: 1.2, cast: false }); }
  for (let k = 0; k < 18; k++) { const sx = lx + 30 + f.r() * (lw - 60), sy = ly + 40 + f.r() * (lh - 80); f.line([[sx, sy], [sx + rr(f, -14, 14), sy + rr(f, -4, 4)]], 1, '#d8b088', { op: 0.25 }); }
  // centre: the anvil on its elm stump, horn to the right; a hammer and tongs leaned on the stump; forge sparks off the horn
  const ax = X + PW / 2 + 10, ay = Y + PH - 210;
  f.flat(ell([ax, ay + 200], 260, 40, 0, 20), '#000', { op: 0.45 });
  f.part([[ax - 150, ay + 70], [ax - 160, ay + 200], [ax, ay + 228, 1], [ax + 160, ay + 200], [ax + 150, ay + 70]], { fill: '#4a301a', light: '#7a5a3a', shadow: '#1a0e06', shade: 0.45, inkW: 3, tex: T(f, 'wood'), texOp: 0.6 });
  for (let k = 0; k < 14; k++) { const sx = ax - 140 + k * 21; f.line([[sx, ay + 80], [sx + rr(f, -6, 6), ay + 140], [sx + rr(f, -4, 4), ay + rr(f, 180, 205)]], rr(f, 1, 2.4), '#140a04', { op: 0.7 }); }
  f.part(ell([ax, ay + 70], 150, 28, 0, 24), { fill: '#7a5a3a', light: '#a88058', shade: 0.3, inkW: 2.4, cast: false });
  for (const t of [0.3, 0.55, 0.8]) f.line(ell([ax, ay + 70], 150 * t, 28 * t, 0, 20).concat([ell([ax, ay + 70], 150 * t, 28 * t, 0, 20)[0]]), 1.2, '#4a3018');
  f.part([[ax - 110, ay + 70, 1], [ax - 80, ay - 10], [ax - 120, ay - 46, 1], [ax + 120, ay - 46, 1], [ax + 80, ay - 10], [ax + 110, ay + 70, 1]], { fill: '#2a2826', light: '#5a5652', shadow: '#0e0c0a', shade: 0.5, inkW: 3, tex: T(f, 'mottle'), texOp: 0.5 });
  f.part([[ax - 230, ay - 110, 1], [ax + 150, ay - 110, 1], [ax + 230, ay - 102], [ax + 270, ay - 72, 1], [ax + 220, ay - 60], [ax + 150, ay - 46, 1], [ax - 230, ay - 46, 1]], { fill: '#4a4642', light: '#9a968e', shadow: '#141210', shade: 0.45, inkW: 3.4, tex: T(f, 'mottle'), texOp: 0.5 });
  f.line([[ax - 226, ay - 104], [ax + 150, ay - 104], [ax + 222, ay - 98], [ax + 260, ay - 72]], 3, '#d8d4cc', { op: 0.6 });
  f.part(rect(ax - 190, ay - 106, 22, 16), { fill: '#0a0908', shade: 0.1, inkW: 1.2, cast: false, hatch: false }); f.part(ell([ax - 140, ay - 98], 7, 7, 0, 10), { fill: '#0a0908', inkW: 1.2, cast: false, hatch: false });
  glowAt(f, ax + 220, ay - 82, 50, 40, '#ff9a4a', 0.5);
  for (let k = 0; k < 26; k++) { const sx = ax + rr(f, 160, 250), sy = ay - 112 - rr(f, 0, 70), l = rr(f, 4, 12); f.line([[sx, sy], [sx + rr(f, -3, 3), sy - l]], rr(f, 1, 2.4), f.r() < 0.5 ? '#ffd27a' : '#ff8a3a', { op: rr(f, 0.4, 1) }); }
  f.line([[ax - 260, ay + 190], [ax - 150, ay + 60]], 15, INK); f.line([[ax - 260, ay + 190], [ax - 150, ay + 60]], 10, '#5a3a22');
  f.raw(`<g transform="rotate(-50 ${ax - 149} ${ay + 43})">`); f.part(rect(ax - 182, ay + 22, 66, 42), { fill: '#3a3836', light: '#7a7670', shade: 0.45, inkW: 2.4, cast: false }); f.raw('</g>');
  for (const d of [0, 16]) { f.line([[ax + 250 + d, ay + 200 - d * 0.25], [ax + 150 + d, ay + 40 - d * 0.25]], 9, INK); f.line([[ax + 250 + d, ay + 200 - d * 0.25], [ax + 150 + d, ay + 40 - d * 0.25]], 5, '#3e3a36'); }
  // top centre: the slate rune tablet, six sockets rimmed in iron, empty (the game sets each rune sprite in its rune_slot)
  const tx = X + 470, ty = Y + 40, tw = PW - 940, th = 150;
  f.flat(rect(tx + 8, ty + 10, tw, th), '#000', { op: 0.5 });
  f.part(rect(tx, ty, tw, th), { fill: '#2e3436', light: '#4a5458', shadow: '#1a1e20', shade: 0.35, inkW: 3, cast: false, tex: T(f, 'mottle'), texOp: 0.5 });
  for (let k = 0; k < 7; k++) { const yy = ty + 12 + k * (th - 24) / 6 + rr(f, -3, 3); f.line([[tx + 6, yy], [tx + tw * rr(f, 0.3, 0.7), yy + rr(f, -4, 4)], [tx + tw - 6, yy + rr(f, -2, 2)]], 1, '#0e1012', { op: 0.35 }); }
  for (let k = 0; k < 60; k++) { const cx = tx + 10 + f.r() * (tw - 20), cy = ty + 8 + f.r() * (th - 16); f.line([[cx, cy], [cx + rr(f, 2, 6), cy + rr(f, -2, 2)]], 0.8, '#a8b4b8', { op: rr(f, 0.1, 0.3) }); }
  for (const bx of [tx - 14, tx + tw - 10]) { f.part(rect(bx, ty + 14, 24, th - 28), { fill: IRON, light: '#6e6e70', shade: 0.35, inkW: 1.6, cast: false }); f.rivet([bx + 12, ty + 26], 3.4, '#7a7670'); f.rivet([bx + 12, ty + th - 26], 3.4, '#7a7670'); }
  const runeSlots = [];
  for (let k = 0; k < 6; k++) { const cx = tx + 44 + k * (tw - 88) / 5, cy = ty + th / 2;
    f.part(ell([cx, cy], 38, 38, 0, 24), { fill: '#3a3a3c', light: '#7a7a7c', shade: 0.35, inkW: 1.6, cast: false });
    f.part(ell([cx, cy], 31, 31, 0, 22), { fill: '#121416', shade: 0.15, inkW: 1.4, cast: false, hatch: false });
    f.line(ell([cx, cy], 28, 28, 0, 22).slice(13, 21), 2.6, '#000', { op: 0.6 });
    runeSlots.push({ index: k, rect: [Math.round(cx - 31), Math.round(cy - 31), 62, 62] }); }
  // right: the armoury rack, two posts and four crossbars of iron hooks
  const rx = X + PW - 440, ry = Y + 40, rw = 400, rh = PH - 80;
  for (const px of [rx + 10, rx + rw - 40]) f.part(rect(px, ry, 30, rh), { fill: '#3a2616', light: '#5a3e26', shade: 0.4, inkW: 2.4, cast: false, tex: T(f, 'wood'), texOp: 0.6 });
  for (let k = 0; k < 4; k++) { const by = ry + 40 + k * (rh - 80) / 3; f.part(rect(rx, by - 12, rw, 24), { fill: '#4a3220', light: '#6a4a30', shade: 0.35, inkW: 2, cast: false, tex: T(f, 'wood'), texOp: 0.6 }); f.rivet([rx + 25, by], 4, '#7a7670'); f.rivet([rx + rw - 25, by], 4, '#7a7670');
    for (let j = 0; j < 4; j++) { const hx = rx + 70 + j * (rw - 140) / 3; f.line([[hx, by + 12], [hx, by + 30], [hx + 4, by + 38], [hx + 10, by + 38]], 6, INK); f.line([[hx, by + 12], [hx, by + 30], [hx + 4, by + 38], [hx + 10, by + 38]], 3, '#5a5650'); } }
  return { rune_slots: runeSlots, hero_rows: rows };
}, { heroes: [130, 170, 360, 740], rack: [1100, 150, 400, 760], tray: [550, 136, 500, 150], anvil: [560, 330, 480, 330] });

// ================================================================== Infirmarium: Wenna's remedies on the stone wall, her table under stained
// linen, the patient chart pinned to it, a bone saw and a lancet, a basin of leeches, a roll of bandage
writePanel('infirmarium', 1814, f => {
  wall(f, X, Y, PW, 262, (t, r) => mix('#3e3a34', '#5a544a', r), { plan: [52, 34, 60, 44, 28, 56] });
  glowAt(f, X + 200, Y + 40, 420, 260, '#e8e4dc', 0.16);
  const sy = Y + 214;
  oak(f, X + 30, sy, PW - 60, 26, '#4a3220', 26);
  for (const bx of [X + 120, X + PW - 120]) f.part([[bx, sy + 26], [bx, sy + 76], [bx - 36, sy + 26]], { fill: IRON, shade: 0.35, inkW: 2, cast: false });
  // herbs drying from a cord along the top of the wall
  f.line([[X + 20, Y + 26], [X + PW / 2, Y + 46], [X + PW - 20, Y + 26]], 2, '#8a7a5a');
  for (let k = 0; k < 16; k++) { const hx = X + 70 + k * (PW - 140) / 15 + rr(f, -10, 10), hy = Y + 30 + 20 * Math.sin(Math.PI * (hx - X) / PW), hl = rr(f, 40, 70), col = ['#5a6a3a', '#7a6a3a', '#4a5a3a', '#6a4a3a'][Math.floor(f.r() * 4)];
    f.line([[hx, hy], [hx, hy + 8]], 3, '#c8b890');
    for (let j = 0; j < 7; j++) { const a = rr(f, -0.35, 0.35); f.line([[hx, hy + 6], [hx + Math.sin(a) * hl * 0.6, hy + 6 + hl * 0.5], [hx + Math.sin(a) * hl, hy + hl]], 2.2, mix(col, '#c8b890', f.r() * 0.3)); f.flat(ell([hx + Math.sin(a) * hl * 0.8, hy + hl * 0.8], 4, 2, 1.2 + a, 6), col); } }
  // the jars: glass with the level showing, stoppers of cork or tied cloth, labels in her hand, dust on the shoulders
  let jn = 0;
  for (let jx = X + 70; jx < X + PW - 70; jn++) {
    const jh = rr(f, 80, 150), jw = rr(f, 26, 46), col = ['#3a5a3a', '#6a2a1a', '#9a7a2a', '#2a3a5a', '#5a4a2a', '#5a4a6a', '#7a6a52', '#2a4a4a'][Math.floor(f.r() * 8)], kind = f.r();
    if (jn % 5 === 3) { f.part([[jx - 34, sy - 50], [jx - 30, sy - 14], [jx, sy, 1], [jx + 30, sy - 14], [jx + 34, sy - 50]], { fill: '#4a4844', light: '#7a7670', shade: 0.45, inkW: 2, cast: false, tex: T(f, 'mottle'), texOp: 0.5 }); f.part(ell([jx, sy - 50], 34, 8, 0, 16), { fill: '#2a2622', shade: 0.2, inkW: 1.6, cast: false, hatch: false }); f.line([[jx - 6, sy - 52], [jx + 30, sy - 104]], 12, INK); f.line([[jx - 6, sy - 52], [jx + 30, sy - 104]], 8, '#8a8478'); jx += 90; continue; }
    const body = kind < 0.5 ? [[jx - jw, sy], [jx - jw, sy - jh * 0.75], [jx - jw * 0.9, sy - jh * 0.87], [jx - jw * 0.5, sy - jh * 0.9], [jx + jw * 0.5, sy - jh * 0.9], [jx + jw * 0.9, sy - jh * 0.87], [jx + jw, sy - jh * 0.75], [jx + jw, sy]]
      : [[jx - jw, sy], [jx - jw * 1.15, sy - jh * 0.45], [jx - jw * 0.35, sy - jh * 0.8], [jx - jw * 0.3, sy - jh], [jx + jw * 0.3, sy - jh], [jx + jw * 0.35, sy - jh * 0.8], [jx + jw * 1.15, sy - jh * 0.45], [jx + jw, sy]];
    f.part(body, { fill: mix(col, '#c8d0c8', 0.25), shade: 0.35, inkW: 2, cast: false, hatch: false });
    const lvl = sy - jh * rr(f, 0.3, 0.65);
    f.flat(body.map(p => [p[0], Math.max(p[1], lvl)]), mix(col, '#000', 0.35), { op: 0.9 });
    f.line([[jx - jw * 0.9, lvl], [jx + jw * 0.9, lvl]], 1.4, mix(col, '#fff', 0.3), { op: 0.6 });
    f.line([[jx - jw * 0.62, sy - jh * 0.12], [jx - jw * 0.62, sy - jh * 0.6]], 3.4, '#fff6e0', { op: 0.35 });
    if (kind < 0.5) { if (f.r() < 0.5) f.part(rect(jx - jw * 0.6, sy - jh * 0.98, jw * 1.2, jh * 0.1), { fill: '#8a6a42', shade: 0.3, inkW: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 0.6 }); else { f.part([[jx - jw * 0.72, sy - jh * 0.86], [jx - jw * 0.6, sy - jh * 1.02], [jx, sy - jh * 1.05, 1], [jx + jw * 0.6, sy - jh * 1.02], [jx + jw * 0.72, sy - jh * 0.86]], { fill: '#c8b48a', shade: 0.3, inkW: 1.4, cast: false, tex: T(f, 'weave'), texOp: 0.5 }); f.line([[jx - jw * 0.6, sy - jh * 0.88], [jx + jw * 0.6, sy - jh * 0.88]], 2.4, '#6a3a1a'); } }
    else f.part([[jx - jw * 0.36, sy - jh - 12], [jx + jw * 0.36, sy - jh - 12], [jx + jw * 0.3, sy - jh + 4], [jx - jw * 0.3, sy - jh + 4]], { fill: '#8a6a42', shade: 0.3, inkW: 1.2, cast: false, tex: T(f, 'mottle'), texOp: 0.6 });
    if (f.r() < 0.8) { const lw2 = jw * 1.24, lh2 = jh * 0.24, lx2 = jx - lw2 / 2, ly2 = sy - jh * 0.56; f.part([[lx2, ly2 + 2], [lx2 + lw2, ly2], [lx2 + lw2 - 1, ly2 + lh2], [lx2 + 1, ly2 + lh2 + 1]].map(p => [p[0], p[1], 1]), { fill: '#d8ccac', shade: 0.2, inkW: 0.9, cast: false, hatch: false }); for (let k = 0; k < 3; k++) { const pts = []; for (let q = 0; q <= 5; q++) pts.push([lx2 + 4 + q * (lw2 - 8) / 5, ly2 + 6 + k * lh2 / 3.4 + rr(f, -1.6, 1.6)]); f.line(pts, 0.9, '#3a2416', { op: k ? 0.5 : 0.85 }); } }
    f.line([[jx - jw * 0.9, sy - jh * (kind < 0.5 ? 0.86 : 0.62)], [jx + jw * 0.9, sy - jh * (kind < 0.5 ? 0.86 : 0.62)]], 2.2, '#b8b0a0', { op: 0.22 });
    jx += jw * 2 + rr(f, 10, 40) + (f.r() < 0.15 ? 60 : 0);
  }
  // the table and the linen drawn over it, darker in its folds, old blood soaked in
  const ty = Y + 270;
  oak(f, X, ty - 10, PW, PH - 260, '#3a2818', 80);
  const lin = [[X + 20, ty + 10, 1], [X + PW / 2, ty - 6], [X + PW - 20, ty + 10, 1], [X + PW - 10, Y + PH - 10, 1], [X + 10, Y + PH - 10, 1]];
  f.part(lin, { fill: '#b8ae96', light: '#d8d0bc', shadow: '#7a705a', shade: 0.3, inkW: 2.6, cast: false, tex: T(f, 'weave'), texOp: 0.35 });
  for (let k = 0; k < 9; k++) { const fx = X + 80 + k * (PW - 160) / 8 + rr(f, -30, 30), fw = rr(f, 16, 40); f.line([[fx, ty + 10], [fx + rr(f, -20, 20), ty + PH * 0.3], [fx + rr(f, -14, 14), ty + PH - 290]], fw * 0.4, '#4a4232', { op: 0.16 }); f.line([[fx + fw * 0.35, ty + 10], [fx + fw * 0.35 + rr(f, -20, 20), ty + PH * 0.3], [fx + fw * 0.35 + rr(f, -14, 14), ty + PH - 290]], fw * 0.2, '#f4ecd8', { op: 0.2 }); }
  for (let k = 0; k < 5; k++) f.flat(ell([X + 60 + f.r() * (PW - 120), ty + 60 + f.r() * (PH - 360)], rr(f, 24, 60), rr(f, 14, 36), f.r(), 12), k % 2 ? '#6a1410' : '#7a5a30', { op: 0.22 });
  // the chart, pinned a little crooked: a body drawn in ink, a rubric line
  const cx = X + 580, cy = ty + 20, cw = 540, ch = PH - 330;
  f.raw(`<g transform="rotate(-1.2 ${cx + cw / 2} ${cy + ch / 2})">`);
  f.flat(rect(cx + 8, cy + 12, cw, ch), '#000', { op: 0.35 });
  vellum(f, rect(cx, cy, cw, ch), [cx, cy, cw, ch], { fox: 30, base: '#e2d4b0' });
  f.line([[cx + 24, cy + 64], [cx + cw - 24, cy + 64]], 1.6, '#7a1a14', { op: 0.7, straight: true });
  { const bx = cx + 120, by = cy + 100, s = (ch - 140) / 320, q = (dx, dy) => [bx + dx * s, by + dy * s];
    f.line(ell(q(0, 0), 16 * s, 18 * s, 0, 16).concat([ell(q(0, 0), 16 * s, 18 * s, 0, 16)[0]]), 2.2, '#3a2a1c', { op: 0.75 });
    f.line([q(-8, 16), q(-8, 28), q(-44, 40), q(-60, 130), q(-50, 132), q(-32, 60), q(-30, 150), q(-34, 300), q(-14, 300), q(0, 170), q(14, 300), q(34, 300), q(30, 150), q(32, 60), q(50, 132), q(60, 130), q(44, 40), q(8, 28), q(8, 16)], 2.2, '#3a2a1c', { op: 0.75, straight: true });
    f.line([q(0, 40), q(0, 160)], 1, '#3a2a1c', { op: 0.5, dash: '4 3' });
    f.flat(ell(q(-40, 100), 6, 10, 0, 8), '#7a1a14', { op: 0.5 }); f.flat(ell(q(16, 230), 5, 8, 0, 8), '#7a1a14', { op: 0.5 }); }
  f.raw('</g>');
  for (const [px, py] of [[cx + 16, cy + 14], [cx + cw - 16, cy + 18]]) { f.part(ell([px, py], 8, 8, 0, 12), { fill: IRON, light: '#8a8a8c', shade: 0.35, inkW: 1.4, cast: false }); }
  // the tools laid on the linen right of the chart: the bone saw, the lancet
  const tx = X + PW - 300, tY = Y + PH - 34;
  f.line([[tx, tY], [tx + 200, tY - 46]], 18, INK); f.line([[tx, tY], [tx + 200, tY - 46]], 13, '#9a968e'); f.line([[tx, tY - 4], [tx + 196, tY - 50]], 2, '#e8e4dc', { op: 0.6 });
  for (let k = 0; k < 20; k++) f.line([[tx + 6 + k * 9.5, tY + 6 - k * 2.2], [tx + 8 + k * 9.5, tY + 13 - k * 2.2]], 1.6, INK);
  f.raw(`<g transform="rotate(-13 ${tx + 231} ${tY - 54})">`); f.part(rect(tx + 196, tY - 72, 70, 36), { fill: '#5a3e26', light: '#8a6a48', shade: 0.4, inkW: 2.4, cast: false, tex: T(f, 'wood'), texOp: 0.5 }); f.raw('</g>');
  f.line([[tx + 40, tY - 120], [tx + 210, tY - 150]], 6, INK); f.line([[tx + 40, tY - 120], [tx + 210, tY - 150]], 3, '#c8c4bc'); f.line([[tx + 150, tY - 140], [tx + 210, tY - 150]], 7, '#4a3220');
  // the basin of leeches, the bandage roll with its tail
  const qx = X + 300, qy = Y + PH - 80;
  f.flat(ell([qx, qy + 10], 96, 30, 0, 18), '#000', { op: 0.4 });
  f.part(ell([qx, qy], 90, 30, 0, 22), { fill: '#4a4844', light: '#8a8680', shade: 0.4, inkW: 2.4, cast: false });
  f.part(ell([qx, qy - 6], 72, 19, 0, 20), { fill: '#3a1410', shade: 0.2, inkW: 1.4, cast: false, hatch: false });
  f.flat(ell([qx - 20, qy - 10], 30, 6, 0, 10), '#8a3a2a', { op: 0.35 });
  for (let k = 0; k < 6; k++) { const lx2 = qx - 50 + f.r() * 100, ly2 = qy - 12 + f.r() * 12; f.line([[lx2, ly2], [lx2 + 10, ly2 - 8], [lx2 + 22, ly2 - 2]], 7, '#0a0604'); f.line([[lx2 + 2, ly2 - 2], [lx2 + 10, ly2 - 7], [lx2 + 18, ly2 - 3]], 2, '#4a2a1a'); }
  f.part(ell([X + 140, Y + PH - 70], 44, 44, 0, 22), { fill: '#d8d0bc', light: '#f0e8d8', shade: 0.35, inkW: 2.4, cast: false, tex: T(f, 'weave'), texOp: 0.4 });
  for (const r of [36, 26, 16, 7]) f.line(ell([X + 140, Y + PH - 70], r, r, 0, 18).concat([ell([X + 140, Y + PH - 70], r, r, 0, 18)[0]]), 1.4, '#9a907a');
  f.line([[X + 180, Y + PH - 60], [X + 240, Y + PH - 54], [X + 300, Y + PH - 66]], 18, INK); f.line([[X + 180, Y + PH - 60], [X + 240, Y + PH - 54], [X + 300, Y + PH - 66]], 15, '#d8d0bc');
  f.flat(ell([X + 250, Y + PH - 58], 14, 6, 0, 10), '#7a1410', { op: 0.5 });
}, { patients: [120, 420, 420, 460], chart: [870, 470, 310, 400], services: [1190, 420, 290, 420] });

// ================================================================== Cellarium: the tally board, four lanes of notched sticks and peg holes, what
// each lane counts at its head (bread, candles, tinctures, a pry-bar and iron keys), chalk totals on a slate
writePanel('cellarium', 1815, f => {
  oak(f, X, Y, PW, PH, '#4a3420', 120);
  const lanes = 4, lw = (PW - 380) / lanes;
  for (let k = 0; k < lanes; k++) {
    const lx = X + 40 + k * lw, sx = lx + lw / 2, hy = Y + 170;
    f.part(rect(lx + 10, Y + 40, lw - 20, PH - 80), { fill: '#1e140c', shade: 0.15, inkW: 2.6, cast: false, hatch: false });
    oak(f, lx + 18, Y + 48, lw - 36, PH - 96, mix('#3a2818', '#2a1c10', f.r()), 40);
    for (const [d, op] of [[0, 0.2], [14, 0.14]]) f.flat(rect(lx + 18, Y + 48 + d, lw - 36, 24), '#000', { op });
    // the hazel tally stick hung from its iron ring, split, notched down its length
    f.part(ell([sx, Y + 196], 9, 9, 0, 12), { fill: IRON, light: '#6e6e70', shade: 0.35, inkW: 1.6, cast: false }); f.line([[sx, Y + 204], [sx, Y + 230]], 2, '#8a7a5a');
    f.part(rect(sx - 14, Y + 230, 28, PH - 360), { fill: '#b89868', light: '#e8d0a0', shade: 0.4, inkW: 2, cast: false, tex: T(f, 'wood'), texOp: 0.5 });
    for (let n = 0; n < 16; n++) f.line([[sx - 14, Y + 250 + n * ((PH - 400) / 16)], [sx - 14 + rr(f, 8, 18), Y + 250 + n * ((PH - 400) / 16) + rr(f, -3, 3)]], 2, INK);
    for (let n = 0; n < 8; n++) for (const dx of [-lw * 0.32, lw * 0.32]) { f.part(ell([sx + dx, Y + 250 + n * ((PH - 400) / 8)], 7, 7, 0, 10), { fill: '#0a0604', shade: 0.1, inkW: 1.2, cast: false, hatch: false }); f.line(ell([sx + dx, Y + 250 + n * ((PH - 400) / 8)], 7, 7, 0, 10).slice(5, 9), 1, '#8a6a48', { op: 0.6 }); }
    glowAt(f, sx, hy - 50, 90, 70, '#ffd8a0', 0.08);
    if (k === 0) for (const [dx, dy, ww] of [[-40, 0, 44], [26, 4, 52], [-6, -30, 48]]) { f.part([[sx + dx - ww, hy + dy], [sx + dx - ww, hy + dy - 30], [sx + dx - ww * 0.6, hy + dy - 46], [sx + dx, hy + dy - 50, 1], [sx + dx + ww * 0.6, hy + dy - 46], [sx + dx + ww, hy + dy - 30], [sx + dx + ww, hy + dy]], { fill: '#9a6a3a', light: '#c89a5a', shadow: '#5a3416', shade: 0.45, inkW: 2.4, cast: false, tex: T(f, 'mottle'), texOp: 0.5 }); for (const t of [-0.5, 0, 0.45]) f.line([[sx + dx + ww * t, hy + dy - 36], [sx + dx + ww * t + ww * 0.25, hy + dy - 22]], 2, '#4a2a10'); }
    if (k === 1) { for (let c = 0; c < 7; c++) { const cx2 = sx - 54 + c * 18, ch2 = 70 + (c % 3) * 14; f.part([[cx2 - 7, hy], [cx2 + 7, hy], [cx2 + 7, hy - ch2], [cx2, hy - ch2 - 3], [cx2 - 7, hy - ch2]], { fill: KK.P.wax, shadow: KK.P.waxD, shade: 0.35, inkW: 1.4, cast: false, hatch: false }); f.line([[cx2, hy - ch2 - 3], [cx2 + 1, hy - ch2 - 9]], 1.4, INK); } f.line([[sx - 64, hy - 34], [sx, hy - 26], [sx + 64, hy - 34]], 4, KK.P.rope); }
    if (k === 2) for (const [dx, col, hh] of [[-36, '#2a4a3a', 80], [10, '#6a2a1a', 104], [50, '#5a4a6a', 70]]) { f.part([[sx + dx - 18, hy], [sx + dx - 26, hy - hh * 0.5], [sx + dx - 8, hy - hh * 0.75], [sx + dx - 6, hy - hh], [sx + dx + 6, hy - hh], [sx + dx + 8, hy - hh * 0.75], [sx + dx + 26, hy - hh * 0.5], [sx + dx + 18, hy]], { fill: col, light: mix(col, '#fff', 0.35), shade: 0.4, inkW: 2, cast: false }); f.line([[sx + dx - 10, hy - 10], [sx + dx - 10, hy - 10 - hh * 0.4]], 2.4, '#fff6e0', { op: 0.4 }); f.part(rect(sx + dx - 8, hy - hh - 10, 16, 11), { fill: '#6a4a2a', shade: 0.3, inkW: 1.2, cast: false }); }
    if (k === 3) { f.line([[sx - 60, hy - 10], [sx + 50, hy - 80], [sx + 62, hy - 84], [sx + 60, hy - 70]], 12, INK); f.line([[sx - 60, hy - 10], [sx + 50, hy - 80], [sx + 62, hy - 84], [sx + 60, hy - 70]], 8, '#4a4642'); for (const [dx, dy] of [[-30, -60], [-10, -70], [10, -62]]) { const r = ell([sx + dx, hy + dy], 10, 10, 0, 14); f.line(r.concat([r[0]]), 5, INK); f.line(r.concat([r[0]]), 3, '#5a5652'); f.line([[sx + dx, hy + dy + 10], [sx + dx, hy + dy + 40], [sx + dx + 8, hy + dy + 40]], 5.4, INK); f.line([[sx + dx, hy + dy + 10], [sx + dx, hy + dy + 40], [sx + dx + 8, hy + dy + 40]], 3.4, '#5a5652'); f.line([[sx + dx, hy + dy + 32], [sx + dx + 6, hy + dy + 32]], 3.4, '#5a5652'); } }
  }
  // the slate on the right with old tallies half wiped off
  const sx = X + PW - 320, sy = Y + 60;
  f.part(rect(sx, sy, 280, PH - 120), { fill: '#5a4430', light: '#7a5e44', shade: 0.35, inkW: 3, cast: false, tex: T(f, 'wood'), texOp: 0.5 });
  f.part(rect(sx + 16, sy + 16, 248, PH - 152), { fill: '#24282a', light: '#343a3c', shade: 0.25, inkW: 2, cast: false, hatch: false, tex: T(f, 'mottle'), texOp: 0.5 });
  for (let k = 0; k < 5; k++) f.flat(ell([sx + 30 + f.r() * 220, sy + 40 + f.r() * (PH - 220)], rr(f, 40, 90), rr(f, 20, 50), f.r(), 12), '#a8aaa4', { op: 0.04 });
  for (let r = 0; r < 7; r++) for (let g = 0; g < 4; g++) { if (f.r() < 0.25) continue; const gx = sx + 40 + g * 56, gy = sy + PH * 0.5 + r * 46, op = rr(f, 0.08, 0.22); for (let q = 0; q < 4; q++) f.line([[gx + q * 9, gy], [gx + q * 9 + rr(f, -2, 2), gy + 28]], 2, '#d8d8d0', { op }); f.line([[gx - 4, gy + 22], [gx + 34, gy + 4]], 2, '#d8d8d0', { op }); }
  f.part(rect(sx + 4, sy + PH - 136, 272, 14), { fill: '#3a2a1a', shade: 0.3, inkW: 1.4, cast: false }); f.part(rect(sx + 200, sy + PH - 146, 44, 12), { fill: '#e8e4d8', shade: 0.25, inkW: 1, cast: false, hatch: false });
}, { lanes: [120, 136, 1060, 776], slate: [1200, 156, 280, 736] });

// ================================================================== Scriptorium: the Codex open on its slope, painted borders (rubric, lapis,
// orpiment: no gold leaf, the Codex is the abbey's record, not a holy book), ribbon tabs down the right edge (the game sets the
// tab sprites in tab_slots), the inkpot and quill, Lucan's stopped watch laid by them
writePanel('scriptorium', 1816, f => {
  oak(f, X, Y, PW, PH, '#3a2818', 80);
  const bx = X + 70, by = Y + 46, bw = PW - 200, bh = PH - 110;
  book(f, bx, by, bw, bh, '#5a1a14', { page: '#e6d6ae', ribbons: [[-20, '#7a1a14'], [10, '#2a3a5a']], corner: BRASS });
  border(f, X + 110, Y + 76, bw / 2 - 70, bh - 70, '#7a1a14', LAPIS); border(f, X + 70 + bw / 2 + 30, Y + 76, bw / 2 - 70, bh - 70, '#7a1a14', LAPIS);
  for (const [ix, iy] of [[X + 130, Y + 96], [X + 70 + bw / 2 + 50, Y + 96]]) { f.part(rect(ix, iy, 46, 46), { fill: '#8a1a14', shade: 0.3, inkW: 1.4, cast: false, hatch: false }); f.line([[ix + 10, iy + 38], [ix + 23, iy + 8], [ix + 36, iy + 38]], 2.6, ORP); f.line([[ix + 15, iy + 26], [ix + 31, iy + 26]], 2, ORP); }
  inkpot(f, X + PW - 66, Y + PH - 40); quill(f, X + PW - 90, Y + PH - 90, -120);
  // the stopped watch on its chain: brass case, the crystal cracked, its hands at eight minutes to midnight
  const wx = X + PW - 150, wy = Y + PH - 46, r = 22;
  f.line([[wx + 16, wy - 14], [wx + 40, wy - 30], [wx + 58, wy - 26], [wx + 70, wy - 40]], 2.4, BRASS, { dash: '3 2' });
  f.part(ell([wx, wy], r, r, 0, 24), { fill: BRASS, light: '#d8b870', shadow: '#4a3818', shade: 0.4, inkW: 1.8, cast: false });
  f.part(ell([wx - 1, wy + 1], r * 0.8, r * 0.8, 0, 22), { fill: '#e8e0c8', light: '#fffaf0', shade: 0.2, inkW: 1.1, cast: false, hatch: false });
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; f.line([[wx - 1 + Math.sin(a) * r * 0.68, wy + 1 - Math.cos(a) * r * 0.68], [wx - 1 + Math.sin(a) * r * 0.56, wy + 1 - Math.cos(a) * r * 0.56]], k % 3 ? 0.7 : 1.3, '#2a2018'); }
  f.line([[wx - 1, wy + 1], [wx - 1 + Math.sin(-8 / 60 * Math.PI * 2) * r * 0.6, wy + 1 - Math.cos(-8 / 60 * Math.PI * 2) * r * 0.6]], 1.2, '#14100c');
  f.line([[wx - 1, wy + 1], [wx - 1 + Math.sin((11 + 52 / 60) / 12 * Math.PI * 2) * r * 0.4, wy + 1 - Math.cos((11 + 52 / 60) / 12 * Math.PI * 2) * r * 0.4]], 2, '#14100c');
  f.line([[wx - r * 0.5, wy - r * 0.45], [wx - r * 0.05, wy - r * 0.05], [wx + r * 0.35, wy + r * 0.55]], 0.8, '#ffffff', { op: 0.85 });
  f.part(ell([wx, wy - r - 4], 5, 4, 0, 10), { fill: BRASS, shade: 0.3, inkW: 1, cast: false, hatch: false });
  // the tab slots down the right edge (empty: the game sets ui_tab / ui_tab_sel there)
  const tabs = []; for (let k = 0; k < 8; k++) tabs.push({ index: k, rect: [1360, 170 + k * 80, 140, 64] });
  for (const t of tabs) f.flat(rect(t.rect[0] + 4, t.rect[1] + 4, t.rect[2] - 8, t.rect[3] - 8), '#1a0e08', { op: 0.25 });
  return { tab_slots: tabs };
}, { left: [190, 180, 560, 640], right: [820, 180, 560, 640], tabs: [1360, 170, 140, 640] });

// ================================================================== Chapter House: the charter, a long vellum sheet on the Prior's table, an
// illuminated border (gilt: the order's charter is holy), two columns (works and vows), fold creases, seven hanging seals
writePanel('chapter', 1817, f => {
  oak(f, X, Y, PW, PH, '#2a1c12', 110);
  const px = X + 80, py = Y + 36, pw = PW - 160, ph = PH - 140;
  f.flat([[px + 6, py + 10, 1], [px + pw + 6, py + 16, 1], [px + pw - 4, py + ph + 14, 1], [px + 2, py + ph + 8, 1]], '#000', { op: 0.45 });
  vellum(f, [[px, py, 1], [px + pw, py + 6, 1], [px + pw - 8, py + ph, 1], [px - 2, py + ph - 4, 1]], [px, py, pw, ph], { fox: 40, base: '#e6d8b4' });
  border(f, px + 30, py + 30, pw - 60, ph - 60, '#7a1a14', GOLD);
  for (const [cx2, cy2] of [[px + 30, py + 30], [px + pw - 30, py + 30], [px + 30, py + ph - 30], [px + pw - 30, py + ph - 30]]) f.part(ell([cx2, cy2], 9, 9, 0, 12), { fill: GOLD, light: GOLDL, shade: 0.3, inkW: 1.2, cast: false, hatch: false });
  f.line([[px + pw / 2, py + 90], [px + pw / 2, py + ph - 60]], 1.4, '#7a1a14', { op: 0.6, straight: true });
  for (const t of [0.33, 0.66]) { f.line([[px, py + ph * t], [px + pw, py + ph * t + 4]], 1, '#8a7a5a', { op: 0.18, straight: true }); f.line([[px, py + ph * t + 2], [px + pw, py + ph * t + 6]], 1, '#fff8e8', { op: 0.2, straight: true }); }
  for (let k = 0; k < 7; k++) { const sx = px + 140 + k * (pw - 280) / 6, sy = py + ph + 40 + rr(f, 0, 20), col = ['#7a1a14', '#5a1a10', '#2a3a1a', '#7a1a14', '#4a2a10', '#7a1a14', '#5a1a3a'][k];
    f.line([[sx - 6, py + ph - 6], [sx - 10, sy - 20], [sx, sy - 26]], 2, '#c8b890'); f.line([[sx + 6, py + ph - 6], [sx + 10, sy - 20], [sx, sy - 26]], 2, '#c8b890');
    f.part(ell([sx, sy], 26, 26, f.r(), 12), { fill: col, light: mix(col, '#d87a6a', 0.4), shade: 0.4, inkW: 1.8, cast: false, tex: T(f, 'mottle'), texOp: 0.4 });
    f.line(ell([sx, sy], 15, 15, 0, 14).concat([ell([sx, sy], 15, 15, 0, 14)[0]]), 2, mix(col, '#000', 0.4));
    f.line([[sx - 7, sy], [sx + 7, sy]], 2, mix(col, '#000', 0.5)); f.line([[sx, sy - 7], [sx, sy + 7]], 2, mix(col, '#000', 0.5)); }
}, { left: [200, 196, 590, 620], right: [820, 196, 590, 620] });

// ================================================================== small UI sprites (grim's ui_*), in Living Ink
const UI = path.join(OUT, 'ui'); fs.mkdirSync(UI, { recursive: true });
const sprite = (name, w, h, seed, draw) => { const f = fig(seed); draw(f); fs.writeFileSync(path.join(UI, `ui_${name}.svg`), wrap(f, w, h)); };
for (const [nm, base, edge, s] of [['btn', '#e0cfa6', INK, 1901], ['btn_hover', '#f0e2bc', RUB, 1902], ['btn_off', '#9a907a', '#5a5040', 1903], ['btn_down', '#c8b890', INK, 1904]]) sprite(nm, 120, 56, s, f => {
  f.part([[6, 4, 1], [114, 6, 1], [116, 50, 1], [4, 52, 1]], { fill: base, light: mix(base, '#fff8e8', 0.4), shade: 0.25, inkW: 2.6, cast: false, hatch: false, tex: T(f, 'mottle'), texOp: 0.25 });
  for (let k = 0; k < 6; k++) f.flat(ell([10 + f.r() * 100, 8 + f.r() * 40], 1 + f.r() * 2, 1 + f.r() * 2, 0, 6), '#8a5a2a', { op: 0.15 });
  f.line([[10, 10], [110, 11]], 0.8, edge, { op: 0.35, straight: true }); f.line([[10, 46], [110, 45]], 0.8, edge, { op: 0.35, straight: true });
  if (nm === 'btn_hover') f.line([[6, 4], [114, 6], [116, 50], [4, 52], [6, 4]], 1.6, RUB, { op: 0.8, straight: true });
});
for (const [nm, col, s] of [['seal', '#8a1a14', 1911], ['seal_hover', '#b0261c', 1912], ['seal_off', '#4a3a34', 1913]]) sprite(nm, 96, 96, s, f => {
  f.flat(ell([48, 50], 40, 40, 0, 16), '#000', { op: 0.35 });
  const pts = []; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, m = 1 + (f.r() - 0.5) * 0.18; pts.push([48 + Math.cos(a) * 40 * m, 46 + Math.sin(a) * 40 * m]); }
  f.part(pts, { fill: col, light: mix(col, '#e88a7a', 0.4), shadow: mix(col, '#000', 0.4), shade: 0.4, inkW: 2.4, cast: false, tex: T(f, 'mottle'), texOp: 0.4 });
  const r = ell([48, 46], 26, 26, 0, 20); f.line(r.concat([r[0]]), 3, mix(col, '#000', 0.45));
  f.line([[38, 56], [38, 40], [48, 30], [58, 40], [58, 56]], 3, mix(col, '#000', 0.5)); // the order's door pressed into the wax
});
for (const [nm, ring, s] of [['slot', '#5a5650', 1921], ['slot_hover', '#b8a070', 1922], ['slot_sel', '#c4573f', 1923]]) sprite(nm, 112, 112, s, f => {
  f.part(rect(6, 6, 100, 100), { fill: '#140e0a', shade: 0.15, inkW: 3, cast: false, hatch: false, tex: T(f, 'mottle'), texOp: 0.4 });
  f.line([[10, 10], [102, 10], [102, 102], [10, 102], [10, 10]], 2.4, ring, { straight: true });
  for (const [cx, cy, sx, sy] of [[6, 6, 1, 1], [106, 6, -1, 1], [6, 106, 1, -1], [106, 106, -1, -1]]) { f.part([[cx, cy, 1], [cx + sx * 26, cy, 1], [cx + sx * 26, cy + sy * 8, 1], [cx + sx * 8, cy + sy * 8, 1], [cx + sx * 8, cy + sy * 26, 1], [cx, cy + sy * 26, 1]], { fill: IRON, light: '#6e6e70', shade: 0.3, inkW: 1.4, cast: false }); f.rivet([cx + sx * 4, cy + sy * 4], 1.6, '#7a7670'); }
});
for (const [nm, col, s] of [['tab', '#5a1a14', 1931], ['tab_sel', '#a02a1c', 1932]]) sprite(nm, 150, 64, s, f => {
  f.part([[4, 6, 1], [140, 6, 1], [128, 32, 1], [140, 58, 1], [4, 58, 1]], { fill: col, light: mix(col, '#e88a7a', 0.3), shade: 0.35, inkW: 2.4, cast: false, tex: T(f, 'weave'), texOp: 0.4 });
  f.line([[8, 12], [128, 12]], 1.6, ORP, { op: 0.7, straight: true }); f.line([[8, 52], [128, 52]], 1.6, ORP, { op: 0.7, straight: true });
});
sprite('portrait', 200, 240, 1941, f => {
  const o = ell([100, 120], 94, 114, 0, 40); f.line(o.concat([o[0]]), 16, INK); f.line(o.concat([o[0]]), 12, IRON); f.line(o.slice(22, 34), 2, '#8a8a8c', { op: 0.6 });
  const i = ell([100, 120], 84, 104, 0, 40); f.line(i.concat([i[0]]), 3, BRONZE);
  for (const t of [0, 90, 180, 270]) { const a = t * Math.PI / 180; f.rivet([100 + Math.cos(a) * 94, 120 + Math.sin(a) * 114], 4, '#7a7670'); }
});
console.log('ui sprites written');
