# World I, The Drowned Kingdom, batch b: review

Figures: Hollow Tidewarden (elite 2.0, seed 110), Abbess of Salt (elite 1.9, seed 111), Pearl Diver (elite 1.8, seed 112),
Barnacle Knight (large 1.4, seed 113), Anchor Brute (large 1.6, seed 114), Wreck Crab (large 1.3 wide, seed 115).
Source: `worlds/world_I_b.js`, helpers in `worlds/kit_I_b.js`. Each figure is authored in human space and mapped onto its
tier canvas at its true bible scale by `kit_I_b.space`, so ink widths and hatch spacing stay at the cast's pixel scale.
All are built facing right with `kit.foeBase` plus the Drowned Thrall's world tints (`shadowTint #2a2a38`, `mud #1e2a24`)
and `flip: true`.

Checked by tracing each body in 3D from the code, on zoomed renders (1.5x to 2x on a mid-dark ground), on the game-size
silhouette strip (`out/worlds/I/b_sil.png`, a 1.0 human at 190 px) and in the attack pose tests. "Fixed" means it failed,
was changed, and passes on the re-render.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Hollow Tidewarden | pass | pass | fixed | pass | fixed | pass |
| Abbess of Salt | pass | pass | fixed | fixed | pass | pass |
| Pearl Diver | pass | pass | pass | fixed | pass | pass |
| Barnacle Knight | pass | pass | fixed | pass | fixed | pass |
| Anchor Brute | pass | pass | fixed | fixed | pass | pass |
| Wreck Crab | pass | pass | pass | pass | pass | pass |

### Per item, what was checked and what failed

**Hollow Tidewarden**
- 1 pass: sallet centre [320, 202] sits 16 px (human space) ahead of the neck base [304, 250], on the spine line; the bevor closes the gap between helm and breastplate (swollen flesh bulges in that gap, it does not float).
- 2 pass: nothing is read or studied; the visor is rusted shut.
- 3 fixed: the halberd fist and the sword-hilt fist both go through `B.grip`, no warnings; the halberd forearm meets the haft 27 degrees off square. Fail found: the first coral at the near elbow and on the pauldron read as a second set of fingers next to the real hand (hand count). Coral was rebuilt as low brain-coral mounds with blunt knobs, which no longer read as fingers. The first near hand was an open gauntlet hanging palm up; replaced by the hand on the sword grip.
- 4 pass: upright, feet apart, centre of mass between them; the halberd butt stands on the ground line; water from the sights, kelp and the key all fall plumb in screen space.
- 5 fixed: the scabbard had nothing holding it to the belt. A frog strap now runs from the belt to a riveted throat on the scabbard. The near pauldron was drawn under the arm (it would show the arm through it in the rig); it is now drawn after the arm on the torso bone.
- 6 pass: built facing right, `foeBase`, flipped; every part lit from one side.

**Abbess of Salt**
- 1 pass: head [314, 196] over the neck [306, 252]; standing very straight as the bible asks; wimple and veil follow the skull with no gap at the collar.
- 2 pass: the crosier is carried, not read; the fervent eyes look straight ahead.
- 3 fixed: both hands go through `B.grip` on the vertical staff, thumbs toward the crook, forearms within 10 degrees of square. Fail found: the upper (far) fist floated on the staff with no visible forearm, because the cope covered the far arm. A far forearm sleeve is now drawn past the cope edge into that fist.
- 4 fixed: the near bell sleeve was hanging upward (the normal was inverted); it now hangs down from the forearm. The staff's ferrule stands on the ground line; veil, sudarium, cord tails and keys hang down (the keys fan up to 7 degrees off plumb, as keys on one ring do).
- 5 pass: the key ring hangs on a cord from the belt; the morse clasps the two halves of the cope; the cord belt is knotted with hanging tails.
- 6 pass.

