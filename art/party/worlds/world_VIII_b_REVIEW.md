# World VIII, The Sundered Rime (Fire + Frost), batch b: review

Figures (seed 820 + bible order): The Sleeper Under the Hold (820, ruler, 3 high and 6 long), The Firstbreaker (821,
ruler 3.5), Berserker (822, elite 2.0), Musk Ox (823, elite 1.8 at the hump, 2.4 long), Fire-Setter (824, human 1.0),
The Skald (825, human 1.0), Mead-Bearer (826, human 0.95), Ore-Hauler (827, large 1.4), Snow Hare (828, small 0.4),
Pit Adder (829, small 0.45 reared), Glacier Wolverine (830, small 0.5 tall and 1.0 long).

Files: `worlds/world_VIII_b.js`, `worlds/kit_VIII_b.js`. The kit requires `kit_VIII.js` and re-exports it unchanged. It
adds fur hanks (`hairClump`/`hanks`, after kit_IX), `animalEye` (a small dark almond under the brow, never a white
disc), `iced`/`burnt`/`zone`/`ringRift` for local splits, `crazing` (the hare's mosaic), `timber`, `adit`, `tally`,
`rubble`, `puff` and a `scales` texture. `puff` draws steam as soft lobes with no defining line, so steam cannot read as
a bolt. No first-batch file and no shared file was edited.

Every figure is drawn facing right with `kit.foeBase` (light [0.6, -0.8]) and `flip: true`, with groundY = canvas
h - 30. Each rig.json was checked against canvas h - 30.

Canvases follow GUIDE section 2: true size wins.

| Figure | Canvas | Why |
|---|---|---|
| Sleeper | 2400 x 1600 | Widened at the same scale, and she still runs off both sides. Her head is about 640 px. |
| Firstbreaker | 1600 x 1600 | Standard ruler. Cropped by the headframe and the top edge. |
| Musk Ox | 1700 x 1400 | Widened for the 2.4-long body. |
| Ore-Hauler | 1300 x 1100 | Widened for the sledge behind him. |
| Fire-Setter | 700 x 900 | Heightened and widened for the raised fork and bundle. |
| Mead-Bearer | 680 x 820 | Widened for the horn held out. |
| Glacier Wolverine | 820 x 820 | Widened for the 1.0 length. |
| All others | tier canvas | |

Method: each figure was rendered, composited on a mid-dark ground and checked three ways: at 1x, at 1.5x to 2.5x zooms
of the head, hands, held objects and feet, and at sheet size. Every `B.grip` renders with its warning on, and the final
renders print none. Every `render_rig.js` export has no MISSING JOINTS. Attack pose tests are in
`out/worlds/VIII_b/<key>_pose.png`. The sheets are `sheet.png` (the 11 plus the Drowned Thrall), `sheet19.png` (all 19)
and `sil.png` (all 19 at 190 px per human), all built with scratch `wVIII_b/sheets.py`.

## The split, per creature (the bible's world rule)

Each line is jagged (`jag`, amp 3 to 14 px), never ruler-straight, and falls where the bible puts it.

| Figure | Where the split falls |
|---|---|
| Sleeper | Outside / inside. Ice skin outside. Every adit glows molten within, with cracks crazing out from its corners, glowing at the root and white at the tip. |
| Firstbreaker | Horizontal at the shaft rim. Rimed shoulders, arms and head; a charred band of chest with seams above the collar. The crack rings the chest and steams. |
| Berserker | Diagonal, near shoulder to far hip. The near arm and the pelt over his back are iced; the belly, far side and far arm are burnt. A second line crosses the face so the rimed-shut eye is on the ice side. |
| Musk Ox | Lengthwise along the flank where the burnt hair ends. Frozen curtain above; burnt belly, legs and hooves below. |
| Fire-Setter | One limb. The fork arm is burnt to the shoulder blade, with a crack ringing the shoulder like a pauldron's edge (`zone`). The rest is rimed. |
| Skald | Across the face at the mouth, ear to ear through the open mouth. Frozen above. Below it everything is scorched except the frost on the cloak's shoulders. |
| Mead-Bearer | At the knees. Burnt shins and feet. A glowing crack rings each knee just under the burnt, ragged hem. |
| Ore-Hauler | Along the harness. A burnt stripe a hand wide under the strap, frozen either side, with the crack along both edges (`zone`). |
| Snow Hare | A crazing. A net of cells, each rimed or singed; the cracks widen at the joints and up the ears. |
| Pit Adder | A spiral up the coils. The bottom coil is almost all char, the middle coil char along its underside, the top coil and neck rimed. The zigzag glows on the char side and is black on the ice. |
| Glacier Wolverine | Front / back. Burnt head and forelegs, rimed from the shoulders back. The crack rings the shoulders like a collar. |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: one spine, jaw on a hinge), 2 objects face their user and gaze, 3 grips
and hands, 4 weight and balance, 5 contact and attachment (and plumb hang), 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| Sleeper | pass | n/a | pass | pass | fixed | pass | 5: the winch post read as a cross standing on her. It is now a post with a drum, rope wound on it and a crank. |
| Firstbreaker | pass | n/a | pass | pass | pass | pass | none |
| Berserker | pass | n/a | fixed | pass | pass | pass | 3: both axe grips were 69 deg off square (warning). The hafts now run square to the near-vertical forearms, so the axes jut out level from the hips. No warning. |
| Musk Ox | pass | n/a | n/a | pass | fixed | pass | 5: the dragging trace hung from the rump like a tail. It now leaves the body under the curtain and lies along the ice, with a frayed end. |
| Fire-Setter | pass | n/a | fixed | pass | pass | pass | 3: the first build held the haft nearly parallel to the forearm. The arm is now cocked back with the forearm near vertical, so the haft runs 17 deg off square, over and clear of the head. |
| Skald | pass | n/a | fixed | pass | pass | pass | 3: the far hand on the lyre was 47 deg off square. The elbow moved behind the hip; the forearm now meets the lyre's arm about 6 deg off square. |
| Mead-Bearer | pass | pass | fixed | pass | fixed | pass | 3/5: the first hands sat beside a small horn like gloves. Both hands now cup it: palms and heels under, fingertips over the far side, thumbs over the near side (drawn after the horn). |
| Ore-Hauler | pass | n/a | fixed | pass | fixed | pass | 3: the far hand on the strap was 53 deg off square. It now grips the breast strap under the chest, elbow set square to it. 5: the strap and stripe ran above his neck, because the spine frame turns at the hump. They are now placed in screen space over the shoulder to the trace ring at the far hip. |
| Snow Hare | pass | n/a | n/a | pass | pass | pass | none |
| Pit Adder | pass | n/a | n/a | pass | pass | pass | none |
| Glacier Wolverine | pass | n/a | n/a | pass | pass | pass | none |

