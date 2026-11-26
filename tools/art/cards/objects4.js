// The card object library, part four: the review-3 redraws (L8 misreads, L9 form, L11 fit) and the objects the
// forced-noun table needs. Every builder follows the full contract:
//   (f, o) => { focus, sig, hook?, grip?, mouth?, feat, ells }
//   sig:  [x0, y0, x1, y1] the signature shape, in figure px; layouts may crop anything but this (L16)
//   hook: the point a chain or cord attaches to, if the object can hang (L17)
//   grip: { c, thumb } where a hand closes and the angle toward the object's working end
//   feat: the state features drawn (steam, rime, stain, blood, crack, contents) for the state-word check (L21)
//   ells: the ellipse ratios (minor/major) of every rim, opening and base, for the viewpoint check (L9)
// o.state carries the card's state words ({ frozen, clean, broken, empty }); builders obey them.
// FX (flame, steam, drips, lightning, rime) are requested with K.fxReq and drawn by the composition (L18).
'use strict';
const K = require('./card_kit');
const SB = (F, b) => require('./card_kit').E.bbox(F([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]]));   // a signature box given in the object's own frame, as a figure-space box (L16)
const G = require('../gear');
const { E, D, INK, BONE } = K;
const { add, sub, mul, lerp, rot, mix, ell, frame, limb, norm, len } = E;

const IRON = '#4d4f52', OAK = '#5b412a', OAKL = '#7a5a3a', LEATHER = '#5a3e28', LINEN = '#c8bca0', SACK = '#8a7a5a', BRASS = '#857452',
  BONEC = '#d4c8a8', TWINE = '#9a8460', RUST = '#5a2a12', VERD = '#4f7a66', SKIN = '#b8957a', SKIND = '#8a6a54', PEWTER = '#8a8c86',
  BLOOD = '#5c0f0b', BLOOD_D = '#4c0c08', COPPER = '#7a5a40', STONE = '#6e6a62';
const INKS = { fire: '#8a3a26', frost: '#6a8494', lightning: '#857452', water: '#2e3e5a', toxin: '#5a6a34', void: '#3a2a44' };   // course inks pulled to ink (L14)
const T = (f, n) => n + f.o.seed;
const loop = pts => pts.concat([pts[0]]);
const L = (f, F, pts, w, col, o) => f.line(F(pts), w, col, o);
function P(f, F, pts, fill, o = {}) {
  const q = F(pts);
  f.part(q, Object.assign({ fill, shade: 0.45, tex: T(f, 'mottle'), texOp: 0.5 }, o));
  if (o.dress !== false) D.dress(f, q, Object.assign({ lw: 1.2, op: 0.45 }, o.dressO || {}));
  return q;
}
const bbOf = pts => E.bbox(pts);
const O = {};

// ==== skin: a forearm that reads as an arm (wrist taper, muscle swell, tendons, hairs, mottling), not a tube
function forearm(f, F, a, b, wa, wb, o = {}) {
  const pts = limb(a, b, wa, wb, { p: [[0.3, 0.12, 0.18]], q: [[0.25, 0.18, 0.2], [0.8, -0.08, 0.1]], capB: !o.cut, capA: false });
  P(f, F, pts, o.skin || SKIN, { shade: 0.42, tex: T(f, 'mottle'), texOp: 0.8, dressO: { op: 0.3, lt: '#e8d0b8', dark: '#4a2a1a' } });
  const r = f.r, up = norm(rot(sub(b, a), -Math.PI / 2)), at = (t, k) => add(lerp(a, b, t), mul(up, k * (wa + (wb - wa) * t) / 2));
  // round it: a lit ridge along the top, the core shadow below it, reflected light at the lower edge (review 3: "a slab")
  const run = (k, n = 9) => { const q = []; for (let i = 0; i <= n; i++) q.push(at(0.02 + i * 0.96 / n, k)); return q; };
  L(f, F, run(0.45), wa * 0.16, mix(o.skin || SKIN, '#f0dcc8', 0.45), { op: 0.35 });
  L(f, F, run(-0.42), wa * 0.2, '#5a3a2a', { op: 0.28 });
  L(f, F, run(-0.86), wa * 0.05, mix(o.skin || SKIN, '#d8c0a8', 0.3), { op: 0.35 });
  for (let i = 0; i < 18; i++) { const t = 0.05 + r() * 0.9, p = at(t, (r() - 0.5) * 1.4); L(f, F, [p, add(p, [4 + r() * 5, -3 - r() * 2])], 0.9, '#3a2418', { op: 0.6 }); } // hairs
  for (let k = 0; k < 2; k++) { const q = []; for (let i = 0; i < 7; i++) q.push(at(0.45 + i * 0.07, 0.1 + k * 0.3 + Math.sin(i * 1.7 + k) * 0.08)); L(f, F, q, 2.4, '#6a6a7a', { op: 0.3 }); } // veins toward the wrist
  L(f, F, [at(0.5, 0.15), at(0.92, 0.12)], 1.2, '#7a5a44', { op: 0.6 }); // tendon
  for (let i = 0; i < 90; i++) { const p = at(0.04 + r() * 0.92, (r() - 0.5) * 1.6); f.flat(F(ell(p, 1.2, 1, 0, 5)), '#5a3a2a', { op: 0.3 }); } // pores and freckles
  for (let i = 0; i < 5; i++) { const p = at(0.2 + r() * 0.6, (r() - 0.5) * 1); f.flat(F(ell(p, 8 + r() * 10, 4 + r() * 5, r() * 3, 8)), '#8a5a4a', { op: 0.22 }); }
  return pts;
}

