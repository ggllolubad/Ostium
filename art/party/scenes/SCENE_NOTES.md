# Scene conversion to Living Ink: notes (2026-11-24)

Pilot (v1) first, then the v2 round: the director's critique fixed in the kit and the two pilot scenes, and three more hub interiors (Sacristy with its Teeth panel, Scriptorium, Smithy). The v2 section is at the end; where it changes something said above, v2 wins.

Pilot A: the Guesthouse interior. Pilot B: the Drowned Kingdom nave battle room.
Renders: `out/scenes/pilot/`. Code: `scenes/`. No shared figure files were edited.

## Approach: new scene kit, grim geometry ported

The geometry was ported into a new Living Ink scene kit (`scenes/lik.js`). The grim kit was not restyled in place, for three reasons:

1. **The grim engine is missing.** `gr.js` (the grim `Art` class) is not on this disk. It is in the project doc `art-root-01`, which this session cannot reach. Without it the grim scripts cannot run at all.
2. **The grim materials bake in gradients.** Every grim face is filled through `fshade`, `bshade`, `aoshade` or metal gradients. Living Ink needs a cel band, hatching and variable ink instead, so a "restyle layer" would have had to replace nearly every material call anyway.
3. **The grim kit's useful parts are small.** The camera, the plane, depth and emissive tags, the lights, hotspots and containment are about 60 lines of `scenekit.js`. They are ported unchanged into `lik.js`, so the outputs keep the game contract.

What `lik.js` does:

- **Matching the figures' scale.** A 1.0 human is 640 figure px and 1.75 m tall. At depth Z, one figure px is `sc(Z) = K(Z) / 365.7` screen px. Ink 1.6 and heavy 3.6, and hatching 6.5 apart, are the `kit.base` values times `sc(Z)`. Floors stop far walls from going grey.
- **One key light.** It comes from the upper left, behind the viewer's left shoulder. The vector `[-0.55, 0.62, -0.56]` is the same one the game's lighting uses (`grim/light/look.json` key_dir). Planes facing the light stay clean, mid planes get a single hatch, and planes facing away get crosshatch. The hatch is laid in the plane and projected, so it converges with the room.
- **`cel()`**, the core of every flat shape. It gives each stone, board or slab:
  - a base tone;
  - its own shadow band, shadow tint and hatch on the edges that face away from the light;
  - a worn-bright edge on the lit side;
  - thin ink all round and heavy ink on the shadow edges.
- **Materials.**
  - `masonry`: chipped blocks with pits, cracks and masons' marks, plus weathering for sea worlds (algae, salt crust, barnacles).
  - `boards`: grain, knots, nails, splits, stains, butt joints.
  - `limewash`: brush marks, rising damp with a salt line, run streaks, and flakes with stone showing through.
  - `soot`: built from hatching.
