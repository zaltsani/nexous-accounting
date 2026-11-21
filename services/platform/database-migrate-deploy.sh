#!/bin/sh
set -e

# Store root working directory (/app)
ROOT_DIR="$(pwd)"

echo "==> Executing Prisma database migrations..."

# Change working directory to packages/database
cd packages/database/system

# Run migrate deploy
npx prisma migrate deploy

# Return back to original root working directory (/app)
cd "$ROOT_DIR"

echo "==> Database migrations applied successfully."

# Hand off control to the primary container CMD (node apps/api/dist/main)
if [ $# -gt 0 ]; then
  exec "$@"
fi