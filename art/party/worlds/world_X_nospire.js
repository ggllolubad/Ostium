// Variant module (consistency pass 2026-11-25): the Hive Queen without her 'spire' bone (wall, floor and rod), for the
// hive_boss room, which supplies its own spire wall. Same key, canvas, origin and rig as world_X.js 'hive_queen'; the
// 'spire' joint stays as an empty root pivot. Re-render after any change to world_X.js:
//   node render.js worlds/world_X_nospire hive_queen && node render_rig.js worlds/world_X_nospire hive_queen
'use strict';
const { withoutBone } = require('./kit_variant');
const X = require('./world_X');
module.exports = { heroes: [withoutBone(X.heroes.find(h => h.key === 'hive_queen'), 'spire', 'nospire')] };
