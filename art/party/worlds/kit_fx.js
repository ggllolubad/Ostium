// FX capture (final consistency pass, 2026-11-25). Lightning arcs are engine effects, never figure art (GUIDE 8).
// fxCapture(f, fn) runs the drawing in fn into a separate list (f.fxOut) instead of the figure, so the figure render no
// longer carries the arcs, while the random stream still advances exactly as before and the rest of the figure is
// unchanged. worlds/fx_export.js writes f.fxOut as its own layer on the figure's canvas and origin:
//   node worlds/fx_export.js worlds/world_V anvil_titan  ->  out/worlds/world_V_anvil_titan_fx.svg / _fx.png
// Rule: no f.bone() calls inside fn (bone marks index into f.out).
'use strict';
function fxCapture(f, fn) {
  const save = f.out; f.out = [];
  try { fn(); } finally { f.fxOut = (f.fxOut || []).concat(f.out); f.out = save; }
}
module.exports = { fxCapture };
