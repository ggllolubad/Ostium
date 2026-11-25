# World VI, The Stormwrack Coast: review

File: `worlds/world_VI.js`, helpers in `worlds/kit_VI.js`. Seeds 601 to 608 in bible order (whale 601, keeper 602,
matron 603, wrecker 604, eel 605, storm harpy 606, crab 607, bosun 608). All eight are foes: each is built facing right
with `kit.foeBase` light (via `kit_VI.base`, slate shadow tint, wet grey sand mud), then flipped.
Outputs: `out/worlds/world_VI_<key>.png` and `_sil.png`, rigs in `out/rig/worlds/world_VI_<key>/`, pose tests in
`out/worlds/VI/<key>_pose.png`, `out/worlds/VI/sheet.png` (true relative scale, the Drowned Thrall for scale) and
`out/worlds/VI/sil.png` (190 px per human).

Checked by tracing each body from the code and on renders composited on a mid-dark ground at 1x to 2.5x, at game size
(0.3x) and on the silhouette tile. "Fixed" means it failed on an earlier render and passes on the current one.

| Figure | Tier, canvas | Bones | Layers |
|---|---|---|---|
| The Thunder Whale | ruler 5, 1600 x 1600 | 6: water (root), body, jaw, fin, ropes, arcs | 9 |
| The Lighthouse Keeper | elite 2.0, 1100 x 1400 | 19: standard + pole, lantern, coat_skirt, cape | 24 |
| Harpy Matron | elite 2.0, 1100 x 1400 | 17: rock (root), body, head, hair, tail, wing_n_1..3, wing_f_1..3, thigh/leg/foot x2 | 31 |
| Shock Eel | large 1.6, 900 x 1100 | 15: water (root), seg_1..8, head, jaw, fin, tail_1..3 | 16 |
| Wrecker | human 1.0, 600 x 820 | 17: standard + lantern, cudgel | 24 |
| Storm Harpy | human 1.0, 600 x 820 | 16: body (root), head, hair, tail, wing_n_1..3, wing_f_1..3, thigh/leg/foot x2 | 32 |
| Tide Crab | small 0.6, 600 x 820 | 44: body (root), shell, eye_n, eye_f, claw_n_1..4, claw_f_1..4, 8 legs x 4 | 50 |
| Drowned Bosun | human 1.05, 600 x 820 | 18: standard + whistle, axe, coat_skirt | 28 |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Thunder Whale | pass (one axis from the sea to the snout) | pass | n/a | pass (breach from the water; body pivots at the waterline) | fixed | pass |
| Lighthouse Keeper | pass (skull 0.2 head ahead of the neck base, stoop from the upper back) | pass | pass | pass | pass | pass |
| Harpy Matron | pass | pass | pass (wrist claws flex one way) | pass (talons wrapped over the ledge) | pass | pass |
| Shock Eel | fixed | pass | n/a | pass | pass | pass |
| Wrecker | fixed | pass | pass | fixed | fixed | pass |
| Storm Harpy | pass | pass | pass | pass (in flight; no ground contact) | fixed | pass |
| Tide Crab | pass | pass | pass (both claws hinge on one axis) | pass (eight legs on the ground line) | fixed | pass |
| Drowned Bosun | pass | fixed | pass | pass | fixed | pass |

Every grip goes through `B.grip`. No render printed a `grip ... move the elbow` warning. Every rig exports with no
`MISSING JOINTS`.

### What failed and how it was fixed
- Thunder Whale 5: the lower teeth were drawn in screen space instead of the whale's frame, so a row of teeth floated in
  the sky. They are now built in the jaw frame and sit on the jaw. The weed hanging off the jaw sat off the jaw's lower
  edge. It now hangs from barnacle clumps on the jaw. When the jaw opened wider in the pose test, a gap opened behind
  the teeth. A throat flap now rides on the `jaw` bone and tucks under the head.
- Shock Eel 1: the head was a separate shape stuck onto the body, with a hard collar seam at the nape. The head is now
  the end of the body's own centre line (one ribbon that narrows into the snout). The jaw hinges far back under the
  skull and opens on that hinge in the pose test.