**Pearl Diver**
- 1 pass: in a deep crouch the spine runs nearly level, so the head continues the spine forward of the shoulders (neck drawn, centre 56 px ahead of the neck base along that line), like the Hexweaver's thrust. Hunch comes from the arched back, not a slid head.
- 2 pass: the head is tilted up 0.18 rad so the milky eyes aim at the enemy past the knife.
- 3 pass: the knife fist is an in-line grip (blade continues the forearm, pointing at the enemy, clear of his own arm); the cord fist uses `B.grip` with the cord hanging down from the little-finger side, forearm 30 degrees off square. Webbing drawn on the near hand.
- 4 fixed: the first two builds failed. Build one was a four-legged stance with tube limbs. Build two sat on an invisible stool, with the hips above the knees and nothing under them. He is now in a true squat: hips below the knees and back over the heels, on the balls of both feet, torso leaning over the knees. The stone hangs plumb from the fist. A faint arc behind it shows the swing.
- 5 pass: net bags, the empty sheath and the token all hang from the rope belt; the cord is wound twice round the wrist.
- 6 pass.

**Barnacle Knight**
- 1 pass: overgrown helm sits on the neck over the spine.
- 2 pass.
- 3 fixed: the sword fist uses `B.grip` (shouldered sword, forearm square to the blade); the shield hand is behind the shield on its straps. Fail found: a coral growth on the shield's back edge read as fingers curling round it, a third hand at game size. It was removed.
- 4 pass: wide braced stance, knees bent under the weight; the shield is held, not planted (its point is above the ground line and the far forearm is behind it).
- 5 fixed: the belt ran past the back of the torso into empty air; narrowed to the body. The shouldered blade passes behind the crusted pauldron lumps, so it reads as resting in the crust of the shoulder (see open items).
- 6 pass.

**Anchor Brute**
- 1 pass: the hunch is the upper back (a high hump); the small head hangs forward on the line where the spine turns down at the neck, the neck visible. Measured: head centre 48 px ahead of and 18 px below the neck base, under one head width.
- 2 pass.
- 3 fixed: the knuckle-walking fist was first set with a hand-typed `B.fist` angle (checklist: never). It now goes through `B.grip` in-line with its forearm, back of the hand toward the elbow, knuckles on the stones. The chain fist is an in-line grip: the chain runs straight through the forearm and out of the closed fist, which is what the bible's threading means.
- 4 fixed: the anchor first stood upright on its crown on a slack chain, which cannot stay up. It now leans on its crown with one fluke in the floor and its ring held up by a taut chain from his fist, a stable rest. It leaves a dragged furrow. His near fist takes weight on the knuckles, so the forward hunch is supported.
- 5 pass: chain enters at the wrist and leaves at the elbow through torn, rusted wounds, with the links visible in a split between; the tail of the chain loops over the hump and hangs down the back; the porter's hook hangs from the belt.
- 6 pass.

**Wreck Crab** (non-humanoid)
- Legs carry the weight: all eight dactyl tips (near and far) end on the ground line; the near legs splay forward and back of the centre of mass. Pass.
- Jaws open on a hinge: each claw's moving finger (`claw_n_4`, `claw_f_4`) pivots at the joint with the hand; the pose test closes it. Pass.
- Attachments: mast stump rises out of the hull's top planks; one shroud is parted and hangs; eyestalks rise from under the front lip. Pass.
- Facing and light: pass.

## Gate 2: style and detail

| Figure | Signature at 190 px | Course marks (water, void) and "Never" column | Grit count (needed) | Layers / asymmetry / wear / mud | Palette | Silhouette unique in world |
|---|---|---|---|---|---|---|
| Hollow Tidewarden | fixed | pass | 16 (10) | pass | pass | pass |
| Abbess of Salt | pass | fixed | 18 (10) | fixed | pass | pass |
| Pearl Diver | fixed | pass | 15 (10) | pass | fixed | pass |
| Barnacle Knight | fixed | pass | 14 (6) | pass | pass | pass |
| Anchor Brute | fixed | pass | 20 (6) | fixed | pass | pass |
| Wreck Crab | pass | fixed | 18 (6) | pass | pass | pass |

### Notes per figure

**Hollow Tidewarden.** Signature: the tall halberd and the round hole through the chest. It failed at first. The hole sat against the far arm, so at 190 px it read as a gap between arm and chest. It was moved inboard and enlarged, and the far arm was moved forward. It now reads as a see-through hole in the silhouette, which is a real mask punched through the torso layers (`kit_I_b.punch`). Inside, the cut plate and flesh show as layers, and a pale segmented thing clings to the far wall with its feelers out. Water: verdigris weeping in streaks (the first pass was polka dots, fixed), barnacles, coral at the joints, kelp, water running from the sights. Void: the clean-rimmed hole. Never: no fish face, no sparkles. Grit: barnacle clusters, coral mounds, verdigris streaks, pitting, scratches and dents, water and drips, kelp, rotted tabard with gold trim and worm holes, door emblem, rusted key on a chain, mussels at the buckle, rusted buckle, flesh bulging at the gaps with lividity, frog strap and chape, halberd grip wrap and langets with rivets, the chipped and pierced blade, the creature. Layers: flesh, mail, plate, tabard. Asymmetric: one great pauldron, sword one side, halberd the other. Mud: the world grime rises to the knee.

