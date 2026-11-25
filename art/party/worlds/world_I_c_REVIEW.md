# World I, The Drowned Kingdom: batch c review

Figures: Brine Siren (120), Eel-kin Biter (121), Drowned Bell-Ringer (122), Lamprey Swarm (123), Bloated Corpse (124),
Hookline Fisher (125), Weeping Nun (126), Drowned Choirboy (127). File: `worlds/world_I_c.js`, helpers in
`worlds/kit_I_c.js`. All foes are built facing right with `kit.foeBase` and `flip: true`.

Method: each figure was checked against `LOGIC_CHECKLIST.md` on zoomed renders (2x to 3x on a mid-dark ground). Angles
were measured from the code, not judged by eye. Every grip was re-run with its warning switched on, including grips
first drawn with `quiet: true`. "Fixed" means the item failed, was changed, and passes on the re-render.

## Gate 1: logic audit

Items: 1 head over neck and spine (non-humanoids: spine segments follow one spine), 2 objects face their user and
gaze, 3 grips and hands, 4 weight and balance (non-humanoids: legs carry the weight), 5 contact and attachment (and
plumb hang), 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Brine Siren | pass | n/a (no held object; near hand flat on her breastbone) | pass (open hands, no grip) | pass | pass, with a note | pass |
| Eel-kin Biter | pass | n/a | n/a (paws flat on the ground) | fixed | pass | pass |
| Drowned Bell-Ringer | pass | pass | fixed | pass | fixed | pass |
| Lamprey Swarm | pass | n/a | n/a | pass | pass | pass |
| Bloated Corpse | fixed | n/a | pass (open hands) | pass | pass | pass |
| Hookline Fisher | pass | fixed | pass | pass | fixed | pass |
| Weeping Nun | pass | pass | fixed | pass | pass | pass |
| Drowned Choirboy | pass | fixed | fixed | pass | pass | pass |

### Measurements behind the passes
- Siren 1: the head sits 66 px up the spine's own tangent from the neck base, so the neck continues the spine; the
  lean comes from the whole S-curve of the eel body, not from the head sliding forward. 4: her weight is carried by the
  eel body in the water, and the rest of the tail is under the surface behind her. The coil breaking the surface shows
  where it runs.
- Eel-kin 1: pelvis, spine_1, neck and head form one chain, and the jaw opens on its hinge joint. 4: rump over the hind
  feet, chest over the front paws, every paw on the ground line.
- Bell-Ringer 1: the hunch is in the spine curve (control point 110 px behind the line from neck to pelvis); the skull
  sits 48 px up the neck line and 14 px forward. 3: the bell is an inline grip (handle continuing the forearm, like a
  sword hilt), 0 degrees off.
- Lamprey Swarm 1: each lamprey is one helix round the leg's axis, so its front coils over the leg and its back coils
  under it at the same turn. 4: the knot is centred over the boot.
- Corpse 4: the near leg is straight and carries the weight under the sphere's centre (x 292, foot 262 to 300); the far
  foot is lifted 18 px, mid-waddle.
- Fisher 3: both fists on the rod, spaced along it, 0 degrees past the limit.
- Nun 2: the hands touch each other; tears and rosary hang plumb in screen space, not in the head frame.
- Choirboy 1: skull centre 15 px ahead of the neck base (head width 43 px). 2: he sees the pages; the viewer sees the
  back board and spine, with a sliver of the swollen page block. Eye-to-book 65 degrees, head 46 degrees, 19 apart.

### What failed and how it was fixed
- Eel-kin 4: the first build stood on four straight table legs with the body high, like a dog: legs did not read as a
  crouching child's. Rebuilt with the rump high, thighs running forward to knees under the belly, shins back to feet
  under the hips, elbows bent back.
- Bell-Ringer 3: the rope fist was 31 degrees past the 35 degree limit (the forearm ran along the hanging rope). The
  warning had been hidden by `quiet: true`. The rope now leaves the fist square to the forearm and sags back to the
  coil, and the grip renders with the warning on.
