# World V, The Storm Foundry: review

Figures: The Anvil Titan (500), Cyclops Smith (501), Talos Sentinel (502), Slag Slave (503), Bronze Automaton (504),
Arc-Smith (505), Bellows Imp (506), Spark Swarm (507). File: `worlds/world_V.js`, helpers in `worlds/kit_V.js` (the
fire helpers are a copy of the world IV kit; the lightning, bronze and mechanical helpers are new). Every foe is built
facing right with `kit.foeBase` and `flip: true`.

Method: each figure was rendered with `render.js`, composited on a mid-dark ground and checked zoomed (2x to 3x on the
head, hands, held objects and feet) and at game size (190 px per human, `out/worlds/V/sil.png`). Angles were measured
from the code. All eight were re-rendered at the end with grip warnings on: none printed. "Fixed" means the item failed,
was changed, and passes on the re-render.

Deliverables: renders `out/worlds/world_V_<key>.png` and `_sil.png`; rigs `out/rig/worlds/world_V_<key>/`; pose tests
`out/worlds/V/<key>_pose.png`; `out/worlds/V/sheet.png` (true relative scale, Drowned Thrall as the human reference);
`out/worlds/V/sil.png` (game size).

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: one spine or body chain), 2 objects face their user and gaze, 3 grips
and hands, 4 weight and balance (non-humanoids: what carries the weight), 5 contact and attachment, 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Anvil Titan | pass | pass | fixed | pass | pass | pass |
| Cyclops Smith | fixed | pass | pass | pass | pass | pass |
| Talos Sentinel | pass | pass | pass | pass | fixed | pass |
| Slag Slave | fixed | n/a | fixed | pass | pass | pass |
| Bronze Automaton | pass | n/a | pass | pass | fixed | pass |
| Arc-Smith | pass | pass | pass | fixed | pass | pass |
| Bellows Imp | pass | n/a | n/a | pass | pass | pass |
| Spark Swarm | pass | n/a | n/a | pass | pass | pass |

### Measurements behind the passes
- Titan 1: helm centre (870, 360) sits 10 px ahead of the neck joint (860, 520), a quarter of a helm width. 2: the slit
  and the helm are bowed 9 degrees toward the anvil. 3: the hammer fist goes through `B.grip` (forearm and haft square,
  haft perpendicular to the forearm by construction), no warning. The raised arm's elbow is up beside and behind the
  helm, so neither the arm nor the haft crosses the face.
- Cyclops 1: skull centre 80 px ahead of the neck base with a 200 px wide head (0.4 head widths); the hunch is in the
  spine curve (control point 128 px behind the neck-pelvis line). 2: eye to hot bar is 37 degrees below horizontal, the
  head is bowed 24 degrees: 13 degrees apart. 3: sledge fist `B.grip` with the forearm 93 degrees to the haft; tongs are
  an inline grip (reins continue the forearm through the palm). 4: wide stance, both knees bent, the sledge's weight on
  the back side balances the tongs held forward.
- Talos 1: helm 64 px ahead of the neck base (0.3 head widths). 2: no studied object; it faces its foe. 3: spear fist
  `B.grip`, forearm 68 degrees to the shaft (22 off square, inside the 35 limit). The spear is carried low on the near
  side and passes in front of the shield and below the helm. 4: long lunge, the centre of mass between the forward
  knee and the braced back foot.
- Slag Slave 1: skull centre 50 px ahead of the neck base (head width 90). 3: near fist: the hanging chain is vertical
  and the forearm runs forward, square to it; far fist: the chain runs up to the collar ring and the forearm meets it
  square. Both via `B.grip`, no warning. 4: knees bent, feet apart, weight between them.
- Automaton 3: the punching fists are not holding objects; their angle is the forearm's own angle (knuckles forward,
  back of the hand toward the elbow), which is the fist convention. 4: wide stance, bent piston knees, the forward
  arm balanced by the key and back plate.
- Arc-Smith 2: he looks at his foe, not an object; the hammer is behind and above the head. 3: hammer fist `B.grip`,
  forearm 63 degrees to the haft (27 off square). The far hand is open, reaching to grab.
- Imp 4: it hovers; nothing touches the ground. Wings attach to the lid at the shoulder position, the hinge strap sits
  at the nozzle where the boards meet. Swarm 4: it hovers; the knots and core share one root.

### What failed and how it was fixed
- Slag Slave 1/3: the first build stood as an upright column with both arms hanging, the forearms running along the
  hanging chain (75 and 65 degrees past square, `grip ... move the elbow`). Rebuilt with the hunch in a hand-shaped
  torso (high trapezius hump, ribs bowed under the chest), the near forearm level and the far fist up by the collar.
- Cyclops 1: the near arm hung down the back and became the figure's back outline, hiding the hump, and the head's
  lower third was a dark band. The arm now hangs forward of the back; the head's shadow band was cut to 34 px.
- Titan 3: the far hand was a fist with a typed angle that held nothing. It is now an open gauntlet laid on the
  knight, fingers spread over the anvil edge.
