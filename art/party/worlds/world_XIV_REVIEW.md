# World XIV, The Blighted Garden: review (first batch of 8)

Eight creatures in `worlds/world_XIV.js` (helpers in `worlds/kit_XIV.js`, sheet script `worlds/sheet_XIV.py`). Seeds 1400 + index in brief order: Antlered Mother 1400, Gardener 1401, Blight Dryad 1402, Fungal Husk 1403, Spore Deer 1404, Thorn Knight 1405, Moth Witch 1406, Root Horror 1407. Every figure is a foe: drawn facing right with `kit.foeBase` (through `kit_XIV.base`) and `flip: true`. `groundY = canvas h - 30` on every figure (checked in each rig.json: 1570, 1370, 1470, 790, 1070, 1070, 790, 1070). Renders `out/worlds/world_XIV_<key>.png` and `_sil.png`; rigs `out/rig/worlds/world_XIV_<key>/` (no MISSING JOINTS on any); pose tests `out/worlds/XIV/<key>_pose.png`; sheets `out/worlds/XIV/sheet.png` (true relative scale, Drowned Thrall at 1.0) and `out/worlds/XIV/sil.png` (human about 190 px). No grip prints a `move the elbow` warning.

The later batch (Lady of the Bower, Green Lion, Lady's Fool, Truffle Boar, Scarecrow, Blight Snails, Flower-Strewer, Mole-Catcher, Pond Swan, Orchard Picker, Beekeeper) was read only to keep silhouettes free: nothing here reclines under an arch, rears as a hedge lion, capers in a three-pointed cap, crests the back with mushrooms (the Spore Deer keeps its growth on the antlers; the Truffle Boar owns the crest), spreads its arms on a crossbar (the Moth Witch's arms are in, her wings rise in a V), carries a basket, ladder, skep, spade or urn, or arches an S-neck between wings.

| Figure | Tier | Canvas | Note |
|---|---|---|---|
| The Antlered Mother | ruler 4 | 1600 x 1600 | body = Silence Stag anatomy at 1.76x (withers 1.58 humans); antlers and great roots run out of the frame top |
| The Gardener | elite 2.0 | 1100 x 1400 | |
| Blight Dryad | elite 2.2 | 1100 x 1500 | heightened at the same scale (1408 px) per guide section 2; raised branches break the frame top |
| Root Horror | large 1.6 | 900 x 1100 | |
| Thorn Knight | large 1.4 | 900 x 1100 | |
| Spore Deer | large 1.3 | 1100 x 1100 | widened for the body length |
| Fungal Husk | human 1.0 | 600 x 820 | |
| Moth Witch | human 1.0 | 900 x 820 | widened for the spread wings |

## Palette decision (logged)

The world palette is sick pastel blooms (pink, lilac, pale yellow) over black loam, plus ink, bone and grey. Colours the entries name outside it were rendered inside it:
- Gardener "moss green", Thorn Knight "briar green", every moss, briar, leaf and sepal: rotted near-black greens (`P.rot`, `#262d25` family, saturation under 0.3; the pixel scan finds 0.00% saturated green on all eight).
- Spore Deer "fawn" and Fungal Husk "brown cloth", the Gardener's apron and every leather: loam browns (`P.loam*`).
- Gardener "straw": the palette's pale yellow. Thorn Knight "dark steel" and the Dryad's "dead grey wood": grey. Sap: pale yellow (amber is outside the palette).
- Red: none drawn. The pixel scan's 0 to 1% "red-hue" pixels are the palette's dusky pinks (pink, pinkD) and `B.head`'s warm nose tint. Gold: none (no holy object in this batch). Eyes: used freely, as the bible expects in this void world.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (non-humanoids: one spine, legs carry weight, jaw on a hinge); 2 objects face the user, gaze; 3 grips and hands; 4 weight; 5 contact and attachment, plumb hang; 6 facing and light. "Fixed" means it failed during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Antlered Mother | fixed | n/a | n/a | pass | fixed | pass | 1: the first head sat on a thin vertical neck block high in the frame; the poll is lowered to y 470 and the neck rebuilt thick and curved from withers and chest. 5: the wounds were drawn before the shoulder and haunch masses and hidden by them; they are now drawn over them. |
| The Gardener | pass | pass | fixed | pass | pass | pass | 3: the shear halves first had each blade on the other handle's line (the levers bent at the pivot); each half is now one straight lever (handle and blade collinear), crossing at the pivot bolt. Both fists via `B.grip` (near maxBend 40, the handle diagonal across the palm). |
| Blight Dryad | pass | n/a | n/a (twig hands) | pass | pass | pass | Weight goes through the trunk-skirt into four gripping roots. |
| Fungal Husk | pass | pass | fixed | pass | pass | pass | 3: the hanging fist on a vertical handle would be the forearm-along-object fault; the trowel's handle now crosses the fist square to the hanging forearm, blade forward and down, thumb side forward. The head lolls on the neck (centre 26 px ahead of the neck base), pushed by the cluster behind it. |
| Spore Deer | pass | n/a | n/a | pass | pass | pass | Three hooves planted, the near fore lifted 40 px mid-jerk; cervid legs after the Silence Stag (elbow/stifle, carpus/hock, cannon tendon, fetlock, dewclaws, cloven hoof). |
| Thorn Knight | pass | pass | pass | pass | pass | pass | Sword: `B.grip` inline (sword exception), thumb up, blade forward-down from the cross. Pauldron and moss on the torso bone. |
| Moth Witch | pass | pass | pass | pass | pass | pass | Wings root between the shoulder blades on the torso; hair hanks hang plumb in screen space. |
| Root Horror | pass (one spine: trunk_1 > trunk_2 > head) | n/a | n/a | pass | pass | pass | Buttress roots dive into the loam on both sides. |

