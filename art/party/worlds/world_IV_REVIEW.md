# World IV, The Sulphur Pits: review

Figures: The Burning Lung (401), Powder Ogre (402), Miasma Matriarch (403), Gas-Lung Miner (404), Brimstone Toad (405),
Fuse Imp (406), Pit Crawler (407), Canary Priest (408). File `worlds/world_IV.js`, helpers in `worlds/kit_IV.js`.
All are built facing right with `kit.foeBase` (through `kit_IV.base`) and `flip: true`. Renders, silhouettes and pose
tests are in `out/worlds/IV/`; rigs are in `out/rig/worlds/world_IV_<key>/`.

Method: each figure was rendered, checked zoomed at 2x to 3x on a mid-dark ground, fixed and re-rendered. Every grip
was re-run with its warning on (none print now). "Fixed" means the item failed on an earlier render, was changed, and
passes on the current one.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: segments follow one spine, jaws on hinges); 2 objects face their user
and gaze; 3 grips; 4 weight and balance (non-humanoids: legs carry the weight); 5 contact and attachment, plumb hang;
6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Burning Lung | pass | n/a | n/a | pass | pass | pass |
| Powder Ogre | pass | pass | fixed | pass | fixed | pass |
| Miasma Matriarch | pass | n/a | n/a | pass | pass | pass |
| Gas-Lung Miner | pass | n/a | fixed | pass | fixed | pass |
| Brimstone Toad | pass | n/a | n/a | pass | pass | pass |
| Fuse Imp | pass | pass | pass | pass | pass | pass |
| Pit Crawler | pass | n/a | n/a | pass | pass | pass |
| Canary Priest | pass | pass | fixed | pass | pass | pass |

### Measurements behind the passes
- Miner 1: the hunch is the hump of the upper back; the skull centre sits 48 px ahead of and 46 px above the neck base,
  under one head width. 4: the near leg carries the weight under the chest; the far leg trails.
- Priest 2: the cage hangs plumb from the far fist at eye height; his eye line to the cage centre is 16 degrees below
  horizontal against a head tilted 7 degrees up, so 23 degrees apart (under 25). The psalter is closed, spine to the viewer.
- Imp 2/5: the torch shaft passes 86 px in front of the face at face height, so it never crosses it. Both fists wrap the
  same shaft, spaced 86 px apart, each 25 to 32 degrees off square. 4: weight on the near toes under the hips; the far
  foot is kicked up mid-hop, and the imp leans back against the torch's forward weight.
