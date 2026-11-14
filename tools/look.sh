#!/bin/bash
# Quick review montage (bigger tiles than preview.jpg): tools/look.sh <slug> <times> [cols]
# Writes $SCRATCH/look-<slug>.jpg  (not committed)
slug=$1; times=$2; cols=${3:-4}; out=${SCRATCH:-/tmp}/look-$slug.jpg
rm -rf videos/$slug/.preview
node tools/render.js $slug --preview $times >/dev/null || exit 1
n=$(ls videos/$slug/.preview/p*.jpg | wc -l)
ffmpeg -y -loglevel error -i videos/$slug/.preview/p%02d.jpg -vf "scale=405:720,tile=${cols}x$(( (n+cols-1)/cols ))" -frames:v 1 $out
echo $out