**Abbess of Salt.** Signature: the crosier and the rigid habit. The crook reads above her as a volute closing round a void, and her body is a stiff bell under a flared cope. Fails fixed: the first salt was scattered white squares, which read as snow (frost's look, which this world must not borrow). It is now grey crusts with clustered cubic blocks. Some salt patches spilled past the outline (noise on the edge) and were moved inside. The white habit was a large flat area, so carved folds with shadowed flanks, water stains and tide lines were added. The crook's first crockets made a cog wheel and were reduced to three curled knobs. Grit: salt crust, carved folds, tide lines, water stains, darned patch, mussels, barnacles and kelp at the hem, cracked salt skin, mouth sewn with tarred cord, five iron keys on the Ostiarii ring, knotted cord belt, morse with rivets, embroidered orphreys, crockets, verdigris on the crook, salted sudarium with fringe, two void holes in the cope, flakes falling from the sleeve. Layers: habit, wimple and barbe, cope, veil.

**Pearl Diver.** Signature: the crouch and the stone weight on its cord. It failed in builds one and two (see logic item 4). Now the stone hangs in front of the squat and reads clearly at game size. Water: nacre pearls grown into the skin along the spine, the shoulder blades, the scalp, one thigh and one arm; pale wrinkled grey-blue skin with lividity. Void: empty pearl sockets with clean rims. Palette fix: the token was drowned gold with a royal crown, which breaks "gold only on holy things". The bible asks for drowned gold, so it is now a cathedral-blessed diver's token stamped with the door. Grit: pearl crust, empty sockets, two net bags of pearls, rope belt, empty sheath, door token, loincloth with drips, two cord wrist wraps, bone-gripped pitted knife, bored stone with barnacles, lividity and veins, peeling skin, webbing, milky eyes, ribs and tendons. Layers: skin, loincloth, belt and its gear.

**Barnacle Knight.** Signature: the lumpy outline, broader than any man. The first crust outline was too smooth. The second read as fur, because the lump helper made many small spikes. `kit_I_b.lumpy` now thins the outline and raises a few big rounded lumps, which read as rock. The crest went from a gold bun to a mitre-like comb, and is now the order's cross standing on the helm with one arm snapped short. That is the drowned gold the bible allows, it is holy, and it reads at 190 px. The shield's cross shows faintly through the growth (lowered contrast, nodules over it). Void: one clean round hole where an eye should be. Grit: barnacles, mussels, rock nodules, crevices, coral mounds, kelp with drips, verdigris, a bare steel strip with pitting, rusted buckle, weed belt, the crest, the faint shield cross, the void eye, the broken visor patch, the breaths.

**Anchor Brute.** Signature: the anchor at the end of its chain. It failed at first: the anchor was toy-sized and ran off the canvas. It is now full size, leaning on its crown in front of him. The mass was rebuilt as a gorilla triangle: a high hump, huge deltoids, the head low, a fist on its knuckles. The first porter's pad was a turtle shell; it is now a saddle on the near shoulder. Wear fix: the big skin areas were plain, so rope-burn scars, pooled lividity, swollen folds, stretch marks, a rope wrist wrap and barnacles were added. Void: a clean hole through the back and one through a fluke. Grit: porter's pad with stitches and a patch, chest strap and ring, rope belt, sackcloth apron, porter's hook, wrist wrap, rolled cuffs with mussels, hump barnacles, scars, lividity, veins, stretch marks, peeling, head rag with a knot, chain over the back, wounds at wrist and elbow, split showing the links, two void holes, rusted, pitted and barnacled anchor with kelp. Layers: skin, trousers, apron, pad and harness.

**Wreck Crab.** Signature: the hull-plank shell and the mast stump. The stump, a lashed yard and a sail rag read as a ship at 190 px. Planks follow the dome in clean strakes (the first set tangled at the bow, fixed), with copper sheathing gone to verdigris along the waterline. Void fix: the first void was a round hole, and next to the porthole eye it made the hull a face. It is now a clean semicircular bite out of the hull's shoulder, a missing piece with a pale rim that also notches the silhouette. The eye in the porthole is this world's allowed eye motif. Grit: tarred seams, treenails, butt joints, nailed sheathing, waterline barnacles, mussels, bolted porthole with the eye, figurehead with flaked paint and a crack, mast bands, splinters, yard lashing, holed sail rag, a parted shroud, kelp, broken plank ends, mouthparts and carapace teeth, barnacled claw with crushing teeth.

### No two foes share a silhouette

Compared on `out/worlds/I/b_sil.png` and against batches a and c (`a_sil.png`, `c_sil.png`):
- Drowned Thrall: a medium pear, head hanging, a pole diagonal across the body. None of mine has a diagonal pole or a pear body.
- Hollow Tidewarden: tall upright plate, vertical halberd beside him, a see-through hole in the chest.
- Abbess of Salt: a tall flared bell with the crook above. The Weeping Nun (batch c) is half her height, bowed, narrow, with no staff.
- Pearl Diver: a low squat with a pendulum stone in front.
- Barnacle Knight: a lumpy block with a cross on top, a heater shield forward and a shouldered blade.
- Anchor Brute: a hump with the head low, an arm to the ground, the anchor and a chain down the back. The Bloated Corpse (batch c) is a round ball on thin legs.
- Wreck Crab: a wide dome on spiked legs with a mast, the only low, wide shape in the world.

## Rig

| Figure | Bones | Layers | Attack pose test (`out/worlds/I/<key>_pose.png`) | Result |
|---|---|---|---|---|
| Hollow Tidewarden | 20 | 23 | windup for the sweeping cut: far arm up 95, halberd cocked back over the head | attached, no tears |
| Abbess of Salt | 18 | 23 | raising the crosier: both arms up 45, wrists cocked so the staff stays near upright; salt flakes leave the sleeve | attached |
| Pearl Diver | 18 | 19 | launch: root tipped 22 forward, knife arm thrust, legs solved by a two-bone IK so both feet stay planted | attached |
| Barnacle Knight | 17 | 18 | windup for the crushing blow: sword raised high behind the head | attached |
| Anchor Brute | 19 | 19 | whirling swing: chain arm up 75, anchor swung overhead | fixed (see below), attached |
| Wreck Crab | 35 | 36 | claw crush: crusher raised 35, moving finger closed 22, eyestalks up | attached |

Rig fixes: puddles were on the pelvis bone and rotated with the root, so they are now on the static root layer in every
figure. The Anchor Brute's chain tail hung from the forearm and whipped out as a rigid bar when the arm rose. It is now
split into a short elbow segment (`chain_tail`, on the forearm) and the drape over the back (`chain_back`, on the torso).

## Still open

- Pearl Diver: the cool grey-blue skin with its cel band still reads a little like carved stone, and the shadow band
  across the lower face reads slightly like a mask at game size.
- Barnacle Knight: the shouldered blade passes behind the crusted pauldron's front lumps instead of visibly lying on top.
  It reads as resting in the crust; an artist may want it on top.
- Anchor Brute: the near arm is still a long, simple form. At game size the knuckle fist reads mainly as a pale block.
- Hollow Tidewarden: the sight slit with its rust bridge still reads a little like a moustache at full size; fine at
  game size.
- `render_rig.js` writes `ground: 790` into every rig.json. These canvases use ground 1370 (elite) and 1070 (large), so
  the rigging step should take the ground from the tier, not from rig.json. This is a shared file, so it was not edited.

## Independent review (second art director, 2026-11-22)

Done by a reviewer who did not build these figures. The bar is Darkest Dungeon 2: grit and character, never a mannequin,
tube limbs or smooth surfaces. Every figure was re-rendered, composited on a mid-dark ground and checked at 1.5x to 2.2x,
then on the game-size silhouette strip. All rigs were re-exported with the new `render_rig.js`, which now writes each
figure's real ground line (1370 for the elite canvases, 1070 for the large ones; checked in every rig.json). No figure
reports missing joints and no grip prints a warning. Only `world_I_b.js` and `kit_I_b.js` were edited.

### Ranked findings (worst first) and fixes

1. **S1, Pearl Diver: a grey stone mannequin sitting on an invisible stool.** Tube limbs with round doll-joint caps, a
   bald egg head with the face plate reading as a mask strapped onto a ball, a speckled granite texture, no anatomy.
   The squat read as sitting, not coiled. Fixed by a full rebuild:
   - Pose: a sprinter's set crouch. Hips higher than the shoulders, the rear (near) leg cocked to drive, the front (far)
     foot under the chest, both on the balls of the feet. The near fist is planted knuckles-down on the stones round the
     knife, the elbow bent and loaded; the far fist holds the stone's cord out ahead. Three points of contact and the
     centre of mass between them.
   - Limbs: new `kit_I_b.mchain` draws hip, knee and ankle (and shoulder, elbow and wrist) as one outline built from
     muscle profiles, with a sharp crease on the inside of each bend and a bony knob on the outside, so there are no caps
     at the joints. `kit_I_b.split`/`side` (local copies of the dirAC rig helpers) cut it per bone. Quads with the
     teardrop above the knee, hamstring groove, patella plane, tibial tuberosity, calf belly, Achilles, deltoid, biceps
     and triceps division, elbow point, brachioradialis, tendons to the wrist, veins.
   - Skin: new `skinDefs`/`skinOver`. A soft flesh mottle replaces the speckled stone texture, a fine crease texture runs
     across each limb (waterlogged skin), and blurred lividity pools sit on the undersides where the blood would settle.
     Wet sheen streaks on the lit edges. Shadow colour pulled from violet to blue-grey.
   - Torso: lean and arched; ribs at varied strength, serratus slips, lat edge, sucked-in belly, shoulder blade, the long
     back muscles, vertebral knobs, and the nacre crust as clusters of half-sunk pearls with two clean void sockets.
   - Head: the skull is drawn over the back edge of the face plate with no ink of its own and inked only on its outer
     contour, so it reads as one bone mass. Heavy brow ridge, frown and forehead creases, sunken temple with a vein,
     cheekbone, crow's feet, stubble on the shaved crown, an ear worn to a nub with an open canal, milky nacre-filmed eyes
     with a ghost iris and no pupil, lips drawn back off a row of worn teeth, a deep nasolabial fold. Predatory, not blank.
   - Hands: `kit_I_b.fistDetail` adds knuckle heads, finger-joint creases, a thumbnail, back-of-hand wrinkles and webbing
     from thumb to index. Feet got sole creases, instep tendon and contact shadows.
   - Gear: the empty sheath (not in the bible, and it read as a pole standing on his back) was removed; the belt is a
     sagging knotted rope with tails; the loincloth wrap is sodden and folded; bags of pearls hang from the belly side.
2. **S1, Anchor Brute: smooth grey cylinder arms, a bald round head, the knuckle fist floating 50 px off the floor.**
   Fixed: both arms rebuilt on `mchain` with massive porter's profiles (deltoid with its inked lower edge, biceps and
   triceps bellies, narrow elbow with its point, a forearm swelling hard below the elbow), creases at both sides of the
   elbow, a rope of cephalic vein, forearm veins, wrist tendons, stretch marks, rope-burn scars, a stitched hook gash on
   the upper arm, peeling skin, barnacles. The near arm was lengthened so the knuckle fist (with `fistDetail`, split
   knuckles, a contact shadow and kicked grit) now bears on the stones. Head: larger (80 to 92), a broad low skull drawn
   over the face plate's back edge, a brow shelf over small sunk eyes, a scar across the eye, a broken nose, a swollen
   cheek, jowls, stubble, a cauliflower ear, a slack open mouth with a heavy hanging lower lip and a few teeth. Hump:
   flesh texture with lividity pools, a spine groove, the trapezius edge, the shoulder blade's ridge, the lat, fat folds
   over the apron, a stitched scar. Anchor: thicker shank swelling toward the crown, larger crown and ring, a worn bright
   edge, rust weeping down the shank (the round orange rust dots read as polka dots and were replaced), a longer furrow
   with scrape marks and flagstone chips where the fluke bit. The ring was moved clear of the fist so the chain visibly
   runs out of the fist to the ring.