- Ogre 4: his weight sits back on his heels under the belly (both feet flat, the pelvis behind the belly's centre).
- Matriarch 4: she floats, so there is nothing to carry; her body hangs plumb from the neck, feet 100 px off the floor.
- Toad, Lung 1: each jaw is its own bone pivoting at the mouth's back corner; the pose tests open them on that hinge.
- Crawler 1: one spline spine, tergites drawn tail to head, each overlapping the one behind; the head continues the spine
  and bends forward. 4: every ground leg ends on the ground line; the reared third is carried by the rearing base.

### What failed and how it was fixed
- Miner 3: the first pick grip was 51 degrees off square (the forearm ran along the haft). The arm now hangs plumb from
  the stooped shoulder and the haft leaves the fist at 25 degrees below horizontal: 22 degrees off square, thumb toward
  the head. 5: the far arm first poked out in front of the chest as a stray forearm; it is now hidden behind the chest
  and only its hand shows, spread over the front of the ribs, with the `hand_f` pivot at that wrist.
- Priest 3: the raised near arm would have crossed his jaw. The arms were swapped: the far arm raises the cage and passes
  behind the head; the near hand holds the psalter at the belly.
- Ogre 3: the powder fist first used a pole grip on a handful of powder (65 degrees off); it is now an in-line fist that
  follows the forearm, which is what a closed handful does. 5: the keg first sat inside the arm's outline like a belt
  pouch and the powder stream read as a sword hanging from it. The keg is now clamped high under the arm, protruding
  well behind the elbow and in front of it, the near hand cupping its belly, and the spill is falling clumps and a haze.

## Gate 2: style and detail

Columns: signature reads at 190 px (`sil.png`); course marks (fire dominant, toxin second) with the Never items absent
(no cartoon flames on heads, no slime puddles, no neon green); secondary details (needed); three layers, asymmetry, wear,
mud; palette (sulphur yellow, ochre smoke, lamp orange, plus ink, bone, grey and the shared materials); unique silhouette.

| Figure | Signature at 190 px | Course marks, Never absent | Details (needed) | Layers/asym/wear/mud | Palette | Unique |
|---|---|---|---|---|---|---|
| Burning Lung | pass (glowing sac reads in colour; in silhouette as the lobe under the jaw) | fixed | 20 (12) | pass | pass | pass |
| Powder Ogre | fixed | pass | 18 (10) | pass | pass | pass |
| Miasma Matriarch | fixed | pass | 17 (10) | pass | pass | pass |
| Gas-Lung Miner | fixed | pass | 15 (6) | pass | pass | pass |
| Brimstone Toad | pass | fixed | 11 (6) | pass | pass | pass |
| Fuse Imp | pass | fixed | 11 (6) | pass | pass | pass |
| Pit Crawler | pass | pass | 10 (6) | pass | pass | pass |
| Canary Priest | pass | pass | 16 (6) | pass | pass | pass |

### Detail inventories
- Lung: The Tooth set like a third eye in swollen split lids; small bulging eye with crusted lid; poison gland; crystal
  druses along the back; sulphur crust sheets and plates; glowing seam networks on flank, head, haunch and arm; three
  pit props (one iron-strapped, splintered ends, checks); two bent cart rails, one with a spiked sleeper; ribs and veins
  through the sac; flame leaking from the mouth corner; ochre smoke; ash; blisters; brimstone beads; warts; webbed toes.
  Layers: hide, crust, crystals, embedded timber and iron.
- Ogre: split keg (staves, two hoops, a burst hoop sprung loose, chalked mark, scorch); powder heap, spill and haze; lit
  fuse cord knotted on the wrist; powder handful; singed scalp with burnt stubble and a glowing crack; burnt eyebrow
  stubs; grin with a missing tooth, powder smear and crumbs; knife scar with stitch ticks; powder-burn starburst;
  stretch marks; navel; belly seams and blisters; burn scars; breeches patch and burn hole; belt with iron buckle;
  powder horn; tin scoop; ankle rags. Layers: skin, breeches, belt and gear, keg.
- Matriarch: tiny hat with ribbon, broken plume and hatpin; bun; hair drawn back over the swollen skull; stretched ear
  with a pearl drop; slit eyes, flattened nose, pinhole mouth with strain creases; veins; gas swirls inside; glowing
  hairline splits; blisters; lace collar torn; cameo brooch; buttons; puffed sleeve; chatelaine with keys and scissors;
  half-off kid glove and ring; darned skirt with mould bloom; charred, glowing lace flounce; one shoe lost, a torn
  stocking; two young. Layers: skin, bodice and skirt, lace, chatelaine.
- Miner: cap lamp with wick and soot thread; candle stub in the band; stitched leather cap; kerchief knot; torn shirt with
  popped buttons and one hanging; shirt patch and burn hole; brass tally token; snuff pouch; belt; thigh patch; yorks
  (string ties) below the knees; hobnails; pick with grip wrap, nicks, wedge, rust and a chipped point; chest seams,
  blisters, gas. Layers: skin, shirt, trousers, belt.
- Toad: crust plates with glowing seams; crystal druses; loose flank plates; ripe gland; crusted lid; warts; blisters;
  brimstone beads and runs; mouth with burning slime; grit underfoot. Layers: hide, crust, crystals.
- Imp: lit torch (wire bindings, pitch drips, charred shaft, cord wrap); ember cracks; fuse tail with spark; stolen tally
  token; singed loincloth; rope belt; leaking powder pouch; horn nubs; claws and spurs; crust on fists and feet; blisters.
  Layers: hide, loincloth, belt and pouch, torch.
- Crawler: 22 tergites with growth lines, lit ridges and charred front edges; sulphur staining and crust in the sutures;
  glowing splits; a broken plate with an old pick wound; flakes; blisters; ocelli; dripping poison claws; trailing legs.
  Layers: tergite, pleural membrane, sternite.
- Priest: brass cage (dome, ring, bars, door and wire latch, seed cup, perch, soot); dead canary on its back; chain;
  feathers at cuffs and collar; throat seam and blisters; tonsure; crust in the fringe; stole with crosses and fringe;
  rope cincture with knot; psalter with clasp and rubric ribbon; darn and burn hole; charred glowing hem; jerkin collar
  and buckle. Layers: jerkin, surplice, stole, cincture.

### Course marks and Never items
Fire on every figure: glowing split seams with charred lips, charred edges, ash and flakes. Toxin on every figure:
ripening blisters, sulphur crust and crystals, gas (the miner's chest, the Matriarch's head and mouth, the Lung's
sac). Fixed: the toad's first crystals read as a fence of candles and its crust as a saddle with a sawtooth edge; they
are now irregular druses and plates. The imp's first flame was a flat-bottomed crown; it is now layered ragged tongues
round the rag head. The Lung's first corner flames were two upright candle flames on its head (a Never item); they are
now low tongues spilling from the mouth's gap and licking back along the jaw in smoke. No slime puddles; no green.

### Palette
Sulphur yellow, ochre and lamp orange carry every figure, with soot, bone and grey. Shared materials: leather, oak,
iron, brass (the bible names it for the cage; also tokens and the chatelaine). Red appears only as the priest's psalter
rubric ribbon; the coughing mouths were browned to avoid red. No gold.

### Style fixes made along the way
- Miner: the spine helper first put the mass behind him (a sack on the back); the torso was redrawn by hand with a
  hump-to-waist back contour and a ribcage flared over a narrower belly. Ribs first read as barrel hoops; they are now
  raised bands clipped to the chest, with grooves, sheen and hatching. Blisters first read as brass buttons.
- Imp: first build was a black blob with tube limbs and knob joints and a helmet-like head. Rebuilt with tapered,
  muscle-bellied limbs, a real skull (brow, hooked nose, socket, needle grin), flame-shaped ears, lifted values.
- Ogre: keg rebuilt three times (see logic); arms given biceps, triceps, forearm swell and veins; the deltoid ball removed;
  breeches made ragged at the knee instead of boxes; skin darkened and the back modelled.
- Matriarch: the first head was a plain melon with scattered marks. It now has a skull outline with a flat face plane,
  large stretched features, an ear at the jaw hinge and a hair mass drawn back to the bun under the hat.
- Crawler: first read as a banded tube; thickened, each tergite domed, suture staining thinned, head flattened forward.

### No two foes share a silhouette (`out/worlds/IV/sil.png`)
Lung: a wall of hide cropped by the frame with a lobe under the jaw. Ogre: a round belly on short legs, small head, a
keg sticking out behind. Matriarch: a huge round head floating over a tiny hanging dress, two small copies behind.
Crawler: the only long low shape, reared at the front with a fringe of hooked legs and antennae. Miner: a stooped man
with a T of a pick in front. Priest: an upright robed man with a cage held up at the front. Toad: a squat lump with a
jagged crystal ridge. Imp: a tiny crouched figure under a tall torch. The two toads differ in scale (4 against 0.55),
signature (sac against crystal ridge) and frame (cropped wall against whole squat body).

## Rig and pose tests

| Figure | Bones | Layers | Pose test (`out/worlds/IV/<key>_pose.png`) | Result |
|---|---|---|---|---|
| Burning Lung | 10 (body, head, jaw, sac, eye, arm_n_1..3, arm_f, haunch) | 16 | breath: head lifts 10, jaw drops 14 on its hinge, sac swings | holds |
| Powder Ogre | 18 (humanoid + keg, belly, fuse) | 26 | belch: torso forward, head thrown up, far arm drops | holds |
| Miasma Matriarch | 16 (float, head, torso, arms, skirt, shins, feet, young_1, young_2) | 16 | exhale: head dips forward, the body trails back | holds |
| Gas-Lung Miner | 16 (humanoid + pick) | 29 | pick windup overhead, and a forward swing | holds |
| Brimstone Toad | 16 (body, head, jaw, throat, four 3-bone legs) | 23 | spit: head up, jaw open on its hinge | holds |
| Fuse Imp | 21 (humanoid + ear_n, ear_f, tail_1..3, torch) | 24 | throw release (spear-style thrust) and a windup | holds |
| Pit Crawler | 34 (body, seg_f1..3, seg_b1..3, head, fang_n/f, antenna_n/f, leg_1..22) | 75 | strike: front segments lunge, fangs close | holds |
| Canary Priest | 19 (humanoid + cage, book, skirt, stole) | 33 | hymn: cage swung up and out, head back | holds |

No export reported `MISSING JOINTS`. No joint opened in any test.

## Still open
- Two-handed holds need IK in engine: the imp's far fist on the torch (the torch is on the near hand), and the miner and
  priest have none. The imp's throw lets the far hand go, which is correct for a throw.
- The Lung's sac breathing and the Matriarch's swelling need bone scaling (Godot can scale; `posetest.py` only rotates),
  and the gas and breath clouds should be VFX layers.
- The Matriarch's head is close to a round balloon by design (the bible's "swollen like a balloon"); the nose, brow notch
  and chin bulge break the outline, but the guide's fault list warns about round masses, so an art director should
  confirm it. Her hair strands fan rather stiffly.
