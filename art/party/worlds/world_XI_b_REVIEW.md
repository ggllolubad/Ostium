# World XI, The Stilled Spire, second batch (XI_b): review

Frost + Lightning (Lockdown). Scope: the eleven entries added to `bible/world_XI_stilled_spire.md` on 2026-11-23. Files:
`worlds/world_XI_b.js` and `worlds/kit_XI_b.js`. The kit requires `kit_XI` (the first batch's kit) and re-exports it,
and it borrows reviewed anatomy helpers from `kit_IX`. No file of the first batch and no shared file was edited.
Sheet script: `worlds/sheet_XI_b.py`. Outputs: `out/worlds/world_XI_b_<key>.png` and `_sil.png`, rigs in `out/rig/worlds/world_XI_b_<key>/`, poses in
`out/worlds/XI_b/<key>_pose.png`, `out/worlds/XI_b/sheet.png`, `sheet19.png` (all 19 plus the Thrall) and `sil.png`.

| Key | Name | Tier (bible scale) | Canvas | Seed | Measured |
|---|---|---|---|---|---|
| the_stilled_college | The Stilled College | ruler 3, frame-cropped | 1800 x 1600 | 1120 | The surge is about 3.0 tall (1.24 vertical stretch past the canvas). The crest and its arms run out of the top. Men are 0.9 to 1.1 scale. |
| the_great_refractor | The Great Refractor | ruler 4.5, frame-cropped | 2200 x 1600 | 1121 | The tube is 1890 px long (3.0 humans) and lies nearly level. The pier and counterweight run out of the top. The assistant is a 1.0 human on the ladder. |
| the_gin_ox | The Gin Ox | elite 1.9 at the hump | 2300 x 1400 | 1122 | 1.91 at the hump and 2.6 long. The canvas was widened under the true-size rule. |
| the_rodwarden | The Rodwarden | elite 2.0 | 1300 x 1500 | 1123 | 1.7 to the crown when bent, 2.25 to the rod tips. The canvas was heightened. |
| ephemeris_clerk | Ephemeris Clerk | human 0.95 | 760 x 820 | 1124 | 0.9 when bent. The canvas was widened for the paper fan. |
| college_tortoise | The College Tortoise | small 0.3 | 600 x 820 | 1125 | 0.3 to the top of the dome, 0.75 long with the neck. |
| the_patroness | The Patroness | human 1.0 | 900 x 820 | 1126 | 1.0 to the headdress roll, 1.2 to the horn tips. The canvas was widened for the spyglass. |
| patroness_monkey | The Patroness's Monkey | small 0.4 | 600 x 820 | 1127 | 0.36 crouched, 0.45 to the tail hook |
| speculum_bearer | Speculum Bearer | large 1.4 | 1300 x 1100 | 1128 | The man is 1.1 bent double and the disc 1.3 wide. The canvas was widened. |
| clock_jack | Clock Jack | human 1.05 | 800 x 940 | 1129 | The jack is 1.05 on top of a 0.12 plinth. The canvas was heightened. |
| gate_mastiff | Gate Mastiff | large 1.2 long | 1300 x 1100 | 1130 | 1.2 long, 0.75 at the withers |

Every figure is drawn facing right with foeBase and flipped (`flip: true`). Each rig.json carries `groundY` = canvas h - 30:
1570, 1570, 1370, 1470, 790, 790, 790, 790, 1070, 910, 1070. No export reports `MISSING JOINTS`.

## Decisions logged
1. **No eye motifs** (XI is not a void world):
   - **Speculum:** seen at a steep angle as a tilted ellipse, never face-on. It shows the room it reflects: a pale lancet
     window with mullions, a dark vault rib, a bright sheen band and the dark floor. It is frost-blind from the upper
     rim, cracked once across, dented and burned. Its centre is the pale window, with nothing dark and round in it.
   - **Refractor objective:** seen nearly edge-on inside the black dew cap. It is a narrow pale frosted sliver with the
     room's window in it, cracked once. The brass cell shows only on its near rim.
   - **The Refractor's setting circle:** has a squared hub boss.
   - **The monkey's astrolabe:** has open almucantar arcs and a squared wedge pin, with no closed ring at the centre.
   - **Spectacles:** frosted solid white, with no pupils.
   - **Animal eyes:** small, dark, set under a heavy brow and filmed with frost (ox, mastiff, tortoise, monkey).
2. **Windward** is the front (drawing right), as in batch one. Rime sits on the front and top faces. Icicles are always
   drawn in screen space, so they hang plumb.
3. **"Rime so thick it reads like bark"** (the Rodwarden and the ox) is a new `rimeBark()`: a deep crust with broken
   longitudinal grooves and cross-checks. The first try, a row of white tiles, was rejected (see the fixes below).
4. **Frozen hair and fur** has two new helpers in `kit_XI_b`:
   - `bristleRidge()` draws standing spikes, each with a rime tick, along spines, tails, scalps and the monkey's halo.
   - `furPlates()` draws faceted shards of hide.
   No hair is drawn as parallel stripes.
5. **Numerals read true after the flip.** The tortoise's years and wager number and the clerk's slate are mirrored at
   draw time, because the game shows the figure flipped.
6. **The Gin Ox's beam** runs from the yoke toward the viewer and down to the floor (diagonally across the near
   shoulder), because "sideways from its shoulders" is toward the camera in this side view.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Stilled College | pass | fixed | pass | pass | fixed | pass |
| The Great Refractor | pass | pass | fixed | pass | fixed | pass |
| The Gin Ox | pass | n/a | n/a | pass | pass | pass |
| The Rodwarden | pass | n/a | pass | pass | pass | pass |
| Ephemeris Clerk | pass | pass | pass | pass | fixed | pass |
| The College Tortoise | pass | n/a | n/a | pass | pass | pass |
| The Patroness | pass | pass | fixed | pass | pass | pass |
| The Patroness's Monkey | pass | n/a | pass | fixed | pass | pass |
| Speculum Bearer | pass | n/a | pass | pass | fixed | pass |
| Clock Jack | pass | n/a | fixed | pass | fixed | pass |
| Gate Mastiff | pass | n/a | n/a | pass | pass | pass |

