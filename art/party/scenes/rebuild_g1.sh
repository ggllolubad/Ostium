#!/bin/sh
# Rebuild every g1 battle room (worlds I, II, III): layers at 2x, opaque far, previews with true-scale foes, 0.5x review
# copies, then the three world sheets. One room at a time (shared CPUs). Usage: sh scenes/rebuild_g1.sh [room ...]
# (no arguments: all 14 rooms). Exit status is non-zero if any room failed; failures are listed at the end.
cd "$(dirname "$0")/.."
B=out/scenes/battle; W=out/worlds; FAIL=""
room() { r=$1; js=$2; w=$3; shift 3
  if [ -n "$ONLY" ] && ! echo " $ONLY " | grep -q " $r "; then return; fi
  echo "== $r"; sh scenes/build_g1.sh "$r" "scenes/$js" "$B/$w" "$@" >/tmp/rebuild_g1_$r.log 2>&1 || { FAIL="$FAIL $r"; tail -5 /tmp/rebuild_g1_$r.log; }; }
ONLY="$*"
room nave          bg_drowned_nave.js     I   $W/world_I_b_hollow_tidewarden.png $W/world_I_c_brine_siren.png@2300 $W/world_I_b_barnacle_knight.png@2600
room stair         bg_drowned_stair.js    I   out/dirAC2_thrall.png $W/world_I_c_eel_kin_biter.png $W/world_I_a_grasping_deep.png@2560
room ossuary       bg_drowned_ossuary.js  I   $W/world_I_c_bloated_corpse.png out/dirAC2_thrall.png $W/world_I_c_hookline_fisher.png
room belfry        bg_drowned_belfry.js   I   $W/world_I_a_bell_below.png@2330
room throne        bg_drowned_throne.js   I   $W/world_I_b_barnacle_knight.png@1700 $W/world_I_a_drowned_king.png@2330
room brine_grotto  bg_drowned_grotto.js   I   $W/world_I_c_brine_siren.png@1720 $W/world_I_a_mother_of_brine.png@2330
room mire_hut      bg_mire_hut.js         II  $W/world_II_mire_toad.png $W/world_II_fen_hag.png $W/world_II_coven_mother.png
room mire_bog      bg_mire_bog.js         II  $W/world_II_bog_body.png $W/world_II_fen_hag.png $W/world_II_bog_troll.png
room mire_drown    bg_mire_drown.js       II  $W/world_II_fen_lurker.png $W/world_II_leech_swarm.png
room mire_boss     bg_mire_boss.js        II  $W/world_II_bog_body.png@1660 $W/world_II_mire_mother.png@2330
room baths_pool    bg_baths_pool.js       III $W/world_III_scalded_attendant.png $W/world_III_kettle_crab.png $W/world_III_bath_mistress.png
room baths_furnace bg_baths_furnace.js    III $W/world_III_steam_nymph.png $W/world_III_kettle_crab.png $W/world_III_cauldron_bearer.png
room baths_cistern bg_baths_cistern.js    III $W/world_III_bath_leech.png $W/world_III_boiled_brute.png $W/world_III_bath_leech.png
room baths_boss    bg_baths_boss.js       III $W/world_III_steam_nymph.png@1680 $W/world_III_simmering_matron.png@2330
echo "== sheets"
python3 scenes/comp_g1.py sheet $B/I/world_I_rooms.png $B/I/nave_preview.png $B/I/stair_preview.png $B/I/ossuary_preview.png $B/I/belfry_preview.png $B/I/throne_preview.png $B/I/brine_grotto_preview.png
python3 scenes/comp_g1.py sheet $B/II/world_II_rooms.png $B/II/mire_hut_preview.png $B/II/mire_bog_preview.png $B/II/mire_drown_preview.png $B/II/mire_boss_preview.png
python3 scenes/comp_g1.py sheet $B/III/world_III_rooms.png $B/III/baths_pool_preview.png $B/III/baths_furnace_preview.png $B/III/baths_cistern_preview.png $B/III/baths_boss_preview.png
if [ -n "$FAIL" ]; then echo "FAILED:$FAIL"; exit 1; fi
echo "rebuild_g1 OK"
