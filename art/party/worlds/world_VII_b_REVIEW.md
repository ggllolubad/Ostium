# World VII, The Icebound Fleet, second batch: review

Figures (seed 720 + index in the task's order): The Broadside (720, ruler), The Shrouds (721, ruler), The White Bear (722,
elite), The Ship's Surgeon (723, elite), Powder Monkey (724), Sea Lice (725), Capstan Gang (726), The Sailmaker (727),
Fleet Marine (728), The Galley Cook (729), Ice-Edge Orca (730). File `worlds/world_VII_b.js`; new helpers in
`worlds/kit_VII_b.js`. `world_VII.js` and `kit_VII.js` are required, not edited (kit_VII supplies `fx` with `rime`,
`icicle(s)`, `slab2`, `breath`, `glaze`, `livid`; `jointLimb`, `muscleBody`, `rope`, `openHand`, `fistDetail`, `space`).
Every figure is drawn facing right with `kit.foeBase` and `flip: true`; `groundY` = canvas h - 30 on every figure.

New in `kit_VII_b.js`:
- `sailor()`: one drowned seaman of the fleet built from joints at any scale and orientation (upright, pitched over a
  capstan bar, hanging head-down, mirrored to face -x). It draws far arm, far leg, near leg, torso, head, near arm in
  that order, rig-tags every part (bone prefix per man, pelvis parented to a given bone), and carries the world's marks
  (rime on shoulders and windward faces, plumb icicles from elbows, hems and chin, glazed drowned face, blue-black
  lips, lividity, frost-blackened finger and toe tips). Options for dress (striped / checked shirt, tarred jacket, cut
  trousers, gaiters, knitted cap, kerchief over the ears, queue), child head scale, hooks before and after each layer.
  Used for 17 men: gunners, boarder excluded (hand built), topmen, capstan men, fiddler, surgeon, sailmaker, marine,
  cook, powder monkey. A mirrored head (`headF`) is a copy of `body.js head()` that takes a frame, so a man can face -x
  without being rotated (the far capstan men, the upside-down topmen).
- `freeFoot()` (a bare foot in any orientation), `furFringe()` (wet fur frozen in plumb ropes with icicled tags),
  `furTex()` + `hairClump()` (wet locks), `louse()` (sea louse: segmented shell, 14 legs, antennae, uropods, gut line,
  a frozen variant), `rimeBroken()` (rime laid in drifts of uneven depth with gaps, instead of one even band),
  `clayPipe()`, `shirtPattern()`.
- `sailor()` washes `B.head`'s slightly warm ear and nose back to the drowned grey (this world has no warm colour).

Method: each figure was rendered alone, composited on a mid-dark ground, read at 1.5x to 4x on heads, hands, held
objects and feet, and at game size (`out/worlds/VII_b/sil.png`, 190 px per human). The batch was re-rendered at the end
in one pass: no grip warnings anywhere; all eleven rig exports report no `MISSING JOINTS`. A pixel scan finds at most
0.05% warm-saturated pixels per figure (texture noise, and the bear's claw torn to the quick, which is blood).

Deliverables: renders `out/worlds/world_VII_b_<key>.png` and `_sil.png`; rigs `out/rig/worlds/world_VII_b_<key>/`;
attack pose tests `out/worlds/VII_b/<key>_pose.png`; `out/worlds/VII_b/sheet.png` (the 11 at true relative scale with the
Drowned Thrall), `sheet19.png` (all 19 of World VII, the first 8 from their existing renders), `sil.png` (all 19 at game
size).

**Canvases (guide 2: true size wins, same pixel scale, groundY = h - 30).**

| Figure | Tier | Canvas | Measured |
|---|---|---|---|
| The Broadside | ruler 3.5 | 1800 x 1800 (heightened in the independent review; was 1600) | runs off the top and both sides; the frame holds the lower two gun tiers at true scale (gunners 640 px men) |
| The Shrouds | ruler 4.5 | 2000 x 1800 | runs off the top; topmen at true scale, more men's legs dangle in from above the frame |
| The White Bear | elite | 2300 x 1450 | 1.86 at the withers (bible 1.9), 3.0 nose to rump |
| The Ship's Surgeon | elite 1.9 | 1100 x 1400 | 1.9 body, 2.14 to the raised saw frame |
| Ice-Edge Orca | large | 1800 x 1100 | 1.41 at the fin (bible 1.4), 2.0 long with the tail stock under the water |
| Capstan Gang | large | 1700 x 1100 | 1.17 at the fiddler's head (bible 1.5, see Still open), 2.0 wide across the men |
| The Sailmaker | human 1.0 | 900 x 820 | 0.96 bent under the bundle |
| Fleet Marine | human 1.05 | 1000 x 820 | 1.0 at the charge, the musket and bayonet 1.9 m long |
| The Galley Cook | human 1.0 | 700 x 820 | 1.0 |
| Powder Monkey | small 0.6 | 600 x 820 | 0.58 leaning into the run |
| Sea Lice | small | 800 x 820 | 0.52 high, 1.0 long |

## Gate 1: logic audit (LOGIC_CHECKLIST.md)

Items: 1 head over neck and spine (non-humanoids: one spine or body chain), 2 objects face their user and gaze, 3 grips
and hands, 4 weight and balance, 5 contact, attachment and plumb hang, 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact/plumb | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Broadside | pass | pass | fixed | pass | fixed | pass |
| The Shrouds | pass | n/a | fixed | pass | pass | pass |
| The White Bear | fixed | n/a | n/a | pass | fixed | pass |
| The Ship's Surgeon | pass | pass | pass | pass | pass | pass |
| Powder Monkey | pass | n/a | pass | fixed | pass | pass |
| Sea Lice | n/a | n/a | n/a | pass | pass | pass |
| Capstan Gang | pass | fixed | fixed | pass | pass | pass |
| The Sailmaker | pass | pass | fixed | fixed | fixed | pass |
| Fleet Marine | pass | pass | fixed | fixed | pass | pass |
| The Galley Cook | pass | pass | fixed | pass | fixed | pass |
| Ice-Edge Orca | fixed | n/a | n/a | pass | pass | pass |

### Measurements behind the passes
- Heads: every man's head is carried on `N + up * 62` along his own spine tangent (child head 1.32x for the powder
  monkey), so stoops come from the spine curve: the surgeon's hunch is the upper back (C behind the N-P line), the
  sailmaker's is the bend under the bundle, the marine's is a 32 degree pitch of the whole trunk behind the musket.
