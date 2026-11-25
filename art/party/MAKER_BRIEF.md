# Maker brief (read this whole file first)

You are a maker agent on the Ostium art pipeline in /home/claude/party (Node SVG figure engine rendered with
Playwright, PIL for composites). Your task message names the world, the batch (first batch of 8, or second batch "b"
of 11) and the exact creature list. Build exactly those creatures; read the world's other bible entries only so yours
do not share a silhouette with them.

## Read first, in full
GUIDE.md (section 2: true size wins over the tier canvas, widen or heighten a canvas at the same pixel scale or let
the frame crop rather than shrink; section 8, every fault already caught, including: no lightning arcs or bolts baked
into figures, strikes are engine effects; section 9, Bloodborne adapted to Ostium: only ideas the lore supports, test
"which course did this, to whom, and does the bible say so?"), LOGIC_CHECKLIST.md, bible/00_design_language.md, the
world's bible file, REVIEW.md, and the world's existing review files (worlds/world_<roman>*_REVIEW.md) if any.

Open dirAC.js and dirAC2.js and copy their construction habits (limb bumps and folds, spine(), B.grip for every hold,
fist flip, cast shadows, Living Ink settings from kit.base/kit.foeBase). Study reviewed worlds for habits that passed
(all worlds/world_*.js and their kit_*.js). Useful references after review: world_I_a.js (the Drowned King: the ruler
bar), world_III.js and world_III_b.js (boiled flesh, the modelled fist), world_IV.js (Pit Crawler: arthropod plates and
jointed legs), world_V.js (Anvil Titan, Cyclops Smith: giants and plated bodies), world_VI.js (wings with slotted
primaries and layered coverts), world_VII.js (Walrus, Ice Eel: animal mass; frost), world_VIII.js (Magma Hound:
quadruped legs; cracked course boundaries), world_IX.js (Barrow King: seated ruler; Plague Wolf), world_XII.js (hair
hanks, void holes), world_XIII.js (black flame as joined curling tongues, Cinder Hound), worlds/keepers.js (faces,
tableHand). For a second batch, require the world's own kit (e.g. require("./kit_VI")) so your batch matches the first
batch; never edit the first batch's files.

## Files and rules
- Your files: worlds/world_<id>.js and worlds/kit_<id>.js (id = roman numeral, plus "_b" for a second batch),
  worlds/world_<id>_REVIEW.md, out/worlds/<id>/, out/worlds/world_<id>_*, out/rig/worlds/world_<id>_*.
  Scratch files in /tmp/claude-0/-home-claude/b481cb9f-fd90-5adc-8daf-8b9ac366d903/scratchpad/w<id>/.
- Do not edit shared files (engine.js, body.js, gear.js, kit.js, render.js, render_rig.js, posetest.py), the bible,
  or any other world's files.
- Export { heroes: [ { key, name, tier, w, h, flip, build } ] }. Seeds: roman*100 + index (first batch) or
  roman*100 + 20 + index (second batch). Foes face left via foeBase + flip: true. groundY = canvas h - 30 in every
  figure's options. Rig-tag everything: joints first, f.bone before each part, parts drawn complete, overlap at
  joints, shoulder armour on torso. Rulers' bones follow their Motion line.
- Use only the world's palette plus ink black, bone and grey. Gold only on holy things (and as the Torn Sky's file
  says); red only for blood, doom and rubric; eye motifs only in void worlds.

## Quality bar (faults the director has rejected; check each figure for every one)
Tube limbs, tentacles or bodies of even width; bodies or heads as balls, eggs or domes; boxy bodies of stacked
rectangles; buildings, ships and machines as flat fronts without depth; thin stick legs on animals or insects (deep
chest, tucked waist, elbow/hock/pastern angles, weight-bearing feet; insect legs thick-based and jointed); mannequin-
smooth skin and hands without knuckles (use a modelled fist, not the bare shared B.fist block); cartoon faces and big
round staring eyes; flat creatures with no volume; large flat cloth areas; objects facing the camera instead of their
user; hands near but not holding things; props attached to nothing; faces lit flatter than the references (face shading
about 0.7 to 0.85); hair as parallel stripes; flames as rows of identical triangles; course splits as ruler-straight
lines. Rulers must reach the Drowned King's level of anatomy and detail. No two creatures in the world may share a
silhouette. Grit: foes 6+, elites 10+, rulers 12+ secondary details.

## Workflow per creature
Build, render with `node render.js worlds/world_<id> <key>`, composite on a mid-dark ground, zoom 2-3x on head, hands,
held objects and feet, and look at the pixels with the Read tool. Also check it at sheet size (a human about 190 px).
Fix. Then `node render_rig.js worlds/world_<id> <key>` (no MISSING JOINTS) and a pose test of its attack with
posetest.py into out/worlds/<id>/<key>_pose.png; look at it; fix tears. Only 2 CPUs are shared: render one figure at a
time, no background jobs.

## Deliverables
- out/worlds/<id>/sheet.png: your creatures at true relative scale on a dark ground, human-readable names, the Drowned
  Thrall from dirAC2 as human reference. For a second batch also sheet19.png with all 19 of the world (existing renders
  out/worlds/world_<roman>_<key>.png for the first 8).
- out/worlds/<id>/sil.png: silhouettes at game size (all of the world's creatures built so far).
- worlds/world_<id>_REVIEW.md with both gate tables (logic audit; style and detail including a section 9 line), figure
  by item, pass/fail and the fix; every fail fixed and re-checked.
- Finish with a short report: creature list with tiers and canvases, anything unresolved, and holds that need IK.