### Measurements behind the passes
- **Grips.** Every gripping fist goes through `B.grip`. The renders print no `grip ... move the elbow` warning. The
  College's `quiet` grips (the mace and the instruments) were re-run with warnings forced on, and none printed.
- **Rodwarden.** The near arm runs straight from the shoulder to the pole. The fist is square to the near-vertical
  pole, and the forked foot is planted on the ground line. His weight is split between the straight rear leg and the
  pole, as the bible asks. The far hand hangs, with two fingers burned off to stumps (`openHand` cut fingers).
- **Patroness.**
  - Spyglass: its axis starts at her near eye and runs level to the party. The eyepiece is at her eye, the cheek is
    pushed up and the lid squeezed shut.
  - Grips: the far fist is square to the glass. The near fist is on the hip as an inline grip, with the cuff toward the
    elbow.
- **Clerk.**
  - Gaze: the head is bowed (0.7 rad) over the slanted desk top, which shows us only a sliver of the page. His face is
    toward the page.
  - Quill: held in a fist square to the forearm, with the nib down and a black ink icicle hanging plumb from it.
  - Weight: on the heels, the knees soft.
- **Bearer.**
  - Stance: a long stride. The front knee is over the planted foot (in sacking), and the rear leg drives.
  - Load: the disc sits over his back between his feet.
  - Hands: both fists grip the straps at the chest.
- **Clock Jack.** It stands square on the plinth top (its own ground line, y 826). The hammer fist is square to the
  handle, and the bell hangs from a scroll bracket bolted to the plinth.
- **Animals.**
  - Legs: each is three overlapping segments, with a bony elbow or hock point, a sloped pastern and a weight-bearing
    hoof or paw on the ground line (`kit_XI_b.quadLeg`, after the Magma Hound).
  - Ox: the raised forefoot is mid-stride.
  - Tortoise: three feet are planted and the near forefoot is raised.
  - Mastiff: the forelegs are planted ahead, and the hindquarters are low and loaded against the chain.
- **Refractor.**
  - Assistant: stands on the ladder platform. His brow is welded to the eyepiece cup, his near fist is on the
    slow-motion handle's oak grip, and his far fist is on the focus knob collar.
  - Structure: the clamp bands wrap the tube and the cradle sits on the pier.

### What failed and how it was fixed
- **Refractor 3:** the assistant's far hand was an open hand floating at the eyepiece. It is now a `B.grip` fist on the
  focus knob collar.
- **Refractor 5:** the tube was a flat-sided parallelogram with straight seams (a flat front). Every section, flange
  and seam is now a ring that bulges toward the viewer. A lit band runs along the top, the underside turns into shadow,
  and the rear cap rounds away.
- **Patroness 3:** the near fist floated off the hip at the end of a long arm. The wrist was moved onto the hip at the
  girdle line.
- **College 2/5:**
  - The torn star chart ran as a long snake through the mass. It is now a short pale parchment strip wound round four
    buried arms that stand together in a cluster.
  - The dean's face was hidden behind other men's arms. He is drawn later in the order, leaning out over the men below,
    and his forked beard is drawn over his own arm.
- **Clerk 5:** the waist strap ran to empty space behind the back. It now runs round the body.
- **Clock Jack 3/5:**
  - The hammer arm crossed the face. The elbow was moved out and back, and the hammer is cocked behind the head.
  - The counterweight hung from nothing. It now hangs from a hook cast on the plinth's back end.
- **Bearer 5:** the disc was drawn over his head. The disc now sits behind the body, and the frame, the straps and the
  fused join come after it.
- **Monkey 4:** the first crouch had long thin stilt legs and stood too upright. The legs are now folded under a lower
  pelvis, and the feet are shorter and planted.

## Gate 2: style and detail