- Wrecker 1 and 4: in the first build he stood upright with his head over his hips, which is not the crouch the bible
  asks for. The spine now curves forward from the upper back (skull 0.38 head ahead of the neck base), the pelvis is
  dropped, the near knee is over the near foot and the far leg is braced back. His weight sits between his feet.
- Wrecker 5: the folded boot tops read as tyres round the shins. The boots are now plain knee boots, with the trousers
  bunched into their tops. The lantern's glow was drawn after the forearm and washed over the arm. The lantern is now
  drawn first. The glow got clipped in the exported layer, so a transparent frame now holds the filter region.
- Storm Harpy 5: the wing roots sat in the middle of the chest. They now attach at the shoulder blades behind the ruff.
- Tide Crab 5: the dark inside of the lantern housing bulged past its frame bars as two black lobes. That shape is now
  sharp-cornered, and the crab's back is clipped inside it. The crusher claw ran off the small canvas. The whole
  figure, joints included, is shifted 46 px (`kit_VI.shiftFig`).
- Drowned Bosun 2 and 5: the call floated in front of the lips, held by nothing. The fist now grips the gun on a line
  from the hand to the mouth, and the buoy and keel stick out of the little-finger side. The chain runs from the
  shackle over the chest to the collar. The wilted feather first stuck up behind the hat like a broom. It now leaves
  the cockade and hangs limp, split and dripping.

### Checks that passed
- Wrecker: the lantern hangs plumb on its bail from the fist (it has its own `lantern` bone so it can counter-swing).
  The nail cudgel's haft runs through the fist square to a forearm cocked over the far shoulder. The blade clears the
  head and does not cross the face. He watches the sea, not the lamp, so the head axis is not aimed at the lantern
  (a signal held out, not an object studied).
- Lighthouse Keeper: both hands are on one pole, spaced apart, with the knuckles toward each elbow. The iron-shod foot
  of the pole stands on the ground line. The lens-lantern hangs from the gallows hook on its ring.
- Drowned Bosun: the axe fist is square to its forearm, and the call is at the lips. One shoe is lost, so the near foot
  is bare and swollen.
- Ropes, kelp, drips and the whale's harpoon lines all hang plumb in screen space. The whale's ropes are on their own
  bone so they can be counter-rotated.

### Pose tests (attack from each Motion line), `out/worlds/VI/<key>_pose.png`
| Figure | Pose | Result |
|---|---|---|
| Thunder Whale | the song: body -4 (rise), jaw -12 (gape), fin 10, ropes 4 (counter) | pass: the jaw opens on its hinge, the throat flap closes the gape, the waterline holds |
| Lighthouse Keeper | the flash: torso -4, head -6, near arm -6/-4, pole -6, lantern 20, cape 3, skirt 2; far arm solved by IK onto the pole (1.3 px error) | pass: both hands stay on the pole, the lantern swings on its ring |
| Harpy Matron | diving talon strike: body -24, head 16, wings up and back, legs thrown forward 36 to 40, toes -20 to -24, tail -10 | pass: wings stay attached at the shoulder, the talons come forward. The dive off the rock also needs a translation key |
| Shock Eel | discharge: chain coils back 3 to 5 and forward -4 to -6, head 12, jaw -26, fin -12 | pass: the chain bends with no tears, the jaw drops on its hinge |
| Wrecker | cudgel blow: torso -10, far arm -80/-45, cudgel -10, near arm -25/-10, lantern 35 (counter-swing) | pass: the cudgel comes over and down, the lantern stays plumb-ish |
| Storm Harpy | raking swoop: body -14, head 10, legs 34 to 40, toes -20 to -24, wings 18 to 22, tail 14 | pass |
| Tide Crab | claw pinch: claw_n_1..3 +10/+12/+8, claw_n_4 -16 (the moving finger closes), eyes up | pass: the dactyl closes onto the fixed finger on its hinge |
| Drowned Bosun | axe blow, wind-up: torso 6, far arm 150/25, axe -40, head -4 | pass: the axe goes overhead, the coat skirt and cuff stay closed |

## Gate 2: style and detail

