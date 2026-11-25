// The Undercroft smithy: Mother Hild's forge under the east range. A barrel-vaulted cellar split by a low arcade on two
// squat round pillars; the forge and its hood fill the back right bay, burning Storm Foundry coal that throws white-blue
// static up the hood; racks of half-made steel and the rune bench in the back left; the stair up to the walk rises out of
// the left wall. The anvil (the panel) stands in the front bay with a billet cooling on it.
// Box-set camera shared by every interior: eye 1.6 m, horizon 430, focal 900.
// Writes grim/hub/int/smithy.svg, smithy__bg.svg, smithy__fg.svg, smithy.light.json, smithy_hotspots.json.
const { G, INK, smooth, poly, blob } = require('../gr');
const { mix, dark, light } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const W = 1600, H = 1000, HZ = 430, E = 1.6, FL = 900, CX = 800;
const S = require('./scenekit')({ W, H, HZ, E, FL, CX, seed: 5150 });
const { a, D, R, P, K, pp, inkAt, seg, HOT, PLANES, LIGHTS, PLW, EM, addLight, stoneTrace, outline, hot, stones, stones0, render, bloom, shade, planks, archPts, archRing, through, barrel, sack, fireTongues, smoke, lantern, candles } = S;
const DETAIL = process.env.PASS !== 'base';
fs.mkdirSync('grim/hub/int', { recursive: true });

const prop = (Z, fn) => { a.raw(`<g class="z_${Math.round(Z * 100)}">`); fn(); a.raw('</g>'); };
const WALL = '#4a433a', WALL2 = '#524a40', FLOOR = '#3a342c', VAULT = '#433c34', IRON = '#3e3c3a', WOOD = '#4a3624';
const HW = 5, D0 = 2.5, D1 = 8, SPR = 2.6, CROWN = 1.1;          // half width, nearest and back wall depth, vault springing and rise
const Yv = X => SPR + CROWN * Math.sqrt(Math.max(0, 1 - (X / HW) ** 2));
const AZ = 6.0, AD = 0.35;                                       // arcade face depth and thickness
const PIL = [-2.6, 2.6], PR = 0.35, ASP = 2.3;                  // pillars, radius, arch springing
const KEEPER = { X: 1.0, Z: 4.62, h: 1.62 };
const ANVIL = { X: -0.05, Z: 4.5 };
const blue = s => s.replace(/#7a1e0c/g, '#1e3a7a').replace(/#d8501a/g, '#5a8ad8').replace(/#ffa83a/g, '#bfe6ff').replace(/#fff0b0/g, '#ffffff');
// static: a jagged white-blue thread between two screen points
const bolt = (x0, y0, x1, y1, n = 7, jag = 10) => { let d = `M${f(x0)} ${f(y0)}`; for (let i = 1; i <= n; i++) { const t = i / n; d += ` L${f(x0 + (x1 - x0) * t + (i < n ? (R() - 0.5) * jag * 2 : 0))} ${f(y0 + (y1 - y0) * t + (i < n ? (R() - 0.5) * jag : 0))}`; }
  return `<path d="${d}" stroke="#7fb6ff" stroke-width="5" fill="none" opacity="0.3"/><path d="${d}" stroke="#d8f0ff" stroke-width="1.8" fill="none"/><path d="${d}" stroke="#ffffff" stroke-width="0.7" fill="none"/>`; };

a.layer('bg');
a.raw(`<rect width="${W}" height="${H}" fill="#0e0b09"/>`);

// ------------------------------------------------------------------ the vault: a barrel of rough coursed stone; drawn once, then clipped
// into flat strips so each strip carries its own plane for the lighting
function vault(z0, z1, col) {
  const Lt = 11.4, at = (s, t) => { const th = Math.PI * (1 - t / Lt); return [HW * Math.cos(th), SPR + CROWN * Math.sin(th), z0 + s]; };
  const body = stones0(at, z1 - z0, Lt, col, { course: 0.3, block: 0.62, streaks: 10, vary: 0.2 });
  const N = 12;
  for (let i = 0; i < N; i++) {
    const t0 = Lt * i / N, t1 = Lt * (i + 1) / N, q = [at(0, t0), at(z1 - z0, t0), at(z1 - z0, t1), at(0, t1)];
    const id = a.id('vs');
    a.raw(PLW([q[0], q[1], q[3]], `<clipPath id="${id}"><path d="${pp(q)}"/></clipPath><g clip-path="url(#${id})">${body}</g>`));
  }
  for (let i = 0; i < N; i++) { const t0 = Lt * i / N, t1 = Lt * (i + 1) / N; shade([at(0, t0), at(z1 - z0, t0), at(z1 - z0, t1), at(0, t1)], { depth: 10, mottle: 0.4, grime: 0.5, ink: 0, wash: 0.25, hl: false }); }
}
vault(AZ + AD, D1, VAULT);
vault(D0, AZ, VAULT);

// ------------------------------------------------------------------ back wall (arched top), side walls, floor
{
  const top = []; for (let i = 0; i <= 24; i++) { const X = -HW + 2 * HW * i / 24; top.push([X, Yv(X), D1]); }
  const back = [[-HW, 0, D1], [HW, 0, D1], ...top.reverse()];
  const atB = (s, t) => [-HW + s, t, D1];
  through(back, () => a.raw(stones(atB, 2 * HW, SPR + CROWN, WALL, { course: 0.38, block: 0.8, streaks: 14, rubble: 1 })));
  shade(back, { depth: 22, mottle: 0.45, grime: 0.55, ink: 0, wash: 0.3 });
}
for (const side of [-1, 1]) {
  const atS = (s, t) => [side * HW, t, D0 + s];
  a.raw(stones(atS, D1 - D0, SPR, side < 0 ? WALL2 : WALL, { course: 0.4, block: 0.85, streaks: 8 }));
  shade([atS(0, 0), atS(D1 - D0, 0), atS(D1 - D0, SPR), atS(0, SPR)], { depth: 18, mottle: 0.45, grime: 0.5, ink: 0, wash: 0.3 });
}
{
  const atF = (s, t) => [-HW + s, 0, D0 + t];
  a.raw(stones(atF, 2 * HW, D1 - D0, FLOOR, { course: 0.42, block: 0.62, vary: 0.16 }));
  shade([atF(0, 0), atF(2 * HW, 0), atF(2 * HW, D1 - D0), atF(0, D1 - D0)], { depth: 16, mottle: 0.5, grime: 0.7, ink: 0, wash: 0.25, hl: false });
  // soot trodden in from the forge, scale and slag round the anvil and the hearth, a dark wet patch from the trough
  let o = '';
  for (let i = 0; i < 9; i++) o += a.stain(...P(1.6 + R() * 2.6, 0, 6.4 + R() * 1.4), K(7) * (0.25 + R() * 0.3), '#0a0806', 0.3);
  for (let i = 0; i < 6; i++) o += a.stain(...P(ANVIL.X + (R() - 0.5) * 1.2, 0, ANVIL.Z + 0.1 + (R() - 0.5) * 0.6), K(4.6) * (0.15 + R() * 0.2), '#0e0a08', 0.3);
  o += a.stain(...P(3.2, 0, 4.4), K(4.4) * 0.45, '#0a0c10', 0.4);
  for (let i = 0; i < 70; i++) { const X = (R() - 0.5) * 4 + (i < 35 ? ANVIL.X : 2.6), Z = (i < 35 ? ANVIL.Z + 0.2 : 7.0) + (R() - 0.5) * 1.4, [x, y] = P(X, 0, Z), r = K(Z) * (0.008 + R() * 0.02);
    o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.4)}" ry="${f(r * 0.6)}" fill="${R() < 0.3 ? '#3a2a20' : '#14100c'}"/>`; }
  a.raw(PLW([atF(0, 0), atF(1, 0), atF(0, 1)], o));
}

