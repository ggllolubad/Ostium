# World V, The Storm Foundry, second batch: review

Figures (seed 520 + index in the bible's order): The Crucible (520, ruler), The Storm-Catcher (521, ruler), The
Wire-Drawer (522, elite), The Dray Horse (523, elite), Salamander (524), Mould-Sitter (525), Coke-Heaver (526, large),
Nail-Wife (527), Guild Warden (528), Automaton Tender (529), Hearth Cat (530). File: `worlds/world_V_b.js`; new helpers in
`worlds/kit_V_b.js` (`CHAR`, `SOOT`, `charCracks`, `brickCracks`, `nail`, `bristle`, `wireCoil`, `clump`, `slab`, `clog`,
`lich`). `world_V.js` and `kit_V.js` are required, not edited. Every figure is built facing right with `kit_V.base`
(`kit.foeBase`) and `flip: true`; `groundY` = canvas h - 30 on every figure.

Method: each figure was rendered alone, composited on a mid-dark ground, read at 2x to 4x on the head, hands, held
objects and feet, and at game size (`out/worlds/V_b/sil.png`, 190 px per human). The whole batch was re-rendered at the
end in one pass: no grip warnings, and all eleven rig exports report no `MISSING JOINTS`. "Fixed" means the item failed
during the build, was changed, and passes on the re-render.

Deliverables: renders `out/worlds/world_V_b_<key>.png` and `_sil.png`; rigs `out/rig/worlds/world_V_b_<key>/`; attack
pose tests `out/worlds/V_b/<key>_pose.png`; `out/worlds/V_b/sheet.png` (the 11 at true relative scale with the Drowned
Thrall), `sheet19.png` (all 19 World V creatures, the first 8 from their existing renders), `sil.png` (all 19 at game size).

**Canvas sizes (GUIDE 2, ruling of 2026-11-23, true size wins).** The Storm-Catcher is drawn at true 3.5 scale (head
350 px) on a heightened 1800 x 2600 canvas instead of being shrunk into 1600 x 1600. Every other figure fits its tier
canvas at true scale. The Crucible keeps 1600 x 1600 and is cropped by the frame exactly as its entry says (crane, hook
and chains run out of the top; the pot fills the top half).

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: one spine or body chain), 2 objects face their user and gaze, 3 grips
and hands, 4 weight and balance, 5 contact and attachment, 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Crucible | pass | n/a | fixed | pass | fixed | pass |
| The Storm-Catcher | pass | pass | fixed | pass | pass | pass |
| The Wire-Drawer | pass | pass | pass | fixed | fixed | pass |
| The Dray Horse | fixed | pass | n/a | fixed | pass | pass |
| Salamander | pass | n/a | n/a | pass | fixed | pass |
| Mould-Sitter | pass | n/a | n/a | fixed | pass | pass |
| Coke-Heaver | fixed | n/a | pass | pass | fixed | pass |
| Nail-Wife | pass | pass | pass | pass | pass | pass |
| Guild Warden | pass | pass | pass | pass | fixed | pass |
| Automaton Tender | pass | pass | pass | pass | fixed | pass |
| Hearth Cat | pass | n/a | n/a | pass | fixed | pass |

### Measurements behind the passes
- Heads (skull centre ahead of the neck base): Warden 5 px, Tender 4 px, Nail-Wife 18 px (0.27 head widths),
  Mould-Sitter 14 px, Wire-Drawer 54 px (0.37), Storm-Catcher 68 px (0.28, tilted back), Coke-Heaver 54 px (0.59, the
  hunch is in the upper back, see the fix below). Pourers hang with the head slumped between the arms.
- Grips: every gripping fist goes through `B.grip` (no typed angles). Forearm to object, degrees off square: Warden
  near 29 / far 11 (vertical rod); Tender key 13, can 31; Nail-Wife hammer 19; Coke-Heaver near 4 / far 12 (haft at -18
  degrees); Wire-Drawer near 24 / far 31 (reins at 45 degrees); Storm-Catcher near 7 / far 3 (cables converging on the
  spire head); pourers 18 (bar at -18 degrees, arms hanging plumb).
