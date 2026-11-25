// World III, The Boiling Baths (Fire + Water, Scald): shared helpers for world_III.js.
// Fire cooks from the outside in: skin boiled pink and white, peeling in sheets, blistered, split seams that glow raw,
// flaking, vapour curling upward. Water keeps everything wet, swollen, pruned and steaming. Never cartoon flames on
// heads, never fish faces. Palette: pink-white marble, steam white, boiled red, plus ink black, bone and grey (and the
// bible's named materials: copper, bronze, linen, a little holy gold on the Matron).
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { split, side } = require('../dirAC');

const P = {
  marble: '#e4d2cc', marbleL: '#f4e8e2', marbleD: '#b49c98', marbleV: '#9a7478', marbleS: '#6e5058',
  steam: '#f3eeea', steamS: '#cfc4c4',
  red: '#b4402e', redL: '#d4664c', redD: '#782418', redS: '#4a1a1a', // boiled red
  raw: '#c8706a', rawL: '#dc9890', rawD: '#8a3634', glow: '#f08a66', // raw flesh under peeled skin, a split seam's hot core
  poach: '#ead2c6', poachL: '#f6e6dc', poachD: '#c4a29a', poachS: '#7e5a62', // boiled pink-white, poached
  dead: '#eadad2', deadD: '#bca8a2', // boiled-white dead skin coming away
  linen: '#d2cdc0', linenD: '#9c9486', linenS: '#5e5252', linenW: '#c4b8a8',
  copper: '#a65c38', copperL: '#d08c5e', copperD: '#5e2e1c', verd: '#5e8a76', verdL: '#8ab09c', soot: '#241a18',
  bronze: '#8c6a40', bronzeD: '#4e3a22', bronzeL: '#c09a62',
  gold: '#c4a04a', goldD: '#7a5e26', goldL: '#ecd28a',
  leather: '#4e3426', leatherD: '#2e1e16', leatherL: '#7a5440',
  wood: '#5a4030', woodD: '#33241a', woodL: '#86664a',
  iron: '#4a4646', ironL: '#7a7674', bone: '#d8cdb8', boneD: '#9c907c', grey: '#7a7270',
  blood: '#5e0f0c', bloodL: '#8a1c14', water: '#c8d4d4', wet: '#fbf6f2',
  mud: '#3a2826', // wet grime off the bath floors
};

// the world's render setup: kit.foeBase with a warm wine shadow and a wet grime; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - Math.round(h * 0.26), shadowTint: '#3a1e28', mud: P.mud }, o));

// texture patterns for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed, r = E.rng(s * 13 + 5);
  // marble: long wandering veins with a few forks, two weights
  let m = '';
  for (let i = 0; i < 7; i++) {
    let x = r() * 220, y = r() * 220; const pts = [[x, y]];
    const a0 = -0.6 + r() * 1.2;
    for (let k = 0; k < 6; k++) { x += Math.cos(a0 + (r() - 0.5) * 1.2) * (18 + r() * 20); y += Math.sin(a0 + (r() - 0.5) * 1.2) * (18 + r() * 20); pts.push([x, y]); }
    m += `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join('L')}" fill="none" stroke="${i % 3 ? P.marbleV : INK}" stroke-width="${i % 3 ? 0.9 : 0.7}" opacity="${i % 3 ? 0.55 : 0.35}" stroke-linejoin="round"/>`;
  }
  f.defs.push(`<pattern id="marble${s}" patternUnits="userSpaceOnUse" width="220" height="220">${m}</pattern>`);
  // pruned: water-wrinkled skin, short curved creases running across the limb
  let w = '';
  for (let i = 0; i < 22; i++) { const x = r() * 34, y = r() * 34, l = 4 + r() * 6; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${(1.5 + r() * 1.5).toFixed(1)} ${l.toFixed(1)},0" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.5"/>`; }
  f.defs.push(`<pattern id="pruned${s}" patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(-8)">${w}</pattern>`);
  // hammered copper: small dimples, a lit lip and a dark cup
  let h = '';
  for (let i = 0; i < 14; i++) { const x = r() * 30, y = r() * 30, rr = 2 + r() * 2.5; h += `<path d="M${(x - rr).toFixed(1)},${y.toFixed(1)} a${rr.toFixed(1)},${(rr * 0.8).toFixed(1)} 0 0 0 ${(rr * 2).toFixed(1)},0" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.45"/><path d="M${(x - rr).toFixed(1)},${(y - 1).toFixed(1)} a${rr.toFixed(1)},${(rr * 0.8).toFixed(1)} 0 0 1 ${(rr * 2).toFixed(1)},0" fill="none" stroke="#f0c09a" stroke-width="0.7" opacity="0.4"/>`; }
  f.defs.push(`<pattern id="hammer${s}" patternUnits="userSpaceOnUse" width="30" height="30">${h}</pattern>`);
  // soft blur for steam and glows
  f.defs.push(`<filter id="steamblur${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.6"/></filter>`);
  f.defs.push(`<filter id="steamblur2${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>`);
  f.defs.push(`<filter id="glowblur${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>`);
}

// looks
const SKP = (f, o = {}) => Object.assign({ fill: P.poach, shadow: P.poachS, shade: 0.32, tex: 'mottle' + f.o.seed, texOp: 0.45 }, o); // poached pink-white
const SKR = (f, o = {}) => Object.assign({ fill: P.red, shadow: P.redS, shade: 0.34, tex: 'mottle' + f.o.seed, texOp: 0.5 }, o); // boiled red
const SKW = (f, o = {}) => Object.assign({ fill: P.dead, shadow: '#6a5a60', shade: 0.32, tex: 'mottle' + f.o.seed, texOp: 0.4 }, o); // boiled white
const LIN = (f, o = {}) => Object.assign({ fill: P.linen, shadow: P.linenS, shade: 0.36, tex: 'weave' + f.o.seed, texOp: 0.35 }, o);
const COP = (f, o = {}) => Object.assign({ fill: P.copper, shadow: '#3a1a14', shade: 0.4, tex: 'hammer' + f.o.seed, texOp: 0.8 }, o);
const MAR = (f, o = {}) => Object.assign({ fill: P.marble, shadow: P.marbleS, shade: 0.34, tex: 'marble' + f.o.seed, texOp: 0.9 }, o);

const R = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);
const D = 180 / Math.PI;
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const elb = (S0, E0, W0) => E.norm(add(E.norm(sub(E0, S0)), E.norm(sub(W0, E0)))); // joint cut square to the bisector of the bend

