const { hatch, cross } = require('./lib');
const INK = '#2b1d12';
const C = {
  ink: INK, parch: '#ecdfc2', parchD: '#dfcca4', azure: '#7f9cc6', azureD: '#5a78a6', red: '#c4573f', redD: '#9c3d2b',
  green: '#8aa271', greenD: '#62804f', gold: '#d6ad52', goldD: '#a9822f', flesh: '#efd3b4', steel: '#cfcbbf', steelD: '#aaa596',
  violet: '#8e7aa6', teal: '#79a89c', tealD: '#4f7f74', bone: '#e9e1cc', brown: '#9a7350', brownD: '#6f5036'
};
const defs =
  hatch('h45', 45, 3.2, INK, 0.75) + hatch('h135', -45, 3.2, INK, 0.75) + hatch('hv', 90, 3, INK, 0.7) + hatch('hh', 0, 3, INK, 0.7) +
  cross('x45', 45, 3.4, INK, 0.7) + hatch('h45w', 45, 4.5, INK, 0.6) +
  `<pattern id="mail" width="5" height="4.4" patternUnits="userSpaceOnUse"><path d="M0 4.4 C0.4 1.2 4.6 1.2 5 4.4 M-2.5 2.2 C-2.1 -1 2.1 -1 2.5 2.2 M2.5 2.2 C2.9 -1 7.1 -1 7.5 2.2" fill="none" stroke="${INK}" stroke-width="0.55"/></pattern>` +
  `<pattern id="scale" width="8" height="7" patternUnits="userSpaceOnUse"><path d="M0 7 C0 2.5 4 0.5 4 0.5 C4 0.5 8 2.5 8 7 M-4 3.5 C-4 -1 0 -3 0 -3 M4 -3 C4 -3 8 -1 8 3.5" fill="none" stroke="${INK}" stroke-width="0.7"/></pattern>` +
  `<pattern id="diaper" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 0 L14 7 L7 14 L0 7 Z" fill="none" stroke="${INK}" stroke-width="0.5" opacity="0.7"/><circle cx="7" cy="7" r="1" fill="${INK}" opacity="0.6"/></pattern>` +
  `<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/></filter>`;
const S = { ink: INK, inkW: 2.1, lineW: 1.1, shade: 'url(#h45)', shade2: 'url(#x45)', hl: '#f7eedb', defs };
module.exports = { S, C };