- Bell-Ringer 5: the rope end hung straight to the floor from his fist and read as a walking stick. It is now a slack
  loop back to the coil, with a frayed end hanging from the fist. The coil first floated over his back like a hoop; it
  now hangs at the near hip from the rope over his far shoulder.
- Bell-Ringer (layer order): the raised near arm crossed in front of his face. The arms were swapped: the far arm
  raises the bell behind the head, the near arm hangs with the rope.
- Corpse 1: the head sat on top of the sphere like a head on a ball. It is sunk 26 px into the bulk, with fat folds
  where the neck was.
- Fisher 2: his eyes ran along his head axis 31 degrees above the hook he is watching. The head is now tipped 0.34 rad:
  19 degrees to the hook's eye and 24 to its bend.
- Fisher 5: the rod crossed his face. The rod now rises in front of the face with 45 px clear, and the far fist sits
  beside the nose without touching it.
- Nun 3: the folded hands were fists with hand-set angles. Both now go through `B.grip`, each closing round the other
  wrist, with no warning.
- Choirboy 2: the first hymnal was so large it covered his face. It is now at chest height in front of him, with the
  back board to the viewer, and his head is bowed to it (from 26 degrees too far up to 19 degrees).
- Choirboy 3: the near fist was set on the wrong edge of the book, 31 degrees past the limit. Its knuckles now run
  along the near board's bottom edge, 0 past. Both arms are solved with a two-bone IK (`kit_I_c.ik`) so the hands
  actually reach the boards; in the first pass the near hand floated short of the book.

## Gate 2: style and detail

Columns: signature shape reads in silhouette at 190 px; course marks (water dominant, void second) with their "Never"
items absent; secondary detail count (foe minimum 6); three or more layers; palette rule; silhouette unique in the
world (Thrall and batch b included).

| Figure | Signature at 190 px | Water / void marks, Never absent | Details | Layers | Palette | Unique silhouette |
|---|---|---|---|---|---|---|
| Brine Siren | fixed | pass | 13 | pass | pass | pass |
| Eel-kin Biter | fixed | pass | 12 | pass | pass | pass |
| Drowned Bell-Ringer | pass | pass | 15 | pass | pass | pass |
| Lamprey Swarm | fixed | pass | 10 | pass | pass | pass |
| Bloated Corpse | pass | fixed | 13 | pass | pass | pass |
| Hookline Fisher | pass | fixed | 12 | pass | fixed | pass |
| Weeping Nun | pass | pass | 12 | pass | pass | pass |
| Drowned Choirboy | fixed | pass | 12 | pass | pass | pass |

### Detail inventories (secondary details, then layers)
- Siren: shell necklace, verdigris copper pendant, kelp strand over the shoulder, barnacles on shoulder and tail,
  mussels, torn shawl with knot and hanging ends, ribs, webbing, hooked claws, puckered skin, weed and a shell in the
  hair, drips, broken flagstones. Layers: skin, scales, shawl, kelp and cord.
- Eel-kin: rope belt, torn breeches, darned patch, verdigris coin on a cord, barnacles, mussel, gill slits, ragged fin
  ridge, spine knuckles, ribs, plastered hair, drips. Layers: skin, breeches, belt and cord.
- Bell-Ringer: rope coil, rope burns, iron church key on a thong, knotted cincture, button row with gaps, patch, slime
  tide at the hem, barnacles, mussels, kelp, bell inscription band, verdigris, clapper, frayed rope end, ear holes.
  Layers: cassock, shoulder cape, rope, skin.
- Lamprey Swarm: seven lampreys with ringed mouths, gill pores, mottling, torn trouser, stump, rip showing skin, sea
  boot with cavalier cuff and strap, barnacles, verdigris buckle, kelp. Layers: lamprey, trouser, boot, skin.
- Corpse: burst seams with threads, buttons hanging on threads, two shore crabs, pocket, flat cap, barnacles, kelp,
  ladder in the hose, lost shoe, veins, stretch marks, peeling skin. Layers: skin, shirt, waistcoat, breeches.
- Fisher: creel with an eye and a feeler, strap, horn toggles, pocket with mussels, belt and buckle, patch, barnacles on
  the waders, rod whipping and rings, rusted iron hook with kelp, hat tie, jowls. Layers: waders, coat, collar, hat,
  strap.
