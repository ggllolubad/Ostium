# World VIII, The Sundered Rime (Fire + Frost): review

Figures (seed 800 + bible order): The Riven Jarl (800, ruler 3.5), Jotun Thane (801, elite 2.5), Twinflame Seeress
(802, elite 1.9), Rimeburnt Thrall (803, human 1.0), Magma Hound (804, large, 1.2 long), Obsidian Shieldmaiden (805,
human 1.05), Steam Wraith (806, human 1.1), Fissure Worm (807, large 1.6). File: `worlds/world_VIII.js`, helpers in
`worlds/kit_VIII.js`. Every figure is built facing right with `kit.foeBase` (light [0.6, -0.8]) and `flip: true`, on
`kit.TIERS` canvases with groundY = h - 30.

Method: each figure was rendered, composited on a mid-dark ground and checked at 1x and at 1.5x to 2.5x zooms of the
head, hands, held objects and feet. Angles were measured from the code. Every `B.grip` renders with its warning on, and
none fires. Each figure has a `render_rig.js` export with no MISSING JOINTS and an attack pose test in
`out/worlds/VIII/<key>_pose.png`. The sheet is `out/worlds/VIII/sheet.png` and the silhouettes are
`out/worlds/VIII/sil.png` (190 px per human, true relative scale, one ground line).

## The split, per creature (the bible's world rule)

Every body is split: one side rimed white, the other charred with glowing orange seams, the line between them cracking
(`V.thermal`: the part is drawn in an ice look on one side of a jagged line and a char look on the other, then `V.rift`
draws the cracking seam). The line falls in a different place on each figure:

| Figure | Where the split falls |
|---|---|
| Riven Jarl | left / right, exactly down the middle: nose, beard, breastbone, groin, and on through the throne and the dais |
| Jotun Thane | diagonal: the frozen back, shoulders, head and beard above; the heat from the floor blistering the belly and legs below |
| Twinflame Seeress | the head front / back (a burning face looks ahead, a frozen face looks back); the robe on a diagonal running the other way |
| Rimeburnt Thrall | front / back along every part: front burned, back rimed (the bible's entry) |
| Magma Hound | top / bottom: frost forming along the back as the rock cools, molten below the line of the flank and at the jaws |
| Obsidian Shieldmaiden | per limb: the shield arm, shield and leading leg rimed; the spear arm and back leg charred; a jagged crack down the breastplate |
| Steam Wraith | inside / outside: the hot coal at the breastbone; the outside condensing into a cracked rime shell on the shoulders, skull and hands |
| Fissure Worm | along its length: the reared head end rimed; the body still in the crack seared and glowing |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: one spine, jaw on a hinge), 2 objects face their user and gaze,
3 grips and hands, 4 weight and balance, 5 contact and attachment (and plumb hang), 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Riven Jarl | pass | n/a | fixed | pass | fixed | pass |
| Jotun Thane | fixed | n/a | pass | pass | pass | pass |
| Twinflame Seeress | pass | pass | pass | pass | fixed | fixed |
| Rimeburnt Thrall | pass | n/a | pass | pass | fixed | pass |
| Magma Hound | pass | n/a | n/a | fixed | fixed | pass |
| Obsidian Shieldmaiden | pass | pass | fixed | pass | fixed | pass |
| Steam Wraith | pass | n/a | n/a (open claws) | pass (floats on its column) | pass | pass |
| Fissure Worm | pass | n/a | n/a | pass | pass | pass |

### Measurements behind the passes
- Jarl 1: the skull centre is on the split line, 2 px from the neck base's x. 3: the axe is gripped with `B.grip`. The
  forearm (elbow [1296,904] to fist [1124,784]) meets the haft 14 degrees off square, and the haft passes over the top
  of the far shoulder at x 1190. The Tooth sits in the pommel below the fist.
- Thane 1: the neck comes forward out of the front of the hump. The skull centre is 106 px ahead of the neck base, with
  a head of 270 px (0.39 of a head). The hunch is in the hump and the spine curve, not in a slid-forward head.
  3: the club is an inline grip (it is held like a sword grip, bend -0.45). The other fist is clenched and holds nothing.
  4: wide stance with bent knees; the club head rests on the floor.