- Talos 5: the shield was drawn after the spear, so the spear (on the near side) vanished behind the shield; the spear
  tip also ran off the canvas. Layer order swapped and the spear shortened.
- Automaton 5: the key's bow floated 70 px clear of the end of its shaft; the shaft now runs into the bow's waist.
  The coil window sat under the near arm and pauldron; the arm was raised to shoulder height and the window moved to
  the front of the chest where it shows.
- Arc-Smith 4: the first pose stood upright and stiff with both feet square. Now a lunge, weight over the bent front
  knee. The near leg also had to be drawn before the apron (the apron hangs in front of it).

## Gate 2: style and detail

Columns: signature shape reads in silhouette at 190 px; course marks (fire dominant, lightning second) with the
"Never" items absent; secondary detail count (foe 6, elite 10, ruler 12); three or more layers; palette rule;
silhouette unique in the world.

| Figure | Signature at 190 px | Fire / lightning, Never absent | Details | Layers | Palette | Unique silhouette |
|---|---|---|---|---|---|---|
| Anvil Titan | fixed | pass | 17 | pass | pass | pass |
| Cyclops Smith | pass, with a note | pass | 20 | pass | pass | pass |
| Talos Sentinel | fixed | fixed | 18 | pass | pass | pass |
| Slag Slave | pass | pass | 15 | pass | pass | pass |
| Bronze Automaton | fixed | pass | 14 | pass | pass | pass |
| Arc-Smith | pass | pass | 15 | pass | pass | pass |
| Bellows Imp | fixed | fixed | 11 | pass | pass | pass |
| Spark Swarm | fixed | fixed | 8 | pass, with a note | fixed | pass |

### Detail inventories (secondary details, then layers)
- Titan: the Tooth on a seat plate under two iron straps, fused and missing rivets, three barred furnace grilles with
  coals, gorget lames, curved pauldron lames, geared elbows, collars on the spike, fused copper run, helm bands and
  breathing holes, an old dent, iron bands on the hammer, a blood-stained striking face, the anvil's worn bright face,
  blood runs, the flattened knight, the stone block. Layers: iron frame, bronze plates, pauldron lames, helm bands.
- Cyclops: studded forge glove with burn pocks and a strap, ring on the tong reins, white-hot bar, apron pocket with
  files and chalk, neck strap pinned with a nail, apron burn holes, belt buckle, three hanging punches, rope, knee
  patches with stitches, iron toecaps, boot straps, wrist strap, stitched scalp, cheek scar, broken tooth, cauliflower
  ear, haft wrap, the hot branding mark on the hammer face, slag beads, body hair. Layers: skin, apron, breeches, belt,
  glove, boots.
- Talos: crest on a riveted holder, cloak with a burnt, smouldering hem, disc brooch, bracer, two rows of pteruges
  with stitching, riveted belt, greaves, heel nail, glowing ichor pool and drips, rim rivets, worn bull boss, dents,
  spear wraps, socket, butt spike, fused runs, helm dent. Layers: bronze body, kilt, greaves, cloak, helm.
- Slag Slave: cage with rivets, hasp riveted shut and a hanging loop, leather pad and riveted iron collar, rust runs,
  chain, sheared link fused into slag, blood-seeped bandage, knotted rope belt, stitched patch, foundry brand, slag
  droplets (some hot), rag foot wrap, charred hems, drag marks. Layers: skin, breeches, rope belt, pad, collar, cage.
- Automaton: guild stamp, chalk tally, broken ankle shackle and chain, smoking vent, oil drips, fused and missing
  rivets, four geared joints, pistons, a cracked lens, grille mouth, coil window, dents. Layers: iron frame, bronze
  plates, copper coil, pauldron lames.
- Arc-Smith: welding mask with cracked smoked glass and rivets, head strap, copper rod with coil and clip, a ring of
  copper wire, hand brush, apron pocket with file and chalk, neck strap, stitching, burn holes, knee patches, boot
  strap, gauntlet cuffs, face scar, slag beads. Layers: shirt, apron, belt, gloves, breeches, boots.
- Imp: brass maker's plate, iron hinge strap with rivets, two bent nails in the mouth split, cord loop on the tail
  handle, claws at the wing ribs, burn holes in the wings, fused nozzle run, iron nozzle ring with rivets, pleats,
  flaking char. Layers: wooden boards, leather pleats, iron strap, brass nozzle.
- Swarm: tumbling slag fragments, lifting crust plates, molten drips, floor scorch, cooling beads, smoke, ash, arcs.
  It wears nothing, so "layers" are read as crust, glowing seams, spark cloud and smoke.

### Course marks
Fire: glowing seams in split skin, plate and slag (every figure), charred hems and edges, ash rising, flaking char,
furnace glow, molten drips and ichor. Lightning: Lichtenberg burns on skin (Slave, Arc-Smith, Cyclops) and on metal
(Titan, Talos, Automaton, Imp's nozzle and boards, the Swarm's floor scorch), standing hair (Slave, Arc-Smith,
Cyclops), fused rivets and bronze runs, arcs where the bible asks for them (Titan, Arc-Smith, Automaton coil, Swarm).
Never: no flames on any head; arcs are jagged ink-cored threads with a white-gold core and only a small bloom where they
ground, never outlining a shape.

