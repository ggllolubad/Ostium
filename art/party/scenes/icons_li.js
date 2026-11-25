// The item, status, node and supply icons in Living Ink: same 126 ids, same 128x128 canvas, same file names as grim.
// grim/icons.js (with kit.js, sigils.js, anatomy.js) is staged unchanged except for the rulings below and run against
// scenes/gr_li.js as its '../gr', so every grim shape is drawn by the figure engine (lit edge, shadow band, hatch, heavy
// ink on the shadow side). The grim sources on disk are not touched.
// Rulings applied in the staged copy (2026-11-23/24):
//   - lightning: no bolts or arcs in the air. kit.js D.arc / D.arcs (the lightning effect) and the lightning sigil become
//     Lichtenberg burns, branching scorches scarred into a surface (bible 00: "branching Lichtenberg burns").
//   - eyes only in the void: the eye motes in the Seer's Lens are removed (the lens shows a pale reflection). The void
//     sigil's eye and the void effect's eyes stay (void). The eye rune (r_eye) keeps its id; its face is the void hole (icons_li_fix.js).
//   - gold only on holy things: G.gold / G.goldL are bronze for every icon except the holy ones (HOLY below) and money:
//     the 'gold' supply icon keeps gold coins (Cole, 2026-11-24: money is the one exception).
// Usage: node scenes/icons_li.js [outDir] [id ...]   (default out/scenes/hub/icons)
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, '..', 'out', 'scenes', 'hub', 'icons'));
const only = process.argv.slice(3);
const GRIM = '/home/claude/ostium-art/grim';
const st = fs.mkdtempSync(path.join(os.tmpdir(), 'icons_li_'));
fs.mkdirSync(path.join(st, 'grim'));
// the shim as ../gr, requiring the party engine by absolute path
fs.writeFileSync(path.join(st, 'gr.js'), `module.exports = require(${JSON.stringify(path.join(__dirname, 'gr_li.js'))});`);
let kit = fs.readFileSync(path.join(GRIM, 'kit.js'), 'utf8');
kit = kit.replace(/D\.arc = \(x0, y0, x1, y1, w = 2\) => \{/, 'D.arc = (x0, y0, x1, y1, w = 2) => a.lichtenberg(x0, y0, Math.atan2(y1 - y0, x1 - x0), Math.hypot(x1 - x0, y1 - y0) * 0.8, "#2a1a10", w + 0.4); D.arcGrim = (x0, y0, x1, y1, w = 2) => {');
kit = kit.replace(/D\.arcs = \(x, y, r, n = 3\) => /, 'D.arcs = (x, y, r, n = 3) => Array.from({ length: n }, (_, i) => a.lichtenberg(x + (R() - 0.5) * r * 0.4, y + r * 0.3, -Math.PI / 2 + (i - (n - 1) / 2) * 0.7, r * 0.9, "#2a1a10", 1.6)).join(""); D.arcsGrim = (x, y, r, n = 3) => ');
if (!/a\.lichtenberg\(x0/.test(kit) || !/D\.arcsGrim/.test(kit)) throw new Error('kit.js lightning patch did not apply');
fs.writeFileSync(path.join(st, 'grim', 'kit.js'), kit);
let sg = fs.readFileSync(path.join(GRIM, 'sigils.js'), 'utf8');
// the lightning sigil: a branching burn rising from the bottom of the ring, its forks spreading (a Lichtenberg figure)
const LB = `lightning: (() => { let o = ''; const br = (x, y, a, l, w, d, s) => { let px = x, py = y, q = 'M' + f(px) + ' ' + f(py); for (let i = 0; i < 4; i++) { a += [0.35, -0.5, 0.42, -0.3, 0.25, -0.45][(s + i) % 6]; px += Math.cos(a) * l / 4; py += Math.sin(a) * l / 4; q += ' L' + f(px) + ' ' + f(py); if (d > 0 && i % 2 === 1) br(px, py, a + (i === 1 ? -0.9 : 0.9), l * 0.5, w * 0.62, d - 1, s + i + 1); } o += '<path d="' + q + '" stroke="' + col + '" stroke-width="' + f(w) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; }; br(cx, cy + r * 0.62, -Math.PI / 2, r * 1.0, w * r / 18, 2, 0); return o; })(),`;
sg = sg.replace(/lightning: `[^\n]*`,\n/, LB + '\n');
if (!sg.includes('Lichtenberg') && !sg.includes("lightning: (() =>")) throw new Error('sigil patch did not apply');
fs.writeFileSync(path.join(st, 'grim', 'sigils.js'), sg);
fs.copyFileSync(path.join(GRIM, 'anatomy.js'), path.join(st, 'grim', 'anatomy.js'));
let ic = fs.readFileSync(path.join(GRIM, 'icons.js'), 'utf8');
ic = ic.replace("P.D.eyes(72, 54, 4, 1, '#8a6ab8')", "`<path d=\"M60 46 C66 42 76 42 82 48\" stroke=\"#f4f0e4\" stroke-width=\"2\" fill=\"none\" opacity=\"0.6\"/>`");
if (ic.includes("P.D.eyes(72, 54")) throw new Error('lens patch did not apply');
// red only for blood, doom and rubric: the brigandine's cloth is a brown dyed cover, the medicine chest's cross and
// tincture ochre and amber (the Templar hammer's cross, the event node's rubric '?', blood drops and the rage draught keep red)
ic = ic.replace('I.a_brigandine = (a, P) => P.torso(G.redD,', "I.a_brigandine = (a, P) => P.torso('#5a4632',");
ic = ic.replace("Z\" fill=\"${G.red}\"/>` }); P.bottle(92, 42, 'vial', '#c83a2a'", "Z\" fill=\"#7a5a32\" stroke=\"#16110d\" stroke-width=\"1.2\"/>` }); P.bottle(92, 42, 'vial', '#a8641e'");
// eyes only in the void: Focus was an open eye; it is now a slim taper whose flame stands dead still, the attention drawn
// to it by three ink strokes converging on the flame
ic = ic.replace(/I\.s_focus = \(a, P\) => \{[^\n]*\n/, "I.s_focus = (a, P) => { P.S(poly([[60, 50], [68, 50], [69, 104], [59, 104]]), '#d8ccb0', { depth: 4 }); P.S(smooth([[38, 104], [90, 104], [82, 116], [46, 116]], true, 0.3), '#4a4440', { depth: 6 }); a.raw(P.D.flame(64, 48, 34, 8) + '<path d=\"M20 22 L52 38 M108 22 L76 38 M64 4 L64 14\" stroke=\"#16110d\" stroke-width=\"3.4\" stroke-linecap=\"round\"/>'); };\n");
if (!ic.includes("I.s_focus = (a, P) => { P.S(poly([[60, 50]")) throw new Error('focus patch did not apply');
if (ic.includes("P.torso(G.redD") || ic.includes("'vial', '#c83a2a'")) throw new Error('red patches did not apply');
// the render loop: write to OUT, set gold per icon (holy keeps gold), keep the grim ids and the umber ground shadow
ic = ic.replace("fs.mkdirSync('grim/icons', { recursive: true });", "fs.mkdirSync(process.env.ICON_OUT, { recursive: true });");
ic = ic.replace("const a = new Art(N, N, seed % 9999 + 1), P = kit(a);", "G.gold = HOLY.has(id) || id === 'gold' ? '#a8873e' : '#7a5a32'; G.goldL = HOLY.has(id) || id === 'gold' ? '#d8b860' : '#a8845a'; const a = new Art(N, N, seed % 9999 + 1), P = kit(a);");
ic = ic.replace("fs.writeFileSync(`grim/icons/${id}.svg`, a.svg());", "fs.writeFileSync(`${process.env.ICON_OUT}/${id}.svg`, a.svg());");
ic = ic.replace("const only = process.argv.slice(2);", "const only = (process.env.ICON_ONLY || '').split(',').filter(Boolean); const HOLY = new Set(['rl_reliquary', 'rl_saints_finger', 'a_saints_plate', 't_rosary', 'n_shrine', 'rl_pilgrim_badge', 'w_templar_hammer', 'r_ward', 's_ward']);");
for (const k of ['ICON_OUT', 'HOLY.has(id)', 'ICON_ONLY']) if (!ic.includes(k)) throw new Error('icons.js loop patch did not apply: ' + k);
// redraws (coordinator's look 2026-11-24, and 22 px legibility): injected before the render loop, so they replace grim's
const FIX = fs.readFileSync(path.join(__dirname, 'icons_li_fix.js'), 'utf8');
if (!ic.includes('// ------------------------------------------------------------------ render')) throw new Error('render marker missing');
ic = ic.replace('// ------------------------------------------------------------------ render', FIX + '\n// ------------------------------------------------------------------ render');
fs.writeFileSync(path.join(st, 'grim', 'icons.js'), ic);
const { execFileSync } = require('child_process');
const out = execFileSync('node', ['grim/icons.js'], { cwd: st, env: Object.assign({}, process.env, { ICON_OUT: OUT, ICON_ONLY: only.join(',') }) }).toString();
process.stdout.write(out);
fs.rmSync(st, { recursive: true, force: true });
