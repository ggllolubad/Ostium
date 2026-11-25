// World VII, The Icebound Fleet (Frost + Water): local helpers. Shared files stay frozen; everything new lives here.
// Several helpers are copied from the reviewed world kits (kit_I_a openHand/tube/prune, kit_I_b space/mlimb/fistDetail/
// creases, kit_I_c ik/spline/arcLen/clipDraw/strip/hairMass/jointLimb) so this world does not depend on their files.
//
// Frost shape language (bible): rime crust on the windward side, icicles that hang plumb, faceted planes, frozen
// mid-gesture. Never: clean ice crystals or snowflakes. So every bit of ice here is rough, lumpy, dull and dirty-white.
// Windward: the wind comes off the heroes, so in drawing space (foes are drawn facing right, then mirrored) rime builds
// on the right-facing (front) and upper edges. Light: foeBase puts the key light at the upper right in drawing space.
'use strict';
const K = require('../kit');
const { E, INK } = K;
const { add, sub, mul, lerp, rot, mix, limb, ell, lp, frame } = E;
const { split, side } = require('../dirAC');

// palette: white sea, black hulls, frozen rigging grey-blue; no warm colour. Plus ink black, bone and grey.
const PAL = {
  ice: '#e2e9ed', iceS: '#8a9cab', iceD: '#5d7486', rime: '#d6dfe5', rimeS: '#9aabb8', glaze: '#c4d6e2',
  hull: '#1d1f24', hullL: '#3a3e46', tar: '#141518',
  rig: '#7f93a3', rigD: '#56687a', rigL: '#a7b8c4', rope: '#8d99a1', ropeD: '#5a666e',
  navy: '#3b4556', navyD: '#262d3a', navyL: '#5d6878',
  wool: '#707476', woolD: '#4b4f53', woolL: '#92969a',
  iron: '#494d53', ironD: '#2e3136', steel: '#7c838b', steelL: '#a9b1b8', pewter: '#8e9496',
  skin: '#bac3c8', skinS: '#5f6479', bite: '#77738f', biteD: '#34334a', lips: '#56657e',
  bone: '#d8d2c2', boneS: '#8e8a80', grey: '#7a7c7e', wood: '#3a3835', woodL: '#5c5953',
  sea: '#0b1016', seaL: '#26394a', blood: '#4a1416',
};

// ---- authoring space (copied from kit_I_b): author in human space (ground 790, a 1.0 human ~640 tall, centred near
// x 300) and map onto the tier canvas at the creature's true scale k.
function space(k, X0, GY, cx = 300) {
  const Z = p => { const q = [X0 + (p[0] - cx) * k, GY - (790 - p[1]) * k]; return p[2] ? [q[0], q[1], 1] : q; };
  return { k, Z, ZZ: pts => pts.map(Z), W: w => w * k };
}

