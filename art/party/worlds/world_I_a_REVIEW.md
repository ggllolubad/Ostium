# World I, set A: review (The Drowned King, The Bell Below, Mother of Brine, The Grasping Deep)

File: `worlds/world_I_a.js`, helpers in `worlds/kit_I_a.js`. Seeds 101 to 104. All four are foes, built facing right with
`kit.foeBase` plus the Drowned Thrall's world settings (shadow tint `#2a2a38`, silt-green mud), then flipped.
Outputs: `out/worlds/world_I_a_<key>.png` and `_sil.png`, rigs in `out/rig/worlds/world_I_a_<key>/`, pose tests in
`out/worlds/I/<key>_pose.png`, sheets `out/worlds/I/a_sheet.png` and `out/worlds/I/a_sil.png`.

Checked by tracing each body from the code and on zoomed renders (0.9x to 1.6x crops on a mid-dark ground) and at game size
(190 px per human). "Fixed" means it failed on an earlier render and passes on the current one.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Drowned King | pass | pass | fixed | pass | fixed | pass |
| Bell Below | pass (no head; faces in the bronze) | pass | pass | pass | fixed | pass |
| Mother of Brine | fixed | pass | fixed | pass (hair is a stated exception) | fixed | pass |
| Grasping Deep | pass (segments on one axis) | pass | pass | pass | fixed | pass |

### What failed and how it was fixed
- King 3: the near hand on the armrest was an open palm-up hand resting beside the scroll, holding nothing. It is now a
  `B.grip` fist closed over the scroll's top, back of the hand toward the elbow, thumb along the top, fingers over the front
  (no grip warning). The sceptre fist also goes through `B.grip`: horizontal forearm onto a near-vertical rod, square, no warning.
- King 5: the far sleeve's ermine cuff had its torn end pointing up against gravity, and its top read as a post standing
  off the sleeve; the cuff now sits round the sleeve end and the torn end hangs down. The near sleeve polygon had no top edge,
  so its back end curled up over the rail like a hook; it now runs along the top of the forearm and hangs plumb off the rail.
  Bubbles from his mouth crossed the nose; they now rise plumb in front of the face.
- King 1 (checked, pass): skull centre 156 px (0.4 head) ahead of the neck base on the line of the spine; the hunch is
  carried by the curved upper back, the head bows on a short swollen neck. Beard, hair and kelp are drawn in screen space and hang plumb.
- Bell 5: the void hole was not cut (outline and hole were wound the same way) and verdigris spots spilled across it; the
  shell is now wound against the hole, every surface detail is clipped to the shell, and the shell is shaded whole and then
  masked so the hole does not throw a false recess shadow. The clapper hangs from the inside of the crown, the ringer is
  lashed to it at the wrists, chest and waist, the chain leaves the canon ring, the broken length hangs from a canon, and the
  lip rests in the silt at the ground line.
- Mother 1: her head sat on a tall column of neck above sloping shoulders; it is now lowered onto a short thick neck,
  0.27 head ahead of the neck base, bowed toward the front rank so her gaze meets the hands she holds out.
- Mother 3: the child at her belly held its arms out straight in a cross and touched nothing; both arms now wrap round
  her and the hands rest on her. The siren's arm reaches round her waist with the hand on her.
- Mother 5: the shawl's front knot and tails read as a loose black ribbon on the apron, attached to nothing; the shawl now
  lies over her shoulders and the near end is thrown back over the near shoulder down her back. The apron hangs from a neck strap.
- Mother 4 (stated exception): her hair and apron strings float upward. The bible asks for "long weed-dark hair floating
  upward" and "its strings floating", so this is her signature, not a plumb error; everything else on her (drips, kelp on
  her arms, the children's hair) hangs plumb.
- Deep 5: the rope and chain bands across the forearm ran dead straight like belts; they now sag round the limb as rings
  below the eye line should. The two forearm segments left a visible ledge at their seam; the lower segment now tapers into
  the upper one and the rope band covers the joint. Kelp hangs plumb from fingers and wrist; the loose chain hangs into the water.