Course marks. Lightning (dominant): Lichtenberg ferns, fused metal, standing hair and lifted feathers, scorch, jagged
ink-cored arcs. Water: bloat, barnacles, verdigris, kelp, salt, drips, wet sheen. Never items: glowing outlines,
sci-fi arcs, fish faces on everything.

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Not cartoony, no tubes, no mannequin | Result |
|---|---|---|---|---|---|---|---|
| Thunder Whale | pass: breaching head bristling with rods and lines | fixed (see below) | 20+ (12): harpoons with sockets and rust bleed, ropes, rope slung between rods, cork float, broken oar, net scrap, barnacle crust on the jaw and brow, weed, sucker-scar rings, rake scars, pale scar patches, a Lichtenberg fern at every rod, a fused snapped harpoon head, scorches, worn and snapped teeth, a cataract eye, the Tooth with strata and a chip, proud flesh round it, water sheeting and drips | hide, barnacles, iron and rope | pass | fixed (see below) | pass, polish open |
| Lighthouse Keeper | pass: raised lantern on its pole | pass: fern down the neck, scorched cape, fused run and fern on the lens cage, standing white hair; soaked oilskin with salt tide-lines, drips, barnacles, kelp | 18 (10): lens cage with verdigris, gallows arm and hook, tarred whipping, iron shoe, rope coil, key ring with three keys, gaff hook, horn toggles, breast pocket with wick trimmer, belt and buckle, patch, sou'wester with chin string, boot creases and scratches, salt, drips, kelp, barnacles, scorch | gansey, oilskin coat, shoulder cape, sou'wester | pass (brass and rust are named materials) | pass | pass |
| Harpy Matron | pass: spread wings, wind-torn hair, circlet | pass: ferns on the collarbone, neck and wing, scorch, sparks and standing hair; salt, barnacles on the shanks, weed on the rock | 14 (10): drowned-gold circlet with an empty socket, verdigris and barnacles, pin feathers, ribs, wrist claws, scorch, sea stack with bedding planes, rusted wreck chain, a fern burnt into the rock, weed, salt, mussels, surf | skin, plumage masses, flight feathers, gold | pass (the only gold on the coast) | fixed (see below) | pass |
| Shock Eel | pass: reared S-curve | pass: pale ferns burnt into the hide, the fused hook, organs lit before discharge; barnacles, kelp wound round it, surf and spray. An eel's face, which is right for an eel | 11 (6): electric organs in two rows, dorsal fin rays, myomere chevrons, lateral line, bite scars, ferns, barnacles, kelp wraps, fused hook and burnt leader, nostril tube, sensory pores | hide, belly, fin | pass | fixed (the head seam) | pass |
| Wrecker | pass: lantern held out and the cudgel | pass: fern up the bare forearm and onto the hand, burn holes in the wool, fern on the cudgel, static in the beard and hair; soaked wool, salt, drips, kelp, barnacles | 16 (6): cable panel, saddle seam, darn, burn holes, tarred rope belt and knot, sheath knife, knee patch, fish hook in the cap, nails with rust weep, old blood, rolled sleeve, forearm hair, scar, broken veins | skin, gansey, trousers, boots, cap | pass (red only as old blood) | fixed (boot tyres, posture) | pass |
| Storm Harpy | pass: wings raised in a dive | pass: fern across the chest and wing, static-lifted hair and feathers, sparks; notched wet primaries | 8 (6): notched primaries, pin feathers, ribs, collarbone, wrist claws, fern, sparks, standing hair | skin, plumage masses, flight feathers | pass | fixed (see below) | pass |
| Tide Crab | pass: scavenged-shell crab | pass: fern and scorch on the housing, a fused bar, pale ferns on the claw; barnacles, verdigris, kelp, rust runs | 13 (6): lantern housing (vented cap, ring, bars, three different panes), rust runs, verdigris collar, barnacles, scorch, fused bar, net on the far claw, rope wraps, a split plank on a rope, a bent nail, teeth on both fingers, tubercles, leg spines and bristles | carapace, iron housing, rope and net | pass (slate and rust) | pass | pass |
| Drowned Bosun | pass: raised whistle and boarding axe | pass: fern up the neck, two fused buttons, scorch hole in the hat, static in the beard, scorched nick on the axe; bloat, peeling, lividity, barnacles, mussels, kelp in the beard, salt | 20 (6): brass buttons (one burst, two fused), horn waistcoat buttons (one torn off), pocket flap, belt and buckle with verdigris, marlinspike on a lanyard, neckerchief, cockade, wilted feather, barnacled hat, patch, whipping on the axe grip, nick, old blood, call on its chain, bare swollen foot, mussels | shirt, waistcoat, coat, hat | pass (navy gone grey) | fixed (eyes, feather) | pass |

