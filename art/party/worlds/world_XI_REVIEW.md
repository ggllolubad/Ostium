# World XI, The Stilled Spire: review

Frost + Lightning (Lockdown). Scope: the original eight bible entries (the 11 entries added to the bible on 2026-11-23 are
a later batch in a separate file). Files: `worlds/world_XI.js`, helpers in `worlds/kit_XI.js` (copied and recoloured from
kit_V and kit_VIII; no shared file edited). Outputs: `out/worlds/world_XI_<key>.png` / `_sil.png`, rigs in
`out/rig/worlds/world_XI_<key>/`, poses in `out/worlds/XI/<key>_pose.png`, `out/worlds/XI/sheet.png`, `out/worlds/XI/sil.png`.

| Key | Name | Tier (bible scale) | Canvas | Seed | Flip |
|---|---|---|---|---|---|
| the_last_hour | The Last Hour | ruler (4, frame-cropped) | 1600 x 1600 | 1100 | no (see decision 1) |
| horologist | The Horologist | elite (1.9) | 1100 x 1400 | 1101 | yes |
| rime_colossus | Rime Colossus | elite (2.5) | 1100 x 1400 | 1102 | yes |
| stopped_pilgrim | Stopped Pilgrim | human (1.0) | 600 x 820 | 1103 | yes |
| clock_sentry | Clock Sentry | large (1.4) | 900 x 1100 | 1104 | yes |
| gear_spider | Gear Spider | small (0.6 wide) | 600 x 820 | 1105 | yes |
| aurora_moth | Aurora Moth | small (0.7 wingspan) | 600 x 820 | 1106 | yes |
| frozen_halberdier | Frozen Halberdier | human (1.05) | 600 x 820 | 1107 | yes |

Every figure sets `groundY` = canvas height minus 30 (checked in each rig.json: 1570, 1370, 1370, 790, 1070, 790, 790, 790).

## Decisions logged

