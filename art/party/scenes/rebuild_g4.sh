#!/bin/sh
# Rebuild every battle room of worlds X, XI, XII (group g4) in one go: each room's layers (far/mid/fore SVG + 2x PNG),
# the opaque far, the preview (+ _preview_1x), then the three world sheets. Rooms render one at a time (2 shared CPUs).
# Usage: sh scenes/rebuild_g4.sh            (all 12 rooms)
#        sh scenes/rebuild_g4.sh X          (one world: X, XI or XII)
set -e
cd "$(dirname "$0")/.."
ONLY=$1
room() { W=$1; [ -n "$ONLY" ] && [ "$ONLY" != "$W" ] && return 0; echo "== $W $2"; sh scenes/build_battle_g4.sh "$@" | tail -1; }
room X hive_spires scenes/bg_hive_spires.js spire_wasps,puppet_host,mantis_duelist
room X hive_comb scenes/bg_hive_comb.js hive_drone,puppet_host,galvanic_beetle
room X hive_brood scenes/bg_hive_brood.js venom_spider,brood_mother
room X hive_boss scenes/bg_hive_boss.js spire_wasps boss=hive_queen
room XI spire_orrery scenes/bg_spire_orrery.js stopped_pilgrim,gear_spider,clock_sentry
room XI spire_stair scenes/bg_spire_stair.js clock_sentry,frozen_halberdier,horologist
room XI spire_top scenes/bg_spire_top.js aurora_moth,stopped_pilgrim,rime_colossus
room XI spire_boss scenes/bg_spire_boss.js clock_sentry boss=the_last_hour
room XII silence_tundra scenes/bg_silence_tundra.js hollow_wanderer,silence_stag,pale_hunter
room XII silence_shrine scenes/bg_silence_shrine.js frozen_saint,starless_eye,frozen_saint
room XII silence_rift scenes/bg_silence_rift.js rime_shade,starless_eye,void_mammoth
room XII silence_boss scenes/bg_silence_boss.js frozen_saint boss=cold_star_noroot
sheet() { W=$1; T=$2; shift 2; [ -n "$ONLY" ] && [ "$ONLY" != "$W" ] && return 0; D=out/scenes/battle/$W; A=""; for r in "$@"; do A="$A $D/${r}_preview.png"; done; python3 scenes/battle_preview_g4.py sheet $D/world_${W}_rooms.png "$T" $A; }
sheet X "World X, the Venom Spires: hive_spires, hive_comb, hive_brood, hive_boss (The Hive Queen)" hive_spires hive_comb hive_brood hive_boss
sheet XI "World XI, the Stilled Spire: spire_orrery, spire_stair, spire_top, spire_boss (The Last Hour)" spire_orrery spire_stair spire_top spire_boss
sheet XII "World XII, the White Silence: silence_tundra, silence_shrine, silence_rift, silence_boss (The Cold Star)" silence_tundra silence_shrine silence_rift silence_boss