### Pose tests (attack from each Motion line)
| Figure | Pose | Result |
|---|---|---|
| Drowned King | backhand: torso -6, upperarm_f 46, forearm_f -22, hand_f -18 (arm thrown forward, rod lifted off the floor and tipped toward the front rank) | pass: sleeve, cuff, fist and rod stay attached, nothing crosses the face |
| Bell Below | swing and toll: chain -3, bell -5, clapper +12 (lags, hangs nearly plumb), chain_loose +8, reacher -10 | pass: the lip lifts off one side, the clapper stays inside the bow, nothing tears |
| Mother of Brine | embrace closing: torso -9, head -6, upperarm_n 98, forearm_n 48, upperarm_f -4, forearm_f -22, hair -4 to -8 | pass: the near arm sweeps down across her front, the far arm scoops low; shoulder and elbow caps hold |
| Grasping Deep | slam: arm_1 -10, arm_2 -8, hand -22, every finger joint -14 to -26, chain +6, kelp +22 | pass: the hand comes down over the front rank, the segment seam stays under the rope, finger joints stay closed |

Notes from the pose tests: a flat backhand with the sceptre does not work in 2D, because he grips the rod a third down and
either end then sweeps through his own body; the horizontal sweep is mostly in depth, so the strike frame is the arm thrown
forward with the rod upright. A first Deep slam at full angles stacked past 60 degrees; the values above are the usable range.

## Gate 2: style and detail

| Item | Drowned King | Bell Below | Mother of Brine | Grasping Deep |
|---|---|---|---|---|
| Signature reads at 190 px (a_sil.png) | pass: antler crown spread over the frame top, throne slab behind | pass: bell profile, chain off the top | pass: arms open low and wide, floating hair mass | pass: single upraised arm and open hand |
| Course marks: water | pass: bloat, wet-paper skin, barnacles, coral, kelp, verdigris | pass: verdigris streaks, barnacles, mussels, kelp | pass: bloated pale blue skin, salt, barnacles, kelp fins | pass: swollen puckered skin, barnacles, kelp, tide stain |
| Course marks: void | pass: round clean hole in the cheek, two in the throne | pass: clean hole in the waist with the cut wall showing | fixed: had none; clean round hole through the near upper arm | pass: hole through the forearm, a fingertip unmade at a clean rim, eyes in the skin |
| "Never" items absent (fish faces, purple sparkles, galaxies) | pass | pass | pass | pass |
| Grit count (rulers 12, elite 10) | pass, 30+ (the Tooth, sunk crown band, coral and barnacles on tines, cheek hole, bubbles, one tooth, filmed eyes, kelp beard, ermine clumps and tail tips, moth holes, salt tide lines, chain of office, split tunic with stretch marks, two sunk rings, peeling, lividity, barnacled rod, broken orb and cross, torn dripping hems, mussels, throne tracery, crockets, coral, silt) | pass, 20+ (inscription, verdigris streaks, worn bronze, mouldings, canons with one cracked, broken chain with a sprung link, the cut wall of the hole, the ringer lashed to the tongue, three shoulder faces, six half-sunk bodies, pressed hands, the reacher, barnacles, mussels, kelp, coral, skulls and bones, toll ripples) | pass, 20 (floating hair, coin string with verdigris, darned apron, old birth blood, see-through wet patches, pocket with shears and spool, frayed shawl, barnacles on shoulder and shawl, mussels, salt crust, lividity, veins, peeling, void hole, brimming eyes, floating strings, two children, siren, trailing fin, weed fronds) | pass, 16 (kelp fronds and strands, two rope bindings, frayed rope end, stud-link anchor chain, barnacles, mussels, eyes, void hole, unmade fingertip, torn thumbnail, peeling, lividity and veins, puckering, tide stain, sheeting water and drips, heaved flagstones with a carved grave slab) |
| Three overlapping layers | pass: skin, tunic, velvet robe, ermine | pass: bronze, the drowned in it, verdigris and barnacle crust | pass: skin, soaked apron, wool shawl | pass: skin, rope and chain, kelp |
| Asymmetry | pass | pass (bodies, faces and hands placed unevenly; one broken chain) | fixed: arms were a mirrored "ta-da"; now far arm low and forward, near arm high and open, head tilted | pass |
| Wear on every surface | pass | pass | pass | pass |
| Mud or water to the knee | pass (silt grime on the shins and plinth, standing water) | pass (lip sunk in silt) | pass (waist-deep) | pass (water welling from the breach) |
| No flat empty area bigger than a palm | pass | fixed: big translucent verdigris ellipses read as camouflage; replaced by streaks and small spots | fixed: plain apron and arms; folds, creases, darn, stains, salt and weed added | pass (palm carries creases, pads and puckering) |
| Noise inside the silhouette | pass | pass | pass | pass |
| Palette (deep blue-black, verdigris, drowned gold, plus ink, bone, grey) | pass: gold only tarnished, on the crown, chain of office, rings, orb | pass: gold only in the inscription | pass: gold only in the coins; red-brown only as old blood | pass |
| Read order: silhouette, signature, face, noise | pass | pass | pass | pass |
| Distinct from the other World I foes | pass | pass | pass | pass (checked against the Drowned Thrall; set B and C were in progress) |

