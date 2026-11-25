# World X, The Venom Spires: review

Maker's review, 2026-11-23. Scope: the eight original bible entries (The Hive Queen, Mantis Duelist, Brood Mother,
Spire Wasps, Venom Spider, Puppet Host, Galvanic Beetle, Hive Drone). New entries being added to the bible go in a
second batch, in a separate file.

Files: `worlds/world_X.js`, `worlds/kit_X.js`. Outputs: `out/worlds/X/` holds `<key>.png`, `<key>_sil.png` and
`<key>_pose.png` for each figure, plus `sheet.png` and `sil.png`. Rigs are in `out/rig/worlds/world_X_<key>/`.
Seeds are 1000 + bible index. Every figure has groundY = canvas h - 30, and the export wrapper throws an error if one
does not. All eight export with no MISSING JOINTS, and no render prints a `grip` warning.

I checked every figure the same way: composited on a mid-dark ground, zoomed 2 to 3x on the head, hands and held
objects, mouthparts, claws and feet, then shrunk to game size (a human about 190 px) to check the silhouette. Each
then got a rig export and an attack pose test. "Fixed" in the tables means the item failed, was rebuilt, and passed
on the re-render.

## Kit (`worlds/kit_X.js`)

I copied the reviewed World VI kit (lightning helpers, crab segments, hands, rig helpers) and changed only its
palette to World X's. The new helpers are:

- `ileg`: a jointed insect leg. It has a coxa socket, crab-style femur and tibia (ridge, groove, spines, setae and a
  joint membrane), four tarsal beads and a claw pair. Legs are thick at the base, and a planted claw gets a contact
  shadow. The `tib` option thickens the tibia.
- `iwing`: a membrane wing. It has a heavy costa, radius, media and cubitus, cross-veins, a stigma, torn notches and
  burnt holes.
- `segBody`: overlapping tergites along a spline. Each tergite has rim thickness and laps over the one behind; the
  sternites show underneath; bands are optional; bones can be set per segment.
- `ceye`: a compound eye. It is a faceted kidney-shaped mass with no pupil and at most one or two glints.
- `furMass`: clumped directional locks that break the outline (the Bloodborne item 4 method).
- Course marks:
  - `burn` and `skinBurn` draw white-violet Lichtenberg ferns on chitin and on flesh.
  - `stat` draws a short ink-cored fork (it is no longer used on the beetle; see below).
  - `pustule(s)`, `mould`, `cordyceps` (fruiting stalks), `hole` (hollowed exits) and `grub` cover the toxin marks.
- Also `silk`, `mandible` and `antenna`.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Item key:

1. Head, neck, spine. For non-humanoids: segments follow one spine.
2. Objects face their user, and gaze.
3. Grips. For non-humanoids: jaws open on a hinge.
4. Weight. For non-humanoids: legs carry the weight.
5. Contact and attachment. For non-humanoids: wings attach at the thorax.
6. Facing and light.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| The Hive Queen | pass | n/a | pass | pass | pass | pass |
| Mantis Duelist | pass | pass | pass | fixed | pass | pass |
| Brood Mother | pass | n/a | pass | fixed | pass | pass |
| Spire Wasps | pass | n/a | pass | n/a (flying) | pass | pass |
| Venom Spider | pass | n/a | pass | pass | pass | pass |
| Puppet Host | pass | pass | fixed | pass | fixed | pass |
| Galvanic Beetle | pass | n/a | pass | fixed | pass | pass |
| Hive Drone | pass | n/a | pass | n/a (hovering) | fixed | pass |

What each figure was checked for, and what failed and how it was fixed:

- **Hive Queen**
  - 1: the gaster follows one spline from the petiole. The head hangs off the front of the thorax on a neck, in the
    same mirrored frame as the thorax.
  - 3: both mandibles sit on their own hinge bones (`mandible_n`, `mandible_f`).
  - 4: she clings head-down, and all six claws hook into the paper wall.
  - 5: the wings root on the scutum under a tegula. The lightning rod is stapled to the wall and welded into her
    back.
  - Anatomy decision: she clings with her back to the wall and her belly to the party. This way the gaster's natural
    ventral curl brings the sting forward over the party, and the rod runs down the wall into her dorsum. The first
    pose test curled the gaster the wrong way, driving the sting into her own thorax; it was re-posed.
