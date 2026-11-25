# World X, The Venom Spires, second batch "b": review

Maker's review, 2026-11-23. Scope: the eleven new bible entries, in bible order: The Procession, The Cicada Under the
Road (rulers); The Courier, Road Centipede (elites); The Dowser, Struck Shepherd, Highwayman, The Tinker, Road-Warden,
Spire Termites, Antlion (cast).

Files: `worlds/world_X_b.js` and `worlds/kit_X_b.js`. The kit requires `kit_X` and re-exports it; the first batch's
files are not edited. Seeds 1020 to 1030 in bible order. Every figure has groundY = canvas h - 30, and the export
wrapper throws an error if one does not.

Outputs: `out/worlds/X_b/` holds `<key>.png`, `<key>_sil.png` and `<key>_pose.png` for each figure, plus
`sheet.png` (this batch and the Drowned Thrall), `sheet19.png` (all 19 of the world) and `sil.png` (all 19 at game
size). Rigs are in `out/rig/worlds/world_X_b_<key>/`. All eleven export with no MISSING JOINTS. No render prints a
`grip` warning.

Method, per figure: composited on a mid-dark ground; zoomed 2 to 3x on the head, hands, held objects and feet;
checked at sheet size (a human about 190 px). Then rig export, an attack pose test, and a look at the pose.

## Canvases and true size (GUIDE section 2)

| Figure | Tier | Canvas | Note |
|---|---|---|---|
| The Procession | ruler | 2400 x 2400 | 12 bearers under a 1.75 m float; the saint's halo stands about 3.5 humans up |
| The Cicada Under the Road | ruler | 2000 x 2600 | True height 4: the raised forewing reaches the frame top (about 2540 px above the ground line) |
| The Courier | elite | 1900 x 1500 | The rider's head is at 2.05 (target 2.2); the horse is a big road horse |
| Road Centipede | elite | 2200 x 1400 | 4 long along the S; the reared head is at 1.8 (target 1.9) |
| The Dowser, Shepherd, Highwayman | human | 600 x 820 | |
| The Tinker | human | 640 x 960 | Heightened for the 1.35 load |
| Road-Warden | human | 600 x 1400 | Heightened for the twelve-foot pike |
| Spire Termites | small | 600 x 820 | |
| Antlion | large | 1250 x 1100 | Widened for the 1.8 crater |

## Kit (`worlds/kit_X_b.js`)