No two foes share a silhouette (`sil.png`). The two harpies are told apart by size, pose and context: the Matron perches
upright on a rock with her wings spread level, and the Storm Harpy dives head-down with her wings in a V. The Wrecker
crouches with a club over his shoulder, while the Bosun stands upright with his axe low and his call raised. The crab's
lantern housing is a low dome on a wide eight-legged base, while the Keeper's lantern hangs high on a pole.

### Style fails found and fixed
- Feathers read as frost blades, then as armour tiles (the Storm Harpy's first wings were fans of spikes, and the
  Matron's body plumage was rows of lamellar plates). Rebuilt in `kit_VI`:
  - Flight feathers keep their width along the vane and have rounded tips, light shading and no dark bands.
  - The coverts and the body plumage are feathered masses (`plumeMass`), each a single shape with scalloped feather
    ends inside and a tipped hem (`featherHem`).
  - Only the primaries, secondaries, tail and a few contour feathers are drawn singly.
- Thunder Whale:
  - The first build was a pale grey capsule with a big white staring eye and a cartoon tooth. The hide is now darker
    and crosshatched, with a dark field toward the sea and the lit brow.
  - The head is a squared sperm-whale brow overhanging a narrow jaw.
  - The eye is a lidded slit under heavy folds with a dull milky film and no pupil.
  - The Tooth is a long faceted stone shard with strata and a chip.
  - The lightning arcs first ran tip to tip along the back and traced the silhouette (a Never item: glowing outline).
    They now leap across the hide between back and flank rods, and out at the front rank.
- Shock Eel: the surf foam was solid white lumps. It is now bubble clusters and lace.
- Harpy Matron: the circlet's points read as cones. The circlet is now an engraved band with a socket. Her face was
  hidden under a dark helmet of hair. The scalp is now lighter, with strands drawn over it.

## Still open
- Thunder Whale:
  - At game size the open jaw's tooth row still reads a little like a saw edge.
  - The head's outline is a broad rounded block. The harpoons carry the silhouette, but the brow could be harder.
  - `arcs` is a VFX layer. Its strikes at the front rank should be spawned by the engine, not keyed.
- Lighthouse Keeper: built heavy-boned rather than thin, because of the guide's "never lanky". He reads as a tall
  stooped man, not as a stick.
  - His far hand needs IK onto the pole in every animation (shown in the pose test).
- Harpy Matron: she holds the rock with her talons. The dive needs a translation key on `body` to leave the rock
  (rotation alone cannot carry her off it).
- Storm Harpy:
  - Her flying body is about 0.85 of a human's height (wings up, legs folded), so she reads slightly small next to the
    Wrecker.
  - Her grit is 8 against a need of 6, the thinnest in the set.
- Tide Crab: the whole figure is shifted 46 px in its canvas, so its body pivot is at x 254, not centred.
- All: rope and kelp layers on rotating bones need counter-rotation to stay plumb. The whale has a `ropes` bone for
  this; on the others they ride their parent bones.

## Independent review (2026-11-23)

Reviewer: a second agent, judging the set fresh against GUIDE.md section 8, LOGIC_CHECKLIST.md, the design language and
the World VI bible, with the Drowned King (ruler bar), the reviewed Wreck Crab and Kettle Crab legs, the rebuilt
Eel-kin and Lamprey, and dirAC / dirAC2 as references. Every figure was rendered alone, composited on a mid-dark ground,
zoomed 2x to 3x on heads, hands, held objects and feet, and checked at sheet size and at game size (190 px per human).
The director's five calls (1 to 5 below) were all confirmed as fails, then fixed and re-checked. The rig counts in the
table at the top are updated. Rigs were re-exported for all eight (no `MISSING JOINTS`; every build sets `groundY` to
canvas height minus 30 through `kit_VI.base`, and every rig.json carries that ground: 1570, 1370, 1070, 790). The
attack pose tests of every changed figure, and of the Drowned Bosun (its hat feather uses the changed feather helper),
were re-run into `out/worlds/VI/<key>_pose.png` and looked at. `sheet.png` and `sil.png` were rebuilt with the maker's
composer, in the same layout.

### What was changed, per figure
1. **Thunder Whale (director: a tilted flat grey box).** Rebuilt as a sperm whale's head. The case has a gently domed
   top and a blunt forehead: a tight top corner, a front that bulges forward and then tucks back under the snout. The
   long, narrow, underslung jaw is thicker at the hinge and tapers, with a white lip, a dark underside, and worn teeth
   (one snapped, one gone). It hangs open well behind the snout's front. The palate has its row of sockets. There is a
   dip behind the case, and the body is deeper behind it. The mass turns: a lit top plane and a lit forehead face the
   key light, the brow turns to the flank, the lower flank and throat sit in crosshatched shadow, the snout's underside
   and the jaw's underside are darkest, and the back sinks toward the sea. The planes are softened so they read as form,
   not stripes. Deep corrugated ridges (a dark groove and a lit crest each, bowed round the body) run down the flank
   behind the eye and deepen toward the back; long creases run above the lip. The scarring is an old bull's: a white
   scratch mesh, irregular squid-sucker tracks, tooth rakes, and pale battered patches on the forehead. The eye moved up
   out of the surf: it sits low by the mouth's corner, sunk in folds with crow's feet, and the cataract is readable.
   The harpoons, ropes and plumb lines are kept (21 rods, placed by hand). The arcs now join a rod on the back to one
   low on the flank, or two flank rods, so they cut across the hide. The front-rank strikes leave from rods near the
   mouth and run out across open air. The Tooth still throws its bolt up into the storm.
2. **Tide Crab (director: thin spindly legs, the spider fault).** The legs were rebuilt on the reviewed construction
   (`kit_VI.crabSeg`, `dactyl` and `mlimb`, copied from kit_III / kit_I_b with slate tints). Each leg is coxa socket,
   merus, carpus, propodus and dactyl, 32 to 41 px thick and flattened, with spines, setae and joint membranes. The legs
   splay out sideways and low, the knees barely above the rim, and every tip is planted (near tips on the ground line,
   far tips higher). The shell sits low, with its belly about 60 px off the sand, and the rim has its underside and
   serrations. The claws' merus and carpus are crab segments too (they were tubes). The crusher's palm now has an
   underside shadow, a hinge knob and a chipped finger. The canvas shift (`shiftFig`) is no longer needed, so the body
   pivot is centred.
3. **Shock Eel (director: an S of even width with yellow dots).** The body now swells from the water to its thickest
   through the trunk and narrows a little at the nape. The tail comes up out of the surf behind it as its own chain
   (`tail_1..3`): a flattened blade with a fin fringe running round the tip, fin rays and torn notches. Where the S
   crosses over, the body rolls: the pale belly swings across to face the viewer and spiral creases run round it. The
   inside of each bend bunches into skin creases (measured from the curvature) and the outside catches a sheen. The
   lateral line has its pores. The electric organs are a band of stacked plates under the skin of the lower flank, with
   skin texture over them and a glow that builds toward the head. The body's light and shadow (soft shadow and hatch on
   the side turned from the key light) are drawn over the band, so it sits in the flank. The teeth are uneven, with a
   gap, and pores and a gill fold were added to the head.