- Gaze: the Warden looks down his nose over the rod (held, not studied). The Tender and Nail-Wife look at their foe.
  The Wire-Drawer looks at his target, not the wire: he hauls by feel, so no object is studied. The Coke-Heaver's eyes
  are squeezed shut, the Storm-Catcher's burned blank and turned up the cables.
- Weight: Warden even and stiff; Tender sunk on the back foot; Nail-Wife on the straight far (clean) leg with the
  bristling arm held out as a counterweight; Coke-Heaver forward over the bent front foot under the basket; Wire-Drawer
  leaning back against the taut wire (the haul balances him); Storm-Catcher braced back against the cables; horse on
  the crouched hind quarters with the hooves under the hip joint.

### What failed and how it was fixed
- Crucible 3: the pourers' fists were set with a typed angle. Now `B.grip` on the bar; that warned 52 degrees off
  square because the bar ran at -39 degrees under plumb arms. The bar's free end was raised (slope now -18 degrees).
- Crucible 5: the trunnions sat on the pot's left and right silhouette, which would tip the lip toward the viewer, not
  toward the company. The near trunnion is now a riveted boss on the pot's face (the tipping axis runs into the
  picture), and the fused chains rise from its bail in front of the pot, out of frame.
- Storm-Catcher 3: the first build ran vertical cables along raised forearms (64 and 74 degrees off square). The arms
  were opened into a wide V and the cables converge up out of frame on the spire's head; 7 and 3 degrees.
- Wire-Drawer 4/5: the first pose stood upright with an even stance and the tongs held level; the lean is now 21
  degrees with the front foot braced, the tongs and the live wire running forward and down at 45 degrees. The near
  coil hung behind the arm and read as a pack; it is now slung over the shoulder on the outside of the arm.
- Dray Horse 1/4: the first build was a tall seahorse body on human-looking hind legs with stub forelegs. Rebuilt from
  a measured standing Shire skeleton (withers 1.8 m, body 1.9 m, head 0.7 m) with the forehand rotated 40 degrees up
  about the hip joint: thigh inside the croup, stifle at the flank's foot, gaskin back to the hock, hooves under the
  hip; forelegs folded at the knee.
- Coke-Heaver 1: the head sat a head-width ahead of the neck on a long horizontal neck. The spine now hunches in the
  upper back under the basket and the head hangs from the front of the hump. 5: the basket floated clear of the back;
  it now rests on the lower back with the burned-through patch where they meet, straps over a pad on the shoulder.
- Mould-Sitter 4: the feet were 16 px pads crushed under the plinth; the ankles were raised so bare bronze feet stand
  on the plinth and are welded to it.
- Salamander 5: the iron filings stood in a row above the back; they now rise from the back's surface. The bent nail
  was hidden under the body; it now lies between the forefeet.
- Warden, Tender 5: Lichtenberg burns ran off the skin into the air (unclipped). New `kit_V_b.lich` clips every burn to
  the part it is burned into; all burns on skin use it.
- Hearth Cat 5: the collar ran along the neck like a horn; it now crosses the neck square to it, with the bell hanging
  from its lowest point.

## Gate 2: style and detail

