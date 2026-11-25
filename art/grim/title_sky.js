// The sky above the abbey for the title screen: 1600x1400, its bottom edge meets the top of the cloister garth.
// Dusk in the Grey: a colourless sky, heaped ink-edged cumulus with real volume (each billow shaded away from the
// drowned sun and rim-lit toward it), stratus wisps, faint rays, crows, fog banks low down, and the forge smoke
// rising out of the smithy stack that pokes up from the garth.
// Usage: node grim/title_sky.js -> grim/hub/title_sky.svg
const { Art, INK } = require('../gr');
const { mix } = require('./kit');
const fs = require('fs');
const f = n => +(+n).toFixed(1);
const W = 1600, H = 1400;
const SUN = [1120, 760];
const a = new Art(W, H, 1400).useGrain(), R = a.R;
const rr = (lo, hi) => lo + R() * (hi - lo);
let gid = 0;
const defs = [];
a.raw(`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0c0f"/><stop offset="0.3" stop-color="#1c1d23"/><stop offset="0.62" stop-color="#36363a"/><stop offset="0.86" stop-color="#4a4946"/><stop offset="1" stop-color="#555350"/></linearGradient>
  <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#efe6cf" stop-opacity="0.75"/><stop offset="0.18" stop-color="#d8cfb8" stop-opacity="0.32"/><stop offset="0.5" stop-color="#9a958a" stop-opacity="0.1"/><stop offset="1" stop-color="#8a867c" stop-opacity="0"/></radialGradient>
  <radialGradient id="disc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f6f0de"/><stop offset="0.8" stop-color="#e6dcc2"/><stop offset="1" stop-color="#cfc4a8"/></radialGradient>
  <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8e0cc" stop-opacity="0.16"/><stop offset="1" stop-color="#e8e0cc" stop-opacity="0"/></linearGradient>
  <linearGradient id="wisp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a8780" stop-opacity="0"/><stop offset="0.5" stop-color="#8a8780" stop-opacity="0.22"/><stop offset="1" stop-color="#8a8780" stop-opacity="0"/></linearGradient>
  <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e5c57" stop-opacity="0"/><stop offset="0.5" stop-color="#5e5c57" stop-opacity="0.3"/><stop offset="1" stop-color="#5e5c57" stop-opacity="0"/></linearGradient>
  <radialGradient id="smk" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#1c1a19" stop-opacity="0.5"/><stop offset="0.6" stop-color="#1c1a19" stop-opacity="0.22"/><stop offset="1" stop-color="#1c1a19" stop-opacity="0"/></radialGradient>
  <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter><filter id="b1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter><filter id="b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.5"/></filter><filter id="b3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>`);
a.raw(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);
// stars where the Grey thins at the top
for (let k = 0; k < 220; k++) { const y = Math.pow(R(), 1.6) * 520; a.raw(`<circle cx="${f(R() * W)}" cy="${f(y)}" r="${f(rr(0.4, 1.3))}" fill="#d8d4c8" opacity="${f((1 - y / 520) * rr(0.15, 0.7))}"/>`); }
// the drowned sun: a wide bloom, the disc itself, and faint rays fanning up through the gaps
a.raw(`<circle cx="${SUN[0]}" cy="${SUN[1]}" r="520" fill="url(#sun)"/>`);
for (let k = 0; k < 9; k++) {
  const ang = -Math.PI * rr(0.55, 1.45) + (R() < 0.5 ? 0 : Math.PI * 0.08), len = rr(500, 900), wd = rr(0.03, 0.07);
  const x1 = SUN[0] + Math.cos(ang - wd) * len, y1 = SUN[1] + Math.sin(ang - wd) * len, x2 = SUN[0] + Math.cos(ang + wd) * len, y2 = SUN[1] + Math.sin(ang + wd) * len;
  a.raw(`<path d="M${SUN[0]} ${SUN[1]} L${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} Z" fill="#e8e0cc" opacity="${f(rr(0.025, 0.05))}"/>`);
}
a.raw(`<circle cx="${SUN[0]}" cy="${SUN[1]}" r="50" fill="url(#disc)" opacity="0.8"/><circle cx="${SUN[0]}" cy="${SUN[1]}" r="50" fill="none" stroke="#f8f2e0" stroke-width="3" opacity="0.35"/>`);

