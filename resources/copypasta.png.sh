#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

node -e "\
  const { writeFileSync } = require('fs');\
  const feather = require('feather-icons');\
  \
  writeFileSync('${__dirname}/copypasta.svg', feather.icons.clipboard.toSvg({\
    width: 18, height: 18,\
    color: 'white'\
  }));"

# Equivalent to
#
#   rsvg-convert --format=png --output="${__dirname}/copypasta.png" "${__dirname}/copypasta.svg"
rsvg-convert "${__dirname}/copypasta.svg" > "${__dirname}/copypasta.png"

rm "${__dirname}/copypasta.svg"