- The Lung's near foreleg and the imp's limbs are the weakest anatomy in the set: they read as muscled at game size but
  still partly as tapered tubes at full size. The Lung's sac ribs read a little like a paper lantern.
- The Ogre's standing height is 2.3; the hunch brings his crown to the top of the elite canvas. The Pit Crawler's 1.8
  length is met along its curved spine, not as straight-line width, to fit the 900 px canvas.
- `render_rig.js` writes `ground: 790` into every rig.json; these canvases use 1570 (ruler), 1370 (elite), 1070 (large).

## Independent review (2026-11-23)

Reviewer: a second agent, judging the maker's work fresh against GUIDE.md (section 8 especially), LOGIC_CHECKLIST.md,
the design language and the World IV bible, with the World I and II reviewed figures and dirAC/dirAC2 as the bar. Every
figure was rendered alone, composited on a mid-dark ground and checked at 2x to 3x on heads, hands, held objects and
feet. "Fail, fixed" means the item failed on the maker's render, was changed, and passes on the current render; every
fixed figure had its rig re-exported (no `MISSING JOINTS`) and its attack pose re-run and looked at.

### Gate 1: logic audit (independent)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| Burning Lung | pass | n/a | n/a | fail, fixed | pass | pass | 4: the sac hung clear of the floor like a lantern on a hook; it now rests on the floor, its lower curve flattened and spreading, with a contact shadow. The near foreleg's hand is flat on the floor under the shoulder. |
| Powder Ogre | pass | pass | pass | fail, fixed | fail, fixed | pass | 4: the belly stopped above the belt, so it did not hang; it now sags over the belt and casts its shadow on the breeches. 5: the belly shadow spilled past the breeches into the air; clipped to them. |
| Miasma Matriarch | fail, fixed | n/a | n/a | pass | fail, fixed | pass | 1: the head sat on the neck as a ball balanced on a stick; the head now gathers into the neck in a knot with strain folds, and its mass sags down round it. 5: young_1 hung behind her head with its face hidden; both young moved into her wake, clear of her. Her hands hang open, the feet hang pointed as a limp body's do. |
| Gas-Lung Miner | pass | n/a | pass | pass | pass | pass | The maker's measurements (skull 48 px ahead of the neck base, pick fist 22 degrees off square) agree with the render by eye. |
| Brimstone Toad | pass | n/a | n/a | pass | pass | pass | Jaw opens on its hinge in the pose test. |
| Fuse Imp | pass | pass | pass | pass | pass | pass | Torch shaft clear of the face; two fists on one shaft (far hold needs IK, see open). |
| Pit Crawler | pass | n/a | n/a | fail, fixed | pass | pass | 4: the body lay on the floor with stick legs fanned under it, so nothing carried it; it now stands raised on its legs, every floor leg arched with its claw planted, the far knees rising above the back, the reared third clearly off the floor with its legs lifted. |
| Canary Priest | pass | pass | pass | pass | pass | pass | Cage hangs plumb from the far fist at eye height; raised arm passes behind the head. |