### Palette
Bronze, white-gold arcs and soot, plus ink, bone and grey, and library materials named by the entries (leather,
wrought iron, copper, oak). Ember orange is the fire inside the bronze (named for the Imp, Swarm and Talos). Red only
as blood: the Slave's bandage, the Titan's anvil and hammer face. No gold objects (white-gold appears only as arc
light). No eye motifs: the Cyclops eye and the Automaton's lenses are their entries' own anatomy.

### What failed and how it was fixed
- Spark Swarm signature and palette rule: at game size the dark core inside one tidy orbit ring read as an eye (an
  eye motif outside a void world), and the ring looked like a sci-fi atom. The eight knots now sit in a lopsided,
  rising cloud, each tail curling round its own centre; the lens-shaped haze became smoke; the arcs that radiated to
  the core like spider legs were cut to two short ones; the slag fragments' hot dots (which read as pupils) are now
  crack seams.
- Bellows Imp signature: the first wings were a spiky fan that read as a dorsal crest, the limbs walked, and the mouth
  was a row of nail teeth that read as a grin. Bat wings on an iron wrist and three ribs, tucked arms and dangling legs
  (hovering), and the mouth is a glowing split with two bent nails.
- Automaton signature: the first build was a toy (smoothed blob plates, goggle eyes, a toothy grille, a dumbbell key).
  Hard-cornered bevelled plates, layered pauldron lames, a recessed sloping face plate with small sunk lenses (the far
  one foreshortened) and a slotted grille, a key bow with real holes.
- Titan signature: the spike was hidden behind the torso and the hammer behind the fist; the pauldrons were crates.
  The spike now rises clear behind the shoulders, the haft shows between fist and head, the pauldrons are arched lames,
  the torso is fully plated (pectorals, side plates, five belly lames, keel), plates darkened and scorched.
- Talos signature and Never: the crest first sat across the helm like a propeller. It now runs from brow to nape on a
  riveted holder with the plume falling behind. Metal Lichtenberg burns drew as pale gold twigs (a bug: an opacity of
  0 was read as "unset", so a full-opacity pale stroke was drawn); fixed in `kit_V.lichtenberg`, now dark scorch with a
  thin fused thread.
- Cyclops (style fault list): read as a pale padded sack with ball deltoids. Skin darkened to a forge tan, scar
  blotches shrunk, deltoids rebuilt as wedges running into the arm, the eye enlarged and centred on the face's midline.

## Rig and pose tests

| Figure | Bones | Attack pose (from the Motion line) | Result |
|---|---|---|---|
| Anvil Titan | 11: torso (root), head, spike, arcs, 3-bone near arm, hammer, 3-bone far arm; anvil and knight on root | full blow: near arm from raised over to the front | holds; at impact the hammer draws behind the anvil (see open items) |
| Cyclops Smith | 20: humanoid + hammer, tongs, bar, apron, lid | branding blow, impact frame | holds |
| Talos Sentinel | 21: humanoid + spear, shield, crest, cape, kilt, ichor | spear thrust, low under the shield | holds |
| Slag Slave | 18: humanoid + chain, chain_up, cage | chain swing | holds; the whole floor trail lifts with the swing |
| Bronze Automaton | 19: humanoid + piston_n, piston_f, key, arcs | piston punch with a step | holds |
| Arc-Smith | 20: humanoid + hammer, arc, rod, apron, mask | charged hammer strike | holds; the arc leaves the rod (FX) |
| Bellows Imp | 9: body, lid, wing_n, wing_f, arm_n, arm_f, leg_n, leg_f, tail | blast: lid slams, body pitches | holds |
| Spark Swarm | 10: core, spark_1..8, arcs | burst: knots orbit out | holds |

No export reported `MISSING JOINTS`.

## Still open
- Arcs are FX drawn between two bones (Arc-Smith hammer to rod, Titan spike to hammer, Swarm knots, Automaton coil).
  They sit on their own bones but must be redrawn or swapped per frame; a rotated arc detaches from its far end.
- Titan: the anvil is on root and drawn last, so at impact the hammer passes behind it. Godot needs a z-index key on
  the hammer for the impact frames.
- Titan crop: the entry says "cropped at the shoulders". A frame cut at shoulder height would remove the helm, the
  slit, the raised hammer and the spike (both signature shapes). I cropped it at the hips instead, with the hammer head
  cut by the top edge and the near pauldron toward the frame's back edge. The art director should confirm this reading.
- Automaton: the punch is a piston extension (a translate key on `piston_n` and `hand_n`), and turning the key is a
  squash on its shaft axis, not a rotation.
- Slag Slave: the floor trail is on the chain bone, so in a swing it lifts as one piece; a two-bone chain (hanging run
  and floor trail) would let the trail drag.
