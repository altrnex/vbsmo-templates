#!/bin/sh
# Run from the repository root. Build Linux/x86_64 wheels without cloud credentials.
set -eu
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT HUP INT TERM
mkdir -p .build
# Include Python subpackages and data files, not local environments, caches or secrets.
tar -C functions/api --exclude='.venv' --exclude='__pycache__' --exclude='.ruff_cache' \
  --exclude='.secrets' --exclude='.env*' --exclude='.git' --exclude='node_modules' \
  --exclude='test_*.py' --exclude='package.json' -cf - . | tar -C "$stage" -xf -
cp .vbsmo.json "$stage/"
uv pip install --python-version 3.14 --python-platform x86_64-manylinux_2_28 \
  --only-binary :all: --require-hashes --no-compile-bytecode \
  --target "$stage" -r functions/api/requirements.txt
(
  cd "$stage"
  zip -q -r function.zip . -x 'bin/*' '*/__pycache__/*'
)
mv "$stage/function.zip" .build/function.zip