- Seeress 3: both staves go through their fists along the knuckle row; the forearms meet the vertical staves 18 and 10
  degrees off square. 2: both faces look along the head's axis, level, one ahead and one behind.
- Thrall 3: the pick fist uses `B.grip`; the forearm meets the haft about 18 degrees off square. The haft rests on the
  near shoulder. 4: the back leg is straight and carries the weight; the front knee is bent mid-trudge.
- Shieldmaiden 2: the shield's face is turned to the enemy, and its back edge shows on her side. Her eyes sit above the
  shield rim. 4: in the lunge the front knee is over the front foot and the back leg is straight.
- Hound 1: spine_1, spine_2, neck, head and jaw form one chain. The jaw opens on its hinge in the pose test. 4: four
  paws on the ground, the rump over the hind feet, the chest over the forefeet.
- Worm 1: the eight segments and the head follow one spline spine. Each segment's curved lip overlaps the one below,
  so nothing opens in the plunge pose. 4: the base sits in the crack.
- Wraith 4: it rises from a steam column rooted in a glowing crack. Hair, steam and drips go plumb or upward in screen
  space.

### What failed and how it was fixed
- Jarl 3/5: the frozen near hand read as an open mitten floating by the belt. It is now a fist that follows the
  forearm and rests on the belt, with the thumb hooked over the belt's edge. 5: before the figure was broadened, the
  haft hung off a shoulder too narrow to carry it. The shoulders were widened (474 to 1176), and the haft now rests on
  the far shoulder.
- Thane 1: the first build had a box torso and a neck that did not leave the body. The hump, chest and belly are now
  one sculpted outline, and the neck comes forward out of the hump.
- Seeress 5: the belt read as a flat disc round the robe. It is now a hard-cornered band with a knot and hanging ends.
  The rune band at the hem stuck out past the robe; it is now clipped to the robe. 6: the back face is drawn mirrored,
  so its light was mirrored with it. The light vector is mirrored while that face is drawn, so after the mirror it is
  lit from the same side as everything else.
- Thrall 5: the rope coil on his back read as a white shield. It is now smaller, darker, and slung from the torso.
- Hound 4/5: the paws floated below the lower legs, and the legs stood like table posts. Each leg is now upper,
  lower, and a pastern into the paw, with overlaps at the wrist and hock. The near upper legs are drawn behind the
  body, so the thigh and upper arm come out from under the flank.
- Shieldmaiden 3: the shield arm had no hand, only a joint. A fist is now drawn on its grip bar behind the boss (hidden
  in the rest pose, there for the rig). 5: the helm's brow band stuck out like a brim, and the nasal floated ahead of
  the face. The band now follows the rim, and the nasal sits over the bridge of the nose.

## Gate 2: style and detail (GUIDE.md, bible entry)

| Figure | Signature at 190 px | Course marks, "Never" absent | Grit count | Palette | Layers / volume / face |
|---|---|---|---|---|---|
| Riven Jarl | pass (helm with one horn, shouldered axe, split figure) | pass | pass, 30+ | pass | fixed |
| Jotun Thane | pass (hunched giant, ice club) | pass | pass, 20 | pass | fixed |
| Twinflame Seeress | pass (two-faced head, two staves) | pass | pass, 25 | pass | fixed |
| Rimeburnt Thrall | pass (pick on the shoulder, hood) | fixed | pass, 18 | pass | fixed |
| Magma Hound | pass (lean hound, glowing jaws) | fixed | pass, 15 | pass | fixed |
| Obsidian Shieldmaiden | pass (round glass shield) | pass | pass, 20+ | pass (red only in her cuts) | fixed |
| Steam Wraith | pass (rising column, reaching hands) | fixed | pass, 12 | pass | fixed |
| Fissure Worm | pass (reared worm, ring mouth) | fixed | pass, 15 | pass | fixed |

