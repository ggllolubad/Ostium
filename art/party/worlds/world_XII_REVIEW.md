# World XII, The White Silence: review (first batch)

Figures (seeds 1200 + index): The Cold Star (1200), The Pale Hunter (1201), Void Mammoth (1202), Hollow Wanderer (1203),
Silence Stag (1204), Starless Eye (1205), Frozen Saint (1206), Rime Shade (1207). File `worlds/world_XII.js`, helpers in
`worlds/kit_XII.js` (copied from kit_VII / kit_IX, plus new fur, fringe, void-hole and snow helpers). All are foes: drawn
facing right with `kit.foeBase`, `flip: true`; `groundY` = canvas height - 30 on every figure (checked in each rig.json).
The later batch in the bible (Unspoken Bear, Hearth Grandmother, Drum-Seer, Voiceless Chief, Ice-Fisher, Hush-Child,
Lemming Drift, Lead Dog, Sledge Hauler, Silent Singers, Snow-House Builder) is not built; it was read to keep silhouettes
apart (the Saint's halo is a ring behind the head, not a drum beside it; the Wanderer walks, the Ice-Fisher will sit; the
Stag stands head-down, not pulling like the Lead Dog; the Shade is one low black shape, not the Singers' arch).

Method: each figure was rendered alone, composited on a mid-dark ground and on a near-white ground (236,238,238), zoomed
1.4x to 2x on the head, hands, held objects and feet, and checked at game size (human 190 px) on both grounds. It was then
rig-exported (`render_rig.js`, no MISSING JOINTS on any) and pose-tested on its attack (`out/worlds/XII/<key>_pose.png`).
Every grip goes through `B.grip`; none prints a `move the elbow` warning. Palette: a pixel scan finds 0.000% saturated
pixels on all eight (white, greys, ink black, bone; nothing else).

World conventions: windward = the heroes' side = drawing +x (rime builds on front and upper faces); icicles are always
built in screen space so they hang plumb; no ground shadows anywhere (the void took them; the Stag's missing shadow is
drawn as a clean-rimmed patch, and the Rime Shade is the one shadow in the world). The void is flat black with clean
pale rims, never ragged: see-through holes are true alpha holes (`fx().hole/cut`), so the ground behind shows through
them on any background. Eyes appear in two places only, both from the bible (the Starless Eye, the Cold Star's eye).

## Gate 1: logic audit

Items: 1 head over neck and spine (non-humanoids: one spine, legs carry weight), 2 objects face their user and gaze,
3 grips and hands, 4 weight and balance, 5 contact, attachment and plumb hang, 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact/plumb | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| The Cold Star | pass | pass | n/a | pass | fixed | pass | 5: the opened lids poked past the disc's rim in the pose test; both lids are now clipped to the disc |
| The Pale Hunter | pass | fixed | fixed | pass | fixed | pass | 2/5: the bowstring ran through the face. The anchor moved down to the chin and the bow is canted 30 deg, so the string clears the cut face (it touches the chin, as an anchor does). 3: the draw arm was the far arm and was hidden behind the hood and body; the roles are swapped (the near arm draws, elbow back and foreshortened; the far arm holds the bow), which is also right-handed in game view. The draw grip printed an 89 deg warning when its elbow came from IK; the elbow is now placed so the forearm is level and square to the string (no warning) |
| Void Mammoth | pass | n/a | n/a | fixed | pass | pass | 4: the first pass had column legs whose square tops stood above the belly line (stacked boxes). The legs now start at the belly line under the hair skirt and carry the barrel on four broad feet |
| Hollow Wanderer | pass | pass | pass | pass | fixed | pass | 5: the lasso coil sat under the crook arm and could not be seen; it now hangs on the near side with its carrying loop across the chest |
| Silence Stag | pass | n/a | n/a | fixed | pass | pass | 4: legs were separate capsules joined at knobs; each leg is now one outline (shoulder point or hip to fetlock) with the elbow and hock points, knee and fetlock knobs as bumps, cut for the rig at the elbow/stifle and fetlock |
| Starless Eye | pass | pass | n/a | pass | fixed | pass | 5: the void bites' rims were drawn into empty air past the trail's edge; rims are now clipped to the trail |
| Frozen Saint | pass | pass | fixed | fixed | fixed | pass | 4: the first pass read as standing (upright kneel under a bell robe); it now sits back toward the heels with the lap and knees forward and the soles turned up behind. 3/5: the near sleeve crossed the beard (an arm across the face area); the frozen beard is shortened and clears it |
| Rime Shade | pass | n/a | n/a | pass | pass | pass | (logic passed; see gate 2 for its reshaping) |

### Measurements behind the passes
- Heads: the Wanderer's hood, the Hunter's and the Saint's heads sit on `N + up * 50..112` along the spine's own tangent,
  so their bow comes from the spine curve. The Hunter's head angle (0.04 rad) runs along the arrow; the Saint's head is
  tilted up (-0.22) toward the black star, which is what it prays to.
- Grips: Wanderer crook (forearm square to the pole, thumb toward the hook), Hunter bow (fist on the canted grip, axis
  tip to tip), Hunter draw (string through the fingers, forearm level): no warnings. The Saint's hands are open, palm to
  palm, inside one block of ice.
- Weight: Wanderer mid-stride, leaning on the planted crook, pelvis between the feet. Hunter on the far knee and near
  foot, the bow arm's load balanced by the back-leaning draw. Saint on both knees and shins. Stag and Mammoth stand on
  four planted feet (hooves sunk in snow lips; the mammoth's pads spread). The Eye floats (bible). The Shade lies on
  the snow from the hips to where the feet were.
- Light: every element shades from the foeBase key light (upper right in drawing, upper left in game). The Cold Star's
  disc is deliberately unshaded (bible: nothing reflects from it).

## Gate 2: style and detail

| Figure | Signature at 190 px | Frost marks / Never | Void marks / Never | Grit (min) | Palette | Unique silhouette | Section 8 faults | Section 9 | Fix |
|---|---|---|---|---|---|---|---|---|---|
| The Cold Star | pass: the black disc | pass | pass | 14 (12) | pass | pass | fixed | pass | Rings first read as smooth white pipes and passed into the ground; they are now rings of frozen-fog clots on smaller radii (590/670/760), icicled on the lower arcs, cut clean where the void bit them. The Tooth read as a seed; it is now a molar (cusped crown, two roots) |
| The Pale Hunter | pass: drawn bow, blank face | pass | pass | 13 (10) | pass | pass | fixed | pass | Head read as a hood (like the Wanderer): hair pulled back off a grey skull, the cut made a flat plane with hard corners at brow and chin, forehead lines and brow ridge left above it, a single plait down the back. Fringes read as rows of teeth: new one-shape `fringe()` helper. The thrown-back hood read as a shell; it is smaller and its inside is grey, not black |
| Void Mammoth | pass: tusked outline with holes | pass | pass | 12 (10) | pass | pass | fixed | pass | Balloon body and slab head: hump and steep back with a clumped top line, sagging belly, the coat in layered tiers (cape over the shoulder, sheet over the flank, skirt), dome peaked at the back with a tuft, temple hollow, cheek. Tusks thin and dark: thicker ivory with growth rings, crack, chipped tip, light shading |
| Hollow Wanderer | pass: hooded figure, empty hood | pass | pass | 11 (6) | pass | pass | fixed | pass | Ruff read as a ring of teeth: now a thick lumpy fur band with the hood's grey lining and a clean void inside it. Hem locks read as fangs: a clumped hem with a few long frozen locks. Fur texture read as knitting: texture cut to 0.22 and clumped strokes added. Boots were stumps: fur boots with beaded strips, ankle thong, sole and folds |
| Silence Stag | pass: the antlered stag | pass | pass | 9 (6) | pass | pass | fixed | pass | Antlers ran off the canvas and read as two poles: they now spread back over the neck, two beams diverging, seven tines each, rime on the windward faces and icicles under the tines; the figure is shifted on its canvas. Body was a box: withers high, deep brisket, tucked flank |
| Starless Eye | pass: the floating eye | pass | pass | 9 (6) | pass | pass | fixed | pass | The torn skin read as a wing rising above the eye; it now streams back and down, thinner, and ends in clean round bites. Ball read mitigated by the hooding upper lid, the bulging cornea and the trail |
| Frozen Saint | pass: kneeling, dark halo | pass | pass | 11 (6) | pass | pass | fixed | pass | Halo read as a black cog (regular spikes): now lumpy black rime, thicker windward and up, with a clean inner rim. Bell robe read as a giant boot: lap and knees forward, hem pooled, a band of black sun-signs, a worn-through knee patch. Belt wider than the torso: narrowed. Head pendants read as eyes: one pendant hanging at the back |
| Rime Shade | pass: the flat shadow peeling up | pass | pass | 7 (6) | pass | pass | fixed | pass | The risen half read as a black worm (a 450 px tube): now human proportions (waist, chest, broad shoulders, neck, hooded head in profile with its tail), the bend short at the hips; the spiky ruff and hem triangles read as horns and are gone |

Section 9 line, per figure (which course did this, to whom, does the bible say so):
- Cold Star: void is the star itself; frost made the rings (bible). Former self: a star. The camp it came down on keeps
  the human scale; nothing is taken from Bloodborne.
- Pale Hunter: void took the face (bible), pushed hard as the one distorted part; frost rimes and stills. Former self
  readable: bow, quiver, bracer, slit goggles, a hare on the belt.
- Void Mammoth: void unmade flesh in clean holes (bible); frost on the coat. An animal, as listed.
- Hollow Wanderer: void took the face and head (bible); the herder's crook, lasso, belt knife and clapperless bell keep
  the trade.
- Silence Stag: frost on the antlers, void took its shadow (both bible). An animal, as listed.
- Starless Eye: torn from the star's face (bible); the torn skin is physical tearing, and where the void ends it the
  edge is cut clean, never ragged (bible 00 "edges that thin into nothing").
- Frozen Saint: the bible names a tundra saint, so a holy person is supported (rule 5); black frost where gold should be
  (bible); the stone lamp, sun-disc and prayer beads keep the former self. No gold anywhere.
- Rime Shade: a shadow with no body (bible); its silhouette keeps the herder (hood, fringed hem, mitten), and the
  herder's dropped things lie in the snow.

### Grit, by figure
- Cold Star (14): corona filaments; three rime rings of clots; icicles on the rings; clean void cuts in the rings; the
  Tooth (strata, crack, worn root, rime, icicles); hoar lashes on the lids; the eye under the lids (veins, ringed iris,
  void pupil); three hide tents with poles and door flaps; smoke frozen into pillars, cut clean; six reindeer; three
  people with taken faces; a sledge; sastrugi.
- Pale Hunter (13): long plait with bone ties; ear and frost-bite on the skull; bone bracer with lashings; spliced bow
  with sinew cable and tally notches; ice-tipped arrow with fletching; quiver with beaded mouth and fletchings; slit
  goggles at the throat; braided belt; bone knife; two ivory birds; frozen hare; back flap; fringes with icicles; tracks.
- Void Mammoth (12): three see-through holes with clean rims; broken hunter's spear in the hump; tusk growth rings,
  crack, chipped tip; trunk rings and frost cracks; toenails; wrinkled hide at knee and ankle; tiered coat; dome tuft;
  ear; tail tuft; rime; icicles.
- Hollow Wanderer (11): ruff and hood lining; clumped frozen hem; mosaic hem band; bone toggles; belt plaques; knife in a
  bone-mounted sheath; clapperless bell; bone amulets (one pierced); lasso coil with bone slide and carrying loop; crook
  with bone knob, ferrule, lashings and birch marks; beaded fur boots with thongs.
- Silence Stag (9): rimed antlers with icicles; coronets; winter mane; belly coat; old flank scar; broken hunter's arrow
  in the shoulder; dewclaws; fetlock feathering; the missing-shadow patch with no tracks behind.
- Starless Eye (9): veins; ringed iris; void pupil; frozen lashes; wrinkled upper lid; brow strip with hairs; two cut
  cords; void bites in the trail; frozen tears.
- Frozen Saint (11): black-frost halo with black icicles; ice block with cracks; prayer beads; sun-disc (rays, crack);
  fur collar; knotted cord belt; sun-sign hem band; knee patch; head band and pendant; frozen beard with icicles; soapstone
  lamp with a burnt, cold wick ledge.
- Rime Shade (7): tracks that stop; the clean patch it rose from; hoar along the patch rim; black icicles; dropped
  mitten; bone knife; broken string of beads.

## Rig and pose tests (out/worlds/XII/<key>_pose.png)

| Figure | Bones | Layers | Attack pose | Result |
|---|---|---|---|---|
| The Cold Star | 9: disc, corona, ring_1..3, tooth, eye, lid_u, lid_l | 10 | the eye opening (lid_u -2.4, lid_l +2.0), Tooth orbits 25 deg, rings turn | closed; the eye opens fully, lids stay inside the disc |
| The Pale Hunter | 22: standard + bow, string, arrow, quiver, hood, hair, flap | 32 | the loose (hand_n +24, forearm_n -5) | closed; the string does not follow the hand (see IK) |
| Void Mammoth | 23: spine_1/2, neck, head, trunk_1..3, tusk_n/f, ear, tail, 12 leg bones | 46 | tusk charge (head +12, neck +6, trunk back, fore leg striding) | closed |
| Hollow Wanderer | 19: standard + crook, skirt, lasso, ruff | 28 | crook thrust (upperarm_n -24, forearm_n -16, torso -6) | closed |
| Silence Stag | 20: spine_1/2, neck, head, antler_n/f, ear, tail, 12 leg bones | 31 | antler charge (neck -14, head -22, legs striding) | closed |
| Starless Eye | 7: body, iris, lid_u, lid_l, trail_1..3 | 12 | the stare (lids wide, iris turned, trail flicking) | closed |
| Frozen Saint | 18: standard + halo, robe, beads | 23 | the cold blessing (torso -10, both arms forward -22/-12) | closed; the hands stay together because both arms are turned alike |
| Rime Shade | 7: shade_1, shade_2, head, arm_n_1/2, arm_f_1/2 | 12 | rising to envelop (shade_1 -18, shade_2 -16, arms reaching) | closed |

Sign convention in game view: positive is clockwise.

## Holds that need IK in the game
- Pale Hunter: the bowstring is drawn as two runs from the bow tips to the nock in the draw hand, on `string` (a child of
  `bow`). When the draw hand moves, the string should be a two-point line from each tip to `hand_n` (Line2D or IK), and
  the arrow leaves `hand_n` on release.
- Frozen Saint: the two hands are frozen together in one block of ice, which rides on `hand_n`. `hand_f` must follow
  `hand_n` with two-bone IK in any pose where the arms are not turned alike.
- Hollow Wanderer: the crook is in one hand only; no IK needed.

## Still open (none blocks the gates)
- Heights against the bible, measured top to ground line: Void Mammoth 2.03 (bible 2.5; the elite canvas is 1400 tall
  and 1100 wide, and a 2.5 mammoth with its tusks does not fit; the tusks already reach the canvas edge). Pale Hunter
  kneels to 1.76 including the bow; standing it would be 2.0. Silence Stag 1.43 to the antler tips (bible 1.5). The
  Cold Star is cropped by the frame as the bible asks.
- The Cold Star's lids are rigged as rotations about pivots 4000 px to the side, which slides them open; in Godot a
  translation key on `lid_u` and `lid_l` is cleaner.
- The Mammoth's head is still the plainest large shape on it at full size; at sheet and game size it reads.
- The Starless Eye's lower lid is a thin crescent under the ball; it reads as a lid at game size but is close to
  detached at 2x.
- The Wanderer's near sleeve is the broadest flat shape on him (form carried by its crease and fur strokes).
- The engine's per-part drop shadow (`cast`) is kept on all parts as the Living Ink setting; only ground shadows are
  removed for the world's "no shadow" rule.

## Independent review (2026-11-23)

Reviewer: a second agent, judging the first batch fresh against GUIDE sections 8 and 9, LOGIC_CHECKLIST, bible 00 and
the XII entries, with the Drowned King, Walrus Brute, Ice Eel, Magma Hound and Plague Wolf as the bar. Every figure was
rendered alone and composited on a mid-dark ground and a near-white ground (236,238,238), zoomed 1.1x to 1.3x on the
head, joints, held objects and feet, and checked at game size (human 190 px) and in `out/worlds/XII/sheet.png`.

### Director's rulings, recorded
- No ground shadows anywhere in this world is approved (the void took them); the Rime Shade is the world's only shadow.
- Real transparent void holes are approved.
- The Mammoth may break the top of the elite canvas to reach the bible's 2.5 (elites and rulers may be cropped by the
  frame). It now does: its hump stands 1600 px above the ground line (y = -230 on the 1400 canvas) and the frame crops it.

### What changed, by figure
- **Void Mammoth (rebuilt).** The box body, table-leg pillars and tube trunk are gone. A 2.5 mammoth in profile is about
  1.9 times as long as it is tall and cannot fit 1100 px, so it now stands in three-quarter view: the body turned 60 deg
  toward the heroes, the head a further 8 deg, under a weak perspective (camera 7000 px, eye at chest height), so the
  low hindquarters are smaller and their feet stand further up the snow. Anatomy: the body is built from 3D cross-sections
  (the dip behind the head, the hump of hair, the back falling to small low hips, the deep chest, the belly), its outline
  the hull of the projected sections with long edges bowed round and the upward-facing edge tufted. Peaked dome with a
  topknot, brow over small deep eyes, a small hairy ear. Column legs keep their joints: the elbow point (knee cap), the
  forearm swelling under it, a waist above the wrist, the wrist knob (the heel of the hock), then a smooth flare into a
  round padded foot with a dark pad rim and broad flat nails. The trunk tapers in rings to a two-fingered tip with
  nostrils, curled up and out so it breaks the silhouette. The near tusk leaves its hide sheath down and outward, sweeps
  under and curls up with its tip turned in (drawn in screen space: a projected lyre folded onto itself at this angle);
  the far tusk ends in a clean void cut showing the ivory's rings (also keeps the far side inside the frame). Hair: a new
  `hank()`/`hanks()` helper in kit_XII (tapering from the root, no ink across the root, ink down the sides only, strand
  lines, root faded into the mass, shingled so higher rows cover lower roots), used in tiers: a cape off the hump, a sheet
  over the flank and haunch, a skirt (shorter on the chest), a beard under the jaw, long hair down each leg to above the
  wrist, tufts over the feet; furField inside every mass. Three clean see-through holes on the open flank.
- **Silence Stag (rebuilt).** Withers high over a deep chest to the elbow, belly tucked into the flank, back level to the
  croup, the rump rounding to a short tail. The shoulder blade and the haunch lie on the flank as their own masses (on
  the spine bones, like shoulder armour, so they stay put when a leg swings). Each leg is one outline with elbow point,
  forearm muscle, knee knob, thin cannon with tendon, fetlock and sloped pastern in front; stifle, gaskin, point of the
  hock, cannon, fetlock and pastern behind; cloven hooves with horn grain, dewclaws and fetlock feathering, sunk in snow
  lips. Thick winter neck with a mane of long frozen hanks and a throat beard. Antlers grow from furred pedicels through
  knobbled coronets; the beams sweep up and back and forward at the crown (the far beam more upright, so they spread);
  brow, bez, trez, royal and a forked crown, each tine filleted where it leaves the beam and curling upward; pale bone,
  rime only on upper faces. Height 1.53 to the antler tips (was 1.43).
- **The Cold Star.** The disc, corona and shut eye are kept. The sausage rings are replaced by rime: each ring is soft
  overlapping arcs of frozen haze, fine ice dust in white and grey (so it reads on any sky) whose density varies round the
  ring and thins outward, hair-thin streaks and a few small rime clots; the inner ring's edge catches the corona. The two
  outer rings each stop clean at one void bite. Corona filaments are now mostly white (a few fine ink hairs). The shut
  eye's slit is a hairline with grey lashes. The Tooth is a small pale stone molar (worn grinding face with grooves,
  two roots, a crack, pits, rime) lit from the key side, its orbit traced by a dotted thread of dust. The camp is one
  tiny cluster under the star: four tents with poles, seams, open door flaps and thin frozen smoke pillars cut off
  clean, a hearth that is a round black hole ringed with stones, a drying rack, a loaded sledge, five reindeer, three
  faceless people looking up, and tracks coming in.
- **Starless Eye (rebuilt).** An anatomical eye torn from a face, at three-quarters: wet sclera with fine branching grey
  veins, sphere shading, a dull wet sheen and soft glints, hoar bloom and frost beads on the upper globe; the cornea
  bulges over a black iris with grey striations, a collarette and a grey limbus; the pupil a clean void. A torn remnant
  of the upper lid with folds and frozen lashes clings over the top; a lower-lid crescent with lashes hangs frozen tears.
  The superior, lateral and inferior rectus leave the globe as bands (narrow pale tendon at the insertion, fibrous belly)
  and the optic nerve leaves the back pole in a ringed sheath; all end frayed. Behind trails the bible's ragged edge of
  void: black, with broad torn flaps (not a fringe of spikes) and a thin pale lip.
- **The Pale Hunter (found in review).** The raised near thigh was a straight slab with a square end and a row of teeth
  under it (section 8: slab limbs). It is now a rounded thigh with a full muscle belly and a soft knee, under the
  knee-length parka's front panel, which hangs over it from the belt with a hem of hanks.

### Gate 1: logic audit (independent)

Items: 1 head/neck/spine (non-humanoids: one spine, legs carry the weight), 2 objects face the user and gaze, 3 grips
and hands, 4 weight and balance, 5 contact, attachment and plumb hang, 6 facing and light.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Fix |
|---|---|---|---|---|---|---|---|
| The Cold Star | pass | pass | n/a | pass | pass | pass | none; the Tooth is now shaded from the key side like the rest |
| The Pale Hunter | pass | pass | pass | pass | fixed | pass | 5: the thigh's flat hip end showed past the parka; the knee-length front panel now hangs over it from the belt |
| Void Mammoth | fixed | n/a | n/a | fixed | fixed | pass | 1/4: one spine through dome, saddle, hump and low hips in 3D; four jointed columns on padded feet, far feet higher on the snow by perspective. 5: hair hangs plumb from the projected surface (rows used to float outside the body); upper legs drawn under the body so no leg top shows over it |
| Hollow Wanderer | pass | pass | pass | pass | pass | pass | none |
| Silence Stag | fixed | n/a | n/a | fixed | fixed | pass | 1/4: deep chest, tucked belly, legs with elbow, knee, stifle, hock, fetlock and pastern angles on planted cloven hooves. 5: in the pose test the shoulder mass rode on the leg bone and swung across the neck; it and the haunch are now on the spine bones |
| Starless Eye | pass | pass | n/a | pass | fixed | pass | 5: muscles and nerve attach to the globe behind the limbus and run into the void; the lid remnant and lower lid hug the globe (the lower lid stuck out like a finger) |
| Frozen Saint | pass | pass | pass | pass | pass | pass | none |
| Rime Shade | pass | n/a | n/a | pass | pass | pass | none |

### Gate 2: style and detail (independent)

| Figure | Signature at 190 px | Frost / Never | Void / Never | Grit (min) | Palette | Unique silhouette | Section 8 | Section 9 | Fix |
|---|---|---|---|---|---|---|---|---|---|
| The Cold Star | pass | fixed | pass | 15 (12) | pass | pass | fixed | pass | Rings were chains of white blobs (cartoon): now rime haze, ice dust, streaks and clots in thinning concentric bands; Tooth was a large brown shard: now a small pale stone molar in orbit; camp was two scattered strips: now one tiny legible cluster |
| The Pale Hunter | pass | pass | pass | 13 (10) | pass | pass | fixed | pass | Slab thigh and teeth fringe (above) |
| Void Mammoth | fixed | fixed | pass | 16 (10) | pass | pass | fixed | pass | Boxes, table legs, tube trunk, icicle-tooth coat: rebuilt (above). In silhouette the holes, the trunk's hook and the tusk's loop now break the outline |
| Hollow Wanderer | pass | pass | pass | 11 (6) | pass | pass | pass | pass | none |
| Silence Stag | pass | pass | pass | 14 (6) | pass | pass | fixed | pass | Stick legs and plank body (tube limbs, slab body); dark twig antlers: rebuilt (above) |
| Starless Eye | fixed | pass | pass | 13 (6) | pass | pass | fixed | pass | Cartoon eyeball: rebuilt as an anatomical eye torn from a face (above) |
| Frozen Saint | pass | pass | pass | 11 (6) | pass | pass | pass | pass | none |
| Rime Shade | pass | pass | pass | 7 (6) | pass | pass | pass | pass | none |

Palette: a pixel scan of all eight renders finds 0.00% saturated pixels. Grit for the rebuilt figures:
- Void Mammoth (16): three see-through holes with tunnel walls; the far tusk's clean cut showing its rings; near tusk
  growth rings, long crack, nicks, chipped tip; hide sheaths; a hunter's spear lashed with sinew, broken off in the hump;
  topknot; hairy ear with its fold; the deep eye with wrinkles and hoar lashes; trunk rings, frost cracks, two fingers and
  nostrils; nails; wrinkled foot hide and pad rims; joint creases; tail tuft; tiers of hanks; icicles at hank tips; rime.
- Silence Stag (14): pedicels; coronets with pearling; seven tines a side with grooves; rime and icicles; winter mane;
  throat beard; belly hair; pale rump patch; flank scar; arrow stump with fletching and binding; dewclaws; cleft hooves
  with horn grain; fetlock feathering; tear-gland pit; the missing-shadow patch.
- The Cold Star (15): corona filaments; three dust-and-haze rings; streaks; rime clots; clean void bites; the corona on
  the inner ring; the Tooth (grinding face, grooves, roots, crack, pits, rime, icicles); its orbit thread; the shut eye
  and lashes; tents with poles, seams and door flaps; cut smoke pillars; the void hearth with stones; drying rack;
  loaded sledge; herd; faceless people; tracks; sastrugi.
- Starless Eye (13): veins; limbus; iris striations and collarette; void pupil; cornea glint; hoar bloom and frost beads;
  upper lid remnant with folds and lashes; lower lid with lashes; frozen tears; three muscles with tendons and frayed
  fibres; optic nerve with sheath rings and icicles; the ragged void wake with its pale lip; rime on the lid and muscles.

Section 9 lines for the rebuilt figures: the Mammoth's pushed mark is the void's clean holes and the cut tusk (bible);
frost rimes the coat (bible); an animal, as listed. The Stag: frost on the antlers, its shadow taken (bible). The Eye:
torn from the star's face, trailing a ragged edge of void (bible, which overrides bible 00's "clean rims" for this entry);
eyes are allowed in a void world. The Cold Star: unchanged in substance.