3. **S1, Wreck Crab: straight stick legs.** Fixed: each walking leg is now coxa, merus, carpus, propodus and dactyl
   (`kit_I_b.crabSeg` and `dactyl`): the merus rises from a socket under the hull rim to a high knee, the leg then
   steps down to a curved horn-tipped dactyl planted on the floor. Segments are flattened, thickest at the body and
   tapering, with flared distal sockets, pale joint membranes, a lit ridge, a carina groove, spines on the leading edge
   and setae on the trailing edge. Front legs reach forward, back legs back, so the hull sits inside them. Each leg now
   has four bones (`leg_x_1..4`), 43 bones in all. Also fixed: the round staring eye in the porthole read as a cartoon
   face on the hull; the glass now shows the crab's pale soft body pressed behind cracked, weed-fouled glass, and the
   eyestalks are its only eyes. The void bite's pale rim and a dark band ran on past the hull into empty air (noise on
   the edge); the rim is now drawn only where the bite cuts the planks. The claw teeth were toned down from white fangs.
4. **S2, all figures: verdigris drawn as teal teardrops with a pale dot**, which read as raindrop stickers on the
   Tidewarden, the Knight and the Abbess's crook. `kit_I_b.verd` now draws an irregular crust with two or three thin
   weeping streaks at low contrast.
