# Ostium figure production guide

The brief every figure is built to. Read it whole before drawing anything, then read `LOGIC_CHECKLIST.md`,
`bible/00_design_language.md`, your world's `bible/world_*.md`, and the lessons in `REVIEW.md`.

## 1. The style (locked by Cole, 2026-11-22)

**Direction A's bodies, rendered in direction C's Living Ink.**

- **Bodies (A):** heavy, grounded, 6.4 heads for a human. No lanky limbs, no tube arms, no puppet stiffness. Every figure
  has weight, a posture that tells you who it is, and a personality. Tired veterans, not mannequins.
- **Rendering (C):** `kit.base(seed)` for heroes and keepers, `kit.foeBase(seed)` for foes. Cel shadow band with ink
  crosshatching, a variable ink outline, one key light from the upper left. Never change these settings per figure.
- **Reference figures:** `dirAC.js` (Bulwark, Duelist, Elementalist) and `dirAC2.js` (Alchemist, Oracle, Hexweaver,
  Drowned Thrall, Mother Hild). Open them and copy their construction habits. The Bulwark in `dirAC.js` is the
  reference for bones and joints.
- **The bible decides content:** what the creature was, its body, dress, head, signature shape, colour and motion. Build
  exactly the entry, then add the grit. The bible's shape language per course (fire splits and chars, frost rimes and
  stills, lightning scars and fuses, water bloats, toxin ripens and rots, void unmakes) is mandatory, and so is its
  "Never" column.
- **Proportion:** the bible's old "7.5 heads" line is superseded: humans are 6.4 heads.
- **Grit:** foes at least 6 secondary details, elites at least 10, rulers and heroes at least 12; at least three
  overlapping layers; asymmetry; wear on every surface; mud to the knee; no flat empty area bigger than a palm; noise
  inside the silhouette, never on its edge. Read order: silhouette, signature shape, face, noise.
- **Colour rules:** each world uses only its own palette plus ink black, bone and grey. Gold only on holy things (and
  the Torn Sky). Red only for blood, doom and rubric. Eye motifs only in void worlds.

## 2. Size tiers and facing

One pixel scale for the whole game: a 1.0 human stands about 640 px tall. Use `kit.TIERS` for the canvas and set
`groundY` in the figure options to canvas height minus 30.

| Tier | Bible scale | Canvas (w x h) |
|---|---|---|
| small | 0.3 to 0.6 | 600 x 820 |
| human | 0.9 to 1.15 | 600 x 820 |
| large | 1.3 to 1.8 | 900 x 1100 |
| elite | 1.8 to 2.5 | 1100 x 1400 |
| ruler | 3 and above | 1600 x 1600, cropped by the frame as the bible says |

Draw the creature at its true size on that scale: a 1.5 creature is 1.5 times a human's height. True size wins over the
canvas (director ruling, 2026-11-23): when a long or tall body does not fit its tier's canvas, widen or heighten that
figure's canvas (keep the same pixel scale, groundY = canvas h - 30) or let the frame crop it, rather than shrinking it. Rulers are shown
partly off-frame, like a cathedral seen from inside.

Heroes face right. **Foes face left:** draw them facing right with `kit.foeBase(seed)` (its light is `[0.6, -0.8]`) and
set `flip: true` on the entry, so after the mirror the key light is still upper left.

## 3. File layout and ownership

- Your world file: `worlds/world_<roman>.js` (require shared code as `require("../kit")`, `require("../engine")`). It exports `{ heroes: [ { key, name, tier, w, h, flip, build } ... ] }`
  (the list is called `heroes` for the renderer; it holds your creatures). `key` is snake_case from the bible name.
- Your outputs: `out/worlds/<roman>/`. Your review: `worlds/world_<roman>_REVIEW.md`.
- Shared files (`engine.js`, `body.js`, `gear.js`, `kit.js`, `render.js`, `render_rig.js`, `posetest.py`) are frozen
  while worlds are in production, because several agents work at once. If you need a new shared helper, put it in
  `worlds/kit_<roman>.js` and require it from your world file.
- Seeds: use `<roman number> * 100 + index` (world IV, third creature = 403) so pattern ids never collide.

## 4. Building for the rig

Everything will be rigged as cut-out parts on a Godot Skeleton2D. Build for that from the start.

