# World XIV, The Blighted Garden: review (second batch "b", 11 creatures)

Files: `worlds/world_XIV_b.js` (figures), `worlds/kit_XIV_b.js` (requires `kit_XIV` and re-exports it, plus this batch's
helpers), `worlds/sheet_XIV_b.py` (sheets). The first batch's files were not touched. Seeds 1420 to 1430 in the bible
order: Lady of the Bower 1420, Green Lion 1421, Lady's Fool 1422, Truffle Boar 1423, Scarecrow 1424, Blight Snails 1425,
Flower-Strewer 1426, Mole-Catcher 1427, Pond Swan 1428, Orchard Picker 1429, Beekeeper 1430.

Every figure is a foe drawn facing right with `kit.foeBase` (through `kit_XIV.base`) and `flip: true`; `groundY = h - 30`
on every canvas (rig.json `ground` checked: 1570, 1570, 1370, 1470, 870, 790, 790, 790, 1070, 870, 790). Renders
`out/worlds/world_XIV_b_<key>.png` + `_sil.png`; rigs `out/rig/worlds/world_XIV_b_<key>/` (no MISSING JOINTS on any);
pose tests `out/worlds/XIV_b/<key>_pose.png`; sheets `out/worlds/XIV_b/sheet.png` (this batch at 1:1, Drowned Thrall as
1.0), `sheet19.png` (all 19 at true relative scale, half size) and `sil.png` (all 19 at game size, human about 190 px).

| Figure | Tier | Canvas | Note |
|---|---|---|---|
| The Lady of the Bower | ruler 3 | 1600 x 1600 | head 300 px (about 3.6 humans standing); the raised far arm (upper arm and elbow) and the bower's arch run out of the frame top, the bed and train out of the frame right after the flip |
| The Green Lion | ruler 4.5 | 1600 x 1600 | true height 2880 px: head and raised near paw cropped by the frame top, only the lower jaw in frame |
| The Lady's Fool | elite 1.8 | 1100 x 1400 | head 158 px, lanky (about 6.6 heads to the crown) |
| The Truffle Boar | elite 1.9 at the shoulder | 2400 x 1500 | withers at 1216 px: widened at the same scale (guide section 2) |
| Scarecrow | human 1.1 | 900 x 900 | widened for the crossbar, heightened for the pole |
| Blight Snails | small, cluster 0.5 | 680 x 820 | |
| Flower-Strewer | small 0.6 | 600 x 820 | a child's proportions (head 68, about 5.6 heads) |
| Mole-Catcher | human 0.95 | 640 x 820 | crouched |
| Pond Swan | large 1.3 (neck raised) | 1200 x 1100 | widened for the raised wings |
| Orchard Picker | human 1.0 | 900 x 900 | widened and heightened for the ladder |
| Beekeeper | human 1.0 | 640 x 820 | |

## How the first batch's rework notes were kept

- **Fungus**: every growth is the kit's shaded fungus (crosshatched shadow, dark gills or pored undersides, a cast shadow on
  the host, clusters skewed a few big and many small, torn and collapsing ones mixed in). A different kind per host:
  Lady, pale-yellow oyster shelves on hip and thigh; Lion, side brackets in grey-lilac and yellow on the flank plus
  puffballs in the mane; Fool, puffballs on the cap and gilled caps over the bauble; Boar, a crest of tall slender gilled
  caps (parasols); Scarecrow, small conic bonnet caps in the black straw; Mole-Catcher, a new brain fungus (Sparassis:
  a mound packed with curled, lip-lit sheets, `brainFungus`); Swan, yellow side brackets on the wing coverts; Orchard
  Picker, fruit galls; Flower-Strewer, conic buds along the forearm; Beekeeper, spore and mould only (the skep is the growth).
- **Colour**: the pastels are the first batch's desaturated ones, and they were pushed further toward ink where an area
  is large (the Fool's motley is mixed 35 to 40% into loam, the Lion's yew is near-black `#1d201c`). Pixel scan (half
  size, opaque pixels, saturation > 0.45): red 0.00%, gold 0.00%, saturated green 0.00% on all eleven.