## Gate 2: style and detail

| Figure | Signature at 190 px | Toxin marks / Never | Void marks / Never | Grit (need) | Layers | Palette | Unique sil. | Section 8 | Fix |
|---|---|---|---|---|---|---|---|---|---|
| The Antlered Mother | pass: vast antlers over a white hind | brackets, blooms and caps erupting from two torn hide splits with pink lips, moss along the back and on every tine, mould, galls, peeling hide, browned garland / no slime, no glow | clean holes through ear and haunch (see-through), ~30 lidded eyes in fungus, antlers, roots, neck and cheek, blinking at different points / no sparkles | 18 (12): the Tooth (cusped molar, two roots, crack, moss), garland, hanging rootlets, moss, blooms on beam and back, brackets on antlers, coronets with pearling, dewclaws, roots from hooves and up the legs, great roots to the sky, scars, pustules | hide, fungus, roots | pass | pass | fixed | Flank fungus first read as a neat belt of shelves: now torn lens wounds with rolled lips, tiers of mixed shelves and caps. Antlers were mostly cropped: lowered head, beams sweep back across the frame top. Eyes scaled x1.6 to read at sheet size. |
| The Gardener | pass: wide flowering hat and open shears | fungus cloak in overlapping bracket tiers with side shelves breaking the outline, flowering hat, moss on smock and boots, mould, pustules / none | clean hole through the brim, four eyes in the cloak / none | 14 (10): hat band, blooms and caps on the hat, frayed brim, smocking, apron pocket with pruning knife and bast, neck strap, butt caps, ferrules, pivot bolt, honed edges, rust, clippings | smock, apron, fungus cloak | pass | pass | fixed | Cloak first read as a dark slab with shelves only on its edge: now tiered shelves across it. Sleeve was a box: narrowed. Stoop moved into the upper back. |
| Blight Dryad | pass: branching arms of a dead tree | brackets on both shoulders and up the trunk, leaves of rot girdling the hips and on the twigs, moss and fruiting stalks at the base, mould, fungal fur in the hollow / none | clean see-through hole where the heart-wood was (heart-wood rings cut by it), eyes in the rotten hollow / none | 12 (10): knots, splits, bark furrows, carved brow/nose/lips/chin, sap tears, twig hair, root grip, leaf girdle, hollow, shelves | wood, leaves, fungus | pass | pass | fixed | Head read as a capsule mask: angular carved skull with proud brow, nose, lips and chin. Trunk was a straight pillar: curved waist and knee, flared base, knots and furrows. |
| Root Horror | pass: rearing root knot with ring mouth | buds and blooms, brackets, mould, fungal fur, galls / none | throat flat black to a clean pale edge, clean hole through a free root, nine eyes in the bark (pink lids so they read) / none | 11 (6): three rings of thorn teeth, radial bark furrows, braided strands, rootlets, buds, blooms, brackets, galls, heaped loam, buttresses | roots, bark lip, fungus | pass | pass | fixed | Free roots read as smooth even tentacles: kinked paths, faster taper, knots. Braided strands had a sawtooth edge (fast width ripple): slowed. |
| Thorn Knight | pass: armoured figure bristling with briars, rose on the helm | briar canes bursting from visor, armpits, couter, poleyns, faulds; thorns wound round both vambraces; moss in plate seams; mouldy rotted livery; rust as loam / none | clean hole through the livery, void disk in the breastplate and pauldron, eye in the visor tangle and in the elbow knot / none | 14 (6): bascinet with hounskull visor, breaths, pivot rivet, aventail, pauldron, couters, poleyns, sabatons, faulds, wheel pommel, wrapped grip, embroidered rose badge, rose with leaves | arming coat and hose, mail, plate, livery | pass | pass | fixed | Canes first read as wires: now bursts of thick hooked canes. Rose read as a flat donut: rebuilt cupped with back petals, rolled lips, swirl, sepals. Hem was a cartoon scallop: ragged. |
| Spore Deer | pass: coral antlers over a low head | coral fungus from the soft antler beams, mould bloom, peeling hide to pink flesh, pustules, fungal fur on the spine, puffballs at the withers / none | clean see-through holes in flank and ear, eyes at the coral forks / none | 9 (6): coronets, pearling, clouded eye, tear pit, dark muzzle, pale belly and rump, dewclaws, puffballs, kink crease | coat, coral, mould | pass | pass | fixed | Coral first drew as self-crossing dark sticks (tip cap appended after the return side): polygon order fixed, branches fattened and blunt. |
| Fungal Husk | pass: the mushroom crown | crown of caps through a split cap, cluster bursting from the neck, caps in the split shoulder seam, side-on brackets down the back, mould, pustules, peeling skin, hyphae / none | clean hole through apron and jacket skirt, eyes in the back brackets and the neck cluster / none | 12 (6): seed packet, dibber, twine ball, kneeling pad, gaiters with buttons, elbow patch, rolled sleeve, missing button, apron strings, loam on the trowel | shirt, jacket, apron | pass | pass | fixed | Brackets on the back read as balloons: new side-view `bracketSide` (wedge with zoned top, pored underside). Trowel blade read as a knife: broad heart blade. Crown made taller and denser. |
| Moth Witch | pass: spread moth wings with eyes | scale dust falling (spore), mould on wings, shift and skin, fungal fur at wing margins and ruff / none | clean holes through both wings, real eyes in the eye-spots (one shut, one half, one open) / none | 11 (6): moth-fur ruff, feathered antennae, wing cross-lines, veins, eye-spot rings, rope girdle, herb bundle with dried flowers, torn hem, sleeve, hair hanks | skin, shift, wings and ruff | pass | pass | fixed | Shift was lilac and merged with the wings: undyed linen. Face read bearded: no face hatching, lighter jaw shade (0.68). |

