// World II, The Rotmire (Toxin + Water): shared helpers for world_II.js.
// Toxin ripens (swelling, blisters, moss, fungus, fruiting bodies, peeling); water preserves (bog-tanned leather skin,
// stained brown, wrinkled, flattened by peat). Never slime puddles, never neon green glow, never fish faces.
// Palette: peat brown, bile green, lantern amber (the only warm note), plus ink black, bone and grey.
// All helpers draw into the current bone.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell } = E;

const P = {
  peat: '#4a3626', peatD: '#2c2018', peatL: '#6e5640', mud: '#3a2c1c',
  tan: '#7a5434', tanD: '#3e2820', tanL: '#9c7248', tanS: '#3a2622', // bog-tanned leather skin and its shadow
  bile: '#8a963c', bileD: '#56602a', bileL: '#b2b86a', bileP: '#c4c47a', // bile green: olive, never neon
  moss: '#4c5628', mossD: '#2c3416', mossL: '#6e7836', mossY: '#878a44',
  amber: '#c08a3c', amberD: '#7e5222', amberL: '#e0b468', // lantern light, dull
  water: '#0b0d09', waterM: '#171a13', waterL: '#3c3e2c', scum: '#3e4226',
  reed: '#7a7044', reedD: '#4a4428', reedL: '#a39a62', cattail: '#4a2e1c',
  bone: '#d6cdb8', boneD: '#9a917e', grey: '#77736a', greyD: '#4e4b45', iron: '#3a3632', ironL: '#605a52',
  rust: '#7a3c20', hairRed: '#7a3a20', // bog-dyed hair
  hag: '#a39478', hagS: '#58463e', hagL: '#c4b498', // fenfolk skin, sallow
  wool: '#5e4a36', woolD: '#3e3024', woolL: '#7e6648', sack: '#6e6046', rope: '#8a7650', ropeD: '#5a4a30',
  cap: '#8a6a40', capL: '#b0905a', gill: '#d0bf98', // toadstool caps: peat-ochre with bone spots
  glass: '#5a3a1c', glassL: '#9a6a34', glassD: '#2a1a0c', leech: '#15130e', leechL: '#4e5040', leechS: '#8a8a70',
  wood: '#4a3a26', woodD: '#2e2418', woodL: '#6e5a3e',
};

// the world's render setup: kit.foeBase with a peat-brown mud and a warm-brown shadow tint; ground = canvas h - 30
const base = (seed, h, o = {}) => K.foeBase(seed, Object.assign({ groundY: h - 30, grimeY: h - 30 - 230, shadowTint: '#241c1c', mud: '#2a2014' }, o));

// texture patterns for one figure (call once after the Fig is made)
function textures(f) {
  const s = f.o.seed;
  // moss: short tufts in two greens, scattered; reads as a living fuzz over a fill
  let m = '';
  const r = E.rng(s * 7 + 1);
  for (let i = 0; i < 46; i++) {
    const x = r() * 40, y = r() * 40, a = -1.2 - r() * 0.8, l = 2.5 + r() * 3.5, c = r() > 0.5 ? P.mossL : P.mossD;
    m += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}" stroke="${c}" stroke-width="1.3" stroke-linecap="round" opacity="0.85"/>`;
  }
  f.defs.push(`<pattern id="moss${s}" patternUnits="userSpaceOnUse" width="40" height="40">${m}</pattern>`);
  // wrinkle: fine creases for bog-tanned leather skin
  let w = '';
  for (let i = 0; i < 16; i++) { const x = r() * 36, y = r() * 36, l = 5 + r() * 7, bend = (r() - 0.5) * 4; w += `<path d="M${x.toFixed(1)},${y.toFixed(1)} q${(l / 2).toFixed(1)},${bend.toFixed(1)} ${l.toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>`; }
  f.defs.push(`<pattern id="wrinkle${s}" patternUnits="userSpaceOnUse" width="36" height="36" patternTransform="rotate(-12)">${w}</pattern>`);
  // bark: horizontal wavy grain with splits, for the lurker's log back and wooden things lying down
  f.defs.push(`<pattern id="bark${s}" patternUnits="userSpaceOnUse" width="90" height="12"><path d="M0,3 q22,3 45,0 t45,0 M0,8 q30,-3 60,1 t30,-1" fill="none" stroke="${INK}" stroke-width="1.1" opacity="0.8"/><path d="M20,5 l14,0.6 M62,10 l10,-0.4" stroke="${INK}" stroke-width="2" opacity="0.7"/></pattern>`);
  // peat: a fibrous cut-turf texture (short bars and specks)
  let p = '';
  for (let i = 0; i < 30; i++) { const x = r() * 30, y = r() * 30; p += `<path d="M${x.toFixed(1)},${y.toFixed(1)} l${(3 + r() * 5).toFixed(1)},${((r() - 0.5) * 2).toFixed(1)}" stroke="${r() > 0.6 ? '#7a6248' : INK}" stroke-width="1" opacity="0.6"/>`; }
  f.defs.push(`<pattern id="peat${s}" patternUnits="userSpaceOnUse" width="30" height="30">${p}</pattern>`);
  // leather: a crackle of fine splits with a lit lip, for bog-tanned skin (independent review)
  let lc = ''; const N = 5, T = 60, pt = [];
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) pt.push([i * T / N + (i % N ? (r() - 0.5) * 8 : 0), j * T / N + (j % N ? (r() - 0.5) * 8 : 0)]);
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) for (const [di, dj] of [[1, 0], [0, 1]]) { if (i + di > N || j + dj > N || r() < 0.4) continue; const a = pt[j * (N + 1) + i], b = pt[(j + dj) * (N + 1) + i + di]; lc += `<path d="M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}" stroke="${INK}" stroke-width="0.9" opacity="0.55"/><path d="M${(a[0] - 0.6).toFixed(1)},${(a[1] + 1).toFixed(1)} L${(b[0] - 0.6).toFixed(1)},${(b[1] + 1).toFixed(1)}" stroke="#c8a070" stroke-width="0.6" opacity="0.35"/>`; }
  f.defs.push(`<pattern id="leather${s}" patternUnits="userSpaceOnUse" width="${T}" height="${T}" patternTransform="rotate(-10)">${lc}</pattern>`);
}