- Grips: every gripping fist goes through `B.grip`; none prints a warning. Marine near fist square to the stock, far
  fist over the fore-stock with the elbow forward and out (27 degrees off square before the 35 limit). Cook: the
  cleaver held point-down in a reverse grip, forearm square to it. Sailmaker: needle in an inline thrusting grip (it
  runs on from the forearm like a dagger held out; the inline rule applies to blades); the near fist holds the lashing's
  tail square to its forearm. Surgeon: saw handle across the fist from a vertical forearm (hammer grip). Fiddler: bow
  10 degrees off square at the frog, fiddle neck in the far fist. Broadside gunners: rammer, linstock and sponge staffs
  across the fists. Topmen: ratlines and the yard across the fists from below (arms up) or above.
- Gaze: the gun captain looks down along his burst gun (head 0.5 rad); the cook looks down into his pot; the fiddler's
  head is cocked to the fiddle, eyes shut; the topmen's faces turn down toward the company; the marine and the
  sailmaker look along the musket and the needle at the heroes.
- Weight: marine driving off the bent rear leg, pelvis between wide feet; sailmaker on the bent front leg under the
  load; cook on the straight good leg, the peg planted wide in front; powder monkey over the front foot, rear foot in
  the air; surgeon on the forward foot; bear on three paws with the lifted near forepaw locked mid-stride, the belly
  sagging between; orca on its belly and braced flipper; capstan men's legs braced behind their pitched bodies.
- Plumb: every icicle, fur rope, hanging tag, the bear's drool cord, the sleeve in its jaws, lanyards, the bosun's
  chair, the tar spill, kelp streamers and torn net strands are drawn in screen space.

### What failed and how it was fixed
- Marine 4/3: the first pose stood upright behind a levelled musket (no charge). The spine is now pitched 32 degrees
  with both knees bent (IK). The far grip then warned 72 degrees off square; the far elbow now goes forward and out.
- Marine 6: a dark ear-and-hair shape behind the face read as an earmuff; removed (the clubbed queue hangs alone).
- Cook 3/5: the cleaver was drawn over the near arm and read as a tombstone held by nothing; it is now drawn before the
  near fist, shortened to a cleaver's proportions (blade 2:1, honed bevel, thick spine) and its tip rests in the broth.
- Cook 5: the belly read as a raised arm once the near arm crossed it; the torso profile now sags to its lowest at the
  belt (an explicit profile) and the apron is drawn under it, so the belly hangs over the apron string.
- Cook 5: the kettle hung at the canvas edge; the canvas is 700 wide and the far forearm reaches further forward.
- Sailmaker 4: the first pose was a lunge; the stride is shorter and the trunk bent under the load.
- Sailmaker 5: the bundle sat behind him; it now rests on top of the near shoulder (drawn after the arm) with the near
  fist redrawn over the lashing's tail. The head end is up behind him (round head, nose pucker, the last stitch) and
  the feet with the two round shot are at the front under his jaw.
- Sailmaker 3: the needle arm was folded with the elbow above the head; the hand is lower and further out.
- Powder monkey 4: the lifted rear foot pointed straight down and read as a peg; it now trails back with the sole up.
- Capstan 3: the pushers' fists warned 55 to 86 degrees off square on bars that run nearly along their own forearms.
  Capstan men push with palms and chest, so the hands are now open palms frozen flat on the bars.
- Capstan 2/3: the fiddler's bow arm crossed his face and hid the fiddle; he now holds it against his chest (a folk
  fiddler's hold), the bow level across the strings by the bridge, the elbow down.
- Broadside 3: gunner 1's far fist and gunner 4's fists warned; their elbows were re-solved to the other side.
- Broadside 5: the boarder on the ladder hung in front of the centre port and hid the burst gun; the ladder now hangs
  where the hull turns away.
- Bear 1: the skull sat on the neck with an ink seam round its back; a nape patch now carries the neck's fur over it.
- Bear 5: the near legs' top edges cut across the belly; the belly's fur ropes now hang over the leg tops.
- Orca 1: head, body and tail were three outlines with ink seams; they are one fusiform outline split between bones.

## Gate 2: style and detail

| Figure | Signature at 190 px | Course marks / Never | Grit (min) | Palette | Unique silhouette | Section 8 faults | Section 9 |
|---|---|---|---|---|---|---|---|
| The Broadside | pass: leaning wall, two rows of ports and muzzles | pass | 22 (12) | pass | pass | fixed | pass |
| The Shrouds | pass: slanting web hung with men | pass | 20 (12) | pass | pass | fixed | pass |
| The White Bear | pass: long low bear, head below the shoulders | pass | 14 (10) | pass (blood only) | pass | fixed | pass |
| The Ship's Surgeon | pass: bow saw raised over the stooped head and apron | pass | 15 (10) | pass | pass | fixed | pass |
| Powder Monkey | pass: small running figure hugging a cylinder | pass | 10 (6) | pass | pass | fixed | pass |
| Sea Lice | pass: long sewn bundle split, lice pouring out | pass | 9 (6) | pass | pass | fixed | pass |
| Capstan Gang | pass: drum with radiating leaning men, fiddler on top | pass | 12 (6) | pass | pass | fixed (open item below) | pass |
| The Sailmaker | pass: long sewn bundle across the shoulder | pass | 12 (6) | pass | pass (differs from the lice: carried, upright) | fixed | pass |
| Fleet Marine | pass: long levelled musket and bayonet | pass | 15 (6) | pass | pass (differs from the whaler's raised harpoon and deckhand's raised cutlass) | fixed | pass |
| The Galley Cook | pass: peg leg and kettle on the arm | pass | 14 (6) | pass | pass | fixed | pass |
| Ice-Edge Orca | pass: tall curled fin over open jaws at the ice edge | pass | 9 (6) | pass | pass | fixed | pass |