- **Mantis Duelist**
  - 1: the prothorax rises straight out of the mesothorax and the head sits on top of it.
  - 2: the salute keeps both scythes ahead of the face. The near femur stands vertical and clear of the head by about
    30 px, and the far tibia crosses the near blade, not the face.
  - 3: both raptorial legs run coxa, femur, tibia on their own bones, and the mandibles hinge at the mouth.
  - 4 fixed: the first version stood on near-vertical stilts. The body was lowered 140 px, the walking legs were
    splayed with the knees out, and the tibiae were thickened (`tib` 1.5). All four claws are planted.
  - 5: the tegmina root at the mesothorax. The glove's fingers hook over the sash knot. The snapped blade is embedded
    in the pronotum, with blood at the wound.
- **Brood Mother**
  - 4 fixed: she was on stilts. The body was dropped 100 px, the legs widened (58 near, 46 far), the knees barely
    clear her back, and all eight claws are planted with the span running off the frame (2.2 wide).
  - 5: the egg sacs hang on silk strands from the abdomen. The young on the carapace moved from the `brood` bone to
    `body`, so they no longer float off the carapace when it lunges.
- **Spire Wasps**
  - Each wasp has head, mesosoma, petiole and gaster along one axis.
  - Wings root on the scutum; legs fold in flight (foreleg tucked, mid leg hanging, hind leg trailing).
  - Mandibles hinge under the clypeus.
- **Venom Spider**
  - It hangs by its spinnerets from an anchored dragline, and the hind pair of legs hooks the thread.
  - The chelicerae are on their own bones, with the fangs folding under.
  - The prey bundle hangs from a web strand.
- **Puppet Host**
  - 1: the head is lolled back on a slack neck, and the skull stays over the neck base (28 px ahead).
  - 2: n/a; its eyes are rolled up, with no object in its gaze.
  - 3 fixed: the staff passed in front of the face. The staff was moved forward 56 px. The elbow is jerked out level
    so the forearm meets the staff within the allowed angle; the fist uses `B.grip` with no warning.
  - 4: the body hangs on the staff, the near knee is buckled, and the far leg is braced back.
  - 5 fixed: the goitre was hidden behind the near upper arm. The head and throat now draw after the arm, so the
    swelling sits over it.
  - Every strap ends at a buckle, the scrip hangs on its cord, and the gourd hangs plumb from the staff.
- **Galvanic Beetle**
  - 4 fixed: it stood high with the femurs flat under the body. It now stands low: the femurs run out and up so the
    knees stand proud, the tibiae come down steeply, and the tarsi lie on the ground.
  - 3: the mandibles hinge under the head; both horns are on the head bone.
- **Hive Drone**
  - 5 fixed: the tongue read as a seventh leg. It now unrolls forward from under the head as a pale, banded glossa.
  - The mid and hind tarsi touch the nectar bolus, which hangs under the thorax.
  - The wings root on the thorax.

## Gate 2: style and detail

Item key:

- **Sil:** the signature shape reads in silhouette at 190 px.
- **Course:** lightning and toxin marks are present, and nothing from either course's Never column.
- **Grit:** the secondary-detail count is met (foe 6+, elite 10+, ruler 12+).
- **Palette:** world palette rules are kept.
- **Faults:** none of the GUIDE section 8 faults.
- **Section 9:** the rewritten section 9 (Bloodborne adapted to Ostium).

| Figure | Sil | Course | Grit | Palette | Faults | Section 9 |
|---|---|---|---|---|---|---|
| The Hive Queen | pass | pass | pass (20+) | pass | fixed | pass |
| Mantis Duelist | pass | pass | pass (15+) | pass (see note) | fixed | pass |
| Brood Mother | pass | pass | pass (12+) | pass | fixed | pass |
| Spire Wasps | pass | pass | pass (11) | pass | fixed | pass |
| Venom Spider | pass | pass | pass (10) | pass | fixed | pass |
| Puppet Host | pass | pass | pass (20+) | pass | fixed | fixed |
| Galvanic Beetle | pass | fixed | pass (12) | pass | fixed | pass |
| Hive Drone | pass | pass | pass (12) | pass | fixed | pass |