- Nun: rosary with a tarnished gold crucifix, knotted cincture, pouch, scissors on a chain, darn, tide lines, barnacles
  on the veil, kelp, tear streams, wet streaks, puddle rings. Layers: habit, wimple, veil, cincture.
- Choirboy: ruff, brass corners with verdigris, open clasp, ribbons (one faded rubric), swollen page block, darn, tide
  lines, barnacles, kelp, buckled shoe strap, blue lips. Layers: cassock, surplice, ruff.

### Course marks
Water: bloat (Corpse, Thrall-style swollen faces), barnacles and mussels on every figure, kelp, verdigris, tide and
slime lines, pale puckered skin. Void, each a clean pale rim with a black core: Siren waist hole, Eel-kin flank hole,
Bell-Ringer ear holes, Lamprey hole through the boot, Corpse shoulder-blade hole, Fisher brow band where the slipped
face left the skull, Nun hole through the skirt, Choirboy unmade air at the mouth. No purple sparkles and no galaxies;
the void hearts carry the same faint violet as the Thrall's. No fish faces: the Eel-kin's eel jaw is the bible's own
specification, and it keeps a child's brow and eye above it.

### Palette
World colours (blue-black, verdigris, drowned gold) plus ink, bone and grey, and the bible's named colours per entry
(Fisher's yellow oilskin gone brown, Corpse's brown cloth, Lamprey grey-brown). Gold only on holy things: the Nun's
crucifix, the hymnal's corners and the funeral bell's inscription. Red only as rubric (the hymnal ribbon) and raw
rope-burned flesh on the Bell-Ringer. Eye motifs (the creel, the void hole in the boot) are allowed in this void world.

### What failed and how it was fixed
- Siren signature: the open mouth was a dark patch inside the face and did not reach the outline. A mask now cuts the
  air in front of the gape out of the face, so the wedge between the upper lip and the dropped jaw breaks the
  silhouette. The arch reads through a heavier eel body sweeping back and then forward into the waist. Also fixed: a
  thin, lanky first build (arms and torso thickened), dreadlock-like hair (now two connected wet masses), and a tail tip
  that read as a snake head with an eye (now a coil with a dorsal fin breaking the surface).
- Eel-kin signature: the first two builds read as a robot dog and then a crocodile. The tail and the saw-tooth fin
  were removed (not in the bible), and the head is now pushed out long and low ahead of a cat-arched child's body.
- Lamprey signature: the boot was buried under the coils and the lampreys read as pipes. The knot was moved up the leg
  so the boot shows whole. The free runs now wriggle, the gill pores sit on the body, and one mouth faces the viewer
  with its rings of teeth.
- Choirboy signature: the hymnal hid the boy. It is now a readable block held at his chest.
- Corpse marks: the belly veins radiated like a sunburst. They are now a branching marbled network. The breeches
  read as a kilt and are now a strip under the overhang.
- Fisher marks: the slipped face did not read. The face now hangs 24 px down the skull, with a clean void band
  between it and the brim.
- Fisher palette: the oilskin read as mustard and is now browned. Also fixed: a hem stain that spilled outside the
  coat is now clipped to it.
- Bell-Ringer and Nun: a sawtooth hem was made irregular, a flat slime rectangle became a clipped gradient, and the
  void ear hole that read as a headphone disc was made smaller and put under the fringe. The Nun's skin matched her
  linen and is now a cooler grey.

## Rig and pose tests

