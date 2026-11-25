const INK = '#11151c';
const C = {
  ink: INK, steel: '#5d6875', steelL: '#8b97a3', steelD: '#3e4651', wood: '#6b4a2e', woodD: '#4a3220', woodL: '#8a6a48', iron: '#363c44',
  red: '#7a2a24', redD: '#4f1a17', redL: '#a3463a', cloth: '#3b2a45', clothL: '#5a4366', mustard: '#8a6a2a', mustardL: '#b08c40',
  skin: '#c99a7a', skinD: '#8f6650', bone: '#cfc6b2', boneD: '#9a917e', teal: '#24515a', tealD: '#173840', tealL: '#3f7a80',
  bronze: '#8a6a3a', bronzeL: '#b8955a', bronzeD: '#5a4424', kelp: '#4b5e2a', kelpL: '#6b7d3a', glow: '#ffd27a', glowB: '#9fe8d6', sea: '#2b5856'
};
const defs =
  `<filter id="paint" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" result="d"/>` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0" result="ga"/><feComposite in="ga" in2="d" operator="in" result="gm"/><feMerge><feMergeNode in="d"/><feMergeNode in="gm"/></feMerge></filter>` +
  `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>` +
  `<filter id="glow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`;
const S = { ink: INK, inkW: 1.5, lineW: 1.1, shade: 'rgba(8,12,20,0.40)', shade2: 'rgba(8,12,20,0.58)', hl: 'rgba(255,214,160,0.30)', defs };
// brush stroke helper: semi-transparent rounded strokes for painted highlights
const brush = (d, col, w, op) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
module.exports = { S, C, brush };