const SKT = (f, o = {}) => Object.assign({ fill: P.tan, shadow: P.tanS, shade: 0.34, tex: 'wrinkle' + f.o.seed, texOp: 0.7 }, o); // bog leather
const SKH = (f, o = {}) => Object.assign({ fill: P.hag, shadow: P.hagS, shade: 0.32, tex: 'mottle' + f.o.seed, texOp: 0.55 }, o); // fenfolk skin
const rnd = (f, a, b) => a + (b - a) * f.r();
const scatter = (f, c, rx, ry) => add(c, [(f.r() - 0.5) * rx * 2, (f.r() - 0.5) * ry * 2]);

// a pustule: a swollen bile-green blister with a tight shine and a dark rim; burst ones are craters with a crust
function pustule(f, c, r, o = {}) {
  if (o.burst) {
    f.part(ell(c, r * 1.1, r * 0.8, o.ang || 0, 12), { fill: mix(P.bileD, P.tan, 0.3), shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
    f.flat(ell(add(c, [r * 0.1, r * 0.1]), r * 0.6, r * 0.4, o.ang || 0, 10), '#1e1a10', { op: 0.85 });
    f.flat(ell(add(c, [-r * 0.5, -r * 0.3]), r * 0.25, r * 0.15, 0, 6), P.bileP, { op: 0.6 });
    return;
  }
  f.part(ell(add(c, [0, r * 0.15]), r * 1.25, r * 0.55, o.ang || 0, 12), { fill: mix(P.bileD, '#3a2a1a', 0.3), shade: 0.3, inkW: 0, cast: false, hatch: false }); // inflamed base
  f.part(ell(c, r, r * 0.88, o.ang || 0, 14), { fill: o.col || P.bile, shade: 0.42, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false, shadow: P.bileD });
  f.flat(ell(add(c, [r * 0.3, -r * 0.32]), r * 0.3, r * 0.2, -0.6, 8), '#f2ecc8', { op: 0.8 }); // tight shine toward the key light (foes are mirrored: +x is the lit side)
  f.flat(ell(add(c, [-r * 0.2, r * 0.25]), r * 0.18, r * 0.12, 0, 6), P.bileD, { op: 0.6 }); // a dark core showing through
}
function pustules(f, c, rx, ry, n, r0, r1, o = {}) {
  const pts = []; for (let i = 0; i < n; i++) pts.push([scatter(f, c, rx, ry), rnd(f, r0, r1), f.r() < (o.burst ?? 0.2)]);
  pts.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r, b]) => pustule(f, p, r, { burst: b }));
}
// warts: low lumps with a lit cap, for toad hide and hag skin
function warts(f, c, rx, ry, n, r0, r1, col) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), r = rnd(f, r0, r1);
    f.part(ell(p, r, r * 0.8, f.r() * 3, 9), { fill: col, shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, hatch: false });
    f.flat(ell(add(p, [r * 0.3, -r * 0.3]), r * 0.35, r * 0.25, 0, 6), '#fff', { op: 0.22 });
  }
}
// a toadstool: stem, domed cap with an underside of gills and bone-pale scales. base on the host, ang = growth direction
function toadstool(f, b, ang, s, o = {}) {
  const d = rot([1, 0], ang), n = [-d[1], d[0]], top = add(b, mul(d, s));
  const capC = add(top, mul(d, s * 0.12)), capCol = o.cap || P.cap;
  f.part(limb(b, top, s * 0.26, s * 0.2, { steps: 5, capK: 0.6, p: [[0.2, 0.2, 0.2]] }), { fill: o.stem || P.gill, shade: 0.45, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false });
  f.line([lp(b, top, 0.15, s * 0.04), lp(b, top, 0.9, s * 0.03)], 0.9, INK, { op: 0.4 });
  // gill skirt under the cap
  f.part([add(capC, mul(n, s * 0.55)), add(add(capC, mul(n, s * 0.5)), mul(d, -s * 0.12)), add(capC, mul(d, -s * 0.16)), add(add(capC, mul(n, -s * 0.5)), mul(d, -s * 0.12)), add(capC, mul(n, -s * 0.55))], { fill: P.gill, shade: 0.5, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
  for (let i = -3; i <= 3; i++) f.line([add(capC, mul(n, i * s * 0.07)), add(add(capC, mul(n, i * s * 0.12)), mul(d, -s * 0.1))], 0.8, INK, { op: 0.5 });
  // cap
  const cap = [add(capC, mul(n, s * 0.6)), add(add(capC, mul(n, s * 0.52)), mul(d, s * 0.22)), add(add(capC, mul(n, s * 0.22)), mul(d, s * 0.42)), add(capC, mul(d, s * 0.46)), add(add(capC, mul(n, -s * 0.24)), mul(d, s * 0.4)), add(add(capC, mul(n, -s * 0.52)), mul(d, s * 0.2)), add(capC, mul(n, -s * 0.6))];
  f.part(cap, { fill: capCol, shade: 0.45, inkW: 1.1, inkHeavy: 1.9, cast: false, k: 0.9 });
  if (o.spots !== false) for (let i = 0; i < 4; i++) { const q = add(add(capC, mul(n, (f.r() - 0.5) * s * 0.8)), mul(d, s * (0.12 + f.r() * 0.22))); f.flat(ell(q, s * 0.05, s * 0.035, ang, 6), P.bone, { op: 0.75 }); }
  f.line([add(add(capC, mul(n, s * 0.45)), mul(d, s * 0.25)), add(add(capC, mul(n, s * 0.1)), mul(d, s * 0.42))], 1, mix(capCol, '#fff', 0.4), { op: 0.6 });
}
// a cluster of toadstools fanning out from a point
function toadstools(f, b, ang, s, n, o = {}) {
  const list = [];
  for (let i = 0; i < n; i++) list.push([add(b, rot([(f.r() - 0.5) * s * 0.9, (f.r() - 0.5) * s * 0.4], ang)), ang + (i - (n - 1) / 2) * 0.35 + (f.r() - 0.5) * 0.2, s * (0.55 + f.r() * 0.5)]);
  list.sort((a, c) => a[2] - c[2]).forEach(([p, a, ss]) => toadstool(f, p, a, ss, o));
}
// bracket fungus: stacked half-shelves growing out of a surface at c, shelf facing dir (screen angle of the shelf's outward normal)
function bracket(f, c, ang, s, n = 3, col = P.capL) {
  for (let i = n - 1; i >= 0; i--) {
    const q = add(c, rot([0, (i - (n - 1) / 2) * s * 0.42], ang)), w = s * (1 - Math.abs(i - (n - 1) / 2) * 0.22);
    const F = E.frame(q, ang, 1);
    f.part(F([[0, -w * 0.5], [w * 0.4, -w * 0.42], [w * 0.62, -w * 0.12], [w * 0.6, w * 0.08], [w * 0.36, w * 0.14], [0, w * 0.12]]), { fill: mix(col, P.peat, i * 0.15), shade: 0.45, inkW: 1, inkHeavy: 1.6, cast: false, hatch: false });
    f.line(F([[w * 0.06, -w * 0.3], [w * 0.4, -w * 0.25], [w * 0.55, -w * 0.06]]), 0.9, mix(col, '#000', 0.4), { op: 0.6 });
    f.line(F([[w * 0.02, w * 0.1], [w * 0.36, w * 0.12], [w * 0.58, w * 0.06]]), 1.3, P.bone, { op: 0.5 });
  }
}
// moss clump: a low mound of tufts over a surface. Stays inside the silhouette: keep it on the body, not on the edge.
function mossClump(f, c, rx, ry, o = {}) {
  const pts = ell(c, rx, ry, o.ang || 0, 14).map((p, i) => i % 2 ? add(p, [(f.r() - 0.5) * rx * 0.25, (f.r() - 0.5) * ry * 0.3]) : p);
  f.part(pts, { fill: o.col || P.moss, shadow: P.mossD, shade: 0.4, tex: 'moss' + f.o.seed, texOp: 0.9, inkW: 1.1, inkHeavy: 1.8, cast: o.cast ?? false, k: 0.8 });
  for (let i = 0; i < Math.max(3, Math.round(rx / 5)); i++) { const p = scatter(f, add(c, [0, -ry * 0.2]), rx * 0.8, ry * 0.5), a = -1.3 + (f.r() - 0.5) * 0.9; f.line([p, add(p, rot([4 + f.r() * 4, 0], a))], 1.2, P.mossY, { op: 0.75 }); }
}
// a reed: tapered stalk with nodes, optional cattail head and a bent leaf blade. pts: polyline base to tip
function reed(f, pts, w, o = {}) {
  f.stroke(pts, w, o.col || P.reed);
  f.line(pts.slice(0, -1).map(q => add(q, [w * 0.2, 0])), Math.max(0.8, w * 0.15), P.reedL, { op: 0.6 });
  if (o.nodes !== false) for (let t = 0.25; t < 0.9; t += 0.22) { const i = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1))), q = lerp(pts[i], pts[i + 1], t * (pts.length - 1) - i); f.line([add(q, [-w * 0.45, 0]), add(q, [w * 0.45, -1])], 1, INK, { op: 0.5, straight: true }); }
  if (o.cattail) { const a = pts[pts.length - 2], b = pts[pts.length - 1], c = lerp(a, b, 0.35), d = E.norm(sub(b, a)); f.part(limb(add(c, mul(d, -w * 2.4)), add(c, mul(d, w * 2.4)), w * 2.2, w * 2.1, { steps: 5, capK: 1 }), { fill: P.cattail, shade: 0.45, inkW: 1.1, inkHeavy: 1.8, cast: false, tex: 'peat' + f.o.seed, texOp: 0.4 }); }
  if (o.leaf) { const [i, dx, l] = o.leaf, q = pts[i]; f.stroke([q, add(q, [dx * 0.5, -l * 0.4]), add(q, [dx, -l * 0.2]), add(q, [dx * 1.3, l * 0.3])], w * 1.6, o.leafCol || P.reedD); }
}
// a twisted rope or cord along pts with twist ticks; ends fray if o.fray
function rope(f, pts, w, o = {}) {
  const col = o.col || P.rope;
  f.line(pts, w + 2.2, INK, { k: o.k });
  f.line(pts, w, col, { k: o.k });
  f.line(pts.map(q => add(q, [-w * 0.18, -w * 0.18])), Math.max(0.7, w * 0.22), mix(col, '#fff', 0.35), { op: 0.6, k: o.k });
  // twist ticks
  const n = pts.length; let acc = 0;
  for (let i = 0; i < n - 1; i++) { const a = pts[i], b = pts[i + 1], L = E.len(sub(b, a)), d = E.norm(sub(b, a)), nn = [-d[1], d[0]]; for (let t = (acc % (w * 1.4)); t < L; t += w * 1.4) { const q = add(a, mul(d, t)); f.line([add(q, mul(nn, w * 0.5)), add(add(q, mul(nn, -w * 0.5)), mul(d, w * 0.6))], 0.9, INK, { op: 0.65, straight: true }); } acc += L; }
  if (o.fray) { const e = pts[n - 1], d = E.norm(sub(e, pts[n - 2])); for (let k = -2; k <= 2; k++) f.line([e, add(e, rot(mul(d, w * 1.6 + f.r() * w), k * 0.28))], 0.9, col, { op: 0.9 }); }
}
// a fen lantern: iron frame, horn panes glowing dull amber, a peaked cap and a ring. top = ring point, s ~ body height
function lantern(f, top, s, o = {}) {
  const ang = o.ang || 0, F = E.frame(top, ang, s);
  if (o.glow !== false) f.raw(`<ellipse cx="${F([[0, 0.75]])[0][0].toFixed(1)}" cy="${F([[0, 0.75]])[0][1].toFixed(1)}" rx="${(s * 0.95).toFixed(1)}" ry="${(s * 0.85).toFixed(1)}" fill="${P.amberL}" opacity="${o.glowOp ?? 0.14}" filter="url(#soft${f.o.seed})"/>`);
  f.line(E.ell(F([[0, 0.02]])[0], s * 0.08, s * 0.1, 0, 10).concat([E.ell(F([[0, 0.02]])[0], s * 0.08, s * 0.1, 0, 10)[0]]), Math.max(1.6, s * 0.035), INK);
  f.part(F([[-0.1, 0.1], [0.1, 0.1], [0.36, 0.3, 1], [0.38, 0.36, 1], [-0.38, 0.36, 1], [-0.36, 0.3, 1]]), { fill: P.iron, shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false });
  // horn panes, glowing dull amber, smoky at the top
  f.part(F([[-0.3, 0.36, 1], [0.3, 0.36, 1], [0.32, 1.06, 1], [-0.32, 1.06, 1]]), { fill: P.amber, shade: 0.25, light: P.amberL, shadow: P.amberD, inkW: 1.1, inkHeavy: 1.4, cast: false, hatch: false, gritOp: 0.35 });
  f.flat(F([[-0.3, 0.36], [0.3, 0.36], [0.31, 0.52], [-0.31, 0.52]]), '#3a2410', { op: 0.55 }); // soot
  f.flat(F(E.ell([0.02, 0.78], 0.07, 0.14, 0, 8)), '#f4d898', { op: 0.85 }); // the flame, small and dull
  f.flat(F(E.ell([0.02, 0.84], 0.04, 0.06, 0, 6)), '#fff2c8', { op: 0.8 });
  // iron cage bars and base
  for (const x of [-0.31, 0.0, 0.31]) f.line(F([[x, 0.36], [x * 1.03, 1.06]]), Math.max(1.4, s * 0.045), P.iron, { straight: true });
  f.part(F([[-0.38, 1.04, 1], [0.38, 1.04, 1], [0.34, 1.16, 1], [-0.34, 1.16, 1]]), { fill: P.iron, shade: 0.4, inkW: 1.1, inkHeavy: 1.6, cast: false, sharp: true });
  f.line(F([[-0.3, 0.42], [-0.32, 1.0]]), 1, P.amberL, { op: 0.5 });
  f.flat(F([[0.12, 0.6], [0.24, 0.66], [0.2, 0.74]]), '#3a2410', { op: 0.5 }); // a cracked pane
  return F([[0, 1.16]])[0];
}
// a dried frog charm: flattened, splayed, leathery, tied by a leg
function driedFrog(f, c, s, ang = 0) {
  const F = E.frame(c, ang, s);
  f.part(F([[0, -0.5], [0.22, -0.42], [0.3, -0.1], [0.24, 0.3], [0, 0.4], [-0.24, 0.3], [-0.3, -0.1], [-0.22, -0.42]]), { fill: mix(P.tan, P.bileD, 0.35), shadow: P.tanS, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
  for (const sx of [-1, 1]) {
    f.stroke(F([[sx * 0.2, 0.25], [sx * 0.45, 0.45], [sx * 0.38, 0.75]]), s * 0.09, mix(P.tan, '#000', 0.25));
    f.stroke(F([[sx * 0.2, -0.3], [sx * 0.42, -0.4], [sx * 0.5, -0.62]]), s * 0.08, mix(P.tan, '#000', 0.25));
  }
  f.flat(F(E.ell([-0.1, -0.34], 0.05, 0.04, 0, 6)), INK); f.flat(F(E.ell([0.1, -0.34], 0.05, 0.04, 0, 6)), INK);
  f.line(F([[-0.1, -0.05], [0.1, 0.0], [0.0, 0.2]]), 0.8, INK, { op: 0.5 });
}
// a small bone (finger or bird bone) charm on a cord
function boneCharm(f, a, b, w) {
  f.part(limb(a, b, w, w * 0.8, { steps: 4, capK: 1, p: [[0.0, 0.35, 0.12], [1.0, 0.3, 0.12]], q: [[0.0, 0.35, 0.12], [1.0, 0.3, 0.12]] }), { fill: P.bone, shadow: P.boneD, shade: 0.4, inkW: 1, inkHeavy: 1.5, cast: false, hatch: false });
  f.line([lp(a, b, 0.3, 0), lp(a, b, 0.7, 0)], 0.8, P.boneD, { op: 0.6 });
}
// a twine bundle (herbs bound with cord): a sheaf of stems, a binding, frayed heads
function herbBundle(f, top, ang, s) {
  const d = rot([0, 1], ang);
  for (let i = -3; i <= 3; i++) { const a = add(top, rot([i * s * 0.05, 0], ang)), b = add(add(top, mul(d, s)), rot([i * s * 0.09, 0], ang)); f.line([a, b], 2, i % 2 ? P.reedD : P.mossL); }
  for (let i = 0; i < 6; i++) { const q = add(add(top, mul(d, s * (0.85 + f.r() * 0.2))), rot([(f.r() - 0.5) * s * 0.5, 0], ang)); f.flat(E.ell(q, 3, 2, f.r() * 3, 6), f.r() > 0.5 ? P.mossY : P.boneD, { op: 0.9 }); }
  const bi = add(top, mul(d, s * 0.2)); f.part(E.ell(bi, s * 0.14, s * 0.06, ang, 8), { fill: P.rope, shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
}
// foul drips: a bead of bile-brown liquid falling from p
function drip(f, p, s = 1, col = P.bileD) { f.flat([add(p, [-1.8 * s, 0]), add(p, [1.8 * s, 0]), add(p, [0, 8 * s])], col, { op: 0.85 }); f.flat(E.ell(add(p, [0, 13 * s]), 2.2 * s, 3.4 * s, 0, 6), col, { op: 0.85 }); f.flat(E.ell(add(p, [0.6 * s, 12 * s]), 0.7 * s, 1 * s, 0, 5), '#e8e4c0', { op: 0.6 }); }
// rising bubbles: hollow rings with a glint, in bog-water tones
function bubbles(f, p, n, spread = 30, rise = 120, s = 1) { for (let i = 0; i < n; i++) { const q = add(p, [(f.r() - 0.5) * spread + Math.sin(i * 1.7) * 6 * s, -i * rise / n - f.r() * 10]), r = (2 + f.r() * 4 + (n - i) * 0.4) * s; const e = E.ell(q, r, r, 0, 10); f.line(e.concat([e[0]]), 1 + s * 0.4, '#a8a47a', { op: 0.75 }); f.flat(E.ell(add(q, [r * 0.35, -r * 0.35]), r * 0.25, r * 0.25, 0, 6), '#eee8c8', { op: 0.8 }); } }
// a wound closing with green growth: a dark gash, raw lips, and moss and pale shoots knitting across it
function knitWound(f, a, b, w) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], m = lerp(a, b, 0.5);
  f.flat([a, add(m, mul(n, w)), b, add(m, mul(n, -w * 0.8))], '#3a1410', { op: 0.95 });
  f.flat([lerp(a, b, 0.1), add(m, mul(n, w * 0.45)), lerp(a, b, 0.9), add(m, mul(n, -w * 0.3))], '#120806');
  f.line([a, add(m, mul(n, w)), b], 1.4, '#8a4a36', { op: 0.8 });
  for (let t = 0.15; t < 0.9; t += 0.14) { const q = lerp(a, b, t); f.line([add(q, mul(n, -w * 0.9)), add(add(q, mul(n, w * 0.1)), mul(d, 3)), add(q, mul(n, w * 1.0))], 1.6, t % 0.28 < 0.14 ? P.mossL : P.bileL, { op: 0.9 }); }
  f.flat(E.ell(add(lerp(a, b, 0.75), mul(n, w * 0.2)), w * 0.6, w * 0.5, 0, 8), P.mossL, { op: 0.8 });
}
// mud splashes and clods stuck on a surface
function mudSplats(f, c, rx, ry, n, col = P.mud) { for (let i = 0; i < n; i++) { const p = scatter(f, c, rx, ry), r = 2 + f.r() * 6; f.flat(E.ell(p, r * 1.4, r, f.r() * 3, 8), col, { op: 0.8 }); if (f.r() > 0.6) f.flat(E.ell(add(p, [0, r + 3]), r * 0.4, r * 0.7, 0, 6), col, { op: 0.7 }); } }
// a ragged fringe of torn cloth strips hanging from a hem: pts along the hem, strips fall plumb
function fringe(f, pts, len, w, col, o = {}) {
  for (let i = 0; i < pts.length; i++) { const p = pts[i], l = len * (0.5 + f.r() * 0.7), sw = (f.r() - 0.5) * 6; f.part([add(p, [-w / 2, -3]), add(p, [w / 2, -3]), add(p, [w * 0.35 + sw, l * 0.7]), [...add(p, [sw * 1.2, l]), 1], add(p, [-w * 0.4 + sw, l * 0.75])], { fill: mix(col, '#000', f.r() * 0.2), shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, tex: o.tex, texOp: 0.4 }); }
}
// a ripple ring on black water
function ripples(f, c, rx, ry, n, col = '#6a6a4a', op = 0.4) { for (let i = 0; i < n; i++) { const k = 1 + i * 0.3, e = E.ell(c, rx * k, ry * k, 0, 28), s0 = Math.floor(f.r() * 8), seg = e.slice(s0, s0 + 12 + Math.floor(f.r() * 8)); f.line(seg, 1.4, col, { op: op * (1 - i / (n + 1)) }); } }

// a whole bare leg in one outline, hip to toes (thigh, knee, calf, ankle, heel, arch, toes), so the knee and ankle are
// soft bends, not cut tubes. Same foot as kit.bareLeg. dir +1 = toes right. wH/wK: width at hip and knee; s: foot unit.
// o.thigh: bulge of the thigh front (quad) and back (hamstring); o.swell puffs ankle and instep. Returns the outline.
function fullLeg(f, Hp, Kn, A, dir, s, wH, wK, look, o = {}) {
  const gy = f.o.groundY, ax = A[0], ay = A[1], h = gy - ay, sw = o.swell ?? 0, X = u => ax + dir * u * s;
  const nrm = (a, b) => { const d = E.norm(sub(b, a)); return [d[1] * dir, -d[0] * dir]; };
  const nT = nrm(Hp, Kn), nS = nrm(Kn, A), nK = E.norm(add(nT, nS));
  const tq = o.thigh ?? 0.08;
  const at = (t, off) => add(lerp(Kn, A, t), mul(nS, off));
  const wa = s * (0.42 + sw * 0.1);
  const pts = [
    add(Hp, mul(nT, wH / 2)), add(lerp(Hp, Kn, 0.4), mul(nT, wH * 0.5 * (1 + tq))), add(lerp(Hp, Kn, 0.8), mul(nT, (wH + wK) * 0.25)),
    add(Kn, mul(nK, wK * 0.56)), at(0.18, wK * 0.46), at(0.45, wK * 0.4), at(0.72, wa * 0.72 + 2),
    [X(0.24 + sw * 0.04), ay + 2], [X(0.42 + sw * 0.06), ay + h * 0.34], [X(0.7), gy - h * (0.5 + sw * 0.06)], [X(0.96), gy - h * 0.36],
    [X(1.12), gy - h * 0.3], [X(1.22), gy - h * 0.18], [X(1.25), gy - h * 0.06], [X(1.16), gy, 1],
    [X(0.86), gy - 1], [X(0.62), gy - h * 0.12], [X(0.34), gy - h * 0.08], [X(0.06), gy, 1],
    [X(-0.2), gy - 1], [X(-0.34), gy - h * 0.2], [X(-0.34 - sw * 0.05), gy - h * 0.5], [X(-0.27 - sw * 0.05), ay + h * 0.05],
    at(0.72, -(wa * 0.62 + 2)), at(0.36, -wK * 0.5 * (1.18 + sw * 0.1)), at(0.12, -wK * 0.52), add(Kn, mul(nK, -wK * 0.5)),
    add(lerp(Hp, Kn, 0.6), mul(nT, -wH * 0.5 * (1 + tq * 0.6))), add(Hp, mul(nT, -wH / 2)),
  ];
  for (let i = 3; i >= 1; i--) { const tx = 1.0 - i * 0.075; f.part([[X(tx - 0.12), gy - h * (0.3 + i * 0.02)], [X(tx + 0.05), gy - h * (0.32 + i * 0.02)], [X(tx + 0.13), gy - h * 0.14], [X(tx + 0.1), gy - 1], [X(tx - 0.08), gy - 1]], Object.assign({}, look, { inkW: 1.1, inkHeavy: 1.5, cast: false, shade: 0.5, fill: mix(look.fill, '#1a1008', 0.2) })); }
  f.part(pts, Object.assign({ k: 0.9 }, look));
  const dk = mix(look.fill, '#1a100a', 0.5), lt = mix(look.fill, '#fff', 0.3);
  // knee: kneecap shadow and creases; shin edge; ankle knob; Achilles; instep; big toe and nail
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
// a whole bare arm in one outline, shoulder to wrist, soft at the elbow (the hand is drawn separately over the wrist)
function fullArm(f, S0, E0, W0, wS, wE, wW, look, o = {}) {
  return f.part(K.chain([S0, E0, W0], [wS, wE, wW], { steps: 10, bp: o.bp, bq: o.bq }), Object.assign({ k: 0.9 }, look));
}

// ---- realism helpers (independent review pass) ----
// soft tonal modelling inside a clip shape: list of [pts, colour, opacity, blur]. Gives the big faces volume between
// the cel band and the ink, the way a painted underlayer would. clipD is a path d (f.part returns one).
function softTone(f, clipD, list) {
  const cid = f.id('sc'); f.defs.push(`<clipPath id="${cid}"><path d="${clipD}"/></clipPath>`);
  f._sb = f._sb || {};
  let g = `<g clip-path="url(#${cid})">`;
  for (const [pts, col, op, bl] of list) {
    const fid = `sb${f.o.seed}_${bl}`;
    if (!f._sb[fid]) { f._sb[fid] = 1; f.defs.push(`<filter id="${fid}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${bl}"/></filter>`); }
    g += `<path d="${E.smooth(pts, true, 1)}" fill="${col}" opacity="${op}" filter="url(#${fid})"/>`;
  }
  f.raw(g + '</g>');
}
const hex01 = h => [1, 3, 5].map(i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3));
// blotchy stain from fractal noise, clipped to a shape: peat stains, tanning blotches, damp. a/b set the threshold
// (alpha = a * noise + b), freq the blotch size.
function stains(f, clipD, bb, col, freq, a, b, seedOff, op = 1, oct = 4) {
  const id = f.id('st'), cid = f.id('sc'), [r, g, bl] = hex01(col);
  f.defs.push(`<filter id="${id}" filterUnits="userSpaceOnUse" x="${bb[0]}" y="${bb[1]}" width="${bb[2] - bb[0]}" height="${bb[3] - bb[1]}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${f.o.seed + seedOff}"/><feColorMatrix values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${bl}  ${a} 0 0 0 ${b}"/></filter>`);
  f.defs.push(`<clipPath id="${cid}"><path d="${clipD}"/></clipPath>`);
  f.raw(`<g clip-path="url(#${cid})"><rect x="${bb[0]}" y="${bb[1]}" width="${bb[2] - bb[0]}" height="${bb[3] - bb[1]}" filter="url(#${id})" opacity="${op}"/></g>`);
}
// a skin crease: a dark tapered valley and, on the wall that faces the key light, a thin lit lip
function crease(f, pts, w, o = {}) {
  const L = f.L, off = mul([-L[0], -L[1]], o.lip ?? Math.max(1.5, w * 0.7));
  f.stroke(pts, w, o.col || '#1a0e08', { op: o.op ?? 0.75 });
  if (o.light !== false && pts.length > 2) f.line(pts.slice(1, -1).map(q => add(q, off)), Math.max(0.8, w * 0.32), o.lit || '#b0845a', { op: o.litOp ?? 0.45 });
}
// a run of roughly parallel creases filling an ellipse: dir = screen angle of the creases, bend = sag in px
function creaseField(f, c, rx, ry, n, dir, len, w, o = {}) {
  for (let i = 0; i < n; i++) {
    const p = scatter(f, c, rx, ry), a = dir + (f.r() - 0.5) * (o.spread ?? 0.35), l = len * (0.5 + f.r() * 0.7), d = rot([1, 0], a), nn = [-d[1], d[0]];
    const bend = (o.bend ?? 0.12) * l * (f.r() > 0.3 ? 1 : -1);
    crease(f, [add(p, mul(d, -l / 2)), add(add(p, mul(d, -l / 6)), mul(nn, bend)), add(add(p, mul(d, l / 6)), mul(nn, bend)), add(p, mul(d, l / 2))], w * (0.6 + f.r() * 0.6), o);
  }
}
// offset a polyline along its normals by off(t) (t = 0..1 along it)
function offsetLine(pts, off) {
  const n = pts.length;
  return pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)); return add(p, mul([-d[1], d[0]], off(i / (n - 1)))); });
}
// a clump of wet, matted hair along path (root to tip): a dark tapered body and strands inside it that converge on the
// pointed tip, with a wet sheen on a few. o.cols: strand colours dark to light; o.base: the clump body.
function hairClump(f, path, w, o = {}) {
  const pal = o.pal || ['#22120a', '#2c180e', '#352010', '#3e2412', '#2a1c12'];
  const base = o.base || pal[Math.floor(f.r() * pal.length)];
  const tw = t => Math.sin(Math.PI * (0.1 + 0.85 * t)) * (t < 0.15 ? 0.6 + t * 2.6 : 1);
  f.stroke(path, w + 5, INK, { op: 0.9 }); // the dark gap round the clump keeps the clumps apart
  f.stroke(path, w, base);
  const n = o.n || Math.max(3, Math.round(w / 7));
  for (let k = 0; k < n; k++) {
    const s = (k / (n - 1) - 0.5) * w * 0.7, j = (f.r() - 0.5) * 3;
    const pts = offsetLine(path, t => (s + j) * tw(t) * 0.95);
    const t0 = Math.floor(f.r() * 2), t1 = pts.length - Math.floor(f.r() * 2);
    f.line(pts.slice(t0, Math.max(t0 + 2, t1)), 0.8 + f.r() * 1.2, f.r() > 0.45 ? mix(base, '#000', 0.5) : mix(base, '#8a4824', 0.28), { op: 0.75 });
  }
  if (o.sheen !== false) { // the wet shine runs along the lit side of the clump's middle
    const pts = offsetLine(path, t => w * 0.16 * tw(t));
    for (let m = 0; m < 2; m++) { const a = 1 + Math.floor(f.r() * (pts.length - 2)), q0 = pts[a], q1 = pts[Math.min(pts.length - 1, a + 1)], t0 = f.r() * 0.5, t1 = t0 + 0.15 + f.r() * 0.35;
      f.line([lerp(q0, q1, t0), lerp(q0, q1, (t0 + t1) / 2), lerp(q0, q1, t1)], Math.max(1.4, w * 0.09), o.sheenCol || '#7a4a2e', { op: 0.65 });
      f.line([lerp(q0, q1, t0 + 0.04), lerp(q0, q1, t1 - 0.04)], 1, '#c8986a', { op: 0.45 }); }
  }
  if (o.stray) { const p = path[Math.floor(path.length * 0.4)]; f.line([p, add(p, [o.stray * 0.6, 40]), add(p, [o.stray, 110])], 1.2, pal[3], { op: 0.8 }); }
}

module.exports = { softTone, stains, crease, creaseField, offsetLine, hairClump, fullLeg, fullArm, P, base, textures, SKT, SKH, rnd, scatter, pustule, pustules, warts, toadstool, toadstools, bracket, mossClump, reed, rope, lantern, driedFrog, boneCharm, herbBundle, drip, bubbles, knitWound, mudSplats, fringe, ripples };
