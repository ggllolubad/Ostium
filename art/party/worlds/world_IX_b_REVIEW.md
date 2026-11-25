# World IX, The Hollow Barrow, second batch (IX_b): review

Eleven figures in `worlds/world_IX_b.js`, seeds 920 to 930 in bible order: The Rat King 920, The Dead-Cart 921, Barrow
Chaplain 922, Pest-House Watchman 923, Gravedigger 924, The Swollen 925, Court Fool 926, The King's Hawk 927, Sexton
Beetles 928, Barrow Mason 929, Rat-Catcher 930. New helpers live in `worlds/kit_IX_b.js`, which requires `./kit_IX` and
re-exports it unchanged. `world_IX.js` and `kit_IX.js` are required, never edited. Every figure is drawn facing right with
`kit.foeBase` (through `kit_IX.base`) and `flip: true`. `groundY` = canvas h - 30 on every figure (checked from the built
figures: 1970, 1770, 1570, 1570, 790, 790, 790, 790, 790, 1070, 790).

**Rework pass (coordinator's notes).** The Rat King was rebuilt from about 800 small rats to 89 large modelled rats
round a tail knot. The Dead-Cart heap was rebuilt as individual dead. The Pest-House Watchman's coat and shelter were
reshaped. The King's Hawk's hood and wing edges got more contrast. Each was re-rendered, re-rigged and pose-tested, the
sheets were rebuilt, and each was read at 2-3x and at sheet size.

New in `kit_IX_b.js`:
- `arm()`, `leg()`, `sleeveShape()`: humanoid limbs for the household. A jointLimb skin limb is split over the two bones
  with round overlaps. The sleeve ends in a torn or rolled hem. The legs take hose, garters, shin wraps, a torn hole,
  earth stains, frozen clods, and turnshoes, boots, wooden pattens or bare feet. `grip()` is `B.grip` plus `fistDetail`.
- `deadHead()` and `frostEye()`: `B.head` (blind, faceShade 0.78, faceHatch off as on Mother Hild) with the Barrow King's
  habits: heavy lids frozen half-shut over filmed eyes, the grey nose and ear, the cheekbone, the nasolabial crease, and
  frost in the stubble. `animalEye()` gives a small dark eye under a brow stroke, never a disc.
- Wings, copied from `kit_VI` (reviewed): `feather`, `plumeMass`, `featherHem`, `wing`, `talonFoot`. They add barring, a
  moult gap, a broken primary and swollen sore-crusted toes.
- `insectLeg()`: the Pit Crawler leg (coxa socket, thick tapered segments, lit ridge, pale joint membrane) with spined
  digging tibiae and a jointed tarsus.
- `rat()`, `ratBones()`, `ratTail()`: one rat with its own random build: girth, hump, head length and angle, ear size,
  fur tone, mange patch, sores and buboes, dead and rimed, mould and fruiting bodies, mouth open with the incisors bared,
  clawing, hanging, tucked or splayed legs, a torn ear, fleas. A `lite` mode draws the packed rats of the Rat King's deep
  mass. No two rats share a build.
- `bigRat()`: the Rat King's modelled rat, in four poses (strain, claw, bite, limp): body mass, haunch and shoulder
  creases, lit back and dark belly (`softTone`), furred legs with bare clawed hands and feet, a pointed head with a thin
  pink-grey ear, whiskers, incisors and a small dark eye with a glint. Its size, girth and tone are random per rat.
- `corpse()`: an articulated dead body for the heap: arms and legs at given angles, dressed in a tunic, a shift or a
  shroud, a lolling `B.head` with shut eyes, open hands, bare or shod feet. Mould appears only as staining on the cloth.
- `shroud()`: a corpse wrapped in grave linen, with bindings, folds, a mould tide and an optional face fallen open.
  `persp()` gives the Dead-Cart's projection. `tally()` comes from kit_VIII_b.

Method: each figure was rendered alone, composited on a mid-dark ground, read at 1.5x to 2.5x on the head, hands, held
objects and feet, and checked at sheet and game size (`sil.png`). The final builds print no grip warnings. Every rig
export reports no `MISSING JOINTS`. A pixel scan finds warm, saturated pixels only on the Watchman (about 0.5%, all in the
plague cross and plea on the roof fascia: red as doom). After the rework, the Rat King, Dead-Cart and Hawk scan at or
under 0.01% (edge anti-aliasing). Deliverables: renders `out/worlds/world_IX_b_<key>.png` and `_sil.png`; rigs
`out/rig/worlds/world_IX_b_<key>/`; pose tests `out/worlds/IX_b/<key>_pose.png`; `out/worlds/IX_b/sheet.png` (the 11 with
the Drowned Thrall); `sheet19.png` (all 19 of World IX, the first 8 from their existing renders); `sil.png` (all 19 at
game size). The sheet script is kept at `worlds/sheet_IX_b.py` (`python3 worlds/sheet_IX_b.py`).

**Canvases (guide 2: true size wins, same pixel scale, groundY = h - 30).**

| Figure | Tier | Canvas | Note |
|---|---|---|---|
| The Rat King | ruler 3 | 2200 x 2000 (widened and heightened) | The whole mound stands in frame, so the broken crest reads. The rats are 230 to 380 px long, large rats, and the front four are the largest. |
| The Dead-Cart | ruler 3.5 | 2400 x 1800 (widened; independent review: the lower mound fits, the 340 px lift removed) | Horse, cart and carter at true scale (wheel 1.43 m, horse about 1.6 m at the withers). The heap stands about 2 to 2.5 human heights above the bed, in frame. The figure is built at 2400 x 1800 and shifted down 340 px (the joints and the mud gradient move with it). |
| Barrow Chaplain | elite 1.9 | 1100 x 1600 (heightened) | The cross stays in frame above his head. |
| Pest-House Watchman | elite 2.1 | 1100 x 1600 (heightened) | The box roof stays over his head. |
| Barrow Mason | large 1.4 | 900 x 1100 | |
| Gravedigger, The Swollen, Court Fool, Rat-Catcher | human | 600 x 820 | The Fool sits on the dais steps (0.63 including the hood points). |
| The King's Hawk, Sexton Beetles | small | 600 x 820 | The hawk is 0.5 to the plume. The beetles are about 70 px each, a big fist. |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (non-humanoids: a jaw on its hinge, segments on one spine); 2 objects face the user, and the
gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing and light. "Fixed" means it failed
during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Rat King | pass (every head thrust outward from the knot or the mound's centre; the limp dead hang) | n/a | n/a | pass (the mass sags onto the floor; the front rats claw at it) | fixed | pass |
| The Dead-Cart | pass (horse: the head hangs low from the neck, on the line of the crest) | pass | fixed | pass (braced forelegs, wheels on the floor) | fixed | pass |
| Barrow Chaplain | pass (head tilted from the neck by the bubo) | pass (the book shows its back board; the pages face him) | fixed | pass (leaning into the pole, its foot on the floor ahead) | fixed | pass |
| Pest-House Watchman | pass | n/a | fixed | pass (feet wide, knees bent, the box's weight over the hips) | pass | pass |
| Gravedigger | pass (the stoop comes from the upper back) | n/a | pass | pass (leaning on the spade, the foot on its tread) | fixed | pass |
| The Swollen | pass | n/a | pass | pass (lurching onto the far leg) | pass | pass |
| Court Fool | pass (the head sunk between hunched shoulders, the face looking up) | pass (the marotte lies face up in his lap) | n/a (hands hang limp) | pass (seated on the step) | fixed | pass |
| The King's Hawk | pass | n/a | n/a | pass (on clenched feet) | pass | pass |
| Sexton Beetles | pass (antennae toward the company) | n/a | n/a | pass (the near legs are planted) | pass | pass |
| Barrow Mason | pass | n/a | pass | pass (wide bent legs under the hod) | fixed | pass |
| Rat-Catcher | pass | n/a | fixed | pass (weight on the far leg, the near leg dragging) | fixed | pass |

What failed and how it was fixed:
- Rat-Catcher 3: the trap fist met its vertical handle at 85 degrees. It now grips the loop handle's horizontal bar
  (square to the hanging forearm). 5: the pole first crossed under the chin. It was lowered so it rests on the shoulder
  below the jaw, with the front end in the hand at chest height.
- Pest-House Watchman 3: the far fist met the bar 66 degrees off square. The bar now stands steeper, with both hands
  close together at its butt, and the forearms come in level, about square to it (IK).
- Barrow Chaplain 3: the far fist ran along the pole (73 degrees). The far hand moved up the pole and the elbow dropped,
  so it is now square. 5: the near arm lay over the cope. It is now drawn under the cope, so the forearm comes out of
  the cope's front opening. The book hung over the closed cope and was moved to the opening.
- Dead-Cart 5 (rework): the heap's end bodies first spilled over the horse. The bodies are clamped to the bed, and the
  heads at the ends lie inward.
- Dead-Cart 3: the carter's hand on the bridle was 57 degrees off. It now grips the cheek strap square to the forearm.
  5: the shafts first rose over the horse's neck. They now run along its sides to the tug and the shoulder. The far rut
  was drawn over the near wheel, and the ruts now go under the wheels. The tyre rings were filled discs, so the wheels
  could not be seen through. Both tyres are now rings, and the far wheel shows between the spokes.
- Rat King 5: every rat's tail leaves its rump and runs in toward the knot under the rats in front of it. The ring of
  eleven round the knot sends curved tails into it. In the rework, the crest rats first floated above the mass on their
  tails, like rats on sticks. They are now held on the mass, and the dark backdrop covers the whole dome.
- Gravedigger 5: the rope coil read as a teardrop on the chest. It is now five loops hung over the near shoulder on the
  back, bound where they hang. The mattock first stood up over the head. It is now slung across the back, the pick up
  behind the hump. The lime sack sat on the thigh and moved to the back hip. The raised foot's ground was wrong, and the
  shoe now sits on the spade's tread.
- Court Fool 5: the near shoe was drawn to the floor through the lower step. It now stands on the step.
- Barrow Mason 5: the hod's trough covered the head. It now sits on the near shoulder behind the head.
- Every grip goes through `B.grip` (`X.grip`). The open hands (the Swollen's near hand, the Fool's hands, the hanging arms
  of the heap, the hand in the beetle heap) are `openHand` with knuckles and nails.

Holds that need IK: the Gravedigger (both hands on the spade; the spade is on hand_f), the Watchman (the door-bar on
hand_f, the near hand on its butt), the Chaplain (the cross on hand_f, the near hand lower on the pole), the Mason (the hod
rests on the torso and the near hand holds its pole), and the carter (his far hand on the horse's bridle while the head
bone moves).

## Pose tests (the attack from each Motion line; mirrored rig, a positive angle turns a bone clockwise on screen)

| Figure | Bones | Test | Result |
|---|---|---|---|
| The Rat King | 9: floor, mound, crest, mass_front, core, front_1..4 (62 layers) | surge (`mound -4, crest -5, mass_front -7, front_1 -18, front_2 14, front_3 -12, front_4 10`) | pass. The masses overlap at their cuts, the knot stays whole, and the front rats lunge and rear off the mass. |
| The Dead-Cart | 42 (69 layers): floor, cart, wheel_n/f, heap, arm_1..3, horse (hips, barrel, withers, neck, head, tail, 4 legs x 3), carter (pelvis, torso, head, hook, arms, legs) | seize (`heap -2, arm_1 24, arm_2 40, arm_3 30`, a foreleg stamps, the head nods) | pass. The arms stay on the heap and the leg cuts stay closed. |
| Barrow Chaplain | 20 | holy water strike (near arm flicks the bucket) | pass. The near hand leaves the pole (IK note above). |
| Pest-House Watchman | 19 (37 layers, including the apron) | door-bar blow (both arms swing the bar) | pass. The coat, apron and shelter stay closed. |
| Gravedigger | 20 | chop wind-up (arms raise the spade, the foot comes off the tread) | pass. The near hand needs IK onto the shaft. |
| The Swollen | 21 | beetle swing (far arm up) | pass |
| Court Fool | 21: + hood, point_1..3, marotte | head lifts, the points swing, a hand on the marotte | pass |
| The King's Hawk | 12: block, body, head, tail, wing_n/f_1..3, leg_n/f | bate (body lunges, wings open, talons forward) | pass. The leash is on the block and does not follow the leg. Animate it as a separate stretch. |
| Sexton Beetles | 14: mound, hand, beetle_1..12 | pour (beetles turn, the hand tips) | pass |
| Barrow Mason | 19 | mallet blow (far arm raised high) | pass |
| Rat-Catcher | 20 | pole swing (near arm and pole) | pass. The rats ride the pole bone. |

## Gate 2: style and detail

Course marks: frost is dominant (rime in the hollows and on the windward back, icicles hanging plumb, figures stilled);
toxin (grey-green mould, sores, buboes, fungal fur, grave caps, spores). Never items are absent: no clean crystals or
snowflakes, no slime, no glow. There are no eye motifs: the only eyes are filmed eyes under lids, the horse's eye half
under its blinker, the rats' small beads, and the hawk's small eye in its hood split. Gold appears only on the
Chaplain's processional cross (holy, worn dull). Red appears only on the Watchman's plague cross (doom).

Section 9 test ("which course did this, to whom, and does the bible say so?"): every row names the remnant of the
former self and the one mark pushed hard. Each mark is the bible's own. Nothing is taken for its own sake.

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Section 9 | Result |
|---|---|---|---|---|---|---|---|
| The Rat King | yes: a lumpy dome broken along the top by thrust-out heads, rats spilling at the flanks, the knot at the front | rime on the dead and the crest rats, icicles from the flanks and the knot, the knot frozen pale where it is not tarred; buboes, fur rotted in patches, mould on the limp dead and the knot, grave caps on the knot / none | 16 (12): the tail knot (16 looping tails, a 3-strand plait, tar runs and smears, filth caked in the crossings), grave rags wound round the knot, a long bone and finger bones bound into it, silver goblet, bent silver burial mask, frozen coins, bone comb, child's shoe, ring-mail sleeve, lead coffin plate with the name gnawed off, gnawed long bones jutting from the crest, skeleton rats along the floor, fleas on the front rats, a rat biting its neighbour, the dead hanging limp, claw scratches in the floor | backdrop, rats by region, knot, front rats | pass | remnant: ordinary grey rats and the grave goods they dragged in. Pushed: frost's freezing of the tails into one knot. | fixed (rebuilt, see below) |
| The Dead-Cart | yes: horse and cart under an uneven mound of the dead, arms over the side, the carter with his hook | rime on the heap's rear, the wheels, the horse's back and the coat; icicles from the cart bed, the feathering and the hems; toxin as dark staining on the shrouds and clothes, grave caps, buboes at the throat, mould in mane and tail / none | 17 (12): 21 individual dead in shrouds, shifts and tunics, a child's body, arms dangling over the sides, a split sack spilling grain and a whole one, spoked wheels with iron tyres (the far one buckled, with a broken spoke), linchpins and hub hoops, collar, hames and blinkers, saddle, belly band, breeching and crupper, trace chains, chalked tallies, shovel lashed to the side, rope over the heap, wooden rattle on the shaft, unlit lantern on a pole, dragging tail-chain, frozen ruts | heap (bodies, cloth), cart, horse, carter (skin, coat, rag) | pass (no green tint on the heap) | remnant: the cart, its harness and the carter's trade. Pushed: the heap of dead frozen into one creature (frost), stained by the sickness (toxin). | fixed (heap rebuilt, see below) |
| Barrow Chaplain | yes: the tall cross over the wide stiff bell of the cope and the tilted head | the cope frozen into a rigid bell, rime on the windward back, icicles on hems and cross arms, frost on the tonsure; the loaf bubo, mould at the lips and in the stubble, a mould tide to the knee, rot holes / none | 13 (10): cope orphrey furred with mould, silver morse, stole with one end torn, processional cross with crucifix figure (dull gilt), holy-water bucket with its water and sprinkler frozen, bone rosary, chained book of rites with pages frozen, reliquary pendant, candle stubs in the girdle, frost drips from the cross arms, iron ferrule, rot holes | skin, alb, stole, cope | pass (gilt only on the cross) | remnant: cope, stole, cross, rites. Pushed: toxin's bubo (bible). | fixed (bubo shape and size, book, arm under the cope, uneven folds) |
| Pest-House Watchman | yes: a man in an upright box worn like a shell, the door-bar raised | rime on the box's windward wall, the roof and the hat; icicles from roof, wall and padlock; breath frozen on the rag; mould blooming from the nail wounds and in the box's corners; buboes splitting the jack's seams; grave caps on the roof / none | 17 (10): box with front torn away and its near side wall in perspective, roof with thickness and rafter ends, strap D-rings at the shoulders, bent nails pointing in, red plague cross with plea, door-bar with hasp and staple, ring of keys, nail apron, claw hammer, padlock on chain, vinegar rag, lantern hook, studded split jack, straps and buckle, kettle hat dented, mould in corners | skin, jack, apron, box | pass (red only on the cross) | remnant: box, bar, keys, nails. Pushed: toxin out of the nail wounds (bible). | fixed (grip, cross size; rework: coat shaped over the body, shelter depth) |
| Gravedigger | yes: stooped man, long spade, foot on its blade | rime on the hump, rag and spade top; frozen clods; grave caps and mould fruiting from the back and shoulders / none | 12 (6): notched spade shod with iron, mattock slung on the back, lowering rope coil, slit lime sack, knotted head rag, earth-caked hose tied with twine, frozen clods, broken finger set crooked, tunic hitched through the belt, patch, iron strap on the spade, frozen earth thrown up | skin, tunic, hose, rag | pass | remnant: spade and mattock. Pushed: toxin's grave caps on the back (bible). | fixed (stains, blade, coil, sack, mattock) |
| The Swollen | yes: the arm held out stiff by the great swelling | the bubo rimed and glazed, icicles from it and the hems; frozen suds; black veins; mould at the lips; neck and groin buboes / none | 11 (6): laundry beetle worn pale, frozen sheet over the shoulder, headcloth, peg bag with pegs, lye scars on the knuckles, frozen suds, torn sleeve flap, sacking apron, pattens, scrape marks on the floor, mould tide on the shift | skin, shift, apron, sheet | pass | remnant: the laundress's beetle, sheet and pegs. Pushed: the armpit bubo (bible). | pass |
| Court Fool | yes: small slumped seated figure, three-pointed hood hanging forward, marotte across the knees | frost on every upturned surface, icicles from elbows, hood points and steps; mould in the armpit and groin; sores at the grin / none | 13 (6): three hood points with ice-packed bells, marotte carved with the king's crowned head, wrist bells, slapstick, frayed ruff, elbow patch, cracked face paint, torn hose, pointed shoes with bells, dais steps rimed, dropped silver cup frozen to the step, dagged hem | skin, motley, hood, ruff | pass (bone and grey-green motley) | remnant: motley, hood, marotte. Pushed: frost freezing him where he sat (bible). | fixed (pose per the bible change, foot, marotte) |
| The King's Hawk | yes: hooded falcon on its block, the plume rising | rime on the windward wing and block, feathers frozen into plates, icicles from the tail and jesses; feet swollen into sore pads, crop bubo, moult tufts with mould, mould on the plume / none | 10 (6): tooled hood with braces, plume, jesses with silver rings, leash to the iron ring, ice-packed bells, hood with a pale stitched rim and crown seam, turned oak block on an iron spike, leather cushion, dead mouse offering, broken flight feather, droppings frozen down the block | feathers, skin, leather | pass | remnant: the falconer's furniture. Pushed: frost stiffening the feathers. | fixed (eye size, feet; rework: hood and wing-edge contrast) |
| Sexton Beetles | yes: the frozen hand rising from the beetle heap | rime on the beetles' backs, one frozen on its back, the hand frozen grey; mould in the old beetles' joints, a fungal stalk from a dead one / none | 8 (6): ring on the hand, mites, frozen clods, grave linen scraps, a beetle dragging a finger bone, pale eggs, shroud rag on the arm, flicked earth | shells, earth, hand | pass (black, bone bands, mould) | an insect the bible lists. Pushed: the frozen hand. | fixed (legs: thick-based, jointed, planted) |
| Barrow Mason | yes: the loaded hod over the shoulder and the mallet | stone dust and frost in the beard, lime and rime on the apron and hod, icicles from the trough; knotted swollen knuckles, mould in the cracks of the skin / none | 12 (6): hod with three squared stones, mallet bound in iron, trowel, chisel roll, plumb bob, set square, lead mark tag, cloth cap, split thumbnail, frozen mortar lumps, leg wraps, broken nose | skin, tunic, apron, wraps | pass | remnant: the mason's tools. Pushed: toxin's knotted hands (bible). | fixed (hod position, lime stains, arm) |
| Rat-Catcher | yes: the pole of hanging rats over the shoulder | rats rimed and furred with mould, icicles from their heads and the trap; sores up the forearms and neck, the groin bubo / none | 12 (6): twelve dead rats tied by their tails (each its own build), the tails counted at the belt, gauntlets bitten through at the fingers, lidded poison pot with a warning skull, wicker cage-trap with an iron drop door and a rat inside, the frozen terrier on a cord, wool hood with liripipe, laced jerkin, belt buckle, torn hose, hood rime | skin, shirt, jerkin, hood | pass | remnant: pole, trap, tails. Pushed: toxin's sores and bubo (bible). | fixed (rats readable, trap, pole height) |

Director's notes, checked:
- Court Fool seated and slumped: yes: knees up and splayed, forearms on the knees, hands hanging, the marotte in the lap,
  the head sunk forward between the shoulders.
- Rat King: a knotted mass of individual, varied rats, not a blob or ball, no clones. The first build (about 800 small
  packed rats) read as gravel. Rebuilt with 89 large modelled rats (`bigRat`, counted from the build) and 6 skeletons
  along the floor. Each rat has its own size, girth, tone and pose. Strain rats are stretched outward with the head
  thrust out. Claw rats reach with their forepaws. Bite rats have their jaws in a neighbour. The limp dead hang head-down.
  The edge rats are pushed outward so the heads break the crest and spill at the flanks. The outline is a lumpy dome with
  a broken top. The focal point is the knot at the centre-front: a tarred core, 16 thick tails looping over and under, a
  3-strand plait across the front, tar runs and smears with highlights, filth caked in the crossings, three grave rags
  wound round it, and a long bone and finger bones bound in. Eleven rats ring it with curved tails running in. Value
  modelling: the crest rats are lit and the lower rats darker by height. Each rat has a lit back and a dark belly. A
  dark underside and a shadowed far flank are toned over the dome. The gaps between bodies are a crosshatched dark mass.
- Dead-Cart: a vehicle with real depth. Every cart part is placed in x, height and depth and projected (vanishing point
  at chest height off the frame). The planks have thickness. The floor's near edge, the front board's outer face and the
  receding far side all show. The wheels have tyres with a tread band, felloes, 12 tapered spokes, a hub standing out
  with two iron hoops, the axle end and a linchpin; the far wheel is smaller, higher and offset. The axle beam and both
  shafts are in place. The horse is built on the Plague Wolf's habits: a deep starved barrel with ribs, a hip rack and a
  sunk flank. Each leg is one continuous muscled outline from forearm or gaskin through the knee or angular hock, a lean
  cannon, the fetlock and a sloped pastern to a shod hoof, cut over three bones. The first leg pass was tubes with ball
  joints and was rebuilt. The first heap was a neat log stack. It now has tilted, uneven courses, bodies of every length,
  ends that make a lumpy outline, a body sliding off the rear, and faces fallen open. The coordinator found that heap a
  tower out of frame with a green mould tint, and it was rebuilt again. It is now 21 individual dead (`corpse`) in a mound about
  2 to 2.5 humans tall above the bed. They are in shrouds, shifts and tunics of varied colour, with arms, legs, heads,
  hands and feet at different angles, and cloth folds. There is one child's body, two sacks (one split), three arms
  dangling over the side, and a rope over the top. There are no rows and no repeats. Toxin shows only as dark staining on
  the cloth.
- Pest-House Watchman (rework): the coat is shaped over the body: a shoulder slope, chest, belly and the cinch at the
  belt, with quilting rows bowing round the form, toned planes, folds bunching at the belt, an iron buckle and shoulder
  seams. The shelter has its near side wall in perspective (converging plank seams, battens, front-edge plank thickness),
  a roof slab with thickness, a shadowed underside, rafter ends and a fascia, and iron D-ring fittings where the straps
  meet the shoulders.
- King's Hawk (rework): darker wings with heavier ink at the edges and dark tips, and a dark hood with a pale stitched
  rim, so the hood and wings read at about 95 px in game.
- King's Hawk: the wings come from the reviewed kit_VI builder. The eye is a 3 px dark filmed eye under a brow stroke,
  showing through a split in the hood's eye-piece, because the bible keeps the hood on.
- Sexton Beetles: Pit Crawler legs (thick coxa and femur, spiny tibia, jointed tarsus, lit ridges, joint membranes), the
  near legs planted. The pronotum and elytra have a gloss and a rime edge for depth.
- Rulers: 16 and 17 secondary details. Neither shares a silhouette with the Barrow King (a seated king in a throne) or with
  each other (a lumpy dome of rats round a knot, and a horse and cart under a mound of the dead).

Silhouettes (`sil.png`, all 19): no two share a silhouette. The new humans are a stooped spade-and-foot, a bubo-arm
lurching with a bat, a seated slump on steps, a hod carrier and a rat pole. They are distinct from the Draugr (axe over
the hump), the Leper (bell aloft) and the Wight (shaggy reacher). The elites are a cross over a bell and a man in a box.

## Still open
- Rat King: the rats are stylised (smooth pill-shaped bodies with fur fringes rather than painted fur). They read as
  rats at sheet size and at 2x, but they are simpler than the first-batch rulers' surfaces.
- Dead-Cart: the tail-board's outer face is away from the camera in the reviewed three-quarter-front view, so the
  chalked tallies are on the near side board. The carter's coat is the plainest large area on the figure. The heap
  leans a little toward the rear above the bed.
- Court Fool: the carved king's head on the marotte is small and reads as a knob at game size.
- King's Hawk: true size makes it about 95 px tall in game. The hood, wings, plume and block now carry it.
- The Watchman's far upper arm is hidden behind the torso by the tucked bar grip. In a swing, the hand_f chain carries the
  bar and the near hand needs IK.
- Holds that need IK in animation: Gravedigger spade, Watchman bar, Chaplain cross, Mason hod pole, carter bridle; the
  Hawk's leash is on the block and does not follow the leg.

## Independent review (2026-11-23)

Reviewed fresh against MAKER_BRIEF, GUIDE sections 8 and 9, LOGIC_CHECKLIST, the bible entries and the references (the
Drowned King, the first batch's Barrow King and Plague Wolf, the reviewed limb and wing builders). Every figure was
composited on a mid-dark ground and read at 2 to 3x on the head, hands, held objects and feet, then at sheet size and in
`sil.png`. Every changed figure was re-rendered, re-rigged (`render_rig.js`: no MISSING JOINTS, every layer's bone has a
joint, `ground` = canvas h - 30) and pose-tested; the final builds print no grip warnings. Seeds are 920 to 930 in bible
order and every entry has `flip: true`. Because the kit changes below (torn hems, sleeve shape) reach every sleeved arm,
all eleven figures were re-rendered and re-rigged, and the sheets rebuilt with `worlds/sheet_IX_b.py`.

Kit changes (`worlds/kit_IX_b.js`):
- `bigRat()` rebuilt as a real rat (see the Rat King below). It adds a 'hung' pose (dead, hanging by the tail), now used on
  the Rat-Catcher's pole. A per-rat `batcher()` writes the rat's small strokes as a few combined paths. Without it the Rat
  King's 30 MB SVG timed out in the rig export.
- `ratTail()` tapers to a fine point (86 percent), with close, staggered, bowed scale rings and a pale underside.
- `sleeveShape()` torn hems are irregular: tongues of random length and spacing, some split. Before, they alternated in a
  regular sawtooth.
- `arm()`: the sleeve swells over the shoulder and biceps, pinches at the elbow and flares at the cuff, with drag folds.
  Before, it was an even tube. New options `point` and `model` add modelled muscle on bare arms: the deltoid's edge, the
  biceps/triceps groove, lit and shadowed sides, the elbow knob and the forearm's belly.
- New `deadBody()`, `deadArm()` and `deadLeg()` for the cart's heap (see the Dead-Cart below). `corpse()` is kept but no
  longer used.

### Gate 1: logic audit (reviewer)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Finding and fix, re-check |
|---|---|---|---|---|---|---|---|
| The Rat King | pass | n/a | n/a | pass | fixed | pass | The rebuilt rats' heads grow out of the shoulders on one outline. Tails were straight skewers to the knot over bare backdrop; they now curve and run under the rats in front (a fifth to a quarter of the way to the knot). The flank icicles hung over rat faces; they now hang from the front rats' bellies. Re-check: pass at 2x and sheet size. |
| The Dead-Cart | pass | pass | pass | fixed | fixed | pass | The top body floated with its arms spread, and the others lay at random angles with their limbs flung out. The heap is rebuilt so that every body rests on the ones below (detail below). Limbs over air hang plumb; limbs on the pile follow its slope downhill; heads loll toward the floor (25 to 85 percent toward plumb). Dead feet fall slack, and any foot that would point up is turned down. The rope lies under the outer dead, frozen in, instead of arching over the pile like a hood. Carter: the bridle and hook grips pass (`B.grip`, no warning). Re-check: pass. |
| Barrow Chaplain | pass | pass | pass | pass | pass | pass | none (the bubo was reshaped, see gate 2) |
| Pest-House Watchman | pass | n/a | pass | pass | pass | pass | none |
| Gravedigger | pass | n/a | pass | pass | pass | pass | none |
| The Swollen | pass | n/a | pass | pass | pass | pass | none |
| Court Fool | pass | pass | n/a | pass | fixed | pass | The marotte's carved head lay under the near hand and forearm, so it read as a knob. The stick now runs from the lap out past the knees, so the head lies clear and face up. Re-check: pass. |
| The King's Hawk | pass | n/a | n/a | pass | pass | pass | none |
| Sexton Beetles | pass | n/a | n/a | pass | pass | pass | none |
| Barrow Mason | pass | n/a | fixed | pass | pass | pass | The near arm was cocked out sideways with the forearm folded back behind the upper arm (IK sign +1, hand high on the pole). The elbow now hangs down at his side, and the hand grips the hod pole lower (t 0.62, IK -1). The grip goes through `B.grip`, square, with no warning. Re-check: pass. |
| Rat-Catcher | pass | n/a | pass | pass | pass | pass | none (the rats were redrawn, see gate 2) |

Palette scan (pixels over 200 alpha): red appears only on the Watchman's roof fascia (the plague cross and plea: doom),
0.47 percent of his pixels. Unnamed rust was found and removed: iron corrosion on the Watchman's kettle hat, door-bar and
padlock; on the Gravedigger's spade and mattock; on the Rat King's mail sleeve; and on the cart's shovel. It is now dark
grey-green pitting, `mix(ironD, mouldD)`. A rust-dyed tunic on the heap is now leather-brown wool. Gold appears only on the
Chaplain's processional cross (holy). There are no eye motifs: the rats' eyes are small beads under a brow, and the dead
have shut lids. Pink appears only, desaturated, on the rats' noses, feet and ears.

### Gate 2: style and detail (reviewer)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| The Rat King | The rats were cartoonish: smooth tube bodies of even width; tract lines across the back that read as woodlouse segments; regular sawtooth spikes along the spine; flat pink disc ears; a blunt cone head with an ink seam at the neck. | `bigRat` rebuilt. The spine is hunched and peaks over the haunch. The body is widest at the haunch, tucked at the waist and narrowing through the shoulders. Head and body are one outline: a rounded skull tapering to a pointed snout, with a small dark bead eye under a brow and one glint. The ears are thin cupped leaves with a pinched root, in dull grey-pink: a thick lit back rim, a shadowed bowl darkest at the root, a thin front rim and faint veins. The fur is directional ink hatching (700+ strokes per large rat) lying back along the body, sweeping down the flanks and wrapping the haunch. Wet clumps are drawn to points along the spine, hang from the belly and sit inside the coat with a sheen. Mange patches are grey scabbed skin with crusted streaks (no round dots) and a ragged fur edge. Feet are plantigrade hind feet and small clawed hands, desaturated grey-pink. Tails are scaly and taper to a point. The rats are denser (172 plus the knot ring), so the backdrop no longer shows and the dome silhouette holds. The knot stays focal at the centre-front. Dead rats are rarer (14 percent) and their heads curl less. | pass at 2x and sheet size; grit 16 (unchanged list) |
| The Dead-Cart | The heap bodies had tube limbs and read as mannequins. The top figure floated with its arms spread. The heap was a column. The carter's coat was plain. | Heap: about 17 dead in a broad mound, laid along a lumped outline about 740 px above the side boards (it was about 1330). Each pelvis sits just inside the surface, the spine follows it downhill, and the thighs and shins follow it the other way. Weighted poses: one lies along the bed with its head hanging over the tail-board; one is face down with its shins hanging over the end; one is draped belly-down over the crest with its arms plumb; others lie head-first down the rear slope or slide feet-first toward the front board. Deeper layers, two shrouds, a child's bundle on top, and faces and hands half-seen in the dark mass fill it. Modelled anatomy: a torso with chest, small of the back, belly and buttock; a biceps; a forearm that swells below the elbow and narrows to a knobbed wrist, with a tendon and the ulna's ridge; a thigh, kneecap, shin bone, a calf that bellies and an ankle bone; hose bunched behind the knee; slack feet with heel, arch and toes; hands curled with knuckles and nails (`openHand`). Faces are grey and waxen at faceShade 0.8, with sunk eyes, shut lids, a slack jaw, a grey-blue lip, and a waxen sheen on the brow and cheekbone. Cloth folds fall toward the ground; there are stains, rents with skin through them, and darned patches. The skirts follow the thighs (they were wide slabs). The three seizing arms over the side board use `deadArm`. Carter's coat: drag folds from the belt to the hem, cloth bunched at the belt, tension folds toward the far arm, crazing on the waxed leather, scuffed bright seams and edges, horn toggles with loops, a stitched patch, lime splashes, grave-earth to the knee and a split hem. Canvas: 2400 x 1800 (ground 1770); the 340 px lift is gone. | pass at sheet size; at 2x the bodies are individual and weighted (see still open) |
| Barrow Chaplain | The loaf bubo was a smooth ellipse (a ball). The cope's frozen flutes were ruler-straight parallel stripes. | The bubo hangs from a pinched root under the ear and sags onto the cope's collar, in two lobes split by a cleft, with skin gathered under the jaw and pressed flat on the collar. The flutes fan from the shoulders to the bell, each bowing, some splitting, with a lit ridge on the key side and five frozen crumples across them. | pass |
| Pest-House Watchman | The near arm was an even-width tube. There was rust (not in the bible) on the hat, bar and padlock. | The sleeve swells at the shoulder, pinches at the elbow and flares at the cuff, with drag folds (kit `arm`). The rust is now iron pitting. | pass |
| Gravedigger | Rust on the spade and mattock; regular sawtooth hems. | Pitting; irregular torn hems (kit). | pass |
| The Swollen | The torn sleeve over the bubo was a regular sawtooth. The bubo read as a ball. | The hem is irregular (kit). The bubo is a heavy pear sagging from a pinched armpit root, with a second lobe, the fold between the lobes, skin gathered at the root and stretch marks. | pass |
| Court Fool | The marotte's king's head read as a knob (director). | Carved face-on, lying face up, turned to the three-quarter camera: a long solemn face with lidded carved eyes, the nose, a moustache, a beard cut in locks, darkened by handling, and a collar where the stick enters. The crown is a band and five knobbed points in tarnished silver leaf, with ice-packed bells at the collar. About 60 px, two thirds of his own head. | pass at 2x; reads as a crowned head at sheet size |
| The King's Hawk | Passes at 2x: hood, plume, jesses, bells, swollen talons, block. | none | pass (see still open) |
| Sexton Beetles | Passes: thick jointed planted legs, banded elytra, the hand with its ring. | none | pass |
| Barrow Mason | The bare near upper arm read as a flat axe blade (a slab limb). | Re-posed (see gate 1) and modelled with `arm({ model })`: the deltoid's edge, the biceps/triceps groove, light and shadow sides, the elbow knob, the forearm's belly. The far arm likewise. | pass |
| Rat-Catcher | The dozen hanging rats were carrot shapes with mauve balls, below the rebuilt Rat King. | Each is now `bigRat` in the 'hung' pose: hanging by its tail, head straight down, legs dangling, rimed, mould-furred, with whiskers and incisors. | pass |

Section 9 line: unchanged from the maker's table. Every mark is the bible's own (frost stills and rimes; toxin ripens the
buboes, mange, mould and fruiting bodies). Nothing was added for horror alone, and no rim light or fog was added.

Silhouettes (`sil.png`, all 19): no two share a silhouette. The Rat King is a bristling dome. The Dead-Cart is horse and
cart under a lumped mound broken by a reaching arm and lolling heads. Both are distinct from the Barrow King's throne.

### Pose tests (re-run for every figure)

| Figure | Test | Result |
|---|---|---|
| The Rat King | surge (`mound -4, crest -5, mass_front -7, front_1 -18, front_2 14, front_3 -12, front_4 10`) | pass |
| The Dead-Cart | seize (`heap -2, arm_1 24, arm_2 40, arm_3 30, leg_fn_1 -12, leg_fn_2 10, head 6`) | pass: the arms swing from the board's edge and stay attached |
| Barrow Chaplain | holy water (`upperarm_n -35, forearm_n -45, bucket 25`) | pass |
| Pest-House Watchman | bar blow (`torso -6, upperarm_f -35, forearm_f -30, upperarm_n -30, forearm_n -25, bar -15`) | pass; the near hand leaves the bar (IK) |
| Gravedigger | chop wind-up | pass; the near hand needs IK onto the shaft |
| The Swollen | beetle swing (`upperarm_f -70, forearm_f -35`) | pass |
| Court Fool | head lift and jingle (`head -12, point_1..3, marotte -5`) | pass |
| The King's Hawk | bate (`body -14, head 10, wings, tail`) | pass |
| Sexton Beetles | pour | pass |
| Barrow Mason | mallet raised (`upperarm_f -110, forearm_f -40`) | pass |
| Rat-Catcher | pole swing (`upperarm_n -25, forearm_n -20, pole -10`) | pass; the rats ride the pole bone, so add a counter-rotation key to keep them plumb |

### Still open (reviewer)
- The Dead-Cart's heap is now a mound of individual, weighted dead with modelled limbs and hands, but at 2x the inner
  layers still read as a tangle of limbs. The torsos are clothed profiles without much modelling. It is below the Drowned
  King's level of anatomy, and the dense middle is the weakest area. The mound is lower (about 2.1 human heights to its
  top) than the bible's 3.5, by the director's call for a mound.
- The Rat King's rats now read as real rats, but they repeat one body plan in four poses. A few rats seen from above or
  curled would break the rhythm further.
- The King's Hawk's crop bubo is still a flat dark disc at the throat.
- The horse was not changed in this pass.
- Holds that need IK: the Gravedigger's spade (near hand), the Watchman's door-bar (near hand), the Chaplain's cross (near
  hand), the Mason's hod pole (the hod rests on the torso; the near hand holds the pole), the carter's bridle (the far hand
  while the horse's head moves). The Rat-Catcher's rats and the Hawk's leash need counter-rotation keys.

## Ruler upgrade pass (2026-11-23): The Dead-Cart

Director's note: at 2x the heap's inner layers read as a tangle of limbs and the torsos are lightly modelled. Give each
body a readable torso (ribcage, belly sag, shoulder), separate the bodies by value (lit tops, dark gaps, cast shadows onto
the body below), keep the mound height, cart and horse.

What changed (`kit_IX_b.js`: `deadBody`, `deadBodyDraw`, `deadArm`, `deadLeg`; `world_IX_b.js`: the heap section only):
- Torso rebuilt as one outline whose profile carries the anatomy: buttock, waist pinch, the belly (sagging toward the floor
  when the body lies face down, hollow under the ribs when it lies on its back), the ribcage barrel with the step of its
  lower edge, the shoulder blade's hump at the back, the chest. Inside: a lit band on the side facing the key light and a
  core shadow on the other; five ribs across the flank with a dark groove and a lit ridge (the linen clings to them); the
  costal edge; the belly's sag fold and the shadow under it; the shoulder blade's edge and lit plane; spine groove and
  vertebrae when the back faces up. Shifts (80%) and tunics (45%) are torn open over the chest, grey skin with the ribs,
  breastbone and collarbone showing. The shoulders moved up the ribcage (u 0.35) so the ribs show under the arm; the near
  sleeve carries the deltoid (a lit crown, a shadow and a fold under it). Shrouded bodies get their own value plan and the
  ribs pressing through the linen.
- Value separation: each body is drawn as one group that first throws a blurred shadow of its own silhouette away from
  the key light (about 30 px) plus a dark gap round its edge, both clipped to the mound, onto the bodies already drawn under
  it. Bodies deep in the pile are toned down by their depth (`depth`, from the inset; at most 42%), so the outer dead read
  lit over a dark core and the inner limbs recede instead of tangling.
- Smaller fixes: kneecaps were round grey discs on dark hose (they read as holes or eyes): now a lit edge. Darned patches were
  regular hexagons: now ragged. The split sack's grain was a row of bright dots: now a trickle. The rime follows each
  body's actual upper edge.
- Kept: mound outline and height, cart, horse, carter, side arms, rig and bones. The random stream after the heap is
  replayed from the reviewed count, so everything drawn after it is pixel-identical (diff outside the heap: 7 px).

Before / after: before, at 2x, the middle of the pile was an evenly lit field of tube limbs and clothed profiles; at sheet
size the heap was one grey texture. After, the outer dead read as bodies with backs, ribs, shoulders and sagging bellies,
lit on top over a dark core with shadowed gaps; at sheet size the mound reads as stacked bodies with depth.

Checks: render, 2x and sheet size against the Drowned King; rig 69 layers, 42 bones, no MISSING JOINTS; seize pose
(`heap -2, arm_1 24, arm_2 40, arm_3 30, leg_fn_1 -12, leg_fn_2 10, head 6`) closed; sheets rebuilt (`sheet_IX_b.py`).
Still short: the hanging arms repeat one open-palm hand; the deeper bodies are still mannequin-smooth limbs (now in shadow).

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| The Rat King (and the Rat-Catcher's hung rats, same helper) | rats share one body plan in four poses | `kit_IX_b.bigRat` gives each rat its own build and carriage from a local PRNG seeded by its place: body length 0.82 to 1.2 (lean to stocky), girth 0.84 to 1.26, hump 0.8 to 1.25, head size, a bend through the spine (curled, twisting, arched; the rump end fixed so every tail root stays attached), and one of three coats (grey, brown, near-black). The mound's layout and every other random draw are unchanged. | pass. At 0.3x the mound reads as many different rats |

Both rigs re-exported (no MISSING JOINTS); Rat King surge pose (`mound -4, crest -5, mass_front -7, front_1 -18,
front_2 14, front_3 -12, front_4 10`): attached. Sheets rebuilt (`worlds/sheet_IX_b.py`). Still open: the
stockiest rats can read as pear shapes at full size.
