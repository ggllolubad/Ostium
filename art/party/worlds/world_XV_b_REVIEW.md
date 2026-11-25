# World XV, The Torn Sky: review (batch 2 of 2, "b")

Eleven creatures in `worlds/world_XV_b.js`; helpers in `worlds/kit_XV_b.js`, which requires `./kit_XV` and re-exports it
unchanged. The first batch's files were not edited. Seeds 1520 to 1530 in bible order: Wheel of Thrones 1520, Fourfold
Beast 1521, Recording Angel 1522, Weigher of Souls 1523, Porter of Heaven 1524, Herald of Heaven 1525, Putto 1526,
Scorched Doves 1527, Throne Lion 1528, Rift Crawler 1529, Star-Lighter 1530. Every figure is a foe, drawn facing right
with `kit.foeBase` (through `kit_XV.base`) and `flip: true`; `groundY = canvas h - 30` on every figure.

Renders `out/worlds/world_XV_b_<key>.png` (+ `_sil.png`); rigs `out/rig/worlds/world_XV_b_<key>/` (no MISSING JOINTS on
any); pose tests `out/worlds/XV_b/<key>_pose.png`; sheets `out/worlds/XV_b/sheet.png` (the 11 at true relative scale,
Drowned Thrall at 1.0), `sheet19.png` (all 19, two rows, half size) and `sil.png` (all 19, a 1.0 human about 190 px),
built by `worlds/sheet_XV_b.py`. The final build prints no grip warnings.

| Creature | Tier, scale | Canvas | Note on size (one scale: a 1.0 human is 640 px) |
|---|---|---|---|
| The Wheel of Thrones | ruler 4 | 2000 x 2400 | outer wheel 2560 px across; heightened and widened at the same scale so the hub, the inner wheel's top (the seat socket) and the floor contact fit; the outer rim's top and near side are cropped (bible) |
| The Fourfold Beast | ruler 3.5 | 2000 x 1800 | couched, the lion's head about 1100 px above the slab; the wings run out of the frame top (bible) |
| The Recording Angel | elite 2.2 | 1200 x 1500 | 1408 px standing (H 220), stooped |
| The Weigher of Souls | elite 2.3 | 1800 x 1900 | 1472 px (H 230) plus the needle; widened for the T (span about 1500 px) |
| Porter of Heaven | human 1.15 | 760 x 900 | 736 px; heightened for the halo and the key's bit |
| Herald of Heaven | human 1.05 | 1000 x 820 | widened for the level trumpet |
| Putto | small 0.5 | 600 x 820 | about 320 px from curls to toes (built larger, set at true size with `placeFigure` x0.88) |
| Scorched Doves | small, flock 0.6 | 600 x 820 | eight birds of 53 to 76 px body length across about 420 px |
| Throne Lion | large 1.3 | 1300 x 1100 | head top about 780 px over the floor on its step; widened for the gap between the halves |
| Rift Crawler | large, 1.6 long | 1250 x 1100 | about 1030 px from tail to mandibles; widened |
| Star-Lighter | human 1.0 | 640 x 1000 | 640 px; the pole 840 px; heightened for the cage |

## Lore as drawn (revised XV intro)

The heaven was torn by the void's betrayal of the Mother of Courses; there was no war. The host is drawn as her broken
court still doing its offices, never as soldiers: a doorkeeper on guard with the key to a gate that is gone, a herald
still sounding, the recorder of names, the weigher at the gate, a lamplighter, the wheels that bore her seat, a lion
from the steps of the seat, the guardian that watched it, the decorations of her ceilings and her messenger doves. No
weapons beyond the bible's (the key, the putto's bow); the Mother's sign (a ring of six rays, one per course) appears on
the Herald's banner and tabard, the Recording Angel's seal, the Fourfold Beast's standard and the Wheel's hub seal; the
Porter's tabard carries the key device of its office.

**Conflict for the coordinator (not resolved by editing the bible):** the Fourfold Beast's entry still says "The war took
three of them" and "a broken spear in the flank from the war". Under the revised intro there was no war. I drew the
flank wound as a snapped gilt shaft of the throne's canopy pole, driven in when the throne fell, and the faces as lost
to the void's betrayal (the man's face cracked away onto void, the ox's a clean void hole). The entry's lore line and
its spear line should be reworded by the bible's owner.

**Lightning in the air:** the Throne Lion's entry says its floating hindquarters are "held in place by a web of violet
burns across the gap". By the GUIDE 8 ruling nothing is drawn in the air: the burns lie on the two break faces and the
flanks; whatever holds the halves together is an engine effect (as the first batch did with the Shattered God). Every
other burn in the batch is drawn inside a clipped surface or passed `clip:`; none crosses a silhouette edge into air.

## Courses as drawn

