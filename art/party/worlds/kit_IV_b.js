// World IV, The Sulphur Pits, second batch: helpers for world_IV_b.js (on top of kit_IV.js, which stays unchanged).
// Horse anatomy for the pit pony and the mill horse, flames for lamps and candles, open iron oil lamps, clumped fur,
// gallery rats. Everything draws into the current bone unless a helper says otherwise.
'use strict';
const K = require('../kit');
const W = require('./kit_IV');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, lp, ell, frame } = E;
const { P, split, side } = W;

// ------------------------------------------------------------------ fire
// a fire flame wrapped round its fuel at b, licking upward, s ~ height (same construction as world_IV's torch flame)
function flame(f, b, s, o = {}) {
  const ph = o.phase ?? 0, lean = o.lean ?? 0.15, w0 = o.w ?? s * 0.24;
  if (o.glow !== false) W.glow(f, add(b, [s * lean * 0.4, -s * 0.3]), s * 0.6, s * 0.6, P.lampL, o.glowOp ?? 0.22, s > 60);
  const body = (w, hh, k) => {
    const pts = [], n = 40;
    for (let i = 0; i < n; i++) {
      const u = Math.PI * 2 * i / n, up = Math.max(0, -Math.sin(u)), dn = Math.max(0, Math.sin(u));
      const jag = 0.55 + 0.45 * Math.pow(Math.abs(Math.sin(3.2 * u + ph + k)), 0.7) * (0.8 + 0.4 * Math.sin(7 * u + k * 2));
      const y = -hh * Math.pow(up, 1.6) * jag + w * 0.42 * dn, x = w * Math.cos(u) * (1 - 0.55 * Math.pow(up, 2)) + lean * -y * (1 + 0.3 * Math.sin(u * 2 + k));
      const sharp = up > 0.5 && Math.abs(Math.sin(3.2 * u + ph + k)) > 0.93;
      pts.push(sharp ? [b[0] + x, b[1] + y, 1] : [b[0] + x, b[1] + y]);
    }
    return pts;
  };
  f.flat(body(w0, s, 0), P.ember, { op: 0.8 });
  f.flat(body(w0 * 0.86, s * 0.82, 0.5), P.lamp, { op: 0.95 });
  f.flat(body(w0 * 0.62, s * 0.56, 1.1), P.lampL, { op: 0.95 });
  f.flat(body(w0 * 0.4, s * 0.32, 1.7), P.hot);
  f.flat(ell(add(b, [0, -s * 0.04]), w0 * 0.22, w0 * 0.3, 0, 10), P.core);
  for (let i = 0; i < 3; i++) f.line([add(b, [-w0 * 0.4 + i * w0 * 0.35, -s * 0.08]), add(b, [-w0 * 0.3 + i * w0 * 0.3 + s * lean * 0.3, -s * (0.4 + (i % 2) * 0.12)])], Math.max(0.7, s * 0.012), '#7a2410', { op: 0.5 });
  if (o.smoke !== false) W.smoke(f, add(b, [s * lean * 1.2, -s * 1.0]), s * 0.8, s * 0.22, { col: '#241e1a', op: 0.45, line: '#4a4038', sway: s * 0.1, drift: s * 0.15 });
}
// a small steady flame (a wick, a candle): a narrow tongue, a blue-less hot base, a soft bloom, a soot thread
function wickFlame(f, b, s, o = {}) {
  const lean = o.lean ?? 0.1;
  if (o.glow !== false) W.glow(f, add(b, [0, -s * 0.4]), s * 1.3, s * 1.2, P.lampL, o.glowOp ?? 0.35);
  const tip = add(b, [s * lean, -s]);
  f.flat([add(b, [-s * 0.22, 0]), add(b, [-s * 0.24, -s * 0.3]), add(b, [-s * 0.1 + s * lean * 0.5, -s * 0.66]), [...tip, 1], add(b, [s * 0.14 + s * lean * 0.5, -s * 0.6]), add(b, [s * 0.24, -s * 0.28]), add(b, [s * 0.2, s * 0.06])], P.lamp, { op: 0.95 });
  f.flat([add(b, [-s * 0.12, -s * 0.04]), add(b, [-s * 0.1, -s * 0.3]), [...add(b, [s * lean * 0.6, -s * 0.66]), 1], add(b, [s * 0.12, -s * 0.28]), add(b, [s * 0.1, 0])], P.hot);
  f.flat(ell(add(b, [0, -s * 0.08]), s * 0.07, s * 0.12, 0, 8), P.core);
  if (o.soot !== false) f.line([add(tip, [0, -s * 0.1]), add(tip, [-s * 0.2, -s * 0.5]), add(tip, [s * 0.1, -s * 0.9])], Math.max(0.8, s * 0.05), P.sootD, { op: 0.5 });
}
// an open iron oil lamp (a cruisie) hanging from hook point h: a hanger rod with a hook, a shallow leaf-shaped iron pan
// with a pinched spout, a rush wick lying in the spout and lit, oil drips, soot. dir +1: spout points right. s ~ pan length.
function oilLamp(f, h, s, o = {}) {
  const dir = o.dir ?? 1, X = (x, y) => add(h, [x * s * dir, y * s]), lit = o.lit !== false;
  const IR = { fill: P.ironL, shadow: '#15110e', shade: 0.42, inkW: Math.max(0.8, s * 0.035), inkHeavy: Math.max(1, s * 0.06), cast: false, tex: 'mottle' + f.o.seed, texOp: 0.5 };
  // hook over the bar, rod down to the pan's back
  f.line([X(-0.06, 0.06), X(-0.1, -0.06), X(0.0, -0.1), X(0.06, -0.02), X(0.02, 0.1), X(0.0, 0.42)], Math.max(1.6, s * 0.06) + 1.6, INK);
  f.line([X(-0.06, 0.06), X(-0.1, -0.06), X(0.0, -0.1), X(0.06, -0.02), X(0.02, 0.1), X(0.0, 0.42)], Math.max(1, s * 0.06), P.ironL);
  // the pan: a shallow dish, its rim toward us, the spout pinched out front
  const pan = [X(-0.18, 0.4), X(0.2, 0.38), X(0.42, 0.4), X(0.62, 0.36), [...X(0.7, 0.38), 1], X(0.56, 0.5), X(0.3, 0.6), X(0.02, 0.62), X(-0.2, 0.54)];
  f.part(pan, IR);
  f.flat([X(-0.12, 0.42), X(0.2, 0.4), X(0.5, 0.41), X(0.6, 0.39), X(0.4, 0.46), X(0.1, 0.47), X(-0.1, 0.46)], '#1c1610', { op: 0.85 }); // oil inside
  f.line([X(-0.1, 0.43), X(0.3, 0.42)], 0.8, '#a89060', { op: 0.6 }); // oil sheen
  f.line([X(-0.16, 0.52), X(0.2, 0.58), X(0.5, 0.48)], 0.9, '#8a8278', { op: 0.6 }); // worn rim
  f.flat(ell(X(0.3, 0.64), s * 0.04, s * 0.06, 0, 6), '#2a2214', { op: 0.8 }); // drip under the pan
  const tip = X(0.68, 0.36);
  f.line([X(0.46, 0.41), tip], Math.max(1.2, s * 0.05), '#d8c8a0'); // the rush wick lying in the spout
  if (lit) wickFlame(f, add(tip, [dir * 1, -1]), s * (o.fs ?? 0.42), { lean: 0.08 * dir, glowOp: o.glowOp ?? 0.32, soot: o.soot });
  f.raw(`<ellipse cx="${X(0.1, 0.42)[0].toFixed(1)}" cy="${X(0.1, 0.42)[1].toFixed(1)}" rx="${(s * 0.3).toFixed(1)}" ry="${(s * 0.1).toFixed(1)}" fill="url(#soot${f.o.seed})" opacity="0.7"/>`);
  return { tip, pan };
}