// ---- scald marks ----
// a blister: a tight translucent dome with a shine, a dark rim; burst ones are a raw crater ringed by a torn pale flap
function blister(f, c, r, o = {}) {
  const a = o.ang ?? (f.r() - 0.5) * 0.8;
  if (o.burst) {
    f.flat(ell(c, r * 1.05, r * 0.8, a, 12), P.rawD, { op: 0.9 });
    f.flat(ell(add(c, [0.5, 0.8]), r * 0.7, r * 0.5, a, 10), P.raw);
    f.flat(ell(add(c, [-r * 0.2, -r * 0.25]), r * 0.25, r * 0.15, a, 6), P.wet, { op: 0.7 });
    const e = ell(c, r * 1.15, r * 0.9, a, 9);
    f.line([e[5], e[6], e[7], e[8], e[0], e[1]], 1.1, P.dead, { op: 0.95 });
    f.line([e[5], e[6], e[7], e[8], e[0], e[1]], 0.6, INK, { op: 0.6 });
    return;
  }
  f.part(ell(c, r, r * 0.78, a, 12), { fill: o.col || mix(P.poachL, '#fff', 0.2), shadow: o.shadow || P.poachD, shade: 0.45, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false, opacity: o.op ?? 0.92 });
  f.flat(ell(add(c, [r * 0.3, -r * 0.32]), r * 0.3, r * 0.2, a, 8), '#fff', { op: 0.85 }); // tight shine (light from upper right in build space)
  f.line(ell(c, r * 0.9, r * 0.7, a, 10).slice(2, 7), 0.8, P.rawD, { op: 0.6 }); // the red ring where it lifts
}
function blisters(f, c, rx, ry, n, r0, r1, o = {}) { for (let i = 0; i < n; i++) blister(f, scatter(f, c, rx, ry), R(f, r0, r1), { burst: f.r() < (o.burst ?? 0.3), col: o.col, shadow: o.shadow }); }