5. **S2, Abbess of Salt: the near bell sleeve was one flat L-shaped slab** (blocky limb, flat area). Rebuilt as a heavy
   bell narrow at the elbow and hanging in two weighted points near the mouth, with folds fanning from the elbow, lit
   ridges between them, crease bunching at the elbow, a stained hem and salt. The tide lines on the cope were ruled
   straight and read as a plaid; they now waver and break. The salt crust under the key ring read as a grey translucent
   blob over the keys; that call now draws crystals only, and every salt crust has a ragged edge at lower opacity (the
   smooth crust read as pale bubbles on the dark cope). The wimple's throat read as a neck roll; starched pleats added.
6. **S2, Hollow Tidewarden: the halberd's four pierced dots read as a face** (two eyes and a mouth) at sheet size. They
   now merge into one quatrefoil cut with a rust rim, and a second ragged rust hole sits lower on the blade. The sight
   slit ran past the front of the sallet into the air; it now ends inside the helm's outline.
7. **S2, Barnacle Knight: the shouldered blade slid under the pauldron crust** (open item from the first pass) and the
   legs read as plain columns. The pauldron is now drawn before the sword (still on the torso bone, under the arm order
   rule), so the blade visibly lies over the shoulder from the fist. The shins got a calf swell, a narrower ankle and a
   strip of bare riveted greave, the thighs a stronger lumpy edge.

