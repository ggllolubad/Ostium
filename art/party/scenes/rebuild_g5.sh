#!/bin/sh
# Rebuild every World XIII and XIV battle room (group g5): each room's layers at 2x, the opaque far layer, the preview,
# then the two world sheets. XV (sky_*) is not touched. Renders run one at a time (shared CPUs).
# Usage: sh scenes/rebuild_g5.sh            (from anywhere)
set -e
cd "$(dirname "$0")/.."
B=scenes/build_battle_g5.sh
sh $B XIII pyre_nave    scenes/bg_pyre_nave.js    ash_penitent,censer_deacon,pyre_knight
sh $B XIII pyre_stake   scenes/bg_pyre_stake.js   cinder_hound,ash_penitent,pyre_seraph
sh $B XIII pyre_crypt   scenes/bg_pyre_crypt.js   candle_wraith,pyre_knight,unburnt_inquisitor
sh $B XIII pyre_boss    scenes/bg_pyre_boss.js    censer_deacon,@saint_unending
sh $B XIV  garden_hedge scenes/bg_garden_hedge.js thorn_knight,fungal_husk,the_gardener
sh $B XIV  garden_grove scenes/bg_garden_grove.js spore_deer,root_horror,blight_dryad
sh $B XIV  garden_heart scenes/bg_garden_heart.js root_horror,fungal_husk,thorn_knight
sh $B XIV  garden_boss  scenes/bg_garden_boss.js  thorn_knight,@antlered_mother
S=scenes/battle_preview_g5.py
D=out/scenes/battle
python3 $S sheet $D/XIII/world_XIII_rooms.png "World XIII, the Black Pyre: pyre_nave, pyre_stake, pyre_crypt, pyre_boss (The Saint Unending)" \
  $D/XIII/pyre_nave_preview.png $D/XIII/pyre_stake_preview.png $D/XIII/pyre_crypt_preview.png $D/XIII/pyre_boss_preview.png
python3 $S sheet $D/XIV/world_XIV_rooms.png "World XIV, the Blighted Garden: garden_hedge, garden_grove, garden_heart, garden_boss (The Antlered Mother)" \
  $D/XIV/garden_hedge_preview.png $D/XIV/garden_grove_preview.png $D/XIV/garden_heart_preview.png $D/XIV/garden_boss_preview.png
echo "g5 rebuild done: XIII and XIV, 8 rooms and 2 sheets"
