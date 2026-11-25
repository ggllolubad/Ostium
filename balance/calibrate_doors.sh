#!/bin/bash
# Per-door calibration: a single foe multiplier cannot hit ~50% everywhere (door 1 collapses while doors 9 and 13
# stay at 100%), so each door gets its own points. POINTS="door:hp_mult:might ..." run two at a time.
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-12}
O=${OUTDIR:-balance/runs_door}; mkdir -p $O
P3=bulwark,duelist,elementalist
one() { IFS=: read d f m <<< "$1"
  $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+11)) party=$P3 rules='{}' foe=$f might=$m out=$O/D${d}_f${f}_m${m}_d$d.jsonl >/dev/null 2>&1; echo "$1 done"; }
set -- ${POINTS:-1:1.25:0 5:1.75:1 9:2.75:2 13:2.75:2 9:3.5:3 13:3.5:3 9:4.5:4 13:4.5:4}
while [ $# -gt 0 ]; do one $1 & [ -n "$2" ] && one $2 & wait; shift 2; done
echo ALL DONE
