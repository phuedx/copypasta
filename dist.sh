#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "==> Packaging app..."
npm run dist:prod

cd dist

echo "==> Compressing and signing packages..."
for package in *; do
  echo "===> $package..."

  archive_file="${package}.tar.gz"

  tar -cz --options gzip:compression-level=9 -f "$archive_file" "$package"

  gpg --detach-sig --output "${archive_file}.sig" "$archive_file"
done

cd .. # cd dist