4. **Storm Harpy (director: the head-down dive is a tangle).** Re-posed as a shallow swoop: the body is one line
   swooping down at about 18 degrees. The wings are raised in a V (near wing straight up over the shoulders, far wing
   swept back), clear of the head. The head leads in profile, and the talons are thrown forward under the face. The
   face is legible: the nose is shorter and hooked, there is a shriek and a scar. The temple feathers that read as
   ears are gone. The cap-like scalp is replaced by layered tapered hair strands combed back over the skull. The
   plumage is drawn as masses with tipped hems, not rows of tiles. The legs are lightened (they read black). New grit:
   a scrap of sailcloth (seam, grommet, tar) in the far talons, a fish hook and line through the wing's leading edge,
   an iron ring on a thong at the shank, barnacles on the shank, scorched primary tips, salt on the mantle and tail,
   water flung off the dive, and a face scar. The detail count went from 8 to 17.
5. **Harpy Matron (director: stiff symmetric fans).** The near wing is raised back from the near shoulder, with the
   wrist high and the long albatross hand breaking down from it. Before, it crossed her chest as a bare arm. The far
   wing is lower, half folded and foreshortened, behind the body toward her front. Both are bigger, so the
   spread-wings signature reads. A new `wing()` option `cover` feathers the leading edge (a pale marginal row) and makes
   the covert rows cast onto the row below: greater coverts, the lesser mass, then the marginals, each layer separated
   by its shadow. The helmet-like scalp is replaced by long wind-torn hair in layered strands under the circlet. The
   row of hanging single feathers under the mantle and belly (which read as tags) is cut from 12 to 5, at varied
   angles. A scorch and a salt patch that were left floating off the wing were moved onto the coverts.