Section 9 (which course did this, to whom, does the bible say so):
- Antlered Mother: toxin split the white hind's hide and grew the garden out of it; void opened the eyes (bible, pushed hard). An animal, as listed; the fey garland keeps who she was.
- Gardener: toxin grew the cloak and the hat's flowers, put flowers in the eye sockets (bible). Remnant: hat, smock, apron, shears.
- Blight Dryad: toxin rots the oak; void took the heart-wood (bible). Remnant: a woman's carved shape.
- Root Horror: toxin's buds and shelves, void's throat and eyes (bible "eyes in the bark").
- Thorn Knight: toxin's briars through the gaps and the rose (bible). Remnant: plate, sword, the garden's rose livery.
- Spore Deer: toxin's coral on the antlers (bible). An animal; clouded eyes.
- Fungal Husk: toxin's crown pushed hard (the one distorted part); remnant: under-gardener's jacket, apron, trowel.
- Moth Witch: toxin's scale dust and mould; void made the eye-spots real (bible). Remnant: a wise woman's shift and herb bundle. Nothing taken from Bloodborne for its own sake.

## Pose tests (the attack from each Motion line)

Sign convention for the mirrored rigs: positive turns a bone clockwise on screen.

| Figure | Bones | Test | Result |
|---|---|---|---|
| Antlered Mother | 23: spine_1 > spine_2 > neck > head > jaw, ear, antler_n (> tooth), antler_f; tail; 4 legs x 3; roots | spore exhalation (`neck 8, head 12, jaw -14, antlers -2`) | pass, joints closed |
| Gardener | 20: standard + shear_a, shear_b, cloak, hat, apron | shear cut (`torso -4, arms -8..-12, shear_a -8, shear_b 8`) | pass; the two halves leave the shared pivot when the arms move (see IK) |
| Blight Dryad | 11: trunk > pelvis > torso > head; arms; roots | roots burst, arms sweep (`trunk -3, torso -5, upperarm_n 30, forearm_n 20, far arm -15`) | pass |
| Fungal Husk | 18: standard + trowel, skirt, crown | spore burst (`torso 10, head 12, crown 14, upperarm_n 10`) | pass |
| Spore Deer | 20: spine_1 > spine_2 > neck > head > antlers, ear; tail; legs | antler charge (`neck -12, head -10, antlers -4, leg_fn_1 10, leg_fn_2 -20`) | pass |
| Thorn Knight | 18: standard + sword, skirt, rose | sword cut wind-up (`torso -6, upperarm_n 50, forearm_n 40, sword 10`) | pass; the raised arm passes in front of the helm in the wind-up |
| Moth Witch | 20: standard + wing_n, wing_f, antennae, skirt, hair | wing beat (`wing_n 24, wing_f -20, near arm 20/10`) | pass, wings stay rooted |
| Root Horror | 8: trunk_1 > trunk_2 > head > lips; arm_1..4 | grab and bite (`arm_1 25, trunk_2 8, head 12, arm_2 -10`) | pass |

