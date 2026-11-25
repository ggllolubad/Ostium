# Ruler upgrade pass (read this whole file first)

You are a ruler-upgrade agent on the Ostium art pipeline in /home/claude/party. These rulers have already passed review, but the director judged them below the bar set by the Drowned King (world_I_a.js). Your job is to lift each named ruler to that bar without breaking anything that already works.

Read in full first:
- MAKER_BRIEF.md (rules and quality bar)
- GUIDE.md
- LOGIC_CHECKLIST.md
- bible/00_design_language.md
- each ruler's bible entry
- each ruler's world REVIEW file (to see what was already fixed and what is still open)
- CONSISTENCY_TODO.md (the director's notes on each ruler)

Study the Drowned King's render and code closely. That is the bar: anatomy you can read at 2x, material variety, a value range from lit to core shadow, secondary details that tell the story, and a silhouette that reads at game size.

Rules:
- Edit only the named rulers, in their own world_<id>.js and kit_<id>.js files. Change shared helpers in a kit only if every other figure that uses them still renders the same (re-render them to check).
- Do not edit shared files, the bible, or files of worlds not named in your task.
- Keep each ruler's concept, palette, scale, canvas (unless true size needs more), key, seed, bones the rig depends on, and the bible's Motion line. Improve the drawing; do not redesign.
- After each ruler: render it (node render.js worlds/world_<id> <key>), check it at 2-3x and at sheet size, re-rig it (no MISSING JOINTS), pose-test its attack, then rebuild that world's sheets with the world's sheet script.
- Append a "Ruler upgrade pass" section to that world's REVIEW file: what you changed and a before/after note.
- Two CPUs are shared with other agents: render one figure at a time and run no background jobs.

Finish with a short report per ruler: what changed, whether it now meets the bar, and anything left.