Course marks: frost dominant everywhere (rime drifts on windward +x and top faces, plumb icicles from sills, wales,
channels, ratlines, elbows, hems, chins and fur, bodies stopped mid-gesture: the cracked lifted paw, the saw arm locked,
the boy mid-stride, hair streaming back, the bow mid-stroke); water under it (glazed swollen faces, distended bellies,
lividity, wrinkled soles, barnacles and kelp on the hull, peeling orca skin, the bear's wet fur ropes). The Never column
is kept: no clean crystals or snowflakes; all ice is lumpy, dull and dirty-white. No warm colour: the surgeon's blood
is frozen black (#141012); the Broadside's guns are plugged with ice cores and one has burst open from it; no flame.
Section 9 (Bloodborne test, "which course did this, to whom, does the bible say so"): the former self stays readable on
every figure (gun crews' kerchiefs and rammers, topmen's tarred jackets, the surgeon's apron and instrument roll, the
cook's apron and kettle, the marine's cross-belts, the sailmaker's palm and needle, the boy's cartridge case); the one
pushed mark is frost's stopping (the locked limbs above) on water's swelling; outlines break the frost way (icicled
hems, fur tags and sills). No church or relic is invented (this world has none); nothing is beasthood or eyes.

### Grit, by figure
- Broadside: strakes swollen between the frames and split along the grain; trenails; rime rind thickest at the top;
  two wales with lit tops and cast shadows; port linings showing the hull's thickness; projecting sills; lids open
  (one hanging on a single hinge); five guns with reinforce rings, ice-plugged bores and tompions on cords; the burst
  centre gun peeled like a split reed; the channel with chain-plates, deadeyes, lanyards and shrouds rising out of frame;
  a stiff frozen boarding net; a broken harpoon in the wale with its line; three shot holes plugged with bungs; a rope
  entry ladder of battens with a boarder frozen halfway up it; the gun captain's linstock and clay pipe; a powder horn;
  a rammer and a sponge; an ice membrane between two ports; a fender of old cable; the name board half under rime;
  barnacles and kelp below the waterline; the waterline ice collar; pressure slabs.
- Shrouds: nine shrouds and ten ratlines furred white with comb-teeth icicles; the mainmast with iron hoops and
  wooldings; the lower yard with footrope and stirrups; the topsail furled into a frozen slab with gaskets; two men on
  the yard; one upside down by a caught foot with a stiff tarred queue; one hanging by an arm; one reaching; the lowest
  trailing his feet on the ice; legs dangling in from above; the attacker's marlinspike on its lanyard and sheath knife;
  the tar bucket and its frozen spill; a spyglass jammed in; a parted line in a frozen curl; a knitted cap snagged;
  frozen blocks; the empty bosun's chair; the channel with deadeyes and lanyards.
- White Bear: the broken harpoon in the near shoulder and its frozen line to the ice; the torn boarding net over the far
  shoulder with iced knots; the healed cutlass seam across the muzzle; the musket-ball lump; the claw broken to the
  quick; ice balls in the foot fur; the jacket sleeve hanging from the jaws; rake scars; sea-ice slabs welded to the
  hind feet; the frozen drool cord; bald wrinkled patches; the swollen grey tongue; blue-black lips and nose.
- Surgeon: bow saw with blood frozen black on blade and teeth; instrument roll with knives, nippers and trephine,
  buckled; screw tourniquet; chewed bite-stick on its cord; the rosary of frozen fingers on tarred twine; pewter bleeding
  bowl; corked spirit bottle; bandage roll; tallow candle stub on the bib; sawdust frozen to the shoes; knife nick on the
  far thumb; spectacles with one lens frosted; cut-off coat sleeves over rolled shirt sleeves.
- Powder Monkey: case of staves and three iron hoops with a rope handle; knitted cap to the brows; kerchief; rope belt
  with priming wire; knee patch; tin whistle on its string; frozen spray down the back; bruise; hair frozen streaming
  back; frozen breath.
- Sea Lice: two round shot at the foot; rows of stitches and the nose stitch puckering the canvas; the bare ankle bone in
  the split; the canvas name tag; frozen kelp; drips frozen on the seam; the windward lice frozen into a crust, some half
  stuck.
- Capstan Gang: whelps, pawl ring and four pawls; the torn deck collar with splinters and trenails; three turns of the
  frozen cable; its splayed chafed strands; a nipper rope; one bar snapped short; the tar bucket frozen to the drum;
  knitted caps, a kerchief, queues; striped and checked shirts; the fiddle's rime and the bow frozen mid-stroke.
- Sailmaker: the sailmaker's palm with its worn iron thimble plate; twine through the needle's eye; ball of tarred twine
  on a lanyard; wooden fid in the belt; beeswax on a cord; horn needle case; bench hook; knitted cap; the twine end in
  his lips; the beard frozen into one plate; pockets and tar smears on the apron.
- Marine: turned-back facings; pewter buttons with one missing (its thread left); leather stock; cross-belts with plate
  and frozen spray; cartridge box; wooden canteen; empty bayonet scabbard with chape; round hat with turned-up brim and
  rimed cockade; buttoned gaiters, one torn; queue; lock, ramrod, bands, sling; the barrel plugged with ice.
- Cook: peg leg with socket, straps and iron ring; bread-room keys; meat fork through the apron string; salt horn; cap;
  burn scar; frozen sweat beads; jowls and a broken nose; the ladle standing in frozen broth with a knuckle bone and a
  twist of sleeve in it; grease stains on the apron.
- Orca: rake scars; a notch bitten from the fin; boarding net on a tooth; barnacles at the jaw corner; ice crust on the
  flippers; frozen spray down the back; broken harpoon head behind the flipper; peeling skin sheets; the ice-plugged
  blowhole; sagging wrinkled belly folds.

### Style fails found and fixed (each re-rendered and checked zoomed)
- Bear: the first build was a box on slab legs with leaf-shaped light clumps and a comb of tooth-like fur tags. Rebuilt:
  an organic outline (rump as high as the withers, dip behind the hump, long neck, sagging belly), upper legs under the
  body, dense low-contrast wet locks, fur ropes that overlap with blunt clumped ends and fewer frozen points.
- Rime as a band: `kit_VII.rime` along long edges read as an even sticker outline, and a first `rimeBroken` fed it
  dense points and produced a sawtooth crown. `rimeBroken` now decimates the edge and lays drifts of uneven depth.
- Broadside: rime lumps on every strake read as a tiled roof; the rind is now a hoar bloom densest high up, with lumps on
  the upper strakes only. Lids were rounded blobs (now sharp planks with a thickness at the hinge). The pressure slabs
  were a repeating row (now ten slabs of different size and tilt).
- Shrouds and capstan men: jackets read as boxes; the jacket now has rounded shoulders, a back curving into the waist, a
  ragged frozen hem, a shadowed back and folds; the capstan men's chests are slimmer (0.78).
- Sea lice: the mound was a dome with a hard outline and the spill a slab; both are now lumpy edges of crawling lice over
  a dark seething mass. Lice read as pills; they now have long jointed legs, antennae, tail fans and segment lines.
- Faces: crosshatch on the lower face read as stubble on clean-shaven men; faces now take the shade without hatching
  (as Mother Hild), with face shading 0.72.

## Rig and pose tests (out/worlds/VII_b/<key>_pose.png; game view, + = clockwise)

| Figure | Bones / layers | Attack pose | Result |
|---|---|---|---|
| Broadside | 54 / 68 | gun_1 -4, gun_2 +3, gun_3 -5, lid_1 +12, lid_6 -14, g2_torso -4, g2_head -6 | closed; guns recoil in their ports, lids swing on their hinges |
| Shrouds | 112 / 138 | web -1.5, m7_pelvis +28, m7_upperarm_f/n +30, marlinspike +10 | closed; the attacker swings off his hold (the drop itself needs a translation key) |
| White Bear | 22 / 26 | spine_2 +3, neck -10, head -6, jaw -10, leg_fn_1/2/3 +20/+25/+10 | closed at neck, skull seam and leg joints |
| Surgeon | 19 / 28 | torso +6, upperarm_n -40, forearm_n -30 (the saw stroke) | closed |
| Powder Monkey | 18 / 24 | thigh_n -18, thigh_f +16, shin_n +10, torso +4 | closed |
| Sea Lice | 4 / 8 | swarm_1/2/3 +5/+10/+16 (the surge) | closed |
| Capstan Gang | 83 / 110 | drum +3, bar_1/2 -6, fd_upperarm_n +10, fd_forearm_n +12 | closed |
| Sailmaker | 18 / 25 | torso -6, upperarm_f +18, forearm_f +12, bundle +3 (the stab) | closed |
| Fleet Marine | 19 / 22 | torso -8, upperarm_n +8, forearm_n +2, thigh_n +10, thigh_f -8 | fixed: the first frame (upperarm_n -12) drove the bayonet into the ice; the arm now counters the torso pitch and the musket stays level |
| Galley Cook | 19 / 23 | upperarm_n +70, forearm_n +50 (the chop raised) | closed |
| Orca | 9 / 14 | body +3, head +8, jaw -12, tail -6, flipper_n +8 | closed |

## Still open
- Holds that need IK in the game: the marine's far hand on the fore-stock (the musket rides on hand_n); the powder
  monkey's far hand under the case; the sailmaker's near fist on the lashing (the bundle rides on the torso); the
  fiddler's bow on the strings (fiddle on fd_hand_f, bow on fd_hand_n); gunner 1's far hand on the rammer; gunner 4's two
  hands on the sponge; every topman's bonded hand on the web and the capstan men's frozen palms on their bars (when an
  arm moves, the hand leaves the line or bar).
- The Shrouds' attack (a drop and a haul back up) needs translation keys on m7_pelvis; posetest only rotates.
- Capstan Gang: the fiddler's head stands at 1.17, not the bible's 1.5. A man seated on a drumhead at bar height cannot
  reach 1.5 without a stool, so the logic was kept; the director may prefer a taller drum (bars sloping) or the fiddler
  standing. The pushers still read busy at game size (eight legs crossing round the drum), and their bodies are pitched
  about 34 degrees, not "nearly level", because the bars sit at chest height.
- The Broadside's silhouette is a solid wall at game size (its ports and muzzles read inside it, not on its edge);
  the upper tier is partly cropped by the frame top by design.
- The White Bear's hind lower legs are still the plainest shapes on him; the near hind gaskin reads a little like a
  column at 2x.
- Icicles drawn plumb in the rest pose rotate with their bones in attack frames (shared rig limitation).
- `sheet19.png` and `sil.png` labels for the two smallest neighbours (Galley Cook, Powder Monkey) touch at sil size.

## Independent review (2026-11-23)

Reviewed fresh against MAKER_BRIEF.md, GUIDE.md (sections 8 and 9), LOGIC_CHECKLIST.md, the design language, the World VII
bible, the first-batch review and the director's six callouts on `sheet.png`. References: the Drowned King (ruler bar),
world_VII.js (Walrus, Ice Eel, Selkie, Leviathan), the Last Prize, the Plague Wolf, and the passed second batches III_b,
IV_b and V_b. Method: each changed figure was rendered alone, composited on a mid-dark ground and read at 1x to 2x on heads,
hands, held objects and feet, then at sheet size and in silhouette at game size (190 px per human). Every changed figure was
re-rigged and pose-tested and the pose image was viewed. All 11 renders print no grip warning. All 11 rig exports report no
`MISSING JOINTS`, and their `rig.json` ground is canvas h - 30. A pixel scan finds 0% warm-saturated pixels on 10 figures
and 0.004% on the bear (the claw torn to the quick: blood). Seeds run 720 to 730, and every entry is `flip: true`.
Sheets rebuilt with the maker's composer (copied to scratch `rvVIIb/sheets.py`). It now uses the Broadside's new canvas,
and a label that would touch its neighbour drops to a second row with a leader line.

### What changed in the shared-in-batch helpers (`kit_VII_b.js`)
- `sailor()` takes `o.persona`: one man's own face (jaw, chin, nose and hook, squint, brow, age lines, gauntness, stubble,
  short beard or moustache, scar), build (chest, belly, arm, thigh, head), dress (cap, shirt, jacket colour, open or closed
  front, patch, missing button, neckcloth, earring), hair (`crop`, `swept` frozen back with icicles, `tufts`, a frayed grey
  horseshoe round a bald crown, or `long` wet hanks hung plumb), and frozen state (`mask`: spray frozen over the face with
  the eyes sealed white; `beard`: an icicle beard; `nose`, `brows`, `mouthIce`, `breath`).
- The jacket was a flat dark box. It now has sloped shoulders, a rounded upper back, the waist taken in, and a hem that
  kicks out and hangs in frozen points. The front opens on the shirt with a lit lapel and a pewter button row (or stays
  closed). It has a pocket flap, pull folds from the armpit with lit ridges, bunching at the small of the back, a shadowed
  back, worn-bright hem and seams, and salt tide-lines.
- `furFringe()` hung single cones with three lines (a comb of teeth). Each tag is now a hank of two or three locks fanned
  from one root, of different lengths, each tapered to a blunt clumped end or a frozen point, with its own strands. Roots
  sit at uneven heights, so a fringe never reads as a row. Only the bear uses it.

### Gate 1: logic audit (independent)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| The Broadside | 5: the boarder was a back-view box on tube legs with a plain oval head, on a ladder laid along the hull face | Rebuilt with `sailor()` (`b_` bones under `ladder`). The ladder hangs plumb from the rail at the bow; he hangs off it by the far hand on a batten and the near hand round the side rope, his body swung out past the stem, with a boarding axe in his belt | both grips square, no warning; pose closed |
| The Broadside | 3: the near grip on the ladder warned 88 deg, then 60 deg (forearm along the batten) | the near hand moved to the vertical side rope, thumb up | no warning |
| The Shrouds | 1/3: topman 5's raised near arm crossed his face | The far arm now does the reaching (up behind the head to the ratline above). The near hand holds a shroud at chest height, square to it (on a ratline it ran along the forearm, 60 deg off) | no warning; face clear at 1x |
| The Shrouds | 5: rime bonds were opaque white balls on the hands | lumpy translucent crust running on along the rope, knuckles showing, rime and icicles | read at 1x |
| The White Bear | 4: hind lower legs were even columns with a square top over the body and a lump for a foot | See gate 2. Hock angle kept (stifle forward, hock back over the heel); the plantigrade sole now lies flat on the ice from the heel to the toes, with the fur splayed where it presses | rest and pose read at 0.7x |
| The White Bear | rig: spine_2 +3 opened a dark wedge down the whole body (the overlap was only a 140 px disk at the top of a full-depth cut) | the spine_2 and neck regions now run 70 px past their cuts | pose closed |
| The White Bear | pose: the maker's +20/+25/+10 forepaw frame swung the paw up under the head (drawn later) | Pose test now shows the blow itself (leg_fn -10/-18/-14, paw driven onto the ice). The wind-up needs a z override | pose closed |
| Capstan Gang | 2/4: near and far men leaned opposite ways round the drum (eight legs splayed like a spider) | A capstan bar takes several men, and for one direction of turn every man on the near-side bars pushes the same way. So three men stand shoulder to shoulder on the near-left bar, with staggered pitch (upright at the back, nearly level at the front) and strides in step but not identical. The fourth leans on the snapped stub of the near-right bar. The far bars stand empty behind the drum. All four lean toward the heroes, which is also the attack (bars sweeping the front ranks) | palms on the bar, no warning; pose closed |
| Fleet Marine | eye-motif rule: the rimed cockade was a ringed disc with a centre dot | a crushed black ribbon bow (two loops, two tails) with an off-centre pewter loop button | 1.6x |
| Ice-Edge Orca | pose: the long pointed eye patch read as a spike when the head turned | plumper patch with a blunt front | pose closed |
| All others | heads over necks, gaze, grips, weight, plumb hang, facing and light rechecked | no change needed | pass |

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips | 4 Weight | 5 Contact/plumb | 6 Facing/light |
|---|---|---|---|---|---|---|
| The Broadside | pass | pass | fixed | pass | fixed | pass |
| The Shrouds | fixed | n/a | fixed | pass | fixed | pass |
| The White Bear | pass | n/a | n/a | fixed | pass | pass |
| The Ship's Surgeon | pass | pass | pass | pass | pass | pass |
| Powder Monkey | pass | n/a | pass | pass | pass | pass |
| Sea Lice | n/a | n/a | n/a | pass | pass | pass |
| Capstan Gang | pass | pass | pass | fixed | pass | pass |
| The Sailmaker | pass | pass | pass | pass | pass | pass |
| Fleet Marine | pass | pass | pass | pass | pass | fixed (eye motif) |
| The Galley Cook | pass | pass | pass | pass | pass | pass |
| Ice-Edge Orca | pass | n/a | n/a | pass | pass | pass |

### Gate 2: style and detail (independent)

| Figure | Finding | Fix | Re-check |
|---|---|---|---|
| The Broadside (callout 1) | 17 men from one builder were clones: one face, one jaw, one coat value. The game-size silhouette was a solid rectangle | Four gunners, each his own man: a lean young rammer with long wet hair under his kerchief, stubble, frozen breath and frosted brows; the old gun captain with an icicle beard and an earring; a heavy broken-nosed man with a moustache and a scar, his face sealed under a frost mask; a gaunt old sponger, bald with grey tufts, a neckcloth and an icicle from his nose. Canvas heightened to 1800 x 1800 at the same scale (WL +200), so the frame now shows the rail and sky. The hull is cut at the bow stem where she turns away. The top edge is broken by the cap rail, a lumpy bank of frozen hammocks in their nettings on iron crutches (with a gap where shot went through), the shrouds rising out of frame, and a broken yard laid across the rail with its splintered end out over the bow and slack rigging hanging plumb. The side edge is broken by the anchor hung from its cathead and by the boarder swung out past the stem | game-size sil: lumpy top, open bow corner, spar, anchor and man break the outline |
| The Shrouds (callout 1) | the same clones; jackets were flat dark boxes | Seven topmen, each his own: a young long-haired man under a frost mask, folded over the yard; a bearded, earringed man on the yard; a cropped young man upside down with an icicle at his nose; a big moustached man with an icicle beard and a patched coat; a slim boy with frozen-back hair and no jacket (striped shirt), breathing frost; a gaunt old grey man under a frost mask; the scarred, hook-nosed attacker with ice in his open mouth. Jackets are modelled cloth in five values | 1x crops |
| Capstan Gang (callout 3) | busy splayed legs, opposite leans, four similar faces | see gate 1; personas: a heavy moustached man (icicle beard), a bearded scarred man, a young earringed man under a frost mask, a thin long-haired boy | game-size sil: one wedge leaning one way under the fiddler |
| The White Bear (callout 2) | hind legs plainest: gaskin a column with a square top, fur as a comb of cones, a lump for a foot; eye a ringed round eye with a catchlight | The gaskin is now broad under the stifle, with the calf bulging behind into a lit Achilles, narrowing to the ankle, and the front muscle drawn. Hanks with their own strands hang off its back, a few iced, and the haunch fur hangs over the stifle so there is no top edge. The plantigrade foot: heel set behind the ankle, the long sole flat on the ice, toes spread and digging in, the fur splayed under the load. `furFringe` rebuilt (see above), so the belly and leg fringes are forked hanks at uneven heights. The eye is a small dark almond sunk in a shadowed socket under a rimed fur ledge. Still on all fours | 0.35x, 0.7x, 1.5x |
| Ice-Edge Orca (callout 4) | the outline tapers (head lifted, deepest at the chest, falling to the stock) but the inside was flat: one stroke of light, an oval eye patch, a domed flank patch | Cylinder modelling: a lit band along the upper flank under the back, cross-contours wrapping the body, the lower flank darkened, a fold where the head sets in. The eye patch is a shaded oval lying back above and behind the eye. The flank lobe sweeps up and back behind the fin toward the tail to a point, shaded where the flank turns under | 0.5x, 1x |
| The Ship's Surgeon (callout 5) | the bowed bald head read as an egg (small features on a flat-lit dome) | Face shading 0.86; temple hollow, forehead creases, a raised vein, a lit crown plane; a frayed grey horseshoe of hair round the back. Hands, saw grip, apron and shoes checked | 1.3x |
| The Galley Cook (callout 5) | the smock torso was a pale trapezoid (square shoulders, a straight back): a boxy body | New profile: sloping shoulders, a rounded upper back, the small of the back taken in, a slack chest, the belly lowest at the belt. Drag folds from the shoulder over the belly, stretch lines, an armpit sweat shadow, grease stains. Cleaver, kettle, peg and foot checked | 0.8x |
| Fleet Marine (callout 5) | the cockade (eye motif) | see gate 1. Musket, grips, gaiters and shoes checked | 1.6x |
| The Sailmaker, Powder Monkey, Sea Lice (callout 5) | heads, hands, held objects and feet read at 1x to 1.3x; the jacket change carried onto the Monkey's long coat | none needed | pass |
| Silhouettes (callout 6) | first batch against second: no shared silhouette; labels touched on `sil.png` and `sheet19.png` | composer staggers touching labels onto a second row | `sil.png` read in full |

| Figure | Signature at 190 px | Course marks / Never | Grit | Palette | Unique silhouette | Section 8 | Section 9 |
|---|---|---|---|---|---|---|---|
| The Broadside | pass (wall, ports and muzzles, now a broken top) | pass | 28 (12): + rail, hammock nettings, crutches, broken yard, cathead, anchor, boarder's axe | pass | pass | fixed | pass |
| The Shrouds | pass | pass | 20 (12) | pass | pass | fixed | pass |
| The White Bear | pass | pass | 14 (10) | pass (blood only) | pass | fixed | pass |
| The Ship's Surgeon | pass | pass | 15 (10) | pass | pass | fixed | pass |
| Powder Monkey | pass | pass | 10 (6) | pass | pass | pass | pass |
| Sea Lice | pass | pass | 9 (6) | pass | pass | pass | pass |
| Capstan Gang | pass (fixed) | pass | 12 (6) | pass | pass | fixed | pass |
| The Sailmaker | pass | pass | 12 (6) | pass | pass | pass | pass |
| Fleet Marine | pass | pass | 15 (6) | fixed (no eye motif) | pass | pass | pass |
| The Galley Cook | pass | pass | 14 (6) | pass | pass | fixed | pass |
| Ice-Edge Orca | pass | pass | 9 (6) | pass | pass | fixed | pass |

Section 9: every new piece has a cause in this world's courses and bible. Frost stopped each man a different way (mask,
beard, breath, mouth); water left them swollen and long-haired. The hammocks, the anchor and the broken yard are the ship's
own gear. No church, relic, beasthood or eye was added, and the one eye-like shape (the cockade) was removed.