Lightning (dominant): violet Lichtenberg burns (`burn`) clipped to their surfaces; fused metal (the Herald's mouthpiece
welded to its lips, the Recording Angel's hand welded to the quill, the Weigher's arms fused into one banded bar, the
Wheel's hub a fused lump with runs, the Fourfold's metal claws with runs, molten drips frozen under the Wheel's rims);
hair standing (Porter, Herald, Recording Angel, Weigher), the doves' breast feathers standing, the putto's crisped curls.
Void (second): cracks opening onto black with a lit lip (`vcrack`, `crackV`), clean round holes (the ox's face, the
headless dove, the putto's broken wing tip, the Weigher's missing toe), edges thinning into shards, the Wheel's missing
sector with clean cut faces and darkness (a starfield, an eye) behind it, the Lion's break faces, the man's face gone to
void; eyes where the bible calls for them (the Wheel's rims and hub, the Fourfold's wings, the Porter's third eye, the
putto's eye in the dark, the many-eyed dove, the Crawler's back and head, the Recording Angel's pages).
Gold leaf over black: `gilt` (new, kit_XV_b) lays kit_XV's reviewed `leaf` plates (whole across the form, black only in
the cracks between plates, at chips and in recesses) and models the form inside it (a soft core shadow away from the
light, a burnished light, form hatching); never the patchy `gild`. The Wheel's rims are flat-shaded 3D plates (each rim
segment a plate of leaf, its edges the cracks, hatched on the shadow faces). Red appears only as the rubric strikes in
the Recording Angel's book (machine check below).

## New code (kit_XV_b.js)

