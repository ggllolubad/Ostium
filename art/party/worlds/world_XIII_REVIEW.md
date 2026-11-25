# World XIII, The Black Pyre: review (batch 1 of 2)

Eight creatures in `worlds/world_XIII.js` (helpers in `worlds/kit_XIII.js`, sheet script `worlds/sheet_XIII.py`). This batch is the first eight entries named in the brief; the eleven later entries in `bible/world_XIII_black_pyre.md` (Iron Bull, Confessor, Questioner, Bellows Sister, Recanter, Belfry Bats, Familiar, Faggot-Bearer, Scold, Ash Pardoner, Charred Destrier) were read only to keep their silhouettes free (see the silhouette note below).

Seeds 1300 to 1307 in brief order: Saint 1300, Inquisitor 1301, Seraph 1302, Penitent 1303, Hound 1304, Deacon 1305, Wraith 1306, Knight 1307. Every figure is a foe: drawn facing right with `kit.foeBase` (through `kit_XIII.base`) and flipped. `groundY = canvas h - 30` on every figure (checked from the built figures: 1570, 1370, 1370, 790, 1070, 790, 790, 1070). Renders: `out/worlds/world_XIII_<key>.png` and `_sil.png`. Rigs: `out/rig/worlds/world_XIII_<key>/` (no MISSING JOINTS on any). Pose tests: `out/worlds/XIII/<key>_pose.png`. Sheets: `out/worlds/XIII/sheet.png` (true relative scale, Drowned Thrall at 1.0) and `out/worlds/XIII/sil.png` (a 1.0 human about 190 px). The final build prints no grip warnings.

