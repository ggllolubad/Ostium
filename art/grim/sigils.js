// Engraved element sigils, shared by the hub doors, icons and UI. sig(el, cx, cy, r, col) -> svg
const { INK } = require('../gr');
const f = n => +n.toFixed(1);
const COL = { fire: '#c4573f', frost: '#5a78a6', lightning: '#a9822f', water: '#3f6fa0', toxin: '#62804f', void: '#6d5a8a' };
function sig(el, cx, cy, r, col = COL[el], w = 2.2) {
  const st = `stroke="${col}" stroke-width="${f(w * r / 20)}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const ring = `<circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="none" stroke="${INK}" stroke-width="${f(w * r / 26)}"/><circle cx="${cx}" cy="${cy}" r="${f(r * 0.86)}" fill="none" stroke="${INK}" stroke-width="${f(w * r / 60)}" opacity="0.7"/>`;
  const p = (x, y) => `${f(cx + x * r)} ${f(cy + y * r)}`;
  const body = {
    // a rising flame over an alchemical triangle
    fire: `<path d="M${p(-0.55, 0.42)} L${p(0, -0.55)} L${p(0.55, 0.42)} Z" ${st}/><path d="M${p(0, 0.3)} C${p(-0.28, 0.1)} ${p(-0.1, -0.12)} ${p(0, -0.3)} C${p(0.08, -0.08)} ${p(0.26, 0.08)} ${p(0, 0.3)} Z" ${st}/>`,
    // six-armed crystal
    frost: [0, 1, 2].map(i => { const a = i * Math.PI / 3, c = Math.cos(a), s = Math.sin(a); return `<path d="M${p(-c * 0.62, -s * 0.62)} L${p(c * 0.62, s * 0.62)}" ${st}/>` + [-1, 1].map(k => `<path d="M${p(k * c * 0.38 - s * 0.14, k * s * 0.38 + c * 0.14)} L${p(k * c * 0.5, k * s * 0.5)} L${p(k * c * 0.38 + s * 0.14, k * s * 0.38 - c * 0.14)}" ${st}/>`).join(''); }).join(''),
    // forked bolt through a broken circle
    lightning: `<path d="M${p(0.12, -0.62)} L${p(-0.22, 0.02)} L${p(0.1, 0.02)} L${p(-0.12, 0.62)}" ${st}/><path d="M${p(-0.22, 0.02)} L${p(-0.46, 0.2)}" ${st}/><path d="M${p(0.5, -0.36)} A${f(r * 0.6)} ${f(r * 0.6)} 0 0 1 ${p(0.42, 0.44)}" ${st}/>`,
    // a drop holding three waves
    water: `<path d="M${p(0, -0.62)} C${p(0.2, -0.3)} ${p(0.46, -0.02)} ${p(0.46, 0.2)} C${p(0.46, 0.5)} ${p(-0.46, 0.5)} ${p(-0.46, 0.2)} C${p(-0.46, -0.02)} ${p(-0.2, -0.3)} ${p(0, -0.62)} Z" ${st}/>` + [0, 0.18].map(y => `<path d="M${p(-0.3, 0.08 + y)} q${f(r * 0.1)} ${f(-r * 0.1)} ${f(r * 0.2)} 0 t${f(r * 0.2)} 0 t${f(r * 0.2)} 0" ${st}/>`).join(''),
    // three interlocked rings over a dripping chalice
    toxin: [[-0.2, -0.18], [0.2, -0.18], [0, 0.16]].map(([x, y]) => `<circle cx="${f(cx + x * r)}" cy="${f(cy + y * r)}" r="${f(r * 0.26)}" ${st}/>`).join('') + `<path d="M${p(0, 0.42)} L${p(0, 0.66)}" ${st}/>`,
    // an open eye with a spiral pupil
    void: `<path d="M${p(-0.62, 0)} C${p(-0.3, -0.42)} ${p(0.3, -0.42)} ${p(0.62, 0)} C${p(0.3, 0.42)} ${p(-0.3, 0.42)} ${p(-0.62, 0)} Z" ${st}/><path d="M${p(0, 0)} m${f(r * 0.04)} 0 a${f(r * 0.04)} ${f(r * 0.04)} 0 1 1 ${f(-r * 0.08)} 0 a${f(r * 0.1)} ${f(r * 0.1)} 0 1 1 ${f(r * 0.2)} 0 a${f(r * 0.17)} ${f(r * 0.17)} 0 1 1 ${f(-r * 0.32)} 0" ${st}/>`,
  }[el] || '';
  return ring + body;
}
module.exports = { sig, COL };
