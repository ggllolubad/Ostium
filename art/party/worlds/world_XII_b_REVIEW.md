# World XII, The White Silence: review (second batch "b")

Figures (seeds 1220 + index, bible order): The Unspoken Bear (1220), The Hearth Grandmother (1221), The Drum-Seer (1222),
The Voiceless Chief (1223), Ice-Fisher (1224), Hush-Child (1225), Lemming Drift (1226), Lead Dog (1227), Sledge Hauler
(1228), The Silent Singers (1229), Snow-House Builder (1230). File `worlds/world_XII_b.js`; helpers in
`worlds/kit_XII_b.js`, which requires `./kit_XII` and re-exports it unchanged (the first batch's files are not edited).
All are foes: drawn facing right with `foeBase`, `flip: true`; `groundY` = canvas h - 30 on every figure (checked in every
rig.json). Director's rulings kept: no ground shadows anywhere; void holes are true see-through alpha holes (`fx().hole/cut`).
Eyes only where the bible asks (the painted eye on the drum); no other eye motif.

New helpers in `kit_XII_b.js`: `mirrorDraw()` (builds a right-facing figure and mirrors it with the key light mirrored
while drawing, used for the second Singer), `forkHanks()` (the White Bear's reviewed forked-hank fringe rebuilt on
kit_XII's `hank()`: roots at uneven heights parting into 2-3 locks of different length), `face()` (B.head in cold skin
with the warm tints laid back over, modelled age creases with lit lips, tattoos, open mouths, frost on brows and lashes,
no face hatch), `hairMass()`, `braid()` (plump chevron lobes), `furBoot()`/`clumpEdge()` (copied from world_XII.js),
`beadBand()`, `beadString()` (beads or teeth), `cord()`, `dogPaw()` (heel pad, knuckled toes, claws, ice balls, booties).
In the world file: `limb3()` (jointLimb split at the middle joint, with a rounded top so a shoulder or hip never shows the
chain's flat cut), `cuff()` (a lumpy fur roll, not a box), `mittenFlat()`, `oldFist()` (B.grip plus swollen knuckles,
frost-split skin, standing tendons), `lemming()` (one posable lemming: arch, foreshortening, mirror, upside down, frozen
stiff legs, open mouth, a clean void cut at any fraction).

Method: every figure rendered alone, composited on a mid-dark ground, zoomed 1.3x to 3x on heads, hands, held objects and
feet, and checked at sheet size (sheet.png at 0.3x, sil.png at 190 px per human). Rendered one at a time; no background
jobs. Every grip goes through `B.grip`; a full build of all eleven prints no `move the elbow` warning. Palette scan (HLS
saturation > 0.25): 0.000% to 0.010% per figure, the trace being B.head's eye-socket tint at sub-pixel edges; no colour
anywhere else.

## True size (canvas widened or heightened at the same pixel scale where needed; GUIDE 2)

| Figure | Canvas | Measured (ground to top, human units) |
|---|---|---|
| The Unspoken Bear | 1800 x 2250 (ruler, heightened) | 3.47 to the frame top at the brow; crown and paws cropped by the frame, as the bible asks |
| The Hearth Grandmother | 2000 x 1600 (ruler, widened for the hearth) | 2.45 in frame; the hump drawn to 3.1 and cropped by the frame top, head in frame |
| The Drum-Seer | 1100 x 1400 | 1.79 stooped, knees bent, to the antler tines (1.9 standing) |
| The Voiceless Chief | 1100 x 1400 | 2.05 to the crown (bible 2.1) |
| Sledge Hauler | 1500 x 1100 (large, widened for the sledge) | 1.07 leaning; 1.3 standing |
| Lead Dog | 1100 x 1100 (large, widened for the line) | 1.15 nose to rump (bible 1.2) |
| Snow-House Builder | 600 x 1160 (human, heightened for the block) | 1.59 to the block's top; 1.05 to the crown |
| The Silent Singers | 720 x 820 (widened for two) | the younger 0.86 leaning in, the elder 0.78 |
| Ice-Fisher | 600 x 820 | 0.61 seated (0.9 standing) |
| Hush-Child | 600 x 820 | 0.56 including the hoop (bible 0.5) |
| Lemming Drift | 760 x 820 (widened) | 0.53 high, 1.17 wide (bible 0.5 x 1.0) |

## Gate 1: logic audit

Items: 1 head over neck and spine (animals: one spine, legs carry the weight), 2 objects face their user and gaze, 3 grips
and hands, 4 weight and balance, 5 contact, attachment and plumb hang, 6 facing and light.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Fix (what failed and how it was fixed) |
|---|---|---|---|---|---|---|---|
| The Unspoken Bear | pass | n/a | n/a | fixed | fixed | pass | 4: the first body was an upright egg with the thighs as slabs whose square tops showed; now a pear (narrow chest, heavy belly and haunches sunk on the legs), thighs drawn under the body, rounded stifles, gaskins with calf, Achilles and a narrowing ankle over plantigrade feet flat on the snow and the sledge. 5: the paws first sat whole inside the frame; raised so the frame top cuts them as the bible says. The near-shoulder hole now cuts the upper arm too, so it is not hidden under the leg |
| The Hearth Grandmother | fixed | pass | fixed | pass | fixed | pass | 1: the first spine bent back on itself and the torso was a dome; rebuilt as one seated mass, the neck forward out of the hump, the head bent down over the mask. 3: the needle ran along the raised forearm (58 deg warning); the needle now crosses the fist angled back over her head, square to the forearm, no warning. The raised arm crossed her face; the elbow now goes forward and low and the fist rises clear of the face. 5: an elbow fold drew an inked triangle on the sleeve; the elbow point removed. The thread runs from the needle's eye to the mask's unsewn edge |
| The Drum-Seer | pass | pass | fixed | pass | fixed | pass | 3: the drum-bar grip printed 87 deg and the beater 53 deg; the drum is now held low beside the head with the forearm rising behind it to the bar, and the beater arm is raised high in front with the forearm vertical and the beater level (no warnings). The beater arm first crossed the face; it is now forward of it. 5: the brow fringe hid the face as a row of teeth; shortened, uneven strips |
| The Voiceless Chief | pass | pass | fixed | pass | fixed | pass | 3: the belt fist sat at the middle of the belly and read as clasped hands; it is now at the hip with the elbow out behind (inline grip, no warning). 5: the fox collar covered the throat hole; lowered round the shoulders so the hole shows, widened to 30 px so the snow reads through it |
| Ice-Fisher | pass | pass | pass | pass | fixed | pass | 5: the far stump was hidden behind the near shin; the far forearm now rests forward over the knees so the clean cut and the tied spare line show. The jig is an inline grip (rod continues the forearm), no warning; the line hangs plumb into the hole |
| Hush-Child | pass | n/a | n/a | pass | fixed | pass | 5: the frozen tears were icicles hanging plumb over the mouth and read as fangs; they now run down the outer cheeks as glassy streaks, each with a bead at the jaw |
| Lemming Drift | pass | n/a | n/a | pass | pass | pass | none (the heap sits on the snow; every lemming's legs reach a body or the snow) |
| Lead Dog | fixed | n/a | n/a | fixed | pass | pass | 1/4: the first body was 1.7 times as long as high on thin legs (a weasel); now a deep chest to the elbow, a tucked waist, heavier upper legs with elbow, wrist, stifle and hock angles, the reaching forepaw in a bootie, the others planted |
| Sledge Hauler | pass | n/a | fixed | pass | fixed | pass | 3: the near arm's flat chain top showed as a box at the shoulder; `limb3` now rounds the top. 5: the strap was drawn as a doubled band (a box); it now runs from the breastbone over the near shoulder down the back to the traces, which run taut to the sledge's trace bar |
| The Silent Singers | pass | pass | pass | pass | fixed | pass | 5: the braids were hidden under the hoods; drawn after the heads, hanging plumb in front of the shoulders. The clasp is two open hands curled round the other's forearm (a clasp, not a fist on a haft) |
| Snow-House Builder | fixed | n/a | pass | pass | pass | pass | 1: the near arm went up across the face; it now rises past the back of the head and the head sits forward of both arms. Hands: mittens pressed flat under the block (no grip); the block sits over the base of support, between the feet |

Measurements behind the passes: heads sit on the neck along the spine's tangent (`HC = N + up * k`); the Grandmother's,
the Fisher's and the Builder's heads are bowed or tipped toward what they look at (mask, hole, block). Weight: Chief square
on both feet; Seer on the bent front leg with the rear heel up; Hauler over the front foot, the rear leg driving off its
toe; Builder on the straight rear leg; Bear on both hind feet and the haunches; Singers braced on their outer feet. Light:
every part uses the foeBase key light; the second Singer is mirrored with the light mirrored while drawing, so it is lit
from the same side after the flip.

## Gate 2: style and detail

| Figure | Signature at 190 px | Frost / Never | Void / Never | Grit (min) | Palette | Unique silhouette | Section 8 | Section 9 | Fix |
|---|---|---|---|---|---|---|---|---|---|
| The Unspoken Bear | pass: reared bear, paws spread, black open mouth | pass | pass | 17 (12) | pass | pass | fixed | pass | Egg body, slab legs, a saw-tooth outline (regular teeth) and a crocodile muzzle: now a pear body whose outline breaks in irregular clumps, four tiers of forked hanks at uneven heights each tipped with ice, a domed brow, a deep blunt muzzle, the jaw dropped wide, the small dark eye under the brow |
| The Hearth Grandmother | pass: vast bent figure, needle raised over the mask | pass | pass | 18 (12) | pass | pass | fixed | pass | Dome torso and hidden face (above); the hides are tiers of forked hanks at uneven heights with bead strings, never smooth; modelled face (deep wrinkles, eye pouches, lip pleats, the cheek fold), frost-split knotted fist |
| The Drum-Seer | pass: the holed drum beside the head | pass | pass | 15 (10) | pass | pass | fixed | pass | Face hatched dark and hidden (no face hatch now, fringe shortened); fringes frozen mid-swing with icicles plumb |
| The Voiceless Chief | pass: bone-slat body, baton pointing, hole through the throat | pass | pass | 13 (10) | pass | pass | fixed | pass | Scale-like slat bottoms (pointed) squared off; a flat coat skirt given folds, stains and a flared uneven hem; spiky crown hair laid back |
| Ice-Fisher | pass: hunched seated figure over the round black hole | pass | pass | 11 (6) | pass | pass | fixed | pass | The stool read as a box (now a whale vertebra: pinched drum, plates, wing processes); a ruff of triangles (now stiff fur locks); a flat back patch (now a sewn patch and a darn) |
| Hush-Child | pass: upright board with its hoop | pass | pass | 9 (6) | pass | pass | fixed | pass | Tears as fangs (above) |
| Lemming Drift | pass: low wide pouring heap | pass | pass | 9 (6) | pass | pass | fixed | pass | The first heap was a dome of pebble-like ellipses with lemmings on it; now about fifty lemmings, each its own pose (arch, legs, heading, foreshortening, open mouth, mirrored, frozen stiff, upside down, cut in half), forming the outline; striped fur strokes cut to a few clumps |
| Lead Dog | pass: low pulling dog, line ending in a cut | pass | pass | 12 (6) | pass | pass | fixed | pass | Weasel body and rat head: rebuilt body; a canine head in profile with stop, deep muzzle, tongue; a brush tail curled onto the back |
| Sledge Hauler | pass: steep lean into the strap, sledge behind | pass | pass | 13 (6) | pass | pass | fixed | pass | A zigzag braid (now plump lobes) and box cuffs (now fur rolls); the sledge load was a dome (now heaped bundles with a hanging fur hide) |
| The Silent Singers | pass: the arch of two, faces nearly touching | pass | pass | 10 (6) | pass | pass | fixed | pass | Clones: now an elder (short, heavy, grey braids, lined face, cheek tattoos, long fur-hemmed tail, needle case) and a younger (tall, slight, dark braid, chin tattoos, short fringed parka, the elder's mitten in her belt), different bead patterns; both were bald (the hair was drawn under the face) |
| Snow-House Builder | pass: block held high overhead | pass | pass | 10 (6) | pass | pass | fixed | pass | A blurred haze round the block (a smoothed clip bulged past its sharp corners: hard-cornered clips now); straight arms given biceps and forearm swell |

Never items checked on all eleven: no clean crystals or snowflakes (all ice is lumpy rime and ringed dull icicles), no
purple sparkles or galaxies (void is flat black with clean pale rims), no ground shadows, no lightning arcs.

Section 9 line, per figure (which course did this, to whom, does the bible say so):
- Unspoken Bear: void punched the belly, paw and shoulder and took the throat (bible); frost hung every clump with ice
  (bible). An animal the bible lists; the offerings keep the hunters' story.
- Hearth Grandmother: void took her ears and the fire (bible); frost on her back and hides. Former self: the sewer of
  every coat, needle, thimble, ulu and masks in hand.
- Drum-Seer: void holed the drum where the last beat landed; frost froze the dance and its fringes (bible). Trade:
  drum, beater, headdress.
- Voiceless Chief: void took the voice at the throat and the far fox's head (bible). Rank: baton, slat armour, tallies.
- Ice-Fisher: void made the hole and took the far hand (bible); the jig, spear and fish keep the trade.
- Hush-Child: void takes the cry in the mouth (bible); frost froze the tears. An infant in its cradleboard.
- Lemming Drift: void bit the drift and the backs off lemmings (bible); animals the bible lists.
- Lead Dog: void cut the line and the ear (bible); harness and booties keep the trade.
- Sledge Hauler: void through the forearm where the strap rubbed (bible); strap, sledge, snowshoes.
- Silent Singers: void between the mouths where the sound was (bible); parkas, yokes, braids.
- Snow-House Builder: void through the block and the forearm (bible); snow knife, probe, knee pads.
Nothing here comes from Bloodborne's designs; the one pushed part per figure is the void's mark the bible names.

### Grit, by figure
- Unspoken Bear (17): three see-through holes; three offering bundles on a hide strap; seal-tooth necklace; bone beads
  knotted in the ruff; two ivory amulets; frozen fish; three spear shafts lashed; harpoon head and its line into the snow;
  scar ridges; notched ear; shattered sledge; overturned bone bowl; nine offering stones; claws; frost on the muzzle;
  icicles; drift.
- Hearth Grandmother (18): eight different masks on a cord; the half-sewn mask; spear-long needle and sinew; thimble;
  needle case; ulu; bone comb; two braids; hide strips over the knee; sinew spool; frozen pot and tripod; void hearth and
  stones; prints of the faceless; bead-sewn hems; snow drift on the hump; ear holes; icicles from nose and chin.
- Drum-Seer (15): holed drum (sun, herd, hunters, the dead, the eye), mended split; fur-wrapped beater; antler headdress;
  brow fringe; bear-claw necklace; bone-plaque belt; knucklebone pouch; mittens on a cord; four clapperless bells; bone
  discs; iron pendants; beaded boot tops; chin tattoos; frozen fringes with icicles.
- Voiceless Chief (13): throat hole; bone-slat cuirass (chips, scores, lacing); slat vambrace and arm slats; fox collar,
  fox head, cut neck; labrets; tallied baton; knife in bone sheath; ivory toggles; tally sticks; boot spikes; beaded hood;
  brow scar; beard icicles.
- Ice-Fisher (11): jig and line; fish spear; ice pick; bait pouch; holed fish on a string; antler scoop; vertebra stool;
  stump with spare line and hook; lip plug; patch and darn; beaded hem band.
- Hush-Child (9): hoop charms (beads, seal, hare's foot, drum); lacing loops; crossing thongs; trailing strap; spiked
  lining; frozen tears; void mouth; free fist; splayed foot.
- Lemming Drift (9): mitten; chewed strap with toggle; bead string; ptarmigan feather; hide scrap; tooth marks; two holes;
  cut lemmings; frozen ones carried.
- Lead Dog (12): harness and toggles; worn-bright breast strap; collar bead; two booties; bite scar; chewing rag with
  tooth marks; cut line; missing ear; frost beard; frosted whiskers; ice in the toes; grey tongue.
- Sledge Hauler (13): chest strap with bone studs; traces; two snowshoes; knife; frostbitten bare hand; forearm hole;
  braid ties; bone-shod runners; heaped load and rolled tent; pot; poles; lashings; empty cradleboard hoop.
- Silent Singers (10): two different yokes; bead tassels; braids with bone ties; ivory earrings; needle case; tucked
  mitten; two kinds of tattoos; fur-rimmed hoods; fur hem and fringe hem; the void.
- Snow-House Builder (10): sawn block with wind layers and hole; forearm hole; snow knife; worn-through knee pads with
  ties; antler probe and strap; fur-backed mittens; bone charm; beaded yoke; fringed hem; boots.

## Rig and pose tests (out/worlds/XII_b/<key>_pose.png; no MISSING JOINTS on any)

| Figure | Bones | Layers | Attack pose | Result |
|---|---|---|---|---|
| The Unspoken Bear | 18 | 36 | two-pawed blow: upperarm_n -40, forearm_n -30, upperarm_f 40, forearm_f 30, head 6, jaw -8 | closed; the paw hole travels with the paw |
| The Hearth Grandmother | 16 | 22 | the stitch: upperarm_n -18, forearm_n -30, hand_n -10, thread -6 | closed (the thread needs a Line2D, below) |
| The Drum-Seer | 21 | 28 | the hard beat: upperarm_f -18, forearm_f -30, beater -10 | closed |
| The Voiceless Chief | 21 | 30 | the baton points: upperarm_f -8, forearm_f -10, baton -4, head -6 | closed |
| Ice-Fisher | 19 | 28 | the jerk: upperarm_n 10, forearm_n 22, hand_n 10 | closed; the line rides on its own bone |
| Hush-Child | 6 | 8 | the cry: head -6, fist 18, hoop 4, charms -8 | closed |
| Lemming Drift | 59 | 62 | the pour: heap -3, every third lemming turned +-10/12 | closed |
| Lead Dog | 20 | 33 | lunge and bite: neck -10, head -8, jaw 14, leg_fn -12/10 | closed |
| Sledge Hauler | 20 | 29 | the swing: sledge -14, traces 6, torso -6 | closed; the traces are rigid (below) |
| The Silent Singers | 35 | 52 | the song: a_/b_torso -5/5, heads -8/8, braids | closed |
| Snow-House Builder | 20 | 31 | bringing the block down: both upper arms 26, forearms 8, torso 8 | closed; at larger swings the block leaves the canvas (layers are clipped to it) |

Sign convention in game view: positive is clockwise.

## Holds that need IK in the game
- Snow-House Builder: the block rides on `hand_n`; `hand_f` must follow it with two-bone IK.
- The Silent Singers: each hand clasps the other woman's forearm; `a_hand_n` should follow `b_forearm_n` and the reverse.
- Sledge Hauler: the traces should be two Line2Ds from the trace bar (`sledge`) to the strap (`torso`), so they stay taut
  when the sledge swings.
- Hearth Grandmother: the sinew should be a Line2D from the needle's eye (`thread`) to the mask (`mask`).
- Lead Dog: the line hangs on `line` (child of spine_1); fine as is.

## Still open (none blocks the gates)
- The Grandmother's hump, cropped by the frame top, still reads somewhat like a tall cone at sheet size; a broader,
  lower curve to the frame edge would sell the round back better.
- The Lead Dog's legs are clean but plainer than the Plague Wolf's (fewer tufts and grooves); its tail reads as a curl
  more than a brush at full size.
- The Drum-Seer's face sits mostly in the cel shadow band at full size (it is lit correctly; the head is turned up).
- The Bear's hind feet and the Ice-Fisher's legs carry less modelling than their upper bodies.
- Pose tests: rig layers are clipped to the canvas, so the Builder's block and the Grandmother's hump show straight cuts
  if swung far; keep those bones within the tested ranges or give the game frame room.

## Independent review (2026-11-23)

Reviewer: a second agent who did not build this batch, judging it fresh against MAKER_BRIEF, GUIDE 8 and 9,
LOGIC_CHECKLIST, bible 00 and the XII entries, with the Drowned King (ruler bar), the first batch (hair hanks, void
holes), the White Bear (reviewed hanks), the Plague Wolf and the Musk Ox as references. Every changed figure was rendered
alone (`node render.js worlds/world_XII_b <key>`, one at a time), composited on a mid-dark ground, zoomed 1x to 2x on the
head, hands, held objects and feet, checked at game size and on the sheet, rig-exported (no MISSING JOINTS) and
pose-tested on its attack. The sheet builder was copied from the maker's scratch to `worlds/sheet_XII_b.py`.

Director's rulings kept: no ground shadows; see-through void holes; eyes only where the bible asks (the drum's eye).

### What changed, by figure
- **The Unspoken Bear (rebuilt; canvas widened to 2200 x 2250 at the same scale, groundY 2220).** It read as a pale
  upright egg on column legs with a cartoon head. Now: the heavy hump high between the shoulder blades behind the neck,
  the back hollow under it, the haunch bulging back; a narrower chest and a pot belly hanging forward of it. A long neck
  into a long skull with a brow ridge over a defined stop, a deep blunt muzzle, the small dark almond eye sunk under the
  brow's fur ledge, the nape's fur run over the back of the skull (no seam). The mouth is a snarl: black lips drawn back
  off a long upper canine and a few worn incisors, the muzzle wrinkled, a narrow black gap at the front only (no tongue,
  no throat); the lip icicles that read as a row of teeth were moved to the chin. Each raised arm is one outline: the
  deltoid swelling on top, the triceps under, the elbow point outside the bend, the forearm muscle below the elbow
  narrowing to the wrist, then a paw broader than the wrist, cocked forward, five toes and long curved claws hooking
  forward and down; the shoulder's fur falls over the arm's root and a wrist ruff over the paw's seam. Each hind leg is
  one outline (the heavy thigh under the belly, the knee's point, the calf bulging behind into a lit Achilles, the ankle
  narrowing) onto a broad plantigrade foot with a round heel pad, an arched sole, toes splayed round the front and short
  claws in the snow, the foot's long fur hanging over it. Fur: forked hanks in clusters at uneven heights that follow the
  surface (leaning out on the belly's round, plumb on the flank), concentrated on the undersides (under each arm, under
  the belly and haunch, under the hump's overhang, the chest ruff in the arm's shadow), toned darker the lower they hang;
  value plan by soft tone: the hump's top, the shoulders, the top of each arm and the crown of the belly lit, the back,
  the belly's underside, the chest under the raised arm and the inner thigh dark; rime thick down the windward front.
  The belly hole sits low and off-centre on the belly's turn (oblique, it cuts the legs seen behind it too); the near
  shoulder hole is small at the arm's root and passes through the body and offerings behind it. Neither reads as an eye
  at full size, sheet size or in silhouette. The crown and ears are cut by the frame (the brow is kept in frame so the
  stop and eye read; the bible's "cut at the brow" gives way to the director's anatomy callout here).
- **The Hearth Grandmother (back rebuilt).** The cropped hump read as a tall white vase. Now the great hunched back: a
  broad round back from the hips up to the hump behind the shoulders, its top just cut by the frame, sloping forward
  without a break into the nape, where the head hangs over the work (the vase's vertical front wall is gone). A spine ridge
  of knuckled vertebrae (soft lit bumps with shadows, the outline itself bumped by them), the near shoulder blade as a lit
  plane with its lower edge in shadow, the near shoulder's round where the arm leaves, folds running down off the spine,
  three draped hides whose hems rise toward the shoulders with the hunch (forked hanks and short bead-sewn runs, not
  bands round a vase), snow heaped on the windward top with icicles off its edge. The hood, which read as a round plate,
  is now a small bunch of hide folds on the nape with its ruff. The needle sleeve, a slab with an inked triangle at the
  elbow (one outline folding over itself at the sharp bend), is now two overlapping masses with folds; the lap hand was
  enlarged (it was child-sized); the hair lightened and the comb moved into the hair at the back (it read as a dark cap
  with a toothbrush). Face and fist checked at 2x against the Drowned King: aged, modelled, lit at 0.8; the fist wraps the
  needle via `B.grip`.
- **Lead Dog (rebuilt on the Plague Wolf's habits).** Each leg is three muscled segments overlapping at the joints: the
  upper arm with the triceps behind and the point of the elbow, the lean forearm, the knob of the wrist, the sloped
  pastern onto a thick paw; the heavy thigh merging into the croup, the gaskin with the calf high behind, the Achilles
  cord, the point of the hock angled back. Deep chest to the elbow, the waist tucked; the shoulder blade and haunch by
  light and shadow on the spine bones. A broad wedge head with a clear stop, the small dark almond eye under a brow
  ridge, small ears; the mouth a little open in the silent pant (short drooping lip corner, the tongue's tip inside the
  teeth), no grin. A thick ruff of frozen hanks round the neck and chest. The tail is a full brush curled tight onto the
  croup (the hook with a hole is filled), long hair hanging off it. The missing ear is a flat clean cut (the round stump
  read as a ring on the head).
- **The Drum-Seer.** The head is turned up and the cel band ran across the face: faceShade 0.5 (band ~44 px) and the lit
  planes of brow, cheek and muzzle lifted. The brow fringe of seven outlined strips read as teeth; it is one fringe shape.
- **Snow-House Builder.** The hole sat dead centre on the blank block face with a pale ring and read as a lens or eye; it
  is now off centre toward the windward end with an angled bore, so a black tunnel crescent shows beside the opening.
  (On the dark sheet ground any see-through hole is black; on the game's snow it shows white.)
- **Ice-Fisher.** The plain grey tube legs are now bulky fur trousers: lit top and dark underside, folds bunched behind
  the knee and at the boot top, the knee's round with a sewn patch, frozen clumps off the thigh's underside and the
  calf, a tie at the boot. The ruff's radiating points read as a cartoon sun: fewer, shorter, pulled down by their ice.
- **The Voiceless Chief.** The slat cuirass read as a flat brick wall (equal slats, straight rows): the slats now narrow
  toward the sides and each row bows down at the sides, with a lit front and both sides turning into shade, so it wraps a
  barrel chest. The far shoulder's cut fox neck faced out as a black disc with a lit rim (an eye, or a telescope): now
  seen edge-on, a narrow black section. The near-shoulder fox head was hidden under the arm and read as a horn: it now
  lies on the shoulder with a cranium, stop, muzzle, black nose, two ears with dark insides, the eye sewn shut, a cheek ruff.
- **Sledge Hauler.** The load read as one smooth loaf: now separate bundles with their own outlines and ties (a flat hide
  stack, a folded bundle behind, a tied bundle in front, one further back), the tent roll on top, the pot, the hanging
  hide; the floating rime arc moved onto the bundle tops. The driving leg read as a tube: folds, value plan, the calf's
  swell, fur off the back of the thigh.
- **Lemming Drift.** Two holes side by side in a bare patch of the mass read as a pair of eyes: three holes of different
  sizes at different heights, now cutting through the lemmings packed round them.
- **Hush-Child, The Silent Singers.** Audited at 2x; no change needed (see the tables).
- **Silhouettes.** `render.js`'s CSS brightness(0) pass drops the Bear's torso (its nested hole masks inside split clips),
  so `sil.png` showed a broken bear. `sheet_XII_b.py` now takes silhouettes from each render's alpha, and the batch's
  `_sil.png` files were rewritten from alpha. (A re-run of `render.js` rewrites them the old way; the sheet does not care.)

### Gate 1: logic audit (independent)

Items: 1 head/neck/spine (animals: one spine, legs carry the weight), 2 objects face the user and gaze, 3 grips and hands,
4 weight and balance, 5 contact, attachment and plumb hang, 6 facing and light.

| Figure | 1 | 2 | 3 | 4 | 5 | 6 | Finding | Fix | Re-check |
|---|---|---|---|---|---|---|---|---|---|
| The Unspoken Bear | fixed | n/a | n/a | fixed | fixed | pass | egg body; the head sat on top of a wide neck block; column legs with ball knees; belly hole showed the thigh drawn behind it; near-thigh top drawn over the belly | hump, neck into the skull; one-outline hind legs under the body; the belly hole cuts the legs too; draw order fixed | rest render and blow pose (`the_unspoken_bear_pose.png`): paws, arms, jaw attached; holes travel with their bones |
| The Hearth Grandmother | fixed | pass | fixed | pass | fixed | pass | raising the near shoulder (first attempt) put the sleeve across her mouth; elbow outline self-intersected; a stray rime strip from the old vase edge floated over the back | shoulder back to (1010, 890), clear of the face; sleeve in two masses; strip removed | stitch pose: needle arm attached, sinew on `thread` (Line2D, below) |
| The Drum-Seer | pass | pass | pass | pass | pass | fixed | face in the cel shadow band | faceShade 0.5 and lifted planes | lit from the key side; beat pose closed |
| The Voiceless Chief | pass | pass | pass | pass | fixed | pass | fox head hidden under the arm (attached to nothing visible) | lies on the shoulder on `collar`, drawn after the arm | baton pose closed; fox stays on the shoulder |
| Ice-Fisher | pass | pass | pass | pass | pass | pass | (legs and ruff were style faults, gate 2) | | jerk pose closed |
| Hush-Child | pass | n/a | n/a | pass | pass | pass | none | | |
| Lemming Drift | pass | n/a | n/a | pass | fixed | pass | holes avoided the bodies, leaving a bare patch | holes cut through bodies | pour pose closed |
| Lead Dog | fixed | n/a | n/a | fixed | fixed | pass | tube legs with no elbow or hock points; tail a hoop with a hole | Plague Wolf legs (elbow, wrist, stifle, hock points, sloped pasterns, paws flat); filled brush | lunge pose: neck, head, jaw, legs attached |
| Sledge Hauler | pass | n/a | pass | pass | fixed | pass | rime arc floating above the load; a see-through gap between bundles | rime on the bundle tops; a bundle behind fills the gap | swing pose: bundles ride on `sledge` |
| The Silent Singers | pass | pass | pass | pass | pass | pass | none | | |
| Snow-House Builder | pass | n/a | pass | pass | pass | pass | none (the hole is gate 2) | | block pose closed; block clips at the canvas edge on big swings (noted) |

Every grip goes through `B.grip`; a full build of all eleven prints no `move the elbow` warning. Seeds 1220 to 1230 in
bible order, `flip: true` on all eleven, groundY = canvas h - 30 in every rig.json (checked). Palette scan: no red, no
gold; the only pixels above 0.25 HLS saturation (0.02% to 0.37%) are near-black warm ink at outline edges.

### Gate 2: style and detail (independent)

| Figure | Signature at 190 px | Frost / Never | Void / Never | Grit (min) | Palette | Unique silhouette (19) | Section 8 | Section 9 | Finding | Fix | Re-check |
|---|---|---|---|---|---|---|---|---|---|---|---|
| The Unspoken Bear | fixed | pass | fixed | 18 (12) | pass | pass | fixed | pass | upright egg, column legs, cartoon head with a toothy grin, hanks in level tiers, no value plan; shoulder hole on a round arm cap read as an eye | rebuilt (above) | sheet and sil: a reared bear, paws spread, hump and snarl read; holes read as holes |
| The Hearth Grandmother | fixed | pass | pass | 18 (12) | pass | pass | fixed | pass | hump a tall white vase; hood a plate; slab sleeve; dark hair cap | rebuilt back, spine ridge, draped hides, snow, hood folds | reads as a hunched back sloping into the nape; at sheet size the back is still a large rounded mass (open, below) |
| The Drum-Seer | pass | pass | pass | 15 (10) | pass | pass | fixed | pass | face in shadow; fringe as teeth | above | face lit at 2x and sheet |
| The Voiceless Chief | pass | pass | fixed | 14 (10) | pass | pass | fixed | pass | brick-wall cuirass; cut neck as an eye; fox head as a horn | above | barrel read at 1x; no eye read |
| Ice-Fisher | pass | pass | pass | 13 (6) | pass | pass | fixed | pass | plain tube legs; ruff as a cartoon sun | above | legs modelled at 2x |
| Hush-Child | pass | pass | pass | 9 (6) | pass | pass | pass | pass | face, fist, hoop and charms pass at 2x | none | |
| Lemming Drift | pass | pass | fixed | 9 (6) | pass | pass | fixed | pass | two holes read as eyes | three holes through the bodies | no face read |
| Lead Dog | fixed | pass | pass | 14 (6) | pass | pass | fixed | pass | cartoon: round eye, grin, plain legs, curl tail | rebuilt (above) | reads as a working dog at sheet size |
| Sledge Hauler | pass | pass | pass | 15 (6) | pass | pass | fixed | pass | loaf load; tube leg | bundles; modelled leg | load reads as heaped bundles |
| The Silent Singers | pass | pass | pass | 10 (6) | pass | pass | pass | pass | heads, clasped hands, braids, boots pass at 2x | none | |
| Snow-House Builder | pass | pass | fixed | 10 (6) | pass | pass | pass | pass | hole read as a lens or eye | off centre, angled bore | reads as a bore at 1x |

Section 9 line for the rebuilt figures: the Bear's pushed mark is the void's three clean holes and the black mouth
(bible); frost rimes and ices the fur; an animal the bible lists, its offerings keep the hunters' story. The Grandmother:
void took her ears and her fire, frost heaped snow on her back (bible); needle, thimble, masks, ulu keep the trade. The
Lead Dog: void cut the line and the ear (bible); harness and booties keep the trade. Nothing taken from Bloodborne.

Bear grit (18): three see-through holes; hide strap with two tied bundles; frozen fish; seal-tooth necklace; bone beads in
the ruff; two ivory amulets; three spear shafts with lashings; harpoon head and its line into the snow; scar ridges;
notched ear; claws; shattered sledge with lashing; overturned bone bowl; nine offering stones; muzzle frost; rime;
icicles; the drift. Lead Dog grit (14): harness and side strap with stitching; two bone toggles; girth strap; worn-bright
breast strap; collar and bone bead; two booties; bite scar with tooth marks; chewing rag with tooth marks; the cut line;
the cut ear; frost beard; frosted whiskers; ice in the toes; the ruff.

### Rig and pose tests (re-run for every changed figure; `out/worlds/XII_b/<key>_pose.png`)

| Figure | Bones | Layers | Attack pose | Result |
|---|---|---|---|---|
| The Unspoken Bear | 18 | 34 | two-pawed blow: upperarm_n -40, forearm_n -30, hand_n -20, upperarm_f 40, forearm_f 30, torso -6, head 8, jaw -10 | closed; the black mouth opens on the roar |
| The Hearth Grandmother | 16 | 22 | the stitch: upperarm_n -18, forearm_n -30, hand_n -10, thread -6, torso -3, head 4 | closed |
| Lead Dog | 20 | 31 | lunge and bite: neck -10, head -8, jaw 14, leg_fn 1/2 -14/10, leg_hn 1/2 8/-6, tail 6 | closed |
| The Drum-Seer | 21 | 28 | the beat: upperarm_f -18, forearm_f -30, beater -10, torso 3 | closed |
| The Voiceless Chief | 21 | 31 | the point: upperarm_f -8, forearm_f -10, baton -4, head -6 | closed |
| Ice-Fisher | 19 | 32 | the jerk: upperarm_n 10, forearm_n 22, hand_n 10, thigh_n -4 | closed |
| Sledge Hauler | 20 | 31 | the swing: sledge -14, traces 6, torso -6, thigh_n -6 | closed (traces rigid, below) |
| Snow-House Builder | 20 | 31 | block down: upperarms 26, forearms 8, torso 8 | closed; the block clips at the canvas edge |
| Lemming Drift | 65 | 69 | the pour: heap -3, every third lemming +-10/12 | closed |

### Holds that need IK in the game
- Snow-House Builder: the block rides on `hand_n`; `hand_f` must follow it with two-bone IK.
- The Silent Singers: each hand clasps the other woman's forearm; `a_hand_n` follows `b_forearm_n` and the reverse.
- Sledge Hauler: the traces should be two Line2Ds from the trace bar (`sledge`) to the strap (`torso`).
- Hearth Grandmother: the sinew should be a Line2D from the needle's eye (`thread`) to the mask (`mask`).
- No others: the Bear's paws, the Chief's baton, the Seer's drum and beater, the Fisher's jig and the Dog's line are each
  carried by one bone chain.

### Still open after the independent review (none blocks the gates)
- The Grandmother's back is now a hunched back, but at sheet size it is still a large rounded mass (a turtle-shell read
  rather than a vase); a second shoulder or a drape breaking the top curve would help further.
- The Bear's body hanks are many small clusters; at full size the barrel is busy, and the paws are still somewhat
  mitten-like at 1x (they read as clawed paws at sheet size). The far paw is smaller and partly behind the far forearm.
- Rig layers are clipped to the canvas: the Builder's block, the Grandmother's hump and the Bear's cropped crown show
  straight cuts if swung far; keep those bones within the tested ranges.
- `render.js`'s CSS silhouette drops masked groups on large figures (the Bear); shared file, not edited. Silhouettes here
  come from alpha.

## Ruler upgrade pass (2026-11-24): The Unspoken Bear and The Hearth Grandmother

### The Unspoken Bear
Director's note: the raised paws read as mittens; the round holes in the raised palms read as eyes (XII allows eyes only
where the bible calls for them, and these are not); the barrel is busy. Give the paws pads, splayed toes and long curved
claws; simplify the barrel's fur into fewer, larger hanks with clear light and shadow.

What changed (`world_XII_b.js`, `unspokenBear` only):
- Paws rebuilt (`paw`). The sole is turned toward the heroes: a broad, creased metacarpal pad with a dull sheen and
  pebbled skin, a small carpal pad by the wrist, and five short separate toes splayed in an arc, the outer toes shorter.
  Each toe has its own pad, gaps open between the toes, and tufts of fur sit between them. Long, thick claws curve
  forward and down from each toe. The wrist ruff and the frozen hanks under the paw are kept, and the rime on the paw is
  thinner (it read as a slat).
- Void hole: the round hole in the middle of the near palm is gone. The bible's holed forepaw is now a clean round bite
  out of the paw's outer edge by the wrist. It is see-through, its tunnel wall and rim show only on the paw, and it
  breaks the outline, so it cannot read as an eye. The far paw has no hole (as before). The belly and shoulder holes are
  unchanged.
- Barrel: the 44 scattered small clusters are replaced by four tiers of large forked hanks (80 to 124 px wide, 200 to
  300 px long) that follow the form. They run under the hump's overhang, across the barrel under the chest (lit), round
  the belly's crown (half-tone), and under the belly and haunch (dark). Lower tiers are drawn first, so each tier
  shingles over the roots of the tier below. Each tier is toned as one mass, which gives the barrel a clear light and
  shadow plan.
- Kept: head, arms, hind legs, offerings, holes, rig and bones, canvas and seed.

Before / after: before, the paws were rounded mittens with a black disc in the palm that read as an eye, and the barrel was
a field of small spiky clusters. After, the paws read at sheet size as clawed bear paws with black pads, and the barrel
reads as a few big frozen locks with lit tops and shaded undersides.

Checks: render; 2x on the paws and barrel; sheet size against the Drowned King. Rig: 34 layers, 18 bones, no MISSING
JOINTS. Two-pawed blow pose (`upperarm_n -40, forearm_n -30, hand_n -20, upperarm_f 40, forearm_f 30, torso -6, head 8,
jaw -10`): the paws and claws stay attached. The waist split shows a dark seam at `torso -6`. The reviewed rig shows the
same seam (re-posed from the pre-pass file to compare), so this pass did not cause it. It is still open for the animation
phase. The silhouette was rewritten from alpha, as this batch requires.

### The Hearth Grandmother
Director's note: her back reads as a turtle shell. Make the hump read as a body under hides. Break the smooth dome with
the spine and shoulder blades pushing through; hides with seams and lacing and fur trim at the edges; the hood's mass
running into the back; and snow lying in the folds.

What changed (`world_XII_b.js`, `hearthGrandmother` only):
- Outline: the spine's knuckles push the back's outline up harder (13 px, was 7), and the far shoulder blade and the
  hip push it out.
- Shoulder blades: the near blade is a lit plane on the upper back with a hard lower edge, and the hide is pulled into
  tension folds off its point. The far blade sits on the back's slope, lit along the spine edge with a shadow below.
- Hides: each of the three hems is a rolled band of fur trim with its frozen hanks below it and a ledge of snow lying
  along its top. Seams between the skins run down from the spine, each a raised welt laced with a thong through punched
  holes. One panel is skin-out and paler, one is darker, and snow is lodged in the deepest folds. The hides' ends overlap
  at the back like shingles: three flaps, each standing proud of the one below, with a thick lit edge and frozen hanks,
  so the back's outline steps instead of running as one curve.
- Hood: a real mass of hide (it was a small bunch at the nape). Its fur-ruffed opening is behind the head, its crown
  lies back over the hump, and its trimmed lower edge runs down into the back. It has its own lit top and shadowed
  underside, folds from the opening to the crown, snow in the folds, a back seam and a cast shadow on the back.
- The snow cap that echoed the dome is split into two heaps, one on the spine's ledge and one in the hollow behind the
  shoulder, each with icicles.
- Kept: face, hands, needle grip, masks, lap, hearth, rig and bones, canvas and seed.

Before / after: before, the back was one smooth white dome with level fringed bands (a turtle shell). After, the back reads
as a hunched body under heaped, laced hides: the hood runs into it, the shoulder blades and spine show through, the
trimmed hems carry snow, and the outline steps at the hides' ends. At sheet size the overall mass is still large and
rounded (it is her bible shape), but it no longer reads as a shell.

Checks: render; 2x on the back, hood and seams; sheet size against the Drowned King. Rig: 22 layers, 16 bones, no
MISSING JOINTS. Stitch pose (`upperarm_n -18, forearm_n -30, hand_n -10, thread -6, torso -3, head 4`) closed. The
silhouette was rewritten from alpha. Sheets were rebuilt (`sheet_XII_b.py`).

Still short: the laced seams are regular and read a little like ladders at 2x. The cropped hump's top edge is still a
smooth arc.
