# Hero path variants, batch A: review

Source: `worlds/hero_paths_A.js` (seeds 7100-7108). Each builder is a copy of the accepted base in `dirAC.js` with
only what the path lists changed (bible/01_company.md). The body, face, scale, stance, bone names and parents,
lead ostium badge on its cord and red rubric strip are the base's. Uses `split`/`side` from dirAC; no shared file edited.

Outputs: `out/paths/<calling>_<path>.png/.svg/_sil.png`, attack pose tests `out/paths/<calling>_<path>_pose.png`, rigs in
`out/rig/worlds/hero_paths_A_<key>/` (no MISSING JOINTS on any of the nine), sheet `out/paths/paths_A_sheet.png`
(the base beside its three paths at full size, then all four at 0.3x in colour and as silhouettes). Sheet script:
`worlds/sheet_paths_A.py`. `render.js` also leaves copies in `out/worlds/hero_paths_A_*`.

## What each path changes

| Path | Changes (everything else is the base) |
|---|---|
| Bulwark: Last Bastion (7100) | Door smashed at its top-right corner (notch in the silhouette), split down its middle seam, middle hinge snapped off to a stub, lashed back together with three rope turns, each knotted on the face with loose ends; more broken arrow shafts in the door. Cut lead sheets riveted over holes in the breastplate, pauldron, greave, far shin and helm; one pauldron lame missing; wire-stitched split in the breastplate; second gash and caved crown on the helm. A linen bandage shows under the helm rim, bloodied; its knot pushes out from under the front of the lower rim with two short frayed tails hanging plumb (revision 2: the tails used to start on the pauldron); blood runs from under it down the chest and from under the faulds; two arrow shafts stuck in the back. |
| Bulwark: Ironwarden (7101) | Windward side (front, the side he faces the weather) rimed. Revision 2: the rime is built as feathered accretion, not a band: lumpy pale growths in clumps with bare metal or wood between, biggest on the windward edge and thinning inward, a blue-grey shadow under each lump, ink only on its shadow side, short feathers into the wind, all set inside the outline. Crusts on the helm front and crown, breastplate front, greave fronts, poleyns, pauldron, forearm, mace head, sabaton, door edge and bands; frost flecks cut to a third and greyed. Icicles under the helm rim, mail hem, faulds, poleyns and pauldron. Wolf-fur mantle on the back and shoulders and (revision 2) spilling below the pauldron over the back of the near arm and down the back in clumped tufts, rimed on top, iron cloak pin. Grey beard spilling from under the helm in frozen clumps, frost-tipped, with small icicles. Door: round-headed iron-bound pine (pale, weathered), three full-width iron bands plus an arch band, carved ring-cross in the head. Ring handle, keyhole plate and rubric strip kept. |
| Bulwark: Thornguard (7102) | Hooked iron barbs welded on (weld beads at the roots): along the back of the near upper arm, under the forearm, on the couter, the gauntlet knuckles, the pauldron rim, the far arm, a row standing out of the door's outer edge and top, and studded over its face. Steel a shade darker. Hair shirt's bristly collar standing out at the throat (the aventail cut back to show it). Flagellant's scourge through the belt: wooden handle, five knotted cords, old blood. Scratched penitential tally rows on the breastplate. |
| Duelist: Bladedancer (7103) | Doublet and half cape gone: a loose open linen shirt (open to the breastbone, chest hair, collar flaps, loose laces, patch, darn, sweat stains), billowing sleeves with gathered cuffs. Second blade: the parrying dagger replaced by a slim side-sword with a swept hilt, raised point-up behind (on the `dagger` bone), second empty scabbard. Sash tails long and swinging back. Glove cuff shorter. Scorch marks on both blades. |
| Duelist: Executioner (7104) | Black wool headsman's hood over the whole head (cloth tented over brow and nose, crown seam, hemmed eye holes that are only shadow, a dark sliver of lid, no light), its shoulder cape, its back point hanging down the nape with the rubric strip tied round it (on `hair_queue`). Two-handed heading sword: broad, straight, square tip, short fuller, engraved breaking wheel and worn script, long grip, pear pommel, scorch marks; held low and in line in both hands (near hand at the guard, far hand at the pommel). Leather apron from belt to knee over the forward thigh, blood-stiffened. The dagger is gone (its bone is kept, empty). |
| Duelist: Bloodletter (7105) | Near sleeve in white linen wound with red barber's stripes (upper arm and forearm), blood spatter on it. Short curved single-edged blade replacing the rapier, scorch marks on blade and sword hand. Tooled lancet case with three lancet scales on a thong at the hip. Pewter bleeding bowl hung by its handle from a cord at the front hip, its hollow stained, dripping. |
| Elementalist: Accumulator (7106) | Upper body turned 16 degrees forward about the hips and the upper back curved further: bowed under the load, head lower, everything held in the same relation to the book and flame. Heavy brass vessel (dull, olive-brown, verdigris in the seams; not gold) on an ash carrying frame, leaning with the back: iron hoops, rivets, a dent, a riveted sight-glass with the six inks marbling inside, lead-capped and wax-sealed neck, a stopcock, a dark drip. Harness of two buckled straps (shoulder and waist) biting into the robe. New bone `vessel` (child of `torso`). |
| Elementalist: Catalyst (7107) | Revision 2 (a different person at 0.3x; bones and body kept): hood pushed back off the head into a fallen cowl bunched round the neck, its empty bag hanging down the back. Coif gone: a close-cropped grey scalp (stubble grain, razor nick, ear showing) with a chain of ink ward sigils running up from the temple over the scalp and down the side of the neck to the collar; ticks under the eye, a line down the jaw, a bead of sweat. Both sleeves rolled to the elbow, forearms written over with sigils in all six inks. Spine straightened and upper body drawn back: upright, chin level, not stooped. Sign hand lifted to eye level and out from the face; the off hand thrown out from the body, fingers splayed mid-ward (a new notch in the silhouette). The book is shut and clamped in the crook of the far elbow. Front foot up on its toes (heel lifted 24 degrees about the toe). |
| Elementalist: Prismatic (7108) | Hood up over the coif (shell, shadowed inside, rim framing the face); the six course sigils embroidered in a ring round the face on the hood, linked by a couched thread (the halo pattern). Near eye clouded: a dull milky film, no pupil, lid lowered, small and under the brow. |

