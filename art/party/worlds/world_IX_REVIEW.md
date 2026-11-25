# World IX, The Hollow Barrow: review

Eight creatures in `worlds/world_IX.js` (helpers in `worlds/kit_IX.js`, sheet script `worlds/sheet_IX.py`). Seeds 900 to 907 in bible order (King 900, Thane 901, Rot Witch 902, Draugr 903, Wolf 904, Leper 905, Wight 906, Worm 907). Every figure is a foe: drawn facing right with `kit.foeBase` and flipped. `groundY = canvas h - 30` on every figure. Renders: `out/worlds/world_IX_<key>.png` and `_sil.png`. Rigs: `out/rig/worlds/world_IX_<key>/`. Pose tests: `out/worlds/IX/<key>_pose.png`. Sheets: `out/worlds/IX/sheet.png` (true relative scale with the Drowned Thrall at 1.0) and `out/worlds/IX/sil.png` (human about 190 px).

Palette: grey-green frost, bone and mould, plus ink black and grey. Rust (Thane, Draugr), tarnished silver (King's mask, arm rings, brooch) and black frostbite (Leper) are used only where the bible names them. There is no warm colour and no red. `B.head` tints noses and ears warm, so `kit_IX.greyFace` lays the dead grey back over them.

Pose sign convention, for whoever animates: rigs are exported mirrored (facing left), and a positive angle turns a bone clockwise on screen. A raised far arm chops down with a negative angle.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (for non-humanoids: a jaw on a hinge, segments on one spine); 2 objects face the user, gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing and light. "Fixed" means it failed during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Barrow King | pass | pass | fixed | pass (seated) | fixed | pass |
| Barrow Thane | pass | n/a | pass | fixed | fixed | pass |
| Rot Witch | pass | fixed | fixed | pass | pass | pass |
| Barrow Draugr | fixed | n/a | fixed | pass | fixed | pass |
| Plague Wolf | pass (jaw on its hinge) | n/a | n/a | fixed | pass | pass |
| Frostbitten Leper | fixed | n/a | pass | pass | pass | pass |
| Mould Wight | pass (jaw on its hinge) | n/a | n/a | pass | pass | pass |
| Grave Worm | pass (one spine, six segments) | n/a | n/a | pass (the coil is the base) | pass | pass |

What failed and how it was fixed:
- Draugr 1: the first build had the head floating ahead of a straight torso, with almost no stoop. The spine now curves from the upper back (N [330,344] through C [284,430]), and the skull sits on the line of the neck.
- Draugr 3: the clawed near hand sat beside the belt with no reach. The forearm now reaches forward (EN [326,456], WN [446,480]). The axe goes through `B.grip`, with the haft square to the forearm and the head on the thumb side.
- Draugr 5: the seax sheath and the belt ran past the body's back edge. The belt now ends inside the torso, and the sheath hangs from two thongs.
- Leper 1: the bell arm sat at chin height, so its sleeve crossed the jaw. The arm is raised (EF [436,296], WF [532,258]) and the sleeve is shortened, so the face is clear. The near thigh had been drawn over the robe. Both legs are now drawn before the skirt.
- Rot Witch 2: the bowl hand was palm-down beside the bowl, not under it. It is now a palm-up hand under the foot ring. Her head is bowed (hA 0.95), so her eyes look into the bowl. The salts are seen from her side, as a sliver of surface over the rim.
- Rot Witch 3: the pinching hand first sat over her own jaw. The near forearm is moved forward to the rim (EN [716,746], WN [826,776]).
- Thane 4: the first lamellar skirt was one rectangle that hid the stride. It is now three flaps over mail, the legs are drawn under them, and the weight sits on the back leg. The near fist on the hip continues the forearm (`B.fist` at the forearm's angle), so no knuckles point at the elbow.
- Thane 5: the spangenhelm overhung a narrow curtain like a kettle-hat brim. The helm now fits the skull, and the mail curtain hangs from the full rim.
- Wolf 4: the first legs were straight tubes on hoof-like blocks. The legs are now jointed segments: the hind hock is angled back, the slim pasterns slope forward, and the paws are planted flat with knuckled toes and claws.
- King 3: the sword fist goes through `B.grip` (inline, a sword grip). The far palm lies flat on the blade (`tableHand`).
- King 5: the burial mask first floated face-on at the cheek. It now hangs plumb on its cord below the ear, turned so we see its hollow back. The mantle front was a closed egg. It now hangs from the shoulders to a torn hem on the seat.
- Every grip goes through `B.grip` (or `B.fist` along the forearm for the hip fist). The final renders print no grip warnings.

## Pose tests (the attack from each Motion line)

| Figure | Bones | Test | Result |
|---|---|---|---|
| The Barrow King | 22: throne (root), pelvis, torso, head, jaw, mask, collar, mantle, lap, arms, sword, legs | sword sweep (torso -8, sword arm lifted, far arm off the blade, jaw opens on the breath) | pass. The far hand leaves the blade cleanly, and the sword turns on the near fist. |
| Barrow Thane | 21: standard + flail, chain_1..3, cape, skirt | flail blow (far arm drops, chains swing through) | pass. The chains and weights stay on the haft head. |
| Rot Witch | 20: standard + bowl, skirt, hood, apron, herbs | hurled salts, release frame (near forearm flung forward) | pass. A full overhead wind-up crosses her face, so animate through it quickly or keep the throw low. |
| Barrow Draugr | 18: standard + axe, cape, hair | axe chop, mid-swing (upperarm_f -50, forearm_f -30) | pass |
| Plague Wolf | 20: spine_1..3, neck, head, jaw, tail_1..2, 4 legs x 3 | plague bite (neck and head lunge, jaw -22, foreleg reaches) | pass |
| Frostbitten Leper | 21: standard + bell, clapper, stick, skirt, hood, cape | toll (bell arm up, bell swings on its own pivot, clapper counter-swings) | pass |
| Mould Wight | 17: standard + jaw, shroud | grasping smother (both arms forward, torso pitches in, jaw drops) | pass. The filaments under the arms turn with the arms instead of hanging plumb, so keep arm lifts under 25 degrees or add a hang key. |
| Grave Worm | 6: seg_1 (root, the coil) .. seg_6 (the mouth) | lunging bite (seg_3..6 bend down toward the target) | pass. The joints stay closed, because each child copy owns a disk at its cut. |

Two-handed holds that will need IK: none. Every held object has one holding hand. The King's far palm rests on the blade (it is not a grip). In the sweep it should lift off, or be IK'd to follow the blade.

## Gate 2: style and detail

Signature at 190 px is judged from `sil.png`. Course marks: frost (dominant; rime in the hollows and on the windward back, icicles hanging plumb, figures stilled mid-gesture) and toxin (grey-green mould, plague sores, buboes, fungal fur, grave caps, spores). Never items: clean ice crystals or snowflakes; slime puddles or neon green glow.

Section 9 (rewritten version, test: "which course did this, to whom, and does the bible say so?"). Each row names the remnant of the former self and the one course mark pushed hard, and confirms the outline breaks the way frost and toxin break it (stiff icicled hems, mould fur, rot holes). No rim light or fog was added. The only relic treated as the most corrupted is the King's signet with the Tooth, which the bible names. Nothing from the earlier version of section 9 failed the test: the Thane's bared arm was measured, and it is the same length as his other arm, not elongated. The design notes in the file were reworded to course causes.

| Figure | Signature reads at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Section 9 | Result |
|---|---|---|---|---|---|---|---|
| The Barrow King | yes: seated king, sword across the knees, crown and throne cropped | rime on the throne, crown, brow and mantle; icicles on the beard, hems and armrest; buboes at the neck and both armpits; mould in the beard; rot holes; a breath of frozen spores; eyes frozen open / none | 18 (12): crown with rivets and rust, slipped silver mask with rotted lining, signet with the Tooth, blackened finger, rot veins up the arm, king's belt mounts, fur collar locks, torn mantle hem, interlace throne, grave caps on the throne, shield, coin chest, urn, sword fuller, rust, guard and pommel, garter thongs, burial shoes | skin, mail, mantle, fur | pass | remnant: crown, belt, sword and mask. Pushed: toxin's buboes and frost's stilled, frozen-open stare (bible). Relic: the Tooth's finger rotted black. | pass |
| Barrow Thane | yes: commanding stance, the raised flail with three hanging weights | rime on the helm, mantle and arm; ice-clotted weights with icicles; the face eaten to mould over the curtain edge; armpit bubo; grave caps / none | 15 (10): spangenhelm with rivets and nasal, mail curtain, lamellar with fallen plates, three skirt flaps, silver brooch, arm rings, belt and strap end, drinking horn, seax, flail bindings, chains, frozen weights, fur locks, shin wraps and thongs, strapped boots | skin, mail, lamellar, fur mantle | pass (rust as named) | remnant: brooch, arm rings, lord's belt and horn. Pushed: the bible's mould on the face. | fixed (helm fit, skirt, face mould) |
| Rot Witch | yes: bent figure over a broad bowl, cold sinking off the salts | rime on the hood and back; icicles on the bowl and hem; cold vapour falling, not rising; mould at the hairline; green hands; fungal fur on the hem / none | 14 (10): bowl with a linen-bound split, heaped salts, bone needle and thread, linen roll, shears, stoppered jar, three herb bundles, apron with salt runs, spine knuckles, neck cords, darned patches, torn hood tail, sleeve roll, wrapped feet | wrappings, gown, apron, hood | pass (the green hands are mould green) | remnant: embalmer's apron and kit. Pushed: toxin's green to the wrist (bible). | fixed (hand under the bowl, stain scale, slimmer body) |
| Barrow Draugr | yes: stooped body with the axe raised over the hump | frost packed in the sockets; rime on the hump, sleeve, axe and cape; icicles; mould on the cheek and in the mail rents; sore at the neck / none | 13 (6): bearded axe with nicks and a bound split, arm ring, seax with bone grip, pouch, bone comb, braided beard with icicles, warrior's plait, wolfskin cape, mail rents with rusted ends, rust runs, wrapped shins with thongs, knee patch, toe through the shoe | skin, tunic, mail, pelt | pass | remnant: seax, comb and plait. Pushed: frost stilling the stoop, with the sockets packed with frost. | fixed (spine, reach, forearm shading) |
| Plague Wolf | yes: low snarling wolf, hackle ridge, drooping brush | frost on the back and feet; rime on the brow and hackles; spittle frozen as it fell; mange; sores on the muzzle; teeth stained green; mould patches / none | 9 (6): hackle bristles, mange patches with blisters, muzzle sores, wrinkled snarl, stained fangs, frozen spittle, pale belly fringe, bald patch on the tail, frost on the paws | fur, bare skin, mould | pass | an animal the bible lists. Pushed: the snarl's green-stained teeth and the mange. | fixed (paws, tail, shadow value, inks) |
| Frostbitten Leper | yes: bandaged hunched figure, the bell aloft | bandages frozen stiff; icicles on the cape, hem and bell; black fingertips with a finger gone; sores weeping through; mould on the hem and hood / none | 12 (6): cracked bell with clapper, lazarus clapper boards, begging bowl, stick with a rag, rope belt with a knot, wound head with an eye slit, hood, shoulder cape, darned patch, black toes through the wraps, sores, a frozen loose wrap end | bandages, robe, cape, hood | pass (black frostbite as named) | remnant: the bell, the clapper and the bowl. Pushed: frost blackening the fingers. | fixed (bell arm cleared the face, sawtooth hem made irregular) |
| Mould Wight | yes: shaggy furred man-shape trailing filaments, a skull face | frost on the back and orbits; icicled filament tips; mould as the body itself; grave caps; spores / no slime, no glow | 10 (6): skull with orbits and teeth, hanging jaw, exposed ribs, forearm bones, bone claws, a broken sword in its back, a torque round the wrist, a shroud scrap, grave caps, toe bones | bone, mould mass, filaments, shroud | pass | remnant: the bones and torque of the one it grew on. Pushed: toxin's mould, which is the whole body (bible). | fixed (eyes-like colonies replaced, filaments added, legs broken up) |
| Grave Worm | yes: reared S with a round toothed mouth leaning down | rime on its back; icicles under the bends; mould and sores along the folds; grave caps on the coil / none | 9 (6): pressed faces (shut, no eyes), a pressed hand, pressed ribs, a ring pushed out through the skin, shroud strips caught in the folds and trailing from the mouth, a wound shroud strip, setae, a peeled flap, rings of hooked bone teeth | skin, shroud, mould | pass | remnant: what it ate (faces, a hand, a ring, shroud). Pushed: the bulging swallowed bodies swelling its gut. | fixed (tube shape, clean outline, sausage strips) |

Silhouettes: no two foes share a silhouette at 190 px. The stooped axe raiser, the bell raiser with a stick, the shaggy double-reacher, the quadruped and the reared worm are all distinct, and the two elites are an upright flail-bearer and a figure bent over a bowl.

Faults from GUIDE section 8, checked on every figure:
- Even-width tubes are replaced by `jointLimb` limbs with bony points and muscle bellies. The worm swells and pinches per annulus and bulges over what it swallowed.
- No ball bodies: the buboes sag toward the ground.
- Every hand has knuckles, creases and nails.
- No round cartoon eyes. Empty sockets are flat-topped shadow under a rimed brow. The first frost-disc sockets and the round mould colonies read as eyes, and both were replaced. This is not a void world, so there are no eye motifs.
- Objects face their user: the witch's bowl, the bell's mouth and the mask's hollow all turn toward the figure.
- No props attached to nothing: every belt item hangs from a thong.
- Large flat areas: the robes, mantles, gowns and shrouds carry folds, noise stains, patches, rot holes and torn hems.
- Hems: the first sawtooth hems were made irregular on the Leper, the King and the Witch.

## Still open
- Barrow King: the bible scale is 3.5. On the 1600 canvas, seated and cropped at the crown, he reads a little smaller than the Drowned King. The seated pose costs height; the frame crops the crown points as specified.
- Barrow King: the far upper arm and the mantle's back half overlap in one dark mass at game size. It reads, but it is the plainest area on the figure.
- Mould Wight: the filament fringes are drawn on the arm bones, so they swing with the arms instead of hanging plumb (see the pose note above).
- Plague Wolf: the near legs read slightly stiff at full size. They pass at game size.
- Rot Witch: the gown below the apron is the quietest large area in the world (stains and patches, no ornament), which fits a working woman.

## Independent review (2026-11-23)

Reviewed fresh against GUIDE sections 8 and 9, LOGIC_CHECKLIST, the bible entries and the reviewed references (Drowned King, Riven Jarl, Magma Hound, Fissure Worm). The director's four call-outs were confirmed and fixed. The other four figures (Draugr, Leper, Wight, Rot Witch) were checked at full and sheet size and pass without changes. Each figure was rendered on its own on a mid-dark ground and zoomed 2 to 3x on the head, hands, held objects and feet, then checked again at sheet size and in `sil.png`. Every build prints zero grip warnings. The rigs of the changed figures were re-exported with no MISSING JOINTS and `ground` = canvas h - 30 (1570, 1370, 1070, 1070).

### Gate 1: logic audit (reviewer)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Barrow King | fixed | pass | pass | pass (seated) | fixed | fixed | Rebuilt (see below). The skull sits just ahead of the neck base (HC [884,336] over NB [850,612]), the head bowed from the upper back. The near fist grips the sword through `B.grip` (forearm 63 deg to the grip, within maxBend). The far hand lies palm-down over the blade with its fingers curled over the edge. Both elbows rest on the throne arms. The torso soft tones were lit on the wrong side (the far side faces the key light) and were flipped. |
| Barrow Thane | pass | n/a | pass | fixed | pass | pass | The flail arm was a straight stick held out. It is now cocked: the elbow is dropped and forward (EF [670,402]), the fist is raised over it (WF [740,212]) and the haft is drawn back 12 deg above level, so it is 32 deg off square to the forearm (no warning). The spine leans into the arm (N [468,304]). The forearm clears the face. |
| Rot Witch | pass | pass | pass | pass | pass | pass | none |
| Barrow Draugr | pass | n/a | pass | pass | pass | pass | none |
| Plague Wolf | pass | n/a | n/a | fixed | pass | pass | The stick legs are replaced with canine legs. Front: shoulder point, elbow behind the brisket, straight forearm, wrist knob, sloped pastern. Hind: thigh, stifle forward, gaskin, the point of the hock behind, rear pastern. Each paw is a heel pad, three knuckled toes and claws, flat on the ground. |
| Frostbitten Leper | pass | n/a | pass | pass | pass | pass | none |
| Mould Wight | pass | n/a | n/a | pass | pass | pass | none |
| Grave Worm | fixed | n/a | n/a | pass | pass | pass | Rebuilt on one centreline, with the segments cut along that one spine (seg_1..seg_8 > head). The maw is a disc at an angle, with a hinge-free lamprey lip. |

### Gate 2: style and detail (reviewer)

| Figure | Item | Result | Fix |
|---|---|---|---|
| The Barrow King | below the ruler bar: rectangle forearms on slab armrests, box torso, slab throne, cartoon face (big round eye, wedge nose); far arm merged into the mantle; smaller than the other seated rulers | fixed | Rebuilt as a three-quarter seated ruler like the Jarl and the Drowned King, filling the 1600 frame. Shoulders are heavy under a fur-lined burial mantle, about 2.1 heads across. The chest is sunk inside a mail shirt that hangs from the collarbones: a hollow under the breastbone, catenary folds over a sunken belly, mail bloused over a belt that no longer fits, and a rent showing ribs with frost between them. The forearms have muscle bellies, an ulna ridge, tendons and narrow wrists with a bone knob. The near fist has knuckles and two rings. The far hand is a back-of-hand with knuckles, nails, an iron ring and the signet: a silver bezel holding a long pale fang with growth lines (the Tooth). The finger beyond it is rotted black and rot veins climb the wrist. The knees push the linen burial gown, which falls from them in plumb folds to a torn, iced hem over cross-gartered shins. The face is a frost-stiff corpse at faceShade 0.8: sunken temples and cheeks, a cheekbone ridge, a deep nasolabial fold, heavy lids frozen half-open over filmed eyes with rimed lashes, cracked parted lips, and a pinched aquiline nose whitened at the tip. The beard hangs in two layers of frozen locks with strands, icicles and two mouldy locks. The far arm hangs in a lit mail sleeve against the dark cloak, with throne showing between it and the chest. The throne is carved stone: an arched back of laid blocks with mould and fungal fur in every joint, a worn plait on the arch, posts with plaited bands, chipped arrises and triquetra finials, scroll-ended arms with relief, rime on the windward edges, icicles. |
| The Barrow King | grit (12) | pass (20+) | crown with rivets, a bent point and a snapped point; face-out silver mask on its cord, dented and tarnished; signet with the Tooth; blackened finger; rot veins; two silver arm rings; finger rings; ring brooch with pin; fur-lined mantle with rot holes; mail rent and rust; belt mounts, buckle and tongue; three buboes; mouldy beard locks; knee tear; cross-garters; sword fuller, nicks, wire grip, lobed pommel; shield; urn; coins; grave caps |
| The Barrow King | silhouette | fixed | The throne first filled the canvas, so the silhouette was a solid square. It now has an arched back with two finial posts. The crown breaks above the arch and the sword tip juts past the far arm. Like the Jarl, the seated body reads inside the throne's mass, not on its edge. |
| Barrow Thane | stiff straight arm; brown armour | fixed | The arm is cocked as above. The lamellar was solid rust-brown and is now iron (`mix(iron, rust, 0.42)`) with rust blooming in the laces and on the plates. The pauldron is the same. Rust appears only where the bible names it ("rusted lamellar"). |
| Plague Wolf | stick legs on a plank body; closed outline | fixed | The body has a deep chest to the elbow and a tucked waist in shadow, with ribs under the mange. The shoulder blade and haunch are modelled by light and grooves. The near thigh rises into the croup (clipped to the body, no disc cap), with breeches tufts behind it and elbow feathering. Mangy clumps stand off the back, croup and belly. A bare mange patch on the haunch carries a sore. Mould is on the foreleg. The maker's muzzle sores, stained fangs, hackles and frozen spittle are kept. |
| Grave Worm | even ringed pipe; round mouth reading as an eye | fixed | Rebuilt like the reviewed Fissure Worm. One width function gives a thin tail tip, a thick trunk with a muscular collar, swellings where swallowed bodies lie, a neck drawn thin and a flared hood. One ink edge runs the whole body, heavier on the shadow side. Annuli are irregular: they bunch into deep creases on the inside of each bend (with mould fur in the folds) and stretch thin on the neck. The maw is a lamprey disc turned three-quarter: a puckered fleshy lip with papillae, radial rows of hooked bone teeth pointing inward, and an off-centre, puckered dark gullet with no glow and no round pupil. Frost: rime along the back, icicles under the bends. Toxin: mould patches and fur, sores, pustules, grave caps on the coil, shag under the trunk. The pressed faces (shut, screaming), hand, ribs and ring are redrawn after the shading pass with a pressed skull rim, so the bible's signature reads at sheet size. |
| Rot Witch, Draugr, Leper, Wight | section 8 faults, palette, course marks | pass | none |

### Pose tests (re-run for the changed figures)

| Figure | Test | Result |
|---|---|---|
| The Barrow King | sword sweep (`torso 5, upperarm_n 22, forearm_n 30, hand_n 12, head 3`) | pass: the arm, fist and sword stay attached, and the far hand stays on the knee. In mid-sweep the blade passes over the beard (not the face), so animate through that frame quickly. |
| Barrow Thane | flail blow (`torso -6, upperarm_f -35, forearm_f -45, flail -20, chain_1..3 25..35`) | pass: the chains and weights stay on the haft head, and the arm passes behind the body. |
| Plague Wolf | plague bite (`neck -12, head -8, jaw 22, leg_fn_1 18, leg_fn_2 -10, spine_3 -4`) | pass: the jaw opens on its hinge and the legs stay jointed. |
| Grave Worm | lunging bite (`seg_5..8 6..12, head 14`) | pass: no gaps open at the segment cuts. |

Sign note: for the King and the Worm, a forward motion in the mirrored rig is a positive angle.

### Still open (reviewer)
- The King's rig now has 18 bones (throne root, pelvis, torso, head, breath, mask, cloak, both arms, sword, thighs and shins). His feet are cropped behind the dais like the Jarl's, so there are no foot bones. The earlier `jaw`, `collar`, `mantle` and `lap` bones are gone. The breath puff is its own bone for the idle.
- The King's beard is drawn on the head bone and the shoulder mantle on the torso, so a large head turn will need a small beard counter-rotation.
- The Wolf's maker-built neck keeps a strong ink edge along its top and reads slightly as a collar at full size. It reads correctly at sheet size.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| Grave Worm | ringed tube | Same treatment as the Fissure Worm: each flank has its own lumps, and the swallowed dead now push out one flank at a time (the near flank at the gut, the far one higher). The annuli bunch in oblique fold groups with stretched spans and stretch lines between, the terminator follows the lumps, and every placement (faces, hand, ribs, shroud strips, mould) follows the new flank widths. Local PRNG; the maw is unchanged. | pass at 0.3x |

Rig re-exported (no MISSING JOINTS); pose (`seg_4..8 -6..-8, head -10`): attached. Sheet and sil rebuilt
(`worlds/sheet_IX.py`). Still open: the wound shroud strip across the trunk still reads a little like a rod.