// a sheet of boiled skin peeling away. It came loose from above and hangs folded down from where it is still attached
// (root), so the raw wet bed it tore from sits above the root, and the dead sheet hangs plumb below it.
// Independent review: the first version narrowed to a single curved point under a round pink bed, and at game size the
// strips read as claws or tusks. Now the sheet keeps its width (skin comes away in sheets, not spikes), curls out at the
// root in a rolled lip, twists once to show its wetter pink inner face, is translucent, and ends in a ragged torn edge of
// several short blunt tatters. The bed is a scraped patch wider than tall, its rim lifted in small flaps.
// w: width at the root; len: length of the hanging sheet.
function peelSheet(f, root, w, len, o = {}) {
  const sway = o.sway ?? (f.r() - 0.5) * w * 0.5, up = o.up ?? Math.min(len * 0.7, w * 2.4), J = () => (f.r() - 0.5) * w * 0.26;
  const col = o.col || P.dead;
  if (o.bed !== false) {
    // the bed: the raw track the sheet peeled down from, the sheet's own width, running up the limb above the root to a
    // ragged point where the tear began; the surviving skin's torn edge lifts a little along both sides
    const hw = w * 0.52, bed = [add(root, [-hw, 2]), add(root, [-hw * 1.02 + J(), -up * 0.3]), add(root, [-hw * 0.9 + J(), -up * 0.6]), add(root, [-hw * 0.6 + J(), -up * 0.85]), [...add(root, [(f.r() - 0.5) * hw * 1.1, -up * (0.9 + f.r() * 0.2)]), 1], add(root, [hw * 0.35 + J(), -up * 0.72]), [...add(root, [hw * 0.6 + J(), -up * 0.7]), 1], add(root, [hw * 0.92 + J(), -up * 0.55]), add(root, [hw * 1.0 + J(), -up * 0.25]), add(root, [hw, 2])];
    f.flat(bed, o.bedCol || P.raw, { op: 0.88 });
    f.flat(bed.map(p => lerp(p, add(root, [0, -up * 0.35]), 0.55)), P.rawD, { op: 0.3 });
    for (let i = 0; i < 2; i++) f.line([add(root, [-hw * 0.4 + i * hw * 0.7, -up * 0.7]), add(root, [-hw * 0.3 + i * hw * 0.7, -up * 0.1])], 0.8, P.rawD, { op: 0.5 }); // grain of the wet flesh
    f.line([add(root, [-hw * 0.3, -up * 0.2]), add(root, [-hw * 0.1, -up * 0.6])], 1.2, P.wet, { op: 0.65 });
    f.line(bed.slice(0, 5), 1.5, col, { op: 0.95 }); f.line(bed.slice(4), 1.5, col, { op: 0.95 });
    f.line(bed.slice(0, 5).map(q => add(q, [-1.2, 0])), 0.6, INK, { op: 0.5 }); f.line(bed.slice(4).map(q => add(q, [1.2, 0])), 0.6, INK, { op: 0.5 });
  }
  // the sheet: plumb, keeping its width, wavering a little, one twist; ragged torn bottom
  const tip = add(root, [sway, len]), n = 8, Lp = [], Rp = [], tw = 0.4 + f.r() * 0.2, it = Math.round(tw * n);
  for (let i = 0; i <= n; i++) {
    const t = i / n, c = add(lerp(root, tip, t), [Math.sin(t * 4 + (o.ph || 0)) * w * 0.16, 0]);
    let ww = w * 0.5 * (1.08 - 0.22 * t), jl = 1 + (f.r() - 0.5) * 0.34, jr = 1 + (f.r() - 0.5) * 0.34;
    if (i === it) { jl *= 0.62; jr *= 0.62; } // the twist pinches the sheet
    if (i === 0) ww *= 1.12; // the lip where it curls away from the body is a little wider
    const nl = i > 0 && i < n && i % 3 === 1, nr = i > 0 && i < n && i % 3 === 2; // small tears in the edges
    Lp.push(nl ? [...add(c, [-ww * jl * 0.8, 0]), 1] : add(c, [-ww * jl, 0])); Rp.push(nr ? [...add(c, [ww * jr * 0.8, 0]), 1] : add(c, [ww * jr, 0]));
  }
  const bl = Lp[n], br = Rp[n], end = [], k = w > 16 ? 5 : 3;
  for (let j = 0; j <= k; j++) {
    const q = lerp(bl, br, j / k);
    if (j === 0 || j === k) end.push([...q, 1]);
    else if (j % 2) end.push(add(q, [(f.r() - 0.5) * 2, w * (0.18 + f.r() * 0.3)])); // a blunt tatter
    else end.push([...add(q, [0, -w * (0.04 + f.r() * 0.1)]), 1]); // a tear notch
  }
  const s = [...Lp.slice(0, n), ...end, ...Rp.slice(0, n).reverse()];
  f.part(s, { fill: col, shadow: o.shadow || '#8a7676', shade: 0.28, inkW: 0.8, inkHeavy: 1.1, cast: o.cast ?? true, castOp: 0.25, hatch: false, opacity: o.op ?? 0.9 });
  // below the twist the wetter, pinker inner face shows
  f.flat([...Lp.slice(it, n + 1), ...end.slice(1, -1), ...Rp.slice(it, n + 1).reverse()], mix(P.raw, col, 0.6), { op: 0.28 });
  for (const tt of [0.22, 0.7, 0.86]) { const i2 = Math.round(tt * n); f.line([lerp(Lp[i2], Rp[i2], 0.15), add(lerp(Lp[i2], Rp[i2], 0.5), [0, w * 0.06]), lerp(Lp[i2], Rp[i2], 0.8)], 0.7, INK, { op: 0.35 }); } // wet wrinkles across it
  f.line([Lp[it - 1] || Lp[0], Rp[it]], 0.8, INK, { op: 0.5 }); f.line([Rp[it - 1] || Rp[0], Lp[it]], 0.7, INK, { op: 0.35 }); // the twist
  // the rolled edge down one side above the twist, and the curl of the lip at the root
  f.line(Lp.slice(0, it + 1).map(q => add(q, [w * 0.08, 0])), Math.max(1, w * 0.09), mix(col, '#6a5050', 0.5), { op: 0.5 });
  f.line([add(Lp[0], [w * 0.1, w * 0.12]), add(lerp(Lp[0], Rp[0], 0.5), [0, w * 0.22]), add(Rp[0], [-w * 0.1, w * 0.1])], 0.9, INK, { op: 0.45 });
  // pink veining showing through the translucent dead skin, and a few frayed fibres at the torn end
  f.line([lerp(Lp[1], Rp[1], 0.6), lerp(Lp[3], Rp[3], 0.55), lerp(Lp[6], Rp[6], 0.62)], 0.8, P.rawL, { op: 0.45 });
  for (let j = 1; j < end.length - 1; j += 2) f.line([end[j], add(end[j], [(f.r() - 0.5) * 3, w * 0.12])], 0.6, col, { op: 0.8 });
  return tip;
}
// boiled skin breakup along a limb or over an area: pink mottling, pale dead patches and a few creases
function scald(f, c, rx, ry, n, o = {}) {
  const ax = o.ang ?? 1.5; // streaks run along this angle (down the limb by default)
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), l = R(f, 6, 16) * (o.s || 1), w = R(f, 1.5, 3.5) * (o.s || 1), k = f.r(), a2 = ax + (f.r() - 0.5) * 0.5;
    const q0 = add(p, rot([-l / 2, 0], a2)), q1 = add(p, rot([l / 2, 0], a2));
    f.stroke([q0, add(p, rot([0, w * 0.3], a2)), q1], w * 2, k < 0.55 ? (o.pink || P.rawL) : k < 0.85 ? (o.pale || P.poachL) : P.rawD, { op: k < 0.85 ? 0.5 : 0.3 });
  }
}
// small curls of dead skin flaking up off a surface (fire's flaking), pale with an ink edge
function flakes(f, c, rx, ry, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), s = R(f, 3, 7) * (o.s || 1), a = (o.ang ?? -0.4) + (f.r() - 0.5) * 1.2;
    const q = [p, add(p, rot([s * 1.4, -s * 0.3], a)), add(p, rot([s * 1.7, s * 0.4], a)), add(p, rot([s * 0.5, s * 0.6], a))];
    f.flat(q, o.col || P.dead, { op: 0.9 });
    f.line([p, q[1], q[2]], 0.8, INK, { op: 0.7 });
  }
}
// pruned, water-wrinkled skin: short curved creases across a limb axis
function wrinkles(f, a, b, w, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, c = lp(a, b, t, (f.r() - 0.5) * w * 0.2), d = E.norm(sub(b, a)), nn = [-d[1], d[0]], hw = w * R(f, 0.25, 0.42);
    f.line([add(c, mul(nn, hw)), add(add(c, mul(nn, 0)), mul(d, 2.5)), add(c, mul(nn, -hw))], o.w || 0.9, o.col || INK, { op: o.op ?? 0.5 });
  }
}
// a split in cooked skin: a dark crack with a raw hot core and charred lips
function seam(f, pts, w = 3, o = {}) {
  f.raw(`<path d="${E.smooth(pts, false)}" fill="none" stroke="${P.glow}" stroke-width="${w * 3.2}" stroke-linecap="round" opacity="${o.glowOp ?? 0.35}" filter="url(#glowblur${f.o.seed})"/>`);
  f.stroke(pts, w * 1.6, P.redS);
  f.stroke(pts, w * 0.9, o.core || P.redL);
  f.line(pts.map(p => add(p, [0, -w * 0.3])), 0.6, P.glow, { op: 0.8 });
  // charred, flaking lips
  for (let i = 1; i < pts.length - 1; i++) { const p = pts[i]; f.line([add(p, [-w * 1.2, -w]), add(p, [-w * 0.2, -w * 0.4])], 0.9, INK, { op: 0.7 }); }
}
// sweat beads and drips: a bead with a shine, sometimes running
function beads(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = R(f, 1.6, 3.2) * s;
    if (f.r() < 0.35) f.stroke([add(p, [0, -r * 4]), add(p, [0.6, -r * 2]), p], r * 1.1, P.water, { op: 0.5 });
    f.flat(ell(p, r, r * 1.25, 0, 8), mix(P.water, '#7a8a8a', 0.3), { op: 0.7 });
    f.flat(ell(add(p, [r * 0.3, -r * 0.4]), r * 0.4, r * 0.4, 0, 6), '#fff', { op: 0.9 });
  }
}
function drip(f, p, s = 1) {
  f.flat([add(p, [-1.6 * s, 0]), add(p, [1.6 * s, 0]), add(p, [0, 7 * s])], mix(P.water, '#6a7a7a', 0.3), { op: 0.7 });
  f.flat(ell(add(p, [0, 11 * s]), 2.2 * s, 3.2 * s, 0, 8), mix(P.water, '#6a7a7a', 0.2), { op: 0.8 });
  f.flat(ell(add(p, [0.6 * s, 10 * s]), 0.7 * s, 1 * s, 0, 5), '#fff', { op: 0.9 });
}
// wet sheen: a broken light stroke along a lit edge
function sheen(f, pts, w = 2, op = 0.55) { const n = pts.length; for (let i = 0; i < n - 1; i += 2) f.line([pts[i], pts[Math.min(n - 1, i + 1)]], w, P.wet, { op }); }