### Style fixes made along the way (each failed on an earlier render)
- King: ermine cape was a giant grey slab hiding the robe (now a lumpy collar of wet fur clumps); antlers were round
  banana tubes (now gnarled tapering beams with burr rings, pointed tines, coral and barnacles); a solid side panel hid his
  lap (now an open rail on a scroll post so the robe spills over the seat); mouth read as a cartoon "O" and the cheek hole as
  a third eye (now a slack gape with one brown tooth; the hole sits lower on the cheek); zigzag hems replaced by uneven torn strips.
- Bell: relief figures read first as stick puppets, then as hooded monks; now half-sunk torsos of raised metal with pale
  faces and hands, the bell's metal lapping over their waists in uneven tongues; canons were a row of rings, now arched loops.
- Mother: rebuilt once from scratch (tube hair, block torso, puppet face); hair is now dozens of wavy tapered strands.
- Deep: fingers read as ringed sausages because each segment's shadowed base cap showed; they are now drawn tip first so
  each lit knuckle laps over the next joint, with knuckle wrinkles and flexion creases.

## Still open
- Mother of Brine is the weakest of the four. Her torso still reads as a large smooth mass at full size, and the two
  children and the siren are small and doll-like at game size. A further pass on her body planes is worth doing.
- Bell: the relief bodies are readable but simple next to the reference; they would gain from more varied, overlapping
  poses. The shoulder-band faces still read slightly as cowled.
- Grasping Deep: "fingers longer than a man" conflicts with a 2.4 creature. I kept the elbow below the floor so the hand can
  be large: the middle finger is about 590 px, about the height of the slumped Thrall (565 px) but short of a standing man (640 px).
- Drowned King: his torso is shorter than 2.2 heads (compressed by the hunch) so that the antlers stay mostly in frame;
  the throne top and the antler tips are cropped by the frame, as the entry says.
- Rig: `render_rig.js` writes `"ground": 790` into every rig.json; for these canvases the ground is 1570 (rulers) and
  1370 (the Deep). It is a shared file, so I did not change it.
- Bell: the toll rings are a separate `rings` bone, but rings that spread need scaling and fading, which the Skeleton2D
  rotation rig cannot do; treat them as a VFX layer.

## Independent review

Second art director and logic auditor, not the maker. Checked on renders composited on a mid-dark ground at 0.6x, 1x
and 1.3x, at game size (0.3x, 190 px per human), on `a_sil.png`, and on a pose test per creature. Changes are in
`worlds/world_I_a.js` and `worlds/kit_I_a.js` only. Every rig was re-exported after the fixes; `rig.json` now carries the
real ground line (1570 for the rulers, 1370 for the Deep). Severity: S1 breaks the read or the rules, S2 hurts the read,
S3 polish. Ranked worst first.

### Ranked findings and fixes