Columns: signature at 190 px; course marks (fire dominant: char, split seams, glowing cracks; lightning second:
branching burns, fused metal and joints, standing hair; no arcs or bolts on any figure) with the Never column absent;
secondary detail count (cast 6, elite 10, ruler 12); three or more layers; palette; silhouette unique among all 19;
section 9 (former self readable, one course mark pushed, outline broken the course's way, hair with structure).

| Figure | Signature at 190 px | Fire / lightning, Never absent | Details | Layers | Palette | Unique | Section 9 |
|---|---|---|---|---|---|---|---|
| The Crucible | pass | pass | 17 | pass | pass | pass | pass |
| The Storm-Catcher | pass | fixed | 18 | pass | pass | pass | fixed |
| The Wire-Drawer | fixed | pass | 15 | pass | pass | pass | pass |
| The Dray Horse | fixed | fixed | 15 | pass | pass | pass | pass |
| Salamander | pass | pass | 9 | n/a | pass | pass | pass |
| Mould-Sitter | pass | pass | 10 | pass | fixed | pass | fixed |
| Coke-Heaver | pass | pass | 9 | pass | pass | pass | fixed |
| Nail-Wife | pass | pass | 10 | pass | pass | pass | fixed |
| Guild Warden | pass | pass | 13 | pass | pass | pass | fixed |
| Automaton Tender | pass | pass | 11 | pass | pass | pass | fixed |
| Hearth Cat | pass | pass | 7 | n/a | pass | pass | fixed |

### Section 9 line (which course did this, to whom, and does the bible say so?)
- Former self kept: the Crucible's guild mark, chalk tally and skimming rod; the Storm-Catcher's guild coat, chain,
  tool belt, dividers, plumb bob, rule and drawings; the Wire-Drawer's draw-plate, tongs and spools; the Dray Horse's
  collar, hames, blinkers, brand and sledge shaft; the Mould-Sitter's work shirt in a crack and the maker's stamp; the
  Heaver's basket and shovel; the Nail-Wife's header, apron and bucket; the Warden's yard, chain, weights and ledger;
  the Tender's crank key and oil can; the cat's collar and bell; the salamander's guild nail.
- One mark pushed, each named by the bible: the Crucible's welded rigid chains; the Storm-Catcher's brick-cracked body
  and cables fused under the skin; the Wire-Drawer's wire welded into his shoulders; the horse's shoes fused up into
  the hooves; the salamander's blotches burning like coals; the Mould-Sitter fused into his mould; the Heaver's back
  burned through by the coke; the Nail-Wife's welded nails; the Warden's chain sunk into the chest; the Tender's can
  fused into the hand; the cat's static halo.
- Outlines broken by fire (charred, curled hems with an ember in each curl on every cloth edge) and lightning (standing
  hair and fur, fused welds); no Bloodborne-only motifs (no beasthood, no eye motifs, no added rim light).
- Fixed: hair drawn as parallel spikes (Warden, Coke-Heaver, Storm-Catcher, Nail-Wife, Tender, cat) became clumped,
  kinked locks with singed tips over a hair mass; the Mould-Sitter's shell had no anatomy, so chest, thigh and fists
  now break open on sculpted bronze.

### Detail inventories
- Crucible: fused rigid chains with white-gold welds, trunnion boss and bail yoke, four riveted bands with fused
  rivets, scorch trees from every band, guild mark, chalk tally, wedged hammer, skimming rod hooked over the rim, slop
  over the lip, frozen drips down the side, steaming leather bucket on a chain, three pourers (welded gauntlets, rag
  aprons, standing hair, ferns up the arms, one clog lost), the clog in the pit, broken ladder with a snapped rung,
  runner cup, the bell's crown. Layers: clay, iron bands, chains; pourers: skin, apron, gauntlets.
- Storm-Catcher: coat charred below the waist, burnt-through holes, guild chain fused in, notebook on a cord, tube of
  drawings, tool belt, dividers, plumb bob, folding rule, ring of keys, seal ring, two cable clamps with bolt lugs,
  glazed insulators, copper wire wound on the arm, cables under the skin, burst boot, footing plate with fused
  rivets, split weathervane, spire lattice. Layers: skin, breeches, coat, belt.
- Wire-Drawer: three coils (one sprung), trailing end, end fused into the back, wire bands welded on shoulder and arm,
  draw-plate with graded holes on a chain, tongs with locking ring, burst gauntlet with shining skin, waist apron burned
  through, belt of spools, tallow pot, guild badge, wire brace on the knee, iron-shod clogs, goggles with a cracked
  glass. Layers: skin, apron, leggings, gauntlets, coils.
- Dray Horse: collar burst with straw, hames with fused knobs, bell, broken traces with a sheared link, sledge shaft
  with its loop, saddle cloth with a burn hole, girth chain, nosebag, bridle with a torn blinker, brow medallion, bit
  ring and broken rein, guild brand, wire-bound split hoof, fused shoes, singed feather, burn welt over the eye.
- Salamander: bronze tail bead and drag line, standing filings, shed skin on a hind leg, solder drop on a forefoot,
  missing toe, glowing throat split, scorched tail notch, the guild nail, soot belly crust.
- Mould-Sitter: pour cup with a set bronze drip and a warm bead on the brow, five vent rods, two wax runners, parting
  flange, iron bands, twisted wire, the work shirt in a crack, plinth with sprue stub and maker's stamp, welded feet.
- Coke-Heaver: smouldering coke heap, charred wicker with the hole burned through, rope straps over a leather pad,
  burned smock holes, cord-bound leggings, clogs, water skin, the rag under the chin, scorched shovel with a nicked edge.
- Nail-Wife: welded nails on arm, hand and flank, nails in the mouth, rag over the nose, scorched cap, shawl pinned
  with a nail, apron pocket of nails, header on a cord, kilted swag, clogs, bucket of nails with spilled nails.
- Guild Warden: stamped yard with end caps and stamps, chain plates cast with hammers, spectacles on a cord, pouch of
  nested cup-weights, touchstone pouch with a test streak, seal matrix, ledger on a chain (burned through), flat cap
  fused to the scalp, slashed sleeves, horn buttons, belt buckle, a darn, a signet ring.
- Automaton Tender: crank key (socket, T-handle with wooden grips), oil can with dent and oil run, rags in the pocket,
  tool roll of spanners, ring of winding keys, scorched headscarf, wrist bandage, darn, clogs, oil drip on the floor.
- Hearth Cat: collar, bell with the clapper fused, ear notch, whisker stubs, scorched pads, soot smear, apron string on
  a hind leg, charred tail tip.

## Rig and pose tests

| Figure | Bones | Attack pose tested (`out/worlds/V_b/<key>_pose.png`) | Result |
|---|---|---|---|
| The Crucible | 12: swing, chains, pot, pour, bar, bucket, pourer_1..3, legs_1..3 | the pot tips further, the hang swings, legs dangle | holds |
| The Storm-Catcher | 20: humanoid + jaw, cable_n, cable_f, coat, tube | the heave: both arms drive down, torso back | holds |
| The Wire-Drawer | 21: humanoid + tongs, wire, coil_n, coil_f, trail, apron | whip forward | holds |
| The Dray Horse | 21: spine_1/2, neck, head, jaw, tail, mane, shaft, traces, 12 leg bones | crash of the forehooves | holds |
| Salamander | 15: spine_1/2, head, jaw, tail_1..3, 8 leg bones | darting bite | holds |
| Mould-Sitter | 18: humanoid + funnel, vents, base | the near arm off the hip into a stiff overhead blow | holds |
| Coke-Heaver | 18: humanoid + shovel, basket, waterskin | shovel swing up and forward | holds |
| Nail-Wife | 19: humanoid + hammer, skirt, apron, header | the bristling arm sweeps forward | holds |
| Guild Warden | 18: humanoid + rod, skirt, ledger | the rap of the rod | holds |
| Automaton Tender | 20: humanoid + key, can, skirt, apron, keys | the key swung off the shoulder | holds |
| Hearth Cat | 19: spine_1/2, neck, head, jaw, tail_1/2, 12 leg bones | spitting leap | holds |

No export reported `MISSING JOINTS`.

## Holds that need IK
- Guild Warden: the near (low) hand on the rod (the rod rides on `hand_f`).
- Coke-Heaver: the near hand on the shovel's haft end (the shovel rides on `hand_f`); it leaves the haft in a big swing.
- The Wire-Drawer: the near hand on the reins (the tongs ride on `hand_f`).
- The Crucible's pourers need none: each pourer's pivot is its welded hands on the bar.

## Still open
- The Storm-Catcher's crown is not at the frame's top as the entry says: on a true-scale canvas the fists and the
  insulators above them (both named in the entry, the fists being the signature) rise above the head, so the frame cuts
  the cables and the spire instead. The director should confirm this reading.
- The Crucible at 1600 x 1600 follows its entry's framing; with the new true-size ruling the director may prefer a
  taller canvas so the pot reads as "the size of a house" (now about 2.6 m across at the game's scale).
- FX-like parts that must be redrawn or swapped per frame rather than only rotated: the Crucible's pour, the
  Wire-Drawer's live wire, the Storm-Catcher's cables (they rotate with the fists in the heave).
- The Mould-Sitter's wax runners sit on the arm bones, so they turn with the arm instead of hanging plumb; they need
  their own bones or a per-frame correction.
- Weakest areas for another pass: the Dray Horse's barrel and croup are still one large dark mass with little
  modelling; the Wire-Drawer's leggings read as plain tubes; the Hearth Cat's legs are simplified; the salamander's legs
  are thin at game size; the Storm-Catcher's thighs (burnt breeches) are the plainest area on the ruler.
- The second batch is darker and sootier than the first eight (the entries ask for blackened, charred bodies); on
  `sheet19.png` the two halves read as one world, but the bronze figures of the first batch are warmer.

## Independent review (2026-11-23)

Reviewer: a second agent, judging the batch fresh against GUIDE.md sections 2, 8 and 9, LOGIC_CHECKLIST.md, bible 00, the
world V bible, `world_V_REVIEW.md` (first batch and the Cyclops second pass) and the reviewed references: the Anvil Titan
and Cyclops Smith (giant anatomy, plates over a body), the Drowned King (ruler bar), the Magma Hound and Plague Wolf
(quadruped anatomy), dirAC and dirAC2. Every figure was rendered alone, composited on a mid-dark ground and read at 1x to
3x on the head, hands, feet and held objects, then at sheet size. Every fail below was fixed and re-checked on the
re-render; no grip warnings print; every changed figure's rig was re-exported (no `MISSING JOINTS`, groundY = canvas h
- 30 in every rig.json) and its attack pose re-tested into `out/worlds/V_b/<key>_pose.png`.

**Director's rulings recorded.** (1) The Storm-Catcher may be cropped through the cables and the spire instead of at the
crown; true size wins. The rebuild keeps the 1800 x 2600 canvas at 3.5 scale (head unit 350 px): the frame cuts the
cables above the insulators and the spire; the crown, both fists and the insulators are in frame. (2) The Crucible may
have a taller or wider canvas to read the size of a house: it is now 2300 x 2200 (groundY 2170, same pixel scale). The
pot is about 1030 px long and 1160 px across (about 2.8 m by 3.2 m at 640 px per 1.75 m), the pourers hang at true human
scale beside it, and the crane chains and the pot's crown are cropped by the top edge.

**New shared-in-world helpers** (`worlds/kit_V_b.js`): `fernSkin` (a Lichtenberg scar on dark hide or charred skin: a
pale raised edge round a burnt core, no halo, an optional white-gold fused thread at the root) and `bake` (re-poses a
finished figure the way posetest.py poses its rig, wrapping each element in nested rotate groups and moving every joint
pivot, so a posture change keeps parts whole and the rig consistent).

### What was changed, per figure

- **Dray Horse: rebuilt.** A standing Shire trunk in body units (withers, a dipped back, round croup, deep hanging
  barrel, shoulder, chest) turned 41 degrees up about the hip joint. Hind legs: the near haunch and thigh as one heavy
  mass from the croup to the stifle, the gaskin, an Achilles cord to a projecting point of hock, a flat cannon with its
  tendon, a dropped fetlock. Forelegs folded: a muscular forearm tapering to a flat knee (accessory bone, chestnut), a
  hanging cannon, the fetlock flexed and the hoof curled with the sole to the rear. Long heavy head with a Roman nose,
  round jowl, facial crest, flared sooted nostril, upper lip curled off the teeth, the jaw dropped on its hinge, the near
  eye rolling white all round under a bony orbit, a burn welt from the brow (the strike that took the far eye), ears
  pinned. Heavy trapezoid hooves with growth rings and the iron shoe fused up into the horn (iron tongues, white-gold
  seam), one split and wire-bound. Feathered fetlocks and the mane, forelock and tail as clumped locks with strands
  parting at the tips, singed to curls, the mane standing stiff off the crest. Hide: coat streaks along the lie of the
  hair over bare burnt hide, glowing seams on the shoulder, flank and haunch, ferns climbing every leg from the shoes.
  Harness: a curved padded collar burst at the side, curved hames with bronze knobs welded into the crest, bell, trace
  chains with a sheared link, nosebag, saddle cloth, cart saddle with welded terrets, back band to the tug, girth chain,
  broken sledge shaft, bridle with the near blinker torn off, brow medallion, broken rein, the brand on the haunch.
- **Storm-Catcher: rebuilt.** A gaunt giant's frame: legs braced wide with bent knees, the trunk leaning back from the
  hips, a ribcage lifted by the raised arms, a sunk belly, lats stretched from the armpits, a corded neck. Arms raised in a
  V with real shoulders, elbows out (the olecranon showing), stringy biceps/triceps, flexor masses tapering to bony
  wrists; the forearms rise to the fists, which grip the cables square (forearm to cable 25 and 21 degrees off square,
  `B.grip`, no warning). Neither arm crosses the face: the near upper arm passes 150 px below the back of the skull, the
  far arm 90 px clear of the nose. Face: a long heavy head thrown back, jutting lit brow shelf, broken nose, starved cheek
  hollows, clenched masseter, the jaw locked open in a rictus with sooted teeth (one gone), lips burnt back; the eyes are
  burned blank as swollen scorched lids over a dull grey glaze in deep sockets (the cartoon dot eyes are gone); hair and
  beard as clumped standing wire with glowing or burnt tips. Skin crazed into hearth-brick cells, hotter and finer at the
  chest and wrists; ferns spreading down the forearms from where the cables enter the fists, up the legs from the feet,
  up the jaw. The coat follows the body: back panel with folds pulled up from the armpits, sleeves wrapping the upper arms
  with bunched folds and stitched seams, burnt off above the elbow; breeches over shaped thighs with folds, an outseam and
  a knee patch, burnt off at the knee.
- **Crucible: rebuilt.** The pot is a cast fireclay crucible with mass and curvature: a bellied profile, ellipse
  cross-sections so the four iron bands and the rolled lip curve round it, a rounded base turning away, a pouring spout
  at the lowest point of the rim, a trunnion boss with the bail pinned on it, scale scabs and flaking char above, a hot
  crack net low on the belly, slag runs hanging plumb from the rim, the inner wall lit by the melt with its skin sliding to
  the spout. The pour is a molten rope with a white-gold core, a crusted skin torn into plates, folds on its shadow edge,
  drips spinning off and falling from the spout. The pourers are hanging bodies: shoulders hauled up round the ears with
  bunched deltoids, near-straight arms with biceps/triceps, elbow points and lit forearm bones, V-shaped trunks with ribs
  arching to the front, lats, collarbones, a hollow belly, legs hanging plumb with kneecaps, calves and toes pointed down
  (one bare, its clog fallen by the ladder), gauntlets fused to the bar in black weld beads with a white-gold thread,
  heads slumped forward between the arms, aprons burnt to rags at the waist.
- **Cast postures (`V.bake`).** Guild Warden: leans back from the hips (torso -5), chin hoisted to peer down his nose
  (head -8). Automaton Tender: sunk back on the rear foot under the key (torso -6, head +5); face shade raised to 0.84 and
  the skin darkened. Nail-Wife: hunched over her work toward the hammer (torso +9, head -7), the bristling arm swung out
  and low behind as a counterweight, the hammer cocked higher. Mould-Sitter: caught mid-lurch, statue and casting base
  tipped 4 degrees forward on the base's front edge (the back of the plinth lifts 11 to 16 px).
- **Wire-Drawer leggings:** cylindrical shading (the thigh's and calf's backs in shadow, the quad lit), a kneecap
  pushing through worn bright, folds bunched behind the knee and slumped over the clogs with lit ridges, a pull from the
  hip, a thonged outseam, a stitched patch, burn pocks and scorch.

### Gate 1 (independent): logic audit

| Figure | Item | Result | Fix |
|---|---|---|---|
| Dray Horse | 1 spine/neck | fixed | One spine: trunk on a body frame about the hip joint, crested neck from the withers to the poll, head on the poll |
| Dray Horse | 3 jaw hinge | fixed | Jaw dropped 0.13 rad about its hinge at the cheek (was a loose strip) |
| Dray Horse | 4 weight | pass | Centre of mass at the girth (x 608); hind hooves at x 530 to 680 under it, hocks flexed |
| Dray Horse | 5 contact | fixed | Hames on the collar, knobs welded to the crest, traces from the hame hook, back band to the tug, shaft from the tug ring |
| Dray Horse | 6 facing/light | pass | Built right, flipped; rims on the up-right edges |
| Storm-Catcher | 1 head/spine | pass | Head thrown back on the neck over a trunk leaning 12 degrees back; skull centre 46 px behind the neck root, tilted back 41 degrees |
| Storm-Catcher | 3 grips | fixed | Forearms 25 / 21 degrees off square to the converging cables, `B.grip`, no warning |
| Storm-Catcher | 5 arm vs face | fixed | Raised arms clear the face (150 px and 90 px) |
| Storm-Catcher | 4 weight | pass | Braced wide stance, both knees bent, leaning back against the pull |
| Crucible | 3 grips | pass | Pourers' forearms plumb under a bar 4 degrees off level; `B.grip`, no warning |
| Crucible | 4 weight | fixed | Bodies hang plumb from the hands; legs plumb, toes down (were stiff dolls) |
| Crucible | 5 contact | fixed | Bail pinned on the trunnion and welded; pour leaves the spout at the rim's lowest point; bar socket riveted to the base band |
| Guild Warden, Tender, Nail-Wife, Mould-Sitter | 1-6 | pass | Baked postures keep grips (the held objects ride their hand bones); feet stay planted except the Mould-Sitter's deliberate lurch on the base's front edge |
| Wire-Drawer | 1-6 | pass | Leg geometry unchanged |
| Coke-Heaver, Salamander, Hearth Cat | 1-6 | pass | Checked, unchanged |

### Gate 2 (independent): style and detail

| Figure | Item | Result | Fix |
|---|---|---|---|
| Dray Horse | Toy / chess-knight read | fixed | Rebuilt on a horse's anatomy (see above); block head, boxy body and plank legs gone |
| Dray Horse | Feather, hooves, shoes, mane in clumps, burns from shoes, rolling eye, collar and traces | fixed | All present and readable at 2x and sheet size |
| Dray Horse | Detail count (10) | pass, 18 | collar with burst straw, hames, welded knobs, bell, trace chains, sheared link, nosebag, saddle cloth, cart saddle with terrets, back band and tug, girth chain, sledge shaft, bridle, torn blinker, medallion, broken rein, brand, wire-bound split hoof |
| Storm-Catcher | Ruler bar (boxy body, owl head, dot eyes) | fixed | Giant anatomy, weighted face, no glowing dot eyes (see above) |
| Storm-Catcher | Course marks | pass | Hearth-brick cracks (fire), ferns from the cable entries and feet, standing singed hair and beard, cables under the skin (lightning) |
| Storm-Catcher | Detail count (12) | pass, 18 | coat, guild chain fused in, notebook, tube of drawings, tool belt, dividers, plumb bob, folding rule, keys, seal ring, two clamps, insulators, copper wire, burst boot, footing plate, weathervane, breeches patch |
| Crucible | Pot (octagon of plates) | fixed | Curved cast crucible with lip, spout, trunnion, bands, scale, cracks, slag runs |
| Crucible | Pour (glowing tube) | fixed | Molten rope with crust, folds and drips |
| Crucible | Pourers (stick dolls) | fixed | Hanging anatomy (see above) |
| Crucible | Detail count (12) | pass, 19 | fused chains and bail, trunnion boss, four bands with fused rivets, welds, guild mark, chalk tally, wedged hammer, skimming rod, slag runs, spout, steaming bucket, three pourers, fallen clog, ladder with a snapped rung, runner cup, bell crown |
| Guild Warden | Posture tells trade / face | fixed / pass | Pompous back-lean and hoisted chin; face shade 0.8 |
| Automaton Tender | Posture / face | fixed | Back-foot lean under the key; face shade 0.7 to 0.84, skin darkened (was pale and flat) |
| Nail-Wife | Posture / face | fixed / pass | Hunched to the hammer, bristling arm out as a counterweight; face 0.78 behind the rag |
| Mould-Sitter | Posture / face | fixed / pass | Stiff lurch dragging the base; bronze face 0.78 |
| Wire-Drawer | Leggings as plain tubes | fixed | Folds, wear and anatomy (see above) |
| Coke-Heaver, Salamander, Hearth Cat | Section 8 / 9 | pass | Checked at 2x and sheet size; unchanged |

### Rig and pose re-tests

| Figure | Bones | Pose tested | Result |
|---|---|---|---|
| Dray Horse | 21 | crash of the forehooves: spine_2 -14, neck -8, head 10, forelegs unfold (leg_fn 1/2/3 -35/50/20, leg_ff -30/45/15) | holds; a stray wedge of the forearm that the fetlock cut had claimed was found and fixed (each leg_3 region is now clipped to the knee's side too) |
| Storm-Catcher | 20 | heave: torso 5, both arms driven down 22/12, hands -20/20 | holds; the cables turn with the fists (FX swap, as before) |
| Crucible | 12 | pot tips -10, swing 3, legs dangle | holds |
| Guild Warden | 18 | rap: torso 5, both arms 22/10 forward | holds (near hand needs IK on the rod) |
| Automaton Tender | 20 | key off the shoulder: torso -8, upperarm_n -40, forearm_n -20 | holds |
| Nail-Wife | 19 | bristling arm sweep: torso -10, upperarm_n -50, forearm_n -15 | holds |
| Mould-Sitter | 18 | stiff overhead blow: upperarm_n -110, forearm_n -20 | holds |
| Wire-Drawer | 21 | whip: torso -8, arms -25/-30, -20 | holds |

`out/worlds/V_b/sheet.png`, `sheet19.png` and `sil.png` were rebuilt with the maker's composer in the same layout (the
Crucible now stands on ground 2170).

### Still open after the independent review
- Dray Horse: the near haunch belongs to `leg_hn_1` (so its thigh line is anatomical rather than a cut); large hind-leg
  rotations will move the croup's outline with the leg. The trunk's barrel between the girth and the flank is still the
  plainest area. The collar reads a little like a padded log at game size.
- Storm-Catcher: the face is still built on `B.head` with overlays; it carries weight now but is the least sculpted part
  next to the Cyclops. The cables are cut at the frame and rotate with the fists (FX swap).
- Crucible: at sheet size the pourers are small against the pot (true scale); their faces read only as slumped heads.
- Baked postures are rest-pose changes: the Warden's and Coke-Heaver's near hands still need IK onto their hafts.
- The Mould-Sitter's wax runners still turn with the arm (maker's item).

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Dray Horse | round white staring eye | a small dark almond eye set deep under the bony orbit: the heavy upper lid down over it, a thin crescent of white only at the back corner, a dull wet glint, the red-rimmed lower lid, the brow ridge overhanging it | 0.3x: no stare; pass |
| Dray Horse | barrel boxy | the belly now sags at the girth and tucks up to the flank, the back dips behind the withers, the chest front rounds, the haunch's front edge rounds over; ribs curve round the barrel, a lit ribcage swell and the shadow of the barrel turning under; girth strap lengthened to the new belly | pass at 0.3x; the trunk is still a big dark mass (the hide colour), less of a box |

Rig re-exported (21 bones). Sheet, sheet19 and sil rebuilt (`wV_b/sheet.py`).
