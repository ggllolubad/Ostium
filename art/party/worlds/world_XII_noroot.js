// Variant module (consistency pass 2026-11-25): the Cold Star without its 'root' bone (the tundra and the herders'
// camp), for the silence_boss room, which supplies its own ground. Same key, canvas, origin and rig as world_XII.js
// 'cold_star' ('root' was never a declared joint; 'disc' stays the rig root). Re-render after any change to world_XII.js:
//   node render.js worlds/world_XII_noroot cold_star && node render_rig.js worlds/world_XII_noroot cold_star
'use strict';
const { withoutBone } = require('./kit_variant');
const XII = require('./world_XII');
module.exports = { heroes: [withoutBone(XII.heroes.find(h => h.key === 'cold_star'), 'root', 'noroot')] };