| Figure | Bones | Attack or action pose (from the Motion line) | Result |
|---|---|---|---|
| Brine Siren | 14 (pool root, tail_1, tail_2, torso, head, jaw, hair, two arms, tail_end) | song: lunges forward, jaw drops wider, reaching arm lifts | holds; the scalloped scale edge covers the waist joint |
| Eel-kin Biter | 17 (pelvis, spine_1, neck, head, jaw, four 3-bone legs) | lunge: spine and neck rear up, jaw opens, front legs reach | holds; hind feet stay planted |
| Drowned Bell-Ringer | 19 (humanoid plus bell, rope_end, coil, skirt) | toll: the bell swings down forward | holds; the sleeve stays on the arm |
| Lamprey Swarm | 8 (leg root, one bone per lamprey) | surge: the knot tips forward, each lamprey swings out | holds; front and back coils move as one body |
| Bloated Corpse | 15 (humanoid) | burst: lurches forward, head thrown back, arms out | holds |
| Hookline Fisher | 19 (humanoid plus rod, line, creel, coat_tail) | cast: the upper body whips forward, the line swings out | holds; both fists stay on the rod (see open items) |
| Weeping Nun | 19 (humanoid plus veil, skirt, rosary, tears) | laying on a hand: near arm reaches forward, head bows deeper | holds; the far hand stays folded at the waist |
| Drowned Choirboy | 17 (humanoid plus hymnal, surplice) | the note: head lifts, torso leans back | holds |

No export reported `MISSING JOINTS`. Pose images are in `out/worlds/I/<key>_pose.png`, and rigs are in
`out/rig/worlds/world_I_c_<key>/`.

## Still open
- Eel-kin Biter: after two rebuilds it is the stiffest figure in the batch. The limbs are knobbed and tapered but still
  read partly as tubes at full size. It passes at game size, but it would gain the most from another artist's pass.
- Siren: the mouth gap reaches the silhouette, but at 190 px it is a small notch. The arch, the reaching claw and the
  floating hair carry the read. Her hair floats rather than hanging plumb; that follows the bible's "long floating
  hair" and is deliberate.
- Two-handed objects (Fisher's rod, Choirboy's hymnal): the object is parented to the near hand, so in Godot the far
  hand needs an IK target on the object. The pose tests kept both hands on by rotating the whole upper body.
- Bell-Ringer: the rope loop belongs to the near hand, so a large arm swing pulls its far end off the coil. A two-bone
  rope or an IK pin on the coil would fix it in engine.
- Weeping Nun versus Abbess of Salt (batch b): both are robed, veiled columns. They separate on size, the crosier and
  her deep bow, but a world-level review should confirm the two read apart in the encounter frame.
- The void hole in the Lamprey's boot reads partly as an eye. That is allowed in this void world and is left in.

## Independent review

An art director who did not build these figures audited all eight. I read the code and inspected zoomed renders (1.6x to 3.2x on a mid-dark ground, in both build and final orientation). Both gates were re-run, every changed figure was re-rendered, its rig was re-exported and pose-tested, and the two sheets were regenerated in the same layout. Severity: S1 blocks owner review, S2 is clearly wrong, S3 is polish. Ranked worst first.

### Ranked findings and fixes