### Gate 2: style and detail (independent)

| Figure | Section 8 faults | Signature at 190 px | Course marks, Never absent | Details, approx. count (needed) | Layers/asym/wear/mud | Palette | Unique silhouette | Fix |
|---|---|---|---|---|---|---|---|---|
| Burning Lung | fail, fixed | pass | pass | 24 (12) | pass | pass | pass | Body was a flat brown field with scattered round spots: now a mass that turns (lit back, core shadow low on the flank, a shoulder lobe bulging over the foreleg, folds of hide along the dorsolateral ridge, round the shoulder and sagging over the haunch, cross-contour hatching), warts crowded along the ridge and thinning down the flank. Sac read as a paper lantern: now a pear-shaped stretched membrane, veined in branching trunks and capillaries, its ribs soft, uneven and at different slopes (one forked, two short), gathered creases under the jaw, compression folds where it spreads on the floor. Eye read as goggles beside the Tooth: now a toad's eye (dome, golden iris with a horizontal pupil, a heavy lid down over its top third, a lower lid fold) under a heavy brow crest; the Tooth is a stone shard jutting from the forehead in a swollen collar. Crystal fence: now irregular clusters of different sizes and tilts with strays. Near foreleg read as tapered tubes: rebuilt with a triceps mass, loose skin folded across it, an elbow pushed out, a forearm thick under the elbow narrowing to a folded wrist, a flat palm and knuckled fingers with padded tips. |
| Powder Ogre | fail, fixed | pass | pass | 22 (10) | pass | pass | pass | Slab limbs and boxy torso: arms now have a rounded shoulder, a lit biceps, triceps turning away, fat hanging under the arm, an elbow knob and crease, a forearm swell tapering to the wrist; the limb shadow is a form crescent, not a near-black band (which read as leather cuffs). Legs: heavy thighs under the breeches (quad and hamstring mass, leather folds, burnt hem above the knee), a bare fat knee with a kneecap and the crease behind, a calf that swells high and narrows to the ankle, a rag wound round the ankle instead of a box cuff. Back now humps high, curves in at the lumbar and out at the buttock; the belly hangs over the belt with a fold of fat above its underside and the navel dragged down. |
| Miasma Matriarch | fail, fixed | pass | pass | 20 (10) | pass | pass | pass | Head was a near-perfect sphere with a face painted on: rebuilt as skin stretched by pressure: lopsided, the back of the skull sagged into a hanging lobe over the nape (the heaviest side), the cheek dropped into a jowl, everything drooping into the knot of the neck; each lobe is an inkless pouch with a tapered fold, the overhang's shadow and a lit lip; a core shadow on the heavy lower half, a lit, translucent crown; stretch marks raked across crown, temple, lobes and jowl; the scalp pulled thin so the drawn-back hair is a sparse veil of uneven strands with follicles showing; features dragged apart (near eye slit pulled long and down toward the ear with creases trailing from its corner, far eye high and small, the nose pressed flat into a smear with slit nostrils, the mouth a small puckered hole dragged low over the jowl, the ear pulled down, its lobe stretched by the pearl). The young are the same construction at their own tilt, with little limp bodies in christening gowns (arms, legs, feet). Her body was a doll: now sloped shoulders, a boned bodice with bust and corseted waist, leg-o'-mutton sleeves over forearms with a muscle belly and narrow wrist, calves and pointed hanging feet below a shortened skirt. |
| Gas-Lung Miner | fail, fixed | pass | pass | 15 (6) | pass | pass | pass | The bowed ribs were high-contrast alternating bands that read as a striped shirt; their grooves and shading softened so they read as ribs under stretched skin. |
| Brimstone Toad | fail, fixed | pass | pass | 11 (6) | pass | pass | pass | Both forelegs were capsule pairs (tube fault): now a shoulder mass, an elbow, a forearm swell narrowing to the wrist, folds at elbow and wrist. |
| Fuse Imp | fail, fixed | pass | pass | 11 (6) | pass | pass | pass | Limbs were a chain of round-capped capsules (tube and knob): each limb is now one continuous sinewy outline, muscle belly high, thin at the joint, a second belly below, narrow wrist or ankle, a bony elbow point or knee knob on the outside of the bend, a tendon and a crease inside the bend; split at the joint for the rig. |
| Pit Crawler | fail, fixed | pass | pass | 16 (6) | pass | pass | pass | Read as a banded tube with stick legs: rebuilt as a centipede: 21 flattened tergite plates, each a broad top band (paramedian sutures, a raised darker posterior margin that overlaps the plate behind, a worn-bright near margin) with a thick rim edge below it and wrinkled pleural membrane under that, the body wider than tall; legs thick at the base and jointed (coxa socket, coxa/prefemur, femur arching up and out, tibia down, tarsus and pick-point claw planted), front legs angled forward and rear legs back, far knees showing above the back; big forcipules (thick trochanteroprefemur with an inner tooth, femur, tibia, a long black fang with a venom pore) under a flat cephalic plate with rim, sutures and ocelli; antennae of 22 beaded segments. The last trunk leg pair is tucked under the forcipules so they read. |
| Canary Priest | pass | pass | pass | 16 (6) | pass | pass | pass | None. |