No two foes share a silhouette (see `sil.png`). Fire marks: split skin with glowing seams, charred edges, flakes, ash
curling up. Frost marks: rime crust with feathers leaning into the wind, icicles hanging plumb, faceted planes, frost
cracks, figures frozen mid-gesture. There are no flames on heads (the only open heat is a coal held in an iron fork on
the Seeress's staff). There are no clean crystals or snowflakes: rime is uneven specks and feathers, and the ice teeth
and slabs are dirty, cracked shards. Palette: ice white, orange seams, black obsidian, plus ink, bone and grey, with the
shared material library (leather, fur, wool, iron, mail) dulled toward grey. There is no gold anywhere; the Tooth is
pale stone in an iron setting. Faces use faceShade 0.78 to 0.85.

Grit (examples). Jarl: melted horn dribbling down the helm, rimed horn with icicles, rivets, comb, two different eyes,
an icicled beard and burned stubble, bared teeth, iron brooches and chain, a chain of office with a hammer pendant, mail
hem rows, buckle, a seax with a bone grip, arm rings, a ring on a burned finger, a nicked bearded blade, the Tooth in a
claw setting, runes and knotwork on the throne, ice spires, burn holes in the cloak, ash, steam. Thane: glacier slabs and
stones on his back, blisters (some burst), a broken manacle with a sprung chain, a shaggy mammoth-hide kilt, a rope belt
with an ivory toggle, a miner's helmet and finger bones as trophies, beard ropes ending in icicles, a frozen mane, burst
vessels in the eye, a pick and stones frozen in the club, a hide grip, meltwater, steam. Seeress: rune stitching, a rune
band and fur trim on the hem, a darn and a stitched rent, scorch holes, a bear-tooth necklace, a braid crown with bone
pins, a parting braid, a frozen tear, rimed lashes, icicles off nose and chin, a bag of rune bones, bone charms, the
antler-and-holed-stone frost staff, the iron fork and coal fire staff. Thrall: hood stitching, a rimed rope coil, jerkin
lacing, a patch, iron wedges, an ore pouch, a dead lamp with frosted glass, strapped knee pads, leg wraps, crampons, a
pick that glows at the point and is iced at the back.

### Style fails found and fixed (each re-rendered and re-checked)
- Thrall: the rift glowed down every limb like racing stripes. Limbs now use a faint rift: a dark crack with a frost lip
  that glows only where it has opened. The rime was too bright and noisy; its opacity is down and the mix is less white.
  The knee pads were round balls; they are now shaped leather pads with straps and a buckle. A grin of teeth read as a
  smile; the mouth is now slack with one tooth.
- Shieldmaiden: the helm read as a bowler hat. The shield's radial wedges read as a wagon wheel; it now has two rings of
  irregular, jittered shards. The glass "chip" read as a ball; it is now a small, faint bite.
- Wraith: the column read as a cocoon or sleeping bag. It is now a blurred body of steam with twisting ribbons and curl
  lines. The body read as stone; it now has no crosshatch, thinner ink, a steam halo, wisps that break the outline, and
  a dissolve band into the column. The rime shell read as a helmet; it now covers only the back of the skull and the
  shoulders. The core read as an orange vest; it is now a small coal with cracks.
- Hound: the head read as a crocodile. It now has a stop, a lip line, a few canines, a beard and folded ears. The frost
  edge along the flank read as cake icing; the rime lip is thinner and the line straighter.
- Worm: the per-segment shadows made stripes; there is now one shading band along the whole body. The ring folds read
  as straps; they are now curved, overlapping segment lips with finer annuli between them. The orange throat read as an
  eye's iris; it is now a dim glow deep in the gullet, with folds.
- Seeress: the crown of braids read as a hat; it is now a plaited band over grey hair, plus a parting braid hanging
  between the two faces. Side braids hung across both faces like bars; they were removed. The robe was a flat area; it
  now has a hem band, fur trim, a darn, a rent, scorch holes and deeper folds.
- Thane: the first build was a refrigerator box with tube arms and a cartoon face (white brows, a blush disc, big eyes).
  The hump, chest and belly were sculpted. The arms got deltoid, bicep and forearm mass. The face was reworked:
  narrowed eyes, furrows, frost in the creases, frozen hair falling back, a moustache, and uneven beard ropes. The
  shading band was raised (maxShade 150) so the big forms turn. The back spikes became chunkier glacier slabs.
- Jarl: the first build was too narrow for a ruler. The throne slabs filled the canvas, so his silhouette was a
  rectangle; the throne now opens into low jagged spires beside his head, so the helm, horn and axe stand clear.

## Rig and pose tests

| Figure | Bones | Layers | Pose test (attack) | Result |
|---|---|---|---|---|
| Riven Jarl | 16: throne (root), pelvis, torso, head, cloak, arms, axe, thighs/shins | 19 | axe blow (far arm swung down and across) | pass |
| Jotun Thane | 19: standard + club, kilt, beard, chain | 23 | club raised overhead | pass; the club leaves the top of the frame (expected at this scale) |
| Twinflame Seeress | 20: standard + staff_fire, staff_frost, mantle, skirt, charms | 27 | twin bolts (both staves thrust out) | pass |
| Rimeburnt Thrall | 17: standard + pick, rope | 22 | pick wind-up | pass; the raised haft crosses the hood (needs a z-order override for that frame) |
| Magma Hound | 18: spine_1 (root), spine_2, neck, head, jaw, tail, four legs x 3 | 21 | burning bite (head up, jaw open, forelegs reaching) | pass |
| Obsidian Shieldmaiden | 19: standard + shield, spear, braids, skirt | 25 | spear thrust | pass |
| Steam Wraith | 13: column (root), pelvis, torso, head, arms, wisp_1..3 | 14 | scalding embrace (lean in, arms closing) | pass |
| Fissure Worm | 10: crack (root), seg_1..8, head | 19 | plunge and bite | pass |

## Still open
- The Jarl's mail torso is still the plainest large area on him. It has added form shading, chest and belly folds, a
  chain of office and the glowing rift, but it reads flatter than the reference figures.
- The Thane's hump is still one smooth mass, and the near upper arm merges with it in value. The glacier slabs break the
  silhouette, but the hump itself could take more anatomy.
- The worm's body is still a little pipe-like. The segments overlap and bulge, but there is no peristaltic squeeze.
- The Seeress stands upright between her staves rather than mid-stride; the posture reads "old seeress" but not
  "crossing ice".
- Hound legs are anatomical in outline but stiff in the rest pose.
- Shared-file notes: none were edited. Helpers were copied into `kit_VIII.js` from kit_IV (fire seams, glow, crack
  nets, ash, flakes, rig cuts, IK, splines) and kit_I_a (tube). The thermal split, rime crust, icicles, facets, frost
  cracks, glass plates and the claw hand are new.

## Independent review (2026-11-23)

Reviewer, not the maker. Each figure was re-rendered on its own, composited on a mid-dark ground, and checked at 1x, at
1.1x to 2x zooms of the head, hands, held objects and feet, and at sheet size. The director's six faults were taken
first. The whole cast was then re-audited against both gates. Every `B.grip` renders with its warning on, and none fires.
Every rig was re-exported (`render_rig.js`): there are no MISSING JOINTS, and every rig.json has ground = canvas h - 30.
Each changed figure's attack pose test was re-run and looked at. `sheet.png` and `sil.png` were rebuilt with the maker's
composer and the same layout.

### Director's faults and what was done

1. **Riven Jarl: under the ruler bar, a ruler-straight split, a boxy body.** Rebuilt from scratch.
   - **Pose and view.** He sits in the throne in a three-quarter front view. Both forearms lie on the throne arms. The
     far fist grips the axe haft at the end of the arm; the haft leans back onto the far shoulder, and its butt (the
     Tooth in a claw setting) stands on the dais. The near hand (`B.hand`) is spread over the carved scroll end of its
     arm, with knuckles, nails, iron rings, rime and icicles on the fingertips.
   - **Body.** Heavy trapezius and shoulders. A deep chest with a shadow under the breast. A gut that rolls over the
     belt, so the belt only shows at the sides; the buckle sits off-centre. A knee-length byrnie drapes over the thighs
     with tension folds and a deep fold between them. Heavy knees, and shins in linen wraps cross-gartered with thongs.
   - **Arms.** Muscled upper arms in mail sleeves, with the elbow point showing, arm rings and leather bracers. Thick
     bare forearms with an ice skin on one and a char skin on the other.
   - **Fur.** A lumpy fur mantle lies on the shoulders, hangs in locks along its edge, and is pinned by two brooches;
     the chain of office sags between them.
   - **The split** is now one jagged crack that wanders across the forms:
     - It comes off the crown of a lowered spangenhelm, passes between the eyes, crosses the nose bridge off-centre,
       splits the mouth (frozen set on the near side, a burned snarl on the far side), and runs down the beard.
     - It forks over the breastbone. A rime tongue creeps over onto the burned breast; a char tongue reaches into the
       frozen belly.
     - Glowing seams lick off it into the ice (crack nets from the line), and rime patches creep onto the burned side
       on the breast, the belly, the lap, the forearm and the helm.
     - It crosses the lap onto the inner near knee. Steam rises along it.
   - **The throne** no longer shares his line. It is one block of glacier ice, blackened from below on the far side
     (a soft soot gradient plus a crack field), so the image no longer reads as two halves pasted together. The dais
     has its own fissure, opening under the axe.
   - **Details.** More than 30 at sheet scale.
2. **Jotun Thane: the hump was an egg-shaped sack.** The torso outline was rebuilt and the back pulled in by about 60 px.
   - **The hunch is now the body.** The trapezius climbs from the neck to a crest behind the head. A raised shoulder
     blade carries its spine ridge and a shadowed medial border. There is a spine furrow and a lat edge.
   - **Shoulder.** A trapezius piece is drawn on the torso bone over the cap of the arm, so neck, hunch and deltoid are
     one mass. It has an ink line only on its top edge.
   - **Outline and frost.** A frozen bear pelt hangs over the back edge, so the outline breaks into shaggy locks, with
     claws at its paw. Smaller glacier slabs and frozen stones sit on the crest, with frost crust and icicles.
   - **The near upper arm** is separated from the hunch by a darker, bluer arm skin and a soft shadow the arm throws on
     the body.
3. **Fissure Worm: a segmented pipe with an eye for a mouth.** Rebuilt.
   - **Body.** It is now one muscular tube: a 290 px trunk with a heavy collar where it leaves the crack (three glowing
     creases), tapering toward the head, with a bunched band and a contracted band (peristalsis).
   - **Annuli.** The rings are spaced irregularly with jitter. They are deep, full creases with a pale lip where the body
     bunches (inside the bends, in the bunched band, at the collar), and faint partial marks where it is drawn out. The
     edge is scalloped between creases, more deeply on the inside of a bend.
   - **Ink.** The segment parts carry no ink of their own (that was what drew the pipe rings). One ink edge runs the
     whole length, heavier on the shadow side.
   - **Surface.** Wet-sheen streaks on the seared trunk. Pits and grit. Frost crust and icicles on the head end.
   - **Mouth.** A lamprey disc seen at an angle: a wobbled fleshy rim with papillae, and a pale flesh face with furrows
     and 13 radial rows of hooked ice teeth pointing in. The throat is a small puckered gullet set off-centre toward the
     far side, with a dim glow and a rasping tongue. There is no concentric ring and no bright centre, so it does not
     read as an eye.
   - **Split.** An oblique jagged crack with a rime tongue down one flank and a hot seam up the other.
4. **Magma Hound: table-post legs, a plank body, a crocodile head.** Rebuilt.
   - **Body.** A deep chest down to the elbows. A loin arched over a waist tucked about 90 px. Ribs as stone ridges, the
     shoulder blade laid back, a haunch muscle. The stance is low: head under the back line, near fore paw set ahead,
     hindquarters loaded.
   - **Legs.** Each leg is three rounded, muscled segments: upper arm with triceps, elbow point, lean forearm, wrist
     knob, sloped pastern; thigh with hamstrings and quadriceps, a forward stifle, gaskin with the calf high, hock
     point. The paws bear weight: a heel pad, three splayed knuckled toes with glass claws, a stopper pad.
   - **Head.** A domed skull with a brow and a clear stop, a shorter muzzle with flews, a jaw dropped 0.2 rad on its
     hinge showing a molten gape, and rose ears.
   - **Split.** The straight flank line is now a wandering crack.
5. **Twinflame Seeress: rigid and symmetric between two staves.** Re-posed.
   - **The lean.** She leans her weight on the fire staff, which is planted ahead and slants back to her hand, with her
     arm braced on it. Shoulders and head are carried forward over it.
   - **Legs and hips.** The back leg is straight and the front knee bent. The knee pushes the robe out, with folds
     dragged off it and straight folds off the standing leg. The belt drops 0.1 rad toward the slack front hip.
   - **The frost staff** is carried loose, tilted back, with its butt 74 px off the ice.
   - **Grips.** Both grips now aim at the real staff angles.
   - **The head split** between the two faces is now a jagged line with forks.
6. **Every split is a crack and falls in a different place.**
   - The Thrall's limb splits read as straight racing stripes at amp 3. They are now amp 9, step 9.
   - The Hound, Worm, Jarl and Seeress head lines were made jagged and wandering as above.
   - The Shieldmaiden's breastplate crack and the Wraith's cracked shell already passed.
   - Placement per figure:

     | Figure | Where the split falls |
     |---|---|
     | Jarl | a wandering near/far crack with tongues and forks |
     | Thane | a diagonal |
     | Seeress | the faces front/back, the robe on a diagonal with tongues |
     | Thrall | front/back along each part |
     | Hound | top/bottom, wandering |
     | Shieldmaiden | per limb, with a cracked breastplate |
     | Wraith | inside/outside |
     | Worm | along the length, oblique |

### Gate 1 (independent): logic audit

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| Riven Jarl | pass | n/a | fixed | fixed | fixed | pass | 3: the far fist (`B.grip`) is now on a level forearm, about 14 deg off square, with no warning; the near hand is spread over the throne arm's end instead of a mitten floating at the belt. 4: he now sits on the throne (before, he stood on nothing behind a dais lip). 5: the haft rests on the far shoulder's mantle and its butt stands on the dais; the haft clears the face by about 120 px. |
| Jotun Thane | fixed | n/a | pass | pass | pass | pass | 1: the hunch was an egg behind a head on a stalk. It is now the trapezius running from the neck over the crest, and the head hangs from the curve of the upper back. |
| Twinflame Seeress | pass | pass | fixed | fixed | pass | pass | 3: both grips were set as if the staves were vertical; they now use the real staff angles, and no warning fires. 4: there is now a weight shift: weight on the fire staff and the straight back leg, the front knee bent, the hip dropped. |
| Rimeburnt Thrall | pass | n/a | pass | pass | pass | pass | none needed |
| Magma Hound | fixed | n/a | n/a | fixed | fixed | pass | 1: the jaw now hangs on its hinge under the ear (it was a slab under the skull). 4: stance shifted onto loaded hindquarters with the forefeet staggered; the paws are flat on the ground line. 5: the leg segments are rounded and overlap at the elbow, wrist, stifle and hock. |
| Obsidian Shieldmaiden | pass | pass | pass | pass | pass | pass | none needed |
| Steam Wraith | pass | n/a | n/a | pass | pass | pass | none needed |
| Fissure Worm | pass | n/a | n/a | pass | pass | pass | none needed (one spine; the maw faces along the spine's end toward the enemy) |

### Gate 2 (independent): style and detail

| Figure | Signature at 190 px | Course marks / Never | Grit count | Palette | Volume / layers / faces | Fix |
|---|---|---|---|---|---|---|
| Riven Jarl | pass | fixed | pass, 30+ | pass | fixed | The split is now a crack, not a ruler line. The body, hands, mail and fur have been given mass and folds. The throne is decoupled from the split. The helm read as a top hat; it is now a lowered conical spangenhelm with straps. |
| Jotun Thane | fixed | pass | pass, 20+ | pass | fixed | The egg-shaped hump is now anatomy under a pelt with a broken outline; the arm is separated from it. |
| Twinflame Seeress | pass | fixed | pass, 25 | pass | fixed | The head split was a clean line; it is now jagged. The stiff pose now has a weight shift. |
| Rimeburnt Thrall | pass | fixed | pass, 18 | pass | pass | The limb splits were straight glowing stripes; they are now jagged cracks. |
| Magma Hound | fixed | fixed | pass, 15 | pass | fixed | The flank split was straight; it is now a wandering crack. The plank body and posts are now canine anatomy. The crocodile head is now a dog's head. |
| Obsidian Shieldmaiden | pass | pass | pass, 20+ | pass (red only in her cuts) | pass | none needed |
| Steam Wraith | pass | pass | pass, 12 | pass | pass | none needed |
| Fissure Worm | fixed | fixed | pass, 15+ | pass | fixed | The pipe is now a worm body with peristalsis and one ink edge. The eye-like mouth (an eye motif outside a void world) is now a lamprey disc. The straight split is now an oblique crack. |

No two foes share a silhouette (`sil.png`). There is no gold, no flame on a head, no clean crystal or snowflake. Red
appears only in the Shieldmaiden's cuts. Faces use faceShade 0.8 to 0.85.

### Rig and pose tests (re-run)

| Figure | Bones / layers | Pose (`out/worlds/VIII/<key>_pose.png`) | Result |
|---|---|---|---|
| Riven Jarl | 16 / 21 | axe blow: far arm swung forward and down (upperarm_f -30, forearm_f -22, torso -4) | pass: attached; the axe head falls forward toward the ranks and leaves the frame top, which is expected for a ruler |
| Jotun Thane | 19 / 24 | club raised overhead (upperarm_n -115, forearm_n -35) | pass: the club leaves the frame top, as before; the shoulder stays closed under the trapezius piece |
| Twinflame Seeress | 20 / 27 | twin bolts: fire staff thrust coal-first, frost staff raised behind | pass: the frost staff stays behind the head |
| Rimeburnt Thrall | 17 / 22 | pick wind-up | pass |
| Magma Hound | 18 / 21 | burning bite: neck and head up, jaw open on its hinge, near foreleg reaching | pass |
| Fissure Worm | 10 / 21 | plunge and bite: segments 4 to 8 and the head curl down toward the enemy | pass: no seams open (the parts overlap and carry no ink of their own) |
| Shieldmaiden, Wraith | unchanged | the maker's poses | not changed |

The rigs live in mirrored (game) space, so the rotation signs in these poses are mirrored compared with the drawing
code.

### Still open after the independent review
- **Jarl lap.** It reads at sheet scale but is still the busiest, lowest-value area: the byrnie skirt, the knees and
  the wrapped shins are all mid-dark.
- **Jarl head geometry.** The face is a three-quarter view (`B.head`), so the burned half of the face is the narrower
  half: far eye, nose, mouth corner and chin front. The burned helm half, the melted horn, the axe and the far arm
  carry the char side at sheet scale.
- **Thane pelt.** At sheet scale the pelt over the hunch can still be read as hide slung on the back. It is now
  clearly over a shaped back, not a sack.
- **Hound paws.** The three toes per paw are still somewhat uniform.
- **Worm mouth.** The disc rim is still a smooth, fairly regular oval, only gently wobbled.
- **Seeress hip.** The dropped hip is subtle in this three-quarter side view; the lean and the staves carry the pose.

## Lore changes 2026-11-23

Eye audit (bible/LORE_CHANGES_2026-11-23.md, item 10: no eye motif outside a void world). Three fixes, each the
smallest change, in `worlds/world_VIII.js` only; full audit in `/home/claude/party/EYE_AUDIT.md`.

- **Twinflame Seeress:** the frost staff's head held a round grey stone with a black hole in its centre between the
  antler tines; at sheet size it read as an eye on a stalk. The stone is now a lumpy, longer river stone and the hole
  worn through it is a ragged slot near its upper edge with a thong through it.
- **Riven Jarl:** the melted horn stump ended in a round glowing disc with a hot centre, stacked above the burned-side
  eye, so the burned side read as having two glowing eyes. The heat now runs as a ragged molten lip along the stump's
  broken top edge. (The burned-side ember eye itself is the bible's "two different eyes" and stays.)
- **Jotun Thane:** about a third of the leg and hand blisters had a centred dark core inside a glowing ring (eye-like
  markings, the same fault kit_IX warns about). A burst blister now splits along a ragged off-centre line.

| Figure | Gate | Item | Result | Note |
|---|---|---|---|---|
| Twinflame Seeress | 1 Logic | 1-6 | pass | The stone still sits between the tines; the thong hangs plumb |
| Twinflame Seeress | 2 Style | Eye motif, detail count, palette | fixed / pass, 25 / pass | Slot and thong replace the hole (same count) |
| Riven Jarl | 1 Logic | 1-6 | pass | Helm and stump geometry unchanged |
| Riven Jarl | 2 Style | Eye motif, course marks | fixed / pass | Fire still reads on the stump (molten lip, dribbles, ash) |
| Jotun Thane | 1 Logic | 1-6 | pass | Unchanged geometry |
| Jotun Thane | 2 Style | Eye motif, course marks | fixed / pass | Blisters still glow and some are burst, with no ring-and-pupil read |

| Figure | Bones / layers | Pose re-run | Result |
|---|---|---|---|
| Riven Jarl | 16 / 21 | axe blow: upperarm_f -30, forearm_f -22, torso -4 | attached |
| Jotun Thane | 19 / 24 | club raised: upperarm_n -115, forearm_n -35 | attached |
| Twinflame Seeress | 20 / 27 | twin bolts: upperarm_f -30, forearm_f -20, upperarm_n -25, forearm_n -15, torso -4 | attached; both staves move with their hands |

No export reported `MISSING JOINTS`; no grip warnings. `out/worlds/VIII/sheet.png` and `sil.png` rebuilt with the
maker's composer (scratch `VIII/sheet.py`, unchanged; same sizes).

## Final consistency pass, section B (2026-11-25)

Scope: FINAL_CONSISTENCY_BRIEF section B, Fissure Worm and Jotun Thane. Keys, seeds, bone names and parents unchanged.
Each figure was re-rendered, checked at full size and at 0.3x, re-rigged (no MISSING JOINTS, ground 1070 / 1370) and
pose-tested; the sheet and sil strip were rebuilt with the maker's composer (scratch `VIII/sheet.py`).

| Figure | Item | Fix | Result |
|---|---|---|---|
| Fissure Worm | ringed pipe | Each flank now has its own lumps (a belly sagging under the arch, the back drawn tight over it, a pinch below the head). The annuli come in fold groups of 3 to 5 tight, oblique creases with the edge rolled out between them, separated by stretched smooth spans with only fine lengthwise stretch lines. The shadow terminator follows the lumps instead of running as a constant stripe. A local PRNG draws the new variation, so the crack, maw and pick are unchanged. | pass. At 0.3x it reads as a heavy, uneven worm; no even rings |
| Jotun Thane | pelt reads as a pack | Rebuilt as a skinned bear lying on the hump by its own weight (no straps): its head hangs off the back edge (ear stubs, brow and stop, muzzle, nose leather, lip line with a fang, the eye slit sewn shut), a hind leg hangs plumb off the lower corner to a paw with five claws, the fur lies in clumps that follow the drape, and the edges break into frozen hanks. The old rolled scallops are gone. The old RNG stream is consumed unchanged, so the rest of the figure is as it was. Uses hairClump/hanks from kit_VIII_b (required read-only). | pass. The hanging head and paw read as a hide at 0.3x |

Logic: the bear head and hind leg hang plumb; nothing is strapped or floating (5). Style: grit up (+6 details on the
pelt); palette unchanged (hide browns, rime). Pose re-runs: Fissure Worm plunge (`seg_4..8 -6..-8, head -10`) and
Thane club raised (`upperarm_n -115, forearm_n -35`): attached, no tears.
Still open: the Thane's bear head is a little soft ("teddy") at full size; the worm's charred collar keeps three
regular glowing seams (the maker's collar folds).
