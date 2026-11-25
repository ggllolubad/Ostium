# World III, The Boiling Baths, second batch: review

Figures (seed 320 + index): The Best Families (320, ruler), The Great Copper (321, ruler), The Strigil-Master (322,
elite), The Invalid Countess (323, elite), Hypocaust Stoker (324), Votive Pilgrim (325), Physic of the Waters (326),
Lustral Priest (327), Lapdog (328), Hypocaust Roaches (329), Pump Mule (330, large). Names are the bible's current names.
World III now has 19: rulers Matron, Best Families, Great Copper; elites Bath-Mistress, Cauldron Bearer, Strigil-Master,
Invalid Countess; 12 cast.

File `worlds/world_III_b.js`; new helpers in `worlds/kit_III_b.js` (it requires `kit_III.js` and reuses peelSheet,
handBack, legRig, legDetail, mchain, mlimb, scald, blisters, seam, steam, wisp and the rest; `world_III.js` and
`kit_III.js` are untouched). New helpers: `face` (B.head with a warm rose shadow tint, faceShade 0.78 and soft blurred
cheek, side and socket planes), `muscleArm` (the reviewed Cauldron Bearer arm, generalised), `bentLeg` (one mchain outline
for a strongly bent leg: quad, hamstring, knee knob and crease, calf, Achilles; split for the rig), `fireHook`, `pearls`,
`silverRing`, `skinGlove`, `roach`, `hoof`, `paw`, `clothWear` (damp patches, stains, tide lines clipped to a cloth
outline), `glassPart`, and `brick` and `pores` textures. All foes built facing right with kit.foeBase (via
`kit_III.base`), `flip: true`; `groundY` = canvas h - 30 on every figure (checked in every rig.json).

Outputs: `out/worlds/world_III_b_<key>.png` and `_sil.png`; rigs in `out/rig/worlds/world_III_b_<key>/`; pose tests in
`out/worlds/III_b/<key>_pose.png`; `out/worlds/III_b/sheet.png` (the 11 at true relative scale with the Drowned Thrall),
`sheet19.png` (all 19, the first 8 from the existing `out/worlds/world_III_<key>.png`), `sil.png` (all 19 at 190 px per
human; translucent steam shows as grey haze, as in the first batch). Sheet script:
`/tmp/claude-0/-home-claude/b481cb9f-fd90-5adc-8daf-8b9ac366d903/scratchpad/wIII_b/sheets.py`.

