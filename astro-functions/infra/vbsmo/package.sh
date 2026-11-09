#!/bin/sh
# Run from the repository root. Requires Bun and zip; no cloud credentials.
set -eu

bun run --cwd functions/api build
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT HUP INT TERM
mkdir -p "$stage/apps/web" "$stage/functions/api" .build
cp package.json bun.lock .vbsmo.json "$stage/"
cp apps/web/package.json "$stage/apps/web/"
cp functions/api/package.json "$stage/functions/api/"
cp -R functions/api/dist "$stage/functions/api/"
(
  cd "$stage"
  bun install --frozen-lockfile --production --ignore-scripts --linker hoisted --filter './functions/api'
  zip -q -r function.zip . -x 'node_modules/.bin/*' 'node_modules/@vbsmo/api/*'
)
mv "$stage/function.zip" .build/function.zip
