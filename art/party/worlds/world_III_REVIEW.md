# World III, The Boiling Baths: review

Figures: The Simmering Matron (300), The Bath-Mistress (301), Cauldron Bearer (302), Scalded Attendant (303), Kettle Crab
(304), Boiled Brute (305), Steam Nymph (306), Bath Leech (307). File `worlds/world_III.js`, helpers in `worlds/kit_III.js`
(palette, `base`, textures `marble`/`pruned`/`hammer`, blisters, peeling sheets, scald streaks, split seams, steam and
wisps, verdigris, dents, chains, rope, IK, whole-leg and whole-arm rig splits). All eight are foes, built facing right
with `kit.foeBase` (world shadow tint `#3a1e28`, wet bath-floor grime) and `flip: true`.

Outputs: `out/worlds/world_III_<key>.png` and `_sil.png`, rigs in `out/rig/worlds/world_III_<key>/`, pose tests in
`out/worlds/III/<key>_pose.png`, `out/worlds/III/sheet.png` (true relative scale, Drowned Thrall for human scale) and
`out/worlds/III/sil.png` (190 px per human).

Method: every figure was checked on zoomed renders on a mid-dark ground (1.2x to 3x on heads, hands, held objects and
feet) and at game size. Grip and gaze angles were measured from the code (`B.gripAngle` with warnings on). "Fixed" means
the item failed on an earlier render, was changed, and passes on the current one.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: one spine, jaws on a hinge), 2 objects face their user and gaze,
3 grips and hands, 4 weight and balance (non-humanoids: legs carry the weight), 5 contact, attachment and plumb hang,
6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Simmering Matron | pass | pass | pass (open hands) | pass | pass | pass |
| Bath-Mistress | pass | pass | pass | pass | fixed | pass |
| Cauldron Bearer | fixed | pass | fixed | pass | pass | pass |
| Scalded Attendant | pass | pass, with a note | pass (open hands) | pass | fixed | pass |
| Kettle Crab | pass | n/a | n/a | fixed | pass | pass |
| Boiled Brute | pass | n/a | fixed | pass | pass | pass |
| Steam Nymph | pass | n/a | pass (open hands) | n/a (floats) | pass | pass |
| Bath Leech | pass | n/a | n/a | pass | fixed | pass |

### Measurements behind the passes
- Matron 1: skull centre [856,640] sits 30 px ahead of the neck base [826,830] on a short, fat neck (head 350 px).
  3: both hands are open and drape over the coping, wrists bent over its edge, touching the stone.
  4: she is seated in water to the chest; the arms rest their weight on the rim.
- Mistress 1: skull centre directly over the neck base (2 px). 3: ladle fist through `B.grip`: horizontal forearm onto a
  handle rising at 65 degrees, 0 degrees past the limit; thumb toward the bowl. The far hand is open, palm up, under the
  handle at its 0.41 point, the fingertips curl up over it (they touch it). 2: she looks ahead at the enemy, chin up; the
  ladle is a weapon, not something she reads.
- Bearer 1: the hunch is in the spine (control point 180 px behind and 100 px above the neck base, so the spine runs
  almost level at the shoulders); the head is placed along the spine's own tangent at the neck, 0.62 head out, so it
  continues the spine instead of sliding forward. 3: both fists on the beam through `B.grip`, arms solved with two-bone
  IK onto the beam, 0 degrees past the limit.
- Attendant 2: the towel is offered, not read, so it faces the guest by intent. The eyes are downcast in the bow: eye to
  towel is 70 degrees below horizontal against a head axis of 18; he is not studying it, so this is a polite lowered gaze
  rather than a gaze miss. 3: both palms are under the towel, the near thumb over its edge.
- Crab 4: eight legs reach the ground line (near tips on it, far tips 12 to 22 px higher, further away); the body is
  centred between the two leg fans. Claws hinge at their joints (the movable finger on its own bone).
- Brute 3: club fist through `B.grip`, 32 degrees off square (limit 35), thumb toward the broken top of the column.
  4: belly forward, the club dragged behind as a counterweight, feet under the mass.
- Nymph: floats; no ground contact. Hands open (one at the breastbone, one reaching), no held object.
- Leech 1: one spine curve from the posterior sucker to the oral sucker, chain bones along it. 4: the posterior sucker is
  clamped on the floor under the tail tip and the tail lies along the ground under the rearing curve.
