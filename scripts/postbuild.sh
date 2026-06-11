#!/bin/bash
# Fix the standalone static symlink after rebuild
# The rebuild destroys the symlink; this recreates it unconditionally.
# Also copies proxy/middleware manifest files (REQUIRED for proxy registration in production)
set -e

STANDALONE_DIR=".next/standalone"
MAIN_STATIC=".next/static"
STANDALONE_STATIC="${STANDALONE_DIR}/.next/static"

if [ -d "${STANDALONE_DIR}" ]; then
  # Remove stale symlink or directory if present
  if [ -L "${STANDALONE_STATIC}" ] || [ -d "${STANDALONE_STATIC}" ]; then
    rm -rf "${STANDALONE_STATIC}"
  fi
  ln -sf "$(pwd)/${MAIN_STATIC}" "$(pwd)/${STANDALONE_STATIC}"
  echo "Created symlink: ${STANDALONE_STATIC} -> $(pwd)/${MAIN_STATIC}"
fi

# Copy proxy/middleware manifest files to standalone (REQUIRED for proxy registration)
# Next.js 16 uses .next/server/middleware/ subdirectory for the manifest
mkdir -p "${STANDALONE_DIR}/.next/server/middleware" 2>/dev/null || true

# Next.js 16 (Turbopack) — proxy manifest at .next/server/middleware/
if [ -f ".next/server/middleware/middleware-manifest.json" ]; then
  cp .next/server/middleware/middleware-manifest.json "${STANDALONE_DIR}/.next/server/middleware/middleware-manifest.json"
  echo "Copied Next.js 16 proxy manifest (middleware/ subdirectory)"
fi

# Legacy / webpack — middleware manifest at .next/server/ root
if [ -f ".next/server/middleware-manifest.json" ]; then
  cp .next/server/middleware-manifest.json "${STANDALONE_DIR}/.next/server/middleware-manifest.json" 2>/dev/null || true
  cp .next/server/middleware-build-manifest.js "${STANDALONE_DIR}/.next/server/middleware-build-manifest.js" 2>/dev/null || true
  cp .next/server/middleware.js "${STANDALONE_DIR}/.next/server/middleware.js" 2>/dev/null || true
  echo "Copied legacy middleware manifest files to standalone"
fi

# Also copy proxy manifest if present
if [ -f ".next/server/proxy-manifest.json" ]; then
  mkdir -p "${STANDALONE_DIR}/.next/server/proxy" 2>/dev/null || true
  cp .next/server/proxy-manifest.json "${STANDALONE_DIR}/.next/server/proxy/proxy-manifest.json" 2>/dev/null || true
  echo "Copied proxy manifest to standalone"
fi

# Copy edge chunks (required for proxy runtime)
if [ -d ".next/server/edge/chunks" ]; then
  mkdir -p "${STANDALONE_DIR}/.next/server/edge/chunks"
  cp -r .next/server/edge/chunks/* "${STANDALONE_DIR}/.next/server/edge/chunks/" 2>/dev/null || true
  echo "Copied edge chunks to standalone"
fi

echo "Post-build complete"