- Cyclops: the single eye is unmistakable at full size but cannot show in silhouette; at 190 px the read is the bowed
  bald head and the tongs. The skin still carries large soot patches that read a little blotchy.
- Automaton and Titan still lean slightly toward a toy read in places (rounded gauntlet fists, evenly spaced belly
  lames on the Titan). Talos's near upper arm reads as a flat slab of bronze. These are the weakest areas for another
  artist's pass.
- Imp: its ember eyes are small and vanish at game size; the bellows body, nozzle and wings carry the read.

## Independent review (2026-11-23)

Reviewer: a second agent, judging the maker's figures fresh against GUIDE.md section 8, LOGIC_CHECKLIST.md, the design
language, the world V bible and the reviewed references (Drowned King for the ruler bar; Barnacle Knight and Hollow
Tidewarden for armour over a body; dirAC/dirAC2). Each figure was rendered alone, composited on a mid-dark ground and
read at 2x to 3x on the head, hands, held objects and feet, then at sheet and game size. Five figures were changed; the
Arc-Smith, Slag Slave and Bellows Imp were checked and left as they were. Every fail below was fixed and the figure
re-rendered (no grip warnings), its rig re-exported (no `MISSING JOINTS`) and its attack pose re-tested.

**Crop decision (art director, recorded here):** the bible line says the Titan is "cropped at the shoulders". A literal
shoulder crop would cut off the helm, the hammer and the back spike, which are both signature shapes. The director
accepts the maker's crop at the hips. The rebuild keeps it: ground at y 2880 for a 2560 px figure, so the frame's
bottom edge cuts across the hips and faulds.

New helpers in `worlds/kit_V.js`: `bevel` (a lit band inside the edges that face the key light and a dark band inside
the edges that face away, following the smoothed outline), `bplate` (a plate with bevel, heat tint, dents, scratches,
burns and rivets), `dent`, `heatTint`, `verdigris`, `weld` (a lightning-fused bead across a join), `gauntlet` and
`gauntletGrip` (an articulated plate fist: three riveted lames per finger with the tip turning under, a knuckle guard,
a thumb plate and a flared cuff, in B.fist's frame and going through `B.gripAngle`), `cylinder` (a flanged bronze limb
tube), `hinge` (ball-and-socket joint) and `groove` (a sculpted cut with verdigris in it and a lit lip).

### Gate 1 (independent): logic audit

| Figure | Item | Result | Fix |
|---|---|---|---|
| Anvil Titan | 1 head/spine | fixed | Rebuilt on a curved spine with the hunch in the upper back: a trapezius hump behind the neck, a helm 100 px ahead of the neck base (0.36 helm widths), seated in the gorget |
| Anvil Titan | 2 gaze | fixed | The slit was bowed 17 degrees while the knight on the anvil lies about 70 degrees below it. The helm is now bowed 38 degrees and lowered into the gorget, so the slit looks down at the anvil; the remaining offset is inside a faceless helm with no eyes to aim |
| Anvil Titan | 3 grips | fixed | Fist on the haft rebuilt as an articulated gauntlet through `gauntletGrip`: the forearm is at -70 degrees and the haft at 178 degrees, 20 degrees off square, with the thumb toward the head and no warning. The far fist pins the knight knuckles-down, along its forearm |
| Anvil Titan | 4 weight | pass | Hunched over the anvil; the far fist bears on it |
| Anvil Titan | 5 contact | fixed | The haft now runs into the head through an eye with a wedge, and two riveted langets run down the haft. The rod rises out of the back from under the pauldron. The arcs run from the rod's tip to the hammer's upper face. The blood is on the upper face, the face that leads the swing (it was on the lower face) |
| Anvil Titan | 6 facing/light | pass | Built facing right with foeBase and flipped; the bevels are computed from the figure's own key light |
| Cyclops Smith | 1 head/spine | fixed | The head is carried by the hump: the trapezius mass runs from the back into the base of the skull. Skull centre is 62 px ahead of the neck base (0.26 head widths) |
| Cyclops Smith | 2 gaze | pass | After the move: the eye-to-bar line is 35 degrees below horizontal and the head is bowed 24 degrees, so they are 11 degrees apart |
| Cyclops Smith | 3 grips | pass | Sledge `B.grip` (fist size 62 to 74) and inline tongs grip; no warnings |
| Cyclops Smith | 4 weight | fixed | The legs were 35 percent of the figure's height. The upper body is raised 90 px, so the knees bend and the legs carry the bulk |
| Cyclops Smith | 5 contact | pass | Apron neck strap and belt unchanged; the apron's front now follows the gut |
| Cyclops Smith | 6 facing/light | pass | |
| Talos Sentinel | 1-6 | pass | The arm fix (below) keeps the spear grip, the elbow and the fist where they were. Grip unchanged, no warning |
| Bronze Automaton | 3 grips | pass | Both fists are now `gauntlet` fists set along their forearms (punching fists, holding nothing) |
| Bronze Automaton | 1, 2, 4-6 | pass | Unchanged geometry |
| Spark Swarm | 1-6 | pass | Only the core's surface marks changed |