Copied verbatim from world_XV.js (reviewed there, not exported): `plateLeg`, `cuirass`, `weld`, `bareArm`, `bareLegRig`,
the looks. New: `gilt` (above); `mFist` (B.grip plus kit_XV `fistDetail`); `onPlane` (draws in a plane's own 2D
coordinates and carries it into the picture by the plane's affine projection, with the key light carried into the
plane's space so the cel shading still falls from the upper left: used for the Wheel's faces and eyes, the Porter's
grille, the Wheel's seat socket); `camera` and `v3` (an orthographic camera for the Wheel); `ashHeap`. Reused from
kit_XV: `godHand`-era helpers `leaf`, `fold2`, `formHatch`, `wing` (the world_VI wing), `feather`, `plumeMass`, `eye`,
`crackedHalo`, `standingHair`, `muscleArm`, `fullLeg`, `openHand`, `fistDetail`, `ironChain`, `voidShape`, `shards`.
`godHand` was not needed: no open hand in this batch had to fold its fingers (the open hands are the Herald's and the
Recording Angel's, drawn with `openHand` at a moderate curl).

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (non-humanoids: jaw on a hinge, one spine, legs that carry the weight, wings rooted at the
shoulders); 2 objects face the user, gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing
and light. "Fixed" means it failed during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Wheel of Thrones | pass (no head; one hub where both axles meet) | n/a | n/a | pass (the outer rim's lowest point is placed on the floor by computing the projection) | fixed | pass |
| Fourfold Beast | pass (four faces on one neck; the lion's jaw on its hinge) | pass (the lion's face to the party) | n/a | pass (forequarters on straight forelegs, haunch on the slab) | pass | pass |
| Recording Angel | pass (hunch from the upper back, head on the neck's line) | fixed | fixed | pass | fixed | pass |
| Weigher of Souls | pass | pass (no object read; eyes closed) | pass (fists fused round the rings, inline) | pass (dead centre, a plumb line) | pass | pass |
| Porter of Heaven | pass (short neck, square on its feet) | pass | fixed | pass | fixed | pass |
| Herald of Heaven | pass | pass (eyes closed, trumpet at the lips) | pass (`B.grip` maxBend 40, no warning) | pass (on the back foot, chest lifted) | pass | pass |
| Putto | pass | pass (looks down the arrow) | pass | pass (hangs from the wings, legs dangling) | fixed | pass |
| Scorched Doves | pass (each bird one body, head on its neck) | n/a | n/a | pass (flying) | pass | pass (birds flying leftward are mirrored so their backs stay up) |
| Throne Lion | pass (jaw on its hinge) | n/a | n/a | fixed | pass | pass |
| Rift Crawler | pass (one spine, the front reared) | n/a | n/a | fixed | pass | pass |
| Star-Lighter | pass (stooped; the head tipped back from the neck) | pass (gaze to the cage: head -0.78 rad, eye-to-cage about -0.98 rad, 12 degrees apart) | pass (both fists `B.grip` maxBend 40, no warning) | pass (weight on the leg nearest the pole, straighter) | fixed | pass |

What failed and how it was fixed:
- Recording Angel 2: the first book was a dark slab; at the camera's height (a human's chest, below the angel's chest)
  we see the book from below, so it now shows the two covers' undersides, the clasps and, at its near end, the two page
  blocks' head edges as a cream V. Its pages face the angel; the head is bowed 0.85 rad so the eyes fall on the pages
  (21 degrees). The names, rubric and eyes are shown on leaves torn loose and lifting toward us, moved clear of the face
  after the first render (they first covered it).
- Recording Angel 3: the quill grip warned 80 degrees off square (a pen continues the forearm): now `inline` with a small
  bend; no warning.
- Recording Angel 5: the strap runs from the book's spine over the near shoulder; the chain from the spine to the belt.
- Wheel 5: the first tyre bands joined the visible tread runs across the picture (long lines through the hub); now each
  contiguous run of visible segments is drawn on its own.
- Porter 3/5: the first key crossed the jaw; the hand was lowered and the key's angle flattened so the shank rests on
  the shoulder about 50 px under the chin; the thumb now points up the shank to the bit (it was reversed). The grille's
  straps first ran across its whole width and read as a belt sticking out; they now wrap only the forearm.
- Porter 5: the near leg and the mail coat were first drawn over the tabard; layering is now legs, tabard skirt, mail,
  belt. The wing stump now sits on the back (it was hidden behind the torso).
- Putto 5: the drapery's end and the quiver ribbon hung like two tails; the drape end is now short at the near hip and
  the ribbon short and pale.
- Throne Lion 4: the raised paw first sat at the step and read as planted; it is now lifted clear above the iron pin it
  was torn from, the weight on the three other feet.
- Rift Crawler 4: the first body lay on the floor with the legs hidden under it (and then, with long legs, the far legs
  read as high sticks): the body now rides low but clear, the legs are thick-based (36 px near, 28 px far), low and
  splayed, the claws planted, the far knees only a little above the back.
- Star-Lighter 5: the wing cords first stuck out behind as hooks; they now end at the wing mass and turn behind it. The
  bound wing's primaries first trailed on the floor; they now end at the back of the knee.

## Pose tests (the attack from each Motion line)

Sign convention for the exported (mirrored, facing left) rigs: a positive angle turns a bone clockwise on screen.

| Figure | Bones | Test | Result |
|---|---|---|---|
| Wheel of Thrones | 6: wheel > outer, inner > hub_eye, traces; floor | `outer 4, inner -6, traces 3` | pass: the layers turn about the hub. A true spin about each wheel's own axle is a re-projection, not a 2D rotation: the engine should drive it as an effect (or a short loop of re-rendered frames). |
| Fourfold Beast | 21 | roar: `neck -5, head -6, jaw -18, beak 12`, wings | pass; the beak swings on its shard |
| Recording Angel | 22 | strike a name: `upperarm_n -10, forearm_n -35, hand_n -15, pages 8` | pass: the quill comes down through the book |
| Weigher of Souls | 18 | weighing: `bar 5, chain_n -8, chain_f -6, needle 6` | pass |
| Porter of Heaven | 23 | swing of the key: `upperarm_n -40, forearm_n -70, hand_n -25, key -15, torso -8` | pass: the key comes over and down in front |
| Herald of Heaven | 26 | blast: `torso 6, head 4, upperarm_n 6, forearm_n 4, banner -12`, wings | pass |
| Putto | 25 | loose: `forearm_n -20, upperarm_n -10`, wings beat, legs | pass |
| Scorched Doves | 9 | dive: `flock -14`, each dove 10 to 30 | pass |
| Throne Lion | 19 | pounce: `spine_1 -6, haunch 8, jaw -14`, legs | pass: the haunch swings into the break |
| Rift Crawler | 12 | rearing bite: `seg_f1 10, seg_f2 12, head -10, mandible_n 14, mandible_f -10` | pass |
| Star-Lighter | 21 | cage down: `torso -8, head 20`, both arms forward, `cage 18` | pass for the near hand; the far hand leaves the pole (IK, below) |

Holds that need IK or a constraint:
- **Star-Lighter:** two hands on one pole; the pole rides `hand_n`, so `hand_f` needs two-bone IK onto the pole.
- **Herald of Heaven:** the trumpet rides `hand_n` but its mouthpiece is welded to the lips: keep `head` and the near arm
  chain moving together (or IK the hand to a point on the head).
- **Recording Angel:** the book rides `hand_f` and its strap and chain ride the torso; keep `forearm_f`/`hand_f` within
  about 8 degrees or IK the hand to the book.
- **Porter of Heaven:** one hand on the key (no IK), but the chain from the key's bow to the belt is on the torso and will
  part from the bow in a swing: hide it or move it to an FX chain in the attack.
- **Putto:** the string is drawn to the near hand on the bow's bone; on release swap to a straight string (two frames).
- None for the Wheel, the Fourfold Beast, the Weigher (fused, rigid), the Doves, the Lion or the Crawler.

## Gate 2: style and detail

Signature at 190 px is judged from `sil.png`. Section 9 test for each row: which course did this, to whom, and does the
bible say so? The cast was never human, so "the former self" is each one's office at the Mother's court.

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Section 9 | Result |
|---|---|---|---|---|---|---|---|
| Wheel of Thrones | yes: two crossed wheels, rims studded with eyes, the hub | burns on rims and spokes, fused hub with runs, drips frozen under the rims; cracks opened onto void, the missing sector with clean cut faces and darkness, eyes / no arcs, no galaxies (stars only in the rift) | 18 (12): rims with thickness (side, tread, inner face), the inner wheel in perspective, 17 lidded eyes on the outer face plus eyes on the inner tread (open, half, shut), the closed hub eye with lashes, the half-melted seal, snapped spokes (3), the missing sector, the empty seat socket with sheared bolts, the chariot's traces and harness rings, two canopy tatters, the inscription band, iron tyre bands with rivets, the sprung band, a feather in a spoke, drips, floating ruin, a cracked halo on a spoke, the broken floor | leaf, black ground, iron | pass | its office (bearing the seat: the socket, the traces); pushed: void unmaking a sector, eyes (bible) | pass, with open notes |
| Fourfold Beast | yes: a couched winged lion with a great four-faced head, wings up out of frame | burns along the flanks, on the wings and face; fused metal claws with runs; the man's face gone to void (stars), the ox's a clean hole, shards; eyes in the wings / none | 17 (12): jewelled collar with every setting empty, snapped chain and its last link, the canopy-pole shaft in the flank, fused claws, chest scales with gaps, shattered halo ring, torn standard with the Mother's sign, the slab carved with a procession and cracked, drifting face shards, the eagle's beak on its shard, the ox's sheared horn, burnt pinions, a gilt mane in locks, eyes in both wings, the lion's gold living eye | gilt flesh, feathers, metal, cloth | pass | the throne's guardian (bible); pushed: the void taking three faces | pass, with open notes |
| Recording Angel | yes: a tall stooped figure over an open book (the V) with the raised quill and lifting leaves | burns over the face, throat and both hands, the hand welded to the quill; the face crazed and cracked onto void; eyes on the pages; hair standing / none | 16 (10): the book (covers, page blocks, gilt corners, cracked clasps), the strap worn through to its lining, the chain spine to belt, inkhorn split at the rim, pen-knife, seal with six rays, five wax tablets, the burnt bare-quill wing, the folded wing, the halo in three, the gilt-edged robe, a patch, burn holes, lifting leaves with names, rubric and eyes | skin, robe, book, leather | pass (red only as rubric) | its office (the book of names, the quill); pushed: lightning fusing the writing hand | pass, with open notes |
| Weigher of Souls | yes: the rigid T with two pans hanging, the needle above | the arms fused into one banded bar with welds and burns flaring from the shoulders; void cracks down the chest and on through the tabard; the clean void edge of the far wing; a missing toe / none | 15 (10): the fused bar with bands and welds, fists welded round rings, chains scorched violet at the links, two hammered pans (cracked), the ash heap, the empty pan's worn place, the needle and its boss, the cracked halo round it, the tabard's gilt borders, the plaited girdle knotted, the weight-stone, the string of five gilt weights, folded wings, bare feet | skin, tabard, metal, feathers | pass | its office (the scales at the gate); pushed: lightning fusing the arms at the moment of weighing (bible) | pass, with open notes |
| Porter of Heaven | yes: the giant key over the shoulder, the grille across the front | burns down the key arm, the key and the grille; cracks along the jaw and collarbone onto void; the third eye in a brow crack; the wing stump broken onto void; hair standing / none | 15 (6): the key (bow, collars, warded bit), the grille (spear bars, one snapped, scrolls, straps, boss), the chain bow to belt, the ring of keys, the open padlock, gilded mail coat, sleeve hem, the tabard with the key device, buckle, scorched sandals, halo in four, the stump | gilt skin, tabard, mail | pass | its office (doorkeeper, key and grille); pushed: the third eye in a crack (void world) | pass |
| Herald of Heaven | yes: the long level trumpet with the banner hanging | the mouthpiece welded to the lips, burns from the throat down the chest, the arm, the banner and the trumpet; the void crack across the ribs; the bell split; hair standing / none | 14 (6): trumpet knops, the split bell, the tasselled cord, banner rings, the Mother's sign and border in gold thread, the burnt hole, charred edges, the gilt-edged tabard, the cord belt, baldric, satchel with sealed proclamations, the undertunic's scorched hem, the cracked halo, scorched wing tips | skin, undertunic, tabard, banner | pass | its office (herald: trumpet, banner, proclamations) | pass |
| Putto | yes: a small fat winged figure with a drawn bow | burns across the belly, arm and wing, a scorched knee with ash, crisped curls; half the face cracked away onto void with an eye in it, the broken wing tip clean-edged / none | 10 (6): bow, nocked arrow, quiver of three, ribbon, garland of gilt leaves, drapery scrap, the face's shell edge, curls, fat folds at wrists, elbows, knees, ankles, thighs, belly and chin, the broken tip | gilt skin, cloth, feathers | pass | heaven's ceiling decoration (bible); pushed: the void half-face | pass, with open notes |
| Scorched Doves | yes: a wheeling flock of white birds | burns on alternate birds, crisped black wing tips, breast feathers standing; void cracks on three, the headless one's clean void neck, the many-eyed one / none | 8 (6): message scrolls (3), gold leg rings (3), the gilt sprig in a beak, the burnt banner scrap on a foot, falling feathers (some charred), the headless bird, the six-eyed bird, notched feathers | feathers, gold, paper | pass | messengers of heaven (bible) | pass |
| Throne Lion | yes: a heavy four-square lion on its step with the hindquarters standing apart | burns over the shoulders and on both break faces; the break faces black void inside the stone shell; the tail end a clean break / no arcs across the gap | 13 (6): the step with its inscription and broken ends, the iron pin and lead fixing, two empty sockets of the other lions, carved mane curls, the collar with rivets and crack, the chipped ear, the chipped fangs, the blank stone eye, the raised paw's pin socket, the tail's clean break, the carved ribs | gilt stone, iron, lead | pass | a lion of the seat's steps (bible) | pass, with open notes |
| Rift Crawler | yes: a low segmented body on splayed legs, the front reared, mandibles | violet-burnt plate margins and burns, ridges on the legs; void plates, the split joints black; eyes along the back and in the head / no sparkles | 11 (6): rows of lidded eyes, gilded tile chunks in the joints, scored and chipped plates, the broken halo on a leg, the dragged banner strip with a burn hole, gold dust on the tips, the tooth-marked floor shard, gold leaf crusting the mandibles, the crooked healed leg, worn pale margins | void plate, membrane, gold | pass | something from outside (bible): no remnant needed | pass |
| Star-Lighter | yes: the tall pole with the caged dead star at its hook | burns up the pole and the pole arm; the void crack from the collarbone to the hip; the dead star crazed violet / none | 14 (6): hooked pole with ferrule and iron cap, the cage with its ring and cap, the dead star, the wing cords and knot, the leather apron with gilt edge and spark pocks, tinderbox, bag of wicks, trimming shears, rolled scorched sleeves, the cracked halo, the cheek crack, the bound wing | skin, tunic, apron, feathers | pass | its office (lamplighter of the stars) | pass |

Silhouettes against the full XV roster (`sil.png`, 19 figures): all distinct. The two rulers differ from the Shattered
God (floating pieces of a seated woman) and from each other: crossed eyed rings versus a couched winged lion. The Throne
Lion (short, deep, maned, four-square on a slab, the haunch apart) does not share the Rift Hound's long low spiked line;
the Rift Crawler (eight splayed legs, a reared front) differs from both and from the Leviathan's coil. The book stoop, the
T with pans, the key, the trumpet and banner, the pole and cage, the small bow and the flock each read on their own.

Faults from the first batch's review, checked per figure:
- Gold leaf as a leopard-spot pattern: not used; `gilt`/`leaf` plates everywhere (the Wheel's plates are its segments).
- Mask faces in strict profile: every angel face is `B.head` three-quarter, face shading 0.8; the Lion's and the
  Fourfold's faces are modelled three-quarter.
- Tube-even fingers: fists are `B.grip` with `fistDetail`; the open hands are `openHand` (knuckles, nails, creases).
- Wings as rows of identical planks: the world_VI wing with varied primary and secondary lengths (`pLen`, `sLen`),
  notches, dark tips, a different spread per wing; the Fourfold's are gilt with eyes in the coverts. See open notes.
- Armour as stacked boxes: none in this batch (mail, tabards, robes); the Weigher's bar is a tapered limb with bands.
- Tube bodies of even width: the Crawler's plates follow `wOf` (tail taper, broad middle, head); the putto's limbs swell
  and crease; the lion's legs are the Magma Hound's muscled segments.
- Stick legs on animals: the Lion uses the Magma Hound / Plague Wolf build (elbow, wrist, pastern, heavy paws); the
  Crawler's legs are thick-based segments, low and splayed.

Palette, checked by machine on the final renders (every rendered pixel scanned for red, hue under 20 or over 340 degrees,
saturation over 0.4, value over 0.25, at a third of full size). Recording Angel 285 px (the rubric strikes: allowed);
Fourfold Beast 0 after the fix (the lion's tongue was first a dark red, 150 px: recoloured dark gold); Wheel 15, Throne
Lion 13, Weigher 5, Porter 1, Putto 1 (antialiased dark-gold edges); Herald, Doves, Crawler, Star-Lighter 0. Gold
appears throughout (allowed by the Torn Sky file), violet for burns and irises; bone and grey for feathers, pages, iron.

## Still open (honest notes)

- **Wheel of Thrones:** the faces are flat-shaded plates (lit by face, hatched in shadow), so the rims read as gilded
  architecture more than as carved form at full size; the spokes are plain bars. The rig turns layers in the picture
  plane only (a spin on each axle needs re-projection, an engine job).
- **Wings:** the world_VI feather is still a plain vane; at full size the Fourfold's big wings show it most.
- **Weigher of Souls:** the body is seen nearly from the front for the T, but `B.head` only draws a three-quarter face,
  so the head is turned a little toward the party.
- **Recording Angel:** the robe's lower half is still the largest dark area of the batch (folds, burn, holes, patch and
  gilt hem break it).
- **Putto:** the pout and the far eye are small at game size; the eye in the void reads first.
- **Throne Lion:** the heraldic face is still a little long in the muzzle.
- **Scorched Doves:** the white reads as a cool grey at sheet size beside the gold figures.

## Independent review (2026-11-24, after the director's sheet check)

Reviewer did not build the batch. Scope: the director's callouts 1 to 7. The first batch's files, the shared files and
the bible were not edited. `world_XV_b.js` was backed up to the scratchpad before editing; every patch was applied by an
exact-match replace that asserted its old text matched once. All 11 were re-rendered (`node render.js worlds/world_XV_b
<key>`, no grip warnings), re-rigged (`node render_rig.js`, no MISSING JOINTS on any) and pose-tested
(`out/worlds/XV_b/<key>_pose.png`, the attacks in the table above, no tears); checked at 2 to 3x on a mid-dark ground
and at sheet size; `sheet.png`, `sheet19.png` and `sil.png` rebuilt with `worlds/sheet_XV_b.py`.

### Root causes found
- **`gilt()` modelled every form backwards.** `f.L` points toward the key light; `gilt` laid its dark blob at `c + L`
  (the lit side) and its light blob on the shadow side, flattening the engine's own cel shading. That is the "flat
  yellow paint" on every gilt form in the batch.
- **The Wheel was lit from the wrong side.** Its camera-space light was `[-0.55, -0.72, -0.42]` (from the drawing's
  left, so from the right after the flip). Now `[0.55, -0.72, -0.42]`, matching `foeBase`.
- **The Wheel's planks** came from a random ±14% tint per rim segment and an ink outline round every segment.

### New code (kit_XV_b.js)
`model` (form modelling by crescents: the shape minus a copy of itself shifted toward / away from the light gives the
core shadow, a deepening toward the turn, reflected light on the shadow edge, the lit plane and an inset specular band;
blurred and clipped), `castOn` (a cast shadow of one part on another, optionally clipped to the receiver), `gilt`
rebuilt on `model` (kit_XV's leaf plates, black only in plate cracks, chips and recesses), `toneGold` (after each build,
every gold-hued colour the figure emitted, its own and kit_XV's helpers', is pulled to 0.86 saturation and 0.9 value;
hue, creams, violet, bone, grey and the rubric red untouched; `f.out` keeps its length so rig marks stay valid),
`deepEye` (socket hollow, brow fold, kit_XV's wet eyeball, a thick modelled upper lid with margin and crease, its shadow
on the ball, lower lid with a waterline glint, tear duct, long wet highlight, optional lashes), lion anatomy (`muscle`,
`lionLimb` (kit_XV jointLimb through three joints, cut for the rig), `lionPaw` (carpal pad, broad foot, four knuckled toes
far to near with clefts, claws as tips or fused metal), `maneLock` (a carved tongue of hair ending in a stiff curl,
incised groove, cast shadow), `maneFill` (locks on a jittered grid inside a region, flowing back from the face, outer
first), `lionHead` (three-quarter carved head: jaw on its hinge drawn under the skull, heavy knotted brow, deep eye living
or blank stone, nasal bridge lit plane, nose leather, wrinkles, whisker pad with pits, flews over the gape, canines,
chin tuft, ear)), `gFeather` and `bigWing` (stiff gilt flight feathers with rachis, barbs, crack, burnt tip, slots;
coverts as feathered masses with scalloped hems after the world_VI wing), `inPoly`.

### Gate 1: logic audit (independent)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Wheel of Thrones | 6 light: lit from the right after the flip | camera light mirrored to match `foeBase` | pass: lit treads and bevels upper left in the game |
| Wheel of Thrones | 5 the black box at the lower left (a straight-edged rift slab behind the gap) read as an artefact; snapped spokes ended in flat void squares | the missing sector is now a hole in the world in the rim's own shape (every face of the missing segments filled with void, violet-rimmed only on its silhouette, stars, an eye looking in, shards off the cut); the two cut ends are clean faces of the black core under a pale leaf skin (bible: "missing with clean edges, darkness behind it"); snapped spokes end in jagged breaks with a fused run | pass |
| Wheel of Thrones | 6/Never: the hub's shadow was a soft tone over the whole canvas, so it darkened the air in the wheel's hole | shadow clipped to the spokes | pass in `sil.png` |
| Fourfold Beast | 1 four faces did not read (the man's face was a black oval, the lion cartoonish) | head mass with four faces facing four ways: lion toward the party (whole, roaring, living gold eye), the man's face toward us (gilt, its back half and cheek cracked away onto starred void), the ox's a clean-rimmed hole at the back with its ear and a sheared horn, the eagle's beak hanging on a shard below the collar | pass |
| Fourfold Beast | 4 legs: forelegs slabs, the haunch a pillow | `lionLimb` forelegs (elbow point, triceps, flexors) under the mane, paws with toes and fused metal claws; the hind leg folded under a teardrop haunch with quadriceps and hamstring grooves, the hind foot along the slab | pass |
| Fourfold Beast | 5 wound | kept: the throne's snapped gilt canopy pole, leaf cracked open round it, bands, a fused run | pass |
| Recording Angel, Porter, Herald, Putto, Star-Lighter, Crawler | grips, attachments, hold points at 2 to 3x | no new fault (Porter key fist on the shank, grille fist behind its bar; Herald fist under the trumpet, mouthpiece weld; Star-Lighter both fists round the pole; Putto bow and nock; Crawler mandibles on the floor shard) | pass |
| Weigher of Souls | 1/4/5 the beam was a yoke laid across the shoulders over a frontal column | the arms ARE the beam (bible): it pivots at the sternal notch (a fused pivot boss, the beam's metal showing along the collarbones in cracks, no bar across the chest), it has tipped 4 degrees toward the ash, the needle stands perpendicular to it out of the crown and leans with it; equal chains, so the low end's pan hangs lower; chains taut and straight from a ring under each fist | pass |
| Weigher of Souls | 4 no turn or weight shift | torso three-quarters to the party (`B.spine`), the head turned on the beam, hip out over the near (weight) leg, far knee eased forward and the heel lifting; the cloth answers (tension folds from the weight hip, the far knee pushing the cloth) | pass (moderate: the bible still asks for "weight dead centre", see open notes) |
| Weigher of Souls | 6/Never: pan cast shadow fell in the air | removed | pass |
| Fourfold wings, mane, Lion mane | shadows of the outermost feathers and locks fell in the air | primaries cast nothing; mane locks' shadows clipped to the mane | pass (one alula edge still shows a faint blur in `sil.png`) |

Audit by checklist item (all 11, after fixes):

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | groundY | Seed | Palette |
|---|---|---|---|---|---|---|---|---|---|
| Wheel of Thrones | pass (no head) | n/a | n/a | pass (rim on the floor) | fixed (gap, spokes) | fixed (light) | 2370 | 1520 | pass |
| Fourfold Beast | fixed (four faces, jaw on hinge) | pass (lion to the party) | n/a | pass (forepaws, couched haunch) | pass | pass | 1770 | 1521 | pass |
| Recording Angel | pass | pass | pass | pass | pass | pass | 1470 | 1522 | pass (rubric red only) |
| Weigher of Souls | fixed (head on the beam's perpendicular) | pass | pass (fists fused inline) | fixed | fixed | pass | 1870 | 1523 | pass |
| Porter of Heaven | pass | pass | pass | pass | pass | pass | 870 | 1524 | pass |
| Herald of Heaven | pass | pass | pass | pass | pass | pass | 790 | 1525 | pass |
| Putto | pass | pass | pass | pass | pass | pass | 790 | 1526 | pass |
| Scorched Doves | pass | n/a | n/a | pass | pass | pass | 790 | 1527 | pass |
| Throne Lion | fixed (jaw on hinge, head low in the ruff) | n/a | n/a | pass (three planted paws, the raised one clear of its pin) | pass | pass | 1070 | 1528 | pass |
| Rift Crawler | pass | n/a | n/a | pass | pass | pass | 1070 | 1529 | pass |
| Star-Lighter | pass | pass | pass | pass | pass | pass | 970 | 1530 | pass |

Palette (machine scan of every rendered pixel at a third of full size, red = hue under 20 or over 340, saturation over
0.4): Recording Angel 306 (the rubric strikes, allowed); Wheel 7 and Fourfold 2 (antialiased dark-gold edges); all
others 0. Gold appears only as leaf (plates over black), the fused welds and runs, the gold thread of the Mother's sign
on the Herald's banner and the Fourfold's standard (bible), and the leg rings and sprig on the doves. Gold saturation
median 0.51 to 0.58 per figure (was 0.61 to 0.68; the Shattered God is 0.66), value median 0.36 to 0.46. All 11 `flip:
true`. Eyes only where the bible allows (void world). Violet burns: every burn is inside a clipped surface or passed
`clip:`; none crosses a silhouette into the air. **No war:** no spears, no battle banners: the Fourfold's flank wound
is the throne's canopy pole; its standard, the Herald's banner, the Crawler's dragged strip and the doves' scrap are
the Mother's court cloth with her sign, never an army's colours.

### Gate 2: style and detail (independent)

| Figure | Director's callout / finding | Fix | Re-check |
|---|---|---|---|
| All gilt | gold read as flat saturated yellow | `gilt` rebuilt on `model` (lit plane, core shadow, reflected edge, specular), `castOn` cast shadows between parts, `toneGold` lowering saturation and value; kit_XV leaf plates kept | pass at 2x and sheet size: forms turn; sits with the God, a little lower in saturation as asked |
| Wheel of Thrones | rims and spokes flat-shaded plates | rims rebuilt as bevelled solids: an 8-face cross-section (tread, four chamfers, two sides, inner face) per segment, one continuous value ramp from Lambert in camera space (no per-segment jitter), inner faces and inner chamfers darkened for occlusion, ink only on silhouette edges and faint on bevel creases, burnished bevel highlights, chips off the arrises, plate cracks every few segments, some opened; the big side face given a value range (lit toward the key, a core of shade, occlusion along the inner edge, reflected light on the outer); spokes octagonal and tapering with the hub's shadow on their roots; tyre bands cast their shadow on the tread | pass |
| Wheel of Thrones | eyes must read lidded, wet, deep-set | `deepEye` on every rim eye (socket, brow fold, thick lid, wet glints, tear duct), one shut with a modelled lid; the hub's great eye closed in a socket under a brow fold, a lower-lid fold, a wet seam and short curved lashes (the first lashes read as teeth) | pass |
| Fourfold Beast | wings stacked planks | `bigWing`: primaries broad, overlapping, pointed, slotted past mid-length, tips burnt black (the pinions); secondaries and tertials; greater coverts as a row of broad feathers; median, lesser and marginal coverts as feathered masses with scalloped hems, each casting on the row behind; scapulars; a shaped leading edge with the alula; eyes set deep in the median and lesser coverts; flat vanes with rachis, barbs and leaf cracks | pass at sheet size; see open notes at full size |
| Fourfold Beast | flat gold sphinx | lion anatomy under the leaf: scapula and its spine, ribcage with seven ribs lit on their tops, the flank drawn in, the belly line, the haunch, forelegs with elbow point and muscle grooves, paws with knuckled toes and fused metal claws; a heavy mane over the crown and down the neck | pass |
| Weigher of Souls | stiff frontal column, robe without folds | see Gate 1; deltoids where flesh turns to metal, a long tabard to the ankles with seven folds (lit ridges, dark valleys) and a value range across it, scorch holes | pass |
| Throne Lion | mane of identical spheres, cartoonish, long muzzle | mane of carved, layered locks with stiff curls flowing back from the face (`maneFill`), a short ruff over the face's back edge; `lionHead` stern carved face (knotted brow drawn down, blank stone eye, short broad muzzle, nose wrinkled, whisker pads, flews, chipped canines, chipped ear); legs as `lionLimb` (triceps, flexors, elbow point; quadriceps and hamstrings, gaskin, hock point and tendon); the haunch carries the thigh down to the stifle with the hip's point; knuckled paws | pass |
| Recording Angel | the lower robe the largest dark area | the robe given a value range (`model`), deeper folds with lit ridges, ash-grey scorch patches, more burn holes, three burns, fewer blotches | pass at sheet size |
| Scorched Doves | read cool grey | feathers warm bone (#e2d4ba) with warm brown shadow, tips singed brown-black, a brown singe across every back, a burn on every bird | pass |
| Porter, Herald, Putto, Star-Lighter, Rift Crawler | heads, hands and held objects, feet at 2 to 3x | no failure found beyond the gold (fixed batch-wide) | pass |

Section 9 on the new marks: the lion anatomy, the mane and the four faces are the bible's own (a guardian of the
throne, the lion's face whole, the others taken by the void); the Wheel's hole in the rim's shape is void removing a
part cleanly; the singe on the doves is lightning's mark on white feathers. Nothing taken for horror alone.

Silhouettes against the first batch (`sil.png`, 19): unchanged reads, all distinct. The Throne Lion's maned head and
floating haunch stay clear of the Rift Hound; the Weigher's T with hanging pans of anything else.

### Holds that need IK (unchanged)
- **Star-Lighter:** two hands on one pole; `hand_f` needs two-bone IK onto the pole.
- **Herald of Heaven:** mouthpiece welded to the lips; keep `head` and the near arm chain together or IK the hand.
- **Recording Angel:** the book rides `hand_f`, its strap and chain the torso; keep `forearm_f`/`hand_f` within 8 degrees.
- **Porter of Heaven:** the bow-to-belt chain parts in a swing; hide it or move it to an FX chain.
- **Putto:** swap to a straight string on release.
- None for the Wheel, the Fourfold Beast, the Weigher (rigid beam), the Doves, the Lion or the Crawler.

### Still open after the independent review
- **Fourfold Beast:** the head between the faces is still a smooth gilt dome under the crown mane; the primaries, seen
  large, are rounded spatulas with burnt tips rather than true slotted pinions (most of their length is cropped by the
  frame); one alula feather's shadow shows faintly in `sil.png`.
- **Wheel of Thrones:** the big near side face is planar, so its modelling is a broad value fall-off; the rim reads as
  carved gilt architecture more than as a living thing, which the bible arguably wants. A true spin on each axle still
  needs re-projection (engine).
- **Weigher of Souls:** the director's turn and weight shift and the bible's "standing very straight ... weight dead
  centre" pull against each other; the shift is kept moderate so the T still reads. The coordinator may want to reword
  the bible's stance line.
- **Throne Lion:** the raised forepaw and the far foreleg under the mane are busy at full size.
- **Gold tone:** `toneGold` lowers saturation below the Shattered God (0.51 to 0.58 against 0.66), as the callout asked; if
  the director wants an exact match, set `kS` to 0.95.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| The Weigher of Souls | stance vs bible 'standing very straight' | The figure was straightened (the bible was not edited): the spine is vertical under the beam's pivot (it hung in contrapposto, hip out over the near leg), both legs straight with the feet flat side by side (the far heel no longer lifts), and the tabard hangs plumb with a level hem, long straight folds and only a slight knee tone. The beam keeps its tilt toward the heavy pan (bible: one pan lower). | pass: reads as a T with a plumb body |

Rig re-exported (18 bones, no MISSING JOINTS); weighing pose (`bar -4, chain_n 5, chain_f 5, needle 2`): attached.
Sheets rebuilt (`worlds/sheet_XV_b.py`). The bible line needs no reword now.