{
  const atR = (s, t) => [HW, t, D0 + s];
  a.raw(PLW([atR(0, 0), atR(1, 0), atR(0, 1)], bloom(...P(HW, 1.8, 7.0), K(7) * 1.2, '#050403', 0.28, 0.4) + bloom(...P(HW, 1.0, 6.2), K(6.2) * 0.9, '#050403', 0.22, 0.2)));
}
// ------------------------------------------------------------------ the way out: a round-headed door in the right wall (the undercroft's garth door faces east), the stair rising out of it
const DOOR = { z0: 6.55, z1: 7.55, ts: 1.95, rise: 0.5 };
{
  const atL = (s, t) => [HW, t, s];
  const hole = archPts(atL, DOOR.z0, DOOR.z1, 0, DOOR.ts, DOOR.rise, 12);
  through(hole, () => {
    // the passage: the stair climbs away to the right; its far wall takes the Grey falling from the walk above
    const zf = DOOR.z1 + 0.15, zs = DOOR.z1 + 0.05, gid = a.id('st');
    a.raw(`<linearGradient id="${gid}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1a1816"/><stop offset="0.45" stop-color="#5a5854"/><stop offset="1" stop-color="#b4b2aa"/></linearGradient>`);
    a.raw(PLW([[HW, 0, zf], [HW + 3, 0, zf], [HW, 3, zf]], EM(`<path d="${pp([[HW - 0.2, -0.1, zf], [HW + 3, -0.1, zf], [HW + 3, 3.4, zf], [HW - 0.2, 3.4, zf]])}" fill="url(#${gid})"/>`)));
    const prof = [[HW - 0.2, 0, zs]]; for (let k = 0; k < 10; k++) { const X0 = HW + 0.3 * k, Y1 = 0.19 * (k + 1); prof.push([X0, Y1 - 0.19, zs], [X0, Y1, zs], [X0 + 0.3, Y1, zs]); } prof.push([HW + 3.2, 0, zs]);
    a.raw(PLW([[HW, 0, zs], [HW + 1, 0, zs], [HW, 1, zs]], `<path d="${pp(prof)}" fill="#24201c" stroke="${INK}" stroke-width="1.4"/>`));
    for (let k = 0; k < 10; k++) { const X0 = HW + 0.3 * k, Y1 = 0.19 * (k + 1); a.raw(EM(`<path d="${pp([[X0, Y1, zs], [X0 + 0.3, Y1, zs]]).replace(' Z', '')}" stroke="#c8c4ba" stroke-width="2.6" opacity="${f(0.45 + k * 0.05)}"/>`)); }
    // the near jamb's reveal: the wall is 0.6 m thick
    a.raw(PLW([[HW, 0, DOOR.z1], [HW + 0.6, 0, DOOR.z1], [HW, 2, DOOR.z1]], `<path d="${pp([[HW, 0, DOOR.z1], [HW + 0.6, 0, DOOR.z1], [HW + 0.6, DOOR.ts + 0.4, DOOR.z1], [HW, DOOR.ts + 0.4, DOOR.z1]])}" fill="#3a342e" stroke="${INK}" stroke-width="1.2"/>`));
  });
  addLight(HW + 0.3, 1.6, (DOOR.z0 + DOOR.z1) / 2, 1.0, 4.5, [0.62, 0.66, 0.74]);
  a.raw(archRing(atL, DOOR.z0, DOOR.z1, DOOR.ts, DOOR.rise, 0.22, WALL2, 7));
  // jamb stones and a worn threshold
  for (const z of [DOOR.z0 - 0.2, DOOR.z1]) for (let t = 0; t < DOOR.ts; t += 0.38) a.raw(PLW([atL(z, t), atL(z + 0.2, t), atL(z, t + 0.3)], `<path d="${pp([atL(z, t + 0.02), atL(z + 0.2, t + 0.02), atL(z + 0.2, t + 0.36), atL(z, t + 0.36)])}" fill="${mix(WALL2, '#d0c4a8', R() * 0.25)}" stroke="${INK}" stroke-width="1.1"/>`));
  a.raw(PLW([[HW, 0.12, DOOR.z0], [HW - 0.35, 0.12, DOOR.z0], [HW, 0.12, DOOR.z1]], `<path d="${pp([[HW, 0.12, DOOR.z0 - 0.15], [HW - 0.35, 0.12, DOOR.z0 - 0.15], [HW - 0.35, 0.12, DOOR.z1 + 0.15], [HW, 0.12, DOOR.z1 + 0.15]])}" fill="#6a6256" stroke="${INK}" stroke-width="1.2"/>`));
  a.raw(PLW([[HW - 0.35, 0, DOOR.z0], [HW - 0.35, 0.12, DOOR.z0], [HW - 0.35, 0, DOOR.z1]], `<path d="${pp([[HW - 0.35, 0, DOOR.z0 - 0.15], [HW - 0.35, 0.12, DOOR.z0 - 0.15], [HW - 0.35, 0.12, DOOR.z1 + 0.15], [HW - 0.35, 0, DOOR.z1 + 0.15]])}" fill="#3e3830" stroke="${INK}" stroke-width="1.2"/>`));
  // the bottom of the stair comes out through the door into the room: three worn steps
  for (let k = 1; k >= 0; k--) {
    const xe = HW - 0.25 * (2 - k), y1 = 0.18 * (k + 1), y0 = 0.18 * k, z0 = DOOR.z0 - 0.05, z1 = DOOR.z1 + 0.05, col = mix('#5a5248', '#0e0a08', k * 0.08);
    const front = [[HW, y0, z0], [xe, y0, z0], [xe, y1, z0], [HW, y1, z0]], riser = [[xe, y0, z0], [xe, y0, z1], [xe, y1, z1], [xe, y1, z0]], tread = [[HW, y1, z0], [xe, y1, z0], [xe, y1, z1], [HW, y1, z1]];
    a.raw(PLW([riser[0], riser[1], riser[3]], `<path d="${pp(riser)}" fill="${dark(col, 0.25)}" stroke="${INK}" stroke-width="1.6"/>`));
    a.raw(PLW([tread[0], tread[1], tread[3]], `<path d="${pp(tread)}" fill="${col}" stroke="${INK}" stroke-width="1.6"/>` + `<path d="${pp([[xe + 0.04, y1, z0 + 0.2], [xe + 0.04, y1, z1 - 0.3]]).replace(' Z', '')}" stroke="#8a8274" stroke-width="2" opacity="0.5"/>`));
    a.raw(PLW([front[0], front[1], front[3]], `<path d="${pp(front)}" fill="${dark(col, 0.1)}" stroke="${INK}" stroke-width="1.6"/>`));
  }
  hot('exit', 'To the garth', hole.map(p => P(...p)));
  {   // one closed loop: the arch's outer edge, then round the two treads that come out into the room
    const za = DOOR.z0 - 0.22, zb = DOOR.z1 + 0.22, sz0 = DOOR.z0 - 0.1, sz1 = DOOR.z1 + 0.1, rw = (zb - za) / 2, zm = (za + zb) / 2, arc = [];
    for (let i = 0; i <= 16; i++) { const th = Math.PI * (1 - i / 16); arc.push([HW - 0.02, DOOR.ts + Math.sin(th) * (DOOR.rise + 0.22), zm + Math.cos(th) * rw]); }
    outline('exit', [[[[HW - 0.02, 0.36, za], ...arc, [HW - 0.02, 0.36, zb], [HW - 0.02, 0.37, sz1], [HW - 0.26, 0.37, sz1], [HW - 0.26, 0.19, sz1], [HW - 0.51, 0.19, sz1], [HW - 0.51, 0, sz1], [HW - 0.51, 0, sz0], [HW - 0.51, 0.19, sz0], [HW - 0.26, 0.19, sz0], [HW - 0.26, 0.37, sz0], [HW - 0.02, 0.37, sz0]], true]]);
  }
}