// steam: a rising column of soft lumps that drift and thin out with height, with a few inked curls so it belongs to the
// ink style. p0: source; h: height; w: width at the source; drift: sideways travel at the top; o.op: density.
function steam(f, p0, h, w, o = {}) {
  const n = o.n || Math.max(4, Math.round(h / (w * 0.55))), drift = o.drift ?? 0, op = o.op ?? 0.55, s = f.o.seed, bl = o.blur || 'steamblur';
  const sp = t => add(p0, [drift * t * t + Math.sin(t * 5 + (o.phase || 0)) * w * 0.35 * t, -h * t]);
  let g = '';
  for (let i = 0; i < n; i++) {
    const t = (i + 0.3) / n, c = add(sp(t), [(f.r() - 0.5) * w * 0.5 * t, 0]), rr = w * (0.45 + t * (o.grow ?? 0.9)) * R(f, 0.65, 1.25);
    const e = ell(c, rr, rr * 0.7, (f.r() - 0.5) * 0.8, 12).map(q => add(q, [(f.r() - 0.5) * rr * 0.35, (f.r() - 0.5) * rr * 0.3]));
    const a = op * (1 - t * 0.8) * (o.fadeIn ? Math.min(1, t * 4) : 1);
    g += `<path d="${E.smooth(e)}" fill="${o.col || P.steam}" opacity="${a.toFixed(2)}" filter="url(#${bl}${s})"/>`;
    // a lit lobe on the light side (upper right in build space) and a cooler underside
    g += `<path d="${E.smooth(ell(add(c, [rr * 0.25, -rr * 0.2]), rr * 0.5, rr * 0.36, 0, 10))}" fill="#fff" opacity="${(a * 0.7).toFixed(2)}" filter="url(#${bl}${s})"/>`;
    g += `<path d="${E.smooth(ell(add(c, [-rr * 0.2, rr * 0.3]), rr * 0.55, rr * 0.25, 0, 10))}" fill="${P.steamS}" opacity="${(a * 0.5).toFixed(2)}" filter="url(#${bl}${s})"/>`;
  }
  f.raw(`<g>${g}</g>`);
  // inked curls: thin open hooks on the shadow side of the lumps, sparing
  const nc = o.curls ?? Math.max(2, Math.round(n * 0.6));
  for (let i = 0; i < nc; i++) {
    const t = 0.12 + (i / Math.max(1, nc)) * 0.7, c = add(sp(t), [(f.r() - 0.5) * w * 0.5, 0]), rr = w * (0.45 + t * (o.grow ?? 0.9)) * 0.9, a0 = R(f, 2.2, 3.6);
    const pts = []; for (let k = 0; k <= 9; k++) { const aa = a0 + k * 0.42, rk = rr * (1 - k * 0.07); pts.push(add(c, [Math.cos(aa) * rk, Math.sin(aa) * rk * 0.8])); }
    f.line(pts, o.curlW || 1.1, o.curlCol || '#8a7a80', { op: (o.curlOp ?? 0.55) * (1 - t * 0.6) });
  }
}
// a wisp: a single thin upward curling vapour stroke (fire's upward curl, rendered as steam)
function wisp(f, p0, h, o = {}) {
  const dir = o.dir ?? (f.r() > 0.5 ? 1 : -1), pts = [];
  for (let k = 0; k <= 8; k++) { const t = k / 8; pts.push(add(p0, [Math.sin(t * 4.2 + (o.ph || 0)) * h * 0.12 * dir + (o.drift || 0) * t, -h * t])); }
  f.raw(`<path d="${E.smooth(pts, false)}" fill="none" stroke="${P.steam}" stroke-width="${(o.w || 6) * 1.6}" stroke-linecap="round" opacity="${(o.op ?? 0.35) * 0.6}" filter="url(#steamblur${f.o.seed})"/>`);
  f.stroke(pts, o.w || 6, P.steam, { op: o.op ?? 0.35 });
  f.line(pts.slice(2), 0.8, '#8a7a80', { op: (o.op ?? 0.35) * 0.8 });
}

// ---- copper and metal wear ----
function verdigris(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = R(f, 2, 6); f.flat(ell(p, r * 1.3, r, f.r() * 3, 8), f.r() > 0.4 ? P.verd : P.verdL, { op: 0.75 }); if (f.r() > 0.5) f.stroke([p, add(p, [R(f, -1, 1), R(f, 6, 16)])], r * 0.7, P.verd, { op: 0.6 }); } }
function dents(f, c, rx, ry, n) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = R(f, 4, 9); f.flat(ell(p, r, r * 0.6, f.r() * 3, 10), '#000', { op: 0.22 }); f.line(ell(p, r, r * 0.6, 0, 10).slice(5, 9), 1, '#f0c09a', { op: 0.5 }); } }
function rivetRow(f, a, b, n, r = 2.6, col = '#9a7050') { for (let i = 0; i < n; i++) f.rivet(lerp(a, b, (i + 0.5) / n), r, col); }

// ---- limbs: the same whole-leg outline as kit_II (thigh to toes, soft knee and ankle), local copy ----
function fullLeg(f, Hp, Kn, A, dir, s, wH, wK, look, o = {}) {
  const gy = o.gy ?? f.o.groundY, ax = A[0], ay = A[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir * u * s;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d[1] * dir, -d[0] * dir]; };
  const nT = nrm(Hp, Kn), nS = nrm(Kn, A), nK = E.norm(add(nT, nS));
  const tq = o.thigh ?? 0.08, cf = o.calf ?? 0;
  const at = (t, off) => add(lerp(Kn, A, t), mul(nS, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    add(Hp, mul(nT, wH / 2)), add(lerp(Hp, Kn, 0.4), mul(nT, wH * 0.5 * (1 + tq))), add(lerp(Hp, Kn, 0.8), mul(nT, (wH + wK) * 0.25)),
    add(Kn, mul(nK, wK * 0.56)), at(0.18, wK * 0.46), at(0.45, wK * 0.4), at(0.72, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    at(0.72, -(wa * 0.62 + 2)), at(0.36, -wK * 0.5 * (1.18 + sw * 0.1 + cf)), at(0.12, -wK * 0.52), add(Kn, mul(nK, -wK * 0.5)),
    add(lerp(Hp, Kn, 0.6), mul(nT, -wH * 0.5 * (1 + tq * 0.6))), add(Hp, mul(nT, -wH / 2)),
  ];
  for (let i = 3; i >= 1; i--) { const tx = 1.0 - i * 0.075; f.part([[X(tx - 0.12), gy - h * (0.3 + i * 0.02)], [X(tx + 0.05), gy - h * (0.32 + i * 0.02)], [X(tx + 0.13), gy - h * 0.14], [X(tx + 0.1), gy - 1], [X(tx - 0.08), gy - 1]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.5, fill: mix(look.fill, '#1a1008', 0.2) })); }
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const dk = mix(look.fill, '#1a100a', 0.5), lt = mix(look.fill, '#fff', 0.3);
  f.line([add(Kn, mul(nK, wK * 0.5)), add(add(Kn, mul(nK, wK * 0.2)), mul(sub(A, Kn), 0.06)), add(add(Kn, mul(nK, wK * 0.45)), mul(sub(A, Kn), 0.14))], 1.2, INK, { op: 0.55 });
  f.line([add(Kn, mul(nK, -wK * 0.2)), add(add(Kn, mul(nK, -wK * 0.45)), mul(sub(Kn, Hp), -0.03))], 1, INK, { op: 0.5 });
  f.line([at(0.12, wK * 0.28), at(0.5, wK * 0.26), at(0.82, wa * 0.4)], 1, lt, { op: 0.5 });
  f.line([[X(-0.06), ay + h * 0.2], [X(0.05), ay + h * 0.12], [X(0.12), ay + h * 0.26]], 1.1, INK, { op: 0.5 });
  f.line([[X(-0.25), ay - h * 0.1], [X(-0.27), gy - h * 0.42]], 1, dk, { op: 0.7 });
  f.line([[X(0.36), ay + h * 0.36], [X(0.64), gy - h * 0.5], [X(0.9), gy - h * 0.38]], 1, lt, { op: 0.6 });
  f.part([[X(1.0), gy - h * 0.35], [X(1.13), gy - h * 0.3], [X(1.23), gy - h * 0.18], [X(1.24), gy - h * 0.07], [X(1.13), gy - h * 0.05], [X(1.03), gy - h * 0.15]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.4, cast: false, shade: 0.35 }));
  f.flat([[X(1.13), gy - h * 0.27], [X(1.21), gy - h * 0.19], [X(1.22), gy - h * 0.11], [X(1.14), gy - h * 0.15]], o.nail || mix(look.fill, '#e8e0cc', 0.5), { op: 0.9 });
  f.line([[X(0.92), gy - 2], [X(1.02), gy - h * 0.13]], 1, INK, { op: 0.6 });
  f.line([[X(-0.18), gy - 2], [X(0.06), gy - 2]], 1.6, dk, { op: 0.6, straight: true });
  return pts;
}

