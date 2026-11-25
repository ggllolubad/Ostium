# World II, The Rotmire: review

Eight creatures in `worlds/world_II.js` (helpers in `worlds/kit_II.js`). Seeds 201 to 208 in bible order. All foes are drawn facing right with `kit.foeBase` and flipped. Renders: `out/worlds/world_II_<key>.png` and `_sil.png`. Rigs: `out/rig/worlds/world_II_<key>/`. Pose tests: `out/worlds/II/<key>_pose.png`. Sheets: `out/worlds/II/sheet.png` (true relative scale with the Drowned Thrall at 1.0) and `out/worlds/II/sil.png` (human about 190 px).

Pose sign convention, for whoever animates: rigs are exported mirrored (facing left), and a positive angle turns a bone clockwise on screen. A hanging arm swings forward with a positive angle; a snout or jaw pointing left lifts with a positive angle and drops with a negative one; a torso leans forward with a negative angle.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (for non-humanoids: a jaw on a hinge, segments on one spine); 2 objects face the user, gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing and light. "Fixed" means it failed during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Mire Mother | pass (head only; the jaw opens on its hinge) | pass | n/a | pass (floats in the water) | fixed | pass |
| Bog Troll | pass | n/a | pass | fixed | fixed | pass |
| Coven Mother | pass | pass | fixed | pass | pass | pass |
| Bog Body | fixed | pass | pass | fixed | fixed | pass |
| Fen Hag | pass | pass | fixed | pass | pass | pass |
| Mire Toad | fixed | n/a | n/a | pass | pass | pass |
| Leech Swarm | n/a | n/a | n/a | pass | fixed | pass |
| Fen Lurker | pass | n/a | n/a | pass | pass | pass |

What failed and how it was fixed:
- Bog Body 1/4: the first build stood upright on straight tube legs, with the head stacked on the spine like a mannequin. It is now hunched from the upper back (spine N [330,330] curving through C [238,336]). The skull centre sits about half a head ahead of the neck base, and the neck rises forward out of the hump. The knees are bent but stiff. The centre of mass (about x 290) sits between the heels (214) and the near toes (about 395).
- Bog Body 5: the noose's cut end first hung down the middle of the chest, so the rope passed through the torso. It now leaves the knot at the nape, lies over the top of the hump along the torso outline to the back's outermost point, then hangs plumb clear of the back.
- Mire Mother 5: the opened mouth showed a strip of the cave beyond the chin profile. The cave now stays inside the head silhouette.
- Bog Troll 4/5: the knuckles first hovered off the ground. The wrists were lowered so the fists bear on the ground line. The near peat-slab pauldron was on `upperarm_n` and flew off when the arm lifted. It is now drawn over the arm but bound to `torso`.
- Coven Mother 3: the far hand sat right beside the staff, so both hands read as gripping it. It now holds the knotting cord at her breast, clear of the staff. The staff was also moved forward so its head no longer crosses her nose (GUIDE section 8).
- Fen Hag 3: the mud fist was hidden behind the pole. It now hangs clear of the pole in front of the knees. The pole grip goes through `B.grip`, with the forearm 23 degrees off square and no warning.
- Mire Toad 1: the closed mouth showed a pink strip of the interior, and the throat sac swung back under the body when the jaw opened. The skull and jaw now overlap at the mouth line, and the sac is parented to the head.
- Leech Swarm 5: the spill first hung from the heap and tore away from the jar mouth when the heap moved, and the heap buried the jar's mouth. The spill is now parented to the jar. The jar is drawn in front of the heap with a visible open mouth and lip.
- Every gripping fist goes through `B.grip`. The render prints no grip warnings for any of the eight.

## Pose tests (the attack from each Motion line)

