# World IV, The Sulphur Pits, second batch: review

Figures: The Owner (420), The Powder Mill (421), The Mounted Overseer (422), The Shrine-Bearer (423), Gas-Burner (424),
Pit Boy (425), Timberman (426), Gallery Rats (427), Weighman (428), Lamp-Room Girl (429), Tub Hurrier (430).
File `worlds/world_IV_b.js`, new helpers in `worlds/kit_IV_b.js` (horse and pony anatomy, rats, open iron lamps, flames,
clumped fur, an irregular rag hem). `worlds/kit_IV.js` and `worlds/world_IV.js` are untouched. Every build is wrapped in
the same guard as batch one: it throws unless `groundY === h - 30`, and every rig.json reads ground 1570 (ruler), 1370
(elite), 1070 (large) or 790 (human and small).

Outputs: renders and silhouettes at `out/worlds/world_IV_b_<key>.png` / `_sil.png` (render.js's own path), rigs at
`out/rig/worlds/world_IV_b_<key>/`, attack poses at `out/worlds/IV_b/<key>_pose.png`, sheets at `out/worlds/IV_b/sheet.png`
(this batch at true relative scale with the Drowned Thrall), `sheet19.png` (all 19 World IV creatures) and `sil.png`
(all 19 as silhouettes at 190 px per human).

Method: each figure was rendered, composited on a mid-dark ground, checked at 2x to 3x on head, hands, held objects and
feet and at sheet size, fixed and re-rendered. All grips go through `B.grip`; the final renders print no grip warning.
"Fixed" means the item failed on an earlier render and passes on the current one.

## Tiers and scale

| Figure | Tier | Canvas | Bible scale | Built |
|---|---|---|---|---|
| The Owner | ruler | 1600 x 1600 | 3.5 | hips and legs out of frame above, head H 350 (3.5 x 100) |
| The Powder Mill | ruler | 1600 x 1600 | 3.5 | stone 1520 px across, its top and the timber frame cropped; horse withers 600 px |
| The Mounted Overseer | elite | 1100 x 1400 | 2.1 to the whip's tip | whip tip at about 2.0; pony withers 372 px (a 1 m pit pony) |
| The Shrine-Bearer | elite | 1100 x 1400 | 2.3 to the shrine's top | the bell-cote reaches about 2.1 (the canvas is 2.14 tall) |
| Timberman | large | 900 x 1100 | 1.5 | H 146; the prop is about 1.1 times his height (bible: 2) |
| Gas-Burner | human | 600 x 820 | 1.0 kneeling | H 100 |
| Weighman | human | 600 x 820 | 1.0 | H 96 |
| Lamp-Room Girl | human | 600 x 820 | 0.9 | H 90 |
| Tub Hurrier | human | 600 x 820 | 0.95 | H 95 |
| Pit Boy | small | 600 x 820 | 0.6 | H 70 (a child's proportions) |
| Gallery Rats | small | 600 x 820 | heap 0.45 | rats 66 to 94 px long |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (animals: one spine, jaws and heads on their necks); 2 objects face their user and
gaze; 3 grips; 4 weight and balance (animals: legs carry the weight); 5 contact and attachment, plumb hang; 6 facing and
light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Owner | pass | n/a | fixed | pass | fixed | fixed | 3: the lamp fist first closed on the vertical bail with a vertical forearm (81 deg off square). It now grips the bail's horizontal bar, 14 deg off square, and the bail wires run from the bar's ends to the lantern. 5: the chain of office first fell straight across his face; it now swings forward off the neck, ahead of the face, the badge clear of it. 6: an upside-down head drawn by rotation would face backwards and be lit from below. It is drawn upright, mirrored about its centre, with the key light mirrored while it draws, so the face looks forward and is lit from the upper left like everything else. |
| The Powder Mill | pass | n/a | n/a | pass | fixed | pass | 5: the first sparks sat under the horse's belly, nowhere near the tyre. They now come from where the tyre grinds the trough lip. The beam passes through the stone's eye (square socket and wedges) and ends at the swingletree. The trace chains run from the hame to the swingletree, the crust bridges the swingletree and the near hock, and the apron and lantern hang plumb from the beam. 4: the horse leans into the collar with the forehand lowered (tilt 0.09), the near hind driving back, the far fore planted under the chest, the near fore lifted mid-tread. |
| The Mounted Overseer | pass | n/a | fixed | pass | fixed | pass | 3: whip stock 74 deg off square at first, then 40 (forearm along the stock); now cocked back, 32 deg off square. The reins fist first ran along its reins (83 deg); now square to the reins, which run to the bit ring. 5: the rider's boot first reached the floor, because the boot helper always grounds the sole; it now sits in the stirrup iron with a spur, and a stirrup leather runs up to the saddle. 4: the pony's forelegs are planted ahead, braced, its head low; the rider leans forward over the withers. |
| The Shrine-Bearer | pass | pass | pass | pass | fixed | pass | 4: the shrine is on a carrying frame; it tilts with him only 7 deg, and he leans on a planted staff. The staff fist is 11 deg off square, the rosary fist 31. 5: the back's crack net first spilled off his body onto the shrine's plinth; it is now clipped to the torso. The rosary hangs plumb from the fist, the bell plumb in its cote, the tokens plumb on their cords. |
| Gas-Burner | fixed | pass | fixed | pass | pass | pass | 3: the first pole was near-vertical, both forearms ran along it (78 and 80 deg) and the candle left the canvas. The pole now rises at 45 deg with the forearms near horizontal, the near fist 34 deg off square and the far 32. 1: the hooded head first sat on the pole line, so the pole crossed the face. It now sits 68 px behind that line and looks up along the pole. The candle stands upright in a cup on a bent stem, so it stays plumb. |
| Pit Boy | pass | n/a | pass | pass | pass | pass | Sack-neck fist 15 deg off square. The shirt hangs plumb from the bent back, not along it. The near hand is braced flat on the near knee, and the weight is over the bowed legs. |
| Timberman | pass | n/a | pass | pass | pass | pass | The prop lies across the near shoulder on a pad, front end down, and passes below the chin (32 px clear). The near fist holds it from below, 29 deg off square. The maul handle is square to the hanging forearm (17 deg off), its head forward. |
| Gallery Rats | pass | n/a | n/a | pass | pass | pass | Every rat's feet are on the tin, another rat or the floor. Climbers are angled along the tin's side. The rats facing back are mirrored belly-down, not rotated belly-up. |
| Weighman | pass | pass | pass | pass | fixed | pass | 2: eye line to the beam's middle is 46 deg below horizontal against a head bowed 24 deg, so 22 deg apart. 3: hook fist 9 deg off square, the hook's crook over the fingers. 5: the ledger first floated in front of his belly as a log; it is now clamped under the far arm, sticking out behind his back, the far hand under it. The pan hangs on three chains, the poise on its loop. |
| Lamp-Room Girl | pass | n/a | pass | pass | fixed | pass | 5: the near leg was first drawn over the skirt, so her thigh showed bare to the hip. The legs now go under the kilted skirt. Every lamp hangs plumb on its own chain from a hook on the yoke. The yoke's centre rides behind her neck; its near arm comes toward us, its far arm goes away. Lamp-hook fist 7 deg off square. |
| Tub Hurrier | pass | n/a | n/a | pass | fixed | pass | 5: the chain first ran to her back. It now runs from the tub's hitch, taut, between her legs to the ring at the front of the girdle, as the bible says. 4: her centre of mass is ahead of her feet, held by the chain's pull (she leans into it). Her hands are braced on her knees. |

## Gate 2: style and detail

Columns: guide section 8 faults; signature at 190 px (`sil.png`); course marks (fire dominant, toxin second), Never
items absent (no flames on heads, no slime puddles, no neon green); secondary details (needed: rulers 12, elites 10, cast
6); layers, asymmetry, wear, mud; palette; unique silhouette among the 19; section 9 (former self readable, one part
pushed hard by the course, the outline broken the course's way, hair and sinew with structure, clergy and relics only
where the bible has them).

| Figure | Sec. 8 faults | Signature | Course, Never | Details (needed) | Layers etc. | Palette | Unique | Sec. 9 | Fix |
|---|---|---|---|---|---|---|---|---|---|
| The Owner | fixed | pass | pass | 22 (12) | pass | pass | pass | pass | Tube arms: the upper arms now sag toward the elbow (the arms hang), the forearms swell, and the sleeves have slid down to the wrists. The floor hand first read as a blocky mitt: the fingers are now splayed on the floor, with swollen creased knuckles, black nails, tendons and the signet ring. The face was too dark to read; it is lifted to 0.78 face shade. The torso is built like the Matriarch's head: lobes with no ink of their own, tapered creases with the overhang's shadow and a lit lip, a core shadow, wrapping hatching and a tight sheen. Her stretch marks become fire's seams running along the stretch. |
| The Powder Mill | fixed | pass | pass | 28 (12) | pass | pass | pass | pass | The horse was first cropped by the frame and too long in the body (a sausage). The template body is now 0.86 as long, so body length is about withers height. The horse is moved and enlarged so it reads first, with its head fully in frame. The gas sacs first hung under the belly like udders; they are now swellings on the flank: a soft lit swell, sheen, veins and a crease. The knee and hock knobs first read as balls; they are now lit bony knobs with a line. Yellow spill "worms" on the trough became heaps. The foam is now bubbled, not a bag. |
| The Mounted Overseer | fixed | pass | pass | 22 (10) | pass | pass | pass | pass | The pony's legs were first drawn over the body with flat-topped tubes, so a box showed at each shoulder and haunch. The legs now go under the body's edge, which carries the shoulder and haunch masses. Fetlock feathering and belly fur first read as claws and teeth; the locks are now blunt, clumped and curled. The singed patches first read as holes; they are now lighter bare skin with cracks. |
| The Shrine-Bearer | fixed | pass | pass | 20 (10) | pass | pass (gold only on the holy figure and the cross-lamp) | pass | pass (the bible has the mine priest and his shrine) | The eave candles first hung as white fangs (an icicle read in a fire world); they now stand on the cornice with short wax beards and drips. A stray zero-opacity fill rendered as a black disc on the staff; removed. The tonsure fringe first read as a headphone cup; it is now a ring of hair with the ear free. He was bent too little; the torso now leans further. |
| Timberman | fixed | pass | pass | 18 (6) | pass | pass | pass | pass | The prop first read as a pale plank with polka dots. It is now darker pine with bark in ragged strips along the grain, grain checks, knots, a sawn end with rings, a charred and smoking front end under the iron cap, and a scorch where it rode the burning shoulder. Torn sleeves used the regular sawtooth hem; the new irregular `X.rag` is used everywhere in the batch. |
| Gas-Burner | fixed | pass | pass | 14 (6) | pass | pass | pass | pass | The face cloth first read as a pale ball mask with a beak. The hood is now a deep cowl with a peak, sides hiding the cheeks and ears, and a scorched top. The cloth hangs from the brow to the lip, dark with wet, with slits, folds and drips; the charred chin and singed stubble show below it. The sleeves first read as boxes; they are now tapered with folds. The steam is wisps like the batch-one gas, not a cloud. |
| Pit Boy | fixed | pass | pass | 11 (6) | pass | pass | pass | pass | The sack first read as an egg. It now lies along his back, droops at both ends with a corner, and has lumps pressing out, strain creases between them, ragged holes with crystals, and a darned seam. The legs first had adult thickness; they are now a thin child's. |
| Gallery Rats | fixed | pass | pass | 12 (6) | pass | pass | pass | pass | The first rats read as slugs with stick legs. They now have a high round rump, an arched back, a long head tapering to the snout, big round thin ears, bead eyes, pink hands and long hind feet, a thick scaled tail burnt to a glowing stub, and clumped fur tufts breaking the back's outline. Gas-tight bellies are shiny and veined; one is burst. The tin's bail first ran across it as a strap; it now hangs at the side. |
| Weighman | fixed | pass | pass | 18 (6) | pass | pass | pass | pass | The hose legs were even tubes; they now have a calf, a knee and a thigh shape, with wrinkles at the ankle. The face hatch read as a beard and the lip blisters as brass beads; the hatch is off at face shade 0.75, and the blisters are small and skin-toned. The comb-over was parallel lines; it is now a few uneven greasy clumps with scalp between. The quill first read as a horn on the crown; it now lies behind the ear with barbs. |
| Lamp-Room Girl | fixed | pass | pass | 13 (6) | pass | pass | pass | pass | The chalked lamp numbers were Arabic numerals and came out mirrored after the flip; they are now tally numerals (XII, VII, IX), which read the same. The apron was a flat slab; it now has creases, an oil sheen, a stain, a scorched corner and a chalk smudge. |
| Tub Hurrier | pass | pass | pass | 13 (6) | pass | pass | pass | pass | No change beyond the chain fix in gate 1. |

### Detail inventories (abridged)
- Owner: cage bars and cross-band with rivets, the cage chain up out of frame, roof lagging posts, three splintered
  props, belt and buckle, the deed with its seal, the split purse and falling coins, the pocket ledger on its chain,
  spilling tally tokens, the ruff, the chain of office and badge, the brass-bound lantern, the signet ring, the hat, the
  coat rags (darn), the fur collar, hanging smouldering hair, blisters, crust in the creases, seams, flakes, ash.
- Mill: frame posts and head-beam with rivets, the tally board of sacks, the iron tyre, the dressing grooves, the eye and
  wedges, the trough and its lip, the miller's boot, split sacks, brimstone lumps and druses, a scoop, a broken rake, the
  axle-beam with three bands (one split), the apron, the horn lantern, the swingletree, trace chains, breeching, back
  band, girth, the burst collar with its straw, the hame and bronze bell, the bridle, useless blinkers, the bit ring,
  bared teeth and foam, gas sacs, the crust cementing the hock, the burnt tail stub, sparks at the tyre.
- Overseer: the plaited whip stock and lash with its cracker, the bandage (blood through it), the hat with its burnt
  hole, broken nose, crusted beard, the neck gas blister, tally board with pegs, the powder-store keys, cudgel, saddle
  lantern, saddle bags, the pick, the scorched saddle cloth, the girth sunk in the bloated belly, the stirrup and spur,
  the bridle with blinkers and bronze brow plate, singed patches, shaggy locks.
- Shrine-Bearer: the shrine (plinth, three windows, the gilded saint with halo, two lamps), eave candles with wax beards,
  the bell, five prayer slips, five tally tokens, the carrying frame, padded straps, the crust and a druse, the rosary
  and cross, the staff and cross-lamp, knee pads, hobnails, burn holes, the jerkin collar, tears, soot streaks, tonsure.
- The cast inventories are in each figure's header comment in `worlds/world_IV_b.js`.

### Course marks, Never items, palette
Fire leads on every figure: glowing split seams with charred lips, cracks following stretch and harness lines, charred
and curled hems, flakes, ash rising. Toxin is second: gas swelling (the Owner's torso, the rats' bellies, the horse's sacs,
the Overseer's neck blister, the pony's belly, the Weighman's puffed face), blisters, yellow crust and crystals. No
flame on any head: the only flames are lamps, candles, a dropped lamp and the tub's candle, all on the objects the bible
names. No slime puddles; no green. Palette: sulphur yellow, ochre, lamp orange, soot, bone and grey, plus shared
materials: iron, oak and pine, leather, wool, sacking, brass for tokens and the bell, and silver (grey) for the Owner's
chain. Gold appears only on the Shrine-Bearer's holy figure and the staff's cross-lamp. There is no red.

### No two of the 19 share a silhouette (`out/worlds/IV_b/sil.png`)
- The Owner is the only shape hanging from the roof.
- The Mill is the only wheel, with a horse in front of it.
- The Overseer is a rider on a low pony with a whip loop.
- The Shrine-Bearer is a tall tower over a bent man and a staff.
- The Timberman is a big man under a diagonal log.
- The Gas-Burner kneels with a pole rising ahead.
- The Weighman is upright with a horizontal beam and a hanging pan.
- The Lamp-Room Girl is upright with a bar across her shoulders, a fringe of lamps hanging from it.
- The Tub Hurrier is bent flat with the tub behind her.
- The Pit Boy is a small lump on bowed legs.
- The Gallery Rats are a peaked heap of ears, tails and snouts on a cylinder.
- Batch one is unchanged.

Closest pair: Pit Boy and Brimstone Toad. Both are small lumps at game size. The boy has legs and a dropped head under
the lump, and the toad has a jagged crystal ridge on a wide low base.

## Rig and pose tests

The first pose test showed that positive angles swing limbs forward (toward the enemy) in the flipped layers. The
Gas-Burner, Timberman and Lamp-Room Girl tests were re-run the right way round. No export reported `MISSING JOINTS`, and
no joint opened in any test.

| Figure | Bones | Layers | Attack pose (`out/worlds/IV_b/<key>_pose.png`) | Result |
|---|---|---|---|---|
| The Owner | 12 (hips root, torso, head, chain, coat, both arms, lamp) | 17 | grab: hips 4, torso 3, both arms swung forward and up | holds; the near arm crosses in front of the face mid-grab (draw order), which is right for a grab |
| The Powder Mill | 20 (mill root, stone, beam, horse chain) | 27 | stone turns 40, near fore lifts higher, neck and head drop | holds; the stone's seams turn with it |
| The Mounted Overseer | 36 (pony + rider + whip_1..3 + lantern + tally) | 46 | lash: whip arm and three whip bones forward, the pony's foreleg up | holds |
| The Shrine-Bearer | 20 | 33 | blessing dip: torso and head forward, near knee bent | holds |
| Gas-Burner | 17 | 22 | flame lifted into the gas: both arms up 18 to 20 | holds |
| Pit Boy | 16 | 24 | tip and throw: torso forward, sack tipped 22, far arm up | holds |
| Timberman | 17 | 31 | beam swing: prop 18, near arm with it | holds; the near fist leaves the prop (IK) |
| Gallery Rats | 15 | 18 | pour: seven rats rocked 12 to 25 | holds |
| Weighman | 19 | 28 | weight swung: steelyard 20, weight 60, pan -25 | holds |
| Lamp-Room Girl | 30 (+ yoke, 12 lamp bones, held lamp) | 37 | throw: near arm up 60, lamps swing | holds |
| Tub Hurrier | 17 | 22 | drag: legs driving, torso forward | holds |

## Still open

- **Holds that need IK in engine:**
  - Gas-Burner: the far fist on the pole (the pole is on `hand_n`).
  - Timberman: the near fist on the prop (the prop is on `torso`, pivoting on the shoulder).
  - Pit Boy: the far fist on the sack's neck (the sack is on `torso`).
  - Mounted Overseer: the reins from the rider's hand to the bit ring, which are drawn on `hand_n`. They need a line
    renderer or IK between `hand_n` and the pony's `head`.
  - Tub Hurrier: the tub follows on its chain; it needs a translation, not a rotation.
  - Powder Mill: the root slides for the roll.
- **Bible scale the canvases cannot hold:**
  - Timberman: the prop is about 1.1 times his height, not 2. A longer beam would leave the 900 px large canvas or cross
    his face.
  - Shrine-Bearer: the top stops at about 2.1, not 2.3, inside the elite canvas.
  - Overseer: the whip tip is at about 2.0.
- **The Powder Mill's horse** is the weakest anatomy in the batch. It has a deep chest, tucked flank, angled knees and
  hocks, and planted, shod, cracked hooves. At full size the legs still read partly as tapered segments, and the lifted
  foreleg is stiff. An art director should look at it against the Magma Hound.
- **The pony** reads a little donkey-like at sheet size; its legs are short and thick by design.
- **The Owner's** torso is a single huge mass. It turns, sags into lobes and is broken by the seams, but in silhouette it
  is close to a rounded sack under the roof.
- **Sparks:** the Powder Mill's tyre throws a few small sparks, and the Tub Hurrier's ore, the Owner's seams and others
  give off ash and smoke wisps. These follow batch one's ash and smoke on the figure. If the "effects baked into figures"
  rule is meant to cover them too, move them to an FX layer in the consistency pass, with batch one.
- **Pit Boy and Brimstone Toad** are the closest silhouette pair among the 19.

## Independent review (2026-11-23)

Reviewer: a second agent, judging the maker's work fresh against GUIDE.md (sections 2, 8 and 9), LOGIC_CHECKLIST.md, the
design language, the World IV bible and the reviewed references (the Matriarch after review, the Drowned King, the
Magma Hound, the Plague Wolf, the Cyclops Smith, dirAC and dirAC2), and against the director's notes on
`out/worlds/IV_b/sheet.png`. Every figure was rendered alone, composited on a mid-dark ground, checked at 2x to 3x and
at sheet size. "Fail, fixed" means the item failed on the maker's render, was changed, and passes on the current render.
Every figure's rig was re-exported (no `MISSING JOINTS`, every rig.json ground = canvas h - 30, every check.png within
0.0014 mean difference of its render) and every attack pose re-run into `out/worlds/IV_b/<key>_pose.png` and looked at.

### Rulings recorded
- **Canvas (GUIDE section 2, 2026-11-23):** true size wins over the tier canvas. New helper `X.grow(f, dx, dy)` in
  `kit_IV_b.js` grows a drawn figure's canvas at the same pixel scale (each element wrapped in a translate, joints
  moved, groundY = new h - 30, the grime gradient kept on the original ground). Margins are in `GROW` at the top of
  `world_IV_b.js`. Timberman 1840 x 1250 (was 900 x 1100), Shrine-Bearer 1100 x 1570 (was 1400 tall), Mounted
  Overseer 1100 x 1470 (was 1400 tall). The sheets use the new heights so the ground line still agrees.
- **Effects (director, 2026-11-23):** small sparks, smoke and ash wisps stay on figures until the animation phase moves
  them to an FX layer; arcs and bolts may not. None of the 11 has an arc or bolt. The batch's smoke helper drew a bright
  thin wavy thread inside each plume that read as a jagged arc at game size (Gas-Burner's steam, the Tub Hurrier's ore,
  the Timberman's prop end); `world_IV_b.js` now wraps `W.smoke` so the thread is dull and faint (kit_IV.js unchanged).

### Measurements after review

| Figure | Canvas | Bible | Measured |
|---|---|---|---|
| The Owner | 1600 x 1600 | ruler 3.5, hips out of frame | head H 350, crown 1328, hair to about 1440, hat on the floor |
| The Powder Mill | 1600 x 1600 | ruler 3.5, stone cropped | stone 1520 tall, 250 px of tread seen; horse withers 600 |
| The Mounted Overseer | 1100 x 1470 | 2.1 to the whip | 2.11 |
| The Shrine-Bearer | 1100 x 1570 | 2.3 to the shrine | about 2.28 to the bell-cote roof, 2.3 with its smoke (the tower stretched 1.24 in height) |
| Timberman | 1840 x 1250 | prop twice his height | prop 1850 px against his 960 (1.93x), passing under the beard (checked at 1.2x) |

### Gate 1: logic audit (independent)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Owner | fail, fixed | n/a | pass | fail, fixed | fail, fixed | pass | 1: the head hung mid-torso between the arms instead of lowest; rebuilt hanging plumb under a thick neck, crown lowest, the hat beneath it. 4: the arms now hang from the shoulders to the floor (the near hand lies on it, the far fist rests the lamp on it), because a 3.5 man's arms are longer than the drop. 5: the props' splintered ends rested on his gut and read as clawed hands; the props now stand behind him in the shaft mouth. The ledger chain drapes over the gut and hangs plumb; the watch hangs plumb from its pocket; coins fall plumb off the gut. Lamp bail fist square to the vertical forearm, no grip warning. |
| The Powder Mill | pass | n/a | n/a | fail, fixed | fail, fixed | pass | 4: the stiff lifted foreleg had no knee or fetlock flexion; now the far fore lifts with the forearm forward, the knee bent, the cannon hanging back and the pastern flexed; the near fore is planted, the near hind drives back, the far hind is under him. 5: the traces now run hame to back-band loop to the swingletree's end; the swingletree has hooks; the crust grows over the swingletree, the trace end and up the near hock. The trough was shortened to the stone so the horse stands on the floor, not in it. |
| The Mounted Overseer | pass | n/a | pass | pass | pass | pass | Rider's seat checked: pelvis on the saddle between bow and cantle, the near boot in the iron with the leather to the saddle, the reins from the fist to the bit ring (line renderer in engine). |
| The Shrine-Bearer | pass | pass | pass | pass | pass | pass | The taller tower still tilts only 7 deg with him, over his planted staff. |
| Gas-Burner | pass | pass | pass | pass | pass | pass | The maker's measurements hold. |
| Pit Boy | pass | n/a | pass | fail, fixed | pass | pass | 4: the feet sat almost together under the lump, so the weight read as a ball on a post; now a staggering step, knees out, a clear gap between the legs, the heavy end of the sack overhanging behind the hips. |
| Timberman | pass | n/a | pass | pass | fail, fixed | pass | 5: the lengthened, thicker prop crossed his beard; it now sits lower on the shoulder pad and clears the beard. |
| Gallery Rats | pass | n/a | n/a | pass | pass | pass | |
| Weighman | pass | pass | pass | pass | pass | pass | |
| Lamp-Room Girl | pass | n/a | pass | pass | pass | pass | |
| Tub Hurrier | pass | n/a | n/a | pass | pass | pass | |

### Gate 2: style and detail (independent)

| Figure | Sec. 8 faults | Signature at 190 px | Course, Never | Details (needed) | Layers etc. | Palette | Unique | Sec. 9 | Fix |
|---|---|---|---|---|---|---|---|---|---|
| The Owner | fail, fixed | fail, fixed | pass | 24 (12) | pass | pass | pass | pass | Read as a lumpy brown blob. Rebuilt: the inverted head (drawn upright and mirrored with the light mirrored) is the lightest big mass, burnt flesh against the char, with Matriarch-style sag carried by creases, overhang shadows and lit lips (no pasted pouches): the cheeks pressing the eyes shut, the jowl dragged to the cheekbone, the chin fat over the jaw, brow rolls bunched at the hairline, bushy singed brows below the eyes, the nostril, slack lips and teeth, singed stubble, splits and char. Arms: deltoid edge, biceps groove, elbow point, crease inside the bend, forearm taper, the coat sleeves bunched at the wrists in concertina folds, the shirt sleeve torn at the shoulder; the near hand lies on the floor, fingers trailing, black nails, swollen knuckles, the silver signet ring; an iron mourning ring on the lamp fist. Torso: the bare gut slid down over the ribs with its fold sagging (toward the floor) over the waistcoat, a belt roll, the navel dragged down, glowing splits running round the gut along the stretch, a back roll sagging to the shoulders, the chest fat sagging to the collar; the ochre brocade waistcoat ridden down to the armpits in rolls, split open with two buttons sprung, a strip of scorched shirt, the silver watch fallen from its pocket on its chain; the pleated ruff (a torn length hanging), the silver chain of office ahead of the face, the coat in charred hanging strips, the fur collar. |
| The Powder Mill | fail, fixed | pass | pass | 30 (12) | pass | pass | pass | pass | Horse rebuilt in `kit_IV_b.horse`: legs from anatomical stations (forearm muscle into a flat knee with the carpal bump, a narrow cannon with the tendon behind, the fetlock joint and ergot, a sloped pastern; gaskin, the point of hock and the hamstring), feathered fetlocks as a hanging fall of hair (the first pointed locks read as claws), wider shod hooves, a long neck stretched into the collar, a long heavy head hung low, the coat lifted to a mid brown so it separates from the stone and the post. The gas sacs that read as buttocks became one sagging belly swelling and a throat sac. Collar slimmer and lighter, the hame lit, strap buckles. The frame post moved behind the stone and the tally board onto the head-beam, so nothing vertical cuts the horse. Stone: seen three-quarter with 250 px of tread turning away, the dressing grooves across the tread caked yellow, a riveted iron tyre, a chamfered chipped rim, pick-dressed rings and furrows on the face, the seams running out from the eye. |
| The Mounted Overseer | fail, fixed | pass | pass | 22 (10) | pass | pass | pass | pass | The pony read as a donkey (long ears, long head, thin ewe neck). Now short thick ears, a shorter head, a short thick arched neck under a heavy shaggy mane falling on the near side, bigger stitched blinkers, a thick forelock, feathered fetlocks, the new legs, a heavier body; the belly fringe that read as teeth is now short dark locks. |
| The Shrine-Bearer | pass | pass | pass | 20 (10) | pass | pass | pass | pass | Height only (ruling). |
| Gas-Burner | fail, fixed | pass | fail, fixed | 15 (6) | pass | pass | pass | pass | Capsule sleeves, a box smock and tube trouser legs (the stacked-rectangle fault): the sleeves now taper and hang in heavy wet drapes under the raised arms with drips, bunched rings at the elbow, folds dragged from the hump of the back and compression rolls at the bent belly, folds dragged into both knees; the face cloth darkened so the hood no longer reads as a pale mask. Course: the steam's bright thread read as a jagged arc; dulled (see rulings). |
| Pit Boy | fail, fixed | fail, fixed | pass | 13 (6) | pass | pass | fail, fixed | pass | Closest pair with the Brimstone Toad. The sack is now a long ore sack lying along the bent back from the shoulders to past the hips, its heavy end overhanging and drooping to a corner, the twisted neck up in the fist; ore lumps break its top contour, each with a lit top and a crease of shadow under it; the head is larger with a child's smaller jaw and nose; the legs stand apart in a staggering step. At 190 px it reads as a small figure under a sack on two thin legs, against the toad's wide low crystal-ridged lump. |
| Timberman | pass | pass | fail, fixed | 18 (6) | pass | pass | pass | pass | Prop to 1.93x his height and thicker (ruling). Course: the smoke thread at the prop's end read as an arc; dulled. |
| Gallery Rats | pass | pass | pass | 12 (6) | pass | pass | pass | pass | |
| Weighman | pass | pass | pass | 18 (6) | pass | pass | pass | pass | |
| Lamp-Room Girl | pass | pass | pass | 13 (6) | pass | pass | pass | pass | |
| Tub Hurrier | pass | pass | fail, fixed | 13 (6) | pass | pass | pass | pass | Course: the ore's steam thread read as two jagged arcs; dulled. |

### Rig and pose re-checks (independent)

| Figure | Bones | Layers | Attack pose | Result |
|---|---|---|---|---|
| The Owner | 13 (+ watch) | 22 | grab: hips 4, torso 3, both arms forward and up, chain, coat | holds |
| The Powder Mill | 20 | 27 | roll: stone 12, far fore lifts higher (leg_ff_1 14, leg_ff_2 -30), near hind 8, neck and head drop | holds (see open: the stone's turn) |
| The Mounted Overseer | 36 | 44 | maker's lash | holds |
| The Shrine-Bearer | 20 | 33 | maker's blessing dip | holds |
| Gas-Burner | 17 | 22 | maker's flame lift | holds |
| Pit Boy | 16 | 24 | maker's tip and throw | holds; the longer sack tips with the torso |
| Timberman | 17 | 31 | maker's beam swing | holds; the near fist leaves the prop (IK, as before) |
| Gallery Rats, Weighman, Lamp-Room Girl, Tub Hurrier | as maker | as maker | maker's tests re-run on the re-exported rigs | hold |

Sheets: `out/worlds/IV_b/sheet.png`, `sheet19.png` and `sil.png` rebuilt in the maker's layout (true relative scale, one
ground line, the Drowned Thrall as human reference) with the grown canvases. No two of the 19 share a silhouette: the
Owner is now an inverted man with arms to the floor and hanging hair under the roof; the Pit Boy is a sack on two thin
legs with a head hanging in front, clearly apart from the toad.

### Still open after the independent review
- **The Powder Mill's stone turn:** rotating the `stone` bone in 2D tilts the cylinder's axis. In Godot put the face
  markings in a child of a node scaled (0.6, 1) and rotate that child, or limit the bone to about 15 deg per beat; the
  pose test uses 12.
- **The Owner's face** reads as a man's face at sheet size, but an inverted face is slower to read than an upright one;
  the lamp's warm light on it helps. The near arm still merges with the back in silhouette.
- **Gas-Burner** is improved past the stacked-rectangle fault but remains the plainest cast figure; its hood is still
  a simple cowl.
- **Feathered hooves** on the mill horse and the pony read as hair at full size but are heavy, boot-like masses at game
  size.
- **Holds needing IK in engine** are unchanged from the maker's list (Gas-Burner far fist, Timberman near fist, Pit Boy
  far fist, the Overseer's reins, the Tub Hurrier's tub, the mill's root slide).
- **Sparks, smoke and ash** stay on figures under the director's ruling until the FX-layer pass.