### Rig and pose tests (re-run for every changed figure; no MISSING JOINTS; groundY = canvas h - 30 in each rig.json)

| Figure | Bones | Layers | Attack pose | Result |
|---|---|---|---|---|
| Void Mammoth | 23 | 49 | tusk charge: neck -5, head -10, trunk 14/12/10, near fore leg striding (12, -10, -4), hind leg -8/6, tail 10 | closed; trunk segments and tusks stay on the head |
| Silence Stag | 20 | 35 | antler charge: neck -12, head -18, antlers -4, fore leg reaching (10, -10, 8), hind leg driving (-10, 8, -6), ear, tail | closed after the shoulder and haunch moved to the spine bones |
| The Cold Star | 9 | 10 | eye opening (lid_u -2.4, lid_l 2.0), Tooth orbits 25, rings turn 8/-6/4 | closed |
| Starless Eye | 7 | 13 | the stare: lid_u -9, lid_l 7, trail flicks 8/10/14 | closed |
| The Pale Hunter | 22 | 33 | the loose (hand_n 24, forearm_n -5, torso 3, thigh_n -4, shin_n 3) | closed; the new panel stays over the thigh |

The sheet and silhouette strip were rebuilt in the same layout with the maker's composer (the per-figure copies in
`out/worlds/XII/` were refreshed first; the composer reads those, not `out/worlds/world_XII_*`).