// ------------------------------------------------------------------ the back left bay: racks of steel on the wall, the rune bench below
const atB = (s, t) => [s, t, D1 - 0.02];
{
  // the rack: two posts, three rails, pegs
  const x0 = -4.7, x1 = -3.0;
  prop(D1 - 0.1, () => {
    for (const X of [x0, x1]) a.shape({ d: pp([[X - 0.06, 0.9, D1 - 0.05], [X + 0.06, 0.9, D1 - 0.05], [X + 0.06, 2.55, D1 - 0.05], [X - 0.06, 2.55, D1 - 0.05]]), fill: WOOD, depth: 3, ink: 1.4, tex: 'url(#grain)', texOp: 0.4, hatch: 90 });
    for (const Y of [1.3, 1.95, 2.45]) a.shape({ d: pp([[x0 - 0.1, Y - 0.04, D1 - 0.08], [x1 + 0.1, Y - 0.04, D1 - 0.08], [x1 + 0.1, Y + 0.04, D1 - 0.08], [x0 - 0.1, Y + 0.04, D1 - 0.08]]), fill: WOOD, depth: 2, ink: 1.3, tex: 'url(#grain)', texOp: 0.4 });
    // blades hung point-down from the top rail: some finished and bright, some black from the fire, one only a bar
    for (let i = 0; i < 7; i++) {
      const X = x0 + 0.18 + i * 0.22, top = 2.42, len = 0.75 + R() * 0.25, raw = i === 2 || i === 5, s = K(D1);
      const [bx, by] = P(X, top, D1 - 0.12), [tx, ty] = P(X + (R() - 0.5) * 0.04, top - len, D1 - 0.12), w = s * (raw ? 0.035 : 0.045);
      a.raw(`<path d="M${f(bx - w)} ${f(by)} L${f(bx + w)} ${f(by)} L${f(tx + w * 0.4)} ${f(ty - w)} L${f(tx)} ${f(ty)} L${f(tx - w * 0.4)} ${f(ty - w)} Z" fill="${raw ? '#2a2624' : mix(G.steel, '#1a1816', R() * 0.4)}" stroke="${INK}" stroke-width="1.1"/>` +
        (raw ? '' : `<path d="M${f(bx)} ${f(by)} L${f(tx)} ${f(ty - w)}" stroke="#d8d4c8" stroke-width="0.7" opacity="0.6"/>`) +
        `<path d="M${f(bx - s * 0.06)} ${f(by - 1)} L${f(bx + s * 0.06)} ${f(by - 1)}" stroke="${INK}" stroke-width="${f(s * 0.025 + 1.5)}"/><path d="M${f(bx)} ${f(by)} L${f(bx)} ${f(by - s * 0.14)}" stroke="${INK}" stroke-width="${f(s * 0.03 + 1.6)}"/><path d="M${f(bx)} ${f(by)} L${f(bx)} ${f(by - s * 0.14)}" stroke="#5a4028" stroke-width="${f(s * 0.03)}"/>`);
    }
    // a mail shirt hung by its shoulders on the middle rail, a sallet on a peg, a breastplate leaning on the post
    const ms = [P(-4.55, 1.95, D1 - 0.14), P(-3.75, 1.95, D1 - 0.14), P(-3.7, 1.25, D1 - 0.14), P(-4.6, 1.22, D1 - 0.14)];
    a.shape({ d: smooth([ms[0], [(ms[0][0] + ms[1][0]) / 2, ms[0][1] + 6], ms[1], [ms[1][0] + 6, (ms[1][1] + ms[2][1]) / 2], ms[2], [(ms[2][0] + ms[3][0]) / 2, ms[2][1] + 4], ms[3], [ms[3][0] - 5, (ms[0][1] + ms[3][1]) / 2]], true, 0.3), fill: G.steelD, tex: 'url(#mail)', texOp: 0.9, depth: 8, ink: 1.4, hatch: 70, decals: a.stain(ms[2][0] - 10, ms[2][1] - 10, 12, G.rust, 0.6) });
    const [hx, hy] = P(-3.2, 2.2, D1 - 0.15), hs = K(D1);
    a.shape({ d: smooth([[hx - hs * 0.16, hy + hs * 0.06], [hx - hs * 0.14, hy - hs * 0.1], [hx, hy - hs * 0.16], [hx + hs * 0.16, hy - hs * 0.08], [hx + hs * 0.28, hy + hs * 0.06], [hx + hs * 0.1, hy + hs * 0.1]], true, 0.5), fill: G.steel, depth: 6, ink: 1.4, hatch: 60, spec: [`M${f(hx - hs * 0.08)} ${f(hy - hs * 0.1)} Q${f(hx)} ${f(hy - hs * 0.14)} ${f(hx + hs * 0.1)} ${f(hy - hs * 0.08)}`],
      lines: [{ d: `M${f(hx - hs * 0.15)} ${f(hy)} L${f(hx + hs * 0.1)} ${f(hy - hs * 0.01)}`, w: 2.2 }] });
  });
  // the rune bench: a heavy board on trestles, a steel plate in a vice with its runes cut and faintly alive, chisels, candles
  const bx0 = -4.45, bx1 = -3.05, bz0 = 6.85, bz1 = 7.55, bt = 0.88;
  prop(bz0, () => {
    for (const X of [bx0 + 0.12, bx1 - 0.12]) a.shape({ d: pp([[X - 0.05, 0, bz0 + 0.05], [X + 0.05, 0, bz0 + 0.05], [X + 0.05, bt, bz0 + 0.05], [X - 0.05, bt, bz0 + 0.05]]), fill: dark(WOOD, 0.2), depth: 3, ink: 1.4 });
    a.raw(`<path d="${pp([[bx0 + 0.12, 0.05, bz0 + 0.05], [bx1 - 0.12, 0.45, bz0 + 0.05]])}" stroke="${INK}" stroke-width="3"/>`);
    a.shape({ d: pp([[bx0, bt, bz0], [bx1, bt, bz0], [bx1, bt, bz1], [bx0, bt, bz1]]), fill: mix(WOOD, '#8a7a60', 0.15), depth: 4, ink: 1.4, tex: 'url(#grain)', texOp: 0.5, hatch: 0,
      decals: a.stain(...P(-3.7, bt, 7.2), 20, '#0e0a08', 0.5) });
    a.shape({ d: pp([[bx0, bt - 0.09, bz0], [bx1, bt - 0.09, bz0], [bx1, bt, bz0], [bx0, bt, bz0]]), fill: dark(WOOD, 0.1), depth: 2, ink: 1.4, tex: 'url(#grain)', texOp: 0.5 });
    // the plate, upright in a little vice, runes cut in it
    const pl = [[-3.95, bt + 0.08, 7.2], [-3.55, bt + 0.08, 7.2], [-3.55, bt + 0.42, 7.2], [-3.95, bt + 0.42, 7.2]];
    a.shape({ d: pp(pl), fill: G.steelD, depth: 4, ink: 1.4, hatch: 30, spec: [`M${pp([pl[3], pl[2]]).slice(1, -2)}`] });
    let rn = '';
    for (let i = 0; i < 4; i++) { const [x, y] = P(-3.89 + i * 0.09, bt + 0.32, 7.19), s = K(7.2) * 0.05; rn += `<path d="M${f(x)} ${f(y)} l0 ${f(s * 2.6)} M${f(x)} ${f(y + s * 0.6)} l${f(s)} ${f(-s * 0.6)} M${f(x)} ${f(y + s * 1.4)} l${f(s * 0.9)} ${f(s * 0.5)}" stroke="#a8d8ff" stroke-width="1.6" fill="none"/>`; }
    a.raw(EM(rn));
    addLight(-3.75, bt + 0.3, 7.0, 0.12, 1.2, [0.6, 0.8, 1.0]);
    a.raw(`<path d="${pp([[-3.98, bt, 7.22], [-3.52, bt, 7.22], [-3.52, bt + 0.1, 7.22], [-3.98, bt + 0.1, 7.22]])}" fill="${IRON}" stroke="${INK}" stroke-width="1.3"/>`);
    // chisels and a mallet laid on the board
    for (let i = 0; i < 4; i++) { const X = -4.3 + i * 0.07, Z = 7.0 + R() * 0.2; a.raw(`<path d="${pp([[X, bt + 0.01, Z], [X + 0.18, bt + 0.01, Z - 0.05]])}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="${pp([[X, bt + 0.01, Z], [X + 0.18, bt + 0.01, Z - 0.05]])}" stroke="${i % 2 ? G.steel : G.wood}" stroke-width="1.8"/>`); }
    a.raw(candles(-4.25, 7.35, 3, bt, 0.25));
  });
}

// ------------------------------------------------------------------ the back centre: the order's niche, tools on pegs, the coal bunker
{
  // a shallow arched niche with a lead ostium and a stub of candle; soot above it
  const atN = (s, t) => [s, t, D1 - 0.03];
  const niche = archPts(atN, -1.05, -0.45, 1.35, 1.85, 0.3, 8);
  a.raw(PLW([niche[0], niche[1], niche[2]], `<path d="${pp(niche)}" fill="#2e261c" stroke="${INK}" stroke-width="1.6"/>`));
  addLight(-0.75, 1.55, D1 - 0.35, 0.22, 1.6, [1.0, 0.74, 0.44]);
  a.raw(archRing(atN, -1.05, -0.45, 1.85, 0.3, 0.1, WALL2, 5));
  { const [x, y] = P(-0.75, 1.62, D1 - 0.05), s = K(D1) * 0.06; a.raw(`<path d="M${f(x - s)} ${f(y + s * 1.6)} L${f(x - s)} ${f(y)} Q${f(x)} ${f(y - s * 1.3)} ${f(x + s)} ${f(y)} L${f(x + s)} ${f(y + s * 1.6)}" stroke="#8a8a86" stroke-width="2.4" fill="none"/>`); }
  a.raw(candles(-0.75, D1 - 0.1, 1, 1.37, 0.1));
  // pegs: hammers by size, tongs of every bite, a fuller, a swage, hung on a board
  const pb = [[-0.25, 1.05, D1 - 0.04], [1.25, 1.05, D1 - 0.04], [1.25, 2.1, D1 - 0.04], [-0.25, 2.1, D1 - 0.04]];
  a.raw(PLW([pb[0], pb[1], pb[3]], planks((s, t) => [-0.25 + s, 1.05 + t, D1 - 0.04], 1.5, 1.05, WOOD, { across: true, board: 0.21, nails: 6 })));
  prop(D1 - 0.1, () => {
    const s = K(D1);
    for (let i = 0; i < 5; i++) {               // hammers, head up
      const [x, y] = P(-0.1 + i * 0.16, 2.0, D1 - 0.08), hl = s * (0.32 + i * 0.03), hw = s * (0.06 + i * 0.012);
      a.raw(`<circle cx="${f(x)}" cy="${f(y - 2)}" r="2" fill="${INK}"/><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y + hl)}" stroke="${INK}" stroke-width="${f(s * 0.025 + 2)}" stroke-linecap="round"/><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y + hl)}" stroke="${G.wood}" stroke-width="${f(s * 0.025)}"/>` +
        `<rect x="${f(x - hw)}" y="${f(y + hl * 0.02)}" width="${f(hw * 2)}" height="${f(s * 0.045)}" fill="${IRON}" stroke="${INK}" stroke-width="1.2"/>`);
    }
    for (let i = 0; i < 4; i++) {               // tongs, jaws down
      const [x, y] = P(0.72 + i * 0.13, 2.02, D1 - 0.08), l = s * (0.5 + R() * 0.15), j = s * 0.02;
      a.raw(`<path d="M${f(x - j)} ${f(y)} L${f(x - j * 0.5)} ${f(y + l * 0.7)} L${f(x - j * 2.2)} ${f(y + l)} M${f(x + j)} ${f(y)} L${f(x + j * 0.5)} ${f(y + l * 0.7)} L${f(x + j * 2.2)} ${f(y + l)}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${f(x - j)} ${f(y)} L${f(x - j * 0.5)} ${f(y + l * 0.7)} L${f(x - j * 2.2)} ${f(y + l)} M${f(x + j)} ${f(y)} L${f(x + j * 0.5)} ${f(y + l * 0.7)} L${f(x + j * 2.2)} ${f(y + l)}" stroke="${G.iron}" stroke-width="1.4" fill="none"/>`);
    }
  });
  // the coal bunker: a boarded crib against the wall heaped with Storm Foundry coal, glints of blue in it
  prop(D1 - 0.6, () => {
    a.raw(planks((s, t) => [-2.2 + s, t, D1 - 0.75], 1.6, 0.55, WOOD, { board: 0.18, nails: 5 }));
    const heap = []; for (let i = 0; i <= 10; i++) { const X = -2.25 + 1.7 * i / 10; heap.push(P(X, 0.55 + Math.sin(i / 10 * Math.PI) * 0.4 + (R() - 0.5) * 0.06, D1 - 0.5)); }
    a.shape({ d: smooth([P(-2.25, 0.5, D1 - 0.75), ...heap, P(-0.55, 0.5, D1 - 0.75)], true, 0.3), fill: '#1e1c1c', depth: 8, ink: 1.4, hatch: 30, mottle: 0.4,
      decals: Array.from({ length: 30 }, () => { const [x, y] = P(-2.1 + R() * 1.4, 0.6 + R() * 0.3, D1 - 0.55); return `<path d="${blob(x, y, 2 + R() * 3, R, 5, 0.4)}" fill="${R() < 0.15 ? '#7fa8d8' : '#3a3838'}" stroke="${INK}" stroke-width="0.6"/>`; }).join('') });
  });
}