### Gate 1 re-run: logic audit

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Hollow Tidewarden | pass | pass | pass | pass | pass | pass |
| Abbess of Salt | pass | pass | pass | pass | fixed (crust over keys) | pass |
| Pearl Diver | pass | pass | pass | fixed | fixed | pass |
| Barnacle Knight | pass | pass | pass | pass | fixed (blade on the pauldron) | pass |
| Anchor Brute | pass | pass | pass | fixed (fist off the ground) | fixed (ring and chain) | pass |
| Wreck Crab | pass | pass | n/a | fixed (legs carry the hull) | fixed (void rim in the air) | pass |

Notes: Pearl Diver 1, the neck rises up and forward from a near-level spine and the head centre sits 70 px (human space)
ahead of the neck base, under one head height. 2, the head is tilted up 0.12 rad and the milky eyes aim along it past
the stone at the back rank. 3, both fists go through `B.grip` with no warning: the knife fist with the forearm coming
down square onto a level blade, thumb side forward; the cord fist with the cord running up through it from the
little-finger side. 4, three contacts (rear ball of foot, front ball of foot, knife fist) with the centre of mass
between them; the stone and its cord hang plumb. Anchor Brute 4, the knuckle fist now bears on the stones under the
hunch. Wreck Crab, every dactyl tip ends on the ground line and the legs splay front and back of the centre of mass;
the moving finger still pivots on its hinge.

### Gate 2 re-run: style and detail