- Shared within World VI (`kit_VI.js`): `feather()` tapers more, and the outer primaries are emarginated, so the wing
  tips splay into slotted fingers instead of planks. The rachis is softer, the primary tones vary, and there is an
  optional cast shadow. New helpers: `mlimb`, `crabSeg`, `dactyl`. The Lighthouse Keeper, Wrecker and Drowned Bosun
  were re-rendered and their rigs re-exported. Only the Bosun's hat feather changed, and its pose test still passes.

### Gate 1 (independent): logic audit

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Thunder Whale | fixed: the head case now runs on into the body with a dip behind it, one axis from the sea to the snout | pass: the eye sits low by the mouth's corner, where a sperm whale's is | n/a | pass: breaching, pivot at the waterline | fixed: the eye was under the surf foam (lifted 100 px); jaw hinge under the cheek, teeth set in the jaw's gum, rods bedded with rust bleed, ropes plumb | fixed: the flat grey slab had no light planes. Now a lit top and forehead, the flank and throat in shadow, key upper left after the flip |
| Lighthouse Keeper | pass | pass | pass: both fists on one pole through `B.grip`, no warning | pass | pass | pass |
| Harpy Matron | pass | pass | pass: wrist claws flex one way | pass: talons over the ledge | fixed: the near wing's root sat on the back shoulder and the bare arm crossed the chest. Now each wing leaves its own shoulder, the far wing behind the body | pass |
| Wrecker | pass | pass | pass | pass | pass | pass |
| Shock Eel | fixed: the width now follows an eel (trunk thickest, nape, taper), the head continues the body | pass | n/a | pass: reared from the surf, tail out of the water behind | pass: the tail chain enters the water at its own foam ring | fixed: the organs were lit dots on top of the shading. Now the flank's shadow and hatch fall over them on the side away from the key |
| Storm Harpy | pass: the head leads along the line of the neck and spine | pass: the eyes look along the swoop at the target | pass: the far toes close over the sailcloth they hold, the near talons are open to rake | pass: in flight | fixed: the near wing root buried the torso (re-posed). The sailcloth is gripped, the ring hangs on a thong tied round the shank, the hook goes through the leading edge | pass |
| Tide Crab | pass | pass | pass: the moving finger closes on its hinge onto the fixed finger | fixed: the high thin legs could not carry the low wide shell. Now eight thick legs splayed low with planted tips, the shell sitting low over them | fixed: every leg starts in a coxa socket under the rim | pass |
| Drowned Bosun | pass | pass | pass | pass | pass | pass |

Pose tests (independent), `out/worlds/VI/<key>_pose.png`:

| Figure | Pose | Result |
|---|---|---|
| Thunder Whale | body -3, jaw -12, fin 10, ropes 3 | pass: the jaw drops on its hinge and the throat stays closed behind the teeth |
| Tide Crab | claw_n_1..3 10/12/8, claw_n_4 -18, eyes -8/-6, two legs 4/-3 | pass: the crusher lifts on its segments and the finger closes; rope and plank ride the carpus; the leg joints stay closed |
| Shock Eel | seg_1..8 3/4/5/-4/-5/-6/-3/2, head 12, jaw -26, fin -12, tail_1..3 6/10/14 | pass: the chain bends with no tears, the jaw drops on its hinge, the tail flicks |
| Storm Harpy | body 12 (flare), head -8, thighs 12/10, legs 6, toes -18/-14, wings -22/-10/-6 and -16/-8, tail -10 | first try (thighs 30) failed: the near leg swung up across the face. Re-posed: the body pitches up into the strike and the talons rake forward below the chin. Pass |
| Harpy Matron | body -24, head 16, wings 20/10/6 and -16/-8, thighs 38/36, toes -22/-20, tail -10 | pass: the wings stay on the shoulders and the talons come off the ledge forward. Leaving the rock still needs a translation key |
| Drowned Bosun (re-run) | torso 6, upperarm_f 150, forearm_f 25, axe -40, head -4 | pass, unchanged |

### Gate 2 (independent): style and detail

| Figure | Item | Result | Fix |
|---|---|---|---|
| Thunder Whale | Head anatomy (GUIDE 8: boxy body from slabs, flat surface) | fail, fixed | sperm-whale case, rounded bulging forehead, underslung narrow jaw, corrugated flank, planes that turn (see 1) |
| Thunder Whale | Lightning "Never": glowing outlines / arcs tracing the outline | fail, fixed | arcs re-paired twice. In the first rebuild, two still ran parallel to the back edge. Now every arc crosses the hide or leaves at the front rank; the front-rank strikes no longer run down the canvas edge |
| Thunder Whale | Grit (12) | pass | 25+: 21 harpoons, ropes, slung ropes, cork float, broken oar, net scrap, jaw barnacle clumps, weed, sucker tracks, tooth rakes, scratch mesh, pale patches, ferns at every rod, a fused harpoon head, scorches, worn/snapped/missing teeth, white jaw lip, palate sockets, cataract eye with folds and crow's feet, the Tooth (strata, chip, proud flesh), corrugations, lip creases, sheeting water |
| Thunder Whale | Signature at 190 px | pass | breaching blunt head bristling with harpoons; the jaw reads apart from the head in `sil.png` |
| Lighthouse Keeper | all items | pass | unchanged. Note: the coat skirt is the quietest large area on him, but it carries drips, tide lines and a patch |
| Harpy Matron | Wings: stiff symmetric fans | fail, fixed | asymmetric raised and drooping wings, wrist break, covert rows that cast, feathered leading edge, emarginated primaries |
| Harpy Matron | Head reads as a helmet (GUIDE 8: domes with a face painted on) | fail, fixed | layered wind-torn hair strands under the circlet |
| Harpy Matron | Hanging contour feathers read as tags | fail, fixed | 12 hanging feathers cut to 5, at varied angles |
| Harpy Matron | Grit (10), palette (gold only on the circlet) | pass | 15; the circlet stays the only gold on the coast |
| Wrecker | all items | pass | unchanged |
| Shock Eel | Tube of even width (GUIDE 8) | fail, fixed | eel width profile, nape, flattened finned tail (see 3) |
| Shock Eel | Organs stuck on as dots | fail, fixed | an organ band of stacked plates under the skin, shaded with the flank |
| Shock Eel | Even rows of teeth (cartoon) | fail, fixed | uneven needle teeth with a gap |
| Shock Eel | Grit (6) | pass | 16: organ plates, lateral line and pores, myomeres, bend creases, twist creases, dorsal fin rays, torn fringe notches, ferns, bite rings, barnacles on body and tail, kelp wraps and hanging kelp, fused hook and leader, head pores, gill fold, running water |
| Storm Harpy | Dive reads at sheet size | fail, fixed | re-posed swoop, wings in a V clear of the head, talons forward (`sil.png`) |
| Storm Harpy | Cartoon face, ear-like feathers, cap-like scalp | fail, fixed | shorter hooked nose, shriek, scar, feathers removed, strand hair |
| Storm Harpy | Feathers as tiles and planks | fail, fixed | plumage masses; emarginated, tapering primaries |
| Storm Harpy | Grit (6) | fixed | was 8; now 17 (see 4) |
| Tide Crab | Crab legs as thin high sticks (GUIDE 8) | fail, fixed | `crabSeg` / `dactyl` legs, low and splayed, shell lowered (see 2) |
| Tide Crab | Claw arms as tubes | fail, fixed | crab segments with spines and setae |
| Tide Crab | Grit (6) | pass | 16 |
| Drowned Bosun | all items | pass | unchanged apart from the re-rendered feather |
| All | No two foes share a silhouette | pass | in `sil.png` the two harpies are now clearly apart: the perched Matron with wings spread wide and drooping over a rock, the small Storm Harpy swooping with a raised V. The crab reads as a low wide crab with a lantern, not a spider |
| All | Palette | pass | slate, surf white, lamp yellow, plus the bible's named materials. Gold only on the circlet; red only as old blood |

