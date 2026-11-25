# World VII, The Icebound Fleet: review

Figures (seeds 700 + index): The Leviathan in the Ice (700), The Ice-Wed Captain (701), Frost Selkie (702), Frozen Whaler (703),
Rime Gulls (704), Ice Eel (705), Drowned Deckhand (706), Walrus Brute (707). File `worlds/world_VII.js`, helpers in
`worlds/kit_VII.js` (frost marks plus helpers copied from the kit_I_* files). All are foes: drawn facing right with
`kit.foeBase`, `flip: true`. Elites are authored in human space and mapped at true scale with `kit_VII.space`.

Method: each figure was rendered, put on a mid-dark ground and zoomed to 2x or 2.5x on the head, hands, held objects and
feet. It was rigged with `render_rig.js` (no MISSING JOINTS on any) and pose-tested on its attack (`out/worlds/VII/<key>_pose.png`).
Every grip goes through `B.grip`, and all of them render with no `move the elbow` warning. Palette was checked by a pixel scan:
no warm, saturated pixels on any figure except the walrus's frozen blood (0.14%, blood is allowed).

Course marks used throughout (frost dominant, water second): lumpy rime crust on windward faces (drawing +x, the heroes'
side) and top faces; icicles always hung plumb in screen space; faceted ice (the whaler's arm cast, the sabre, the slabs);
cloth and hair stopped mid-motion (the coat tails, the veil, the neckerchief); cracked and frost-blackened skin; breath frozen
as it left the mouth. Under it: drowned lividity, barnacles, salt tide-lines. The Never column is kept: there are no clean
crystals or snowflakes anywhere, all ice is dull, lumpy and dirty-white.

## Gate 1: logic audit

Items: 1 head over neck and spine (non-humanoids: one spine), 2 objects face their user and gaze, 3 grips and hands,
4 weight and balance (non-humanoids: legs carry the weight), 5 contact, attachment and plumb hang, 6 facing and light.

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact | 6 Facing/light |
|---|---|---|---|---|---|---|
| Leviathan in the Ice | pass | pass | n/a | pass | pass | pass |
| Ice-Wed Captain | fixed | pass | fixed | pass | fixed | pass |
| Frost Selkie | pass | pass | fixed | pass | fixed | pass |
| Frozen Whaler | pass | pass | pass | pass | fixed | pass |
| Rime Gulls | pass | n/a | n/a | pass | pass | pass |
| Ice Eel | pass | n/a | n/a | pass | fixed | pass |
| Drowned Deckhand | pass | n/a | fixed | pass | pass | pass |
| Walrus Brute | fixed | n/a | n/a | pass | pass | pass |

### Fails and their fixes (each re-rendered and re-checked)
- Captain 3: the far fist on the wheel held nothing you could see. The spoke handle was shorter than the fist and hidden under it. The gripped handle is now 92 units long, the fist sits 36 units out from the rim, and the handle shows past the knuckles. The forearm meets the handle square (elbow placed with `rot(..., gAng + 90°)`), with no warning.
- Captain 5: the wheel, which stands in front of him, was drawn before the coat. It is now drawn after the head and before the sabre arm, so the sabre still passes in front of it.
- Captain 1: the tricorn was clipped by the canvas top (18 px). The neck and spine were lowered 18 units in human space, and the hat's top is now at y 5.
- Selkie 3: the fist on the throat knot was 72° off square (vertical forearm on a vertical knot). The knot's tail now runs across the fist (thumbAng 186°), and the grip prints no warning.
- Selkie 3/5 (count the hands): the sailor's empty arm-skin hung free with a hand on it and read as a third arm. It now lies flat on the pelt's back with a torn cuff and no hand.
- Whaler 5: a slush wash on the coat hem was an unclipped polygon that spilled outside the silhouette. It was removed (the grime gradient does that job).
- Eel 5 (rig): the dorsal fin lies outside the body width, so segment joints tore open on the fin side. The overlap disk at each cut is now half the local body width plus 48 px, and the pose test is closed.
- Walrus 1 (rig): the `neck` bone had no geometry, so turning the neck lifted the head off its flesh. The body outline is now split three ways (body, chest, neck), and the lunge pose test is closed.
- Deckhand 3: the cutlass D-guard was drawn as a loop that caged the fist. It now runs from the quillon to the pommel along the knuckle side, 25 units out.

### Measurements behind the passes
- Heads: every humanoid head sits on `N + up * 56..64` (along the spine's own tangent), so any hunch comes from the spine curve. The selkie's spine leans 40° and her head is carried on it. The captain and the deckhand lift their chins by turning the head (-0.1, -0.24), not by sliding it forward.
- Grips: the deckhand's cutlass is a hammer grip (blade off the thumb side, forearm 80° to the blade). The whaler's harpoon runs through the fist square to a near-vertical forearm. The captain's sabre is `inline`. The selkie's knot and the captain's wheel handle are square to their forearms. None prints a warning.
- Gaze: the whaler's head (0.06 rad) looks along the throw. The selkie (0.16) looks at the heroes. The leviathan's pupil is turned up toward them.
- Weight: the deckhand, whaler and captain each have the pelvis between the feet, with the weight-bearing leg the straighter one (the back leg for the deckhand and whaler). The selkie's mass is over her front foot, with the back knee low and the cloak's train on the ice. The walrus sits on both fore flippers and its slumped belly. The eel rises out of its hole.
- Plumb: icicles, hair hanks, the selkie's hair mass, the epaulette fringe, the queue, lanyards, the flap tie and every rope end are built in screen space.

## Gate 2: style and detail

| Figure | Signature at 190 px | Frost marks / Never | Water marks | Grit (min) | Palette | Unique silhouette | Quality-bar faults |
|---|---|---|---|---|---|---|---|
| Leviathan in the Ice | pass: the toothed jaw rising over the slabs, the eye behind ice | pass | pass (barnacles, frozen spittle) | 18 (12) | pass | pass | fixed |
| Ice-Wed Captain | pass: the tricorn with its veil | pass | pass (drowned glazed face, salt lines) | 24 (10) | pass | pass | fixed |
| Frost Selkie | pass: the hunched figure in the pelt, reaching | pass | pass (wet hair, brine tear-track) | 16 (10) | fixed | pass | fixed |
| Frozen Whaler | pass: the harpoon raised overhead | pass | pass (salt lines, line) | 16 (6) | pass | pass | fixed |
| Rime Gulls | pass: the cluster of beating wings | pass | n/a | 12 (6) | pass | pass | fixed |
| Ice Eel | pass: the S rising from the hole | pass | pass (translucent drowned body) | 13 (6) | pass | pass | fixed |
| Drowned Deckhand | pass: the cutlass up and the open mouth with frozen breath | pass | pass (lividity, salt lines) | 16 (6) | pass | pass | fixed |
| Walrus Brute | fixed: the tusks now break the outline | pass | pass (barnacle scars, harpoon line) | 14 (6) | pass (grey-brown hide as the bible asks; red only on blood) | pass | fixed |

### Grit, by figure
- Leviathan: the Tooth (pale stone, strata, crack), two broken masts and a yard, a frozen rag of sail, slack rigging, four harpoons with hanging lines, a torn knotted boarding net, barnacles, white scars, frozen strings of spittle across the gape, a frozen blowhole, a sailor frozen in the slab (scale cue), trapped bubbles and pressure layers in the ice, cracks spreading out from the head, a far hull with a leaning mast.
- Captain: a tricorn with worn braid and an iron cockade; a lace veil (net, roses, holes, frozen folds); an epaulette with its fringe frozen plumb; lace loops on the lapel; pewter buttons; waistcoat buttons; a baldric and buckle; a lead medal on a ribbon; a frozen cravat; an empty scabbard with its chape; tail buttons; a darned patch; a shot hole; salt tide-lines; buttoned cuffs; the ring of ice; the beard frozen in one block; the glazed face; knee bands; strapped boots frozen into the deck; a rope lashing on the rim; the rim worn bright; the drum ropes.
- Selkie: tattoos of a ship, an anchor, a swallow and a heart with a banner; three stitched seams; a cropped scalp patch and a tarred plaited queue with its tie; the empty arm-skin with creases and a torn cuff; the knot with a frozen loose end; webbed hands and feet; dark nails; a frozen brine tear-track; one sharp tooth; the spine groove and shoulder-blade hollows on the hide; the leg-skins lying flat on the ice; icicles on her hair.
- Whaler: a fur hat with an ear flap and tie, bone toggles, a knotted rope belt with hanging ends, a flensing knife with a bone handle, a scrimshawed whale tooth, the line coil, tally notches and seizings on the harpoon, a barbed head, coat and knee patches, salt lines, a fingerless mitt, the ice cast on the arm, beard icicles, a strap boot.
- Deckhand: cap ribbing, a pewter earring, a knotted neckerchief, two rows of buttons with one missing (its thread left), a darned rent, salt tide-lines, a pocket flap, a belt with an iron buckle, a boarding pistol (lock, cock, butt cap, guard), a stitched canvas thigh patch, a nick in the cutlass, the D-guard, a wrist lanyard, blackened toes and fingertips, icicles, the frozen breath.
- Walrus: the cutlass tusk with nicks; the snapped stump; the torn gum with frozen blood; growth rings and a worn tip on the ivory; a broken harpoon (seizings, iron socket, frozen line); scars; bosses; fat rolls; rime slabs; whisker quills with frost beads; cracked hide; frost-bitten flipper edges; claws.
- Eel: needle teeth in both jaws, a tube nostril, a gill slit, a pectoral fin, dorsal fin rays with rime patches, the spine, vertebrae and pin bones seen through the skin, the gut, lateral-line pores, myomeres, creases at the bends, scars, icicles under the neck, the lip of the hole with heaved slabs.
- Gulls: a dropped primary, ice clotted on the wingtips, icicles off the trailing edges, rime on the leading edges, coverts frozen upright, white mirrors, winter streaking, a gonys spot (grey, not red), feathers standing up on the back, feet thrown forward in the stoop, the open bill with an icicle.

### Style fails found and fixed (each re-rendered and checked zoomed)
- Kit `rime()`: the first version made a thin, toothy pale band that read as a sticker outline or a saw edge. It was rewritten into rounded lumpy crust with a seated shadow line, sampled at its own depth, and is now used only on windward and top faces. Thin objects (the harpoon shaft, the cutlass) get speckle instead.
- Kit `breath()`: the first plume read as a horn, then as a trumpet bell. It is now a loose cloud of frozen puffs, icicled underneath.
- Deckhand: the shirt was a large pale apron (the jacket now covers the front, leaving a V). The cutlass read as a straight sword (it is now broad and curved, with a nick). The face was over-hatched (lighter skin, fewer marks, no stubble). The striped slops read as banded tubes (now vertical ticking with folds). The thigh patch read as a black card (now grey canvas). The heel ice now leaves the blackened toes showing.
- Whaler: the ice cast read as a white plank (now a translucent anatomical sheath with a rime crust). The harpoon rime made a saw edge, and the head was a small diamond (now a flued, two-barbed iron). The nose read as a beak. The coat skirt and the split read as a round shield (now narrower, with a shadowed split).
- Walrus: it read as a stacked segmented sack, a totem of balls (now one outline, with the rolls drawn inside). The neck was an even-width column (it is now flared, with the head lowered and enlarged). The rime sat only on the leeward back (windward chest rime added; the bible's back rime kept as slabs). The whiskers read as teeth. A dark jowl crescent was removed. The tusks were hidden inside the silhouette (now angled out past the chest).
- Eel: an even-width pale tube (now a 156 to 64 px taper with a swell and a waist). The translucency did not read (now a deeper core, glowing edges, visible skeleton and gut). The fin rime was a sawtooth. The eye was a round cartoon eye (now a clouded half-lidded slit).
- Gulls: the wings were too long and were drawn feather by feather into chaotic slabs. The bodies were too small, and the flock was scattered. Each wing is now one outline with fingered primaries and its detail clipped inside it. The bodies are 1.3x larger, the bills longer, and the flock clustered.
- Captain: the veil read as a giant wing (now narrower and more translucent, with lace). The boot cuffs read as pillows (now mid-shin boots with buckled knee bands). The front skirt corner read as a kneepad.
- Selkie: hair hung as black bars in front of her; it is now one mass from the back of the head. The face read as a skull (big dark ovals, teeth); the socket is now soft, the eyes almond, the lips closed on one tooth. The cloak read as a backpack, then as a second standing figure (its leg-skins upright); it is now a pelt wrapping her, with the leg-skins lying on the ice. The lips were warm (`lips: true` mixes a red-brown), so they were removed.
- Leviathan: the snout was a thin gharial beam (the skull is now bulked to 180 to 250 px of jaw depth, with a brow and muscle folds). The ice slabs were flat grey quads (now jagged tops, a thickness face, a snowy top, bubbles and pressure layers). The net read as a window grid (now sagging, knotted and torn). The eye read as a cartoon (now filmed and veined, with a tall pupil, under the slab).

## Rig and pose tests (out/worlds/VII/<key>_pose.png)
| Figure | Bones | Layers | Attack pose | Result |
|---|---|---|---|---|
| Leviathan | 6: ice, back, skull, jaw, eye, plates | 6 | skull +8, jaw -12 (the jaw breaking up) | closed |
| Captain | 21: standard + sabre, veil, coat_tails, scabbard, wheel, wheel_rim | 28 | sabre wind-up (upperarm_n +95, forearm_n +30) | closed; the arm crosses his beard in the frame (z note) |
| Selkie | 19: standard + cloak, cloak_train, hair, jaw | 22 | lunge (torso -12, arm reaching, jaw open) | closed |
| Whaler | 20: standard + harpoon, line, coat_skirt, coil, hat_flap | 29 | throw (upperarm_n -30, forearm_n -30, hand_n +52) | closed |
| Gulls | 13: flock, gull_1..4, each with wing_n and wing_f | 12 | stoop and wing beats | closed |
| Eel | 8: hole, seg_1..5, head, jaw | 9 | strike (segments -3 to -7, head +16) | closed after the fix above |
| Deckhand | 17: standard + cutlass, pistol | 26 | cut (upperarm_n -75, forearm_n -35) | closed; the arm passes the face mid-cut (z note) |
| Walrus | 10: body, chest, neck, head, tusk_cutlass, flipper_fn/_2, flipper_ff, tail, harpoon | 16 | tusk lunge (neck -14, head +24) | closed, with a slight step on the back at the neck cut |

Sign convention for posetest in game view: positive is clockwise.

## Still open
- Two holds need IK in the game. The Captain's far hand is on the wheel, and the wheel is its own root (`wheel`, parent null, beside `pelvis`), so moving the torso pulls the hand off the handle. The Selkie's fist holds the knot, which rides on `cloak` (a child of the torso), so moving the far arm leaves the knot behind. No creature holds one object in two hands.
- Walrus height measures 1.50 against the bible's 1.6 (the head top is at 1.5; the frame is 900 wide). The gull flock measures 0.53 across against "about 0.6".
- The Captain's veil is right as the signature, but it is still the largest pale area on him.
- The Deckhand's open far hand has rather thin fingers at 2x. It reads as a hand at game size.
- Z order: the deckhand's and captain's attack frames carry the near arm over the face. Godot needs a per-frame z_index for those frames.
- `B.head` mixes slight warm tints into the nose and ear (shared code, frozen). On this cold skin they measure as 0% warm-saturated pixels.

## Independent review (2026-11-23)

Reviewed fresh against GUIDE.md (section 8 in full), LOGIC_CHECKLIST.md, the design language, the world VII bible and the
director's notes on the sheet. References: the Drowned King and the Mire Mother (ruler bar), the rebuilt Eel-kin and Lamprey,
the Fen Lurker and Mire Toad (animal mass), dirAC/dirAC2. Method: each figure was rendered on its own, composited on a
mid-dark ground, and zoomed 1.5x to 2x on the heads, hands, held objects, feet and ice. It was then checked at game size
(190 px human) and in silhouette. It was re-rigged (no MISSING JOINTS anywhere, groundY = canvas height - 30 on all eight)
and the attack pose was re-run into `out/worlds/VII/<key>_pose.png`. The sheet and sil were rebuilt in the same layout. A
pixel scan finds no warm, saturated colour except the walrus's frozen blood (0.03%). No grip prints a warning.

New shared-in-world helpers in `kit_VII.js`: `muscleBody()` (a body along a centreline whose bends bulge on the outside and
pinch on the inside, for the eel), and `fx().slab2()` (one broken, upended slab of pressure ice: ragged hard-cornered
edges, a thickness face on every edge the thickness vector shows, snow on the up-facing tops, a translucent face that is
densest toward the waterline, with pressure layers, bubbles, cracks and an `inside` hook for what is frozen in it).

### Gate 1: logic audit (independent)

| Figure | 1 Head/spine | 2 Object/gaze | 3 Grips/hands | 4 Weight | 5 Contact/plumb | 6 Facing/light | Fix |
|---|---|---|---|---|---|---|---|
| Leviathan in the Ice | pass | pass | n/a | pass | fixed | pass | 5: the far side's teeth seen across the gape were on the jaw bone and floated in the air when the skull lifted; they are now on the skull, under the jaw |
| Ice-Wed Captain | pass | pass | fixed | pass | pass | pass | 3: the wheel fist sat beside his beard and read as a hand held to his face. Now he holds the rim itself at chest height, with the forearm level and square to the rim (90 deg, no warning). The attack frame no longer crosses the face (see the pose table) |
| Frost Selkie | fixed | pass | fixed | fixed | pass | pass | Rebuilt. 1: the head now carries on a hunched upper back, not a straight slab. 4: the front knee is over the toes (IK), the far knee is down on the ice, and the weight is over the front foot. 3: the empty hand on the arm-skin is a flat, limp glove hanging plumb below the knot, a different value from her hands, so the count is still two hands |
| Frozen Whaler | pass | pass | pass | pass | pass | pass | (no change at rest) |
| Rime Gulls | pass | n/a | n/a | pass | pass | pass | - |
| Ice Eel | fixed | n/a | n/a | pass | pass | pass | 1: the head was a separate shape on an even "neck" (a seam, and a plesiosaur). The skull is now the end of the body outline, with no neck. The tail is one spine with its own chain |
| Drowned Deckhand | pass | n/a | pass | pass | pass | pass | (no change at rest) |
| Walrus Brute | fixed | n/a | n/a | fixed | pass | pass | 4: the belly hung on two stilt flippers, which reads as a dog sitting. The belly now lies on the ice, the fore flippers come out from under the chest fold and press flat, and the hind flippers are turned forward under the hips. 1: the head sits on the neck mass, not on a column |

### Gate 2: style and detail (independent)

| Figure | Signature at 190 px | Course marks / Never | Grit (min) | Palette | Unique silhouette | Section 8 faults | Fix |
|---|---|---|---|---|---|---|---|
| Leviathan in the Ice | pass | pass | 22 (12) | pass | pass | fixed | Boxes/glass panes: the ice is now pressure ice made of eleven `slab2` slabs. They are rotated -0.6 to +0.42 rad, overlap, and have thickness faces, broken edges, snow on the tops, rubble and a drift at their feet. Drowned sailors show in the translucent ones. Flat black head: the head is rebuilt as a whale skull. The rostrum is 220 to 250 px deep, with a lit top plane, the rostral ridge and the side turning dark to the gum. It has a heavy brow, the cheek mass behind the eye, folds at the gape, a deep lower jaw with throat pleats, and fewer, heavier teeth. Rime sits on the windward tops. The open front of the gape is see-through, with the far jaw's teeth showing in it. The eye is larger and looks up through the slab. The eye wrinkles no longer read as lashes. The net now follows the hump's curve |
| Ice-Wed Captain | pass | pass | 24 (10) | pass | pass | fixed | Veil (largest pale flat area): it is rebuilt as lace gathered at the tricorn and hanging heavy to the knee. Seven uneven folds fan from the gather, each with a shadowed wedge and a lit ridge. The back edge ripples, and the hem is pulled into points by clumps of ice, with icicles hanging plumb. Net, roses, holes and rime on its top |
| Frost Selkie | pass | pass | 20 (10) | pass | pass | fixed | Rebuilt. Flat stippled cloak: the cloak now hugs the hunched back, with tension creases over the shoulders and hip. Uneven frozen folds fall from the hip to a hard, broken hem with thickness and icicles, and the raw inner side shows down the curled front edge. It still reads as the sailor: his face-skin hangs as a fallen hood (one eye-hole torn open, nose flap, stubble, tarred queue); the ship, swallows and heart are tattooed on his back; his arm-skins with an anchor are knotted at her throat; one empty hand hangs flat; his leg-skins and feet lie on the ice. Her cross-stitched sinew seams run down the cut front and the shoulder. Sack body: a rounded knee with a kneecap, a calf swell, a thin ribbed torso, and a reaching arm. Face: almond dark seal eyes with a soft lid. The frown-shaped lid, the goggle iris ring and the jaw hatch that made a mask are gone |
| Frozen Whaler | pass | pass | 19 (6) | pass | pass | fixed | Large flat cloth (found in this review): the coat skirt was a flat grey field. It now has stiff wool folds from the belt, salt tide-lines, a tar stain and frost in the weave |
| Rime Gulls | pass (fixed) | pass | 12 (6) | pass | pass | fixed | Tiny at sheet size: the inner wing (the arm) is now broad and narrows to the wrist, the bodies and heads are plumper, the birds are 1.2x larger, and the flock is spread 1.12x. It measures 0.65 across (was 0.53; the bible says "about 0.6"). At 190 px each bird reads as a gull: white head and body, grey mantle, black tips |
| Ice Eel | pass (fixed) | pass | 18 (6) | pass | pass | fixed | Tube and plesiosaur: rebuilt on `muscleBody`. The trunk is 206 px at the hole, tapering to 142 behind the head, with no waist and no neck. It bends in a striking S that leans at the heroes. Each bend bulges on the outside, with a long lit highlight, and packs into skin creases on the inside. The dorsal fin is a rayed, translucent fringe. A compressed tail comes up through a crack behind, its fins running round the tip as one rounded paddle. There is rime on the windward flank and the up-facing back, and icicles under the overhang. Under the frost: drowned pallor, lividity pooled low, and the spine, pin bones and gut shadowed through the skin. Head: skull and upper jaw in one with the body, a lit cheek muscle mass with creases, lips with pores, a hinged lower jaw, needle teeth raked back, tube nostrils, a gill slit and a pectoral fan. Height measures 1.41 |
| Drowned Deckhand | pass | pass | 16 (6) | pass | pass | pass | - |
| Walrus Brute | pass | pass | 20 (6) | pass (blood only) | pass | fixed | Smooth sack: rebuilt as one outline with a massive wedge of neck and shoulder, the throat scalloped by hanging folds that start at notches and sag back, the nape packed into creases, the shoulder blade under the hide, about 140 bosses, a cracked-hide wrinkle net, moult patches with peeling edges, and long fight scars. The fore flippers carry the weight: a short forearm under the armpit fold, wrist folds, and a fan of five digit ridges with nails set back from a scalloped edge. The hind flippers are turned under. The whisker pad is broad, with staggered follicles and dense, thick, frosted quills; the pad blends into the face with a fold, not an outline. The eye is small and sunk in folds. The gum is torn ragged round the cutlass. Rime and icicles sit on the windward folds. Height measures 1.58 (bible 1.6; was 1.50) |

### Rig and pose tests (re-run)

| Figure | Bones / layers | Attack pose (game view, + = clockwise) | Result |
|---|---|---|---|
| Leviathan | 6 / 7 | skull +6, jaw -10 | closed. The gape cavity rides on the jaw past the gum line, so no gap opens |
| Captain | 21 / 28 | torso -4, upperarm_n +48, forearm_n +4, hand_n -14 (the cut extended at the heroes) | closed. The blade runs level at chest height, under the beard and well clear of the face. The maker's wind-up (+95/+30) and an overhead raise (+70/+40) both put the blade across the face or hat, so neither is used |
| Selkie | 19 / 25 | torso -14, upperarm_n +12, forearm_n +6, jaw -12, hair +8, cloak +12, cloak_train +3 (lunge and bite) | closed. The cloak is counter-rotated so its hem stays on the ice. There is a small step at the hip where the cloak and its train turn by different amounts |
| Whaler | 20 / 29 | torso -6, upperarm_n -129, forearm_n +60, hand_n +64 (the throw's release, harpoon level at the heroes) | fixed: the maker's frame (-30/-30/+52) put the ice-cast forearm and fist straight across his face. The release frame keeps the arm at chest height |
| Gulls | 13 / 12 | gull_1 -14 (stoop), wing beats on all four | closed, wings stay on the shoulders |
| Eel | 12 / 16 (hole, crack, seg_1..5, head, jaw, tail_1..3) | seg_2..5 -2 to -4, head +12, jaw -12, tail +6/+10/+14 | closed at every cut, including the skull seam |
| Deckhand | 17 / 26 | torso -6, upperarm_n -173, forearm_n +68, hand_n -44 (the cut followed through, low and forward) | fixed: the maker's frame (-75/-35) laid the arm and cutlass over his whole face. The follow-through bends the elbow the anatomical way |
| Walrus | 10 / 16 | chest -4, neck -10, head +16, flipper_fn +5, flipper_fn_2 -5 (tusk lunge) | fixed: a dark wedge tore open at the back of the hump at the neck cut (the pivot was near the throat, 200 px from the back edge). The chest, neck and head pivots now sit near the back edge, with overlap disks of 100 to 120, so the bend overlaps at the throat |

### Still open after this review
- The selkie's lunge shows a slight step at the hip between `cloak` and `cloak_train`. The animator should keep their difference under about 8 degrees.
- Two-handed and held contacts still need IK in Godot. The captain's far fist is on the wheel rim (`wheel` is its own root), and the selkie's fist is on the knot (which rides on `cloak`).
- The eel stands 1.41 against the bible's 1.5. A taller S brought back the long-neck read the director rejected, so the height was kept; the rest of the body is below the ice.
- The leviathan's back hump is still a fairly compact dome behind the head; it reads as the hump with the fleet's wreckage, but it is the least developed part of the ruler.
- Icicles drawn plumb in the rest pose rotate with their bones in the attack frames (the deckhand's elbow icicles). That is a rig limitation shared by every frost figure.

## Lore changes 2026-11-23

Eye-audit ruling (coordinator): the Leviathan's four round grapnel scars were closed concentric rings, which could read
as eyes. In `worlds/world_VII.js` each is now a cluster of three broken scar arcs of different sizes, turned different
ways, off-centre to each other, never closed or nested. The jitter is a fixed hash, not the figure's random stream, so
nothing else on the figure moved. The Leviathan's own eye is the bible's and stays.

| Gate | Item | Result | Note |
|---|---|---|---|
| 1 Logic | 1-6 | pass | Unchanged geometry |
| 2 Style | Eye motif | fixed | Checked at 3x on all four scars and at sheet size: rake and grapnel scars, no ring-in-ring |
| 2 Style | Detail count (12), palette | pass, 22 | Same scars, redrawn |
| Rig | 6 bones / 7 layers | pass | Re-exported, no `MISSING JOINTS`; `out/worlds/VII/leviathan_in_the_ice_pose.png` (skull +6, jaw -10): closed |

`out/worlds/VII/sheet.png` and `sil.png` rebuilt with the reviewer's composer (scratch `VIIr/sheet.py`, unchanged).

## Final consistency pass (2026-11-25)

| Figure | Item | Fix | Check |
|---|---|---|---|
| Walrus Brute | upright sack | the whole animal is leaned forward onto its fore flippers by an affine shear about the ground line (x += 0.32 * height above ground) with a 0.92 settling squash: chest and head now hang out over the flippers, the hind end stays planted. Icicles are drawn unsheared at their sheared tops (X.icicle wrapper), so they still hang plumb. Joint pivots go through the same transform. Canvas widened 900 -> 1200 at the same pixel scale (director ruling: true size wins) | full and sheet size: pass; at sheet size it still reads as a tall animal, but the lean is clear |
| Leviathan | big round eye | a small filmed eye sunk in a deep bony orbit: the orbit's hollow, a cracked lower bony rim, the heavy upper lid down over the top, a sagging lower lid, a dull slit pupil turned up at the company, no white catchlight | pass |

Walrus lunge (neck -14, head +24) and Leviathan (skull +8, jaw -12) pose tests re-run into `out/worlds/VII/<key>_pose.png`:
closed (the walrus keeps its slight step at the neck cut). Sheet and sil rebuilt (`VII/sheet.py`).