| Figure | Signature at 190 px | Course marks and "Never" | Grit (needed) | Layers / asymmetry / wear / mud | Palette | Unique silhouette |
|---|---|---|---|---|---|---|
| Hollow Tidewarden | pass | pass | 17 (10) | pass | pass | pass |
| Abbess of Salt | pass | pass | 20 (10) | fixed (sleeve, cope) | pass | pass |
| Pearl Diver | fixed (low coiled wedge, stone ahead) | pass | 22 (10) | fixed | pass | pass |
| Barnacle Knight | pass | pass | 16 (6) | fixed (legs) | pass | pass |
| Anchor Brute | pass | pass | 28 (6) | fixed | pass | pass |
| Wreck Crab | pass | fixed (cartoon eye removed) | 24 (6) | fixed (legs) | pass | pass |

Pearl Diver grit now: pearl clusters, empty sockets, rope belt with knot and tails, two net bags, door token, sodden
wrap and flap with drips, two cord wrist wraps, bone-gripped pitted knife, bored barnacled stone with a chip, lividity
pools, veins, wrinkle texture, peeling, webbing, milky eyes, worn teeth, ribs and tendons, spine knobs, stubble, worn
ear, wet sheen, verdigris on the cloth. The silhouette strip was compared again against batches a and c: the diver is a
low wedge with a pendulum ahead, which no other foe has (the Eel-kin Biter is also low on all fours, but at 0.6 scale,
with no pendulum and a long jaw). The crab's jointed legs make its dome read as a crab at 190 px.

### Rig and pose tests (re-exported)

| Figure | Bones | Layers | Pose (`out/worlds/I/<key>_pose.png`) | Result |
|---|---|---|---|---|
| Hollow Tidewarden | 20 | 23 | sweeping cut follow-through: far arm -60, forearm -50, haft at hip height, clear of the helm | attached |
| Abbess of Salt | 18 | 23 | raising the crosier: both arms up 40, wrists -45 | attached |
| Pearl Diver | 18 | 31 | the leap: pelvis up 16, rear leg trailing, front leg tucked, knife arm forward under the face, stone swinging | attached; knees and elbows stay closed (split outlines) |
| Barnacle Knight | 17 | 18 | windup: upper arm -100, forearm 50, sword 40, blade high behind the head | attached |
| Anchor Brute | 19 | 26 | whirling swing: chain arm 75, forearm 30, anchor swung out on the chain | attached |
| Wreck Crab | 43 | 44 | claw crush: crusher raised 20 and 15, moving finger closed 22, eyestalks up | attached |

### Still open

- Pearl Diver: the cel shadow across the lower face and jaw is still heavy at game size (lighter than before, no longer
  a mask). The far net bag sits behind the loincloth flap and barely shows. In the leap frame the stone overlaps the knife
  fist; a game animation should swing the stone wider on that frame.
- Pearl Diver rig: holding the feet planted through a crouch-and-launch needs two-bone IK in Godot; the leap test is
  posed by hand.
- Anchor Brute: the near upper arm and deltoid are still one large area at sheet scale; the head stays small, which the
  bible's "head sunk low" supports. The anchor's lower fluke sits below the ground line on purpose (bitten into the floor).
- Wreck Crab: the figurehead on its back is still a flat oval face; it would read better as a carved bust with a neck
  and hair flowing into the planks.
- Abbess of Salt: the sleeve's folds are partly swallowed by its cel shadow band; the two clasped fists are still near
  copies of each other (allowed by "hands clasped on a crosier").
- Tidewarden: the water running from the sights is still a saturated pale blue.

## Lore changes 2026-11-23

Cole's lore change (bible/LORE_CHANGES_2026-11-23.md, item 7), already written into the Abbess's bible entry: she was
an Ostiarius sent through the first door to seal it from the far side; she failed and came back once, and the order
sewed her mouth shut and sent her back. Applied to the reviewed figure (`abbess_of_salt`, seed 111, elite 1.9,
1100 x 1400) in `worlds/world_I_b.js` only; `kit_I_b.js` was not changed. The pose, the face, the crosier, the cope and
the salt-stiff habit are the reviewed build. Two local helpers were added above `abbess()`: `jag` (roughens a
polygon's edge except where flagged as a cloth edge) and `crackWindow` (a window where the salt crust has cracked off:
the cloth underneath, the crust's shadow falling into it, the crust's lit broken lip, crystals on the rim and
hairline cracks running on into the crust; flagged hem edges keep the cloth's own edge).

- **Mouth:** the tarred black cord is replaced by the abbey's own waxed linen cord: pale waxed cord with a waxy shine,
  three heavy cross stitches (each X through four dark punctures above and below the lips), the skin puckered toward
  each puncture and between the stitches, the lips pinched grey along a pressed seam, the cord knotted off at the back
  corner with a short cut end.
- **Ostiarii habit under the crust:** undyed grey-brown wool where the crust has cracked off the hem (its pleats
  running on to the real hem, an old wet line in the wool); the black scapular in two windows down the skirt front and
  one on the bodice; the wool sleeve of her old habit on the far forearm; the wool under-sleeve inside the mouth of the
  near bell sleeve; the cord belt is now the order's knotted rope belt (twisted rope, a front knot, two ends hanging
  plumb with knots and frayed tips, salt in the lay). The Ostiarii iron key ring at the hip is unchanged. Colours are
  the keepers' habit greys, scapular black and rope (worlds/kit_keepers.js), which are shared library colours (undyed
  wool, rope), plus the world's salt white and blue-black.