### Still open (none blocks the gates)
- The Mammoth's hump is cropped in the art itself, because rig layers are clipped to the canvas: a large downward turn of
  `spine_2` would show the straight cut. Keep body bones within a few degrees, or let the game frame crop above it.
- The Mammoth is in three-quarter view, so the far legs are mostly hidden behind the near ones and the trunk, and its
  rig rotations are 2D; tusk_f is short by design (the void cut).
- Mammoth upper legs are drawn twice (under the body, then the lower leg after it); their fur strokes differ slightly
  inside the overlap at the elbow and knee. Not visible at game size.
- The Cold Star's rings are partly transparent haze, so they show as grey in `sil.png`; its ring_2 void bite reads as a
  dark panel on the dark sheet ground (on a white sky it reads as a clean gap).
- The Stag's body (560 px chest to rump) is slightly compact so it fits the large canvas with its head lowered.
- The Pale Hunter's torso is still the plainest large shape on the sheet (form carried by fur strokes and fringes).

## Final consistency pass (2026-11-25), section A4 (added by the I-VII / section A agent)

Cold Star: the `root` bone (tundra and camp) is optional. Variant module `worlds/world_XII_noroot.js` drops the `root`
runs; `disc` stays the rig root and nothing else changes. Render `out/worlds/world_XII_noroot_cold_star.png`, rig
`out/rig/worlds/world_XII_noroot_cold_star/rig.json` (flag `variant.optional_bones: ["root"]`, use in silence_boss), note
`out/worlds/XII/cold_star_optional_bones.json`. world_XII.js was not edited. Re-run after any change to world_XII.js:
`node render.js worlds/world_XII_noroot cold_star && node render_rig.js worlds/world_XII_noroot cold_star`.