// ------------------------------------------------------------------ the forge: a stone hearth, the hood climbing into the vault, the fire, the static, the bellows
const FORGE = { x0: 1.45, x1: 4.35, z0: 7.0, z1: 7.9, top: 0.95, fire: [2.9, 1.05, 7.4] };
{
  const { x0, x1, z0, z1, top } = FORGE;
  // the hood: a sooted stone cone on iron brackets, tapering into a flue
  const hood = [[x0 + 0.1, 1.75, z0 + 0.2], [x1 - 0.1, 1.75, z0 + 0.2], [x1 - 0.7, 2.9, z0 + 0.55], [x1 - 0.95, Yv(x1 - 0.95) + 0.1, z0 + 0.75], [x0 + 0.95, Yv(x0 + 0.95) + 0.1, z0 + 0.75], [x0 + 0.7, 2.9, z0 + 0.55]];
  const atH = (s, t) => [x0 + 0.1 + s, 1.75 + t, z0 + 0.2 + t * 0.3];
  a.raw(PLW([hood[0], hood[1], hood[5]], `<path d="${pp(hood)}" fill="#3a302a"/>`));
  through(hood, () => a.raw(PLW([hood[0], hood[1], hood[5]], stones0(atH, x1 - x0 - 0.2, 2.2, '#443a32', { course: 0.3, block: 0.6, vary: 0.25 }))));
  shade(hood, { depth: 20, mottle: 0.5, grime: 0.7, ink: 2.4, wash: 0.4, dark: 30, darkOp: 0.4 });
  a.raw(PLW([hood[0], hood[1], hood[5]], bloom(...P((x0 + x1) / 2, 2.0, z0 + 0.3), K(7.3) * 0.7, '#000', 0.5, 0.6)));
  a.raw(PLW([hood[0], hood[1], hood[5]], `<path d="${pp([[x0 + 0.05, 1.72, z0 + 0.19], [x1 - 0.05, 1.72, z0 + 0.19], [x1 - 0.05, 1.86, z0 + 0.19], [x0 + 0.05, 1.86, z0 + 0.19]])}" fill="${IRON}" stroke="${INK}" stroke-width="1.6"/>`));
  for (const X of [x0 + 0.3, x1 - 0.3]) a.raw(`<path d="${pp([[X, 1.74, z0 + 0.2], [X, 1.3, z0 + 0.6], [X, 1.3, z1 - 0.1]]).replace(' Z', '')}" stroke="${INK}" stroke-width="5" fill="none"/><path d="${pp([[X, 1.74, z0 + 0.2], [X, 1.3, z0 + 0.6], [X, 1.3, z1 - 0.1]]).replace(' Z', '')}" stroke="${IRON}" stroke-width="2.6" fill="none"/>`);
  // the back of the fire pit: the wall behind is glowing, the flue mouth black
  a.raw(EM(`<path d="${pp([[x0 + 0.25, top, z1 - 0.05], [x1 - 0.2, top, z1 - 0.05], [x1 - 0.3, 1.74, z1 - 0.05], [x0 + 0.35, 1.74, z1 - 0.05]])}" fill="url(#fbx)"/>` + `<path d="${pp([[x0 + 0.25, top, z1 - 0.05], [x1 - 0.2, top, z1 - 0.05], [x1 - 0.3, 1.74, z1 - 0.05], [x0 + 0.35, 1.74, z1 - 0.05]])}" fill="url(#grimeF)" opacity="0.6"/>`));
  a.raw(`<linearGradient id="fbx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0604"/><stop offset="0.55" stop-color="#2a0e06"/><stop offset="1" stop-color="#7a2e0c"/></linearGradient>`);
  for (const X of [x0 + 0.25, x1 - 0.2]) a.raw(PLW([[X, top, z0 + 0.2], [X, top, z1], [X, 1.7, z0 + 0.2]], `<path d="${pp([[X, top, z0 + 0.2], [X, top, z1 - 0.05], [X, 1.74, z1 - 0.05], [X, 1.74, z0 + 0.2]])}" fill="#2a1c14" stroke="${INK}" stroke-width="1.6"/>`));
  // the hearth block
  const atHF = (s, t) => [x0 + s, t, z0];
  a.raw(stones(atHF, x1 - x0, top, '#5a4e42', { course: 0.32, block: 0.55 }));
  shade([atHF(0, 0), atHF(x1 - x0, 0), atHF(x1 - x0, top), atHF(0, top)], { depth: 14, mottle: 0.5, grime: 0.7, ink: 1.8, wash: 0.35 });
  const topF = [[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]];
  a.raw(PLW([topF[0], topF[1], topF[3]], `<path d="${pp(topF)}" fill="#3a322a" stroke="${INK}" stroke-width="2"/>`));
  // the fire bed: coals heaped in the pit, burning orange with white-blue tongues; the static climbs into the hood
  const [fx, fy] = P(FORGE.fire[0], top + 0.02, FORGE.fire[2] - 0.15), fk = K(7.3);
  const bed = []; for (let i = 0; i <= 12; i++) { const th = Math.PI * i / 12; bed.push([fx + Math.cos(th) * fk * 0.7, fy - Math.sin(th) * fk * 0.16 + (R() - 0.5) * 3]); }
  a.raw(EM(`<path d="${smooth(bed, true, 0.4)}" fill="#c84a14" stroke="${INK}" stroke-width="1.6"/>` + Array.from({ length: 26 }, () => `<path d="${blob(fx + (R() - 0.5) * fk * 1.2, fy - R() * fk * 0.13, 2 + R() * 4, R, 5, 0.4)}" fill="${R() < 0.4 ? '#ffd27a' : R() < 0.5 ? '#1a0e08' : '#ff8a3a'}" stroke="${INK}" stroke-width="0.5"/>`).join('')));
  a.raw(a.glow(fx, fy - fk * 0.3, fk * 1.6, '#ff8a3a', 0.55) + a.glow(fx, fy - fk * 0.4, fk * 0.7, '#c8e0ff', 0.45));
  a.raw(fireTongues(fx, fy, fk * 0.62, fk * 1.2));
  a.raw(blue(fireTongues(fx + fk * 0.1, fy, fk * 0.42, fk * 0.6)));
  let st = '';
  for (let i = 0; i < 3; i++) { const sx = fx + (R() - 0.5) * fk * 1.0, [hx, hy] = P(x0 + 0.4 + R() * (x1 - x0 - 0.8), 1.8, z0 + 0.2); st += bolt(sx, fy - fk * 0.2, hx, hy, 6, 8); }
  a.raw(EM(st));
  a.raw(D.embers(fx, fy - fk * 0.3, fk * 0.9, 18));
  addLight(FORGE.fire[0], 1.2, FORGE.fire[2] - 0.35, 1.5, 7.5, [1.0, 0.52, 0.2]);
  addLight(FORGE.fire[0] - 0.3, 1.65, FORGE.fire[2] - 0.6, 0.9, 5.0, [0.6, 0.8, 1.0]);
  addLight(FORGE.x0 + 0.1, 1.1, FORGE.z0 - 0.3, 0.55, 3.0, [1.0, 0.55, 0.24]);   // the hearth mouth's spill out into the room
  // smoke and heat haze crawling out under the hood lip into the vault
  a.raw(smoke([P(x0 + 0.3, 1.8, z0 + 0.15), P(x0 - 0.3, 2.3, z0), P(x0 - 0.9, 2.9, z0 - 0.4), P(x0 - 1.6, 3.3, z0 - 1.0)], fk * 0.35, 0.2));
  // a cask of quench oil at the hearth's end, bar stock stood up in it
  prop(6.3, () => {
    S.barrel(-4.55, 6.3);
    const s = K(6.75);
    for (let k = 0; k < 5; k++) { const X = -4.7 + k * 0.07, top = 1.2 + R() * 0.4; a.raw(`<path d="${pp([[X, 0.7, 6.3], [X + (R() - 0.5) * 0.1, top, 6.3]]).replace(' Z', '')}" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/><path d="${pp([[X, 0.7, 6.3], [X + (R() - 0.5) * 0.1, top, 6.3]]).replace(' Z', '')}" stroke="${k % 2 ? G.iron : '#4a3a32'}" stroke-width="3"/>`); }
  });
}