### Rig and pose tests (re-run, game view, + = clockwise)

| Figure | Bones / layers | Attack pose | Result |
|---|---|---|---|
| Broadside | 70 / 87 (+ spar, anchor, b_* boarder) | gun_1 -4, gun_2 +3, gun_3 -5, lid_1 +12, lid_6 -14, g2_torso -4, g2_head -6, anchor -4, b_torso +6, b_thigh_f +14 | closed |
| Shrouds | 112 / 138 | web -1.5, m7_pelvis +28, m7_upperarm_f/n +30, marlinspike +10, m5_upperarm_n -10 | closed |
| White Bear | 22 / 26 | spine_2 +3, neck -10, head -6, jaw -10, leg_fn_1/2/3 -10/-18/-14, leg_hn_2 +6, leg_hn_3 -5 | fixed (see gate 1), closed |
| Surgeon | 19 / 28 | torso +6, upperarm_n -40, forearm_n -30 | closed |
| Powder Monkey | 18 / 24 | thigh_n -18, thigh_f +16, shin_n +10, torso +4 | closed |
| Sea Lice | 4 / 8 | swarm_1/2/3 +5/+10/+16 | closed |
| Capstan Gang | 83 / 110 | drum +3, bar_1/2 -6, fd_upperarm_n +10, fd_forearm_n +12, g2_torso +4, g4_head -6 | closed |
| Sailmaker | 18 / 25 | torso -6, upperarm_f +18, forearm_f +12, bundle +3 | closed |
| Fleet Marine | 19 / 22 | torso -8, upperarm_n +8, forearm_n +2, thigh_n +10, thigh_f -8 | closed |
| Galley Cook | 19 / 23 | upperarm_n +70, forearm_n +50 | closed; the raised forearm passes over the cap (z note) |
| Orca | 9 / 14 | body +3, head +8, jaw -12, tail -6, flipper_n +8 | closed |