| Rank | Figure | Sev | Finding | Fix |
|---|---|---|---|---|
| 1 | Mother of Brine | S1 | Cartoony: big round staring eyes with dark irises and white glints, a smooth torso block, tube arms with mitten hands, a flat apron block, doll-sized children. Weakest figure on the sheet. | Rebuilt (below). |
| 2 | Grasping Deep | S1 | Smooth white mannequin hand. Logic: the visible face was drawn as a palm (life lines, thenar pad) while the fingers curled sideways in the picture plane. Fingers only flex toward the palm, so a palm facing us cannot curl sideways. | The visible face is now the back of the hand in 3/4, palm toward the front rank, so the in-plane curl is a real flexion. Rebuilt the surface (below). Rig and pose kept. |
| 3 | Mother of Brine | S1 | Logic: `B.hand` curled her fingers sideways in the picture plane on palm-facing hands (same error as the Deep). | New `openHand` in `kit_I_a.js`: fingers fan in the plane and bend only by foreshortening; palm or back view; thumb side set by handedness. |
| 4 | Bell Below | S2 | The pale tapered verdigris streaks under every moulding read as icicles: frost's language on a water creature. | Replaced by thin, wandering verdigris runs that fork and pool, mostly darker than the bloom. |
| 5 | Drowned King | S2 | The slack mouth read as a cartoon "O" ringed by a blue lip and a pale tongue; the white eyes read as spectacle lenses (a full ellipse inside a dark socket ring). | Mouth: lopsided gape, thin grey upper lip, lower lip turned out in skin tone, dark swollen tongue, one tooth and a stump, water stringing from the lip. Eyes: the lower lid sags up over the white, so each eye is a half-moon under a heavy lid, with a glassy wet light. |
| 6 | Drowned King | S2 | Both forearm sleeves hung as flat velvet slabs (empty areas far bigger than a palm); the bare shins were plain tubes. | Sleeves: drape and sag folds, wet sheen on the fold ridges, moth holes, torn strips hanging from the hems. Shins: lit tibia edge, calf turn, swollen ankle folds, splits in the skin, puckering, barnacles, a mussel, peeling. |
| 7 | Bell Below | S2 | Two pairs of mussels on the sound bow sat on a relief body's chest and read as nipples. | Moved into two irregular clumps on the sound bow. |
| 8 | Bell Below | S3 | Relief arms were even tubes. | Deltoid and forearm swell, elbow crease, lit forearm edge. |

### Mother of Brine: what was rebuilt
- Body in 3/4 facing the front rank: a dowager's hump, rounded shoulders, a short thick neck with cords and a wattle,
  lit collarbones with the hollows above them and the sternal notch, crepe lines on the old chest, heavy low breasts
  resting on a great hanging belly, a fat roll over the hip. The inner masses carry no outline: their volume comes from
  their own shading and from the creases under them.
- Cloth that clings where wet: a grey linen shift with a torn neckline and loose threads, its near strap slipped down the
  arm; over it the midwife's bib apron on a neck strap, both drawn as one cloth over the forms with drag folds, the cloth
  sinking between and under the breasts and wrapping round the belly, see-through on the high points. Kept: old birth
  blood, darn, pocket with shears and spool, coin string, floating apron strings, shawl (now hugging the back).
- Arms: thick upper arms with the soft flesh hanging under them, deltoid edge, elbow folds, flexor groove, swollen wrists.
  The near arm grows out of the shoulder without an outline so the deltoid flows from the trapezius. Hands: swollen,
  wrinkled, long fingers, flexion creases, washerwoman ridges on the pads, peeling; the near right palm turned up to
  receive, the far left hand palm down over the front rank with thick cracked nails and knuckle whorls.
- Face with weight, age and grief: inner brows lifted, furrows, a deep nasolabial fold, jowls, a parted mouth with the
  corners dragged down. The eyes are what the bible says, a little too large and wet, made unsettling rather than cute:
  filmed grey like a drowned eye, a clouded iris and only a smudge of pupil, heavy drooping upper lids, sagging lower lids
  with a wet violet rim, water standing on them and running down the cheeks without end.
- Floating hair: heavy twisting locks lifting off a plastered scalp and drifting up and back, with thin strands between
  (her signature; a stated exception to plumb).
- Children and siren drawn to read at game size: two children with 104 to 112 px heads (about an adult hero's head at game
  size), dark plastered hair and dark wet smocks so their pale faces read against her; one stares out with white eyes and
  blue lips and clutches the apron, one hides its face in her side with a small hand spread on her. The siren is a thin
  arched girl with ribs, scales from the waist, a webbed hand on the apron and a too-wide singing mouth of needle teeth.

