#!/bin/bash
# Which part of the reference company makes late doors trivial? Door 13 at 2.5x HP +8 Might, one factor at a time.
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-12}; O=balance/runs_ablate; mkdir -p $O
P3=bulwark,duelist,elementalist
one() { $G --headless --path . --script res://balance/descent.gd -- door=$1 runs=$N seed=$(($1*1000+23)) party=$P3 foe=$2 might=$3 ref="$4" out=$O/$5_d$1.jsonl >/dev/null 2>&1; echo "$5 done"; }
one 13 2.5 8 '[1,["C"],0,0]' A_lv1 & one 13 2.5 8 '[9,["C"],0,0]' B_lv9 & wait
one 13 2.5 8 '[1,["R"],3,0]' C_gearR & one 13 2.5 8 '[1,["C"],0,2]' D_relic2 & wait
one 13 1.25 0 '[1,["C"],0,0]' E_lv1_base & one 9 1.25 0 '[1,["C"],0,0]' F_lv1_base & wait
echo ALL DONE