// ---- figure-bound frost and water marks (use the figure's seeded random so renders repeat)
function fx(f, sc = 1) {
  const R = () => f.r(), s = f.o.seed, o = {};
  // hoar-frost speckle and a frost-crust pattern, registered once per figure; use as tex: o.hoar / o.crust
  f.defs.push(`<filter id="hoarf${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${s + 41}"/><feColorMatrix values="0 0 0 0 0.93  0 0 0 0 0.96  0 0 0 0 0.98  0 0 0 9 -5.6"/></filter><pattern id="hoar${s}" patternUnits="userSpaceOnUse" width="300" height="300"><rect width="300" height="300" filter="url(#hoarf${s})"/></pattern>`);
  f.defs.push(`<filter id="icef${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="${s + 47}"/><feColorMatrix values="0 0 0 0 0.30  0 0 0 0 0.40  0 0 0 0 0.48  0 0 0 -2.2 1.15"/></filter><pattern id="icetex${s}" patternUnits="userSpaceOnUse" width="400" height="400"><rect width="400" height="400" filter="url(#icef${s})"/></pattern>`);
  o.hoar = 'hoar' + s; o.icetex = 'icetex' + s;
  const IC = (x = {}) => Object.assign({ fill: PAL.rime, shadow: PAL.iceS, shade: 0.32, tex: o.icetex, texOp: 0.5, inkW: 1.1, inkHeavy: 1.8, cast: false, hatch: false, grime: false }, x);
  o.IC = IC;

  // rime crust along a surface edge. pts: polyline on the surface (screen space). out: +1 grows on the polyline's +normal
  // side ([-dy, dx]), -1 on the other. d: crust depth. Rime feathers grow into the wind (o.wind, default toward +x and up),
  // so the crust is a lumpy band with blunt feathered lobes leaning windward, never neat crystals.
  o.rime = (pts, d = 8, out = 1, x = {}) => {
    const C = spline(pts, Math.max(5, d * 1.5)), n = C.length, wind = E.norm(x.wind || [1, -0.5]), inner = [], outer = [], ph = R() * 6;
    for (let i = 0; i < n; i++) {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], t = E.norm(sub(b, a)), nn = mul([-t[1], t[0]], out);
      const taper = Math.min(1, (i + 0.5) / 2, (n - 0.5 - i) / 2), lobe = (0.8 + 0.25 * Math.sin(i * 1.3 + ph) + R() * 0.2) * taper;
      inner.push(add(C[i], mul(nn, -d * 0.3)));
      outer.push(add(add(C[i], mul(nn, d * lobe)), mul(wind, d * 0.2 * lobe)));
    }
    f.part([...inner, ...outer.reverse()], IC(Object.assign({ k: 1 }, x.look || {})));
    const ot = outer.slice().reverse();
    f.line(inner.slice(1, -1), 1.3, PAL.iceD, { op: 0.55 }); // where the crust sits on the surface
    for (let i = 1; i < n - 1; i += 3) f.line([lerp(C[i], ot[i], 0.5), lerp(C[Math.min(n - 1, i + 1)], ot[Math.min(n - 1, i + 1)], 0.75)], 0.9, PAL.iceS, { op: 0.7 }); // crust lumps
    for (let i = 2; i < n - 2; i += 4) f.flat(ell(lerp(C[i], ot[i], 0.4), 1.2 * sc + R(), 1 * sc + R() * 0.6, 0, 6), PAL.iceD, { op: 0.6 });
    return { inner, outer: ot };
  };
  // one icicle hanging plumb from p (screen space, never in a rotated frame): irregular, ringed, dull, a lit edge on
  // the light side (+x in drawing space), a frozen drop at the tip
  o.icicle = (p, len, w) => {
    const segs = 5, L = [], Rr = [];
    for (let i = 0; i <= segs; i++) { const t = i / segs, ww = w / 2 * (1 - t) ** 0.85 * (i % 2 ? 0.82 : 1.06) * (i === 0 ? 1.15 : 1), jx = (R() - 0.5) * w * 0.12; L.push([p[0] - ww + jx, p[1] + len * t]); Rr.push([p[0] + ww + jx, p[1] + len * t]); }
    const tip = [p[0] + (R() - 0.5) * w * 0.2, p[1] + len + w * 0.15];
    f.part([...L, [...tip, 1], ...Rr.reverse()], IC({ fill: mix(PAL.rime, PAL.glaze, 0.4), shade: 0.4, inkW: 0.9, inkHeavy: 1.3, k: 0.7 }));
    f.line([[p[0] + w * 0.18, p[1] + 2], [p[0] + w * 0.08, p[1] + len * 0.7]], Math.max(0.8, w * 0.16), '#f4f8fa', { op: 0.75 });
    if (len > 14) for (let i = 1; i < 3; i++) f.line([[p[0] - w * 0.3 * (1 - i / 3), p[1] + len * i / 3], [p[0] + w * 0.3 * (1 - i / 3), p[1] + len * i / 3 + 1]], 0.8, PAL.iceD, { op: 0.5 });
  };
  // icicles along an under-edge: n of them hung plumb from points spread along pts
  o.icicles = (pts, n, maxLen, w = 6) => {
    const C = spline(pts, 3), S = arcLen(C), Ltot = S[S.length - 1];
    for (let k = 0; k < n; k++) { const u = (k + 0.3 + R() * 0.4) / n * Ltot; let i = S.findIndex(v => v >= u); if (i < 0) i = C.length - 1; const L = maxLen * (0.3 + R() * 0.7) * (k % 3 === 1 ? 1 : 0.7); o.icicle(add(C[i], [0, -1]), L, w * (0.6 + L / maxLen * 0.6)); }
  };
  // a frozen glaze over a surface (a face, a hand): a thin translucent sheet with streaks and a crack
  o.glaze = (pts, op = 0.32) => {
    f.flat(pts, PAL.glaze, { op });
    const bb = E.bbox(pts), c = [(bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2], w = bb[2] - bb[0], h = bb[3] - bb[1];
    for (let i = 0; i < 3; i++) { const q = add(c, [w * (0.05 + i * 0.12), -h * (0.3 - i * 0.18)]); f.line([q, add(q, [w * 0.1, h * 0.12])], 1.4, '#f4f8fa', { op: 0.55 }); }
    f.line([add(c, [-w * 0.3, -h * 0.1]), add(c, [-w * 0.05, h * 0.02]), add(c, [0, h * 0.25]), add(c, [w * 0.15, h * 0.32])], 0.9, PAL.iceD, { op: 0.6, straight: true });
  };
  // frost-bitten skin: grey-violet blotches darkening at the extremity, cracked with pale-lipped splits
  o.bite = (c, rx, ry, n, dark = 0.3) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.flat(ell(p, (3 + R() * 6) * sc, (2 + R() * 4) * sc, R() * 3, 8), R() < dark ? PAL.biteD : PAL.bite, { op: 0.45 }); } };
  o.cracks = (c, r, n, ang = 0) => {
    for (let i = 0; i < n; i++) {
      const a = ang + (R() - 0.5) * 2.4, p0 = add(c, [(R() - 0.5) * r, (R() - 0.5) * r]), p1 = add(p0, rot([r * (0.3 + R() * 0.4), 0], a)), p2 = add(p1, rot([r * (0.2 + R() * 0.3), 0], a + (R() - 0.5) * 1.2));
      f.line([p0, p1, p2], 1.1 * sc, '#1c1a26', { op: 0.75, straight: true });
      f.line([add(p0, [1, -1]), add(p1, [1, -1])], 0.8, '#eef2f4', { op: 0.5, straight: true });
      if (R() > 0.4) f.line([p1, add(p1, rot([r * 0.2, 0], a + 1))], 0.8 * sc, '#1c1a26', { op: 0.6, straight: true });
    }
  };
  // a scatter of hoar specks and small rime lumps over a surface
  o.frost = (c, rx, ry, n, r0 = 1.4) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]), r = r0 * (0.6 + R() * 0.9) * sc; f.flat(ell(p, r * 1.4, r, R() * 3, 6), '#eef3f6', { op: 0.85 }); f.flat(ell(add(p, [0, r * 0.5]), r * 1.2, r * 0.4, 0, 6), PAL.iceD, { op: 0.4 }); } };
  // drowned-under-ice marks: soft pooled lividity and marbled veins
  o.livid = (c, rx, ry, n, op = 0.35) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.flat(ell(p, (3 + R() * 8) * sc, (2 + R() * 5) * sc, R() * 3, 8), R() > 0.5 ? '#8a86a2' : '#7a8a96', { op }); } };
  o.veins = (c, rx, ry, n) => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]); f.line([p, add(p, [(3 + R() * 6) * sc, (5 + R() * 5) * sc]), add(p, [R() * 12 * sc, (12 + R() * 8) * sc])], 0.9, '#55527a', { op: 0.55 }); } };
  // breath frozen as it left the mouth: a stiff lumpy plume curling up and forward, hollow and cloudy, icicled beneath
  o.breath = (p, dir, len, w) => {
    // a cloud of vapour frozen solid in front of the mouth: two small puffs at the lips, then a loose irregular cluster
    // drifting forward and up, cloudy and translucent, icicled underneath. Never a tube (that reads as a horn).
    const d = E.norm(dir), nn = [-d[1], d[0]], cc = add(p, add(mul(d, len * 0.62), mul(nn, -w * 0.15))), puffs = [];
    puffs.push([add(p, mul(d, w * 0.14)), w * 0.1], [add(p, add(mul(d, w * 0.36), mul(nn, -w * 0.05))), w * 0.15]);
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + R() * 0.6, rr = 0.25 + R() * 0.45; puffs.push([add(cc, add(mul(d, Math.cos(a) * len * 0.34 * rr), mul(nn, Math.sin(a) * w * 0.32 * rr))), w * (0.18 + R() * 0.14)]); }
    puffs.push([cc, w * 0.26]);
    for (const [q, r] of puffs) {
      const pts = []; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = r * (0.8 + R() * 0.35); pts.push(add(q, [Math.cos(a) * rr * 1.15, Math.sin(a) * rr * 0.85])); }
      f.part(pts, IC({ fill: '#dce5ea', inkW: 0.9, inkHeavy: 1.2, opacity: 0.7, k: 1, shade: 0.35 }));
      f.line(ell(add(q, [r * 0.15, -r * 0.2]), r * 0.55, r * 0.35, 0, 8).slice(4, 8), 1, '#f6f9fb', { op: 0.7 });
    }
    const low = puffs.slice(2).sort((a, b) => (b[0][1] + b[1]) - (a[0][1] + a[1])).slice(0, 3);
    for (const [q, r] of low) o.icicle(add(q, [(R() - 0.5) * r * 0.6, r * 0.6]), r * (0.6 + R() * 0.5), Math.max(3, r * 0.24));
    return cc;
  };
  // cracked sea-ice under the feet: a flat floe edge with pressure cracks and a few tilted slabs (on the root bone)
  o.floe = (c, rx, ry = rx * 0.1) => {
    f.part(ell(c, rx, ry, 0, 30), IC({ fill: '#c9d4dc', shade: 0.15, inkW: 1.2, inkHeavy: 1.6, texOp: 0.6 }));
    for (let i = 0; i < 6; i++) { const a = add(c, [(R() - 0.5) * rx * 1.4, (R() - 0.5) * ry * 0.8]); f.line([a, add(a, [rx * (0.1 + R() * 0.2), ry * (R() - 0.5) * 0.8]), add(a, [rx * (0.2 + R() * 0.25), ry * (R() - 0.5)])], 1.1, PAL.iceD, { op: 0.7, straight: true }); }
    f.line(ell(c, rx * 0.96, ry * 0.8, 0, 30).slice(16, 28), 1.2, '#f2f6f8', { op: 0.6 });
  };
  o.slab = (p, w, h, ang) => { const F = frame(p, ang, 1); f.part(F([[-w / 2, 0, 1], [-w * 0.4, -h, 1], [w * 0.3, -h * 1.1, 1], [w / 2, -h * 0.1, 1]]), IC({ fill: '#cbd7df', shade: 0.4, inkW: 1.2, inkHeavy: 2 })); f.line(F([[-w * 0.38, -h * 0.9], [w * 0.28, -h]]), 1.4, '#f4f8fa', { op: 0.7 }); };
  // pressure ice: one broken, upended slab of sea-ice with real thickness. face: the broad face's corners (clockwise on
  // screen); th: the thickness vector (which way the slab's edges show, e.g. [22,-16] shows the top and right edges).
  // Edges are broken ragged (subdivided with jitter, hard corners); every edge whose outward normal agrees with th gets
  // a thickness face (lit and snow-capped when it faces up, dark blue-grey when it faces sideways); the broad face is
  // translucent, densest and bluest toward the waterline, with pressure layers, trapped bubbles, cracks and a frost bloom.
  // o.op face opacity (see-through), o.snow snow depth on up-facing tops, o.inside(clipPts) draws things seen in the ice.
  o.slab2 = (face, th, x = {}) => {
    const rag = x.rag ?? 0.06, jag = [];
    for (let i = 0; i < face.length; i++) {
      const a = face[i], b = face[(i + 1) % face.length], L = E.len(sub(b, a)), m = Math.max(2, Math.round(L / (x.step || 60))), d = E.norm(sub(b, a)), nn = [d[1], -d[0]];
      jag.push([...a, 1]);
      for (let k = 1; k < m; k++) { const j = (R() - 0.5) * 2 * L * rag + (k % 2 ? -1 : 0.6) * L * rag * 0.5; jag.push([...add(lerp(a, b, k / m + (R() - 0.5) * 0.3 / m), mul(nn, j)), R() < 0.55 ? 1 : 0]); }
    }
    const nJ = jag.length, cen = jag.reduce((s, q) => add(s, mul(q, 1 / nJ)), [0, 0]), thN = E.norm(th);
    // thickness faces first (behind the broad face's edge)
    for (let i = 0; i < nJ; i++) {
      const a = jag[i], b = jag[(i + 1) % nJ], d = E.norm(sub(b, a)), on = [d[1], -d[0]];
      if (on[0] * thN[0] + on[1] * thN[1] < 0.15) continue;
      const up = on[1] < -0.45, q = [[...a, 1], [...b, 1], [...add(b, th), 1], [...add(a, th), 1]];
      f.part(q, IC({ fill: up ? '#dfe7ec' : (x.edge || '#7d93a5'), shadow: '#4e6274', shade: 0.25, maxShade: 6, inkW: 1.2, inkHeavy: 1.6, texOp: 0.55 }));
      if (!up) f.line([lerp(add(a, mul(th, 0.5)), add(b, mul(th, 0.5)), 0.05), lerp(add(a, mul(th, 0.5)), add(b, mul(th, 0.5)), 0.95)], 1, '#c4d2dc', { op: 0.45, straight: true }); // a layer line in the broken edge
    }
    const look = IC({ fill: x.fill || '#bccbd6', shadow: x.shadow || '#5d7486', opacity: x.op ?? 1, shade: 0.3, maxShade: x.maxShade ?? 26, inkW: 1.8, inkHeavy: 3, texOp: 0.6 });
    f.part(jag, look);
    const bb = E.bbox(jag), h = bb[3] - bb[1], w = bb[2] - bb[0];
    const lo = x.down || [0, 1];
    const res = { jag, bb };
    (x.clip || ((pts, fn) => { const i0 = f.out.length; fn(); const body = f.out.splice(i0).join('\n'); const id = f.id('cl'); f.defs.push(`<clipPath id="${id}"><path d="${E.smooth(pts)}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`); }))(jag, () => {
      if (x.inside) x.inside(jag, bb);
      // depth: denser and bluer toward the waterline, a pale lit band under the top edge
      f.flat([[bb[0] - 20, bb[1] + h * 0.55], [bb[2] + 20, bb[1] + h * 0.45], [bb[2] + 20, bb[3] + 20], [bb[0] - 20, bb[3] + 20]], '#2c3e50', { op: 0.32 });
      f.flat([[bb[0] - 20, bb[1] + h * 0.8], [bb[2] + 20, bb[1] + h * 0.72], [bb[2] + 20, bb[3] + 20], [bb[0] - 20, bb[3] + 20]], '#1c2a38', { op: 0.3 });
      f.flat([[bb[0] - 20, bb[1] - 20], [bb[2] + 20, bb[1] - 20], [bb[2] + 20, bb[1] + h * 0.12], [bb[0] - 20, bb[1] + h * 0.2]], '#eef4f8', { op: 0.35 });
      // pressure layers (wavy strata across the slab), trapped bubble trains, cracks
      for (let k = 0; k < (x.layers ?? 4); k++) { const y = bb[1] + h * (0.22 + k * 0.17 + R() * 0.06), pts = []; for (let s = 0; s <= 8; s++) pts.push([bb[0] - 10 + (w + 20) * s / 8, y + Math.sin(s * 1.4 + k) * h * 0.03 + (s / 8 - 0.5) * (x.tilt || 0) * w]); f.line(pts, 1.4, '#55708a', { op: 0.5 }); f.line(pts.map(q => add(q, [0, -3])), 1, '#e4eef4', { op: 0.35 }); }
      for (let k = 0; k < (x.bubbles ?? 22); k++) { const q = [bb[0] + R() * w, bb[1] + h * (0.15 + R() * 0.75)], r = 1.5 + R() * 3.5; f.flat(ell(q, r, r * 0.8, 0, 8), '#eef4f8', { op: 0.55 }); f.line(ell(q, r, r * 0.8, 0, 8).slice(4, 8), 0.8, '#3e5468', { op: 0.5 }); }
      o.cracks([bb[0] + w * (0.3 + R() * 0.4), bb[1] + h * (0.3 + R() * 0.4)], Math.min(w, h) * 0.5, x.cracks ?? 4, (R() - 0.5) * 2);
      o.frost([bb[0] + w * 0.5, bb[1] + h * 0.2], w * 0.45, h * 0.12, Math.round(w / 30), 1.6);
    });
    // snow lying on the up-facing tops: a soft lumpy cap following the top edge, offset by the thickness
    if (x.snow !== 0) for (let i = 0; i < nJ; i++) {
      const a = jag[i], b = jag[(i + 1) % nJ], d = E.norm(sub(b, a)), on = [d[1], -d[0]];
      if (on[1] > -0.55 || E.len(sub(b, a)) < 18) continue;
      const a2 = add(a, mul(th, on[0] * thN[0] + on[1] * thN[1] > 0.15 ? 1 : 0)), b2 = add(b, mul(th, on[0] * thN[0] + on[1] * thN[1] > 0.15 ? 1 : 0)), sd = x.snow ?? 12;
      o.rime([lerp(a2, b2, 0.02), lerp(a2, b2, 0.35), lerp(a2, b2, 0.65), lerp(a2, b2, 0.98)], sd, -1, { wind: [0.2, -1], look: { fill: '#eef3f6', shade: 0.2 } });
    }
    return res;
  };
  // barnacles and a water drop (the water course underneath the frost)
  o.barnacle = (c, r) => { const j = () => (R() - 0.5) * r * 0.5; f.part([add(c, [-r + j(), r * 0.4]), add(c, [-r * 0.5 + j(), -r * 0.35 + j()]), add(c, [r * 0.4 + j(), -r * 0.45 + j()]), add(c, [r + j(), r * 0.4])], { fill: mix('#a9aaa4', '#6e7074', R() * 0.5), shade: 0.45, inkW: 0.9, inkHeavy: 1.2, cast: false, k: 0.9, hatch: false }); f.line([add(c, [-r * 0.3, -r * 0.3]), add(c, [r * 0.25, -r * 0.35])], 1.4, '#1c1a1a'); };
  o.barnacles = (c, rx, ry, n, r0) => { const L = []; for (let i = 0; i < n; i++) L.push([add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]), r0 * (0.6 + R() * 0.7)]); L.sort((a, b) => a[0][1] - b[0][1]).forEach(([p, r]) => o.barnacle(p, r)); };
  o.drip = (p, s2 = 1) => f.flat(ell(p, 2 * s2, 3.4 * s2, 0, 6), '#b8ccd8', { op: 0.85 });
  o.scars = (c, rx, ry, n, ang = 0.3, col = '#d8dcdc') => { for (let i = 0; i < n; i++) { const p = add(c, [(R() - 0.5) * rx * 2, (R() - 0.5) * ry * 2]), a = ang + (R() - 0.5) * 0.6, l = (14 + R() * 30) * sc; f.stroke([p, add(p, rot([l * 0.5, 1.5], a)), add(p, rot([l, 0], a))], (3 + R() * 3) * sc, col, { op: 0.85 }); f.line([add(p, rot([l * 0.2, 0], a)), add(p, rot([l * 0.8, 0], a))], 0.8, INK, { op: 0.4 }); } };
  return o;
}