### Grasping Deep: what was rebuilt
Back of the hand: extensor tendons fanning to the knuckles, knuckle heads in whorls of loose skin, a swollen vein,
splits in the skin. Fingers: one continuous swollen digit each (only the long edges and the tip are inked, so a joint
reads by its creases, not as a ring), knuckle wrinkles on the back edge at every joint, a deep flexion crease on the pad
edge, puckered waterlogged skin, washerwoman ridges and a peeling flap on each tip, thick ridged nails with a crack and a
lifting cuticle, a torn split thumbnail. Mottled lividity (violet, green-grey, dead yellow) clipped inside every shape on
the hand, fingers and both forearm segments, plus splits in the forearm skin. Barnacle clusters on the knuckles, the
little finger and the index; weed snagged over the webs between the fingers. The kelp layers sit on the `kelp` bone so
they can be counter-rotated to hang plumb (shown in the pose test with `kelp` +25 against the hand's -25).

### Gate 1: logic audit (independent)

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Drowned King | pass (skull 0.4 head ahead of the neck base, hunch from the upper back) | pass | pass (both `B.grip`, no warning) | pass | pass | pass |
| Bell Below | pass (no head) | pass | pass | pass | pass | pass |
| Mother of Brine | pass (skull 0.28 head ahead of the neck base, hunch from the dowager's hump) | pass (head bowed toward the front rank) | fixed (sideways finger curl; new `openHand`) | pass (hair and apron strings float: stated exception; kelp, drips, children's hair plumb) | pass (apron on a neck strap, shift strap over the far shoulder, slipped strap on the arm, coins on a cord, children's and siren's hands touch her) | pass |
| Grasping Deep | pass | pass | fixed (palm shown while fingers curled sideways; now the back of the hand in 3/4) | fixed (weed between the fingers moved to the counter-rotating `kelp` bone) | pass | pass |

### Gate 2: style and detail (independent)

| Item | Drowned King | Bell Below | Mother of Brine | Grasping Deep |
|---|---|---|---|---|
| Signature reads at 190 px | pass | pass | pass: open arms, floating hair mass | pass |
| Course marks right, "Never" items absent | pass | fixed (icicle streaks were frost language) | pass (bloat, barnacles, kelp, salt; clean void hole in the arm) | pass |
| Not cartoony, no tube limbs, no mannequin surfaces | fixed (mouth, eyes) | pass (relief arms improved) | fixed (rebuilt) | fixed (rebuilt surface) |
| Grit count (ruler 12, elite 10) | pass, 35+ | pass, 20+ | pass, 25+ | pass, 20+ |
| Three overlapping layers | pass | pass | pass: skin, shift, apron, shawl | pass |
| No flat empty area bigger than a palm | fixed (sleeves) | pass | pass | pass |
| Palette | pass | pass | pass (gold only on the coins, red-brown only as old blood) | pass |
| Read order: silhouette, signature, face, noise | pass | pass | pass | pass |

### Pose tests (re-run on the new rigs)
| Figure | Pose | Result |
|---|---|---|
| Drowned King | backhand: torso -6, upperarm_f 46, forearm_f -22, hand_f -18 | pass: sleeve, strips, cuff, fist and rod stay attached |
| Bell Below | toll: chain -3, bell -5, clapper 12, chain_loose 8, reacher -10 | pass |
| Mother of Brine | embrace closing: torso -6, head -5, upperarm_n 52, forearm_n 40, hand_n 10, upperarm_f -18, forearm_f -24, hand_f -10, hair -3 to -6 | pass: both arms sweep down and in over the children, shoulders and elbows stay closed |
| Grasping Deep | slam: arm_1 -5, arm_2 -6, hand -14, finger joints -16 to -26, thumb -12/-16, chain 5, kelp 25 | pass: joints closed, the seam stays under the rope, weed hangs plumb |

### Still open after this review
- Mother: the siren's torso and the children's smocks are still simple shapes next to her; her near shoulder is still a
  broad dome; the back of the plastered scalp has a smooth edge.
- Drowned King: the robe hems are still a fairly regular sawtooth; the ermine collar reads as one barnacled slab.
- Bell: the shoulder-band faces still read slightly as cowled; the relief bodies and the loose pressed hands are simple
  next to the reference.
- Grasping Deep: "fingers longer than a man" still conflicts with a 2.4 creature (the maker's note stands). The segment
  shading still bands faintly at each knuckle.