1. S1 Lamprey Swarm (owner flag). Smooth plastic tubes with donut ring mouths, all facing out, on a post-like leg. The helix bodies read as pipes, and the boot void hole read as an eye. FIXED with a full rebuild and a new `lamprey()` in `kit_I_c.js`. Each lamprey is a Catmull-Rom centreline with kinks. The body is fat behind the head and tapers to a finned tail (a low first dorsal fin, then a second dorsal running round the tip into the tail fin). It has a dark back, a pale belly, seeded mottling, a lateral line, broken wet highlights on the lit flank, specular beads, seven gill pores, a small eye and a nostril. Mouths come in four views. 'side' shows the disc edge-on with flared lips, a fringe and hooked teeth. 'q3' shows a three-quarter disc with an uneven papillae fringe, radial rows of inward-hooked teeth, a throat and a rasping tongue. 'bite' shows the disc clamped flat with the throat working, over a bruised, puckered bite mark on the host. 'hidden' is a head behind the leg. Seven lampreys: two only in three-quarter, three in profile, two clamped. The leg is now a real leg. It has a buttock fold, a hamstring, a swollen quad, a kneecap and creases behind the knee. It is torn off at the hip round a snapped femur. The canvas trousers carry an outseam with stitching, a patch, a wet stain and salt tide lines, plus three rot holes where swollen marbled flesh presses through under ragged cloth rims. Old lamprey scars sit on the flesh. The trousers are tucked into a salt-stained, turned-down sea boot with kelp at the ankle. Wrapping is real: a body is drawn whole behind the leg, then a seeded copy is clipped to the strip that crosses in front (`clipDraw` plus `strip`), so it passes behind and in front of the leg on the same bone. Lampreys emerging from the wound use a virtual body length, so they stay thick where they vanish into it. The void hole moved to the thigh as a tall clean slot, so it no longer reads as an eye.
2. S1 Bloated Corpse (owner flag). A near-perfect ellipse with tube arms. FIXED with a full rebuild. The body is a sack: sloping shoulders, a chest that sags in a fold, and a gut drawn as its own drooping teardrop. The gut is inked only along the silhouette and its underside crease, so it melts into the body. It hangs over the belt and the tops of the thighs, so the figure is widest at the bottom. The back breaks with a fat roll over a belt that cuts in and a fold under the shoulder blade. The shirt has ridden up off the gut and its side seam has burst. The waistcoat panels cannot meet, its back seam has burst and its buttons hang on threads. The seat seam has split. The gut has branching veins, stretch marks round its lower curve, lividity pooled where it hangs lowest, a slit navel, gas blisters, peeling skin and a crease under the overhang. A swollen tongue sits between split blue lips. The thin legs carry the load: the straight near leg takes the weight, and the far bare foot lifts mid-waddle. The arms are single outlines with the fat sagging under them, sleeves split along the seam, and a fat crease at each wrist. A new `belly` bone lets the gut wobble.
3. S1 Eel-kin Biter (owner flag). A robot dog with tube limbs and stiff straight legs. FIXED with a full rebuild of the body and limbs (the head and jaw were kept). It is a crouching child about to spring. The rump is high and the spine bows, with twelve vertebrae knuckling through the back line plus ribs and a jutting shoulder blade. The thighs fold forward so the bony knees rise beside the shoulders, and the heels lift. The elbows are cocked back to a point. Every limb is one outline across its joint (`jointLimb`, split for the rig), with the bony point on the outside of the bend and the muscle bellies opposite. Long, high-arched webbed fingers and toes dig their claws into the floor. The near limbs are a value lighter than the far ones.
4. S1 Brine Siren. Both arms were straight capped tubes, and the reaching arm was a ruler-straight line. FIXED. The reaching elbow now bends. Both arms are single gaunt outlines with a pointed elbow, a crease inside the elbow, a tendon and the edge of the ulna catching light, narrowing to a bony wrist.
5. S2 Drowned Bell-Ringer. The rope coil was five concentric perfect ellipses, which the brief forbids. FIXED. The coil is now five uneven teardrop loops hanging plumb from a lashed gather point under the rope band, each a different size and sag, with the twist of the lay drawn on. The raised forearm was a tube with evenly spaced stripes that read as a striped sleeve. FIXED with one sinewy outline through the elbow, a tendon, a raised vein, uneven raw welts wound slantwise, and a weeping raw patch. The near forearm now narrows to a bony wrist. The hose shins were posts. FIXED with a calf, hose sagging in wrinkles at the ankle, and a worn hole. The cassock hem was an even zigzag. FIXED with an uneven rotted hem and long tatters.
6. S2 Hookline Fisher. Logic fail: the near wader leg was drawn over the closed coat, so it showed as a strip up the coat front. FIXED: the near leg now sits under the coat. The waders and both sleeves were capped tubes with round knee discs. FIXED with single jointed outlines, creases in the bend of the knee, rubber slumped at the ankle, a tarred patch, and oilskin creased at the elbows.
7. S2 Drowned Choirboy. The void at the mouth was a perfect circle inside a perfect ring. FIXED. It is now an uneven hole stretched along the line of the song, with its clean rim present on one side and thinning to nothing on the other, as the design language asks. The arms were tubes. FIXED with jointed sleeve outlines and creases at the elbow.
8. S2 Weeping Nun. Her silhouette was a plain robed column, and the maker worried it would read like the Abbess of Salt. FIXED. She now bows from the upper back (the spine control was pushed back and the neck base forward), her head is bowed deeper, and her wet hem drags behind her in a train. Checked at game size beside the Abbess: the Nun is half the height, hooked forward and dark. The Abbess is a rigid upright white column with a crosier. They do not share a silhouette.

