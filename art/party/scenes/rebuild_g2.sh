#!/bin/sh
# Rebuild every battle room of worlds IV, V, VI (group g2): layers, trimmed defs, 2x renders, opaque far, previews with the
# room's foes at true scale, then the three world sheets. Run from anywhere:  sh scenes/rebuild_g2.sh
# (materials_v2 is used automatically while scenes/materials_v2.READY exists.)
set -e
cd "$(dirname "$0")/.."
W=out/worlds
b() { sh scenes/build_g2.sh "$@" | grep -E "preview|rror" || true; }
b IV pits_shaft    scenes/bg_pits_shaft.js    $W/world_IV_gas_lung_miner.png $W/world_IV_pit_crawler.png $W/world_IV_powder_ogre.png
b IV pits_vent     scenes/bg_pits_vent.js     $W/world_IV_brimstone_toad.png $W/world_IV_pit_crawler.png $W/world_IV_fuse_imp.png
b IV pits_chapel   scenes/bg_pits_chapel.js   $W/world_IV_canary_priest.png $W/world_IV_gas_lung_miner.png $W/world_IV_miasma_matriarch.png@2450
b IV pits_boss     scenes/bg_pits_boss.js     $W/world_IV_gas_lung_miner.png@1700 $W/world_IV_burning_lung.png@2500
b V foundry_mould  scenes/bg_foundry_mould.js $W/world_V_spark_swarm.png $W/world_V_bronze_automaton.png $W/world_V_sparkblind_smith.png
b V foundry_floor  scenes/bg_foundry_floor.js $W/world_V_slag_slave.png $W/world_V_bronze_automaton.png $W/world_V_arc_smith.png
b V foundry_roof   scenes/bg_foundry_roof.js  $W/world_V_bellows_imp.png $W/world_V_arc_smith.png $W/world_V_talos_sentinel.png
b V foundry_boss   scenes/bg_foundry_boss.js  $W/world_V_bronze_automaton.png@1700 $W/world_V_anvil_titan.png@2420
b VI coast_cliffs  scenes/bg_coast_cliffs.js  $W/world_VI_storm_harpy.png $W/world_VI_wrecker.png $W/world_VI_harpy_matron.png
b VI coast_cove    scenes/bg_coast_cove.js    $W/world_VI_shock_eel.png $W/world_VI_tide_crab.png $W/world_VI_drowned_bosun.png
b VI coast_light   scenes/bg_coast_light.js   $W/world_VI_wrecker.png $W/world_VI_lighthouse_keeper.png@2350 $W/world_VI_storm_harpy.png@2700
b VI coast_boss    scenes/bg_coast_boss.js    $W/world_VI_shock_eel.png@1640 $W/world_VI_thunder_whale.png@2440
B=out/scenes/battle
python3 scenes/comp_g2.py sheet $B/IV/world_IV_rooms.png "World IV, the Sulphur Pits: pits_shaft, pits_vent, pits_chapel, pits_boss (Burning Lung)" $B/IV/pits_shaft_preview.png $B/IV/pits_vent_preview.png $B/IV/pits_chapel_preview.png $B/IV/pits_boss_preview.png
python3 scenes/comp_g2.py sheet $B/V/world_V_rooms.png "World V, the Storm Foundry: foundry_mould, foundry_floor, foundry_roof, foundry_boss (Anvil Titan)" $B/V/foundry_mould_preview.png $B/V/foundry_floor_preview.png $B/V/foundry_roof_preview.png $B/V/foundry_boss_preview.png
python3 scenes/comp_g2.py sheet $B/VI/world_VI_rooms.png "World VI, the Stormwrack Coast: coast_cliffs, coast_cove, coast_light, coast_boss (Thunder Whale)" $B/VI/coast_cliffs_preview.png $B/VI/coast_cove_preview.png $B/VI/coast_light_preview.png $B/VI/coast_boss_preview.png