| Figure | Bones | Test | Result |
|---|---|---|---|
| Mire Mother | 14: water (root), head, jaw, lid_n, lid_f, hair, reed_1-4, lantern_1-3, noose_end | mouth opens (jaw -15), reeds and lanterns sway | pass: the cave of offerings and the Tooth show and nothing tears. The blink is a scale key on the lid bones. The gush of water is an effect layer and was not built. |
| Bog Troll | 16: standard humanoid + spade | two-fisted overhead smash wind-up (arms up and folded, torso rearing) | pass: shoulders stay closed and the peat slab stays on the torso. The fists leave the canvas top at full wind-up. |
| Coven Mother | 21: standard + staff, antlers, cord, shawl, charms, skirt | points the staff at the target, head up to spit | pass: the arm stays below the face. The staff tips forward about its grip; the game should also slide the grip along the staff. |
| Bog Body | 18: standard + noose, cape, loin | lunge with both claws reaching, feet planted | pass |
| Fen Hag | 20: standard + pole, lantern, bag, shawl, skirt | mud throw, release frame (far arm flung forward) | pass: the pole stays planted with a counter-rotation. At full overhead wind-up the arm hides behind the hood, so animate through it quickly. |
| Mire Toad | 17: body (root), head, jaw, throat, tongue, four 3-bone legs | tongue strike (head up, jaw down, tongue flipped forward about its front attachment) | pass: the full reach needs a scale key on `tongue`. The throat pulse is a scale key on `throat`. |
| Leech Swarm | 9: ground (root), jar, heap, spill, leech_1-4, crawler | heap surges forward, rearing leeches lunge | pass |
| Fen Lurker | 10: water (root), body, tail_1-2, neck, head, jaw, eye, leg_fn_1-2 | lunge and snap (snout up out of the water, jaw down) | pass: the water stays in front, so the submerged jaw and leg appear only as they rise. |

## Gate 2: style and detail

Signature at 190 px is judged from `sil.png`. Course marks: toxin (swelling, blisters, moss, fungus, peeling) and water (bog-tanned leather, wrinkles, sag, flattening). Never items: slime puddles, neon green glow, fish faces.

| Figure | Signature reads | Course marks / Never absent | Grit count (need) | Layers | Palette | Result |
|---|---|---|---|---|---|---|
| Mire Mother | yes: domed head out of black water, crowned with reeds and hanging lanterns | toadstools, moss crown, bracket fungus, pustules, peeling; tanned, wrinkled, flattened brow and nose, swollen lids / none | 15 (12): 4 reeds, 3 lanterns with bone charms, 2 toadstool crops, bracket, noose with knot and frayed end, the Tooth (iron band, notches), pustules, peeling, crow's feet, hair hanks, bubbles and drool, 5 offerings in the cave | skin, hair, moss, rope | pass | pass, with polish open (below) |
| Bog Troll | yes: hunched mass with the spade handle up over the hump | knitting wounds with green growth, moss sheets, toadstools, pustules; mud, wet moss drips / none | 13 (10): 3 peat slabs with roots and dead grass, lashing rope, spade (blade, side wing, rust, socket, rope-wrapped T grip), pitchfork tines with rust bleed, 4 knitting wounds, broken shackle and chain, toadstools, reeds, pustules, mud | hide, moss, peat slabs, iron and wood | pass | pass, with polish open (below) |
| Coven Mother | yes: oversized antlers over a bent figure with a staff | toadstools and moss on the shawl, bile stain; sodden fringe, wet hem / none | 16 (10): antlers with burrs, cord bindings, twisted wire, raw scalp, blood trickle, 2 shawls, darned patch, bile stain, fringe, 2 dried frogs, bone, bird skull, knucklebones, herb bundle, knotted cord, staff thorns, toad skull with twine, skirt patch | dress, two shawls, charms, antlers | pass (red only for the blood trickle) | pass |
| Bog Body | yes: twisted hump, thrust head, noose end hanging free | toadstools through the hide, blisters, moss, peeling; tanned, wrinkled, flattened chest and skull / none | 14 (6) | skin, hide cape, wool loin, rope | pass (rust-red hair is in the bible) | fixed (see below) |
| Fen Hag | yes: crouched shawled hump, tall pole, hanging lantern | pustule in the mud, moss, toadstools on the pole; wet hem and drips / none | 15 (6) | skin, dress, skirt, shawl, hood | pass (amber only in the lantern) | pass |
| Mire Toad | yes: broad squat body with the bulging throat sac | bile-green poison sacs, warts, pustules, moss; sagging skin folds / no fish face | 10 (6): hook and line, leech, healed gash, gland pores, pustules, warts, moss, torn web, belly creases, hip folds | hide, warts and blisters, moss | pass | fixed (see below) |
| Leech Swarm | yes: tipped jar and the spill | moss on the jar, the fen water; the leeches are glossy black, not slime / none | 9 (6): label with script and water stain, crack with missing shard, wax seal, twine binding, moss, cork, blood-soaked rag, crawler, glass highlights | glass, label, leeches | pass (red only on the blood rag) | fixed (see below) |
| Fen Lurker | yes: a log at rest; jaws in the attack | bracket fungi, toadstools, moss, pustules; old bark, scutes / no fish face | 11 (6): moss, toadstools, 2 bracket fungi, branch stub, eel spear with rust weep, scutes, net, leech, reeds, bubbles | bark hide, moss and fungus, iron and net | pass | pass |

