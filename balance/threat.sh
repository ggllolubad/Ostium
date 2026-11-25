#!/bin/bash
# Threat calibration: progress tier (descents cleared = door-1) with random worlds. POINTS="door:foe:dmg ..."
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-16}; O=${OUTDIR:-balance/runs_threat}; mkdir -p $O
P3=bulwark,duelist,elementalist
one() { IFS=: read d f x <<< "$1"
  $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+31)) party=$P3 world=random foe=$f dmg=$x out=$O/T${d}_f${f}_x${x}_d$d.jsonl >/dev/null 2>&1; echo "$1 done"; }
set -- ${POINTS:-1:1:1 4:1:1 7:1:1 10:1:1 13:1:1 15:1:1}
while [ $# -gt 0 ]; do one $1 & [ -n "$2" ] && one $2 & wait; shift 2; done
echo ALL DONE