Course marks re-checked on every changed figure: glowing split seams with charred lips and ash (fire), blisters, crust,
crystals, gas and veins (toxin); no flames on heads, no slime puddles, no green. Red stays off the cast (the Lung's sac
veins are brown-maroon blood vessels; the toad's mouth is the maker's pink interior).

### Rig and pose re-checks (independent)

| Figure | Bones | Layers | Pose test (`out/worlds/IV/<key>_pose.png`) | Result |
|---|---|---|---|---|
| Burning Lung | 10 | 16 | breath: head -8, jaw 16 on its hinge, sac -5 | holds; the jaw gap opens, no tear |
| Powder Ogre | 18 | 31 | belch: torso 6, head -16, far arm 24/14, belly 3 | holds |
| Miasma Matriarch | 16 | 16 | exhale: head dips 10, body trails (torso -10, arms, skirt), young bob | holds |
| Gas-Lung Miner | 16 | 29 | pick windup: upper arm -120, forearm -40 | holds, arm clear of the face |
| Brimstone Toad | 16 | 24 | spit: head -12, jaw 18, throat 6 | holds |
| Fuse Imp | 21 | 26 | throw windup: both arms back, torso 8, tail and far leg | holds; the far fist leaves the shaft (two-hand hold, IK) |
| Pit Crawler | 32 | 70 | strike: seg_f1..3 lunge, head 10, fangs -20/-16, two legs rippled | holds, segments stay attached |
| Canary Priest | 19 | 33 | maker's hymn test, figure unchanged | not re-run |