### Resolved from the maker's open list
- Tide Crab canvas shift: removed; the crab fits the small canvas and its body pivot is centred.
- Storm Harpy "thinnest grit in the set": now 17.
- Thunder Whale "head's outline is a broad rounded block": rebuilt (see 1). "Tooth row reads a little like a saw":
  fewer, bigger, uneven teeth in a white gum; the jaw's barnacles are in irregular clumps, not a row.

### Still open after the independent review
- Harpy Matron: the mantle's hem across the chest and the belly plumage still read a little like a bodice and a skirt
  at sheet size, and a dark band shows at the base of the neck where the mantle's top edge meets it. This is polish,
  not a logic fail.
- Storm Harpy: the near wing's raised arm with its scapular coverts still reads as one column at game size. She is
  about 0.85 of a human's height in flight, so she reads small next to the Wrecker.
- Thunder Whale: the pectoral flipper is mostly hidden in the surf. `arcs` is still a VFX layer, so the engine should
  spawn the front-rank strikes. The Tooth's tip comes close to the top edge of the ruler canvas.
- Shock Eel: the tail is a separate chain out of the water (the body loops under the surface). Animate `tail_1..3` with
  the body's coil so they read as one animal.
- Harpy Matron: leaving the rock still needs a translation key on `body`.

## Lore changes 2026-11-23

Eye audit (bible/LORE_CHANGES_2026-11-23.md, item 10: no eye motif outside a void world). One fix, the smallest
change, in `worlds/world_VI.js` only; full audit in `/home/claude/party/EYE_AUDIT.md`.

- **Harpy Matron:** the circlet's empty socket was a round dark hole centred on the brow, which read as a third eye.
  It is now a lozenge bezel set off-centre toward the temple, its stone gone: four bent prongs, a scratched tarnished
  seat, a broken corner. The "socket that lost its stone" detail is kept; the eye read is gone.

| Gate | Item | Result | Note |
|---|---|---|---|
| 1 Logic | 1-6 | pass | Only the circlet's ornament changed; head, wings, talons and rock unchanged |
| 2 Style | Eye motif rule | fixed | No round dark mark on the brow at 2x, sheet or game size |
| 2 Style | Detail count (10), palette | pass, 14 | The empty setting still counts; gold stays only on the circlet |
| Rig | 17 bones, 31 layers | pass | Re-exported, no `MISSING JOINTS`; `out/worlds/VI/harpy_matron_pose.png` re-run with the reviewed dive (body -24, head 16, wings 20/10/6 and -16/-8, thighs 38/36, toes -22/-20, tail -10): attached |

`out/worlds/VI/sheet.png` and `sil.png` rebuilt with the reviewer's composer (scratch `rv6/sheet.py`, unchanged).

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Thunder Whale | harpoon arcs baked in | all 9 bolts (rod to rod across the hide, the Tooth into the storm, the strikes at the front rank) -> FX layer via `kit_fx.fxCapture`, exported to `out/worlds/world_VI_thunder_whale_fx.svg/.png` (+ `_fx.json`, anchor bone `arcs`). The Lichtenberg burns on the hide and the sparks at the harpoon tips stay | full size and 0.3x: pass |

Rig re-exported; sheet and sil rebuilt (`vi/sheet.py`).