// ------------------------------------------------------------------ the arcade: soffits, the face with its stones clipped round the openings, voussoirs, pillars
const atA = (s, t) => [s, t, AZ];
const ARCH = [[-HW, -PIL[1] - PR, 0.5], [PIL[0] + PR, PIL[1] - PR, 1.15], [PIL[1] + PR, HW, 0.5]];      // [s0, s1, rise]
{
  // soffits: the underside of each arch, seen from below
  for (const [s0, s1, rise] of ARCH) {
    const n = 16, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2;
    for (let i = 0; i < n; i++) { const th0 = Math.PI * i / n, th1 = Math.PI * (i + 1) / n, A = th => [sm + Math.cos(th) * rw, ASP + Math.sin(th) * rise];
      const [p0, p1] = [A(th0), A(th1)], q = [[p0[0], p0[1], AZ], [p1[0], p1[1], AZ], [p1[0], p1[1], AZ + AD], [p0[0], p0[1], AZ + AD]];
      a.raw(PLW([q[0], q[1], q[3]], `<path d="${pp(q)}" fill="${mix('#3a322a', '#0e0a08', R() * 0.3)}" stroke="${INK}" stroke-width="1.1"/>`)); }
  }
  // the face: everything above the springing, minus the arches
  const top = []; for (let i = 0; i <= 24; i++) { const X = HW - 2 * HW * i / 24; top.push([X, Yv(X) + 0.02, AZ]); }
  // one simple outline: along the springing line and over each arch, then back across the vault curve
  const outer = [];
  for (const [s0, s1, rise] of ARCH) { const n = 18, sm = (s0 + s1) / 2, rw = (s1 - s0) / 2; for (let i = 0; i <= n; i++) { const th = Math.PI * (1 - i / n); outer.push([sm + Math.cos(th) * rw, ASP + Math.sin(th) * rise, AZ]); } }
  outer.push(...top);
  const holes = [];
  const cid = a.id('arc');
  a.raw(`<clipPath id="${cid}"><path d="${pp(outer)}"/></clipPath>`);
  a.raw(`<g clip-path="url(#${cid})">`);
  a.raw(stones(atA, 2 * HW, SPR + CROWN + 0.1, WALL2, { course: 0.36, block: 0.75, streaks: 12 }));
  a.raw(PLW([atA(0, 0), atA(1, 0), atA(0, 1)], bloom(...P(FORGE.fire[0] + 0.5, 3.2, AZ), K(AZ) * 0.6, '#0a0806', 0.4, 0.3)));
  a.raw('</g>');
  { const sid = a.id('arcs'); a.raw(`<g clip-path="url(#${cid})">`); shade([...outer], { depth: 16, mottle: 0.45, grime: 0.5, ink: 0, wash: 0.3, hl: false }); a.raw('</g>'); }
  for (const [s0, s1, rise] of ARCH) a.raw(archRing(atA, s0, s1, ASP, rise, 0.24, WALL2, s1 - s0 > 3 ? 13 : 7));
  // the vault's front rib edge where the arcade meets the vault
  a.raw(`<path d="${smooth(top.map(p => P(...p)), false, 0.5)}" stroke="${INK}" stroke-width="2.4" fill="none"/>`);
}
// squat round pillars: drum courses curving with the eye, a cushion capital, a square plinth, chalk tallies of work owed
for (const X of PIL) prop(AZ, () => {
  const s = K(AZ), Zc = AZ + PR * 0.5;
  const pts = [P(X - PR, 0.18, AZ), P(X + PR, 0.18, AZ), P(X + PR, ASP - 0.25, AZ), P(X - PR, ASP - 0.25, AZ)];
  const ring = y => { const o = []; for (let i = 0; i <= 10; i++) { const th = Math.PI * i / 10, Xx = X + Math.cos(th) * PR, Zz = Zc - Math.sin(th) * PR; o.push(P(Xx, y, Zz)); } return o; };
  const drum = [...ring(0.18), ...ring(ASP - 0.25).reverse()];
  let lines = [];
  for (let y = 0.18 + 0.3; y < ASP - 0.3; y += 0.28 + R() * 0.08) lines.push({ d: smooth(ring(y), false, 0.5), w: 1.4, op: 0.8 });
  for (let i = 0; i < 6; i++) { const y = 0.3 + R() * 1.4, th = 0.3 + R() * 2.4; const p0 = P(X + Math.cos(th) * PR, y, Zc - Math.sin(th) * PR), p1 = P(X + Math.cos(th + 0.25) * PR, y + 0.08, Zc - Math.sin(th + 0.25) * PR); lines.push({ d: `M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}`, w: 0.8, op: 0.7 }); }
  a.shape({ d: smooth(drum, true, 0.2), fill: mix(WALL2, '#8a8070', 0.12), depth: s * 0.2, ink: 2.2, hatch: 80, mottle: 0.5, grime: 0.5, wash: 0.35, lines,
    decals: a.stain(...P(X, 0.4, AZ), s * 0.35, '#0e0a08', 0.5) + a.stain(...P(X + PR * 0.6, 1.4, AZ), s * 0.2, '#0e0a08', 0.4) });
  // the cushion capital and abacus
  const cap = [P(X - PR - 0.05, ASP - 0.25, AZ), P(X + PR + 0.05, ASP - 0.25, AZ), P(X + PR + 0.14, ASP - 0.08, AZ - 0.1), P(X + PR + 0.14, ASP, AZ - 0.1), P(X - PR - 0.14, ASP, AZ - 0.1), P(X - PR - 0.14, ASP - 0.08, AZ - 0.1)];
  a.shape({ d: smooth(cap, true, 0.15), fill: mix(WALL2, '#a89a80', 0.15), depth: 6, ink: 2, hatch: 80, mottle: 0.4, grime: 0.4 });
  a.shape({ d: pp([[X - PR - 0.12, 0, AZ - 0.1], [X + PR + 0.12, 0, AZ - 0.1], [X + PR + 0.12, 0.2, AZ - 0.1], [X - PR - 0.12, 0.2, AZ - 0.1]]), fill: dark(WALL2, 0.1), depth: 5, ink: 1.8, hatch: 80, mottle: 0.4, grime: 0.7 });
  if (DETAIL && X > 0) {     // chalk tallies: work owed, in fives
    let t = ''; const [cx, cy] = P(X - 0.12, 1.25, AZ - 0.02);
    for (let g = 0; g < 3; g++) { for (let i = 0; i < 4; i++) t += `<path d="M${f(cx + g * 14 + i * 3)} ${f(cy)} l0.5 10" stroke="#d8d0c0" stroke-width="1.1" opacity="0.35"/>`; t += `<path d="M${f(cx + g * 14 - 1)} ${f(cy + 8)} l13 -6" stroke="#d8d0c0" stroke-width="1.1" opacity="0.35"/>`; }
    a.raw(t);
  }
});

a.raw(PLW([[0, 0, AZ], [1, 0, AZ], [0, 1, AZ]], bloom(...P(PIL[0], 2.4, AZ - 0.02), K(AZ) * 0.22, '#050403', 0.3, 0.8)));
prop(AZ - 0.1, () => a.raw(S.torch(PIL[0], 1.65, AZ - 0.02, [0.2, 0, -1])));
if (DETAIL) {      // static has scorched the vault over the forge in branching figures, like the scars on Hild's arms
  let sc = '';
  const fern = (x, y, ang, len, d) => { let px = x, py = y, path = `M${f(px)} ${f(py)}`; for (let i = 0; i < 5; i++) { const t = ang + (R() - 0.5) * 0.9; px += Math.cos(t) * len / 5; py += Math.sin(t) * len / 5; path += ` L${f(px)} ${f(py)}`; if (d > 0 && R() < 0.7) fern(px, py, ang + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.5), len * 0.5, d - 1); } sc += `<path d="${path}" stroke="#0a0806" stroke-width="${f(0.5 + d * 0.45)}" fill="none" opacity="0.55" stroke-linecap="round"/>`; };
  for (let i = 0; i < 7; i++) { const [x, y] = P(1.8 + R() * 2.4, Yv(2.9) - 0.05, 6.5 + R() * 1.3); fern(x, y, Math.PI * (R() < 0.5 ? 0.1 : 0.9) + (R() - 0.5) * 0.8, 40 + R() * 40, 3); }
  a.raw(`<g class="pl_${S.PLANES.length ? 0 : 0}">${sc}</g>`.replace('class="pl_0"', ''));
}
// ------------------------------------------------------------------ the front bay, behind the keeper: the hanging lantern
// a pierced iron lantern hung from the vault on a chain over the anvil
{
  const [lx, ly] = P(-1.55, 2.35, 5.0), s = K(5.0) * 0.14;
  prop(5.0, () => {
    const [tx, ty] = P(-1.55, Yv(-1.55), 5.0);
    a.raw(`<path d="M${f(tx)} ${f(ty)} L${f(lx)} ${f(ly - s * 1.6)}" stroke="${INK}" stroke-width="3" stroke-dasharray="4 2"/>` + lantern(lx, ly, s, [-1.55, 2.3, 4.95, 0.95, 4.5]));
  });
}
const bgEnd = true;