- Plumb: every drip, peeling sheet, hair strand, cap tie, key, chain, apron string and the boiled arm on the near
  cauldron hangs in screen space, not in a rotated frame.
- Facing and light: all eight flip; the key light (upper right in build space) ends at the upper left. Steam lobes are lit
  on the same side.

### What failed and how it was fixed
- Bearer 1: the first spine put the near shoulder on top of the hump and the far shoulder on the belly (the spine model
  assumes an upright torso). Shoulders are now placed by hand at the front end of the hunched back.
- Bearer 3: the near arm was a flat V of two angled tubes crossing the body, the far elbow came to a spike. Both arms
  are now rounded upper arms and forearms with muscle masses and an elbow crease, caps overlapping at the elbow.
- Brute 3: the club grip was 3 degrees past the 35 degree limit; the elbow moved back 16 px, now 32 degrees.
- Mistress 5: the belt was a long plank sticking out past the body on both sides (the "tyre" fault); it is now cut to
  the waist with hard corners, a dip at the front and a strap end hanging from the buckle.
- Attendant 5: the far hand's fingers poked out past the towel's far end and read as log ends; the hand moved back under
  the towel.
- Crab 4: the first two builds stood on near-vertical table legs (the World I wreck crab fault) and the near legs crossed
  the shell like bars. Rebuilt in a front three-quarter view: the legs fan out on both sides, knees arched above the
  shell, the tips far out on the ground.
- Leech 5: the posterior sucker was drawn on top of the body like a cap; it now lies flat on the floor under the tail
  tip, behind the body.

## Gate 2: style and detail

Columns: signature reads in silhouette at 190 px (`sil.png`); course marks (fire dominant, water second) with the "Never"
items absent (cartoon flames on heads, fish faces); secondary detail count (ruler 12, elite 10, cast 6); three or more
overlapping layers; palette; silhouette unique in the world.

| Figure | Signature at 190 px | Fire / water marks, Never absent | Details | Layers | Palette | Unique silhouette |
|---|---|---|---|---|---|---|
| Simmering Matron | fixed | pass | 25 | pass | fixed | pass |
| Bath-Mistress | pass | pass | 24 | pass | pass | pass |
| Cauldron Bearer | pass | pass | 22 | pass | pass | pass |
| Scalded Attendant | pass | fixed | 13 | pass | pass | pass |
| Kettle Crab | fixed | fixed | 14 | pass | pass | pass |
| Boiled Brute | fixed | fixed | 18 | pass | pass | pass |
| Steam Nymph | fixed | pass | 12 | pass | pass | pass |
| Bath Leech | pass | pass | 14 | pass | pass | pass |

### Detail inventories (secondary details, then layers)
- Matron: veil with gold-thread border, wet hair strands, cracked lips, heavy lids, translucent veins, blisters, five
  sloughing sheets, a split seam, sweat beads, two gold armlets with pearls sunk in the flesh, two sunk bracelets, sunk
  rings, the Tooth (cracked, gold-capped, stained) on its chain, a soaked shift with embroidered hem and strap, floating
  skin on the water, bubbles, ripples, the carved wave frieze, cracks, mineral scale, overflow runs, a cold clay lamp, a
  folded towel, the crest of water. Layers: skin, shift, veil, jewellery.
- Mistress: cap with stitching and tie, scraped-back hair, broken veins in the flush, sweat, collar band, front lacing,
  rolled sleeves, the blistered and peeling tide line at the elbow, pruned forearms, apron with scorch holes and a pocket
  holding pumice, belt and buckle with strap end, a ring of six keys, a scrubbing brush on a chain, ladle grip wrap,
  rivet plate, dents, verdigris, soot, water slopping over the lip, darn, old stain, pleats, grimed hem, drips, clogs.
  Layers: gown, apron, rolled sleeves, cap, belt.
- Bearer: iron-shod beam ends and hooks, sackcloth pad with stitching and lashings, a raw rub mark, two riveted cauldrons
  with seams, dents, verdigris, soot, stubby legs, bail lugs, chains, boiling surface, slopped water, the boiled arm with
  a peeling sheet over the near rim, rag wrist wraps, rag-bound feet with a trailing end, leather apron with burn holes,
  rope belt with a hanging end, splash scars, blisters, a split seam, sweat, shine. Layers: skin, apron, rope belt, pad,
  rags.