// ---- geometry helpers (copied from kit_I_c / kit_I_b)
function spline(ctrl, step = 4) {
  const out = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(E.len(sub(p2, p1)) / step));
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
  }
  out.push(ctrl[ctrl.length - 1].slice(0, 2));
  return out;
}
const arcLen = C => { const s = [0]; for (let i = 1; i < C.length; i++) s.push(s[i - 1] + E.len(sub(C[i], C[i - 1]))); return s; };
function ik(S, W, l1, l2, sign = 1) {
  let d = sub(W, S), L = E.len(d); const reach = l1 + l2 - 0.5;
  let Wr = W; if (L > reach) { Wr = add(S, mul(E.norm(d), reach)); d = sub(Wr, S); L = reach; }
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + L * L - l2 * l2) / (2 * l1 * L)))), base = Math.atan2(d[1], d[0]);
  return [add(S, rot([l1, 0], base + sign * a)), Wr];
}
function clipDraw(f, region, draw) {
  const i0 = f.out.length, res = draw(), body = f.out.splice(i0).join('\n');
  const id = f.id('cl'), d = typeof region === 'string' ? region : E.smooth(region.map(q => [q[0], q[1], 1]));
  f.defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`); f.raw(`<g clip-path="url(#${id})">${body}</g>`);
  return res;
}
// a body tube along a centreline C with widths W (one per point), rounded far end, open start (hidden under a parent)
function ribbon(C, W, o = {}) {
  const P = [], Q = [], n = C.length;
  C.forEach((c, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], d = E.norm(sub(b, a)), m = [-d[1], d[0]]; P.push(add(c, mul(m, W[i] / 2 * (o.p ? o.p(i / (n - 1)) : 1)))); Q.push(add(c, mul(m, -W[i] / 2 * (o.q ? o.q(i / (n - 1)) : 1)))); });
  return [...P, ...Q.reverse()];
}
// anatomical limb through three joints (copied from kit_I_c): bony point on the outside of the bend, muscle bellies inside
function jointLimb(A, J, Bp, ws, o = {}) {
  const out = E.norm(mul(add(E.norm(sub(A, J)), E.norm(sub(Bp, J))), -1));
  const sideOf = (a, b) => { const d = E.norm(sub(b, a)), n = [-d[1], d[0]]; return n[0] * out[0] + n[1] * out[1] > 0 ? 'p' : 'q'; };
  const s0 = sideOf(A, J), s1 = sideOf(J, Bp), bp = [], bq = [], push = (sd, v) => (sd === 'p' ? bp : bq).push(v), opp = sd => (sd === 'p' ? 'q' : 'p');
  push(s0, [0, 1, o.point ?? 0.45, 0.07]); push(s1, [1, 0, o.point ?? 0.45, 0.07]);
  push(opp(s0), [0, o.mus0At ?? 0.45, o.mus0 ?? 0.2, 0.2]); push(opp(s1), [1, 0.22, o.mus1 ?? 0.24, 0.14]);
  push(s1, [1, 0.35, (o.mus1 ?? 0.24) * 0.5, 0.18]);
  return K.chain([A, J, Bp], ws, { bp, bq, steps: 10 });
}
// joint cuts for split(): parent keeps the side toward A, child the side toward Bp, both own a disk of radius r
const jcut = (A, J, Bp, r) => [side(J, mul(E.norm(sub(J, A)), -1), r), side(J, E.norm(sub(Bp, J)), r)];
// fine crease fan at a joint (copied from kit_I_b)
function creases(f, c, ang, len, n, col, op = 0.55) {
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * len * 0.22, a = ang + (f.r() - 0.5) * 0.3, p = add(c, rot([0, o], ang)); f.line([add(p, rot([-len / 2, 0], a)), add(p, rot([0, len * 0.06], a)), add(p, rot([len / 2, 0], a))], 1, col, { op: op * (0.6 + f.r() * 0.4) }); }
}
// knuckle heads, finger-joint creases and a thumbnail on a B.grip fist (copied from kit_I_b fistDetail)
function fistDetail(f, g, s, col, o = {}) {
  const F = g.F, dk = mix(col, '#1a1020', 0.5), lt = mix(col, '#ffffff', 0.4);
  for (let i = 0; i < 4; i++) { const y = -0.45 + i * 0.3; f.flat(F(ell([0.34, y], 0.1, 0.11, 0, 8)), lt, { op: 0.45 }); f.line(F([[0.28, y + 0.1], [0.4, y + 0.12]]), 0.9, dk, { op: 0.6 }); }
  for (let i = 0; i < 4; i++) { const y = -0.5 + i * 0.3; f.line(F([[0.5, y + 0.06], [0.56, y + 0.12], [0.54, y + 0.2]]), 0.9, dk, { op: 0.55 }); }
  f.part(F([[0.38, -0.82], [0.56, -0.8], [0.6, -0.68], [0.44, -0.66]]), { fill: o.nail || mix(col, '#d8d4dc', 0.5), shade: 0.3, inkW: 0.9, inkHeavy: 1.1, cast: false, hatch: false });
  if (o.web) f.flat(F([[0.02, -0.52], [0.36, -0.5], [0.3, -0.34], [0.06, -0.38]]), o.web, { op: 0.55 });
  if (o.wrinkle !== false) for (let i = 0; i < 3; i++) f.line(F([[-0.6 + i * 0.12, -0.3], [-0.55 + i * 0.12, 0.3]]), 0.8, dk, { op: 0.4 });
}
// a tapered tube through joint points with a rounded far end and an open base (copied from kit_I_a)
function tube(pts, ws, capK = 0.9) {
  const o = K.chain(pts, ws, { steps: 6 }), n = o.length / 2, P = o.slice(0, n), Q = o.slice(n);
  const b = pts[pts.length - 1], a = pts[pts.length - 2], d = E.norm(sub(b, a)), nn = [-d[1], d[0]], r = ws[ws.length - 1] / 2, cap = [];
  for (let i = 1; i < 8; i++) { const t = Math.PI * i / 8; cap.push(add(b, add(mul(nn, Math.cos(t) * r), mul(d, Math.sin(t) * r * capK)))); }
  return [...P, ...cap, ...Q];
}
// an open hand with jointed fingers, knuckle creases, nails and optional webbing (after kit_I_a openHand, simplified):
// c wrist, ang wrist->middle knuckle, s hand length; o.flip puts the thumb on the other side; o.back shows the back;
// o.web draws webbing between the fingers (selkie); o.curl 0..1; o.spread.
function openHand(f, c, ang, s, look, o = {}) {
  const sg = o.flip ? -1 : 1, F0 = frame(c, ang, s), F = pts => F0(pts.map(p => [p[0], p[1] * sg]));
  const sp = o.spread ?? 0.14, cu = o.curl ?? 0.2, sw = 1 + (o.swell ?? 0.1), back = !!o.back;
  const sh = look.shadow || mix(look.fill, '#000', 0.4), dk = mix(sh, '#000', 0.3), lt = mix(look.fill, '#fff', 0.45);
  const part = (q, st) => f.part(q, Object.assign({}, look, { cast: false, hatch: false }, st || {}));
  const FG = [[0.405, -0.17, 0.4, 0.088], [0.45, -0.062, 0.5, 0.097], [0.465, 0.048, 0.545, 0.1], [0.44, 0.158, 0.49, 0.097]];
  const fing = FG.map(([u, v, L, w], i) => {
    const a = (i - 1.9) * sp + (o.bend || [0, 0, 0, 0])[i], d = [Math.cos(a), Math.sin(a)], cc = (o.curls || [])[i] ?? cu;
    const k0 = [u, v], k1 = add(k0, mul(d, L * 0.46)), d2 = rot(d, cc * 0.5 * sg * 0), k2 = add(k1, mul(d2, L * 0.3 * (1 - cc * 0.45))), k3 = add(k2, mul(d2, L * 0.24 * (1 - cc * 0.62)));
    return { k0: F([k0])[0], k1: F([k1])[0], k2: F([k2])[0], k3: F([k3])[0], kb: F([add(k0, mul(d, -0.05))])[0], W: w * sw * s };
  });
  const thB = [0.07, 0.19], ta = o.thumbAng ?? 0.9, td = [Math.cos(ta), Math.sin(ta)], th1 = add(thB, mul(td, 0.24)), td2 = [Math.cos(ta - 0.25), Math.sin(ta - 0.25)], th2 = add(th1, mul(td2, 0.2 * (1 - cu * 0.3)));
  const nail = (a, b, w) => { f.part([lp(a, b, 0.35, w * 0.3), lp(a, b, 0.9, w * 0.32), lp(a, b, 1.04, 0), lp(a, b, 0.9, -w * 0.32), lp(a, b, 0.35, -w * 0.28)], { fill: o.nail || mix(look.fill, '#d8dce0', 0.4), shadow: sh, shade: 0.4, inkW: 0.9, inkHeavy: 1.3, cast: false, hatch: false }); f.line([lp(a, b, 0.92, w * 0.05), lp(a, b, 0.7, w * 0.1)], 0.8, INK, { op: 0.6 }); };
  const thumb = () => { part(tube([F([add(thB, mul(td, -0.06))])[0], F([th1])[0], F([th2])[0]], [0.15 * sw * s, 0.125 * sw * s, 0.105 * sw * s]), { inkW: 1.3, inkHeavy: 2 }); const a = F([th1])[0], b = F([th2])[0]; f.line([lp(a, b, -0.04, 0.06 * s), lp(a, b, 0.02, 0), lp(a, b, -0.04, -0.06 * s)], 1.2, dk, { op: 0.7 }); if (back) nail(a, b, 0.11 * sw * s); };
  const finger = g => {
    const ws = [g.W, g.W * 0.94, g.W * 0.86, g.W * 0.78];
    part(tube([g.kb, g.k1, g.k2, g.k3], ws), { inkW: 1.3, inkHeavy: 2 });
    for (const [k, w, pa, pb] of [[g.k1, ws[1], g.k0, g.k2], [g.k2, ws[2], g.k1, g.k3]]) {
      const dd = E.norm(sub(pb, pa)), nn = [-dd[1], dd[0]];
      if (back) { for (let i = 0; i < 3; i++) { const c0 = add(k, mul(dd, (i - 1) * w * 0.15)); f.line([add(c0, mul(nn, -w * 0.34)), add(c0, mul(dd, -w * 0.09)), add(c0, mul(nn, w * 0.34))], i === 1 ? 1.2 : 0.9, INK, { op: 0.5 }); } f.flat(ell(k, w * 0.2, w * 0.14, Math.atan2(dd[1], dd[0]), 8), lt, { op: 0.3 }); }
      else for (const off of [-0.05, 0.05]) f.line([add(add(k, mul(dd, off * w)), mul(nn, w * 0.42)), add(k, mul(dd, off * w + 1)), add(add(k, mul(dd, off * w)), mul(nn, -w * 0.42))], off < 0 ? 1.4 : 1, dk, { op: 0.75 });
    }
    if (back) nail(g.k2, g.k3, ws[3]);
  };
  const palm = F([[-0.06, -0.15], [0.06, -0.2], [0.24, -0.215], [0.4, -0.22], [0.47, -0.13], [0.49, 0.0], [0.48, 0.12], [0.45, 0.21], [0.3, 0.24], [0.16, 0.26], [0.04, 0.23], [-0.06, 0.12]]);
  if (o.web) for (let i = 0; i < 3; i++) { const a = fing[i], b = fing[i + 1]; f.flat([a.k0, lerp(a.k1, a.k2, 0.7), lerp(lerp(a.k1, b.k1, 0.5), lerp(a.k2, b.k2, 0.5), 0.5), lerp(b.k1, b.k2, 0.7), b.k0], o.web, { op: 0.8 }); f.line([lerp(a.k1, a.k2, 0.7), lerp(lerp(a.k1, b.k1, 0.5), lerp(a.k2, b.k2, 0.5), 0.35), lerp(b.k1, b.k2, 0.7)], 0.9, INK, { op: 0.55 }); }
  if (back) { thumb(); part(palm, { inkW: 1.5, inkHeavy: 2.4 }); fing.forEach(finger); fing.forEach(g => { f.flat(ell(g.k0, g.W * 0.34, g.W * 0.24, ang, 10), lt, { op: 0.35 }); f.line([lp(g.k0, g.k1, 0.05, g.W * 0.5), lp(g.k0, g.k1, -0.02, 0), lp(g.k0, g.k1, 0.05, -g.W * 0.5)], 1.1, dk, { op: 0.6 }); f.line([F([[0.04, 0]])[0], g.k0], 1, dk, { op: 0.35 }); }); }
  else { fing.forEach(finger); part(palm, { inkW: 1.5, inkHeavy: 2.4 }); part(F([[0.0, 0.04], [0.12, 0.02], [0.24, 0.12], [0.22, 0.24], [0.08, 0.26], [-0.04, 0.16]]), { inkW: 1, inkHeavy: 1.2, maxShade: 10 }); f.line(F([[0.36, -0.2], [0.33, -0.08], [0.36, 0.04], [0.42, 0.13]]), 1.6, dk, { op: 0.75 }); f.line(F([[0.3, 0.19], [0.18, 0.12], [0.06, 0.1], [0.0, 0.04]]), 1.5, dk, { op: 0.7 }); thumb(); }
  return { fing, F, thumbTip: F([th2])[0] };
}
// mlimb: an anatomical limb from explicit half-width profiles (copied from kit_I_b)
function mlimb(a, b, P, Q, o = {}) {
  const d = E.norm(sub(b, a)), n = [-d[1], d[0]];
  const sd = (arr, sg) => arr.map(([t, w, sh]) => { const q = add(lerp(a, b, t), mul(n, sg * w)); return sh ? [...q, 1] : q; });
  const pp = sd(P, 1), qq = sd(Q, -1), ck = o.capK ?? 0.75, out = [...pp];
  const wpB = P[P.length - 1][1], wqB = Q[Q.length - 1][1], cB = lerp(lerp(a, b, P[P.length - 1][0]), lerp(a, b, Q[Q.length - 1][0]), 0.5);
  if (o.capB !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wpB : wqB; out.push(add(cB, add(mul(n, Math.cos(an) * w), mul(d, Math.sin(an) * (wpB + wqB) / 2 * ck)))); }
  out.push(...qq.reverse());
  const wpA = P[0][1], wqA = Q[0][1], cA = lerp(lerp(a, b, P[0][0]), lerp(a, b, Q[0][0]), 0.5);
  if (o.capA !== false) for (let i = 1; i < 6; i++) { const an = Math.PI * i / 6, w = Math.cos(an) > 0 ? wqA : wpA; out.push(add(cA, add(mul(n, -Math.cos(an) * w), mul(d, -Math.sin(an) * (wpA + wqA) / 2 * ck)))); }
  return out;
}
// a muscular body along a centreline: widths W (one per point), the outside of every bend bulges (stretched muscle)
// and the inside pinches (packed skin). Returns the outline plus at(i, u) (u -1..1 across, +1 = the +normal side),
// the tangents, normals and a signed bend per point (+ = the bend's inside is on the +normal side).
function muscleBody(C, W, o = {}) {
  const n = C.length, T = C.map((_, i) => E.norm(sub(C[Math.min(n - 1, i + 1)], C[Math.max(0, i - 1)]))), Nn = T.map(t => [-t[1], t[0]]);
  const k = 3, bend = C.map((_, i) => { const a = T[Math.max(0, i - k)], b = T[Math.min(n - 1, i + k)], d = sub(b, a); return (d[0] * Nn[i][0] + d[1] * Nn[i][1]); });
  const bs = bend.map((_, i) => { let s = 0, c = 0; for (let j = -3; j <= 3; j++) { const q = bend[Math.max(0, Math.min(n - 1, i + j))]; s += q; c++; } return s / c; });
  const bulge = o.bulge ?? 0.35, pinch = o.pinch ?? 0.18, g = o.gain ?? 2.5;
  for (let i = 0; i < n; i++) bs[i] = Math.max(-1, Math.min(1, bs[i] * g));
  const wp = W.map((w, i) => w / 2 * (1 - (bs[i] > 0 ? pinch : -bulge) * Math.abs(bs[i])));
  const wq = W.map((w, i) => w / 2 * (1 + (bs[i] > 0 ? bulge : -pinch) * Math.abs(bs[i])));
  const P = C.map((c, i) => add(c, mul(Nn[i], wp[i]))), Q = C.map((c, i) => add(c, mul(Nn[i], -wq[i])));
  const at = (i, u) => { i = Math.max(0, Math.min(n - 1, Math.round(i))); return add(C[i], mul(Nn[i], u >= 0 ? u * wp[i] : u * wq[i])); };
  return { outline: [...P, ...Q.slice().reverse()], P, Q, at, T, Nn, bend: bs, n, wp, wq };
}
// standard humanoid joints
function humanJoints(f, J) {
  f.joint('pelvis', J.P).joint('torso', J.T, 'pelvis').joint('head', J.N, 'torso');
  f.joint('upperarm_n', J.SN, 'torso').joint('forearm_n', J.EN, 'upperarm_n').joint('hand_n', J.WN, 'forearm_n');
  f.joint('upperarm_f', J.SF, 'torso').joint('forearm_f', J.EF, 'upperarm_f').joint('hand_f', J.WF, 'forearm_f');
  f.joint('thigh_n', J.HN, 'pelvis').joint('shin_n', J.KN, 'thigh_n').joint('foot_n', J.AN, 'shin_n');
  f.joint('thigh_f', J.HF, 'pelvis').joint('shin_f', J.KF, 'thigh_f').joint('foot_f', J.AF, 'shin_f');
  return f;
}
// rope: a twisted cord along a polyline (a dark core, lay lines), frozen stiff
function rope(f, pts, w, col = PAL.rope, o = {}) {
  const C = spline(pts, 3);
  f.line(C, w + 2, INK, { op: 0.9 }); f.line(C, w, col);
  for (let i = 1; i < C.length - 1; i += 2) { const d = E.norm(sub(C[i + 1], C[i - 1])), n = [-d[1], d[0]]; f.line([add(C[i], mul(n, w * 0.45)), add(add(C[i], mul(d, w * 0.5)), mul(n, -w * 0.45))], 0.8, mix(col, '#000', 0.5), { op: 0.7, straight: true }); }
  if (o.lit !== false) f.line(C.map(q => add(q, [w * 0.15, -w * 0.25])), Math.max(0.8, w * 0.2), '#e8eef2', { op: 0.45 });
  return C;
}

module.exports = { PAL, space, fx, spline, arcLen, ik, clipDraw, ribbon, jointLimb, jcut, creases, fistDetail, tube, openHand, mlimb, humanJoints, rope, split, side, muscleBody };
