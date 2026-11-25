const INK = '#2b2a28';
const C = {
  ink: INK, cream: '#efe4cc', creamD: '#e2d2b0', sage: '#8fa58a', sageD: '#6e8a6a', teal: '#4d7a7a', tealD: '#2f4f55', tealL: '#9bb5ae',
  ochre: '#c39a4b', ochreL: '#e3c27a', rose: '#c98b7e', roseD: '#a96a5e', roseL: '#e3b4a8', plum: '#5b3a4a', plumL: '#7d5466',
  skin: '#efd7c2', skinD: '#dcb89e', hair: '#9a5a3a', hairD: '#6e3c26', steel: '#a8b0a8', steelL: '#d3d8cf', steelD: '#7e877f', seafoam: '#9fd8cf', lilac: '#a99bc4'
};
const SH = 'rgba(43,42,40,0.20)', SH2 = 'rgba(43,42,40,0.34)', HL = 'rgba(255,250,236,0.45)';
const defs = `<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>`;
const S = { ink: INK, inkW: 2.8, lineW: 1.2, shade: SH, shade2: SH2, hl: HL, defs };
// Mucha-style ornamental halo: discs, beaded ring, petal rosette ring
function halo(cx, cy, R, base, ring, dark) {
  let o = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${base}" stroke="${INK}" stroke-width="3"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${R - 8}" fill="none" stroke="${ring}" stroke-width="3"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${R - 4}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-dasharray="0.1 9" stroke-linecap="round"/>`;
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r1 = R - 14, r2 = R - 30;
    const x1 = cx + Math.cos(a) * r1, y1 = cy + Math.sin(a) * r1, x2 = cx + Math.cos(a) * r2, y2 = cy + Math.sin(a) * r2;
    const a2 = a + Math.PI / n;
    const xm = cx + Math.cos(a2) * (r1 - 6), ym = cy + Math.sin(a2) * (r1 - 6);
    o += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${xm.toFixed(1)} ${ym.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${dark || ring}" stroke-width="1.4" opacity="0.8"/>`;
  }
  o += `<circle cx="${cx}" cy="${cy}" r="${R - 30}" fill="none" stroke="${INK}" stroke-width="1.2" opacity="0.6"/>`;
  return o;
}
module.exports = { S, C, halo, SH, SH2, HL };
