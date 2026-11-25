# World XIII, The Black Pyre: review (batch b, 11 creatures)

Eleven creatures in `worlds/world_XIII_b.js`, helpers in `worlds/kit_XIII_b.js` (it requires `./kit_XIII` and re-exports
it unchanged, plus `bareArm`, `bareLegRig`, `splitDraw`, `folds`, `placard`, `candle`, `paintedFlames`, `IRON`,
`rivetRow`, `plateSeam`, `heatBloom`, `sootStreaks`, `scale`, `hearth`, `batWing`, `hoof`), sheet script
`worlds/sheet_XIII_b.py`. The first batch's files were not edited.

Seeds 1320 to 1330 in bible order: Iron Bull 1320, Confessor 1321, Questioner 1322, Bellows Sister 1323, Recanter 1324,
Belfry Bats 1325, Familiar 1326, Faggot-Bearer 1327, Scold 1328, Ash Pardoner 1329, Charred Destrier 1330. Every figure
is a foe: drawn facing right with `kit_XIII.base` (kit.foeBase) and `flip: true`.

Canvases (true size wins, GUIDE section 2; one pixel scale, a 1.0 human 640 px; `groundY = h - 30`, checked in every
rig.json):

| Figure | Tier | Canvas | Ground | Why |
|---|---|---|---|---|
| The Iron Bull | ruler 3.5 at the shoulder | 2400 x 2300 | 2270 | shoulder 2240 px: heightened in the independent review so the hump rises out of the frame top instead of being cut off above the belly; the hindquarters run out of the far side, as the bible says |
| The Confessor | ruler 4 | 2000 x 1800 | 1770 | three bays wide; the pinnacles run out of the top |
| The Questioner | elite 2.0 | 1100 x 1400 | 1370 | tier canvas |
| The Bellows Sister | elite 1.9 | 1600 x 1400 | 1370 | the bellows are as long as she is tall |
| Charred Destrier | large 1.7 at the head | 1300 x 1250 | 1220 | a great horse's length and height |
| Faggot-Bearer | large 1.5 | 900 x 1250 | 1220 | the stack and its fire rise above the tier canvas (drawn 100 px higher and set down with `placeFigure`) |
| Recanter | human 1.0 (1.3 to the hat) | 600 x 1000 | 970 | the cone hat |
| The Scold | human 1.0 | 700 x 820 | 790 | the board held out |
| Ash Pardoner | human 0.95 | 600 x 1000 | 970 | the tall pole |
| The Familiar | small 0.6 reared | 600 x 820 | 790 | tier canvas |
| Belfry Bats | small, a 0.6 swirl | 600 x 820 | 790 | tier canvas |

Outputs: renders `out/worlds/world_XIII_b_<key>.png` and `_sil.png`; rigs `out/rig/worlds/world_XIII_b_<key>/` (no
MISSING JOINTS on any); pose tests `out/worlds/XIII_b/<key>_pose.png`; sheets `out/worlds/XIII_b/sheet.png`,
`sheet19.png` (all nineteen, with the Drowned Thrall at 1.0) and `sil.png` (all nineteen at game size).