Outputs: `out/worlds/world_I_b_abbess_of_salt.png` (+ `_sil`, `.svg`) and the copies in `out/worlds/I/`
(`abbess_of_salt.png`, `_sil.png`), rig `out/rig/worlds/world_I_b_abbess_of_salt/`, pose
`out/worlds/I/abbess_of_salt_pose.png`, and `out/worlds/I/b_sheet.png` and `b_sil.png` rebuilt with the reviewer's
composer (scratch `IbAD/sheets.py`, unchanged).

### Gate 1: logic audit (Abbess of Salt)

| Item | Result | Note |
|---|---|---|
| 1 Head, neck, spine | pass | Unchanged: very straight, head over the neck |
| 2 Objects, gaze | pass | Unchanged; she preaches outward, nothing studied |
| 3 Grips | pass | Both fists on the crosier unchanged (`B.grip`, no warning) |
| 4 Weight | pass | Unchanged; the rope ends and keys hang plumb |
| 5 Contact | pass | Each stitch enters and leaves the lips through a puncture above and below the seam; the cord ends in a knot at the mouth's corner, not in the air. The rope belt goes round the waist and its ends leave from the knot. Every habit window sits inside the crusted garment it belongs to (hem windows run to the real hem; cuffs inside the sleeves) |
| 6 Facing, light | pass | Built facing right, flipped; the crust's lit lip is on the edge toward the key light and its shadow falls into each window on the far side |

### Gate 2: style and detail (Abbess of Salt)

| Item | Result | Note |
|---|---|---|
| Lore read | pass | The sewn mouth reads at sheet size as pale crosses over grey lips; the grey-brown hem and black scapular strips read as an older habit showing through the white crust |
| Cord at sheet scale | fixed | First pass: five thick stitches with a heavy black outline read as a white zip and a black bar across the mouth. Now three wider X stitches with a thin brown outline; the knot's tail shortened so it no longer reads as a drool |
| Hem window | fixed | First pass drew the crust's lit lip and shadow along the hem itself, outlining the hem in white. Flagged hem edges now keep the cloth's own edge |
| Water / void marks, Never absent | pass | Unchanged (salt, tide lines, mussels, barnacles, kelp, two clean void holes, the void in the crook). No fish face |
| Detail count (10) | pass, 25 | The reviewed 20 (tarred cord now waxed cord) plus: wool hem with pleats, two scapular windows on the skirt, scapular window on the bodice, wool cuff on the far forearm, wool under-sleeve, rope belt knot and knotted, frayed ends (the cord belt they replace is not counted twice) |
| Layers | pass | Ostiarii habit (wool, scapular, rope belt), salt-crusted abbess habit, wimple and barbe, cope, veil |
| Palette | pass | Salt white, blue-black, drowned gold on the crosier and morse (holy), plus undyed wool, scapular black and rope from the shared library. No red |
| Section 9 | pass | The former self stays readable (the Ostiarii habit under the abbess's, the door-keeper's keys); the course explains the crust; nothing added for horror alone |
| Unique silhouette | pass | Outline unchanged |

### Rig and pose

| Bones | Layers | Pose (`out/worlds/I/abbess_of_salt_pose.png`) | Result |
|---|---|---|---|
| 18 | 23 | raising the crosier: upperarm_n 40, upperarm_f 40, hand_n -45, hand_f -45 | attached; the new windows ride on their own bones (skirt windows on pelvis, cuffs on the forearms) and the rope ends on pelvis. No `MISSING JOINTS` |
