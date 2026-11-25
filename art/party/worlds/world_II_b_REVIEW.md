# World II, The Rotmire, second batch: review

These are the 11 entries of `bible/world_II_rotmire.md` that were not in `worlds/world_II.js`. With these, World II has
19 creatures: 3 rulers, 4 elites and 12 cast.

- **Code.** The builders are in `worlds/world_II_b.js` and the new helpers in `worlds/kit_II_b.js`. Neither
  `world_II.js` nor `kit_II.js` was edited; both are required and reused, including the palette, the base, the
  textures, `crease`, `stains`, `softTone`, `hairClump`, the leather crackle, `pustule`, `bracket`, `toadstool`,
  `fullLeg` and `fullArm`.
- **Seeds.** 220 + index, in bible order:

  | Seed | Creature |
  |---|---|
  | 220 | The Stilt Hall |
  | 221 | The Old Heron |
  | 222 | The Tithe Reeve |
  | 223 | The Midden Sow |
  | 224 | Eel-Catcher |
  | 225 | Stilt-Fowler |
  | 226 | Turf-Wife |
  | 227 | Frog-Catcher |
  | 228 | Lantern Gnats |
  | 229 | Sin-Eater |
  | 230 | Leech-Barber |

- **Facing and canvases.** Every creature is drawn facing right with `kit.foeBase` (through `kit_II.base`) and set to
  `flip: true`. Canvases come from `kit.TIERS`. The ground line is the canvas height minus 30 everywhere; the `ground`
  value in every rig.json was checked.
- **Outputs.**

  | What | Where |
  |---|---|
  | Renders and silhouettes | `out/worlds/world_II_b_<key>.png` and `_sil.png` |
  | Rigs | `out/rig/worlds/world_II_b_<key>/` |
  | Pose tests | `out/worlds/II_b/<key>_pose.png` |
  | The 11 at true scale, with the Drowned Thrall at 1.0 | `out/worlds/II_b/sheet.png` |
  | All 19 World II creatures plus the Thrall | `out/worlds/II_b/sheet19.png` |
  | All 19 silhouettes, a human about 190 px tall | `out/worlds/II_b/sil.png` |

- **Rig checks.** All 11 rigs export with no `MISSING JOINTS`. Each rig's check.png matches its render: the mean
  difference over grey is at most 0.0009. The final render prints no `grip` warnings.
- **Pose sign convention.** This is the same as in `world_II_REVIEW.md`. Rigs are exported mirrored, so they face
  left. A positive angle turns a bone clockwise on screen.

New helpers in `kit_II_b.js`:

| Helper | What it does |
|---|---|
| `humanJoints` | Declares the standard humanoid joints. |
| `bareLeg`, `tubeLeg`, `arm` | Draw one outline split at the joints with `dirAC.split`. |
| `face` | Calls `B.head` with face shading at 0.78, then adds soft modelling, tanning stains, pores and forehead creases. |
| `clothWear`, `folds` | Wear and folds that break up cloth areas. |
| `hem`, `holes`, `mouldFur` | A rotted hem, holes through cloth, and mould fur along an edge (toxin's broken outline). |
| `mycelium` | White threads running through timber. |
| `leech` | The Leech Swarm's leech build, so the Barber's leeches are the same animal. |
| `eel` | A live eel, or a dried tithe eel. |
| `eelTrap` | A willow eel trap. |
| `tally` | A notched tally stick. |
| `frogCharm` | A hag's twine charm of frog bones. |
| `plume` | A feather lock. |
| `swelling` | Stretched, veined, blistered skin for the goitre, the gut, the crop and the throat pouch. |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items:
1. Head, neck and spine. For non-humanoids: jaws on a hinge and segments on one spine.
2. Objects face their user, and gaze.
3. Grips and hands.
4. Weight and balance.
5. Contact and attachment.
6. Facing and light.

"Fixed" means the item failed during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Stilt Hall | n/a (no head: the door is the face) | pass | fixed | fixed | pass | pass |
| The Old Heron | fixed | pass | n/a | pass | pass | pass |
| The Tithe Reeve | pass | pass (see note) | pass | pass (lean is mild) | fixed | pass |
| The Midden Sow | pass | n/a | n/a | pass | pass | pass |
| Eel-Catcher | pass | fixed | pass | fixed | fixed | pass |
| Stilt-Fowler | pass | pass | pass | fixed | fixed | pass |
| Turf-Wife | pass | n/a | pass | pass | fixed | pass |
| Frog-Catcher | pass | pass | fixed | pass | fixed | pass |
| Lantern Gnats | n/a | n/a | n/a | pass | pass | pass |
| Sin-Eater | pass | pass | pass | pass | pass | pass |
| Leech-Barber | pass | pass | pass | pass | pass | pass |

Notes on the rows:
- **Stilt Hall.**
  - Item 1: the jaw hinge check does not apply; the doorway is the face.
  - Item 5: the ladle is held by the fist. The eel traps hang on cords from the wall plate. The lantern hangs on an
    iron hook. The dog hangs by its rope from a rope round pile 3. The charm is knotted round pile 1. The ladder hangs
    from the sill. The tally sticks are nailed on.
- **Old Heron.**
  - Item 1: the neck is one S-curve split across three bones.
  - Item 4: the centre of mass sits over the toes of the standing foot. The crop is forward and the body is back.
  - Item 5: the net lies over the wing. The bail ring is hooked on a claw. The charm is round the drawn-up leg. The
    strap is round the ankle.
- **Tithe Reeve.**
  - Item 2: he presents the tally to the hero, so it faces its recipient. That is the point of the gesture.
  - Item 3: the pole fist and the tally fist both go through `B.grip`.
  - Item 5: the pole rests on the far shoulder. The keys hang on a ring from the belt.
- **Midden Sow.**
  - Item 1: the jaw sits on its hinge.
  - Item 4: the four legs bear the weight, with the hooves in the mud and the forelegs under the shoulders.
  - Item 5: the chain runs from the nose ring to the mud. The boot is caught on the tusk. The pen panel hangs by a cord
    over the ridge.
- **Eel-Catcher.** Item 5: the trap's strap runs over the shoulder. The wader is tied to the belt.
- **Stilt-Fowler.** Item 5: the decoy and the pouch hang on cords. The ducks hang by their tied necks.
- **Turf-Wife.**
  - Item 3: two hands on one stick.
  - Item 5: the head strap runs to the frame, and the shoulder straps run to the frame.
- **Frog-Catcher.** Item 5: the cage hangs from the belt cord.
- **Lantern Gnats.** Item 5: the lantern hangs plumb on a twine loop from the bent pole.
- **Sin-Eater.**
  - Item 2: his mouth is on the loaf and his eyes look down into it.
  - Item 3: the near hand cups the loaf from below. The far hand's fingertips hook over its top.
- **Leech-Barber.**
  - Item 3: both palms are open and up, and hold nothing.
  - Item 5: the jar's strap runs from the far shoulder. The bowl hangs on a cord.

What failed and how it was fixed:

- **Eel-Catcher.**
  - Item 2 (gaze). The tines were about 60 degrees below his eye line. The head is now bowed 0.9 rad. The eye to the
    tines is about 21 degrees off the head's axis.
  - Pole through the head (GUIDE section 8). The glaive's butt ran past the back of his head and the cheek. The pole
    now ends just above the near grip.
  - Item 4. The first build stood on nearly straight legs, which is not a wading stance. The pelvis is lowered and both
    knees are bent, with the weight over the front foot.
  - Item 5. The trap now hangs diagonally across the back on a strap that crosses the chest.
- **Frog-Catcher.**
  - Item 3. The sack-neck fist first gripped along the forearm (81 degrees off square) and covered the throat pouch,
    which is the signature. The fist now sits on top of the near shoulder, with the twisted neck running down his back
    to the sack. The forearm comes up from an elbow held forward, so it is square to the neck.
  - Layering. The pouch is drawn over the arm.
- **Stilt Hall.**
  - Item 3. The old woman's ladle warned 59 degrees off square. The ladle now runs square to her forearm through the
    fist, with the bowl raised.
  - Item 4. The front piles were barely bowed and the house stood level, against the bible's "leaning toward the
    company; weight on the front piles, bowed and splayed". The house now tilts 0.08 rad toward the front. Piles 1
    and 5 are bowed 40 to 46 px and splayed forward.
- **Old Heron.** Item 1. The neck was built as three separate chain pieces that read as stacked boxes. It is now one
  spline S-curve split across `neck_1` to `neck_3` with `dirAC.split`.
- **Stilt-Fowler.**
  - Item 4. Both stilts first ran parallel. Each locked leg is now one straight line from the hip through the knee to
    the stilt foot, in an A-frame. The man leans on the net pole as a third leg.
  - Item 5. The brace of ducks hung behind the torso and could not be read. It now hangs by the tied necks down the
    back, past the back's outline.
- **Turf-Wife.** Item 5. The stack stood clear of her back, but the bible says the bottom sods have fused with her
    shoulders. The frame now sits on her upper back, and moss and toadstools grow over the join.
- **Tithe Reeve.** Item 5. The goitre first sat inside the chest and was covered by the near arm. It now hangs from
  under the jaw, out over the collar and onto the chest. It is drawn over the arm. The far fist was moved down off the
  face line.

## Pose tests (the attack from each Motion line), `out/worlds/II_b/<key>_pose.png`

| Figure | Bones | Pose | Result |
|---|---|---|---|
| The Stilt Hall | 25: hall (pivot at the house body), pile_1..8 _a/_b, thatch, folk, ladder, lantern, traps, dog, water, punt | `pile_1_a 30`, `pile_1_b -40`, `hall -3`, `folk -8`, `pile_5_a 6` | Pass: the front pile lifts to stamp and the household's arms reach out of the doorway. The piles are split at the upper burl, and nothing tears at the sill. |
| The Old Heron | 17: body (pivot at the hip), leg_n/leg_f 1-3, wing, net, neck_1-3, head, jaw, crest, crop, plumes | `neck_1 -60`, `neck_2 -93`, `neck_3 51`, `head 60` | Pass: the neck unfolds and the beak spears down past the crop to the ground. The neck passes behind the crop, so Godot needs a z-index override in the strike frames. |
| The Tithe Reeve | 21: standard + pole, tally, goitre, hat, gown, keys | `upperarm_f 26`, `forearm_f 14`, `pole -36`, `torso 6` | Pass: the wind-up lifts the eel pole off the shoulder. It passes behind the head (it is drawn under it). The eels turn with the pole; a plumb hang would need a counter-rotation key. |
| The Midden Sow | 22: spine_1/2, neck, head, jaw, ear_n/f, chain, tail, pen, 4 legs × 3 | charge: `spine_2 -6`, `neck -10`, `head -12`, legs striding, `jaw -8` | Pass: the barrel is split at the loin and stays closed. |
| Eel-Catcher | 18: standard + glaive (hand_n), trap, skirt | downward stab: `torso -8`, arms pushing down | Pass. The far hand needs IK onto the glaive. |
| Stilt-Fowler | 20: standard (shin carries the shin and the stilt) + netpole, ducks, decoy, pouch, hood | net thrown down: both arms up, `netpole -30` | Pass. The far hand separates from the pole (IK). At the top of the throw the raised arms are close to the face. |
| Turf-Wife | 19: standard + stack, stick, skirt, cup | the stack toppling: `torso -12`, `stack -14` | Pass. The top of the stack leaves the canvas top. |
| Frog-Catcher | 19: standard + sack, spear, pouch, cage | croak: `head 14` | Pass. The pouch filling is a scale key on `pouch`. |
| Lantern Gnats | 10: ground, pole, lantern, swarm, tail_1/2, gnat_1-4 | `swarm -20`, `tail_1 15`, `tail_2 10`, gnats lunging | Pass. Breathing is a scale key on `swarm`. |
| Sin-Eater | 20: standard + loaf, cloak, coins, bowl, scarf | lurching bite: `torso -14`, `head -10` | Pass. |
| Leech-Barber | 19: standard + apron, jar, bowl, teeth | grab: arms forward, `torso -10` | Pass. |

## Gate 2: style and detail (GUIDE sections 1, 8 and 9 and the bible entry)

Course marks:
- **Toxin:** swelling, pustules, fungus, fruiting bodies, mould fur, rotted holes.
- **Water:** bog-tanned leather skin, black-soaked wood, wrinkling, wet plumb hang, preservation.

Never items: slime puddles, neon glow, fish faces. Signature at 190 px is judged from `sil.png`.

The section 9 test is: *which course did this, to whom, and does the bible say so?* The section 9 column answers it
for each figure:
- (a) the former self kept readable;
- (b) the one part pushed hard, which is the course's mark;
- (c) the outline broken the way the course breaks it.

| Figure | Signature at 190 px | Course marks / Never | Grit (need) | Section 9 | Result |
|---|---|---|---|---|---|
| The Stilt Hall | yes: a thatched long house on bowed legs | burls, shelf fungus, mould fur, mycelium, blistered daub; black slick piles, tanned household / none | 20 (12) | (a) the moot-hall: thatch, wattle and daub, door, ladder, tithe traps, tally; (b) the piles ripened into legs; (c) the eave breaks into hanging reed and moss, and mould fur at the waterline | pass |
| The Old Heron | yes: S-neck over the hanging crop on one leg | the swollen crop with swallowed things, blisters, mould in the mats; scaled leather legs / no fish face | 16 (12) | (a) a heron; (b) the crop; (c) wet locks hang plumb under the body, and the plumes are rotted into holes | pass, polish open |
| The Tithe Reeve | yes: goitre on a stout body, the eel pole across the shoulder | goitre, pustules, toadstool ring; tanned skin, dried eels / none | 22 (10) | (a) the reeve's gown, keys, tally, chain; (b) the goitre; (c) the gown hem rotted into holes and mould fur | pass |
| The Midden Sow | yes: long low hunched mass under a fungus crest, head low | bracket shelves and puffballs, spores, pustules; tanned hide / none | 14 (10) | (a) the pen sow: notched ears, nose ring, pen panel; (b) the ridge of fungus; (c) the shelf crest breaks the back's outline | pass, weakest figure (below) |
| Eel-Catcher | yes: comb glaive held low, trap on the back | swollen forearms, blisters, fungal knots; tanned skin, slumped wader / none | 13 (6) | (a) glaive, trap, waders; (b) the forearms; (c) smock hem in holes and mould fur | pass |
| Stilt-Fowler | yes: a man perched on stilts with a net pole | shins knitted into the stilts, fungal knots, brackets, mould; black-soaked poles / none | 12 (6) | (a) stilts, net, decoy, ducks; (b) the shin-stilt join; (c) tunic hem rotted, net mesh hanging plumb | pass |
| Turf-Wife | yes: tall peat stack on a bent back | sods fused, toadstools, spine knots; tanned forearms / none | 12 (6) | (a) carrying frame, turf spade, pattens; (b) the fused load; (c) skirt hem rotted | pass |
| Frog-Catcher | yes: small figure, sack over the shoulder, upright spear | throat pouch, warts; tanned, wrinkled fingers / no toad face (the pouch is the mark) | 10 (6) | (a) sack, reed spear, frog cage; (b) the pouch; (c) shirt hem rotted | pass |
| Lantern Gnats | yes: leaning pole, lantern in a ball of gnats | swollen bile abdomens, split ones; the crust of dead gnats preserved / no neon glow (dull amber) | 8 (6) | (a) the hags' lantern and pole; (b) the gnats swollen to wasp size; (c) the swarm trails to the water | pass |
| Sin-Eater | yes: hunch over a round loaf, gut below | the gut, veins, blisters, mould on the lips; tanned skin, bones at the wrist / none | 12 (6) | (a) the loaf, coins of the dead, ale bowl, shroud scarf, spoon; (b) the gut; (c) cloak hem in holes | pass |
| Leech-Barber | yes: arms held out with a hanging fringe | the leech sleeves, weeping pustules, puffy pale face; wrinkled hands / none | 13 (6) | (a) apron, pliers, razor case, bleeding bowl, teeth necklace; (b) the leech sleeves; (c) apron hem rotted | pass |

Grit counted for the rulers and elites:

- **Stilt Hall:**
  - 6 eel traps with dried eels in them
  - tally sticks nailed by the door
  - the lantern on its iron hook
  - the dog hanging from its rope
  - the broken punt
  - the split ward-sign with a bracket fungus in it
  - daub holes patched with sods
  - wattle showing through broken daub
  - the kettle on its chain
  - leeches on the piles
  - the frog-bone charm
  - the rope ladder with swollen rungs
  - toadstools on the thatch
  - moss mats
  - drips off the eaves
  - mycelium in the timber
  - burls with shelf fungus
  - mould fur at the waterline
  - pustules on the daub
  - the window figures with the swaddled child and the dead lantern
- **Old Heron:**
  - the net and its floats
  - eel hooks and gut line
  - the frog-bone charm
  - the arrow shaft with its fletching
  - the thatch tuft
  - leeches on the shin
  - shelf fungus on the knee
  - peat clods on the toes
  - the snapped stilt-strap
  - the bail ring on a claw
  - the fish bone through the web
  - moult feathers in the mud
  - mould mats
  - the swallowed things in the crop
  - blisters at the gape
- **Tithe Reeve:**
  - the shirt showing through the split doublet
  - straining buttons
  - otter fur with a moulted patch
  - the gown hem rotted into holes and mould fur
  - the belt
  - the key ring
  - the purse
  - the horn ink pot and quill
  - the knife
  - the bundle of tallies with its cord
  - the pewter chain and badge
  - the knee patch
  - eel-skin boots split at the toe
  - the felt hat with a dent and a hole
  - the heron feather
  - rings sunk into the fingers
  - toadstools at the goitre's base
  - pustules
  - 12 eels tied to the pole
- **Midden Sow:**
  - the nose ring and broken chain
  - ear notches
  - the pen panel with snapped withies
  - the twine charm on the foreleg
  - three pitchfork tines
  - the chewed boot
  - leeches on the belly
  - the peat sod on the rump
  - the sacking strip
  - the halter burn
  - spores
  - mycelium

Silhouettes: no two of the 19 match. The tallest risk was the hunched humans:
- The Bog Body claws forward.
- The Sin-Eater has a round loaf at his face and a gut below.
- The Fen Hag crouches with a pole and lantern.
- The Turf-Wife carries her stack.
- The Eel-Catcher holds the comb glaive low.
- The Leech-Barber holds his arms out level with a fringe under them.
- The Coven Mother is antlered.
- The Tithe Reeve carries the horizontal pole of eels.

The two big quadrupeds are also apart. The Midden Sow is a crested mass with its head low. The Bog Troll is an
upright hunched knuckle-walker with a spade handle.

Style fails found and fixed during the build:

- **Midden Sow.** The first build was a flat barrel with a neat crown of small shelves, a small tapir head and column
  legs: boxy and flat.
  - It was rebuilt as three overlapping masses (ham, barrel, shoulder hump) with soft modelling.
  - The shoulders now stand higher than the rump.
  - The head is much larger and carried low, and the snout disc points down.
  - Big shingled shelves of bracket fungus with growth rings and pored undersides now stand up out of the back as a
    crest. Puffballs sit among them.
  - The internal outlines were removed so the masses read as one body.
- **Old Heron.** The first build had a body and wing as plain discs, an egg-shaped crop and a boxed neck.
  - The body now has a high-shouldered hunch. Its underside breaks into wet locks hanging plumb, and ruffled locks
    break the back's outline.
  - The plumage is built from `hairClump` wet locks.
  - The neck is one continuous S.
  - The crop is a hanging pear: narrow where it hangs, sagging low. The swallowed eel trap, boot and hand are pressed
    through as lit ridges.
- **Stilt Hall.**
  - The household were smooth brown mannequins. They now wear a shawl, a linen shirt and a wool tunic with folds. The
    daub swallows them to the waist. Their hair is plastered flat and their mouths have fallen open.
  - The eel traps hung over the door. They now hang only over the wall panels.
  - The thatch was a flat slab with sticker moss. It now has combed reed clumps, moss stains, a dark thick overhang,
    and reed ends and moss hanging plumb off it.
  - Corner posts were added to the gable end.
  - Broken reflections of the legs were added in the water band.
- **Sin-Eater.** The gut read first as hidden, then as a separate green egg. It now grows out of the chest line in
  tanned skin, sags low, and is veined and blistered. The near shirt panel hangs open off it. The scarf blob and a
  bright crumb were toned down.
- **Leech-Barber.**
  - The leech fringe read as a barcode of identical bars. The leeches now vary in length, width and sway.
  - The jowl shape read as a gag across the mouth. It now sits below the jaw.
  - The lower face read as a beard. The hatch, the jaw shade and the stain on it were reduced.
- **Turf-Wife.** The stack read as a bookshelf: regular courses and a ladder frame. The sods are now irregular, one to
  three per course, overhanging the uprights, with moss bursting from the joints. Only the top and bottom crossbars
  remain.
- **Frog-Catcher.**
  - The sack was a ball. It is now lumpy and pressed out from inside.
  - The knee was a round doll's joint. It is now a crease.
  - The child's face was hatched like a beard and the hair had orange stripes. Both were fixed.
- **Eel-Catcher.** The blisters read as green peas, and the ear blister sat by the eye like a glowing eye. The colour
  was toned down and the ear blister moved.
- **Tithe Reeve.** The goitre was a green camouflage melon. It is now tanned skin with bile mottling in patches. The
  gown skirt has stronger folds and wet streaks.
- **Lantern Gnats.** The swarm read as confetti and hid the lantern. A dark haze now gives the ball a core, and half
  the gnats are dark specks. The crust of dead gnats is dried dark. A clear zone was kept round the panes.

## Still open (honest)

- **The Midden Sow is the weakest of the 11.**
  - At full size the masses still read somewhat plush.
  - The cel shadow bands on the neck, the ears and the forearms read as stripes.
  - The long head has a slight tapir look.
  - The bible's 2.4 length is not reached. Only about 1.6 is visible, a compromise with the elite canvas and the
    1.8 shoulder height including the crest.

  It should be the next pass.
- **Old Heron.**
  - The bible puts the head and the top of the neck above the frame. Here the head sits at the very top edge with the
    crest cropped. This is deliberate: render_rig keeps only what is on the canvas, so a head above the frame would
    leave the strike without a beak. If the game can load the head as a separate sprite, it can be raised out of
    frame.
  - The wing coverts are still scale-like up close.
  - The crop is a smooth pear at sheet size.
- **Stilt Hall.**
  - The household bodies are simple under their clothes, and the reaching arms are thin.
  - The shelf fungus on the burls reads as stacked stones at sheet size.
  - The black water band counts in the silhouette, the same issue as the Fen Lurker.
  - Two of the eight piles are hidden behind the near ones.
  - The ridge toadstools sit on the visible slope, because the ridge itself is off frame.
- **Tithe Reeve.** "Leaning back, weight on the heels" reads as upright. The crosshatched lower face reads a little
  like stubble.
- **Eel-Catcher.** The smock is still the brightest area on him. The swollen hands are mitt-like.
- **Frog-Catcher.** Knock knees do not read in side view. The shirt is boxy.
- **Leech-Barber.** The highlight on the leeches is close to a glass highlight up close.
- **Lantern Gnats.** The swarm is soft-edged, and the haze counts as a grey disc in the silhouette.

## Holds and animation needs

**Holds that will need IK:**
- Eel-Catcher: the far hand on the glaive (the glaive is on `hand_n`).
- Turf-Wife: two hands on the stick (the stick is on `hand_n`).
- Stilt-Fowler: two hands on the net pole (the pole is on `hand_n`); the far hand drifts in the throw.
- Tithe Reeve: the pole rests on the far shoulder while it is held by the far hand, so a swing must keep the
  shoulder contact or lift off cleanly.
- Frog-Catcher: the sack's neck runs over the shoulder; the sack is on `hand_n`.

**Z-order overrides:**
- Old Heron: the neck passes behind the crop in the strike.
- Tithe Reeve: the pole passes behind the head in the wind-up.
- Stilt-Fowler: the raised arms come close to the face at the top of the throw.

**Scale keys:**
- Frog-Catcher `pouch`
- Lantern Gnats `swarm`
- Old Heron `crop` sway

**Pivots** (rigs are exported mirrored):
- The Stilt Hall's root `hall` pivots at the house body. Its idle weight shift is small rotations of the `pile_n_a`
  bones against `hall`.
- The Old Heron's standing-leg sink is a translation key on `body`.

## Independent review

An independent art director and logic auditor reviewed the batch after the maker, starting from the director's notes on
`out/worlds/II_b/sheet.png`. Fixes were made only in `worlds/world_II_b.js` and `worlds/kit_II_b.js`. Each changed figure
was re-rendered, its rig re-exported into an emptied folder (no `MISSING JOINTS`, ground = canvas height minus 30, each
check.png matching its render at a mean difference of 0.001 or less), and its attack pose re-run. `sheet.png`,
`sheet19.png` and `sil.png` were rebuilt in the same layout. The render prints no `grip` warnings.

### Director's rulings (recorded)

- **Old Heron:** the head may sit at the top edge with the crest cropped, because the rig needs the beak on the canvas.
  The bible's "head above the frame" is met in the game by moving the head and neck bones, not in the art.
- **Midden Sow:** she may break the top or side of the elite frame to reach the bible's 2.4 length. Her canvas is now
  **1700 by 1400**: elite height, wider than the 1100 elite width. The ground is still at h minus 30 (1370). She measures
  about 2.45 from the snout disc to the ham and 1.78 to the top of the fungus crest. The hide at the withers is about
  1.4. The bible's "1.8 at the shoulder" is read as the shoulder including the crest. The game must place this sprite on
  a frame wider than the standard elite frame.

New helpers in `kit_II_b.js`:

| Helper | What it does |
|---|---|
| `feather` | A contour feather: a narrow quill, a broad rounded tip, a shaft, barbs, a lit edge and a cast shadow, with an optional split wet tip. Used to build plumage in layered tiers. |
| `fan` | A bracket fungus shelf seen as a fan: zoned bands parallel to a lobed margin, a pale growing margin, a crescent of pored underside and a thrown shadow. |
| `anat` | Face anatomy over a `B.head` face: shade under the brow ridge, a lit cheekbone, a hollow under it, a sunk temple, a nasolabial fold and a chin crease. |

### What changed per figure

1. **Midden Sow: rebuilt from scratch** (the director's note 1).
   - **Body and legs.** The body is one outline: the ham, a long barrel that sags between the ham and the shoulder, a
     deep belly, the shoulder, and the neck running into the jowl. The masses are modelled with tone and folds inside it,
     not by stacked shapes, so the plush boxy read and the stripe-like cel bands are gone. The legs are short and thick:
     a heavy forearm or gaskin, a knee or a hock with creases, a cannon, a pastern and a cloven trotter with dew claws,
     sunk in welling mud. The mud rises to the knee as a wet, blotched, cracked tint, not a boot-shaped crust. The legs
     sit under the body, so a swinging leg keeps its top hidden.
   - **Head.** It is a pig's wedge: a straight, slightly dished face line, a long snout ending in a flat disc that faces
     forward, two nostrils, mud caked under the disc and the iron ring through the septum. The eye is small and sunk
     under a hooded lid with a bag and crow's feet. A big ear flops forward over the brow, veined and notched. There are
     short yellowed tusks, heavy jowl folds, bristles on the jowl and lip, and the chewed boot hooked on the tusk. The ink
     runs only along the face, so the back of the head runs into the neck under a fat roll. This removed the tapir and
     the elephant reads.
   - **Crest.** The spine stands up as a split hide ridge. A mound of fungus flesh, white with mycelium, grows out of it.
     Six rows of zoned bracket fans are shingled over the mound (each shelf above overhangs the one below), with
     puffballs among them and spores drifting up. The top row makes a serrated outline.
   - **Course marks and grit.** Two rows of swollen teats; bristles in clumps along the back, belly, ham and neck; a
     scarred halter burn; open sores with mould rims; blisters; leather crackle, tanning blotches and loose-hide wrinkles.
     All the bible's gear is kept: the nose ring and broken chain, the ear notches, the torn hurdle on its cord over the
     ridge, the leg charm, three tines with rust weeping, the boot, leeches, the peat sod and the sacking strip.
   - **Rig.** The crest is queued per spine bone, which cut the export from 104 layers to 42. The head, jaw, ear and
     chain pivots moved with the new head, so any keys made on the old rig need re-keying.
2. **Old Heron** (the director's note 2).
   - **Crop.** It is a hanging sack, narrow at the throat and heaviest low and forward. Its lower curve is uneven where
     the boot, the trap and the hand press out. The skin is thin and half translucent: the trap, the boot and the hand
     show through it as dark shapes, with pressure ridges where they press. It carries a branching vein network, stretch
     marks, bruising, blisters, a wet sheen only on the bulges, and loose folds at the throat. The feathers thin out round
     its top into pin feathers and bare pimpled skin.
   - **Plumage.** The wing is built in layered tiers with `feather`: dark primaries over the tail, broad secondaries and
     tertials, greater coverts, rows of small coverts, lank scapulars, and mould in the mats. Each tier throws a shadow
     on the one under it. The belly is a soft ragged edge of dark wet contour feathers with split and rotted tips, not a
     comb. Feathers lift off the back to break its smooth outline.
3. **Stilt Hall** (the director's note 3).
   - **Burls.** The burls are knee-like knobs: the grain wraps round them, they crease underneath, and their middles are
     ripened soft. They are ringed with stacked `fan` shelves that break the legs' outline. The stacked-stones read is
     gone.
   - **Household.** Each face is its own person: the old woman (thin hanging hair, the mouth fallen wide, missing
     teeth), the child, the reeve's man (stubble, heavy brow), and the mother in a rotted kerchief. All four have sunken
     sockets under a lit brow ridge, lit cheekbones over hollows, shrunk lips off stained teeth, chin creases, and necks
     with cords. The reaching arms are bog-body arms: skin shrunk on the bone, a hard elbow point, the ulna ridge, the
     hollow between the forearm bones, tendons, a wrist knob, long nails, and daub still caked where they pulled out of
     the wall. The daub mounds that swallow them were darkened and cracked (they read as pillows before).
   - **Depth.** The hall now turns in space:
     - The front gable is lit and the long wall is shaded toward the corner, and the gable's recession was doubled
       (`gRise` from -36 to -72).
     - The eave overhang is twice as deep, with rafter feet in its shadow and a deep shadow band on the wall beneath.
     - The sill shows its top face, and the floor joists' cut ends come through below it.
     - The posts show a side face.
     - The door and windows show the wall's thickness as a lit reveal and a dark soffit.
4. **Frog-Catcher, Eel-Catcher, Sin-Eater** (the director's note 4).
   - **All three.** `anat` was added to each face (face shading stays 0.78, as on Mother Hild).
   - **Eel-Catcher.** The cap's brim was raised to the brows, so the eyes now show; before, the cap covered the face like
     a helmet. The ear is a dull swollen ear with a blister, not a bright flame shape. The smock was darkened, and grease,
     slime and old eel blood now run down it. It has wax worn to bare canvas and mud soaked up from the hem. It is no
     longer the brightest area on him.
   - **Frog-Catcher.** The beard-like hatching was cleared. The hungry child has sunk eyes and hollow cheeks, with
     blisters on the cheek. The warts moved off the upper lip, where they read as a moustache. The pouch is tanned pale
     skin with veins under it, fluid settled low and a tight wet sheen, not a bib.
   - **Sin-Eater** (a further fault found on review). The gut was a round ball (GUIDE section 8: no spheres as body
     masses). It now sags low and forward over the rope belt, with a fold where it hangs and its weight in shade. His
     jaw muscle shows working.

### Gate 1: logic audit (independent re-run)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| Stilt Hall | n/a | pass | pass (ladle through `B.grip`, no warning) | pass | pass | pass | none needed |
| Old Heron | pass | n/a | n/a | pass | pass | pass | none needed |
| Tithe Reeve | pass | pass | pass | pass | pass | pass | unchanged |
| Midden Sow | fixed | n/a | n/a | fixed | pass | pass | the head sat on the neck like a mask; it now runs into the neck under a fat roll, with the jaw hinged under the cheek. The legs were columns; they now have knees, hocks and trotters sunk in mud, under the shoulder and the ham. |
| Eel-Catcher | pass | fixed | pass | pass | pass | pass | the cap covered both eyes, so his gaze at the tines could not be read; the eyes now show under the brim |
| Stilt-Fowler | pass | pass | pass | pass | pass | pass | unchanged |
| Turf-Wife | pass | n/a | pass | pass | pass | pass | unchanged |
| Frog-Catcher | pass | pass | pass | pass | pass | pass | none needed |
| Lantern Gnats | n/a | n/a | n/a | pass | pass | pass | unchanged |
| Sin-Eater | pass | pass | pass | fixed | pass | pass | the gut was a ball floating ahead of the belt; it now sags onto the belt |
| Leech-Barber | pass | pass | pass | pass | pass | pass | unchanged |

### Gate 2: style and detail (independent re-run, judged on `sheet.png` and `sil.png`)

| Figure | Item | Before | Result | Fix |
|---|---|---|---|---|
| Midden Sow | anatomy, plush read, cel stripes, tapir head, length | fail | fixed | full rebuild (above); 2.45 long, 1.78 at the crest |
| Midden Sow | signature at 190 px | weak | pass | long low body under a serrated fungus crest, head low; apart from the Bog Troll in `sil.png` |
| Old Heron | crop as a smooth balloon (GUIDE 8) | fail | fixed | a translucent, veined, sagging sack with an uneven lower curve and the swallowed things showing |
| Old Heron | plumage as combed stripes | fail | fixed | layered feather tiers, a ragged wet belly, a broken back outline |
| Stilt Hall | burl fungus read as stacked stones | fail | fixed | knee burls with grain and `fan` shelves |
| Stilt Hall | household simple, arms thin tubes | fail | fixed | four distinct preserved faces with anatomy; bog-body arms with bone and tendon |
| Stilt Hall | flat facade | fail | fixed | a lit gable and shaded long wall, a deep eave with rafter feet, sill and joist ends, post side faces, reveals |
| Eel-Catcher | face hidden by the cap; bright smock | fail | fixed | brim raised, `anat`, dull ear; smock darkened, stained and worn |
| Frog-Catcher | face hatched like a beard; pouch read as a bib | fail | fixed | child's hungry face, warts moved off the lip; tanned veined pouch |
| Sin-Eater | face | pass | pass | `anat` added for age and the working jaw |
| Sin-Eater | gut as a sphere (GUIDE 8) | fail | fixed | sagging pear over the belt |
| Tithe Reeve, Stilt-Fowler, Turf-Wife, Lantern Gnats, Leech-Barber | signature, course marks, grit, palette | pass | pass | not changed |

No two silhouettes match among the 19 (`sil.png`).

Grit for the changed elites and rulers:
- **Midden Sow:** 21, against a need of 10. The 10 bible gear items, plus teats, bristles, halter burn, sores, blisters,
  mycelium, spores, puffballs, wrinkles, mud and the hide crest.
- **Old Heron:** 18, against a need of 12. The maker's 16, plus veins and stretch marks, and pin feathers.
- **Stilt Hall:** 23, against a need of 12. The maker's 20, plus rafter feet, joist ends and the mother's kerchief.

### Pose tests re-run (in `out/worlds/II_b/<key>_pose.png`)

| Figure | Pose | Result |
|---|---|---|
| Midden Sow | `spine_2 -6`, `neck -10`, `head -12`, legs striding, `jaw -8` | Pass. The head drops into the charge and the legs stride with their tops hidden under the belly. |
| Old Heron | `neck_1 -60`, `neck_2 -93`, `neck_3 51`, `head 60` | Pass. The z-order note stands: the neck passes behind the crop in the strike. |
| Stilt Hall | `pile_1_a 30`, `pile_1_b -40`, `hall -3`, `folk -8` | Pass. The front pile lifts and the household reaches out. |
| Eel-Catcher | the maker's stab pose | Pass. |
| Frog-Catcher | the maker's croak pose | Pass. |
| Sin-Eater | the maker's lurching bite | Pass. |

### Still open (honest)

- **Midden Sow.**
  - The hide is still smoother than the Darkest Dungeon 2 bar at full size; the wrinkles and crackle mostly read only
    up close.
  - The head's inkless back edge shows faintly when the head turns in the charge.
  - The wider canvas needs the game to allow a frame wider than the elite tier.
- **Old Heron.**
  - The covert tiers still read slightly as scales up close.
  - The drawn-up leg is a small knob.
  - The neck's front streak is still a regular zipper of pale locks.
- **Stilt Hall.**
  - The open mouths can read as grins at full size.
  - The thatch slope is still a flat green field with toadstools on it.
  - The black water band still counts in the silhouette.
- **Eel-Catcher.** The swollen ear is still the warmest small spot on the head.
- **Sin-Eater.** The gut is still the largest smooth mass on him, though it now hangs.

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Midden Sow | smooth, blocky hide | the outline sags between ham and shoulder, the ham domes, the belly hangs deeper, and every edge is subdivided with small loose-hide wobbles (local random stream); inside: 38 extra hide creases with lit lips, mange patches with scabs, scabbed cracks, bristle tufts along the back, and a soft crust of dried wallow mud over the belly with cracks. Bristle sampling now uses the smooth base outline | pass at full and sheet size; the flank is still a large even-toned field under the fungus |

Rig re-exported. Sheet, sheet19 and sil rebuilt (`wII_b/sheet.py`).
