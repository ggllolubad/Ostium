#!/bin/bash
# Rules v2 experiments: each config x doors 1,5,9,13 x N descents. Two at a time (2 cores).
cd "$(dirname "$0")/.."
G=/home/claude/godot/Godot_v4.3-stable_linux.x86_64
N=${N:-15}
O=balance/runs
P3=bulwark,duelist,elementalist; P2=bulwark,duelist; P4=bulwark,duelist,elementalist,alchemist
run() { # name party rules
  for d in 1 5 9 13; do
    $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000)) party=$2 rules="$3" out=$O/$1_d$d.jsonl >/dev/null 2>&1
  done; echo "$1 done"; }
run A_v2_3h $P3 '{}' & run B_v2_2h $P2 '{}' & wait
run C_v2_4h $P4 '{}' & run D_flat_2h $P2 '{"vigour_per":1,"vigour_flat":3}' & wait
run D_flat_3h $P3 '{"vigour_per":1,"vigour_flat":3}' & run D_flat_4h $P4 '{"vigour_per":1,"vigour_flat":3}' & wait
run E_draw3 $P3 '{"draw":3}' & run F_draw5 $P3 '{"draw":5}' & wait
run G_az_old $P3 '{"az_v2":false}' & run H_drown60 $P3 '{"drown_cap":60}' & wait
run I_hex_off $P3 '{"hex":false}' & run J_virtue_old $P3 '{"virtues":false}' & wait
echo ALL DONE