- Attendant: tunic with darn and see-through wet patches, cord belt with knot and ends, bronze strigil with verdigris,
  oil flask, towel with skin stains, a stuck curl of skin and a stitched hem, the raw cheek with muscle grain, scald patch
  on the scalp, six peeling strips, blisters, pruned wrinkles, drips at the hem. Layers: skin, tunic, belt, towel.
- Crab: split crown with cooked meat, the broken lid over the vent, two raw seams, lateral teeth, tubercles, setae,
  worn pale leg tips, boiled white eyes on stalks, antennae, mouthparts, a chipped claw showing meat, a snag of bath
  linen, mineral scale, blistered joint, belly plates, three steam plumes. Layers: shell, belly plates, linen snag and
  scale.
- Brute: bronze collar sunk in the neck with rivets and verdigris, guard's belt with bronze buckle, pteruges with rivets
  and one strip torn away, linen kilt, two bracers sunk in the forearms, sandal straps sunk in the feet, a fluted column
  club with Ionic volutes, rope grip, chips and old blood, blisters, peeling sheets, a split seam, fat folds, stretch
  marks, drool, scalp patch. Layers: skin, kilt, pteruges and belt, collar and bracers.
- Nymph: veil hood with bone-thread border, darn, back drape with fringe, drips, condensation beads, inner vapour swirls,
  the pink core glow, the breath plume, the trail, closed lids, the open mouth on a note, a warmth in the cheek. Layers:
  vapour body, veil hood, veil back drape.
- Leech: annuli, sensory dots, dorsal flecks, crop pouches and gut line through the skin, blisters, burst blisters, a
  split seam, flaking, a peeling sheet, wet sheen, the posterior sucker, the ring of teeth, a blood dribble, a stuck
  strip of linen, sweat beads. Layers: skin, blood seen through it, linen strip.

### Course marks
Fire (dominant): skin boiled pink, white and red; blisters (whole and burst); sheets of skin peeling and hanging from a
raw wet bed; split seams with a hot raw core and charred, flaking lips; flakes curling up; vapour curling upward.
Water: swelling (Brute, Matron, Leech), pruned wrinkled skin on hands and forearms, wet sheen, drips, steam everywhere,
verdigris on the copper and bronze. No cartoon flames anywhere; no fish faces. The Matron's rim lamp is unlit.

### Palette
Pink-white marble, steam white and boiled red, plus ink, bone and grey, with the bible's named materials: linen,
copper (Mistress, Bearer), bronze (Brute's collar and buckle, the Attendant's strigil), leather and wood. Verdigris is
material wear from the shared library ("green in crevices"). Gold only on the Matron, the temple's high priestess (holy):
armlets, bracelets, rings, the Tooth's cap and chain, the veil's border thread. Red only as the world's boiled red, raw
flesh and blood (the Brute's club, the Leech's dribble, the rubbed beam).

### What failed and how it was fixed
- Matron signature: first build was a normal-width woman at what read as a table; widened to a vast body (torso 900 px,
  2.6 heads), the steam column moved behind her on a heavier blur so it reads as a column, not cloud blobs. At 190 px
  her head and shoulders now stand dark inside a grey steam column over the rim. Palette: red armlet stones became
  pearls; the lamp's amber flame was removed. Ball-shaped shoulder caps (the perfect-ellipse fault) were replaced by the
  torso's own shoulder slopes.
- Attendant marks: the first peeling strips read as tusks or claws and the raw cheek as a round red disc; strips are
  now longer ribbons hanging from torn raw beds, the cheek is a ragged patch with muscle grain. Scald blotches first read
  as polka dots and are now streaks. The towel first read as a log; it is now a soft folded stack with a hemmed edge.
- Crab signature and marks: the table-leg build (see Gate 1). The crack first read as a white lightning bolt and the
  lid as a box; the crack is now a jagged dark split with a little meat showing, the lid a thin plate on its hinge.
- Brute signature: the first club (a baluster) read as a milk bottle, and at game size the club merged with his feet.
  It is now a fluted column with an Ionic capital, dragged further back so the capital sits clear of his legs. Marks:
  the first build was a boxy refrigerator torso with tube arms; reshaped to sloping shoulders, a soft sack of a torso
  with back rolls, a hanging belly on its own bone, lumpy arms with a fat shoulder mass; a steam wisp rising off his
  scalp was removed (too close to "flames on heads").
