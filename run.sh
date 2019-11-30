#!/usr/bin/env bash

if [ -x "$(command -v chromium)" ]; then
  chromium -allow-file-access-from-files WebGL.html
elif [ -x "$(command -v chromium-browser)" ]; then
  chromium-browser -allow-file-access-from-files WebGL.html
else
  echo 'Error: could not found chromium in your system...' >&2
  exit 1
fi