### Signature shapes at game size (`sil.png`)

- **Queen:** the arching gaster and the hanging sting. Her silhouette in `sil.png` is drawn from the rig layers
  without the spire wall, which is part of her figure.
- **Mantis:** the raised scythes on the tall stalk.
- **Brood Mother:** a broad leg span with a bristling, crawling back.
- **Spider:** hangs on a thread in front of its web.
- **Beetle:** a low horned shell.
- **Host:** a cloaked traveller with staff and hat.
- **Drone:** a fuzzy body hovering over a hanging ball.
- **Wasps:** a loose buzzing knot.

No two foes share a silhouette. The Spider and the Brood Mother are told apart by hanging versus standing low, and by
a long-legged basket versus a broad span with a crawling back.

### Course marks per figure

The test for every mark: which course did this, to whom, and does the bible say so.

- **Queen**
  - Lightning: the rod welded in with fused copper, with ferns branching from the entry. Ferns on the gaster, head and
    leg. Torn, burnt wings. Static at the wing tips and antennae.
  - Toxin (the one part pushed hard): the egg-laying gaster swollen past reason. Its stretched membranes show the
    stored white-violet charge and the pale eggs. Pustules, mould, venom on the mandible.
- **Mantis**
  - Lightning: ferns on the near femur and the pronotum, a fused hind knee, and small static forks between the
    scythe spines (the bible asks for "static on the scythe edges").
  - Toxin: pustules and mould on the abdomen, a fruiting stalk out of the back, the tegmina rotted through.
- **Brood Mother**
  - Toxin (pushed hard): the brood-swollen abdomen, sagging, with stretch folds and pustules.
  - Lightning: a fern across the abdomen and a fused front knee.
- **Wasps**
  - Ferns on three gasters, a burnt wing hole, torn wings, small static at two wing tips.
  - One wasp swollen with pustules, one with mould, one hollowed by a fruiting stalk.
- **Spider**
  - A fern across the abdomen, a fused knee, a burnt moth, and a bird wrapped in silk with its wing charred.
  - Pustules and mould, venom on the fang.
- **Host:** described under the section 9 notes below.
- **Beetle:** described under the director's ruling below.
- **Drone**
  - Lightning: a fern singed through the thorax fur, a fused knee, wings burnt and frayed.
  - Toxin: pustules, mould, a hole with a grub, a fruiting stalk; the nectar is venom.

