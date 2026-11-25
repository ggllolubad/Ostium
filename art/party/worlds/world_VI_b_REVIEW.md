# World VI, The Stormwrack Coast, batch b: review

File: `worlds/world_VI_b.js`, new helpers in `worlds/kit_VI_b.js` (it requires `kit_VI.js` and re-exports it; neither
`world_VI.js` nor `kit_VI.js` was edited). These 11 bring World VI to 19 creatures: 3 rulers, 4 elites, 12 cast. Seeds
are 620 + bible index: Last Prize 620, Wind-Seller 621, Gibbeted Wrecker 622, Strand-Wife 623, Lantern Cow 624,
Ship-Breaker 625, Storm Petrels 626, Rock Octopus 627, Drowned Drummer 628, Cragsman 629, Drowned Merchant 630. Every
figure is built facing right with `kit.foeBase` light (through `kit_VI.base`, groundY = canvas h - 30), then flipped.

Outputs: `out/worlds/world_VI_b_<key>.png` and `_sil.png`; rigs in `out/rig/worlds/world_VI_b_<key>/`; attack pose
tests in `out/worlds/VI_b/<key>_pose.png`; `out/worlds/VI_b/sheet.png` (the 11 plus the Drowned Thrall, true relative
scale), `sheet19.png` (all 19, the first 8 from the existing `out/worlds/world_VI_<key>.png`), `sil.png` (all 19 at
190 px per human).

Checked by tracing each body from the code and on renders composited on a mid-dark ground at 1x to 3x (heads, hands,
held objects, feet), at sheet size and on the silhouette tile. "Fixed" means it failed on an earlier render of this
batch and passes on the current one.

| Figure | Tier, true size | Canvas (same pixel scale) | Bones | Layers |
|---|---|---|---|---|
| The Last Prize | ruler 4 | 1600 x 1600 (ruler; bow in frame, stern and mast tops cropped) | 18: sea (root), hull_aft, hull_fore, gun_1..4, sailor_1..3, sailor_1..3_arm, boat, anchor, bell, sail, lantern | 35 |
| The Wind-Seller | ruler 3.5 | 1700 x 1900 (heightened and widened: stack foot in the surf, crown cut by the top) | 19: stack (root) > pelvis, standard humanoid, hair, cord, shawl_skirt | 24 |
| The Gibbeted Wrecker | elite 2.3 to the arm top | 1100 x 1560 (heightened) | 13: gibbet (root) > chain > cage > pelvis > torso > head; legs x2; lantern | 18 |
| The Strand-Wife | elite 1.9 | 1600 x 1400 (widened for the dragged corpse) | 21: standard humanoid + hook > corpse > corpse_legs, coat_skirt, sack, neck_boots | 29 |
| Lantern Cow | large, 1.3 at the withers | 1600 x 1100 (widened for the body length) | 21: spine_1 (root) > spine_2 > neck > head > lantern, ear; bell; tail; blanket; legs leg_[f/h][n/f]_1..3 | 29 |
| Ship-Breaker | large 1.5 | 900 x 1100 | 19: standard humanoid + knee, crowbar, sack, apron | 27 |
| Storm Petrels | small, flock about 0.75 across | 600 x 820 | 14: water (root) > bird_1..11, dead, sail | 16 |
| Rock Octopus | small 0.5 | 600 x 820 | 14: rock (root) > body > mantle; arm_r1_1..3, arm_r2_1..3, arm_w1..w5 | 17 |
| Drowned Drummer | human 1.0 | 600 x 820 | 18: standard humanoid + drum, stick_n, stick_f | 29 |
| Cragsman | human 1.0 | 900 x 820 (widened for the pole) | 19: rope (root, anchor above the frame) > pelvis > standard humanoid, pole, basket, sack | 25 |
| Drowned Merchant | human 1.0 | 600 x 820 | 17: standard humanoid + box, gown | 25 |

Every rig exports with no `MISSING JOINTS`; every `rig.json` carries ground = canvas h - 30 (1570, 1870, 1530, 1370,
1070, 1070, 790 x 5). Every grip goes through `B.grip` (or `kit_VI.openHand` for a hand laid flat, cupping or spread),
and no render printed a `grip ... move the elbow` warning.

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