## Gate 1: logic audit

| Figure | Head/neck | Objects face user | Grips | Weight | Contact | Facing/light |
|---|---|---|---|---|---|---|
| Last Bastion | pass (base helm) | n/a | pass (base `B.grip`) | pass, door planted | pass: rope turns pass round the hinge edge and the far edge; bandage tails hang plumb | pass |
| Ironwarden | pass | n/a | pass | pass | pass: beard and icicles hang plumb; mantle pinned at the throat | pass |
| Thornguard | pass | n/a | pass | pass | pass: scourge handle through the belt, cords plumb | pass |
| Bladedancer | pass (base head) | n/a | pass: second sword through the far fist via `B.grip` (thumb toward the blade), no warning | pass | pass: second scabbard on the belt | pass |
| Executioner | pass: hood follows the skull, no gap to the cape | n/a | pass: near hand `inline` with the bend set to the grip line; far hand across the grip, 32 degrees off square (under the 35 limit), no warning. Two-handed hold: **needs IK** in animation | pass | pass: apron on its waist strap | pass |
| Bloodletter | pass | n/a | pass (base sword grip) | pass | pass: bowl hangs plumb by its handle; lancet case on its thong | pass |
| Accumulator | pass: hunch from the upper back, head over the neck | pass: book still turned to him (rotated with the arms) | pass (base hands) | pass: vessel behind the hips is balanced by the forward bow | pass: harness straps run from the vessel over the shoulder and round the waist | pass |
| Catalyst | pass: upright spine, head over the neck | pass: eyes on the sign; gaze check 8 degrees off the head axis (head angle 0.04, eye to flame about 0.18) | pass: open hands only (base `B.hand`) | pass: weight on the planted back foot and the front toes | pass: book clamped between elbow and belly; the `book` bone is reparented from `hand_f` to `upperarm_f` for this path (name kept), since the hand no longer holds it | pass |
| Prismatic | pass: hood shell and rim follow the head | pass | pass | pass | pass | pass |

