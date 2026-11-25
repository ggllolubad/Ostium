#!/bin/bash
# Build viability: companies whose heroes draft toward a plan, with Threat on and random worlds.
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-16}; O=${OUTDIR:-balance/runs_builds}; mkdir -p $O
one() { $G --headless --path . --script res://balance/descent.gd -- door=$1 runs=$N seed=$(($1*1000+57)) builds=$2 world=random out=$O/$3_d$1.jsonl >/dev/null 2>&1; echo "$3 d$1 done"; }
for d in 1 7 13; do
  one $d thorn_wall,tempo_blade,grand_curse A & one $d iron_juggernaut,bloodletter,death_ledger B & wait
  one $d storm_soaker,storm_caller,thorn_wall C & wait
done
echo ALL DONE
