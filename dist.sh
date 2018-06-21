#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd "${__dirname}/dist"

echo "==> Cleaning up..."

rm ./*.tar.gz* >/dev/null 2>&1 # Remove all archives and signatures.

echo "==> Packaging..."

npm run dist:prod

echo "==> Compressing and signing packages..."

for package in *; do
  echo "===> ${package}..."

  archive_file="${package}.tar.gz"

  tar -cz --options gzip:compression-level=9 -f "${archive_file}" "${package}"
  gpg --detach-sig --output "${archive_file}.sig" "${archive_file}"
done

popd >/dev/null 2>&1 # pushd ${__dirname}