// a whole leg split for the rig: thigh / shin / foot, child copies on top, overlap disks at knee and ankle
function legRig(f, Hp, Kn, A, s, wH, wK, look, sfx, o = {}) {
  const dk = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  return split(f, () => fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o), [['thigh' + sfx, side(Kn, mul(dk, -1), wK * 0.6)], ['shin' + sfx, [side(Kn, dk, wK * 0.6), side(A, mul(da, -1), s * 0.34)]], ['foot' + sfx, side(A, da, s * 0.34)]]);
}
// a whole bare arm, shoulder to wrist, split at the elbow. ws: widths at shoulder, elbow, wrist
function armRig(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const de = elb(S0, E0, W0);
  return split(f, () => {
    const d = f.part(K.chain([S0, E0, W0], ws, { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
    // muscle line, elbow crease
    f.line([lp(S0, E0, 0.3, ws[0] * 0.15), lp(S0, E0, 0.85, ws[1] * 0.1)], 1.1, INK, { op: 0.4 });
    f.line([lp(E0, W0, 0.05, -ws[1] * 0.3), add(E0, mul(de, -ws[1] * 0.1)), lp(S0, E0, 0.92, -ws[1] * 0.3)], 1.2, INK, { op: 0.5 });
    if (o.after) o.after();
    return d;
  }, [['upperarm' + sfx, side(E0, mul(de, -1), ws[1] * 0.55)], ['forearm' + sfx, side(E0, de, ws[1] * 0.55)]]);
}
// standard humanoid skeleton. J: { P, T, N, SN, EN, WN, SF, EF, WF, HN, KN, AN, HF, KF, AF }
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  if (J.HN) f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  if (J.HF) f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
// two-bone IK: the elbow for a shoulder S reaching a wrist W with segment lengths l1, l2; sign picks the bend side
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), b = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], b + sign * a)), Wr];
}
// a lumpy outline: jitter every point outward/inward a little so soft bodies do not read as clean ellipses
function lumpy(f, pts, amp) { const c = pts.reduce((a, p) => add(a, mul(p, 1 / pts.length)), [0, 0]); return pts.map(p => { const d = E.norm(sub(p, c)), k = (f.r() - 0.4) * amp; return p[2] ? [...add(p, mul(d, k)), 1] : add(p, mul(d, k)); }); }
// a chain of oval links along a polyline
function chainLinks(f, pts, s, col = P.iron, o = {}) {
  let acc = 0; const seg = []; for (let i = 0; i < pts.length - 1; i++) { const l = E.len(sub(pts[i + 1], pts[i])); seg.push([pts[i], pts[i + 1], acc, l]); acc += l; }
  const n = Math.floor(acc / (s * 1.5));
  for (let k = 0; k <= n; k++) {
    const t = k * s * 1.5; const sg = seg.find(q => t <= q[2] + q[3] + 1e-6) || seg[seg.length - 1]; const c = lerp(sg[0], sg[1], Math.min(1, (t - sg[2]) / sg[3])), a = ang(sg[0], sg[1]);
    const e = ell(c, s, s * (k % 2 ? 0.28 : 0.55), a, 12);
    f.line(e.concat([e[0]]), o.w || 2.4, INK); f.line(e.concat([e[0]]), (o.w || 2.4) * 0.5, col);
    if (k % 2 === 0) f.line(e.slice(1, 4), 0.8, mix(col, '#fff', 0.5), { op: 0.8 });
  }
}
// a rope along a polyline with twist ticks
function rope(f, pts, w, col = '#9a8462', o = {}) {
  f.stroke(pts, w * 1.25, INK); f.stroke(pts, w, col);
  let acc = 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], l = E.len(sub(b, a)), n = Math.floor(l / (w * 0.9)); for (let k = 0; k < n; k++) { const c = lerp(a, b, (k + 0.5) / n), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; f.line([add(c, mul(nn, w * 0.45)), add(add(c, mul(nn, -w * 0.45)), mul(d, w * 0.5))], 0.8, INK, { op: 0.55, straight: true }); } acc += l; }
  if (o.fray) { const e = pts[pts.length - 1], d = E.norm(sub(e, pts[pts.length - 2])); for (let i = -1; i <= 1; i++) f.line([e, add(add(e, mul(d, w * 1.2)), mul([-d[1], d[0]], i * w * 0.5))], 1, col); }
}