- Declare joints first: `f.joint(name, pivotPoint, parentName)`. The root has parent `null`. Humanoids use the
  standard names: `pelvis` (root), `torso`, `head`, `upperarm_n/forearm_n/hand_n`, `upperarm_f/forearm_f/hand_f`,
  `thigh_n/shin_n/foot_n`, `thigh_f/shin_f/foot_f` (`_n` is the near side, `_f` the far side), plus a bone for each
  held object (`weapon_n`, `shield`, `staff`) parented to the hand that holds it, and bones for cloth that should
  swing (`cape`, `tail`, `skirt_back`). Non-humanoids design their own chain: quadrupeds (`spine_1..3`, `neck`, `head`,
  `jaw`, legs as `leg_fn_1..3` and so on), serpents and worms (a chain of `seg_1..n`), swarms (one bone per body),
  floaters (`body` plus parts), rulers (the parts that move in the bible's Motion line).
- Before drawing each part, call `f.bone(name)`. Everything drawn after it belongs to that bone until the next call.
  Draw order still decides layering, so a bone can appear more than once (far arm behind the torso, near arm in front).
- **Draw every part complete**, including what the pose normally hides: the torso under the arm, the thigh under the
  skirt. When the rig moves, hidden areas show.
- **Overlap at every joint.** Limb ends are round caps; each child part starts inside its parent so no gap opens when it
  rotates 30 degrees either way.
- **Armour that sits on the shoulder belongs to the torso**, not the arm (a pauldron on the arm bone flies off when the
  arm lifts). Elbow and knee cops belong to the lower bone.
- Every bone you draw on must have a joint, or the export reports `MISSING JOINTS`.
- Check the rig: `node render_rig.js worlds/world_<roman> <key>` exports layers and `rig.json`; then pose it with
  `python3 posetest.py out/rig/worlds/world_<roman>_<key> out/worlds/<roman>/<key>_pose.png '{"upperarm_n": -50, "forearm_n": -30, "torso": 5}'`
  (use the creature's own attack). The parts must stay attached, nothing may tear open, and the attack pose must make
  physical sense. Fix and re-check.

## 5. Rendering

- `node render.js worlds/world_<roman> <key>` renders one figure to `out/worlds/world_<roman>_<key>.png` plus its
  silhouette (`..._sil.png`). Always pass the key. Composite onto a mid-dark background with PIL and zoom 2x to 3x on the head, hands, held objects and feet.
  Look at the pixels; do not trust your code comments.
- Only 2 CPUs are shared by several agents: render one figure at a time and do not leave background jobs running.

## 6. Review gates (both are required before anything is shown)

1. **Logic audit** with `LOGIC_CHECKLIST.md`: head over neck and spine, objects facing their user, every grip
   (`B.grip`, never a hand-set fist angle), weight over the feet, straps and contacts, facing and light. For
   non-humanoids: legs that carry the weight, jaws that open on a hinge, wings that attach at the shoulders, segments
   that follow one spine.
2. **Style and detail** against this guide and the bible entry: signature shape reads in silhouette at 190 px tall, the
   course marks are right and their "Never" items are absent, grit counts met, palette rules kept, no two foes in the
   world share a silhouette.

Write both as tables (figure by item, pass or fail, and the fix) in your review file. A fail is fixed and re-checked,
never just noted.

## 7. Deliverables per world

- `worlds/world_<roman>.js` with every creature in the world's bible file.
- Per creature: the render, the silhouette, the rig export, and one attack pose test.
- `out/worlds/<roman>/sheet.png`: all creatures side by side at true relative scale on a dark ground, plus
  `out/worlds/<roman>/sil.png` (silhouettes at game size, about 190 px for a human).
- `worlds/world_<roman>_REVIEW.md` with the two gate tables.

## 8. Faults already caught in this project (check for every one)

Each of these got past a maker and was caught later. Look for them before you call a figure done.

- Tube or capsule limbs with even width; limbs need muscle, bone and joint shape (`limb` bumps, `chain`, folds).
- Perfect circles or ellipses as body masses (a bloated corpse drawn as a ball). Flesh sags toward the ground.
- Smooth mannequin surfaces: hands with no knuckles, creases or nails; skin with no mottling, veins or wear.
- Cartoon faces: big round staring eyes, simple features. Faces carry age, weight and expression.
- Objects facing the camera instead of the user (books, hymnals, flasks, hourglasses).
- Fists set by hand at the wrong angle, so the knuckles face the forearm or the fingers point away from the body.
- Heads jutting ahead of the neck and spine; hunch comes from the upper back.
- Blades, poles or rods crossing the holder's own face; a raised arm crossing the face.
- Hands that "hold" nothing or sit beside what they hold; props attached to nothing (knots, straps, chains).
- Symmetric, mirrored arm poses; large flat empty areas; missing course marks (every void-world creature needs a void mark).
- Two foes in one world reading as the same silhouette (veiled robed columns are an easy trap).
- Rig: parts not drawn complete under the pose, shoulder armour on the arm bone, a two-handed hold that will need IK (note it).
- Crab, insect and centipede legs drawn as thin high-arching sticks (reads as a spider). Legs are thick jointed segments, low and splayed, tips planted.
- Heads or bodies as spheres, eggs or domes with a face painted on (balloon heads, giant skulls). Pressure stretches skin unevenly; weight sags it.
- Boxy bodies built from stacked rectangles and slab limbs (armour, automatons, ogres). Plates follow a body underneath and have thickness.
- Faces lit flatter than the reference figures: face shading about 0.7 to 0.85, as on Mother Hild.
- Large flat cloth areas (gowns, shawls, shrouds) with no folds, stains or wear.
- `groundY` not set to canvas height minus 30, so rig.json carries the wrong ground line.
- Lightning drawn as arcs or bolts in the air on a figure. Ruling (2026-11-23): figure art carries only the course's
  marks (branching burns, fused metal and joints, standing hair and bristles). Arcs and strikes are animation effects
  the engine spawns per frame, never baked into a figure. Existing figures with baked arcs move them to an FX layer in
  the consistency pass.

## 9. Bloodborne, adapted to Ostium (Cole, 2026-11-23)

Cole named Bloodborne as a touchstone, with a condition: **take only ideas that fit Ostium's lore and make sense in
it, never its design language wholesale.** Ostium's rule stays the test for everything: every body was a human place,
a trade or an animal before a Conjunction remade it; the silhouette says what it was, the course says what happened
(bible 00). Bloodborne's horror has a different cause (a blood plague, beasthood, cosmic insight), so nothing is taken
for its own sake. Take its methods, never its designs: no copied monsters, costumes, weapons or logos.

**Adopted, because the lore already asks for it:**

1. **The former self stays readable.** Bloodborne keeps the person inside the beast; Ostium's bible already demands
   that the silhouette says what the creature was. Keep at least one readable remnant of the trade or rank (a work
   apron, a stole, a ship's whistle, a guard's belt).
2. **One part pushed hard, and it is the course's mark.** Bloodborne distorts one feature far past human. In Ostium the
   distortion has a cause: the dominant course does it (water bloats a throat, fire splits a back, frost stills a limb
   mid-gesture, toxin swells a gland, lightning fuses a joint, void removes a part cleanly). Push that one mark hard and
   keep the rest believably human or animal. Never distort a body for horror alone, and never in a way its courses
   cannot explain. The body keeps the guide's weight and 6.4-head mass.
3. **The outline is broken the way the course breaks it.** Bloodborne's ragged silhouettes become course-specific:
   water hangs wet, heavy and plumb (kelp, torn cloth, hair); fire chars hems into split, curled edges; frost freezes
   them stiff with icicles; toxin rots them into holes and mould fur; lightning frays and fuses them; void cuts clean,
   round bites out of them (never ragged). A closed, untouched outline on a foe is a fault.
4. **Hair, fur and sinew with structure.** Clumped, directional masses that follow the form, matted by the course;
   tendons, ribs and knuckles showing wherever flesh is stretched or starved. This is the guide's anti-mannequin rule
   done well, not a new look.

**Taken only where the world's bible supports it:**

5. **Corrupted clergy and relics** belong to worlds whose bible has a church, an order or a relic (the Drowned
   Kingdom, the Boiling Baths' temple, the Hollow Barrow's household chapel, and so on). Not every world gets one.
6. **Layered heavy dress, cages, bindings, lanterns and bells** where the creature's trade gave it those things. The
   period is the bible's: coasts, mines, foundries, abbeys and kingdoms, never Victorian Yharnam (no frock coats,
   top hats, tricorns or hunter's trench coats unless an entry calls for them).

**Rejected, because Ostium already decides it differently:**

- **Beasthood as a cause.** Ostium's creatures are remade by courses, not turned into wolves. A beast appears only
  where the bible lists an animal.
- **Eyes and insight as a general motif.** Eyes stay in the void worlds only, as the bible's void course allows.
- **Bloodborne's palette and lighting.** Each world keeps its own palette, the Living Ink settings and the one key light
  from the upper left; no rim lights or fog added per figure.

When in doubt, the test is one sentence: *which course did this, to whom, and does the bible say so?* If the answer
is "it looks like Bloodborne", cut it.