Courses as drawn. Fire (dominant): skin, wood and cloth split into seams with charred lips; char stains and alligator checks; flakes; ash curling up; hems burnt into curled tongues. Void: the flame is near-black with a thin violet edge and violet licks, and has no glow, bloom or light thrown (the kit has no glow filter); clean round holes with clean pale rims, cut through as real see-through holes (`cutHoles`) or as rimmed disks; violet embers for eyes where an eye has a purpose. Never items checked: no cartoon flames on heads (the only flame or smoke at a head is the Saint's hair as smoke and the Candle Wraith, both named by the bible); no purple sparkles or galaxies; no lightning or effects baked in; no glow. Palette: ash, char and black flame with violet edges, plus ink, bone and grey. Gold only on the Saint's halo; the Seraph's halo is blackened metal. Red only for rubric (titulus, orphreys, mitre, judgement seals), the Inquisitor's red-black robes and the Penitent's raw back (both named by the bible).

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (non-humanoids: jaw on a hinge, one spine); 2 objects face the user, gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing and light. "Fixed" means it failed during the build and passes on the final render.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Saint Unending | fixed | pass | fixed | pass (bound, standing on the platform) | fixed | pass |
| The Unburnt Inquisitor | pass | fixed | fixed | pass | fixed | pass |
| Pyre Seraph | pass | pass (no held object) | n/a (open hands) | pass (hovering) | fixed | pass |
| Ash Penitent | fixed | n/a | pass | pass | fixed | pass |
| Cinder Hound | pass (jaw on its hinge) | n/a | n/a | fixed | fixed | pass |
| Censer Deacon | pass | pass | pass | pass | fixed | pass |
| Candle Wraith | pass (jaw on its hinge) | n/a | n/a | pass (floats) | fixed | pass |
| Pyre Knight | pass | pass | pass | pass | pass | pass |

What failed and how it was fixed:
- Saint 1: the first neck was a tube under the jaw, behind the skull, and the head read as a cut-out mask. The neck is now one shape from under the jaw and the base of the skull to the collarbones, with a tendon. The head is tilted up, eyes closed, on the line of the neck.
- Saint 3: the first praying hands showed a spread palm with the thumb out, like a wave. Now the back of the near hand is drawn (knuckles, nails), the thumb lies along the index on the chest side (`openHand` back, flipped, `thumbAng` 0.25), and the far hand's fingertips show just past it, palm to palm. Both forearms rise from elbows at the waist.
- Saint 5: `bareLeg` stood the feet on the canvas ground line, 350 px below the platform. The legs now use `fullLeg` with `groundY` at the platform. The figure is drawn at H 165 and set at its true size (x1.15) by `placeFigure`, which moves its joints too.
- Inquisitor 2/3: the torch arm was the near arm, and its sleeve crossed the mouth. The torch is now in the far hand, raised behind the head with the fist ahead of the face (`B.grip`, maxBend 40, forearm 42 deg off square). The book is in the near hand: closed, clasped to the chest with the back of the hand flat on its cover. It is a held, closed book, not one being read. In the idle (reading) the `book` bone tilts toward the face.
- Inquisitor 5: the cope's orphrey band ran alone down the front and read as a staff. The cope's front panel now extends past it, so the band lies on cloth, with the lining's edge beside it.
- Penitent 1: the first torso stood upright under a forward head. The spine now curves from the upper back (N [366,378], C [278,312]) and the head hangs on the line of the neck.
- Penitent 5: the flagellum's chains first hung in a column in the air behind him. They now fall from the handle's ring onto the hump and lie down the back.
- Hound 4: the first legs were thin. They are now muscled three-bone segments (thigh 128 to 60, gaskin 64 to 30, pastern 30) on planted paws with toes and claws.
- Hound 5: the tail's two bones had a gap between them. They now overlap.
- Deacon 5: the censer's lid was hidden under smoke and the boat sat behind the dalmatic. The smoke now comes out of the lid's windows behind the body of the censer. The far forearm and the boat are drawn over the dalmatic, with the fist round the boat's handle.
- Wraith 5: the front flames covered the cranium. They are moved behind the jaw corner.
- Seraph 5: the void first spilled past the head's outline as a black hood. It is now clipped to the head.
- Every grip goes through `B.grip`: the flagellum, rosary, censer chains, boat, torch (Inquisitor), mace and shield grip (Knight).

## Pose tests (the attack from each Motion line)

Sign convention for the exported (mirrored, facing left) rigs: a positive angle turns a bone clockwise on screen.

| Figure | Bones | Test | Result |
|---|---|---|---|
| The Saint Unending | 11: root, stake, body > head > jaw, hair_smoke, halo; body > arms, tooth; flames_back, flames_front, flame_reach | spreading fire (`flame_reach -30, jaw 4, head -3, flames_front -3, hair_smoke -6, tooth 6`) | pass. The tongue swings out toward the party. She is bound, so only the head, jaw and fire move. |
| The Unburnt Inquisitor | 21: standard + torch, book, cope, skirt, keys, lappets | sentence read aloud (`upperarm_f -25, forearm_f -20, torch 15, torso -4, head -5, book -8`) | pass |
| Pyre Seraph | 23: standard + wing_n1..3, wing_f1..3, halo, robe | dive (`torso -18`, all six wings swept back 15 to 30, `upperarm_f -20`, `head 10`) | pass. The wings stay rooted on the back. |
| Ash Penitent | 17: standard + flagellum, skirt | chain lash (`torso -10, upperarm_n -70, forearm_n -40, hand_n -10, flagellum -30`) | pass. In mid-lash the arm passes in front of the hood, so animate through that frame quickly. The chains turn with the handle and do not hang plumb. |
| Cinder Hound | 19: spine_1, spine_2, neck, head, jaw, tail_1..2, 4 legs x 3 | burning bite (`neck -14, head 16, jaw -26`, forelimb reach) | pass. A dark gape on the head bone fills the open jaw. |
| Censer Deacon | 19: standard + censer, boat, skirt, stole_end | hard forward swing (`upperarm_n 20, forearm_n 15, censer 55`) | pass. The trailing smoke is on the censer bone, so it swings with the censer. In the game it should be spawned as FX. |
| Candle Wraith | 5: skull (root), jaw, crown, flame_back, flame_front | flare (`skull -8, jaw -18, flame_front -40, flame_back 10`) | pass. The wax runs are on the jaw and tilt with it, so keep jaw drops under about 20 degrees. |
| Pyre Knight | 19: standard + shield > torch, mace, surcoat | mace blow over the shield (`torso -6, upperarm_n -60, forearm_n -50, mace -10`) | pass. In mid-swing the mace head passes behind the helm's crown. |

Holds that need IK: no two-handed holds. Every held object has one holding hand. Two notes for animation:
- The Knight's tower shield stands on the ground and is parented to `hand_f`. Any far-arm motion will lift it, so either root it in the idle and IK the far hand to its grip, or allow the lift only in the blow.
- The Saint's praying hands are on one `arms` bone, so they stay pressed together without IK.

## Gate 2: style and detail

Signature at 190 px is judged from `sil.png`. Section 9 test for each row: which course did this, to whom, and does the bible say so? This world's bible has a church and an inquisition, so corrupted clergy and relics are supported. The relics drawn are the Tooth (named), the titulus, the book of judgements, the censer's burning skull (named), the deacon's stole and boat, the morse and the keys (named).

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Section 9 | Result |
|---|---|---|---|---|---|---|---|
| The Saint Unending | yes: the figure on the stake with the gold disk of the halo, the stake running out of the frame, fire round the pyre | seams on the stake, shin, forearm and throat; tibia, ulna, fingertip and ribs bared; char on the shift; burnt hem with violet edge; ash rising; black flame wreathing her and the pyre; clean holes through the stake, shift, platform and a skull / no cartoon head flames (hair as smoke is named), no glow | 20 (12): titulus with rubric, stake staples, three chain wraps, padlock, the Tooth with growth lines and wire, burnt short sleeve, burn holes, void holes, rib hole, garland of charred flowers, faggots with withy bands and cut ends, split logs with checks, platform planks and rivets, ash heaps, skull with a void hole, long bone, five candle stubs burning black, ash | skin, shift, chains, stake and pyre | pass (gold only on the halo) | remnant: the penitent's shift, the prayer and the garden garland (her sermon). Pushed: fire cracked to the bone (bible). | pass, with open notes |
| The Unburnt Inquisitor | yes: the tall split mitre and the torch raised ahead of the face | black flame on the torch; void hole through the book; round bite out of the cope's hem; deliberately no char on him (bible: "perfectly clean in a world of ash"), ash only round his feet / none | 16 (10): mitre bands, rubric lettering, jet stones, lappets with fringes, morse with the flame mark, orphrey band in rubric, cope lining, rochet lace, cincture, cloth buttons, five keys on a ring and chain, book corners and clasps, two red judgement seals, signet ring, torch basket | cassock, rochet, cope, mitre | pass (red-black named) | remnant: everything (the rank intact is the point). Pushed: the void's single unmaking of his verdicts. | pass |
| Pyre Seraph | yes: six burnt wings round a hovering robed figure | wings burnt to bone with quill stubs, violet-tipped; black flame along every leading edge; ash body cracked into violet seams, flaking; the hem crumbling into falling ash; the face half gone to a clean round void with one eye in it / no gold, no sparkles | 12 (10): six wings (bones, quills, lace vanes), broken halo with a fallen piece, rope girdle, void hole in the breast and robe, robe bite, crack nets, falling ash, pointed hanging feet, short ash curls | ash body, robe, wings | pass | remnant: the angel's robe and halo. Pushed: void (the face, "it went in to look"). | pass, with open notes |
| Ash Penitent | yes: a hunched hooded figure with the chain whip raised | flayed back with raw welts and charred lips, two split into seams; ash curling off the back; burnt hems; clean hole through the back; round bite in the hem / none | 11 (6): five-chain flagellum with barbed knots and a wrapped handle, sack hood with stitched seam, eye holes and drawstring, burnt frill, rosary of charred beads with an iron cross, knotted rope girdle, cilice biting the thigh, knee scabs, patched wrap | skin, hood, wrap | pass (raw red named) | remnant: the flagellant's hood, whip, rosary and cilice. Pushed: fire on the flayed back. | pass |
| Cinder Hound | yes: a lean hound with its nose on the floor | cinder plates with black flame between them; violet lips on some plates; flame streaming off the back; ash falling; ashprints; violet ember eye; clean holes through the flank and ear / none | 8 (6): rose ear with a void hole, ribs and shoulder blade under the plates, elbow and hock points, knuckled paws with claws, ashprints, ash puffed by the sniff, flame tail tip | cinder, black flame | pass | an animal (a hound), named by the bible. Pushed: cinder held by black flame (bible). | pass |
| Censer Deacon | yes: a robed figure with the censer swung out on its chains | charred dalmatic and alb; burnt hems; split cheek; skull burning black inside the censer; black smoke trailing; clean holes in the dalmatic and alb / none | 12 (6): iron censer with lancet windows, rivets, finial and foot, four chains, little skull, incense boat, stole with stitched crosses and a hanging end, dalmatic bands and hem band, amice, singed tonsure, alb cuff, boots | alb, dalmatic, stole | pass | remnant: the deacon's stole, dalmatic and boat. Pushed: the censer burning a saint (bible). | pass |
| Candle Wraith | yes: a burning skull with a crown of candles and wax hanging below | crazed, charred bone with seams; ash; black flame wreath; a clean round hole through the temple; violet ember deep in the socket; wax runs from the jaw (bible) / flames on the head are named | 9 (6): iron candle-ring crown with five prickets and stubs, wax runs with drops, sutures, missing teeth, cheekbone and arch, char patches, flakes, wax spatter on the floor | bone, wax, iron | pass | remnant: a penitent's skull and a church candle-ring. Pushed: the candle's wax and flame (bible). | pass |
| Pyre Knight | yes: the tower shield with the torch burning on top, and the raised mace | blistered, scorched plate split along its lames; surcoat burnt into tatters; black flame on the torch and painted on the shield; clean holes through the surcoat and shield; round bite out of the shield rim / none | 15 (6): great helm with brow band, rivets and a burnt cross visor, aventail, pauldron, couter, poleyns, sabatons, faulds, belt and tongue, the black-flame emblem, torch bracket and pitch rags, shield bands and rivets, mace grip wrap and flanges | arming hose, mail, plate, surcoat | pass | remnant: the knight's surcoat and emblem. Pushed: fire's char on the plate. | pass |

Silhouettes: no two foes share a silhouette at 190 px. The shapes are a hunched hood with a raised whip, a robe with a censer swung out on a chain, a floating skull with a candle crown, a low quadruped, a shield-and-torch block with a raised mace, a mitred column with a raised torch, a six-winged floater, and the stake with its halo. They stay clear of the later batch: the cone hat with a candle (Recanter), the snouted mask and board (Scold), the pole of vials (Pardoner), the towering stack (Faggot-Bearer), the bellows (Bellows Sister), the brazier tripod (Questioner), the reared goat (Familiar), the horse (Destrier), the booth (Confessor), the bull (Iron Bull) and the bat swirl. The Penitent's hood is a slack sack with a flopped corner, not a cone, so it does not crowd the Recanter's hat.

Faults from section 8 and the brief, checked per figure:
- Tube limbs: arms use `muscleArm` (deltoid, biceps, triceps, elbow point) and legs use `jointLimb` or `fullLeg`.
- Balls, eggs or domes: the skull has a brow ridge, a cheekbone and arch, a nasal cavity and sutures. The hood has a flat seam and a flopped corner.
- Boxy bodies: the Knight's surcoat and the Seraph's torso were tapered after the first pass.
- Mannequin skin: covered by craze, crack nets, ash cake, creases and knuckle detail (`fistDetail`, `openHand` back views).
- Cartoon eyes: the Wraith's socket is angular, and the Seraph's void eye is small and dim.
- Objects facing the camera: the book is closed and held; the censer is round and hangs on its chain axis.
- Hands not holding: every hand holds something or is open with a purpose.
- Props attached to nothing: the stake's chains run to staples, the keys hang from the cincture by a chain, the Tooth hangs on its chain, and the torch sits in an iron bracket.
- Face shading: Inquisitor 0.8, Deacon 0.78, Seraph 0.78. The Saint's face is 0.62 plus a soft lift, see the open notes.
- Large flat cloth: covered by folds, soft tones, stains, burn holes and void holes.
- Repeated robed columns: the three robed figures (Inquisitor, Deacon, Seraph) differ in size, headgear and their held or extended shapes.

## Still open (honest notes for the director)

- **Saint, anatomy against the Drowned King:** the face is calm and readable but still reads a little like a mask at full size, and the shift is the plainest large area on the sheet (folds and scorch, but long straight sides). She is slender per the bible, so she has less mass than the seated rulers. A second pass should model the shift's drape over the hips and knees and soften the head's outline.
- **Saint, shin hidden:** the front flame sheet hides most of the shin, where the tibia shows through. The ribs, ulna and fingertip carry the "cracked to the bone" read.
- **Seraph:** the wings read as burnt wings at full size, but at 190 px they thin to combs. The torso is still a simple tapered column under the robe, and the hands are the plain `openHand`.
- **Hound:** the cinder plates are an even jittered grid. At full size this reads a little like cobblestone, not clinker.
- **Inquisitor:** at game size the orphrey band is still the strongest vertical line on the front.
- **Hems:** `charHem` now makes irregular curled tongues. On the Knight's surcoat some tongues are long and thin and could read as drips from far away.
- **FX to the engine:** the Deacon's smoke trail and the hair-smoke plume above the Saint are baked soft smoke, as the bible describes. Both could move to FX layers in the consistency pass, like the lightning ruling.

## Independent review (2026-11-23)

Reviewed fresh against GUIDE.md sections 2, 8 and 9, LOGIC_CHECKLIST.md, bible 00 and the XIII entries, with the
Drowned King (ruler bar), Abbess of Salt, the World III fire figures, the Harpy Matron (wings), the Magma Hound (canine
anatomy) and the Barrow King as references. Every figure was rendered alone, composited on a mid-dark ground and read at
2 to 3x and at sheet and game size. The director's six notes were all upheld as fails; the fixes are below, then both
gates. Every fail was fixed and re-checked on the final render; nothing is left as "noted".

### What changed

- **Black flame (all figures; `kit_XIII.js` `tongue`, `fireMass`, `blackFlame`, `flameSheet`, `flames`).** The old helper
  repeated one pointed S-tongue, so every fire was a row of the same triangles. Rebuilt: each tongue has a teardrop body
  and a long whip tip, sways in an S and curls at the end; big tongues fork into side licks that peel away and turn up;
  sheets mix big tongues with small ones between them; tips thin into soft smoke wisps. All tongues of one fire are filled
  as one union (rim strokes first, fills over them), so the violet edge runs only round the outer rim. `flames()` now grows
  fire from a surface line along its normal and turns it upward, so fire follows the bone, cloth or back it burns from.
  Inside: a lifted core and a near-black violet lick for form. No blur on the fire, no glow, nothing lit by it. The
  emblems (shield, surcoat, morse) use a single plain tongue with no wisps.
- **The Saint Unending (rebuilt).** Larger (x1.22, platform at y 1330, the halo cropped by the frame top), shoulders
  widened. Anatomy: collarbones and the hollow above them, the sternal notch, the neck's long tendon and throat (the neck
  is no longer an inked box), ribs crease by crease on the flank, a clean void hole through the ribs showing the bones,
  muscled slender arms with the wrist knob and the ulna split open, knuckled praying hands with a bone fingertip, kneecaps,
  ankles raised so the feet have arches and toes. Face: shading 0.8 with modelled planes (shadowed side plane, cheek
  hollow, lit brow, nose and chin), closed lids with lashes and a lid crease, hollows under the eyes, brows lifted at the
  inner ends and knotted between them, lips parted on a word; char and violet cracks on the jaw and neck, a clean void hole
  in the cheek. Hair: a combed skull cap whose locks lift into many fine strands over a soft smoke plume (no crest). The
  shift: dirtied toward ash, a scooped neckline burnt off the near shoulder, cloth clinging rib by rib, bunched under the
  waist chain, clinging to the thigh, scorch rising from a hem burnt up to the knee, burn holes, void holes, and a large
  ragged window burnt out over the hip. Chains: round the waist pinning the elbows and round the knees, with a slack end,
  a padlock and three iron staples on the post. Stake: a hewn post with a lit bevel, long grain splits, irregular charred
  checks (no brick grid), adze facets, a void hole. Pyre: faggots leaning in from all sides, each of thin sticks with gaps,
  knots, twigs and cut ends, two twisted withy bands; split logs with growth rings; fire low between the bundles. The
  near shin is split down its face to the tibia and no fire covers it.