### Gate 1: logic audit (changed figures re-checked)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Brine Siren | pass | n/a | pass | pass | pass | pass |
| Eel-kin Biter | pass (one chain, jaw on its hinge) | n/a | n/a (claws in the floor) | fixed (centre of mass between the planted hands and feet) | pass | pass |
| Drowned Bell-Ringer | pass (hunch in the upper back) | pass | pass (no warnings) | pass | fixed (the coil hangs plumb from the band's gather point) | pass |
| Lamprey Swarm | pass (each lamprey one spine) | n/a | n/a | pass (boot planted under the knot) | fixed (bites clamp on flesh with marks on the host; wraps pass behind and in front) | pass |
| Bloated Corpse | pass (head over the neck rolls) | n/a | pass (open hands) | fixed (the gut's weight pulls down on the straight near leg; the far foot lifts) | pass | pass |
| Hookline Fisher | pass | pass | pass (no warnings) | pass | fixed (the near leg was in front of the closed coat) | pass |
| Weeping Nun | fixed (the bow now comes from the upper back; skull 0.45 head ahead of the neck base) | pass | pass (no warnings) | pass | pass (tears and rosary plumb) | pass |
| Drowned Choirboy | pass | pass | pass (no warnings) | pass | pass | pass |

### Gate 2: style and detail (changed items)

| Figure | Signature at 190 px | Water / void, Never absent | Details | Tubes or perfect shapes | Unique silhouette |
|---|---|---|---|---|---|
| Brine Siren | pass | pass | 13 | fixed (arms) | pass |
| Eel-kin Biter | pass (low head, open jaw, crouch) | pass | 12 | fixed (all limbs) | pass |
| Drowned Bell-Ringer | pass | pass | 16 | fixed (coil, forearm, shins, hem) | pass |
| Lamprey Swarm | fixed (writhing knot and boot) | fixed (the void no longer reads as an eye) | 20+ | fixed (rebuild) | pass |
| Bloated Corpse | fixed (swollen sagging sack on thin legs) | pass | 20+ | fixed (rebuild) | pass |
| Hookline Fisher | pass | pass | 13 | fixed (waders, sleeves) | pass |
| Weeping Nun | fixed (bowed hooded head, curved back) | pass | 12 | pass | fixed (checked against the Abbess) |
| Drowned Choirboy | pass | fixed (the void edge thins away, no ring) | 12 | fixed (void ring, arms) | pass |

### Rig and pose tests (all re-exported)

Rig check against the render: mean difference 0.0001 to 0.0006 for all eight, and no `MISSING JOINTS`. Bones: Lamprey 8, Corpse 16 (new `belly`), Eel-kin 17, Siren 14, Bell-Ringer 19, Fisher 19, Nun 19, Choirboy 17. Every attack pose holds with no tears at the joints: Lamprey surge, Corpse burst (lurch, head back, arms out, gut swing), Eel-kin lunge (front rears, jaw drops, arms reach, hind feet planted), Siren song, Bell-Ringer toll, Fisher cast (the whole upper body rotates, so both fists stay on the rod), Nun laying on a hand, Choirboy note. Images are in `out/worlds/I/<key>_pose.png`.

### Still open

- Eel-kin Biter: the anatomy reads at full size, but the blue-black limbs stay low in contrast at game size. The head and the crouch carry the read there.
- Lamprey Swarm: the hip end of the thigh still reads a little bulbous, and the three-quarter disc fringe is close to regular at full zoom.
- Bloated Corpse: the rolls of neck fat read a little like a collar, and the chest above the gut is still one smooth curve.
- Brine Siren: the scaled hip block below the waist was not reworked.
- Drowned Choirboy: at game size the hymnal is still a dark lump against the surplice.
- In engine: the Fisher's rod and the Choirboy's hymnal still need an IK target for the far hand. The Bell-Ringer's rope end still belongs to the near hand.
- The soft violet bloom behind every void hole is not sparkles or galaxies, but it is the nearest thing to a glow in the batch. Consider lowering it world-wide.
