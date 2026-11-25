#!/bin/bash
# Gate 3 content: six companies covering all 18 path archetypes, at progress tiers 0, 6 and 12 (random worlds).
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-10}; O=${OUTDIR:-balance/runs_v3}; mkdir -p $O
declare -A P=(
 [A]=bulwark:last_bastion,duelist:bladedancer,elementalist:catalyst
 [B]=bulwark:ironwarden,oracle:fatebinder,hexweaver:doomsayer
 [C]=bulwark:thornguard,alchemist:plaguewright,oracle:augur
 [D]=duelist:executioner,hexweaver:pactbound,alchemist:apothecary
 [E]=duelist:bloodletter,elementalist:accumulator,oracle:chronomancer
 [F]=bulwark:thornguard,elementalist:prismatic,alchemist:transmuter
 [G]=duelist:bladedancer,hexweaver:mirrorhex,oracle:augur
)
run() { for d in 1 7 13; do $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+31)) builds=${P[$1]} world=random ${EXTRA} out=$O/$1_d$d.jsonl >/dev/null 2>&1; done; echo "$1 done"; }
run A & run B & run C & wait
run D & run E & run F & wait
run G & wait
echo ALL DONE