### Gate 2 (independent): style and detail

| Figure | Item | Result | Fix |
|---|---|---|---|
| Anvil Titan | Ruler bar / form | fixed | Was a stack of flat horizontal riveted boxes. Rebuilt from the body out. Under the plates is an iron colossus: hump, a chest swelling forward, the waist pulled in and shown as corded iron cables, hips flaring into faulds. The plates follow that form: domed pectorals with rolled, heat-tinted lower rims; three arched rib lames down the flank; a curved back plate over the lats; three belly lames bowed round the gut and clipped to the body's own outline; faulds clipped to a flared hip shape; a two-lame pauldron with a domed cap and a standing haute-piece. Every plate is bevelled (lit edge, dark edge), dented, scratched, sooted and heat-tinted along its glowing seams |
| Anvil Titan | Hammer | fixed | Was stacked blocks. Now a forged sledge head 400 px long: waisted cheeks, flared mushroomed faces with curling burrs and chips, a visible depth face, forge laps, old dents and a crack. It sits on an oak haft with a butt cap, a leather wrap and riveted iron langets. The upper (striking) face is blood-stained and the back face worn bright. It is wholly in frame |
| Anvil Titan | Helm | fixed | Was a plain box. Now a keeled great helm: a lit face plane turned toward the light, a low riveted comb along the crown, a riveted joining band down the side, a jutting brow shelf that throws the slit into shadow, the single slit wrapping from side to face, breathing holes in rows on the jaw plate, a hinge boss, a three-lame flared aventail, dents, a Lichtenberg burn from a crater on the crown, and a fused run from the brow |
| Anvil Titan | Lightning marks | fixed | Lichtenberg burns fan from the rod's root across the back plate and the pauldron cap. A strike crater on the near pectoral has a fused rim and a double fern. Two welds fuse plates (back plate to rib lames, pauldron cap to its lame). Rivets are fused, the rod's tip is melted to a bead, and the insulators are scorched |
| Anvil Titan | Fists | fixed | Rounded mitts replaced by articulated finger-plate gauntlets on both hands |
| Anvil Titan | Signature at 190 px | pass | Hammer head and rod stand clear of the body in silhouette (`sil.png`) |
| Anvil Titan | Detail count (12) | pass, 24 | Tooth on a strapped seat plate; three arched furnace grilles with coals; strike crater; two welds; repair patch; steam valve; assembly tally marks; broken shackle chain on a girdle ring; fused rod tip; three insulators; hammer langets, wedge, burrs, crack, blood; helm comb, joining band, boss, breathing holes, brow; couter with fan wing; knight, blood on the anvil. Layers: iron body, plates, pauldron lames, gorget/aventail, helm |
| Cyclops Smith | Body (blob) | fixed | Was a round lumpy torso on stubby tube legs. Now the back rises to a hump of trapezius and drops in at the waist (the back profile tapers from 1.06 to 0.38 head units), and the gut pushes the apron forward. The apron is shortened to show the knees. The breeches have a thigh, a narrow knee and a calf. The legs are longer. The near arm has a tapering deltoid, a biceps edge, an elbow point and a brachioradialis swell |
| Cyclops Smith | Face | fixed | Was a small smooth round head. Now larger (head unit 236 to 262) with a low sloping skull, a jutting singed brow shelf over the deep single eye, a nose broken at the bridge and knocked aside, a lantern jaw with jowls and a masseter, a cheekbone ridge, a scar through the lip, stubble, a burned scalp and a cauliflower ear |
| Cyclops Smith | Skin | fixed | Random blotches came from hard soot ellipses and a wide cel shadow (maxShade 110). Soot is now soft blurred gradients plus sweat runs, the cel band is capped at 46, and the burns are glossy keloid patches with puckered rims and a shine |
| Cyclops Smith | Hands | fixed | Sledge fist enlarged (62 to 74) with healed split knuckles, slag and soot |
| Cyclops Smith | Detail count (10) | pass, 22 | As the maker's list, plus keloid scars, sweat runs, knuckle scars, elbow, broken nose |
| Talos Sentinel | Anatomy | fixed | Smooth bronze with round shadow blobs. Now sculpted: a pectoral shelf with a shadowed underside, sternum, rib arch, six abdominal blocks with lit tops, serratus, iliac line and quad grooves, each cut with verdigris packed in it and a lit lip. Cel shadow capped at 40 so it no longer makes round blobs |
| Talos Sentinel | Wear | fixed | Dents on chest, flank, biceps and thigh; scratches; verdigris blooms in the armpit, flank, knees and elbow |
| Talos Sentinel | Near upper arm | fixed | Was a flat slab. Now a tapering deltoid cut from the arm by a groove, a biceps with a lit belly and a triceps split, a narrow elbow (98 to 80 px) and a forearm swell. The cloak brooch moved off the arm onto the cloak behind the shoulder |
| Bronze Automaton | Toy read | fixed | Limbs are now flanged bronze cylinders on visible iron frames. Elbows and knees are ball-and-socket hinges (the knee gears were removed), with faceted knee cops. The cuirass is faceted with hard corners and two riveted plate seams. Every plate is bevelled to show thickness. The dome has riveted gore seams and a brim flange |
| Bronze Automaton | Fists | fixed | Both fists are articulated finger-plate gauntlets |
| Spark Swarm | Eye motif | fixed | The core's Y crack, its two bright upper ends and the paired drips read as two eyes and a mouth. Now there is one dominant fracture running diagonally off-centre, dim hairline crazing, one long glassy streak, and two unequal drips set off-centre. There is no face read at sheet or game size |
| Arc-Smith, Slag Slave, Bellows Imp | All | pass | Checked against section 8; no change needed |

