#!/bin/bash
# Finds the foe HP multiplier (and Might) that puts the 3-hero Rules v2 baseline near a 50% clear rate.
cd "$(dirname "$0")/.."
G=/home/claude/godot/Godot_v4.3-stable_linux.x86_64
N=${N:-12}
O=balance/runs_cal; mkdir -p $O
P3=bulwark,duelist,elementalist
run() { # name foe might
  for d in 1 5 9 13; do
    $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+7)) party=$P3 rules='{}' foe=$2 might=$3 out=$O/$1_d$d.jsonl >/dev/null 2>&1
  done; echo "$1 done"; }
run K_f150_m0 1.5 0 & run K_f175_m1 1.75 1 & wait
run K_f200_m1 2.0 1 & run K_f225_m2 2.25 2 & wait
echo ALL DONE