- Nymph signature: the first veil read as a slab of long hair, the lower body as a vase and the steam strands on her
  head as antennae. The lower body is now soft blurred vapour with no edge, the vapour is inked in grey, the veil is a
  hood plus a back drape, and the head strands are gone.

## Rig and pose tests

| Figure | Bones | Attack pose (from the Motion line) | Result |
|---|---|---|---|
| Simmering Matron | 15 (pool root, body, torso, head, veil, pendant, two three-bone arms, wave, steam_back, steam_front) | wave sweep: body -3, torso 4, upperarm_n -45, forearm_n -25, hand_n -20, wave 10 | pass: the near arm lifts off the rim with the crest of water on the hand; the torso's shoulder slope covers the arm's root |
| Bath-Mistress | 20 (humanoid + ladle, skirt, apron, keys, brush) | fling: torso -8, upperarm_n 35, forearm_n -10, hand_n -15, ladle -20, far arm back | pass: the ladle tips forward on the fist; the sleeve stays on the arm |
| Cauldron Bearer | 19 (humanoid + yoke, pot_n, pot_f, apron) | swing: torso -6, yoke -8, pot_f 55, pot_n -10 | pass: the far cauldron swings out on its hook; chains stay on the hook |
| Scalded Attendant | 18 (humanoid + towel, towel_end, skirt) | snap: upperarm_n 45, forearm_n -35, towel_end 75 | pass: the arm thrusts forward and the towel end flicks out |
| Kettle Crab | 27 (body, eyes, two three-bone claws, eight two-bone legs, three steam bones) | pinch: claw_n_1 18, claw_n_2 -12, claw_n_3 -16, small claw 10 / -12 | pass: the movable finger closes on its hinge |
| Boiled Brute | 18 (humanoid + belly, club, skirt) | overhead swing: upperarm_n 150, forearm_n 20, hand_n -20, torso -8 | pass: the column rises overhead; the shoulder mass on the torso covers the arm root |
| Steam Nymph | 13 (pelvis, torso, head, veil, breath, two arms, trail_1, trail_2) | song: head 14, torso 8, breath -12, far arm thrown out, trail sways | pass |
| Bath Leech | 7 (seg_1 .. seg_6, head) | lunge: seg_3 -4, seg_4 -6, seg_5 -5, seg_6 10, head 18 | pass: the mouth drops toward the front rank; the cuts stay closed (a first try at double these angles stacked past the frame) |

No export reported `MISSING JOINTS`. `rig.json` carries the correct ground for every canvas (h - 30).

## Still open
- Matron: the upper arms still read partly as broad tubes, and the diagonal cel-shadow band across them is busy; the
  thin band of water between her and the rim reads a little like a tray edge. She is the figure that would gain most
  from another pass.
- Attendant: at full size a few peeling ribbons still read faintly as claws; at game size they read as pale strips.
- Steam Nymph: the near upper arm, passing behind her to the hand at her breastbone, reads as a pale strap; the face is
  a little mask-like because it is the densest thing on her.
- Kettle Crab: the domed top and the darker front band still read a little as two stacked layers.
- Cauldron Bearer: the near upper arm is a large flat form across the torso. In the game both hands need IK onto the
  beam (the yoke is on the torso, the hands on the arms), and the steam rotates with the pots when they swing, so steam
  should be a separate effect layer in animation.
- Boiled Brute: the far hand on his belly shows its palm (the shared `B.hand` draws only a palm view); in the overhead
  swing the near arm crosses his face, which needs a z-order key in that animation. His legs are still heavy columns.
- Bath-Mistress: the gown below the apron is still the quietest large area in the world, though it now carries pleats,
  damp streaks, a darn, a stain and the grimed hem.
- Steam on every figure is drawn with blurred translucent shapes, so in `sil.png` it reads as grey haze, not solid
  black; that is intended (the plumes are part of the crab's and the Matron's signatures).

## Independent review (2026-11-22)

