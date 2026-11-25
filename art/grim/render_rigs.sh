#!/bin/bash
# renders every rig layer svg in grim/rig to png at 2x, plus a composite preview
cd /home/claude/ostium-art
args=""
for f in grim/rig/*.svg; do args="$args $f ${f%.svg}.png"; done
node render.js $args --scale 2 > /dev/null