Ground: every build is wrapped in a guard that throws unless `f.o.groundY === h - 30`; all eight rig.json files read
ground 1570 (ruler), 1370 (elite), 1070 (large) and 790 (human and small). The maker's open note that `render_rig.js`
writes 790 everywhere was stale: it reads the figure's groundY, which `kit_IV.base` already set to canvas height minus 30.

Sheets: `out/worlds/IV/sheet.png` and `sil.png` rebuilt in the same layout (true relative scale, one ground line, the
Drowned Thrall as human reference) with names under each figure instead of keys. Silhouettes stay distinct.

### Still open after the independent review
- The Burning Lung's warts are still small discrete bumps; they now sit inside the folds and the turning mass rather than on
  a flat field, but an art director may want fewer and larger glands.
- The Burning Lung's sac reads by colour, not by silhouette: at 190 px it is part of the cropped wall (as the maker noted).
- Two-handed holds need IK in engine (the imp's far fist on the torch). Sac breathing and the Matriarch's swelling need
  bone scaling in Godot; gas and breath clouds should be VFX layers.
- The Ogre's near hand cupping the keg is still a squarish block with sausage fingers; it reads at game size.

## Lore changes 2026-11-23

Eye-audit ruling (coordinator): the Brimstone Toad's art stays (the Tooth is drawn as a long pointed shard, not a round
stone). Only the bible line changed: bible/world_IV_sulphur_pits.md now reads "**The Tooth** is a long shard of pale
stone set in its brow, jutting from a collar of split hide" instead of "like a third eye of stone". No render, rig or
sheet change; both gates stand as reviewed.