- **No boxes with outline strokes**: bodies are single outlines modelled inside by soft tones, folds and creases.
- **Animal value plan** (Boar, Swan; new shared `barrelTones` after the Mother's): a lit top line, a dark belly core with
  contour hatching turning under, the girth hollow behind the shoulder and the ham dark, the round of the shoulder and
  quarter lit. The Boar's legs are the Mother's `cervidLeg` (forearm tapering hard, knee knob, cannon about 40% of the
  forearm, tendon groove, fetlock, dewclaws, cloven hoof) made short and thick, with loam-dark stockings to the knee.
- **Eyes**: the Boar's is small, dark and almond under a heavy brow; the Swan's small and dark under the brow in the bare
  black skin before the bill. Void eyes (lidded, in sockets) only where the bible calls for them.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (animals: one spine, legs carry weight, jaws on a hinge); 2 objects face the user, gaze;
3 grips (`B.gripAngle` through `gripK`); 4 weight; 5 contact and attachment, plumb hang; 6 facing and light. "fixed" =
failed during the build and passes in the final render.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Finding and fix |
|---|---|---|---|---|---|---|---|
| Lady of the Bower | pass | pass | n/a | pass | fixed | pass | 5: the near hand and the mirror were drawn before the bed and hidden by it; the near arm now draws after the bed, the forearm lies on the bed and the hand hangs over its edge holding the mirror (its back toward us, its face toward her). Weight goes down the near upper arm into the bed. |
| Green Lion | pass | n/a | n/a | pass | fixed | pass | 5: the roots spilling over the planter were drawn behind the planter; moved in front, over the rim. The lower jaw sits on the chest bone; weight into the root-ball inside the split planter. |
| Lady's Fool | pass | pass | fixed | pass | pass | pass | 3: the bauble ran along the raised forearm (89 degrees off square, `move the elbow`); the stick now leaves the fist forward at about 30 degrees (gripK, maxBend 45, no warning). Weight on the ball of the planted far foot, centre of mass over it. The near fist rests on the hip (not a hold; knuckleFist set along the forearm). |
| Truffle Boar | fixed | n/a | n/a | pass | pass | pass | 1: the first head hung from a high poll as a long thin trunk; the poll was lowered to the neck's front (1950, 800) and the head shortened into a wedge with deep jowls so the neck runs into it; the jaw hinges under the cheek. The crest caps first pointed down (wrong normal); fixed. Weight forward on the front legs, snout in the loam. |
| Scarecrow | pass | n/a | n/a | pass | fixed | pass | 5: the pole was hidden behind the body; it now shows above the hat and trails behind to the torn-out foot; the clod moved onto the pole bone so it travels with it. Wrists bound to the bar with rope; the crow hangs plumb from the far arm by its feet. |
| Blight Snails | pass | n/a | n/a | pass | fixed | pass | 5: the first eye stalks were too thin to render and the eyes floated; stalks are now inked strokes joining head to eye. Shells sit on the feet (raised 0.3 s). Snail 2 rides snail 1 (bone parent snail_1). |
| Flower-Strewer | pass | pass | n/a | fixed | pass | pass | 4: the kicked-up back foot was stretched to the ground line by the shared leg; it now has its own sole line (lifted mid-skip). Weight on the front foot. The basket handle passes over the forearm. |
| Mole-Catcher | fixed | pass | pass | pass | pass | pass | 1: the first head was bowed so far that the near arm crossed the face; the torso is more upright, the head over the neck base, the arms below and ahead of the face. Gaze 22 degrees off the molehill (pass). Both fists on the shaft via gripK, thumbs toward the crutch, no warning. |
| Pond Swan | pass | n/a | n/a | pass | pass | pass | Neck one S from the breast, split three ways at its joints; the jaw opens on its hinge in the hiss; wings root at the shoulders; weight on the broad splayed feet. |
| Orchard Picker | fixed | pass | pass | pass | fixed | pass | 1/5: on the near shoulder the ladder's rail and rungs crossed her face; the ladder now rides on edge on the far shoulder behind her head, the far fist on a rung ahead of the face (gripK, maxBend 40, no warning); the basket moved to the near hip (pelvis bone) so the throw does not carry it. |
| Beekeeper | pass | pass | fixed | pass | pass | pass | 3: the torch ran along the forearm (57 degrees off square); the elbow moved so the forearm is square to the stick, no warning. The head pushed forward from a rounded upper back over the hood. |

Machine checks (last run): no MISSING JOINTS; no grip warning in any render; ground = h - 30 on all; flip true on all;
seeds 1420 to 1430, no collision with the first batch (1400 to 1407).

## Gate 2: style and detail

| Figure | Signature at 190 px | Toxin / Never | Void / Never | Grit (need) | Layers | Palette | Unique sil. | Section 8 | Fix made |
|---|---|---|---|---|---|---|---|---|---|
| Lady of the Bower | pass: the reclining, propped figure under the arch | mould bloom, pustules on collarbone and propping arm, hip brackets, roses rotting on split canes, cushions bursting with spore, pollen / no slime, no glow | hole through the raised palm, a hole through the lute, eyes in the blooms on bed and bower / no sparkles | 16 (12): bower canes, roses, circlet browned, hair with moss and flowers, girdle of linked stones, rings in swollen fingers (both hands), hand mirror fogged, lute, spilled cup, book of hours swollen, split cushions, petal drifts, velvet gown rotted to moss, hanging canes | skin, velvet, bloom mat | pass | pass | fixed | Torso narrowed (waist, bust), bodice given shadow and folds; roses enlarged and heaped along the bed's top; eye blooms enlarged; face modelled with a new `faceModel` (sockets, cheekbone, under-nose, far side turning away, hatching); the cheek's mould softened from a sticker to a bloom |
| Green Lion | pass: rampant hedge lion with the clipped ball tail, planter | dead black sides with grey-lilac mould, brackets, puffballs smoking spore / none | two clean holes through the body, eyes of every size (enlarged x1.6 to read) / none | 17 (12): iron training frame in the dead patches, ladder, shears in the flank, rope harness and ring, clipped tail ball, split planter with carved panels and swags, roots over the rim, lead label, gardener's body, stone ball cracked, dead clippings, bird's nest with a rotted egg, stake teeth, moss from the mouth | yew, dead wood and iron, stone | pass | pass | fixed | First yew was too green and tiled like scales: near-black yew, randomised tuft sizes and positions, bigger dead patches; planter darkened and carved |
| Lady's Fool | pass: three-pointed cap with puffball bells over the high kick | throat gall pushed hard (the one distortion), mould soaked into whole diamonds, rot holes with moss / none | eyes in the moss on chest and sleeve, hole through the cap / none | 13 (10): bauble with carved face and fungus, ribbon on the stick, slapstick, purse of dice, garter bells swollen shut, curled shoes (one sole gone), torn knee, wilted flower, half-swallowed ruff, lady's ribbon at the wrist, dagged cuffs, buttons | skin, tights and doublet, ruff and gall | pass | pass | fixed | First pass was candy pastel: motley mixed toward loam, stained, legs thickened from tubes |
| Truffle Boar | pass: low heavy boar with the mushroom crest | crest of caps, truffle galls (warty), hide peeled to mould, spore froth / none | eyes along the crest base, hole through the ear / none | 14 (10): leather collar, iron ring, broken lead rope trailing, bell packed with moss, notched tag in the ear, broken spear shaft and its socket, muzzle strap on the tusk, yellowed tusks with loam, crushed truffles, torn ear, scar on the snout, loam stockings, ploughed loam bow-wave and furrow | bristled hide, crest, collar | pass | pass | fixed | Head and crest (gate 1); hindquarters lowered so the back slopes from the withers |
| Scarecrow | pass: the cross of the arms on the bar | black straw grown with bonnet caps, mould on seams, fungal pustules on the sacking, spore / none | clean hole through the chest, eyes in the straw at the cuffs / none | 12 (6): coat with half the buttons, elbow patch, rope bindings, felt hat with crow feather, dead crow, tin cup on a nail, rotting turnip in the pocket, rag strips, stitched sack face, sewn mouth, knee patches, torn-out clod | sack, coat, trousers | pass | pass | fixed | Pole made visible; straw bursts at the cuffs enlarged; legs given folds, tears and patches |
| Blight Snails | pass: the toppled urn crawling with snails | mould blotches and galls on shells, pustular bodies, lace leaf / none | many-eyed stalks, two holed shells / none | 9 (6): cracked fluted urn, chipped plinth, lead label, dead stems in the mouth, loam spilled, rider snail, broken shell, lace leaf, dried trails | stone, shells, bodies | pass | pass | fixed | Shell rebuilt as a disc with a spiral suture (the first spiral outline was a comma); foot rebuilt as a slug body with a raised head |
| Flower-Strewer | pass: small girl, basket and flung arm | skin mould, neck swelling, buds on the forearm, fungal hair, spore petals / none | eyes in the basket, hole through the pinafore / none | 9 (6): wreath of browned flowers, ribbon, pinafore straps and tie, willow basket, petal stuck to the cheek, loam feet, rotted hems, flung petals | skin, dress, pinafore | pass | pass | fixed | Hair darkened so the face separates; loam on the feet broken into stains (it read as a boot) |
| Mole-Catcher | pass: crouch, raised narrow spade, the moles | brain-fungus hump, pustules on hands, fused fungal moles / none | hole through the far palm (the shaft shows through), eyes in the hump and the moles / none | 12 (6): felt hat with moleskin band, iron scissor traps (2), worm bag, knee pads, gaiters, jerkin lacing, side seam, patch, rubbed handle mark, crutch-handled spade with rust and loam | smock, jerkin, belt gear | pass | pass | fixed | Smock skirt darkened and folded (was a flat pale area); hat lightened and brim cut down; nose shortened |
| Pond Swan | pass: S-neck between half-raised wings | clumped mould in the plumage, breast gall, wing brackets, peeling feet / none | hole through the near wing (drawn with `holeEach`, rig-safe across three bones), eyes in the gall / none | 8 (6): ownership ring, lily stem, pond weed on the neck, broken flight feather, notched beak, loam on the feet, black knob, nail | plumage, gall, legs | pass | pass | fixed | The first gall read as a face on a disc; reshaped irregular, eyes off any face pattern, feathers fading over its rim |
| Orchard Picker | pass: the tall tapering ladder | fruit galls on hands, peeling fingers, fruit cluster from the shoulder, mouldy basket fruit / none | eyes in the fruit, hole through a rung / none | 11 (6): three-legged ladder, folded third leg, hooked picking pole, broken rung, apron pocket, kilted swag, kerchief and knot, pattens on iron rings, knife on a cord, shoulder pad, dropped burst fruit | bodice, apron, skirt | pass | pass | fixed | Face read as bearded: face hatching off, lower jaw shade, bust added |
| Beekeeper | pass: round wicker head, skep under the arm | sting pustules, mould on the smock, straw rooted into the sleeve, spore from skep and torch / none | eye in the skep's entrance, hole through the smock / none | 10 (6): woven willow cage, hood, skep with binding, torch of rag (no flame: smoulder and spore smoke), long gloves, gaiters, honey knife, wax-sealed pot, feather brush, yoke seam | smock, hood, gloves and gaiters | pass | pass | fixed | Skep rebuilt as a bell (it read as a striped box) and moved forward so it breaks the outline; torso slimmed at the top |

Section 9 (which course did this, to whom, does the bible say so):
- Lady: toxin made her the bed and rotted the bower; void opened eyes in the blooms and the palm (bible). Remnant: gown, circlet, mirror, lute.
- Green Lion: toxin rotted the yew; void clipped holes and opened eyes (bible). Remnant: the clipped shape and the gardeners' tools.
- Fool: toxin's one pushed mark is the throat gall (bible); remnant: motley, cap, bauble.
- Boar: toxin turned the bristle ridge into the crest (bible); an animal, as listed.
- Scarecrow, Snails, Strewer, Mole-Catcher, Swan, Picker, Beekeeper: each carries only its bible's marks and keeps its trade (pole and crossbar; urn; basket; spade and moles; ownership ring; ladder; skep and cage). Nothing was taken for its own sake; no Victorian dress.

Silhouettes: all 19 checked in `sil.png`. No two share a shape: the Lady (reclining under an arch) and the Lion (a rearing
column with a ball tail over a block) are unlike the Mother (a standing quadruped under antlers) and each other; the Boar
(low, long, crested) is apart from the Spore Deer (tall legs, coral antlers); the Scarecrow's cross, the Fool's cap and
kick, the Picker's ladder, the Beekeeper's ball head and skep, the crouched Mole-Catcher with his spade, the Strewer's
small flung arm, the urn heap and the swan's S-neck each read alone.

## Pose tests (each creature's attack)

Positive turns a bone clockwise on screen (mirrored rigs).

| Figure | Bones | Test | Result |
|---|---|---|---|
| Lady of the Bower | 11 | blow across the palm (`forearm_f -7, hand_f -12, head -5`) | pass, the hand comes before the face |
| Green Lion | 12 | near paw swipe (`arm_n_1 -40, arm_n_2 -30, chest -6`) | pass; the gardener swings with the forearm; the jaw shows more of its gape |
| Lady's Fool | 22 | bauble slap (`upperarm_f -70, forearm_f -30, torso -8`, cap points) | pass |
| Truffle Boar | 22 | tusking charge (`neck 6, head 14, jaw -6`, front leg push) | pass; neck cut closed |
| Scarecrow | 14 | lurch on the pole (`pelvis -12`, legs counter, crow swings) | pass (the arms are bound to the bar: the club is the pole's swing) |
| Blight Snails | 13 | cluster slides (snail bones turn) | pass |
| Flower-Strewer | 20 | underarm fling (`upperarm_n -30, forearm_n -25`) | pass |
| Mole-Catcher | 19 | two-handed stab (`upperarm_* -22/-24`, forearms) | pass; the far fist leaves the crutch (IK) |
| Pond Swan | 16 | lunge and wing beat (`neck_1 -14, neck_2 -10, head 12, jaw 10`, wings) | pass |
| Orchard Picker | 19 | overarm throw (`upperarm_n 150, forearm_n 40`) | pass; in the wind-up the near arm draws over the head (needs a z_index swap in Godot) |
| Beekeeper | 19 | thump the skep (`upperarm_n 12, forearm_n 14, skep -4`) | pass |

## Holds that need IK
- Mole-Catcher: the spade is on `hand_n`; the far fist on the crutch must be IK'd onto the shaft.
- Orchard Picker: the ladder hangs on `hand_f` and also rests on the far shoulder; when the torso moves, keep the rail on the shoulder (IK or a constraint).
- Green Lion: the gardener's body rides `arm_n_2`; no IK, but its hang is plumb only in the rest pose.

## Still open (honest)
- Lady of the Bower: she is the weakest of the two rulers against the Drowned King. The bodice is still a large plain
  area, the face (B.head scaled to 300 px with added modelling) still reads a little mask-like at full size, and the
  bed's lower front is a field of small roses. The bible's "far shoulder out of the frame top" is met by the raised
  arm and the arch; her shoulder itself is in frame, because at the bible's literal scale the head would leave the frame.
- Green Lion: near-black by design; at sheet size its interior detail reads as texture; the eyes are what break it up.
- Truffle Boar: the flank between the galls is the plainest area; the head still reads slightly long.
- Pond Swan: the body plumage scallops are regular at full size; the legs are thin for the bird's scale.
- Beekeeper: the torso is still a little columnar behind the skep.
- Faces drawn with `B.head` carry the purple cel band on the jaw; on the women it was lightened (faceShade 0.55 to 0.68)
  so it does not read as stubble, which is below the guide's 0.7 to 0.85.
- Spore puffs and flung petals are baked into the figures (as in the first batch); they could move to FX.

## Independent review (2026-11-24)

Reviewer, not the maker. Read MAKER_BRIEF, GUIDE, LOGIC_CHECKLIST, REVIEW, bible 00 and XIV, world_XIV_REVIEW and this
file; compared against the Drowned King, the first batch's Mother and Spore Deer, the Musk Ox, the Gin Ox, the Plague Wolf
and world_VI's wings. Backup of the maker's files before any change: scratch `rvXIVb/bak/`. Every edit was a checked
replacement (each search string asserted to match exactly once). Every changed figure was re-rendered, re-rigged (no
MISSING JOINTS) and pose-tested, and looked at on a mid-dark ground at 0.45x to 2.6x and at sheet size.

New kit helpers (`kit_XIV_b.js`): `bristles` (directional coarse hair toned by the form's light), `maneRidge`,
`ladyFace` (a full-size modelled face with a warm shadow), `cfeather` (a contour feather: no outline, ink only at the free
tip, a soft shadow thrown on the row beneath), `swanWing` (a busking wing). In the world file: `headW` (B.head drawn with a
warm loam-brown shadow tint instead of the figure's purple one).

### What changed (director's callouts)

| # | Callout | Fix | Re-check |
|---|---|---|---|
| 1 | Truffle Boar reads as a stegosaurus | Rebuilt. Canvas 2400 → **2250 x 1500**. Withers 1216 px (1.9). Rump to disc about 1.6 x the height along the body. The barrel is now a wedge: a massive forequarter under a shoulder hump at the front, the back falling to narrow, low hindquarters (forequarter 830 px deep, hip 330). Short, deep wedge head pressed into the loam: one outline, inked only on its true edge (no seam at the neck). Disc snout with nostrils, cracks and a wet light, half buried in a loam bow-wave. A small dark eye deep under a heavy brow. Upcurved tushes and whetters crusted with loam. A broad, erect, torn ear with the notched tag and a void hole. A jowl beard and a bristly mane ridge from the poll over the hump. Coat: about 3200 coarse bristles laid in tracts (back along the barrel, down off the shoulder shield and the neck, down the thigh, back under the belly), toned by the form: lit top, dark belly and girth, shoulder and ham rounds. Legs: short and thick, drawn under the belly; cloven trotters at 2.6x; a lit front edge; loam caked in clods to the knee (the blotchy "boot" stains were removed). The crest is now 15 irregular clusters of 1 to 8 caps of mixed kind (convex, conic, flat, inkcap) and sizes from 50 to 250, with side brackets on some. Bare mane and single pinhead caps sit between the clusters, with eyes at the base of the larger clusters. All the story items are kept. | Sheet and 2x: it reads as a boar (hump, wedge head, disc, tusks). Its silhouette now differs from the Spore Deer's. Pose (charge: `neck 6, head 12, jaw -8`, fore leg push, crest) closes at the neck and jaw. 34 layers, 22 bones. |
| 2 | Pond Swan: pale blob, planks for a wing | Rebuilt. The wings use `swanWing` (world_VI habits): slotted, emarginated primaries fanned back from the hand, each throwing a shadow on the next; secondaries with a scalloped trailing edge; tertials and scapulars drooping down over the body; greater, median and lesser coverts in rows, each casting a soft shadow on the row below; primary coverts and the alula; and a shaped leading edge (one band that swells at the wrist's bend and thins to the hand, inked heavily only on its outer edge, fringed with marginal coverts). The arm's base is buried in the scapulars. The body is a boat shape with a lit back, a round lit breast and a dark belly; four rows of long flank feathers are shingled back (contour feathers, toned by the light) to a lifted, pointed tail and fluffed undertail coverts. The neck is one S tapering from 136 to 50 px, drawn behind the breast, lit on the side toward the light, with broken fine feathering instead of rings. Legs: thick black scaled tarsi with heel joints; broad black webbed feet with spread toes, claws and a scalloped web. The blight sits at the feather roots: rot staining, grey-lilac mould, fungal fur, lifted barbs and small caps in the seams, plus brackets and caps on the coverts. The gall is now two soft lobes inside the breast's line, the plumage lapping its upper rim and torn round it. The first rebuild read as a face on a disc, so its eyes were moved off any face pattern. | 0.8x: reads as a busking swan. Pose (lunge, `neck_1 -12, neck_2 -10, head 14, jaw 10`, wings) holds, with the wings rooted. 30 layers, 16 bones. |
| 3 | Lady: mask face | B.head + faceModel replaced by `ladyFace` at full size: one outline carrying the brow, the socket's notch, the nose, lips and chin. The planes are soft blurred tones in a warm shadow: the far side turning away, the temple, a lit brow ridge with deep sockets under it, a lit cheekbone with the hollow beneath, the side of the nose, a soft nasolabial fold, an upper lip in shadow, a full lit lower lip with the shadow under it, the chin's ball, and the jaw underplane in warm brown (not purple). Cel depth 0.78. Heavy lids half closed with hanging lashes and a lid fold; thin arched brows. The swollen cheek is now a raised soft swelling with its own light and shadow and a faint bloom (no sticker). The hair locks that read as parallel spikes are now sweeps back from the brow. The jaw's shadow on the neck is warm. | 1x and 2x: a modelled, long, lovely face, no mask or stubble read. |
| 3 | Lady: plain bodice | Nine folds pulled from the bust to the girdle and gathered at the waist; front lacing (14 eyelets, crossing laces, a frayed loose end); neckline embroidery of a worn vine with leaves and rosettes in pale thread plus running stitches; rot stains rising from the waist; mould patches over dark rot; a cap cluster at the side seam; oyster shelves at the waist. Removed the maker's two black rot dots, which read as a face on the bodice. | 0.6x: no flat area larger than a palm. |
| 3 | Lady: flat rose carpet | The bed's roses are now three ranks: at the back 34 roses, small (20 to 32) and dimmed 45% toward loam; in the middle 22 roses (34 to 50); in front 14 large roses (54 to 80) at full value. Each rank sits in soft dark gaps, with briar stems, thorns and rotted leaves climbing between. Big roses get a petal spiral at the heart and rot browning their edges. | 0.7x: reads as a heap with depth. Pose (blow across the palm) holds. 16 layers, 11 bones. |
| 4 | Green Lion must read as a lion | At 2x it failed: no head, a shapeless mane, no haunch, paw or hind leg. Re-massed: a round clipped haunch sunk in the root-ball with lit crown and dark underside; a hind leg and a clipped paw (toe divisions, thorn claws) on the rim, with the far hind paw behind; a torso tucked at the belly and deep at the chest; a mane collar with locks clipped in tiers and a shaggy hem; a clipped lion head in front of it. The head has a lit brow ridge, socket hollows with eyes, a squared muzzle, a clipped nose flat, ear tufts, and the gaping square mouth with upper and lower splintered stake teeth and moss hanging. Both forepaws are raised as clipped paw balls with thorn claws. The gardener now hangs from the raised forearm clear of the mouth. All story items are kept: frame, ladder, shears, harness, label, nest, ball, clippings, holes, eyes. **Bible departure, logged:** the bible keeps only the lower jaw in frame; the director asked for a clear head, so only the crown and the mane's top are cropped. | 2x: head, mane, paws and haunch read; sheet: a rampant hedge lion with a ball tail. Pose (near paw swipe down `arm_n_1 -28, arm_n_2 -30`) holds. 14 layers, 13 bones. |
| 4 | Beekeeper torso columnar | Torso profile now has a stout chest (0.86 H), a back curving from a rounded upper back into the small of the back, and a waist drawn in to 0.44/0.70. The belt is cinched at the waist with a buckle, and the smock is bloused over it in five folds. The skirt flares out behind from the waist. Added chest-plane light and the shadow under it. | Back edge now curves; belt reads. Pose holds. |

### Gate 1: logic audit (all 11, after the fixes)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Rig | Finding, fix, re-check |
|---|---|---|---|---|---|---|---|---|
| Lady of the Bower | pass | pass | n/a | pass | pass | pass | pass | Mirror back toward us, face toward her; palm hole on the raised hand; weight down the near arm. |
| Green Lion | fixed | n/a | n/a | pass | fixed | pass | pass | 1: no head over the chest; the clipped head now sits on the chest bone over the mane collar, jaw on its own bone. 5: the gardener's boots ran into the mouth; he now hangs from the raised forearm. Re-checked at 2x and in the pose. |
| Lady's Fool | pass | pass | pass | pass | pass | pass | pass | The bauble leaves the fist forward (gripK, no warning); planted on the ball of the far foot. |
| Truffle Boar | fixed | n/a | n/a | fixed | fixed | pass | pass | 1: the head's ink seam against the neck; the outline is now inked only on its true edge. 4: legs moved under the belly, short, thick and planted; weight forward on the forelegs. 5: the disc is half buried in the loam bow-wave; the strap hangs plumb from the tusk; the rope trails from the collar ring along the ground. |
| Scarecrow | pass | n/a | n/a | pass | pass | pass | pass | Wrists roped to the bar; crow plumb; pole foot dragging. No change. |
| Blight Snails | pass | n/a | n/a | pass | fixed | pass | pass | 5: ground trails hung in the air from snails on the urn; only snails on the ground now leave a trail. The dead stems stood straight out of the tipped mouth into the air; they now fall to the loam. One small snail was left floating after the stems dropped and is now set on the ground. |
| Flower-Strewer | pass | pass | n/a | pass | pass | pass | pass | Basket handle over the forearm; weight on the front foot. |
| Mole-Catcher | pass | pass | pass | pass | pass | pass | pass | At 2x both fists wrap the shaft (gripK, no warning) and the palm hole shows the shaft through it; the kneeling foot is on its toes. |
| Pond Swan | pass | n/a | n/a | pass | fixed | pass | pass | 5: the neck base showed as a wedge over the breast; the neck is now drawn behind it. Wings root at the shoulders under the scapulars. Weight is on broad webbed feet under thick legs set back. |
| Orchard Picker | pass | pass | pass | pass | pass | pass | pass | Far fist on the rung (no warning), ladder on the far shoulder, basket on the hip. |
| Beekeeper | pass | pass | pass | pass | pass | pass | pass | Torch forearm square to the stick (no warning). |

Machine checks, re-run after the last render:
- `render_rig.js`: no MISSING JOINTS on any figure.
- rig.json `ground` = canvas h − 30 on all 11 (1570, 1570, 1370, 1470, 870, 790, 790, 790, 1070, 870, 790).
- `flip: true` on all 11.
- Seeds 1420 to 1430 in bible order.
- No `move the elbow` warning in any render.
- Palette scan (half size, opaque pixels, saturation over 0.45): red 0.00%, gold 0.00% and saturated green 0.00% on all 11.
- Eyes appear only where the bible calls for them: in blooms, galls, fruit, the skep, the crest base, the hump and the moles. The animals' own eyes are small and dark.

### Gate 2: style and detail (reviewer's pass)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Lady | Mask face, purple jaw band; plain bodice with dots that read as a face; flat rose carpet; spiky hair locks | Callout 3 | Grit 20+ (adds lacing, eyelets, embroidery, roses with spirals, briars, ranks); the face's shading range is warm and modelled at faceShade 0.78. Section 9: unchanged (toxin made her the bed; void the palm and the eyes). |
| Green Lion | Not readable as a lion | Callout 4 | Signature (rampant hedge with a ball tail) reads in `sil.png`. |
| Truffle Boar | Stegosaurus; identical spike row; tapir head; boot-like legs | Callout 1 | Crest clustered and irregular (MAKER_BRIEF, XIV review). Grit 14+ kept. |
| Pond Swan | Blob with polka dots; plank wing | Callout 2 | Rot sits at feather roots, never as spots. |
| Beekeeper | Columnar torso | Callout 4 | Chest, waist and hips read. |
| Orchard Picker, Flower-Strewer, Lady's Fool, Mole-Catcher (and Beekeeper) | B.head's purple cel band read as a beard on the women and as stubble on the jaws | `headW`: a warm loam-brown shadow while each head is drawn; faceShade raised into 0.7 to 0.85 (Picker 0.62 → 0.74, Fool 0.68 → 0.75) | 2x: shaded skin, no beard read. The Mole-Catcher's stubble is the bible's and is drawn separately. |
| Lady's Fool | Planted leg an even tube (section 8) | mLeg widths 100/64/34 with a calf swell | Calf and slim ankle read at 0.6x. |
| Blight Snails | Trails and stems floating as streaks | See gate 1 | Clean at 1x. |
| Scarecrow | No fault found at 2x (head, rope at wrists, straw hands, crow, boots) | none | n/a |
| Silhouettes | All 19 checked in the rebuilt `sil.png` | none needed | The boar (high front hump, low rump, clumped crest, head down) no longer resembles any other figure. The lion is now a rearing beast with an open head, apart from the Mother and the Dryad. The swan's S-neck sits between its wings. |

Pose tests re-run after the fixes (all in `out/worlds/XIV_b/`). In every one the joints stay closed:
- Truffle Boar: charge.
- Pond Swan: lunge.
- Lady: palm blow.
- Green Lion: paw swipe.
- Beekeeper: skep thump.
- Mole-Catcher: stab.
- Flower-Strewer: fling.
- Orchard Picker: throw.
- Lady's Fool: slap.
- Scarecrow: lurch.
- Blight Snails: slide.

### Still short after this review (honest)

- **Lady of the Bower:** the face, bodice and roses now reach the bar. The far arm still reads as an angular bent tube with a box-like sleeve. Her legs are absent by design (she is the bed). Overall she is closer to the Drowned King but still has less material variety than him. The big roses can still look slightly cushion-like at 0.5x.
- **Green Lion:** near-black by design. The mane reads more as a column behind the head than as a ring round it. The bible's "only the lower jaw in frame" was overridden for the director's clear head.
- **Truffle Boar:** the near legs are a little long and straight for a pig, and the disc still reads slightly as a flat pink ellipse at sheet size.
- **Pond Swan:** the upper back between the wings is the plainest area. The far wing is darker but close in shape to the near one.
- **Beekeeper:** the chest is mostly hidden by the skep arm; the improvement shows on the back line.
- **Blight Snails:** the dead stems are now behind the near snails and barely visible.
- Spore puffs and petals are still baked into the figures; they could move to FX.

### Holds that need IK

- **Mole-Catcher:** the spade is on `hand_n`; the far fist on the crutch must be IK'd onto the shaft.
- **Orchard Picker:** the ladder hangs on `hand_f` and also rests on the far shoulder; keep the rail on the shoulder when the torso moves.
- **Green Lion:** the gardener's body rides `arm_n_2` and hangs plumb only at rest. In the swipe it swings with the forearm; it needs a counter-rotation or its own bone.
- No other two-handed holds.

## Ruler upgrade pass (round 2, 2026-11-24)

Director's notes: the Lady's pale mannequin face, tube raised arm with a boxy sleeve and cushion roses; the Green Lion's
cartoon shark gape and column mane. Compared at 2-3x and at sheet size against the Drowned King. Backups of the files
and the old renders are in scratch `rp2/bak/`. Only this world's files changed (world_XIV_b.js, kit_XIV_b.js).

| Ruler | What changed | Before / after |
|---|---|---|
| Lady of the Bower: face | `ladyFace` rewritten (only the Lady uses it). Warm-to-cool value plan: lit planes near bone-white, a warm reddish terminator, the planes turning away cool lilac-grey, warm near-black in the deepest recesses. Planes laid at real strength: forehead, brow ridge, sockets, cheekbone and the hollow under it, nose bridge and side plane, the nose's cast shadow, philtrum, chin ball, jaw underplane with warm bounce light; contour hatching round the far side. Lids with thickness (convex lid with its own light and shadow, crease, heavy lashed margin, hanging lashes, a sliver of eye, lit lower rim); lips with volume (cupid's bow, shaded upper lip, full lit lower lip with a wet light, pinched corner). Blight: lilac veins down the temple and far cheek, a split bark patch over the hairline with caps fruiting into the hair and fungal fur at its rim; the swollen cheek is now tones on the face (bruise, lit swell, shadow under it, speckled mould), not a pale disc. Hair framing the face in six varied hanks (swept back from the brow, one falling past the jaw with a rose knotted in). | Before: one flat pale tone, eyes as strokes (mask). After: posterised value map shows lit front planes, a cool side and dark recesses; at 2-3x the lids and lips have form. |
| Lady: raised arm and sleeve | Both arms now use `modelArm` (local): deltoid cap, biceps high inside against triceps low outside, a rounded elbow knob with a crook fold, the forearm's extensor swell high and a hard taper to a slim wrist; hard-edged cool core shadow, warm terminator, reflected light, lit planes, veins, hatching in the core. Sleeves are `sleeveBunch` (new kit helper): velvet pushed down and bunched, zigzag compression folds, lit swells, lining at the mouth, rotted braid; a hanging lip falls plumb from the far sleeve. The near sleeve's box is replaced the same way. The bare back and shoulder got the same value plan (core shadow, terminator, shoulder blade). | Before: an angular even tube, a box sleeve. After: the arm reads as an arm at sheet size; the sleeves read as cloth. |
| Lady: roses | `rose2` (new kit helper): guard petals splayed and rolled back, a middle ring and a cup round a spiralled heart, each petal its own shape with a dark gap at its base, a lit rolled lip, browning on many rims, torn notches, a dropped petal curling off some fronts; drawn back to front. Used for the bed ranks (now 42/30/17), the canes, the hair, and the eye-blooms (the eye opens in a rose's heart). | Before: cushions at half size. After: roses at 0.5x and at sheet size. |
| Green Lion: mane | A ring of three tiers of clipped leaf pads on an ellipse round the face (outer tier darkest, inner on top), each pad lit on its top with a lit clipped edge and a black pocket under its lip; a dark bed under the ring; a dead pad shows the iron frame; puffballs, eyes, the nest and the rope harness kept. | Before: a column behind the head. After: a ruff round the face at sheet size. |
| Green Lion: head and gape | The head carved stern: a straight overhanging brow shelf (lit top, black shadow over the sockets, two frown furrows), narrowed eyes deep in the sockets, a long flat nose bridge lit along its top, a clipped nose block, a great clipped cheek, whisker pads with a scalloped lip, clipped ear, shear cuts. The gape is a dark hollow: inner walls as dim clumps receding into black, a black throat, dead twigs across it; teeth are five dark, crooked, splintered stakes with their roots sunk in shadow, plus thorny briars along the lip and jaw. Gardener, ladder, planter, label, shears, holes, nest kept. | Before: a cartoon gape with white triangle teeth. After: a dark hollow with irregular dark stakes; a carved topiary lion at sheet size. |

Checks after the pass: both re-rendered, re-rigged (no MISSING JOINTS: Lady 16 layers / 11 bones, Lion 14 / 13 as
before), pose tests re-run (Lady palm blow `upperarm_f -6, forearm_f -7, hand_f -12, head -5`; Lion swipe `arm_n_1 -28,
arm_n_2 -30, chest -6, jaw 8`, the gape opens dark), sheets rebuilt with `sheet_XIV_b.py`. The Truffle Boar shares
`cervidLeg` with world XIV's change and re-renders pixel-identical. Bible departure kept: the Lion's head is in frame
(crown cropped) on the director's earlier ruling.

Still open: the Lion is near-black by design, so its planes read mainly by their lit edges; the Lady's circlet flowers
and the bed's pale mould blotches are unchanged; spore puffs remain baked in.
