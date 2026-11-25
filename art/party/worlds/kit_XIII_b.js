// World XIII, The Black Pyre, second batch: the first batch's kit (kit_XIII, re-exported unchanged) plus the helpers
// this batch needs. The first batch's files are never edited; everything new lives here.
// New: bareArm / bareLegRig (copied from world_XIII.js, where they are local), a brick hearth, cast-iron plate
// modelling (rivet rows, cast seams with thickness, soot and heat bloom), a bat wing (membrane over finger bones), a
// hoofed leg in one outline, a sackcloth fold field, a red-rubric placard and a candle.
'use strict';
const K = require('../kit');
const X = require('./kit_XIII');
const { E, B, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { P, split, side, elb, ang, R } = X;

// a bare arm in one outline from shoulder through elbow to wrist, cut at the elbow for the rig (from world_XIII.js)
function bareArm(f, S0, E0, W0, ws, look, sfx, o = {}) {
  const [c0, c1] = X.jcut(S0, E0, W0, ws[1] / 2);
  return split(f, () => f.part(X.jointLimb(S0, E0, W0, ws, Object.assign({ point: 0.35, mus0: 0.14, mus1: 0.22 }, o)), Object.assign({ maxShade: ws[1] * 0.3 }, look)), [['upperarm' + sfx, c0], ['forearm' + sfx, c1]]);
}
// a bare leg from hip to toes in one outline (kit fullLeg), cut at the knee and the ankle (from world_XIII.js)
// o.after(pts): drawn into the same clip (scabs, char) so it is cut with the leg; o.dir -1 for toes left
function bareLegRig(f, Hp, Kn, A, s, wH, wK, look, sfx, o = {}) {
  const de = elb(Hp, Kn, A), da = add(E.norm(sub(A, Kn)), [0.6, 0]);
  const i0 = f.out.length; const pts = X.fullLeg(f, Hp, Kn, A, 1, s, wH, wK, look, o); if (o.after) o.after(pts); const body = f.out.splice(i0).join('\n');
  const put = (bone, regs) => { let g = body; for (const r of regs) { const id = f.id('rk'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; } f.bone(bone); f.raw(g); };
  put('thigh' + sfx, [side(Kn, mul(de, -1), wK / 2)]);
  put('shin' + sfx, [side(Kn, de, wK / 2), side(A, mul(da, -1), 18)]);
  put('foot' + sfx, [side(A, da, 18)]);
  return pts;
}
// draw() once, then hand the drawing to several bones, each clipped to its region (split for any drawing)
function splitDraw(f, draw, parts) {
  const i0 = f.out.length; const res = draw(); const body = f.out.splice(i0).join('\n');
  for (const [bone, regs] of parts) { let g = body; for (const r of [].concat(regs)) { const id = f.id('sd'); f.defs.push(`<clipPath id="${id}"><path d="${r}"/></clipPath>`); g = `<g clip-path="url(#${id})">${g}</g>`; } f.bone(bone); f.raw(g); }
  return res;
}

// ---------------------------------------------------------------- cloth
// a field of folds hanging from a top edge: each fold a dark tapered valley with a lit lip, slightly wandering
function folds(f, tops, len, w, col, lit, o = {}) {
  for (const t of tops) { const l = len * R(f, 0.6, 1.1), sw = R(f, -0.12, 0.12) + (o.lean || 0); X.crease(f, [t, add(t, [sw * l * 0.4, l * 0.4]), add(t, [sw * l, l])], w * R(f, 0.7, 1.2), { col, lit, op: o.op ?? 0.7 }); }
}
// a placard of a sentence: a small board on a cord, lettered in red rubric, its corners charred. c: centre, a: tilt
function placard(f, c, w, h, a = 0, o = {}) {
  const F = frame(c, a, 1), board = F([[-w / 2, -h / 2, 1], [w / 2, -h / 2 - 2, 1], [w / 2 + 2, h / 2, 1], [-w / 2 - 1, h / 2 + 1, 1]]);
  f.part(board, { fill: o.fill || '#7a7266', shadow: '#2a2622', light: '#a49c8e', shade: 0.35, tex: 'grain' + f.o.seed, texOp: 0.35, inkW: 1.3, inkHeavy: 2, cast: o.cast ?? true, maxShade: 6 });
  X.clipDraw(f, board, () => {
    const rows = o.rows ?? 4;
    for (let i = 0; i < rows; i++) { const y = -h / 2 + h * (i + 0.8) / (rows + 0.6); let x = -w / 2 + w * 0.1; while (x < w / 2 - w * 0.12) { const l = R(f, w * 0.05, w * 0.16); f.line(F([[x, y + R(f, -0.6, 0.6)], [x + l, y + R(f, -0.6, 0.6)]]), i === 0 ? 2.4 : 1.6, P.rubric, { op: 0.9 }); x += l + R(f, 3, 6); } }
    for (const [u, v] of [[-1, -1], [1, 1], [1, -1]]) f.flat(F(ell([u * w / 2, v * h / 2], w * 0.16, h * 0.22, 0.5, 9)), P.charS, { op: 0.85 });
    X.ashCake(f, F([[0, h * 0.2]])[0], w * 0.3, h * 0.2, 3, 0.6, 0.3);
  });
  X.charEdge(f, F([[w / 2 - w * 0.2, h / 2 + 1], [w / 2 + 2, h / 2], [w / 2 + 1, h / 2 - h * 0.3]]), 3, { gap: 4 });
  return F;
}
// a fat church candle of black wax burning black: the cylinder with a lit edge, runs of wax, a cupped top and the wick
function candle(f, bot, top, w, o = {}) {
  const d = E.norm(sub(top, bot)), n = [-d[1], d[0]], wax = o.wax || '#1c1820', waxL = o.waxL || '#5a5262';
  const body = [add(bot, mul(n, w / 2)), add(top, mul(n, w / 2)), add(add(top, mul(n, w * 0.3)), mul(d, 4)), add(top, mul(d, 5)), add(add(top, mul(n, -w * 0.3)), mul(d, 4)), add(top, mul(n, -w / 2)), add(bot, mul(n, -w / 2))];
  f.part(body, { fill: wax, shadow: '#060508', light: waxL, shade: 0.4, inkW: 1.4, inkHeavy: 2.4, maxShade: w * 0.35, cast: o.cast ?? true });
  f.line([lp(bot, top, 0.02, -w * 0.28), lp(bot, top, 0.96, -w * 0.3)], Math.max(1.4, w * 0.09), waxL, { op: 0.6 });
  // runs of wax down the side, each ending in a bead
  for (let i = 0; i < (o.runs ?? 5); i++) { const u = R(f, -0.4, 0.4) * w, l = R(f, 0.12, 0.55) * E.len(sub(top, bot)), a0 = add(top, mul(n, u)), a1 = add(a0, mul(d, -l)); f.stroke([a0, lerp(a0, a1, 0.5), a1], R(f, 4, 7), '#0c0a0e'); f.part(ell(a1, 3.4, 4, 0, 8), { fill: '#16121a', light: waxL, shade: 0.3, inkW: 0.8, inkHeavy: 1, cast: false, hatch: false }); f.line([lerp(a0, a1, 0.1), lerp(a0, a1, 0.7)].map(q => add(q, mul(n, -1.5))), 0.9, waxL, { op: 0.5 }); }
  f.flat(ell(top, w * 0.42, w * 0.12, ang(bot, top) + Math.PI / 2, 12), '#060408'); // the cupped, melted top
  f.line([top, add(add(top, mul(d, 14)), mul(n, 3))], 2.2, '#0a0808'); // the wick
  return add(top, mul(d, 12));
}

// flames painted on cloth or board (an emblem, not fire): one joined band of tongues of mixed sizes along a..b, rising
// along dir (a unit vector: [0,-1] up, [0,1] down for the spared), filled as one union in flat paint with a thin violet
// rim round the outside only. The paint is worn: a few flecks of the ground show through.
function paintedFlames(f, pts, n, h, w, dir, o = {}) {
  const C = X.spline(pts, 3), S = X.arcLen(C), T = S[S.length - 1], list = [];
  for (let i = 0; i < n; i++) {
    const u = T * (i + 0.2 + f.r() * 0.6) / n; let k = 1; while (k < S.length - 1 && S[k] < u) k++;
    const big = i % 2 === 0 || f.r() < 0.3;
    X.tongue(f, list, C[k], h * (big ? R(f, 0.8, 1.15) : R(f, 0.35, 0.6)), w * (big ? R(f, 0.9, 1.2) : R(f, 0.5, 0.75)), { dir, rise: o.rise ?? -0.6, curl: R(f, -1.3, 1.3), sway: 0.5, noFork: !big || o.noFork });
  }
  const d = E.norm(dir), band = X.ribbon(C, C.map(() => h * (o.band ?? 0.18)));
  const polys = [band, ...list.map(t => t.poly)];
  for (const p of polys) f.line([...p, p[0]], 2.2, o.edge || P.vio, { op: o.edgeOp ?? 0.6 });
  for (const p of polys) f.flat(p, o.col || '#141014', { op: o.op ?? 0.92 });
  for (let i = 0; i < Math.round(n * 1.5); i++) { const t = list[Math.floor(f.r() * list.length)], q = t.C[Math.floor(f.r() * t.C.length * 0.6)]; f.flat(ell(q, R(f, 1, 2.6), R(f, 0.8, 1.8), f.r() * 3, 6), o.ground || P.sack, { op: 0.8 }); }
  return list;
}

// ---------------------------------------------------------------- iron, cast and hammered
const IRON = (f, o = {}) => Object.assign({ fill: P.iron, shadow: '#0a090b', light: P.ironL, shade: 0.4, tex: 'mottle' + f.o.seed, texOp: 0.6 }, o);
// a row of rivet heads along a line, some popped out leaving dark sockets (popped: probability)
function rivetRow(f, pts, gap, r, o = {}) {
  const C = X.spline(pts, 2), S = X.arcLen(C), T = S[S.length - 1], out = [];
  for (let s = gap * 0.5; s < T; s += gap) {
    let k = 1; while (k < S.length - 1 && S[k] < s) k++;
    const q = C[k];
    if (f.r() < (o.popped || 0)) { f.flat(ell(q, r * 0.8, r * 0.7, 0, 8), '#050405'); f.line(ell(q, r * 0.95, r * 0.85, 0, 8).slice(4, 8), 0.9, P.ironL, { op: 0.6 }); out.push(null); continue; }
    f.flat(ell(add(q, mul(f.L, -r * 0.6)), r * 1.1, r * 0.9, 0, 8), '#000', { op: 0.45 });
    f.part(ell(q, r, r * 0.9, 0, 10), { fill: o.col || P.iron, shadow: '#070607', light: P.ironL, shade: 0.45, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false, maxShade: r * 0.6 });
    f.flat(ell(add(q, mul(f.L, r * 0.35)), r * 0.35, r * 0.28, 0, 6), o.hi || '#9a96a0', { op: 0.6 });
    out.push(q);
  }
  return out;
}
// a cast seam between two plates: the plate edge stands proud with its thickness showing (a lit lip and a dark step)
function plateSeam(f, pts, o = {}) {
  const C = X.spline(pts, 3), t = o.t ?? 6, sd = o.side ?? 1;
  const off = X.offsetLine(C, () => t * sd);
  f.stroke(C, t * 1.6, '#050405', { op: 0.85 });
  f.line(off, t * 0.7, o.lip || P.ironL, { op: o.lipOp ?? 0.55 });
  f.line(X.offsetLine(C, () => t * sd * 1.4), 1, '#000', { op: 0.6 });
  if (o.rivets) rivetRow(f, X.offsetLine(C, () => t * sd * 2.8), o.rivets, o.rr || 6, { popped: o.popped });
  return C;
}
// heat bloom on blackened iron: rings of temper colour round a hot spot, here the void's cold violet-grey, never orange
function heatBloom(f, c, rx, ry, a = 0) {
  f.raw(`<path d="${E.smooth(ell(c, rx, ry, a, 16))}" fill="${P.vioD}" opacity="0.22" filter="url(#smkL${f.o.seed})"/>`);
  f.raw(`<path d="${E.smooth(ell(c, rx * 0.6, ry * 0.6, a, 14))}" fill="#6a5a7a" opacity="0.18" filter="url(#smk${f.o.seed})"/>`);
  f.raw(`<path d="${E.smooth(ell(c, rx * 1.25, ry * 1.25, a, 16))}" fill="#000" opacity="0.18" filter="url(#smkL${f.o.seed})"/>`);
}
// soot streaks rising from a source: soft dark tongues licking up the surface
function sootStreaks(f, base, n, h, w, o = {}) {
  for (let i = 0; i < n; i++) { const b = add(base, [R(f, -w, w), R(f, -6, 6)]), l = h * R(f, 0.5, 1.1), lean = (o.lean || 0) + R(f, -0.2, 0.2); const pts = [b, add(b, [lean * l * 0.4 + R(f, -8, 8), -l * 0.5]), add(b, [lean * l, -l])]; f.raw(`<path d="${E.smooth(X.ribbon(pts, [w * 0.5, w * 0.3, 2]))}" fill="#050405" opacity="${(o.op ?? 0.45) * R(f, 0.6, 1)}" filter="url(#smk${f.o.seed})"/>`); }
}
// flaking scale on wrought iron: small lifted chips with a pale under-edge
function scale(f, c, rx, ry, n, s = 1) {
  for (let i = 0; i < n; i++) { const p = X.scatter(f, c, rx, ry), a = f.r() * 6.3, l = R(f, 5, 12) * s; const q = [p, add(p, rot([l, -l * 0.3], a)), add(p, rot([l * 0.9, l * 0.4], a)), add(p, rot([l * 0.2, l * 0.45], a))]; f.flat(q, '#121012', { op: 0.85 }); f.line([q[1], q[2]], 1, '#8a8690', { op: 0.55 }); }
}

// ---------------------------------------------------------------- the hearth: firebricks in courses, seen from slightly above
// x0..x1 along the front, y0 the top edge of the front face, y1 the ground; depth: how far the top recedes (up and right)
function hearth(f, x0, x1, y0, y1, depth, o = {}) {
  const dv = [depth * 0.55, -depth * 0.35], BR = { fill: '#4a4244', shadow: '#151213', light: '#7a7072', shade: 0.35, tex: 'mottle' + f.o.seed, texOp: 0.5, inkW: 1.1, inkHeavy: 1.4, cast: false, maxShade: 6 };
  const top = [[x0, y0], [x1, y0], add([x1, y0], dv), add([x0, y0], dv)];
  f.part(top.map(q => [...q, 1]), Object.assign({}, BR, { fill: '#3a3436', inkW: 1.6, maxShade: 20 }));
  const side2 = [[x1, y0], add([x1, y0], dv), add([x1, y1], dv), [x1, y1]];
  f.part(side2.map(q => [...q, 1]), Object.assign({}, BR, { fill: '#2a2426', inkW: 1.6, maxShade: 20 }));
  const front = [[x0, y0, 1], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1]];
  f.part(front, Object.assign({}, BR, { inkW: 1.8, inkHeavy: 3, maxShade: 30, cast: true }));
  const bh = o.bh ?? 30, bw = o.bw ?? 92;
  X.clipDraw(f, front, () => {
    for (let r = 0, y = y0; y < y1; r++, y += bh) {
      for (let x = x0 - (r % 2) * bw / 2; x < x1; x += bw) {
        const q = [[x + 2, y + 2], [x + bw - 2, y + 2 + R(f, -1, 1)], [x + bw - 2, y + bh - 2], [x + 2, y + bh - 2 + R(f, -1, 1)]];
        const t = f.r();
        f.part(q.map(p => [...p, 1]), Object.assign({}, BR, { fill: t < 0.3 ? '#3e3638' : t < 0.6 ? '#544a4a' : '#463e40', light: '#8a8082' }));
        if (f.r() < 0.25) X.hairline(f, [[x + R(f, 10, bw - 10), y + 4], [x + R(f, 10, bw - 10), y + bh / 2], [x + R(f, 10, bw - 10), y + bh - 4]], 1);
        if (f.r() < 0.2) f.flat(ell([x + R(f, 10, bw - 10), y + R(f, 6, bh - 6)], 8, 4, 0, 8), '#1a1618', { op: 0.6 });
      }
      f.line([[x0, y], [x1, y]], 3, '#120f10', { op: 0.85, straight: true }); // the mortar course
    }
    sootStreaks(f, [(x0 + x1) / 2, y0 + 20], 10, (y1 - y0) * 0.9, (x1 - x0) * 0.45, { op: 0.35 });
  });
  X.clipDraw(f, side2, () => { for (let y = y0; y < y1 + depth; y += bh) f.line([[x1, y], add([x1, y], dv)], 2.4, '#0e0b0c', { op: 0.8 }); });
  X.ashCake(f, [(x0 + x1) / 2, y0 + 6], (x1 - x0) * 0.4, 8, 10, 1.1, 0.5);
  return { top, front, side: side2, dv };
}

// ---------------------------------------------------------------- bat wing: membrane over finger bones
// A bat's wing from the shoulder S: humerus to the elbow E, forearm to the wrist W, a thumb claw at the wrist, digits
// 3, 4 and 5 fanning from the wrist to their tips (d: [[angle, length]] in screen radians), digit 2 running close
// along digit 3. The membrane (patagium) spans shoulder, finger tips and the flank point Fk, its trailing edge scalloped
// between the tips. Fire has charred it to lace: holes, a ragged trailing edge with a violet thread, clean round void
// holes (o.holes). o.fold 0..1 bunches the membrane (wing raised mid-beat). o.dim darkens the far wing.
function batWing(f, S, Eb, W, digits, Fk, o = {}) {
  const dim = o.dim || 0, sk = mix(o.skin || '#5a5256', '#000', dim), bone = mix('#8a8084', '#000', dim);
  const tips = digits.map(([a, l, bend = 0]) => { const k = add(W, rot([l * 0.55, 0], a)); return { k, t: add(k, rot([l * 0.45, 0], a + bend)) }; });
  // the membrane: from the shoulder along the forearm (leading edge), out to the tips; trailing edge back to the flank
  const lead = [S, lerp(S, Eb, 0.5), Eb, W, tips[0].t];
  const trail = [];
  for (let i = 0; i < tips.length; i++) {
    const a = tips[i].t, b = i + 1 < tips.length ? tips[i + 1].t : Fk, m = lerp(a, b, 0.5), toward = E.norm(sub(W, m)), sc = E.len(sub(a, b)) * (0.18 + (o.fold || 0) * 0.1);
    trail.push(a, add(m, mul(toward, sc)));
  }
  trail.push(Fk);
  let mem = [...lead, ...trail.slice(1)];
  // ragged trailing edge: notch the scallops with burnt bites
  const ragged = [];
  for (let i = 0; i < mem.length; i++) { ragged.push(mem[i]); if (i >= lead.length - 1 && i < mem.length - 1) { const a = mem[i], b = mem[i + 1]; for (let k = 1; k < 4; k++) { const q = lerp(a, b, k / 4), nn = E.norm(sub(W, q)); ragged.push([...add(q, mul(nn, R(f, 0, 14) * (o.rag ?? 1))), f.r() < 0.4 ? 1 : 0]); } } }
  mem = ragged;
  const holes = o.holes || [];
  const memLook = { fill: mix('#4e464a', '#000', dim), shadow: '#100c10', light: mix('#857a80', '#000', dim), shade: 0.35, tex: 'craze' + f.o.seed, texOp: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, maxShade: 6, k: 0.5 };
  // burnt lace: irregular holes cut right through the membrane (see-through), bigger toward the trailing edge, each with
  // a charred, violet-threaded rim; plus the void's clean round holes
  const lace = [];
  for (let i = 0; i < (o.lace ?? 7); i++) {
    const ti = Math.floor(f.r() * tips.length), q = lerp(W, lerp(tips[ti].t, tips[Math.min(tips.length - 1, ti + 1)].t, f.r()), R(f, 0.5, 0.88)), r = R(f, 3, 8) * (o.s || 1), pts = [];
    for (let k = 0; k < 8; k++) { const t = k / 8 * 6.283; pts.push(add(q, [Math.cos(t) * r * R(f, 0.6, 1.3), Math.sin(t) * r * R(f, 0.6, 1.3)])); }
    lace.push(pts);
  }
  const id = f.id('bw'), circ = ([c, r]) => `M${(c[0] + r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] - r).toFixed(1)},${c[1].toFixed(1)} A${r},${r} 0 1,0 ${(c[0] + r).toFixed(1)},${c[1].toFixed(1)}Z`;
  f.defs.push(`<clipPath id="${id}"><path clip-rule="evenodd" d="M-4000,-4000H8000V8000H-4000Z ${lace.map(l => E.smooth(l)).join(' ')} ${holes.map(circ).join(' ')}"/></clipPath>`);
  const i0 = f.out.length;
  f.part(mem, memLook);
  X.clipDraw(f, mem, () => {
    for (const l of lace) { const c = l.reduce((a, b) => add(a, b), [0, 0]).map(v => v / l.length); f.flat(l.map(p => add(c, mul(sub(p, c), 1.6))), P.charS, { op: 0.75 }); }
    // the finger bones' shadow lines and stretch wrinkles running from the bones to the edge
    for (const tp of tips) for (let k = 0; k < 2; k++) f.line([lerp(W, tp.k, R(f, 0.3, 0.8)), lerp(lerp(W, tp.t, 0.6), Fk, R(f, 0.1, 0.4))], 0.8, '#0a080a', { op: 0.4 });
    X.stains(f, E.smooth(mem), E.bbox(mem).map((v, i) => v + (i < 2 ? -10 : 10)), P.charS, 0.05, 2.6, -1.3, Math.round(S[0]) % 50, 0.5);
  });
  const body = f.out.splice(i0).join('\n'); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  for (const l of lace) f.line([...l.slice(3), l[0]], 0.9, P.vio, { op: 0.85 });
  for (const [c, r] of holes) { const e = ell(c, r + 0.4, r + 0.4, 0, 24); f.line(e.concat([e[0]]), 1.3, P.ashW, { op: 0.9 }); }
  // the burnt trailing edge: a char band with the violet thread, few curls
  X.charEdge(f, mem.slice(lead.length - 1), 2.6, { gap: 14, s: 0.4 });
  // bones: humerus and forearm (thicker, with joints), the thumb claw, the finger bones with knuckles
  const BN = { fill: bone, shadow: '#0a080a', light: mix('#8a8086', '#000', dim), shade: 0.4, tex: 'craze' + f.o.seed, texOp: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, maxShade: 4 };
  const fs = o.s || 1;
  f.part(limb(S, Eb, 14 * fs, 9 * fs, { steps: 6, p: [[0.3, 0.3, 0.15]] }), Object.assign({}, BN, { fill: sk }));
  f.part(limb(Eb, W, 8 * fs, 6 * fs, { steps: 6 }), BN);
  f.part(ell(Eb, 5 * fs, 4.4 * fs, 0, 8), BN); f.part(ell(W, 5 * fs, 4.4 * fs, 0, 8), BN);
  tips.forEach((tp, i) => { f.part(limb(W, tp.k, 4.6 * fs, 3.6 * fs, { steps: 4 }), BN); f.part(limb(tp.k, tp.t, 3.6 * fs, 1.8 * fs, { steps: 4 }), BN); f.part(ell(tp.k, 2.6 * fs, 2.4 * fs, 0, 6), BN); });
  // digit 2: short, close along digit 3
  const d2 = add(W, rot([digits[0][1] * 0.42, 0], digits[0][0] - 0.12)); f.part(limb(W, d2, 3.6 * fs, 2.6 * fs, { steps: 4 }), BN);
  // the thumb: a short digit and a hooked claw at the leading edge
  const ta = ang(Eb, W) - 0.9 * (o.tr ?? 1), th = add(W, rot([10 * fs, 0], ta)), tc = add(th, rot([7 * fs, 0], ta + 0.9 * (o.tr ?? 1)));
  f.part(limb(W, th, 4 * fs, 3 * fs, { steps: 4 }), BN); f.part([th, add(th, rot([3 * fs, -2 * fs], ta)), tc, add(th, rot([2 * fs, 3 * fs], ta))], { fill: '#141012', inkW: 0.9, inkHeavy: 1, cast: false, hatch: false });
  return { tips, mem };
}

// ---------------------------------------------------------------- hoofed leg (horse, goat) in one outline
// pts: [top, j1, j2, fetlock, coronet] along the leg's centre; ws: widths there; o.bp/o.bq bulges ([seg, t, amp]).
// Returns the outline; the hoof is drawn separately with hoof().
function hoofLegShape(pts, ws, o = {}) { return K.chain(pts, ws, { steps: 10, bp: o.bp, bq: o.bq }); }
// a hoof seen from the side: the wall sloping from the coronet to the ground, a heel, growth rings; HF0: frame with u
// along the sole toward the toe, v up toward the coronet (negative v is up). s: size. o.shoe: an iron shoe; o.split.
function hoof(f, HF0, s, look, o = {}) {
  const q = pts => HF0(pts.map(([u, v, k]) => k ? [u * s, v * s, 1] : [u * s, v * s]));
  const wall = q([[-0.9, 0, 1], [1.0, 0, 1], [0.82, -0.36], [0.4, -1.1], [-0.3, -1.0], [-0.72, -0.62], [-0.92, -0.3]]);
  f.part(wall, Object.assign({}, look, { maxShade: s * 0.3, cast: false }));
  X.clipDraw(f, wall, () => {
    for (let i = 0; i < 4; i++) f.line(q([[-0.9, -0.2 - i * 0.18], [0.1, -0.26 - i * 0.2], [1.0, -0.12 - i * 0.2]]), 1.1, '#000', { op: 0.45 });
    f.line(q([[0.35, -1.0], [0.72, -0.5], [0.92, -0.18]]), 2.4, '#7a7276', { op: 0.4 });
    if (o.split) { f.line(q([[0.3, -1.05], [0.22, -0.5], [0.3, -0.04]]), 2.4, '#000'); X.hairline(f, q([[0.32, -0.9], [0.26, -0.5], [0.3, -0.15]]), 1); }
  });
  f.part(q([[-0.66, -0.76], [-0.24, -1.12], [0.46, -1.2], [0.52, -1.02], [-0.18, -0.92]]), Object.assign({}, look, { fill: mix(look.fill, '#000', 0.3), cast: false, inkW: 1.1, maxShade: 4 })); // the coronet band
  if (o.shoe) { const sh = q([[-0.94, 0.02, 1], [1.06, 0.02, 1], [1.04, -0.2], [-0.92, -0.2]]); f.part(sh, { fill: '#2e2c30', shadow: '#060506', light: P.ironL, shade: 0.4, inkW: 1.2, inkHeavy: 1.8, cast: false, maxShade: 4 }); for (const u of [-0.6, -0.15, 0.3, 0.75]) f.rivet(q([[u, -0.1]])[0], Math.max(1.4, s * 0.04), '#6a666e'); }
  return wall;
}

module.exports = Object.assign({}, X, { bareArm, bareLegRig, splitDraw, folds, placard, candle, IRON, rivetRow, plateSeam, heatBloom, sootStreaks, scale, hearth, batWing, hoofLegShape, hoof, paintedFlames });
