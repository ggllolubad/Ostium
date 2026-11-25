const { Art, G, limb, smooth } = require('../gr');
const a = new Art(400, 260, 4);
a.raw(`<rect width="400" height="260" fill="${G.paper}"/>`);
a.raw(a.ground(80, 220, 60));
a.shape({ mottle:0.7, fine:true, d: smooth([[80,60],[130,110],[80,200],[30,110]].map((p,i)=>p)), fill: G.flesh, grime: 0.3 });
a.shape({ d: limb([[180,40],[200,120],[190,210]],[40,52,34]), fill: G.steel, tex: 'url(#mail)', grime: 0.4, decals: a.splat(195,120,10) });
a.shape({ mottle: 0.9, hl:false, d: 'M260 40 L360 40 L370 200 L250 200 Z', fill: G.azure, grime: 0.5, grimeId:'grime', decals: a.gash(270,90,340,130,7) + a.stain(300,170,22) , over: a.drips(260,360,195,5,30)});
require('fs').writeFileSync('grim/t_engine.svg', a.svg());