// One cumulus: a heap of billows on a flattish base, painted the way an illustrator shades cumulus. The silhouette
// is inked once (stroke under fill). Then each billow, back to front, is laid down in its lit colour and covered by
// a softened copy of itself pushed away from the sun in the shade colour: what is left showing is a lit crescent on
// the sun side, so every billow reads as a rounded lump standing in front of the ones behind it.
function cloud(cx, cy, w, h, tone, lip, scale) {
  const n = Math.max(3, Math.round(w / (64 * scale)));
  const puffs = [];
  if (h > 70 * scale) for (let i = 0; i < Math.max(1, Math.floor(n / 2)); i++) {
    const t = rr(0.25, 0.75), r = h * rr(0.26, 0.4);
    puffs.push([cx - w / 2 + w * t, cy - h * rr(0.6, 0.85), r]);
  }
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, bell = Math.sin(Math.PI * t);
    const r = h * (0.26 + 0.44 * bell) * rr(0.82, 1.12);
    puffs.push([cx - w / 2 + w * t + rr(-0.18, 0.18) * w / n, cy - r * rr(0.3, 0.55), r]);
  }
  puffs.sort((p, q) => (p[1] - p[2] * 0.2) - (q[1] - q[2] * 0.2));
  const base = `M${f(cx - w / 2 + 6)} ${f(cy - h * 0.1)} Q${f(cx - w / 2 - 12)} ${f(cy + h * 0.14)} ${f(cx - w / 2 + 34)} ${f(cy + h * 0.17)} L${f(cx + w / 2 - 34)} ${f(cy + h * 0.19)} Q${f(cx + w / 2 + 14)} ${f(cy + h * 0.15)} ${f(cx + w / 2 - 6)} ${f(cy - h * 0.1)} Z`;
  const shapes = puffs.map(([x, y, r]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`).join('') + `<path d="${base}"/>`;
  const near = Math.max(0, 1 - Math.hypot(cx - SUN[0], cy - SUN[1]) / 760);
  const lit = mix(mix(tone, lip, 0.75), '#efe4c8', near * 0.55);
  const shade = mix(tone, '#07070a', 0.18);
  const id = ++gid;
  defs.push(`<clipPath id="u${id}">${shapes}</clipPath><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(shade, '#07070a', 0.2)}"/><stop offset="0.6" stop-color="${shade}"/><stop offset="1" stop-color="${mix(shade, lit, 0.3)}"/></linearGradient>`);
  let s = `<g fill="none" stroke="${INK}" stroke-width="${f(3 * scale)}" stroke-opacity="0.5">${shapes}</g>`;
  s += `<g clip-path="url(#u${id})"><path d="${base}" fill="${lit}"/><path d="${base}" fill="url(#g${id})" transform="translate(0 ${f(-h * 0.08)})" filter="url(#b${scale > 1 ? 3 : scale > 0.8 ? 2 : 1})"/>`;
  for (const [x, y, r] of puffs) {
    const dx = SUN[0] - x, dy = SUN[1] - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const d = r * rr(0.16, 0.24);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${lit}"/>`;
    s += `<circle cx="${f(x - ux * d)}" cy="${f(y - uy * d)}" r="${f(r * 1.02)}" fill="url(#g${id})" filter="url(#b${scale > 1 ? 3 : scale > 0.8 ? 2 : 1})"/>`;
    // a hair of ink where this billow's lit edge meets the one behind it
    const ang = Math.atan2(uy, ux), sp = rr(0.7, 1.1);
    const p1 = [x + Math.cos(ang - sp) * r, y + Math.sin(ang - sp) * r], p2 = [x + Math.cos(ang + sp) * r, y + Math.sin(ang + sp) * r];
    s += `<path d="M${f(p1[0])} ${f(p1[1])} A${f(r)} ${f(r)} 0 0 1 ${f(p2[0])} ${f(p2[1])}" stroke="${INK}" stroke-width="${f(1.4 * scale)}" fill="none" opacity="0.28" stroke-linecap="round"/>`;
    // dry-brush hatching in the shaded crown of the big billows
    if (r > 44 * scale) for (let k = 0; k < 3; k++) {
      const hx = x - ux * r * rr(0.1, 0.5) + rr(-0.25, 0.25) * r, hy = y - r * rr(0.2, 0.55);
      s += `<path d="M${f(hx)} ${f(hy)} q${f(r * 0.12)} ${f(-r * 0.05)} ${f(r * 0.26)} ${f(-r * 0.06)}" stroke="${INK}" stroke-width="${f(1 * scale)}" fill="none" opacity="0.18" stroke-linecap="round"/>`;
    }
  }
  s += `</g>`;
  return s;
}
// a stretched band of stratus drawn as a soft gradient sliver
function wisp(x, y, w, h, op) {
  let d = `M${f(x - w / 2)} ${f(y)}`;
  for (let k = 1; k <= 6; k++) d += ` Q${f(x - w / 2 + w * (k - 0.5) / 6)} ${f(y - h * rr(0.4, 1))} ${f(x - w / 2 + w * k / 6)} ${f(y + rr(-2, 2))}`;
  for (let k = 5; k >= 0; k--) d += ` Q${f(x - w / 2 + w * (k + 0.5) / 6)} ${f(y + h * rr(0.2, 0.6))} ${f(x - w / 2 + w * k / 6)} ${f(y + rr(-2, 2))}`;
  return `<path d="${d} Z" fill="url(#wisp)" opacity="${f(op)}" filter="url(#soft)"/>`;
}
function bank(y0, tone, lip, scale, gaps = 0.25) {
  let s = '', x = -160;
  while (x < W + 160) {
    const w = rr(220, 520) * scale, h = rr(60, 150) * scale;
    if (R() > gaps) s += cloud(x + w / 2, y0 + rr(-60, 60), w, h, tone, lip, scale);
    x += w * rr(0.6, 0.95);
  }
  return s;
}
const layers = [];
layers.push(bank(230, '#18191e', '#4a4a50', 1.35, 0.1));
layers.push(Array.from({ length: 6 }, () => wisp(rr(0, W), rr(330, 420), rr(400, 900), rr(10, 22), 0.6)).join(''));
layers.push(bank(420, '#222328', '#56565a', 1.15, 0.2));
layers.push(bank(610, '#2c2c30', '#666462', 1.0, 0.3));
layers.push(Array.from({ length: 7 }, () => wisp(rr(0, W), rr(700, 800), rr(500, 1000), rr(8, 18), 0.8)).join(''));
layers.push(bank(830, '#38383a', '#787670', 0.82, 0.35));
layers.push(bank(1020, '#444341', '#86847c', 0.66, 0.35));
layers.push(Array.from({ length: 6 }, () => wisp(rr(0, W), rr(1060, 1160), rr(600, 1200), rr(10, 20), 1)).join(''));
a.raw(`<defs>${defs.join('')}</defs>`);
// paint the far banks first (low, near the horizon), the overhead ones last
for (const l of layers.reverse()) a.raw(l);
// fog banks low over the abbey
for (const y of [1100, 1200, 1290]) a.raw(`<rect x="0" y="${y - 70}" width="${W}" height="160" fill="url(#fog)"/>`);
// forge smoke from the smithy stack (its top stands at 292,1250 in sky space), soft puffs drifting east and up
{
  let x = 292, y = 1246, r = 16;
  for (let k = 0; k < 26; k++) {
    a.raw(`<circle cx="${f(x + rr(-6, 6))}" cy="${f(y)}" r="${f(r)}" fill="url(#smk)" opacity="${f(Math.max(0.18, 1 - k / 30))}"/>`);
    x += 8 + k * 1.6; y -= 16 - k * 0.32; r += 3.6;
  }
  for (let k = 0; k < 18; k++) { const ex = 292 + rr(-10, 60), ey = 1240 - rr(0, 110); a.raw(`<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(rr(1, 2.2))}" fill="#ff9a40" opacity="${f(rr(0.4, 0.9) * (1 - (1240 - ey) / 130))}"/>`); }
}
// crows wheeling over the bell tower
for (let k = 0; k < 16; k++) { const cx = rr(700, 1250), cy = rr(860, 1200), s = rr(5, 11); a.raw(`<path d="M${f(cx - s)} ${f(cy)} Q${f(cx - s * 0.4)} ${f(cy - s * 0.7)} ${f(cx)} ${f(cy)} Q${f(cx + s * 0.4)} ${f(cy - s * 0.7)} ${f(cx + s)} ${f(cy)}" stroke="#0a0a0c" stroke-width="${f(s * 0.3)}" fill="none" stroke-linecap="round"/>`); }
fs.writeFileSync('grim/hub/title_sky.svg', a.svg(false));
console.log('sky ok');
