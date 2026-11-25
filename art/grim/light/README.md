# Ostium lighting

One lighting model for every screen. The art is drawn unlit. Light comes from the scene's real light sources, the same way in the art previews and in the game.

    lit = albedo × (ambient(N) + Σ light_i(P, N)) + emissive
    → exposure → vignette → filmic curve with crushed blacks

- **Ambient.** Two parts:
  - The Grey: cold and colourless, from above.
  - A weak key light from the upper left at 45°, as the design bible sets it.
- **Bounce.** A faint warm return from the viewer's side, so rounded things never go fully black.
- **Lights.** Warm point lights at real positions in the scene, in metres, each with an intensity and a range. They come from the art script: every lit door and window, lantern, candle group, brazier and forge.
- **N and P.** Every pixel knows its surface normal (N) and its position in the world (P).
  - **Built scenes:** both come exactly from the geometry. Faces are tagged with their plane, and P comes from the camera ray.
  - **Props and sprites:** they get rounded "pillow" normals generated from their ink lines and outline, and stand at their feet depth.
- **Look values.** All of them live in `look.json`, and the game reads a copy at `res://data/lighting.json`. Change the look in one place.

## Files

| File | What it does |
|---|---|
| `passes.py` | Splits a tagged scene SVG into its albedo, emissive, normal and depth passes. |
| `lightrender.py` | Reference renderer: the maths, in numpy. |
| `garth_lit.py` | Lit render of the cloister garth with the party, for reviews. |
| `export_godot.py` | Per-layer maps for the game (`<layer>.png`, `_n`, `_e`, `_d`, `_p`) and normal maps for sprites. |
| game `shaders/ostium_lit.gdshader` | The same maths as a canvas_item shader. |
| game `scripts/lighting.gd` | Static `Lighting` class. It loads a scene's lights and builds lit materials for layers and sprites. |
| game `tests/lighting_demo.gd` | Renders the garth in the engine for a parity check against `garth_lit.py`. |

The engine render and the reference match to within 1.3/255 mean absolute difference on the garth.

## Authoring rules for scene scripts

1. Draw faces through the builders (`stones`, `planks`, `roof`, `shade`, `archRing`). They tag the plane automatically. Anything flat drawn by hand on a face goes inside `PLW([p0, p1, p2], …)`.
2. Draw props through `add(Z, fn)`, which tags their depth.
3. Light sources: wrap the glowing part with `EM(…)`, which marks it emissive, and register the light with `addLight(X, Y, Z, I, range, col)`. `litHole`, `lantern` and `candles` already do both.
4. Painted glows (`a.glow`) are kept for the unlit preview only. They are tagged `glow` and dropped from the lit passes. Screen effects (ash, vignette, grading) are tagged `glow` too.
5. **Containment.** Anything inside a room, seen through a door, window or hatch, is drawn inside `through(openingPts, fn)`, which clips it to the opening. Nothing behind an opening is drawn without it.

## Reviews

Every scene review includes zoomed crops of every opening (lit and unlit). Containment is checked first.

## Abbey interiors

Every shop room shares one box-set camera: eye 1.6 m, horizon 430, focal 900. The back wall faces the camera and the side walls recede.

| File | What it does |
|---|---|
| `grim/scenekit.js` | The garth's builders (stones, planks, arches, lights, containment, outlines), bound to any camera. |
| `grim/interior.js` | The room shell: walls, floor, flat timber ceiling or barrel vault, doors (`door` in the left wall, `backDoor` in the back wall), `backWindow`. It writes the layers `bg`, `mid` and `fg`, the light file, and the hotspots. |
| `grim/keeperkit.js` | The keeper kit: a 3/4 face facing left, hair and headwear, habit, scapular, rope belt, keys, sleeves, rolled sleeves and hands. |
| `grim/k_<keeper>.js` | One keeper each: hild, wenna, fenn, godric, ide, lucan, aldric, hosteller. Each writes `grim/keepers/<name>.svg`. |
| `grim/int_<room>.js` | One room each: smithy, infirmarium, almonry, cellarium, sacristy, scriptorium, chapter, guesthouse. |
| `interior_lit.py` | The lit reference render. It composites the roster sprites and the keeper at their feet depth. Hands that rest on a counter or table come back over the `mid` layer above the cut line. It also writes the keeper and hero hover outlines and their click polygons. |
| `export_interior.py` | Writes the game's `assets/art/hub/int/<room>/`: layer maps, keeper and hero sprites with normals, hover PNGs and `room.json`. |
| game `tests/interior_demo.gd` | The engine render, used for the parity check. |
| `build_interiors.sh` | Runs all of the above for every room and prints the parity figures. |

Rules for rooms:
- The way out is a door in the back wall, or in the left wall where that wall is wide enough to read.
- Doors use the containment rule (`through`).
- Every hover outline is a single closed loop.
- People are sprites, not ink in the room layer. They stay animatable and clickable, and the room's lights fall on them.
