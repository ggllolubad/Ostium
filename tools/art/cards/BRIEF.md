# Card art: gritty pass (brief)

**Read `cards/LESSONS.md` first.** It is the running record of every mistake and the rule and check that prevent it. Add to it after every review.

## What Cole asked for (2026-11-25, his words)

- "the card art can be a little more symbol and less literal, think on the order of slay the spire 2 where it's a depiction of the act but not like EXACTLY it every time"
- "some should be more abstract like your examples and some should include a character like sts2. keep the art closer to the rest of the games look and vibe"
- "i think they could still match the gritty style more. have the art agents work on them more"

## Where things stand

- Samples: `/home/claude/ostium/build/emblem/contact.jpg` (8 cards, 560x306 each).
  - Character cards: `bw_mace_blow`, `du_two_step`, `el_ink_bolt`, `bw_brace`.
  - Abstract cards: `al_plague_flask`, `or_stolen_hour`, `silver_lie`, `el_strike_the_ring`.
- Generator: `/home/claude/ostium/tools/art/emblem.py`. It draws hand-written SVG and renders with Chromium.
- Character figures come from `card_figure.js` in this folder. It poses a hero as vector SVG, rotating each run about its bone chain's rest pivots, so a hero can be cropped at any size: `node card_figure.js dirAC bulwark '{"upperarm_n":-40,"hand_n":70,"lean":4}' out.svg`.
  - Heroes: `dirAC` (bulwark, duelist, elementalist) and `dirAC2` (alchemist, oracle, hexweaver).
  - Path variants: `worlds/hero_paths_A`, `worlds/hero_paths_B` (key `<calling>_<path>`).
  - Vessel: `worlds/hero_vessel`.
  - Joint names come back on stdout.
- Card data: `/home/claude/ostium/data/cards.json`. The fields that matter here are `name`, `text`, `cat` (course), `target`, `cls`, `sub` (path), `rarity` and `note` (a literal art note: use it for content, not as a scene to copy).

## Why the samples miss

The heroes are drawn in Living Ink: `kit.base` cel shadow band with ink crosshatching, a variable ink outline, one key light from the upper left, and grit everywhere (wear, mud, scratches, no clean flat area bigger than a palm). Next to them the samples look clip-art:

- The abstract objects (hourglass, mirror, bell, flask) are flat vector fills with an even outline and no wear.
- The grounds are clean gradients and tidy ray lines.
- The FX (impact bursts, slashes, arcs) are crisp geometric shapes.

## The job

Rework all eight samples so each reads as made by the same hand as the figures and battle rooms. Keep the two kinds:

1. **Character cards:** a posed hero, cropped close (StS2 framing), with the act shown by FX and composition. Use `card_figure.js` for the hero. Fix the poses where needed: Ink Bolt currently hides the Elementalist's face. A foe can appear as a partial silhouette or fragment at the frame edge if it helps.
2. **Abstract cards:** a single object or device standing for the act, built with the figure kit (`engine.js` / `kit.js` / `gear.js`: `Fig`, `f.part`, `f.line`, the same `kit.base` render settings). Then it gets the same shading, hatching, outline weight and wear as the heroes. Six or more secondary details each: chips, rust, stains, cracks, wax drips, string, labels, dents.

For both kinds:

- **Grounds:** gritty, not gradients. Options:
  - the card's world room art (`/home/claude/ostium/assets/art/rooms/<room>_far.webp`, `_mid.webp`), cropped, darkened and washed in the course colour;
  - stained, soot-marked paper and grime built with the kit.
  - Keep a focal pool of light behind the subject so it reads at card size (about 170 px wide in hand).
- **FX:** ink as it is in the game: dry-brush strokes, splatter, ragged edges, hatched motion lines. No clean stars or perfect arcs.
- **Colour:** follow `bible/00_design_language.md`:
  - each course's palette;
  - gold only on holy things;
  - red only for blood, doom and rubric.

Read `GUIDE.md` sections 1, 5, 6 and 8 and `bible/00_design_language.md` before drawing.

## Deliverables

- A card art module in this folder: for example `cards/card_kit.js` (shared grounds, FX, object helpers) plus `cards/samples.js` (the eight compositions). It must render each card to `/home/claude/ostium/build/emblem2/<id>.jpg` at 560x306 (draw at 1120x612, then downscale), plus a `contact.jpg` of all eight.
- Build it so it can later run over all 744 cards from card data: one composition per card kind (attack, block, status, rite, flask, curse...) driven by course, target, calling and path, with per-card overrides.
- A short `cards/NOTES.md`:
  - the style rules you settled on;
  - which card kinds get a hero and which get an object;
  - what is data-driven and what needs a hand-made override.

## Rules

- Do not edit the frozen shared files (`engine.js`, `body.js`, `gear.js`, `kit.js`, `render.js`, `render_rig.js`, `posetest.py`). Add helpers in your own files.
- Do not touch the game's scripts or data in `/home/claude/ostium`, and do not commit there. Write only under `build/emblem2/`.
- Only 2 CPUs: render one card at a time and leave no background jobs running.
- Review gate before you report: open each card at full size and at 2x on the subject, and put it beside a hero render (`/home/claude/ostium/assets/art/rigs_li/bulwark/full.webp`). If an object looks cleaner or flatter than the hero, it is not done.
- No em dashes or double hyphens in any text you write.