// ==== linen
O.bandage = (f, o = {}) => { // Cole's roll: one three-quarter view from above. The end face is an ellipse whose minor axis lies
  // along the roll's axis; one continuous spiral of cloth winds out from the core; the outer turn lifts off tangentially
  // at the top and the strip, as wide as the roll, falls to the surface and trails away with a fold, into mud.
  const F = frame([0, 0], 0, 1), r = f.r, st = o.state || {}, cloth = st.clean ? '#ddd4bc' : LINEN, under = mix(cloth, '#5a4a38', 0.35);
  const C = [-60, 0], R = 120, d = norm([0.93, -0.36]), n = [-d[1], d[0]], A = Math.atan2(d[1], d[0]), RM = R * 0.42, Lx = 190;
  const e = (c, k, t) => add(c, rot([Math.cos(t) * RM * k, Math.sin(t) * R * k], A));
  const C2 = add(C, mul(d, Lx));
  // the strip: leaves the top of the outer turn along the tangent (toward the viewer, -d), falls and lies on the ground
  const top = add(C, mul(n, -R)), ground = C[1] + R * Math.abs(n[1]) + 6;
  const path = [top, add(top, mul(d, -70)), add(top, add(mul(d, -130), [0, 90])), [top[0] - 170, ground + 20], [top[0] - 260, ground + 50], [top[0] - 340, ground + 34], [top[0] - 420, ground + 60]];
  const Pp = K.catmull(path, 8), strip = Pp.map(p => [p, add(p, mul(d, Lx * 0.92))]);
  const fold = Math.round(Pp.length * 0.62);
  const band = (i0, i1, col) => { const seg = strip.slice(i0, i1 + 1); P(f, F, [...seg.map(q => q[0]), ...seg.slice().reverse().map(q => q[1])], col, { tex: T(f, 'weave'), texOp: 0.7, dressO: { op: 0.3, dir: A } }); };
  band(fold, Pp.length - 1, under); band(Math.round(Pp.length * 0.3), fold, cloth);
  L(f, F, [strip[fold][0], strip[fold][1]], 2.6, INK);
  const tail = strip[Pp.length - 1]; for (let i = 0; i < 9; i++) { const q = lerp(tail[0], tail[1], i / 8); L(f, F, [q, add(q, [-16 - r() * 18, 4 + r() * 6])], 1, '#a89c80'); }
  f.flat(F([add(tail[0], [-60, 10]), add(tail[1], [-30, -6]), add(tail[1], [40, 20]), add(tail[0], [10, 30])]), '#2a2014', { op: 0.6 }); // mud it trails into
  if (!st.clean) f.flat(F([lerp(strip[fold + 2][0], strip[fold + 2][1], 0.3), lerp(strip[fold + 6][0], strip[fold + 6][1], 0.3), lerp(strip[fold + 6][0], strip[fold + 6][1], 0.6), lerp(strip[fold + 2][0], strip[fold + 2][1], 0.6)]), '#6a1810', { op: 0.5 });
  // contact shadow under the roll
  f.flat(F(ell(add(C, add(mul(n, R * 0.95), mul(d, Lx * 0.5))), Lx * 0.7, 18, A, 16)), '#120c08', { op: 0.45 });
  // the body: tangent lines from the end ellipse's major extremes back along the axis, the far half of the far ellipse
  const body = [e(C, 1, -Math.PI / 2), e(C2, 1, -Math.PI / 2)]; for (let i = 1; i < 8; i++) body.push(e(C2, 1, -Math.PI / 2 + Math.PI * i / 8)); body.push(e(C2, 1, Math.PI / 2), e(C, 1, Math.PI / 2));
  P(f, F, body, mix(cloth, '#000', 0.05), { tex: T(f, 'weave'), texOp: 0.7, shade: 0.5, dressO: { op: 0.4, dir: A + Math.PI / 2 } });
  for (let k = 1; k < 4; k++) L(f, F, [e(C, 1, -Math.PI / 2 + k * 0.7), e(C2, 1, -Math.PI / 2 + k * 0.7)], 1, INK, { op: 0.25 });
  // the strip's first part: lifting off the outer turn, drawn over the body
  band(0, Math.round(Pp.length * 0.3), cloth);
  if (!st.clean) { f.flat(F([e(C, 0.95, 0.4), e(C2, 0.95, 0.4), e(C2, 0.95, 1.1), e(C, 0.95, 1.1)]), '#6a1810', { op: 0.42 }); f.line(F([e(C, 0.95, 1.1), e(C2, 0.95, 1.1)]), 1.6, '#8a7a30', { op: 0.6 }); }
  // the end face, a single spiral from the core out to the outer turn, threads at the cut edge
  f.part(F(ell(C, RM, R, A, 32)), { fill: mix(cloth, '#fff', 0.12), shade: 0.3, inkW: 1.8, tex: T(f, 'weave'), texOp: 0.35 });
  const sp = []; for (let i = 0; i <= 220; i++) { const t = i / 220, ang = t * Math.PI * 2 * 6 - Math.PI / 2, k = 0.12 + t * 0.86; sp.push(e(C, k, ang)); }
  L(f, F, sp, 1.6, INK, { op: 0.7 });
  f.part(F(ell(C, RM * 0.12, R * 0.12, A, 12)), { fill: '#241a10', shade: 0.2, inkW: 1.2, cast: false });
  for (let i = 0; i < 16; i++) { const t = r() * Math.PI * 2, p = e(C, 1, t); L(f, F, [p, add(p, rot([Math.cos(t) * 8, Math.sin(t) * 10], A))], 1, '#a89c80', { op: 0.8 }); }
  if (!st.clean) f.flat(F([e(C, 0.95, 0.2), e(C, 0.95, 0.9), e(C, 0.6, 0.7), e(C, 0.62, 0.3)]), '#6a1810', { op: 0.32 });
  const bb = bbOf(body);
  return { focus: F([C])[0], sig: [bb[0] - 20, bb[1], bb[2], bb[3] + 30], feat: st.clean ? [] : ['stain', 'blood'], ells: [RM / R, RM / R] };
};
O.wrapped = (f, o = {}) => { // a bandaged forearm across a table: linen wound in overlapping turns, soaked through, the stain wicking along the turns with a yellowed tide line
  const F = frame([0, 0], o.ang ?? -0.14, 1), r = f.r, st = o.state || {};
  const a = [-600, 50], b = [600, -10], wa = 190, wb = 150, up = norm(rot(sub(b, a), -Math.PI / 2)), at = (t, k) => add(lerp(a, b, t), mul(up, k * (wa + (wb - wa) * t) / 2));
  P(f, F, [[-640, 120], [640, 90], [660, 240], [-660, 260]], OAKL, { tex: T(f, 'wood'), texOp: 0.9, dressO: { op: 0.3 } }); // the table
  f.flat(F([at(0.05, -1.1), at(0.95, -1.1), at(0.95, -1.5), at(0.05, -1.5)]), '#120c08', { op: 0.45 }); // the arm's shadow on it
  forearm(f, F, a, b, wa, wb, { cut: true });
  const t0 = 0.27, t1 = 0.76, n = 9, dt = (t1 - t0) / n, sk = 0.03;
  // the wound linen is one sleeve over the arm, round like it; the turns are lapped edges slanting across it
  const sleeve = []; for (let i = 0; i <= 12; i++) sleeve.push(at(t0 + (t1 - t0) * i / 12, 1.1)); for (let i = 12; i >= 0; i -= 1) sleeve.push(at(t0 + sk + (t1 - t0) * i / 12, -1.1));
  P(f, F, sleeve, LINEN, { sharp: true, tex: T(f, 'weave'), texOp: 0.85, shade: 0.5, dressO: { op: 0.3 } });
  const lap = []; for (let i = 0; i <= 10; i++) lap.push(at(0.02 + i * 0.096, 0)); // reuse the round shading of the arm
  L(f, F, [at(t0 + 0.01, 0.5), at(t1 - 0.01, 0.5)], wa * 0.14, '#f4ecd8', { op: 0.35 }); L(f, F, [at(t0 + 0.02, -0.5), at(t1, -0.5)], wa * 0.2, '#5a4a38', { op: 0.25 });
  for (let i = 1; i < n; i++) { const u = t0 + i * dt, top = at(u, 1.1), bot = at(u + sk + dt * 0.3, -1.1), mid = add(lerp(top, bot, 0.5), mul(norm(sub(b, a)), 8));
    L(f, F, [top, mid, bot], 2.2, INK, { op: 0.7 }); L(f, F, [add(top, mul(norm(sub(b, a)), -5)), add(mid, mul(norm(sub(b, a)), -5)), add(bot, mul(norm(sub(b, a)), -5))], 2, '#f0e8d4', { op: 0.6 }); // a lapped edge: its lip lit, its shadow
    L(f, F, [add(top, mul(norm(sub(b, a)), 6)), add(bot, mul(norm(sub(b, a)), 6))], 5, '#5a4a38', { op: 0.18 }); }
  for (const u of [t0, t1 + dt * 0.35]) for (let k = 0; k < 7; k++) { const p = at(u + sk * (k / 6), 1 - k / 3); L(f, F, [p, add(p, [-8 - r() * 6, r() * 4])], 1, '#a89c80', { op: 0.8 }); } // frayed ends
  if (!st.clean) { // blood soaked through: dark at the wound, wicking along the turns, a yellowed tide line round it
    const c = at(0.5, -0.1), blob = (R, sx, sy) => { const q = []; for (let i = 0; i < 18; i++) { const t = i / 18 * Math.PI * 2; q.push(add(c, rot([Math.cos(t) * R * sx * (0.75 + r() * 0.5), Math.sin(t) * R * sy * (0.75 + r() * 0.5)], -0.5))); } return q; };
    const halo = blob(110, 1.3, 0.62); f.flat(F(halo), '#6a3a22', { op: 0.32 }); f.line(F(loop(halo)), 3, '#8a7a40', { op: 0.55 });
    f.flat(F(blob(70, 1.2, 0.6)), '#5a1a12', { op: 0.55 }); f.flat(F(blob(36, 1.1, 0.7)), BLOOD_D, { op: 0.75 });
    for (let i = 0; i < 6; i++) { const p = add(c, [(r() - 0.5) * 120, (r() - 0.5) * 50]); L(f, F, [p, add(p, rot([40 + r() * 40, 0], -1.2))], 3, '#5a1a12', { op: 0.4 }); } // wicked along the weave
    K.fxReq(f, 'drip', F([at(0.52, -1.05)])[0], 2, { col: BLOOD_D });
  }
  return { focus: F([at(0.5, 0)])[0], sig: SB(F, [-300, -110, 300, 110]), feat: st.clean ? [] : ['stain', 'blood'], ells: [] };
};
O.suture = (f, o = {}) => { // close on a forearm: a curved needle drawing gut thread through both lips of a cut; a bandage edge
  const F = frame([0, 0], o.ang ?? -0.12, 1), r = f.r;
  const a = [-640, 50], b = [640, -10];
  forearm(f, F, a, b, 330, 280, { cut: true });
  const cut = [[-220, 20], [-110, 6], [0, 14], [110, 0], [220, 10]];
  f.part(F([...cut.map(p => add(p, [0, -11])), ...cut.slice().reverse().map(p => add(p, [0, 11]))]), { fill: '#3a0e0a', shade: 0.2, inkW: 2, cast: false });
  L(f, F, cut.map(p => add(p, [0, -13])), 2, '#d8a890', { op: 0.7 }); L(f, F, cut.map(p => add(p, [0, 13])), 2, '#7a4a3a', { op: 0.6 });
  for (let i = 0; i < 3; i++) { const x = -180 + i * 80, top = [x - 6, -24], bot = [x + 6, 40]; // a stitch: in through one lip, out through the other, knotted
    f.flat(F(ell(top, 4, 3, 0, 8)), '#2a0a06'); f.flat(F(ell(bot, 4, 3, 0, 8)), '#2a0a06');
    L(f, F, [top, add(lerp(top, bot, 0.5), [6, 0]), bot], 5, INK); L(f, F, [top, add(lerp(top, bot, 0.5), [6, 0]), bot], 2.4, '#3a2e22'); // black silk across both lips
    f.part(F(ell(add(top, [2, -4]), 5, 3.4, 0, 8)), { fill: '#2a2018', shade: 0.3, inkW: 1, cast: false }); L(f, F, [add(top, [2, -6]), add(top, [-6, -16])], 1.6, '#3a2e22'); L(f, F, [add(top, [4, -6]), add(top, [12, -14])], 1.6, '#3a2e22'); }
  // the needle mid-stitch: half entered at the lower lip, its eye trailing the thread back to the last knot
  const nd = []; for (let i = 0; i <= 12; i++) { const t = E.deg(160 + i * 15); nd.push([110 + Math.cos(t) * 120, 30 + Math.sin(t) * 110]); }
  L(f, F, nd.slice(0, 9), 12, INK); L(f, F, nd.slice(0, 9), 7.4, '#9a9c9a'); L(f, F, nd.slice(1, 6), 2, '#f4f4ee', { op: 0.85 });
  f.flat(F(ell(nd[8], 6, 4, 0, 8)), '#2a0a06');
  const th = [nd[0], [-20, -60], [-60, -40], [-30, -24]]; L(f, F, th, 5, INK); L(f, F, th, 2.4, '#3a2e22');
  for (let i = 0; i < 5; i++) { const q = F([[ -100 + r() * 300, 30 + r() * 20]])[0]; f.flat(ell(q, 3, 4, 0, 8), BLOOD); f.flat([add(q, [-2, 3]), add(q, [2, 3]), add(q, [0, 18 + r() * 16])], BLOOD); }
  P(f, F, [[300, -170], [440, -180], [440, 190], [310, 180]], LINEN, { tex: T(f, 'weave'), texOp: 0.7 }); for (let k = 0; k < 6; k++) L(f, F, [[304, -140 + k * 60], [440, -146 + k * 60]], 1.2, INK, { op: 0.5 }); // the bandage waiting at the edge
  return { focus: F([[0, 10]])[0], sig: SB(F, [-240, -90, 240, 90]), feat: ['blood'], ells: [] };
};