### Still open after this review
- The men are distinct now, but `sailor()` still builds limbs from `jointLimb` tubes with light muscle bumps, and the
  inverted topmen's torsos read as bags. At 2x the gunners' rolled-sleeve forearms are the weakest shapes on the
  Broadside. The rulers are much closer to the Drowned King bar, but these limbs are not there yet. The next pass should
  add forearm and calf modelling to the shared `arm()` and `leg()`.
- The Broadside's frame now shows the rail and sky above it (canvas 1800 x 1800). It still runs off both sides, and its
  rigging runs off the top, but the hull no longer runs off the top as the bible wrote. The director asked for a broken
  top edge; confirm that this reading is wanted.
- Capstan Gang: the snapped stub has its man, but the far bars now stand empty (all four men on the near side, so every
  man pushes the same way). The fiddler still stands 1.17, not 1.5 (see the maker's note). The scrum's front still
  gathers heads and palms at chest height, and reads a little busy at 1x.
- Sea Lice: the lice are one repeated shell, so at 1x the mound reads as a heap of similar pills. It passes the bar at game
  size.
- The bear's lifted-paw wind-up and the cook's raised chop need per-frame z overrides (paw under the head; forearm over
  the cap).
- The gun muzzles (a face ring with an ice plug) are concentric by construction. They read as muzzles, not eyes, at every
  size checked.
- Holds that need IK in the game: the boarder's two hands on the ladder (`b_*` on `ladder`); topman 5's near hand on
  the shroud and far hand on the ratline; every other topman's bonded hand; the three bar men's and the stub man's
  palms on their bars (the men ride on `drum`, the bars on `bar_1`/`bar_2`); the fiddler's bow on the strings; the
  marine's far hand on the fore-stock; the powder monkey's far hand under the case; the sailmaker's fist on the lashing;
  gunner 1's far hand on the rammer; gunner 4's hands on the sponge staff.

## Ruler upgrade pass (2026-11-23)

Director's note: `sailor()`'s limbs are still tubes (add forearm and calf modelling: muscle swell, wrist and ankle taper,
knuckled hands); the Broadside's rail hammocks are a row of identical shapes (vary size, sag, lashing, frost); the
upside-down topmen's bodies read as bags (give them torsos with ribcage and hips under the clothes). Concept, palette,
scale, canvases, keys, seeds, bones and Motion lines unchanged.

**Shared helper rule.** Every change in `sailor()` is behind new options, `o.model` and `o.inverted`, set only by the
Broadside's gunners and boarder and by the Shrouds' topmen. The other nine VII_b figures were re-rendered and compared
pixel for pixel with their previous renders: White Bear, Powder Monkey, Sailmaker, Galley Cook, Fleet Marine, Orca,
Surgeon, Sea Lice and Capstan Gang are all identical (max difference 0). kit_VII_b is used by no other world.

| Area | Before | After |
|---|---|---|
| Bare forearms (`o.model`, rolled or cut sleeves) | `jointLimb` tube with light bumps | `armProfile`: one outline through kit_III's `mchain` with muscle profiles (after kit_X_b's reviewed `mArm`): deltoid and triceps behind, biceps in front, the forearm's mass swelling just below the elbow and tapering hard to a narrow wrist; on it the groove between flexors and extensors, the lit swell below the elbow, the shadowed flexor belly, tendons to the wrist, the wrist bone and a swollen vein |
| Rolled sleeves | a ragged tube over the upper arm and a rounded box at the elbow | the sleeve follows the muscled upper arm (folds dragged round it, the lit roll of the triceps, the shadow under the biceps) and the roll is a short lumpy twisted band with creases, so the forearm's swell shows below it |
| Full sleeves (topmen's jackets) | even tube to a ragged cuff | the sleeve follows the arm inside it (full over the biceps and the forearm swell, drawn in to a narrow frayed cuff at the wrist, a bare wrist under it); folds bunched in the crook, a spiral fold round the forearm, a pull from the elbow, lit rolls over the triceps and forearm |
| Hands (`o.model`) | `B.grip` block + `fistDetail` | `gripK` (the reviewed `knuckleFist` from kit_III_b): knuckle heads, tendons, creased finger joints, tucked tips with nails, a jointed thumb; same grip angles, no warnings. Open hands keep kit_VII's jointed `openHand` |
| Bare shins (free feet) | three-point tube | `mShin`: the calf swelling behind (away from the toes) into the Achilles, the shin bone straight and lit in front, the ankle knob, a vein; the four pairs of legs dangling in from above the frame use it too |
| Inverted topmen (m1 over the yard, m3 hanging by a foot) | the same torso profile as an upright man, a jacket hanging to the hips: a sack with a belt at the top | `o.inverted`: a ribcage, a waist and hips in the profile; the swollen belly falls toward the chest; the jacket has slid down toward the armpits (hem at v 0.5, flared and bunched, drag folds from the hem to the armpit, the ribcage's lit barrel under the cloth); below it the shirt's torn hem, then bare livid skin to the waistband with four lower ribs (each a lit ridge arching over a dark trough), the costal arch, the belly's lit round and navel, the hip crest lit above the waistband, the back turned from the light |
| Broadside hammocks | one shape repeated at a fixed rhythm with small offsets | each roll its own: spacing 40-74 px, height 44-102, width 20-38, lean, a slumped top on about a third; 2-5 lashings at uneven heights cutting into the roll (one in six snapped, its end hanging with an icicle); six canvas tones (one tarred black, one bleached) with a shadowed back and lit flank, some with a sewn seam; frost of four kinds (a heavy snow cap with icicles, a light rime, a clear glaze down the windward side, bare wet canvas dark to the waist); one roll half-unrolled over the netting with a grey blanket's striped edge spilling out, frozen in stiff folds |

Checks: both rulers rendered and looked at 1x, 1.5-2.5x on gunners, topmen and hammocks, and at 0.3x beside the Drowned
King. Rigs re-exported: Broadside 87 layers / 70 bones, Shrouds 138 layers / 112 bones, no MISSING JOINTS, ground 1770 =
canvas h - 30. Pose tests re-run (Broadside: guns, lids, g2 torso and head, anchor, boarder; Shrouds: web -1.5, m7 drop
with arms and marlinspike, m5 arm, m3 torso 6, m1 torso -5): all attached. `sheet.png`, `sheet19.png`, `sil.png`
rebuilt with `rvVIIb/sheets.py`.

Before/after: the topmen's arms now have elbows, forearm swell and narrow wrists in silhouette and their fists have
knuckles; the hanging men read as bodies (ribs, waist, hips, and cloth falling toward the head) instead of bags; the
hammock bank reads as a crew's worth of different bundles. Left: the gunners' forearms are short in their poses (the
elbow sits close to the gun), so the forearm modelling shows best on gunners 3 and 4 and least on gunner 1; changing
their holds would change the poses, so it was not done. The trousered thighs are still cloth tubes with folds.

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| all sailor() men | tube limbs | the ruler pass's modelled limbs are now the default for every sailor (`kit_VII_b.js`: `o.model !== false`): forearm muscle swell and wrist taper, sleeve folds, knuckled fists (gripK); planted bare legs get a modelled calf under the foot plus the shin bone's lit edge, the calf border, the Achilles and a vein. Affects Fleet Marine, Galley Cook, Sailmaker, Powder Monkey, Ship's Surgeon, Capstan Gang (Broadside and Shrouds already modelled) | pass; the trouser thighs are still smooth slabs on the capstan men |
| The Broadside | rail hammocks identical | packed in clumps with gaps, a wider range of height, girth and lean (some toppled onto a neighbour), and a few rolls laid flat across the tops of two others, sagging and pinched by their lashings | pass at full size; at sheet size the leaning grey rolls can read as stones |
| White Bear | wedge head | the skull outline now swells into a cranium behind the eye, a slight stop, a long Roman nose bowing to a blunt nose pad, hanging flews and a cheek-muscle bulge; the lit nose bridge, the muzzle's side turning under, snarl creases; the rime crust and ear moved onto the new skull line | pass |
| White Bear | mitten forepaw | the paws' front edges stop at the knuckles; five separate toes of different sizes in an arc, each with a knuckle lump, a dark gap and fur tufts between, and thick hooked claws of uneven length | pass |

All changed figures re-rendered and re-rigged (Shrouds, Broadside, Bear and the six sailor figures). Sheet, sheet19 and
sil rebuilt (`wVII_b/sheets.py`). Not done here: the Sea Lice one-shell note and the z-order notes.