- **Pyre Seraph.** New `burntWing`: shoulder, elbow, wrist and tip with the hand breaking back at the wrist on all six
  wings; primaries from the hand, secondaries from the forearm, tertials, two layered rows of coverts casting onto the
  row below; each flight feather is either a charred vane with a ragged, holed, violet-threaded edge and a burnt-off tip,
  a bare shaft with barb stubs, or gone. The forearm is burnt to its two bones and the hand to the bone; the upper arm
  keeps charred skin; an alula stub. Black flame grows along each leading edge. Body: the robe is burnt off above the
  girdle except a panel over the far shoulder; the ash torso has pectorals, sternum, ribs, the belly's segments and the
  iliac line, cracked into violet seams and flaking, with a clean void hole. Hands: cracks across the knuckles, one
  fingertip burnt off, fingertips shedding ash. The face's void with its eye is kept (bible: half burned away to a void).
- **Cinder Hound.** New silhouette: withers above the croup, an arched loin, a brisket below the elbow and a high tuck,
  a slimmer neck, front legs with the elbow set back under the chest, a straight forearm and a sloped pastern, hind legs
  with a heavy thigh, stifle, gaskin and a sharp hock; the near upper legs sit under the body's edge so the shoulder and
  haunch belong to the body. New `cinders`: one shaded cinder mass per part, cracked along its form (topline, each rib,
  the shoulder blade, the haunch, the belly line on the body; the long axis on limbs) with irregular, bent cross-cracks;
  each crack a seam with a black-flame core and violet lips; plate edges worn pale; blotches of pale ash and dark clinker
  so each plate has its own tone; flakes and caked ash. Fire grows along the topline and hackles and streams back; ash
  falls from the belly.