// ================================================================== FOREGROUND (in front of the keeper)
a.layer('fg');
// the anvil on its elm stump: the panel object. A billet cooling on the face, a hammer laid across the heel.
{
  const { X: AX, Z: AZn } = ANVIL, base = 0.52;
  const prof = [[-0.32, 0], [0.36, 0], [0.32, 0.06], [0.17, 0.1], [0.15, 0.22], [0.22, 0.27], [0.45, 0.28], [0.46, 0.38], [-0.18, 0.38], [-0.27, 0.375], [-0.52, 0.34], [-0.66, 0.31], [-0.5, 0.29], [-0.24, 0.25], [-0.15, 0.2], [-0.13, 0.11], [-0.25, 0.07]];
  const at = (u, v, dz = 0) => [AX + u, base + v, AZn + dz];
  prop(AZn, () => {
    const s = K(AZn);
    // the stump: a squat elm round, iron-banded, split, scorched
    const sc = P(AX - 0.02, 0, AZn + 0.15), sr = s * 0.34, sh = s * base;
    a.shape({ d: `M${f(sc[0] - sr)} ${f(sc[1])} Q${f(sc[0])} ${f(sc[1] + s * 0.06)} ${f(sc[0] + sr)} ${f(sc[1])} L${f(sc[0] + sr * 0.96)} ${f(sc[1] - sh)} Q${f(sc[0])} ${f(sc[1] - sh + s * 0.05)} ${f(sc[0] - sr * 0.96)} ${f(sc[1] - sh)} Z`, fill: '#4e3c2c', tex: 'url(#grain)', texOp: 0.4, depth: sr * 0.5, ink: 2, hatch: 90, mottle: 0.5, grime: 0.6,
      lines: [0.25, 0.8].map(k => ({ d: `M${f(sc[0] - sr)} ${f(sc[1] - sh * k)} Q${f(sc[0])} ${f(sc[1] - sh * k + s * 0.06)} ${f(sc[0] + sr)} ${f(sc[1] - sh * k)}`, w: s * 0.025, col: '#2a2826' })).concat([{ d: `M${f(sc[0] + sr * 0.3)} ${f(sc[1] - sh)} l-4 ${f(sh * 0.5)} l3 ${f(sh * 0.2)}`, w: 1.4 }]),
      decals: a.stain(sc[0], sc[1] - sh * 0.9, sr * 0.8, '#0a0604', 0.5) });
    // the top of the stump round the anvil's feet
    a.raw(`<ellipse cx="${f(sc[0])}" cy="${f(sc[1] - sh)}" rx="${f(sr * 0.96)}" ry="${f(s * 0.07)}" fill="#3a2c20" stroke="${INK}" stroke-width="1.6"/>`);
    // the anvil's top face (seen from above), then the side
    const topQ = [at(-0.18, 0.38), at(0.46, 0.38), at(0.46, 0.38, 0.24), at(-0.18, 0.38, 0.24)];
    a.shape({ d: pp(topQ), fill: '#5a5856', depth: 3, ink: 1.6, hatch: 0, hl: false, spec: [`M${pp([at(-0.1, 0.38, 0.06), at(0.4, 0.38, 0.06)]).slice(1, -2)}`], specOp: 0.5 });
    a.raw(`<path d="${pp([at(-0.18, 0.38), at(-0.18, 0.38, 0.24), at(-0.62, 0.32, 0.12)])}" fill="#4a4846" stroke="${INK}" stroke-width="1.4"/>`);
    a.shape({ d: smooth(prof.map(([u, v]) => P(...at(u, v))), true, 0.12), fill: '#3c3a3a', depth: s * 0.1, ink: 2.4, hatch: 30, mottle: 0.4, grime: 0.3, wash: 0.4,
      spec: [`M${pp([at(-0.55, 0.335), at(-0.2, 0.37), at(0.44, 0.375)]).slice(1, -2)}`], specW: 1.6, specOp: 0.55,
      decals: a.stain(...P(...at(0.0, 0.12)), s * 0.12, G.rust, 0.35) + `<circle cx="${f(P(...at(0.36, 0.33))[0])}" cy="${f(P(...at(0.36, 0.33))[1])}" r="${f(s * 0.018)}" fill="#0a0808"/>` });
    // the billet: a bar of steel still glowing dull orange, scale lifting off it
    const b0 = P(...at(-0.08, 0.4, 0.1)), b1 = P(...at(0.3, 0.4, 0.14));
    a.raw(a.glow((b0[0] + b1[0]) / 2, b0[1], s * 0.35, '#ff7a2a', 0.5));
    a.raw(EM(`<path d="M${f(b0[0])} ${f(b0[1])} L${f(b1[0])} ${f(b1[1])}" stroke="${INK}" stroke-width="${f(s * 0.045 + 2)}" stroke-linecap="round"/><path d="M${f(b0[0])} ${f(b0[1])} L${f(b1[0])} ${f(b1[1])}" stroke="#e8602a" stroke-width="${f(s * 0.045)}" stroke-linecap="round"/><path d="M${f(b0[0] + 4)} ${f(b0[1] - 1)} L${f(b1[0] - 6)} ${f(b1[1] - 1)}" stroke="#ffc070" stroke-width="${f(s * 0.015)}" stroke-linecap="round"/>`));
    addLight(AX + 0.1, base + 0.55, AZn - 0.1, 0.95, 3.2, [1.0, 0.5, 0.2]);
    // a hand hammer laid across the heel, haft toward us
    const h0 = P(...at(0.32, 0.4, 0.02)), h1 = P(...at(0.1, 0.4, -0.3));
    a.raw(`<path d="M${f(h0[0])} ${f(h0[1])} L${f(h1[0])} ${f(h1[1])}" stroke="${INK}" stroke-width="${f(s * 0.035 + 2)}" stroke-linecap="round"/><path d="M${f(h0[0])} ${f(h0[1])} L${f(h1[0])} ${f(h1[1])}" stroke="${G.wood}" stroke-width="${f(s * 0.035)}" stroke-linecap="round"/><rect x="${f(h0[0] - s * 0.05)}" y="${f(h0[1] - s * 0.06)}" width="${f(s * 0.1)}" height="${f(s * 0.06)}" fill="${IRON}" stroke="${INK}" stroke-width="1.6"/>`);
  });
  const sil = prof.map(([u, v]) => P(...at(u, v)));
  const st = [P(AX - 0.36, 0, AZn + 0.15), P(AX + 0.32, 0, AZn + 0.15)];
  hot('anvil', 'The anvil', [st[0], ...sil.filter((_, i) => i > 3 && i < 14), st[1]].map(q => q));
  HOT.anvil.poly = [P(AX - 0.38, 0, AZn + 0.15), P(AX + 0.34, 0, AZn + 0.15), P(AX + 0.48, base + 0.4, AZn), P(AX - 0.68, base + 0.4, AZn)].map(q => q.map(f));
  // outline: the anvil's profile and the stump, as world polylines on the anvil's front plane
  const stump = []; for (let i = 0; i <= 8; i++) { const th = Math.PI * i / 8; stump.push([AX - 0.02 + Math.cos(th) * 0.34, 0, AZn + 0.15 - Math.sin(th) * 0.34 * 0.4]); }
  {
    const dz = -0.12, up = ([u, v]) => [u, v > 0.36 ? v + 0.05 : v];
    const ring = [[AX - 0.36, 0, AZn + dz], [AX - 0.34, base, AZn + dz], at(-0.25, 0.07, dz), ...[...prof.slice(5, 16)].reverse().map(q => { const [u, v] = up(q); return at(u, v, dz); }).reverse(), at(0.36, 0, dz)];
    const loop = [[AX - 0.36, 0, AZn + dz], [AX - 0.34, base, AZn + dz], ...prof.slice(13, 17).reverse().map(([u, v]) => at(u, v, dz)), ...prof.slice(5, 13).reverse().map(q => { const [u, v] = up(q); return at(u, v, dz); }), ...prof.slice(2, 5).reverse().map(([u, v]) => at(u, v, dz)), [AX + 0.32, base, AZn + dz], [AX + 0.33, 0, AZn + dz]];
    outline('anvil', [[loop, true]]);
  }
}
// the quench trough: a stone trough of black water, steam lifting where the last piece went in
prop(4.6, () => {
  const x0 = -3.75, x1 = -2.25, z0 = 4.6, z1 = 5.25, ht = 0.62;
  const atT = (s, t) => [x0 + s, t, z0];
  a.raw(stones(atT, x1 - x0, ht, '#5a5246', { course: 0.31, block: 0.52 }));
  shade([atT(0, 0), atT(x1 - x0, 0), atT(x1 - x0, ht), atT(0, ht)], { depth: 12, mottle: 0.5, grime: 0.6, ink: 2, wash: 0.35 });
  const rim = [[x0, ht, z0], [x1, ht, z0], [x1, ht, z1], [x0, ht, z1]];
  a.raw(`<path d="${pp(rim)}" fill="#6a6254" stroke="${INK}" stroke-width="2"/>`);
  const wat = [[x0 + 0.1, ht - 0.03, z0 + 0.1], [x1 - 0.1, ht - 0.03, z0 + 0.1], [x1 - 0.1, ht - 0.03, z1 - 0.1], [x0 + 0.1, ht - 0.03, z1 - 0.1]];
  a.raw(`<path d="${pp(wat)}" fill="#141a1e" stroke="${INK}" stroke-width="1.4"/>` + `<path d="${pp([[x0 + 0.3, ht - 0.03, z0 + 0.3], [x1 - 0.5, ht - 0.03, z0 + 0.32]]).replace(' Z', '')}" stroke="#6a7a88" stroke-width="1.2" opacity="0.5"/>`);
  // a pair of tongs left in the water, a ladle on the rim
  const t0 = P(x0 + 0.5, ht + 0.4, z0 + 0.3), t1 = P(x0 + 0.75, ht - 0.02, z0 + 0.35);
  a.raw(`<path d="M${f(t0[0])} ${f(t0[1])} L${f(t1[0])} ${f(t1[1])} M${f(t0[0] + 6)} ${f(t0[1])} L${f(t1[0] + 5)} ${f(t1[1])}" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/><path d="M${f(t0[0])} ${f(t0[1])} L${f(t1[0])} ${f(t1[1])} M${f(t0[0] + 6)} ${f(t0[1])} L${f(t1[0] + 5)} ${f(t1[1])}" stroke="${G.iron}" stroke-width="2.2"/>`);
  if (DETAIL) a.raw(`<g opacity="0.6">${smoke([P(x0 + 0.7, ht, z0 + 0.4), P(x0 + 0.6, ht + 0.25, z0 + 0.4), P(x0 + 0.8, ht + 0.5, z0 + 0.4)], K(z0) * 0.1, 0.18, '#8a8a88')}</g>`);
});
// a chain and hook for lifting hung from a ring in the vault
prop(3.8, () => {
  const [tx, ty] = P(-0.95, Yv(-0.95), 3.8), [bx, by] = P(-0.95, 1.95, 3.8), s = K(3.8);
  let o = '';
  for (let y = ty; y < by; y += s * 0.055) { const odd = Math.round((y - ty) / (s * 0.055)) % 2; o += odd ? `<rect x="${f(bx - s * 0.008)}" y="${f(y)}" width="${f(s * 0.016)}" height="${f(s * 0.06)}" rx="2" fill="${G.iron}" stroke="${INK}" stroke-width="1.4"/>` : `<ellipse cx="${f(bx)}" cy="${f(y + s * 0.03)}" rx="${f(s * 0.018)}" ry="${f(s * 0.032)}" fill="none" stroke="${INK}" stroke-width="${f(s * 0.012 + 1.5)}"/><ellipse cx="${f(bx)}" cy="${f(y + s * 0.03)}" rx="${f(s * 0.018)}" ry="${f(s * 0.032)}" fill="none" stroke="${G.iron}" stroke-width="${f(s * 0.008)}"/>`; }
  o += `<path d="M${f(bx)} ${f(by)} q${f(s * 0.02)} ${f(s * 0.08)} ${f(-s * 0.02)} ${f(s * 0.14)} q${f(-s * 0.06)} ${f(s * 0.04)} ${f(-s * 0.08)} ${f(-s * 0.04)}" stroke="${INK}" stroke-width="${f(s * 0.03 + 2)}" fill="none" stroke-linecap="round"/><path d="M${f(bx)} ${f(by)} q${f(s * 0.02)} ${f(s * 0.08)} ${f(-s * 0.02)} ${f(s * 0.14)} q${f(-s * 0.06)} ${f(s * 0.04)} ${f(-s * 0.08)} ${f(-s * 0.04)}" stroke="${G.iron}" stroke-width="${f(s * 0.03)}" fill="none" stroke-linecap="round"/>`;
  a.raw(o);
});

