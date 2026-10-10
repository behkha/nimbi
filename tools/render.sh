#!/bin/sh
# Renders the pages from make-icons.mjs into PNGs with headless Chrome.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
shot() { # page width height output [transparent]
  bg=""
  [ "$5" = "transparent" ] && bg="--default-background-color=00000000"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 $bg \
    --virtual-time-budget=4000 --window-size="$2,$3" --screenshot="$4" "file://$PWD/tools/build/$1" >/dev/null 2>&1
  echo "rendered $4"
}
shot icon-180.html 180 180 public/apple-touch-icon.png
shot icon-192.html 192 192 public/icon-192.png
shot icon-512.html 512 512 public/icon-512.png
shot favicon-32.html 32 32 public/favicon-32.png transparent
shot og.html 1200 630 public/og.png