Pose tests (`*_pose.png`): Bulwark overhead mace, Duelist lunge, Executioner both arms raised together, Elementalist cast
flick (Catalyst: both hands pushed out in the ward). Parts stay attached on all nine. The Executioner's hands only stay on the grip because both arms were turned by the
same amount; real animation needs IK.

## Gate 2: style and detail

| Item | Result |
|---|---|
| Reads as the base calling at 0.3x | pass for all nine: same stance, door/blade/robe-and-book masses kept (see the sheet's silhouette strip) |
| Path change reads at 0.3x | strong on all nine: Last Bastion (rope bands, notched door), Ironwarden (pale arched door, clumped rime, fur at the back), Thornguard (spiked door edge), Executioner (hood, heading sword, apron), Bloodletter (striped sleeve, short curved blade), Accumulator (vessel and bow), Catalyst (upright, bare cropped head, two raised hands, cowl), Prismatic (sigil ring on the hood), Bladedancer (white shirt, second raised blade) |
| Colour rules | pass: no gold (the vessel is dull olive brass; the ring-cross on the pine door is carved, not gilt). Red only for blood, rubric, the oxblood sash and the barber's stripe (blood) |
| No arcs in the air | pass: Lichtenberg scorch is drawn only as branching surface marks on blades and the Bloodletter's sword hand |
| Eyes | pass: Executioner's are shadowed holes; Prismatic's clouded eye is a small lidded milky film under the brow, no pupil; no eye motifs |
| Tube limbs / flat stickers | pass: limbs reuse the base modelling (bumps, folds); new drapery (shirt, hood, cape, apron, mantle) has folds and hatch; lead patches are cut sheets, not discs (a first version as discs read as portholes and was replaced) |
| Grit 12+ new or kept secondaries | pass on all nine |

## Weak spots left (honest list)

Revision 2 (coordinator review: 7 of 9 accepted) rebuilt the Catalyst and the Ironwarden's rime and mantle, and moved the
Last Bastion's bandage knot under the helm's front rim.

1. **Catalyst**: the `book` bone now hangs from `upperarm_f` instead of `hand_f` (same name). If animation assumes the
   base parent, the book needs that one change in Godot. The lifted heel reads only at full size; at 0.3x the quick read
   comes from the upright back and the two raised hands. The scalp sits mostly in the shadow band, so the sigils on it are
   small at battle size (the forearm sigils carry the read).
2. **Ironwarden**: the clumps on the door's windward edge are inside the outline and broken up, but at 0.3x the door's
   right side still shows as a broken pale edge; that is the windward face being frosted. The mantle flap that spills
   over the back of the near arm is on the `torso` bone, so when the arm lifts it stays on the back (it does not follow the arm).
3. **Last Bastion**: the bandage knot and tails are small; the far tail falls in the shadow band and is faint.
4. **Thornguard's hair shirt** at the throat is small; at 0.3x it is a dark band under the helm. The face barbs on the door
   are foreshortened wedges and read as studs at small size; the edge row carries the read.
5. **Executioner**: the hood reads a little tall and dark at full size, and the nose shape under the cloth is subtle.
   The two-handed hold needs IK. The blade is large and bright; it dominates the figure, as the path suggests.
6. **Bladedancer's shirt** is still the largest plain light area in the batch even after added folds, patch and stains.
7. **Accumulator**: the carrying-frame poles and the harness straps add several diagonal lines behind the shoulders
   that are busy at full size. The vessel's top is over the head line, so check the battle frame's top margin.
8. The Elementalist variants carry the fire sign, as the base does by default; the six-course sign swap is not
   re-exported per path (the `sign` bone is the same, so the base's swap method applies).