if (DETAIL) {
  prop(4.15, () => {        // a dented breastplate on the floor before the anvil, waiting its turn
    const s = K(4.15), [x, y] = P(-1.05, 0.02, 4.15);
    a.shape({ d: smooth([[x - s * 0.22, y], [x - s * 0.26, y - s * 0.1], [x - s * 0.12, y - s * 0.2], [x + s * 0.1, y - s * 0.21], [x + s * 0.25, y - s * 0.12], [x + s * 0.22, y]], true, 0.4), fill: G.steelD, depth: 8, ink: 2, hatch: 20, mottle: 0.4,
      spec: [`M${f(x - s * 0.12)} ${f(y - s * 0.16)} Q${f(x)} ${f(y - s * 0.2)} ${f(x + s * 0.12)} ${f(y - s * 0.15)}`], specOp: 0.5,
      lines: [{ d: `M${f(x - s * 0.02)} ${f(y - s * 0.2)} L${f(x)} ${f(y)}`, w: 1.2 }, { d: `M${f(x + s * 0.06)} ${f(y - s * 0.12)} q6 4 3 10`, w: 1.4 }], decals: a.stain(x + s * 0.1, y - s * 0.06, s * 0.05, G.rust, 0.6) + a.stain(x - s * 0.1, y - s * 0.08, s * 0.04, G.blood, 0.5) });
  });
  prop(4.05, () => {        // a leather bucket of slack water and a three-legged stool
    const s = K(4.05), [x, y] = P(1.95, 0, 4.05), w = s * 0.14, h = s * 0.3;
    a.shape({ d: `M${f(x - w)} ${f(y - h)} L${f(x + w)} ${f(y - h)} L${f(x + w * 0.85)} ${f(y)} L${f(x - w * 0.85)} ${f(y)} Z`, fill: G.leatherD, depth: 6, ink: 2, hatch: 90, mottle: 0.5, grime: 0.5,
      lines: [{ d: `M${f(x - w * 0.95)} ${f(y - h * 0.8)} L${f(x + w * 0.95)} ${f(y - h * 0.8)}`, w: 2, col: '#2a2826' }] });
    a.raw(`<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w)}" ry="${f(s * 0.03)}" fill="#141a1e" stroke="${INK}" stroke-width="1.8"/><path d="M${f(x - w)} ${f(y - h)} Q${f(x)} ${f(y - h - s * 0.2)} ${f(x + w)} ${f(y - h)}" stroke="${INK}" stroke-width="2.6" fill="none"/>`);
    const [sx, sy] = P(-0.75, 0, 3.95), st = s * 0.45, sw = s * 0.2;
    for (const k of [-1, 0.2, 1]) a.raw(`<path d="M${f(sx + k * sw * 0.5)} ${f(sy - st)} L${f(sx + k * sw)} ${f(sy)}" stroke="${INK}" stroke-width="${f(s * 0.03 + 2)}" stroke-linecap="round"/><path d="M${f(sx + k * sw * 0.5)} ${f(sy - st)} L${f(sx + k * sw)} ${f(sy)}" stroke="${WOOD}" stroke-width="${f(s * 0.03)}" stroke-linecap="round"/>`);
    a.shape({ d: `M${f(sx - sw * 0.7)} ${f(sy - st)} Q${f(sx)} ${f(sy - st + s * 0.04)} ${f(sx + sw * 0.7)} ${f(sy - st)} Q${f(sx)} ${f(sy - st - s * 0.05)} ${f(sx - sw * 0.7)} ${f(sy - st)} Z`, fill: mix(WOOD, '#8a7a60', 0.2), depth: 4, ink: 1.8, tex: 'url(#grain)', texOp: 0.5 });
  });
}
// near left: a cut-down cask full of scrap and broken blades waiting for the fire
prop(2.9, () => {
  const X = -1.75, Z = 2.9, s = K(Z), [x, y] = P(X, 0, Z), w = s * 0.32, h = s * 0.56;
  // the back rim inside the cask, then the scrap: broken swords with guards, a bent blade, a spearhead, bar stock; then the cask over them
  a.raw(`<ellipse cx="${f(x)}" cy="${f(y - h)}" rx="${f(w)}" ry="${f(s * 0.06)}" fill="#120c08" stroke="${INK}" stroke-width="2"/>`);
  for (let i = 0; i < 10; i++) {
    const bx = x - w * 0.7 + R() * w * 1.4, ang = (R() - 0.5) * 0.8, l = s * (0.3 + R() * 0.45), tx = bx + Math.sin(ang) * l, ty = y - h - Math.cos(ang) * l * 0.9, bw = s * (0.018 + R() * 0.02), kind = R();
    const gid = a.id('bl'), steel = mix(G.steelD, '#2a2622', R() * 0.5);
    let o = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark(steel, 0.4)}"/><stop offset="0.45" stop-color="${light(steel, 0.35)}"/><stop offset="0.55" stop-color="${steel}"/><stop offset="1" stop-color="${dark(steel, 0.5)}"/></linearGradient>`;
    if (kind < 0.18) { o += `<path d="M${f(bx)} ${f(y - h + 6)} L${f(tx)} ${f(ty)}" stroke="${INK}" stroke-width="${f(bw * 2.2 + 2)}" stroke-linecap="square"/><path d="M${f(bx)} ${f(y - h + 6)} L${f(tx)} ${f(ty)}" stroke="#3a3430" stroke-width="${f(bw * 2.2)}" stroke-linecap="square"/>` + a.stain(tx, ty + 6, bw * 2, '#5a2a14', 0.6); }
    else {
      const notch = R() < 0.5;
      o += `<path d="M${f(bx - bw)} ${f(y - h + 6)} L${f(tx - bw * 0.6)} ${f(ty + bw)} L${f(tx + (R() - 0.5) * bw * 3)} ${f(ty - bw * (R() < 0.5 ? 0 : 2))} L${f(tx + bw * 0.6)} ${f(ty + bw)} ${notch ? `L${f((bx + tx) / 2 + bw * 0.9)} ${f((y - h + ty) / 2)} L${f((bx + tx) / 2 + bw * 0.2)} ${f((y - h + ty) / 2 + bw * 1.5)} L${f((bx + tx) / 2 + bw * 0.9)} ${f((y - h + ty) / 2 + bw * 3)}` : ''} L${f(bx + bw)} ${f(y - h + 6)} Z" fill="url(#${gid})" stroke="${INK}" stroke-width="1.6"/>`;
      o += `<path d="M${f(bx)} ${f(y - h + 4)} L${f(bx + (tx - bx) * 0.7)} ${f(y - h + (ty - y + h) * 0.7)}" stroke="${dark(steel, 0.5)}" stroke-width="0.9" opacity="0.8"/><path d="M${f(bx - bw * 0.8)} ${f(y - h + 4)} L${f(tx - bw * 0.5)} ${f(ty + bw * 1.5)}" stroke="#d8dcdc" stroke-width="0.8" opacity="0.45"/>`;
      if (R() < 0.6) o += I_rust(bx + (tx - bx) * (0.3 + R() * 0.5), y - h + (ty - y + h) * (0.3 + R() * 0.5), bw * 1.6);
      if (kind > 0.7) { const gx = bx + (tx - bx) * 0.08, gy = y - h + (ty - y + h) * 0.08 - 2; o += `<path d="M${f(gx - s * 0.06)} ${f(gy)} L${f(gx + s * 0.06)} ${f(gy - s * 0.008)}" stroke="${INK}" stroke-width="${f(s * 0.022 + 2)}" stroke-linecap="round"/><path d="M${f(gx - s * 0.06)} ${f(gy)} L${f(gx + s * 0.06)} ${f(gy - s * 0.008)}" stroke="#5a5650" stroke-width="${f(s * 0.022)}" stroke-linecap="round"/>`; }
    }
    a.raw(o);
  }
  barrel(X, Z, 0, { w: 0.32, h: 0.56, open: true });
});
function I_rust(x, y, r) { let o = ''; for (let k = 0; k < 4; k++) o += `<ellipse cx="${f(x + (R() - 0.5) * r * 2)}" cy="${f(y + (R() - 0.5) * r * 2)}" rx="${f(r * (0.2 + R() * 0.3))}" ry="${f(r * (0.15 + R() * 0.25))}" fill="${['#3a1a0c', '#5a2a14', '#4a2410'][k % 3]}" opacity="0.5"/>`; return o; }
// near right: the coal heap spilling from a split sack, a shovel driven into it
prop(3.0, () => {
  const Z = 3.0, s = K(Z), pts = [];
  for (let i = 0; i <= 14; i++) { const X = 1.05 + 1.6 * i / 14; pts.push(P(X, Math.sin(i / 14 * Math.PI) * 0.32 * (0.8 + R() * 0.3), Z + 0.1)); }
  a.shape({ d: smooth([P(1.0, 0, Z), ...pts, P(2.7, 0, Z)], true, 0.3), fill: '#1c1a1a', depth: 10, ink: 2, hatch: 30, mottle: 0.4,
    decals: Array.from({ length: 50 }, () => { const [x, y] = P(1.2 + R() * 1.3, R() * 0.25, Z); return `<path d="${blob(x, y, 3 + R() * 6, R, 5, 0.4)}" fill="${R() < 0.06 ? "#4a6890" : R() < 0.5 ? '#2e2c2c' : '#121010'}" stroke="${INK}" stroke-width="0.8"/>`; }).join('') });
  const [sx, sy] = P(1.75, 0.25, Z), [ex, ey] = P(1.5, 1.15, Z - 0.1);
  a.raw(`<path d="M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}" stroke="${INK}" stroke-width="${f(s * 0.035 + 3)}" stroke-linecap="round"/><path d="M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}" stroke="${G.wood}" stroke-width="${f(s * 0.035)}" stroke-linecap="round"/>` +
    `<path d="M${f(ex - s * 0.07)} ${f(ey)} L${f(ex + s * 0.07)} ${f(ey + 4)}" stroke="${INK}" stroke-width="${f(s * 0.03 + 2)}" stroke-linecap="round"/>` +
    `<path d="M${f(sx - s * 0.12)} ${f(sy - 4)} L${f(sx + s * 0.12)} ${f(sy - 2)} L${f(sx + s * 0.1)} ${f(sy + s * 0.12)} L${f(sx - s * 0.1)} ${f(sy + s * 0.11)} Z" fill="${IRON}" stroke="${INK}" stroke-width="2"/>`);
});