// ==== feathers and birds
O.feather = (f, o = {}) => { // a crow's flight feather: curved rachis, vane split into ragged clumps of barbs, down at the base, hollow quill
  const F = frame([0, 0], o.ang ?? -0.6, 1), r = f.r;
  const rach = []; for (let i = 0; i <= 20; i++) { const t = i / 20; rach.push([-280 + t * 560, Math.sin(t * Math.PI) * -36 + t * 10]); }
  const vane = (side, wmax) => { let gap = 0; for (let i = 3; i < 20; i++) { const t = i / 20, p = rach[i], w = wmax * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (side > 0 ? 1 : 0.7); if (r() < 0.12) { gap = 2; } if ((gap -= 1) >= 0) continue;
      const tip = add(p, [-14 + r() * 8, side * w]), q = [p, add(lerp(p, tip, 0.5), [6, 0]), tip, add(tip, [16, side * -4]), add(lerp(p, tip, 0.5), [22, side * -2]), rach[Math.min(20, i + 1)]];
      f.part(F(q), { fill: mix('#22202a', '#4a4858', r() * 0.3), shade: 0.4, inkW: 1, inkHeavy: 1.6, cast: false, k: 0.7 }); L(f, F, [lerp(p, tip, 0.2), lerp(p, tip, 0.9)], 0.9, '#7a7888', { op: 0.6 }); } };
  vane(-1, 70); vane(1, 52);
  for (let i = 0; i < 10; i++) { const p = rach[1 + (i % 3)]; L(f, F, [p, add(p, [-20 + r() * 30, (r() - 0.5) * 60]), add(p, [-30 + r() * 20, (r() - 0.5) * 80])], 1.2, '#5a5868', { op: 0.8 }); } // down
  L(f, F, rach, 6, INK); L(f, F, rach, 3.2, '#d8d0bc');
  f.part(F(limb([-330, 14], [-260, 6], 14, 10, { capB: false })), { fill: '#d8d0b8', shade: 0.35, inkW: 1.3 }); f.part(F(ell([-332, 14], 4, 7, 0, 8)), { fill: '#1a1410', shade: 0.1, inkW: 1, cast: false }); // hollow calamus
  return { focus: F([[0, -20]])[0], sig: SB(F, [-340, -110, 290, 70]), hook: F([[-336, 14]])[0], feat: [], ells: [0.57] };
};
O.birds = (f, o = {}) => { // a flight of rooks crossing, wings at different beats, one turning toward us; a feather falling
  const F = frame([0, 0], 0, 1), r = f.r;
  const rook = (c, s, beat, tilt) => { const G2 = frame(F([c])[0], tilt, s), col = '#1c1a20';
    const wing = side => { const up = side > 0 ? beat : -beat * 0.6; const pts = [[-10, 0], [-40, -60 * up - 10], [-90, -110 * up - 20], [-110, -100 * up - 10], [-100, -80 * up], [-120, -70 * up + 6], [-96, -56 * up + 8], [-110, -40 * up + 14], [-70, -20 * up + 14], [-30, 10]];
      f.part(G2(pts.map(p => [p[0] * side * -1 * -1, p[1]]).map(p => side > 0 ? p : [-p[0] * 0.8, p[1] * 0.7 + 10])), { fill: side > 0 ? col : mix(col, '#000', 0.2), shade: 0.4, inkW: 1.2, inkHeavy: 2, cast: false, k: 0.6, tex: T(f, 'mottle'), texOp: 0.7 }); for (let k = 0; k < 5; k++) f.line(G2([[-30 - k * 12, 4], [-70 - k * 10 * side * side, (side > 0 ? -70 * beat : 30) + k * 6]]), 1.1, '#5a5868', { op: 0.65 }); };
    wing(-1);
    f.part(G2([[-60, 6], [-20, -10], [30, -8], [56, -2], [70, 4], [52, 12], [10, 20], [-50, 22], [-90, 30], [-80, 14]]), { fill: col, shade: 0.4, inkW: 1.3, inkHeavy: 2.2, cast: false , tex: T(f, 'mottle'), texOp: 0.7 }); f.line(G2([[-40, 2], [0, -6], [40, -4]]), 2, '#6a6878', { op: 0.5 });
    f.part(G2([[56, -2], [80, 0], [96, 6], [74, 10]]), { fill: '#8a8a8a', shade: 0.3, inkW: 1, cast: false }); f.flat(G2(ell([58, 1], 2, 2, 0, 6)), '#d8d8d0');
    wing(1);
    for (let k = 0; k < 4; k++) f.line(G2([[-60 - k * 12, 0], [-80 - k * 14, -40 * beat]]), 0.9, '#5a5868', { op: 0.6 }); };
  [[-180, -40, 1.0, 0.9, -0.1], [60, -120, 0.75, -0.4, 0.15], [220, 30, 0.85, 0.3, -0.05], [-20, 120, 0.6, 1.0, 0.1], [300, -150, 0.5, 0.6, 0]].forEach(([x, y, s, b2, t]) => rook([x, y], s, b2, t));
  const fq = [[-60, 200], [10, 180]]; L(f, F, fq, 2, '#d8d0bc'); f.part(F([[-56, 196], [0, 170], [14, 182], [-40, 206]]), { fill: '#22202a', shade: 0.4, inkW: 1, cast: false });
  return { focus: F([[0, -20]])[0], sig: SB(F, [-300, -200, 360, 200]), feat: [], ells: [] };
};

// ==== doors, hoods, sacks
O.doorajar = (f, o = {}) => { // a narrow door standing ajar in a stone jamb, three-quarter: black in the gap, the leaf's edge thick
  const F = frame([0, 0], 0, 1), r = f.r;
  P(f, F, [[-260, 260], [-260, -200], [-200, -280], [-100, -310], [-40, -300], [-40, 260]], STONE, { tex: T(f, 'mottle'), texOp: 0.8 }); // jamb and arch
  for (let i = 0; i < 6; i++) L(f, F, [[-260, -180 + i * 80], [-40, -184 + i * 80]], 2, INK, { op: 0.6 });
  f.part(F([[-40, 260], [-40, -300], [120, -330], [120, 260]]), { fill: '#060508', shade: 0.1, inkW: 2, cast: false, hatch: false }); // the black beyond
  const leaf = [[-40, -296], [170, -250], [170, 300], [-40, 262]];
  f.part(F([[170, -250], [196, -244], [196, 296], [170, 300]]), { fill: '#3a2a1a', shade: 0.3, inkW: 1.6 }); // the leaf's thick edge
  P(f, F, leaf, OAK, { tex: T(f, 'wood'), texOp: 0.9, sharp: true });
  for (const t of [0.3, 0.55, 0.8]) L(f, F, [lerp([-40, -296], [170, -250], t), lerp([-40, 262], [170, 300], t)], 2, INK, { op: 0.7 });
  for (const y of [-180, 140]) { const a = [-36, y], b = [176, y + 36]; P(f, F, [add(a, [0, -12]), add(b, [0, -12]), add(b, [22, -8]), add(b, [22, 16]), add(b, [0, 12]), add(a, [0, 12])], '#2f2f31', { dress: false }); for (let k = 0; k < 4; k++) f.rivet(F([lerp(a, b, 0.15 + k * 0.24)])[0], 3.4, '#777'); f.part(F(ell([-44, y], 12, 18, 0, 10)), { fill: '#2f2f31', shade: 0.4, inkW: 1.2 }); }
  f.part(F([[140, 40], [158, 44], [158, 90], [140, 86]]), { fill: '#2f2f31', shade: 0.4, inkW: 1.2 }); f.line(F(loop(ell([150, 110], 12, 18, 0.2, 12))), 4, '#2b2b2b');
  for (let i = 0; i < 5; i++) D.chip(f, F([[-40, -200 + i * 90]])[0], 10, Math.PI / 2);
  f.flat(F([[-40, 262], [170, 300], [260, 300], [40, 262]]), '#08060a', { op: 0.55 }); // shadow thrown through the gap onto the floor
  return { focus: F([[40, -20]])[0], sig: SB(F, [-140, -300, 200, 300]), feat: [], ells: [] };
};
O.hood = (f, o = {}) => { // a soaked sacking hood, three-quarter: the face opening dark, its rim turned back, the cowl falling over the shoulders
  const F = frame([0, 0], o.ang ?? 0.06, 1), r = f.r, st = o.state || {};
  P(f, F, [[-230, 230], [-200, 120], [-120, 70], [120, 60], [210, 110], [250, 230], [120, 210], [0, 236], [-120, 214]], mix(SACK, '#000', 0.1), { tex: T(f, 'weave'), texOp: 0.9 }); // the cowl
  for (const x of [-140, -40, 60, 160]) L(f, F, [[x, 90], [x + 10, 160], [x - 6, 220]], 2.4, INK, { op: 0.5 });
  P(f, F, [[-150, 110], [-180, -20], [-140, -160], [-40, -230], [70, -220], [150, -140], [170, -10], [140, 100], [40, 120], [-60, 124]], SACK, { tex: T(f, 'weave'), texOp: 0.9 });
  f.part(F([[-90, 80], [-110, -30], [-70, -130], [10, -150], [80, -110], [96, -10], [70, 80], [0, 100]]), { fill: '#0c0806', shade: 0.1, inkW: 2.4, cast: false, hatch: false }); // the face opening
  L(f, F, [[-110, -30], [-70, -134], [10, -156], [86, -114]], 7, mix(SACK, '#fff', 0.2), { op: 0.7 }); // its turned-back rim
  for (const [a, b2] of [[[-140, -150], [-170, 80]], [[100, -200], [150, 60]], [[-30, -230], [-60, -170]]]) L(f, F, [a, lerp(a, b2, 0.5), b2], 2.6, INK, { op: 0.5 });
  f.stitches(F([[-40, -228], [-140, -150], [-178, -20]]), '#d8cbb0', 1.4);
  f.flat(F([[-180, -20], [-140, -160], [-90, -100], [-120, 40]]), '#2a2014', { op: 0.35 });
  K.fxReq(f, 'drip', F([[-100, 230]])[0], 3, { col: '#3a4a52' }); K.fxReq(f, 'drip', F([[140, 220]])[0], 3, { col: '#3a4a52' });
  if (!st.frozen) K.fxReq(f, 'steam', F([[0, -230]])[0], 100);
  return { focus: F([[0, -20]])[0], sig: SB(F, [-180, -230, 170, 130]), hook: F([[-30, -232]])[0], feat: st.frozen ? [] : ['steam'], ells: [] };
};
O.ratsack = (f, o = {}) => { // a sack splitting at the seam, rats pushing out: snouts, whiskers, a tail
  const F = frame([0, 0], o.ang ?? -0.05, 1), r = f.r;
  P(f, F, [[-170, 190], [-200, 60], [-160, -60], [-80, -130], [-40, -180], [40, -180], [80, -130], [170, -60], [200, 70], [170, 190]], SACK, { tex: T(f, 'weave'), texOp: 0.9 });
  D.twine(f, F([[-50, -170], [-50, -160]]), F([[50, -170], [50, -160]]), 4, TWINE, { knot: F([[54, -166]])[0], ends: [F([[80, -130], [90, -90]])] });
  f.part(F([[40, -20], [140, -40], [180, 40], [130, 120], [60, 80]]), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false }); // the split
  for (let i = 0; i < 8; i++) { const p = F([[40 + i * 18, -20 + (i % 2) * 16]])[0]; f.line([p, add(p, [6 + r() * 8, -8 - r() * 10])], 1, '#c8b890', { op: 0.8 }); } // torn threads
  const rat = (c, ang, s) => { const G2 = frame(F([c])[0], ang, s), fur = '#5a4e44';
    f.part(G2([[-50, -26], [10, -30], [50, -14], [76, 0], [50, 12], [10, 24], [-50, 28]]), { fill: fur, shade: 0.45, inkW: 1.3, tex: T(f, 'mottle'), texOp: 0.6 });
    f.part(G2([[66, -6], [86, 0], [66, 8]]), { fill: '#b08070', shade: 0.3, inkW: 1, cast: false }); f.flat(G2(ell([34, -10], 4, 4, 0, 8)), '#080606'); f.flat(G2(ell([33, -11], 1.4, 1.4, 0, 6)), '#ffffff', { op: 0.8 });
    f.part(G2(ell([14, -24], 10, 12, -0.4, 10)), { fill: '#7a6a60', shade: 0.4, inkW: 1, cast: false });
    for (const s2 of [-1, 1]) for (let k = 0; k < 3; k++) f.line(G2([[74, 0], [104, s2 * (6 + k * 6)]]), 0.8, '#d8d0c0', { op: 0.8 });
    for (let k = 0; k < 6; k++) f.line(G2([[-30 + k * 12, -24], [-24 + k * 12, -30]]), 0.8, INK, { op: 0.6 }); };
  rat([110, 30], -0.4, 1.1); rat([150, 100], 0.3, 0.9);
  const tail = [[60, 110], [20, 170], [-40, 200], [-110, 196]]; L(f, F, tail, 9, INK); L(f, F, tail, 6, '#b08878');
  for (let i = 0; i < 6; i++) L(f, F, [lerp(tail[1], tail[2], i / 6), add(lerp(tail[1], tail[2], i / 6), [2, 4])], 1, INK, { op: 0.6 });
  for (let i = 0; i < 14; i++) f.flat(F(ell([170 + r() * 120, 180 + r() * 20], 2, 1.4, 0, 6)), '#3a2a1a', { op: 0.8 }); // droppings and grain
  return { focus: F([[100, 40]])[0], sig: SB(F, [-200, -180, 220, 200]), hook: F([[0, -176]])[0], feat: [], ells: [] };
};

