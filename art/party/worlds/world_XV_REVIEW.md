# World XV, The Torn Sky: review (batch 1 of 2)

Eight creatures in `worlds/world_XV.js` (helpers in `worlds/kit_XV.js`). The other eleven entries in
`bible/world_XV_torn_sky.md` (Wheel of Thrones, Fourfold Beast, Recording Angel, Weigher of Souls, Porter, Herald, Putto,
Scorched Doves, Throne Lion, Rift Crawler, Star-Lighter) were read only to keep their silhouettes free.

Seeds 1500 to 1507 in brief order: Shattered God 1500, Thunder Seraph 1501, Rift Leviathan 1502, Fallen Angel 1503,
Rift Hound 1504, Storm Shade 1505, Choir of Eyes 1506, Skywreck Knight 1507. Every figure is a foe, drawn facing right with
`kit.foeBase` (through `kit_XV.base`) and flipped. `groundY = canvas h - 30` on every figure. Renders:
`out/worlds/world_XV_<key>.png` and `_sil.png`; rigs `out/rig/worlds/world_XV_<key>/` (no MISSING JOINTS on any); pose
tests `out/worlds/XV/<key>_pose.png`; sheets `out/worlds/XV/sheet.png` (true relative scale, Drowned Thrall at 1.0) and
`out/worlds/XV/sil.png` (a 1.0 human about 190 px), built by `worlds/sheet_XV.py` (after `worlds/sheet_XIII.py`). The final build prints no grip warnings.

| Creature | Tier, scale | Canvas | Note on size |
|---|---|---|---|
| The Shattered God | ruler 5 | 1600 x 1600 | head 470 px (a 5.0 woman); cropped on every side |
| Thunder Seraph | elite 2.4 | 1300 x 1800 | heightened at the same pixel scale: 1536 px tall standing, the spear and tear cropped by the top |
| Rift Leviathan | elite 2.5 | 1100 x 1400 | partly in frame (bible) |
| Skywreck Knight | large 1.4 | 900 x 1100 | built then set at true size with `placeFigure` x1.15 about the feet (it was reading as tall as the 1.1 Fallen Angel) |
| Rift Hound | large, 1.1 long | 1080 x 1100 | widened so the muzzle and tail both fit |
| Fallen Angel | human 1.1 | 820 x 820 | widened for the trailing wing |
| Storm Shade | human 1.0 | 700 x 820 | widened for the forked hands |
| Choir of Eyes | human 1.0 | 600 x 820 | |

## Lore change logged (coordinator, from Cole, 2026-11-23)

The Shattered God is the remains of the Mother of Courses, who held all six courses: not a separate or male god. It is
built to that from the start (no earlier version existed): a vast feminine figure, a seated veiled Madonna of gold-leafed
stone, broken and hollow, void leaking from the cracks, no will left. Her eyes are missing (empty sockets with clean pale
rims, no eye anywhere on her; her eyes are scattered through the void worlds, including this world's Choir of Eyes, whose
central eye has her gold iris). The bible's other lines are kept: her mouth is missing (a clean hole), the Tooth floats
where the heart was, gold leaf cracked over black, violet burns, black void in every crack, the six-rayed nimbus (one ray
per course) broken. Violet lightning appears only as burns; "held in place by violet lightning" is left to the engine's FX
(GUIDE 8 ruling: no arcs baked into figures).

## Courses as drawn