1. **The Last Hour is not mirrored.** A mirrored clock shows reversed numerals and reads "one minute past" instead of
   "one minute to". It is drawn already facing left (face turned toward the heroes, the drum's thickness on the right)
   with `kit.base` (key light upper left) and `flip: false`. The light still comes from the upper left.
2. **No arcs on the Last Hour** (director's note): the bible's "arcing with aurora light" is shown as branching
   aurora-green Lichtenberg burns over the drum, bezel, sun disc, bob, bell, gears and the astronomer, plus fused beads
   and welds where the metal ran. `kit_XI.bolt` exists but no figure in this world calls it.
3. **Palette exceptions from the bible's own colour lines:** the Aurora Moth's "violet" is a cold blue-violet fringe
   (`#8088b8`) at the outer edge of the aurora bands, the dark end of the pale-blue range, never a saturated purple. The
   Gear Spider's "copper" is limited to red-brass coil springs. Everything else is brass, pale blue, aurora green, ink,
   bone and grey, plus the material library dulled toward grey (wool, leather, wood, iron, steel). No gold, no red.
4. **Windward side:** the cold comes off the heroes, so rime builds on the front edges facing them (drawing-right on the
   mirrored foes, the left side on the unmirrored ruler). Icicles are always drawn in screen space, so they hang plumb.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Last Hour | pass | fixed | pass | pass | pass | pass (decision 1) |
| The Horologist | fixed | pass | pass | pass | pass | pass |
| Rime Colossus | pass | pass | fixed | pass | pass | pass |
| Stopped Pilgrim | pass | pass | pass | pass | pass | pass |
| Clock Sentry | pass | fixed | fixed | pass | pass | pass |
| Gear Spider | n/a | pass | pass | pass | pass | pass |
| Aurora Moth | n/a | n/a | n/a | pass | pass | pass |
| Frozen Halberdier | pass | n/a | pass | pass | fixed | pass |

### Measurements behind the passes
- Every gripping fist goes through `B.grip`, `B.gripAngle` or `kit_XI.gauntletGrip`; the final renders print no
  `grip ... move the elbow` warning. Pilgrim staff: forearm meets the haft 24.5 degrees inside the limit. Horologist chain:
  30.7 degrees inside. Halberdier haft: the forearm rises forward from an elbow at the side, about 16 degrees off square.
  Sentry haft: forearm horizontal onto a vertical haft, square.
- Horologist gaze: eye to watch 27.4 degrees below horizontal, head axis 17.2 degrees: 10 degrees apart (limit 25). The
  watch shows us its engine-turned case back and a sliver of crystal on his side; its face is toward him.
- Pilgrim: head tipped back 30 degrees, gazing at the sky (no object to read). Weight: pelvis x 290 between the trailing
  toes (214) and the planted front foot (398), mid-step. Staff foot on the ground line.
- Halberdier: pelvis x 296 over the planted far ankle (292); that leg is straight, the near knee is lifted.
- Sentry: pelvis x 430 between ankles 372 and 504; the halberd butt stands on the ground line.
- Horologist: pelvis between the feet (450, 604), with the cane planted on the ground ahead (636).
- Colossus: mid-step off its plinth, mass between the plinth foot (360) and the forward foot (740). Its hunch is in the
  upper back (spine control point behind the line from neck to pelvis); the head sits on a neck rising from the shoulders.
- Gear Spider: the tweezer jaws touch the spare gear's rim top and bottom; seven tool tips are planted, the needle leg raised.
- Last Hour: the astrolabe hangs plumb, edge-on, back plate toward us (he is losing it, not reading it). The astronomer's
  far hand is clawed over a tooth of the wheel above him, and the cord runs from his fingers to the astrolabe's throne ring.

### What failed and how it was fixed
- **Clock Sentry 2/3:** the near forearm crossed the chest and hid the signature dial. Rebuilt: the halberd is now in the
  far hand ahead of the chest (forearm square to the vertical haft), and the near arm hangs at the side, so the dial is clear.
- **Rime Colossus 3:** the carved scroll ran along the hanging forearm (88 degrees off square, an impossible grip). It is
  now held across the fist, square to the forearm.
- **Horologist 1/2:** in the first layout the raised watch arm was the near arm and would have crossed his beard and jaw.
  The watch arm is now the far arm, behind the head in draw order, so the face and beard stay clear and the fist comes
  out ahead of the face.
- **Last Hour 2:** the second hand crossed the astronomer's face. It now stands at 47 seconds, pointing away from him.
- **Frozen Halberdier 5:** the halberd head ran off the top of the canvas. The shaft above the hand is shorter (330 px)
  and the head scaled to 0.9, so the whole head and its icicles sit inside the frame.

## Gate 2: style and detail

| Figure | Signature at 190 px | Frost / lightning marks, Never absent | Details (min) | Layers | Palette | Unique silhouette | Section 9 |
|---|---|---|---|---|---|---|---|
| The Last Hour | pass, with a note | pass (decision 2) | 22 (12) | pass | pass | pass | pass |
| The Horologist | pass | pass | 22 (10) | pass | pass | pass | pass |
| Rime Colossus | fixed | fixed | 16 (10) | fixed | pass | pass | pass |
| Stopped Pilgrim | pass | pass | 14 (6) | pass | fixed | pass | pass |
| Clock Sentry | fixed | pass | 14 (6) | pass | pass | pass | pass |
| Gear Spider | fixed | pass | 13 (6) | pass | pass (decision 3) | pass | pass |
| Aurora Moth | fixed | pass | 14 (6) | n/a (animal) | pass (decision 3) | pass | pass |
| Frozen Halberdier | pass | pass | 18 (6) | pass | pass | pass | pass |

### Detail inventories
- **Last Hour:** zodiac ring with twelve inked signs; hour ring with roman numerals and minute ticks; star ring with
  constellations; sun-and-moon volvelle face with shut lids; the Tooth (pointed central arbor); hour, minute and second
  hands; riveted bezel; the drum's edge; broken dial plates with shards; five wheels in the open train; chain and weight;
  pendulum with an engraved lenticular bob; chime bell and hammer on its clevis; fused beads and welds; aurora burns;
  rime and frost veil; icicles; broken glass on the floor; stone pedestal; the astronomer (robe with darned patch, star
  stole, belt and ink-horn, astrolabe on a cord, one shoe out of the teeth, burned neck, hair stopped mid-swing, open mouth).
- **Horologist:** armillary (five rings, degree ticks, sun, fused joins, post and frame); pocket watch (crown, bow,
  engine-turned back, crystal); chain; brass lens on a strap; quilted coif; frozen beard and moustache; star-chart stole;
  belt and buckle; dividers; quadrant with plumb bob; chained almanac; back harness and buckle; gears fused into elbow,
  wrist, neck and knee, with welds and burns; telescope cane with eyepiece and ferrule; three darned patches; stains;
  burned, holed hem; hanging sleeves with icicles.
- **Rime Colossus:** wind-up key with fused collar weld and riveted bows; clockwork behind clear ice (three wheels, an
  arbor); plinth with the founder's brass plaque; broken plinth chunks; carved star chart with ribbon ties; cord belt
  with knot and tails; carved hair grooves and beard curls; brass clasp; carved sandal straps; chisel marks; frost
  cracks; aurora fern cracks inside the ice; drapery cloak; sleeve band; icicles.
- **Stopped Pilgrim:** brass star badge (fused, burned); four lead tokens on the cape; gourd with stopper and cord; staff
  with ferrule and bindings; scrip with flap and stitching; rope strap; belt buckle; two darned patches; puttee wraps;
  shoe strap; turned-back cuff; aurora burn up the neck; frozen beard; filmed eyes.
- **Clock Sentry:** dial with action glyphs, two hands and riveted bezel; frosted, cracked glass; gate keys on a ring;
  fused knee weld; aurora burns; dents and scorch; hip gear hub; curved tasset lames; gorget; pauldron lames; sallet with
  sight slot and breaths; banded halberd.
- **Gear Spider:** movement plate and back plate with thickness; pillars; gear train; mainspring barrel; coil springs;
  six kinds of tool tip (needle, awl, driver, file, pliers, hook); loupe lens with knurled ring; tweezers holding a spare
  gear; fused knee weld; fused pillar screw; aurora burn; clevis joints.
- **Aurora Moth:** aurora curtains along the veins; blue-violet fringe; veins and costa; submarginal line; marginal
  fringe; camber lines; rime on the leading edges; icicles on wings, antennae and tail; frayed, scorched hind-wing edge
  with a burn; fur clumps; ice beads in the fur; faceted compound eye; palp; feathered antennae; folded, hooked legs.
- **Frozen Halberdier:** brass observatory badge; whistle on a cord; baldric with rivet; falchion with cross and chape;
  night lantern (cage, frosted glass, dead wick); belt buckle; quilting; burn holes; aurora burn down the back; stains;
  chest patch; kettle hat ridge and dent; fused brim rivets; chin strap; frozen moustache; scar; gloves; boot strap.

### Course marks
- Frost (dominant): rime crusts with wind feathers on every windward edge; icicles plumb from hems, brims, blades,
  sleeves, rings, bezels and wheels; faceted planes on frozen skin and ice; bodies stopped mid-motion (the pilgrim's step
  and lifted hand, cloak swung back and frozen; the halberdier's kicked skirt; the Horologist's swinging sleeves and
  jutting beard; the astronomer's hair; the moth at the top of a wingbeat). Never column: no clean crystals and no
  snowflakes anywhere; hoar frost is uneven specks and short feathers under a soft mask.
- Lightning: aurora-green Lichtenberg burns (scorched channel, green heart) on brass, skin, cloth and inside the ice;
  fused rivets, welds and re-set beads. Never column: no glowing outlines, no sci-fi arcs (no bolts drawn at all).

### Section 9 (Bloodborne adapted): which course did this, to whom, and does the bible say so?
- **Remnant of the former self:** pilgrim (staff, gourd, tokens, badge, scrip); halberdier (halberd, kettle hat, badge,
  watch lantern, whistle); Horologist (watch, lens, armillary, star stole, almanac, quadrant); Colossus (founder's
  plaque, carved star chart); Sentry (gate keys, halberd); spider (repair tools, spare gear); astronomer in the Last Hour
  (stole, astrolabe, ink-horn). The moth is the bible's animal.
- **One part pushed hard, and it is the course's mark:** frost stills a gesture (pilgrim's raised hand and lifted heel;
  halberdier's knee; Horologist's beard); lightning fuses brass into the Horologist's joints and the Colossus's key
  collar. Bodies stay at 6.4 heads and believable weight.
- **Outline broken the course's way:** icicles and rime on every lower and windward edge; the moth's hind wing frayed and
  scorched by lightning. No foe has a closed, untouched outline.
- **Rejected ideas kept out:** no beasts beyond the bible's moth and machines; no eye motif (the spider's round hinges
  read as eyes in the first pass and were replaced by hex-bolted clevises; jewel bearings that read as eyes were
  removed; the volvelle's eyes are shut, as the bible's "face" requires); no clergy (this bible has no church); no
  Victorian costume (pilgrim hat, kettle hat, scholar's coif and gown are period-appropriate).

### What failed and how it was fixed
- **Clock Sentry:** first pass was stacked cylinders, a box head and slab lames (the "boxy robot" fault). Rebuilt with
  plates shaped like the muscle under them (limb outlines with bulges, bevels, lit ridges, lame seams), curved lames that
  follow the hip, and a sallet head with a swept tail and pointed visor in one outline. The round visor hinge read as an
  eye and was removed.
- **Rime Colossus:** first pass read as a boxy snowman (slab torso, flat robe wall, bead curls, harsh navy shading).
  Rebuilt as one continuous robe outline falling over the stepping knee (split at the belt for the rig), chiselled
  troughs with lit ridges, a drapery cloak breaking the block of the back, a carved hair mass with grooves, carved (not
  glowing) eyes, a deeper ice tone, a cord belt in place of a slab belt, and sandal feet.
- **Gear Spider:** abdomen read as an egg; joints read as eyes. Now a cut movement plate with clipped corners and visible
  thickness, gears breaking its edge, and clevis joints.
- **Aurora Moth:** first pass was a pinwheel of petals with rainbow bands. Rebuilt with moth anatomy (triangular
  forewings with a straight costa, rounded hindwings, a heavy furred thorax and segmented abdomen), wings shaded lightly
  as thin membranes, and the aurora as curtain streaks along the veins.
- **Stopped Pilgrim:** tokens on the belt read as tunic buttons (moved to the cape as sewn lead tokens); the hat brim
  did not read as turned up (rebuilt); tube sleeve and thin legs (loose sleeve with a frozen sag and cuff; thicker calves
  with muscle bulges); a foggy rime blob on the cloak (the hoar helper now uses a soft radial mask).
- **Horologist:** bald crown read as a dome (scholar's quilted coif added, frozen hair streaming from under it); the
  moustache was a grey block (now strands); fists under-sized for an elite (enlarged); the skirt was a large flat dark
  area (folds, three darned patches, stains, a burned and holed hem).
- **Last Hour:** the astronomer was a capsule with tube arms and a hidden face. Rebuilt on a spine with a robe torso,
  patch, stole and belt, the great wheel biting over his hips, a jointed sleeve and open frozen hand, a grip on a tooth,
  and a full head with an open mouth, teeth, lifted furrowed brow and filmed eyes. The square stone frame behind the face
  made the silhouette a rectangle; it was removed and the face enlarged so it crops at the top of the frame.

## Rig and pose tests

| Figure | Bones | Attack pose (Motion line) | Result |
|---|---|---|---|
| The Last Hour | 23: case (root), dial, sunmoon, hand_hour, hand_min, hand_sec, gear_1..3, pendulum, hammer, bell, chain_l, chain_r, astronomer (child of gear_1), astro_head, both astronomer arms (3 bones each), astrolabe | chime: hammer swings onto the bell, wheels turn, pendulum swings | holds; the astronomer turns with the wheel he is caught in |
| The Horologist | 22: humanoid + watch, cane, armillary, stole, skirt, sleeve_f, beard | click: the watch thrust forward | holds |
| Rime Colossus | 18: humanoid + key, scroll, skirt (plinth on root) | slow fist: near arm swings over and down | holds |
| Stopped Pilgrim | 22: humanoid + staff, gourd, hat, cloak, cape, skirt, scrip | staff blow | holds |
| Clock Sentry | 20: humanoid + halberd, hand_hour, hand_min, keys, tasset | timed halberd blow, minute hand ticks | holds |
| Gear Spider | 19: body (root), head, mandibles, 8 legs x 2 | needle-leg strike | holds |
| Aurora Moth | 8: body (root), head, abdomen, four wings, legs | dazzling wing beat (near wings sweep down) | holds |
| Frozen Halberdier | 19: humanoid + halberd, skirt, lantern, sword | halberd hook: haft levelled off the shoulder | holds |

No `MISSING JOINTS` on any export.

## Still open
- **Last Hour silhouette:** at game size the face reads as a round disc with bell, chain, weight and pendulum; the hands
  near twelve are inside the mass and do not read in pure silhouette (they read in the colour render). An open skeleton
  dial would fix it at the cost of the bible's full frosted face.
- **Rime Colossus height:** to keep a 2.5 figure's head inside the 1400 px elite canvas it lumbers forward off its
  plinth, so its posed height is close to the Horologist's (its bulk is much greater). If elites may break the canvas top,
  it could be drawn upright.
- **Wind-up keys** (Sentry has none; Colossus `key`): turning a key on its own axis in 2D is a squash, not a rotation;
  the rig's `key` bone only rotates in the picture plane.
- **IK:** the Last Hour astronomer's far hand is clawed over a tooth of the wheel above while he is parented to gear_1;
  when the wheels turn in opposite directions that hand must be driven by IK (or detached). The halberdier's hook would be
  two-handed in life; it is drawn one-handed, so a two-handed hook animation needs the far arm solved onto the haft.
- The frost veil over the lower dial is subtle at sheet size.

## Independent review (2026-11-23)

The reviewer judged the batch from scratch: the director's notes on `out/worlds/XI/sheet.png`, then every figure was rendered on its own, composited on mid grey, zoomed 1.2x to 2.2x on heads, hands, held objects and feet, and checked at sheet size and game size (190 px human). Four figures were rebuilt or changed. Each changed figure was re-rendered and its rig re-exported (no `MISSING JOINTS`; `groundY` = canvas h - 30 in every rig.json: 1570, 1370, 790, 790, 1070). Its attack pose was re-run into `out/worlds/XI/<key>_pose.png` and checked. `sheet.png` and `sil.png` were rebuilt with the maker's script.

### Decisions logged in this review
5. **Rime Colossus material.** The director wants a carved stone statue; the bible (not editable) says an ice statue in "clear blue ice". It is now built with a sculptor's conventions (carved anatomy, drapery, chiselled folds, chips, weathering streaks). The material is dense, opaque blue-grey ice that reads like marble. The plinth is real grey stone, and the clear ice survives only as the chest window over the clockwork. If the director wants it to be literally stone, only the palette changes: swap `IC()` to a stone grey and keep the rime.
6. **Rime Colossus height.** It is upright, stepping down off its plinth, with heroic proportions (head 215 px). The trailing foot is on the plinth top and the leading foot on the floor. Its head top is at about y 15, so it stays inside the elite canvas, and the stride and step-down take up the extra height. It stands about 100 px over the Horologist's head and is much broader.
7. **Last Hour "sun-and-moon dial like a face".** No painted face. The sun (an engraved boss in a crown of wedge rays) and the moon (a silver sphere, waning, with engraved maria) sit either side of the Tooth. The clock reads as a face only through that arrangement. Neither disc has eyes, so the eye motif stays out of this non-void world.

### Gate 1: logic audit (independent)

| Figure | Item | Result | Fix |
|---|---|---|---|
| Rime Colossus | 1 Head/spine | fail, then fixed | The old lumbering hunch put the head ahead of a slab torso. Now upright: the neck rises from the shoulders, the head sits over the neck base, and the beard falls plumb on the chest. |
| Rime Colossus | 2 Object | pass | The charter is a closed scroll held upright, so nothing is being read. |
| Rime Colossus | 3 Grips | fail, then fixed | The scroll fist went through `B.grip` with the scroll square to a horizontal forearm (no warning). The near "fist" was `B.fist` closed on an empty haft, so its fingers pointed down like an open mitten. It is now a carved closed fist (`carvedFist`): back of the hand, knuckle row, curled fingers, and the thumb across the front, following the forearm. |
| Rime Colossus | 4 Weight | pass | The pelvis (600) sits between the plinth foot (390, raised 180 px) and the floor foot (800), mid-step down. The leading leg takes the weight. |
| Rime Colossus | 5 Contact | pass | The trailing sole is on the plinth top with rime binding it. The mantle drape over the near shoulder is on the torso bone. The key collar is welded into the back. |
| Rime Colossus | 6 Facing/light | pass | Drawn facing right with foeBase and flipped. Rime is on the front and top faces. |
| The Last Hour | 5 Contact (rig) | fail, then fixed | The `hammer` joint was at [1420,250] while the lever's hinge is drawn at [1330,330], so in the chime the lever swung about empty air. The joint has been moved to the hinge, and in the pose the hammer head now lands on the bell's rim. |
| The Last Hour | 1-4, 6 | pass | Unchanged. The astronomer's far hand is still on a tooth; the IK note stands. |
| Aurora Moth | 4/5 Attachment | pass | All four wings hinge at the thorax and the thorax fur is drawn over the wing roots. The abdomen lies between the hindwings (dorsal order). The wing beat holds. |
| Gear Spider | 4 Weight | pass | Knees were lowered by 15 to 30 px and the tips splayed wider. Seven tool tips are planted, and the needle leg strikes down in the pose. |
| Clock Sentry, Horologist, Pilgrim, Halberdier | 1-6 | pass | Re-checked on zooms; the maker's measurements hold. The halberdier's sloped haft passes beside his hat brim, not across his face. |

### Gate 2: style and detail (independent)

| Figure | Item | Result | Fix |
|---|---|---|---|
| Rime Colossus | Signature / Section 8 (soft snowman: lumpy rounded mass, cylinder arms, tube scroll, cartoon face) | fail, then fixed | Full rebuild, described below. |
| Rime Colossus | Details (10) | pass, 24 | Wind-up key with welded collar, rivets and dents; chest window with three wheels and an arbor behind faceted clear ice with a fractured lip; mantle with a twisted roll and a zigzag cascade; tunic with stepped neckline, chevron hem border and catenary folds; carved sandals with straps, thong and separate toes; charter with rolled spiral ends, ribbon tie, knot and hanging seal cut with the founder's star; carved beard of drilled spiral locks; moustache; hair waves; heavy-lidded blank eyes; nose chipped at the tip; carved fist; deep sleeve; chips on every edge (12); cracks; weathering runs; aurora fern cracks in the ice; plinth with cornice, plaque and burn, broken corner and rubble; icicles; rime. |
| The Last Hour | Dial flat, cartoon moon face | fail, then fixed | The bezel now has thickness and two mouldings. The dial is set back 40 px, so the bezel's inner wall shows as a crescent on the left. The drum's side is a real cylinder band with panel seams and rivets. The rings are stepped plates, each casting a shadow crescent and showing a lit wall. Over the face is glass, star-cracked from a blow at ten o'clock, glinting, broken out over the train, with shards left in the bezel. The cartoon face is replaced by the engraved sun and moon (decision 7) and an engraved 30-day moon-age band. |
| The Last Hour | Course marks on the brass | fail, then fixed | Added burns on the bezel at 9:30 and 1:30 and two large ones on the drum, fused rivets re-set at three points on the bezel, fused beads on the drum, dents, and rime and icicles on the drum. |
| The Last Hour | Astronomer reads at sheet size | fail, then fixed | He was a dark robe against a dark hole. There is now a frosted, lit brass back plate of the movement (with pillar bolts) behind him, his robe is lighter, and he wears the college's pale blue hood thrown back and rimed. |
| The Last Hour | Details (12) | pass, 30+ | The maker's list plus bezel mouldings, inner wall, drum panels, cracked glass and shards, back plate and bolts, engraved sun, moon with maria and craters, moon-age band, and hood. |
| Aurora Moth | Flat, symmetric cartoon butterfly | fail, then fixed | Full rebuild, described below. |
| Aurora Moth | Eye motif | fail, then fixed | The first rebuild's scorched hole in the hindwing read as an eyespot. It is now a torn notch in the margin with a scorched lip and a branching burn. The discal mark is a crescent, not a spot. |
| Aurora Moth | Details (6) | pass, 14 | Scale texture; veins; antemedial and postmedial lines; discal crescent; checkered fringe; faint aurora scale colour; rime on the costae; icicles; three torn margins; scorch and burn; tufted thorax; patagia collar; furred abdomen with tail tuft; feathered antennae with ice beads; furred legs with claws. |
| Gear Spider | Legs as thin sticks at sheet size | fail, then fixed | The segments are now about 50% thicker (femur 40/30 px, tibia 30/20 px). Each femur has three flanges, a riveted hex bracket at the coxa, larger clevis joints and an iron chuck holding the tool. The knees are lower and the tips wider. At sheet size the legs read as jointed brass limbs. |
| Clock Sentry | Eye motif / glowing outline | fail, then fixed | An aurora-green dot inside the sallet's sight slot read as a glowing eye. It was removed; the slot is dark with a worn lip. |
| All eight | Unique silhouette (sil.png) | pass | The moth now reads as a moth (swept delta, feathered antennae) and the Colossus as a robed statue with a scroll and key bows. |
| All eight | Palette | pass | No gold or red was added. The moth's violet is the cold blue-violet of decision 3, now a soft scale tint. The Colossus is ice blue-grey and stone grey with brass. |

### What was rebuilt
- **Rime Colossus.** A sculptor's statue in heroic proportion, stepping down off a grey stone plinth (moulded cornice, brass plaque with a burn, broken front corner, rubble).
  - Tunic: one carved outline from neck to hem, with chest forward, waist in and the stepping knee pushing through as a lit plane. Tube folds fall from the knee and tension folds drag back to the seat. The cloth hangs in catenary folds between the legs, with an incised chevron border at the hem.
  - Mantle: over the near shoulder and round the back, with a thick twisted roll across the body to the far hip and a zigzag cascade. Its hem runs diagonally with icicles. The drape over the shoulder is on the torso bone.
  - Folds: cut with a new `kit_XI.trough()`, which draws a dark valley, an ink core, a lit ridge and a far-side shade.
  - Head: B.head with no painted eyes. It has heavy lids over smooth blank eyeballs, a brow cut, a nasolabial cut and a chipped nose. The beard is two rows of locks ending in drilled spirals (new `kit_XI.lock()`), and the hair is in carved waves.
  - Hands: the far hand is closed round an upright charter, and the near hand is a carved closed fist.
  - Surface: chips (new `kit_XI.chip()`), weathering runs (`kit_XI.streaks()`), cracks and aurora fern cracks inside the ice. Rime sits on the front and top faces, with icicles plumb from every lower edge.
- **Aurora Moth.** Seen three-quarter from above and in front, wings swept back in a moth's delta. The near pair is larger; the far pair is raised behind and foreshortened. Narrow triangular forewings with a straight costa, small rounded hindwings, and a scale-tile texture. The aurora is only a blurred green and blue-violet colouring along the postmedial band. The thorax and abdomen have tufted outlines that break the silhouette, the antennae are bipectinate, and the head is small and sunk in the fur.
- **The Last Hour** and **Gear Spider**: see the table.

### Rig and pose (changed figures)
| Figure | Bones | Pose (`out/worlds/XI/<key>_pose.png`) | Result |
|---|---|---|---|
| Rime Colossus | 18 (humanoid + key, scroll, skirt) | slow fist: `upperarm_n 92, forearm_n 28, hand_n 10, torso -6, head -3, key 30`. The fist rises forward to head height, ready to come down. | Holds. The mantle drape stays on the shoulder. A small step shows at the waist cut on the back edge when the torso leans 6 degrees. |
| The Last Hour | 23 | chime: `hammer 14, gear_1 8, gear_2 -6, gear_3 10, pendulum 6, hand_sec 6` | Holds, and the hammer meets the bell rim (after the joint fix). |
| Aurora Moth | 8 | wing beat: `wing_fn 22, wing_hn 16, wing_ff -16, wing_hf -10, body -4, head 4, abdomen 6` | Holds. The roots stay under the fur. |
| Gear Spider | 19 | needle strike: `leg_n1_1 -22, leg_n1_2 -28, body -3, head -4, mandibles 8` | Holds. |
| Clock Sentry | 20 | timed blow: `upperarm_f -20, forearm_f -30, halberd -55, torso -4, hand_min 30` | Holds. The haft levels, with the blade forward and low. |

### Still open after the independent review
- Colossus material (decision 5) needs the director's call: ice carved like stone, or literal stone.
- Last Hour silhouette: the hands near twelve still do not read in pure black. This is the maker's open item; the rest of the face reads in colour at sheet size.
- At sheet size the Colossus's chest window is the most saturated area on it. The near arm is slimmer than the robe mass would suggest for a 2.5 statue. Both are acceptable, but an artist pass could widen the near forearm.
- The moth's fur tufts are a regular sawtooth at 2x zoom; at game size they read as fur.

## Lore changes 2026-11-23

Eye-audit ruling (coordinator): the Gear Spider loses its lens eye. In `worlds/world_XI.js` the jeweller's loupe on the
thorax is replaced by a mechanism-front: a squared, riveted brass case on the front facet with a glazed window showing a
stopped escapement. The escape wheel sits low in one corner, cut off by the case edge, the anchor pallet is locked in
its teeth with its arbor high in the other corner, and a loop of hairspring shows. A pale crystal cover, frosted at the
top, is cracked across. Nothing round and dark sits at the centre. Bible line updated (bible/world_XI_stilled_spire.md,
Gear Spider, Body).

| Gate | Item | Result | Note |
|---|---|---|---|
| 1 Logic | 1-6 | pass | The case is riveted to the thorax facet; the raised needle leg still passes in front of it, as before |
| 2 Style | Eye motif | fixed | No lens, no pupil; at sheet and game size the front reads as a small glazed brass box |
| 2 Style | Course marks | pass | Frost on the crystal (frost stills: a stopped escapement), the cracked glass; the lightning marks elsewhere unchanged |
| 2 Style | Detail count (6), palette | pass | Case, rivets, wheel, pallet, hairspring, crack and frost replace the loupe; brass, steel, frost |
| Rig | 19 bones / 21 layers | pass | Re-exported, no `MISSING JOINTS`; `out/worlds/XI/gear_spider_pose.png`: needle strike (leg_n1_1 -22, leg_n1_2 -28, body -3, head -4, mandibles 8): holds |

`out/worlds/XI/sheet.png` and `sil.png` rebuilt with the reviewer's composer (scratch `rvXI/sheet.py`, unchanged).