// ------------------------------------------------------------------ hair
// clumped hair or fur along an edge: tapered locks growing out along `dir` (screen vector or per-point function), each a
// pointed lobe with its own ink, uneven lengths, a lit strand on a few; matted, never parallel stripes.
function fur(f, edge, dir, L, n, col, o = {}) {
  const dk = mix(col, '#000', 0.45), lt = mix(col, '#fff', 0.28);
  const C = W.spline(edge, 3); const S = W.arcLen(C), tot = S[S.length - 1];
  for (let i = 0; i < n; i++) {
    const u = (i + 0.2 + f.r() * 0.6) / n * tot, a = W.at(C, S, u), dd = typeof dir === 'function' ? dir(a.p, i) : dir;
    const d = E.norm(add(dd, [(f.r() - 0.5) * (o.jit ?? 0.5), (f.r() - 0.5) * (o.jit ?? 0.5)])), nn = [-d[1], d[0]];
    const l = L * W.R(f, 0.55, 1.2) * (i % 5 === 2 ? 1.3 : 1), w = (o.w ?? L * 0.32) * W.R(f, 0.7, 1.2), curl = (f.r() - 0.5) * (o.curl ?? 0.6);
    const b = a.p, m = add(add(b, mul(d, l * 0.5)), mul(nn, curl * l * 0.3)), t = add(add(b, mul(d, l)), mul(nn, curl * l * 0.6));
    const pts = o.blunt ? [add(b, mul(nn, w / 2)), add(m, mul(nn, w * 0.45)), add(t, mul(nn, w * 0.2)), add(t, mul(d, w * 0.1)), add(t, mul(nn, -w * 0.18)), add(m, mul(nn, -w * 0.42)), add(b, mul(nn, -w / 2))] : [add(b, mul(nn, w / 2)), add(m, mul(nn, w * 0.32)), [...t, 1], add(m, mul(nn, -w * 0.3)), add(b, mul(nn, -w / 2))];
    f.part(pts, { fill: i % 3 === 1 ? mix(col, '#000', 0.15) : col, shadow: dk, shade: 0.45, inkW: o.inkW ?? 0.9, inkHeavy: o.inkH ?? 1.3, cast: false, hatch: false, gritOp: 0.3, k: 0.8 });
    if (i % 3 === 0) f.line([add(b, mul(d, l * 0.15)), add(m, mul(nn, -w * 0.05)), lerp(m, t, 0.6)], 0.8, lt, { op: 0.6 });
    if (o.singe && f.r() < o.singe) f.flat(ell(t, w * 0.35, w * 0.35, 0, 6), P.char, { op: 0.9 });
  }
}