Holds that need IK: the Gardener's shears (two hands on two halves sharing one pivot: shear_b rides hand_f, shear_a hand_n; the game must keep the pivots together, IK the far arm onto its handle, or rotate the halves only about the pivot). No other two-handed holds.
Animation notes: the Mother's eyes blink "in waves" by sprite swap (open/shut), not by bones; the eyes in the growth sit on spine_1, spine_2, neck, head and the antlers.

## Rework after the coordinator's sheet check (2026-11-23)

Every item was fixed in `world_XIV.js` / `kit_XIV.js`, then re-rendered, re-rigged (no MISSING JOINTS), pose-tested and
the sheets rebuilt. Checked at 1.2 to 1.6x against the Silence Stag and the Plague Wolf.

| # | Note | Fix |
|---|---|---|
| 1 | Mother: slab body, column legs, box head, stick antlers, sticker eyes and fungus | New shared cervid anatomy (`CERVID`, `cervidBody`): a barrel with a withers hump, a dipping back, a sloping croup, the point of the buttock, a chest dropping below the elbow, a belly rising into a tucked flank, the stifle fold. Form is drawn with creases (the shoulder blade's spine and the hollow behind it, the elbow, the ham seam, ribs, the flank fold), soft tones (lit back, dark belly, round ham), contour hatching (`contourHatch`) across the belly and behind the ham, and rot stains. Legs: heavy upper legs tapering hard to thin cannons (fore 230/150/62/50, hind 330/200/70/52 px), knee and hock angled, fetlocks bent, 2x cloven hooves and dewclaws; far legs 42% darker; the inner legs shaded and hatched. New head (`cervidHead`): a long tapering skull with the occiput, a brow ridge over a deep socket, the nasal bridge, a soft mottled muzzle and nostril, the masseter, zygomatic ridge and jaw line; grief knots the inner brow, a stained tear track, crow's feet, grey whiskers. New antlers (`heavyAntler`): a knobbled burr, a beam 78 px at the burr tapering to 22, beaded and furrowed with a rough edge, curved tines with fillets, moss, strips of shed velvet hanging plumb. Eyes cut to 12 on the body and antlers, each set into the flesh (see 5). |
| 2 | Deer: box body, slab legs, candy coral | The same cervid anatomy at 0.54. Coral in one dusky pink family that pales toward pointed tips, shaded and hatched, chunkier branching. Coat broken with hatching, rot stains, mould, peeling. |
| 3 | Dryad: even tube, idol head, scale girdle, untapered arms | The trunk tapers to a knee and flares into buttresses over big roots. Bark is narrow, tall plates in twisting columns with dark furrows between them (`barkPlates`), swelling over the hip and breast, ribs creased through the bark. The skull is barked over at the back; the carved face has a knotted brow, an open crying mouth and sap tears. The girdle is now bindweed: strands hanging at uneven lengths with dead leaves and a few pale trumpets. The arms taper (46 to 22 px) with knuckle knots before the twigs. |
| 4 | Knight: boxy torso, hidden pauldron | The breastplate swells over the chest (lit swell, shadow under it, hatching) and pinches at the waist; a plackart laps its lower half with a rolled edge and rivets; the faulds flare over the hips, each lame lapping the next with a lit lip. The pauldron is larger (4 lames), lit, and the cane that crossed it is redirected. |
| 5 | Fungus as flat pastel stickers; Gardener's column of identical shelves | All fungus helpers were rewritten: crosshatched shadow, darker gills and undersides, a soft cast shadow on the host (`hostShadow`), sizes skewed in clusters (a few big, many small), some torn or drooping, rot blotches. The palette's pastels were desaturated toward ink (pink `#bf98a0`, lilac `#a49aac`, yellow `#cfc495`). Each host carries its own fungus: zoned turkey-tail brackets (Mother), oyster shelves with gills (Gardener's cloak, now irregular clusters), ink caps with blackening margins (Husk's back) plus gilled caps (crown), woody hoof brackets (Dryad), coral (Deer), puffballs (Root Horror), none on the Knight (briars and moss). Eyes (`eye`) now sit in a soft wet socket shadow with a fold above and a pouch below, and no sticker outline. |
| 6 | Outline strokes boxing body masses | The separately outlined shoulder and haunch shapes are gone (the shoulder blade and ham are creases and tones in the barrel). The neck has no ink and no cel band where it joins the shoulder; its contour is inked only along the crest and throat. Cel-shadow depth on the barrel and legs was cut (maxShade 20 and 0.12 of leg width) so the band no longer reads as a second outline. |

Pose tests re-run after the rework (same attacks; the Mother's jaw test is now `jaw -8`): all joints stay closed.

## Still open (honest notes for the director)

- **Antlered Mother:** much closer, but the head is still the weakest part. At full size the skull reads as a long deer
  skull with grieving eye detail, but the cel band and the jaw part still flatten it a little against the Drowned
  King's modelled face. The near legs remain the brightest pale area on the sheet.
- **Gardener:** the smock is still a plain pale block behind the apron, and the oyster clusters still gather along the
  cloak's back edge, because the body hides the rest of the cloak.
- **Spore Deer:** the coat is still the plainest large area on the sheet. It has hatching and stains now, but no
  sharper markings.
- **Dryad:** the bark plates read well on the trunk. On the narrow torso they are close to a regular brick rhythm.
- **Thorn Knight:** the pauldron reads, but the canes and the near arm still cover much of it.
- **Fungal Husk:** the head lolls forward more than sideways (the neck cluster carries the sideways bend).
- Spore drift and the Witch's dust are baked specks; they could move to FX like the lightning ruling.

## Independent review (2026-11-23)

Reviewer, not the maker. Read MAKER_BRIEF, GUIDE, LOGIC_CHECKLIST, REVIEW, bible 00 and XIV, this file; studied the
Drowned King, Silence Stag, Plague Wolf, Barrow King and Magma Hound renders. Worked through the director's six callouts,
then re-rendered, re-rigged and pose-tested every changed figure and rebuilt `sheet.png` and `sil.png`. Compared the
Mother side by side with the Drowned King and the Silence Stag at one display scale (0.42) before closing item 1.

### What changed

| # | Callout | Fix (file) | Re-check |
|---|---|---|---|
| 1a | Mother: one pale mid-light value, flat cut-out | `cervidBody` (shared with the Deer): hide base lowered to mid-light (`bone`/`grey` 0.3) so the lit top line can read; new value plan lit from the upper left after the flip: a bright band along the top line and croup, the barrel turning under into a dark belly core, the girth hollow behind shoulder and elbow, under the ham and the stifle, the back of the ham in shadow; the round of the quarter and the front of the shoulder kept lit; a reflected-light line inside the belly edge. Cel band cut to `maxShade 14`, `hi 0`. Form-following hatching: cross-contours round the belly (two crossing passes in the core), verticals in the girth hollow, arcs round the ham and under the stifle. Legs: back of each leg and the body's cast shadow over the upper leg dark, front edge lit, hatching down the back; far legs mixed 70% toward the shadow colour (inside of the far legs). `o.vk` scales the range per figure (Mother 1.15). | Pixel scan down the barrel: 220 at the top line to 64 to 90 in the belly core (was one pale band); near foreleg 90 (back) to 198 (front); back of ham 30 to 70. Side by side with the King and Stag: she now has the widest value range of the three. |
| 1b | Mother head: wedge plus plank jaw, flattened by the cel band | New `motherHead`: one skull outline (occiput, poll, curved forehead dome running into the nasal bone, the muzzle rounded and raised), no cel band (`shade ~0`), planes laid by world-space soft tones shared by skull and jaw so the under-plane runs on across both; the jaw drawn under the skull with no ink where they meet (only the true outline, the mouth line and the jaw angle are inked); deep orbit under a brow ridge, masseter lit with its shadow beneath, tear pit, back of the jaw turning away; soft mottled muzzle, nose leather, flared nostril with a lit wing and the fold behind it, split upper lip, lower lip with a wet lit edge, whisker pores, grey whiskers; jittered contour hatching (no comb rhythm). Ears: near ear with a shaded inner cup, deep at the base, pale hair along its front rim; a darker far ear behind. Grief: a swollen heavy lid down over half the eye with hanging lashes, the inner brow drawn up, crow's feet, a stained wet tear track running plumb from the inner corner to a drop at the jaw. Mouth interior drawn on the head bone under the jaw so the exhalation opens onto dark. | 2x crop: reads as one modelled skull; pose test (jaw -10) opens a dark mouth, no tear between jaw and cheek. |
| 1c | Mother neck: slab joined by a seam | Neck is now part of the barrel's own outline (`neck` option of `cervidBody.barrel`): crest from the withers to the poll, throat to the brisket, drawn once and split three ways (spine_1, spine_2, neck) at the neck root. Planes: crest lit, the long muscle lit along its top and running on into the point of the shoulder, jugular groove, throat underside dark, contour hatching. Throat ruff: one matted mass hanging plumb, dark at the root, its lower edge broken into clumped pointed locks, strand lines per lock, moss matted in, loose locks in front. | No line between neck and shoulder in the render. First pose test opened a gap at the throat (cut disk 90 px, 250 px from the throat): neck pivot moved to the centre of the neck root [1105, 675] and the overlap disk widened to 195; re-test closed. |
| 1d | Keep antlers, Tooth, brackets, eyes, roots | Untouched; garland re-hung to the new neck, neck eyes re-seated. | Present in the render and rig (37 layers, 23 bones). |
| 2 | Dryad bark: regular vertical strips | New `barkPlates`: the shape is treated as a twisting column (each row's span gives a centre and half-width; columns laid by angle so plates foreshorten at the edges), column widths 0.45x to 1.8x, long ridges pinched at both ends and overlapped so neighbours braid like oak bark, grain spiralling round the body (`twist` + `wave`, opposite hand on torso and trunk), plates shaded by the cylinder and lipped with light; knots that part the grain round them, burls with swirled grain, splits following the spiral, hoof fungus in the furrows. Trunk: 3 knots, 2 burls, 3 splits, 2 brackets. Torso: 2 knots, a burl, a split. Back of the skull: spiralled plates and a knot. | Render and 1.3x crop: no brick or strip rhythm; spiral reads on the torso. Pose (sweep) holds. |
| 3 | Gardener smock: plain pale block | Torso: value turning with the body (lit shoulders, dark back), 8 broad folds (new `fold`: dark valley, soft shadow, lit ridge) from yoke, armpit and down the back, gathers under the apron string, grime blotches, a darned patch in a different cloth with crossing stitches, five sap and rot runs hanging plumb from where the cloak roots, mud rising from the hem; a side pocket sagging with a dibber, a pruning-saw handle and a twine ball. Near sleeve: rebuilt as a capsule rounded into the shoulder (was a square-topped block), four folds spiralling round the arm, dark elbow crook, grime, a sap run. | Render at 0.7x and sheet size: folds, patch and pocket read; no flat pale area larger than a palm. |
| 4 | Spore Deer coat: plainest area | Same value plan as item 1 via `cervidBody` (vk 0.95), shadow colour brown (`coatS` into `loamD`), not black. Neck also moved into the barrel outline (no seam), crest lit, throat and kink dark. Coat structure: dark dorsal line, clumped hair tracts sweeping back and down and fanning round the shoulder, pale belly line. | Render: lit back, dark belly and girth, hair visible at sheet size. Pose (charge) holds; neck pivot at the root centre [712, 630]. |
| 5 | Thorn Knight pauldron hidden | Rebuilt by hand: domed cap with a raised ridge over four lames lapping downward round the shoulder, rolled lit edges, rivets, rust in the laps, moss in the gaps, worn-bright crown, scratches, a clean void hole through the cap; lighter steel, lowered so the cap clears the aventail's hem and drawn over the mail (still on the torso bone); one cane out from under the lowest lame, clear of the plate; moved back so it no longer covers the breastplate's void disk. | 1.4x crop and sheet: reads as a pauldron at 190 px. Pose (wind-up) holds. |

### Gate 1: logic audit (all 8, after the fixes)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Rig | Finding and fix |
|---|---|---|---|---|---|---|---|---|
| Antlered Mother | pass | n/a | n/a | pass | fixed | pass | pass | Neck seam (5) and throat gap under rotation: fixed (item 1c). Ruff, tear and garland hang plumb. Jaw hinge moved under the cheek [hF 60, 72]. |
| Gardener | pass | pass | pass | pass | pass | pass | pass | Both fists wrap their handles along the knuckle row (2x crop); no `move the elbow` warning. Pocket tools sit in the pocket. |
| Blight Dryad | pass | n/a | n/a | pass | pass | pass | pass | Weight through the trunk into four roots. |
| Root Horror | pass | n/a | n/a | pass | pass | pass | pass | Unchanged; re-rendered and re-rigged clean. |
| Thorn Knight | pass | pass | pass | pass | fixed | pass | pass | Pauldron now sits over the aventail on the torso bone; sword grip inline, no warning. |
| Spore Deer | pass | n/a | n/a | pass | fixed | pass | pass | Neck seam: fixed (item 4). |
| Fungal Husk | pass | pass | pass | pass | pass | pass | pass | Trowel handle square across the hanging fist (2x crop). |
| Moth Witch | pass | pass | n/a | pass | pass | pass | pass | Unchanged; re-rendered and re-rigged clean. |

Machine checks on all 8 (re-run after the last render): `render_rig.js` printed no MISSING JOINTS and every drawn bone has a
joint; rig.json `ground` = canvas h - 30 on all 8 (1570, 1370, 1470, 1070, 1070, 1070, 790, 790); `flip: true` on all 8
(foes face left, key light upper left after the mirror); seeds 1400 to 1407 in brief order, no collision; palette scan
(half size, opaque pixels): saturated red 0.00%, gold 0.00%, saturated green 0.00 to 0.04% (briar leaf edges) on every
figure. Eyes used freely (XIV is a void world).

### Gate 2: style and detail (reviewer's pass)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Antlered Mother | below the ruler bar: flat value, wedge head, slab neck | items 1a to 1c | Grit now 22+ (adds ruff, moss in it, tear track and drop, heavy lid, ear hair, far ear, nostril and lip detail, whiskers, mouth interior). Section 9: toxin and void as before; grief is the white hind's own (bible "too human" eyes), nothing taken for its own sake. |
| Gardener | flat smock | item 3 | 10+ grit holds and the smock now carries patch, pocket and tools, sap runs, folds. |
| Blight Dryad | strip rhythm | item 2 | Knots, burls, splits and fungus inside the silhouette; outline unchanged. |
| Spore Deer | plain coat; neck seam | item 4 | Coat has value and hair structure. |
| Thorn Knight | pauldron unreadable | item 5 | Reads at sheet size. |
| Root Horror, Fungal Husk, Moth Witch | no new faults found | none | Sheet size and sil checked. |
| Silhouettes | checked against each other and the rest of the bible's XIV roster | none needed | All 8 distinct in `sil.png`; nothing reclines under an arch, rears as a hedge, capers in a cap, crests the back with mushrooms, spreads on a crossbar, carries a ladder, skep, spade, urn or basket, or arches an S-neck. The Spore Deer (low head, coral) and the later Truffle Boar (low, crest along the back) stay apart by the coral and the leg length. |

### Still short after this review (honest)

- **Antlered Mother:** the value range is now real, but at sheet size she is still the lightest mass on the sheet (the
  bible makes her white) and the middle of the barrel between the wounds is the quietest area on her. The antler burr
  over the poll is still a flat lumpy disk, and the near antler's pedicel is a plain quad. The ruff's lit tips can read
  a little like icicles at small size; they are matted hair (toxin), not frost, but a darker tip pass would remove the
  doubt. She is closer to the Drowned King's modelling than before; the King still has more material variety.
- **Gardener:** the smock now has structure, but the front strip of the chest beside the apron is still plain.
- **Spore Deer:** its head is still the maker's `cervidHead` (wedge with a plank jaw); the director did not call it,
  and the Mother's `motherHead` could replace it in the consistency pass.
- **Thorn Knight:** in the wind-up pose the raised sword arm passes in front of the helm (z order, needs a per-frame
  `z_index` in Godot).
- Spore drift and the Witch's dust remain baked specks (could move to FX like the lightning ruling).

### Holds that need IK
- Gardener's shears only (shear_a on hand_n, shear_b on hand_f, sharing one pivot): keep the pivots together, IK the far
  arm onto its handle, or rotate the halves only about the pivot. No other two-handed holds in the batch.

### Pass 2 (director's follow-up, 2026-11-23)

| Item | Fix | Re-check |
|---|---|---|
| Mother legs: even pale columns | `cervidLeg` (kit_XIV) rebuilt from explicit profiles. Forearm and gaskin taper hard into the joint. The cannon is about 40% of the forearm's width (front: 38 px against a forearm of about 90). The front knee has a flat-fronted bony knob with a defined lower edge, and the accessory carpal stands out behind. The hind gaskin tapers hard to a sharp point of the hock with the Achilles tendon lit along it. The tendon line runs down the back of the cannon with its groove. The fetlock bulges at the joint and keeps its dewclaws, with an ergot tuft. The pastern is short. Stockings: darker, coarser hair from just above the knee/hock to the hoof, its top edge broken by hair strokes (Mother `mix(hideS, loamB)`, Deer near-black brown; far legs darker again). Roots now wind round all four legs as a helix from the hoof: runs behind the leg are drawn before it, runs in front after it, and each front run throws a shadow on the leg. This replaces the maker's zigzag climbing roots. | Lower near foreleg measures about 80 against about 157 above the knee. Knees, hocks and fetlocks read in `sil.png`. |
| Mother body: airbrushed smooth | A darker dorsal stripe. About 900 short hair strokes (dark trough, lit ridge) in tracts that follow the form: back along the barrel, down off the withers over the shoulder, down the thigh from a whorl at the flank, back and down under the belly. Five moult patches of grey skin with tufted rims, one on the neck. | Coat texture visible at sheet size. |
| Mother antlers: straight fanned sticks | `heavyAntler` rewritten. The beam still sweeps back and up, then forward. Every tine leaves the front of the beam, runs forward and curves up and back to its point, and each has a different length (270, 196, 240, 150, 186, 122 × scale). Lengthwise furrows and dense pearling sit at the base, with pearling at each tine's root. The burr is a ring of 22 overlapping knobs of varied size round a shaded base (back half behind the beam, front half over it). The moss is cut to patches so it no longer reads as chains. | 1.2x crop. The Tooth still sits in the fork between brow and bez tines. |
| Side effect | The antler rewrite changed how many random numbers are drawn before the wounds, which re-rolled the flank brackets into poorer shapes. The wounds now draw from their own seeded generator (`seed*31+3`, chosen from three tries), so later edits cannot disturb them. | Brackets tiered again. |
| Spore Deer head | `motherHead` now takes `o.s` (pixel sizes follow the frame's scale) and `o.grief: false`. The deer uses it at 0.56 with no grief marks. Added a `jaw` joint, so the deer can open its mouth in the charge. | 1.6x crop: one modelled skull, jaw blended into the cheek. |

Re-render, re-rig and pose for both figures:
- Mother: 35 layers, 23 bones, no MISSING JOINTS. Pose `neck 8, head 12, jaw -10, antlers -2` holds.
- Deer: 34 layers, 21 bones, no MISSING JOINTS. Pose `neck -12, head -10, jaw -8, antlers -4, leg_fn_1 10, leg_fn_2 -20` holds.
- groundY 1570 and 1070. Red 0.00%, gold 0.00%. `sheet.png` and `sil.png` rebuilt.

Still short:
- The burr can read slightly like a coiled rope at full size.
- The deer's near ear sits mostly behind its coral.
- The knee and fetlock highlights are soft tones with a drawn lower edge. They are not a hard-edged plane change.

## Ruler upgrade pass (round 2, 2026-11-24): the Antlered Mother

Director's notes: the burr reads like coiled rope; the knee and fetlock plane changes are soft. Backup: scratch
`rp2/bak/`.

| What changed | Before / after |
|---|---|
| Burr (`heavyAntler`, used only by the Mother): a rough ring of up to 20 irregular bony knobs set at uneven steps and distances, a few great gnarls and many small, some leaning up the beam, each with a hard lit top facet, a dark crevice under it and a crack across the big ones, on a rough bony collar. The pedicle is now a short furred column (hair running up it, lit side and hard shadow side, inked only down its sides so its foot runs into the skull); the near antler sits up on it (the `antler_n` joint pivot is unchanged). | Before: a rope of even beads. After at 3x: a gnarled coronet on a stump of hide. |
| Knees, hocks and fetlocks (`cervidLeg` in kit_XIV, new code only behind `o.planes`, passed by the Mother through `cervidBody`): hard-edged facets drawn as sharp polygons: the knee's flat lit front face with its side turning away dark and the step down to the cannon; the point of the hock lit over the dark flexion; the fetlock's lit front-top facet over its dark underside; the pastern's lit front strip; crisp ink at each break. Far legs at 55% strength. | Before: soft blurred tones. After: hard lit planes at 1x and visible at sheet size. |

Checks: re-rendered, re-rigged (35 layers, 23 bones, no MISSING JOINTS), pose test (exhalation: `neck -6, head -10,
jaw 12, antler_n -3`) holds, sheets rebuilt with `sheet_XIV.py` and `sheet_XIV_b.py`. Shared helpers: the Spore Deer and
the Truffle Boar (XIV_b) were re-rendered and are pixel-identical to their previous renders.