- **Candle Wraith.** The skull is now anatomical in three-quarter side view: vault, frontal bone to the brow ridge, a
  squared orbit with its lateral rim and the far orbit as a sliver, nasal bones over a pear-shaped aperture, cheekbone and
  arch to the ear opening, mastoid, temporal fossa and line, coronal, lambdoid and squamous sutures, a maxilla with root
  ridges and an uneven tooth row, and a mandible with ramus, angle, coronoid, chin and mental foramen hinged in front of
  the ear. Wax from the candle ring caps the vault and runs down the forehead and temple, and hangs from the jaw. Larger
  candles with wicks; fire leaves the back of the skull along its surface and clears the void hole in the temple.
- **Unburnt Inquisitor.** Red: allowed. The bible entry names "heavy red-black robes" and "deep red-black robes" as his
  colour, which is red as doom (he sentences); other red on him is rubric (lettering, seals). Front band: the straight
  grey orphrey read as a staff at game size. It now follows the cope's opening edge and drapes, in dark red-black
  embroidery close to the cope's value, bent by folds crossing it, ending in a fringe.

### Gate 1: logic audit (independent)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Saint Unending | fixed | pass | pass | fixed | fixed | pass | 1: neck drawn as a box under a mask; now one neck blending into the torso, head on its line, tilted up. 4: ankles sat on the ground line so the feet were flat stubs; raised, both feet planted on the platform, far leg straight under the weight. 5: the halo was drawn over the chest (its rim crossed the torso); moved behind the body. Chains run to staples on the post. |
| The Unburnt Inquisitor | pass | pass | pass | pass | pass | pass | none (book closed and held, torch fist through `B.grip`). |
| Pyre Seraph | pass | pass (no held object) | pass | pass (hovering) | fixed | pass | 5: wings were combs rooted at points; now each wing is a jointed chain (wing_k, wing_k_2, wing_k_3) rooted at the back, overlapping at every joint. |
| Ash Penitent | pass | n/a | pass | pass | pass | pass | none. |
| Cinder Hound | pass (jaw on its hinge) | n/a | n/a | fixed | fixed | pass | 4: stick legs and a box body; legs now carry the weight on real elbow, hock and pastern angles. 5: near upper legs were capsules strapped on the flank; now under the body's edge, overlapping the joints. |
| Censer Deacon | pass | pass | pass | pass | pass | pass | none. |
| Candle Wraith | fixed | n/a | n/a | pass (floats) | fixed | pass | 1: jaw hinge moved to in front of the ear opening (ramus to condyle). 5: fire at the back pointed into the skull and covered the void; turned outward. |
| Pyre Knight | pass | pass | pass | pass | pass | pass | none. |