// ------------------------------------------------------------------ horse
// A horse or pony side-on, facing right, built in units of its withers height u from a ground point O (under the girth).
// Template points: x forward, y up negative, ground y = 0. o.tilt lowers the forehand (rad, about the girth). Legs are
// chains in template units: front [elbow, knee, mid-cannon, fetlock, coronet], hind [gaskin top, hock, mid-cannon,
// fetlock, coronet]; a lifted hoof just has its coronet off the ground. Draw in order: farLegs, body, nearLegs, head
// (the caller interleaves harness or a rider). Bones: spine_1 (hindquarters, root), spine_2 (forehand), neck, head,
// tail, leg_{fn,ff,hn,hf}_{1,2,3}. Joints are declared by joints().
function horse(f, o) {
  const u = o.u, O = o.O, gy = f.o.groundY, tilt = o.tilt ?? 0, pivot = [O[0], gy - 0.5 * u];
  const ln = o.len ?? 1, A = (x, y) => [O[0] + x * u * ln, gy + y * u];
  const Bp = (x, y) => add(pivot, rot(sub(A(x, y), pivot), tilt));
  const coat = o.coat, coatD = o.coatD, coatL = o.coatL;
  const look = (oo = {}) => Object.assign({ fill: coat, shadow: coatD, light: coatL, shade: 0.36, maxShade: u * 0.09, tex: 'mottle' + f.o.seed, texOp: 0.55 }, oo);
  const bl = o.bloat ?? 0, dr = o.draught ?? 1;
  // body + neck in one outline; neck and head from o.poll, o.hA (head axis angle), o.Lh (head length in u)
  const Lh = (o.Lh ?? 0.42) * u, hA = o.hA ?? 1.2;
  const PL = o.poll ? A(...o.poll) : Bp(0.66, -1.3);
  const HF = frame(PL, hA, Lh);
  const TL = HF([[0.04, 0.36]])[0];
  const W0 = Bp(0.2, -1.0), NB = Bp(0.46, -0.84);
  const crest = add(lerp(W0, PL, 0.48), mul(E.norm(rot(sub(PL, W0), -Math.PI / 2)), u * (0.06 + 0.06 * dr)));
  const throat = add(lerp(NB, TL, 0.5), mul(E.norm(rot(sub(TL, NB), Math.PI / 2)), u * 0.02));
  const body = [
    W0, Bp(0.04, -0.965), Bp(-0.24, -0.975), Bp(-0.44, -1.0), Bp(-0.6, -0.985), Bp(-0.7, -0.93), [...Bp(-0.79, -0.8), 0], Bp(-0.81, -0.68), Bp(-0.75, -0.55),
    Bp(-0.62, -0.5), Bp(-0.5, -0.53), Bp(-0.42, -0.6 + bl * 0.05), Bp(-0.3, -0.52 + bl * 0.1), Bp(-0.1, -0.47 + bl * 0.12), Bp(0.08, -0.47 + bl * 0.06),
    Bp(0.17, -0.49), Bp(0.3, -0.53), Bp(0.38, -0.6), Bp(0.45, -0.7), Bp(0.47, -0.78), NB, throat, TL,
    PL, crest, add(lerp(W0, crest, 0.5), mul(E.norm(rot(sub(crest, W0), -Math.PI / 2)), u * 0.02)),
  ];
  const cut = Bp(-0.2, -0.75), cutD = E.norm(sub(Bp(1, -0.75), Bp(0, -0.75)));
  const neckCut = lerp(NB, W0, 0.45), neckD = E.norm(sub(PL, neckCut));
  const L = o.legs;
  const legP = k => { const l = L[k]; return l.map((q, i) => i === 0 ? Bp(...q) : A(...q)); };
  const tailRoot = Bp(-0.7, -0.93);
  const R = {
    A, Bp, PL, HF, TL, W0, NB, body, u, look, Lh, hA, tailRoot, legP,
    joints(parentRoot = null) {
      f.joint('spine_1', Bp(-0.35, -0.75), parentRoot).joint('spine_2', cut, 'spine_1').joint('neck', neckCut, 'spine_2').joint('head', HF([[0.06, 0.18]])[0], 'neck').joint('tail', tailRoot, 'spine_1');
      for (const k of ['fn', 'ff', 'hn', 'hf']) { const p = legP(k); f.joint(`leg_${k}_1`, p[0], k[0] === 'f' ? 'spine_2' : 'spine_1').joint(`leg_${k}_2`, p[1], `leg_${k}_1`).joint(`leg_${k}_3`, p[3], `leg_${k}_2`); }
      return R;
    },
    // one leg: one outline from inside the body to the coronet, built from anatomical stations (independent review,
    // 2026-11-23) instead of a tapered chain: fore = the forearm's muscle tapering into a flat, bony knee (the accessory
    // carpal bump behind it), a narrow flat cannon with the tendon standing off behind it, the fetlock's round joint (the
    // ergot behind), a sloped pastern and the hoof; hind = the gaskin's muscle swelling behind, the point of hock jutting
    // back with the hamstring running to it, then the cannon, fetlock, pastern and hoof. Split into three bones at the
    // knee or hock and the fetlock.
    leg(k, far) {
      const p = legP(k), front = k[0] === 'f', tone = far ? 0.32 : 0, s = u, lw = (o.legW ?? 1) * u;
      const c = mix(coat, '#000', tone), lk = look({ fill: c, shadow: mix(coatD, '#000', tone * 0.5) });
      // stations: [segment, t, front half-width, back half-width] in units of u (segments: 0 forearm/gaskin, 1 upper
      // cannon, 2 lower cannon to the fetlock, 3 pastern)
      const ST = front
        ? [[0, 0, 0.1 * dr ** 0.3, 0.11], [0, 0.3, 0.085, 0.08], [0, 0.62, 0.064, 0.056], [0, 0.85, 0.05, 0.046], [0, 0.94, 0.054, 0.062], [1, 0.05, 0.054, 0.056], [1, 0.25, 0.042, 0.04], [1, 0.75, 0.039, 0.044], [2, 0.3, 0.039, 0.046], [2, 0.8, 0.044, 0.056], [2, 1.0, 0.05, 0.068], [3, 0.2, 0.046, 0.058], [3, 0.6, 0.036, 0.04], [3, 1.0, 0.044, 0.046]]
        : [[0, 0, 0.13, 0.14], [0, 0.3, 0.092, 0.108], [0, 0.55, 0.07, 0.086], [0, 0.78, 0.052, 0.06], [0, 0.9, 0.052, 0.082], [0, 0.97, 0.056, 0.084], [1, 0.1, 0.052, 0.046], [1, 0.35, 0.044, 0.042], [1, 0.85, 0.041, 0.046], [2, 0.3, 0.041, 0.048], [2, 0.8, 0.045, 0.056], [2, 1.0, 0.05, 0.068], [3, 0.2, 0.046, 0.058], [3, 0.6, 0.036, 0.04], [3, 1.0, 0.044, 0.046]];
      const seg = i => E.norm(sub(p[i + 1], p[i]));
      const dirAt = (i, t) => { let d = seg(i); if (t < 0.15 && i > 0) d = E.norm(add(mul(d, 0.5 + t / 0.3), mul(seg(i - 1), 0.5 - t / 0.3))); if (t > 0.85 && i < 3) d = E.norm(add(mul(d, 0.5 + (1 - t) / 0.3), mul(seg(i + 1), 0.5 - (1 - t) / 0.3))); return d; };
      const sta = ST.map(([i, t, fw, bw]) => { const c0 = lerp(p[i], p[i + 1], t), d = dirAt(i, t), nf = [d[1], -d[0]]; return { c: c0, nf, fw: fw * lw * 0.72, bw: bw * lw * 0.72, i, t }; });
      sta.unshift({ c: add(sta[0].c, mul(sub(p[0], p[1]), 0.25)), nf: sta[0].nf, fw: sta[0].fw * 0.9, bw: sta[0].bw * 0.9 }); // run the top up into the body
      const at = (i, t, off) => { const d = dirAt(i, t), nf = [d[1], -d[0]]; return add(lerp(p[i], p[i + 1], t), mul(nf, off * lw * 0.72)); };
      const outline = [...sta.map(q => add(q.c, mul(q.nf, q.fw))), ...sta.slice().reverse().map(q => add(q.c, mul(q.nf, -q.bw)))];
      const ws = [0.2 * lw, 0.11 * lw, 0.085 * lw, 0.11 * lw, 0.085 * lw]; // for the cuts and the hoof
      const dK = W.elb(p[0], p[1], p[2]), dF = W.elb(p[2], p[3], p[4]);
      const hoof = () => {
        const C = p[4], hh = Math.min(0.075 * s, gy - C[1] + 0.03 * s), d = E.norm(sub(C, p[3])), lift = gy - C[1] > 0.05 * s;
        // the hoof continues the pastern's slope; if planted the sole sits on the ground line; wider than the pastern
        const n = [-d[1], d[0]], toeD = lift ? d : E.norm([Math.cos(0.95), Math.sin(0.95)]);
        const front0 = add(C, mul(n, -0.05 * lw)), back0 = add(C, mul(n, 0.05 * lw));
        const toe = lift ? add(front0, mul(toeD, hh * 1.3)) : [C[0] + 0.11 * lw, gy], heel = lift ? add(back0, mul(d, hh * 0.9)) : [C[0] - 0.05 * lw, gy];
        const sh = o.shoe !== false;
        const hp = [front0, lerp(front0, toe, 0.55), [...toe, 1], ...(lift ? [] : [[toe[0] - 0.01 * s, gy - 0.005 * s]]), [...heel, 1], add(heel, [-0.012 * s, -0.025 * s]), back0];
        f.part(hp, { fill: mix(o.hoof || '#3a3028', '#000', tone), shadow: '#120e0a', shade: 0.42, inkW: 1.3, inkHeavy: 2.2, cast: false, tex: 'growth' + f.o.seed, texOp: 0.45 });
        for (let i = 1; i < 4; i++) f.line([lerp(front0, toe, i * 0.24), lerp(back0, heel, i * 0.24)], 0.9, INK, { op: 0.35 }); // growth rings
        f.line([lerp(front0, toe, 0.15), lerp(front0, toe, 0.85)], 1.2, mix(o.hoof || '#3a3028', '#fff', 0.3), { op: 0.5 });
        if (o.cracked !== false) { const q = lerp(front0, toe, 0.4); f.line([add(q, [0, 0]), lerp(q, lerp(back0, heel, 0.6), 0.4), add(lerp(q, lerp(back0, heel, 0.6), 0.45), [0.006 * s, 0.03 * s])], 1.3, INK, { op: 0.85 }); W.hairline(f, [lerp(front0, toe, 0.7), lerp(lerp(front0, toe, 0.8), lerp(back0, heel, 0.8), 0.3)], 0.9); }
        if (sh && !lift) { f.part([[toe[0] - 0.005 * s, gy - 0.016 * s], [toe[0] + 0.004 * s, gy], [heel[0], gy], [heel[0], gy - 0.014 * s]], { fill: P.iron, shade: 0.3, inkW: 1, inkHeavy: 1.2, cast: false }); for (let i = 0; i < 3; i++) f.flat(ell([lerp(heel, toe, 0.25 + i * 0.25)[0], gy - 0.008 * s], 1.4, 1.2, 0, 5), '#8a8478'); }
        if (sh && lift) { const sl = [lerp(back0, heel, 1.0), lerp(heel, toe, 0.5), toe]; f.line(sl, Math.max(3, 0.016 * s) + 1.6, INK); f.line(sl, Math.max(2, 0.014 * s), P.ironL); } // the shoe on a lifted sole
        f.line([front0, lerp(front0, back0, 0.5), back0], 2.2, mix(c, '#000', 0.4), { op: 0.7 }); // coronet band
      };
      const draw = () => {
        f.part(outline, Object.assign({}, lk, { k: 0.85 }));
        W.clipDraw(f, outline, () => {
          const ln = (pts, w, col, op) => f.line(pts, w * u / 400, col, { op });
          const dk = mix(coatD, '#000', 0.2), lt = mix(c, '#fff', 0.3);
          if (front) {
            ln([at(0, 0.08, 0.02), at(0, 0.45, -0.005), at(0, 0.85, 0.0)], 3, dk, 0.5); // the groove between the forearm's muscles
            f.stroke([at(0, 0.9, 0.06), at(1, 0.0, 0.035), at(1, 0.08, 0.06)], 0.02 * u, dk, { op: 0.55 }); // the knee's front crease
            f.flat(ell(at(0, 0.97, -0.05), 0.022 * lw, 0.03 * lw, 0, 8), lt, { op: 0.35 }); // the accessory carpal bump catching light
          } else {
            ln([at(0, 0.05, -0.04), at(0, 0.4, -0.03), at(0, 0.75, -0.01)], 3, dk, 0.5); // the gaskin's muscle groove
            f.stroke([at(0, 0.35, -0.08), at(0, 0.7, -0.05), at(0, 0.92, -0.06)], 0.018 * u, dk, { op: 0.7 }); // the hamstring to the point of hock
            f.flat(ell(at(0, 0.94, -0.07), 0.024 * lw, 0.028 * lw, 0, 8), lt, { op: 0.4 }); // the point of hock catching light
            f.stroke([at(0, 0.9, 0.05), at(1, 0.02, 0.03), at(1, 0.1, 0.05)], 0.016 * u, dk, { op: 0.55 }); // the hock's front crease
          }
          ln([at(1, 0.15, -0.012), at(1, 0.95, -0.012), at(2, 0.7, -0.012)], 2.6, dk, 0.55); // the tendon standing off behind the cannon bone
          ln([at(1, 0.15, 0.028), at(1, 0.9, 0.028), at(2, 0.6, 0.028)], 2.6, lt, 0.5); // the flat of the cannon bone catching light
          f.flat(ell(at(2, 0.98, 0.0), 0.04 * lw, 0.045 * lw, 0, 10), lt, { op: 0.22 }); // the round of the fetlock joint
          ln([at(3, 0.15, 0.03), at(3, 0.25, -0.02)], 2.4, dk, 0.6); // the crease behind the fetlock
        });
        const fk = at(2, 1.0, -0.072); f.part(ell(fk, 0.022 * lw, 0.016 * lw, 0, 8), { fill: '#5a5048', shade: 0.4, inkW: 0.9, cast: false, hatch: false }); // ergot
        if (o.legAfter) o.legAfter(k, p, ws, far);
        hoof();
        if (o.feather) {
          // the feather: a hanging fall of long, clumped hair from the back of the cannon over the fetlock and the heel,
          // its lower edge ragged and singed; shorter hair round the coronet over the front of the hoof
          const fc = mix(o.feather, '#000', tone), fd = mix(fc, '#000', 0.45), fl = mix(fc, '#fff', 0.25), dn = [0, 1];
          const top = at(2, 0.25, -0.03), mid = at(2, 1.0, -0.075), heel = at(3, 1.0, -0.06), toeP = at(3, 0.95, -0.005), hang = u * 0.035;
          const FT = [top, add(mid, [-0.03 * u, 0]), add(heel, [-0.03 * u, hang * 0.5]), [...add(heel, [-0.01 * u, hang]), 1], add(heel, [0.01 * u, hang * 0.6]), [...add(lerp(heel, toeP, 0.4), [0, hang * 0.9]), 1], add(lerp(heel, toeP, 0.6), [0, hang * 0.5]), [...add(toeP, [0.01 * u, hang * 0.6]), 1], add(toeP, [0.012 * u, 0]), at(3, 0.6, 0.04), at(3, 0.3, 0.0), at(2, 0.7, -0.03)].map(q => [q[0], Math.min(q[1], gy - 1)]); // soft locks, no points (points read as claws)
          f.part(FT, { fill: fc, shadow: fd, shade: 0.45, inkW: 1.2, inkHeavy: 2, cast: false, tex: 'hatch' + f.o.seed, texOp: 0.3, maxShade: u * 0.03 });
          W.clipDraw(f, FT, () => { for (let i = 0; i < 9; i++) { const q0 = lerp(top, toeP, i / 9), q1 = add(lerp(add(heel, [-0.02 * u, 0]), toeP, i / 9), [0, hang * 0.8]); f.line([q0, lerp(q0, q1, 0.5).map((v, j) => v + (j ? 0 : (i % 2 ? 3 : -3))), q1], 1.4, i % 3 ? fd : fl, { op: 0.6 }); } });
          for (let i = 0; i < 3; i++) if (f.r() < 0.6) f.flat(ell(add(lerp(heel, toeP, 0.2 + i * 0.3), [0, hang * 0.7]), 3, 3, 0, 6), P.char, { op: 0.9 }); // singed tips
        }
      };
      split(f, draw, [[`leg_${k}_1`, side(p[1], mul(dK, -1), ws[1] * 0.55)], [`leg_${k}_2`, [side(p[1], dK, ws[1] * 0.55), side(p[3], mul(dF, -1), ws[3] * 0.55)]], [`leg_${k}_3`, side(p[3], dF, ws[3] * 0.55)]]);
    },
    farLegs() { R.leg('hf', true); R.leg('ff', true); },
    nearLegs() { R.leg('hn', false); R.leg('fn', false); },
    // the body and neck: barrel deep to the elbow, tucked flank, the shoulder laid back, the haunch over the hip
    drawBody(after) {
      split(f, () => {
        f.part(body, look({ k: 0.95, maxShade: u * 0.12 }));
        W.clipDraw(f, body, () => {
          const S = (pts, w, op = 0.5) => f.stroke(pts.map(q => Bp(...q)), w * u / 400, mix(coatD, '#000', 0.3), { op });
          // core shadow under the barrel and the belly's turn; lit back
          f.raw(`<path d="${E.smooth([Bp(-0.5, -0.6), Bp(-0.2, -0.62), Bp(0.15, -0.6), Bp(0.35, -0.58), Bp(0.3, -0.44), Bp(-0.1, -0.4), Bp(-0.45, -0.48)])}" fill="#000" opacity="0.32" filter="url(#glow${f.o.seed})"/>`);
          f.raw(`<path d="${E.smooth([Bp(-0.6, -0.97), Bp(-0.2, -0.95), Bp(0.15, -0.98), Bp(0.12, -0.9), Bp(-0.2, -0.88), Bp(-0.6, -0.9)])}" fill="${coatL}" opacity="0.3" filter="url(#glow${f.o.seed})"/>`);
          // shoulder blade laid back from the withers to the point of shoulder; the triceps mass above the elbow
          S([[0.18, -0.96], [0.28, -0.84], [0.4, -0.74]], 5, 0.55); S([[0.12, -0.92], [0.22, -0.8], [0.32, -0.72]], 3, 0.3);
          S([[0.36, -0.7], [0.3, -0.62], [0.2, -0.56]], 4, 0.5);
          // ribs as soft ridges, the girth groove, the flank whorl, the point of hip and the haunch, the stifle fold
          for (let i = 0; i < 5; i++) S([[0.06 - i * 0.07, -0.84], [0.03 - i * 0.07, -0.72], [0.02 - i * 0.065, -0.6]], 3, 0.22);
          S([[-0.38, -0.9], [-0.42, -0.8], [-0.4, -0.7]], 3, 0.35); S([[-0.46, -0.93], [-0.5, -0.86]], 4, 0.45);
          S([[-0.52, -0.82], [-0.6, -0.7], [-0.64, -0.58]], 5, 0.5); S([[-0.7, -0.88], [-0.74, -0.74], [-0.72, -0.6]], 3.5, 0.4);
          S([[-0.44, -0.62], [-0.48, -0.56], [-0.54, -0.52]], 4, 0.6);
          if (o.bodyAfter) o.bodyAfter(R);
        });
        // neck: the crest's lit edge, the jugular groove, folds at the throat
        f.line([lerp(W0, PL, 0.15), crest, lerp(crest, PL, 0.7)].map(q => add(q, mul(E.norm(rot(sub(PL, W0), Math.PI / 2)), u * 0.03))), 1.6, coatL, { op: 0.45 });
        f.stroke([lerp(NB, TL, 0.1).map((v, i) => v + (i ? -u * 0.04 : -u * 0.02)), lerp(NB, TL, 0.5).map((v, i) => v + (i ? -u * 0.05 : -u * 0.04)), lerp(NB, TL, 0.9).map((v, i) => v + (i ? -u * 0.03 : -u * 0.04))], u * 0.014, mix(coatD, '#000', 0.3), { op: 0.45 });
        if (after) after(R);
      }, [['spine_1', side(cut, mul(cutD, -1), u * 0.08)], ['spine_2', [side(cut, cutD, u * 0.08), side(neckCut, mul(neckD, -1), u * 0.1)]], ['neck', side(neckCut, neckD, u * 0.1)]]);
    },
    // the head: a long head with a flat forehead, a heavy jaw, nostrils, lips; blind milk eye, ears laid back
    drawHead(oo = {}) {
      f.bone('head');
      const hl = look({ maxShade: u * 0.05 });
      // ears behind the poll (far one first)
      for (const [dx, far] of [[0.06, true], [-0.02, false]]) { const e0 = HF([[dx, -0.03]])[0], ea = hA + Math.PI + (oo.earBack ?? 0.55) + (far ? -0.2 : 0), tip = add(e0, rot([Lh * (oo.earL ?? 0.3), 0], ea)), en = rot([0, 1], ea), ew = oo.earW ?? 1; f.part([add(e0, mul(en, -Lh * 0.07 * ew)), add(lerp(e0, tip, 0.55), mul(en, -Lh * 0.075 * ew)), [...tip, 1], add(lerp(e0, tip, 0.5), mul(en, Lh * 0.06 * ew)), add(e0, mul(en, Lh * 0.07 * ew))], look({ fill: far ? mix(coat, '#000', 0.3) : coat, maxShade: 6, cast: false })); if (!far) f.line([lerp(e0, tip, 0.2), lerp(e0, tip, 0.75)], 1.4, INK, { op: 0.6 }); }
      const HD = HF([[0, -0.02], [0.12, -0.075], [0.3, -0.085], [0.5, -0.075], [0.66, -0.07 - 0.02 * dr], [0.82, -0.045], [0.93, 0.0], [1.0, 0.06], [1.015, 0.14], [0.99, 0.2], [0.94, 0.215], [0.955, 0.255], [0.9, 0.29], [0.8, 0.26], [0.62, 0.24], [0.44, 0.3], [0.3, 0.4], [0.15, 0.41], [0.05, 0.33], [-0.02, 0.16]]);
      f.part(HD, hl);
      W.clipDraw(f, HD, () => {
        f.raw(`<path d="${E.smooth(HF([[0.08, 0.2], [0.3, 0.12], [0.44, 0.22], [0.4, 0.36], [0.2, 0.4], [0.06, 0.32]]))}" fill="#000" opacity="0.3" filter="url(#glow${f.o.seed})"/>`); // the round of the jowl turning away
        f.flat(HF([[0.15, -0.06], [0.6, -0.06], [0.9, -0.02], [0.88, 0.02], [0.55, -0.02], [0.2, -0.02]]), coatL, { op: 0.35 }); // the lit flat of the face
        f.line(HF([[0.42, 0.06], [0.62, 0.1], [0.8, 0.12]]), 1.2, INK, { op: 0.4 }); // the facial crest
        f.stroke(HF([[0.1, 0.18], [0.24, 0.12], [0.4, 0.2], [0.42, 0.3]]), u * 0.008, mix(coatD, '#000', 0.4), { op: 0.6 }); // edge of the jaw's cheek muscle
        if (oo.inside) oo.inside(HF);
      });
      // the eye: under a bony brow, set back; blind and milky, a crusted lid
      const eC = HF([[0.3, 0.035]])[0];
      f.flat(HF(ell([0.3, 0.035], 0.07, 0.05, 0.1, 12)), mix(coatD, '#000', 0.4), { op: 0.7 });
      f.part(HF(ell([0.3, 0.04], 0.05, 0.036, 0.15, 12)), { fill: oo.eye || '#c8c4b4', shadow: '#7a786c', shade: 0.4, inkW: 1.2, inkHeavy: 1.6, cast: false, hatch: false });
      f.flat(HF(ell([0.31, 0.03], 0.025, 0.015, 0.15, 8)), '#e8e6dc', { op: 0.8 });
      f.stroke(HF([[0.24, 0.02], [0.3, -0.008], [0.37, 0.02]]), u * 0.012, INK);
      f.line(HF([[0.22, -0.03], [0.3, -0.05], [0.38, -0.02]]), 1.4, INK, { op: 0.6 }); // brow
      // nostril, muzzle, lips, chin
      f.flat(HF([[0.88, 0.07], [0.95, 0.06], [0.97, 0.1], [0.93, 0.14], [0.9, 0.12]]), '#120c08');
      f.line(HF([[0.86, 0.05], [0.94, 0.03], [0.99, 0.08]]), 1.3, INK, { op: 0.7 });
      f.line(HF([[0.93, 0.215], [0.85, 0.215], [0.78, 0.2]]), 1.6, INK, { op: 0.8 }); // mouth line
      f.line(HF([[0.88, 0.27], [0.84, 0.25]]), 1.2, INK, { op: 0.5 });
      for (let i = 0; i < 6; i++) { const q = HF([[0.9 + (i % 3) * 0.03, 0.17 + (i > 2 ? 0.07 : 0)]])[0]; f.line([q, add(q, rot([u * 0.02, u * 0.008], hA + 0.6))], 0.8, INK, { op: 0.6 }); } // whiskers on the muzzle
      if (oo.after) oo.after(HF, eC);
      return HF;
    },
  };
  return R;
}

