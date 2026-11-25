# Ostium

A turn-based roguelike in Godot 4.3 by Grey Lantern Productions. This repository is the single home for the game, its content scripts, both art pipelines and the design docs.

## Layout

| Path | What it is |
|---|---|
| `project.godot`, `scripts/`, `scenes/`, `shaders/`, `tests/` | The Godot project (open this folder in Godot 4.3) |
| `data/` | Game data the engine reads: cards, heroes, enemies, encounters, worlds, story, run layer, abbey, rigs, lighting |
| `assets/` | Game-ready art and fonts (PNG/JPG plus Godot `.import` files) |
| `tools/content/` | Python sources that generate `data/*.json` (`build.py`, `run_content.py`) |
| `art/grim/` | Legacy ("grim") art pipeline that produced the current in-game art |
| `art/party/` | Living Ink art pipeline (new heroes, 285 creatures, rooms, hub), design bible and review notes |
| `art/legacy_root/` | Older style studies and the shared `gr.js` core |
| `balance/` | Combat and descent simulators (on the `rules-v2` branch) |
| `docs/` | Status snapshots and design notes |

`art/`, `docs/` and `tools/` carry a `.gdignore`, so Godot does not import them.

## Branches

- `main`: the v0.9.0 game as of 2026-11-23 (phase 1 fixes included), with all assets.
- `rules-v2`: the Combat Rules v2 draft (fixed vigour, Hex, conjunction changes, virtues, afflictions, enemy traits, summons, upgrades, single kits, XP and deck reset) plus the balance simulators and their results. Every rules change is one diff against `main`.

## Regenerating data

```
cd tools/content
python3 build.py        # cards, heroes, enemies, encounters, worlds, story
python3 run_content.py  # run.json (gear, relics, events, talents ...)
```

The outputs are checked in. Running these on `main` reproduces the committed `data/*.json` exactly.

## Tests (headless)

```
godot --headless --path . --import
godot --headless --path . --script res://tests/abbey_test.gd
```

Also: `road_test`, `phase1_test`, `flow_test`, `card_test`, `run_test`, `sim_test`, `ui_play`. `phase1_test` prints two engine errors on purpose: it feeds broken saves to the loader to check recovery.

## Art pipelines

Both pipelines are Node scripts rendered with Playwright (Chromium), plus Python post-processing (Pillow, numpy). Rendered outputs are not committed under `art/`. They regenerate from the scripts, and only the game-ready results live in `assets/`.
