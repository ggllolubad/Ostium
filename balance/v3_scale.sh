#!/bin/bash
# Gate 3: search the content HP scale. Six companies (all 18 archetypes), tiers 0, 6, 12, random worlds.
cd "$(dirname "$0")/.."
G=${GODOT:-/home/claude/godot/Godot_v4.3-stable_linux.x86_64}
N=${N:-6}; O=${OUTDIR:-balance/runs_v3scale}; mkdir -p $O
P=(bulwark:last_bastion,duelist:bladedancer,elementalist:catalyst bulwark:ironwarden,oracle:fatebinder,hexweaver:doomsayer bulwark:thornguard,alchemist:plaguewright,oracle:augur duelist:executioner,hexweaver:pactbound,alchemist:apothecary duelist:bloodletter,elementalist:accumulator,oracle:chronomancer bulwark:last_bastion,elementalist:prismatic,hexweaver:mirrorhex)
run() { local sc=$1; for i in 0 1 2 3 4 5; do for d in 1 7 13; do $G --headless --path . --script res://balance/descent.gd -- door=$d runs=$N seed=$((d*1000+i*97+11)) builds=${P[$i]} world=random rules="{\"hp_scale\":$sc}" out=$O/S${sc}_P${i}_d$d.jsonl >/dev/null 2>&1; done; done; echo "scale $sc done"; }
for sc in ${SCALES:-0.45 0.55 0.65}; do run $sc & done; wait
echo ALL DONE