// ------------------------------------------------------------------ rats
// one gallery rat at c, length s (rump to nose), facing angle a (0 = right; use o.flip with a near PI to face left
// belly-down). A hunched rat: the rump high and round, the back arched, a dip at the neck, a long head tapering to a
// pointed snout, big round ears, bead eyes, pink hands and long hind feet. o.swell: the belly swollen tight with gas;
// o.burst: split and glowing; o.hairless: fur singed off the flank to cracked, glowing skin; o.tail: stub length.
function rat(f, c, s, a, o = {}) {
  const F = frame(c, a, s), fl = o.flip ? (pts => F(pts.map(q => [q[0], -q[1], q[2]]))) : F;
  const fc = o.col || '#4a3c30', sk = '#3a2622', pink = '#a07868', pinkD = '#5a3a30';
  const LK = (oo = {}) => Object.assign({ fill: fc, shadow: mix(fc, '#000', 0.6), light: mix(fc, '#c8b090', 0.45), shade: 0.4, tex: 'mottle' + f.o.seed, texOp: 0.6, inkW: Math.max(1, s * 0.014), inkHeavy: Math.max(1.4, s * 0.028), maxShade: s * 0.07 }, oo);
  const sw = o.swell ?? 0.3;
  // tail: thick at the root, scaled, burnt off to a glowing stub
  const tl = o.tail ?? 0.4, t0 = fl([[-0.46, 0.06]])[0], t1 = fl([[-0.46 - tl * 0.5, 0.16]])[0], t2 = fl([[-0.46 - tl, 0.24 + (o.tailCurl ?? 0.04)]])[0];
  f.part(limb(t0, t1, s * 0.09, s * 0.06, { steps: 4 }).concat(limb(t1, t2, s * 0.06, s * 0.045, { steps: 4 })), { fill: pink, shadow: pinkD, shade: 0.4, inkW: 1, inkHeavy: 1.4, cast: false, hatch: false });
  for (let i = 1; i < 6; i++) { const q = lerp(t0, t2, i / 6), d = E.norm(sub(t2, t0)), nn = [-d[1], d[0]]; f.line([add(q, mul(nn, s * 0.03)), add(q, mul(nn, -s * 0.03))], 0.7, INK, { op: 0.55 }); }
  f.flat(ell(t2, s * 0.035, s * 0.035, 0, 6), P.char); f.flat(ell(t2, s * 0.016, s * 0.016, 0, 5), P.lamp, { op: 0.9 });
  // far legs: a hind foot and a hand, darker
  f.part(fl([[-0.3, 0.12], [-0.18, 0.14], [-0.1, 0.25], [-0.02, 0.27], [-0.02, 0.3], [-0.24, 0.3], [-0.3, 0.22]]), { fill: mix(pink, '#000', 0.35), shade: 0.4, inkW: 1, cast: false, hatch: false });
  f.part(fl([[0.2, 0.12], [0.27, 0.14], [0.3, 0.26], [0.36, 0.28], [0.34, 0.3], [0.22, 0.29]]), { fill: mix(pink, '#000', 0.35), shade: 0.4, inkW: 1, cast: false, hatch: false });
  // body: the rump high and round, the arched back, the neck's dip, the belly hanging (swollen tight with gas)
  const BD = fl([[-0.5, 0.02], [-0.48, -0.14], [-0.38, -0.24], [-0.2, -0.29], [0.0, -0.25], [0.14, -0.2], [0.24, -0.17], [0.3, -0.12], [0.3, 0.06], [0.22, 0.14], [0.08, 0.17 + sw * 0.06], [-0.1, 0.2 + sw * 0.1], [-0.3, 0.19 + sw * 0.04], [-0.44, 0.14]]);
  f.part(BD, LK());
  W.clipDraw(f, BD, () => {
    f.flat(fl([[-0.46, 0.08], [-0.1, 0.1 + sw * 0.08], [0.22, 0.06], [0.24, 0.2], [-0.1, 0.32], [-0.46, 0.26]]), '#000', { op: 0.38 }); // the belly turning under
    if (sw > 0.45) { f.flat(fl([[-0.26, 0.08], [-0.06, 0.08], [0.1, 0.14], [-0.08, 0.2 + sw * 0.1], [-0.26, 0.16]]), '#b09868', { op: 0.55 }); f.flat(fl([[-0.18, 0.1], [-0.08, 0.1], [-0.1, 0.13]]), '#fff6d8', { op: 0.6 }); for (let i = 0; i < 3; i++) f.line(fl([[-0.22 + i * 0.08, 0.12], [-0.18 + i * 0.08, 0.2]]), 0.8, '#3a2a20', { op: 0.5 }); } // the gas-tight belly: stretched, shiny, veined
    f.line(fl([[-0.42, -0.1], [-0.36, 0.0], [-0.24, 0.08]]), 1.2, INK, { op: 0.45 }); // the haunch
    if (o.hairless) { const HP = fl([[-0.3, -0.16], [-0.06, -0.2], [0.1, -0.08], [-0.06, 0.04], [-0.3, 0.02]]); f.flat(HP, sk, { op: 0.95 }); W.seam(f, fl([[-0.26, -0.08], [-0.16, -0.04], [-0.04, -0.1], [0.06, -0.06]]), Math.max(1, s * 0.018)); W.seam(f, fl([[-0.16, -0.04], [-0.14, 0.02]]), Math.max(0.8, s * 0.012), { glow: false }); W.flakes(f, fl([[-0.1, -0.12]])[0], s * 0.1, s * 0.05, 2, s / 140); }
  });
  // fur: clumped tufts breaking the outline of the back, laid back toward the tail
  const back = fl([[0.2, -0.19], [0.0, -0.26], [-0.2, -0.29], [-0.38, -0.24], [-0.48, -0.12]]);
  const bd = E.norm(sub(fl([[-1, -0.3]])[0], fl([[0, 0]])[0]));
  fur(f, o.hairless ? back.slice(2) : back, bd, s * 0.1, o.hairless ? 4 : 8, mix(fc, '#000', 0.1), { w: s * 0.05, jit: 0.4, singe: 0.4, inkW: 0.8, inkH: 1 });
  if (o.burst) { const b0 = fl([[-0.12, 0.2]])[0]; f.flat(fl([[-0.24, 0.14], [-0.06, 0.12], [0.04, 0.2], [-0.12, 0.3], [-0.26, 0.26]]), '#1e120c'); W.seam(f, fl([[-0.22, 0.17], [-0.12, 0.24], [0.0, 0.19]]), Math.max(1.2, s * 0.025)); W.glow(f, b0, s * 0.2, s * 0.12, P.lamp, 0.5); }
  // near legs: the haunch's thigh to a long pink hind foot, the foreleg to a small grasping hand
  f.part(fl([[-0.36, 0.0], [-0.2, 0.02], [-0.16, 0.14], [-0.2, 0.22], [-0.3, 0.2]]), LK({ inkW: 0.9, inkHeavy: 1.2, cast: false }));
  f.part(fl([[-0.28, 0.18], [-0.16, 0.2], [-0.04, 0.27], [0.03, 0.27], [0.04, 0.31], [-0.22, 0.31], [-0.3, 0.26]]), { fill: pink, shadow: pinkD, shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
  for (let i = 0; i < 3; i++) f.line(fl([[-0.02 + i * 0.02, 0.27], [0.02 + i * 0.02, 0.31]]), 0.7, INK, { op: 0.6 });
  f.part(fl([[0.16, 0.04], [0.26, 0.06], [0.28, 0.2], [0.24, 0.22], [0.18, 0.14]]), LK({ inkW: 0.9, inkHeavy: 1.2, cast: false }));
  f.part(fl([[0.22, 0.2], [0.3, 0.21], [0.37, 0.26], [0.36, 0.29], [0.24, 0.28]]), { fill: pink, shadow: pinkD, shade: 0.4, inkW: 1, inkHeavy: 1.2, cast: false, hatch: false });
  // head: long, tapering to the snout; the crown, a cheek, the nose crusted yellow, incisors, whiskers
  const HD = fl([[0.16, -0.16], [0.28, -0.2], [0.38, -0.16], [0.5, -0.08], [0.6, -0.02], [0.62, 0.02], [0.56, 0.06], [0.44, 0.08], [0.3, 0.1], [0.18, 0.06]]);
  f.part(HD, LK({ fill: mix(fc, '#c8b090', 0.08) }));
  f.flat(fl([[0.22, 0.0], [0.4, 0.0], [0.52, 0.04], [0.42, 0.08], [0.26, 0.08]]), '#000', { op: 0.3 });
  f.line(fl([[0.32, -0.17], [0.44, -0.12], [0.56, -0.05]]), 1, mix(fc, '#e0c8a0', 0.5), { op: 0.6 });
  // ear: big and round, thin, pink inside, set behind the eye; the far ear a sliver behind
  f.part(fl(ell([0.25, -0.24], 0.05, 0.065, -0.3, 10)), { fill: mix(pink, '#000', 0.3), shade: 0.4, inkW: 0.9, cast: false, hatch: false });
  f.part(fl(ell([0.21, -0.23], 0.065, 0.075, -0.4, 12)), { fill: mix(pink, fc, 0.4), shadow: pinkD, shade: 0.4, inkW: 1, inkHeavy: 1.3, cast: false, hatch: false });
  f.flat(fl(ell([0.22, -0.225], 0.035, 0.045, -0.4, 10)), pinkD, { op: 0.7 });
  f.flat(fl(ell([0.4, -0.1], 0.026, 0.022, 0, 8)), '#0a0606'); f.flat(fl(ell([0.405, -0.106], 0.009, 0.009, 0, 5)), P.lampL, { op: 0.9 });
  f.flat(fl([[0.54, -0.05], [0.61, -0.02], [0.63, 0.02], [0.58, 0.05], [0.52, 0.0]]), P.sul, { op: 0.9 }); // crusted snout
  f.flat(fl(ell([0.615, 0.01], 0.014, 0.012, 0, 6)), '#3a1a18');
  if (o.teeth !== false) f.flat(fl([[0.53, 0.06], [0.565, 0.06], [0.555, 0.11], [0.54, 0.11]]), '#d8c070');
  for (let i = 0; i < 3; i++) f.line([fl([[0.56, 0.01]])[0], fl([[0.72, -0.06 + i * 0.06]])[0]], 0.6, '#c8b890', { op: 0.7 });
  return F;
}

// a sleeve or trouser end torn or burnt into an irregular hem (uneven spacing and depths, a few long strips, some
// curled): K.ragLimb's teeth are too regular and read as a sawtooth
function rag(f, a, b, wa, wb, o = {}) {
  const steps = 10, pts = limb(a, b, wa, wb, Object.assign({ steps }, o, { capB: false }));
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]], out = [], k = o.teeth || 6, dep = o.depth || 9;
  let u = 0; const cuts = []; for (let i = 0; i < k; i++) { u += 0.5 + f.r(); cuts.push(u); } const tot = u + 0.5 + f.r() * 0.5;
  cuts.forEach((c, i) => { const v = wb / 2 - wb * c / tot, long = f.r() < 0.25 ? 1.8 : 1, deep = (i % 2 ? 0.25 + f.r() * 0.9 : -0.2 - f.r() * 0.3) * dep * long; out.push([...add(add(b, mul(n, v)), mul(d, deep)), f.r() < 0.5 ? 1 : 0]); });
  return [...pts.slice(0, steps + 1), ...out, ...pts.slice(steps + 1)];
}