No two foes share a silhouette (`sil.png`). The two robed women are kept apart: the Coven Mother is tall, upright-legged and antlered with a staff. The Fen Hag is crouched to half that height, with a hood, a pole and a hanging lantern.

Style fails found and fixed:
- Bog Body: knee and elbow discs and even-width tube limbs read as a wooden doll. Each limb is now one outline split at the joints (`kit_II.fullLeg`, `chain`), with bulges and a deltoid cap. The barrel loincloth became a hide flap and belt thong. The spine knobs were moved inside the silhouette.
- Mire Toad: the separate ball joints read as dolls' joints again. The legs are now round-capped segments with a fat drumstick thigh over the shin. The bracket fungus on the rump read as teeth and was removed.
- Leech Swarm: the jar read as a flat box and the heap as a smooth black slab. The jar now has a belly, a shoulder, a neck, a flared lip, cylinder banding and an open mouth. The mound has a lumpy edge and about 50 packed leeches. The striped highlight was toned down so the leeches read glossy black. The wax seal was recoloured from dull red to brown.
- Bog Troll: it read as a green plush toy. The hide is now peat-olive with mottling and muscle strokes, and the moss is in draped sheets with hanging strands. The turf slabs are ragged with roots. The eyes no longer glow. The grin became a lipless slit, and the arms are no longer a mirrored pair (GUIDE section 8).
- Mire Mother: the first build was a boxy puppet head with a dummy-jaw seam across the cheek. It was rebuilt as a three-quarter head with crosshatched planes and a broad flattened nose. The jaw is cut along the marionette folds, and the head is scaled to fill the frame.
- Coven Mother: the antlers were cropped by the canvas top and were shortened to fit.

## Still open (honest)
- Mire Mother: the face still reads more stylised than the target. The lids and lips are simplified shapes, and the jaw edge is visible as a fold line. It is the weakest figure against the Darkest Dungeon 2 bar, and the next pass should go there first.
- Bog Troll: the knuckle-walking fists read a little like mitts at full size, and the moss fringes are bright and regular.
- Fen Lurker: the water layer counts in its silhouette, so on `sil.png` it is mostly a flat band with the log above it.
- Lantern glows render as faint grey discs on the silhouette tiles (a soft filter). They are not visible in colour.
- Animation needs: lid and throat scale keys, the tongue extension (scale), the Coven Mother's grip sliding along the staff, the Mire Mother's water-gush effect, and the Fen Hag's throw passing quickly through the hidden overhead frame.

## Independent review

