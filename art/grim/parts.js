// Shared grim motifs for the bestiary: barnacles, weed, teeth, eyes, ribs, suckered tentacles, hooks.
const { G, INK, smooth, limb, blob } = require('../gr');
const f = n => +n.toFixed(1);
module.exports = (a) => {
  const R = a.R;
  const P = {};
  P.ragged = (x0, x1, y, n, amp, jit = 6) => { const o = []; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([x + (R() - 0.5) * 5, y + (i % 2 ? amp * (0.5 + R() * 0.9) : R() * jit)]); } return o; };
  P.barnacles = (x, y, n, spread) => {
    let o = '';
    for (let i = 0; i < n; i++) {
      const bx = x + (R() - 0.5) * spread * 2, by = y + (R() - 0.5) * spread * 1.4, r = 2.2 + R() * 3.2;
      o += `<path d="M${f(bx - r)} ${f(by + r * 0.6)} L${f(bx - r * 0.5)} ${f(by - r * 0.8)} L${f(bx + r * 0.5)} ${f(by - r * 0.8)} L${f(bx + r)} ${f(by + r * 0.6)} Z" fill="${G.bone}" stroke="${INK}" stroke-width="0.7"/><ellipse cx="${f(bx)}" cy="${f(by - r * 0.7)}" rx="${f(r * 0.45)}" ry="${f(r * 0.22)}" fill="${G.black}"/><path d="M${f(bx - r * 0.3)} ${f(by + r * 0.5)} L${f(bx - r * 0.2)} ${f(by - r * 0.6)}" stroke="${INK}" stroke-width="0.4"/>`;
    }
    return o;
  };
  P.weed = (x, y, len, sway = 1, col = G.algae) => {
    let d = `M${x} ${y}`, cx = x, cy = y;
    for (let i = 1; i <= 6; i++) { const nx = x + Math.sin(i * 1.3 + R()) * 5 * sway, ny = y + len * i / 6; d += ` Q${f(cx + 6 * sway)} ${f((cy + ny) / 2)} ${f(nx)} ${f(ny)}`; cx = nx; cy = ny; }
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="1.9" stroke-linecap="round"/>`;
  };
  P.teeth = (x1, y1, x2, y2, n, len, down = 1, col = G.bone) => {
    let o = '';
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, w = Math.abs(x2 - x1) / n * 0.45, l = len * (0.6 + R() * 0.6);
      o += `<path d="M${f(x - w)} ${f(y)} L${f(x + (R() - 0.5) * 1.5)} ${f(y + l * down)} L${f(x + w)} ${f(y)} Z" fill="${col}" stroke="${INK}" stroke-width="0.6"/>`;
    }
    return o;
  };
  P.eye = (x, y, r, iris = '#c9b25a', milky = false) =>
    `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.8)}" fill="${milky ? '#d8dcd0' : '#e6dcc0'}" stroke="${INK}" stroke-width="0.9"/>` +
    (milky ? `<circle cx="${x}" cy="${y}" r="${f(r * 0.45)}" fill="#b8c4c0"/>` : `<circle cx="${f(x + r * 0.15)}" cy="${y}" r="${f(r * 0.5)}" fill="${iris}"/><circle cx="${f(x + r * 0.15)}" cy="${y}" r="${f(r * 0.22)}" fill="${G.black}"/>`) +
    `<circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.15)}" fill="#fff"/><path d="M${f(x - r)} ${y} C${f(x - r * 0.4)} ${f(y - r * 0.3)} ${f(x + r * 0.2)} ${f(y - r * 0.35)} ${f(x + r)} ${f(y - 0.1)}" stroke="${G.bloodL}" stroke-width="0.4" fill="none"/>`;
  P.socket = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.85)}" fill="${G.black}" stroke="${INK}" stroke-width="0.8"/><ellipse cx="${f(x + r * 0.2)}" cy="${f(y + r * 0.2)}" rx="${f(r * 0.4)}" ry="${f(r * 0.3)}" fill="#3a1a14"/>`;
  P.ribs = (cx, cy, w, h, n) => {
    let o = `<path d="${blob(cx, cy, Math.min(w, h) * 0.5, R, 10, 0.15)}" transform="translate(0 0)" fill="${G.black}" opacity="0.85"/>`;
    for (let i = 0; i < n; i++) {
      const y = cy - h / 2 + h * (i + 0.5) / n;
      const d = `M${f(cx - w / 2)} ${f(y - 4)} C${f(cx - w / 4)} ${f(y + 6)} ${f(cx + w / 4)} ${f(y + 6)} ${f(cx + w / 2)} ${f(y - 4)}`;
      o += `<path d="${d}" stroke="${INK}" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${G.bone}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    o += `<path d="M${cx} ${f(cy - h / 2 - 4)} L${cx} ${f(cy + h / 2 + 2)}" stroke="${INK}" stroke-width="5"/><path d="M${cx} ${f(cy - h / 2 - 4)} L${cx} ${f(cy + h / 2 + 2)}" stroke="${G.boneD}" stroke-width="3"/>`;
    return o;
  };
  // tentacle: suckers along one side
  P.tentacle = (spine, w0, w1, col = G.bruise, p = {}) => {
    const n = spine.length, widths = spine.map((_, i) => w0 + (w1 - w0) * i / (n - 1));
    let suck = '';
    for (let i = 1; i < n - 1; i++) {
      const a0 = spine[i - 1], a1 = spine[i + 1], tx = a1[0] - a0[0], ty = a1[1] - a0[1], l = Math.hypot(tx, ty), nx = -ty / l, ny = tx / l, w = widths[i] / 2 * 0.7;
      const x = spine[i][0] + nx * w, y = spine[i][1] + ny * w, r = widths[i] * 0.16;
      suck += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.75)}" fill="#d8b8a8" stroke="${INK}" stroke-width="0.6"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.35)}" fill="${G.bloodD}"/>`;
    }
    return a.limb(spine, widths, Object.assign({ fill: col, depth: Math.max(4, w0 * 0.3), mottle: 0.7, fine: true, hatch: 60, after: suck }, p));
  };
  P.hook = (x, y, s = 1) => `<path d="M${x} ${y} L${x} ${f(y + 22 * s)} C${x} ${f(y + 34 * s)} ${f(x + 14 * s)} ${f(y + 34 * s)} ${f(x + 14 * s)} ${f(y + 24 * s)} L${f(x + 10 * s)} ${f(y + 28 * s)}" fill="none" stroke="${INK}" stroke-width="${f(4 * s)}" stroke-linecap="round"/><path d="M${x} ${y} L${x} ${f(y + 22 * s)} C${x} ${f(y + 34 * s)} ${f(x + 14 * s)} ${f(y + 34 * s)} ${f(x + 14 * s)} ${f(y + 24 * s)}" fill="none" stroke="${G.rustL}" stroke-width="${f(2 * s)}" stroke-linecap="round"/>`;
  P.flies = (x, y, n, spread) => Array.from({ length: n }, () => { const fx = x + (R() - 0.5) * spread, fy = y + (R() - 0.5) * spread * 0.6; return `<circle cx="${f(fx)}" cy="${f(fy)}" r="1.1" fill="${G.black}"/><path d="M${f(fx - 2)} ${f(fy - 1.5)} L${f(fx)} ${fy} L${f(fx + 2)} ${f(fy - 1.5)}" stroke="${INK}" stroke-width="0.4" fill="none"/>`; }).join('');
  P.drool = (x, y, len, col = '#b8c8b0') => `<path d="M${x - 1.5} ${y} C${x - 2} ${y + len * 0.6} ${x - 1} ${y + len} ${x} ${y + len + 2} C${x + 1} ${y + len} ${x + 2} ${y + len * 0.6} ${x + 1.5} ${y} Z" fill="${col}" stroke="${INK}" stroke-width="0.4" opacity="0.85"/>`;
  return P;
};
