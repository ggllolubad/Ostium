#!/bin/bash
# Company-size scaling check: 2, 3 and 4 heroes at progress tiers 0, 6 and 12 (random worlds).
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-20}; O=${OUTDIR:-balance/runs_party}; mkdir -p $O
P3=bulwark,duelist,elementalist; P2=bulwark,duelist; P4=bulwark,duelist,elementalist,alchemist; P2b=elementalist,oracle; P4b=duelist,elementalist,oracle,hexweaver
run() { for d in 1 7 13; do $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+73)) party=$2 world=random rules="${3:-{\}}" out=$O/$1_d$d.jsonl >/dev/null 2>&1; done; echo "$1 done"; }
run P2 $P2 & run P2b $P2b & run P3 $P3 & wait
run P4 $P4 & run P4b $P4b & wait
echo ALL DONE