An independent art director and logic auditor reviewed this world after the maker. Fixes were made only in `worlds/world_II.js` and `worlds/kit_II.js`. Every figure was re-rendered and every rig re-exported (each rig's check.png matches its render, mean difference at most 0.004). Each changed creature got a new pose test, and `sheet.png` and `sil.png` were regenerated in the same layout.

New helpers in `kit_II.js`:
- `softTone` paints soft tonal modelling clipped to a shape.
- `stains` adds fractal peat stains and pores clipped to a shape.
- `crease` and `creaseField` draw skin folds: a dark valley with a lit lip on the side facing the light.
- `hairClump` draws wet matted hair: an inked gap, strands that converge on the tip, and a broken wet sheen.
- `textures()` gained a `leather` crackle pattern.

### Ranked findings (worst first) and fixes

1. **S1 Mire Mother read as a cartoon totem.** It had block features, a plank brow, a wedge nose, lips like flat strips and hair like flat stripes. It was rebuilt as preserved anatomy in three-quarter view:
   - A heavy brow ridge with matted brow hair, temples and cheeks sunk to the bone, and slack leather in folds.
   - A nose pressed flat with its bridge kinked, but still a nose: a bulb, a wing with its groove, and nostrils seen from below.
   - Lips shrunk back off long, stained teeth. The gums have receded, one tooth is gone, and the roots are stained.
   - A heavy hooded upper lid half over a filmed bile-green eye, with wet clumped lashes, a rheumy red rim, a baggy lower lid, a tear trough and crow's feet.
   - A crumpled ear with a long lobe, and the hair in about 50 wet matted clumps that converge to points. Peat crumbs, moss, a rotted leaf and a snapped reed are caught in it, and it fans out on the water.
   - The skin carries leather crackle, peat stains, pores, peeling and dull blisters in the hollows.
   - The Tooth is now an old fang with growth rings, a split, notches and a rusted iron band.
   - The noose end lies curled and half sunk on the surface.
   - Seam fix: the jaw is cut down the marionette fold and repeats the head's skin layers in the same user space, so at rest it is seamless. A cave polygon that poked past the seam drew a dark line; it was pulled inside the seam.
2. **S1 Bog Troll had two heads at sheet scale.** The near shoulder showed a round deltoid cap, a horizontal turf "brow", a dark band under it and a hanging moss "beard". That is the same layout as the real head beside it. Fixes:
   - The head moved lower and further forward ([858, 566], head joint at [770, 540]). It now has an underbite with peg teeth, a split flat nose, a torn ear, warts and brow creases.
   - The back of the skull is swallowed by a trapezius mass, so the head thrusts out from between the shoulders.
   - The round cap is now a tapering deltoid with striations.
   - A shoulder mass shares the hump's outline, so the arm's top no longer makes a second dome.
   - The turf slab lies diagonally along the shoulder slope, overhanging the arm and lashed with rope. The moss sheet moved down the arm.
   - Grit added: hide folds on the forearms and knees, and mud in the folds.
3. **S1 Fen Lurker disappeared at game size.** It was a flat log in a thin water band, about 25 px tall on `sil.png`. Fixes:
   - The back now arches about 165 px out of the water as a log hump, with lengthwise bark splits, knot holes, scutes and moss mats with hanging strands.
   - The head breaks the surface: a brow bump with the eye under a heavy lid, a long snout with pressure pits, a nostril knob with two slits at the tip, and interlocking stained peg teeth along a hard lip line.
   - The water has a scum line where the body meets it, a bow wave at the snout and a fanning wake.
   - It still reads as a log first.
4. **S1 Mire Toad read as a round cartoon toad** with a smile and tube legs. It was rebuilt:
   - The body is flattened and much wider than tall (about 530 by 330 px), with a sacral hump, sagging onto the mud.
   - The head is a broad wedge with a hard lipless mouth line that turns down at the corner. Its cel band was thinned, because a thick band along the mouth line read as a grin.
   - The eyes sit on top under knobbed cranial ridges, heavy-lidded, with a horizontal pupil.
   - A kidney-shaped parotoid gland is pitted with pores, with the eardrum below it.
   - The hind legs fold in a muscular Z with dark crossbands and long webbed feet. The forelegs are short and bent, with knobbed fingers turned in.
   - The skin has warts in clusters with dark pores, granular skin between them, fractal blotches, and dull bile blisters.
   - Logic fix: the hind feet rested on the flank about 40 px above the ground line. They are now flat on the mud.
5. **S2 Coven Mother.** The crosshatched lower face read as a beard, so `jawShade` was lowered. The raw skin under the antler bindings read as a red cap at sheet scale; it is now a smaller, inflamed, scabbed patch. The bible's milky eye was a 4 px fleck; it is now a visible blind far eye. Age was added: crow's feet, a nasolabial fold, puckered lips and a sunken cheek.
6. **S2 Leech Swarm.** The leeches read as green striped caterpillars. They are now glossy black-brown, with faint dark rings, a brown dorsal stripe and a tight wet specular.
7. **S2 Bog Body.** The torso read as a leather vest: a smooth block with a light rectangular panel. The panel was softened. Leather crackle and lit-ridge ribs with a costal arch were added. Most of the chest still sits behind the hanging near arm.
8. **Fen Hag.** No change was needed. It passes both gates.

### Gate 1: logic audit (independent re-run)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Mire Mother | pass (jaw on its hinge at the TMJ, [900, 900]) | pass | n/a | pass | fixed (cave stays inside the jaw seam) | pass |
| Bog Troll | fixed (head joint moved; skull centre about 0.55 head ahead of the neck base, hunch from the hump) | n/a | pass (knuckle-walking fists hold nothing; `B.fist` follows the forearm) | pass | fixed (shoulder slab and shoulder mass on `torso`) | pass |
| Coven Mother | pass | pass (staff clear of the face in the point pose) | pass | pass | pass | pass |
| Bog Body | pass | pass | pass | pass | pass | pass |
| Fen Hag | pass | pass | pass | pass | pass | pass |
| Mire Toad | pass (jaw hinge at the mouth corner) | n/a | n/a | fixed (hind feet on the ground) | pass | pass |
| Leech Swarm | n/a | n/a | n/a | pass | pass | pass |
| Fen Lurker | pass (one spine: tail, body, neck, head; jaw on its hinge) | n/a | n/a | pass | pass | pass |

### Gate 2: style and detail (independent re-run, judged on `sheet.png` and `sil.png`)

| Figure | Signature at 190 px | Course marks / Never | Grit (need) | Result |
|---|---|---|---|---|
| Mire Mother | yes: a real drowned head out of black water, crowned with reeds and lanterns | tanned, creased, stained, crackled, flattened nose; blisters, moss, toadstools, fungus / none | 20+ (12) | fixed |
| Bog Troll | yes: hunched mass, single head thrust forward, spade up | knitting wounds, moss, toadstools / none | 14 (10) | fixed |
| Coven Mother | yes | pass / none | 18 (10) | fixed (face) |
| Bog Body | yes | pass / none | 15 (6) | pass, polish |
| Fen Hag | yes | pass / none | 15 (6) | pass |
| Mire Toad | yes: broad flattened warty body, eyes on top, throat | swelling, blisters, warts, glands / no fish face | 15 (6) | fixed |
| Leech Swarm | yes | pass / glossy black, not slime | 9 (6) | fixed (colour) |
| Fen Lurker | yes: log hump with a head and snout; jaws in the attack | bark, moss, fungus, pustules / no fish face | 13 (6) | fixed |

No two silhouettes match. The lurker (low hump and long snout) and the toad (squat loaf with an eye bump) are now clearly apart.

### Pose tests re-run (in `out/worlds/II/<key>_pose.png`)

| Figure | Pose | Result |
|---|---|---|
| Mire Mother | `jaw -15`, reeds and lanterns sway | Pass: the cave and offerings show and nothing tears. The jaw's back edge slides over the cheek as a hard cut-out seam in the open frame (see Still open). |
| Bog Troll | `torso 12`, `upperarm_n 150`, `forearm_n 50`, `upperarm_f 140`, `forearm_f 50`, `head -12` | Pass: the arm comes out from under the shoulder mass and the slab stays on the torso. |
| Coven Mother | `upperarm_n 30`, `forearm_n 20`, `staff -35`, `head 10` | Pass: the staff stays clear of the face. |
| Bog Body | lunge, both claws forward, `torso -10` | Pass. |
| Mire Toad | `head 10`, `jaw -26`, `tongue 168` | Pass: the tongue needs a scale key for full reach. |
| Leech Swarm | heap surge with leeches lunging | Pass. |
| Fen Lurker | `neck 10`, `head 14`, `jaw -28`, `leg_fn_1 30` | Pass. |
| Fen Hag | unchanged | Rig re-exported; the maker's pose still applies. |

### Still open (honest)

- **Mire Mother**
  - At sheet scale the hair is still a warm red-brown mass that can read as a long bob.
  - The ring of the lower-lid bag plus the lid hood reads slightly graphic up close.
  - The open-jaw frame shows a hard cut-out seam down the marionette fold. Godot should soften the jaw layer's back edge with a gradient mask, or keep the open frame short.
- **Bog Troll**
  - The knuckle fists still read a little like mitts, and the moss sheets are regular.
  - The `head` pivot moved, so any animation keyed on the old pivot needs re-keying.
- **Fen Lurker**
  - The water band still counts in the silhouette.
  - The neck reads as a separate band of bark.
  - The wake is subtle at game size.
- **Mire Toad**
  - The body outline is smooth: the warts were kept inside the silhouette per GUIDE section 1.
  - The parotoid gland is still the most saturated green on it.
  - The tongue strike needs a scale key.
- **Coven Mother:** the milky eye is small at game size.
- **Bog Body:** the ribs are mostly hidden by the hanging near arm.
- **Fen Hag:** the shawl back is a large smooth oval.

### Independent review, second pass (director's sheet-scale notes)

**Mire Mother: the mass.** The face was kept as it was. Changes:
- **Cranium outline.** The back of the skull is lowered and caved in. Its lower back slumps away as a sagging mass of crackled, stained leather that runs down into the water, with peat clods, moss, roots and fold creases. The forehead arc is pressed flat with a notch, and the temple hollow is deepened.
- **Crown.** The moss lid was replaced by seven irregular turf clods of different heights. Each has cut-peat faces, moss and grass tops, and roots hanging over the skin and hair, so the top edge is ragged.
- **Things living on her.** The four reeds now root inside the clods, and the third lantern's cord is tied on its stalk, so every lantern hangs from something rooted. The toadstools fruit from the clods. A small fen toad sits on the brow clod and three snails graze the leather, for scale.
- **Hair.**
  - A dark base now sits only where the hair hangs, so the scalp shows between the clumps plastered over the skull.
  - The roots are peat-stained near black, and the palette is muted toward brown.
  - Lengths are uneven, with about 30 percent short clumps lying on the skull. Seven mats are tangled across the others, and about 34 longer strands lie out on the water.
- **Base.**
  - The waterline is uneven and slumped: it sits about 85 px higher round the sunken back of the skull and drops under the chin.
  - The base is ringed by low peat banks of mixed mounds with moss, roots and reeds.
  - Duckweed and a scum line hug the surface.
- **Rig.** Exported (21 layers, 14 bones, check difference 0.0007).
- **Pose** (`jaw -15`): pass. The cave and offerings show, and nothing tears.

**Leech Swarm.**
- **Each leech** now reads as a leech:
  - A flattened body thickest in its rear third.
  - A rear sucker disc at the tail, tapering to a narrow head with a front sucker cup.
  - Rings, an olive-brown lateral stripe, and a lit wet highlight with a specular along the side facing the light.
- **Heap.** It now holds 36 larger leeches, and the bare black cap of the mound was lowered so the leeches form its top edge.
- **The box was the bible's cracked apothecary jar** (bible: "spilling out of a cracked apothecary jar with a faded label"), so it was kept and rebuilt to read as one:
  - A round-bellied leech jar with a foot ring, a sloping shoulder, a short neck bound in twine, and a flared lip.
  - The glass is partly see-through, with leeches inside and foul water in the low side, and its highlights follow the curve.
  - The label is smaller and faded.
  - Leeches pour from the mouth, squeeze out of the crack and crawl over the top of the jar.
- **Rig.** Exported (9 layers, 9 bones, check difference 0.0004).
- **Pose** (heap surge): pass.

`out/worlds/II/sheet.png` and `sil.png` were rebuilt in the same layout.

**Still open**
- **Mire Mother**
  - The upper back curve is still a smooth arc. The cave-in notch is mostly hidden under the hanging hair.
  - On `sheet.png` the black water below her is still a wide band.
  - The open-jaw seam noted earlier remains.
- **Leech Swarm:** the leeches inside the jar are barely visible through the glass at game size.

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Mire Mother | hard black water rectangle at the base | the water is now an organic pool whose lower edge wanders (local noise, no straight edge) and dissolves through a soft mask (`mmWater`) before the canvas edges; olive-murky under the surface grading to peat black, silt plumes, drowned roots. The head fades out softly just under the waterline (`mmHead`) instead of being hidden by the rectangle; the peat banks' bases slope away under the water. Masks are applied once per rig run (runs merged), so render time is unchanged | full size and 0.3x: pass, no straight edge |

Rig re-exported (14 bones, unchanged). Sheet and sil rebuilt (`w2/sheet.py`).