### Measurements behind the passes

- **Sleeper.**
  - 1: the head is one profile with the throat; chin, nose and brow run off the neck, and the crown is cropped at the
    edge.
  - 3: the hand hangs open, and the bucket's bail hooks over the little finger.
  - 5: the lamp hook is driven into the jaw and the lamp hangs plumb. The ladder stands on the floor and leans to the
    breast adit. The rails run from the rib gallery to the floor.
- **Firstbreaker.**
  - 1: the skull centre is 170 px ahead of the neck base on a 350 px head. He leans out over the rim from the shoulders,
    and the hood is pushed back.
  - 3: the pick haft is near vertical (driven into the rim's ice) and the forearm lies level on the rim, square to it.
    No warning.
  - 4: the weight hangs on both forearms on the rim. The far hand hooks over the rim's edge.
  - 5: the chain wraps twice round the shoulders and one end hangs over the rim with the bucket. The two thralls' fists
    grip his shoulder.
- **Berserker.** 4: wide stance; the front knee is bent over the foot, and the torso leans ahead of the hips.
- **Musk Ox.** 4: four short legs planted under the hump and the hindquarters; split cloven hooves flat on the ice.
- **Fire-Setter.** 4: the weight is on the straight back leg, with the front knee bent.
- **Skald.** 4: the hips are pushed forward and the shoulders back, so his weight is on his heels.
- **Mead-Bearer.**
  - 2: she looks forward at the one she offers to, with the horn's mouth toward them.
  - 4: the weight is on the front foot and the back heel is raised.
- **Ore-Hauler.**
  - 4: the weight goes forward into the harness. The near hand is braced flat on the ice and the back leg pushes from
    its toes.
  - 5: the traces are chained from the sledge to the ring at his far hip.
- **Hare.** 4: the weight sits on the long hind feet.
- **Adder.** 1: one spine runs through all three coils, the S of the neck and the head. The jaw is on its own hinge
  bone.
- **Wolverine.** 1: one spine with a jaw hinge. 4: four flat plantigrade paws; the forequarters are heavy.

## Gate 2: style and detail (GUIDE.md, bible entry)

| Figure | Signature at 190 px | Course marks / Never | Grit | Palette | Volume / layers / face | Section 9 | Fix |
|---|---|---|---|---|---|---|---|
| Sleeper | pass (glowing timbered adits in the ice hill, hand hanging over it) | pass | pass, 18+ | pass | fixed | pass | Her head was a B.head balloon with a hair disc. It is now a custom profile thrown back: chin by the throat, nose peak, frozen-shut lids, parted lips breathing steam, jaw icicles. The shoulder was a ball; it is now a low mound. The breast and ribs got shadow planes and lit rib ridges. |
| Firstbreaker | pass (head and arms over the rim, the pick in the ice, framed by the headframe) | pass | pass, 18+ | pass | fixed (open, see below) | pass | He was small and uncropped. He is raised, with the headframe legs moved in front of him so they crop him at both sides. The thralls on his back were blobs; they now have hooded heads, burnt faces and gripping fists. The deltoid ball was removed. |
| Berserker | pass (bear hood, two axes out low) | fixed | pass, 14+ | pass (red only in the cuts) | fixed | pass | The unclipped rift drew a glowing zigzag in the air beside him (a lightning read). It is now clipped to the body. The axes read as hammers; they now have long bearded blades hanging down. The hood read as a rat; it now has a short broad muzzle and round ears. The rimed eye was a white slit; it is now a grey crust on the lid. |
| Musk Ox | pass (humped bulk, hair skirt, hooked horns) | fixed | pass, 13 | pass | fixed | pass | Table-post legs under a flat rug: the legs are now short and thick, the hump high and the back sloping. The curtain was parallel stripes; the hanks now vary in width, length, lean and wave, with a shadowed lower part. The horn curled like a ram's; it now sweeps down past the eye with a hooked dark tip. The oval brand read as an eye; it is now an angular burnt patch with the mark. |
| Fire-Setter | pass (fork raised with bundle, bucket swung back) | fixed | pass, 13 | pass | fixed | pass | The hood's burn hole was a glowing ring round a dark centre (an eye). It is now a ragged dark slot with a few embers. The bundle read as a log or torch; it is now a sheaf of birch sticks, tight at the front with ember cores, fanned behind the withies. The rag read as a white mask. The forearm was an even tube; it now has a muscle edge and a wrist taper. |
| Skald | pass (lyre at the hip, head thrown back) | fixed | pass, 11 | pass | fixed (open, see below) | pass | The steam's thin wavering line read as a bolt. All steam in this batch is now soft lobes (`puff`). The rime rectangle spilled outside the head. The burnt beard stubs read as fingers over the mouth. The brooch at the jaw read as headphones. The lyre was a frontal board; it now has its side and thickness. |
| Mead-Bearer | pass (long horn held out) | fixed | pass, 11 | pass | fixed | pass | The horn was too short to be the signature; it is now 250 px and curved. The knee crack was hidden under the hem; the hem now ends just above the knees. The scarf band read as headphones; it is now a folded edge with a plumb knot. The shins read as boots; they now taper with a calf and a bare foot. |
| Ore-Hauler | pass (bent in harness, heaped sledge) | pass | pass, 11 | pass | fixed (open, see below) | pass | The frozen skin read as a blue jumpsuit; the shadow is now desaturated. The torso was a dome; it now has a spine furrow, shoulder blade, ribs, lat edge and a narrower waist. The collar ring round the head read as headphones; it is now an iron band round the neck. |
| Snow Hare | pass (upright long-eared hare) | fixed | pass, 10 | pass (the bible's moss is the one green speck) | pass | pass | The first crazing was a checkerboard with an ember dot in each cell, a field of eye-like dots. The cells are now an irregular rotated, staggered net with few embers, and the char is weighted toward the feet. |
| Pit Adder | pass (coils, raised S, head drawn back) | pass | pass, 8 | pass | fixed | pass | The neck was an even tube; it now tapers from 58 to 28 px behind the broad head. The tail end is 8 px at the tip. The frozen scale plates were white blocks; they are now small upturned scales scattered over the neck. |
| Glacier Wolverine | pass (low humped scavenger, burnt head swung low) | pass | pass, 7 | pass | fixed | pass | The hanks read as pale petals and the rime as dorsal spikes. The fur is now dense grey clumps without ink gaps, a long frozen belly fringe and a flatter crust. The head read as an anteater; it is now short and broad with a short leather strip. |

### Batch-wide checks

- **Silhouettes.** No two foes share one (`sil.png`).
  - The Sleeper (a horizontal hill with an arched arm), the Firstbreaker (a head and arms framed by a headframe) and the
    Riven Jarl (a seated man with a shouldered axe) are three different rulers.
  - The Magma Hound (lean, legs long, head low) and the Glacier Wolverine (short-legged, humped, bear-built) differ, and
    the Musk Ox is a skirted hump.
  - The five human cast each have one strong read: pick on the shoulder, fork overhead, lyre and thrown-back head, horn
    held out, bent double in harness.
- **Never column.**
  - No lightning anywhere. Steam is soft lobes; the one stray glowing line (the Berserker's rift) was clipped.
  - No flames on heads. The faggot bundle smoulders with no flame tongues.
  - No clean crystals or snowflakes: rime is specks and feathers, icicles are faceted and dirty.
- **Eye audit (VIII is not a void world).**
  - Animal eyes are small dark almonds under a brow stroke: no white discs and no ring-and-pupil.
  - The hare's per-cell ember dots, the Fire-Setter's ringed burn hole and the Musk Ox's oval brand were each removed as
    possible eye reads.
  - The Wolverine's eye has a dull ember sheen (its burnt head), as the first batch's Thrall eye does.
- **Palette.** Ice white, molten orange and black obsidian, plus ink, bone and grey, and the material library dulled
  to grey. No gold. Red appears only in the Berserker's cuts. The one green is the bible's tuft of moss in the hare's
  mouth.
- **Faces.** faceShade is 0.8 to 0.85 on every human face.

## Rig and pose tests

The rigs live in mirrored (game) space, so the rotation signs are mirrored compared with the drawing code.

| Figure | Bones / layers | Pose (`out/worlds/VIII_b/<key>_pose.png`) | Result |
|---|---|---|---|
| Sleeper | 6 / 7: body (pivot low at the hips, for the breath), head, upperarm, forearm, hand, bucket | hand coming down: body -1.2, forearm -14, hand -18 | attached; see the crop note below |
| Firstbreaker | 13 / 14: shaft (root), torso (pivot at the rim), head, both arms, pick, chain, bucket, thralls | pick blow wind-up: upperarm_n 25, forearm_n 40, hand_n 20 | attached; the pick leaves the ice with the hand |
| Berserker | 19 / 23: standard + axe_n, axe_f, pelt, hood | spinning sweep: torso -10, arms swung | attached |
| Musk Ox | 20 / 24: spine_1/2, neck, head, tail, yoke > chain, trace, 4 legs x 3 | horn-boss charge: head and neck down, near foreleg forward | attached |
| Fire-Setter | 17 / 22: standard + fork, bucket | bundle driven forward: upperarm_n -45, forearm_n -20 | attached; the haft passes the hood in that frame (z-order) |
| Skald | 19 / 23: standard + lyre, cloak, skirt, horn | verse: head back, near arm flung forward | attached |
| Mead-Bearer | 18 / 21: standard + horn, skirt, pitcher | offering: both arms forward | attached |
| Ore-Hauler | 16 / 17: standard + sledge (pivot at the trace ring) | heave: sledge swung -25, torso up | attached; the chains swing with the sledge |
| Snow Hare | 9 / 10: body, head, ears, forelegs, feet, snare | drumming: foot_n -18, ears turned | attached |
| Pit Adder | 6 / 9: coil, neck_1..3, head, jaw | strike: the S unrolls toward the enemy, jaw open | attached; no seams open |
| Glacier Wolverine | 18 / 21: hound chain | lunging bite: neck and head forward, jaw open, foreleg reaching | attached |

### Holds that need IK

- **Mead-Bearer.** The horn is on hand_n; the far hand cups it from below and must follow by IK.
- **Firstbreaker.** Both forearms lie on the rim. When the torso hauls up, IK keeps the far hand hooked on the edge.
  The pick is on hand_n.
- **Ore-Hauler.** The near hand is flat on the ice; IK keeps it planted while the torso heaves. The far hand holds the
  breast strap on the torso.

## Still open

- **Firstbreaker's chest.** It reads flatter than the Drowned King bar. The anatomy is in grooves and soft shadow
  planes, and the near upper arm covers much of it. At sheet size he reads clearly (head, roar, arms on the rim, pick,
  headframe), but the torso is the plainest large area among the rulers. In silhouette, the headframe and collar make
  him a framed block.
- **Sleeper's off-frame arm.** The upper arm and the elbow lie above the canvas, so their pixels are not in the rig
  layers. Her attack (the forearm and hand coming down about the elbow) works. A large swing of the upper arm about the
  shoulder shows the crop edge; the game would need an over-height layer for that.
- **Sleeper's hill.** The skin between the adits is broad and plain by design ("faceted in broad planes"), and is the
  least busy large area of the batch.
- **Skald's face.** The burnt lower face is dark at sheet size. The thrown-back head is carried by the pale frozen brow
  and the steam.
- **Musk Ox head.** At 1x it is busy (boss, horn, halter, beard). It reads as a hooked horn under a boss only at sheet
  size.
- **Ore-Hauler.** The frozen skin is one tone from head to foot, so in places it reads close to cloth.
- **Mead-Bearer.** The horn arms hide most of the bead swag between the brooches.
- **Snow Hare.** The mosaic (the bible's split) overwhelms the fur structure at 1x.

## Independent review (2026-11-23)

Reviewer, not the maker.

**Method**
- Each figure was re-rendered on its own and composited on a mid-dark ground.
- Each was checked at 1x, at 2x to 5x zooms of the head, hands, held objects and feet, and at sheet size.
- The director's callouts were taken first. All 11 figures were then re-audited against both gates.
- Every `B.grip` renders with its warning on, and none fires.
- Every rig was re-exported. No export reports MISSING JOINTS, and every rig.json ground is canvas h - 30.
- Each changed figure's attack pose was re-run and looked at. The rigs live in mirrored space, so the signs in the
  poses below are mirrored compared with the drawing code.
- `sheet.png`, `sheet19.png` and `sil.png` were rebuilt with the maker's `sheets.py` (unchanged).
- New kit helpers (`kit_VIII_b.js`):
  - `mass`: a soft mass modelled by the key light, with a blurred shadow plane and a blurred lit plane.
  - `bandHatch`: hatching between two curves, so it follows the form. Ink on the shadow side, rime white on the lit side.
  - `wrapHatch`: cross-contour hatching round a limb.
  - `oldCrack` and `healedSeam`: old cracks and refrozen seams in ice skin.
  - `hank`: a heavy hank of guard hair with a wide root, an uneven taper and a split tip. It is shaded as a part, and
    its root third carries no ink.
  - `underwool`: a matted woolly underlayer.
  - Filters `mblur` and `mblurS`.

### Director's callouts and what was done

1. **Sleeper: a smooth pale lump.** The hill was rebuilt as anatomy seen from her near side.
   - **Outline.** The pubis runs off the edge, then a rising iliac crest, a belly saddle, the ribcage climbing to the
     breast (the peak), the pectoral, and the clavicle to the neck.
   - **Hip.** The iliac crest is a ridge with a lit lip. The great trochanter swells under it, and a groin line runs to
     the edge.
   - **Ribcage.** Seven ribs run from the spine at the floor up toward her feet, each a lit ridge with a hatched trough.
     There is a costal margin under the breast and serratus slips under the armpit.
   - **Back muscles.** The latissimus is a broad fan with a soft front edge. The long back muscles are one rolled mass
     pressed into the floor.
   - **Underside.** A dark, crosshatched band where the body meets the glacier.
   - **Breast.** It sags, with a deep hatched fold under it and icicles hanging from it.
   - **Shoulder and neck.** A clavicle groove and the hollow above it, and the trapezius and shoulder blade pressed down.
   - **Frost and old ice.** Rime hatching follows the lit faces. There are five old cracks and two refrozen seams.
   - **Arm attachment.** The lifted arm was an even tube with an oval "foot" at its root and a 160 px shadow band. It now
     has its own outline: a deltoid cap, the biceps toward the head, the triceps toward the feet, and cross-contour
     hatching. It is clipped along a root line, so no outline or shadow band separates it from the chest. Across that
     line the pectoral fold sweeps onto the arm, the latissimus fold comes up from the back, the armpit hollows between
     them, and the deltoid runs on into the collarbone. It stays attached when the arm swings.
   - **Head.** There was a background gap under the jaw. The neck now fills it and is cut along the near shoulder's
     contour, with the shoulder in front and its shadow on the neck. The face has a jaw line hung with icicles, a
     cheekbone, a brow ridge, a modelled eye socket (it was a flat goggle disc) and the long neck muscle. The disc ear is
     now a helix behind the jaw's angle, half under braids that run to the floor.
   - **Other.** The forearm and head lost their flat navy bands (maxShade 160 to 70). The rib gallery, rails, tipped
     cart, ladder and shoulder adit were moved to fit the new anatomy.
2. **Firstbreaker: a flat chest; a framed block.**
   - **Chest.** Two pectoral masses meet at a grooved breastbone with a pit under it. The pectorals have heavy, hatched
     lower edges. Seven ribs and a costal margin show through the frost, with serratus slips on the far side.
   - **Trapezius and neck.** The trapezius climbs from both shoulders into the neck. The collarbones are drawn. The neck
     was an 85 px-long tube whose round cap drew a navy "collar" ring. It is now clipped along its base so it runs into
     the trapezius, and the sternocleidomastoid is modelled.
   - **Cape.** The shoulder cape was cut back to the near shoulder and the back, so the throat and trapezius show.
   - **Near upper arm.** The elbow was moved out (SN [610,610], EN [340,1040]) and the width cut from 210 to 176, so the
     arm covers about 40 percent less chest. The pick moved with the hand.
   - **Headframe silhouette.**
     - The cross-beam has snapped. Its two halves sag from the legs with splintered ends.
     - The pulley hangs tilted off a bent axle bracket, cut by the top edge.
     - The hoist chain and hook hang from one broken end, and a frayed rope from the other.
     - The legs lean in, so their outer edges run on the diagonal, and rope coils hang on pegs outside them.
     - The collar logs are staggered, so the collar is not one ruled block.
3. **Musk Ox: a curtain of parallel stripes; a skull wedge.** Rebuilt.
   - **Hump.** It now rises over the withers, directly above the forelegs (it peaked behind them before).
   - **Underlayer.** A pale saddle of matted underwool with curls and rime shows where the guard hair parts on the hump.
     Its lower edge is tufted, and the brand is burned through it.
   - **Guard hair.** Four tiers of `hank`s, lower tiers first. They vary in width (28 to 116 px), length, lean and S-wave,
     and swing together in a slow wave. Tips split into one to three points and land at many heights (shorter hanks end
     on the hanks below). They are clotted with ice balls and icicles, and singed stubs curl along the crack. The root
     third of each hank carries no ink, so the coat is continuous at the top and separates into clumps lower down.
   - **Head.** A long face held low, with short hair lying down it and a pale muzzle with a flared nostril. A heavy,
     ridged boss lies over the brow. The near horn comes out of the boss, sweeps down behind the eye, round under it,
     then forward and up into a dark, chipped hook. The far hook shows under the jaw, and a beard of hanks hangs off the
     throat.
   - **Hooves.** Two broad claws per foot (far and near) with heel bulbs, a worn sole, a glowing cleft and a dewclaw.
     The knee "pads" (a pale highlight) were removed.
   - **Rig.** `f.bone()` was being called per hank, which made 118 layer runs. It is now called once per bone change:
     36 layers.
4. **Pit Adder: a spring or stacked rings.**
   - **Coils.** It now has two and a half turns, seen a little from above. Each turn wanders: its centre drifts and its
     radius, flattening and tilt change. Each upper coil throws a blurred shadow on the coil below. The rifts are faint,
     so they no longer trace orange ring outlines.
   - **Taper.** The short tail now tapers from 5 px out onto the ice in front, so the body tapers from the head to the tail.
   - **Head.** Enlarged by 22 percent, with three supraocular brow scales standing over the eye, crown scales, a row of
     lip scales and the adder's dark stripe running back from the eye.
   - **Props.** The shed skin and the finger bone were moved onto front coils.
5. **The seven figures at 2-3x.**
   - **Skald.**
     - **Lower face.** The burnt lower face was one dark mass with the throat. It now has a warm cheek and jaw plane and a
       chin lit from the glowing mouth. A dark plane under the jaw parts it from the throat. The jaw's edge is lit by the
       heat, two glowing seams run down the throat, and the mouth is opened wider.
     - **Pose.** The pose test showed the flung near arm crossing the face; it was re-posed so the hand flings out in front.
   - **Ore-Hauler.**
     - **Skin.** The frozen skin read as heathered cloth. The causes were a 50 percent rime speck overlay, a 70 percent
       mottle texture, an even blue-grey tone and 90 px shadow bands. The skin is now grey-white with a cold violet
       shadow (the world's stated frozen-skin rule), rime 10 percent and mottle 30 percent, with 38 px bands.
     - **Anatomy.** Muscle masses, frost mottling, veins, and creases at the elbow and knee. Vertebrae along the hump.
       Knuckles, frostbitten fingertips and nails. The forearm now swells below the elbow.
   - **Mead-Bearer.** The lifted back foot floated below its shin, and the front foot's top edge read as a boot. Each foot
     is now drawn first, under its shin, and the shin runs into the ankle.
   - **Fire-Setter.**
     - **Bundle.** The faggot bundle fanned out behind into a broom. It is now a bound sheaf (fan 1.5 to 1.12, outline
       tightened).
     - **Fork.** The fork was lowered 0.05 rad, so the bundle no longer meets the canvas top (only faint smoke does). The
       grip still fires no warning.
   - **Berserker, Snow Hare, Glacier Wolverine.** Heads, hands, held objects and feet were checked at 2x. They pass and
     are unchanged.

### Gate 1 (independent): logic audit

| Figure | Item | Finding | Fix | Re-check |
|---|---|---|---|---|
| Sleeper | 5 Contact | The arm sat on the chest as a separate tube with an outlined, shaded cap; there was a background gap under the jaw | The arm is clipped at its root with pectoral and latissimus folds across it; the neck fills the gap behind the shoulder's contour | Pass. Pose (body -1.2, upperarm -8, forearm -16, hand -14): root closed, bucket on the finger |
| Sleeper | 1 Head/neck | The head sat on nothing but the body's edge | The neck runs from the clavicle under the jaw to the floor | Pass |
| Firstbreaker | 3 Grips | The pick moved with the hand when the elbow moved out | `B.grip` re-aimed, no warning; the forearm is still level on the rim, square to the near-vertical haft | Pass. Pose (upperarm_n 25, forearm_n 40, hand_n 20, torso -3): attached |
| Firstbreaker | 5 Contact | The neck tube's cap drew a ring on the chest | Clipped along its base | Pass |
| Musk Ox | 1 Spine | The hump peaked behind the shoulders | It now peaks over the withers; the neck is buried in coat to the poll | Pass |
| Musk Ox | 4 Weight | The hooves were blocks | Broad cloven hooves with heel bulbs, flat on the ice | Pass. Pose (neck -10, head -10, leg_fn_1 -16, leg_fn_2 10, spine_2 1): head down for the charge. Keep spine_2 within about 2 deg: 3 deg opens a seam at the spine split |
| Pit Adder | 1 Spine | One spine already ran through the coils, now with a visible tail | Tail end added | Pass. Pose (neck_1 -12, neck_2 -14, neck_3 10, head 6, jaw -22): the S unrolls forward and the jaw opens on its hinge |
| Mead-Bearer | 5 Contact | The lifted foot was detached from its shin | The foot is drawn under the shin and the shin is extended | Pass. Pose: both feet attached. The far hand leaves the horn in the offering pose (IK) |
| Skald | 3 Hands | In the verse pose the near arm crossed the face | Pose re-signed (upperarm_n 15, forearm_n -45) | Pass |
| Ore-Hauler | 4 Weight | Pose: the sledge swung into the ice and the head dipped into it | Pose re-signed (sledge -9, torso 8, head -4) | Pass. The braced hand leaves the ice (IK) |
| Fire-Setter | 3 Grips | The fork was re-angled 0.05 rad | `B.grip` re-run, no warning | Pass. Pose (upperarm_n -45, forearm_n -20, upperarm_f 25, torso -4): the bundle is driven forward. The arm passes the hood in that frame (z-order) |
| Berserker, Hare, Wolverine | 1-6 | Re-audited at 2x | None needed | Pass (the maker's poses stand) |
| All 11 | Seeds / flip / ground | 820 to 830, each used once; flip: true on all 11; ground = h - 30 in every rig.json | None needed | Pass |
| All 11 | Palette | Red appears only as `P.blood` (the Berserker's cuts) and muted wound tones (cracked lips, a burn scar, whip scars). No gold. No eye motifs (animal eyes are small dark almonds). No lightning: steam is soft lobes, rifts are clipped to bodies | None needed | Pass |

### Gate 2 (independent): style and detail

| Figure | Item | Finding | Fix | Re-check |
|---|---|---|---|---|
| Sleeper | Ruler bar / volume | Broad plain skin between the adits; flat navy bands; a disc ear; a goggle eye | Anatomy, form hatching, old cracks and seams, and an underside as above; flat bands cut; ear and socket rebuilt | Pass at sheet and 1x. Grit 25+ (adds hip crest, ribs, costal margin, serratus, latissimus, back roll, clavicle, five old cracks, two seams) |
| Firstbreaker | Ruler bar / silhouette | A flat chest; a framed block | Modelled chest and neck; the headframe broken at the top and sides | Improved; see Still open. Grit 25+ (adds snapped beam, hook, frayed rope, rope coils, tilted pulley) |
| Musk Ox | Hair as parallel stripes / head | A stripe curtain; a skull wedge | Hanks, underwool, hump, musk-ox head and horns as above | Pass. Grit 16 |
| Pit Adder | Spring coil / head | Stacked rings | Wandering coils, cast shadows, a tail taper, brow scales | Improved; see Still open. Grit 11 |
| Skald | Face read | The burnt lower face was a dark mass | Warm lit planes and a parted jaw | Pass at 2.5x and at sheet size |
| Ore-Hauler | Skin as cloth | Read as a heathered jumpsuit | Flesh tone, texture cut, anatomy cues | Improved; see Still open |
| Mead-Bearer | Feet | The front foot read as a boot | Foot under the shin | Pass |
| Fire-Setter | Signature object | The bundle read as a broom | Bound sheaf | Pass |
| Berserker, Hare, Wolverine | All items | Re-checked | None needed | Pass |
| All | Section 9 | The former self still reads on every figure: yoke and halter, harness and collar, lyre, horn and brooches, hood and pick, miners' works in the giantess | None needed | Pass |
| All | Silhouettes vs the first batch | `sil.png`: three distinct rulers; the Musk Ox's skirted hump differs from the Thane's hunched giant; the Wolverine's low hump differs from the Magma Hound's lean dog | None needed | Pass |

### Holds that need IK

- **Mead-Bearer.** The horn is on hand_n. The far hand must be driven onto the horn by IK; in the offering pose it drops
  away.
- **Ore-Hauler.** The near hand must stay planted on the ice by IK while the torso heaves.
- **Firstbreaker.** The far hand must stay hooked on the rim's edge while the torso hauls up.

### Still open after the independent review

- **Firstbreaker silhouette.** Below the rim he is still a block: the collar logs and the two legs fill the lower tile.
  The top is broken (pulley, snapped beam, chain, head). Cutting the collar down further would need the bible's
  "cropped at both sides by the headframe timbers" to be read more loosely.
- **Ore-Hauler skin.** It now reads as frozen flesh at 1x. At sheet size the limbs are still built from blocky
  even-width segments, so a trace of a garment remains. A full limb rebuild (calf and forearm swells, bony knee and
  elbow) is the next step.
- **Pit Adder coils.** No longer a spring, but the space inside the top coil reads as a small dark hollow, and the
  bottom char coil is broad and bowl-like.
- **Sleeper.** The off-frame forearm shows its crop edge when it swings (the maker's note stands: the game needs an
  over-height layer).
- **Musk Ox.** The hanks hang near-plumb by nature, so at sheet size the coat still has a strong vertical rhythm. It is
  broken by the varied widths, lengths, waves and tip heights.

## Ruler upgrade pass (2026-11-23)

Director's notes: the Firstbreaker still reads as a block in a frame below the rim and his face is cartoonish (a big
white open mouth); rebuild the face as a weathered giant (brow, cheekbones, frost in the beard, a dark mouth with
teeth) and break the lower block with the collar's broken logs, his forearms over the rim and ropes. The Sleeper reads
as a pale snowy landscape; push the value range (much darker undersides and crevices, lit planes on hip, ribs and
breast, form-following hatching) so she reads as a sleeping giantess at game size. Concept, palette, scale, canvases,
keys, seeds (820, 821), bones and Motion lines unchanged. Only `firstbreaker()` and `sleeper()` changed; kit_VIII_b
was not edited.

### The Firstbreaker
| Area | Before | After |
|---|---|---|
| Head | `B.head` (an egg with a full-beard slab), mouth 'snarl' with full-width white teeth bars and a large orange throat: read as a cartoon roar at sheet size | a custom giant's head: a broad flat skull with a heavy brow ridge shelving over deep sockets (a `mass` with a lit shelf and a dark socket band), small eyes narrowed under it (`animalEye`, rimed lashes, bags), wide lit cheekbones over dark hollows, a darkened temple and back of the head (hatched), a broad broken nose with a kink and a lit bridge, a deep nasolabial fold with a lit lip, three curved brow furrows and crow's feet as folds, an old scar; the ear in shadow |
| Mouth | white | a dark roar (#100806, heavy ink rim): eight individual worn, yellowed teeth of uneven length, one gone, one snapped short, the upper lip's shadow on them; the tongue low in shadow; only a small ember far down the throat; the upper lip's lit, rimed edge |
| Beard, brows, hair | a grey slab with five strand lines; brows two white strokes | frozen into separate hanks (20 in the beard, 6 in the moustache over the corners of the mouth, 8 + 3 in the brows, 10 swept back on the crown), darker roots and rime-white tips, icicles off the tips |
| Collar (below the rim) | five full-width stacked logs: a ruled block | the top log snapped under his chest, both halves bent down into the break with splinters standing up and a glow in the break; the second burnt through near the far side (charred end smouldering) with a gap; the third shoved out of line; a length of the fourth fallen into the shaft; the burning shaft glows through every gap |
| Ropes and arms over the rim | none on the collar face | the hoist rope running down into the shaft, a rope ladder's remains (two side ropes, three rungs, one broken), lashings round two far log ends, a coil of rope tumbling over the near rim with a bight hanging down the logs; his far hand (the reviewed `clawHand`) now hooks down over the front of the snapped log, fingers clawed into it and hung with icicles, continuing the forearm on the rim |

Rig re-exported (16 layers, 13 bones, no MISSING JOINTS, ground 1570). Pose test (pick wind-up: upperarm_n 25, forearm_n
40, hand_n 20, torso -3, head 4) attached. The far hand stays on `hand_f`; the IK note stands (it must stay hooked on the
rim while the torso hauls up). Before/after: the face now reads as an old frost-bitten giant roaring, not a cartoon; the
lower tile is a broken, burning collar with ropes and a hand over it instead of a striped block. Left: the bottom two
logs still run the full width (the headframe and the bible's crop keep a frame round him).

### The Sleeper Under the Hold
| Area | Before | After |
|---|---|---|
| Skin value | #c4d0d8 with a 160 px shadow band (#36445c): a pale field | #b2c0ca with a 260 px shadow band in a deeper #18203a |
| Masses (27) | `mass` shadow op 0.3-0.5, light 0.15-0.38 | every mass through a local wrapper: shadow ×1.45 (max 0.82), light ×1.6 (max 0.68), so each form has a real core shadow and a real lit plane |
| Hatching (14 band, 3 wrap) | op 0.26-0.45, 3-4 px | ink hatching ×1.55, rime hatching ×1.25, strokes 25 percent wider; still form-following (`bandHatch` between the form's own curves, `wrapHatch` round the arm) |
| Undersides | one blurred band at op 0.5 + crosshatch 0.75 from y 1220 | the underside raised to y 1180, op 0.78, crosshatch 0.95; a second core shadow over the whole lower flank from y 1020 with its own crosshatch (op 0.42 / 0.7), so only the upper faces stay pale |
| Crevices | armpit 0.55, under-breast 0.5, grooves 0.28-0.55 | armpit 0.85, under-breast 0.8, every groove ×1.4 and wider; new dark crevice cuts: the groin, the belly against the hip crest, the trough between the ribs and the latissimus, the underside of the hip |
| Lit planes | ridge lines only | faceted lit planes on the hip crest, the belly's upper slope, the ribcage's upper face, the top of the breast and the shoulder; each rib now a broad lit face plus a 6 px lit ridge |

Rig re-exported (8 layers, 6 bones, no MISSING JOINTS, ground 1570). Pose test (body -1.2, upperarm -8, forearm -16,
hand -14) attached; the off-frame forearm's crop edge still shows when it swings (the earlier note stands: the game
needs an over-height layer). Before/after: at 0.3x the hill now reads as ribs, a breast and a hip lit from above over a
dark flank pressed into the floor, with the arm and the thrown-back head, instead of a pale snowfield with lit doors.
Left: the face and the lifted arm stay the palest masses (they face the light); the hip's far end is still broad.

Sheets: `sheet.png`, `sheet19.png`, `sil.png` rebuilt with the maker's `wVIII_b/sheets.py`. All checks done at 1x, 2-3x
on the head, mouth, hands and collar, and at 0.3x beside the Drowned King.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| Firstbreaker | cartoon white open mouth | The roar was still a round dark O framed by white icicle hanks (read as white fangs at sheet size). Now a wide, low, uneven roar pulled down at the far corner, a heavy lower lip (lit roll, chapped split, shadow under it on the chin), worn teeth half hidden under the upper lip's shadow, a dimmer ember, and the moustache darker and shorter so it hangs over the lip instead of framing a hole. | pass at 0.3x and 2x |

Rig re-exported (13 bones, no MISSING JOINTS); pose (`upperarm_n 25, forearm_n 40, hand_n 20, torso -3`): attached.
Sheets rebuilt (scratch `wVIII_b/sheets.py`: sheet, sheet19, sil). Still open: the eye sockets read slightly goggle-like
at sheet size (dark flat sockets round small eyes); not in this item's scope.