- **Cast shadows** come from the same light vector. They are cel shadows (ink tint plus hatch), never blurs.
- **Props** (cloth, crockery, the fire, the key, the ship, the lamp) are drawn with the figure engine itself (`engine.js Fig`, the keeper light `KB`), at figure scale. They are then scaled by `sc(Z)`, so they shade exactly like a figure standing at that depth. Builders are in `scenes/props_li.js`.
- **No flat fills.** Every large area carries tone variation, a texture pattern and hatching. Gradients appear only in painted glows (class `glow`, dropped by the game's lit passes) and in the window glass of the nave.

## What the game must keep (unchanged contract)

### Interiors (`grim/hub/int/<room>…`)

- **Frame and camera.** The frame is 1600 x 1000. The camera has horizon 430, eye 1.6 m, focal 900 and cx 800. The room box, door, furniture positions, keeper spot and roster spots are the grim numbers.
- **Files.** Same names as grim:
  - `<room>__bg.svg`, `__mid.svg`, `__fg.svg` and `__fx.svg`;
  - `<room>.svg` (all layers);
  - `<room>.light.json` (camera, planes, lights);
  - `<room>_hotspots.json` (exit with its 3D outline, the panel, keeper, roster, draw order).
- **PNGs.** The PNGs of each layer are rendered here too (`<room>__<layer>.png`).
- **Tags.** The tags are the grim tags: `pl_<i>`, `z_<Z*100>`, `em`, `glow`, `panel`. The wobble filter is named exactly `wob`, so `passes.py` keeps it in the normal and depth passes and they line up with the albedo. The grit filter is a separate `grit`, and the passes drop it.
- **Lights.** The Guesthouse light list is identical to grim's: 8 lights, same positions and intensities. The exit hotspot polygon is identical.
- **Proof that it loads.** `grim/light/interior_lit.py` (the game's reference renderer, rsvg-based) was run unchanged on the new layers in a staged copy. It produced `guesthouse_lit_check.png` and regenerated the keeper, hero and guest-book hover outlines (`states/`) and click polygons. The shipped `guesthouse_hotspots.json` is that regenerated file. Two caveats:
  - Run the game's Godot parity check (`build_interiors.sh`) once on a real game checkout to confirm.
  - Found while staging: `interior_lit.py` writes the hero outlines before it creates `hub/int/states/`. Create that folder first.
- **Keepers.**
  - Living Ink keepers face right. The Hosteller must face left in this room, toward the desk.
  - `scenes/figs.js … mirror` renders him with the key light mirrored (as `kit.foeBase` does) and unflipped: `figs/hosteller_mirrorlight.svg`. The room's keeper entry says `flip: true`, so the exporter mirrors him back with the light still at the upper left. Use that file as `keepers/hosteller.svg`.
  - `figure` is now `[144, 790]`, the Living Ink canvas's figure top and ground line. `height_px` is now 349.4, giving a true size of 646 px = 1.77 m at Z 4.55.
- **Roster.** `height_px` keeps the loader's old formula (scale = height_px / 620), with values set so that 640 px Living Ink heroes come out at true size: 1.0 human = 1.75 m at that depth.
- **Layers stay person-free.** The keeper, the Vessel and the two heroes are composited only in `guesthouse_preview.png` and the lit check.

### Battle rooms (`grim/bg/<room>_{far,mid,fore}…`)

- **Files.** Same names and the same 1480 x 480 viewBox: `nave_far.svg` (opaque), `nave_mid.svg` and `nave_fore.svg` (transparent). The PNGs are rendered at 2x (2960 x 960).
- **New, written down for all 47 rooms.** Every room should use one battle camera, recorded in `nave.camera.json`:
  - horizon 300, eye 1.2 m (a standing human's chest, as the bible says), focal 652, cx 740;
  - fighters stand at 6 m with their feet at y 430;
  - a 1.0 human is 190 px tall at 1x (figure scale 0.297, 0.594 at 2x).

  The grim rooms had no 3D camera. This one keeps their horizon (300) and floor band.
- **Quiet zone.** Fighters cover y 230 to 430. In that band the far layer is darkened in steps toward the murk, and the mid layer holds only low, dark, low-contrast things. Detail goes above the capitals and into the fore edges.
- **No lightning** is drawn anywhere: no arcs or bolts. Light shafts are pale water light from the upper left.

## Lore content placed

- **Guesthouse: the Hosteller hints.** None of them is stated.
  - **The guest book.** Oak boards, iron corner bosses and a crude strap and clasp. The page block is a hand thick and built of gatherings sewn in over centuries: its edge shows bands, brown at the bottom and paler above. It lies open near the end, with the old leaf brown and the new leaf pale. It has a rubric margin, a ribbon and a slip of newer paper tucked in.
  - **The key.** A heavy, hand-forged iron key, longer than a hand, hangs by a thong from the desk.
  - **Masons' marks** are cut into some of the oldest hearth stones.
  - **His broken, callused hands** are on his figure (`worlds/keepers.js`).
- **Nave: World I.**
  - The cathedral: pointed arcade, aisle lancets lit by the sea above, verdigris, salt crust, barnacles and kelp hanging plumb.
  - Void, kept clean-rimmed: a perfectly round void hole through a spandrel (with a faint violet rim, as on the Drowned King), a round hole cut through one lancet, and a round bite out of a ledger slab.
  - A sailors' votive ship hung in a bay.
  - A drowned sanctuary lamp in tarnished gold. This is the only gold, and it is on a holy thing.
  - The cathedral's bell rope hanging cut and frayed. Its bell is the Bell Below.
  - A fallen bronze corona, toppled pews, and ledger slabs with incised crosses.

## How long a scene takes

- **Machine time** is small:
  - building an interior's SVG: 0.3 s;
  - rendering 4 interior layers in Chromium: about 6 s;
  - the game's lit check (rsvg plus numpy): about 80 s;
  - a battle room's 3 layers at 2x: about 16 s.
- **Authoring time** is the real cost. The kit is done. For reference, this pilot took one session for the kit plus both scenes, with about 5 look-and-fix loops each.
  - **Interior:** about 1.5 to 2.5 hours of agent time. Porting the grim layout is mechanical. The time goes on props, the lore details and 3 to 4 fix loops at 1x and 2x.
  - **Battle room:** about 1 to 1.5 hours. Within one world, rooms share the world kit (arcade, materials, palette), so rooms 2 and 3 of a world go faster.

| Remaining (after v2) | Count | Estimate (agent hours) | Notes |
|---|---|---|---|
| Interiors | 4 | 4 to 6 | Infirmarium, Almonry, Cellarium, Chapter (Aldric). The shell now has vaults, arched doors, back windows, back doors are still to port (`grim/interior.js backDoor`). |
| Garth | 1 | 4 to 6 | Large, many buildings. Port `grim/garth.js` buildings onto `lik.js` (roof and window builders still to port). The belfry must read as empty, with no bell. |
| Panels | 7 | 3 to 4 | The Sacristy panel is done (`scenes/panel_sacristy.js`); its frame, plate, dish and knocker are the shared shell for the other seven. |
| Title sky | 1 | 1 to 2 | The belfry must read as empty. |
| Battle rooms | 46 | 40 to 60 | Build one world kit per world (palette, architecture, course marks), then 3 rooms each. Do them world by world so one agent owns a palette. |

Parallel agents are fine if each owns a world or a room. Render one thing at a time on the 2 shared CPUs.

## Known limits and next steps

- **The grim originals in `old_vs_new.png` are approximate.** They were re-rendered with a stand-in `gr.js`, rebuilt from the grim scripts' calls (in the scratchpad, not shipped), because the original engine file is not on disk. They show the grim layout and fill style faithfully enough to compare. Exact grim pixels need `art-root-01` unpacked.
- **Each layer SVG embeds the whole room's defs**, so the files are 0.4 to 2 MB. This is fine for the build. If size matters, trim unused defs per layer.
- **Guesthouse.** The upper bunk's top is edge-on at eye height, so it reads by its front: the rail, the blanket drape and the posts. The beams are hatched dark; in the lit game render they read as the dark ceiling grim had.
- **Nave.**
  - The aisle lancets' leaded panes read slightly regular at 1x.
  - The contact shadows in the preview are preview-only. The game should draw its own under fighters.

## v2 (2026-11-24): the director's critique, and three more interiors

### Kit changes (`scenes/lik.js`, `int_shell.js`, new `dress_li.js`)

- **Value grading.** Every shell plane (walls, floor, ceiling, each vault course) now gets zone hatching: ink laid only where a darkness value passes three thresholds (single hatch, cross, a third close hatch). Darkness = light falloff from the room's own lights (`lightAt`, no occlusion) plus occlusion into the plane's edges (corners, under the ceiling, the floor seam), plus a bias for ceilings and vault crowns and a darker band at the floor's front edge. It is computed at write time (deferred slots), once every light is known. The runs end raggedly, so the steps read as ink density, not as a gradient.
- **The preview veil.** The fx layer gets a stepped dark veil cut back round each light in ragged discs, heavier at the top, the bottom and the corners (class `glow`, so the game's lit passes drop it; in the game its own lights do this). It is what makes the unlit previews read warm near the fire and dark in the corners.
- **Wall wear** (`I.wear`): patches of newer limewash or plaster (square repairs on stone), branching cracks with a lit lower lip, damp bloom (mould spotting with salts at its edge), soot climbing from lamps and hearths. Pegs and nails with things hung on them (`dress_li`: hat, bag, rope, ladle, herbs, a cold lantern, cloak, belt, horseshoe, sickle, cup, shirt).
- **Floor clutter** (`dress_li`): strewn rushes and straw laid flat in the floor plane, drifts of them banked along walls and under tables, a rag rug with real relief (rucks lit on their near side and shaded beyond, a kicked-over corner showing the sacking, with thickness and a cast shadow), a cloak dropped spread on the floor with crumple ridges, a doubled-back half, a turned lining corner and its hood heaped at the collar.
- **Ashlar** (`ashlar`): dressed stone of uneven sizes in mixed courses (thick, normal, bands of thin slips), tooling marks, spalled faces (a recess shaded at its top left with a lit lip below), mortar washed out of some joints, salt crust along the beds, barnacle bands at given heights with a tide-line stain. Interior stone walls and floors use it at small scale (`stone: 'ashlar'`).
- **Void bites** (`voidBite`): a hole eaten into a plane by overlapping round bites, its outline traced exactly as the union of the circles (clean rims), the cut through the wall's thickness shown as a pale fresh-cut face with coursing, a black void, a faint violet edge, cracks running out of every cusp where two bites meet, ragged hatch shading the stone round it. Works on walls and floors (`dir`).
- **Shell**: barrel vaults (stone courses along the room, each course its own plane for the lighting), transverse ribs, arched doors with jambs and voussoirs, back windows with reveal, bars and a light shaft, door options for a custom light, outline and the passage beyond (the smithy's stair). `I.write` takes the layer list and draw order (the smithy has no mid layer, as in grim).
- **Figures** (`scenes/figs.js`): an extra argument drops bones from a keeper, so a keeper's own furniture (Ide's relic case, Lucan's desk) is left out when the room draws its own.
- **Preview** (`comp.py room …`): any room; it honours `over_cut` the way `interior_lit.py` does (the keeper's hands and arms drawn again over the mid layer above the cut).
- **Build**: `sh scenes/build_room.sh <room> <scene.js> <outDir> <figsDir>` runs the scene, renders its layers one at a time and composes the preview.

### The pilot scenes, fixed (`out/scenes/pilot/`, `old_vs_new.png` now shows grim, pilot v1 and v2)

- **Guesthouse.** Graded (corners, ceiling and the front of the floor dark, warm round the fire, the table candle and the Hosteller's lantern). Rushes over the boards, drifts along the walls and under the table, straw spilled under the bunks, a rag rug before the hearth, a dropped cloak and a boot kicked over in the front. Limewash patched, cracked, sooted beside the chimney breast and above a snuffed rushlight sconce, damp blooming low in the corners and under the roof; a peg rail with herbs, a cold lantern, a ladle and a satchel between the bunks and the hearth; a horseshoe and a sickle on nails; the company's hat, belt, cloak and bag on pegs on the right wall. Lights, planes, exit and draw order unchanged (checked against the grim JSON).
- **Nave.** Ashlar walls (the arcade, the aisle wall behind it, the fore piers). Bay by bay: a collapsed arch (half its ring and the wall over it fallen, broken course ends round the breach, the rubble heaped in the opening and spilled onto the nave floor, one whole voussoir lying in front), a bay choked with kelp from crown to floor with holdfasts rising, a sunken knight's tomb in the aisle behind a bay, a silted bay, a slipped voussoir, a dropped keystone. Every lancet a different end: intact but dark, panes gone dark, upper panes gone, all glass gone with kelp growing through, the mullion fallen with the leads sagging and silt on the sill, and a void bite through one. Every pier a different growth (mussel beds, anemones, a sponge on the capital, a rotten mooring rope, a broken capital). The void at the spandrel over the pier at X -5 is now a ragged bite of five overlapping round bites that eats into both neighbouring arch rings; the ledger slab's bite is the same kind. The fighter band stays dark and low-contrast (the collapsed rubble, kelp, tomb and silt are all kept in the murk tones there).

### Three hub interiors (`out/scenes/hub/<room>/`)

Each has `<room>__bg/mid/fg/fx.svg` and `.png` (the smithy: bg, fg, fx), `<room>.svg`, `<room>.light.json`, `<room>_hotspots.json` (regenerated by the game's `interior_lit.py`, run unchanged in a staged copy), `states/` (hover outlines), `<room>_lit_check.png` (the game's lit render) and `<room>_preview.png` (unlit, with the Living Ink keeper). Checked against the grim JSON: the exit polygons are identical, the light count, positions, intensities and ranges are identical, the hotspot keys and draw order are the same.

- **Keepers** (`out/scenes/hub/figs/`): `ide`, `lucan` from `worlds/keepers.js` (their own furniture bones dropped), Mother Hild from `dirAC2.js` (`smith`). All three face left toward their object, so their entries say `flip: true`; use `<name>_mirrorlight.svg` as the game's `keepers/<sprite>.svg` (mirrored light, unflipped; the exporter flips it). `figure` is [top of the drawn figure, 790], `h` is true size (640 px = 1.75 m): Ide [179, 790], Lucan [193, 790], Hild [227, 790].
- **Sacristy.** Ashlar walls, barrel vault with its rib, rime along the wall feet and icicles on the rib, the vestment press with one leaf open on its vestments, the altar shelf with its frontal, missal, the Teeths' travelling casket (shut), an altar cross and two lit candles, the dark sanctuary lamp, the cold thurible, the processional cross and staves, coffer, brazier, sand bucket, prie-dieu, the iced holy-water stoup, wax and a dropped corporal. **The case of the Teeth** (the `reliquary` hotspot): a sloped-lid vitrine at the height Ide's hand rests on (her figure lays her hand flat on its glass), fifteen velvet niches in three rows of five, a Tooth in each, warm; frost feathering the glass except where her hand lies; the older relics (skull, silver arm, finger bones) on the shelf below. Two deliberate changes from grim: the case's light (light 4, same position and strength) is warm, not cold, because the Teeth are warm; and the altar's warm light now comes from two lit candles (grim's came from the casket of Teeth, which now lie in the case).
- **The Teeth** (`props_li.js TEETH, tooth`): fifteen, one per world, each a different tooth built from crown and roots (fangs, molars with two or three roots, incisors with a cutting edge, a tusk, a hooked fang, a needle, a chisel, a worn three-rooted root, the Torn Sky's five-cusped crown). Each carries its world's two courses (bible 00): water barnacles and verdigris; void a round bite masked clean out of the crown and a small hole through, and in the Blighted Garden's an eye in the bloom (void world); fire a glowing split seam and a charred edge; frost rime on the windward flank and an icicle from the root; lightning a branching burn scarred into it (clipped to the tooth, never in the air) and a fused bronze cap; toxin pustules, mould fur or a fruiting cap; the Torn Sky's gold leaf cracked over black. All warm: warm ivory with amber dentine glowing at the neck and in a crack.
- **The Sacristy panel** (`scenes/panel_sacristy.js` → `out/scenes/hub/panels/`): the grim panel's layout kept exactly (`sacristy_layout.json`: title, dish, close, body, line, teeth, case, cloth), redrawn in Living Ink with the figure engine. The fifteen niches are drawn **empty** in `sacristy.svg/png`; each Tooth is its own sprite (`sacristy_teeth/tooth_<world>.svg/png`, sized to its niche, with its warm glow) and `tooth_slots` gives each one's rectangle, so the game shows only the Teeth brought home. `sacristy_panel_preview.png` shows all fifteen. The grim panel had the fifteen niches but no Teeth drawn.
- **Scriptorium.** Ashlar walls with plaster repairs, cracks from the window heads, soot over the carrels; three back windows with bars; carrels, book presses on the right wall and in the corner, a chair, pages drying on two cords (every leaf different), rush drifts, books on the floor, a knocked-over ink pot, a chained book on a lectern, a basket of vellum offcuts and a stool. **The stopped pocket watch** hangs on a nail on the front of Lucan's desk (brass, dented, the crystal cracked, its hands stopped at eight minutes to midnight), as on his figure. Nothing else in the room keeps time: the sand-glass on the left carrel has run out and lies on its side. One deliberate change from grim: the desk's back edge is lower (1.12 m, was 1.3) and the keeper's `cutY` is 1.08 (was 1.0), so Lucan's Living Ink figure stands behind the desk with only his arms and quill coming back over the page; with grim's numbers his belly was pasted over the desk top.
- **Smithy.** The vault, the arcade on its two round pillars, the forge and hood with its fire, the rack of steel and the rune bench (runes faintly alive), the order's niche, the peg board of hammers and tongs, the coal bunker, the quench cask and trough, the torch on the left pillar, the lantern over the anvil, the door in the right wall with the stair climbing beyond it and its two treads into the room; in front the anvil on its stump with a billet cooling (the `anvil` hotspot and outline are grim's), the lifting chain and hook, a dented breastplate, a leather bucket, a stool, a cask of scrap blades, the coal heap with its shovel. **No lightning is drawn** (2026-11-23 ruling): grim's static arcs up the hood are gone; the Storm Foundry coal shows only as blue tongues in the fire, blue glints in the coal and branching burns scorched into the hood. The blue light stays in the light file for the engine's effect.

### Timings (this session)

| Item | Machine time | Authoring (agent time, approx.) |
|---|---|---|
| Kit v2 (grading, veil, wear, dressing, ashlar, void bites, vaults, doors, windows) | – | 1.5 h |
| Guesthouse v2 | build + render 4 s; lit check 102 s | 0.75 h |
| Nave v2 | build + render at 2x 14 s | 0.75 h |
| Sacristy + the Teeth + panel | build + render 4 s; panel + 15 teeth 2 s; lit check 99 s | 1.5 h |
| Scriptorium | build + render 4 s; lit check 131 s | 0.75 h |
| Smithy | build + render 4 s; lit check 131 s | 0.75 h |

With the kit in place, a hub interior is now about 0.75 h of authoring plus about 2 minutes of machine time.

### Still open

- `interior_lit.py` writes outlines before creating `hub/int/states/` (create it first); in the staged run it regenerated the keeper, hero, guest book and codex outlines, and none for the reliquary and anvil (as in grim, which did not ship those either).
- The game's Godot parity check (`build_interiors.sh`) still needs one run on a real game checkout.
- The guesthouse's rag rug is half hidden behind the Hosteller; the nave's aisle wall, seen through the bays, still reads more regular than the arcade (it is deep in the murk).
- At room scale the Teeth read as fifteen small warm shapes; their course marks read in the panel.

## v3 (2026-11-24): the last four interiors and the other seven panels

With this round every hub interior and every shop panel is in Living Ink. Still to do: the garth, the title sky, the 46 battle rooms (see the table above).

### New and changed files

- **Rooms:** `scenes/int_almonry.js`, `int_cellarium.js`, `int_chapter.js`, `int_infirmarium.js` → `out/scenes/hub/<room>/`.
- **Shared room props:** `scenes/props_hub.js` (hung lantern and candle groups that register grim's exact light, helms, boots, packs, rope, mail, bowls, folded cloth, bottles, crocks, lead ostia, a bronze balance).
- **Panels:** `scenes/panel_kit.js` (the shared shell, moved unchanged out of `panel_sacristy.js`; the Sacristy panel now requires it and its SVGs and layout came out byte-identical), `scenes/panels_hub.js` (the seven panels and the UI sprites) → `out/scenes/hub/panels/`.
- **Tools:**
  - `scenes/check_contract.py <room> <dir>` checks a room against grim's JSON: camera and size, every light in order (position, strength, range, colour), the exit polygon and its 3D outline, hotspot keys, panel id, draw order, keeper spot. All four rooms pass.
  - `scenes/lit_check.sh <room> <dir> <sprite> <keeper_mirrorlight.svg> <stage>` stages a room and runs the game's `interior_lit.py` unchanged. It creates `hub/int/states/` first (the known bug), then copies back the rewritten hotspots and `states/`.
  - `scenes/panel_preview_all.py` lays each panel over its room preview.
  - `scenes/crop.py` makes zoomed crops for review.
- **Kit (`lik.js`, `int_shell.js`)**: all additions are opt-in, so earlier rooms render as before unless noted.
  - `ashlar({ rough, roughP })`: coursed rubble. Each course gets its own stone length, and a share of the stones (roughP, default 0.5) are lower than their course, with the gap packed by thin pinning slips. This is what breaks the brick rhythm on the Cellarium and Chapter House walls.
  - `limewash({ flakeStone: 'ashlar' })`: flakes show ashlar instead of regular masonry. Their outline is now an irregular blob; the old outline alternated radii and read as a star.
  - `I.stoneFace` and `I.stoneBox` take `{ ashlar }` (benches, the seat step, the lectern foot).
  - `vaultPlan` gives the vault course heights a mixed plan.
  - `floorOpts` passes options to the floor ashlar.
  - `jambFix`: back-window jambs now start at the sill. Before, they ran from the floor; that bug showed in the Chapter House, where the jambs were drawn over the Prior's seat. It is opt-in, so the earlier rooms are unchanged until they are next rebuilt.
- **Keepers (`out/scenes/hub/figs/`):**
  - All four face left toward their object, so their entries say `flip: true`.
  - Use `<name>_mirrorlight.svg` as the game's `keepers/<sprite>.svg`.
  - Their own furniture bones are dropped: counter, tally_board, lectern, table.
  - `figure` and true size `h`:

    | Keeper | `figure` | `h` |
    |---|---|---|
    | Fenn | [197, 790] | 1.62 m |
    | Godric | [196, 790] | 1.62 m |
    | Aldric | [120, 790] | 1.83 m |
    | Wenna | [177, 790] | 1.68 m |

### Four interiors (each: layers bg/mid/fg/fx as SVG and PNG, `<room>.svg`, `.light.json`, `_hotspots.json` regenerated by `interior_lit.py`, `states/`, `_lit_check.png`, `_preview.png`)

Contract checked against grim for all four:
- the same camera, room box, door and exit polygon (and its outline), light list in grim's order, hotspot keys (exit, ledger | tally | charter | table, keeper), panel id and draw order;
- the light values are grim's exact numbers, including candle groups whose light grim placed by formula.

Grim's `class="panel"` wrapping is kept where grim had it, the tally board and the charter. For those two, `interior_lit.py` wrote the click polygon and `states/<room>_<panel>_outline.png` from the art. The ledger and the table keep their 3D outlines, as grim shipped them.

- **Almonry (Fenn).**
  - **Room.** Plaster over rubble, flaked back to ashlar, patched, cracked and sooted. The back wall is shelved to the beams with every item its own: helms of three kinds with rust and tags, boots, packs, rope, mail, bowls, flasks, crocks and a cold lantern for sale. A price slate hangs on a post.
  - **Hanging stock.** Three cloaks for sale hang from the beam, and tallow dips hang in pairs by their wicks.
  - **Strongbox.** Iron-bound and padlocked, chained to a ring in the wall.
  - **The dole hatch.** Its far scene was invisible in grim: the far plane and the queue sat outside the narrow wedge the oblique hatch can see. They are now placed inside it, so the warm brazier light and a hooded woman holding up her bowl show through.
  - **The counter.** Scarred, with a notice nailed to its front and an alms-box lock plate. On it: the open ledger (red-ruled), inkhorn and quill, his purse, and two candles.
  - **Lore.** Fenn's oldest ledger lies closed at the left end of the counter under the pewter dish of lead ostia. Its fore-edge is stained sulphur yellow, darkest at a tide line, with crystals in the edge.
  - **Near floor.** Spears, a crate, a cracked shield, a sack and boots.
  - **Deliberate changes.**
    - The counter top is 0.96 m (was 0.86), because the figure leans on a 0.95 m counter.
    - The ledger sits at X 0.95 (was 0.7), so his spread hands land on its pages.
    - cutY/cutZ are 0.98/3.82 (over_cut 576), so his hands come back over the ledger.
    - The hatch reveal is 0.16 m deep (was 0.45 m) so the view shows through. It is drawn only inside the opening; no light or hotspot moves.
- **Infirmarium (Wenna).**
  - **Room.** Limewash flaking to ashlar, damp, cracks from the window; the order's iron cross with a rust streak; a chalked list of the dead, struck through.
  - **Left wall.** Shelves of jars and crocks.
  - **The ward.** Three beds along the back wall: a dead man under a drawn-up sheet, a sitter in a bloodied shift (behind Wenna), and a coughing man with blood on his blanket. Blankets are tented and lit and shaded; feet tent the near end.
  - **Back wall.** Linen screens, stained. The aumbry stands with one leaf hanging open on a broken hinge. Habits of the dead hang on pegs.
  - **Brazier and herbs.** The herb brazier: embers, half-burnt sage, thin smoke. Herbs dry from the beams in clusters.
  - **Behind Wenna.** The stretcher, and a basin of red water.
  - **The table.** A stained, bloodied sheet hangs over its front, with leather straps. On it: a basin, an instrument tray, a vinegar cup and candles.
  - **Near floor.** A bucket of rags with a bandage trailing, a chest of blankets, a slop bucket and mop, a stool with a bowl of leeches.
  - **Deliberate change.** The table runs to x1 1.7 (was 1.45; same height 0.82) so her flat hands land on it. cutZ is 4.55.
- **Cellarium (Godric).**
  - **Room.** Rough coursed rubble walls and a mixed-course vault with two ribs.
  - **Casks.** Racked two high, every head its own: boards, chime, hoop, chalk tallies. One is tapped, with its cup and a wet stain beneath.
  - **Candle rack.** Bundles of candles, a box of stubs, and new candles hung in pairs to harden.
  - **Other stores.** Grain sacks, one opened on its grain. The loaf board is slung from the vault. Hams, onions, garlic, dried fish and a sausage string hang from the vault.
  - **Near floor.** The ladder, a cask on its side on chocks, a turnip crate, a rat at its trap (a dark eye, no glint), wax drips and a rope coil.
  - **Deliberate change.** The tally board stands at x -0.9..0.3 (was -1.65..-0.45; same size). Godric's figure lays the one good finger of his far hand on its edge; at grim's place he pointed at air 170 px away. The tally candle's light stays at grim's spot, on a keg by the board.
- **Chapter House (Aldric).**
  - **Room.** Dressed stone in mixed courses with pinning slips (roughP 0.35).
  - **Floor.** Five abbots' tomb slabs, with incised effigies and croziers, worn lettering and cracks. A red runner with an ochre border pattern, trodden grey and patched.
  - **Bench.** The stone bench round three walls, with cushions, a cloak, a psalter, a cup, a sealed brief and a stub left on it.
  - **Back wall.** The memorial board of the dead brothers. The armarium, open on rolled charters.
  - **The Prior's seat.** Black oak on an ashlar step. Its vertical-board back carries blind tracery, crockets, finials, and the order's door and key carved in gilt. The two red banners hang either side. A lamp burns before the seat.
  - **Candle stands.** Three-branched and fat-guttered.
  - **The lectern.** The charter with its four seals, and a candle on its own stand.
  - **Near the front.** Benches and a near slab.

### Seven panels (`out/scenes/hub/panels/`)

Guesthouse, Almonry, Smithy, Infirmarium, Cellarium, Scriptorium and Chapter House. Each comes as `<name>.svg/.png`, with `<name>_layout.json` holding grim's areas exactly and `<name>_panel_preview.png` showing it over its room. `panels_v3_sheet.png` shows all seven.

- **UI sprites.** Grim's small UI sprites are in `ui/ui_*.svg/png`: btn (4 states), seal (3), slot (3), tab (2), portrait.
- **Slots where the game sets sprites** (receptacles drawn empty, as for the Teeth):
  - Smithy `rune_slots`: six socket rects in the slate tablet.
  - Smithy `hero_rows`: the four pocket rows of the tool roll.
  - Scriptorium `tab_slots`: eight tab positions in grim's tabs area. The preview shows ui_tab sprites in them.
- **Lore.**
  - The guest book's leaves are aged in bands; the oldest leaf is brown, the new leaf pale, and a newer slip is tucked in at the gutter. The heavy hand-forged iron key lies along the board's margin.
  - Fenn's sulphur-stained old ledger lies under his bronze balance.
  - Lucan's stopped watch (eight minutes to midnight, crystal cracked) lies by the inkpot.
- **Walls.** The Smithy and Infirmarium panel walls are uneven ashlar: mixed courses, mixed lengths, pinning slips, beds out of true.

### Rulings audit (grim vs the lore changes and rulings) and what was done

| Where in grim | Conflict | Fix in Living Ink |
|---|---|---|
| `int_almonry.js` balance, coin stacks, coins dropped on the floor, pack rivet (G.gold / goldL) | Gold on non-holy things; gold coin (the abbey pays in lead ostia) | Bronze balance with verdigris; stacks and dropped pieces are lead ostia; iron and lead fittings |
| `int_almonry.js` near shield (red with a bone chevron) | Red is only for blood, doom and rubric | Faded blue shield with a bone chevron and old blood on it |
| `int_chapter.js` runner border and lozenges, cushion tassels (G.gold) | Gold on non-holy things | Ochre wool |
| `int_chapter.js` memorial board heading (gold) | Gold on a non-holy object | Rubric line |
| `int_chapter.js` banner sigils, fringe, seat carving | (holy: the order's door and keys) | Kept gilt |
| `int_cellarium.js` rat with a white, glinting eye | Borderline staring-eye read; eye motifs are void-only | Dark bead eye, no glint |
| `panels.js` K.book brass corner pieces on the guest book and ledger | Gold-looking brass on non-holy books | Iron corners. The Codex keeps dull brass, not gold. |
| `panels.js` K.illum gold vine (guest book, Codex) | Gold on non-holy books | Guest book: rubric and ink. Codex: rubric, lapis and orpiment yellow. The charter keeps gilt (holy). |
| `panels.js` Scriptorium gold ribbon, tab sprites' gold rules | Gold | Blue ribbon; orpiment rules |
| `panels.js` Smithy rune sockets rimmed in brassG | Gold-looking | Iron rims |
| `panels.js` Cellarium keys (#a8842a) | Gold-looking | Iron keys |
| `panels.js` portrait frame brass rim, slot_hover gold ring | Gold-looking | Bronze rim; muted brass ring |
| Lightning | None drawn in these four rooms or seven panels | The Smithy panel's sparks are short forge sparks off the horn, not arcs |
| Bell | None in these rooms. The church/belfry is in the garth and title (still to do). | Not applicable here (see open items) |

Kept as a judgment call for the director: the order's red banners, the Prior's red cushion and the chapter's red runner. These are the order's own red, as the Sacristy's frontal and vestments are; grim and hub_spec both have them.

### Timings (this session)

| Item | Machine time | Authoring (agent time, approx.) |
|---|---|---|
| Kit additions (rough ashlar, flake fix, ashlar stone boxes, vault plan, jamb fix) and props_hub | – | 0.5 h |
| Almonry | build + render 4 s; lit check 100 s (×2) | 1.0 h |
| Infirmarium | build + render 4 s; lit check 100 s (×2) | 0.9 h |
| Cellarium | build + render 4 s; lit check about 110 s | 0.7 h |
| Chapter House | build + render 4 s; lit check about 100 s | 0.6 h |
| Panel kit, seven panels and 13 UI sprites | script 0.3 s; render 8 s | 1.0 h |

### Still open

- **Godot parity check.** Run `build_interiors.sh` once on a real game checkout for all eight interiors.
- **Bells on keeper figures.** Aldric's figure carries a handbell under his forearm and Ide's a silent sanctus bell (`worlds/keepers.js`). Neither is the church bell, but the director may want them reviewed against ruling 8. Figure files were not edited.
- **Readability limits.**
  - At the Infirmarium's depth the beds read small and flat (eye 1.6 m over 0.5 m beds, 8 m away); the sitter is behind Wenna.
  - The Almonry's open ledger is nearly edge-on at counter height, as in grim.
  - The Cellarium's tally board trestle reads a little like an easel.
- **Earlier rooms.** The earlier hub rooms (Scriptorium, Sacristy) still use the default ashlar. Re-running them with `wallOpts.rough` would bring them to the same coursed-rubble look. The Scriptorium's three back windows would also pick up `jambFix`.

## Battle rooms, worlds I to VII (2026-11-24)

One signature room per world for I to VII, plus the nave's void fixed. Each room replaces one grim key, so the game can load it by the grim name; Cole has not yet decided on 1, 2 or 3 rooms per world.

### Files

- **Rooms:** `scenes/bg_<grim key>.js` → `out/scenes/battle/<roman>/`. Each world's palette, materials and course marks sit in a "WORLD KIT" section at the top of its room file, so rooms 2 and 3 of a world can be lifted from there.
- **Outputs per room:** `<room>_far.svg/.png` (opaque), `<room>_mid.svg/.png`, `<room>_fore.svg/.png` (transparent), all 1480 x 480 shown at 2x (2960 x 960); `<room>.camera.json` (the nave's battle camera, unchanged); `<room>_preview.png` (4 heroes and 3 world foes at true scale, preview-only contact shadows).
- **Sheet:** `out/scenes/battle/battle_I-VII_sheet.png`.
- **Kit:** `scenes/battle_li.js` (new, opt-in; `lik.js` is untouched, so the hub rooms render exactly as before):
  - `tornVoid`: the void's absence (described below);
  - `rain` and `splashes`: storm rain, never a bolt;
  - `scorch`: a Lichtenberg burn laid in a surface plane, with an optional hot core;
  - `icicle`, `icicles`, `rimeEdge`: frost;
  - `shelf`, `toadstools`, `blisters`, `sulphur`: toxin;
  - `steam`, `bank`: steam, mist and smoke;
  - `water`, `ripples`, `rock`, `quiet`: the stepped quiet band;
  - `rope`, `chain`: the `rigid` option draws a fused chain.
- **Tools:**
  - `scenes/build_battle.sh <room> <scene.js> <outDir> <foe.png>...` runs the scene, renders the three layers at 2x, makes the far layer opaque and composes the preview.
  - `scenes/comp_battle.py` composes the preview. With `sheet`, it builds the sheet.
  - `scenes/opaque_far.py` makes the far layer opaque. The wobble filter leaves a few hundred edge pixels part-transparent. The script adds an unfiltered backstop rect to the far SVG and fills those edge pixels in the far PNG.

| World | Room key (replaces grim) | File |
|---|---|---|
| I Drowned Kingdom | `nave` | `bg_drowned_nave.js` (v3: void fix) |
| II Rotmire | `mire_hut` | `bg_mire_hut.js` |
| III Boiling Baths | `baths_pool` | `bg_baths_pool.js` |
| IV Sulphur Pits | `pits_shaft` | `bg_pits_shaft.js` |
| V Storm Foundry | `foundry_mould` | `bg_foundry_mould.js` |
| VI Stormwrack Coast | `coast_cliffs` | `bg_coast_cliffs.js` |
| VII Icebound Fleet | `fleet_ice` | `bg_fleet_ice.js` |

### The nave's void (World I), fixed

- **What was wrong.** The round bites (a union of circles with cracks from the cusps) read as a cartoon blob.
- **What it is now.** All three voids are `tornVoid`s: a lancet, the spandrel over the pier at X -5, and a ledger slab. Each is one irregular absence:
  - **Outline:** low-frequency noise plus a few broad bent lobes, sampled at irregular angles with straight segments and a few sharp V notches. Never a circle and never a star.
  - **Courses:** it cuts straight across stone courses, arch voussoirs, glass and leads without breaking them. There are no cracks and no rubble: the stone is simply not there.
  - **The cut:** the cut through the wall's thickness is shown in shadow, with the coursing carried across it, and the inside is black.
  - **Rim:** one firm, unbroken ink rim with mitred joins, a thin cold lip on the edges facing the light, and a thin violet line at the back of the cut. There is no glow.
  - **Fragments inside:** in the spandrel, two fragments of the arch ring stand inside the hole with nothing holding them.
  - **Edges:** at two or three edges the absence breaks up into detached angular pieces, each smaller and further out than the last. It ends in a hairline and then nothing. Short hairline fissures creep along the beds.
- **Output.** `out/scenes/battle/I/`. The `out/scenes/pilot/` copy is the older v2.

### Lore content, room by room

- **II Rotmire: the moot-hall's empty piles** (`mire_hut`). The company stands on the village landing stage at dusk.
  - **The empty piles.** Across the black water, the moot-hall's double row of oak piles stands with no hall on them. The tops are snapped and splayed, each with a pale torn tenon where the sill beam tore off. Three sockets are empty, ringed with churned peat water. A cross-beam hangs into the water.
  - **The reeve and the gangway.** The reeve's notched tally sticks are still nailed to the last post. The gangway from the neighbouring house ends in the air, and its rope ladder hangs to nothing.
  - **Where the hall went.** A channel is trodden through the reed beds with the reeds laid flat. Clusters of pile-sockets (the hall's footprints) go off into the fen at the right.
  - **The houses.** Three stilt houses: wattle-and-daub panels bulging like bellies between the frame posts, blistered bile-green, patched with peat sods, the wattle showing in one. The reed thatch is slumped and mossed, with toadstools along the ridges and a heavy cut eave. Eel traps (willow cones) hang under the eaves, with rope ladders and the hags' horn lanterns at the doors (amber, the only warm note).
  - **The water and the piles.** The piles are tanned black with mould fur at the old waterline, shelf fungus and white mycelium. A bog body lies tanned brown in the shallows by the stage, face and one hand up.
  - **On the stage (mid layer).** A heap of eel traps, a leister, a peat stack under sacking, a creel and the barber's leech jar, and a half-sunk punt.
  - **Fore.** The house eave over the stage with eel traps, a lit horn lantern and lantern gnats, a frog-bone twine charm, two near piles with shelf fungus, a drowned dog hanging preserved by a rope, and reeds.
  - **Courses.** Toxin ripens (blisters, fungus, mould, toadstools, swelling daub); water preserves (tanned piles, the bog body).
- **III Boiling Baths: the great pool** (`baths_pool`). The company stands on the marble surround.
  - **The pool and colonnade.** The pool boils milky green, with bubbles bursting in rings and drifting scale. Across it stands the pink-white Ionic colonnade: a meander frieze in the world's boiled red, a cooked red-brown tide line and white scale crust at every column foot, and peeling marble skin.
  - **The spring.** In the apse behind the middle bay, the sacred spring pours from its bronze lip into the basin. The conch is gilded with the temple's waves (holy, the only gold), and the wall round it is hung thick with clay votives: legs, arms, hands, feet and swaddled babies, some cracked.
  - **The seventh pool.** At the right is the arch to the seventh pool, with its bronze plaque stamped VII. Wet pink drag marks run across the floor from it, because the best families have climbed out.
  - **The ambulatory wall.** Painted bathers on the plaster peel off in curling sheets like boiled skin. Copper mains are cooked red-brown, bandaged with rags, weeping steam and scale.
  - **Steam and the floor.** Steam rises off the pool and collects under the coffered vault. The floor is heat-crazed marble, with lifted slabs over the hypocaust whose fire glows through the gaps, glowing seams in the worst cracks, scale rings and wet sheen.
  - **Mid and fore.** Mid: dropped bath sheets, clogs, a broken oil flask, a strigil, a boiled kettle crab on its back, and a pilgrim's crutch with votives. Fore: the near soffit hung with lime-scale stalactites and condensation, two near columns, strigils on a cord, a pilgrim's cord of votives, a rag-bandaged pipe and a cracked amphora.
  - **Courses.** Fire cooks (crazing, glow, peeling, cooked copper); water keeps it wet and steaming (steam, scale, leaks).
- **IV Sulphur Pits: the pit bottom** (`pits_shaft`).
  - **The chamber.** Hewn rock, faceted and laid in strata ledges, propped with cap beams.
  - **The shaft and the Owner.** Over the middle, the winding shaft opens in the roof, timber-lined and going up, with its bearers charred and one hanging down. The cage guides are splintered at head height and the snapped winding chain hangs out of the dark. Grey daylight falls faintly down it onto the Owner's broad hat on the floor, its brim burnt through.
  - **Galleries and the vent.** Two galleries run off on rails between receding timber sets, with lit oil lamps on the sets. A gas vent burns low in a crack of the wall, with soot fanned above it.
  - **The lamp room.** A board of pegs hung with small iron oil lamps (a few lit), their numbers chalked under them and gaps where lamps were never brought back.
  - **The shrine.** The miners' shrine niche holds a little gilded holy figure (holy, the only gold) with candle stubs, and a canary cage with a dead canary beside it.
  - **Mid.** The weighman's steelyard hangs from its beam over the iron-bound weighing platform, with its pan and pear-shaped counterweight. An ore tub lies overturned and spilling sulphur ore. A pick lies on the floor.
  - **Fore.** Charred pit props with the char checked into blocks and a few glowing seams, an iron cap plate, a lit lamp on a nail and an empty canary cage.
  - **Throughout.** Sulphur crust and gas blisters on the rock, sulphur bloom on the timber, ochre smoke under the roof and ash curling upward.
  - **Courses.** Fire chars and splits; toxin crusts and swells.
- **V Storm Foundry: the bell pit** (`foundry_mould`).
  - **The pit.** The crown of the half-cast great bell (a dark bronze dome, cast mouth-down, two canons) stands out of its loam mould in the round pit. The clay runner cup has frozen bronze overflow, and a ladder leads down.
  - **The crane.** The oak casting crane's mast carries a burn fern, and its jib runs over the pit. The chains are fused into one rigid welded bar, hanging plumb to the empty yoke where the great crucible hung.
  - **The cupola.** At the right is a tall stone cupola furnace banded with iron. Its charging door burns white-gold high up (above the fighters), its iron door hangs open and its tap-hole glows dull. The Storm-Catcher's two copper cables come down on glazed clay insulators into it, with burns spreading from every bracket.
  - **The hall and the storm.** Tall arched windows open onto the thunderhead's own wet glare, with rain streaming in and over the sills. Rain falls in sheets through the broken roof onto puddles and splashes. Lichtenberg burns are scorched into the soot-black walls.
  - **The floor.** Cast-iron plates on black moulding sand, burn ferns across the plates, slag drips (some still glowing) and embers.
  - **Mid.** The anvil line with the slaves' neck chains, a hammer welded to its anvil by a strike, a quench trough with rain in it, and a split loam mould.
  - **Fore.** Riveted cast-iron columns (one struck), a fused chain hanging rigid, slag heaps, a pourer's clog, and short forge sparks.
  - **No lightning is drawn.** The storm is shown only by rain, wet light and scorch.
- **VI Stormwrack Coast: the wreckers' strand** (`coast_cliffs`). Wet sand and shingle under the storm.
  - **The cliff.** A laminated, faceted slate cliff with the wreckers' path zig-zagging down. On a ledge, the false lamp burns on its pole, and a burn fern spreads from its iron.
  - **The headland and the point.** On the headland at the right, the gibbet with its wrecker in irons stands against the sky. On the far point, the lighthouse burns in the wrong place.
  - **The sea.** Offshore, breakers on the reef rocks. Spent surf runs up the strand.
  - **The wreck.** The ribs of a wreck stand black out of the sand: curved frames snapped at different heights, the keel, one sprung strake, iron knees fused into black welds, barnacles and kelp, and a burn across the planks.
  - **The beach.** The tide line wanders with kelp and wrack. Fulgurites (branching, glassy tubes of sand fused by strikes) lie in the beach.
  - **Mid (salvage).** Casks, a sodden bale, a stove sea chest, a grapnel on its line, and a verdigris-green Drowned Kingdom bronze lantern.
  - **Fore.** Black slate rocks, barnacled and weeded, a wreckers' lantern on a pole stuck in the sand, and driving rain and spray.
  - **No lightning is drawn.**
- **VII Icebound Fleet: the battle line in the ice** (`fleet_ice`).
  - **The ships.** Two ships of the line lie locked broadside in the white:
    - black tarred strakes, split where the sea froze in the seams;
    - wales rimed on top, with icicles of every length from every wale and sill;
    - two tiers of gunports, each its own: open with the lid up and rimed, the lid gone, or closed; muzzles rimed;
    - a few gunners frozen leaning out at the left ship's ports;
    - barnacles and frozen kelp at the ice line, a rimed rail, a bowsprit;
    - masts going out of frame with yards and frozen furled sails hung with icicles, and grey-blue shrouds and ratlines.
  - **The frozen splashes.** Between the ships stand the first broadside's shot-splashes, frozen as they rose: a churned foot ring, a crown of five lumpy jets with a frozen veil between them, and stopped droplets. The biggest stands in the gap between the company and their foes, on the far side of them in depth.
  - **The far ships.** The rest of the line lies as black shapes on the horizon.
  - **The floor.** Sea ice with snow drifts, pressure cracks, a pressure ridge of broken plates, and a frozen spar, cask and rope coil. There is a clear black patch with a drowned sailor under it, pale and swollen, face up, hands spread (water drowns underneath).
  - **Mid.** A snow-covered ship's boat, keel up, with its oars standing, a broken topmast, and an eel hole of black water skinned with new ice.
  - **Fore.** The near ship's bowsprit across the top, rimed and hung with icicles, with its frozen jib as a stiff slab. A frozen boarding net hangs at the left edge. At the right edge, the near hull's side with rimed wales and a frozen rope ladder. Pressure-ridge ice and fine snow.
  - **Palette.** No warm colour anywhere.

### Rules audit (all seven)

- **Lightning:** none drawn as arcs or bolts. The storm worlds (V, VI) show storm by rain, wet light, scorch (always clipped to a surface) and fused metal.
- **Eyes:** none in II to VII. The drowned sailor under the ice has closed eyes (two short strokes), not an eye motif.
- **Gold:** only on holy things. The Baths' spring conch and its wave band, and the Pits' shrine figure. Everything else is bronze, iron or copper.
- **Red:** only the Baths' boiled red (its own palette: the cooked tide line, copper and the meander), which is rubric-like ornament. There is no other red.
- **Stone:** rubble or rough ashlar with irregular courses (`ashlar` with `rough`), marble slabs of uneven size, or faceted hewn rock. There is no brick tiling.
- **Courses:** both of each world's courses are present (listed above).
- **Scale:** every element is placed in world metres through the battle camera: doors 1.45 m, gunports 0.62 m, piles 0.3 to 0.4 m, and so on.

### Weak spots (honest list)

- **Nave (I).**
  - Some fray pieces of the spandrel void are small at 1x and read as dark chips. The fragments of ring standing inside the hole are small.
  - The ledger-slab void is so foreshortened that it reads as a dark patch.
- **Rotmire (II).**
  - The hall's footprints in the fen are too small to read at game size; the trodden channel through the reeds carries the story.
  - The cloud masses repeat a similar lobed shape.
  - The mid-layer eel-trap heap is muddy.
- **Baths (III).**
  - The clay votives round the spring are still small at 23 m. The cord of votives on the near left column carries the read.
  - The hypocaust's glowing seams in the floor are subtle.
  - The near columns at the frame edges are flat.
  - The scene is the least dramatic of the seven: dim and even.
- **Pits (IV).**
  - The faceted hewn rock still has a slight low-poly look up close.
  - The scene is murky and close in value overall, and the lamp warmth is weak.
  - The gas blisters read a little like clusters of grapes.
- **Foundry (V).**
  - The bell crown in the pit is low and dark (as the quiet zone needs), so it reads as "a bronze dome", and as a bell only to a viewer who knows.
  - The cupola merges with the back wall, and its glowing charging door can read as a lit window.
  - The burn ferns on the soot-black wall are subtle.
- **Coast (VI).**
  - The cliff's burn fern at the top left reads a little like a bare tree against the sky.
  - The wreck's ribs could be taken for a whale's ribcage.
  - The cliff ledges are still a bit linear.
  - The strand's sand is plain between the pebbles.
- **Fleet (VII).**
  - The gunport rows are regular, as ships are, but still read as rows of boxes from a distance.
  - The frozen splashes read a little like ice-reeds.
  - The fore boarding net reads as a fence grid.
  - The two far splashes are too small to see.
  - The far sky is plain.
- **All seven.**
  - The mid layers are deliberately sparse and dark (the quiet zone), so most low lore props in them only read up close.
  - The far SVGs are 0.9 to 3.4 MB, because each layer embeds the whole room's defs (as in the nave).

### Timings (this session)

| Item | Machine time | Authoring (agent time, approx.) |
|---|---|---|
| Kit (`battle_li.js`), the composer and the opaque fix | – | 0.6 h |
| Nave void | 14 s per build | 0.4 h (3 loops) |
| Each of the six new rooms | 15 s per build | 0.6 to 0.9 h (3 to 4 loops each) |

## v4 (2026-11-24): the garth, the title sky, the icons, the Almonry shield

### Files
- `garth_li.js`: the cloister garth (port of `grim/garth.js`). Writes `out/scenes/hub/garth/`: `garth__{bg,monument,light,fg}.svg`, `garth.svg`, `garth.rig.json`, `garth.light.json`, `garth_hotspots.json`. Each layer carries only the defs its own body uses.
- `check_garth.py <dir>`: the garth contract against grim's JSON (canvas, camera, rig layers, all 58 lights in order, every hotspot id/label/action/slot/poly/outline, party, monument, brazier, draw order). Planes may differ (78 against grim's 38; the passes take any plane list).
- `garth_lit_check.py <garth_dir> <party_dir> <stage>`: stages grim's layout, runs `garth_states.js`, lights the frame with `garth_lit.py`'s own functions for two party variants (company; the Vessel `vessel_garth` in slot 3), then `hover_outline.py`. Copies `states/` and `garth_lit_*.png`, `garth_unlit_*.png` back.
- `garth_sheet.py`: `out/scenes/hub/hub_v3_garth.png` (unlit | lit for both variants, then hover and locked for every door and the cross).
- Party sprites for the preview: `out/scenes/hub/garth/party/*.svg` (Living Ink heroes and `vessel_garth`, wrapped to grim's 620-unit convention: scale 620 / (365.7 x 1.85)).
- `title_sky_li.js`: `out/scenes/hub/title/title_sky.svg` (1600 x 1400) and `title_preview.png` (sky over the garth).
- `gr_li.js`: grim's Art API in Living Ink (every shape a Fig part). `icons_li.js` stages `grim/icons.js` + `kit.js` + `sigils.js` + `anatomy.js` against it, with the ruling patches; writes `out/scenes/hub/icons/<id>.svg` (132 ids, 128 x 128, grim's names). `icons_sheet.py`: 128 / 48 / 32 px contact sheet. `out/scenes/hub/hub_v3_title_icons.png`.
- `zoom_svg.py`: render a region of a frame SVG at a zoom (rsvg).
- `props_li.js fire`: new `o.licks` option (default 5, unchanged output elsewhere).

### Garth
- Geometry, camera (horizon 300, eye 3, focal 760), seed, hotspot polys and outlines, party anchors and all lights are grim's. The four grave candles grim placed at random are fixed to the same four graves, so the light list matches exactly. `check_garth.py`: CONTRACT OK.
- Walls are random rubble laid roughly to course (a rubble builder local to the garth: each stone a squashed superellipse, its own height, pinning slips, dressed long-and-short quoins at the tower and porch corners). The cross plinth is dressed stone (a monument).
- Value grading: every wall, roof, stair and the ground get zone hatching from the real lights (deferred), and the unlit preview gets the stepped veil (fg, class glow).
- The belfry: the timber frame stands empty. The bell is gone; the bare headstock beam hangs between the posts with two empty iron straps, a crow on it. The stump's opening shows the sky through the hollow chamber.
- Keepers: Brother Fenn (Living Ink, `fenn_right.svg`) behind the dole window; the Hosteller (`hosteller_left.svg`, lantern in hand) in the guesthouse door. Grim's folk (queue, pilgrims, digger, sick, refugees) are drawn with the figure engine.
- Colour: gold only on the gable cross. Red: the church's rubric banner and the Chapter House banners (rubric, as in the interior), blood (awning stain, sick man, dead crow, the rag on the planted sword is now linen stained with old blood instead of a red cloth).
- Lit check: `garth_lit_company.png`, `garth_lit_vessel.png`; states: 20 SVG overlays (hover, locked) and 9 outline PNGs.

### Title sky
- Same contract as grim (1600 x 1400, bottom meets the garth top; sun at 1120,760; same banks, wisps, fog, forge smoke from 292,1250, crows over the tower). Flat stepped bands, cel billows, stepped sun rings, no gradients or blurs.
- Two changes for the seam: the bottom band is the garth's top sky tone (grim's ended far darker than the garth began), and the smithy stack and the bell-frame roof tip, which rise above the garth's top edge, are drawn in the garth camera shifted by 1400.

### Icons
- 132 ids (126 items, statuses, nodes, supplies + 6 element sigils), 128 x 128, grim's names. Every grim shape is a figure-engine part; grim's raw linework passes through.
- Ruling patches (in the staged copy only): lightning effect and sigil are Lichtenberg burns (no bolts or arcs); `s_focus` (was an open eye) is a taper with a still flame; the Seer's Lens has no eyes in it; gold is bronze except on holy icons (reliquary, saint's finger, saint's plate, rosary, shrine node, pilgrim badge, Templar hammer, ward rune and status); `a_brigandine` cloth brown, `medicine` cross ochre and tincture amber.
- Readability at 32 px: silhouettes hold for nearly all. Weakest: `t_rosary`, `t_hangmans_knot`, `quick`, `s_blight` (thin linework). The smallest export size is not on disk; 32 px was assumed.

### Almonry
- The shield's emblem is a worn dull-ochre roundel chipped at the rim (was dark red). Rebuilt, contract OK, lit check rerun.

### Timings
- Garth script 2 s; Chromium preview 10 s (rsvg 3.5 to 4.5 min); staged lit check about 6 to 7 min per run (two variants); sheet 3 s.
- Title sky under 1 s to build, 5 s to render. Icons under 1 s to build, 5 s to render all 132.

### Still open
- `r_eye` (a violet eye rune) and `rl_black_pearl` (reads a little like an eye) and `w_witch_skull` (green-lit sockets) are kept; decide whether they count as void.
- The `gold` supply icon is drawn in bronze coins under the gold ruling; the resource's name is unchanged.
- `s_mark` (red target), `w_templar_hammer` (red cross), `i_heal` and `tough` (red hearts), `fl_rage` keep red as doom, rubric or blood.
- `hub_v3_rooms.png` still shows the Almonry's old shield; the Almonry files themselves are current.

### Icons, round 2 (2026-11-24, coordinator's look and Cole's rulings)
- The smallest size is 22 px (`UiStyle.icon_tag`). `icons_sheet.py` now shows 128, 48, 32 and 22 px, plus the 22 px one at 3x with hard pixels.
- Redraws live in `scenes/icons_li_fix.js`, injected before grim's render loop by `icons_li.js`. `gr_li.js` shapes take `outline` (a heavy ink silhouette under the part).
  - `e_void`: the Elementalist's void sign (dirAC.js). A clean-rimmed black hole, pale rim, the edge thinning into nothing, matter drawn in, no glow. The hole has bitten through the roundel's edge, so nothing dark sits enclosed in a pale field; a centred hole read as an eye at 22 px.
  - `r_eye` (Cole): the id is kept; the face is the same void hole, cut through the rune stone's edge. No eye, no glow.
  - `rl_black_pearl`: one ridged shell valve standing behind, the pearl rolled out in front and to the right, a small highlight high on its left. A first version with both valves framing the pearl read as an eye.
  - `s_neuro`: a hand clawed rigid, tremor strokes either side, a sick-green sting puncture with green veins.
  - `s_mark`: a rubric consecration mark (brush ring and cross, the arms ending at the ring) daubed on a wooden tag hung from a nail, with a drip.
  - Strengthened for 22 px: `t_rosary` (13 big beads, heavy cord, large gilt crucifix: holy), `t_hangmans_knot` (heavy rope, banded coils), `quick` (broad, outlined feather, speed strokes), `s_blight` (a rotting flower, head hung, mould spots), `s_silence` (a sewn mouth, not an almond), `s_thorns` (heavy bramble, big thorns), `t_tooth_charm` (big teeth on a heavy thong).
  - `w_witch_skull`: no pupils in the sockets, only a dim warm ember low in each.
- Gold: the `gold` supply icon keeps gold coins (Cole: money is the one exception). Every other non-holy gold stays bronze.
- `hub_v3_rooms.png` rebuilt by `scenes/rooms_sheet.py`. It shows the Almonry's ochre shield.

## v5 (2026-11-24): Scriptorium, Sacristy and Guesthouse brought up to the later rooms; the Pearl of Ysolde

- **Scriptorium** and **Sacristy**: the walls are the later rooms' coursed rubble (`wallOpts.rough`, the Cellarium's course plan, `wscale` 0.6). The Scriptorium's back windows also get `jambFix`, so their jambs start at the sill. Every prop, light and hotspot and the Teeth case are unchanged. Both were rebuilt and re-lit with `interior_lit.py`. `check_contract.py`: the Scriptorium passes. The Sacristy passes except light 4's colour, which is the deliberate v2 change (the Teeth case's light is warm, not grim's cold blue; same position and strength).
- **Guesthouse v3** (`scenes/int_guesthouse_hub.js` → `out/scenes/hub/guesthouse/`, the pilot's file names). The pilot script and `out/scenes/pilot/` are untouched.
  - Walls: rough coursed rubble; the limewash is gone to a couple of dark scraps. Big pale patches over rubble read as smoke, so they were dropped.
  - Hearth: rough rubble on both faces, with no stone skipped round the mouth (the firebox covers it). Masons' marks are cut into the oldest stones low either side of the mouth, plus two on the breast. The firebox back is fire-reddened rubble, darkened toward the throat.
  - Added, with no lights: the company's gear heaped in the front right (mail heap, pack, kettle helm, rope coil), folded blankets, an ash pail with its shovel by the log pile, a broom and two pilgrims' staves by the door, a chamber pot under the bunks.
  - Kept: every light, hotspot, keeper spot and roster spot; the guest book (older than any book in the abbey), the heavy iron key, the Hosteller's figure with his mason's hands.
  - Lit check: the roster heroes are staged as Living Ink renders (hexweaver, alchemist, duelist). `check_contract.py`: CONTRACT OK.
- **Icon `t_pearl_of_ysolde`**: no red fleck. A pale pearl with a curved nacre streak (blue-lilac beside warm ivory) following the sphere, and an off-centre highlight high on its left. No central dot, no ring. It reads as a pearl at 22 px.
- **Sheets**: `hub_v3_rooms.png` (all eight rooms, unlit | lit, `scenes/rooms_sheet.py`), `hub_v4_before_after.png` (Scriptorium, Sacristy and Guesthouse, before and after, unlit and lit), `hub_v3_title_icons.png` (rebuilt).

## v6 (2026-11-24): title sky, building tops, the garth's fires

- **Smooth fills**: Cole allowed them for skies, fog and glows.
  - The title sky is one smooth gradient. Its bottom tone is the garth's top tone, so the seam does not show.
  - The sun's bloom, wisps and fog bands are soft gradients.
  - Each cloud is one mass shaded by a gradient from its lee to its sun side. Each billow adds a soft lift toward the sun and a soft shade away from it, both feathered at the rim. The cloud keeps its ink silhouette and a faint hair of ink between billows.
  - The garth's own sky is one gradient too. Its strata fade out at their ends, with lighter ink.
- **Building tops**: `garth_li.js` captures everything that rises past the frame's top edge into a `tops` layer: the near ends of both ranges with their roofs and value grading, the huts' roofs, the smithy stack and the bell-frame. It writes `garth__tops.svg` in the garth camera with y from -1400. This file is not part of the rig. `title_sky_li.js` places it 1400 down, clipped at the seam, over the sky and under the smoke and crows. Every roof, wall and chimney cut by the garth frame is completed above it. This replaces the hand-drawn stack and roof tip.
- **Fires (draw order)**:
  - The brazier is drawn in this order: the inside of the bowl with its far inner wall glowing, the heaped coals, the flames rising from the coals, the near coals, and the bowl's front last. The near rim crosses the flame base, with a glow on the inner edge of the rim. A bow-tie in the old bowl outline is fixed.
  - The wall torches' cresset baskets are drawn after the flame.
  - The refugees' fire ring: far stones, then the fire, then the near stones across its base.
  - No other draw-order faults of this kind were found: candles, lanterns, the guesthouse hearth (through its door) and the forge glow are right.
- Contract OK. The garth lighting was rerun, and states and sheet were rebuilt. Before/after: `out/scenes/hub/hub_v6_before_after.png`.
- **Stone materials** (`materials_v2.js`): waiting for `materials_v2.READY`.

## v7 (2026-11-24): title clouds and smoke

- **Clouds** (`title_sky_li.js cloud`): believable night cumulus and stratocumulus.
  - Each cloud has one to three big swelling heads and many small knuckles of very different sizes, all flattened or tilted ellipses, merged into one silhouette.
  - The base is ragged and flat. Small flat lobes tear off the ends; they are part of the same mass, with the same shading and ink.
  - Shading: one soft mass gradient, dark on the side away from the moon. The moonlit rim falls only on edges facing the moon: a softened copy of the silhouette, pushed away from the moon and padded so its other edges stay full, is laid in the shade tone. A soft lift on the big heads, a darker base gradient.
  - Ink: only the outer silhouette, broken, plus one short fold on the biggest head. No interior arcs.
  - Thin stratus: four long, soft layers (blurred, no ink line).
- **Smithy smoke**: a soft column of blurred ellipses that leans with the wind, widens and thins, and tears into drifting rags at the top, with a faint pale lift on its moon side. It is drawn outside the paper wobble and grit filters, which fringed its soft edges red. No bands, no ink.
- Before/after: `out/scenes/hub/hub_v7_title_before_after.png`. The v6 column is taken from the v6 sheet, so it is slightly soft.

## v8 (2026-11-24): weathered stone (materials_v2) everywhere in the hub

- **Interiors**: `lik.js` masonry and ashlar weather themselves through `materials_v2.js` (abbey_in preset for `int_*`). All eight rooms were rebuilt with `build_room.sh` and re-lit with `interior_lit.py` (the guesthouse in its own stage, with the roster heroes).
  - `check_contract.py`: OK for Almonry, Cellarium, Chapter House, Guesthouse, Infirmarium and Scriptorium.
  - Sacristy: only light 4's colour differs from grim (the deliberate warm Teeth case, unchanged since v2).
  - Smithy: our keeper entry carries X, Z and label, which grim's smithy entry does not have. Its feet, sprite and lights match. This was also true before v8.
- **Garth**: its rubble builder sends every stone through `MV2(S).begin(at, Ls, Lt).stone(...)` and closes each wall with `W.end()` (abbey_out: lichen, moss, runs). The flagstones get `MV2(S).stoneMarks`. Geometry and every `S.R` placement are unchanged (the marks use their own random stream). Contract OK. Lighting rerun; states and `hub_v3_garth.png` rebuilt; `garth__tops.svg` and the title updated with it.
- **Panels**: the Smithy and Infirmarium panel walls (the only stone panels) take `stoneMarks` per stone. The marks come through a stand-in room camera at Z 4.5 with the abbey_in preset, salt down to 0.08 and decay 0.8; at full strength the salt read as pale scratches. The other five panels' SVGs are byte-identical.
- **Sheets**: `hub_v3_rooms.png` (8 rooms), `hub_v8_stone_rooms_before_after.png` (every room, unlit and lit), `hub_v8_stone_garth_before_after.png` (garth unlit and lit, title, both stone panels).
- Smithy keeper entry (2026-11-24): `int_smithy.js` removes the scene's own placement fields (X, Z, h, label) from `smithy_hotspots.json` after writing it, so the keeper entry has grim's keys (feet, height_px, z, flip, figure, sprite, origin). `check_contract.py`: CONTRACT OK; lighting rerun.
