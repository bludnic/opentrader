#!/bin/sh

# This is the entry point for Docker container
# to run the DB migrations before starting the app

# Ensure the mounted volume directory exists
mkdir -p /data/opentrader
chmod 755 /data/opentrader

# Run database migrations
/app/node_modules/prisma/build/index.js migrate deploy --schema /app/packages/prisma/src/schema.prisma

# Run the seed script
node /app/packages/prisma/seed.mjs

# Start the application
exec "$@"