Never column: no glowing outlines and no slime puddles. Venom on the ground is drawn as drops, never pools. Venom
green is a dull olive (`#6a8238`), never neon. The violet bloom is small and only appears where the bible names
stored charge (the Queen's gaster).

### Galvanic Beetle: director's ruling, logged

The bible's "arcs running along the shell seams" and "horn crackling" break lightning's Never column (sci-fi arcs).
The first build had a bolt jumping between the two horn tips and forks along the seams. All of these were removed, and
the beetle's lightning is now only lightning's marks:

- a fern burnt the length of the head horn, clipped to the horn, with the tip fused glassy;
- the elytra welded into one shell along a fused-copper suture;
- a blistered, fused plate where a strike went in, with ferns branching from it;
- ferns on the shell and the pronotum;
- bristles standing stiff on end along the suture and the pronotal seam;
- a welded hind knee;
- copper runs set hard at the margin.

The idle motion became "a low hum (bristles and antennae tremble)". The bible text is being corrected separately; I
did not edit it.

### Section 9 notes

- **Puppet Host, fixed.**
  - Remnant: a pilgrim's wide-brimmed hat with a lead ampulla pinned to the turned-up brim, a hooded cape and long
    cloak, pack and bedroll, scrip, and a walking staff with a gourd.
  - Pushed part: toxin swelled the throat and jaw into a goitre of larvae under stretched, shiny skin, with lumps
    where they move and holes where they come and go. The rest stays human weight.
  - Outline: broken by rot (holes and mould in the cloak, fruiting stalks out of the pack and shoulder).
  - Lightning: a fern from the temple down the neck, and burns on the hand and staff.
  - Face shading 0.8.
  - The first pass failed: the swelling was timid and hidden. It was enlarged, and the draw order was fixed.
- **The insects:** each is an animal the bible lists, so no human remnant is needed. The Mantis keeps the bible's
  duelling sash, with a fencer's glove as a trophy and a snapped blade lodged in it, which carries the fencing-school
  read.
- **No rim light or fog** was added to any figure; all use the Living Ink settings from `kit.foeBase`.
- **Eyes:** compound eyes appear only as anatomy (the bible gives the Queen compound eyes): faceted dark masses with
  no pupil. The spider shows two small eyes, not eight, so there is no many-eyes motif.

### Palette

The palette is chitin black, venom green and white-violet, plus ink black, bone and grey. Three bible-named
materials go beyond it:

- the copper sheen on the Spider and the Beetle (the bible names it);
- the Mantis's faded red sash (the bible names it). It is desaturated (`#7c463e`) and stained with old blood. This is
  red outside the blood, doom and rubric rule, kept because the entry asks for it. **Flag for the director.**
- the Host's dusty brown cloak (the bible names it).

The Tooth is bone. There is no gold anywhere.

### Faults caught and fixed (all re-checked on the re-render)

- **Hive Queen**
  - Head and thorax were balls. Both were rebuilt from the reviewed wasp anatomy with sutures, collar, scutellum,
    tegula, vertex ridge, kidney eye and clypeus, plus setae fringes that break the outline.
  - Gaster bands were flat stacked green blocks. They got punctures, sheen, shadow and growth lines.
  - Membranes were hidden, then read as studded collars, then poked past the outline. They are now thin stretched
    gaps inside the outline.
  - The wall read as tartan. It is now scalloped pulp courses with buttress ribs.
  - The antennae dangled to the floor (a mirrored-frame sign error).
- **Mantis**
  - Too saturated a green for "green-black".
  - Stilt legs, and the scythes were too small.
  - The prothorax was an even tube. It was widened, dilated at the front and serrated along its margins.
  - A glove edit had silently left the fingers floating. Found at zoom and fixed.
- **Brood Mother**
  - The abdomen was a ball. It is now pear-shaped and sagging, with tubercles and a crust of young.
  - Stilt legs.
  - The spiderlings were invisible, then floated off the back (a sign error). They now crust the body.
  - The egg sacs were hidden behind the abdomen.
- **Spire Wasps**
  - The legs hung in parallel rows (the stick-table fault).
  - The compound eyes read as glossy, staring balls.
  - The gaster bands were too green.
  - A flat ghost-wing polygon, and spark squiggles that read as worms.
- **Venom Spider**
  - Even-width tube legs. The femur now swells, and there are setae and patella knobs.
  - The prosoma and fangs were too small.
  - The prey read as a white egg.
  - A spark on the thread read as a worm.
- **Puppet Host**
  - The staff crossed the face.
  - A narrow column with tube legs.
  - The cloak's front panel read as a plank.
  - The face burn was a scribble.
  - The brim's upturn read as a horn.
- **Galvanic Beetle**
  - Stilts.
  - The elytra read as a smooth dome. Fixed with a humeral and an apical callus, dents, the epipleural rim, a curled
    flake, a hollowed hole, fruiting stalks and bristles.
  - The mould read as a pale disc.
  - Arcs (the ruling above).
- **Hive Drone**
  - The gaster plates read as a barcode. Rebuilt as banded fur over the creases between segments, with sternites.
  - The collar was a flat sticker.
  - The edge locks were sawtooth spikes.
  - The tongue read as a leg.
  - The wing base read as a grey slab.

## Pose tests (`out/worlds/X/<key>_pose.png`)

Every part stays attached in every test, and no joint tears open.

| Figure | Attack tested | Result |
|---|---|---|
| Hive Queen | Sting strike: gaster chain `abdomen_1..3` lifts and curls, `sting` drives down toward the party; head dips, mandible opens | Pass. Plates overlap through the chain. |
| Mantis Duelist | Double scythe strike: both femora swing forward and down, the tibiae unfold, the prothorax bows | Pass |
| Brood Mother | Venom bite: body lunges, chelicerae open, front legs reach | Pass |
| Spire Wasps | Stinging swarm: the lead stingers dive, the wings beat | Pass |
| Venom Spider | Drop and bite: thread swings, body pitches down, chelicerae open | Pass. See the IK note on the hind legs. |
| Puppet Host | Jerking staff swing: near arm up and over, torso twists | Pass. See the z-order note. |
| Galvanic Beetle | Horn ram: head dips, body lunges | Pass |
| Hive Drone | Feeding: head dips, tongue reaches, wings beat | Pass |

## Open items (for the director and for rigging)

- **Holds that need IK:**
  - Venom Spider: the hind tarsi on the dragline, whenever the thread or abdomen rotates.
  - Hive Queen: all six claws hooked into the wall, whenever her body moves.
  - Brood Mother, Galvanic Beetle and Mantis Duelist: planted claws need foot locks on their lunges.
  - Hive Drone: the mid and hind tarsi on the nectar bolus, if the legs animate. The bolus is parented to `body`.
  - Puppet Host: the staff is held one-handed, so it needs no IK.
- **Z order:** in the Puppet Host's swing, the staff passes behind the hat brim. That frame needs a z-index
  override.
- **Static forks:** the Wasps', Drone's, Mantis's and Queen's lightning still includes small ink-cored static forks,
  because their bible entries ask for static, crackling or buzzing. The beetle ruling may apply to them as well. If
  so, they convert the same way: replace each fork with a fern, fused tip or standing setae.
- **Mantis:** the prothorax is very long, because a 2.0-tall upright mantis needs it. It reads as the signature, but
  the director may want a shorter stance.
- **Brood Mother:** her abdomen is still one large rounded mass under the crawling crust.
- **Hive Queen:**
  - The thorax still reads as a rounded mass when zoomed out.
  - The near wing is close to a plank in silhouette.
- **Mantis sash:** red outside the blood, doom and rubric rule, as noted under Palette.

## Independent review (2026-11-23)

A second reviewer judged the batch fresh against GUIDE.md (sections 8 and 9), LOGIC_CHECKLIST.md, bible 00 (the
lightning row) and the eight original World X entries. The reviewed references were the Drowned King (the ruler bar),
the Pit Crawler, the crab legs in worlds III and VI, and dirAC and dirAC2. Every figure was rendered on its own and
composited on a mid-dark ground. I zoomed 1.4 to 2x on the heads, mouthparts, scythes, legs and feet, and checked each
figure at sheet size and at game size. Each changed figure then got a rig re-export and a new attack pose test.

This section supersedes the maker's "Open items" above where the two differ. The static forks are gone, the Mantis is
rebuilt, and the Queen and Brood Mother faults are fixed.

### Director's rulings (recorded)

1. **Static.** No forks or sparks are drawn in the air on any figure. Lightning shows only in three ways:
   - branching white-violet burns on chitin or skin;
   - fused plates and joints;
   - standing bristles or hair.

   The Wasps, Drone, Mantis and Queen were converted the same way the Galvanic Beetle was. `grep "X.stat("` on
   `world_X.js` now returns nothing. The helper stays in the kit but is unused.
2. **The Mantis's sash stays.** It is the remnant of the duellist the Mantis took, but it must read as stained with old
   blood, not as a decorative red. It is now faded toward dust grey (`#6e665c` mixed in at 55 percent). The red read
   comes only from patchy brown-black blood: soaked blotches, a crust at the knot, and a dried run down one tail. The
   tails' ends are grimed from the ground.

### What I changed

- **Mantis Duelist: rebuilt.** It was the thin green pole the director named: a 660 px even-width prothorax on stilts.
  - **Body.** A deep meso- and metathorax with two raised notal plates (rims of thickness and a suture), coxal plates
    and spiracles. A heavy abdomen of seven overlapping tergites sags behind the thorax under leathery tegmina; the
    tegmina have a costal vein, cross-veins, a stigma, the smoky hind-wing fan showing beneath, rot holes and a burnt
    torn tip.
  - **Prothorax and head.** The prothorax is now 390 px, thick at its base and tapering. It flares into a shield-like
    supracoxal collar with a toothed margin and a raised rim. The triangular head is tilted politely; it has big
    compound eyes at its upper corners standing past the head line, ocelli, frons, clypeus and labrum, crossed mandibles,
    palps hanging plumb, and a venom bead.
  - **Raptorial legs.** New `raptFemur`: a deep blade with a muscle bulge, a spined keel with long and short spines, a
    grooming brush, a tibial groove and knee lobes. New `raptTibia`: a curved blade with a spine row, a terminal hook and
    a spur. The near femur stands upright before the face in the salute, with its tibia folded back along the keel. The
    far scythe is angled forward, so the two cross like blades.
  - **Walking legs and course marks.** The walking legs are thick-based and planted (w 54 near, 46 far; tibia 1.35x).
    Lightning: ferns on the femur, coxa, pronotum and thorax; scythe spine tips fused glassy; setae standing along both
    cutting edges; a fused hind knee. The snapped blade now sits in a crust of old blood.
- **Venom Spider.**
  - **Body.** The abdomen is 1.32x larger and the cephalothorax 1.75x larger. Both are furred with hair breaking the
    outline. The carapace has venom-green side bands, a fovea, radiating grooves, an eye mound and a burn fern. The
    abdomen's copper chevrons are edged venom green, with green flecks, two burn ferns, pustules and mould.
  - **Legs, chelicerae and thread.** The legs are thicker (44 near, 34 far), with setae on every segment and knobs at
    the patella and the tibia-metatarsus joint (a new `fur` option on `sleg`). The chelicerae are big and hairy, with
    long fangs and venom. The spider was lifted 140 px so that it hangs well clear of the ground: at first the fang and
    two tarsi touched the ground line and it read as standing. The dragline is doubled and thicker, with knots of
    re-spun silk.
- **Hive Queen.**
  - **Gaster.** Rebuilt as six separate tergites over a stretched intersegmental membrane. Where she is most swollen
    (the middle segments, on the outer curve) the plates are pulled apart: the membrane shows wide, pale violet-grey and
    striated, with eggs, tracheae and a dull violet glow deep inside. On the inner curve the plates still overlap. Each
    tergite has a bowed rear lip with its thickness in shadow, a worn bright edge, a venom-green hind band, punctures and
    a lit crown. The sternites are separate, with a stretched pleural strip between them and the tergites. The neon
    white membrane bars are gone.
  - **Wings.** A new kit helper, `cellWing`, builds a wing cell by cell from translucent panes:
    - veins scale with the wing's size;
    - cells are closed toward the front and open toward the margin;
    - a stigma sits on the leading edge;
    - torn-out cells are real holes with frayed rims;
    - the trailing margin is ragged;
    - one cell is burnt through.

    The wings now spread over the wall, where they can be seen. Before, the plank-like near wing lay behind the gaster.
  - **Thorax.** Built from distinct plates over dark sutures: the pronotal collar, mesoscutum (with furrows), scutellum,
    metanotum, propodeum (with a median furrow) and mesopleuron. Each plate has a rim and punctures.
  - **Static.** Removed from the rod, the wing tips, the Tooth and the antennae. The antenna tips are now fused glassy,
    with bristles standing along the scape.
- **Brood Mother.**
  - **Abdomen.** Reshaped so its weight pools low and to the rear: a flatter top, a sagging rear lobe, and the belly
    about 20 px off the ground. The swelling has cracked the dorsal shield into five separate plates (with rims, sigilla
    and a chevron each). They ride on a bare, pale field of stretched skin with striations and veins. Six deep folds
    crease the hanging belly.
  - **Young and sacs.** The young are a bed of small ones, with larger ones in clumps over the plates and a stream down
    her rear. The egg sacs are now teardrops drawn up to their silk, not balls. Her near legs carry the new leg setae.
- **Spire Wasps.**
  - The two `spark` forks are now singed wing-tip edges and stiff standing setae on the mesosoma.
  - The gaster burn ferns are now clipped inside the gaster and run along it. Before, one ran off the outline into the
    air and read as a spark.
- **Hive Drone.** The wing-tip fork is now a singed tip with a small fern on the membrane, and the thorax fur stands
  stiff along the singed fern.
- **Puppet Host and Galvanic Beetle.** I re-checked both; neither needed changes. Their rigs were re-exported because
  the kit changed.

### Gate 1: logic audit (independent)

Item key as in the maker's table above.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Fix |
|---|---|---|---|---|---|---|---|
| The Hive Queen | pass | n/a | pass | pass | fixed | pass | 5: the near wing lay behind the gaster and read as a plank attached to nothing visible. It is now rooted under the tegula and spread over the wall. |
| Mantis Duelist | fixed | fixed | pass | fixed | fixed | pass | 1: a 660 px tube prothorax, replaced by a tapered 390 px prothorax on a deep thorax. 2: the folded tibiae now clear the eye by about 25 to 60 px, with nothing crossing the face. 4: the body mass is now over four planted legs. 5: the wings root at the mesothorax; the sash wraps the thorax on `body` (it was on `prothorax`); the glove hooks the knot. |
| Brood Mother | pass | n/a | pass | pass | pass | pass | none |
| Spire Wasps | pass | n/a | pass | n/a | fixed | pass | 5: a burn fern ran off the gaster into the air. It is now clipped to the body. |
| Venom Spider | pass | n/a | pass | fixed | pass | pass | 4: the fang and two tarsi sat on the ground line, so it read as standing, not hanging. It was lifted 140 px on its thread. |
| Puppet Host | pass | pass | pass | pass | pass | pass | none |
| Galvanic Beetle | pass | n/a | pass | pass | pass | pass | none |
| Hive Drone | pass | n/a | pass | n/a | pass | pass | none |

### Gate 2: style and detail (independent)

| Figure | Sil | Course | Grit | Palette | Faults | Section 9 | Fix |
|---|---|---|---|---|---|---|---|
| The Hive Queen | pass | fixed | pass (20+) | pass | fixed | pass | Course: removed four static forks; glow kept only inside the membrane, where the bible names stored light. Faults: the striped-pipe gaster (now plates over stretched membrane), the plank wing (now `cellWing`), and the rounded thorax mass (now six plates). |
| Mantis Duelist | fixed | fixed | pass (15+) | fixed | fixed | pass | Sil: it read as a pole at 190 px; it now reads as a heavy mantis with crossed raised scythes. Course: four static forks became fused spine tips and standing setae. Palette: the sash was a decorative red; it is now dust grey with old blood. Faults: the tube prothorax and stick limbs, plus two pale rings (the tegmen stigma and the fused knee) that read as eyes and were redrawn. |
| Brood Mother | pass | pass | pass (14+) | pass | fixed | pass | Faults: one rounded abdomen mass, now a sagging shape with cracked plates, stretched skin, folds and clumped young; egg sacs that read as balls, now teardrops. |
| Spire Wasps | pass | fixed | pass (11) | pass | pass | pass | Course: two static forks converted, and the burns clipped to the body. |
| Venom Spider | fixed | pass | pass (12) | pass | fixed | pass | Sil: it read as a crane fly at sheet size; it now has a heavy body and reads as hanging. Faults: thin tube legs (now thick, hairy and jointed) and a buried prosoma with small fangs. |
| Puppet Host | pass | pass | pass (20+) | pass | pass | pass | none |
| Galvanic Beetle | pass | pass | pass (12) | pass | pass | pass | none (re-checked: no arcs, low planted stance) |
| Hive Drone | pass | fixed | pass (12) | pass | pass | pass | Course: the wing-tip fork became a singed tip and standing fur. |

### Rigs and pose tests (re-run)

- **Rig export.** All eight figures were re-exported with `render_rig.js`. None reports MISSING JOINTS, and every
  `rig.json` carries `ground` = canvas h - 30 (1570, 1370, 1370, 1070, 790, 1070, 790, 790).
- **Mantis Duelist**, double scythe strike: prothorax -10, head -8, femur_n -38, tibia_n -55, femur_f -22,
  tibia_f -45. Both scythes swing forward and the tibiae unfold. Every joint stays closed. Pass. At larger angles the
  scythes leave the elite canvas, so the game must draw past the canvas edge.
- **Venom Spider**, drop and bite: body -14, chelicerae open, palps and front legs reach. Pass. The hind tarsi leave the
  dragline as the body pitches (an IK hold, as the maker logged).
- **Hive Queen**, sting strike: abdomen_1 +3, abdomen_2 -5, abdomen_3 -12, sting -16, mandible open. The sting drives
  down. The plates stay overlapped and there are no tears. Pass.
- **Brood Mother**, venom bite: the body lunges, the chelicerae open and the front legs reach. Pass. The planted claws
  lift without foot locks (IK, as logged).
- **Spire Wasps**, stinging swarm: the lead wasps dive and the wings beat. Pass.
- **Hive Drone**, feeding: the head dips and the wings beat. Pass.
- **Puppet Host and Galvanic Beetle**: the art is unchanged, and the maker's pose tests stand.

### Still open

- **Hive Queen, gaster crop.** Her gaster layers are clipped at the top of the ruler canvas. Any rotation that lowers
  them shows the straight cut edge at the frame top. Keep `abdomen_1` within about 3 degrees, or export those layers
  from a taller canvas.
- **Hive Queen, head.** The head still reads mostly as one dark dome dominated by the kidney eye. It is not a listed
  fault, but it is the weakest part of the ruler next to the Drowned King.
- **Mantis Duelist, legs.** The mid and hind tibiae are long, as on a real mantis, though thick and jointed. At 2.0 tall
  and upright, the body cannot sit lower without losing height.
- **Galvanic Beetle.** The elytra outline is still close to a smooth ovoid in silhouette. The surface detail carries it,
  but it would take a stronger shoulder and apical callus in the outline.
- **Unchanged from the maker's list.** The IK holds and the Puppet Host z-order note.

## Final consistency pass (2026-11-25), section A4 (added by the I-VII / section A agent)

Hive Queen: the `spire` bone is optional. Variant module `worlds/world_X_nospire.js` (helper `worlds/kit_variant.js`)
builds the same figure and drops every rig run drawn on `spire` (wall, floor, rod); the `spire` joint stays as an empty
root pivot, so bone names, parents and motion keys are unchanged. Render `out/worlds/world_X_nospire_hive_queen.png`,
rig `out/rig/worlds/world_X_nospire_hive_queen/rig.json` (flag `variant.optional_bones: ["spire"]`, use in hive_boss),
note `out/worlds/X/hive_queen_optional_bones.json`. world_X.js itself was not edited. Re-run after any change to
world_X.js: `node render.js worlds/world_X_nospire hive_queen && node render_rig.js worlds/world_X_nospire hive_queen`.

## Final consistency pass, section B (2026-11-25)

Coordinated with the section A agent: only the Hive Queen's head drawing was edited; the `spire` bone and its art are
untouched. The `world_X_nospire` variant was re-rendered and re-rigged after the head change.

| Figure | Item | Fix | Result |
|---|---|---|---|
| The Hive Queen | head one dark dome dominated by its eye | The compound eye is smaller (40 x 98 from 64 x 146), set back on the side, notched where the antenna sits, duller, with a socket groove behind it. The green clypeus no longer carries a dark spot (it read as a second, green eye): it is a flat toothed plate with a median keel and a lit upper edge. The capsule is built of plates with their own values: a lit frons plate with paired venom stripes (not dots), a darker gena with a lit rim and cheek hairs, sutures as grooves with lit lips, raised antennal sockets, a temple tone and the occiput's rim. | improved; at 0.3x no eye dominates and the head has planes. Weak spot: it is still a dark mass overall, partly crossed by the antennae |
| Galvanic Beetle | elytra outline near a smooth oval | The shell's landmarks now break the outline: the humeral callus standing up behind the pronotum, a saddle over the back, the apical callus as a second bump before a steep declivity (darkened), a sutural spine at the apex, a sinuate lower margin with a rotted bite (mould on its edge), the lateral keel line, and a larger peeled flake at the rear. | pass at 0.3x |

Rigs re-exported (no MISSING JOINTS); poses: Queen sting (`abdomen_1..3 -8/-12/-14, head 8, mandible_n -18`), Beetle
ram (`body -4, head 12, leg_n1 -8, leg_f1 -6`): attached. Per-figure copies in `out/worlds/X/` refreshed; sheet and sil
rebuilt (scratch `wX/sheet.py`).
