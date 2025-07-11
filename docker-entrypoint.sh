#!/bin/sh
set -e

echo "📦 Running Prisma migrations…"
npx prisma migrate deploy

# Optional: seed the database if SEED_DB=true
if [ "$SEED_DB" = "true" ]; then
  echo "🌱 Seeding database…"
  npx prisma db seed
fi

echo "🚀 Starting application…"
exec "$@"     # runs the CMD from the Dockerfile