// ==== glass and vessels
O.phial = (f, o = {}) => { // a slender pale frost-blue phial, a crack star in it, rime crusted on its shoulder and foot
  const F = frame([0, 0], o.ang ?? 0.1, 1), r = f.r, st = o.state || {};
  const prof = [[44, 220], [50, 190], [52, 0], [44, -110], [20, -160], [18, -220], [24, -232]], out = [...prof.map(([w, y]) => [-w, y]), ...prof.slice().reverse().map(([w, y]) => [w, y])];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; out.push([44 * Math.cos(t), 220 + 44 * 0.22 * Math.sin(t)]); }
  P(f, F, out, '#a8c4d0', { tex: T(f, 'mottle'), texOp: 0.3, hi: 0.08, dressO: { op: 0.3 } });
  f.part(F([[-48, 60], [0, 52], [48, 60], [48, 190], [0, 196], [-48, 190]]), { fill: '#6a90a8', shade: 0.4, inkW: 1, cast: false });
  L(f, F, [[-48, 60], [0, 52], [48, 60]], 1.6, '#e8f2f6', { op: 0.85 });
  L(f, F, [[-34, -80], [-40, 0], [-38, 140]], 5, '#f4fafc', { op: 0.6 });
  for (let i = 0; i < 6; i++) D.crack(f, F([[10, 20]])[0], i * 1.05 + 0.3, 40 + r() * 40, { n: 3, lip: '#f4fafc' }); // the crack star
  P(f, F, [[-16, -232], [-18, -270], [18, -272], [16, -232]], '#8a7a6a', { dress: false });
  f.part(F(ell([0, -232], 24, 5, 0, 12)), { fill: '#c8dce4', shade: 0.3, inkW: 1.2, cast: false });
  D.label(f, F([[0, 120]])[0], 70, 40, 0.06, '#cdbb94', G2 => { f.line(G2([[-24, -6], [22, -8]]), 1.2, INK, { op: 0.7 }); f.line(G2([[-24, 6], [10, 4]]), 1.2, INK, { op: 0.7 }); });
  for (const [x, y] of [[-46, -100], [-50, 200], [40, 210], [30, -120]]) f.flat(F(ell([x, y], 16, 8, 0.4, 10)), '#eef6f8', { op: 0.85 }); // rime crust
  K.fxReq(f, 'rime', F([[-44, 214]])[0], 90, { to: F([[44, 214]])[0] });
  return { focus: F([[0, 20]])[0], sig: SB(F, [-60, -280, 60, 240]), mouth: F([[0, -270]])[0], grip: { c: F([[0, -150]])[0], thumb: (o.ang ?? 0.1) - Math.PI / 2 }, feat: ['rime', 'crack'], ells: [0.22, 0.21] };
};
O.basin = (f, o = {}) => { // a dented pewter bleeding basin tipped toward us, its blood pouring over the lip
  const F = frame([0, 0], o.ang ?? 0.22, 1), r = f.r;
  P(f, F, [[-230, -40], [230, -60], [200, 50], [120, 100], [-120, 110], [-200, 60]], PEWTER, { tex: T(f, 'mottle'), texOp: 0.7 });
  f.part(F(ell([0, -50], 232, 58, -0.04, 26)), { fill: mix(PEWTER, '#fff', 0.15), shade: 0.3, inkW: 1.8, cast: false });
  f.part(F(ell([0, -46], 206, 44, -0.04, 26)), { fill: '#3a3c3a', shade: 0.2, inkW: 1.2, cast: false });
  f.flat(F(ell([20, -40], 180, 34, -0.04, 24)), BLOOD_D); f.flat(F(ell([-40, -50], 60, 7, 0, 12)), '#a83020', { op: 0.35 });
  for (let i = 0; i < 6; i++) f.line(F(ell([20 + i * 6, -40], 160 - i * 22, 28 - i * 4, -0.04, 24).slice(14, 22)), 1.2, i % 2 ? '#7a1a12' : '#2a0604', { op: 0.5 });   // the blood moving, rings toward the lip
  const lip = [200, -30]; const pour = [lip, [250, 30], [262, 140], [256, 260]]; f.line(F(pour), 20, INK); f.line(F(pour), 14, BLOOD);
  f.flat(F(ell([256, 270], 70, 14, 0, 14)), BLOOD_D, { op: 0.9 });
  for (const x of [-120, 40]) { f.flat(F(ell([x, 40], 20, 12, 0.3, 10)), '#2a2c2a', { op: 0.45 }); }
  f.scratches(F([[-60, 40]])[0], 60, 8, '#e8e8e2'); D.bloom(f, F([[120, 70]])[0], 20, '#2a2c28', { n: 3, op: 0.5 });
  return { focus: F([[0, -40]])[0], sig: SB(F, [-230, -110, 280, 120]), mouth: F([lip])[0], feat: ['blood', 'contents'], ells: [0.25, 0.21] };
};
O.broth = (f, o = {}) => { // a wooden galley bowl of broth gone solid with cold, a ladle frozen upright in it, finger bones in the ice
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, st = o.state || {};
  P(f, F, [[-220, 0], [220, 0], [196, 70], [130, 120], [60, 136], [-60, 136], [-130, 120], [-196, 70]], OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  f.part(F(ell([0, 0], 220, 46, 0, 26)), { fill: '#3a2414', shade: 0.25, inkW: 1.6, cast: false });
  f.part(F(ell([0, 6], 200, 36, 0, 26)), { fill: st.frozen ? '#b8c4c0' : '#7a6040', shade: 0.25, inkW: 1, cast: false, tex: T(f, 'mottle'), texOp: 0.5 });
  if (st.frozen) for (let i = 0; i < 6; i++) D.crack(f, F([[-100 + i * 40, 6]])[0], r() * 6, 40 + r() * 30, { n: 3, lip: '#f0f6f8' });
  for (const [x, y, a] of [[-60, 0, 0.3], [-30, 8, 0.1], [0, 2, -0.2]]) { const G2 = frame(F([[x, y]])[0], a, 1); f.part(G2([[-16, -5], [12, -6], [18, 0], [12, 6], [-16, 5]]), { fill: BONEC, shade: 0.35, inkW: 1.1, cast: false }); f.line(G2([[-4, -5], [-4, 5]]), 1, INK, { op: 0.6 }); }
  L(f, F, [[80, 4], [110, -150], [124, -260]], 14, INK); L(f, F, [[80, 4], [110, -150], [124, -260]], 9, mix(OAKL, '#fff', 0.1));
  f.part(F(ell([82, 6], 30, 9, 0.1, 12)), { fill: mix(OAKL, '#000', 0.2), shade: 0.3, inkW: 1.2, cast: false });
  L(f, F, [[-196, 70], [0, 92], [196, 70]], 1.6, INK, { op: 0.6 }); D.crack(f, F([[-140, 110]])[0], -1.3, 70, { n: 4 });
  if (st.frozen) { K.fxReq(f, 'rime', F([[-210, 10]])[0], 120, { to: F([[210, 10]])[0] }); for (let i = 0; i < 4; i++) f.flat(F([[-180 + i * 110, 24], [-174 + i * 110, 24], [-177 + i * 110, 50]]), '#e8f0f2', { op: 0.9 }); }
  else K.fxReq(f, 'steam', F([[0, -10]])[0], 110);
  return { focus: F([[0, 0]])[0], sig: SB(F, [-220, -60, 220, 140]), feat: st.frozen ? ['rime', 'contents'] : ['steam', 'contents'], ells: [0.21, 0.18] };
};
O.handbell = (f, o = {}) => { // a small bronze handbell on a turned wooden handle, its mouth an ellipse, the clapper swung to the rim
  const F = frame([0, 0], o.ang ?? -0.35, 1), r = f.r;
  P(f, F, limb([0, -340], [0, -150], 40, 46, { capK: 0.7 }), OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  for (const y of [-300, -200]) L(f, F, [[-22, y], [0, y + 6], [22, y]], 2.4, INK, { op: 0.7 });
  P(f, F, [[-40, -150], [40, -150], [60, -100], [80, 0], [130, 90], [150, 120], [-150, 120], [-130, 90], [-80, 0], [-60, -100]], '#7e6440', { tex: T(f, 'mottle'), texOp: 0.7 });
  f.part(F(ell([0, 120], 150, 36, 0, 26)), { fill: '#120c08', shade: 0.1, inkW: 2, cast: false, hatch: false });
  L(f, F, ell([0, 120], 150, 36, 0, 26).slice(0, 14).map(p => [p[0], p[1]]), 3, '#c8a878', { op: 0.6 });
  L(f, F, [[-104, 70], [0, 84], [104, 70]], 2.4, INK, { op: 0.7 }); L(f, F, [[-70, -40], [0, -30], [70, -40]], 2, INK, { op: 0.6 });
  L(f, F, [[0, -120], [70, 110]], 6, INK); f.part(F(ell([74, 118], 18, 14, 0, 10)), { fill: IRON, shade: 0.4, inkW: 1.3 });
  D.bloom(f, F([[-80, 60]])[0], 20, mix(VERD, '#7e6440', 0.4), { n: 3, op: 0.5 }); f.scratches(F([[40, 20]])[0], 30, 6, '#e8d0a0');
  return { focus: F([[0, 40]])[0], sig: SB(F, [-160, -180, 160, 160]), grip: { c: F([[0, -250]])[0], thumb: (o.ang ?? -0.35) + Math.PI / 2 }, hook: F([[0, -340]])[0], feat: [], ells: [0.24] };
};
O.anvil = (f, o = {}) => { // an anvil, a hammer coming down on the horn, the struck iron ringing, static burns branching on the face
  const F = frame([0, 0], 0, 1), r = f.r;
  P(f, F, [[-120, 230], [120, 230], [90, 150], [70, 80], [-70, 80], [-90, 150]], IRON, { dressO: { op: 0.45 } });
  P(f, F, [[-270, -10], [-200, -30], [200, -30], [230, -10], [230, 40], [100, 60], [80, 90], [-80, 90], [-100, 60], [-200, 40], [-330, 20]], '#55585c', { dressO: { op: 0.45 } });
  f.part(F([[-200, -30], [200, -30], [230, -10], [-270, -10]]), { fill: '#8a8c90', shade: 0.3, inkW: 1.4, cast: false }); // the face, worn bright
  const br = (p, a, l, d) => { if (d > 3 || l < 8) return; const q = add(p, rot([l, 0], a)); f.line(F([p, q]), 2.2 - d * 0.4, '#1a1008', { straight: true, op: 0.8 }); br(q, a + 0.5, l * 0.65, d + 1); if (r() < 0.7) br(q, a - 0.5, l * 0.6, d + 1); };
  br([-40, -20], 0.1, 40, 0); br([40, -22], 2.9, 34, 0);
  P(f, F, [[-40, -46], [140, -46], [140, -20], [-40, -20]], '#7a3a20', { dress: false }); // the work, hot
  P(f, F, limb([260, -330], [70, -150], 24, 28, { capK: 0.5 }), OAKL, { tex: T(f, 'wood'), texOp: 0.8 });
  P(f, F, [[20, -200], [100, -110], [70, -80], [-10, -170]], IRON, { dressO: { op: 0.4 } });
  return { focus: F([[50, -30]])[0], sig: SB(F, [-330, -330, 270, 230]), feat: [], ells: [] };
};
O.scourge = (f, o = {}) => { // a scourge mid-lash: a bound wooden handle, five knotted cords flaring out, barbs at the knots
  const F = frame([0, 0], o.ang ?? 0.1, 1), r = f.r;
  P(f, F, limb([-320, 160], [-160, 40], 40, 34, { capK: 0.6 }), OAKL, { tex: T(f, 'wood'), texOp: 0.9 });
  for (let i = 0; i < 6; i++) { const p = E.lp([-320, 160], [-160, 40], 0.4 + i * 0.08, 0); L(f, F, [add(p, [-14, -18]), add(p, [14, 18])], 3.4, INK); L(f, F, [add(p, [-14, -18]), add(p, [14, 18])], 1.8, LEATHER); }
  for (let k = 0; k < 5; k++) { const a = -0.9 + k * 0.32, pts = [[-160, 40]]; let p = [-160, 40], ang = a; for (let i = 0; i < 6; i++) { ang += 0.12 + r() * 0.08; p = add(p, rot([70, 0], ang)); pts.push(p); }
    L(f, F, pts, 8, INK); L(f, F, pts, 4.6, '#4a3a2a');
    for (let i = 2; i < pts.length; i += 2) { f.part(F(ell(pts[i], 10, 8, ang, 8)), { fill: '#3a2a1a', shade: 0.4, inkW: 1.1, cast: false }); for (const s2 of [-1, 1]) f.part(F([add(pts[i], [0, -3]), add(pts[i], rot([0, s2 * 22], ang + 0.4)), add(pts[i], [4, 3])]), { fill: '#6a6a6c', shade: 0.4, inkW: 1, cast: false, sharp: true }); }
    f.flat(F(ell(pts[pts.length - 1], 5, 7, 0, 8)), BLOOD); }
  return { focus: F([[0, -60]])[0], sig: SB(F, [-330, -320, 300, 180]), grip: { c: F([[-260, 120]])[0], thumb: (o.ang ?? 0.1) - 0.6 }, feat: ['blood'], ells: [] };
};

// ==== the small and the precious
O.signet = (f, o = {}) => { // a heavy copper signet ring standing on its edge, three-quarter: the band's depth on one side, the hole open, the seal face tilted to us with one sigil cut in it
  const F = frame([0, 0], o.ang ?? -0.12, 1), r = f.r;
  const C = [0, 40], RX = 128, RY = 158, dep = [-26, 6], band = 40;
  const ring = (c, rx, ry) => loop(ell(c, rx, ry, 0, 44));
  L(f, F, ring(add(C, dep), RX, RY), band + 8, INK); L(f, F, ring(add(C, dep), RX, RY), band, mix(COPPER, '#000', 0.45)); // the band's far edge, in shadow
  for (let i = 0; i < 12; i++) { const t = Math.PI * (0.55 + i / 11 * 0.9), p = add(C, [Math.cos(t) * RX, Math.sin(t) * RY]); L(f, F, [p, add(p, dep)], band * 0.9, mix(COPPER, '#000', 0.3)); } // its depth on the left
  L(f, F, ring(C, RX, RY), band + 8, INK); L(f, F, ring(C, RX, RY), band, COPPER);
  L(f, F, ell(C, RX - 8, RY - 8, 0, 44).slice(28, 40), 7, mix(COPPER, '#f0d8b0', 0.45), { op: 0.7 }); // light on the curve
  L(f, F, ell(C, RX + 6, RY + 6, 0, 44).slice(6, 16), 6, mix(COPPER, '#000', 0.4), { op: 0.6 });
  L(f, F, ring(C, RX - band / 2 - 2, RY - band / 2 - 2), 1.6, INK, { op: 0.7 });
  for (let i = 0; i < 72; i++) { const t = i / 72 * Math.PI * 2, p = add(C, [Math.cos(t) * RX, Math.sin(t) * RY]), nrm = [Math.cos(t), Math.sin(t)], sh = Math.cos(t - 0.6) < 0; L(f, F, [add(p, mul(nrm, -band * 0.4)), add(p, mul(nrm, band * 0.4))], sh ? 1.6 : 1, sh ? INK : '#c8a080', { op: sh ? 0.45 : 0.3 }); }   // hatching round the band, heavier on its shadow side
  const S = add(C, [0, -RY - 18]); // the bezel: a thick oval plate on the top of the band, its face tilted toward us
  f.part(F(ell(add(S, [0, 14]), 86, 40, 0, 28)), { fill: mix(COPPER, '#000', 0.35), shade: 0.4, inkW: 2 });
  f.part(F(ell(S, 86, 40, 0, 28)), { fill: mix(COPPER, '#fff', 0.06), shade: 0.4, inkW: 2, tex: T(f, 'mottle'), texOp: 0.6 });
  f.part(F(ell(S, 64, 28, 0, 24)), { fill: mix(COPPER, '#000', 0.15), shade: 0.3, inkW: 1.2, cast: false });
  const c = INKS[o.course] || '#2a1a10'; L(f, F, [add(S, [-30, -10]), add(S, [0, 12]), add(S, [30, -10])], 4, INK); L(f, F, [add(S, [0, 12]), add(S, [0, 22])], 4, INK); f.flat(F(ell(add(S, [0, -4]), 9, 5, 0, 8)), c); // the cut sigil
  for (const [x, y] of [[-110, 110], [100, 140], [-20, 196]]) D.bloom(f, F([[x, y]])[0], 16, VERD, { n: 3, op: 0.5 });
  f.scratches(F([[60, 40]])[0], 40, 8, '#e8c8a0'); D.wear(f, F([[-120, 0]])[0], 12, 120, 14);
  return { focus: F([S])[0], sig: SB(F, [-170, -180, 150, 205]), feat: [], ells: [40 / 86, 28 / 64] };
};
O.knuckles = (f, o = {}) => { // knucklebones spilled from a tipped leather cup: each bone shows one of its four faces, one marked red
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  P(f, F, [[-330, 40], [-310, -80], [-150, -130], [-120, -10], [-150, 80], [-300, 100]], LEATHER, { tex: T(f, 'mottle'), texOp: 0.8 });
  f.part(F(ell([-136, -70], 36, 70, 0.2, 18)), { fill: '#1e140c', shade: 0.2, inkW: 1.6, cast: false }); f.line(F(ell([-136, -70], 36, 70, 0.2, 18).slice(4, 13)), 3, '#8a6a48', { op: 0.6 });
  f.stitches(F([[-310, -70], [-300, 90]]), '#c8b08a', 1.2);
  const face = (c, a, s, kind) => { const G2 = frame(F([c])[0], a, s); // the astragalus: a waisted block
    const out = [[-40, -18], [-24, -26], [0, -18], [24, -26], [40, -18], [44, 4], [30, 20], [0, 14], [-30, 20], [-44, 4]];
    f.part(G2(out), { fill: BONEC, shade: 0.45, inkW: 1.5, tex: T(f, 'mottle'), texOp: 0.6 });
    if (kind === 0) f.part(G2(ell([0, -2], 14, 8, 0, 10)), { fill: mix(BONEC, '#000', 0.3), shade: 0.2, inkW: 1, cast: false }); // the hollow side
    if (kind === 1) { f.line(G2([[-26, -6], [0, 2], [26, -6]]), 1.6, INK, { op: 0.7 }); f.line(G2([[-20, 8], [20, 8]]), 1.2, INK, { op: 0.6 }); } // the ridged side
    if (kind === 2) f.part(G2([[-30, -10], [30, -10], [26, 6], [-26, 6]]), { fill: mix(BONEC, '#fff', 0.15), shade: 0.2, inkW: 1, cast: false }); // the flat side
    if (kind === 3) { f.line(G2([[-8, -14], [0, -2], [8, -14]]), 1.6, INK, { op: 0.7 }); f.flat(G2(ell([0, 4], 5, 4, 0, 8)), '#7a1a12'); } // the twisted side, marked in rubric
  };
  [[0, 0, 0.3, 2.2, 0], [130, -40, -0.5, 2.0, 1], [240, 20, 1.2, 2.3, 2], [100, 90, 2.0, 2.1, 3], [300, -90, 0.2, 1.8, 1]].forEach(([x, y, a, s, k]) => face([x, y], a, s, k));
  for (let i = 0; i < 12; i++) f.flat(F(ell([-60 + r() * 400, 130 + r() * 30], 2, 1.4, 0, 6)), '#3a2a1a', { op: 0.7 });
  return { focus: F([[120, 0]])[0], sig: SB(F, [-330, -140, 360, 150]), feat: [], ells: [0.51] };
};
O.goldleaf = (f, o = {}) => { // close on burned skin: a torn sheet of worn holy gold leaf laid over the burn, crinkled into facets, its edge lifting; a gilder's tip pressing it down, a scrap of leaf drifting
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r;
  forearm(f, F, [-620, 120], [620, 20], 380, 330, { cut: true });
  for (let i = 0; i < 14; i++) { const p = [-200 + r() * 420, 0 + r() * 150]; f.part(F(ell(p, 10 + r() * 14, 6 + r() * 6, r(), 10)), { fill: '#8a4a36', shade: 0.4, inkW: 1, cast: false }); f.flat(F(ell(add(p, [-2, -3]), 3, 2, 0, 6)), '#e8c8b8', { op: 0.7 }); } // burn blisters
  f.flat(F(ell([20, 70], 240, 90, -0.05, 20)), '#5a2a1a', { op: 0.3 });
  const leaf = [[-170, -10], [-90, -60], [-30, -40], [40, -80], [120, -50], [190, -70], [170, 0], [200, 60], [120, 90], [60, 70], [-20, 110], [-110, 80], [-180, 60], [-150, 20]];
  f.part(F(leaf), { fill: '#b09450', shade: 0.35, inkW: 1.5, tex: T(f, 'mottle'), texOp: 0.4 });
  for (let i = 0; i < 16; i++) { const c = [-150 + r() * 320, -40 + r() * 130], q = [c, add(c, [20 + r() * 30, -10 + r() * 20]), add(c, [10 + r() * 20, 20 + r() * 20])]; f.flat(F(q), r() < 0.45 ? '#e4d498' : '#4a3a14', { op: 0.7 }); } // crinkle facets catching light: the contrast is what reads as metal
  for (let i = 0; i < 10; i++) { const p = [-150 + r() * 320, -40 + r() * 130]; L(f, F, [p, add(p, [20 + r() * 40, (r() - 0.5) * 30])], 1.2, '#4a3a14', { op: 0.6 }); }
  f.part(F([[120, -50], [190, -70], [250, -140], [210, -150], [150, -110]]), { fill: '#b89c58', shade: 0.25, inkW: 1.2, cast: false }); // the torn edge lifting
  L(f, F, [[150, -108], [230, -146]], 1.4, '#e0d0a0', { op: 0.7 });
  f.part(F([[300, -190], [340, -200], [350, -170], [310, -165]]), { fill: '#a08848', shade: 0.3, inkW: 1, cast: false }); // a scrap drifting
  const tip = [[-300, -260], [-120, -60], [-90, -80], [-270, -280]]; P(f, F, tip, OAKL, { tex: T(f, 'wood'), texOp: 0.8 }); // the gilder's tip: a handle, a fan of squirrel hair
  f.part(F([[-120, -60], [-40, -10], [-20, -40], [-90, -80]]), { fill: '#4a3a2a', shade: 0.35, inkW: 1.2, cast: false }); for (let i = 0; i < 7; i++) L(f, F, [[-110 + i * 3, -66 + i * 2], [-36 + i * 2, -14 - i * 4]], 0.9, '#8a7a5a', { op: 0.7 });
  return { focus: F([[20, 20]])[0], sig: SB(F, [-200, -160, 260, 120]), feat: [], ells: [] };
};
O.inkarm = (f, o = {}) => { // a bare forearm with three bands of ink, the nearest still filling, its ink running; on Vessel cards (holy, Cole) a worn gold hairline edges each band
  const F = frame([0, 0], o.ang ?? -0.2, 1), r = f.r;
  const a = [-620, 120], b = [600, -40], wa = 260, wb = 210, up = norm(rot(sub(b, a), -Math.PI / 2)), at = (t, k) => add(lerp(a, b, t), mul(up, k * (wa + (wb - wa) * t) / 2));
  forearm(f, F, a, b, wa, wb, { cut: true, skin: '#a8866c' });
  const ink = INKS[o.course] || '#1e1612', gold = o.holy ? '#9a8450' : '#6a5a40';
  const dir = norm(sub(b, a)), edgeAt = (t, k) => add(at(t, k), mul(dir, 14 * (1 - k * k)));   // band edges bow toward the wrist: they wrap the round arm
  [0.36, 0.5, 0.64].forEach((t0, i) => { const t1 = t0 + 0.07, fill = i === 2 ? 0.55 : 1; // the last band is still filling, from the top
    const q = [at(t0, 1.02), at(t1, 1.02), at(t1, 1.02 - 2.04 * fill), at(t0, 1.02 - 2.04 * fill)], ks = []; for (let k = 0; k <= 8; k++) ks.push(1.02 - 2.04 * fill * k / 8);
    f.part(F([...ks.map(k => edgeAt(t0, k)), ...ks.slice().reverse().map(k => edgeAt(t1, k))]), { fill: ink, shade: 0.3, inkW: 0.8, cast: false, sharp: true, tex: T(f, 'mottle'), texOp: 0.4 });
    for (let k = 0; k < 6; k++) { const p = lerp(lerp(q[0], q[1], r()), lerp(q[3], q[2], r()), r()); f.flat(F(ell(p, 4 + r() * 6, 2 + r() * 3, r(), 8)), mix(ink, '#fff', 0.15), { op: 0.35 }); } // ink lying unevenly in the skin
    for (const t of [t0, t1]) { const run = []; for (let k = 0; k <= 8; k++) run.push(edgeAt(t, 1.04 - 2.08 * k / 8)); L(f, F, run, 3, INK, { op: 0.5 }); L(f, F, run, 1.6, gold, { op: 0.9 }); } // the gold hairline, worn
    if (i === 2) { L(f, F, [q[3], q[2]], 2.4, INK, { op: 0.7 }); for (let k = 0; k < 3; k++) { const p = lerp(q[3], q[2], 0.2 + k * 0.3); L(f, F, [p, add(p, mul(up, -20 - r() * 30))], 3, ink, { op: 0.8 }); } }
  });
  K.fxReq(f, 'drip', F([at(0.67, -1.05)])[0], 2, { col: ink });
  return { focus: F([at(0.55, 0)])[0], sig: SB(F, [-260, -160, 320, 160]), feat: [], ells: [] };
};
O.hymnal = (f, o = {}) => O.book(f, Object.assign({ hymn: true }, o));
O.book = (f, o = {}) => { // an open book, front and above: one board path under each side, the page block's thickness at the near and
  // fore edges, the spine rounded below the gutter; with o.hymn, square neumes on four-line staves and one broken note;
  // with o.turn, the right-hand page caught mid-turn, standing up off the block
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, page = '#d6c8a2', board = LEATHER;
  const side = s => ({ gN: [s * 6, 92], mN: [s * 120, 40], oN: [s * 238, 66], oF: [s * 214, -112], mF: [s * 110, -142], gF: [s * 4, -96] });
  for (const s of [-1, 1]) { const q = side(s);
    const bd = [[s * 0, 132], [s * 130, 88], [s * 262, 112], [s * 262, 98], [s * 236, -96], [s * 120, -128], [s * 0, -84]]; // one board path, top and thickness together
    P(f, F, s < 0 ? bd : bd.slice().reverse(), board, { tex: T(f, 'mottle'), texOp: 0.7, dressO: { op: 0.35 } });
    L(f, F, [[s * 0, 118], [s * 130, 74], [s * 262, 98]], 1.6, INK, { op: 0.7 }); // the board's top edge over its thickness
    const blk = [q.gN, q.mN, q.oN, add(q.oN, [s * 2, 20]), add(q.mN, [0, 22]), add(q.gN, [0, 18])];
    f.part(F(s < 0 ? blk : blk.slice().reverse()), { fill: mix(page, '#5a4a30', 0.25), shade: 0.35, inkW: 1.3, cast: false });
    for (let k = 1; k < 5; k++) L(f, F, [add(q.gN, [0, k * 4]), add(q.mN, [0, k * 4.4]), add(q.oN, [0, k * 4])], 0.8, INK, { op: 0.45 });
    f.part(F([q.oN, q.oF, add(q.oF, [s * 6, 16]), add(q.oN, [s * 4, 22])]), { fill: mix(page, '#5a4a30', 0.35), shade: 0.3, inkW: 1.2, cast: false }); // fore-edge
    for (let k = 1; k < 5; k++) L(f, F, [add(q.oN, [s * k, k * 4]), add(q.oF, [s * k * 1.4, k * 3])], 0.8, INK, { op: 0.4 });
    const surf = [q.gN, q.mN, q.oN, q.oF, q.mF, q.gF];
    P(f, F, s < 0 ? surf : surf.slice().reverse(), page, { tex: T(f, 'mottle'), texOp: 0.6, shade: 0.3, dressO: { op: 0.18, dir: s < 0 ? 0.3 : -0.3, from: s < 0 ? 0.7 : 0.2 } });
    for (let k = 0; k < 8; k++) { const t = 0.12 + k * 0.1; if (o.turn && s > 0) continue; const a = lerp(q.gN, q.gF, t), m = lerp(q.mN, q.mF, t), z = lerp(q.oN, q.oF, t);
      if (o.hymn && k % 2 === 0) { for (let j = 0; j < 4; j++) L(f, F, [add(lerp(a, m, 0.25), [0, j * 5 - 8]), add(m, [0, j * 5 - 8]), add(lerp(m, z, 0.85), [0, j * 5 - 8])], 0.8, '#7a1a12', { op: 0.7 });
        for (let j = 0; j < 6; j++) { const p = add(lerp(lerp(a, m, 0.3), lerp(m, z, 0.8), j / 6), [0, -8 + (r() * 4 | 0) * 5]); if (s < 0 && k === 4 && j === 3) { f.flat(F(ell(p, 9, 6, 0.4, 8)), INK, { op: 0.8 }); L(f, F, [p, add(p, [10, 14])], 1.2, INK); } else f.flat(F([add(p, [-4, -3]), add(p, [4, -3]), add(p, [4, 3]), add(p, [-4, 3])]), INK); } }
      else if (!o.hymn) L(f, F, [lerp(a, m, 0.25), m, lerp(m, z, 0.85)], 1.3, INK, { op: 0.65, dash: `${(8 + r() * 14).toFixed(0)} 3 5 3` }); }
    L(f, F, [q.gN, q.gF], 2.4, INK);
  }
  f.part(F([[-18, 122], [18, 122], [26, 142], [0, 154], [-26, 142]]), { fill: mix(board, '#000', 0.2), shade: 0.4, inkW: 1.4 });
  if (o.turn) { const pg = [[6, 92], [60, -40], [96, -210], [70, -230], [20, -110], [4, -96]]; P(f, F, pg, mix(page, '#fff', 0.05), { tex: T(f, 'mottle'), texOp: 0.5, dressO: { op: 0.2 } }); L(f, F, [[14, 60], [60, -60], [84, -190]], 1, INK, { op: 0.5 }); for (let k = 0; k < 6; k++) L(f, F, [[20 + k * 3, 40 - k * 40], [40 + k * 6, 30 - k * 40]], 1, INK, { op: 0.5 }); }
  else f.flat(F([[-190, -90], [-160, -88], [-162, -60], [-192, -62]]), '#7a1a12', { op: 0.9 });
  f.part(F([[-5, -10], [5, -10], [8, 92], [14, 160], [8, 182], [2, 162], [-4, 92]]), { fill: '#2e3a2a', shade: 0.4, inkW: 1.1, cast: false });
  D.stain(f, F([[-110, -20]])[0], 34, '#5a3a18', { op: 0.25 });
  return { focus: F([[0, -30]])[0], sig: SB(F, [-262, -150, 262, 160]), feat: [], ells: [] };
};
O.beacon = (f, o = {}) => { // a lighthouse lens: stepped glass rings in a brass cage, blinding at its centre, glare flooding out
  const F = frame([0, 0], o.ang ?? -0.08, 1), r = f.r;
  P(f, F, [[-230, -230], [230, -230], [230, 230], [-230, 230]], mix(BRASS, '#000', 0.2), { sharp: true, dressO: { op: 0.4 } });
  for (let i = 5; i >= 0; i -= 1) { const R = 40 + i * 34; f.part(F(ell([0, 0], R, R * 1.0, 0, 30)), { fill: mix('#c8d4d0', '#fff', i === 0 ? 0.8 : 0.1 * (5 - i)), shade: 0.35, inkW: 1.6, cast: false, hatch: i > 2 }); f.line(F(ell([-R * 0.25, -R * 0.25], R * 0.7, R * 0.7, 0, 20).slice(10, 16)), 3, '#ffffff', { op: 0.6 }); }
  for (const [x, y] of [[-230, -230], [230, -230], [230, 230], [-230, 230]]) f.rivet(F([[x * 0.9, y * 0.9]])[0], 6, '#8a8670');
  for (let i = 0; i < 4; i++) D.crack(f, F([[60, -60]])[0], i * 1.6, 60 + r() * 50, { n: 4, lip: '#ffffff' });
  D.bloom(f, F([[-180, 180]])[0], 26, VERD, { n: 3 });
  return { focus: F([[0, 0]])[0], sig: SB(F, [-240, -240, 240, 240]), feat: ['crack'], ells: [1.0, 1.0] };
};
O.spectacles = (f, o = {}) => { // round iron spectacles three-quarter on their own: rims and temples in one view, hung from a cord at the bridge
  const F = frame([0, 0], o.ang ?? -0.1, 1), r = f.r;
  const lensE = (x, k) => ell([x, 0], 100 * k, 92, 0, 30);
  [[-110, 1], [120, 0.78]].forEach(([x, k], i) => { f.part(F(lensE(x, k)), { fill: '#8a9a98', shade: 0.25, inkW: 2, hatch: false, opacity: 0.6, tex: T(f, 'mottle'), texOp: 0.3 }); f.line(F(loop(lensE(x, k))), 16, INK); f.line(F(loop(lensE(x, k))), 10, IRON); f.line(F(ell([x - 30 * k, -30], 40 * k, 30, -0.6, 14).slice(0, 6)), 4, '#f4f6f6', { op: 0.6 }); if (i) for (let j = 0; j < 4; j++) D.crack(f, F([[x + 10, 10]])[0], j * 1.5 + 0.4, 50 + r() * 20, { n: 3, lip: '#f4f6f6' }); });
  L(f, F, [[-12, -16], [4, -34], [24, -14]], 14, INK); L(f, F, [[-12, -16], [4, -34], [24, -14]], 8, IRON);
  for (const [s, x0, k] of [[-1, -210, 1], [1, 198, 0.78]]) { const arm = [[x0, -10], [x0 + s * 70 * k, -24], [x0 + s * 120 * k, -10 + 40], [x0 + s * 128 * k, 70]]; L(f, F, arm, 10, INK); L(f, F, arm, 6, IRON); }
  D.bloom(f, F([[-200, 60]])[0], 14, RUST, { n: 2 }); f.scratches(F([[-110, 20]])[0], 50, 6, '#f0f2f2');
  return { focus: F([[-110, 0]])[0], sig: SB(F, [-220, -100, 230, 100]), hook: F([[4, -40]])[0], feat: [], ells: [0.92, 0.72] };
};

// ==== apparatus
O.mortar = (f, o = {}) => { // a heavy stone mortar seen from above: its inner wall and ground horn inside, the pestle leaning, a stag's horn beside
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r;
  const outer = [[-170, -40], [-160, 60], [-120, 140], [120, 140], [160, 60], [170, -40]]; for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; outer.push([170 * Math.cos(t), 140 + 170 * 0.2 * Math.sin(t)]); }
  P(f, F, [...outer.slice(0, 3), ...outer.slice(6).reverse().reverse(), ...outer.slice(3, 6)], STONE, { tex: T(f, 'mottle'), texOp: 0.9 });
  f.part(F(ell([0, -40], 172, 44, 0, 30)), { fill: mix(STONE, '#fff', 0.15), shade: 0.3, inkW: 1.8, cast: false });
  f.part(F(ell([0, -36], 140, 32, 0, 30)), { fill: '#2a241e', shade: 0.15, inkW: 1.4, cast: false }); // the dark well
  f.part(F(ell([0, -30], 140, 32, 0, 30).slice(15, 31)), { fill: mix(STONE, '#000', 0.25), shade: 0.3, inkW: 1, cast: false }); // inner wall, far side
  f.flat(F(ell([10, -26], 90, 16, 0, 20)), '#d8ccb0'); for (let i = 0; i < 12; i++) f.flat(F(ell([-60 + r() * 140, -32 + r() * 14], 3, 1.6, 0, 6)), '#a89878');
  P(f, F, limb([-10, -30], [170, -300], 46, 36, { capK: 0.9 }), '#7a7064', { tex: T(f, 'mottle'), texOp: 0.8 });
  const horn = [[200, 150], [250, 60], [300, -10], [330, -90], [300, -100], [270, -20], [230, 50], [180, 140]]; P(f, F, horn, '#cbb89a', { tex: T(f, 'mottle'), texOp: 0.6 });
  for (const [a, b2] of [[[270, 0], [330, 10]], [[240, 60], [300, 80]]]) P(f, F, limb(a, b2, 20, 8, { capK: 1.2 }), '#cbb89a', { dress: false });
  for (let i = 0; i < 6; i++) L(f, F, [[200 + i * 18, 130 - i * 30], [212 + i * 18, 120 - i * 30]], 1.2, INK, { op: 0.6 }); // the horn's grain
  for (let i = 0; i < 20; i++) f.flat(F(ell([140 + r() * 200, 170 + r() * 30], 2, 1.4, 0, 6)), '#d8ccb0', { op: 0.85 }); // shavings
  D.chip(f, F([[-120, -60]])[0], 12, Math.PI);
  return { focus: F([[0, -30]])[0], sig: SB(F, [-180, -90, 340, 180]), feat: ['contents'], ells: [44 / 172, 32 / 140, 0.2] };
};
O.bellows = (f, o = {}) => { // a pair of bellows from the side, opened in a V: two pear-shaped boards hinged at the brass nozzle, pleated leather between them, handles out behind
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, hinge = [150, 0];
  const topEnd = [-250, -150], botEnd = [-250, 110];
  // the pleated leather: folds radiating from the hinge, alternately lit and shadowed, the back edge zigzagged
  const nP = 7, back = []; for (let i = 0; i <= nP; i++) { const t = i / nP, p = lerp(add(topEnd, [10, 18]), add(botEnd, [10, -14]), t); back.push(add(p, [i % 2 ? -34 : 0, 0])); }
  for (let i = 0; i < nP; i++) { const q = [hinge, back[i], back[i + 1]]; f.part(F(q), { fill: i % 2 ? mix(LEATHER, '#000', 0.3) : mix(LEATHER, '#c8a878', 0.15), shade: 0.35, inkW: 1.4, cast: false, tex: T(f, 'mottle'), texOp: 0.7 }); }
  for (let i = 1; i < nP; i++) L(f, F, [lerp(hinge, back[i], 0.15), back[i]], 1.4, i % 2 ? INK : mix(LEATHER, '#fff', 0.3), { op: 0.7 });
  for (let i = 0; i < 9; i++) f.rivet(F([lerp(add(topEnd, [30, 22]), add(hinge, [-30, -6]), i / 8)])[0], 2.6, '#6a6a66');
  const board = (end, s) => { const m = lerp(hinge, end, 0.55), w = add(m, mul(norm(rot(sub(end, hinge), s * Math.PI / 2)), 70));
    return [hinge, lerp(hinge, w, 0.5), w, add(end, mul(norm(rot(sub(end, hinge), s * Math.PI / 2)), 40)), end, lerp(end, hinge, 0.3)]; };
  for (const [end, s] of [[botEnd, 1], [topEnd, -1]]) { const bd = board(end, s);
    D.slab(f, F(bd), [0, 12], mix(OAKL, '#000', 0.45)); P(f, F, bd, s < 0 ? OAKL : mix(OAKL, '#000', 0.15), { tex: T(f, 'wood'), texOp: 0.9, dressO: { op: 0.35 } });
    P(f, F, limb(end, add(end, [-130, s < 0 ? -36 : 30]), 34, 28, { capK: 0.7 }), OAKL, { tex: T(f, 'wood'), texOp: 0.8, dress: false }); } // the handles
  const cv = [[-120, -150], [-40, -100], [-100, -60], [-150, -110]]; f.part(F(cv), { fill: mix(OAKL, '#c8a878', 0.2), shade: 0.4, inkW: 1.1, cast: false }); // a carved boss on the top board
  P(f, F, [[130, -26], [310, -12], [312, 10], [130, 26]], BRASS, { dressO: { op: 0.4 } }); // the nozzle
  for (const x of [170, 220]) L(f, F, [[x, -22], [x, 22]], 2, INK, { op: 0.6 });
  f.part(F(ell([312, -1], 6, 11, 0, 8)), { fill: '#120c08', shade: 0.1, inkW: 1, cast: false });
  D.crack(f, F([[-120, -170]])[0], 0.4, 70, { n: 4, forks: false, lip: '#a88a62' });
  return { focus: F([[312, 0]])[0], sig: SB(F, [-390, -200, 320, 160]), mouth: F([[312, 0]])[0], grip: { c: F([[-340, -176]])[0], thumb: (o.ang ?? 0) + 0.3 }, feat: [], ells: [0.55] };
};

O.bound = (f, o = {}) => { // Bind: two iron wrist cuffs, open and crossed, bound together where they cross by many turns of the Fatebinder's red thread, its ends trailing
  const F = frame([0, 0], o.ang ?? 0, 1), r = f.r, RED = '#8e1f17';
  const cuff = (c, tilt, ink) => { const G2 = frame(F([c])[0], tilt, 1), rx = 120, ry = 150, dep = [-20, 8];
    const back = loop(ell(dep, rx, ry, 0, 40)), front = loop(ell([0, 0], rx, ry, 0, 40));
    f.line(G2(back), 50, INK); f.line(G2(back), 42, mix(IRON, '#000', 0.4));
    for (let i = 0; i < 10; i++) { const t = Math.PI * (0.6 + i / 9 * 0.8), p = [Math.cos(t) * rx, Math.sin(t) * ry]; f.line(G2([p, add(p, dep)]), 38, mix(IRON, '#000', 0.25)); }
    f.line(G2(front), 50, INK); f.line(G2(front), 42, IRON);
    f.line(G2(ell([0, 0], rx - 10, ry - 10, 0, 40).slice(26, 38)), 6, '#8a8c90', { op: 0.6 }); // a worn bright edge
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2, p = [Math.cos(t) * rx, Math.sin(t) * ry], nrm = [Math.cos(t), Math.sin(t)], sh = Math.cos(t - 0.7) < 0; f.line(G2([add(p, mul(nrm, -18)), add(p, mul(nrm, 18))]), sh ? 1.6 : 1, sh ? INK : '#9a9ca0', { op: sh ? 0.45 : 0.3 }); }   // hatched iron
    f.part(G2([[rx - 24, -30], [rx + 30, -24], [rx + 30, 24], [rx - 24, 30]]), { fill: mix(IRON, '#000', 0.2), shade: 0.4, inkW: 1.4 }); f.rivet(G2([[rx + 4, 0]])[0], 5, '#7a7a76'); // the hinge
    for (const [x, y] of [[-rx * 0.7, ry * 0.7], [0, -ry]]) D.bloom(f, G2([[x, y]])[0], 18, RUST, { n: 3, op: 0.55 });
    const ch = [[-rx * 0.2, ry + 10], [-rx * 0.3, ry + 50], [-rx * 0.2, ry + 90]]; ch.forEach((p, k) => { f.line(G2(loop(ell(p, 14, 20, k % 2 ? 0 : 1.2, 12))), 8, INK); f.line(G2(loop(ell(p, 14, 20, k % 2 ? 0 : 1.2, 12))), 4, '#6a6c70'); }); };
  cuff([-100, 0], -0.35); cuff([110, 10], 0.4);
  // the thread: tight turns over both bands where they cross, a knot, two loose ends
  const X = [0, -110]; for (let i = 0; i < 9; i++) { const p0 = add(X, [-46 + i * 4, -40 + i * 10]), p1 = add(X, [46 - i * 2, -36 + i * 10 + 18]); f.line(F([p0, lerp(p0, p1, 0.5), p1]), 6, INK); f.line(F([p0, lerp(p0, p1, 0.5), p1]), 3.6, RED); }
  f.part(F(ell(add(X, [40, 60]), 14, 11, 0.4, 10)), { fill: RED, shade: 0.4, inkW: 1.4, cast: false });
  const e1 = [add(X, [40, 60]), add(X, [70, 140]), add(X, [40, 220]), add(X, [80, 300])], e2 = [add(X, [40, 60]), add(X, [120, 90]), add(X, [200, 60]), add(X, [260, 110])];
  for (const e of [e1, e2]) { f.line(F(e), 5.4, INK); f.line(F(e), 3.2, RED); }
  return { focus: F([X])[0], sig: SB(F, [-270, -200, 290, 200]), feat: [], ells: [] };
};

module.exports = { O, forearm, INKS };