Pose tests re-run on the final rigs (same attacks as above; the Seraph's now also turns the hand bones `wing_n1_3`,
`wing_n2_3`, `wing_f1_3`, and the Hound's adds `leg_fn_1 -18, leg_fn_2 12, spine_2 -4`). All parts stay attached and no
joint opens. Rigs: no MISSING JOINTS; rig.json ground = canvas h - 30 on all eight (1570, 1370, 1370, 790, 1070, 790,
790, 1070). The Seraph now has 35 bones (three per wing).

### Gate 2: style and detail (independent)

| Figure | Signature at 190 px | Course marks / Never | Grit (need) | Palette | Section 9 | Result and fix |
|---|---|---|---|---|---|---|
| The Saint Unending | pass: figure on the stake with the gold halo | fixed: fire was clip-art triangles and hid the shin; now licking, forked fire with violet only on the rim, shin bone clear; void holes clean | fixed: 20+ (halo, Tooth, titulus, three staples, two chains, padlock, slack chain, tibia, ulna, bone fingertip, rib void, cheek void, burnt shoulder, hip window, burn holes, garland, skull, long bone, candle stubs, faggot withies, logs with rings, smoke hair) | pass (gold only on the halo) | pass: the shift and prayer remain; fire splits her to the bone (bible) | fixed (thin flat figure, mask face, plain shift, structureless stake and pyre) |
| The Unburnt Inquisitor | pass: mitre and raised torch | pass | pass (16) | pass: red-black robes are named by the bible as his colour (doom); other red is rubric | pass | fixed (front band read as a staff) |
| Pyre Seraph | pass: six burnt wings round a hovering figure | fixed: wings now burnt to the bone with ragged vanes and fire along the edge | fixed (12+: wing bones, shafts, vanes, two covert rows, alulae, broken halo and fallen piece, robe panel, girdle, crack nets, chest void, face void with its eye, crumbling fingertips, falling ash) | pass | pass | fixed (comb wings, plain robed torso, plain hands) |
| Ash Penitent | pass | pass | pass (11) | pass | pass | pass |
| Cinder Hound | pass: lean nose-down hound | fixed: cinder plates crack along the form with violet-lipped seams; fire along the topline | fixed (10: ribs, shoulder blade, haunch line, elbow and hock points, paws and claws, rose ear with void hole, flank void, ember eye, ashprints, falling ash) | pass | pass (an animal named by the bible) | fixed (cobblestone grid on stick legs) |
| Censer Deacon | pass | pass (fire inside the censer re-checked with the new helper) | pass (12) | pass | pass | pass |
| Candle Wraith | pass: burning skull with candle crown and hanging wax | fixed: anatomical charred skull, void hole in the temple clear of fire | fixed (12: sutures, temporal line, mastoid, ear opening, tooth row with gaps, mental foramen, wax cap and drips, wax runs and drops, iron ring with five candles and rivets, char, cracks, ember eye) | pass | pass | fixed (cartoon skull) |
| Pyre Knight | pass: shield with torch, raised mace | pass (torch fire re-checked; emblems now plain single tongues) | pass (15) | pass | pass | pass |

Silhouettes (`sil.png`) re-checked: no two foes share a silhouette. The fire's smoke threads were softened so they no
longer hook out of the silhouettes as hard lines.

### Still open (independent)

- The Saint stays slender by the bible, so she has less mass than the seated rulers; at sheet size the shift is still the
  largest pale area on the sheet, though now scorched, holed and folded. The small cheek void reads at 1x as a dark spot.
- The wing fire is joined along each leading edge by a thin black band that runs behind the bones; at full size it reads
  as charred skin on the bone, which is intended, but an artist may want it thinner.
- The Hound's plate tones come from soft noise blotches; at 2x they read as mottled cinder, not individually cut plates.
- The Seraph's six wings are still spread close to radially (a seraph's display); a later pass could fold one pair over
  the feet as the old iconography does.
- The Saint's hair smoke and the Deacon's censer smoke are baked soft smoke (bible); they could move to FX layers in the
  consistency pass, like the lightning ruling.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| Pyre Seraph | wings near-radial | The six wing chains were mirrored spokes. Each pair now does its own work and the sides differ: the upper pair raised and arched over the halo, the hands breaking forward so the tips curl in above the head; the middle pair are the flying wings, bent hard at the wrist with the primaries swept back, the near one lower and further back than the far one; the lower pair hang folded beside the robe, hands turning in toward the dangling feet, the far one behind the shins. Only the joint positions in `W` changed (bone names and parents kept). | pass at 0.3x: no wheel or star read |

Rig re-exported (35 bones, no MISSING JOINTS); dive pose (`torso -18`, wings swept 15 to 25, `upperarm_f -20`,
`head 10`): wings stay rooted. Sheets rebuilt (`worlds/sheet_XIII.py`, `worlds/sheet_XIII_b.py`). Weak spot: the near
lower wing's feathers overlap the robe's near edge.