Method: each figure rendered alone, composited on a mid-dark ground, zoomed 1.4x to 3x on heads, hands, held objects and
feet, checked at sheet size, then rig-exported and posed. Grip angles from `B.gripAngle`; every grip renders with no
`grip ... move the elbow` warning (a final audit found three grips I had silenced with `quiet`: fixed, see below).

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact/plumb | 6 Facing/light |
|---|---|---|---|---|---|---|
| Best Families | pass (patriarch's skull over his neck, highest point) | pass | fixed | pass (mass low and forward, hands flat on tiles) | pass | pass |
| Great Copper | n/a (no head; stokers' heads on their necks) | pass | fixed | pass (all on the brick) | pass | pass |
| Strigil-Master | pass | pass | fixed | pass (front knee bent over the front foot) | pass | pass |
| Invalid Countess | pass | pass | pass | fixed | pass | pass |
| Hypocaust Stoker | fixed | pass | pass | fixed | pass | pass |
| Votive Pilgrim | pass | pass | fixed | fixed | fixed | pass |
| Physic of the Waters | pass | pass | pass | pass (heels, belly forward) | pass | pass |
| Lustral Priest | pass | n/a | fixed | pass (front foot) | fixed | pass |
| Lapdog | pass (one spine, jaw on its hinge) | n/a | n/a | pass (four paws planted) | fixed | pass |
| Hypocaust Roaches | n/a | n/a | n/a | pass | pass | pass |
| Pump Mule | pass (head on the neck's line, jaw hinged) | n/a | n/a | fixed | fixed | pass |

Measurements behind the passes:
- Physic 2: eye at about [355,198], flask bulb [438,162]: 23 deg above horizontal; head axis -34 deg; 11 deg apart. The
  fist pinches the neck with the forearm horizontal (8 deg off square), the flask hangs below the little-finger side.
- Strigil-Master 3: strigil grip inline (a sickle handle continues the forearm); the far hand is open, back up, pressing
  on the slab. Head: skull 0.44 head along the spine's own tangent, as on the reviewed Bearer.
- Stoker 1: flat back; skull 0.56 head along the spine tangent tipped 0.32 up (pushed forward under a low ceiling), on a
  short neck from the shell's front. 3: both fists through B.grip on the hook, forearms 20 and 32 deg off square.
- Pilgrim 3: near fist on the crutch's peg (a horizontal hand-peg, so the forearm meets it square; a hand on the bare
  shaft would run along it). Far hand: back of the hand, fingertips on the ampulla.
- Priest 3: aspergillum held inline like a short rod; bucket held by its bail with the forearm square to it.
- Countess: hand-bell grip with the handle vertical in the fist, bell hanging below; bearers' fists on the poles, forearms
  coming down onto the horizontal poles square.
- Plumb: votives, bandage end, rag knots, cap ties, collar bells, keys, tokens, flasks, chains, the lead, gloves and the
  Physic's sand-glass all hang in screen space.

What failed and how it was fixed:
- Great Copper 3 (final audit): two stokers' rakes and the shovel were 32 to 44 deg past the limit (forearms ran along the
  hafts; the warning was silenced with `quiet`). Elbows moved so the forearms drop onto the hafts square; `quiet` removed.
- Best Families 3 (final audit): the fan hand's forearm ran along the stalk (39 past) and the cup hand was 21 past. The
  fan stalk now leaves the fist square to the forearm and leans over the heap; the cup arm's elbow moved to the side.
- Pilgrim 3: 56 deg off square on the peg; elbow raised onto the crutch shaft. 4/5: the lame leg first hung behind the good
  leg and could not be read, then read as a lump; it is now bent back and up behind her with the swollen calf sagging
  under it, the good leg angled toward the crutch so the base of support (foot and crutch ferrule) is under her. The
  trailing bandage first read as a peg leg standing on the floor; it now hangs slack from the ankle in a frayed ribbon.
- Priest 3: the bail grip was 86 deg off (thumb set as for a vertical object); the bail is horizontal at the fist. 5: the
  kilt was drawn before the forward leg, so the thigh showed over it; reordered.
- Stoker 1/4: first build was a half-crouch with the hips above the knees (a bow, not a crouch) and blobby legs; rebuilt as
  a deep squat, hips low behind the heels, the back flat, legs in `bentLeg`.
- Countess 4: bearers first stood upright under the load; now bent at the knee and leaning into it, the back bearer
  deeper than the front one.
- Mule 4/5: the first legs were straight stilts under a level body; front legs now angled back under the chest and hind
  legs driving, the head low. The sweep-beam first stood up like a plank; it now drags behind and runs out of frame.
  "One hind shoe missing": the other three hooves are shod.
- Lapdog 5: the broken lead was on the neck bone and lifted off the floor in the bite pose; moved to the body.
- Strigil-Master 3: first build had the strigil arm raised over his head and the blade arcing back across his face; the
  fist is now raised in front of him at chin height and the blade arcs up and forward away from the face.

## Gate 2: style and detail

Columns: signature at 190 px (`sil.png`); course marks, fire dominant (boiled pink-white and red skin, peeling sheets,
blisters, split glowing seams) and water second (swelling, pruning, wet sheen, steam), Never items absent (no cartoon
flames on heads, no fish faces); section 9 (former self readable, one course mark pushed hard, outline broken the
course's way, structured hair and sinew); secondary details (ruler 12, elite 10, cast 6); layers; palette; silhouette
unique among the 19.

| Figure | Signature 190 px | Marks / Never | Section 9 | Details | Layers | Palette | Unique |
|---|---|---|---|---|---|---|---|
| Best Families | pass (mound bristling with arms, patriarch and cup on top) | pass | pass: nobles (sheets, pearls, rings); fused flesh pushed; peeling outline | 24 | pass | pass | pass |
| Great Copper | pass (bulging boiler over the open door) | pass | pass: stokers, ladder attendant; the plates' swell and split seams; weeping scale | 26 | pass | pass | pass |
| Strigil-Master | pass (raised sickle strigil, hanging gloves) | pass | pass: masseur's apron, belt, sponge; the skin-gloves pushed | 19 | pass | pass | pass |
| Invalid Countess | pass (box on two poles between two bearers) | pass | pass: litter, livery; bearers' hands cooked onto the poles | 22 | pass | pass | pass |
| Hypocaust Stoker | fixed | pass | pass: hook, cap, rag mask; the cooked back shell pushed | 14 | pass | pass | pass |
| Votive Pilgrim | fixed | pass | pass: crutch, votives, badge; the boiled leg pushed | 16 | pass | pass | pass |
| Physic of the Waters | pass (flask raised high) | pass | pass: gown, spectacles, kit; swollen lips and lids | 15 | pass | pass | pass |
| Lustral Priest | pass (flung arm with aspergillum, bucket) | pass | pass: stole, tablet; the sprinkling arm cooked red | 12 | pass | pass (gold on aspergillum and stole only) | pass |
| Lapdog | fixed | pass | pass: collar, bow, coat; the swollen hairless body | 11 | pass | pass | pass |
| Hypocaust Roaches | fixed | pass | pass: lion grate, lost things; the boiled shells | 11 | pass | pass | pass |
| Pump Mule | fixed | pass | pass: collar, traces, beam; the peeled flanks under the traces | 14 | pass | pass | pass |

Fixes in gate 2 (each re-rendered and re-checked):
- Stoker: legs were even tubes with a heavy cel band; now `bentLeg` (anatomical outline) with legDetail-like knee and
  calf marks, maxShade capped. Cap and neck flap read as headphones; flap moved behind and narrowed, rag mask lightened.
- Pilgrim: brown wool everywhere (no bible colour); now undyed oatmeal wool with damp, stains and a tide line.
- Lapdog: read as a pig with a saddle: long boxy body, rectangular coat, stacked leg segments, long snout. Body rounded
  and shortened, coat follows the body with creases and silver-thread edging, leg tops faded into the body, a flat pug face
  with a nose roll, a peeled lip, the missing tooth.
- Roaches: the mound was a smooth cone with bugs printed on it; its fill now sits inside a fringe of roaches that break the
  outline. In silhouette the upright grate on a floor slab read as a box: the floor slab removed, the grate tipped further.
- Mule: legs were stick-thin stacked tubes with ball joints; each lower leg is now one mchain outline, water-swollen
  (1.6x), the shoulder and haunch masses faded into the body instead of ending in an edge.
- Strigil-Master: blade first drawn as a thin line; now a broad sickle blade with rolled curls of skin; skin gloves were
  clean white cartoon gloves, now translucent, mottled, crumpled, with ragged cuffs; raw hands given muscle grain and
  wet sheen.
- Great Copper: the firebox was smoothed into a pillow (unsharpened corners); leaks read as white mushrooms; blistered
  metal read as polka dots; stokers read as dough balls. Sharp brick faces; leaks are ragged lime-scale cakes on a split;
  fewer, shaded blisters; stokers have collarbones, chests, bellies, a far arm sunk into the wall.
- Best Families: first build was egg-shaped torsos with small heads stacked on a smooth pink slope (balls/eggs, flat
  area). Torsos rebuilt as human torsos (trapezius, deltoid, armpit, chest, sagging belly); each noble drapes an arm over
  a neighbour (patting); the back of the heap is anatomy (backs with spine furrows, a pair of buttocks, a knee, a foot in a
  bath clog) instead of a slope; bath sheets lie along the shoulders with fringes and badges.

Palette: pink-white, steam white, boiled red, plus ink, bone, grey and the bible's materials (copper, bronze, lead, iron,
oak, linen, leather, clay, wax, marble, soaked wine velvet for the nobles). Gold only on the Lustral Priest's
aspergillum and stole. Nobles wear pearls and silver (Best Families, Countess, Lapdog's bell and disc). The wine in the
Best Families' silver cup is a dark wine-purple, not red.

## Rig and pose tests

| Figure | Bones | Attack pose (Motion line) | Result |
|---|---|---|---|
| Best Families | 13 (heap, patriarch, front, arm_1..9, towel) | surge: front -4, arms 1..3 reach, cup arm, patriarch | pass |
| Great Copper | 12 (firebox, boiler, valve, door, stoker_1..4 at the working shoulder, steam_1..3, attendant) | valve 14, steam, door, stokers rake out | pass |
| Strigil-Master | 22 (humanoid + strigil, glove_n, glove_f, apron, flask, towel, token) | raking scrape: upperarm_n -30, forearm_n -50 | pass; the gloves must be keyed to stay plumb |
| Invalid Countess | 38 (litter, countess, c_ arm, bell, basket, two full bearer sets fb_/bb_) | ram: litter -5, bearers lean, bottle arm | pass; bearers' fists need IK onto the poles |
| Hypocaust Stoker | 19 (humanoid + hook, ashpan, apron, flap) | hooked pull: arms back, hook +26 to stay low | pass; far hand needs IK onto the hook |
| Votive Pilgrim | 20 (humanoid + crutch, votives, cloak, skirt, bandage) | crutch swing, votives counter-rotated plumb | pass |
| Physic | 19 (humanoid + flask, gown, skirt, kit) | fling: upperarm_f -60, forearm_f -50 | pass; steam rotates with the flask (move to FX) |
| Lustral Priest | 20 (humanoid + aspergillum, bucket, stole, skirt, tablet) | sweep: upperarm_n -38, forearm_n -24 | pass |
| Lapdog | 20 (body, neck, head, jaw, ears, tail, lead, 4 x 3 legs) | bite: neck -20, jaw -18 | pass |
| Hypocaust Roaches | 8 (heap, grate, crest, spill_1/2, runner_1..3) | flood: spill 12/14, crest 10, grate -8 | pass |
| Pump Mule | 21 (spine_1/2, neck, head, jaw, ears, tail, collar, beam, 4 x 3 legs) | double kick: hind legs back, beam 8 | pass |

No export reported `MISSING JOINTS`; every rig.json carries ground = h - 30.

## Still open
- Canvas: the Invalid Countess's "2.5 long" is drawn about 2.25 (slightly foreshortened) to fit the elite canvas from
  kit.TIERS. The Pump Mule's highest point (the hames) stands about 1.25; the bible's 1.4 would not fit a mule that leans
  head-down into its collar in the large canvas; its beam runs out of the frame's edge, so the splintered far end is off
  frame.
- Best Families: the nobles' torsos are still large soft masses with a lot of pale skin; heads read small against them at
  sheet size; the dangling arms are long soft tubes. It reads as a heap of distinct bodies, but it is the figure that
  would gain most from another pass (it is still below the Drowned King's finish).
- Great Copper: the stoker below the door is mostly hidden by the open door (only his fist and shovel show).
- Lapdog: the round coated body still has something porcine about it at sheet size.
- Strigil-Master: the raw fists use the shared `B.fist` and read a little like big red gloves at full size.
- Votive Pilgrim: the lame leg behind her is busy (peel sheets, blisters, bandage turns) at full size; it reads as a big
  pale leg at game size.
- Steam is drawn in figure layers and rotates with its bones in poses (Physic's flask, the Copper's valve): move to an FX
  layer in animation, as noted in the first batch.
- IK holds: Hypocaust Stoker (far hand on the hook), Invalid Countess (all four bearer fists on the poles; the litter is
  the root of the motion), Strigil-Master's gloves should stay plumb (counter-rotate glove_n / glove_f).

## Independent review (2026-11-23)

Reviewer did not build these figures. Read GUIDE (2, 8, 9), LOGIC_CHECKLIST, the design language, the world bible,
REVIEW.md, the first batch's review and the maker's gates above; compared against the Simmering Matron and Boiled Brute
(`world_III.js`), the Drowned King (`world_I_a.js`), the Magma Hound and Plague Wolf, and dirAC/dirAC2. Every figure was
rendered alone, composited on a mid-dark ground, checked at 0.45x to 1.6x on heads, hands, held objects and feet and at
sheet size; all 11 rigs re-exported (no `MISSING JOINTS`, `rig.json` ground = canvas h - 30 on every one, including the
widened canvases: mule 2000 x 1100 / 1070, countess 1700 x 1400 / 1370) and all 11 attack poses re-run into
`out/worlds/III_b/<key>_pose.png` and looked at. Sheets, sheet19 and sil rebuilt in the same layout (script copied to
`/tmp/claude-0/-home-claude/b481cb9f-fd90-5adc-8daf-8b9ac366d903/scratchpad/rvIIIb/sheets.py`). "Fixed" = failed on the
maker's build, changed, and passes on the re-render.

### New helpers in `kit_III_b.js`
- `knuckleFist` / `gripK`: a modelled fist in B.fist's frame (knuckle heads and valleys, tendons fanning to the wrist,
  finger segments with the middle knuckle's crease, the tip and nail tucked under, the thumb over the index), angle from
  `B.gripAngle`. `o.raw`: a flayed hand (wet red muscle and grain, pale glossy tendons and knuckle caps, nail beds, clotted
  grooves, the ragged rim of skin at the wrist). Every `B.grip` in this batch now draws through `gripK` (the shared
  B.fist read as a glove block on the Strigil-Master, and the same block was on every other fist in the batch).
- `rawHand`: an open flayed hand (handBack in raw red with tendons, knuckle caps, nail beds, grain).
- `fleshArm`: one mchain outline shoulder to wrist with a build: `fat` (hanging lobe under the upper arm with its fold,
  stretch marks, dimpled elbow, wrist rolls), `gaunt` (bony elbow point and its wrinkles, slack skin, tendon groove, vein,
  wrist bone), `soft`; soft light and shade clipped to it, the elbow crease blistered; `deltoid` caps the root, `occ` lays
  an occlusion halo so it stands off what is behind.
- `bfTorso`: a noble's torso on a B.spine (`fat`, `gaunt`, `soft`) with hanging lobes (breasts, belly rolls, the apron of
  fat, the pouch) lit on top with their own cast shadow under an inked crease, collarbones, ribs, navel, flank folds.
- `bfHead`: five characterised boiled faces (patriarch, dowager, heir, matron, snorer), face shade 0.78 through `face`.
- `bathSheet` (a draped wet sheet along a shoulder line with folds, fringe and badge), `occlude`, `fuse` (flesh run
  together), `peel` (kit_III's peelSheet with a short wide bed: the tall pointed bed over a narrow sheet read as a candle).

### Gate 1: logic audit (re-checked)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact/plumb | 6 Facing/light |
|---|---|---|---|---|---|---|
| Best Families | fixed: heads were small balls on stalks; each head now sits on a neck of its build (bull neck with nape rolls, stringy neck with cords, soft neck) | fixed: the patriarch's cup was drawn upside down (rim toward the fist) after the rebuild's first pass; frame corrected. Dowager's gaze: head axis -36 deg, eye to the patriarch's face -40 deg (4 apart) | pass: cup and fan through `gripK`, no warning; strigil inline; hands on tiles, rim and back are open backs of hands touching what they press | pass: mass low and forward, the heir's hands flat on the tiles, the dowager seated on the coping with her shins down its face | pass: sheets lie on and hang from shoulders; the token's cord round the neck; the lapdog collar round a wrist with its bell plumb | pass |
| Great Copper | pass | pass | fixed (style): fists now `gripK`; still no warning on the primary hands | pass | pass | pass |
| Strigil-Master | pass | pass | fixed: the raw fist was the shared B.fist (a red glove); now a flayed `gripK` fist, inline on the strigil, no warning; far hand an open flayed hand pressing | pass | pass: gloves hang plumb from the wrists | pass |
| Invalid Countess | pass | pass | pass (bell and bearer fists now `gripK`, no warning) | fixed: after the widening the box rode between the bearers only if the front bearer is set back; he stands at 1110 so the box (centre 560) is near the middle of the carry, the pole running on ahead of him as the ram | pass | pass |
| Hypocaust Stoker | pass | pass | pass (fists `gripK`, no warning) | pass | pass | pass |
| Votive Pilgrim | pass | pass | pass (peg fist `gripK`) | pass | pass | pass |
| Physic of the Waters | pass | pass (unchanged measurement) | pass (`gripK`) | pass | pass | pass |
| Lustral Priest | pass | n/a | pass (`gripK`, aspergillum inline, bail square) | pass | pass | pass |
| Lapdog | fixed: new head on the neck line; jaw on its hinge under the ear | n/a | n/a | pass: four paws planted, belly near the floor | pass: ears hang down whatever the lowered head does | pass |
| Hypocaust Roaches | n/a | n/a | n/a | pass | pass | pass |
| Pump Mule | fixed: the head now hangs from a neck thrust down into the collar, poll below the withers, jaw hinged under the jowl | n/a | n/a | fixed: forelegs set back under the chest, near hind driving back, the weight thrown into the collar; the traces run taut from the hame tugs through the back-band ring to the hook | fixed: harness now sits on the body (collar round the neck base, hames standing off it, back-band and girth round the barrel); the beam's splintered end lies on the floor inside the frame | pass |

### Gate 2: style and detail (re-checked)

| Figure | Item | Result | Fix |
|---|---|---|---|
| Best Families | read as a pile of pink cartoon blobs (smooth ovals, small round heads, even tube arms) | fixed | Rebuilt as people of distinct age and build at true size: the PATRIARCH (head 228 px; fat torso with sagging breasts, belly rolls and an apron of fat, a heavy fat arm with its hanging lobe raising a silver goblet; bald, grey fringe, jowls and double chin, mouth open in complaint with yellowed teeth, knotted brow, broken veins, peeling scalp, the grey bay wreath slipping over the ear, the VII token on his breast); the DOWAGER (182; gaunt: collarbones over hollows, ribs, slack breasts; long hooked face turned up to him mid-sentence, hollow cheeks, purse lines, a blistered lip, collapsed coiffure with bone and pearl-headed hairpins, three pearl strands sunk in a corded neck; gaunt arm with a bony elbow fanning him with the bare carved stalk and drooping quills; her legs over the coping, a clog still on one foot); the HEIR (186; soft young body, round dozing face, wet curls, slack lips with a drip, his arms hauling on the tiles, a lapdog collar on one wrist); a dozing MATRON with pearls and a fat arm patting the heir; an old lord SNORING at the back. Back of the heap in shadow with backs, buttocks, a knee and a clogged foot under a steam veil; occlusion halos and `fuse` seams where bodies meet. |
| | faces flat or cartoon | fixed | `bfHead`: face shade 0.78, swollen lids, bags, flush, peeling patches, blisters, sweat, per-character lines |
| | bath sheets read as shields or plates | fixed | `bathSheet`: draped over the shoulder and down the back, folds along the band, fringe, embroidered badge (heron, tower, fish) |
| | peel sheets read as candles | fixed | `peel`: short wide torn bed, wider sheets, fewer of them |
| | grit 12+ | pass (27) | wreath, token, goblet with wine run, rings on four hands, fan stalk and quills, strigil, lapdog collar and bell, towel boy's arm and towel, three sheets with badges, pearls (three strands, a collar, a hairpin head, an ear drop), hairpins, cushion, oil flask, two clogs, the coping slab, frieze, VII on the pool, steam, blisters, fused seams |
| Strigil-Master | smooth pink mannequin, red glove fists | fixed | masseur's build: `bfTorso` fat torso, the trapezius sloping into the neck, a deltoid capping the raised arm, the broad back he turns to us (shoulder blade ridge, spine furrow, lats, rolls over the belt, sheen), the gut hanging out over the belt in wrinkled rolls with the navel and steam; boiled red mottling on lower-contrast skin; flayed hands (`gripK` raw, `rawHand`) with knuckles, tendons, grain, clotted grooves and the torn skin rim at the wrist; the empty skin gloves still hang from the wrists |
| Pump Mule | pale stiff stick legs, boxy body, beam end off frame, 1.25 high | fixed | Rebuilt on a 2000 x 1100 canvas (large-tier scale): deep chest, tucked flank, dipped back, steep croup, haunch and shoulder masses, ribs; legs with forearm, flat-fronted knee, cannon with its flexor tendon, puffed fetlock, ergot, sloping pastern, small hooves (one hind unshod, the broken hobble); hock point and hamstring cord. Long bony head with long ears laid back along the neck, big jowl, flared nostril, lips peeled off long teeth, a raw-rimmed eye under the blinker. Scalded hide with ragged islands of the dun coat (shoulder, haunch, back, neck, lower legs), peeling along the trace sores, the brand. Harness on the body. Highest point (the hame) 894 px = 1.40; the splintered end of the beam lies on the floor in frame |
| Invalid Countess | litter about 2.25 long | fixed | canvas 1700 wide at the elite scale; poles 20 to 1624 = 1604 px = 2.5 |
| Lapdog | read porcine | fixed | a toy spaniel's head: domed skull, clear stop, short square muzzle, black nose, a dark wet eye in boiled brow wrinkles, long ears hanging with the last wet fur clumped at their ends, jaw dropped with canines and tongue, a front tooth missing; the coat cut back to a short jacket so the bare boiled hindquarters of a small dog show (haunch, hip point, thigh edge, tuck, wrinkles, peel); slimmer legs with their tops faded into the body |
| All fists in the batch | the shared B.fist read as a block | fixed | `gripK` everywhere |
| All | palette, Never items | pass | no new colours (silver and pearls for the nobles, bronze, the dun coat as remaining hair); no flames on heads, no fish faces |
| All | unique silhouettes (`sil.png`) | pass | the heap bristling with arms and the raised goblet; the mule now reads as a mule dragging a beam; the lapdog as a dog |

### Rig and pose tests (re-run, all 11)
Best Families now 15 bones (heap, patriarch, p_head, dowager, matron, front, towel, arm_1..4, arm_6..9; the arm on the rim
face was cut, it confused the dowager's legs): surge `front -4, arm_1 -16, arm_2 -14, arm_3 -14, arm_8 -12, p_head -6,
arm_4 16, arm_9 10`: pass. Strigil scrape `upperarm_n -30, forearm_n -50, torso 6, glove_n 80`: pass. Mule double kick
`leg_hn_1 -40, leg_hf_1 -34, leg_hn_2 22, leg_hf_2 18, spine_1 5, tail 20, beam -6`: pass (signs are in the posed, flipped
space; the first try with positive angles swung the hind legs forward under the belly). Countess ram, Lapdog bite, and the
six unchanged-body figures (Copper, Stoker, Pilgrim, Physic, Priest, Roaches) re-posed after the fist change: parts stay
attached.

### Still open after independent review
- Best Families: much nearer the bar but not at the Drowned King's finish: the big torsos are still smooth, lit masses
  carried by contour, lobes and soft shading more than by surface drawing; the heir's near arm is long and fairly even.
- Strigil-Master: at sheet size his near upper arm still reads as one big smooth form across the chest, and the gut is
  partly behind the far forearm and glove; the hands now read as raw meat, not gloves.
- Great Copper: the second hand on two rakes still passes `quiet: true` (its elbow is a midpoint, so the warning is
  meaningless; it needs IK in animation) — contrary to the maker's note that all `quiet` flags were removed.
- Lustral Priest's flung red arm and the Physic's raised arm are still thin even tubes (muscleArm at 36 to 42 px); the
  Votive Pilgrim's lame leg is busy at full size. Not in this brief; `fleshArm` could replace them.
- Mule: in the kick pose the beam overlaps the near hind leg (z-order key in animation). Countess bearers' fists need IK
  onto the poles (unchanged). Steam rotates with its bones (FX layer, unchanged).

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Strigil-Master | glove-like red hands | the raw hands are darker and mottled; the bright white tendon stripes that read as glove seams are muted to a pink and thinned (kit_III_b rawHand and the raw gripK); each hand gets clotted blood in the grooves, blanched dead patches, burst blisters with torn rims, a scrap of skin still stuck on and wet glints (local random stream) | improved; at sheet size the hands still read as bright red masses |
| Strigil-Master | smooth pink mass | deeper pink with more mottling, a soft form shadow under the belly and on the back turned from the light, a lit chest plane, sloughed patches of raw red under pale curled rims on the back | improved, not fully solved: the legs still carry the plain cel band |

Rig re-exported (22 bones). Sheet, sheet19 and sil rebuilt (`wIII_b/sheets.py`).