### Rig and pose re-tests

| Figure | Bones | Pose tested (`out/worlds/V/<key>_pose.png`) | Result |
|---|---|---|---|
| Anvil Titan | 11 | blow mid-stroke: torso -6, upperarm_n -120, forearm_n -50 (flipped frame) | holds; plates on the torso stay seated, the elbow hinge covers the joint. The near arm passes in front of the helm mid-swing, which is correct for a near-side overhead blow; at impact the hammer still needs a z key over the anvil (maker's open item) |
| Cyclops Smith | 20 | branding blow: upperarm_n 70, forearm_n 15, hand_n 20 | holds |
| Talos Sentinel | 21 | spear thrust: upperarm_n 45, forearm_n -35 | holds |
| Bronze Automaton | 19 | piston punch with a step, key turned | holds |
| Spark Swarm | 10 | burst: spark bones rotated outward | holds |

`out/worlds/V/sheet.png` and `sil.png` were rebuilt with the maker's composer. The only change is the Titan's ground
line, now 2880.

### Still open after the independent review
- Titan: at the moment of impact the hammer is drawn behind the anvil (z-order), as the maker noted. The arcs are
  an FX layer and must be redrawn per frame.
- Cyclops: at game size the hump reads a little like a pack on the back, and the single eye cannot show in silhouette.
  The read there is the bald bowed head and the tongs.
- Automaton and Talos limbs still use the shared cel shading; cylinders read as engineered at sheet size, but the
  thigh tubes read somewhat boxy up close.

### Second pass: Cyclops Smith (director's notes, 2026-11-23)

The director's second look passed the Titan, Talos, Automaton and Swarm. The Cyclops still failed at sheet scale.
Each note below was fixed and re-checked. The Bog Troll (world II) and Cauldron Bearer (world III) were used as the
reference for how a hunched giant reads.

| Item | Result | Fix |
|---|---|---|
| Upper body read as three balls (hump, near shoulder, head) | fixed | The upper body is drawn from explicit points as one mass. From the base of the skull the trapezius climbs to a broad back arch, with a slight break where it meets the shoulder blade, then drops down the back. A "mantle" layer on the torso carries that same top line forward and rolls it into the near shoulder cap, whose deltoid sinks into the arm as a wedge (no separate shoulder ball, and the arm's top stays hidden under it when the arm turns). The head is sunk into the front of that line, so skull, neck and back are one curve. Visible breaks: trapezius edge, deltoid front, shoulder blade under the skin, spine knobs. Checked in the silhouette: one continuous outline |
| Head was a smooth mannequin dome with a tiny eye | fixed | Head unit 262 to 290. The cranium is lower and flatter, with a raised bony keel along the crown, a glossy burned scalp sheet, a stitched split and singed tufts. A heavy brow shelf with a lit crest and a hard underside throws the socket into shadow. The eye is larger (0.34 head units wide), with an amber iris, a hard pupil, a catchlight and a scorched lid, and is clearly readable at sheet scale. Also a big cauliflower ear, a lantern jaw with jowls and masseter, dense stubble, a broken and knocked-aside nose, and a scar through the lip |
| Arms were smooth tubes ending in small fists | fixed | Near arm widths 176 / 132 / 122, with the forearm swelling to about 175 px under the elbow, plus flexor and brachioradialis masses, three raised veins, wrist tendons and a riveted wrist strap. Sledge fist `B.grip` at size 96 (was 74), with shiny knuckles, healed splits and a vein over the back of the hand. The tongs fist is `B.grip` inline at size 82 (was 58); the far arm is 150 / 124 / 104 |
| Head over neck | pass | Skull centre (752, 400) is 80 px ahead of the neck root (672, 452), 0.29 head widths. The hunch is in the back arch |
| Gaze | pass | Eye-to-bar line 29 degrees below horizontal, head bowed 21 degrees: 8 degrees apart |
| Grips | pass | No grip warnings on the render |
| Rig and pose | pass | Re-exported: 35 layers, 20 bones, no `MISSING JOINTS`. `out/worlds/V/cyclops_smith_pose.png` is the branding blow (upperarm_n 70, forearm_n 15, hand_n 20, torso -8): the arm stays attached, and the mantle covers the shoulder as the arm swings |

`out/worlds/V/sheet.png` and `sil.png` rebuilt.

Still open on the Cyclops: the apron's front over the gut is still a smooth rounded shape, and the single eye still
cannot show in silhouette (there, the head sunk into the arched back, with the tongs, carries the read).

## Lore changes 2026-11-23

Cole's lore change (bible/LORE_CHANGES_2026-11-23.md, item 1): eye motifs belong to the void worlds only, so the
Cyclops Smith becomes **The Sparkblind Smith** (key `sparkblind_smith`, seed 501, elite 2.3, 1100 x 1400, ground 1370).
The bible entry (bible/world_V_storm_foundry.md) already carried the new design and was followed as written. Only the
head changed, plus spark pits on the forearm and chest; the scale, the Foundry palette, the hunched one-mass back
(mantle, trapezius line), both arms, both grips, the apron, the sledge and the tongs are the reviewed build, untouched.
`kit_V.js` was not changed; one local helper, `ironWeld` (an iron weld bead), sits in `world_V.js` above the figure.

What changed on the head: the single eye, its socket, the `lid` bone and the brow shelf are gone. An iron band is
riveted round the skull above the ear; a wrought-iron visor is riveted to it at the temple and covers the face from the
crown to the cheekbones, standing proud of the face and jutting over the nose. It is lapped from a brow plate over a
cheek plate (lit lapped edge and its shadow, a row of rivets along the lap, rivets down the bend where the face plane
turns, a row along the lower lip) and welded (beaded seams down the bend and across under the brow). One narrow
horizontal slit is cut across both planes and glows white-gold with the forge heat inside; nothing shows through it.
The plate is scorched, heat-tinted above the slit, spark-pitted, scratched, dented, with spatter beads stuck to it. Below
its edge the cheeks are spark-pitted with two glossy, puckered keloid runs and a burn welt; the visor throws a shadow
band on them. The beard is singed short with balled ends. Old spark pits pepper the near forearm and the chest.

Renamed everywhere in the world: entry, function, grip names, header. Removed after the new files existed:
`out/worlds/world_V_cyclops_smith.{png,svg}`, `_sil.png`, `out/rig/worlds/world_V_cyclops_smith/`,
`out/worlds/V/cyclops_smith_pose.png`. New: `out/worlds/world_V_sparkblind_smith.png` (+ `_sil`, `.svg`),
`out/rig/worlds/world_V_sparkblind_smith/`, `out/worlds/V/sparkblind_smith_pose.png`. `out/worlds/V/sheet.png` and
`sil.png` rebuilt with the reviewer's composer (copied to scratch `lore/sheet_V.py`, key and label updated). Note for
whoever owns world V_b: its `sheet19.png` composer (scratch `wV_b/sheet.py`) still lists `cyclops_smith`; I did not
touch V_b files.

### Gate 1: logic audit (Sparkblind Smith)

| Item | Result | Note |
|---|---|---|
| 1 Head over neck and spine | pass | Head centre (752, 400) is 80 px ahead of the neck root (672, 452), 0.28 head widths; the hunch stays in the back arch. The band and visor follow the skull with no gap at the brow or temple |
| 2 Objects face the user, gaze | pass (adapted) | He is blind, so there is no eye line to measure. The visor is bowed 21 degrees toward the hot bar, as before, which reads as listening to the iron; the bar is held out in front of the slit |
| 3 Grips | pass | Sledge `B.grip` (size 96) and the inline tongs grip are unchanged; no grip warning printed |
| 4 Weight | pass | Unchanged: wide stance, both knees bent, the sledge low behind balances the tongs forward |
| 5 Contact and attachment | pass | The visor is riveted to the band at the temple (four rivets) and the band runs round the skull behind the ear; neither floats. Apron neck strap unchanged |
| 6 Facing and light | pass | Built facing right with foeBase and flipped; the visor's bevel, lapped edge and front plane are lit from the figure's own key light |

### Gate 2: style and detail (Sparkblind Smith)

| Item | Result | Note |
|---|---|---|
| Signature at 190 px | pass | The blank iron visor with its bright slit reads at sheet size and in `sil.png` the head is sunk into the arched back with the tongs held out (one continuous outline, as the review established) |
| Fire / lightning marks, Never absent | pass | Fire: scorch, heat tint, spark pits, keloid burns, the glowing slit, ash. Lightning: the Lichtenberg ferns over the shoulders and on the tongs and hammer face are unchanged. No flames on the head, no glowing outline: the slit is a cut with light inside it |
| Eye motif rule | fixed | The single eye is gone; nothing eye-shaped remains on the head (no dot, socket or lens in the slit) |
| Detail count (10) | pass, 26 | The previous 22 less the eye, the scorched lid, the singed brow and the stitched scalp, plus: riveted head band, lapped brow plate with a rivet row, rivets down the bend, rivets along the lower lip, three weld seams, white-gold slit, heat tint, plate spark pits, hammer dent, spatter beads, scarred cheeks (pits, two keloid runs), singed short beard, spark pits on forearm and chest |
| Layers (3+) | pass | Skin, iron band and visor, apron, breeches, belt, glove, boots |
| Palette | pass | Foundry palette (iron greys, leather, soot), white-gold only in the slit and on the hot bar, ember on the bar. No gold object |
| Unique silhouette | pass | Still the only hunched giant with tongs; the Arc-Smith's welding mask is on a lean human-sized figure with a rod |
| Face shading | pass | The cheek and jaw under the visor carry the visor's cast shadow and the existing jaw shading; the visor's front plane is the lit plane |

### Rig and pose

| Bones | Layers | Pose (`out/worlds/V/sparkblind_smith_pose.png`) | Result |
|---|---|---|---|
| 19 (humanoid + hammer, tongs, bar, apron; the old `lid` bone is gone) | 33 | branding blow: upperarm_n 70, forearm_n 15, hand_n 20, torso -8 (the reviewed attack); also checked mid-swing 35/10/10/-4 | holds: the arm stays attached, the mantle covers the shoulder, the visor stays seated on the head bone. No `MISSING JOINTS` |

Still open: the idle "head cocked to listen" is an animation key on `head` (a few degrees of roll); the rest pose keeps
the reviewed bowed head.

### Eye-audit rulings (coordinator, 2026-11-23)

- **Bronze Automaton:** no lens eyes. The two sunk lenses are replaced by a pierced brass sensing grille let into the
  face plate under the brow: a recessed plate with a lit upper lip, eleven small drilled vent holes in two staggered
  ranks (the far ones crowding with the turn of the plate) with a dim ember heat behind them, two rivets, a soot
  streak. Holes in a rank, not a slit, so it does not echo the Sparkblind Smith's visor. Bible line updated
  (bible/world_V_storm_foundry.md, Head: "a pierced brass sensing grille: a row of small vent holes, no eyes").
- **Bellows Imp:** the ember eyes stay (ordinary small-creature anatomy), but they were round dark dots with round
  glowing centres, so they are now narrow ember slits under the hinge strap.

| Figure | Gate | Item | Result | Note |
|---|---|---|---|---|
| Bronze Automaton | 1 Logic | 1-6 | pass | Head geometry, brow ridge and face plate unchanged; the grille sits in the face plate |
| Bronze Automaton | 2 Style | Eye motif | fixed | At 4x, sheet and game size the grille reads as a vent, with no pair of dots |
| Bronze Automaton | 2 Style | Unique to the Smith | pass | Holes in a rank on a bronze plate versus one glowing slit in an iron visor |
| Bronze Automaton | 2 Style | Detail count (6), palette | pass, 15 | The cracked lens is replaced by the grille, its rivets and the soot streak |
| Bellows Imp | 1 Logic / 2 Style | 1-6, eye read | pass / fixed | Slits are 1.7 px tall at this scale and sit under the strap like a brow |

| Figure | Bones / layers | Pose re-run | Result |
|---|---|---|---|
| Bronze Automaton | 19 / 24 | piston punch with a step: upperarm_n -10, forearm_n -8, upperarm_f 20, thigh_n -14, shin_n 10, torso 6, head 4, key 30 | attached |
| Bellows Imp | 9 / 10 | blast: lid -14, body 8, wings -20 / -14 | attached |

`out/worlds/V/sheet.png` and `sil.png` rebuilt (scratch `lore/sheet_V.py`).

## Final consistency pass (2026-11-25)

Lightning ruling (FINAL_CONSISTENCY_BRIEF A1): every arc baked into a figure now draws into a separate FX layer through
`worlds/kit_fx.js` (`fxCapture`: the arcs still consume the random stream, so the rest of each figure is pixel-identical)
and is exported by `node worlds/fx_export.js worlds/world_V <key>` to `out/worlds/world_V_<key>_fx.svg/.png` (same canvas,
origin and flip as the figure) plus `_fx.json` (anchor bone) and `_fx_check.png` (figure + FX, review only).

| Figure | Item | Fix | Check |
|---|---|---|---|
| Anvil Titan | spike-hammer arcs baked in | 3 bolts -> FX layer (anchor bone `arcs`); the hammer sparks stay | full size and 0.3x: pass, no arc in the air |
| Arc-Smith | hammer-rod arc | 2 bolts -> FX (anchor `arc`); sparks at the hammer head and rod tip stay | pass |
| Spark Swarm | short arcs | 3 bolts -> FX (anchor `arcs`); the knots' comet tails were wiggling and read as arcs at sheet size, now smooth trails that cool to a dull ember | pass |
| Bronze Automaton | head wisp read as an arc | the steam vent's thin zigzag curl removed; soft billows that widen as they rise. The coil-to-air bolt off the grille -> FX (anchor `arcs`); the two bolts inside the glass coil window stay (enclosed, like the lighthouse lens) | pass |

Rigs re-exported (no missing joints; the `arcs`/`arc` joints are kept as the FX anchors and now carry no layers on the
Titan, Swarm and Whale). Sheet and sil rebuilt (`lore/sheet_V.py`). Weak spot: the Swarm's two faint smoke curls above the
core still have thin wavy lines; they are grey and read as smoke, left as is.