// Grow a figure's canvas after it is drawn (director ruling 2026-11-23: true size wins over the tier canvas). Every drawn
// element is wrapped in a translate(dx, dy), so its clip paths, masks and patterns move with it; the joints move by the
// same amount; groundY becomes the new canvas height minus 30. The shared grime gradient is evaluated inside the wrapped
// elements, so it keeps the original ground line. Draw at the original coordinates, then call grow(f, dx, dy) last;
// the entry's canvas is the tier canvas plus the margins.
function grow(f, dx, dy) {
  f.out = f.out.map(s => `<g transform="translate(${dx} ${dy})">${s}</g>`);
  for (const j of Object.values(f.joints)) j.pivot = [+(j.pivot[0] + dx).toFixed(1), +(j.pivot[1] + dy).toFixed(1)];
  const g0 = f.o.groundY, r0 = f.o.grimeY, sd = f.sharedDefs;
  f.sharedDefs = function () { const g = this.o.groundY, r = this.o.grimeY; this.o.groundY = g0; this.o.grimeY = r0; const s = sd.call(this); this.o.groundY = g; this.o.grimeY = r; return s; };
  f.o.groundY = g0 + dy;
  return f;
}
module.exports = { rag, flame, wickFlame, oilLamp, fur, horse, rat, grow };