Courses as drawn, matching batch 1. Fire (dominant): skin, oak and iron split into seams with charred lips and a violet
thread (`seam`, `crackNet`, `hairline`); char stains; flakes and iron scale; ash curling up; hems burnt into curled
tongues (`charHem`, `charEdge`). Void: the flame is near-black with a violet rim and gives no light (`flameSheet`,
`flames`, `blackFlame`: joined, curling, forked tongues of mixed sizes; never a row of triangles); clean round holes with
clean pale rims, cut through where the bible says "through" (`cutHoles`) or rimmed disks; the void's cold heat bloom on
iron is violet-grey, never orange. Eyes only where the entries call for them: the faces of the condemned inside the Iron
Bull, the eyes in the Confessor's woodwork, the Scold's own red-rimmed eyes behind his mask, the Destrier's violet
embers, the Familiar's ash-pale eyes. Gold: none (nothing in this batch is holy). Red: rubric only (placards, the bull's
band of judgement, the list of sins, the bull's seal lines) and the Recanter's saltire (doom, named by the bible).
Bronze on the Iron Bull's legs only (the brief asks for cast bronze legs), blackened and sooted, green only in the
casting's crevices.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head, neck and spine (non-humanoids: jaw on a hinge, legs carrying the weight, one spine); 2 objects face the
user, gaze; 3 grips and hands; 4 weight and balance; 5 contact and attachment; 6 facing and light. "Fixed" means it
failed during the build and passes on the final render. Grips were measured by wrapping `B.grip` in a scratch script
(no shared file touched); every across-grip now meets its object within the allowed bend and none warns.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Iron Bull | pass (jaw on a pinned hinge) | n/a | n/a | pass (four planted legs, near feet on the hearth's front edge, far feet higher on its top face) | fixed | pass | 5: the near horn first curled back into the neck; now it leaves the poll and curves forward. The legs first stood under flat collars like boots; their flanges are now riveted under the belly. |
| The Confessor | pass (head bowed on the line of the seated body) | pass (the hand rests on the armrest) | pass (rosary hangs from the fingers) | pass (seated; the penitents kneel on their kneelers) | fixed | pass | 5: the reaching hand was drawn behind the inner post; it is now drawn last so it comes out through the curtain onto an armrest that reaches past the post. The bay interiors' smoothed corners bulged below the base as black arches; corners now sharp. |
| The Questioner | pass | pass (the iron held up ahead of him, away from the face) | pass (tongs inline, off 0) | pass (weight on the straight back leg, belly forward) | fixed | pass | 5: the brazier was drawn over the far forearm, so the stump floated; the brazier is now drawn first and the stump rests on the rim. |
| The Bellows Sister | pass | pass (nozzle aimed at the party) | fixed | pass (feet wide, knees bent, hips low) | fixed | pass | 3: the near forearm ran almost along the top handle (70 deg off square, warning); the elbow now rises up and out toward us (foreshortened), 27 deg off square. 5: lifting the top board opened a gap; the leather sides now sit on the fixed bone and run up under the top board. |
| Recanter | pass (stoop from the upper back) | pass (eyes on the flame, 16 deg off the head axis) | pass (both hands round the candle, square to it) | pass (weight on the straight back leg, the front heel up) | pass | pass | none. The placard first hung over the saltire; moved to the back hip. |
| The Scold | pass (head over the board, stooped) | n/a | pass (fists through the holes) | pass (leaning forward onto the front foot) | pass | pass | none. |
| Ash Pardoner | pass | pass (palm up toward the buyer) | pass (pole, 5 deg inside the limit) | pass (leaning in on the front foot, the pole planted) | fixed | pass | 5: the void hole sat at the ear and read as an ear plug; moved onto the cheek with the teeth showing. |
| The Familiar | fixed | n/a | n/a | fixed | fixed | pass | 1/4: first build was a sausage body on crouched stick legs and read as a sitting dog; rebuilt as a lean barrel (withers, croup, tucked flank) reared on straight-ish hind legs with stifle and hock. 5: the beard stood up off the chin; now it hangs plumb from the chin. The ear stood up like a horn; now it droops back. |
| Belfry Bats | pass (one spine per bat) | n/a | n/a | pass (flying) | fixed | pass | 5: the first wings were small black splotches with the lace drawn as black paint; rebuilt bigger with finger bones over the membrane and lace holes cut right through. |
| Faggot-Bearer | pass (head pushed forward under the load, on the neck line) | n/a | fixed | pass (bent forward over the front foot, the load over the feet) | pass | pass | 3: both strap fists were up to 62 deg off square; the far thumb now follows the strap and the near elbow sits back at his side (both within limits). |
| Charred Destrier | pass | n/a | n/a | fixed | pass | pass | 4: the first legs were stilts with ball joints; now muscled forearm and gaskin, a bony knee, the hock's point, flat cannons, round fetlocks, shod hooves, the near forehoof lifted. |

Pose tests (the attack from each Motion line; on the mirrored rigs a positive angle turns a bone clockwise on screen):

| Figure | Bones | Test | Result |
|---|---|---|---|
| The Iron Bull | 6: root, body > head > jaw, nose_ring > nose_chain, pipe_smoke | bellow (`head 8, jaw -10, nose_ring -8, nose_chain 6, body -1`) | pass; the nose chain lifts off its floor staple with the head (animate the chain's end or IK it) |
| The Confessor | 11: root, curtain, head > jaw, arm > hand, penitent_l > _head, penitent_r > _head, lamp, bell_pull | the reach (`arm 18, hand -20, head 6, jaw 4, curtain -2`, the penitents nod) | pass |
| The Questioner | 20: standard + tongs > iron, apron, hood, tools | pressing the iron (`torso -5, upperarm_n -15, forearm_n -30, hand_n -10`) | pass |
| The Bellows Sister | 20: standard + bellows > bellows_top, skirt, sack, apron | a pump (`bellows_top -2.5`, the near arm follows) | pass; the hands need IK onto the handles |
| Recanter | 20: standard + candle, hat, skirt, noose_tail, placard | tipping the candle (both forearms and hands tip it forward) | pass |
| The Scold | 18: standard + fiddle, bell, skirt | the choked cry (`torso -5, head -6`, arms follow) | pass; the wrists are locked in the board, so the forearms need IK to the holes |
| Ash Pardoner | 19: standard + pole, tray, skirt, hat | flinging the ash (`upperarm_n 22, forearm_n 8`) | pass |
| The Familiar | 21: spine_1 > spine_2 > neck > head > jaw, tail, 4 legs x 3, tether > stake, placard | the rearing butt (`spine_2 -14, neck -10, head -8`, forelegs) | pass; the tether lifts off the floor with the neck |
| Belfry Bats | 12: bat_1..11, bat_12 (the rider, parented to bat_6) | the dive (each bat turned 15 to 40 deg) | pass |
| Faggot-Bearer | 20: standard + frame > load_top, skirt, cord_1 > cord_2 | tipping the top bundles (`torso -10, frame -12, load_top -25`) | pass |
| Charred Destrier | 20: spine_1 > spine_2 > neck > head > jaw, tail, legs x 3, reins, scabbard | rearing (`spine_1 18`, hind legs counter-turned, forelegs folded) | pass; the hind hooves need IK to stay planted |

Holds that need IK: the Recanter's far hand on the candle (the candle hangs on `hand_n`); the Scold's forearms to the
board's holes (the board is on `head`); the Bellows Sister's hands to the two handles (the bellows is on root); the
Faggot-Bearer's fists on the straps follow the torso (no IK for the idle, IK if the frame moves alone); the Iron Bull's
nose chain end and the Familiar's tether end on the floor; the Destrier's planted hooves when it rears.

## Gate 2: style and detail

Signature at 190 px judged from `sil.png` (all nineteen). Section 9 test per row: which course did this, to whom, and does
the bible say so? The world has a church and an inquisition, so corrupted clergy, relics and instruments are supported.

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Palette | Section 9 | Result and fix |
|---|---|---|---|---|---|---|
| The Iron Bull | pass: the lowered iron head with its horn and nose chain over legs standing on a brick hearth | split seams with violet lips and black fire inside, scale flaking, soot, violet heat bloom, ash off the back; clean round holes with faces pressed inside / no glow, no orange | 24 (12): hatch with door thickness, strap hinges, bar in brackets, melted padlock, nose pipes, nose ring and chain to a floor staple, horns (one snapped), rubric band half burned, poll curls, brow ridge, hinged jaw and pin, ladder, hearth arches, two bellows nozzles, popped rivets, ash heaps, charred bones and skull, poker, floor rings, cast leg seams, leg flanges, rivet rows | pass (rubric only on the band; bronze legs per the brief) | remnant: the engine itself and its victims' faces; pushed: fire splitting the seams (bible) | fixed (legs as tubes; flat head) |
| The Confessor | pass: the tall three-bayed booth with the hand out through the curtain | oak split into violet seams, tracery charred and curling into ash, black fire through every hole, clean holes with eyes / no glow | 20 (12): violet stole with stub fringe, rope girdle, curtain rags on a rod, rosary from the hand, two penitents with caps and rosary, pierced grilles with fingers through, kneelers worn hollow, list of sins in rubric, hanging lamp, warped hinges, poor-box slot, slate of penances, bell-pull, ash on the steps, crocketed gables, carved niches, panelled base | pass | remnant: the confessor's stole and the booth; pushed: the black fire inside (bible) | fixed (rounded posts, phallic tassel read, flat cartoon penitents, pale head) |
| The Questioner | pass: the tripod brazier of irons and the raised tongs | forearms split along the muscle into violet seams, ash off them, the void stump rimmed clean / none | 16 (10): leather apron with burn holes, torn shirt, skullcap, hood down the back, key on a thong, pincers, thumbscrew, knotted cord, hammer, belt and buckle, brazier rivets and rolled rim, rag-wrapped irons, bucket of still water, shin burn scars, wrapped boots | pass | remnant: the torturer's apron and tools; pushed: fire's slow work on his arms | fixed (stump hidden) |
| The Bellows Sister | pass: the huge bellows at the hip, nozzle forward | face and hands crazed into violet seams, hands charred black, ash off the shoulders, a clean hole through her side with ash blowing through / none | 15 (10): grey habit kilted, sleeves pinned back, scorched apron, wimple band, iron pattens, poker and fire-iron, tinder bundle, charcoal sack, charred rosary, old cheek scar, patched leather, nail studs, iron nozzle, hinge block, patches | pass | remnant: the lay sister's habit and wimple; pushed: fire on face and hands (bible) | fixed (sleeve read as armour; hole hidden) |
| Recanter | pass: tall cone hat over the bowed head and the candle | knuckles split with violet seams, charred patches where wax ran, clean punched holes from the wax (hand, forearm, foot) / no cartoon head flames (the hat's flames are paint, named by the bible) | 13 (6): painted hat with seam and dent, tabard with saltire and down-pointing painted flames, charred hem, noose with hangman's coil and tail, placard in rubric, wooden rosary with cross, rope girdle, ragged shift, knee scabs, patch, burn hole, wax drips | pass (red saltire is doom, named) | remnant: the sanbenito, candle and placard; pushed: the wax's holes | fixed (spotty hat flames, triangle-row tabard flames; now joined painted bands) |
| The Scold | pass: long-snouted, long-eared mask above the board held out | hands and forearms charred and split, black flame leaking from the slot mouth, void hole through the shoulder / none | 13 (6): hinged mask with spectacles, tin ears, padlock at the nape, strap over the scorched tonsure, bell on the snout, fiddle board with iron bands and padlock, placard nailed on, rosary in the wrist hole, ash in the holes, sackcloth shift, rope girdle, blisters | pass | remnant: the lay brother's shift and tonsure; pushed: the iron tongue burnt into his mouth | pass (ears enlarged to donkey ears so they do not read as a rabbit's) |
| Ash Pardoner | pass: the pole hung with lead vials and scrolls | fingertips split and smouldering black, coat hems charred, clean hole through the cheek / none | 14 (6): crosspiece lashing, ampullae, sealed pardons, neck tray with vials, horn scoop, relic box with finger-bone, fat purse, forged bull with lead seal, pilgrim hat at the back, hood down, patches, leg wraps, broken tooth | pass | remnant: the pardoner's pole and tray | fixed (cheek hole) |
| The Familiar | pass: small reared goat, horns lowered, tether trailing | hair burned off in patches, seams along ribs and haunch, beard smouldering, clean holes through ear and flank / none | 10 (6): placard in rubric, burnt tether, stake stub, collar and clapperless bell, straw on the horns, split hooves, brand on the haunch, shrunken udder, ringed horns, ash | pass | an animal named by the bible; pushed: fire on the hide | fixed (rebuilt body, beard, ear) |
| Belfry Bats | pass: a swirl of lace-winged bats | wings burnt to the finger bones, membranes charred to lace with violet edges, fur smoking, ash shed, clean holes through wings, a headless bat with a clean rim / no sparkles | 8 (6): bell rope strand, hymn page scrap in a claw, a rider on another's back, a fleck of black flame on a wing, thumb claws, tail membranes, open shrieking mouths, ear stubs | pass | animals named by the bible | fixed (splotch wings) |
| Faggot-Bearer | pass: the towering stack on the bent back | back and shoulders charred and split across the blades, ash off him, the top bundles burning black, a clean hole through the calf (cut through) / none | 13 (6): back-frame rails, withy lashing, end-on and long bundles with cut ends, leather pad, shoulder straps, kilted habit, rope belt, hatchet, willow coil, wooden clogs, leg sacking, knotted cord dragging, burned tonsure | pass | remnant: the lay brother's habit and tonsure | fixed (row-of-triangles top fire now a joined sheet; bundles read as planks, cut ends added) |
| Charred Destrier | pass: tall horse with the empty saddle and the rider's legs | hide burned to charred muscle in patches, seams along neck and flanks, mane burned short and smoking, clean hole through the neck base / none | 14 (6): caparison with embroidered flame and burnt windows, chanfron with spike and eye guard, war saddle with iron-bound cantle and pommel, rider's legs cut clean at the hip, poleyn and sabaton in the stirrup, reins trailing, bit, crupper strap, girth, empty scabbard, iron shoes, split hoof | pass | remnant: the warhorse's harness; pushed: fire on the hide | fixed (stilt legs, box caparison) |

Silhouettes (`sil.png`, nineteen figures): no two share a silhouette. Against the first batch: the Iron Bull (a lowered
head and legs on a hearth) and the Confessor (a three-gabled booth) are clear of the Saint (a stake); the Questioner's
tripod, the Bellows Sister's long wedge, the Faggot-Bearer's tower and the Recanter's cone are each unique; the Scold's
eared mask over a level board, the Pardoner's gallows-like pole, the reared goat and the bat swirl are clear of the
Ash Penitent, Censer Deacon and Candle Wraith; the Destrier is the only horse.

Faults from GUIDE section 8 and the brief, checked per figure:
- Tube limbs: humans use `muscleArm` and `fullLeg`/`bareLegRig`; animals use multi-joint outlines with muscle bulges.
- Faces: shading 0.8 to 0.82 on Recanter, Pardoner, Questioner, Bellows Sister and Faggot-Bearer; the Confessor's face is
  deliberately in the cowl's shadow.
- Flames: every fire is a joined union of curling tongues; painted flames (hat, tabard, caparison) are joined bands.
- No baked lightning, no glow, no gold.

## Still open (honest notes for the director)

- **Iron Bull against the Drowned King bar:** the cast detail is dense (seams, rivets, hatch, holes with faces, legs,
  hearth), but the flank is still one big barrel and the head reads as a crude helmet more than a bull at full size.
  The far legs are darker and higher for depth, though the body itself has no strong foreshortening.
- **Confessor:** the confessor's head is a dark cowl with bare teeth; at full size it reads, but the seated body under
  the curtain is mostly a dark mass. The penitents are seen from behind (backs, raised arms, bowed heads), which avoids
  mirrored lighting but makes them simpler than the main figures.
- **Familiar:** the body and legs are much better than the first build but the head is angular, and the whole goat is
  dark at game size.
- **Destrier:** the caparison still covers most of the barrel as one big cloth area (folded, burnt through, embroidered).
- **Recanter and Scold:** the forearms of the thin men are long for their bodies (the candle and the board needed them).
- **Bellows Sister:** the near arm is strongly foreshortened (elbow toward us) to keep the grip square.
- **FX:** the pipe smoke on the Iron Bull, the nostril smoke on the Destrier and the beard smoke on the Familiar are baked
  soft smoke on their own bones; they could move to engine FX in the consistency pass, like the lightning ruling.

## Independent review (2026-11-23)

Reviewed fresh against MAKER_BRIEF.md, GUIDE.md sections 2, 8 and 9, LOGIC_CHECKLIST.md, bible 00 and the XIII entries,
with the Drowned King (ruler bar), the first batch (black flame, Cinder Hound), the Dray Horse, the Gin Ox, the Last
Prize and the Dead-Cart as references. Every figure was rendered alone on a mid-dark ground and read at 2 to 3x (heads,
hands, held objects, feet), at sheet size and at game size. All four director callouts were upheld as fails. Every
figure changed was re-rendered, re-rigged (no MISSING JOINTS), pose-tested and looked at again.

### What changed

- **The Iron Bull (rebuilt).** It read as a horse-headed barrel on four columns. Now a brazen bull: a broad, short head
  lowered and turned to the party (wide flat forehead with irregular cast poll curls, a brow ridge over each empty
  socket with black fire behind it, a broad square muffle with flared nostrils fitted with the pipes, the ring through
  the septum, the jaw hinged open), heavy horns from wide ringed bosses (the far horn sweeping out and up, the near one
  snapped to a stout stump with a pale fractured face), ears set out under them; a short thick neck with crest folds
  and the band of judgement wrapping it (lit lip, stepped edge, lettering burned off under soot and scale); a deep
  dewlap hanging in folds to between the forelegs; a massive hump rising out of the frame over a cast shoulder plate
  (scapula, point of shoulder, triceps). The barrel rounds away from us: the back line drops and the belly rises toward
  the hindquarters, the back is lit along its top, the flank falls into shadow and the underside turns to near black.
  The maker's ring seams bowed toward the chest, the wrong way for a barrel whose front end is the visible end; they now
  bow toward the rear, tighten toward the back and turn under the belly. Legs are cast bronze bull legs: heavy forearm
  and gaskin masses with modelled muscle, a bony knee, the hock's point, flat cannons, fetlocks with dewclaws, cloven
  hooves with a pointed toe and a cleft, a casting parting line with flash, pits and green in the crevices, darker
  bronze so they no longer glow against the iron. The canvas is heightened to 2400 x 2300 at the same pixel scale
  (GUIDE section 2) so the hump shows rising out of the frame. Kept: the hatch, the rivets, the fire under it, the
  faces in the holes, the ladder, the hearth, the poker, the chain and the floor rings.
- **The Confessor (figure rebuilt).** He is now the focal point: a modelled, bowed face under a deep charred cowl (face
  shading 0.8, closed lids, the brow knotted, the lips burned off the gums and teeth, char and violet cracks; the cowl's
  shadow over the brow), a draped charred habit (folds from the shoulders to the girdle, tension folds from the knees,
  valleys hanging from them, cross folds), the violet stole down both sides, the far hand on the lap holding the stole's
  end, and the near arm in a wide sleeve with a charred mouth, the bare forearm cracked, the hand laid over the armrest
  with the rosary hanging plumb. He is ash grey against the booth's black and takes the key light, with a dim ambient
  hollow behind him; the black fire gives no light (bible), so the separation is by value, not glow. The penitents were
  block mannequins; they are now people seen from behind kneeling to the grilles: bare charred backs (spine furrow,
  lifted shoulder blades, ribs), muscled raised arms, the hands' backs toward us with the fingers hooked into the
  grille, lost-profile heads (ear, nape, jaw line, cheek edge, charred cap), the shift roped at the waist, the soles
  fused to the kneeler. The warped hinges and the list of sins moved onto the outer post so they no longer cross a
  penitent; the curtain's middle rags were shortened so they frame him; the post cracks and niches were toned down so
  the architecture stops dominating.
- **Charred Destrier (rebuilt).** Dray Horse habits: a deep rounded barrel (girth about 45 percent of the withers
  height), the back dipping to the saddle and rising to a rounded croup, the haunch and thigh as one mass over a gaskin
  that tapers to the hock's point; forearms muscled to a bony knee; flat cannons with the tendon behind; round fetlocks
  with singed tufts; sloped pasterns; shod hooves. The neck is crested and arches back off the poll (with the face
  carried high, a straight crest would cross the throat line). The head is a long tapered skull: flat forehead under the
  chanfron, the big round of the cheek, the jaw tapering to a narrow muzzle with parted lips, a comma nostril, a small
  ember eye in a flanged cup, pricked ears. The caparison is two pieces: a trapper over the quarters and a peytral cloth
  over the chest, the barrel bare between them; soft folds (valley and lit ridge) start along the hanging edges and
  fall plumb; hems burned into short curled tongues, windows burned through, scorch rising from the hem, burn holes,
  the embroidered black flame.
- **The Familiar (rebuilt).** A goat's body (a deep chest, the barrel tucking up into the flank, the hip's point and the
  haunch), thin jointed legs with muscled thigh and forearm, a modelled goat skull (flat forehead and brow, a high-set
  small eye gone ash pale with a horizontal slit, a straight nasal bone, a narrow split-lipped muzzle, the cheek's round,
  the jaw's floor), ringed horns, a drooping ear with its void hole moved toward the tip (at the root it read as a
  second eye). Value range: the black hair carries a strong sheen on the planes facing the light, burned-off hide is ash
  grey, the horns grey-brown, the eye and ash pale; at game size it reads in light, mid and dark. The neck arches over the
  poll for the same reason as the horse's.
- **Recanter.** The near forearm was 121 px (about 0.2 of the figure); the candle and both hands moved in so it is 98 px
  and the far one 86 px; arms slimmed to a thin man's.
- **The Scold.** The arms read as a sackcloth wedge under the board and the wrists sat about 170 px in front of the neck.
  The board is shortened so the wrist holes sit about a forearm ahead of the chin (forearms 130 to about 105 px), the
  elbows tuck, and the bare arms are thinner and a warmer flesh tone so they read as bare arms (bible), not the shift.
- **The Bellows Sister.** The charcoal sack's edge lumps and two burn holes read as a ghost's face (an unwanted eye motif):
  the lumps now press through the sacking as creases and sit at the gathered mouth. The pursed lips were a pink tube in a
  reddish tint (red rule): smaller, set closer to the face, ash-toned. The habit's back was a flat slab: a lit top plane
  and long folds added.
- **The Questioner.** The raised arm's upper arm read as a tube: the deltoid's edge, the biceps and triceps groove, a lit
  biceps belly and a vein added.
- **Rig fault fixed at the source.** The maker's Confessor called `f.bone('jaw')` inside a `clipDraw`, which splices the
  output and corrupts the bone marks, so the jaw layer was mis-attributed. The rebuilt figure changes bone only between
  clipped blocks; a scan of the whole file finds no other bone call inside `clipDraw`, `cutHoles`, `split` or
  `splitDraw`.

### Gate 1: logic audit (independent)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light | Finding, fix, re-check |
|---|---|---|---|---|---|---|---|
| The Iron Bull | fixed | n/a | n/a | fixed | pass | fixed | 1: a horse's head on a barrel; now a bull's head on a short neck with the jaw on its pinned hinge. 4: column legs; now bull legs on cloven hooves, near feet on the hearth's front edge, far feet higher and darker. 6: ring seams bowed the wrong way for the visible chest end; now bow toward the rear. Re-checked on render and the bellow pose. |
| The Confessor | fixed | pass | fixed | pass | fixed | pass | 1: a dark egg with cartoon teeth; now a modelled bowed head in the cowl, on the line of the seated body. 3: a sausage arm and splinted hand; now sleeve, forearm and a laid hand, the rosary plumb from the fingers. 5: hinges and the sin list crossed a penitent; moved to the post. Rig: jaw bone was set inside a clip (mis-attributed layer); fixed. Re-checked on the reach pose. |
| The Questioner | pass | pass | pass | pass | pass | pass | tongs inline, stump on the rim; only the upper arm's modelling changed (gate 2). Pose re-run. |
| The Bellows Sister | pass | pass | pass (IK) | pass | pass | pass | grips unchanged; pose re-run. Hands need IK to the handles. |
| Recanter | pass | pass | fixed | pass | pass | pass | 3: forearms too long for the body; hands brought in, both still square round the candle (no grip warning). Far hand needs IK when the candle tips. |
| The Scold | pass | n/a | fixed | pass | pass | pass | 3: wrists locked far ahead of the neck, forearms too long; board shortened, elbows tucked. Forearms need IK to the holes. |
| Ash Pardoner | pass | pass | pass | pass | pass | pass | none. |
| The Familiar | fixed | n/a | n/a | fixed | fixed | pass | 1: neck and head rebuilt so the crest arches over the poll and the throat stays in front of it. 4: tube body; now a goat's body over hind legs with stifle and hock angles. 5: ear void moved so it is not read as an eye. Re-checked on the butt pose. |
| Belfry Bats | pass | n/a | n/a | pass | pass | pass | none. |
| Faggot-Bearer | pass | n/a | pass | pass | pass | pass | none (fists close on the straps at 2x). |
| Charred Destrier | fixed | n/a | n/a | fixed | pass | pass | 1: neck geometry rebuilt (arched crest, throat ahead of it), head a long skull. 4: box body on stilts; now a deep barrel on muscled jointed legs, the near forehoof pawing, weight back. Re-checked on the rearing pose. |

Seeds 1320 to 1330 in bible order, one per figure; every entry `flip: true` with the foe light; rig.json ground = canvas
h - 30 on all eleven (2270, 1770, 1370, 1370, 970, 970, 790, 790, 1220, 790, 1220). Palette: no gold; red only on rubric
(placards, the bull's band, the sin list), the Recanter's saltire (doom, named), the Scold's red-rimmed eyes (named) and
scabs (blood). Eyes only where the bible names them (the condemned in the bull, the eyes in the booth's woodwork, the
Scold's own eyes, the Destrier's embers, the Familiar's ash-pale eyes). Flames: every fire goes through the kit's joined,
curling tongues (`flameSheet`, `flames`, `blackFlame`); painted flames are joined bands.

Pose tests re-run on the changed rigs: Iron Bull (bellow: head 8, jaw -12, nose_ring -8, nose_chain 6, body -1),
Confessor (reach: arm 18, hand -20, head 6, jaw 5, curtain -2, penitent heads +-6), Destrier (rearing: spine_1 16,
spine_2 4, hind legs -18 and 4, forelegs folded, neck -6, head 8, jaw 6), Familiar (butt: spine_2 -14, neck -10, head -8,
forelegs), Recanter (tipping the candle), Scold (choked cry), Bellows Sister (pump), Questioner (pressing the iron). All
parts stay attached and no joint opens.

Holds that need IK: the Recanter's far hand on the candle (the candle rides `hand_n`); the Scold's forearms to the
board's holes; the Bellows Sister's hands to the two handles; the Faggot-Bearer's fists on the straps if the frame moves
alone; the Iron Bull's nose-chain end and the Familiar's tether end on the floor; the Destrier's planted hind hooves and
the reins' floor end when it rears.

### Gate 2: style and detail (independent)

| Figure | Signature at 190 px | Course marks / Never | Grit (need) | Palette | Section 9 | Finding, fix, re-check |
|---|---|---|---|---|---|---|
| The Iron Bull | fixed: horns, hump, dewlap and cloven legs on the hearth read as a bull in silhouette | pass: split seams with black fire, scale, soot, violet heat bloom, clean holes with faces | pass (24+) | pass | pass: the engine and its victims | fixed: horse head, barrel, columns, flat body; now reaches the Drowned King's density with modelled form. |
| The Confessor | pass: three-bayed booth, hand out through the curtain | pass | pass (20+) | pass (violet stole) | pass | fixed: dark mass in the booth, mannequin penitents. |
| The Questioner | pass | pass | pass (16) | pass | pass | fixed: tube upper arm. Head, tongs fist, stump and boots pass at 2x. |
| The Bellows Sister | pass | pass | pass (15) | fixed (lips tint) | pass | fixed: ghost-face sack, cartoon lips, flat habit back. |
| Recanter | pass | pass | pass (13) | pass | pass | fixed: long forearms. The tabard is still the plainest area on him. |
| The Scold | pass | pass | pass (13) | pass | pass | fixed: long forearms, arms reading as cloth. |
| Ash Pardoner | pass | pass | pass (14) | pass | pass | pass at 2x: face, held-out hand, pole, boots and wraps. |
| The Familiar | pass: small reared goat with the horn arching up | pass | pass (10) | pass | pass | fixed: angular head, dark at game size, sausage body. |
| Belfry Bats | pass | pass | pass (8) | pass | pass | pass at 2x: lace wings on finger bones, pug faces, the headless bat's rim. |
| Faggot-Bearer | pass | pass | pass (13) | pass | pass | pass at 2x: modelled head, fists on the straps, clogs. |
| Charred Destrier | pass: tall horse, empty saddle, rider's legs | pass | pass (16) | pass | pass | fixed: boxy body, cartoon head, one flat caparison. |

Silhouettes (`sil.png`, all nineteen) re-checked: no two share a silhouette; the new bull (horns and hump on a hearth)
and the new goat stay clear of the first batch's hound and the stake.

### Still open (independent)

- **Iron Bull:** the frame crops the barrel's top flat at the canvas edge, so the hump's crest itself is off-frame (as
  the bible asks); the forehead is a crude flat plane by design (a cast head), which an artist may want to dish more.
- **Confessor:** the penitents' hands are the house `openHand` seen from the back; at 2x they read as hands pressed to the
  grille more than fingers hooked through it.
- **Destrier:** the bridle reads a little like a halter at 2x; the far legs are simple darker copies.
- **Familiar:** at 3x the eye and nose are still simple shapes for a 110 px head.
- **Recanter:** the tabard below the saltire is still a broad flat area (folded and scorched, but straight-sided).
- **Questioner, Pardoner, Bats, Faggot-Bearer:** passed at 2x with no change; none of them is at the rulers' density.