if (DETAIL) {
  prop(3.05, () => {
    let g = '';
    for (let i = 0; i < 6; i++) { const [x, y] = P(1.2 + R() * 1.4, 0.05 + R() * 0.2, 3.0); g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.2 + R() * 1.6)}" fill="${R() < 0.5 ? '#a8d0ff' : '#e8f6ff'}"/>`; }
    a.raw(EM(g));
    const pts = []; for (let i = 0; i <= 14; i++) { const X = 1.05 + 1.6 * i / 14; pts.push(P(X, Math.sin(i / 14 * Math.PI) * 0.3, 3.1)); }
    a.raw(`<path d="${smooth(pts, false, 0.4)}" stroke="#6a6a72" stroke-width="2" fill="none" opacity="0.55"/>`);
  });
  addLight(2.5, 0.3, 2.9, 0.12, 1.4, [0.6, 0.8, 1.0]);
  prop(3.6, () => {
    let o = '';
    for (let i = 0; i < 40; i++) { const X = -1.4 + R() * 4.2, Z = 2.7 + R() * 1.6, [x, y] = P(X, 0, Z), r = K(Z) * (0.008 + R() * 0.018), k = R();
      o += k < 0.6 ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 1.6)}" ry="${f(r * 0.6)}" fill="${R() < 0.5 ? '#2a2420' : '#3a2a20'}" stroke="${INK}" stroke-width="0.6"/>` : `<path d="M${f(x)} ${f(y)} l${f(r * 4)} ${f(-r * 0.6)}" stroke="${INK}" stroke-width="${f(r * 1.2 + 1.2)}" stroke-linecap="round"/><path d="M${f(x)} ${f(y)} l${f(r * 4)} ${f(-r * 0.6)}" stroke="${G.iron}" stroke-width="${f(r * 1.2)}" stroke-linecap="round"/>`; }
    a.raw(o);
  });
  prop(2.7, () => {
    const s = K(2.7), [bx, by] = P(-2.05, 1.85, 2.7);
    let o = '';
    for (let y = -10; y < by; y += s * 0.06) { const odd = Math.round((y + 10) / (s * 0.06)) % 2; o += odd ? `<rect x="${f(bx - s * 0.008)}" y="${f(y)}" width="${f(s * 0.016)}" height="${f(s * 0.065)}" rx="2" fill="#2a2826" stroke="${INK}" stroke-width="1.6"/>` : `<ellipse cx="${f(bx)}" cy="${f(y + s * 0.03)}" rx="${f(s * 0.02)}" ry="${f(s * 0.034)}" fill="none" stroke="${INK}" stroke-width="${f(s * 0.014 + 1.5)}"/>`; }
    o += `<path d="M${f(bx)} ${f(by)} q${f(s * 0.03)} ${f(s * 0.1)} ${f(-s * 0.03)} ${f(s * 0.16)} q${f(-s * 0.07)} ${f(s * 0.04)} ${f(-s * 0.09)} ${f(-s * 0.05)}" stroke="${INK}" stroke-width="${f(s * 0.035 + 2)}" fill="none" stroke-linecap="round"/>`;
    a.raw(o);
  });
  // cobwebs in the corners where the arches spring
  let cw = '';
  for (const X of [-HW + 0.05, PIL[0] + PR + 0.02, PIL[1] - PR - 0.02, HW - 0.05]) { const [x, y] = P(X, ASP + 0.05, AZ - 0.01), sgn = X < 0 ? 1 : -1, s = K(AZ) * 0.35;
    for (let k = 0; k < 5; k++) cw += `<path d="M${f(x)} ${f(y - s * 0.1)} Q${f(x + sgn * s * 0.5)} ${f(y - s * (0.2 + k * 0.15))} ${f(x + sgn * s * (0.2 + k * 0.17))} ${f(y - s * 0.9)}" stroke="#a8a49a" stroke-width="0.7" fill="none" opacity="0.4"/>`;
    for (let k = 1; k < 4; k++) cw += `<path d="M${f(x + sgn * s * 0.1 * k)} ${f(y - s * 0.25 * k)} Q${f(x + sgn * s * 0.2 * k)} ${f(y - s * 0.15 * k)} ${f(x + sgn * s * 0.28 * k)} ${f(y - s * 0.3 * k)}" stroke="#a8a49a" stroke-width="0.6" fill="none" opacity="0.35"/>`; }
  a.raw(cw);
}
// ------------------------------------------------------------------ the keeper: where Mother Hild stands, and her click area (filled in by the lit render)
const KP = { feet: P(KEEPER.X, 0, KEEPER.Z).map(f), height_px: f(K(KEEPER.Z) * KEEPER.h), z: KEEPER.Z, sprite: 'hild', flip: false, figure: [170, 830] };
HOT.keeper = { label: 'Mother Hild', poly: [] };

// ------------------------------------------------------------------ write
a.layer('fx');
a.raw(`<g class="glow"><rect width="${W}" height="${H}" fill="url(#grimeF)" opacity="0.12"/></g>`);
const full = a.svg();
fs.writeFileSync('grim/hub/int/smithy.svg', full);
for (const l of ['bg', 'fg', 'fx']) fs.writeFileSync(`grim/hub/int/smithy__${l}.svg`, a.svgLayer(l));
fs.writeFileSync('grim/hub/int/smithy.light.json', JSON.stringify({ w: W, h: H, camera: { horizon: HZ, eye_m: E, focal_px: FL, cx: CX }, planes: PLANES, lights: LIGHTS }));
fs.writeFileSync('grim/hub/int/smithy_hotspots.json', JSON.stringify({ w: W, h: H, room: 'smithy', camera: { horizon: HZ, eye_m: E, focal_px: FL, cx: CX }, hotspots: HOT, keeper: KP, panel: 'anvil', draw_order: ['bg', 'keeper', 'fg'] }, null, 1));
console.log('smithy', PLANES.length, 'planes', LIGHTS.length, 'lights');
