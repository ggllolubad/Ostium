#!/bin/bash
# Per-door calibration: a single foe multiplier cannot hit ~50% everywhere (door 1 collapses while doors 9 and 13
# stay at 100%), so each door gets its own sweep. 3-hero company, Rules v2 defaults.
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-12}
O=balance/runs_door; mkdir -p $O
P3=bulwark,duelist,elementalist
one() { # door foe might
  $G --headless --path . --script res://balance/descent.gd -- door=$1 runs=$N seed=$(($1*1000+11)) party=$P3 rules='{}' foe=$2 might=$3 out=$O/D${1}_f${2}_m${3}_d$1.jsonl >/dev/null 2>&1; echo "door $1 foe $2 might $3 done"; }
one 1 1.25 0 & one 5 1.75 1 & wait
one 9 2.75 2 & one 13 2.75 2 & wait
one 9 3.5 3 & one 13 3.5 3 & wait
one 9 4.5 4 & one 13 4.5 4 & wait
echo ALL DONE