Reviewer did not build these figures. Read GUIDE (section 8), LOGIC_CHECKLIST, the design language, the world bible and
REVIEW.md; compared against the Drowned King (ruler bar), the reviewed Wreck Crab (`world_I_b.js`) and Mother Hild
(`dirAC2.js`). Every figure was re-rendered one at a time, composited on a mid-dark ground and checked at 1x to 2.5x on
heads, hands, held objects and feet, then at sheet scale (0.42) and in `sil.png` (190 px per human). Rigs re-exported
for all eight (peelSheet is shared): no `MISSING JOINTS`. Pose tests re-run for all eight into `out/worlds/III/<key>_pose.png`.
"Fixed" = failed on the maker's build, changed, and passes on the re-render.

### New shared helpers in `kit_III.js`
- `mlimb`, `mchain` (local copies of kit_I_b's anatomical outlines), `crabSeg`, `dactyl` (after the reviewed Wreck Crab).
- `handBack`: the back of a hand (the shared `B.hand` only draws a palm). Each finger one soft outline through its
  joints, small nails, joint creases, a puffy pad over the roots with dimpled knuckles (`lean` for knuckle heads).
- `legDetail`: kneecap plane and tendon, quad teardrop, calf belly past the shin outline, shin edge, ankle knob, Achilles.
- `peelSheet` rebuilt (all figures): see Attendant below.

### Gate 1: logic audit (re-checked)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Simmering Matron | pass | pass | fixed: hands showed palms while draped over the edge; now backs of hands, thumbs toward the body | pass | fixed: forearms now lie on the coping top with flesh pressed over the rolled edge and a cast shadow on the stone | pass |
| Bath-Mistress | pass | pass | pass (grip unchanged, 0 deg past limit) | pass | pass | pass |
| Cauldron Bearer | fixed: head slid ahead of the spine on a long neck | pass | pass | pass | pass | pass |
| Scalded Attendant | pass | pass (lowered gaze, as maker) | pass | pass | pass | pass |
| Kettle Crab | n/a | n/a | fixed: pinch now closes the movable finger onto the fixed one (sign was opening it) | fixed: stick legs arched high, body on stilts | pass | pass |
| Boiled Brute | pass | n/a | fixed: hand laid on the belly showed its palm | pass | pass | pass |
| Steam Nymph | pass | n/a | fixed: hand pressed to the breastbone showed its palm; now its back | n/a | fixed: arm opacity groups straddled two bones (unbalanced `<g>` per rig layer); opacity now on the parts | pass |
| Bath Leech | pass | n/a | n/a | pass | pass | pass |

Measurements: Bearer neck base now [672,556] out of a hump at [500,404]; skull centre 0.46 head along the spine's own
tangent (was 0.62) on a 200 px bull neck, the trapezius rolling into the back of the skull, so the head hangs at the
front end of the curve, under the beam. Crab: belly ~70 px off the floor, knees 0 to 60 px above the shell rim, all
eight tips on the ground line (far tips 12 to 30 px higher), shell centred between the leg fans.

### Gate 2: style and detail (re-checked)

| Figure | Item | Result | Fix |
|---|---|---|---|
| Simmering Matron | below the Drowned King bar; arms even tubes with rings round them | fixed | `mchain` arms with explicit profiles: heavy hanging lobe under each upper arm folded back against it, stretch marks, armpit crease, dimpled fat elbow with bend creases, forearm tapering to a pinched wrist with fat rolls, flattened on the stone and spilling over the rolled edge. Forearms lengthened (were shorter than thick) to lie along the coping to the frame edge |
| | gold bands sat on the flesh | fixed | `band()`: the outline pinches at each band, flesh overhangs its top edge and bulges out under it (crease plus lit swell each side); pearls on the armlets; rings sunk in swollen fingers |
| | water a flat band, rim a tray edge | fixed | camera looks down onto a pool plane: far water graded to a pale reflecting distance, near water darkening to the coping; her body under the surface (belly roll, billowing shift hem, knees, dark water between) with a displaced outline at the surface and caustic threads; meniscus and four ripple rings at her waterline, rings where the Tooth's point dips in; floating skin, bubbles; low vapour plus 14 wisps rising off the surface itself. Coping rebuilt as a top plane with a wet lip, puddles, a rolled edge and the carved face |
| | face: hard pale/dark split, flat | fixed | faceShade 0.72 with a warm rose shadow tint (not the world's dark wine), soft blurred cheek light and underside, turning side plane, heavy lower face (jowls and double chin widening the silhouette), lid creases, eye bags, nasolabial fold, lifted mouth corners, cracked flaking lip |
| | grit 12+ at sheet scale | pass (26) | veil and gold border, hair strands, Tooth and chain, 2 armlets, 2 bracelets, rings, 6 peeling sheets, blisters, seam, floating skin, bubbles, ripples, floating hem, knees under water, surface steam, frothing wave, frieze, mineral crust, overflow runs, chip, cracks, clay lamp (now a lamp, not a pebble), folded towel, puddles |
| Kettle Crab | read as a spider | fixed | rebuilt on `crabSeg`/`dactyl`: four-segment legs 34 to 43 px thick, splayed sideways and low, coxa sockets under the rim, setae, spines, worn tips biting the floor; shell lowered 34 px; crusher claw doubled into a heavy swollen palm held low in front with crushing teeth, a chip and a hinge knob; joint membranes toned down (first pass read as polka dots); pale underside darkened (read as a tray) |
| Bath-Mistress | gown a large flat pale area | fixed | (clipped to the skirt) deep fold valleys with lit ridges, the near knee pushing the cloth with folds dragging from it, a wet band to a tide line with dried salt above, mud splatter, white scale crust along the hem, furnace scorch with a burnt hole, an older singe, rust run from the keys, copper-green slop, stain, darn. Apron: drag folds from the pocket's load, soaked heavier lower half, stitched hem. Bodice: condensation patch, sweat crescent, drag folds, slop run, scorch, mend; sleeve folds |
| | ladle bowl small for the handle | fixed | bowl 1.45x (about 250 px), deeper; reads as a ladle at 190 px (`sil.png`) |
| Cauldron Bearer | near upper arm a flat slab | fixed | muscled profile (deltoid swell, biceps belly inside the bend, triceps behind), soft light along the top and shade beneath clipped to the arm, its blurred shadow on the body, deltoid and biceps grooves, elbow point, bend creases, forearm muscle groove, vein |
| | legs read as tubes | fixed | thicker thigh mass plus `legDetail` (kneecap as a lit plane, tendon, calf belly past the shin with only its outer edge inked, shin edge, ankle knob, Achilles). First pass read as buttons and armour plates; softened |
| Boiled Brute | far hand showed a palm | fixed | `handBack` on the belly, fingers draped over its curve |
| Steam Nymph | near upper arm a pale strap | fixed | elbow juts back past the body, deltoid-to-elbow taper, no closed outline (broken grey contour on the outer edge only), soft light above and vapour shade beneath, a vapour halo, wisps fraying off its back |
| Scalded Attendant | peel strips read as claws | fixed | `peelSheet`: sheets keep their width, torn notches down the edges, wet wrinkles, one twist, rolled lip, translucent with pink veining, ragged blunt tattered end; the bed is now the strip-shaped raw track the sheet peeled down from, ending in a ragged tear (an intermediate dome bed read as mushroom caps). Attendant sheets widened (w 18 to 24) and shortened |
| All | palette, Never items | pass | no new colours; no flames on heads, no fish faces; gold only on the Matron |
| All | unique silhouettes | pass | crab now reads as crab (claws, low wide shell) in `sil.png` |

### Pose tests (re-run)
Matron wave (body -3, torso 4, upperarm_n -45, forearm_n -25, hand_n -20, wave 10): pass; bands and spill lobe ride on
the forearm. Mistress fling, Bearer swing, Attendant snap, Brute overhead, Nymph song, Leech lunge: pass, parts attached.
Crab pinch now `claw_n_1 14, claw_n_2 -10, claw_n_3 -18, claw_f_2 10, claw_f_3 12, leg_n1_1 -8, leg_f1_1 8`: pass, the
finger closes on the teeth; rig now 43 bones (four per walking leg).

### Still open after independent review
- Matron: the face is still small against the vast body (head height kept at 350 to match the rig); the hands are
  partly cropped at the frame edges (intended ruler crop). In the wave pose the spill lobe hangs under the lifted
  forearm; it reads as sag, but it could move to its own bone.
- Brute: overhead swing still crosses his face (needs a z-order key, maker's note); his legs still carry a broad diagonal
  cel band (not in this review's brief; `legDetail` could be applied).
- Crab: the far claw and far legs overlap on the right side of the shell; readable, busy at full size.
- Nymph face still slightly mask-like (maker's note).