## Final consistency pass, section B (2026-11-25)

| Figure | Item | Fix | Result |
|---|---|---|---|
| Void Mammoth | blocky flank and column legs | Canvas heightened from 1100 x 1400 to 1100 x 1700 at the same pixel scale (GUIDE 2, true size wins; groundY = 1670), so the hump stands in frame instead of being cut flat by the frame top. The back now falls further to small, round, low hips and the belly tucks up into the flank (new TOPU/BOTU/WID rear profile), the flank sheet's hank roots follow the lower back, the near fore leg steps forward and the hind hock angles back, the legs narrow more above the wrist and hock, and the trunk's root narrows into the brow (no square top) with the forehead's hair falling over it. The holes were moved with the canvas (one now bites the rump's edge, a clean round void bite). | improved: at sheet size it reads as a domed, sloping animal, not a box. Weak spot: the lower legs below the skirt are still short pillars, and the rear coat edge steps like shingles |

Rig re-exported (23 bones, canvas 1100 x 1700, ground 1670, no MISSING JOINTS); tusk-charge pose (review values):
attached. Note for integration: the mammoth's rig canvas is now 1700 tall (origin top-left as before, so the figure sits
300 px lower in the canvas). Copies in `out/worlds/XII/` refreshed; XII sheet (scratch `wXII/sheet.py`) and XII_b
sheet19/sil rebuilt.