The kit keeps the first batch's palette, Living Ink setup (`kit.foeBase` through `kit_X.base`) and course marks.
It adds named materials from the bible entries to a copy of the palette: dust grey cloth, felt, hazel, fleece, grey
clay, fulgurite glass, dull gilt (the saint's halo only), tin, the nymph's shell, the pale adult, earth, stone and
the horse.

New helpers:

- `mArm` and `mLeg`: modelled limbs built on the reviewed `mchain`. They have muscle profiles (biceps and triceps,
  the forearm's swell tapering to a narrow wrist, the quadriceps, the calf's two heads high behind the shin). They
  carry anatomy lines on bare skin and folds on cloth, and they split at the joint for the rig.
- `knuckleFist` and `gripK`: the reviewed modelled fist from `kit_III_b`. Every held object goes through `gripK`
  (which uses `B.gripAngle`), not the bare `B.fist` block.
- `pHead`: a face taken by the venom, built on `B.head` at face shade 0.8. Options: rolled eyes, a slack jaw, a
  clenched jaw with bared teeth and a knotted masseter, a paralysed drooping side, and sting welts.
- `stiffMane`: hair standing stiff off the scalp, built as one filled mass of clumped, uneven hanks.
- `fern`: a burn kept inside a region.
- `comb`: a grey paper envelope laid in scalloped courses, with torn patches that show the cells.
- `miniWasp`, `leadBadge`, `waxLimb`, `tinHeart`, `feltHat`.
- `hemLine` and `hemThreads`: an uneven scorched hem and stiff, fused threads.
- `wear`: stains, dust rubs and pulled threads on cloth.

`X.bolt`, `X.sparks` and `X.stat` are never called: `grep` on `world_X_b.js` finds no call to any of them.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Item key: 1 head, neck and spine (for non-humanoids, segments follow one spine); 2 objects face their user and gaze;
3 grips (for non-humanoids, jaws and claws on a hinge); 4 weight (legs carry it); 5 contact and attachment;
6 facing and light.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Fix |
|---|---|---|---|---|---|---|---|
| The Procession | fixed | n/a | pass | pass | fixed | pass | 1: the first bearers stood with their heads up through the pole. They are now bowed, with the back curving up under the pole and the head hanging forward and down below it (persona `loll` 0.9 to 1.3). 5: the broad hats sat on heads that were under the pole. They now hang on their cords across the upper back. The pole is fused into each back with a swollen weld, and the welds bridge from back to back. |
| The Cicada Under the Road | fixed | n/a | pass | pass | fixed | pass | 1: the first adult was a separate stack of shapes. Nymph and adult now each follow one spline (`segBody`), and the adult rises out of the split along its own body line. 5: the adult's head floated above the thorax; it is now joined to the pronotum. The forelegs hook over the slabs, and the weight hangs on them. |
| The Courier | pass | pass | pass | pass | pass | pass | none. The message tube is held upright in a gauntlet `gripK` with the elbow behind it. The reins run from the fused bit to the far fist. The stirrup and the spur are fused into the flank. Three hooves are planted and the near fore is raised and curled. |
| Road Centipede | fixed | n/a | pass | fixed | pass | pass | 1 and 4: the first build had the ventral side on the wrong normal, so the legs grew out of its back. The ventral side is now on -n (down on the lying length, forward on the reared third). The near legs are low and splayed with their tips planted, and the far legs are shorter and behind. |
| The Dowser | pass | pass | pass | pass | pass | pass | none. Both fists hold the fork's arms palm-up as inline grips (`gripK inline`), and the point juts level ahead. The eyes roll half up toward the tip. The weight is on the straighter front leg. The plumb bob hangs from a loop round the wrist and swings toward the spire, as the bible says. |
| Struck Shepherd | fixed | pass | fixed | pass | fixed | pass | 3: the crook arm was raised to the shoulder. It is now lowered and held out ahead, with the crook's butt grounded on the ground line. 5: the lamb's hind legs were brought round the front and read as a third arm. They now hang down his back, and its front legs hang into his far fist. |
| Highwayman | fixed | n/a | fixed | pass | pass | pass | 3: both fists sat below the stock. The wrists were moved onto the stock's line, and both fists use `gripK` along the stock. 1: the hood was a helmet shape; it now has folds and a tail hanging plumb. |
| The Tinker | pass | n/a | pass | pass | fixed | pass | 5: the apron hung off the chest and read as a floating board. It is now a waist apron, tied round him and hanging plumb over the thighs. The hammer uses `gripK`. |
| Road-Warden | pass | n/a | pass | pass | pass | pass | none. The pike stands upright, its butt on the ground line beside the near foot. The fist (`gripK`, thumb up the shaft) is charred into the wood. |
| Spire Termites | pass | n/a | pass | pass | pass | pass | none. The sword goes point-down through the cone, the soldiers' mandibles hinge at the head, and the column walks on the ground line. |
| Antlion | pass | n/a | pass | pass | pass | pass | none. Both sickle jaws hinge at the head, the larva heaves out of the pit's bottom, and the forelegs plant on the funnel wall. |

## Gate 2: style and detail

Item key:

- **Sil:** the signature shape reads at 190 px.
- **Course:** lightning and toxin marks are present, and nothing from either Never column.
- **Grit:** the secondary-detail count (foe 6+, elite 10+, ruler 12+).
- **Palette:** world palette rules are kept.
- **Faults:** none of the GUIDE section 8 faults.
- **Section 9:** the Bloodborne adaptation (remnant, pushed mark, broken outline, structured hair).

| Figure | Sil | Course | Grit | Palette | Faults | Section 9 | Fix |
|---|---|---|---|---|---|---|---|
| The Procession | pass | pass | pass (20+) | pass | fixed | pass | Faults: the bearers were clones in a row, upright with heads through the pole. The persona builder now varies face (jaw, nose, age, beard, scar, lips), build, height, knee bend, head lean, headgear (broad hat hung on the back, hood, kerchief, bare), affliction (larvae under the calf and forearm, swelling at the neck, a cheek hole with a grub), which hand grips, rosary, gourd and leg wraps. The comb was a polka-dot sheet; it is now a paper envelope with torn cell patches. |
| The Cicada Under the Road | pass | pass | pass (14) | pass | fixed | pass | Faults: the abdomen was a stack of ovals and then a ribbed tube. It is now a swollen ring-banded mass with pustules, veins and a turned flank. The wings were smooth leaves; they are now crumpled outlines with pleats, thick wet veins and venom drips. The head was an egg; it now has a ribbed clypeus and a flattened dull eye. See Open items. |
| The Courier | pass | pass | pass (15) | pass | fixed | pass | Faults: the horse's belly was a flat slab. It now has a chest, girth and tucked flank in the outline, and the wasp nest was toned from a green disc into swollen hide. |
| Road Centipede | pass | pass | pass (12) | pass | fixed | pass | Faults: venom-green stripes read as a barcode and the legs grew from the back. Each plate now has a thin green edge, and the legs are on the ventral side. |
| The Dowser | pass | pass | pass (16) | pass | fixed | pass | Faults: the hem was a sawtooth row (now `hemLine`), the beard was a fringe of stripes (now a stiff fan of clumped hanks), and the welts were neon discs (now skin-toned raised welts with a puncture). |
| Struck Shepherd | pass | pass | pass (12) | pass | fixed | pass | Faults: the hair was a halo of strokes (now `stiffMane`), and the lamb read as a scarf (it is now a full lamb with a lolling head). |
| Highwayman | pass | pass | pass (11) | pass | fixed | pass | Faults: the stolen rings read as eye discs. They are now ring bands sunk into the welded fingers. |
| The Tinker | pass | pass | pass (14) | pass | fixed | pass | Faults: the load was a flat dark mass. The pots and kettles are now big enough to break the outline, with rims, spouts, bails and ears. |
| Road-Warden | pass | pass | pass (13) | pass | fixed | pass | Faults: even scorch rings down the pike read as stripes (now irregular charred patches and a streak). The open eyes stared; their whites were dulled to a set, wide-eyed look. |
| Spire Termites | pass | pass | pass (9) | pass | fixed | pass | Faults: the soldiers' gland was a staring green disc. It is now two lobes along the head suture. The chimneys were finger stubs; they are now lumpy flared flues. |
| Antlion | pass | pass | pass (10) | pass | fixed | pass | Faults: the body was a flat plank, and the glass rim a violet tube that read as a hose. The body is now puffy banded rings, and the rim is a knobbly glazed crust. |

### Signature shapes at game size (`sil.png`, all 19)

| Figure | Signature shape |
|---|---|
| Procession | a tall rayed saint on a float over a row of bowed backs |
| Cicada | a reared hulk with spade forelegs and a pale body rising with crumpled wings |
| Courier | horse and rider, a raised foreleg and the tube held out |
| Centipede | a high hooked curve over a long, low, many-legged S |
| Dowser | a bent figure behind a level fork |
| Shepherd | a lamb across the shoulders and a crook held out |
| Highwayman | kneeling behind a levelled crossbow |
| Tinker | a towering lumpy rack on a bent back |
| Road-Warden | a stiff figure beside a very tall pike |
| Termites | a small cone with a sword hilt at its tip |
| Antlion | open sickle jaws over a crater |

None of these shares a silhouette with each other or with the first eight. The Warden's and the Puppet Host's columns
differ by the pike's height against the staff and hat. The Procession's saint and the Hive Queen do not overlap in any
read.

### Course marks (the test: which course did this, to whom, does the bible say so)

- **Lightning: no arcs anywhere.** Every lightning mark is one of these:
  - ferns, on skin (`skinBurn`) or charred into cloth;
  - fused metal: the dowser's ferrule bead, the shepherd's weld round the fist, the highwayman's prod lump and
    rings, the tinker's fused load and spoons, the warden's melted pike head, the termites' crossguard, the
    courier's bit, stirrup, spur and horn, the halo's melted rim;
  - standing hair or bristles;
  - glass: fulgurite, the termite clay, glazed tips.
- **The single fern across the Procession.** It is drawn once into a buffer, then clipped into every bearer's
  cloak and back, so it carries on from body to body as one pattern.
- **Toxin:**
  - swelling: welts, the lamb's grown-together neck, the horse's nest, the glands, the adult cicada;
  - larvae lifting skin and fleece;
  - paper comb in the saint, the warden's brigandine, the courier's saddle and the tinker's kettle;
  - pustules and mould;
  - paralysis: rolled eyes, clenched jaws, the highwayman's drooping side.
- **Never columns:** no glowing outlines, no slime puddles, and venom drawn only as drops.

### Section 9

- Every human keeps the remnant of their trade:
  - Dowser: hazel fork, plumb bob, tally board;
  - Shepherd: crook and bell;
  - Highwayman: purses and goat's-foot lever;
  - Tinker: apron, tongs, solder pot;
  - Warden: badge, shackles, horn;
  - Courier: badge, horn, tube;
  - bearers: scrips, gourds, badges, rosaries.
- Each figure pushes the one mark its course explains:
  - Dowser: hands burned into the fork;
  - Shepherd: the lamb grown into the neck;
  - Highwayman: a fused bow;
  - Tinker: a fused load;
  - Warden: a melted pike;
  - Procession: bearers fused into one mass;
  - Cicada: a split along the strike;
  - Courier: a fern from crown to hooves.
- Outlines break by lightning: scorched frayed hems, stiff threads, fused drips.
- Hair is clumped hanks.
- Corrupted relics (the saint, the badges, the votives) appear only on the Procession and its pilgrims, where the
  bible names them.

### Palette

- Dull gilt appears only on the saint's halo, which is holy, and as a faded border trace on the banner.
- Red appears only in the horse's drawn-back gums (flesh) and as dried blood. The courier's seal is now old black
  wax crusted with dried blood (director's item 6).
- No eye motif:
  - insects' eyes are dull faceted masses with no glint;
  - the bearers' eyes roll up;
  - the rings and welts were redrawn so they do not read as discs.

## Pose tests (`out/worlds/X_b/<key>_pose.png`)

| Figure | Attack tested | Result |
|---|---|---|
| Procession | the float tips forward and the saint comes down on the front rank (float -4, saint -9, head -6, front bearers lean) | Pass. The bearers stay under the pole. |
| Cicada | the song: the split widens, the adult arches, the wings lift, the stones rattle | Pass |
| Courier | trampling lunge: the body pitches up, the raised fore strikes, the rider jerks | Pass. The planted hooves need foot locks. |
| Road Centipede | the reared third bows, the head pitches down, the claws close | Pass. The plates stay lapped. |
| Dowser | the rod snaps down, both forearms drop with it | Pass |
| Shepherd | the crook reaches out and hooks | Pass |
| Highwayman | the bow kicks on the shot | Pass |
| Tinker | a turn that swings the load | Pass. Load and torso stay joined. |
| Road-Warden | a stiff pike thrust, the pike tipping forward | Pass |
| Termites | the soldiers rear and spray, the column moves | Pass |
| Antlion | the head jerks up and the jaws open | Pass |

## Open items

- **Holds that need IK:**
  - Dowser: the far hand on the fork (both hands on one rod).
  - Highwayman: the far hand on the fore-stock.
  - Courier: the far fist on the reins. Also the planted hooves and the rider's stirrup foot.
  - Procession: the bearers' hands on the pole, whenever the float moves.
  - Centipede, Antlion and Cicada: planted leg tips and foreleg hooks.
- **Two elites a little under their stated height.** The Courier's rider's head is at 2.05 (target 2.2), and the
  Centipede's reared head is at 1.8 (target 1.9).
- **Procession comb.** The comb masses on the saint are separate lumps with torn cell patches; at sheet size they
  read as pale growths rather than one continuous spill.

## Director's sheet check: rework (2026-11-23)

The director's sheet check failed five figures and the seal. Each was rebuilt in `world_X_b.js` (and in the comb
helper in `kit_X_b.js`), then re-rendered, re-rigged and pose-tested, and the sheets were rebuilt. Each was checked
at 2 to 3x zoom against the Pit Crawler (world_IV.js) and the Mantis and Spider (world_X.js).

### What changed

**1. The Cicada Under the Road: rebuilt.** It now stands at true height 4 on a 2000 x 2600 canvas.
- **The adult, seen three-quarter from its back as it rises out of the split:**
  - Head: broad and blunt. The ribbed postclypeus bulges forward. Wide-set compound eyes sit on the head's sides as
    dark glossy faceted domes, shaded, with no pupil and no glint. Three small dull ocelli sit on the vertex. A short
    beak is tucked under and runs back along the near side.
  - Pronotum: a shield with flaring lateral angles, oblique grooves and a raised collar with a lit rim.
  - Mesonotum: a hard plate with a lit edge, the W (dark, pale-edged) and the cruciform swelling at its rear.
  - Abdomen: eight arched tergites drawn from the tail forward. Each hind margin laps the plate behind, with a lit
    edge, a cast shadow and the venom-green membrane between plates. Pustules sit on it. The part below the split is
    clipped inside the husk.
- **Wings:** the near forewing is folded like a tent along the abdomen. The far forewing is half unfolded and raised
  to the frame top. Both are built with the reviewed `cellWing`: translucent cell panes, longitudinal veins and
  cross-veins, a stigma, torn cells, a ragged margin, a burnt cell and wet drips.
- **Forelegs:** thick and jointed. The femur is swollen and armed below with spines. Both hook the split's rim and
  pull up out of it.
- **Husk:**
  - Built from the same plate shapes (`segBody`), dull black-brown and earth-caked. The seams are fused bright
    except along the split.
  - The split is a jagged opening. Inside, the hollow shows the far inner wall lit thin and amber, ribbed by the
    plates' inner ridges.
  - The near lip is thin and curled, scorched, lit through at the torn edge, with brittle flakes.
- **Road:** heaved setts, each a cobble with a top face and the depth of its front face. Near the hole they tilt
  away from it and lift; the hole is broken earth. The milestone, the waypost, the cart wheel, clods and a small
  empty husk on the foreleg are kept.

**2. Road Centipede: rebuilt on the reviewed Pit Crawler method.**
- Each segment has a domed tergite with a lit rim, its raised posterior margin lapping the plate behind, plus a rim
  of thickness, a pleural membrane with a sclerite, sutures and the plate's venom-green edge. The body tapers at
  both ends.
- One pair of legs per segment. Each leg is thick at the base (about a third of the body depth) and about 1.3 body
  depths long. It is jointed (coxa, femur, tibia, tarsus) with joint membranes, spines and a planted claw.
- Each pair is in its own phase of a walking wave: splayed forward or back, some lifted in their swing phase.
- The head is a flat plate with a green rim, sutures, dull ocelli and plates strained apart by the venom glands.
  The forcipules are curved fangs on swollen glands, one with a drop of venom. The antennae are long and segmented,
  swept back.
- Legs on the reared third reach forward and curl over the company.

**3. The Procession.**
- **Bearers:**
  - Heights now run 0.86 to 1.12, and the gaps between them are irregular.
  - Each persona has its own stride (the near foot forward or back), lean and head angle. Some have a trailing far
    leg.
  - Three bearers stumble, with the near knee buckled and dropped.
  - The far row is in a second depth row, offset from the near one and darker (dim 0.36).
- **Saint:** carved in contrapposto.
  - The robe narrows at a knotted cord belt and flares to an undulating carved hem. The near knee pushes the cloth
    forward, with folds radiating from it.
  - V folds hang between the arms, and long folds with lit ridges fan from the belt.
  - The hooded mantle hangs down the back in carved zigzag folds.
  - Both arms are modelled sleeves ending in carved hands: a fist on the staff and an open hand at the chest.
  - The face is split from brow to chin with comb in the split.
  - The comb grows over the statue in irregular layered masses: at the split in its side, over a shoulder, at the
    hip, piled at the foot, in tongues hanging down the plinth and spilling over the deck onto the bearers. It is no
    longer a tube.
  - `comb` is now a scalloped paper envelope with torn patches showing the cells.

**4. The Courier.**
- Each horse leg is now one outline with the horse's masses, after the Dray Horse:
  - the hind leg's thigh and gaskin bulging behind and tapering hard to a hock whose point sticks back;
  - the foreleg's forearm muscle swelling at the top and tapering to a flat knee;
  - a slim cannon with the tendon behind, a knobbed round fetlock, a sloping pastern and the hoof.
- The barrel is deeper, with the brisket and girth low and the flank tucked up to the stifle. The neck has a thicker
  base and an arched crest. The head is tapered, with a round jowl.

**5. Antlion: rebuilt as a larva.**
- The abdomen is a fat, flattened oval of seven arched segment plates, each lapping the next with a lit edge and a
  venom-green band. It is bristly, with clumped tufts standing off its rim, pustules, a larva hole and fulgurite roots
  out of its back.
- It lies in the pit bottom, half buried, with sand drifted over its rear and flank.
- A narrow three-plate thorax lifts a small flat square head with dull eye tubercles. Two huge sickle mandibles
  spread in a wide V: long teeth on the inner edge, bristles along the back, venom-swollen bases and scorched glassy
  tips.
- Four short thick legs are braced in the sand.

**6. The Courier's seal** is now old black wax crusted with dried blood. No decorative red remains on the batch.

### Gate tables, updated rows

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Fix |
|---|---|---|---|---|---|---|---|
| The Cicada Under the Road | pass | n/a | pass | pass | fixed | pass | 5: the adult's abdomen hung below the husk. It is now clipped inside the split, and the forelegs hook the rim. |
| Road Centipede | pass | n/a | pass | fixed | pass | pass | 4: the legs on the rising part stood as vertical posts. Floor legs are now chosen by spine height and splay, and the reared legs reach forward. |
| The Procession | pass | n/a | pass | fixed | pass | pass | 4: the stumbling bearers drop their hips and knees, and the trailing legs carry less weight. |
| The Courier | pass | pass | pass | pass | pass | pass | none |
| Antlion | pass | n/a | pass | pass | pass | pass | 3: both mandibles hinge at the head's front corners. |

| Figure | Sil | Course | Grit | Palette | Faults | Section 9 | Fix |
|---|---|---|---|---|---|---|---|
| The Cicada Under the Road | pass | pass | pass (18) | pass | fixed | pass | Faults: balls, eggs, a ring tube and leaf wings, now a plated cicada as listed above. Eyes: the first rebuild's black discs read as ears, so the eyes were set into the head's sides, shaded, with no glint. A stray unshaded black fill on the tergites (opacity 0 is falsy in the engine) was removed. |
| Road Centipede | pass | pass | pass (12) | pass | fixed | pass | Faults: identical boxes and tiny legs, now domed lapping tergites and long jointed legs in a walking wave. |
| The Procession | pass | pass | pass (22+) | pass | fixed | pass | Faults: one repeated bearer, now varied height, gap, stride, stumble, lean and depth. The tube saint is now carved drapery with comb masses. |
| The Courier | pass | pass | pass (15) | fixed | fixed | pass | Faults: a boxy body and stick legs, now barrel, gaskin and forearm masses. Palette: the seal is black wax and blood. |
| Antlion | pass | pass | pass (11) | pass | fixed | pass | Faults: a green blob on sticks, now an oval plated larva with sickle jaws, half buried. |

### Rigs and pose tests (re-run)

All five re-exported with no MISSING JOINTS: Cicada 12 bones, Procession 18, Courier 31, Centipede 41, Antlion 9.
Every joint stays closed in all five pose tests.

| Figure | Attack tested | Result |
|---|---|---|
| Cicada | the song: the split widens, the adult arches, the far wing lifts, the forelegs pull | Pass |
| Procession | the float tips toward the front rank and the saint comes down | Pass |
| Courier | trampling lunge | Pass |
| Centipede | the reared third bows, the head pitches down, the claws close | Pass. The legs ride with their segments. |
| Antlion | the head jerks up and the jaws open | Pass |

### Still open after the rework

- **Cicada adult head.** It reads as a broad rounded cap at sheet size. The clypeus ribs and side eyes carry it at
  zoom.
- **Courier hind cannons.** They sit in deep shade on the far side of the light and read dark at sheet size.
- **Centipede and Courier height.** Both are still slightly under the bible: the reared head at 1.8 and the rider's
  head at 2.05.
- **Holds that need IK.** Unchanged, plus the Cicada adult's forelegs on the split's rim.

## Independent review (2026-11-23)

Reviewer's pass after the director's sheet check and one rework round. Everything below was checked on the pixels:
each figure composited on a mid-dark ground, zoomed 2 to 3x on heads, hands, held objects, mouthparts and feet, and
shrunk to sheet size (a human about 190 px). Every changed figure was re-rendered (`node render.js worlds/world_X_b
<key>`), re-rigged (`node render_rig.js`, no MISSING JOINTS: Cicada 12 bones, Procession 18, Courier 31, Centipede
41, Antlion 9, Termites 8) and pose-tested with `posetest.py` into `out/worlds/X_b/<key>_pose.png`. The sheets were
rebuilt with `worlds/sheet_X_b.py` (a copy of the maker's builder): `sheet.png`, `sheet19.png`, `sil.png`.

### What changed

**The Cicada Under the Road (rebuilt in `world_X_b.js`; new `cicadaWing` in `kit_X_b.js`).**
- Head: the old head was a rounded cap with black disc eyes. It is now bowed toward the viewer, so it is seen from
  above and in front:
  - a broad, short capsule;
  - wide-set compound eyes bulging past its sides, oval and tilted, dark olive-black with a facet lattice and a broad
    dull sheen, no pupil and no glint;
  - the vertex with three small dull ocelli and the epicranial suture;
  - the frons with short bristle antenna stubs;
  - the postclypeus as a raised bulging plate down the face, ribbed by eight transverse grooves (each a dark groove
    with a lit ridge), a median groove, its own cast shadow on the frons and pronotum, and the anteclypeus under it.
- Mesonotum: the "W" was a dark line drawn on the plate. It is now a raised ridge in relief:
  - its cast shadow, the ridge body, the shaded flank and the lit crest;
  - set at the rear in front of the cruciform elevation.

  The two green "obconical" marks made the plate read as a face with a mouth. They became a faint venom-green
  swelling along the sides.
- The pronotum's flaring "shoulder pad" angles are rounded off.
- Wing: the raised forewing was a grey slab of panels. `cicadaWing` draws a translucent tinted membrane (the ground
  shows through it) with the cicada venation:
  - a thickened costa to the node;
  - the near-opaque basal cell;
  - the R, M and Cu stems;
  - the nodal line closing the ulnar cells;
  - eight apical cells fanning to an ambient vein inside the margin;
  - the clavus behind its suture.

  Veins are ink with a dark core and a thin lit thread. The wing also has torn notches and a torn-out bite with
  frayed vein stubs, wet sheen bands and beads, and crumple creases with a slight warp of the whole wing. The near
  forewing now hangs crumpled and wet down the flank over the shell's lip, and the husk and body show through it.
- Light: the maker darkened the adult's right side, which is the lit side under `foeBase`. The shading is now on the
  left (shadow) flank of every plate.
- Tergites: each one is an arched plate drawn tail first, and its hind margin laps the next plate:
  - a lit margin edge and the shadow it casts;
  - a turned flank and a lit crown;
  - a spiracle, punctures and pustules;
  - the swollen venom-green membrane at its front.
- Husk:
  - the split now runs from the back of the nymph's head to the metathorax;
  - the far lip curls back above the silhouette with a thin edge lit through;
  - inside, the hollow shows a dark interior and the far inner wall, thin and amber, ribbed by the plates' inner
    ridges;
  - the near lip is a curled, scorched flap with its pale inner face turned out and brittle flakes;
  - the earth lumps, which made the plates read as rubble, are cut to a few clods low on each plate;
  - each plate has a dull crown sheen and a fused weld seam;
  - the ferns now branch out from the split's edges.
- Legs and nymph head:
  - the adult forelegs bend down from under the pronotum, with swollen spined femurs, and hook the split's rims;
  - the nymph's near foreleg was lowered off its head, so the blunt head (with its ribbed frons, dull eye, antenna
    and folded beak) reads.

**The Procession.**
- Comb: one continuous mass now replaces the seven separate lumps and two tongues. It wells out of the split in the
  saint's side and runs:
  - up over the shoulder (a narrow vein of comb);
  - down the robe to the feet;
  - across the hem;
  - over the plinth's top and down its face;
  - across the deck and over its edge onto bearers 5 and 6, up to the pole.

  It is built as:
  - a lobed outer edge;
  - grey paper envelope courses;
  - 34 staggered cupped lips, each overhanging the course below and casting a dark recess on it;
  - six torn windows of hexagonal cells, the mouths darker toward the middle of each hollow, with capped cells and a
    grub;
  - extra darkening where the mass sinks against the statue and the plinth.

  The part above the plinth top rides on `saint` and the rest on `float`, clipped at y 1410 to 1430 so the seam
  overlaps. It holds in the tip pose.
- Grips: the bearers' fists on the pole were hidden under the welds. They are now drawn over them: the knuckles and
  fingers curl over the top of the pole, the palm is behind it (a pole slice is laid over the fist's lower half), and
  each grip is charred in.
- Welds: they were big grey discs that read as hats. They are now scar tissue hugging the underside of the pole, with
  a scorched seam, and the back-to-back bridges are thin cords along the pole.

**The Courier.**
- Both hind cannons now have a lit front plane, a cool rim down the back edge and round the hock (a director-ordered
  exception to GUIDE 9's "no rim lights per figure"), and a lifted far-hind fill. They read at sheet size.
- The rein ran into the far fist and stopped. Its tail now comes out under the fist, so it passes through the grip.
- The near stirrup leather was missing (only the broken far leather hung). It now runs from a bar under the saddle,
  behind the leg, to the stirrup iron round the boot.

**Road Centipede.**
- Legs:
  - every segment has a femur swelling at a third of its length;
  - each segment is rounded, dark below and lit above with a lit ridge;
  - knobbed joints sit at the trochanter and knee;
  - the legs are thicker at the base (1.15 of the old base width) and taper to the claw.
- The far legs stood above the back as vertical posts. They now root low on the far side and keep their knees at mid
  body, below the dorsal line.
- Plates: the shading cap went from 14 to 26, so the domes model as rounded shields.
- Head and forcipules: the head is drawn 1.3x larger (scale 2.1) so it reads at sheet size. Each forcipule is
  rebuilt:
  - a venom-swollen coxosternite with stretched, veined membrane under a dark plate;
  - three ringed segments curving inward;
  - a hooked, glossy black fang with a lit outer curve, inner teeth, a venom pore and a scorched tip.

  The near forcipule is spread forward, and the drop of venom on its tip is kept.

**Antlion.**
- The mandibles were straight sticks ending in a black scorch disc, which read as a knob. They are now sickles,
  straight from the base and hooking hard inward at the point. The tip is darkened inside the blade, and the scorch
  disc is gone.
- The crater sat on a raised block with vertical sides. The sand verge now runs out flat to both canvas edges, so the
  pit is sunk in the ground and its glazed lip is a low ring.

**Spire Termites.** The soldiers' venom-gland lobes were bright green with a white glint and read as eyes (no eye
motifs in X). They are dulled toward chitin, stretched along the head and lose the glint.

**The Dowser, Struck Shepherd, Highwayman, The Tinker, Road-Warden.** These were audited and left unchanged (see the
tables and "Still short").

### Gate 1: logic audit (LOGIC_CHECKLIST.md), independent

Item key: 1 head, neck and spine (segments on one spine); 2 objects face their user, gaze; 3 grips (jaws and claws on
a hinge); 4 weight; 5 contact and attachment; 6 facing and light. Each finding lists the fix and the re-check.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Finding, fix, re-check |
|---|---|---|---|---|---|---|---|
| Cicada | pass | n/a | pass | pass | fixed | fixed | 6: the adult's lit (right) side was shaded and the shadow side was lit. Fixed: shading moved to the left flanks; re-rendered, and the plates round correctly. 5: the near wing had no root. Fixed: a tegula now covers it, and the far root sits under the mesonotum's edge. The forelegs' claws end on the split's rim points (computed from the husk spline). Pose test (song): the lip, adult, head, wings and forelegs stay joined. |
| Procession | pass | n/a | fixed | pass | fixed | pass | 3: the hands on the pole were hidden under the welds. Fixed: fingers over the top of the pole, the palm behind it; checked at 2x. 5: the comb was separate pieces. Fixed: one mass, attached from the statue's split to the bearers' backs. Pose test (float tips, saint comes down): the comb holds across the saint/float seam. |
| Courier | pass | pass | fixed | pass | fixed | pass | 3: the rein ended at the fist. Fixed: its tail exits under the grip. 5: the near stirrup had no leather. Fixed: a leather from the saddle bar to the iron. Pose test (trampling lunge): no tears. |
| Road Centipede | pass | n/a | fixed | fixed | pass | pass | 4: the far legs rose above the back as posts. Fixed: rooted low, knees at mid body; legs carry the body. 3: the forcipules did not read as jointed claws. Fixed: jointed, hooked and spread. Pose test (claws strike down): pass. |
| Antlion | pass | n/a | fixed | pass | fixed | pass | 3: the jaws were straight with knob tips. Fixed: sickles hinged at the head's front corners. 5: the crater stood on a block. Fixed: sunk in a flat verge. Pose test (head up, jaws open): pass. |
| Spire Termites | pass | n/a | pass | pass | pass | pass | Palette (eye motif) finding fixed in Gate 2. Pose test (soldiers rear): pass. |
| Dowser | pass | pass | pass | pass | pass | pass | Both fists close on the fork's arms palm-up. The point juts level and the rolled eyes aim along it. The plumb bob hangs from the wrist loop. Weight is on the front foot. |
| Struck Shepherd | pass | pass | pass | pass | pass | pass | The crook shank passes through the near fist, with its butt grounded behind. The far fist holds the lamb's forelegs at the chest. |
| Highwayman | pass | n/a | pass | pass | pass | pass | Both fists wrap the stock along the knuckle row. The stock crosses the lower face as a cheek weld on the kerchief (the aim pose); not counted as a rod through the face. |
| Tinker | pass | n/a | pass | pass | pass | pass | Head centre about 0.45 of a head ahead of the neck base, on a spine leaning about 30 degrees under the load: inside the checklist limit. The hammer haft passes through the fist. |
| Road-Warden | pass | n/a | pass | pass | pass | pass | The fist is round the pike, thumb up the shaft, the butt on the ground line. The pike passes in front of the face without crossing it. |

Global checks:
- groundY = h - 30 on all 11; the export wrapper still throws if not.
- Seeds 1020 to 1030 in bible order.
- `flip: true` on all 11; the key light stays upper left after the mirror.
- `grep` finds no call to `X.bolt`, `X.sparks` or `X.stat`: no arcs or bolts in the air. Strikes show only as burns,
  fused metal, glass and standing hair.

### Gate 2: style and detail, independent

| Figure | Sil | Course | Grit | Palette | Faults | Section 9 | Finding, fix, re-check |
|---|---|---|---|---|---|---|---|
| Cicada | pass | pass | pass (16) | pass | fixed | pass | Faults: cap head, drawn-on W, opaque slab wing, rubble husk, as listed above. Re-checked at 2 to 3x and at sheet size: the face, eyes and ribbed clypeus read; the wing reads as a veined membrane; the split reads as a hollow shell. Palette: the husk's inner wall is amber-brown (earth), not red. The eyes have no glint. |
| Procession | pass | pass | pass (22+) | pass | fixed | pass | Faults: comb as separate pale growths, hidden grips, welds reading as hats; fixed as above. Gilt only on the halo and a faded border trace on the processional banner (holy). |
| Courier | pass | pass | pass (16) | pass | fixed | pass | Faults: hind cannons black at sheet size; fixed with the rim and the lit front plane. Re-checked at 190 px scale. Red only in the gums. |
| Road Centipede | pass | pass | pass (12) | pass | fixed | pass | Faults: boxy tube legs, posts above the back, an unreadable head and claws; fixed. Compared at 2x with the Pit Crawler: the legs now have the same knobbed, thick-based reading. |
| Antlion | pass | pass | pass (11) | pass | fixed | pass | Faults: stick jaws with knobs, a tray crater; fixed. |
| Spire Termites | pass | pass | pass (9) | fixed | pass | pass | Palette: the gland lobes read as green eyes. Fixed: dulled toward chitin and stretched along the head, no glint. Re-checked at 3x. |
| Dowser | pass | pass | pass (16) | pass | open | pass | Head, hands, fork and feet pass at 2x. Open: the legs below the coat skirt are close to even-width tubes. |
| Struck Shepherd | pass | pass | pass (12) | pass | open | pass | Head, crook grip, lamb and boots pass. Open: the trouser legs are even-width tubes split into a lit and a dark half. |
| Highwayman | pass | pass | pass (11) | pass | open | pass | Hands, bow and kneel pass. Open: the hood still reads close to a helmet at sheet size. |
| Tinker | pass | pass | pass (14) | pass | pass | pass | Load, hammer hand and face pass at 2x. |
| Road-Warden | pass | pass | pass (13) | pass | open | pass | Pike, fist and kettle hat pass. Open: the legs are tube-like under the ferns. |

Silhouettes against the first batch (`sil.png`, all 19): no shared silhouette. The Cicada's raised translucent wing
is a pale half-tone in silhouette; its block of road and the reared shell carry the read. The antlion's sickles now
read as a V at game size.

### Still short after this pass

- **Cicada.** The adult is frontal and nearly symmetrical, so at sheet size it still reads a little doll-like (it is
  better than the cap, but short of the Drowned King's character). The nymph's abdomen plates fan out at the bend
  into the hole and read as slats. A further pass should turn the adult three-quarter, arch it back, and rebuild the
  husk's abdomen on its own plate builder.
- **Road Centipede.** The legs on the reared third crowd into a dense comb under the head, and the lying body is
  close to straight rather than the bible's long S.
- **Antlion.** The head is a small rounded box.
- **Procession.** The hats hung on the backs still read as flat discs under the pole, and the bearers' faces are small
  at sheet size.
- **Humans (Dowser, Shepherd, Warden).** The leg modelling is weak (near tube legs). Not rebuilt in this pass.

### Holds that need IK

- Procession:
  - every bearer's fist on the pole; the fists ride on the bearer bones while the pole rides on `float`, so the
    pole slices over the fists drift when the float tips;
  - the saint's fist on the staff.
- Courier: the far fist on the rein (rein tail on `hand_f`), the boot in the stirrup, and the three planted hooves.
- Dowser: the far hand on the fork.
- Highwayman: the far hand on the fore-stock.
- Cicada: the adult's forelegs on the split's rims and the nymph's forelegs hooked over the setts.
- Road Centipede and Antlion: the planted claws.

## Ruler upgrade pass (2026-11-24): The Cicada Under the Road

Director's note: it faces front and is nearly symmetrical, so at sheet size it reads doll-like. Turn the emerging adult to
three-quarter view (one eye larger and nearer, the body twisting as it pulls free, the forelegs at different heights);
give the husk's abdomen its own overlapping plates, not slats; keep the reviewed head, wing membrane and road.

What changed (`world_X_b.js`, `cicadaUnderTheRoad` only; `kit_X_b.js` untouched):
- Three-quarter turn with a twist: the adult's frame `M(x, y)` now widens the near (lit) side and foreshortens the far
  side, little at the tail still in the husk and most at the thorax (near x1.19, far x0.53 at the pronotum), so the body
  turns as it pulls free; the axis arches toward the light. Every plate, groove, the W ridge, the cruciform swelling, the
  collar and the tergites follow it, so their midlines sit off centre toward the far side.
- Head (same construction as reviewed: capsule, facet-latticed eyes without pupil or glint, three ocelli, suture, ribbed
  postclypeus and anteclypeus) drawn in a turned head frame: the near half wider, the far half foreshortened, tipped
  0.1 rad. The near eye is larger (x1.1 wide, x1.12 tall) and nearer; the far eye is a narrow sliver at the far edge;
  the clypeus sits off centre.
- Forelegs at different heights: the far foreleg reaches low and hauls on the rim behind; the near foreleg is lifted
  clear, femur down and out from a turned near shoulder, tibia raised with its claws at the level of the head, reaching
  for the next hold.
- The thorax's near side wall (pleuron) and each tergite's near flank (lateral edge, green pleural skin, the spiracle
  moved to the near side) now show, as they should when the body is turned toward the viewer.
- Husk abdomen: its own plate builder, drawn tail first. Eight tergites of uneven span (+/-12%), each a domed plate
  wrapping back and flank with its hind margin bulging back at the middle, lapping over the plate behind and casting a
  shadow on it; a worn-bright margin on the lit side, a dashed weld bead (the seams fused shut, as before), a lit crown
  and a shadowed flank, earth caked in it, pits, a spiracle; two plates have chipped margins. Under each, the pleural
  groove and a narrower, darker sternite with its own margin. The slat fan at the bend is gone.
- Kept: wing membranes (`cicadaWing` untouched), road, hole, nymph head and forelegs, lightning burns, the split and its
  lips, canvas, seed, bones.

Before / after: before, at sheet size the adult was a frontal, mirror-symmetric figure with two equal round eyes and two
arms hanging at the same height (a doll in a suit), and the husk's abdomen was a fan of slats. After, the adult reads
turned and twisting out of the shell with one big near eye and a lifted near foreleg, and the husk's abdomen reads as a
plated, hollow insect body curling into the hole.

Checks: render, 2x and sheet size against the Drowned King; rig 16 layers, 12 bones, no MISSING JOINTS; song pose
(`shell_lip 4, adult -4, adult_head 6, wing_f -6, wing_n 3, aleg_n -10, aleg_f 6, stones 2`) closed, the lifted foreleg
stays on its shoulder; sheets rebuilt (`sheet_X_b.py`). Grit unchanged plus the plate details (16+).
Still short: the head capsule is still a broad rounded block and the mesonotum still reads a little like a chest at sheet
size; the near foreleg's claw now hangs free (no IK needed; the far one still needs IK on the rim).

## Ruler upgrade pass (round 2, 2026-11-24): the Cicada's head

Director's note: at sheet size the adult's head read mouse-like (the round eyes read as ears). Rebuilt the adult head
after a real cicada's proportions; nothing else on the figure changed. Backup: scratch `rp2/bak/`.

| What changed | Before / after |
|---|---|
| The head is very broad and short, blunt across the front. The compound eyes are the head's own lateral ends, low and flattened (wide, not tall), with the socket rim where the cuticle meets them; the far eye is drawn first so the face's dome overlaps its inner edge, as in a three-quarter view. The vertex is a narrow lit band with the three small ocelli; the antenna bristles sit in front of the eyes. The postclypeus is the dominant form: a swollen dome down the middle of the face, eight grooves curving round it with lit ridges, a median groove, its far flank and underside in shadow and a shadow thrown on the genae. The beak folds under. The three-quarter turn, husk plates, wings and legs are unchanged. | Before: a rounded cap with tall round eyes on top at the corners (ears). After: at sheet size a broad blunt insect head with flat side eyes and a ribbed face plate. |

Checks: re-rendered, re-rigged (16 layers, 12 bones, no MISSING JOINTS), pose test (song: `shell_lip 6, adult -4,
adult_head -8, wing_f -10, foreleg_n 6`) joins hold, sheets rebuilt with `sheet_X_b.py`.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| The Cicada Under the Road | head mouse-like, eyes read as ears | The adult's compound eyes sat at the head's upper corners and broke its outline as two dark round lobes. They now sit lower on the sides (at the genae) inside the head's outline, flatter, foreshortened on the far side, and ringed all round by a pale socket rim; still dull black, as the bible says. | improved: at 0.3x they read as eyes set in the head. Weak spot: the head capsule is still a rounded box with the ribbed postclypeus reading a little like a mask |

Rig re-exported (12 bones, no MISSING JOINTS); pose (`adult -4, adult_head -6, wing_n -10, wing_f 8`): attached.
Sheets rebuilt (`worlds/sheet_X_b.py`).
