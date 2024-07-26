#!/bin/sh

# This is the entry point for Docker container
# to run the DB migrations before starting the app

# Ensure the data directory exists. This is where the SQLite database will be stored
mkdir -p /app/data

# Run database migrations
/app/node_modules/prisma/build/index.js migrate deploy --schema /app/packages/prisma/src/schema.prisma

# Run the seed script
node /app/packages/prisma/seed.mjs

# Start the application
exec "$@"
