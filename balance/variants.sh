#!/bin/bash
# Rules v2 variants rerun under Threat (random worlds), progress tiers 0, 6 and 12.
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-20}; O=${OUTDIR:-balance/runs_variants}; mkdir -p $O
P3=bulwark,duelist,elementalist; P2=bulwark,duelist; P4=bulwark,duelist,elementalist,alchemist
run() { for d in 1 7 13; do $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+71)) party=$2 world=random rules="$3" out=$O/$1_d$d.jsonl >/dev/null 2>&1; done; echo "$1 done"; }
run A_base_3h $P3 '{}' & run B_base_2h $P2 '{}' & wait
run C_base_4h $P4 '{}' & run D_flat_2h $P2 '{"vigour_per":1,"vigour_flat":3}' & wait
run D_flat_4h $P4 '{"vigour_per":1,"vigour_flat":3}' & run D_flat_3h $P3 '{"vigour_per":1,"vigour_flat":3}' & wait
run E_draw3 $P3 '{"draw":3}' & run F_draw5 $P3 '{"draw":5}' & wait
run G_az_old $P3 '{"az_v2":false}' & run I_hex_off $P3 '{"hex":false}' & wait
run H_drown60 $P3 '{"drown_cap":60}' & run J_virtue_old $P3 '{"virtues":false}' & wait
echo ALL DONE