// ---- independent review additions ----
// anatomical limb outline from explicit half-widths (local copy of kit_I_b's mlimb): P [[t, w, sharp?]] on the +normal
// side, Q on the -normal side, so bellies swell and joints narrow where the anatomy puts them.
function mlimb(a, b, Pw, Qw, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  const sd = (arr, sg) => arr.map(([t, w, sh]) => { const q = add(lerp(a, b, t), mul(n, sg * w)); return sh ? [...q, 1] : q; });
  const pp = sd(Pw, 1), qq = sd(Qw, -1), ck = o.capK ?? 0.75, out = [...pp];
  const wpB = Pw[Pw.length - 1][1], wqB = Qw[Qw.length - 1][1], cB = lerp(lerp(a, b, Pw[Pw.length - 1][0]), lerp(a, b, Qw[Qw.length - 1][0]), 0.5);
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(cB, add(mul(n, Math.cos(an) * w), mul(d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...qq.reverse());
  const wpA = Pw[0][1], wqA = Qw[0][1], cA = lerp(lerp(a, b, Pw[0][0]), lerp(a, b, Qw[0][0]), 0.5);
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(cA, add(mul(n, -Math.cos(an) * w), mul(d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
// one continuous outline through several joints (local copy of kit_I_b's mchain): the inside of each bend closes in a
// crease, the outside swells into the bony knob. J: joint points; profs: per segment [P, Q] half-width lists.
function mchain(J, profs, o = {}) {
  const segs = [];
  for (let s = 0; s < J.length - 1; s++) { const a = J[s], b = J[s + 1], d = E.norm(sub(b, a)); segs.push({ a, b, d, n: [-d[1], d[0]] }); }
  const Pp = [], Qp = [], trim = o.trim ?? 0.2;
  for (let s = 0; s < segs.length; s++) {
    const { a, b, n } = segs[s], [pp, qq] = profs[s];
    const inPrev = s > 0 ? segs[s - 1].inner : 0, inNext = s < segs.length - 1 ? ((segs[s + 1].d[0] * n[0] + segs[s + 1].d[1] * n[1]) > 0 ? 1 : -1) : 0;
    segs[s].inner = inNext;
    const keep = (t, sg) => (s === 0 || t >= (inPrev === sg ? trim : 0.06)) && (s === segs.length - 1 || t <= (inNext === sg ? 1 - trim : 0.94));
    for (const [t, w] of pp) if (keep(t, 1)) Pp.push(add(lerp(a, b, t), mul(n, w)));
    for (const [t, w] of qq) if (keep(t, -1)) Qp.push(add(lerp(a, b, t), mul(n, -w)));
    if (s < segs.length - 1) {
      const nx = segs[s + 1], bis = E.norm(add(n, nx.n)), wP = (pp[pp.length - 1][1] + profs[s + 1][0][0][1]) / 2, wQ = (qq[qq.length - 1][1] + profs[s + 1][1][0][1]) / 2;
      const kb = (o.knob ?? [])[s] ?? 1.12;
      if (inNext > 0) { Pp.push([...add(b, mul(bis, wP * 0.8)), 1]); Qp.push(add(b, mul(bis, -wQ * kb))); }
      else { Pp.push(add(b, mul(bis, wP * kb))); Qp.push([...add(b, mul(bis, -wQ * 0.8)), 1]); }
    }
  }
  const out = [...Pp], last = segs[segs.length - 1], first = segs[0], ck = o.capK ?? 0.7;
  const wpB = E.len(sub(Pp[Pp.length - 1], last.b)), wqB = E.len(sub(Qp[Qp.length - 1], last.b));
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(last.b, add(mul(last.n, Math.cos(an) * w), mul(last.d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...Qp.reverse());
  const wpA = E.len(sub(Pp[0], first.a)), wqA = E.len(sub(out[out.length - 1], first.a));
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(first.a, add(mul(first.n, -Math.cos(an) * w), mul(first.d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
// one crab leg segment (after kit_I_b's crabSeg, the reviewed Wreck Crab fix): a thick flattened tube flaring toward its
// distal socket, a lit ridge, a carina groove, spines on the leading edge, setae on the trailing edge, a pale membrane.
function crabSeg(f, a, b, wa, wb, look, o = {}) {
  const Pw = [[0, wa * 0.42], [0.2, wa * 0.52], [0.6, wb * 0.56], [0.88, wb * 0.62], [1, wb * 0.5]];
  const Qw = [[0, wa * 0.42], [0.25, wa * 0.48], [0.65, wb * 0.5], [0.9, wb * 0.56], [1, wb * 0.46]];
  const pts = mlimb(a, b, Pw, Qw, { capK: 0.5 });
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], dk = mix(look.fill, '#000', 0.5), lt = mix(look.fill, '#f8d8c0', 0.4);
  f.line([lp(a, b, 0.1, wa * 0.2), lp(a, b, 0.55, wb * 0.26), lp(a, b, 0.86, wb * 0.3)], 1.8, lt, { op: 0.6 });
  f.line([lp(a, b, 0.12, -wa * 0.18), lp(a, b, 0.8, -wb * 0.22)], 1.1, dk, { op: 0.5 });
  f.line([lp(a, b, 0.9, wb * 0.6), lp(a, b, 0.95, 0), lp(a, b, 0.9, -wb * 0.55)], 1.4, INK, { op: 0.7 });
  if (o.membrane !== false) f.flat(ell(lp(a, b, 0.97, -wb * 0.18), wb * 0.16, wb * 0.1, Math.atan2(d[1], d[0]), 8), o.memCol || mix(look.fill, '#e8a890', 0.45), { op: 0.7 });
  const sg = o.spineSide ?? 1, ns = o.spines ?? 3;
  for (let i = 0; i < ns; i++) {
    const t = 0.18 + i * 0.68 / Math.max(1, ns - 1), w = (wa + (wb - wa) * t) * 0.5, base = lp(a, b, t, sg * w * 0.95), L = w * (0.4 + f.r() * 0.25);
    const tip = add(base, add(mul(n, sg * L), mul(d, L * 0.9)));
    f.part([add(base, mul(d, -w * 0.22)), tip, add(base, mul(d, w * 0.2))], Object.assign({}, look, { inkW: 1, inkHeavy: 1.3, cast: false, k: 0.4, fill: mix(look.fill, '#f0d0b0', 0.3) }));
  }
  for (let i = 0; i < (o.hairs ?? 6); i++) {
    const t = 0.1 + f.r() * 0.8, w = (wa + (wb - wa) * t) * 0.5, base = lp(a, b, t, -sg * w * 0.9), L = w * (0.3 + f.r() * 0.35);
    f.line([base, add(base, add(mul(n, -sg * L), mul(d, L * 0.6)))], 0.9, INK, { op: 0.8 });
  }
  return pts;
}
// the dactyl: a curved, tapering last segment ending in a dark horn tip planted on the ground
function dactyl(f, a, tip, w, look, bend = 0.25) {
  const d = E.norm(sub(tip, a)), n = [-d[1], d[0]], L = E.len(sub(tip, a)), m = add(lerp(a, tip, 0.5), mul(n, L * bend * 0.3));
  const pts = [add(a, mul(n, w * 0.5)), add(m, mul(n, w * 0.36)), add(lerp(m, tip, 0.6), mul(n, w * 0.16)), [...tip, 1], add(lerp(m, tip, 0.6), mul(n, -w * 0.14)), add(m, mul(n, -w * 0.32)), add(a, mul(n, -w * 0.5))];
  f.part(pts, Object.assign({ k: 0.85 }, look));
  f.flat([add(lerp(m, tip, 0.45), mul(n, w * 0.2)), [...tip, 1], add(lerp(m, tip, 0.45), mul(n, -w * 0.18))], '#2a0e0a', { op: 0.85 });
  for (let i = 0; i < 4; i++) { const q = add(lerp(a, m, 0.2 + i * 0.2), mul(n, -w * 0.36)); f.line([q, add(q, add(mul(n, -w * 0.3), mul(d, w * 0.2)))], 0.9, INK, { op: 0.75 }); }
  f.line([add(a, mul(n, w * 0.22)), add(m, mul(n, w * 0.18)), add(lerp(m, tip, 0.5), mul(n, w * 0.06))], 1.3, mix(look.fill, '#f8d8c0', 0.4), { op: 0.55 });
  return pts;
}
// the back of a hand (the shared B.hand draws only a palm view). Same frame as B.hand: c is the middle of the hand, ang
// points from the wrist to the fingertips, s is scaled by 1.2. Thumb on the -v side (o.flip puts it on +v). Fingers are
// one soft outline each through their joints (not stacked capsules, which read as gauntlet lames), tapering, a little
// splayed and uneven; the back of the hand is a puffy tapered pad laid over their roots. Fat hands show dimples, not
// bony bumps, at the knuckles (o.lean draws knuckle heads and tendons instead). Small nails at the tips, joint creases,
// a vein, the wrist crease. o.curl bends the fingers down (draped over an edge or a belly).
function handBack(f, c, ang, s, col, o = {}) {
  s *= o.scale ?? 1.2;
  const fl = o.flip ? -1 : 1, F0 = frame(c, ang, s), F = pts => F0(pts.map(p => p[2] ? [p[0], p[1] * fl, 1] : [p[0], p[1] * fl]));
  const sh = o.shadow || mix(col, '#2a1020', 0.6), curl = o.curl ?? 0.25, spread = o.spread ?? 0.2, fat = o.fat ?? 1;
  const look = (x = {}) => Object.assign({ fill: col, shadow: sh, shade: 0.4, inkW: 1.3, inkHeavy: 2.2, cast: false, k: 0.9, tex: o.tex, texOp: o.texOp ?? 0.4, maxShade: s * 0.1 }, x);
  const dk = mix(col, '#1a0c10', 0.5), lt = mix(col, '#fff', 0.35), nail = o.nail || mix(col, '#efe2d6', 0.4);
  const chainF = (J, ws) => F(K.chain(J, ws, { steps: 5 }));
  // thumb: from the side of the wrist, one outline through its two joints, the nail on its top edge
  const tb = [-0.36, -0.34], tk = add(tb, rot([0.46, 0], -0.7)), tt = add(tk, rot([0.34, 0], -0.3 + curl * 0.6));
  f.part(chainF([add(tb, [-0.1, 0.06]), tk, tt], [0.46 * fat, 0.3 * fat, 0.22 * fat]), look());
  f.part(F(ell(lerp(tk, tt, 0.8), 0.075, 0.05, Math.atan2(tt[1] - tk[1], tt[0] - tk[0]), 10)), look({ fill: nail, inkW: 0.9, inkHeavy: 1.1, tex: null, shade: 0.3 }));
  f.line(F([add(tk, rot([0, -0.12 * fat], -0.7)), add(tk, rot([0, 0.12 * fat], -0.7))]), 1, dk, { op: 0.5 });
  // four fingers from the knuckle row
  const fingers = [[-0.28, 1.0, 0.25], [-0.07, 1.12, 0.26], [0.14, 1.06, 0.25], [0.33, 0.84, 0.21]], tips = [];
  fingers.forEach(([v, l, w0], i) => {
    const a = (i - 1.5) * spread * 0.35 + (f.r() - 0.5) * 0.08, base = [0.36, v];
    const k1 = add(base, rot([l * 0.5, 0], a)), k2 = add(k1, rot([l * 0.3, 0], a + curl * 0.8)), k3 = add(k2, rot([l * 0.24, 0], a + curl * 1.5));
    const w = w0 * fat;
    f.part(chainF([base, k1, k2, k3], [w * 1.08, w * 1.02, w * 0.9, w * 0.62]), look());
    const da = Math.atan2(k3[1] - k2[1], k3[0] - k2[0]), nc = add(k3, rot([-w * 0.28, 0], da));
    f.part(F([add(nc, rot([-w * 0.3, -w * 0.2], da)), add(nc, rot([w * 0.04, -w * 0.22], da)), add(nc, rot([w * 0.2, 0], da)), add(nc, rot([w * 0.04, w * 0.22], da)), add(nc, rot([-w * 0.3, w * 0.2], da))]), look({ fill: mix(nail, col, 0.35), inkW: 0.8, inkHeavy: 0.8, tex: null, shade: 0.3 })); // a small nail
    for (const [kk, n0] of [[k1, 2], [k2, 1]]) { const pa = Math.atan2(kk[1] - base[1], kk[0] - base[0]); for (let j = 0; j < n0; j++) f.line(F([add(kk, rot([j * 0.03, -w * 0.3], pa)), add(kk, rot([j * 0.03 + 0.02, 0], pa)), add(kk, rot([j * 0.03, w * 0.3], pa))]), 1, dk, { op: 0.45 }); } // joint creases
    tips.push(k3);
  });
  // the back of the hand: a puffy pad, narrow at the wrist and broad over the knuckles, laid over the finger roots
  f.part(F([[-0.62, -0.32], [-0.3, -0.42], [0.12, -0.44], [0.4, -0.38], [0.48, -0.18], [0.5, 0.06], [0.48, 0.28], [0.38, 0.44], [0.0, 0.46], [-0.36, 0.38], [-0.64, 0.28], [-0.7, 0.0]]), look({ shade: 0.36, cast: true, castOp: 0.3 }));
  if (o.lean) fingers.forEach(([v]) => { f.flat(F(ell([0.42, v], 0.08, 0.075, 0, 8)), lt, { op: 0.5 }); f.line(F([[-0.5, v * 0.4], [0.0, v * 0.75], [0.36, v]]), 1.1, lt, { op: 0.4 }); });
  else fingers.slice(0, 4).forEach(([v]) => { f.line(F([[0.4, v - 0.05], [0.43, v], [0.4, v + 0.05]]), 1.6, dk, { op: 0.6 }); f.line(F([[0.37, v - 0.04], [0.395, v + 0.01]]), 1, lt, { op: 0.5 }); }); // dimples over buried knuckles
  f.line(F([[-0.2, -0.3], [0.1, -0.2], [0.3, -0.24]]), 1.3, lt, { op: 0.4 }); // the soft swell of the back
  f.line(F([[-0.6, 0.16], [-0.3, 0.08], [-0.08, 0.2], [0.18, 0.14]]), 1.4, o.vein || mix(col, '#6a5a8a', 0.45), { op: 0.5 });
  f.line(F([[-0.72, -0.3], [-0.76, 0.0], [-0.72, 0.28]]), 1.4, dk, { op: 0.55 });
  return { F, tips: tips.map(t => F([t])[0]), fingers: fingers.map(([v]) => F([[0.36, v]])[0]) };
}
// leg anatomy over a fullLeg/legRig leg (independent review: legs read as tubes): the kneecap and its tendon, the inner
// thigh's teardrop, the calf belly swelling past the shin's outline, the shin bone's lit edge, the ankle knob and the
// Achilles tendon. dir +1 = toes to the right. Draws on the shin and foot bones of sfx (thigh details on the thigh).
function legDetail(f, Hp, Kn, A, wK, look, sfx, o = {}) {
  const dir = o.dir ?? 1, nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d[1] * dir, -d[0] * dir]; };
  const nT = nrm(Hp, Kn), nS = nrm(Kn, A), nK = E.norm(add(nT, nS)), dS = E.norm(sub(A, Kn)), dT = E.norm(sub(Kn, Hp));
  const dk = mix(look.fill, '#1a0a0a', 0.55), lt = mix(look.fill, '#fff', 0.32), sh = look.shadow || dk;
  f.bone('thigh' + sfx);
  // the quadriceps' inner teardrop above the knee and the outer quad's line
  const q0 = add(Kn, add(mul(nK, wK * 0.22), mul(dT, -wK * 0.6)));
  f.line([add(q0, mul(dT, -wK * 0.5)), add(q0, mul(nT, -wK * 0.12)), add(add(Kn, mul(nK, wK * 0.05)), mul(dT, -wK * 0.18))], 1.6, dk, { op: 0.55 });
  f.line([add(Hp, mul(nT, wK * 0.3)), add(lerp(Hp, Kn, 0.55), mul(nT, wK * 0.42)), add(Kn, add(mul(nK, wK * 0.44), mul(dT, -wK * 0.3)))], 1.4, lt, { op: 0.45 });
  f.bone('shin' + sfx);
  // calf belly: swells out behind the shin from just under the knee to about mid-shin
  const back = t => add(lerp(Kn, A, t), mul(nS, -wK * 0.44));
  const calf = [add(Kn, mul(nS, -wK * 0.3)), add(back(0.1), mul(nS, -wK * (0.1 + (o.calf ?? 0.12)))), add(back(0.3), mul(nS, -wK * (0.14 + (o.calf ?? 0.12)))), add(back(0.5), mul(nS, -wK * 0.04)), [...back(0.66), 1], add(lerp(Kn, A, 0.6), mul(nS, -wK * 0.12)), add(lerp(Kn, A, 0.25), mul(nS, -wK * 0.06))];
  f.part(calf, Object.assign({}, look, { cast: false, inkW: 0, inkHeavy: 0, k: 0.9, maxShade: wK * 0.16 }));
  f.line(calf.slice(0, 5), 1.8, INK, { op: 0.9 }); // only the calf's outer contour is inked; it melts into the shin inside
  f.line([add(lerp(Kn, A, 0.12), mul(nS, -wK * 0.05)), add(lerp(Kn, A, 0.4), mul(nS, -wK * 0.1)), add(lerp(Kn, A, 0.62), mul(nS, -wK * 0.2))], 1.4, dk, { op: 0.5 }); // the groove between calf and shin bone
  // kneecap and patellar tendon on the front of the knee
  const kc = add(Kn, mul(nK, wK * 0.3)), ka = Math.atan2(dS[1], dS[0]);
  // the kneecap as a lit plane with a crease under it, not a disc
  f.flat([add(kc, rot([-wK * 0.2, -wK * 0.1], ka)), add(kc, rot([-wK * 0.04, -wK * 0.17], ka)), add(kc, rot([wK * 0.14, -wK * 0.12], ka)), add(kc, rot([wK * 0.18, wK * 0.02], ka)), add(kc, rot([wK * 0.02, wK * 0.08], ka)), add(kc, rot([-wK * 0.16, wK * 0.04], ka))], lt, { op: 0.4 });
  f.line([add(kc, rot([wK * 0.12, -wK * 0.14], ka)), add(kc, rot([wK * 0.2, 0], ka)), add(kc, rot([wK * 0.12, wK * 0.1], ka))], 1.6, dk, { op: 0.5 });
  f.line([add(kc, rot([wK * 0.24, -wK * 0.04], ka)), add(lerp(Kn, A, 0.18), mul(nS, wK * 0.26))], 1.3, dk, { op: 0.4 }); // the patellar tendon
  // the hamstring tendons behind the knee, the shin bone's lit edge
  f.line([add(Kn, add(mul(nK, -wK * 0.34), mul(dT, -wK * 0.4))), add(Kn, mul(nK, -wK * 0.38))], 1.3, sh, { op: 0.6 });
  f.line([add(lerp(Kn, A, 0.2), mul(nS, wK * 0.34)), add(lerp(Kn, A, 0.55), mul(nS, wK * 0.3)), add(lerp(Kn, A, 0.85), mul(nS, wK * 0.22))], 2, lt, { op: 0.55 });
  // the ankle: a knob of bone and the Achilles tendon running down to the heel
  f.bone('foot' + sfx);
  const an = add(lerp(Kn, A, 0.97), mul(nS, wK * 0.02));
  f.flat(ell(an, wK * 0.12, wK * 0.1, 0, 10), lt, { op: 0.5 }); f.line(ell(an, wK * 0.13, wK * 0.11, 0, 10).slice(3, 8), 1, dk, { op: 0.5 });
  f.line([add(lerp(Kn, A, 0.78), mul(nS, -wK * 0.3)), add(A, mul(nS, -wK * 0.32)), add(A, add(mul(nS, -wK * 0.36), mul(dS, wK * 0.22)))], 1.6, dk, { op: 0.5 });
}

module.exports = { mlimb, mchain, crabSeg, dactyl, handBack, legDetail, P, base, textures, SKP, SKR, SKW, LIN, COP, MAR, R, scatter, D, ang, elb, blister, blisters, peelSheet, scald, flakes, wrinkles, seam, beads, drip, sheen, steam, wisp, verdigris, dents, rivetRow, fullLeg, legRig, armRig, humanJoints, ik, lumpy, chainLinks, rope, split, side };
