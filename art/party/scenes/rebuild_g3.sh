#!/bin/sh
# Rebuild every battle room of group g3 (worlds VII, VIII, IX): run each scene script, render far/mid/fore at 2x one at a
# time, make the far layer opaque, compose the previews at true scale, then the three world sheets.
# Rooms use scenes/materials_v2.js (shared stone weathering; trees via battle_kit_g3 treeV2 when materials_v2.READY exists).
# Usage: sh scenes/rebuild_g3.sh            (all twelve rooms)
#        sh scenes/rebuild_g3.sh barrow_mound rime_boss ...   (only these rooms, then the sheets)
cd "$(dirname "$0")/.."
B=scenes/build_battle_g3.sh
ROOMS="VII:fleet_ice:ice_eel,walrus_brute,frost_selkie
VII:fleet_deck:frozen_whaler,drowned_deckhand,rime_gulls
VII:fleet_hold:drowned_deckhand,ice_eel,ice_wed_captain
VII:fleet_boss:frozen_whaler@1720,leviathan_in_the_ice@2470
VIII:rime_crevasse:magma_hound,steam_wraith,fissure_worm
VIII:rime_glacier:rimeburnt_thrall,fissure_worm,twinflame_seeress
VIII:rime_hall:obsidian_shieldmaiden,steam_wraith,jotun_thane
VIII:rime_boss:obsidian_shieldmaiden@1720,riven_jarl@2470
IX:barrow_hall:barrow_draugr,mould_wight,barrow_thane
IX:barrow_mound:plague_wolf,frostbitten_leper,barrow_draugr
IX:barrow_tomb:mould_wight,grave_worm,rot_witch
IX:barrow_boss:barrow_draugr@1720,barrow_king@2470"
FAIL=""
for e in $ROOMS; do
  W=${e%%:*}; rest=${e#*:}; R=${rest%%:*}; F=${rest#*:}
  if [ $# -gt 0 ]; then case " $* " in *" $R "*) ;; *) continue;; esac; fi
  echo "== $W $R"
  # Chromium can crash under memory pressure on the largest far layers: retry once
  sh $B $W $R scenes/bg_$R.js $F 2>&1 | tail -1 | grep -q '^preview' || { echo "   retry $R"; sh $B $W $R scenes/bg_$R.js $F 2>&1 | tail -1 | grep -q '^preview' || FAIL="$FAIL $R"; }
done
for W in VII VIII IX; do
  D=out/scenes/battle/$W
  case $W in
    VII) RS="fleet_ice fleet_deck fleet_hold fleet_boss"; T="World VII, the Icebound Fleet";;
    VIII) RS="rime_crevasse rime_glacier rime_hall rime_boss"; T="World VIII, the Sundered Rime";;
    IX) RS="barrow_hall barrow_mound barrow_tomb barrow_boss"; T="World IX, the Hollow Barrow";;
  esac
  A=""; for r in $RS; do A="$A $D/${r}_preview.png"; done
  python3 scenes/battle_preview_g3.py sheet $D/world_${W}_rooms.png "$T" $A
done
if [ -n "$FAIL" ]; then echo "FAILED:$FAIL"; exit 1; fi
echo "g3 rebuild done"
