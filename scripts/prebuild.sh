#!/bin/bash
# Ensure SQLite WAL files exist for the standalone build copy
set -e
DB_DIR="data/db"
mkdir -p "${DB_DIR}"
for f in data.sqlite-shm data.sqlite-wal; do
  if [ ! -f "${DB_DIR}/${f}" ]; then
    touch "${DB_DIR}/${f}"
  fi
done