| Figure | 1 Head, neck, spine | 2 Objects and gaze | 3 Grips and hands | 4 Weight and balance | 5 Contact and attachment | 6 Facing and light |
|---|---|---|---|---|---|---|
| Last Prize | pass (figurehead's head on her neck, leaning out along the stem) | pass | fixed (rail sailors) | pass (on the rocks, broken back hinged at the keel) | fixed (figurehead) | pass |
| Wind-Seller | pass (hunch from the upper back, skull over the neck line) | fixed (cord) | pass | fixed (feet on the stack) | pass | pass |
| Gibbeted Wrecker | pass | pass | pass | pass (cage hangs plumb from a rigid chain) | fixed (boot) | pass |
| Strand-Wife | pass | pass | fixed (hook arm) | fixed (lean) | pass | pass |
| Lantern Cow | pass | pass | n/a | fixed (legs) | fixed (ear, bell strap) | pass |
| Ship-Breaker | pass | pass | fixed (knee over the shoulder) | pass (weight on the front foot, back heel lifted) | fixed (knee clipping) | pass |
| Storm Petrels | pass | pass | pass (button gripped in the bill) | pass (in flight, feet pattering on the surf line) | pass (line loops round the bodies, sail snagged on feet) | pass |
| Rock Octopus | pass (eyes on the head, in front of the mantle) | pass | n/a | pass (weight through the curled walking-arm tips on the rock) | pass | pass |
| Drowned Drummer | pass | pass | fixed (sticks) | pass (weight on the near leg, far knee lifted) | pass (hoop welded to the hip, sling shoulder to drum) | pass |
| Cragsman | pass | pass | fixed (rope hand, pole) | fixed (feet braced) | pass (rope from anchor to fist to bowline) | pass |
| Drowned Merchant | pass (head over the neck, chin sunk on the jowls) | pass | fixed (box hands) | pass (hips forward, shoulders back against the box) | fixed (strap welds) | pass |

### What failed and how it was fixed
- Drowned Merchant 3/5: in the first build the box floated in front of his belly with both hands open beside it and the
  welded strap ran through empty air. The box is now hugged high against the chest: the far forearm lies over the lid
  with the fingers hooked over the far front corner, the near forearm runs under the box, the hand cups the lower front
  corner. The girth strap runs down the near end and across the forearm, welded into it at both edges.
- Drowned Drummer 3: the sticks were set square to the forearms (an `across` grip), so they pointed back over his
  head. Drumsticks continue the forearm through the palm: both are now `inline` grips, the near stick dipping toward
  the head mid-beat, the far stick lifted for the next stroke.
- Cragsman 3/4: first build had the near arm stretched straight up to the rope with the far hand far behind his head,
  and his bare feet dangling. Now the near hand grips the rope low above the bowline (the rope is fused into it), the far
  arm reaches out over the rope and comes down onto the fowling pole, and both legs thrust out with the soles flat
  against the air as if against the cliff (new `kit_VI_b.looseFoot`, a bare foot at any angle with calluses and toes).
- Wind-Seller 2/4: the cord first crossed her face and her feet stood on the canvas ground under the stack. The cord now
  comes down from out of frame ahead of her face into both fists; the far foot stands on the stack top, the near foot on
  the lower ledge (groundY is set locally for each foot, so the soles meet the rock).
- Strand-Wife 3/4: the hook first ran from a fist at her hip; the far arm now reaches back, the pole running from the fist
  in line with the straining arm (an `inline` grip) down to the collar; the spine leans forward over the near foot.
- Ship-Breaker 3/5: the oak knee first lay across his head. Rebuilt as one curved timber (a spline ribbon thick at the
  bend, with end grain and its thickness offset behind): the fist holds the handle in front of the near shoulder, the
  bend lies over the shoulder, the long arm hangs down his back. The part in front of the shoulder is drawn again,
  clipped, over the arm, so it lies over the shoulder rather than through it.
- Lantern Cow 4/5: the first build had tube legs of even width ending in clogs (the Magma Hound fault). Each leg is now one
  outline cut into three bones: forearm and knee (front) or gaskin and the sharp point of the hock (hind), the lean
  cannon with its flexor tendon, the fetlock with dewclaws, the sloped pastern and a cloven hoof (two claws, cleft,
  coronet band, growth rings, barnacles). The ear first stuck out of the forehead; it now leaves the poll below the horn.
  The bell strap first ran down the neck like a rein; it now goes round the neck to the bell at the throat.
- Gibbeted Wrecker 5: the sea boot was first drawn on the ground line, so it hung at a right angle off his shin. It is
  now drawn hanging toe-down from the dangling leg.
- Last Prize 3/5: the rail sailors' hands were first open hands laid beside their pikes, and the figurehead floated off
  the bow at the canvas edge. The sailors now grip the shafts through `B.grip`, the elbows thrown out so the forearms meet
  the shafts near square; the figurehead sits on a carved scroll bracket on the stem, leaning out, the whole ship moved in
  the frame so her head is inside it.

### Pose tests (attack from each Motion line), `out/worlds/VI_b/<key>_pose.png`
| Figure | Pose | Result |
|---|---|---|
| Last Prize | groan and drag: hull_aft -2, hull_fore 2.5, sailor arms 10 to 14 (reach down), boat 6, anchor -3 | pass: the halves hinge at the keel and the break opens; the pikes stay in the fists; boat and anchor swing on their own bones |
| Wind-Seller | knot untied: torso 8 (rears back), near arm -20/-10, far arm 10/14, head -6, hair -4 | pass: shawls, coat and hair stay attached, the cord rides the near fist |
| Gibbeted Wrecker | strike, legs kicking: chain -6, cage 4, thighs -30/20, shins 40/-20, lantern 6 | pass: cage swings on the rigid chain, the man rides it, the legs kick below the bottom hoop with no tears |
| Strand-Wife | ringed-fist blow: near arm 50/-30, torso -6, head 4, hook 4 | pass: the fist swings out, shoulder cloth stays on the torso, the corpse follows the hook |
| Lantern Cow | butt: neck 14, head -16, lantern 10, spine_2 3, forelegs 8/-6, hind -6 | pass: head drives forward on the neck, lantern swings on its pivot between the horns, leg cuts stay closed |
| Ship-Breaker | overhead blow: near arm 150/40, knee 40, torso -8, head 6, front leg -8/6 | pass: the knee swings up and over on the fist; crowbar arm and sack stay attached |
| Storm Petrels | the flock pouring: birds rotated -14 to 14 each | pass: each bird turns on its own pivot; the line and sail ride their birds |
| Rock Octopus | arm whipped round: arm_r1 -20/25/35, arm_r2 -8, mantle 5, walking arms 6/-6 | pass: the raised arm curls on its three bones, the antler welds ride the arm, no gaps at the cuts |
| Drowned Drummer | roll: near arm 10/-10, stick -30, far arm -4/6, stick -8, torso -3 | pass: the sticks come down onto the drum head; the drum stays welded to the hip |
| Cragsman | swing and lash: rope 10, far arm -20/-15, pole -10, legs 12/-10/8 | pass: the whole man swings on the rope, the pole lashes from the fist |
| Drowned Merchant | ram: torso -8, near arm -14/-6, far arm -10, head 6, near leg -10/8, gown -3 | pass: the box rides the near forearm (welded), the far hand stays near the lid (see IK below) |

## Gate 2: style and detail

Course marks for World VI, lightning dominant: Lichtenberg burns spreading from fused metal and fused joints, welds,
standing hair and bristles, scorched metal; water: bloat, pale wrinkled skin, barnacles, verdigris, kelp, salt, drips.
Never: glowing outlines, sci-fi arcs (and, per GUIDE 8, no arcs or bolts at all in figure art: none are drawn in this
batch; `kit_VI.bolt` is not called anywhere in `world_VI_b.js`), fish faces on everything.

| Figure | Signature at 190 px | Course marks / Never absent | Grit (need) | Layers | Palette | Quality bar (GUIDE 8 faults) | Section 9 (Bloodborne adapted) | Result |
|---|---|---|---|---|---|---|---|---|
| Last Prize (round 2 rework below) | pass: heeled, broken-backed hull with gunports and mast stumps; figurehead at the bow | pass: every bolt and chainplate a black weld with a scorch tree, rigging fused into black rods, the split figurehead's burned face; swollen split strakes, barnacles, kelp from the ports, salt | 30+ (12): 4 gunports with lids and gunners, fused muzzles, 3 rail sailors welded through pike and hook, cracked bell in its belfry, torn sail with grommets and holes, name board hanging by a nail, stove-in hold (bales, spice casks, split coin chest), anchor on a fused chain, 2 grapnel lines, lit stern lantern, smashed boat hanging by its painter, pump handle frozen, gull on the stump, deck hatch, rope coil, ring bolts, wales, splintered break | hull planking, wales and rail, deck, rigging, crew | pass (slate timber, surf, lamp at the stern; coins tarnished brass, not gold) | fixed: flat-front ship (added the deck plane seen above the rail as she heels, the far bulwark, wales with lit tops and cast shadows, the rail's thickness, the break opening as a V); fixed: figurehead read as a log (now a bust with drapery, crossed arms carved in relief, a face) | remnant: the merchantman and her crew at stations; one part pushed: welded ironwork with scorch trees; outline: frayed fused rigging, torn sail, splinters | pass, polish open |
| Wind-Seller (round 2 rework below) | pass: bent old woman on the stack, cord rising into the sky, hair standing in wind-torn hanks | pass: white Lichtenberg lace on face, scalp, neck, arms and shins; knuckles fused to the cord; hair standing; soaked pale skin, barnacled feet and shins, kelp round the ankles | 20 (12): knotted tarred cord (three knots untied and frayed), layered shawls with bone pins, oilskin far too big, coin and button string, bird-bone whistle, ship charm, sack of knotted cords, dead gull at the belt, driftwood staff, broken lantern with glass at her feet, fringe, patch, salt, scorch, guano on the stack | skin, shawls x3, oilskin, cord | pass | fixed: flat skirt areas (three hanging shawl layers with plumb folds, the coat's back skirt, a shawl hump with fringe, front ends hanging from the bent chest); face shading 0.82 | remnant: the wise-woman's cord and payment coins; one part pushed: the lace of strike scars and the standing hair; outline: wet plumb shawls, fused frayed hems | pass |
| Gibbeted Wrecker | pass: post and arm with the man-shaped cage | pass: bars fused at the wrist, the ribs and the jaw, black burn trees on the skin, singed standing brush; swollen white flesh | 19 (10): spikes against climbers, plaque in rubric red, padlocked hasp fused shut, rigid welded chain, lantern at the belt, ragged jumper with burn holes and a patch, one sea boot, noose end, dead gull caught by a wing, droppings on the cage top, rusted spike through the foot, strap binding and bolts, split rock, wedge stones | skin, jumper, cage, gibbet | pass (red only on the plaque's lettering) | fixed: the post read as a flat plank (side face, end grain, underside of the arm, a brace) | remnant: the wrecker's jumper and storm lantern; one part pushed: the bars fused into the bones; outline: frayed noose and yarn | pass |
| Strand-Wife | pass: gaunt figure hauling the corpse on the hook | pass: the right hand a knot of rings welded into one scorched mass, lamp-yellow glints at the welds, scars branching up the arm, the hair a stiff fan; soaked sagging layers, barnacles at the ankles | 18 (10): striped shirt, merchant's coat, officer's ticking waistcoat with a fused button, button necklace, officer's hat with tarnished braid over the headscarf, salvage sack with a boot sticking out, finger knife, boots tied round her neck, oversize sea boots, the corpse (bloated, stripped to his shirt, hook through the collar), patch, salt, stains | shirt, coat, waistcoat, hat, scarf | pass | fixed: hair as parallel stripes (now clumped tapering masses rooted under the brim); fixed: oversize boots read as tubes (gaping tops, folding slack shafts) | remnant: the dead's clothes she wears; one part pushed: the fused ring-knot hand; outline: wet hanging coat, the stiff hair | pass |
| Lantern Cow (round 2 rework below) | pass: lantern blazing between the horns of a low-headed cow (enlarged after the sil check) | pass: horns scorched black and split, burns from the horn bases down face, neck and shoulders, ridge of standing hair, lantern frame fused to the horns; sagging soaked hide, swollen udder, wrinkled pale lower legs, barnacled hooves | 16 (6): hobble with chain, rope halter and trailing lead, iron bell on a strap, sackcloth blanket with patch and fringe, surcingle, brand on the hip, torn ear tag, kelp in the tail, cracked lantern glass, tear streak, ribs, hook and pin bones | hide, blanket, harness | pass | fixed: tube legs and clog hooves (now bovine legs and cloven hooves, see Gate 1); fixed: smooth flat hide (ribs as valley and ridge, coat hair lie, the barrel turning under) | remnant: the wreckers' false light; one part pushed: the struck horns and lantern; outline: wet blanket hem, standing spine ridge | pass |
| Ship-Breaker | pass: curved oak knee over the shoulder | pass: copper strips and iron bolts fused into both forearms and the shoulder, burns across the chest from the welds, the beard singed stiff; bloated belly and hands, barnacles in the elbow crooks | 18 (6): oak knee with bolts, shake and end grain, crowbar with claw and bent chisel end, apron with two pockets full of nails, burn pocks, patch, rope coil across the chest, sack of torn copper sheathing, bow saw tied across it, belt of salvage hooks, rolled sleeves, sea boots, wool cap, broken nose | skin, smock, apron, sack | pass | fixed: the knee read as a flat plank (curved ribbon with thickness); fixed: large flat apron (stains, pocks, sheen, patch) | remnant: the breaker's tools; one part pushed: metal fused into the arms; outline: singed beard | pass |
| Storm Petrels | pass: low pattering flock with dangling feet | pass: every bird ruffled with standing contour feathers, scorched slotted wingtips, a burn fern across each pale rump band; soaked, foam, a dead one floating | 9 (6): broken wing, fishing line binding two birds, torn sail scrap with a grommet, button in a beak, dead bird, foam flecks, spray kicked up by the feet, open tube-nosed bills, salt | plumage, wings, props | pass | fixed: first wings were long fans like crows (now narrow pointed petrel wings with slotted tips); fixed: red mouths (now dark) | n/a beyond the course rules: an animal, bedraggled, feathers frayed and standing | pass |
| Rock Octopus | pass: tall swollen mantle on curled arms, two rigid metal-studded arms raised | pass: copper nails, a button, a coin, a hinge fused into the raised arms' suckers, antler-like welds, pale Lichtenberg trees on the mantle and every arm, stiff papillae; sagging swollen mantle, barnacles at the arm bases | 12 (6): nails, brass button, bent coin, brass hinge, antler welds, tarred line round an arm, bitten stump regrowing, kelp from the mantle, crab-shell midden, cork float, verdigris, scorched tips | skin, oral band and suckers, hoard | pass | fixed: tentacles of even width (new `kit_VI_b.tentacle`: muscular base, tapering, curling tips, a paler oral band, suckers in two staggered rows that follow the arm and shrink to the tip); fixed: mantle read as a ball (now sags back with folds and an underside in shadow) | n/a: an animal; the hoard is its course mark | pass |
| Drowned Drummer | pass: big drum at the hip and two raised sticks | pass: the drum's iron hoop welded to the hip, burns down the thigh and up the ribs, sticks scorched into the fists, hair standing under the morion; bloated pale, barnacles across the shoulders | 16 (6): drum with split vellum head, fused tension ropes and leather tugs, sling with plate, padded jacket with patch, dented morion with comb, rivets and chin strap, short sword and scabbard, spare sticks in the belt, canvas trousers with patch, stockings fallen in a heap, pewter-buckled shoes, kelp, salt | skin, jacket, sling, drum, helmet | pass | fixed: stockings read as stacked rings (now a slack heap with folds); fixed: the comb read as a cap (tall crescent with lit edge) | remnant: the marine's drum and morion; one part pushed: the hoop fused to the hip | pass |
| Cragsman | pass: hanging from a rope with the long pole out | pass: rope fused into the hand and burned into the waist at the bowline, burn trees from the waist across belly and legs, the hair standing in a soaked crest; pale wrinkled skin | 14 (6): bowline over a padded sling, fowling pole with horsehair noose and whipping, egg basket with cracked eggs and yolk running, sack of feathers, knife, ripped jumper with darn and unravelled yarn, harpy feather in the cap, calloused bare feet, scorch on the rope, kelp, cable panel | skin, jumper, breeches, sling | pass | fixed: bare feet as blobs (looseFoot with toes and nails) | remnant: the cragsman's pole, basket and rope; one part pushed: the rope fused into hand and waist | pass |
| Drowned Merchant | pass: round figure hugging the strongbox | pass: the box's iron straps fused into the forearms, burns from the welds across chest and neck, one soaked tuft standing; bloated face and belly splitting the doublet, barnacles on shoulders and knuckles | 18 (6): iron-bound oak strongbox (corner binding, girth straps, studs, hasp, big padlock), ledger pages stuck to it, velvet gown with wet fur trim and patch, doublet burst at the front with eyelets and broken laces, paned slashes, key chain, silver rings in swollen fingers, seal on a cord, purse, one shoe lost, rolled stocking, kelp | skin, doublet, gown, box | pass (silver, iron and tarnished brass; no gold) | fixed: the box first read as a flat front (three faces: top, end, front); fixed: hands near but not holding | remnant: the merchant's gown, keys and seal; one part pushed: the welded box straps | pass |

No two of the 19 World VI creatures share a silhouette (`sil.png`). Checked pairs most at risk: the two hanging men
(the Gibbeted Wrecker is caged and hangs plumb under a post; the Cragsman hangs at a slant on a free rope with a long
pole); the two lantern carriers (the Keeper's lens on a pole, the Wrecker's lamp held out, the cow's lamp on the horns
of a quadruped, the Gibbeted Wrecker's lamp at a caged man's belt); the drowned men (Bosun upright with axe and call,
Drummer with the drum, Merchant round behind a box, the Thrall reference with his hook); the two rulers in the surf (the
Thunder Whale's breaching head, the Last Prize's hull block with figurehead and anchor) and the Wind-Seller as a tall
bent figure on a pillar of rock. The flock of petrels reads as many small birds, unlike the single Storm Harpy.

Faces: every human face uses `faceShade` 0.75 to 0.85 (Mother Hild is 0.85) and the hand-placed face hatch is off where it
read as stubble. No cartoon faces: eyes filmed, rolled up, squinting or sunk in swelling.

## IK and rig notes
- Two-handed holds that need IK in game: the Wind-Seller's far hand on the cord (the cord rides `hand_n`); the Drowned
  Merchant's far hand on the box lid (the box rides `forearm_n`, where its strap is welded); the Cragsman's near hand is
  fused to the rope, which is the root of his chain, so a swing keeps it, but any arm animation needs IK onto the rope.
- The Gibbeted Wrecker's arms are drawn on `torso` (their wrists are fused to the bars); keep `torso` within a few
  degrees or drive the hands by IK onto the `cage` bars.
- The Last Prize's guns recoil on `gun_1..4` (each carries its gunner); the broadside's crack, like every strike in this
  batch, is an engine effect.

## Coordinator rework, round 2 (2026-11-23)

Three figures were sent back after the sheet check. Each was reworked, re-rendered, re-rigged (no `MISSING JOINTS`,
ground = canvas h - 30), pose-tested again with the same attack poses (all pass: no tears, parts stay attached), and the
three sheets were rebuilt.

| Figure | Item | Was | Fix | Result |
|---|---|---|---|---|
| Wind-Seller | Cloth as flat boxy slabs, a square shoulder block, a rectangular coat panel | fail | The body under the cloth is now a bent body: the hump of the back high, the waist pinched in by a knotted rope belt, the hips flaring under the coat. The coat hangs from the hump in deep folds that pull in to the belt and flare below it. The back turned from the light is in shadow. Deep folds are drawn as a dark crease, the soft shadow of its slope and a lit ridge (`valley`). The great shawl is re-cut as a triangular shawl: it clings over the hump and the shoulder ball, which shows through as a lit round with a crease ring. Its back point is dragged down the back and blown back by the wind, its hem is torn unevenly, and its knotted corners hang heavy at the breast. Folds radiate from the knot and sag between, and small creases show where the wet wool clings. It has two moth-and-salt holes with loose threads, a darn and a patch. The fringe is wet clumps of uneven length, a few long ones dripping. The square box over the upper arm and the dark collar slab are gone: the collar is a rolled, bunched edge, and the near elbow's bony point pushes through a creased sleeve. The skirts are three layers with hems torn into strips of uneven length (the Drowned King's hem), cloth pulled taut round the near knee, slack folds dragging back, a tear showing the layer beneath, a darn, threads hanging from the strips | pass |
| Wind-Seller | Hair crest as parallel stripes | fail | 13 hanks drawn in a mixed order so they cross. Each is narrow at the root, widest in the middle and splits at the tip. Widths run 20 to 110 px, lengths 120 to 640 px, the angles spread through about 110 degrees, and strand lines of different length and weight are drawn inside each hank (hairMass's parallel strand lines are switched off). Some hanks are bound with knotted cord ties hanging frayed ends; there is a bone bead, a gull feather tied in, three wind-knots tied in the hair itself, and singed tips | pass |
| Wind-Seller | Ruler-level grit | fail | Added: six sold winds on the belt (knotted cords of hemp and tarred line, three knots each, blown back), three more on the driftwood staff, the purse with an iron clasp (struck: the burn spreads down the leather from it), coins on the necklace welded where the strike hit, a holed hag-stone and a scallop shell beside the bird-bone whistle and ship charm, salt crust on shawl, coat, skirts and face, a patch and a darn. Detail count now 30+ | pass |
| Wind-Seller | Face at 2x: a flat pale disc | fail | Weathered skin tone, face hatch on in the shadow, `faceShade` 0.85. Planes are drawn in: a sunk temple, a lit cheekbone and nose ridge, a deep hollow under the cheekbone, deep eye sockets. Heavy hooded lids sit over narrowed eyes with a live glint (canny, squinting into the gale), under-eye bags, a fan of crow's feet, brow furrows and frown lines, a deep nasolabial fold with a lit edge, a hooked nose, the mouth pursed to whistle in a mesh of creases, liver spots, a wart with a white whisker, chin whiskers, and loose folds of skin under the jaw. All face lines were thickened for the 330 px head | pass |
| Lantern Cow | Barrel as a box, flat top line, flat hide | fail | New outline: the pin bones and the hook bone jut at the croup (with hollows under them), the spine sags through the loin and back, the withers rise. The ribcage is deeper and sags. Ribs are drawn as valley and lit ridge each. The hide is hatched to wrap round the barrel and haunch, strokes irregular in spacing and length and densest on the shadow side. Mottled coat patches and wet streaks run down from the blanket. The dewlap hangs slack from throat to brisket in folds | pass |
| Lantern Cow | Blanket hem a row of identical scallops | fail | A ragged sodden hem with seeded irregular steps: mostly short strips, some long tatters, sharp and soft corners mixed, threads hanging, drips only from the longest strips, three tears in the sacking | pass |
| Lantern Cow | Eye a round white disc | fail | A dark, deep-set bovine eye under an overhanging brow ridge (which casts onto it): a deep socket, a dark almond eye with a wet highlight, an upper lid, lower lid folds, lashes, and a crescent of white at the back corner for the fear | pass |
| Lantern Cow | Forearms slab-like | fail | Front legs re-outlined: the forearm muscle at the elbow tapers hard to a narrow knee, then a lean cannon and fetlock (the hind cannons narrowed to match) | pass |
| Last Prize | Splinters at the break evenly spaced, reading as ladder rungs | fail | The splinters now come from a seeded random walk: spacing 26 to 176 px, lengths 10 to 100 px, angles within about 40 degrees of the hull line, two tones. Added four torn planks hanging off the break at different angles, each still nailed at one end, splintered at the free end and barnacled, plus a rope sagging across the gap and two frayed ropes hanging down it | pass |
| Last Prize | Heel does not read | fail | The whole hull is tilted 3.5 degrees bow-down about the keel under the break, on top of the broken-back hinge (the aft half now sits at +1 degree, the fore half at +6.5 degrees). Gunports, wales and mast stumps all lean with it; the rocks and surf stay level | pass |

The petrels' flock width (0.75 of a human) stands, as the coordinator ruled.

## Still open
- Last Prize: the figurehead reads as a carved woman at 2x but only as a bust at game size.
- Storm Petrels: the flock spans about 0.75 of a human (bible "about 0.6"); accepted by the coordinator.
- Wind-Seller: about 3.3 to 3.5 standing (6.4 heads of 330 px), bent forward so the frame crops her hair and crown. At
  sheet size the lit upper face of the great shawl is still her broadest single tone; its folds show at 1x but soften at
  0.3x.
- Lantern Cow: the slate hide is still the lightest mass in the world sheet.
- `kit_VI.bolt` and the Thunder Whale's `arcs` layer belong to the first batch and are untouched here (the GUIDE 8
  ruling moves them to an FX layer in the consistency pass).

## Independent review (2026-11-23)

Reviewer's pass, after the coordinator's two rounds. Every figure was checked on renders composited on a mid-dark
ground at 1x and 2x to 3x (head, hands and held objects, feet), at sheet size, on `sheet19.png` and on the silhouette
tile; the two rulers were also set beside the Drowned King at 0.3x. Every figure was re-rendered, re-rigged (no
`MISSING JOINTS`, ground = canvas h - 30 in every `rig.json`) and pose-tested again with the attack poses in the table
above, because batch-wide changes (burn colours, fur trim, petrel feet) touch all of them. No render prints a
`grip ... move the elbow` warning. All three sheets were rebuilt. Backups of the pre-review files are in the reviewer's
scratch folder (`rvVIb/*.orig.*`).

Batch-wide changes (in `world_VI_b.js` and `kit_VI_b.js` only; `world_VI.js` and `kit_VI.js` untouched):
- The file carried the Last Prize's and Strand-Wife's header comments pasted up to ten times (about 330 duplicate
  lines); collapsed to one each.
- Burn trees: the default skin-scar colours (maroon channel, pink keloid edge) read as pink lace on every soaked coat,
  sleeve and trouser leg. A burn tree with no colour given is now a dark burnt channel with a pale neutral edge, and
  `kit_VI_b.weld` takes the same (or a figure-wide `burnCol`: on the Last Prize every weld is in timber or iron, so its
  trees are scorch). The `metal: true` trees (kit_VI draws them as lamp-yellow threads) read as gold tassels at sheet
  size on the crowbar, the anchor and the drum hoop; in this batch they are dark scorch with a pale heat edge, and the
  lamp yellow stays only as the small glint at each weld.
- `paleLamp`: a lit storm lantern whose light is a warm pale yellow, kept small (a soft glow about a third of kit_VI's,
  the glass washed pale). Used on the cow, the Last Prize's stern lantern and the Gibbeted Wrecker's belt lantern.
- `hatchIn` (crosshatch clipped to a region) and `knitCap` (a sailor's knitted cap over a head frame).
- `furTrim`: wet clumps of uneven size and spacing (they were a row of identical teeth).

### Gate 1 (independent): logic audit

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Wind-Seller | Staff: the bible leans it against the stack; it is not held. Both hands are on the cord: the near fist `B.grip`, the far fist `B.grip` with the cord through both knuckle rows; neither hovers | none needed for the grip. The near grip's direction now follows the bellied cord above the fist (`cordQ`), not the straight line to the anchor | pass: both fists close round the rope at 2x |
| Wind-Seller | The broken ship's lantern was hidden behind her near ankle on the ledge (read as a bucket attached to her) | moved onto the stack top beside the far foot, its glass dark (the bible's lantern is broken) | pass |
| Wind-Seller | Bare feet stood with the ankle 58 px above the sole, so `bareLeg` drew flat clogs | ankles raised to 104 px: heel, arch, ball and toes now read | pass |
| Last Prize | Rail sailors: the fists grip through `B.grip` with the forearm near square to the shaft (checked at 2x for all three) | the arm rebuilt as sleeve to the elbow, a rolled shirt cuff and a swollen bare forearm into the fist (it was one even-width tube) | pass |
| Last Prize | Figurehead at game size read as a bust on a log | see Gate 2 | pass |
| Gibbeted Wrecker | Near fist on the side strap square to the forearm; far wrist fused to the bar; cage plumb from the rigid chain; one boot hanging toe-down | none needed | pass |
| Strand-Wife | Hook fist `inline` with the straining arm; ring-knot fist out front; corpse hooked through the collar | none needed | pass |
| Lantern Cow | Lantern sat on the poll with the horns beside its base, so the frame "fused to the horns" touched them only at the bottom | horns re-drawn sweeping out and up in a lyre to flank the lantern; two more lashings from the horn tips to the cage; welds moved to where the frame meets each horn | pass |
| Ship-Breaker | Knee fist in front of the shoulder, crowbar fist hanging; crowbar burn tree ran off the bar into the air | burn now runs along the bar | pass |
| Storm Petrels | Button in a bill; line loops round two bodies; feet on the surf line | none needed | pass |
| Rock Octopus | Weight through curled tips; raised arms rigid with fused metal | none needed | pass |
| Drowned Drummer | Sticks `inline` through both fists; hoop welded to the hip; sling shoulder to drum | none needed | pass |
| Cragsman | The standing crest floated a gap above a bald scalp (hair attached to nothing) | wet hair plastered over the scalp in front of the cap, the crest rooted in it | pass |
| Drowned Merchant | Far hand hooked over the lid's front corner; near hand cupping the lower front corner; straps welded to the forearms | none needed | pass |
| All 11 | Seeds 620 to 630, one each; all `flip: true` with `kit.foeBase` light; groundY = h - 30 | none needed | pass |
| All 11 | No lightning arcs or bolts drawn: `bolt` and `sparks` are not called anywhere in the batch; every strike is an engine effect | none needed | pass |
| All 11 | Palette: red only on the gibbet plaque's rubric lettering and the petrel's broken wing (blood). Removed: the Strand-Wife's red wind-burn capillaries and cheek flush, and the Ship-Breaker's red cheek flush (now muted mauve-brown). Gold: none. The cow's, stern and belt lanterns were lamp-yellow with a large gold bloom; the octopus's eyes and the petrels' webs were lamp-ochre and read as gold | `paleLamp`; octopus eyes bone-grey with bar pupils; petrel webs dark grey | pass |
| All 11 | Eye motifs: none (VI is not a void world). Staring white eyes removed from the gunners, the rail sailors, the Gibbeted Wrecker and the dragged corpse (heavy lids, filmed eyes) | `squint`/lids | pass |

### Gate 2 (independent): style and detail

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| Wind-Seller (callout 1) | The great shawl was still the broadest single tone and softened to a flat grey shape at sheet size | value breakup: the wool wrapping round and under the hump in crosshatched shadow; seven heavy wet folds curving with the hump, of different lengths, each a tapering dark valley, a soft shadowed slope and a lit ridge; the hem soaked dark with the wet wicking up it unevenly in streaks, a wet sheen along it; the near shoulder and upper arm now under a drape of the same wool (on the torso bone) hanging in plumb folds to a torn, dripping edge, so the sleeve no longer sits on the body as a box; the disc highlights that read as stuck-on circles removed | pass: beside the Drowned King at 0.3x the shawl reads as hump, folds and soaked hem, and she holds up as a ruler (bent figure, hair fan, cord, stack) |
| Wind-Seller | The cord above her fists was a straight rod and read as a staff | a rope bellied in the gale, thinner, with hemp fibres standing off it; the knots tied above are overhand knots with their tails blown out | pass |
| Wind-Seller | Hands and feet shadowed in violet read as mittens | warm dark shadow on hands and feet | pass |
| Lantern Cow (callout 2) | Lightest mass on the 19-sheet (mean luminance 69, p75 85; the others 50 to 64 apart from the first batch's harpies, eel and whale) | hide re-toned to wet grey-brown (#4a453e), its light, shadow, coat-hair, ribs, mottle, highlights, muzzle, udder and wet lower legs to match | pass: mean luminance 69.3 to 60.2 (p75 84.9 to 69.9), now in the band of the Strand-Wife (56) and Wind-Seller (59) and below the first batch's eel (75); on `sheet19.png` she no longer stands out |
| Lantern Cow (callout 2) | Lantern glow a large gold bloom | `paleLamp`: warm pale yellow, small | pass |
| Last Prize (callout 3) | Rail sailors: bald grey domes with round staring eyes and a bare striped barrel; at game size mannequins | each now in a sodden wool jacket over the striped shirt (stripes wrap the belly), horn buttons, a lit front edge, a crosshatched back; a knitted sailor's cap with a rolled brim; heavy swollen lids over filmed eyes, the bag under them, blue lips, a cheek hollow; wet hair hanging plumb from under the cap; kelp off the back of the cap, clear of the face; a neckerchief. The gunners got caps and lids too | pass at game size (2x crop): three drowned sailors in caps, not mannequins |
| Last Prize (callout 3) | Figurehead read as a bust on a log | re-carved: the figure scaled up and leaned out along the stem with her back arched, the gown carved in folds running down into the scroll, the breast carved proud with a lit upper curve, the arms crossed in relief with carved fingers, three heavy carved locks down her back, a fillet across the brow, the head smaller in proportion (a woman, not a bust) and inside the frame; the split narrower and wavering | pass: at game size she reads as a carved woman leaning off the bow; at 1x the face, crossed arms and breast read |
| Gibbeted Wrecker (callout 4) | Trouser legs even-width tubes | knee bulge, creases behind the knee, a lit front edge, a soaked dark lower band | pass |
| Strand-Wife (callout 4) | Hair clumps of one width fanned at even angles (reads as a comb); the jaw's cool shadow read as a man's stubble; the coat hem a row of even scallops; the corpse's head stared and its hair was kelp bars | clumps of uneven width (24 to 54 px) and length, drawn in mixed order, with strands of different length; the jaw shadow warmed; the coat hem torn into seeded strips with threads and drips; the corpse's eyes lidded and wet hair hanging plumb from the lolling skull | pass |
| Ship-Breaker (callout 4) | Head, hands, knee, boots pass at 2x; only the crowbar's gold burn failed (Gate 1) | as above | pass |
| Rock Octopus (callout 4) | Mantle a smooth egg; eyes lamp-ochre discs | mantle redrawn as a heavy pendulous bag hanging to the back, lumpy outline, two deep sag folds with lit ridges, clustered warts, the hanging underside crosshatched; eyes bone-grey with bar pupils under heavy lids | pass |
| Storm Petrels (callout 4) | Feet webs ochre (read as gold) | dark grey webs | pass |
| Drowned Drummer (callout 4) | Padded jacket a flat slab; the trouser hem a rolled tyre over the shin | quilted channels wrapping the chest (seam valleys with stitching, lit rolls, cross seams, a crosshatched back); the canvas torn off at mid-calf in uneven strips with threads | pass |
| Cragsman (callout 4) | Crest floating (Gate 1); hands, pole, basket, feet pass | as above | pass |
| Drowned Merchant (callout 4) | Bald crown an egg; fur trim a row of identical teeth | swollen folds across the brow with lit edges, shadow toward the back of the skull, wet hanks plastered round the back; fur trim uneven (kit change) | pass |
| All 11 | Silhouettes against the first batch (`sil.png`): no shared silhouette; the cow's lantern now sits between lyre horns; the Wind-Seller's bellied cord reads as rope, not a second staff | none further | pass |

### Still short after this pass
- Strand-Wife: the dragged corpse's body is still a smooth striped tube with even-width limbs; it reads at game size
  but fails the anatomy bar at 2x. It needs a rebuild (bloated torso with the belly through the shirt, knees, a heavy
  slack arm), which this pass did not do.
- Wind-Seller: her face is fine at 1x; at 0.3x beside the Drowned King she is the weaker ruler (fewer readable layers
  in the lower body; the skirts are still mostly dark, though no longer flat).
- Last Prize: the sailors' faces now read at game size only as "capped heads with dark eyes"; the figurehead reads as a
  woman but is small against the hull.
- Rock Octopus: the raised arms' scorch is now dark; the hoard (coins, button, hinge) carries the colour.
- The first batch's Thunder Whale still has baked arcs (`arcs` layer); not this batch's file, left for the
  consistency pass as GUIDE 8 says.

### Holds that need IK in game
- Wind-Seller: the far hand on the cord (the cord rides `hand_n`); any arm animation needs both fists solved onto the rope.
- Drowned Merchant: the far hand on the box lid (the box rides `forearm_n`).
- Cragsman: the near hand fused to the rope (the rope is the root); arm animation needs IK onto it. The fowling pole is one-handed.
- Gibbeted Wrecker: both arms are on `torso` with the wrists fused to the bars; keep `torso` near rest or drive the hands onto the `cage` bars.
- Strand-Wife: the corpse follows `hook`; a big hook swing drags the corpse through the ground line, so clamp it or solve the corpse's heels to the ground.
- Last Prize: each rail sailor's fist rides `sailor_k_arm` with its pike welded to the rail; the drag-aboard reach swings the pike with the arm, which is fine for the reach but needs the weld released (or IK on the shaft) for a long pull.

## Ruler upgrade pass (2026-11-23)

Director's note: at 0.3x the Wind-Seller's lower skirts read as dark masses and the shawl is the broadest single tone;
break the skirts into layers with value, make the wet darkening and lit fold ridges read at sheet size, and lift her face
and hands to stand beside the Drowned King. Concept, palette, scale, canvas (1700 x 1900), key, seed (621), bones and
Motion line unchanged. Only `windSeller()` changed (plus a `require('./kit_III_b')` for the reviewed modelled fist).

| Area | Before | After |
|---|---|---|
| Skirts, value per layer | three layers of near-black (oilskin #22262a, shawl-dark, shawl) under a flat "soaked" rectangle at op 0.3 over half their height; at 0.3x one dark mass | each layer its own value: outer shawl skirt #6c6c66 (lightest), under-skirt #4a4a46, oilskin #262b2e with gloss streaks on every fold ridge. The outer skirt's hem was raised about 60 px so a full band of the under-skirt shows below it. At 0.3x the stack reads light, mid, dark from waist to hem |
| Skirts, folds | 5 px valleys with a 2.4 px lit line (gone at 0.3x) | `skFold`: a 13-15 px dark valley, a soft shadow slope, a 16-18 px soft lit slope and a 4-5 px lit ridge on the front side of each fold; the near knee is the brightest plane on the skirts, with lit pull-folds over it |
| Skirts, wet | one flat dark rectangle | `soak`: the hem soaked dark with the wet wicking up unevenly (two depths), streaks running up, and a glistening wet sheen along the wet line; each upper layer casts a shadow band onto the layer below |
| Skirts, layer read | none | a woven border on each shawl layer (two pale stripes on the outer skirt; a dark band with a pale thread on the under-skirt) that dips into each fold valley, so the layers separate and the cloth shows its form |
| Hems | `rag` made a sawtooth of identical points | each strip ends in a torn, squarish tip of its own width with two corners at different depths |
| Back of the skirts | flat dark | turned from the light with a light crosshatch (op 0.2 / 0.3), so it is shadow, not a hole |
| Shawl | broadest single tone (folds 2.4 px) | a woven border (a dark band between two pale threads) runs in from the hem and bends with the hump and the dragged point; the seven fold ridges now carry a broad lit slope and a 3-7 px ridge line |
| Face | about two thirds in hatched shadow (faceShade 0.85, jawShade 0.7, a dark temple plate); wrinkles were rows of 3.2-3.6 px parallel bars; the pursed mouth was a star of eight radial bars (read as an asterisk) | faceShade 0.72, jawShade 0.5; broad lit planes on the brow, cheekbone, nose bridge, upper lip and chin; core shadow only in the temple, socket and under the cheekbone; a lit brow ridge; every crease a fold (dark line with a lit lip), following the skull and of different lengths (bags, a crow's-feet fan from the outer corner, three curved brow furrows, glabella, nasolabial, gaunt cheek creases, marionette line); the mouth a pucker pushed forward round a small hole, with short creases drawn in toward it; the face's scar ferns slightly smaller so they do not cross the eye |
| Hands | `B.grip` blocks, mauve, read as mittens at 2x | `gripK` (the reviewed `knuckleFist` from kit_III_b): bony knuckle heads with valleys, tendons fanning to the wrist, creased middle knuckles, tucked fingertips with nails, a two-segment thumb with its nail; warmer skin with warm shadow; same grip angles (no warning) |

Checks: rendered and looked at 1x, 1.6x on the skirts, face and fists, at 0.3x beside the Drowned King and on
`sheet.png`. Rig re-exported (25 layers, 19 bones, no MISSING JOINTS, ground 1870 = canvas h - 30). Pose test
(knot untied: torso 8, near arm -20/-10, far arm 10/14, head -6, hair -4) attached, `out/worlds/VI_b/wind_seller_pose.png`.
`sheet.png`, `sheet19.png` and `sil.png` rebuilt with the maker's `wVI_b/sheets.py`.

Before/after: at 0.3x she was a pale head and hands over a dark column; she now reads as a lit face, knuckled fists, a
banded shawl over the hump and three skirts stepping from light to dark to the soaked hem. She now holds up beside the
Drowned King at sheet size. Left: the oilskin coat's back drape behind the hip is still a dark vertical (it is the
shadow side of the coat), and the shawl's fold ridges and border cross into a loose check at 1x, which reads as woven
wool rather than as noise.

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Strand-Wife | corpse a smooth striped tube | rebuilt as a drowned body: a torso modelled in its own frame (back on the sand, the bloated belly domed up with marbling, stretch marks and a pushed-out navel, the costal arch, sand caked on the flank, skin folds at the hips), the striped shirt rucked up by the hook with stripes running round the body and tension folds pulled from the collar, a rolled hem and a tear; the near arm flopped back with a sleeve bunched at the elbow and a tapering bare forearm; the legs bound in a torn sailcloth shroud with spiral winding, four rope turns, wet stains and torn strips dragging, two bare swollen feet with toes and puckered soles. The old corpse code still runs into a discarded buffer so the random stream, and therefore the whole Strand-Wife, is unchanged; the new corpse uses its own stream | full size and 0.3x: pass; the forearm is still the plainest part |

Bones unchanged (`corpse`, `corpse_legs`); rig re-exported. Sheet, sheet19 and sil rebuilt (`wVI_b/sheets.py`).