Lightning (dominant): violet Lichtenberg burns (`burn`: a scorched halo, the burnt violet channel, a pale violet thread in
the trunks) clipped to the surface they lie on; metal melted at breaks and frozen in runs (`fusedRun`, `weld`); fused
joints (the Knight's knees and elbow, the Seraph's gauntlets on the shaft, the Fallen Angel's greave on its knee, the
Choir's lids); hair, crests, hackles and feathers standing on end. No arcs or bolts in the air on any figure. The Storm
Shade is the one figure whose body is lightning (the bible: "a human outline made of standing lightning"): its channels
are drawn inside and along its own limbs as an ink drawing (ink-edged, violet-white core, no glow, no bloom, no glowing
outline), and they end where its fingers, hair and feet fork; nothing leaps from it to anything else.
Void (second): cracks opening onto black (`vcrack`, `crackV`: a dark lip, the void, a lit chip on the lip facing the light,
a violet thread on the far lip), clean round holes, clean-edged shards where an edge thins into nothing, void streams that
narrow into drops and shards, starfields inside the Leviathan and the tears (stars only; no nebulae or galaxies), eyes.
Gold leaf cracked over black (the world's own rule). On the Shattered God (second pass) it is `leaf`: gold leaf laid
over black stone in large intact plates; the black shows only along the cracks between plates (some opened, with a lifted
lit lip and a curl of leaf), at chips on the pieces' edges and in recesses; the form is modelled with soft tone and
Living Ink form hatching (`formHatch`, `fold2`). The Choir of Eyes and the halos keep the first pass's `gild` (patchy
losses), which the director passed on the Choir.
Palette: gold, black, violet, plus bone (the Tooth, feathers, the angels' pale skin), grey and ink. No red anywhere.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (non-humanoids: jaw on a hinge, one spine); 2 objects face the user, gaze; 3 grips and hands;
4 weight and balance; 5 contact and attachment; 6 facing and light. "Fixed" means it failed during the build and passes
on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Shattered God | fixed | pass | pass (open hands, no grip) | pass (floats, seated) | fixed | pass |
| Thunder Seraph | fixed | fixed | pass | pass | pass | pass |
| Rift Leviathan | pass (one spine, jaw on its hinge) | n/a | n/a | pass (swims) | fixed | pass |
| Fallen Angel | pass | pass | fixed | pass | fixed | pass |
| Rift Hound | pass (jaw on its hinge) | n/a | n/a | pass | fixed | pass |
| Storm Shade | pass | n/a | n/a (forked hands) | pass | pass | pass |
| Choir of Eyes | n/a (floating shards) | pass (all gaze at the party) | n/a | pass (floats) | pass | pass |
| Skywreck Knight | fixed | pass | pass | fixed | fixed | pass |

What failed and how it was fixed:
- God 1: the first neck was a straight broad column under the jaw and read as a pillar; it is now a long tapering neck in
  line with the bowed head, its base broken jagged with a sheared cramp.
- God 5: the lap and the breast first touched behind the offered forearm, so the figure read as one mass; the waist break
  and the lap's top were pulled apart (gap 100 px) so every piece hangs free.
- Seraph 1/2: in the first build the spear ran straight up in front of the face and both forearms crossed the face. The
  spear now stands forward of the body (toward the party), the near elbow is high and back so its forearm passes above the
  head, the far arm is behind the head in depth, and the head is tilted back (-0.66 rad) to look up the shaft at the tear.
- Seraph 3: both gauntlets go through `B.grip` with maxBend 40; the forearms meet the near-vertical shaft about 22 to 35
  degrees off square; no warning.
- Fallen Angel 3: the first cross-guard was a fat slab that read as a loaf in the hand; it is now a slim bar with flared
  quillons, the grip and gold pommel below the fist. The sword fist is an `inline` grip (no bend).
- Fallen Angel 5: the first fused runs hung off the bottom of the greave as loose crumbs; the greave is now fused to the
  knee along its top edge (a melted lip with a violet seam) and no runs float.
- Leviathan 5: the first dorsal fin ran along the inside of the coil; it now runs along the back (outer side) of both the
  main body and the upper coil. The head first ran off the canvas edge; the neck was pulled in and the head scaled to fit.
- Hound 5: the hackle spikes first pointed into the body; they now stand up off the topline. The muzzle was cut by the
  frame; the canvas was widened.
- Knight 1: the first helm was an egg floating ahead of the shoulders. The spine is now hunched from the upper back, the
  helm is angular (flat facets, a medial ridge), sunk into the hump and welded to the bevor; the skull centre sits 0.4 head
  ahead of the neck base on the line of the curved spine.
- Knight 4/5: the lance first had a burn branching off the shaft into the air (an arc); every burn on a narrow surface is
  now clipped to it (`burn(..., { clip })`). The lance is clamped under the near armpit and gripped inline.
- Every burn that could cross a silhouette edge is clipped to its surface (faces, hands, shafts); burns on broad surfaces
  sit inside `clipDraw` regions.

## Pose tests (the attack from each Motion line)

Sign convention for the exported (mirrored, facing left) rigs: a positive angle turns a bone clockwise on screen.

| Figure | Bones | Test | Result |
|---|---|---|---|
| The Shattered God | 9: lap, chest > tooth, head > nimbus, arm_n, hand_f, mantle, chips (each piece on root so it drifts) | drift apart (`head -4, nimbus 3, hand_f 7, arm_n -6, chest 2, tooth 12, chips 3, mantle -3`) | pass. Pieces move independently; nothing tears because no piece is joined to another. The discharge from every crack is FX. |
| Thunder Seraph | 36: standard + spear, skirt, tear, wing_{n,f}{1,2,3}_{1,2,3} | strike down the spear (`torso -4, upperarm_n -6, forearm_n 5, upperarm_f 5, head 6`, wings flared 8 to 12) | pass. Wings stay rooted on the back. The strike itself is FX along the shaft. |
| Rift Leviathan | 13: tear, seg_1..8, head, jaw, coil_1, coil_2 | lunge (`seg_5..8 -5 to -12, head -6, jaw 20, coil_2 8`) | pass. The segment cuts show a faint tick where the violet rim strokes of two copies meet; no gap opens. |
| Fallen Angel | 24: standard + sword, skirt, halo, wing_n_1..3, wing_f_1..3 | desperate strike (`torso -8, upperarm_n -45, forearm_n -35, hand_n -10, head -6`, legs, wings) | pass |
| Rift Hound | 19: spine_1, spine_2, neck, head, jaw, tail_1..2, 4 legs x 3 | lunge (`spine_2 -6, neck -10, head 6, jaw 18`, forelegs reaching) | pass |
| Storm Shade | 15: standard humanoid | strike (`torso 4, upperarm_n -14, forearm_n -10, hand_n -6, upperarm_f 12`) | pass |
| Choir of Eyes | 11: cluster > eye_1..eye_10 | hymn (`cluster 3`, eyes -10 to 10) | pass |
| Skywreck Knight | 17: standard + lance, tassets | lance charge (`pelvis -6, torso -8`, near leg drives, `lance -5`) | pass. Keep `head` small: the helm is welded to the bevor (on the torso). |

Holds that need IK:
- **Thunder Seraph:** two hands on one spear. The spear is parented to `hand_n`; the far hand (`hand_f`) must be solved
  onto the shaft with two-bone IK in any frame that moves the arms.
- **Fallen Angel:** the far hand is clamped on its own side over the void crack. It rides the far arm chain, so a large
  torso bend lifts it off the plate; pin it to the torso with IK or keep `torso` under about 8 degrees.
- **Skywreck Knight:** the lance is clamped under the near arm and held in the near hand (one hand, no IK); the far arm
  is fused to the flank and should not animate.
- None for the others.

## Gate 2: style and detail

Signature at 190 px is judged from `sil.png`. Section 9 test for each row: which course did this, to whom, and does the
bible say so? This world has a heaven and its host, so relics and holy rank are supported (halos, the Tooth, the
inscription band, the seraph's spear, the knight's lance); the cast was never human, so "the former self" is the rank or
office in heaven each held.

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Section 9 | Result |
|---|---|---|---|---|---|---|---|
| The Shattered God | yes: a broken ring of nimbus round a veiled head, the raised blessing hand and the heart hole, all as separate pieces with clean gaps | burns on every piece; gold melted into runs; sheared iron cramps; void cracks, sockets, mouth hole, heart hollow, leaking streams, shards / no arcs, no eyes on her, no galaxies | 22 (12): six-rayed nimbus, two snapped rays, veil, mantle and lap carved in deep folds, carved hair waves, large empty sockets with void tears, mouth hole with its carved corner, a knotted cord girdle with tassels, heart hollow with the Tooth (growth lines, crack, gilt wire), five iron cramps, hollow break faces (shell and void) under the breast, neck and forearm, the sleeve mouths open on the hollow, inscription band, a ring, two fingers gone with clean ends, cracks across the fingers, nails and knuckles, void leaks with drops and shards, floating chips, drifting leaf, a void disk on the lap | gilt stone, black shell, void | pass | remnant: the Mother's veil, mantle, blessing and the offering hand; pushed: void hollowing her (bible) and lightning's burns | pass, with open notes |
| Thunder Seraph | yes: the upthrust spear into the tear with six wings round it | burns down the shaft, the cuirass, greaves, wings; gauntlets fused to the shaft in runs; crest and feathers standing; void crack across the gold face, void disk in a wing, the tear / no arcs on the spear (the strike is FX) | 20 (10): tear with stars and three eyes, spear bands and butt cap, fused runs, gorget, layered pauldron, a shaped cuirass with three overlapping fauld lames and rivets, seven tapered pteruges, black kilt with burnt hem, cuisses, domed knee cops with lames and wings, greaves over the calf with a shin ridge, lamed sabatons, a helm with brow band, riveted cheek guard and ridged bowl, crest of feathers, dents and scorch, snapped wing, burnt lower wing, closed carved lids | arming coat, plate, wings | pass | remnant: the host's armour and spear; pushed: the crack across the face, arms locked on the shaft | pass |
| Rift Leviathan | yes: the coil out of the tear and back in, the jaw open | starfield body, violet edges, clean-edged tear, shards; burns across the fin; the fin's edge frayed and notched / no galaxies (stars only), no glowing outline (a thin rim with a dark inner band) | 14 (10): a dorsal ridge of scutes, a fin of torn membrane on uneven rays with holes and burns, ventral plates of dark hide, lateral line, gill slits, gold needle teeth cracked over black, gilt gum lines, six brow eyes, the upper coil in the main body's cast shadow, tear with an eye, shards, drifting leaf | void, fin membrane, gold | pass | an animal of the dark between stars (bible); pushed: the void body | pass, with open notes |
| Skywreck Knight | yes: a hunched fused mass with a broken lance couched forward | welds and runs everywhere, fused knees and elbow, the far arm fused to the flank, the wings melted into the back; landing crater with violet in the deepest crack, void cracks, a void hole, burns / none | 18 (6): welds, runs, folded plate-feather wings, crater, cracks, burns, dents, scratches, vamplate with rivets, splintered lance fused at the break, gold bands on the shaft, pauldron, couter, shaped rerebrace and vambrace, cuisses, domed knee cops welded half bent, greaves over the calf, sabatons, riveted curved tassets, melted crest, visor welded shut with breath holes | hose, plate, wing plates | pass | remnant: a knight's lance, vamplate and tassets; pushed: lightning fusing the plate into one shell (bible) | pass |
| Rift Hound | yes: a deep-chested hound with standing hackles and an open jaw | a hole modelled in violet-edged planes of dark violet (topline, shoulder blade, rib barrel, brisket, haunch, loin; two planes on every leg segment), eyes, shards off the tail, ear and back; lightning: hackles standing, paws burning the floor / no sparkles | 9 (6): eight eyes, hackles, shards, floor burns, planes, faint ribs, leaf falling in, tooth notches in the rim, knuckled paws with glassy claws | void, rim | pass | an animal (a hound), named by the bible | pass, with open notes |
| Fallen Angel | yes: the cracked halo, sword raised, one wing trailing on the floor, one torn wing up | burns on the face, arm, thigh, cuirass, wings; greave fused to the knee; hair standing; void crack in the side, the wing's break / none | 15 (6): cracked halo, sword (fuller, notches, wire grip, pommel, guard, burn), dents and scorch, void crack under the hand, pteruges with gold tips and charred edges, black kilt with charred hem, shoulder guard with rivets, belt clasp, fused greave, sandal straps, standing hair, the wing's break with void and a fused run, drifting leaf | skin, tunic, plate, wings | pass | remnant: the host's armour and sword; pushed: the fall (broken wings) and the burns | pass |
| Storm Shade | yes: a lunging figure with forked hands and branching hair | it is the lightning (bible); floor burns; fulgurite; lifted gilt tiles / no glow, no glowing outline, nothing leaping off it | 9 (6): heart knot, forked fingers and toes, standing filaments, floor burns, fulgurite tubes, lifted gilt tiles, socket and mouth gaps, brow and nose channels, body creases | volume, channels | pass | a strike that did not stop (bible); human outline kept | pass |
| Choir of Eyes | yes: a cluster of shards round one big eye, stalks trailing | gilt shards cracked over black, burns on three, cracks on two, lids fused on one, an empty socket, void stalks thinning into shards / none | 10 (6): ten face shards with brows and cheek folds, lips open on the note, optic stalks, shards, burns, cracks, fused lids, empty socket, the central gold iris, the shell's thickness, drifting leaf | gilt skin, eye, void | pass | the god's eyes (bible), linked to the lore change | pass |

Silhouettes: no two creatures share a silhouette at 190 px (`sil.png`): a cropped colossus of floating pieces, a six-winged
figure under a vertical spear, a giant coil, a hunched mass with a horizontal lance, a long low spiked quadruped, a
swordsman with a halo and a dragging wing, a forked lunging figure, and a cluster of shards. They stay clear of the
later batch: the crossed wheels (Wheel), the couched winged lion with four faces (Fourfold Beast), the book and quill
(Recording Angel), the rigid T with pans (Weigher), the key over the shoulder (Porter), the level trumpet and banner
(Herald), the small bow (Putto), the flock (Doves), the low segmented crawler (Rift Crawler) and the tall pole with its
cage (Star-Lighter). The Throne Lion is the nearest risk to the Rift Hound: keep the lion four-square and heavy with its
floating haunches, and the hound long, low and spiked with its jaw open.

Faults from section 8 and the brief, checked per figure:
- Tube limbs: humanoid arms use `muscleArm` or `jointLimb`, legs `fullLeg`; the hound's limbs are the reviewed Cinder
  Hound segments; the Storm Shade's limbs are `jointLimb` outlines.
- Balls, eggs or domes: the Knight's helm was the one egg and was rebuilt angular; the Choir's shards are irregular
  broken plates with jittered corners.
- Mannequin skin, hands without knuckles: `fistDetail` on fists; `openHand` (knuckles, creases, nails) on open hands.
- Cartoon faces and staring eyes: eyes are almond, lidded, half covered by the upper lid (`eye`); the hound's eyes are
  small and narrow; the God has no eyes.
- Objects facing the camera: none held for reading.
- Hands not holding / props attached to nothing: every grip through `B.grip`; the Tooth floats by design (the bible).
- Face shading: Fallen Angel 0.8, Seraph 0.8, God 0.78.
- Large flat cloth: kilts, veil, mantle, lap and sleeves carry folds, burns, cracks and losses.
- Course splits as ruler-straight lines: every crack is a wandering spline; breaks are jagged polylines.
- Lightning arcs baked in: none (see the Courses section).

## Second pass: the director's sheet check (2026-11-23)

The director's sheet check failed five figures; Fallen Angel, Storm Shade and Choir of Eyes passed and are unchanged.
Each fix was checked at 2 to 3x zoom against the Drowned King (ruler bar), the world_VI wings and the Plague Wolf and
Magma Hound (canine anatomy), and at sheet and game size.

| Figure | Director's fail | Fix |
|---|---|---|
| The Shattered God | gold leaf read as leopard print | new `leaf`: large intact plates of leaf over black stone, black only in plate cracks (some opened with a lifted lit lip and curling leaf), edge chips and recesses; most of each piece reads gold, modelled by soft tone and `formHatch` |
| | face a flat mannequin profile, sockets tiny dots | a carved profile laid over the base face (brow ridge, the dip at the root of the nose, a long straight nose and its wing, the upper lip's curve, the chin standing forward); the skull modelled in tone (the side plane, temple hollow, cheekbone lit with the hollow under it, jaw underplane, lit chin, deep orbits); brows carved with their inner ends raised; the sockets are large deep hollows (near 0.17 x 0.10 of the head) with clean pale rims, a violet depth inside, and the void running out of them as wide tears; the mouth gone as a clean hole with its corner still carved; the head bowed toward the party |
| | breast a blob, mantle and lap blocks; the perforated disc | `fold2` drapery (a dark valley on the shadow side, a lit ridge, the crease, form hatching across the valley) on veil, mantle, sleeves, breast and lap; the breast's curve lit and turning under to a fold, ribs under the cloth below a knotted cord girdle with tassels; the lap has two knees (the near one lit, the far one in shade), a deep valley falling between them, tension folds along the thigh and folds dropping and pooling below; the morse (the perforated disc) is removed |
| | hands flat mitts | the blessing hand now shows its back (nails, knuckle bumps, tendons), the offered hand its palm (the heel of the palm lit, the hollow dark, nails at the curled tips); both have hatching down each finger's shadow side, lit knuckles, and void cracks across two fingers |
| | pieces should feel like one body broken | `breakFace`: under the breast, the neck and the forearm's broken elbow the underside of the break shows (seen from below), a band of chiselled stone shell round the hollow void inside; the sleeve mouths and the heart are ringed with the shell; every piece has its shell thickness on the side away from the light |
| Thunder Seraph | wings rows of identical planks | the reviewed world_VI `wing` with varied primary and secondary lengths (`pLen`, `sLen`), notches, slimmer emarginated primaries (slots), darker scorched tips, four tertials, and a different spread per pair: the upper pair half folded and raised beside the spear, the middle pair thrown wide, the lower pair drooping half closed, the far middle wing snapped and hanging |
| | box cuirass, slab greaves, block knee plates, slipper feet | new `cuirass` (chest swell, pectorals, medial ridge, waist taper, three curved fauld lames lapping downward with rivets) and `armourLeg` (a cuisse, a domed knee cop with curved lames above and below and a side wing, a greave swelling over the calf and narrowing to the ankle with a shin ridge, a lamed sabaton with a pointed toe); a layered pauldron on the torso |
| | only a box for a head | a shaped helm: a gold face (closed lids and their creases, the brow, the nose's ridge, modelled cheek and jaw) in a brow band, a riveted cheek guard, a bowl swelling over the skull with a ridge and the crest's socket; tilted up less (-0.5 rad) so the face reads |
| Rift Leviathan | even-width tube, flat lozenge fin | the body tapers from a thin tail out of the tear to a heavy neck (radius 22 to 108); a dorsal ridge of black scutes; a fin of membrane slung between rays of uneven spacing and length, sagging between them, torn away in places and holed; ventral plates of dark hide on the belly lapping each other; the main body casts a soft shadow on the coil it passes in front of |
| Rift Hound | stick legs, a flat black shape | the Magma Hound's leg geometry (elbow back under a deep brisket, sloped pasterns, a heavy thigh, the stifle forward, a sharp hock), a deeper chest and a higher tuck, heavy withers; knuckled paws with a heel pad, three toes and glassy claws; the hole modelled in violet-edged planes of dark violet set by which way each faces, two planes on every leg segment |
| Skywreck Knight | blocky slabs | the same `armourLeg` with welded knees; rerebrace and vambrace shaped over the muscle with lit planes and lame lines; the breastplate swells over the chest and turns under to a narrower waist (tone and form hatching) |

## Still open (honest notes for the director)

- **The Shattered God:** the face is a carved profile with a strong nose and chin now, but it is still more a statue's
  mask than a grieving face at full size; the near tear crosses the nose where a real tear would run beside it. The
  blessing hand's last two fingers are only foreshortened, not folded (the shared open hand cannot fold fingers in back
  view). The breast reads through its fold, girdle and light more than through its silhouette.
- **Wings:** the flight feathers are still the world_VI feather (rounded planks with slots) as reviewed on the Harpy
  Matron; varied lengths and spreads now break the rows, but at full size each feather is still a plain vane.
- **Rift Hound:** the head keeps the Magma Hound's long skull, which reads a little crocodilian with the jaw fully open.
- **Rift Leviathan:** the belly plates are evenly spaced (true of scutes, but regular at full size); the rig's segment
  cuts show faint ticks where two copies' rims meet.
- **Storm Shade:** its body is drawn as lightning by the bible's entry; if the director wants every channel as FX, the
  volume and channel layers are separate draws and can be split onto an FX layer.
- **Gold dominance:** gold is allowed everywhere here, so four figures are gold-led; they are told apart by value (the
  Knight and Seraph burnished plate, the God's leaf, the Choir's patchy leaf, the Fallen Angel's pale skin).

## Independent review (2026-11-23, after the director's second sheet check)

Reviewer did not build the batch. Scope: the director's callouts 1 to 5, then the full LOGIC_CHECKLIST audit on all 8.
Every changed figure was re-rendered (`node render.js worlds/world_XV <key>`, no grip warnings), re-rigged
(`node render_rig.js`, no MISSING JOINTS on any of the 8) and pose-tested; checked at 2 to 3x on a mid-dark ground and at
sheet size; `sheet.png` and `sil.png` rebuilt with `worlds/sheet_XV.py`.

New code: `kit_XV.godHand` (a carved hand whose fingers fold: three phalanges per finger at their own bend angles, a
taper from base to tip, knuckle bumps on the back of each bent joint, pads on the palm side, palm-side crease pairs,
wrinkle arcs over the joints, nail plates with cuticle and free edge, cut stumps showing shell and hollow; the palm as
its own shape with mound, hollow and creases). `world_XV.plateLeg` replaces the old `armourLeg` (removed) in two styles.
`kit_XV.crackedHalo` gains `capW` and now clips its burns to each ring piece.

### Gate 1: logic audit (independent)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Shattered God | 1 head: profile mask; the far tear (void) ran down across the nose | head turned toward three-quarter and bowed further (0.32 to 0.5 rad); both orbits, the far cheek's contour and the nose's projection drawn; the far tear laid on the far cheek *behind* the nose (drawn before it) and dripping plumb off the cheek's contour | pass at 2x: no tear crosses the nose |
| Shattered God | 3 hands: fingers even-width tubes that could not fold | both hands rebuilt with `godHand`: the blessing hand (index and middle up at different bends, ring and little folded over the palm with nails showing, the thumb laid across to the ring finger); the offered hand palm up, fingers relaxed at different curls, ring and little broken off (stumps with shell and void) | pass |
| Shattered God | 5 the girdle a straight rod across the chest, half hidden by the forearm | a twisted cord wrapped twice round the ribs, converging on a knot at the front under the breast, two knotted ends hanging plumb with frayed tassels | pass |
| Shattered God | 5 the near arm's upper arm missing with nothing to show where it went | the armhole broken open at the shoulder (jagged shell rim, void, a leak) | pass |
| Shattered God | 6/Never: halo pieces' burns could run off the ring into the air | burns clipped to each ring piece (kit change, also on the Fallen Angel's halo) | pass |
| Thunder Seraph | 5/Never: two wing burns and the far-gauntlet burn unclipped (could branch into air) | clipped to the wing arm and the gauntlet | pass |
| Thunder Seraph | rig: the knee cop was drawn before the knee cut, so a bent knee would split it between thigh and shin | cop and fan now drawn after the leg on the shin bone (`fn.knee`) | pass: pose with `shin_n -14, shin_f 16` keeps both cops whole |
| Skywreck Knight | rig: same knee split | same fix | pass: pose with `shin_n 22, shin_f -16` |
| Skywreck Knight | 5/Never: the back burn unclipped | clipped to the torso shell | pass |
| Rift Leviathan | rig: ticks in the rim at every segment cut (the straight part of each cut crossed the body) | overlap disks widened past the body and fin (`min(w + 80, 190)`), clip circles grown to hold them | pass: lunge pose at full size shows no tick |
| Rift Hound | 1: skull read crocodilian | canine skull (see Gate 2); jaw shortened to match | pass; lunge pose `jaw 18` opens on the hinge |
| Fallen Angel | 5/Never: wing, arm, thigh, greave and sword-blade burns unclipped (the blade burn could fork off a narrow blade into air) | each clipped to its surface | pass; strike pose re-run |
| Storm Shade, Choir of Eyes | no fault found | none | pass |

Audit by checklist item (all 8, after fixes):

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | groundY | Seed | Palette |
|---|---|---|---|---|---|---|---|---|---|
| Shattered God | fixed (bowed on the neck's line) | pass (no object; bowed toward the offered hand) | fixed (open hands, no grip) | pass (floats) | fixed (girdle, armhole) | pass | 1570 | 1500 | pass |
| Thunder Seraph | pass | pass (head tilted up the shaft to the tear) | pass (both fists through `B.grip`, maxBend 40, no warning) | pass | fixed (burns) | pass | 1770 | 1501 | pass |
| Rift Leviathan | pass (one spine) | n/a | n/a | pass | fixed (cuts) | pass | 1370 | 1502 | pass |
| Fallen Angel | pass | pass | pass (`inline` sword grip; far hand clamped on the crack) | pass | fixed (burns) | pass | 790 | 1503 | pass |
| Rift Hound | fixed (canine skull, jaw on hinge) | n/a | n/a | pass | pass | pass | 1070 | 1504 | pass |
| Storm Shade | pass | n/a | n/a | pass | pass | pass | 790 | 1505 | pass |
| Choir of Eyes | n/a | pass | n/a | pass | pass | pass | 790 | 1506 | pass |
| Skywreck Knight | pass (hunch from the upper back) | pass | pass (lance `inline` in the near fist, clamped under the arm; far arm fused) | pass | fixed (burn) | pass | 1070 | 1507 | pass |

Palette was checked by machine: every SVG colour token and every rendered pixel was scanned for red (hue under 20 or over
340 degrees, saturation over 0.4). No red token on any figure; the at most 81 flagged pixels per figure are antialiased
dark-gold edges. Gold appears throughout (allowed by the Torn Sky file), as does violet; bone and grey are used for the
nimbus's frost, barnacles and brackets. Eyes appear only as the bible allows (void world). All 8 are `flip: true`.

**Lightning arcs:** none in the air. Every burn on every figure is now either drawn inside a clipped surface
(`clipDraw`, `piece`, `metal`) or passed `clip:` with its surface's shape; the only unclipped burns lie on the floor
(Hound paws, Storm Shade), which is a surface. The Storm Shade's body is lightning by its entry and stays inside its
own limbs (unchanged).

**Silhouettes against the full XV roster (`sil.png`):** unchanged reads, all distinct: the God (a cropped colossus of
floating pieces, now ringed by six spiked rays and with a raised two-finger blessing), the six-winged figure under a
vertical spear, the coil through the tear, the hunched mass with the couched lance, the long low hackled hound (now with
a canine head, still clear of the Throne Lion's four-square stance and floating haunches), the swordsman with the
dragging wing, the forked lunging figure, the cluster of shards. None approaches the second batch's signatures (crossed
wheels, four-faced winged lion, book and quill, the T with pans, the key, the trumpet and banner, the small bow, the
flock, the segmented crawler, the pole and cage).

### Gate 2: style and detail (independent)

| Figure | Director's callout / finding | Fix | Re-check |
|---|---|---|---|
| Shattered God, face | mannequin mask in strict profile | three-quarter, bowed; grief carried by carving: brows drawn up at their inner ends with a furrow and a crease above, a heavy upper-lid shelf over each empty socket (lit top, fold above, its shadow dropped into the socket, drooping at the outer corner), the cheek drawn in under a lit cheekbone, the fold from nose to mouth, the soft downturned corner of the mouth and the lower lip's shelf round the clean hole; face shading about 0.8; leaf cracks thinned on the face (cell 120) | pass at 2x and sheet size: reads as a grieving carved Madonna, not a mask |
| Shattered God, hands | sausage fingers | `godHand` (knuckles, taper, nails, creases, different bends); cracks across two fingers, a ring, a burn on the palm | pass |
| Shattered God, torso | breast and mantle one blob with a rod | breast stands out of the front contour (lit top, core shadow, cast shadow on the ribs under the girdle); tension folds from breast to shoulder and from armpit to girdle; collarbone and shoulder cap modelled; ribs under the thin cloth; armhole break; knotted cord girdle | pass: breast, ribcage and shoulder read through the cloth |
| Shattered God, nimbus | rays thin, broken, only two in frame | ring band 50 to 72 px; six rays 92 px wide set round the visible ring, each with its course's mark from bible 00: fire split on a seam of light with charred lips, flakes and rising ash, the tip burnt black; frost rime on the windward edge and icicles hanging plumb; lightning a branching burn and two fused runs; water swollen with barnacles and drips; toxin pustules and shelf brackets; void clean see-through holes and the tip thinning to shards; two rays snapped with a break face; ring end caps thinned (`capW`) | pass: six distinct rays at sheet size; frost, toxin and water read first, fire's seam reads at full size |
| Thunder Seraph, legs | stacked boxes | `plateLeg` 'seraph': fluted conical cuisse with a bowed top edge; peaked cop with a scalloped five-flute fan; greave with a medial ridge and cusped top, swelling over the calf and tapering to the ankle; specular streak, core shadow and reflected light on every plate; long pointed lamed sabaton | pass |
| Skywreck Knight, legs | stacked boxes, same set as the Seraph | `plateLeg` 'knight': heavy rounded plate with roped edges, three articulating lames, a round dome cop with a raised roll and a heart-shaped fan, a hinged riveted greave, a broad blunt sabaton, a weld across each cuisse and over the knee | pass: the two sets read as different armourers |
| Rift Leviathan | ventral plates evenly spaced like a ladder | scutes grow from 7 px at the tail to over 30 px at the neck with a little random size, every edge laid along the curving centreline (they fan on the outside of a bend and crowd on the inside), each lapping the one behind with a lit lip and a dropped shadow, wear scored across the big ones | pass |
| Rift Hound | crocodilian skull | muzzle shortened (tip 140 to 122) and deepened at its root, a defined stop under the brow ridge, cheek mass (the zygomatic arch over the masseter) behind the mouth's corner, a blunt nose pad with a nostril, the flew under the lip, a flatter cranium, eyes re-set | pass at full size: canine |

Section 9 test on the new marks: the nimbus marks are the six courses she held (bible: "the Mother of Courses, the
being in whom all six courses met"), so each ray's mark is its course's own shape language; the grief is the bible's
"slack and without will" carried by the statue's carving, not a new emotion; the cord girdle and the blessing are the
Madonna's own dress and gesture (the remnant of what she was). Nothing is taken for horror alone.

Grit after this pass: Shattered God about 30 (was 22): six course rays, the knotted cord and its two knotted ends, the armhole
break, folded and broken fingers, nails, a ring. Seraph and Knight each add fans, lames, fluting or roping, hinges and
rivets on the legs.

### Holds that need IK (unchanged)
- **Thunder Seraph:** both hands on one spear; the spear rides `hand_n`, so `hand_f` needs two-bone IK onto the shaft
  in any frame that moves the arms.
- **Fallen Angel:** the far hand is clamped on its own side; pin it with IK or keep `torso` under about 8 degrees.
- **Skywreck Knight:** none (one hand on the lance, the far arm fused to the flank and not animated).
- None for the God (open hands on free-floating pieces), the Leviathan, the Hound, the Storm Shade or the Choir.

### Still open after the independent review
- **God, girdle:** the offered forearm (a separate floating piece) covers most of the lower torso, so only the cord's
  upper run, the knot and the top of the knotted ends show; at game size the cord reads as a band with a knot.
- **God, nimbus:** the void ray sits at the frame's top corner and is partly cropped; the fire ray's split reads at full
  size but only as a dark streak at sheet size.
- **God, hands:** the fingers fold in the picture plane (a side view of the curl); there is no true foreshortening
  of a finger toward the viewer.
- **Rift Leviathan:** the head is one piece over the neck, and its back edge shows as a rim line across the neck,
  noticeable in the lunge pose (it predates this review).
- **Thunder Seraph:** the gold strips over the kilt are rounded slabs; they were outside this callout and are the
  nearest thing to a "box" left on the figure.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| The Shattered God | torso and mantle smooth blobs under the forearm | Carved: heavy drape folds from the near shoulder's cap diagonally to the girdle, cloth bloused over the girdle in short loops, a cross-pull from the armpit, six tension folds radiating from the breast (to the shoulder seam, the armpit and the girdle) with their sharpest ridges lit; on the mantle three secondary folds between the long ones, a catenary sag where it hangs from the shoulder and the turned-back border as a lit band; on the lap three catenary folds slung from the near knee and broken V-folds pooling above the hem band. | pass at 0.3x: the drapery reads as carved cloth |

Rig re-exported (9 bones, no MISSING JOINTS); drift pose (review values): pieces move independently. Sheets rebuilt
(`worlds/sheet_XV.py`, `worlds/sheet_XV_b.py`).