| Figure | Signature at 190 px | Course marks / Never absent | Details (min) | Layers | Palette | Unique silhouette | Section 9 |
|---|---|---|---|---|---|---|---|
| The Stilled College | pass: a leaning wave of gowned bodies with a forest of pointing arms | pass | 24 (12) | pass | pass | pass | pass |
| The Great Refractor | pass: a long tube laid level across the frame on a pier | fixed | 26 (12) | pass | pass | pass (unlike the Last Hour's disc) | pass |
| The Gin Ox | pass: a low ox with its head down and a beam across the shoulder | pass | 18 (10) | pass | pass | pass | pass |
| The Rodwarden | pass: a fan of rods above a bent figure on a pole | fixed | 17 (10) | pass | pass | pass | pass |
| Ephemeris Clerk | pass: a chest desk with a fan of pages like a wing | pass | 13 (6) | pass | pass (rubric column rules) | pass | pass |
| The College Tortoise | pass: a high dome, a raised foot, the neck out | pass | 11 (6) | n/a (animal) | pass | pass | pass |
| The Patroness | pass: a horned headdress and a levelled spyglass | pass | 14 (6) | pass | pass | pass | pass |
| The Patroness's Monkey | pass: crouched, a hooked tail, a brass disc | fixed | 10 (6) | pass | pass | pass | pass |
| Speculum Bearer | pass: a bent man under a great disc | fixed (eye) | 12 (6) | pass | pass | pass | pass |
| Clock Jack | pass: a stiff carved man with the hammer up, the bell, a plinth | pass | 13 (6) | pass | pass | pass | pass |
| Gate Mastiff | pass: an open-jawed dog at the end of its chain | pass | 10 (6) | n/a (animal) | pass | pass (unlike the ox: an open jaw, a chain, no beam) | pass |

### Detail inventories
- **The Stilled College:**
  - The men: 21 whole scholars plus 11 arms of men buried in the mass, plus 4 fallen bodies in the base. Each man has
    his own face (8 face sets plus jitter), build, lean, scale (0.93 to 1.07 times his rank), beard (long, forked,
    short, stubble or none), gown and hood shade, cap tilt, and on some a patch or an ink horn.
  - Pale blue hoods thrown back and rimed. Square caps frozen on at odd angles, with icicles.
  - Faces frozen open-mouthed with blue lips. Spectacles frosted white on several faces.
  - Ink horns with black ink icicles.
  - The cracked brass lectern on the crest, its chained book frozen open.
  - The dean's college mace: a scorched, crowned brass head on an ebony staff.
  - Instruments fused into hands: an astrolabe, a quadrant and dividers.
  - The chalk slate with a half-finished sum (1477 + 388, the answer begun). The hourglass with the sand stopped
    mid-fall.
  - The torn star chart wound round four arms.
  - Oak bench splinters, a fallen candle-stand with its candle and drip pan, and one bare foot without its shoe.
  - Ice planes like broken flagstones over the pressed bodies at the base, and frozen gown folds through the mass.
  - Burns branching across forearms and running from body to body. Icicles under the overhanging crest.
- **The Great Refractor:**
  - The tube: four riveted tapering sections with flanges and bolts, plate seams round it, dents and scratches. Burns
    branch from the mount to the lens. Bark-thick rime runs along the top and a fringe of about 46 icicles along the
    underside.
  - The black iron dew cap, hung with icicles, with the frosted, cracked objective edge-on inside it.
  - The finder scope on two straps.
  - The eyepiece drawtube, its focus collar with oak knobs, and the black cup.
  - The declination cradle with clamp bands and fused rivets. The gear train fused into one scorched lump with beads.
  - The brass setting circle engraved with degrees.
  - A hand-wheel with a worn oak grip.
  - The riveted cast-iron pier with ribs and the maker's plate.
  - The lead counterweight drum on its iron arm.
  - The glass-fronted drive case with three wheels and a governor behind frosted glass.
  - The oak ladder with rungs worn hollow and iron wheels.
  - The dome-shutter chains hanging slack.
  - The assistant:
    - quilted coat, fingerless mittens and boots;
    - scarf frozen sideways, with frayed ends;
    - log board on a cord;
    - dark lantern with its shutter shut;
    - hair standing up in frozen spikes, a burn on the neck, and his brow welded to the cup.
- **The Gin Ox:**
  - Hide and anatomy: frozen fur plates; bark-thick rime on the front; the bristle ridge along the spine with icicles;
    icicles from the dewlap, belly and muzzle; burns from the neck over the shoulders; the old whip scar on the rump.
  - Horns: the near one with its brass cap; the far one scorched black, its cap missing.
  - Head: the leather head collar and noseband with brass rosettes, and the halter rope gnawed through and frayed.
  - Bell: a cow bell at the throat, its clapper frozen out to the side.
  - Yoke: the oak neck-yoke with end grain and pins, an iron bow welded at the yoke, and the tug-chain trailing.
  - The broken sweep beam with six brass tally plates notched for thousands of turns, and its splintered end dragging.
  - The sacking blanket frozen stiff, with a darned patch.
  - Iron-shod hooves with ice packed in the cleft, and a switch tail frozen stiff.
- **The Rodwarden:**
  - The back-frame and its rods: an oak frame with a riveted seat; twelve iron rods with scorched brass points, tied
    with twine lashings.
  - Pole: the grounding pole with a forked foot and a brass grip, and the hand welded to it.
  - Coat: a waxed canvas storm coat with a sheen and stains, and bark-thick rime down the windward side.
  - Harness: a leather harness with a chest ring and iron hook, and a sheet of lead flashing tucked in, dented.
  - Kit: a coil of braided cable over the shoulder with its end trailing; a hammer and a bag of staples at the belt.
  - Hands: a wool mitten with the palm burned through, and two cauterised finger stumps.
  - Feet: roofer's boots with iron cleats, and an iron chain wrapped round the ankle and dragging.
  - Head: Lichtenberg scars on the face, neck and hand; the scalp scarred bare in patches; frozen hair spikes with
    icicles; a leather strap clenched in his bared teeth.
- **Ephemeris Clerk:**
  - The slanted desk: oak side panel, brass corner fittings, a drawer pull, a frozen ink spill, and a lead weight on
    the page.
  - The fan of six ruled paper tables, each with rubric column rules and figures, rimed.
  - Kit: an ink horn on a cord with frozen ink; a counting board with beads; a pen-knife in a sheath.
  - Dress: a short black gown with a patch and a worn hem; a pale blue sleeve garter; ink-stained cuffs; a fingerless
    mitten.
  - Head: a felt cap with three spare quills in the band, frosted spectacles, and lips parted on a number.
  - Feet: rag-wrapped felt slippers.
  - The burn from the desk's brass corner, and the hand welded to the quill.
- **The College Tortoise:**
  - The brass plate with the college arms, fused at the rivets and welded.
  - The masters' years in a column, the oldest two flaked away.
  - The chalked wager number, half rubbed out.
  - The scorched black seams between the scutes, growth rings and worn areolae.
  - The drilled rear hole with a frozen tether cord, and a chip out of the front rim.
  - A lettuce leaf frozen in the beak, and frost on the lids.
  - Scaly legs with blunt claws and ice between them, and the raised foot hung with icicles.
  - The star-chart scrap frozen to the underside.
- **The Patroness:**
  - Dress: a pale blue velvet houppelande gone grey in blotches, with crushed pile and a wine stain.
  - Sleeves: deep dagged hanging sleeves frozen plumb, with icicles.
  - The train frozen in a sweep, with frost on its hem.
  - Fur: grey frosted fur trim at the collar, hems, cuffs and sleeves.
  - Girdle: a girdle of six brass plaques, one fused.
  - Hanging from the girdle: a pomander of pierced brass, burned; a chatelaine of three keys; a fat purse.
  - Hands: rings over the glove, one fused through it.
  - The horned headdress: brass net with knots over two padded horns, a roll with a lozenge brooch, and a veil, all
    rimed.
  - The spyglass: three draws with collars and a shagreen grip, burned and dented.
  - Face: rime thick in the folds of the neck, a plucked brow, jowls, and a pursed mouth.
- **The Patroness's Monkey:**
  - The astrolabe fused into its chest: a pierced rete, an alidade and a throne.
  - The velvet collar with a broken brass chain and a tiny bell.
  - The embroidered jacket with one sleeve torn off and a burn hole.
  - A sugared almond in the cheek, a ring on its toe, and a bald patch on the tail.
  - Frost in the whiskers. The fur halo standing out from the strike.
  - Icicles from the elbows and chin, and burns over the arms and belly.
- **Speculum Bearer:**
  - The speculum: reflecting the room, frost-blind from the rim, cracked, dented, burned, with a rim thickness and
    about 18 icicles.
  - The oak crossed carrying frame with iron end caps.
  - The padded straps and rope lashings, and the stuffed leather shoulder pad.
  - The quilted jerkin with a patch.
  - Rags wound round both shins, and one foot in sacking with cords.
  - The polishing cloth and the pumice bag.
  - The skin grown up over the frame boss, welded, with burns over the shoulders.
  - Head: a felt cap, a broken nose, frost in the stubble, and a frozen breath.
- **Clock Jack:**
  - The painted check surcoat flaking to bare oak, its carved pleats, and the side plane of the carved block.
  - The carved breastplate: painted rivets, the observatory's arms (a dome and a star) carved on the chest, and old
    nail holes.
  - The grain splits with rime packed in them.
  - The fused, scorched shoulder pin with a weld, and the iron elbow pins.
  - The wooden kettle hat painted brass, flaking and burned.
  - Head: a painted moustache, round cheeks, and the grim line.
  - The hammer: an iron head with a strap and rivets.
  - The bell on a wrought scroll-bracket.
  - The iron plinth: a cornice, cast scrolls and the maker's plate.
  - The drive rod with its crank, and the counterweight on a chain.
  - A bird's nest wedged behind the knee.
- **Gate Mastiff:**
  - The spiked iron collar fused to the chain with a weld, and the brass name plate.
  - The chain running back under the body to the iron staple torn from the gatepost (oak splinters still on it).
  - A pilgrim's torn shoe caught in the links, and a gnawed bone under the forepaw.
  - Bite scars on the muzzle and an old bite scar on the flank.
  - The frozen breath as a jagged beard of icicles, and ice crusted on the teeth.
  - Fur plates, the bristle ridge along the spine and tail, and burns from the collar over the chest.

### Course marks
- **Frost (dominant).** Rime crusts sit on every windward front and top. On the Rodwarden and the ox they are
  bark-thick. Icicles hang plumb from hems, sleeves, elbows, rims, chins, muzzles, beams and tubes. Fur and hair are
  frozen in faceted plates and standing spikes. Bodies and cloth are stopped mid-motion:
  - The Clerk's quill, mid-figure.
  - The ox's raised forefoot and the tortoise's raised foot.
  - The Patroness's dagged sleeves frozen plumb and her train frozen in a sweep.
  - The assistant's scarf frozen sideways.
  - The College's arms.
  - The monkey frozen mid-flight.
  - The mastiff's bark.

  The Never column holds: no clean crystals and no snowflakes.
- **Lightning.** Aurora-green Lichtenberg burns branch over skin and brass. Fused rivets, beads and welds appear where
  the strike passed:
  - fused joins: the desk corner to the clerk's fingers, the spyglass to the glove, the astrolabe to the monkey, the
    speculum to the bearer's back, the shoulder pins, the yoke, the collar, the tortoise's plate, and the Refractor's
    gears;
  - hair stood up and frozen: the Rodwarden, the ox, the mastiff, the monkey and the assistant.

  The Never column holds: no glowing outlines and no arcs. `bolt()` is never called, under the 2026-11-23 ruling.

### Section 9 (Bloodborne adapted): which course did this, to whom, and does the bible say so?
- **The former self stays readable.** Each figure keeps the remnant of its trade:
  - the clerk's desk and quill;
  - the porter's straps and pad;
  - the jack's hammer and bell;
  - the rod-keeper's rods, harness and pole;
  - the gin ox's yoke and tally plates;
  - the Patroness's houppelande and spyglass;
  - the monkey's collar and jacket;
  - the college's gowns, hoods, caps and instruments;
  - the assistant's log board and lantern.
- **One part pushed hard, and it is the course's mark:**
  - frost stills a gesture: the College's forest of arms, the clerk's fan of pages, the ox's stride, and the
    tortoise's step;
  - lightning fuses brass into flesh: the bearer's back, the monkey's chest, the Rodwarden's hand, and the assistant's
    brow.
- **The outline is broken the course's way:** with icicles, rime and standing frozen hair. No foe has a closed outline.
- **Rejected ideas kept out:**
  - no beasthood beyond the bible's animals (ox, tortoise, monkey, dog);
  - no eye motifs (decision 1);
  - no Victorian costume: the gowns, houppelande, horned headdress, quilted coats and storm coat belong to the period;
  - no clergy: this bible has no church, and the college is academic.

### Style fails found and fixed (each re-rendered and checked zoomed)
- **The Stilled College:**
  - The first pass was rows of identical tilted gown slabs with a tube-like star chart, and read as a card grid.
  - It was rebuilt:
    - A dark heaped surge mass with ice planes and frozen gown folds sits behind the bodies, with an overhanging crest
      leaning toward the party.
    - The gown skirts hang plumb, and men vary in scale, lean and role: pointing, reaching, gripping a mace or holding
      instruments.
    - A proper pointing hand was made (`pointHand`: a fist with the forefinger along the line). The first version was
      an open-palm salute.
    - A three-man back slope, buried arms and a 1.24 vertical stretch send the crest out of the frame top.
- **The Great Refractor:** the flat front was fixed (Gate 1). The objective was checked at 2x: it is a pale crescent
  sliver with nothing dark at its centre.
- **The Rodwarden:** the first `rimeBark` was a chain of white tiles, which read as teeth or a necklace. It was rebuilt
  as a crust with grooves. The near sleeve was a flat dark tube; it now has muscle bulges, folds, creases and stains.
  The rods were shortened so the fan sits above his head instead of filling the canvas.
- **The Gin Ox:**
  - The head was too long and thin and read as a horse. It is now shorter and broader, with a heavy muzzle.
  - The round nostrils read as dark holes in a ring. They are now flared slits.
  - Fur plates were dense and read as white speckle. Their opacity was halved.
  - The hooves showed white balls like rollers. The ice is now packed into the cleft and heel.
- **Gate Mastiff:**
  - The jaw and skull were a long wolf snout. They are shortened to a broad mastiff head with wrinkles and heavy
    flews.
  - The legs were thin. They are now thicker, with deep segments.
  - The bristles had white dot tips (read as beads). They now carry a rime tick on the windward side.
- **Monkey:** the halo bristles pointed into the body. `bristleRidge` gained an `out` normal option, so the halo stands
  out from the body.
- **Patroness:** the face was lit flat. Shading was added under the cheekbones and jowl, with the brow lit, plus a
  nasolabial fold and a second chin (face shade 0.72). A round brooch centred on the roll was a third-eye risk; it is
  now an off-centre lozenge.
- **Clock Jack:** the checks were saturated brass and read as a chessboard. They are now dulled brass. A side plane was
  added so the carved block has depth.
- **Speculum Bearer:** the knees showed bare skin over the breeches. Rolled breeches cuffs were added, the shins start
  below them, and the jerkin sleeve that read as a second cuff was removed.

## Rig and pose tests (out/worlds/XI_b/<key>_pose.png)

| Figure | Bones / layers | Attack pose (Motion line) | Result |
|---|---|---|---|
| The Stilled College | 97 / 95 | Every `sN_arm_n`, `sN_arm_f` and `bN_arm` is rotated -62 to -78, so every arm swings down to point at the party. | Holds. The arms swing on their shoulder pivots and the sleeves go with them. |
| The Great Refractor | 25 / 29 | tube -4, counterweight -4 (the tube settles onto a hero) | Holds. The dew cap and finder follow the tube. |
| The Gin Ox | 21 / 26 | spine_2 -2, neck -6, head -8, yoke 4, beam 12, leg_fn_1 10, leg_fn_2 -20, leg_hn_1 -6 (head-down shove, the beam swinging) | Holds |
| The Rodwarden | 21 / 28 | upperarm_n -14, forearm_n 4, hand_n 10, torso -6, head 6, frame -3, rods -4, thigh_f -8, shin_f 6 (planting the pole) | Holds. The pole stays in the fist. |
| Ephemeris Clerk | 22 / 25 | upperarm_n 14, forearm_n -22, hand_n -10, torso -3, head 4, fan -6 (the quill stroke) | Holds |
| The College Tortoise | 12 / 13 | neck -8, head 10, leg_fn_1 -10, leg_fn_2 8, shell 2 (slow bite) | Holds |
| The Patroness | 22 / 26 | upperarm_f -8, forearm_f -6, hand_f 4, head -3, torso -2, sleeve_f 10, sleeve_n 4 (fixing a hero through the glass) | Holds |
| The Patroness's Monkey | 19 / 16 | pelvis 14, thigh_n -30, shin_n 30, thigh_f -26, shin_f 26, head -10, tail_1 -10, tail_2 8 (gathering for the leap) | Holds |
| Speculum Bearer | 19 / 24 | torso -14, speculum -10, pelvis -4, head 8, thigh_f -10, shin_f 8 (turning the mirror edge-first) | Holds |
| Clock Jack | 20 / 27 | upperarm_n -165, forearm_n 25, hand_n 10, torso -2 (the strike, the hammer head onto the bell) | Holds. The fused shoulder lump stays on the torso. |
| Gate Mastiff | 19 / 26 | spine_1 -3, spine_2 -4, neck -6, head -6, jaw 12, leg_fn_1 16, leg_fn_2 -12, leg_ff_1 10, leg_hn_1 -6, leg_hn_2 6, chain -2 (lunge and bite) | Holds |

## Rework (coordinator notes, 2026-11-23)

The coordinator rejected four figures at sheet size. Each was rebuilt in `world_XI_b.js` / `kit_XI_b.js`, then
re-rendered, re-rigged (no `MISSING JOINTS`, `groundY` unchanged) and pose-tested. Each was checked at 2 to 3x zoom and
at sheet and game size. The sheet script moved from scratch to `worlds/sheet_XI_b.py`, and the three sheets were
rebuilt with it.

New helpers in `kit_XI_b.js`:
- `legOutline`: one leg outline drawn along a centre line, with separate front and back widths at each joint and a
  rounded top cap.
- `wrapHatch` and `barrelHatch`: cross-contour hatching round limbs and barrels.
- `animalEye`: a small dark almond set under a heavy brow, with a frost film.
- `clovenHoof`: two claws, the cleft, the coronet band, growth rings, an iron shoe with ice in the cleats.
- `scholar({ tone })`: pushes a man back into the mass by darkening his gown, skin and hood.

| Figure | Coordinator note | Fix | Re-check |
|---|---|---|---|
| The Gin Ox | Box body and slab legs | Rebuilt on the Lantern Cow, Musk Ox and Dray Horse habits. See the Gin Ox notes below. | Pass at 2.5x zoom, at sheet size and in silhouette. Pose `neck -8, head -8, beam 10, leg_fn_1 10, leg_fn_2 -16` holds. |
| Gate Mastiff | Boxy, cartoon face with a big round eye and a toothy grin | Rebuilt on the Plague Wolf and Magma Hound habits. See the Gate Mastiff notes below. | Pass at 2x zoom. Pose (lunge and bite, jaw +14) holds. |
| The Great Refractor | The tube reads as a plain gold cylinder | The brass is now aged and dark, and the tube is modelled as a cylinder with a broken silhouette. See the Great Refractor notes below. | Pass at 1x and at sheet size. The tube reads as old bronze and iron, not gold. Pose holds. |
| The Stilled College | At sheet size it reads as a tower of identical dark robes | Rebuilt as a broken pyramid with clusters, depth and a pinned star chart. See the Stilled College notes below. | Pass at sheet and game size. Pose (every arm -62 to -78, `chart_arms` -30) holds, and the chart moves with its arms. |

**Gin Ox.**
- Body: a hump at the withers. The spine sags to the hip. The hook bone and pin bone jut out with hollows around them.
- Ribcage: deep, with five ribs standing under the frozen coat. The flank tucks up and the shoulder-blade spine shows.
- Hatching: the barrel hatching wraps round the body and follows the form.
- Legs: each leg is one outline. The forearm and gaskin taper hard to the knee and hock, where the knuckle is drawn,
  and the hock and elbow points stand out. The cannons are thin, with the flexor tendon, fetlock knobs and dewclaws.
  The feet are cloven hooves, iron-shod.
- Head: a broad skull with a flat facial plane, a curled forelock, a brow ridge, and a small frosted eye under it.
  The masseter and the jaw angle are drawn. The muzzle has flared nostril slits. The horns rise from base bosses: the
  near one carries its brass cap, the far one is scorched with its cap missing.
- Dewlap: sits in the throat with heavy folds.
- Gin beam: the bolted stub now stands up past the hump and the splintered end drags between the legs. The beam reads
  as a diagonal bar in `sil.png`.

**Gate Mastiff.**
- Body: a deep chest and high withers thrown forward. The loin is tucked behind the last rib, the croup is low, and
  the shoulder blade and haunch are drawn.
- Legs: tapered, with angled hocks, elbow and hock points, and thick paws.
- Head: a broad wrinkled skull with a short deep muzzle. The jowls and flews are part of the head mass.
- Eye: small and dark, deep under a heavy brow.
- Mouth: nearly closed on its hinge, with the upper lip lifted off the canine in a snarl. No row of grinning teeth.
- The frozen breath hangs from the flews as icicles.

**Great Refractor.**
- Brass: shifted from yellow to a dark bronze-brown (`#5e4a2e`). Verdigris sits in every plate seam and blooms
  round the rivets. Tarnish streaks run down from the joints. Only a few small worn highlights stay bright.
- Cylinder modelling on every section: a dark top edge, a narrow lit band, the core shadow, and reflected light from
  the floor along the underside. The tube's cast shadow falls on the pier.
- Frost bands lie round the tube, thick on the windward top and thinning round the side.
- The flanges and iron clamp bands have thickness and stand proud of the outline, with lit and shadowed faces and
  bolts.
- The silhouette is broken by the finder scope, the counterweight arm (longer, with rivets), the braided drive cable
  from the clock case up past the pier edge to the cradle, and the shutter chains. The cradle saddle gained a side face
  and a top face.
- Every brass part on this figure is now the tarnished look: the setting circle, the maker's plate, the gears, the
  cell and the knobs.
- Measured against the Last Prize (`world_VI_b`) as a constructed ruler: true size, cropped by the frame, 3D
  construction on every face, and 26 or more secondary details.

**The Stilled College.**
- Silhouette: the surge outline is now a broken pyramid with a stepped left slope. The crest overhangs to the
  party's side, and heads and arms break its edge.
- Depth is staged in three planes:
  - Six back men are small (0.74 to 0.84) and darkened (tone 0.4 to 0.5), sunk in the mass, some without caps.
  - Eight middle men are 0.92 to 1.0, slightly toned, in clusters separated by ice planes and buried arms.
  - Four front-lip men are large (1.16 to 1.24) and lit, with paler gowns and hoods. They rise out of the
    flagstone-ice base.
- The dean (1.14) leans out at the crest, with his forked beard drawn over his own arm.
- Star chart: wound round four buried arms that sit on one bone (`chart_arms`), together with the chart. The chart
  stays pinned to its arms when they swing, so no IK is needed for it.

## Still open
- **College rows.** The middle clusters still show some diagonal banding at 1x. It is much reduced at sheet size.
- **IK holds:**
  - The Refractor assistant's hands, when the `tube` bone moves.
  - The Patroness's eyepiece staying at her eye during the lowering idle.
- **Gin Ox body length.** The ox's body is now 1.9 at the hump and 2.5 long. The near foreleg is lifted, so three
  legs carry its weight.

## Independent review (2026-11-23)

The reviewer did not build this batch and started from the director's callouts on `out/worlds/XI_b/sheet.png`.
Method:
- Every figure was re-rendered from the current code, composited on mid grey and read at 2x to 3x on its head, hands,
  held objects and feet, then at sheet size and at game size.
- The references were rendered beside it: the Drowned King, the Lantern Cow, the Musk Ox, the Plague Wolf and the Last
  Prize.
- All eleven figures were changed. Each was re-rendered, re-rigged (no `MISSING JOINTS` on any export) and pose-tested
  with its Motion-line attack into `out/worlds/XI_b/<key>_pose.png`, and the pose was checked.
- `groundY` = canvas h - 30 in every rig.json: 1570, 1570, 1370, 1470, 790, 790, 790, 790, 1070, 910, 1070.
- Seeds run 1120 to 1130, one per figure, and all are `flip: true`.
- The three sheets were rebuilt with `worlds/sheet_XI_b.py`.
- No first-batch file, shared file or bible line was edited.

### Gate 1: logic audit (independent)

| Figure | Item | Finding | Fix | Re-check |
|---|---|---|---|---|
| Gin Ox | 4 Weight / 5 Attachment | The upper legs were slabs hanging below a box body, so the legs carried no visible mass into the hide. | The legs now emerge from the body at the elbow and the stifle, as on cattle, with the upper arm and thigh modelled inside the body. Three legs are planted and the near fore is lifted mid-stride with its hoof tilted. | pass |
| Gin Ox | Rig | When the spine bent, the hump and belly opened at the spine cut. | The `spine_1`/`spine_2` overlap disk is widened to 420 px. | Pose (`spine_2 -2, neck -6, head -8, yoke 4, beam 12, leg_fn_1 10, leg_fn_2 -20, leg_hn_1 -6`) holds and closes. |
| Gin Ox | 5 Contact | The tug-chain swung across the face in the shove. | It now runs back from the yoke down the near shoulder to the floor. | pass |
| Gate Mastiff | Rig | The back and chest opened at the spine cut under the lunge. | The overlap disk is widened to 200 px. | Pose (lunge and bite, `jaw 14`) holds. The jaw opens on its hinge under the flews. |
| Gate Mastiff | 4 Weight | pass | The forelegs are braced ahead and the hindquarters are bent and loaded against the chain, which runs back to the staple. | pass |
| Stilled College | 1 Head/spine | The men leaned up to 60 degrees, so the heads lay along the slope and the faces turned to the sky. | Each man's lean is capped at about 0.6 rad, and the wave's lean now comes from the stacking. | pass |
| Stilled College | 2 Gaze | The pointing arms ran parallel to a star almost straight above, so the forest read as a comb of identical diagonals. | The star was moved to [1260, -900]: just above the frame. The arms now converge on one point, as "every forefinger aimed at the same star" requires. | pass |
| Stilled College | Rig | pass | 86 bones. 44 arms are rotated -62 to -78 and `chart_arms` -30; the sleeves and the chart go with their arms. | pass |
| Great Refractor | 1-6 | pass | Unchanged. The assistant's brow is on the cup and his fists are on the handle and the focus collar. | Pose (`tube -4, counterweight -4`) holds. |
| Rodwarden | 3 Grips | pass | The fist is square to the near-vertical pole. The forearm meets the pole about 20 degrees off square, and no grip warning prints. | Pose holds and the pole stays in the fist. |
| Speculum Bearer | 3 Grips | The forearms were about 115 px long and 80 px thick: boxes ending in fists on the strap. | The elbows were dropped under the chest, so each forearm is about 150 px and tapers 88 to 58 px. The grips on the straps are unchanged and print no warning. | Pose holds. |
| Ephemeris Clerk | 2 Gaze | pass | The head is bowed over the slanted desk and the page is a sliver toward us. | Pose holds. |
| Patroness | 2 Gaze | pass | The eyepiece is at her near eye and the glass is level toward the party. | Pose holds. The eyepiece drifts off the eye when the arm moves (IK, below). |
| Patroness's Monkey | Rig | Each limb was one outline drawn on its upper bone, so in the leap the shins and forearms stayed behind. | Each limb is split at its middle joint (`split`) onto both bones. The rig went from 16 to 23 layers. | Pose (`pelvis 14, thighs -30/-26, shins 30/26, head -10, tail -10/8, forearm_n -10`) holds and the knees stay closed. |
| College Tortoise | 4 Weight | The lifted near forefoot stood as a vertical block on a straight leg, and when moved forward it read as a horizontal slab. | The leg bends at a low wrist and the foot lifts forward from it. Three feet are planted. | Pose (slow bite) holds. |
| Clock Jack | 3 / 5 | pass | The hammer fist is square to the handle. | The strike pose (`upperarm_n -165`) lands the hammer head on the bell. |
| All eleven | Seeds, flips, groundY | pass | Seeds 1120 to 1130, `flip: true`, ground lines as listed above. | pass |

### Gate 2: style and detail (independent)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Gin Ox (director 1) | It read as a horse or donkey: a long narrow head, the neck rising like a horse's, a box barrel with a saddle patch, legs hanging from a slab. | Full rebuild (`ginOx`), detailed in the "What was rebuilt" notes below this table. | Pass at 2x and at sheet size. In `sil.png` it reads as bovine: horns, hump, dewlap, switch, low barrel. |
| Gate Mastiff (director 2) | Boxy. The head read pig-like and cartoonish. | Full rebuild (`gateMastiff`), detailed below. | Pass at 2x beside the Plague Wolf and at sheet size. |
| Stilled College (director 3) | Far below the Drowned King bar: tilted gown slabs (torso slab over skirt slab), parallel tube arms, the same skin on every forearm, faces tipped to the sky. | `kit_XI_b.scholar` gown rebuilt, arms reworked, men straightened; detailed below. | Pass at sheet size and at 2x. Faces read individually (jaw, nose, beard, specs, cap tilt), hands are modelled pointing fists, and no two neighbours are the same man. |
| Great Refractor (director 3) | The maker's plate and setting circle were the yellowest parts (h 0.11 to 0.13, s 0.4 to 0.5), and the drive-case corners and gears were `BRD` brass. | Every remaining `W.BRD` on the figure is replaced with the figure's aged bronze (`AGE`), and verdigris blooms on the maker's plate. A hue scan of the render finds 3 gold-like pixels out of 165,000 (they are worn highlights). | Pass. It reads as old bronze and iron at 1x, at sheet size and at game size. |
| Rodwarden | The near arm was an even-width tube. A rime shard crossed the face down the nose, and another cut across the rear boot instead of sitting on its edge. | The arm now tapers 106/70/56. A turned coat cuff covers the mitten, and the locked elbow's point pushes the sleeve. The rime is moved to the brow and jaw, and on the shin above the boot top. | Pass at 2.4x. |
| Speculum Bearer | The forearms were boxes. A round dark dent on the pale mirror could read as a pupil. | The forearms are longer and tapered, with a jerkin sleeve rolled to the elbow and the brachioradialis modelled. The dent is now a long shallow scratch, so nothing round and dark sits on the speculum. | Pass. The speculum reads as an angled reflecting disc (window, rib, sheen, crack), never as an eye. |
| Ephemeris Clerk | The frosted spectacles were two round opaque white discs. At 3x they read as blank staring eyes. | `frostSpecs` now draws ice-grey foreshortened ovals with a paler upper half, hoar and a crack line. | Pass at 3x. They read as frosted glass. The College's spectacles use the same helper. |
| Patroness | The face was a smooth blank mask: a rime crust ran down the nose, leaving no nose in profile. The spyglass, the girdle and the pomander were saturated yellow brass that read as gold. The skirt front was a large flat pale area. | The rime is moved to the jaw and throat, and the nose's underside and nostril wing are drawn. The spyglass draws, collars and lip are tarnished, worn bright only along the top, with verdigris at a collar. The girdle plaques and pomander are `BRD`. The skirt has deep tube folds (`trough`) and is modelled as a cone. | Pass at 2x and at sheet size. |
| Patroness's Monkey | The head read as a rat or opossum: a long snout with a single eye. The fused astrolabe was a saturated gold disc. | A monkey head: a round cranium, a flat heart-shaped bare face turned back over the shoulder, a heavy brow bar, two small frosted eyes set close, a flat nose with slit nostrils, a short muzzle with the lips lifted off small teeth, a human-like ear, the almond in the cheek. The astrolabe is `BRD` with a dulled alidade. | Pass at 4x and at sheet size. |
| College Tortoise | The carapace was a square grid of scutes and read as a quilted box. | Real scute layout: 11 marginals, four costals, and five vertebrals set half a scute off the costals on a zigzag seam, all with polygonal growth rings. The seams are scorched black. | Pass at 1.6x and in silhouette. |
| Clock Jack | The head read as a living man: flesh tones, pink cheeks (red that was neither blood, doom nor rubric) and stubble, not carved oak. The bell was bright `BR` brass. | Oak tone and running grain over the face, flat chisel planes on the brow, cheek and nose, and the round cheeks carved as lit knobs with no red. The bell is `BRD`. | Pass at 2.2x. |
| All eleven | Palette sweep | The only saturated red left is `#8a3a30`: the clerk's table rules and the College chart's ruling, both rubric. Brass is tarnished everywhere, and no gold appears, since nothing in this batch is holy. Eye motifs: none (decision 1 holds, and the spectacles and speculum are fixed above). | pass |
| All nineteen | Unique silhouette (`sil.png`) | The ox reads as bovine and the mastiff as a heavy dog. No pair shares a silhouette, the closest being the Pilgrim and the Halberdier from batch one. | pass |

### What was rebuilt

**Gin Ox.**
- Body: a long, low, rounded barrel, 1.2 times as long as its height at the hump. The belly is slung deep between short,
  thick legs.
- Barrel modelling: a cylinder with a broad core shadow low on the side, floor light under the belly, and the lit top
  and hump.
- Top line: broken by the hump over the withers, the dip with the spine's knobs, the jutting hook bone and the raised
  tail head.
- The sacking blanket is near the hide's value. It is tented by the hook bone, with its folds radiating from it and an
  irregular frozen scalloped hem, and it is held by a girth rope round the barrel.
- Neck and dewlap: the neck is short and heavy, carried forward and down from the hump. A great dewlap hangs in folds
  from the jaw to between the forelegs.
- Head: three-quarter toward the party, carried low. A short, deep wedge:
  - a broad flat forehead plane with wrinkles and a curled poll tuft;
  - a broad square muzzle with a wide wet muffle and comma nostrils;
  - a deep cheek and jaw angle;
  - two small frosted eyes set out at the sides under the brow.
- Horns: heavy, from ringed base bosses above the poll, curving out and then forward. The near horn keeps its brass cap;
  the far horn is scorched black, its cap gone.
- Ears: set sideways under the horns, with hairy cups.
- Legs: thick cannons, the knee and hock, fetlock knobs, dewclaws, and cloven iron-shod hooves.
- Tail: a heavy tufted switch.

**Gate Mastiff.**
- Body:
  - a deep rounded chest dropping to the elbows, with the core shadow under it;
  - a tucked loin with a shadow behind the last rib;
  - the croup low on bent haunches;
  - the shoulder mass (the blade, the deltoid, the triceps bulging to the elbow, with the hollow behind it) and the
    thigh mass (the biceps femoris, and the front of the thigh as a lit ridge into the stifle);
  - legs that emerge from the body, with the hock point behind and the carpal stopper pad.
- Head:
  - a massive broad skull, with the far brow and the far rose ear showing over its top for breadth;
  - a deep stop, and furrows across the forehead and between the brows;
  - a short square muzzle with a square nose leather and slit nostrils;
  - heavy hanging flews;
  - the upper lip lifted off the canine, with snarl wrinkles bunched on the muzzle top;
  - the jaw dropped on its hinge;
  - a small dark eye deep under a heavy brow, with the cheekbone arch below it;
  - folded rose ears with the burr showing.

**Stilled College.**
- The scholar's gown (`kit_XI_b.scholar`) is one outline from the shoulders to the hem:
  - a lit front and a shadowed back;
  - folds from the yoke over the chest, a catenary drag under a knotted cord girdle, and tube folds frozen plumb to a
    pointed hem;
  - the hood's bag hanging down the back with its pale lining turned out, and a lined collar round the neck.
- The bare forearms carry tendons, a wrist bone and liver spots. Every third pointing arm keeps its sleeve to the
  wrist.
- Skin tones vary over seven values. The men stand nearer upright.

### Holds that need IK
- **Great Refractor:** the assistant's brow on the eyepiece cup and both hands (the slow-motion handle, the focus
  collar), whenever `tube` moves.
- **Patroness:** the eyepiece staying at her eye through the lower-and-raise idle (`upperarm_f`/`forearm_f`).
- **Speculum Bearer:** both fists on the chest straps when `torso` or `speculum` turn for the edge-first swing. The
  straps are on the torso and the fists on the arm chain.
- **Rodwarden:** the pole hand when the torso twitches. The pole is parented to `hand_n`, so the forked foot must be
  pinned to the floor by IK.
- **Stilled College:** the dean's two-handed hold is only one hand on the mace, so no IK is needed. The chart arms share
  one bone, so none is needed there either.

### Still open after the independent review
- **Gin Ox:** the blanket's radiating folds read a little like a fan or shell at sheet size. The dewlap is quieter at
  sheet size than at 1x.
- **Stilled College:** the rear men are still dark wedges in the mass at game size. That is by design (depth), but the
  crest is the busiest part of the sheet.
- **Patroness's Monkey:** the astrolabe is tarnished but is still the warmest disc on the sheet. That is right for brass,
  but it out-shouts the face at game size.
- **Patroness:** the eyepiece drift under the pose (IK).
